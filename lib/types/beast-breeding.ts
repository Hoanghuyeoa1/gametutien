// lib/types/beast-breeding.ts
// Định nghĩa kiểu dữ liệu cho hệ thống Tiến Hóa Huyết Mạch & Lai Tạo Linh Thú (Thú Uyển Động Phủ)

export type BeastElement = 
  | 'Kim' 
  | 'Mộc' 
  | 'Thủy' 
  | 'Hỏa' 
  | 'Thổ' 
  | 'Lôi' 
  | 'Phong' 
  | 'Âm Dương' 
  | 'Hỗn Độn';

export type BloodlineTier = 1 | 2 | 3 | 4 | 5; // 1: Phàm Thú, 2: Linh Thú, 3: Dị Thú, 4: Thần Thú, 5: Thái Cổ

export interface BeastCombatStats {
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  critRate?: number;
}

export interface BeastInnateAura {
  id: string;
  name: string;
  description: string;
  effectType: 'vampirism' | 'stun' | 'elemental_burst' | 'damage_reduction';
  value: number; // Tỷ lệ % (ví dụ: 15% hút máu, 20% giảm thương, 25% sát thương nguyên tố)
}

export interface BreedingParentsInfo {
  fatherId: string;
  fatherName: string;
  fatherElement: BeastElement;
  motherId: string;
  motherName: string;
  motherElement: BeastElement;
}

export interface BeastEgg {
  id: string;
  name: string;
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

export interface BeastGardenFacility {
  level: number; // Cấp độ Thú Uyển trong Động Phủ (1 -> 5)
  maxBreedingSlots: number;
  incubationSpeedMultiplier: number;
  mutationRateBonus: number; // % Tăng tỷ lệ ra dị biến hiếm
}

export interface BreedingPairSession {
  id: string;
  fatherId: string;
  motherId: string;
  eggId: string;
  startTime: number;
  finishTime: number;
  catalystItemId?: string;
}

export interface BeastGardenState {
  facility: BeastGardenFacility;
  beasts: any[]; // danh sách SpiritBeast
  eggs: BeastEgg[];
  activeMountId?: string | null;
  activeCombatId?: string | null;
  breedingPairs?: BreedingPairSession[];
}

export interface BreedingCatalystItem {
  id: string;
  name: string;
  description: string;
  rarity: string;
  mutationRateBonus: number; // ví dụ: 0.15 (+15%)
  purityBonus: number;       // ví dụ: 10 (+10%)
  costLinhThach: number;
  icon: string;
}

export interface BloodlineEvolutionCost {
  tier: BloodlineTier;
  targetTier: BloodlineTier;
  linhThachCost: number;
  beastDanCost: number; // Số Thú Đan / Huyết Mạch Đan yêu cầu
  purityGainPerDan: number; // % tăng mỗi viên đan
  minRealmRequired: number; // Cảnh giới tối thiểu của nhân vật
}
