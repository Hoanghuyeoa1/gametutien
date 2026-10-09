// lib/types/tu-vi-empowerment.ts
// Domain Types cho phân hệ "Vạn Năng Tu Vi: Quán Đỉnh Đạo Lữ, Khai Thông Kinh Mạch & Ngưng Đan Chân Nguyên (Tu Vi Multi-Utility & Empowerment Engine)"

export type MeridianType =
  | 'nham_mach'
  | 'doc_mach'
  | 'xung_mach'
  | 'doi_mach'
  | 'am_kieu'
  | 'duong_kieu'
  | 'am_duy'
  | 'duong_duy';

export interface MeridianStatBonus {
  maxHpPercent?: number;
  atkPercent?: number;
  defPercent?: number;
  speedBonus?: number;
  critRatePercent?: number;
  critDmgPercent?: number;
  damageReductionPercent?: number;
}

export interface MeridianCalculatedBonuses {
  maxHpPercent: number;
  atkPercent: number;
  defPercent: number;
  speedBonus: number;
  critRatePercent: number;
  critDmgPercent: number;
  damageReductionPercent: number;
}


export interface AcupointNode {
  id: string;
  name: string;
  meridianId: MeridianType;
  tuViCost: number;
  statBonus: MeridianStatBonus;
  x: number; // Tọa độ X (0 - 100%) trên sa bàn đồ họa nhân thể SVG
  y: number; // Tọa độ Y (0 - 100%) trên sa bàn đồ họa nhân thể SVG
}

export interface MeridianDefinition {
  id: MeridianType;
  name: string;
  elementColor: string; // Mã màu hex hoặc glow color
  description: string;
  completionBonusDescription: string;
  completionStatBonus: MeridianStatBonus;
  acupoints: AcupointNode[];
}

export interface TuViCrystallizeRecipe {
  id: string;
  name: string;
  tuViCost: number;
  outputItemId: string;
  storedTuVi: number;
  description: string;
  icon: string;
  grade: string;
  quality: string;
}

export interface OverdriveBuffState {
  isActive: boolean;
  tier?: number;
  statMultiplier?: number;
  remainingTurns?: number;
  tuViCostPerTurn?: number;
}

export interface TuViEmpowermentState {
  unlockedAcupointIds: string[];
  completedMeridianIds: MeridianType[];
  totalTuViInfusedToCompanions: number;
  totalTuViCrystallized: number;
  crystallizedCount?: number;
  catalystBonusPercent?: number;
  overdriveActiveTurns?: number;
  overdriveBuff?: OverdriveBuffState | null;
}

