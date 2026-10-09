// lib/types/combat-synergy.ts
// Domain types cho phân hệ "Kỹ Thuật Hợp Kích: Tam Vị Nhất Thể (Combat Synergies)"

import { LinhCanElement } from './character';

// ─── Enum & Literal Types ────────────────────────────────────────────────────

/** ID tuyệt kỹ hợp kích chuẩn hóa */
export type SynergySkillId =
  | 'tam_hoa_quy_nguyen'      // Người + Linh Thú + Khí Linh
  | 'thien_dia_phong_yin'     // Người (Kim) + Bạch Hổ + Sát Phạt Khí Linh
  | 'luc_hop_hun_nguyen'      // Người + Linh Thú (Thủy/Băng) + Thu Hộ Khí Linh
  | 'phong_loi_tru_tien'      // Người (Lôi/Phong) + Linh Thú (Lôi/Phong) + Cổ Xảo Khí Linh
  | 'hu_khong_tuyet_kiem'     // Người (Kiếm Đạo) + Bạch Hổ/Thanh Long + Tinh Hoa Khí Linh
  | 'van_linh_trieu_tong';    // Người + bất kỳ Linh Thú + bất kỳ Khí Linh (Hảo Cảm >= 90)

/** Loại hiệu ứng phụ trợ của chiêu thức */
export type SynergyEffectType =
  | 'dot_burn'
  | 'freeze'
  | 'shatter_armor'
  | 'stun'
  | 'lifesteal'
  | 'shield_break'
  | 'debuff_atk'
  | 'debuff_speed'
  | 'buff_player_atk'
  | 'aoe_rend'
  | 'true_damage'
  | 'none';

// ─── Core Interfaces ─────────────────────────────────────────────────────────

/** Một hiệu ứng phụ trong hợp kích */
export interface SynergyEffectDefinition {
  type: SynergyEffectType;
  value: number;
  durationRounds?: number;
  chance: number;
  description: string;
}

/** Định nghĩa tĩnh một Tuyệt Kỹ Hợp Kích */
export interface SynergySkillDefinition {
  id: SynergySkillId;
  name: string;
  quote: string;
  description: string;
  flavorText: string;
  icon: string;
  colorTheme: string;

  triggerConditions: {
    companionId?: string | null;
    beastElement?: LinhCanElement | null;
    beastMinStage?: number;
    spiritPersonality?: string | null;
    playerElement?: LinhCanElement | null;
    minCompanionAffinity?: number;
    minSpiritIntimacy?: number;
    requiresManual?: string;
  };

  combat: {
    baseDamageMultiplier: number;
    critRateBonus: number;
    critDmgBonus: number;
    ignoreDefPercent: number;
    effects: SynergyEffectDefinition[];
    healPercentOfMaxHp?: number;
    shieldPercentOfMaxHp?: number;
    gaugeConsumed: number;
    cooldownRounds: number;
  };

  cutIn: {
    durationMs: number;
    particleColor: string;
    glowColor: string;
    soundType: string;
    flashIntensity: 'low' | 'medium' | 'high' | 'extreme';
  };
}

/** Trạng thái Nộ Khí hiện tại trong trận (runtime) */
export interface TrinitySynergyGaugeState {
  currentGauge: number;
  maxGauge: number;
  lastSkillUsedId?: SynergySkillId | null;
  cooldownRoundsRemaining: number;
  triggeredThisBattle: boolean;
  totalSynergyActivations: number;
  activeEffects: ActiveSynergyEffect[];
}

/** Một hiệu ứng đang hoạt động từ hợp kích */
export interface ActiveSynergyEffect {
  type: SynergyEffectType;
  value: number;
  roundsRemaining: number;
  sourceSkillId: SynergySkillId;
}

/** Kết quả kích hoạt một lần Hợp Kích */
export interface SynergyActivationResult {
  skillId: SynergySkillId;
  skillName: string;
  triggered: boolean;
  totalDamage: number;
  isCrit: boolean;
  healAmount: number;
  shieldAmount: number;
  newEffects: ActiveSynergyEffect[];
  message: string;
  cutInData: SynergySkillDefinition['cutIn'];
  quote: string;
  hasOffspringAssist?: boolean;
  offspringDamage?: number;
  offspringName?: string;
  cleansedDebuffs?: boolean;
}

/** Thông tin log một hiệp có Hợp Kích */
export interface SynergyCombatLogEntry {
  round: number;
  gaugeAtStart: number;
  synergyActivated: boolean;
  activationResult?: SynergyActivationResult;
  gaugeGained: number;
  gaugeAfter: number;
}

/** Trạng thái lưu trữ hợp kích vĩnh viễn trong PlayerStats */
export interface PlayerSynergyState {
  totalActivations: number;
  skillActivationCounts: Partial<Record<SynergySkillId, number>>;
  unlockedSkillIds: SynergySkillId[];
  lastUnlockedSkillId?: SynergySkillId | null;
  highestDamageSynergy?: number;
}
