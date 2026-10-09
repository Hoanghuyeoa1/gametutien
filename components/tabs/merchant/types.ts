// components/tabs/merchant/types.ts
// Core Domain Types cho phân hệ Vạn Bảo Thương Hội (Merchant Guild / Celestial Pavilion)
// 100% Strict TypeScript, No Any, Pure Type Contracts

import { PillTier, ItemQuality } from '@/lib/types';
import { EquipmentSlotType } from '@/lib/types/equipment-shop';

/**
 * 3 Phân Khu Chính Của Vạn Bảo Thương Hội:
 * - phuong_thi: Phường Thị Vạn Bảo (Cửa hàng chính phẩm, đầy đủ 9 giai vị)
 * - cho_den: Chợ Đen Ma Thị (Hàng cấm kỵ, cổ vật hiếm gặp, đổi chác dị bảo)
 * - thu_mua: Tiệm Thu Mua & Hối Đoái (Thanh lý tài nguyên, Tệ Điếm đổi Linh Thạch)
 */
export type MerchantSubTab = 'phuong_thi' | 'cho_den' | 'thu_mua';

/**
 * Danh Mục Lọc Hàng Hóa Thương Hội
 */
export type MerchantFilterCategory =
  | 'all'          // Toàn bộ
  | 'pills'        // Đan Dược
  | 'cultivation'  // Vật Phẩm Tu Luyện
  | 'manuals'      // Công Pháp Bí Tịch
  | 'skills'       // Thần Thông Bí Thuật
  | 'herbs'        // Dược Thảo
  | 'ores'         // Khoáng Thạch
  | 'equipment'    // Pháp Bảo / Trang Bị
  | 'companions'   // Đạo Lữ Khế Ước
  | 'beasts'       // Linh Thú Thần Sủng
  | 'storage'      // Pháp Bảo Trữ Vật
  | 'talismans';   // Phù Lục

/**
 * Tiêu Chí Sắp Xếp Sản Phẩm
 */
export type MerchantSortOption =
  | 'default'      // Mặc định (Theo Giai Vị & Phẩm Cấp)
  | 'price_asc'    // Giá tăng dần
  | 'price_desc'   // Giá giảm dần
  | 'grade_desc'   // Phẩm cấp cao nhất
  | 'tier_desc'    // Giai vị cao nhất
  | 'name_asc';    // Theo tên A-Z

/**
 * Đơn Vị Tiền Tệ Tu Chân Giới
 */
export type MerchantCurrency =
  | 'linh_thach'    // Hạ Phẩm Linh Thạch (Cơ sở x1)
  | 'trung_pham'    // Trung Phẩm Linh Thạch (x1,000)
  | 'thuong_pham'   // Thượng Phẩm Linh Thạch (x1,000,000)
  | 'cuc_pham'      // Cực Phẩm Linh Thạch (x1,000,000,000)
  | 'tien_tinh'     // Tiên Tinh / Tiên Phẩm Linh Thạch (x1,000,000,000,000)
  | 'cong_duc';     // Điểm Công Đức / Danh Vọng

/**
 * Schema Vật Phẩm Bày Bán Tại Thương Hội
 */
export interface MerchantShopItem {
  id: string;
  itemId: string;
  name: string;
  category: MerchantFilterCategory;
  price: number;
  originalPrice: number;
  currency: MerchantCurrency;
  stock: number;
  maxStock?: number;
  requiredRealmIndex: number;
  requiredRealmName?: string;
  discountPercent?: number;
  isHot?: boolean;
  isLimited?: boolean;
  isOneTime?: boolean;
  tier?: PillTier | number;
  grade?: string;
  quality?: ItemQuality | string;
  description?: string;
  icon?: string;
  equipmentSlot?: EquipmentSlotType;
  effectsSummary?: string;
  data?: Record<string, unknown>;
}

/**
 * Phẩm Vị Độ Hiếm Chợ Đen
 */
export type BlackMarketRarity = 'rare' | 'epic' | 'legendary' | 'mythic' | 'exotic';

/**
 * Điều Kiện Trao Đổi Hàng Chợ Đen (Barter)
 */
export interface BlackMarketBarterRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
  icon?: string;
}

/**
 * Schema Hàng Chợ Đen Ma Thị
 */
export interface BlackMarketItem extends MerchantShopItem {
  rarity: BlackMarketRarity;
  spawnRate: number;                     // Tỷ lệ xuất hiện (0.01 -> 1.0)
  isSmuggled?: boolean;                  // Hàng buôn lậu cấm kỵ (nguy cơ bị truy bắt)
  requiredKarma?: number;                // Yêu cầu điểm ma đạo / nghiệp duyên
  reputationRequired?: number;           // Yêu cầu danh vọng giang hồ
  barterRequirements?: BlackMarketBarterRequirement[]; // Vật phẩm đổi chác thay vì linh thạch
  riskLevel?: 'safe' | 'low' | 'high' | 'deadly';      // Mức độ rủi ro phản phệ
}

/**
 * Chủng Loại Vật Phẩm Thanh Lý
 */
export type RecycleItemType =
  | 'pill'
  | 'herb'
  | 'ore'
  | 'equipment'
  | 'manual'
  | 'storage'
  | 'talisman'
  | 'other';

/**
 * Schema Vật Phẩm Trong Túi Đủ Điều Kiện Thanh Lý / Thu Mua
 */
export interface RecycleItemEntry {
  id: string;
  name: string;
  type: RecycleItemType;
  quantity: number;
  unitRecyclePrice: number;              // Giá thu hồi 1 đơn vị (50% giá trị định giá)
  totalRecyclePrice: number;             // Tổng giá trị thu hồi (unitRecyclePrice * quantity)
  tier?: number;
  grade?: string;
  quality?: string;
  enhancement?: number;
  description?: string;
  rawItemRef?: unknown;                  // Tham chiếu nguyên bản trong túi đồ
}

/**
 * Chế Độ Giao Dịch Của Modal
 */
export type TradeModalMode = 'buy' | 'sell';

/**
 * Trạng Thái Modal Giao Dịch
 */
export interface TradeModalState<T = MerchantShopItem | BlackMarketItem | RecycleItemEntry> {
  isOpen: boolean;
  mode: TradeModalMode;
  item: T | null;
  quantity: number;
  maxQuantity: number;
  totalPrice: number;
  discountApplied?: number;
}

/**
 * Trạng Thái Phân Trang Bảng Hàng
 */
export interface MerchantPaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Trạng Thái Bộ Lọc Toàn Diện
 */
export interface MerchantFilterState {
  subTab: MerchantSubTab;
  category: MerchantFilterCategory;
  sortOption: MerchantSortOption;
  selectedTier: number | 'all';
  searchQuery: string;
  onlyAffordable?: boolean;
}

/**
 * Cấu Hình Hiển Thị Danh Mục Thương Hội
 */
export interface MerchantCategoryConfig {
  id: MerchantFilterCategory;
  label: string;
  icon: string;
  badgeColor: string;
  description: string;
}

/**
 * Cấu Hình Hối Đoái Tệ Điếm (1:1,000)
 */
export interface CurrencyExchangeConfig {
  fromCurrency: MerchantCurrency;
  toCurrency: MerchantCurrency;
  rate: number;                          // 1,000
  direction: 'up' | 'down';              // 'up': 1,000 Hạ -> 1 Trung; 'down': 1 Trung -> 1,000 Hạ
}
