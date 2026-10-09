// lib/types/natal-artifact.ts
// Kiểu dữ liệu cho phân hệ "Bản Mệnh Pháp Bảo & Bồi Dưỡng Khí Linh (Natal Artifact & Spirit Sentience)"

export type SpiritStage = 'mong_muoi' | 'thuc_tinh' | 'thong_tue' | 'huyen_the' | 'hoa_hinh';
export type SpiritPersonality = 'sat_phat' | 'thu_ho' | 'co_xao' | 'tinh_hoa';

export interface ArtifactSpiritSkill {
  id: string;
  name: string;
  description: string;
  triggerCondition: 'hp_low' | 'boss_low' | 'turn_start' | 'interval';
  cooldownTurns: number;
  effectValue: number;
}

export interface ArtifactSpirit {
  name: string;
  title: string;              // Danh xưng linh thể
  avatar: string;             // Icon / huyễn ảnh hiển thị (emoji/ký hiệu)
  stage: SpiritStage;         // 1 - 5
  stageLevel: number;         // 1 - 5
  exp: number;
  maxExp: number;
  intimacy: number;           // Hảo cảm (0 - 100)
  personality: SpiritPersonality;
  awakenedSkill: ArtifactSpiritSkill;
  dialogueHistory: string[];
  lastNourishDate?: string;    // Ngày ôn dưỡng (YYYY-MM-DD)
  dailyNourishCount: number;   // Số lần ôn dưỡng trong ngày (tối đa 3)
}

export interface NatalArtifact {
  id: string;
  baseEquipmentId: string;    // ID của trang bị gốc được phong Bản Mệnh
  name: string;
  slot: string;               // weapon | armor | accessory | artifact
  type?: string;
  tier: number;               // 1 - 9
  grade: string;              // Phẩm cấp hiển thị
  quality: string;            // cuc_pham | tuyet_pham | tien_pham | de_binh
  resonanceRate: number;      // % cộng hưởng cơ bản (+25% -> +50%)
  boundRealmId: number;       // Cảnh giới nhân vật khi thực hiện tế luyện
  realmAdvancementBonus: number; // % cộng dồn từ khi thăng đại cảnh giới (+5% mỗi đại cảnh giới)
  spirit: ArtifactSpirit | null; // Null nếu chưa thức tỉnh linh trí
  statsBonus: {
    atk?: number;
    def?: number;
    hp?: number;
    mp?: number;
    speed?: number;
    critRate?: number;
    critDmg?: number;
    dmgReduction?: number;
    [key: string]: number | undefined;
  };
  baseEquipment?: any;        // Dữ liệu sao lưu đầy đủ của trang bị gốc
  boundAtTimestamp: number;   // Thời điểm tế luyện
}

export interface SpiritStageConfig {
  stage: SpiritStage;
  stageLevel: number;
  name: string;
  roman: string;
  maxExp: number;
  atkBonusPercent: number;
  defBonusPercent: number;
  critRateBonusPercent?: number;
  dmgReductionBonusPercent?: number;
  cultivationSpeedBonusPercent?: number;
  description: string;
  auraColor: string;
}

export interface SpiritPersonalityConfig {
  personality: SpiritPersonality;
  name: string;
  icon: string;
  color: string;
  skillName: string;
  skillDesc: string;
  triggerDesc: string;
  quotes: {
    low: string[];
    mid: string[];
    high: string[];
  };
}

export interface NatalAscensionConfig {
  targetTier: number;
  tierName: string;
  requiredEssence: number;
  requiredRealmIndex: number;
  requiredRealmName: string;
  statMultiplierBonus: number; // Ví dụ: 0.15 (+15%)
  spiritExpBonus: number;      // EXP Khí Linh thưởng thêm
  maxSocketsUnlock: number;    // Mở trần số lỗ khảm
}

export interface NatalAscensionRequirement {
  canAscend: boolean;
  reason?: string;
  currentTier: number;
  nextTier?: number;
  nextConfig?: NatalAscensionConfig;
  playerEssence: number;
  requiredEssence: number;
  currentRealmIndex: number;
  requiredRealmIndex: number;
  isRealmQualified: boolean;
  hasEnoughEssence: boolean;
  isMaxTier: boolean;
}
