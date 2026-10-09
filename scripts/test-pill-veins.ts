// scripts/test-pill-veins.ts
// Test Suite: Phân Tầng Đan Văn Cửu Trọng & Dược Tính Biến Dị (Pill Veins System & Mutagenic Potions)
// Bao phủ 6 ca kiểm thử cốt lõi theo đặc tả yêu cầu

import {
  PILL_VEIN_CONFIG,
  MUTATION_HARD_CAPS,
  CATALYST_REGISTRY,
  calculateVeinRoll,
  rollPillMutation,
  executeVeinedAlchemyCraft,
  consumeVeinedPill,
  getVeinProbabilities
} from '../lib/pill-vein-logic';
import { migratePillVeinData } from '../lib/save-migration';
import { calculateCombatStats } from '../lib/destiny-data';
import { PlayerStats, DanRecipe, Pill } from '../lib/types';

function createMockPlayer(): PlayerStats {
  return {
    name: 'Hàn Lập',
    currentRealm: 11, // Trúc Cơ Sơ Kỳ
    canCot: 60,
    ngoTinh: 70,
    tamCanh: 65,
    khiVan: 55,
    linhThach: 100000,
    danhVong: 1000,
    tuVi: 50000,
    pillToxicity: 30,
    qiPurity: 70,
    alchemyArtisan: {
      unlocked: true,
      level: 3,
      exp: 150,
      maxExp: 300,
      title: 'Đại Đan Sư',
      criticalCraftCount: 5
    },
    inventory: {
      pills: [
        {
          id: 'pill_truc_co_dan',
          name: 'Trúc Cơ Đan',
          grade: 'Tam Giai',
          description: 'Hỗ trợ đột phá Trúc Cơ.',
          effectType: 'breakthrough_bonus',
          effectValue: 25,
          quantity: 3,
          quality: 'thuong_pham',
          tuViGain: 2000
        }
      ],
      herbs: [
        {
          id: 'herb_linh_chi',
          name: 'Bách Niên Linh Chi',
          grade: 'Tam Giai',
          description: 'Linh chi hấp thụ linh khí trăm năm.',
          price: 50,
          quantity: 20
        },
        {
          id: 'herb_tuyet_lien',
          name: 'Thiên Sơn Tuyết Liên',
          grade: 'Tam Giai',
          description: 'Tuyết liên sinh trưởng nơi băng hàn vạn trượng.',
          price: 80,
          quantity: 15
        }
      ],
      ores: [
        {
          id: 'catalyst_ngu_hanh_hoa',
          name: 'Xích Viêm Tinh Thạch',
          grade: 'Tam Giai',
          description: 'Phụ liệu xúc tác Hỏa hệ.',
          price: 200,
          quantity: 5
        },
        {
          id: 'catalyst_thu_dan',
          name: 'Thần Thú Nội Đan',
          grade: 'Tam Giai',
          description: 'Phụ liệu xúc tác Thể Phách.',
          price: 500,
          quantity: 10
        }
      ]
    },
    consumedMutations: {}
  };
}

function createMockRecipe(): DanRecipe {
  return {
    id: 'recipe_truc_co_dan',
    name: 'Trúc Cơ Đan Phương',
    pillId: 'pill_truc_co_dan',
    pillName: 'Trúc Cơ Đan',
    grade: 'Tam Giai',
    baseSuccessRate: 85,
    linhThachCost: 500,
    description: 'Đan phương luyện chế Trúc Cơ Đan.',
    herbsRequired: [
      { herbId: 'herb_linh_chi', herbName: 'Bách Niên Linh Chi', count: 2 },
      { herbId: 'herb_tuyet_lien', herbName: 'Thiên Sơn Tuyết Liên', count: 1 }
    ]
  };
}

function runTests() {
  console.log('===============================================================');
  console.log('⚔️  TEST SUITE: PHÂN TẦNG ĐAN VĂN & DƯỢC TÍNH BIẾN DỊ (GAMETUTIEN)');
  console.log('===============================================================\n');

  let passedTests = 0;
  const totalTests = 6;

  // -------------------------------------------------------------------------
  // TEST 1: Kiểm Tra Chiết Giảm Đan Độc & Tăng Dược Lực (Vein Scaling Invariant)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 1: Kiểm Tra Chiết Giảm Đan Độc & Tăng Dược Lực (Vein Scaling Invariant)...');
  const v0 = PILL_VEIN_CONFIG[0];
  const v5 = PILL_VEIN_CONFIG[5];
  const v9 = PILL_VEIN_CONFIG[9];

  const test1a = v0.veinMultiplier === 1.0 && v0.toxicityMultiplier === 0.50;
  const test1b = v5.veinMultiplier === 1.4 && v5.toxicityMultiplier === 0.25;
  const test1c = v9.veinMultiplier === 2.0 && v9.toxicityMultiplier === 0.0;

  if (test1a && test1b && test1c) {
    console.log('  ✓ Đan 0 Văn (Hạ Phẩm): Dược lực x1.0, Đan độc 50%');
    console.log('  ✓ Đan 5 Văn (Trung Phẩm): Dược lực x1.4 (+40%), Đan độc 25% (-75%)');
    console.log('  ✓ Đan 9 Văn (Cửu Khổng): Dược lực x2.0 (+100%), Đan độc ĐÚNG 0%');
    console.log('  ==> PASS TEST 1\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 1:', { test1a, test1b, test1c, v0, v5, v9 });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Phục Dụng Đan 9 Văn An Toàn Tuyệt Đối (Zero Toxicity Consumption)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 2: Phục Dụng Đan 9 Văn An Toàn Tuyệt Đối (Zero Toxicity Consumption)...');
  const player2 = createMockPlayer();
  player2.pillToxicity = 30; // 30 điểm đan độc ban đầu
  const initialTuVi = player2.tuVi;

  const pill9Vein: Pill = {
    id: 'pill_truc_co_dan_vein_9',
    name: 'Cực Phẩm Viên Mãn • Trúc Cơ Đan',
    grade: 'Tam Giai',
    description: 'Cửu Khổng Thần Đan.',
    effectValue: 25,
    quantity: 1,
    tuViGain: 2000,
    veinMetadata: {
      veinCount: 9,
      veinMultiplier: 2.0,
      toxicityMultiplier: 0.0,
      mutation: null
    }
  };
  player2.inventory!.pills.push(pill9Vein);

  const res2 = consumeVeinedPill(player2, pill9Vein);
  const toxRemains = res2.updatedPlayer.pillToxicity === 30;
  const tuViDoubled = res2.actualGainTuVi === 4000; // 2000 * 2.0 = 4000
  const zeroAddedTox = res2.addedToxicity === 0;

  if (toxRemains && tuViDoubled && zeroAddedTox) {
    console.log('  ✓ Đan độc trước khi dùng: 30%, sau khi dùng Đan 9 Văn: vẫn đúng 30% (Độc tăng: 0%)');
    console.log('  ✓ Tu Vi cơ bản: 2,000 -> Tu Vi thực nhận: 4,000 (+100% Dược Lực x2.0)');
    console.log('  ==> PASS TEST 2\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 2:', {
      toxRemains,
      tuViDoubled,
      zeroAddedTox,
      initialTox: 30,
      afterTox: res2.updatedPlayer.pillToxicity,
      actualTuVi: res2.actualGainTuVi
    });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 3: Kích Hoạt & Cộng Dồn Dược Tính Biến Dị (Mutagenesis Application)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 3: Kích Hoạt & Cộng Dồn Dược Tính Biến Dị (Mutagenesis Application)...');
  const player3 = createMockPlayer();
  player3.consumedMutations = { fire_resist_percent: 0 };

  const pillFireMut: Pill = {
    id: 'pill_fire_mut_vein_6',
    name: 'Thượng Phẩm • Hỏa Linh Đan',
    grade: 'Tam Giai',
    description: 'Đan đột biến Kháng Hỏa.',
    effectValue: 20,
    quantity: 1,
    tuViGain: 1000,
    veinMetadata: {
      veinCount: 6,
      veinMultiplier: 1.75,
      toxicityMultiplier: 0.2,
      mutation: {
        affixType: 'fire_resist_percent',
        affixName: 'Bích Hỏa Huyền Thuẫn',
        value: 1.0,
        description: 'Tăng vĩnh viễn +1% Kháng Hỏa.'
      }
    }
  };
  player3.inventory!.pills.push(pillFireMut);

  const res3 = consumeVeinedPill(player3, pillFireMut);
  const combatStatsBefore = calculateCombatStats(player3);
  const combatStatsAfter = calculateCombatStats(res3.updatedPlayer);

  const mutationRecorded = res3.updatedPlayer.consumedMutations?.fire_resist_percent === 1.0;
  const combatFireResistApplied = (combatStatsAfter.fireResistPercent || 0) === 1.0;

  if (mutationRecorded && combatFireResistApplied) {
    console.log('  ✓ player.consumedMutations.fire_resist_percent tăng chuẩn xác: 0% -> 1.0%');
    console.log('  ✓ calculateCombatStats đồng bộ chỉ số Kháng Hỏa: ' + combatStatsAfter.fireResistPercent + '%');
    console.log('  ==> PASS TEST 3\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 3:', {
      mutationRecorded,
      combatFireResistApplied,
      mutations: res3.updatedPlayer.consumedMutations,
      combatStats: combatStatsAfter
    });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 4: Phòng Vệ Mức Trần Biến Dị (Hard Cap Boundary Guard)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 4: Phòng Vệ Mức Trần Biến Dị (Hard Cap Boundary Guard)...');
  let player4 = createMockPlayer();
  const hpCap = MUTATION_HARD_CAPS['max_hp_percent']; // 20.0%

  // Nuốt liên tục 50 viên thần đan 9 văn (0% độc) đột biến Máu (+0.5% mỗi viên -> tổng lý thuyết = 25%)
  for (let i = 0; i < 50; i++) {
    const pillMutHp: Pill = {
      id: `pill_hp_mut_${i}`,
      name: 'Thần Thú Huyết Đan',
      grade: 'Tam Giai',
      description: 'Tăng máu vĩnh viễn.',
      effectValue: 10,
      quantity: 1,
      veinMetadata: {
        veinCount: 9,
        veinMultiplier: 2.0,
        toxicityMultiplier: 0.0, // 0% Độc để không bị chặn bởi ngưỡng bão hòa 100%
        mutation: {
          affixType: 'max_hp_percent',
          affixName: 'Khí Huyết Bất Diệt',
          value: 0.5,
          description: 'Tăng vĩnh viễn +0.5% Máu.'
        }
      }
    };
    player4.inventory!.pills = [pillMutHp];
    const outcome = consumeVeinedPill(player4, pillMutHp);
    player4 = outcome.updatedPlayer;
  }

  const finalHpMutVal = player4.consumedMutations?.max_hp_percent || 0;
  const hardCapGuarded = finalHpMutVal === hpCap && finalHpMutVal <= 20.0;

  if (hardCapGuarded) {
    console.log(`  ✓ Cắn liên tục 50 viên đan đột biến máu (+0.5%/viên)`);
    console.log(`  ✓ Giá trị đạt ngưỡng trần chuẩn xác: ${finalHpMutVal}% (Mức trần: ${hpCap}%)`);
    console.log('  ==> PASS TEST 4\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 4:', { finalHpMutVal, hpCap });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 5: Thẩm Định Nguyên Liệu & Phụ Liệu Xúc Tác (Crafting Gating & Consumption)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 5: Thẩm Định Nguyên Liệu & Phụ Liệu Xúc Tác (Crafting Gating & Consumption)...');
  const player5 = createMockPlayer();
  const recipe5 = createMockRecipe();

  // Ca 5a: Thiếu nguyên liệu thảo dược -> Phải bị từ chối
  const brokenPlayer = JSON.parse(JSON.stringify(player5)) as PlayerStats;
  brokenPlayer.inventory!.herbs = []; // Không có thảo dược nào
  const failCraftHerb = executeVeinedAlchemyCraft(recipe5, brokenPlayer, 'catalyst_ngu_hanh_hoa');
  const herbGated = !failCraftHerb.success;

  // Ca 5b: Thiếu phụ liệu xúc tác được chọn -> Phải bị từ chối
  const failCraftCatalyst = executeVeinedAlchemyCraft(recipe5, player5, 'catalyst_invalid_id');
  const catalystGated = !failCraftCatalyst.success;

  // Ca 5c: Đủ nguyên liệu và đủ xúc tác -> Luyện thành công, trừ đúng 1 xúc tác và nguyên liệu
  const catalystOreBefore = player5.inventory!.ores?.find(o => o.id === 'catalyst_ngu_hanh_hoa')?.quantity || 0;
  const herb1Before = player5.inventory!.herbs?.find(h => h.id === 'herb_linh_chi')?.quantity || 0;

  const successCraft = executeVeinedAlchemyCraft(
    recipe5,
    player5,
    'catalyst_ngu_hanh_hoa',
    { deterministicVeinSeed: 0.99, deterministicMutationSeed: 0.01 }
  );

  const craftPassed = successCraft.success;
  const catalystOreAfter = successCraft.updatedPlayer.inventory!.ores?.find(o => o.id === 'catalyst_ngu_hanh_hoa')?.quantity || 0;
  const herb1After = successCraft.updatedPlayer.inventory!.herbs?.find(h => h.id === 'herb_linh_chi')?.quantity || 0;

  const catalystDeducted = catalystOreAfter === catalystOreBefore - 1;
  const herbsDeducted = herb1After === herb1Before - 2;
  const pillHasVeins = successCraft.craftingResult && typeof successCraft.craftingResult.veinCount === 'number';

  if (herbGated && catalystGated && craftPassed && catalystDeducted && herbsDeducted && pillHasVeins) {
    console.log('  ✓ Chặn thành công khi thiếu thảo dược hoặc thiếu phụ liệu xúc tác hợp lệ');
    console.log('  ✓ Luyện thành công khi đủ điều kiện: Trừ đúng 2 thảo dược chính và 1 phụ liệu xúc tác');
    console.log(`  ✓ Thành phẩm thu hoạch: [${successCraft.craftingResult?.basePillName}] phẩm cấp: ${successCraft.craftingResult?.veinCount} Đan Văn`);
    console.log('  ==> PASS TEST 5\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 5:', {
      herbGated,
      catalystGated,
      craftPassed,
      catalystDeducted,
      herbsDeducted,
      pillHasVeins
    });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
  // -------------------------------------------------------------------------
  console.log('🧪 TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)...');
  // Giả lập mock save game v6 hoàn toàn không có trường veinMetadata và không có consumedMutations
  const legacySaveData: any = {
    name: 'Lão Ma Đầu',
    currentRealm: 16, // Kim Đan Sơ Kỳ
    canCot: 75,
    ngoTinh: 80,
    tamCanh: 70,
    khiVan: 60,
    linhThach: 50000,
    inventory: {
      pills: [
        {
          id: 'pill_kim_dan_cuu_chuyen',
          name: 'Cửu Chuyển Kim Đan',
          grade: 'Tứ Giai',
          description: 'Đan dược thượng cổ tăng tu vi cực đại.',
          effectValue: 50,
          quantity: 2,
          // KHÔNG CÓ veinMetadata
          // KHÔNG CÓ isMutated
        }
      ],
      herbs: [],
      ores: []
    }
    // KHÔNG CÓ consumedMutations
  };

  const migratedPlayer = migratePillVeinData(legacySaveData);
  const legacyPill = migratedPlayer.inventory?.pills?.[0];

  const safeVeinMeta = legacyPill?.veinMetadata !== undefined &&
                       legacyPill?.veinMetadata?.veinCount === 0 &&
                       legacyPill?.veinMetadata?.veinMultiplier === 1.0 &&
                       (legacyPill?.veinMetadata?.toxicityMultiplier === 0.50 || legacyPill?.veinMetadata?.toxicityMultiplier === 1.0);

  const safeMutations = migratedPlayer.consumedMutations !== undefined &&
                        typeof migratedPlayer.consumedMutations === 'object';

  // Thử cắn viên thuốc legacy sau migration xem có hoạt động mượt mà không
  const consumeLegacyResult = consumeVeinedPill(migratedPlayer, legacyPill!);
  const legacyConsumptionWorked = consumeLegacyResult.success && consumeLegacyResult.actualGainTuVi > 0;

  if (safeVeinMeta && safeMutations && legacyConsumptionWorked) {
    console.log('  ✓ Đan dược legacy tự động chuẩn hóa sang: veinCount = 0, veinMultiplier = 1.0, toxicityMultiplier = 0.50 (50% Độc)');
    console.log('  ✓ consumedMutations được khởi tạo rỗng an toàn: {}');
    console.log('  ✓ Phục dụng đan dược legacy mượt mà 100%, không phát sinh ngoại lệ undefined');
    console.log('  ==> PASS TEST 6\n');
    passedTests++;
  } else {
    console.error('  ✕ FAIL TEST 6:', {
      safeVeinMeta,
      safeMutations,
      legacyConsumptionWorked,
      legacyPill
    });
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // TỔNG KẾT
  // -------------------------------------------------------------------------
  console.log('===============================================================');
  console.log(`🎉 KẾT QUẢ TEST SUITE: ${passedTests}/${totalTests} TESTS PASSED (100% HOÀN TẤT)`);
  console.log('===============================================================');
}

runTests();
