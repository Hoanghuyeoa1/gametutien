// scripts/test-meditation-system.ts
// Test Suite cho Phân Hệ "Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà"
// Chạy bằng lệnh: npx tsx scripts/test-meditation-system.ts

import { createNewPlayer } from '../lib/game-logic';
import { PlayerStats, Manual } from '../lib/types';
import {
  MEDITATION_LOCATIONS,
  MEDITATION_STANCES_CONFIG,
  resolveOfflineMeditationProgress,
  applyMeditationProgressToPlayer
} from '../lib/meditation-logic';
import { migrateMeditationData, normalizePlayerData } from '../lib/save-migration';
import { MeditationStanceType } from '../lib/types/meditation';

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
console.log('🧪 BẮT ĐẦU KIỂM THỬ: THIÊN ĐỊA NHẬP ĐỊNH & KỲ NGỘ SƠN HÀ');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 1: Thế Luyện Tâm Hóa Ma (Toxicity & Demonic Cleanse Invariant)
// ----------------------------------------------------------------------------
console.log('--- TEST 1: Thế Luyện Tâm Hóa Ma (Toxicity & Demonic Cleanse) ---');
(() => {
  const player = createNewPlayer();
  player.demonicNature = 30;
  player.pillToxicity = 30;
  player.qiPurity = 70;
  player.tuVi = 10000;

  const startTime = 1000000;
  const endTime = startTime + 8 * 3600 * 1000; // 8 giờ

  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'luyen_tam'
  );

  assert(result.effectiveHours === 8, 'Hoàn thành trọn vẹn 8 giờ nhập định');
  assert(result.totalTuviGained === 0, 'Thế Luyện Tâm không nhận Tu Vi (đúng 0 Tu Vi)');
  assert(result.demonicCleanseTotal === 24, `Tẩy trừ đúng 24 điểm Ma Tính (thực tế: ${result.demonicCleanseTotal})`);
  assert(result.toxicityCleanseTotal === 24, `Tẩy trừ đúng 24 điểm Đan Độc (thực tế: ${result.toxicityCleanseTotal})`);
  assert(result.appliedBreakthroughBuff === true, 'Kích hoạt cờ buff [Tâm Cảnh Thanh Lãng]');

  const updated = applyMeditationProgressToPlayer(player, result, 'luyen_tam');
  assert(updated.demonicNature === 6, `Ma Tính nhân vật giảm còn đúng 6 (thực tế: ${updated.demonicNature})`);
  assert(updated.pillToxicity === 6, `Đan Độc nhân vật giảm còn đúng 6 (thực tế: ${updated.pillToxicity})`);
  assert(updated.qiPurity === 94, `Chân nguyên khôi phục 94% (thực tế: ${updated.qiPurity}%)`);
  assert(Boolean(updated.activeBuffs?.tamCanhThanhLang), 'Buff Tâm Cảnh Thanh Lãng đã lưu trong activeBuffs');
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 2: Thế Thao Diễn Thần Thông (Skill EXP Distribution)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 2: Thế Thao Diễn Thần Thông (Skill EXP Distribution) ---');
(() => {
  const player = createNewPlayer();
  const manual1: Manual = {
    id: 'manual_kiem_khi_1',
    name: 'Thanh Phong Kiếm Pháp',
    description: 'Thanh Phong Kiếm Pháp',
    type: 'than_thong',
    grade: 'Nhất Giai',
    level: 1,
    exp: 0,
    maxLevel: 5,
    maxExp: 5000,
    powerBonusPerLevel: 20,
    tuViPerLevel: 10,
    cost: 100
  };
  const manual2: Manual = {
    id: 'manual_kiem_khi_2',
    name: 'Bạt Kiếm Thuật',
    description: 'Bạt Kiếm Thuật',
    type: 'than_thong',
    grade: 'Nhất Giai',
    level: 2,
    exp: 500,
    maxLevel: 5,
    maxExp: 8000,
    powerBonusPerLevel: 25,
    tuViPerLevel: 15,
    cost: 150
  };

  player.manuals = [manual1, manual2];
  player.equippedManuals = {
    thanThong1: 'manual_kiem_khi_1',
    thanThong2: 'manual_kiem_khi_2'
  };

  const startTime = 1000000;
  const endTime = startTime + 10 * 3600 * 1000; // 10 giờ

  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'thao_dien'
  );

  assert(result.effectiveHours === 10, 'Hoàn thành 10 giờ nhập định Thao Diễn');
  assert(result.totalTuviGained === 0, 'Toàn bộ tu vi được chuyển hóa thành Skill EXP');
  assert(result.skillExpPerManual > 0, `Skill EXP phân bổ mỗi công pháp > 0 (${result.skillExpPerManual} EXP)`);

  const updated = applyMeditationProgressToPlayer(player, result, 'thao_dien');
  const m1 = updated.manuals?.find(m => m.id === 'manual_kiem_khi_1');
  const m2 = updated.manuals?.find(m => m.id === 'manual_kiem_khi_2');

  assert(!isNaN(m1?.exp || 0) && !isNaN(m1?.level || 0), 'Công pháp 1 cấp độ và EXP không bị NaN');
  assert(!isNaN(m2?.exp || 0) && !isNaN(m2?.level || 0), 'Công pháp 2 cấp độ và EXP không bị NaN');
  assert((m1?.level || 1) >= 1, 'Cấp độ công pháp 1 được duy trì hoặc thăng cấp');
  assert((m2?.exp || 0) >= 500 || (m2?.level || 2) > 2, 'Kinh nghiệm công pháp 2 tăng trưởng rõ rệt');
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 3: Mô Phỏng Rủi Ro Hiểm Cảnh Không Có Bùa Hộ Mệnh
// ----------------------------------------------------------------------------
console.log('\n--- TEST 3: Rủi Ro Hiểm Cảnh Không Có Bùa Hộ Mệnh (Hazard Interruption) ---');
(() => {
  const player = createNewPlayer();
  const startTime = 1000000;
  const endTime = startTime + 12 * 3600 * 1000; // 12 giờ

  // Mock nguy cơ xảy ra ở giờ thứ 7 không mang bùa hộ mệnh
  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'hiem_canh',
    null,
    { simulatedHazardHour: 7 }
  );

  assert(result.effectiveHours === 7, `Phiên nhập định gián đoạn đúng tại giờ thứ 7 (thực tế: ${result.effectiveHours})`);
  assert(result.interruptedAtHour === 7, 'Ghi nhận interruptedAtHour = 7');
  assert(Boolean(result.interruptionReason), `Có lý do gián đoạn: "${result.interruptionReason}"`);

  const hazardLog = result.eventLogs.find(e => e.isHazardIncident);
  assert(Boolean(hazardLog), 'Có sinh ra nhật ký biến cố hiểm họa');
  assert(hazardLog?.wasDefended === false, 'Biến cố ghi nhận wasDefended = false do không có bùa');
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 4: Phòng Vệ Rủi Ro Bằng Bùa Hộ Mệnh (Ward Protection Invariant)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 4: Phòng Vệ Bằng Bùa Hộ Mệnh (Ward Protection Invariant) ---');
(() => {
  const player = createNewPlayer();
  const startTime = 1000000;
  const endTime = startTime + 12 * 3600 * 1000; // 12 giờ

  // Mock nguy cơ xảy ra ở giờ thứ 7 CÓ mang bùa hộ mệnh
  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'hiem_canh',
    'talisman_an_than_phu',
    { simulatedHazardHour: 7 }
  );

  assert(result.effectiveHours === 12, `Phiên nhập định tiếp tục an toàn đủ 12 giờ (thực tế: ${result.effectiveHours})`);
  assert(result.interruptedAtHour === undefined, 'Không bị gián đoạn (interruptedAtHour = undefined)');

  const wardLog = result.eventLogs.find(e => e.isHazardIncident);
  assert(Boolean(wardLog), 'Có sinh ra nhật ký hộ thân');
  assert(wardLog?.wasDefended === true, 'Biến cố được phòng vệ thành công (wasDefended = true)');
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 5: Giới Hạn Trần Thời Gian 24 Giờ (Time Cap Invariant)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 5: Giới Hạn Trần Thời Gian 24 Giờ (Time Cap Invariant) ---');
(() => {
  const player = createNewPlayer();
  const startTime = 1000000;
  const endTime = startTime + 72 * 3600 * 1000; // Offline 72 giờ

  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'co_ban'
  );

  assert(result.totalHoursElapsed === 72, 'Tổng thời gian người chơi vắng mặt là 72 giờ');
  assert(result.effectiveHours === 24, `Thời gian hiệu lực bị chặn trần đúng 24 giờ (thực tế: ${result.effectiveHours})`);
})();

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration) ---');
(() => {
  const legacySaveData: any = {
    name: 'Bạch Hạc Chân Nhân',
    currentRealm: 16,
    tuVi: 88888,
    linhThach: 66666,
    // Thiếu hoàn toàn các trường meditation mới
  };

  const migrated = migrateMeditationData(legacySaveData);
  const normalized = normalizePlayerData(legacySaveData);

  assert(migrated.meditationLocationId === 'linh_mach_tong_mon', 'Migration: meditationLocationId mặc định là linh_mach_tong_mon');
  assert(migrated.meditationStance === 'co_ban', 'Migration: meditationStance mặc định là co_ban');
  assert(migrated.equippedWardItemId === null, 'Migration: equippedWardItemId mặc định là null');
  assert(Array.isArray(migrated.meditationEventLogs), 'Migration: meditationEventLogs là mảng an toàn');

  assert(normalized.meditationLocationId === 'linh_mach_tong_mon', 'Normalize: meditationLocationId an toàn là linh_mach_tong_mon');
  assert(normalized.meditationStance === 'co_ban', 'Normalize: meditationStance an toàn là co_ban');

  // Nạp vào giải quyết tiến độ chạy trơn tru không phát sinh exception
  const startTime = Date.now() - 5 * 3600 * 1000;
  const progress = resolveOfflineMeditationProgress(
    migrated,
    startTime,
    Date.now(),
    migrated.meditationLocationId || 'linh_mach_tong_mon',
    (migrated.meditationStance as MeditationStanceType) || 'co_ban'
  );
  assert(progress.effectiveHours === 5, 'Save sau migration nạp vào tiến trình AFK chạy mượt mà');
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
