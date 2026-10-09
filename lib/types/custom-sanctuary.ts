// lib/types/custom-sanctuary.ts
// Domain Types cho Hệ Thống Linh Mạch Động Phủ Tự Chế (Custom Sanctuary & Vein Socketing)

export type SanctuaryVeinTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SocketedFormationData {
  socketIndex: number;
  arrayItemId: string;
  arrayName: string;
  arrayTier: number;
  element?: string;
  isPermanent: boolean;
  baseEfficiencyBonus: number;
  socketedAt: number;
}

export interface SanctuaryResonanceEffects {
  cultivationSpeedMultiplier?: number; // Hệ số tốc độ tu vi (+15% ~ +50%, e.g. 1.35 = +35%)
  offlineAbsorptionBonus?: number;     // Tỷ lệ hấp thu ngoại tuyến
  pillToxicityCleansePerHour?: number; // Tự động giảm đan độc mỗi giờ
  demonicCleansePerHour?: number;      // Tự động giảm ma tính mỗi giờ
  gardenYieldBonus?: number;           // Tăng sản lượng Linh Điền / Dược Viên (+30%)
  breakthroughChanceBonus?: number;    // Tăng tỷ lệ đột phá khi bế quan tại Động Phủ
  hazardRiskReduction?: number;        // Giảm tỷ lệ rủi ro đứt đoạn khi nhập định ở Hiểm Cảnh
}

export interface SanctuaryResonanceCombo {
  id: string;
  name: string;
  description: string;
  requiredArrayTypes: string[];        // Điều kiện loại trận / tên / hệ nguyên tố
  bonusEffects: SanctuaryResonanceEffects;
}

export interface CustomSanctuaryState {
  veinTier: SanctuaryVeinTier;
  veinExp: number;
  unlockedSockets: number;             // 1 - 5
  socketedArrays: SocketedFormationData[];
  activeResonances: SanctuaryResonanceCombo[];
  customLocationName: string;
}

export interface SanctuaryVeinTierConfig {
  tier: SanctuaryVeinTier;
  name: string;
  unlockedSockets: number;
  requiredRealmIndex: number;
  costLinhThach: number;
  costForgingEssence: number;
  tuviBaseMultiplier: number;
  description: string;
  icon: string;
  colorClass: string;
}
