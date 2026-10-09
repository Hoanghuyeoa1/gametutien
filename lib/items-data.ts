// lib/items-data.ts
// Danh mục vật phẩm toàn cục & Phụ trợ phá cảnh (Items Registry & Breakthrough Catalysts)
// 100% Strict TypeScript, Clean Architecture

import { BreakthroughPillConfig, BreakthroughTalismanConfig } from './types/breakthrough-catalyst';
import { BREAKTHROUGH_PILLS_CONFIG, BREAKTHROUGH_TALISMANS_CONFIG } from './breakthrough-catalyst-logic';

export interface GameItemDefinition {
  id: string;
  name: string;
  category: 'talisman' | 'consumable' | 'pill' | 'material' | 'equipment';
  type: string;
  grade?: string;
  quality?: string;
  icon: string;
  price: number;
  description: string;
  effectType?: string;
  powerValue?: number;
  targetRealmIndex?: number;
  baseSuccessRateBonus?: number;
  backlashReductionPercent?: number;
  isStackable?: boolean;
  maxStack?: number;
  [key: string]: any;
}

/**
 * Danh mục các vật phẩm Phù Chú & Trận Bàn Hộ Mạch phụ trợ phá cảnh
 */
export const BREAKTHROUGH_TALISMAN_ITEMS: Record<string, GameItemDefinition> = {
  item_tu_linh_tran_ban: {
    id: 'item_tu_linh_tran_ban',
    name: 'Tụ Linh Trận Bàn',
    category: 'talisman',
    type: 'talisman',
    grade: 'Tam Giai',
    quality: 'trung_pham',
    icon: '🌀',
    price: 5000,
    description: 'Khảm nạp khi đột phá giúp hội tụ thiên địa linh khí, giảm 40% Linh Thạch tiêu hao',
    effectType: 'reduce_spirit_stones',
    powerValue: 0.40,
    isStackable: true,
    maxStack: 99
  },
  item_ho_mach_phu: {
    id: 'item_ho_mach_phu',
    name: 'Hộ Mạch Phù',
    category: 'talisman',
    type: 'talisman',
    grade: 'Tứ Giai',
    quality: 'thuong_pham',
    icon: '🛡️',
    price: 8000,
    description: 'Phong tỏa đan điền, nếu đột phá thất bại sẽ bảo toàn 100% tính mạng và tu vi',
    effectType: 'prevent_backlash',
    powerValue: 1.0,
    isStackable: true,
    maxStack: 99
  },
  item_dinh_tam_phu: {
    id: 'item_dinh_tam_phu',
    name: 'Định Tâm Phù',
    category: 'talisman',
    type: 'talisman',
    grade: 'Tam Giai',
    quality: 'trung_pham',
    icon: '🧘',
    price: 6000,
    description: 'Thanh tẩy tâm ma, vô hiệu hóa ảnh hưởng tiêu cực của Đan Độc khi phá kén',
    effectType: 'cleanse_inner_demon',
    powerValue: 1.0,
    isStackable: true,
    maxStack: 99
  }
};

/**
 * Danh mục các loại Đan Dược Phá Cảnh tiêu chuẩn
 */
export const BREAKTHROUGH_PILL_ITEMS: Record<string, GameItemDefinition> = {
  item_boi_nguyen_dan: {
    id: 'item_boi_nguyen_dan',
    name: 'Bồi Nguyên Đan',
    category: 'pill',
    type: 'pill',
    grade: 'Nhất Phẩm',
    quality: 'ha_pham',
    icon: '💊',
    price: 500,
    description: 'Đan dược cơ bản củng cố nguyên khí, gia tăng 20% tỷ lệ đột phá cho tu sĩ Luyện Khí Kỳ.',
    targetRealmIndex: 1,
    baseSuccessRateBonus: 0.20,
    backlashReductionPercent: 20,
    isStackable: true,
    maxStack: 99
  },
  item_truc_co_dan: {
    id: 'item_truc_co_dan',
    name: 'Trúc Cơ Đan',
    category: 'pill',
    type: 'pill',
    grade: 'Nhị Phẩm',
    quality: 'trung_pham',
    icon: '💊',
    price: 2500,
    description: 'Thánh phẩm đan dược hộ mạch định thần, gia tăng 30% xác suất Trúc Cơ thành công.',
    targetRealmIndex: 11,
    baseSuccessRateBonus: 0.30,
    backlashReductionPercent: 30,
    isStackable: true,
    maxStack: 99
  },
  item_kim_dan_hoan: {
    id: 'item_kim_dan_hoan',
    name: 'Kim Đan Hoàn',
    category: 'pill',
    type: 'pill',
    grade: 'Tam Phẩm',
    quality: 'thuong_pham',
    icon: '💊',
    price: 10000,
    description: 'Ngưng kết cửu chuyển kim đan, gia tăng 25% tỷ lệ kết đan.',
    targetRealmIndex: 16,
    baseSuccessRateBonus: 0.25,
    backlashReductionPercent: 25,
    isStackable: true,
    maxStack: 99
  },
  item_hoa_anh_dan: {
    id: 'item_hoa_anh_dan',
    name: 'Hóa Anh Đan',
    category: 'pill',
    type: 'pill',
    grade: 'Tứ Phẩm',
    quality: 'thuong_pham',
    icon: '💊',
    price: 25000,
    description: 'Hỗ trợ phá toái kim đan, hóa sinh Nguyên Anh, gia tăng 30% tỷ lệ đột phá.',
    targetRealmIndex: 21,
    baseSuccessRateBonus: 0.30,
    backlashReductionPercent: 30,
    isStackable: true,
    maxStack: 99
  },
  item_hoa_than_dan: {
    id: 'item_hoa_than_dan',
    name: 'Hóa Thần Đan',
    category: 'pill',
    type: 'pill',
    grade: 'Ngũ Phẩm',
    quality: 'cuc_pham',
    icon: '💊',
    price: 50000,
    description: 'Khai mở thần thức hóa thần, gia tăng 35% xác suất đột phá Hóa Thần Kỳ.',
    targetRealmIndex: 26,
    baseSuccessRateBonus: 0.35,
    backlashReductionPercent: 40,
    isStackable: true,
    maxStack: 99
  }
};

/**
 * Tổng hợp toàn bộ danh mục vật phẩm hỗ trợ phá cảnh
 */
export const BREAKTHROUGH_ITEMS_REGISTRY: Record<string, GameItemDefinition> = {
  ...BREAKTHROUGH_TALISMAN_ITEMS,
  ...BREAKTHROUGH_PILL_ITEMS
};

/**
 * Tra cứu thông tin vật phẩm theo ID
 */
export function getGameItemById(itemId: string): GameItemDefinition | null {
  if (!itemId) return null;
  return BREAKTHROUGH_ITEMS_REGISTRY[itemId] || null;
}

/**
 * Kiểm tra xem một vật phẩm có phải là vật phẩm hỗ trợ phá cảnh hay không
 */
export function isBreakthroughCatalystItem(itemId: string): boolean {
  if (!itemId) return false;
  return Boolean(BREAKTHROUGH_ITEMS_REGISTRY[itemId]);
}
