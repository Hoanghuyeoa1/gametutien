// lib/merchant-data.ts
// Dữ liệu Vạn Bảo Thương Hội (Merchant Guild / Celestial Pavilion)

import { MerchantItem, MerchantState, PlayerStats, ItemQuality } from '@/lib/types';
import {
  getItemQualityMultiplier,
  formatMerchantPriceTier,
  calculateTotalEquivalentHaPham
} from '@/lib/item-quality-data';
import { TIER_PILLS_MERCHANT_ITEMS } from './pill-tier-data';
import { TIER_CULTIVATION_MERCHANT_ITEMS } from './cultivation-shop-data';
import { TIER_MANUALS_MERCHANT_ITEMS } from './manuals-shop-data';
import { TIER_DIVINE_MERCHANT_ITEMS } from './divine-abilities-data';
import { TIER_HERBS_MERCHANT_ITEMS } from './herbs-shop-data';
import { TIER_ORES_MERCHANT_ITEMS } from './ores-shop-data';
import { TIER_EQUIPMENT_MERCHANT_ITEMS } from './equipment-shop-data';
import { TIER_COMPANIONS_MERCHANT_ITEMS } from './companions-shop-data';
import { TIER_BEASTS_MERCHANT_ITEMS } from './beasts-shop-data';
import { TIER_STORAGE_MERCHANT_ITEMS } from './storage-shop-data';

export const REFRESH_MERCHANT_COST_LT = 50; // Chi phí làm mới lô hàng
export const AUTO_REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 phút tự động đổi hàng
export const DAILY_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 giờ tự động làm mới hàng ngày

export const GIAI_GRADE_NUMBERS: Record<string, number> = {
  'Phàm Cấp': 1,
  'Nhất Giai': 1,
  'Nhất Phẩm': 1,
  'Phàm Khí': 1,
  'Hạ Phẩm Linh Thảo': 1,
  'Nhị Giai': 2,
  'Nhị Phẩm': 2,
  'Linh Khí': 2,
  'Hạ Phẩm Linh Khí': 2,
  'Trung Phẩm Linh Thảo': 2,
  'Tam Giai': 3,
  'Tam Phẩm': 3,
  'Bảo Khí': 3,
  'Trung Phẩm Linh Khí': 3,
  'Thượng Phẩm Linh Thảo': 3,
  'Tứ Giai': 4,
  'Tứ Phẩm': 4,
  'Cổ Bảo': 4,
  'Thượng Phẩm Bảo Khí': 4,
  'Ngũ Giai': 5,
  'Ngũ Phẩm': 5,
  'Linh Bảo': 5,
  'Cực Phẩm Cổ Bảo': 5,
  'Tiên Thiên Linh Bảo': 5,
  'Lục Giai': 6,
  'Lục Phẩm': 6,
  'Thông Thiên Linh Bảo': 6,
  'Thất Giai': 7,
  'Thất Phẩm': 7,
  'Huyền Thiên Linh Bảo': 7,
  'Bát Giai': 8,
  'Bát Phẩm': 8,
  'Tiên Khí': 8,
  'Cửu Giai': 9,
  'Cửu Phẩm': 9,
  'Thần Binh': 9,
  'Thần Giai': 9,
  'Thần Phẩm': 9,
};

export function getGiaiNumber(grade?: string): number {
  if (!grade) return 1;
  const cleaned = grade.trim();
  if (GIAI_GRADE_NUMBERS[cleaned]) return GIAI_GRADE_NUMBERS[cleaned];
  for (const [key, val] of Object.entries(GIAI_GRADE_NUMBERS)) {
    if (cleaned.includes(key)) return val;
  }
  return 1;
}

// 1. Trọng số Giai Vị (Tier)
export const TIER_WEIGHT: Record<string, number> = {
  '1': 1, 'nhat_giai': 1, 'tier_1': 1,
  '2': 2, 'nhi_giai': 2, 'tier_2': 2,
  '3': 3, 'tam_giai': 3, 'tier_3': 3,
  '4': 4, 'tu_giai': 4, 'tier_4': 4,
  '5': 5, 'ngu_giai': 5, 'tier_5': 5,
  '6': 6, 'luc_giai': 6, 'tier_6': 6,
  '7': 7, 'that_giai': 7, 'tier_7': 7,
  '8': 8, 'bat_giai': 8, 'tier_8': 8,
  '9': 9, 'cuu_giai': 9, 'tier_9': 9,
};

// 2. Trọng số Phẩm Cấp (Grade / Quality / Rarity)
export const GRADE_WEIGHT: Record<string, number> = {
  // Cấp 1: Phàm / Hạ phẩm
  'pham': 1, 'ha': 1, 'ha_pham': 1, 'common': 1, 'white': 1,
  // Cấp 2: Trung phẩm
  'trung': 2, 'trung_pham': 2, 'uncommon': 2, 'green': 2,
  // Cấp 3: Thượng phẩm
  'thuong': 3, 'thuong_pham': 3, 'rare': 3, 'blue': 3,
  // Cấp 4: Cực phẩm
  'cuc': 4, 'cuc_pham': 4, 'epic': 4, 'purple': 4,
  // Cấp 5: Tuyệt phẩm / Hoàn mỹ
  'tuyet': 5, 'tuyet_pham': 5, 'legendary': 5, 'orange': 5,
  // Cấp 6: Chí Tôn / Cổ Bảo
  'chi_ton': 6, 'co_bao': 6,
  // Cấp 7: Tiên phẩm
  'tien': 7, 'tien_pham': 7, 'mythic': 7, 'red': 7,
  // Cấp 8: Thần phẩm / Hỗn Độn / Đế Khí
  'than': 8, 'than_pham': 8, 'hon_don': 9, 'de_khi': 10,
};

/**
 * Trích xuất trọng số Giai Vị (Tier 1 -> 9) từ MerchantItem
 */
export function getItemTierWeight(item: MerchantItem): number {
  if (!item) return 1;

  // 1. Trực tiếp từ item.tier
  if (typeof item.tier === 'number' && item.tier > 0) {
    return item.tier;
  }
  if (typeof (item as any).tier === 'string') {
    const rawKey = ((item as any).tier as string).toLowerCase().trim();
    if (TIER_WEIGHT[rawKey] !== undefined) return TIER_WEIGHT[rawKey];
    const match = rawKey.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // 2. Trích xuất từ equipmentData.tier hoặc companionTier
  if (item.equipmentData && typeof item.equipmentData.tier === 'number' && item.equipmentData.tier > 0) {
    return item.equipmentData.tier;
  }
  if (typeof item.companionTier === 'number' && item.companionTier > 0) {
    return item.companionTier;
  }
  if (item.companionData && typeof item.companionData.tier === 'number' && item.companionData.tier > 0) {
    return item.companionData.tier;
  }
  if (typeof item.beastTier === 'number' && item.beastTier > 0) {
    return item.beastTier;
  }
  if (item.beastData && typeof item.beastData.tier === 'number' && item.beastData.tier > 0) {
    return item.beastData.tier;
  }
  if (typeof item.storageTier === 'number' && item.storageTier > 0) {
    return item.storageTier;
  }
  if (item.storageData && typeof item.storageData.tier === 'number' && item.storageData.tier > 0) {
    return item.storageData.tier;
  }

  // 3. Trích xuất từ manualTier
  if (typeof item.manualTier === 'number' && item.manualTier > 0) {
    return item.manualTier;
  }
  if (typeof item.manualTier === 'string') {
    const rawKey = item.manualTier.toLowerCase().trim();
    if (TIER_WEIGHT[rawKey] !== undefined) return TIER_WEIGHT[rawKey];
    const match = rawKey.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // 4. Trích xuất từ grade thông qua GIAI_GRADE_NUMBERS hoặc getGiaiNumber
  if (item.grade) {
    const g = item.grade.trim();
    if (GIAI_GRADE_NUMBERS[g] !== undefined) {
      return GIAI_GRADE_NUMBERS[g];
    }
    const lowerG = g.toLowerCase();
    if (TIER_WEIGHT[lowerG] !== undefined) {
      return TIER_WEIGHT[lowerG];
    }
    const giai = getGiaiNumber(g);
    if (giai > 1) {
      return giai;
    }
  }

  // 5. Quét chuỗi ID, Tên, Mô tả tìm từ khóa Giai Vị
  const str = `${item.id || ''} ${item.name || ''} ${item.grade || ''}`.toLowerCase();

  const tierMatch = str.match(/(?:tier|giai)[_\s-]?([1-9])/);
  if (tierMatch && tierMatch[1]) {
    const val = parseInt(tierMatch[1], 10);
    if (val >= 1 && val <= 9) return val;
  }

  if (str.includes('cửu giai') || str.includes('cuu_giai') || str.includes('cuu giai') || str.includes('cửu phẩm') || str.includes('cuu pham')) return 9;
  if (str.includes('bát giai') || str.includes('bat_giai') || str.includes('bat giai') || str.includes('bát phẩm') || str.includes('bat pham')) return 8;
  if (str.includes('thất giai') || str.includes('that_giai') || str.includes('that giai') || str.includes('thất phẩm') || str.includes('that pham')) return 7;
  if (str.includes('lục giai') || str.includes('luc_giai') || str.includes('luc giai') || str.includes('lục phẩm') || str.includes('luc pham')) return 6;
  if (str.includes('ngũ giai') || str.includes('ngu_giai') || str.includes('ngu giai') || str.includes('ngũ phẩm') || str.includes('ngu pham')) return 5;
  if (str.includes('tứ giai') || str.includes('tu_giai') || str.includes('tu giai') || str.includes('tứ phẩm') || str.includes('tu pham')) return 4;
  if (str.includes('tam giai') || str.includes('tam_giai') || str.includes('tam giai') || str.includes('tam phẩm') || str.includes('tam pham')) return 3;
  if (str.includes('nhị giai') || str.includes('nhi_giai') || str.includes('nhi giai') || str.includes('nhị phẩm') || str.includes('nhi pham')) return 2;
  if (str.includes('nhất giai') || str.includes('nhat_giai') || str.includes('nhat giai') || str.includes('nhất phẩm') || str.includes('nhat pham')) return 1;

  // Check hậu tố số ở ID (ví dụ: m_pill_pha_canh_1)
  const idSuffixMatch = (item.id || '').match(/[_-]([1-9])$/);
  if (idSuffixMatch && idSuffixMatch[1]) {
    const val = parseInt(idSuffixMatch[1], 10);
    if (val >= 1 && val <= 9) return val;
  }

  return 1;
}

/**
 * Trích xuất trọng số Phẩm Cấp (Grade / Quality / Rarity) từ MerchantItem
 */
export function getItemGradeWeight(item: MerchantItem): number {
  if (!item) return 1;

  // 1. Trực tiếp từ item.quality
  if (item.quality) {
    const q = String(item.quality).toLowerCase().trim();
    if (GRADE_WEIGHT[q] !== undefined) return GRADE_WEIGHT[q];
    for (const [key, weight] of Object.entries(GRADE_WEIGHT)) {
      if (q === key || q.includes(key)) return weight;
    }
  }

  // 2. equipmentData.grade
  if (item.equipmentData?.grade) {
    const eg = String(item.equipmentData.grade).toLowerCase().trim();
    if (GRADE_WEIGHT[eg] !== undefined) return GRADE_WEIGHT[eg];
    for (const [key, weight] of Object.entries(GRADE_WEIGHT)) {
      if (eg.includes(key)) return weight;
    }
  }

  // 3. item.grade
  if (item.grade) {
    const g = String(item.grade).toLowerCase().trim();
    if (GRADE_WEIGHT[g] !== undefined) return GRADE_WEIGHT[g];
    if (g.includes('đế khí') || g.includes('de_khi')) return GRADE_WEIGHT['de_khi'];
    if (g.includes('hỗn độn') || g.includes('hon_don')) return GRADE_WEIGHT['hon_don'];
    if (g.includes('thần') || g.includes('than_pham') || g.includes('than')) return GRADE_WEIGHT['than_pham'];
    if (g.includes('tiên') || g.includes('tien_pham') || g.includes('tien')) return GRADE_WEIGHT['tien_pham'];
    if (g.includes('chí tôn') || g.includes('chi_ton') || g.includes('cổ bảo') || g.includes('co_bao')) return GRADE_WEIGHT['chi_ton'];
    if (g.includes('tuyệt') || g.includes('tuyet_pham') || g.includes('tuyet')) return GRADE_WEIGHT['tuyet_pham'];
    if (g.includes('cực') || g.includes('cuc_pham') || g.includes('cuc')) return GRADE_WEIGHT['cuc_pham'];
    if (g.includes('thượng') || g.includes('thuong_pham') || g.includes('thuong')) return GRADE_WEIGHT['thuong_pham'];
    if (g.includes('trung') || g.includes('trung_pham')) return GRADE_WEIGHT['trung_pham'];
    if (g.includes('hạ') || g.includes('ha_pham') || g.includes('phàm') || g.includes('pham')) return GRADE_WEIGHT['ha_pham'];
  }

  // 4. Quét ID và tên
  const nameId = `${item.id || ''} ${item.name || ''}`.toLowerCase();
  for (const [key, weight] of Object.entries(GRADE_WEIGHT)) {
    if (nameId.includes(key)) return weight;
  }

  return 1;
}

export const getGradeWeight = getItemGradeWeight;

/**
 * Hàm so sánh đa tầng (Deterministic Multi-Level Comparator):
 * Tiêu chí 1: Giai vị (Tier) thấp -> cao
 * Tiêu chí 2: Phẩm cấp (Grade / Quality) thấp -> cao
 * Tiêu chí 3: Giá bán (Price in Linh Thạch) thấp -> cao
 * Tiêu chí 4: Mã định danh (ID Determinism) cố định thứ tự
 */
export function compareMerchantItems(a: MerchantItem, b: MerchantItem): number {
  // Tiêu chí 1: Giai vị (Tier)
  const tierA = getItemTierWeight(a);
  const tierB = getItemTierWeight(b);
  if (tierA !== tierB) {
    return tierA - tierB;
  }

  // Tiêu chí 2: Phẩm cấp (Grade / Quality / Rarity)
  const gradeA = getItemGradeWeight(a);
  const gradeB = getItemGradeWeight(b);
  if (gradeA !== gradeB) {
    return gradeA - gradeB;
  }

  // Tiêu chí 3: Giá bán (Price in Linh Thạch)
  const priceA = typeof a.price === 'number' ? a.price : 0;
  const priceB = typeof b.price === 'number' ? b.price : 0;
  if (priceA !== priceB) {
    return priceA - priceB;
  }

  // Tiêu chí 4: Mã định danh (ID Determinism)
  return (a.id || '').localeCompare(b.id || '');
}

/**
 * Sắp xếp danh sách hàng hóa Thương Hội theo quy tắc chuẩn mực đa tầng
 */
export function sortMerchantItems(items: MerchantItem[]): MerchantItem[] {
  if (!Array.isArray(items)) return [];
  return [...items].sort(compareMerchantItems);
}

export type MerchantTierFilter = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function matchMerchantTier(item: MerchantItem, selectedTier: MerchantTierFilter): boolean {
  if (selectedTier === 'all') return true;
  const itemTier = getItemTierWeight(item);
  return itemTier === selectedTier;
}

export const MERCHANT_TIER_TABS: Array<{ tier: MerchantTierFilter; label: string; shortLabel: string; badgeColor: string }> = [
  { tier: 'all', label: '✨ Toàn Giai', shortLabel: 'Toàn Giai', badgeColor: 'text-amber-300 border-amber-600/40 bg-amber-950/30' },
  { tier: 1, label: 'Nhất Giai (Luyện Khí)', shortLabel: '1 Giai', badgeColor: 'text-stone-300 border-stone-600/40 bg-stone-900/40' },
  { tier: 2, label: 'Nhị Giai (Trúc Cơ)', shortLabel: '2 Giai', badgeColor: 'text-emerald-300 border-emerald-600/40 bg-emerald-950/40' },
  { tier: 3, label: 'Tam Giai (Kim Đan)', shortLabel: '3 Giai', badgeColor: 'text-sky-300 border-sky-600/40 bg-sky-950/40' },
  { tier: 4, label: 'Tứ Giai (Nguyên Anh)', shortLabel: '4 Giai', badgeColor: 'text-purple-300 border-purple-600/40 bg-purple-950/40' },
  { tier: 5, label: 'Ngũ Giai (Hóa Thần)', shortLabel: '5 Giai', badgeColor: 'text-amber-400 border-amber-500/50 bg-amber-950/50' },
  { tier: 6, label: 'Lục Giai (Luyện Hư)', shortLabel: '6 Giai', badgeColor: 'text-rose-400 border-rose-500/50 bg-rose-950/50' },
  { tier: 7, label: 'Thất Giai (Hợp Thể)', shortLabel: '7 Giai', badgeColor: 'text-red-400 border-red-500/50 bg-red-950/50' },
  { tier: 8, label: 'Bát Giai (Đại Thừa)', shortLabel: '8 Giai', badgeColor: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/50' },
  { tier: 9, label: 'Cửu Giai (Độ Kiếp / Tiên Nhân)', shortLabel: '9 Giai', badgeColor: 'text-yellow-300 border-yellow-400/60 bg-yellow-950/60' },
];

// Bảng giá gốc cơ sở theo Cấp Giai 1 -> 9 (Hạ Phẩm Linh Thạch)
export const BASE_PRICES_BY_GIAI: Record<number, { pill: number; equipment: number; herb: number; ore: number; manual: number; storage_bag: number }> = {
  1: { pill: 70, equipment: 200, herb: 30, ore: 40, manual: 400, storage_bag: 300 },
  2: { pill: 200, equipment: 700, herb: 80, ore: 100, manual: 1200, storage_bag: 800 },
  3: { pill: 650, equipment: 2500, herb: 220, ore: 280, manual: 4000, storage_bag: 2500 },
  4: { pill: 2400, equipment: 10000, herb: 650, ore: 800, manual: 15000, storage_bag: 8000 },
  5: { pill: 9000, equipment: 40000, herb: 2200, ore: 2800, manual: 60000, storage_bag: 25000 },
  6: { pill: 32000, equipment: 150000, herb: 7500, ore: 9500, manual: 250000, storage_bag: 80000 },
  7: { pill: 110000, equipment: 550000, herb: 25000, ore: 32000, manual: 1000000, storage_bag: 250000 },
  8: { pill: 400000, equipment: 2000000, herb: 90000, ore: 120000, manual: 4500000, storage_bag: 800000 },
  9: { pill: 1500000, equipment: 8000000, herb: 350000, ore: 450000, manual: 20000000, storage_bag: 2500000 },
};

/**
 * Công Thức Định Giá & Giá Trị Vật Phẩm Theo Giai & Phẩm Chất:
 * Giá Trị = Giá Gốc (theo Cấp Giai 1-9) * Hệ Số Phẩm Chất (Hạ Phẩm x1.0 -> Tiên Phẩm x10.0)
 */
export function calculateItemStandardValue(item: any, customItemType?: string): number {
  if (!item) return 10;
  let type = customItemType;
  if (!type) {
    if (item.slot || item.enhancement !== undefined || item.powerBonus) {
      type = 'equipment';
    } else if (item.itemType === 'storage_bag' || item.bagCapacity) {
      type = 'storage_bag';
    } else if (item.effectType || item.id?.startsWith('pill_') || item.type === 'pill' || item.itemType === 'pill') {
      type = 'pill';
    } else if (item.id?.startsWith('herb_') || item.type === 'herb' || item.itemType === 'herb') {
      type = 'herb';
    } else if (item.id?.startsWith('ore_') || item.type === 'ore' || item.itemType === 'ore') {
      type = 'ore';
    } else if (item.id?.startsWith('manual_') || item.type === 'manual' || item.itemType === 'manual') {
      type = 'manual';
    } else {
      type = 'herb';
    }
  }

  const giaiNum = Math.min(9, Math.max(1, getGiaiNumber(item.grade)));
  const table = BASE_PRICES_BY_GIAI[giaiNum] || BASE_PRICES_BY_GIAI[1];
  const basePrice = (table as any)[type] || table.herb || 50;

  // Hệ số phẩm chất (Hạ Phẩm x1.0 -> Tiên Phẩm x10.0)
  const qMult = getItemQualityMultiplier(item.quality || 'ha_pham');
  const enhanceBonus = type === 'equipment' && item.enhancement ? (1 + item.enhancement * 0.2) : 1;

  return Math.round(basePrice * qMult * enhanceBonus);
}

/**
 * Trừ linh thạch người chơi thông minh với cơ chế tự động quy đổi đa tầng:
 * Ưu tiên trừ Hạ Phẩm -> tự động phá lẻ Trung Phẩm -> Thượng Phẩm -> Cực Phẩm -> Tiên Tinh và trả lại tiền thối chính xác.
 */
export function deductEquivalentLinhThach(
  player: PlayerStats,
  costInHaPham: number
): { success: boolean; updatedPlayer: PlayerStats; deductedMessage: string } {
  let remainingCost = costInHaPham;
  const totalAvailable = calculateTotalEquivalentHaPham(player);
  if (totalAvailable < remainingCost) {
    return { success: false, updatedPlayer: player, deductedMessage: 'Không đủ linh thạch!' };
  }

  let ha = player.linhThach || 0;
  let trung = player.trungPhamLinhThach || 0;
  let thuong = player.thuongPhamLinhThach || 0;
  let cuc = player.cucPhamLinhThach || 0;
  let tien = Math.max(player.tienTinh || 0, player.tienPhamLinhThach || 0);

  if (ha >= remainingCost) {
    ha -= remainingCost;
    remainingCost = 0;
  } else {
    remainingCost -= ha;
    ha = 0;

    // Phá lẻ Trung Phẩm (1 Trung = 1,000 Ha)
    const trungNeeded = Math.ceil(remainingCost / 1000);
    if (trung >= trungNeeded) {
      trung -= trungNeeded;
      ha += (trungNeeded * 1000) - remainingCost;
      remainingCost = 0;
    } else {
      remainingCost -= trung * 1000;
      trung = 0;

      // Phá lẻ Thượng Phẩm (1 Thượng = 1,000,000 Ha)
      const thuongNeeded = Math.ceil(remainingCost / 1000000);
      if (thuong >= thuongNeeded) {
        thuong -= thuongNeeded;
        const changeInHa = (thuongNeeded * 1000000) - remainingCost;
        const changeTrung = Math.floor(changeInHa / 1000);
        const changeHa = changeInHa % 1000;
        trung += changeTrung;
        ha += changeHa;
        remainingCost = 0;
      } else {
        remainingCost -= thuong * 1000000;
        thuong = 0;

        // Phá lẻ Cực Phẩm (1 Cực = 1,000,000,000 Ha)
        const cucNeeded = Math.ceil(remainingCost / 1000000000);
        if (cuc >= cucNeeded) {
          cuc -= cucNeeded;
          const changeInHa = (cucNeeded * 1000000000) - remainingCost;
          const changeThuong = Math.floor(changeInHa / 1000000);
          const rem1 = changeInHa % 1000000;
          const changeTrung = Math.floor(rem1 / 1000);
          const changeHa = rem1 % 1000;
          thuong += changeThuong;
          trung += changeTrung;
          ha += changeHa;
          remainingCost = 0;
        } else {
          // Phá lẻ Tiên Tinh (1 Tiên = 1,000,000,000,000 Ha)
          remainingCost -= cuc * 1000000000;
          cuc = 0;
          const tienNeeded = Math.ceil(remainingCost / 1000000000000);
          tien = Math.max(0, tien - tienNeeded);
          const changeInHa = (tienNeeded * 1000000000000) - remainingCost;
          const changeCuc = Math.floor(changeInHa / 1000000000);
          const rem2 = changeInHa % 1000000000;
          const changeThuong = Math.floor(rem2 / 1000000);
          const rem3 = rem2 % 1000000;
          const changeTrung = Math.floor(rem3 / 1000);
          const changeHa = rem3 % 1000;
          cuc += changeCuc;
          thuong += changeThuong;
          trung += changeTrung;
          ha += changeHa;
          remainingCost = 0;
        }
      }
    }
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: ha,
    trungPhamLinhThach: trung,
    thuongPhamLinhThach: thuong,
    cucPhamLinhThach: cuc,
    tienTinh: tien,
    tienPhamLinhThach: tien
  };

  return {
    success: true,
    updatedPlayer,
    deductedMessage: `Đã thanh toán tương đương ${costInHaPham.toLocaleString()} Hạ Phẩm Linh Thạch (quy đổi tự động)!`
  };
}

/**
 * Khớp danh mục hàng hóa mượt mà hỗ trợ cả danh mục mới và các save cũ (backward compatibility)
 */
export function matchMerchantCategory(item: MerchantItem, selectedTab: string): boolean {
  if (selectedTab === 'all') return true;

  if (selectedTab === 'pills') {
    if (item.category === 'pills') return true;
    return (
      item.itemType === 'pill' ||
      item.type === 'pill' ||
      item.pillType !== undefined ||
      item.id.startsWith('m_pill_') ||
      item.id.startsWith('pill_') ||
      item.id.startsWith('dan_') ||
      item.id.includes('pha_canh') ||
      item.id.includes('tay_tuy') ||
      item.id.includes('cai_menh') ||
      item.id.includes('dinh_than') ||
      item.id.includes('khi_huyet') ||
      item.id.includes('tu_khi') ||
      item.id.includes('hoi_huyet') ||
      item.id.includes('ngo_dao_tra') ||
      item.id.includes('tich_coc') ||
      item.id.includes('duyen_tho')
    );
  }

  if (selectedTab === 'cultivation') {
    // Chắc chắn loại trừ đan dược
    const isPill =
      item.category === 'pills' ||
      item.itemType === 'pill' ||
      item.type === 'pill' ||
      item.pillType !== undefined ||
      item.id.startsWith('m_pill_') ||
      item.id.startsWith('pill_') ||
      item.id.startsWith('dan_') ||
      item.id.includes('pha_canh') ||
      item.id.includes('tay_tuy') ||
      item.id.includes('cai_menh') ||
      item.id.includes('dinh_than') ||
      item.id.includes('khi_huyet') ||
      item.id.includes('tu_khi') ||
      item.id.includes('hoi_huyet') ||
      item.id.includes('ngo_dao_tra') ||
      item.id.includes('tich_coc') ||
      item.id.includes('duyen_tho');
    if (isPill) return false;

    if (item.category === 'cultivation') return true;
    return (
      item.cultivationItemType !== undefined ||
      item.type === 'tinhHuyet' ||
      item.id.includes('tinh_huyet') ||
      item.id.includes('cult_') ||
      item.id.includes('ngung_than') ||
      item.id.includes('tu_linh') ||
      item.id.includes('bo_doan') ||
      item.id.includes('on_ngoc') ||
      item.id.includes('u_hon_thao')
    );
  }

  if (selectedTab === 'manuals') {
    if (item.category === 'manuals') return true;
    if (item.manualSlot === 'tam_phap' || item.manualSlot === 'the_thuat' || item.manualSlot === 'artisan') return true;
    if (item.category === 'skills' || item.manualSlot === 'than_thong' || item.manualSlot === 'than_phap') return false;
    return item.itemType === 'manual' || item.type === 'manual' || item.id.includes('manual_') || item.id.includes('book_');
  }

  if (selectedTab === 'skills' || selectedTab === 'divine') {
    if (item.category === 'skills' || item.category === 'divine') return true;
    if (item.divineAbility !== undefined || item.id.startsWith('div_')) return true;
    if (item.manualSlot === 'than_thong' || item.manualSlot === 'than_phap') return true;
    return false;
  }

  if (selectedTab === 'ores') {
    if (item.category === 'ores') return true;
    // backward-compat: ores cũ nằm trong 'materials'
    if (item.itemType === 'ore' && (item.category === 'materials' || !item.category)) return true;
    return false;
  }

  if (selectedTab === 'materials' || selectedTab === 'herbs') {
    if (item.category === 'materials' || item.category === 'herbs') return true;
    if (item.id.startsWith('herb_')) return true;
    if (item.herbCategory !== undefined || item.herbTier !== undefined) return true;
    // Không hiển thị ores nếu đã có tab riêng
    if (item.category === 'ores') return false;
    return item.itemType === 'herb' || item.itemType === 'seed';
  }

  if (selectedTab === 'equipment') {
    return item.category === 'equipment';
  }

  if (selectedTab === 'companions') {
    if (item.category === 'companions' || item.companionData !== undefined || item.id.startsWith('comp_t')) return true;
    if (item.category === 'companions_beasts') {
      return (
        item.id.includes('gift_') ||
        item.id.includes('dong_tam_ket') ||
        item.id.includes('uyen_uong') ||
        item.id.includes('huong_tui') ||
        item.companionItemType !== undefined
      ) && !item.id.includes('beast_') && !item.id.includes('toa_lien') && !item.id.includes('linh_noan');
    }
    return false;
  }

  if (selectedTab === 'beasts') {
    if (item.category === 'beasts' || item.beastData !== undefined || item.id.startsWith('beast_t')) return true;
    if (item.category === 'companions_beasts') {
      return (
        item.id.includes('beast_') ||
        item.id.includes('toa_lien') ||
        item.id.includes('linh_noan') ||
        item.id.includes('thu_giap') ||
        item.id.includes('thu_hon') ||
        item.beastItemType !== undefined
      );
    }
    return false;
  }

  // Legacy tab support
  if (selectedTab === 'companions_beasts') {
    return item.category === 'companions_beasts' || item.category === 'companions' || item.category === 'beasts';
  }

  if (selectedTab === 'storage' || selectedTab === 'inventory') {
    if (item.category === 'storage' || item.category === 'inventory') return true;
    if (item.storageData !== undefined || item.id.startsWith('stor_t')) return true;
    return item.itemType === 'storage_bag' || item.type === 'bag' || !!item.bagCapacity || item.id.includes('bag_');
  }

  // Legacy tab values
  if (selectedTab === 'basic') return item.category === 'basic';
  if (selectedTab === 'rare') return item.category === 'rare';
  if (selectedTab === 'auction') return item.category === 'auction';

  return item.category === selectedTab;
}

/**
 * Kiểm tra xem vật phẩm Thương Hội có phải là đồ độc bản mua 1 lần hay không
 * (Bao gồm Công pháp, Bí tịch, Sách bách nghệ, Đan kinh, Đan phương, Tín vật đặc thù)
 */
export function isOneTimeMerchantItem(item: MerchantItem): boolean {
  if (!item || !item.id) return false;
  if (item.oneTimeOnly || item.isOneTime) return true;
  if (item.category === 'manuals' || item.category === 'skills' || item.category === 'companions' || item.category === 'beasts') return true;
  if (item.companionData !== undefined || item.id.startsWith('comp_t')) return true;
  if (item.beastData !== undefined || item.id.startsWith('beast_t')) return true;
  if (item.storageData !== undefined || item.category === 'storage' || item.id.startsWith('stor_t')) return true;
  if (item.itemType === 'manual' || item.itemType === 'recipe') return true;
  if (item.manualSlot !== undefined) return true;
  if (item.data?.manualId || item.data?.unlockArtisan) return true;
  if (item.id.startsWith('m_manual_') || item.id.startsWith('m_book_')) return true;
  if (
    item.id === 'm_gift_dong_tam_ket' ||
    item.id === 'm_gift_uyen_uong_song_boi' ||
    item.id === 'm_gift_huong_tui_tinh_nong' ||
    item.id === 'm_beast_thu_phuc_toa_lien' ||
    item.id === 'm_eq_hon_don_khai_thien_dinh'
  ) return true;
  return false;
}

/**
 * Kiểm tra xem người chơi đã từng sở hữu hoặc mua vật phẩm độc bản này chưa
 */
export function isItemAlreadyPurchased(item: MerchantItem, player: PlayerStats): boolean {
  if (!isOneTimeMerchantItem(item)) return false;
  const purchasedIds = player.merchantState?.purchasedOneTimeIds || [];
  if (purchasedIds.includes(item.id)) return true;
  if (item.data?.manualId && purchasedIds.includes(item.data.manualId)) return true;

  if (Array.isArray(player.manuals)) {
    if (player.manuals.some(m => m.id === item.id || m.id === item.data?.manualId)) return true;
  }
  if (Array.isArray(player.inventory?.manuals)) {
    if (player.inventory.manuals.some(m => m.id === item.id || m.id === item.data?.manualId)) return true;
  }
  if (Array.isArray(player.inventory?.books)) {
    if (player.inventory.books.some(b => b.id === item.id || b.manualId === item.id || b.manualId === item.data?.manualId)) return true;
  }
  if (Array.isArray(player.learnedManuals)) {
    if (player.learnedManuals.includes(item.id) || (item.data?.manualId && player.learnedManuals.includes(item.data.manualId))) return true;
  }
  if (Array.isArray(player.manualsState?.learnedManualIds)) {
    if (player.manualsState.learnedManualIds.includes(item.id) || (item.data?.manualId && player.manualsState.learnedManualIds.includes(item.data.manualId))) return true;
  }
  if (Array.isArray(player.divineAbilitiesState?.learnedDivineIds)) {
    if (player.divineAbilitiesState.learnedDivineIds.includes(item.id) || (item.data?.id && player.divineAbilitiesState.learnedDivineIds.includes(item.data.id))) return true;
  }
  if (item.id === 'm_gift_dong_tam_ket' && (player.dongTamKet || (player.inventory?.equipments || []).some(e => e.name?.includes('Đồng Tâm Kết')))) return true;
  if (item.id === 'm_gift_uyen_uong_song_boi' && (player.uyenUongSongBoi || (player.inventory?.equipments || []).some(e => e.name?.includes('Uyên Ương Song Bội')))) return true;
  if (item.id === 'm_gift_huong_tui_tinh_nong' && (player.huongTuiTinhNong || (player.inventory?.equipments || []).some(e => e.name?.includes('Hương Túi Tình Nồng')))) return true;
  if (item.id === 'm_beast_thu_phuc_toa_lien' && (player.inventory?.equipments || []).some(e => e.name?.includes('Thu Phục Tỏa Liên'))) return true;
  if (item.id === 'm_eq_hon_don_khai_thien_dinh') {
    const hasInInv = (player.inventory?.equipments || []).some(e => e.name?.includes('Hỗn Độn Khai Thiên Đỉnh') || e.id?.includes('hon_don_khai_thien_dinh'));
    const isEquipped = (player.equippedItems?.artifact?.name?.includes('Hỗn Độn Khai Thiên Đỉnh') || player.equipment?.artifact?.name?.includes('Hỗn Độn Khai Thiên Đỉnh'));
    const isNatal = player.natalArtifact?.name?.includes('Hỗn Độn Khai Thiên Đỉnh') || (player.natalArtifact?.baseEquipment as any)?.name?.includes('Hỗn Độn Khai Thiên Đỉnh');
    if (hasInInv || isEquipped || isNatal) return true;
  }

  // Đạo Lữ Khế Ước: Kiểm tra nếu đã kết duyên hoặc sở hữu
  if (item.companionData || item.category === 'companions' || item.id.startsWith('comp_t')) {
    const compId = item.companionData?.id || item.id;
    if (purchasedIds.includes(compId)) return true;
    if (player.companionsState?.companions?.[compId]?.isBonded) return true;
    if ((player.companions as any)?.[compId]?.isBonded) return true;
    if (Array.isArray(player.companions) && (player.companions as any[]).some(c => c.id === compId && (c.isBonded || (c as any).affinity > 0))) return true;
  }

  // Linh Thú Khế Ước: Kiểm tra nếu đã thuần hóa hoặc sở hữu
  if (item.beastData || item.category === 'beasts' || item.id.startsWith('beast_t')) {
    const beastId = item.beastData?.id || item.id;
    if (purchasedIds.includes(beastId)) return true;
    if (player.beastsState?.ownedBeastIds?.includes(beastId)) return true;
    if (Array.isArray(player.beasts) && player.beasts.some(b => b.id === beastId)) return true;
    if (Array.isArray(player.spiritBeasts) && player.spiritBeasts.some(b => b.id === beastId)) return true;
  }

  // Pháp Bảo Trữ Vật: Kiểm tra nếu đã dung hợp / khai mở
  if (item.storageData || item.category === 'storage' || item.id.startsWith('stor_t')) {
    const storId = item.storageData?.id || item.id;
    if (purchasedIds.includes(storId)) return true;
    if (player.storageState?.unlockedStorageIds?.includes(storId)) return true;
  }

  return false;
}

export function createDefaultMerchantState(player?: PlayerStats): MerchantState {
  const now = Date.now();
  return {
    lastRefreshTime: now,
    lastDailyRefreshTime: now,
    refreshCountToday: 0,
    purchasedOneTimeIds: [],
    currentStock: {},
    items: generateMerchantInventory(player)
  };
}

/**
 * Sinh danh sách hàng hóa phong phú toàn diện cho Vạn Bảo Thương Hội:
 * Bao phủ 8 tầng phẩm cấp và Cấp Giai 1 -> 6 theo 5 nhóm tính năng cốt lõi.
 */
export function generateMerchantInventory(playerOrRealm?: any): MerchantItem[] {
  const player = typeof playerOrRealm === 'object' && playerOrRealm !== null ? (playerOrRealm as PlayerStats) : undefined;
  const playerRealm = player ? (player.currentRealm || 0) : (typeof playerOrRealm === 'number' ? playerOrRealm : 0);
  // =========================================================================
  // A1. NHÓM ĐAN DƯỢC (PILLS & ELIXIRS) - CATEGORY 'pills'
  // =========================================================================
  const pillItems: MerchantItem[] = [
    // 1. Cải Mệnh Đan (Tam Giai - Tuyệt Phẩm)
    {
      id: 'm_pill_cai_menh',
      name: 'Cải Mệnh Đan',
      category: 'pills',
      pillType: 'stat',
      quality: 'tuyet_pham',
      itemType: 'pill',
      grade: 'Tam Giai',
      price: 3500,
      stock: 3,
      maxStock: 3,
      description: 'Nghịch chuyển càn khôn, cho phép bói quẻ tái sinh gieo lại Thiên Cơ khi gặp quẻ Hung hoặc Đại Hung tại Bát Quái Thiên Đàn.',
      data: { pillId: 'pill_cai_menh', effectType: 'cai_menh' }
    },
    // 2. Tẩy Tủy Đan (Tứ Giai - Cực Phẩm)
    {
      id: 'm_pill_tay_tuy',
      name: 'Tẩy Tủy Đan',
      category: 'pills',
      pillType: 'stat',
      quality: 'cuc_pham',
      itemType: 'pill',
      grade: 'Tứ Giai',
      price: 7500,
      stock: 5,
      maxStock: 5,
      description: 'Tẩy trừ tạp chất nhục thân và kinh mạch, thanh lọc căn cốt, gia tăng vĩnh viễn tư chất cùng +800 Khí Huyết tối đa.',
      data: { pillId: 'pill_tay_tuy', effectType: 'permanent_stat', statTarget: 'hp', effectValue: 800 }
    },
    // 3. Ngộ Đạo Trà Vạn Năm (Ngũ Giai - Chí Tôn)
    {
      id: 'm_pill_ngo_dao_tra',
      name: 'Ngộ Đạo Trà Vạn Năm',
      category: 'pills',
      pillType: 'exp',
      quality: 'chi_ton',
      itemType: 'pill',
      grade: 'Ngũ Giai',
      price: 45000,
      stock: 2,
      maxStock: 2,
      description: 'Trà tiên ngưng tụ quy tắc thiên địa vạn năm, uống vào tăng 100% tốc độ tu luyện bế quan thổ nạp trong 24 giờ.',
      data: { pillId: 'pill_ngo_dao_tra', effectType: 'cultivate_buff', effectValue: 100 }
    },
    // 4. Phá Cảnh Đan (Nhất Giai -> Lục Giai)
    {
      id: 'm_pill_pha_canh_1',
      name: 'Luyện Khí Phá Cảnh Đan',
      category: 'pills',
      pillType: 'breakthrough',
      quality: 'thuong_pham',
      itemType: 'pill',
      grade: 'Nhất Giai',
      price: 250,
      stock: 15,
      maxStock: 15,
      description: 'Đan dược bồi bổ khí hải, tăng +30% tỉ lệ thành công khi trùng kích bình cảnh Luyện Khí viên mãn.',
      data: { pillId: 'pill_pha_canh_1', effectType: 'breakthrough_buff', effectValue: 30 }
    },
    {
      id: 'm_pill_pha_canh_2',
      name: 'Trúc Cơ Phá Cảnh Đan',
      category: 'pills',
      pillType: 'breakthrough',
      quality: 'cuc_pham',
      itemType: 'pill',
      grade: 'Nhị Giai',
      price: 1200,
      stock: 10,
      maxStock: 10,
      description: 'Đan dược trợ giúp đúc thành tiên thiên đạo cơ, tăng +25% tỉ lệ thành công khi đột phá đại cảnh giới Trúc Cơ.',
      data: { pillId: 'pill_pha_canh_2', effectType: 'breakthrough_buff', effectValue: 25 }
    },
    {
      id: 'm_pill_pha_canh_3',
      name: 'Kim Đan Phá Cảnh Đan',
      category: 'pills',
      pillType: 'breakthrough',
      quality: 'tuyet_pham',
      itemType: 'pill',
      grade: 'Tam Giai',
      price: 4500,
      stock: 6,
      maxStock: 6,
      description: 'Ngưng tụ cửu chuyển kim đan bất hủ, tăng +20% tỉ lệ đột phá Kim Đan Kỳ và bảo vệ đan điền khỏi phản phệ.',
      data: { pillId: 'pill_pha_canh_3', effectType: 'breakthrough_buff', effectValue: 20 }
    },
    {
      id: 'm_pill_pha_canh_4',
      name: 'Nguyên Anh Phá Cảnh Đan',
      category: 'pills',
      pillType: 'breakthrough',
      quality: 'chi_ton',
      itemType: 'pill',
      grade: 'Tứ Giai',
      price: 18000,
      stock: 4,
      maxStock: 4,
      description: 'Phá đan hóa anh, thai nghén thần hồn thành Nguyên Anh chân thân, tăng +20% tỉ lệ thành công trùng kích Nguyên Anh Kỳ.',
      data: { pillId: 'pill_pha_canh_4', effectType: 'breakthrough_buff', effectValue: 20 }
    },
    {
      id: 'm_pill_pha_canh_5',
      name: 'Hóa Thần Phá Cảnh Đan',
      category: 'pills',
      pillType: 'breakthrough',
      quality: 'than_pham',
      itemType: 'pill',
      grade: 'Ngũ Giai',
      price: 65000,
      stock: 2,
      maxStock: 2,
      description: 'Nguyên Thần xuất khiếu lĩnh ngộ pháp tắc thiên địa, tăng +20% tỉ lệ vượt qua đại kiếp nạn Hóa Thần Kỳ.',
      data: { pillId: 'pill_pha_canh_5', effectType: 'breakthrough_buff', effectValue: 20 }
    },
    {
      id: 'm_pill_pha_canh_6',
      name: 'Hợp Thể Phá Cảnh Đan',
      category: 'pills',
      pillType: 'breakthrough',
      quality: 'tien_pham',
      itemType: 'pill',
      grade: 'Lục Giai',
      price: 220000,
      stock: 1,
      maxStock: 1,
      description: 'Nhục thân và Nguyên Thần dung nhập thiên đạo, tăng vọt +25% xác suất đột phá bình cảnh Hợp Thể Kỳ.',
      data: { pillId: 'pill_pha_canh_6', effectType: 'breakthrough_buff', effectValue: 25 }
    },
    // 5. Khí Huyết Đan Cực Phẩm
    {
      id: 'm_pill_khi_huyet_cuc_pham',
      name: 'Khí Huyết Đan Cực Phẩm',
      category: 'pills',
      pillType: 'stat',
      quality: 'cuc_pham',
      itemType: 'pill',
      grade: 'Tứ Giai',
      price: 2800,
      stock: 8,
      maxStock: 8,
      description: 'Đan dược tinh luyện từ huyết tủy yêu thú viễn cổ, tăng vọt +5,000 điểm tiến độ Nhục Thân Thần Ma Tôi Thể!',
      data: { pillId: 'pill_khi_huyet_cuc_pham', effectType: 'physique_exp', effectValue: 5000 }
    },
    // 6. Định Thần Đan
    {
      id: 'm_pill_dinh_than',
      name: 'Định Thần Đan',
      category: 'pills',
      pillType: 'stat',
      quality: 'tuyet_pham',
      itemType: 'pill',
      grade: 'Tam Giai',
      price: 2400,
      stock: 6,
      maxStock: 6,
      description: 'Bồi bổ thần niệm, khai thông thức hải, tăng cường cảnh giới Thần Hồn và kháng 40% sát thương Tâm Ma.',
      data: { pillId: 'pill_dinh_than', effectType: 'soul_stat', effectValue: 40 }
    },
    // 7. Đan dược tiêu hao & Tu Vi
    {
      id: 'm_pill_hoi_huyet',
      name: 'Hồi Huyết Đan',
      category: 'pills',
      pillType: 'recovery',
      quality: 'trung_pham',
      itemType: 'pill',
      grade: 'Nhất Giai',
      price: 80,
      stock: 20,
      maxStock: 20,
      description: 'Đan dược cấp tốc hồi phục 100% Khí Huyết bị hao tổn trong giao tranh.',
      data: { pillId: 'pill_hoi_huyet' }
    },
    {
      id: 'm_pill_tu_khi',
      name: 'Tụ Khí Đan',
      category: 'pills',
      pillType: 'exp',
      quality: 'trung_pham',
      itemType: 'pill',
      grade: 'Nhất Giai',
      price: 120,
      stock: 20,
      maxStock: 20,
      description: 'Gia tăng 2,000 điểm Tu Vi ngay khi phục dụng.',
      data: { pillId: 'pill_tu_khi' }
    },
    {
      id: 'm_pill_quy_nguyen',
      name: 'Quy Nguyên Đan',
      category: 'pills',
      pillType: 'exp',
      quality: 'thuong_pham',
      itemType: 'pill',
      grade: 'Nhị Giai',
      price: 450,
      stock: 15,
      maxStock: 15,
      description: 'Đan dược cô đọng chân nguyên thiên địa, gia tăng lập tức 10,000 điểm Tu Vi khi phục dụng.',
      data: { pillId: 'pill_quy_nguyen', effectType: 'tu_vi_gain', effectValue: 10000 }
    },
    {
      id: 'm_pill_co_ban',
      name: 'Cố Bản Đan',
      category: 'pills',
      pillType: 'stat',
      quality: 'thuong_pham',
      itemType: 'pill',
      grade: 'Nhị Giai',
      price: 600,
      stock: 10,
      maxStock: 10,
      description: 'Cố bản bồi nguyên, củng cố căn cơ tu đạo, tăng vĩnh viễn +300 Khí Huyết tối đa và +150 Chân Nguyên tối đa.',
      data: { pillId: 'pill_co_ban', effectType: 'permanent_stat', effectValue: 300 }
    },
    {
      id: 'm_pill_tich_coc',
      name: 'Tích Cốc Đan',
      category: 'pills',
      pillType: 'lifespan',
      quality: 'ha_pham',
      itemType: 'pill',
      grade: 'Nhất Giai',
      price: 150,
      stock: 20,
      maxStock: 20,
      description: 'Thanh lọc phàm trần, bài trừ ngũ cốc chướng khí, bảo trì thân thể thanh tịnh và giảm tiêu hao thọ nguyên khi bế quan.',
      data: { pillId: 'pill_tich_coc', effectType: 'tich_coc' }
    },
    {
      id: 'm_pill_duyen_tho',
      name: 'Duyên Thọ Đan',
      category: 'pills',
      pillType: 'lifespan',
      quality: 'tuyet_pham',
      itemType: 'pill',
      grade: 'Tam Giai',
      price: 5000,
      stock: 3,
      maxStock: 3,
      description: 'Nghịch thiên cải mệnh bồi đắp nguyên khí, gia tăng trực tiếp +20 năm Thọ Nguyên tối đa cho tu sĩ.',
      data: { pillId: 'pill_duyen_tho', effectType: 'lifespan_gain', effectValue: 20 }
    }
  ];

  // =========================================================================
  // A2. NHÓM BẢO VẬT HỖ TRỢ TU LUYỆN (CULTIVATION RELICS & ESSENCES) - CATEGORY 'cultivation'
  // =========================================================================
  const cultivationItems: MerchantItem[] = [
    // 1. Ngưng Thần Hương (Nhị Giai - Thượng Phẩm)
    {
      id: 'm_cult_ngung_than_huong',
      name: 'Ngưng Thần Hương',
      category: 'cultivation',
      cultivationItemType: 'incense',
      quality: 'thuong_pham',
      grade: 'Nhị Giai',
      price: 450,
      stock: 5,
      maxStock: 5,
      description: 'Trầm hương tịnh tâm ngưng thần, thắp lên khi tĩnh tọa giúp tăng 15% hiệu quả thổ nạp, giảm 30% nguy cơ tâm ma quấy nhiễu trong 24 giờ.',
      data: { effectType: 'meditation_boost', effectValue: 15 }
    },
    // 2. Tụ Linh Châu (Tam Giai - Cực Phẩm)
    {
      id: 'm_cult_tu_linh_chau',
      name: 'Tụ Linh Châu',
      category: 'cultivation',
      cultivationItemType: 'relic',
      quality: 'cuc_pham',
      grade: 'Tam Giai',
      price: 3200,
      stock: 3,
      maxStock: 3,
      description: 'Bảo châu hấp thu linh khí nhật nguyệt, mang theo bên mình tăng vĩnh viễn +10% Tu Vi thu được khi bế quan thổ nạp.',
      data: { effectType: 'cultivate_boost', effectValue: 10 }
    },
    // 3. Bồ Đoàn Ngộ Đạo (Tứ Giai - Tuyệt Phẩm)
    {
      id: 'm_cult_bo_doan_ngo_dao',
      name: 'Bồ Đoàn Ngộ Đạo',
      category: 'cultivation',
      cultivationItemType: 'cushion',
      quality: 'tuyet_pham',
      grade: 'Tứ Giai',
      price: 12000,
      stock: 2,
      maxStock: 2,
      description: 'Bồ đoàn đan dệt từ cành Bồ Đề viễn cổ, ngồi lên bế quan giúp tâm cảnh sáng tỏ, gia tăng 20% tốc độ tu luyện toàn diện.',
      data: { effectType: 'cultivate_boost', effectValue: 20 }
    },
    // 4. Tụ Linh Trận Kỳ (Sơ Cấp & Trung Cấp)
    {
      id: 'm_cult_tu_linh_tran_ky_so',
      name: 'Tụ Linh Trận Kỳ (Sơ Cấp)',
      category: 'cultivation',
      cultivationItemType: 'array_flag',
      quality: 'ha_pham',
      grade: 'Nhất Giai',
      price: 300,
      stock: 8,
      maxStock: 8,
      description: 'Trận kỳ cắm quanh đạo tràng hoặc động phủ, dẫn linh khí phương viên trăm dặm đổ về, +8% tốc độ tu vi.',
      data: { effectType: 'array_boost', effectValue: 8 }
    },
    {
      id: 'm_cult_tu_linh_tran_ky_trung',
      name: 'Tụ Linh Trận Kỳ (Trung Cấp)',
      category: 'cultivation',
      cultivationItemType: 'array_flag',
      quality: 'thuong_pham',
      grade: 'Tam Giai',
      price: 2500,
      stock: 4,
      maxStock: 4,
      description: 'Trận kỳ khắc ấn tụ linh phù văn huyền ảo, tăng mật độ linh khí động phủ, +18% tốc độ tu luyện.',
      data: { effectType: 'array_boost', effectValue: 18 }
    },
    // 5. Ôn Ngọc Hàn Băng Sáp (Tứ Giai - Cực Phẩm)
    {
      id: 'm_cult_on_ngoc_han_bang_sap',
      name: 'Ôn Ngọc Hàn Băng Sáp',
      category: 'cultivation',
      cultivationItemType: 'relic',
      quality: 'cuc_pham',
      grade: 'Tứ Giai',
      price: 8500,
      stock: 2,
      maxStock: 2,
      description: 'Khối ngọc hàn băng sáp vạn năm tịnh hóa đan điền, xoa dịu kinh mạch nóng rát khi vận chuyển chu thiên, tăng 12% tốc độ hấp thu linh khí.',
      data: { effectType: 'cultivate_boost', effectValue: 12 }
    },
    // 6. Ngũ Hành Tụ Khí Đỉnh (Ngũ Giai - Chí Tôn)
    {
      id: 'm_cult_ngu_hanh_tu_khi_dinh',
      name: 'Ngũ Hành Tụ Khí Đỉnh',
      category: 'cultivation',
      cultivationItemType: 'spirit_vessel',
      quality: 'chi_ton',
      grade: 'Ngũ Giai',
      price: 35000,
      stock: 1,
      maxStock: 1,
      description: 'Dị bảo đỉnh đồng cổ ngưng tụ ngũ hành tinh hoa thiên địa, uẩn nhưỡng đan điền linh lực, tăng 25% tốc độ tu vi và giảm 20% linh thạch tiêu hao khi đột phá.',
      data: { effectType: 'cultivate_boost', effectValue: 25 }
    },
    // 7. Thể Tu: Tinh Huyết Yêu Thú 1 -> 5 Giai
    {
      id: 'm_tinh_huyet_1',
      name: 'Tinh Huyết Yêu Thú (Nhất Giai)',
      category: 'cultivation',
      quality: 'ha_pham',
      itemType: 'herb',
      type: 'tinhHuyet',
      grade: 'Nhất Giai',
      price: 90,
      stock: 30,
      maxStock: 30,
      description: 'Một giọt tinh huyết yêu thú sơ cấp, nguồn nguyên liệu cốt lõi bắt đầu Tôi Thể Nhục Thân.',
      data: { tinhHuyetCount: 1 }
    },
    {
      id: 'm_tinh_huyet_2',
      name: 'Tinh Huyết Ma Thú (Nhị Giai)',
      category: 'cultivation',
      quality: 'trung_pham',
      itemType: 'herb',
      type: 'tinhHuyet',
      grade: 'Nhị Giai',
      price: 250,
      stock: 20,
      maxStock: 20,
      description: 'Chứa 3 giọt tinh huyết ma thú hung hãn, gia tăng tốc độ tôi luyện cơ bắp gân cốt.',
      data: { tinhHuyetCount: 3 }
    },
    {
      id: 'm_tinh_huyet_3',
      name: 'Tinh Huyết Cuồng Thú (Tam Giai)',
      category: 'cultivation',
      quality: 'thuong_pham',
      itemType: 'herb',
      type: 'tinhHuyet',
      grade: 'Tam Giai',
      price: 680,
      stock: 12,
      maxStock: 12,
      description: 'Bình ngọc đựng 8 giọt tinh huyết cuồng thú bạo liệt, giải quyết triệt để nút thắt kẹt tiến độ Tôi Thể.',
      data: { tinhHuyetCount: 8 }
    },
    {
      id: 'm_tinh_huyet_4',
      name: 'Tinh Huyết Đại Yêu (Tứ Giai)',
      category: 'cultivation',
      quality: 'cuc_pham',
      itemType: 'herb',
      type: 'tinhHuyet',
      grade: 'Tứ Giai',
      price: 1800,
      stock: 8,
      maxStock: 8,
      description: 'Chứa 20 giọt tinh huyết của đầu lĩnh đại yêu thú ngàn năm, đúc thành Kim Cương Thiết Cốt.',
      data: { tinhHuyetCount: 20 }
    },
    {
      id: 'm_tinh_huyet_5',
      name: 'Tinh Huyết Thần Thú (Ngũ Giai)',
      category: 'cultivation',
      quality: 'tuyet_pham',
      itemType: 'herb',
      type: 'tinhHuyet',
      grade: 'Ngũ Giai',
      price: 5200,
      stock: 4,
      maxStock: 4,
      description: 'Chứa 50 giọt tinh huyết thuần khiết của Viễn Cổ Thần Thú, tái tạo nhục thân Thần Ma đỉnh phong!',
      data: { tinhHuyetCount: 50 }
    },
    // 8. Hồn Tu: U Hồn Thảo Ngàn Năm
    {
      id: 'm_herb_u_hon_thao',
      name: 'U Hồn Thảo Ngàn Năm',
      category: 'cultivation',
      quality: 'cuc_pham',
      itemType: 'herb',
      grade: 'Tứ Giai',
      price: 1800,
      stock: 10,
      maxStock: 10,
      description: 'Thảo dược sinh trưởng nơi u minh tăm tối, hấp thu ánh trăng ngàn năm, dùng bồi bổ và tăng cấp cảnh giới Thần Hồn.',
      data: { herbId: 'u_hon_thao' }
    }
  ];

  // =========================================================================
  // B. NHÓM CÔNG PHÁP & BÍ TỊCH (MANUALS & SKILLS)
  // =========================================================================
  const manualItems: MerchantItem[] = [
    // -----------------------------------------------------------------------
    // 1. NHÓM SƠ CƠ: NHẤT GIAI & NHỊ GIAI (Phàm Nhân & Luyện Khí 1 - 10)
    // Giá rẻ bình dân bằng Hạ Phẩm Linh Thạch (50 - 480 LT)
    // -----------------------------------------------------------------------
    {
      id: 'm_manual_dan_khi_quyet',
      name: 'Dẫn Khí Quyết',
      category: 'manuals',
      manualSlot: 'tam_phap',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhất Giai',
      price: 60,
      stock: 1,
      maxStock: 1,
      description: 'Khẩu quyết thổ nạp nhập môn của tán tu phàm trần, dẫn dắt linh khí đất trời vào kinh mạch. +10% Tu Vi/giây, +150 Chân Nguyên tối đa (Max MP).',
      data: { manualId: 'tp_dan_khi_quyet' },
      isOneTime: true
    },
    {
      id: 'm_manual_thiet_bo_sam_so_cap',
      name: 'Thiết Bố Sam (Sơ Cấp)',
      category: 'manuals',
      manualSlot: 'the_thuat',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhất Giai',
      price: 50,
      stock: 1,
      maxStock: 1,
      description: 'Ngạnh công giang hồ rèn da thịt như bọc sắt, chống đỡ đao kiếm thông thường. +40 Phòng Ngự, +250 Khí Huyết (HP).',
      data: { manualId: 'tt_thiet_bo_sam_so_cap' },
      isOneTime: true
    },
    {
      id: 'm_manual_toai_thach_quyen',
      name: 'Toái Thạch Quyền',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhất Giai',
      price: 55,
      stock: 1,
      maxStock: 1,
      description: 'Quyền kình tụ lực đập vỡ đá tảng, thế quyền nặng tựa bàn thạch. +80 Công Kích, +10 Phá Giáp phẳng.',
      data: { manualId: 'tt_toai_thach_quyen' },
      isOneTime: true
    },
    {
      id: 'm_manual_thao_thuong_phi',
      name: 'Thảo Thượng Phi',
      category: 'skills',
      manualSlot: 'than_phap',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhất Giai',
      price: 60,
      stock: 1,
      maxStock: 1,
      description: 'Thân pháp khinh công lướt nhẹ trên ngọn cỏ, tăng khả năng né tránh cạm bẫy. +15 Tốc Độ, +5% Né Tránh tự nhiên.',
      data: { manualId: 'tt_thao_thuong_phi' },
      isOneTime: true
    },
    {
      id: 'm_manual_canh_kim_quyet',
      name: 'Canh Kim Quyết',
      category: 'manuals',
      manualSlot: 'tam_phap',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhị Giai',
      price: 350,
      stock: 1,
      maxStock: 1,
      description: 'Tâm pháp thổ nạp dẫn Canh Kim chi khí tôi luyện đan điền, gia tăng sắc bén cho linh lực. +18% Tu Vi/giây, +10% Sát thương hệ Kim, +300 Max MP.',
      data: { manualId: 'tp_canh_kim_quyet' },
      isOneTime: true
    },
    {
      id: 'm_manual_truong_xuan_cong',
      name: 'Trường Xuân Công',
      category: 'manuals',
      manualSlot: 'tam_phap',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhị Giai',
      price: 380,
      stock: 1,
      maxStock: 1,
      description: 'Đạo pháp Mộc hệ dưỡng sinh cố bản, giúp kinh mạch thông suốt tuần hoàn. +20% Tu Vi/giây, tự hồi 1% Khí Huyết mỗi hiệp đấu, +250 Max MP.',
      data: { manualId: 'tp_truong_xuan_cong' },
      isOneTime: true
    },
    {
      id: 'm_manual_man_nguu_kinh',
      name: 'Man Ngưu Kình',
      category: 'manuals',
      manualSlot: 'the_thuat',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhị Giai',
      price: 400,
      stock: 1,
      maxStock: 1,
      description: 'Mô phỏng sức mạnh man ngưu rừng già, tôi luyện gân cốt phát lực ngàn cân. +10% Khí Huyết, +8% Phòng Ngự, +50 Công Kích.',
      data: { manualId: 'tt_man_nguu_kinh' },
      isOneTime: true
    },
    {
      id: 'm_manual_canh_kim_kiem_khi',
      name: 'Canh Kim Kiếm Khí',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhị Giai',
      price: 450,
      stock: 1,
      maxStock: 1,
      description: 'Ngưng tụ Canh Kim chi khí đầu ngón tay bắn ra kiếm khí sắc bén xé gió. +160 Công Kích, +15% Sát thương hệ Kim, +5% Bạo Kích.',
      data: { manualId: 'tt_canh_kim_kiem_khi' },
      isOneTime: true
    },
    {
      id: 'm_manual_du_long_bo',
      name: 'Du Long Bộ',
      category: 'skills',
      manualSlot: 'than_phap',
      quality: 'ha_pham',
      itemType: 'manual',
      grade: 'Nhị Giai',
      price: 480,
      stock: 1,
      maxStock: 1,
      description: 'Bộ pháp uyển chuyển như rồng lượn dưới nước, xuất quỷ nhập thần. +25 Tốc Độ, +8% Né Tránh tự nhiên, +10% Tỉ lệ kích hoạt Đòn Kép.',
      data: { manualId: 'tt_du_long_bo' },
      isOneTime: true
    },

    // -----------------------------------------------------------------------
    // 2. NHÓM TRUNG CƠ: TAM GIAI & TỨ GIAI (Trúc Cơ & Kim Đan)
    // Bổ sung các hệ Ngũ Hành & Dị Hệ (Băng, Lôi, Phong, Ám, Thần Thức)
    // -----------------------------------------------------------------------
    {
      id: 'm_manual_huyen_thuy_chan_kinh',
      name: 'Huyền Thủy Chân Kinh',
      category: 'manuals',
      manualSlot: 'tam_phap',
      quality: 'trung_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 5500,
      stock: 1,
      maxStock: 1,
      description: 'Tâm pháp như dòng nước lớn cuộn trào bất tận, Chân Nguyên kéo dài không dứt. +25% Tu Vi/giây, +800 Max MP, giảm 15% tiêu hao MP khi dùng kỹ năng.',
      data: { manualId: 'tp_huyen_thuy_chan_kinh' },
      isOneTime: true
    },
    {
      id: 'm_manual_bat_diet_ma_the',
      name: 'Bất Diệt Ma Thể',
      category: 'manuals',
      manualSlot: 'the_thuat',
      quality: 'trung_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 6800,
      stock: 1,
      maxStock: 1,
      description: 'Lấy tinh huyết hung thú tôi luyện gân mạch, thân thể đao thương bất nhập. +20% Khí Huyết, +15% Phòng Ngự, +3% Miễn Thương.',
      data: { manualId: 'tt_bat_diet_ma_the' },
      isOneTime: true
    },
    {
      id: 'm_manual_thai_at_huyen_bang',
      name: 'Thái Ất Huyền Băng Kiếm',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'trung_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 7200,
      stock: 1,
      maxStock: 1,
      description: 'Đóng băng vạn vật trong phạm vi mười trượng, kiếm ý rét buốt thấu xương. +380 Công Kích, +20% Băng hệ dmg, 25% tỷ lệ làm chậm đối thủ 20% Tốc Độ.',
      data: { manualId: 'tt_thai_at_huyen_bang' },
      isOneTime: true
    },
    {
      id: 'm_manual_dai_dia_liet_chan',
      name: 'Đại Địa Liệt Chấn',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'trung_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 7500,
      stock: 1,
      maxStock: 1,
      description: 'Dẫm nát địa mạch tạo sóng chấn động kinh hoàng, phá vỡ hộ giáp địch. +420 Công Kích, +25% Xuyên Giáp đối thủ.',
      data: { manualId: 'tt_dai_dia_liet_chan' },
      isOneTime: true
    },
    {
      id: 'm_manual_phong_loi_huyen_anh',
      name: 'Phong Lôi Huyễn Ảnh Dực',
      category: 'skills',
      manualSlot: 'than_phap',
      quality: 'trung_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 8000,
      stock: 1,
      maxStock: 1,
      description: 'Hóa linh lực thành đôi cánh phong lôi sau lưng, lướt đi trong chớp mắt. +40 Tốc Độ, +12% Né Tránh, +15% Tỉ lệ Đòn Kép.',
      data: { manualId: 'tt_phong_loi_huyen_anh' },
      isOneTime: true
    },
    {
      id: 'm_manual_cuu_u_minh_vuong',
      name: 'Cửu U Minh Vương Quyết',
      category: 'manuals',
      manualSlot: 'tam_phap',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 28000,
      stock: 1,
      maxStock: 1,
      description: 'Đạo pháp ma môn dẫn u minh sát khí ngưng đan, chuyển hóa sát thương thành tu vi. +30% Tu Vi/giây, +15% Hút Máu, nhưng -10 Tâm Cảnh.',
      data: { manualId: 'tp_cuu_u_minh_vuong' },
      isOneTime: true
    },
    {
      id: 'm_manual_hoa_long_bien',
      name: 'Hóa Long Biến',
      category: 'manuals',
      manualSlot: 'the_thuat',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 35000,
      stock: 1,
      maxStock: 1,
      description: 'Hấp thụ Chân Long khí tức mọc vảy rồng hộ thể, bạo phát long lực. +25% Khí Huyết, +18% Phòng Ngự, +200 Công Kích, +5% Kháng Bạo.',
      data: { manualId: 'tt_hoa_long_bien' },
      isOneTime: true
    },
    {
      id: 'm_manual_van_kiem_quy_tong_cuc_pham',
      name: 'Vạn Kiếm Quy Tông (Tứ Giai)',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 36000,
      stock: 1,
      maxStock: 1,
      description: 'Kiếm ý ngút trời dẫn động vạn thanh phi kiếm tề xuất, thế không thể cản. +750 Công Kích, +30% Sát thương hệ Kim, +15% Bạo Kích.',
      data: { manualId: 'tt_van_kiem_quy_tong_cuc_pham' },
      isOneTime: true
    },
    {
      id: 'm_manual_dinh_than_thuat',
      name: 'Định Thân Thuật',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 38000,
      stock: 1,
      maxStock: 1,
      description: 'Phóng xuất thần niệm vô hình khóa chặt thức hải đối phương, khiến địch tê liệt. +80 Thần Thức, 20% tỷ lệ khiến đối thủ mất lượt đánh đầu trận.',
      data: { manualId: 'tt_dinh_than_thuat' },
      isOneTime: true
    },

    // -----------------------------------------------------------------------
    // 3. NHÓM BÍ TRUYỀN BÁCH NGHỆ & PHỤ TRỢ TIÊN GIA (Ngự Thú, Linh Điền, Đạo Lữ, Mệnh Bàn)
    // -----------------------------------------------------------------------
    {
      id: 'm_manual_van_thu_ngu_linh',
      name: 'Vạn Thú Ngự Linh Kinh',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 9500,
      stock: 1,
      maxStock: 1,
      description: 'Bí truyền giao tiếp và thuần hóa thái cổ dị thú, tăng 30% kinh nghiệm nhận được cho Linh Thú xuất chiến và +15% chỉ số hỗ trợ nhân vật.',
      data: { manualId: 'tp_van_thu_ngu_linh' },
      isOneTime: true
    },
    {
      id: 'm_manual_than_nong_bach_thao',
      name: 'Thần Nông Bách Thảo Lục',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 9000,
      stock: 1,
      maxStock: 1,
      description: 'Tâm đắc dưỡng thảo của Thần Nông thị, rút ngắn 20% thời gian sinh trưởng của Linh Điền và +15% sản lượng thảo dược thu hoạch.',
      data: { manualId: 'tp_than_nong_bach_thao' },
      isOneTime: true
    },
    {
      id: 'm_manual_to_nu_huyen_kinh',
      name: 'Tố Nữ Huyền Kinh',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'tuyet_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 32000,
      stock: 1,
      maxStock: 1,
      description: 'Điển tịch song tu hợp hoan chính đạo, tăng thêm +25% hiệu quả Tu Vi và buff thuộc tính khi Song Tu cùng Đạo Lữ.',
      data: { manualId: 'tp_to_nu_huyen_kinh' },
      isOneTime: true
    },
    {
      id: 'm_manual_bat_quai_khai_thien',
      name: 'Bát Quái Khai Thiên Đồ',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 35000,
      stock: 1,
      maxStock: 1,
      description: 'Đồ phổ diễn giải quy luật bát quái càn khôn, tăng thêm +10% hiệu lực của mọi Tổ Hợp Mệnh Cách (Synergies) đang khảm nạp.',
      data: { manualId: 'tp_bat_quai_khai_thien' },
      isOneTime: true
    },

    // -----------------------------------------------------------------------
    // 4. NHÓM CAO GIAI: NGŨ GIAI (Thiên Giai)
    // -----------------------------------------------------------------------
    {
      id: 'm_manual_thai_so_cuu_kiep_loi',
      name: 'Thái Sơ Cửu Kiếp Lôi',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'tuyet_pham',
      itemType: 'manual',
      grade: 'Ngũ Giai',
      price: 210000,
      stock: 1,
      maxStock: 1,
      description: 'Dẫn lôi đình hỗn nguyên của thiên kiếp giáng thế, sát phạt vô song. +950 Công Kích, +35% Lôi hệ dmg, +25% Bạo Kích, bỏ qua 30% giáp đối thủ.',
      data: { manualId: 'tt_thai_so_cuu_kiep_loi' },
      isOneTime: true
    },

    // -----------------------------------------------------------------------
    // 5. CÁC BÍ TỊCH CỔ ĐIỂN HIỆN CÓ
    // -----------------------------------------------------------------------
    {
      id: 'm_manual_thai_at',
      name: 'Thái Ất Quy Nguyên Quyết',
      category: 'manuals',
      manualSlot: 'tam_phap',
      quality: 'tuyet_pham',
      itemType: 'manual',
      grade: 'Ngũ Giai',
      price: 75000,
      stock: 1,
      maxStock: 1,
      description: 'Thiên Phẩm Đạo Pháp quy nguyên cực ý. Lĩnh ngộ gia tăng +35% Tu Vi/giây và +600 Tối Đa Chân Nguyên (MP).',
      data: { manualId: 'manual_thai_at_quy_nguyen' },
      isOneTime: true
    },
    {
      id: 'm_manual_cuu_chuyen_kim_than',
      name: 'Cửu Chuyển Kim Thân Quyết',
      category: 'manuals',
      manualSlot: 'the_thuat',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 32000,
      stock: 1,
      maxStock: 1,
      description: 'Thể Tu Pháp Điển danh bất hư truyền, rèn luyện thân thể bất hoại kim thân, tăng +30% Phòng Ngự và +25% Khí Huyết.',
      data: { manualId: 'manual_cuu_chuyen_kim_than' },
      isOneTime: true
    },
    // Thần Thông Chiến Đấu
    {
      id: 'm_manual_bat_hoang_liet_hoa',
      name: 'Bát Hoang Liệt Hỏa Chưởng',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'thuong_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 8500,
      stock: 2,
      maxStock: 2,
      description: 'Chưởng pháp Hỏa hệ thiêu rụi bát hoang, bạo phát +450 Công Kích và +25% sát thương Hỏa hệ.',
      data: { manualId: 'manual_bat_hoang_hoa_chuong' },
      isOneTime: true
    },
    {
      id: 'm_manual_hu_khong_don',
      name: 'Hư Không Độn Thuật',
      category: 'skills',
      manualSlot: 'than_phap',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 22000,
      stock: 1,
      maxStock: 1,
      description: 'Thần thông thân pháp xé rách không gian, tăng vĩnh viễn +35 Tốc Độ (Speed) và +15% Tỉ Lệ Né Tránh đòn.',
      data: { manualId: 'manual_hu_khong_don' },
      isOneTime: true
    },
    {
      id: 'm_manual_than_niem_hoa_kiem',
      name: 'Thần Niệm Hóa Kiếm',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'tuyet_pham',
      itemType: 'manual',
      grade: 'Ngũ Giai',
      price: 58000,
      stock: 1,
      maxStock: 1,
      description: 'Vận dụng thần niệm vô hình ngưng tụ kiếm ý vô song xuyên thấu hộ thể giáp địch, tăng +800 Công Kích và +30% Sát Thương Bạo Kích.',
      data: { manualId: 'manual_than_niem_hoa_kiem' },
      isOneTime: true
    },
    // Khai Mở Bách Nghệ & Cổ Quyển
    {
      id: 'm_book_dan_kinh_tan_quyen',
      name: 'Thái Thượng Đan Kinh Tàn Quyển',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 1500,
      stock: 1,
      maxStock: 1,
      description: 'Bản khắc tàn phiến của Đan Đạo Viễn Cổ. Lĩnh ngộ lập tức Khai Mở Bách Nghệ: Luyện Đan Các!',
      data: { manualId: 'manual_dan_kinh_tan_quyen', unlockArtisan: 'alchemy' },
      isOneTime: true
    },
    {
      id: 'm_book_dan_kinh_trung',
      name: 'Đan Kinh Thượng Cổ - Quyển Trung',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 18000,
      stock: 1,
      maxStock: 1,
      description: 'Mật tịch đan đạo mở khóa toàn bộ đan phương Tứ Giai và Ngũ Giai (Kim Đan Đan & Nguyên Anh Đan).',
      data: { manualId: 'manual_dan_kinh_trung' },
      isOneTime: true
    },
    {
      id: 'm_book_dan_kinh_thuong',
      name: 'Đan Kinh Thượng Cổ - Quyển Thượng',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'tuyet_pham',
      itemType: 'manual',
      grade: 'Ngũ Giai',
      price: 65000,
      stock: 1,
      maxStock: 1,
      description: 'Bí truyền đan đạo chí cao vô thượng, mở khóa đan phương Thần Phẩm và Tiên Phẩm.',
      data: { manualId: 'manual_dan_kinh_thuong' },
      isOneTime: true
    },
    {
      id: 'm_book_duc_thuat',
      name: 'Bách Luyện Đúc Thuật',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tam Giai',
      price: 1500,
      stock: 1,
      maxStock: 1,
      description: 'Tâm đắc rèn binh của Luyện Khí Sư cổ đại. Lĩnh ngộ lập tức Khai Mở Bách Nghệ: Luyện Khí Phòng!',
      data: { manualId: 'manual_bach_luyen_duc_thuat', unlockArtisan: 'forging' },
      isOneTime: true
    },
    {
      id: 'm_book_thien_cong_duc_thuat',
      name: 'Thiên Công Đúc Thuật Tàn Thiên',
      category: 'manuals',
      manualSlot: 'artisan',
      quality: 'cuc_pham',
      itemType: 'manual',
      grade: 'Tứ Giai',
      price: 20000,
      stock: 1,
      maxStock: 1,
      description: 'Phương pháp rèn đúc Thần Binh viễn cổ, tăng +25% tỉ lệ rèn thành công Pháp Bảo Cổ Bảo và Thượng Phẩm.',
      data: { manualId: 'manual_thien_cong_duc_thuat' },
      isOneTime: true
    },
    {
      id: 'm_book_hon_don_khai_thien',
      name: 'Hỗn Độn Khai Thiên Quyết',
      category: 'skills',
      manualSlot: 'than_thong',
      quality: 'chi_ton',
      itemType: 'manual',
      grade: 'Thần Giai',
      price: 135000,
      stock: 1,
      maxStock: 1,
      description: 'Thần thông vô thượng diễn hóa từ Hỗn Độn sơ khai, uy lực hủy thiên diệt địa chấn nhiếp tam giới.',
      data: { manualId: 'manual_hon_don_quyet' },
      isOneTime: true
    }
  ];

  // =========================================================================
  // C. NHÓM ĐAN ĐẠO & LUYỆN KHÍ (MATERIALS - HERBS, ORES & SEEDS)
  // =========================================================================
  const materialItems: MerchantItem[] = [
    // Hạt giống biến dị
    {
      id: 'm_seed_cuu_diep_lien',
      name: 'Hạt Giống Cửu Diệp Linh Liên',
      category: 'materials',
      quality: 'thuong_pham',
      itemType: 'seed',
      grade: 'Tam Giai',
      price: 350,
      stock: 15,
      maxStock: 15,
      description: 'Hạt giống sen tiên chín lá biến dị, sinh trưởng 90 giây tại Linh Điền, thu hoạch hoa sen ngưng tụ tinh hoa ngũ hành.',
      data: { seedId: 'seed_cuu_diep_lien' }
    },
    {
      id: 'm_seed_hoa_than_diep',
      name: 'Hạt Giống Hóa Thần Linh Diệp',
      category: 'materials',
      quality: 'cuc_pham',
      itemType: 'seed',
      grade: 'Tứ Giai',
      price: 1200,
      stock: 8,
      maxStock: 8,
      description: 'Dược thảo biến dị sinh trưởng 180 giây, nguyên liệu hạt nhân không thể thiếu để luyện đan dược Hóa Thần.',
      data: { seedId: 'seed_hoa_than_diep' }
    },
    {
      id: 'm_seed_long_tuy_chi',
      name: 'Hạt Giống Long Tủy Chi',
      category: 'materials',
      quality: 'tuyet_pham',
      itemType: 'seed',
      grade: 'Ngũ Giai',
      price: 4500,
      stock: 5,
      maxStock: 5,
      description: 'Nấm linh chi sinh trưởng từ long mạch thái cổ, hấp thụ tinh khí rồng thần bồi bổ căn cơ vạn thế.',
      data: { seedId: 'seed_long_tuy_chi' }
    },
    {
      id: 'm_seed_bach_thao',
      name: 'Hạt Giống Bách Thảo',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'seed',
      grade: 'Nhất Giai',
      price: 20,
      stock: 30,
      maxStock: 30,
      description: 'Hạt giống linh thảo sinh trưởng 30 giây tại Động Phủ Linh Điền.',
      data: { seedId: 'seed_linh_thao' }
    },
    {
      id: 'm_seed_huyet_tinh',
      name: 'Hạt Giống Huyết Tinh',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'seed',
      grade: 'Nhị Giai',
      price: 45,
      stock: 20,
      maxStock: 20,
      description: 'Hạt giống đỏ tươi sinh trưởng 60 giây tại Động Phủ Linh Điền.',
      data: { seedId: 'seed_huyet_tinh_thao' }
    },
    // Thảo Dược
    {
      id: 'm_herb_linh_thao',
      name: 'Bách Thảo Sơ Thiên',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'herb',
      grade: 'Nhất Giai',
      price: 25,
      stock: 40,
      maxStock: 40,
      description: 'Linh thảo sơ cấp tươi tốt, nguyên liệu nấu hồi huyết đan căn bản.',
      data: { herbId: 'linh_thao' }
    },
    {
      id: 'm_herb_huyet_tinh',
      name: 'Huyết Tinh Thảo',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'herb',
      grade: 'Nhị Giai',
      price: 55,
      stock: 25,
      maxStock: 25,
      description: 'Cỏ đỏ thắm ngưng tụ huyết khí, dùng luyện Khí Huyết Đan và Tẩy Tủy Đan.',
      data: { herbId: 'huyet_tinh_thao' }
    },
    {
      id: 'm_herb_tu_khi',
      name: 'Tụ Khí Thanh Hoa',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'herb',
      grade: 'Nhị Giai',
      price: 75,
      stock: 20,
      maxStock: 20,
      description: 'Đóa hoa màu lam nhạt ngưng tụ chân khí trời đất.',
      data: { herbId: 'tu_khi_hoa' }
    },
    {
      id: 'm_herb_truc_co_chi_lan',
      name: 'Trúc Cơ Chi Lan',
      category: 'materials',
      quality: 'cuc_pham',
      itemType: 'herb',
      grade: 'Tam Giai',
      price: 480,
      stock: 8,
      maxStock: 8,
      description: 'Chi lan hiếm có, dược liệu hạt nhân luyện Trúc Cơ Đan.',
      data: { herbId: 'truc_co_chi_lan' }
    },
    {
      id: 'm_herb_cuu_diep_lien',
      name: 'Cửu Diệp Linh Liên',
      category: 'materials',
      quality: 'thuong_pham',
      itemType: 'herb',
      grade: 'Tam Giai',
      price: 420,
      stock: 10,
      maxStock: 10,
      description: 'Đóa sen chín cánh tỏa ánh hào quang, dùng tinh luyện đan dược tam giai thượng phẩm.',
      data: { herbId: 'cuu_diep_linh_lien' }
    },
    {
      id: 'm_herb_long_tuy_chi',
      name: 'Long Tủy Chi',
      category: 'materials',
      quality: 'tuyet_pham',
      itemType: 'herb',
      grade: 'Ngũ Giai',
      price: 3600,
      stock: 5,
      maxStock: 5,
      description: 'Nấm linh chi đỏ rực ngưng đọng long tủy, dùng luyện thần đan hộ thể.',
      data: { herbId: 'long_tuy_chi' }
    },
    // Khoáng Thạch & Kim Loại Hiếm
    {
      id: 'm_ore_thiet',
      name: 'Hắc Thiết Khoáng',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'ore',
      grade: 'Phàm Cấp',
      price: 35,
      stock: 30,
      maxStock: 30,
      description: 'Quặng sắt đen rắn chắc, vật liệu luyện khí căn bản.',
      data: { oreId: 'ore_iron' }
    },
    {
      id: 'm_ore_dong',
      name: 'Thanh Đồng Khoáng',
      category: 'materials',
      quality: 'trung_pham',
      itemType: 'ore',
      grade: 'Nhị Giai',
      price: 65,
      stock: 25,
      maxStock: 25,
      description: 'Đồng thiếc ngưng tụ linh khí, tăng độ dẻo dai cho binh khí.',
      data: { oreId: 'ore_copper' }
    },
    {
      id: 'm_ore_huyen_thiet',
      name: 'Huyền Thiết Tinh Thạch',
      category: 'materials',
      quality: 'thuong_pham',
      itemType: 'ore',
      grade: 'Tam Giai',
      price: 280,
      stock: 15,
      maxStock: 15,
      description: 'Khoáng thạch trân quý rèn tạo vũ khí và hộ giáp trung phẩm.',
      data: { oreId: 'ore_darksteel' }
    },
    {
      id: 'm_ore_huyen_thiet_ngan_nam',
      name: 'Huyền Thiết Ngàn Năm',
      category: 'materials',
      quality: 'cuc_pham',
      itemType: 'ore',
      grade: 'Tam Giai',
      price: 850,
      stock: 8,
      maxStock: 8,
      description: 'Quặng sắt đen trầm tích dưới đáy nham thạch ngàn năm, độ cứng vô song, kháng ma khí ăn mòn.',
      data: { oreId: 'ore_huyen_thiet_ngan_nam' }
    },
    {
      id: 'm_ore_tu_tinh',
      name: 'Tử Tinh Thạch',
      category: 'materials',
      quality: 'cuc_pham',
      itemType: 'ore',
      grade: 'Tứ Giai',
      price: 650,
      stock: 8,
      maxStock: 8,
      description: 'Tinh thể tím ẩn chứa không gian và lôi điện quy tắc viễn cổ.',
      data: { oreId: 'ore_amethyst' }
    },
    {
      id: 'm_ore_thai_co_tinh_thiet',
      name: 'Thái Cổ Tinh Thiết',
      category: 'materials',
      quality: 'tuyet_pham',
      itemType: 'ore',
      grade: 'Tứ Giai',
      price: 3600,
      stock: 5,
      maxStock: 5,
      description: 'Sắt tinh khai thác từ mảnh vỡ thiên thạch thời thái cổ, vật liệu rèn Cổ Bảo chấn phái.',
      data: { oreId: 'ore_thai_co_tinh_thiet' }
    },
    {
      id: 'm_ore_hu_khong_tinh_thach',
      name: 'Hư Không Tinh Thạch',
      category: 'materials',
      quality: 'chi_ton',
      itemType: 'ore',
      grade: 'Ngũ Giai',
      price: 15000,
      stock: 3,
      maxStock: 3,
      description: 'Đá không gian thần bí ngưng tụ từ vết rách hư không, tài nguyên tối thượng để đúc Tiên Khí và nhẫn giới chỉ.',
      data: { oreId: 'ore_hu_khong_tinh_thach' }
    }
  ];

  // =========================================================================
  // C2. NHÓM KHOÁNG THẠCH & TÀI LIỆU LUYỆN KHÍ (ORES) - CATEGORY 'ores'
  // Nhất Giai → Cửu Giai, phục vụ Thần Binh Các (ForgingTab)
  // =========================================================================
  const oreItems: MerchantItem[] = [
    // ── Nhất Giai ──
    {
      id: 'm_ore_hac_thiet_khoang',
      name: 'Hắc Thiết Khoáng',
      category: 'ores',
      quality: 'ha_pham',
      itemType: 'ore',
      grade: 'Nhất Giai',
      price: 40,
      stock: 40,
      maxStock: 40,
      description: 'Quặng sắt đen thô rắn chắc nhất Phàm Giới, vật liệu luyện khí căn bản nhất. Cất vào kho nguyên liệu Thần Binh Các.',
      data: { oreId: 'ore_iron' }
    },
    {
      id: 'm_ore_luc_dong_khoang',
      name: 'Lục Đồng Khoáng',
      category: 'ores',
      quality: 'trung_pham',
      itemType: 'ore',
      grade: 'Nhất Giai',
      price: 50,
      stock: 35,
      maxStock: 35,
      description: 'Đồng xanh ánh lục dẻo dai dễ rèn, tăng độ linh hoạt cho binh khí phổ thông.',
      data: { oreId: 'ore_copper_green' }
    },
    // ── Nhị Giai ──
    {
      id: 'm_ore_nhi_thanh_dong',
      name: 'Thanh Đồng Tinh',
      category: 'ores',
      quality: 'trung_pham',
      itemType: 'ore',
      grade: 'Nhị Giai',
      price: 100,
      stock: 28,
      maxStock: 28,
      description: 'Đồng thiếc ngưng tụ linh khí, pha trộn với sắt để tạo hợp kim bền hơn thép phổ thông.',
      data: { oreId: 'ore_copper' }
    },
    {
      id: 'm_ore_nhi_yin_kim',
      name: 'Âm Kim Tinh Thạch',
      category: 'ores',
      quality: 'thuong_pham',
      itemType: 'ore',
      grade: 'Nhị Giai',
      price: 160,
      stock: 20,
      maxStock: 20,
      description: 'Khoáng thạch chứa âm kim khí tẩm sương đêm, có thể khắc phù văn cơ bản lên bề mặt.',
      data: { oreId: 'ore_yin_kim' }
    },
    // ── Tam Giai ──
    {
      id: 'm_ore_tam_huyen_thiet',
      name: 'Huyền Thiết Tinh Thạch',
      category: 'ores',
      quality: 'thuong_pham',
      itemType: 'ore',
      grade: 'Tam Giai',
      price: 280,
      stock: 18,
      maxStock: 18,
      description: 'Khoáng thạch trân quý ngưng tụ trọng lực và sát khí, nguyên liệu rèn vũ khí và hộ giáp Trúc Cơ – Kim Đan.',
      data: { oreId: 'ore_darksteel' }
    },
    {
      id: 'm_ore_tam_huyen_thiet_ngan_nam',
      name: 'Huyền Thiết Ngàn Năm',
      category: 'ores',
      quality: 'cuc_pham',
      itemType: 'ore',
      grade: 'Tam Giai',
      price: 850,
      stock: 10,
      maxStock: 10,
      description: 'Quặng sắt đen trầm tích dưới đáy nham thạch ngàn năm, độ cứng vô song và kháng ma khí ăn mòn.',
      data: { oreId: 'ore_huyen_thiet_ngan_nam' }
    },
    // ── Tứ Giai ──
    {
      id: 'm_ore_tu_tu_tinh',
      name: 'Tử Tinh Thạch',
      category: 'ores',
      quality: 'cuc_pham',
      itemType: 'ore',
      grade: 'Tứ Giai',
      price: 800,
      stock: 10,
      maxStock: 10,
      description: 'Tinh thể tím chứa không gian và lôi điện quy tắc viễn cổ, dùng để rèn khí bảo trung phẩm và nhẫn giới.',
      data: { oreId: 'ore_amethyst' }
    },
    {
      id: 'm_ore_tu_thai_co_tinh_thiet',
      name: 'Thái Cổ Tinh Thiết',
      category: 'ores',
      quality: 'tuyet_pham',
      itemType: 'ore',
      grade: 'Tứ Giai',
      price: 3600,
      stock: 6,
      maxStock: 6,
      description: 'Sắt tinh khai thác từ mảnh vỡ thiên thạch thời thái cổ, vật liệu rèn Cổ Bảo chấn phái và bản mệnh pháp bảo.',
      data: { oreId: 'ore_thai_co_tinh_thiet' }
    },
    // ── Ngũ Giai ──
    {
      id: 'm_ore_ngu_hu_khong_tinh_thach',
      name: 'Hư Không Tinh Thạch',
      category: 'ores',
      quality: 'chi_ton',
      itemType: 'ore',
      grade: 'Ngũ Giai',
      price: 15000,
      stock: 4,
      maxStock: 4,
      description: 'Đá không gian thần bí ngưng tụ từ vết rách hư không, tài nguyên tối thượng rèn Tiên Khí và nhẫn giới chỉ độc bản.',
      data: { oreId: 'ore_hu_khong_tinh_thach' }
    },
    {
      id: 'm_ore_ngu_ngu_hanh_tinh_kim',
      name: 'Ngũ Hành Tinh Kim',
      category: 'ores',
      quality: 'tuyet_pham',
      itemType: 'ore',
      grade: 'Ngũ Giai',
      price: 9500,
      stock: 3,
      maxStock: 3,
      description: 'Kim loại tinh khiết chứa đủ tinh hoa ngũ hành thiên địa, rèn xong tự nhiên hấp thụ thuộc tính thiên phú của chủ nhân.',
      data: { oreId: 'ore_ngu_hanh_tinh_kim' }
    },
    // ── Lục Giai ──
    {
      id: 'm_ore_luc_thien_loi_cung_kim',
      name: 'Thiên Lôi Cung Kim',
      category: 'ores',
      quality: 'tien_pham',
      itemType: 'ore',
      grade: 'Lục Giai',
      price: 42000,
      stock: 2,
      maxStock: 2,
      description: 'Kim loại đặc biệt được sét thiên lôi viễn cổ tôi luyện qua ngàn đời, ngưng tụ điện lực Cửu Thiên, rèn ra binh khí mang Lôi Ôi tự nhiên.',
      data: { oreId: 'ore_thien_loi_cung_kim' }
    },
    {
      id: 'm_ore_luc_tuyet_han_bang_tinh',
      name: 'Tuyết Hàn Băng Tinh',
      category: 'ores',
      quality: 'tien_pham',
      itemType: 'ore',
      grade: 'Lục Giai',
      price: 38000,
      stock: 2,
      maxStock: 2,
      description: 'Tinh thể băng ngưng từ vực Cực Bắc Bất Hóa, nhiệt độ âm tuyệt đối ngưng kết thành hình, rèn binh khí mang Hàn Khí Phong Ấn.',
      data: { oreId: 'ore_tuyet_han_bang_tinh' }
    },
    // ── Thất Giai ──
    {
      id: 'm_ore_that_long_xuong_than_kim',
      name: 'Long Xương Thần Kim',
      category: 'ores',
      quality: 'than_pham',
      itemType: 'ore',
      grade: 'Thất Giai',
      price: 130000,
      stock: 1,
      maxStock: 1,
      description: 'Xương cốt hóa thạch của Viễn Cổ Thần Long sền sệt linh lực Long Uy, nung chảy thành kim loại rèn binh khí mang Long Uy tự động hóa quỷ.',
      data: { oreId: 'ore_long_xuong_than_kim' }
    },
    // ── Bát Giai ──
    {
      id: 'm_ore_bat_cuu_u_minh_thach',
      name: 'Cửu U Minh Thạch',
      category: 'ores',
      quality: 'than_pham',
      itemType: 'ore',
      grade: 'Bát Giai',
      price: 380000,
      stock: 1,
      maxStock: 1,
      description: 'Khoáng thạch khai thác từ đáy Địa Phủ U Minh, chứa khí Âm Minh vô tận, rèn Tiên Khí hấp thụ hồn phách địch thủ bại trận.',
      data: { oreId: 'ore_cuu_u_minh_thach' }
    },
    // ── Cửu Giai ──
    {
      id: 'm_ore_cuu_hon_don_than_thiet',
      name: 'Hỗn Độn Thần Thiết',
      category: 'ores',
      quality: 'than_pham',
      itemType: 'ore',
      grade: 'Cửu Giai',
      price: 1200000,
      stock: 1,
      maxStock: 1,
      description: 'Thần thiết hỗn độn từ thời khai thiên lập địa, đúc chứa Hỗn Nguyên Khí Tức — vật liệu duy nhất có thể rèn Thần Binh cấp độ Tam Giới!',
      data: { oreId: 'ore_hon_don_than_thiet' }
    }
  ];

  // =========================================================================
  // D. NHÓM ĐẠO LỮ (COMPANIONS - QUÀ TẶNG & TÍN VẬT ĐỊNH TÌNH / SONG TU)
  // =========================================================================
  const companionItems: MerchantItem[] = [
    // 1. Quà Tặng Độc Quyền 8 Đại Tiên Tử (+30 đến +35 Hảo Cảm)
    {
      id: 'm_gift_bang_tinh_ngoc_tram',
      name: 'Băng Tinh Ngọc Trâm',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'cuc_pham',
      itemType: 'equipment',
      grade: 'Tam Giai',
      price: 2500,
      stock: 2,
      maxStock: 2,
      description: 'Trâm cài Hàn Băng Tinh Thạch tinh xảo. Tặng riêng cho Lạc Thanh Tuyết tăng đột biến +30 Hảo Cảm!',
      data: { companionGift: 'companion_lac_thanh_tuyet', affinityBonus: 30 }
    },
    {
      id: 'm_gift_long_tuy_than_chi',
      name: 'Long Tủy Thần Chi',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'tuyet_pham',
      itemType: 'herb',
      grade: 'Tứ Giai',
      price: 4500,
      stock: 2,
      maxStock: 2,
      description: 'Chi thảo đáy biển sâu ngàn năm hấp thụ long khí thái cổ. Tặng riêng cho Long Thiền Nhi tăng đột biến +30 Hảo Cảm!',
      data: { companionGift: 'companion_long_thien_nhi', affinityBonus: 30 }
    },
    {
      id: 'm_gift_cuu_vi_linh_chau',
      name: 'Cửu Vĩ Linh Châu',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'tuyet_pham',
      itemType: 'equipment',
      grade: 'Tứ Giai',
      price: 4500,
      stock: 2,
      maxStock: 2,
      description: 'Linh châu yêu hồ huyễn hoặc lưu chuyển ánh sáng hồ quang. Tặng riêng cho Dạ Mộng Ly tăng đột biến +30 Hảo Cảm!',
      data: { companionGift: 'companion_da_mong_ly', affinityBonus: 30 }
    },
    {
      id: 'm_gift_co_kiem_tan_phien',
      name: 'Cổ Kiếm Tàn Phiến',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'tuyet_pham',
      itemType: 'ore',
      grade: 'Tứ Giai',
      price: 4500,
      stock: 2,
      maxStock: 2,
      description: 'Mảnh kiếm cổ thượng cổ ngưng tụ kiếm hồn bất khuất. Tặng riêng cho Kiếm Linh Tố Tâm tăng đột biến +30 Hảo Cảm!',
      data: { companionGift: 'companion_kiem_linh_to_tam', affinityBonus: 30 }
    },
    {
      id: 'm_gift_thanh_moc_linh_ho',
      name: 'Thanh Mộc Linh Hồ',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'cuc_pham',
      itemType: 'herb',
      grade: 'Tam Giai',
      price: 3000,
      stock: 2,
      maxStock: 2,
      description: 'Bầu hồ lô sinh cơ mộc linh dồi dào. Tặng riêng cho y sư Liễu Như Yên (Diệp Chỉ Hàm) tăng đột biến +30 Hảo Cảm!',
      data: { companionGift: 'companion_diep_chi_ham', companionGiftSecondary: 'companion_lieu_nhu_yen', affinityBonus: 30 }
    },
    {
      id: 'm_gift_that_thai_luu_ly_tram',
      name: 'Thất Thải Lưu Ly Trâm',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'cuc_pham',
      itemType: 'equipment',
      grade: 'Tam Giai',
      price: 2800,
      stock: 2,
      maxStock: 2,
      description: 'Trâm cài lưu ly phát quang thất sắc. Tặng riêng cho tiểu sư muội Sở Linh Nhi (Tần Vũ Mộng / Cơ Vô Diễm) tăng đột biến +30 Hảo Cảm!',
      data: { companionGift: 'companion_so_linh_nhi', companionGiftSecondary: 'companion_tan_vu_mong', affinityBonus: 30 }
    },
    {
      id: 'm_gift_huyen_am_phuong_boi',
      name: 'Huyền Âm Phượng Bội',
      category: 'companions',
      companionItemType: 'gift',
      quality: 'tuyet_pham',
      itemType: 'equipment',
      grade: 'Tứ Giai',
      price: 5000,
      stock: 2,
      maxStock: 2,
      description: 'Ngọc bội khắc hình thiên phượng chí âm. Tặng riêng cho cung chủ Nam Cung Uyển tăng đột biến +35 Hảo Cảm!',
      data: { companionGift: 'companion_nam_cung_uyen', affinityBonus: 35 }
    },
    // 2. Tín Vật Định Tình & Song Tu Độc Bản
    {
      id: 'm_gift_dong_tam_ket',
      name: 'Đồng Tâm Kết',
      category: 'companions',
      companionItemType: 'token',
      quality: 'cuc_pham',
      itemType: 'equipment',
      grade: 'Tứ Giai',
      price: 6000,
      stock: 1,
      maxStock: 1,
      isOneTime: true,
      description: 'Tơ hồng tiên gia kết nối linh hồn. Khi sở hữu, tăng gấp đôi (+100%) điểm hảo cảm mỗi lần Đàm Đạo.',
      data: { isDongTamKet: true }
    },
    {
      id: 'm_gift_uyen_uong_song_boi',
      name: 'Uyên Ương Song Bội',
      category: 'companions',
      companionItemType: 'token',
      quality: 'tuyet_pham',
      itemType: 'equipment',
      grade: 'Ngũ Giai',
      price: 18000,
      stock: 1,
      maxStock: 1,
      isOneTime: true,
      description: 'Cặp ngọc bội long phụng cộng hưởng. Khi sở hữu, tăng vĩnh viễn +30% Tu Vi thu được sau mỗi lần Thiên Địa Song Tu.',
      data: { isUyenUongSongBoi: true }
    },
    {
      id: 'm_gift_huong_tui_tinh_nong',
      name: 'Hương Túi Tình Nồng',
      category: 'companions',
      companionItemType: 'token',
      quality: 'thuong_pham',
      itemType: 'equipment',
      grade: 'Tam Giai',
      price: 4000,
      stock: 1,
      maxStock: 1,
      isOneTime: true,
      description: 'Túi hương ngát hương hoa ngàn năm, giảm 50% thời gian hồi chiêu giữa các lần tặng quà/đàm đạo.',
      data: { isHuongTuiTinhNong: true }
    }
  ];

  // =========================================================================
  // E. NHÓM LINH THÚ (BEASTS - THÚ LƯƠNG, NOÃN, NGỰ KHÍ, GIÁP, HUYẾT MẠCH)
  // =========================================================================
  const beastItems: MerchantItem[] = [
    // 1. Thú Lương / Linh Thú Đan (Nhất Giai -> Tứ Giai)
    {
      id: 'm_beast_pill_ha',
      name: 'Linh Thú Đan (Hạ Phẩm)',
      category: 'beasts',
      beastItemType: 'food',
      quality: 'trung_pham',
      itemType: 'pill',
      grade: 'Nhất Giai',
      price: 180,
      stock: 20,
      maxStock: 20,
      description: 'Đan dược sơ cấp, tăng +100 EXP tiến hóa cho linh thú.',
      data: { pillId: 'pill_beast_ha', isBeastPill: true, beastExp: 100 }
    },
    {
      id: 'm_beast_pill_trung',
      name: 'Linh Thú Đan (Trung Phẩm)',
      category: 'beasts',
      beastItemType: 'food',
      quality: 'cuc_pham',
      itemType: 'pill',
      grade: 'Nhị Giai',
      price: 650,
      stock: 12,
      maxStock: 12,
      description: 'Đan dược cô đọng linh thảo, tăng +350 EXP tiến hóa.',
      data: { pillId: 'pill_beast_trung', isBeastPill: true, beastExp: 350 }
    },
    {
      id: 'm_beast_pill_thuong',
      name: 'Linh Thú Đan (Thượng Phẩm)',
      category: 'beasts',
      beastItemType: 'food',
      quality: 'tuyet_pham',
      itemType: 'pill',
      grade: 'Tam Giai',
      price: 2200,
      stock: 6,
      maxStock: 6,
      description: 'Tinh luyện từ huyết tủy yêu vương, tăng +1,200 EXP tiến hóa.',
      data: { pillId: 'pill_beast_thuong', isBeastPill: true, beastExp: 1200 }
    },
    {
      id: 'm_beast_pill_cuc',
      name: 'Linh Thú Đan (Cực Phẩm)',
      category: 'beasts',
      beastItemType: 'food',
      quality: 'chi_ton',
      itemType: 'pill',
      grade: 'Tứ Giai',
      price: 6500,
      stock: 4,
      maxStock: 4,
      description: 'Tinh hoa kim đan thú hoàng, tăng vọt +3,500 EXP tiến hóa.',
      data: { pillId: 'pill_beast_cuc', isBeastPill: true, beastExp: 3500 }
    },
    {
      id: 'm_beast_thu_hon_thao',
      name: 'Thú Hồn Thảo',
      category: 'beasts',
      beastItemType: 'food',
      quality: 'ha_pham',
      itemType: 'herb',
      grade: 'Nhị Giai',
      price: 450,
      stock: 15,
      maxStock: 15,
      description: 'Thảo dược thơm dịu mà linh thú cực kỳ yêu thích, tăng ngay +20 Độ Trung Thành và hồi phục thể lực linh thú.',
      data: { herbId: 'herb_thu_hon_thao', isBeastHerb: true, beastLoyalty: 20 }
    },
    // 2. Ngự Khí & Tỏa Liên Thuần Phục
    {
      id: 'm_beast_thu_phuc_toa_lien',
      name: 'Thu Phục Tỏa Liên',
      category: 'beasts',
      beastItemType: 'tool',
      quality: 'thuong_pham',
      itemType: 'equipment',
      grade: 'Tam Giai',
      price: 3500,
      stock: 1,
      maxStock: 1,
      isOneTime: true,
      description: 'Pháp bảo xích sắt phong linh, tăng 30% tỷ lệ bắt giữ và thuần phục linh thú khi đi Bí Cảnh Roguelite.',
      data: {
        equipment: {
          id: 'eq_thu_phuc_toa_lien',
          name: 'Thu Phục Tỏa Liên',
          slot: 'artifact',
          grade: 'Tam Giai',
          enhancement: 0,
          powerBonus: 350,
          hpBonus: 1000,
          mpBonus: 500,
          description: 'Linh xích tỏa liên tăng tỉ lệ bắt thú trong bí cảnh.'
        }
      }
    },
    // 3. Trứng Linh Noãn
    {
      id: 'm_beast_linh_noan_than_bi',
      name: 'Linh Noãn Thần Bí',
      category: 'beasts',
      beastItemType: 'egg',
      quality: 'tuyet_pham',
      itemType: 'equipment',
      grade: 'Tứ Giai',
      price: 12000,
      stock: 2,
      maxStock: 2,
      description: 'Trứng thú phong ấn trong linh thạch cổ, ấp nở ngẫu nhiên ra linh thú phẩm cấp cao.',
      data: { isBeastEgg: true }
    },
    {
      id: 'm_beast_hoa_long_noan',
      name: 'Hóa Long Noãn',
      category: 'beasts',
      beastItemType: 'egg',
      quality: 'tuyet_pham',
      itemType: 'equipment',
      grade: 'Ngũ Giai',
      price: 25000,
      stock: 1,
      maxStock: 1,
      description: 'Trứng giao long viễn cổ mang long văn kim sắc, ấp nở chắc chắn ra Giao Long hoặc Huyền Lôi Dị Thú.',
      data: { isBeastEgg: true, eggKey: 'egg_thai_co' }
    },
    // 4. Huyết Mạch & Thú Giáp
    {
      id: 'm_beast_huyet_mach_than_dan',
      name: 'Huyết Mạch Thần Đan',
      category: 'beasts',
      beastItemType: 'evolution',
      quality: 'cuc_pham',
      itemType: 'pill',
      grade: 'Tứ Giai',
      price: 8500,
      stock: 3,
      maxStock: 3,
      description: 'Đan dược kích thích thức tỉnh huyết mạch tổ tiên, tăng vĩnh viễn 15% chỉ số Công/Thủ của linh thú xuất chiến.',
      data: { pillId: 'pill_huyet_mach_than_dan', isBeastEvolution: true, statBonusPercent: 15 }
    },
    {
      id: 'm_beast_huyen_thiet_thu_giap',
      name: 'Huyền Thiết Thú Giáp',
      category: 'beasts',
      beastItemType: 'armor',
      quality: 'thuong_pham',
      itemType: 'equipment',
      grade: 'Tam Giai',
      price: 4200,
      stock: 2,
      maxStock: 2,
      description: 'Chiến giáp rèn từ huyền thiết đúc riêng cho linh thú đỡ đòn, tăng +300 Khí Huyết và +50 Phòng Ngự khi lâm trận.',
      data: {
        equipment: {
          id: 'eq_beast_huyen_thiet_giap',
          name: 'Huyền Thiết Thú Giáp',
          slot: 'armor',
          grade: 'Tam Giai',
          enhancement: 0,
          powerBonus: 350,
          hpBonus: 300,
          defBonus: 50,
          description: 'Chiến giáp rèn từ huyền thiết đúc riêng cho linh thú đỡ đòn, tăng +300 Khí Huyết và +50 Phòng Ngự khi lâm trận.'
        }
      }
    }
  ];

  // =========================================================================
  // F. NHÓM TÚI ĐỒ & TRỮ VẬT (INVENTORY EXPANSION & BAGS)
  // =========================================================================
  const storageItems: MerchantItem[] = [
    {
      id: 'm_bag_so_cap',
      name: 'Sơ Cấp Trữ Vật Đại',
      category: 'storage',
      quality: 'trung_pham',
      itemType: 'storage_bag',
      grade: 'Hạ Phẩm Linh Khí',
      price: 800,
      stock: 1,
      maxStock: 1,
      bagCapacity: 35,
      description: 'Túi gấm thêu phù văn không gian sơ cấp, mở rộng dung lượng túi đồ lên 35 ô vật phẩm.',
      data: { bagId: 'bag_so_cap', maxSlots: 35 }
    },
    {
      id: 'm_bag_huyen_thiet',
      name: 'Huyền Thiết Giới Chỉ',
      category: 'storage',
      quality: 'thuong_pham',
      itemType: 'storage_bag',
      grade: 'Trung Phẩm Linh Khí',
      price: 2500,
      stock: 1,
      maxStock: 1,
      bagCapacity: 55,
      description: 'Nhẫn không gian đúc từ Huyền Thiết ngàn năm, mở rộng dung lượng túi đồ lên 55 ô vật phẩm.',
      data: { bagId: 'bag_huyen_thiet', maxSlots: 55 }
    },
    {
      id: 'm_bag_tu_di',
      name: 'Tu Di Giới Chỉ',
      category: 'storage',
      quality: 'cuc_pham',
      itemType: 'storage_bag',
      grade: 'Thượng Phẩm Bảo Khí',
      price: 8000,
      stock: 1,
      maxStock: 1,
      bagCapacity: 85,
      description: 'Pháp thuật Nạp Tu Di vu Giới Tử, nới rộng không gian túi đồ lên 85 ô dung lượng.',
      data: { bagId: 'bag_tu_di', maxSlots: 85 }
    },
    {
      id: 'm_bag_can_khon',
      name: 'Túi Càn Khôn Thượng Phẩm',
      category: 'storage',
      quality: 'tuyet_pham',
      itemType: 'storage_bag',
      grade: 'Tứ Giai',
      price: 22000,
      stock: 1,
      maxStock: 1,
      bagCapacity: 150,
      description: 'Bảo vật càn khôn thâu tóm nhật nguyệt, mở rộng sức chứa túi đồ lên 150 ô cực lớn.',
      data: { bagId: 'bag_can_khon', maxSlots: 150 }
    },
    {
      id: 'm_bag_hu_khong',
      name: 'Hư Không Giới Chỉ',
      category: 'storage',
      quality: 'chi_ton',
      itemType: 'storage_bag',
      grade: 'Ngũ Giai',
      price: 65000,
      stock: 1,
      maxStock: 1,
      bagCapacity: 300,
      description: 'Phong ấn một góc hư không độc lập của cổ giới, dung lượng túi đồ mở rộng lên 300 ô.',
      data: { bagId: 'bag_hu_khong', maxSlots: 300 }
    },
    {
      id: 'm_bag_hon_don_dong_thien',
      name: 'Hỗn Độn Động Thiên Châu',
      category: 'storage',
      quality: 'than_pham',
      itemType: 'storage_bag',
      grade: 'Lục Giai',
      price: 250000,
      stock: 1,
      maxStock: 1,
      bagCapacity: 9999,
      description: 'Chí bảo động thiên từ thời sơ khai vũ trụ, mở khóa sức chứa túi vô hạn (Vô hạn ô chứa đồ)!',
      data: { bagId: 'bag_hon_don_dong_thien', maxSlots: 9999 }
    }
  ];

  // =========================================================================
  // F. NHÓM PHÁP BẢO & TRANG BỊ (EQUIPMENT & ARTIFACTS)
  // =========================================================================
  const equipmentItems: MerchantItem[] = [
    // 1. Nhất Giai (Luyện Khí Kỳ | 500 – 1,500 LT)
    {
      id: 'm_eq_thanh_phong_kiem',
      name: 'Thanh Phong Kiếm',
      category: 'equipment',
      equipmentType: 'weapon',
      quality: 'ha_pham',
      grade: 'Nhất Giai',
      itemType: 'equipment',
      price: 800,
      stock: 5,
      maxStock: 5,
      description: 'Thanh kiếm đúc từ phong đồng sơ cấp, lưỡi kiếm sắc bén nhẹ như gió thoảng.',
      equipmentData: {
        type: 'weapon',
        slot: 'weapon',
        tier: 1,
        grade: 'Nhất Giai',
        baseStats: { atk: 25, speed: 3 },
        sockets: 1
      }
    },
    {
      id: 'm_eq_huyen_thiet_dao_bao',
      name: 'Huyền Thiết Đạo Bào',
      category: 'equipment',
      equipmentType: 'armor',
      quality: 'ha_pham',
      grade: 'Nhất Giai',
      itemType: 'equipment',
      price: 950,
      stock: 5,
      maxStock: 5,
      description: 'Đạo bào dệt xen kẽ tơ huyền thiết ngàn năm, hộ thân vững chãi trước đao thương.',
      equipmentData: {
        type: 'armor',
        slot: 'armor',
        tier: 1,
        grade: 'Nhất Giai',
        baseStats: { hp: 150, def: 15 },
        sockets: 1
      }
    },
    {
      id: 'm_eq_thanh_ngoc_gioi_chi',
      name: 'Thanh Ngọc Giới Chỉ',
      category: 'equipment',
      equipmentType: 'accessory',
      quality: 'trung_pham',
      grade: 'Nhất Giai',
      itemType: 'equipment',
      price: 1200,
      stock: 4,
      maxStock: 4,
      description: 'Chiếc nhẫn mài từ thanh ngọc ôn nhuận, ôn dưỡng thức hải và đan điền.',
      equipmentData: {
        type: 'accessory',
        slot: 'ring',
        tier: 1,
        grade: 'Nhất Giai',
        baseStats: { mp: 80, def: 10 },
        sockets: 1
      }
    },

    // 2. Nhị Giai (Trúc Cơ Kỳ | 3,000 – 8,000 LT)
    {
      id: 'm_eq_xich_viem_phi_kiem',
      name: 'Xích Viêm Phi Kiếm',
      category: 'equipment',
      equipmentType: 'weapon',
      quality: 'trung_pham',
      grade: 'Nhị Giai',
      itemType: 'equipment',
      price: 4500,
      stock: 3,
      maxStock: 3,
      description: 'Phi kiếm tẩm dung nham địa hỏa trăm năm, xuất kích mang theo hỏa diễm thiêu đốt đối thủ.',
      equipmentData: {
        type: 'weapon',
        slot: 'weapon',
        tier: 2,
        grade: 'Nhị Giai',
        baseStats: { atk: 80, critRate: 5 },
        sockets: 2
      }
    },
    {
      id: 'm_eq_bang_tam_linh_y',
      name: 'Băng Tằm Linh Y',
      category: 'equipment',
      equipmentType: 'armor',
      quality: 'thuong_pham',
      grade: 'Nhị Giai',
      itemType: 'equipment',
      price: 6800,
      stock: 3,
      maxStock: 3,
      description: 'Y phục dệt từ tơ Thiên Niên Băng Tằm tại cực bắc băng nguyên, mềm mại nhưng đao thương bất nhập, giảm chấn thương.',
      equipmentData: {
        type: 'armor',
        slot: 'armor',
        tier: 2,
        grade: 'Nhị Giai',
        baseStats: { hp: 450, def: 45, damageReduction: 5 },
        sockets: 2
      }
    },
    {
      id: 'm_eq_tu_linh_ngoc_boi',
      name: 'Tụ Linh Ngọc Bội',
      category: 'equipment',
      equipmentType: 'accessory',
      quality: 'thuong_pham',
      grade: 'Nhị Giai',
      itemType: 'equipment',
      price: 7500,
      stock: 3,
      maxStock: 3,
      description: 'Khối ngọc bội khắc Tụ Linh Trận mini, liên tục hấp thụ thiên địa linh khí, gia tăng tốc độ thổ nạp bế quan.',
      equipmentData: {
        type: 'accessory',
        slot: 'accessory',
        tier: 2,
        grade: 'Nhị Giai',
        baseStats: { mp: 200, speed: 10 },
        sockets: 2
      }
    },
    {
      id: 'm_eq_u_tinh_kiem_phoi',
      name: 'U Tinh Kiếm Phôi',
      category: 'equipment',
      equipmentType: 'artifact',
      quality: 'cuc_pham',
      grade: 'Nhị Giai',
      itemType: 'equipment',
      price: 12000,
      stock: 2,
      maxStock: 2,
      description: 'Kiếm phôi rèn từ Cửu U Hắc Tinh ngàn năm dưới vực sâu vạn trượng, mang linh tính sát phạt cực mạnh, thượng phẩm để tế luyện Bản Mệnh Pháp Bảo!',
      equipmentData: {
        type: 'artifact',
        slot: 'weapon',
        tier: 2,
        grade: 'Cực Phẩm',
        baseStats: { atk: 120, critRate: 8, speed: 15 },
        sockets: 2,
        isNatalCandidate: true
      }
    },

    // 3. Tam Giai (Kim Đan Kỳ | 15,000 – 35,000 LT)
    {
      id: 'm_eq_tram_yeu_trong_dao',
      name: 'Trảm Yêu Trọng Đao',
      category: 'equipment',
      equipmentType: 'weapon',
      quality: 'thuong_pham',
      grade: 'Tam Giai',
      itemType: 'equipment',
      price: 22000,
      stock: 2,
      maxStock: 2,
      description: 'Đại đao đúc từ cốt tủy đại yêu ngàn năm, trảm yêu trừ ma uy chấn một phương.',
      equipmentData: {
        type: 'weapon',
        slot: 'weapon',
        tier: 3,
        grade: 'Tam Giai',
        baseStats: { atk: 220, critRate: 8, critDmg: 15 },
        sockets: 3
      }
    },
    {
      id: 'm_eq_cuu_hoa_long_lan_giap',
      name: 'Cửu Hóa Long Lân Giáp',
      category: 'equipment',
      equipmentType: 'armor',
      quality: 'cuc_pham',
      grade: 'Tam Giai',
      itemType: 'equipment',
      price: 32000,
      stock: 2,
      maxStock: 2,
      description: 'Hộ giáp ghép từ long lân giao long chín lần lột xác, hào quang kim long bảo hộ thân thể.',
      equipmentData: {
        type: 'armor',
        slot: 'armor',
        tier: 3,
        grade: 'Tam Giai',
        baseStats: { hp: 1200, def: 120, damageReduction: 8 },
        sockets: 3
      }
    },
    {
      id: 'm_eq_thai_hu_huyen_linh_gioi',
      name: 'Thái Hư Huyễn Linh Giới',
      category: 'equipment',
      equipmentType: 'accessory',
      quality: 'cuc_pham',
      grade: 'Tam Giai',
      itemType: 'equipment',
      price: 28000,
      stock: 2,
      maxStock: 2,
      description: 'Chiếc nhẫn ngưng đọng hư không thần bí, gia trì thân pháp thoắt ẩn thoắt hiện.',
      equipmentData: {
        type: 'accessory',
        slot: 'ring',
        tier: 3,
        grade: 'Tam Giai',
        baseStats: { mp: 500, speed: 20, def: 40 },
        sockets: 3
      }
    },
    {
      id: 'm_eq_bat_quai_ho_tam_kinh',
      name: 'Bát Quái Hộ Tâm Kính',
      category: 'equipment',
      equipmentType: 'artifact',
      quality: 'cuc_pham',
      grade: 'Tam Giai',
      itemType: 'equipment',
      price: 40000,
      stock: 1,
      maxStock: 1,
      description: 'Gương đồng Thái Cổ khắc họa Tiên Thiên Bát Quái trận đồ, thức tỉnh Khí Linh Thủ Hộ chắn đòn chí mạng khi nguy cấp, cực kỳ thích hợp tế luyện Bản Mệnh!',
      equipmentData: {
        type: 'artifact',
        slot: 'artifact',
        tier: 3,
        grade: 'Cực Phẩm',
        baseStats: { hp: 1800, def: 180, damageReduction: 10 },
        sockets: 3,
        isNatalCandidate: true
      }
    },

    // 4. Tứ Giai (Nguyên Anh Kỳ | 50,000 – 100,000 LT)
    {
      id: 'm_eq_thai_at_tru_tien_kiem',
      name: 'Thái Ất Tru Tiên Kiếm',
      category: 'equipment',
      equipmentType: 'weapon',
      quality: 'tuyet_pham',
      grade: 'Tứ Giai',
      itemType: 'equipment',
      price: 85000,
      stock: 1,
      maxStock: 1,
      description: 'Thần kiếm đúc từ Thái Ất Tinh Kim, kiếm khí bén ngót rạch phá hư không, tăng mạnh uy lực bạo kích.',
      equipmentData: {
        type: 'weapon',
        slot: 'weapon',
        tier: 4,
        grade: 'Tứ Giai',
        baseStats: { atk: 550, critRate: 15, critDmg: 35 },
        sockets: 4
      }
    },
    {
      id: 'm_eq_huyen_vu_tran_nhuc_giap',
      name: 'Huyền Vũ Trấn Nhục Giáp',
      category: 'equipment',
      equipmentType: 'armor',
      quality: 'tuyet_pham',
      grade: 'Tứ Giai',
      itemType: 'equipment',
      price: 92000,
      stock: 1,
      maxStock: 1,
      description: 'Bộ chiến giáp mang linh vận Huyền Vũ thượng cổ, sừng sững như núi Thái Sơn, miễn thương 10%.',
      equipmentData: {
        type: 'armor',
        slot: 'armor',
        tier: 4,
        grade: 'Tứ Giai',
        baseStats: { hp: 3000, def: 320, damageReduction: 10 },
        sockets: 4
      }
    },
    {
      id: 'm_eq_that_bao_luu_ly_xoan',
      name: 'Thất Bảo Lưu Ly Xoán',
      category: 'equipment',
      equipmentType: 'accessory',
      quality: 'tuyet_pham',
      grade: 'Tứ Giai',
      itemType: 'equipment',
      price: 78000,
      stock: 1,
      maxStock: 1,
      description: 'Trâm ngọc đính 7 viên lưu ly thần châu ngũ sắc, hồi phục thần niệm và tăng mạnh thân pháp.',
      equipmentData: {
        type: 'accessory',
        slot: 'accessory',
        tier: 4,
        grade: 'Tứ Giai',
        baseStats: { mp: 1200, speed: 35, hp: 800 },
        sockets: 4
      }
    },
    {
      id: 'm_eq_cuu_tieu_loi_than_cam',
      name: 'Cửu Tiêu Lôi Thần Cầm',
      category: 'equipment',
      equipmentType: 'artifact',
      quality: 'tuyet_pham',
      grade: 'Tứ Giai',
      itemType: 'equipment',
      price: 120000,
      stock: 1,
      maxStock: 1,
      description: 'Tiên cầm đẽo từ gỗ Lôi Kích Cổ Mộc ngàn năm, mỗi tiếng gảy dẫn động thiên lôi Cửu Tiêu, thức tỉnh Khí Linh Cơ Xảo khống chế địch thủ, phôi bản mệnh tuyệt đỉnh!',
      equipmentData: {
        type: 'artifact',
        slot: 'artifact',
        tier: 4,
        grade: 'Tuyệt Phẩm',
        baseStats: { atk: 450, mp: 1500, speed: 30, critRate: 12 },
        sockets: 4,
        isNatalCandidate: true
      }
    },

    // 5. Ngũ Giai (Hóa Thần Kỳ | 200,000 – 350,000 LT • Độc Bản)
    {
      id: 'm_eq_hon_don_khai_thien_dinh',
      name: 'Hỗn Độn Khai Thiên Đỉnh',
      category: 'equipment',
      equipmentType: 'artifact',
      quality: 'tien_pham',
      grade: 'Ngũ Giai',
      itemType: 'equipment',
      price: 300000,
      stock: 1,
      maxStock: 1,
      oneTimeOnly: true,
      description: 'Chí bảo nghịch thiên đúc từ Hỗn Độn Thần Thiết thời khai thiên lập địa, sẵn 3 lỗ khảm ngũ hành, thức tỉnh Khí Linh Tịnh Hóa trấn thủ tâm ma và độ kiếp!',
      equipmentData: {
        type: 'artifact',
        slot: 'artifact',
        tier: 5,
        grade: 'Tiên Phẩm',
        baseStats: { atk: 1200, hp: 8000, def: 800, mp: 3000, damageReduction: 15, critRate: 20 },
        sockets: 3,
        isNatalCandidate: true
      }
    }
  ];

  const allRaw = [
    ...TIER_PILLS_MERCHANT_ITEMS,
    ...TIER_CULTIVATION_MERCHANT_ITEMS,
    ...TIER_MANUALS_MERCHANT_ITEMS,
    ...TIER_DIVINE_MERCHANT_ITEMS,
    ...TIER_HERBS_MERCHANT_ITEMS,
    ...TIER_ORES_MERCHANT_ITEMS,
    ...TIER_EQUIPMENT_MERCHANT_ITEMS,
    ...TIER_COMPANIONS_MERCHANT_ITEMS,
    ...TIER_BEASTS_MERCHANT_ITEMS,
    ...TIER_STORAGE_MERCHANT_ITEMS,
    ...pillItems,
    ...cultivationItems,
    ...oreItems,
    ...manualItems,
    ...materialItems,
    ...equipmentItems,
    ...companionItems,
    ...beastItems,
    ...storageItems
  ];

  const processed = allRaw.map(item => {
    const isOneTime = isOneTimeMerchantItem(item);
    const standardPrice = calculateItemStandardValue(item);
    const finalPrice = (item.price !== undefined && item.price > 0) ? item.price : standardPrice;
    const tierInfo = formatMerchantPriceTier(finalPrice);
    const alreadyOwned = player ? isItemAlreadyPurchased(item, player) : false;

    return {
      ...item,
      isOneTime,
      isSoldOutPermanent: alreadyOwned,
      stock: alreadyOwned ? 0 : item.stock,
      price: finalPrice,
      displayPriceText: tierInfo.display
    };
  });

  return sortMerchantItems(processed);
}

/**
 * Kiểm tra và kích hoạt làm mới tự động Thương Hội sau mỗi 24 giờ thực
 */
export function checkAndTriggerDailyShopReset(player: PlayerStats): {
  shouldReset: boolean;
  updatedPlayer: PlayerStats;
} {
  const now = Date.now();
  const lastRefresh = player.merchantState?.lastDailyRefreshTime || player.merchantState?.lastRefreshTime || 0;
  const elapsed = now - lastRefresh;

  if (lastRefresh === 0 || elapsed >= DAILY_REFRESH_INTERVAL_MS) {
    const newItems = generateMerchantInventory(player);
    const updated: PlayerStats = {
      ...player,
      merchantState: {
        lastRefreshTime: now,
        lastDailyRefreshTime: now,
        refreshCountToday: 0,
        purchasedOneTimeIds: player.merchantState?.purchasedOneTimeIds || [],
        currentStock: {},
        items: newItems
      }
    };
    return { shouldReset: true, updatedPlayer: updated };
  }

  return { shouldReset: false, updatedPlayer: player };
}

/**
 * Tính giá bán thu hồi vật phẩm người chơi muốn bán lại cho Thương Hội
 * Giá Trị = Giá Gốc (theo Cấp Giai 1-9) * Hệ Số Phẩm Chất (Hạ Phẩm x1.0 -> Tiên Phẩm x10.0)
 * Giá Thu Hồi = 50% Giá Trị định giá
 */
export function calculateSellPrice(typeOrItem: any, maybeItem?: any): number {
  let itemType: string | undefined;
  let item: any;

  if (maybeItem !== undefined) {
    itemType = typeOrItem;
    item = maybeItem;
  } else {
    item = typeOrItem;
    if (!item) return 0;
    if (item.slot || item.enhancement !== undefined) {
      itemType = 'equipment';
    } else if (item.effectType || item.id?.startsWith('pill_')) {
      itemType = 'pill';
    } else if (item.id?.startsWith('herb_') || item.type === 'herb' || item.grade?.includes('Linh Thảo')) {
      itemType = 'herb';
    } else if (item.id?.startsWith('ore_') || item.type === 'ore' || item.id === 'huyen_thiet' || item.id === 'bang_tinh_khoang' || item.id === 'thai_at_tinh_kim' || item.id === 'cuu_u_minh_thach' || item.id === 'hon_don_than_thiet') {
      itemType = 'ore';
    } else if (item.bagCapacity || item.itemType === 'storage_bag') {
      itemType = 'storage_bag';
    } else {
      itemType = 'herb';
    }
  }

  if (!item) return 0;
  const standardValue = calculateItemStandardValue(item, itemType);
  return Math.max(5, Math.floor(standardValue * 0.5));
}
