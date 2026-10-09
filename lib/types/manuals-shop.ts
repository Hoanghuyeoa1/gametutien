// lib/types/manuals-shop.ts
// Domain Types cho Hệ Thống Công Pháp Bí Tịch Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

export type ManualTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type ManualCategory = 
  | 'cong_kich'  // Công kích bí điển
  | 'phong_ngu'  // Hộ thể cương khí
  | 'than_phap'  // Thân pháp bộ pháp
  | 'cam_thuat'; // Tâm thần cấm thuật

export interface ManualStatsModifiers {
  atkPercent?: number;              // +% Công kích
  defPercent?: number;              // +% Phòng ngự
  speedFlat?: number;               // + Điểm thân pháp (tốc độ chiến đấu)
  dodgePercent?: number;            // +% Né tránh
  critRatePercent?: number;         // +% Tỷ lệ bạo kích
  critDmgPercent?: number;          // +% Sát thương bạo kích
  damageReductionPercent?: number;  // +% Miễn thương
  lifestealPercent?: number;        // +% Hút máu
  penetrationPercent?: number;      // +% Xuyên giáp
  maxHpPercent?: number;            // +% Khí huyết tối đa
}

export type RequiredManualStatsModifiers = Required<ManualStatsModifiers>;

export interface ManualShopItem {
  id: string;
  name: string;
  tier: ManualTier;
  tierName: string;
  category: ManualCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  price: number;
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind border/text class
  statModifiers: ManualStatsModifiers;
}

export interface PlayerManualsState {
  learnedManualIds: string[];         // Danh sách ID công pháp đã lĩnh ngộ
  equippedManualIds?: string[];       // Danh sách công pháp gắn vào ô kích hoạt (nếu có hệ thống slot)
}
