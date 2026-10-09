// lib/types/physique.ts
// Định nghĩa kiểu dữ liệu Phân Hệ "Huyền Công Luyện Thể" (Expanded Physique System)

export interface PhysiqueStatBonus {
  hp?: number;
  def?: number;
  atk?: number;
  critRate?: number;
  critDmg?: number;
  damageReduction?: number; // % giảm sát thương nhận vào
  speed?: number;
  hpRegen?: number;         // % hồi máu mỗi hiệp
  physiqueExpRate?: number; // % tốc độ exp luyện thể
  trueDmgPercent?: number;  // % sát thương chuẩn bỏ qua giáp
  counterDmgPercent?: number; // % phản đòn sát thương
  [key: string]: any;
}

export interface PhysiqueRealm {
  id: string; // 'pham_thai', 'dong_bi_thiet_cot', 'ngoc_nhu_huyet', ...
  realmIndex: number; // 0 - 9
  name: string; // "Phàm Thai", "Đồng Bì Thiết Cốt", ...
  maxStage: number; // 9 tiểu tầng
  description: string;
  lore: string;
  bodyColor: string; // Màu sắc luồng khí cơ thể
  glowColor: string; // Ánh sáng huyền quang
  baseStatsBonus: PhysiqueStatBonus;
  specialAbilityId?: string;
  specialAbilityName?: string;
  specialAbilityDesc?: string;
}

export interface PhysiqueCultivation {
  currentRealmId: string;
  currentStage: number; // 1 -> 9
  currentExp: number;
  expToNextStage: number;
  physiquePotential: number; // Điểm tiềm năng Nhục Thân
  maxPotential: number;
}

export interface PhysiquePartResourceCost {
  itemId: string;
  name: string;
  quantity: number;
}

export interface PhysiquePart {
  id: 'bi' | 'cot' | 'huyet' | 'kinh' | 'tang' | 'than' | string;
  name: string;
  subtitle: string;
  level: number;
  maxLevel: number;
  statsBonus: PhysiqueStatBonus;
  upgradeResources: PhysiquePartResourceCost[];
}

export interface PhysiqueState {
  cultivation: PhysiqueCultivation;
  parts: PhysiquePart[];
  passiveTickerTimestamp: number;
}

export interface PhysiqueItemConfig {
  id: string;
  name: string;
  type: 'exp' | 'potential' | 'breakthrough' | 'part_material';
  grade: string;
  expGain?: number;
  potentialGain?: number;
  description: string;
  icon: string;
}
