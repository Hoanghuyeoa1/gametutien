// scripts/test-soul-infusion.ts
// Test Suite: Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion & Artifact Spirit Awakening)
// 100% Strict TypeScript, Pure Business Logic Invariants, Automated Unit Testing
// Compliance: Next.js 16, React 19, TypeScript Strict Mode

import { Equipment } from '../lib/types/items';
import {
  SOUL_REGISTRY,
  applySoulInfusion,
  feedAndEvolveSpirit,
  getSpiritDialogue,
  evaluateSpiritAutoGuardian
} from '../lib/soul-infusion-logic';
import { SoulDialogueContext, SoulType } from '../lib/types/soul-infusion';
import { migrateSoulInfusionData } from '../lib/save-migration';
import { bindEquipmentAsNatal, calculateNatalCombatBonus } from '../lib/natal-artifact-logic';
import { executeSoulInfusionCombatTurn } from '../lib/game-logic/combat';
import { PlayerStats } from '../lib/types/player';
import {
  findTargetEquipmentInPlayer,
  updateTargetEquipmentInPlayer,
  findSoulVesselInPlayer,
  deductSoulVesselFromPlayer,
  deductNourishMaterialFromPlayer
} from '../hooks/useSoulInfusionActions';

// ============================================================================
// TEST HARNESS & ASSERTIONS
// ============================================================================

let passedCount = 0;
const TOTAL_TESTS = 10;

function runTestCase(testNumber: number, testName: string, testFn: () => void) {
  console.log(`\n---------------------------------------------------------------`);
  console.log(`🧪 Test ${testNumber}: ${testName}`);
  console.log(`---------------------------------------------------------------`);
  try {
    testFn();
    console.log(`  ==> [PASS] Test ${testNumber}: ${testName}`);
    passedCount++;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`  ==> [FAIL] Test ${testNumber}: ${testName}`);
    console.error(`      Lỗi: ${errorMsg}`);
    process.exit(1);
  }
}

function assertEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    throw new Error(`${msg} - Kỳ vọng [${expected}], thực tế nhận được [${actual}]`);
  }
}

function assertTrue(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Khẳng định thất bại: ${msg}`);
  }
}

console.log('===============================================================');
console.log('⚡ QA AUTOMATION TEST SUITE: PHONG HỒN ĐOẠT PHÁCH & THỨC TỈNH KHÍ LINH');
console.log('   GAMETUTIEN ENGINE - AUTOMATED INVARIANT VERIFICATION');
console.log('===============================================================');

// ============================================================================
// TEST 1: Soul Infusion Invariant
// Tế Hồn Hắc Giao vào Phi Kiếm -> Gán chính xác infusedSoul, evolutionStage: 1,
// hiệu ứng Long Uy có xác suất 20%.
// ============================================================================
runTestCase(1, 'Soul Infusion Invariant', () => {
  const phiKiem: Equipment = {
    id: 'wp_phi_kiem_01',
    name: 'Thanh Phong Phi Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 1200,
    grade: 'Bảo Khí',
    enhancement: 0,
    hpBonus: 300,
    mpBonus: 150,
    stats: { atk: 250, speed: 20 }
  };

  const hacGiaoSoul = SOUL_REGISTRY.hac_giao;

  // Tế Hồn Hắc Giao vào Phi Kiếm
  const timestamp = 1700000000000;
  const { updatedWeapon, oldSoulSalvaged } = applySoulInfusion(phiKiem, hacGiaoSoul, timestamp);

  // 1. Kiểm tra đối tượng vũ khí gốc không bị biến đổi (Immutability)
  assertEqual(phiKiem.infusedSoul, undefined, 'Vũ khí gốc ban đầu không được bị mutate');

  // 2. Kiểm tra gán chính xác infusedSoul
  assertTrue(!!updatedWeapon.infusedSoul, 'Vũ khí sau khi phong hồn phải có trường infusedSoul');
  assertEqual(oldSoulSalvaged, false, 'Lần đầu tế hồn, oldSoulSalvaged phải là false');

  const soulMeta = updatedWeapon.infusedSoul!;
  assertEqual(soulMeta.soulType, 'hac_giao', 'soulType phải là hac_giao');
  assertEqual(soulMeta.soulName, hacGiaoSoul.name, 'soulName phải khớp tên Hồn Phách');
  assertEqual(soulMeta.element, 'Thủy', 'element phải là Thủy');
  assertEqual(soulMeta.personality, 'ngao_kieu', 'Tính cách Hắc Giao phải là Ngạo Kiều');
  assertEqual(soulMeta.evolutionStage, 1, 'evolutionStage khởi đầu bắt buộc là Stage 1 (Hư Ảnh)');
  assertEqual(soulMeta.spiritExp, 0, 'spiritExp khởi đầu phải bằng 0');
  assertEqual(soulMeta.maxSpiritExp, 1000, 'maxSpiritExp khởi đầu phải là 1,000');
  assertEqual(soulMeta.hasAutoGuardianUnlocked, false, 'hasAutoGuardianUnlocked ban đầu phải là false');

  // 3. Kiểm tra hiệu ứng Long Uy
  assertEqual(soulMeta.currentProc.id, hacGiaoSoul.baseProc.id, 'ID proc phải là proc_hac_giao_long_uy');
  assertEqual(soulMeta.currentProc.name, hacGiaoSoul.baseProc.name, 'Tên chiêu thức proc phải chuẩn');
  assertEqual(soulMeta.currentProc.effectType, hacGiaoSoul.baseProc.effectType, 'Loại hiệu ứng');
  assertEqual(soulMeta.currentProc.triggerChance, 0.20, 'Hiệu ứng Long Uy có xác suất 20% (0.20)');
  assertEqual(soulMeta.currentProc.potencyValue, 0.30, 'Long Uy giảm 30% ATK');
  assertEqual(soulMeta.currentProc.durationTurns, 1, 'Long Uy làm mất 1 lượt hành động');

  console.log('  ✓ Tế Hồn Hắc Giao thành công: Gán chuẩn xác metadata, Stage 1, EXP 0, Long Uy triggerChance = 20%');
});

// ============================================================================
// TEST 2: Soul Overwrite Guard
// Vũ khí đang mang Hồn Hắc Giao, tế đè Hồn Hỏa Phượng -> Dọn sạch metadata Hắc Giao,
// nạp mới Hỏa Phượng thành công, không để sót dữ liệu rác.
// ============================================================================
runTestCase(2, 'Soul Overwrite Guard', () => {
  // Tạo vũ khí đã có Hắc Giao đã tích lũy EXP và tiến cấp
  const baseWeapon: Equipment = {
    id: 'wp_overwrite_test',
    name: 'Cửu Tiêu Thần Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 3000,
    grade: 'Cổ Bảo',
    enhancement: 5,
    hpBonus: 2000,
    mpBonus: 1000
  };

  const { updatedWeapon: weaponWithHacGiao } = applySoulInfusion(baseWeapon, SOUL_REGISTRY.hac_giao, 1000000);

  // Giả lập Khí Linh cũ đã tu luyện lên 750 EXP
  weaponWithHacGiao.infusedSoul!.spiritExp = 750;
  weaponWithHacGiao.infusedSoul!.awakenedName = 'Hắc Long Xuất Thế';

  // Tiến hành tế đè Hồn Hỏa Phượng (Nam Minh Hỏa Phượng)
  const hoaPhuongSoul = SOUL_REGISTRY.hoa_phuong;
  const overwriteTimestamp = 2000000;
  const { updatedWeapon: weaponWithHoaPhuong, oldSoulSalvaged } = applySoulInfusion(
    weaponWithHacGiao,
    hoaPhuongSoul,
    overwriteTimestamp
  );

  // 1. Kiểm tra cờ thu hồi Hồn cũ
  assertEqual(oldSoulSalvaged, true, 'Soul Overwrite Guard: oldSoulSalvaged phải là true khi ghi đè');

  // 2. Kiểm tra metadata mới của Hỏa Phượng
  const newSoul = weaponWithHoaPhuong.infusedSoul!;
  assertEqual(newSoul.soulType, 'hoa_phuong', 'soulType phải chuyển sang hoa_phuong');
  assertEqual(newSoul.soulName, hoaPhuongSoul.name, 'Tên Khí Linh mới phải là Cửu Thiên Hỏa Phượng');
  assertEqual(newSoul.element, 'Hỏa', 'Hệ nguyên tố mới phải là Hỏa');
  assertEqual(newSoul.personality, 'hao_chien', 'Tính cách mới phải là Háo Chiến');

  // 3. Đảm bảo toàn bộ tiến trình cũ đã được dọn sạch, không để sót dữ liệu rác
  assertEqual(newSoul.evolutionStage, 1, 'Khí linh mới phải khởi tạo lại từ Giai Đoạn 1');
  assertEqual(newSoul.spiritExp, 0, 'EXP cũ (750) phải bị dọn sạch, reset về 0');
  assertEqual(newSoul.maxSpiritExp, 1000, 'maxSpiritExp reset về 1000');
  assertEqual(newSoul.awakenedName, undefined, 'awakenedName cũ của Hắc Giao phải bị xóa');
  assertEqual(newSoul.hasAutoGuardianUnlocked, false, 'hasAutoGuardianUnlocked reset về false');

  // 4. Kiểm tra hiệu ứng proc mới của Hỏa Phượng thay thế hoàn toàn Hắc Giao
  assertEqual(newSoul.currentProc.id, hoaPhuongSoul.baseProc.id, 'Hiệu ứng proc phải chuyển sang proc_hoa_phuong_niet_ban');
  assertEqual(newSoul.currentProc.name, hoaPhuongSoul.baseProc.name, 'Tên chiêu thức là Niết Bàn Hỏa Thiểm');
  assertEqual(newSoul.currentProc.triggerChance, 0.30, 'Tỷ lệ kích hoạt Hỏa Phượng là 30%');
  assertEqual(newSoul.currentProc.potencyValue, 0.04, 'Đốt 4% Max HP/lượt');
  assertEqual(newSoul.currentProc.durationTurns, 3, 'Kéo dài trong 3 lượt');

  console.log('  ✓ Soul Overwrite Guard dọn sạch toàn bộ metadata cũ, nạp mới Khí Linh không sót dữ liệu rác');
});

// ============================================================================
// TEST 3: Spirit Evolution Progression
// Cung cấp 1,000 EXP -> Thăng lên Stage 2, potencyValue tăng đúng +50%.
// Cung cấp tiếp 5,000 EXP -> Thăng lên Stage 3, potencyValue tăng đúng +100% so với gốc.
// ============================================================================
runTestCase(3, 'Spirit Evolution Progression', () => {
  const mockWeapon = applySoulInfusion(
    {
      id: 'wp_evolve_test',
      name: 'Bạch Hổ Trảm Ma Kiếm',
      type: 'weapon',
      slot: 'weapon',
      powerBonus: 1500,
      grade: 'Bảo Khí',
      enhancement: 0,
      hpBonus: 500,
      mpBonus: 200
    },
    SOUL_REGISTRY.bach_ho
  ).updatedWeapon;

  let soul = mockWeapon.infusedSoul!;
  const basePotency = soul.baseProc.potencyValue; // 0.15 (+15% Crit Rate)
  assertEqual(basePotency, 0.15, 'potencyValue gốc của Bạch Hổ là 0.15');

  // Bước 1: Cung cấp 1,000 EXP -> Đột phá Stage 2 (Bán Thực Thể)
  const step1 = feedAndEvolveSpirit(soul, 1000);
  assertEqual(step1.evolved, true, '1,000 EXP phải kích hoạt đột phá');
  assertEqual(step1.oldStage, 1, 'Giai đoạn trước đột phá là 1');
  assertEqual(step1.updatedSoul.evolutionStage, 2, 'Giai đoạn mới phải là Stage 2 (Bán Thực Thể)');
  assertEqual(step1.updatedSoul.spiritExp, 1000, 'Tổng EXP hiện tại là 1,000');
  assertEqual(step1.updatedSoul.maxSpiritExp, 5000, 'maxSpiritExp nâng lên 5,000');

  // Chỉ số hiệu lực potencyValue tăng đúng +50% so với gốc: 0.15 * 1.5 = 0.225
  const expectedStage2Potency = Number((basePotency * 1.5).toFixed(4));
  assertEqual(step1.updatedSoul.currentProc.potencyValue, expectedStage2Potency, 'potencyValue ở Stage 2 tăng đúng +50% (x1.5)');
  assertEqual(step1.updatedSoul.currentProc.potencyValue, 0.225, 'potencyValue Stage 2 chính xác bằng 0.225');
  assertEqual(step1.updatedSoul.hasAutoGuardianUnlocked, false, 'Stage 2 chưa mở khóa Hộ Chủ Thần Thông');

  // Bước 2: Cung cấp tiếp 4,000 EXP (Tổng cộng 5,000 EXP) -> Đột phá Stage 3 (Chân Thân Hóa Hình)
  const step2 = feedAndEvolveSpirit(step1.updatedSoul, 4000);
  assertEqual(step2.evolved, true, 'Đạt 5,000 EXP phải kích hoạt đột phá Stage 3');
  assertEqual(step2.oldStage, 2, 'Giai đoạn trước đột phá là 2');
  assertEqual(step2.updatedSoul.evolutionStage, 3, 'Giai đoạn mới phải là Stage 3 (Chân Thân Hóa Hình)');
  assertEqual(step2.updatedSoul.spiritExp, 5000, 'Tổng EXP hiện tại là 5,000');

  // Chỉ số hiệu lực potencyValue tăng đúng +100% so với gốc: 0.15 * 2.0 = 0.30
  const expectedStage3Potency = Number((basePotency * 2.0).toFixed(4));
  assertEqual(step2.updatedSoul.currentProc.potencyValue, expectedStage3Potency, 'potencyValue ở Stage 3 tăng đúng +100% so với gốc (x2.0)');
  assertEqual(step2.updatedSoul.currentProc.potencyValue, 0.30, 'potencyValue Stage 3 chính xác bằng 0.30');
  assertEqual(step2.updatedSoul.hasAutoGuardianUnlocked, true, 'Stage 3 mở khóa cờ tự động hộ chủ (hasAutoGuardianUnlocked = true)');

  console.log('  ✓ Thang tiến hóa chuẩn xác: 1,000 EXP -> Stage 2 (+50% potency), 5,000 EXP -> Stage 3 (+100% potency & Hộ Chủ)');
});

// ============================================================================
// TEST 4: Combat Proc Simulation
// Giả lập xúc xắc proc hiệu ứng Long Uy (-30% ATK, 1 turn) và Niết Bàn (đốt 4% Max HP)
// theo đúng tỷ lệ cấu hình (Long Uy: 20%, Niết Bàn: 30%).
// ============================================================================
runTestCase(4, 'Combat Proc Simulation', () => {
  const hacGiaoProc = SOUL_REGISTRY.hac_giao.baseProc;
  const hoaPhuongProc = SOUL_REGISTRY.hoa_phuong.baseProc;

  // 1. Kiểm tra cấu hình proc
  assertEqual(hacGiaoProc.triggerChance, 0.20, 'Long Uy có tỷ lệ kích hoạt 20%');
  assertEqual(hacGiaoProc.potencyValue, 0.30, 'Long Uy giảm 30% ATK');
  assertEqual(hacGiaoProc.durationTurns, 1, 'Long Uy kéo dài 1 lượt');

  assertEqual(hoaPhuongProc.triggerChance, 0.30, 'Niết Bàn có tỷ lệ kích hoạt 30%');
  assertEqual(hoaPhuongProc.potencyValue, 0.04, 'Niết Bàn thiêu đốt 4% Max HP/lượt');
  assertEqual(hoaPhuongProc.durationTurns, 3, 'Niết Bàn kéo dài 3 lượt');

  // Hàm mô phỏng kích hoạt proc với xúc xắc roll [0, 1)
  function simulateProcRoll(triggerChance: number, roll: number): boolean {
    return roll < triggerChance;
  }

  // 2. Thử nghiệm ranh giới (Boundary Value Testing)
  // Long Uy: ngưỡng 0.20
  assertEqual(simulateProcRoll(hacGiaoProc.triggerChance, 0.00), true, 'Roll 0.00 < 0.20 -> Kích hoạt Long Uy');
  assertEqual(simulateProcRoll(hacGiaoProc.triggerChance, 0.1999), true, 'Roll 0.1999 < 0.20 -> Kích hoạt Long Uy');
  assertEqual(simulateProcRoll(hacGiaoProc.triggerChance, 0.20), false, 'Roll 0.20 >= 0.20 -> Không kích hoạt');
  assertEqual(simulateProcRoll(hacGiaoProc.triggerChance, 0.50), false, 'Roll 0.50 >= 0.20 -> Không kích hoạt');

  // Niết Bàn: ngưỡng 0.30
  assertEqual(simulateProcRoll(hoaPhuongProc.triggerChance, 0.00), true, 'Roll 0.00 < 0.30 -> Kích hoạt Niết Bàn');
  assertEqual(simulateProcRoll(hoaPhuongProc.triggerChance, 0.2999), true, 'Roll 0.2999 < 0.30 -> Kích hoạt Niết Bàn');
  assertEqual(simulateProcRoll(hoaPhuongProc.triggerChance, 0.30), false, 'Roll 0.30 >= 0.30 -> Không kích hoạt');
  assertEqual(simulateProcRoll(hoaPhuongProc.triggerChance, 0.75), false, 'Roll 0.75 >= 0.30 -> Không kích hoạt');

  // 3. Giả lập xác suất Monte Carlo (2,000 lượt xúc xắc ngẫu nhiên với seed ổn định)
  const TRIALS = 2000;
  let hacGiaoProcs = 0;
  let hoaPhuongProcs = 0;

  // LCG PRNG đơn giản với seed cố định để kiểm thử xác suất không bị flaky
  let seed = 123456789;
  function pseudoRandom(): number {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  for (let i = 0; i < TRIALS; i++) {
    const roll1 = pseudoRandom();
    if (simulateProcRoll(hacGiaoProc.triggerChance, roll1)) {
      hacGiaoProcs++;
    }

    const roll2 = pseudoRandom();
    if (simulateProcRoll(hoaPhuongProc.triggerChance, roll2)) {
      hoaPhuongProcs++;
    }
  }

  const hacGiaoRate = hacGiaoProcs / TRIALS;
  const hoaPhuongRate = hoaPhuongProcs / TRIALS;

  // Sai số chấp nhận được trong khoảng ±3% (0.03) quanh giá trị kỳ vọng
  assertTrue(
    Math.abs(hacGiaoRate - 0.20) < 0.03,
    `Tỷ lệ Long Uy (${(hacGiaoRate * 100).toFixed(1)}%) phải tiệm cận kỳ vọng 20%`
  );
  assertTrue(
    Math.abs(hoaPhuongRate - 0.30) < 0.03,
    `Tỷ lệ Niết Bàn (${(hoaPhuongRate * 100).toFixed(1)}%) phải tiệm cận kỳ vọng 30%`
  );

  console.log(
    `  ✓ Giả lập chiến đấu xác suất thành công: Long Uy đạt ${(hacGiaoRate * 100).toFixed(1)}% (chuẩn 20%), Niết Bàn đạt ${(hoaPhuongRate * 100).toFixed(1)}% (chuẩn 30%)`
  );
});

// ============================================================================
// TEST 5: Autonomous Guardian Invariant
// Khi Khí Linh ở Stage 1 hoặc 2: HP < 20% -> Không kích hoạt hộ chủ.
// Khi Khí Linh ở Stage 3: HP < 20% và chưa từng dùng trong trận -> Kích hoạt thành công;
// Lần nhận đòn tiếp theo trong cùng trận -> Không kích hoạt lại.
// ============================================================================
runTestCase(5, 'Autonomous Guardian Invariant', () => {
  const weapon = applySoulInfusion(
    {
      id: 'wp_guardian_test',
      name: 'Huyền Vũ Bất Diệt Kiếm',
      type: 'weapon',
      slot: 'weapon',
      powerBonus: 2500,
      grade: 'Bảo Khí',
      enhancement: 0,
      hpBonus: 1000,
      mpBonus: 500
    },
    SOUL_REGISTRY.huyen_vu
  ).updatedWeapon;

  const soulStage1 = weapon.infusedSoul!;
  const maxHp = 1000;
  const criticalHp = 150; // 15% Max HP (< 20%)
  const safeHp = 350;     // 35% Max HP (>= 20%)

  // 1. Khí Linh ở Stage 1: HP < 20% -> KHÔNG kích hoạt hộ chủ
  const stage1Check = evaluateSpiritAutoGuardian(soulStage1, criticalHp, maxHp, false);
  assertEqual(stage1Check.shouldTrigger, false, 'Khí Linh Stage 1 không được kích hoạt hộ chủ');
  assertEqual(stage1Check.damageNegated, false, 'Stage 1 không triệt tiêu sát thương');
  assertEqual(stage1Check.counterDamageMultiplier, 0, 'Stage 1 không phản kích');

  // 2. Nâng lên Stage 2 (1,000 EXP)
  const soulStage2 = feedAndEvolveSpirit(soulStage1, 1000).updatedSoul;
  assertEqual(soulStage2.evolutionStage, 2, 'Khí Linh đã lên Stage 2');

  // Khí Linh ở Stage 2: HP < 20% -> KHÔNG kích hoạt hộ chủ
  const stage2Check = evaluateSpiritAutoGuardian(soulStage2, criticalHp, maxHp, false);
  assertEqual(stage2Check.shouldTrigger, false, 'Khí Linh Stage 2 không được kích hoạt hộ chủ');
  assertEqual(stage2Check.damageNegated, false, 'Stage 2 không triệt tiêu sát thương');

  // 3. Nâng lên Stage 3 (Cần tích lũy >= 5,000 EXP)
  const soulStage3 = feedAndEvolveSpirit(soulStage2, 4000).updatedSoul;
  assertEqual(soulStage3.evolutionStage, 3, 'Khí Linh đã đạt Stage 3 (Chân Thân Hóa Hình)');
  assertEqual(soulStage3.hasAutoGuardianUnlocked, true, 'hasAutoGuardianUnlocked phải là true');

  // Trường hợp HP an toàn (>= 20%): Dù ở Stage 3 cũng không kích hoạt
  const safeHpCheck = evaluateSpiritAutoGuardian(soulStage3, safeHp, maxHp, false);
  assertEqual(safeHpCheck.shouldTrigger, false, 'HP >= 20% tuyệt đối không kích hoạt hộ chủ');
  assertEqual(safeHpCheck.damageNegated, false, 'Không triệt tiêu sát thương khi còn an toàn');

  // Trường hợp HP nguy khốn (< 20%) và chưa từng dùng trong trận (hasTriggeredInFight = false)
  // -> KÍCH HOẠT HỘ CHỦ THÀNH CÔNG!
  const triggerCheck = evaluateSpiritAutoGuardian(soulStage3, criticalHp, maxHp, false);
  assertEqual(triggerCheck.shouldTrigger, true, 'Stage 3 + HP < 20% + Chưa dùng trong trận -> Phải kích hoạt hộ chủ');
  assertEqual(triggerCheck.damageNegated, true, 'Hộ chủ thành công: Đòn đánh chí tử bị triệt tiêu 100%');
  assertEqual(triggerCheck.counterDamageMultiplier, 1.5, 'Phản kích với hệ số sát thương uy lực x1.5');

  // 4. Lần nhận đòn tiếp theo trong cùng trận (hasTriggeredInFight = true)
  // -> KHÔNG kích hoạt lại (Đảm bảo mỗi trận chỉ cứu mạng duy nhất 1 lần)
  const subsequentHitCheck = evaluateSpiritAutoGuardian(soulStage3, 50, maxHp, true);
  assertEqual(subsequentHitCheck.shouldTrigger, false, 'Đã kích hoạt trong trận rồi thì không được kích hoạt lần thứ 2');
  assertEqual(subsequentHitCheck.damageNegated, false, 'Không triệt tiêu đòn đánh lần thứ 2');
  assertEqual(subsequentHitCheck.counterDamageMultiplier, 0, 'Không phản kích thêm lần nữa');

  console.log('  ✓ Autonomous Guardian Invariant bảo vệ hoàn mỹ: Chỉ Stage 3 khi HP < 20%, triệt tiêu đòn đánh và giới hạn 1 lần/trận');
});

// ============================================================================
// TEST 6: Dialogue Context Resolution
// Gọi getSpiritDialogue với các context ('onCombatStart', 'onVictory', 'onLowHealth', 'onIdle')
// -> Luôn trả về chuỗi thoại hợp lệ theo đúng tính cách của Khí Linh.
// ============================================================================
runTestCase(6, 'Dialogue Context Resolution', () => {
  const testContexts: SoulDialogueContext[] = ['onCombatStart', 'onVictory', 'onLowHealth', 'onIdle'];
  const soulTypes: SoulType[] = ['hac_giao', 'hoa_phuong', 'bach_ho', 'huyen_vu', 'co_kiem_tu'];

  for (const soulType of soulTypes) {
    const soulConfig = SOUL_REGISTRY[soulType];
    const testWeapon = applySoulInfusion(
      {
        id: `wp_dialogue_${soulType}`,
        name: `Kiếm_${soulType}`,
        type: 'weapon',
        slot: 'weapon',
        powerBonus: 1000,
        grade: 'Bảo Khí',
        enhancement: 0,
        hpBonus: 500,
        mpBonus: 200
      },
      soulConfig
    ).updatedWeapon;

    const infusedSoul = testWeapon.infusedSoul!;

    for (const ctx of testContexts) {
      // 1. Gọi với hàm random cố định chỉ mục 0
      const dialogueFirst = getSpiritDialogue(infusedSoul, ctx, () => 0.0);
      assertTrue(typeof dialogueFirst === 'string', `Thoại [${soulType}][${ctx}] phải là string`);
      assertTrue(dialogueFirst.trim().length > 0, `Thoại [${soulType}][${ctx}] không được rỗng`);
      assertEqual(
        dialogueFirst,
        soulConfig.dialoguePool[ctx][0],
        `Thoại chỉ mục 0 của [${soulType}][${ctx}] phải khớp với cấu hình tính cách [${soulConfig.personality}]`
      );

      // 2. Gọi với hàm random chỉ mục cuối
      const lastIndex = soulConfig.dialoguePool[ctx].length - 1;
      const dialogueLast = getSpiritDialogue(infusedSoul, ctx, () => 0.999);
      assertTrue(dialogueLast.trim().length > 0, `Thoại chỉ mục cuối của [${soulType}][${ctx}] không được rỗng`);
      assertEqual(
        dialogueLast,
        soulConfig.dialoguePool[ctx][lastIndex],
        `Thoại chỉ mục cuối của [${soulType}][${ctx}] phải khớp`
      );

      // 3. Gọi với Math.random mặc định
      const dialogueRandom = getSpiritDialogue(infusedSoul, ctx);
      assertTrue(typeof dialogueRandom === 'string' && dialogueRandom.length > 0, 'Thoại mặc định phải hợp lệ');
      assertTrue(
        soulConfig.dialoguePool[ctx].includes(dialogueRandom),
        `Câu thoại trả về ngẫu nhiên phải thuộc pool của [${soulType}][${ctx}]`
      );
    }
  }

  // Xác minh câu thoại đại diện từng tính cách phản ánh đúng khí chất
  const ngaoKieuVoice = getSpiritDialogue(
    applySoulInfusion(
      { id: 'w1', name: 'W1', type: 'weapon', slot: 'weapon', powerBonus: 100, grade: 'Bảo Khí', enhancement: 0, hpBonus: 100, mpBonus: 100 },
      SOUL_REGISTRY.hac_giao
    ).updatedWeapon.infusedSoul!,
    'onCombatStart',
    () => 0.0
  );
  assertTrue(ngaoKieuVoice.includes('bản tôn') || ngaoKieuVoice.includes('Hừ'), 'Khí chất Ngạo Kiều xưng danh bản tôn');

  const haoChienVoice = getSpiritDialogue(
    applySoulInfusion(
      { id: 'w2', name: 'W2', type: 'weapon', slot: 'weapon', powerBonus: 100, grade: 'Bảo Khí', enhancement: 0, hpBonus: 100, mpBonus: 100 },
      SOUL_REGISTRY.hoa_phuong
    ).updatedWeapon.infusedSoul!,
    'onCombatStart',
    () => 0.0
  );
  assertTrue(haoChienVoice.includes('thiêu') || haoChienVoice.includes('sôi trào'), 'Khí chất Háo Chiến đòi thiêu rụi');

  const lanhDamVoice = getSpiritDialogue(
    applySoulInfusion(
      { id: 'w3', name: 'W3', type: 'weapon', slot: 'weapon', powerBonus: 100, grade: 'Bảo Khí', enhancement: 0, hpBonus: 100, mpBonus: 100 },
      SOUL_REGISTRY.bach_ho
    ).updatedWeapon.infusedSoul!,
    'onCombatStart',
    () => 0.0
  );
  assertTrue(lanhDamVoice.includes('Sát') || lanhDamVoice.includes('Rút kiếm'), 'Khí chất Lãnh Đạm kiệm lời');

  const trungCanVoice = getSpiritDialogue(
    applySoulInfusion(
      { id: 'w4', name: 'W4', type: 'weapon', slot: 'weapon', powerBonus: 100, grade: 'Bảo Khí', enhancement: 0, hpBonus: 100, mpBonus: 100 },
      SOUL_REGISTRY.huyen_vu
    ).updatedWeapon.infusedSoul!,
    'onCombatStart',
    () => 0.0
  );
  assertTrue(trungCanVoice.includes('Chủ nhân'), 'Khí chất Trung Can xưng hô Chủ nhân');

  console.log('  ✓ Dialogue Context Resolution hoàn mỹ: Luôn xuất ra câu thoại chuẩn xác cho cả 4 ngữ cảnh và 4 loại tính cách');
});

// ============================================================================
// TEST 7: Save Migration & Data Idempotency
// migrateSoulInfusionData: Khởi tạo an toàn soulInfusionState, quét qua
// inventory, equipment, natalArtifact gán infusedSoul ?? null, idempotent 100%.
// ============================================================================
runTestCase(7, 'Save Migration & Data Idempotency', () => {
  const legacyPlayer: any = {
    name: 'Bạch Y Kiếm Tu',
    tuVi: 100000,
    currentRealm: 15,
    equipment: {
      weapon: {
        id: 'legacy_sword',
        name: 'Thanh Cương Kiếm',
        slot: 'weapon',
        powerBonus: 500,
        grade: 'Linh Khí',
        enhancement: 0,
        hpBonus: 100,
        mpBonus: 50
      },
      armor: {
        id: 'legacy_armor',
        name: 'Đạo Bào',
        slot: 'armor',
        powerBonus: 300,
        grade: 'Linh Khí',
        enhancement: 0,
        hpBonus: 200,
        mpBonus: 100
      }
    },
    inventory: {
      equipments: [
        {
          id: 'inv_sword',
          name: 'Tử Điện Kiếm',
          slot: 'weapon',
          powerBonus: 800,
          grade: 'Bảo Khí',
          enhancement: 1,
          hpBonus: 200,
          mpBonus: 100
        }
      ]
    },
    natalArtifact: {
      id: 'natal_legacy',
      name: 'Thanh Cương Kiếm',
      baseEquipmentId: 'legacy_sword',
      slot: 'weapon',
      tier: 1,
      grade: 'Linh Khí',
      quality: 'cuc_pham',
      resonanceRate: 25,
      baseEquipment: {
        id: 'legacy_sword',
        name: 'Thanh Cương Kiếm',
        slot: 'weapon',
        powerBonus: 500,
        grade: 'Linh Khí'
      }
    }
  };

  // 1. Chạy migration lần 1
  const migrated = migrateSoulInfusionData(legacyPlayer as PlayerStats);

  // Kiểm tra soulInfusionState được khởi tạo chuẩn xác
  assertTrue(!!migrated.soulInfusionState, 'soulInfusionState phải được khởi tạo');
  assertEqual(typeof migrated.soulInfusionState?.harvestedSouls, 'object', 'harvestedSouls là object');
  assertEqual(migrated.soulInfusionState?.totalInfusionsPerformed, 0, 'totalInfusionsPerformed = 0');
  assertEqual(Array.isArray(migrated.soulInfusionState?.unlockedSpiritLore), true, 'unlockedSpiritLore là array');

  // Kiểm tra equipment
  assertEqual(migrated.equipment?.weapon?.infusedSoul, null, 'Weapon cũ phải có infusedSoul = null');
  assertEqual(migrated.equipment?.armor?.infusedSoul, null, 'Armor cũ phải có infusedSoul = null');

  // Kiểm tra inventory
  const invSword = migrated.inventory?.equipments?.[0];
  assertEqual(invSword?.infusedSoul, null, 'Trang bị trong túi trữ vật phải có infusedSoul = null');

  // Kiểm tra natalArtifact
  assertEqual(migrated.natalArtifact?.baseEquipment?.infusedSoul, null, 'natalArtifact.baseEquipment phải có infusedSoul = null');
  assertEqual((migrated.natalArtifact as any)?.infusedSoul, null, 'natalArtifact.infusedSoul phải là null');

  // 2. Chạy migration lần 2 (Kiểm tra Idempotency)
  // Giả lập người chơi đã có tiến trình nạp Hồn Phách
  migrated.soulInfusionState!.totalInfusionsPerformed = 3;
  migrated.soulInfusionState!.harvestedSouls['soul_hac_giao'] = 2;
  migrated.equipment!.weapon!.infusedSoul = {
    soulId: 'custom_soul_id',
    soulType: 'hac_giao',
    soulName: 'Bắc Hải Hắc Giao',
    element: 'Thủy',
    personality: 'ngao_kieu',
    evolutionStage: 2,
    spiritExp: 1500,
    maxSpiritExp: 5000,
    infusedAt: 10000,
    dialoguePool: SOUL_REGISTRY.hac_giao.dialoguePool,
    baseProc: SOUL_REGISTRY.hac_giao.baseProc,
    currentProc: SOUL_REGISTRY.hac_giao.baseProc,
    hasAutoGuardianUnlocked: false
  };

  const migratedTwice = migrateSoulInfusionData(migrated);
  assertEqual(migratedTwice.soulInfusionState?.totalInfusionsPerformed, 3, 'Tính Idempotent: totalInfusionsPerformed không bị reset');
  assertEqual(migratedTwice.soulInfusionState?.harvestedSouls['soul_hac_giao'], 2, 'Tính Idempotent: harvestedSouls giữ nguyên');
  assertEqual(migratedTwice.equipment?.weapon?.infusedSoul?.evolutionStage, 2, 'Tính Idempotent: infusedSoul hiện có không bị ghi đè null');

  console.log('  ✓ Save Migration hoàn tất an toàn: Chuẩn hóa 100% trang bị cũ, tính Idempotency bảo toàn dữ liệu');
});

// ============================================================================
// TEST 8: Natal Artifact Synchronization & Resonance
// Đồng bộ hóa Khí Linh Phong Hồn với Bản Mệnh Pháp Bảo: Đánh dấu awakenedAsNatalSpirit,
// đồng bộ tỷ lệ cộng hưởng theo Stage và gia trì chỉ số chiến đấu.
// ============================================================================
runTestCase(8, 'Natal Artifact Synchronization & Resonance', () => {
  const baseSword: Equipment = {
    id: 'wp_natal_sync',
    name: 'Long Uyên Thần Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 2000,
    atkBonus: 500,
    defBonus: 200,
    grade: 'Bảo Khí',
    quality: 'cuc_pham',
    enhancement: 0,
    hpBonus: 1000,
    mpBonus: 500
  };

  // Phong ấn Hồn Hắc Giao và nâng lên Stage 2
  const infusedEquip = applySoulInfusion(baseSword, SOUL_REGISTRY.hac_giao).updatedWeapon;
  const stage2Soul = feedAndEvolveSpirit(infusedEquip.infusedSoul!, 1200).updatedSoul;
  infusedEquip.infusedSoul = stage2Soul;

  const mockPlayer: PlayerStats = {
    tuVi: 500000,
    canCot: 50,
    ngoTinh: 50,
    khiVan: 50,
    tamCanh: 50,
    linhThach: 100000,
    trungPhamLinhThach: 100,
    thanThuc: 100,
    danhVong: 1000,
    currentRealm: 15, // Trúc Cơ Hậu Kỳ (Đủ điều kiện tế luyện)
    equipment: {
      weapon: infusedEquip
    },
    inventory: {
      pills: [],
      herbs: [],
      ores: [],
      equipments: [infusedEquip]
    }
  };

  // Thực hiện Tế Luyện Bản Mệnh
  const bindRes = bindEquipmentAsNatal(mockPlayer, infusedEquip);
  assertTrue(bindRes.success, `Tế luyện Bản Mệnh phải thành công: ${bindRes.message}`);

  const natal = bindRes.updatedPlayer.natalArtifact!;
  assertTrue(!!natal, 'natalArtifact phải tồn tại sau tế luyện');

  // 1. Kiểm tra cờ awakenedAsNatalSpirit = true trên Khí Linh
  const natalInfusedSoul = natal.baseEquipment?.infusedSoul;
  assertTrue(!!natalInfusedSoul, 'baseEquipment phải lưu giữ infusedSoul');
  assertEqual(natalInfusedSoul.awakenedAsNatalSpirit, true, 'Khí Linh phải được đánh dấu awakenedAsNatalSpirit = true');

  // Kiểm tra đồng bộ cờ vào player.equipment
  const equippedWeaponSoul = bindRes.updatedPlayer.equipment?.weapon?.infusedSoul;
  assertEqual(equippedWeaponSoul?.awakenedAsNatalSpirit, true, 'Trang bị đang mặc phải được đồng bộ awakenedAsNatalSpirit = true');

  // 2. Kiểm tra đồng bộ hóa tỷ lệ cộng hưởng:
  // Cơ bản 25% + Stage 2 bonus (+15%) = 40% cộng hưởng Bản Mệnh
  assertEqual(natal.resonanceRate, 40, 'Tỷ lệ cộng hưởng Bản Mệnh phải cộng dồn +15% từ Khí Linh Stage 2');

  // 3. Kiểm tra tính toán chỉ số chiến đấu Bản Mệnh calculateNatalCombatBonus
  const combatBonus = calculateNatalCombatBonus(bindRes.updatedPlayer);
  assertTrue(combatBonus.atkBonus > 0, 'Chỉ số ATK Bản Mệnh phải được gia tăng');
  assertTrue(combatBonus.summaryText.includes('Giai Đoạn 2'), 'Bản tóm tắt phải hiển thị Khí Linh Giai Đoạn 2');

  console.log('  ✓ Đồng bộ Bản Mệnh Pháp Bảo chuẩn xác: awakenedAsNatalSpirit = true, resonanceRate = 40%, gia trì công phòng');
});

// ============================================================================
// TEST 9: Combat Engine & Autonomous Guardian Turn Simulation
// executeSoulInfusionCombatTurn: Tấn công proc Long Uy (-30% ATK, skip lượt),
// Niết Bàn (đốt 4% Max HP), Tự Động Hộ Chủ (HP < 20% triệt tiêu đòn đánh, thoại onLowHealth, 1 lần/trận).
// ============================================================================
runTestCase(9, 'Combat Engine & Autonomous Guardian Turn Simulation', () => {
  const baseWeapon: Equipment = {
    id: 'wp_combat_test',
    name: 'Bắc Hải Huyền Long Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 1000,
    grade: 'Bảo Khí',
    enhancement: 0,
    hpBonus: 500,
    mpBonus: 200
  };

  // 1. Kiểm thử Vòng lặp Tấn công: Proc Long Uy (-30% ATK, đối thủ mất lượt, log viền lam)
  const weaponHacGiao = applySoulInfusion(baseWeapon, SOUL_REGISTRY.hac_giao).updatedWeapon;
  const turn1 = executeSoulInfusionCombatTurn({
    playerHp: 1000,
    playerMaxHp: 1000,
    playerAtk: 500,
    weapon: weaponHacGiao,
    targetHp: 2000,
    targetMaxHp: 2000,
    targetDef: 50,
    incomingBossDamage: 100,
    hasTriggeredSpiritGuardian: false,
    randomFn: () => 0.10 // 0.10 < 0.20 -> Kích hoạt Long Uy!
  });

  assertEqual(turn1.longUyTriggered, true, 'Long Uy phải được kích hoạt');
  assertEqual(turn1.targetSkipsNextTurn, true, 'Đối thủ phải bị mất lượt tiếp theo (targetSkipsNextTurn = true)');
  assertEqual(turn1.targetAtkReducedPercent, 30, 'Đối thủ bị giảm 30% ATK');
  assertTrue(
    turn1.combatLogs.some(log => log.includes('【Hồn Hắc Giao】 gầm vang chấn động Cửu Tiêu!')),
    'Log chiến đấu phải chứa thông điệp Long Uy chấn nhiếp viền lam'
  );

  // 2. Kiểm thử Vòng lặp Tấn công: Proc Niết Bàn Chân Hỏa (Đốt 4% Max HP)
  const weaponHoaPhuong = applySoulInfusion(baseWeapon, SOUL_REGISTRY.hoa_phuong).updatedWeapon;
  const turn2 = executeSoulInfusionCombatTurn({
    playerHp: 1000,
    playerMaxHp: 1000,
    playerAtk: 500,
    weapon: weaponHoaPhuong,
    targetHp: 5000,
    targetMaxHp: 5000,
    targetDef: 50,
    incomingBossDamage: 100,
    hasTriggeredSpiritGuardian: false,
    randomFn: () => 0.15 // 0.15 < 0.30 -> Kích hoạt Niết Bàn!
  });

  assertEqual(turn2.nietBanTriggered, true, 'Niết Bàn Chân Hỏa phải được kích hoạt');
  assertEqual(turn2.burnDoTDamage, 200, 'Đốt 4% của 5,000 Max HP = 200 HP');
  assertTrue(
    turn2.combatLogs.some(log => log.includes('【Niết Bàn Chân Hỏa】')),
    'Log chiến đấu phải chứa thông điệp Niết Bàn Chân Hỏa thiêu đốt'
  );

  // 3. Kiểm thử Vòng lặp Nhận Sát Thương: Tự Động Hộ Chủ (Autonomous Guardian)
  // Khí Linh Stage 3, Máu < 20% (150/1000 HP), đòn đánh chí tử 300 DMG
  const weaponStage3 = applySoulInfusion(baseWeapon, SOUL_REGISTRY.co_kiem_tu).updatedWeapon;
  weaponStage3.infusedSoul = feedAndEvolveSpirit(weaponStage3.infusedSoul!, 5500).updatedSoul;
  assertEqual(weaponStage3.infusedSoul.evolutionStage, 3, 'Khí Linh phải đạt Stage 3');

  const guardianTurn = executeSoulInfusionCombatTurn({
    playerHp: 150, // 15% HP (< 20%)
    playerMaxHp: 1000,
    playerAtk: 600,
    weapon: weaponStage3,
    targetHp: 3000,
    targetMaxHp: 3000,
    targetDef: 100,
    incomingBossDamage: 300, // Đòn đánh chí tử
    hasTriggeredSpiritGuardian: false,
    randomFn: () => 0.0
  });

  // Xác minh cơ chế Hộ Chủ
  assertEqual(guardianTurn.hasTriggeredSpiritGuardian, true, 'hasTriggeredSpiritGuardian phải được bật thành true');
  assertEqual(guardianTurn.damageNegated, true, 'Đòn đánh chí tử phải được triệt tiêu 100% (damageNegated = true)');
  assertEqual(guardianTurn.actualDamageReceived, 0, 'Sát thương thực tế nhận vào phải là 0');
  assertEqual(guardianTurn.playerRemainingHp, 150, 'Máu của người chơi được bảo toàn nguyên vẹn');
  assertEqual(guardianTurn.counterDamageMultiplier, 1.5, 'Phản kích với hệ số x1.5');
  assertTrue(
    guardianTurn.combatLogs.some(log => log.includes('Khí Linh xuất thế hộ chủ! 【Thượng Cổ Kiếm Tu】')),
    'Log hoàng kim xuất thế hộ chủ kèm câu thoại onLowHealth phải được ghi nhận'
  );

  // 4. Kiểm thử đòn đánh tiếp theo trong cùng trận đánh (hasTriggeredSpiritGuardian = true)
  // -> Không được phép kích hoạt lại lần thứ hai
  const subsequentTurn = executeSoulInfusionCombatTurn({
    playerHp: 100, // 10% HP
    playerMaxHp: 1000,
    playerAtk: 600,
    weapon: weaponStage3,
    targetHp: 2000,
    targetMaxHp: 3000,
    targetDef: 100,
    incomingBossDamage: 80,
    hasTriggeredSpiritGuardian: true, // Đã dùng hộ chủ trước đó trong trận
    randomFn: () => 0.0
  });

  assertEqual(subsequentTurn.damageNegated, false, 'Không được phép triệt tiêu sát thương lần thứ 2');
  assertEqual(subsequentTurn.actualDamageReceived, 80, 'Phải nhận đủ 80 sát thương');
  assertEqual(subsequentTurn.playerRemainingHp, 20, '100 - 80 = 20 HP còn lại');

  console.log('  ✓ Combat Turn Simulation hoàn mỹ: Long Uy khống chế, Niết Bàn thiêu đốt, Khí Linh xuất thế hộ chủ triệt tiêu đòn đánh chí tử');
});

// ============================================================================
// TEST 10: Hook Pipeline & Action Invariants (useSoulInfusionActions)
// Kiểm thử các helper chức năng của Custom Hook: findTargetEquipmentInPlayer,
// updateTargetEquipmentInPlayer (Deep Clone), deductSoulVesselFromPlayer,
// deductNourishMaterialFromPlayer.
// ============================================================================
runTestCase(10, 'Hook Pipeline & Action Invariants (useSoulInfusionActions)', () => {
  const swordInInv: Equipment = {
    id: 'wp_inv_01',
    name: 'Túi Trữ Vật Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 1000,
    grade: 'Bảo Khí',
    enhancement: 0,
    hpBonus: 300,
    mpBonus: 150
  };

  const swordEquipped: Equipment = {
    id: 'wp_equipped_01',
    name: 'Đang Mặc Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 1500,
    grade: 'Bảo Khí',
    enhancement: 1,
    hpBonus: 500,
    mpBonus: 200
  };

  const natalSword: Equipment = {
    id: 'wp_natal_01',
    name: 'Bản Mệnh Kiếm',
    type: 'weapon',
    slot: 'weapon',
    powerBonus: 2000,
    grade: 'Cổ Bảo',
    enhancement: 2,
    hpBonus: 1000,
    mpBonus: 500
  };

  const mockPlayer: any = {
    tuVi: 100000,
    currentRealm: 15,
    equipment: {
      weapon: swordEquipped
    },
    inventory: {
      items: [
        { id: 'soul_hac_giao_item', soulType: 'hac_giao', quantity: 2, count: 2 },
        { id: 'hon_ngoc', name: 'Hồn Ngọc', quantity: 5, count: 5 }
      ],
      equipments: [swordInInv]
    },
    natalArtifact: {
      id: 'natal_art_01',
      baseEquipmentId: 'wp_natal_01',
      name: 'Bản Mệnh Kiếm',
      baseEquipment: natalSword
    },
    soulInfusionState: {
      harvestedSouls: {
        soul_hoa_phuong: 1
      },
      totalInfusionsPerformed: 0,
      unlockedSpiritLore: []
    }
  };

  // 1. Kiểm tra tìm vị trí trang bị (findTargetEquipmentInPlayer)
  const loc1 = findTargetEquipmentInPlayer(mockPlayer, 'wp_inv_01');
  assertTrue(!!loc1 && loc1.type === 'inventory', 'Tìm thấy trang bị trong túi đồ');

  const loc2 = findTargetEquipmentInPlayer(mockPlayer, 'wp_equipped_01');
  assertTrue(!!loc2 && loc2.type === 'equipment', 'Tìm thấy trang bị đang mặc');

  const loc3 = findTargetEquipmentInPlayer(mockPlayer, 'wp_natal_01');
  assertTrue(!!loc3 && loc3.type === 'natalArtifact', 'Tìm thấy trang bị Bản Mệnh');

  // 2. Kiểm tra tìm kiếm Hồn Phách (findSoulVesselInPlayer)
  const soul1 = findSoulVesselInPlayer(mockPlayer, 'soul_hac_giao_item');
  assertTrue(!!soul1 && soul1.count === 2, 'Tìm thấy Hắc Giao trong inventory.items');

  const soul2 = findSoulVesselInPlayer(mockPlayer, 'soul_hoa_phuong');
  assertTrue(!!soul2 && soul2.count === 1, 'Tìm thấy Hỏa Phượng trong harvestedSouls');

  // 3. Kiểm tra khấu trừ Hồn Phách (deductSoulVesselFromPlayer)
  const deduct1 = deductSoulVesselFromPlayer(mockPlayer, 'soul_hac_giao_item');
  assertTrue(deduct1.deducted, 'Khấu trừ Hắc Giao thành công');
  const remainingHacGiao = (deduct1.updatedPlayer.inventory as any).items.find((i: any) => i.id === 'soul_hac_giao_item');
  assertEqual(remainingHacGiao.quantity, 1, 'Số lượng Hắc Giao giảm từ 2 xuống 1');

  // Khấu trừ Hỏa Phượng (số lượng 1 -> xóa khỏi harvestedSouls)
  const deduct2 = deductSoulVesselFromPlayer(mockPlayer, 'soul_hoa_phuong');
  assertTrue(deduct2.deducted, 'Khấu trừ Hỏa Phượng thành công');
  assertEqual(deduct2.updatedPlayer.soulInfusionState?.harvestedSouls['soul_hoa_phuong'], undefined, 'Hỏa Phượng đã bị dọn sạch');

  // 4. Kiểm tra khấu trừ vật phẩm bồi dưỡng (deductNourishMaterialFromPlayer)
  const nourishDeduct = deductNourishMaterialFromPlayer(mockPlayer, 'hon_ngoc', 3);
  assertTrue(nourishDeduct.deducted, 'Khấu trừ 3x Hồn Ngọc thành công');
  assertEqual(nourishDeduct.expGained, 300, '3x Hồn Ngọc (100 EXP/viên) nhận 300 EXP');
  const remainingHonNgoc = (nourishDeduct.updatedPlayer.inventory as any).items.find((i: any) => i.id === 'hon_ngoc');
  assertEqual(remainingHonNgoc.quantity, 2, 'Hồn Ngọc giảm từ 5 xuống 2');

  // 5. Kiểm tra cập nhật trang bị an toàn bất biến (updateTargetEquipmentInPlayer)
  const updatedSwordWithSoul: Equipment = {
    ...swordInInv,
    infusedSoul: {
      soulId: 'soul_test',
      soulType: 'hac_giao',
      soulName: 'Hắc Thủy Huyền Giao',
      element: 'Thủy',
      personality: 'ngao_kieu',
      evolutionStage: 1,
      spiritExp: 0,
      maxSpiritExp: 1000,
      infusedAt: 1000,
      dialoguePool: SOUL_REGISTRY.hac_giao.dialoguePool,
      baseProc: SOUL_REGISTRY.hac_giao.baseProc,
      currentProc: SOUL_REGISTRY.hac_giao.baseProc,
      hasAutoGuardianUnlocked: false
    }
  };

  const updatedPlayer = updateTargetEquipmentInPlayer(mockPlayer, loc1!, updatedSwordWithSoul);
  assertTrue(!!updatedPlayer.inventory?.equipments?.[0]?.infusedSoul, 'Trang bị mới trong túi đồ đã được cập nhật Khí Linh');
  assertEqual(mockPlayer.inventory?.equipments?.[0]?.infusedSoul, undefined, 'Trang bị trong mockPlayer gốc không bị mutate (Immutability)');

  console.log('  ✓ Hook Action Invariants chuẩn xác: Tìm kiếm trang bị 3 nguồn, khấu trừ Hồn Phách/vật phẩm dưỡng linh, cập nhật bất biến');
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n===============================================================');
console.log(`🎉 TEST SUMMARY: ${passedCount}/${TOTAL_TESTS} TESTS PASSED (100% SUCCESS)`);
console.log('   TOÀN BỘ CÁC TEST CASES ĐẶC TẢ ĐÃ VƯỢT QUA KIỂM THỬ TỰ ĐỘNG THÀNH CÔNG!');
console.log('===============================================================\n');
