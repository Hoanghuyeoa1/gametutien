// lib/types/tribulation.ts
// Kiểu dữ liệu cho phân hệ Cửu Trọng Thiên Kiếp Tương Tác • Lôi Kiếp Độ Kiếp

export type TribulationActionType = 'body_tank' | 'array_shield' | 'talisman_sacrifice' | 'soul_focus';

export type TribulationPhase = 'gathering' | 'decision' | 'impact' | 'victory' | 'defeat';

export interface TribulationWaveConfig {
  waveIndex: number;            // 1 .. totalWaves
  name: string;                 // Tên tia sét (Xích Dương Chân Lôi, Cửu U Ma Lôi...)
  baseDamage: number;           // Sát thương cơ sở
  isMentalDemonWave?: boolean;  // Đợt lôi kiếp có ảo cảnh tâm ma quấy nhiễu
  description: string;          // Khí tức & uy lực của đạo lôi kiếp
  thunderColor?: string;        // Màu sắc hiển thị tia lôi (vàng, tím, đỏ, đen...)
}

export interface TribulationConfig {
  fromRealmId: number;
  toRealmId: number;
  fromRealmName: string;
  toRealmName: string;
  tribulationName: string;      // Tên đại kiếp (Tam Cửu Lôi Kiếp, Cửu Cửu Lôi Kiếp...)
  totalWaves: number;           // 3, 6, hoặc 9
  waves: TribulationWaveConfig[];
  scaleTitle: string;
}

export interface TribulationRunState {
  isActive: boolean;
  config: TribulationConfig;
  currentWaveIndex: number;     // 1-indexed
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  phase: TribulationPhase;
  timerSeconds: number;         // Đếm ngược thời gian trong từng pha
  logs: string[];
  permanentDefBonusGained: number;
  permanentDmgReductionBonusGained: number;
  selectedAction?: TribulationActionType | null;
  lastWaveDamageTaken?: number;
  lastDamageDescription?: string;
  mentalShockTriggered?: boolean;
}
