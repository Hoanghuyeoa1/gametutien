// lib/types/domain-resonance.ts
// Kiểu dữ liệu cho phân hệ "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"

import { Manual } from './items';
import { NatalArtifact } from './natal-artifact';

export type ResonanceElementType =
  | 'Kim'
  | 'Mộc'
  | 'Thủy'
  | 'Hỏa'
  | 'Thổ'
  | 'Lôi'
  | 'Phong'
  | 'Hỗn Độn';

export type SpiritPersonalityType =
  | 'sat_phat'
  | 'ho_chu'
  | 'on_hoa'
  | 'co_tri'
  | 'lanh_khoc'
  | 'tram_on'
  | 'cuong_bao'
  | 'thu_ho'
  | 'co_xao'
  | 'tinh_hoa'
  | string;

export type ResonanceEffectType =
  | 'mana_burn'        // Thiêu đốt chân nguyên (MP)
  | 'hp_regen'         // Hồi phục sinh lực mỗi hiệp
  | 'armor_pierce'     // Xuyên giáp hộ thể
  | 'action_slow'      // Làm chậm tốc độ / giảm tỷ lệ xuất chiêu
  | 'shield_reflect'   // Hộ thuẫn phản chấn
  | 'true_damage_burst';// Sát thương chuẩn chân thật

export interface ResonanceRequirement {
  requiredElement: ResonanceElementType;
  requiredSkillCategory?: string; // Ví dụ: than_thong, cong_phap
  requiredPersonality: SpiritPersonalityType | SpiritPersonalityType[];
  minArtifactTier?: number;       // Yêu cầu bậc Bản Mệnh (Nhị Giai -> Cửu Giai)
  minSpiritAffinity?: number;     // Hảo cảm Khí Linh tối thiểu (0 - 100)
}

export interface DomainResonanceConfig {
  id: string;
  name: string;
  title: string;                 // Danh xưng dị tượng (vd: Liệt Diễm Phần Thần)
  element: ResonanceElementType;
  description: string;
  requirement: ResonanceRequirement;
  effect: {
    type: ResonanceEffectType;
    baseValue: number;           // % hoặc giá trị cơ sở
    scalingStat?: 'atk' | 'def' | 'currentMp' | 'spiritLevel';
    durationTurns?: number;
  };
  auraVisual: {
    borderColor: string;
    glowEffect: string;
    icon: string;
    elementColor?: string;
    bgGradient?: string;
  };
}

export interface ActiveDomainResonance {
  resonanceId: string;
  name: string;
  level: number;
  effectDescription: string;
  sourceSkillName: string;
  spiritName: string;
  element?: ResonanceElementType;
  auraVisual?: {
    borderColor: string;
    glowEffect: string;
    icon: string;
    elementColor?: string;
    bgGradient?: string;
  };
}

export type KungfuManualItem = Manual;

export interface PotentialDomainResonance {
  config: DomainResonanceConfig;
  missingRequirements: string[];
  canActivateWithSkill?: boolean;
  canActivateWithSpirit?: boolean;
}

export interface ResonanceTurnResult {
  updatedAttacker: any;
  updatedDefender: any;
  combatEvents: string[];
  appliedDamage: number;
}
