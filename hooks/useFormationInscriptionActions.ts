// hooks/useFormationInscriptionActions.ts
// Custom Hook điều phối toàn bộ State và Actions cho tính năng Minh Khắc Trận Văn & Mạch Dẫn Linh
// 100% Strict TypeScript, Immutable State, Atomic Guard, Clean Architecture

import { useState, useCallback, useMemo } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import {
  InscriptionConduitSlot,
  FormationInscriptionMaterial
} from '@/lib/types/formation-inscription';
import {
  FORMATION_INSCRIPTIONS_REGISTRY,
  validateInscriptionRequirements,
  inscribeFormationToWeapon,
  cleanseWeaponConduit,
  deductInscriptionMaterials
} from '@/lib/formation-inscription-logic';
import { normalizePlayerData } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface InscriptionFeedback {
  type: 'success' | 'error';
  message: string;
}

export interface EquipmentLocation {
  type: 'inventory' | 'equipment';
  key?: string; // Ví dụ: 'weapon', 'artifact' trong player.equipment
  index?: number; // Vị trí trong player.inventory.equipment mảng
  equipment: Equipment;
}

export interface UseFormationInscriptionActionsProps {
  player?: PlayerState;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
}

export interface UseFormationInscriptionActionsReturn {
  // 1. Hook State
  selectedEquipmentId: string | null;
  selectedSlotIndex: number | null;
  isProcessing: boolean;
  inscriptionFeedback: InscriptionFeedback | null;

  // 2. Helpers / Derived State
  selectedEquipment: Equipment | null;
  selectedConduit: InscriptionConduitSlot | null;

  // 3. Actions
  handleSelectEquipment: (equipmentId: string | null) => void;
  handleSelectSlot: (slotIndex: number | null) => void;
  handleClearFeedback: () => void;
  handleInscribe: (
    formationId: string,
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ) => Promise<boolean>;
  handleCleanse: (
    slotIndex: number,
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ) => Promise<boolean>;
}

/**
 * Tìm vị trí trang bị trong PlayerState (Túi đồ hoặc Đang mặc trên người)
 */
export function findEquipmentInPlayer(player: PlayerState, equipmentId: string): EquipmentLocation | null {
  if (!player || !equipmentId) return null;

  // 1. Quét trong player.inventory.equipment
  const invEquips = player.inventory?.equipment;
  if (Array.isArray(invEquips)) {
    const idx = invEquips.findIndex(e => e && e.id === equipmentId);
    if (idx !== -1) {
      return { type: 'inventory', index: idx, equipment: invEquips[idx] };
    }
  }

  // 2. Quét trong player.inventory.equipments (legacy alias)
  const legacyInvEquips = player.inventory?.equipments;
  if (Array.isArray(legacyInvEquips)) {
    const idx = legacyInvEquips.findIndex(e => e && e.id === equipmentId);
    if (idx !== -1) {
      return { type: 'inventory', index: idx, equipment: legacyInvEquips[idx] };
    }
  }

  // 3. Quét trong player.equipment (Record các món đang mặc trên người)
  if (player.equipment && typeof player.equipment === 'object') {
    for (const [slotKey, item] of Object.entries(player.equipment)) {
      if (item && item.id === equipmentId) {
        return { type: 'equipment', key: slotKey, equipment: item };
      }
    }
  }

  // 4. Quét trong player.equippedItems (alias khác)
  if (player.equippedItems && typeof player.equippedItems === 'object') {
    for (const [slotKey, item] of Object.entries(player.equippedItems)) {
      if (item && item.id === equipmentId) {
        return { type: 'equipment', key: slotKey, equipment: item };
      }
    }
  }

  return null;
}

/**
 * Cập nhật trang bị vào PlayerState một cách bất biến (Immutable Deep Copy)
 */
export function updateEquipmentInPlayer(
  player: PlayerState,
  location: EquipmentLocation,
  updatedEquipment: Equipment
): PlayerState {
  const updatedPlayer: PlayerState = { ...player };

  if (location.type === 'inventory') {
    const currentEquips = player.inventory?.equipment || [];
    const updatedEquips = currentEquips.map((item, idx) => {
      if (idx === location.index || (item && item.id === updatedEquipment.id)) {
        return { ...updatedEquipment };
      }
      return item;
    });

    updatedPlayer.inventory = {
      ...player.inventory,
      pills: player.inventory?.pills || [],
      herbs: player.inventory?.herbs || [],
      ores: player.inventory?.ores || [],
      equipment: updatedEquips
    };
  } else if (location.type === 'equipment' && location.key) {
    const slotKey = location.key;
    updatedPlayer.equipment = {
      ...(player.equipment || {}),
      [slotKey]: { ...updatedEquipment }
    };

    if (player.equippedItems) {
      updatedPlayer.equippedItems = {
        ...player.equippedItems,
        [slotKey]: { ...updatedEquipment }
      };
    }
  }

  return updatedPlayer;
}

/**
 * Thu thập danh sách vật phẩm trong kho đồ phục vụ việc kiểm tra và khấu trừ nguyên liệu
 */
export function extractFlatInventory(inventory: any): any[] {
  if (!inventory) return [];
  if (Array.isArray(inventory)) return inventory;

  const items: any[] = [];
  const keys = Object.keys(inventory).filter(k => k !== 'equipment' && k !== 'equipments');
  for (const k of keys) {
    const val = inventory[k];
    if (Array.isArray(val)) {
      items.push(...val);
    }
  }
  return items;
}

/**
 * Khấu trừ nguyên liệu một cách bất biến từ player.inventory
 */
export function deductMaterialsFromPlayerInventory(
  inventory: any,
  requiredMaterials: FormationInscriptionMaterial[]
): any {
  if (!inventory) return inventory;

  // Trường hợp inventory là mảng phẳng (như trong các mock test)
  if (Array.isArray(inventory)) {
    return deductInscriptionMaterials(inventory, requiredMaterials);
  }

  // Trường hợp inventory là đối tượng InventoryBag với các mảng con
  const invCopy = { ...inventory };
  const keys = Object.keys(invCopy).filter(k => k !== 'equipment' && k !== 'equipments');

  const remainingNeeded = new Map<string, number>();
  for (const mat of requiredMaterials) {
    remainingNeeded.set(mat.id, mat.quantity);
  }

  for (const k of keys) {
    if (Array.isArray(invCopy[k])) {
      invCopy[k] = invCopy[k].map((item: any) => {
        if (!item) return item;
        const itemId = item.id || item.itemId;
        const needed = remainingNeeded.get(itemId) ?? (item.name ? remainingNeeded.get(item.name) : undefined);
        if (!needed || needed <= 0) {
          return item;
        }

        const currentQty = typeof item.quantity === 'number'
          ? item.quantity
          : (typeof item.count === 'number' ? item.count : 1);

        const take = Math.min(currentQty, needed);
        remainingNeeded.set(itemId, needed - take);
        if (item.name) {
          remainingNeeded.set(item.name, (remainingNeeded.get(item.name) ?? needed) - take);
        }

        const nextQty = currentQty - take;
        return {
          ...item,
          quantity: nextQty,
          count: nextQty
        };
      }).filter((item: any) => {
        const q = typeof item.quantity === 'number' ? item.quantity : (typeof item.count === 'number' ? item.count : 1);
        return q > 0;
      });
    }
  }

  return invCopy;
}

/**
 * Trừ 1 lần Tẩy Thần Thủy (Ưu tiên trừ ở player.inscriptionState.cleansingWaterCount, sau đó trừ vật phẩm kho nếu có)
 */
export function deductCleansingWater(player: PlayerState): {
  success: boolean;
  updatedPlayer: PlayerState;
  error?: string;
} {
  const currentCount = player.inscriptionState?.cleansingWaterCount ?? 0;

  // 1. Ưu tiên trừ từ player.inscriptionState.cleansingWaterCount
  if (currentCount > 0) {
    const updatedState = {
      ...(player.inscriptionState || {
        totalInscribedCount: 0,
        unlockedInscriptions: ['tu_khi_tran', 'phong_nhan_tran'],
        cleansingWaterCount: 5
      }),
      cleansingWaterCount: currentCount - 1
    };
    return {
      success: true,
      updatedPlayer: {
        ...player,
        inscriptionState: updatedState
      }
    };
  }

  // 2. Nếu điểm trực tiếp bằng 0, tìm vật phẩm 'tay_than_thuy' hoặc 'Tẩy Thần Thủy' trong kho đồ
  const flatInv = extractFlatInventory(player.inventory);
  const waterItem = flatInv.find(i => i && (i.id === 'tay_than_thuy' || i.name === 'Tẩy Thần Thủy'));
  const waterQty = waterItem ? (typeof waterItem.quantity === 'number' ? waterItem.quantity : (waterItem.count || 1)) : 0;

  if (waterQty > 0) {
    const updatedInventory = deductMaterialsFromPlayerInventory(player.inventory, [
      { id: waterItem.id || 'tay_than_thuy', name: waterItem.name || 'Tẩy Thần Thủy', quantity: 1 }
    ]);
    return {
      success: true,
      updatedPlayer: {
        ...player,
        inventory: updatedInventory
      }
    };
  }

  return {
    success: false,
    updatedPlayer: player,
    error: 'Không đủ Tẩy Thần Thủy để tẩy luyện! Cần tối thiểu 1 bình Tẩy Thần Thủy.'
  };
}

/**
 * Main Custom Hook: useFormationInscriptionActions
 */
export function useFormationInscriptionActions(
  props?: UseFormationInscriptionActionsProps
): UseFormationInscriptionActionsReturn {
  const { player: propPlayer, showToast, addLog } = props || {};

  // 1. Hook State
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inscriptionFeedback, setInscriptionFeedback] = useState<InscriptionFeedback | null>(null);

  // 2. Derived State
  const selectedEquipment = useMemo<Equipment | null>(() => {
    if (!selectedEquipmentId || !propPlayer) return null;
    const loc = findEquipmentInPlayer(propPlayer, selectedEquipmentId);
    return loc ? loc.equipment : null;
  }, [selectedEquipmentId, propPlayer]);

  const selectedConduit = useMemo<InscriptionConduitSlot | null>(() => {
    if (!selectedEquipment || selectedSlotIndex === null) return null;
    const conduits = selectedEquipment.inscriptionData?.conduits;
    if (!Array.isArray(conduits)) return null;
    return conduits.find(c => c.slotIndex === selectedSlotIndex) || null;
  }, [selectedEquipment, selectedSlotIndex]);

  // 3. Selection Handlers
  const handleSelectEquipment = useCallback((equipmentId: string | null) => {
    setSelectedEquipmentId(equipmentId);
    setSelectedSlotIndex(null);
    setInscriptionFeedback(null);
  }, []);

  const handleSelectSlot = useCallback((slotIndex: number | null) => {
    setSelectedSlotIndex(slotIndex);
    setInscriptionFeedback(null);
  }, []);

  const handleClearFeedback = useCallback(() => {
    setInscriptionFeedback(null);
  }, []);

  // 4. Inscribe Action
  const handleInscribe = useCallback(
    async (
      formationId: string,
      player: PlayerState,
      setPlayer: (p: PlayerState) => void,
      callbacks?: {
        showToast?: (msg: string) => void;
        addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
      }
    ): Promise<boolean> => {
      const activeToast = callbacks?.showToast ?? showToast;
      const activeAddLog = callbacks?.addLog ?? addLog;

      if (isProcessing) {
        activeToast?.('Đang tập trung tâm thần khắc trận, xin chớ gấp gáp!');
        return false;
      }

      // Kiểm tra trang bị mục tiêu
      if (!selectedEquipmentId) {
        const msg = 'Vui lòng chọn trang bị hoặc pháp bảo cần minh khắc trận văn!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Kiểm tra slot mục tiêu
      if (selectedSlotIndex === null || selectedSlotIndex === undefined || selectedSlotIndex < 0) {
        const msg = 'Vui lòng chọn Mạch Dẫn Linh (slot) trên trang bị để khắc trận văn!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Tìm vị trí trang bị trong nhân vật
      const location = findEquipmentInPlayer(player, selectedEquipmentId);
      if (!location) {
        const msg = 'Không tìm thấy trang bị mục tiêu trong kho đồ hoặc trên người tu sĩ!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      const targetEquipment = location.equipment;

      // Chuẩn hóa an toàn inscriptionData nếu trang bị chưa có
      const conduits = targetEquipment.inscriptionData?.conduits;
      if (!conduits || !Array.isArray(conduits) || conduits.length === 0) {
        const msg = 'Trang bị này chưa được khai thông Mạch Dẫn Linh!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Kiểm tra slot mục tiêu
      const targetSlot = conduits.find(c => c.slotIndex === selectedSlotIndex);
      if (!targetSlot) {
        const msg = `Không tìm thấy Mạch Dẫn Linh số ${selectedSlotIndex + 1}!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      if (!targetSlot.isUnlocked) {
        const msg = `Mạch Dẫn Linh số ${selectedSlotIndex + 1} hiện đang bị phong ấn!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      if (targetSlot.inscribedFormationId) {
        const msg = `Mạch Dẫn Linh số ${selectedSlotIndex + 1} đã có trận văn. Hãy dùng Tẩy Thần Thủy tẩy luyện trước khi khắc mới!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Kiểm tra cấu hình trận đồ trong Registry
      const formation = FORMATION_INSCRIPTIONS_REGISTRY[formationId];
      if (!formation) {
        const msg = `Trận đồ [${formationId}] không tồn tại trong điển tịch tông môn!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Atomic Validation: Thần Thức & Kho Nguyên Liệu & Anti-Duplicate
      const divineSense = player.thanThuc ?? (player as any).divineSense ?? 0;
      const flatInventory = extractFlatInventory(player.inventory);

      const validation = validateInscriptionRequirements(
        divineSense,
        flatInventory,
        formation,
        conduits
      );

      if (!validation.valid) {
        const msg = validation.reason || 'Điều kiện minh khắc trận văn không thỏa mãn!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        activeAddLog?.('Minh Khắc Thất Bại', msg, 'danger');
        return false;
      }

      // Bắt đầu quá trình khắc (Lock chống spam)
      setIsProcessing(true);

      try {
        try {
          audioEngine.playSwordSlashSound(0.8, true);
        } catch {
          // Fallback âm thanh
        }

        // Mô phỏng nhẹ thời gian truyền linh khắc phù
        await new Promise(resolve => setTimeout(resolve, 300));

        // Khấu trừ nguyên liệu an toàn
        const updatedInventory = deductMaterialsFromPlayerInventory(
          player.inventory,
          formation.requiredMaterials
        );

        // Minh khắc trận văn vào metadata trang bị
        const updatedMetadata = inscribeFormationToWeapon(
          targetEquipment.inscriptionData!,
          selectedSlotIndex,
          formation,
          Date.now()
        );

        const updatedEquipment: Equipment = {
          ...targetEquipment,
          inscriptionData: updatedMetadata
        };

        // Cập nhật trang bị vào PlayerState
        let updatedPlayer = updateEquipmentInPlayer(player, location, updatedEquipment);
        updatedPlayer.inventory = updatedInventory;

        // Tăng totalInscribedCount trong player.inscriptionState
        const currentInsState = updatedPlayer.inscriptionState ?? {
          totalInscribedCount: 0,
          unlockedInscriptions: ['tu_khi_tran', 'phong_nhan_tran'],
          cleansingWaterCount: 5
        };

        updatedPlayer = {
          ...updatedPlayer,
          inscriptionState: {
            ...currentInsState,
            totalInscribedCount: (currentInsState.totalInscribedCount || 0) + 1
          }
        };

        // Single State Transition: Cập nhật duy nhất 1 lần để bảo đảm tính nguyên tử
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);

        const successMsg = `Minh khắc thành công [${formation.name}] vào Mạch Dẫn Linh số ${selectedSlotIndex + 1} của [${targetEquipment.name}]!`;
        setInscriptionFeedback({ type: 'success', message: successMsg });
        activeToast?.(successMsg);
        activeAddLog?.('Minh Khắc Trận Văn', successMsg, 'success');

        setIsProcessing(false);
        return true;
      } catch (err: unknown) {
        setIsProcessing(false);
        const errMsg = err instanceof Error ? err.message : String(err);
        setInscriptionFeedback({ type: 'error', message: errMsg });
        activeToast?.(errMsg);
        activeAddLog?.('Minh Khắc Thất Bại', errMsg, 'danger');
        return false;
      }
    },
    [isProcessing, selectedEquipmentId, selectedSlotIndex, showToast, addLog]
  );

  // 5. Cleanse Action
  const handleCleanse = useCallback(
    async (
      slotIndex: number,
      player: PlayerState,
      setPlayer: (p: PlayerState) => void,
      callbacks?: {
        showToast?: (msg: string) => void;
        addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
      }
    ): Promise<boolean> => {
      const activeToast = callbacks?.showToast ?? showToast;
      const activeAddLog = callbacks?.addLog ?? addLog;

      if (isProcessing) {
        activeToast?.('Đang vận chuyển chân khí, xin chớ gấp gáp!');
        return false;
      }

      // Kiểm tra trang bị mục tiêu
      if (!selectedEquipmentId) {
        const msg = 'Vui lòng chọn trang bị cần tẩy luyện Mạch Dẫn Linh!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Tìm vị trí trang bị
      const location = findEquipmentInPlayer(player, selectedEquipmentId);
      if (!location) {
        const msg = 'Không tìm thấy trang bị mục tiêu trong kho đồ hoặc trên người!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      const targetEquipment = location.equipment;
      const conduits = targetEquipment.inscriptionData?.conduits;
      if (!conduits || !Array.isArray(conduits)) {
        const msg = 'Trang bị này chưa có Mạch Dẫn Linh!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      const targetSlot = conduits.find(c => c.slotIndex === slotIndex);
      if (!targetSlot) {
        const msg = `Mạch Dẫn Linh số ${slotIndex + 1} không tồn tại!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      if (!targetSlot.isUnlocked) {
        const msg = `Mạch Dẫn Linh số ${slotIndex + 1} hiện đang bị phong ấn!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      if (!targetSlot.inscribedFormationId) {
        const msg = `Mạch Dẫn Linh số ${slotIndex + 1} vốn dĩ trống rỗng, không cần tẩy luyện!`;
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        return false;
      }

      // Kiểm tra và trừ Tẩy Thần Thủy
      const waterRes = deductCleansingWater(player);
      if (!waterRes.success) {
        const msg = waterRes.error || 'Không đủ Tẩy Thần Thủy để tẩy luyện!';
        setInscriptionFeedback({ type: 'error', message: msg });
        activeToast?.(msg);
        activeAddLog?.('Tẩy Luyện Thất Bại', msg, 'danger');
        return false;
      }

      setIsProcessing(true);

      try {
        try {
          audioEngine.playClickSound(1.0);
        } catch {
          // Fallback âm thanh
        }

        await new Promise(resolve => setTimeout(resolve, 250));

        // Tẩy luyện slot trên metadata trang bị
        const updatedMetadata = cleanseWeaponConduit(
          targetEquipment.inscriptionData!,
          slotIndex
        );

        const updatedEquipment: Equipment = {
          ...targetEquipment,
          inscriptionData: updatedMetadata
        };

        // Cập nhật trang bị vào PlayerState đã khấu trừ nước tẩy
        let updatedPlayer = updateEquipmentInPlayer(waterRes.updatedPlayer, location, updatedEquipment);

        // Single State Transition
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);

        const successMsg = `Đã dùng 1 Tẩy Thần Thủy tẩy sạch trận văn trên Mạch Dẫn Linh số ${slotIndex + 1} của [${targetEquipment.name}]!`;
        setInscriptionFeedback({ type: 'success', message: successMsg });
        activeToast?.(successMsg);
        activeAddLog?.('Tẩy Thần Thức', successMsg, 'info');

        setIsProcessing(false);
        return true;
      } catch (err: unknown) {
        setIsProcessing(false);
        const errMsg = err instanceof Error ? err.message : String(err);
        setInscriptionFeedback({ type: 'error', message: errMsg });
        activeToast?.(errMsg);
        activeAddLog?.('Tẩy Luyện Thất Bại', errMsg, 'danger');
        return false;
      }
    },
    [isProcessing, selectedEquipmentId, showToast, addLog]
  );

  return {
    selectedEquipmentId,
    selectedSlotIndex,
    isProcessing,
    inscriptionFeedback,
    selectedEquipment,
    selectedConduit,
    handleSelectEquipment,
    handleSelectSlot,
    handleClearFeedback,
    handleInscribe,
    handleCleanse
  };
}
