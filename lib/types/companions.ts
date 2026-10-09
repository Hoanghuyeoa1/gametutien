// lib/types/companions.ts
import { LinhCanElement } from './character';
import { CombatStats } from './combat';

export interface CompanionBuff {
  cultivateSpeedBonus?: number;
  tamMaDamageReduction?: number;
  critDmgBonus?: number;
  lifestealPercent?: number;
  alchemySuccessBonus?: number;
  dailyRandomPill?: boolean;
  atkBonusPercent?: number;
  defBonusPercent?: number;
  hpBonusPercent?: number;
  bossAssistChance?: number;
  ngoTinhBonus?: number;
  khiVanBonus?: number;
  soulBonus?: number;
  dodgeBonus?: number;
  speedBonus?: number;
  unlockHiddenEncounters?: boolean;
  iceResistance?: number;
  freezeChance?: number;
  critRateBonus?: number;
  burnDrainChance?: number;
  hpRegenPercent?: number;
  lightningDamageBonus?: number;
  stunBossChance?: number;
  merchantDiscountPercent?: number;
  enemyAtkReduction?: number;
  swordManualBonusPercent?: number;
  [key: string]: any;
}

export interface CompanionCombinedSkill {
  id?: string;
  name: string;
  desc?: string;
  description?: string;
  quote?: string;
  triggerChance?: number;
  damageMultiplier: number;
  healPercent?: number;
  shieldPercent?: number;
  effect?: string;
  [key: string]: any;
}

export interface CompanionDefinition {
  id: string;
  name: string;
  title: string;
  avatar: string;
  element?: LinhCanElement;
  description?: string;
  affinity?: number;
  maxAffinity?: number;
  stage?: number;
  buffs: CompanionBuff;
  combinedSkill: CompanionCombinedSkill;
  giftPreferences?: string[];
  unlockedStoryEncounters?: string[];
  initialRealm?: string;
  realmIndex: number;
  favoriteGifts: string[];
  favoriteDescription?: string;
  secretBackground?: string;
  storyQuest?: any;
  [key: string]: any;
}

export interface CompanionPlayerState {
  id: string;
  isMet?: boolean;
  affinity: number;
  isBonded: boolean;
  bondedAt?: number;
  lastSongTuTime?: number;
  lastChatTime?: number;
  totalSongTuCount?: number;
  questStarted?: boolean;
  questCompleted?: boolean;
  tokenEquipped?: boolean;
  tokenName?: string;
  tokenDescription?: string;
  tokenIcon?: string;
  assignedGarden?: boolean;
  lastSongTuType?: 'tu_vi' | 'linh_luc' | 'tam_than' | 'luyen_the' | string;
  fatigueUntil?: number;        // Thời gian đạo lữ kiệt sức sau khi hộ pháp trừ ma (ms)
  totalEpiphanies?: number;     // Số lần đốn ngộ song tu cùng đạo lữ
  isAssignedToMeditation?: boolean; // Khóa khi đang hộ pháp nhập định
  tuvi?: number;                // Tu vi tích lũy của đạo lữ
  [key: string]: any;
}

export type Companion = CompanionDefinition & Partial<CompanionPlayerState>;

export interface CompanionsDataState {
  activeCompanionId?: string | null;
  stationedGardenCompanionId?: string | null;
  tamThanHopNhatUntil?: number;
  companions: Record<string, CompanionPlayerState>;
  tamTinhThanDieuUntil?: number;
  [key: string]: any;
}

// CompanionsDataState defined as interface above

