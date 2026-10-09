// lib/merchant-logic.ts
// Pure Business Logic & Pricing Engine cho phân hệ Vạn Bảo Thương Hội
// 100% Strict TypeScript, Pure Functions, No Any, Zero Side Effects

import {
  MerchantShopItem,
  BlackMarketItem,
  RecycleItemEntry,
  RecycleItemType,
  MerchantFilterCategory,
  MerchantSortOption,
  MerchantFilterState,
  MerchantPaginationState,
  MerchantCurrency
} from '@/components/tabs/merchant/types';
import {
  calculateSellPrice,
  getGiaiNumber,
  BASE_PRICES_BY_GIAI,
  GRADE_WEIGHT
} from '@/lib/merchant-data';

// ============================================================================
// 1. TYPE GUARDS AN TOÀN (NO ANY)
// ============================================================================

/**
 * Kiểm tra xem một giá trị có phải là Record<string, unknown> hợp lệ hay không
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Trích xuất an toàn một chuỗi từ đối tượng
 */
function safeString(obj: unknown, key: string): string {
  if (isRecord(obj) && typeof obj[key] === 'string') {
    return obj[key] as string;
  }
  return '';
}

/**
 * Trích xuất an toàn một số từ đối tượng
 */
function safeNumber(obj: unknown, key: string, fallback: number = 0): number {
  if (isRecord(obj) && typeof obj[key] === 'number') {
    return obj[key] as number;
  }
  return fallback;
}

// ============================================================================
// 2. PURE PRICING ENGINE (TÍNH GIÁ MUA & BÁN)
// ============================================================================

/**
 * Tính toán giá bán sau khi áp dụng chiết khấu cảnh giới tu sĩ và ưu đãi thương hội
 * 
 * Công thức:
 * - basePrice: Giá gốc niêm yết trong thương hội
 * - playerRealmIndex: Cảnh giới tu sĩ (Càng cao càng có uy thế đàm phán)
 * - shopDiscountRate: Tỷ lệ giảm giá từ Đạo Lữ, Tông Môn hoặc Sự Kiện (%)
 * 
 * Invariants:
 * - basePrice <= 0 -> Trả về 0.
 * - shopDiscountRate được giới hạn trong khoảng [0, 80]%.
 * - Thưởng cảnh giới: Mỗi cảnh giới trên 10 (Trúc Cơ) giảm thêm 0.2%, tối đa 10%.
 * - Tổng chiết khấu không vượt quá 85%.
 * - Kết quả là số nguyên không âm (tối thiểu 1 nếu basePrice > 0).
 */
export function calculateItemFinalPrice(
  basePrice: number,
  playerRealmIndex: number = 0,
  shopDiscountRate: number = 0
): number {
  if (basePrice <= 0) return 0;

  // 1. Chuẩn hóa tỷ lệ giảm giá từ thương hội (tối đa 80%)
  const clampedShopDiscount = Math.max(0, Math.min(80, shopDiscountRate));

  // 2. Thưởng chiết khấu theo cảnh giới: mỗi cảnh giới trên 10 (Trúc Cơ) giảm 0.2%
  const safeRealmIndex = Math.max(0, playerRealmIndex);
  const realmDiscountBonus = safeRealmIndex > 10 ? Math.min(10, (safeRealmIndex - 10) * 0.2) : 0;

  // 3. Tổng chiết khấu lũy tiến (trần 85%)
  const totalDiscountPercent = Math.min(85, clampedShopDiscount + realmDiscountBonus);

  // 4. Giá sau chiết khấu
  const finalPrice = Math.floor(basePrice * (1 - totalDiscountPercent / 100));
  return Math.max(1, finalPrice);
}

/**
 * Tính toán giá trị thanh lý / thu mua của một vật phẩm người chơi muốn bán lại
 * 
 * Quy chuẩn thương hội:
 * - Giá Trị Định Giá = Giá Gốc (theo Giai 1-9) * Hệ Số Phẩm Cấp (Hạ Phẩm x1.0 -> Tiên Phẩm x10.0)
 * - Giá Thu Hồi = 50% Giá Trị Định Giá (Tối thiểu 5 Hạ Phẩm Linh Thạch)
 * 
 * Invariants:
 * - 100% Pure, không mutate đối tượng đầu vào.
 * - Tuyệt đối không dùng 'any'.
 */
export function calculateRecycleValue(item: unknown): number {
  if (!isRecord(item)) return 0;
  return calculateSellPrice(item);
}

/**
 * Tính tổng giá trị thu hồi cho một lô vật phẩm thanh lý
 */
export function calculateBatchRecycleValue(items: unknown[]): number {
  if (!Array.isArray(items)) return 0;
  return items.reduce<number>((total, it) => total + calculateRecycleValue(it), 0);
}

// ============================================================================
// 3. PURE FILTERING & SEARCH ENGINE (LỌC & TÌM KIẾM THUẦN TÚY)
// ============================================================================

/**
 * Lọc danh sách sản phẩm thương hội theo trạng thái bộ lọc toàn diện
 */
export function filterMerchantItems<T extends MerchantShopItem>(
  items: T[],
  filter: MerchantFilterState
): T[] {
  if (!Array.isArray(items)) return [];

  const query = filter.searchQuery.trim().toLowerCase();

  return items.filter(item => {
    // 1. Lọc theo Phân Khu (SubTab)
    if (filter.subTab === 'cho_den') {
      // Chợ đen chỉ hiển thị hàng có thuộc tính black market / rarity
      const isBlackMarket = 'rarity' in item || item.category === 'talismans';
      if (!isBlackMarket) return false;
    }

    // 2. Lọc theo Danh Mục (Category)
    if (filter.category !== 'all') {
      if (item.category !== filter.category) {
        return false;
      }
    }

    // 3. Lọc theo Giai Vị (Tier 1-9)
    if (filter.selectedTier !== 'all') {
      const itemTier = typeof item.tier === 'number' ? item.tier : getGiaiNumber(item.grade);
      if (itemTier !== filter.selectedTier) {
        return false;
      }
    }

    // 4. Lọc theo Từ Khóa Tìm Kiếm
    if (query.length > 0) {
      const name = item.name.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const grade = (item.grade || '').toLowerCase();
      const matchName = name.includes(query);
      const matchDesc = desc.includes(query);
      const matchGrade = grade.includes(query);
      if (!matchName && !matchDesc && !matchGrade) {
        return false;
      }
    }

    return true;
  });
}

// ============================================================================
// 4. PURE SORTING ENGINE (SẮP XẾP SẢN PHẨM THUẦN TÚY)
// ============================================================================

/**
 * Sắp xếp danh sách sản phẩm thương hội theo tùy chọn sắp xếp
 */
export function sortMerchantItemsByOption<T extends MerchantShopItem>(
  items: T[],
  sortOption: MerchantSortOption
): T[] {
  if (!Array.isArray(items)) return [];
  const cloned = [...items];

  switch (sortOption) {
    case 'price_asc':
      return cloned.sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));

    case 'price_desc':
      return cloned.sort((a, b) => b.price - a.price || a.id.localeCompare(b.id));

    case 'tier_desc':
      return cloned.sort((a, b) => {
        const tierA = typeof a.tier === 'number' ? a.tier : getGiaiNumber(a.grade);
        const tierB = typeof b.tier === 'number' ? b.tier : getGiaiNumber(b.grade);
        if (tierA !== tierB) return tierB - tierA;
        return a.price - b.price || a.id.localeCompare(b.id);
      });

    case 'grade_desc':
      return cloned.sort((a, b) => {
        const qA = String(a.quality || a.grade || '').toLowerCase();
        const qB = String(b.quality || b.grade || '').toLowerCase();
        const weightA = GRADE_WEIGHT[qA] || 1;
        const weightB = GRADE_WEIGHT[qB] || 1;
        if (weightA !== weightB) return weightB - weightA;
        return a.price - b.price || a.id.localeCompare(b.id);
      });

    case 'name_asc':
      return cloned.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    case 'default':
    default:
      return cloned.sort((a, b) => {
        const tierA = typeof a.tier === 'number' ? a.tier : getGiaiNumber(a.grade);
        const tierB = typeof b.tier === 'number' ? b.tier : getGiaiNumber(b.grade);
        if (tierA !== tierB) return tierA - tierB;
        if (a.price !== b.price) return a.price - b.price;
        return a.id.localeCompare(b.id);
      });
  }
}

// ============================================================================
// 5. PURE PAGINATION ENGINE (PHÂN TRANG THUẦN TÚY)
// ============================================================================

/**
 * Phân trang mảng dữ liệu thuần túy, trả về danh sách trang và metadata
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; pagination: MerchantPaginationState } {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalItems = Array.isArray(items) ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.max(1, Math.min(totalPages, Math.floor(page)));

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = startIndex + safePageSize;
  const paginatedList = Array.isArray(items) ? items.slice(startIndex, endIndex) : [];

  return {
    items: paginatedList,
    pagination: {
      currentPage,
      pageSize: safePageSize,
      totalItems,
      totalPages
    }
  };
}

// ============================================================================
// 6. TIỆN ÍCH HỐI ĐOÁI TỆ ĐIẾM & QUY ĐỔI (1:1,000)
// ============================================================================

export const CURRENCY_TIER_ORDER: Record<MerchantCurrency, number> = {
  linh_thach: 1,
  trung_pham: 2,
  thuong_pham: 3,
  cuc_pham: 4,
  tien_tinh: 5,
  cong_duc: 0
};

export const CURRENCY_LABELS: Record<MerchantCurrency, string> = {
  linh_thach: 'Hạ Phẩm Linh Thạch',
  trung_pham: 'Trung Phẩm Linh Thạch',
  thuong_pham: 'Thượng Phẩm Linh Thạch',
  cuc_pham: 'Cực Phẩm Linh Thạch',
  tien_tinh: 'Tiên Phẩm Linh Thạch (Tiên Tinh)',
  cong_duc: 'Điểm Công Đức'
};

/**
 * Tính toán kết quả hối đoái tiền tệ giữa các bậc (tỷ lệ 1:1,000 chuẩn)
 */
export function calculateCurrencyExchange(
  fromType: MerchantCurrency,
  toType: MerchantCurrency,
  amount: number
): {
  success: boolean;
  resultAmount: number;
  consumedAmount: number;
  remainder: number;
  reason?: string;
} {
  if (amount <= 0) {
    return { success: false, resultAmount: 0, consumedAmount: 0, remainder: 0, reason: 'Số lượng quy đổi không hợp lệ!' };
  }

  const orderFrom = CURRENCY_TIER_ORDER[fromType];
  const orderTo = CURRENCY_TIER_ORDER[toType];

  if (!orderFrom || !orderTo) {
    return { success: false, resultAmount: 0, consumedAmount: 0, remainder: 0, reason: 'Loại tiền tệ không hỗ trợ hối đoái!' };
  }

  // Đổi Lên (Ví dụ: Hạ Phẩm -> Trung Phẩm: Cần 1,000 Hạ Phẩm đổi 1 Trung Phẩm)
  if (orderTo > orderFrom) {
    const tierDiff = orderTo - orderFrom;
    const requiredPerUnit = Math.pow(1000, tierDiff);

    if (amount < requiredPerUnit) {
      return {
        success: false,
        resultAmount: 0,
        consumedAmount: 0,
        remainder: amount,
        reason: `Cần tối thiểu ${requiredPerUnit.toLocaleString()} ${CURRENCY_LABELS[fromType]} để đổi 1 ${CURRENCY_LABELS[toType]}!`
      };
    }

    const unitsProduced = Math.floor(amount / requiredPerUnit);
    const consumed = unitsProduced * requiredPerUnit;
    const rem = amount - consumed;

    return {
      success: true,
      resultAmount: unitsProduced,
      consumedAmount: consumed,
      remainder: rem
    };
  }

  // Tách Xuống (Ví dụ: Trung Phẩm -> Hạ Phẩm: 1 Trung Phẩm = 1,000 Hạ Phẩm)
  if (orderTo < orderFrom) {
    const tierDiff = orderFrom - orderTo;
    const multiplier = Math.pow(1000, tierDiff);
    const unitsProduced = Math.floor(amount * multiplier);

    return {
      success: true,
      resultAmount: unitsProduced,
      consumedAmount: amount,
      remainder: 0
    };
  }

  return { success: false, resultAmount: 0, consumedAmount: 0, remainder: amount, reason: 'Hai loại tiền tệ trùng khớp!' };
}

// ============================================================================
// 7. TRÍCH XUẤT VẬT PHẨM THANH LÝ TỪ KHO ĐỒ (PURE INVENTORY EXTRACTION)
// ============================================================================

/**
 * Trích xuất danh sách vật phẩm đủ điều kiện thanh lý từ túi đồ của người chơi
 */
export function extractRecyclableItems(
  inventory: unknown,
  categoryFilter: RecycleItemType | 'all' = 'all'
): RecycleItemEntry[] {
  if (!isRecord(inventory)) return [];

  const results: RecycleItemEntry[] = [];

  // 1. Đan Dược
  if ((categoryFilter === 'all' || categoryFilter === 'pill') && Array.isArray(inventory.pills)) {
    for (const pill of inventory.pills) {
      if (!isRecord(pill)) continue;
      const qty = safeNumber(pill, 'quantity', 0);
      if (qty <= 0) continue;

      const unitVal = calculateRecycleValue(pill);
      results.push({
        id: safeString(pill, 'id'),
        name: safeString(pill, 'name'),
        type: 'pill',
        quantity: qty,
        unitRecyclePrice: unitVal,
        totalRecyclePrice: unitVal * qty,
        grade: safeString(pill, 'grade'),
        quality: safeString(pill, 'quality'),
        rawItemRef: pill
      });
    }
  }

  // 2. Dược Thảo
  if ((categoryFilter === 'all' || categoryFilter === 'herb') && Array.isArray(inventory.herbs)) {
    for (const herb of inventory.herbs) {
      if (!isRecord(herb)) continue;
      const qty = safeNumber(herb, 'quantity', 0);
      if (qty <= 0) continue;

      const unitVal = calculateRecycleValue(herb);
      results.push({
        id: safeString(herb, 'id'),
        name: safeString(herb, 'name'),
        type: 'herb',
        quantity: qty,
        unitRecyclePrice: unitVal,
        totalRecyclePrice: unitVal * qty,
        grade: safeString(herb, 'grade'),
        quality: safeString(herb, 'quality'),
        rawItemRef: herb
      });
    }
  }

  // 3. Khoáng Thạch
  if ((categoryFilter === 'all' || categoryFilter === 'ore') && Array.isArray(inventory.ores)) {
    for (const ore of inventory.ores) {
      if (!isRecord(ore)) continue;
      const qty = safeNumber(ore, 'quantity', 0);
      if (qty <= 0) continue;

      const unitVal = calculateRecycleValue(ore);
      results.push({
        id: safeString(ore, 'id'),
        name: safeString(ore, 'name'),
        type: 'ore',
        quantity: qty,
        unitRecyclePrice: unitVal,
        totalRecyclePrice: unitVal * qty,
        grade: safeString(ore, 'grade'),
        quality: safeString(ore, 'quality'),
        rawItemRef: ore
      });
    }
  }

  // 4. Pháp Bảo Trang Bị (Chưa trang bị trong túi)
  if ((categoryFilter === 'all' || categoryFilter === 'equipment') && Array.isArray(inventory.equipments)) {
    for (const eq of inventory.equipments) {
      if (!isRecord(eq)) continue;
      const unitVal = calculateRecycleValue(eq);
      results.push({
        id: safeString(eq, 'id'),
        name: safeString(eq, 'name'),
        type: 'equipment',
        quantity: 1,
        unitRecyclePrice: unitVal,
        totalRecyclePrice: unitVal,
        grade: safeString(eq, 'grade'),
        quality: safeString(eq, 'quality'),
        enhancement: safeNumber(eq, 'enhancement', 0),
        rawItemRef: eq
      });
    }
  }

  return results;
}
