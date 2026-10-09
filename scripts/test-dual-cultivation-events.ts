// scripts/test-dual-cultivation-events.ts
// TEST SUITE TOÀN DIỆN CHO HỆ THỐNG BIẾN CỐ SONG TU ĐẠO LỮ CỬU GIAI (DUAL CULTIVATION DYNAMIC EVENTS)

import {
  evaluateDualCultivationEvent,
  resolveEventChoice,
  DUAL_CULTIVATION_EVENTS_POOL,
  getCompanionTier
} from '../lib/dual-cultivation-event-logic';
import { migrateDualCultivationEventData, normalizePlayerData } from '../lib/save-migration';
import { PlayerStats, CompanionWithState } from '../lib/types';

// =========================================================================
// TEST RUNNER UTILITIES
// =========================================================================
let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    if (detail) console.error(`     Chi tiết: ${detail}`);
  }
}

console.log('=================================================================');
console.log('🧪 BẮT ĐẦU CHẠY TEST SUITE: BIẾN CỐ SONG TU ĐẠO LỮ CỬU GIAI');
console.log('=================================================================\n');

// Mock dữ liệu cơ sở
function createMockPlayer(overrides: Partial<PlayerStats> = {}): PlayerStats {
  const base = normalizePlayerData({
    name: 'Đạo Hữu Test',
    currentRealm: 15,
    tuVi: 100000,
    linhThach: 50000,
    tamCanh: 80,
    ngoTinh: 50,
    khiVan: 50,
    demonicNature: 20,
    inventory: {
      pills: [],
      herbs: [],
      ores: [],
      equipments: [],
      manuals: [],
      books: [],
      bags: []
    }
  });
  return { ...base, ...overrides };
}

function createMockTier9Partner(overrides: Partial<CompanionWithState> = {}): CompanionWithState {
  return {
    id: 'comp_t9_songtu',
    name: 'Thái Sơ Tiên Tử',
    title: 'Thái Sơ Tiên Linh Thể',
    avatar: '🪷',
    realmIndex: 46,
    shopTier: 9,
    tier: 9,
    affinity: 95,
    isBonded: true,
    fatigueUntil: 0,
    totalEpiphanies: 0,
    favoriteGifts: ['gift', 'token'],
    buffs: {},
    combinedSkill: {
      name: 'Thái Sơ Tiên Âm',
      damageMultiplier: 3.5
    },
    dialogues: {
      so_thuc: ['Xin chào đạo hữu'],
      song_tu: ['Âm dương giao cảm, thái sơ vô cực']
    },
    ...overrides
  };
}

// -------------------------------------------------------------------------
// TEST 1: Kiểm Tra Điều Kiện Lọc Sự Kiện (Event Filter Accuracy)
// Người chơi có Ma Tính cao (80) + Hảo Cảm thấp (30) không thể kích hoạt
// biến cố "Tâm Đầu Ý Hợp"; bắt buộc phải lọc vào nhóm "Tâm Ma Xâm Thực" / "Tâm Ma Phệ Hồn".
// -------------------------------------------------------------------------
console.log('👉 TEST 1: Kiểm Tra Điều Kiện Lọc Sự Kiện (Event Filter Accuracy)');
{
  const demonicPlayer = createMockPlayer({ demonicNature: 80 });
  const lowAffectionPartner = createMockTier9Partner({ affinity: 30 });

  // Ép tỉ lệ kích hoạt 100% để kiểm tra bộ lọc
  const triggeredEvent = evaluateDualCultivationEvent(
    demonicPlayer,
    lowAffectionPartner,
    1,
    1.0 // 100% force trigger
  );

  assert(
    triggeredEvent !== null,
    'Sự kiện phải được kích hoạt khi ép xác suất 100%'
  );

  assert(
    triggeredEvent?.id !== 'event_tam_dau_y_hop',
    'Ma tính cao (80) và Hảo cảm thấp (30) KHÔNG THỂ kích hoạt "Tâm Đầu Ý Hợp"',
    `Event kích hoạt: ${triggeredEvent?.id}`
  );

  assert(
    triggeredEvent?.id === 'event_tam_ma_phe_hon',
    'Bắt buộc phải lọc chính xác vào "Tâm Ma Phệ Hồn" (Demonic Hazard)',
    `Event kích hoạt thực tế: ${triggeredEvent?.id}`
  );
}

// -------------------------------------------------------------------------
// TEST 2: Kích Hoạt Hộ Pháp Trừ Ma Thành Công
// Đạo Lữ Cửu Giai tịnh hóa ma khí -> Ma Tính giảm chính xác (từ 70 về 30),
// Hảo Cảm tăng, Đạo Lữ nhận trạng thái tĩnh dưỡng (fatigueUntil > Date.now()).
// -------------------------------------------------------------------------
console.log('\n👉 TEST 2: Kích Hoạt Hộ Pháp Trừ Ma Thành Công');
{
  const highDemonicPlayer = createMockPlayer({ demonicNature: 70 });
  const loyalPartner = createMockTier9Partner({ affinity: 80, fatigueUntil: 0 });
  const hoPhapEvent = DUAL_CULTIVATION_EVENTS_POOL.find(e => e.id === 'event_ho_phap_tru_ma')!;

  const beforeTime = Date.now();
  const res = resolveEventChoice(
    highDemonicPlayer,
    loyalPartner,
    hoPhapEvent,
    'choice_tinh_hoa_tien_khi' // Lựa chọn hy sinh nguyên khí tịnh hóa
  );

  assert(res.success === true, 'Giải quyết lựa chọn phải thành công');
  assert(
    res.updatedPlayer.demonicNature === 30,
    `Ma Tính phải giảm chính xác từ 70 về 30 (Delta -40). Kết quả: ${res.updatedPlayer.demonicNature}`,
    `Actual: ${res.updatedPlayer.demonicNature}`
  );
  assert(
    (res.updatedPartner.affinity ?? 0) === 85,
    `Hảo Cảm phải tăng từ 80 lên 85 (Delta +5). Kết quả: ${res.updatedPartner.affinity}`
  );
  assert(
    typeof res.updatedPartner.fatigueUntil === 'number' && res.updatedPartner.fatigueUntil >= beforeTime + 2 * 60 * 60 * 1000 - 1000,
    'Đạo Lữ phải nhận trạng thái tĩnh dưỡng mệt mỏi trong 2 giờ (fatigueUntil > Date.now())',
    `Fatigue: ${res.updatedPartner.fatigueUntil}`
  );
  assert(
    res.updatedPlayer.companionsState?.companions[loyalPartner.id]?.fatigueUntil === res.updatedPartner.fatigueUntil,
    'Trạng thái fatigueUntil phải được đồng bộ hai chiều vào player.companionsState'
  );
}

// -------------------------------------------------------------------------
// TEST 3: Phòng Vệ Điều Kiện Lựa Chọn (Choice Guard)
// Người chơi cố tình chọn nhánh yêu cầu Thanh Tâm Đan khi trong túi không có
// đan dược -> Hệ thống từ chối thực thi, không thay đổi trạng thái người chơi.
// -------------------------------------------------------------------------
console.log('\n👉 TEST 3: Phòng Vệ Điều Kiện Lựa Chọn (Choice Guard)');
{
  const poorPlayer = createMockPlayer({
    demonicNature: 75,
    inventory: {
      pills: [], // Trống trơn không có Thanh Tâm Đan
      herbs: [],
      ores: [],
      equipments: [],
      manuals: [],
      books: [],
      bags: []
    }
  });
  const partner = createMockTier9Partner({ affinity: 85 });
  const hoPhapEvent = DUAL_CULTIVATION_EVENTS_POOL.find(e => e.id === 'event_ho_phap_tru_ma')!;

  const res = resolveEventChoice(
    poorPlayer,
    partner,
    hoPhapEvent,
    'choice_thanh_tam_dan_tro_luc' // Yêu cầu 1 viên Thanh Tâm Đan
  );

  assert(res.success === false, 'Hệ thống từ chối thực thi khi không có Thanh Tâm Đan');
  assert(
    res.updatedPlayer.demonicNature === 75,
    'Trạng thái Ma Tính người chơi không được biến đổi khi bị từ chối'
  );
  assert(
    res.updatedPartner.affinity === 85,
    'Hảo cảm Đạo Lữ không được biến đổi khi bị từ chối'
  );

  // Thử lại khi người chơi CÓ Thanh Tâm Đan trong túi
  const richPlayer = createMockPlayer({
    demonicNature: 75,
    inventory: {
      pills: [
        {
          id: 'pill_thanh_tam_dan',
          name: 'Thanh Tâm Đan',
          type: 'pill',
          quantity: 2,
          quality: 'cuc_pham',
          grade: 'Cực Phẩm',
          description: 'Thanh tâm trừ ma',
          effectValue: 50
        } as any
      ],
      herbs: [],
      ores: [],
      equipments: [],
      manuals: [],
      books: [],
      bags: []
    }
  });

  const successRes = resolveEventChoice(
    richPlayer,
    partner,
    hoPhapEvent,
    'choice_thanh_tam_dan_tro_luc'
  );

  assert(successRes.success === true, 'Thực thi thành công khi có đủ Thanh Tâm Đan');
  assert(
    successRes.updatedPlayer.demonicNature === 25,
    `Ma tính giảm từ 75 về 25 (Delta -50). Kết quả: ${successRes.updatedPlayer.demonicNature}`
  );
  const remainingPills = (successRes.updatedPlayer.inventory?.pills || []).find((p: any) => p.id === 'pill_thanh_tam_dan');
  assert(
    remainingPills?.quantity === 1,
    `Khấu trừ chính xác 1 viên Thanh Tâm Đan (từ 2 còn 1). Còn lại: ${remainingPills?.quantity}`
  );
}

// -------------------------------------------------------------------------
// TEST 4: Giải Quyết Biến Cố Đốn Ngộ (Harmonious Epiphany Execution)
// Lựa chọn "Cùng Cảm Ngộ Đại Đạo" -> Tu vi tăng vọt chính xác theo hệ số nhân,
// buff hào quang được thêm vào activeBuffs.
// -------------------------------------------------------------------------
console.log('\n👉 TEST 4: Giải Quyết Biến Cố Đốn Ngộ (Harmonious Epiphany Execution)');
{
  const initialTuVi = 200000;
  const player = createMockPlayer({ tuVi: initialTuVi, demonicNature: 10 });
  const partner = createMockTier9Partner({ affinity: 95 });
  const epiphanyEvent = DUAL_CULTIVATION_EVENTS_POOL.find(e => e.id === 'event_tam_dau_y_hop')!;

  const res = resolveEventChoice(
    player,
    partner,
    epiphanyEvent,
    'choice_cung_cam_ngo_dai_dao'
  );

  assert(res.success === true, 'Kích hoạt đốn ngộ thành công');
  // tuviGain: 150000 * cultivationMultiplier: 3.0 = 450000
  const expectedTuVi = initialTuVi + 150000 * 3.0;
  assert(
    res.updatedPlayer.tuVi === expectedTuVi,
    `Tu Vi tăng vọt chính xác theo hệ số nhân 3.0 (+450,000). Thực tế: ${res.updatedPlayer.tuVi}, Mong đợi: ${expectedTuVi}`
  );
  assert(
    Boolean(res.updatedPlayer.activeBuffs?.buff_song_tu_don_ngo),
    'Buff hào quang "buff_song_tu_don_ngo" phải có trong activeBuffs'
  );
  assert(
    typeof res.updatedPlayer.activeBuffs?.buff_song_tu_don_ngoUntil === 'number' &&
    res.updatedPlayer.activeBuffs.buff_song_tu_don_ngoUntil > Date.now(),
    'Thời hạn buff hào quang phải kéo dài 24 giờ'
  );
  assert(
    res.updatedPartner.totalEpiphanies === 1,
    'Số lần đốn ngộ totalEpiphanies của Đạo Lữ tăng lên 1'
  );
}

// -------------------------------------------------------------------------
// TEST 5: Giới Hạn Biên Của Chỉ Số (Boundary Clamping)
// Ma Tính không bao giờ giảm xuống dưới 0 hoặc vượt quá 100;
// Hảo Cảm không vượt quá mức trần 100 dù nhận bao nhiêu điểm thưởng.
// -------------------------------------------------------------------------
console.log('\n👉 TEST 5: Giới Hạn Biên Của Chỉ Số (Boundary Clamping)');
{
  // 5a: Ma Tính không giảm dưới 0
  const lowDemonicPlayer = createMockPlayer({ demonicNature: 15 });
  const partner = createMockTier9Partner({ affinity: 98 });
  const hoPhapEvent = DUAL_CULTIVATION_EVENTS_POOL.find(e => e.id === 'event_ho_phap_tru_ma')!;

  const clampDownRes = resolveEventChoice(
    lowDemonicPlayer,
    partner,
    hoPhapEvent,
    'choice_tinh_hoa_tien_khi' // Trừ 40 ma tính: 15 - 40 = -25 -> Clamp về 0
  );
  assert(
    clampDownRes.updatedPlayer.demonicNature === 0,
    `Ma Tính được giới hạn chặn dưới chính xác tại 0 (15 - 40 = 0). Thực tế: ${clampDownRes.updatedPlayer.demonicNature}`
  );

  // 5b: Hảo Cảm không vượt trần 100
  assert(
    clampDownRes.updatedPartner.affinity === 100,
    `Hảo Cảm được giới hạn chặn trên chính xác tại 100 (98 + 5 = 100). Thực tế: ${clampDownRes.updatedPartner.affinity}`
  );

  // 5c: Ma Tính không vượt trần 100
  const highDemonicPlayer = createMockPlayer({ demonicNature: 95 });
  const lowAffectionPartner = createMockTier9Partner({ affinity: 10 });
  const hazardEvent = DUAL_CULTIVATION_EVENTS_POOL.find(e => e.id === 'event_tam_ma_phe_hon')!;

  const clampUpRes = resolveEventChoice(
    highDemonicPlayer,
    lowAffectionPartner,
    hazardEvent,
    'choice_co_chap_khang_cu' // Tăng 15 ma tính: 95 + 15 = 110 -> Clamp về 100
  );
  assert(
    clampUpRes.updatedPlayer.demonicNature === 100,
    `Ma Tính được giới hạn chặn trên chính xác tại 100 (95 + 15 = 100). Thực tế: ${clampUpRes.updatedPlayer.demonicNature}`
  );
  assert(
    clampUpRes.updatedPartner.affinity === 0,
    `Hảo Cảm chặn dưới chính xác tại 0 (10 - 10 = 0). Thực tế: ${clampUpRes.updatedPartner.affinity}`
  );
}

// -------------------------------------------------------------------------
// TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
// Nạp mock save game phiên bản cũ (chưa có trường sự kiện song tu),
// chạy qua hàm migration -> Dữ liệu được khởi tạo trơn tru, nạp vào vòng lặp
// Song Tu không sinh lỗi undefined.
// -------------------------------------------------------------------------
console.log('\n👉 TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)');
{
  // Giả lập save game cổ chưa hề có bất kỳ trường nào của tính năng mới
  const legacyOldSave: any = {
    name: 'Cổ Lão Tu Sĩ',
    currentRealm: 10,
    tuVi: 50000,
    linhThach: 10000,
    companionsState: {
      activeCompanionId: 'comp_t9_songtu',
      companions: {
        comp_t9_songtu: {
          id: 'comp_t9_songtu',
          affinity: 90,
          isBonded: true
          // Thiếu hoàn toàn fatigueUntil, totalEpiphanies
        }
      }
    }
    // Thiếu hoàn toàn demonicNature, dualEventsHistory, lastDualEventTimestamp, protectiveAuraActive
  };

  const migrated = migrateDualCultivationEventData(legacyOldSave);

  assert(
    migrated !== undefined && migrated !== null,
    'Migration hoàn tất không phát sinh ngoại lệ'
  );
  assert(
    migrated.demonicNature === 0,
    `demonicNature tự động gán mặc định an toàn là 0. Thực tế: ${migrated.demonicNature}`
  );
  assert(
    Array.isArray(migrated.dualEventsHistory) && migrated.dualEventsHistory.length === 0,
    'dualEventsHistory tự động khởi tạo mảng rỗng []'
  );
  assert(
    migrated.lastDualEventTimestamp === 0,
    'lastDualEventTimestamp tự động khởi tạo giá trị an toàn 0'
  );
  assert(
    migrated.protectiveAuraActive === false,
    'protectiveAuraActive tự động khởi tạo false'
  );

  const migratedComp = migrated.companionsState?.companions['comp_t9_songtu'];
  assert(
    migratedComp?.fatigueUntil === 0,
    'Đạo Lữ cũ được tự động bổ sung fatigueUntil = 0'
  );
  assert(
    migratedComp?.totalEpiphanies === 0,
    'Đạo Lữ cũ được tự động bổ sung totalEpiphanies = 0'
  );

  // Thử nghiệm đưa dữ liệu vừa migrate vào engine Song Tu để đảm bảo không lỗi undefined
  const partnerAfterMigration = {
    ...createMockTier9Partner(),
    ...migratedComp
  };

  const evaluated = evaluateDualCultivationEvent(migrated, partnerAfterMigration, 1, 1.0);
  assert(
    evaluated !== null,
    'Dữ liệu sau migration chạy mượt mà trên Event Engine, không phát sinh lỗi undefined'
  );
}

// =========================================================================
// TỔNG KẾT
// =========================================================================
console.log('\n=================================================================');
console.log(`📊 TỔNG KẾT TEST SUITE: ${passedCount}/${totalCount} TEST CASES PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
console.log('=================================================================');

if (passedCount === totalCount) {
  console.log('🎉 TẤT CẢ 6 TEST CASES ĐÃ ĐẠT CHUẨN 100%! HỆ THỐNG SẴN SÀNG TÍCH HỢP UI.');
  process.exit(0);
} else {
  console.error('❌ MỘT SỐ TEST CASES BỊ THẤT BẠI. CẦN KIỂM TRA LẠI.');
  process.exit(1);
}
