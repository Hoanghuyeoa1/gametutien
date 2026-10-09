// scripts/test-custom-recipes.ts
// Unit & Integration Test Suite for:
// "Khai Sáng Đan Phương & Đan Đạo Tông Sư (Phase 1: Types, Pure Engine & Test Suite)"

import { createNewPlayer } from '../lib/game-logic/character';
import { normalizePlayerData, migrateCustomRecipeData } from '../lib/save-migration';
import {
  evaluateHerbExperiment,
  generateRecipeFingerprint,
  innovateCustomRecipe,
  getHerbMedicinalProperty,
  HERB_MEDICINAL_PROPERTIES
} from '../lib/custom-recipe-logic';
import { ExperimentSlot, CustomRecipeState } from '../lib/types/custom-recipe';
import { PlayerStats, Herb } from '../lib/types';

function assert(condition: any, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('================================================================');
console.log('🧪 TEST SUITE: KHAI SÁNG ĐAN PHƯƠNG & ĐAN ĐẠO TÔNG SƯ (PHASE 1)');
console.log('================================================================\n');

// ─────────────────────────────────────────────────────────────
// TEST 1: Quá nhiệt (+6) nổ lò -> isHarmonious = false
// ─────────────────────────────────────────────────────────────
console.log('▶ [TEST 1] Kiểm tra Quá Nhiệt (+6) nổ lò nát đan:');
{
  // 3 thảo dược thuộc tính Đại Nhiệt (mỗi vị +2 điểm nhiệt)
  // Tổng thermalBalance = 2 + 2 + 2 = +6
  const overheatSlots: ExperimentSlot[] = [
    { herbId: 'herb_thien_nien_sam', count: 1 }, // thermalScore: +2
    { herbId: 'cuong_bao_hoa', count: 1 },        // thermalScore: +2
    { herbId: 'herb_loi_kich', count: 1 }         // thermalScore: +2
  ];

  const evalResult = evaluateHerbExperiment(overheatSlots);

  assert(evalResult.thermalBalance === 6, `Thermal balance phải bằng +6 (thực tế: ${evalResult.thermalBalance})`);
  assert(evalResult.isHarmonious === false, 'Hỏa khí quá thịnh (+6) bắt buộc lò luyện phải nổ, isHarmonious = false');
  assert(evalResult.predictedGrade === 'Phế Đan', `Dự kiến phẩm chất phải là Phế Đan (thực tế: ${evalResult.predictedGrade})`);
  assert(evalResult.predictedEffectValue === 0, 'Phế đan nổ lò không có dược lực tăng tu vi');
  assert(Boolean(evalResult.reason?.includes('hyperthermic_explosion') || evalResult.reason?.includes('thermal')), 'Nguyên nhân nổ lò phải chỉ rõ quá nhiệt');
  console.log(`   Thông báo nổ lò: "${evalResult.message}"`);
}
console.log('--- TEST 1 PASSED ---\n');

// ─────────────────────────────────────────────────────────────
// TEST 2: Âm dương hòa hợp (Thermal = 0) -> isHarmonious = true
// ─────────────────────────────────────────────────────────────
console.log('▶ [TEST 2] Kiểm tra Âm Dương Hòa Hợp (Thermal = 0) thành đan viên mãn:');
{
  // 1 vị ôn nhiệt (+1), 1 vị hàn lương (-1), 1 vị tính bình (0)
  // Tổng thermalBalance = +1 + (-1) + 0 = 0
  const balancedSlots: ExperimentSlot[] = [
    { herbId: 'huyet_tinh_thao', count: 1 }, // thermalScore: +1, tonic: 45, tox: 10
    { herbId: 'tu_khi_hoa', count: 1 },       // thermalScore: -1, tonic: 40, tox: 8
    { herbId: 'linh_thao', count: 1 }         // thermalScore: 0,  tonic: 25, tox: 5
  ];

  const evalResult = evaluateHerbExperiment(balancedSlots);

  assert(evalResult.thermalBalance === 0, `Thermal balance phải bằng 0 (thực tế: ${evalResult.thermalBalance})`);
  assert(evalResult.tonicRatio >= 0.8, `Tonic ratio phải >= 0.8 (thực tế: ${evalResult.tonicRatio})`);
  assert(evalResult.isHarmonious === true, 'Âm dương hòa hợp hoàn hảo (Thermal = 0) phải cho isHarmonious = true');
  assert(evalResult.harmonyScore >= 70, `Harmony score phải cao (thực tế: ${evalResult.harmonyScore})`);
  assert(evalResult.predictedGrade !== 'Phế Đan', 'Đan dược thành công không được là Phế Đan');
  assert(evalResult.predictedEffectValue > 0, `Dược lực tu vi phải > 0 (thực tế: ${evalResult.predictedEffectValue})`);
  console.log(`   Kết quả: Phẩm cấp [${evalResult.predictedGrade}], HarmonyScore: ${evalResult.harmonyScore}/100`);
  console.log(`   Thông báo: "${evalResult.message}"`);
}
console.log('--- TEST 2 PASSED ---\n');

// ─────────────────────────────────────────────────────────────
// TEST 3: Fingerprint collision guard (trùng recipeFingerprint)
// ─────────────────────────────────────────────────────────────
console.log('▶ [TEST 3] Kiểm tra mã băm chuẩn tắc & chống trùng lặp công thức (Fingerprint Collision Guard):');
{
  // 3.1: Kiểm tra tính chuẩn tắc (Canonical Invariant) không phụ thuộc thứ tự input
  const slotsInputOrder1: ExperimentSlot[] = [
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 2 },
    { herbId: 'linh_thao', count: 3 }
  ];

  const slotsInputOrder2: ExperimentSlot[] = [
    { herbId: 'linh_thao', count: 3 },
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 2 }
  ];

  const fp1 = generateRecipeFingerprint(slotsInputOrder1);
  const fp2 = generateRecipeFingerprint(slotsInputOrder2);

  assert(fp1 === fp2, `Hai thứ tự nhập khác nhau phải sinh ra cùng mã băm chuẩn tắc (${fp1})`);
  assert(fp1 === 'huyet_tinh_thao:2|linh_thao:3|tu_khi_hoa:1', `Mã băm phải đúng định dạng alphabet: 'huyet_tinh_thao:2|linh_thao:3|tu_khi_hoa:1' (thực tế: ${fp1})`);

  // 3.2: Khởi tạo player mock có sẵn thảo dược trong kho đồ
  const player = createNewPlayer();
  player.inventory = {
    pills: [],
    herbs: [
      { id: 'huyet_tinh_thao', name: 'Huyết Tinh Thảo', grade: 'Nhị Giai', description: '', price: 50, quantity: 10 },
      { id: 'tu_khi_hoa', name: 'Tụ Khí Thanh Hoa', grade: 'Nhị Giai', description: '', price: 50, quantity: 10 },
      { id: 'linh_thao', name: 'Bách Thảo Sơ Thiên', grade: 'Nhất Giai', description: '', price: 20, quantity: 10 }
    ],
    ores: []
  };

  const recipeSlots: ExperimentSlot[] = [
    { herbId: 'huyet_tinh_thao', count: 1 },
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'linh_thao', count: 1 }
  ];

  // Khai sáng lần 1: thành công
  const firstInnovate = innovateCustomRecipe(player, recipeSlots, 'Cửu Chuyển Hồi Nguyên Đan', 'Đan phương tự sáng chế.');
  assert(firstInnovate.success === true, 'Khai sáng lần 1 với dược liệu hòa hợp phải thành công');
  assert(firstInnovate.recipe !== undefined, 'Đan phương tạo ra không được rỗng');
  assert(firstInnovate.recipe?.fingerprint === generateRecipeFingerprint(recipeSlots), 'Mã băm đan phương phải khớp');
  assert(firstInnovate.updatedPlayer.customRecipeState?.discoveredRecipes.length === 1, 'Danh sách đan phương phải tăng lên 1');

  // Khai sáng lần 2 với cùng tổ hợp (thứ tự đảo ngược): Phải bị từ chối bởi Fingerprint collision guard
  const reverseSlots: ExperimentSlot[] = [
    { herbId: 'linh_thao', count: 1 },
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 1 }
  ];

  const duplicateInnovate = innovateCustomRecipe(firstInnovate.updatedPlayer, reverseSlots, 'Trùng Lặp Đan', 'Thử đăng ký lại.');
  assert(duplicateInnovate.success === false, 'Khai sáng công thức trùng lặp phải bị từ chối');
  assert(duplicateInnovate.error?.includes('đã được khai sáng trước đó') || false, 'Lỗi phải thông báo đan phương đã tồn tại');
  assert(duplicateInnovate.updatedPlayer.customRecipeState?.discoveredRecipes.length === 1, 'Không được phép thêm đan phương trùng lặp');
  console.log(`   Fingerprint bảo vệ an toàn: ${fp1}`);
}
console.log('--- TEST 3 PASSED ---\n');

// ─────────────────────────────────────────────────────────────
// TEST 4: Ràng buộc số slot (tối thiểu 3, tối đa 5)
// ─────────────────────────────────────────────────────────────
console.log('▶ [TEST 4] Kiểm tra Ràng buộc số slot thảo dược (Tối thiểu 3, Tối đa 5 vị):');
{
  // 4.1: Dưới 3 vị (2 vị) -> Phải thất bại
  const twoSlots: ExperimentSlot[] = [
    { herbId: 'huyet_tinh_thao', count: 1 },
    { herbId: 'linh_thao', count: 1 }
  ];
  const evalUnder = evaluateHerbExperiment(twoSlots);
  assert(evalUnder.isHarmonious === false, 'Dưới 3 vị thảo dược phải bị từ chối');
  assert(evalUnder.reason === 'insufficient_slots', `Lý do phải là insufficient_slots (thực tế: ${evalUnder.reason})`);

  // 4.2: Trên 5 vị (6 vị) -> Phải thất bại
  const sixSlots: ExperimentSlot[] = [
    { herbId: 'linh_thao', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 1 },
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'tay_tuy_linh_nhi', count: 1 },
    { herbId: 'truc_co_chi_lan', count: 1 },
    { herbId: 'cuu_chuyen_ngoc_tuy', count: 1 }
  ];
  const evalOver = evaluateHerbExperiment(sixSlots);
  assert(evalOver.isHarmonious === false, 'Vượt quá 5 vị thảo dược phải bị từ chối');
  assert(evalOver.reason === 'exceeded_slots', `Lý do phải là exceeded_slots (thực tế: ${evalOver.reason})`);

  // 4.3: Đúng 3, 4, 5 vị -> Vượt qua kiểm tra số lượng slot
  const threeSlots: ExperimentSlot[] = [
    { herbId: 'linh_thao', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 1 },
    { herbId: 'tu_khi_hoa', count: 1 }
  ];
  const fourSlots: ExperimentSlot[] = [
    { herbId: 'linh_thao', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 1 },
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'tay_tuy_linh_nhi', count: 1 }
  ];
  const fiveSlots: ExperimentSlot[] = [
    { herbId: 'linh_thao', count: 1 },
    { herbId: 'huyet_tinh_thao', count: 1 },
    { herbId: 'tu_khi_hoa', count: 1 },
    { herbId: 'tay_tuy_linh_nhi', count: 1 },
    { herbId: 'truc_co_chi_lan', count: 1 }
  ];

  assert(evaluateHerbExperiment(threeSlots).reason !== 'insufficient_slots', '3 slot hợp lệ về số lượng');
  assert(evaluateHerbExperiment(fourSlots).reason !== 'insufficient_slots' && evaluateHerbExperiment(fourSlots).reason !== 'exceeded_slots', '4 slot hợp lệ về số lượng');
  assert(evaluateHerbExperiment(fiveSlots).reason !== 'exceeded_slots', '5 slot hợp lệ về số lượng');
}
console.log('--- TEST 4 PASSED ---\n');

// ─────────────────────────────────────────────────────────────
// TEST 5: Save migration không crash mock save cũ & Idempotency
// ─────────────────────────────────────────────────────────────
console.log('▶ [TEST 5] Kiểm tra Save Migration & Idempotency:');
{
  // 5.1: Mock save cũ hoàn toàn không có customRecipeState
  const legacySaveData: Partial<PlayerStats> = {
    name: 'Thanh Hư Đạo Nhân',
    tuVi: 1200000,
    linhThach: 8888,
    canCot: 45,
    ngoTinh: 50,
    currentRealm: 15
  };

  // Di trú trực tiếp qua migrateCustomRecipeData
  const migratedPlayer = migrateCustomRecipeData(legacySaveData as PlayerStats);
  assert(migratedPlayer.customRecipeState !== undefined, 'customRecipeState phải được khởi tạo sau migration');
  assert(Array.isArray(migratedPlayer.customRecipeState?.discoveredRecipes), 'discoveredRecipes phải là mảng rỗng');
  assert(migratedPlayer.customRecipeState?.discoveredRecipes.length === 0, 'discoveredRecipes độ dài ban đầu bằng 0');
  assert(migratedPlayer.customRecipeState?.totalResearchAttempts === 0, 'totalResearchAttempts ban đầu bằng 0');
  assert(Array.isArray(migratedPlayer.customRecipeState?.sectArchivedRecipeIds), 'sectArchivedRecipeIds phải là mảng rỗng');
  assert(migratedPlayer.tuVi === 1200000, 'Dữ liệu cũ (tuVi) phải được bảo toàn nguyên vẹn');

  // 5.2: Chuẩn hóa toàn diện qua normalizePlayerData
  const normalizedPlayer = normalizePlayerData(legacySaveData);
  assert(normalizedPlayer.customRecipeState !== undefined, 'normalizePlayerData phải tự động bao bọc customRecipeState');
  assert(normalizedPlayer.customRecipeState?.discoveredRecipes.length === 0, 'discoveredRecipes khởi tạo an toàn qua normalize');

  // 5.3: Tính Idempotency (chạy lại migration không làm mất đan phương đã khai sáng)
  const existingCustomState: CustomRecipeState = {
    discoveredRecipes: [
      {
        id: 'recipe_test_1',
        name: 'Thái Cực Bổ Thiên Đan',
        lore: 'Đan phương cổ truyền',
        creatorName: 'Thanh Hư Đạo Nhân',
        createdAt: 1700000000000,
        fingerprint: 'huyet_tinh_thao:1|linh_thao:1|tu_khi_hoa:1',
        herbsRequired: [],
        tier: 3,
        grade: 'Thượng Phẩm',
        effectType: 'tu_vi',
        effectValue: 5000,
        toxicity: 10,
        harmonyScore: 85,
        thermalBalance: 0,
        successRate: 85
      }
    ],
    totalResearchAttempts: 5,
    sectArchivedRecipeIds: ['recipe_test_1']
  };

  const playerWithData: PlayerStats = {
    ...normalizedPlayer,
    customRecipeState: existingCustomState
  };

  const reMigrated = migrateCustomRecipeData(playerWithData);
  assert(reMigrated.customRecipeState?.discoveredRecipes.length === 1, 'Idempotency: Đan phương đã có không được bị ghi đè hay mất mát');
  assert(reMigrated.customRecipeState?.discoveredRecipes[0].name === 'Thái Cực Bổ Thiên Đan', 'Dữ liệu đan phương đã lưu phải nguyên vẹn');
  assert(reMigrated.customRecipeState?.totalResearchAttempts === 5, 'totalResearchAttempts phải được giữ nguyên');
  assert(reMigrated.customRecipeState?.sectArchivedRecipeIds[0] === 'recipe_test_1', 'sectArchivedRecipeIds phải được giữ nguyên');
}
console.log('--- TEST 5 PASSED ---\n');

console.log('================================================================');
console.log('🎉 TẤT CẢ 5/5 TEST CASE ĐỀU VƯỢT QUA XUẤT SẮC! (100% PASSED)');
console.log('================================================================');
