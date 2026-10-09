// lib/types/dao-foundation.ts
// Domain Types cho phân hệ:
// "Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa (Dao Foundation Grades & Major Realm Transcendence)"
// 100% Strict TypeScript, Immutable Contracts, Zero Mutation

export type DaoFoundationGrade = 'ha_pham' | 'dia_pham' | 'thien_dao';

export interface InnateTalentDefinition {
  id: string;
  name: string;
  grade: DaoFoundationGrade;
  realmOrigin: string;
  description: string;
  lore: string;
  statModifiers: {
    allResistPercent?: number;
    critDamageMultiplier?: number;
    maxHpPercent?: number;
    qiRegenBonusPercent?: number;
    breakthroughSuccessBonus?: number;
  };
}

export interface DaoFoundationConfig {
  grade: DaoFoundationGrade;
  title: string;
  statMultiplier: number; // 1.0, 1.3, 1.6 / 1.7 / 1.8
  requiredPillItemId?: string;
  requiredPillName?: string;
  requireNineVeinsPill?: boolean;
  maxAllowedToxicity: number; // 100, 30, 0
  minRequiredQiPurity: number; // 0, 80, 100
  extraTuviCost: number;
  extraSpiritStonesCost: number;
  innateTalent?: InnateTalentDefinition;
  phenomenonName?: string;
  phenomenonDescription?: string;
}

export interface MajorRealmTransitionConfig {
  transitionId: string;
  fromRealmId: string;
  toRealmId: string;
  transitionName: string;
  foundations: Record<DaoFoundationGrade, DaoFoundationConfig>;
}

export interface FoundationValidationResult {
  canAttempt: boolean;
  reasons: string[];
  missingItems: string[];
}
