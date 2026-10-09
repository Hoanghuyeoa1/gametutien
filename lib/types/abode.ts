// lib/types/abode.ts
// Định nghĩa kiểu dữ liệu Động Thiên Phúc Địa (Homestead & Abode Core)

export type AbodeSoilType = 'hoang_tho' | 'han_bang' | 'hoa_diem';

export interface AbodePlotState {
  id: number;                     // 0 - 11
  soilType: AbodeSoilType;
  unlocked: boolean;
  seedId: string | null;
  plantedAt: number | null;
  harvestAt: number | null;
  fertilized: boolean;           // Đã bón phân hay chưa
}

export interface AbodeSpiritArrayState {
  level: number;                 // 1 - 10
  tuViRateBonus: number;         // % tăng tu vi bế quan
  autoHealBonus: number;         // % hồi phục
}

export interface AbodeDisciple {
  id: string;
  name: string;
  avatar: string;
  aptitude: 'ha' | 'trung' | 'thuong' | 'thien_kieu';
  assignedManualId?: string | null;
  tributeReadyAt: number;
  lastClaimedAt: number;
}

export interface AbodeState {
  level: number;                 // Cấp Động Phủ (1 - 5)
  spiritArray: AbodeSpiritArrayState;
  plots: AbodePlotState[];       // Mảng 12 ô đất
  beastSanctuary: {
    roamingBeastIds: string[];   // Tối đa 3 thú
    fertilizerStored: number;    // Phân bón tích lũy
    lastFertilizerTick: number;
  };
  scripturePavilion: {
    showcasedManualIds: string[]; // Tối đa 5 cuốn
    disciples: AbodeDisciple[];
  };
  storageCapacityBonus?: number; // Sức chứa kho động phủ mở rộng
}

export interface SpiritArrayLevelConfig {
  level: number;
  name: string;
  costLinhThach: number;
  requiredFlagId?: string; // id trận kỳ (item_tran_ky_so_cap...)
  requiredFlagName?: string;
  requiredFlagCount?: number;
  requiredOreName?: string;
  requiredOreCount?: number;
  tuViRateBonus: number;
  autoHealBonus: number;
  gardenYieldBonus?: number;
  breakthroughBonus?: number;
  description: string;
}

export interface AbodeLevelConfig {
  level: number;
  name: string;
  maxPlotsUnlocked: number;
  maxDisciples: number;
  upgradeCostLinhThach: number;
  requiredRealm: number;
  description: string;
}

export interface SoilConfig {
  type: AbodeSoilType;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  element: string;
  description: string;
  switchCostLinhThach: number;
  speedReductionPercent: number;
  yieldBonusPercent?: number;
  gemBonusPercent?: number;
}
