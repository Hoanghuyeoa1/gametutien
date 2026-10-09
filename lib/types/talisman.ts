// lib/types/talisman.ts
// Kiểu dữ liệu cho phân hệ Phù Đạo Bách Nghệ • Phù Lục Các

export type TalismanType = 'combat' | 'breakthrough' | 'utility';
export type TalismanTrigger = 'turn_start' | 'hp_low' | 'manual' | 'breakthrough';

export interface TalismanMaterial {
  itemId: string;
  name: string;
  quantity: number;
}

export interface TalismanCombatEffect {
  shieldAmountPercent?: number;    // % Max HP hấp thụ sát thương
  flatDamageMultiplier?: number;   // Hệ số sát thương nổ (vd: 2.0 = 200% ATK)
  stunChance?: number;             // Xác suất định thân/choáng đối thủ (0 - 100%)
  healPercent?: number;            // % HP hồi phục tức thì
  evasionBuffPercent?: number;     // % Né tránh cộng thêm
  durationTurns?: number;          // Số hiệp duy trì hiệu ứng
  burnPercent?: number;            // % HP thiêu đốt mỗi hiệp
  ignoreDefense?: boolean;         // Xuyên thấu 100% giáp / True damage
  description?: string;
}

export interface TalismanBreakthroughEffect {
  tamMaResistBonus?: number;         // +% Kháng Tâm Ma
  tribulationDmgReduction?: number;  // % Giảm sát thương Thiên Kiếp
  breakthroughSuccessBonus?: number; // +% Tỉ lệ đột phá thành công
  description?: string;
}

export interface TalismanUtilityEffect {
  cultivationSpeedBonus?: number;   // +% Tốc độ bế quan tu luyện
  secretRealmSpeedBonus?: number;   // +% Tốc độ di chuyển Bí Cảnh
  ambushReductionChance?: number;   // % Giảm tỷ lệ quái vật phục kích
  durationHours?: number;           // Số giờ hiệu lực
  description?: string;
}

export interface TalismanRecipe {
  id: string;
  name: string;
  type: TalismanType;
  tier: number; // 1 - 9
  grade: string;
  description: string;
  requiredArtisanLevel: number;
  requiredMaterials: TalismanMaterial[];
  linhThachCost: number;
  baseSuccessRate: number; // 0 - 100%
  baseExpGain: number;
  triggerType: TalismanTrigger;
  triggerConditionValue?: number; // Ví dụ: hp_low <= 15 (máu dưới 15%)
  combatEffect?: TalismanCombatEffect;
  breakthroughEffect?: TalismanBreakthroughEffect;
  utilityEffect?: TalismanUtilityEffect;
}

export interface TalismanItem {
  id: string;
  recipeId: string;
  name: string;
  type: TalismanType;
  tier: number;
  grade: string;
  quantity: number; // Số lượng bùa tích lũy (stackable)
  description: string;
  triggerType: TalismanTrigger;
  triggerConditionValue?: number;
  combatEffect?: TalismanCombatEffect;
  breakthroughEffect?: TalismanBreakthroughEffect;
  utilityEffect?: TalismanUtilityEffect;
}

export interface TalismanBeltSlot {
  slotIndex: number; // 0, 1, 2 (Tối đa 3 slot xuất chiến)
  talismanId: string | null;
}

export interface TalismanArtisan {
  level: number; // 1 - 9
  exp: number;
  maxExp: number;
  totalCrafted?: number;
  learnedRecipeIds: string[];
}
