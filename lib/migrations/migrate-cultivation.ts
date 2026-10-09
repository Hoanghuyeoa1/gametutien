/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/migrations/migrate-cultivation.ts
// Module Chuẩn Hóa & Di Trú Dữ Liệu Tu Luyện & Cảnh Giới (Cultivation & Realm Migration Subsystem)
// Trích xuất từ lib/save-migration.ts — Giữ nguyên 100% logic, key names & fallback mặc định

import {
  PlayerState,
  PlayerStats
} from '@/lib/types';
import { createDefaultTuViEmpowermentState } from '@/lib/tu-vi-empowerment-data';
import realmsData from '@/data/realms-data.json';

// ============================================================================
// 1. MIGRATION TIẾN ĐỘ CẢNH GIỚI & TU VI (REALMS PROGRESS & EXP)
// ============================================================================

/**
 * Migration an toàn cho Cảnh Giới & Tiến Độ Tu Luyện (Realms Progress & Cultivation Flow):
 * - Ép kiểu, kiểm tra biên và chữa lành currentRealm nếu bị lỗi/NaN/âm hoặc lệch thành tựu.
 * - Chuẩn hóa exp, maxExp theo realmsData, breakthroughProgress (0 - 100).
 * - Chuẩn hóa tuViEmpowermentState (Khai mở kinh mạch & điểm huyệt tu vi).
 * - Đảm bảo tính Idempotent: chạy nhiều lần trên cùng save không làm thay đổi trạng thái.
 */
export function migrateRealmsProgressData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Phục hồi và kiểm tra biên currentRealm
  const rawRealm = Number(cloned.currentRealm);
  let validRealm = Number.isInteger(rawRealm) && !isNaN(rawRealm)
    ? Math.max(0, Math.min(realmsData.length - 1, rawRealm))
    : 0;

  // Kiểm tra dấu hiệu thành tựu để hồi phục nếu save bị hỏng
  const claimed = cloned.achievementsState?.claimedAchievementIds || [];
  const unlocked = cloned.achievementsState?.unlockedAchievementIds || [];
  const allAch = [...(Array.isArray(claimed) ? claimed : []), ...(Array.isArray(unlocked) ? unlocked : [])];

  if (allAch.includes('ach_realm_deto')) validRealm = Math.max(validRealm, 101);
  else if (allAch.includes('ach_realm_tiende')) validRealm = Math.max(validRealm, 96);
  else if (allAch.includes('ach_realm_hoathan')) validRealm = Math.max(validRealm, 26);
  else if (allAch.includes('ach_realm_nguyenanh')) validRealm = Math.max(validRealm, 21);
  else if (allAch.includes('ach_realm_kimdan')) validRealm = Math.max(validRealm, 16);
  else if (allAch.includes('ach_realm_trucco')) validRealm = Math.max(validRealm, 11);
  else if (allAch.includes('ach_realm_luyenkhi_max')) validRealm = Math.max(validRealm, 10);
  else if (allAch.includes('ach_realm_luyenkhi')) validRealm = Math.max(validRealm, 1);

  cloned.currentRealm = validRealm;

  // 2. Chuẩn hóa exp và maxExp
  const realmInfo = (realmsData as any)[validRealm] || (realmsData as any)[0];
  const requiredExp = typeof realmInfo?.expRequired === 'number' ? realmInfo.expRequired : 100;
  cloned.maxExp = requiredExp;
  cloned.exp = typeof cloned.exp === 'number' ? Math.max(0, cloned.exp) : 0;
  cloned.breakthroughProgress = typeof cloned.breakthroughProgress === 'number'
    ? Math.max(0, Math.min(100, cloned.breakthroughProgress))
    : 0;

  // 3. Chuẩn hóa Tu Vi Empowerment State
  if (!cloned.tuViEmpowermentState || typeof cloned.tuViEmpowermentState !== 'object') {
    cloned.tuViEmpowermentState = createDefaultTuViEmpowermentState();
  } else {
    const rawTuVi = cloned.tuViEmpowermentState;
    cloned.tuViEmpowermentState = {
      unlockedAcupointIds: Array.isArray(rawTuVi.unlockedAcupointIds) ? rawTuVi.unlockedAcupointIds : [],
      completedMeridianIds: Array.isArray(rawTuVi.completedMeridianIds) ? rawTuVi.completedMeridianIds : [],
      totalTuViInfusedToCompanions: typeof rawTuVi.totalTuViInfusedToCompanions === 'number' ? Math.max(0, rawTuVi.totalTuViInfusedToCompanions) : 0,
      totalTuViCrystallized: typeof rawTuVi.totalTuViCrystallized === 'number' ? Math.max(0, rawTuVi.totalTuViCrystallized) : 0,
      crystallizedCount: typeof rawTuVi.crystallizedCount === 'number' ? Math.max(0, rawTuVi.crystallizedCount) : 0,
      overdriveActiveTurns: typeof rawTuVi.overdriveActiveTurns === 'number' ? rawTuVi.overdriveActiveTurns : 0,
      overdriveBuff: rawTuVi.overdriveBuff && typeof rawTuVi.overdriveBuff === 'object' && Boolean(rawTuVi.overdriveBuff.isActive) ? {
        isActive: true,
        tier: typeof rawTuVi.overdriveBuff.tier === 'number' ? rawTuVi.overdriveBuff.tier : 1,
        statMultiplier: typeof rawTuVi.overdriveBuff.statMultiplier === 'number' ? rawTuVi.overdriveBuff.statMultiplier : 0.1,
        remainingTurns: typeof rawTuVi.overdriveBuff.remainingTurns === 'number' ? rawTuVi.overdriveBuff.remainingTurns : 3,
        tuViCostPerTurn: typeof rawTuVi.overdriveBuff.tuViCostPerTurn === 'number' ? rawTuVi.overdriveBuff.tuViCostPerTurn : 100,
      } : null,
      catalystBonusPercent: typeof rawTuVi.catalystBonusPercent === 'number' ? Math.max(0, Math.min(25, rawTuVi.catalystBonusPercent)) : 0,
    };
  }

  return cloned;
}

// ============================================================================
// 2. MIGRATION BẾ QUAN TU LUYỆN (SECLUSION ENHANCEMENT)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Bế Quan Tu Luyện Nâng Cao (Seclusion Enhancement System)
 * Bổ sung idempotent các trường: pillToxicity, qiPurity, activeDaoSeed, harvestedDaoFruits, absorbedDaoAffixes
 */
export function migrateSeclusionEnhancementData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));
  const toxicity = typeof cloned.pillToxicity === 'number' ? Math.max(0, Math.min(100, cloned.pillToxicity)) : 0;
  cloned.pillToxicity = toxicity;
  cloned.qiPurity = typeof cloned.qiPurity === 'number'
    ? Math.max(10, Math.min(100, cloned.qiPurity))
    : Math.max(10, 100 - toxicity);
  cloned.activeDaoSeed = cloned.activeDaoSeed || cloned.activeSeclusionSeed || null;
  cloned.activeSeclusionSeed = cloned.activeDaoSeed;
  cloned.harvestedDaoFruits = Array.isArray(cloned.harvestedDaoFruits) ? cloned.harvestedDaoFruits : [];
  cloned.absorbedDaoAffixes = Array.isArray(cloned.absorbedDaoAffixes) ? cloned.absorbedDaoAffixes : [];

  return cloned;
}

// ============================================================================
// 3. MIGRATION ĐAN DƯỢC PHÁ CẢNH & HỘ MẠCH (BREAKTHROUGH CATALYSTS)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch" (Breakthrough Catalysts & Protective Talismans)
 * - Khởi tạo an toàn cấu trúc player.breakthroughCatalystState nếu chưa có:
 *   {
 *     totalCatalystBreakthroughs: 0,
 *     protectedFailuresCount: 0
 *   }
 * - Đảm bảo tính Idempotent: chạy nhiều lần trên cùng save không làm thay đổi trạng thái người chơi.
 */
export function migrateBreakthroughCatalystData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // Khởi tạo an toàn cấu trúc nếu chưa có
  cloned.breakthroughCatalystState = cloned.breakthroughCatalystState ?? {
    totalCatalystBreakthroughs: 0,
    protectedFailuresCount: 0
  };

  // Đảm bảo kiểu số hợp lệ (Idempotent và Data Integrity)
  if (typeof cloned.breakthroughCatalystState.totalCatalystBreakthroughs !== 'number') {
    cloned.breakthroughCatalystState.totalCatalystBreakthroughs = 0;
  }
  if (typeof cloned.breakthroughCatalystState.protectedFailuresCount !== 'number') {
    cloned.breakthroughCatalystState.protectedFailuresCount = 0;
  }

  return cloned;
}

// ============================================================================
// 4. MIGRATION TÂM MA & CHẤN THƯƠNG PHẢN PHỆ (BREAKTHROUGH BACKLASH)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Tác Động Của Đan Độc & Tâm Ma Phản Phệ" (Inner Demon & Pill Toxicity Backlash System)
 * - Khởi tạo an toàn cấu trúc player.injuryState nếu chưa có:
 *   {
 *     isInjured: false,
 *     injurySeverity: 0,
 *     hasDemonicBottleneck: false,
 *     bottleneckPenaltyPercent: 0,
 *     backlashHistory: []
 *   }
 * - Đảm bảo tính Idempotent: chạy nhiều lần trên cùng save không làm thay đổi trạng thái người chơi.
 */
export function migrateBreakthroughBacklashData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // Khởi tạo an toàn cấu trúc nếu chưa có
  cloned.injuryState = cloned.injuryState ?? {
    isInjured: false,
    injurySeverity: 0,
    hasDemonicBottleneck: false,
    bottleneckPenaltyPercent: 0,
    backlashHistory: []
  };

  // Đảm bảo các thuộc tính con có giá trị hợp lệ (Idempotent và Data Integrity)
  if (typeof cloned.injuryState.isInjured !== 'boolean') {
    cloned.injuryState.isInjured = false;
  }
  if (typeof cloned.injuryState.injurySeverity !== 'number') {
    cloned.injuryState.injurySeverity = 0;
  }
  if (typeof cloned.injuryState.hasDemonicBottleneck !== 'boolean') {
    cloned.injuryState.hasDemonicBottleneck = false;
  }
  if (typeof cloned.injuryState.bottleneckPenaltyPercent !== 'number') {
    cloned.injuryState.bottleneckPenaltyPercent = 0;
  }
  if (!Array.isArray(cloned.injuryState.backlashHistory)) {
    cloned.injuryState.backlashHistory = [];
  }

  return cloned;
}

// ============================================================================
// 5. MIGRATION PHẨM VỊ ĐẠO CƠ (DAO FOUNDATION GRADES)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa" (Dao Foundation Grades & Major Realm Transcendence)
 * - Khởi tạo an toàn cấu trúc nếu chưa tồn tại:
 *   player.daoFoundations = player.daoFoundations ?? {};
 *   player.unlockedInnateTalents = player.unlockedInnateTalents ?? [];
 * - Quét cảnh giới hiện tại của người chơi:
 *   Nếu người chơi cũ đã vượt qua Trúc Cơ (currentRealm >= 11), Kim Đan (currentRealm >= 16), Nguyên Anh (currentRealm >= 21)
 *   mà chưa có record trong daoFoundations, gán mặc định an toàn là 'ha_pham' để tránh lỗi undefined.
 * - Đảm bảo tính Idempotent: chạy nhiều lần không làm biến dạng dữ liệu.
 */
export function migrateDaoFoundationData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Khởi tạo an toàn cấu trúc nếu chưa tồn tại
  cloned.daoFoundations = cloned.daoFoundations ?? {};
  if (typeof cloned.daoFoundations !== 'object' || Array.isArray(cloned.daoFoundations)) {
    cloned.daoFoundations = {};
  }
  if (!Array.isArray(cloned.unlockedInnateTalents)) {
    cloned.unlockedInnateTalents = [];
  }

  // 2. Quét cảnh giới hiện tại của người chơi:
  const currentRealm = typeof cloned.currentRealm === 'number'
    ? cloned.currentRealm
    : parseInt(String(cloned.currentRealm || 0), 10) || 0;

  // Vượt qua Luyện Khí -> Trúc Cơ (Realm >= 11)
  if (currentRealm >= 11) {
    if (!cloned.daoFoundations.luyen_khi_to_truc_co) {
      cloned.daoFoundations.luyen_khi_to_truc_co = 'ha_pham';
    }
  }

  // Vượt qua Trúc Cơ -> Kim Đan (Realm >= 16)
  if (currentRealm >= 16) {
    if (!cloned.daoFoundations.truc_co_to_kim_dan) {
      cloned.daoFoundations.truc_co_to_kim_dan = 'ha_pham';
    }
  }

  // Vượt qua Kim Đan -> Nguyên Anh (Realm >= 21)
  if (currentRealm >= 21) {
    if (!cloned.daoFoundations.kim_dan_to_nguyen_anh) {
      cloned.daoFoundations.kim_dan_to_nguyen_anh = 'ha_pham';
    }
  }

  return cloned;
}

// ============================================================================
// 6. ORCHESTRATOR PHÂN HỆ TU LUYỆN (NORMALIZE CULTIVATION STATE)
// ============================================================================

/**
 * Chuẩn hóa toàn diện phân hệ Tu Luyện & Cảnh Giới:
 * Gọi tuần tự các hàm di trú Tu Luyện theo thứ tự logic:
 * 1. migrateRealmsProgressData (Cảnh giới, exp, tu vi empowerment)
 * 2. migrateSeclusionEnhancementData (Bế quan, đan độc, khí thuần khiết, đạo chủng)
 * 3. migrateBreakthroughCatalystData (Đan phá cảnh, trận bàn hộ mạch)
 * 4. migrateBreakthroughBacklashData (Tâm ma, chấn thương phản phệ)
 * 5. migrateDaoFoundationData (Phẩm vị đạo cơ)
 */
export function normalizeCultivationState(player: PlayerState): PlayerState {
  if (!player) return player;

  let state = migrateRealmsProgressData(player);
  state = migrateSeclusionEnhancementData(state);
  state = migrateBreakthroughCatalystData(state);
  state = migrateBreakthroughBacklashData(state);
  state = migrateDaoFoundationData(state);

  return state as PlayerState;
}
