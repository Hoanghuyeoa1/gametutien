// hooks/useCustomRecipeActions.ts
// Custom Hook điều phối toàn bộ phân hệ "Khai Sáng Đan Phương & Đan Đạo Tông Sư"
// Ràng buộc: Immutable PlayerState, strict typing, không dùng `any`.

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats, Herb } from '@/lib/types';
import {
  ExperimentSlot,
  CustomDanRecipe,
  ExperimentEvaluationResult,
  CustomRecipeState
} from '@/lib/types/custom-recipe';
import {
  evaluateHerbExperiment,
  innovateCustomRecipe,
  archiveRecipeToSect,
  calculateBlackMarketValuation,
  BlackMarketValuationResult,
  getHerbMedicinalProperty
} from '@/lib/custom-recipe-logic';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';

// =========================================================================
// CONSTANTS
// =========================================================================

const MAX_SLOTS = 5;
const MIN_SLOTS_REQUIRED = 3;

// Pool gợi ý tên đan dược phong cách Tiên Hiệp
const SUGGESTED_DAN_NAMES: string[] = [
  'Thái Cực Nguyên Dương Đan',
  'Cửu Chuyển Hóa Thần Đan',
  'Hỗn Nguyên Khai Thiên Đan',
  'Vạn Linh Hội Tụ Đan',
  'Thiên Địa Tinh Hoa Đan',
  'Bắc Đẩu Huyền Cơ Đan',
  'Âm Dương Song Nguyên Đan',
  'Tam Tài Quy Nhất Đan',
  'Ngũ Hành Điều Hòa Đan',
  'Linh Căn Khai Mạch Đan',
  'Tử Hà Thần Đan',
  'Huyền Thiên Chí Bảo Đan',
  'Đại Đạo Quy Chân Đan',
  'Thiên Mệnh Hóa Hoa Đan',
  'Vô Cực Huyền Nguyên Đan',
  'Long Hổ Phục Ma Đan',
  'Kim Cương Bất Hoại Đan',
  'Thượng Thanh Tịnh Thần Đan',
  'Cổ Thần Phong Hỏa Đan',
  'Tứ Tượng Quy Nguyên Đan'
];

// =========================================================================
// TYPES
// =========================================================================

export interface LiveEvaluationState {
  evaluation: ExperimentEvaluationResult | null;
  activeSlotCount: number;
  isReadyToInnovate: boolean;
  thermalTotal: number;
  totalTonic: number;
  totalToxicity: number;
}

export interface UseCustomRecipeActionsParams {
  player: PlayerStats;
  setPlayer: ((player: PlayerStats) => void) | React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: 'alchemy' | 'sect' | 'system' | 'danger') => void;
  showToast?: (msg: string) => void;
}

export interface UseCustomRecipeActionsReturn {
  // State
  experimentSlots: (ExperimentSlot | null)[];
  liveEvaluation: LiveEvaluationState;
  isInnovating: boolean;
  discoveredRecipes: CustomDanRecipe[];
  totalResearchAttempts: number;
  // Actions
  handleAssignHerb: (slotIndex: number, herbId: string, count: number) => void;
  handleRemoveHerb: (slotIndex: number) => void;
  handleClearAllSlots: () => void;
  handleExecuteInnovation: (name: string, lore: string) => Promise<CustomDanRecipe | null>;
  handleArchiveToSect: (recipeId: string) => void;
  // Utilities
  suggestDanName: () => string;
  getBlackMarketValuation: (recipeId: string) => BlackMarketValuationResult | null;
  getHerbInfoForSlot: (herbId: string) => ReturnType<typeof getHerbMedicinalProperty>;
  getInventoryHerbQuantity: (herbId: string) => number;
}

// =========================================================================
// HOOK IMPLEMENTATION
// =========================================================================

export function useCustomRecipeActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseCustomRecipeActionsParams): UseCustomRecipeActionsReturn {
  // 5 slots, mỗi slot null = trống
  const [experimentSlots, setExperimentSlots] = useState<(ExperimentSlot | null)[]>(
    () => Array(MAX_SLOTS).fill(null)
  );

  const [isInnovating, setIsInnovating] = useState<boolean>(false);

  // ─── Derived: customRecipeState ───────────────────────────────────────
  const customRecipeState: CustomRecipeState = useMemo(() => {
    return player.customRecipeState ?? {
      discoveredRecipes: [],
      totalResearchAttempts: 0,
      sectArchivedRecipeIds: []
    };
  }, [player.customRecipeState]);

  const discoveredRecipes = customRecipeState.discoveredRecipes;
  const totalResearchAttempts = customRecipeState.totalResearchAttempts;

  // ─── Derived: inventory herbs map cho O(1) lookup ─────────────────────
  const inventoryHerbMap = useMemo<Map<string, number>>(() => {
    const m = new Map<string, number>();
    const herbs: Herb[] = player.inventory?.herbs ?? [];
    for (const h of herbs) {
      const qty = h.quantity ?? (h as { count?: number }).count ?? 0;
      m.set(h.id, qty);
    }
    return m;
  }, [player.inventory?.herbs]);

  // ─── Derived: liveEvaluation (recalculate mỗi khi slots thay đổi) ─────
  const liveEvaluation = useMemo<LiveEvaluationState>(() => {
    const activeSlots = experimentSlots.filter(
      (s): s is ExperimentSlot => s !== null && s.herbId !== '' && s.count > 0
    );
    const activeSlotCount = activeSlots.length;

    if (activeSlotCount < MIN_SLOTS_REQUIRED) {
      return {
        evaluation: null,
        activeSlotCount,
        isReadyToInnovate: false,
        thermalTotal: 0,
        totalTonic: 0,
        totalToxicity: 0
      };
    }

    const evaluation = evaluateHerbExperiment(activeSlots);

    // Tổng hợp chỉ số nhiệt / bổ / độc để hiển thị Live Compass
    let thermalTotal = 0;
    let totalTonic = 0;
    let totalToxicity = 0;
    for (const slot of activeSlots) {
      const prop = getHerbMedicinalProperty(slot.herbId);
      const count = Math.max(1, slot.count);
      thermalTotal += prop.thermalScore * count;
      totalTonic += prop.tonicValue * count;
      totalToxicity += prop.toxicityValue * count;
    }

    return {
      evaluation,
      activeSlotCount,
      isReadyToInnovate: evaluation.isHarmonious,
      thermalTotal,
      totalTonic,
      totalToxicity
    };
  }, [experimentSlots]);

  // ─── Helper: save player atomic ───────────────────────────────────────
  const saveUpdatedPlayer = useCallback((updated: PlayerStats) => {
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (err) {
      console.error('[useCustomRecipeActions] Lỗi ghi localStorage:', err);
    }
  }, [setPlayer]);

  // ─── ACTION: handleAssignHerb ─────────────────────────────────────────
  const handleAssignHerb = useCallback((
    slotIndex: number,
    herbId: string,
    count: number
  ): void => {
    if (slotIndex < 0 || slotIndex >= MAX_SLOTS) {
      showToast?.('⚠️ Vị trí slot không hợp lệ!');
      return;
    }
    if (!herbId || herbId.trim() === '') {
      showToast?.('⚠️ ID thảo dược không hợp lệ!');
      return;
    }
    const safeCount = Math.max(1, Math.floor(count));
    const availableQty = inventoryHerbMap.get(herbId) ?? 0;
    if (availableQty < safeCount) {
      const herbInfo = getHerbMedicinalProperty(herbId);
      showToast?.(`⚠️ Không đủ [${herbInfo.name}] trong túi đồ (cần ${safeCount}, hiện có ${availableQty})!`);
      return;
    }

    setExperimentSlots(prev => {
      const next = [...prev];
      next[slotIndex] = { herbId, count: safeCount };
      return next;
    });
  }, [inventoryHerbMap, showToast]);

  // ─── ACTION: handleRemoveHerb ─────────────────────────────────────────
  const handleRemoveHerb = useCallback((slotIndex: number): void => {
    if (slotIndex < 0 || slotIndex >= MAX_SLOTS) return;
    setExperimentSlots(prev => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  // ─── ACTION: handleClearAllSlots ─────────────────────────────────────
  const handleClearAllSlots = useCallback((): void => {
    setExperimentSlots(Array(MAX_SLOTS).fill(null));
  }, []);

  // ─── ACTION: handleExecuteInnovation ─────────────────────────────────
  const handleExecuteInnovation = useCallback(async (
    name: string,
    lore: string
  ): Promise<CustomDanRecipe | null> => {
    const activeSlots = experimentSlots.filter(
      (s): s is ExperimentSlot => s !== null && s.herbId !== '' && s.count > 0
    );

    // Validate tối thiểu 3 slot hợp lệ
    if (activeSlots.length < MIN_SLOTS_REQUIRED) {
      showToast?.(`⚠️ Cần tối thiểu ${MIN_SLOTS_REQUIRED} vị thảo dược để khai sáng đan phương!`);
      return null;
    }

    // Validate âm dương hòa hợp trước khi chạy mutation
    if (!liveEvaluation.isReadyToInnovate) {
      const evalMsg = liveEvaluation.evaluation?.message ?? 'Dược tính chưa hòa hợp!';
      showToast?.(`⚠️ ${evalMsg}`);
      return null;
    }

    setIsInnovating(true);
    try {
      const result = innovateCustomRecipe(player, activeSlots, name.trim(), lore.trim());

      if (!result.success) {
        showToast?.(`⚠️ ${result.error ?? 'Khai sáng thất bại!'}`);
        // Vẫn lưu nếu thảo dược đã bị tiêu hao (lò nổ nhưng nguyên liệu mất)
        if (result.updatedPlayer !== player) {
          saveUpdatedPlayer(result.updatedPlayer);
        }
        return null;
      }

      // Khai sáng thành công
      saveUpdatedPlayer(result.updatedPlayer);
      // Reset toàn bộ slots sau khi thành công
      setExperimentSlots(Array(MAX_SLOTS).fill(null));

      const recipe = result.recipe!;
      showToast?.(`🌟 Khai Sáng Thành Công! [${recipe.name}] - ${recipe.grade}`);
      addLog?.(
        'Khai Sáng Đan Phương',
        `Đan Phương [${recipe.name}] (Tier ${recipe.tier}, ${recipe.grade}) đã được ghi vào Đan Phương Độc Bản! Dược lực Tu Vi: +${recipe.effectValue.toLocaleString()}.`,
        'alchemy'
      );

      return recipe;
    } finally {
      setIsInnovating(false);
    }
  }, [experimentSlots, liveEvaluation, player, showToast, addLog, saveUpdatedPlayer]);

  // ─── ACTION: handleArchiveToSect ─────────────────────────────────────
  const handleArchiveToSect = useCallback((recipeId: string): void => {
    const result = archiveRecipeToSect(player, recipeId);

    if (!result.success) {
      showToast?.(`⚠️ ${result.message}`);
      return;
    }

    saveUpdatedPlayer(result.updatedPlayer);
    showToast?.(`🏛️ ${result.message}`);
    addLog?.(
      'Hiến Tặng Tàng Kinh Các',
      `${result.message} Danh Vọng +${result.reputationGained.toLocaleString()}.`,
      'sect'
    );
  }, [player, showToast, addLog, saveUpdatedPlayer]);

  // ─── UTILITY: suggestDanName ──────────────────────────────────────────
  const suggestDanName = useCallback((): string => {
    const randomIndex = Math.floor(Math.random() * SUGGESTED_DAN_NAMES.length);
    return SUGGESTED_DAN_NAMES[randomIndex];
  }, []);

  // ─── UTILITY: getBlackMarketValuation ────────────────────────────────
  const getBlackMarketValuation = useCallback((recipeId: string): BlackMarketValuationResult | null => {
    const recipe = discoveredRecipes.find(r => r.id === recipeId);
    if (!recipe) return null;
    return calculateBlackMarketValuation(recipe);
  }, [discoveredRecipes]);

  // ─── UTILITY: getInventoryHerbQuantity ───────────────────────────────
  const getInventoryHerbQuantity = useCallback((herbId: string): number => {
    return inventoryHerbMap.get(herbId) ?? 0;
  }, [inventoryHerbMap]);

  // ─── UTILITY: getHerbInfoForSlot ─────────────────────────────────────
  const getHerbInfoForSlot = useCallback((herbId: string) => {
    return getHerbMedicinalProperty(herbId);
  }, []);

  return {
    experimentSlots,
    liveEvaluation,
    isInnovating,
    discoveredRecipes,
    totalResearchAttempts,
    handleAssignHerb,
    handleRemoveHerb,
    handleClearAllSlots,
    handleExecuteInnovation,
    handleArchiveToSect,
    suggestDanName,
    getBlackMarketValuation,
    getHerbInfoForSlot,
    getInventoryHerbQuantity
  };
}
