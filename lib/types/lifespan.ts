// lib/types/lifespan.ts
// Kiểu dữ liệu cho phân hệ "Tuế Nguyệt Bế Quan & Thọ Nguyên (Lifespan & Deep Cultivation)"

export type DeepCultivateUnit = 'days' | 'months' | 'years';

export interface DeepCultivateInput {
  amount: number;
  unit: DeepCultivateUnit;
}

export interface DeepCultivateEstimate {
  yearsAdded: number;
  currentAge: number;
  newAge: number;
  maxLifespan: number;
  tuViGained: number;
  costLinhThach: number;
  costTichCocDan: number;
  canAfford: boolean;
  isLifespanExceeded: boolean;
  isToaHoaWarning?: boolean;
  reason?: string;
}

export interface DeepCultivateResult {
  success: boolean;
  yearsAdded: number;
  newAge: number;
  tuViGained: number;
  linhThachConsumed: number;
  tichCocDanConsumed: number;
  isToaHoaTriggered?: boolean;
  logTitle: string;
  logContent: string;
}

export interface LifespanPill {
  id: string;
  name: string;
  grade: string;
  lifespanBonusYears: number;
  maxUseCount: number;
  description: string;
}
