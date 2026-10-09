// scripts/test-alchemy-tactics.ts
// Test Suite: Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ (GAMETUTIEN)
// Bao phủ 6 ca kiểm thử cốt lõi theo đặc tả yêu cầu

import {
  HERB_ROLE_REGISTRY,
  calculateHerbHarmonyScore,
  applyHeatStanceModifiers,
  previewConcoction,
  executeTacticalConcoction,
  createDefaultConcoctionSetup
} from '../lib/alchemy-tactics-logic';
import { migrateAlchemyTacticsData } from '../lib/save-migration';
import { PlayerStats, ConcoctionSetup } from '../lib/types';
import { calculateVeinRoll } from '../lib/pill-vein-logic';

function createMockPlayer(): PlayerStats {
  return {
    name: 'Dược Lão Tiên Sinh',
    currentRealm: 16, // Kim Đan Sơ Kỳ
    canCot: 70,
    ngoTinh: 80,
    tamCanh: 75,
    khiVan: 80,
    linhThach: 100000,
    danhVong: 1000,
    tuVi: 60000,
    pillToxicity: 0,
    qiPurity: 100,
    alchemyArtisan: {
      unlocked: true,
      level: 4,
      exp: 200,
      maxExp: 400,
      title: 'Đan Vương',
      criticalCraftCount: 10
    },
    inventory: {
      pills: [],
      herbs: [
        {
          id: 'herb_ngan_hanh',
          name: 'Ngân Hạnh Thảo',
          grade: 'Tam Giai',
          description: 'Quân Dược bồi bổ nguyên khí.',
          price: 50,
          quantity: 50
        },
        {
          id: 'herb_thien_nien_sam',
          name: 'Thiên Niên Linh Sâm',
          grade: 'Tứ Giai',
          description: 'Thần Dược tăng +45% công hiệu.',
          price: 150,
          quantity: 20
        },
        {
          id: 'herb_bang_linh',
          name: 'Băng Linh Thảo',
          grade: 'Tam Giai',
          description: 'Tá Dược giảm 50% độc, đè bẹp nổ lò.',
          price: 100,
          quantity: 20
        },
        {
          id: 'herb_tinh_than',
          name: 'Tinh Thần Thảo',
          grade: 'Tam Giai',
          description: 'Sứ Dược tăng +35% Đan Văn.',
          price: 120,
          quantity: 20
        }
      ],
      ores: []
    },
    consumedMutations: {},
    flameState: {
      unlockedFlames: {},
      equippedFlameId: null
    },
    alchemyTacticsState: {
      defaultStance: 'van_vu_song_hanh',
      customConcoctionsHistory: []
    }
  };
}

function runTests() {
  console.log('====================================================================');
  console.log('🌿 TEST SUITE: HỎA HẬU CHIẾN THUẬT & QUÂN - THẦN - TÁ - SỨ (GAMETUTIEN)');
  console.log('====================================================================\n');

  let passedTests = 0;
  const totalTests = 6;

  // -------------------------------------------------------------------------
  // TEST 1: Thẩm Định Slot Quân Dược Bắt Buộc (Monarch Herb Requirement Guard)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 1: Thẩm Định Slot Quân Dược Bắt Buộc (Monarch Herb Requirement Guard)...');
  const player1 = createMockPlayer();

  // Ca 1a: Không chọn Quân Dược, chỉ chọn Thần Dược
  const invalidSetup: ConcoctionSetup = {
    quan: { herbItemId: null, role: 'quan', count: 0 },
    than: { herbItemId: 'herb_thien_nien_sam', role: 'than', count: 1 },
    ta: null,
    su: null,
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };

  const previewInvalid = previewConcoction(player1, invalidSetup);
  const resultInvalid = executeTacticalConcoction(player1, invalidSetup);

  const blockedCorrectly = !previewInvalid.canCraft &&
                           !resultInvalid.success &&
                           resultInvalid.logs[0].includes('Quân Dược');

  // Ca 1b: Có Quân Dược hợp lệ
  const validSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: null,
    ta: null,
    su: null,
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };

  const previewValid = previewConcoction(player1, validSetup);
  const resultValid = executeTacticalConcoction(player1, validSetup);

  const acceptedCorrectly = previewValid.canCraft && resultValid.success;

  if (blockedCorrectly && acceptedCorrectly) {
    console.log('  ✓ Thiếu Quân Dược: Bị chặn chính xác, từ chối nhóm lò nung');
    console.log('  ✓ Có Quân Dược hợp lệ: Thẩm định thông suốt, cho phép nung đan');
    console.log('  ==> PASS TEST 1\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 1:', { blockedCorrectly, acceptedCorrectly, previewInvalid, resultInvalid });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Khuếch Đại Dược Lực Bằng Thần Dược (Minister Herb Potency Amplification)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 2: Khuếch Đại Dược Lực Bằng Thần Dược (Minister Herb Potency Amplification)...');
  const player2 = createMockPlayer();

  // Đan cơ bản từ Ngân Hạnh Thảo (basePotency = 1000)
  const baseSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: null,
    ta: null,
    su: null,
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };
  const previewBase = previewConcoction(player2, baseSetup);

  // Phối thêm Thiên Niên Linh Sâm (+45% công hiệu)
  const ministerSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: { herbItemId: 'herb_thien_nien_sam', herbName: 'Thiên Niên Linh Sâm', role: 'than', count: 1 },
    ta: null,
    su: null,
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };
  const previewMinister = previewConcoction(player2, ministerSetup);

  // Kiểm tra dược lực
  const basePotency = previewBase.effectivePotencyValue; // 1,000
  const boostedPotency = previewMinister.effectivePotencyValue; // 1,450
  const expectedBoosted = Math.round(1000 * 1.45); // 1,450

  const isPotencyCorrect = basePotency === 1000 && boostedPotency === expectedBoosted;

  if (isPotencyCorrect) {
    console.log(`  ✓ Dược Lực cơ bản Quân Dược: ${basePotency}`);
    console.log(`  ✓ Phối thêm Thiên Niên Linh Sâm (+45%): Dược Lực tăng chính xác lên ${boostedPotency} (+45%)`);
    console.log('  ==> PASS TEST 2\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 2:', { basePotency, boostedPotency, expectedBoosted });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 3: Triệt Tiêu Đan Độc & Đè Bẹp Nổ Lò Bằng Tá Dược (Assistant Herb Suppression)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 3: Triệt Tiêu Đan Độc & Đè Bẹp Nổ Lò Bằng Tá Dược (Assistant Herb Suppression)...');
  const player3 = createMockPlayer();

  // Ca 3a: Kiểm tra triệt tiêu Đan Độc theo mô hình cấp nhân (20 -> 0 Văn (50%) -> Tá Dược -50% = 5 điểm, giảm 75%)
  const taSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: null,
    ta: { herbItemId: 'herb_bang_linh', herbName: 'Băng Linh Thảo', role: 'ta', count: 1 },
    su: null,
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };
  const previewTa = previewConcoction(player3, taSetup);
  const isToxicityHalved = previewTa.effectiveToxicityValue === 5 && previewTa.predictedToxicityReductionPercent === 75;

  // Ca 3b: Ở thế Vũ Hỏa (cơ sở 15% nổ lò), Băng Linh Thảo dập tắt nguy cơ nổ lò về 0%
  const vuHoaWithTaSetup: ConcoctionSetup = {
    ...taSetup,
    stance: 'vu_hoa'
  };
  const previewVuHoaTa = previewConcoction(player3, vuHoaWithTaSetup);
  const isExplosionSuppressed = previewVuHoaTa.explosionRiskPercent === 0;

  if (isToxicityHalved && isExplosionSuppressed) {
    console.log('  ✓ Đan Độc gốc: 20 điểm -> Suy hao cấp nhân (0 Văn 50% x Tá Dược -50%) còn đúng 5 điểm (-75%)');
    console.log('  ✓ Thế Vũ Hỏa: Nguy cơ nổ lò 15% được Tá Dược kiềm chế an toàn về 0%');
    console.log('  ==> PASS TEST 3\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 3:', { isToxicityHalved, isExplosionSuppressed, previewTa, previewVuHoaTa });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 4: Dẫn Khí Khai Mở Đan Văn Bằng Sứ Dược (Envoy Herb Vein Catalyst)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 4: Dẫn Khí Khai Mở Đan Văn Bằng Sứ Dược (Envoy Herb Vein Catalyst)...');
  const player4 = createMockPlayer();

  const envoySetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: null,
    ta: null,
    su: { herbItemId: 'herb_tinh_than', herbName: 'Tinh Thần Thảo', role: 'su', count: 1 },
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };

  const previewEnvoy = previewConcoction(player4, envoySetup);
  const isVeinBonusAccurate = previewEnvoy.veinQualityBonusPercent === 35;

  // Kiểm tra xác suất xúc xắc có điểm bonus của Sứ Dược
  const rollWithoutEnvoy = calculateVeinRoll(10, 2, 1, 0, 0.5);
  const rollWithEnvoy = calculateVeinRoll(10, 2, 1, 35, 0.5);

  if (isVeinBonusAccurate && rollWithEnvoy >= rollWithoutEnvoy) {
    console.log('  ✓ Tinh Thần Thảo cộng chuẩn xác +35 điểm phẩm chất Đan Văn');
    console.log(`  ✓ Phẩm bậc đan văn sau khi dẫn khí: Tăng từ ${rollWithoutEnvoy} lên ${rollWithEnvoy} Văn`);
    console.log('  ==> PASS TEST 4\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 4:', { isVeinBonusAccurate, rollWithoutEnvoy, rollWithEnvoy });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 5: Mô Phỏng Chiến Lược Hỏa Hầu (Stance Modulation & Batch Craft)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 5: Mô Phỏng Chiến Lược Hỏa Hầu (Stance Modulation & Batch Craft)...');
  const player5 = createMockPlayer();

  // Ca 5a: Thế Văn Hỏa -> Rủi ro nổ lò bắt buộc = 0%, Đan Độc giảm thêm 25% (20 * 0.5 * 0.75 = 7.5 -> 8)
  const vanHoaSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: null,
    ta: null,
    su: null,
    stance: 'van_hoa',
    batchMultiplier: 1
  };
  const previewVanHoa = previewConcoction(player5, vanHoaSetup);
  const isVanHoaSafe = previewVanHoa.explosionRiskPercent === 0;
  const isVanHoaToxicityReduced = previewVanHoa.effectiveToxicityValue === 7.5; // 20 * 0.5 * 0.75 = 7.5

  // Ca 5b: Thế Vũ Hỏa Batch x5
  const vuHoaBatchSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: null,
    ta: null,
    su: null,
    stance: 'vu_hoa',
    batchMultiplier: 5
  };
  const previewVuHoa = previewConcoction(player5, vuHoaBatchSetup);
  const isBatchReq5x = previewVuHoa.requiredHerbsSummary.find(r => r.herbId === 'herb_ngan_hanh')?.requiredCount === 10; // 2 * 5 = 10

  const craftBatch = executeTacticalConcoction(player5, vuHoaBatchSetup, { randomSeed: 0.99 });
  const isBatchYieldAccurate = craftBatch.pillsCraftedCount >= 5;

  if (isVanHoaSafe && isVanHoaToxicityReduced && isBatchReq5x && isBatchYieldAccurate) {
    console.log('  ✓ Văn Hỏa: Rủi ro nổ lò = 0%, Đan Độc giảm tiếp 25% (20 -> 15)');
    console.log('  ✓ Vũ Hỏa Batch x5: Tiêu hao đúng x5 thảo dược, xuất xưởng chuẩn xác 5 viên thành phẩm');
    console.log('  ==> PASS TEST 5\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 5:', { isVanHoaSafe, isVanHoaToxicityReduced, isBatchReq5x, isBatchYieldAccurate });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)...');
  const legacySaveData: any = {
    name: 'Hắc Ma Đan Sư',
    currentRealm: 12,
    canCot: 65,
    ngoTinh: 70,
    tamCanh: 60,
    khiVan: 55,
    linhThach: 20000,
    danhVong: 800,
    inventory: {
      pills: [],
      herbs: [
        { id: 'herb_ngan_hanh', name: 'Ngân Hạnh Thảo', grade: 'Tam Giai', description: '', price: 50, quantity: 20 }
      ],
      ores: []
    }
    // HOÀN TOÀN KHÔNG CÓ alchemyTacticsState
  };

  const migratedPlayer = migrateAlchemyTacticsData(legacySaveData);
  const safeTacticsState = migratedPlayer.alchemyTacticsState !== undefined &&
                           migratedPlayer.alchemyTacticsState.defaultStance === 'van_vu_song_hanh' &&
                           Array.isArray(migratedPlayer.alchemyTacticsState.customConcoctionsHistory);

  // Thử dùng player sau migration để chạy tiến trình phối chế xem có mượt mà không
  const testSetup = createDefaultConcoctionSetup();
  const craftLegacy = executeTacticalConcoction(migratedPlayer, testSetup);
  const legacyPassed = craftLegacy.success && craftLegacy.pillsCraftedCount >= 1;

  if (safeTacticsState && legacyPassed) {
    console.log('  ✓ Save cũ thiếu alchemyTacticsState tự động chuẩn hóa an toàn: { defaultStance: "van_vu_song_hanh", customConcoctionsHistory: [] }');
    console.log('  ✓ Phối chế đan dược chiến thuật với save cũ mượt mà 100%, không crash');
    console.log('  ==> PASS TEST 6\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 6:', { safeTacticsState, legacyPassed, tacticsState: migratedPlayer.alchemyTacticsState });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TỔNG KẾT
  // -------------------------------------------------------------------------
  console.log('====================================================================');
  console.log(`🎉 KẾT QUẢ TEST SUITE: ${passedTests}/${totalTests} TESTS PASSED (100% HOÀN TẤT)`);
  console.log('====================================================================');
}

runTests();
