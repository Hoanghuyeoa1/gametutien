// lib/abode-logic.ts
// Xử lý nghiệp vụ Động Thiên Phúc Địa (Homestead & Abode Core)

import {
  AbodePlotState,
  AbodeSoilType,
  AbodeSpiritArrayState,
  AbodeDisciple,
  AbodeState
} from './types/abode';
import {
  SPIRIT_ARRAY_LEVELS,
  SOIL_CONFIGS,
  DISCIPLE_APTITUDE_CONFIG,
  DISCIPLE_NAME_POOL,
  DISCIPLE_AVATARS,
  HERB_ELEMENT_MAP,
  BEAST_FERTILIZER_TICK_SECONDS,
  DISCIPLE_TRIBUTE_INTERVAL_MS
} from './abode-data';
import { HERB_SEEDS } from './garden-data';
import { DEFAULT_HERBS } from './alchemy-data';

/**
 * 1. Tính toán buff gia trì từ Tụ Linh Trận
 */
export function calculateSpiritArrayBuffs(spiritArray?: AbodeSpiritArrayState) {
  if (!spiritArray) {
    return {
      tuViRateBonus: 0,
      autoHealBonus: 0,
      gardenYieldBonus: 0,
      breakthroughBonus: 0
    };
  }

  const config = SPIRIT_ARRAY_LEVELS[spiritArray.level] || SPIRIT_ARRAY_LEVELS[1];
  return {
    tuViRateBonus: config.tuViRateBonus || spiritArray.tuViRateBonus || 0,
    autoHealBonus: config.autoHealBonus || spiritArray.autoHealBonus || 0,
    gardenYieldBonus: config.gardenYieldBonus || 0,
    breakthroughBonus: config.breakthroughBonus || 0
  };
}

/**
 * 2. Tính hiệu ứng thổ nhưỡng dị biến đối với thảo dược gieo trồng
 */
export interface SoilCropEfficiencyResult {
  growthTimeMultiplier: number; // Hệ số nhân thời gian (ví dụ 0.6 = giảm 40%)
  yieldMultiplier: number;      // Hệ số nhân sản lượng (ví dụ 1.5 = tăng 50%)
  extraGemChance: number;       // Tỷ lệ nhặt thêm Linh Ngọc Băng hệ (0 - 1)
  isSynergized: boolean;        // Thảo dược hợp thổ nhưỡng
  description: string;
}

export function calculateSoilCropEfficiency(soilType: AbodeSoilType, seedId: string): SoilCropEfficiencyResult {
  const element = HERB_ELEMENT_MAP[seedId] || 'pho_thong';

  if (soilType === 'han_bang') {
    if (element === 'thuy') {
      return {
        growthTimeMultiplier: 0.60, // Giảm 40% thời gian
        yieldMultiplier: 1.0,
        extraGemChance: 0.30,       // 30% rớt Băng Tinh Linh Ngọc
        isSynergized: true,
        description: '❄️ Thủy Thảo ngộ Hàn Băng Thổ: Rút ngắn 40% thời gian sinh trưởng, 30% rơi Băng Ngọc!'
      };
    }
  }

  if (soilType === 'hoa_diem') {
    if (element === 'hoa') {
      return {
        growthTimeMultiplier: 0.60, // Giảm 40% thời gian
        yieldMultiplier: 1.50,      // Tăng 50% sản lượng
        extraGemChance: 0,
        isSynergized: true,
        description: '🔥 Hỏa Thảo ngộ Hỏa Diễm Thổ: Rút ngắn 40% thời gian sinh trưởng, tăng 50% sản lượng thu hoạch!'
      };
    }
  }

  return {
    growthTimeMultiplier: 1.0,
    yieldMultiplier: 1.0,
    extraGemChance: 0,
    isSynergized: false,
    description: soilType === 'hoang_tho'
      ? '🌾 Hoàng Thổ màu mỡ, vạn vật phát triển hài hòa.'
      : '⚠️ Dược thảo không hợp hệ thổ nhưỡng dị biến, phát triển bình thường.'
  };
}

/**
 * 3. Bón phân cho ô đất (rút ngắn thời gian còn lại)
 */
export function applyFertilizerToPlot(
  plot: AbodePlotState,
  tier: number = 1,
  now: number = Date.now()
): { updatedPlot: AbodePlotState; savedSeconds: number } {
  if (!plot.plantedAt || !plot.harvestAt || plot.harvestAt <= now) {
    return { updatedPlot: plot, savedSeconds: 0 };
  }

  const remainingMs = plot.harvestAt - now;
  // Tier 1 (Yêu Thú Phân): giảm 30%, Tier 2 (Thần Thú Phân): giảm 50%
  const reductionRatio = tier >= 2 ? 0.50 : 0.30;
  const cutMs = Math.floor(remainingMs * reductionRatio);
  const newHarvestAt = Math.max(now, plot.harvestAt - cutMs);

  return {
    updatedPlot: {
      ...plot,
      harvestAt: newHarvestAt,
      fertilized: true
    },
    savedSeconds: Math.floor(cutMs / 1000)
  };
}

/**
 * 4. Tự động sinh phân bón theo chu kỳ thời gian từ các linh thú thả rông
 */
export function tickBeastFertilizer(
  sanctuary: AbodeState['beastSanctuary'],
  now: number = Date.now()
): {
  newFertilizerStored: number;
  newLastFertilizerTick: number;
  generatedCount: number;
} {
  const beastsCount = sanctuary.roamingBeastIds?.length || 0;
  if (beastsCount === 0) {
    return {
      newFertilizerStored: sanctuary.fertilizerStored,
      newLastFertilizerTick: now,
      generatedCount: 0
    };
  }

  const elapsedSeconds = Math.max(0, Math.floor((now - (sanctuary.lastFertilizerTick || now)) / 1000));
  const ticks = Math.floor(elapsedSeconds / BEAST_FERTILIZER_TICK_SECONDS);

  if (ticks <= 0) {
    return {
      newFertilizerStored: sanctuary.fertilizerStored,
      newLastFertilizerTick: sanctuary.lastFertilizerTick,
      generatedCount: 0
    };
  }

  const generated = ticks * beastsCount;
  // Giới hạn trữ tối đa 99 túi phân
  const newTotal = Math.min(99, (sanctuary.fertilizerStored || 0) + generated);
  const remainingTime = elapsedSeconds % BEAST_FERTILIZER_TICK_SECONDS;
  const newLastTick = now - (remainingTime * 1000);

  return {
    newFertilizerStored: newTotal,
    newLastFertilizerTick: newLastTick,
    generatedCount: generated
  };
}

/**
 * 5. Tuyển mộ đệ tử ngẫu nhiên
 */
export function recruitNewDisciple(showcasedManualQualityWeight: number = 0): AbodeDisciple {
  const name = DISCIPLE_NAME_POOL[Math.floor(Math.random() * DISCIPLE_NAME_POOL.length)];
  const avatar = DISCIPLE_AVATARS[Math.floor(Math.random() * DISCIPLE_AVATARS.length)];

  // Tính trọng số tư chất với điểm cộng từ công pháp trưng bày trong Tàng Kinh Các
  const weights: Record<'ha' | 'trung' | 'thuong' | 'thien_kieu', number> = {
    ha: Math.max(15, DISCIPLE_APTITUDE_CONFIG.ha.baseWeight - (showcasedManualQualityWeight * 5)),
    trung: DISCIPLE_APTITUDE_CONFIG.trung.baseWeight,
    thuong: DISCIPLE_APTITUDE_CONFIG.thuong.baseWeight + (showcasedManualQualityWeight * 3),
    thien_kieu: DISCIPLE_APTITUDE_CONFIG.thien_kieu.baseWeight + (showcasedManualQualityWeight * 2)
  };

  const totalWeight = weights.ha + weights.trung + weights.thuong + weights.thien_kieu;
  let randomVal = Math.random() * totalWeight;

  let aptitude: 'ha' | 'trung' | 'thuong' | 'thien_kieu' = 'ha';
  if (randomVal < weights.ha) {
    aptitude = 'ha';
  } else {
    randomVal -= weights.ha;
    if (randomVal < weights.trung) {
      aptitude = 'trung';
    } else {
      randomVal -= weights.trung;
      if (randomVal < weights.thuong) {
        aptitude = 'thuong';
      } else {
        aptitude = 'thien_kieu';
      }
    }
  }

  const now = Date.now();

  return {
    id: `disciple_${now}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    avatar,
    aptitude,
    assignedManualId: null,
    tributeReadyAt: now + DISCIPLE_TRIBUTE_INTERVAL_MS,
    lastClaimedAt: now
  };
}

/**
 * 6. Kết toán phần thưởng bổng lộc cống nạp từ Đệ Tử
 */
export interface DiscipleTributeReward {
  linhThach: number;
  danhVong: number;
  herbId: string;
  herbName: string;
  herbQuantity: number;
}

export function claimDiscipleTribute(disciple: AbodeDisciple): DiscipleTributeReward {
  const config = DISCIPLE_APTITUDE_CONFIG[disciple.aptitude] || DISCIPLE_APTITUDE_CONFIG.ha;

  const linhThach = Math.floor(
    config.minLinhThach + Math.random() * (config.maxLinhThach - config.minLinhThach + 1)
  );
  const danhVong = Math.floor(
    config.minDanhVong + Math.random() * (config.maxDanhVong - config.minDanhVong + 1)
  );

  const selectedHerbId = config.herbIds[Math.floor(Math.random() * config.herbIds.length)];
  const herbInfo = DEFAULT_HERBS.find(h => h.id === selectedHerbId);
  const herbName = herbInfo ? herbInfo.name : 'Linh Dược Trân Quý';
  const herbQuantity = disciple.aptitude === 'thien_kieu' ? 3 : (disciple.aptitude === 'thuong' ? 2 : 1);

  return {
    linhThach,
    danhVong,
    herbId: selectedHerbId,
    herbName,
    herbQuantity
  };
}

/**
 * 7. Áp dụng bổ trợ từ Đan Linh Nhi (Dan Spirits Buffs) lên Dược Viên
 */
export function getDanSpiritsGrowthDiscount(danSpirits?: import('./types/pill-tribulation').DanSpiritCompanion[]): number {
  if (!danSpirits || danSpirits.length === 0) return 0;
  const total = danSpirits.reduce((acc, s) => acc + (s.buffs?.gardenGrowthSpeedBonus || 0), 0);
  return Math.min(0.50, total); // Giảm tối đa 50% thời gian lớn
}

