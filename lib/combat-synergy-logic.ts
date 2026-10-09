// lib/combat-synergy-logic.ts
// Pure Business Logic cho phân hệ Kỹ Thuật Hợp Kích: Tam Vị Nhất Thể

import type { PlayerStats } from './types/player';
import type {
  SynergySkillDefinition,
  SynergySkillId,
  TrinitySynergyGaugeState,
  ActiveSynergyEffect,
  SynergyActivationResult,
  PlayerSynergyState,
  SynergyEffectType,
} from './types/combat-synergy';
import {
  SYNERGY_SKILLS,
  SYNERGY_SKILLS_MAP,
  GAUGE_GAIN_CONFIG,
  createDefaultTrinitySynergyGaugeState,
} from './combat-synergy-data';
import type { CombatStats } from './types/combat';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Lấy Hảo cảm Đồng Hành đang active */
function getActiveCompanionAffinity(player: PlayerStats): number {
  const compState = player.companionsState || player.companions;
  if (!compState) return 0;
  const activeId = compState.activeCompanionId;
  if (!activeId) return 0;
  return compState.companions?.[activeId]?.affinity ?? 0;
}

/** Lấy ID Đồng Hành đang active */
function getActiveCompanionId(player: PlayerStats): string | null {
  const compState = player.companionsState || player.companions;
  return compState?.activeCompanionId ?? null;
}

/** Lấy Linh Thú đang triển khai */
function getDeployedBeast(player: PlayerStats) {
  const beasts = player.spiritBeasts || player.beasts || [];
  const activeBeastId = player.activeBeastId;
  if (!activeBeastId) return null;
  return beasts.find(b => b.id === activeBeastId) ?? null;
}

/** Lấy Khí Linh Bản Mệnh */
function getArtifactSpirit(player: PlayerStats) {
  return player.natalArtifact?.spirit ?? null;
}

/** Kiểm tra xem người chơi có mang kiếm pháp không */
function hasEquippedSwordManual(player: PlayerStats): boolean {
  const manuals = player.manuals || [];
  const equippedSlots = player.equippedManuals;
  if (!equippedSlots) return false;
  const equippedIds = Object.values(equippedSlots).filter(Boolean) as string[];
  return equippedIds.some(id => {
    const m = manuals.find(mn => mn.id === id);
    return m?.type === 'sword' || m?.id?.includes('sword') || m?.id?.includes('kiem');
  });
}

// ─── Eligibility Check ───────────────────────────────────────────────────────

/**
 * Kiểm tra đủ điều kiện kích hoạt một Tuyệt Kỹ Hợp Kích cụ thể.
 * Pure function — không có side effects.
 */
export function checkSynergyEligibility(
  player: PlayerStats,
  skill: SynergySkillDefinition
): boolean {
  const cond = skill.triggerConditions;
  const beast = getDeployedBeast(player);
  const spirit = getArtifactSpirit(player);
  const activeCompanionAffinity = getActiveCompanionAffinity(player);

  // Phải có Linh Thú đang triển khai
  if (!beast) return false;

  // Phải có Khí Linh Bản Mệnh
  if (!spirit) return false;

  // Kiểm tra giai đoạn tối thiểu của Linh Thú
  if (cond.beastMinStage && beast.stage < cond.beastMinStage) return false;

  // Kiểm tra hảo cảm tối thiểu của Đồng Hành
  if (cond.minCompanionAffinity && cond.minCompanionAffinity > 0) {
    if (activeCompanionAffinity < cond.minCompanionAffinity) return false;
  }

  // Kiểm tra hảo cảm tối thiểu của Khí Linh
  if (cond.minSpiritIntimacy && spirit.intimacy < cond.minSpiritIntimacy) return false;

  // Kiểm tra cá tính Khí Linh
  if (cond.spiritPersonality && spirit.personality !== cond.spiritPersonality) return false;

  // Kiểm tra nguyên tố người chơi
  if (cond.playerElement) {
    const playerElem = player.linhCan?.element;
    if (playerElem !== cond.playerElement) return false;
  }

  // Kiểm tra nguyên tố Linh Thú (cho phép phong=lôi cho skill phong_loi_tru_tien)
  if (cond.beastElement) {
    const beastElem = beast.element;
    if (skill.id === 'phong_loi_tru_tien') {
      // Cho phép cả 'phong' và 'loi'
      if (beastElem !== 'phong' && beastElem !== 'loi') return false;
    } else {
      if (beastElem !== cond.beastElement) return false;
    }
  }

  // Kiểm tra quyển thư kiếm pháp
  if (cond.requiresManual === 'sword') {
    if (!hasEquippedSwordManual(player)) return false;
  }

  return true;
}

/**
 * Trả về danh sách tất cả Tuyệt Kỹ Hợp Kích mà người chơi đủ điều kiện,
 * ưu tiên theo thứ tự đặc thù (cao) -> phổ quát (thấp).
 */
export function getEligibleSynergySkills(player: PlayerStats): SynergySkillDefinition[] {
  const PRIORITY_ORDER: SynergySkillId[] = [
    'hu_khong_tuyet_kiem',
    'thien_dia_phong_yin',
    'phong_loi_tru_tien',
    'luc_hop_hun_nguyen',
    'van_linh_trieu_tong',
    'tam_hoa_quy_nguyen',
  ];
  return PRIORITY_ORDER
    .map(id => SYNERGY_SKILLS_MAP[id])
    .filter(skill => checkSynergyEligibility(player, skill));
}

// ─── Gauge Accumulation ──────────────────────────────────────────────────────

/** Loại sự kiện tích lũy Nộ Khí */
export type GaugeEvent =
  | 'hit'
  | 'crit'
  | 'take_damage'
  | 'round_end'
  | 'beast_skill'
  | 'spirit_trigger'
  | 'companion_assist';

/**
 * Tính lượng Nộ Khí tăng sau một sự kiện chiến đấu.
 * Pure function.
 * Khi có Tiên Đồng trợ trận (hasDeployedChild = true), gia tốc +25% nộ khí và tăng round_end từ 18 lên 24.
 */
export function calculateGaugeGain(
  event: GaugeEvent,
  hasDeployedBeast: boolean,
  hasSpiritCompanion: boolean,
  hasDeployedChild: boolean = false
): number {
  if (!hasDeployedBeast || !hasSpiritCompanion) return 0;

  let gain = 0;
  switch (event) {
    case 'hit': gain = GAUGE_GAIN_CONFIG.onHit; break;
    case 'crit': gain = GAUGE_GAIN_CONFIG.onCrit; break;
    case 'take_damage': gain = GAUGE_GAIN_CONFIG.onTakeDamage; break;
    case 'round_end': gain = hasDeployedChild ? 24 : GAUGE_GAIN_CONFIG.onRoundEnd; break;
    case 'beast_skill': gain = GAUGE_GAIN_CONFIG.onBeastSkill; break;
    case 'spirit_trigger': gain = GAUGE_GAIN_CONFIG.onSpiritTrigger; break;
    case 'companion_assist': gain = GAUGE_GAIN_CONFIG.onCompanionAssist; break;
    default: gain = 0;
  }

  // Gia tốc tích lũy Nộ Khí +25% khi có Tiên Đồng trợ trận
  if (hasDeployedChild && event !== 'round_end' && gain > 0) {
    gain = Math.ceil(gain * 1.25);
  }

  return gain;
}

/**
 * Cập nhật gauge sau một sự kiện, clamp trong [0, maxGauge].
 */
export function applyGaugeGain(
  gauge: TrinitySynergyGaugeState,
  event: GaugeEvent,
  hasDeployedBeast: boolean,
  hasSpiritCompanion: boolean,
  hasDeployedChild: boolean = false
): TrinitySynergyGaugeState {
  const gain = calculateGaugeGain(event, hasDeployedBeast, hasSpiritCompanion, hasDeployedChild);
  if (gain === 0) return gauge;

  const newGauge = Math.min(gauge.maxGauge, gauge.currentGauge + gain);
  return { ...gauge, currentGauge: newGauge };
}

/**
 * Giảm cooldown mỗi hiệp.
 */
export function tickGaugeCooldown(gauge: TrinitySynergyGaugeState): TrinitySynergyGaugeState {
  if (gauge.cooldownRoundsRemaining <= 0) return gauge;
  return { ...gauge, cooldownRoundsRemaining: gauge.cooldownRoundsRemaining - 1 };
}

/**
 * Giảm số hiệp còn lại của các hiệu ứng đang hoạt động, loại bỏ hết hạn.
 */
export function tickActiveEffects(gauge: TrinitySynergyGaugeState): TrinitySynergyGaugeState {
  const remainingEffects = gauge.activeEffects
    .map(e => ({ ...e, roundsRemaining: e.roundsRemaining - 1 }))
    .filter(e => e.roundsRemaining > 0);
  return { ...gauge, activeEffects: remainingEffects };
}

// ─── Synergy Activation ──────────────────────────────────────────────────────

/**
 * Thực thi một lần kích hoạt Tuyệt Kỹ Hợp Kích.
 * Trả về SynergyActivationResult và gauge state mới.
 */
export function activateSynergySkill(
  player: PlayerStats,
  cStats: CombatStats,
  gauge: TrinitySynergyGaugeState,
  skillId: SynergySkillId,
  enemyMaxHp: number,
  playerMaxHp: number
): { result: SynergyActivationResult; newGauge: TrinitySynergyGaugeState } {
  const skill = SYNERGY_SKILLS_MAP[skillId];
  if (!skill) {
    return {
      result: {
        skillId,
        skillName: 'Không rõ',
        triggered: false,
        totalDamage: 0,
        isCrit: false,
        healAmount: 0,
        shieldAmount: 0,
        newEffects: [],
        message: 'Không tìm thấy chiêu thức.',
        cutInData: { durationMs: 0, particleColor: '#fff', glowColor: '#fff', soundType: 'hit', flashIntensity: 'low' },
        quote: '',
      },
      newGauge: gauge,
    };
  }

  const com = skill.combat;
  const baseAtk = cStats.atk;
  const ignoreDefFactor = 1 + com.ignoreDefPercent / 100;

  // Tính sát thương cơ bản
  const isCrit = Math.random() * 100 < (cStats.critRate + com.critRateBonus);
  let damage = baseAtk * com.baseDamageMultiplier * ignoreDefFactor;
  if (isCrit) {
    damage *= (cStats.critDmg + com.critDmgBonus) / 100;
  }
  damage = Math.floor(damage);

  // True damage thêm vào
  let trueDamage = 0;
  com.effects.forEach(eff => {
    if (eff.type === 'true_damage' && Math.random() * 100 < eff.chance) {
      trueDamage = Math.floor(baseAtk * (eff.value / 100));
    }
  });
  // Kiểm tra Tiên Đồng xuất chiến trợ trận (Tứ Trận Quy Nhất)
  const deployedChildId = player.offspringState?.deployedChildId;
  const deployedChild = deployedChildId
    ? player.offspringState?.children?.find(c => c.id === deployedChildId && (c.isDeployed || c.stage === 'adult'))
    : null;

  let offspringDamage = 0;
  if (deployedChild) {
    offspringDamage = Math.floor(baseAtk * 1.5); // 150% ATK sát thương chuẩn
  }

  const totalDamage = damage + trueDamage + offspringDamage;

  // Hồi HP
  const healAmount = com.healPercentOfMaxHp
    ? Math.floor(playerMaxHp * (com.healPercentOfMaxHp / 100))
    : 0;

  // Khiên
  const shieldAmount = com.shieldPercentOfMaxHp
    ? Math.floor(playerMaxHp * (com.shieldPercentOfMaxHp / 100))
    : 0;

  // Tạo danh sách hiệu ứng mới
  const newEffects: ActiveSynergyEffect[] = [];
  com.effects.forEach(eff => {
    if (eff.type === 'true_damage') return; // Đã xử lý
    if (Math.random() * 100 < eff.chance) {
      newEffects.push({
        type: eff.type,
        value: eff.value,
        roundsRemaining: eff.durationRounds ?? 1,
        sourceSkillId: skillId,
      });
    }
  });

  // Mô tả kết quả
  let message = `🌟 HỢP KÍCH [${skill.name}] bùng phát! Gây ${totalDamage.toLocaleString()} sát thương${isCrit ? ' BẠO KÍCH!' : ''}!`;
  if (healAmount > 0) message += ` Hồi phục ${healAmount.toLocaleString()} Khí Huyết.`;
  if (shieldAmount > 0) message += ` Ngưng tụ ${shieldAmount.toLocaleString()} Khiên Bảo Hộ.`;
  if (newEffects.length > 0) {
    const effNames = newEffects.map(e => getEffectDisplayName(e.type)).join(', ');
    message += ` Áp chế: [${effNames}].`;
  }
  if (deployedChild) {
    message += `\n🌟 [HUYẾT MẠCH TƯƠNG LIÊN] Tiên Đồng [${deployedChild.name}] dẫn động Hỗn Độn Kiếm Quang tương trợ phụ mẫu, bồi thêm ${offspringDamage.toLocaleString()} sát thương chuẩn và xóa sạch mọi hiệu ứng bất lợi!`;
  }

  // Gauge mới
  const gaugeAfter: TrinitySynergyGaugeState = {
    ...gauge,
    currentGauge: gauge.currentGauge - com.gaugeConsumed,
    lastSkillUsedId: skillId,
    cooldownRoundsRemaining: com.cooldownRounds,
    triggeredThisBattle: true,
    totalSynergyActivations: gauge.totalSynergyActivations + 1,
    activeEffects: [...gauge.activeEffects, ...newEffects],
  };

  return {
    result: {
      skillId,
      skillName: skill.name,
      triggered: true,
      totalDamage,
      isCrit,
      healAmount,
      shieldAmount,
      newEffects,
      message,
      cutInData: skill.cutIn,
      quote: skill.quote,
      hasOffspringAssist: Boolean(deployedChild),
      offspringDamage,
      offspringName: deployedChild?.name,
      cleansedDebuffs: Boolean(deployedChild),
    },
    newGauge: gaugeAfter,
  };
}

/**
 * Kiểm tra và tự động kích hoạt Hợp Kích nếu đủ điều kiện.
 * Ưu tiên chiêu cao nhất. Trả về null nếu không kích hoạt.
 */
export function tryAutoActivateSynergy(
  player: PlayerStats,
  cStats: CombatStats,
  gauge: TrinitySynergyGaugeState,
  enemyMaxHp: number,
  playerMaxHp: number,
  playerCurrentHp: number
): { result: SynergyActivationResult; newGauge: TrinitySynergyGaugeState } | null {
  // Không được kích hoạt nếu còn cooldown
  if (gauge.cooldownRoundsRemaining > 0) return null;
  // Phải đủ Nộ Khí
  if (gauge.currentGauge < gauge.maxGauge) {
    // Cho phép kích hoạt sớm nếu HP nguy kịch (< 20%)
    const isHpCritical = playerCurrentHp / playerMaxHp < 0.20;
    if (!isHpCritical || gauge.currentGauge < 60) return null;
  }

  const eligible = getEligibleSynergySkills(player);
  if (eligible.length === 0) return null;

  const best = eligible[0];
  // Đảm bảo đủ gauge để kích hoạt chiêu đó
  if (gauge.currentGauge < best.combat.gaugeConsumed) return null;

  return activateSynergySkill(player, cStats, gauge, best.id, enemyMaxHp, playerMaxHp);
}

// ─── Effects Application ─────────────────────────────────────────────────────

/** Áp dụng các hiệu ứng đang hoạt động lên sát thương hoặc HP */
export function applyActiveEffectsToEnemyDamage(
  enemyHp: number,
  enemyMaxHp: number,
  effects: ActiveSynergyEffect[]
): { newEnemyHp: number; effectMessages: string[] } {
  let hp = enemyHp;
  const messages: string[] = [];

  effects.forEach(eff => {
    if (eff.roundsRemaining <= 0) return;
    if (eff.type === 'dot_burn') {
      const burnDmg = Math.floor(enemyMaxHp * (eff.value / 100));
      hp = Math.max(0, hp - burnDmg);
      messages.push(`🔥 DoT Thiêu Đốt gây ${burnDmg.toLocaleString()} sát thương!`);
    }
  });

  return { newEnemyHp: hp, effectMessages: messages };
}

/** Lấy hệ số điều chỉnh ATK đối thủ từ debuff */
export function getEnemyAtkModifierFromEffects(effects: ActiveSynergyEffect[]): number {
  let reduction = 0;
  effects.forEach(eff => {
    if (eff.type === 'debuff_atk' && eff.roundsRemaining > 0) {
      reduction += eff.value;
    }
  });
  return Math.max(0, 1 - reduction / 100);
}

/** Lấy hệ số điều chỉnh Tốc Độ đối thủ từ debuff */
export function getEnemySpeedModifierFromEffects(effects: ActiveSynergyEffect[]): number {
  let reduction = 0;
  effects.forEach(eff => {
    if (eff.type === 'debuff_speed' && eff.roundsRemaining > 0) {
      reduction += eff.value;
    }
  });
  return Math.max(0.1, 1 - reduction / 100);
}

/** Kiểm tra đối thủ có bị Đóng Băng/Choáng không */
export function isEnemyIncapacitated(effects: ActiveSynergyEffect[]): boolean {
  return effects.some(
    e => e.roundsRemaining > 0 && (e.type === 'freeze' || e.type === 'stun')
  );
}

/** Lấy hệ số ATK buff cho người chơi từ hiệu ứng Hợp Kích */
export function getPlayerAtkBuffFromEffects(effects: ActiveSynergyEffect[]): number {
  let bonus = 0;
  effects.forEach(eff => {
    if (eff.type === 'buff_player_atk' && eff.roundsRemaining > 0) {
      bonus += eff.value;
    }
  });
  return 1 + bonus / 100;
}

// ─── PlayerSynergyState Update ───────────────────────────────────────────────

/**
 * Cập nhật PlayerSynergyState sau một lần kích hoạt Hợp Kích.
 */
export function updatePlayerSynergyState(
  state: PlayerSynergyState,
  result: SynergyActivationResult
): PlayerSynergyState {
  if (!result.triggered) return state;

  const prev = state.skillActivationCounts[result.skillId] ?? 0;
  const newUnlocked = [...state.unlockedSkillIds];
  if (!newUnlocked.includes(result.skillId)) {
    newUnlocked.push(result.skillId);
  }

  return {
    ...state,
    totalActivations: state.totalActivations + 1,
    skillActivationCounts: {
      ...state.skillActivationCounts,
      [result.skillId]: prev + 1,
    },
    unlockedSkillIds: newUnlocked,
    lastUnlockedSkillId: result.skillId,
    highestDamageSynergy: Math.max(state.highestDamageSynergy ?? 0, result.totalDamage),
  };
}

// ─── Display Helpers ─────────────────────────────────────────────────────────

/** Lấy tên hiển thị tiếng Việt của loại hiệu ứng */
export function getEffectDisplayName(type: SynergyEffectType): string {
  const names: Record<SynergyEffectType, string> = {
    dot_burn: 'Thiêu Đốt',
    freeze: 'Đóng Băng',
    shatter_armor: 'Phá Giáp',
    stun: 'Choáng Váng',
    lifesteal: 'Hút Máu',
    shield_break: 'Phá Khiên',
    debuff_atk: 'Giảm Công',
    debuff_speed: 'Giảm Tốc',
    buff_player_atk: 'Tăng Công',
    aoe_rend: 'Xé Không Gian',
    true_damage: 'Xuyên Giáp',
    none: 'Không',
  };
  return names[type] ?? type;
}

/** Tính % gauge hiển thị */
export function getGaugePercent(gauge: TrinitySynergyGaugeState): number {
  return Math.min(100, Math.floor((gauge.currentGauge / gauge.maxGauge) * 100));
}

/** Kiểm tra gauge có thể kích hoạt không (> 80% hoặc đầy) */
export function canActivateSynergy(gauge: TrinitySynergyGaugeState): boolean {
  return gauge.cooldownRoundsRemaining <= 0 && gauge.currentGauge >= 80;
}

/** Khởi tạo gauge state mới cho mỗi trận đấu */
export { createDefaultTrinitySynergyGaugeState } from './combat-synergy-data';
