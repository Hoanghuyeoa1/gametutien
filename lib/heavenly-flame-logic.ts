// lib/heavenly-flame-logic.ts
// Pure Domain Logic: Hệ Thống Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)
// Tuân thủ Clean Architecture, 4 Hard Invariants, không phụ thuộc UI

import {
  FlameArchetype,
  FlameTier,
  FlameAuraEffect,
  HeavenlyFlameConfig,
  PlayerFlameInstance,
  HeavenlyFlameState
} from './types/heavenly-flame';
import { PillVeinTier } from './types/pill-veins';
import {
  calculateCompoundingToxicity,
  calculateMultiplicativeToxicity,
  ToxicityCalculationResult
} from './pill-vein-logic';

// ==========================================
// 1. BẢNG DANH MỤC THIÊN ĐỊA DỊ HỎA (HEAVENLY_FLAMES_REGISTRY)
// ==========================================

export const HEAVENLY_FLAMES_REGISTRY: Record<string, HeavenlyFlameConfig> = {
  flame_thanh_lien: {
    id: 'flame_thanh_lien',
    name: 'Thanh Liên Địa Tâm Hỏa',
    archetype: 'on_hoa',
    element: 'Mộc / Hỏa',
    description: 'Sinh ra nơi nham thạch sâu trong lòng đất, trải qua vạn năm rèn giũa, thai nghén thành hoa sen thanh khiết.',
    lore: 'Ngọn lửa xanh ngọc mang mộc linh sinh cơ cuồn cuộn, có khả năng tự động thiêu rụi tạp chất đan độc ngay trong quá trình ngưng tụ.',
    visualColor: {
      flameColor: 'text-emerald-400',
      glowColor: '#34d399',
      particleEffect: 'emerald-sparks',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
    },
    baseToxicityBurnPercent: 40,  // Thiêu rụi 40% Đan Độc gốc
    baseVeinQualityBonus: 25,     // +25 điểm Đan Văn (tăng cơ hội ra Đan Văn 6 - 9)
    baseYieldMultiplier: 1.0,     // Sản lượng chuẩn
    explosionRiskPercent: 0,      // An hòa tuyệt đối, không nổ lò
    mutationChanceMultiplier: 1.0,
    auras: [
      {
        id: 'aura_thanh_lien_1',
        name: 'Thanh Tâm Tẩy Tủy',
        description: 'Tăng thêm +10% hiệu quả thiêu rụi Đan Độc gốc.',
        unlockedAtTier: 3,
        effectType: 'toxicity_burn',
        value: 10
      },
      {
        id: 'aura_thanh_lien_2',
        name: 'Địa Tâm Mộc Khí',
        description: 'Cộng thêm +15 điểm xác suất xuất hiện Đan Văn cao cấp.',
        unlockedAtTier: 6,
        effectType: 'vein_quality',
        value: 15
      },
      {
        id: 'aura_thanh_lien_3',
        name: 'Thanh Liên Bất Diệt',
        description: 'Tiết kiệm 15% dược thảo khi luyện đan thất bại hoặc nung lò.',
        unlockedAtTier: 9,
        effectType: 'material_save',
        value: 15
      }
    ]
  },

  flame_xich_loi: {
    id: 'flame_xich_loi',
    name: 'Bạo Liệt Xích Lôi Viêm',
    archetype: 'bao_liet',
    element: 'Lôi / Hỏa',
    description: 'Sinh ra nơi lôi đình thiên kiếp đánh vào hỏa sơn cổ đại, ẩn chứa sức mạnh hủy diệt cực đoan.',
    lore: 'Nhiệt độ cuồng bạo làm kích phát dược tính bạo liệt, giúp nhân đôi sản lượng đan dược nhưng mang rủi ro nổ lò 15%.',
    visualColor: {
      flameColor: 'text-purple-400',
      glowColor: '#c084fc',
      particleEffect: 'purple-lightning',
      badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-500/50'
    },
    baseToxicityBurnPercent: 0,
    baseVeinQualityBonus: 10,
    baseYieldMultiplier: 2.0,      // NHÂN ĐÔI SẢN LƯỢNG ĐAN DƯỢC (x2 Yield)
    explosionRiskPercent: 15,     // 15% rủi ro nổ lò
    mutationChanceMultiplier: 1.0,
    auras: [
      {
        id: 'aura_xich_loi_1',
        name: 'Lôi Hỏa Bạo Phát',
        description: 'Tăng thêm +5% tỷ lệ ngẫu nhiên bạo phát x2 đan.',
        unlockedAtTier: 3,
        effectType: 'yield_boost',
        value: 5
      },
      {
        id: 'aura_xich_loi_2',
        name: 'Hóa Lôi Vi Kính',
        description: 'Giảm 5% rủi ro nổ lò khi luyện đan (còn 10%).',
        unlockedAtTier: 6,
        effectType: 'material_save',
        value: 5
      },
      {
        id: 'aura_xich_loi_3',
        name: 'Chấn Thiên Thần Lôi',
        description: 'Khi luyện thành công có 15% xác suất sản sinh thêm 1 viên đan nữa.',
        unlockedAtTier: 9,
        effectType: 'yield_boost',
        value: 15
      }
    ]
  },

  flame_u_minh: {
    id: 'flame_u_minh',
    name: 'U Minh Ma Hỏa',
    archetype: 'bien_di',
    element: 'Tà / Âm',
    description: 'Ngọn lửa đen tím ngưng tụ từ cửu u ma quật vạn trượng, lạnh lẽo thấu xương nhưng có thể thiêu đốt linh hồn.',
    lore: 'Ngọn lửa này chuyên kích hoạt dị biến dược tính, nhân đôi cơ hội đột biến thiên phú khi kết hợp cùng phụ liệu xúc tác.',
    visualColor: {
      flameColor: 'text-fuchsia-400',
      glowColor: '#e879f9',
      particleEffect: 'fuchsia-ghost-flame',
      badgeClass: 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/50'
    },
    baseToxicityBurnPercent: 15,
    baseVeinQualityBonus: 15,
    baseYieldMultiplier: 1.0,
    explosionRiskPercent: 0,
    mutationChanceMultiplier: 2.0, // NHÂN 2.0 LẦN TỶ LỆ DƯỢC TÍNH BIẾN DỊ
    auras: [
      {
        id: 'aura_u_minh_1',
        name: 'Ma Đạo Dị Hóa',
        description: 'Tăng thêm +0.2x hệ số nhân tỷ lệ biến dị (lên x2.2).',
        unlockedAtTier: 3,
        effectType: 'mutation_boost',
        value: 20
      },
      {
        id: 'aura_u_minh_2',
        name: 'Cửu U Luyện Hồn',
        description: 'Thiêu rụi thêm +10% Đan Độc gốc trong lò.',
        unlockedAtTier: 6,
        effectType: 'toxicity_burn',
        value: 10
      },
      {
        id: 'aura_u_minh_3',
        name: 'Vạn Ma Triều Bái',
        description: 'Khuếch đại tối thượng: Nhân x2.5 lần tỷ lệ Biến Dị Thiên Phú.',
        unlockedAtTier: 9,
        effectType: 'mutation_boost',
        value: 50
      }
    ]
  },

  flame_hon_don: {
    id: 'flame_hon_don',
    name: 'Thái Sơ Hỗn Độn Viêm',
    archetype: 'hon_don',
    element: 'Hỗn Độn / Vạn Hỏa',
    description: 'Ngọn lửa khởi thủy từ thuở khai thiên lập địa, vạn hỏa chi tổ, dung hợp toàn bộ uy năng của thiên địa dị hỏa.',
    lore: 'Đan hỏa chí tôn dung hòa sự ôn hòa thanh tẩy và bạo liệt nhân đôi sản lượng, tuyệt đối không bao giờ nổ lò.',
    visualColor: {
      flameColor: 'text-amber-300',
      glowColor: '#f59e0b',
      particleEffect: 'cosmic-aurora-flame',
      badgeClass: 'bg-amber-950/90 text-amber-200 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
    },
    baseToxicityBurnPercent: 50,  // Thiêu rụi 50% Đan Độc gốc
    baseVeinQualityBonus: 40,     // +40 điểm Đan Văn
    baseYieldMultiplier: 2.0,      // x2 Sản lượng
    explosionRiskPercent: 0,      // 0% Nổ lò
    mutationChanceMultiplier: 2.5, // x2.5 Tỷ lệ biến dị
    auras: [
      {
        id: 'aura_hon_don_1',
        name: 'Thái Sơ Khởi Nguyên',
        description: 'Gia tăng phẩm chất ngưng tụ đan văn lên tầng cao mới (+15 điểm).',
        unlockedAtTier: 3,
        effectType: 'vein_quality',
        value: 15
      },
      {
        id: 'aura_hon_don_2',
        name: 'Hỗn Độn Vô Cực',
        description: 'Thiêu rụi thêm +10% Đan Độc (Tổng thiêu rụi 60% Đan Độc gốc).',
        unlockedAtTier: 6,
        effectType: 'toxicity_burn',
        value: 10
      },
      {
        id: 'aura_hon_don_3',
        name: 'Vạn Hỏa Quy Tông',
        description: 'Dung hợp tuyệt đối: Mọi mẻ đan luôn nhận tối thiểu 3 Đan Văn trở lên.',
        unlockedAtTier: 9,
        effectType: 'vein_quality',
        value: 30
      }
    ]
  }
};

// Phàm Hỏa mặc định (Mortal Flame) khi người chơi chưa trang bị Dị Hỏa
export const DEFAULT_MORTAL_FLAME: HeavenlyFlameConfig = {
  id: 'flame_pham_hoa',
  name: 'Phàm Hỏa Cơ Bản',
  archetype: 'on_hoa',
  element: 'Hỏa',
  description: 'Đan hỏa bình thường được thắp bằng than đá và mồi lửa linh thạch sơ cấp.',
  lore: 'Ngọn lửa thông thường dùng trong đan phòng, vận hành theo quy luật tự nhiên, không có hiệu ứng gia trì đặc biệt.',
  visualColor: {
    flameColor: 'text-amber-500',
    glowColor: '#f97316',
    particleEffect: 'orange-smoke',
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-600/50'
  },
  baseToxicityBurnPercent: 0,
  baseVeinQualityBonus: 0,
  baseYieldMultiplier: 1.0,
  explosionRiskPercent: 0,
  mutationChanceMultiplier: 1.0,
  auras: []
};

// ==========================================
// 2. ÔN DƯỠNG & TIẾN HÓA DỊ HỎA (NOURISHMENT & LEVELING)
// ==========================================

export interface FeedFlameResult {
  updatedFlame: PlayerFlameInstance;
  isLeveledUp: boolean;
  expGained: number;
  newAurasUnlocked: string[];
}

/**
 * Cho Dị Hỏa hấp thu khoáng thạch quý hoặc trích xuất Chân Nguyên/Tu Vi để tăng EXP và thăng cấp (Tier 1 -> Tier 9)
 */
export function feedHeavenlyFlame(
  flameInstance: PlayerFlameInstance,
  feedType: 'mineral' | 'tuvi',
  amount: number,
  itemTier: number = 1
): FeedFlameResult {
  if (amount <= 0) {
    return {
      updatedFlame: flameInstance,
      isLeveledUp: false,
      expGained: 0,
      newAurasUnlocked: []
    };
  }

  // Nếu đã đạt trần tối đa Tier 9
  if (flameInstance.tier >= 9) {
    return {
      updatedFlame: {
        ...flameInstance,
        tier: 9,
        currentExp: flameInstance.maxExp // Giữ chuẩn trần tối đa
      },
      isLeveledUp: false,
      expGained: 0,
      newAurasUnlocked: []
    };
  }

  // Tính lượng EXP nhận được
  let expGain = 0;
  if (feedType === 'mineral') {
    // 1 khoáng thạch mang lại (tier * 25) EXP
    const perUnit = Math.max(15, itemTier * 25);
    expGain = amount * perUnit;
  } else {
    // 50 Tu Vi đổi lấy 1 EXP Dị Hỏa
    expGain = Math.max(1, Math.floor(amount / 50));
  }

  let currentTier = flameInstance.tier;
  let currentExp = flameInstance.currentExp + expGain;
  let maxExp = currentTier * 250;
  let isLeveledUp = false;
  const newAurasUnlocked: string[] = [];

  const config = HEAVENLY_FLAMES_REGISTRY[flameInstance.flameId];

  // Vòng lặp thăng cấp nếu đủ EXP
  while (currentExp >= maxExp && currentTier < 9) {
    currentExp -= maxExp;
    currentTier = (currentTier + 1) as FlameTier;
    maxExp = currentTier * 250;
    isLeveledUp = true;

    // Kiểm tra mở khóa Aura tại Tier mới
    if (config?.auras) {
      for (const aura of config.auras) {
        if (aura.unlockedAtTier <= currentTier && !flameInstance.unlockedAuraIds.includes(aura.id)) {
          if (!newAurasUnlocked.includes(aura.id)) {
            newAurasUnlocked.push(aura.id);
          }
        }
      }
    }
  }

  // Nếu đã chạm mốc Tier 9 (Cực Hạn), kẹp trần
  if (currentTier >= 9) {
    currentTier = 9;
    currentExp = Math.min(maxExp, currentExp);
  }

  const updatedAuraIds = Array.from(new Set([...flameInstance.unlockedAuraIds, ...newAurasUnlocked]));

  const updatedFlame: PlayerFlameInstance = {
    ...flameInstance,
    tier: currentTier,
    currentExp,
    maxExp,
    unlockedAuraIds: updatedAuraIds
  };

  return {
    updatedFlame,
    isLeveledUp,
    expGained: expGain,
    newAurasUnlocked
  };
}

// ==========================================
// 3. ÁP DỤNG DỊ HỎA VÀO LUYỆN ĐAN (APPLY FLAME PROCESS)
// ==========================================

export interface FlameProcessOutcome {
  isExploded: boolean;
  toxicityBurnPercent: number;     // % Đan Độc gốc bị thiêu rụi (ví dụ: 40%)
  flameBurnRatio: number;          // Hệ số giảm độc của Dị Hỏa dạng tỷ lệ 0.0 - 1.0 (ví dụ: 0.40)
  veinQualityBonus: number;        // Điểm cộng vào thuật toán Đan Văn
  yieldMultiplier: number;         // Hệ số nhân sản lượng đan (1 hoặc 2)
  mutationChanceMultiplier: number;// Hệ số nhân tỷ lệ biến dị (1.0 - 2.5)
  flameConfig: HeavenlyFlameConfig;
  refundHerbRatio: number;         // Tỷ lệ hoàn trả nguyên liệu (0.5 nếu nổ lò)
  logMessage: string;
  toxicityResult?: ToxicityCalculationResult;
}

/**
 * Tính toán toàn diện tác động của Dị Hỏa lên mẻ đan:
 * - Kiểm tra nổ lò (Dị Hỏa Bạo Liệt)
 * - Tính hệ số thiêu rụi Đan Độc dạng tỷ lệ chuẩn (flameBurnRatio: 0.0 -> 1.0)
 * - Tích hợp mô hình suy hao cấp nhân nếu truyền baseToxicity
 * - Tính hệ số nhân sản lượng và tỷ lệ biến dị
 */
export function applyFlameToAlchemyProcess(
  flameState?: HeavenlyFlameState | null,
  catalystId?: string | null,
  forceExplosion?: boolean,        // Dùng cho Unit Test
  randomSeed?: number,             // Dùng cho RNG deterministic test
  baseToxicity?: number,
  veinTier?: PillVeinTier
): FlameProcessOutcome {
  const equippedId = flameState?.equippedFlameId;
  const flameInstance = equippedId ? flameState?.unlockedFlames[equippedId] : null;
  const config = (equippedId && HEAVENLY_FLAMES_REGISTRY[equippedId])
    ? HEAVENLY_FLAMES_REGISTRY[equippedId]
    : DEFAULT_MORTAL_FLAME;

  // 1. Kiểm tra nguy cơ nổ lò (Explosion Check)
  let explosionRisk = config.explosionRiskPercent;
  // Nếu có Aura giảm nổ lò (ví dụ Hóa Lôi Vi Kính)
  if (flameInstance?.unlockedAuraIds?.includes('aura_xich_loi_2')) {
    explosionRisk = Math.max(0, explosionRisk - 5);
  }

  let isExploded = false;
  if (forceExplosion) {
    isExploded = true;
  } else if (explosionRisk > 0) {
    const roll = (randomSeed !== undefined ? randomSeed : Math.random()) * 100;
    isExploded = roll < explosionRisk;
  }

  if (isExploded) {
    return {
      isExploded: true,
      toxicityBurnPercent: 0,
      flameBurnRatio: 0,
      veinQualityBonus: 0,
      yieldMultiplier: 0,
      mutationChanceMultiplier: 1.0,
      flameConfig: config,
      refundHerbRatio: 0.5, // Bảo toàn 50% thảo dược hoàn trả vào kho
      logMessage: `💥 NỔ LÒ! Dị hỏa [${config.name}] cuồng bạo mất kiểm soát, mẻ đan biến thành tro bụi! Trận đồ bảo hộ đã thu hồi 50% dược liệu gốc.`
    };
  }

  // 2. Tính hệ số thiêu rụi Đan Độc gốc từ Dị Hỏa (flameBurnRatio: 0.0 -> 1.0)
  let toxicityBurn = config.baseToxicityBurnPercent;
  if (flameInstance?.unlockedAuraIds?.includes('aura_thanh_lien_1')) {
    toxicityBurn += 10;
  }
  if (flameInstance?.unlockedAuraIds?.includes('aura_u_minh_2')) {
    toxicityBurn += 10;
  }
  if (flameInstance?.unlockedAuraIds?.includes('aura_hon_don_2')) {
    toxicityBurn += 10;
  }
  toxicityBurn = Math.min(60, toxicityBurn);
  const flameBurnRatio = Math.max(0, Math.min(1, Number((toxicityBurn / 100).toFixed(2))));

  // 3. Tính điểm phẩm chất Đan Văn cộng thêm
  let veinQualityBonus = config.baseVeinQualityBonus;
  if (flameInstance?.unlockedAuraIds?.includes('aura_thanh_lien_2')) {
    veinQualityBonus += 15;
  }
  if (flameInstance?.unlockedAuraIds?.includes('aura_hon_don_1')) {
    veinQualityBonus += 15;
  }
  if (flameInstance?.unlockedAuraIds?.includes('aura_hon_don_3')) {
    veinQualityBonus += 30;
  }

  // 4. Tính hệ số nhân sản lượng (Yield)
  const yieldMultiplier = config.baseYieldMultiplier;

  // 5. Tính hệ số nhân xác suất Biến Dị (chỉ kích hoạt mạnh khi có phụ liệu xúc tác)
  let mutMultiplier = config.mutationChanceMultiplier;
  if (catalystId && flameInstance?.unlockedAuraIds?.includes('aura_u_minh_1')) {
    mutMultiplier += 0.2;
  }
  if (catalystId && flameInstance?.unlockedAuraIds?.includes('aura_u_minh_3')) {
    mutMultiplier = Math.max(mutMultiplier, 2.5);
  }

  let logMsg = `🔥 Đan hỏa [${config.name}] gia trì mẻ nung!`;
  if (toxicityBurn > 0) logMsg += ` Thiêu rụi ${toxicityBurn}% đan độc gốc.`;
  if (yieldMultiplier > 1) logMsg += ` Nhân đôi sản lượng (x${yieldMultiplier} đan).`;
  if (mutMultiplier > 1) logMsg += ` Khuếch đại x${mutMultiplier} tỷ lệ dị biến.`;

  // 6. Tính toán Đan Độc theo mô hình cấp nhân nếu được truyền baseToxicity
  let toxicityResult: ToxicityCalculationResult | undefined;
  if (baseToxicity !== undefined) {
    toxicityResult = calculateCompoundingToxicity({
      baseToxicity,
      veinTier: veinTier ?? 0,
      flameBurnRatio
    });
  }

  return {
    isExploded: false,
    toxicityBurnPercent: toxicityBurn,
    flameBurnRatio,
    veinQualityBonus,
    yieldMultiplier,
    mutationChanceMultiplier: mutMultiplier,
    flameConfig: config,
    refundHerbRatio: 1.0,
    logMessage: logMsg,
    toxicityResult
  };
}

/**
 * Trích xuất hệ số giảm độc Dị Hỏa dạng tỷ lệ (0.0 -> 1.0)
 */
export function extractFlameBurnRatio(
  flameState?: HeavenlyFlameState | null
): number {
  const equippedId = flameState?.equippedFlameId;
  const flameInstance = equippedId ? flameState?.unlockedFlames[equippedId] : null;
  const config = (equippedId && HEAVENLY_FLAMES_REGISTRY[equippedId])
    ? HEAVENLY_FLAMES_REGISTRY[equippedId]
    : DEFAULT_MORTAL_FLAME;
  let toxicityBurn = config.baseToxicityBurnPercent;
  if (flameInstance?.unlockedAuraIds?.includes('aura_thanh_lien_1')) {
    toxicityBurn += 10;
  }
  if (flameInstance?.unlockedAuraIds?.includes('aura_u_minh_2')) {
    toxicityBurn += 10;
  }
  if (flameInstance?.unlockedAuraIds?.includes('aura_hon_don_2')) {
    toxicityBurn += 10;
  }
  toxicityBurn = Math.min(60, toxicityBurn);
  return Math.max(0, Math.min(1, Number((toxicityBurn / 100).toFixed(2))));
}

/**
 * Khởi tạo mặc định đối tượng HeavenlyFlameState an toàn
 */
export function createDefaultHeavenlyFlameState(): HeavenlyFlameState {
  return {
    unlockedFlames: {},
    equippedFlameId: null // Mặc định dùng Phàm Hỏa Cơ Bản
  };
}

/**
 * Mở khóa một ngọn Dị Hỏa mới cho người chơi ở Tier 1
 */
export function unlockHeavenlyFlame(
  flameState: HeavenlyFlameState,
  flameId: string
): HeavenlyFlameState {
  const config = HEAVENLY_FLAMES_REGISTRY[flameId];
  if (!config) return flameState;

  if (flameState.unlockedFlames[flameId]) {
    return flameState; // Đã mở khóa trước đó
  }

  const newInstance: PlayerFlameInstance = {
    flameId,
    tier: 1,
    currentExp: 0,
    maxExp: 250,
    unlockedAuraIds: [],
    totalCraftsWithFlame: 0
  };

  return {
    ...flameState,
    unlockedFlames: {
      ...flameState.unlockedFlames,
      [flameId]: newInstance
    },
    // Nếu chưa trang bị ngọn nào, tự động trang bị ngọn mới mở khóa
    equippedFlameId: flameState.equippedFlameId || flameId
  };
}
