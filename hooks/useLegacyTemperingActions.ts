// hooks/useLegacyTemperingActions.ts
// Custom Hook dieu phoi State va Actions cho phan he "Trung Chu Tai Sinh & Ky Huyet Khe Ban Menh"
// 100% Strict TypeScript, Immutable State, Atomic Validation, Deep Copy, Clean Architecture

import { useState, useCallback, useMemo, useRef } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import {
  ReforgePreviewResult,
  LegacyTemperingPlayerState
} from '@/lib/types/legacy-tempering';
import {
  TIER_STAT_SCALE_CONFIG,
  resolveEquipmentTier,
  calculateReforgeStatsScale,
  applyEquipmentReforge,
  validateBloodBondEligibility,
  applyBloodBond
} from '@/lib/legacy-tempering-logic';
import { audioEngine } from '@/lib/audio-engine';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface TemperingFeedback {
  type: 'success' | 'error';
  message: string;
}

/** Vi tri trang bi trong PlayerState - Tui Do hay Mac Tren Nguoi */
export interface EquipmentLocation {
  /** 'equipped' = dang mac tren nguoi, 'inventory' = trong Tui Do */
  source: 'equipped' | 'inventory';
  /** Key slot (vi du: 'weapon', 'armor') neu source === 'equipped' */
  slotKey?: string;
  /** Index trong player.inventory.equipment neu source === 'inventory' */
  inventoryIndex?: number;
  equipment: Equipment;
}

export interface UseLegacyTemperingActionsProps {
  player?: PlayerState;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
}

export interface UseLegacyTemperingActionsReturn {
  // 1. Hook State
  selectedEquipmentId: string | null;
  targetTierSelection: number;
  isProcessing: boolean;
  actionFeedback: TemperingFeedback | null;

  // 2. Derived / Preview State
  selectedEquipment: Equipment | null;
  selectedEquipmentLocation: EquipmentLocation | null;
  reforgePreview: ReforgePreviewResult | null;
  previewError: string | null;
  bloodBondLifespanCost: number;
  remainingLifespan: number;

  // 3. Actions
  handleSelectEquipment: (equipmentId: string | null) => void;
  handleSelectTargetTier: (tier: number) => void;
  handleClearFeedback: () => void;
  handleExecuteReforge: (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ) => Promise<boolean>;
  handleExecuteBloodBond: (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    lifespanCost?: number,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ) => Promise<boolean>;
}

// ============================================================================
// HELPERS
// ============================================================================

const DEFAULT_BLOOD_BOND_LIFESPAN_COST = 5;

function findEquipmentLocation(
  player: PlayerState,
  equipmentId: string
): EquipmentLocation | null {
  if (!equipmentId) return null;

  // 1. equipment map (dang mac)
  const eqMap = player.equipment as Record<string, Equipment | undefined> | undefined;
  if (eqMap && typeof eqMap === 'object' && !Array.isArray(eqMap)) {
    for (const [slotKey, equip] of Object.entries(eqMap)) {
      if (equip && equip.id === equipmentId) {
        return { source: 'equipped', slotKey, equipment: equip };
      }
    }
  }

  // 2. equippedEquipment (tuong thich nguoc)
  const eqAlt = (player as any).equippedEquipment as Record<string, Equipment | undefined> | undefined;
  if (eqAlt && typeof eqAlt === 'object' && !Array.isArray(eqAlt)) {
    for (const [slotKey, equip] of Object.entries(eqAlt)) {
      if (equip && (equip as Equipment).id === equipmentId) {
        return { source: 'equipped', slotKey, equipment: equip as Equipment };
      }
    }
  }

  // 3. inventory.equipment
  const invEquips = (player.inventory as any)?.equipment as Equipment[] | undefined;
  if (Array.isArray(invEquips)) {
    const idx = invEquips.findIndex((e) => e?.id === equipmentId);
    if (idx !== -1) {
      return { source: 'inventory', inventoryIndex: idx, equipment: invEquips[idx] };
    }
  }

  // 4. inventory.equipments (alias)
  const invEquips2 = (player.inventory as any)?.equipments as Equipment[] | undefined;
  if (Array.isArray(invEquips2)) {
    const idx = invEquips2.findIndex((e) => e?.id === equipmentId);
    if (idx !== -1) {
      return { source: 'inventory', inventoryIndex: idx, equipment: invEquips2[idx] };
    }
  }

  return null;
}

function applyUpdatedEquipmentToPlayer(
  player: PlayerState,
  location: EquipmentLocation,
  updatedEquip: Equipment
): PlayerState {
  const cloned: PlayerState = JSON.parse(JSON.stringify(player));

  if (location.source === 'equipped') {
    const slotKey = location.slotKey!;
    if (cloned.equipment && typeof cloned.equipment === 'object' && !Array.isArray(cloned.equipment)) {
      (cloned.equipment as Record<string, Equipment | undefined>)[slotKey] = updatedEquip;
    }
    const eqAlt = (cloned as any).equippedEquipment;
    if (eqAlt && typeof eqAlt === 'object' && !Array.isArray(eqAlt)) {
      eqAlt[slotKey] = updatedEquip;
    }
  } else if (location.source === 'inventory') {
    const idx = location.inventoryIndex!;
    const inv = cloned.inventory as any;
    if (inv && Array.isArray(inv.equipment) && idx < inv.equipment.length) {
      inv.equipment[idx] = updatedEquip;
    } else if (inv && Array.isArray(inv.equipments) && idx < inv.equipments.length) {
      inv.equipments[idx] = updatedEquip;
    }
  }

  return cloned;
}

// ============================================================================
// HOOK
// ============================================================================

export function useLegacyTemperingActions(
  props?: UseLegacyTemperingActionsProps
): UseLegacyTemperingActionsReturn {
  const { player: propPlayer, showToast: propShowToast, addLog: propAddLog } = props || {};

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [targetTierSelection, setTargetTierSelection] = useState<number>(2);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<TemperingFeedback | null>(null);
  const isProcessingRef = useRef(false);

  const selectedEquipmentLocation = useMemo<EquipmentLocation | null>(() => {
    if (!propPlayer || !selectedEquipmentId) return null;
    return findEquipmentLocation(propPlayer, selectedEquipmentId);
  }, [propPlayer, selectedEquipmentId]);

  const selectedEquipment = useMemo<Equipment | null>(
    () => selectedEquipmentLocation?.equipment ?? null,
    [selectedEquipmentLocation]
  );

  const { reforgePreview, previewError } = useMemo<{
    reforgePreview: ReforgePreviewResult | null;
    previewError: string | null;
  }>(() => {
    if (!selectedEquipment) return { reforgePreview: null, previewError: null };
    try {
      const preview = calculateReforgeStatsScale(selectedEquipment, targetTierSelection);
      return { reforgePreview: preview, previewError: null };
    } catch (err: any) {
      return { reforgePreview: null, previewError: err?.message ?? 'Khong the tinh toan trung chu.' };
    }
  }, [selectedEquipment, targetTierSelection]);

  const remainingLifespan = useMemo<number>(() => {
    if (!propPlayer) return 0;
    return Math.max(0, (propPlayer.maxLifespan ?? 0) - (propPlayer.age ?? 0));
  }, [propPlayer]);

  const bloodBondLifespanCost = DEFAULT_BLOOD_BOND_LIFESPAN_COST;

  const handleSelectEquipment = useCallback((equipmentId: string | null) => {
    setSelectedEquipmentId(equipmentId);
    setActionFeedback(null);
    if (equipmentId && propPlayer) {
      const loc = findEquipmentLocation(propPlayer, equipmentId);
      if (loc?.equipment) {
        const currentTier = resolveEquipmentTier(loc.equipment);
        setTargetTierSelection(Math.min(9, currentTier + 1));
      }
    }
  }, [propPlayer]);

  const handleSelectTargetTier = useCallback((tier: number) => {
    setTargetTierSelection(Math.min(9, Math.max(1, Math.floor(tier))));
    setActionFeedback(null);
  }, []);

  const handleClearFeedback = useCallback(() => {
    setActionFeedback(null);
  }, []);

  const handleExecuteReforge = useCallback(async (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ): Promise<boolean> => {
    const toast = callbacks?.showToast ?? propShowToast;
    const log = callbacks?.addLog ?? propAddLog;

    if (isProcessingRef.current) return false;

    if (!selectedEquipmentId) {
      setActionFeedback({ type: 'error', message: 'Chua chon trang bi de Trung Chu!' });
      return false;
    }

    const location = findEquipmentLocation(player, selectedEquipmentId);
    if (!location) {
      setActionFeedback({ type: 'error', message: 'Khong tim thay trang bi. Du lieu da thay doi.' });
      return false;
    }
    const equipment = location.equipment;

    const currentTier = resolveEquipmentTier(equipment);
    if (targetTierSelection <= currentTier) {
      setActionFeedback({ type: 'error', message: `Canh gioi muc tieu (Tier ${targetTierSelection}) phai cao hon canh gioi hien tai (Tier ${currentTier})!` });
      return false;
    }
    if (targetTierSelection < 1 || targetTierSelection > 9) {
      setActionFeedback({ type: 'error', message: 'Canh gioi muc tieu khong hop le.' });
      return false;
    }

    const tierConfig = TIER_STAT_SCALE_CONFIG[targetTierSelection];
    if (!tierConfig) {
      setActionFeedback({ type: 'error', message: 'Cau hinh canh gioi muc tieu khong ton tai.' });
      return false;
    }

    const linhThachRequired = tierConfig.spiritStonesCost;
    if ((player.linhThach ?? 0) < linhThachRequired) {
      const msg = `Linh Thach khong du! Can ${linhThachRequired.toLocaleString()} LT, hien co ${(player.linhThach ?? 0).toLocaleString()} LT.`;
      setActionFeedback({ type: 'error', message: msg });
      toast?.(msg);
      return false;
    }

    const requiredMineral = tierConfig.baseMineral;
    const invOres = (player.inventory as any)?.ores as Array<{ id: string; quantity: number }> | undefined;
    const ownedMineral = invOres?.find((o) => o?.id === requiredMineral.itemId);
    const ownedQty = ownedMineral?.quantity ?? 0;
    if (ownedQty < requiredMineral.baseAmount) {
      const msg = `Thieu khoang thach! Can ${requiredMineral.baseAmount}x ${requiredMineral.name}, hien co ${ownedQty}x.`;
      setActionFeedback({ type: 'error', message: msg });
      toast?.(msg);
      return false;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);
    setActionFeedback(null);

    try {
      const reforgedEquip = applyEquipmentReforge(equipment, targetTierSelection);

      const updatedOres = (invOres ?? [])
        .map((ore) => ore?.id === requiredMineral.itemId
          ? { ...ore, quantity: ore.quantity - requiredMineral.baseAmount }
          : { ...ore })
        .filter((ore) => ore.quantity > 0);

      let updatedPlayer = applyUpdatedEquipmentToPlayer(player, location, reforgedEquip);
      updatedPlayer = {
        ...updatedPlayer,
        linhThach: (updatedPlayer.linhThach ?? 0) - linhThachRequired,
        legacyTemperingState: {
          ...(updatedPlayer.legacyTemperingState ?? {
            totalReforgesPerformed: 0,
            bloodBoundEquipmentIds: []
          }) as LegacyTemperingPlayerState,
          totalReforgesPerformed:
            ((updatedPlayer.legacyTemperingState as any)?.totalReforgesPerformed ?? 0) + 1
        }
      };

      const clonedInv = { ...(updatedPlayer.inventory ?? {}) } as any;
      if (Array.isArray(clonedInv.ores)) {
        clonedInv.ores = updatedOres;
      }
      updatedPlayer = { ...updatedPlayer, inventory: clonedInv };

      setPlayer(updatedPlayer);

      const oldAtk = equipment.atkBonus ?? equipment.powerBonus ?? 0;
      const newAtk = reforgedEquip.atkBonus ?? reforgedEquip.powerBonus ?? 0;
      const successMsg = `Trung Chu thanh cong! [${reforgedEquip.name}] thang hoa len ${tierConfig.gradeName} (Tier ${targetTierSelection})! ATK: ${oldAtk} => ${newAtk}`;
      setActionFeedback({ type: 'success', message: successMsg });
      toast?.(successMsg);
      log?.('Trung Chu Tai Sinh', successMsg, 'success');
      try { audioEngine.playSFX('craft'); } catch (_) { /* no-op */ }

      return true;
    } catch (err: any) {
      const errMsg = err?.message ?? 'Trung Chu that bai do loi khong xac dinh.';
      setActionFeedback({ type: 'error', message: errMsg });
      toast?.(errMsg);
      return false;
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [selectedEquipmentId, targetTierSelection, propShowToast, propAddLog]);

  const handleExecuteBloodBond = useCallback(async (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    lifespanCost: number = DEFAULT_BLOOD_BOND_LIFESPAN_COST,
    callbacks?: {
      showToast?: (msg: string) => void;
      addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
    }
  ): Promise<boolean> => {
    const toast = callbacks?.showToast ?? propShowToast;
    const log = callbacks?.addLog ?? propAddLog;

    if (isProcessingRef.current) return false;

    if (!selectedEquipmentId) {
      setActionFeedback({ type: 'error', message: 'Chua chon trang bi de ky Huyet Khe!' });
      return false;
    }

    const location = findEquipmentLocation(player, selectedEquipmentId);
    if (!location) {
      setActionFeedback({ type: 'error', message: 'Khong tim thay trang bi. Du lieu da thay doi.' });
      return false;
    }
    const equipment = location.equipment;

    const actualRemainingLifespan = Math.max(0, (player.maxLifespan ?? 0) - (player.age ?? 0));
    const eligibility = validateBloodBondEligibility(actualRemainingLifespan, equipment);
    if (!eligibility.eligible) {
      const msg = eligibility.reason ?? 'Khong du dieu kien ky ket Huyet Khe.';
      setActionFeedback({ type: 'error', message: msg });
      toast?.(msg);
      return false;
    }

    const safeLifespanCost = Math.max(1, lifespanCost);
    const remainingAfterBond = actualRemainingLifespan - safeLifespanCost;
    if (remainingAfterBond < 5) {
      const msg = `Sau khi ky Huyet Khe, tho nguyen con lai chi con ${remainingAfterBond} nam — nguy hiem Toa Hoa!`;
      setActionFeedback({ type: 'error', message: msg });
      toast?.(msg);
      return false;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);
    setActionFeedback(null);

    try {
      const ownerId = player.name ?? 'unknown_owner';
      const ownerName = player.name ?? 'Vo Danh Tu Si';
      const bondedEquip = applyBloodBond(equipment, ownerId, ownerName, safeLifespanCost);

      let updatedPlayer = applyUpdatedEquipmentToPlayer(player, location, bondedEquip);

      const existingBondIds: string[] =
        (updatedPlayer.legacyTemperingState as any)?.bloodBoundEquipmentIds ?? [];
      const newBondIds = existingBondIds.includes(bondedEquip.id)
        ? existingBondIds
        : [...existingBondIds, bondedEquip.id];

      updatedPlayer = {
        ...updatedPlayer,
        age: (updatedPlayer.age ?? 0) + safeLifespanCost,
        legacyTemperingState: {
          ...(updatedPlayer.legacyTemperingState ?? {
            totalReforgesPerformed: 0,
            bloodBoundEquipmentIds: []
          }) as LegacyTemperingPlayerState,
          bloodBoundEquipmentIds: newBondIds
        }
      };

      setPlayer(updatedPlayer);

      const successMsg = `Huyet Khe ky ket thanh cong! [${bondedEquip.name}] da nhan mau huyet, hoa than binh ban menh! Chien luc x1.30, mien nhiem tuoc khi! (Tho nguyen tieu hao: ${safeLifespanCost} nam)`;
      setActionFeedback({ type: 'success', message: successMsg });
      toast?.(successMsg);
      log?.('Huyet Khe Ban Menh', successMsg, 'success');
      try {
        audioEngine.playSFX('breakthrough');
      } catch (_) {
        try { audioEngine.playSFX('thunder'); } catch (_) { /* no-op */ }
      }

      return true;
    } catch (err: any) {
      const errMsg = err?.message ?? 'Ky ket Huyet Khe that bai do loi khong xac dinh.';
      setActionFeedback({ type: 'error', message: errMsg });
      toast?.(errMsg);
      return false;
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [selectedEquipmentId, propShowToast, propAddLog]);

  return {
    selectedEquipmentId,
    targetTierSelection,
    isProcessing,
    actionFeedback,
    selectedEquipment,
    selectedEquipmentLocation,
    reforgePreview,
    previewError,
    bloodBondLifespanCost,
    remainingLifespan,
    handleSelectEquipment,
    handleSelectTargetTier,
    handleClearFeedback,
    handleExecuteReforge,
    handleExecuteBloodBond
  };
}

