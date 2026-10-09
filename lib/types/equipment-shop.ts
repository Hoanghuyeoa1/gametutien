// lib/types/equipment-shop.ts
// Schema chuẩn cho phân hệ Trang Bị Thần Binh Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

export type EquipmentTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EquipmentSlotType =
  | 'weapon'     // Vũ khí
  | 'armor'      // Chiến giáp / Đạo bào
  | 'boots'      // Phi ngoa / Giày
  | 'accessory'; // Trang sức / Giới chỉ / Ngọc bội

export interface EquipmentItemStats {
  atk?: number;
  def?: number;
  maxHp?: number;
  speed?: number;
  critRate?: number;        // %
  critDmg?: number;         // %
  dodge?: number;           // %
  penetration?: number;     // %
  damageReduction?: number; // %
  lifesteal?: number;       // %
}

export interface EquipmentShopItem {
  id: string;
  name: string;
  tier: EquipmentTier;
  tierName: string;
  slot: EquipmentSlotType;
  slotName: string;
  description: string;
  flavorText: string;
  price: number; // Đơn giá Linh Thạch (Hạ Phẩm)
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind styling class
  stats: EquipmentItemStats;
}

export interface EquipmentStatDiff {
  current: number;
  new: number;
  delta: number;
  label: string;
  unit: string;
  isPercent: boolean;
}
