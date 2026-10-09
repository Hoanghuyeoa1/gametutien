// scripts/test-heavenly-flame.ts
// Test Suite: Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)
// Bao phủ 6 ca kiểm thử cốt lõi theo đặc tả yêu cầu

import {
  HEAVENLY_FLAMES_REGISTRY,
  DEFAULT_MORTAL_FLAME,
  feedHeavenlyFlame,
  applyFlameToAlchemyProcess,
  unlockHeavenlyFlame,
  createDefaultHeavenlyFlameState
} from '../lib/heavenly-flame-logic';
import {
  executeVeinedAlchemyCraft,
  consumeVeinedPill,
  rollPillMutation
} from '../lib/pill-vein-logic';
import { migrateHeavenlyFlameData } from '../lib/save-migration';
import { PlayerStats, DanRecipe, Pill, PlayerFlameInstance } from '../lib/types';

function createMockPlayer(): PlayerStats {
  return {
    name: 'Tiêu Viêm',
    currentRealm: 16, // Kim Đan Sơ Kỳ
    canCot: 70,
    ngoTinh: 75,
    tamCanh: 65,
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
          id: 'herb_linh_chi',
          name: 'Bách Niên Linh Chi',
          grade: 'Tam Giai',
          description: 'Linh chi dược thảo.',
          price: 50,
          quantity: 20
        },
        {
          id: 'herb_tuyet_lien',
          name: 'Thiên Sơn Tuyết Liên',
          grade: 'Tam Giai',
          description: 'Tuyết liên hàn băng.',
          price: 80,
          quantity: 20
        }
      ],
      ores: [
        {
          id: 'ore_hoa_tinh',
          name: 'Hỏa Tinh Thạch',
          grade: 'Tam Giai',
          description: 'Khoáng thạch thuần hỏa tính.',
          price: 150,
          quantity: 30
        },
        {
          id: 'catalyst_ngu_hanh_hoa',
          name: 'Xích Viêm Tinh Thạch',
          grade: 'Tam Giai',
          description: 'Phụ liệu xúc tác Hỏa.',
          price: 200,
          quantity: 5
        }
      ]
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
        },
        flame_xich_loi: {
          flameId: 'flame_xich_loi',
          tier: 1,
          currentExp: 0,
          maxExp: 250,
          unlockedAuraIds: [],
          totalCraftsWithFlame: 0
        },
        flame_u_minh: {
          flameId: 'flame_u_minh',
          tier: 1,
          currentExp: 0,
          maxExp: 250,
          unlockedAuraIds: [],
          totalCraftsWithFlame: 0
        }
      },
      equippedFlameId: 'flame_thanh_lien'
    }
  };
}

function createMockRecipe(): DanRecipe {
  return {
    id: 'recipe_tam_thanh_dan',
    name: 'Tam Thanh Đan Phương',
    pillId: 'pill_tam_thanh_dan',
    pillName: 'Tam Thanh Đan',
    grade: 'Tam Giai',
    baseSuccessRate: 90,
    linhThachCost: 300,
    description: 'Đan dược thanh tâm tăng tu vi.',
    herbsRequired: [
      { herbId: 'herb_linh_chi', herbName: 'Bách Niên Linh Chi', count: 4 },
      { herbId: 'herb_tuyet_lien', herbName: 'Thiên Sơn Tuyết Liên', count: 2 }
    ]
  };
}

function runTests() {
  console.log('====================================================================');
  console.log('🔥 TEST SUITE: THUẦN PHỤC & ÔN DƯỠNG THIÊN ĐỊA DỊ HỎA (GAMETUTIEN)');
  console.log('====================================================================\n');

  let passedTests = 0;
  const totalTests = 6;

  // -------------------------------------------------------------------------
  // TEST 1: Kiểm Tra Hỏa Ôn Hòa - Thiêu Rụi Đan Độc (Toxicity Burn Invariant)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 1: Kiểm Tra Hỏa Ôn Hòa - Thiêu Rụi Đan Độc (Toxicity Burn Invariant)...');
  const player1 = createMockPlayer();
  player1.flameState!.equippedFlameId = 'flame_thanh_lien'; // Thanh Liên Địa Tâm Hỏa: thiêu rụi 40% độc gốc
  const recipe1 = createMockRecipe();

  const craft1 = executeVeinedAlchemyCraft(recipe1, player1, null, {
    deterministicVeinSeed: 0.0 // Cho ra Đan 0 Văn (Hạ Phẩm: 100% độc của phần còn lại)
  });

  const basePillTox = 15; // Đan độc gốc mặc định
  const burnPercent = craft1.craftingResult?.veinMetadata.toxicityBurnPercent || 0;
  // Mô hình suy hao cấp nhân: 0 Văn (50% độc) * (1 - 40% thiêu rụi) = 15 * 0.5 * 0.6 = 4.5 -> 5
  const expectedBurnedTox = Math.round(basePillTox * 0.50 * (1 - 0.4)); // 5

  // Phục dụng viên đan vừa luyện
  const createdPill = craft1.updatedPlayer.inventory!.pills.find(p => p.id.startsWith('pill_tam_thanh_dan'))!;
  const consumeRes = consumeVeinedPill(craft1.updatedPlayer, createdPill);

  const burnCorrect = burnPercent === 40;
  const addedToxCorrect = consumeRes.addedToxicity === expectedBurnedTox; // 5 điểm

  if (burnCorrect && addedToxCorrect) {
    console.log('  ✓ Thanh Liên Hỏa thiêu rụi chuẩn xác: 40% Đan Độc gốc');
    console.log(`  ✓ Đan Độc gốc: ${basePillTox}% -> Sau suy hao cấp nhân (0 Văn 50% x Dị Hỏa 40%) chỉ còn: ${consumeRes.addedToxicity}%`);
    console.log('  ==> PASS TEST 1\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 1:', { burnCorrect, addedToxCorrect, burnPercent, expectedBurnedTox, added: consumeRes.addedToxicity });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Kiểm Tra Hỏa Bạo Liệt - Nhân Đôi Sản Lượng & Xử Lý Nổ Lò (Yield & Explosion Handling)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 2: Kiểm Tra Hỏa Bạo Liệt - Nhân Đôi Sản Lượng & Xử Lý Nổ Lò...');
  const player2 = createMockPlayer();
  player2.flameState!.equippedFlameId = 'flame_xich_loi'; // Bạo Liệt Xích Lôi Viêm (x2 yield, 15% nổ lò)
  const recipe2 = createMockRecipe();

  // Ca 2a: Luyện thành công bình thường (không nổ lò) -> Phải nhân đôi sản lượng
  const successCraft2 = executeVeinedAlchemyCraft(recipe2, player2, null, {
    forceExplosion: false,
    deterministicFlameSeed: 0.99 // Không rơi vào 15% nổ lò
  });
  const yieldDoubled = successCraft2.success && successCraft2.craftingResult?.finalYieldCount === 2;

  // Ca 2b: Giả lập nổ lò (forceExplosion: true) -> Hoàn trả 50% thảo dược, sinh Phế Đan
  const initialHerb1 = player2.inventory!.herbs.find(h => h.id === 'herb_linh_chi')!.quantity; // 20 cành
  const explodedCraft = executeVeinedAlchemyCraft(recipe2, player2, null, {
    forceExplosion: true
  });

  const explodedDetected = explodedCraft.success === false && explodedCraft.craftingResult?.isExploded === true;
  const afterHerb1 = explodedCraft.updatedPlayer.inventory!.herbs.find(h => h.id === 'herb_linh_chi')!.quantity;
  // Công thức cần 4 cành, nổ lò chỉ trừ 50% = 2 cành -> còn lại 18 cành
  const herbRefunded50 = afterHerb1 === initialHerb1 - 2;
  const pheDanCreated = explodedCraft.updatedPlayer.inventory!.pills.some(p => p.id === 'pill_phe_dan');

  if (yieldDoubled && explodedDetected && herbRefunded50 && pheDanCreated) {
    console.log('  ✓ Hỏa Bạo Liệt nhân đôi sản lượng chuẩn xác: 1 lần luyện nhận x2 thành phẩm');
    console.log('  ✓ Biến cố Nổ Lò bắt trọn: Hoàn trả bảo toàn 50% thảo dược nguyên liệu');
    console.log('  ✓ Sinh Phế Đan cháy khét an toàn, không gây crash hệ thống');
    console.log('  ==> PASS TEST 2\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 2:', {
      yieldDoubled,
      explodedDetected,
      herbRefunded50,
      pheDanCreated,
      finalYield: successCraft2.craftingResult?.finalYieldCount,
      initialHerb1,
      afterHerb1
    });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 3: Kiểm Tra Hỏa Biến Dị - Khuếch Đại Dược Tính (Mutation Synergy Invariant)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 3: Kiểm Tra Hỏa Biến Dị - Khuếch Đại Dược Tính (Mutation Synergy Invariant)...');
  const flameProcUminh = applyFlameToAlchemyProcess(
    {
      unlockedFlames: {
        flame_u_minh: {
          flameId: 'flame_u_minh',
          tier: 1,
          currentExp: 0,
          maxExp: 250,
          unlockedAuraIds: [],
          totalCraftsWithFlame: 0
        }
      },
      equippedFlameId: 'flame_u_minh'
    },
    'catalyst_ngu_hanh_hoa'
  );

  const mutMultiplier = flameProcUminh.mutationChanceMultiplier; // Phải bằng 2.0
  const rollWithoutFlame = 5 + 30; // 35%
  const expectedChance = Math.round(rollWithoutFlame * 2.0); // 70%

  const mutRollRes = rollPillMutation('catalyst_ngu_hanh_hoa', 0, 0.5, mutMultiplier);
  const chanceScaledCorrect = mutRollRes.chanceUsed === expectedChance;

  if (mutMultiplier === 2.0 && chanceScaledCorrect) {
    console.log(`  ✓ U Minh Ma Hỏa nhân hệ số dị biến x${mutMultiplier}`);
    console.log(`  ✓ Xác suất đột biến: ${rollWithoutFlame}% -> Khuếch đại thành: ${mutRollRes.chanceUsed}%`);
    console.log('  ==> PASS TEST 3\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 3:', { mutMultiplier, chanceUsed: mutRollRes.chanceUsed, expectedChance });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 4: Kiểm Tra Ôn Dưỡng & Cắn Trần Tiến Hóa (Nourishment & Level Cap Guard)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 4: Kiểm Tra Ôn Dưỡng & Cắn Trần Tiến Hóa (Nourishment & Level Cap Guard)...');
  let flameInst: PlayerFlameInstance = {
    flameId: 'flame_thanh_lien',
    tier: 1,
    currentExp: 0,
    maxExp: 250,
    unlockedAuraIds: [],
    totalCraftsWithFlame: 0
  };

  // Nuôi bằng khoáng thạch: cho ăn 10 viên quặng Tier 3 (10 * 3 * 25 = 750 EXP)
  // Cần 250 EXP để lên Tier 2, maxExp lên 500
  const feed1 = feedHeavenlyFlame(flameInst, 'mineral', 10, 3);
  flameInst = feed1.updatedFlame;

  const leveledToTier2 = flameInst.tier >= 2 && feed1.isLeveledUp;

  // Nuôi tiếp cho đạt Tier 9 (Cho ăn lượng lớn 50,000 EXP)
  const feedMax = feedHeavenlyFlame(flameInst, 'mineral', 1000, 3);
  flameInst = feedMax.updatedFlame;

  const reachedTier9 = flameInst.tier === 9;
  const aurasUnlocked = flameInst.unlockedAuraIds.includes('aura_thanh_lien_1') &&
                        flameInst.unlockedAuraIds.includes('aura_thanh_lien_2') &&
                        flameInst.unlockedAuraIds.includes('aura_thanh_lien_3');

  // Nuôi tiếp khi đã ở Tier 9 -> Phải kẹp trần, không tràn số
  const feedOverflow = feedHeavenlyFlame(flameInst, 'tuvi', 100000);
  const clampedAtTier9 = feedOverflow.updatedFlame.tier === 9 && !feedOverflow.isLeveledUp;

  if (leveledToTier2 && reachedTier9 && aurasUnlocked && clampedAtTier9) {
    console.log('  ✓ Hấp thu khoáng thạch: EXP tăng chuẩn, thăng từ Tier 1 lên Tier 2');
    console.log('  ✓ Tiến hóa cực hạn Tier 9: Tự động mở khóa toàn bộ Auras đan đạo');
    console.log('  ✓ Phòng vệ tràn số: Tiếp tục nuôi ở Tier 9 bị chặn trần chuẩn xác');
    console.log('  ==> PASS TEST 4\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 4:', {
      leveledToTier2,
      reachedTier9,
      aurasUnlocked,
      clampedAtTier9,
      tier: flameInst.tier,
      auras: flameInst.unlockedAuraIds
    });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 5: Phòng Vệ Đổi Hỏa Không Độ Trễ & Mặc Định Phàm Hỏa (Equip State & Fallback)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 5: Phòng Vệ Đổi Hỏa Không Độ Trễ & Mặc Định Phàm Hỏa...');
  const player5 = createMockPlayer();

  // Ca 5a: Chưa trang bị Dị Hỏa (null) -> Fallback về Phàm Hỏa
  player5.flameState!.equippedFlameId = null;
  const mortalProc = applyFlameToAlchemyProcess(player5.flameState, null);
  const isMortalFlame = mortalProc.flameConfig.id === DEFAULT_MORTAL_FLAME.id &&
                        mortalProc.toxicityBurnPercent === 0 &&
                        mortalProc.yieldMultiplier === 1.0;

  // Ca 5b: Chuyển sang Thái Sơ Hỗn Độn Viêm
  player5.flameState = unlockHeavenlyFlame(player5.flameState!, 'flame_hon_don');
  player5.flameState.equippedFlameId = 'flame_hon_don';
  const honDonProc = applyFlameToAlchemyProcess(player5.flameState, null);

  const isHonDonFlame = honDonProc.flameConfig.id === 'flame_hon_don' &&
                        honDonProc.toxicityBurnPercent === 50 &&
                        honDonProc.yieldMultiplier === 2.0;

  if (isMortalFlame && isHonDonFlame) {
    console.log('  ✓ Khi equippedFlameId = null: Tự động fallback về Phàm Hỏa Cơ Bản');
    console.log('  ✓ Thao tác trang bị Dị Hỏa mới có độ trễ bằng 0, không mang tàn dư buff cũ');
    console.log('  ==> PASS TEST 5\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 5:', { isMortalFlame, isHonDonFlame, mortalProc, honDonProc });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)...');
  const legacySaveData: any = {
    name: 'Cổ Đan Sư',
    currentRealm: 11,
    canCot: 60,
    ngoTinh: 70,
    tamCanh: 60,
    khiVan: 50,
    linhThach: 10000,
    danhVong: 500,
    inventory: {
      pills: [],
      herbs: [
        { id: 'herb_linh_chi', name: 'Bách Niên Linh Chi', grade: 'Tam Giai', description: '', price: 50, quantity: 10 },
        { id: 'herb_tuyet_lien', name: 'Thiên Sơn Tuyết Liên', grade: 'Tam Giai', description: '', price: 80, quantity: 10 }
      ],
      ores: []
    }
    // HOÀN TOÀN KHÔNG CÓ flameState
  };

  const migratedPlayer = migrateHeavenlyFlameData(legacySaveData);
  const safeFlameState = migratedPlayer.flameState !== undefined &&
                         typeof migratedPlayer.flameState.unlockedFlames === 'object' &&
                         migratedPlayer.flameState.equippedFlameId === null;

  // Thử dùng player sau migration để chạy tiến trình nung đan xem có crash không
  const craftLegacy = executeVeinedAlchemyCraft(createMockRecipe(), migratedPlayer, null);
  const legacyCraftPassed = craftLegacy.success && craftLegacy.craftingResult !== undefined;

  if (safeFlameState && legacyCraftPassed) {
    console.log('  ✓ Save cũ thiếu flameState tự động chuẩn hóa an toàn: { unlockedFlames: {}, equippedFlameId: null }');
    console.log('  ✓ Luyện đan với save cũ mượt mà 100%, tự động nhận diện Phàm Hỏa');
    console.log('  ==> PASS TEST 6\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 6:', { safeFlameState, legacyCraftPassed, flameState: migratedPlayer.flameState });
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
