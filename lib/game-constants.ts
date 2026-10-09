// ============================================
// TU TIÊN GAME - GAME CONSTANTS & FORMULAS
// ============================================

import realmsData from '@/data/realms-data.json';
import { isMajorBreakthroughRealm } from '@/lib/attribute-perks';

// ============================================
// CÔNG THỨC TÍNH TU VI CẦN CHO MỖI CẢNH GIỚI
// ============================================
// Đồng bộ 100% với realmsData (105 cảnh giới: 0..104)

export const REALM_STAGES = {
  PHAM_NHAN: { start: 0, end: 0, baseExp: 0, multiplier: 1 },
  LUYEN_KHI: { start: 1, end: 10, baseExp: 100, multiplier: 1.5 },
  TRUC_CO: { start: 11, end: 15, baseExp: 1450, multiplier: 1.8 },
  KIM_DAN: { start: 16, end: 20, baseExp: 10400, multiplier: 2.0 },
  NGUYEN_ANH: { start: 21, end: 25, baseExp: 91200, multiplier: 2.2 },
  HOA_THAN: { start: 26, end: 30, baseExp: 807000, multiplier: 2.3 },
  LUYEN_HU: { start: 31, end: 35, baseExp: 7170000, multiplier: 2.4 },
  HOP_THE: { start: 36, end: 40, baseExp: 64100000, multiplier: 2.5 },
  DAI_TUA: { start: 41, end: 45, baseExp: 581000000, multiplier: 2.6 },
  DO_KIEP: { start: 46, end: 50, baseExp: 5330000000, multiplier: 2.7 },
  PHI_THANG: { start: 51, end: 55, baseExp: 49000000000, multiplier: 2.8 },
  CHAN_TIEN: { start: 56, end: 60, baseExp: 455000000000, multiplier: 3.0 },
  HUYEN_TIEN: { start: 61, end: 65, baseExp: 4270000000000, multiplier: 3.2 },
  DIA_TIEN: { start: 66, end: 70, baseExp: 40300000000000, multiplier: 3.4 },
  THIEN_TIEN: { start: 71, end: 75, baseExp: 384000000000000, multiplier: 3.6 },
  KIM_TIEN: { start: 76, end: 80, baseExp: 3680000000000000, multiplier: 3.8 },
  THAI_AT_KIM_TIEN: { start: 81, end: 85, baseExp: 35500000000000000, multiplier: 4.0 },
  CHUAN_DE: { start: 86, end: 90, baseExp: 345000000000000000, multiplier: 4.2 },
  DAI_DE: { start: 91, end: 95, baseExp: 3380000000000000000, multiplier: 4.4 },
  TIEN_DE: { start: 96, end: 100, baseExp: 33500000000000000000, multiplier: 4.6 },
  DE_TO: { start: 101, end: 104, baseExp: 335000000000000000000, multiplier: 5.0 },
};

export const MONOTONIC_TU_VI: number[] = realmsData.map(r => r.requirements.tuVi);

/**
 * Tính tu vi cần thiết cho một cảnh giới (Tăng tịnh tiến đơn điệu tuyệt đối)
 */
export function calculateRequiredTuVi(realmIndex: number): number {
  if (realmIndex <= 0) return 0;
  if (realmIndex >= realmsData.length) {
    return realmsData[realmsData.length - 1].requirements.tuVi;
  }
  return realmsData[realmIndex]?.requirements?.tuVi || 0;
}

// ============================================
// CÔNG THỨC TÍNH TỈ LỆ ĐỘT PHÁ
// ============================================

/**
 * Base success rate giảm dần theo realm
 * Mortal realms: 90%
 * Cultivator realms (1-45): 90% -> 55%
 * Immortal realms (46-80): 50% -> 35%
 * Emperor realms (81-104): 32% -> 20%
 */
export function calculateBaseSuccessRate(realmIndex: number): number {
  if (realmIndex === 0) return 100; // Phàm Nhân -> Luyện Khí luôn thành công
  if (realmIndex <= 10) return 90;  // Luyện Khí (1-10)
  if (realmIndex <= 15) return 85;  // Trúc Cơ (11-15)
  if (realmIndex <= 20) return 80;  // Kim Đan (16-20)
  if (realmIndex <= 25) return 75;  // Nguyên Anh (21-25)
  if (realmIndex <= 30) return 70;  // Hóa Thần (26-30)
  if (realmIndex <= 35) return 65;  // Luyện Hư (31-35)
  if (realmIndex <= 40) return 60;  // Hợp Thể (36-40)
  if (realmIndex <= 45) return 55;  // Đại Thừa (41-45)
  if (realmIndex <= 50) return 50;  // Độ Kiếp (46-50)
  if (realmIndex <= 55) return 48;  // Phi Thăng (51-55)
  if (realmIndex <= 60) return 45;  // Chân Tiên (56-60)
  if (realmIndex <= 65) return 42;  // Huyền Tiên (61-65)
  if (realmIndex <= 70) return 40;  // Địa Tiên (66-70)
  if (realmIndex <= 75) return 38;  // Thiên Tiên (71-75)
  if (realmIndex <= 80) return 35;  // Kim Tiên (76-80)
  if (realmIndex <= 85) return 32;  // Thái Ất Kim Tiên (81-85)
  if (realmIndex <= 90) return 28;  // Chuẩn Đế (86-90)
  if (realmIndex <= 95) return 25;  // Đại Đế (91-95)
  if (realmIndex <= 100) return 22; // Tiên Đế (96-100)
  return 20;                        // Đế Tổ (101-104)
}

/**
 * Tính tỉ lệ đột phá thực tế
 * = Base rate + (Ngộ tính modifier) + (Khí vận modifier) + (Item bonus)
 */
export function calculateBreakthroughChance(
  realmIndex: number,
  ngoTinh: number,
  khiVan: number,
  itemBonus: number = 0
): number {
  const baseRate = calculateBaseSuccessRate(realmIndex);
  const ngoTinhBonus = (ngoTinh - 50) * 0.2; // -10% to +10%
  const khiVanBonus = (khiVan - 50) * 0.15;  // -7.5% to +7.5%
  
  const finalRate = baseRate + ngoTinhBonus + khiVanBonus + itemBonus;
  
  return Math.max(5, Math.min(95, finalRate)); // Clamp giữa 5% và 95%
}

/**
 * Tính tỉ lệ gặp Tâm Ma
 * Xuất hiện từ Kim Đan (realm 12+)
 * Perk: Bất Động Minh Vương (Tâm Cảnh >= 90) miễn nhiễm 100% Tâm Ma khi độ kiếp tiểu cảnh giới.
 */
export function calculateTamMaChance(realmIndex: number, tamCanh: number): number {
  if (realmIndex < 12) return 0; // Chưa đủ realm
  
  // Bất Động Minh Vương: Miễn nhiễm hoàn toàn 100% nguy cơ Tâm Ma xâm lấn khi độ kiếp tiểu cảnh giới
  if (tamCanh >= 90 && !isMajorBreakthroughRealm(realmIndex)) {
    return 0;
  }

  const baseChance = Math.min(30, (realmIndex - 11) * 1.5); // 1.5% -> 30%
  const tamCanhReduction = (tamCanh - 50) * 0.2; // Tâm cảnh cao giảm tỉ lệ
  
  return Math.max(0, baseChance - tamCanhReduction);
}

/**
 * Tính damage của Thiên Kiếp
 * Xuất hiện từ Độ Kiếp (realm 42+)
 */
export function calculateThienKiepDifficulty(realmIndex: number): {
  waves: number;
  baseDamage: number;
  survivability: number;
} {
  if (realmIndex < 42) {
    return { waves: 0, baseDamage: 0, survivability: 100 };
  }
  
  const waveCount = Math.floor((realmIndex - 42) / 5) + 3; // 3-14 waves
  const baseDamage = 1000 * Math.pow(1.8, realmIndex - 42);
  const survivability = Math.max(20, 80 - (realmIndex - 42)); // 80% -> 20%
  
  return { waves: waveCount, baseDamage, survivability };
}

// ============================================
// HỆ THỐNG LINH THẠCH
// ============================================

/**
 * Tính linh thạch cần cho đột phá
 */
export function calculateBreakthroughCost(realmIndex: number): number {
  if (realmIndex === 0) return 0;
  return Math.floor(100 * Math.pow(2.5, realmIndex / 5));
}

/**
 * Tính linh thạch nhận được sau tu luyện
 */
export function calculateCultivationReward(
  realmIndex: number,
  duration: number, // minutes
  khiVan: number
): number {
  const baseReward = Math.floor(10 * Math.pow(1.5, realmIndex / 10) * duration);
  const khiVanMultiplier = 0.5 + (khiVan / 100); // 0.5x - 1.5x
  
  return Math.floor(baseReward * khiVanMultiplier);
}

// ============================================
// TỐC ĐỘ TU LUYỆN
// ============================================

/**
 * Tính tu vi gain per minute
 */
export function calculateCultivationSpeed(
  realmIndex: number,
  canCot: number,
  tongMonBonus: number = 0
): number {
  const baseSpeed = 10 * Math.pow(1.3, realmIndex / 5);
  const canCotMultiplier = 0.5 + (canCot / 50); // 0.5x - 2.5x
  
  return Math.floor(baseSpeed * canCotMultiplier * (1 + tongMonBonus));
}

// ============================================
// RANDOM EVENT CHANCES
// ============================================

/**
 * Tính tỉ lệ random event xảy ra
 */
export function calculateEventChance(khiVan: number): number {
  return 10 + (khiVan / 5); // 10% - 30% based on luck
}

// ============================================
// PHẦN THƯỞNG ĐỘT PHÁ THÀNH CÔNG
// ============================================

export function calculateBreakthroughRewards(realmIndex: number): {
  tuVi: number;
  linhThach: number;
  danhVong: number;
} {
  return {
    tuVi: Math.floor(calculateRequiredTuVi(realmIndex) * 0.1), // 10% của yêu cầu
    linhThach: Math.floor(calculateBreakthroughCost(realmIndex) * 2), // x2 cost
    danhVong: Math.floor(100 * Math.pow(1.5, realmIndex / 10))
  };
}

// ============================================
// TIER NAMES
// ============================================

export const TIER_NAMES = {
  0: "Sơ Kỳ",
  1: "Trung Kỳ",
  2: "Hậu Kỳ",
  3: "Đỉnh Phong",
  4: "Đại Viên Mãn"
};

// ============================================
// CONSTANTS
// ============================================

export const GAME_CONSTANTS = {
  MIN_STAT: 1,
  MAX_STAT: 100,
  STARTING_LINH_THACH: 1000,
  STARTING_CAN_COT: 50,
  STARTING_NGO_TINH: 50,
  STARTING_KHI_VAN: 50,
  STARTING_TAM_CANH: 50,
  
  // Tu luyện
  MIN_CULTIVATION_TIME: 1,      // minutes
  MAX_CULTIVATION_TIME: 1440,   // 24 hours
  
  // Đột phá
  BREAKTHROUGH_COOLDOWN: 60,     // minutes
  FAILED_BREAKTHROUGH_PENALTY: 0.1, // Mất 10% tu vi hiện tại
  
  // Tâm ma
  TAM_MA_APPEAR_FROM: 12,       // Kim Đan
  TAM_MA_PENALTY_REALM_DROP: true,
  
  // Thiên kiếp
  THIEN_KIEP_START_FROM: 42,    // Độ Kiếp
};

// Re-export Dynamic Stat Cap & Milestone Perks
export {
  getMaxStatLimit,
  getStatCapDescription,
  ATTRIBUTE_MILESTONE_PERKS,
  getActiveMilestonePerks,
  hasMilestonePerk,
  MAJOR_REALM_INDICES,
  isMajorBreakthroughRealm,
  calculateEffectiveRequiredTuVi
} from '@/lib/attribute-perks';
