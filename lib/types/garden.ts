// lib/types/garden.ts

export interface GardenPlot {
  id: number;
  seedId?: string | null;
  herbId?: string | null;
  plantedAt?: number | null;
  matureAt?: number | null;
  harvestAt?: number | null;
  readyToHarvest?: boolean;
  isUnlocked: boolean;
  [key: string]: any;
}

export interface LinhDienLevelInfo {
  level: number;
  name: string;
  maxPlots: number;
  growthSpeedBonusPercent?: number;
  speedBonusPercent: number;
  yieldBonusPercent: number;
  upgradeCostLinhThach: number;
  description?: string;
  [key: string]: any;
}

export interface LinhDienState {
  level: number;
  plots: GardenPlot[];
  fertilizerCount?: number;
  [key: string]: any;
}
