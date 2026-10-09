// lib/types/cosmic-defense.ts
// Domain Types cho phân hệ "Vực Ngoại Dị Tộc Tập Kích & Xây Dựng Cứ Điểm Tinh Hải (Cosmic Invasions & Star Fortification)"

export type IncursionThreatLevel = 'tieu_ba' | 'trung_ba' | 'dai_ba';

export type FortificationType = 'tru_ma_phao' | 'huyen_tran' | 'ho_cuong_giap' | 'tu_linh_dai';

export interface NodeFortificationState {
  truMaPhaoLevel: number;    // Cấp 0-5 (Nã 10% - 50% HP địch)
  huyenTranLevel: number;    // Cấp 0-5 (Kéo dài thời gian tiếp cận 20% - 100%)
  hoCuongGiapLevel: number;  // Cấp 0-5 (Giảm thất thoát tài nguyên)
  tuLinhDaiLevel: number;    // Cấp 0-5 (Buff Lực Chiến trấn thủ 20% - 60%)
}

export type GarrisonType = 'none' | 'beast' | 'spirit' | 'disciple';

export interface GarrisonDeployment {
  type: GarrisonType;
  entityId?: string;
  entityName?: string;
  baseCombatPower: number;
  assignedAt: number;
}

export interface VoidIncursion {
  id: string;
  targetNodeId: string;
  targetNodeName: string;
  sectorId: string;
  threatLevel: IncursionThreatLevel;
  enemyLeaderName: string;
  enemyFleetName: string;
  enemyTotalHp: number;
  enemyCurrentHp: number;
  enemyAtk: number;
  enemyCombatPower: number;
  dispatchedAt: number;
  arrivalTimestamp: number; // Mốc thời gian kẻ địch chạm tới cứ điểm
  status: 'approaching' | 'sieging' | 'repelled' | 'breached';
  lootRewards: {
    honDonThanThiet: number;
    tienThienDiBao: number;
    linhThach: number;
  };
}

export interface CosmicDefenseState {
  fortifications: Record<string, NodeFortificationState>; // nodeId -> Fortifications
  garrisons: Record<string, GarrisonDeployment>;           // nodeId -> Garrison
  activeIncursions: VoidIncursion[];
  lastIncursionCheckTime: number;
  incursionsRepelledCount: number;
  incursionsBreachedCount: number;
  sectorResonanceGrid?: import('./sector-resonance').SectorResonanceLink[];
  resonanceLinks?: import('./sector-resonance').SectorResonanceLink[];
  crossFireEnergyBuffer?: number;
}
