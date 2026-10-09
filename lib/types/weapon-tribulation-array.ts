// lib/types/weapon-tribulation-array.ts
// Domain Types: Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân (Weapon Tribulation & Orbiting Array Sets)
// 100% Strict TypeScript, Pure Domain Models, Clean Architecture

/**
 * Phân loại bộ trận khí tùy thân
 */
export type FormationSetCategory = 'chu_thien_kiem' | 'ngu_hanh_chau' | 'bat_quai_ky';

/**
 * Đợt sét đánh trong nghi thức Khí Lôi Kiếp
 */
export interface WeaponTribulationStrike {
  waveIndex: number;
  strikeName: string;
  lightningPower: number;
  temperSuccessRate: number;
  [key: string]: any;
}

/**
 * Metadata vũ khí sau khi độ lôi kiếp thành công
 */
export interface LightningTemperedMetadata {
  isTempered: boolean;
  temperedAt: number;
  lightningElementBonus: number;   // Mặc định 35% (+35% sát thương Lôi Nguyên Tố)
  paralysisProcChance: number;     // Mặc định 20% (20% xác suất gây Tê Liệt / Choáng)
  armorPiercingPercent: number;    // Mặc định 30% (30% Xuyên Giáp / Xuyên Hộ Thể)
  [key: string]: any;
}

/**
 * Hiệu ứng kích hoạt theo mốc số mảnh trận khí tùy thân
 */
export interface FormationSetThresholdBonus {
  requiredPieces: number;
  title: string;
  description: string;
  effects: {
    turnDamagePercent?: number;
    damageReductionPercent?: number;
    unlockedSkillName?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Cấu hình thiết lập của một bộ Trận Khí Tùy Thân
 */
export interface FormationSetConfig {
  id: string;
  name: string;
  category: FormationSetCategory;
  maxPieces: number;
  pieceCraftCost: {
    minerals: {
      itemId: string;
      name: string;
      amount: number;
    }[];
    spiritStones: number;
  };
  thresholdBonuses: FormationSetThresholdBonus[];
  lore: string;
  [key: string]: any;
}

/**
 * Tiến độ chế tác bộ trận khí của người chơi
 */
export interface PlayerFormationSetProgress {
  setId: string;
  currentPieces: number;
  isCompleted: boolean;
  unlockedThresholds: number[];
  assembledAt: number;
  [key: string]: any;
}

/**
 * Trạng thái phân hệ Trận Khí Tùy Thân trong Save Game của người chơi
 */
export interface FormationSetsState {
  ownedSets: Record<string, PlayerFormationSetProgress>;
  equippedArraySetId: string | null;
  tribulationHistory: any[];
  [key: string]: any;
}
