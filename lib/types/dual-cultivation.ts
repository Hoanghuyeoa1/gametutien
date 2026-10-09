// lib/types/dual-cultivation.ts
// ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO HỆ THỐNG BIẾN CỐ NGẪU NHIÊN KHI SONG TU (DUAL CULTIVATION DYNAMIC EVENTS)

import type { PlayerStats } from './player';
import type { CompanionDefinition, CompanionPlayerState } from './companions';

export type DualEventType = 'epiphany' | 'demonic_hazard' | 'harmony' | 'tribulation';

export type EventChoiceOutcomeType =
  | 'breakthrough_tuvi'
  | 'cleanse_karma'
  | 'gain_aura'
  | 'partner_exhaustion'
  | 'stat_boost';

export interface DualEventChoiceCondition {
  minRealmIndex?: number;
  minAffection?: number;
  maxDemonicNature?: number;
  requiredItemCost?: {
    itemId: string;
    count: number;
    name: string;
  };
}

export interface DualEventChoiceOutcome {
  type: EventChoiceOutcomeType;
  cultivationMultiplier?: number; // Ví dụ: +200% tu vi chu kỳ (multiplier = 3.0)
  tuviGain?: number;
  demonicDelta?: number;         // Âm là trừ ma tính, dương là tăng ma tính
  affectionDelta?: number;       // Tăng/giảm hảo cảm (affinity)
  partnerFatigue?: number;       // Thời gian đạo lữ cần nghỉ ngơi (ms)
  appliedBuffId?: string;        // Khí tức song tu hộ thể / Hào quang
  logMessage: string;
}

export interface DualEventChoice {
  id: string;
  text: string;
  description: string;
  condition?: DualEventChoiceCondition;
  outcome: DualEventChoiceOutcome;
}

export interface DualCultivationEvent {
  id: string;
  title: string;
  narrative: string;
  type: DualEventType;
  minAffection: number;
  maxAffection?: number;
  minDemonicNature?: number;
  maxDemonicNature?: number;
  requiredPartnerTier: number; // 9 cho Đạo Lữ Cửu Giai (Thần Cấp / Tiên Thiên Đạo Lữ)
  backgroundEffect?: 'golden_zen' | 'crimson_demonic' | 'yin_yang_flow';
  choices: DualEventChoice[];
  weight?: number;
}

export interface DualEventHistoryRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  choiceId: string;
  partnerId: string;
  partnerName: string;
  timestamp: number;
  logMessage: string;
  demonicDelta?: number;
  affectionDelta?: number;
}

export type CompanionWithState = CompanionDefinition & Partial<CompanionPlayerState>;

export interface DualEventResolutionResult {
  updatedPlayer: PlayerStats;
  updatedPartner: CompanionWithState;
  resultLog: string;
  success: boolean;
  consumedItem?: {
    itemId: string;
    name: string;
    count: number;
  };
}
