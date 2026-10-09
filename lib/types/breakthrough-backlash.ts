// lib/types/breakthrough-backlash.ts
// Domain Types cho phân hệ:
// "Tác Động Của Đan Độc & Tâm Ma Phản Phệ (Inner Demon & Pill Toxicity Backlash System)"
// 100% Strict TypeScript, Immutable Contracts, Zero Side Effects

export type BacklashType = 'nhe' | 'tan_khi' | 'trong_thuong' | 'tam_ma';

export type ToxicityStatusTag = 'tinh_khiet' | 'binh_thuong' | 'tac_nghen' | 'tam_ma_nguy_hiem';

export interface BacklashHistoryEntry {
  timestamp: number;
  failedRealm: string;
  toxicityAtAttempt: number;
  hpLost: number;
  tuviLost: number;
  backlashType: BacklashType;
}

export interface PlayerInjuryState {
  isInjured: boolean;
  injurySeverity: number; // 0: Khỏe, 1: Bất ổn, 2: Trọng thương
  hasDemonicBottleneck: boolean;
  bottleneckPenaltyPercent: number; // Mặc định 50%
  injuredAt?: number;
  backlashHistory: BacklashHistoryEntry[];
}

export interface ToxicityModifierResult {
  toxicity: number;
  rateModifier: number; // +0.10, 0.00, -0.20, -0.40
  statusTag: ToxicityStatusTag;
  warningMessage?: string;
}

export interface BacklashResolutionResult {
  backlashType: BacklashType;
  hpLoss: number;
  tuviLoss: number;
  resultingHp: number;
  isInjuredApplied: boolean;
  isBottleneckApplied: boolean;
  logMessage: string;
}
