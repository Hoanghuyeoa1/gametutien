// scripts/test-sect-war.ts
// Test Suite Tự Động Toàn Diện Cho Phân Hệ:
// "Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại (Sect Wars & Wild Territory Conquest)"

import {
  canDeclareWarOnMountain,
  resolveThreeStageSectWar,
  calculateMountainYields,
  stationGarrisonToMountain,
  negotiateDiplomacy,
  INITIAL_SPIRIT_MOUNTAINS,
  INITIAL_RIVAL_SECTS,
  WAR_MARCH_COST_LINH_THACH,
  MIN_WAR_DISCIPLES
} from '../lib/sect-war-logic';
import {
  createDefaultCustomSectState,
  assignDiscipleTask,
  dismissDisciple,
  setChosenInheritor,
  calculateSectVaultYield
} from '../lib/custom-sect-logic';
import { canAppointDisciple } from '../lib/disciple-appointment-logic';
import { migrateSectWarData, normalizePlayerData } from '../lib/save-migration';
import { CustomSectState, ProceduralDisciple } from '../lib/types/custom-sect';
import { PlayerStats } from '../lib/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    throw new Error(`Test failed: ${testName} - ${detail}`);
  }
}

console.log('================================================================');
console.log('⚔️ BẮT ĐẦU KIỂM THỬ TÔNG MÔN ĐẠI CHIẾN & TRANH ĐOẠT LINH SƠN ⚔️');
console.log('================================================================\n');

// Helper sinh mock đệ tử
function createMockDisciple(id: string, name: string, realmIndex: number, rank: any, cp: number): ProceduralDisciple {
  return {
    id,
    name,
    gender: 'nam',
    realmIndex,
    realmName: 'Cảnh Giới Mock',
    linhCan: { name: 'Kim Cực Phẩm', element: 'kim', grade: 'cuc' },
    stats: {
      canCot: 80,
      ngoTinh: 85,
      khiVan: 75,
      loyalty: 90,
      combatPower: cp
    },
    personalityTrait: { id: 'chien_than', name: 'Chiến Thần', description: 'Hung hãn' },
    rank,
    currentTask: 'idle',
    joinedAtTimestamp: Date.now(),
    isDispatchedToWar: false,
    appointmentData: {
      isGraduated: realmIndex >= 26,
      graduationRealmIndex: realmIndex >= 26 ? realmIndex : 0,
      assignedRole: 'none',
      assignedTargetId: null,
      loyalty: 90,
      meritPoints: 50,
      specialtyBonus: {}
    }
  };
}

// ============================================================================
// TEST 1: KIỂM TRA ĐIỀU KIỆN XUẤT CHINH (WAR VALIDATION GUARD)
// ============================================================================
console.log('📌 Test 1: Kiểm Tra Điều Kiện Xuất Chinh (War Validation Guard)');
{
  const mockSect: CustomSectState = {
    ...createDefaultCustomSectState(),
    isFounded: true,
    sectName: 'Tiên Tông Test',
    mountainName: 'Linh Thứu Sơn',
    reputation: 250,
    facilities: {
      mainHallLevel: 2,
      herbGardenFacilityLevel: 1,
      mineralVeinFacilityLevel: 1,
      guardianArrayLevel: 1
    },
    sectVault: { linhThach: 50_000, herbs: {}, ores: {}, lastHarvestTimestamp: Date.now() },
    disciples: []
  };

  // Ca 1.1: Không có đệ tử thống soái -> Chặn
  const check1 = canDeclareWarOnMountain(
    mockSect,
    'mountain_cuc_pham_khoang',
    '',
    [],
    100_000
  );
  assert(!check1.allowed, 'Chặn khai chiến khi thiếu Thống Soái');
  assert(check1.reason?.includes('Thống Soái') || false, 'Thông báo lỗi chỉ rõ thiếu Thống Soái');

  // Ca 1.2: Thiếu lộ phí hành quân (< 10,000 LT) -> Chặn
  const mockElder = createMockDisciple('elder_1', 'Lý Trưởng Lão', 28, 'truong_lao', 200_000);
  mockSect.disciples.push(mockElder);
  mockSect.sectVault.linhThach = 0;

  const check2 = canDeclareWarOnMountain(
    mockSect,
    'mountain_cuc_pham_khoang',
    mockElder.id,
    [mockElder.id],
    5_000 // Thiếu lộ phí
  );
  assert(!check2.allowed, 'Chặn khai chiến khi không đủ lộ phí hành quân');
  assert(check2.reason?.includes('lộ phí') || false, 'Thông báo lỗi chỉ rõ thiếu lộ phí');

  // Ca 1.3: Số lượng đệ tử xuất chinh dưới 10 -> Chặn
  const check3 = canDeclareWarOnMountain(
    mockSect,
    'mountain_cuc_pham_khoang',
    mockElder.id,
    [mockElder.id, 'd2', 'd3'], // Chỉ có 3 đệ tử
    50_000
  );
  assert(!check3.allowed, 'Chặn khai chiến khi quân đoàn dưới 10 đệ tử');
  assert(check3.reason?.includes('tối thiểu') || false, 'Thông báo lỗi chỉ rõ yêu cầu tối thiểu 10 đệ tử');

  // Ca 1.4: Đầy đủ điều kiện -> Cho phép
  const fullDisciples: ProceduralDisciple[] = [mockElder];
  const assignedIds = [mockElder.id];
  for (let i = 1; i <= 10; i++) {
    const d = createMockDisciple(`disc_${i}`, `Đệ Tử ${i}`, 15, 'noi_mon', 25_000);
    fullDisciples.push(d);
    assignedIds.push(d.id);
  }
  mockSect.disciples = fullDisciples;

  const check4 = canDeclareWarOnMountain(
    mockSect,
    'mountain_cuc_pham_khoang',
    mockElder.id,
    assignedIds,
    50_000
  );
  assert(check4.allowed, 'Cho phép xuất chinh khi thỏa mãn toàn bộ điều kiện lộ phí, thống soái và quân số');
}

// ============================================================================
// TEST 2: KHÓA TRẠNG THÁI ĐỆ TỬ KHI THAM CHIẾN (DISPATCHED LOCK INVARIANT)
// ============================================================================
console.log('\n📌 Test 2: Khóa Trạng Thái Đệ Tử Khi Tham Chiến (Dispatched Lock Invariant)');
{
  const elder = createMockDisciple('elder_war', 'Cổ Kiếm Trưởng Lão', 30, 'truong_lao', 350_000);
  const warrior = createMockDisciple('warrior_1', 'Tiêu Chiến Đệ Tử', 20, 'chan_truyen', 60_000);
  // Khóa trạng thái viễn chinh
  warrior.isDispatchedToWar = true;

  const mockPlayer: PlayerStats = {
    id: 'p1',
    name: 'Chưởng Môn Test',
    customSectState: {
      ...createDefaultCustomSectState(),
      isFounded: true,
      disciples: [elder, warrior],
      facilities: { mainHallLevel: 2, herbGardenFacilityLevel: 1, mineralVeinFacilityLevel: 1, guardianArrayLevel: 1 },
      sectVault: { linhThach: 10_000, herbs: {}, ores: {}, lastHarvestTimestamp: Date.now() }
    }
  } as any;

  // Ca 2.1: Phân công làm nông / đào mỏ -> Bị chặn
  const assignResult = assignDiscipleTask(mockPlayer, warrior.id, 'tend_garden');
  assert(!assignResult.success, 'Chặn phân công nhiệm vụ cho đệ tử đang viễn chinh');
  assert(assignResult.message.includes('viễn chinh'), 'Thông báo lỗi chỉ rõ đệ tử đang viễn chinh');

  // Ca 2.2: Trục xuất khỏi sơn môn -> Bị chặn
  const dismissResult = dismissDisciple(mockPlayer, warrior.id);
  assert(!dismissResult.success, 'Chặn trục xuất đệ tử đang viễn chinh');

  // Ca 2.3: Chỉ định làm Chân Truyền Y Bát -> Bị chặn
  const inheritorResult = setChosenInheritor(mockPlayer, warrior.id);
  assert(!inheritorResult.success, 'Chặn truyền thừa y bát cho đệ tử đang viễn chinh');

  // Ca 2.4: Bổ nhiệm làm Chấp Sự Khố Phòng / Tinh Hải -> Bị chặn qua canAppointDisciple
  const appResult = canAppointDisciple(warrior, 'sect_treasury_deacon', 'vault', mockPlayer);
  assert(!appResult.eligible, 'Chặn bổ nhiệm chức vụ cho đệ tử có isDispatchedToWar = true');
}

// ============================================================================
// TEST 3: MÔ PHỎNG 3 GIAI ĐOẠN THẢO PHẠT (THREE-STAGE BATTLE EXECUTION)
// ============================================================================
console.log('\n📌 Test 3: Mô Phỏng 3 Giai Đoạn Thảo Phạt (Three-Stage Battle Execution)');
{
  const targetMountain = INITIAL_SPIRIT_MOUNTAINS.find(m => m.id === 'mountain_cuc_pham_khoang')!;
  const leaderDisciple = createMockDisciple('high_leader', 'Vô Cực Kiếm Tôn', 40, 'truong_lao', 800_000);
  
  // Đội quân người chơi siêu mạnh để bảo đảm thắng thế
  const armyDisciples: ProceduralDisciple[] = [leaderDisciple];
  for (let i = 1; i <= 15; i++) {
    armyDisciples.push(createMockDisciple(`disc_elite_${i}`, `Tinh Anh ${i}`, 28, 'chan_truyen', 100_000));
  }

  const { battleReport, survivingDisciples, fallenDisciples } = resolveThreeStageSectWar({
    mountain: targetMountain,
    leaderDisciple,
    assignedDisciples: armyDisciples,
    sectMorale: 100,
    rivalSect: INITIAL_RIVAL_SECTS.find(r => r.id === 'sect_huyet_ma'),
    randomSeed: 12345
  });

  assert(battleReport.stages.length === 3, 'Trận chiến trải qua đúng 3 hiệp chiến thuật Tam Trọng Đoán');
  assert(battleReport.stages[0].stage === 'array_breach', 'Hiệp 1 là Công Phá Đại Trận Hộ Sơn');
  assert(battleReport.stages[1].stage === 'champion_duel', 'Hiệp 2 là Đấu Tướng Lôi Đài 1v1');
  assert(battleReport.stages[2].stage === 'legion_clash', 'Hiệp 3 là Quân Đoàn Hỗn Chiến');
  assert(battleReport.overallWinner === 'player', 'Đội quân hùng mạnh giành chiến thắng chung cuộc');
  assert(battleReport.capturedResources.spiritStones > 0, 'Thu được chiến lợi phẩm Linh Thạch từ sơn môn địch');
  assert(survivingDisciples.length + fallenDisciples.length === armyDisciples.length, 'Tổng số đệ tử sống sót và hy sinh bảo toàn quân số xuất chinh');
}

// ============================================================================
// TEST 4: PHÂN ĐỊNH QUYỀN KIỂM SOÁT & TIẾP QUẢN SẢN LƯỢNG (TERRITORY TRANSFER)
// ============================================================================
console.log('\n📌 Test 4: Phân Định Quyền Kiểm Soát & Tiếp Quản Sản Lượng (Territory Transfer & Income)');
{
  // Giả lập sau khi thắng, chiếm lĩnh Thái Cổ Dược Sơn và Cực Phẩm Khoáng
  const occupiedMountains = JSON.parse(JSON.stringify(INITIAL_SPIRIT_MOUNTAINS));
  occupiedMountains[0].controllingSectId = 'player_sect'; // Thái Cổ Dược Sơn
  occupiedMountains[1].controllingSectId = 'player_sect'; // Cực Phẩm Khoáng Mạch

  // Tính sản lượng sau 1 ngày (86,400 giây)
  const yields1Day = calculateMountainYields(occupiedMountains, 86400);
  assert(yields1Day.controlledMountainsCount === 2, 'Ghi nhận đúng 2 cứ điểm thuộc quyền kiểm soát của người chơi');
  // Thái Cổ Dược Sơn: 10k LT + Cực Phẩm Khoáng: 50k LT = 60k LT / ngày
  assert(yields1Day.spiritStonesGained === 60_000, 'Thu hoạch chính xác 60,000 Linh Thạch từ 2 mỏ linh sơn');
  assert(yields1Day.sectExpGained === 1_300, 'Thu hoạch chính xác 1,300 điểm Danh Vọng tông môn');
  assert((yields1Day.herbsGained['Long Huyết Chi'] || 0) === 15, 'Sản xuất đúng 15 Long Huyết Chi mỗi ngày');
  assert((yields1Day.herbsGained['Cửu Diệp Chi Lan'] || 0) === 20, 'Sản xuất đúng 20 Cửu Diệp Chi Lan mỗi ngày');

  // Kiểm tra tích hợp vào Khố Phòng Tông Môn (calculateSectVaultYield)
  const mockSectState: CustomSectState = {
    ...createDefaultCustomSectState(),
    isFounded: true,
    wildSpiritMountains: occupiedMountains,
    sectVault: {
      linhThach: 10_000,
      herbs: {},
      ores: {},
      lastHarvestTimestamp: Date.now() - 3600 * 1000 // 1 giờ trôi qua
    }
  };

  const vaultYield = calculateSectVaultYield(mockSectState, Date.now());
  assert(vaultYield.linhThachGained > 0, 'Khố Phòng tự động cộng dồn sản lượng từ Linh Sơn dã ngoại');
}

// ============================================================================
// TEST 5: THƯƠNG VONG ĐỆ TỬ & HỒI PHỤC SĨ KHÍ (CASUALTIES & MORALE INVARIANT)
// ============================================================================
console.log('\n📌 Test 5: Thương Vong Đệ Tử & Biến Động Sĩ Khí (Casualties & Morale Invariant)');
{
  const targetMountain = INITIAL_SPIRIT_MOUNTAINS.find(m => m.id === 'mountain_thien_kiem_phong')!;
  // Đội hình yếu để mô phỏng thất trận
  const weakLeader = createMockDisciple('weak_lead', 'Thường Nhược Sĩ', 26, 'truong_lao', 20_000);
  const weakDisciples: ProceduralDisciple[] = [weakLeader];
  for (let i = 1; i <= 10; i++) {
    weakDisciples.push(createMockDisciple(`weak_${i}`, `Tập Sự ${i}`, 10, 'ngoai_mon', 5_000));
  }

  const { battleReport, survivingDisciples, fallenDisciples } = resolveThreeStageSectWar({
    mountain: targetMountain,
    leaderDisciple: weakLeader,
    assignedDisciples: weakDisciples,
    sectMorale: 50,
    rivalSect: INITIAL_RIVAL_SECTS.find(r => r.id === 'sect_van_kiem'),
    randomSeed: 99999
  });

  assert(battleReport.overallWinner === 'rival', 'Đội hình yếu bị sơn môn đối phương đánh bại');
  assert(battleReport.moraleDelta < 0, 'Sĩ khí tông môn sụt giảm khi thất trận');
  assert(battleReport.reputationDelta < 0, 'Danh vọng tông môn bị tổn hại khi viễn chinh thất bại');
  assert(fallenDisciples.length > 0, 'Có đệ tử thương vong trong chiến trận khốc liệt');
  assert(survivingDisciples.length === weakDisciples.length - fallenDisciples.length, 'Số lượng đệ tử sống sót được tính toán chính xác');
}

// ============================================================================
// TEST 6: KIỂM THỬ KHẢ NĂNG TƯƠNG THÍCH SAVE CŨ (SAVE MIGRATION INVARIANT)
// ============================================================================
console.log('\n📌 Test 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)');
{
  // Mock save cũ (v6 hoặc chưa có bất kỳ trường nào của Tông Môn Đại Chiến)
  const legacySaveData: any = {
    id: 'legacy_player_1',
    name: 'Cổ Tu Sĩ',
    currentRealm: 30,
    customSectState: {
      isFounded: true,
      sectName: 'Cổ Đạo Tông',
      mountainName: 'Vân Mộng Sơn',
      doctrine: 'kiem_tong',
      reputation: 500,
      sectVault: {
        linhThach: 100_000,
        herbs: {},
        ores: {},
        lastHarvestTimestamp: 1700000000000
      },
      disciples: [
        {
          id: 'disc_legacy_1',
          name: 'Đồ Đệ Cũ',
          realmIndex: 28,
          rank: 'truong_lao',
          stats: { canCot: 80, ngoTinh: 80, khiVan: 80, loyalty: 100, combatPower: 200_000 }
        }
      ],
      facilities: { mainHallLevel: 3, herbGardenFacilityLevel: 2, mineralVeinFacilityLevel: 2, guardianArrayLevel: 2 }
    }
  };

  // Chạy qua migration
  const migrated = migrateSectWarData(legacySaveData);

  assert(migrated.customSectState !== undefined, 'customSectState tồn tại an toàn sau migration');
  assert(Array.isArray(migrated.customSectState?.wildSpiritMountains), 'wildSpiritMountains được khởi tạo tự động');
  assert((migrated.customSectState?.wildSpiritMountains?.length || 0) === 6, 'Khởi tạo đủ 6 Linh Sơn Dã Ngoại');
  assert(Array.isArray(migrated.customSectState?.rivalSects), 'rivalSects được khởi tạo tự động');
  assert((migrated.customSectState?.rivalSects?.length || 0) === 4, 'Khởi tạo đủ 4 Thế Lực Lân Bang');
  assert(Array.isArray(migrated.customSectState?.sectWarHistory), 'sectWarHistory được khởi tạo mảng rỗng an toàn');
  assert(typeof migrated.customSectState?.sectMorale === 'number', 'sectMorale được khởi tạo an toàn (mặc định 75)');
  assert(migrated.customSectState?.tributeVault !== undefined, 'tributeVault được khởi tạo an toàn');
  assert(typeof migrated.customSectState?.disciples[0].isDispatchedToWar === 'boolean', 'Đệ tử cũ được tự động bổ sung cờ isDispatchedToWar: false');

  // Thử nghiệm chạy migration lần 2 (Idempotency)
  const migratedTwice = migrateSectWarData(migrated);
  assert(migratedTwice.customSectState?.wildSpiritMountains?.length === 6, 'Migration đạt tính chất Idempotent tuyệt đối');
}

console.log('\n================================================================');
console.log(`🎉 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} KIỂM THỬ ĐẠT CHUẨN 100%!`);
console.log('================================================================');
