// lib/sect-war-logic.ts
// Pure Business Logic Engine cho Phân Hệ "Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại"
// (Sect Wars & Wild Territory Conquest Engine)

import {
  WildSpiritMountain,
  RivalSectFaction,
  SectWarStageResult,
  SectWarBattleReport,
  SectWarState,
  WarDeclarationValidation,
  TributeVault,
  SectDiplomacyStatus
} from '@/lib/types/sect-war';
import { CustomSectState, ProceduralDisciple } from '@/lib/types/custom-sect';
import { PlayerStats } from '@/lib/types';

// ============================================================================
// HẰNG SỐ CẤU HÌNH ĐẠI CHIẾN (WAR CONSTANTS)
// ============================================================================
export const WAR_MARCH_COST_LINH_THACH = 10_000;
export const MIN_WAR_DISCIPLES = 10;
export const DEFAULT_SECT_MORALE = 75;
export const MIN_LEADER_REALM_INDEX = 26; // Mốc Hóa Thần Sơ Kỳ hoặc Trưởng Lão / Xuất Sư

// ============================================================================
// DANH MỤC THẾ LỰC LÂN BANG BAN ĐẦU (INITIAL RIVAL SECTS)
// ============================================================================
export const INITIAL_RIVAL_SECTS: RivalSectFaction[] = [
  {
    id: 'sect_van_kiem',
    name: 'Vạn Kiếm Tiên Tông',
    sectAlignment: 'orthodox',
    reputation: 8000,
    leaderName: 'Kiếm Vô Nhai',
    leaderTitle: 'Vạn Kiếm Tiên Tôn',
    leaderRealmIndex: 45,
    totalCombatPower: 1_500_000,
    diplomacy: 'neutral',
    occupiedMountains: ['mountain_thien_kiem_phong'],
    crestIcon: '⚔️',
    motto: 'Vạn Kiếm Quy Tông, Trảm Tận Yêu Ma.'
  },
  {
    id: 'sect_huyet_ma',
    name: 'Huyết Ma Giáo',
    sectAlignment: 'demonic',
    reputation: 6500,
    leaderName: 'Huyết Sát Ma Tôn',
    leaderTitle: 'Vô Thượng Ma Chủ',
    leaderRealmIndex: 42,
    totalCombatPower: 1_350_000,
    diplomacy: 'hostile',
    occupiedMountains: ['mountain_huyet_ma_coc', 'mountain_cuc_pham_khoang'],
    crestIcon: '🩸',
    motto: 'Huyết Hải Vô Biên, Duy Ngã Độc Tôn.'
  },
  {
    id: 'sect_thien_co',
    name: 'Thiên Cơ Các',
    sectAlignment: 'neutral',
    reputation: 7200,
    leaderName: 'Thiên Cơ Tử',
    leaderTitle: 'Thiên Số Các Chủ',
    leaderRealmIndex: 40,
    totalCombatPower: 1_200_000,
    diplomacy: 'neutral',
    occupiedMountains: ['mountain_thien_co_dai'],
    crestIcon: '📜',
    motto: 'Suy Diễn Thiên Mệnh, Bất Động Như Sơn.'
  },
  {
    id: 'sect_bach_duoc',
    name: 'Bách Dược Cốc',
    sectAlignment: 'orthodox',
    reputation: 5500,
    leaderName: 'Dược Vương Thần Ông',
    leaderTitle: 'Cửu Phẩm Đan Thánh',
    leaderRealmIndex: 38,
    totalCombatPower: 950_000,
    diplomacy: 'allied',
    occupiedMountains: ['mountain_thai_co_duoc'],
    crestIcon: '🌿',
    motto: 'Y Đạo Tế Thế, Thảo Mộc Đắc Đạo.'
  }
];

// ============================================================================
// DANH MỤC LINH SƠN DÃ NGOẠI BAN ĐẦU (INITIAL SPIRIT MOUNTAINS)
// ============================================================================
export const INITIAL_SPIRIT_MOUNTAINS: WildSpiritMountain[] = [
  {
    id: 'mountain_thai_co_duoc',
    name: 'Thái Cổ Dược Sơn',
    type: 'herb_mountain',
    tier: 4,
    description: 'Thánh địa thảo mộc vạn năm, sản sinh đại lượng dược liệu quý hiếm sinh trưởng từ thiên địa linh nhãn.',
    hexCoord: { q: -1, r: -1 },
    baseOutput: {
      spiritStonesPerDay: 10_000,
      herbsPerDay: [
        { itemId: 'Long Huyết Chi', name: 'Long Huyết Chi', amount: 15 },
        { itemId: 'Cửu Diệp Chi Lan', name: 'Cửu Diệp Chi Lan', amount: 20 }
      ],
      sectExpPerDay: 500
    },
    controllingSectId: 'sect_bach_duoc',
    defenseArrayHp: 150_000,
    maxDefenseArrayHp: 150_000,
    stationedGarrison: {
      leaderName: 'Đan Vô Nhược',
      discipleCount: 25,
      combatPower: 350_000
    }
  },
  {
    id: 'mountain_cuc_pham_khoang',
    name: 'Cực Phẩm Linh Thạch Mạch',
    type: 'ore_vein',
    tier: 5,
    description: 'Mạch quặng khoáng thạch cực phẩm ngưng tụ linh khí ngút trời, mỗi ngày khai thác vô số linh thạch.',
    hexCoord: { q: 1, r: -2 },
    baseOutput: {
      spiritStonesPerDay: 50_000,
      sectExpPerDay: 800
    },
    controllingSectId: 'sect_huyet_ma',
    defenseArrayHp: 220_000,
    maxDefenseArrayHp: 220_000,
    stationedGarrison: {
      leaderName: 'Huyết Dạ Xoa',
      discipleCount: 35,
      combatPower: 500_000
    }
  },
  {
    id: 'mountain_thien_dia_tuyen',
    name: 'Thiên Địa Linh Tuyền',
    type: 'spirit_spring',
    tier: 6,
    description: 'Suối nguồn linh khí sơ khai từ lòng đất, tăng tốc độ bế quan và đột phá tu vi cho toàn thể đệ tử.',
    hexCoord: { q: 0, r: 0 },
    baseOutput: {
      spiritStonesPerDay: 30_000,
      sectExpPerDay: 2_000
    },
    controllingSectId: 'neutral',
    defenseArrayHp: 180_000,
    maxDefenseArrayHp: 180_000,
    stationedGarrison: {
      leaderName: 'Dã Thú Chi Vương',
      discipleCount: 20,
      combatPower: 300_000
    }
  },
  {
    id: 'mountain_thien_kiem_phong',
    name: 'Thiên Kiếm Phong',
    type: 'ancient_monolith',
    tier: 7,
    description: 'Đỉnh núi dựng đứng như cự kiếm thông thiên, ngưng tụ sát phạt kiếm ý rèn luyện chiến tâm cho đệ tử.',
    hexCoord: { q: 2, r: -1 },
    baseOutput: {
      spiritStonesPerDay: 40_000,
      sectExpPerDay: 1_500
    },
    controllingSectId: 'sect_van_kiem',
    defenseArrayHp: 300_000,
    maxDefenseArrayHp: 300_000,
    stationedGarrison: {
      leaderName: 'Bạch Kiếm Tiên',
      discipleCount: 40,
      combatPower: 650_000
    }
  },
  {
    id: 'mountain_huyet_ma_coc',
    name: 'Huyết Ma Cốc',
    type: 'herb_mountain',
    tier: 5,
    description: 'Thung lũng ngập tràn huyết vụ quanh năm, nơi hội tụ dị thảo cực kỳ nguy hiểm nhưng dược tính kinh người.',
    hexCoord: { q: -2, r: 1 },
    baseOutput: {
      spiritStonesPerDay: 20_000,
      herbsPerDay: [
        { itemId: 'Huyết Tinh Thảo', name: 'Huyết Tinh Thảo', amount: 35 }
      ],
      sectExpPerDay: 700
    },
    controllingSectId: 'sect_huyet_ma',
    defenseArrayHp: 200_000,
    maxDefenseArrayHp: 200_000,
    stationedGarrison: {
      leaderName: 'Xích Luyện Ma Nữ',
      discipleCount: 30,
      combatPower: 450_000
    }
  },
  {
    id: 'mountain_thien_co_dai',
    name: 'Thiên Cơ Đài',
    type: 'ancient_monolith',
    tier: 5,
    description: 'Cổ đài suy diễn thiên cơ bát quái, trấn yểm long mạch linh khí gia trì vận thế môn phái.',
    hexCoord: { q: -1, r: 2 },
    baseOutput: {
      spiritStonesPerDay: 35_000,
      sectExpPerDay: 1_200
    },
    controllingSectId: 'sect_thien_co',
    defenseArrayHp: 250_000,
    maxDefenseArrayHp: 250_000,
    stationedGarrison: {
      leaderName: 'Toán Mệnh Thần Quân',
      discipleCount: 30,
      combatPower: 420_000
    }
  }
];

// ============================================================================
// KHỞI TẠO STATE MẶC ĐỊNH
// ============================================================================
export function createDefaultSectWarState(): SectWarState {
  return {
    wildSpiritMountains: JSON.parse(JSON.stringify(INITIAL_SPIRIT_MOUNTAINS)),
    rivalSects: JSON.parse(JSON.stringify(INITIAL_RIVAL_SECTS)),
    sectWarHistory: [],
    tributeVault: {
      spiritStones: 0,
      herbs: {},
      lastTributeTimestamp: Date.now()
    },
    sectMorale: DEFAULT_SECT_MORALE
  };
}

// ============================================================================
// 1. THẨM ĐỊNH ĐIỀU KIỆN TUYÊN CHIẾN (WAR DECLARATION VALIDATION)
// ============================================================================
export function canDeclareWarOnMountain(
  sectState: CustomSectState,
  mountainId: string,
  leaderDiscipleId: string,
  assignedDiscipleIds: string[],
  playerLinhThach: number,
  rivalSectsOverride?: RivalSectFaction[],
  mountainsOverride?: WildSpiritMountain[]
): WarDeclarationValidation {
  if (!sectState || !sectState.isFounded) {
    return {
      allowed: false,
      reason: 'Chưa khai tông lập phái! Phải lập phái trước khi khai chiến.'
    };
  }

  // 1. Kiểm tra cấp bậc sơn môn (yêu cầu Đại Điện cấp 2 hoặc danh vọng tối thiểu 100)
  const mainHallLevel = sectState.facilities?.mainHallLevel || 1;
  const reputation = sectState.reputation || 0;
  if (mainHallLevel < 2 && reputation < 100) {
    return {
      allowed: false,
      reason: 'Thực lực môn phái còn non yếu! Yêu cầu Chính Điện Cấp 2 hoặc Danh Vọng đạt 100 để tuyên chiến dã ngoại.'
    };
  }

  // 2. Tìm cứ điểm Linh Sơn
  const mountains = mountainsOverride || sectState.wildSpiritMountains || INITIAL_SPIRIT_MOUNTAINS;
  const mountain = mountains.find(m => m.id === mountainId);
  if (!mountain) {
    return {
      allowed: false,
      reason: 'Không tìm thấy cứ điểm Linh Sơn mục tiêu trên sa bàn dã ngoại.'
    };
  }

  if (mountain.controllingSectId === 'player_sect') {
    return {
      allowed: false,
      reason: 'Cứ điểm Linh Sơn này đã nằm trong tầm kiểm soát của bổn môn!'
    };
  }

  // 3. Kiểm tra quan hệ ngoại giao nếu thuộc môn phái AI
  const rivalSects = rivalSectsOverride || sectState.rivalSects || INITIAL_RIVAL_SECTS;
  const rivalSect = rivalSects.find(r => r.id === mountain.controllingSectId);
  if (rivalSect && rivalSect.diplomacy === 'allied') {
    return {
      allowed: false,
      reason: `【${rivalSect.name}】 hiện là đồng minh hữu hảo của bổn môn! Cần hủy minh ước trước khi động binh.`
    };
  }

  // 4. Kiểm tra Lộ Phí Hành Quân (Lương thảo & Truyền tống trận)
  const vaultLinhThach = sectState.sectVault?.linhThach || 0;
  const totalLinhThachAvailable = playerLinhThach + vaultLinhThach;
  if (totalLinhThachAvailable < WAR_MARCH_COST_LINH_THACH) {
    return {
      allowed: false,
      reason: `Khố phòng và túi trữ vật không đủ ${WAR_MARCH_COST_LINH_THACH.toLocaleString()} Linh Thạch lộ phí hành quân!`,
      marchCost: WAR_MARCH_COST_LINH_THACH
    };
  }

  // 5. Kiểm tra Tướng Lĩnh Thống Soái (Leader Disciple)
  if (!leaderDiscipleId) {
    return {
      allowed: false,
      reason: 'Quân đoàn xuất chinh bắt buộc phải cử 1 Trưởng Lão hoặc Đệ Tử/Tiên Đồng xuất sư làm Thống Soái!'
    };
  }

  const leader = sectState.disciples.find(d => d.id === leaderDiscipleId);
  if (!leader) {
    return {
      allowed: false,
      reason: 'Không tìm thấy đệ tử được chỉ định làm Thống Soái trong danh bạ môn phái.'
    };
  }

  // Kiểm tra cờ khóa viễn chinh của thống soái
  if (leader.isDispatchedToWar) {
    return {
      allowed: false,
      reason: `Thống soái 【${leader.name}】 hiện đang viễn chinh tại chiến trường khác, không thể phân thân!`
    };
  }

  // Tiêu chuẩn thống soái: Trưởng lão HOẶC Đã xuất sư HOẶC Cảnh giới >= Hóa Thần Sơ Kỳ (realmIndex >= 26)
  const isElder = leader.rank === 'truong_lao';
  const isGraduated = Boolean(leader.appointmentData?.isGraduated);
  const isHighRealm = (leader.realmIndex || 0) >= MIN_LEADER_REALM_INDEX;

  if (!isElder && !isGraduated && !isHighRealm) {
    return {
      allowed: false,
      reason: `【${leader.name}】 chưa đủ tư cách Thống Soái! Cần đạt chức vị Trưởng Lão, đã cử hành Đại Lễ Xuất Sư hoặc tu vi đạt Hóa Thần Kỳ.`
    };
  }

  // 6. Kiểm tra số lượng đệ tử tham chiến (Tối thiểu 10 đệ tử)
  const uniqueAssignedIds = Array.from(new Set(assignedDiscipleIds));
  // Nếu thống soái chưa nằm trong danh sách quân đoàn thì cộng vào
  const totalTroopsCount = uniqueAssignedIds.includes(leaderDiscipleId)
    ? uniqueAssignedIds.length
    : uniqueAssignedIds.length + 1;

  if (totalTroopsCount < MIN_WAR_DISCIPLES) {
    return {
      allowed: false,
      reason: `Quân đoàn viễn chinh cần tối thiểu ${MIN_WAR_DISCIPLES} đệ tử xuất chiến (hiện chỉ có ${totalTroopsCount}).`,
      participatingDisciplesCount: totalTroopsCount
    };
  }

  // Kiểm tra từng đệ tử trong quân đoàn có bị khóa không
  for (const discId of uniqueAssignedIds) {
    const disciple = sectState.disciples.find(d => d.id === discId);
    if (!disciple) {
      return {
        allowed: false,
        reason: `Một số đệ tử trong danh sách xuất chiến không tồn tại!`
      };
    }
    if (disciple.isDispatchedToWar && discId !== leaderDiscipleId) {
      return {
        allowed: false,
        reason: `Đệ tử 【${disciple.name}】 hiện đang bị khóa viễn chinh!`
      };
    }
  }

  return {
    allowed: true,
    marchCost: WAR_MARCH_COST_LINH_THACH,
    leaderDisciple: leader,
    participatingDisciplesCount: totalTroopsCount
  };
}

// ============================================================================
// 2. MÔ PHỎNG TIẾN TRÌNH CÔNG PHẠT TAM TRỌNG ĐOÁN (THREE-STAGE WAR ENGINE)
// ============================================================================
export interface ResolveWarParams {
  mountain: WildSpiritMountain;
  leaderDisciple: ProceduralDisciple;
  assignedDisciples: ProceduralDisciple[];
  sectMorale: number;
  rivalSect?: RivalSectFaction;
  randomSeed?: number; // Hỗ trợ deterministic testing
}

export function resolveThreeStageSectWar({
  mountain,
  leaderDisciple,
  assignedDisciples,
  sectMorale,
  rivalSect,
  randomSeed
}: ResolveWarParams): {
  battleReport: SectWarBattleReport;
  survivingDisciples: ProceduralDisciple[];
  fallenDisciples: ProceduralDisciple[];
} {
  // Deterministic hoặc ngẫu nhiên
  let seed = randomSeed ?? Math.floor(Math.random() * 1000000);
  const nextRandom = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const stages: SectWarStageResult[] = [];
  const rivalName = rivalSect ? rivalSect.name : 'Dã Lực Trấn Thủ';
  const mountainName = mountain.name;

  // Tổng lực chiến quân đoàn người chơi
  const leaderPower = leaderDisciple.stats?.combatPower || 50_000;
  const armyTroopsPower = assignedDisciples.reduce(
    (sum, d) => sum + (d.stats?.combatPower || 10_000),
    0
  );
  const totalPlayerArmyPower = leaderPower + armyTroopsPower;
  const rivalGarrisonPower = mountain.stationedGarrison?.combatPower || 300_000;
  const rivalGarrisonCount = mountain.stationedGarrison?.discipleCount || 20;

  // --------------------------------------------------------------------------
  // HIỆP 1: CÔNG PHÁ ĐẠI TRẬN HỘ SƠN (SIEGE ARRAY BREACH)
  // --------------------------------------------------------------------------
  // Sức mạnh công trận dựa trên lực chiến + sĩ khí + phẩm chất linh căn / căn cốt
  const moraleRatio = Math.max(0.5, Math.min(1.5, sectMorale / 100));
  const arrayBreachPower = Math.floor(
    (totalPlayerArmyPower * 0.35 + leaderPower * 0.75) * moraleRatio
  );
  const arrayDefense = mountain.defenseArrayHp || 150_000;
  const breachRatio = arrayBreachPower / Math.max(1, arrayDefense);

  // Cơ hội thắng hiệp 1: cần đạt ít nhất 85% sức mạnh hoặc vượt qua kiểm định tỉ lệ (nếu quá yếu < 40% thì thất bại hoàn toàn)
  const rollStage1 = nextRandom();
  const stage1Success = breachRatio >= 0.85 || (breachRatio >= 0.4 && rollStage1 < (breachRatio * 0.8));

  let pDiscStage1Lost = 0;
  let rDiscStage1Lost = 0;

  if (stage1Success) {
    pDiscStage1Lost = Math.floor(nextRandom() * 2); // Mất 0 - 1 đệ tử
    rDiscStage1Lost = Math.max(1, Math.floor(rivalGarrisonCount * 0.15));
    stages.push({
      stage: 'array_breach',
      winner: 'player',
      log: `【Hiệp 1 - Phá Trận】: Thống soái 【${leaderDisciple.name}】 chỉ huy quân đoàn tung ra Phá Trận Thần Lôi, công lực đạt ${arrayBreachPower.toLocaleString()} điểm, oanh tạc vỡ nát Hộ Sơn Cổ Trận của ${mountainName}!`,
      casualties: { playerDisciplesLost: pDiscStage1Lost, rivalDisciplesLost: rDiscStage1Lost }
    });
  } else {
    pDiscStage1Lost = Math.max(1, Math.floor(assignedDisciples.length * 0.08));
    rDiscStage1Lost = 0;
    stages.push({
      stage: 'array_breach',
      winner: 'rival',
      log: `【Hiệp 1 - Phá Trận】: Hộ Sơn Đại Trận của ${mountainName} (Độ bền: ${arrayDefense.toLocaleString()}) phản chấn dữ dội, cản phá đợt xung kích đầu tiên. Quân đoàn bổn môn chịu tổn thất nhẹ!`,
      casualties: { playerDisciplesLost: pDiscStage1Lost, rivalDisciplesLost: rDiscStage1Lost }
    });
  }

  // --------------------------------------------------------------------------
  // HIỆP 2: ĐẤU TƯỚNG LÔI ĐÀI (CHAMPIONS DUEL)
  // --------------------------------------------------------------------------
  // 1v1 giữa Thống Soái và Đại Tướng trấn thủ của Linh Sơn
  const garrisonLeaderName = mountain.stationedGarrison?.leaderName || 'Trấn Sơn Trưởng Lão';
  const leaderRealm = leaderDisciple.realmIndex || 26;
  const garrisonLeaderRealm = rivalSect ? Math.max(25, rivalSect.leaderRealmIndex - 5) : 28;

  // Điểm đối kháng tướng lĩnh
  const leaderDuelScore =
    leaderPower +
    (leaderDisciple.stats?.canCot || 50) * 1000 +
    (leaderDisciple.stats?.khiVan || 50) * 800 +
    leaderRealm * 5000;

  const rivalLeaderPower = Math.floor(rivalGarrisonPower * 0.45);
  const rivalDuelScore = rivalLeaderPower + garrisonLeaderRealm * 5500;

  const duelRatio = leaderDuelScore / Math.max(1, rivalDuelScore);
  const rollStage2 = nextRandom();
  const stage2Success = duelRatio >= 1.05 || (duelRatio >= 0.5 && rollStage2 < (duelRatio * 0.65));

  if (stage2Success) {
    stages.push({
      stage: 'champion_duel',
      winner: 'player',
      log: `【Hiệp 2 - Đấu Tướng】: Thống soái 【${leaderDisciple.name}】 rút bảo kiếm thi triển tuyệt kỹ kinh thiên, trảm lui đại tướng địch 【${garrisonLeaderName}】 sau 30 hiệp kịch chiến! Sĩ khí toàn quân tăng vọt!`,
      casualties: { playerDisciplesLost: 0, rivalDisciplesLost: 1 }
    });
  } else {
    stages.push({
      stage: 'champion_duel',
      winner: 'rival',
      log: `【Hiệp 2 - Đấu Tướng】: Đại tướng địch 【${garrisonLeaderName}】 hung hãn phản kích, Thống soái 【${leaderDisciple.name}】 thế công bị kiềm tỏa, phải lui về chỉnh đốn trận hình!`,
      casualties: { playerDisciplesLost: 0, rivalDisciplesLost: 0 }
    });
  }

  // --------------------------------------------------------------------------
  // HIỆP 3: QUÂN ĐOÀN HỖN CHIẾN (LEGION CLASH)
  // --------------------------------------------------------------------------
  // Buff / Debuff dựa trên kết quả 2 hiệp đầu
  let playerClashModifier = 1.0;
  if (stage1Success) playerClashModifier += 0.25;
  else playerClashModifier -= 0.15;

  if (stage2Success) playerClashModifier += 0.35;
  else playerClashModifier -= 0.20;

  playerClashModifier *= moraleRatio;

  const playerFinalPower = Math.floor(totalPlayerArmyPower * playerClashModifier);
  const rivalFinalPower = Math.floor(rivalGarrisonPower * 0.95);

  const clashRatio = playerFinalPower / Math.max(1, rivalFinalPower);
  const rollStage3 = nextRandom();
  const stage3Success = clashRatio >= 1.0 || (clashRatio >= 0.45 && rollStage3 < (clashRatio * 0.7));

  let pDiscStage3Lost = 0;
  let rDiscStage3Lost = 0;

  if (stage3Success) {
    pDiscStage3Lost = Math.max(0, Math.floor(assignedDisciples.length * (0.05 + nextRandom() * 0.08)));
    rDiscStage3Lost = Math.max(5, Math.floor(rivalGarrisonCount * 0.7));
    stages.push({
      stage: 'legion_clash',
      winner: 'player',
      log: `【Hiệp 3 - Hỗn Chiến】: Toàn thể đệ tử thừa thắng xông lên, trận đồ vạn kiếm tề phát nghiền nát quân phòng thủ ${rivalName}! Địch quân tan tác tháo lui!`,
      casualties: { playerDisciplesLost: pDiscStage3Lost, rivalDisciplesLost: rDiscStage3Lost }
    });
  } else {
    pDiscStage3Lost = Math.max(1, Math.floor(assignedDisciples.length * (0.15 + nextRandom() * 0.12)));
    rDiscStage3Lost = Math.max(1, Math.floor(rivalGarrisonCount * 0.2));
    stages.push({
      stage: 'legion_clash',
      winner: 'rival',
      log: `【Hiệp 3 - Hỗn Chiến】: Quân phòng thủ của ${rivalName} liều chết tử thủ trận địa hiểm trở, quân đoàn công phạt của bổn môn gặp nhiều trắc trở, đành phải thu binh hồi tông!`,
      casualties: { playerDisciplesLost: pDiscStage3Lost, rivalDisciplesLost: rDiscStage3Lost }
    });
  }

  // --------------------------------------------------------------------------
  // KẾT QUẢ CHUNG CUỘC & CHIẾN LỢI PHẨM (OVERALL RESULT & SPOILS)
  // --------------------------------------------------------------------------
  const playerWinsCount = stages.filter(s => s.winner === 'player').length;
  const overallWinner: 'player' | 'rival' = playerWinsCount >= 2 ? 'player' : 'rival';

  const totalPlayerLostCount = pDiscStage1Lost + pDiscStage3Lost;
  // Chọn ngẫu nhiên đệ tử thương vong (ưu tiên ngoại môn/nội môn, không sát hại thống soái trừ phi cả đội bị diệt sạch)
  const nonLeaderDisciples = assignedDisciples.filter(d => d.id !== leaderDisciple.id);
  const actualFallenCount = Math.min(totalPlayerLostCount, nonLeaderDisciples.length);

  // Shuffle nhẹ nonLeaderDisciples để lấy fallen
  const shuffledNonLeaders = [...nonLeaderDisciples].sort(() => nextRandom() - 0.5);
  const fallenDisciples = shuffledNonLeaders.slice(0, actualFallenCount);
  const fallenIds = new Set(fallenDisciples.map(d => d.id));
  const survivingDisciples = assignedDisciples.filter(d => !fallenIds.has(d.id));

  // Chiến lợi phẩm
  let capturedResources = {
    spiritStones: 0,
    rareItems: [] as string[]
  };
  let reputationDelta = 0;
  let moraleDelta = 0;

  if (overallWinner === 'player') {
    reputationDelta = 150 * mountain.tier;
    moraleDelta = 15;
    capturedResources.spiritStones = 10_000 * mountain.tier;
    if (mountain.baseOutput.herbsPerDay && mountain.baseOutput.herbsPerDay.length > 0) {
      capturedResources.rareItems = mountain.baseOutput.herbsPerDay.map(h => `${h.name} x${h.amount * 2}`);
    } else {
      capturedResources.rareItems = [`Linh Khoáng Thạch Cực Phẩm x${5 * mountain.tier}`];
    }
  } else {
    reputationDelta = -50;
    moraleDelta = -20;
  }

  const battleReport: SectWarBattleReport = {
    warId: `war_${Date.now()}_${Math.floor(nextRandom() * 1000)}`,
    targetMountainId: mountain.id,
    targetMountainName: mountain.name,
    rivalSectId: mountain.controllingSectId,
    rivalSectName: rivalName,
    stages,
    overallWinner,
    capturedResources,
    reputationDelta,
    moraleDelta,
    playerCasualtiesTotal: actualFallenCount,
    timestamp: Date.now()
  };

  return {
    battleReport,
    survivingDisciples,
    fallenDisciples
  };
}

// ============================================================================
// 3. TÍNH TOÁN SẢN LƯỢNG LINH SƠN DÃ NGOẠI & NGOẠI TUYẾN (MOUNTAIN YIELDS)
// ============================================================================
export interface MountainYieldResult {
  spiritStonesGained: number;
  herbsGained: Record<string, number>;
  sectExpGained: number;
  controlledMountainsCount: number;
}

export function calculateMountainYields(
  mountains: WildSpiritMountain[],
  elapsedSeconds: number
): MountainYieldResult {
  if (!mountains || mountains.length === 0 || elapsedSeconds <= 0) {
    return {
      spiritStonesGained: 0,
      herbsGained: {},
      sectExpGained: 0,
      controlledMountainsCount: 0
    };
  }

  // Tối đa tích lũy 48 giờ để tránh lạm phát
  const cappedSeconds = Math.min(48 * 3600, elapsedSeconds);
  const dayRatio = cappedSeconds / 86400;

  let spiritStonesGained = 0;
  let sectExpGained = 0;
  const herbsGained: Record<string, number> = {};
  let controlledCount = 0;

  for (const m of mountains) {
    if (m.controllingSectId === 'player_sect') {
      controlledCount++;
      // Linh thạch
      if (m.baseOutput.spiritStonesPerDay) {
        spiritStonesGained += Math.floor(m.baseOutput.spiritStonesPerDay * dayRatio);
      }
      // Kinh nghiệm môn phái / Danh vọng
      if (m.baseOutput.sectExpPerDay) {
        sectExpGained += Math.floor(m.baseOutput.sectExpPerDay * dayRatio);
      }
      // Dược liệu
      if (m.baseOutput.herbsPerDay && Array.isArray(m.baseOutput.herbsPerDay)) {
        for (const herb of m.baseOutput.herbsPerDay) {
          const amount = Math.floor(herb.amount * dayRatio);
          if (amount > 0) {
            herbsGained[herb.name] = (herbsGained[herb.name] || 0) + amount;
          }
        }
      }
    }
  }

  return {
    spiritStonesGained,
    herbsGained,
    sectExpGained,
    controlledMountainsCount: controlledCount
  };
}

// ============================================================================
// 4. BỔ NHIỆM TRẤN THỦ LINH SƠN (STATION GARRISON)
// ============================================================================
export function stationGarrisonToMountain(
  mountainId: string,
  leaderDiscipleId: string,
  sectState: CustomSectState
): { success: boolean; message: string; updatedMountain?: WildSpiritMountain; updatedDisciples?: ProceduralDisciple[] } {
  if (!sectState || !sectState.isFounded) {
    return { success: false, message: 'Chưa khai tông lập phái!' };
  }

  const mountains = sectState.wildSpiritMountains || INITIAL_SPIRIT_MOUNTAINS;
  const mountain = mountains.find(m => m.id === mountainId);
  if (!mountain) {
    return { success: false, message: 'Không tìm thấy Linh Sơn!' };
  }

  if (mountain.controllingSectId !== 'player_sect') {
    return { success: false, message: 'Chưa chiếm lĩnh Linh Sơn này, không thể phái người trấn thủ!' };
  }

  const leader = sectState.disciples.find(d => d.id === leaderDiscipleId);
  if (!leader) {
    return { success: false, message: 'Không tìm thấy đệ tử chỉ định!' };
  }

  if (leader.isDispatchedToWar && mountain.stationedGarrison?.leaderDiscipleId !== leader.id) {
    return { success: false, message: `【${leader.name}】 hiện đang bận viễn chinh hoặc trấn thủ nơi khác!` };
  }

  const updatedMountain: WildSpiritMountain = {
    ...mountain,
    stationedGarrison: {
      leaderDiscipleId: leader.id,
      leaderName: leader.name,
      discipleCount: 15,
      combatPower: (leader.stats?.combatPower || 50_000) * 1.5
    }
  };

  const updatedDisciples = sectState.disciples.map(d => {
    if (d.id === leader.id) {
      return {
        ...d,
        isDispatchedToWar: true
      };
    }
    return d;
  });

  return {
    success: true,
    message: `Đã bổ nhiệm 【${leader.name}】 làm Trấn Sơn Trưởng Lão tại 【${mountain.name}】!`,
    updatedMountain,
    updatedDisciples
  };
}

// ============================================================================
// 5. NGOẠI GIAO THẾ LỰC (NEGOTIATE DIPLOMACY)
// ============================================================================
export function negotiateDiplomacy(
  rivalSects: RivalSectFaction[],
  targetSectId: string,
  action: 'truce' | 'bribe' | 'alliance' | 'declare_war',
  playerLinhThach: number,
  sectReputation: number
): {
  success: boolean;
  message: string;
  updatedRivalSects?: RivalSectFaction[];
  linhThachCost?: number;
  reputationDelta?: number;
} {
  const target = rivalSects.find(r => r.id === targetSectId);
  if (!target) {
    return { success: false, message: 'Không tìm thấy thế lực lân bang!' };
  }

  let cost = 0;
  let repDelta = 0;
  let newStatus: SectDiplomacyStatus = target.diplomacy;

  switch (action) {
    case 'bribe': {
      cost = 50_000;
      if (playerLinhThach < cost) {
        return { success: false, message: `Cần tối thiểu ${cost.toLocaleString()} Linh Thạch để cống nộp quà ngoại giao!` };
      }
      if (target.diplomacy === 'hostile') {
        newStatus = 'neutral';
      } else if (target.diplomacy === 'neutral') {
        newStatus = 'allied';
      }
      repDelta = 50;
      break;
    }
    case 'truce': {
      cost = 20_000;
      if (playerLinhThach < cost) {
        return { success: false, message: `Cần ${cost.toLocaleString()} Linh Thạch để ký kết hiệp ước đình chiến!` };
      }
      newStatus = 'neutral';
      break;
    }
    case 'alliance': {
      if (sectReputation < 500) {
        return { success: false, message: 'Danh vọng Tông Môn chưa đủ 500 điểm để kết bái liên minh đại tông!' };
      }
      cost = 100_000;
      if (playerLinhThach < cost) {
        return { success: false, message: `Cần ${cost.toLocaleString()} Linh Thạch làm sính lễ thành lập Đồng Minh!` };
      }
      newStatus = 'allied';
      repDelta = 100;
      break;
    }
    case 'declare_war': {
      newStatus = 'hostile';
      repDelta = -20;
      break;
    }
  }

  const updatedRivalSects = rivalSects.map(r => {
    if (r.id === targetSectId) {
      return {
        ...r,
        diplomacy: newStatus
      };
    }
    return r;
  });

  const actionText =
    action === 'bribe'
      ? 'Đút lót quà ngoại giao thành công'
      : action === 'truce'
      ? 'Ký kết đình chiến hòa ước'
      : action === 'alliance'
      ? 'Thiết lập Minh Ước Đồng Minh'
      : 'Chính thức tuyên chiến';

  return {
    success: true,
    message: `${actionText} với 【${target.name}】! Trạng thái hiện tại: [${newStatus}].`,
    updatedRivalSects,
    linhThachCost: cost,
    reputationDelta: repDelta
  };
}
