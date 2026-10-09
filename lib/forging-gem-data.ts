// lib/forging-gem-data.ts
// Dữ liệu Linh Ngọc Ngũ Hành & Bảng Thuộc Tính Ẩn (Affixes) cho Thần Binh Các

import { GemItem, GemType, AffixRarity, EquipmentAffix, Equipment } from '@/lib/types';

// ============================================
// 1. DANH MỤC LINH NGỌC NGŨ HÀNH + DỊ BIẾN
// ============================================

export interface GemColorConfig {
  name: string;
  elementLabel: string;
  themeColor: string;
  borderColor: string;
  bgGradient: string;
  glowColor: string;
  icon: string;
}

export const GEM_TYPE_CONFIGS: Record<GemType, GemColorConfig> = {
  hỏa: {
    name: 'Hỏa Linh Ngọc',
    elementLabel: 'Hỏa',
    themeColor: '#ef4444',
    borderColor: '#b91c1c',
    bgGradient: 'from-red-950/60 to-orange-950/40',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    icon: '🔥'
  },
  kim: {
    name: 'Kim Linh Ngọc',
    elementLabel: 'Kim',
    themeColor: '#f59e0b',
    borderColor: '#d97706',
    bgGradient: 'from-amber-950/60 to-yellow-950/40',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: '⚔️'
  },
  thổ: {
    name: 'Thổ Linh Ngọc',
    elementLabel: 'Thổ',
    themeColor: '#d97706',
    borderColor: '#92400e',
    bgGradient: 'from-stone-950/60 to-amber-950/40',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    icon: '🛡️'
  },
  mộc: {
    name: 'Mộc Linh Ngọc',
    elementLabel: 'Mộc',
    themeColor: '#10b981',
    borderColor: '#047857',
    bgGradient: 'from-emerald-950/60 to-teal-950/40',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    icon: '🌿'
  },
  thủy: {
    name: 'Thủy Linh Ngọc',
    elementLabel: 'Thủy',
    themeColor: '#38bdf8',
    borderColor: '#0284c7',
    bgGradient: 'from-sky-950/60 to-blue-950/40',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    icon: '💧'
  },
  lôi: {
    name: 'Lôi Linh Ngọc',
    elementLabel: 'Lôi',
    themeColor: '#a855f7',
    borderColor: '#7e22ce',
    bgGradient: 'from-purple-950/60 to-indigo-950/40',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    icon: '⚡'
  },
  phong: {
    name: 'Phong Linh Ngọc',
    elementLabel: 'Phong',
    themeColor: '#2dd4bf',
    borderColor: '#0f766e',
    bgGradient: 'from-teal-950/60 to-cyan-950/40',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    icon: '🌪️'
  }
};

const GEM_LEVEL_NAMES = ['', 'Sơ Cấp', 'Trung Cấp', 'Cao Cấp', 'Cực Phẩm', 'Thần Phẩm'];

export function createGem(gemType: GemType, level: number, quantity: number = 1): GemItem {
  const cfg = GEM_TYPE_CONFIGS[gemType];
  const lvlName = GEM_LEVEL_NAMES[level] || `Cấp ${level}`;
  const id = `gem_${gemType}_lv${level}`;

  let statBonus: GemItem['statBonus'] = {};
  let desc = '';

  switch (gemType) {
    case 'hỏa': {
      const critRate = level * 3;
      const critDmg = level * 16;
      statBonus = { baoKichRate: critRate, baoKichDmg: critDmg };
      desc = `Khảm nạm tăng +${critRate}% Bạo Kích và +${critDmg}% Sát Thương Bạo Kích.`;
      break;
    }
    case 'kim': {
      const atk = level * 50 * level; // 50, 200, 450, 800, 1250
      const armorPen = level * 3 + 2; // 5%, 8%, 11%, 14%, 17%
      statBonus = { congKich: atk, xuyenGiapRate: armorPen };
      desc = `Khảm nạm tăng +${atk} Công Kích và +${armorPen}% Xuyên Giáp phòng ngự đối phương.`;
      break;
    }
    case 'thổ': {
      const def = level * 40 * level; // 40, 160, 360, 640, 1000
      const dmgRed = level * 3; // 3%, 6%, 9%, 12%, 15%
      statBonus = { phongNgu: def, dmgReduction: dmgRed };
      desc = `Khảm nạm tăng +${def} Phòng Ngự và +${dmgRed}% Miễn Thương vật lý.`;
      break;
    }
    case 'mộc': {
      const hp = level * 400 * level; // 400, 1600, 3600, 6400, 10000
      const hpRegen = level * 1.5; // 1.5%, 3%, 4.5%, 6%, 7.5%
      statBonus = { maxKhiHuyet: hp, hpRegenPercent: hpRegen };
      desc = `Khảm nạm tăng +${hp.toLocaleString()} Khí Huyết và +${hpRegen}% Tự Hồi Huyết mỗi hiệp.`;
      break;
    }
    case 'thủy': {
      const mp = level * 300 * level; // 300, 1200, 2700, 4800, 7500
      statBonus = { maxLinhLuc: mp };
      desc = `Khảm nạm tăng +${mp.toLocaleString()} Chân Nguyên tối đa.`;
      break;
    }
    case 'lôi': {
      const spd = level * 20 + 10; // 30, 50, 70, 90, 110
      const crit = level * 2.5; // 2.5%, 5%, 7.5%, 10%, 12.5%
      statBonus = { tocDo: spd, baoKichRate: Math.round(crit) };
      desc = `Khảm nạm tăng +${spd} Tốc Độ Thân Pháp và +${Math.round(crit)}% Tỉ Lệ Bạo Kích.`;
      break;
    }
    case 'phong': {
      const spd = level * 30; // 30, 60, 90, 120, 150
      const atk = level * 30 * level; // 30, 120, 270, 480, 750
      statBonus = { tocDo: spd, congKich: atk };
      desc = `Khảm nạm tăng +${spd} Thân Pháp Tốc Độ và +${atk} Công Kích cuồng phong.`;
      break;
    }
  }

  return {
    id,
    name: `${cfg.name} (${lvlName})`,
    gemType,
    level,
    statBonus,
    description: desc,
    quantity
  };
}

// 35 mẫu Linh Ngọc toàn tập
export const ALL_GEMS_CATALOG: GemItem[] = (['kim', 'mộc', 'thủy', 'hỏa', 'thổ', 'lôi', 'phong'] as GemType[]).flatMap(gt =>
  [1, 2, 3, 4, 5].map(lvl => createGem(gt, lvl, 1))
);

// Gói Linh Ngọc Khởi Đầu tặng cho người chơi trải nghiệm ngay
export const STARTER_GEMS: GemItem[] = [
  createGem('hỏa', 2, 2),
  createGem('kim', 2, 2),
  createGem('mộc', 2, 2),
  createGem('thổ', 1, 3),
  createGem('thủy', 1, 3),
  createGem('lôi', 2, 1)
];

// ============================================
// 2. CHI PHÍ ĐỤC LỖ & TẨY LUYỆN
// ============================================

export interface SocketCost {
  slotIndex: number;
  linhThach: number;
  oreId?: string;
  oreName?: string;
  oreCount?: number;
}

export const SOCKET_PUNCH_COSTS: SocketCost[] = [
  {
    slotIndex: 0,
    linhThach: 5000
  },
  {
    slotIndex: 1,
    linhThach: 20000,
    oreId: 'ore_huyen_thiet',
    oreName: 'Huyền Thiết Khoáng',
    oreCount: 10
  },
  {
    slotIndex: 2,
    linhThach: 80000,
    oreId: 'ore_u_tinh_thach',
    oreName: 'U Tinh Thạch',
    oreCount: 20
  },
  {
    slotIndex: 3,
    linhThach: 300000,
    oreId: 'ore_thai_at',
    oreName: 'Thái Ất Thần Kim',
    oreCount: 5
  }
];

export const REFORGE_COSTS = {
  baseLinhThach: 2000,
  perLockedAffixLinhThach: 5000,
  perLockedAffixOreCount: 5,
  requiredOreId: 'ore_huyen_thiet',
  requiredOreName: 'Huyền Thiết Khoáng'
};

// ============================================
// 3. AFFIX TEMPLATES & RARITY POOL
// ============================================

export interface AffixRarityConfig {
  id: AffixRarity;
  label: string;
  weight: number;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  glowClass: string;
}

export const AFFIX_RARITY_CONFIGS: Record<AffixRarity, AffixRarityConfig> = {
  luc: {
    id: 'luc',
    label: 'Lục Phẩm (Thường)',
    weight: 50,
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-700/50',
    bgClass: 'bg-emerald-950/40',
    glowClass: ''
  },
  lam: {
    id: 'lam',
    label: 'Lam Phẩm (Khá)',
    weight: 30,
    colorClass: 'text-sky-400',
    borderClass: 'border-sky-700/50',
    bgClass: 'bg-sky-950/40',
    glowClass: 'shadow-[0_0_8px_rgba(56,189,248,0.2)]'
  },
  tim: {
    id: 'tim',
    label: 'Tím Phẩm (Hiếm)',
    weight: 14,
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-700/50',
    bgClass: 'bg-purple-950/40',
    glowClass: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]'
  },
  kim: {
    id: 'kim',
    label: 'Hoàng Kim (Cực Phẩm)',
    weight: 5,
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-600/60',
    bgClass: 'bg-amber-950/50',
    glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]'
  },
  than: {
    id: 'than',
    label: 'Hồng Hoang (Thần Phẩm)',
    weight: 1,
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-600/80',
    bgClass: 'bg-rose-950/60',
    glowClass: 'shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
  }
};

interface AffixTemplate {
  name: string;
  statKey: EquipmentAffix['statKey'];
  range: Record<AffixRarity, [number, number]>;
}

export const AFFIX_TEMPLATES: AffixTemplate[] = [
  {
    name: 'Sát Lực Bá Đạo',
    statKey: 'congKichPercent',
    range: {
      luc: [3, 6],
      lam: [7, 10],
      tim: [11, 15],
      kim: [16, 22],
      than: [25, 35]
    }
  },
  {
    name: 'Kim Thân Hộ Thể',
    statKey: 'phongNguPercent',
    range: {
      luc: [3, 6],
      lam: [7, 10],
      tim: [11, 15],
      kim: [16, 22],
      than: [25, 35]
    }
  },
  {
    name: 'Chấn Hồn Tuyệt Sát',
    statKey: 'baoKichDmg',
    range: {
      luc: [10, 18],
      lam: [20, 32],
      tim: [35, 55],
      kim: [58, 80],
      than: [85, 120]
    }
  },
  {
    name: 'Huyết Hải Thôn Phệ',
    statKey: 'hutMauRate',
    range: {
      luc: [2, 3],
      lam: [4, 5],
      tim: [6, 8],
      kim: [9, 12],
      than: [13, 18]
    }
  },
  {
    name: 'Phá Toái Hộ Giáp',
    statKey: 'xuyenGiapRate',
    range: {
      luc: [2, 4],
      lam: [5, 7],
      tim: [8, 11],
      kim: [12, 16],
      than: [18, 25]
    }
  },
  {
    name: 'Gai Nhọn Phản Kích',
    statKey: 'phanDmgRate',
    range: {
      luc: [2, 4],
      lam: [5, 7],
      tim: [8, 11],
      kim: [12, 16],
      than: [17, 24]
    }
  },
  {
    name: 'Linh Khí Thông Khiếu',
    statKey: 'tuViSpeedPercent',
    range: {
      luc: [3, 5],
      lam: [6, 9],
      tim: [10, 14],
      kim: [15, 20],
      than: [22, 30]
    }
  }
];

/**
 * Roll phẩm chất Affix theo trọng số ngẫu nhiên
 */
export function rollAffixRarity(): AffixRarity {
  const rarities: AffixRarity[] = ['luc', 'lam', 'tim', 'kim', 'than'];
  const totalWeight = rarities.reduce((sum, r) => sum + AFFIX_RARITY_CONFIGS[r].weight, 0);
  let roll = Math.random() * totalWeight;

  for (const r of rarities) {
    if (roll < AFFIX_RARITY_CONFIGS[r].weight) {
      return r;
    }
    roll -= AFFIX_RARITY_CONFIGS[r].weight;
  }
  return 'luc';
}

/**
 * Sinh ngẫu nhiên 1 dòng Affix độc lập
 */
export function generateRandomAffix(existingKeys: string[] = []): EquipmentAffix {
  // Lọc template chưa xuất hiện để tránh trùng lặp cùng 1 dòng
  const available = AFFIX_TEMPLATES.filter(t => !existingKeys.includes(t.statKey));
  const tpl = (available.length > 0 ? available : AFFIX_TEMPLATES)[
    Math.floor(Math.random() * (available.length > 0 ? available.length : AFFIX_TEMPLATES.length))
  ];

  const rarity = rollAffixRarity();
  const [minVal, maxVal] = tpl.range[rarity];
  const value = Math.floor(minVal + Math.random() * (maxVal - minVal + 1));
  const id = `affix_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    name: tpl.name,
    statKey: tpl.statKey,
    value,
    rarity,
    isLocked: false
  };
}

/**
 * Sinh ngẫu nhiên 1 dòng Affix đảm bảo tối thiểu phẩm cấp Cực Phẩm (Tím), Hoàng Kim (Vàng) hoặc Thần Phẩm (Đỏ)
 */
export function generateHighGradeAffix(existingKeys: string[] = []): EquipmentAffix {
  const available = AFFIX_TEMPLATES.filter(t => !existingKeys.includes(t.statKey));
  const tpl = (available.length > 0 ? available : AFFIX_TEMPLATES)[
    Math.floor(Math.random() * (available.length > 0 ? available.length : AFFIX_TEMPLATES.length))
  ];

  // Trọng số chọn giữa: tim (70%), kim (25%), than (5%)
  const roll = Math.random() * 100;
  let rarity: AffixRarity = 'tim';
  if (roll < 5) {
    rarity = 'than';
  } else if (roll < 30) {
    rarity = 'kim';
  } else {
    rarity = 'tim';
  }

  const [minVal, maxVal] = tpl.range[rarity];
  const value = Math.floor(minVal + Math.random() * (maxVal - minVal + 1));
  const id = `affix_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    id,
    name: tpl.name,
    statKey: tpl.statKey,
    value,
    rarity,
    isLocked: false
  };
}

/**
 * Xác định số lỗ tối đa có thể đục dựa trên phẩm cấp trang bị
 */
export function getMaxSocketsForGrade(grade: string, quality?: string): number {
  if (grade === 'Tiên Thiên Linh Bảo' || quality === 'tien_pham' || quality === 'than_pham') return 4;
  if (grade === 'Cổ Bảo' || quality === 'chi_ton' || quality === 'tuyet_pham') return 3;
  if (grade === 'Bảo Khí' || quality === 'cuc_pham' || quality === 'thuong_pham') return 2;
  return 1;
}

/**
 * Xác định số dòng thuộc tính ẩn (Affixes) ban đầu cho trang bị
 */
export function getInitialAffixCount(grade: string, quality?: string): number {
  if (grade === 'Tiên Thiên Linh Bảo' || quality === 'tien_pham' || quality === 'than_pham') return 4;
  if (grade === 'Cổ Bảo' || quality === 'chi_ton' || quality === 'tuyet_pham') return 3;
  if (grade === 'Bảo Khí' || quality === 'cuc_pham') return 3;
  if (quality === 'thuong_pham') return 2;
  return 0; // Trang bị phẩm cấp thấp không có dòng ẩn
}
