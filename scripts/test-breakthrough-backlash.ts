// scripts/test-breakthrough-backlash.ts
// QA Automation & Engine Specialist: Test Suite kiểm thử toàn diện module
// "Tác Động Của Đan Độc & Tâm Ma Phản Phệ (Inner Demon & Pill Toxicity Backlash System)"
// Chạy trực tiếp bằng: npx tsx scripts/test-breakthrough-backlash.ts

import {
  evaluateToxicityBreakthroughModifier,
  calculateFinalBreakthroughRate,
  resolveBreakthroughFailureBacklash,
  healPlayerInjury,
  dispelDemonicBottleneck,
  createInitialPlayerInjuryState
} from '../lib/breakthrough-backlash-logic';
import {
  PlayerInjuryState,
  ToxicityModifierResult,
  BacklashResolutionResult
} from '../lib/types/breakthrough-backlash';
import {
  migrateBreakthroughBacklashData,
  normalizePlayerData
} from '../lib/save-migration';
import { calculateCombatStats } from '../lib/destiny-data';
import {
  attemptBreakthrough,
  canBreakthrough,
  executeBreakthrough
} from '../lib/game-logic/cultivation';
import {
  useBreakthroughBacklashActions,
  deductItemFromInventory
} from '../hooks/useBreakthroughBacklashActions';
import { PlayerStats, Realm } from '../lib/types';

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
console.log('🧪 TEST SUITE: INNER DEMON & PILL TOXICITY BACKLASH SYSTEM');
console.log('   GAMETUTIEN ENGINE - AUTOMATION TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: Low Toxicity Bonus (< 10%)
// -----------------------------------------------------------------------------
runTest('Test 1: Low Toxicity Bonus (< 10%)', () => {
  // Toxicity = 5, Base Rate 80% (0.80) -> rateModifier đạt đúng +0.10, finalRate đạt chính xác 0.90 (90%)
  const mod: ToxicityModifierResult = evaluateToxicityBreakthroughModifier(5);

  if (mod.rateModifier !== 0.10) {
    throw new Error(`rateModifier mong muốn +0.10, thực tế nhận được ${mod.rateModifier}`);
  }
  if (mod.statusTag !== 'tinh_khiet') {
    throw new Error(`statusTag mong muốn 'tinh_khiet', thực tế nhận được '${mod.statusTag}'`);
  }
  if (!mod.warningMessage || !mod.warningMessage.includes('+10% Tỉ lệ')) {
    throw new Error(`warningMessage không chứa thông điệp tăng tỷ lệ phù hợp: "${mod.warningMessage}"`);
  }

  const rateCalc = calculateFinalBreakthroughRate(0.80, 5);
  if (rateCalc.finalRate !== 0.90) {
    throw new Error(`finalRate mong muốn 0.90 (0.80 + 0.10), thực tế nhận được ${rateCalc.finalRate}`);
  }
  if (rateCalc.toxicityMod.rateModifier !== 0.10) {
    throw new Error(`toxicityMod trong kết quả tính toán không khớp: ${rateCalc.toxicityMod.rateModifier}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 2: High & Extreme Toxicity Penalties
// -----------------------------------------------------------------------------
runTest('Test 2: High & Extreme Toxicity Penalties', () => {
  // 1. Toxicity = 50 (41-70%) -> rateModifier bằng đúng -0.20
  const mod50: ToxicityModifierResult = evaluateToxicityBreakthroughModifier(50);
  if (mod50.rateModifier !== -0.20) {
    throw new Error(`Toxicity 50: rateModifier mong muốn -0.20, thực tế nhận được ${mod50.rateModifier}`);
  }
  if (mod50.statusTag !== 'tac_nghen') {
    throw new Error(`Toxicity 50: statusTag mong muốn 'tac_nghen', thực tế nhận được '${mod50.statusTag}'`);
  }

  // Boundary checks cho ngưỡng 41-70%
  const mod41 = evaluateToxicityBreakthroughModifier(41);
  const mod70 = evaluateToxicityBreakthroughModifier(70);
  if (mod41.rateModifier !== -0.20 || mod70.rateModifier !== -0.20) {
    throw new Error(`Biên 41-70%: Phạt không đồng nhất -0.20 (41: ${mod41.rateModifier}, 70: ${mod70.rateModifier})`);
  }

  // 2. Toxicity = 85 (> 70%) -> rateModifier bằng đúng -0.40
  const mod85: ToxicityModifierResult = evaluateToxicityBreakthroughModifier(85);
  if (mod85.rateModifier !== -0.40) {
    throw new Error(`Toxicity 85: rateModifier mong muốn -0.40, thực tế nhận được ${mod85.rateModifier}`);
  }
  if (mod85.statusTag !== 'tam_ma_nguy_hiem') {
    throw new Error(`Toxicity 85: statusTag mong muốn 'tam_ma_nguy_hiem', thực tế nhận được '${mod85.statusTag}'`);
  }

  // Boundary check cho ngưỡng > 70%
  const mod71 = evaluateToxicityBreakthroughModifier(71);
  if (mod71.rateModifier !== -0.40 || mod71.statusTag !== 'tam_ma_nguy_hiem') {
    throw new Error(`Biên > 70% (Tox 71): Phạt không đạt -0.40 hoặc sai tag (${mod71.rateModifier}, '${mod71.statusTag}')`);
  }
});

// -----------------------------------------------------------------------------
// TEST 3: Severe Backlash & HP Floor Guard (Toxicity > 40%)
// -----------------------------------------------------------------------------
runTest('Test 3: Severe Backlash & HP Floor Guard (Toxicity > 40%)', () => {
  // Current HP = 10,000, Current Tu Vi = 100,000, Toxicity = 60%, thất bại:
  // - hpLoss bằng 5,000 (50%), resultingHp bằng 5,000
  // - tuviLoss bằng 35,000 (35%)
  // - isInjuredApplied === true
  const curHp = 10000;
  const curTuvi = 100000;
  const res: BacklashResolutionResult = resolveBreakthroughFailureBacklash(curHp, curTuvi, 60, 'Trúc Cơ Kỳ');

  if (res.backlashType !== 'trong_thuong') {
    throw new Error(`backlashType mong muốn 'trong_thuong', thực tế nhận được '${res.backlashType}'`);
  }
  if (res.hpLoss !== 5000) {
    throw new Error(`hpLoss mong muốn 5,000 (50%), thực tế nhận được ${res.hpLoss}`);
  }
  if (res.resultingHp !== 5000) {
    throw new Error(`resultingHp mong muốn 5,000, thực tế nhận được ${res.resultingHp}`);
  }
  if (res.tuviLoss !== 35000) {
    throw new Error(`tuviLoss mong muốn 35,000 (35%), thực tế nhận được ${res.tuviLoss}`);
  }
  if (!res.isInjuredApplied) {
    throw new Error(`isInjuredApplied mong muốn true cho Toxicity > 40%, thực tế nhận được false`);
  }
  if (res.isBottleneckApplied) {
    throw new Error(`isBottleneckApplied mong muốn false khi Toxicity <= 70%, thực tế nhận được true`);
  }

  // Edge case HP thấp: Current HP = 1 -> resultingHp bắt buộc bằng 1 (không được về 0 hoặc âm)
  const edgeRes1 = resolveBreakthroughFailureBacklash(1, 100000, 60, 'Trúc Cơ Kỳ');
  if (edgeRes1.resultingHp !== 1) {
    throw new Error(`HP Floor Guard thất bại: resultingHp của người chơi máu 1 mong muốn 1, thực tế là ${edgeRes1.resultingHp}`);
  }
  if (edgeRes1.resultingHp <= 0) {
    throw new Error(`HP Floor Guard nghiêm trọng: resultingHp bị rơi về <= 0 (${edgeRes1.resultingHp})!`);
  }
  if (edgeRes1.hpLoss !== 0) {
    throw new Error(`hpLoss khi máu 1 phải là 0 để bảo toàn sàn 1 máu, thực tế là ${edgeRes1.hpLoss}`);
  }

  // Edge case HP = 10 (mất 50% = 5 HP -> resultingHp = 5)
  const edgeRes2 = resolveBreakthroughFailureBacklash(10, 100000, 60, 'Trúc Cơ Kỳ');
  if (edgeRes2.resultingHp !== 5 || edgeRes2.hpLoss !== 5) {
    throw new Error(`resultingHp của người chơi máu 10 mong muốn 5, thực tế là ${edgeRes2.resultingHp}, hpLoss=${edgeRes2.hpLoss}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 4: Demonic Bottleneck Trigger & Rate Halving (Toxicity > 70%)
// -----------------------------------------------------------------------------
runTest('Test 4: Demonic Bottleneck Trigger & Rate Halving (Toxicity > 70%)', () => {
  // Toxicity = 80%, thất bại -> isBottleneckApplied === true
  const res: BacklashResolutionResult = resolveBreakthroughFailureBacklash(10000, 100000, 80, 'Kim Đan Kỳ');

  if (res.backlashType !== 'tam_ma') {
    throw new Error(`backlashType mong muốn 'tam_ma', thực tế nhận được '${res.backlashType}'`);
  }
  if (!res.isBottleneckApplied) {
    throw new Error(`isBottleneckApplied mong muốn true khi Toxicity > 70%, thực tế nhận được false`);
  }
  if (!res.isInjuredApplied) {
    throw new Error(`isInjuredApplied mong muốn true khi dính tâm ma, thực tế nhận được false`);
  }

  // Đưa hasBottleneck = true vào tính toán tỷ lệ lần sau: Tỷ lệ tổng sau khi cộng trừ bị chia đôi (x 0.5)
  // Ví dụ: Base Rate 80% (0.80), dùng Đan Phù (+20% bonus = 0.20), Đan độc 0 (mod = +0.10)
  // Tổng Raw = 0.80 + 0.10 + 0.20 = 1.10 -> khi có bottleneck: 1.10 * 0.5 = 0.55
  const calcWithBottleneck = calculateFinalBreakthroughRate(0.80, 5, 0.20, true);
  if (calcWithBottleneck.finalRate !== 0.55) {
    throw new Error(`Tỉ lệ khi dính Bình Cảnh Tâm Ma mong muốn 0.55 (1.10 * 0.5), thực tế nhận được ${calcWithBottleneck.finalRate}`);
  }

  // Ví dụ 2: Base Rate 60% (0.60), Đan độc bình thường 30% (mod = 0.0), không bonus (0)
  // Tổng Raw = 0.60 -> khi có bottleneck: 0.60 * 0.5 = 0.30
  const calcWithBottleneck2 = calculateFinalBreakthroughRate(0.60, 30, 0, true);
  if (calcWithBottleneck2.finalRate !== 0.30) {
    throw new Error(`Tỉ lệ khi dính Bình Cảnh Tâm Ma mong muốn 0.30 (0.60 * 0.5), thực tế nhận được ${calcWithBottleneck2.finalRate}`);
  }

  // Không dính bottleneck thì giữ nguyên 0.60
  const calcWithoutBottleneck = calculateFinalBreakthroughRate(0.60, 30, 0, false);
  if (calcWithoutBottleneck.finalRate !== 0.60) {
    throw new Error(`Tỉ lệ không dính tâm ma mong muốn 0.60, thực tế nhận được ${calcWithoutBottleneck.finalRate}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 5: Healing & Cleansing Execution
// -----------------------------------------------------------------------------
runTest('Test 5: Healing & Cleansing Execution', () => {
  // Khởi tạo mock injuryState đang bị trọng thương và dính tâm ma:
  const initialInjuryState: PlayerInjuryState = {
    isInjured: true,
    injurySeverity: 2, // Trọng thương
    hasDemonicBottleneck: true,
    bottleneckPenaltyPercent: 50,
    injuredAt: Date.now() - 3600000,
    backlashHistory: [
      {
        timestamp: Date.now() - 3600000,
        failedRealm: 'Nguyên Anh Kỳ',
        toxicityAtAttempt: 85,
        hpLost: 8000,
        tuviLost: 50000,
        backlashType: 'tam_ma'
      }
    ]
  };

  // 1. Gọi healPlayerInjury -> isInjured === false, injurySeverity === 0
  const healedState = healPlayerInjury(initialInjuryState);

  if (healedState.isInjured !== false) {
    throw new Error(`healPlayerInjury: isInjured mong muốn false, thực tế nhận được ${healedState.isInjured}`);
  }
  if (healedState.injurySeverity !== 0) {
    throw new Error(`healPlayerInjury: injurySeverity mong muốn 0, thực tế nhận được ${healedState.injurySeverity}`);
  }
  // Đảm bảo không mutate nhầm demonic bottleneck trong heal
  if (healedState.hasDemonicBottleneck !== true) {
    throw new Error(`healPlayerInjury: hasDemonicBottleneck phải được giữ nguyên khi chỉ trị thương`);
  }
  // Bảo toàn tính bất biến (Immutability): Object ban đầu không bị mutate
  if (initialInjuryState.isInjured !== true || initialInjuryState.injurySeverity !== 2) {
    throw new Error(`Tính bất biến bị vi phạm: initialInjuryState đã bị mutate trực tiếp!`);
  }
  // Lịch sử phản phệ phải được bảo toàn
  if (healedState.backlashHistory.length !== 1 || healedState.backlashHistory[0].failedRealm !== 'Nguyên Anh Kỳ') {
    throw new Error(`Lịch sử backlashHistory bị thất lạc sau khi trị thương`);
  }

  // 2. Gọi dispelDemonicBottleneck -> hasDemonicBottleneck === false, bottleneckPenaltyPercent === 0
  const cleansedState = dispelDemonicBottleneck(healedState);

  if (cleansedState.hasDemonicBottleneck !== false) {
    throw new Error(`dispelDemonicBottleneck: hasDemonicBottleneck mong muốn false, thực tế nhận được ${cleansedState.hasDemonicBottleneck}`);
  }
  if (cleansedState.bottleneckPenaltyPercent !== 0) {
    throw new Error(`dispelDemonicBottleneck: bottleneckPenaltyPercent mong muốn 0, thực tế nhận được ${cleansedState.bottleneckPenaltyPercent}`);
  }
  // Bảo toàn tính bất biến
  if (healedState.hasDemonicBottleneck !== true) {
    throw new Error(`Tính bất biến bị vi phạm: healedState đã bị mutate trực tiếp!`);
  }
});

// -----------------------------------------------------------------------------
// TEST 6: Rate Boundary Clamping
// -----------------------------------------------------------------------------
runTest('Test 6: Rate Boundary Clamping', () => {
  // Đảm bảo finalRate luôn nằm trong đoạn [0.05, 1.0] bất chấp các hệ số âm cực đại hoặc dương vượt ngưỡng

  // 1. Phạt cực đoan khiến RawRate âm: Base 10% (0.10), Đan độc 95% (-0.40) -> Raw = -0.30
  // Sàn tối thiểu phải là 0.05 (5%)
  const minClamped = calculateFinalBreakthroughRate(0.10, 95, 0, false);
  if (minClamped.finalRate !== 0.05) {
    throw new Error(`Sàn tỉ lệ tối thiểu mong muốn 0.05, thực tế nhận được ${minClamped.finalRate}`);
  }

  // Thậm chí có thêm bottleneck: (-0.30) * 0.5 -> vẫn bị chặn sàn 0.05
  const minClampedWithBottleneck = calculateFinalBreakthroughRate(0.10, 95, 0, true);
  if (minClampedWithBottleneck.finalRate !== 0.05) {
    throw new Error(`Sàn tỉ lệ với bottleneck mong muốn 0.05, thực tế nhận được ${minClampedWithBottleneck.finalRate}`);
  }

  // 2. Thưởng cực lớn vượt 100%: Base 95% (0.95), Đan độc thuần tịnh (+0.10), Đan dược (+0.30) -> Raw = 1.35
  // Trần tối đa phải là 1.0 (100%)
  const maxClamped = calculateFinalBreakthroughRate(0.95, 5, 0.30, false);
  if (maxClamped.finalRate !== 1.0) {
    throw new Error(`Trần tỉ lệ tối đa mong muốn 1.0, thực tế nhận được ${maxClamped.finalRate}`);
  }

  // 3. Tỷ lệ cơ bản truyền dạng % (ví dụ 80 thay vì 0.80) -> Hàm phải tự động chuẩn hóa về 0.80
  const normalizedCalc = calculateFinalBreakthroughRate(80, 5, 0);
  if (normalizedCalc.finalRate !== 0.90) {
    throw new Error(`Tự động chuẩn hóa input baseRate dạng % (80 -> 0.80) thất bại: ${normalizedCalc.finalRate}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 7: Save Migration, Combat Engine Debuff & Breakthrough Gate
// -----------------------------------------------------------------------------
runTest('Test 7: Save Migration, Combat Engine Debuff & Breakthrough Gate', () => {
  // 1. SAVE MIGRATION: Khởi tạo an toàn injuryState nếu chưa có
  const unmigratedPlayer = {
    tuVi: 50000,
    canCot: 60,
    ngoTinh: 60,
    tamCanh: 60,
    khiVan: 60,
    linhThach: 100000,
    danhVong: 1000,
    currentRealm: 1,
    khiHuyet: 2000
  } as any;

  const migratedPlayer = migrateBreakthroughBacklashData(unmigratedPlayer);

  if (!migratedPlayer.injuryState) {
    throw new Error('migrateBreakthroughBacklashData không khởi tạo injuryState!');
  }
  if (migratedPlayer.injuryState.isInjured !== false) {
    throw new Error(`injuryState.isInjured mong muốn false, thực tế nhận được ${migratedPlayer.injuryState.isInjured}`);
  }
  if (migratedPlayer.injuryState.injurySeverity !== 0) {
    throw new Error(`injuryState.injurySeverity mong muốn 0, thực tế nhận được ${migratedPlayer.injuryState.injurySeverity}`);
  }
  if (migratedPlayer.injuryState.hasDemonicBottleneck !== false) {
    throw new Error(`injuryState.hasDemonicBottleneck mong muốn false, thực tế nhận được ${migratedPlayer.injuryState.hasDemonicBottleneck}`);
  }
  if (!Array.isArray(migratedPlayer.injuryState.backlashHistory) || migratedPlayer.injuryState.backlashHistory.length !== 0) {
    throw new Error('injuryState.backlashHistory mong muốn mảng rỗng!');
  }

  // Idempotence test: Chạy lại nhiều lần không làm mất dữ liệu
  migratedPlayer.injuryState.isInjured = true;
  migratedPlayer.injuryState.injurySeverity = 2;
  const reMigrated = migrateBreakthroughBacklashData(migratedPlayer);
  if (!reMigrated.injuryState || reMigrated.injuryState.isInjured !== true || reMigrated.injuryState.injurySeverity !== 2) {
    throw new Error('Tính Idempotent thất bại: Chạy lại migration làm ghi đè dữ liệu thương thế hiện tại!');
  }

  // Tích hợp normalizePlayerData: Tự động khởi tạo injuryState
  const normalized = normalizePlayerData({});
  if (!normalized.injuryState || typeof normalized.injuryState.isInjured !== 'boolean') {
    throw new Error('normalizePlayerData không tích hợp migrateBreakthroughBacklashData chính xác!');
  }

  // 2. COMBAT ENGINE: Debuff Trọng Thương -30% ATK & DEF
  const combatMockPlayer: PlayerStats = {
    currentRealm: 5,
    canCot: 80,
    ngoTinh: 80,
    tamCanh: 80,
    khiVan: 80,
    tuVi: 100000,
    linhThach: 50000,
    danhVong: 1000,
    khiHuyet: 5000,
    injuryState: {
      isInjured: false,
      injurySeverity: 0,
      hasDemonicBottleneck: false,
      bottleneckPenaltyPercent: 0,
      backlashHistory: []
    }
  };

  const healthyStats = calculateCombatStats(combatMockPlayer);

  // Kích hoạt trạng thái trọng thương
  combatMockPlayer.injuryState!.isInjured = true;
  const injuredStats = calculateCombatStats(combatMockPlayer);

  const expectedAtk = Math.round(healthyStats.atk * 0.70);
  const expectedDef = Math.round(healthyStats.def * 0.70);

  if (injuredStats.atk !== expectedAtk) {
    throw new Error(`Debuff Combat ATK thất bại: mong muốn ${expectedAtk} (-30% của ${healthyStats.atk}), thực tế nhận được ${injuredStats.atk}`);
  }
  if (injuredStats.def !== expectedDef) {
    throw new Error(`Debuff Combat DEF thất bại: mong muốn ${expectedDef} (-30% của ${healthyStats.def}), thực tế nhận được ${injuredStats.def}`);
  }

  // 3. BREAKTHROUGH GATE: Chặn đột phá khi trọng thương
  const mockNextRealm: Realm = {
    id: 6,
    name: 'Trúc Cơ Sơ Kỳ',
    requirements: {
      tuVi: 10000,
      linhThach: 1000
    },
    successText: 'Trúc Cơ thành công!'
  } as any;

  // Khi đang trọng thương: canBreakthrough phải trả về false
  const canBreakResult = canBreakthrough(combatMockPlayer, mockNextRealm);
  if (canBreakResult.canBreak !== false) {
    throw new Error('canBreakthrough không chặn khi người chơi đang trọng thương!');
  }
  if (!canBreakResult.reason || !canBreakResult.reason.includes('Kinh mạch đang trọng thương')) {
    throw new Error(`canBreakthrough reason không đúng quy chuẩn: "${canBreakResult.reason}"`);
  }

  // Khi đang trọng thương: attemptBreakthrough lập tức từ chối
  const attemptResult = attemptBreakthrough(combatMockPlayer, mockNextRealm);
  if (attemptResult.success !== false) {
    throw new Error('attemptBreakthrough không từ chối khi đang trọng thương!');
  }
  if (!attemptResult.message.includes('Kinh mạch đang trọng thương')) {
    throw new Error(`attemptBreakthrough message không đúng quy chuẩn: "${attemptResult.message}"`);
  }

  // Kiểm tra alias executeBreakthrough
  const executeResult = executeBreakthrough(combatMockPlayer, mockNextRealm);
  if (executeResult.success !== false || !executeResult.message.includes('Kinh mạch đang trọng thương')) {
    throw new Error('executeBreakthrough alias không hoạt động đồng bộ với attemptBreakthrough!');
  }

  // Trị thương: canBreakthrough cho phép đột phá trở lại
  combatMockPlayer.injuryState!.isInjured = false;
  const canBreakHealed = canBreakthrough(combatMockPlayer, mockNextRealm);
  if (canBreakHealed.canBreak !== true) {
    throw new Error(`Sau khi trị thương, canBreakthrough vẫn bị chặn: ${canBreakHealed.reason}`);
  }
});

// -----------------------------------------------------------------------------
// TEST 8: Hook Contract & Inventory Deduction Pipeline (useBreakthroughBacklashActions)
// -----------------------------------------------------------------------------
runTest('Test 8: Hook Contract & Inventory Deduction Pipeline (useBreakthroughBacklashActions)', () => {
  // 1. Kiểm tra export contract của hook
  if (typeof useBreakthroughBacklashActions !== 'function') {
    throw new Error('useBreakthroughBacklashActions không phải là function hợp lệ!');
  }
  if (typeof deductItemFromInventory !== 'function') {
    throw new Error('deductItemFromInventory helper không được export!');
  }

  // 2. Kiểm thử khấu trừ vật phẩm trị thương từ kho đồ
  const mockInventory = {
    pills: [
      { id: 'item_dai_hoan_dan', name: 'Đại Hoàn Đan', quantity: 2, effectValue: 3000 },
      { id: 'item_truc_co_dan', name: 'Trúc Cơ Đan', quantity: 1 }
    ],
    talismans: [
      { id: 'item_thanh_tam_phu', name: 'Thanh Tâm Phù', quantity: 1 }
    ]
  };

  // Khấu trừ 1 viên Đại Hoàn Đan
  const { updatedInventory: inv1, deductedItem: item1 } = deductItemFromInventory(mockInventory, 'item_dai_hoan_dan');
  if (!item1 || item1.id !== 'item_dai_hoan_dan') {
    throw new Error('Không khấu trừ được item_dai_hoan_dan!');
  }
  if (inv1.pills.find((p: any) => p.id === 'item_dai_hoan_dan')?.quantity !== 1) {
    throw new Error('Số lượng item_dai_hoan_dan sau khấu trừ không bằng 1!');
  }
  // Đảm bảo tính bất biến (Zero Mutation)
  if (mockInventory.pills[0].quantity !== 2) {
    throw new Error('Tính bất biến bị vi phạm: mockInventory ban đầu bị mutate trực tiếp!');
  }

  // Khấu trừ viên thứ 2 -> xóa khỏi danh sách khi hết
  const { updatedInventory: inv2, deductedItem: item2 } = deductItemFromInventory(inv1, 'item_dai_hoan_dan');
  if (!item2 || item2.id !== 'item_dai_hoan_dan') {
    throw new Error('Khấu trừ viên thứ 2 thất bại!');
  }
  if (inv2.pills.some((p: any) => p.id === 'item_dai_hoan_dan')) {
    throw new Error('item_dai_hoan_dan vẫn còn trong danh sách khi số lượng đã về 0!');
  }

  // Khấu trừ vật phẩm không tồn tại -> trả về null an toàn
  const { deductedItem: missingItem } = deductItemFromInventory(inv2, 'item_khong_ton_tai');
  if (missingItem !== null) {
    throw new Error('Khấu trừ item không tồn tại phải trả về null!');
  }

  // 3. Khấu trừ phù chú thanh tâm
  const { updatedInventory: invTalisman, deductedItem: tal1 } = deductItemFromInventory(mockInventory, 'item_thanh_tam_phu');
  if (!tal1 || tal1.id !== 'item_thanh_tam_phu') {
    throw new Error('Không khấu trừ được item_thanh_tam_phu!');
  }
  if (invTalisman.talismans.some((t: any) => t.id === 'item_thanh_tam_phu')) {
    throw new Error('item_thanh_tam_phu vẫn còn trong mảng sau khi dùng hết!');
  }
});

// =============================================================================
// TỔNG KẾT KẾT QUẢ TEST SUITE
// =============================================================================
console.log('\n================================================================');
console.log(`KẾT QUẢ TỔNG HỢP: ${passedTests} PASSED / ${failedTests} FAILED`);
console.log('================================================================');

if (failedTests === 0) {
  console.log('✅ TẤT CẢ TEST CASES ĐỀU ĐẠT CHUẨN KỸ THUẬT VÀ INVARIANTS!');
  process.exit(0);
} else {
  console.error(`❌ CÓ ${failedTests} TEST CASES THẤT BẠI! CẦN KIỂM TRA LẠI LOGIC.`);
  process.exit(1);
}

