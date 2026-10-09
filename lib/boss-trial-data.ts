// lib/boss-trial-data.ts
// Dữ liệu & Động Cơ Mô Phỏng Hệ Thống Thí Luyện Trảm Boss (3 Chế Độ & Chiến Báo Trực Quan)

import {
  PlayerStats,
  Boss,
  TowerFloorInfo,
  WorldBossState,
  DetailedBattleReport,
  CombatRoundLog,
  LinhCanElement,
  Pill,
  Ore,
  Manual
} from '@/lib/types';
import { calculateCombatStats } from '@/lib/destiny-data';
import { calculateCombatPower, getMaxKhiHuyet } from '@/lib/game-logic';
import { getElementalCombatModifier } from '@/lib/elemental-system';
import { getBondedCompanionBuffs, COMPANIONS_MAP } from '@/lib/companions-data';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';
import { PILL_TEMPLATES, DEFAULT_ORES } from '@/lib/alchemy-data';
import realmsData from '@/data/realms-data.json';
import { processCombatTalismans } from '@/lib/talisman-logic';
import { processSpiritCombatTrigger } from '@/lib/natal-artifact-logic';
import { checkAndConsumeAncestralDeathWard } from '@/lib/ancestral-blessing-logic';
import { processCombatDivineAbilities } from '@/lib/divine-abilities-logic';
import {
  detectActiveDomainResonances,
  resolveResonanceTurnEffects,
  getPlayerEquippedManualList
} from '@/lib/domain-resonance-logic';

// ============================================
// 1. CHẾ ĐỘ 2: TRẤN MA THÁP (100 TẦNG LEO THÁP)
// ============================================

const TOWER_CREATURE_NAMES: string[] = [
  'U Hồn Hạt Tử', 'Huyết Tích Dịch', 'Xích Diễm Khuyển', 'Hàn Băng Chu', 'Độc Vụ Bọ Cạp',
  'Cương Thi Thiết Giáp', 'Cuồng Ma Dã Lang', 'Hắc Thủy Mãng Xà', 'Thực Cốt Ưng', 'U Minh Quỷ Tốt'
];

const TOWER_ELITE_NAMES: string[] = [
  'Xích Luyện Yêu Tướng', 'Hoàng Tuyền Quỷ Tướng', 'Huyết Dực Điêu Vương', 'Bách Độc Chu Chúa',
  'Cửu U Hổ Tướng', 'Lôi Quang Báo Tướng', 'Huyền Minh Ma Tướng', 'Thiên Phong Điêu Tướng'
];

const TOWER_OVERLORD_NAMES: string[] = [
  'Cửu U Minh Vương Ma Quân', 'Thái Cổ Viêm Ma Quân Thượng', 'Bất Diệt Huyết Ma Tôn',
  'Hỗn Độn Ma Quân', 'Hoàng Tuyền Đế Quân', 'Vạn Ma Chi Chủ', 'Thượng Cổ Dạ Xoa Tôn',
  'Hư Không Thôn Thiên Ma', 'Bát Hoang Diệt Thế Ma Tôn', 'Thái Sơ Vô Cực Ma Tổ'
];

export function getTowerFloorInfo(floor: number): TowerFloorInfo {
  const safeFloor = Math.max(1, Math.min(100, floor));
  const isOverlord = safeFloor % 10 === 0;
  const isElite = !isOverlord && safeFloor % 5 === 0;
  const type = isOverlord ? 'overlord' : isElite ? 'elite' : 'normal';

  // Tên Boss và cảnh giới tương ứng
  let bossName = '';
  if (isOverlord) {
    const idx = Math.min(TOWER_OVERLORD_NAMES.length - 1, Math.floor(safeFloor / 10) - 1);
    bossName = `[Tầng ${safeFloor}] ${TOWER_OVERLORD_NAMES[idx]}`;
  } else if (isElite) {
    const idx = Math.min(TOWER_ELITE_NAMES.length - 1, Math.floor(safeFloor / 5) - 1);
    bossName = `[Tầng ${safeFloor}] ${TOWER_ELITE_NAMES[idx]}`;
  } else {
    const idx = (safeFloor - 1) % TOWER_CREATURE_NAMES.length;
    bossName = `[Tầng ${safeFloor}] ${TOWER_CREATURE_NAMES[idx]}`;
  }

  // Cảnh giới và chiến lực tăng dần theo số tầng
  const realmLevel = Math.min(realmsData.length - 1, Math.floor(safeFloor * 0.95));
  const baseMultiplier = isOverlord ? 1.45 : isElite ? 1.25 : 1.0;
  const combatPower = Math.floor(
    (15000 + safeFloor * 4800 + Math.pow(safeFloor, 1.42) * 750) * baseMultiplier
  );

  const elements: LinhCanElement[] = ['hoa', 'bang', 'loi', 'am', 'phong', 'kim', 'tho', 'moc'];
  const element = elements[safeFloor % elements.length];

  const rewards = {
    tuVi: Math.floor((3000 + safeFloor * 1200 + Math.pow(safeFloor, 1.35) * 200) * baseMultiplier),
    linhThach: Math.floor((300 + safeFloor * 120) * baseMultiplier),
    towerPoints: isOverlord ? 50 : isElite ? 25 : 10,
    tinhHuyet: isOverlord ? 4 : isElite ? 2 : 1,
    specialChest: isOverlord ? `Rương Cổ Bảo Trấn Ma Tầng ${safeFloor}` : undefined
  };

  let description = `Yêu dị thú canh giữ tầng ${safeFloor} của Trấn Ma Tháp.`;
  if (isOverlord) {
    description = `Ma Quân Thượng Cổ thống lĩnh tầng ${safeFloor}, tà khí xung thiên, trấn giữ cổ bảo ngút ngàn!`;
  } else if (isElite) {
    description = `Đại Yêu Tướng lĩnh quân tầng ${safeFloor}, thân mang sát khí hung bạo.`;
  }

  return {
    floor: safeFloor,
    name: `Trấn Ma Tháp - Tầng ${safeFloor}`,
    type,
    bossName,
    realmLevel,
    combatPower,
    element,
    rewards,
    description
  };
}

// ============================================
// 2. CHẾ ĐỘ 3: MA THÚ XUẤT THẾ (WORLD BOSS)
// ============================================

export const WORLD_BOSS_CONFIG: WorldBossState = {
  id: 'world_boss_thao_thiet',
  name: 'Cửu Đầu Thao Thiết',
  title: 'Thái Cổ Hung Thú Vạn Niên Giáng Thế',
  currentHp: 10000000,
  maxHp: 10000000,
  element: 'am',
  realmLevel: 45,
  power: 320000,
  description: 'Thượng cổ hung thú phá phong ấn xuất thế, chín đầu phun trào liệt diễm và chướng khí, da dày vảy cứng bất khả xâm phạm.',
  skills: [
    { name: 'Thôn Thiên Thệ Địa', desc: 'Hút cạn linh khí thiên địa tạo chấn động kinh hoàng', dmgMul: 1.8 },
    { name: 'Cửu U Thi Độc', desc: 'Phun độc vụ ăn mòn kinh mạch và phòng ngự', dmgMul: 1.4 },
    { name: 'Hồng Hoang Bá Hống', desc: 'Tiếng gầm xé rách không gian gây chấn nhiếp', dmgMul: 1.5 }
  ],
  milestones: [
    {
      damageReq: 100000,
      title: 'Mốc 1: 100.000 Sát Thương',
      rewards: {
        tuVi: 60000,
        linhThach: 5000,
        tinhHuyet: 5,
        description: 'Tặng +60.000 Tu Vi, 5.000 Linh Thạch, 5 Tinh Huyết'
      }
    },
    {
      damageReq: 500000,
      title: 'Mốc 2: 500.000 Sát Thương',
      rewards: {
        tuVi: 180000,
        linhThach: 15000,
        tinhHuyet: 12,
        pillId: 'pill_dinh_than',
        description: 'Tặng +180.000 Tu Vi, 15.000 Linh Thạch, 12 Tinh Huyết, 2 Định Thần Đan'
      }
    },
    {
      damageReq: 1500000,
      title: 'Mốc 3: 1.500.000 Sát Thương',
      rewards: {
        tuVi: 450000,
        linhThach: 40000,
        tinhHuyet: 25,
        oreId: 'manh_co_bao',
        description: 'Tặng +450.000 Tu Vi, 40.000 Linh Thạch, 25 Tinh Huyết, 1 Mảnh Cổ Bảo Thượng Cổ'
      }
    },
    {
      damageReq: 5000000,
      title: 'Mốc 4: 5.000.000 Sát Thương',
      rewards: {
        tuVi: 120000,
        linhThach: 100000,
        tinhHuyet: 50,
        oreId: 'than_binh_tan_phien',
        description: 'Tặng +1.200.000 Tu Vi, 100.000 Linh Thạch, 50 Tinh Huyết, 2 Thần Binh Tàn Phiến'
      }
    },
    {
      damageReq: 10000000,
      title: 'Mốc 5: 10.000.000 Sát Thương (Trảm Diệt)',
      rewards: {
        tuVi: 3000000,
        linhThach: 300000,
        tinhHuyet: 100,
        oreId: 'than_binh_tan_phien',
        description: 'Trảm sát Ma Thú: +3.000.000 Tu Vi, 300.000 Linh Thạch, 100 Tinh Huyết, 5 Thần Binh Tàn Phiến!'
      }
    }
  ]
};

// ============================================
// 3. ĐỘNG CƠ CHIẾN ĐẤU THEO HIỆP (TURN-BASED SIMULATOR)
// ============================================

export function simulateTurnBasedCombat(
  player: PlayerStats,
  bossInfo: {
    name: string;
    realm: number;
    power: number;
    element: LinhCanElement;
    difficulty?: string;
  },
  usedSkillManualId?: string
): DetailedBattleReport {
  const cStats = calculateCombatStats(player);
  const playerElem = player.linhCan?.element || 'ngu_hanh';
  const bossElem = bossInfo.element;
  const elementalMod = getElementalCombatModifier(playerElem, bossElem);

  // Tính HP nhân vật và Boss
  const playerMaxHp = player.maxKhiHuyet || getMaxKhiHuyet(player.canCot, player.currentRealm, player.equipment);
  const bossMaxHp = Math.max(1000, Math.floor(bossInfo.power * 5.5 + bossInfo.realm * 400));

  let playerCurHp = playerMaxHp;
  let bossCurHp = bossMaxHp;

  // Lực chiến tổng thể & tỉ lệ tương quan
  const playerCombatPower = calculateCombatPower(player);
  let skillDamageMultiplier = 1.0;
  let skillShieldPercent = 0;
  let usedSkillName = '';

  if (usedSkillManualId && player.manuals) {
    const skillManual = player.manuals.find(m => m.id === usedSkillManualId && m.level > 0);
    if (skillManual?.activeSkill) {
      usedSkillName = skillManual.activeSkill.name;
      skillDamageMultiplier = skillManual.activeSkill.damageMultiplier || 1.6;
      skillShieldPercent = skillManual.activeSkill.shieldPercent || 25;
    }
  }

  // Khắc chế & Gia trì
  const compBuffs = getBondedCompanionBuffs(player);
  const activeCompanion = player.companionsState?.activeCompanionId
    ? COMPANIONS_MAP[player.companionsState.activeCompanionId]
    : undefined;
  let hopKichTriggered = false;

  // 1. Thần Thức Áp Chế Trong Combat (Soul Suppression Engine)
  const playerThanThuc = player.thanThuc || cStats.soul || 10;
  const bossThanThuc = Math.max(10, bossInfo.realm * 25 + 35);
  const suppressionRatio = playerThanThuc / Math.max(1, bossThanThuc);

  let bossStunnedTurn1 = false;
  let soulSuppressionDesc = '';
  let soulSuppressionBonus = 1.0;

  if (suppressionRatio >= 1.3) {
    bossStunnedTurn1 = Math.random() < 0.20; // 20% Choáng Turn 1
    soulSuppressionBonus = bossStunnedTurn1 ? 1.30 : 1.15;
    soulSuppressionDesc = `⚡ [UY ÁP THẦN THỨC] Thần thức đạo hữu cuồn cuộn áp chế, ${bossInfo.name} thần hồn chao đảo (Tốc độ -15%)!${bossStunnedTurn1 ? ' 💫 [CHẤN NHIẾP] Boss bị chấn nhiếp tê liệt, mất lượt đánh đầu tiên!' : ''}`;
  } else if (suppressionRatio <= 0.7) {
    soulSuppressionBonus = 0.90;
    soulSuppressionDesc = `⚠️ [UY ÁP THẦN THỨC] ${bossInfo.name} uy áp thần thức kinh người! Thần hồn ngươi chấn động (Tốc độ -10%)!`;
  }

  // 2. Kỹ năng nội tại "Thần Niệm Kiếm" (Ngưng Hồn Hóa Kiếm trở lên)
  const soulStageIdx = typeof player.soulCultivation?.currentStageIndex === 'number'
    ? player.soulCultivation.currentStageIndex
    : (typeof player.soulCultivation?.realmIndex === 'number' ? player.soulCultivation.realmIndex : 0);

  let mindBladeDmg = 0;
  if (soulStageIdx >= 1) {
    const isYangSoul = soulStageIdx >= 3;
    const baseMindBlade = Math.floor(playerThanThuc * 1.8 + (soulStageIdx + 1) * 80);
    mindBladeDmg = isYangSoul ? Math.floor(baseMindBlade * 1.25) : baseMindBlade;
  }

  // 3. Cơ Chế Thân Pháp & Nhịp Độ Chiến Đấu (Action Gauge & Evasion)
  const effectivePlayerSpeed = Math.floor(cStats.speed * (suppressionRatio <= 0.7 ? 0.90 : 1.0));
  const effectiveBossSpeed = Math.max(10, Math.floor((bossInfo.realm * 12 + 25) * (suppressionRatio >= 1.3 ? 0.85 : 1.0)));
  const speedRatio = effectivePlayerSpeed / Math.max(1, effectiveBossSpeed);
  const speedDiff = Math.max(0, effectivePlayerSpeed - effectiveBossSpeed);
  const naturalEvasionRate = Math.min(25, Math.floor(speedDiff * 0.25));
  const totalEvasionRate = Math.min(45, (cStats.dodgeRate || 5) + naturalEvasionRate);

  const companionPowerBonus = compBuffs.bossAssistChance && Math.random() * 100 < compBuffs.bossAssistChance ? 1.35 : 1.0;
  const soulSuppressionActive = Boolean(cStats.soulSuppression || suppressionRatio >= 1.3);
  const dmgReduction = Math.min(60, cStats.dmgReduction || 0);

  const effectivePlayerPower = (playerCombatPower + mindBladeDmg * 3.5) * elementalMod.playerDamageMod * skillDamageMultiplier * companionPowerBonus * soulSuppressionBonus * (speedRatio >= 1.5 ? 1.25 : 1.0);
  const effectiveBossPower = bossInfo.power * (1 - skillShieldPercent / 100) * (1 - dmgReduction / 100);

  // Tỉ lệ chiến thắng cơ sở
  const powerRatio = effectivePlayerPower / Math.max(1, effectiveBossPower);
  let victory = false;
  if (powerRatio >= 1.35) victory = Math.random() < 0.95;
  else if (powerRatio >= 1.15) victory = Math.random() < 0.85;
  else if (powerRatio >= 0.95) victory = Math.random() < 0.65;
  else if (powerRatio >= 0.75) victory = Math.random() < 0.40;
  else victory = Math.random() < 0.18;

  // Mô phỏng diễn biến 3 - 5 hiệp
  const totalRounds = Math.floor(Math.random() * 2) + 3; // 3 - 4 hiệp
  const rounds: CombatRoundLog[] = [];
  const usedDivineAbilityTracker = new Set<string>();

  // Thẩm định Dị Tượng Ngũ Hành kích hoạt
  const equippedManualsList = getPlayerEquippedManualList(player);
  const activeResonances = detectActiveDomainResonances(equippedManualsList, player.natalArtifact, player.currentRealm);

  const bossSkillPool = [
    { name: 'Huyết Sát Trảo', desc: 'Ma trảo xé rách không gian, mang theo độc khí ăn mòn' },
    { name: 'Cửu U Hàn Ba', desc: 'Sóng băng giá vạn năm quét ngang làm chậm thần thức' },
    { name: 'Phần Thiên Ma Viêm', desc: 'Ngọn lửa ma giới bùng cháy thiêu đốt hộ thể chân khí' },
    { name: 'Thôn Thiên Cuồng Nộ', desc: 'Cơn thịnh nộ thái cổ bạo phát sát thương uy áp' }
  ];

  for (let r = 1; r <= totalRounds; r++) {
    const isFirstRound = r === 1;
    const isLastRound = r === totalRounds;

    const hpBeforeP = playerCurHp;
    const hpBeforeB = bossCurHp;

    // 1. Nhân vật xuất chiêu
    const isCrit = Math.random() * 100 < cStats.critRate;
    let isDodge = !isFirstRound && Math.random() * 100 < totalEvasionRate;
    const critMul = isCrit ? (cStats.critDmg / 100) : 1.0;

    // Hồi máu Kim Thân
    let hpRegen = 0;
    if (cStats.hpRegenPercent && cStats.hpRegenPercent > 0) {
      hpRegen = Math.floor(playerMaxHp * (cStats.hpRegenPercent / 100));
      playerCurHp = Math.min(playerMaxHp, playerCurHp + hpRegen);
    }

    // Sát thương nhân vật mỗi hiệp
    let pDamageBase = Math.floor(
      (bossMaxHp / (totalRounds + 0.5)) * (0.85 + Math.random() * 0.3) * (victory ? 1.15 : 0.85)
    );
    if (isFirstRound && usedSkillName) {
      pDamageBase = Math.floor(pDamageBase * skillDamageMultiplier);
    }
    pDamageBase = Math.floor(pDamageBase * critMul);

    // Cơ chế Đòn Kép (Double Action): 35% tỷ lệ tung đòn đánh thứ 2 nếu Tốc Độ >= 1.5x
    const isDoubleAction = speedRatio >= 1.5 && Math.random() < 0.35;
    let doubleActionExtraDmg = 0;
    if (isDoubleAction) {
      doubleActionExtraDmg = Math.floor(pDamageBase * 0.50);
      pDamageBase += doubleActionExtraDmg;
    }

    // Kích hoạt Thần Niệm Kiếm ở Turn 1 (Sát thương chuẩn bỏ qua giáp)
    let mindBladePrefix = '';
    if (isFirstRound && mindBladeDmg > 0) {
      bossCurHp = Math.max(0, bossCurHp - mindBladeDmg);
      mindBladePrefix = `🗡️ [Thần Niệm Kiếm] phá không xuất thế! Kiếm khí vô hình xuyên thẳng thức hải đối thủ, gây ${mindBladeDmg.toLocaleString()} sát thương chuẩn!\n`;
      pDamageBase += mindBladeDmg;
    }

    if (isLastRound && victory) {
      pDamageBase = Math.max(pDamageBase, bossCurHp); // Kết liễu
    }

    let pDesc = '';
    if (isFirstRound && usedSkillName) {
      pDesc = `⚡ Vận chuyển Chân Nguyên kích hoạt Thần Thông [${usedSkillName}], uy lực bùng nổ ${isCrit ? '💥 Bạo Kích x' + critMul.toFixed(1) : ''} gây ${pDamageBase.toLocaleString()} sát thương!`;
    } else if (isCrit) {
      pDesc = `💥 Kiếm khí thông huyền phá toái hư không, giáng một đòn Bạo Kích x${critMul.toFixed(1)} gây ${pDamageBase.toLocaleString()} sát thương!`;
    } else {
      pDesc = `Vung vũ khí dẫn động thiên địa linh khí, trảm xuất kình lực gây ${pDamageBase.toLocaleString()} sát thương!`;
    }

    if (isDoubleAction) {
      pDesc += `\n⚡ [THÂN PHÁP TIÊN CƠ • LIÊN KÍCH] Tốc độ x${speedRatio.toFixed(1)} áp đảo! Ngươi lưu lại tàn ảnh, bồi thêm đòn đánh thứ hai gây +${doubleActionExtraDmg.toLocaleString()} sát thương!`;
    }

    // Kích hoạt Thần Thông Bí Thuật Cửu Giai Xuất Chiến
    const divineResult = processCombatDivineAbilities(
      player,
      r,
      playerCurHp,
      playerMaxHp,
      bossCurHp,
      bossMaxHp,
      cStats.atk,
      isCrit,
      usedDivineAbilityTracker
    );
    let divinePrefix = '';
    if (divineResult.triggeredAbilities.length > 0 && divineResult.logs.length > 0) {
      divinePrefix = `${divineResult.logs.join('\n')}\n`;
      if (divineResult.extraDamage > 0) {
        pDamageBase += divineResult.extraDamage;
        bossCurHp = Math.max(0, bossCurHp - divineResult.extraDamage);
      }
      if (divineResult.trueDamage > 0) {
        pDamageBase += divineResult.trueDamage;
        bossCurHp = Math.max(0, bossCurHp - divineResult.trueDamage);
      }
      if (divineResult.shieldValue > 0) {
        playerCurHp = Math.min(playerMaxHp, playerCurHp + divineResult.shieldValue);
      }
      if (divineResult.healValue > 0) {
        playerCurHp = Math.min(playerMaxHp, playerCurHp + divineResult.healValue);
      }
      if (divineResult.executeTriggered) {
        bossCurHp = 0;
      }
    }

    // Kích hoạt Linh Phù Xuất Chiến từ Phù Nang
    const talismanResult = processCombatTalismans(player, r, playerCurHp, playerMaxHp, cStats.atk);
    let talismanPrefix = '';
    if (talismanResult.triggered && talismanResult.logText) {
      talismanPrefix = `${talismanResult.logText}\n`;
      if (talismanResult.shieldAmount) {
        playerCurHp = Math.min(playerMaxHp, playerCurHp + talismanResult.shieldAmount);
      }
      if (talismanResult.healAmount) {
        playerCurHp = Math.min(playerMaxHp, playerCurHp + talismanResult.healAmount);
      }
      if (talismanResult.extraDamage) {
        pDamageBase += talismanResult.extraDamage;
        bossCurHp = Math.max(0, bossCurHp - talismanResult.extraDamage);
      }
    }

    if (isFirstRound) {
      if (mindBladePrefix) pDesc = mindBladePrefix + pDesc;
      if (soulSuppressionDesc) pDesc = soulSuppressionDesc + '\n' + pDesc;
    }
    if (divinePrefix) {
      pDesc = divinePrefix + pDesc;
    }
    if (talismanPrefix) {
      pDesc = talismanPrefix + pDesc;
    }

    // Kích hoạt Dị Tượng Ngũ Hành theo từng hiệp đấu
    if (activeResonances.length > 0) {
      const resTurn = resolveResonanceTurnEffects(
        { hp: playerCurHp, maxHp: playerMaxHp, mp: player.linhLuc || 1000, maxMp: player.maxLinhLuc || 1000, atk: cStats.atk },
        { hp: bossCurHp, maxHp: bossMaxHp, mp: 1000, maxMp: 1000, atk: bossInfo.power },
        activeResonances,
        r
      );
      if (resTurn.appliedDamage > 0) {
        pDamageBase += resTurn.appliedDamage;
        bossCurHp = Math.max(0, bossCurHp - resTurn.appliedDamage);
      }
      if (resTurn.updatedAttacker.hp > playerCurHp) {
        playerCurHp = Math.min(playerMaxHp, resTurn.updatedAttacker.hp);
      }
      if (resTurn.combatEvents.length > 0) {
        pDesc = `${resTurn.combatEvents.join('\n')}\n${pDesc}`;
      }
    }

    // Hiệu ứng Thần Hồn chấn nhiếp / Choáng
    let soulStunned = Boolean((isFirstRound && bossStunnedTurn1) || talismanResult.stunBoss || divineResult.stunTarget);

    // Kích hoạt Chiến Kỹ Hộ Chủ của Bản Mệnh Khí Linh
    const spiritResult = processSpiritCombatTrigger(player, r, playerCurHp, playerMaxHp, bossCurHp, bossMaxHp);
    let spiritLethalBlocked = false;
    if (spiritResult.triggered && spiritResult.logText) {
      pDesc = `${spiritResult.logText}\n${pDesc}`;
      if (spiritResult.extraDamage) {
        pDamageBase += spiritResult.extraDamage;
        bossCurHp = Math.max(0, bossCurHp - spiritResult.extraDamage);
      }
      if (spiritResult.healAmount) {
        playerCurHp = Math.min(playerMaxHp, playerCurHp + spiritResult.healAmount);
      }
      if (spiritResult.stunBoss) {
        soulStunned = true;
      }
      if (spiritResult.blockLethal) {
        spiritLethalBlocked = true;
      }
    }

    if (r === 2 && soulSuppressionActive && Math.random() < 0.4) {
      soulStunned = true;
      pDesc += ` [👁️ Thần Niệm Chấn Nhiếp làm choáng Boss, hồn phách địch nhân hỗn loạn!]`;
    }

    let bossAtkReductionMod = 1.0;
    if (spiritResult.slowBossPercent) {
      bossAtkReductionMod = Math.min(bossAtkReductionMod, 0.75);
    }
    if (divineResult.debuffAtkPercent > 0) {
      bossAtkReductionMod = Math.max(0.2, bossAtkReductionMod * (1 - divineResult.debuffAtkPercent / 100));
    }

    // Tuyệt Kỹ Hợp Kích giữa Người Chơi và Tiên Lữ khi Boss < 35% HP hoặc hiệp cuối chiến thắng
    const canTriggerHopKich = Boolean(activeCompanion && !hopKichTriggered && ((bossCurHp / bossMaxHp <= 0.35) || (isLastRound && victory)));
    if (canTriggerHopKich && activeCompanion) {
      hopKichTriggered = true;
      const compSkill = activeCompanion.combinedSkill;
      pDamageBase = Math.floor(pDamageBase * compSkill.damageMultiplier);
      pDesc = `💫 [TUYỆT KỸ HỢP KÍCH - ${compSkill.name}] Ngươi cùng [${activeCompanion.name}] đồng thanh niệm quyết: "${compSkill.quote}" bạo phát ${pDamageBase.toLocaleString()} sát thương! (${compSkill.bonusEffect})`;
      
      if (activeCompanion.id === 'companion_lac_thanh_tuyet' || activeCompanion.id === 'companion_long_thien_nhi') {
        soulStunned = true; // Băng Phong hoặc Long Khiếu Cửu Thiên: Gây Choáng 1 hiệp
      } else if (activeCompanion.id === 'companion_diep_chi_ham') {
        const extraHeal = Math.floor(playerMaxHp * 0.20);
        hpRegen = (hpRegen || 0) + extraHeal;
        playerCurHp = Math.min(playerMaxHp, playerCurHp + extraHeal);
      } else if (activeCompanion.id === 'companion_tan_vu_mong') {
        isDodge = true;
      } else if (activeCompanion.id === 'companion_da_mong_ly') {
        bossAtkReductionMod = 0.70; // Huyễn Mộng Mê Hồn: Giảm 30% Công Kích đối thủ
      }
    }

    bossCurHp = Math.max(0, bossCurHp - pDamageBase);

    // 2. Boss phản đòn (nếu chưa bị hạ gục và không bị choáng)
    let bDamage = 0;
    let bSkillName = 'Ma Lực Kích';
    let bDesc = '';

    if (bossCurHp > 0 && !soulStunned) {
      const bossSkill = bossSkillPool[(r - 1) % bossSkillPool.length];
      bSkillName = bossSkill.name;

      if (isDodge) {
        bDamage = 0;
        bDesc = `💨 [Né Tránh • Huyễn Ảnh] Thân pháp như huyễn ảnh xuất quỷ nhập thần! ${bossInfo.name} xuất chiêu [${bossSkill.name}] hoàn toàn đánh vào hư không, không gây mảy may tổn thất!`;
      } else {
        const baseBDmg = Math.floor(
          (playerMaxHp / (totalRounds + 1.2)) * (0.8 + Math.random() * 0.4) * (victory ? 0.75 : 1.25) * bossAtkReductionMod
        );
        bDamage = Math.max(50, Math.floor(baseBDmg * (1 - dmgReduction / 100)));
        if (isLastRound && !victory) {
          bDamage = Math.max(bDamage, playerCurHp); // Boss kết liễu người chơi
        }

        if (divineResult.invulnerable) {
          bDamage = 0;
          bDesc = `🛡️ [THẦN THÔNG HƯ VÔ] Thân thể dung nhập hư không vô tận, triệt tiêu toàn bộ đòn công kích từ ${bossInfo.name}!`;
        } else if (spiritLethalBlocked && bDamage >= playerCurHp) {
          bDamage = 0;
          bDesc = `🛡️ [KHÍ LINH HỘ CHỦ] Hào quang Khí Linh bùng nổ, tạo kim cang tráo triệt tiêu hoàn toàn sát chiêu tử kiếp từ ${bossInfo.name}!`;
        } else {
          const debuffText = bossAtkReductionMod < 1 ? ' [Giảm Công Kích]' : '';
          bDesc = `[${bossInfo.name}] rống giận thi triển [${bossSkill.name}], ${bossSkill.desc}, đánh trúng gây ${bDamage.toLocaleString()} sát thương${debuffText}${dmgReduction > 0 ? ` (Miễn thương hóa giải ${dmgReduction}%)` : ''}!`;
          if (divineResult.reflectPercent > 0 && bDamage > 0) {
            const reflectedDmg = Math.floor(bDamage * (divineResult.reflectPercent / 100));
            bossCurHp = Math.max(0, bossCurHp - reflectedDmg);
            bDesc += ` ⚡ [PHẢN PHỆ] Hộ thể thần quang dội ngược ${reflectedDmg.toLocaleString()} sát thương về phía ${bossInfo.name}!`;
          }
        }
      }

      playerCurHp = Math.max(0, playerCurHp - bDamage);
      if (playerCurHp <= 0) {
        if (divineResult.deathWardTriggered) {
          playerCurHp = Math.max(1, divineResult.healValue || Math.floor(playerMaxHp * 0.35));
          bDesc += `\n🌟 [BẤT TỬ NIẾT BÀN] Hào quang thần thông cứu mạng, niết bàn chuyển tử thành sinh!`;
        } else {
          const wardRes = checkAndConsumeAncestralDeathWard(player);
          if (wardRes.triggered) {
            playerCurHp = Math.max(1, Math.floor(playerMaxHp * 0.2));
            bDesc += `\n${wardRes.combatMessage}`;
            if (isLastRound && !victory) {
              if (Math.random() < 0.5) {
                victory = true;
                bossCurHp = 0;
                pDesc += `\n⚡ [NGHỊCH CHUYỂN CÀN KHÔN] Nhận được phúc ấm tổ tiên gia trì, đạo hữu phản kích bộc phát nghịch chuyển sinh tử!`;
              }
            }
          }
        }
      }
    } else if (soulStunned) {
      bDesc = `Boss bị Thần Niệm Chấn Nhiếp áp chế ngưng trệ, không thể phản kích trong hiệp này!`;
    } else {
      bDesc = `[${bossInfo.name}] kêu rống thảm thiết, nguyên thần tan rã gục ngã dưới chân đạo hữu!`;
    }

    rounds.push({
      round: r,
      playerHpBefore: hpBeforeP,
      bossHpBefore: hpBeforeB,
      playerAction: {
        skillName: isFirstRound ? usedSkillName : undefined,
        isCrit,
        isDodge,
        damage: pDamageBase,
        soulSuppressed: soulStunned,
        hpRegen,
        description: pDesc
      },
      bossAction: {
        skillName: bSkillName,
        damage: bDamage,
        isCrit: Math.random() < 0.15,
        description: bDesc
      },
      playerHpAfter: playerCurHp,
      bossHpAfter: bossCurHp
    });

    if (bossCurHp <= 0 || playerCurHp <= 0) break;
  }

  // Nếu người chơi thất bại, chẩn đoán nguyên nhân rõ ràng
  let lossReason = '';
  if (!victory) {
    if (elementalMod.playerDamageMod < 1) {
      lossReason = `Ngũ Hành bị khắc chế nghiêm trọng (${elementalMod.description}), sát thương sụt giảm 20% và phải chịu uy lực ma pháp nhân đôi.`;
    } else if (playerMaxHp < bossInfo.power * 2.5) {
      lossReason = `Sinh Lực Khí Huyết quá mỏng manh trước bạo kích của Ma Thú! Khuyên đạo hữu hãy Tôi Thể Nhục Thân để gia tăng mạnh HP tối đa.`;
    } else if (cStats.def < bossInfo.power * 0.35) {
      lossReason = `Phòng Ngự chưa đủ vững vàng để triệt tiêu ma trảo xé rách! Cần cường hóa Giáp Trụ và tu luyện Thể Thuật Công Pháp.`;
    } else {
      lossReason = `Chiến lực tổng thể chưa đủ áp chế Ma Thú hung hãn. Hãy nâng cấp Cảnh Giới, Luyện Khí Thần Binh và bồi đắp Linh Căn.`;
    }
  }

  // Phần thưởng nếu thắng
  let rewards: DetailedBattleReport['rewards'] = undefined;
  if (victory) {
    // Tinh Huyết rơi 100%
    const baseTinhHuyet = bossInfo.difficulty === 'legendary' ? 4 : bossInfo.difficulty === 'hard' ? 3 : 2;

    // Quẻ mệnh [Trung Cát / Thượng Cát / Đại Cát]: Tăng 10% - 15% tỉ lệ rớt đồ từ Boss Thí Luyện
    const dropRateBonus = player.dailyDivination?.hexagram === 'trung_cat' 
      ? 0.10 
      : (player.dailyDivination?.hexagram === 'dai_cat' || player.dailyDivination?.hexagram === 'thuong_cat' ? 0.15 : 0);

    // Tỉ lệ rơi Mảnh Cổ Bảo
    let droppedOre: Ore | undefined = undefined;
    if (Math.random() < 0.45 + dropRateBonus) {
      droppedOre = {
        id: 'manh_co_bao',
        name: 'Mảnh Cổ Bảo Thượng Cổ',
        grade: 'Tứ Phẩm',
        description: 'Mảnh vỡ từ pháp bảo thượng cổ rơi rớt khi trảm sát ma thú, dùng để đúc tạo bảo khí thần uy.',
        price: 2500,
        quantity: Math.floor(Math.random() * 2) + 1
      };
    } else {
      const normalOre = DEFAULT_ORES[Math.min(DEFAULT_ORES.length - 1, Math.floor(bossInfo.realm / 10))];
      if (normalOre) droppedOre = { ...normalOre, quantity: 1 };
    }

    // Tỉ lệ rơi Đan Dược
    let droppedPill: Pill | undefined = undefined;
    if (Math.random() < 0.60 + dropRateBonus) {
      const pKeys = ['pill_khi_huyet', 'pill_dinh_than', 'pill_tay_tuy', 'pill_cuong_bao', 'pill_hoi_thien'];
      const pick = pKeys[Math.floor(Math.random() * pKeys.length)];
      if (PILL_TEMPLATES[pick]) {
        droppedPill = { ...PILL_TEMPLATES[pick], quantity: 1 };
      }
    }

    // Tỉ lệ rơi Bí Tịch
    let droppedManual: Manual | undefined = undefined;
    if (Math.random() < 0.25 + dropRateBonus) {
      const suitable = DEFAULT_MANUALS.filter(m => bossInfo.realm >= 15 ? m.grade !== 'Hoàng Giai' : true);
      if (suitable.length > 0) {
        droppedManual = suitable[Math.floor(Math.random() * suitable.length)];
      }
    }

    rewards = {
      tuVi: Math.floor(bossInfo.power * 2.8 + bossInfo.realm * 300),
      linhThach: Math.floor(bossInfo.power * 0.25 + 150),
      danhVong: 25 + bossInfo.realm * 5,
      tinhHuyet: baseTinhHuyet,
      droppedPill,
      droppedOre,
      droppedManual,
      specialItems: droppedOre?.name ? [droppedOre.name] : []
    };
  }

  return {
    victory,
    bossName: bossInfo.name,
    bossRealm: bossInfo.realm,
    bossElement: bossElem,
    bossDifficulty: bossInfo.difficulty || 'Thường',
    bossMaxHp,
    playerMaxHp,
    rounds,
    finalPlayerHp: playerCurHp,
    finalBossHp: bossCurHp,
    rewards,
    lossReason,
    activeResonances,
    companionUltimateTriggered: hopKichTriggered,
    companionUltimateName: hopKichTriggered && activeCompanion ? activeCompanion.combinedSkill.name : undefined,
    companionUltimateDesc: hopKichTriggered && activeCompanion ? activeCompanion.combinedSkill.desc : undefined,
    companionUltimateQuote: hopKichTriggered && activeCompanion ? activeCompanion.combinedSkill.quote : undefined,
    companionName: hopKichTriggered && activeCompanion ? activeCompanion.name : undefined,
    companionAvatar: hopKichTriggered && activeCompanion ? activeCompanion.avatar : undefined
  };
}
