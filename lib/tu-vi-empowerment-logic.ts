// lib/tu-vi-empowerment-logic.ts
// Pure Business Logic cho phân hệ "Vạn Năng Tu Vi: Quán Đỉnh Đạo Lữ, Khai Thông Kinh Mạch & Ngưng Đan Chân Nguyên"

import type { PlayerStats } from './types/player';
import type {
  AcupointNode,
  MeridianCalculatedBonuses,
  MeridianDefinition,
  MeridianType,
  TuViCrystallizeRecipe,
  TuViEmpowermentState,
} from './types/tu-vi-empowerment';
import {
  MERIDIANS_CONFIG,
  ACUPOINTS_MAP,
  TU_VI_CRYSTALLIZE_RECIPES,
  COMPANION_INFUSION_TIERS,
} from './tu-vi-empowerment-data';

// ─── Khởi Tạo State Mặc Định ──────────────────────────────────────────────────

export function createDefaultTuViEmpowermentState(): TuViEmpowermentState {
  return {
    unlockedAcupointIds: [],
    completedMeridianIds: [],
    totalTuViInfusedToCompanions: 0,
    totalTuViCrystallized: 0,
    overdriveActiveTurns: 0,
  };
}

// ─── Tổng Hợp Bonus Chỉ Số Chiến Đấu Từ Bát Mạch ──────────────────────────────

/**
 * Tổng hợp toàn bộ % thuộc tính từ các khiếu huyệt và đại mạch đã đả thông
 */
export function calculateMeridianCombatBonuses(
  state: TuViEmpowermentState | undefined
): MeridianCalculatedBonuses {
  const result: MeridianCalculatedBonuses = {
    maxHpPercent: 0,
    atkPercent: 0,
    defPercent: 0,
    speedBonus: 0,
    critRatePercent: 0,
    critDmgPercent: 0,
    damageReductionPercent: 0,
  };

  if (!state) return result;

  // 1. Cộng dồn từ từng Khiếu Huyệt đã mở
  (state.unlockedAcupointIds || []).forEach(acupointId => {
    const node = ACUPOINTS_MAP[acupointId];
    if (node && node.statBonus) {
      if (node.statBonus.maxHpPercent) result.maxHpPercent += node.statBonus.maxHpPercent;
      if (node.statBonus.atkPercent) result.atkPercent += node.statBonus.atkPercent;
      if (node.statBonus.defPercent) result.defPercent += node.statBonus.defPercent;
      if (node.statBonus.speedBonus) result.speedBonus += node.statBonus.speedBonus;
      if (node.statBonus.critRatePercent) result.critRatePercent += node.statBonus.critRatePercent;
      if (node.statBonus.critDmgPercent) result.critDmgPercent += node.statBonus.critDmgPercent;
      if (node.statBonus.damageReductionPercent) result.damageReductionPercent += node.statBonus.damageReductionPercent;
    }
  });

  // 2. Cộng dồn từ Đại Chu Thiên Dị Tượng khi hoàn thành trọn vẹn 1 Đại Mạch
  (state.completedMeridianIds || []).forEach(meridianId => {
    const meridian = MERIDIANS_CONFIG.find(m => m.id === meridianId);
    if (meridian && meridian.completionStatBonus) {
      const bonus = meridian.completionStatBonus;
      if (bonus.maxHpPercent) result.maxHpPercent += bonus.maxHpPercent;
      if (bonus.atkPercent) result.atkPercent += bonus.atkPercent;
      if (bonus.defPercent) result.defPercent += bonus.defPercent;
      if (bonus.speedBonus) result.speedBonus += bonus.speedBonus;
      if (bonus.critRatePercent) result.critRatePercent += bonus.critRatePercent;
      if (bonus.critDmgPercent) result.critDmgPercent += bonus.critDmgPercent;
      if (bonus.damageReductionPercent) result.damageReductionPercent += bonus.damageReductionPercent;
    }
  });

  return result;
}

// ─── Kiểm Tra & Đả Thông Khiếu Huyệt ──────────────────────────────────────────

export interface CanUnlockAcupointResult {
  allowed: boolean;
  canUnlock: boolean;
  reason?: string;
  acupoint?: AcupointNode;
}

export function canUnlockAcupoint(
  player: PlayerStats,
  acupointId: string
): CanUnlockAcupointResult {
  const node = ACUPOINTS_MAP[acupointId];
  if (!node) {
    return {
      allowed: false,
      canUnlock: false,
      reason: 'Khiếu huyệt không tồn tại trong nhân thể bát mạch.',
    };
  }

  const state = player.tuViEmpowermentState || createDefaultTuViEmpowermentState();
  if (state.unlockedAcupointIds.includes(acupointId)) {
    return {
      allowed: false,
      canUnlock: false,
      reason: 'Khiếu huyệt này đã được đả thông.',
      acupoint: node,
    };
  }

  // Kiểm tra thứ tự: Huyệt trước trong cùng mạch phải mở trước
  const meridian = MERIDIANS_CONFIG.find(m => m.id === node.meridianId);
  if (meridian) {
    const nodeIndex = meridian.acupoints.findIndex(a => a.id === acupointId);
    if (nodeIndex > 0) {
      const prevNode = meridian.acupoints[nodeIndex - 1];
      if (!state.unlockedAcupointIds.includes(prevNode.id)) {
        return {
          allowed: false,
          canUnlock: false,
          reason: `Phải đả thông [${prevNode.name}] trước mới có thể khai thông huyệt này!`,
          acupoint: node,
        };
      }
    }
  }

  if ((player.tuVi || 0) < node.tuViCost) {
    return {
      allowed: false,
      canUnlock: false,
      reason: `Thiếu Tu Vi! Cần ${node.tuViCost.toLocaleString()} Tu Vi, hiện có ${(player.tuVi || 0).toLocaleString()}.`,
      acupoint: node,
    };
  }

  return {
    allowed: true,
    canUnlock: true,
    acupoint: node,
  };
}

export interface UnlockAcupointResult {
  success: boolean;
  message: string;
  nextPlayer: PlayerStats;
  updatedPlayer: PlayerStats;
  acupointUnlocked?: AcupointNode;
  meridianCompleted?: MeridianDefinition | null;
  isMeridianCompleted?: boolean;
}

export function unlockAcupoint(
  player: PlayerStats,
  acupointId: string
): UnlockAcupointResult {
  const check = canUnlockAcupoint(player, acupointId);
  if (!check.allowed || !check.acupoint) {
    return {
      success: false,
      message: check.reason || 'Không đủ điều kiện đả thông khiếu huyệt.',
      nextPlayer: player,
      updatedPlayer: player,
    };
  }

  const node = check.acupoint;
  const state = player.tuViEmpowermentState || createDefaultTuViEmpowermentState();

  const nextUnlocked = [...state.unlockedAcupointIds, acupointId];

  // Kiểm tra hoàn thành toàn bộ đại mạch
  const meridian = MERIDIANS_CONFIG.find(m => m.id === node.meridianId);
  let meridianCompleted: MeridianDefinition | null = null;
  let nextCompletedMeridians = [...state.completedMeridianIds];

  if (meridian) {
    const allAcupointsUnlocked = meridian.acupoints.every(a => nextUnlocked.includes(a.id));
    if (allAcupointsUnlocked && !nextCompletedMeridians.includes(meridian.id)) {
      nextCompletedMeridians.push(meridian.id);
      meridianCompleted = meridian;
    }
  }

  const nextPlayer: PlayerStats = {
    ...player,
    tuVi: Math.max(0, (player.tuVi || 0) - node.tuViCost),
    tuViEmpowermentState: {
      ...state,
      unlockedAcupointIds: nextUnlocked,
      completedMeridianIds: nextCompletedMeridians,
    },
  };

  const message = meridianCompleted
    ? `🎉 Khai thông [${node.name}] thành công! Chúc mừng đạo hữu đã đả thông trọn vẹn [${meridianCompleted.name}], thức tỉnh dị tượng: ${meridianCompleted.completionBonusDescription}!`
    : `✨ Khai thông khiếu huyệt [${node.name}] thành công! Nhận gia trì vĩnh cửu.`;

  return {
    success: true,
    message,
    nextPlayer,
    updatedPlayer: nextPlayer,
    acupointUnlocked: node,
    meridianCompleted,
    isMeridianCompleted: Boolean(meridianCompleted),
  };
}

// ─── Quán Đỉnh Truyền Công Cho Đạo Lữ ─────────────────────────────────────────

export interface InfuseCompanionResult {
  success: boolean;
  message: string;
  nextPlayer: PlayerStats;
  updatedPlayer: PlayerStats;
  effectiveTuViGained: number;
  affinityGained: number;
  stageAdvanced: boolean;
  brokeThrough: boolean;
  newStage: number;
}

export function infuseTuViToCompanion(
  player: PlayerStats,
  companionId: string,
  tuViAmount: number
): InfuseCompanionResult {
  const currentTuVi = player.tuVi || 0;
  if (currentTuVi < tuViAmount) {
    return {
      success: false,
      message: `Tu Vi không đủ để quán đỉnh! Cần ${tuViAmount.toLocaleString()} Tu Vi, hiện có ${currentTuVi.toLocaleString()}.`,
      nextPlayer: player,
      updatedPlayer: player,
      effectiveTuViGained: 0,
      affinityGained: 0,
      stageAdvanced: false,
      brokeThrough: false,
      newStage: 1,
    };
  }

  // Xác định tỷ lệ hao hụt & hảo cảm
  let affinityBonus = 5;
  let effectiveRatio = 0.85;

  if (tuViAmount >= 1000000) {
    effectiveRatio = 0.88; // 12% hao hụt
    affinityBonus = 25;
  } else if (tuViAmount >= 200000) {
    effectiveRatio = 0.85; // 15% hao hụt
    affinityBonus = 12;
  } else {
    effectiveRatio = 0.85;
    affinityBonus = 5;
  }

  const effectiveTuViGained = Math.floor(tuViAmount * effectiveRatio);

  // Cập nhật trạng thái Đạo Lữ trong player.companionsState
  const compState = player.companionsState || {
    activeCompanionId: null,
    stationedGardenCompanionId: null,
    tamThanHopNhatUntil: 0,
    companions: {},
    tamTinhThanDieuUntil: 0,
  };

  const compData = compState.companions[companionId] || {
    id: companionId,
    affinity: 0,
    isBonded: false,
    stage: 1,
    exp: 0,
  };

  const currentExp = compData.exp || 0;
  const newExp = currentExp + effectiveTuViGained;
  const currentStage = compData.stage || 1;

  // Tính thăng cấp stage cho Đạo Lữ (mỗi 150,000 exp tăng 1 stage, tối đa 9)
  const expPerStage = 150000;
  const targetStage = Math.min(9, 1 + Math.floor(newExp / expPerStage));
  const stageAdvanced = targetStage > currentStage;

  const nextAffinity = Math.min(100, (compData.affinity || 0) + affinityBonus);

  const updatedCompanion = {
    ...compData,
    affinity: nextAffinity,
    exp: newExp,
    stage: targetStage,
  };

  const state = player.tuViEmpowermentState || createDefaultTuViEmpowermentState();

  const nextPlayer: PlayerStats = {
    ...player,
    tuVi: Math.max(0, currentTuVi - tuViAmount),
    companionsState: {
      ...compState,
      companions: {
        ...compState.companions,
        [companionId]: updatedCompanion,
      },
    },
    tuViEmpowermentState: {
      ...state,
      totalTuViInfusedToCompanions: (state.totalTuViInfusedToCompanions || 0) + tuViAmount,
    },
  };

  const message = stageAdvanced
    ? `Quán đỉnh viên mãn! Đạo Lữ hấp thu ${effectiveTuViGained.toLocaleString()} Tu Vi, đột phá lên Giai ${targetStage}! Hảo Cảm +${affinityBonus}!`
    : `Quán đỉnh thành công! Đạo Lữ hấp thu ${effectiveTuViGained.toLocaleString()} Tu Vi, Hảo Cảm +${affinityBonus}!`;

  return {
    success: true,
    message,
    nextPlayer,
    updatedPlayer: nextPlayer,
    effectiveTuViGained,
    affinityGained: affinityBonus,
    stageAdvanced,
    brokeThrough: stageAdvanced,
    newStage: targetStage,
  };
}

// ─── Ngưng Tụ Tu Vi Chân Đan ─────────────────────────────────────────────────

export interface CrystallizeTuViResult {
  success: boolean;
  message: string;
  nextPlayer: PlayerStats;
  updatedPlayer: PlayerStats;
  recipe?: TuViCrystallizeRecipe;
  pillCreated?: any;
}

export function crystallizeTuVi(
  player: PlayerStats,
  recipeId: string
): CrystallizeTuViResult {
  const recipe = TU_VI_CRYSTALLIZE_RECIPES.find(r => r.id === recipeId);
  if (!recipe) {
    return {
      success: false,
      message: 'Công thức ngưng đan không tồn tại.',
      nextPlayer: player,
      updatedPlayer: player,
    };
  }

  const currentTuVi = player.tuVi || 0;
  if (currentTuVi < recipe.tuViCost) {
    return {
      success: false,
      message: `Thiếu Tu Vi ngưng kết chân đan! Cần ${recipe.tuViCost.toLocaleString()} Tu Vi, hiện có ${currentTuVi.toLocaleString()}.`,
      nextPlayer: player,
      updatedPlayer: player,
    };
  }

  // Tạo vật phẩm viên đan tương ứng
  const pillItem = {
    id: recipe.outputItemId,
    name: recipe.name,
    grade: recipe.grade,
    quality: recipe.quality,
    icon: recipe.icon,
    description: recipe.description,
    quantity: 1,
    price: Math.floor(recipe.tuViCost / 2.5),
    expGain: recipe.storedTuVi,
    tuViGain: recipe.storedTuVi,
    effectValue: recipe.storedTuVi,
    effect: `Uống vào lập tức hấp thu +${recipe.storedTuVi.toLocaleString()} Tu Vi Chân Nguyên`,
    type: 'cultivation',
  };


  // Nạp an toàn vào túi đồ
  const currentInv = player.inventory || {
    pills: [],
    herbs: [],
    ores: [],
  };
  const currentPills = [...(currentInv.pills || [])];
  const existingPill = currentPills.find((p: any) => p.name === recipe.name || p.id === recipe.outputItemId);

  if (existingPill) {
    existingPill.quantity = (existingPill.quantity || 1) + 1;
  } else {
    currentPills.push(pillItem);
  }

  const state = player.tuViEmpowermentState || createDefaultTuViEmpowermentState();

  const nextPlayer: PlayerStats = {
    ...player,
    tuVi: Math.max(0, currentTuVi - recipe.tuViCost),
    inventory: {
      ...currentInv,
      pills: currentPills,
      herbs: currentInv.herbs || [],
      ores: currentInv.ores || [],
    },
    tuViEmpowermentState: {
      ...state,
      totalTuViCrystallized: (state.totalTuViCrystallized || 0) + recipe.tuViCost,
    },
  };

  return {
    success: true,
    message: `Ngưng tụ thành công 1 viên [${recipe.name}] (chứa ${recipe.storedTuVi.toLocaleString()} Tu Vi)! Đã chuyển vào Túi Trữ Vật.`,
    nextPlayer,
    updatedPlayer: nextPlayer,
    recipe,
    pillCreated: pillItem,
  };
}

// ─── Nhiên Huyết Bí Thuật: Đốt Tu Vi Tăng Cường Thực Lực (Overdrive) ─────────

export interface TuViOverdriveResult {
  success: boolean;
  message: string;
  nextPlayer: PlayerStats;
  updatedPlayer: PlayerStats;
  tuViBurned: number;
  hpRestored: number;
}

export function triggerTuViCombatOverdrive(player: PlayerStats): TuViOverdriveResult {
  const currentTuVi = player.tuVi || 0;
  if (currentTuVi < 20000) {
    return {
      success: false,
      message: 'Tu Vi bản thân quá mỏng manh, không thể vận chuyển Nhiên Tu Vi Bí Thuật (Tối thiểu 20,000 Tu Vi).',
      nextPlayer: player,
      updatedPlayer: player,
      tuViBurned: 0,
      hpRestored: 0,
    };
  }

  // Tiêu hao 10% Tu Vi hiện tại
  const tuViBurned = Math.floor(currentTuVi * 0.1);
  const maxHp = player.maxKhiHuyet || 1000;
  const hpRestored = Math.floor(maxHp * 0.3); // Hồi 30% HP

  const nextHp = Math.min(maxHp, (player.khiHuyet || 0) + hpRestored);
  const state = player.tuViEmpowermentState || createDefaultTuViEmpowermentState();

  const nextPlayer: PlayerStats = {
    ...player,
    tuVi: Math.max(0, currentTuVi - tuViBurned),
    khiHuyet: nextHp,
    tuViEmpowermentState: {
      ...state,
      overdriveActiveTurns: 3,
    },
  };

  return {
    success: true,
    message: `🔥 Thiêu đốt ${tuViBurned.toLocaleString()} Tu Vi! Kích phát cuồng nộ chân nguyên: Hồi phục +${hpRestored.toLocaleString()} Khí Huyết, uy lực bạo phát toàn diện!`,
    nextPlayer,
    updatedPlayer: nextPlayer,
    tuViBurned,
    hpRestored,
  };
}

// ─── Nhiên Thần Đột Phá (Breakthrough Catalyst) ───────────────────────────────

export interface BreakthroughCatalystResult {
  success: boolean;
  message: string;
  nextPlayer: PlayerStats;
  updatedPlayer: PlayerStats;
}

export function activateBreakthroughCatalyst(player: PlayerStats): BreakthroughCatalystResult {
  const currentTuVi = player.tuVi || 0;
  const COST = 100000;
  if (currentTuVi < COST) {
    return {
      success: false,
      message: `Cần tối thiểu ${COST.toLocaleString()} Tu Vi để kích hoạt Nhiên Thần Đột Phá! (Hiện có ${currentTuVi.toLocaleString()})`,
      nextPlayer: player,
      updatedPlayer: player,
    };
  }

  const nextPlayer: PlayerStats = {
    ...player,
    tuVi: Math.max(0, currentTuVi - COST),
    activeBuffs: {
      ...(player.activeBuffs || {}),
      tuViBreakthroughCatalyst: true,
    },
  };

  return {
    success: true,
    message: '🔥 Đốt cháy 100,000 Tu Vi Chân Nguyên! Kích hoạt dị tượng hộ thể: +15% Tỷ Lệ Đột Phá An Toàn cho lần đột phá kế tiếp!',
    nextPlayer,
    updatedPlayer: nextPlayer,
  };
}
