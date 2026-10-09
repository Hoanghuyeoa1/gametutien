// scripts/test-breakthrough-catalyst.ts
// Test suite tự động kiểm thử toàn diện module:
// "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch (Breakthrough Catalysts & Protective Talismans)"

import {
  BREAKTHROUGH_CATALYSTS_REGISTRY,
  BREAKTHROUGH_PILLS_CONFIG,
  BREAKTHROUGH_TALISMANS_CONFIG,
  calculateBreakthroughChances,
  resolveBreakthroughBacklash,
  executeBreakthroughWithCatalysts,
  getBreakthroughPillConfig,
  getBreakthroughTalismanConfig,
  isNineVeinedPill
} from '../lib/breakthrough-catalyst-logic';
import {
  BreakthroughPillConfig,
  BreakthroughTalismanConfig,
  BreakthroughRateCalculation,
  BreakthroughExecutionResult
} from '../lib/types/breakthrough-catalyst';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    failCount++;
  }
}

console.log('================================================================');
console.log('🧪 TEST SUITE: BREAKTHROUGH CATALYSTS & PROTECTIVE TALISMANS');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: REGISTRY DATA INTEGRITY
// -----------------------------------------------------------------------------
console.log('▶ Test 1: Registry Data Integrity (Pills & Talismans)');
assert(
  Boolean(BREAKTHROUGH_PILLS_CONFIG['item_boi_nguyen_dan'] && BREAKTHROUGH_PILLS_CONFIG['item_boi_nguyen_dan'].baseSuccessRateBonus === 0.20),
  'Pill Bồi Nguyên Đan tồn tại với bonus +20%'
);
assert(
  Boolean(BREAKTHROUGH_PILLS_CONFIG['item_truc_co_dan'] && BREAKTHROUGH_PILLS_CONFIG['item_truc_co_dan'].baseSuccessRateBonus === 0.30),
  'Pill Trúc Cơ Đan tồn tại với bonus +30%'
);
assert(
  Boolean(BREAKTHROUGH_PILLS_CONFIG['item_kim_dan_hoan'] && BREAKTHROUGH_PILLS_CONFIG['item_kim_dan_hoan'].baseSuccessRateBonus === 0.25),
  'Pill Kim Đan Hoàn tồn tại với bonus +25%'
);
assert(
  Boolean(BREAKTHROUGH_PILLS_CONFIG['item_hoa_than_dan'] && BREAKTHROUGH_PILLS_CONFIG['item_hoa_than_dan'].baseSuccessRateBonus === 0.35),
  'Pill Hóa Thần Đan tồn tại với bonus +35%'
);
assert(
  Boolean(BREAKTHROUGH_TALISMANS_CONFIG['item_tu_linh_tran_ban'] && BREAKTHROUGH_TALISMANS_CONFIG['item_tu_linh_tran_ban'].powerValue === 0.40),
  'Tụ Linh Trận Bàn tồn tại với hiệu ứng giảm 40% Linh Thạch'
);
assert(
  Boolean(BREAKTHROUGH_TALISMANS_CONFIG['item_ho_mach_phu'] && BREAKTHROUGH_TALISMANS_CONFIG['item_ho_mach_phu'].effectType === 'prevent_backlash'),
  'Hộ Mạch Phù tồn tại với hiệu ứng ngăn chặn phản phệ'
);
assert(
  Boolean(BREAKTHROUGH_TALISMANS_CONFIG['item_dinh_tam_phu'] && BREAKTHROUGH_TALISMANS_CONFIG['item_dinh_tam_phu'].effectType === 'cleanse_inner_demon'),
  'Định Tâm Phù tồn tại với hiệu ứng triệt tiêu đan độc'
);

// -----------------------------------------------------------------------------
// TEST 2: NINE-VEIN ABSOLUTE GUARANTEE
// -----------------------------------------------------------------------------
console.log('\n▶ Test 2: Nine-Vein Absolute Guarantee (Đan Cửu Văn)');
const nineVeinPill = {
  itemId: 'item_truc_co_dan',
  name: 'Trúc Cơ Đan (Cửu Văn)',
  veinMetadata: { veinCount: 9 }
};

const nineVeinResult = calculateBreakthroughChances({
  baseRate: 0.10, // Cơ bản chỉ 10%
  baseSpiritStones: 10000,
  playerToxicity: 80, // Đan độc cực cao 80%
  selectedPill: nineVeinPill
});

assert(nineVeinResult.finalRate === 1.0, 'Đan 9 văn đạt tỷ lệ tuyệt đối 100% (finalRate = 1.0)');
assert(nineVeinResult.isGuaranteedSuccess === true, 'Đan 9 văn kích hoạt cờ isGuaranteedSuccess = true');
assert(nineVeinResult.isBacklashProtected === true, 'Đan 9 văn kích hoạt cờ isBacklashProtected = true');
assert(nineVeinResult.nineVeinsBonusRate === 1.0, 'nineVeinsBonusRate = 1.0');
assert(nineVeinResult.toxicityPenaltyRate === 0, 'Đan 9 văn hoàn toàn miễn nhiễm phạt Đan Độc (toxicityPenaltyRate = 0)');

// -----------------------------------------------------------------------------
// TEST 3: STANDARD PILL & 6-8 VEINS BONUS
// -----------------------------------------------------------------------------
console.log('\n▶ Test 3: Standard Pill & 6-8 Veins Bonus');
// Đan thường không đan văn
const standardPillResult = calculateBreakthroughChances({
  baseRate: 0.40,
  baseSpiritStones: 5000,
  playerToxicity: 0,
  selectedPill: { itemId: 'item_truc_co_dan' }
});
assert(standardPillResult.pillBonusRate === 0.30, 'Trúc Cơ Đan thường cộng chính xác +30%');
assert(standardPillResult.finalRate === 0.70, 'finalRate chuẩn xác 40% + 30% = 70%');

// Đan 7 đan văn (nằm trong dải 6-8 văn)
const sevenVeinPillResult = calculateBreakthroughChances({
  baseRate: 0.40,
  baseSpiritStones: 5000,
  playerToxicity: 0,
  selectedPill: {
    itemId: 'item_truc_co_dan',
    veinMetadata: { veinCount: 7 }
  }
});
// 0.30 + 0.15 = 0.45
assert(
  Math.abs(sevenVeinPillResult.pillBonusRate - 0.45) < 0.001,
  'Đan 7 văn nhận thêm +15% bonus (tổng +45%)'
);
assert(
  Math.abs(sevenVeinPillResult.finalRate - 0.85) < 0.001,
  'finalRate đạt 40% + 45% = 85%'
);
assert(
  sevenVeinPillResult.backlashReductionPercent >= 50,
  'Đan 6-8 văn bảo vệ tối thiểu 50% giảm phản phệ'
);

// -----------------------------------------------------------------------------
// TEST 4: TOXICITY PENALTY & CLEANSE BY DINH TAM PHU
// -----------------------------------------------------------------------------
console.log('\n▶ Test 4: Toxicity Penalty & Cleanse via Định Tâm Phù');
// Có độc tính 50%, không có phù chú
const toxicResult = calculateBreakthroughChances({
  baseRate: 0.50,
  baseSpiritStones: 2000,
  playerToxicity: 50
});
// toxicityPenalty = 0.50 * (50 / 100) = 0.25 -> finalRate = 0.50 - 0.25 = 0.25
assert(
  Math.abs(toxicResult.toxicityPenaltyRate - 0.25) < 0.001,
  'Đan độc 50% phạt 50% của baseRate (0.25)'
);
assert(
  Math.abs(toxicResult.finalRate - 0.25) < 0.001,
  'finalRate bị giảm từ 50% xuống còn 25%'
);

// Có độc tính 50%, nhưng sử dụng Định Tâm Phù
const cleansedResult = calculateBreakthroughChances({
  baseRate: 0.50,
  baseSpiritStones: 2000,
  playerToxicity: 50,
  selectedTalisman: { itemId: 'item_dinh_tam_phu' }
});
assert(cleansedResult.toxicityPenaltyRate === 0, 'Định Tâm Phù triệt tiêu hoàn toàn phạt đan độc (penalty = 0)');
assert(cleansedResult.finalRate === 0.50, 'finalRate phục hồi trọn vẹn 50%');

// -----------------------------------------------------------------------------
// TEST 5: SPIRIT STONE COST REDUCTION VIA TU LINH TRAN BAN
// -----------------------------------------------------------------------------
console.log('\n▶ Test 5: Spirit Stone Discount via Tụ Linh Trận Bàn');
const spiritStoneResult = calculateBreakthroughChances({
  baseRate: 0.50,
  baseSpiritStones: 10000,
  playerToxicity: 0,
  selectedTalisman: { itemId: 'item_tu_linh_tran_ban' }
});
// 10000 * (1 - 0.40) = 6000
assert(
  spiritStoneResult.spiritStoneCost === 6000,
  'Tụ Linh Trận Bàn giảm 40% chi phí Linh Thạch (10,000 -> 6,000)'
);

// -----------------------------------------------------------------------------
// TEST 6: BACKLASH RESOLUTION (PROTECTED VS UNPROTECTED)
// -----------------------------------------------------------------------------
console.log('\n▶ Test 6: Backlash Resolution');
// Trường hợp được bảo vệ bởi Hộ Mạch Phù
const protectedBacklash = resolveBreakthroughBacklash(10000, 50000, true);
assert(protectedBacklash.hpLoss === 0, 'Có bảo vệ: Mất 0 HP');
assert(protectedBacklash.tuviLoss === 0, 'Có bảo vệ: Mất 0 Tu Vi');

// Trường hợp không có bảo vệ
const unprotectedBacklash = resolveBreakthroughBacklash(10000, 50000, false);
assert(unprotectedBacklash.hpLoss === 3500, 'Không bảo vệ: Mất chính xác 35% HP (10,000 -> 3,500)');
assert(unprotectedBacklash.tuviLoss === 10000, 'Không bảo vệ: Mất chính xác 20% Tu Vi (50,000 -> 10,000)');

// Trường hợp có giảm trừ phản phệ từ đan dược (ví dụ 50%)
const mitigatedBacklash = resolveBreakthroughBacklash(10000, 50000, false, 50);
assert(mitigatedBacklash.hpLoss === 1750, 'Giảm trừ 50%: HP mất 1,750 (50% của 3,500)');
assert(mitigatedBacklash.tuviLoss === 5000, 'Giảm trừ 50%: Tu Vi mất 5,000 (50% của 10,000)');

// -----------------------------------------------------------------------------
// TEST 7: DETERMINISTIC BREAKTHROUGH EXECUTION
// -----------------------------------------------------------------------------
console.log('\n▶ Test 7: Deterministic Breakthrough Execution');
const guaranteedExecution = executeBreakthroughWithCatalysts({
  previousRealm: 'Luyện Khí Tầng 9',
  newRealm: 'Trúc Cơ Sơ Kỳ',
  requiredTuVi: 10000,
  baseSpiritStones: 5000,
  baseRate: 0.20,
  playerHp: 5000,
  playerTuvi: 12000,
  playerToxicity: 0,
  selectedPill: nineVeinPill,
  selectedTalisman: { itemId: 'item_tu_linh_tran_ban' },
  roll: 0.99 // Dù roll 0.99 vẫn thành công vì 9 văn
});
assert(guaranteedExecution.success === true, 'Đan 9 văn đảm bảo thành công dù roll xấu');
assert(guaranteedExecution.spiritStonesConsumed === 3000, 'Khấu trừ đúng 3,000 Linh Thạch (5000 - 40%)');
assert(guaranteedExecution.tuviConsumed === 10000, 'Tiêu hao đủ 10,000 Tu Vi');

const failedExecution = executeBreakthroughWithCatalysts({
  previousRealm: 'Trúc Cơ Viên Mãn',
  newRealm: 'Kim Đan Sơ Kỳ',
  requiredTuVi: 50000,
  baseSpiritStones: 20000,
  baseRate: 0.30,
  playerHp: 10000,
  playerTuvi: 60000,
  playerToxicity: 0,
  selectedPill: { itemId: 'item_kim_dan_hoan' }, // +25% -> 55%
  selectedTalisman: { itemId: 'item_ho_mach_phu' },
  roll: 0.80 // Roll 0.80 > 0.55 -> Thất bại
});
assert(failedExecution.success === false, 'Thất bại khi roll > finalRate');
assert(failedExecution.isBacklashTriggered === false, 'Hộ Mạch Phù ngăn chặn kích hoạt phản phệ');
assert(failedExecution.backlashHpLoss === 0, 'HP tổn thất là 0 do Hộ Mạch Phù');
assert(failedExecution.backlashTuviLoss === 0, 'Tu Vi tổn thất là 0 do Hộ Mạch Phù');

console.log('\n================================================================');
console.log(`KẾT QUẢ: ${passCount} PASSED / ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
}
