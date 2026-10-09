// lib/item-quality-data.ts
// Hệ Thống 8 Tầng Phẩm Chất Vật Phẩm (Sub-Quality) & Chuẩn Hóa Cấp Giai (Đại Cảnh Giới)

import type { ItemQuality } from '@/lib/types';
export type { ItemQuality };

export interface ItemQualityInfo {
  id: ItemQuality;
  name: string;
  shortName: string;
  multiplier: number;
  color: string;
  textClass: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  glowClass?: string;
  description: string;
}

export const ITEM_QUALITIES: Record<ItemQuality, ItemQualityInfo> = {
  ha_pham: {
    id: 'ha_pham',
    name: 'Hạ Phẩm',
    shortName: 'Hạ',
    multiplier: 1.0,
    color: '#9ca3af',
    textClass: 'text-zinc-400',
    badgeClass: 'bg-zinc-900/80 border-zinc-700/60 text-zinc-400',
    borderClass: 'border-zinc-700/60',
    bgClass: 'bg-zinc-900/40',
    description: 'Phẩm chất phổ thông, hiệu quả cơ bản (Hệ số x1.0).'
  },
  trung_pham: {
    id: 'trung_pham',
    name: 'Trung Phẩm',
    shortName: 'Trung',
    multiplier: 1.3,
    color: '#34d399',
    textClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.15)]',
    borderClass: 'border-emerald-700/60',
    bgClass: 'bg-emerald-950/30',
    description: 'Hòa hợp tinh thuần, hiệu năng gia tăng +30% (Hệ số x1.3).'
  },
  thuong_pham: {
    id: 'thuong_pham',
    name: 'Thượng Phẩm',
    shortName: 'Thượng',
    multiplier: 1.7,
    color: '#60a5fa',
    textClass: 'text-sky-400',
    badgeClass: 'bg-sky-950/70 border-sky-700/60 text-sky-300 shadow-[0_0_8px_rgba(96,165,250,0.2)]',
    borderClass: 'border-sky-700/60',
    bgClass: 'bg-sky-950/30',
    description: 'Linh khí ngưng tụ, uy lực vượt bậc +70% (Hệ số x1.7).'
  },
  cuc_pham: {
    id: 'cuc_pham',
    name: 'Cực Phẩm',
    shortName: 'Cực',
    multiplier: 2.2,
    color: '#c084fc',
    textClass: 'text-purple-400',
    badgeClass: 'bg-purple-950/80 border-purple-600/70 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.25)]',
    borderClass: 'border-purple-600/70',
    bgClass: 'bg-purple-950/30',
    glowClass: 'shadow-[0_0_12px_rgba(192,132,252,0.3)]',
    description: 'Linh vân lưu chuyển, dược lực bạo phát gấp đôi (Hệ số x2.2).'
  },
  tuyet_pham: {
    id: 'tuyet_pham',
    name: 'Tuyệt Phẩm',
    shortName: 'Tuyệt',
    multiplier: 3.0,
    color: '#facc15',
    textClass: 'text-yellow-400 font-bold',
    badgeClass: 'bg-yellow-950/80 border-yellow-600/70 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.3)] font-bold',
    borderClass: 'border-yellow-600/70',
    bgClass: 'bg-yellow-950/30',
    glowClass: 'shadow-[0_0_15px_rgba(250,204,21,0.35)]',
    description: 'Vô khuyết vô tỳ, dược tính thuần túy gấp 3 lần (Hệ số x3.0).'
  },
  chi_ton: {
    id: 'chi_ton',
    name: 'Chí Tôn',
    shortName: 'Chí Tôn',
    multiplier: 4.2,
    color: '#fb923c',
    textClass: 'text-orange-400 font-bold',
    badgeClass: 'bg-orange-950/85 border-orange-600/80 text-orange-300 shadow-[0_0_15px_rgba(251,146,60,0.35)] font-bold',
    borderClass: 'border-orange-600/80',
    bgClass: 'bg-orange-950/35',
    glowClass: 'shadow-[0_0_18px_rgba(251,146,60,0.4)]',
    description: 'Khí thế vương giả, uy áp chư thiên x4.2 lần hiệu quả!'
  },
  than_pham: {
    id: 'than_pham',
    name: 'Thần Phẩm',
    shortName: 'Thần',
    multiplier: 6.0,
    color: '#f43f5e',
    textClass: 'text-rose-400 font-bold',
    badgeClass: 'bg-rose-950/90 border-rose-600/80 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.45)] font-bold animate-pulse',
    borderClass: 'border-rose-600/80',
    bgClass: 'bg-rose-950/40',
    glowClass: 'shadow-[0_0_22px_rgba(244,63,94,0.5)]',
    description: 'Thần uy giáng thế, kinh động thiên địa quỷ thần x6.0 uy năng!'
  },
  tien_pham: {
    id: 'tien_pham',
    name: 'Tiên Phẩm',
    shortName: 'Tiên',
    multiplier: 10.0,
    color: '#e879f9',
    textClass: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-300 font-bold animate-pulse',
    badgeClass: 'bg-gradient-to-r from-purple-950/90 via-rose-950/90 to-amber-950/90 border-amber-400/90 text-amber-200 shadow-[0_0_25px_rgba(234,179,8,0.6)] font-bold',
    borderClass: 'border-amber-400/90',
    bgClass: 'bg-gradient-to-r from-purple-950/40 via-rose-950/30 to-amber-950/40',
    glowClass: 'shadow-[0_0_30px_rgba(234,179,8,0.7)]',
    description: 'Thất sắc cầu vồng, tạo hóa chí tôn nghịch chuyển càn khôn x10.0!'
  }
};

/**
 * Chuyển đổi tên Cấp Đại Cảnh Giới: 'Phẩm' -> 'Giai'
 */
export function convertGradeToGiai(grade: string | undefined): string {
  if (!grade) return 'Nhất Giai';
  const g = grade.trim();
  if (g.includes('Giai')) return g;

  const mapping: Record<string, string> = {
    'Nhất Phẩm': 'Nhất Giai',
    'Nhị Phẩm': 'Nhị Giai',
    'Tam Phẩm': 'Tam Giai',
    'Tứ Phẩm': 'Tứ Giai',
    'Ngũ Phẩm': 'Ngũ Giai',
    'Lục Phẩm': 'Lục Giai',
    'Thất Phẩm': 'Thất Giai',
    'Bát Phẩm': 'Bát Giai',
    'Cửu Phẩm': 'Cửu Giai',
    'Thần Phẩm': 'Thần Giai',
    // Trang bị
    'Phàm Khí': 'Nhất Giai',
    'Linh Khí': 'Nhị Giai',
    'Bảo Khí': 'Tam Giai',
    'Cổ Bảo': 'Tứ Giai',
    'Tiên Thiên Linh Bảo': 'Ngũ Giai'
  };

  return mapping[g] || g.replace(/Phẩm/g, 'Giai');
}

/**
 * Lấy thông tin chi tiết của 1 tầng phẩm chất
 */
export function getItemQuality(quality?: ItemQuality | string): ItemQualityInfo {
  if (quality && quality in ITEM_QUALITIES) {
    return ITEM_QUALITIES[quality as ItemQuality];
  }
  // Mặc định cho vật phẩm cũ
  return ITEM_QUALITIES.thuong_pham;
}

/**
 * Lấy hệ số hiệu năng theo phẩm chất
 */
export function getItemQualityMultiplier(quality?: ItemQuality | string): number {
  const info = getItemQuality(quality);
  return info.multiplier;
}

/**
 * Định dạng tên đầy đủ: [Cấp Giai] Tên Vật Phẩm - [Phẩm Chất]
 * Ví dụ: [Nhị Giai] Trúc Cơ Đan (Cực Phẩm)
 */
export function formatItemFullName(name: string, grade: string, quality?: ItemQuality): string {
  const giai = convertGradeToGiai(grade);
  const qInfo = getItemQuality(quality);
  // Loại bỏ các tiền tố cấp cũ nếu có trong name
  const cleanName = name
    .replace(/^\[.*?\]\s*/, '')
    .replace(/\s*\(.*?\)$/, '')
    .trim();

  return `[${giai}] ${cleanName} (${qInfo.name})`;
}

/**
 * Quay ngẫu nhiên phẩm chất khi Luyện Đan (dựa trên Ngộ Tính, cấp Đan Sư, Thần Thức)
 */
export function rollAlchemyQuality(
  ngoTinh: number = 50,
  artisanLevel: number = 1,
  soulLevel: number = 1
): ItemQuality {
  // Điểm may mắn tổng hợp (0 - 150)
  const luckScore = (ngoTinh - 50) * 0.4 + artisanLevel * 12 + soulLevel * 8 + Math.random() * 35;

  if (luckScore >= 130) return 'tien_pham';   // x10.0
  if (luckScore >= 105) return 'than_pham';   // x6.0
  if (luckScore >= 85)  return 'chi_ton';     // x4.2
  if (luckScore >= 65)  return 'tuyet_pham';   // x3.0
  if (luckScore >= 45)  return 'cuc_pham';     // x2.2
  if (luckScore >= 25)  return 'thuong_pham';  // x1.7
  if (luckScore >= 10)  return 'trung_pham';   // x1.3
  return 'ha_pham';                            // x1.0
}

/**
 * Quay ngẫu nhiên phẩm chất khi Luyện Khí (dựa trên Căn Cốt, cấp Thợ Rèn, Tôi Thể)
 */
export function rollForgingQuality(
  canCot: number = 50,
  artisanLevel: number = 1,
  bodyLevel: number = 1
): ItemQuality {
  const luckScore = (canCot - 50) * 0.4 + artisanLevel * 12 + bodyLevel * 8 + Math.random() * 35;

  if (luckScore >= 130) return 'tien_pham';
  if (luckScore >= 105) return 'than_pham';
  if (luckScore >= 85)  return 'chi_ton';
  if (luckScore >= 65)  return 'tuyet_pham';
  if (luckScore >= 45)  return 'cuc_pham';
  if (luckScore >= 25)  return 'thuong_pham';
  if (luckScore >= 10)  return 'trung_pham';
  return 'ha_pham';
}

// ============================================
// HỆ THỐNG 5 TẦNG LINH THẠCH & ĐỔI TIỀN TỆ (TỶ GIÁ 1:1000)
// ============================================

export const LINH_THACH_RATES = {
  ha_pham: 1,
  trung_pham: 1000,             // 1 Trung Phẩm = 1,000 Hạ Phẩm
  thuong_pham: 1000000,         // 1 Thượng Phẩm = 1,000 Trung Phẩm = 1,000,000 Hạ Phẩm
  cuc_pham: 1000000000,         // 1 Cực Phẩm = 1,000 Thượng Phẩm = 1,000,000,000 Hạ Phẩm
  tien_tinh: 1000000000000,     // 1 Tiên Phẩm / Tiên Tinh = 1,000 Cực Phẩm = 1,000,000,000,000 Hạ Phẩm
  tien_pham: 1000000000000
};

export const LINH_THACH_TIER_NAMES = {
  ha_pham: 'Hạ Phẩm Linh Thạch',
  trung_pham: 'Trung Phẩm Linh Thạch',
  thuong_pham: 'Thượng Phẩm Linh Thạch',
  cuc_pham: 'Cực Phẩm Linh Thạch',
  tien_tinh: 'Tiên Phẩm Linh Thạch',
  tien_pham: 'Tiên Phẩm Linh Thạch'
};

/**
 * Tính tổng giá trị linh thạch của người chơi quy đổi ra Hạ Phẩm Linh Thạch
 */
export function calculateTotalEquivalentHaPham(player: {
  linhThach?: number;
  trungPhamLinhThach?: number;
  thuongPhamLinhThach?: number;
  cucPhamLinhThach?: number;
  tienTinh?: number;
  tienPhamLinhThach?: number;
}): number {
  if (!player) return 0;
  const ha = player.linhThach || 0;
  const trung = (player.trungPhamLinhThach || 0) * LINH_THACH_RATES.trung_pham;
  const thuong = (player.thuongPhamLinhThach || 0) * LINH_THACH_RATES.thuong_pham;
  const cuc = (player.cucPhamLinhThach || 0) * LINH_THACH_RATES.cuc_pham;
  const tienVal = Math.max(player.tienTinh || 0, player.tienPhamLinhThach || 0);
  const tien = tienVal * LINH_THACH_RATES.tien_tinh;
  return ha + trung + thuong + cuc + tien;
}

/**
 * Lấy chi tiết số lượng từng loại Linh Thạch của người chơi
 */
export function getPlayerLinhThachBreakdown(player: {
  linhThach?: number;
  trungPhamLinhThach?: number;
  thuongPhamLinhThach?: number;
  cucPhamLinhThach?: number;
  tienTinh?: number;
  tienPhamLinhThach?: number;
}) {
  const ha = player?.linhThach || 0;
  const trung = player?.trungPhamLinhThach || 0;
  const thuong = player?.thuongPhamLinhThach || 0;
  const cuc = player?.cucPhamLinhThach || 0;
  const tien = Math.max(player?.tienTinh || 0, player?.tienPhamLinhThach || 0);
  const totalHa = calculateTotalEquivalentHaPham(player);
  return { ha, trung, thuong, cuc, tien, totalHa };
}

/**
 * Định dạng hiển thị Linh Thạch thông minh (kèm đơn vị cấp cao nếu đủ 1:1000)
 * Ví dụ: 15,000 -> "15 Trung Phẩm Linh Thạch (15,000 Hạ Phẩm)"
 *        4,293 -> "4,293 Hạ Phẩm Linh Thạch"
 */
export function formatLinhThachDenomination(amountInHaPham: number): string {
  if (amountInHaPham <= 0) return '0 Hạ Phẩm Linh Thạch';

  if (amountInHaPham >= LINH_THACH_RATES.tien_tinh) {
    const val = amountInHaPham / LINH_THACH_RATES.tien_tinh;
    return `${val >= 10 ? Math.floor(val).toLocaleString() : val.toFixed(1)} Tiên Phẩm Linh Thạch (${amountInHaPham.toLocaleString()} Hạ Phẩm)`;
  }
  if (amountInHaPham >= LINH_THACH_RATES.cuc_pham) {
    const val = amountInHaPham / LINH_THACH_RATES.cuc_pham;
    return `${val >= 10 ? Math.floor(val).toLocaleString() : val.toFixed(1)} Cực Phẩm Linh Thạch (${amountInHaPham.toLocaleString()} Hạ Phẩm)`;
  }
  if (amountInHaPham >= LINH_THACH_RATES.thuong_pham) {
    const val = amountInHaPham / LINH_THACH_RATES.thuong_pham;
    return `${val >= 10 ? Math.floor(val).toLocaleString() : val.toFixed(1)} Thượng Phẩm Linh Thạch (${amountInHaPham.toLocaleString()} Hạ Phẩm)`;
  }
  if (amountInHaPham >= LINH_THACH_RATES.trung_pham) {
    const val = amountInHaPham / LINH_THACH_RATES.trung_pham;
    return `${val >= 10 ? Math.floor(val).toLocaleString() : val.toFixed(1)} Trung Phẩm Linh Thạch (${amountInHaPham.toLocaleString()} Hạ Phẩm)`;
  }
  return `${amountInHaPham.toLocaleString()} Hạ Phẩm Linh Thạch`;
}

/**
 * Định dạng giá niêm yết thương hội theo cấp linh thạch tương ứng
 */
export function formatMerchantPriceTier(priceInHaPham: number): {
  display: string;
  badge: string;
  tier: 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'tien_pham';
  haPhamText: string;
} {
  const haPhamText = `${priceInHaPham.toLocaleString()} Hạ Phẩm`;

  if (priceInHaPham >= LINH_THACH_RATES.tien_tinh) {
    const val = (priceInHaPham / LINH_THACH_RATES.tien_tinh);
    return {
      display: `${val % 1 === 0 ? val : val.toFixed(1)} Tiên Phẩm`,
      badge: 'Tiên Phẩm',
      tier: 'tien_pham',
      haPhamText
    };
  }
  if (priceInHaPham >= LINH_THACH_RATES.cuc_pham) {
    const val = (priceInHaPham / LINH_THACH_RATES.cuc_pham);
    return {
      display: `${val % 1 === 0 ? val : val.toFixed(1)} Cực Phẩm`,
      badge: 'Cực Phẩm',
      tier: 'cuc_pham',
      haPhamText
    };
  }
  if (priceInHaPham >= LINH_THACH_RATES.thuong_pham) {
    const val = (priceInHaPham / LINH_THACH_RATES.thuong_pham);
    return {
      display: `${val % 1 === 0 ? val : val.toFixed(1)} Thượng Phẩm`,
      badge: 'Thượng Phẩm',
      tier: 'thuong_pham',
      haPhamText
    };
  }
  if (priceInHaPham >= LINH_THACH_RATES.trung_pham) {
    const val = (priceInHaPham / LINH_THACH_RATES.trung_pham);
    return {
      display: `${val % 1 === 0 ? val : val.toFixed(1)} Trung Phẩm`,
      badge: 'Trung Phẩm',
      tier: 'trung_pham',
      haPhamText
    };
  }

  return {
    display: `${priceInHaPham.toLocaleString()} Hạ Phẩm`,
    badge: 'Hạ Phẩm',
    tier: 'ha_pham',
    haPhamText
  };
}

