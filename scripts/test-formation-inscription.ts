// scripts/test-formation-inscription.ts
// Test Suite: Minh Khắc Trận Văn & Mạch Dẫn Linh (Formation Inscription)
// Tuân thủ 100% đặc tả 6 ca kiểm thử bắt buộc

import {
  FORMATION_INSCRIPTIONS_REGISTRY,
  rollWeaponConduits,
  validateInscriptionRequirements,
  cleanseConduitSlot,
  aggregateEquipmentInscriptions,
  inscribeFormationToConduit,
  inscribeFormationToWeapon,
  cleanseWeaponConduit
} from '../lib/formation-inscription-logic';
import {
  FormationInscriptionConfig,
  InscriptionConduitSlot,
  WeaponInscriptionMetadata
} from '../lib/types/formation-inscription';
import { Equipment } from '../lib/types/items';
import { ModularWeaponMetadata } from '../lib/types/modular-metallurgy';
import { PlayerStats } from '../lib/types/player';
import { migrateFormationInscriptionData } from '../lib/save-migration';
import { calculateCombatStats } from '../lib/destiny-data';
import { executeInscriptionCombatTurn } from '../lib/game-logic/combat';
import {
  findEquipmentInPlayer,
  updateEquipmentInPlayer,
  deductMaterialsFromPlayerInventory,
  deductCleansingWater
} from '../hooks/useFormationInscriptionActions';

// ============================================================================
// TEST UTILITIES & ASSERTIONS
// ============================================================================

let passedCount = 0;
const TOTAL_TESTS = 8;

function runTestCase(testNumber: number, testName: string, testFn: () => void) {
  console.log(`\n---------------------------------------------------------------`);
  console.log(`🧪 Test ${testNumber}: ${testName}`);
  console.log(`---------------------------------------------------------------`);
  try {
    testFn();
    console.log(`  ==> [PASS] Test ${testNumber}: ${testName}`);
    passedCount++;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`  ==> [FAIL] Test ${testNumber}: ${testName}`);
    console.error(`      Lý do: ${errorMsg}`);
    process.exit(1);
  }
}

function assertTrue(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message} - Kỳ vọng: ${expected}, Thực tế: ${actual}`);
  }
}

console.log('===============================================================');
console.log('⚡ QA TEST SUITE: FORMATION INSCRIPTION & SPIRIT CONDUITS');
console.log('   GAMETUTIEN ENGINE - AUTOMATION TEST SUITE');
console.log('===============================================================');

// ============================================================================
// TEST 1: Conduit Roll Distribution Invariant
// ============================================================================
runTestCase(1, 'Conduit Roll Distribution Invariant', () => {
  // 1. Thợ rèn cấp thấp (Luyện Khí / Phàm Nhân, Purity 70, không Dị Hỏa)
  const lowTierTrials = 200;
  let count1or2 = 0;

  for (let i = 0; i < lowTierTrials; i++) {
    const meta = rollWeaponConduits(0, 70, 0);

    // Mạch dẫn sinh ra hợp lệ trong biên [1, 4]
    assertTrue(
      meta.unlockedSlots >= 1 && meta.unlockedSlots <= 4,
      `Slot mở (${meta.unlockedSlots}) phải nằm nghiêm ngặt trong đoạn [1, 4]`
    );
    assertTrue(
      meta.conduits.length === meta.unlockedSlots,
      `Độ dài mảng conduits (${meta.conduits.length}) phải bằng unlockedSlots (${meta.unlockedSlots})`
    );

    // Mọi slot ban đầu đều được mở khóa và chưa khắc trận
    meta.conduits.forEach(c => {
      assertTrue(c.isUnlocked === true, 'Slot ban đầu phải có isUnlocked = true');
      assertTrue(c.inscribedFormationId === null, 'Slot ban đầu phải có inscribedFormationId = null');
      assertTrue(c.currentEffects.length === 0, 'Slot ban đầu phải có currentEffects rỗng');
    });

    if (meta.unlockedSlots === 1 || meta.unlockedSlots === 2) {
      count1or2++;
    }
  }

  // Phân phối thợ rèn cấp thấp phải tập trung ở 1 - 2 slots (tối thiểu 85%)
  const ratio1or2 = count1or2 / lowTierTrials;
  assertTrue(
    ratio1or2 >= 0.85,
    `Thợ rèn cấp thấp phân phối 1-2 slots đạt ${(ratio1or2 * 100).toFixed(1)}% (yêu cầu >= 85%)`
  );
  console.log(`  ✓ Thợ rèn cấp thấp: ${(ratio1or2 * 100).toFixed(1)}% rơi vào 1-2 slots (${count1or2}/${lowTierTrials})`);

  // 2. Thợ rèn Hóa Thần (realmIndex = 4) + Hợp Kim Purity 100%
  const highTierTrials = 200;
  for (let i = 0; i < highTierTrials; i++) {
    const meta = rollWeaponConduits(4, 100);

    // Luôn đạt 3 hoặc 4 slots
    assertTrue(
      meta.unlockedSlots === 3 || meta.unlockedSlots === 4,
      `Thợ rèn Hóa Thần + Purity 100% phải luôn đạt 3 hoặc 4 slots (nhận được: ${meta.unlockedSlots})`
    );
    assertTrue(
      meta.conduits.length === meta.unlockedSlots,
      `Số lượng mạch dẫn (${meta.conduits.length}) phải khớp unlockedSlots (${meta.unlockedSlots})`
    );
  }
  console.log(`  ✓ Thợ rèn Hóa Thần + Purity 100%: 100% số lần quay (${highTierTrials}/${highTierTrials}) đạt 3 hoặc 4 slots`);
});

// ============================================================================
// TEST 2: Divine Sense & Ink Gating Guard
// ============================================================================
runTestCase(2, 'Divine Sense & Ink Gating Guard', () => {
  const formation = FORMATION_INSCRIPTIONS_REGISTRY.bat_quai_ho_than; // Tier 5, req sense = 600
  assertTrue(!!formation, 'Trận đồ bat_quai_ho_than phải tồn tại trong registry');

  const emptySlots: InscriptionConduitSlot[] = [
    { slotIndex: 0, isUnlocked: true, inscribedFormationId: null, currentEffects: [] },
    { slotIndex: 1, isUnlocked: true, inscribedFormationId: null, currentEffects: [] }
  ];

  const fullInventory = [
    { id: 'linh_muc_thuong_pham', name: 'Thượng Phẩm Linh Mực', quantity: 10 },
    { id: 'huyen_quy_sa', name: 'Huyền Quy Sa', quantity: 15 }
  ];

  // 1. Thần Thức 20 cố khắc trận Tier 5 (yêu cầu 600) -> Thẩm định trả về valid: false
  const resLowSense = validateInscriptionRequirements(20, fullInventory, formation, emptySlots);
  assertEqual(resLowSense.valid, false, 'Thần Thức 20 không được phép khắc trận Tier 5');
  assertTrue(
    !!resLowSense.reason && resLowSense.reason.includes('Thần thức không đủ'),
    `Lý do từ chối phải nhắc đến thiếu thần thức. Thực tế: ${resLowSense.reason}`
  );
  console.log(`  ✓ Chặn thần thức yếu thành công: "${resLowSense.reason}"`);

  // 2. Thần Thức cao (1000) nhưng thiếu Linh Mực trong kho -> Thẩm định trả về valid: false
  const inventoryMissingInk = [
    { id: 'linh_muc_thuong_pham', name: 'Thượng Phẩm Linh Mực', quantity: 1 }, // Thiếu (cần 3)
    { id: 'huyen_quy_sa', name: 'Huyền Quy Sa', quantity: 15 }
  ];
  const resMissingInk = validateInscriptionRequirements(1000, inventoryMissingInk, formation, emptySlots);
  assertEqual(resMissingInk.valid, false, 'Thiếu linh mực phải bị từ chối');
  assertTrue(
    !!resMissingInk.reason && resMissingInk.reason.includes('Thiếu nguyên liệu'),
    `Lý do từ chối phải nhắc đến thiếu nguyên liệu. Thực tế: ${resMissingInk.reason}`
  );
  console.log(`  ✓ Chặn thiếu linh mực thành công: "${resMissingInk.reason}"`);

  // 3. Thần Thức đủ (1000) và đủ toàn bộ Linh Mực / Trận Sa -> Thẩm định thành công
  const resSuccess = validateInscriptionRequirements(1000, fullInventory, formation, emptySlots);
  assertEqual(resSuccess.valid, true, 'Đủ thần thức và nguyên liệu phải thẩm định thành công');
  assertEqual(resSuccess.reason, undefined, 'Thẩm định thành công không được có reason lỗi');
  console.log('  ✓ Thẩm định thành công khi người chơi thỏa mãn 100% điều kiện');
});

// ============================================================================
// TEST 3: Anti-Duplicate Inscription Guard
// ============================================================================
runTestCase(3, 'Anti-Duplicate Inscription Guard', () => {
  const formation = FORMATION_INSCRIPTIONS_REGISTRY.bat_quai_ho_than;

  // Trang bị đã khắc bat_quai_ho_than ở slot 0
  const slotsWithDuplicate: InscriptionConduitSlot[] = [
    {
      slotIndex: 0,
      isUnlocked: true,
      inscribedFormationId: 'bat_quai_ho_than',
      inscribedFormationName: 'Bát Quái Hộ Thân Trận',
      currentEffects: [...formation.effects]
    },
    {
      slotIndex: 1,
      isUnlocked: true,
      inscribedFormationId: null,
      currentEffects: []
    }
  ];

  const fullInventory = [
    { id: 'linh_muc_thuong_pham', name: 'Thượng Phẩm Linh Mực', quantity: 20 },
    { id: 'huyen_quy_sa', name: 'Huyền Quy Sa', quantity: 20 }
  ];

  // Cố tình thẩm định khắc tiếp bat_quai_ho_than vào slot 1
  const validation = validateInscriptionRequirements(1500, fullInventory, formation, slotsWithDuplicate);

  assertEqual(validation.valid, false, 'Bắt buộc từ chối khắc trùng cùng một trận đồ trên 1 vũ khí');
  assertTrue(
    !!validation.reason && validation.reason.includes('đã được minh khắc'),
    `Lý do từ chối phải báo trận văn đã được khắc. Thực tế: ${validation.reason}`
  );
  console.log(`  ✓ Anti-Dup Guard kích hoạt chuẩn xác: "${validation.reason}"`);
});

// ============================================================================
// TEST 4: Cleanse & Re-inscription Invariant
// ============================================================================
runTestCase(4, 'Cleanse & Re-inscription Invariant', () => {
  const formationPhongNhan = FORMATION_INSCRIPTIONS_REGISTRY.phong_nhan_tran;
  const formationCuuTieu = FORMATION_INSCRIPTIONS_REGISTRY.cuu_tieu_loi_tran;

  // 1. Tạo một slot ban đầu đã khắc Phong Nhận Trận
  const initialSlot: InscriptionConduitSlot = {
    slotIndex: 0,
    isUnlocked: true,
    inscribedFormationId: 'phong_nhan_tran',
    inscribedFormationName: 'Phong Nhận Trận',
    inscribedAt: 1700000000000,
    currentEffects: [...formationPhongNhan.effects]
  };

  // 2. Chạy hàm cleanseConduitSlot
  const cleansedSlot = cleanseConduitSlot(initialSlot);

  // Mạch dẫn lập tức trở về trạng thái trống (null)
  assertEqual(cleansedSlot.inscribedFormationId, null, 'inscribedFormationId phải là null');
  assertEqual(cleansedSlot.inscribedFormationName, undefined, 'inscribedFormationName phải là undefined');
  assertEqual(cleansedSlot.inscribedAt, undefined, 'inscribedAt phải là undefined');
  assertEqual(cleansedSlot.currentEffects.length, 0, 'currentEffects phải rỗng sau tẩy luyện');

  // isUnlocked và slotIndex vẫn phải giữ nguyên
  assertEqual(cleansedSlot.isUnlocked, true, 'isUnlocked vẫn phải giữ true');
  assertEqual(cleansedSlot.slotIndex, 0, 'slotIndex không được thay đổi');

  // Không làm mutate slot gốc (tính thuần khiết Pure Function)
  assertEqual(initialSlot.inscribedFormationId, 'phong_nhan_tran', 'Đối tượng ban đầu không được bị mutate');
  assertEqual(initialSlot.currentEffects.length, 1, 'Hiệu ứng đối tượng ban đầu không bị ảnh hưởng');
  console.log('  ✓ Tẩy luyện slot sạch sẽ, bảo toàn trạng thái mở khóa và tính bất biến Pure Function');

  // 3. Tiến hành khắc Trận Văn mới (Cửu Tiêu Lôi Trận) vào slot vừa tẩy
  const reinscribedSlot = inscribeFormationToConduit(cleansedSlot, formationCuuTieu, 1710000000000);

  assertEqual(reinscribedSlot.inscribedFormationId, 'cuu_tieu_loi_tran', 'Slot phải nhận ID trận mới');
  assertEqual(reinscribedSlot.inscribedFormationName, 'Cửu Tiêu Lôi Trận', 'Slot phải nhận tên trận mới');
  assertEqual(reinscribedSlot.isUnlocked, true, 'Slot vẫn phải mở khóa');
  assertEqual(reinscribedSlot.currentEffects.length, 1, 'Phải có 1 hiệu ứng trận văn mới');
  assertEqual(reinscribedSlot.currentEffects[0].triggerType, 'crowd_control', 'Hiệu ứng mới là crowd_control');
  assertEqual(reinscribedSlot.currentEffects[0].chance, 0.15, 'Tỷ lệ kích hoạt đúng 15%');
  console.log('  ✓ Tái khắc trận đồ mới vào slot vừa tẩy thành công trơn tru');
});

// ============================================================================
// TEST 5: Inscription Aggregation
// ============================================================================
runTestCase(5, 'Inscription Aggregation', () => {
  const tuKhiConfig = FORMATION_INSCRIPTIONS_REGISTRY.tu_khi_tran;
  const phongNhanConfig = FORMATION_INSCRIPTIONS_REGISTRY.phong_nhan_tran;
  const huyetSatConfig = FORMATION_INSCRIPTIONS_REGISTRY.huyet_sat_the_huyet;

  // Trang bị 1: Phi Kiếm chứa Tụ Khí Trận (Passive) & Phong Nhận Trận (On-Hit Proc)
  const weapon: Equipment = {
    id: 'wp_test_1',
    name: 'Bách Luyện Phi Kiếm',
    slot: 'weapon',
    grade: 'Cổ Bảo',
    powerBonus: 2500,
    enhancement: 0,
    hpBonus: 1000,
    mpBonus: 500,
    inscriptionData: {
      totalSlots: 2,
      unlockedSlots: 2,
      inscribedCount: 2,
      conduits: [
        {
          slotIndex: 0,
          isUnlocked: true,
          inscribedFormationId: 'tu_khi_tran',
          inscribedFormationName: 'Tụ Khí Trận',
          currentEffects: [...tuKhiConfig.effects]
        },
        {
          slotIndex: 1,
          isUnlocked: true,
          inscribedFormationId: 'phong_nhan_tran',
          inscribedFormationName: 'Phong Nhận Trận',
          currentEffects: [...phongNhanConfig.effects]
        }
      ]
    }
  };

  // Trang bị 2: Hộ Giáp chứa Huyết Sát Phệ Huyết Trận (Vampiric Proc) và 1 slot trống
  const armor: Equipment = {
    id: 'am_test_1',
    name: 'Huyền Thiết Chiến Giáp',
    slot: 'armor',
    grade: 'Bảo Khí',
    powerBonus: 1800,
    enhancement: 0,
    hpBonus: 3000,
    mpBonus: 200,
    inscriptionData: {
      totalSlots: 2,
      unlockedSlots: 2,
      inscribedCount: 1,
      conduits: [
        {
          slotIndex: 0,
          isUnlocked: true,
          inscribedFormationId: 'huyet_sat_the_huyet',
          inscribedFormationName: 'Huyết Sát Phệ Huyết Trận',
          currentEffects: [...huyetSatConfig.effects]
        },
        {
          slotIndex: 1,
          isUnlocked: true,
          inscribedFormationId: null,
          currentEffects: []
        }
      ]
    }
  };

  // Trang bị 3: Nhẫn không có inscriptionData
  const ring: Equipment = {
    id: 'rg_test_1',
    name: 'Thanh Phong Linh Giới',
    slot: 'ring',
    grade: 'Linh Khí',
    powerBonus: 500,
    enhancement: 0,
    hpBonus: 200,
    mpBonus: 100
  };

  const aggregated = aggregateEquipmentInscriptions([weapon, armor, ring]);

  // Kiểm tra danh sách Passives
  assertEqual(aggregated.passives.length, 1, 'Số lượng hiệu ứng bị động phải là 1 (Tụ Khí Trận)');
  const passiveEff = aggregated.passives[0];
  assertEqual(passiveEff.triggerType, 'passive_stat', 'Trigger type của passive phải là passive_stat');
  assertEqual(passiveEff.statKey, 'manaCostReduction', 'Stat key phải là manaCostReduction');
  assertEqual(passiveEff.value, 0.20, 'Giá trị giảm tiêu hao phải là 20% (0.20)');
  console.log(`  ✓ Passives tổng hợp chính xác: [${passiveEff.name}] - Giảm ${(passiveEff.value * 100)}% tiêu hao MP`);

  // Kiểm tra danh sách Procs
  assertEqual(aggregated.procs.length, 2, 'Số lượng hiệu ứng kích hoạt phải là 2 (Phong Nhận & Huyết Sát)');

  const procPhongNhan = aggregated.procs.find(p => p.triggerType === 'on_hit_proc');
  assertTrue(!!procPhongNhan, 'Phải tìm thấy hiệu ứng on_hit_proc');
  assertEqual(procPhongNhan!.chance, 0.25, 'Tỷ lệ kích hoạt Phong Nhận là 25%');
  assertEqual(procPhongNhan!.value, 0.40, 'Sát thương Phong Nhận là 40% ATK');

  const procHuyetSat = aggregated.procs.find(p => p.triggerType === 'vampiric_lifesteal');
  assertTrue(!!procHuyetSat, 'Phải tìm thấy hiệu ứng vampiric_lifesteal');
  assertEqual(procHuyetSat!.statKey, 'lifestealPercent', 'Huyết Sát lifestealPercent');
  assertEqual(procHuyetSat!.value, 0.12, 'Hút máu 12% sát thương');
  console.log('  ✓ Procs tổng hợp chính xác: Phong Nhận Trận (25% xác suất x 40% ATK) & Huyết Sát Trận (12% hút máu)');
});

// ============================================================================
// TEST 6: Data Integrity Preservation
// ============================================================================
runTestCase(6, 'Data Integrity Preservation', () => {
  const alloyMetaSnapshot: ModularWeaponMetadata = {
    archetypeId: 'phi_kiem',
    archetypeName: 'Phi Kiếm',
    purity: 88,
    dominantElement: 'canh_kim',
    elementalEffects: {
      trueDamagePercent: 12
    },
    archetypeMultipliers: {
      atkMultiplier: 1.25,
      speedMultiplier: 1.25,
      critRateBonus: 0.12
    },
    alloyComposition: {
      ores: [
        { oreId: 'canh_kim_thach', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 40, ratio: 1.0, effectiveBonus: 12 }
      ],
      totalWeight: 40,
      dominantElement: 'canh_kim',
      dominantRatio: 1.0,
      purityScore: 88,
      purityMultiplier: 0.88,
      elementalStats: {
        trueDamagePercent: 12,
        slowSpeedPercent: 0,
        burnDamagePercent: 0,
        damageReductionPercent: 0,
        critResistPercent: 0
      },
      summary: '88% Purity Canh Kim'
    },
    craftedAt: 1705000000000,
    blacksmithRealmIndex: 3,
    flameBonusPercent: 5
  };

  const initialEquipment: Equipment = {
    id: 'divine_sword_999',
    name: 'Bạch Hổ Phi Kiếm',
    slot: 'weapon',
    grade: 'Cổ Bảo',
    quality: 'cuc_pham',
    powerBonus: 3200,
    enhancement: 7,
    atkBonus: 540,
    defBonus: 120,
    hpBonus: 1800,
    mpBonus: 600,
    speedBonus: 45,
    critRateBonus: 0.15,
    durability: 100,
    sockets: [
      { slotIndex: 0, unlocked: true, gem: null },
      { slotIndex: 1, unlocked: false, gem: null }
    ],
    alloyMetadata: alloyMetaSnapshot,
    inscriptionData: null
  };

  // Lưu bản chụp JSON ban đầu để đối chiếu
  const originalJsonBefore = JSON.stringify({
    id: initialEquipment.id,
    name: initialEquipment.name,
    slot: initialEquipment.slot,
    grade: initialEquipment.grade,
    quality: initialEquipment.quality,
    powerBonus: initialEquipment.powerBonus,
    enhancement: initialEquipment.enhancement,
    atkBonus: initialEquipment.atkBonus,
    defBonus: initialEquipment.defBonus,
    hpBonus: initialEquipment.hpBonus,
    mpBonus: initialEquipment.mpBonus,
    speedBonus: initialEquipment.speedBonus,
    critRateBonus: initialEquipment.critRateBonus,
    durability: initialEquipment.durability,
    sockets: initialEquipment.sockets,
    alloyMetadata: initialEquipment.alloyMetadata
  });

  // 1. Khởi tạo mạch dẫn linh mới cho vũ khí
  const conduitMetadata = rollWeaponConduits(3, 88);
  const updatedWithConduits = inscribeFormationToWeapon(
    conduitMetadata,
    0,
    FORMATION_INSCRIPTIONS_REGISTRY.phong_nhan_tran,
    1706000000000
  );

  // Gắn vào trang bị
  const modifiedEquipment: Equipment = {
    ...initialEquipment,
    inscriptionData: updatedWithConduits
  };

  // 2. Tẩy luyện slot 0
  const cleansedMetadata = cleanseWeaponConduit(modifiedEquipment.inscriptionData!, 0);
  const finalEquipment: Equipment = {
    ...modifiedEquipment,
    inscriptionData: cleansedMetadata
  };

  // 3. Đối chiếu JSON các thuộc tính cốt lõi của trang bị sau các thao tác khắc & tẩy
  const originalJsonAfter = JSON.stringify({
    id: finalEquipment.id,
    name: finalEquipment.name,
    slot: finalEquipment.slot,
    grade: finalEquipment.grade,
    quality: finalEquipment.quality,
    powerBonus: finalEquipment.powerBonus,
    enhancement: finalEquipment.enhancement,
    atkBonus: finalEquipment.atkBonus,
    defBonus: finalEquipment.defBonus,
    hpBonus: finalEquipment.hpBonus,
    mpBonus: finalEquipment.mpBonus,
    speedBonus: finalEquipment.speedBonus,
    critRateBonus: finalEquipment.critRateBonus,
    durability: finalEquipment.durability,
    sockets: finalEquipment.sockets,
    alloyMetadata: finalEquipment.alloyMetadata
  });

  assertEqual(
    originalJsonAfter,
    originalJsonBefore,
    'Toàn bộ thuộc tính gốc của trang bị (alloyMetadata, stats, durability, sockets) phải bảo toàn nguyên vẹn 100%'
  );

  // Kiểm tra sâu các trường quan trọng
  assertEqual(finalEquipment.alloyMetadata?.purity, 88, 'alloyMetadata.purity không bị thay đổi');
  assertEqual(finalEquipment.alloyMetadata?.archetypeId, 'phi_kiem', 'alloyMetadata.archetypeId giữ nguyên');
  assertEqual(finalEquipment.powerBonus, 3200, 'powerBonus giữ nguyên 3200');
  assertEqual(finalEquipment.atkBonus, 540, 'atkBonus giữ nguyên 540');
  assertEqual(finalEquipment.enhancement, 7, 'enhancement giữ nguyên cấp 7');
  assertEqual(finalEquipment.sockets?.length, 2, 'sockets giữ nguyên độ dài 2');

  console.log('  ✓ Bảo toàn tuyệt đối 100% dữ liệu gốc: alloyMetadata, stats, sockets, durability không bị sai lệch');
});

// ============================================================================
// TEST 7: Combat Integration & Save Migration Invariant
// ============================================================================
runTestCase(7, 'Combat Integration & Save Migration Invariant', () => {
  // 1. Kiểm tra Save Migration: migrateFormationInscriptionData
  const legacyPlayer: any = {
    name: 'Hàn Lập',
    currentRealm: 3,
    canCot: 60,
    ngoTinh: 70,
    tamCanh: 65,
    khiVan: 80,
    equipment: {
      weapon: {
        id: 'sword_legacy_1',
        name: 'Thanh Trúc Kiếm',
        slot: 'weapon',
        powerBonus: 1200
        // Chưa có inscriptionData
      },
      armor: {
        id: 'armor_legacy_1',
        name: 'Bạch Vân Y',
        slot: 'armor',
        powerBonus: 800
      }
    },
    inventory: {
      equipment: [
        {
          id: 'sword_legacy_inv',
          name: 'Huyền Thiết Kiếm',
          slot: 'weapon',
          powerBonus: 1000
          // Chưa có inscriptionData
        }
      ]
    }
  };

  const migrated = migrateFormationInscriptionData(legacyPlayer);

  // Khởi tạo an toàn inscriptionState nếu chưa có
  assertTrue(!!migrated.inscriptionState, 'inscriptionState phải được khởi tạo an toàn');
  assertEqual(migrated.inscriptionState?.totalInscribedCount, 0, 'totalInscribedCount khởi tạo bằng 0');
  assertEqual(migrated.inscriptionState?.cleansingWaterCount, 5, 'cleansingWaterCount khởi tạo bằng 5');
  assertTrue(
    Array.isArray(migrated.inscriptionState?.unlockedInscriptions) &&
    migrated.inscriptionState.unlockedInscriptions.includes('tu_khi_tran') &&
    migrated.inscriptionState.unlockedInscriptions.includes('phong_nhan_tran'),
    'unlockedInscriptions phải mở sẵn tu_khi_tran và phong_nhan_tran'
  );

  // Quét qua player.equipment: vũ khí chưa có inscriptionData phải được cấp 2 slots
  const eqWeapon = (migrated.equipment as any)?.weapon;
  assertTrue(!!eqWeapon?.inscriptionData, 'Vũ khí đang trang bị phải có inscriptionData sau migration');
  assertEqual(eqWeapon.inscriptionData.maxConduits, 2, 'maxConduits phải là 2');
  assertEqual(eqWeapon.inscriptionData.conduits.length, 2, 'conduits phải có 2 slots');
  assertEqual(eqWeapon.inscriptionData.conduits[0].isUnlocked, true, 'Slot 0 phải mở sẵn');
  assertEqual(eqWeapon.inscriptionData.conduits[0].inscribedFormationId, null, 'Slot 0 ban đầu rỗng');

  // Quét qua player.inventory: vũ khí trong kho cũng được cấp 2 slots
  const invWeapon = (migrated.inventory as any)?.equipment?.[0];
  assertTrue(!!invWeapon?.inscriptionData, 'Vũ khí trong kho phải có inscriptionData sau migration');
  assertEqual(invWeapon.inscriptionData.maxConduits, 2, 'Kho: maxConduits là 2');

  // Đảm bảo tính lũy đẳng (Idempotent 100%): Chạy lại lần 2 không thay đổi kết quả
  const migratedTwice = migrateFormationInscriptionData(migrated);
  assertEqual(
    JSON.stringify(migratedTwice),
    JSON.stringify(migrated),
    'Tính lũy đẳng: Chạy migration nhiều lần phải bảo toàn dữ liệu đồng nhất'
  );
  console.log('  ✓ Save Migration: Tự động khởi tạo inscriptionState & 2 slots cho thần binh, bảo toàn Idempotence 100%');

  // 2. Kiểm tra destiny-data: calculateCombatStats tích hợp chỉ số bị động (qi_cost_reduction)
  const playerWithTuKhi: PlayerStats = {
    ...migrated,
    equipment: {
      weapon: {
        id: 'wp_tu_khi',
        name: 'Tụ Khí Phi Kiếm',
        slot: 'weapon',
        powerBonus: 1500,
        grade: 'Bảo Khí',
        inscriptionData: {
          totalSlots: 2,
          unlockedSlots: 2,
          inscribedCount: 1,
          conduits: [
            {
              slotIndex: 0,
              isUnlocked: true,
              inscribedFormationId: 'tu_khi_tran',
              inscribedFormationName: 'Tụ Khí Trận',
              currentEffects: [...FORMATION_INSCRIPTIONS_REGISTRY.tu_khi_tran.effects]
            }
          ]
        }
      }
    }
  } as any;

  const cStats = calculateCombatStats(playerWithTuKhi);
  assertEqual(cStats.qi_cost_reduction, 0.20, 'cStats.qi_cost_reduction phải bằng 0.20 (20%)');
  assertEqual(cStats.qiCostReductionPercent, 20, 'cStats.qiCostReductionPercent phải bằng 20%');
  console.log('  ✓ calculateCombatStats: Bóc tách chỉ số bị động Tụ Khí Trận (-20% tiêu hao chân nguyên) chính xác');

  // 3. Kiểm tra Combat Engine: executeInscriptionCombatTurn
  const divineWeapon: Equipment = {
    id: 'wp_tri_formation',
    name: 'Tam Cực Tiên Kiếm',
    slot: 'weapon',
    grade: 'Cổ Bảo',
    powerBonus: 3000,
    enhancement: 0,
    hpBonus: 1000,
    mpBonus: 500,
    inscriptionData: {
      totalSlots: 3,
      unlockedSlots: 3,
      inscribedCount: 3,
      conduits: [
        {
          slotIndex: 0,
          isUnlocked: true,
          inscribedFormationId: 'phong_nhan_tran',
          inscribedFormationName: 'Phong Nhận Trận',
          currentEffects: [...FORMATION_INSCRIPTIONS_REGISTRY.phong_nhan_tran.effects]
        },
        {
          slotIndex: 1,
          isUnlocked: true,
          inscribedFormationId: 'huyet_sat_the_huyet',
          inscribedFormationName: 'Huyết Sát Phệ Huyết Trận',
          currentEffects: [...FORMATION_INSCRIPTIONS_REGISTRY.huyet_sat_the_huyet.effects]
        },
        {
          slotIndex: 2,
          isUnlocked: true,
          inscribedFormationId: 'bat_quai_ho_than',
          inscribedFormationName: 'Bát Quái Hộ Thân Trận',
          currentEffects: [...FORMATION_INSCRIPTIONS_REGISTRY.bat_quai_ho_than.effects]
        }
      ]
    }
  };

  // Case 3.1: Phong Nhận Trận (On-Hit Proc) kích hoạt khi roll < 0.25
  const turn1 = executeInscriptionCombatTurn({
    playerHp: 5000,
    playerMaxHp: 5000,
    playerAtk: 1000,
    equippedItems: [divineWeapon],
    hasTriggeredBatQuaiShield: false,
    targetHp: 20000,
    targetMaxHp: 20000,
    targetDef: 0, // def = 0 => rawDamage = 1000
    incomingBossDamage: 500,
    randomFn: () => 0.10 // 0.10 < 0.25 => trigger Phong Nhận Trận
  });

  assertEqual(turn1.phongNhanTriggered, true, 'Phong Nhận Trận phải kích hoạt khi roll < 0.25');
  assertEqual(turn1.phongNhanBonusDamage, 400, 'Phong Nhận Trận phải gây thêm 40% ATK (400)');
  assertEqual(turn1.finalDamageDealt, 1400, 'Tổng sát thương gây ra = 1000 + 400 = 1400');
  assertTrue(
    turn1.combatLogs.some(log => log.includes('【Phong Nhận Trận】 bạo phát')),
    'Combat log phải có dòng phong nhận trận'
  );
  console.log(`  ✓ Phong Nhận Trận: Kích hoạt kiếm khí gây thêm +${turn1.phongNhanBonusDamage} sát thương`);

  // Case 3.2: Huyết Sát Phệ Huyết Trận (Vampiric Drain 12% lượng sát thương thực tế)
  const expectedHeal = Math.round(1400 * 0.12); // 168
  assertEqual(turn1.vampiricHealedHp, expectedHeal, `Hút máu phải hồi phục đúng 12% (${expectedHeal})`);
  console.log(`  ✓ Huyết Sát Trận: Hồi phục chính xác +${turn1.vampiricHealedHp} HP (12% sát thương)`);

  // Case 3.3: Bát Quái Hộ Thân Trận (Emergency Shield khi HP < 30% Max HP)
  // Max HP = 10,000, 30% = 3,000.
  // HP hiện tại = 3,500, đòn đánh boss = 1,500 => Tụt xuống 2,000 (< 30%)
  const turn2 = executeInscriptionCombatTurn({
    playerHp: 3500,
    playerMaxHp: 10000,
    playerAtk: 1000,
    equippedItems: [divineWeapon],
    hasTriggeredBatQuaiShield: false,
    targetHp: 15000,
    targetMaxHp: 20000,
    targetDef: 0,
    incomingBossDamage: 1500,
    randomFn: () => 0.99 // Không kích hoạt proc khác
  });

  assertEqual(turn2.hasTriggeredBatQuaiShield, true, 'hasTriggeredBatQuaiShield phải đặt thành true');
  assertEqual(turn2.actualDamageReceived, 0, 'Sát thương đòn đánh chí tử phải bị triệt tiêu hoàn toàn (= 0)');
  assertEqual(turn2.batQuaiShieldGained, 2000, 'Hộ thuẫn cấp tương đương 20% Max HP (2,000)');
  assertTrue(
    turn2.combatLogs.some(log => log.includes('【Bát Quái Hộ Thân Trận】 trên thân binh bừng sáng, chặn đứng đòn đánh chí mạng')),
    'Combat log phải có thông báo Bát Quái Hộ Thân Trận'
  );
  console.log('  ✓ Bát Quái Hộ Thân Trận: Triệt tiêu hoàn toàn đòn đánh chí mạng và tạo khiên 20% Max HP khi máu < 30%');

  // Case 3.4: Khiên chỉ kích hoạt tối đa 1 lần/trận (không kích hoạt lại lượt kế tiếp)
  const turn3 = executeInscriptionCombatTurn({
    playerHp: 2000,
    playerMaxHp: 10000,
    playerAtk: 1000,
    equippedItems: [divineWeapon],
    hasTriggeredBatQuaiShield: true, // Đã kích hoạt ở hiệp trước
    targetHp: 14000,
    targetMaxHp: 20000,
    targetDef: 0,
    incomingBossDamage: 800,
    randomFn: () => 0.99
  });

  assertEqual(turn3.batQuaiShieldGained, 0, 'Không được cấp khiên lần thứ hai trong cùng 1 trận chiến');
  assertEqual(turn3.actualDamageReceived, 800, 'Sát thương đòn sau phải nhận bình thường');
  console.log('  ✓ Bát Quái Hộ Thân Trận: Khống chế nghiêm ngặt 1 lần/trận, không cộng dồn bất tử');
});

// ============================================================================
// TEST 8: React Hook Action Pipeline & Invariants (useFormationInscriptionActions)
// ============================================================================
runTestCase(8, 'React Hook Action Pipeline & Invariants (useFormationInscriptionActions)', () => {
  // Chuẩn bị Mock PlayerState
  const inventoryWeapon: Equipment = {
    id: 'inv_sword_01',
    name: 'Thanh Phong Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 1000,
    rarity: 'rare',
    grade: 'Trung Phẩm',
    level: 1,
    enhancement: 0,
    stats: { atk: 150, def: 50, speed: 20 },
    hpBonus: 500,
    mpBonus: 200,
    inscriptionData: {
      maxConduits: 2,
      totalSlots: 2,
      unlockedSlots: 2,
      inscribedCount: 0,
      conduits: [
        { slotIndex: 0, isUnlocked: true, inscribedFormationId: null, currentEffects: [] },
        { slotIndex: 1, isUnlocked: true, inscribedFormationId: null, currentEffects: [] }
      ]
    }
  };

  const equippedWeapon: Equipment = {
    id: 'equipped_spear_02',
    name: 'Bát Hoang Thần Thương',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 2500,
    rarity: 'epic',
    grade: 'Thượng Phẩm',
    level: 1,
    enhancement: 0,
    stats: { atk: 400, def: 120, speed: 45 },
    hpBonus: 1200,
    mpBonus: 400,
    inscriptionData: {
      maxConduits: 2,
      totalSlots: 2,
      unlockedSlots: 2,
      inscribedCount: 1,
      conduits: [
        {
          slotIndex: 0,
          isUnlocked: true,
          inscribedFormationId: 'bat_quai_ho_than',
          inscribedFormationName: 'Bát Quái Hộ Thân Trận',
          currentEffects: [
            {
              id: 'eff_bat_quai_ho_than_shield',
              name: 'Bát Quái Kim Cương Hộ Mệnh',
              triggerType: 'emergency_shield',
              thresholdHpPercent: 0.30,
              shieldHpPercent: 0.20,
              value: 0.20,
              description: 'Khi HP < 30% tạo khiên'
            }
          ]
        },
        { slotIndex: 1, isUnlocked: true, inscribedFormationId: null, currentEffects: [] }
      ]
    }
  };

  const mockPlayer: PlayerStats = {
    tuVi: 10000,
    canCot: 50,
    ngoTinh: 50,
    khiVan: 50,
    tamCanh: 50,
    linhThach: 100000,
    danhVong: 500,
    currentRealm: 3,
    thanThuc: 300, // Đủ để khắc tu_khi_tran (100) và phong_nhan_tran (250)
    inventory: {
      pills: [],
      herbs: [],
      ores: [],
      materials: [
        { id: 'linh_muc_ha_pham', name: 'Hạ Phẩm Linh Mực', quantity: 5 },
        { id: 'tran_sa_so_cap', name: 'Sơ Cấp Trận Sa', quantity: 6 }
      ],
      equipment: [inventoryWeapon]
    },
    equipment: {
      weapon: equippedWeapon
    },
    inscriptionState: {
      totalInscribedCount: 0,
      unlockedInscriptions: ['tu_khi_tran', 'phong_nhan_tran'],
      cleansingWaterCount: 5
    }
  };

  // 1. Kiểm thử findEquipmentInPlayer (Túi Đồ & Mặc Trên Người)
  const foundInInv = findEquipmentInPlayer(mockPlayer, 'inv_sword_01');
  assertTrue(foundInInv !== null, 'Phải tìm thấy trang bị trong túi đồ');
  assertEqual(foundInInv?.type, 'inventory', 'Loại vị trí phải là inventory');
  assertEqual(foundInInv?.equipment.name, 'Thanh Phong Kiếm', 'Tên trang bị phải khớp');

  const foundInEquip = findEquipmentInPlayer(mockPlayer, 'equipped_spear_02');
  assertTrue(foundInEquip !== null, 'Phải tìm thấy trang bị đang mặc trên người');
  assertEqual(foundInEquip?.type, 'equipment', 'Loại vị trí phải là equipment');
  assertEqual(foundInEquip?.key, 'weapon', 'Slot key phải là weapon');

  const notFound = findEquipmentInPlayer(mockPlayer, 'non_existent_id');
  assertEqual(notFound, null, 'ID không tồn tại phải trả về null');
  console.log('  ✓ findEquipmentInPlayer: Tìm chuẩn xác cả trang bị trong inventory và equipment');

  // 2. Kiểm thử updateEquipmentInPlayer bảo đảm tính bất biến (Immutable Deep Copy)
  const modifiedInvWeapon: Equipment = {
    ...inventoryWeapon,
    name: 'Thanh Phong Linh Kiếm'
  };
  const updatedPlayer1 = updateEquipmentInPlayer(mockPlayer, foundInInv!, modifiedInvWeapon);
  assertEqual(updatedPlayer1.inventory?.equipment?.[0]?.name, 'Thanh Phong Linh Kiếm', 'Tên trang bị trong inventory phải cập nhật');
  assertEqual(mockPlayer.inventory?.equipment?.[0]?.name, 'Thanh Phong Kiếm', 'Trạng thái người chơi ban đầu không bị mutate');

  const modifiedEquippedWeapon: Equipment = {
    ...equippedWeapon,
    name: 'Bát Hoang Cực Thần Thương'
  };
  const updatedPlayer2 = updateEquipmentInPlayer(mockPlayer, foundInEquip!, modifiedEquippedWeapon);
  assertEqual(updatedPlayer2.equipment?.weapon?.name, 'Bát Hoang Cực Thần Thương', 'Trang bị mặc trên người phải được cập nhật');
  assertEqual(mockPlayer.equipment?.weapon?.name, 'Bát Hoang Thần Thương', 'Trang bị ban đầu không bị mutate');
  console.log('  ✓ updateEquipmentInPlayer: Cập nhật bất biến, bảo toàn trạng thái nguyên bản 100%');

  // 3. Kiểm thử deductMaterialsFromPlayerInventory
  const reqMaterials = [
    { id: 'linh_muc_ha_pham', name: 'Hạ Phẩm Linh Mực', quantity: 2 },
    { id: 'tran_sa_so_cap', name: 'Sơ Cấp Trận Sa', quantity: 3 }
  ];
  const deductedInv = deductMaterialsFromPlayerInventory(mockPlayer.inventory, reqMaterials);
  const remainingInk = deductedInv.materials?.find((m: any) => m.id === 'linh_muc_ha_pham');
  const remainingSand = deductedInv.materials?.find((m: any) => m.id === 'tran_sa_so_cap');
  assertEqual(remainingInk?.quantity, 3, 'Linh mực còn lại phải là 5 - 2 = 3');
  assertEqual(remainingSand?.quantity, 3, 'Trận sa còn lại phải là 6 - 3 = 3');
  console.log('  ✓ deductMaterialsFromPlayerInventory: Khấu trừ nguyên liệu chính xác');

  // 4. Kiểm thử deductCleansingWater
  // 4.1: Ưu tiên trừ từ cleansingWaterCount
  const waterRes1 = deductCleansingWater(mockPlayer);
  assertTrue(!!waterRes1.success, 'Khấu trừ nước tẩy thành công khi cleansingWaterCount > 0');
  assertEqual(waterRes1.updatedPlayer.inscriptionState?.cleansingWaterCount, 4, 'cleansingWaterCount phải giảm từ 5 xuống 4');

  // 4.2: Khi cleansingWaterCount = 0 nhưng có item trong kho đồ
  const playerZeroWater: PlayerStats = {
    ...mockPlayer,
    inscriptionState: {
      ...mockPlayer.inscriptionState!,
      cleansingWaterCount: 0
    },
    inventory: {
      ...mockPlayer.inventory,
      pills: [],
      herbs: [],
      ores: [],
      materials: [
        { id: 'tay_than_thuy', name: 'Tẩy Thần Thủy', quantity: 2 }
      ]
    }
  };
  const waterRes2 = deductCleansingWater(playerZeroWater);
  assertTrue(!!waterRes2.success, 'Khấu trừ từ vật phẩm kho đồ thành công');
  const remainingWaterItem = waterRes2.updatedPlayer.inventory?.materials?.find((m: any) => m.id === 'tay_than_thuy');
  assertEqual(remainingWaterItem?.quantity, 1, 'Số lượng Tẩy Thần Thủy trong kho phải giảm từ 2 xuống 1');

  // 4.3: Hết sạch nước tẩy -> Thất bại
  const playerNoWater: PlayerStats = {
    ...mockPlayer,
    inscriptionState: {
      ...mockPlayer.inscriptionState!,
      cleansingWaterCount: 0
    },
    inventory: {
      ...mockPlayer.inventory,
      pills: [],
      herbs: [],
      ores: [],
      materials: []
    }
  };
  const waterRes3 = deductCleansingWater(playerNoWater);
  assertEqual(waterRes3.success, false, 'Không có nước tẩy phải trả về thất bại');
  assertTrue(!!waterRes3.error?.includes('Không đủ Tẩy Thần Thủy'), 'Thông báo lỗi phải nhắc đến thiếu Tẩy Thần Thủy');
  console.log('  ✓ deductCleansingWater: Ưu tiên điểm trực tiếp, fallback kho đồ, và guard chặn khi cạn kiệt');

  // 5. Kiểm thử Workflow Minh Khắc & Tẩy Luyện Hoàn Chỉnh
  // Khắc tu_khi_tran vào Thanh Phong Kiếm (slot 0)
  const formationTuKhi = FORMATION_INSCRIPTIONS_REGISTRY.tu_khi_tran;
  const targetSlotIndex = 0;

  // Cập nhật slot 0 với tu_khi_tran
  const inscribedMetadata = inscribeFormationToWeapon(
    inventoryWeapon.inscriptionData!,
    targetSlotIndex,
    formationTuKhi,
    Date.now()
  );
  assertEqual(inscribedMetadata.conduits[0].inscribedFormationId, 'tu_khi_tran', 'Slot 0 phải được khắc tu_khi_tran');
  assertEqual(inscribedMetadata.inscribedCount, 1, 'inscribedCount phải tăng lên 1');

  // Anti-Duplicate Guard: Khắc tiếp tu_khi_tran vào slot 1 phải bị chặn
  const antiDupVal = validateInscriptionRequirements(
    mockPlayer.thanThuc!,
    mockPlayer.inventory?.materials!,
    formationTuKhi,
    inscribedMetadata.conduits
  );
  assertEqual(antiDupVal.valid, false, 'Khắc trùng lặp trận văn phải bị từ chối');
  assertTrue(!!antiDupVal.reason?.includes('đã được minh khắc trên một mạch dẫn linh khác'), 'Lý do từ chối phải là chống trùng lặp');
  console.log('  ✓ Inscription Workflow & Anti-Dup Guard: Minh khắc và kiểm soát trùng lặp hoàn hảo');

  // Tẩy luyện slot 0
  const cleansedMetadata = cleanseWeaponConduit(inscribedMetadata, targetSlotIndex);
  assertEqual(cleansedMetadata.conduits[0].inscribedFormationId, null, 'Slot 0 sau khi tẩy phải rỗng');
  assertEqual(cleansedMetadata.conduits[0].currentEffects.length, 0, 'Hiệu ứng slot 0 sau khi tẩy phải trống');
  assertEqual(cleansedMetadata.inscribedCount, 0, 'inscribedCount phải giảm về 0');
  console.log('  ✓ Cleanse Workflow: Tẩy luyện trả về trạng thái nguyên bản thành công');

  // Tẩy luyện trang bị đang mặc trên người (Bát Hoang Thần Thương)
  const cleansedEquippedMeta = cleanseWeaponConduit(equippedWeapon.inscriptionData!, 0);
  assertEqual(cleansedEquippedMeta.conduits[0].inscribedFormationId, null, 'Trang bị mặc trên người sau khi tẩy slot 0 phải rỗng');
  console.log('  ✓ Cleanse Equipped Weapon: Tẩy luyện trang bị đang mặc trên người chính xác');
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n===============================================================');
console.log(`🎉 TEST SUMMARY: ${passedCount}/${TOTAL_TESTS} TESTS PASSED (100% SUCCESS)`);
console.log('   MÔ ĐUN MINH KHẮC TRẬN VĂN ĐÃ VƯỢT QUA TOÀN BỘ KIỂM THỬ TỰ ĐỘNG!');
console.log('===============================================================\n');
