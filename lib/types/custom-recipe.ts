// lib/types/custom-recipe.ts
// Domain Types cho Hệ Thống Khai Sáng Đan Phương & Đan Đạo Tông Sư
// (Custom Recipe Innovation & Alchemy Mastery System)

export type HerbThermalProperty = 'dai_han' | 'han' | 'binh' | 'nhiet' | 'dai_nhiet';

export interface HerbMedicinalProperty {
  id: string;
  name: string;
  thermal: HerbThermalProperty;
  thermalScore: number; // -2 (Đại Hàn), -1 (Hàn), 0 (Bình), +1 (Nhiệt), +2 (Đại Nhiệt)
  tonicValue: number;   // 10 - 100 (Giá trị đại bổ / dược lực căn bản)
  toxicityValue: number;// 0 - 60 (Tạp chất và đan độc cố hữu)
  element?: string;
  rarityTier: number;   // 1 - 9 (Phẩm cấp thảo mộc)
  description?: string;
}

export interface ExperimentSlot {
  herbId: string;
  herbName?: string;
  count: number;
}

export interface CustomDanRecipe {
  id: string;
  name: string;
  lore: string;
  creatorName: string;
  createdAt: number;
  fingerprint: string;
  herbsRequired: {
    herbId: string;
    herbName: string;
    count: number;
  }[];
  tier: number;
  grade: string;
  effectType: string;
  effectValue: number;
  toxicity: number;
  harmonyScore: number;
  thermalBalance: number;
  successRate: number;
  isArchivedInSect?: boolean;
}

export interface ExperimentEvaluationResult {
  isHarmonious: boolean;
  thermalBalance: number;
  tonicRatio: number;
  predictedGrade: string;
  predictedTier: number;
  predictedEffectValue: number;
  predictedToxicity: number;
  harmonyScore: number;
  message: string;
  reason?: string;
}

export interface CustomRecipeState {
  discoveredRecipes: CustomDanRecipe[];
  totalResearchAttempts: number;
  sectArchivedRecipeIds: string[];
}
