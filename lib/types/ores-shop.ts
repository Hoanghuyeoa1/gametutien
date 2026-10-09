// lib/types/ores-shop.ts
// Schema chuẩn cho phân hệ Khoáng Thạch Linh Quặng Cửu Giai (Tier 1 -> Tier 9)

export type OreTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type OreCategory =
  | 'phoi_ren'   // Cương thiết phôi khoáng (Rèn đúc trang bị)
  | 'linh_tinh'  // Linh tinh bí ngân (Dẫn khí, khảm nạm pháp bảo)
  | 'ho_cuong'   // Hộ cương thần nham (Phòng ngự, gia cố cứ điểm Tinh Hải)
  | 'di_quang';  // Tiên thiên dị quáng (Thần binh cực phẩm, tinh hải)

export type OreHardness = 'so_cap' | 'trung_cap' | 'cao_cap' | 'cuc_pham' | 'than_pham';

export interface OreShopItem {
  id: string;
  name: string;
  tier: OreTier;
  tierName: string;
  category: OreCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  price: number; // Đơn giá Linh Thạch (Hạ Phẩm)
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind styling class
  primaryForgingUse: string; // Tên trang bị hoặc công năng tiêu biểu
  elementalAffinity: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho' | 'hon_don';
  hardnessGrade: OreHardness;
}
