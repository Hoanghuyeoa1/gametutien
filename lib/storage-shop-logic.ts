// lib/storage-shop-logic.ts
// Logic nghiệp vụ thuần túy cho Phân hệ Pháp Bảo Trữ Vật Cửu Giai

import { PlayerStats } from './types';
import { StorageShopItem, PlayerStorageState } from './types/storage-shop';
import { calculateTotalEquivalentHaPham } from './item-quality-data';
import { deductEquivalentLinhThach } from './merchant-data';
import { getBondedCompanionBuffs } from './companions-data';
import { getMaxInventoryCapacity } from './inventory-data';

export interface UnlockStorageResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Kiểm tra xem người chơi đã dung hợp hoặc khai mở bảo vật không gian này chưa
 */
export function isStorageAlreadyUnlocked(player: PlayerStats, storageId: string): boolean {
  if (!storageId) return false;

  // 1. Kiểm tra trong storageState.unlockedStorageIds
  if (player.storageState?.unlockedStorageIds?.includes(storageId)) return true;

  // 2. Kiểm tra trong merchantState.purchasedOneTimeIds
  const purchasedIds = player.merchantState?.purchasedOneTimeIds || [];
  if (purchasedIds.includes(storageId)) return true;

  const boughtIds = player.merchantState?.boughtOneTimeItemIds || [];
  if (boughtIds.includes(storageId)) return true;

  return false;
}

/**
 * Logic mua và dung hợp / khai mở Thần Thức pháp bảo trữ vật vĩnh viễn
 */
export function buyAndUnlockStorage(
  player: PlayerStats,
  item: StorageShopItem
): UnlockStorageResult {
  // 1. Xác thực cảnh giới tối thiểu
  const playerRealm = player.currentRealm || 0;
  if (playerRealm < item.requiredRealmIndex) {
    return {
      success: false,
      message: `Thần thức chưa đủ thâm sâu để ngự trị không gian của ${item.name}! Cần đạt tối thiểu ${item.requiredRealmName}.`
    };
  }

  // 2. Kiểm tra chống dung hợp trùng lặp (One-Time Upgrade Guard)
  if (isStorageAlreadyUnlocked(player, item.id)) {
    return {
      success: false,
      message: `Đã dung hợp và khai mở pháp bảo không gian [${item.name}] rồi!`
    };
  }

  // 3. Tính toán chiết khấu Đạo Lữ (Dạ Mộng Ly / Vạn Bảo Nữ Thần Tôn)
  const companionBuffs = getBondedCompanionBuffs(player);
  const discountPercent = companionBuffs.merchantDiscountPercent || 0;
  const finalPrice = discountPercent > 0
    ? Math.max(1, Math.floor(item.price * (1 - discountPercent / 100)))
    : item.price;

  // 4. Kiểm tra số dư Linh Thạch
  const totalEquivalent = calculateTotalEquivalentHaPham(player);
  if (totalEquivalent < finalPrice) {
    return {
      success: false,
      message: `Linh thạch không đủ để giao dịch bảo vật không gian này! Cần ${finalPrice.toLocaleString()} Linh Thạch (Đang có: ${totalEquivalent.toLocaleString()}).`
    };
  }

  // 5. Khấu trừ Linh Thạch an toàn
  const deductResult = deductEquivalentLinhThach(player, finalPrice);
  if (!deductResult.success) {
    return {
      success: false,
      message: deductResult.deductedMessage || 'Khấu trừ Linh Thạch thất bại!'
    };
  }
  const deductedPlayer = deductResult.updatedPlayer;

  // 6. Cập nhật PlayerStorageState
  const currentStorage = deductedPlayer.storageState || {
    unlockedStorageIds: [],
    totalBonusGeneralSlots: 0,
    totalBonusHerbSlots: 0,
    totalBonusOreSlots: 0
  };

  const unlockedStorageIds = Array.isArray(currentStorage.unlockedStorageIds)
    ? Array.from(new Set([...currentStorage.unlockedStorageIds, item.id]))
    : [item.id];

  const genBonus = item.spatialCapacityBonus.generalSlotsFlat || 0;
  const herbBonus = item.spatialCapacityBonus.herbSlotsFlat || 0;
  const oreBonus = item.spatialCapacityBonus.oreSlotsFlat || 0;

  const totalBonusGeneralSlots = (currentStorage.totalBonusGeneralSlots || 0) + genBonus;
  const totalBonusHerbSlots = (currentStorage.totalBonusHerbSlots || 0) + herbBonus;
  const totalBonusOreSlots = (currentStorage.totalBonusOreSlots || 0) + oreBonus;

  const updatedStorageState: PlayerStorageState = {
    unlockedStorageIds,
    totalBonusGeneralSlots,
    totalBonusHerbSlots,
    totalBonusOreSlots
  };

  // 7. Cập nhật sức chứa túi đồ trực tiếp (Single Source of Truth)
  const currentInvMax = deductedPlayer.inventory?.maxSlots || 20;
  const newInvMax = currentInvMax + genBonus;

  const updatedInventory = deductedPlayer.inventory
    ? { ...deductedPlayer.inventory, maxSlots: newInvMax }
    : { maxSlots: newInvMax, pills: [], herbs: [], ores: [], manuals: [], equipments: [], books: [], bags: [] };

  // Cập nhật storageBag nếu có
  const updatedStorageBag = deductedPlayer.storageBag
    ? {
        ...deductedPlayer.storageBag,
        maxSlots: (deductedPlayer.storageBag.maxSlots || 20) + genBonus
      }
    : undefined;

  // 8. Lưu vết vào danh sách đã mua độc bản
  const existingPurchasedOneTime = Array.isArray(deductedPlayer.merchantState?.purchasedOneTimeIds)
    ? [...deductedPlayer.merchantState.purchasedOneTimeIds]
    : [];
  if (!existingPurchasedOneTime.includes(item.id)) {
    existingPurchasedOneTime.push(item.id);
  }

  const updatedMerchantState = deductedPlayer.merchantState
    ? {
        ...deductedPlayer.merchantState,
        purchasedOneTimeIds: existingPurchasedOneTime
      }
    : { items: [], purchasedOneTimeIds: existingPurchasedOneTime };

  // 9. Cập nhật Động Phủ nếu có bonus kho động phủ
  let updatedAbode = deductedPlayer.abodeState;
  if (item.spatialCapacityBonus.abodeStorageFlat && updatedAbode) {
    updatedAbode = {
      ...updatedAbode,
      storageCapacityBonus: ((updatedAbode as any).storageCapacityBonus || 0) + item.spatialCapacityBonus.abodeStorageFlat
    };
  }

  const updatedPlayer: PlayerStats = {
    ...deductedPlayer,
    storageState: updatedStorageState,
    inventory: updatedInventory as any,
    storageBag: updatedStorageBag,
    merchantState: updatedMerchantState,
    ...(updatedAbode ? { abodeState: updatedAbode } : {})
  };

  const bonusesText = [
    genBonus > 0 ? `+${genBonus} ô túi chung` : '',
    herbBonus > 0 ? `+${herbBonus} ô dược hạp` : '',
    oreBonus > 0 ? `+${oreBonus} ô quáng đại` : ''
  ].filter(Boolean).join(', ');

  return {
    success: true,
    updatedPlayer,
    message: `Đã luyện hóa thành công [${item.name}], khai mở thêm ${bonusesText}!`
  };
}

/**
 * Tính toán tổng dung lượng tối đa hiệu lực hiện tại
 */
export function calculateEffectiveMaxSlots(player: PlayerStats): number {
  return getMaxInventoryCapacity(player);
}
