// lib/types/alchemy-tactics.ts
// Domain Types cho Phân Hệ: Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ
// (Tactical Heat Stances & Herbal Archetype Matrix)

export type HerbRoleType = 'quan' | 'than' | 'ta' | 'su';
export type TacticalHeatStance = 'van_hoa' | 'vu_hoa' | 'van_vu_song_hanh';

export interface HerbRoleMetadata {
  id: string;
  name: string;
  role: HerbRoleType;
  primaryEffect: 'base_pill_type' | 'potency_boost' | 'toxicity_suppress' | 'vein_conduit';
  powerValue: number; // Hệ số hiệu lực (ví dụ: +45% potency, -50% toxicity, +35% vein)
  elementalAffinity: 'Kim' | 'Moc' | 'Thuy' | 'Hoa' | 'Tho' | 'Loi' | 'Phong' | 'Am' | 'Duong' | 'Than';
  pillTypeCreated?: 'tu_vi' | 'huyet_khi' | 'dot_pha' | 'tay_tuy';
  basePotencyValue?: number;
  baseToxicityValue?: number;
  description: string;
}

export interface TacticalHerbSlot {
  herbItemId: string | null;
  herbName?: string;
  role: HerbRoleType;
  count: number;
}

export interface ConcoctionSetup {
  quan: TacticalHerbSlot;
  than?: TacticalHerbSlot | null;
  ta?: TacticalHerbSlot | null;
  su?: TacticalHerbSlot | null;
  stance: TacticalHeatStance;
  batchMultiplier: number; // 1 (mặc định), hoặc 5, 10 khi dùng Vũ Hỏa
}

export interface ConcoctionPreviewResult {
  basePillName: string;
  basePillId: string;
  predictedPotencyMultiplier: number;
  effectivePotencyValue: number;
  predictedToxicityReductionPercent: number;
  effectiveToxicityValue: number;
  veinQualityBonusPercent: number;
  explosionRiskPercent: number;
  elementalMutationType?: string;
  harmonyScore: number; // 0 - 100 điểm hòa hợp âm dương ngũ hành
  canCraft: boolean;
  requiredHerbsSummary: {
    herbId: string;
    herbName: string;
    requiredCount: number;
    ownedCount: number;
  }[];
  errorMessage?: string;
}

export interface TacticalAlchemyExecutionResult {
  success: boolean;
  isExploded: boolean;
  pillsCraftedCount: number;
  basePillId: string;
  basePillName: string;
  effectivePotency: number;
  effectiveToxicity: number;
  veinTierRolled: number;
  mutationRolled?: any;
  salvagedHerbsCount: number;
  logs: string[];
  message: string;
  updatedPlayer?: any;
  tribulationTriggered?: boolean;
  tribulationEncounter?: import('./pill-tribulation').PillTribulationEncounter;
}

export interface ConcoctionHistoryEntry {
  timestamp: number;
  pillName: string;
  veinCount: number;
  potency: number;
  toxicity: number;
  stance: TacticalHeatStance;
  herbsUsed: string[];
}

export interface AlchemyTacticsState {
  defaultStance: TacticalHeatStance;
  customConcoctionsHistory: ConcoctionHistoryEntry[];
}
