// scripts/test-disciple-appointment.ts
// Test Suite kiểm thử toàn diện phân hệ "Bổ Nhiệm Tiên Đồng Xuất Sư (Disciple Graduation & Dominion Appointment)"

import {
  REALM_INDEX_HOA_THAN,
  canGraduateDisciple,
  graduateDisciple,
  canAppointDisciple,
  appointDiscipleRole,
  recallDiscipleRole,
  calculateAppointmentYield,
  rewardDisciple,
} from '../lib/disciple-appointment-logic';
import { migrateDiscipleAppointmentData } from '../lib/save-migration';
import { calculateCosmicYield } from '../lib/cosmic-map-logic';
import { calculateSectVaultYield } from '../lib/custom-sect-logic';
import type { PlayerStats } from '../lib/types/player';
import type { ImmortalChild } from '../lib/types/offspring';
import type { ProceduralDisciple } from '../lib/types/custom-sect';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    if (details) console.error(`     Chi tiết: ${details}`);
    process.exitCode = 1;
  }
}

console.log('════════════════════════════════════════════════════════════════════');
console.log('📜 KHỞI ĐỘNG TEST SUITE: BỔ NHIỆM TIÊN ĐỒNG XUẤT SƯ');
console.log('════════════════════════════════════════════════════════════════════\n');

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const mockUnderRealmChild: ImmortalChild = {
  id: 'child_under_realm',
  name: 'Tiểu Thanh Phong',
  gender: 'nam',
  motherCompanionId: 'comp_1',
  motherName: 'Lục Tuyết Kỳ',
  birthTimestamp: Date.now() - 1000000,
  stage: 'adult',
  realmIndex: 24, // Nguyên Anh Đỉnh Phong (< 26)
  realmName: 'Nguyên Anh Đỉnh Phong',
  spiritualRoots: {
    type: 'ngu_hanh',
    elementName: 'Hỏa',
    grade: 'thuong',
  },
  innateTalent: {
    name: 'Kiếm Tâm Thông Minh',
    description: 'Tăng sát thương kiếm pháp',
    statModifiers: { atkPercent: 20 },
  },
  growthProgress: 100,
  combatPower: 85000,
  isDeployed: false,
};

const mockInfantChild: ImmortalChild = {
  ...mockUnderRealmChild,
  id: 'child_infant',
  stage: 'infant',
  realmIndex: 26,
  realmName: 'Hóa Thần Sơ Kỳ',
};

const mockMatureChild: ImmortalChild = {
  id: 'child_mature_hoa_than',
  name: 'Lý Tiêu Dao',
  gender: 'nam',
  motherCompanionId: 'comp_1',
  motherName: 'Lục Tuyết Kỳ',
  birthTimestamp: Date.now() - 2000000,
  stage: 'adult',
  realmIndex: 26, // Hóa Thần Sơ Kỳ (>= 26)
  realmName: 'Hóa Thần Sơ Kỳ',
  spiritualRoots: {
    type: 'di_bien',
    elementName: 'Lôi',
    grade: 'cuc',
  },
  innateTalent: {
    name: 'Cửu Thiên Thần Lôi',
    description: 'Thần thông công phá tinh không',
    statModifiers: { atkPercent: 35 },
  },
  growthProgress: 100,
  combatPower: 250000,
  isDeployed: false,
};

const mockTreasuryChild: ImmortalChild = {
  id: 'child_treasury_talent',
  name: 'Thẩm Vạn Tam',
  gender: 'nam',
  motherCompanionId: 'comp_2',
  motherName: 'Bạch Thiển',
  birthTimestamp: Date.now() - 2000000,
  stage: 'adult',
  realmIndex: 28, // Hóa Thần Hậu Kỳ
  realmName: 'Hóa Thần Hậu Kỳ',
  spiritualRoots: {
    type: 'ngu_hanh',
    elementName: 'Thổ',
    grade: 'than',
  },
  innateTalent: {
    name: 'Tụ Bảo Linh Đồng',
    description: 'Tích tụ tài lộc thiên địa',
    statModifiers: { defPercent: 25 },
  },
  growthProgress: 100,
  combatPower: 220000,
  isDeployed: false,
};

function createBasePlayer(): PlayerStats {
  return {
    name: 'Đạo Tổ',
    level: 100,
    tuVi: 1000000,
    maxTuVi: 2000000,
    linhThach: 500000,
    currentRealm: 55,
    maxKhiHuyet: 500000,
    canCot: 80,
    ngoTinh: 80,
    khiVan: 80,
    offspringState: {
      gestation: null,
      children: [mockMatureChild, mockTreasuryChild],
      deployedChildId: null,
      demonicKarma: 10,
    },
    customSectState: {
      isFounded: true,
      sectName: 'Thanh Vân Tiên Tông',
      mountainName: 'Thanh Vân Sơn',
      doctrine: 'chinh_dao',
      reputation: 500,
      sectVault: {
        linhThach: 10000,
        herbs: { 'Huyết Tinh Thảo': 20 },
        ores: { 'Hắc Thiết Quặng': 20 },
        lastHarvestTimestamp: Date.now() - 3600 * 4000, // 4 giờ trước
      },
      disciples: [],
      chosenInheritorId: null,
      lastRecruitmentTimestamp: Date.now(),
      facilities: {
        mainHallLevel: 2,
        herbGardenFacilityLevel: 2,
        mineralVeinFacilityLevel: 2,
        guardianArrayLevel: 2,
      },
    },
    cosmicState: {
      unlocked: true,
      currentNodeId: 'node_thai_vi_entry',
      travelingToNodeId: null,
      travelStartTime: null,
      travelEndTime: null,
      vessel: {
        name: 'Thái Hư Tinh Chu',
        level: 2,
        speedLyPerMin: 2.0,
        hullIntegrity: 100,
        cargoCapacity: 5000,
      },
      occupiedNodeIds: ['node_thai_vi_entry'],
      defeatedGuardianIds: ['node_thai_vi_entry'],
      nodeGuardians: {},
      cargo: {
        honDonThanThiet: 0,
        tienThienDiBao: 0,
        vanCoDeRuyi: 0,
        linhThach: 0,
        lastHarvestTime: Date.now() - 3600 * 4000, // 4 giờ trước
      },
      eventLogs: [],
      totalHonDonHarvested: 0,
      totalBattlesWon: 5,
    },
  } as unknown as PlayerStats;
}

// ─── TEST CASE 1: THẨM ĐỊNH ĐIỀU KIỆN XUẤT SƯ (GRADUATION GATING) ────────────
console.log('--- TEST CASE 1: THẨM ĐỊNH ĐIỀU KIỆN XUẤT SƯ ---');

{
  // 1a. Tiên Đồng dưới Hóa Thần Kỳ (Nguyên Anh đỉnh phong) -> Bị chặn
  const checkUnderRealm = canGraduateDisciple(mockUnderRealmChild);
  assert(
    !checkUnderRealm.eligible && !!checkUnderRealm.reason?.includes('Hóa Thần'),
    '1a. Chặn xuất sư chính xác khi Tiên Đồng dưới Hóa Thần Kỳ',
    checkUnderRealm.reason
  );

  // 1b. Tiên Đồng giai đoạn ấu thơ -> Bị chặn
  const checkInfant = canGraduateDisciple(mockInfantChild);
  assert(
    !checkInfant.eligible && !!checkInfant.reason?.includes('ấu thơ'),
    '1b. Chặn xuất sư khi Tiên Đồng chưa trưởng thành (stage !== adult)',
    checkInfant.reason
  );

  // 1c. Tiên Đồng >= Hóa Thần Kỳ -> Xuất sư thành công
  const checkMature = canGraduateDisciple(mockMatureChild);
  assert(checkMature.eligible, '1c. Đủ điều kiện xuất sư khi Tiên Đồng >= Hóa Thần Kỳ và trưởng thành');

  const graduatedChild = graduateDisciple(mockMatureChild);
  assert(
    graduatedChild.appointmentData?.isGraduated === true &&
      graduatedChild.appointmentData.assignedRole === 'none' &&
      graduatedChild.appointmentData.graduationRealmIndex === 26,
    '1d. Đại Lễ Xuất Sư thành công: isGraduated: true, assignedRole: "none", lưu mốc cảnh giới',
    JSON.stringify(graduatedChild.appointmentData)
  );

  assert(
    (graduatedChild.appointmentData?.specialtyBonus.starHarvestMultiplier || 0) > 0 &&
      (graduatedChild.appointmentData?.specialtyBonus.starDefenseBonus || 0) > 0,
    '1e. Tính toán specialtyBonus thành công dựa trên thiên phú/linh căn Lôi Cực Phẩm',
    JSON.stringify(graduatedChild.appointmentData?.specialtyBonus)
  );
}

// ─── TEST CASE 2: BỔ NHIỆM TRẤN THỦ SĨ TINH HẢI ─────────────────────────────
console.log('\n--- TEST CASE 2: BỔ NHIỆM TRẤN THỦ SĨ TINH HẢI ---');

{
  let player = createBasePlayer();
  const graduatedCombatChild = graduateDisciple(mockMatureChild);
  player.offspringState!.children = [graduatedCombatChild, mockTreasuryChild];

  // Bổ nhiệm vào node_thai_vi_entry Tinh Hải
  const appointResult = appointDiscipleRole(
    player,
    graduatedCombatChild.id,
    'tinh_hai_guardian',
    'node_thai_vi_entry'
  );

  assert(appointResult.success, '2a. Bổ nhiệm Trấn Thủ Sĩ Tinh Hải thành công', appointResult.message);
  player = appointResult.updatedPlayer;

  assert(
    player.cosmicState?.nodeGuardians?.['node_thai_vi_entry'] === graduatedCombatChild.id,
    '2b. CosmicState cập nhật chính xác nodeGuardians[node_thai_vi_entry] = discipleId'
  );

  assert(
    player.cosmicDefenseState?.garrisons?.['node_thai_vi_entry']?.type === 'disciple' &&
      player.cosmicDefenseState.garrisons['node_thai_vi_entry'].entityId === graduatedCombatChild.id,
    '2c. CosmicDefenseState garrison đồng bộ chính xác với Trấn Thủ Sĩ'
  );

  // So sánh sản lượng có Trấn Thủ Sĩ vs không có Trấn Thủ Sĩ
  const baseYieldWithoutGuardian = calculateCosmicYield(
    { ...player.cosmicState!, nodeGuardians: {} },
    Date.now(),
    player
  );
  const yieldWithGuardian = calculateCosmicYield(
    player.cosmicState!,
    Date.now(),
    player
  );

  assert(
    yieldWithGuardian.honDonThanThiet > baseYieldWithoutGuardian.honDonThanThiet ||
      yieldWithGuardian.linhThach > baseYieldWithoutGuardian.linhThach,
    '2d. Sản lượng Tinh Hải tăng chính xác khi có Trấn Thủ Sĩ đương nhiệm',
    `Base: ${baseYieldWithoutGuardian.linhThach}, With Guardian: ${yieldWithGuardian.linhThach}`
  );
}

// ─── TEST CASE 3: BỔ NHIỆM CHẤP SỰ KHỐ PHÒNG TÔNG MÔN ────────────────────────
console.log('\n--- TEST CASE 3: BỔ NHIỆM CHẤP SỰ KHỐ PHÒNG TÔNG MÔN ---');

{
  let player = createBasePlayer();
  const graduatedTreasuryChild = graduateDisciple(mockTreasuryChild);
  player.offspringState!.children = [mockMatureChild, graduatedTreasuryChild];

  const appointResult = appointDiscipleRole(
    player,
    graduatedTreasuryChild.id,
    'sect_treasury_deacon',
    'sect_vault'
  );

  assert(appointResult.success, '3a. Bổ nhiệm Chấp Sự Khố Phòng Tông Môn thành công', appointResult.message);
  player = appointResult.updatedPlayer;

  assert(
    player.customSectState?.sectVault?.deaconDiscipleId === graduatedTreasuryChild.id,
    '3b. CustomSectVault ghi nhận chính xác deaconDiscipleId'
  );

  // So sánh sản lượng Khố Phòng có Chấp Sự vs không có
  const yieldWithoutDeacon = calculateSectVaultYield(
    {
      ...player.customSectState!,
      sectVault: { ...player.customSectState!.sectVault, deaconDiscipleId: undefined },
    },
    Date.now(),
    player
  );
  const yieldWithDeacon = calculateSectVaultYield(
    player.customSectState!,
    Date.now(),
    player
  );

  assert(
    yieldWithDeacon.linhThachGained > yieldWithoutDeacon.linhThachGained,
    '3c. Sản lượng Khố Phòng tăng vọt khi có Chấp Sự đương nhiệm (+treasuryEfficiency)',
    `Without: ${yieldWithoutDeacon.linhThachGained}, With: ${yieldWithDeacon.linhThachGained}`
  );
}

// ─── TEST CASE 4: PHÒNG VỆ ĐƠN NHIỆM & KHÓA TRẠNG THÁI (SINGLE-DUTY) ─────────
console.log('\n--- TEST CASE 4: PHÒNG VỆ ĐƠN NHIỆM & KHÓA TRẠNG THÁI ---');

{
  let player = createBasePlayer();
  const graduatedChild = graduateDisciple(mockMatureChild);
  player.offspringState!.children = [graduatedChild];

  // Bổ nhiệm làm Trấn Thủ Sĩ
  const firstAppoint = appointDiscipleRole(
    player,
    graduatedChild.id,
    'tinh_hai_guardian',
    'node_thai_vi_entry'
  );
  assert(firstAppoint.success, '4a. Bổ nhiệm ban đầu thành công');
  player = firstAppoint.updatedPlayer;

  // Cố gắng bổ nhiệm tiếp làm Chấp Sự Khố Phòng khi chưa bãi nhiệm
  const secondAppoint = appointDiscipleRole(
    player,
    graduatedChild.id,
    'sect_treasury_deacon',
    'sect_vault'
  );
  assert(
    !secondAppoint.success && secondAppoint.message.includes('không thể kiêm nhiệm'),
    '4b. Ngăn chặn kiêm nhiệm chức vụ thứ hai (Single-Duty Invariant bảo vệ chặt chẽ)',
    secondAppoint.message
  );

  // Đệ tử đang bổ nhiệm tự động gỡ khỏi xuất chiến
  const childInState = player.offspringState!.children.find((c) => c.id === graduatedChild.id);
  assert(
    childInState?.isDeployed === false && player.offspringState?.deployedChildId !== graduatedChild.id,
    '4c. Tiên Đồng đã bổ nhiệm rời khỏi đội hình xuất chiến Động Phủ (Anti-stack exploit)'
  );
}

// ─── TEST CASE 5: BÃI NHIỆM / TRIỆU HỒI AN TOÀN (SAFE RECALL) ─────────────────
console.log('\n--- TEST CASE 5: BÃI NHIỆM / TRIỆU HỒI AN TOÀN ---');

{
  let player = createBasePlayer();
  const graduatedChild = graduateDisciple(mockMatureChild);
  player.offspringState!.children = [graduatedChild];

  // Bổ nhiệm
  player = appointDiscipleRole(
    player,
    graduatedChild.id,
    'tinh_hai_guardian',
    'node_thai_vi_entry'
  ).updatedPlayer;

  // Triệu hồi
  const recallResult = recallDiscipleRole(player, graduatedChild.id);
  assert(recallResult.success, '5a. Lệnh triệu hồi thực thi thành công', recallResult.message);
  player = recallResult.updatedPlayer;

  assert(
    !player.cosmicState?.nodeGuardians?.['node_thai_vi_entry'],
    '5b. Cứ điểm Tinh Hải đã xóa ID Trấn Thủ Sĩ sau khi triệu hồi'
  );

  assert(
    !player.cosmicDefenseState?.garrisons?.['node_thai_vi_entry'],
    '5c. Hàng phòng ngự Tinh Hải đã gỡ bỏ garrison tương ứng'
  );

  const recalledChild = player.offspringState!.children.find((c) => c.id === graduatedChild.id);
  assert(
    recalledChild?.appointmentData?.assignedRole === 'none' &&
      recalledChild.appointmentData.assignedTargetId === null &&
      recalledChild.combatPower === mockMatureChild.combatPower,
    '5d. Tiên Đồng hoàn trả trạng thái tự do ("none"), bảo toàn nguyên vẹn 100% chỉ số và lực chiến'
  );
}

// ─── TEST CASE 6: TƯƠNG THÍCH SAVE CŨ (SAVE MIGRATION INVARIANT) ──────────────
console.log('\n--- TEST CASE 6: TƯƠNG THÍCH SAVE CŨ (SAVE MIGRATION) ---');

{
  // Giả lập save game cổ điển chưa từng có phân hệ Bổ Nhiệm Tiên Đồng Xuất Sư
  const legacySaveData: any = {
    name: 'Cổ Đạo Giả',
    currentRealm: 45,
    linhThach: 100000,
    offspringState: {
      children: [
        {
          id: 'child_legacy_1',
          name: 'Hài Nhi Cũ',
          gender: 'nam',
          stage: 'child',
          realmIndex: 9,
          realmName: 'Luyện Khí Tầng 9',
          // Hoàn toàn thiếu appointmentData
        },
      ],
      deployedChildId: null,
      demonicKarma: 0,
    },
    customSectState: {
      isFounded: true,
      sectName: 'Cổ Phái',
      mountainName: 'Cổ Sơn',
      sectVault: {
        linhThach: 500,
        herbs: {},
        ores: {},
        // Hoàn toàn thiếu deaconDiscipleId
      },
      disciples: [
        {
          id: 'disciple_legacy_1',
          name: 'Cố Nhân',
          realmIndex: 16,
          // Hoàn toàn thiếu appointmentData
        },
      ],
    },
    cosmicState: {
      unlocked: true,
      currentNodeId: 'node_1',
      occupiedNodeIds: ['node_1'],
      defeatedGuardianIds: [],
      cargo: { honDonThanThiet: 0, tienThienDiBao: 0, vanCoDeRuyi: 0, linhThach: 0 },
      // Hoàn toàn thiếu nodeGuardians
    },
  };

  const migratedPlayer = migrateDiscipleAppointmentData(legacySaveData);

  assert(
    migratedPlayer.offspringState?.children[0]?.appointmentData?.isGraduated === false &&
      migratedPlayer.offspringState?.children[0]?.appointmentData?.assignedRole === 'none',
    '6a. Tự động chuẩn hóa appointmentData mặc định an toàn cho Tiên Đồng cũ'
  );

  assert(
    migratedPlayer.customSectState?.disciples[0]?.appointmentData?.assignedRole === 'none',
    '6b. Tự động chuẩn hóa appointmentData an toàn cho Đệ Tử Tông Môn cũ'
  );

  assert(
    migratedPlayer.customSectState?.sectVault?.deaconDiscipleId === undefined,
    '6c. Khố Phòng Tông Môn khởi tạo deaconDiscipleId undefined an toàn không crash'
  );

  assert(
    typeof migratedPlayer.cosmicState?.nodeGuardians === 'object',
    '6d. CosmicState khởi tạo nodeGuardians an toàn'
  );

  // Self-Healing test: Nếu save có deacon trỏ đến id rác không tồn tại
  const corruptSave: any = {
    ...legacySaveData,
    customSectState: {
      ...legacySaveData.customSectState,
      sectVault: {
        ...legacySaveData.customSectState.sectVault,
        deaconDiscipleId: 'ghost_disciple_id', // ID ma không tồn tại
      },
    },
    cosmicState: {
      ...legacySaveData.cosmicState,
      nodeGuardians: {
        node_1: 'ghost_disciple_id', // ID ma
      },
    },
  };

  const healedPlayer = migrateDiscipleAppointmentData(corruptSave);
  assert(
    healedPlayer.customSectState?.sectVault?.deaconDiscipleId === undefined,
    '6e. Self-Healing tự động dọn sạch deaconDiscipleId ma'
  );
  assert(
    !healedPlayer.cosmicState?.nodeGuardians?.['node_1'],
    '6f. Self-Healing tự động dọn sạch Trấn Thủ Sĩ ma khỏi cứ điểm Tinh Hải'
  );
}

// ─── TỔNG KẾT TEST SUITE ─────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TIÊU CHÍ ĐẠT (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('════════════════════════════════════════════════════════════════════');

if (passedTests === totalTests) {
  console.log('🎉 TOÀN BỘ 6 CA KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC! HỆ THỐNG SẴN SÀNG.');
} else {
  console.error('⚠️ CÓ TEST THẤT BẠI, CẦN KIỂM TRA LẠI!');
  process.exit(1);
}
