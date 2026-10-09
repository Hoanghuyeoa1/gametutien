// lib/types/storage-shop.ts
// Định nghĩa kiểu dữ liệu Phân hệ Pháp Bảo Trữ Vật Cửu Giai (Spatial Storage & Bag Expansions Tier 1 -> Tier 9)

export type StorageShopTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type StorageCategory = 
  | 'universal'   // Càn Khôn Chung (Tăng ô túi đồ toàn diện)
  | 'herb_vault'  // Dược Hạp (Tăng ngăn chứa dược thảo)
  | 'ore_vault'   // Quáng Đại (Tăng ngăn chứa khoáng thạch)
  | 'dimension';  // Tu Di Dị Bảo (Không gian thứ nguyên & đặc quyền)

export interface SpatialCapacityBonus {
  generalSlotsFlat?: number;     // + Ô túi đồ chung vĩnh viễn
  herbSlotsFlat?: number;        // + Ô chuyên dụng cho Dược Thảo
  oreSlotsFlat?: number;         // + Ô chuyên dụng cho Khoáng Thạch
  abodeStorageFlat?: number;     // + Ô kho chứa Động Thiên Phúc Địa
  retainSlotsOnRebirth?: number; // Số ô trang bị/vật phẩm bảo toàn khi Luân Hồi
}

export interface StorageShopItem {
  id: string;
  name: string;
  tier: StorageShopTier;
  tierName: string;
  category: StorageCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  price: number; // Đơn giá Linh Thạch
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind color class
  avatarGradient: string; // CSS gradient class cho avatar phù văn SVG
  spatialCapacityBonus: SpatialCapacityBonus;
  specialPerkName?: string;
  specialPerkDesc?: string;
}

export interface PlayerStorageState {
  unlockedStorageIds: string[];    // Danh sách ID pháp bảo trữ vật đã dung hợp
  totalBonusGeneralSlots: number;  // Tổng số ô chung đã mở rộng
  totalBonusHerbSlots: number;     // Tổng số ô dược thảo đã mở rộng
  totalBonusOreSlots: number;      // Tổng số ô khoáng thạch đã mở rộng
}
