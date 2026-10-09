// scripts/test-meditation-guardians.ts
// Test Suite cho Phân Hệ "Đạo Lữ & Linh Thú Hộ Pháp (Song Hành Hộ Đạo)"
// Chạy bằng lệnh: npx tsx scripts/test-meditation-guardians.ts

import { createNewPlayer } from '../lib/game-logic';
import { PlayerStats } from '../lib/types';
import { SpiritBeast } from '../lib/types/beasts';
import {
  validateMeditationGuardians,
  checkElementalResonance,
  resolveGuardianHazardRescue,
  calculateGuardianGrowth,
  assignGuardiansLock,
  releaseGuardiansLock,
  applyGuardianProgressToPlayer
} from '../lib/meditation-guardian-logic';
import {
  MEDITATION_LOCATIONS,
  resolveOfflineMeditationProgress,
  applyMeditationProgressToPlayer
} from '../lib/meditation-logic';
import { canBreedBeasts } from '../lib/beast-breeding-logic';
import {
  migrateMeditationGuardianData,
  normalizePlayerData
} from '../lib/save-migration';

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
console.log('🧪 BẮT ĐẦU KIỂM THỬ: ĐẠO LỮ & LINH THÚ HỘ PHÁP (SONG HÀNH HỘ ĐẠO)');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 1: Kiểm Tra Chọn Hộ Pháp & Khóa Trạng Thái (Assignment & Lock Guard)
// ----------------------------------------------------------------------------
console.log('--- TEST 1: Kiểm Tra Chọn Hộ Pháp & Khóa Trạng Thái (Assignment & Lock Guard) ---');
(() => {
  const player = createNewPlayer();
  // Khởi tạo Đạo Lữ Diệp Chỉ Hàm đã kết duyên
  player.companionsState = {
    companions: {
      comp_diep_chi_ham: {
        id: 'comp_diep_chi_ham',
        name: 'Diệp Chỉ Hàm',
        isBonded: true,
        affinity: 100,
        isMet: true
      }
    }
  };

  const beastA = {
    id: 'beast_hac_ho',
    name: 'Bạch Hổ Tướng',
    element: 'Kim',
    tier: 2,
    level: 10,
    exp: 200,
    maxExp: 1000,
    bloodlinePurity: 15,
    isLockedInBreeding: false
  } as unknown as SpiritBeast;

  const beastB = {
    id: 'beast_thanh_xa',
    name: 'Thanh Mãng Xà',
    element: 'Mộc',
    tier: 2,
    level: 10,
    exp: 100,
    maxExp: 1000,
    bloodlinePurity: 10,
    isLockedInBreeding: false
  } as unknown as SpiritBeast;

  player.beastGarden = {
    facility: { level: 1, maxBreedingSlots: 2, incubationSpeedMultiplier: 1, mutationRateBonus: 0 },
    beasts: [beastA, beastB],
    eggs: [],
    breedingPairs: []
  };

  // Cử Đạo Lữ và Linh Thú đi hộ pháp
  const lockedPlayer = assignGuardiansLock(player, 'comp_diep_chi_ham', 'beast_hac_ho');

  assert(
    lockedPlayer.companionsState?.companions?.['comp_diep_chi_ham']?.isAssignedToMeditation === true,
    'Đạo Lữ Diệp Chỉ Hàm nhận cờ isAssignedToMeditation: true'
  );

  const lockedBeastInGarden = lockedPlayer.beastGarden?.beasts?.find(b => b.id === 'beast_hac_ho');
  assert(
    lockedBeastInGarden?.isAssignedToMeditation === true,
    'Linh Thú Bạch Hổ Tướng nhận cờ isAssignedToMeditation: true'
  );

  // Thẩm định chặn lai tạo giống khi thú đang hộ pháp (Breeding Guard)
  const breedCheck = canBreedBeasts(lockedPlayer, lockedBeastInGarden!, beastB);
  assert(
    breedCheck.eligible === false,
    'Chặn Linh Thú đang hộ pháp không cho đưa vào phối giống',
    `Reason: ${breedCheck.reason}`
  );
  assert(
    Boolean(breedCheck.reason?.includes('Hộ Pháp Nhập Định')),
    'Thông báo lý do chặn phối giống chính xác'
  );

  // Giải phóng khóa nguyên tử
  const releasedPlayer = releaseGuardiansLock(lockedPlayer);
  assert(
    releasedPlayer.companionsState?.companions?.['comp_diep_chi_ham']?.isAssignedToMeditation === false,
    'Giải phóng cờ khóa Đạo Lữ thành công'
  );
  assert(
    releasedPlayer.beastGarden?.beasts?.find(b => b.id === 'beast_hac_ho')?.isAssignedToMeditation === false,
    'Giải phóng cờ khóa Linh Thú thành công'
  );
})();

console.log('');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 2: Cứu Viện Hiểm Họa Hiểm Cảnh Thành Công (Guardian Hazard Rescue Invariant)
// ----------------------------------------------------------------------------
console.log('--- TEST 2: Cứu Viện Hiểm Họa Hiểm Cảnh Thành Công (Guardian Hazard Rescue) ---');
(() => {
  const player = createNewPlayer();
  player.companionsState = {
    companions: {
      comp_diep_chi_ham: {
        id: 'comp_diep_chi_ham',
        name: 'Diệp Chỉ Hàm',
        isBonded: true,
        affinity: 80,
        isMet: true
      }
    }
  };

  const startTime = 1000000;
  const endTime = startTime + 8 * 3600 * 1000; // 8 giờ

  // Nhập định thế Hiểm Cảnh, KHÔNG mang Bùa Hộ Mệnh, cử Đạo Lữ Diệp Chỉ Hàm hộ pháp
  // Giả lập biến cố tại giờ thứ 5 với RNG seed 0.1 (tỷ lệ thành công >= 0.85 -> chắc chắn cứu viện thành công)
  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'hiem_canh',
    null, // Không có bùa hộ mệnh
    {
      simulatedHazardHour: 5,
      companionId: 'comp_diep_chi_ham',
      simulatedRescueSeed: 0.1
    }
  );

  assert(result.effectiveHours === 8, 'Phiên nhập định tiếp tục trọn vẹn 8 giờ mà không bị đứt đoạn');
  assert(result.interruptedAtHour === undefined, 'Không có cờ gián đoạn');
  assert(Boolean(result.guardianRescues && result.guardianRescues.length > 0), 'Ghi nhận biến cố cứu viện thành công');

  const rescueLog = result.eventLogs.find(l => l.hour === 5 && l.isHazardIncident);
  assert(rescueLog !== undefined, 'Nhật ký ghi nhận sự kiện hiểm họa tại giờ thứ 5');
  assert(Boolean(rescueLog?.wasDefended), 'Sự kiện hiểm họa được đánh dấu wasDefended: true');
  assert(
    Boolean(rescueLog?.narrative.includes('Diệp Chỉ Hàm')),
    'Nhật ký hiển thị chính xác tên Đạo Lữ cứu viện 【Diệp Chỉ Hàm】'
  );
})();

console.log('');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 3: Phòng Vệ Khi Không Có Hộ Pháp Lẫn Bùa (Unprotected Interruption Verification)
// ----------------------------------------------------------------------------
console.log('--- TEST 3: Phòng Vệ Khi Không Có Hộ Pháp Lẫn Bùa (Unprotected Interruption) ---');
(() => {
  const player = createNewPlayer();
  const startTime = 1000000;
  const endTime = startTime + 8 * 3600 * 1000; // 8 giờ

  // Không có bùa, không có đạo lữ/linh thú
  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'hiem_canh',
    null,
    {
      simulatedHazardHour: 5
    }
  );

  assert(result.effectiveHours === 5, 'Phiên nhập định bị đứt đoạn ngay tại giờ thứ 5');
  assert(result.interruptedAtHour === 5, 'interruptedAtHour được gán chính xác là 5');
  assert(Boolean(result.interruptionReason?.includes('giờ thứ 5')), 'interruptionReason ghi nhận mốc giờ thứ 5');

  const hazardLog = result.eventLogs.find(l => l.hour === 5 && l.isHazardIncident);
  assert(hazardLog?.wasDefended === false, 'Nhật ký ghi nhận biến cố thất bại wasDefended: false');
})();

console.log('');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 4: Tích Lũy Phần Thưởng Đạo Lữ (Companion Growth Invariant)
// ----------------------------------------------------------------------------
console.log('--- TEST 4: Tích Lũy Phần Thưởng Đạo Lữ (Companion Growth Invariant) ---');
(() => {
  const player = createNewPlayer();
  const initialAffinity = 50;
  const initialTuvi = 1000;
  const initialFatigue = Date.now() + 12 * 3600 * 1000; // Còn 12 giờ mệt mỏi

  player.companionsState = {
    companions: {
      comp_diep_chi_ham: {
        id: 'comp_diep_chi_ham',
        name: 'Diệp Chỉ Hàm',
        isBonded: true,
        affinity: initialAffinity,
        tuvi: initialTuvi,
        fatigueUntil: initialFatigue,
        totalEpiphanies: 0
      }
    }
  };

  const startTime = 1000000;
  const endTime = startTime + 8 * 3600 * 1000; // 8 giờ thế Cố Bản

  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'linh_mach_tong_mon',
    'co_ban',
    null,
    {
      companionId: 'comp_diep_chi_ham'
    }
  );

  const compGrowth = result.guardianGrowth?.companion;
  assert(compGrowth !== undefined, 'Kết quả chứa dữ liệu tăng trưởng của Đạo Lữ');
  // Cố Bản: 8 giờ / 2 = 4 Hảo Cảm
  assert(compGrowth?.affectionGained === 4, `Hảo cảm Đạo Lữ nhận đúng 4 điểm (thực tế: ${compGrowth?.affectionGained})`);
  // Tu Vi: 30% tu vi người chơi
  const expectedTuvi = Math.floor(result.totalTuviGained * 0.30);
  assert(compGrowth?.tuviGained === expectedTuvi, `Tu vi Đạo Lữ nhận đúng 30% (${expectedTuvi})`);
  // Rút ngắn mệt mỏi: 8 giờ * 60 phút = 480 phút
  assert(compGrowth?.fatigueReducedMinutes === 480, `Thời gian mệt mỏi giảm đúng 480 phút`);

  // Áp dụng vào nhân vật
  const updatedPlayer = applyMeditationProgressToPlayer(player, result, 'co_ban');
  const updatedComp = updatedPlayer.companionsState?.companions?.['comp_diep_chi_ham'];

  assert(updatedComp?.affinity === initialAffinity + 4, `Hảo cảm người chơi lưu trữ đúng ${initialAffinity + 4}`);
  assert(updatedComp?.tuvi === initialTuvi + expectedTuvi, `Tu vi Đạo Lữ lưu trữ đúng ${initialTuvi + expectedTuvi}`);
  assert(
    updatedComp?.fatigueUntil === initialFatigue - 480 * 60 * 1000,
    'fatigueUntil của Đạo Lữ được giảm chuẩn xác theo mili-giây'
  );
  assert(updatedComp?.isAssignedToMeditation === false, 'Cờ khóa hộ pháp được giải phóng sau khi áp dụng kết quả');
})();

console.log('');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 5: Tích Lũy Phần Thưởng Linh Thú (Beast Growth Invariant)
// ----------------------------------------------------------------------------
console.log('--- TEST 5: Tích Lũy Phần Thưởng Linh Thú (Beast Growth Invariant) ---');
(() => {
  const player = createNewPlayer();
  // Linh Thú hệ Thủy tại Hàn Băng Thâm Động (hệ Thủy) -> Kích hoạt Cộng Hưởng +15%
  const beast = {
    id: 'beast_bang_long',
    name: 'Băng Tinh Yêu Long',
    element: 'Thủy',
    tier: 3,
    level: 5,
    exp: 500,
    maxExp: 5000,
    bloodlinePurity: 20.0,
    loyalty: 60,
    isLockedInBreeding: false
  } as unknown as SpiritBeast;

  player.beastGarden = {
    facility: { level: 1, maxBreedingSlots: 2, incubationSpeedMultiplier: 1, mutationRateBonus: 0 },
    beasts: [beast],
    eggs: [],
    breedingPairs: []
  };

  const startTime = 1000000;
  const endTime = startTime + 8 * 3600 * 1000; // 8 giờ tại Hàn Băng Thâm Động

  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    'han_bang_tham_dong',
    'co_ban',
    null,
    {
      beastId: 'beast_bang_long'
    }
  );

  assert(result.elementalResonanceBonus === 0.15, 'Kích hoạt chính xác +15% Cộng Hưởng Nguyên Tố Thủy');
  const beastGrowth = result.guardianGrowth?.beast;
  assert(beastGrowth !== undefined, 'Kết quả chứa dữ liệu tăng trưởng của Linh Thú');
  assert(!isNaN(beastGrowth?.expGained || NaN) && beastGrowth!.expGained > 0, 'Thú EXP nhận được hợp lệ, không bị NaN');
  // Huyết mạch: 8h / 4 * 0.1 = +0.2%
  assert(beastGrowth?.bloodlinePurityGained === 0.2, `Độ thuần khiết huyết mạch tăng đúng +0.2% (thực tế: ${beastGrowth?.bloodlinePurityGained})`);

  // Áp dụng vào nhân vật
  const updatedPlayer = applyMeditationProgressToPlayer(player, result, 'co_ban');
  const updatedBeast = updatedPlayer.beastGarden?.beasts?.find(b => b.id === 'beast_bang_long');

  assert(!isNaN(updatedBeast?.exp || NaN), 'Linh Thú EXP trong save game không bị NaN');
  assert(updatedBeast?.bloodlinePurity === 20.2, `Huyết mạch Linh Thú cập nhật chính xác 20.2% (thực tế: ${updatedBeast?.bloodlinePurity})`);
  assert(updatedBeast?.loyalty === 64, `Điểm trung thành tăng lên 64 (thực tế: ${updatedBeast?.loyalty})`);
  assert(updatedBeast?.isAssignedToMeditation === false, 'Cờ khóa Linh Thú được giải phóng hoàn toàn');
})();

console.log('');

// ----------------------------------------------------------------------------
// CA KIỂM THỬ 6: Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
// ----------------------------------------------------------------------------
console.log('--- TEST 6: Khả Năng Tương Thích Save Cũ (Save Migration Invariant) ---');
(() => {
  // Tạo mock save cũ (v6) hoàn toàn không có các trường hộ pháp
  const legacySaveData: any = {
    name: 'Cổ Tu Sĩ',
    currentRealm: 15,
    tuVi: 50000,
    linhThach: 100000,
    meditationState: {
      isMeditating: false,
      startTime: 0,
      locationId: 'linh_mach_tong_mon',
      stance: 'co_ban',
      wardItemId: null
    }
  };

  const migrated = migrateMeditationGuardianData(legacySaveData);
  assert(migrated.accompanyingCompanionId === null, 'accompanyingCompanionId được tự động khởi tạo null');
  assert(migrated.accompanyingBeastId === null, 'accompanyingBeastId được tự động khởi tạo null');
  assert(migrated.guardianRescueCount === 0, 'guardianRescueCount được tự động khởi tạo 0');
  assert(migrated.meditationState?.accompanyingCompanionId === null, 'meditationState.accompanyingCompanionId khởi tạo an toàn');

  // Chạy qua normalizePlayerData
  const normalized = normalizePlayerData(legacySaveData);
  assert(normalized.accompanyingCompanionId === null, 'normalizePlayerData bao bọc và chuẩn hóa dữ liệu hộ pháp');

  // Thử đưa save đã chuẩn hóa vào engine nhập định
  const simResult = resolveOfflineMeditationProgress(
    normalized,
    1000000,
    1000000 + 4 * 3600 * 1000,
    'linh_mach_tong_mon',
    'co_ban'
  );

  assert(simResult.effectiveHours === 4, 'Chạy trơn tru trên engine nhập định mà không phát sinh lỗi');
  assert(simResult.totalTuviGained > 0, 'Nhận Tu Vi bình thường từ save cũ');
})();

console.log('\n================================================================');
console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} KIỂM TRA ĐẠT (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
