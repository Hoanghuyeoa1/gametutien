// scripts/test-seclusion-enhancement.ts
// Test Suite cho Phân Hệ "Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh"
// Chạy bằng lệnh: npx tsx scripts/test-seclusion-enhancement.ts

import { createNewPlayer } from '../lib/game-logic';
import { PlayerStats } from '../lib/types';
import {
  DAO_SEEDS_REGISTRY,
  canEnterEnhancedSeclusion,
  executeEnhancedSeclusion,
  consumeDaoFruit
} from '../lib/seclusion-enhancement-logic';
import { calculateCombatStats } from '../lib/destiny-data';
import { migrateSeclusionEnhancementData, normalizePlayerData } from '../lib/save-migration';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

console.log('================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ PHÂN HỆ: TUẾ NGUYỆT BẾ QUAN (TAM HÓA CHI CẢNH)');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 1: Đào Thải Đan Độc & Khôi Phục Chân Nguyên (Toxicity Cleansing)
// ----------------------------------------------------------------------------
console.log('--- TEST 1: Đào Thải Đan Độc & Khôi Phục Chân Nguyên ---');
(() => {
  const player = createNewPlayer();
  player.age = 20;
  player.maxLifespan = 200;
  player.linhThach = 100000;
  player.pillToxicity = 40;
  player.qiPurity = 60;

  // Bế quan 20 năm: giảm 20 * 2 = 40 điểm toxicity -> về đúng 0, qiPurity về 100
  const { updatedPlayer, result } = executeEnhancedSeclusion(player, 20);

  assert(result.success, 'Thực thi bế quan 20 năm thành công');
  assert(result.toxicityCleansed === 40, `Lượng đan độc đào thải đúng 40 (thực tế: ${result.toxicityCleansed})`);
  assert(updatedPlayer.pillToxicity === 0, `Đan độc nhân vật về đúng 0 (thực tế: ${updatedPlayer.pillToxicity})`);
  assert(updatedPlayer.qiPurity === 100, `Độ tinh khiết chân nguyên phục hồi 100% (thực tế: ${updatedPlayer.qiPurity}%)`);
  assert(result.newQiPurity === 100, `Kết quả trả về newQiPurity đúng 100 (thực tế: ${result.newQiPurity})`);

  // Bế quan thêm 10 năm nữa khi toxicity = 0: không được âm
  const round2 = executeEnhancedSeclusion(updatedPlayer, 10);
  assert(round2.updatedPlayer.pillToxicity === 0, 'Đan độc không bao giờ bị âm khi tiếp tục bế quan');
  assert(round2.updatedPlayer.qiPurity === 100, 'Độ tinh khiết vẫn duy trì tối đa 100%');
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 2: Trích Xuất Tu Vi Ôn Dưỡng Khí Linh (Artifact Nourishment)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 2: Trích Xuất Tu Vi Ôn Dưỡng Khí Linh ---');
(() => {
  const player = createNewPlayer();
  player.age = 25;
  player.maxLifespan = 300;
  player.linhThach = 200000;
  player.tuVi = 0;
  player.natalArtifact = {
    id: 'art_thanh_truc_kiem',
    baseEquipmentId: 'eq_thanh_truc_kiem',
    name: 'Thanh Trúc Kiếm',
    slot: 'weapon',
    type: 'sword',
    tier: 2,
    grade: 'Nhị Giai',
    quality: 'tuyet_pham',
    boundRealmId: 11,
    boundAtTimestamp: Date.now(),
    realmAdvancementBonus: 0,
    statsBonus: { atk: 50, def: 20, hp: 0, mp: 0, critRate: 0, dmgReduction: 0 },
    resonanceRate: 25,
    spirit: {
      name: 'Tiểu Trúc Linh',
      title: 'Kiếm Hồn',
      avatar: '🗡️',
      stage: 'mong_muoi',
      stageLevel: 1,
      exp: 100,
      maxExp: 500000,
      intimacy: 20,
      personality: 'sat_phat',
      awakenedSkill: {
        id: 'skill_kiem_nhan',
        name: 'Kiếm Nhận Phong Bạo',
        description: 'Linh hồn kiếm linh thuần khiết',
        triggerCondition: 'turn_start',
        cooldownTurns: 3,
        effectValue: 15
      },
      dialogueHistory: [],
      dailyNourishCount: 0
    }
  };

  // Bế quan 10 năm với nourishPercent = 30%
  const { updatedPlayer, result } = executeEnhancedSeclusion(player, 10, undefined, 30);

  assert(result.success, 'Thực thi bế quan trích xuất tu vi thành công');
  const totalGained = result.tuviGainedPlayer + result.tuviDivertedArtifact;
  const ratio = (result.tuviDivertedArtifact / totalGained) * 100;
  assert(
    Math.abs(ratio - 30) < 0.5,
    `Tỷ lệ phân chia tu vi xấp xỉ 30% (thực tế: ${ratio.toFixed(2)}%, diverted: ${result.tuviDivertedArtifact}, player: ${result.tuviGainedPlayer})`
  );
  assert(
    result.spiritExpGained === result.tuviDivertedArtifact,
    `EXP Khí Linh nhận đúng bằng tu vi trích xuất (${result.spiritExpGained} EXP)`
  );
  assert(
    result.spiritAffinityGained > 0,
    `Khí Linh tăng điểm thân mật (${result.spiritAffinityGained} điểm)`
  );
  assert(
    (updatedPlayer.natalArtifact?.spirit?.intimacy || 0) > 20,
    `Độ thân mật lưu trữ trong người chơi đã tăng (cũ: 20, mới: ${updatedPlayer.natalArtifact?.spirit?.intimacy})`
  );
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 3: Tiến Độ Gieo Mầm & Đơm Hoa Đạo Quả (Dao Seed Maturity)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 3: Tiến Độ Gieo Mầm & Đơm Hoa Đạo Quả ---');
(() => {
  const player = createNewPlayer();
  player.age = 30;
  player.maxLifespan = 500;
  player.currentRealm = 15; // Đủ điều kiện cảnh giới gieo Kiếm Ý Đạo Chủng (minRealmIndex = 11)
  player.linhThach = 500000;
  player.harvestedDaoFruits = [];

  // Lần 1: Bế quan 6 năm (Kiếm Ý Đạo Chủng cần 10 năm)
  const round1 = executeEnhancedSeclusion(player, 6, 'seed_kiem_y');
  assert(round1.result.success, 'Lần 1: Bế quan 6 năm thành công');
  assert(round1.result.maturedDaoFruit === null, 'Lần 1: Chưa đủ 10 năm nên chưa có Đạo Quả');
  assert(
    round1.updatedPlayer.activeDaoSeed?.accumulatedYears === 6,
    `Lần 1: Tiến độ tích lũy đúng 6 năm (thực tế: ${round1.updatedPlayer.activeDaoSeed?.accumulatedYears})`
  );
  assert(
    (round1.updatedPlayer.harvestedDaoFruits || []).length === 0,
    'Lần 1: Túi Đạo Quả chưa có quả mới'
  );

  // Lần 2: Bế quan thêm 4 năm (Tổng cộng = 6 + 4 = 10 năm)
  const round2 = executeEnhancedSeclusion(round1.updatedPlayer, 4, 'seed_kiem_y');
  assert(round2.result.success, 'Lần 2: Bế quan 4 năm thành công');
  assert(round2.result.maturedDaoFruit !== null, 'Lần 2: Đạt mốc 10 năm, Đạo Quả đã đơm hoa kết trái');
  assert(
    round2.result.maturedDaoFruit?.name === 'Vạn Kiếm Quy Tông Quả',
    `Lần 2: Tên quả ngưng tụ là 【${round2.result.maturedDaoFruit?.name}】`
  );
  assert(
    (round2.updatedPlayer.harvestedDaoFruits || []).length === 1,
    `Lần 2: Túi Đạo Quả lưu trữ 1 quả chín (thực tế: ${round2.updatedPlayer.harvestedDaoFruits?.length})`
  );
  assert(
    round2.updatedPlayer.activeDaoSeed === null,
    'Lần 2: Hạt giống được reset sau khi đã thu hoạch thành công'
  );
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 4: Phục Dụng Đạo Quả & Cộng Dồn Affix Vào Thực Chiến
// ----------------------------------------------------------------------------
console.log('\n--- TEST 4: Phục Dụng Đạo Quả & Cộng Dồn Affix Thực Chiến ---');
(() => {
  const player = createNewPlayer();
  player.canCot = 50;
  player.currentRealm = 15;
  player.absorbedDaoAffixes = [];
  player.harvestedDaoFruits = [
    {
      id: 'fruit_kiem_y_test',
      seedId: 'seed_kiem_y',
      name: 'Vạn Kiếm Quy Tông Quả',
      affix: DAO_SEEDS_REGISTRY['seed_kiem_y'].resultingAffix,
      harvestedAt: Date.now(),
      isConsumed: false
    }
  ];

  const statsBefore = calculateCombatStats(player);

  // Phục dụng Đạo Quả
  const consumeRes = consumeDaoFruit(player, 'fruit_kiem_y_test');
  assert(consumeRes.success, 'Phục dụng Vạn Kiếm Quy Tông Quả thành công');
  assert(
    consumeRes.updatedPlayer.absorbedDaoAffixes?.length === 1,
    'Affix đã được dung hợp vào absorbedDaoAffixes'
  );

  // Kiểm tra chỉ số chiến đấu thay đổi
  const statsAfter = calculateCombatStats(consumeRes.updatedPlayer);
  assert(
    statsAfter.atk > statsBefore.atk,
    `Công kích nhân vật tăng từ ${statsBefore.atk} -> ${statsAfter.atk} (+6% từ Đạo Quả)`
  );
  assert(
    statsAfter.critRate >= statsBefore.critRate + 4,
    `Tỉ lệ bạo kích tăng ít nhất 4% (cũ: ${statsBefore.critRate}%, mới: ${statsAfter.critRate}%)`
  );
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 5: Phòng Vệ Giới Hạn Thọ Nguyên (Lifespan Boundary Guard)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 5: Phòng Vệ Giới Hạn Thọ Nguyên ---');
(() => {
  const player = createNewPlayer();
  player.age = 85;
  player.maxLifespan = 100; // Còn 15 năm thọ nguyên
  player.linhThach = 100000;

  // Thử bế quan 20 năm (vượt quá 15 năm còn lại)
  const validation = canEnterEnhancedSeclusion(player, 20);
  assert(
    !validation.canSeclude,
    'Hệ thống từ chối bế quan khi số năm vượt thọ nguyên còn lại'
  );
  assert(
    validation.isLifespanExceeded,
    'Cờ isLifespanExceeded được kích hoạt chính xác'
  );

  const execResult = executeEnhancedSeclusion(player, 20);
  assert(
    !execResult.result.success,
    'executeEnhancedSeclusion trả về success = false'
  );
  assert(
    execResult.updatedPlayer.age === 85,
    'Tuổi nhân vật không bị thay đổi khi từ chối bế quan'
  );
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ ---');
(() => {
  // Mock save cũ (v6/v7 đời đầu) hoàn toàn không có pillToxicity, qiPurity, daoSeed
  const legacySaveData: any = {
    name: 'Tiêu Diêm Cổ Giả',
    currentRealm: 16,
    tuVi: 50000,
    linhThach: 88888,
    age: 60,
    maxLifespan: 300,
    // Thiếu hoàn toàn các trường mới
  };

  // Chạy qua migrateSeclusionEnhancementData & normalizePlayerData
  const migrated = migrateSeclusionEnhancementData(legacySaveData);
  const normalized = normalizePlayerData(legacySaveData);

  assert(migrated.pillToxicity === 0, 'Migration: pillToxicity được gán mặc định an toàn là 0');
  assert(migrated.qiPurity === 100, 'Migration: qiPurity được gán mặc định an toàn là 100%');
  assert(migrated.activeDaoSeed === null, 'Migration: activeDaoSeed là null');
  assert(Array.isArray(migrated.harvestedDaoFruits), 'Migration: harvestedDaoFruits là mảng rỗng');
  assert(Array.isArray(migrated.absorbedDaoAffixes), 'Migration: absorbedDaoAffixes là mảng rỗng');

  assert(normalized.pillToxicity === 0, 'Normalize: pillToxicity an toàn là 0');
  assert(normalized.qiPurity === 100, 'Normalize: qiPurity an toàn là 100%');
  assert(Array.isArray(normalized.absorbedDaoAffixes), 'Normalize: absorbedDaoAffixes an toàn là mảng');

  // Nạp save đã migrate vào vòng lặp bế quan
  const testSeclusion = executeEnhancedSeclusion(migrated, 5);
  assert(
    testSeclusion.result.success,
    'Save sau migration nạp vào bế quan chạy trơn tru 100%'
  );
})();

// ----------------------------------------------------------------------------
// TỔNG KẾT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 HOÀN TẤT KIỂM THỬ: ${passedTests}/${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
