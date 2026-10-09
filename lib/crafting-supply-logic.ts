// lib/crafting-supply-logic.ts
// Pure Business Logic cho chuỗi cung ứng tự động và 1-click mua bù nguyên liệu chế tác

import { PlayerStats, DanRecipe, EquipRecipe } from '@/lib/types';
import { HERBS_SHOP_CATALOG, HERBS_SHOP_ITEMS_MAP } from '@/lib/herbs-shop-data';
import { ORES_SHOP_CATALOG, ORES_SHOP_ITEMS_MAP } from '@/lib/ores-shop-data';
import { DEFAULT_HERBS, DEFAULT_ORES } from '@/lib/alchemy-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';
import { deductEquivalentLinhThach } from '@/lib/merchant-data';
import { getMaxInventoryCapacity, getCurrentInventoryOccupiedSlots } from '@/lib/inventory-data';
import { parseGradeToTier } from '@/lib/artisan-lock-logic';

export type AlchemyRecipe = DanRecipe;
export type ForgingRecipe = EquipRecipe;

export interface MissingIngredientRequirement {
  type: 'herb' | 'ore';
  id: string;
  name: string;
  requiredQty: number;
  currentQty: number;
  missingQty: number;
  unitPrice: number;
  totalPrice: number;
  tier: number;
  requiredRealmIndex: number;
  requiredRealmName: string;
  canPurchaseAtCurrentRealm: boolean;
}

export interface CraftingSupplyAssessment {
  recipeId: string;
  recipeName: string;
  craftQuantity: number;
  isFullySupplied: boolean;
  missingItems: MissingIngredientRequirement[];
  totalCostLinhThach: number;
  hasEnoughLinhThach: boolean;
  hasUnmetRealmGating: boolean;
  canExecuteAutoPurchase: boolean;
}

export const TIER_REALM_GATING: Record<number, { index: number; name: string }> = {
  1: { index: 0, name: 'Luyện Khí Kỳ' },
  2: { index: 11, name: 'Trúc Cơ Kỳ' },
  3: { index: 16, name: 'Kim Đan Kỳ' },
  4: { index: 21, name: 'Nguyên Anh Kỳ' },
  5: { index: 26, name: 'Hóa Thần Kỳ' },
  6: { index: 31, name: 'Luyện Hư Kỳ' },
  7: { index: 36, name: 'Hợp Thể Kỳ' },
  8: { index: 41, name: 'Đại Thừa Kỳ' },
  9: { index: 46, name: 'Độ Kiếp Kỳ' }
};

export function convertTierToGrade(tier: number): string {
  const map: Record<number, string> = {
    1: 'Nhất Giai',
    2: 'Nhị Giai',
    3: 'Tam Giai',
    4: 'Tứ Giai',
    5: 'Ngũ Giai',
    6: 'Lục Giai',
    7: 'Thất Giai',
    8: 'Bát Giai',
    9: 'Cửu Giai'
  };
  return map[tier] || 'Nhất Giai';
}

/**
 * Tra cứu thông tin Dược Thảo từ kho dữ liệu Vạn Bảo Thương Hội hoặc Dược Điển
 */
function resolveHerbMaterialInfo(herbId: string, herbName?: string) {
  // 1. Tra cứu trực tiếp từ HERBS_SHOP_ITEMS_MAP (36 Dược Thảo Cửu Giai)
  if (HERBS_SHOP_ITEMS_MAP[herbId]) {
    const item = HERBS_SHOP_ITEMS_MAP[herbId];
    return {
      id: item.id,
      name: item.name,
      rawPrice: item.price,
      tier: item.tier,
      tierName: item.tierName,
      requiredRealmIndex: item.requiredRealmIndex,
      requiredRealmName: item.requiredRealmName,
      description: item.description,
      elementalAffinity: item.elementalAffinity,
      rarityGrade: item.rarityGrade
    };
  }

  // 2. Tra cứu trong DEFAULT_HERBS
  const def = DEFAULT_HERBS.find(h => h.id === herbId || (herbName && h.name.toLowerCase() === herbName.toLowerCase()));
  if (def) {
    const tier = parseGradeToTier(def.grade);
    const gating = TIER_REALM_GATING[tier] || { index: 0, name: 'Luyện Khí Kỳ' };
    return {
      id: def.id,
      name: def.name,
      rawPrice: def.price || 50,
      tier,
      tierName: def.grade || convertTierToGrade(tier),
      requiredRealmIndex: gating.index,
      requiredRealmName: gating.name,
      description: def.description,
      elementalAffinity: undefined,
      rarityGrade: undefined
    };
  }

  // 3. Tra cứu theo tên trong HERBS_SHOP_CATALOG
  if (herbName) {
    const matched = HERBS_SHOP_CATALOG.find(h => h.name.toLowerCase() === herbName.toLowerCase());
    if (matched) {
      return {
        id: matched.id,
        name: matched.name,
        rawPrice: matched.price,
        tier: matched.tier,
        tierName: matched.tierName,
        requiredRealmIndex: matched.requiredRealmIndex,
        requiredRealmName: matched.requiredRealmName,
        description: matched.description,
        elementalAffinity: matched.elementalAffinity,
        rarityGrade: matched.rarityGrade
      };
    }
  }

  // 4. Fallback an toàn
  const fallbackTier = 1;
  const gating = TIER_REALM_GATING[fallbackTier];
  return {
    id: herbId,
    name: herbName || herbId,
    rawPrice: 50,
    tier: fallbackTier,
    tierName: 'Nhất Giai',
    requiredRealmIndex: gating.index,
    requiredRealmName: gating.name,
    description: 'Dược thảo linh mộc cơ bản.',
    elementalAffinity: undefined,
    rarityGrade: undefined
  };
}

/**
 * Tra cứu thông tin Khoáng Thạch từ kho dữ liệu Vạn Bảo Thương Hội hoặc Khoáng Điển
 */
function resolveOreMaterialInfo(oreId: string, oreName?: string) {
  // 1. Tra cứu trực tiếp từ ORES_SHOP_ITEMS_MAP (Khoáng Thạch Cửu Giai)
  if (ORES_SHOP_ITEMS_MAP[oreId]) {
    const item = ORES_SHOP_ITEMS_MAP[oreId];
    return {
      id: item.id,
      name: item.name,
      rawPrice: item.price,
      tier: item.tier,
      tierName: item.tierName,
      requiredRealmIndex: item.requiredRealmIndex,
      requiredRealmName: item.requiredRealmName,
      description: item.description,
      elementalAffinity: item.elementalAffinity,
      hardnessGrade: item.hardnessGrade
    };
  }

  // 2. Tra cứu trong DEFAULT_ORES
  const def = DEFAULT_ORES.find(o => o.id === oreId || (oreName && o.name.toLowerCase() === oreName.toLowerCase()));
  if (def) {
    const tier = parseGradeToTier(def.grade);
    const gating = TIER_REALM_GATING[tier] || { index: 0, name: 'Luyện Khí Kỳ' };
    return {
      id: def.id,
      name: def.name,
      rawPrice: def.price || 60,
      tier,
      tierName: def.grade || convertTierToGrade(tier),
      requiredRealmIndex: gating.index,
      requiredRealmName: gating.name,
      description: def.description,
      elementalAffinity: undefined,
      hardnessGrade: undefined
    };
  }

  // 3. Tra cứu theo tên trong ORES_SHOP_CATALOG
  if (oreName) {
    const matched = ORES_SHOP_CATALOG.find(o => o.name.toLowerCase() === oreName.toLowerCase());
    if (matched) {
      return {
        id: matched.id,
        name: matched.name,
        rawPrice: matched.price,
        tier: matched.tier,
        tierName: matched.tierName,
        requiredRealmIndex: matched.requiredRealmIndex,
        requiredRealmName: matched.requiredRealmName,
        description: matched.description,
        elementalAffinity: matched.elementalAffinity,
        hardnessGrade: matched.hardnessGrade
      };
    }
  }

  // 4. Fallback an toàn
  const fallbackTier = 1;
  const gating = TIER_REALM_GATING[fallbackTier];
  return {
    id: oreId,
    name: oreName || oreId,
    rawPrice: 60,
    tier: fallbackTier,
    tierName: 'Nhất Giai',
    requiredRealmIndex: gating.index,
    requiredRealmName: gating.name,
    description: 'Khoáng thạch linh quặng phàm trần.',
    elementalAffinity: undefined,
    hardnessGrade: undefined
  };
}

/**
 * 1. Đánh giá nhu cầu cung ứng dược liệu luyện đan
 */
export function assessPillRecipeSupply(
  player: PlayerStats,
  recipe: DanRecipe,
  craftQty: number = 1
): CraftingSupplyAssessment {
  const qty = Math.max(1, Math.floor(craftQty));
  const invHerbs = player.inventory?.herbs || [];
  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const playerRealm = player.currentRealm || 0;

  const missingItems: MissingIngredientRequirement[] = [];
  let totalCostLinhThach = 0;

  const requirements = recipe.herbsRequired || (recipe.ingredients ? recipe.ingredients.map(i => ({ herbId: i.herbId, herbName: i.name, count: i.count })) : []);

  for (const req of requirements) {
    const requiredTotal = req.count * qty;
    const owned = invHerbs.find(h => h.id === req.herbId)?.quantity || 0;
    const missing = Math.max(0, requiredTotal - owned);

    if (missing > 0) {
      const info = resolveHerbMaterialInfo(req.herbId, req.herbName);
      const unitPrice = discountPercent > 0
        ? Math.max(1, Math.floor(info.rawPrice * (1 - discountPercent / 100)))
        : info.rawPrice;
      const totalPrice = unitPrice * missing;
      const canPurchaseAtCurrentRealm = playerRealm >= info.requiredRealmIndex;

      missingItems.push({
        type: 'herb',
        id: info.id,
        name: info.name,
        requiredQty: requiredTotal,
        currentQty: owned,
        missingQty: missing,
        unitPrice,
        totalPrice,
        tier: info.tier,
        requiredRealmIndex: info.requiredRealmIndex,
        requiredRealmName: info.requiredRealmName,
        canPurchaseAtCurrentRealm
      });

      totalCostLinhThach += totalPrice;
    }
  }

  const isFullySupplied = missingItems.length === 0;
  const hasUnmetRealmGating = missingItems.some(i => !i.canPurchaseAtCurrentRealm);
  const totalEquivalentHaPham = calculateTotalEquivalentHaPham(player);
  const hasEnoughLinhThach = totalEquivalentHaPham >= totalCostLinhThach;
  const canExecuteAutoPurchase = !isFullySupplied && !hasUnmetRealmGating && hasEnoughLinhThach;

  return {
    recipeId: recipe.id,
    recipeName: recipe.name || recipe.pillName,
    craftQuantity: qty,
    isFullySupplied,
    missingItems,
    totalCostLinhThach,
    hasEnoughLinhThach,
    hasUnmetRealmGating,
    canExecuteAutoPurchase
  };
}

/**
 * 2. Đánh giá nhu cầu cung ứng khoáng thạch rèn đúc trang bị
 */
export function assessForgeRecipeSupply(
  player: PlayerStats,
  recipe: EquipRecipe,
  craftQty: number = 1
): CraftingSupplyAssessment {
  const qty = Math.max(1, Math.floor(craftQty));
  const invOres = player.inventory?.ores || [];
  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const playerRealm = player.currentRealm || 0;

  const missingItems: MissingIngredientRequirement[] = [];
  let totalCostLinhThach = 0;

  for (const req of (recipe.oresRequired || [])) {
    const requiredTotal = req.count * qty;
    const owned = invOres.find(o => o.id === req.oreId)?.quantity || 0;
    const missing = Math.max(0, requiredTotal - owned);

    if (missing > 0) {
      const info = resolveOreMaterialInfo(req.oreId, req.oreName);
      const unitPrice = discountPercent > 0
        ? Math.max(1, Math.floor(info.rawPrice * (1 - discountPercent / 100)))
        : info.rawPrice;
      const totalPrice = unitPrice * missing;
      const canPurchaseAtCurrentRealm = playerRealm >= info.requiredRealmIndex;

      missingItems.push({
        type: 'ore',
        id: info.id,
        name: info.name,
        requiredQty: requiredTotal,
        currentQty: owned,
        missingQty: missing,
        unitPrice,
        totalPrice,
        tier: info.tier,
        requiredRealmIndex: info.requiredRealmIndex,
        requiredRealmName: info.requiredRealmName,
        canPurchaseAtCurrentRealm
      });

      totalCostLinhThach += totalPrice;
    }
  }

  const isFullySupplied = missingItems.length === 0;
  const hasUnmetRealmGating = missingItems.some(i => !i.canPurchaseAtCurrentRealm);
  const totalEquivalentHaPham = calculateTotalEquivalentHaPham(player);
  const hasEnoughLinhThach = totalEquivalentHaPham >= totalCostLinhThach;
  const canExecuteAutoPurchase = !isFullySupplied && !hasUnmetRealmGating && hasEnoughLinhThach;

  return {
    recipeId: recipe.id,
    recipeName: recipe.name,
    craftQuantity: qty,
    isFullySupplied,
    missingItems,
    totalCostLinhThach,
    hasEnoughLinhThach,
    hasUnmetRealmGating,
    canExecuteAutoPurchase
  };
}

/**
 * 3. Thực thi mua bù toàn bộ nguyên liệu thiếu trong cùng 1 transaction an toàn
 */
export function executeBatchSupplyPurchase(
  player: PlayerStats,
  assessment: CraftingSupplyAssessment
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  if (assessment.isFullySupplied) {
    return { success: true, updatedPlayer: player, message: 'Nguyên liệu đã đầy đủ!' };
  }

  // 1. Kiểm tra khóa cảnh giới nghiêm ngặt
  if (assessment.hasUnmetRealmGating) {
    const unmet = assessment.missingItems.find(i => !i.canPurchaseAtCurrentRealm);
    return {
      success: false,
      updatedPlayer: player,
      message: `🔒 Cần đạt [${unmet?.requiredRealmName || 'Cảnh giới cao hơn'}] để mua [${unmet?.name || 'nguyên liệu'}] tại Thương Hội!`
    };
  }

  // 2. Kiểm tra số dư Linh Thạch
  if (!assessment.hasEnoughLinhThach) {
    const available = calculateTotalEquivalentHaPham(player);
    return {
      success: false,
      updatedPlayer: player,
      message: `Linh Thạch không đủ! Cần ${assessment.totalCostLinhThach.toLocaleString()} Linh Thạch, hiện chỉ có tương đương ${available.toLocaleString()} Hạ Phẩm.`
    };
  }

  // 3. Kiểm tra sức chứa túi đồ (chỉ tính các loại vật phẩm mới chưa có trong túi)
  const currentHerbs = player.inventory?.herbs || [];
  const currentOres = player.inventory?.ores || [];
  let newSlotsCount = 0;

  for (const item of assessment.missingItems) {
    if (item.type === 'herb') {
      const exists = currentHerbs.some(h => h.id === item.id && (h.quantity || 0) > 0);
      if (!exists) newSlotsCount++;
    } else {
      const exists = currentOres.some(o => o.id === item.id && (o.quantity || 0) > 0);
      if (!exists) newSlotsCount++;
    }
  }

  const maxCapacity = getMaxInventoryCapacity(player);
  const usedSlots = getCurrentInventoryOccupiedSlots(player);
  if (maxCapacity < 9999 && (usedSlots + newSlotsCount) > maxCapacity) {
    return {
      success: false,
      updatedPlayer: player,
      message: `⚠️ Túi Trữ Vật đã đầy (${usedSlots}/${maxCapacity >= 9999 ? '∞' : maxCapacity})! Cần thêm ${newSlotsCount} ô trống để chứa nguyên liệu mới.`
    };
  }

  // 4. Khấu trừ Linh Thạch an toàn thông qua hàm chuẩn hóa thương hội
  const deductRes = deductEquivalentLinhThach(player, assessment.totalCostLinhThach);
  if (!deductRes.success || !deductRes.updatedPlayer) {
    return {
      success: false,
      updatedPlayer: player,
      message: deductRes.deductedMessage || 'Khấu trừ Linh Thạch thất bại!'
    };
  }

  // 5. Nạp nguyên liệu còn thiếu vào túi đồ theo cơ chế cộng dồn (stackable)
  const baseInv = deductRes.updatedPlayer.inventory || { pills: [], herbs: [], ores: [] };
  const updatedHerbs = [...(baseInv.herbs || [])];
  const updatedOres = [...(baseInv.ores || [])];

  for (const item of assessment.missingItems) {
    if (item.type === 'herb') {
      const idx = updatedHerbs.findIndex(h => h.id === item.id);
      if (idx >= 0) {
        updatedHerbs[idx] = {
          ...updatedHerbs[idx],
          quantity: (updatedHerbs[idx].quantity || 0) + item.missingQty
        };
      } else {
        const shopDef = HERBS_SHOP_ITEMS_MAP[item.id];
        const defaultDef = DEFAULT_HERBS.find(h => h.id === item.id);
        updatedHerbs.push({
          id: item.id,
          name: item.name,
          grade: shopDef?.tierName || defaultDef?.grade || convertTierToGrade(item.tier),
          description: shopDef?.description || defaultDef?.description || `Dược thảo ${convertTierToGrade(item.tier)}.`,
          price: item.unitPrice,
          quantity: item.missingQty,
          quality: shopDef?.rarityGrade === 'than' ? 'tien_pham'
            : shopDef?.rarityGrade === 'cuc' ? 'cuc_pham'
            : shopDef?.rarityGrade === 'thuong' ? 'thuong_pham'
            : 'trung_pham',
          element: shopDef?.elementalAffinity === 'hon_don' ? undefined : shopDef?.elementalAffinity
        });
      }
    } else {
      const idx = updatedOres.findIndex(o => o.id === item.id);
      if (idx >= 0) {
        updatedOres[idx] = {
          ...updatedOres[idx],
          quantity: (updatedOres[idx].quantity || 0) + item.missingQty
        };
      } else {
        const shopDef = ORES_SHOP_ITEMS_MAP[item.id];
        const defaultDef = DEFAULT_ORES.find(o => o.id === item.id);
        updatedOres.push({
          id: item.id,
          name: item.name,
          grade: shopDef?.tierName || defaultDef?.grade || convertTierToGrade(item.tier),
          description: shopDef?.description || defaultDef?.description || `Khoáng thạch ${convertTierToGrade(item.tier)}.`,
          price: item.unitPrice,
          quantity: item.missingQty,
          quality: shopDef?.hardnessGrade === 'than_pham' ? 'tien_pham'
            : shopDef?.hardnessGrade === 'cuc_pham' ? 'cuc_pham'
            : shopDef?.hardnessGrade === 'cao_cap' ? 'thuong_pham'
            : 'trung_pham',
          element: shopDef?.elementalAffinity === 'hon_don' ? undefined : shopDef?.elementalAffinity
        });
      }
    }
  }

  const updatedPlayer: PlayerStats = {
    ...deductRes.updatedPlayer,
    inventory: {
      ...baseInv,
      herbs: updatedHerbs,
      ores: updatedOres
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã mua bù thành công ${assessment.missingItems.length} loại nguyên liệu (${assessment.totalCostLinhThach.toLocaleString()} Linh Thạch)!`
  };
}
