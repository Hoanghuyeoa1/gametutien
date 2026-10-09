// scripts/test-multiplicative-toxicity.ts
// Test Suite Toàn Diện: Mô Hình Suy Hao Cấp Nhân (Multiplicative Compounding Decay)
// GAMETUTIEN Engine - Automated Verification Suite

import {
  PILL_VEIN_CONFIG,
  calculateCompoundingToxicity,
  calculateMultiplicativeToxicity,
  ToxicityCalculationParams
} from '../lib/pill-vein-logic';
import {
  applyFlameToAlchemyProcess,
  extractFlameBurnRatio,
  HEAVENLY_FLAMES_REGISTRY,
  DEFAULT_MORTAL_FLAME
} from '../lib/heavenly-flame-logic';
import {
  applyHeatStanceModifiers,
  previewConcoction,
  executeTacticalConcoction,
  getHerbRoleMetadata
} from '../lib/alchemy-tactics-logic';
import { PlayerStats, ConcoctionSetup } from '../lib/types';
import { PillVeinTier } from '../lib/types/pill-veins';
import { migrateToxicityFormulaUpdate, normalizePlayerData } from '../lib/save-migration';

function createMockPlayer(): PlayerStats {
  return {
    name: 'Dược Thánh',
    currentRealm: 16,
    canCot: 80,
    ngoTinh: 85,
    tamCanh: 80,
    khiVan: 80,
    linhThach: 100000,
    danhVong: 2000,
    tuVi: 80000,
    pillToxicity: 0,
    qiPurity: 100,
    alchemyArtisan: {
      unlocked: true,
      level: 5,
      exp: 500,
      maxExp: 1000,
      title: 'Đan Thánh',
      criticalCraftCount: 20
    },
    inventory: {
      pills: [],
      herbs: [
        { id: 'herb_ngan_hanh', name: 'Ngân Hạnh Thảo', grade: 'Tam Giai', description: '', price: 50, quantity: 50 },
        { id: 'herb_thien_nien_sam', name: 'Thiên Niên Linh Sâm', grade: 'Tứ Giai', description: '', price: 150, quantity: 20 },
        { id: 'herb_bang_linh', name: 'Băng Linh Thảo', grade: 'Tam Giai', description: '', price: 100, quantity: 20 },
        { id: 'herb_tinh_than', name: 'Tinh Thần Thảo', grade: 'Tam Giai', description: '', price: 120, quantity: 20 }
      ],
      ores: []
    },
    consumedMutations: {},
    flameState: {
      unlockedFlames: {
        flame_thanh_lien: {
          flameId: 'flame_thanh_lien',
          tier: 1,
          currentExp: 0,
          maxExp: 250,
          unlockedAuraIds: [],
          totalCraftsWithFlame: 0
        }
      },
      equippedFlameId: 'flame_thanh_lien'
    },
    alchemyTacticsState: {
      defaultStance: 'van_hoa',
      customConcoctionsHistory: []
    }
  };
}

function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 TEST SUITE: MÔ HÌNH SUY HAO CẤP NHÂN (MULTIPLICATIVE DECAY)');
  console.log('   GAMETUTIEN ENGINE - AUTOMATION VERIFICATION');
  console.log('===============================================================\n');

  let passedTests = 0;
  const totalTests = 8;

  // -----------------------------------------------------------------
  // TEST 1: Cấu hình Đan Văn & Multiplier từng bậc
  // -----------------------------------------------------------------
  console.log('🧪 TEST 1: Tỷ Lệ Đan Độc Từng Bậc Đan Văn (0 -> 9 Văn)...');
  const baseTox = 20;

  const t0 = calculateMultiplicativeToxicity({ baseToxicity: baseTox, veinTier: 0 });
  const t1 = calculateMultiplicativeToxicity({ baseToxicity: baseTox, veinTier: 1 });
  const t2 = calculateMultiplicativeToxicity({ baseToxicity: baseTox, veinTier: 2 });
  const t3 = calculateMultiplicativeToxicity({ baseToxicity: baseTox, veinTier: 3 });
  const t6 = calculateMultiplicativeToxicity({ baseToxicity: baseTox, veinTier: 6 });
  const t9 = calculateMultiplicativeToxicity({ baseToxicity: baseTox, veinTier: 9 });

  const c0 = t0.finalToxicity === 10 && t0.totalReductionPercent === 50; // 50% độc
  const c1 = t1.finalToxicity === 8 && t1.totalReductionPercent === 60;  // 40% độc
  const c2 = t2.finalToxicity === 8 && t2.totalReductionPercent === 60;  // 40% độc
  const c3 = t3.finalToxicity === 5 && t3.totalReductionPercent === 75;  // 25% độc
  const c6 = t6.finalToxicity === 2 && t6.totalReductionPercent === 90;  // 10% độc
  const c9 = t9.finalToxicity === 0 && t9.totalReductionPercent === 100; // 0% độc

  if (c0 && c1 && c2 && c3 && c6 && c9) {
    console.log('  ✓ 0 Văn (Hạ Phẩm): 50% Độc (20 -> 10, giảm 50%)');
    console.log('  ✓ 1-2 Văn (Sơ Phẩm): 40% Độc (20 -> 8, giảm 60%)');
    console.log('  ✓ 3-5 Văn (Trung Phẩm): 25% Độc (20 -> 5, giảm 75%)');
    console.log('  ✓ 6-8 Văn (Thượng Phẩm): 10% Độc (20 -> 2, giảm 90%)');
    console.log('  ✓ 9 Văn (Cửu Khổng Thần Đan): Tuyệt đối 0% Độc (giảm 100%)');
    console.log('  ==> [PASSED] Test 1: Đan Văn Multipliers\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 1:', { c0, c1, c2, c3, c6, c9, t0, t1, t3, t6, t9 });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 2: Trích xuất flameBurnRatio & Suy hao qua Dị Hỏa
  // -----------------------------------------------------------------
  console.log('🧪 TEST 2: Trích Xuất flameBurnRatio & Suy Hao Dị Hỏa...');
  const thanhLienState = {
    unlockedFlames: {
      flame_thanh_lien: { flameId: 'flame_thanh_lien', tier: 1 as const, currentExp: 0, maxExp: 250, unlockedAuraIds: [], totalCraftsWithFlame: 0 }
    },
    equippedFlameId: 'flame_thanh_lien'
  };

  const ratioThanhLien = extractFlameBurnRatio(thanhLienState);
  const ratioMortal = extractFlameBurnRatio(null);

  const flameOutcome = applyFlameToAlchemyProcess(thanhLienState, null, false, 0.5, 20, 0);

  const isRatioExtracted = ratioThanhLien === 0.40 && ratioMortal === 0.00;
  const isFlameOutcomeRatioCorrect = flameOutcome.flameBurnRatio === 0.40;
  // 20 * 0.50 (vein 0) = 10 -> 10 * (1 - 0.40) = 6
  const isFlameToxCalculated = flameOutcome.toxicityResult?.finalToxicity === 6;

  if (isRatioExtracted && isFlameOutcomeRatioCorrect && isFlameToxCalculated) {
    console.log('  ✓ extractFlameBurnRatio: Thanh Liên = 0.40, Phàm Hỏa = 0.00');
    console.log('  ✓ FlameProcessOutcome chuyển tiếp flameBurnRatio chuẩn xác');
    console.log('  ✓ Dị Hỏa tính suy hao cấp nhân: 20 -> afterVein 10 -> afterFlame 6');
    console.log('  ==> [PASSED] Test 2: Dị Hỏa Suy Hao Cấp Nhân\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 2:', { isRatioExtracted, isFlameOutcomeRatioCorrect, isFlameToxCalculated, flameOutcome });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 3: Tá Dược Áp Chế Đan Độc (Ta Herb Suppression)
  // -----------------------------------------------------------------
  console.log('🧪 TEST 3: Tá Dược Áp Chế Đan Độc...');
  const bangLinhMeta = getHerbRoleMetadata('herb_bang_linh');
  const thanhTamMeta = getHerbRoleMetadata('herb_thanh_tam');

  const taRatioBangLinh = (bangLinhMeta?.powerValue || 0) / 100; // 0.50
  const taRatioThanhTam = (thanhTamMeta?.powerValue || 0) / 100; // 0.40

  // Base 20, Tier 0 (10 độc), Băng Linh Thảo (-50%) -> 10 * (1 - 0.50) = 5
  const resTa1 = calculateMultiplicativeToxicity({
    baseToxicity: 20,
    veinTier: 0,
    taSuppressionRatio: taRatioBangLinh
  });

  // Base 20, Tier 0 (10 độc), Thanh Tâm Thảo (-40%) -> 10 * (1 - 0.40) = 6
  const resTa2 = calculateMultiplicativeToxicity({
    baseToxicity: 20,
    veinTier: 0,
    taSuppressionRatio: taRatioThanhTam
  });

  if (resTa1.finalToxicity === 5 && resTa2.finalToxicity === 6) {
    console.log('  ✓ Băng Linh Thảo (50% áp chế): Độc còn lại = 5 (giảm 75% so với gốc 20)');
    console.log('  ✓ Thanh Tâm Thảo (40% áp chế): Độc còn lại = 6 (giảm 70% so với gốc 20)');
    console.log('  ==> [PASSED] Test 3: Tá Dược Áp Chế\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 3:', { resTa1, resTa2 });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 4: Hỏa Hầu Điều Tiết (Văn Hỏa Stance Reduction)
  // -----------------------------------------------------------------
  console.log('🧪 TEST 4: Hỏa Hầu Điều Tiết (Văn Hỏa Stance Reduction)...');
  const stanceVanHoa = applyHeatStanceModifiers('van_hoa', 0);
  const stanceVanVu = applyHeatStanceModifiers('van_vu_song_hanh', 0);
  const stanceVuHoa = applyHeatStanceModifiers('vu_hoa', 0);

  const isStanceRatiosCorrect = stanceVanHoa.stanceReductionRatio === 0.25 &&
                                stanceVanVu.stanceReductionRatio === 0.00 &&
                                stanceVuHoa.stanceReductionRatio === 0.00;

  // Base 20, Tier 0 (10 độc), Văn Hỏa (-25%) -> 10 * (1 - 0.25) = 7.5
  const resVanHoa = calculateMultiplicativeToxicity({
    baseToxicity: 20,
    veinTier: 0,
    stanceReductionRatio: stanceVanHoa.stanceReductionRatio
  });

  if (isStanceRatiosCorrect && resVanHoa.finalToxicity === 7.5) {
    console.log('  ✓ Văn Hỏa: stanceReductionRatio = 0.25 (Giảm thêm 25% Đan Độc)');
    console.log('  ✓ Văn Vũ & Vũ Hỏa: stanceReductionRatio = 0.00');
    console.log('  ✓ Kết quả Văn Hỏa: 20 -> 10 -> 7.5 điểm độc');
    console.log('  ==> [PASSED] Test 4: Hỏa Hầu Điều Tiết\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 4:', { isStanceRatiosCorrect, resVanHoa, stanceVanHoa });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 5: Chuỗi Suy Hao Cấp Nhân Toàn Phần (Full 4-Stage Compound Decay)
  // -----------------------------------------------------------------
  console.log('🧪 TEST 5: Chuỗi Suy Hao Cấp Nhân Toàn Phần (4-Stage Breakdown)...');
  const complexParams: ToxicityCalculationParams = {
    baseToxicity: 100,
    veinTier: 3,                 // Tier 3: 25% độc -> afterVein = 25
    flameBurnRatio: 0.20,        // Dị Hỏa: 20% -> afterFlame = 25 * 0.8 = 20
    taSuppressionRatio: 0.10,    // Tá Dược: 10% -> afterTa = 20 * 0.9 = 18
    stanceReductionRatio: 0.05   // Hỏa Hầu: 5% -> afterStance = 18 * 0.95 = 17.1
  };

  const complexRes = calculateMultiplicativeToxicity(complexParams);
  const b = complexRes.breakdown;

  const isBreakdownCorrect = b.baseToxicity === 100 &&
                             b.afterVein === 25 &&
                             b.afterFlame === 20 &&
                             b.afterTa === 18 &&
                             b.afterStance === 17.1 &&
                             complexRes.finalToxicity === 17.1 &&
                             complexRes.totalReductionPercent === 82.9;

  if (isBreakdownCorrect) {
    console.log(`  ✓ Tầng 1 (Đan Văn 3): 100 -> ${b.afterVein} (25% độc)`);
    console.log(`  ✓ Tầng 2 (Dị Hỏa 20%): ${b.afterVein} -> ${b.afterFlame}`);
    console.log(`  ✓ Tầng 3 (Tá Dược 10%): ${b.afterFlame} -> ${b.afterTa}`);
    console.log(`  ✓ Tầng 4 (Hỏa Hầu 5%): ${b.afterTa} -> ${b.afterStance}`);
    console.log(`  ✓ Đan độc cuối cùng: ${complexRes.finalToxicity} | Tổng chiết giảm: ${complexRes.totalReductionPercent}%`);
    console.log('  ==> [PASSED] Test 5: Chuỗi 4 Tầng Suy Hao Cấp Nhân\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 5:', { isBreakdownCorrect, complexRes });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 6: Khớp 100% Live Telemetry Preview & Thực Tế Xuất Lò
  // -----------------------------------------------------------------
  console.log('🧪 TEST 6: Khớp 100% Live Telemetry Preview & Thực Tế Xuất Lò...');
  const player = createMockPlayer();

  const concoctionSetup: ConcoctionSetup = {
    quan: { herbItemId: 'herb_ngan_hanh', herbName: 'Ngân Hạnh Thảo', role: 'quan', count: 2 },
    than: { herbItemId: 'herb_thien_nien_sam', herbName: 'Thiên Niên Linh Sâm', role: 'than', count: 1 },
    ta: { herbItemId: 'herb_bang_linh', herbName: 'Băng Linh Thảo', role: 'ta', count: 1 },
    su: { herbItemId: 'herb_tinh_than', herbName: 'Tinh Thần Thảo', role: 'su', count: 1 },
    stance: 'van_hoa',
    batchMultiplier: 1
  };

  // Giả lập xuất lò với 0 Văn (Hạ phẩm)
  const craft0 = executeTacticalConcoction(player, concoctionSetup, {
    randomSeed: 0.0 // Ép ra 0 Văn
  });

  // Gọi preview với veinTier = 0 tương ứng
  const flameConfig = HEAVENLY_FLAMES_REGISTRY['flame_thanh_lien'];
  const preview0 = previewConcoction(player, concoctionSetup, flameConfig, 0);

  const isTelemetryMatch = craft0.effectiveToxicity === preview0.effectiveToxicityValue;

  // Giả lập trường hợp 9 Văn (Cửu Khổng)
  const preview9 = previewConcoction(player, concoctionSetup, flameConfig, 9);
  const isZeroAt9 = preview9.effectiveToxicityValue === 0 && preview9.predictedToxicityReductionPercent === 100;

  if (isTelemetryMatch && isZeroAt9) {
    console.log(`  ✓ Đan 0 Văn: Preview (${preview0.effectiveToxicityValue}) khớp 100% Thực tế xuất lò (${craft0.effectiveToxicity})`);
    console.log('  ✓ Đan 9 Văn: Preview trả về đúng 0 độc, 100% triệt tiêu');
    console.log('  ==> [PASSED] Test 6: Đồng Bộ Live Telemetry\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 6:', { isTelemetryMatch, isZeroAt9, craft0Tox: craft0.effectiveToxicity, preview0Tox: preview0.effectiveToxicityValue, preview9 });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 7: Kiểm Thử Ràng Buộc Bất Biến (Invariants & Anti-Linear Subtraction)
  // -----------------------------------------------------------------
  console.log('🧪 TEST 7: Kiểm Thử Ràng Buộc Bất Biến (Invariants & Edge Cases)...');

  // Ca 7a: Base Toxicity = 0
  const zeroBase = calculateMultiplicativeToxicity({ baseToxicity: 0, veinTier: 0 });
  const isZeroBaseHandled = zeroBase.finalToxicity === 0 && zeroBase.totalReductionPercent === 100;

  // Ca 7b: Cực hạn không bao giờ âm độc
  const extremeReduction = calculateMultiplicativeToxicity({
    baseToxicity: 50,
    veinTier: 6,
    flameBurnRatio: 0.99,
    taSuppressionRatio: 0.99,
    stanceReductionRatio: 0.99
  });
  const isNeverNegative = extremeReduction.finalToxicity >= 0;

  // Ca 7c: 9 Văn tuyệt đối 0 độc dù không có phụ trợ nào
  const pure9 = calculateMultiplicativeToxicity({
    baseToxicity: 50,
    veinTier: 9,
    flameBurnRatio: 0,
    taSuppressionRatio: 0,
    stanceReductionRatio: 0
  });
  const isPure9Zero = pure9.finalToxicity === 0 && pure9.totalReductionPercent === 100;

  if (isZeroBaseHandled && isNeverNegative && isPure9Zero) {
    console.log('  ✓ Độc gốc 0: Xử lý an toàn, không sinh NaN/Infinity');
    console.log(`  ✓ Cực hạn suy hao: Đan độc = ${extremeReduction.finalToxicity} (luôn >= 0, không âm)`);
    console.log('  ✓ 9 Văn cô lập: Tuyệt đối 0 độc dù không có Dị Hỏa / Tá Dược');
    console.log('  ==> [PASSED] Test 7: Ràng Buộc Bất Biến\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 7:', { isZeroBaseHandled, isNeverNegative, isPure9Zero, extremeReduction, pure9 });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TEST 8: Save Game Migration & Idempotence Invariant
  // -----------------------------------------------------------------
  console.log('🧪 TEST 8: Save Game Migration & Idempotence Invariant...');
  const oldPlayer = createMockPlayer();
  oldPlayer.inventory = oldPlayer.inventory || { pills: [], herbs: [], ores: [] };
  oldPlayer.inventory.pills = [
    {
      id: 'pill_truc_co_old',
      name: 'Trúc Cơ Đan (Cũ)',
      grade: 'Nhất Giai',
      description: 'Đan dược save cũ 0 văn',
      effectValue: 100,
      quantity: 5,
      veinTier: 0,
      toxicityMultiplier: 1.0,
      pillToxicity: 20,
      veinMetadata: {
        veinCount: 0,
        veinMultiplier: 1.0,
        toxicityMultiplier: 1.0,
        mutation: null
      }
    },
    {
      id: 'pill_cuu_khong_old',
      name: 'Cửu Khổng Thần Đan (Cũ)',
      grade: 'Cửu Giai',
      description: 'Đan dược save cũ 9 văn',
      effectValue: 5000,
      quantity: 1,
      danVan: 9,
      toxicityMultiplier: 0.5,
      pillToxicity: 10,
      veinMetadata: {
        veinCount: 9,
        veinMultiplier: 4.0,
        toxicityMultiplier: 0.5,
        mutation: null
      }
    },
    {
      id: 'pill_tam_van_old',
      name: 'Thanh Hư Đan (3 Văn)',
      grade: 'Tam Giai',
      description: 'Đan 3 văn',
      effectValue: 300,
      quantity: 2,
      veinTier: 3,
      toxicityMultiplier: 0.8,
      pillToxicity: 20
    }
  ];

  // Chạy migration lần 1
  const migratedPlayer1 = migrateToxicityFormulaUpdate(oldPlayer);
  const inv1 = migratedPlayer1.inventory?.pills ?? [];
  const p0_1 = inv1.find(p => p.id === 'pill_truc_co_old');
  const p9_1 = inv1.find(p => p.id === 'pill_cuu_khong_old');
  const p3_1 = inv1.find(p => p.id === 'pill_tam_van_old');

  // Assertions lần 1:
  // - 0 Văn nhận đúng hệ số 0.50, độc tính tính lại (20 * 0.5 = 10)
  const isPill0Correct = p0_1?.toxicityMultiplier === 0.50 &&
                         p0_1?.veinMetadata?.toxicityMultiplier === 0.50 &&
                         p0_1?.pillToxicity === 10;

  // - 9 Văn có hệ số 0.00 và độc tính bằng 0 tuyệt đối
  const isPill9Correct = p9_1?.toxicityMultiplier === 0.00 &&
                         p9_1?.veinMetadata?.toxicityMultiplier === 0.00 &&
                         p9_1?.pillToxicity === 0;

  // - 3 Văn nhận đúng hệ số 0.25 theo PILL_VEIN_CONFIG mới
  const isPill3Correct = p3_1?.toxicityMultiplier === 0.25 &&
                         p3_1?.veinMetadata?.toxicityMultiplier === 0.25;

  // - Không mất mát vật phẩm (đủ 3 loại đan, giữ nguyên số lượng)
  const isNoItemLoss = inv1.length === 3 &&
                       p0_1?.quantity === 5 &&
                       p9_1?.quantity === 1 &&
                       p3_1?.quantity === 2;

  // Chạy migration lần 2 (Kiểm tra Idempotent)
  const migratedPlayer2 = migrateToxicityFormulaUpdate(migratedPlayer1);
  const inv2 = migratedPlayer2.inventory?.pills ?? [];
  const p0_2 = inv2.find(p => p.id === 'pill_truc_co_old');
  const p9_2 = inv2.find(p => p.id === 'pill_cuu_khong_old');
  const isIdempotent = JSON.stringify(migratedPlayer1) === JSON.stringify(migratedPlayer2) &&
                       p0_2?.pillToxicity === 10 &&
                       p9_2?.pillToxicity === 0;

  // Kiểm tra tích hợp vào chu trình nạp save tổng normalizePlayerData
  const normalizedSave = normalizePlayerData(oldPlayer);
  const normInv = normalizedSave.inventory?.pills ?? [];
  const normP0 = normInv.find(p => p.id === 'pill_truc_co_old');
  const normP9 = normInv.find(p => p.id === 'pill_cuu_khong_old');
  const isNormalizeIntegrated = normP0?.toxicityMultiplier === 0.50 &&
                                normP9?.toxicityMultiplier === 0.00 &&
                                normP9?.pillToxicity === 0;

  if (isPill0Correct && isPill9Correct && isPill3Correct && isNoItemLoss && isIdempotent && isNormalizeIntegrated) {
    console.log('  ✓ Đan 0 Văn: toxicityMultiplier cập nhật từ 1.0 -> 0.50, pillToxicity: 20 -> 10');
    console.log('  ✓ Đan 9 Văn: toxicityMultiplier = 0.00, pillToxicity = 0 tuyệt đối');
    console.log('  ✓ Đan 3 Văn: toxicityMultiplier cập nhật đúng 0.25 theo PILL_VEIN_CONFIG');
    console.log('  ✓ Bảo toàn vật phẩm: 100% không mất mát (length = 3, giữ nguyên quantity)');
    console.log('  ✓ Tính lũy đẳng (Idempotent): Chạy migration nhiều lần kết quả nhất quán tuyệt đối');
    console.log('  ✓ Tích hợp normalizePlayerData: Tự động chạy khi nạp save game');
    console.log('  ==> [PASSED] Test 8: Save Game Migration & Idempotence\n');
    passedTests++;
  } else {
    console.error('  ✕ [FAILED] Test 8:', {
      isPill0Correct,
      isPill9Correct,
      isPill3Correct,
      isNoItemLoss,
      isIdempotent,
      isNormalizeIntegrated,
      p0_1,
      p9_1,
      p3_1,
      normP0,
      normP9
    });
    process.exit(1);
  }

  // -----------------------------------------------------------------
  // TỔNG KẾT
  // -----------------------------------------------------------------
  console.log('===============================================================');
  console.log(`🎉 KẾT QUẢ TEST SUITE: ${passedTests}/${totalTests} TESTS PASSED (100% HOÀN TẤT)`);
  console.log('===============================================================');
}

runTestSuite();
