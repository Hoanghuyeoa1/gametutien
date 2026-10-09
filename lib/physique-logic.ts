// lib/physique-logic.ts
// Xử lý nghiệp vụ thuần túy cho Phân Hệ "Huyền Công Luyện Thể" (Expanded Physique System)

import { PlayerStats, Herb, Ore, Pill } from './types';
import {
  PhysiqueState,
  PhysiqueStatBonus,
  PhysiqueRealm,
  PhysiquePart
} from './types/physique';
import {
  PHYSIQUE_REALMS,
  PHYSIQUE_PARTS_CONFIG,
  REALM_BASE_STAGE_EXP,
  createDefaultPhysiqueState,
  getMaxPhysiqueTierForRealm,
  getRequiredRealmNameForPhysiqueTier
} from './physique-system-data';

export {
  getMaxPhysiqueTierForRealm,
  getRequiredRealmNameForPhysiqueTier
};

/**
 * 1. Tổng hợp toàn bộ chỉ số gia trì từ Cảnh Giới và 6 Bộ Phận Nhục Thân
 */
export function calculateTotalPhysiqueStats(physique?: PhysiqueState): PhysiqueStatBonus {
  if (!physique) return {};

  const stats: PhysiqueStatBonus = {
    hp: 0,
    def: 0,
    atk: 0,
    speed: 0,
    critRate: 0,
    critDmg: 0,
    damageReduction: 0,
    hpRegen: 0,
    trueDmgPercent: 0,
    counterDmgPercent: 0,
    physiqueExpRate: 0
  };

  const cultivation = physique.cultivation;
  const currentRealm = PHYSIQUE_REALMS.find(r => r.id === cultivation.currentRealmId) || PHYSIQUE_REALMS[0];

  // 1a. Chỉ số từ Cảnh Giới Nhục Thân + Hệ số Tiểu Tầng (Mỗi tầng +10%)
  const stageMultiplier = 1 + (cultivation.currentStage - 1) * 0.10;
  const baseBonus = currentRealm.baseStatsBonus;

  if (baseBonus.hp) stats.hp = (stats.hp || 0) + Math.floor(baseBonus.hp * stageMultiplier);
  if (baseBonus.def) stats.def = (stats.def || 0) + Math.floor(baseBonus.def * stageMultiplier);
  if (baseBonus.atk) stats.atk = (stats.atk || 0) + Math.floor(baseBonus.atk * stageMultiplier);
  if (baseBonus.speed) stats.speed = (stats.speed || 0) + Math.floor(baseBonus.speed * stageMultiplier);
  if (baseBonus.critRate) stats.critRate = (stats.critRate || 0) + baseBonus.critRate;
  if (baseBonus.critDmg) stats.critDmg = (stats.critDmg || 0) + baseBonus.critDmg;
  if (baseBonus.damageReduction) stats.damageReduction = (stats.damageReduction || 0) + baseBonus.damageReduction;
  if (baseBonus.hpRegen) stats.hpRegen = (stats.hpRegen || 0) + baseBonus.hpRegen;
  if (baseBonus.trueDmgPercent) stats.trueDmgPercent = (stats.trueDmgPercent || 0) + baseBonus.trueDmgPercent;
  if (baseBonus.counterDmgPercent) stats.counterDmgPercent = (stats.counterDmgPercent || 0) + baseBonus.counterDmgPercent;

  // 1b. Chỉ số cộng dồn từ 6 Bộ Phận Cường Hóa
  (physique.parts || []).forEach(part => {
    const cfg = PHYSIQUE_PARTS_CONFIG[part.id];
    if (!cfg || part.level <= 0) return;

    const perLvl = cfg.statPerLevel;
    if (perLvl.hp) stats.hp = (stats.hp || 0) + perLvl.hp * part.level;
    if (perLvl.def) stats.def = (stats.def || 0) + perLvl.def * part.level;
    if (perLvl.atk) stats.atk = (stats.atk || 0) + perLvl.atk * part.level;
    if (perLvl.speed) stats.speed = (stats.speed || 0) + perLvl.speed * part.level;
    if (perLvl.damageReduction) stats.damageReduction = (stats.damageReduction || 0) + perLvl.damageReduction * part.level;
    if (perLvl.hpRegen) stats.hpRegen = (stats.hpRegen || 0) + perLvl.hpRegen * part.level;
    if (perLvl.trueDmgPercent) stats.trueDmgPercent = (stats.trueDmgPercent || 0) + perLvl.trueDmgPercent * part.level;
  });

  return stats;
}

/**
 * 2. Tính toán EXP luyện thể thụ động theo chu kỳ thời gian (AFK Passive Ticker)
 */
export function processPhysiquePassiveTick(
  player: PlayerStats,
  now: number = Date.now()
): {
  updatedPlayer: PlayerStats;
  expGained: number;
  stagesAdvanced: number;
  msg: string[];
} {
  const physique = player.physiqueState || createDefaultPhysiqueState();
  const lastTick = physique.passiveTickerTimestamp || now;
  const elapsedSeconds = Math.max(0, Math.floor((now - lastTick) / 1000));

  if (elapsedSeconds < 5) {
    return {
      updatedPlayer: player,
      expGained: 0,
      stagesAdvanced: 0,
      msg: []
    };
  }

  // Tốc độ cơ bản: 1 EXP mỗi 10 giây * hệ số tiềm năng (potential / 100)
  const potentialFactor = Math.max(0.5, physique.cultivation.physiquePotential / 100);
  const baseTicks = Math.floor(elapsedSeconds / 10);
  const expGained = Math.max(1, Math.floor(baseTicks * potentialFactor));

  let currentExp = physique.cultivation.currentExp + expGained;
  let currentStage = physique.cultivation.currentStage;
  let expToNextStage = physique.cultivation.expToNextStage;
  let stagesAdvanced = 0;
  const msg: string[] = [];

  // Tự động thăng cấp tiểu tầng nếu đủ EXP (tối đa tầng 9 của cảnh giới hiện tại)
  while (currentStage < 9 && currentExp >= expToNextStage) {
    currentExp -= expToNextStage;
    currentStage += 1;
    stagesAdvanced += 1;
    // Tăng exp yêu cầu cho tầng tiếp theo (+15%)
    expToNextStage = Math.floor(expToNextStage * 1.15);
    msg.push(`Nhục thân đột phá Tầng ${currentStage}!`);
  }

  // Nếu ở tầng 9, giữ EXP tối đa bằng expToNextStage chờ người chơi bấm Phá Cảnh
  if (currentStage >= 9 && currentExp > expToNextStage) {
    currentExp = expToNextStage;
  }

  const updatedPhysique: PhysiqueState = {
    ...physique,
    cultivation: {
      ...physique.cultivation,
      currentExp,
      currentStage,
      expToNextStage
    },
    passiveTickerTimestamp: now
  };

  return {
    updatedPlayer: {
      ...player,
      physiqueState: updatedPhysique
    },
    expGained,
    stagesAdvanced,
    msg
  };
}

/**
 * 3. Kiểm tra điều kiện đột phá đại cảnh giới Nhục Thân
 */
export function canBreakthroughPhysiqueRealm(player: PlayerStats): {
  canBreakthrough: boolean;
  reason: string;
  requiredLinhThach: number;
  currentRealm: PhysiqueRealm;
  nextRealm: PhysiqueRealm | null;
  isLockedByRealm?: boolean;
  requiredRealmName?: string;
} {
  const physique = player.physiqueState || createDefaultPhysiqueState();
  const currentRealmIndex = PHYSIQUE_REALMS.findIndex(r => r.id === physique.cultivation.currentRealmId);
  const currentRealm = PHYSIQUE_REALMS[currentRealmIndex] || PHYSIQUE_REALMS[0];
  const nextRealm = PHYSIQUE_REALMS[currentRealmIndex + 1] || null;

  if (!nextRealm) {
    return {
      canBreakthrough: false,
      reason: 'Nhục thân đã đạt tới cảnh giới cực hạn tối thượng [Bất Diệt Tiên Thể]!',
      requiredLinhThach: 0,
      currentRealm,
      nextRealm: null,
      isLockedByRealm: false
    };
  }

  const requiredLinhThach = (nextRealm.realmIndex * 4000) + 1000;

  // 1. Kiểm tra giới hạn cảnh giới bản thể (Realm Lock Matrix)
  const targetTierIndex = nextRealm.realmIndex + 1; // 1 đến 10
  const maxAllowedTier = getMaxPhysiqueTierForRealm(player.currentRealm || 0);
  const isLockedByRealm = targetTierIndex > maxAllowedTier;
  const requiredRealmName = getRequiredRealmNameForPhysiqueTier(targetTierIndex);

  if (isLockedByRealm) {
    return {
      canBreakthrough: false,
      reason: `Bản thể chưa đạt [${requiredRealmName}], kinh mạch chưa đủ cường độ dung nạp thể phách cấp cao!`,
      requiredLinhThach,
      currentRealm,
      nextRealm,
      isLockedByRealm: true,
      requiredRealmName
    };
  }

  // 2. Yêu cầu đạt Tầng 9 và EXP đạt tối đa
  if (physique.cultivation.currentStage < 9) {
    return {
      canBreakthrough: false,
      reason: `Chưa đạt Tầng 9 viên mãn (Hiện tại: Tầng ${physique.cultivation.currentStage}/9)!`,
      requiredLinhThach,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  if (physique.cultivation.currentExp < physique.cultivation.expToNextStage) {
    const remain = physique.cultivation.expToNextStage - physique.cultivation.currentExp;
    return {
      canBreakthrough: false,
      reason: `Khí huyết chưa đủ viên mãn để phá cảnh! Cần thêm ${remain.toLocaleString()} EXP Nhục Thân.`,
      requiredLinhThach,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  // 3. Yêu cầu Linh Thạch
  if (player.linhThach < requiredLinhThach) {
    return {
      canBreakthrough: false,
      reason: `Linh thạch không đủ để hộ thể phá cảnh! Cần ${requiredLinhThach.toLocaleString()} Linh Thạch.`,
      requiredLinhThach,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  return {
    canBreakthrough: true,
    reason: 'Đủ điều kiện đột phá đại cảnh giới!',
    requiredLinhThach,
    currentRealm,
    nextRealm,
    isLockedByRealm: false,
    requiredRealmName
  };
}

/**
 * 4. Đột phá đại cảnh giới Nhục Thân
 */
export function breakthroughPhysiqueRealm(player: PlayerStats): {
  updatedPlayer: PlayerStats;
  success: boolean;
  msg: string;
} {
  const check = canBreakthroughPhysiqueRealm(player);
  if (!check.canBreakthrough || !check.nextRealm) {
    return {
      updatedPlayer: player,
      success: false,
      msg: check.reason
    };
  }

  const physique = player.physiqueState || createDefaultPhysiqueState();
  const nextRealm = check.nextRealm;
  const nextBaseExp = REALM_BASE_STAGE_EXP[nextRealm.realmIndex] || 1000;

  const updatedPhysique: PhysiqueState = {
    ...physique,
    cultivation: {
      ...physique.cultivation,
      currentRealmId: nextRealm.id,
      currentStage: 1,
      currentExp: 0,
      expToNextStage: nextBaseExp,
      maxPotential: (physique.cultivation.maxPotential || 1000) + 200,
      physiquePotential: (physique.cultivation.physiquePotential || 100) + 50
    },
    passiveTickerTimestamp: Date.now()
  };

  const updated: PlayerStats = {
    ...player,
    linhThach: player.linhThach - check.requiredLinhThach,
    physiqueState: updatedPhysique
  };

  return {
    updatedPlayer: updated,
    success: true,
    msg: `🎉 Chúc mừng! Nhục Thân lột xác đột phá đại cảnh giới [${nextRealm.name}]! Khai mở năng lực: [${nextRealm.specialAbilityName || 'Hộ Thể'}]!`
  };
}

/**
 * 5. Cường hóa một bộ phận nhục thân
 */
export function upgradePhysiquePart(
  player: PlayerStats,
  partId: string
): {
  updatedPlayer: PlayerStats;
  success: boolean;
  msg: string;
} {
  const physique = player.physiqueState || createDefaultPhysiqueState();
  const part = (physique.parts || []).find(p => p.id === partId);
  const cfg = PHYSIQUE_PARTS_CONFIG[partId];

  if (!part || !cfg) {
    return { updatedPlayer: player, success: false, msg: 'Bộ phận rèn luyện không hợp lệ!' };
  }

  if (part.level >= cfg.maxLevel) {
    return { updatedPlayer: player, success: false, msg: `[${cfg.name}] đã đạt cấp tối đa (${cfg.maxLevel})!` };
  }

  const nextLevel = part.level + 1;
  const costLinhThach = Math.floor(cfg.baseCostLinhThach * Math.pow(cfg.costMultiplier, part.level));

  if (player.linhThach < costLinhThach) {
    return {
      updatedPlayer: player,
      success: false,
      msg: `Linh thạch không đủ! Cần ${costLinhThach.toLocaleString()} Linh thạch.`
    };
  }

  // Kiểm tra vật phẩm tiêu hao (Tinh huyết, Khoáng thạch, Dược thảo)
  let updatedTinhHuyet = player.tinhHuyetYeuThu || 0;
  let invOres = [...(player.inventory?.ores || [])];
  let invHerbs = [...(player.inventory?.herbs || [])];
  const requiredCount = Math.max(1, Math.floor(nextLevel / 10) + 1);

  if (cfg.requiredMaterialId === 'tinhHuyet') {
    if (updatedTinhHuyet < requiredCount) {
      return {
        updatedPlayer: player,
        success: false,
        msg: `Không đủ [Tinh Huyết Yêu Thú x${requiredCount}]! Hiện có: ${updatedTinhHuyet}.`
      };
    }
    updatedTinhHuyet -= requiredCount;
  } else if (cfg.requiredMaterialId === 'hac_thiet_khoang') {
    const oreIdx = invOres.findIndex(o => o.id === 'hac_thiet_khoang' || o.id.includes('thiet') || o.name?.includes('Thiết'));
    if (oreIdx === -1 || (invOres[oreIdx].quantity || 0) < requiredCount) {
      return {
        updatedPlayer: player,
        success: false,
        msg: `Không đủ khoáng thạch [${cfg.requiredMaterialName} x${requiredCount}] để rèn xương!`
      };
    }
    invOres[oreIdx].quantity -= requiredCount;
    if (invOres[oreIdx].quantity <= 0) invOres.splice(oreIdx, 1);
  } else {
    // Dược liệu
    const herbIdx = invHerbs.findIndex(h => h.id === cfg.requiredMaterialId || h.id.includes(cfg.requiredMaterialId));
    if (herbIdx === -1 || (invHerbs[herbIdx].quantity || 0) < requiredCount) {
      return {
        updatedPlayer: player,
        success: false,
        msg: `Không đủ linh dược [${cfg.requiredMaterialName} x${requiredCount}]!`
      };
    }
    invHerbs[herbIdx].quantity -= requiredCount;
    if (invHerbs[herbIdx].quantity <= 0) invHerbs.splice(herbIdx, 1);
  }

  // Cập nhật bộ phận
  const updatedParts = (physique.parts || []).map(p => {
    if (p.id === partId) {
      return {
        ...p,
        level: nextLevel
      };
    }
    return p;
  });

  const updatedPhysique: PhysiqueState = {
    ...physique,
    parts: updatedParts
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: player.linhThach - costLinhThach,
    tinhHuyetYeuThu: updatedTinhHuyet,
    inventory: {
      ...(player.inventory || {}),
      ores: invOres,
      herbs: invHerbs,
      pills: player.inventory?.pills || [],
      manuals: player.inventory?.manuals || [],
      equipments: player.inventory?.equipments || [],
      gems: player.inventory?.gems || [],
      books: player.inventory?.books || [],
      bags: player.inventory?.bags || []
    },
    physiqueState: updatedPhysique
  };

  return {
    updatedPlayer,
    success: true,
    msg: `✨ Rèn luyện [${cfg.name}] lên Cấp ${nextLevel}! Chỉ số nhục thân gia tăng mạnh mẽ!`
  };
}

/**
 * 6. Sử dụng vật phẩm / đan dược gia tăng trực tiếp EXP hoặc Tiềm Năng Nhục Thân
 */
export function usePhysiqueItem(
  player: PlayerStats,
  itemId: string,
  quantity: number = 1
): {
  updatedPlayer: PlayerStats;
  success: boolean;
  msg: string;
} {
  const physique = player.physiqueState || createDefaultPhysiqueState();
  let expGain = 0;
  let potentialGain = 0;
  let updatedTinhHuyet = player.tinhHuyetYeuThu || 0;
  let invPills = [...(player.inventory?.pills || [])];

  if (itemId === 'tinhHuyet') {
    if (updatedTinhHuyet < quantity) {
      return { updatedPlayer: player, success: false, msg: 'Không đủ Tinh Huyết Yêu Thú!' };
    }
    updatedTinhHuyet -= quantity;
    expGain = 50 * quantity;
    potentialGain = 2 * quantity;
  } else {
    const pillIdx = invPills.findIndex(p => p.id === itemId);
    if (pillIdx === -1 || (invPills[pillIdx].quantity || 0) < quantity) {
      return { updatedPlayer: player, success: false, msg: 'Vật phẩm trong túi không đủ số lượng!' };
    }

    if (itemId === 'pill_khi_huyet') {
      expGain = 250 * quantity;
      potentialGain = 10 * quantity;
    } else if (itemId === 'pill_khi_huyet_cuc_pham') {
      expGain = 1500 * quantity;
      potentialGain = 50 * quantity;
    } else if (itemId === 'pill_tay_tuy') {
      potentialGain = 80 * quantity;
    } else {
      expGain = 100 * quantity;
    }

    invPills[pillIdx].quantity -= quantity;
    if (invPills[pillIdx].quantity <= 0) invPills.splice(pillIdx, 1);
  }

  let currentExp = physique.cultivation.currentExp + expGain;
  let currentStage = physique.cultivation.currentStage;
  let expToNextStage = physique.cultivation.expToNextStage;
  let stagesUp = 0;

  while (currentStage < 9 && currentExp >= expToNextStage) {
    currentExp -= expToNextStage;
    currentStage += 1;
    stagesUp += 1;
    expToNextStage = Math.floor(expToNextStage * 1.15);
  }

  if (currentStage >= 9 && currentExp > expToNextStage) {
    currentExp = expToNextStage;
  }

  const updatedPotential = Math.min(
    physique.cultivation.maxPotential || 1000,
    (physique.cultivation.physiquePotential || 100) + potentialGain
  );

  const updatedPhysique: PhysiqueState = {
    ...physique,
    cultivation: {
      ...physique.cultivation,
      currentExp,
      currentStage,
      expToNextStage,
      physiquePotential: updatedPotential
    }
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    tinhHuyetYeuThu: updatedTinhHuyet,
    inventory: {
      herbs: [],
      ores: [],
      ...(player.inventory || {}),
      pills: invPills
    },
    physiqueState: updatedPhysique
  };

  const stageMsg = stagesUp > 0 ? ` Đột phá +${stagesUp} Tiểu Tầng!` : '';
  return {
    updatedPlayer,
    success: true,
    msg: `💪 Thu nạp thành công! Nhận +${expGain.toLocaleString()} EXP Nhục Thân, +${potentialGain} Điểm Tiềm Năng!${stageMsg}`
  };
}
