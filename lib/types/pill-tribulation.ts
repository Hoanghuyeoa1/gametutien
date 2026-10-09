// lib/types/pill-tribulation.ts
// Domain Types cho Hệ Thống Đan Lôi Kiếp & Đan Linh Hóa Hình
// (Pill Tribulation & Living Spirits System)

export type TribulationIntensity = 'tam_trong' | 'luc_trong' | 'cuu_trong';

export interface TribulationLightningWave {
  waveIndex: number;
  strikeName: string;
  rawLightningDamage: number;
  piercePercent: number; // Tỷ lệ xuyên hộ thuẫn (0% - 100%)
  description?: string;
}

export interface PillTribulationEncounter {
  id: string;
  pillId: string;
  pillName: string;
  pillTier: number;
  intensity: TribulationIntensity;
  totalWaves: number;
  currentWave: number;
  waves: TribulationLightningWave[];
  accumulatedDamageAbsorbed: number;
  isCauldronDestroyed: boolean;
  isDefendedSuccessfully: boolean;
  isSpiritAwakened: boolean;
  basePillItem?: any;
  finalYieldCount?: number;
  veinMetadata?: any;
  startedAt: number;
}

export interface DanSpiritCompanion {
  id: string;
  name: string;
  sourcePillName: string;
  rarityTier: number; // 7, 8, 9
  element: string;
  awakenedAt: number;
  buffs: {
    gardenGrowthSpeedBonus: number; // +15% ~ +30% (ví dụ: 0.20 = 20%)
    veinQualityBonus: number;       // +10% ~ +20% (ví dụ: 15 điểm)
    explosionRiskReduction: number; // -5% ~ -15% (ví dụ: 10%)
  };
  personalityLore: string;
  avatar?: string;
}

export interface PillTribulationState {
  totalTribulationsFaced: number;
  successfulDefenses: number;
  danSpirits: DanSpiritCompanion[];
  activeTribulation: PillTribulationEncounter | null;
}

export interface LightningDefenseResult {
  success: boolean;
  isCauldronDestroyed: boolean;
  damageDealt: number;
  damageAbsorbed: number;
  updatedPlayer: any;
  logMessage: string;
  companionUsed?: string;
  encounterFinished: boolean;
  isDefendedSuccessfully: boolean;
  choice: 'player' | 'companion' | 'formation';
}

export interface FinalizeTribulationResult {
  updatedPlayer: any;
  resultPill?: any;
  awakenedSpirit?: DanSpiritCompanion | null;
  isFailed: boolean;
  logMessages: string[];
}
