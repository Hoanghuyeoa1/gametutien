/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/migrations/migrate-abode-social.ts
// Module Chuẩn Hóa & Di Trú Dữ Liệu Động Phủ & Xã Hội (Abode, Garden, Companions, Sect & Destiny Subsystem)
// Trích xuất từ lib/save-migration.ts — Giữ nguyên 100% logic, key names & fallback mặc định

import {
  PlayerState,
  PlayerStats,
  AbodeState,
  AbodePlotState,
  CompanionsDataState,
  CompanionPlayerState,
  SectState,
  SectId,
  DestinySlotState
} from '@/lib/types';
import {
  createDefaultAbodeState,
  createDefaultAbodePlots,
  SPIRIT_ARRAY_LEVELS
} from '@/lib/abode-data';
import {
  createDefaultCompanionsState,
  createDefaultCompanionPlayerState,
  COMPANIONS_DATA
} from '@/lib/companions-data';
import {
  createDefaultSectState,
  createDefaultGuardianArray,
  generateDailyQuests,
  SECT_DATA_MAP,
  SECT_PROFILES
} from '@/lib/sect-data';
import {
  DEFAULT_DESTINY,
  createDefaultDestinyBoard,
  getDestinySlotMaxCount
} from '@/lib/destiny-data';

// ============================================================================
// 1. MIGRATION THIÊN MỆNH & MỆNH CÁCH (DESTINY TALENTS SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Thiên Mệnh & Bàn Khảm Mệnh Cách (Destiny Talents System):
 * - Chuẩn hóa player.destiny và player.destinyBoard: { unlockedSlots, equippedIds, collectedIds }
 * - Mở rộng số slot tối đa theo cảnh giới hiện tại.
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migrateDestinyTalentsData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));
  const currentRealm = typeof cloned.currentRealm === 'number' ? cloned.currentRealm : 0;
  const maxDestinySlots = getDestinySlotMaxCount(currentRealm);

  const destiny = cloned.destiny || DEFAULT_DESTINY;
  const rawDestinyBoard = cloned.destinyBoard || createDefaultDestinyBoard(destiny.id);

  const destinyBoard: DestinySlotState = {
    unlockedSlots: Math.max(maxDestinySlots, rawDestinyBoard.unlockedSlots || 3),
    equippedIds: Array.isArray(rawDestinyBoard.equippedIds) && rawDestinyBoard.equippedIds.length > 0
      ? rawDestinyBoard.equippedIds.slice(0, maxDestinySlots)
      : [destiny.id],
    collectedIds: Array.isArray(rawDestinyBoard.collectedIds) && rawDestinyBoard.collectedIds.length > 0
      ? Array.from(new Set([...rawDestinyBoard.collectedIds, destiny.id]))
      : [destiny.id]
  };

  cloned.destiny = destiny;
  cloned.destinyBoard = destinyBoard;

  return cloned;
}

// ============================================================================
// 2. MIGRATION ĐỘNG PHỦ (ABODE STATE SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Động Phủ Tu Luyện (Abode State System):
 * - Chuẩn hóa cấp bậc Động Phủ (level 1-5), Tụ Linh Trận (spiritArray level 1-10).
 * - Khởi tạo Linh Thú Viên (beastSanctuary) và Tàng Kinh Các (scripturePavilion).
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn dữ liệu hiện có.
 */
export function migrateAbodeData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));
  const defaultAbode = createDefaultAbodeState();

  if (cloned.abodeState && typeof cloned.abodeState === 'object') {
    const rawAbode = cloned.abodeState;
    const spiritLvl = Math.max(1, Math.min(10, rawAbode.spiritArray?.level || 1));
    const spiritConf = SPIRIT_ARRAY_LEVELS[spiritLvl] || SPIRIT_ARRAY_LEVELS[1];

    cloned.abodeState = {
      ...defaultAbode,
      ...rawAbode,
      level: Math.max(1, Math.min(5, typeof rawAbode.level === 'number' ? rawAbode.level : 1)),
      spiritArray: {
        level: spiritLvl,
        tuViRateBonus: spiritConf.tuViRateBonus,
        autoHealBonus: spiritConf.autoHealBonus
      },
      beastSanctuary: {
        roamingBeastIds: Array.isArray(rawAbode.beastSanctuary?.roamingBeastIds) ? rawAbode.beastSanctuary.roamingBeastIds : [],
        fertilizerStored: typeof rawAbode.beastSanctuary?.fertilizerStored === 'number' ? rawAbode.beastSanctuary.fertilizerStored : 1,
        lastFertilizerTick: rawAbode.beastSanctuary?.lastFertilizerTick || Date.now()
      },
      scripturePavilion: {
        showcasedManualIds: Array.isArray(rawAbode.scripturePavilion?.showcasedManualIds) ? rawAbode.scripturePavilion.showcasedManualIds : [],
        disciples: Array.isArray(rawAbode.scripturePavilion?.disciples) ? rawAbode.scripturePavilion.disciples : []
      }
    };
  } else {
    cloned.abodeState = defaultAbode;
  }

  return cloned;
}

// ============================================================================
// 3. MIGRATION DƯỢC ĐIỀN ĐỘNG PHỦ (HERBAL GARDEN PLOTS SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho Dược Điền Động Phủ & Linh Điền (Herbal Garden Plots System):
 * - Chuẩn hóa hệ thống 12 ô đất trồng dược liệu (AbodePlotState).
 * - Di trú an toàn từ linhDien hoặc garden cũ (6 ô) sang abodeState (12 ô).
 * - Đồng bộ tương thích ngược hai chiều giữa abodeState.plots và player.linhDien.
 * - Đảm bảo tính lũy đẳng (Idempotent).
 */
export function migrateHerbalGardenData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));
  const rawAbode = cloned.abodeState;
  const linhDien = cloned.linhDien;
  const garden = cloned.garden;

  // Lấy nguồn plots từ abodeState hiện có, hoặc fallback sang linhDien / garden cũ (6 ô)
  const sourcePlots = (rawAbode && Array.isArray(rawAbode.plots) && rawAbode.plots.length > 0)
    ? rawAbode.plots
    : ((linhDien && Array.isArray(linhDien.plots)) ? linhDien.plots : (garden?.plots || []));

  const plots: AbodePlotState[] = createDefaultAbodePlots().map((defaultPlot, idx) => {
    const existing = sourcePlots[idx];
    if (existing) {
      return {
        ...defaultPlot,
        ...existing,
        soilType: existing.soilType || defaultPlot.soilType,
        unlocked: typeof existing.unlocked === 'boolean'
          ? existing.unlocked
          : (existing.isUnlocked !== undefined ? Boolean(existing.isUnlocked) : defaultPlot.unlocked),
        seedId: existing.seedId || null,
        plantedAt: existing.plantedAt || null,
        harvestAt: existing.harvestAt || null,
        fertilized: Boolean(existing.fertilized)
      };
    }
    return defaultPlot;
  });

  if (!cloned.abodeState || typeof cloned.abodeState !== 'object') {
    cloned.abodeState = createDefaultAbodeState();
  }
  cloned.abodeState.plots = plots;

  // Đồng bộ linhDien để tương thích ngược
  cloned.linhDien = {
    plots: plots.map(p => ({
      id: p.id,
      seedId: p.seedId,
      plantedAt: p.plantedAt,
      harvestAt: p.harvestAt,
      fertilized: p.fertilized,
      isUnlocked: p.unlocked
    }))
  };

  return cloned;
}

// ============================================================================
// 4. MIGRATION ĐẠO LỮ TIÊN DUYÊN (COMPANIONS SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Đạo Lữ Tiên Duyên (Companions System):
 * - Chuẩn hóa companionsState, hợp nhất danh sách COMPANIONS_DATA với fallback an toàn.
 * - Khởi tạo fatigueUntil, totalEpiphanies, và kiểm tra tính hợp lệ của activeCompanionId.
 * - Thanh lọc mock data cũ cho nhân vật sơ kỳ (currentRealm <= 1).
 * - Cập nhật hiệu lực buff Tâm Tịnh Thần Diệu (tamTinhThanDieuUntil).
 * - Đảm bảo tính lũy đẳng (Idempotent).
 */
export function migrateCompanionsData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));
  const rawCompanionsState = cloned.companionsState;

  let companionsState: CompanionsDataState;
  if (!rawCompanionsState || !rawCompanionsState.companions || typeof rawCompanionsState.companions !== 'object') {
    companionsState = createDefaultCompanionsState();
  } else {
    const mergedCompanions: Record<string, CompanionPlayerState> = { ...rawCompanionsState.companions };

    COMPANIONS_DATA.forEach(c => {
      if (!mergedCompanions[c.id]) {
        mergedCompanions[c.id] = createDefaultCompanionPlayerState(c.id);
      }
    });

    Object.keys(mergedCompanions).forEach(k => {
      if (mergedCompanions[k]) {
        mergedCompanions[k] = {
          ...mergedCompanions[k],
          fatigueUntil: typeof mergedCompanions[k].fatigueUntil === 'number' ? mergedCompanions[k].fatigueUntil : 0,
          totalEpiphanies: typeof mergedCompanions[k].totalEpiphanies === 'number' ? mergedCompanions[k].totalEpiphanies : 0
        };
      }
    });

    let activeCompId = rawCompanionsState.activeCompanionId || null;
    const currentRealm = typeof cloned.currentRealm === 'number' ? cloned.currentRealm : 0;

    // Tự động thanh lọc mock data cũ cho save sơ kỳ (currentRealm <= 1) hoặc dữ liệu không hợp lệ:
    if (currentRealm <= 1) {
      const lacThanhTuyetState = mergedCompanions['companion_lac_thanh_tuyet'];
      if (lacThanhTuyetState && !lacThanhTuyetState.isBonded && lacThanhTuyetState.affinity === 15) {
        lacThanhTuyetState.affinity = 0;
        lacThanhTuyetState.isMet = false;
      }
      if (activeCompId && (!mergedCompanions[activeCompId] || !mergedCompanions[activeCompId].isBonded)) {
        activeCompId = null;
      }
    } else if (activeCompId) {
      const compState = mergedCompanions[activeCompId];
      if (!compState || (!compState.isMet && !compState.isBonded)) {
        activeCompId = null;
      }
    }

    companionsState = {
      activeCompanionId: activeCompId,
      stationedGardenCompanionId: rawCompanionsState.stationedGardenCompanionId || null,
      tamThanHopNhatUntil: typeof rawCompanionsState.tamThanHopNhatUntil === 'number' ? rawCompanionsState.tamThanHopNhatUntil : 0,
      companions: mergedCompanions,
      tamTinhThanDieuUntil: typeof rawCompanionsState.tamTinhThanDieuUntil === 'number' ? rawCompanionsState.tamTinhThanDieuUntil : 0
    };
  }

  cloned.companionsState = companionsState;

  // Cập nhật hiệu lực buff Tâm Tịnh Thần Diệu
  const isTamTinhActive = Boolean(
    companionsState.tamTinhThanDieuUntil && Date.now() < companionsState.tamTinhThanDieuUntil
  );
  cloned.activeBuffs = {
    ...(cloned.activeBuffs || {}),
    tamTinhThanDieu: isTamTinhActive,
    tamTinhThanDieuUntil: companionsState.tamTinhThanDieuUntil
  };

  return cloned;
}

// ============================================================================
// 5. MIGRATION TÔNG MÔN (SECT SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Tông Môn (Sect System):
 * - Chuẩn hóa sectState, bảo toàn 100% điểm cống hiến cũ (contribution, totalContribution).
 * - Map các định danh môn phái cũ sang ID môn phái hợp lệ (SECT_DATA_MAP / SECT_PROFILES).
 * - Chuẩn hóa Hộ Tông Đại Trận, nhiệm vụ tông môn, chiến tranh linh mạch.
 * - Đồng bộ các trường tương thích ngược: sect, sectData, sectRank, sectContribution, tongMon.
 * - Đảm bảo tính lũy đẳng (Idempotent).
 */
export function migrateSectData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));
  let sectState = cloned.sectState;

  if (!sectState || typeof sectState !== 'object') {
    sectState = createDefaultSectState();
    if (cloned.sect) {
      sectState.sectId = cloned.sect as SectId;
    } else if (typeof cloned.tongMon === 'string') {
      const tm = cloned.tongMon;
      if (tm.includes('Thanh Vân') || tm.includes('Thái Thanh') || tm.includes('Chính Đạo')) {
        sectState.sectId = 'sect_thanh_van_mon';
      } else if (tm.includes('Huyết Sát') || tm.includes('Cửu U') || tm.includes('Ma')) {
        sectState.sectId = 'sect_huyet_sat_tong';
      } else if (tm.includes('Thiên Kiếm') || tm.includes('Kiếm')) {
        sectState.sectId = 'sect_thai_at_kiem_tong';
      }
    }
    if (cloned.sectRank) {
      sectState.rank = cloned.sectRank;
    }
  }

  // Bảo toàn 100% điểm cống hiến tông môn cũ
  if (typeof cloned.sectContribution === 'number') {
    sectState.contribution = Math.max(sectState.contribution || 0, cloned.sectContribution);
    sectState.totalContribution = Math.max(sectState.totalContribution || 0, cloned.sectContribution);
  }

  // Chuẩn hóa sectId an toàn: nếu ID không tồn tại hoặc là ID cũ, map về ID hợp lệ
  if (sectState.sectId) {
    const knownSect = SECT_DATA_MAP[sectState.sectId] || SECT_PROFILES[sectState.sectId];
    if (knownSect) {
      sectState.sectId = knownSect.id as SectId;
    } else {
      sectState.sectId = 'sect_thanh_van_mon';
    }
  }

  if (sectState.sectId && (!sectState.dailyQuests || sectState.dailyQuests.length === 0)) {
    sectState.dailyQuests = generateDailyQuests();
  }
  if (!Array.isArray(sectState.unlockedRecipes)) sectState.unlockedRecipes = [];
  if (!Array.isArray(sectState.unlockedManuals)) sectState.unlockedManuals = [];
  if (!sectState.rank) sectState.rank = 'tap_dich';
  if (typeof sectState.arenaRank !== 'number') sectState.arenaRank = 5;
  if (!sectState.guardianArray) {
    sectState.guardianArray = createDefaultGuardianArray();
  }
  if (!Array.isArray(sectState.occupiedVeinIds)) sectState.occupiedVeinIds = [];
  if (typeof sectState.lastVeinWarAt !== 'number') sectState.lastVeinWarAt = 0;
  if (typeof sectState.lastVeinClaimAt !== 'number') sectState.lastVeinClaimAt = 0;
  if (!sectState.veinStates || typeof sectState.veinStates !== 'object') sectState.veinStates = {};

  const tongMonName = sectState.sectId
    ? (SECT_DATA_MAP[sectState.sectId]?.name || SECT_PROFILES[sectState.sectId]?.name)
    : cloned.tongMon;

  cloned.sectState = sectState;
  cloned.sectData = sectState;
  cloned.sect = sectState.sectId;
  cloned.sectRank = sectState.rank;
  cloned.sectContribution = sectState.contribution;
  cloned.tongMon = tongMonName;

  return cloned;
}

// ============================================================================
// 6. ORCHESTRATOR PHÂN HỆ ĐỘNG PHỦ & XÃ HỘI (NORMALIZE ABODE STATE)
// ============================================================================

/**
 * Chuẩn hóa toàn diện phân hệ Động Phủ & Xã Hội:
 * Gọi tuần tự các hàm di trú Động Phủ & Xã Hội theo thứ tự logic:
 * 1. migrateDestinyTalentsData (Thiên mệnh & Bàn khảm mệnh cách)
 * 2. migrateAbodeData (Động phủ, Tụ Linh Trận, Thú Viên, Tàng Kinh Các)
 * 3. migrateHerbalGardenData (Dược điền 12 ô & đồng bộ linh điền)
 * 4. migrateCompanionsData (Đạo lữ, hảo cảm, đồng hành)
 * 5. migrateSectData (Tông môn, cống hiến, nhiệm vụ, chiến tranh linh mạch)
 */
export function normalizeAbodeState(player: PlayerState): PlayerState {
  if (!player) return player;

  let state = migrateDestinyTalentsData(player);
  state = migrateAbodeData(state);
  state = migrateHerbalGardenData(state);
  state = migrateCompanionsData(state);
  state = migrateSectData(state);

  return state as PlayerState;
}
