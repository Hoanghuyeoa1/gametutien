// hooks/useModularForgingActions.ts
// Custom Hook điều phối toàn bộ State và Actions cho tính năng Đoán Cốt Hợp Kim & Tự Chọn Phôi Khí
// 100% Strict TypeScript, Immutable State, Atomic Guard, Clean Architecture

import { useState, useMemo, useCallback } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import {
  WeaponArchetypeId,
  MetallurgyOreInput,
  AlloyCompositionResult,
  PlayerModularMetallurgyState
} from '@/lib/types/modular-metallurgy';
import {
  calculateAlloyComposition,
  craftModularEquipment,
  generateModularWeaponName,
  deductOresFromInventory
} from '@/lib/modular-metallurgy-logic';
import { HEAVENLY_FLAMES_REGISTRY } from '@/lib/heavenly-flame-logic';
import { normalizePlayerData } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface UseModularForgingActionsProps {
  player?: PlayerState;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'forging' | 'system' | 'danger') => void;
}

export interface UseModularForgingActionsReturn {
  // 1. Hook State
  selectedArchetype: WeaponArchetypeId;
  selectedOreSlots: (MetallurgyOreInput | null)[];
  customWeaponName: string;
  isForging: boolean;
  lastForgedResult: Equipment | null;

  // 2. Real-time Preview Engine (Derived State)
  activeOres: MetallurgyOreInput[];
  liveAlloyPreview: AlloyCompositionResult | null;
  predictedWeaponName: string;
  validationError: string | null;
  canForge: boolean;

  // 3. Actions
  handleSelectArchetype: (id: WeaponArchetypeId) => void;
  handleSetOreSlot: (slotIndex: number, ore: MetallurgyOreInput | null) => void;
  handleClearSlots: () => void;
  handleSetCustomWeaponName: (name: string) => void;
  handleResetLastForgedResult: () => void;
  handleExecuteForging: (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'forging' | 'system' | 'danger') => void;
    }
  ) => Promise<void>;
}

export function useModularForgingActions(
  props?: UseModularForgingActionsProps
): UseModularForgingActionsReturn {
  const { player: propPlayer, showToast, addLog } = props || {};

  // 1. Hook State
  const [selectedArchetype, setSelectedArchetype] = useState<WeaponArchetypeId>('phi_kiem');
  const [selectedOreSlots, setSelectedOreSlots] = useState<(MetallurgyOreInput | null)[]>([
    null,
    null,
    null,
    null
  ]);
  const [customWeaponName, setCustomWeaponName] = useState<string>('');
  const [isForging, setIsForging] = useState<boolean>(false);
  const [lastForgedResult, setLastForgedResult] = useState<Equipment | null>(null);

  // 2. Real-time Preview Engine
  // Lọc danh sách quặng đang nạp vào lò (loại bỏ null)
  const activeOres = useMemo<MetallurgyOreInput[]>(() => {
    return selectedOreSlots.filter((ore): ore is MetallurgyOreInput => ore !== null);
  }, [selectedOreSlots]);

  // Dự toán kết quả hợp kim tức thì khi thay đổi loại quặng hoặc khối lượng
  const liveAlloyPreview = useMemo<AlloyCompositionResult | null>(() => {
    if (activeOres.length < 2 || activeOres.length > 4) {
      return null;
    }
    const blacksmithRealm = propPlayer?.forgingArtisan?.level ?? propPlayer?.currentRealm ?? 0;
    const flameBonus = propPlayer?.flameState?.equippedFlameId
      ? (HEAVENLY_FLAMES_REGISTRY[propPlayer.flameState.equippedFlameId]?.baseVeinQualityBonus ?? 5)
      : 0;
    return calculateAlloyComposition(activeOres, blacksmithRealm, flameBonus);
  }, [activeOres, propPlayer?.forgingArtisan?.level, propPlayer?.currentRealm, propPlayer?.flameState?.equippedFlameId]);

  // Tên dự kiến sinh ra theo thời gian thực
  const predictedWeaponName = useMemo<string>(() => {
    if (customWeaponName.trim()) {
      return customWeaponName.trim();
    }
    if (!liveAlloyPreview) {
      return 'Thần Binh Phôi Thai';
    }
    return generateModularWeaponName(
      selectedArchetype,
      liveAlloyPreview.dominantElement,
      liveAlloyPreview.purityScore
    );
  }, [customWeaponName, liveAlloyPreview, selectedArchetype]);

  // Thông báo lỗi trực quan cho người chơi
  const validationError = useMemo<string | null>(() => {
    if (activeOres.length < 2) {
      return 'Cần tối thiểu 2 loại khoáng thạch để đúc hợp kim.';
    }
    if (activeOres.length > 4) {
      return 'Lò luyện kim chỉ chứa tối đa 4 loại khoáng thạch.';
    }
    for (const ore of activeOres) {
      if (!ore.weight || ore.weight <= 0) {
        return `Khối lượng quặng [${ore.oreName}] phải lớn hơn 0.`;
      }
    }
    if (propPlayer?.inventory?.ores) {
      for (const req of activeOres) {
        const owned = propPlayer.inventory.ores.find(o => o.id === req.oreId);
        const ownedQty = owned ? owned.quantity : 0;
        if (ownedQty < req.weight) {
          return `Kho không đủ số lượng [${req.oreName}] (cần ${req.weight}, có ${ownedQty}).`;
        }
      }
    }
    return null;
  }, [activeOres, propPlayer?.inventory?.ores]);

  const canForge = useMemo<boolean>(() => {
    return validationError === null && !isForging;
  }, [validationError, isForging]);

  // 3. Actions
  const handleSelectArchetype = useCallback((id: WeaponArchetypeId) => {
    setSelectedArchetype(id);
  }, []);

  const handleSetOreSlot = useCallback((slotIndex: number, ore: MetallurgyOreInput | null) => {
    if (slotIndex < 0 || slotIndex >= 4) return;
    setSelectedOreSlots(prev => {
      const next = [...prev];
      next[slotIndex] = ore;
      return next;
    });
  }, []);

  const handleClearSlots = useCallback(() => {
    setSelectedOreSlots([null, null, null, null]);
  }, []);

  const handleSetCustomWeaponName = useCallback((name: string) => {
    setCustomWeaponName(name);
  }, []);

  const handleResetLastForgedResult = useCallback(() => {
    setLastForgedResult(null);
  }, []);

  /**
   * Thực thi quá trình Đoán Cốt Hợp Kim:
   * - Atomic Guard: Kiểm tra tồn kho trước khi nung đúc.
   * - Trừ quặng chính xác và an toàn.
   * - Sinh thần binh và cập nhật PlayerState trong 1 lần set duy nhất.
   */
  const handleExecuteForging = useCallback(
    async (
      player: PlayerState,
      setPlayer: (p: PlayerState) => void,
      callbacks?: {
        showToast?: (msg: string) => void;
        addLog?: (title: string, msg: string, type: 'forging' | 'system' | 'danger') => void;
      }
    ) => {
      const activeToast = callbacks?.showToast ?? showToast;
      const activeAddLog = callbacks?.addLog ?? addLog;

      if (isForging) {
        activeToast?.('Lò luyện đang vận hành, xin chớ nóng vội!');
        return;
      }

      const oresToMelt = selectedOreSlots.filter((o): o is MetallurgyOreInput => o !== null);

      // Thẩm định số lượng quặng tối thiểu
      if (oresToMelt.length < 2 || oresToMelt.length > 4) {
        activeToast?.('Cần từ 2 đến 4 loại khoáng thạch để đúc hợp kim!');
        return;
      }

      // 1. Atomic Guard: Thẩm định lại tồn kho người chơi
      const inventoryOres = player.inventory?.ores || [];
      for (const req of oresToMelt) {
        const owned = inventoryOres.find(o => o.id === req.oreId);
        const ownedQty = owned ? owned.quantity : 0;
        if (ownedQty < req.weight) {
          const warnMsg = `Không đủ khoáng thạch [${req.oreName}]: yêu cầu ${req.weight}, trong kho hiện chỉ có ${ownedQty}!`;
          activeToast?.(warnMsg);
          activeAddLog?.('Luyện Khí Thất Bại', warnMsg, 'danger');
          return;
        }
      }

      // 2. Khấu trừ kho theo cơ chế Atomic Deduction
      let updatedOres: typeof inventoryOres;
      try {
        updatedOres = deductOresFromInventory(inventoryOres, oresToMelt).filter(o => o.quantity > 0);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        activeToast?.(errMsg);
        activeAddLog?.('Luyện Khí Thất Bại', errMsg, 'danger');
        return;
      }

      // 3. Tính toán hợp kim dựa trên cảnh giới thợ rèn và dị hỏa
      const blacksmithRealm = player.forgingArtisan?.level ?? player.currentRealm ?? 0;
      const flameBonus = player.flameState?.equippedFlameId
        ? (HEAVENLY_FLAMES_REGISTRY[player.flameState.equippedFlameId]?.baseVeinQualityBonus ?? 5)
        : 0;

      const alloyResult = calculateAlloyComposition(oresToMelt, blacksmithRealm, flameBonus);
      if (!alloyResult) {
        activeToast?.('Thành phần khoáng thạch không hợp lệ để tạo hợp kim!');
        return;
      }

      // 4. Kích hoạt Animation Lock & Âm thanh
      setIsForging(true);
      try {
        audioEngine.playSwordSlashSound(1.0, true);
      } catch {
        // Fallback âm thanh an toàn
      }

      // Đợi hiệu ứng nung lò rèn đúc cổ phong
      await new Promise(resolve => setTimeout(resolve, 600));

      // 5. Chế tác trang bị phôi khí hoàn chỉnh
      const newWeapon = craftModularEquipment({
        archetypeId: selectedArchetype,
        alloyComposition: alloyResult,
        baseStats: {
          atk: 120 + (player.currentRealm || 0) * 85,
          hp: 400 + (player.currentRealm || 0) * 160,
          def: 60 + (player.currentRealm || 0) * 35,
          speed: 40 + (player.currentRealm || 0) * 12
        },
        name: customWeaponName.trim() || undefined,
        blacksmithRealmIndex: blacksmithRealm,
        flameBonusPercent: flameBonus
      });

      // 6. Cập nhật Modular Metallurgy State & Lịch sử
      const currentModState: PlayerModularMetallurgyState = player.modularMetallurgyState ?? {
        craftedWeaponsCount: 0,
        unlockedArchetypes: ['phi_kiem', 'trong_kiem', 'bao_dinh', 'tran_ky'],
        metallurgyHistory: []
      };

      const newHistoryEntry = {
        weaponId: newWeapon.id,
        weaponName: newWeapon.name,
        archetypeId: selectedArchetype,
        dominantElement: alloyResult.dominantElement,
        purityScore: alloyResult.purityScore,
        craftedAt: Date.now()
      };

      const updatedModState: PlayerModularMetallurgyState = {
        craftedWeaponsCount: (currentModState.craftedWeaponsCount || 0) + 1,
        unlockedArchetypes: currentModState.unlockedArchetypes || ['phi_kiem', 'trong_kiem', 'bao_dinh', 'tran_ky'],
        metallurgyHistory: [newHistoryEntry, ...(currentModState.metallurgyHistory || [])].slice(0, 50)
      };

      // 7. Cập nhật kho đồ
      const currentEquips = player.inventory?.equipment || [];
      const updatedInventory = {
        ...player.inventory,
        pills: player.inventory?.pills || [],
        herbs: player.inventory?.herbs || [],
        ores: updatedOres,
        equipment: [...currentEquips, newWeapon]
      };

      // 8. Cập nhật PlayerState trong 1 lần duy nhất (Single State Transition)
      const updatedPlayer: PlayerState = {
        ...player,
        inventory: updatedInventory,
        modularMetallurgyState: updatedModState
      };

      setPlayer(normalizePlayerData(updatedPlayer));
      setLastForgedResult(newWeapon);
      setIsForging(false);

      const successMsg = `Đoán cốt hợp kim thành công! Thần binh xuất thế: [${newWeapon.name}] (${newWeapon.grade})!`;
      activeToast?.(successMsg);
      activeAddLog?.('Đoán Cốt Thần Binh', successMsg, 'forging');
    },
    [isForging, selectedOreSlots, selectedArchetype, customWeaponName, showToast, addLog]
  );

  return {
    selectedArchetype,
    selectedOreSlots,
    customWeaponName,
    isForging,
    lastForgedResult,
    activeOres,
    liveAlloyPreview,
    predictedWeaponName,
    validationError,
    canForge,
    handleSelectArchetype,
    handleSetOreSlot,
    handleClearSlots,
    handleSetCustomWeaponName,
    handleResetLastForgedResult,
    handleExecuteForging
  };
}
