// lib/custom-sect-logic.ts
// Pure Business Logic Engine cho Phân Hệ "Khai Tông Lập Phái & Chân Truyền Đệ Tử"

import {
  CustomSectState,
  ProceduralDisciple,
  DiscipleRank,
  DiscipleTaskType,
  SectDoctrine
} from '@/lib/types/custom-sect';
import { PlayerStats, Herb, Ore } from '@/lib/types';
import {
  SECT_DOCTRINES_CONFIG,
  SACRED_MOUNTAINS_POOL,
  DISCIPLE_SURNAMES,
  DISCIPLE_GIVEN_NAMES_MALE,
  DISCIPLE_GIVEN_NAMES_FEMALE,
  DISCIPLE_TRAITS_CONFIG,
  FACILITY_UPGRADE_CONFIG
} from '@/lib/custom-sect-data';
import realmsDataRaw from '@/data/realms-data.json';
import { calculateMountainYields } from '@/lib/sect-war-logic';

const realmsData = realmsDataRaw as any[];

/**
 * Khởi tạo trạng thái mặc định của Tông Môn khi chưa khai phái
 */
export function createDefaultCustomSectState(): CustomSectState {
  return {
    isFounded: false,
    sectName: '',
    mountainName: '',
    doctrine: 'chinh_dao',
    reputation: 0,
    sectVault: {
      linhThach: 0,
      herbs: {},
      ores: {},
      lastHarvestTimestamp: Date.now()
    },
    disciples: [],
    chosenInheritorId: null,
    lastRecruitmentTimestamp: 0,
    facilities: {
      mainHallLevel: 1,
      herbGardenFacilityLevel: 1,
      mineralVeinFacilityLevel: 1,
      guardianArrayLevel: 1
    }
  };
}

/**
 * Thuật toán sinh đệ tử ngẫu nhiên theo danh vọng và tôn chỉ
 */
export function generateProceduralCandidate(
  sectReputation: number = 0,
  doctrine: SectDoctrine = 'chinh_dao',
  customId?: string
): ProceduralDisciple {
  const gender: 'nam' | 'nu' = Math.random() < 0.5 ? 'nam' : 'nu';
  const surname = DISCIPLE_SURNAMES[Math.floor(Math.random() * DISCIPLE_SURNAMES.length)];
  const givenNames = gender === 'nam' ? DISCIPLE_GIVEN_NAMES_MALE : DISCIPLE_GIVEN_NAMES_FEMALE;
  const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
  const name = `${surname} ${givenName}`;

  // Tỷ lệ phẩm cấp linh căn dựa trên danh vọng môn phái
  const repBonus = Math.min(30, Math.floor(sectReputation / 20));
  const roll = Math.random() * 100 + repBonus;

  let grade: 'ha' | 'trung' | 'thuong' | 'cuc' | 'than' = 'ha';
  if (roll > 115) grade = 'than';
  else if (roll > 95) grade = 'cuc';
  else if (roll > 70) grade = 'thuong';
  else if (roll > 40) grade = 'trung';
  else grade = 'ha';

  const elements = ['kim', 'moc', 'thuy', 'hoa', 'tho', 'loi', 'phong', 'bang'];
  let element = elements[Math.floor(Math.random() * elements.length)];
  if (doctrine === 'kiem_tong' && Math.random() < 0.4) {
    element = 'kim';
  } else if (doctrine === 'dan_lo' && Math.random() < 0.4) {
    element = 'moc';
  }

  const elementNames: Record<string, string> = {
    kim: 'Kim', moc: 'Mộc', thuy: 'Thủy', hoa: 'Hỏa', tho: 'Thổ',
    loi: 'Lôi', phong: 'Phong', bang: 'Băng'
  };

  const gradeNames: Record<string, string> = {
    ha: 'Hạ Phẩm', trung: 'Trung Phẩm', thuong: 'Thượng Phẩm',
    cuc: 'Cực Phẩm', than: 'Thần Phẩm'
  };

  const linhCanName = `${elementNames[element] || 'Ngũ Hành'} ${gradeNames[grade]} Linh Căn`;

  // Căn cốt, ngộ tính, khí vận
  const baseBonus = grade === 'than' ? 40 : grade === 'cuc' ? 25 : grade === 'thuong' ? 15 : grade === 'trung' ? 8 : 0;
  const canCot = Math.min(100, Math.floor(35 + Math.random() * 40 + baseBonus));
  const ngoTinh = Math.min(100, Math.floor(35 + Math.random() * 40 + baseBonus));
  const khiVan = Math.min(100, Math.floor(30 + Math.random() * 45 + baseBonus));
  const loyalty = Math.floor(75 + Math.random() * 20); // Khởi đầu 75 - 95

  // Cảnh giới sơ khởi: Phàm Nhân đến Luyện Khí Tầng 6
  const realmIndex = Math.min(6, Math.floor(Math.random() * 4) + 1); // Realm 1..4
  const realmName = realmsData[realmIndex]?.name || `Luyện Khí Tầng ${realmIndex}`;
  const combatPower = Math.floor(realmIndex * 150 + canCot * 10 + ngoTinh * 8);

  // Tính cách ngẫu nhiên
  const traitKeys = Object.keys(DISCIPLE_TRAITS_CONFIG);
  const pickedTraitKey = traitKeys[Math.floor(Math.random() * traitKeys.length)];
  const pickedTrait = DISCIPLE_TRAITS_CONFIG[pickedTraitKey];

  return {
    id: customId || `disciple_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name,
    gender,
    realmIndex,
    realmName,
    linhCan: {
      name: linhCanName,
      element,
      grade
    },
    stats: {
      canCot,
      ngoTinh,
      khiVan,
      loyalty,
      combatPower
    },
    personalityTrait: {
      id: pickedTrait.id,
      name: pickedTrait.name,
      description: pickedTrait.description
    },
    rank: 'ngoai_mon',
    currentTask: 'idle',
    joinedAtTimestamp: Date.now()
  };
}

/**
 * Hành động Khai Sơn Lập Phái
 */
export function foundCustomSect(
  player: PlayerStats,
  sectName: string,
  mountainName: string,
  doctrine: SectDoctrine
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  // Điều kiện: Cảnh giới >= Hóa Thần Kỳ (id: 26)
  if ((player.currentRealm || 0) < 26) {
    const requiredRealm = realmsData[26]?.name || 'Hóa Thần Sơ Kỳ';
    return {
      success: false,
      message: `Tu vi chưa đủ để Khai Tông Lập Phái! Đạo hữu cần đạt tối thiểu [${requiredRealm}] (Cảnh giới 26+).`
    };
  }

  // Điều kiện: 100,000 Linh Thạch lập phái
  const COST_LINH_THACH = 100000;
  if ((player.linhThach || 0) < COST_LINH_THACH) {
    return {
      success: false,
      message: `Không đủ Linh Thạch lập phái! Cần ${COST_LINH_THACH.toLocaleString()} Linh Thạch để cúng tế thiên địa dựng cờ khai tông.`
    };
  }

  const cleanSectName = sectName.trim() || 'Thanh Vân Tiên Tông';
  const cleanMountain = mountainName.trim() || 'Thanh Vân Sơn';

  // Sinh 3 đệ tử khai sơn đầu tiên
  const initialDisciples: ProceduralDisciple[] = [
    generateProceduralCandidate(50, doctrine, 'disciple_init_1'),
    generateProceduralCandidate(50, doctrine, 'disciple_init_2'),
    generateProceduralCandidate(50, doctrine, 'disciple_init_3')
  ];
  // Một đệ tử ban đầu được phong Nội Môn
  initialDisciples[0].rank = 'noi_mon';
  initialDisciples[0].stats.loyalty = 98;

  const newCustomSect: CustomSectState = {
    isFounded: true,
    sectName: cleanSectName,
    mountainName: cleanMountain,
    doctrine,
    reputation: 100,
    sectVault: {
      linhThach: 5000,
      herbs: {
        'Uẩn Thần Thảo': 5,
        'Huyết Tinh Thảo': 10
      },
      ores: {
        'Hắc Thiết Quặng': 10
      },
      lastHarvestTimestamp: Date.now()
    },
    disciples: initialDisciples,
    chosenInheritorId: initialDisciples[0].id, // Mặc định chỉ định đệ tử ưu tú đầu tiên
    lastRecruitmentTimestamp: Date.now(),
    facilities: {
      mainHallLevel: 1,
      herbGardenFacilityLevel: 1,
      mineralVeinFacilityLevel: 1,
      guardianArrayLevel: 1
    }
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: player.linhThach - COST_LINH_THACH,
    customSectState: newCustomSect
  };

  return {
    success: true,
    updatedPlayer,
    message: `Chúc mừng đạo hữu đã chính thức khai sơn lập phái 【${cleanSectName}】 tại đỉnh 【${cleanMountain}】! Tôn chỉ: ${SECT_DOCTRINES_CONFIG[doctrine].name}. Tam giới vạn linh cùng chúc mừng!`
  };
}

/**
 * Tính toán sản lượng tài nguyên trong Khố Phòng Tông Môn theo thời gian
 */
export function calculateSectVaultYield(
  sectState: CustomSectState,
  currentTimestamp: number = Date.now(),
  player?: PlayerStats
): {
  linhThachGained: number;
  herbsGained: Record<string, number>;
  oresGained: Record<string, number>;
  elapsedHours: number;
} {
  if (!sectState.isFounded) {
    return { linhThachGained: 0, herbsGained: {}, oresGained: {}, elapsedHours: 0 };
  }

  const lastHarvest = sectState.sectVault.lastHarvestTimestamp || currentTimestamp;
  const elapsedMs = Math.max(0, currentTimestamp - lastHarvest);
  // Kẹp biên tối đa 48 giờ tích lũy
  const elapsedHours = Math.min(48, elapsedMs / (3600 * 1000));

  if (elapsedHours < 0.05) {
    return { linhThachGained: 0, herbsGained: {}, oresGained: {}, elapsedHours: 0 };
  }

  const { facilities, doctrine, disciples } = sectState;
  const doctrineCfg = SECT_DOCTRINES_CONFIG[doctrine];

  // Hệ số Chấp Sự Khố Phòng (Sect Treasury Deacon Bonus)
  let deaconEfficiencyBonus = 0;
  const deaconId = sectState.sectVault.deaconDiscipleId;
  if (deaconId) {
    const deacon =
      disciples.find(d => d.id === deaconId) ||
      player?.offspringState?.children?.find(c => c.id === deaconId);
    if (deacon?.appointmentData?.specialtyBonus?.treasuryEfficiency) {
      deaconEfficiencyBonus = deacon.appointmentData.specialtyBonus.treasuryEfficiency;
    }
  }

  // Đệ tử làm nhiệm vụ
  const herbDisciples = disciples.filter(d => d.currentTask === 'tend_garden');
  const mineDisciples = disciples.filter(d => d.currentTask === 'mine_ores');

  // 1. Dược Viên: Sản lượng thảo dược
  const herbCfg = FACILITY_UPGRADE_CONFIG.herbGarden[Math.min(FACILITY_UPGRADE_CONFIG.herbGarden.length - 1, (facilities.herbGardenFacilityLevel || 1) - 1)];
  const baseHerbRatePerHour = herbCfg.hourlyYield || 3;
  let herbYieldMultiplier = (1 + ((doctrineCfg.bonuses.herbYieldPercent || 0) / 100)) * (1 + deaconEfficiencyBonus);

  let herbEfficiency = 0;
  herbDisciples.forEach(d => {
    let dEff = 1 + (d.stats.canCot / 100);
    if (d.personalityTrait?.id === 'can_cu') dEff += 0.2;
    if (d.personalityTrait?.id === 'dan_si') dEff += 0.3;
    herbEfficiency += dEff;
  });

  const totalHerbsCount = Math.floor(elapsedHours * baseHerbRatePerHour * (1 + herbEfficiency * 0.4) * herbYieldMultiplier);
  const herbsGained: Record<string, number> = {};
  if (totalHerbsCount > 0) {
    const herbCatalog = ['Huyết Tinh Thảo', 'Uẩn Thần Thảo', 'Cửu Diệp Chi Lan', 'Hàn Băng Thảo', 'Long Huyết Chi'];
    herbsGained[herbCatalog[0]] = Math.ceil(totalHerbsCount * 0.45);
    herbsGained[herbCatalog[1]] = Math.ceil(totalHerbsCount * 0.30);
    herbsGained[herbCatalog[2]] = Math.max(1, Math.floor(totalHerbsCount * 0.25));
  }

  // 2. Mỏ Khoáng: Linh thạch & quặng
  const mineCfg = FACILITY_UPGRADE_CONFIG.mineralVein[Math.min(FACILITY_UPGRADE_CONFIG.mineralVein.length - 1, (facilities.mineralVeinFacilityLevel || 1) - 1)];
  const baseLtPerHour = mineCfg.hourlyYield || 150;
  let mineYieldMultiplier = (1 + ((doctrineCfg.bonuses.resourceYieldPercent || 0) / 100)) * (1 + deaconEfficiencyBonus);

  let mineEfficiency = 0;
  mineDisciples.forEach(d => {
    let dEff = 1 + (d.stats.canCot / 100);
    if (d.personalityTrait?.id === 'can_cu') dEff += 0.2;
    if (d.personalityTrait?.id === 'khoang_si') dEff += 0.3;
    mineEfficiency += dEff;
  });

  const linhThachGained = Math.floor(elapsedHours * baseLtPerHour * (1 + mineEfficiency * 0.5) * mineYieldMultiplier);
  const oresCount = Math.floor(elapsedHours * (facilities.mineralVeinFacilityLevel || 1) * (1 + mineEfficiency * 0.3) * mineYieldMultiplier);
  const oresGained: Record<string, number> = {};
  if (oresCount > 0) {
    oresGained['Hắc Thiết Quặng'] = Math.ceil(oresCount * 0.6);
    oresGained['Huyền Thiết Khoáng'] = Math.floor(oresCount * 0.4);
  }

  let totalLinhThachGained = linhThachGained;
  const mergedHerbsGained = { ...herbsGained };

  // 3. Linh Sơn Dã Ngoại chiếm đóng (Wild Spirit Mountains Yield)
  if (sectState.wildSpiritMountains && sectState.wildSpiritMountains.length > 0) {
    const mountainYield = calculateMountainYields(sectState.wildSpiritMountains, elapsedHours * 3600);
    totalLinhThachGained += mountainYield.spiritStonesGained;
    Object.entries(mountainYield.herbsGained).forEach(([name, amount]) => {
      mergedHerbsGained[name] = (mergedHerbsGained[name] || 0) + amount;
    });
  }

  return {
    linhThachGained: totalLinhThachGained,
    herbsGained: mergedHerbsGained,
    oresGained,
    elapsedHours
  };
}

/**
 * Thu hoạch toàn bộ Khố Phòng vào túi của người chơi
 */
export function harvestSectVault(
  player: PlayerStats,
  currentTimestamp: number = Date.now()
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) {
    return { success: false, message: 'Chưa khai sơn lập phái!' };
  }

  const yieldData = calculateSectVaultYield(sectState, currentTimestamp);
  const vault = sectState.sectVault;

  const totalLt = (vault.linhThach || 0) + yieldData.linhThachGained;
  const mergedHerbs = { ...vault.herbs };
  Object.entries(yieldData.herbsGained).forEach(([k, v]) => {
    mergedHerbs[k] = (mergedHerbs[k] || 0) + v;
  });

  const mergedOres = { ...vault.ores };
  Object.entries(yieldData.oresGained).forEach(([k, v]) => {
    mergedOres[k] = (mergedOres[k] || 0) + v;
  });

  const hasAnyResource = totalLt > 0 || Object.keys(mergedHerbs).length > 0 || Object.keys(mergedOres).length > 0;
  if (!hasAnyResource) {
    return { success: false, message: 'Khố Phòng hiện tại đang trống rỗng, chưa có tài nguyên mới để thu hoạch.' };
  }

  // Chuyển tài nguyên vào túi đồ nhân vật
  const updatedInventory = { ...(player.inventory || { herbs: [], ores: [], pills: [], manuals: [], equipments: [], books: [], bags: [] }) };
  const currentHerbs = [...(updatedInventory.herbs || [])];
  const currentOres = [...(updatedInventory.ores || [])];

  // Thêm Herbs
  Object.entries(mergedHerbs).forEach(([name, qty]) => {
    if (qty <= 0) return;
    const existing = currentHerbs.find(h => h.name === name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
    } else {
      const newHerb: Herb = {
        id: `sect_herb_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        grade: 'Nhất Phẩm',
        description: 'Linh thảo quý hiếm do đệ tử tông môn chăm bón cống nộp.',
        price: 50,
        quantity: qty
      };
      currentHerbs.push(newHerb);
    }
  });

  // Thêm Ores
  Object.entries(mergedOres).forEach(([name, qty]) => {
    if (qty <= 0) return;
    const existing = currentOres.find(o => o.name === name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
    } else {
      const newOre: Ore = {
        id: `sect_ore_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        grade: 'Nhất Phẩm',
        description: 'Khoáng thạch do đệ tử môn phái khai quật từ linh mạch.',
        price: 80,
        quantity: qty
      };
      currentOres.push(newOre);
    }
  });

  updatedInventory.herbs = currentHerbs;
  updatedInventory.ores = currentOres;

  const updatedSectState: CustomSectState = {
    ...sectState,
    sectVault: {
      linhThach: 0,
      herbs: {},
      ores: {},
      lastHarvestTimestamp: currentTimestamp
    }
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) + totalLt,
    inventory: updatedInventory,
    customSectState: updatedSectState
  };

  return {
    success: true,
    updatedPlayer,
    message: `Thu hoạch thành công Khố Phòng Tông Môn! Nhận được: +${totalLt.toLocaleString()} Linh Thạch, ${Object.values(mergedHerbs).reduce((a, b) => a + b, 0)} Thảo Dược, ${Object.values(mergedOres).reduce((a, b) => a + b, 0)} Quáng Thạch!`
  };
}

/**
 * Chiêu mộ đệ tử mới vào môn phái
 */
export function recruitCandidate(
  player: PlayerStats,
  candidate: ProceduralDisciple
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) {
    return { success: false, message: 'Chưa lập môn phái!' };
  }

  const mainHallLvl = sectState.facilities.mainHallLevel || 1;
  const maxCap = FACILITY_UPGRADE_CONFIG.mainHall[Math.min(FACILITY_UPGRADE_CONFIG.mainHall.length - 1, mainHallLvl - 1)]?.capacity || 6;

  if (sectState.disciples.length >= maxCap) {
    return {
      success: false,
      message: `Đại Điện hiện tại (Cấp ${mainHallLvl}) đã chật kín chỗ (${sectState.disciples.length}/${maxCap} đệ tử)! Hãy nâng cấp Chính Điện để thu nhận thêm môn hạ.`
    };
  }

  const updatedDisciples = [...sectState.disciples, candidate];
  const updatedSectState: CustomSectState = {
    ...sectState,
    disciples: updatedDisciples,
    reputation: (sectState.reputation || 0) + 5,
    lastRecruitmentTimestamp: Date.now()
  };

  return {
    success: true,
    updatedPlayer: { ...player, customSectState: updatedSectState },
    message: `Đã thu nhận 【${candidate.name}】 (${candidate.linhCan.name}) bái nhập Ngoại Môn!`
  };
}

/**
 * Thăng cấp đệ tử (Ngoại Môn -> Nội Môn -> Chân Truyền -> Trưởng Lão)
 */
export function promoteDisciple(
  player: PlayerStats,
  discipleId: string,
  newRank: DiscipleRank
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) return { success: false, message: 'Chưa lập phái!' };

  const target = sectState.disciples.find(d => d.id === discipleId);
  if (!target) return { success: false, message: 'Không tìm thấy đệ tử!' };

  const rankTitles: Record<DiscipleRank, string> = {
    ngoai_mon: 'Ngoại Môn',
    noi_mon: 'Nội Môn',
    chan_truyen: 'Chân Truyền',
    truong_lao: 'Trưởng Lão Chấp Sự'
  };

  const updatedDisciples = sectState.disciples.map(d => {
    if (d.id === discipleId) {
      return {
        ...d,
        rank: newRank,
        stats: {
          ...d.stats,
          loyalty: Math.min(100, (d.stats.loyalty || 70) + 20)
        }
      };
    }
    return d;
  });

  return {
    success: true,
    updatedPlayer: {
      ...player,
      customSectState: { ...sectState, disciples: updatedDisciples }
    },
    message: `Đã sắc phong 【${target.name}】 tấn thăng chức vị [${rankTitles[newRank]}]! Độ trung thành tăng vọt.`
  };
}

/**
 * Trục xuất đệ tử
 */
export function dismissDisciple(
  player: PlayerStats,
  discipleId: string
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) return { success: false, message: 'Chưa lập phái!' };

  const target = sectState.disciples.find(d => d.id === discipleId);
  if (!target) return { success: false, message: 'Không tìm thấy đệ tử!' };

  if (target.isDispatchedToWar) {
    return {
      success: false,
      message: `Đệ tử 【${target.name}】 hiện đang xuất chinh viễn chinh đại chiến, không thể trục xuất!`
    };
  }

  const updatedDisciples = sectState.disciples.filter(d => d.id !== discipleId);
  const updatedInheritorId = sectState.chosenInheritorId === discipleId ? null : sectState.chosenInheritorId;

  return {
    success: true,
    updatedPlayer: {
      ...player,
      customSectState: {
        ...sectState,
        disciples: updatedDisciples,
        chosenInheritorId: updatedInheritorId
      }
    },
    message: `Đã trục xuất 【${target.name}】 ra khỏi sơn môn!`
  };
}

/**
 * Phân công nhiệm vụ cho đệ tử
 */
export function assignDiscipleTask(
  player: PlayerStats,
  discipleId: string,
  taskType: DiscipleTaskType
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) return { success: false, message: 'Chưa lập phái!' };

  const target = sectState.disciples.find(d => d.id === discipleId);
  if (!target) return { success: false, message: 'Không tìm thấy đệ tử!' };

  if (target.isDispatchedToWar) {
    return {
      success: false,
      message: `Đệ tử 【${target.name}】 đang viễn chinh tham gia Tông Môn Đại Chiến, không thể phân công nhiệm vụ khác!`
    };
  }

  const updatedDisciples = sectState.disciples.map(d => {
    if (d.id === discipleId) {
      return {
        ...d,
        currentTask: taskType,
        taskAssignedAt: Date.now(),
        taskDurationHours: taskType === 'explore_realm' ? 4 : undefined
      };
    }
    return d;
  });

  return {
    success: true,
    updatedPlayer: {
      ...player,
      customSectState: { ...sectState, disciples: updatedDisciples }
    },
    message: `Đã chỉ định 【${target.name}】 tiến hành nhiệm vụ mới!`
  };
}

/**
 * Thiết lập Chân Truyền Y Bát kế thừa kiếp sau
 */
export function setChosenInheritor(
  player: PlayerStats,
  discipleId: string
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) return { success: false, message: 'Chưa lập phái!' };

  const target = sectState.disciples.find(d => d.id === discipleId);
  if (!target) return { success: false, message: 'Không tìm thấy đệ tử!' };

  if (target.isDispatchedToWar) {
    return {
      success: false,
      message: `Đệ tử 【${target.name}】 đang viễn chinh tại chiến trường dã ngoại, tạm thời không thể cử hành đại lễ truyền thừa!`
    };
  }

  if (target.stats.loyalty < 70) {
    return {
      success: false,
      message: `Độ trung thành của 【${target.name}】 chưa đủ (${target.stats.loyalty}/100)! Cần đạt tối thiểu 70 lòng trung thành để truyền thừa y bát.`
    };
  }

  // Tự động thăng lên Chân Truyền nếu đang là Ngoại Môn hoặc Nội Môn
  const updatedDisciples = sectState.disciples.map(d => {
    if (d.id === discipleId && (d.rank === 'ngoai_mon' || d.rank === 'noi_mon')) {
      return { ...d, rank: 'chan_truyen' as DiscipleRank, stats: { ...d.stats, loyalty: 100 } };
    }
    return d;
  });

  return {
    success: true,
    updatedPlayer: {
      ...player,
      customSectState: {
        ...sectState,
        disciples: updatedDisciples,
        chosenInheritorId: discipleId
      }
    },
    message: `Đã lập 【${target.name}】 làm Chân Truyền Y Bát! Khi đạo hữu Tọa Hóa hoặc Binh Giải kiếp này, có thể chọn Đoạt Xá thân xác của đệ tử này để tiếp tục nắm quyền Chưởng Môn!`
  };
}

/**
 * Nâng cấp kiến trúc sơn môn
 */
export function upgradeSectFacility(
  player: PlayerStats,
  facilityKey: keyof CustomSectState['facilities']
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) return { success: false, message: 'Chưa lập phái!' };

  const currentLvl = sectState.facilities[facilityKey] || 1;
  const configMap: Record<string, any[]> = {
    mainHallLevel: FACILITY_UPGRADE_CONFIG.mainHall,
    herbGardenFacilityLevel: FACILITY_UPGRADE_CONFIG.herbGarden,
    mineralVeinFacilityLevel: FACILITY_UPGRADE_CONFIG.mineralVein,
    guardianArrayLevel: FACILITY_UPGRADE_CONFIG.guardianArray
  };

  const steps = configMap[facilityKey];
  if (!steps || currentLvl >= steps.length) {
    return { success: false, message: 'Kiến trúc đã đạt cấp độ tối đa!' };
  }

  const nextStep = steps[currentLvl]; // 0-indexed
  if ((player.linhThach || 0) < nextStep.costLinhThach) {
    return {
      success: false,
      message: `Không đủ Linh Thạch! Cần ${nextStep.costLinhThach.toLocaleString()} Linh Thạch để nâng cấp.`
    };
  }

  const updatedFacilities = {
    ...sectState.facilities,
    [facilityKey]: currentLvl + 1
  };

  return {
    success: true,
    updatedPlayer: {
      ...player,
      linhThach: player.linhThach - nextStep.costLinhThach,
      customSectState: {
        ...sectState,
        facilities: updatedFacilities
      }
    },
    message: `Nâng cấp thành công 【${nextStep.name}】 lên Cấp ${currentLvl + 1}! ${nextStep.effectDescription}.`
  };
}

/**
 * Chưởng Môn truyền thụ tu vi bồi dưỡng đệ tử đột phá
 */
export function trainDiscipleWithTuVi(
  player: PlayerStats,
  discipleId: string,
  tuViAmount: number = 50000
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const sectState = player.customSectState;
  if (!sectState || !sectState.isFounded) return { success: false, message: 'Chưa lập phái!' };

  if ((player.tuVi || 0) < tuViAmount) {
    return {
      success: false,
      message: `Tu vi bản thân không đủ! Cần tối thiểu ${tuViAmount.toLocaleString()} Tu Vi để truyền thụ chỉ điểm.`
    };
  }

  const target = sectState.disciples.find(d => d.id === discipleId);
  if (!target) return { success: false, message: 'Không tìm thấy đệ tử!' };

  // Đột phá cảnh giới đệ tử
  const nextRealmIdx = target.realmIndex + 1;
  const nextRealm = realmsData[nextRealmIdx];
  const nextRealmName = nextRealm ? nextRealm.name : `Cảnh Giới ${nextRealmIdx}`;

  const updatedDisciples = sectState.disciples.map(d => {
    if (d.id === discipleId) {
      return {
        ...d,
        realmIndex: nextRealmIdx,
        realmName: nextRealmName,
        stats: {
          ...d.stats,
          loyalty: Math.min(100, (d.stats.loyalty || 70) + 10),
          combatPower: Math.floor(d.stats.combatPower * 1.35)
        }
      };
    }
    return d;
  });

  return {
    success: true,
    updatedPlayer: {
      ...player,
      tuVi: player.tuVi - tuViAmount,
      customSectState: {
        ...sectState,
        disciples: updatedDisciples
      }
    },
    message: `Truyền thụ thành công ${tuViAmount.toLocaleString()} Tu Vi! Đệ tử 【${target.name}】 đột phá thành công bước vào [${nextRealmName}]!`
  };
}
