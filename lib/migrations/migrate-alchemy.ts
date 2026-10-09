/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/migrations/migrate-alchemy.ts
// Module Chuẩn Hóa & Di Trú Dữ Liệu Phân Hệ Đan Đạo (Alchemy Migration Subsystem)
// Trích xuất từ lib/save-migration.ts — Giữ nguyên 100% logic, key names & fallback mặc định

import {
  PlayerStats,
  PlayerState,
  FlameTier,
  MutagenicAffixType
} from '@/lib/types';
import { PillVeinTier } from '@/lib/types/pill-veins';
import {
  MUTATION_HARD_CAPS,
  PILL_VEIN_CONFIG,
  calculateCompoundingToxicity
} from '@/lib/pill-vein-logic';
import { PILL_DEFINITIONS_MAP } from '@/lib/pill-tier-data';
import {
  createDefaultHeavenlyFlameState,
  HEAVENLY_FLAMES_REGISTRY
} from '@/lib/heavenly-flame-logic';

// ============================================================================
// 1. MIGRATION BIẾN DỊ DƯỢC TÍNH (MUTAGENIC POTIONS & AFFIXES)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Biến Dị Dược Tính (Consumed Mutations):
 * - Chuẩn hóa toàn bộ cấu trúc player.consumedMutations: {}
 * - Kẹp trần chỉ số theo MUTATION_HARD_CAPS để chống tràn số / hack save
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu save game cũ
 */
export function migratePillMutationsData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  if (!cloned.consumedMutations || typeof cloned.consumedMutations !== 'object') {
    cloned.consumedMutations = {};
  } else {
    for (const [affix, val] of Object.entries(cloned.consumedMutations)) {
      if (typeof val === 'number') {
        const cap = MUTATION_HARD_CAPS[affix as MutagenicAffixType] ?? 20;
        cloned.consumedMutations[affix as MutagenicAffixType] = Math.max(
          0,
          Math.min(cap, Number(val.toFixed(2)))
        );
      }
    }
  }

  return cloned;
}

// ============================================================================
// 2. MIGRATION ĐAN VĂN CỬU TRỌNG (PILL VEINS SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Phân Tầng Đan Văn & Dược Tính Biến Dị" (Pill Veins System):
 * - Chuẩn hóa toàn bộ đan dược trong túi sang định dạng có veinMetadata nếu chưa có (veinCount: 0, isMutated: false).
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migratePillVeinsData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // Chuẩn hóa đan dược trong inventory
  if (cloned.inventory && Array.isArray(cloned.inventory.pills)) {
    cloned.inventory.pills = cloned.inventory.pills.map((pill: any) => {
      if (!pill || typeof pill !== 'object') return pill;
      if (!pill.veinMetadata || typeof pill.veinMetadata !== 'object') {
        return {
          ...pill,
          veinMetadata: {
            veinCount: 0,
            veinMultiplier: 1.0,
            toxicityMultiplier: 0.50,
            mutation: null
          },
          isMutated: false
        };
      }
      return pill;
    });
  }

  return cloned;
}

/**
 * Hàm di trú kết hợp Pill Veins & Mutations (Tương thích ngược tên hàm cũ `migratePillVeinData`)
 */
export function migratePillVeinData(player: any): any {
  if (!player) return player;
  const withMutations = migratePillMutationsData(player);
  return migratePillVeinsData(withMutations);
}

// ============================================================================
// 3. MIGRATION THIÊN ĐỊA DỊ HỎA (HEAVENLY FLAME SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)"
 * - Chuẩn hóa toàn bộ cấu trúc player.flameState: { unlockedFlames: {}, equippedFlameId: null }
 * - Lọc bỏ các ngọn Dị Hỏa ID không hợp lệ hoặc ma, dọn sạch equippedFlameId nếu không tồn tại trong unlockedFlames.
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migrateHeavenlyFlameData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  if (!cloned.flameState || typeof cloned.flameState !== 'object') {
    cloned.flameState = createDefaultHeavenlyFlameState();
  } else {
    const rawFlames = cloned.flameState.unlockedFlames;
    const sanitizedFlames: Record<string, any> = {};

    if (rawFlames && typeof rawFlames === 'object') {
      for (const [fId, inst] of Object.entries(rawFlames)) {
        if (HEAVENLY_FLAMES_REGISTRY[fId] && inst && typeof inst === 'object') {
          const rawInst = inst as any;
          const tier = (Number.isInteger(rawInst.tier) && rawInst.tier >= 1 && rawInst.tier <= 9)
            ? (rawInst.tier as FlameTier)
            : 1;
          const maxExp = tier * 250;
          const currentExp = typeof rawInst.currentExp === 'number'
            ? Math.max(0, Math.min(maxExp, rawInst.currentExp))
            : 0;

          sanitizedFlames[fId] = {
            flameId: fId,
            tier,
            currentExp,
            maxExp,
            unlockedAuraIds: Array.isArray(rawInst.unlockedAuraIds) ? rawInst.unlockedAuraIds : [],
            totalCraftsWithFlame: typeof rawInst.totalCraftsWithFlame === 'number'
              ? Math.max(0, rawInst.totalCraftsWithFlame)
              : 0
          };
        }
      }
    }

    const equippedFlameId = (typeof cloned.flameState.equippedFlameId === 'string' && sanitizedFlames[cloned.flameState.equippedFlameId])
      ? cloned.flameState.equippedFlameId
      : null;

    cloned.flameState = {
      unlockedFlames: sanitizedFlames,
      equippedFlameId
    };
  }

  return cloned;
}

// ============================================================================
// 4. MIGRATION HỎA HẬU CHIẾN THUẬT (ALCHEMY TACTICS SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho hệ thống Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ:
 * - Chuẩn hóa toàn bộ cấu trúc player.alchemyTacticsState: { defaultStance: 'van_vu_song_hanh', customConcoctionsHistory: [] }
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migrateAlchemyTacticsData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  if (!cloned.alchemyTacticsState || typeof cloned.alchemyTacticsState !== 'object') {
    cloned.alchemyTacticsState = {
      defaultStance: 'van_vu_song_hanh',
      customConcoctionsHistory: []
    };
  } else {
    const allowedStances = ['van_hoa', 'vu_hoa', 'van_vu_song_hanh'];
    const defaultStance = allowedStances.includes(cloned.alchemyTacticsState.defaultStance)
      ? cloned.alchemyTacticsState.defaultStance
      : 'van_vu_song_hanh';

    const history = Array.isArray(cloned.alchemyTacticsState.customConcoctionsHistory)
      ? cloned.alchemyTacticsState.customConcoctionsHistory.filter((e: any) => e && typeof e === 'object')
      : [];

    cloned.alchemyTacticsState = {
      defaultStance,
      customConcoctionsHistory: history
    };
  }

  return cloned;
}

// ============================================================================
// 5. MIGRATION ĐAN LÔI KIẾP & ĐAN LINH (PILL TRIBULATION SYSTEM)
// ============================================================================

/**
 * Migration an toàn cho hệ thống Đan Lôi Kiếp & Đan Linh Hóa Hình:
 * - Chuẩn hóa toàn bộ cấu trúc player.pillTribulationState: { totalTribulationsFaced: 0, successfulDefenses: 0, danSpirits: [], activeTribulation: null }
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migratePillTribulationData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  if (!cloned.pillTribulationState || typeof cloned.pillTribulationState !== 'object') {
    cloned.pillTribulationState = {
      totalTribulationsFaced: 0,
      successfulDefenses: 0,
      danSpirits: [],
      activeTribulation: null
    };
  } else {
    cloned.pillTribulationState = {
      totalTribulationsFaced: typeof cloned.pillTribulationState.totalTribulationsFaced === 'number'
        ? Math.max(0, cloned.pillTribulationState.totalTribulationsFaced)
        : 0,
      successfulDefenses: typeof cloned.pillTribulationState.successfulDefenses === 'number'
        ? Math.max(0, cloned.pillTribulationState.successfulDefenses)
        : 0,
      danSpirits: Array.isArray(cloned.pillTribulationState.danSpirits)
        ? cloned.pillTribulationState.danSpirits.filter((s: any) => s && typeof s === 'object')
        : [],
      activeTribulation: cloned.pillTribulationState.activeTribulation && typeof cloned.pillTribulationState.activeTribulation === 'object'
        ? cloned.pillTribulationState.activeTribulation
        : null
    };
  }

  return cloned;
}

// ============================================================================
// 6. MIGRATION CÔNG THỨC ĐAN ĐỘC (TOXICITY FORMULA UPDATE)
// ============================================================================

/**
 * Migration an toàn cập nhật lại hệ số độc cho toàn bộ đan dược trong save game của người chơi
 * - Quét qua player.inventory (cả pills và items có category === 'pill' / 'pills')
 * - Kiểm tra cấp Đan Văn hiện có trên vật phẩm (veinTier, veinCount hoặc danVan)
 * - Cập nhật item.toxicityMultiplier theo PILL_VEIN_CONFIG mới:
 *   * 0 Văn -> 0.50
 *   * 1-2 Văn -> 0.40
 *   * 3-5 Văn -> 0.25
 *   * 6-8 Văn -> 0.10
 *   * 9 Văn -> 0.00
 * - Cập nhật đồng bộ veinMetadata.toxicityMultiplier
 * - Tính toán lại trường item.pillToxicity tương ứng nếu vật phẩm lưu trữ trực tiếp điểm độc cuối cùng
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu không mất mát
 */
export function migrateToxicityFormulaUpdate(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  const updatePill = (pill: any) => {
    if (!pill || typeof pill !== 'object') return pill;

    // Trích xuất cấp Đan Văn hiện có
    let rawTier = 0;
    if (pill.veinMetadata && typeof pill.veinMetadata.veinCount === 'number') {
      rawTier = pill.veinMetadata.veinCount;
    } else if (pill.veinMetadata && typeof pill.veinMetadata.veinTier === 'number') {
      rawTier = pill.veinMetadata.veinTier;
    } else if (typeof pill.veinCount === 'number') {
      rawTier = pill.veinCount;
    } else if (typeof pill.veinTier === 'number') {
      rawTier = pill.veinTier;
    } else if (typeof pill.danVan === 'number') {
      rawTier = pill.danVan;
    }
    const veinTier: PillVeinTier = Math.max(0, Math.min(9, Math.floor(rawTier))) as PillVeinTier;

    const config = PILL_VEIN_CONFIG[veinTier as PillVeinTier] || PILL_VEIN_CONFIG[0];
    const newMultiplier = config.toxicityMultiplier;

    // Lưu lại hệ số cũ để nội suy baseToxicity nếu save cũ không lưu baseToxicity
    const oldMultiplier = typeof pill.toxicityMultiplier === 'number'
      ? pill.toxicityMultiplier
      : (typeof pill.veinMetadata?.toxicityMultiplier === 'number' ? pill.veinMetadata.toxicityMultiplier : 1.0);

    // Cập nhật toxicityMultiplier ở cấp item và trong veinMetadata
    pill.toxicityMultiplier = newMultiplier;

    if (!pill.veinMetadata || typeof pill.veinMetadata !== 'object') {
      pill.veinMetadata = {
        veinCount: veinTier,
        veinMultiplier: config.veinMultiplier,
        toxicityMultiplier: newMultiplier,
        mutation: null
      };
    } else {
      pill.veinMetadata.veinCount = veinTier;
      pill.veinMetadata.toxicityMultiplier = newMultiplier;
      if (typeof pill.veinMetadata.veinMultiplier !== 'number') {
        pill.veinMetadata.veinMultiplier = config.veinMultiplier;
      }
    }

    // 9 Văn (Cửu Khổng Thần Đan) tuyệt đối 0% đan độc
    if (veinTier === 9) {
      pill.toxicityMultiplier = 0.00;
      pill.veinMetadata.toxicityMultiplier = 0.00;
      if (pill.pillToxicity !== undefined) pill.pillToxicity = 0;
      if (pill.toxicity !== undefined) pill.toxicity = 0;
      return pill;
    }

    // Tính toán lại trường pillToxicity / toxicity nếu vật phẩm lưu trữ trực tiếp điểm độc cuối cùng
    const pillDef = PILL_DEFINITIONS_MAP[pill.basePillId || pill.id];
    let baseTox: number;
    if (typeof pill.baseToxicity === 'number') {
      baseTox = pill.baseToxicity;
    } else if (pillDef?.effects?.toxicityPercent !== undefined) {
      baseTox = pillDef.effects.toxicityPercent;
    } else if (typeof pill.pillToxicity === 'number' && oldMultiplier > 0) {
      baseTox = Math.round(pill.pillToxicity / oldMultiplier);
    } else if (typeof pill.toxicity === 'number' && oldMultiplier > 0) {
      baseTox = Math.round(pill.toxicity / oldMultiplier);
    } else if (typeof pill.pillToxicity === 'number') {
      baseTox = pill.pillToxicity;
    } else {
      baseTox = 15;
    }

    // Lưu lại baseToxicity để đảm bảo Idempotent khi chạy lại nhiều lần
    pill.baseToxicity = baseTox;

    const flameBurnRatio = (pill.veinMetadata?.toxicityBurnPercent || 0) / 100;

    const toxResult = calculateCompoundingToxicity({
      baseToxicity: baseTox,
      veinTier,
      flameBurnRatio
    });
    const finalTox = Math.round(toxResult.finalToxicity);

    if (pill.pillToxicity !== undefined) {
      pill.pillToxicity = finalTox;
    }
    if (pill.toxicity !== undefined) {
      pill.toxicity = finalTox;
    }

    return pill;
  };

  const isPillItem = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;
    return Boolean(
      item.category === 'pill' ||
      item.category === 'pills' ||
      item.category === 'forbidden_pill' ||
      item.itemType === 'pill' ||
      item.type === 'pill' ||
      item.veinMetadata !== undefined ||
      item.danVan !== undefined ||
      item.veinTier !== undefined ||
      item.veinCount !== undefined ||
      item.pillToxicity !== undefined
    );
  };

  // 1. Quét player.inventory.pills
  if (cloned.inventory && Array.isArray(cloned.inventory.pills)) {
    cloned.inventory.pills = cloned.inventory.pills.map(updatePill);
  }

  // 2. Quét player.inventory nếu là mảng (legacy format) hoặc inventory.items
  if (Array.isArray(cloned.inventory)) {
    cloned.inventory = (cloned.inventory as any[]).map((item: any) => {
      if (isPillItem(item)) {
        return updatePill(item);
      }
      return item;
    }) as any;
  } else if ((cloned.inventory as any)?.items && Array.isArray((cloned.inventory as any).items)) {
    (cloned.inventory as any).items = (cloned.inventory as any).items.map((item: any) => {
      if (isPillItem(item)) {
        return updatePill(item);
      }
      return item;
    });
  }

  return cloned;
}

// ============================================================================
// 7. ORCHESTRATOR PHÂN HỆ ĐAN ĐẠO (NORMALIZE ALCHEMY STATE)
// ============================================================================

/**
 * Chuẩn hóa toàn diện phân hệ Đan Đạo cho người chơi:
 * Gọi tuần tự các hàm di trú Đan Đạo theo thứ tự logic:
 * 1. migratePillMutationsData (biến dị dược tính)
 * 2. migratePillVeinsData (đan văn)
 * 3. migrateToxicityFormulaUpdate (hệ số đan độc)
 * 4. migrateHeavenlyFlameData (dị hỏa)
 * 5. migrateAlchemyTacticsData (hỏa hậu & chiến thuật)
 * 6. migratePillTribulationData (đan lôi kiếp & đan linh)
 */
export function normalizeAlchemyState(player: PlayerState): PlayerState {
  if (!player) return player;

  let state = migratePillMutationsData(player);
  state = migratePillVeinsData(state);
  state = migrateToxicityFormulaUpdate(state);
  state = migrateHeavenlyFlameData(state);
  state = migrateAlchemyTacticsData(state);
  state = migratePillTribulationData(state);

  return state as PlayerState;
}
