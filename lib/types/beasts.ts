// lib/types/beasts.ts
import { LinhCanElement } from './character';

export type BeastQuality = 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'tuyet_pham' | 'than_pham' | 'thien_pham' | 'tien_pham' | string;
export type SpiritBeastStage = 1 | 2 | 3 | 4 | number;
export type BeastRole = 'combat' | 'mount' | 'guardian' | 'assist' | string;

export interface SpiritBeastStats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  blockPercent: number;
  mountSpeedBonus: number;
  mpRegenBonus: number;
  [key: string]: any;
}

export interface SpiritBeastSkill {
  id?: string;
  name: string;
  desc?: string;
  description?: string;
  effect?: string;
  stageReq?: number;
  damageMultiplier?: number;
  triggerChance?: number;
  [key: string]: any;
}

import { 
  BeastElement, 
  BloodlineTier, 
  BeastCombatStats, 
  BeastInnateAura, 
  BeastGardenFacility, 
  BeastGardenState,
  BreedingCatalystItem,
  BreedingPairSession 
} from './beast-breeding';

export * from './beast-breeding';

export interface SpiritBeast {
  id: string;
  name: string;
  species: string;
  speciesId?: string;
  quality: BeastQuality | string;
  element: LinhCanElement | BeastElement | string;
  level: number;
  maxLevel?: number;
  exp: number;
  maxExp: number;
  star?: number;
  maxStar?: number;
  atkBonus?: number;
  defBonus?: number;
  hpBonus?: number;
  speedBonus?: number;
  stage: SpiritBeastStage;
  stageName?: string;
  loyalty: number;
  role?: BeastRole | string;
  stats: SpiritBeastStats;
  skills: SpiritBeastSkill[];
  avatar: string;
  description?: string;
  isDeployed?: boolean;

  // Thuộc tính Tiến Hóa Huyết Mạch & Lai Tạo (Beast Breeding & Bloodline)
  tier?: BloodlineTier;
  bloodlinePurity?: number;       // 0 - 100%
  generation?: number;            // 0: F0, 1: F1, 2: F2...
  isHybrid?: boolean;             // Biến chủng lai tạo
  canMount?: boolean;             // Có thể cưỡi (Tọa Kỵ)
  canFight?: boolean;             // Có thể xuất chiến (Chiến Thú)
  travelSpeedBonus?: number;      // % Tăng tốc thám hiểm / di chuyển
  combatStats?: BeastCombatStats; // ATK, DEF, HP, critRate thưởng chiến đấu
  innateAura?: BeastInnateAura;   // Hào quang thiên phú độc nhất
  breedingCooldownEnd?: number;   // Timestamp hết thời gian chờ giao phối
  isLockedInBreeding?: boolean;   // Khóa khi đang trong buồng phối giống
  isAssignedToMeditation?: boolean; // Khóa khi đang hộ pháp nhập định

  [key: string]: any;
}

export interface BeastEgg {
  id: string;
  name: string;
  quality: BeastQuality | string;
  potentialSpecies: string;
  progress: number;
  requiredProgress: number;
  infusedLinhThach: number;
  infusedMp: number;
  incubateProgressSeconds?: number;
  requiredSeconds?: number;
  possibleBeastIds?: string[];
  avatar?: string;
  description?: string;

  // Thuộc tính Noãn Thần Uyển Lai Tạo
  parents?: { 
    fatherName: string; 
    motherName: string; 
    element: BeastElement;
    fatherId?: string;
    motherId?: string;
  };
  rarity?: BloodlineTier;
  incubateStartTime?: number;
  incubateDuration?: number; // milliseconds
  isHatched?: boolean;
  predictedMutations?: string[];
  inheritedTraits?: {
    speciesId: string;
    name: string;
    element: BeastElement;
    tier: BloodlineTier;
    bloodlinePurity: number;
    generation: number;
    isHybrid: boolean;
    canMount: boolean;
    canFight: boolean;
    travelSpeedBonus: number;
    combatStats: BeastCombatStats;
    innateAura?: BeastInnateAura;
  };
  catalystItemId?: string;

  [key: string]: any;
}
