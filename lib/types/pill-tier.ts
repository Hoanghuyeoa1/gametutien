// lib/types/pill-tier.ts
// Định nghĩa kiểu dữ liệu chuẩn cho hệ thống Đan Dược từ Nhất Giai đến Cửu Giai

export type PillTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type PillCategory = 
  | 'tu_vi'        // Tăng trực tiếp điểm tu vi
  | 'breakthrough' // Tăng tỷ lệ % thành công khi đột phá cảnh giới tương ứng
  | 'lifespan'     // Tăng năm thọ nguyên tối đa
  | 'stat_boost'   // Tăng vĩnh viễn Căn Cốt, Ngộ Tính, Khí Vận, Thần Thức
  | 'healing'      // Hồi phục HP, thanh tẩy tâm ma
  | 'special';     // Tẩy tủy, dị biến linh căn, v.v.

export interface PillEffects {
  tuViGain?: number;
  breakthroughBonusPercent?: number; // Ví dụ: +15% tỷ lệ đột phá
  lifespanYears?: number;            // Ví dụ: +20 năm thọ nguyên
  canCotBonus?: number;
  ngoTinhBonus?: number;
  khiVanBonus?: number;
  thanThucBonus?: number;
  maxHpPercentBonus?: number;
  damageReductionPercent?: number;
  critDmgPercent?: number;
  speedBonusPercent?: number;
  fullHeal?: boolean;
  preventDeathOnce?: boolean;
  reduceTribulationDamagePercent?: number;
  toxicityPercent?: number;          // Điểm đan độc tích lũy
}

export interface PillDefinition {
  id: string;
  name: string;
  tier: PillTier;
  tierName: string; // "Nhất Giai", "Nhị Giai" ... "Cửu Giai"
  category: PillCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  colorGrade: string; // Tailwind text/border classes
  price: number;      // Giá bán Linh Thạch
  requiredRealmIndex: number; // Cảnh giới tối thiểu để mua/dùng
  requiredRealmName: string;
  effects: PillEffects;
  maxUsagePerRealm?: number; // Giới hạn số viên được cắn trong 1 đại cảnh giới
}
