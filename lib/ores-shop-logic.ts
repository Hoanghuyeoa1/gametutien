// lib/ores-shop-logic.ts
// Pure Business Logic cho phân hệ Khoáng Thạch Linh Quặng Cửu Giai & Mua Sắm Theo Lô

import { PlayerStats } from '@/lib/types/player';
import { OreShopItem } from '@/lib/types/ores-shop';
import { deductEquivalentLinhThach } from '@/lib/merchant-data';
import { calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';
import { getMaxInventoryCapacity, getCurrentInventoryOccupiedSlots } from '@/lib/inventory-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';

export interface BuyOresBatchResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Tính số lượng tối đa khoáng thạch người chơi có thể mua được
 * dựa trên số dư linh thạch quy đổi và sức chứa túi đồ
 */
export function calculateMaxAffordableOres(
  player: PlayerStats,
  oreItem: OreShopItem | { price: number; requiredRealmIndex?: number; id: string }
): number {
  if (!player || !oreItem) return 0;
  if (oreItem.requiredRealmIndex !== undefined && (player.currentRealm || 0) < oreItem.requiredRealmIndex) return 0;

  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const effectiveUnitPrice = discountPercent > 0
    ? Math.max(1, Math.floor(oreItem.price * (1 - discountPercent / 100)))
    : oreItem.price;

  const totalHaPham = calculateTotalEquivalentHaPham(player);
  if (totalHaPham < effectiveUnitPrice) return 0;

  // Kiểm tra nếu chưa có trong túi đồ và túi đã đầy
  const hasInInventory = (player.inventory?.ores || []).some((o: any) => o.id === oreItem.id && (o.quantity || 0) > 0);
  if (!hasInInventory) {
    const maxCapacity = getMaxInventoryCapacity(player);
    const usedSlots = getCurrentInventoryOccupiedSlots(player);
    if (usedSlots >= maxCapacity) return 0;
  }

  const maxAffordable = Math.floor(totalHaPham / effectiveUnitPrice);
  return Math.max(0, Math.min(9999, maxAffordable));
}

/**
 * Mua khoáng thạch theo lô (hỗ trợ mua lẻ 1, 10, 50, 100 hoặc max)
 */
export function buyOresBatch(
  player: PlayerStats,
  oreItem: OreShopItem,
  quantity: number = 1
): BuyOresBatchResult {
  if (!player || !oreItem) {
    return { success: false, message: 'Dữ liệu giao dịch không hợp lệ!' };
  }

  const qty = Math.max(1, Math.floor(quantity));
  const playerRealm = player.currentRealm || 0;

  // 1. Kiểm tra cảnh giới tu vi
  if (playerRealm < oreItem.requiredRealmIndex) {
    return {
      success: false,
      message: `Chưa đủ cảnh giới! Linh quặng [${oreItem.name}] (${oreItem.tierName}) yêu cầu tối thiểu cảnh giới [${oreItem.requiredRealmName}].`
    };
  }

  // 2. Tính toán đơn giá chiết khấu từ đạo lữ
  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const effectiveUnitPrice = discountPercent > 0
    ? Math.max(1, Math.floor(oreItem.price * (1 - discountPercent / 100)))
    : oreItem.price;

  const totalPrice = effectiveUnitPrice * qty;

  // 3. Kiểm tra số dư Linh Thạch
  const totalAvailable = calculateTotalEquivalentHaPham(player);
  if (totalAvailable < totalPrice) {
    return {
      success: false,
      message: `Linh thạch không đủ! Cần ${totalPrice.toLocaleString()} Linh Thạch để thu mua x${qty.toLocaleString()} [${oreItem.name}], hiện chỉ có tương đương ${totalAvailable.toLocaleString()} Hạ Phẩm.`
    };
  }

  // 4. Kiểm tra sức chứa túi đồ (Stackable Check)
  const currentOres = [...(player.inventory?.ores || [])];
  const existingIdx = currentOres.findIndex((o: any) => o.id === oreItem.id);
  const maxCapacity = getMaxInventoryCapacity(player);
  const usedSlots = getCurrentInventoryOccupiedSlots(player);

  if (existingIdx === -1 && usedSlots >= maxCapacity) {
    return {
      success: false,
      message: `Túi đồ đã đầy (${usedSlots}/${maxCapacity >= 9999 ? '∞' : maxCapacity})! Không thể chứa thêm loại khoáng thạch mới.`
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

  // 6. Cập nhật số lượng vào Túi Đồ (Stackable)
  const updatedInvOres = [...(deductRes.updatedPlayer.inventory?.ores || [])];
  const targetIdx = updatedInvOres.findIndex((o: any) => o.id === oreItem.id);

  if (targetIdx >= 0) {
    updatedInvOres[targetIdx] = {
      ...updatedInvOres[targetIdx],
      quantity: (updatedInvOres[targetIdx].quantity || 0) + qty
    };
  } else {
    updatedInvOres.push({
      id: oreItem.id,
      name: oreItem.name,
      grade: oreItem.tierName,
      description: oreItem.description,
      price: oreItem.price,
      quantity: qty,
      quality: oreItem.hardnessGrade === 'than_pham' ? 'tien_pham'
        : oreItem.hardnessGrade === 'cuc_pham' ? 'cuc_pham'
        : oreItem.hardnessGrade === 'cao_cap' ? 'thuong_pham'
        : 'trung_pham',
      element: oreItem.elementalAffinity === 'hon_don' ? undefined : oreItem.elementalAffinity
    });
  }

  const curInv = deductRes.updatedPlayer.inventory;
  const updatedPlayer: PlayerStats = {
    ...deductRes.updatedPlayer,
    inventory: {
      ...curInv,
      pills: curInv?.pills || [],
      herbs: curInv?.herbs || [],
      ores: updatedInvOres,
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
    message: `Đã thu mua thành công ${qty.toLocaleString()} khối [${oreItem.name}] (${oreItem.tierName}) tiêu hao ${totalPrice.toLocaleString()} Linh Thạch!`
  };
}
