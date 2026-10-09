// scripts/test-dao-foundation.ts
// Test suite tự động kiểm thử toàn diện module Phân Cấp Phẩm Vị Đạo Cơ
// 100% Strict TypeScript, Pure Business Logic, Zero Side Effects

import {
  MAJOR_TRANSITIONS_REGISTRY,
  checkIsMajorRealmTransition,
  canAttemptFoundationGrade,
  calculateFoundationStatBonuses
} from '../lib/dao-foundation-logic';
import {
  migrateDaoFoundationData,
  normalizePlayerData
} from '../lib/save-migration';
import { calculateCombatStats } from '../lib/destiny-data';
import {
  canBreakthrough,
  attemptBreakthrough
} from '../lib/game-logic/cultivation';
import { PlayerStats, Realm } from '../lib/types';
import { deductPillForFoundation } from '../hooks/useDaoFoundationActions';

console.log('================================================================');
console.log('🧪 TEST SUITE: DAO FOUNDATION GRADES & MAJOR REALM TRANSCENDENCE');
console.log('   GAMETUTIEN ENGINE - AUTOMATION TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testNumber: number, testName: string, testFn: () => boolean, detailOnFail?: () => string) {
  totalTests++;
  try {
    const isSuccess = testFn();
    if (isSuccess) {
      console.log(`[PASS] Test ${testNumber}: ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] Test ${testNumber}: ${testName}`);
      if (detailOnFail) {
        console.error(`  -> Chi tiết lỗi: ${detailOnFail()}`);
      }
      process.exit(1);
    }
  } catch (err: any) {
    console.error(`[FAIL] Test ${testNumber}: ${testName} (Exception: ${err?.message || err})`);
    process.exit(1);
  }
}

// =============================================================================
// TEST 1: TRANSITION DETECTION INVARIANT
// =============================================================================
runTest(
  1,
  'Transition Detection Invariant',
  () => {
    // 1. Tiểu cảnh giới: Luyện Khí Tầng 1 -> Tầng 2 bắt buộc trả về null
    const minorStep1 = checkIsMajorRealmTransition(1, 2);
    const minorStep2 = checkIsMajorRealmTransition('Luyện Khí Tầng 1', 'Luyện Khí Tầng 2');
    const minorStep3 = checkIsMajorRealmTransition('Trúc Cơ Sơ Kỳ', 'Trúc Cơ Trung Kỳ');

    if (minorStep1 !== null || minorStep2 !== null || minorStep3 !== null) {
      return false;
    }

    // 2. Đại cảnh giới: Luyện Khí Viên Mãn -> Trúc Cơ Sơ Kỳ bắt buộc trả về config hợp lệ
    const majorStep1 = checkIsMajorRealmTransition(10, 11);
    const majorStep2 = checkIsMajorRealmTransition('Luyện Khí Viên Mãn', 'Trúc Cơ Sơ Kỳ');

    if (!majorStep1 || majorStep1.transitionId !== 'luyen_khi_to_truc_co') {
      return false;
    }
    if (!majorStep2 || majorStep2.transitionId !== 'luyen_khi_to_truc_co') {
      return false;
    }

    // Kiểm tra thêm mốc Kim Đan (15 -> 16) và Nguyên Anh (20 -> 21)
    const kimDanStep = checkIsMajorRealmTransition(15, 16);
    const nguyenAnhStep = checkIsMajorRealmTransition(20, 21);

    return (
      kimDanStep?.transitionId === 'truc_co_to_kim_dan' &&
      nguyenAnhStep?.transitionId === 'kim_dan_to_nguyen_anh'
    );
  },
  () => 'checkIsMajorRealmTransition không nhận diện chuẩn xác giữa tiểu cảnh giới và đại cảnh giới'
);

// =============================================================================
// TEST 2: HẠ PHẨM & ĐỊA PHẨM SCALING
// =============================================================================
runTest(
  2,
  'Hạ Phẩm & Địa Phẩm Scaling',
  () => {
    const transition = MAJOR_TRANSITIONS_REGISTRY.luyen_khi_to_truc_co;
    const baseStats = { hp: 1000, atk: 100, def: 50, mp: 300 };

    // 1. Hạ Phẩm: Nhân đúng hệ số 1.0 (không đổi)
    const haPhamCfg = transition.foundations.ha_pham;
    if (haPhamCfg.statMultiplier !== 1.0) return false;

    const haPhamStats = calculateFoundationStatBonuses(baseStats, haPhamCfg);
    if (
      haPhamStats.hp !== 1000 ||
      haPhamStats.atk !== 100 ||
      haPhamStats.def !== 50 ||
      haPhamStats.mp !== 300
    ) {
      return false;
    }

    // Hạ Phẩm không đòi hỏi đan dược bắt buộc
    const playerNoPill = { tuVi: 50000, linhThach: 10000, pillToxicity: 50, qiPurity: 50, inventory: { pills: [] } };
    const canAttemptHa = canAttemptFoundationGrade(playerNoPill, transition, 'ha_pham');
    if (!canAttemptHa.canAttempt) return false;

    // 2. Địa Phẩm: Nhân đúng hệ số 1.3
    const diaPhamCfg = transition.foundations.dia_pham;
    if (diaPhamCfg.statMultiplier !== 1.3) return false;

    const diaPhamStats = calculateFoundationStatBonuses(baseStats, diaPhamCfg);
    if (
      diaPhamStats.hp !== 1300 ||
      diaPhamStats.atk !== 130 ||
      diaPhamStats.def !== 65 ||
      diaPhamStats.mp !== 390
    ) {
      return false;
    }

    // Địa Phẩm đòi hỏi đan dược tương ứng (Trúc Cơ Đan)
    const checkDiaNoPill = canAttemptFoundationGrade(playerNoPill, transition, 'dia_pham');
    if (checkDiaNoPill.canAttempt) return false; // Thiếu đan dược phải thất bại
    if (!checkDiaNoPill.missingItems.includes('item_truc_co_dan')) return false;

    // Khi có Trúc Cơ Đan và độc <= 30%, chân nguyên >= 80%
    const playerWithPill = {
      ...playerNoPill,
      pillToxicity: 20,
      qiPurity: 85,
      inventory: {
        pills: [{ id: 'item_truc_co_dan', name: 'Trúc Cơ Đan', quantity: 1, veinCount: 3 }]
      }
    };
    const checkDiaValid = canAttemptFoundationGrade(playerWithPill, transition, 'dia_pham');
    return checkDiaValid.canAttempt;
  },
  () => 'Hạ Phẩm hoặc Địa Phẩm không nhân đúng hệ số hoặc rào cản đan dược không kích hoạt'
);

// =============================================================================
// TEST 3: ZERO-TOXICITY & PURITY HARD GUARD (THIÊN ĐẠO)
// =============================================================================
runTest(
  3,
  'Zero-Toxicity & Purity Hard Guard (Thiên Đạo)',
  () => {
    const transition = MAJOR_TRANSITIONS_REGISTRY.luyen_khi_to_truc_co;

    // Case A: pillToxicity = 1 (Dù chỉ 1 điểm độc cũng bị chặn cứng)
    const playerToxic1 = {
      tuVi: 100000,
      linhThach: 50000,
      pillToxicity: 1,
      qiPurity: 100,
      inventory: {
        pills: [{ id: 'item_truc_co_dan', quantity: 1, veinMetadata: { veinCount: 9 } }]
      }
    };
    const resToxic = canAttemptFoundationGrade(playerToxic1, transition, 'thien_dao');
    if (resToxic.canAttempt !== false) return false;
    if (!resToxic.reasons.some(r => r.includes('Đan Độc phải bằng đúng 0%'))) return false;

    // Case B: qiPurity = 99 (Chưa đạt 100% thuần tịnh)
    const playerImpure = {
      ...playerToxic1,
      pillToxicity: 0,
      qiPurity: 99
    };
    const resImpure = canAttemptFoundationGrade(playerImpure, transition, 'thien_dao');
    if (resImpure.canAttempt !== false) return false;
    if (!resImpure.reasons.some(r => r.includes('Chân Nguyên thuần tịnh tuyệt đối 100%'))) return false;

    // Case C: toxicity = 0, purity = 100 nhưng đan dược chỉ có 8 đan văn (thiếu 9 văn)
    const playerPill8Veins = {
      ...playerToxic1,
      pillToxicity: 0,
      qiPurity: 100,
      inventory: {
        pills: [{ id: 'item_truc_co_dan', quantity: 1, veinMetadata: { veinCount: 8 } }]
      }
    };
    const resVein8 = canAttemptFoundationGrade(playerPill8Veins, transition, 'thien_dao');
    if (resVein8.canAttempt !== false) return false;
    if (!resVein8.missingItems.includes('item_truc_co_dan_9_veins')) return false;

    return true;
  },
  () => 'Zero-Toxicity Guard hoặc Purity Guard hoặc 9-Vein Guard không chặn nghiêm ngặt'
);

// =============================================================================
// TEST 4: HEAVENLY FOUNDATION TRANSCENDENCE SUCCESS
// =============================================================================
runTest(
  4,
  'Heavenly Foundation Transcendence Success',
  () => {
    const transition = MAJOR_TRANSITIONS_REGISTRY.luyen_khi_to_truc_co;
    const thienDaoCfg = transition.foundations.thien_dao;

    // 1. Kiểm tra cấu hình: Hệ số 1.6x và thiên phú thien_dao_dao_the
    if (thienDaoCfg.statMultiplier !== 1.6) return false;
    if (!thienDaoCfg.innateTalent || thienDaoCfg.innateTalent.id !== 'thien_dao_dao_the') return false;
    if (thienDaoCfg.innateTalent.statModifiers.allResistPercent !== 10) return false;
    if (thienDaoCfg.innateTalent.statModifiers.maxHpPercent !== 15) return false;
    if (!thienDaoCfg.phenomenonName?.includes('Tử Khí Đông Lai')) return false;

    // 2. Thẩm định tu sĩ đạt chuẩn 100%
    const perfectPlayer = {
      tuVi: 100000,
      linhThach: 50000,
      pillToxicity: 0,
      qiPurity: 100,
      inventory: {
        pills: [{ id: 'item_truc_co_dan', quantity: 1, veinMetadata: { veinCount: 9 } }]
      }
    };

    const res = canAttemptFoundationGrade(perfectPlayer, transition, 'thien_dao');
    if (!res.canAttempt || res.reasons.length > 0 || res.missingItems.length > 0) return false;

    // 3. Kiểm tra chỉ số tăng vọt x1.6
    const baseRealmStats = { hp: 2000, atk: 150, def: 80, mp: 600 };
    const boosted = calculateFoundationStatBonuses(baseRealmStats, thienDaoCfg);

    if (
      boosted.hp !== 3200 ||   // 2000 * 1.6
      boosted.atk !== 240 ||   // 150 * 1.6
      boosted.def !== 128 ||   // 80 * 1.6
      boosted.mp !== 960       // 600 * 1.6
    ) {
      return false;
    }

    return true;
  },
  () => 'Thiên Đạo Trúc Cơ không đạt canAttempt: true hoặc chỉ số không đạt mức x1.6'
);

// =============================================================================
// TEST 5: IMMUTABILITY / SINGLE-ATTEMPT GUARD
// =============================================================================
runTest(
  5,
  'Immutability / Single-Attempt Guard',
  () => {
    const transition = MAJOR_TRANSITIONS_REGISTRY.luyen_khi_to_truc_co;

    // Tu sĩ đã hoàn tất ngưng tụ Thiên Đạo Trúc Cơ trước đó
    const forgedPlayer = {
      tuVi: 100000,
      linhThach: 50000,
      pillToxicity: 0,
      qiPurity: 100,
      daoFoundations: {
        luyen_khi_to_truc_co: 'thien_dao' // Đã ngưng tụ thành công
      },
      unlockedInnateTalents: ['thien_dao_dao_the'],
      inventory: {
        pills: [{ id: 'item_truc_co_dan', quantity: 2, veinMetadata: { veinCount: 9 } }]
      }
    };

    // Thử chọn lại hoặc ngưng tụ lại bất kỳ phẩm vị nào ở mốc này
    const tryReAttemptThienDao = canAttemptFoundationGrade(forgedPlayer, transition, 'thien_dao');
    const tryReAttemptDiaPham = canAttemptFoundationGrade(forgedPlayer, transition, 'dia_pham');
    const tryReAttemptHaPham = canAttemptFoundationGrade(forgedPlayer, transition, 'ha_pham');

    if (tryReAttemptThienDao.canAttempt !== false) return false;
    if (tryReAttemptDiaPham.canAttempt !== false) return false;
    if (tryReAttemptHaPham.canAttempt !== false) return false;

    // Lý do phải giải thích rõ ràng là đã ngưng tụ rồi
    const hasLockedReason = tryReAttemptThienDao.reasons.some(r =>
      r.includes('đã được ngưng tụ Đạo Cơ thành công') || r.includes('không thể tái ngưng tụ')
    );

    return hasLockedReason;
  },
  () => 'Single-Attempt Guard không khóa cứng khi player.daoFoundations[transitionId] đã tồn tại'
);

// =============================================================================
// TEST 6: STAT CALCULATION PRECISION
// =============================================================================
runTest(
  6,
  'Stat Calculation Precision',
  () => {
    const transition = MAJOR_TRANSITIONS_REGISTRY.luyen_khi_to_truc_co;
    const diaPhamCfg = transition.foundations.dia_pham; // multiplier: 1.3

    // Chỉ số lẻ dễ phát sinh floating-point nếu không dùng Math.round()
    const oddStats = {
      hp: 1005, // 1005 * 1.3 = 1306.5 -> 1307
      atk: 77,  // 77 * 1.3 = 100.1 -> 100
      def: 33,  // 33 * 1.3 = 42.9 -> 43
      critRate: 0.15
    };

    const calculated = calculateFoundationStatBonuses(oddStats, diaPhamCfg);

    // Kiểm tra tất cả các giá trị số đều là số nguyên (không có phần thập phân floating-point rác)
    if (!Number.isInteger(calculated.hp) || calculated.hp !== 1307) return false;
    if (!Number.isInteger(calculated.atk) || calculated.atk !== 100) return false;
    if (!Number.isInteger(calculated.def) || calculated.def !== 43) return false;

    // Kiểm tra tính bất biến (Pure function không làm thay đổi oddStats gốc)
    if (oddStats.hp !== 1005 || oddStats.atk !== 77 || oddStats.def !== 33) return false;

    return true;
  },
  () => 'calculateFoundationStatBonuses không làm tròn an toàn bằng Math.round hoặc làm mutate object gốc'
);

// =============================================================================
// TEST 7: SAVE MIGRATION & LEGACY PLAYER AUTO-BACKFILL
// =============================================================================
runTest(
  7,
  'Save Migration & Legacy Player Auto-Backfill',
  () => {
    // 1. Dữ liệu save cũ ở Trúc Cơ (currentRealm = 12) chưa từng có daoFoundations
    const legacyTrucCoPlayer: any = {
      currentRealm: 12,
      tuVi: 2000,
      linhThach: 500
    };
    const migratedTrucCo = migrateDaoFoundationData(legacyTrucCoPlayer);

    // Bắt buộc khởi tạo an toàn
    if (!migratedTrucCo.daoFoundations || !Array.isArray(migratedTrucCo.unlockedInnateTalents)) {
      return false;
    }
    // Gán mặc định an toàn 'ha_pham' cho mốc Trúc Cơ đã vượt qua
    if (migratedTrucCo.daoFoundations.luyen_khi_to_truc_co !== 'ha_pham') {
      return false;
    }
    // Chưa vượt qua Kim Đan nên không được tự ý gán
    if (migratedTrucCo.daoFoundations.truc_co_to_kim_dan !== undefined) {
      return false;
    }

    // 2. Dữ liệu save cũ ở Kim Đan (currentRealm = 18)
    const legacyKimDanPlayer: any = {
      currentRealm: 18,
      tuVi: 25000,
      linhThach: 5000
    };
    const migratedKimDan = migrateDaoFoundationData(legacyKimDanPlayer);
    if (
      !migratedKimDan.daoFoundations ||
      migratedKimDan.daoFoundations.luyen_khi_to_truc_co !== 'ha_pham' ||
      migratedKimDan.daoFoundations.truc_co_to_kim_dan !== 'ha_pham' ||
      migratedKimDan.daoFoundations.kim_dan_to_nguyen_anh !== undefined
    ) {
      return false;
    }

    // 3. Bảo toàn phẩm vị cao hơn (Không bao giờ overwrite phẩm vị 'thien_dao' hoặc 'dia_pham')
    const customPlayer: any = {
      currentRealm: 16,
      daoFoundations: {
        luyen_khi_to_truc_co: 'thien_dao'
      },
      unlockedInnateTalents: ['thien_dao_dao_the']
    };
    const migratedCustom = migrateDaoFoundationData(customPlayer);
    if (
      !migratedCustom.daoFoundations ||
      !migratedCustom.unlockedInnateTalents ||
      migratedCustom.daoFoundations.luyen_khi_to_truc_co !== 'thien_dao' ||
      migratedCustom.daoFoundations.truc_co_to_kim_dan !== 'ha_pham' ||
      migratedCustom.unlockedInnateTalents[0] !== 'thien_dao_dao_the'
    ) {
      return false;
    }

    // 4. Tính Idempotent: chạy nhiều lần không làm thay đổi hay biến dạng dữ liệu
    const pass1 = JSON.stringify(migrateDaoFoundationData(migratedCustom));
    const pass2 = JSON.stringify(migrateDaoFoundationData(JSON.parse(pass1)));
    if (pass1 !== pass2) {
      return false;
    }

    // 5. Tích hợp chuỗi normalizePlayerData
    const normalized = normalizePlayerData({});
    if (!normalized.daoFoundations || !Array.isArray(normalized.unlockedInnateTalents)) {
      return false;
    }

    return true;
  },
  () => 'migrateDaoFoundationData không backfill đúng chuẩn ha_pham hoặc làm mất dữ liệu phẩm vị đã có'
);

// =============================================================================
// TEST 8: COMBAT ENGINE TALENT SYNERGY & BREAKTHROUGH ROUTING
// =============================================================================
runTest(
  8,
  'Combat Engine Talent Synergy & Breakthrough Routing',
  () => {
    // 1. Kiểm tra Combat Engine (calculateCombatStats) cộng dồn thiên phú ẩn
    const mockPlayerBase: PlayerStats = {
      currentRealm: 10,
      canCot: 50,
      ngoTinh: 50,
      tamCanh: 50,
      khiVan: 50,
      tuVi: 10000,
      linhThach: 10000,
      danhVong: 100,
      khiHuyet: 2000,
      maxHp: 2000,
      unlockedInnateTalents: []
    };
    const baseStats = calculateCombatStats(mockPlayerBase);

    // Kích hoạt Thiên Phú Ẩn: 'thien_dao_dao_the' (+10% allResist, +15% maxHp) & 'cuu_chuyen_kiem_the' (+0.25 critDmg, +50% qiRegen)
    const mockPlayerWithTalents: PlayerStats = {
      ...mockPlayerBase,
      unlockedInnateTalents: ['thien_dao_dao_the', 'cuu_chuyen_kiem_the']
    };
    const talentStats = calculateCombatStats(mockPlayerWithTalents);

    // Kháng tất cả: +10%
    if (talentStats.allResistPercent !== 10) return false;
    if (talentStats.damageReductionPercent - baseStats.damageReductionPercent !== 10) return false;

    // Bạo kích: +25% sát thương (critDmg tăng thêm 25 điểm)
    if (talentStats.critDmg - baseStats.critDmg !== 25) return false;

    // Hồi phục chân nguyên: +50%
    if (talentStats.qiRegenBonusPercent !== 50) return false;

    // Max HP: +15%
    if (talentStats.maxHpPercent - (baseStats.maxHpPercent || 0) !== 15) return false;

    // 2. Kiểm tra điều hướng đột phá (canBreakthrough & attemptBreakthrough)
    // 2.1. Tiểu cảnh giới: Luyện Khí Tầng 1 -> Tầng 2
    const minorNextRealm: Realm = {
      id: 2,
      name: 'Luyện Khí Tầng 2',
      requirements: { tuVi: 100, linhThach: 10 }
    } as any;
    const minorCheck = canBreakthrough({ ...mockPlayerBase, currentRealm: 1, tuVi: 500, linhThach: 500 }, minorNextRealm);
    if (minorCheck.isMajorTransition !== false || minorCheck.canBreak !== true) {
      return false;
    }

    // 2.2. Đại cảnh giới: Luyện Khí Viên Mãn (10) -> Trúc Cơ Sơ Kỳ (11)
    const majorNextRealm: Realm = {
      id: 11,
      name: 'Trúc Cơ Sơ Kỳ',
      requirements: { tuVi: 1000, linhThach: 300 }
    } as any;
    const majorCheck = canBreakthrough({ ...mockPlayerBase, currentRealm: 10, tuVi: 5000, linhThach: 5000 }, majorNextRealm);
    // Bắt buộc nhận diện là Đại Cảnh Giới và khóa nút đột phá thường để chuyển hướng chọn Đạo Cơ
    if (majorCheck.isMajorTransition !== true || majorCheck.canBreak !== false) {
      return false;
    }
    if (majorCheck.majorTransitionConfig?.transitionId !== 'luyen_khi_to_truc_co') {
      return false;
    }

    // 2.3. Cố tình gọi attemptBreakthrough trực tiếp tại mốc Đại Cảnh Giới
    const attemptBlock = attemptBreakthrough({ ...mockPlayerBase, currentRealm: 10, tuVi: 5000, linhThach: 5000 }, majorNextRealm);
    if (attemptBlock.success !== false || attemptBlock.isMajorTransition !== true) {
      return false;
    }

    return true;
  },
  () => 'Combat Engine không tích hợp đúng chỉ số Thiên Phú Ẩn hoặc canBreakthrough không chuyển hướng mốc Đại Cảnh Giới'
);

// =============================================================================
// TEST 9: HOOK INVENTORY DEDUCTION PIPELINE & IMMUTABILITY
// =============================================================================
runTest(
  9,
  'Hook Inventory Deduction Pipeline & Immutability',
  () => {
    const rawInventory = {
      pills: [
        { id: 'item_truc_co_dan', quantity: 2, veinMetadata: { veinCount: 0 } },
        { id: 'item_truc_co_dan', quantity: 1, veinMetadata: { veinCount: 9 } },
        { id: 'item_kim_dan_hoan', quantity: 1, veinMetadata: { veinCount: 5 } }
      ]
    };

    // 1. Thử khấu trừ đan 9 văn khi chỉ có đan thường:
    const failNineVein = deductPillForFoundation(
      { pills: [{ id: 'item_truc_co_dan', quantity: 5, veinMetadata: { veinCount: 3 } }] },
      'item_truc_co_dan',
      true // Bắt buộc 9 văn
    );
    if (failNineVein.deducted !== false) return false;

    // 2. Khấu trừ đan thường (không yêu cầu 9 văn):
    const deductNormal = deductPillForFoundation(rawInventory, 'item_kim_dan_hoan', false);
    if (deductNormal.deducted !== true) return false;
    // item_kim_dan_hoan số lượng 1 bị trừ hết -> mảng chỉ còn 2 loại đan
    if (deductNormal.updatedInventory.pills.length !== 2) return false;

    // 3. Khấu trừ đan 9 văn thành công:
    const deductNineVein = deductPillForFoundation(rawInventory, 'item_truc_co_dan', true);
    if (deductNineVein.deducted !== true) return false;
    // Viên 9 văn số lượng 1 bị trừ hết -> chỉ còn viên 0 văn (qty = 2) và viên kim đan (qty = 1)
    const remainingPills = deductNineVein.updatedInventory.pills;
    const hasRemainingNineVein = remainingPills.some((p: any) => (p.veinMetadata?.veinCount ?? 0) === 9);
    if (hasRemainingNineVein) return false;

    // 4. Immutability: Không làm mutate rawInventory ban đầu
    if (rawInventory.pills.length !== 3 || rawInventory.pills[0].quantity !== 2) {
      return false;
    }

    return true;
  },
  () => 'deductPillForFoundation không phân biệt chuẩn xác đan 9 văn hoặc làm mutate mảng kho đồ gốc'
);

// =============================================================================
// KẾT QUẢ TỔNG HỢP
// =============================================================================
console.log('================================================================');
console.log(`KẾT QUẢ TỔNG HỢP: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
console.log('================================================================');
console.log('✅ TẤT CẢ 9 TEST CASES ĐỀU ĐẠT CHUẨN KỸ THUẬT VÀ INVARIANTS!');


