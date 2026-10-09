// lib/soul-cultivation-data.ts
// Hệ Thống Tu Luyện Thần Hồn (Soul Cultivation Progression) & Phân Thần Du Ngoạn (Astral Expedition)

import {
  PlayerStats,
  SoulStageConfig,
  SoulExpeditionState,
  ExpeditionDestinationId,
  SoulCultivationState,
  Pill,
  Herb,
  Ore
} from '@/lib/types';
import { PILL_TEMPLATES, DEFAULT_ORES } from '@/lib/alchemy-data';

// ============================================
// 1. CẤU HÌNH 4 ĐẠI CẢNH GIỚI THẦN HỒN
// ============================================

export const SOUL_STAGES_CONFIG: SoulStageConfig[] = [
  {
    id: 'khai_mo_thuc_hai',
    name: 'Khai Mở Thức Hải',
    tier: 1,
    description: 'Khai mở linh đài thức hải, dẫn khí nhập hồn, tăng vĩnh viễn Chân Nguyên và Thần Thức. Giảm 10% tiêu hao Chân Nguyên trong Bí Cảnh.',
    maxSubTiers: 9,
    baseExpRequired: 100,
    statBonusPerTier: {
      maxMp: 120,          // Tầng 1-9: +120 MP/tầng -> Tổng +1,080 Chân Nguyên
      thanThuc: 15,        // Tầng 1-9: +15 Thần Thức/tầng -> Tổng +135 Thần Thức
      critRate: 0.2,
      spiritDmgBonus: 0
    },
    upgradeCosts: {
      linhThach: 600,
      soulStoneId: 'item_u_hon_thach',
      soulStoneCount: 1,
      soulPillId: 'item_duong_than_dan',
      soulPillCount: 0
    }
  },
  {
    id: 'ngung_hon_hoa_kiem',
    name: 'Ngưng Hồn Hóa Kiếm',
    tier: 2,
    description: 'Thần niệm ngưng tụ thành kiếm ý vô hình. Mở khóa Tuyệt Kỹ "Thần Niệm Kiếm" đầu Hiệp 1 gây sát thương chuẩn xuyên giáp!',
    maxSubTiers: 9,
    baseExpRequired: 200,
    statBonusPerTier: {
      maxMp: 200,          // Tầng 1-9: +200 MP/tầng -> Tổng +1,800 Chân Nguyên
      thanThuc: 35,        // Tầng 1-9: +35 Thần Thức/tầng -> Tổng +315 Thần Thức
      critRate: 0.8,
      spiritDmgBonus: 5
    },
    upgradeCosts: {
      linhThach: 2500,
      soulStoneId: 'item_u_hon_thach',
      soulStoneCount: 3,
      soulPillId: 'item_duong_than_dan',
      soulPillCount: 1
    }
  },
  {
    id: 'nguyen_than_xuat_khieu',
    name: 'Nguyên Thần Xuất Khiếu',
    tier: 3,
    description: 'Nguyên thần ly thể du hành thái hư. Mở khóa "Phân Thần Du Ngoạn" thám hiểm độc lập tìm Linh Dược và Khoáng Thạch quý hiếm.',
    maxSubTiers: 9,
    baseExpRequired: 400,
    statBonusPerTier: {
      maxMp: 350,          // Tầng 1-9: +350 MP/tầng -> Tổng +3,150 Chân Nguyên
      thanThuc: 60,        // Tầng 1-9: +60 Thần Thức/tầng -> Tổng +540 Thần Thức
      critRate: 1.2,
      spiritDmgBonus: 10
    },
    upgradeCosts: {
      linhThach: 10000,
      soulStoneId: 'item_u_hon_thach',
      soulStoneCount: 8,
      soulPillId: 'item_duong_than_dan',
      soulPillCount: 2
    }
  },
  {
    id: 'duong_than_vien_man',
    name: 'Dương Thần Viên Mãn',
    tier: 4,
    description: 'Ngưng luyện Dương Thần chí tôn vô thượng, miễn nhiễm mê muội/chấn nhiếp từ yêu thú, Thần Niệm Kiếm bạo tăng 25% sát thương.',
    maxSubTiers: 9,
    baseExpRequired: 800,
    statBonusPerTier: {
      maxMp: 600,          // Tầng 1-9: +600 MP/tầng -> Tổng +5,400 Chân Nguyên
      thanThuc: 100,       // Tầng 1-9: +100 Thần Thức/tầng -> Tổng +900 Thần Thức
      critRate: 2.0,
      spiritDmgBonus: 25
    },
    upgradeCosts: {
      linhThach: 40000,
      soulStoneId: 'item_u_hon_thach',
      soulStoneCount: 20,
      soulPillId: 'item_duong_than_dan',
      soulPillCount: 4
    }
  }
];

// ============================================
// 2. LỘ TRÌNH "PHÂN THẦN DU NGOẠN" (AFK EXPEDITIONS)
// ============================================

export interface ExpeditionDestinationConfig {
  id: ExpeditionDestinationId;
  name: string;
  icon: string;
  badgeClass: string;
  description: string;
  mainDropTypes: string;
}

export const EXPEDITION_DESTINATIONS: Record<ExpeditionDestinationId, ExpeditionDestinationConfig> = {
  duoc_vuong_coc: {
    id: 'duoc_vuong_coc',
    name: 'Dược Vương Cốc',
    icon: '🌿',
    badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
    description: 'Thung lũng u tịch ngàn năm mịt mù linh khí, nơi sinh trưởng của các loài linh thảo quý hiếm bậc nhất.',
    mainDropTypes: 'Tẩy Tủy Thảo, Chu Quả, Hóa Long Thảo, U Hồn Thạch, Dưỡng Thần Đan'
  },
  thai_hu_khoang: {
    id: 'thai_hu_khoang',
    name: 'Thái Hư Khoáng Mạch',
    icon: '⛏️',
    badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-950/40',
    description: 'Dãy mạch ngầm cổ xưa chứa đầy địa mạch tinh hoa, sản sinh khoáng thạch thần bí và bảo ngọc.',
    mainDropTypes: 'Huyền Thiết, U Tinh Thạch, Hàn Băng Thần Tinh, Linh Ngọc Ngũ Hành, U Hồn Thạch'
  },
  co_tu_tan_dong: {
    id: 'co_tu_tan_dong',
    name: 'Cổ Tu Tàn Động',
    icon: '🏛️',
    badgeClass: 'text-purple-300 border-purple-500/40 bg-purple-950/40',
    description: 'Động phủ bỏ hoang của các vị đại năng viễn cổ tọa hóa, lưu lại vô số linh thạch và bí tích tàn quyển.',
    mainDropTypes: 'Linh Thạch, Trung Phẩm Linh Thạch, Tàn Diệp Công Pháp, Tinh Huyết, U Hồn Thạch'
  }
};

export const EXPEDITION_DURATIONS = [
  { hours: 2, label: '2 Giờ', multiplier: 1.0, bonusDesc: 'Chớp Nhoáng' },
  { hours: 4, label: '4 Giờ', multiplier: 2.2, bonusDesc: '+10% Sản Lượng' },
  { hours: 8, label: '8 Giờ', multiplier: 5.0, bonusDesc: '+25% Tinh Hoa' }
];

// ============================================
// 3. TIỆN ÍCH KIỂM TRA TÀI NGUYÊN HỒN TU
// ============================================

export function countSoulStones(player: PlayerStats): number {
  let count = 0;
  // Kiểm tra trong túi khoáng thạch
  if (player.inventory?.ores) {
    player.inventory.ores.forEach(o => {
      if (o && (o.id === 'item_u_hon_thach' || o.id === 'u_hon_thach' || o.name.includes('U Hồn Thạch') || o.name.includes('Hồn Tinh'))) {
        count += o.quantity || 0;
      }
    });
  }
  return count;
}

export function countSoulPills(player: PlayerStats): number {
  let count = 0;
  // Kiểm tra trong túi đan dược
  if (player.inventory?.pills) {
    player.inventory.pills.forEach(p => {
      if (
        p &&
        (p.id === 'item_duong_than_dan' ||
          p.id === 'pill_dinh_than' ||
          p.name.includes('Dưỡng Thần') ||
          p.name.includes('Định Thần') ||
          p.name.includes('Ngưng Thần'))
      ) {
        count += p.quantity || 0;
      }
    });
  }
  return count;
}

// ============================================
// 4. TIỆN ÍCH TRÍ TUỆ NHÂN VẬT & CHỈ SỐ GIA TRÌ
// ============================================

export function getSoulCultivationProgression(player: PlayerStats) {
  const soul = player.soulCultivation || {
    currentStageIndex: 0,
    currentSubTier: 1,
    currentExp: 0,
    realmIndex: 0,
    level: 1,
    maxExp: 100
  };

  const stageIndex = typeof soul.currentStageIndex === 'number'
    ? soul.currentStageIndex
    : (typeof soul.realmIndex === 'number' ? Math.min(soul.realmIndex, 3) : 0);

  const subTier = typeof soul.currentSubTier === 'number'
    ? soul.currentSubTier
    : (typeof soul.level === 'number' ? Math.min(Math.max(1, soul.level), 9) : 1);

  const safeStageIdx = Math.max(0, Math.min(stageIndex, SOUL_STAGES_CONFIG.length - 1));
  const stageConfig = SOUL_STAGES_CONFIG[safeStageIdx];
  const isMaxTierInStage = subTier >= 9;
  const isUltimateMax = safeStageIdx >= SOUL_STAGES_CONFIG.length - 1 && isMaxTierInStage;

  // Tính chi phí nâng tầng
  const baseCost = stageConfig.upgradeCosts;
  const tierCostMultiplier = 1 + (subTier - 1) * 0.25;

  const costLinhThach = Math.floor(baseCost.linhThach * tierCostMultiplier);
  const costSoulStone = Math.max(1, Math.floor(baseCost.soulStoneCount + Math.floor((subTier - 1) / 3)));
  const soulPillCount = baseCost.soulPillCount ?? 0;
  const costSoulPill = isMaxTierInStage
    ? Math.max(1, soulPillCount + 1)
    : (subTier >= 5 ? Math.max(0, soulPillCount) : 0);

  // Tính chỉ số lũy kế đạt được
  let cumulativeMaxMp = 0;
  let cumulativeThanThuc = 0;
  let cumulativeCritRate = 0;

  for (let s = 0; s < safeStageIdx; s++) {
    const prevCfg = SOUL_STAGES_CONFIG[s];
    cumulativeMaxMp += prevCfg.statBonusPerTier.maxMp * 9;
    cumulativeThanThuc += prevCfg.statBonusPerTier.thanThuc * 9;
    cumulativeCritRate += (prevCfg.statBonusPerTier.critRate || 0) * 9;
  }
  cumulativeMaxMp += stageConfig.statBonusPerTier.maxMp * subTier;
  cumulativeThanThuc += stageConfig.statBonusPerTier.thanThuc * subTier;
  cumulativeCritRate += (stageConfig.statBonusPerTier.critRate || 0) * subTier;

  // Tính sát thương chuẩn Thần Niệm Kiếm
  const playerThanThuc = player.thanThuc || (30 + cumulativeThanThuc);
  const baseMindBladeDmg = Math.floor(playerThanThuc * 1.8 + (safeStageIdx + 1) * 80);
  const mindBladeDamage = safeStageIdx >= 3 ? Math.floor(baseMindBladeDmg * 1.25) : baseMindBladeDmg;

  return {
    stageIndex: safeStageIdx,
    subTier,
    stageConfig,
    isMaxTierInStage,
    isUltimateMax,
    cost: {
      linhThach: costLinhThach,
      soulStone: costSoulStone,
      soulPill: costSoulPill
    },
    bonuses: {
      maxMp: cumulativeMaxMp,
      thanThuc: cumulativeThanThuc,
      critRate: parseFloat(cumulativeCritRate.toFixed(1)),
      hasMindBlade: safeStageIdx >= 1,
      hasExpedition: safeStageIdx >= 2,
      hasYangSoul: safeStageIdx >= 3,
      mindBladeDamage
    },
    ownedResources: {
      linhThach: player.linhThach || 0,
      soulStone: countSoulStones(player),
      soulPill: countSoulPills(player)
    }
  };
}

// ============================================
// 5. NÂNG CẤP & ĐỘT PHÁ THẦN HỒN
// ============================================

export function canUpgradeSoulProgression(player: PlayerStats): {
  canUpgrade: boolean;
  isBreakthrough: boolean;
  reason: string;
  successRate: number;
  cost: {
    linhThach: number;
    soulStone: number;
    soulPill: number;
  };
} {
  const prog = getSoulCultivationProgression(player);

  if (prog.isUltimateMax) {
    return {
      canUpgrade: false,
      isBreakthrough: false,
      reason: 'Đã đạt tới Dương Thần Viên Mãn Tầng 9/9 Cực Cảnh!',
      successRate: 0,
      cost: { linhThach: 0, soulStone: 0, soulPill: 0 }
    };
  }

  const isBreakthrough = prog.isMaxTierInStage;
  const cost = prog.cost;
  const owned = prog.ownedResources;

  // Tỉ lệ thành công: thăng tầng = 100%, đột phá đại cảnh giới = 80% -> 95% dựa theo Tâm Cảnh
  const tamCanh = player.tamCanh || 50;
  const successRate = isBreakthrough
    ? Math.min(95, Math.max(75, Math.floor(75 + tamCanh * 0.2)))
    : 100;

  if (owned.linhThach < cost.linhThach) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${(cost.linhThach - owned.linhThach).toLocaleString()} Linh Thạch!`,
      successRate,
      cost
    };
  }

  if (owned.soulStone < cost.soulStone) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${cost.soulStone - owned.soulStone} U Hồn Thạch! Có thể tìm thấy ở Phân Thần Du Ngoạn hoặc Trảm Yêu.`,
      successRate,
      cost
    };
  }

  if (cost.soulPill > 0 && owned.soulPill < cost.soulPill) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${cost.soulPill - owned.soulPill} Đan Dược Dưỡng Thần (Định Thần Đan)!`,
      successRate,
      cost
    };
  }

  return {
    canUpgrade: true,
    isBreakthrough,
    reason: isBreakthrough
      ? 'Sẵn sàng tiến hành Đột Phá Đại Cảnh Giới Thần Hồn!'
      : 'Đủ điều kiện Tôi Hồn Thăng Tầng!',
    successRate,
    cost
  };
}

export function performUpgradeSoulProgression(player: PlayerStats): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  isBreakthrough: boolean;
} {
  const check = canUpgradeSoulProgression(player);
  if (!check.canUpgrade) {
    return {
      success: false,
      updatedPlayer: player,
      message: check.reason,
      isBreakthrough: check.isBreakthrough
    };
  }

  const prog = getSoulCultivationProgression(player);
  const cost = check.cost;
  const isBreakthrough = check.isBreakthrough;

  // 1. Trừ Linh Thạch
  const newLinhThach = Math.max(0, (player.linhThach || 0) - cost.linhThach);

  // 2. Trừ U Hồn Thạch trong khoáng thạch
  let updatedOres = [...(player.inventory?.ores || [])];
  let stonesToDeduct = cost.soulStone;
  for (const ore of updatedOres) {
    if (stonesToDeduct <= 0) break;
    if (ore && (ore.id === 'item_u_hon_thach' || ore.id === 'u_hon_thach' || ore.name.includes('U Hồn Thạch') || ore.name.includes('Hồn Tinh'))) {
      const take = Math.min(ore.quantity, stonesToDeduct);
      ore.quantity -= take;
      stonesToDeduct -= take;
    }
  }
  updatedOres = updatedOres.filter(o => o.quantity > 0);

  // 3. Trừ Đan Dược Dưỡng Thần (nếu có)
  let updatedPills = [...(player.inventory?.pills || [])];
  let pillsToDeduct = cost.soulPill;
  for (const pill of updatedPills) {
    if (pillsToDeduct <= 0) break;
    if (
      pill &&
      (pill.id === 'item_duong_than_dan' ||
        pill.id === 'pill_dinh_than' ||
        pill.name.includes('Dưỡng Thần') ||
        pill.name.includes('Định Thần') ||
        pill.name.includes('Ngưng Thần'))
    ) {
      const take = Math.min(pill.quantity, pillsToDeduct);
      pill.quantity -= take;
      pillsToDeduct -= take;
    }
  }
  updatedPills = updatedPills.filter(p => p.quantity > 0);

  // 4. Kiểm tra tỉ lệ thành công khi đột phá đại cảnh giới
  if (isBreakthrough) {
    const roll = Math.random() * 100;
    const isSuccess = roll <= check.successRate;

    if (!isSuccess) {
      const updatedPlayer: PlayerStats = {
        ...player,
        linhThach: newLinhThach,
        inventory: {
          ...(player.inventory || { herbs: [] }),
          ores: updatedOres,
          pills: updatedPills
        }
      };
      return {
        success: false,
        updatedPlayer,
        message: `Thức hải chao đảo, đột phá đại cảnh giới Thần Hồn thất bại (Tỉ lệ: ${check.successRate}%). Đạo hữu hãy tĩnh tâm điều hòa!`,
        isBreakthrough: true
      };
    }

    // Đột phá thành công -> lên Đại Cảnh Giới tiếp theo
    const nextStageIndex = Math.min(SOUL_STAGES_CONFIG.length - 1, prog.stageIndex + 1);
    const nextStageConfig = SOUL_STAGES_CONFIG[nextStageIndex];

    const bonusMp = nextStageConfig.statBonusPerTier.maxMp;
    const bonusSoul = nextStageConfig.statBonusPerTier.thanThuc;

    const newThanThuc = (player.thanThuc || 10) + bonusSoul;
    const newMaxLinhLuc = (player.maxLinhLuc || 1000) + bonusMp;

    const updatedSoulState = {
      ...(player.soulCultivation || {}),
      currentStageIndex: nextStageIndex,
      currentSubTier: 1,
      realmIndex: nextStageIndex,
      level: 1,
      currentExp: 0,
      maxExp: 100,
      expeditionState: player.soulCultivation?.expeditionState || null
    };

    const updatedPlayer: PlayerStats = {
      ...player,
      linhThach: newLinhThach,
      thanThuc: newThanThuc,
      maxLinhLuc: newMaxLinhLuc,
      maxMp: newMaxLinhLuc,
      inventory: {
        ...(player.inventory || { herbs: [] }),
        ores: updatedOres,
        pills: updatedPills
      },
      soulCultivation: updatedSoulState
    };

    let unlockText = '';
    if (nextStageIndex === 1) unlockText = ' 🗡️ Đã Khai Mở Thần Niệm Kiếm Hiệp 1!';
    if (nextStageIndex === 2) unlockText = ' 🌌 Đã Khai Mở Phân Thần Du Ngoạn!';
    if (nextStageIndex === 3) unlockText = ' ☀️ Dương Thần Viên Mãn: Miễn Nhiễm Chấn Nhiếp, Thần Niệm Kiếm +25% Sát Thương!';

    return {
      success: true,
      updatedPlayer,
      message: `🎉 Thần Hồn đại đột phá! Đạt cảnh giới [${nextStageConfig.name} • Tầng 1/9]! +${bonusSoul} Thần Thức, +${bonusMp} Chân Nguyên!${unlockText}`,
      isBreakthrough: true
    };
  }

  // Thăng tầng bình thường (subTier + 1)
  const nextSubTier = prog.subTier + 1;
  const stageCfg = prog.stageConfig;
  const bonusMp = stageCfg.statBonusPerTier.maxMp;
  const bonusSoul = stageCfg.statBonusPerTier.thanThuc;

  const newThanThuc = (player.thanThuc || 10) + bonusSoul;
  const newMaxLinhLuc = (player.maxLinhLuc || 1000) + bonusMp;

  const updatedSoulState = {
    ...(player.soulCultivation || {}),
    currentStageIndex: prog.stageIndex,
    currentSubTier: nextSubTier,
    realmIndex: prog.stageIndex,
    level: nextSubTier,
    currentExp: 0,
    maxExp: 100,
    expeditionState: player.soulCultivation?.expeditionState || null
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: newLinhThach,
    thanThuc: newThanThuc,
    maxLinhLuc: newMaxLinhLuc,
    maxMp: newMaxLinhLuc,
    inventory: {
      ...(player.inventory || { herbs: [] }),
      ores: updatedOres,
      pills: updatedPills
    },
    soulCultivation: updatedSoulState
  };

  return {
    success: true,
    updatedPlayer,
    message: `🔮 Thức hải tinh thuần! Thần Hồn thăng tầng đạt [${stageCfg.name} • Tầng ${nextSubTier}/9]! +${bonusSoul} Thần Thức, +${bonusMp} Chân Nguyên!`,
    isBreakthrough: false
  };
}

// ============================================
// 6. PHÂN THẦN DU NGOẠN (AFK EXPEDITION ENGINE)
// ============================================

export function startSoulExpedition(
  player: PlayerStats,
  destination: ExpeditionDestinationId,
  durationHours: number
): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
} {
  const prog = getSoulCultivationProgression(player);
  if (!prog.bonuses.hasExpedition) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Cần đạt cảnh giới Thần Hồn từ [Nguyên Thần Xuất Khiếu] trở lên mới có thể phân thần du ngoạn!'
    };
  }

  const existing = player.soulCultivation?.expeditionState;
  if (existing && existing.isActive && !existing.claimed) {
    const now = Date.now();
    const isDone = now >= existing.startTime + existing.durationMs;
    if (!isDone) {
      return {
        success: false,
        updatedPlayer: player,
        message: 'Phân thần đang trong chuyến du ngoạn, chưa thể bắt đầu chuyến mới!'
      };
    } else {
      return {
        success: false,
        updatedPlayer: player,
        message: 'Chuyến du ngoạn trước đã hoàn thành! Vui lòng bấm [Thu Hồi Phân Thần] trước.'
      };
    }
  }

  const durationMs = durationHours * 3600 * 1000;
  const destCfg = EXPEDITION_DESTINATIONS[destination];

  const expeditionState: SoulExpeditionState = {
    isActive: true,
    destination,
    destinationName: destCfg.name,
    startTime: Date.now(),
    durationMs,
    claimed: false
  };

  const updatedSoulState = {
    ...(player.soulCultivation || {
      currentStageIndex: prog.stageIndex,
      currentSubTier: prog.subTier,
      realmIndex: prog.stageIndex,
      level: prog.subTier,
      currentExp: 0,
      maxExp: 100
    }),
    expeditionState
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    soulCultivation: updatedSoulState
  };

  return {
    success: true,
    updatedPlayer,
    message: `🌌 Đã phân tách một luồng thần niệm xuất hành đến [${destCfg.name}] trong ${durationHours} giờ!`
  };
}

export function claimSoulExpedition(player: PlayerStats): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  rewardsSummary: string;
  droppedItems: Array<{ id: string; name: string; quantity: number; type: string }>;
} {
  const expedition = player.soulCultivation?.expeditionState;
  if (!expedition || !expedition.isActive) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Hiện không có chuyến phân thần du ngoạn nào!',
      rewardsSummary: '',
      droppedItems: []
    };
  }

  const now = Date.now();
  const isDone = now >= expedition.startTime + expedition.durationMs;
  if (!isDone) {
    const remainingMins = Math.ceil((expedition.startTime + expedition.durationMs - now) / 60000);
    return {
      success: false,
      updatedPlayer: player,
      message: `Phân thần chưa trở về! Còn khoảng ${remainingMins} phút nữa mới thu hồi được.`,
      rewardsSummary: '',
      droppedItems: []
    };
  }

  const durationHours = Math.max(2, Math.round(expedition.durationMs / 3600000));
  const durationCfg = EXPEDITION_DURATIONS.find(d => d.hours === durationHours) || EXPEDITION_DURATIONS[0];
  const mult = durationCfg.multiplier;

  // Tính toán phần thưởng theo điểm Thần Thức
  const thanThuc = player.thanThuc || 50;
  const thanThucBonus = 1 + (thanThuc / 400);

  const tuViGained = Math.floor(15000 * durationHours * mult * thanThucBonus);
  const linhThachGained = Math.floor(1200 * durationHours * mult * thanThucBonus);

  const droppedItems: Array<{ id: string; name: string; quantity: number; type: string }> = [];

  // Luôn có U Hồn Thạch
  const uHonThachCount = Math.max(2, Math.floor((durationHours * 1.5 + Math.random() * 2) * mult));
  droppedItems.push({
    id: 'item_u_hon_thach',
    name: 'U Hồn Thạch',
    quantity: uHonThachCount,
    type: 'ore'
  });

  // Tùy theo địa điểm, thưởng thêm vật phẩm đặc thù
  if (expedition.destination === 'duoc_vuong_coc') {
    // Rơi thảo dược & Đan dược dưỡng thần
    const herbCount = Math.floor((3 + durationHours) * mult);
    droppedItems.push({
      id: 'tay_tuy_thao',
      name: 'Tẩy Tủy Thảo',
      quantity: herbCount,
      type: 'herb'
    });
    droppedItems.push({
      id: 'item_duong_than_dan',
      name: 'Dưỡng Thần Đan',
      quantity: Math.max(1, Math.floor(durationHours * 0.6)),
      type: 'pill'
    });
    if (Math.random() < 0.5 * mult) {
      droppedItems.push({
        id: 'chu_qua',
        name: 'Chu Quả Thượng Phẩm',
        quantity: 1,
        type: 'herb'
      });
    }
  } else if (expedition.destination === 'thai_hu_khoang') {
    // Rơi khoáng thạch quý
    const oreCount = Math.floor((3 + durationHours) * mult);
    droppedItems.push({
      id: 'huyen_thiet',
      name: 'Bách Luyện Huyền Thiết',
      quantity: oreCount,
      type: 'ore'
    });
    droppedItems.push({
      id: 'bang_tinh_khoang',
      name: 'Hàn Băng Thần Tinh',
      quantity: Math.max(1, Math.floor(durationHours * 0.5)),
      type: 'ore'
    });
    if (Math.random() < 0.45 * mult) {
      droppedItems.push({
        id: 'gem_loi_quang',
        name: 'Lôi Tinh Thạch',
        quantity: 1,
        type: 'ore'
      });
    }
  } else {
    // Cổ Tu Tàn Động: Rơi Linh Thạch, Tinh Huyết, Tàn Diệp
    const tinhHuyetCount = Math.max(2, Math.floor(durationHours * 1.2));
    droppedItems.push({
      id: 'tinh_huyet_yeu_thu',
      name: 'Tinh Huyết Yêu Thú',
      quantity: tinhHuyetCount,
      type: 'special'
    });
    if (Math.random() < 0.6 * mult) {
      droppedItems.push({
        id: 'item_duong_than_dan',
        name: 'Dưỡng Thần Đan',
        quantity: 1,
        type: 'pill'
      });
    }
  }

  // Thêm vật phẩm vào túi người chơi
  let updatedOres = [...(player.inventory?.ores || [])];
  let updatedHerbs = [...(player.inventory?.herbs || [])];
  let updatedPills = [...(player.inventory?.pills || [])];
  let extraTinhHuyet = player.tinhHuyetYeuThu || 0;

  for (const item of droppedItems) {
    if (item.id === 'tinh_huyet_yeu_thu') {
      extraTinhHuyet += item.quantity;
    } else if (item.type === 'ore') {
      const idx = updatedOres.findIndex(o => o.id === item.id);
      if (idx >= 0) {
        updatedOres[idx] = { ...updatedOres[idx], quantity: (updatedOres[idx].quantity || 0) + item.quantity };
      } else {
        const template = DEFAULT_ORES.find(o => o.id === item.id) || {
          id: item.id,
          name: item.name,
          grade: 'Tam Giai',
          description: 'Khoáng thạch quý hiếm thu được từ Phân Thần Du Ngoạn.',
          price: 350,
          quantity: 0
        };
        updatedOres.push({ ...template, quantity: item.quantity });
      }
    } else if (item.type === 'herb') {
      const idx = updatedHerbs.findIndex(h => h.id === item.id);
      if (idx >= 0) {
        updatedHerbs[idx] = { ...updatedHerbs[idx], quantity: (updatedHerbs[idx].quantity || 0) + item.quantity };
      } else {
        updatedHerbs.push({
          id: item.id,
          name: item.name,
          grade: 'Tam Giai',
          description: 'Linh dược quý hiếm thu được từ Phân Thần Du Ngoạn.',
          price: 250,
          quantity: item.quantity,
          growthTime: 300,
          plantedAt: 0,
          quality: 'thuong_pham'
        } as Herb);
      }
    } else if (item.type === 'pill') {
      const idx = updatedPills.findIndex(p => p.id === item.id);
      if (idx >= 0) {
        updatedPills[idx] = { ...updatedPills[idx], quantity: (updatedPills[idx].quantity || 0) + item.quantity };
      } else {
        const template = PILL_TEMPLATES[item.id] || {
          id: item.id,
          name: item.name,
          grade: 'Tam Giai',
          description: 'Bảo đan an thần ngưng phách, tẩm bổ Thần Thức.',
          effectType: 'permanent_stat',
          statTarget: 'thanThuc',
          effectValue: 5,
          quantity: 1,
          quality: 'thuong_pham'
        };
        updatedPills.push({ ...template, quantity: item.quantity });
      }
    }
  }

  const currentSoul = player.soulCultivation || {
    realmIndex: 0,
    level: 1,
    currentExp: 0,
    maxExp: 100,
    currentStageIndex: 0,
    currentSubTier: 1,
    expeditionState: null
  };

  const updatedSoulState: SoulCultivationState = {
    ...currentSoul,
    realmIndex: currentSoul.realmIndex ?? 0,
    level: currentSoul.level ?? 1,
    currentExp: currentSoul.currentExp ?? 0,
    maxExp: currentSoul.maxExp ?? 100,
    expeditionState: null
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    tuVi: (player.tuVi || 0) + tuViGained,
    linhThach: (player.linhThach || 0) + linhThachGained,
    tinhHuyetYeuThu: extraTinhHuyet,
    inventory: {
      ...(player.inventory || {}),
      ores: updatedOres,
      herbs: updatedHerbs,
      pills: updatedPills
    },
    soulCultivation: updatedSoulState
  };

  const itemNames = droppedItems.map(it => `${it.quantity}x ${it.name}`).join(', ');
  const rewardsSummary = `+${tuViGained.toLocaleString()} Tu Vi, +${linhThachGained.toLocaleString()} Linh Thạch, ${itemNames}`;

  return {
    success: true,
    updatedPlayer,
    message: `✨ Thu hồi phân thần thành công! Nhận được: ${rewardsSummary}!`,
    rewardsSummary,
    droppedItems
  };
}
