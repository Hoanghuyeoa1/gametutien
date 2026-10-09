// lib/types/meditation.ts
// Kiểu dữ liệu cho phân hệ "Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà"
// (Strategic AFK Meditation & Event Journal)

export type MeditationStanceType = 'co_ban' | 'luyen_tam' | 'thao_dien' | 'hiem_canh';

export interface MeditationLocationConfig {
  id: string;
  name: string;
  description: string;
  requiredRealmIndex: number;
  element: string; // Kim, Mộc, Thủy, Hỏa, Thổ, Hỗn Độn...
  tuviMultiplier: number;
  dropTableId: string;
  possibleEventTypes: string[];
  icon?: string;
  bgGradient?: string;
  specialTrait?: string;
}

export interface MeditationEventLog {
  hour: number;
  title: string;
  narrative: string;
  rewardType?: 'tuvi' | 'spirit_stones' | 'item' | 'demonic_reduction' | 'hazard' | 'skill_exp';
  rewardValue?: number;
  rewardItemName?: string;
  isHazardIncident?: boolean;
  wasDefended?: boolean;
}

export interface MeditationGuardianConfig {
  companionId?: string | null;
  beastId?: string | null;
}

export interface GuardianGrowthResult {
  companion?: {
    id: string;
    name: string;
    affectionGained: number;
    tuviGained: number;
    fatigueReducedMinutes: number;
    epiphanyTriggered: boolean;
  };
  beast?: {
    id: string;
    name: string;
    expGained: number;
    bloodlinePurityGained: number;
    levelUpOccurred: boolean;
    loyaltyGained: number;
  };
}

export interface GuardianRescueIncident {
  guardianName: string;
  guardianType: 'companion' | 'beast';
  hour: number;
  incidentType: string;
  narrative: string;
}

export interface MeditationProgressResult {
  totalHoursElapsed: number;
  effectiveHours: number;
  interruptedAtHour?: number;
  interruptionReason?: string;
  totalTuviGained: number;
  totalStonesGained: number;
  demonicCleanseTotal: number;
  toxicityCleanseTotal: number;
  skillExpPerManual: number;
  itemsLooted: { itemId: string; name: string; amount: number }[];
  mapFragmentsLooted?: import('./ancient-map-dungeon').MapFragmentItem[];
  eventLogs: MeditationEventLog[];
  appliedBreakthroughBuff?: boolean;
  guardianGrowth?: GuardianGrowthResult;
  guardianRescues?: GuardianRescueIncident[];
  elementalResonanceBonus?: number;
  resonanceDetails?: string;
}

export interface ActiveMeditationState {
  isMeditating: boolean;
  startTime: number;
  locationId?: string;
  stance?: MeditationStanceType;
  wardItemId?: string | null;
  targetHours?: number;
  lastTickTime?: number;
  accompanyingCompanionId?: string | null;
  accompanyingBeastId?: string | null;
  guardianRescueCount?: number;
}
