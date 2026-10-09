// lib/inventory-data.ts
// Dữ liệu Hệ Thống Túi Trữ Vật (Storage Capacity) & Bách Nghệ Phân Cấp

import { StorageBag, ArtisanLevel, ArtisanState } from '@/lib/types';

export const DEFAULT_STORAGE_BAGS: Record<string, StorageBag> = {
  bag_ha_bao: {
    id: 'bag_ha_bao',
    name: 'Hà Bao Phàm Trần',
    grade: 'Phàm Cấp',
    maxSlots: 20,
    price: 0,
    description: 'Túi vải thêu hoa văn đơn sơ của người phàm, không gian nhỏ hẹp chỉ đủ chứa 20 món tùy thân.'
  },
  bag_tru_vat: {
    id: 'bag_tru_vat',
    name: 'Sơ Cấp Trữ Vật Đại',
    grade: 'Hạ Phẩm Linh Khí',
    maxSlots: 35,
    price: 800,
    description: 'Tế luyện từ da linh thú cấp thấp, bên trong có phù văn không gian sơ khai mở rộng sức chứa lên 35 ô.'
  },
  bag_huyen_thiet: {
    id: 'bag_huyen_thiet',
    name: 'Huyền Thiết Giới Chỉ',
    grade: 'Trung Phẩm Linh Khí',
    maxSlots: 55,
    price: 2500,
    description: 'Nhẫn đúc từ Huyền Thiết ngàn năm, khắc Không Gian Pháp Trận, dung tích nới rộng đạt 55 ô.'
  },
  bag_tu_di: {
    id: 'bag_tu_di',
    name: 'Tu Di Giới Chỉ',
    grade: 'Thượng Phẩm Bảo Khí',
    maxSlots: 85,
    price: 8000,
    description: 'Chứa đựng diệu pháp "Nạp Tu Di vu Giới Tử", mở ra không gian rộng rãi tương đương 85 ô đồ.'
  },
  bag_hu_khong: {
    id: 'bag_hu_khong',
    name: 'Hư Không Giới Chỉ',
    grade: 'Cực Phẩm Cổ Bảo',
    maxSlots: 130,
    price: 25000,
    description: 'Rèn đúc từ Hư Không Toái Phiến, tự phong bế một góc hư không độc lập lên đến 130 ô.'
  },
  bag_hon_don: {
    id: 'bag_hon_don',
    name: 'Hỗn Độn Thần Giới',
    grade: 'Tiên Thiên Linh Bảo',
    maxSlots: 9999, // Vô hạn ô
    price: 100000,
    description: 'Thần giới thái cổ dựng dục từ thuở hồng hoang, không gian vô biên vô hạn dung nạp vạn vật đất trời.'
  }
};

export function createDefaultStorageBag(): StorageBag {
  return { ...DEFAULT_STORAGE_BAGS['bag_ha_bao'] };
}

/**
 * Tính toán số lượng ô đồ hiện đang sử dụng trong túi
 */
export function getInventoryUsedSlots(inventory?: any): number {
  if (!inventory) return 0;
  const pillSlots = (inventory.pills || []).filter((p: any) => p && p.quantity > 0).length;
  const herbSlots = (inventory.herbs || []).filter((h: any) => h && h.quantity > 0).length;
  const oreSlots = (inventory.ores || []).filter((o: any) => o && o.quantity > 0).length;
  const manualSlots = (inventory.manuals || []).length;
  const equipSlots = (inventory.equipments || []).length;
  const bookSlots = (inventory.books || []).filter((b: any) => b && b.quantity > 0).length;
  const bagSlots = (inventory.bags || []).filter((b: any) => b && b.quantity > 0).length;
  return pillSlots + herbSlots + oreSlots + manualSlots + equipSlots + bookSlots + bagSlots;
}

/**
 * Thêm vật phẩm vào túi đồ chuẩn bất biến (immutable update)
 * - Nếu vật phẩm đã tồn tại (cùng id): quantity = quantity + dropQuantity
 * - Nếu chưa có: Kiểm tra currentSlots < maxCapacity, nếu còn chỗ thì đẩy vào mảng
 */
export interface AddItemResult {
  success: boolean;
  inventory: any;
  reason?: string;
}

export function addItemToInventory(
  currentInventory: any,
  maxCapacity: number,
  type: 'herb' | 'ore' | 'pill' | 'equipment' | 'manual' | 'book' | 'bag',
  item: any,
  dropQuantity: number = 1
): AddItemResult {
  if (!item) {
    return { success: false, inventory: currentInventory, reason: 'Vật phẩm không hợp lệ' };
  }

  // Tạo bản sao bất biến sâu các mảng trong túi
  const inv = {
    pills: [...(currentInventory?.pills || []).map((p: any) => ({ ...p }))],
    herbs: [...(currentInventory?.herbs || []).map((h: any) => ({ ...h }))],
    ores: [...(currentInventory?.ores || []).map((o: any) => ({ ...o }))],
    manuals: [...(currentInventory?.manuals || []).map((m: any) => ({ ...m }))],
    equipments: [...(currentInventory?.equipments || []).map((e: any) => ({ ...e }))],
    books: [...(currentInventory?.books || []).map((b: any) => ({ ...b }))],
    bags: [...(currentInventory?.bags || []).map((b: any) => ({ ...b }))]
  };

  const currentSlots = getInventoryUsedSlots(inv);
  const qty = Math.max(1, dropQuantity);

  if (type === 'herb') {
    const itemQuality = item.quality || 'thuong_pham';
    const existingIdx = inv.herbs.findIndex((h: any) => h.id === item.id && (h.quality || 'thuong_pham') === itemQuality);
    if (existingIdx >= 0) {
      inv.herbs[existingIdx] = {
        ...inv.herbs[existingIdx],
        quantity: (inv.herbs[existingIdx].quantity || 0) + qty
      };
      return { success: true, inventory: inv };
    }
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.herbs.push({ ...item, quality: itemQuality, quantity: qty });
    return { success: true, inventory: inv };
  }

  if (type === 'ore') {
    const itemQuality = item.quality || 'thuong_pham';
    const existingIdx = inv.ores.findIndex((o: any) => o.id === item.id && (o.quality || 'thuong_pham') === itemQuality);
    if (existingIdx >= 0) {
      inv.ores[existingIdx] = {
        ...inv.ores[existingIdx],
        quantity: (inv.ores[existingIdx].quantity || 0) + qty
      };
      return { success: true, inventory: inv };
    }
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.ores.push({ ...item, quality: itemQuality, quantity: qty });
    return { success: true, inventory: inv };
  }

  if (type === 'pill') {
    const itemQuality = item.quality || 'thuong_pham';
    const existingIdx = inv.pills.findIndex((p: any) => p.id === item.id && (p.quality || 'thuong_pham') === itemQuality);
    if (existingIdx >= 0) {
      inv.pills[existingIdx] = {
        ...inv.pills[existingIdx],
        quantity: (inv.pills[existingIdx].quantity || 0) + qty
      };
      return { success: true, inventory: inv };
    }
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.pills.push({ ...item, quality: itemQuality, quantity: qty });
    return { success: true, inventory: inv };
  }

  if (type === 'equipment') {
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.equipments.push({ ...item, quality: item.quality || 'thuong_pham' });
    return { success: true, inventory: inv };
  }

  if (type === 'manual') {
    const exists = inv.manuals.some((m: any) => m.id === item.id);
    if (exists) {
      return { success: true, inventory: inv };
    }
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.manuals.push({ ...item });
    return { success: true, inventory: inv };
  }

  if (type === 'book') {
    const existingIdx = inv.books.findIndex((b: any) => b.id === item.id);
    if (existingIdx >= 0) {
      inv.books[existingIdx] = {
        ...inv.books[existingIdx],
        quantity: (inv.books[existingIdx].quantity || 0) + qty
      };
      return { success: true, inventory: inv };
    }
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.books.push({ ...item, quantity: qty });
    return { success: true, inventory: inv };
  }

  if (type === 'bag') {
    const existingIdx = inv.bags.findIndex((b: any) => b.id === item.id);
    if (existingIdx >= 0) {
      inv.bags[existingIdx] = {
        ...inv.bags[existingIdx],
        quantity: (inv.bags[existingIdx].quantity || 0) + qty
      };
      return { success: true, inventory: inv };
    }
    if (maxCapacity < 9999 && currentSlots >= maxCapacity) {
      return { success: false, inventory: inv, reason: 'Túi Trữ Vật đã đầy ô chứa!' };
    }
    inv.bags.push({ ...item, quantity: qty });
    return { success: true, inventory: inv };
  }

  return { success: true, inventory: inv };
}

/**
 * Tính toán tổng sức chứa tối đa của Túi Trữ Vật (Single Source of Truth)
 * Sức chứa = 20 (Cơ bản) + Dung tích Túi/Nhẫn Trữ Vật đang trang bị + Buff Luân Hồi/Perk
 */
export function getMaxInventoryCapacity(player?: any): number {
  if (!player) return 20;

  // 1. Kiểm tra cờ túi vô hạn ô (từ shop, flag đặc biệt hoặc túi có maxSlots >= 9999)
  if (
    player.inventory?.isInfiniteCapacity ||
    player.isInfiniteCapacity ||
    player.equippedBag?.isInfinite ||
    player.storageBag?.isInfinite ||
    (typeof player.storageBag?.maxSlots === 'number' && player.storageBag.maxSlots >= 9999) ||
    (typeof player.inventory?.maxSlots === 'number' && player.inventory.maxSlots >= 9999)
  ) {
    return 999999; // Vô hạn ô
  }

  const BASE_CAPACITY = 20;

  // 2. Lấy dung tích từ Túi Trữ Vật đang trang bị (hoặc các trường tương thích)
  const storageBagSlots =
    player.storageBag?.maxSlots ??
    player.equipped?.bag?.capacityBonus ??
    player.equippedBag?.capacity ??
    player.inventory?.equippedBagCapacity ??
    player.inventory?.maxSlots ??
    BASE_CAPACITY;

  // 3. Lấy bonus từ Thiên Đạo Perks hoặc Đạo Vận Luân Hồi (nếu có)
  const perkBonus = player.reincarnationState?.permanentPerks?.['perk_expand_inventory']
    ? Number(player.reincarnationState.permanentPerks['perk_expand_inventory']) * 10
    : 0;

  // 3b. Lấy bonus từ Pháp Bảo Trữ Vật Cửu Giai (storageState)
  const storageStateBonus = player.storageState?.totalBonusGeneralSlots || 0;

  const total = Math.max(BASE_CAPACITY, storageBagSlots + perkBonus, BASE_CAPACITY + storageStateBonus + perkBonus);
  return total >= 9999 ? 999999 : total;
}

/**
 * Đếm tổng số ô slot đang bị chiếm dụng trong túi đồ (Single Source of Truth)
 */
export function getCurrentInventoryOccupiedSlots(playerOrInventory?: any): number {
  if (!playerOrInventory) return 0;
  const inv = playerOrInventory.inventory || playerOrInventory;
  return getInventoryUsedSlots(inv);
}

/**
 * Kiểm tra xem túi trữ vật có bị đầy nếu nhận thêm `additionalItems` ô không
 */
export function isInventoryFull(player: any, additionalItems: number = 1): boolean {
  if (!player) return false;
  const maxCapacity = getMaxInventoryCapacity(player);
  if (maxCapacity >= 9999) return false;

  const currentCount = getCurrentInventoryOccupiedSlots(player);
  return (currentCount + additionalItems) > maxCapacity;
}

/**
 * Kiểm tra xem túi còn chỗ nhận thêm 1 loại item không
 */
export function canReceiveItem(
  inventoryOrPlayer: any,
  itemType: 'herb' | 'ore' | 'pill' | 'equipment' | 'manual' | 'book' | 'bag',
  itemId?: string,
  explicitMaxSlots?: number
): boolean {
  let inventory: any;
  let maxSlots: number;

  if (typeof explicitMaxSlots === 'number') {
    maxSlots = explicitMaxSlots;
    inventory = inventoryOrPlayer?.inventory || inventoryOrPlayer;
  } else if (inventoryOrPlayer?.storageBag || inventoryOrPlayer?.inventory) {
    maxSlots = getMaxInventoryCapacity(inventoryOrPlayer);
    inventory = inventoryOrPlayer.inventory || inventoryOrPlayer;
  } else {
    inventory = inventoryOrPlayer;
    maxSlots = typeof inventoryOrPlayer?.maxSlots === 'number' ? inventoryOrPlayer.maxSlots : 20;
  }

  // Túi vô hạn ô chứa (>= 9999) luôn luôn nhận được
  if (maxSlots >= 9999) return true;

  const used = getInventoryUsedSlots(inventory);
  if (used < maxSlots) return true;

  // Nếu đã đầy ô, nhưng là item có thể gộp chồng (stackable) và người chơi ĐÃ CÓ sẵn thì vẫn nhận được
  if (itemType === 'herb' && (inventory?.herbs || []).some((h: any) => h.id === itemId && h.quantity > 0)) {
    return true;
  }
  if (itemType === 'pill' && (inventory?.pills || []).some((p: any) => p.id === itemId && p.quantity > 0)) {
    return true;
  }
  if (itemType === 'ore' && (inventory?.ores || []).some((o: any) => o.id === itemId && o.quantity > 0)) {
    return true;
  }
  if (itemType === 'book' && (inventory?.books || []).some((b: any) => b.id === itemId && b.quantity > 0)) {
    return true;
  }
  if (itemType === 'bag' && (inventory?.bags || []).some((b: any) => b.id === itemId && b.quantity > 0)) {
    return true;
  }

  return false;
}

export function canAddItemToInventory(
  inventoryOrPlayer: any,
  arg2?: any,
  arg3?: any,
  arg4?: any
): boolean {
  if (typeof arg2 === 'number') {
    return canReceiveItem(inventoryOrPlayer, arg3, arg4, arg2);
  }
  return canReceiveItem(inventoryOrPlayer, arg2, arg3);
}

// ============================================
// BÁCH NGHỆ CẤP BẬC (5 BẬC)
// ============================================

export const ARTISAN_TITLES: Record<'alchemy' | 'forging', Record<ArtisanLevel, string>> = {
  alchemy: {
    1: 'Sơ Cấp Đan Đồng',
    2: 'Trung Cấp Đan Sĩ',
    3: 'Cao Cấp Đan Sư',
    4: 'Đỉnh Cấp Đại Đan Sư',
    5: 'Thái Thượng Đan Thánh'
  },
  forging: {
    1: 'Sơ Cấp Thiết Tượng',
    2: 'Trung Cấp Đúc Sĩ',
    3: 'Cao Cấp Luyện Khí Sư',
    4: 'Đỉnh Cấp Đại Luyện Sư',
    5: 'Thần Binh Tông Sư'
  }
};

export const ARTISAN_LEVEL_EXP: Record<ArtisanLevel, number> = {
  1: 100,
  2: 300,
  3: 700,
  4: 1500,
  5: 99999 // Max level
};

export interface ArtisanPerks {
  allowedGrades: string[];
  successBonus: number;       // +% tỉ lệ thành công
  critChance: number;         // % tỉ lệ luyện ra Đan/Khí Cực Phẩm (x1.5 chỉ số hoặc x2 số lượng)
  description: string;
}

export const ARTISAN_PERKS: Record<ArtisanLevel, ArtisanPerks> = {
  1: {
    allowedGrades: ['Nhất Giai', 'Nhị Giai', 'Nhất Phẩm', 'Nhị Phẩm', 'Phàm Khí'],
    successBonus: 0,
    critChance: 0,
    description: 'Lĩnh hội dược lý sơ bộ. Cho phép chế tạo đan dược/pháp bảo Nhất & Nhị Giai.'
  },
  2: {
    allowedGrades: ['Nhất Giai', 'Nhị Giai', 'Tam Giai', 'Nhất Phẩm', 'Nhị Phẩm', 'Tam Phẩm', 'Phàm Khí', 'Linh Khí'],
    successBonus: 5,
    critChance: 5,
    description: 'Thao túng đan hỏa thuần thục. Mở khóa Tam Giai & Linh Khí, tỉ lệ thành đan +5%, 5% xuất hiện Đan Cực Phẩm.'
  },
  3: {
    allowedGrades: ['Nhất Giai', 'Nhị Giai', 'Tam Giai', 'Tứ Giai', 'Nhất Phẩm', 'Nhị Phẩm', 'Tam Phẩm', 'Tứ Phẩm', 'Phàm Khí', 'Linh Khí', 'Bảo Khí'],
    successBonus: 10,
    critChance: 10,
    description: 'Dung hợp thiên địa linh tài. Mở khóa Tứ Giai & Bảo Khí, tỉ lệ thành đan +10%, 10% xuất hiện Đan Cực Phẩm.'
  },
  4: {
    allowedGrades: ['Nhất Giai', 'Nhị Giai', 'Tam Giai', 'Tứ Giai', 'Ngũ Giai', 'Nhất Phẩm', 'Nhị Phẩm', 'Tam Phẩm', 'Tứ Phẩm', 'Ngũ Phẩm', 'Phàm Khí', 'Linh Khí', 'Bảo Khí', 'Cổ Bảo'],
    successBonus: 15,
    critChance: 18,
    description: 'Luyện đan bất động như sơn. Mở khóa Ngũ Giai & Cổ Bảo, tỉ lệ thành đan +15%, 18% xuất hiện Đan Cực Phẩm.'
  },
  5: {
    allowedGrades: [
      'Nhất Giai', 'Nhị Giai', 'Tam Giai', 'Tứ Giai', 'Ngũ Giai', 'Lục Giai', 'Thất Giai', 'Bát Giai', 'Cửu Giai', 'Thần Giai',
      'Nhất Phẩm', 'Nhị Phẩm', 'Tam Phẩm', 'Tứ Phẩm', 'Ngũ Phẩm', 'Thần Phẩm',
      'Phàm Khí', 'Linh Khí', 'Bảo Khí', 'Cổ Bảo', 'Tiên Thiên Linh Bảo'
    ],
    successBonus: 25,
    critChance: 30,
    description: 'Lô hỏa thuần thanh, đoạt tạo hóa thiên địa! Mở khóa Thần Giai & Tiên Thiên Linh Bảo, tỉ lệ thành công +25%, 30% Đan Dược/Pháp Bảo Cực Phẩm!'
  }
};

export function createDefaultArtisanState(
  typeOrUnlocked: 'alchemy' | 'forging' | boolean = 'alchemy',
  unlocked = false
): ArtisanState {
  const isType = typeof typeOrUnlocked === 'string';
  const type: 'alchemy' | 'forging' = isType ? (typeOrUnlocked as 'alchemy' | 'forging') : 'alchemy';
  const isUnlocked = isType ? unlocked : Boolean(typeOrUnlocked);

  return {
    unlocked: isUnlocked,
    level: 1,
    title: ARTISAN_TITLES[type][1],
    exp: 0,
    maxExp: ARTISAN_LEVEL_EXP[1],
    criticalCraftCount: 0
  };
}

import { checkArtisanPromotionRequirement } from './artisan-lock-logic';

/**
 * Cộng điểm độ thuần thục (EXP) và tự động thăng cấp nếu đủ điều kiện
 * Khóa trần thăng cấp nếu cảnh giới Khí Tu chưa đạt yêu cầu.
 */
export function addArtisanExp(
  current: ArtisanState,
  type: 'alchemy' | 'forging',
  expGain: number,
  isCritical = false,
  realmIndex?: number
): { updated: ArtisanState; leveledUp: boolean; newLevel?: ArtisanLevel } {
  let { level, exp, maxExp, criticalCraftCount, unlocked } = current;
  let leveledUp = false;
  let newLevel = level;

  if (isCritical) {
    criticalCraftCount += 1;
  }

  if (level >= 5) {
    return {
      updated: {
        ...current,
        exp: exp + expGain,
        criticalCraftCount
      },
      leveledUp: false
    };
  }

  exp += expGain;

  while (level < 5 && exp >= maxExp) {
    if (realmIndex !== undefined) {
      const promoCheck = checkArtisanPromotionRequirement(realmIndex, level);
      if (!promoCheck.canPromote) {
        exp = Math.min(exp, maxExp);
        break;
      }
    }
    exp -= maxExp;
    level = (level + 1) as ArtisanLevel;
    maxExp = ARTISAN_LEVEL_EXP[level];
    leveledUp = true;
    newLevel = level;
  }

  return {
    updated: {
      unlocked,
      level,
      title: ARTISAN_TITLES[type][level],
      exp,
      maxExp,
      criticalCraftCount
    },
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined
  };
}
