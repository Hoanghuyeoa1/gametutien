// lib/ancestral-blessing-logic.ts
// Pure Business Logic cho phân hệ Đạo Vận Tiên Bi: Tổ Tiên Phù Hộ & Huyết Mạch Thế Gia

import type { PlayerStats } from './types/player';
import type { PastLifeRecord } from './types/character';
import type {
  IncenseGrade,
  AggregatedAncestralResonance,
  ActiveOfferingBuff,
  AncestralState
} from './types/ancestral-blessing';
import {
  INCENSE_OFFERINGS_CONFIG,
  ANCESTRAL_CAPS,
  EPITHET_RESONANCE_MAP
} from './ancestral-blessing-data';

// ─── 1. Tính Toán Hào Quang Tiên Bi Cộng Dồn (Ancestral Resonance) ───────────

export function calculateAncestralResonance(pastLives: PastLifeRecord[] = []): AggregatedAncestralResonance {
  const result: AggregatedAncestralResonance = {
    totalGraves: pastLives.length,
    danCucPhamRateBonus: 0,
    swordDamageBonus: 0,
    tribulationCostReduction: 0,
    tuViSpeedBonus: 0,
    extraStartingLifespan: 0,
    extraStartingLinhThach: 0,
    extraCanCot: 0,
    extraNgoTinh: 0,
    extraKhiVan: 0,
    critDmgBonus: 0,
    marketSellPriceBonus: 0,
    gestationTimeReductionPercent: 0,
    allStatsBonusPercent: 0,
  };

  if (!pastLives || pastLives.length === 0) {
    return result;
  }

  for (const record of pastLives) {
    const title = record.epithet?.title;
    const grade = record.epithet?.grade || 'hoang';
    const specificEffect = title ? EPITHET_RESONANCE_MAP[title] : undefined;

    if (specificEffect) {
      if (specificEffect.danCucPhamRate) result.danCucPhamRateBonus += specificEffect.danCucPhamRate;
      if (specificEffect.swordDamagePercent) result.swordDamageBonus += specificEffect.swordDamagePercent;
      if (specificEffect.tribulationReductionPercent) result.tribulationCostReduction += specificEffect.tribulationReductionPercent;
      if (specificEffect.tuViSpeedPercent) result.tuViSpeedBonus += specificEffect.tuViSpeedPercent;
      if (specificEffect.lifespanYears) result.extraStartingLifespan += specificEffect.lifespanYears;
      if (specificEffect.linhThachBonus) result.extraStartingLinhThach += specificEffect.linhThachBonus;
      if (specificEffect.canCot) result.extraCanCot += specificEffect.canCot;
      if (specificEffect.ngoTinh) result.extraNgoTinh += specificEffect.ngoTinh;
      if (specificEffect.khiVan) result.extraKhiVan += specificEffect.khiVan;
      if (specificEffect.critDmgPercent) result.critDmgBonus += specificEffect.critDmgPercent;
      if (specificEffect.marketSellBonusPercent) result.marketSellPriceBonus += specificEffect.marketSellBonusPercent;
      if (specificEffect.gestationReductionPercent) result.gestationTimeReductionPercent += specificEffect.gestationReductionPercent;
      if (specificEffect.allStatsPercent) result.allStatsBonusPercent += specificEffect.allStatsPercent;
    } else {
      // Phụ trợ theo phẩm cấp danh hiệu chung nếu không khớp danh hiệu đặc thù
      switch (grade) {
        case 'than':
          result.tuViSpeedBonus += 5;
          result.allStatsBonusPercent += 3;
          result.extraStartingLifespan += 20;
          result.extraKhiVan += 5;
          break;
        case 'thien':
          result.tuViSpeedBonus += 3;
          result.extraCanCot += 3;
          result.extraNgoTinh += 3;
          result.extraKhiVan += 2;
          break;
        case 'dia':
          result.tuViSpeedBonus += 2;
          result.extraCanCot += 2;
          result.extraStartingLifespan += 5;
          break;
        case 'huyen':
        case 'hoang':
        default:
          result.extraStartingLinhThach += 200;
          result.extraCanCot += 1;
          result.extraNgoTinh += 1;
          break;
      }
    }
  }

  // Kẹp biên trần (Hard Caps) để đảm bảo cân bằng game không bị lạm phát
  result.danCucPhamRateBonus = Math.min(ANCESTRAL_CAPS.MAX_DAN_CUC_PHAM_RATE, result.danCucPhamRateBonus);
  result.swordDamageBonus = Math.min(ANCESTRAL_CAPS.MAX_SWORD_DMG_BONUS, result.swordDamageBonus);
  result.tribulationCostReduction = Math.min(ANCESTRAL_CAPS.MAX_TRIBULATION_REDUCTION, result.tribulationCostReduction);
  result.tuViSpeedBonus = Math.min(ANCESTRAL_CAPS.MAX_TU_VI_SPEED, result.tuViSpeedBonus);
  result.extraKhiVan = Math.min(ANCESTRAL_CAPS.MAX_KHI_VAN, result.extraKhiVan);
  result.allStatsBonusPercent = Math.min(ANCESTRAL_CAPS.MAX_ALL_STATS, result.allStatsBonusPercent);
  result.critDmgBonus = Math.min(ANCESTRAL_CAPS.MAX_CRIT_DMG, result.critDmgBonus);
  result.marketSellPriceBonus = Math.min(ANCESTRAL_CAPS.MAX_MARKET_BONUS, result.marketSellPriceBonus);
  result.extraStartingLifespan = Math.min(ANCESTRAL_CAPS.MAX_LIFESPAN, result.extraStartingLifespan);
  result.gestationTimeReductionPercent = Math.min(ANCESTRAL_CAPS.MAX_GESTATION_REDUCTION, result.gestationTimeReductionPercent);

  return result;
}

// ─── 2. Kiểm Tra Hiệu Lực Dâng Hương Cúng Tế ─────────────────────────────────

export function isOfferingBuffActive(
  activeBuff: ActiveOfferingBuff | null | undefined,
  currentTimestamp: number = Date.now()
): boolean {
  if (!activeBuff) return false;
  return currentTimestamp < activeBuff.expiresAt;
}

// ─── 3. Thực Hiện Dâng Hương Cúng Tế Bài Vị Tổ Tiên ──────────────────────────

export function performAncestralOffering(
  player: PlayerStats,
  incenseId: IncenseGrade,
  currentTimestamp: number = Date.now()
): { success: boolean; updatedPlayer?: PlayerStats; message: string } {
  const config = INCENSE_OFFERINGS_CONFIG[incenseId];
  if (!config) {
    return { success: false, message: 'Loại nhang cúng tế không tồn tại!' };
  }

  if (player.linhThach < config.costLinhThach) {
    return {
      success: false,
      message: `Không đủ Linh Thạch dâng hương! Cần ${config.costLinhThach.toLocaleString()} Linh Thạch.`,
    };
  }

  const durationMs = config.durationHours * 60 * 60 * 1000;
  const newActiveBuff: ActiveOfferingBuff = {
    incenseId,
    incenseName: config.name,
    startTime: currentTimestamp,
    expiresAt: currentTimestamp + durationMs,
    protectionCharges: config.protectionCharges,
    statBuffs: config.statBuffs,
  };

  const currentAncestralState: AncestralState = player.ancestralState || {
    activeBuff: null,
    totalOfferingsMade: 0,
    protectionTriggersCount: 0,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: player.linhThach - config.costLinhThach,
    ancestralState: {
      ...currentAncestralState,
      activeBuff: newActiveBuff,
      totalOfferingsMade: currentAncestralState.totalOfferingsMade + 1,
    },
  };

  return {
    success: true,
    updatedPlayer,
    message: `🕯️ [DÂNG HƯƠNG TÔNG TỘC] Đã thắp [${config.name}]! Hương khói nghi ngút truyền thấu cửu u, nhận phúc ấm tổ tiên trong ${config.durationHours} giờ.${
      config.protectionCharges > 0 ? ` Ban tặng ${config.protectionCharges} Lần Hư Ảnh Bảo Mệnh đỡ đòn chí tử!` : ''
    }`,
  };
}

// ─── 4. Cơ Chế Hư Ảnh Tổ Tiên Đỡ Đòn Tử Vong (Ancestral Death Ward) ──────────

export function checkAndConsumeAncestralDeathWard(
  player: PlayerStats
): { triggered: boolean; updatedPlayer: PlayerStats; combatMessage?: string } {
  const ancestralState = player.ancestralState;
  const activeBuff = ancestralState?.activeBuff;
  const now = Date.now();

  if (!activeBuff || now >= activeBuff.expiresAt || activeBuff.protectionCharges <= 0) {
    return { triggered: false, updatedPlayer: player };
  }

  const playerName = player.name || 'Đạo Hữu';
  const newCharges = activeBuff.protectionCharges - 1;
  const updatedAncestralState: AncestralState = {
    ...ancestralState,
    activeBuff: {
      ...activeBuff,
      protectionCharges: newCharges,
    },
    protectionTriggersCount: (ancestralState.protectionTriggersCount || 0) + 1,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    ancestralState: updatedAncestralState,
  };

  const combatMessage = `🏛️ [TỔ TIÊN HIỂN LINH] Bài Vị Tiền Kiếp phát quang vạn trượng! Hư Ảnh Tiên Đế tổ tiên xuất hiện che chở cho [${playerName}], đỡ lấy đòn chí tử và nghịch chuyển sinh tử! (Còn ${newCharges} lần bảo hộ)`;

  return {
    triggered: true,
    updatedPlayer,
    combatMessage,
  };
}
