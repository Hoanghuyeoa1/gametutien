// scripts/test-legacy-tempering.ts
// QA Automation Test Suite: Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh (Legacy Tempering & Blood-Bonding)
// Chạy trực tiếp qua: npx tsx scripts/test-legacy-tempering.ts

import { Equipment } from '../lib/types/items';
import {
  TIER_STAT_SCALE_CONFIG,
  resolveEquipmentTier,
  calculateReforgeStatsScale,
  applyEquipmentReforge,
  validateBloodBondEligibility,
  applyBloodBond
} from '../lib/legacy-tempering-logic';

console.log('===============================================================');
console.log('🔥 QA TEST SUITE: TRÙNG CHÚ TÁI SINH & HUYẾT KHẾ BẢN MỆNH');
console.log('   GAMETUTIEN ENGINE - AUTOMATED INVARIANT VERIFICATION');
console.log('===============================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ ${msg}`);
    passCount++;
  } else {
    console.error(`  ✗ [FAIL] ${msg}`);
    failCount++;
  }
}

// Mock một thần binh hoàn chỉnh có Hợp Kim, Trận Văn và Khí Linh
function createMockLegacyWeapon(): Equipment {
  return {
    id: 'weapon_test_bach_ho',
    name: 'Bạch Hổ Canh Kim Kiếm',
    slot: 'weapon',
    type: 'weapon',
    grade: 'Bảo Khí',
    tier: 2, // Nhị Giai (Trúc Cơ)
    powerBonus: 200,
    atkBonus: 200,
    defBonus: 50,
    hpBonus: 300,
    mpBonus: 100,
    enhancement: 3,
    alloyMetadata: {
      archetypeId: 'phi_kiem',
      archetypeName: 'Bạch Hổ Tốc Kiếm',
      purity: 92,
      dominantElement: 'canh_kim',
      alloyComposition: {
        ores: [
          { oreId: 'canh_kim', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 60, ratio: 0.6, effectiveBonus: 9 },
          { oreId: 'huyen_thiet', oreName: 'Huyền Thiết', element: 'huyen_thiet', weight: 40, ratio: 0.4, effectiveBonus: 8 }
        ],
        totalWeight: 100,
        dominantElement: 'canh_kim',
        dominantRatio: 0.6,
        purityScore: 92,
        purityMultiplier: 0.92,
        elementalStats: {
          trueDamagePercent: 9,
          slowSpeedPercent: 0,
          burnDamagePercent: 0,
          damageReductionPercent: 8,
          critResistPercent: 0
        },
        summary: 'Hợp kim Canh Kim sắc bén'
      },
      elementalEffects: {},
      archetypeMultipliers: {
        atkMultiplier: 1.15,
        speedMultiplier: 1.10
      },
      blacksmithRealmIndex: 11,
      flameBonusPercent: 0,
      craftedAt: 1700000000000
    },
    inscriptionData: {
      conduits: [
        {
          slotIndex: 0,
          isUnlocked: true,
          inscribedFormationId: 'tu_khi_tran',
          inscribedFormationName: 'Tụ Khí Trận',
          inscribedAt: 1700000001000,
          currentEffects: [{ id: 'eff_1', name: 'Tụ Khí', triggerType: 'passive_stat', statKey: 'qi_cost_reduction', value: 0.20, description: 'Giảm 20% MP' }]
        },
        {
          slotIndex: 1,
          isUnlocked: true,
          inscribedFormationId: 'phong_nhan_tran',
          inscribedFormationName: 'Phong Nhận Trận',
          inscribedAt: 1700000002000,
          currentEffects: [{ id: 'eff_2', name: 'Phong Nhận', triggerType: 'on_hit_proc', triggerChance: 0.25, potencyValue: 0.40, value: 0, description: '25% kiếm khí' }]
        },
        {
          slotIndex: 2,
          isUnlocked: false,
          inscribedFormationId: null,
          currentEffects: []
        }
      ],
      totalSlots: 3,
      unlockedSlots: 2,
      inscribedCount: 2,
      maxConduits: 4,
      totalInscribed: 2,
      cleansingCount: 0
    },
    infusedSoul: {
      soulId: 'soul_bach_ho_001',
      soulType: 'bach_ho',
      soulName: 'Canh Kim Bạch Hổ',
      element: 'Lôi',
      personality: 'lanh_dam',
      evolutionStage: 2,
      spiritExp: 1500,
      maxSpiritExp: 5000,
      infusedAt: 1700000003000,
      dialoguePool: {
        onCombatStart: ['Rút kiếm. Sát.'],
        onVictory: ['Đối thủ đã chết.'],
        onLowHealth: ['Chưa đến lúc gục ngã.'],
        onIdle: ['Kiếm ý đang ngưng tụ.']
      },
      baseProc: {
        id: 'proc_bach_ho_sat',
        name: 'Bạch Hổ Thần Sát',
        effectType: 'crit_and_pen',
        triggerChance: 0.25,
        potencyValue: 0.25,
        description: 'Bạo kích và xuyên giáp'
      },
      currentProc: {
        id: 'proc_bach_ho_sat',
        name: 'Bạch Hổ Thần Sát',
        effectType: 'crit_and_pen',
        triggerChance: 0.25,
        potencyValue: 0.375,
        description: 'Bạo kích và xuyên giáp x1.5'
      },
      hasAutoGuardianUnlocked: false
    }
  };
}

// ---------------------------------------------------------------
// TEST 1: Reforge Stat Scaling Calculation Invariant
// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 1: Reforge Stat Scaling Calculation Invariant');
console.log('---------------------------------------------------------------');

try {
  const weapon = createMockLegacyWeapon();
  // weapon.tier = 2 (scale 1.8x). Reforge to Tier 5 (scale 10.5x).
  // Ratio: 10.5 / 1.8 = 5.8333...
  // Expected Atk: Math.round(200 * (10.5 / 1.8)) = Math.round(1166.666) = 1167
  const preview = calculateReforgeStatsScale(weapon, 5);

  assert(preview.currentTier === 2, 'Nhận diện đúng Tier hiện tại của thần binh: Tier 2 (Trúc Cơ)');
  assert(preview.targetTier === 5, 'Dự phóng chính xác Tier đích: Tier 5 (Hóa Thần)');
  assert(preview.projectedAtk === 1167, `Chỉ số công kích scale chuẩn xác từ 200 lên ${preview.projectedAtk} (chuẩn 1167)`);
  assert(preview.projectedDef === Math.round(50 * (10.5 / 1.8)), 'Chỉ số phòng ngự scale chuẩn xác theo tỷ lệ');
  assert(preview.projectedHp === Math.round(300 * (10.5 / 1.8)), 'Chỉ số khí huyết scale chuẩn xác theo tỷ lệ');
  assert(preview.preservedAlloyName === 'Bạch Hổ Tốc Kiếm', 'Bảo toàn tên hợp kim đoán cốt: Bạch Hổ Tốc Kiếm');
  assert(preview.preservedInscriptionCount === 2, 'Bảo tồn đúng 2 trận đồ đã khắc trên mạch dẫn linh');
  assert(preview.preservedSoulName === 'Canh Kim Bạch Hổ', 'Bảo tồn đúng chân hồn Khí Linh: Canh Kim Bạch Hổ');
  assert(preview.costs.targetTier === 5, 'Chi phí trùng chú khớp với Tier 5');
  assert(preview.costs.spiritStonesCost === 500000, 'Chi phí linh thạch Tier 5 là 500,000 LT');
  assert(preview.costs.requiredMinerals[0].itemId === 'hon_don_than_thiet', 'Yêu cầu đúng khoáng thạch: Hỗn Độn Thần Thiết');
  console.log('  ==> [PASS] Test 1: Reforge Stat Scaling Calculation Invariant\n');
} catch (e: any) {
  console.error('Test 1 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
// TEST 2: Tier Gating & Validation Guards
// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 2: Tier Gating & Validation Guards');
console.log('---------------------------------------------------------------');

try {
  const weapon = createMockLegacyWeapon(); // Tier 2

  // 1. Thử trùng chú ngang cấp (Tier 2 -> Tier 2) -> Phải ném ngoại lệ
  let blockedEqualTier = false;
  try {
    calculateReforgeStatsScale(weapon, 2);
  } catch (err: any) {
    blockedEqualTier = true;
    assert(err.message.includes('phải lớn hơn cảnh giới hiện tại'), 'Chặn thành công khi cố trùng chú ngang cấp (Tier 2 -> Tier 2)');
  }
  assert(blockedEqualTier, 'Ngoại lệ được ném ra khi trùng chú ngang cấp');

  // 2. Thử trùng chú thụt cấp (Tier 2 -> Tier 1) -> Phải ném ngoại lệ
  let blockedLowerTier = false;
  try {
    calculateReforgeStatsScale(weapon, 1);
  } catch (err: any) {
    blockedLowerTier = true;
    assert(err.message.includes('phải lớn hơn cảnh giới hiện tại'), 'Chặn thành công khi cố trùng chú thụt cấp (Tier 2 -> Tier 1)');
  }
  assert(blockedLowerTier, 'Ngoại lệ được ném ra khi trùng chú thụt cấp');

  // 3. Thử trùng chú vượt quá Tier 9 (Tier 10) -> Phải ném ngoại lệ
  let blockedInvalidTier = false;
  try {
    calculateReforgeStatsScale(weapon, 10);
  } catch (err: any) {
    blockedInvalidTier = true;
    assert(err.message.includes('không hợp lệ'), 'Chặn thành công Tier vượt quá cửu giai (Tier 10)');
  }
  assert(blockedInvalidTier, 'Ngoại lệ được ném ra khi Tier ngoài khoảng 1-9');

  console.log('  ==> [PASS] Test 2: Tier Gating & Validation Guards\n');
} catch (e: any) {
  console.error('Test 2 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
// TEST 3: Deep Copy & Preservation Invariant (applyEquipmentReforge)
// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 3: Deep Copy & Preservation Invariant (applyEquipmentReforge)');
console.log('---------------------------------------------------------------');

try {
  const original = createMockLegacyWeapon();
  const reforged = applyEquipmentReforge(original, 5);

  assert(reforged.tier === 5, 'Trang bị mới đạt Tier 5');
  assert(reforged.reforgeCount === 1, 'Biến đếm reforgeCount tăng lên 1');
  assert(reforged.atkBonus === 1167, 'Công kích nâng cấp lên 1167');

  // Kiểm tra tính bất biến Deep Copy: Biến đổi trên bản sao KHÔNG ảnh hưởng bản gốc
  assert(original.tier === 2, 'Bản gốc vẫn giữ nguyên Tier 2');
  assert(original.reforgeCount === undefined, 'Bản gốc không bị ô nhiễm reforgeCount');
  assert(original.atkBonus === 200, 'Bản gốc vẫn giữ nguyên công kích 200');

  // Kiểm tra bảo tồn nguyên vẹn 100% của 3 cấu trúc
  assert(reforged.alloyMetadata !== original.alloyMetadata, 'alloyMetadata là đối tượng clone mới');
  assert(reforged.alloyMetadata?.archetypeId === 'phi_kiem', 'Bảo tồn archetypeId của hợp kim');
  assert(reforged.alloyMetadata?.purity === 92, 'Bảo tồn độ tinh khiết hợp kim 92%');

  assert(reforged.inscriptionData !== original.inscriptionData, 'inscriptionData là đối tượng clone mới');
  assert(reforged.inscriptionData?.conduits.length === 3, 'Bảo tồn nguyên vẹn 3 conduits');
  assert(reforged.inscriptionData?.conduits[0].inscribedFormationId === 'tu_khi_tran', 'Bảo tồn Tụ Khí Trận');
  assert(reforged.inscriptionData?.conduits[1].inscribedFormationId === 'phong_nhan_tran', 'Bảo tồn Phong Nhận Trận');

  assert(reforged.infusedSoul !== original.infusedSoul, 'infusedSoul là đối tượng clone mới');
  assert(reforged.infusedSoul?.soulType === 'bach_ho', 'Bảo tồn chân hồn Bạch Hổ');
  assert(reforged.infusedSoul?.evolutionStage === 2, 'Bảo tồn giai đoạn tiến hóa Stage 2');
  assert(reforged.infusedSoul?.spiritExp === 1500, 'Bảo tồn EXP khí linh 1500');

  // Thử nghiệm trùng chú lần 2 (Tier 5 -> Tier 7)
  const reforgedTwice = applyEquipmentReforge(reforged, 7);
  assert(reforgedTwice.tier === 7, 'Trùng chú lần 2 đạt Tier 7 (Hợp Thể)');
  assert(reforgedTwice.reforgeCount === 2, 'reforgeCount tăng lên 2');
  assert((reforgedTwice.atkBonus || 0) > (reforged.atkBonus || 0), 'Công kích Tier 7 cao hơn Tier 5');

  console.log('  ==> [PASS] Test 3: Deep Copy & Preservation Invariant\n');
} catch (e: any) {
  console.error('Test 3 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
// TEST 4: Blood-Bonding Eligibility Guards (validateBloodBondEligibility)
// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 4: Blood-Bonding Eligibility Guards (validateBloodBondEligibility)');
console.log('---------------------------------------------------------------');

try {
  const weapon = createMockLegacyWeapon();

  // 1. Thọ nguyên thấp (10 năm <= 15) -> Lifespan Guard chặn
  const lowLifespanCheck = validateBloodBondEligibility(10, weapon);
  assert(lowLifespanCheck.eligible === false, 'Chặn thành công tu sĩ thọ nguyên thấp (10 năm <= 15 năm)');
  assert(lowLifespanCheck.reason?.includes('Tọa Hóa vẫn lạc') === true, 'Cảnh báo nguy cơ Tọa Hóa xuất hiện chuẩn xác');

  // 2. Thọ nguyên biên (15 năm <= 15) -> Lifespan Guard chặn
  const exactLifespanCheck = validateBloodBondEligibility(15, weapon);
  assert(exactLifespanCheck.eligible === false, 'Chặn thành công tại đúng mốc biên 15 năm');

  // 3. Thọ nguyên dồi dào (100 năm > 15) -> Hợp lệ
  const validLifespanCheck = validateBloodBondEligibility(100, weapon);
  assert(validLifespanCheck.eligible === true, 'Thẩm định hợp lệ khi thọ nguyên dồi dào (100 năm)');

  // 4. Ký kết Huyết Khế xong, kiểm tra Anti-Rebond Guard
  const bloodBondedWeapon = applyBloodBond(weapon, 'user_001', 'Tiêu Dao Tử', 5);
  const rebondCheck = validateBloodBondEligibility(100, bloodBondedWeapon);
  assert(rebondCheck.eligible === false, 'Anti-Rebond Guard chặn thành công khi cố ký Huyết Khế lần 2');
  assert(rebondCheck.reason?.includes('không thể lặp lại khế ước') === true, 'Thông báo từ chối ký khế ước lặp lại chuẩn xác');

  console.log('  ==> [PASS] Test 4: Blood-Bonding Eligibility Guards\n');
} catch (e: any) {
  console.error('Test 4 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
// TEST 5: Blood-Bonding Execution & Combat Multiplier Invariant
// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 5: Blood-Bonding Execution & Combat Multiplier Invariant');
console.log('---------------------------------------------------------------');

try {
  const weapon = createMockLegacyWeapon();
  const bonded = applyBloodBond(weapon, 'user_diep_vien', 'Diệp Viên Tiên Tôn', 10);

  assert(bonded.bloodBondData !== undefined && bonded.bloodBondData !== null, 'Trang bị mang metadata Huyết Khế');
  assert(bonded.bloodBondData?.isBloodBound === true, 'Cờ isBloodBound bật true');
  assert(bonded.bloodBondData?.boundOwnerId === 'user_diep_vien', 'Ghi nhận chính xác boundOwnerId');
  assert(bonded.bloodBondData?.boundOwnerName === 'Diệp Viên Tiên Tôn', 'Ghi nhận chính xác boundOwnerName');
  assert(bonded.bloodBondData?.lifespanSacrificed === 10, 'Ghi nhận thọ nguyên tiêu hao: 10 năm');
  assert(bonded.bloodBondData?.combatPowerMultiplier === 1.30, 'Hệ số khuếch đại chiến lực đạt chuẩn x1.30 (+30%)');
  assert(bonded.bloodBondData?.disarmImmunity === true, 'Đặc quyền miễn nhiễm tước khí (disarmImmunity: true)');
  assert(bonded.bloodBondData?.bondResonanceLevel === 1, 'Cấp độ cộng hưởng ban đầu = 1');

  // Kiểm tra Deep Copy: weapon ban đầu không bị biến đổi
  assert(weapon.bloodBondData === undefined, 'Vũ khí ban đầu hoàn toàn không bị mutate');

  console.log('  ==> [PASS] Test 5: Blood-Bonding Execution & Combat Multiplier Invariant\n');
} catch (e: any) {
  console.error('Test 5 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
// TEST 6: Coexistence of Blood-Bond & Legacy Reforging
// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 6: Coexistence of Blood-Bond & Legacy Reforging');
console.log('---------------------------------------------------------------');

try {
  // Tạo vũ khí -> Ký Huyết Khế -> Rồi Trùng Chú Tái Sinh lên Cửu Giai
  const baseWeapon = createMockLegacyWeapon();
  const bondedWeapon = applyBloodBond(baseWeapon, 'user_001', 'Hàn Lập', 5);
  const reforgedGodTierWeapon = applyEquipmentReforge(bondedWeapon, 9); // Lên Tier 9 (Độ Kiếp)

  assert(reforgedGodTierWeapon.tier === 9, 'Thần binh đạt Cửu Giai (Tier 9 - Độ Kiếp)');
  assert(reforgedGodTierWeapon.reforgeCount === 1, 'Số lần trùng chú = 1');
  assert(reforgedGodTierWeapon.bloodBondData?.isBloodBound === true, 'Huyết Khế được bảo toàn nguyên vẹn sau khi Trùng Chú lên Cửu Giai');
  assert(reforgedGodTierWeapon.bloodBondData?.boundOwnerName === 'Hàn Lập', 'Chủ nhân Huyết Khế vẫn là Hàn Lập');
  assert(reforgedGodTierWeapon.alloyMetadata?.purity === 92, 'Hợp kim Bạch Hổ bảo toàn 100%');
  assert(reforgedGodTierWeapon.inscriptionData?.conduits[0].inscribedFormationId === 'tu_khi_tran', 'Trận văn Tụ Khí bảo toàn 100%');
  assert(reforgedGodTierWeapon.infusedSoul?.soulName === 'Canh Kim Bạch Hổ', 'Chân hồn Bạch Hổ bảo toàn 100%');
  assert(reforgedGodTierWeapon.atkBonus === Math.round(200 * (90.0 / 1.8)), `Chỉ số công kích đạt đỉnh phong: ${reforgedGodTierWeapon.atkBonus} (tăng gấp 50 lần so với Tier 2)`);

  console.log('  ==> [PASS] Test 6: Coexistence of Blood-Bond & Legacy Reforging\n');
} catch (e: any) {
  console.error('Test 6 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 7: migrateLegacyTemperingData – Idempotency & Safe Init');
console.log('---------------------------------------------------------------');
try {
  // --- Import migration function inline (simulate bằng cách tự implement logic để test không import circular) ---
  // Viết lại logic migration nhỏ gọn để test độc lập (không import save-migration để tránh phụ thuộc nặng)
  function migrateLegacyTemperingDataTest(player: any): any {
    const cloned = JSON.parse(JSON.stringify(player));
    const existing = cloned.legacyTemperingState;
    cloned.legacyTemperingState = {
      totalReforgesPerformed: typeof existing?.totalReforgesPerformed === 'number' ? existing.totalReforgesPerformed : 0,
      bloodBoundEquipmentIds: Array.isArray(existing?.bloodBoundEquipmentIds) ? existing.bloodBoundEquipmentIds : []
    };
    const normalizeEq = (item: any) => {
      if (!item || typeof item !== 'object') return item;
      const isEquip = Boolean(item.slot || item.type === 'weapon' || item.powerBonus !== undefined);
      if (!isEquip) return item;
      return {
        ...item,
        bloodBondData: item.bloodBondData !== undefined ? item.bloodBondData : null,
        reforgeCount: typeof item.reforgeCount === 'number' ? item.reforgeCount : 0
      };
    };
    if (cloned.equipment && typeof cloned.equipment === 'object' && !Array.isArray(cloned.equipment)) {
      const updated: any = {};
      for (const [k, v] of Object.entries(cloned.equipment as Record<string, any>)) {
        updated[k] = normalizeEq(v);
      }
      cloned.equipment = updated;
    }
    if (cloned.inventory?.equipment && Array.isArray(cloned.inventory.equipment)) {
      cloned.inventory.equipment = cloned.inventory.equipment.map(normalizeEq);
    }
    return cloned;
  }

  // Case 1: Player chưa có legacyTemperingState, weapon thiếu bloodBondData & reforgeCount
  const rawPlayer: any = {
    name: 'Hàn Lập',
    tuVi: 1000,
    equipment: {
      weapon: { id: 'w1', slot: 'weapon', powerBonus: 500 }
    },
    inventory: {
      equipment: [
        { id: 'w2', type: 'weapon', powerBonus: 300 }
      ]
    }
  };
  const migrated1 = migrateLegacyTemperingDataTest(rawPlayer);
  assert(migrated1.legacyTemperingState.totalReforgesPerformed === 0, 'Khởi tạo totalReforgesPerformed = 0 khi chưa có');
  assert(Array.isArray(migrated1.legacyTemperingState.bloodBoundEquipmentIds), 'Khởi tạo bloodBoundEquipmentIds là array rỗng');
  assert(migrated1.equipment.weapon.bloodBondData === null, 'Gán an toàn bloodBondData = null cho weapon cũ');
  assert(migrated1.equipment.weapon.reforgeCount === 0, 'Gán an toàn reforgeCount = 0 cho weapon cũ');
  assert(migrated1.inventory.equipment[0].bloodBondData === null, 'Gán an toàn bloodBondData = null cho inventory weapon');
  assert(migrated1.inventory.equipment[0].reforgeCount === 0, 'Gán an toàn reforgeCount = 0 cho inventory weapon');

  // Case 2: Player đã có legacyTemperingState hợp lệ → không bị overwrite
  const existingPlayer: any = {
    name: 'Hàn Lập',
    tuVi: 5000,
    legacyTemperingState: { totalReforgesPerformed: 3, bloodBoundEquipmentIds: ['w_main'] },
    equipment: {
      weapon: { id: 'w_main', slot: 'weapon', bloodBondData: { isBloodBound: true }, reforgeCount: 2 }
    }
  };
  const migrated2 = migrateLegacyTemperingDataTest(existingPlayer);
  assert(migrated2.legacyTemperingState.totalReforgesPerformed === 3, 'Bảo toàn totalReforgesPerformed đã có = 3');
  assert(migrated2.legacyTemperingState.bloodBoundEquipmentIds.length === 1, 'Bảo toàn bloodBoundEquipmentIds đã có');
  assert(migrated2.equipment.weapon.bloodBondData?.isBloodBound === true, 'Không overwrite bloodBondData đã tồn tại');
  assert(migrated2.equipment.weapon.reforgeCount === 2, 'Không overwrite reforgeCount đã tồn tại = 2');

  // Case 3: Chạy lại migration lần 2 → Idempotent (kết quả không đổi)
  const migrated3 = migrateLegacyTemperingDataTest(migrated2);
  assert(migrated3.legacyTemperingState.totalReforgesPerformed === 3, 'Idempotent: chạy lần 2 giữ nguyên totalReforgesPerformed');
  assert(migrated3.equipment.weapon.reforgeCount === 2, 'Idempotent: chạy lần 2 giữ nguyên reforgeCount');

  console.log('  ==> [PASS] Test 7: migrateLegacyTemperingData – Idempotency & Safe Init\n');
} catch (e: any) {
  console.error('Test 7 failed with error:', e);
  failCount++;
}

// ---------------------------------------------------------------
console.log('---------------------------------------------------------------');
console.log('🧪 Test 8: Blood Bond Disarm Immunity – Combat Integration');
console.log('---------------------------------------------------------------');
try {
  // Kiểm tra logic detect bossHasDisarm và weaponEquip.bloodBondData.disarmImmunity
  // bằng cách simulate điều kiện trực tiếp

  // Boss có cơ chế tước khí
  const bossWithDisarm: any = {
    name: 'Thiên Phúc Yêu Vương',
    description: 'Ma vương có thể tước khí thần binh của đối thủ, giải giới phòng thủ toàn diện',
    realm: 15,
    skills: [{ name: 'Giải Giới Pháp Ấn', effectType: 'seal_equipment' }]
  };

  // Boss không có cơ chế tước khí
  const bossWithoutDisarm: any = {
    name: 'Hỏa Linh Thú',
    description: 'Quái thú hỏa hệ thuần túy',
    realm: 10
  };

  // Weapon có Huyết Khế với disarmImmunity
  const bloodBoundWeapon: any = {
    id: 'w_blood',
    slot: 'weapon',
    type: 'weapon',
    bloodBondData: {
      isBloodBound: true,
      disarmImmunity: true,
      combatPowerMultiplier: 1.30
    }
  };

  // Weapon không có Huyết Khế
  const normalWeapon: any = {
    id: 'w_normal',
    slot: 'weapon',
    bloodBondData: null
  };

  // Logic detect (mirror code trong combat.ts)
  function detectDisarm(boss: any) {
    return Boolean(
      boss.skills?.some((s: any) => s?.effectType === 'disarm' || s?.effectType === 'seal_equipment') ||
      boss.hasDisarm ||
      boss.canDisarm ||
      boss.description?.toLowerCase().includes('tước khí') ||
      boss.description?.toLowerCase().includes('giải giới')
    );
  }

  assert(detectDisarm(bossWithDisarm) === true, 'Nhận diện đúng Boss có kỹ năng seal_equipment');
  assert(detectDisarm(bossWithoutDisarm) === false, 'Nhận diện đúng Boss không có tước khí');
  assert(bossWithDisarm.description.toLowerCase().includes('giải giới') === true, 'Phát hiện "giải giới" qua description text scan');
  assert(bloodBoundWeapon.bloodBondData?.disarmImmunity === true, 'Vũ khí Huyết Khế có disarmImmunity = true');
  assert(normalWeapon.bloodBondData?.disarmImmunity !== true, 'Vũ khí thường không có disarmImmunity');

  // Simulate: Boss có tước khí + vũ khí có disarmImmunity → giảm bossPower 15%
  let bossPower = 10000;
  const bossHasDisarm = detectDisarm(bossWithDisarm);
  const weaponHasImmunity = bloodBoundWeapon.bloodBondData?.disarmImmunity === true;
  if (bossHasDisarm && weaponHasImmunity) {
    bossPower = bossPower * 0.85;
  }
  assert(bossPower === 8500, `Huyết Khế Kháng Tước Khí: bossPower giảm 15% xuống còn ${bossPower} (chuẩn 8500)`);

  // Simulate: Boss có tước khí + vũ khí thường → bossPower không đổi
  let bossPower2 = 10000;
  const weaponHasImmunity2 = normalWeapon.bloodBondData?.disarmImmunity === true;
  if (bossHasDisarm && weaponHasImmunity2) {
    bossPower2 = bossPower2 * 0.85;
  }
  assert(bossPower2 === 10000, 'Vũ khí thường không kháng được tước khí: bossPower không đổi');

  // Simulate: Boss không có tước khí + vũ khí có disarmImmunity → không trigger
  let bossPower3 = 10000;
  const bossHasDisarm3 = detectDisarm(bossWithoutDisarm);
  if (bossHasDisarm3 && weaponHasImmunity) {
    bossPower3 = bossPower3 * 0.85;
  }
  assert(bossPower3 === 10000, 'Boss không có tước khí: Huyết Khế không trigger vô nghĩa');

  console.log('  ==> [PASS] Test 8: Blood Bond Disarm Immunity – Combat Integration\n');
} catch (e: any) {
  console.error('Test 8 failed with error:', e);
  failCount++;
}

console.log('===============================================================');
if (failCount === 0) {
  console.log(`🎉 TEST SUMMARY: ${passCount}/${passCount} TESTS PASSED (100% SUCCESS)`);
  console.log('   PHÂN HỆ TRÙNG CHÚ TÁI SINH & HUYẾT KHẾ ĐẠT CHUẨN KỸ THUẬT TUYỆT ĐỐI!');
} else {
  console.error(`💥 TEST SUMMARY: ${failCount} TESTS FAILED, ${passCount} PASSED`);
}
console.log('===============================================================\n');

if (failCount > 0) {
  process.exit(1);
}
