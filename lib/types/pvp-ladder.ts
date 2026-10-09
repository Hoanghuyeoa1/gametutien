// lib/types/pvp-ladder.ts
// Định nghĩa kiểu dữ liệu Domain cho phân hệ Vạn Tiên Đại Hội / Thiên Kiêu Bảng (Simulated Async PvP Ladder)

import { LinhCanElement } from './character';

export interface LadderOpponent {
  id: string;
  rank: number; // 1 đến 100
  name: string;
  title: string; // VD: "Kiếm Si", "Bất Bại Ma Đồng", "Cửu U Thánh Nữ", "Độc Cô Cầu Bại"
  sectId: string;
  sectName: string;
  sectTier: number;
  avatar: string;
  realmIndex: number;
  realmName: string;
  linhCan: {
    name: string;
    element: LinhCanElement | string;
    grade: string;
  };
  combatStats: {
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    atk: number;
    def: number;
    speed: number;
    critRate: number;
    critDmg: number;
    dmgReduction: number;
  };
  thanThuc: number;
  manuals: Array<{
    name: string;
    type: string;
    level: number;
  }>;
  spiritCompanion?: {
    name: string;
    stageName: string;
    personality: string;
  };
  combatPower: number;
}

export interface PvPLadderCombatLog {
  id: string;
  timestamp: number;
  targetName: string;
  targetRank: number;
  isVictory: boolean;
  rankChange: string;
  oldRank: number;
  newRank: number;
}

export interface PvPLadderState {
  currentRank: number; // 101 là chưa vào bảng (Hạng 101+)
  bestRank: number;
  challengeTickets: number; // Tối đa 5 lượt
  lastTicketRegenTime: number;
  lastWeeklySettlementTime: number;
  hasUnclaimedWeeklyReward?: boolean;
  weeklyRewardRank?: number;
  combatLogs: PvPLadderCombatLog[];
  ladderNpcs: LadderOpponent[]; // Danh sách 100 đối thủ lưu trong save
}

export interface PvPTurnLog {
  round: number;
  playerHpBefore: number;
  opponentHpBefore: number;
  playerAction: {
    actionName: string;
    damage: number;
    isCrit: boolean;
    isDodge: boolean;
    isDoubleAction?: boolean;
    specialEffect?: string;
    description: string;
  };
  opponentAction: {
    actionName: string;
    damage: number;
    isCrit: boolean;
    isDodge: boolean;
    isDoubleAction?: boolean;
    specialEffect?: string;
    description: string;
  };
  playerHpAfter: number;
  opponentHpAfter: number;
}

export interface PvPBattleResult {
  victory: boolean;
  playerMaxHp: number;
  opponentMaxHp: number;
  finalPlayerHp: number;
  finalOpponentHp: number;
  rounds: PvPTurnLog[];
  opponent: LadderOpponent;
  oldRank: number;
  newRank: number;
  rewards: {
    linhThach: number;
    danhVong: number;
    tuVi: number;
    rewardTitleId?: string;
  };
  soulSuppressionMessage?: string;
  lossReason?: string;
  synergyMessages?: string[];
  finalSynergyGauge?: import('./combat-synergy').TrinitySynergyGaugeState;
}
