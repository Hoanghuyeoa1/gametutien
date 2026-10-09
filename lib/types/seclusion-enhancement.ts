// lib/types/seclusion-enhancement.ts
// Pure Domain Types cho Phân Hệ "Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh"
// (Seclusion Enhancement: Dao Seeds, Toxicity Cleansing, Natal Artifact Nourishing)

export type DaoSeedCategory = 'kiem_dao' | 'loi_dinh' | 'bat_tu' | 'hon_don' | 'am_duong';

export interface DaoFruitAffix {
  id: string;
  name: string;
  description: string;
  statBonus: {
    atkPercent?: number;
    defPercent?: number;
    hpPercent?: number;
    critRate?: number;
    dodgeRate?: number;
    lifestealPercent?: number;
    damageReductionPercent?: number;
  };
}

export interface DaoSeedConfig {
  id: string;
  name: string;
  category: DaoSeedCategory;
  description: string;
  requiredYears: number; // Mốc năm cần bế quan (ví dụ: 10, 15, 25, 50 năm)
  minRealmIndex: number; // Cảnh giới tối thiểu để gieo mầm
  resultingAffix: DaoFruitAffix;
  icon?: string;
}

export interface ActiveSeclusionSeedState {
  seedId: string;
  accumulatedYears: number;
  isMatured: boolean;
}

export interface DaoFruitItem {
  id: string;
  seedId: string;
  name: string;
  affix: DaoFruitAffix;
  harvestedAt: number;
  isConsumed?: boolean;
}

export interface SeclusionNourishConfig {
  divertTuViPercent: number; // 0%, 20%, 35%, 50% chuyển cho Bản Mệnh
}

export interface SeclusionExecutionResult {
  success: boolean;
  yearsPassed: number;
  tuviGainedPlayer: number;
  tuviDivertedArtifact: number;
  spiritExpGained: number;
  spiritAffinityGained: number;
  toxicityCleansed: number;
  newToxicity: number;
  newQiPurity: number;
  maturedDaoFruit: DaoFruitAffix | null;
  stageUp?: boolean;
  logs: string[];
}

export interface EnhancedSeclusionValidation {
  canSeclude: boolean;
  reason?: string;
  effectiveYears: number;
  maxAffordableYears: number;
  costLinhThach: number;
  costTichCocDan: number;
  canAfford: boolean;
  isLifespanExceeded: boolean;
  isToaHoaWarning?: boolean;
}
