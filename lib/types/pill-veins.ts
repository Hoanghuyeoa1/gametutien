// lib/types/pill-veins.ts
// Domain Types cho Hệ Thống Đan Văn Cửu Trọng (Pill Veins System) & Dược Tính Biến Dị (Medicinal Mutagenesis)

export type PillVeinTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type MutagenicAffixType = 
  | 'max_hp_percent'
  | 'lifesteal_percent'
  | 'cast_speed_percent'
  | 'crit_resist_percent'
  | 'fire_resist_percent'
  | 'lightning_resist_percent'
  | 'ice_resist_percent';

export interface PillMutationData {
  affixType: MutagenicAffixType;
  affixName: string;
  value: number; // Ví dụ: 0.5 (%)
  description: string;
}

export interface VeinedPillMetadata {
  veinCount: PillVeinTier;
  veinMultiplier: number;        // 1.0 (0 văn) -> 2.0 (9 văn)
  toxicityMultiplier: number;    // 1.0 (0 văn) -> 0.0 (9 văn)
  toxicityBurnPercent?: number;  // % Đan độc gốc bị Dị Hỏa thiêu rụi (0% - 60%)
  flameId?: string;              // Dị hỏa đã trợ lực luyện mẻ đan này
  mutation?: PillMutationData | null;
  isPrimordial?: boolean;        // Thần đan thăng hoa sau khi vượt qua Đan Lôi Kiếp
  primordialAura?: {
    id: string;
    name: string;
    description: string;
    potencyBoostPercent: number;
    durationHours?: number;
  };
}

export interface CatalystItemConfig {
  itemId: string;
  name: string;
  targetAffixType: MutagenicAffixType;
  mutationChanceBonus: number;   // +10% ~ +35%
  veinQualityBonus: number;      // Tăng xác suất ra đan văn cao (điểm cộng trọng số)
  description: string;
}

export interface PillCraftingResult {
  basePillId: string;
  basePillName: string;
  veinCount: PillVeinTier;
  finalYieldCount: number;
  veinMetadata: VeinedPillMetadata;
  isExploded?: boolean;
  logMessages: string[];
  tribulationTriggered?: boolean;
  tribulationEncounter?: import('./pill-tribulation').PillTribulationEncounter;
}
