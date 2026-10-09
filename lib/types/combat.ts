// lib/types/combat.ts
import { LinhCanElement } from './character';
import { Pill, Ore, Manual } from './items';

export interface CombatStats {
  atk: number;
  def: number;
  hp?: number;
  maxHp?: number;
  soul: number;
  speed: number;
  critRate: number;
  critDmg: number;
  dodgeRate?: number;
  hutMauRate?: number;
  xuyenGiapRate?: number;
  phanDmgRate?: number;
  dmgReduction?: number;
  hpRegenPercent?: number;
  soulSuppression?: boolean;
  [key: string]: any;
}

export interface CombatLogEntry {
  round: number;
  turn: 'player' | 'boss' | 'companion' | 'beast' | string;
  action: string;
  damage?: number;
  healing?: number;
  isCrit?: boolean;
  isDodge?: boolean;
  message: string;
  [key: string]: any;
}

export interface Boss {
  id: string;
  name: string;
  realm: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  element?: LinhCanElement;
  description?: string;
  drops?: {
    tuVi?: number;
    linhThach?: number;
    items?: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface WorldBossMilestone {
  percent?: number;
  claimed?: boolean;
  damageReq: number;
  title?: string;
  rewards: {
    tuVi: number;
    linhThach: number;
    tinhHuyet?: number;
    pillId?: string;
    oreId?: string;
    description?: string;
    items?: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface WorldBossState {
  bossId?: string;
  id?: string;
  name: string;
  title?: string;
  currentHp: number;
  maxHp: number;
  element: LinhCanElement;
  realmLevel: number;
  power: number;
  totalDamageDealt?: number;
  attemptsToday?: number;
  description?: string;
  skills?: { name: string; desc: string; dmgMul: number }[];
  milestones: WorldBossMilestone[];
  lastAttemptDate?: string;
  [key: string]: any;
}

export interface TowerFloorInfo {
  floor: number;
  name: string;
  type: 'normal' | 'elite' | 'overlord' | string;
  bossName: string;
  realmLevel: number;
  combatPower: number;
  element: LinhCanElement;
  rewards: {
    tuVi: number;
    linhThach: number;
    towerPoints: number;
    tinhHuyet: number;
    specialChest?: string;
    [key: string]: any;
  };
  description: string;
  [key: string]: any;
}

export interface CombatRoundAction {
  skillName?: string;
  isCrit: boolean;
  isDodge: boolean;
  damage: number;
  soulSuppressed?: boolean;
  hpRegen?: number;
  description: string;
  [key: string]: any;
}

export interface CombatRoundLog {
  round: number;
  playerHpBefore: number;
  bossHpBefore: number;
  playerAction: CombatRoundAction;
  bossAction: {
    skillName: string;
    damage: number;
    isCrit: boolean;
    description: string;
    [key: string]: any;
  };
  playerHpAfter: number;
  bossHpAfter: number;
  [key: string]: any;
}

export interface DetailedBattleReport {
  victory: boolean;
  bossName: string;
  bossRealm: number;
  bossElement: LinhCanElement;
  bossDifficulty?: string;
  bossMaxHp: number;
  playerMaxHp: number;
  rounds: CombatRoundLog[];
  finalPlayerHp: number;
  finalBossHp: number;
  rewards?: {
    tuVi: number;
    linhThach: number;
    danhVong: number;
    tinhHuyet?: number;
    towerPoints?: number;
    droppedPill?: Pill;
    [key: string]: any;
  };
  [key: string]: any;
}
