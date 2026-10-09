import {
  PlayerStats,
  Boss,
  LinhCanElement,
  Manual,
  Pill,
  Ore,
  BeastEgg
} from '@/lib/types';
import { getElementalCombatModifier, getManualSynergy } from '@/lib/elemental-system';
import { calculateCombatPower } from './stats';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { calculateCombatStats } from '@/lib/destiny-data';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';
import { PILL_TEMPLATES, DEFAULT_ORES } from '@/lib/alchemy-data';
import { createRandomEgg } from '@/lib/beast-data';
import { processCombatTalismans } from '@/lib/talisman-logic';
import { processSpiritCombatTrigger } from '@/lib/natal-artifact-logic';
import { checkAndConsumeAncestralDeathWard } from '@/lib/ancestral-blessing-logic';
import { processCombatDivineAbilities } from '@/lib/divine-abilities-logic';
import {
  detectActiveDomainResonances,
  resolveResonanceTurnEffects,
  calculateDomainResonanceBonuses,
  getPlayerEquippedManualList
} from '@/lib/domain-resonance-logic';
import { ActiveDomainResonance } from '@/lib/types/domain-resonance';
import { aggregateEquipmentInscriptions } from '@/lib/formation-inscription-logic';
import { Equipment } from '@/lib/types/items';
import { getSpiritDialogue } from '@/lib/soul-infusion-logic';
import { InfusedSoulMetadata } from '@/lib/types/soul-infusion';
import { FORMATION_SETS_REGISTRY } from '@/lib/weapon-tribulation-array-logic';
import {
  FormationSetCategory,
  FormationSetConfig,
  PlayerFormationSetProgress,
  LightningTemperedMetadata
} from '@/lib/types/weapon-tribulation-array';

// BOSS BATTLE & ELEMENTAL RESOLVER
// ============================================

export function getBossElement(boss: Boss): LinhCanElement {
  if (boss.element) return boss.element;
  const n = (boss.name + ' ' + boss.description).toLowerCase();
  if (n.includes('hỏa') || n.includes('viêm') || n.includes('diễm') || n.includes('xích')) return 'hoa';
  if (n.includes('lôi') || n.includes('điện') || n.includes('tiêu')) return 'loi';
  if (n.includes('thủy') || n.includes('mãng') || n.includes('xà') || n.includes('giao')) return 'thuy';
  if (n.includes('băng') || n.includes('hàn') || n.includes('tuyết')) return 'bang';
  if (n.includes('kim') || n.includes('thiết') || n.includes('kiếm') || n.includes('đao') || n.includes('hổ')) return 'kim';
  if (n.includes('phong') || n.includes('lang') || n.includes('ưng') || n.includes('điểu')) return 'phong';
  if (n.includes('mộc') || n.includes('thảo') || n.includes('trúc') || n.includes('độc')) return 'moc';
  if (n.includes('thổ') || n.includes('sơn') || n.includes('nham') || n.includes('cự')) return 'tho';
  if (n.includes('minh') || n.includes('u') || n.includes('quỷ') || n.includes('ma') || n.includes('ám') || n.includes('cốt')) return 'am';
  if (n.includes('quang') || n.includes('tiên') || n.includes('thánh') || n.includes('thần')) return 'quang';
  
  const cycle: LinhCanElement[] = ['kim', 'moc', 'thuy', 'hoa', 'tho', 'loi', 'phong'];
  return cycle[boss.realm % cycle.length];
}

export interface BattleResult {
  victory: boolean;
  rewards?: {
    tuVi: number;
    linhThach: number;
    danhVong: number;
    specialItems?: string[];
  };
  penalties?: {
    tuVi: number;
    linhThach: number;
    khiVan?: number;
  };
  droppedManual?: Manual;
  droppedPill?: Pill;
  droppedOre?: Ore;
  droppedBeastEgg?: BeastEgg;
  tinhHuyetDrop?: number;
  message: string;
  flavorText: string;
  elementalReport?: {
    playerElement: LinhCanElement;
    bossElement: LinhCanElement;
    relation: string;
    description: string;
  };
  usedSkillReport?: {
    skillName: string;
    damageMultiplier: number;
    mpCost: number;
    shieldPercent?: number;
  };
  beastReport?: {
    beastName: string;
    avatar: string;
    blockedDmgPercent: number;
    hoChuChiTuTriggered: boolean;
    shieldValue: number;
  };
  doubleAction?: boolean;
  naturalEvasion?: boolean;
  activeResonances?: ActiveDomainResonance[];
  resonanceReport?: {
    activeResonances: ActiveDomainResonance[];
    combatEvents: string[];
  };
  hasTriggeredBatQuaiShield?: boolean;
  phongNhanTriggered?: boolean;
  vampiricHealedHp?: number;
  hasTriggeredSpiritGuardian?: boolean;
  spiritFearStunned?: boolean;
  spiritBurnDamage?: number;
  spiritGuardianLog?: string;
  formationArrayTriggered?: boolean;
  formationSwarmDamage?: number;
  formationUltTriggered?: boolean;
  formationUltDamage?: number;
  lightningTemperTriggered?: boolean;
  lightningDamageBonus?: number;
  lightningParalysisTriggered?: boolean;
}

export function battleBoss(
  player: PlayerStats,
  boss: Boss,
  usedSkillManualId?: string
): BattleResult {
  const bossElem = getBossElement(boss);
  const playerElem = player.linhCan?.element || 'ngu_hanh';
  const elementalMod = getElementalCombatModifier(playerElem, bossElem);

  // Use real calibrated combat power
  const playerCombatPower = calculateCombatPower(player);
  const luckBonus = (Math.random() * player.khiVan * 2) / 100; // 0% - 200% luck factor

  let skillDamageMultiplier = 1.0;
  let skillShieldPercent = 0;
  let usedSkillReport: BattleResult['usedSkillReport'] = undefined;

  const compBuffs = getBondedCompanionBuffs(player);

  // Active Skill Thần Thông if triggered
  if (usedSkillManualId && player.manuals) {
    const skillManual = player.manuals.find(m => m.id === usedSkillManualId && m.level > 0);
    if (skillManual?.activeSkill) {
      const isEquipped = player.equippedManuals && (
        player.equippedManuals.thanThong1 === skillManual.id ||
        player.equippedManuals.thanThong2 === skillManual.id ||
        player.equippedManuals.tamPhap === skillManual.id ||
        player.equippedManuals.theThuat === skillManual.id
      );
      const synergy = getManualSynergy(skillManual, player.linhCan);
      const synergyMul = (isEquipped && synergy.isSynergy) ? 1.5 : 1.0;

      skillDamageMultiplier = (skillManual.activeSkill.damageMultiplier || 1.0) * synergyMul;
      if (compBuffs.swordManualBonusPercent && (skillManual.name.toLowerCase().includes('kiếm') || skillManual.id.includes('kiem'))) {
        skillDamageMultiplier *= (1 + compBuffs.swordManualBonusPercent / 100);
      }
      skillShieldPercent = (skillManual.activeSkill.shieldPercent || 0) * synergyMul;

      usedSkillReport = {
        skillName: skillManual.activeSkill.name,
        damageMultiplier: skillDamageMultiplier,
        mpCost: skillManual.activeSkill.mpCost,
        shieldPercent: skillShieldPercent
      };
    }
  }

  // Cửu U Minh Thể: Ăn mòn 30% phòng ngự của Boss
  const bossDefenseMod = (player.physique?.poisonArmorPen) ? (1 - player.physique.poisonArmorPen / 100) : 1.0;

  // Tính toán hệ thống chỉ số chiến đấu mở rộng
  const cStats = calculateCombatStats(player);
  const isCrit = Math.random() * 100 < cStats.critRate;
  const critMod = isCrit ? (cStats.critDmg / 100) : 1.0;

  // 1. Thần Thức Áp Chế Trong Combat (Soul Suppression Engine)
  const playerThanThuc = player.thanThuc || cStats.soul || 10;
  const bossThanThuc = (boss as any).thanThuc || Math.max(10, boss.realm * 25 + 35);
  const suppressionRatio = playerThanThuc / Math.max(1, bossThanThuc);

  let soulSuppressionText = '';
  let soulSuppressionBonus = 1.0;
  let effectiveBossSpeed = boss.stats?.speed ?? (boss as any).speed ?? 100;
  let effectivePlayerSpeed = cStats.speed;
  let bossStunnedTurn1 = false;

  if (suppressionRatio >= 1.3) {
    // Thần thức cao hơn đối thủ 30% trở lên
    effectiveBossSpeed = Math.floor(effectiveBossSpeed * 0.85); // Giảm 15% tốc độ đối thủ
    bossStunnedTurn1 = Math.random() < 0.20; // 20% tỷ lệ Chấn Nhiếp mất lượt đầu
    soulSuppressionBonus = bossStunnedTurn1 ? 1.30 : 1.15;
    soulSuppressionText = ` [⚡ Uy áp thần thức cuồn cuộn áp chế! ${boss.name} thần hồn chao đảo, tốc độ giảm 15%!${bossStunnedTurn1 ? ` 💫 ${boss.name} bị chấn nhiếp, mất lượt đánh đầu tiên!` : ''}]`;
  } else if (suppressionRatio <= 0.7) {
    // Thần thức thấp hơn đối thủ 30% trở lên -> Bị áp chế ngược
    effectivePlayerSpeed = Math.floor(effectivePlayerSpeed * 0.90); // Giảm 10% tốc độ người chơi
    soulSuppressionBonus = 0.90;
    soulSuppressionText = ` [⚠️ ${boss.name} uy áp thần thức kinh người! Thần hồn ngươi chấn động, tốc độ giảm 10%!]`;
  }

  // 2. Hàn Băng Tê Liệt (Slow Attack Speed từ Hợp Kim)
  let alloySlowText = '';
  if (cStats.slowSpeedPercent && cStats.slowSpeedPercent > 0) {
    const slowRate = cStats.slowSpeedPercent > 1 ? cStats.slowSpeedPercent / 100 : cStats.slowSpeedPercent;
    const speedReduction = Math.round(effectiveBossSpeed * slowRate);
    effectiveBossSpeed = Math.max(1, effectiveBossSpeed - speedReduction);
    alloySlowText = ` [❄️ HÀN BĂNG TÊ LIỆT: Hàn khí thấu xương làm chậm ${Math.round(slowRate * 100)}% tốc độ xuất chiêu của đối thủ (còn ${effectiveBossSpeed})!]`;
  }

  // 3. Cơ Chế Thân Pháp & Nhịp Độ Chiến Đấu (Action Gauge & Evasion)
  const speedRatio = effectivePlayerSpeed / Math.max(1, effectiveBossSpeed);
  const speedAdvantage = effectivePlayerSpeed >= effectiveBossSpeed ? 1.15 : 0.95;

  // Cơ chế Đòn Kép (Double Action / Liên Kích):
  // Nếu Tốc Độ nhân vật >= 1.5 * Tốc Độ đối thủ: 35% tỷ lệ tung liên tiếp 2 đòn đánh trong cùng 1 lượt
  let doubleActionTriggered = false;
  let doubleActionMultiplier = 1.0;
  let doubleActionText = '';
  if (speedRatio >= 1.5 && Math.random() < 0.35) {
    doubleActionTriggered = true;
    doubleActionMultiplier = 1.50; // Uy lực tăng 50% do tung liên tiếp 2 đòn đánh
    doubleActionText = ` [⚡ THÂN PHÁP TIÊN CƠ • LIÊN KÍCH: Tốc độ x${speedRatio.toFixed(1)} vượt trội! Hóa thân tàn ảnh bồi thêm đòn đánh thứ 2!]`;
  }

  // Chỉ số Né Tránh Tự Nhiên (Natural Evasion):
  // Quy đổi chênh lệch Tốc Độ thành tỷ lệ Né Đòn hoàn toàn (tối đa kẹp biên 25%)
  const speedDiff = Math.max(0, effectivePlayerSpeed - effectiveBossSpeed);
  const naturalEvasionRate = Math.min(25, Math.floor(speedDiff * 0.25));
  const totalEvasionChance = Math.min(45, (cStats.dodgeRate || 5) + naturalEvasionRate);
  const naturalEvasionTriggered = Math.random() * 100 < totalEvasionChance;
  const evasionText = naturalEvasionTriggered
    ? ` [💨 Né Tránh • Huyễn Ảnh: Thân pháp hư ảo như huyễn ảnh, triệt tiêu hoàn toàn công kích đối thủ!]`
    : '';

  let companionAssistTriggered = false;
  if (compBuffs.bossAssistChance && Math.random() * 100 < compBuffs.bossAssistChance) {
    companionAssistTriggered = true;
  }
  const companionPowerBonus = companionAssistTriggered ? 1.35 : 1.0;

  // 4. Tuyệt Kỹ "Thần Niệm Kiếm" (Ngưng Hồn Hóa Kiếm trở lên)
  const soulStageIdx = typeof player.soulCultivation?.currentStageIndex === 'number'
    ? player.soulCultivation.currentStageIndex
    : (typeof player.soulCultivation?.realmIndex === 'number' ? player.soulCultivation.realmIndex : 0);

  let mindBladeDamage = 0;
  let mindBladeText = '';
  if (soulStageIdx >= 1) {
    const isYangSoul = soulStageIdx >= 3;
    const baseMindBlade = Math.floor(playerThanThuc * 1.8 + (soulStageIdx + 1) * 80);
    mindBladeDamage = isYangSoul ? Math.floor(baseMindBlade * 1.25) : baseMindBlade;
    mindBladeText = ` [🗡️ Thần Niệm Kiếm phá không xuất thế! Kiếm khí vô hình xuyên thẳng thức hải đối thủ, gây ${mindBladeDamage.toLocaleString()} sát thương chuẩn!]`;
  }

  // Nhục Thân Miễn Thương (Physical Damage Reduction)
  const dmgReductionMod = 1 - Math.min(60, (cStats.dmgReduction || 0)) / 100;

  // Kiểm tra Linh Thú Hộ Vệ Xuất Chiến (Combat Guardian Mode)
  let beastPowerBonus = 1.0;
  let beastBlockMod = 1.0;
  let beastReport: BattleResult['beastReport'] = undefined;

  if (player.beasts && player.activeBeastId) {
    const activeBeast = player.beasts.find(b => b.id === player.activeBeastId);
    if (activeBeast && activeBeast.role === 'combat') {
      const blockPercent = activeBeast.stats.blockPercent || 25;
      beastBlockMod = 1 - (blockPercent / 100);
      beastPowerBonus = 1 + (activeBeast.stats.atk / 2500);

      const hoChuChiTu = (player.khiHuyet && player.maxKhiHuyet && (player.khiHuyet / player.maxKhiHuyet) < 0.2) || Math.random() < 0.35;
      const shieldValue = hoChuChiTu ? Math.floor(activeBeast.stats.maxHp * 0.30) : 0;

      beastReport = {
        beastName: activeBeast.name,
        avatar: activeBeast.avatar,
        blockedDmgPercent: blockPercent,
        hoChuChiTuTriggered: hoChuChiTu,
        shieldValue
      };
    }
  }

  // Kích hoạt Phù Lục Xuất Chiến từ Phù Nang
  const curHp = player.khiHuyet || 1000;
  const maxHp = player.maxKhiHuyet || 1000;
  const talismanRes = processCombatTalismans(player, 1, curHp, maxHp, cStats.atk);
  let talismanPowerBonus = 1.0;
  let talismanText = '';
  if (talismanRes.triggered) {
    if (talismanRes.extraDamage || talismanRes.damageMultiplier) {
      talismanPowerBonus += (talismanRes.damageMultiplier ? (talismanRes.damageMultiplier - 1) : 0.25);
    }
    if (talismanRes.shieldAmount) {
      talismanPowerBonus += 0.15;
    }
    if (talismanRes.logText) {
      talismanText = ` [${talismanRes.logText}]`;
    }
  }

  // Kích hoạt Chiến Kỹ Hộ Chủ của Bản Mệnh Khí Linh
  const bossHpForSpirit = boss.stats?.hp ?? boss.hp ?? 10000;
  const spiritRes = processSpiritCombatTrigger(player, 1, curHp, maxHp, bossHpForSpirit, bossHpForSpirit);
  let spiritPowerBonus = 1.0;
  let spiritText = '';
  if (spiritRes.triggered) {
    spiritPowerBonus = 1.25;
    if (spiritRes.extraDamage) spiritPowerBonus += 0.15;
    if (spiritRes.blockLethal) spiritPowerBonus += 0.10;
    if (spiritRes.logText) {
      spiritText = ` [${spiritRes.logText}]`;
    }
  }

  // Nhiên Tu Vi Overdrive (Tu Vi Combat Overdrive)
  const isOverdrive = Boolean(
    (player.tuViEmpowermentState?.overdriveActiveTurns ?? 0) > 0 ||
    (player.tuViEmpowermentState?.overdriveBuff?.isActive && (player.tuViEmpowermentState.overdriveBuff.remainingTurns ?? 0) > 0)
  );
  let overdrivePowerBonus = 1.0;
  let overdriveText = '';
  if (isOverdrive) {
    const mult = player.tuViEmpowermentState?.overdriveBuff?.statMultiplier || 0.25;
    overdrivePowerBonus = 1 + mult;
    overdriveText = ` [🔥 NHIÊN TU VI: Cuồng nộ bộc phát +${Math.round(mult * 100)}% uy lực!]`;
  }

  // Kích hoạt Thần Thông Bí Thuật Cửu Giai Xuất Chiến
  const usedDivineTracker = new Set<string>();
  const divineRes = processCombatDivineAbilities(
    player,
    1,
    curHp,
    maxHp,
    boss.stats?.hp ?? boss.hp ?? 10000,
    boss.stats?.maxHp ?? boss.maxHp ?? 10000,
    cStats.atk,
    isCrit,
    usedDivineTracker
  );
  let divinePowerBonus = 1.0;
  let divineText = '';
  if (divineRes.triggeredAbilities.length > 0) {
    if (divineRes.extraDamage > 0 || divineRes.trueDamage > 0) {
      divinePowerBonus += 0.35;
    }
    if (divineRes.shieldValue > 0 || divineRes.healValue > 0) {
      divinePowerBonus += 0.20;
    }
    if (divineRes.stunTarget || divineRes.invulnerable || divineRes.executeTriggered) {
      divinePowerBonus += 0.30;
    }
    if (divineRes.buffAtkPercent > 0) {
      divinePowerBonus += (divineRes.buffAtkPercent / 100);
    }
    if (divineRes.logs.length > 0) {
      divineText = ` [${divineRes.logs.join(' | ')}]`;
    }
  }

  // Kích hoạt Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances)
  const equippedManualsList = getPlayerEquippedManualList(player);
  const activeResonances = detectActiveDomainResonances(equippedManualsList, player.natalArtifact, player.currentRealm);
  let resonancePowerBonus = 1.0;
  let resonanceText = '';
  let resonanceEvents: string[] = [];

  if (activeResonances.length > 0) {
    const resTurn = resolveResonanceTurnEffects(
      { hp: curHp, maxHp, mp: player.linhLuc || 1000, maxMp: player.maxLinhLuc || 1000, atk: cStats.atk },
      { hp: boss.stats?.hp ?? boss.hp ?? 10000, maxHp: boss.stats?.maxHp ?? boss.maxHp ?? 10000, mp: 1000, maxMp: 1000, atk: boss.stats?.power ?? (boss as any).atk ?? 1000 },
      activeResonances,
      1
    );
    resonanceEvents = resTurn.combatEvents;
    const bonuses = calculateDomainResonanceBonuses(activeResonances);
    resonancePowerBonus = bonuses.extraDmgMultiplier;
    if (bonuses.extraArmorPierce > 0) {
      resonancePowerBonus += (bonuses.extraArmorPierce / 100) * 0.4;
    }
    if (bonuses.extraShieldPercent > 0) {
      skillShieldPercent += bonuses.extraShieldPercent;
    }
    if (resTurn.combatEvents.length > 0) {
      resonanceText = ` [${resTurn.combatEvents.join(' | ')}]`;
    }
  }

  // Đoán Cốt Hợp Kim: Sát thương chuẩn (True Damage) & Thiêu đốt chân khí (Burn DoT)
  const rawDamage = cStats.atk * critMod * skillDamageMultiplier;
  const targetDef = boss.stats?.def ?? (boss as any).def ?? 100;
  const defReductionMod = 1000 / (1000 + targetDef * bossDefenseMod);
  const mitigatedPhysicalDamage = Math.max(1, Math.round(rawDamage * defReductionMod));

  const trueDamageRate = (cStats.trueDamagePercent || 0) > 1 ? (cStats.trueDamagePercent || 0) / 100 : (cStats.trueDamagePercent || 0);
  const trueDamage = Math.round(rawDamage * trueDamageRate);
  const finalTurnDamage = mitigatedPhysicalDamage + trueDamage;

  let trueDamageText = '';
  let trueDamageBonusPower = 0;
  if (trueDamage > 0) {
    trueDamageBonusPower = trueDamage * 3.5;
    trueDamageText = ` [⚡ CANH KIM CHÂN THƯƠNG: Sát thương chuẩn +${trueDamage.toLocaleString()} (${(trueDamageRate * 100).toFixed(1)}%) xuyên thấu phòng ngự!]`;
  }

  let burnDamageText = '';
  let burnDoTPowerBonus = 0;
  const burnRate = (cStats.burnDamagePercent || 0) > 1 ? (cStats.burnDamagePercent || 0) / 100 : (cStats.burnDamagePercent || 0);
  if (burnRate > 0) {
    const bossMaxHp = boss.stats?.maxHp ?? (boss as any).maxHp ?? 10000;
    const burnDamage = Math.round(bossMaxHp * burnRate);
    burnDoTPowerBonus = burnDamage * 1.5;
    burnDamageText = ` [🔥 THIÊU ĐỐT CHÂN KHÍ: Địa Hỏa chân diễm thiêu đốt -${burnDamage.toLocaleString()} HP (${(burnRate * 100).toFixed(1)}% Max HP)!]`;
  }

  // 5. Minh Khắc Trận Văn (Formation Inscription Combat Effects)
  const rawEquips = player.equipment || (player as any).equippedEquipment;
  const allEquippedItems: Equipment[] = rawEquips
    ? (Array.isArray(rawEquips)
        ? rawEquips.filter(Boolean)
        : [rawEquips.weapon, rawEquips.armor, rawEquips.boots, rawEquips.accessory, rawEquips.artifact, rawEquips.ring].filter(Boolean))
    : [];
  const inscriptionAgg = aggregateEquipmentInscriptions(allEquippedItems);

  // 5.1. Phong Nhận Trận / Kiếm Khí Trận (On-Hit Proc)
  let phongNhanTriggered = false;
  let phongNhanBonusDamage = 0;
  let phongNhanText = '';
  const phongNhanProc = inscriptionAgg.procs.find(p => p.triggerType === 'on_hit_proc' || p.id.includes('phong_nhan'));
  if (phongNhanProc) {
    const chance = phongNhanProc.chance ?? 0.25;
    if (Math.random() < chance) {
      phongNhanTriggered = true;
      const bonusRatio = phongNhanProc.value ?? 0.40;
      phongNhanBonusDamage = Math.round(cStats.atk * bonusRatio);
      phongNhanText = ` [🌀 【Phong Nhận Trận】 bạo phát, một luồng kiếm khí xé toạc hư không đánh thẳng vào đối thủ!]`;
    }
  }

  // 5.2. Huyết Sát Thệ Huyết Trận (Vampiric Drain)
  let vampiricHealedHp = 0;
  let vampiricText = '';
  const vampiricProc = inscriptionAgg.procs.find(p => p.triggerType === 'vampiric_lifesteal' || p.id.includes('huyet_sat'));
  if (vampiricProc) {
    const drainRatio = vampiricProc.value ?? 0.12;
    vampiricHealedHp = Math.round((finalTurnDamage + phongNhanBonusDamage) * drainRatio);
    if (vampiricHealedHp > 0) {
      vampiricText = ` [🩸 【Huyết Sát Thệ Huyết Trận】 huyết quang chuyển hóa hồi phục ${vampiricHealedHp.toLocaleString()} sinh lực!]`;
    }
  }

  // 5.3. Trận Khí Tùy Thân (Turn Start - Orbiting Array Sets Swarm Damage & Ult)
  let formationArrayTriggered = false;
  let formationSwarmDamage = 0;
  let formationUltTriggered = false;
  let formationUltDamage = 0;
  let formationArrayText = '';

  const equippedArraySetId = player.formationSetsState?.equippedArraySetId as FormationSetCategory | undefined;
  if (equippedArraySetId && FORMATION_SETS_REGISTRY[equippedArraySetId]) {
    const arrayConfig = FORMATION_SETS_REGISTRY[equippedArraySetId];
    const userProgress = player.formationSetsState?.ownedSets?.[equippedArraySetId];
    const currentPieces = userProgress?.currentPieces || 0;

    if (currentPieces > 0) {
      let turnDamagePercent = 0;
      for (const threshold of arrayConfig.thresholdBonuses) {
        if (currentPieces >= threshold.requiredPieces && threshold.effects?.turnDamagePercent) {
          turnDamagePercent = Math.max(turnDamagePercent, threshold.effects.turnDamagePercent);
        }
      }

      if (turnDamagePercent > 0) {
        formationArrayTriggered = true;
        const damageRatio = turnDamagePercent > 1 ? turnDamagePercent / 100 : turnDamagePercent;
        formationSwarmDamage = Math.round(cStats.atk * damageRatio);

        const setName = equippedArraySetId === 'chu_thien_kiem'
          ? '【Tam Thập Lục Chu Thiên Kiếm Trận】'
          : `【${arrayConfig.name}】`;
        formationArrayText += ` [🌀 ${setName} xoay chuyển tuần hoàn, ${currentPieces} đạo kiếm quang xé gió giáng thẳng xuống đối thủ!]`;
      }

      // Mốc 36/36: Tuyệt Kỹ 【Chu Thiên Vạn Kiếm Trận】 quét sạch 250% sát thương
      const isMilestone36 = currentPieces >= 36 || (currentPieces >= arrayConfig.maxPieces && arrayConfig.thresholdBonuses.some(t => t.requiredPieces === arrayConfig.maxPieces && t.effects.unlockedSkillName));
      if (isMilestone36) {
        formationUltTriggered = true;
        formationUltDamage = Math.round(cStats.atk * 2.50);
        formationArrayText += ` [⚡ Tuyệt Kỹ 【Chu Thiên Vạn Kiếm Trận】 bộc phát uy lực kinh thiên! Vạn đạo kiếm mang quét sạch 250% (${formationUltDamage.toLocaleString()}) sát thương diện rộng!]`;
      }
    }
  }

  // 5.4. Lôi Kiếp Thần Binh (Lightning Tempered Attack Bonus & Paralysis)
  let lightningTemperTriggered = false;
  let lightningDamageBonus = 0;
  let lightningParalysisTriggered = false;
  let lightningTemperText = '';

  const weaponEquipForLightning = (player.equipment as any)?.weapon
    || (player as any).equippedEquipment?.weapon
    || allEquippedItems.find(e => (e?.slot === 'weapon' || e?.type === 'weapon') && e?.lightningTempering?.isTempered);

  if (weaponEquipForLightning?.lightningTempering?.isTempered === true) {
    lightningTemperTriggered = true;
    const lt = weaponEquipForLightning.lightningTempering;
    const bonusPercent = typeof lt.lightningElementBonus === 'number' ? lt.lightningElementBonus : 35;
    const bonusRatio = bonusPercent > 1 ? bonusPercent / 100 : bonusPercent;

    // Sát thương Lôi Sát xuyên giáp
    lightningDamageBonus = Math.round(cStats.atk * bonusRatio);
    lightningTemperText += ` [⚡ LÔI KIẾP THẦN BINH: Lôi Sát xuyên giáp +${lightningDamageBonus.toLocaleString()} (${bonusPercent}% ATK)!]`;

    // 20% tỷ lệ gây 【Thiên Lôi Tê Liệt】
    const procChance = typeof lt.paralysisProcChance === 'number'
      ? (lt.paralysisProcChance > 1 ? lt.paralysisProcChance / 100 : lt.paralysisProcChance)
      : 0.20;
    if (Math.random() < procChance) {
      lightningParalysisTriggered = true;
      lightningTemperText += ` [⚡ 【Cửu Tiêu Thiên Lôi】 bộc phát! Luồng lôi đình kinh thiên đánh trúng huyệt đạo, khiến đối thủ bị tê liệt mất 1 lượt xuất chiêu!]`;
    }
  }

  // Effective calculation
  const mindBladeBonusPower = mindBladeDamage * 3.5;
  const phongNhanBonusPower = phongNhanBonusDamage * 3.5;
  const formationBonusPower = (formationSwarmDamage + formationUltDamage) * 3.5;
  const lightningBonusPower = lightningDamageBonus * 3.5;
  const effectivePlayerPower = (playerCombatPower + mindBladeBonusPower + trueDamageBonusPower + burnDoTPowerBonus + phongNhanBonusPower + formationBonusPower + lightningBonusPower) * (1 + luckBonus) * elementalMod.playerDamageMod * skillDamageMultiplier * critMod * speedAdvantage * doubleActionMultiplier * companionPowerBonus * soulSuppressionBonus * beastPowerBonus * talismanPowerBonus * spiritPowerBonus * overdrivePowerBonus * divinePowerBonus * resonancePowerBonus;
  const rawBossPower = boss.stats?.power ?? (boss as any).power ?? (boss.atk * 3);
  const rawBossSpeed = boss.stats?.speed ?? (boss as any).speed ?? 100;
  let bossPower = (rawBossPower + (Math.random() * rawBossSpeed * 0.2)) * bossDefenseMod * (1 - skillShieldPercent / 100) * dmgReductionMod * beastBlockMod * (naturalEvasionTriggered ? 0.70 : 1.0) * (lightningParalysisTriggered ? 0.70 : 1.0);

  // 5.3. Bát Quái Hộ Thân Trận (Emergency Shield)
  let hasTriggeredBatQuaiShield = false;
  let batQuaiShieldAmount = 0;
  let batQuaiText = '';
  const batQuaiProc = inscriptionAgg.procs.find(p => p.triggerType === 'emergency_shield' || p.id.includes('bat_quai'));
  if (batQuaiProc) {
    const thresholdHp = maxHp * (batQuaiProc.thresholdHpPercent ?? 0.30);
    const estimatedBossDmg = Math.round(rawBossPower * bossDefenseMod * dmgReductionMod);
    const projectedHp = curHp - estimatedBossDmg;
    if (curHp < thresholdHp || projectedHp < thresholdHp) {
      hasTriggeredBatQuaiShield = true;
      batQuaiShieldAmount = Math.round(maxHp * (batQuaiProc.shieldHpPercent ?? 0.20));
      batQuaiText = ` [🛡️ 【Bát Quái Hộ Thân Trận】 trên thân binh bừng sáng, chặn đứng đòn đánh chí mạng và ngưng tụ hộ thuẫn bảo vệ thân thể!]`;
    }
  }

  // 6. Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion Combat Mechanics)
  let hasTriggeredSpiritGuardian = false;
  let spiritFearStunned = false;
  let spiritBurnDamage = 0;
  let spiritGuardianLog = '';
  let spiritInfusionText = '';

  const equippedWithSoul = allEquippedItems.find(e => e?.infusedSoul) || player.natalArtifact?.baseEquipment;
  const infusedSoul: InfusedSoulMetadata | undefined = equippedWithSoul?.infusedSoul || (player.natalArtifact as any)?.infusedSoul;

  if (infusedSoul?.currentProc) {
    const proc = infusedSoul.currentProc;

    // Vòng lặp Tấn Công:
    // a. Hắc Giao - Long Uy Hám Tâm: Giảm 30% ATK đối thủ, set cờ mất lượt, ghi log viền lam
    if (proc.id === 'proc_hac_giao_long_uy' || proc.effectType === 'debuff_fear' || infusedSoul.soulType === 'hac_giao') {
      const fearChance = proc.triggerChance ?? 0.20;
      if (Math.random() < fearChance) {
        spiritFearStunned = true;
        // Giảm 30% ATK / sức mạnh đối thủ
        bossPower = bossPower * (1 - (proc.potencyValue || 0.30));
        spiritInfusionText += ` [🌀 【Hồn Hắc Giao】 gầm vang chấn động Cửu Tiêu! Long uy chấn nhiếp khiến địch thủ hồn phi phách tán, giảm công kích và không thể xuất chiêu!]`;
      }
    }

    // b. Hỏa Phượng - Niết Bàn Chân Hỏa: Gắn debuff thiêu đốt theo lượt vào mục tiêu
    if (proc.id === 'proc_hoa_phuong_niet_ban' || proc.effectType === 'burn_dot' || infusedSoul.soulType === 'hoa_phuong') {
      const burnChance = proc.triggerChance ?? 0.30;
      if (Math.random() < burnChance) {
        const bossMaxHp = boss.stats?.maxHp ?? (boss as any).maxHp ?? 10000;
        spiritBurnDamage = Math.round(bossMaxHp * (proc.potencyValue || 0.04));
        spiritInfusionText += ` [🔥 【Niết Bàn Chân Hỏa】 bùng cháy dữ dội, thiêu đốt -${spiritBurnDamage.toLocaleString()} sinh lực của đối thủ!]`;
      }
    }

    // Vòng lặp Nhận Sát Thương: Tự Động Hộ Chủ (Autonomous Guardian)
    // Nếu người chơi mang vũ khí Bản Mệnh có Khí Linh Stage 3, máu tụt xuống < 20% và !hasTriggeredSpiritGuardian
    const hpRatio = curHp / Math.max(1, maxHp);
    const estimatedBossDmg = Math.round(rawBossPower * bossDefenseMod * dmgReductionMod);
    const projectedHp = curHp - estimatedBossDmg;
    const isStage3 = infusedSoul.evolutionStage === 3;

    if (isStage3 && (hpRatio < 0.20 || (projectedHp / maxHp) < 0.20) && !hasTriggeredSpiritGuardian) {
      hasTriggeredSpiritGuardian = true;
      bossPower = 0; // Miễn nhiễm toàn bộ sát thương của đòn đánh chí tử này
      const quote = getSpiritDialogue(infusedSoul, 'onLowHealth');
      spiritGuardianLog = `Khí Linh xuất thế hộ chủ! 【${infusedSoul.soulName}】: '${quote}' — Chặn đứng đòn đánh hiểm nghèo!`;
      spiritInfusionText += ` [👑 ${spiritGuardianLog}]`;
    }
  }

  // 7. Huyết Khế Bản Mệnh – Kháng Tước Khí (Disarm Immunity)
  // Khi đối phương kích hoạt kỹ năng cấm thuật Tước Khí / Giải Giới (disarm hoặc seal_equipment):
  // Nếu vũ khí đang dùng có bloodBondData?.disarmImmunity === true → hóa giải hoàn toàn.
  let bloodBondDisarmImmunityText = '';
  const weaponEquip = (player.equipment as any)?.weapon
    || (player as any).equippedEquipment?.weapon
    || allEquippedItems.find(e => e?.slot === 'weapon' || e?.type === 'weapon');

  const bossHasDisarm = Boolean(
    (boss as any).skills?.some((s: any) => s?.effectType === 'disarm' || s?.effectType === 'seal_equipment') ||
    (boss as any).hasDisarm ||
    (boss as any).canDisarm ||
    boss.description?.toLowerCase().includes('tước khí') ||
    boss.description?.toLowerCase().includes('giải giới')
  );

  if (bossHasDisarm && weaponEquip?.bloodBondData?.disarmImmunity === true) {
    // Hóa giải toàn bộ tước khí: giảm sức mạnh Boss thêm 15% do mất lợi thế chiến thuật
    bossPower = bossPower * 0.85;
    bloodBondDisarmImmunityText = ` [⚔️ 【Huyết Khế Thần Binh】 cộng hưởng kinh mạch, phát quang huyết sắc cản phá cấm thuật tước khí của đối thủ!]`;
  }

  const powerRatio = effectivePlayerPower / bossPower;
  
  // Victory chance based on power ratio
  let victoryChance = 50;
  if (powerRatio >= 1.4) victoryChance = 96;
  else if (powerRatio >= 1.2) victoryChance = 88;
  else if (powerRatio >= 1.0) victoryChance = 70;
  else if (powerRatio >= 0.85) victoryChance = 50;
  else if (powerRatio >= 0.7) victoryChance = 30;
  else victoryChance = 15;
  
  const victory = Math.random() * 100 < victoryChance;
  
  const elementalReport = {
    playerElement: playerElem,
    bossElement: bossElem,
    relation: elementalMod.relation,
    description: elementalMod.description
  };

  if (victory) {
    // Destiny drop rate multiplier (Thiên Mệnh Chi Tử +50%, Khí Vận Nghịch Thiên +30%)
    const destinyDropMul = player.destiny?.effects?.dropRateBonusPercent ? (1 + player.destiny.effects.dropRateBonusPercent / 100) : 1.0;

    // 1. Rơi Bí Tịch Công Pháp
    let droppedManual: Manual | undefined = undefined;
    const manualDropChance = (boss.difficulty === 'legendary' ? 0.65 : boss.difficulty === 'hard' ? 0.45 : 0.25) * destinyDropMul;
    if (Math.random() < manualDropChance) {
      const targetGrade = boss.realm >= 27 ? 'Thiên Giai' : boss.realm >= 17 ? 'Địa Giai' : boss.realm >= 7 ? 'Huyền Giai' : 'Hoàng Giai';
      const suitableManuals = DEFAULT_MANUALS.filter(m => m.grade === targetGrade);
      if (suitableManuals.length > 0) {
        droppedManual = suitableManuals[Math.floor(Math.random() * suitableManuals.length)];
      }
    }

    // 2. Rơi Đan Dược Thành Phẩm (bao gồm Định Thần Đan, Khí Huyết Đan, Cải Mệnh Đan...)
    let droppedPill: Pill | undefined = undefined;
    if (Math.random() < (0.65 * destinyDropMul)) {
      const pillKeys = ['pill_khi_huyet', 'pill_dinh_than', 'pill_tay_linh', 'pill_cuong_bao', 'pill_hoi_thien', 'pill_tay_tuy', 'pill_cai_menh'];
      const pickedKey = pillKeys[Math.floor(Math.random() * pillKeys.length)];
      const template = PILL_TEMPLATES[pickedKey];
      if (template) {
        droppedPill = { ...template, quantity: 1 };
      }
    }

    // 3. Rơi Khoáng Thạch Cấp Cao
    let droppedOre: Ore | undefined = undefined;
    if (Math.random() < (0.75 * destinyDropMul)) {
      const oreIndex = Math.min(DEFAULT_ORES.length - 1, Math.floor(boss.realm / 8));
      const pickedOre = DEFAULT_ORES[oreIndex] || DEFAULT_ORES[0];
      droppedOre = { ...pickedOre, quantity: Math.floor(Math.random() * 2) + 1 };
    }

    // 4. Rơi Tinh Huyết Yêu Thú (Dùng Tôi Thể Thể Chất & Nhục Thân)
    const baseTinhHuyet = boss.difficulty === 'legendary' ? 4 : boss.difficulty === 'hard' ? 3 : boss.difficulty === 'medium' ? 2 : 1;
    const tinhHuyetDrop = Math.max(1, Math.floor((baseTinhHuyet + (Math.random() < 0.4 ? 1 : 0)) * destinyDropMul));

    // 5. Rơi Trứng Thần Thú (Linh Noãn)
    let droppedBeastEgg: BeastEgg | undefined = undefined;
    const eggChance = (boss.difficulty === 'legendary' ? 0.35 : boss.difficulty === 'hard' ? 0.25 : 0.15) * destinyDropMul;
    if (Math.random() < eggChance) {
      const eggType = boss.difficulty === 'legendary' ? 'egg_thai_co' : boss.difficulty === 'hard' ? 'egg_thanh_tinh' : 'egg_u_minh';
      droppedBeastEgg = createRandomEgg(eggType);
    }

    const scaledRewards = {
      tuVi: Math.floor((boss.rewards?.tuVi ?? (boss as any).drops?.tuVi ?? 500) * destinyDropMul),
      linhThach: Math.floor((boss.rewards?.linhThach ?? (boss as any).drops?.linhThach ?? 200) * destinyDropMul),
      danhVong: boss.rewards?.danhVong ?? 10
    };

    const beastFlavor = beastReport
      ? ` [🐾 ${beastReport.avatar} ${beastReport.beastName} đỡ đòn -${beastReport.blockedDmgPercent}% sát thương!${beastReport.hoChuChiTuTriggered ? ` Kích hoạt Hộ Chủ Chí Tử tạo khiên +${beastReport.shieldValue.toLocaleString()} HP!]` : ']'}`
      : '';

    return {
      victory: true,
      message: 'Chiến thắng!',
      rewards: {
        ...scaledRewards,
        specialItems: [
          droppedManual ? `Bí tịch: ${droppedManual.name}` : '',
          droppedPill ? `Đan dược: ${droppedPill.name}` : '',
          droppedOre ? `Khoáng thạch: ${droppedOre.name}` : '',
          droppedBeastEgg ? `Linh noãn: ${droppedBeastEgg.name}` : ''
        ].filter(Boolean)
      },
      droppedManual,
      droppedPill,
      droppedOre,
      droppedBeastEgg,
      tinhHuyetDrop,
      elementalReport,
      usedSkillReport,
      beastReport,
      doubleAction: doubleActionTriggered,
      naturalEvasion: naturalEvasionTriggered,
      activeResonances,
      resonanceReport: activeResonances.length > 0 ? { activeResonances, combatEvents: resonanceEvents } : undefined,
      hasTriggeredBatQuaiShield,
      phongNhanTriggered,
      vampiricHealedHp,
      hasTriggeredSpiritGuardian,
      spiritFearStunned,
      spiritBurnDamage,
      spiritGuardianLog: spiritGuardianLog || undefined,
      formationArrayTriggered,
      formationSwarmDamage,
      formationUltTriggered,
      formationUltDamage,
      lightningTemperTriggered,
      lightningDamageBonus,
      lightningParalysisTriggered,
      flavorText: `${boss.defeatText}${isCrit ? ' [💥 Đòn Đánh Bạo Kích x' + critMod.toFixed(1) + '!]' : ''}${speedAdvantage > 1 ? ' [⚡ Thân pháp siêu việt chiếm tiên cơ!]' : ''}${doubleActionText}${evasionText}${soulSuppressionText}${alloySlowText}${trueDamageText}${burnDamageText}${formationArrayText}${lightningTemperText}${phongNhanText}${vampiricText}${batQuaiText}${spiritInfusionText}${mindBladeText}${divineText}${talismanText}${spiritText}${overdriveText}${resonanceText}${bloodBondDisarmImmunityText}${cStats.hpRegenPercent ? ' [🩸 Kim Thân Bất Diệt hồi phục khí huyết!]' : ''}${companionAssistTriggered ? ' [⚡ Nam Cung Uyển ngự kiếm trợ chiến, Lôi Kiếm trảm phá phòng ngự!]' : ''}${compBuffs.lifestealPercent ? ' [🥀 Cơ Vô Diễm kích hoạt Huyết Ma Tương Tri, hút máu hồi phục khí huyết!]' : ''}${beastFlavor}`
    };

  } else {
    // Kiểm tra Hư Ảnh Tổ Tiên Đỡ Đòn Tử Vong
    const wardRes = checkAndConsumeAncestralDeathWard(player);
    if (wardRes.triggered) {
      return {
        victory: false,
        penalties: {
          tuVi: 0,
          linhThach: 0,
          khiVan: 0
        },
        elementalReport,
        usedSkillReport,
        beastReport,
        doubleAction: doubleActionTriggered,
        naturalEvasion: naturalEvasionTriggered,
        hasTriggeredBatQuaiShield,
        phongNhanTriggered,
        vampiricHealedHp,
        hasTriggeredSpiritGuardian,
        spiritFearStunned,
        spiritBurnDamage,
        spiritGuardianLog: spiritGuardianLog || undefined,
        formationArrayTriggered,
        formationSwarmDamage,
        formationUltTriggered,
        formationUltDamage,
        lightningTemperTriggered,
        lightningDamageBonus,
        lightningParalysisTriggered,
        message: 'Tổ Tiên Hiển Linh Thoát Hiểm!',
        flavorText: `${boss.loseText}\n${wardRes.combatMessage}\n🛡️ Đạo hữu nhờ Hư Ảnh Tổ Tiên che chắn mà bảo toàn nguyên khí, miễn trừ toàn bộ tổn thất tu vi và linh thạch!${formationArrayText}${lightningTemperText}${phongNhanText}${vampiricText}${batQuaiText}${spiritInfusionText}${bloodBondDisarmImmunityText}`
      };
    }

    // Phòng ngự giúp giảm tổn thất khi thất bại
    const defMitigation = Math.min(0.5, cStats.def / 1000);
    return {
      victory: false,
      penalties: {
        tuVi: Math.floor(player.tuVi * 0.15 * (1 - defMitigation)),
        linhThach: Math.floor(player.linhThach * 0.1 * (1 - defMitigation)),
        khiVan: 5
      },
      elementalReport,
      usedSkillReport,
      beastReport,
      doubleAction: doubleActionTriggered,
      naturalEvasion: naturalEvasionTriggered,
      activeResonances,
      resonanceReport: activeResonances.length > 0 ? { activeResonances, combatEvents: resonanceEvents } : undefined,
      hasTriggeredBatQuaiShield,
      phongNhanTriggered,
      vampiricHealedHp,
      hasTriggeredSpiritGuardian,
      spiritFearStunned,
      spiritBurnDamage,
      spiritGuardianLog: spiritGuardianLog || undefined,
      formationArrayTriggered,
      formationSwarmDamage,
      formationUltTriggered,
      formationUltDamage,
      lightningTemperTriggered,
      lightningDamageBonus,
      lightningParalysisTriggered,
      message: 'Thất bại!',
      flavorText: `${boss.loseText}${doubleActionText}${evasionText}${alloySlowText}${trueDamageText}${burnDamageText}${formationArrayText}${lightningTemperText}${phongNhanText}${vampiricText}${batQuaiText}${spiritInfusionText}${divineText}${talismanText}${spiritText}${overdriveText}${resonanceText}${bloodBondDisarmImmunityText}`
    };

  }
}

// ============================================
// 4. MODULAR METALLURGY COMBAT LOOP EXECUTION
// ============================================

export interface CombatTurnTarget {
  name: string;
  hp: number;
  maxHp: number;
  def: number;
  speed: number;
  [key: string]: any;
}

export interface AlloyCombatTurnResult {
  rawDamage: number;
  mitigatedPhysicalDamage: number;
  trueDamage: number;
  finalDamage: number;
  slowSpeedReduction: number;
  newTargetSpeed: number;
  burnDoTDamage: number;
  remainingTargetHp: number;
  combatLogs: string[];
}

/**
 * Thực thi lượt công kích với các chỉ số từ Thần Binh Hợp Kim:
 * - Sát thương chuẩn (True Damage): Final Damage = Mitigated Physical Damage + (Raw Damage * trueDamagePercent)
 * - Hàn Băng Tê Liệt (Slow Attack Speed): Trừ trực tiếp tốc độ hoặc thanh chờ xuất chiêu của đối thủ theo slowSpeedPercent
 * - Thiêu Đốt Chân Khí (Burn Damage): Gắn hiệu ứng DoT trừ % HP tối đa mỗi lượt và ghi nhận log chiến đấu cổ phong
 */
export function executeAlloyCombatTurn(
  attackerStats: {
    atk: number;
    critRate?: number;
    critDmg?: number;
    trueDamagePercent?: number;
    slowSpeedPercent?: number;
    burnDamagePercent?: number;
    [key: string]: any;
  },
  target: CombatTurnTarget,
  options?: { isCrit?: boolean; skillMultiplier?: number }
): AlloyCombatTurnResult {
  const isCrit = options?.isCrit ?? (Math.random() * 100 < (attackerStats.critRate || 5));
  const critMod = isCrit ? ((attackerStats.critDmg || 150) / 100) : 1.0;
  const skillMul = options?.skillMultiplier ?? 1.0;

  // 1. Raw Damage
  const rawDamage = Math.round(attackerStats.atk * critMod * skillMul);

  // 2. Mitigated Physical Damage
  const targetDef = Math.max(0, target.def);
  const defReductionMod = 1000 / (1000 + targetDef);
  const mitigatedPhysicalDamage = Math.max(1, Math.round(rawDamage * defReductionMod));

  // 3. Sát thương chuẩn (True Damage): Final Damage = Mitigated Physical Damage + (Raw Damage * trueDamagePercent)
  const trueDamageRate = (attackerStats.trueDamagePercent || 0) > 1
    ? (attackerStats.trueDamagePercent || 0) / 100
    : (attackerStats.trueDamagePercent || 0);
  const trueDamage = Math.round(rawDamage * trueDamageRate);
  const finalDamage = mitigatedPhysicalDamage + trueDamage;

  // 4. Hàn Băng Tê Liệt (Slow Attack Speed): Trừ trực tiếp tốc độ theo slowSpeedPercent
  const slowSpeedRate = (attackerStats.slowSpeedPercent || 0) > 1
    ? (attackerStats.slowSpeedPercent || 0) / 100
    : (attackerStats.slowSpeedPercent || 0);
  const slowSpeedReduction = Math.round(target.speed * slowSpeedRate);
  const newTargetSpeed = Math.max(1, target.speed - slowSpeedReduction);

  // 5. Thiêu Đốt Chân Khí (Burn Damage DoT): Trừ % HP tối đa mỗi lượt
  const burnRate = (attackerStats.burnDamagePercent || 0) > 1
    ? (attackerStats.burnDamagePercent || 0) / 100
    : (attackerStats.burnDamagePercent || 0);
  const burnDoTDamage = Math.round(target.maxHp * burnRate);

  // Khấu trừ sinh lực đối thủ
  const totalHpLost = finalDamage + burnDoTDamage;
  const remainingTargetHp = Math.max(0, target.hp - totalHpLost);

  // Ghi nhận log chiến đấu cổ phong
  const combatLogs: string[] = [];
  combatLogs.push(`Tung chiêu giáng xuống ${mitigatedPhysicalDamage.toLocaleString()} sát thương vật lý${isCrit ? ' [Bạo Kích!]' : ''}.`);
  if (trueDamage > 0) {
    combatLogs.push(`[⚡ Canh Kim Chân Thương] Kích phát sát thương chuẩn +${trueDamage.toLocaleString()} (${(trueDamageRate * 100).toFixed(1)}%) xuyên thấu phòng ngự!`);
  }
  if (slowSpeedReduction > 0) {
    combatLogs.push(`[❄️ Hàn Băng Tê Liệt] Hàn khí ngưng trệ kinh mạch trừ -${slowSpeedReduction} tốc độ, tốc độ đối thủ giảm còn ${newTargetSpeed}!`);
  }
  if (burnDoTDamage > 0) {
    combatLogs.push(`[🔥 Thiêu Đốt Chân Khí] Địa Hỏa chân diễm thiêu đốt -${burnDoTDamage.toLocaleString()} HP (${(burnRate * 100).toFixed(1)}% Max HP)!`);
  }

  return {
    rawDamage,
    mitigatedPhysicalDamage,
    trueDamage,
    finalDamage,
    slowSpeedReduction,
    newTargetSpeed,
    burnDoTDamage,
    remainingTargetHp,
    combatLogs
  };
}

// ============================================
// 5. FORMATION INSCRIPTION COMBAT TURN EXECUTION
// ============================================

export interface InscriptionCombatTurnParams {
  playerHp: number;
  playerMaxHp: number;
  playerAtk: number;
  playerDef?: number;
  equippedItems: Equipment[];
  hasTriggeredBatQuaiShield?: boolean;
  targetHp: number;
  targetMaxHp: number;
  targetDef: number;
  incomingBossDamage?: number;
  randomFn?: () => number;
}

export interface InscriptionCombatTurnResult {
  rawDamage: number;
  phongNhanTriggered: boolean;
  phongNhanBonusDamage: number;
  finalDamageDealt: number;
  targetRemainingHp: number;
  vampiricHealedHp: number;
  hasTriggeredBatQuaiShield: boolean;
  batQuaiShieldGained: number;
  actualDamageReceived: number;
  playerRemainingHp: number;
  combatLogs: string[];
}

/**
 * Thực thi lượt công kích với các hiệu ứng Minh Khắc Trận Văn:
 * - Bát Quái Hộ Thân Trận: Nếu HP bị tụt xuống < 30% Max HP và chưa kích hoạt:
 *   Triệt tiêu hoàn toàn sát thương đòn đánh chí tử (Damage = 0), cấp khiên 20% Max HP,
 *   đặt cờ hasTriggeredBatQuaiShield = true và log cổ phong.
 * - Phong Nhận Trận: Tỷ lệ 25% phóng kiếm khí gây thêm 40% ATK sát thương.
 * - Huyết Sát Phệ Huyết Trận: Chuyển hóa 12% sát thương thực tế gây ra thành sinh lực hồi phục.
 */
export function executeInscriptionCombatTurn(params: InscriptionCombatTurnParams): InscriptionCombatTurnResult {
  const {
    playerHp,
    playerMaxHp,
    playerAtk,
    equippedItems,
    hasTriggeredBatQuaiShield = false,
    targetHp,
    targetMaxHp,
    targetDef,
    incomingBossDamage = 0,
    randomFn = Math.random
  } = params;

  const combatLogs: string[] = [];
  const inscriptionAgg = aggregateEquipmentInscriptions(equippedItems);

  // 1. Phong Nhận Trận / Kiếm Khí Trận (On-Hit Proc)
  const phongNhanProc = inscriptionAgg.procs.find(p => p.triggerType === 'on_hit_proc' || p.id.includes('phong_nhan'));
  let phongNhanTriggered = false;
  let phongNhanBonusDamage = 0;
  if (phongNhanProc) {
    const roll = randomFn();
    const chance = phongNhanProc.chance ?? 0.25;
    if (roll < chance) {
      phongNhanTriggered = true;
      const bonusRatio = phongNhanProc.value ?? 0.40;
      phongNhanBonusDamage = Math.round(playerAtk * bonusRatio);
      combatLogs.push('【Phong Nhận Trận】 bạo phát, một luồng kiếm khí xé toạc hư không đánh thẳng vào đối thủ!');
    }
  }

  // 2. Tính toán sát thương vật lý lên mục tiêu
  const targetDefFactor = 1000 / (1000 + Math.max(0, targetDef));
  const rawDamage = Math.max(1, Math.round(playerAtk * targetDefFactor));
  const finalDamageDealt = rawDamage + phongNhanBonusDamage;
  const targetRemainingHp = Math.max(0, targetHp - finalDamageDealt);

  // 3. Huyết Sát Thệ Huyết Trận (Vampiric Drain)
  const vampiricProc = inscriptionAgg.procs.find(p => p.triggerType === 'vampiric_lifesteal' || p.id.includes('huyet_sat'));
  let vampiricHealedHp = 0;
  if (vampiricProc) {
    const drainRatio = vampiricProc.value ?? 0.12;
    vampiricHealedHp = Math.round(finalDamageDealt * drainRatio);
    if (vampiricHealedHp > 0) {
      combatLogs.push(`【Huyết Sát Phệ Huyết Trận】 hồi phục ${vampiricHealedHp.toLocaleString()} sinh lực.`);
    }
  }

  // 4. Bát Quái Hộ Thân Trận (Emergency Shield) & Sát thương nhận vào
  let currentTriggeredShield = hasTriggeredBatQuaiShield;
  let actualDamageReceived = incomingBossDamage;
  let batQuaiShieldGained = 0;

  const batQuaiProc = inscriptionAgg.procs.find(p => p.triggerType === 'emergency_shield' || p.id.includes('bat_quai'));
  const thresholdHp = playerMaxHp * (batQuaiProc?.thresholdHpPercent ?? 0.30);
  const projectedRemainingHp = playerHp - incomingBossDamage;

  if (batQuaiProc && !currentTriggeredShield && (playerHp < thresholdHp || projectedRemainingHp < thresholdHp)) {
    // Triệt tiêu hoàn toàn sát thương của đòn đánh chí mạng này (Damage = 0)
    actualDamageReceived = 0;
    // Cấp hộ thuẫn tương đương 20% Max HP
    batQuaiShieldGained = Math.round(playerMaxHp * (batQuaiProc.shieldHpPercent ?? 0.20));
    currentTriggeredShield = true;
    combatLogs.push('【Bát Quái Hộ Thân Trận】 trên thân binh bừng sáng, chặn đứng đòn đánh chí mạng và ngưng tụ hộ thuẫn bảo vệ thân thể!');
  }

  const playerRemainingHp = Math.min(
    playerMaxHp,
    Math.max(0, playerHp - actualDamageReceived + vampiricHealedHp)
  );

  return {
    rawDamage,
    phongNhanTriggered,
    phongNhanBonusDamage,
    finalDamageDealt,
    targetRemainingHp,
    vampiricHealedHp,
    hasTriggeredBatQuaiShield: currentTriggeredShield,
    batQuaiShieldGained,
    actualDamageReceived,
    playerRemainingHp,
    combatLogs
  };
}

// ============================================
// 6. SOUL INFUSION COMBAT TURN EXECUTION
// ============================================

export interface SoulInfusionCombatTurnParams {
  playerHp: number;
  playerMaxHp: number;
  playerAtk: number;
  playerDef?: number;
  weapon: Equipment;
  targetHp: number;
  targetMaxHp: number;
  targetDef: number;
  targetAtk?: number;
  incomingBossDamage?: number;
  hasTriggeredSpiritGuardian?: boolean;
  randomFn?: () => number;
}

export interface SoulInfusionCombatTurnResult {
  rawDamage: number;
  finalDamageDealt: number;
  targetRemainingHp: number;
  longUyTriggered: boolean;
  targetSkipsNextTurn: boolean;
  targetAtkReducedPercent: number;
  nietBanTriggered: boolean;
  burnDoTDamage: number;
  hasTriggeredSpiritGuardian: boolean;
  damageNegated: boolean;
  counterDamageMultiplier: number;
  counterDamageDealt: number;
  actualDamageReceived: number;
  playerRemainingHp: number;
  combatLogs: string[];
}

/**
 * Thực thi lượt công kích và nhận sát thương với cơ chế Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh:
 * - Vòng lặp Tấn Công:
 *   * Quét vũ khí đang trang bị mang infusedSoul:
 *   * Nếu proc long_uy_fear: Giảm 30% ATK đối thủ, set cờ mất lượt đi tiếp theo của đối thủ, ghi nhận log viền lam:
 *     "【Hồn Hắc Giao】 gầm vang chấn động Cửu Tiêu! Long uy chấn nhiếp khiến địch thủ hồn phi phách tán, giảm công kích và không thể xuất chiêu!"
 *   * Nếu proc niet_ban_burn: Gắn debuff thiêu đốt theo lượt vào mục tiêu (4% Max HP/lượt trong 3 lượt).
 * - Vòng lặp Nhận Sát Thương (Tự Động Hộ Chủ):
 *   * Trước khi tính toán trừ máu đòn đánh: Nếu người chơi mang vũ khí/Bản Mệnh có Khí Linh Stage 3,
 *     máu tụt xuống < 20% và !hasTriggeredSpiritGuardian:
 *     - Miễn nhiễm toàn bộ sát thương của đòn đánh chí tử này (damageNegated: true, actualDamageReceived = 0).
 *     - Set hasTriggeredSpiritGuardian = true.
 *     - Lấy câu thoại onLowHealth của Khí Linh và ghi log hoàng kim:
 *       "Khí Linh xuất thế hộ chủ! 【[Tên Khí Linh]】: '[Câu thoại]' — Chặn đứng đòn đánh hiểm nghèo!"
 */
export function executeSoulInfusionCombatTurn(params: SoulInfusionCombatTurnParams): SoulInfusionCombatTurnResult {
  const {
    playerHp,
    playerMaxHp,
    playerAtk,
    weapon,
    targetHp,
    targetMaxHp,
    targetDef,
    incomingBossDamage = 0,
    hasTriggeredSpiritGuardian = false,
    randomFn = Math.random
  } = params;

  const combatLogs: string[] = [];
  const infusedSoul = weapon?.infusedSoul;

  // 1. Tính toán sát thương cơ bản
  const targetDefFactor = 1000 / (1000 + Math.max(0, targetDef));
  const rawDamage = Math.max(1, Math.round(playerAtk * targetDefFactor));
  let extraDamage = 0;

  // 2. Vòng lặp Tấn Công (Attack Proc Loop)
  let longUyTriggered = false;
  let targetSkipsNextTurn = false;
  let targetAtkReducedPercent = 0;

  let nietBanTriggered = false;
  let burnDoTDamage = 0;

  if (infusedSoul?.currentProc) {
    const proc = infusedSoul.currentProc;
    const roll = randomFn();

    // a. Hắc Giao - Long Uy Hám Tâm: Giảm 30% ATK, mất 1 lượt
    if (proc.id === 'proc_hac_giao_long_uy' || proc.effectType === 'debuff_fear' || infusedSoul.soulType === 'hac_giao') {
      const chance = proc.triggerChance ?? 0.20;
      if (roll < chance) {
        longUyTriggered = true;
        targetSkipsNextTurn = true;
        targetAtkReducedPercent = Math.round((proc.potencyValue || 0.30) * 100);
        combatLogs.push('【Hồn Hắc Giao】 gầm vang chấn động Cửu Tiêu! Long uy chấn nhiếp khiến địch thủ hồn phi phách tán, giảm công kích và không thể xuất chiêu!');
      }
    }

    // b. Hỏa Phượng - Niết Bàn Chân Hỏa: Đốt 4% Max HP/lượt
    if (proc.id === 'proc_hoa_phuong_niet_ban' || proc.effectType === 'burn_dot' || infusedSoul.soulType === 'hoa_phuong') {
      const chance = proc.triggerChance ?? 0.30;
      if (roll < chance) {
        nietBanTriggered = true;
        burnDoTDamage = Math.round(targetMaxHp * (proc.potencyValue || 0.04));
        combatLogs.push(`【Niết Bàn Chân Hỏa】 bùng cháy dữ dội, thiêu đốt -${burnDoTDamage.toLocaleString()} sinh lực của đối thủ!`);
      }
    }

    // c. Cổ Kiếm Tu - Kiếm Tâm Vạn Kiếm Quy Tông
    if (proc.effectType === 'sword_burst') {
      const chance = proc.triggerChance ?? 0.15;
      if (roll < chance) {
        const bonusDmg = Math.round(rawDamage * (proc.bonusDamageMultiplier || 2.5));
        extraDamage += bonusDmg;
        combatLogs.push(`【Vạn Kiếm Quy Tông】 xuất thế! Vạn đạo kiếm ảnh rợp trời chém xuất thêm +${bonusDmg.toLocaleString()} sát thương!`);
      }
    }
  }

  const finalDamageDealt = rawDamage + extraDamage + burnDoTDamage;
  const targetRemainingHp = Math.max(0, targetHp - finalDamageDealt);

  // 3. Vòng lặp Nhận Sát Thương: Tự Động Hộ Chủ (Autonomous Guardian)
  let currentGuardianTriggered = hasTriggeredSpiritGuardian;
  let damageNegated = false;
  let actualDamageReceived = incomingBossDamage;
  let counterDamageMultiplier = 0;
  let counterDamageDealt = 0;

  if (infusedSoul) {
    const isStage3 = infusedSoul.evolutionStage === 3;
    const hpRatio = playerHp / Math.max(1, playerMaxHp);
    const projectedRemainingHp = playerHp - incomingBossDamage;
    const projectedRatio = projectedRemainingHp / Math.max(1, playerMaxHp);

    if (isStage3 && (hpRatio < 0.20 || projectedRatio < 0.20) && !currentGuardianTriggered) {
      currentGuardianTriggered = true;
      damageNegated = true;
      actualDamageReceived = 0; // Miễn nhiễm toàn bộ sát thương của đòn đánh chí tử này
      counterDamageMultiplier = 1.5;
      counterDamageDealt = Math.round(playerAtk * counterDamageMultiplier);

      const quote = getSpiritDialogue(infusedSoul, 'onLowHealth', randomFn);
      combatLogs.push(`Khí Linh xuất thế hộ chủ! 【${infusedSoul.soulName}】: '${quote}' — Chặn đứng đòn đánh hiểm nghèo!`);
    }
  }

  const playerRemainingHp = Math.min(
    playerMaxHp,
    Math.max(0, playerHp - actualDamageReceived)
  );

  return {
    rawDamage,
    finalDamageDealt,
    targetRemainingHp,
    longUyTriggered,
    targetSkipsNextTurn,
    targetAtkReducedPercent,
    nietBanTriggered,
    burnDoTDamage,
    hasTriggeredSpiritGuardian: currentGuardianTriggered,
    damageNegated,
    counterDamageMultiplier,
    counterDamageDealt,
    actualDamageReceived,
    playerRemainingHp,
    combatLogs
  };
}

// ============================================
// 7. WEAPON TRIBULATION & ORBITING ARRAY COMBAT TURN EXECUTION
// ============================================

export interface WeaponTribulationArrayTurnParams {
  playerHp: number;
  playerMaxHp: number;
  playerAtk: number;
  playerDef?: number;
  turnNumber: number; // 1-indexed turn
  equippedArraySetId?: FormationSetCategory | null;
  arrayProgress?: PlayerFormationSetProgress | null;
  weapon?: Equipment | null;
  targetHp: number;
  targetMaxHp: number;
  targetDef: number;
  targetAtk?: number;
  incomingBossDamage?: number;
  randomFn?: () => number;
}

export interface WeaponTribulationArrayTurnResult {
  // Swarm & Array results
  swarmDamageDealt: number;
  ultDamageDealt: number;
  swarmTriggered: boolean;
  ultTriggered: boolean;
  // Lightning tempering results
  lightningPiercingDamage: number;
  lightningParalysisTriggered: boolean;
  targetSkipsNextTurn: boolean;
  // Overall turn damage & HP
  rawDamage: number;
  finalDamageDealt: number;
  targetRemainingHp: number;
  actualDamageReceived: number;
  playerRemainingHp: number;
  combatLogs: string[];
}

/**
 * Thực thi lượt chiến đấu tích hợp Lôi Kiếp Thần Binh & Trận Khí Tùy Thân:
 * - Vòng lặp Đầu Lượt (Turn Start - Trận Khí Tùy Thân):
 *   * Nếu người chơi có trang bị Trận Khí Tùy Thân (equippedArraySetId):
 *     - Kích hoạt sát thương bay lượn tự động:
 *       Swarm Damage = PlayerATK * (turnDamagePercent / 100)
 *     - Gây sát thương thẳng vào đối thủ và in dòng combat log màu lam tím:
 *       "【Tam Thập Lục Chu Thiên Kiếm Trận】 xoay chuyển tuần hoàn, [N] đạo kiếm quang xé gió giáng thẳng xuống đối thủ!"
 *     - Nếu đạt Mốc 36/36: Cứ mỗi 3 lượt đấu (turnNumber % 3 === 0), tự động kích hoạt Tuyệt Kỹ 【Chu Thiên Vạn Kiếm Trận】
 *       quét sạch 250% sát thương diện rộng.
 * - Vòng lặp Tấn Công Thường (Lôi Kiếp Thần Binh):
 *   * Nếu vũ khí có lightningTempering?.isTempered === true:
 *     - Cộng thêm sát thương Lôi Sát xuyên giáp (lightningElementBonus).
 *     - Xúc xắc tỷ lệ 20% gây hiệu ứng 【Thiên Lôi Tê Liệt】: Làm gián đoạn đòn đánh tiếp theo của kẻ địch và in log viền bạc chói lòa:
 *       "【Cửu Tiêu Thiên Lôi】 bộc phát! Luồng lôi đình kinh thiên đánh trúng huyệt đạo, khiến đối thủ bị tê liệt mất 1 lượt xuất chiêu!"
 */
export function executeWeaponTribulationArrayCombatTurn(params: WeaponTribulationArrayTurnParams): WeaponTribulationArrayTurnResult {
  const {
    playerHp,
    playerMaxHp,
    playerAtk,
    turnNumber,
    equippedArraySetId,
    arrayProgress,
    weapon,
    targetHp,
    targetMaxHp,
    targetDef,
    incomingBossDamage = 0,
    randomFn = Math.random
  } = params;

  const combatLogs: string[] = [];

  // 1. Vòng lặp Đầu Lượt (Turn Start - Trận Khí Tùy Thân)
  let swarmDamageDealt = 0;
  let ultDamageDealt = 0;
  let swarmTriggered = false;
  let ultTriggered = false;

  if (equippedArraySetId && arrayProgress && FORMATION_SETS_REGISTRY[equippedArraySetId]) {
    const arrayConfig = FORMATION_SETS_REGISTRY[equippedArraySetId];
    const currentPieces = arrayProgress.currentPieces || 0;

    if (currentPieces > 0) {
      let turnDamagePercent = 0;
      for (const threshold of arrayConfig.thresholdBonuses) {
        if (currentPieces >= threshold.requiredPieces && threshold.effects?.turnDamagePercent) {
          turnDamagePercent = Math.max(turnDamagePercent, threshold.effects.turnDamagePercent);
        }
      }

      if (turnDamagePercent > 0) {
        swarmTriggered = true;
        const damageRatio = turnDamagePercent > 1 ? turnDamagePercent / 100 : turnDamagePercent;
        swarmDamageDealt = Math.round(playerAtk * damageRatio);

        const setName = equippedArraySetId === 'chu_thien_kiem'
          ? '【Tam Thập Lục Chu Thiên Kiếm Trận】'
          : `【${arrayConfig.name}】`;
        combatLogs.push(`${setName} xoay chuyển tuần hoàn, ${currentPieces} đạo kiếm quang xé gió giáng thẳng xuống đối thủ!`);
      }

      // Mốc 36/36: Cứ mỗi 3 lượt đấu (turnNumber % 3 === 0) kích hoạt Tuyệt Kỹ 【Chu Thiên Vạn Kiếm Trận】 quét sạch 250% sát thương
      const isMilestone36 = currentPieces >= 36 || (currentPieces >= arrayConfig.maxPieces && arrayConfig.thresholdBonuses.some(t => t.requiredPieces === arrayConfig.maxPieces && t.effects.unlockedSkillName));
      if (isMilestone36 && turnNumber > 0 && turnNumber % 3 === 0) {
        ultTriggered = true;
        ultDamageDealt = Math.round(playerAtk * 2.50);
        combatLogs.push('【Chu Thiên Vạn Kiếm Trận】 bộc phát uy lực kinh thiên! Vạn đạo kiếm mang quét sạch 250% sát thương diện rộng!');
      }
    }
  }

  // 2. Vòng lặp Tấn Công Thường (Lôi Kiếp Thần Binh)
  const targetDefFactor = 1000 / (1000 + Math.max(0, targetDef));
  const rawDamage = Math.max(1, Math.round(playerAtk * targetDefFactor));

  let lightningPiercingDamage = 0;
  let lightningParalysisTriggered = false;
  let targetSkipsNextTurn = false;

  if (weapon?.lightningTempering?.isTempered === true) {
    const lt = weapon.lightningTempering;
    const bonusPercent = typeof lt.lightningElementBonus === 'number' ? lt.lightningElementBonus : 35;
    const bonusRatio = bonusPercent > 1 ? bonusPercent / 100 : bonusPercent;

    // Sát thương Lôi Sát xuyên giáp (bỏ qua targetDef)
    lightningPiercingDamage = Math.round(playerAtk * bonusRatio);

    // Tỷ lệ 20% gây 【Thiên Lôi Tê Liệt】
    const procChance = typeof lt.paralysisProcChance === 'number'
      ? (lt.paralysisProcChance > 1 ? lt.paralysisProcChance / 100 : lt.paralysisProcChance)
      : 0.20;
    const roll = randomFn();
    if (roll < procChance) {
      lightningParalysisTriggered = true;
      targetSkipsNextTurn = true;
      combatLogs.push('【Cửu Tiêu Thiên Lôi】 bộc phát! Luồng lôi đình kinh thiên đánh trúng huyệt đạo, khiến đối thủ bị tê liệt mất 1 lượt xuất chiêu!');
    }
  }

  // Tổng hợp sát thương lượt này
  const finalDamageDealt = rawDamage + swarmDamageDealt + ultDamageDealt + lightningPiercingDamage;
  const targetRemainingHp = Math.max(0, targetHp - finalDamageDealt);

  // Đối thủ tê liệt thì không thể xuất chiêu đòn đánh kế tiếp (gián đoạn đòn đánh)
  let actualDamageReceived = incomingBossDamage;
  if (lightningParalysisTriggered) {
    actualDamageReceived = 0;
  }

  const playerRemainingHp = Math.min(
    playerMaxHp,
    Math.max(0, playerHp - actualDamageReceived)
  );

  return {
    swarmDamageDealt,
    ultDamageDealt,
    swarmTriggered,
    ultTriggered,
    lightningPiercingDamage,
    lightningParalysisTriggered,
    targetSkipsNextTurn,
    rawDamage,
    finalDamageDealt,
    targetRemainingHp,
    actualDamageReceived,
    playerRemainingHp,
    combatLogs
  };
}


