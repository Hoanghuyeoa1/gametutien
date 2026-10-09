// lib/types/cultivation.ts
import { Pill, Herb, Ore } from './items';
import { LinhDienState } from './garden';

export type CultivateStance = 'co_ban' | 'hiem_canh' | 'doat_bao' | 'normal' | 'breakthrough' | 'safe' | 'aggressive' | string;

export interface CultivateEncounterEvent {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  category?: 'tam_ma' | 'bien_co' | string;
  type?: string;
  rewards?: any;
  choices?: any[];
  [key: string]: any;
}

export interface CultivateSummaryData {
  stance: CultivateStance;
  duration?: number;
  roundsCompleted?: number;
  totalTuVi?: number;
  totalLinhLuc?: number;
  totalLinhThach?: number;
  totalLinhThachTrungPham?: number;
  tuViGain: number;
  linhThachGain: number;
  trungPhamLinhThachGain: number;
  tinhHuyetGain: number;
  ngoTinhGain: number;
  khiVanGain: number;
  bodyExpGain: number;
  tamMaTriggered?: boolean;
  tamMaRounds?: number;
  events: CultivateEncounterEvent[];
  drops?: CultivateDropItem[];
  message?: string;
  [key: string]: any;
}

export interface LogEntry {
  id: string;
  timestamp: string | number;
  title: string;
  content?: string;
  description?: string;
  type: 'cultivation' | 'breakthrough' | 'combat' | 'event' | 'sect' | 'companion' | 'special' | 'danger' | string;
  [key: string]: any;
}

export interface Realm {
  id: number;
  name: string;
  stage: string;
  tier: string;
  emoji: string;
  description: string;
  requirements: {
    tuVi: number;
    linhThach: number;
    coduyen?: string;
    bossRequired?: string;
    thienKiep?: boolean;
    [key: string]: any;
  };
  breakthrough: {
    baseSuccessRate: number;
    tamMaChance: number;
    failureRisks: string[];
    rewardOnSuccess: {
      tuVi: number;
      linhThach: number;
      danhVong: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  possibleEvents: string[];
  successText: string;
  [key: string]: any;
}

export interface CultivationSession {
  duration: number;
  tuViGain: number;
  randomEvents: RandomEvent[];
  stance?: CultivateStance;
  stanceMultiplier?: number;
  [key: string]: any;
}

export interface CultivateDropItem {
  id?: string;
  name: string;
  type?: 'herb' | 'ore' | 'pill' | 'equipment' | 'manual' | 'tinhHuyet' | 'linhThach' | 'trungPhamLinhThach' | string;
  quantity: number;
  count?: number;
  quality?: string;
  grade?: string;
  description?: string;
  data?: any;
  [key: string]: any;
}

export interface CultivationResult {
  tuViGain: number;
  linhLucGain?: number;
  drops: CultivateDropItem[];
  tamMaTriggered?: boolean;
  message?: string;
  [key: string]: any;
}

export interface BreakthroughResult {
  success: boolean;
  message: string;
  nextRealmId?: number;
  tamMaFaced?: boolean;
  penalty?: {
    tuViLost?: number;
    injured?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  availableFrom: number;
  availableTo: number;
  triggerChance: number;
  khiVanModifier: number;
  choices: EventChoice[];
  [key: string]: any;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: {
    ngoTinh?: number;
    tamCanh?: number;
    khiVan?: number;
    linhThach?: number;
    [key: string]: any;
  };
  outcomes: EventOutcome[];
  [key: string]: any;
}

export interface EventOutcome {
  probability: number;
  description: string;
  effects: {
    tuVi?: number;
    canCot?: number;
    ngoTinh?: number;
    khiVan?: number;
    tamCanh?: number;
    linhThach?: number;
    danhVong?: number;
    khiHuyet?: number;
    specialReward?: string;
    [key: string]: any;
  };
  flavor: string;
  [key: string]: any;
}

export interface OfflineProgressItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  quality?: string;
  grade?: string;
  [key: string]: any;
}

export interface OfflineProgressResult {
  elapsedSeconds: number;
  creditedSeconds: number;
  maxCapSeconds: number;
  isCapped: boolean;
  tuViGain?: number;
  tuViGained: number;
  linhThachGain?: number;
  linhThachGained: number;
  maturedPlotsCount: number;
  drops?: CultivateDropItem[];
  bonusItems: (CultivateDropItem | OfflineProgressItem)[];
  herbsGrown?: number;
  updatedLinhDien?: LinhDienState;
  meditationOfflineResult?: any;
  [key: string]: any;
}

export type LogType = 'cultivation' | 'breakthrough' | 'combat' | 'event' | 'sect' | 'companion' | 'secretRealm' | 'auction' | string;
export type DualCultivationType = 'exp' | 'breakthrough' | 'soul' | 'stats' | string;

export interface SoundSettings {
  isMuted?: boolean;
  muted?: boolean;
  bgmVolume: number;
  sfxVolume: number;
  [key: string]: any;
}

export type SFXType = 'breakthrough' | 'cultivate' | 'combat_hit' | 'crit' | 'event' | 'reward' | 'click' | string;

// ============================================
// HỆ THỐNG TU LUYỆN THẦN HỒN & PHÂN THẦN DU NGOẠN
// ============================================

export interface SoulStageConfig {
  id: string;
  name: string;                  // vd: "Khai Mở Thức Hải", "Ngưng Hồn Hóa Kiếm"
  tier: number;                  // 1, 2, 3, 4
  description: string;
  maxSubTiers: number;           // 9
  baseExpRequired: number;
  statBonusPerTier: {
    maxMp: number;
    thanThuc: number;
    critRate?: number;
    spiritDmgBonus?: number;
  };
  upgradeCosts: {
    linhThach: number;
    soulStoneId: string;         // 'item_u_hon_thach'
    soulStoneCount: number;
    soulPillId?: string;         // 'item_duong_than_dan'
    soulPillCount?: number;
  };
}

export type ExpeditionDestinationId = 'duoc_vuong_coc' | 'thai_hu_khoang' | 'co_tu_tan_dong';

export interface SoulExpeditionState {
  isActive: boolean;
  destination: ExpeditionDestinationId;
  destinationName?: string;
  startTime: number;
  durationMs: number;
  claimed: boolean;
  rewardSummary?: string;
  rewards?: {
    tuVi?: number;
    linhThach?: number;
    items?: Array<{ id: string; name: string; type: string; quantity: number }>;
  };
}

export interface PlayerSoulState {
  currentStageIndex: number;     // 0: Khai Mở Thức Hải, 1: Ngưng Hồn Hóa Kiếm, 2: Nguyên Thần Xuất Khiếu, 3: Dương Thần Viên Mãn
  currentSubTier: number;        // 1 - 9
  currentExp: number;
  expeditionState?: SoulExpeditionState | null;
}
