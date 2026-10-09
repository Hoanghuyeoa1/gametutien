// lib/types/sect-war.ts
// Pure Domain Types cho Phân Hệ "Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại (Sect Wars & Wild Territory Conquest)"

export type SpiritMountainType = 'herb_mountain' | 'ore_vein' | 'spirit_spring' | 'ancient_monolith';

export type SectDiplomacyStatus = 'allied' | 'neutral' | 'hostile' | 'at_war';

export interface MountainHerbYield {
  itemId: string;
  name: string;
  amount: number;
}

export interface WildSpiritMountain {
  id: string;
  name: string;
  type: SpiritMountainType;
  tier: number; // 1 - 9
  description?: string;
  hexCoord: { q: number; r: number }; // Tọa độ lục giác trên sa bàn
  baseOutput: {
    spiritStonesPerDay?: number;
    herbsPerDay?: MountainHerbYield[];
    sectExpPerDay?: number;
  };
  controllingSectId: string; // 'player_sect' hoặc ID môn phái AI
  defenseArrayHp: number;
  maxDefenseArrayHp: number;
  stationedGarrison: {
    leaderDiscipleId?: string;
    leaderName?: string;
    discipleCount: number;
    combatPower: number;
  };
  contestedBySectId?: string;
  lastHarvestTimestamp?: number;
}

export interface RivalSectFaction {
  id: string;
  name: string;
  sectAlignment: 'orthodox' | 'demonic' | 'neutral';
  reputation: number;
  leaderName: string;
  leaderTitle?: string;
  leaderRealmIndex: number;
  totalCombatPower: number;
  diplomacy: SectDiplomacyStatus;
  occupiedMountains: string[];
  crestIcon?: string;
  motto?: string;
}

export interface SectWarStageResult {
  stage: 'array_breach' | 'champion_duel' | 'legion_clash';
  winner: 'player' | 'rival';
  log: string;
  casualties: {
    playerDisciplesLost: number;
    rivalDisciplesLost: number;
  };
}

export interface SectWarBattleReport {
  warId: string;
  targetMountainId: string;
  targetMountainName: string;
  rivalSectId: string;
  rivalSectName: string;
  stages: SectWarStageResult[];
  overallWinner: 'player' | 'rival';
  capturedResources: {
    spiritStones: number;
    rareItems: string[];
  };
  reputationDelta: number;
  moraleDelta: number;
  playerCasualtiesTotal: number;
  timestamp: number;
}

export interface TributeVault {
  spiritStones: number;
  herbs: Record<string, number>;
  lastTributeTimestamp: number;
}

export interface SectWarState {
  wildSpiritMountains: WildSpiritMountain[];
  rivalSects: RivalSectFaction[];
  sectWarHistory: SectWarBattleReport[];
  tributeVault: TributeVault;
  sectMorale: number; // 0 - 100 (Sĩ khí tông môn, mặc định 75)
}

export interface WarDeclarationValidation {
  allowed: boolean;
  reason?: string;
  marchCost?: number;
  leaderDisciple?: any;
  participatingDisciplesCount?: number;
}
