// lib/herbs-shop-logic.ts
// Pure Business Logic cho phân hệ Dược Thảo Linh Mộc Cửu Giai & Mua Sắm Theo Lô

import { PlayerStats } from '@/lib/types/player';
import { HerbShopItem } from '@/lib/types/herbs-shop';
import { deductEquivalentLinhThach } from '@/lib/merchant-data';
import { calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';
import { getMaxInventoryCapacity, getInventoryUsedSlots } from '@/lib/inventory-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';

export interface BuyHerbsBatchResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Tính số lượng tối đa thảo dược người chơi có thể mua được dựa trên số dư linh thạch và túi đồ
 */
export function calculateMaxAffordableHerbs(
  player: PlayerStats,
  herbItem: HerbShopItem | { price: number; requiredRealmIndex?: number; id: string }
): number {
  if (!player || !herbItem) return 0;
  if (herbItem.requiredRealmIndex !== undefined && (player.currentRealm || 0) < herbItem.requiredRealmIndex) return 0;

  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const effectiveUnitPrice = discountPercent > 0
    ? Math.max(1, Math.floor(herbItem.price * (1 - discountPercent / 100)))
    : herbItem.price;

  const totalHaPham = calculateTotalEquivalentHaPham(player);
  if (totalHaPham < effectiveUnitPrice) return 0;

  // Kiểm tra nếu chưa có trong túi đồ và túi đã đầy
  const hasInInventory = (player.inventory?.herbs || []).some((h: any) => h.id === herbItem.id && (h.quantity || 0) > 0);
  if (!hasInInventory) {
    const maxCapacity = getMaxInventoryCapacity(player);
    const usedSlots = getInventoryUsedSlots(player.inventory);
    if (usedSlots >= maxCapacity) return 0;
  }

  const maxAffordable = Math.floor(totalHaPham / effectiveUnitPrice);
  return Math.max(0, Math.min(999, maxAffordable));
}

/**
 * Mua dược thảo theo lô (hỗ trợ mua lẻ 1, 10, 50, 100 hoặc max)
 */
export function buyHerbsBatch(
  player: PlayerStats,
  herbItem: HerbShopItem,
  quantity: number = 1
): BuyHerbsBatchResult {
  if (!player || !herbItem) {
    return { success: false, message: 'Dữ liệu giao dịch không hợp lệ!' };
  }

  const qty = Math.max(1, Math.floor(quantity));
  const playerRealm = player.currentRealm || 0;

  // 1. Kiểm tra cảnh giới tu vi
  if (playerRealm < herbItem.requiredRealmIndex) {
    return {
      success: false,
      message: `Chưa đủ cảnh giới! Thần thảo [${herbItem.name}] (${herbItem.tierName}) yêu cầu tối thiểu cảnh giới [${herbItem.requiredRealmName}].`
    };
  }

  // 2. Tính toán đơn giá chiết khấu từ đạo lữ
  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const effectiveUnitPrice = discountPercent > 0
    ? Math.max(1, Math.floor(herbItem.price * (1 - discountPercent / 100)))
    : herbItem.price;

  const totalPrice = effectiveUnitPrice * qty;

  // 3. Kiểm tra số dư Linh Thạch
  const totalAvailable = calculateTotalEquivalentHaPham(player);
  if (totalAvailable < totalPrice) {
    return {
      success: false,
      message: `Linh thạch không đủ! Cần ${totalPrice.toLocaleString()} Linh Thạch để thu mua x${qty.toLocaleString()} [${herbItem.name}], hiện chỉ có tương đương ${totalAvailable.toLocaleString()} Hạ Phẩm.`
    };
  }

  // 4. Kiểm tra sức chứa túi đồ (Stackable Check)
  const currentHerbs = [...(player.inventory?.herbs || [])];
  const existingIdx = currentHerbs.findIndex((h: any) => h.id === herbItem.id);
  const maxCapacity = getMaxInventoryCapacity(player);
  const usedSlots = getInventoryUsedSlots(player.inventory);

  if (existingIdx === -1 && usedSlots >= maxCapacity) {
    return {
      success: false,
      message: `Túi đồ đã đầy (${usedSlots}/${maxCapacity >= 9999 ? '∞' : maxCapacity})! Không thể chứa thêm loại dược thảo mới.`
    };
  }

  // 5. Khấu trừ Linh Thạch an toàn
  const deductRes = deductEquivalentLinhThach(player, totalPrice);
  if (!deductRes.success || !deductRes.updatedPlayer) {
    return {
      success: false,
      message: deductRes.deductedMessage || 'Giao dịch Linh Thạch thất bại!'
    };
  }

  // 6. Cập nhật số lượng vào Túi Đồ
  const updatedInvHerbs = [...(deductRes.updatedPlayer.inventory?.herbs || [])];
  const targetIdx = updatedInvHerbs.findIndex((h: any) => h.id === herbItem.id);

  if (targetIdx >= 0) {
    updatedInvHerbs[targetIdx] = {
      ...updatedInvHerbs[targetIdx],
      quantity: (updatedInvHerbs[targetIdx].quantity || 0) + qty
    };
  } else {
    updatedInvHerbs.push({
      id: herbItem.id,
      name: herbItem.name,
      grade: herbItem.tierName,
      description: herbItem.description,
      price: herbItem.price,
      quantity: qty,
      quality: herbItem.rarityGrade === 'than' ? 'tien_pham' : herbItem.rarityGrade === 'cuc' ? 'cuc_pham' : herbItem.rarityGrade === 'thuong' ? 'thuong_pham' : 'trung_pham',
      element: herbItem.elementalAffinity === 'hon_don' ? undefined : herbItem.elementalAffinity
    });
  }

  const curInv = deductRes.updatedPlayer.inventory;
  const updatedPlayer: PlayerStats = {
    ...deductRes.updatedPlayer,
    inventory: {
      ...curInv,
      pills: curInv?.pills || [],
      herbs: updatedInvHerbs,
      ores: curInv?.ores || [],
      equipment: curInv?.equipment || [],
      equipments: curInv?.equipments || [],
      manuals: curInv?.manuals || [],
      books: curInv?.books || [],
      bags: curInv?.bags || []
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã thu mua thành công ${qty.toLocaleString()} cành [${herbItem.name}] (${herbItem.tierName}) tiêu hao ${totalPrice.toLocaleString()} Linh Thạch!`
  };
}
