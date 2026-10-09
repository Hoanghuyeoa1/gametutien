// lib/types/dungeon.ts
import { Realm } from './cultivation';

export type SecretRealmDifficulty = 'easy' | 'normal' | 'hard' | 'nightmare' | 'hell' | string;
export type DungeonRoomType = 'combat' | 'elite' | 'treasure' | 'event' | 'rest' | 'boss' | string;

export interface DungeonBuff {
  id: string;
  name: string;
  description: string;
  statKey?: string;
  value?: number;
  statBonus: Record<string, number>;
  durationRooms?: number;
  [key: string]: any;
}

export interface DungeonRoomChoice {
  id: string;
  title: string;
  type?: DungeonRoomType;
  roomType?: string;
  dangerLevel?: any;
  icon?: string;
  resolved?: boolean;
  description: string;
  previewReward?: string;
  [key: string]: any;
}

export interface DungeonLootBag {
  linhThach: number;
  gems: any[];
  materials: { id: string; name?: string; quantity: number; [key: string]: any }[];
  herbs: { id: string; name?: string; quantity: number; [key: string]: any }[];
  [key: string]: any;
}

export interface DungeonRunState {
  realmId: string;
  difficulty?: SecretRealmDifficulty;
  currentFloor: number;
  maxFloors: number;
  currentRoomIndex?: number;
  roomsInCurrentFloor?: number;
  stepInFloor: number;
  buffs?: DungeonBuff[];
  activeBuffs: DungeonBuff[];
  availableRooms: DungeonRoomChoice[];
  availableChoices?: DungeonRoomChoice[];
  currentRoom?: any;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  lootBag: DungeonLootBag;
  playerHpPercent?: number;
  playerLinhLucPercent?: number;
  accumulatedRewards?: {
    linhThach: number;
    tuVi: number;
    tinhHuyet: number;
    items: any[];
    [key: string]: any;
  };
  isCompleted?: boolean;
  isDefeated?: boolean;
  isActive?: boolean;
  realmName?: string;
  roomEventResolved?: boolean;
  [key: string]: any;
}

export interface SecretRealmDungeon {
  id: string;
  name: string;
  minRealm: number;
  realmName?: string;
  mpCost: number;
  totalFloors: number;
  difficulty?: SecretRealmDifficulty | string;
  description: string;
  floors?: number;
  hazards?: string[];
  rewardsPreview?: string;
  recommendedRealm?: number;
  rewardsSummary?: string;
  possibleDrops?: string[];
  bannerClass?: string;
  [key: string]: any;
}
