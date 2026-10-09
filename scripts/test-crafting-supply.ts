// scripts/test-crafting-supply.ts
// Comprehensive unit & behavioral test for Crafting Supply Auto-Link & One-Click Material Buying

import { createNewPlayer } from '../lib/game-logic/character';
import { normalizePlayerData } from '../lib/save-migration';
import { DAN_RECIPES, EQUIP_RECIPES } from '../lib/alchemy-data';
import {
  assessPillRecipeSupply,
  assessForgeRecipeSupply,
  executeBatchSupplyPurchase
} from '../lib/crafting-supply-logic';
import { PlayerStats, Pill } from '../lib/types';
import { createDefaultCompanionPlayerState } from '../lib/companions-data';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('=== TEST SUITE: Crafting Supply Auto-Link & One-Click Buying ===\n');

// -------------------------------------------------------------
// Test 1: Save Migration & Default Settings
// -------------------------------------------------------------
console.log('--- Test 1: Save Migration & Default Settings ---');
const freshPlayer: PlayerStats = createNewPlayer();
assert(
  freshPlayer.craftingSupplySettings?.autoBuyMissing === false,
  'New player has craftingSupplySettings.autoBuyMissing === false'
);

const legacyPlayerObj = { tuVi: 100, currentRealm: 0 };
const normalizedLegacy = normalizePlayerData(legacyPlayerObj);
assert(
  normalizedLegacy.craftingSupplySettings?.autoBuyMissing === false,
  'Normalized legacy player defaults to craftingSupplySettings.autoBuyMissing === false'
);

const customSavedPlayer = normalizePlayerData({
  currentRealm: 16,
  craftingSupplySettings: { autoBuyMissing: true }
});
assert(
  customSavedPlayer.craftingSupplySettings?.autoBuyMissing === true,
  'Normalized player preserves craftingSupplySettings.autoBuyMissing === true'
);

// -------------------------------------------------------------
// Test 2: Recipe Supply Assessment (Missing 2 herbs)
// -------------------------------------------------------------
console.log('\n--- Test 2: Recipe Supply Assessment (Missing 2 herbs) ---');
const recipeThoNguyen = DAN_RECIPES.find(r => r.id === 'recipe_tho_nguyen_1')!;
assert(Boolean(recipeThoNguyen), 'Found recipe_tho_nguyen_1');

const testPlayerRealm12: PlayerStats = normalizePlayerData({
  ...freshPlayer,
  currentRealm: 12, // Trúc Cơ Sơ Kỳ
  linhThach: 1000,
  inventory: {
    pills: [],
    herbs: [],
    ores: [],
    equipment: [],
    manuals: []
  }
});

const assessResult = assessPillRecipeSupply(testPlayerRealm12, recipeThoNguyen, 1);
assert(!assessResult.isFullySupplied, 'Should report isFullySupplied === false');
assert(assessResult.missingItems.length === 2, 'Should report exactly 2 missing items');
assert(assessResult.missingItems[0].missingQty === 3, 'Missing 3x huyet_tinh_thao');
assert(assessResult.missingItems[1].missingQty === 2, 'Missing 2x linh_thao');
assert(assessResult.totalCostLinhThach === (3 * 60 + 2 * 30), `Total cost matches 240 LT (was ${assessResult.totalCostLinhThach})`);
assert(assessResult.hasEnoughLinhThach, 'Player has 1,000 LT which is >= 240 LT');
assert(!assessResult.hasUnmetRealmGating, 'Player at Realm 12 (Trúc Cơ) meets Realm 11 and 0 requirements');
assert(assessResult.canExecuteAutoPurchase, 'canExecuteAutoPurchase should be true');

// -------------------------------------------------------------
// Test 3: Companion Discount Calculation
// -------------------------------------------------------------
console.log('\n--- Test 3: Companion Discount Calculation ---');
const playerWithCompanion: PlayerStats = normalizePlayerData({
  ...testPlayerRealm12,
  companionsState: {
    ...freshPlayer.companionsState,
    bondedCompanionId: 'companion_da_mong_ly',
    unlockedCompanionIds: ['companion_da_mong_ly'],
    companions: {
      companion_da_mong_ly: {
        ...createDefaultCompanionPlayerState('companion_da_mong_ly'),
        affinity: 100,
        isBonded: true
      }
    }
  }
});

const assessWithDiscount = assessPillRecipeSupply(playerWithCompanion, recipeThoNguyen, 1);
const expectedDiscountedCost = 3 * Math.floor(60 * 0.7) + 2 * Math.floor(30 * 0.7);
assert(
  assessWithDiscount.totalCostLinhThach === expectedDiscountedCost,
  `Discounted cost is ${assessWithDiscount.totalCostLinhThach} LT (expected ${expectedDiscountedCost})`
);

// -------------------------------------------------------------
// Test 4: Realm Gating Guard (Luyện Khí trying to craft Tam Giai)
// -------------------------------------------------------------
console.log('\n--- Test 4: Realm Gating Guard ---');
const recipeCuongBao = DAN_RECIPES.find(r => r.id === 'recipe_cuong_bao')!;
assert(Boolean(recipeCuongBao), 'Found recipe_cuong_bao');

const lowRealmPlayer: PlayerStats = normalizePlayerData({
  ...freshPlayer,
  currentRealm: 0, // Luyện Khí Tầng 1
  linhThach: 100000,
  inventory: {
    pills: [],
    herbs: [],
    ores: [],
    equipment: [],
    manuals: []
  }
});

const assessLowRealm = assessPillRecipeSupply(lowRealmPlayer, recipeCuongBao, 1);
assert(assessLowRealm.hasUnmetRealmGating, 'hasUnmetRealmGating must be true for Luyện Khí player');
assert(!assessLowRealm.canExecuteAutoPurchase, 'canExecuteAutoPurchase must be false');
const lockedItem = assessLowRealm.missingItems.find(i => !i.canPurchaseAtCurrentRealm);
assert(Boolean(lockedItem), 'Locked item must be identified');
assert(lockedItem!.requiredRealmIndex === 16, 'Locked item requires realm index 16 (Kim Đan)');

const buyAttempt = executeBatchSupplyPurchase(lowRealmPlayer, assessLowRealm);
assert(!buyAttempt.success, 'executeBatchSupplyPurchase must fail when realm-locked');
assert(buyAttempt.message.includes('Cần đạt'), `Message mentions realm requirement: "${buyAttempt.message}"`);

// -------------------------------------------------------------
// Test 5: 1-Click Batch Buy Missing Execution
// -------------------------------------------------------------
console.log('\n--- Test 5: 1-Click Batch Buy Missing Execution ---');
const buySuccess = executeBatchSupplyPurchase(testPlayerRealm12, assessResult);
assert(buySuccess.success, 'Batch purchase should succeed');
assert(buySuccess.updatedPlayer.linhThach === 1000 - 240, `Linh Thạch deducted to 760 LT (was ${buySuccess.updatedPlayer.linhThach})`);

const herbsInInventory = buySuccess.updatedPlayer.inventory?.herbs || [];
const h1 = herbsInInventory.find(h => h.id === 'huyet_tinh_thao');
const h2 = herbsInInventory.find(h => h.id === 'linh_thao');
assert(h1 !== undefined && h1.quantity === 3, 'huyet_tinh_thao quantity is 3');
assert(h2 !== undefined && h2.quantity === 2, 'linh_thao quantity is 2');

const assessAfterBuy = assessPillRecipeSupply(buySuccess.updatedPlayer, recipeThoNguyen, 1);
assert(assessAfterBuy.isFullySupplied, 'After buying missing items, isFullySupplied should be true');
assert(assessAfterBuy.missingItems.length === 0, 'No more missing items');

// -------------------------------------------------------------
// Test 6: Forging Supply Assessment & Execution
// -------------------------------------------------------------
console.log('\n--- Test 6: Forging Supply Assessment & Execution ---');
const forgeRecipe = EQUIP_RECIPES.find(r => r.id === 'forge_armor_1')!;
assert(Boolean(forgeRecipe), 'Found forge_armor_1');

const forgingPlayer: PlayerStats = normalizePlayerData({
  ...freshPlayer,
  currentRealm: 11, // Trúc Cơ Sơ Kỳ
  linhThach: 5000,
  inventory: {
    pills: [],
    herbs: [],
    ores: [{ id: 'huyen_thiet', name: 'Bách Luyện Huyền Thiết', quantity: 1, grade: 'Nhất Giai', price: 50, description: '' }],
    equipment: [],
    manuals: []
  }
});

const forgeAssessment = assessForgeRecipeSupply(forgingPlayer, forgeRecipe, 1);
assert(!forgeAssessment.isFullySupplied, 'Forge recipe is not fully supplied');
assert(forgeAssessment.missingItems.length === 2, '2 missing items for forging');
assert(forgeAssessment.missingItems.find(i => i.id === 'huyen_thiet')?.missingQty === 1, 'huyen_thiet missing 1');
assert(forgeAssessment.missingItems.find(i => i.id === 'bang_tinh_khoang')?.missingQty === 2, 'bang_tinh_khoang missing 2');
assert(forgeAssessment.totalCostLinhThach === 410, `Total forging supply cost is 410 LT (was ${forgeAssessment.totalCostLinhThach})`);
assert(forgeAssessment.canExecuteAutoPurchase, 'canExecuteAutoPurchase is true for forging');

const forgeBuySuccess = executeBatchSupplyPurchase(forgingPlayer, forgeAssessment);
assert(forgeBuySuccess.success, 'Forge batch purchase should succeed');
assert(forgeBuySuccess.updatedPlayer.linhThach === 5000 - 410, 'Linh thạch correctly deducted');
const huyenThietOre = forgeBuySuccess.updatedPlayer.inventory?.ores?.find(o => o.id === 'huyen_thiet');
const bangTinhOre = forgeBuySuccess.updatedPlayer.inventory?.ores?.find(o => o.id === 'bang_tinh_khoang');
assert(huyenThietOre?.quantity === 2, 'huyen_thiet was stacked from 1 to 2');
assert(bangTinhOre?.quantity === 2, 'bang_tinh_khoang added with quantity 2');

const forgeAssessAfter = assessForgeRecipeSupply(forgeBuySuccess.updatedPlayer, forgeRecipe, 1);
assert(forgeAssessAfter.isFullySupplied, 'Forge supply is now fully supplied');

// -------------------------------------------------------------
// Test 7: Insufficient Linh Thạch Protection
// -------------------------------------------------------------
console.log('\n--- Test 7: Insufficient Linh Thạch Protection ---');
const poorPlayer: PlayerStats = normalizePlayerData({
  ...testPlayerRealm12,
  linhThach: 10,
  trungPhamLinhThach: 0,
  thuongPhamLinhThach: 0,
  cucPhamLinhThach: 0,
  tienPhamLinhThach: 0
});
const poorAssess = assessPillRecipeSupply(poorPlayer, recipeThoNguyen, 1);
assert(!poorAssess.hasEnoughLinhThach, 'Poor player marked as hasEnoughLinhThach === false');
assert(!poorAssess.canExecuteAutoPurchase, 'Poor player cannot execute auto purchase');
const poorBuyAttempt = executeBatchSupplyPurchase(poorPlayer, poorAssess);
assert(!poorBuyAttempt.success, 'Poor player purchase execution blocked');
assert(poorBuyAttempt.message.includes('Linh Thạch không đủ'), 'Clear failure message for lack of funds');

// -------------------------------------------------------------
// Test 8: Inventory Full Capacity Protection
// -------------------------------------------------------------
console.log('\n--- Test 8: Inventory Full Capacity Protection ---');
const fillerPills: Pill[] = Array.from({ length: 20 }, (_, i) => ({
  id: `pill_filler_${i}`,
  name: `Filler Pill ${i}`,
  quantity: 1,
  grade: 'Nhất Giai',
  description: 'Test pill',
  effectType: 'sustain',
  effectValue: 1
}));

const fullInvPlayer: PlayerStats = normalizePlayerData({
  ...testPlayerRealm12,
  inventory: {
    pills: fillerPills,
    herbs: [],
    ores: [],
    equipment: [],
    manuals: []
  }
});
const fullInvAssess = assessPillRecipeSupply(fullInvPlayer, recipeThoNguyen, 1);
assert(fullInvAssess.canExecuteAutoPurchase, 'Assessment passes funds and realm');
const fullInvBuy = executeBatchSupplyPurchase(fullInvPlayer, fullInvAssess);
assert(!fullInvBuy.success, 'Purchase blocked due to full inventory capacity');
assert(fullInvBuy.message.includes('Túi Trữ Vật đã đầy'), `Message indicates full bag: "${fullInvBuy.message}"`);

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
