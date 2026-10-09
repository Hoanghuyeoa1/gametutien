// lib/pill-vein-logic.ts
// Pure Domain Logic: Hệ Thống Đan Văn Cửu Trọng & Dược Tính Biến Dị
// Tuân thủ Clean Architecture, 4 Hard Invariants, không phụ thuộc UI

import {
  PillVeinTier,
  MutagenicAffixType,
  PillMutationData,
  VeinedPillMetadata,
  CatalystItemConfig,
  PillCraftingResult
} from './types/pill-veins';
import { PlayerStats, Pill, DanRecipe } from './types';
import { PILL_DEFINITIONS_MAP } from './pill-tier-data';
import { applyFlameToAlchemyProcess } from './heavenly-flame-logic';
import {
  evaluatePillTribulationTrigger,
  createPillTribulationEncounter
} from './pill-tribulation-logic';

// ==========================================
// 1. CẤU HÌNH ĐAN VĂN CỬU TRỌNG (PILL_VEIN_CONFIG)
// ==========================================

export interface PillVeinTierInfo {
  tier: PillVeinTier;
  title: string;
  rankName: string;
  veinMultiplier: number;
  toxicityMultiplier: number;
  badgeText: string;
  glowColor: string;
  badgeClass: string;
  description: string;
}

export const PILL_VEIN_CONFIG: Record<PillVeinTier, PillVeinTierInfo> = {
  0: {
    tier: 0,
    title: 'Phàm Đan',
    rankName: 'Hạ Phẩm',
    veinMultiplier: 1.0,
    toxicityMultiplier: 0.50, // 50% Đan Độc
    badgeText: '0 VĂN • 50% ĐỘC',
    glowColor: '#71717a', // Zinc
    badgeClass: 'bg-zinc-800/80 text-zinc-300 border-zinc-600/60',
    description: 'Đan dược không có đan văn, tạp chất nhiều, đan độc chiếm 50%.'
  },
  1: {
    tier: 1,
    title: 'Nhất Văn Linh Đan',
    rankName: 'Sơ Phẩm',
    veinMultiplier: 1.15,
    toxicityMultiplier: 0.40, // 40% Đan Độc
    badgeText: '1 VĂN • 40% ĐỘC',
    glowColor: '#22c55e', // Emerald
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
    description: 'Ngưng tụ 1 vòng đan văn sơ cấp, dược lực +15%, đan độc còn 40%.'
  },
  2: {
    tier: 2,
    title: 'Nhị Văn Linh Đan',
    rankName: 'Sơ Phẩm',
    veinMultiplier: 1.15,
    toxicityMultiplier: 0.40, // 40% Đan Độc
    badgeText: '2 VĂN • 40% ĐỘC',
    glowColor: '#10b981', // Green
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
    description: 'Ngưng tụ 2 vòng đan văn sơ cấp, dược lực +15%, đan độc còn 40%.'
  },
  3: {
    tier: 3,
    title: 'Tam Văn Huyền Đan',
    rankName: 'Trung Phẩm',
    veinMultiplier: 1.40,
    toxicityMultiplier: 0.25, // 25% Đan Độc
    badgeText: '3 VĂN • 25% ĐỘC',
    glowColor: '#0ea5e9', // Sky blue
    badgeClass: 'bg-sky-950/80 text-sky-300 border-sky-600/60',
    description: '3 vòng đan văn ngưng tụ, dược lực +40%, đan độc chỉ còn 25%.'
  },
  4: {
    tier: 4,
    title: 'Tứ Văn Huyền Đan',
    rankName: 'Trung Phẩm',
    veinMultiplier: 1.40,
    toxicityMultiplier: 0.25, // 25% Đan Độc
    badgeText: '4 VĂN • 25% ĐỘC',
    glowColor: '#38bdf8', // Light sky
    badgeClass: 'bg-sky-950/80 text-sky-300 border-sky-600/60',
    description: '4 vòng đan văn bao bọc, dược lực +40%, đan độc chỉ còn 25%.'
  },
  5: {
    tier: 5,
    title: 'Ngũ Văn Huyền Đan',
    rankName: 'Trung Phẩm',
    veinMultiplier: 1.40,
    toxicityMultiplier: 0.25, // 25% Đan Độc
    badgeText: '5 VĂN • 25% ĐỘC',
    glowColor: '#6366f1', // Indigo
    badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-600/60',
    description: '5 vòng đan văn sáng rực, dược lực +40%, đan độc chỉ còn 25%.'
  },
  6: {
    tier: 6,
    title: 'Lục Văn Thần Đan',
    rankName: 'Thượng Phẩm',
    veinMultiplier: 1.75,
    toxicityMultiplier: 0.10, // 10% Đan Độc
    badgeText: '6 VĂN • 10% ĐỘC',
    glowColor: '#a855f7', // Purple
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-600/60',
    description: '6 vòng đan văn huyền ảo, dược lực bộc phát +75%, đan độc chỉ còn 10%.'
  },
  7: {
    tier: 7,
    title: 'Thất Văn Thần Đan',
    rankName: 'Thượng Phẩm',
    veinMultiplier: 1.75,
    toxicityMultiplier: 0.10, // 10% Đan Độc
    badgeText: '7 VĂN • 10% ĐỘC',
    glowColor: '#c084fc', // Bright purple
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-600/60',
    description: '7 vòng đan văn linh diệu, dược lực bộc phát +75%, đan độc chỉ còn 10%.'
  },
  8: {
    tier: 8,
    title: 'Bát Văn Thần Đan',
    rankName: 'Thượng Phẩm',
    veinMultiplier: 1.75,
    toxicityMultiplier: 0.10, // 10% Đan Độc
    badgeText: '8 VĂN • 10% ĐỘC',
    glowColor: '#e879f9', // Fuchsia
    badgeClass: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-600/60',
    description: '8 vòng đan văn đại thành, dược lực bộc phát +75%, đan độc chỉ còn 10%.'
  },
  9: {
    tier: 9,
    title: 'Cửu Khổng Thần Đan',
    rankName: 'Cực Phẩm Viên Mãn',
    veinMultiplier: 2.00, // +100% Dược Lực
    toxicityMultiplier: 0.00, // ĐAN ĐỘC HOÀN TOÀN BẰNG 0
    badgeText: '9 VĂN • 0% ĐỘC',
    glowColor: '#eab308', // Amber / Gold
    badgeClass: 'bg-amber-950/90 text-amber-200 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    description: '9 vòng đan văn thông khiếu thành thần đan, Đan Độc tuyệt đối 0%, dược lực nhân đôi (+100%).'
  }
};

// ==========================================
// 1.1 MÔ HÌNH SUY HAO CẤP NHÂN (MULTI-STAGE COMPOUNDING TOXICITY DECAY)
// ==========================================

export interface ToxicityCalculationParams {
  baseToxicity: number;
  veinTier: PillVeinTier;
  flameBurnRatio?: number;       // Hệ số giảm từ Dị Hỏa (0.0 -> 1.0)
  taSuppressionRatio?: number;   // Hệ số giảm từ Tá Dược (0.0 -> 1.0)
  stanceReductionRatio?: number; // Hệ số giảm từ Hỏa Hầu (0.0 -> 1.0)
}

export interface ToxicityCalculationResult {
  finalToxicity: number;
  totalReductionPercent: number;
  breakdown: {
    baseToxicity: number;
    afterVein: number;
    afterFlame: number;
    afterTa: number;
    afterStance: number;
  };
}

/**
 * Mô hình Suy Hao Cấp Nhân (Multiplicative Compounding Decay)
 * Tính toán lượng Đan Độc còn lại qua từng tầng lọc:
 * 1. Đan Văn (Vein Tier): baseToxicity * veinMultiplier
 *    (Đặc biệt: 9 Văn tuyệt đối 0% Đan Độc)
 * 2. Dị Hỏa (Flame Burn): afterVein * (1 - flameBurnRatio)
 * 3. Tá Dược (Ta Herb Suppression): afterFlame * (1 - taSuppressionRatio)
 * 4. Hỏa Hầu (Tactical Heat Stance): afterTa * (1 - stanceReductionRatio)
 */
export function calculateCompoundingToxicity(
  params: ToxicityCalculationParams
): ToxicityCalculationResult {
  const {
    baseToxicity,
    veinTier,
    flameBurnRatio = 0,
    taSuppressionRatio = 0,
    stanceReductionRatio = 0
  } = params;

  const validBaseToxicity = Math.max(0, baseToxicity);

  // Hard Invariant: 9 Văn (Cửu Khổng Thần Đan) hoặc baseToxicity <= 0 -> Tuyệt đối 0% Đan Độc
  if (validBaseToxicity === 0 || veinTier === 9) {
    return {
      finalToxicity: 0,
      totalReductionPercent: 100,
      breakdown: {
        baseToxicity: validBaseToxicity,
        afterVein: 0,
        afterFlame: 0,
        afterTa: 0,
        afterStance: 0
      }
    };
  }

  // Tầng 1: Đan Văn Cửu Trọng (Vein Tier Multiplier)
  const veinConfig = PILL_VEIN_CONFIG[veinTier] || PILL_VEIN_CONFIG[0];
  const veinMultiplier = veinConfig.toxicityMultiplier;
  const afterVein = Number((validBaseToxicity * veinMultiplier).toFixed(2));

  // Tầng 2: Dị Hỏa Thiêu Rụi (Flame Burn Decay)
  const clampedFlameRatio = Math.max(0, Math.min(1, flameBurnRatio));
  const afterFlame = Number((afterVein * (1 - clampedFlameRatio)).toFixed(2));

  // Tầng 3: Tá Dược Áp Chế / Trung Hòa (Ta Herb Suppression Decay)
  const clampedTaRatio = Math.max(0, Math.min(1, taSuppressionRatio));
  const afterTa = Number((afterFlame * (1 - clampedTaRatio)).toFixed(2));

  // Tầng 4: Hỏa Hầu Điều Tiết (Heat Stance Reduction Decay)
  const clampedStanceRatio = Math.max(0, Math.min(1, stanceReductionRatio));
  const afterStance = Number((afterTa * (1 - clampedStanceRatio)).toFixed(2));

  const finalToxicity = Math.max(0, Number(afterStance.toFixed(2)));
  const totalReductionPercent = validBaseToxicity > 0
    ? Number((((validBaseToxicity - finalToxicity) / validBaseToxicity) * 100).toFixed(2))
    : 100;

  return {
    finalToxicity,
    totalReductionPercent,
    breakdown: {
      baseToxicity: validBaseToxicity,
      afterVein,
      afterFlame,
      afterTa,
      afterStance
    }
  };
}

export const calculateToxicityDecay = calculateCompoundingToxicity;
export const calculatePillToxicity = calculateCompoundingToxicity;
export const calculateMultiplicativeToxicity = calculateCompoundingToxicity;


// ==========================================
// 2. GIỚI HẠN TRẦN BIẾN DỊ (ANTI-POWERCREEP HARD CAPS)
// ==========================================

export const MUTATION_HARD_CAPS: Record<MutagenicAffixType, number> = {
  max_hp_percent: 20.0,         // Tối đa +20% Máu tối đa
  lifesteal_percent: 10.0,      // Tối đa +10% Hút máu
  cast_speed_percent: 15.0,     // Tối đa +15% Tốc độ xuất chiêu
  crit_resist_percent: 25.0,    // Tối đa +25% Kháng bạo kích
  fire_resist_percent: 15.0,    // Tối đa +15% Kháng Hỏa
  lightning_resist_percent: 15.0, // Tối đa +15% Kháng Lôi
  ice_resist_percent: 15.0      // Tối đa +15% Kháng Băng
};

export const MUTATION_AFFIX_NAMES: Record<MutagenicAffixType, string> = {
  max_hp_percent: 'Khí Huyết Bất Diệt',
  lifesteal_percent: 'Thôn Huyết Ma Văn',
  cast_speed_percent: 'Tật Phong Thần Niệm',
  crit_resist_percent: 'Kim Cương Bất Hoại',
  fire_resist_percent: 'Bích Hỏa Huyền Thuẫn',
  lightning_resist_percent: 'Tích Lôi Thần Thân',
  ice_resist_percent: 'Huyền Băng Linh Thể'
};

// ==========================================
// 3. DANH MỤC PHỤ LIỆU XÚC TÁC (AUXILIARY CATALYSTS)
// ==========================================

export const CATALYST_REGISTRY: Record<string, CatalystItemConfig> = {
  catalyst_thu_dan: {
    itemId: 'catalyst_thu_dan',
    name: 'Thần Thú Nội Đan',
    targetAffixType: 'max_hp_percent',
    mutationChanceBonus: 25, // +25%
    veinQualityBonus: 25,
    description: 'Nội đan ngưng tụ từ đại yêu thú cổ đại, dung luyện giúp đan dược sinh ra dị biến tăng Khí Huyết vĩnh viễn.'
  },
  catalyst_huyet_tinh: {
    itemId: 'catalyst_huyet_tinh',
    name: 'Huyết Tinh Ma Thú',
    targetAffixType: 'lifesteal_percent',
    mutationChanceBonus: 20, // +20%
    veinQualityBonus: 20,
    description: 'Giọt tinh huyết cô đọng của ma thú viễn cổ, hỗ trợ đan dược đột biến sinh ra khả năng Hút Máu.'
  },
  catalyst_tinh_than_sa: {
    itemId: 'catalyst_tinh_than_sa',
    name: 'Thái Cổ Tinh Thần Sa',
    targetAffixType: 'cast_speed_percent',
    mutationChanceBonus: 25, // +25%
    veinQualityBonus: 25,
    description: 'Hạt cát sao rơi từ cửu thiên, giúp mở rộng thức hải, tăng Tốc Độ Ra Chiêu hoặc Kháng Bạo Kích.'
  },
  catalyst_ngu_hanh_hoa: {
    itemId: 'catalyst_ngu_hanh_hoa',
    name: 'Xích Viêm Tinh Thạch',
    targetAffixType: 'fire_resist_percent',
    mutationChanceBonus: 30, // +30%
    veinQualityBonus: 30,
    description: 'Tinh thạch ngưng tụ nơi dung nham vạn trượng, giúp đan dược đột biến gia tăng Kháng Hỏa vĩnh viễn.'
  },
  catalyst_ngu_hanh_loi: {
    itemId: 'catalyst_ngu_hanh_loi',
    name: 'Cửu Thiên Lôi Thạch',
    targetAffixType: 'lightning_resist_percent',
    mutationChanceBonus: 30, // +30%
    veinQualityBonus: 30,
    description: 'Mảnh đá nhiễm thiên kiếp lôi đình, giúp đan dược đột biến gia tăng Kháng Lôi vĩnh viễn.'
  },
  catalyst_ngu_hanh_bang: {
    itemId: 'catalyst_ngu_hanh_bang',
    name: 'Cực Hàn Băng Tinh',
    targetAffixType: 'ice_resist_percent',
    mutationChanceBonus: 30, // +30%
    veinQualityBonus: 30,
    description: 'Băng phách vạn năm dưới đáy biển sâu, giúp đan dược đột biến gia tăng Kháng Băng vĩnh viễn.'
  }
};

// ==========================================
// 4. THUẬT TOÁN XÁC SUẤT ĐAN VĂN (WEIGHTED ROLL)
// ==========================================

export interface VeinProbabilities {
  tier0: number; // Phàm đan (0 văn)
  tierLow: number; // 1-2 văn
  tierMid: number; // 3-5 văn
  tierHigh: number; // 6-8 văn
  tier9: number; // 9 văn (Cửu Khổng)
}

/**
 * Tính toán trọng số xác suất cho từng bậc đan văn dựa trên Đan Đạo, Cảnh Giới, Lò Luyện và Phụ Liệu
 */
export function getVeinProbabilities(
  crafterRealmIndex: number,
  alchemySkillLevel: number,
  furnaceTier: number = 1,
  catalystQualityBonus: number = 0
): VeinProbabilities {
  // Điểm năng lực đan đạo tổng hợp (Alchemy Score)
  const score = Math.max(0, crafterRealmIndex * 2 + alchemySkillLevel * 10 + furnaceTier * 8 + catalystQualityBonus);

  // Trọng số cơ sở (Weights)
  // Điểm càng cao: w0 giảm, wMid, wHigh, w9 tăng
  const w0 = Math.max(5, 120 - Math.floor(score * 0.9));
  const wLow = Math.max(10, 80 - Math.floor(score * 0.2) + (score > 40 ? 10 : 0));
  const wMid = Math.max(5, Math.floor(score * 0.7));
  const wHigh = Math.max(1, Math.floor(score * 0.45));
  const w9 = Math.max(0.5, Math.floor(score * 0.15) + (score > 120 ? Math.floor((score - 120) * 0.25) : 0));

  const total = w0 + wLow + wMid + wHigh + w9;

  return {
    tier0: Number(((w0 / total) * 100).toFixed(1)),
    tierLow: Number(((wLow / total) * 100).toFixed(1)),
    tierMid: Number(((wMid / total) * 100).toFixed(1)),
    tierHigh: Number(((wHigh / total) * 100).toFixed(1)),
    tier9: Number(((w9 / total) * 100).toFixed(1))
  };
}

/**
 * Quay xúc xắc xác định số lượng Đan Văn (0 -> 9)
 */
export function calculateVeinRoll(
  crafterRealmIndex: number,
  alchemySkillLevel: number,
  furnaceTier: number = 1,
  catalystQualityBonus: number = 0,
  randomSeed?: number // Hỗ trợ Unit Test truyền deterministic RNG
): PillVeinTier {
  const score = Math.max(0, crafterRealmIndex * 2 + alchemySkillLevel * 10 + furnaceTier * 8 + catalystQualityBonus);

  // Trọng số cụ thể cho từng bậc từ 0 đến 9
  const weights: number[] = [
    Math.max(5, 120 - Math.floor(score * 0.9)), // 0 văn
    Math.max(8, 45 - Math.floor(score * 0.1)),  // 1 văn
    Math.max(8, 40 - Math.floor(score * 0.1)),  // 2 văn
    Math.max(5, Math.floor(score * 0.3)),       // 3 văn
    Math.max(5, Math.floor(score * 0.25)),      // 4 văn
    Math.max(5, Math.floor(score * 0.2)),       // 5 văn
    Math.max(2, Math.floor(score * 0.18)),      // 6 văn
    Math.max(2, Math.floor(score * 0.15)),      // 7 văn
    Math.max(1, Math.floor(score * 0.12)),      // 8 văn
    Math.max(0.5, Math.floor(score * 0.12) + (score > 120 ? Math.floor((score - 120) * 0.25) : 0)) // 9 văn
  ];

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const roll = (randomSeed !== undefined ? randomSeed : Math.random()) * totalWeight;

  let accumulated = 0;
  for (let i = 0; i < weights.length; i++) {
    accumulated += weights[i];
    if (roll <= accumulated) {
      return i as PillVeinTier;
    }
  }

  return 0;
}

// ==========================================
// 5. THUẬT TOÁN XÚC XẮC BIẾN DỊ (MUTAGENESIS ROLL)
// ==========================================

export interface MutationRollResult {
  hasMutated: boolean;
  mutation: PillMutationData | null;
  chanceUsed: number;
}

/**
 * Xúc xắc xác định xem đan dược có sinh ra Dược Tính Biến Dị hay không
 */
export function rollPillMutation(
  catalystId?: string | null,
  veinCount: PillVeinTier = 0,
  randomSeed?: number, // Hỗ trợ Unit Test
  mutationChanceMultiplier: number = 1.0 // Khuếch đại từ Dị Hỏa Biến Dị
): MutationRollResult {
  // Xác suất cơ bản: 5%
  let chance = 5;

  const catalyst = catalystId ? CATALYST_REGISTRY[catalystId] : null;
  if (catalyst) {
    chance += catalyst.mutationChanceBonus;
  }

  // Đan văn cao gia trì xác suất biến dị
  if (veinCount === 9) {
    chance += 15; // Đan 9 Văn tăng thêm +15% tỷ lệ đột biến
  } else if (veinCount >= 6) {
    chance += 8;  // Đan Thượng Phẩm tăng +8%
  } else if (veinCount >= 3) {
    chance += 4;  // Đan Trung Phẩm tăng +4%
  }

  // Nhân hệ số khuếch đại từ Dị Hỏa (ví dụ x2.0 từ U Minh Ma Hỏa)
  if (mutationChanceMultiplier > 1.0) {
    chance = Number((chance * mutationChanceMultiplier).toFixed(1));
  }

  const rollVal = (randomSeed !== undefined ? randomSeed : Math.random()) * 100;
  const hasMutated = rollVal < chance;

  if (!hasMutated) {
    return { hasMutated: false, mutation: null, chanceUsed: chance };
  }

  // Xác định dòng Biến Dị
  let targetAffix: MutagenicAffixType;
  if (catalyst) {
    targetAffix = catalyst.targetAffixType;
  } else {
    // Không có catalyst, chọn ngẫu nhiên 1 trong các dòng
    const allAffixes: MutagenicAffixType[] = [
      'max_hp_percent',
      'lifesteal_percent',
      'cast_speed_percent',
      'crit_resist_percent',
      'fire_resist_percent',
      'lightning_resist_percent',
      'ice_resist_percent'
    ];
    const idx = Math.floor(Math.random() * allAffixes.length);
    targetAffix = allAffixes[idx];
  }

  // Giá trị biến dị theo đặc tả:
  // - max_hp_percent: +0.5%
  // - lifesteal_percent: +0.3%
  // - cast_speed_percent: +0.5%
  // - crit_resist_percent: +1.0%
  // - elemental resists: +1.0%
  let val = 1.0;
  if (targetAffix === 'max_hp_percent') val = 0.5;
  else if (targetAffix === 'lifesteal_percent') val = 0.3;
  else if (targetAffix === 'cast_speed_percent') val = 0.5;
  else if (targetAffix === 'crit_resist_percent') val = 1.0;
  else val = 1.0;

  const mutation: PillMutationData = {
    affixType: targetAffix,
    affixName: MUTATION_AFFIX_NAMES[targetAffix],
    value: val,
    description: `Tăng vĩnh viễn +${val}% ${MUTATION_AFFIX_NAMES[targetAffix]} (Trần tối đa +${MUTATION_HARD_CAPS[targetAffix]}%).`
  };

  return {
    hasMutated: true,
    mutation,
    chanceUsed: chance
  };
}

// ==========================================
// 6. THỰC THI LUYỆN ĐAN ĐAN VĂN (EXECUTE VEINED ALCHEMY)
// ==========================================

export interface ExecuteCraftOptions {
  crafterRealmIndex?: number;
  alchemySkillLevel?: number;
  furnaceTier?: number;
  deterministicVeinSeed?: number;
  deterministicMutationSeed?: number;
  forceExplosion?: boolean;
  deterministicFlameSeed?: number;
}

/**
 * Thực thi chế tác đan dược, trừ nguyên liệu và phụ liệu xúc tác, tạo ra viên đan có metadata đan văn
 */
export function executeVeinedAlchemyCraft(
  recipe: DanRecipe,
  player: PlayerStats,
  catalystItemId?: string | null,
  options?: ExecuteCraftOptions
): {
  success: boolean;
  message: string;
  craftingResult?: PillCraftingResult;
  updatedPlayer: PlayerStats;
} {
  const inv = player.inventory || { pills: [], herbs: [], ores: [] };

  // 1. Kiểm tra nguyên liệu thảo dược
  for (const req of recipe.herbsRequired) {
    const owned = inv.herbs?.find(h => h.id === req.herbId)?.quantity || 0;
    if (owned < req.count) {
      return {
        success: false,
        message: `Thiếu thảo dược [${req.herbName || req.herbId}]! Cần ${req.count}, hiện có ${owned}.`,
        updatedPlayer: player
      };
    }
  }

  // 2. Kiểm tra Linh Thạch
  if (player.linhThach < recipe.linhThachCost) {
    return {
      success: false,
      message: `Thiếu Linh Thạch lò lửa! Cần ${recipe.linhThachCost} Linh Thạch.`,
      updatedPlayer: player
    };
  }

  // 3. Kiểm tra phụ liệu xúc tác (nếu có chỉ định)
  let catalystConfig: CatalystItemConfig | undefined;
  if (catalystItemId) {
    catalystConfig = CATALYST_REGISTRY[catalystItemId];
    if (!catalystConfig) {
      return {
        success: false,
        message: `Phụ liệu xúc tác [${catalystItemId}] không hợp lệ!`,
        updatedPlayer: player
      };
    }

    // Kiểm tra trong túi đồ có phụ liệu này không (tìm trong ores hoặc herbs hoặc custom catalysts)
    const hasInOres = (inv.ores || []).some(o => o.id === catalystItemId && o.quantity > 0);
    const hasInHerbs = (inv.herbs || []).some(h => h.id === catalystItemId && h.quantity > 0);
    const hasInCustom = (player as any).catalystInventory?.[catalystItemId] > 0;

    if (!hasInOres && !hasInHerbs && !hasInCustom) {
      return {
        success: false,
        message: `Trong Túi Đồ không có phụ liệu xúc tác [${catalystConfig.name}]!`,
        updatedPlayer: player
      };
    }
  }

  // 4. Áp dụng hiệu ứng Thiên Địa Dị Hỏa (Heavenly Flame Processing)
  const flameOutcome = applyFlameToAlchemyProcess(
    player.flameState,
    catalystItemId,
    options?.forceExplosion,
    options?.deterministicFlameSeed
  );

  // Xử lý nổ lò nguyên tử (Atomic Explosion Handling)
  if (flameOutcome.isExploded) {
    const updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));
    const updatedInv = updatedPlayer.inventory!;
    updatedPlayer.linhThach = Math.max(0, updatedPlayer.linhThach - recipe.linhThachCost);

    // Trừ 50% thảo dược, hoàn trả 50% bảo toàn nguyên liệu
    for (const req of recipe.herbsRequired) {
      const herbItem = updatedInv.herbs.find(h => h.id === req.herbId);
      if (herbItem) {
        const consumedAmount = Math.max(1, Math.floor(req.count * (1 - flameOutcome.refundHerbRatio)));
        herbItem.quantity = Math.max(0, herbItem.quantity - consumedAmount);
      }
    }
    updatedInv.herbs = updatedInv.herbs.filter(h => h.quantity > 0);

    // Tạo Phế Đan vào túi trữ vật
    const ruinedPill: Pill = {
      id: 'pill_phe_dan',
      name: 'Phế Đan Khét Lẹt',
      grade: recipe.grade,
      description: 'Cặn đan dược cháy khét do nổ lò, dược tính tiêu tán hoàn toàn.',
      effectType: 'breakthrough_bonus',
      effectValue: 0,
      quantity: 1,
      quality: 'ha_pham',
      veinMetadata: {
        veinCount: 0,
        veinMultiplier: 0.1,
        toxicityMultiplier: 1.0,
        mutation: null
      }
    };
    const pheIndex = updatedInv.pills.findIndex(p => p.id === 'pill_phe_dan');
    if (pheIndex !== -1) {
      updatedInv.pills[pheIndex].quantity += 1;
    } else {
      updatedInv.pills.push(ruinedPill);
    }

    const craftingResult: PillCraftingResult = {
      basePillId: recipe.pillId,
      basePillName: 'Phế Đan',
      veinCount: 0,
      finalYieldCount: 1,
      veinMetadata: ruinedPill.veinMetadata!,
      isExploded: true,
      logMessages: [flameOutcome.logMessage]
    };

    return {
      success: false,
      message: flameOutcome.logMessage,
      craftingResult,
      updatedPlayer
    };
  }

  // 5. Khởi tạo bản sao Player để trừ tài nguyên mẻ đan thành công
  const updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));
  const updatedInv = updatedPlayer.inventory!;

  // Trừ Linh Thạch
  updatedPlayer.linhThach -= recipe.linhThachCost;

  // Trừ Thảo Dược
  for (const req of recipe.herbsRequired) {
    const herbItem = updatedInv.herbs.find(h => h.id === req.herbId);
    if (herbItem) {
      herbItem.quantity -= req.count;
    }
  }
  updatedInv.herbs = updatedInv.herbs.filter(h => h.quantity > 0);

  // Trừ Phụ Liệu Xúc Tác (1 cái)
  if (catalystItemId) {
    let consumedCatalyst = false;
    const oreItem = updatedInv.ores?.find(o => o.id === catalystItemId);
    if (oreItem && oreItem.quantity > 0) {
      oreItem.quantity -= 1;
      consumedCatalyst = true;
    }
    if (!consumedCatalyst) {
      const herbItem = updatedInv.herbs?.find(h => h.id === catalystItemId);
      if (herbItem && herbItem.quantity > 0) {
        herbItem.quantity -= 1;
        consumedCatalyst = true;
      }
    }
    if (!consumedCatalyst && (updatedPlayer as any).catalystInventory?.[catalystItemId]) {
      (updatedPlayer as any).catalystInventory[catalystItemId] -= 1;
    }
    if (updatedInv.ores) updatedInv.ores = updatedInv.ores.filter(o => o.quantity > 0);
  }

  // 6. Tính toán Đan Văn & Dị Biến (Cộng thêm điểm phẩm chất từ Dị Hỏa)
  const realmIndex = options?.crafterRealmIndex ?? player.currentRealm ?? 0;
  const alchemyLevel = options?.alchemySkillLevel ?? player.alchemyArtisan?.level ?? 1;
  const furnaceTier = options?.furnaceTier ?? 1;
  const catalystQualityBonus = (catalystConfig?.veinQualityBonus ?? 0) + flameOutcome.veinQualityBonus;

  const veinCount = calculateVeinRoll(
    realmIndex,
    alchemyLevel,
    furnaceTier,
    catalystQualityBonus,
    options?.deterministicVeinSeed
  );

  const veinInfo = PILL_VEIN_CONFIG[veinCount];

  // Khuếch đại xác suất Biến Dị từ Dị Hỏa Biến Dị
  const mutationResult = rollPillMutation(
    catalystItemId,
    veinCount,
    options?.deterministicMutationSeed,
    flameOutcome.mutationChanceMultiplier
  );

  const veinMetadata: VeinedPillMetadata = {
    veinCount,
    veinMultiplier: veinInfo.veinMultiplier,
    toxicityMultiplier: veinInfo.toxicityMultiplier,
    toxicityBurnPercent: flameOutcome.toxicityBurnPercent,
    flameId: flameOutcome.flameConfig.id,
    mutation: mutationResult.mutation
  };

  // Tính sản lượng xuất lò (Hỏa Bạo Liệt x2 Yield)
  const finalYieldCount = Math.max(1, Math.round(1 * flameOutcome.yieldMultiplier));
  const craftToxResult = calculateCompoundingToxicity({
    baseToxicity: 100,
    veinTier: veinCount,
    flameBurnRatio: (flameOutcome.toxicityBurnPercent || 0) / 100
  });

  const logMessages: string[] = [
    `Luyện chế thành công [${recipe.pillName}] đạt phẩm cấp: [${veinInfo.title}] (${veinCount} Đan Văn)!`,
    `Dược lực: +${Math.round((veinInfo.veinMultiplier - 1) * 100)}% | Đan độc chiết giảm: ${craftToxResult.totalReductionPercent}%`
  ];

  if (flameOutcome.flameConfig.id !== 'flame_pham_hoa') {
    logMessages.push(flameOutcome.logMessage);
  }

  if (mutationResult.hasMutated && mutationResult.mutation) {
    logMessages.push(`✨ DỊ BIẾN THIÊN PHÚ: Kích hoạt [${mutationResult.mutation.affixName}] (+${mutationResult.mutation.value}%)!`);
  }

  // 7. Thêm Đan Dược vào Inventory
  const newPillItem: Pill = {
    id: `${recipe.pillId}_vein_${veinCount}${mutationResult.hasMutated ? '_mut' : ''}`,
    name: `${veinInfo.rankName} • ${recipe.pillName}`,
    grade: recipe.grade,
    description: recipe.description,
    effectType: recipe.effectType || 'breakthrough_bonus',
    effectValue: recipe.effectValue || 20,
    quantity: finalYieldCount,
    quality: veinCount >= 9 ? 'than_pham' : veinCount >= 6 ? 'cuc_pham' : veinCount >= 3 ? 'thuong_pham' : 'trung_pham',
    veinMetadata,
    isMutated: mutationResult.hasMutated,
    basePillId: recipe.pillId
  };

  // Cập nhật số lần dùng Dị Hỏa
  if (updatedPlayer.flameState?.equippedFlameId && updatedPlayer.flameState.unlockedFlames[updatedPlayer.flameState.equippedFlameId]) {
    updatedPlayer.flameState.unlockedFlames[updatedPlayer.flameState.equippedFlameId].totalCraftsWithFlame =
      (updatedPlayer.flameState.unlockedFlames[updatedPlayer.flameState.equippedFlameId].totalCraftsWithFlame || 0) + 1;
  }

  // 7. Thẩm định Đan Lôi Kiếp (Pill Tribulation Evaluation)
  const gradeTierMap: Record<string, number> = {
    'Phàm Giai': 1, 'Nhất Giai': 1, 'Nhị Giai': 2, 'Tam Giai': 3, 'Tứ Giai': 4,
    'Ngũ Giai': 5, 'Lục Giai': 6, 'Thất Giai': 7, 'Bát Giai': 8, 'Cửu Giai': 9, 'Thần Giai': 9
  };
  const pillTier = gradeTierMap[recipe.grade] || 1;
  const tribCheck = evaluatePillTribulationTrigger(pillTier, veinCount, mutationResult.hasMutated);

  let tribulationEncounter: any = null;
  if (tribCheck.shouldTrigger) {
    tribulationEncounter = createPillTribulationEncounter(
      recipe.pillId,
      recipe.pillName,
      pillTier,
      tribCheck.intensity,
      newPillItem,
      finalYieldCount,
      veinMetadata
    );

    if (!updatedPlayer.pillTribulationState) {
      updatedPlayer.pillTribulationState = {
        totalTribulationsFaced: 0,
        successfulDefenses: 0,
        danSpirits: [],
        activeTribulation: null
      };
    }
    updatedPlayer.pillTribulationState.activeTribulation = tribulationEncounter;
    logMessages.push(tribCheck.reason);
  } else {
    // Không có thiên kiếp -> Thêm Đan Dược vào Inventory bình thường
    const existingIndex = updatedInv.pills.findIndex(p => 
      p.id === newPillItem.id &&
      p.veinMetadata?.veinCount === veinCount &&
      p.veinMetadata?.mutation?.affixType === veinMetadata.mutation?.affixType &&
      p.veinMetadata?.toxicityBurnPercent === veinMetadata.toxicityBurnPercent
    );

    if (existingIndex !== -1) {
      updatedInv.pills[existingIndex].quantity += finalYieldCount;
    } else {
      updatedInv.pills.push(newPillItem);
    }
  }

  const craftingResult: PillCraftingResult = {
    basePillId: recipe.pillId,
    basePillName: recipe.pillName,
    veinCount,
    finalYieldCount,
    veinMetadata,
    isExploded: false,
    logMessages,
    tribulationTriggered: tribCheck.shouldTrigger,
    tribulationEncounter: tribulationEncounter || undefined
  };

  return {
    success: true,
    message: logMessages.join(' | '),
    craftingResult,
    updatedPlayer
  };
}

// ==========================================
// 7. PHỤC DỤNG ĐAN DƯỢC ĐAN VĂN (CONSUME VEINED PILL)
// ==========================================

export interface ConsumeVeinedPillResult {
  success: boolean;
  message: string;
  updatedPlayer: PlayerStats;
  actualGainTuVi: number;
  addedToxicity: number;
  mutationApplied: PillMutationData | null;
  logType: 'alchemy' | 'danger' | 'system';
}

/**
 * Phục dụng đan dược có đan văn và dược tính biến dị
 * - Đan 9 văn bắt buộc addedToxicity === 0
 * - Tăng dược lực theo veinMultiplier
 * - Tích tụ biến dị có kẹp trần MUTATION_HARD_CAPS
 */
export function consumeVeinedPill(
  player: PlayerStats,
  pillItem: Pill
): ConsumeVeinedPillResult {
  const inv = player.inventory || { pills: [], herbs: [], ores: [] };

  // Tìm viên thuốc trong túi
  const targetIndex = inv.pills.findIndex(p => p.id === pillItem.id);
  if (targetIndex === -1 || inv.pills[targetIndex].quantity <= 0) {
    return {
      success: false,
      message: 'Trong Túi Đồ không có đan dược này!',
      updatedPlayer: player,
      actualGainTuVi: 0,
      addedToxicity: 0,
      mutationApplied: null,
      logType: 'danger'
    };
  }

  // Đọc metadata đan văn
  const meta: VeinedPillMetadata = pillItem.veinMetadata || {
    veinCount: 0,
    veinMultiplier: 1.0,
    toxicityMultiplier: 1.0,
    mutation: null
  };

  const veinConfig = PILL_VEIN_CONFIG[meta.veinCount] || PILL_VEIN_CONFIG[0];

  // 1. Kiểm tra Đan Độc gốc từ Pill Definition hoặc fallback
  const pillDef = PILL_DEFINITIONS_MAP[pillItem.basePillId || pillItem.id];
  const baseToxicity = pillDef?.effects?.toxicityPercent ?? 15; // Mặc định 15% độc

  // HARD INVARIANT: Đan 9 Văn (Cửu Khổng) hoặc Tiên Thiên Đan Dược Đan Độc PHẢI bằng 0 tuyệt đối!
  let addedToxicity = 0;
  if (meta.veinCount === 9 || meta.toxicityMultiplier === 0 || meta.isPrimordial) {
    addedToxicity = 0;
  } else {
    // Tính Đan Độc theo Mô hình Suy Hao Cấp Nhân (Multiplicative Compounding Decay)
    const flameBurnRatio = (meta.toxicityBurnPercent || 0) / 100;
    const toxResult = calculateCompoundingToxicity({
      baseToxicity,
      veinTier: meta.veinCount,
      flameBurnRatio
    });
    addedToxicity = Math.round(toxResult.finalToxicity);
  }

  // Kiểm tra ngưỡng bão hòa đan độc (100%) nếu viên đan này có sinh ra độc
  const currentToxicity = player.pillToxicity || 0;
  if (addedToxicity > 0 && currentToxicity >= 100) {
    return {
      success: false,
      message: '⚠️ Đan độc trong kinh mạch đã đạt ngưỡng bão hòa (100%)! Cần thanh lọc kinh mạch trước khi tiếp tục cắn thuốc.',
      updatedPlayer: player,
      actualGainTuVi: 0,
      addedToxicity: 0,
      mutationApplied: null,
      logType: 'danger'
    };
  }

  // 2. Sao chép và cập nhật Player
  const updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));
  const updatedInv = updatedPlayer.inventory!;

  // Trừ 1 viên thuốc
  updatedInv.pills[targetIndex].quantity -= 1;
  if (updatedInv.pills[targetIndex].quantity <= 0) {
    updatedInv.pills.splice(targetIndex, 1);
  }

  // Cập nhật Đan Độc
  updatedPlayer.pillToxicity = Math.min(100, Math.max(0, currentToxicity + addedToxicity));

  // Cập nhật Độ Tinh Khiết Chân Nguyên (Qi Purity)
  if (meta.veinCount === 9) {
    // Đan cực phẩm tinh khiết giúp bồi dưỡng thanh tẩy kinh mạch nhẹ
    updatedPlayer.qiPurity = Math.min(100, (updatedPlayer.qiPurity || 100) + 1);
  } else if (addedToxicity > 0) {
    updatedPlayer.qiPurity = Math.max(10, (updatedPlayer.qiPurity || 100) - Math.floor(addedToxicity * 0.5));
  }

  // 3. Tính toán Dược Lực (Tu Vi hoặc Buff)
  const baseTuVi = pillDef?.effects?.tuViGain ?? pillItem.tuViGain ?? (pillItem.effectType === 'exp' ? pillItem.effectValue : 1000);
  const primordialMult = meta.isPrimordial ? 1.5 : 1.0;
  const actualGainTuVi = Math.round(baseTuVi * meta.veinMultiplier * primordialMult);
  updatedPlayer.tuVi = (updatedPlayer.tuVi || 0) + actualGainTuVi;

  // 4. Áp dụng Dược Tính Biến Dị (nếu có) kèm Hard Cap Guard
  let appliedMutation: PillMutationData | null = null;
  if (meta.mutation) {
    const mut = meta.mutation;
    if (!updatedPlayer.consumedMutations) {
      updatedPlayer.consumedMutations = {};
    }

    const currentVal = updatedPlayer.consumedMutations[mut.affixType] || 0;
    const cap = MUTATION_HARD_CAPS[mut.affixType];

    if (currentVal < cap) {
      const newVal = Math.min(cap, Number((currentVal + mut.value).toFixed(2)));
      updatedPlayer.consumedMutations[mut.affixType] = newVal;
      appliedMutation = {
        ...mut,
        value: Number((newVal - currentVal).toFixed(2)) // Lượng thực tăng
      };
    }
  }

  // 5. Tạo thông điệp kết quả
  const logParts: string[] = [
    `✨ Phục dụng [${pillItem.name}]: Tu Vi +${actualGainTuVi.toLocaleString()} (x${meta.veinMultiplier} dược lực)`
  ];

  if (meta.veinCount === 9) {
    logParts.push(`🌿 Cực Phẩm Cửu Khổng: 0% Đan Độc, kinh mạch thuần khiết!`);
  } else if (addedToxicity > 0) {
    logParts.push(`Đan độc +${addedToxicity}% (Hiện tại: ${updatedPlayer.pillToxicity}%)`);
  }

  if (appliedMutation && appliedMutation.value > 0) {
    logParts.push(`🧬 Hấp thu Dị Biến: [${appliedMutation.affixName}] +${appliedMutation.value}% (Tổng: ${updatedPlayer.consumedMutations?.[appliedMutation.affixType]}%)`);
  }

  return {
    success: true,
    message: logParts.join(' | '),
    updatedPlayer,
    actualGainTuVi,
    addedToxicity,
    mutationApplied: appliedMutation,
    logType: 'alchemy'
  };
}
