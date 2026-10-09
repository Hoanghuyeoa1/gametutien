// lib/types/herbs-shop.ts
// Schema chuẩn cho phân hệ Dược Thảo Linh Dược Cửu Giai (Tier 1 -> Tier 9)

export type HerbTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type HerbCategory = 
  | 'duong_khi'   // Dưỡng khí thảo (Luyện đan tu vi)
  | 'pha_canh'    // Phá cảnh dị dược (Luyện đan đột phá)
  | 'dien_tho'    // Diên thọ thần chi (Luyện đan thọ mệnh, giải đan độc)
  | 'di_chung';   // Tiên thiên dị chủng (Luyện đan thuộc tính, tẩy tủy)

export interface HerbShopItem {
  id: string;
  name: string;
  tier: HerbTier;
  tierName: string;
  category: HerbCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  price: number; // Đơn giá Linh Thạch
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind styling class
  primaryAlchemyUse: string; // Tên đan dược mục tiêu thường dùng để luyện
  elementalAffinity: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho' | 'hon_don';
  rarityGrade: 'ha' | 'trung' | 'thuong' | 'cuc' | 'than';
}
