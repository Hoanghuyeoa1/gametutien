// scripts/test-breakthrough-catalysts.ts
// QA Automation & Engine Specialist: Test Suite kiểm thử toàn diện module
// "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch (Breakthrough Catalysts & Protective Talismans)"

import {
  calculateBreakthroughChances,
  resolveBreakthroughBacklash,
  BREAKTHROUGH_PILLS_CONFIG,
  BREAKTHROUGH_TALISMANS_CONFIG
} from '../lib/breakthrough-catalyst-logic';
import {
  BreakthroughRateCalculation,
  BreakthroughPillConfig,
  BreakthroughTalismanConfig
} from '../lib/types/breakthrough-catalyst';
import {
  migrateBreakthroughCatalystData,
  normalizePlayerData
} from '../lib/save-migration';
import {
  getGameItemById,
  BREAKTHROUGH_ITEMS_REGISTRY
} from '../lib/items-data';

let passedTests = 0;
let failedTests = 0;

function runTest(testName: string, testFn: () => void) {
  try {
    testFn();
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } catch (error: any) {
    console.error(`[FAIL] ${testName}`);
    console.error(`       Chi tiết lỗi: ${error?.message || error}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('🧪 TEST SUITE: BREAKTHROUGH CATALYSTS & PROTECTIVE TALISMANS');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: Standard Pill Rate Accumulation
// -----------------------------------------------------------------------------
runTest('Test 1: Standard Pill Rate Accumulation', () => {
  // Base rate 70% (0.70), dùng Trúc Cơ Đan (+30%) -> finalRate phải đạt chính xác 1.0 (100%)
  const result: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate: 0.70,
    baseSpiritStones: 5000,
    playerToxicity: 0,
    selectedPill: { itemId: 'item_truc_co_dan' }
  });

  if (result.baseRate !== 0.70) {
    throw new Error(`baseRate mong muốn 0.70, thực tế nhận được ${result.baseRate}`);
  }
  if (result.pillBonusRate !== 0.30) {
    throw new Error(`pillBonusRate từ Trúc Cơ Đan mong muốn 0.30, thực tế nhận được ${result.pillBonusRate}`);
  }
  if (result.finalRate !== 1.0) {
    throw new Error(`finalRate tính toán mong muốn đạt chính xác 1.0 (100%), thực tế nhận được ${result.finalRate}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 2: Nine-Vein Absolute Guarantee Invariant
// -----------------------------------------------------------------------------
runTest('Test 2: Nine-Vein Absolute Guarantee Invariant', () => {
  // Khảm đan có veinCount === 9 với bất kỳ base rate nào (ví dụ 10% cực thấp)
  const nineVeinPill = {
    itemId: 'item_truc_co_dan',
    name: 'Trúc Cơ Đan (Cửu Văn Tuyệt Phẩm)',
    veinMetadata: { veinCount: 9 }
  };

  const result: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate: 0.10, // Base rate chỉ 10%
    baseSpiritStones: 20000,
    playerToxicity: 80, // Đan độc 80%
    selectedPill: nineVeinPill
  });

  if (result.isGuaranteedSuccess !== true) {
    throw new Error(`isGuaranteedSuccess mong muốn true khi khảm đan 9 văn, thực tế nhận được ${result.isGuaranteedSuccess}`);
  }
  if (result.finalRate !== 1.0) {
    throw new Error(`finalRate mong muốn 1.0 khi khảm đan 9 văn, thực tế nhận được ${result.finalRate}`);
  }
  if (result.isBacklashProtected !== true) {
    throw new Error(`isBacklashProtected mong muốn true khi khảm đan 9 văn, thực tế nhận được ${result.isBacklashProtected}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 3: Formation Disc Spirit Stone Reduction
// -----------------------------------------------------------------------------
runTest('Test 3: Formation Disc Spirit Stone Reduction', () => {
  // Chi phí gốc 10,000 Linh Thạch, khảm Tụ Linh Trận Bàn (giảm 40%) -> spiritStoneCost phải bằng đúng 6,000 Linh Thạch
  const result: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate: 0.50,
    baseSpiritStones: 10000,
    playerToxicity: 0,
    selectedTalisman: { itemId: 'item_tu_linh_tran_ban' }
  });

  const expectedCost = 6000;
  if (result.spiritStoneCost !== expectedCost) {
    throw new Error(
      `spiritStoneCost mong muốn ${expectedCost} (giảm 40% từ 10,000), thực tế nhận được ${result.spiritStoneCost}`
    );
  }
});

// -----------------------------------------------------------------------------
// TEST 4: Backlash Protection Invariant
// -----------------------------------------------------------------------------
runTest('Test 4: Backlash Protection Invariant', () => {
  const currentHp = 10000;
  const currentTuvi = 50000;

  // 1. Không có phù: Trừ chính xác 35% HP và 20% Tu vi
  const unprotectedResult = resolveBreakthroughBacklash(currentHp, currentTuvi, false);
  const expectedHpLoss = Math.floor(currentHp * 0.35); // 3,500
  const expectedTuviLoss = Math.floor(currentTuvi * 0.20); // 10,000

  if (unprotectedResult.hpLoss !== expectedHpLoss) {
    throw new Error(`hpLoss không có phù mong muốn ${expectedHpLoss} (35%), thực tế nhận được ${unprotectedResult.hpLoss}`);
  }
  if (unprotectedResult.tuviLoss !== expectedTuviLoss) {
    throw new Error(`tuviLoss không có phù mong muốn ${expectedTuviLoss} (20%), thực tế nhận được ${unprotectedResult.tuviLoss}`);
  }

  // 2. Có Hộ Mạch Phù: hpLoss === 0, tuviLoss === 0, thông báo bảo vệ an toàn kinh mạch được sinh ra
  const protectedResult = resolveBreakthroughBacklash(currentHp, currentTuvi, true);
  if (protectedResult.hpLoss !== 0) {
    throw new Error(`hpLoss khi có Hộ Mạch Phù mong muốn 0, thực tế nhận được ${protectedResult.hpLoss}`);
  }
  if (protectedResult.tuviLoss !== 0) {
    throw new Error(`tuviLoss khi có Hộ Mạch Phù mong muốn 0, thực tế nhận được ${protectedResult.tuviLoss}`);
  }
  if (!protectedResult.logMessage || !protectedResult.logMessage.includes('hộ trì') && !protectedResult.logMessage.includes('Hộ Mạch')) {
    throw new Error(`logMessage thông báo bảo vệ kinh mạch không đúng kỳ vọng: "${protectedResult.logMessage}"`);
  }
});

// -----------------------------------------------------------------------------
// TEST 5: Inner Demon Cleansing (Toxicity Mitigation)
// -----------------------------------------------------------------------------
runTest('Test 5: Inner Demon Cleansing (Toxicity Mitigation)', () => {
  const baseRate = 0.60;
  const playerToxicity = 50; // 50 điểm đan độc

  // 1. Khi chưa khảm Định Tâm Phù: Có tính toxicityPenaltyRate
  const unassistedResult: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate,
    baseSpiritStones: 5000,
    playerToxicity
  });

  if (unassistedResult.toxicityPenaltyRate <= 0) {
    throw new Error(
      `toxicityPenaltyRate mong muốn > 0 khi có đan độc và chưa khảm Định Tâm Phù, thực tế nhận được ${unassistedResult.toxicityPenaltyRate}`
    );
  }
  if (unassistedResult.finalRate >= baseRate) {
    throw new Error(
      `finalRate phải bị trừ do đan độc (< ${baseRate}), thực tế nhận được ${unassistedResult.finalRate}`
    );
  }

  // 2. Khi khảm Định Tâm Phù: toxicityPenaltyRate === 0, tỷ lệ không bị trừ
  const assistedResult: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate,
    baseSpiritStones: 5000,
    playerToxicity,
    selectedTalisman: { itemId: 'item_dinh_tam_phu' }
  });

  if (assistedResult.toxicityPenaltyRate !== 0) {
    throw new Error(
      `toxicityPenaltyRate mong muốn 0 khi đã khảm Định Tâm Phù, thực tế nhận được ${assistedResult.toxicityPenaltyRate}`
    );
  }
  if (assistedResult.finalRate !== baseRate) {
    throw new Error(
      `finalRate khi khảm Định Tâm Phù phải giữ nguyên ${baseRate}, thực tế nhận được ${assistedResult.finalRate}`
    );
  }
});

// -----------------------------------------------------------------------------
// TEST 6: Boundary Clamping
// -----------------------------------------------------------------------------
runTest('Test 6: Boundary Clamping', () => {
  // 1. Tỷ lệ cực thấp (base 0.01, penalty cao) -> Không bao giờ tụt dưới 0.05 (5%)
  const lowerBoundResult: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate: 0.01,
    baseSpiritStones: 1000,
    playerToxicity: 90
  });

  if (lowerBoundResult.finalRate < 0.05) {
    throw new Error(
      `finalRate không được thấp hơn ngưỡng sàn 0.05 (5%), thực tế nhận được ${lowerBoundResult.finalRate}`
    );
  }
  if (lowerBoundResult.finalRate !== 0.05) {
    throw new Error(
      `finalRate cận dưới mong muốn clamp về đúng 0.05, thực tế nhận được ${lowerBoundResult.finalRate}`
    );
  }

  // 2. Tỷ lệ cực cao (base 0.90 + pill 0.35 + 8-vein 0.15 = 1.40) -> Không bao giờ vượt quá 1.0 (100%)
  const upperBoundResult: BreakthroughRateCalculation = calculateBreakthroughChances({
    baseRate: 0.90,
    baseSpiritStones: 1000,
    playerToxicity: 0,
    selectedPill: {
      itemId: 'item_hoa_than_dan',
      veinMetadata: { veinCount: 8 }
    }
  });

  if (upperBoundResult.finalRate > 1.0) {
    throw new Error(
      `finalRate không được vượt quá trần 1.0 (100%), thực tế nhận được ${upperBoundResult.finalRate}`
    );
  }
  if (upperBoundResult.finalRate !== 1.0) {
    throw new Error(
      `finalRate cận trên mong muốn clamp về đúng 1.0, thực tế nhận được ${upperBoundResult.finalRate}`
    );
  }
});

// -----------------------------------------------------------------------------
// TEST 7: Save Migration & Items Registration Invariant
// -----------------------------------------------------------------------------
runTest('Test 7: Save Migration & Items Registration Invariant', () => {
  // 1. Kiểm tra đăng ký vật phẩm phụ trợ phá cảnh
  const talismanDisc = getGameItemById('item_tu_linh_tran_ban');
  if (!talismanDisc || talismanDisc.powerValue !== 0.40) {
    throw new Error('Vật phẩm item_tu_linh_tran_ban chưa được đăng ký chính xác (powerValue: 0.40)');
  }

  const talismanShield = getGameItemById('item_ho_mach_phu');
  if (!talismanShield || talismanShield.effectType !== 'prevent_backlash') {
    throw new Error('Vật phẩm item_ho_mach_phu chưa được đăng ký chính xác (effectType: prevent_backlash)');
  }

  const talismanCleanse = getGameItemById('item_dinh_tam_phu');
  if (!talismanCleanse || talismanCleanse.effectType !== 'cleanse_inner_demon') {
    throw new Error('Vật phẩm item_dinh_tam_phu chưa được đăng ký chính xác (effectType: cleanse_inner_demon)');
  }

  // 2. Mock save cũ chưa có trường breakthroughCatalystState
  const mockOldSave: any = {
    name: 'Đạo Hữu Vô Danh',
    tuVi: 500000,
    canCot: 35,
    ngoTinh: 40,
    khiVan: 25,
    tamCanh: 80,
    linhThach: 99999,
    currentRealm: 11,
    inventory: {
      pills: [{ id: 'item_truc_co_dan', name: 'Trúc Cơ Đan', quantity: 3, grade: 'Nhị Phẩm' }],
      herbs: [],
      ores: [],
      equipments: []
    }
  };

  // 3. Thực thi migration trực tiếp
  const migratedOnce = migrateBreakthroughCatalystData(mockOldSave);

  // Khẳng định trường được khởi tạo an toàn với giá trị mặc định
  if (!migratedOnce.breakthroughCatalystState) {
    throw new Error('breakthroughCatalystState không được khởi tạo sau khi migrate');
  }
  if (migratedOnce.breakthroughCatalystState.totalCatalystBreakthroughs !== 0) {
    throw new Error('totalCatalystBreakthroughs mặc định phải bằng 0');
  }
  if (migratedOnce.breakthroughCatalystState.protectedFailuresCount !== 0) {
    throw new Error('protectedFailuresCount mặc định phải bằng 0');
  }

  // Khẳng định không làm ảnh hưởng inventory hay stats
  if (migratedOnce.tuVi !== 500000 || migratedOnce.linhThach !== 99999) {
    throw new Error('Migration đã làm biến đổi chỉ số tuVi hoặc linhThach của người chơi!');
  }
  if (!migratedOnce.inventory?.pills || migratedOnce.inventory.pills.length !== 1) {
    throw new Error('Migration đã làm ảnh hưởng danh mục inventory.pills của người chơi!');
  }

  // 4. Kiểm tra tính Idempotent (chạy lần 2 không thay đổi trạng thái)
  migratedOnce.breakthroughCatalystState.totalCatalystBreakthroughs = 5;
  migratedOnce.breakthroughCatalystState.protectedFailuresCount = 2;

  const migratedTwice = migrateBreakthroughCatalystData(migratedOnce);
  if (!migratedTwice.breakthroughCatalystState) {
    throw new Error('migratedTwice.breakthroughCatalystState không tồn tại sau khi migrate');
  }
  if (
    migratedTwice.breakthroughCatalystState.totalCatalystBreakthroughs !== 5 ||
    migratedTwice.breakthroughCatalystState.protectedFailuresCount !== 2
  ) {
    throw new Error('Tính Idempotent bị vi phạm! Chạy migrate lần 2 đã ghi đè dữ liệu đang có.');
  }

  // 5. Kiểm tra chu trình tích hợp normalizePlayerData
  const normalized = normalizePlayerData(mockOldSave);
  if (!normalized.breakthroughCatalystState) {
    throw new Error('normalizePlayerData chưa tích hợp breakthroughCatalystState');
  }
  if (normalized.breakthroughCatalystState.totalCatalystBreakthroughs !== 0) {
    throw new Error('normalizePlayerData phải khởi tạo an toàn totalCatalystBreakthroughs = 0');
  }
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`KẾT QUẢ TỔNG HỢP: ${passedTests} PASSED / ${failedTests} FAILED`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✅ TẤT CẢ TEST CASES ĐỀU ĐẠT CHUẨN KỸ THUẬT!');
}
