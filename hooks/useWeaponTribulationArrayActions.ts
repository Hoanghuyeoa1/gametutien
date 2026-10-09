// hooks/useWeaponTribulationArrayActions.ts
// Custom Hook điều phối State và Actions cho phân hệ "Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân"
// 100% Strict TypeScript, Immutable State, Atomic Validation, Deep Copy, Clean Architecture

import { useState, useCallback, useMemo, useRef } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import {
  FormationSetCategory,
  WeaponTribulationStrike,
  LightningTemperedMetadata,
  FormationSetConfig,
  PlayerFormationSetProgress,
  FormationSetsState
} from '@/lib/types/weapon-tribulation-array';
import {
  FORMATION_SETS_REGISTRY,
  evaluateWeaponTribulationTrigger,
  resolveWeaponLightningTemper,
  finalizeLightningTempering,
  calculateCraftPieceProgress,
  equipFormationSet
} from '@/lib/weapon-tribulation-array-logic';
import { audioEngine } from '@/lib/audio-engine';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
}

export interface ActiveTribulationEncounter {
  currentWave: number;
  totalWaves: number;
  strikeData: WeaponTribulationStrike;
  isComplete: boolean;
}

export interface WeaponLocation {
  source: 'equipped' | 'inventory' | 'natalArtifact';
  slotKey?: string;
  inventoryIndex?: number;
  equipment: Equipment;
}

export interface UseWeaponTribulationArrayActionsProps {
  player?: PlayerState;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'success' | 'info' | 'danger') => void;
}

export interface UseWeaponTribulationArrayActionsReturn {
  // 1. Hook State
  selectedWeaponForTribulationId: string | null;
  activeTribulationEncounter: ActiveTribulationEncounter | null;
  selectedFormationSetId: string | null;
  isProcessing: boolean;
  actionFeedback: ActionFeedback | null;

  // 2. Derived State & Previews
  selectedWeapon: Equipment | null;
  tribulationTriggerEval: { canTrigger: boolean; reason?: string } | null;
  selectedFormationSet: FormationSetConfig | null;
  selectedFormationProgress: PlayerFormationSetProgress | null;
  allFormationSets: FormationSetConfig[];

  // 3. Actions
  handleSelectWeaponForTribulation: (weaponId: string | null) => void;
  handleSelectFormationSet: (setId: string | null) => void;
  handleClearFeedback: () => void;
  handleStartTribulation: (weaponId: string, player: PlayerState) => boolean;
  handleAbsorbStrike: (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    playerShieldQi?: number
  ) => Promise<boolean>;
  handleCraftSetPieces: (
    setId: string,
    pieceCount: number,
    player: PlayerState,
    setPlayer: (p: PlayerState) => void
  ) => Promise<boolean>;
  handleToggleEquipArraySet: (
    setId: string,
    player: PlayerState,
    setPlayer: (p: PlayerState) => void
  ) => void;
}

// ============================================================================
// CONFIG & CONSTANTS
// ============================================================================

export const WEAPON_TRIBULATION_STRIKES_CONFIG: WeaponTribulationStrike[] = [
  {
    waveIndex: 1,
    strikeName: 'Đệ Nhất Đợt • Thanh Lôi Tẩy Kiếm',
    lightningPower: 3000,
    temperSuccessRate: 85,
    description: 'Tia thanh lôi tinh thuần từ tầng mây giáng xuống, thanh lọc tạp chất trên thân binh.'
  },
  {
    waveIndex: 2,
    strikeName: 'Đệ Nhị Đợt • Tử Điện Đoán Cốt',
    lightningPower: 6000,
    temperSuccessRate: 75,
    description: 'Tử lôi cuồn cuộn như cuồng long giáng thế, rèn đúc linh cốt thần binh đạt tới cực hạn.'
  },
  {
    waveIndex: 3,
    strikeName: 'Đệ Tam Đợt • Cửu Tiêu Lôi Kiếp',
    lightningPower: 10000,
    temperSuccessRate: 65,
    description: 'Đạo thiên kiếp tối thượng phá không giáng hạ, kích phát lôi văn bản nguyên thành hình!'
  }
];

export function getTribulationStrikeForWave(wave: number, weaponTier: number = 9): WeaponTribulationStrike {
  const baseStrike =
    WEAPON_TRIBULATION_STRIKES_CONFIG[Math.max(0, Math.min(2, wave - 1))] ||
    WEAPON_TRIBULATION_STRIKES_CONFIG[0];
  const powerScale = 1 + (Math.max(1, weaponTier) - 1) * 0.1;
  return {
    ...baseStrike,
    waveIndex: wave,
    lightningPower: Math.round(baseStrike.lightningPower * powerScale)
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function findWeaponLocation(player: PlayerState, weaponId: string): WeaponLocation | null {
  if (!weaponId) return null;

  // 1. Equipment map (đang mặc)
  const eqMap = player.equipment as Record<string, Equipment | undefined> | undefined;
  if (eqMap && typeof eqMap === 'object' && !Array.isArray(eqMap)) {
    for (const [key, item] of Object.entries(eqMap)) {
      if (item && item.id === weaponId) {
        return { source: 'equipped', slotKey: key, equipment: item };
      }
    }
  }

  // 2. Equipped array (nếu dạng mảng)
  if (Array.isArray(player.equipment)) {
    const found = player.equipment.find(e => e?.id === weaponId);
    if (found) return { source: 'equipped', equipment: found };
  }

  // 3. equippedEquipment (tương thích ngược)
  const legacyEq = (player as any).equippedEquipment;
  if (legacyEq && typeof legacyEq === 'object' && !Array.isArray(legacyEq)) {
    for (const [key, item] of Object.entries(legacyEq as Record<string, Equipment | undefined>)) {
      if (item && item.id === weaponId) {
        return { source: 'equipped', slotKey: key, equipment: item };
      }
    }
  }

  // 4. Inventory equipments / equipment / items
  if (Array.isArray(player.inventory?.equipments)) {
    const idx = player.inventory.equipments.findIndex(e => e?.id === weaponId);
    if (idx >= 0 && player.inventory.equipments[idx]) {
      return {
        source: 'inventory',
        inventoryIndex: idx,
        equipment: player.inventory.equipments[idx]
      };
    }
  }
  if (Array.isArray(player.inventory?.equipment)) {
    const idx = player.inventory.equipment.findIndex(e => e?.id === weaponId);
    if (idx >= 0 && player.inventory.equipment[idx]) {
      return {
        source: 'inventory',
        inventoryIndex: idx,
        equipment: player.inventory.equipment[idx]
      };
    }
  }
  if (Array.isArray((player.inventory as any)?.items)) {
    const idx = (player.inventory as any).items.findIndex((e: any) => e?.id === weaponId);
    if (idx >= 0 && (player.inventory as any).items[idx]) {
      return {
        source: 'inventory',
        inventoryIndex: idx,
        equipment: (player.inventory as any).items[idx]
      };
    }
  }

  // 5. Natal artifact
  if (player.natalArtifact?.baseEquipment && player.natalArtifact.baseEquipment.id === weaponId) {
    return { source: 'natalArtifact', equipment: player.natalArtifact.baseEquipment };
  }

  return null;
}

function updateWeaponInPlayer(
  player: PlayerState,
  updatedWeapon: Equipment,
  location: WeaponLocation
): PlayerState {
  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  if (location.source === 'equipped') {
    const slotKey = location.slotKey || 'weapon';
    if (cloned.equipment && typeof cloned.equipment === 'object') {
      (cloned.equipment as any)[slotKey] = updatedWeapon;
    }
    if ((cloned as any).equippedEquipment && typeof (cloned as any).equippedEquipment === 'object') {
      (cloned as any).equippedEquipment[slotKey] = updatedWeapon;
    }
  } else if (location.source === 'inventory') {
    const idx = location.inventoryIndex ?? -1;
    if (idx >= 0) {
      if (Array.isArray(cloned.inventory?.equipments)) {
        cloned.inventory.equipments[idx] = updatedWeapon;
      }
      if (Array.isArray(cloned.inventory?.equipment)) {
        cloned.inventory.equipment[idx] = updatedWeapon;
      }
      if (Array.isArray((cloned.inventory as any)?.items)) {
        (cloned.inventory as any).items[idx] = updatedWeapon;
      }
    } else {
      if (Array.isArray(cloned.inventory?.equipments)) {
        const found = cloned.inventory.equipments.findIndex(e => e?.id === updatedWeapon.id);
        if (found >= 0) cloned.inventory.equipments[found] = updatedWeapon;
      }
      if (Array.isArray(cloned.inventory?.equipment)) {
        const found = cloned.inventory.equipment.findIndex(e => e?.id === updatedWeapon.id);
        if (found >= 0) cloned.inventory.equipment[found] = updatedWeapon;
      }
    }
  } else if (location.source === 'natalArtifact') {
    if (cloned.natalArtifact) {
      cloned.natalArtifact.baseEquipment = updatedWeapon;
    }
  }

  return cloned;
}

// ============================================================================
// MAIN CUSTOM HOOK: useWeaponTribulationArrayActions
// ============================================================================

export function useWeaponTribulationArrayActions(
  props?: UseWeaponTribulationArrayActionsProps
): UseWeaponTribulationArrayActionsReturn {
  const { player: propPlayer, showToast, addLog } = props || {};

  // 1. Hook State
  const [selectedWeaponForTribulationId, setSelectedWeaponForTribulationId] = useState<string | null>(null);
  const [activeTribulationEncounter, setActiveTribulationEncounter] = useState<ActiveTribulationEncounter | null>(null);
  const [selectedFormationSetId, setSelectedFormationSetId] = useState<string | null>('chu_thien_kiem');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);

  const processingRef = useRef(false);

  // 2. Derived State & Previews
  const allFormationSets = useMemo<FormationSetConfig[]>(() => {
    return Object.values(FORMATION_SETS_REGISTRY);
  }, []);

  const selectedWeapon = useMemo<Equipment | null>(() => {
    if (!selectedWeaponForTribulationId || !propPlayer) return null;
    const loc = findWeaponLocation(propPlayer, selectedWeaponForTribulationId);
    return loc ? loc.equipment : null;
  }, [selectedWeaponForTribulationId, propPlayer]);

  const tribulationTriggerEval = useMemo<{ canTrigger: boolean; reason?: string } | null>(() => {
    if (!selectedWeapon) return null;
    return evaluateWeaponTribulationTrigger(selectedWeapon);
  }, [selectedWeapon]);

  const selectedFormationSet = useMemo<FormationSetConfig | null>(() => {
    if (!selectedFormationSetId) return null;
    return FORMATION_SETS_REGISTRY[selectedFormationSetId as FormationSetCategory] || null;
  }, [selectedFormationSetId]);

  const selectedFormationProgress = useMemo<PlayerFormationSetProgress | null>(() => {
    if (!selectedFormationSetId || !propPlayer?.formationSetsState?.ownedSets) return null;
    return propPlayer.formationSetsState.ownedSets[selectedFormationSetId] || null;
  }, [selectedFormationSetId, propPlayer]);

  // 3. Selection Handlers
  const handleSelectWeaponForTribulation = useCallback((weaponId: string | null) => {
    setSelectedWeaponForTribulationId(weaponId);
    setActiveTribulationEncounter(null);
    setActionFeedback(null);
  }, []);

  const handleSelectFormationSet = useCallback((setId: string | null) => {
    setSelectedFormationSetId(setId);
    setActionFeedback(null);
  }, []);

  const handleClearFeedback = useCallback(() => {
    setActionFeedback(null);
  }, []);

  // 4. Action: handleStartTribulation
  const handleStartTribulation = useCallback(
    (weaponId: string, player: PlayerState): boolean => {
      if (processingRef.current || isProcessing) {
        showToast?.('Đang xử lý thao tác, xin vui lòng chờ giây lát!');
        return false;
      }

      if (!weaponId) {
        const err = 'Chưa chọn vũ khí để dẫn động Khí Lôi Kiếp!';
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      const weaponLoc = findWeaponLocation(player, weaponId);
      if (!weaponLoc || !weaponLoc.equipment) {
        const err = 'Không tìm thấy vũ khí mục tiêu trong túi đồ hoặc trên người!';
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      const weapon = weaponLoc.equipment;
      const evalResult = evaluateWeaponTribulationTrigger(weapon);
      if (!evalResult.canTrigger) {
        const err = evalResult.reason || 'Vũ khí không đủ linh tính để dẫn động Thiên Kiếp!';
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        addLog?.('Dẫn Động Kiếp Lôi Thất Bại', err, 'danger');
        return false;
      }

      try {
        audioEngine.playSwordSlashSound?.(1.0, true);
      } catch {
        // Safe audio fallback
      }

      const firstStrike = getTribulationStrikeForWave(1, weapon.tier || 9);
      setSelectedWeaponForTribulationId(weaponId);
      setActiveTribulationEncounter({
        currentWave: 1,
        totalWaves: 3,
        strikeData: firstStrike,
        isComplete: false
      });

      const successMsg = `Dẫn động Thiên Kiếp thành công! Mây đen cuồn cuộn vần vũ, đợt lôi kiếp thứ 1 [${firstStrike.strikeName}] sắp sửa giáng xuống!`;
      setActionFeedback({ type: 'success', message: successMsg });
      showToast?.(successMsg);
      addLog?.('Dẫn Động Khí Lôi Kiếp', successMsg, 'info');

      return true;
    },
    [isProcessing, showToast, addLog]
  );

  // 5. Action: handleAbsorbStrike
  const handleAbsorbStrike = useCallback(
    async (
      player: PlayerState,
      setPlayer: (p: PlayerState) => void,
      playerShieldQi?: number
    ): Promise<boolean> => {
      if (processingRef.current || isProcessing) {
        showToast?.('Đang ngạnh kháng lôi kiếp, xin chớ nóng vội!');
        return false;
      }

      if (!activeTribulationEncounter || !selectedWeaponForTribulationId) {
        const err = 'Hiện không có đợt lôi kiếp nào đang diễn ra!';
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      if (activeTribulationEncounter.isComplete) {
        const infoMsg = 'Vũ khí này đã hoàn thành toàn bộ 3 đợt lôi kiếp!';
        setActionFeedback({ type: 'success', message: infoMsg });
        showToast?.(infoMsg);
        return true;
      }

      const weaponLoc = findWeaponLocation(player, selectedWeaponForTribulationId);
      if (!weaponLoc || !weaponLoc.equipment) {
        const err = 'Không tìm thấy vũ khí mục tiêu!';
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      const weapon = weaponLoc.equipment;
      const currentWave = activeTribulationEncounter.currentWave;
      const totalWaves = activeTribulationEncounter.totalWaves;
      const strike = activeTribulationEncounter.strikeData;

      processingRef.current = true;
      setIsProcessing(true);

      try {
        // Âm thanh vung kiếm đón lôi kiếp
        try {
          audioEngine.playSwordSlashSound?.(1.0, true);
        } catch {
          // Safe fallback
        }

        // Delay hoạt ảnh đón sét
        await new Promise(resolve => setTimeout(resolve, 400));

        const effectiveShieldQi =
          playerShieldQi !== undefined ? playerShieldQi : Math.min(player.linhLuc || 1000, 2000);
        const temperResult = resolveWeaponLightningTemper(weapon, strike, effectiveShieldQi);

        if (!temperResult.success) {
          // Ngạnh kháng thất bại: Lôi kiếp chấn động tiêu tán
          setActiveTribulationEncounter(null);
          const failMsg = `Đợt lôi kiếp thứ ${currentWave} [${strike.strikeName}] uy lực quá lớn! Thần binh không thể dung nạp, lôi kiếp đã tiêu tán!`;
          setActionFeedback({ type: 'error', message: failMsg });
          showToast?.(failMsg);
          addLog?.('Ngạnh Kháng Kiếp Lôi Thất Bại', failMsg, 'danger');
          return false;
        }

        // Ngạnh kháng thành công
        if (currentWave < totalWaves) {
          // Chuyển sang đợt kế tiếp
          const nextWave = currentWave + 1;
          const nextStrike = getTribulationStrikeForWave(nextWave, weapon.tier || 9);
          setActiveTribulationEncounter({
            currentWave: nextWave,
            totalWaves,
            strikeData: nextStrike,
            isComplete: false
          });

          const successMsg = `Thần binh ngạnh kháng thành công đợt sét thứ ${currentWave} [${strike.strikeName}]! Lôi đình chuyển hóa uy lực (+${temperResult.absorbedPower} Lực Lượng Lôi), đợt thứ ${nextWave} đang tụ hình!`;
          setActionFeedback({ type: 'success', message: successMsg });
          showToast?.(successMsg);
          addLog?.('Vượt Qua Đợt Kiếp Lôi', successMsg, 'info');
          return true;
        } else {
          // Đã vượt qua toàn bộ 3 đợt lôi kiếp -> Đúc thành Cửu Tiêu Lôi Thần Binh!
          const temperedWeapon = finalizeLightningTempering(weapon);
          let cloned = updateWeaponInPlayer(player, temperedWeapon, weaponLoc);

          // Khởi tạo an toàn formationSetsState nếu chưa có
          if (!cloned.formationSetsState) {
            cloned.formationSetsState = {
              ownedSets: {},
              equippedArraySetId: null,
              tribulationHistory: []
            };
          }

          // Lưu lịch sử độ kiếp
          const historyEntry = {
            weaponId: weapon.id,
            weaponName: temperedWeapon.name,
            completedAt: Date.now(),
            wavesPassed: totalWaves
          };
          cloned.formationSetsState.tribulationHistory = [
            historyEntry,
            ...(cloned.formationSetsState.tribulationHistory || [])
          ];

          setPlayer(cloned);
          setActiveTribulationEncounter({
            ...activeTribulationEncounter,
            isComplete: true
          });

          try {
            audioEngine.playBreakthroughSuccessSound?.(1.0);
          } catch {
            // Safe fallback
          }

          const completeMsg = `Khí Lôi Kiếp đại viên mãn! Thần binh lột xác thành 【${temperedWeapon.name}】, khắc họa Cửu Tiêu Lôi Văn vĩnh viễn (+35% Lôi Sát xuyên giáp, 20% Tê Liệt)!`;
          setActionFeedback({ type: 'success', message: completeMsg });
          showToast?.(completeMsg);
          addLog?.('Độ Kiếp Thần Binh Thành Công', completeMsg, 'success');

          return true;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setActionFeedback({ type: 'error', message: errorMsg });
        showToast?.(errorMsg);
        return false;
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    },
    [activeTribulationEncounter, selectedWeaponForTribulationId, isProcessing, showToast, addLog]
  );

  // 6. Action: handleCraftSetPieces
  const handleCraftSetPieces = useCallback(
    async (
      setId: string,
      pieceCount: number,
      player: PlayerState,
      setPlayer: (p: PlayerState) => void
    ): Promise<boolean> => {
      if (processingRef.current || isProcessing) {
        showToast?.('Lò rèn đang đúc trận khí, xin chớ nóng vội!');
        return false;
      }

      if (typeof pieceCount !== 'number' || pieceCount <= 0 || isNaN(pieceCount)) {
        const err = 'Số lượng mảnh đúc phải là số nguyên dương lớn hơn 0!';
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      if (!setId || !FORMATION_SETS_REGISTRY[setId as FormationSetCategory]) {
        const err = `Bộ trận khí [${setId}] không tồn tại trong danh mục!`;
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      const setConfig = FORMATION_SETS_REGISTRY[setId as FormationSetCategory];
      const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

      // 1. Cap Guard: Kiểm tra số mảnh tối đa
      const currentSet = cloned.formationSetsState?.ownedSets?.[setId];
      const currentPieces = currentSet?.currentPieces || 0;
      if (currentPieces + pieceCount > setConfig.maxPieces) {
        const err = `Số lượng đúc (${currentPieces} + ${pieceCount}) vượt quá giới hạn tối đa ${setConfig.maxPieces} mảnh của bộ [${setConfig.name}]!`;
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return false;
      }

      // 2. Atomic Validation: Kiểm tra đủ Linh Thạch
      const totalSpiritStones = (setConfig.pieceCraftCost.spiritStones || 0) * pieceCount;
      const currentLinhThach =
        typeof cloned.linhThach === 'number'
          ? cloned.linhThach
          : typeof (cloned as any).spiritStones === 'number'
          ? (cloned as any).spiritStones
          : 0;

      if (currentLinhThach < totalSpiritStones) {
        const err = `Không đủ Linh Thạch! Cần ${totalSpiritStones.toLocaleString()} LT (hiện có: ${currentLinhThach.toLocaleString()} LT).`;
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        addLog?.('Đúc Trận Khí Thất Bại', err, 'danger');
        return false;
      }

      // 3. Atomic Validation: Kiểm tra đủ khoáng thạch trong kho
      const ores = Array.isArray(cloned.inventory?.ores) ? [...cloned.inventory.ores] : [];
      for (const mineral of setConfig.pieceCraftCost.minerals) {
        const totalAmount = mineral.amount * pieceCount;
        const owned = ores.find(
          o =>
            o &&
            (o.id === mineral.itemId ||
              o.name === mineral.name ||
              (mineral.itemId && o.id?.includes(mineral.itemId)))
        );
        const ownedQty = owned?.quantity || 0;
        if (ownedQty < totalAmount) {
          const err = `Không đủ khoáng thạch [${mineral.name}]: cần ${totalAmount}, hiện chỉ có ${ownedQty}!`;
          setActionFeedback({ type: 'error', message: err });
          showToast?.(err);
          addLog?.('Đúc Trận Khí Thất Bại', err, 'danger');
          return false;
        }
      }

      processingRef.current = true;
      setIsProcessing(true);

      try {
        // Animation lock & audio
        try {
          audioEngine.playSwordSlashSound?.(1.0, true);
        } catch {
          // Safe fallback
        }

        await new Promise(resolve => setTimeout(resolve, 350));

        // 4. Khấu trừ Linh Thạch
        if (typeof cloned.linhThach === 'number') {
          cloned.linhThach -= totalSpiritStones;
        }
        if (typeof (cloned as any).spiritStones === 'number') {
          (cloned as any).spiritStones -= totalSpiritStones;
        }

        // 5. Khấu trừ khoáng thạch
        for (const mineral of setConfig.pieceCraftCost.minerals) {
          let remainingToDeduct = mineral.amount * pieceCount;
          for (const ore of ores) {
            if (remainingToDeduct <= 0) break;
            if (
              ore &&
              (ore.id === mineral.itemId ||
                ore.name === mineral.name ||
                (mineral.itemId && ore.id?.includes(mineral.itemId)))
            ) {
              const deduct = Math.min(ore.quantity, remainingToDeduct);
              ore.quantity -= deduct;
              remainingToDeduct -= deduct;
            }
          }
        }
        if (cloned.inventory) {
          cloned.inventory.ores = ores.filter(o => o.quantity > 0);
        }

        // 6. Tính toán tiến độ đúc mảnh
        const progressResult = calculateCraftPieceProgress(currentSet, setConfig, pieceCount);

        // Khởi tạo an toàn formationSetsState nếu chưa có
        if (!cloned.formationSetsState) {
          cloned.formationSetsState = {
            ownedSets: {},
            equippedArraySetId: null,
            tribulationHistory: []
          };
        }

        cloned.formationSetsState.ownedSets = {
          ...(cloned.formationSetsState.ownedSets || {}),
          [setId]: progressResult.updatedSet
        };

        // 7. Cập nhật PlayerState một lần duy nhất
        setPlayer(cloned);

        let successMsg = `Đúc thành công +${pieceCount} mảnh 【${setConfig.name}】! Tiến độ hiện tại: ${progressResult.updatedSet.currentPieces}/${setConfig.maxPieces}.`;
        if (progressResult.newlyUnlockedThresholds.length > 0) {
          successMsg += ` 🎉 Đã mở khóa Mốc ${progressResult.newlyUnlockedThresholds.join(', ')} hiệu ứng đại trận!`;
        }
        if (progressResult.updatedSet.isCompleted) {
          successMsg += ` 🌟 ĐẠI TRẬN HOÀN THÀNH VIÊN MÃN! Kích hoạt toàn bộ linh uy của bộ trận khí!`;
        }

        setActionFeedback({ type: 'success', message: successMsg });
        showToast?.(successMsg);
        addLog?.('Đúc Trận Khí Thành Công', successMsg, 'success');

        return true;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setActionFeedback({ type: 'error', message: errorMsg });
        showToast?.(errorMsg);
        return false;
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    },
    [isProcessing, showToast, addLog]
  );

  // 7. Action: handleToggleEquipArraySet
  const handleToggleEquipArraySet = useCallback(
    (setId: string, player: PlayerState, setPlayer: (p: PlayerState) => void) => {
      if (!setId || !FORMATION_SETS_REGISTRY[setId as FormationSetCategory]) {
        const err = `Bộ trận khí [${setId}] không tồn tại trong danh mục!`;
        setActionFeedback({ type: 'error', message: err });
        showToast?.(err);
        return;
      }

      const setConfig = FORMATION_SETS_REGISTRY[setId as FormationSetCategory];
      const isCurrentlyEquipped = player.formationSetsState?.equippedArraySetId === setId;
      const targetSetId = isCurrentlyEquipped ? null : setId;

      // equipFormationSet là Non-destructive: Chỉ gán equippedArraySetId, không chạm vào player.equipment.weapon
      const updatedPlayer = equipFormationSet(player, targetSetId);
      setPlayer(updatedPlayer);

      if (targetSetId) {
        const msg = `Đã xuất trận bộ trận khí tùy thân 【${setConfig.name}】! Bảo quang lưu chuyển tuần hoàn quanh thân thể.`;
        setActionFeedback({ type: 'success', message: msg });
        showToast?.(msg);
        addLog?.('Trận Khí Xuất Trận', msg, 'info');
      } else {
        const msg = `Đã thu hồi bộ trận khí tùy thân 【${setConfig.name}】 về thức hải an toàn.`;
        setActionFeedback({ type: 'success', message: msg });
        showToast?.(msg);
        addLog?.('Trận Khí Thu Hồi', msg, 'info');
      }
    },
    [showToast, addLog]
  );

  return {
    // 1. Hook State
    selectedWeaponForTribulationId,
    activeTribulationEncounter,
    selectedFormationSetId,
    isProcessing,
    actionFeedback,

    // 2. Derived State & Previews
    selectedWeapon,
    tribulationTriggerEval,
    selectedFormationSet,
    selectedFormationProgress,
    allFormationSets,

    // 3. Actions
    handleSelectWeaponForTribulation,
    handleSelectFormationSet,
    handleClearFeedback,
    handleStartTribulation,
    handleAbsorbStrike,
    handleCraftSetPieces,
    handleToggleEquipArraySet
  };
}
