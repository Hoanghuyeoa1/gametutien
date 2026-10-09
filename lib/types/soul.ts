// lib/types/soul.ts
// Định nghĩa kiểu dữ liệu Phân hệ "Thức Hải Thần Hồn" (Soul & Consciousness System)

import { PlayerStats } from './player';

export type SoulRelicType = 'offensive' | 'defensive' | 'support';

export interface SoulStatBonus {
  triLuc?: number;
  tinhThan?: number;
  khangPhep?: number;
  khangKhongChe?: number;
  spiritualPressure?: number;
  speed?: number;
  critRate?: number;
  critDmg?: number;
  atk?: number;
  def?: number;
  hp?: number;
}

export interface SoulRealm {
  id: string;
  name: string;
  realmIndex: number;
  maxStage: number; // Thường là 9 tiểu tầng
  description: string;
  lore?: string;
  glowColor: string;
  statsBonus: SoulStatBonus;
  spiritualPressure: number; // Chỉ số Uy Áp: giảm trực tiếp % chỉ số toàn diện của đối thủ có Thần Hồn thấp hơn
  maxControlSlots: number; // Số lượng Pháp Bảo / Linh Thú / Khôi Lỗi có thể xuất chiến đồng thời
  specialAbilityName?: string;
  specialAbilityDesc?: string;
}

export interface SoulCultivation {
  currentRealmId: string;
  currentStage: number; // 1 -> maxStage
  currentExp: number;
  expToNextStage: number;
  soulSeaCapacity: number; // Dung lượng Thức Hải - giới hạn điểm Thần Niệm
  currentSoulPower: number; // Thần Niệm hiện tại, tiêu hao khi xuất chiêu hoặc duy trì Uy Áp
}

export interface MentalDemonState {
  stability: number; // Tâm Cảnh: 0 - 100%
  demonCorruption: number; // Ma Tính tích lũy: 0 - 100%
  demonLevel: number; // Cấp độ Tâm Ma, tăng dần khi sát phạt hoặc thất bại khi độ kiếp
  isTribulationActive: boolean; // Kích hoạt Ảo Cảnh Tâm Ma khi độ kiếp cảnh giới lớn
}

export interface SoulRelic {
  id: string;
  name: string;
  type: SoulRelicType;
  tier: number; // Phẩm cấp 1 - 6 (Phàm -> Huyền -> Địa -> Thiên -> Thần -> Hỗn Độn)
  description: string;
  passiveEffect: string;
  soulPowerCost: number;
  statsBonus?: SoulStatBonus;
  icon?: string;
}

export interface SoulState {
  cultivation: SoulCultivation;
  mindState: MentalDemonState;
  equippedRelics: SoulRelic[]; // Tối đa 3 món Hồn Khí
  lastMeditationTimestamp: number; // Thời gian lần cuối tĩnh tọa minh tưởng
}

export interface SoulNourishingItemConfig {
  id: string;
  name: string;
  category: 'herb' | 'pill' | 'incense' | 'ore';
  tierName: string;
  description: string;
  expGain: number;
  stabilityGain: number;
  corruptionCleansed: number;
  soulPowerRestore: number;
  icon: string;
}
