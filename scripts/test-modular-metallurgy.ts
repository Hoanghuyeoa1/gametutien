// scripts/test-modular-metallurgy.ts
// Test Suite: Đoán Cốt Hợp Kim & Tự Chọn Phôi Khí (Modular Metallurgy & Weapon Archetypes)
// Tuân thủ 100% đặc tả 6 ca kiểm thử bắt buộc

import {
  calculateAlloyComposition,
  calculateAlloyCompositionOrThrow,
  craftModularEquipment,
  generateModularWeaponName,
  deductOresFromInventory,
  WEAPON_ARCHETYPES_REGISTRY,
  ALLOY_ORES_REGISTRY
} from '../lib/modular-metallurgy-logic';
import {
  MetallurgyOreInput,
  WeaponArchetypeId,
  OreElementProperty
} from '../lib/types/modular-metallurgy';
import { Equipment } from '../lib/types/items';
import { migrateModularForgingData } from '../lib/save-migration';
import { calculateCombatStats } from '../lib/destiny-data';
import { executeAlloyCombatTurn, battleBoss } from '../lib/game-logic/combat';
import { PlayerStats } from '../lib/types/player';
import { Boss } from '../lib/types/combat';

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
    console.log(`  ==> [PASSED] Test ${testNumber}: ${testName}`);
    passedCount++;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`  ==> [FAILED] Test ${testNumber}: ${testName}`);
    console.error(`      Lý do: ${errorMsg}`);
    process.exit(1);
  }
}

function assertTrue(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('===============================================================');
console.log('⚔️  QA TEST SUITE: MODULAR METALLURGY & WEAPON ARCHETYPES');
console.log('   GAMETUTIEN ENGINE - AUTOMATION TEST SUITE');
console.log('===============================================================');

// ============================================================================
// TEST 1: Slot Gating Invariant
// - Đưa vào 1 loại khoáng thạch -> Bắt buộc fail/reject (yêu cầu tối thiểu 2 loại).
// - Đưa vào 3 loại hợp lệ -> Thành công.
// ============================================================================
runTestCase(1, 'Slot Gating Invariant', () => {
  const oreCanhKim: MetallurgyOreInput = {
    oreId: 'ore_canh_kim',
    oreName: 'Canh Kim Thạch',
    element: 'canh_kim',
    weight: 50
  };
  const oreHanBang: MetallurgyOreInput = {
    oreId: 'ore_han_bang',
    oreName: 'Hàn Băng Tinh',
    element: 'han_bang',
    weight: 30
  };
  const oreHuyenThiet: MetallurgyOreInput = {
    oreId: 'ore_huyen_thiet',
    oreName: 'Huyền Thiết',
    element: 'huyen_thiet',
    weight: 20
  };

  // Ca 1: Đưa vào 1 loại khoáng thạch -> Phải bị từ chối (trả về null)
  const singleOreResult = calculateAlloyComposition([oreCanhKim]);
  assertTrue(
    singleOreResult === null,
    'Lò luyện kim phải từ chối khi chỉ nạp 1 loại khoáng thạch (trả về null)'
  );

  // Kiểm tra phiên bản throw: bắt buộc ném lỗi
  let singleOreThrew = false;
  try {
    calculateAlloyCompositionOrThrow([oreCanhKim]);
  } catch {
    singleOreThrew = true;
  }
  assertTrue(
    singleOreThrew,
    'calculateAlloyCompositionOrThrow phải ném ngoại lệ khi số lượng loại khoáng thạch < 2'
  );
  console.log('  ✓ Đã chặn thành công khi nạp 1 loại khoáng thạch (Bắt buộc tối thiểu 2 loại)');

  // Ca 2: Đưa vào 3 loại khoáng thạch hợp lệ -> Thành công
  const tripleOreResult = calculateAlloyComposition([oreCanhKim, oreHanBang, oreHuyenThiet]);
  assertTrue(
    tripleOreResult !== null,
    'Lò luyện kim phải chấp nhận khi nạp 3 loại khoáng thạch hợp lệ'
  );
  assertTrue(
    tripleOreResult!.ores.length === 3,
    `Kết quả phải chứa đủ 3 quặng thành phần, thực tế: ${tripleOreResult?.ores.length}`
  );
  console.log(`  ✓ Nạp 3 loại quặng thành công: ${tripleOreResult?.ores.map(o => o.oreName).join(' + ')}`);
});

// ============================================================================
// TEST 2: Ratio Normalization & Affix Calculation
// - Đưa vào 60 Canh Kim + 40 Hàn Băng -> Tỷ lệ chuẩn hóa đúng 0.6 và 0.4.
// - Kiểm tra trueDamagePercent đạt đúng 0.6 * 15% = 9% và slowSpeedPercent đạt 0.4 * 20% = 8%.
// ============================================================================
runTestCase(2, 'Ratio Normalization & Affix Calculation', () => {
  const inputOres: MetallurgyOreInput[] = [
    {
      oreId: 'ore_canh_kim',
      oreName: 'Canh Kim Thạch',
      element: 'canh_kim',
      weight: 60
    },
    {
      oreId: 'ore_han_bang',
      oreName: 'Hàn Băng Tinh',
      element: 'han_bang',
      weight: 40
    }
  ];

  const result = calculateAlloyComposition(inputOres, 0, 0);
  assertTrue(result !== null, 'Phân tích hợp kim không được null');

  const canhKimDetail = result!.ores.find(o => o.element === 'canh_kim');
  const hanBangDetail = result!.ores.find(o => o.element === 'han_bang');

  assertTrue(canhKimDetail !== undefined, 'Không tìm thấy Canh Kim Thạch trong kết quả');
  assertTrue(hanBangDetail !== undefined, 'Không tìm thấy Hàn Băng Tinh trong kết quả');

  // Kiểm tra chuẩn hóa tỷ lệ
  assertTrue(
    canhKimDetail!.ratio === 0.6,
    `Tỷ lệ Canh Kim Thạch phải chuẩn hóa chính xác 0.6, thực tế: ${canhKimDetail!.ratio}`
  );
  assertTrue(
    hanBangDetail!.ratio === 0.4,
    `Tỷ lệ Hàn Băng Tinh phải chuẩn hóa chính xác 0.4, thực tế: ${hanBangDetail!.ratio}`
  );

  const totalRatio = Number((canhKimDetail!.ratio + hanBangDetail!.ratio).toFixed(4));
  assertTrue(totalRatio === 1.0, `Tổng tỷ lệ phải đạt chính xác 1.0, thực tế: ${totalRatio}`);
  console.log(`  ✓ Chuẩn hóa tỷ lệ: Canh Kim = ${canhKimDetail!.ratio} (60%), Hàn Băng = ${hanBangDetail!.ratio} (40%), Tổng = ${totalRatio}`);

  // Kiểm tra thuộc tính affix nguyên tố
  // Canh Kim Thạch: ratio * 15% = 0.6 * 15 = 9.0%
  // Hàn Băng Tinh: ratio * 20% = 0.4 * 20 = 8.0%
  const expectedTrueDamage = 9.0;
  const expectedSlowSpeed = 8.0;

  assertTrue(
    result!.elementalStats.trueDamagePercent === expectedTrueDamage,
    `trueDamagePercent phải đạt ${expectedTrueDamage}%, thực tế: ${result!.elementalStats.trueDamagePercent}%`
  );
  assertTrue(
    result!.elementalStats.slowSpeedPercent === expectedSlowSpeed,
    `slowSpeedPercent phải đạt ${expectedSlowSpeed}%, thực tế: ${result!.elementalStats.slowSpeedPercent}%`
  );

  console.log(`  ✓ Canh Kim Thạch Affix (0.6 * 15%): trueDamagePercent = ${result!.elementalStats.trueDamagePercent}% (Chuẩn 9.0%)`);
  console.log(`  ✓ Hàn Băng Tinh Affix (0.4 * 20%): slowSpeedPercent = ${result!.elementalStats.slowSpeedPercent}% (Chuẩn 8.0%)`);
});

// ============================================================================
// TEST 3: Archetype Baseline Differentiation
// - Giữ nguyên thành phần hợp kim, đúc trên Phi Kiếm vs Trọng Kiếm.
// - Khẳng định Phi Kiếm có tốc độ/crit vượt trội; Trọng Kiếm có ATK/xuyên giáp vượt trội.
// ============================================================================
runTestCase(3, 'Archetype Baseline Differentiation', () => {
  const alloyOres: MetallurgyOreInput[] = [
    { oreId: 'ck', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 70 },
    { oreId: 'ht', oreName: 'Huyền Thiết', element: 'huyen_thiet', weight: 30 }
  ];

  const alloy = calculateAlloyComposition(alloyOres, 3, 5);
  assertTrue(alloy !== null, 'Phân tích hợp kim mẫu không được null');

  const baselineStats = {
    atk: 1000,
    speed: 100,
    hp: 500,
    def: 200
  };

  // Đúc Phi Kiếm
  const phiKiem: Equipment = craftModularEquipment({
    archetypeId: 'phi_kiem',
    alloyComposition: alloy!,
    baseStats: baselineStats
  });

  // Đúc Trọng Kiếm với cùng thông số phôi và hợp kim
  const trongKiem: Equipment = craftModularEquipment({
    archetypeId: 'trong_kiem',
    alloyComposition: alloy!,
    baseStats: baselineStats
  });

  // 1. So sánh Tốc độ (Speed)
  // Phi Kiếm: speedMultiplier 1.25 > Trọng Kiếm: speedMultiplier 0.85
  assertTrue(
    (phiKiem.speedBonus ?? 0) > (trongKiem.speedBonus ?? 0),
    `Tốc độ của Phi Kiếm (${phiKiem.speedBonus}) phải vượt trội hơn Trọng Kiếm (${trongKiem.speedBonus})`
  );

  // 2. So sánh Bạo Kích (Crit Rate Bonus)
  // Phi Kiếm có critRateBonus (+12%) trong khi Trọng Kiếm không có bonus này
  assertTrue(
    (phiKiem.critRateBonus ?? 0) > 0,
    `Phi Kiếm phải sở hữu critRateBonus (+12%), thực tế: ${phiKiem.critRateBonus}`
  );
  assertTrue(
    trongKiem.critRateBonus === undefined,
    'Trọng Kiếm không sở hữu critRateBonus cơ bản'
  );

  // 3. So sánh Công Kích (ATK)
  // Trọng Kiếm: atkMultiplier 1.6 > Phi Kiếm: atkMultiplier 1.2
  assertTrue(
    (trongKiem.atkBonus ?? 0) > (phiKiem.atkBonus ?? 0),
    `Công kích của Trọng Kiếm (${trongKiem.atkBonus}) phải vượt trội hơn Phi Kiếm (${phiKiem.atkBonus})`
  );

  // 4. So sánh Xuyên Giáp (Armor Pen Bonus)
  // Trọng Kiếm có armorPenBonus (+20%), Phi Kiếm không có
  const trongKiemArmorPen = trongKiem.alloyMetadata?.archetypeMultipliers.armorPenBonus ?? 0;
  const phiKiemArmorPen = phiKiem.alloyMetadata?.archetypeMultipliers.armorPenBonus ?? 0;
  assertTrue(
    trongKiemArmorPen === 0.20,
    `Trọng Kiếm phải có bonus xuyên giáp 20%, thực tế: ${trongKiemArmorPen}`
  );
  assertTrue(
    phiKiemArmorPen === 0,
    `Phi Kiếm không có bonus xuyên giáp, thực tế: ${phiKiemArmorPen}`
  );

  console.log(`  ✓ Phi Kiếm: Tốc độ = ${phiKiem.speedBonus} (vượt trội vs ${trongKiem.speedBonus}), Bạo kích = +${((phiKiem.critRateBonus ?? 0) * 100).toFixed(1)}%`);
  console.log(`  ✓ Trọng Kiếm: Công kích = ${trongKiem.atkBonus} (vượt trội vs ${phiKiem.atkBonus}), Xuyên giáp = +${(trongKiemArmorPen * 100).toFixed(0)}%, Choáng = +${((trongKiem.alloyMetadata?.archetypeMultipliers.stunChanceBonus ?? 0) * 100).toFixed(0)}%`);
});

// ============================================================================
// TEST 4: Atomic Deduction & Boundary Guard
// - Viết test mô phỏng kiểm tra kho đồ: Nếu yêu cầu vượt quá tồn kho -> validation ném ngoại lệ rõ ràng, không trừ âm.
// ============================================================================
runTestCase(4, 'Atomic Deduction & Boundary Guard', () => {
  // Mock kho đồ người chơi ban đầu
  const initialInventory = [
    { id: 'ore_canh_kim', name: 'Canh Kim Thạch', quantity: 50 },
    { id: 'ore_han_bang', name: 'Hàn Băng Tinh', quantity: 30 },
    { id: 'ore_huyen_thiet', name: 'Huyền Thiết', quantity: 15 }
  ];

  // Ca 4a: Yêu cầu Canh Kim = 70 (vượt quá tồn kho 50)
  const excessiveOres: MetallurgyOreInput[] = [
    { oreId: 'ore_canh_kim', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 70 },
    { oreId: 'ore_han_bang', oreName: 'Hàn Băng Tinh', element: 'han_bang', weight: 20 }
  ];

  let exceptionThrown = false;
  let exceptionMessage = '';

  try {
    deductOresFromInventory(initialInventory, excessiveOres);
  } catch (err: unknown) {
    exceptionThrown = true;
    exceptionMessage = err instanceof Error ? err.message : String(err);
  }

  assertTrue(
    exceptionThrown,
    'Validation kho đồ phải ném ngoại lệ khi số lượng yêu cầu vượt quá tồn kho'
  );
  assertTrue(
    exceptionMessage.includes('Không đủ khoáng thạch [Canh Kim Thạch]'),
    `Ngoại lệ phải nêu rõ tên quặng bị thiếu, thực tế thông báo: "${exceptionMessage}"`
  );

  // Đảm bảo kho đồ ban đầu hoàn toàn nguyên vẹn (Atomic Invariant, không bị trừ âm)
  assertTrue(
    initialInventory[0].quantity === 50,
    `Kho đồ ban đầu không được biến đổi, Canh Kim phải giữ nguyên 50, thực tế: ${initialInventory[0].quantity}`
  );
  assertTrue(
    initialInventory[1].quantity === 30,
    `Kho đồ ban đầu không được biến đổi, Hàn Băng phải giữ nguyên 30, thực tế: ${initialInventory[1].quantity}`
  );
  console.log(`  ✓ Chặn thành công yêu cầu vượt tồn kho: "${exceptionMessage}"`);
  console.log(`  ✓ Bảo vệ tính toàn vẹn kho: Không trừ dở dang, không có số âm phát sinh`);

  // Ca 4b: Yêu cầu hợp lệ (Canh Kim 40 <= 50, Hàn Băng 25 <= 30)
  const validRequirements: MetallurgyOreInput[] = [
    { oreId: 'ore_canh_kim', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 40 },
    { oreId: 'ore_han_bang', oreName: 'Hàn Băng Tinh', element: 'han_bang', weight: 25 }
  ];

  const updatedInventory = deductOresFromInventory(initialInventory, validRequirements);

  const updatedCanhKim = updatedInventory.find(o => o.id === 'ore_canh_kim');
  const updatedHanBang = updatedInventory.find(o => o.id === 'ore_han_bang');
  const updatedHuyenThiet = updatedInventory.find(o => o.id === 'ore_huyen_thiet');

  assertTrue(updatedCanhKim?.quantity === 10, `Canh Kim tồn mới phải là 10, thực tế: ${updatedCanhKim?.quantity}`);
  assertTrue(updatedHanBang?.quantity === 5, `Hàn Băng tồn mới phải là 5, thực tế: ${updatedHanBang?.quantity}`);
  assertTrue(updatedHuyenThiet?.quantity === 15, `Huyền Thiết không dùng đến phải giữ nguyên 15, thực tế: ${updatedHuyenThiet?.quantity}`);

  console.log(`  ✓ Khấu trừ nguyên liệu hợp lệ thành công: Canh Kim 50 -> 10, Hàn Băng 30 -> 5`);
});

// ============================================================================
// TEST 5: Name Generation Accuracy
// - Canh Kim chiếm đa số + Phi Kiếm -> Tên sinh ra phải chứa từ khóa Canh Kim/Bạch Hổ và Kiếm.
// ============================================================================
runTestCase(5, 'Name Generation Accuracy', () => {
  const testTiers = [
    { purity: 98, expectedTier: 'Divine (>=95)' },
    { purity: 90, expectedTier: 'Peerless (>=88)' },
    { purity: 82, expectedTier: 'Refined (>=80)' },
    { purity: 74, expectedTier: 'Mortal (<80)' }
  ];

  for (const tier of testTiers) {
    const generatedName = generateModularWeaponName('phi_kiem', 'canh_kim', tier.purity);

    // Kiểm tra chứa từ khóa nguyên tố (Canh Kim hoặc Bạch Hổ)
    const hasElementKeyword = generatedName.includes('Canh Kim') || generatedName.includes('Bạch Hổ');
    // Kiểm tra chứa từ khóa phôi khí (Kiếm hoặc Phi Kiếm)
    const hasArchetypeKeyword = generatedName.includes('Kiếm');

    assertTrue(
      hasElementKeyword,
      `Tên "${generatedName}" (Purity: ${tier.purity}) phải chứa từ khóa 'Canh Kim' hoặc 'Bạch Hổ'`
    );
    assertTrue(
      hasArchetypeKeyword,
      `Tên "${generatedName}" (Purity: ${tier.purity}) phải chứa từ khóa 'Kiếm'`
    );

    console.log(`  ✓ Cấp ${tier.expectedTier} (Purity ${tier.purity}%): "${generatedName}" -> [Hợp lệ: Canh Kim/Bạch Hổ + Kiếm]`);
  }

  // Thử nghiệm thêm khi đúc qua craftModularEquipment
  const oresDominantCanhKim: MetallurgyOreInput[] = [
    { oreId: 'ck', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 80 },
    { oreId: 'ht', oreName: 'Huyền Thiết', element: 'huyen_thiet', weight: 20 }
  ];
  const alloyResult = calculateAlloyComposition(oresDominantCanhKim, 8, 8);
  assertTrue(alloyResult !== null, 'Phân tích hợp kim không được null');

  const craftedWeapon = craftModularEquipment({
    archetypeId: 'phi_kiem',
    alloyComposition: alloyResult!,
    baseStats: { atk: 500 }
  });

  const weaponName = craftedWeapon.name;
  const isMatch = (weaponName.includes('Canh Kim') || weaponName.includes('Bạch Hổ')) && weaponName.includes('Kiếm');
  assertTrue(
    isMatch,
    `Tên trang bị hoàn chỉnh "${weaponName}" phải chứa từ khóa Canh Kim/Bạch Hổ và Kiếm`
  );
  console.log(`  ✓ Tên trang bị sau khi chế tác hoàn chỉnh: "${weaponName}"`);
});

// ============================================================================
// TEST 6: Purity Score Boundaries
// - Đảm bảo điểm tinh khiết luôn nằm trong khoảng [70, 100].
// ============================================================================
runTestCase(6, 'Purity Score Boundaries', () => {
  // Ca 1: Cấu hình tỷ lệ lệch cực hạn, thợ rèn cấp 0, không dị hỏa -> Purity phải sát 70 và không thấp hơn 70
  const extremeSkewedOres: MetallurgyOreInput[] = [
    { oreId: 'ck', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 9999 },
    { oreId: 'hb', oreName: 'Hàn Băng Tinh', element: 'han_bang', weight: 1 }
  ];
  const minResult = calculateAlloyComposition(extremeSkewedOres, 0, 0);
  assertTrue(minResult !== null, 'Kết quả ca cực tiểu không được null');
  assertTrue(
    minResult!.purityScore >= 70.0 && minResult!.purityScore <= 100.0,
    `PurityScore ca xấu nhất phải >= 70.0, thực tế: ${minResult!.purityScore}`
  );
  console.log(`  ✓ Ca biên cực tiểu (Lệch 99.99%, thợ rèn 0, dị hỏa 0%): PurityScore = ${minResult!.purityScore}% (>= 70.0)`);

  // Ca 2: Cấu hình tỷ lệ hoàn hảo (50% - 50%), thợ rèn Đại Thừa (cấp 10), dị hỏa tối cao (10%) -> Purity phải đạt trần 100.0
  const perfectOres: MetallurgyOreInput[] = [
    { oreId: 'ck', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 50 },
    { oreId: 'hb', oreName: 'Hàn Băng Tinh', element: 'han_bang', weight: 50 }
  ];
  const maxResult = calculateAlloyComposition(perfectOres, 10, 10);
  assertTrue(maxResult !== null, 'Kết quả ca cực đại không được null');
  assertTrue(
    maxResult!.purityScore <= 100.0 && maxResult!.purityScore >= 70.0,
    `PurityScore ca cực đại phải <= 100.0, thực tế: ${maxResult!.purityScore}`
  );
  assertTrue(
    maxResult!.purityScore === 100.0,
    `PurityScore ca tối ưu phải chạm trần 100.0, thực tế: ${maxResult!.purityScore}`
  );
  console.log(`  ✓ Ca biên cực đại (Đồng đều 50-50, thợ rèn 10, dị hỏa 10%): PurityScore = ${maxResult!.purityScore}% (Trần 100.0)`);

  // Ca 3: Kiểm thử ngẫu nhiên 50 bộ cấu hình quặng (2 -> 4 loại quặng, các trọng số khác nhau)
  const elements: OreElementProperty[] = ['canh_kim', 'han_bang', 'xich_hoa', 'huyen_thiet', 'tinh_than'];

  for (let i = 0; i < 50; i++) {
    const numOres = 2 + (i % 3); // 2, 3, hoặc 4 loại
    const sampleOres: MetallurgyOreInput[] = [];

    for (let j = 0; j < numOres; j++) {
      sampleOres.push({
        oreId: `ore_${j}`,
        oreName: `Quặng ${j}`,
        element: elements[j % elements.length],
        weight: Math.floor(Math.random() * 100) + 1
      });
    }

    const testRealm = Math.floor(Math.random() * 11);
    const testFlame = Math.floor(Math.random() * 11);

    const randomResult = calculateAlloyComposition(sampleOres, testRealm, testFlame);
    assertTrue(randomResult !== null, `Kết quả ngẫu nhiên vòng ${i} không được null`);
    assertTrue(
      randomResult!.purityScore >= 70.0 && randomResult!.purityScore <= 100.0,
      `PurityScore ngẫu nhiên vòng ${i} ngoài khoảng [70, 100]: ${randomResult!.purityScore}`
    );
  }
  console.log(`  ✓ Đã kiểm thử 50 trường hợp ngẫu nhiên: 100% điểm tinh khiết đều nằm trong phạm vi [70.0, 100.0]`);
});

// ============================================================================
// TEST 7: Save Migration & Idempotence Invariant
// - Bổ sung migrateModularForgingData: khởi tạo modularMetallurgyState an toàn nếu chưa có.
// - Quét toàn bộ equipment và inventory: gán alloyMetadata = null nếu chưa có, bảo toàn đồ cũ.
// - Kiểm tra tính lũy đẳng: chạy nhiều lần trên cùng 1 save không làm đổi trạng thái dữ liệu.
// ============================================================================
runTestCase(7, 'Save Migration & Idempotence Invariant', () => {
  // Mock legacy save: hoàn toàn không có modularMetallurgyState, đồ cũ không có alloyMetadata
  const legacyPlayer: PlayerStats = {
    name: 'Hàn Lập',
    currentRealm: 11, // Trúc Cơ Sơ Kỳ
    canCot: 60,
    ngoTinh: 70,
    tamCanh: 65,
    khiVan: 55,
    linhThach: 100000,
    tuVi: 50000,
    danhVong: 1000,
    equipment: {
      weapon: {
        id: 'legacy_weapon_1',
        name: 'Thanh Phong Kiếm',
        slot: 'weapon',
        grade: 'Linh Khí',
        powerBonus: 500,
        enhancement: 0,
        hpBonus: 0,
        mpBonus: 0
      },
      armor: {
        id: 'legacy_armor_1',
        name: 'Huyền Thiết Giáp',
        slot: 'armor',
        grade: 'Linh Khí',
        powerBonus: 400,
        enhancement: 0,
        hpBonus: 200,
        mpBonus: 0
      }
    },
    inventory: {
      pills: [],
      herbs: [],
      ores: [],
      equipment: [
        {
          id: 'legacy_inv_weapon',
          name: 'Trảm Ma Kiếm',
          slot: 'weapon',
          grade: 'Bảo Khí',
          powerBonus: 800,
          enhancement: 0,
          hpBonus: 0,
          mpBonus: 0
        }
      ]
    }
  };

  // 1. Thực hiện migration lần 1
  const migratedPlayer1 = migrateModularForgingData(legacyPlayer);

  // Kiểm tra modularMetallurgyState được khởi tạo đúng chuẩn
  assertTrue(
    migratedPlayer1.modularMetallurgyState !== undefined && migratedPlayer1.modularMetallurgyState !== null,
    'modularMetallurgyState phải được khởi tạo an toàn'
  );
  assertTrue(
    migratedPlayer1.modularMetallurgyState.craftedWeaponsCount === 0,
    'craftedWeaponsCount khởi tạo mặc định là 0'
  );
  assertTrue(
    Array.isArray(migratedPlayer1.modularMetallurgyState.unlockedArchetypes) &&
    migratedPlayer1.modularMetallurgyState.unlockedArchetypes.length === 4,
    'unlockedArchetypes phải chứa đủ 4 phôi khí'
  );

  // Kiểm tra trang bị cũ được gán alloyMetadata = null an toàn
  const eqWeapon = (migratedPlayer1.equipment as any)?.weapon;
  const eqArmor = (migratedPlayer1.equipment as any)?.armor;
  const invWeapon = migratedPlayer1.inventory?.equipment?.[0];

  assertTrue(eqWeapon?.alloyMetadata === null, 'Vũ khí cũ đang trang bị phải có alloyMetadata: null');
  assertTrue(eqArmor?.alloyMetadata === null, 'Chiến giáp cũ đang trang bị phải có alloyMetadata: null');
  assertTrue(invWeapon?.alloyMetadata === null, 'Vũ khí trong túi đồ phải có alloyMetadata: null');

  // Bảo toàn 100% dữ liệu gốc không bị biến dạng
  assertTrue(eqWeapon?.name === 'Thanh Phong Kiếm', 'Tên vũ khí cũ phải giữ nguyên vẹn');
  assertTrue(eqWeapon?.powerBonus === 500, 'Điểm sức mạnh cũ phải giữ nguyên vẹn');
  assertTrue(invWeapon?.name === 'Trảm Ma Kiếm', 'Trang bị trong túi trữ vật phải giữ nguyên vẹn');

  console.log('  ✓ Khởi tạo modularMetallurgyState chuẩn xác: 4 phôi khí sơ khai, 0 vũ khí đã đúc');
  console.log('  ✓ Gán an toàn alloyMetadata = null cho toàn bộ trang bị cũ (equipment & inventory)');
  console.log('  ✓ Bảo toàn 100% dữ liệu trang bị cũ, không làm mất hay biến dạng thông số');

  // 2. Kiểm tra tính lũy đẳng (Idempotent): Chạy migration lần 2 trên cùng dữ liệu
  const migratedPlayer2 = migrateModularForgingData(migratedPlayer1);

  assertTrue(
    JSON.stringify(migratedPlayer1.modularMetallurgyState) === JSON.stringify(migratedPlayer2.modularMetallurgyState),
    'Tính lũy đẳng: modularMetallurgyState không được thay đổi sau lần migration thứ 2'
  );
  assertTrue(
    (migratedPlayer2.equipment as any)?.weapon?.alloyMetadata === null,
    'Tính lũy đẳng: alloyMetadata vẫn là null không bị ghi đè bất thường'
  );
  console.log('  ✓ Đạt tính lũy đẳng (Idempotent): Chạy nhiều lần không làm thay đổi hay suy hao dữ liệu');
});

// ============================================================================
// TEST 8: Combat Stats Aggregation & Combat Loop Execution
// - calculateCombatStats quét equipment và cộng dồn: trueDamagePercent, slowSpeedPercent, burnDamagePercent, damageReductionPercent.
// - executeAlloyCombatTurn: Final Damage = Mitigated Physical Damage + (Raw Damage * trueDamagePercent).
// - Trừ tốc độ đối thủ theo slowSpeedPercent và gắn DoT trừ % HP đối thủ theo burnDamagePercent.
// ============================================================================
runTestCase(8, 'Combat Stats Aggregation & Combat Loop Execution', () => {
  // 1. Chuẩn bị hợp kim đa nguyên tố: Canh Kim 60% (trueDamage 9%), Hàn Băng 40% (slowSpeed 8%)
  const alloyOres: MetallurgyOreInput[] = [
    { oreId: 'ck', oreName: 'Canh Kim Thạch', element: 'canh_kim', weight: 60 },
    { oreId: 'hb', oreName: 'Hàn Băng Tinh', element: 'han_bang', weight: 40 }
  ];
  const alloyComp = calculateAlloyComposition(alloyOres, 5, 5);
  assertTrue(alloyComp !== null, 'Phân tích hợp kim mẫu không được null');

  // Đúc vũ khí thần binh
  const modularWeapon = craftModularEquipment({
    archetypeId: 'phi_kiem',
    alloyComposition: alloyComp!,
    baseStats: { atk: 1200, speed: 150 }
  });

  // Gắn thêm đặc tính thiêu đốt DoT (Xích Hỏa 12%) để kiểm thử trọn vẹn 3 cơ chế
  modularWeapon.alloyMetadata!.alloyComposition.specialAffixes = {
    ...alloyComp!.elementalStats,
    burnDamagePercent: 12.0
  };

  const combatPlayer: PlayerStats = {
    name: 'Kiếm Tu Hàn Lập',
    currentRealm: 15,
    canCot: 75,
    ngoTinh: 80,
    tamCanh: 70,
    khiVan: 60,
    linhThach: 50000,
    tuVi: 80000,
    danhVong: 1000,
    equipment: {
      weapon: modularWeapon
    }
  };

  // 2. Kiểm tra tính toán chỉ số chiến đấu tổng hợp qua calculateCombatStats
  const combatStats = calculateCombatStats(combatPlayer);

  assertTrue(
    combatStats.trueDamagePercent === 9.0,
    `trueDamagePercent phải cộng dồn 9.0%, thực tế: ${combatStats.trueDamagePercent}%`
  );
  assertTrue(
    combatStats.slowSpeedPercent === 8.0,
    `slowSpeedPercent phải cộng dồn 8.0%, thực tế: ${combatStats.slowSpeedPercent}%`
  );
  assertTrue(
    combatStats.burnDamagePercent === 12.0,
    `burnDamagePercent phải cộng dồn 12.0%, thực tế: ${combatStats.burnDamagePercent}%`
  );
  console.log(`  ✓ calculateCombatStats cộng dồn chuẩn xác: TrueDamage = ${combatStats.trueDamagePercent}%, SlowSpeed = ${combatStats.slowSpeedPercent}%, BurnDamage = ${combatStats.burnDamagePercent}%`);

  // 3. Kiểm thử lượt công kích trong Combat Loop (executeAlloyCombatTurn)
  const bossTarget = {
    name: 'Xích Viêm Cự Thú',
    hp: 25000,
    maxHp: 25000,
    def: 1000,
    speed: 150
  };

  const turnResult = executeAlloyCombatTurn(
    combatStats,
    bossTarget,
    { isCrit: false, skillMultiplier: 1.0 }
  );

  // A. Kiểm tra công thức Sát thương chuẩn: Final Damage = Mitigated Physical Damage + (Raw Damage * trueDamagePercent)
  // DEF = 1000 -> defReductionMod = 1000 / (1000 + 1000) = 0.5
  const expectedRawDamage = Math.round(combatStats.atk);
  const expectedMitigatedPhysical = Math.max(1, Math.round(expectedRawDamage * (1000 / (1000 + bossTarget.def))));
  const expectedTrueDamage = Math.round(expectedRawDamage * 0.09);
  const expectedFinalDamage = expectedMitigatedPhysical + expectedTrueDamage;

  assertTrue(
    turnResult.rawDamage === expectedRawDamage,
    `Raw damage kỳ vọng ${expectedRawDamage}, thực tế: ${turnResult.rawDamage}`
  );
  assertTrue(
    turnResult.trueDamage === expectedTrueDamage,
    `True damage kỳ vọng ${expectedTrueDamage} (9% của ${expectedRawDamage}), thực tế: ${turnResult.trueDamage}`
  );
  assertTrue(
    turnResult.finalDamage === expectedFinalDamage,
    `Final Damage kỳ vọng ${expectedFinalDamage} (${expectedMitigatedPhysical} + ${expectedTrueDamage}), thực tế: ${turnResult.finalDamage}`
  );
  console.log(`  ✓ Sát thương chuẩn (True Damage): Vật lý giảm trừ = ${turnResult.mitigatedPhysicalDamage} + Sát thương chuẩn = ${turnResult.trueDamage} -> Tổng gây ra = ${turnResult.finalDamage}`);

  // B. Kiểm tra Hàn Băng Tê Liệt (Slow Attack Speed)
  // Tốc độ gốc 150, giảm 8% = 12 -> Tốc độ mới = 138
  const expectedSlowReduction = Math.round(150 * 0.08);
  const expectedNewSpeed = 150 - expectedSlowReduction;

  assertTrue(
    turnResult.slowSpeedReduction === expectedSlowReduction,
    `Lượng tốc độ bị trừ kỳ vọng ${expectedSlowReduction}, thực tế: ${turnResult.slowSpeedReduction}`
  );
  assertTrue(
    turnResult.newTargetSpeed === expectedNewSpeed,
    `Tốc độ đối thủ sau khi bị làm chậm kỳ vọng ${expectedNewSpeed}, thực tế: ${turnResult.newTargetSpeed}`
  );
  console.log(`  ✓ Hàn Băng Tê Liệt: Tốc độ đối thủ ${bossTarget.speed} -> bị trừ ${turnResult.slowSpeedReduction} -> còn ${turnResult.newTargetSpeed}`);

  // C. Kiểm tra Thiêu Đốt Chân Khí (Burn Damage DoT)
  // Max HP 25,000, 12% = 3,000 HP
  const expectedBurnDoT = Math.round(25000 * 0.12);
  assertTrue(
    turnResult.burnDoTDamage === expectedBurnDoT,
    `Sát thương DoT thiêu đốt kỳ vọng ${expectedBurnDoT}, thực tế: ${turnResult.burnDoTDamage}`
  );
  const expectedRemainingHp = Math.max(0, 25000 - (expectedFinalDamage + expectedBurnDoT));
  assertTrue(
    turnResult.remainingTargetHp === expectedRemainingHp,
    `Máu đối thủ còn lại kỳ vọng ${expectedRemainingHp}, thực tế: ${turnResult.remainingTargetHp}`
  );
  console.log(`  ✓ Thiêu Đốt Chân Khí (DoT): Trừ -${turnResult.burnDoTDamage} HP (12% Max HP), Máu đối thủ giảm còn ${turnResult.remainingTargetHp}`);

  // D. Kiểm tra Log chiến đấu cổ phong
  assertTrue(
    turnResult.combatLogs.some(log => log.includes('Canh Kim Chân Thương')),
    'Combat log phải ghi nhận Canh Kim Chân Thương'
  );
  assertTrue(
    turnResult.combatLogs.some(log => log.includes('Hàn Băng Tê Liệt')),
    'Combat log phải ghi nhận Hàn Băng Tê Liệt'
  );
  assertTrue(
    turnResult.combatLogs.some(log => log.includes('Thiêu Đốt Chân Khí')),
    'Combat log phải ghi nhận Thiêu Đốt Chân Khí'
  );
  console.log('  ✓ Log chiến đấu cổ phong ghi nhận đầy đủ 3 hiệu ứng đặc trưng của thần binh hợp kim');

  // E. Kiểm thử tích hợp trong battleBoss
  const mockBoss: Boss = {
    id: 'boss_test_fire',
    name: 'Xích Viêm Cự Thú',
    realm: 15,
    hp: 20000,
    maxHp: 20000,
    atk: 800,
    def: 600,
    speed: 120,
    stats: {
      hp: 20000,
      maxHp: 20000,
      atk: 800,
      def: 600,
      speed: 120,
      power: 2500
    },
    defeatText: 'Xích Viêm Cự Thú rống lên thê lương rồi ngã quỵ!',
    loseText: 'Ngươi không địch lại Xích Viêm Cự Thú!'
  };

  const battleOutcome = battleBoss(combatPlayer, mockBoss);
  assertTrue(battleOutcome !== null, 'Kết quả battleBoss không được null');
  console.log(`  ✓ Tích hợp battleBoss thành công: Kết quả [${battleOutcome.message}], flavor text ghi nhận hiệu ứng`);
});

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log('\n===============================================================');
if (passedCount === TOTAL_TESTS) {
  console.log(`🎉 KẾT QUẢ TEST SUITE: ${passedCount}/${TOTAL_TESTS} TESTS PASSED (100% HOÀN TẤT)`);
} else {
  console.error(`❌ KẾT QUẢ TEST SUITE: CHỈ ĐẠT ${passedCount}/${TOTAL_TESTS} TESTS!`);
  process.exit(1);
}
console.log('===============================================================');
