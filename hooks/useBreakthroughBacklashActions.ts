// hooks/useBreakthroughBacklashActions.ts
// Custom Hook điều phối các trạng thái phản phệ, đan độc, chữa lành thương thế và tiêu trừ tâm ma
// 100% Strict TypeScript, Immutable State, Atomic Updates, Pure Functions

import { useState, useMemo, useCallback } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Realm } from '@/lib/types';
import {
  ToxicityModifierResult,
  PlayerInjuryState
} from '@/lib/types/breakthrough-backlash';
import {
  evaluateToxicityBreakthroughModifier,
  healPlayerInjury,
  dispelDemonicBottleneck
} from '@/lib/breakthrough-backlash-logic';
import { calculateEffectiveRequiredTuVi } from '@/lib/game-constants';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

export interface UseBreakthroughBacklashActionsProps {
  player?: PlayerState | null;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerState>> | ((p: PlayerState) => void);
  nextRealm?: Realm | null;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type?: any) => void;
}

export interface UseBreakthroughBacklashActionsReturn {
  // 1. Derived Values
  toxicityModifier: ToxicityModifierResult;
  isInjured: boolean;
  hasBottleneck: boolean;
  canBreakthrough: boolean;
  hasEnoughTuvi: boolean;
  hasEnoughStones: boolean;
  healingPillsInInventory: any[];
  dispelTalismansInInventory: any[];

  // 2. Action States
  isProcessing: boolean;
  lastActionMessage: string | null;

  // 3. Actions
  handleHealWithPill: (
    pillItemId: string,
    player?: PlayerState,
    setPlayer?: (p: PlayerState) => void
  ) => boolean;
  handleDispelBottleneck: (
    talismanItemId: string,
    player?: PlayerState,
    setPlayer?: (p: PlayerState) => void
  ) => boolean;
  clearActionMessage: () => void;
}

/**
 * Helper khấu trừ 1 vật phẩm khỏi inventory bất biến (Pure copy)
 */
export function deductItemFromInventory(
  inventory: any,
  itemId: string
): { updatedInventory: any; deductedItem: any | null } {
  if (!inventory) return { updatedInventory: inventory, deductedItem: null };

  const clonedInventory = { ...inventory };
  let deductedItem: any = null;

  // 1. Kiểm tra trong danh mục đan dược (pills)
  if (Array.isArray(clonedInventory.pills)) {
    const idx = clonedInventory.pills.findIndex(
      (p: any) => (p.id === itemId || p.itemId === itemId) && (p.quantity ?? p.count ?? 0) > 0
    );
    if (idx !== -1) {
      const target = clonedInventory.pills[idx];
      deductedItem = { ...target };
      const currentQty = target.quantity ?? target.count ?? 1;
      const newQty = currentQty - 1;
      const updatedPills = [...clonedInventory.pills];
      if (newQty <= 0) {
        updatedPills.splice(idx, 1);
      } else {
        updatedPills[idx] = { ...target, quantity: newQty, count: newQty };
      }
      clonedInventory.pills = updatedPills;
      return { updatedInventory: clonedInventory, deductedItem };
    }
  }

  // 2. Kiểm tra trong danh mục phù chú (talismans)
  if (Array.isArray(clonedInventory.talismans)) {
    const idx = clonedInventory.talismans.findIndex(
      (t: any) => (t.id === itemId || t.itemId === itemId) && (t.quantity ?? t.count ?? 0) > 0
    );
    if (idx !== -1) {
      const target = clonedInventory.talismans[idx];
      deductedItem = { ...target };
      const currentQty = target.quantity ?? target.count ?? 1;
      const newQty = currentQty - 1;
      const updatedTalismans = [...clonedInventory.talismans];
      if (newQty <= 0) {
        updatedTalismans.splice(idx, 1);
      } else {
        updatedTalismans[idx] = { ...target, quantity: newQty, count: newQty };
      }
      clonedInventory.talismans = updatedTalismans;
      return { updatedInventory: clonedInventory, deductedItem };
    }
  }

  // 3. Kiểm tra danh mục vật phẩm thông thường (items)
  if (Array.isArray(clonedInventory.items)) {
    const idx = clonedInventory.items.findIndex(
      (i: any) => (i.id === itemId || i.itemId === itemId) && (i.quantity ?? i.count ?? 0) > 0
    );
    if (idx !== -1) {
      const target = clonedInventory.items[idx];
      deductedItem = { ...target };
      const currentQty = target.quantity ?? target.count ?? 1;
      const newQty = currentQty - 1;
      const updatedItems = [...clonedInventory.items];
      if (newQty <= 0) {
        updatedItems.splice(idx, 1);
      } else {
        updatedItems[idx] = { ...target, quantity: newQty, count: newQty };
      }
      clonedInventory.items = updatedItems;
      return { updatedInventory: clonedInventory, deductedItem };
    }
  }

  return { updatedInventory: inventory, deductedItem: null };
}

export function useBreakthroughBacklashActions(
  propsOrPlayer?: UseBreakthroughBacklashActionsProps | PlayerState | null,
  setPlayerFn?: (p: PlayerState) => void,
  nextRealmArg?: Realm | null
): UseBreakthroughBacklashActionsReturn {
  // Chuẩn hóa props truyền vào
  const isDirectPlayer = Boolean(propsOrPlayer && ('currentRealm' in propsOrPlayer || 'tuVi' in propsOrPlayer));

  const activePlayer = isDirectPlayer
    ? (propsOrPlayer as PlayerState)
    : (propsOrPlayer as UseBreakthroughBacklashActionsProps)?.player ?? null;

  const activeSetPlayer = isDirectPlayer
    ? setPlayerFn
    : (propsOrPlayer as UseBreakthroughBacklashActionsProps)?.setPlayer;

  const explicitNextRealm = isDirectPlayer
    ? nextRealmArg
    : (propsOrPlayer as UseBreakthroughBacklashActionsProps)?.nextRealm ?? null;

  const showToast = isDirectPlayer ? undefined : (propsOrPlayer as UseBreakthroughBacklashActionsProps)?.showToast;
  const addLog = isDirectPlayer ? undefined : (propsOrPlayer as UseBreakthroughBacklashActionsProps)?.addLog;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // --- 1. DERIVED VALUES ---

  // Thẩm định tác động đan độc
  const toxicity =
    (activePlayer as any)?.pillToxicity ??
    (activePlayer as any)?.danDoc ??
    (activePlayer as any)?.toxicity ??
    0;

  const toxicityModifier: ToxicityModifierResult = useMemo(() => {
    return evaluateToxicityBreakthroughModifier(toxicity);
  }, [toxicity]);

  // Trạng thái thương thế
  const isInjured: boolean = Boolean(activePlayer?.injuryState?.isInjured ?? false);

  // Trạng thái Bình Cảnh Tâm Ma
  const hasBottleneck: boolean = Boolean(activePlayer?.injuryState?.hasDemonicBottleneck ?? false);

  // Cảnh giới kế tiếp tự suy ra nếu không truyền vào
  const targetNextRealm = useMemo(() => {
    if (explicitNextRealm) return explicitNextRealm;
    if (!activePlayer) return null;
    const currentIdx = Math.max(0, parseInt(String(activePlayer.currentRealm ?? 0), 10) || 0);
    const nextIdx = currentIdx + 1;
    return nextIdx < realmsData.length ? realmsData[nextIdx] : null;
  }, [explicitNextRealm, activePlayer]);

  // Điều kiện đủ tu vi & linh thạch
  const hasEnoughTuvi: boolean = useMemo(() => {
    if (!activePlayer || !targetNextRealm) return false;
    const requiredTuvi = calculateEffectiveRequiredTuVi(activePlayer, targetNextRealm);
    return activePlayer.tuVi >= requiredTuvi;
  }, [activePlayer, targetNextRealm]);

  const hasEnoughStones: boolean = useMemo(() => {
    if (!activePlayer || !targetNextRealm) return false;
    const requiredStones = targetNextRealm.requirements?.linhThach || 0;
    return activePlayer.linhThach >= requiredStones;
  }, [activePlayer, targetNextRealm]);

  // Điều kiện cho phép đột phá: !isInjured && hasEnoughTuvi && hasEnoughStones
  const canBreakthrough: boolean = Boolean(!isInjured && hasEnoughTuvi && hasEnoughStones);

  // Lọc các đan dược trị thương trong kho đồ
  const healingPillsInInventory = useMemo(() => {
    if (!activePlayer?.inventory) return [];
    const pills = activePlayer.inventory.pills || [];
    const otherItems = (activePlayer.inventory as any).items || [];
    const allCandidates = [...pills, ...otherItems];

    return allCandidates.filter((p: any) => {
      if (!p || (typeof p.quantity === 'number' && p.quantity <= 0)) return false;
      const id = p.id || p.itemId || '';
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      return (
        id === 'item_dai_hoan_dan' ||
        id === 'item_tuc_menh_hoan' ||
        id.includes('dai_hoan') ||
        id.includes('tuc_menh') ||
        p.effectType === 'heal' ||
        p.effectType === 'cure_injury' ||
        p.effectType === 'tri_thuong' ||
        name.includes('đại hoàn') ||
        name.includes('tục mệnh') ||
        name.includes('trị thương') ||
        name.includes('hồi phục') ||
        desc.includes('trị thương') ||
        desc.includes('chữa lành')
      );
    });
  }, [activePlayer?.inventory]);

  // Lọc các phù chú / đan dược định thần, thanh tâm tiêu trừ tâm ma
  const dispelTalismansInInventory = useMemo(() => {
    if (!activePlayer?.inventory) return [];
    const talismans = (activePlayer.inventory as any).talismans || [];
    const pills = activePlayer.inventory.pills || [];
    const otherItems = (activePlayer.inventory as any).items || [];
    const allCandidates = [...talismans, ...pills, ...otherItems];

    return allCandidates.filter((item: any) => {
      if (!item || (typeof item.quantity === 'number' && item.quantity <= 0)) return false;
      const id = item.id || item.itemId || '';
      const name = (item.name || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      return (
        id === 'item_thanh_tam_phu' ||
        id === 'item_dinh_than_dan' ||
        id === 'item_dinh_tam_phu' ||
        id.includes('thanh_tam') ||
        id.includes('dinh_than') ||
        id.includes('dinh_tam') ||
        item.effectType === 'cleanse_inner_demon' ||
        item.effectType === 'dispel_bottleneck' ||
        item.effectType === 'tieu_tam_ma' ||
        name.includes('thanh tâm') ||
        name.includes('định thần') ||
        name.includes('định tâm') ||
        desc.includes('tâm ma') ||
        desc.includes('bình cảnh') ||
        desc.includes('định thần')
      );
    });
  }, [activePlayer?.inventory]);

  // --- 2. ACTIONS ---

  /**
   * Phục dụng đan dược trị thương, xóa bỏ trạng thái Trọng Thương và hồi phục Khí Huyết
   */
  const handleHealWithPill = useCallback(
    (
      pillItemId: string,
      overridePlayer?: PlayerState,
      overrideSetPlayer?: (p: PlayerState) => void
    ): boolean => {
      const targetPlayer = overridePlayer || activePlayer;
      const targetSetPlayer = overrideSetPlayer || activeSetPlayer;

      if (!targetPlayer || !targetSetPlayer) {
        return false;
      }

      setIsProcessing(true);

      try {
        // 1. Kiểm tra tồn kho và khấu trừ 1 viên đan trị thương
        const { updatedInventory, deductedItem } = deductItemFromInventory(
          targetPlayer.inventory,
          pillItemId
        );

        if (!deductedItem) {
          const errMsg = 'Không tìm thấy đan dược trị thương phù hợp trong túi trữ vật!';
          setLastActionMessage(errMsg);
          showToast?.(errMsg);
          return false;
        }

        // 2. Chữa lành thương thế (Pure Function)
        const newInjuryState = healPlayerInjury(targetPlayer.injuryState);

        // 3. Hồi phục máu
        const maxHp = targetPlayer.maxKhiHuyet || 1000;
        const healAmount = deductedItem.effectValue || Math.round(maxHp * 0.5);
        const newHp = Math.min(maxHp, (targetPlayer.khiHuyet || 0) + healAmount);

        // 4. Cập nhật PlayerState trong 1 lần setPlayer duy nhất
        const updatedPlayer: PlayerState = {
          ...targetPlayer,
          inventory: updatedInventory,
          injuryState: newInjuryState,
          khiHuyet: newHp
        };

        targetSetPlayer(updatedPlayer);

        const msg = `Đã phục dụng [${deductedItem.name || 'Đan Dược'}]! Kinh mạch được chữa lành, hồi phục ${healAmount.toLocaleString()} Khí Huyết.`;
        setLastActionMessage(msg);
        showToast?.(msg);
        addLog?.('Trị Thương Khí Hải', msg, 'success');

        return true;
      } finally {
        setIsProcessing(false);
      }
    },
    [activePlayer, activeSetPlayer, showToast, addLog]
  );

  /**
   * Kích hoạt phù chú thanh tâm định thần, tiêu trừ Bình Cảnh Tâm Ma
   */
  const handleDispelBottleneck = useCallback(
    (
      talismanItemId: string,
      overridePlayer?: PlayerState,
      overrideSetPlayer?: (p: PlayerState) => void
    ): boolean => {
      const targetPlayer = overridePlayer || activePlayer;
      const targetSetPlayer = overrideSetPlayer || activeSetPlayer;

      if (!targetPlayer || !targetSetPlayer) {
        return false;
      }

      setIsProcessing(true);

      try {
        // 1. Kiểm tra tồn kho và khấu trừ 1 phù chú
        const { updatedInventory, deductedItem } = deductItemFromInventory(
          targetPlayer.inventory,
          talismanItemId
        );

        if (!deductedItem) {
          const errMsg = 'Không tìm thấy phù chú thanh tâm phù hợp trong túi trữ vật!';
          setLastActionMessage(errMsg);
          showToast?.(errMsg);
          return false;
        }

        // 2. Tiêu trừ bình cảnh tâm ma (Pure Function)
        const newInjuryState = dispelDemonicBottleneck(targetPlayer.injuryState);

        // 3. Cập nhật PlayerState trong 1 lần setPlayer duy nhất
        const updatedPlayer: PlayerState = {
          ...targetPlayer,
          inventory: updatedInventory,
          injuryState: newInjuryState
        };

        targetSetPlayer(updatedPlayer);

        const msg = `Đã sử dụng [${deductedItem.name || 'Phù Chú'}]! Bình Cảnh Tâm Ma đã tiêu tan, tâm cảnh thông suốt!`;
        setLastActionMessage(msg);
        showToast?.(msg);
        addLog?.('Thanh Tâm Định Thần', msg, 'success');

        return true;
      } finally {
        setIsProcessing(false);
      }
    },
    [activePlayer, activeSetPlayer, showToast, addLog]
  );

  const clearActionMessage = useCallback(() => {
    setLastActionMessage(null);
  }, []);

  return {
    toxicityModifier,
    isInjured,
    hasBottleneck,
    canBreakthrough,
    hasEnoughTuvi,
    hasEnoughStones,
    healingPillsInInventory,
    dispelTalismansInInventory,
    isProcessing,
    lastActionMessage,
    handleHealWithPill,
    handleDispelBottleneck,
    clearActionMessage
  };
}
