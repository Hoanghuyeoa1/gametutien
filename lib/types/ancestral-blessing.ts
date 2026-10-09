// lib/types/ancestral-blessing.ts
// Domain Types cho phân hệ Đạo Vận Tiên Bi: Tổ Tiên Phù Hộ & Huyết Mạch Thế Gia (Ancestral Resonance & Lineage Blessings)

export type IncenseGrade = 'thanh_truc' | 'tu_tieu' | 'thai_so';

export interface IncenseStatBuffs {
  tuViSpeedPercent: number;
  allStatsPercent?: number;
  atkDefPercent?: number;
  dropRatePercent?: number;
  critRatePercent?: number;
}

export interface IncenseConfig {
  id: IncenseGrade;
  name: string;
  description: string;
  costLinhThach: number;
  requiredItemName?: string;
  durationHours: number;
  statBuffs: IncenseStatBuffs;
  protectionCharges: number; // Số lần hư ảnh tổ tiên đỡ đòn chí tử
  icon?: string;
}

export interface AggregatedAncestralResonance {
  totalGraves: number;
  danCucPhamRateBonus: number;     // % tối đa +25%
  swordDamageBonus: number;        // % tối đa +20%
  tribulationCostReduction: number;// % tối đa +30%
  tuViSpeedBonus: number;          // % tối đa +40%
  extraStartingLifespan: number;   // Năm thọ nguyên
  extraStartingLinhThach: number;
  extraCanCot: number;
  extraNgoTinh: number;
  extraKhiVan: number;
  critDmgBonus: number;
  marketSellPriceBonus: number;
  gestationTimeReductionPercent: number; // % giảm thời gian hoài thai tiên đồng
  allStatsBonusPercent: number;
}

export interface ActiveOfferingBuff {
  incenseId: IncenseGrade;
  incenseName: string;
  startTime: number;
  expiresAt: number;
  protectionCharges: number; // Lượt đỡ đòn tử vong còn lại
  statBuffs?: IncenseStatBuffs;
}

export interface AncestralState {
  activeBuff: ActiveOfferingBuff | null;
  totalOfferingsMade: number;
  protectionTriggersCount: number; // Thống kê số lần được tổ tiên cứu mạng
}
