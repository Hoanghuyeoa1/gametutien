// lib/soul-logic.ts
// Logic nghiệp vụ thuần túy cho phân hệ Thức Hải Thần Hồn (Soul & Consciousness System)

import { PlayerStats } from './types/player';
import {
  SoulState,
  SoulRealm,
  SoulStatBonus,
  SoulRelic
} from './types/soul';
import {
  SOUL_REALMS,
  SOUL_STAGE_EXP_BASE,
  SOUL_NOURISHING_ITEMS,
  SOUL_RELICS_CATALOG,
  createDefaultSoulState,
  getMaxSoulTierForRealm,
  getRequiredRealmNameForSoulTier
} from './soul-data';

export {
  getMaxSoulTierForRealm,
  getRequiredRealmNameForSoulTier
};


/**
 * 1. Tổng hợp toàn bộ chỉ số gia trì từ Cảnh Giới Thần Hồn, Tiểu Tầng và Hồn Khí
 */
export function calculateSoulBuffs(soul?: SoulState): {
  statsBonus: SoulStatBonus;
  spiritualPressure: number;
  maxControlSlots: number;
} {
  const resultStats: SoulStatBonus = {
    triLuc: 0,
    tinhThan: 0,
    khangPhep: 0,
    khangKhongChe: 0,
    spiritualPressure: 0,
    speed: 0,
    critRate: 0,
    critDmg: 0,
    atk: 0,
    def: 0,
    hp: 0
  };

  if (!soul) {
    return {
      statsBonus: resultStats,
      spiritualPressure: 0,
      maxControlSlots: 1
    };
  }

  const { cultivation, equippedRelics } = soul;
  const realmIndex = Math.max(0, SOUL_REALMS.findIndex(r => r.id === cultivation.currentRealmId));
  const currentRealm = SOUL_REALMS[realmIndex] || SOUL_REALMS[0];
  const stage = Math.max(1, Math.min(9, cultivation.currentStage || 1));

  // Hệ số tiểu tầng: Mỗi tầng nhỏ gia tăng thêm 10% buff cơ sở của cảnh giới
  const stageMultiplier = 1 + (stage - 1) * 0.12;

  // Buff từ Cảnh Giới
  const rStats = currentRealm.statsBonus;
  if (rStats.triLuc) resultStats.triLuc = (resultStats.triLuc || 0) + Math.floor(rStats.triLuc * stageMultiplier);
  if (rStats.tinhThan) resultStats.tinhThan = (resultStats.tinhThan || 0) + Math.floor(rStats.tinhThan * stageMultiplier);
  if (rStats.khangPhep) resultStats.khangPhep = (resultStats.khangPhep || 0) + rStats.khangPhep;
  if (rStats.khangKhongChe) resultStats.khangKhongChe = (resultStats.khangKhongChe || 0) + rStats.khangKhongChe;
  if (rStats.speed) resultStats.speed = (resultStats.speed || 0) + Math.floor(rStats.speed * stageMultiplier);
  if (rStats.critRate) resultStats.critRate = (resultStats.critRate || 0) + rStats.critRate;
  if (rStats.critDmg) resultStats.critDmg = (resultStats.critDmg || 0) + rStats.critDmg;
  if (rStats.atk) resultStats.atk = (resultStats.atk || 0) + Math.floor(rStats.atk * stageMultiplier);
  if (rStats.def) resultStats.def = (resultStats.def || 0) + Math.floor(rStats.def * stageMultiplier);
  if (rStats.hp) resultStats.hp = (resultStats.hp || 0) + Math.floor(rStats.hp * stageMultiplier);

  let totalPressure = currentRealm.spiritualPressure + Math.floor((stage - 1) * 0.8);
  let totalControlSlots = currentRealm.maxControlSlots;

  // Buff từ Hồn Khí (Tối đa 3 món)
  if (equippedRelics && Array.isArray(equippedRelics)) {
    for (const relic of equippedRelics) {
      if (!relic || !relic.statsBonus) continue;
      const b = relic.statsBonus;
      if (b.triLuc) resultStats.triLuc = (resultStats.triLuc || 0) + b.triLuc;
      if (b.tinhThan) resultStats.tinhThan = (resultStats.tinhThan || 0) + b.tinhThan;
      if (b.khangPhep) resultStats.khangPhep = (resultStats.khangPhep || 0) + b.khangPhep;
      if (b.khangKhongChe) resultStats.khangKhongChe = (resultStats.khangKhongChe || 0) + b.khangKhongChe;
      if (b.speed) resultStats.speed = (resultStats.speed || 0) + b.speed;
      if (b.critRate) resultStats.critRate = (resultStats.critRate || 0) + b.critRate;
      if (b.critDmg) resultStats.critDmg = (resultStats.critDmg || 0) + b.critDmg;
      if (b.atk) resultStats.atk = (resultStats.atk || 0) + b.atk;
      if (b.def) resultStats.def = (resultStats.def || 0) + b.def;
      if (b.hp) resultStats.hp = (resultStats.hp || 0) + b.hp;
      if (b.spiritualPressure) totalPressure += b.spiritualPressure;
    }
  }

  return {
    statsBonus: resultStats,
    spiritualPressure: totalPressure,
    maxControlSlots: totalControlSlots
  };
}

/**
 * 2. Tính toán điều chỉnh tỷ lệ đột phá khí tu & độ kiếp dựa trên Thần Hồn và Tâm Cảnh
 */
export function calculateBreakthroughSuccessModifier(soul?: SoulState): {
  successRateBonus: number;
  tribulationDamageReduction: number;
  tamMaChanceReduction: number;
} {
  if (!soul) {
    return {
      successRateBonus: 0,
      tribulationDamageReduction: 0,
      tamMaChanceReduction: 0
    };
  }

  const { cultivation, mindState } = soul;
  const realmIndex = Math.max(0, SOUL_REALMS.findIndex(r => r.id === cultivation.currentRealmId));
  const stability = Math.max(0, Math.min(100, mindState.stability));
  const corruption = Math.max(0, Math.min(100, mindState.demonCorruption));

  // Tâm Cảnh vững vàng (> 70%) giúp tăng tỉ lệ độ kiếp
  let stabilityBonus = 0;
  if (stability >= 90) {
    stabilityBonus = 12; // +12% tỉ lệ thành công
  } else if (stability >= 75) {
    stabilityBonus = 6;
  } else if (stability < 50) {
    stabilityBonus = -15; // Phạt -15% nếu tâm ma quấy nhiễu
  }

  const realmSuccessBonus = realmIndex * 1.5; // Mỗi cảnh giới Thần Hồn +1.5%
  const totalSuccessBonus = Math.max(-20, Math.min(25, stabilityBonus + realmSuccessBonus));

  // Giảm sát thương lôi kiếp / tâm ma phản phệ
  const tribulationDmgReduction = Math.min(40, realmIndex * 3 + Math.floor(stability * 0.15));

  // Giảm nguy cơ gặp Tâm Ma
  let tamMaReduction = Math.min(50, Math.floor(stability * 0.4) - Math.floor(corruption * 0.3));
  tamMaReduction = Math.max(0, tamMaReduction);

  return {
    successRateBonus: totalSuccessBonus,
    tribulationDamageReduction: tribulationDmgReduction,
    tamMaChanceReduction: tamMaReduction
  };
}

/**
 * 3. Tĩnh Tọa Minh Tưởng Thức Hải (Passive & Offline Meditation Tick)
 */
export function processMeditationTick(
  player: PlayerStats,
  hoursPassed?: number
): {
  updatedPlayer: PlayerStats;
  expGained: number;
  stabilityGained: number;
  corruptionCleansed: number;
  stagesUp: number;
  msg: string[];
} {
  const soul = player.soulState || createDefaultSoulState();
  const now = Date.now();
  const lastTime = soul.lastMeditationTimestamp || now;
  const diffHours = hoursPassed !== undefined 
    ? hoursPassed 
    : Math.min(24, Math.max(0, (now - lastTime) / (1000 * 60 * 60)));

  if (diffHours <= 0.05) {
    return {
      updatedPlayer: player,
      expGained: 0,
      stabilityGained: 0,
      corruptionCleansed: 0,
      stagesUp: 0,
      msg: ['Thức Hải vẫn tĩnh lặng, chưa đủ thời gian tích lũy linh niệm.']
    };
  }

  const realmIndex = Math.max(0, SOUL_REALMS.findIndex(r => r.id === soul.cultivation.currentRealmId));
  const currentRealm = SOUL_REALMS[realmIndex] || SOUL_REALMS[0];

  // Base EXP per hour
  let expPerHour = 25 * (realmIndex + 1);
  // Đặc quyền Du Thần (Cảnh giới >= 4): +20% tốc độ tu vi bế quan
  if (realmIndex >= 4) {
    expPerHour = Math.floor(expPerHour * 1.2);
  }

  const expGained = Math.floor(expPerHour * diffHours);
  const stabilityGained = Math.min(30, Math.floor(5 * diffHours));
  const corruptionCleansed = Math.min(25, Math.floor(4 * diffHours));

  let currentExp = soul.cultivation.currentExp + expGained;
  let currentStage = soul.cultivation.currentStage;
  let expToNextStage = soul.cultivation.expToNextStage;
  let stagesUp = 0;

  // Tự động thăng tiểu tầng nếu tích đủ EXP
  while (currentStage < currentRealm.maxStage && currentExp >= expToNextStage) {
    currentExp -= expToNextStage;
    currentStage++;
    stagesUp++;
    const baseExp = SOUL_STAGE_EXP_BASE[realmIndex] || 100;
    expToNextStage = Math.floor(baseExp * Math.pow(1.15, currentStage - 1));
  }

  const newStability = Math.min(100, soul.mindState.stability + stabilityGained);
  const newCorruption = Math.max(0, soul.mindState.demonCorruption - corruptionCleansed);

  // Phục hồi Thần Niệm
  const newSoulPower = Math.min(
    soul.cultivation.soulSeaCapacity,
    soul.cultivation.currentSoulPower + Math.floor(soul.cultivation.soulSeaCapacity * 0.2 * diffHours)
  );

  const updatedSoul: SoulState = {
    ...soul,
    cultivation: {
      ...soul.cultivation,
      currentExp,
      currentStage,
      expToNextStage,
      currentSoulPower: newSoulPower
    },
    mindState: {
      ...soul.mindState,
      stability: newStability,
      demonCorruption: newCorruption
    },
    lastMeditationTimestamp: now
  };

  const msgs: string[] = [
    `🧘 Tĩnh tọa minh tưởng ${diffHours.toFixed(1)} canh giờ: Nhận +${expGained.toLocaleString()} EXP Thần Hồn!`,
    `Tâm Cảnh tăng +${stabilityGained}%, Ma Tính được gột rửa -${corruptionCleansed}%.`
  ];
  if (stagesUp > 0) {
    msgs.push(`🌟 Đột phá +${stagesUp} Tiểu Tầng Thần Hồn! Đạt [${currentRealm.name} - Tầng ${currentStage}].`);
  }

  return {
    updatedPlayer: {
      ...player,
      soulState: updatedSoul
    },
    expGained,
    stabilityGained,
    corruptionCleansed,
    stagesUp,
    msg: msgs
  };
}

/**
 * 4. Trảm Diệt Tâm Ma / Thanh Tẩy Ma Tính
 */
export function exorciseMentalDemon(
  player: PlayerStats
): {
  updatedPlayer: PlayerStats;
  success: boolean;
  message: string;
} {
  const soul = player.soulState || createDefaultSoulState();
  if (soul.mindState.demonCorruption <= 0 && soul.mindState.stability >= 100) {
    return {
      updatedPlayer: player,
      success: false,
      message: 'Tâm Cảnh đã hoàn toàn trong sáng như gương ngọc, không có Tâm Ma quấy nhiễu!'
    };
  }

  // Tiêu hao Linh Lực hoặc Linh Thạch để ngưng kết kiếm ý trảm ma
  const costLinhThach = Math.max(500, (soul.mindState.demonLevel + 1) * 1000);
  if (player.linhThach < costLinhThach) {
    return {
      updatedPlayer: player,
      success: false,
      message: `Cần ${costLinhThach.toLocaleString()} Linh Thạch để lập pháp trận thanh tẩy Tâm Ma!`
    };
  }

  const cleansed = Math.min(soul.mindState.demonCorruption, 35);
  const newCorruption = Math.max(0, soul.mindState.demonCorruption - cleansed);
  const newStability = Math.min(100, soul.mindState.stability + 25);
  const newLevel = newCorruption === 0 ? Math.max(0, soul.mindState.demonLevel - 1) : soul.mindState.demonLevel;

  const updatedSoul: SoulState = {
    ...soul,
    mindState: {
      ...soul.mindState,
      stability: newStability,
      demonCorruption: newCorruption,
      demonLevel: newLevel
    }
  };

  return {
    updatedPlayer: {
      ...player,
      linhThach: player.linhThach - costLinhThach,
      soulState: updatedSoul
    },
    success: true,
    message: `🗡️ Trảm Ma thành công! Thanh tẩy -${cleansed}% Ma Tính, Tâm Cảnh phục hồi lên ${newStability}%.`
  };
}

/**
 * 5. Tác Động Uy Áp Thần Thức trong Giao Tranh (Combat Debuff)
 */
export function applySpiritualPressureCombat(
  attackerSoul?: SoulState,
  defenderSoul?: SoulState
): {
  debuffPercent: number;
  isAttackerSuperior: boolean;
  msg?: string;
} {
  const attackerBuffs = calculateSoulBuffs(attackerSoul);
  const defenderBuffs = calculateSoulBuffs(defenderSoul);

  const diff = attackerBuffs.spiritualPressure - defenderBuffs.spiritualPressure;
  if (diff <= 2) {
    return {
      debuffPercent: 0,
      isAttackerSuperior: false
    };
  }

  // Tối đa suy giảm 25% công thủ của đối phương
  const debuffPercent = Math.min(25, Math.floor(diff * 0.7));
  return {
    debuffPercent,
    isAttackerSuperior: true,
    msg: `🔮 Thần Thức Uy Áp áp chế! Giảm ${debuffPercent}% Công Thủ của đối phương từ hiệp đầu!`
  };
}

/**
 * 6. Kiểm tra điều kiện Phá Cảnh Đại Cảnh Giới Thần Hồn
 */
export function canBreakthroughSoulRealm(player: PlayerStats): {
  canBreakthrough: boolean;
  reason?: string;
  currentRealm?: SoulRealm;
  nextRealm?: SoulRealm | null;
  isLockedByRealm?: boolean;
  requiredRealmName?: string;
} {
  const soul = player.soulState || createDefaultSoulState();
  const realmIdx = SOUL_REALMS.findIndex(r => r.id === soul.cultivation.currentRealmId);
  const currentRealm = SOUL_REALMS[realmIdx] || SOUL_REALMS[0];
  const nextRealm = SOUL_REALMS[realmIdx + 1] || null;

  if (!nextRealm) {
    return {
      canBreakthrough: false,
      reason: 'Đã đạt đỉnh phong Hỗn Độn Thần Niệm, thần thức bao trùm tam giới!',
      currentRealm,
      nextRealm: null,
      isLockedByRealm: false
    };
  }

  // 1. Kiểm tra giới hạn cảnh giới bản thể (Realm Lock Matrix)
  const targetTierIndex = nextRealm.realmIndex + 1; // 1 đến 10
  const maxAllowedTier = getMaxSoulTierForRealm(player.currentRealm || 0);
  const isLockedByRealm = targetTierIndex > maxAllowedTier;
  const requiredRealmName = getRequiredRealmNameForSoulTier(targetTierIndex);

  if (isLockedByRealm) {
    return {
      canBreakthrough: false,
      reason: `Thức hải chưa đạt [${requiredRealmName}], thần niệm quá tải sẽ gây nứt vỡ hồn phách!`,
      currentRealm,
      nextRealm,
      isLockedByRealm: true,
      requiredRealmName
    };
  }

  // 2. Yêu cầu tu luyện đến Tiểu Tầng maxStage (9)
  if (soul.cultivation.currentStage < currentRealm.maxStage) {
    return {
      canBreakthrough: false,
      reason: `Cần tu luyện đến Tiểu Tầng ${currentRealm.maxStage} Viên Mãn (Hiện tại: Tầng ${soul.cultivation.currentStage}).`,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  // 3. Yêu cầu EXP Thần Hồn
  if (soul.cultivation.currentExp < soul.cultivation.expToNextStage) {
    return {
      canBreakthrough: false,
      reason: `EXP Thần Hồn chưa đầy đủ (${soul.cultivation.currentExp.toLocaleString()} / ${soul.cultivation.expToNextStage.toLocaleString()}).`,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  // 4. Yêu cầu Tâm Cảnh
  if (soul.mindState.stability < 70) {
    return {
      canBreakthrough: false,
      reason: `Tâm Cảnh bất ổn (${soul.mindState.stability}%), cần đạt tối thiểu 70% để tránh Tẩu Hỏa Nhập Ma!`,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  // 5. Yêu cầu Ma Tính
  if (soul.mindState.demonCorruption > 40) {
    return {
      canBreakthrough: false,
      reason: `Ma Tính quá cao (${soul.mindState.demonCorruption}%), phải thanh tẩy trước khi ngưng tụ Thần Hồn!`,
      currentRealm,
      nextRealm,
      isLockedByRealm: false,
      requiredRealmName
    };
  }

  return {
    canBreakthrough: true,
    currentRealm,
    nextRealm,
    isLockedByRealm: false,
    requiredRealmName
  };
}

/**
 * 7. Thực hiện Phá Cảnh Thần Hồn
 */
export function breakthroughSoulRealm(player: PlayerStats): {
  updatedPlayer: PlayerStats;
  success: boolean;
  msg: string;
} {
  const check = canBreakthroughSoulRealm(player);
  if (!check.canBreakthrough || !check.nextRealm) {
    return {
      updatedPlayer: player,
      success: false,
      msg: check.reason || 'Chưa đủ điều kiện độ kiếp Thần Hồn!'
    };
  }

  const soul = player.soulState || createDefaultSoulState();
  const nextRealm = check.nextRealm;
  const nextBaseExp = SOUL_STAGE_EXP_BASE[nextRealm.realmIndex] || 1000;
  const newCapacity = soul.cultivation.soulSeaCapacity + 250 * (nextRealm.realmIndex + 1);

  const updatedSoul: SoulState = {
    ...soul,
    cultivation: {
      currentRealmId: nextRealm.id,
      currentStage: 1,
      currentExp: 0,
      expToNextStage: nextBaseExp,
      soulSeaCapacity: newCapacity,
      currentSoulPower: newCapacity
    },
    mindState: {
      ...soul.mindState,
      stability: Math.min(100, soul.mindState.stability + 15),
      demonCorruption: Math.max(0, soul.mindState.demonCorruption - 10)
    }
  };

  return {
    updatedPlayer: {
      ...player,
      soulState: updatedSoul
    },
    success: true,
    msg: `⚡ ĐỘ KIẾP THÀNH CÔNG! Thần Thức thăng hoa, bước vào [${nextRealm.name}]! Thức Hải mở rộng lên ${newCapacity.toLocaleString()} Thần Niệm!`
  };
}

/**
 * 8. Trang bị hoặc thay thế Hồn Khí
 */
export function equipSoulRelic(
  player: PlayerStats,
  relicId: string
): {
  updatedPlayer: PlayerStats;
  success: boolean;
  msg: string;
} {
  const soul = player.soulState || createDefaultSoulState();
  const targetRelic = SOUL_RELICS_CATALOG.find(r => r.id === relicId);
  if (!targetRelic) {
    return { updatedPlayer: player, success: false, msg: 'Hồn Khí không tồn tại!' };
  }

  let equipped = [...(soul.equippedRelics || [])];
  const isAlreadyEquipped = equipped.some(r => r.id === relicId);
  if (isAlreadyEquipped) {
    // Unequip
    equipped = equipped.filter(r => r.id !== relicId);
    return {
      updatedPlayer: {
        ...player,
        soulState: { ...soul, equippedRelics: equipped }
      },
      success: true,
      msg: `Đã thu hồi Hồn Khí [${targetRelic.name}] về thức hải!`
    };
  }

  // Tối đa 3 món
  if (equipped.length >= 3) {
    equipped.shift(); // Bỏ bớt món cũ nhất
  }
  equipped.push(targetRelic);

  return {
    updatedPlayer: {
      ...player,
      soulState: { ...soul, equippedRelics: equipped }
    },
    success: true,
    msg: `Đã tế luyện trang bị Hồn Khí [${targetRelic.name}] vào Thức Hải!`
  };
}

/**
 * 9. Sử dụng vật phẩm ôn dưỡng Thần Hồn
 */
export function useSoulNourishingItem(
  player: PlayerStats,
  itemId: string,
  quantity = 1
): {
  updatedPlayer: PlayerStats;
  success: boolean;
  msg: string;
} {
  const itemConfig = SOUL_NOURISHING_ITEMS.find(it => it.id === itemId);
  if (!itemConfig) {
    return { updatedPlayer: player, success: false, msg: 'Vật phẩm ôn dưỡng không hợp lệ!' };
  }

  // Check inventory or consume Linh Thạch nếu là tài nguyên đặc biệt
  const costLinhThach = 200 * quantity;
  if (player.linhThach < costLinhThach) {
    return {
      updatedPlayer: player,
      success: false,
      msg: `Cần ${costLinhThach.toLocaleString()} Linh Thạch để kích hoạt dược tính [${itemConfig.name}]!`
    };
  }

  const soul = player.soulState || createDefaultSoulState();
  const expGain = itemConfig.expGain * quantity;
  const stabilityGain = itemConfig.stabilityGain * quantity;
  const corruptionCleansed = itemConfig.corruptionCleansed * quantity;
  const powerRestore = itemConfig.soulPowerRestore * quantity;

  let currentExp = soul.cultivation.currentExp + expGain;
  let currentStage = soul.cultivation.currentStage;
  let expToNextStage = soul.cultivation.expToNextStage;
  const realmIndex = Math.max(0, SOUL_REALMS.findIndex(r => r.id === soul.cultivation.currentRealmId));
  const currentRealm = SOUL_REALMS[realmIndex] || SOUL_REALMS[0];
  let stagesUp = 0;

  while (currentStage < currentRealm.maxStage && currentExp >= expToNextStage) {
    currentExp -= expToNextStage;
    currentStage++;
    stagesUp++;
    const baseExp = SOUL_STAGE_EXP_BASE[realmIndex] || 100;
    expToNextStage = Math.floor(baseExp * Math.pow(1.15, currentStage - 1));
  }

  const updatedSoul: SoulState = {
    ...soul,
    cultivation: {
      ...soul.cultivation,
      currentExp,
      currentStage,
      expToNextStage,
      currentSoulPower: Math.min(soul.cultivation.soulSeaCapacity, soul.cultivation.currentSoulPower + powerRestore)
    },
    mindState: {
      ...soul.mindState,
      stability: Math.min(100, soul.mindState.stability + stabilityGain),
      demonCorruption: Math.max(0, soul.mindState.demonCorruption - corruptionCleansed)
    }
  };

  const stageMsg = stagesUp > 0 ? ` Đột phá +${stagesUp} Tiểu Tầng!` : '';
  return {
    updatedPlayer: {
      ...player,
      linhThach: player.linhThach - costLinhThach,
      soulState: updatedSoul
    },
    success: true,
    msg: `🔮 Dùng x${quantity} [${itemConfig.name}]: Nhận +${expGain.toLocaleString()} EXP Thần Hồn, Tâm Cảnh +${stabilityGain}%, Ma Tính -${corruptionCleansed}%!${stageMsg}`
  };
}
