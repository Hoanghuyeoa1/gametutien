// lib/types/offspring.ts
// Domain Types cho phân hệ Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch (Dual Cultivation Paths & Immortal Offspring)

export type DualCultivationMethod = 'chinh_dao' | 'thai_bo';

export interface DualCultivationResult {
  method: DualCultivationMethod;
  playerTuViGain: number;
  companionTuViGain: number;
  playerBuffDurationHours: number;
  atkBonusPercent: number;
  critRateBonusPercent: number;
  tamCanhDelta: number;
  demonicKarmaDelta: number; // Tăng/giảm Ma Tính (0 - 100)
  affinityDelta: number;
  conceptionTriggered: boolean;
  message: string;
}

export type OffspringStage = 'infant' | 'child' | 'adult';

export interface OffspringSpiritualRoot {
  type: 'ngu_hanh' | 'di_bien' | 'hon_don';
  elementName: string;
  grade: 'ha' | 'trung' | 'thuong' | 'cuc' | 'than';
  description?: string;
  damageBonusPercent?: number;
}

export interface OffspringInnateTalent {
  name: string;
  description: string;
  statModifiers: {
    atkPercent?: number;
    defPercent?: number;
    speed?: number;
    critDmg?: number;
    critRate?: number;
    hpPercent?: number;
  };
}

export interface ImmortalChild {
  id: string;
  name: string;
  gender: 'nam' | 'nu';
  motherCompanionId: string;
  motherName: string;
  birthTimestamp: number;
  stage: OffspringStage;
  realmIndex: number;
  realmName: string;
  spiritualRoots: OffspringSpiritualRoot;
  innateTalent: OffspringInnateTalent;
  growthProgress: number; // 0 - 100
  combatPower: number;
  isDeployed: boolean; // Đang xuất chiến cùng nhân vật
  ageYears?: number;
  transferredTuVi?: number; // Lượng tu vi cha mẹ đã truyền thụ
  appointmentData?: import('./disciple-appointment').DiscipleAppointmentData;
  isDispatchedToWar?: boolean; // Khóa viễn chinh trong Tông Môn Đại Chiến
}

export interface GestationPillEffect {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'conception' | 'progress_boost' | 'root_quality' | 'stat_boost';
  progressReductionHours?: number; // Giảm thời gian hoài thai
  talentBonus?: number;
  guaranteedGrade?: 'thuong' | 'cuc' | 'than';
}

export interface GestationState {
  isGestationActive: boolean;
  motherCompanionId: string;
  motherName: string;
  startGestationTimestamp: number;
  estimatedBirthTimestamp: number;
  durationMs: number; // Tổng thời gian quy chuẩn (mặc định 48h)
  nurturingLevel: number; // 1 - 5 phụ thuộc đan dược đã bồi bổ
  consumedPillIds: string[];
}

export interface OffspringState {
  gestation: GestationState | null;
  children: ImmortalChild[];
  deployedChildId: string | null;
  demonicKarma: number; // Ma Tính người chơi (0 - 100)
  lastSongTuTimestamp?: number; // Cooldown chung hoặc riêng
  activeDualCultivationBuff?: {
    method: DualCultivationMethod;
    expiresAt: number;
    atkBonusPercent: number;
    critRateBonusPercent: number;
    cultivationRateBonusPercent: number;
  } | null;
}
