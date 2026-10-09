// scripts/test-array-reforging.ts
// Comprehensive Unit & Integration Test Suite for:
// "Đúc Lại Tụ Linh Trận Bàn (Array Reforging / Trùng Chú Trận Bàn Bất Hủ)"
//
// 6 Mandatory Test Scenarios:
// 1. Formula & Condition Checks: Arrays below Tier 9 blocked; Realm requirement enforced with clear reason.
// 2. Resource Guards: Insufficient forgingEssence or Linh Thạch fails cleanly with 0 mutations.
// 3. Permanence Ascension Success: isPermanent: true, infinite duration, resources deducted accurately.
// 4. Offline Speed Ascension (Max Efficiency): offlineAbsorptionBonus added correctly (+35%).
// 5. Anti-dup / Double Reforge Guard: Reforging Bất Hủ twice is strictly rejected.
// 6. 10-day (240h) Offline Progress Simulation: Standard 72h array expires vs Permanent array stays active with offline bonus.

import { createNewPlayer } from '../lib/game-logic/character';
import { normalizePlayerData } from '../lib/save-migration';
import {
  canReforgeArrayDisc,
  reforgeArrayDisc,
  ARRAY_REFORGE_CONFIG,
} from '../lib/formation-logic';
import {
  calculateOfflineProgress,
  calculateOfflineSpeedMultiplier,
} from '../lib/offline-progress';
import { cleanExpiredCultivationArrays } from '../lib/cultivation-shop-logic';
import { FormationItem, PlayerStats } from '../lib/types';
import { ActiveCultivationArrayBuff } from '../lib/types/cultivation-shop';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('================================================================');
console.log('🧪 TEST SUITE: Đúc Lại Tụ Linh Trận Bàn (Array Reforging)');
console.log('================================================================\n');

// ── SETUP BASE PLAYER & MOCK ITEMS ──────────────────────────────
const basePlayer = createNewPlayer();

// Mock Tier 8 Formation (Thất/Bát Giai)
const mockTier8Formation: FormationItem = {
  id: 'formation_bat_quai_tier8',
  recipeId: 'recipe_bat_quai_can_khon_tran',
  name: 'Bát Quái Càn Khôn Vô Cực Trận',
  type: 'tribulation',
  tier: 8,
  grade: 'Bát Giai',
  element: 'hon_don',
  description: 'Trận bàn Bát Giai hộ thể',
  quality: 'cuc_pham',
  qualityMultiplier: 1.55,
  durability: 20,
  maxDurability: 20,
  gemInlaid: null,
  statBonus: { def: 100, hp: 2000 },
  combatBuff: {
    tribulationDmgReduction: 50,
    triggerEffectDescription: 'Càn Khôn Hộ Thể',
  },
};

// Mock Tier 9 Formation (Cửu Giai)
const mockTier9Formation: FormationItem = {
  id: 'formation_cuu_cuc_tier9',
  recipeId: 'recipe_cuu_cuc_vo_thuong_tien_tran',
  name: 'Cửu Cực Vô Thượng Tiên Trận',
  type: 'utility',
  tier: 9,
  grade: 'Cửu Giai • Thần Giai Chí Tôn',
  element: 'hon_don',
  description: 'Trận bàn Cửu Giai chí tôn hội tụ cửu thiên linh mạch',
  quality: 'than_pham',
  qualityMultiplier: 2.0,
  durability: 30,
  maxDurability: 30,
  gemInlaid: null,
  statBonus: { atk: 300, def: 300, hp: 10000 },
  combatBuff: {
    trapNullifyChance: 90,
    triggerEffectDescription: 'Cửu Cực Thần Quang',
  },
};

// ================================================================
// TEST 1: Kiểm tra công thức & điều kiện cảnh giới / phẩm giai
// ================================================================
console.log('--- TEST 1: Kiểm tra công thức & điều kiện cảnh giới / phẩm giai ---');
{
  // 1a. Trận bàn dưới Cửu Giai (Tier 8) không thể trùng chú
  const playerHighRealm: PlayerStats = {
    ...basePlayer,
    currentRealm: 30, // Hóa Thần Viên Mãn (Realm >= 26)
    formationArtisan: {
      level: 6,
      exp: 100,
      maxExp: 2500,
      totalCrafted: 50,
      learnedRecipeIds: [],
    },
    linhThach: 100_000_000,
    inventory: {
      ...basePlayer.inventory,
      forgingEssence: 1000,
      ores: [{ id: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', grade: 'Thần Giai', price: 4000, quantity: 10, description: '' }],
      formations: [mockTier8Formation],
    } as any,
  };

  const checkBelowTier9 = canReforgeArrayDisc(playerHighRealm, mockTier8Formation, 'permanence');
  assert(!checkBelowTier9.eligible, 'Trận bàn Tier 8 (dưới Cửu Giai) bị chặn trùng chú');
  assert(
    Boolean(checkBelowTier9.reason && checkBelowTier9.reason.includes('Cửu Giai')),
    `Lý do từ chối rõ ràng: "${checkBelowTier9.reason}"`
  );

  // 1b. Trận bàn Cửu Giai nhưng nhân vật chưa đủ cảnh giới Hóa Thần (< 26)
  const playerLowRealm: PlayerStats = {
    ...playerHighRealm,
    currentRealm: 15, // Trúc Cơ / Kim Đan (< 26)
    inventory: {
      ...playerHighRealm.inventory,
      formations: [mockTier9Formation],
    } as any,
  };

  const checkLowRealm = canReforgeArrayDisc(playerLowRealm, mockTier9Formation, 'permanence');
  assert(!checkLowRealm.eligible, 'Nhân vật dưới cảnh giới Hóa Thần bị chặn trùng chú Bất Hủ');
  assert(
    Boolean(checkLowRealm.reason && checkLowRealm.reason.includes('Hóa Thần Kỳ')),
    `Thông báo cảnh giới yêu cầu chính xác: "${checkLowRealm.reason}"`
  );

  // 1c. Chưa đủ cấp Trận Pháp Sư (< 5)
  const playerLowArtisan: PlayerStats = {
    ...playerHighRealm,
    currentRealm: 30,
    formationArtisan: {
      level: 3, // Tam Giai (< 5)
      exp: 0,
      maxExp: 500,
      totalCrafted: 10,
      learnedRecipeIds: [],
    },
    inventory: {
      ...playerHighRealm.inventory,
      formations: [mockTier9Formation],
    } as any,
  };

  const checkLowArtisan = canReforgeArrayDisc(playerLowArtisan, mockTier9Formation, 'permanence');
  assert(!checkLowArtisan.eligible, 'Trận Pháp Sư dưới cấp Tông Sư bị chặn trùng chú');
  assert(
    Boolean(checkLowArtisan.reason && checkLowArtisan.reason.includes('Trận Đạo Tông Sư')),
    `Thông báo cấp Trận Sư chính xác: "${checkLowArtisan.reason}"`
  );
}

// ================================================================
// TEST 2: Chặn thiếu tài nguyên (Linh Thạch / Tinh Hoa / Khoáng Thạch)
// ================================================================
console.log('\n--- TEST 2: Chặn thiếu tài nguyên (Zero Mutation & Negative Protection) ---');
{
  const qualifiedPlayer: PlayerStats = {
    ...basePlayer,
    currentRealm: 30, // Hóa Thần
    formationArtisan: {
      level: 6,
      exp: 0,
      maxExp: 2500,
      totalCrafted: 20,
      learnedRecipeIds: [],
    },
    linhThach: 10_000, // Cần 50,000,000
    inventory: {
      ...basePlayer.inventory,
      forgingEssence: 100, // Cần 500
      ores: [], // Cần 3 Hỗn Độn Thần Thiết
      formations: [mockTier9Formation],
    } as any,
  };

  const checkNoRes = canReforgeArrayDisc(qualifiedPlayer, mockTier9Formation, 'permanence');
  assert(!checkNoRes.eligible, 'Chặn khi thiếu toàn bộ tài nguyên tiêu hao');
  assert(
    Boolean(checkNoRes.missingCosts && checkNoRes.missingCosts.length === 3),
    `Phát hiện đủ 3 loại tài nguyên thiếu hụt (got ${checkNoRes.missingCosts?.length})`
  );

  // Thử gọi reforgeArrayDisc khi thiếu tài nguyên -> Phải trả về success: false và player giữ nguyên
  const failedExec = reforgeArrayDisc(qualifiedPlayer, mockTier9Formation, 'permanence');
  assert(!failedExec.success, 'Thực thi đúc lại thất bại an toàn khi thiếu tài nguyên');
  assert(failedExec.updatedPlayer.linhThach === 10_000, 'Linh Thạch không bị trừ ngoài ý muốn');
  assert(failedExec.updatedPlayer.inventory?.forgingEssence === 100, 'Tinh Hoa Rèn Đúc không bị trừ');
  assert(failedExec.updatedPlayer.inventory?.formations?.[0]?.isPermanent !== true, 'Trận bàn không bị biến đổi');
}

// ================================================================
// TEST 3: Trùng Chú Bất Hủ thành công (Permanence Ascension)
// ================================================================
console.log('\n--- TEST 3: Trùng Chú Bất Hủ thành công ---');
let playerWithPermanence: PlayerStats;
{
  const richPlayer: PlayerStats = {
    ...basePlayer,
    currentRealm: 30, // Hóa Thần
    formationArtisan: {
      level: 6,
      exp: 0,
      maxExp: 2500,
      totalCrafted: 20,
      learnedRecipeIds: [],
    },
    linhThach: 80_000_000, // Cần 50,000,000 -> còn 30,000,000
    equippedFormation: mockTier9Formation,
    inventory: {
      ...basePlayer.inventory,
      forgingEssence: 800, // Cần 500 -> còn 300
      ores: [
        { id: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', grade: 'Thần Giai', price: 4000, quantity: 10, description: '' },
      ],
      formations: [mockTier9Formation],
    } as any,
  };

  const reforgeRes = reforgeArrayDisc(richPlayer, mockTier9Formation.id, 'permanence');
  assert(reforgeRes.success, 'Trùng chú Bất Hủ thành công rực rỡ');
  playerWithPermanence = reforgeRes.updatedPlayer;

  // Kiểm tra tài nguyên
  assert(playerWithPermanence.linhThach === 30_000_000, 'Linh Thạch trừ chính xác: 80M - 50M = 30M');
  assert(playerWithPermanence.inventory?.forgingEssence === 300, 'Tinh Hoa Rèn Đúc trừ chính xác: 800 - 500 = 300');
  const remainingOre = playerWithPermanence.inventory?.ores?.find(o => o.id === 'hon_don_than_thiet')?.quantity || 0;
  assert(remainingOre === 7, 'Hỗn Độn Thần Thiết trừ chính xác: 10 - 3 = 7');

  // Kiểm tra trận bàn đã Bất Hủ
  const reforgedFormation = playerWithPermanence.inventory?.formations?.find((f: FormationItem) => f.id === mockTier9Formation.id);
  assert(reforgedFormation?.isPermanent === true, 'Thuộc tính isPermanent được bật thành true');
  assert(reforgedFormation?.reforgeTier === 1, 'reforgeTier nâng lên cấp 1 (Bất Hủ)');
  assert(reforgedFormation?.durability === Infinity, 'Độ bền chuyển sang Vô Hạn (Infinity)');
  assert(typeof reforgedFormation?.reforgedAt === 'number', 'Timestamp reforgedAt được ghi nhận');

  // Kiểm tra đồng bộ equippedFormation
  assert(playerWithPermanence.equippedFormation?.isPermanent === true, 'Đồng bộ trực tiếp trận đang trang bị xuất chiến');
  assert(playerWithPermanence.equippedFormation?.reforgeTier === 1, 'reforgeTier đồng bộ vào equippedFormation');
}

// ================================================================
// TEST 4: Trùng Chú Tột Đỉnh Hấp Thu (Max Efficiency Boost)
// ================================================================
console.log('\n--- TEST 4: Trùng Chú Tột Đỉnh Hấp Thu (+35% Offline Cultivation) ---');
let playerWithMaxEfficiency: PlayerStats;
{
  // 4a. Chưa đủ cảnh giới Độ Kiếp (Realm < 46) -> Bị chặn
  const checkRealm = canReforgeArrayDisc(playerWithPermanence, mockTier9Formation.id, 'max_efficiency');
  assert(!checkRealm.eligible, 'Chặn thăng hoa Tột Đỉnh Hấp Thu nếu chưa đạt Độ Kiếp Kỳ');
  assert(
    Boolean(checkRealm.reason && checkRealm.reason.includes('Độ Kiếp Kỳ')),
    `Thông báo yêu cầu Độ Kiếp Kỳ: "${checkRealm.reason}"`
  );

  // 4b. Đạt cảnh giới Độ Kiếp (Realm >= 46) và Trận Sư Cửu Giai -> Thăng hoa thành công
  const endgamePlayer: PlayerStats = {
    ...playerWithPermanence,
    currentRealm: 50, // Độ Kiếp Kỳ / Tiên Nhân (Realm >= 46)
    formationArtisan: {
      level: 9, // Cửu Giai • Thần Trận Đại Tổ
      exp: 5000,
      maxExp: 99999,
      totalCrafted: 100,
      learnedRecipeIds: [],
    },
    linhThach: 200_000_000, // Cần 150M -> còn 50M
    inventory: {
      ...playerWithPermanence.inventory,
      forgingEssence: 1500, // Cần 1000 -> còn 500
      ores: [
        { id: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', grade: 'Thần Giai', price: 4000, quantity: 10, description: '' },
      ],
    } as any,
  };

  const reforgeTier2Res = reforgeArrayDisc(endgamePlayer, mockTier9Formation.id, 'max_efficiency');
  assert(reforgeTier2Res.success, 'Thăng hoa Tột Đỉnh Hấp Thu thành công');
  playerWithMaxEfficiency = reforgeTier2Res.updatedPlayer;

  // Kiểm tra trừ tài nguyên
  assert(playerWithMaxEfficiency.linhThach === 50_000_000, 'Linh Thạch trừ chính xác: 200M - 150M = 50M');
  assert(playerWithMaxEfficiency.inventory?.forgingEssence === 500, 'Tinh Hoa trừ chính xác: 1500 - 1000 = 500');

  // Kiểm tra thuộc tính
  const t2Formation = playerWithMaxEfficiency.inventory?.formations?.find((f: FormationItem) => f.id === mockTier9Formation.id);
  assert(t2Formation?.reforgeTier === 2, 'reforgeTier nâng lên cấp 2 (Cực Hạn)');
  assert(t2Formation?.offlineAbsorptionBonus === 0.35, 'offlineAbsorptionBonus được cộng chính xác +35% (0.35)');
  assert(playerWithMaxEfficiency.equippedFormation?.offlineAbsorptionBonus === 0.35, 'equippedFormation nhận +35% offline bonus');
}

// ================================================================
// TEST 5: Chống trùng lặp (Anti-dup / Double Reforge)
// ================================================================
console.log('\n--- TEST 5: Chống trùng lặp (Anti-dup / Double Reforge Guard) ---');
{
  // 5a. Trận bàn đã là Bất Hủ không thể đúc Bất Hủ lại lần 2
  const checkDoublePermanence = canReforgeArrayDisc(playerWithPermanence, mockTier9Formation.id, 'permanence');
  assert(!checkDoublePermanence.eligible, 'Chặn trùng chú Bất Hủ lần thứ hai trên trận bàn đã Bất Hủ');
  assert(
    Boolean(checkDoublePermanence.reason && checkDoublePermanence.reason.includes('không thể trùng chú Bất Hủ lần thứ hai')),
    `Lý do từ chối: "${checkDoublePermanence.reason}"`
  );

  // 5b. Trận bàn đã đạt Cực Hạn (reforgeTier === 2) không thể đúc tiếp
  const checkDoubleMax = canReforgeArrayDisc(playerWithMaxEfficiency, mockTier9Formation.id, 'max_efficiency');
  assert(!checkDoubleMax.eligible, 'Chặn thăng hoa vượt mức Cực Hạn (Bậc 2)');
  assert(
    Boolean(checkDoubleMax.reason && checkDoubleMax.reason.includes('không thể thăng hoa thêm')),
    `Lý do từ chối: "${checkDoubleMax.reason}"`
  );

  // 5c. Thử gọi hàm reforge trực tiếp -> Phải bị chặn 100%
  const execDouble = reforgeArrayDisc(playerWithMaxEfficiency, mockTier9Formation.id, 'max_efficiency');
  assert(!execDouble.success, 'Hàm thực thi từ chối đúc lại trận bàn đã đạt mức tối đa');
}

// ================================================================
// TEST 6: Mô phỏng Offline Progress 10 ngày (240 giờ)
// ================================================================
console.log('\n--- TEST 6: Mô phỏng Offline Progress 10 ngày (240 giờ) ---');
{
  const now = Date.now();
  const TEN_DAYS_MS = 240 * 3600 * 1000; // 240 giờ
  const offlineStart = now - TEN_DAYS_MS;

  // Trường hợp A: Người chơi dùng Tụ Linh Trận Bàn Thường (Thời hạn 72h)
  const normalArrayBuff: ActiveCultivationArrayBuff = {
    itemId: 'cult_t9_array',
    name: 'Cửu Cực Vô Thượng Tiên Trận (Thường)',
    tuViSpeedPercent: 75,
    expiresAt: offlineStart + 72 * 3600 * 1000, // Hết hạn sau 72h, tức đã quá hạn 168h
  };

  const playerWithNormalArray: PlayerStats = {
    ...basePlayer,
    currentRealm: 46,
    canCot: 50,
    khiVan: 50,
    lastActiveTimestamp: offlineStart,
    lastActive: offlineStart,
    cultivationBuffState: {
      activeArrays: [normalArrayBuff],
      learnedManualIds: [],
      meditationEfficiencyModifier: 0,
    },
  };

  // Sau 10 ngày, trận bàn thường đã hết hạn
  const cleanedNormal = cleanExpiredCultivationArrays(playerWithNormalArray.cultivationBuffState!.activeArrays, now);
  assert(cleanedNormal.length === 0, 'Trận bàn thường (72h) đã hết hạn và bị thanh lọc hoàn toàn sau 10 ngày offline');

  const speedNormal = calculateOfflineSpeedMultiplier(playerWithNormalArray, now);
  const progressNormal = calculateOfflineProgress(playerWithNormalArray, now);
  assert(progressNormal !== null, 'Tính toán offline progress cho người chơi trận thường thành công');

  // Trường hợp B: Người chơi sở hữu Trận Bàn Bất Hủ Tột Đỉnh Hấp Thu (isPermanent: true, offlineAbsorptionBonus: 0.35)
  const permanentArrayBuff: ActiveCultivationArrayBuff = {
    itemId: 'cult_t9_array',
    name: 'Cửu Cực Vô Thượng Tiên Trận [Bất Hủ]',
    tuViSpeedPercent: 75,
    expiresAt: Infinity,
    isPermanent: true,
    reforgeTier: 2,
    offlineAbsorptionBonus: 0.35,
    reforgedAt: offlineStart - 1000,
  };

  const playerWithPermanentArray: PlayerStats = {
    ...playerWithNormalArray,
    equippedFormation: {
      ...mockTier9Formation,
      isPermanent: true,
      reforgeTier: 2,
      offlineAbsorptionBonus: 0.35,
    },
    cultivationBuffState: {
      activeArrays: [permanentArrayBuff],
      learnedManualIds: [],
      meditationEfficiencyModifier: 0,
    },
  };

  // Sau 10 ngày, trận bàn Bất Hủ vẫn duy trì 100%
  const cleanedPerm = cleanExpiredCultivationArrays(playerWithPermanentArray.cultivationBuffState!.activeArrays, now);
  assert(cleanedPerm.length === 1, 'Trận bàn Bất Hủ KHÔNG bị hết hạn, vẫn duy trì nguyên vẹn sau 10 ngày (240 giờ)');
  assert(cleanedPerm[0].isPermanent === true, 'Trận bàn giữ nguyên thuộc tính Bất Hủ');

  const speedPermanent = calculateOfflineSpeedMultiplier(playerWithPermanentArray, now);
  assert(speedPermanent > speedNormal, `Tốc độ tu vi trận Bất Hủ (${speedPermanent}) vượt trội so với trận thường đã hết hạn (${speedNormal})`);

  const progressPermanent = calculateOfflineProgress(playerWithPermanentArray, now);
  assert(progressPermanent !== null, 'Tính toán offline progress cho người chơi Bất Hủ thành công');

  // Lượng tu vi nhận được phải cao hơn rõ rệt (do vừa duy trì speedMultiplier + vừa có offlineAbsorptionBonus +35%)
  const tuViDiff = (progressPermanent?.tuViGained || 0) - (progressNormal?.tuViGained || 0);
  assert(
    tuViDiff > 0,
    `Trận Bàn Bất Hủ tích lũy nhiều hơn ${tuViDiff.toLocaleString()} Tu Vi suốt 240 giờ ngoại tuyến!`
  );
  console.log(`   📊 Tu vi trận thường (hết hạn sau 72h): ${(progressNormal?.tuViGained || 0).toLocaleString()}`);
  console.log(`   ✨ Tu vi trận Bất Hủ Tột Đỉnh (240h + 35%): ${(progressPermanent?.tuViGained || 0).toLocaleString()}`);
  console.log(`   ⚡ Hiệu suất gia tăng: +${Math.round((((progressPermanent?.tuViGained || 0) / (progressNormal?.tuViGained || 1)) - 1) * 100)}%`);
}

console.log('\n================================================================');
console.log('🎉 TOÀN BỘ 6 BÀI KIỂM THỬ ĐÃ VƯỢT QUA VỚI ĐỘ CHÍNH XÁC TUYỆT ĐỐI!');
console.log('================================================================');
