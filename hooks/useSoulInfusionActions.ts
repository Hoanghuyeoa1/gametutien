// hooks/useSoulInfusionActions.ts
// Custom Hook điều phối State và Actions cho phân hệ "Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh"
// 100% Strict TypeScript, Immutable State, Atomic Validation & Deep Synchronization

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import {
  SoulVesselItem,
  InfusedSoulMetadata,
  SpiritEvolutionStage
} from '@/lib/types/soul-infusion';
import {
  SOUL_REGISTRY,
  canInfuseSoulIntoWeapon,
  applySoulInfusion,
  feedAndEvolveSpirit,
  getSpiritDialogue,
  createSoulVesselItem
} from '@/lib/soul-infusion-logic';
import { audioEngine } from '@/lib/audio-engine';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface InfusionFeedback {
  type: 'success' | 'error';
  message: string;
}

export interface SpiritDialogueBubble {
  text: string;
  spiritName: string;
}

export interface TargetEquipmentLocation {
  type: 'inventory' | 'equipment' | 'natalArtifact';
  key?: string; // Ví dụ: 'weapon', 'artifact' trong player.equipment
  index?: number; // Vị trí trong player.inventory.equipment mảng
  equipment: Equipment;
}

export interface UseSoulInfusionActionsProps {
  player?: PlayerState;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
}

export interface UseSoulInfusionActionsReturn {
  // 1. Hook State
  selectedWeaponId: string | null;
  selectedSoulItemId: string | null;
  isInfusing: boolean;
  spiritDialogueBubble: SpiritDialogueBubble | null;
  infusionFeedback: InfusionFeedback | null;

  // 2. Derived State & Helpers
  selectedWeapon: Equipment | null;
  selectedSoulItem: SoulVesselItem | null;
  canInfuseCheck: { canInfuse: boolean; reason?: string } | null;

  // 3. Actions
  handleSelectWeapon: (weaponId: string | null) => void;
  handleSelectSoulItem: (soulItemId: string | null) => void;
  handleClearFeedback: () => void;
  handleExecuteInfusion: (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ) => Promise<boolean>;
  handleFeedSpirit: (
    weaponId: string,
    materialItemId: string,
    amount: number,
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ) => Promise<boolean>;
  handleInteractWithSpirit: (weapon: Equipment) => void;
}

// Bảng chuyển đổi EXP vật phẩm bồi dưỡng Khí Linh
export const SPIRIT_FOOD_EXP_MAP: Record<string, number> = {
  hon_ngoc: 100,
  item_hon_ngoc: 100,
  than_niem_sa: 50,
  item_than_niem_sa: 50,
  hon_thach_cuc_pham: 500,
  item_hon_thach_cuc_pham: 500,
  linh_hon_tinh_hoa: 250,
  trung_pham_linh_thach: 50,
  default: 100
};

// ============================================================================
// PURE DATA HELPERS
// ============================================================================

/**
 * Tìm vị trí trang bị trong PlayerState (Túi đồ, Đang mặc, hoặc Bản Mệnh Pháp Bảo)
 */
export function findTargetEquipmentInPlayer(
  player: PlayerState,
  weaponId: string
): TargetEquipmentLocation | null {
  if (!player || !weaponId) return null;

  // 1. Quét trong player.inventory.equipment
  const invEquips = player.inventory?.equipment;
  if (Array.isArray(invEquips)) {
    const idx = invEquips.findIndex(e => e && e.id === weaponId);
    if (idx !== -1) {
      return { type: 'inventory', index: idx, equipment: invEquips[idx] };
    }
  }

  // 2. Quét trong player.inventory.equipments (legacy alias)
  const legacyInvEquips = player.inventory?.equipments;
  if (Array.isArray(legacyInvEquips)) {
    const idx = legacyInvEquips.findIndex(e => e && e.id === weaponId);
    if (idx !== -1) {
      return { type: 'inventory', index: idx, equipment: legacyInvEquips[idx] };
    }
  }

  // 3. Quét trong player.equipment (Record các món đang mặc trên người)
  if (player.equipment && typeof player.equipment === 'object') {
    for (const [slotKey, item] of Object.entries(player.equipment)) {
      if (item && item.id === weaponId) {
        return { type: 'equipment', key: slotKey, equipment: item };
      }
    }
  }

  // 4. Quét trong player.equippedItems (alias khác)
  if (player.equippedItems && typeof player.equippedItems === 'object') {
    for (const [slotKey, item] of Object.entries(player.equippedItems)) {
      if (item && item.id === weaponId) {
        return { type: 'equipment', key: slotKey, equipment: item };
      }
    }
  }

  // 5. Quét trong player.natalArtifact
  if (player.natalArtifact) {
    if (player.natalArtifact.id === weaponId || player.natalArtifact.baseEquipmentId === weaponId) {
      const eq = player.natalArtifact.baseEquipment || player.natalArtifact;
      return { type: 'natalArtifact', equipment: eq as Equipment };
    }
  }

  return null;
}

/**
 * Cập nhật trang bị vào PlayerState một cách bất biến (Immutable Deep Clone)
 */
export function updateTargetEquipmentInPlayer(
  player: PlayerState,
  location: TargetEquipmentLocation,
  updatedEquipment: Equipment
): PlayerState {
  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  if (location.type === 'inventory') {
    const currentEquips = cloned.inventory?.equipment || cloned.inventory?.equipments || [];
    const updatedEquips = currentEquips.map((item, idx) => {
      if (idx === location.index || (item && item.id === updatedEquipment.id)) {
        return { ...updatedEquipment };
      }
      return item;
    });

    if (cloned.inventory) {
      if (Array.isArray(cloned.inventory.equipment)) cloned.inventory.equipment = updatedEquips;
      if (Array.isArray(cloned.inventory.equipments)) cloned.inventory.equipments = updatedEquips;
    }
  } else if (location.type === 'equipment' && location.key) {
    const slotKey = location.key;
    if (cloned.equipment) {
      cloned.equipment[slotKey] = { ...updatedEquipment };
    }
    if (cloned.equippedItems) {
      cloned.equippedItems[slotKey] = { ...updatedEquipment };
    }
  } else if (location.type === 'natalArtifact') {
    if (cloned.natalArtifact) {
      cloned.natalArtifact.baseEquipment = { ...updatedEquipment };
      (cloned.natalArtifact as any).infusedSoul = updatedEquipment.infusedSoul;
    }
  }

  // Đồng bộ hai chiều nếu món đồ này cũng là baseEquipment của Bản Mệnh Pháp Bảo
  if (cloned.natalArtifact && (cloned.natalArtifact.baseEquipmentId === updatedEquipment.id || cloned.natalArtifact.id === updatedEquipment.id)) {
    cloned.natalArtifact.baseEquipment = { ...updatedEquipment };
    (cloned.natalArtifact as any).infusedSoul = updatedEquipment.infusedSoul;
  }

  // Đồng bộ hai chiều nếu món đồ này cũng đang được trang bị trên người
  if (cloned.equipment) {
    for (const [k, eq] of Object.entries(cloned.equipment)) {
      if (eq && eq.id === updatedEquipment.id) {
        cloned.equipment[k] = { ...updatedEquipment };
      }
    }
  }

  return cloned;
}

/**
 * Tìm vật phẩm Hồn Phách trong kho đồ hoặc kho thu hoạch của người chơi
 */
export function findSoulVesselInPlayer(
  player: PlayerState,
  soulIdentifier: string
): { source: 'inventory_items' | 'harvested_souls'; soulItem: SoulVesselItem; count: number; itemIndex?: number } | null {
  if (!player || !soulIdentifier) return null;

  // 1. Quét trong player.inventory.items
  const items = (player.inventory as any)?.items;
  if (Array.isArray(items)) {
    const idx = items.findIndex((it: any) =>
      it && (it.id === soulIdentifier || it.soulType === soulIdentifier || it.soulId === soulIdentifier)
    );
    if (idx !== -1) {
      const it = items[idx];
      const count = it.quantity || it.count || 1;
      const soulType = (it.soulType || it.id.replace('soul_', '').replace('_item', '')) as keyof typeof SOUL_REGISTRY;
      const baseSoul = SOUL_REGISTRY[soulType] || SOUL_REGISTRY.hac_giao;
      const vessel: SoulVesselItem = {
        ...baseSoul,
        ...it,
        soulType: baseSoul.soulType,
        quantity: count,
        count
      };
      return { source: 'inventory_items', soulItem: vessel, count, itemIndex: idx };
    }
  }

  // 2. Quét trong player.soulInfusionState.harvestedSouls
  const harvested = player.soulInfusionState?.harvestedSouls;
  if (harvested && typeof harvested === 'object') {
    for (const [key, count] of Object.entries(harvested)) {
      if (count > 0 && (key === soulIdentifier || key.includes(soulIdentifier) || soulIdentifier.includes(key))) {
        const soulType = (key.replace('soul_', '') as keyof typeof SOUL_REGISTRY);
        if (SOUL_REGISTRY[soulType]) {
          const vessel = createSoulVesselItem(soulType, count);
          return { source: 'harvested_souls', soulItem: vessel, count };
        }
      }
    }
  }

  // 3. Fallback: Nếu soulIdentifier là một SoulType trong SOUL_REGISTRY
  const matchingType = (Object.keys(SOUL_REGISTRY) as Array<keyof typeof SOUL_REGISTRY>).find(
    t => t === soulIdentifier || SOUL_REGISTRY[t].id === soulIdentifier
  );
  if (matchingType) {
    const vessel = createSoulVesselItem(matchingType, 1);
    // Kiểm tra xem trong harvestedSouls có không
    const harvestedCount = harvested?.[matchingType] || harvested?.[`soul_${matchingType}`] || 0;
    if (harvestedCount > 0) {
      return { source: 'harvested_souls', soulItem: vessel, count: harvestedCount };
    }
    // Nếu trong inventory.items có
    if (Array.isArray(items)) {
      const it = items.find((i: any) => i && (i.soulType === matchingType || i.id === `soul_${matchingType}`));
      if (it) {
        return { source: 'inventory_items', soulItem: vessel, count: it.quantity || it.count || 1 };
      }
    }
  }

  return null;
}

/**
 * Trừ đúng 1 Hồn Phách khỏi kho đồ của người chơi
 */
export function deductSoulVesselFromPlayer(
  player: PlayerState,
  soulIdentifier: string
): { updatedPlayer: PlayerState; deducted: boolean; soulItem?: SoulVesselItem } {
  const found = findSoulVesselInPlayer(player, soulIdentifier);
  if (!found || found.count <= 0) {
    return { updatedPlayer: player, deducted: false };
  }

  const updatedPlayer = JSON.parse(JSON.stringify(player)) as PlayerState;

  if (found.source === 'inventory_items' && typeof found.itemIndex === 'number') {
    const items = [...((updatedPlayer.inventory as any)?.items || [])];
    const currentItem = items[found.itemIndex];
    const newQty = (currentItem.quantity || currentItem.count || 1) - 1;
    if (newQty <= 0) {
      items.splice(found.itemIndex, 1);
    } else {
      items[found.itemIndex] = {
        ...currentItem,
        quantity: newQty,
        count: newQty
      };
    }
    (updatedPlayer.inventory as any).items = items;
  } else if (found.source === 'harvested_souls') {
    if (updatedPlayer.soulInfusionState?.harvestedSouls) {
      const soulKey = Object.keys(updatedPlayer.soulInfusionState.harvestedSouls).find(
        k => k === soulIdentifier || k === found.soulItem.soulType || k === `soul_${found.soulItem.soulType}`
      );
      if (soulKey && updatedPlayer.soulInfusionState.harvestedSouls[soulKey] > 0) {
        updatedPlayer.soulInfusionState.harvestedSouls[soulKey] -= 1;
        if (updatedPlayer.soulInfusionState.harvestedSouls[soulKey] <= 0) {
          delete updatedPlayer.soulInfusionState.harvestedSouls[soulKey];
        }
      }
    }
  }

  return { updatedPlayer, deducted: true, soulItem: found.soulItem };
}

/**
 * Khấu trừ vật phẩm nuôi dưỡng Khí Linh khỏi kho đồ
 */
export function deductNourishMaterialFromPlayer(
  player: PlayerState,
  materialItemId: string,
  amount: number
): { updatedPlayer: PlayerState; deducted: boolean; expGained: number; reason?: string } {
  const reqAmount = Math.max(1, amount);
  const updatedPlayer = JSON.parse(JSON.stringify(player)) as PlayerState;

  // 1. Kiểm tra trong inventory.items
  const items = (updatedPlayer.inventory as any)?.items;
  if (Array.isArray(items)) {
    const idx = items.findIndex((it: any) => it && (it.id === materialItemId || it.key === materialItemId));
    if (idx !== -1) {
      const currentQty = items[idx].quantity || items[idx].count || 0;
      if (currentQty >= reqAmount) {
        const newQty = currentQty - reqAmount;
        if (newQty <= 0) {
          items.splice(idx, 1);
        } else {
          items[idx].quantity = newQty;
          items[idx].count = newQty;
        }
        (updatedPlayer.inventory as any).items = items;
        const unitExp = SPIRIT_FOOD_EXP_MAP[materialItemId] || SPIRIT_FOOD_EXP_MAP.default;
        return { updatedPlayer, deducted: true, expGained: reqAmount * unitExp };
      }
    }
  }

  // 2. Kiểm tra trong inventory.ores
  const ores = updatedPlayer.inventory?.ores;
  if (Array.isArray(ores)) {
    const idx = ores.findIndex((o: any) => o && (o.id === materialItemId || o.name?.toLowerCase().includes('thạch')));
    if (idx !== -1) {
      const currentQty = ores[idx].quantity || (ores[idx] as any).count || 0;
      if (currentQty >= reqAmount) {
        const newQty = currentQty - reqAmount;
        if (newQty <= 0) {
          ores.splice(idx, 1);
        } else {
          ores[idx].quantity = newQty;
          (ores[idx] as any).count = newQty;
        }
        const unitExp = SPIRIT_FOOD_EXP_MAP[materialItemId] || 80;
        return { updatedPlayer, deducted: true, expGained: reqAmount * unitExp };
      }
    }
  }

  // 3. Kiểm tra Trung Phẩm Linh Thạch nếu dùng làm vật phẩm nuôi dưỡng
  if (materialItemId.includes('trung_pham') || materialItemId === 'trungPhamLinhThach') {
    const curLt = updatedPlayer.trungPhamLinhThach || 0;
    if (curLt >= reqAmount) {
      updatedPlayer.trungPhamLinhThach = curLt - reqAmount;
      return { updatedPlayer, deducted: true, expGained: reqAmount * 50 };
    }
  }

  return {
    updatedPlayer: player,
    deducted: false,
    expGained: 0,
    reason: `Tài nguyên [${materialItemId}] không đủ số lượng ${reqAmount} để ôn dưỡng!`
  };
}

// ============================================================================
// MAIN CUSTOM HOOK: useSoulInfusionActions
// ============================================================================

export function useSoulInfusionActions(
  props: UseSoulInfusionActionsProps = {}
): UseSoulInfusionActionsReturn {
  const { player, showToast, addLog } = props;

  // 1. Hook State
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [selectedSoulItemId, setSelectedSoulItemId] = useState<string | null>(null);
  const [isInfusing, setIsInfusing] = useState<boolean>(false);
  const [spiritDialogueBubble, setSpiritDialogueBubble] = useState<SpiritDialogueBubble | null>(null);
  const [infusionFeedback, setInfusionFeedback] = useState<InfusionFeedback | null>(null);

  const dialogueTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dọn dẹp timer khi component unmount
  useEffect(() => {
    return () => {
      if (dialogueTimerRef.current) {
        clearTimeout(dialogueTimerRef.current);
      }
    };
  }, []);

  // 2. Derived State: Tìm vũ khí và vật phẩm Hồn Phách đang được chọn
  const selectedWeapon = useMemo(() => {
    if (!player || !selectedWeaponId) return null;
    const found = findTargetEquipmentInPlayer(player, selectedWeaponId);
    return found ? found.equipment : null;
  }, [player, selectedWeaponId]);

  const selectedSoulItem = useMemo(() => {
    if (!player || !selectedSoulItemId) return null;
    const found = findSoulVesselInPlayer(player, selectedSoulItemId);
    return found ? found.soulItem : null;
  }, [player, selectedSoulItemId]);

  const canInfuseCheck = useMemo(() => {
    if (!player || !selectedWeapon || !selectedSoulItem) return null;
    return canInfuseSoulIntoWeapon(player.currentRealm || 0, selectedWeapon, selectedSoulItem);
  }, [player, selectedWeapon, selectedSoulItem]);

  // 3. Actions
  const handleSelectWeapon = useCallback((weaponId: string | null) => {
    setSelectedWeaponId(weaponId);
    setInfusionFeedback(null);
  }, []);

  const handleSelectSoulItem = useCallback((soulItemId: string | null) => {
    setSelectedSoulItemId(soulItemId);
    setInfusionFeedback(null);
  }, []);

  const handleClearFeedback = useCallback(() => {
    setInfusionFeedback(null);
  }, []);

  /**
   * Tương tác với Khí Linh: Hiển thị câu thoại nhàn rỗi trong 3.5 giây
   */
  const handleInteractWithSpirit = useCallback((weapon: Equipment) => {
    if (!weapon?.infusedSoul) return;

    try {
      audioEngine.playSFX('click');
    } catch {
      // Bỏ qua lỗi audio nếu chưa mở khóa
    }

    const dialogue = getSpiritDialogue(weapon.infusedSoul, 'onIdle');
    setSpiritDialogueBubble({
      text: dialogue,
      spiritName: weapon.infusedSoul.soulName || 'Khí Linh'
    });

    if (dialogueTimerRef.current) {
      clearTimeout(dialogueTimerRef.current);
    }

    dialogueTimerRef.current = setTimeout(() => {
      setSpiritDialogueBubble(null);
    }, 3500);
  }, []);

  /**
   * Thực hiện Tế Hồn / Phong Ấn Hồn Phách vào thần binh
   */
  const handleExecuteInfusion = useCallback(
    async (
      currentPlayer: PlayerState,
      setPlayer: (p: PlayerState) => void,
      callbacks?: {
        showToast?: (msg: string) => void;
        addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
      }
    ): Promise<boolean> => {
      const toastFn = callbacks?.showToast || showToast;
      const logFn = callbacks?.addLog || addLog;

      // 1. Chống click đúp / spam hành động
      if (isInfusing) return false;

      if (!selectedWeaponId) {
        const msg = 'Vui lòng chọn thần binh cần phong ấn Hồn Phách!';
        setInfusionFeedback({ type: 'error', message: msg });
        toastFn?.(msg);
        return false;
      }

      if (!selectedSoulItemId) {
        const msg = 'Vui lòng chọn Hồn Phách để tế luyện!';
        setInfusionFeedback({ type: 'error', message: msg });
        toastFn?.(msg);
        return false;
      }

      setIsInfusing(true);

      try {
        // 2. Tìm trang bị mục tiêu
        const equipLoc = findTargetEquipmentInPlayer(currentPlayer, selectedWeaponId);
        if (!equipLoc) {
          const msg = 'Không tìm thấy trang bị mục tiêu trong kho đồ hay trang bị!';
          setInfusionFeedback({ type: 'error', message: msg });
          toastFn?.(msg);
          setIsInfusing(false);
          return false;
        }

        // 3. Tìm và thẩm định Hồn Phách trong kho người chơi
        const soulFind = findSoulVesselInPlayer(currentPlayer, selectedSoulItemId);
        if (!soulFind || soulFind.count <= 0) {
          const msg = 'Hồn Phách đã chọn không còn trong túi đồ!';
          setInfusionFeedback({ type: 'error', message: msg });
          toastFn?.(msg);
          setIsInfusing(false);
          return false;
        }

        const soulItem = soulFind.soulItem;

        // 4. Atomic Validation: Kiểm tra cảnh giới và loại trang bị
        const check = canInfuseSoulIntoWeapon(currentPlayer.currentRealm || 0, equipLoc.equipment, soulItem);
        if (!check.canInfuse) {
          const msg = check.reason || 'Điều kiện phong ấn Hồn Phách không thỏa mãn!';
          setInfusionFeedback({ type: 'error', message: msg });
          toastFn?.(msg);
          logFn?.('Phong Hồn Thất Bại', msg, 'danger');
          setIsInfusing(false);
          return false;
        }

        // Giả lập độ trễ vi mô tế hồn tạo cảm giác chân thực
        await new Promise(resolve => setTimeout(resolve, 350));

        // 5. Khấu trừ đúng 1 Hồn Phách khỏi kho đồ
        const deductResult = deductSoulVesselFromPlayer(currentPlayer, selectedSoulItemId);
        if (!deductResult.deducted) {
          const msg = 'Khấu trừ Hồn Phách thất bại. Vui lòng kiểm tra lại túi đồ!';
          setInfusionFeedback({ type: 'error', message: msg });
          toastFn?.(msg);
          setIsInfusing(false);
          return false;
        }

        let nextPlayer = deductResult.updatedPlayer;

        // 6. Gọi applySoulInfusion (Soul Overwrite Guard & Deep Clone)
        const { updatedWeapon, oldSoulSalvaged } = applySoulInfusion(equipLoc.equipment, soulItem);

        // 7. Cập nhật vũ khí mới vào PlayerState
        nextPlayer = updateTargetEquipmentInPlayer(nextPlayer, equipLoc, updatedWeapon);

        // 8. Tăng chỉ số thống kê
        nextPlayer.soulInfusionState = nextPlayer.soulInfusionState || {
          harvestedSouls: {},
          totalInfusionsPerformed: 0,
          unlockedSpiritLore: []
        };
        nextPlayer.soulInfusionState.totalInfusionsPerformed =
          (nextPlayer.soulInfusionState.totalInfusionsPerformed || 0) + 1;
        nextPlayer.soulInfusionState.totalSoulsInfused =
          (nextPlayer.soulInfusionState.totalSoulsInfused || 0) + 1;

        // Thêm vào danh mục đã mở khóa
        if (!nextPlayer.soulInfusionState.unlockedSoulTypes) {
          nextPlayer.soulInfusionState.unlockedSoulTypes = [];
        }
        if (!nextPlayer.soulInfusionState.unlockedSoulTypes.includes(soulItem.soulType)) {
          nextPlayer.soulInfusionState.unlockedSoulTypes.push(soulItem.soulType);
        }

        // 9. Cập nhật PlayerState trong 1 lần gọi duy nhất (Atomic Dispatch)
        setPlayer(nextPlayer);

        try {
          audioEngine.playSFX('breakthrough');
        } catch {
          // Bỏ qua lỗi audio
        }

        const successMsg = oldSoulSalvaged
          ? `🔥 [TẾ HỒN THÀNH CÔNG] Đã ghi đè Hồn Phách cũ, phong ấn thành công 【${soulItem.name}】 vào 【${updatedWeapon.name}】! Khí Linh sơ khai đã thức tỉnh!`
          : `✨ [PHONG HỒN THÀNH CÔNG] Dẫn dắt chân hồn 【${soulItem.name}】 dung hợp vào 【${updatedWeapon.name}】! Khí Linh 【${updatedWeapon.infusedSoul?.soulName}】 chính thức xuất thế!`;

        setInfusionFeedback({ type: 'success', message: successMsg });
        toastFn?.(successMsg);
        logFn?.('Phong Hồn Đoạt Phách', successMsg, 'success');

        // Kích hoạt câu thoại chào mừng mở đầu
        if (updatedWeapon.infusedSoul) {
          const introDialogue = getSpiritDialogue(updatedWeapon.infusedSoul, 'onCombatStart');
          setSpiritDialogueBubble({
            text: introDialogue,
            spiritName: updatedWeapon.infusedSoul.soulName
          });
          if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
          dialogueTimerRef.current = setTimeout(() => setSpiritDialogueBubble(null), 3500);
        }

        setIsInfusing(false);
        return true;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setInfusionFeedback({ type: 'error', message: `Đã xảy ra lỗi: ${errorMsg}` });
        toastFn?.(`Lỗi phong hồn: ${errorMsg}`);
        setIsInfusing(false);
        return false;
      }
    },
    [isInfusing, selectedWeaponId, selectedSoulItemId, showToast, addLog]
  );

  /**
   * Dưỡng Linh: Cung cấp vật phẩm để bồi dưỡng EXP và kích hoạt tiến hóa cho Khí Linh
   */
  const handleFeedSpirit = useCallback(
    async (
      weaponId: string,
      materialItemId: string,
      amount: number,
      currentPlayer: PlayerState,
      setPlayer: (p: PlayerState) => void,
      callbacks?: {
        showToast?: (msg: string) => void;
        addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
      }
    ): Promise<boolean> => {
      const toastFn = callbacks?.showToast || showToast;
      const logFn = callbacks?.addLog || addLog;

      if (!weaponId) {
        const msg = 'Chưa chọn thần binh mang Khí Linh để bồi dưỡng!';
        setInfusionFeedback({ type: 'error', message: msg });
        toastFn?.(msg);
        return false;
      }

      const equipLoc = findTargetEquipmentInPlayer(currentPlayer, weaponId);
      if (!equipLoc || !equipLoc.equipment?.infusedSoul) {
        const msg = 'Trang bị mục tiêu chưa có Khí Linh phong ấn!';
        setInfusionFeedback({ type: 'error', message: msg });
        toastFn?.(msg);
        return false;
      }

      // 1. Khấu trừ vật phẩm nuôi dưỡng
      const deductRes = deductNourishMaterialFromPlayer(currentPlayer, materialItemId, amount);
      if (!deductRes.deducted) {
        const msg = deductRes.reason || 'Vật phẩm bồi dưỡng không đủ!';
        setInfusionFeedback({ type: 'error', message: msg });
        toastFn?.(msg);
        return false;
      }

      let nextPlayer = deductRes.updatedPlayer;

      // 2. Tính toán EXP và tiến hóa
      const currentSoul = equipLoc.equipment.infusedSoul;
      const oldStage = currentSoul.evolutionStage;
      const { updatedSoul, evolved } = feedAndEvolveSpirit(currentSoul, deductRes.expGained);

      // 3. Cập nhật Khí Linh mới vào trang bị
      const updatedWeapon: Equipment = {
        ...equipLoc.equipment,
        infusedSoul: updatedSoul
      };

      nextPlayer = updateTargetEquipmentInPlayer(nextPlayer, equipLoc, updatedWeapon);

      // Cập nhật thống kê nếu đạt Stage cao hơn
      if (nextPlayer.soulInfusionState) {
        const currentHighest = nextPlayer.soulInfusionState.highestStageReached || 1;
        if (updatedSoul.evolutionStage > currentHighest) {
          nextPlayer.soulInfusionState.highestStageReached = updatedSoul.evolutionStage;
        }
      }

      setPlayer(nextPlayer);

      try {
        audioEngine.playSFX(evolved ? 'breakthrough' : 'upgrade');
      } catch {
        // Bỏ qua lỗi audio
      }

      const feedbackMsg = evolved
        ? `🌟 [KHÍ LINH ĐỘT PHÁ • GIAI ĐOẠN ${updatedSoul.evolutionStage}] Nuốt ${amount}x vật phẩm nhận +${deductRes.expGained} EXP! 【${updatedSoul.soulName}】 đã thăng hoa lên Giai Đoạn ${updatedSoul.evolutionStage}! Uy lực thần thông khuếch đại vượt bậc!`
        : `✨ [DƯỠNG LINH] Khí Linh đã hấp thu linh khí nhận +${deductRes.expGained} EXP (${updatedSoul.spiritExp}/${updatedSoul.maxSpiritExp}).`;

      setInfusionFeedback({ type: 'success', message: feedbackMsg });
      toastFn?.(feedbackMsg);
      logFn?.('Dưỡng Linh Thần Binh', feedbackMsg, evolved ? 'success' : 'info');

      // Thoại cảm tạ của Khí Linh
      const thankQuote = getSpiritDialogue(updatedSoul, 'onIdle');
      setSpiritDialogueBubble({
        text: evolved ? `Hahaha! Bản tọa đã đột phá! Cảm tạ chủ nhân ban thưởng!` : thankQuote,
        spiritName: updatedSoul.soulName
      });
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
      dialogueTimerRef.current = setTimeout(() => setSpiritDialogueBubble(null), 3500);

      return true;
    },
    [showToast, addLog]
  );

  return {
    selectedWeaponId,
    selectedSoulItemId,
    isInfusing,
    spiritDialogueBubble,
    infusionFeedback,
    selectedWeapon,
    selectedSoulItem,
    canInfuseCheck,
    handleSelectWeapon,
    handleSelectSoulItem,
    handleClearFeedback,
    handleExecuteInfusion,
    handleFeedSpirit,
    handleInteractWithSpirit
  };
}
