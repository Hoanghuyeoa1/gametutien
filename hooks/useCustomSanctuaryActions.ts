// hooks/useCustomSanctuaryActions.ts
// Custom Action Hook cho Phân Hệ "Linh Mạch Động Phủ Tự Chế & Khảm Nạp Trận Bàn"
// (Custom Sanctuary & Vein Socketing — Tự Chế Linh Địa Độc Quyền)

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats, LogType, FormationItem } from '@/lib/types';
import {
  CustomSanctuaryState,
  SanctuaryVeinTier,
  SanctuaryVeinTierConfig
} from '@/lib/types/custom-sanctuary';
import {
  SANCTUARY_VEIN_CONFIG,
  SANCTUARY_RESONANCES_REGISTRY,
  createDefaultCustomSanctuaryState,
  checkSanctuaryResonances,
  getCustomSanctuaryBuffTotals,
  canUpgradeSanctuaryVein,
  upgradeSanctuaryVein,
  canSocketArray,
  socketArrayIntoSanctuary,
  canUnsocketArray,
  unsocketArrayFromSanctuary,
  renameCustomSanctuary,
  generateCustomSanctuaryLocation,
  CUSTOM_SANCTUARY_LOCATION_ID
} from '@/lib/custom-sanctuary-logic';

export interface UseCustomSanctuaryActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  onNavigateToMeditation?: (locationId: string) => void;
}

export type UseCustomSanctuaryActionsReturn = ReturnType<typeof useCustomSanctuaryActions>;

export function useCustomSanctuaryActions({
  player,
  setPlayer,
  addLog,
  showToast,
  onNavigateToMeditation
}: UseCustomSanctuaryActionsParams) {
  // Modal & Selection state
  const [selectedSocketIndex, setSelectedSocketIndex] = useState<number | null>(null);
  const [isSelectArrayModalOpen, setIsSelectArrayModalOpen] = useState<boolean>(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');

  // 1. Sanctuary State
  const sanctuaryState: CustomSanctuaryState = useMemo(() => {
    return player.customSanctuary || createDefaultCustomSanctuaryState();
  }, [player.customSanctuary]);

  // 2. Active Buff Totals
  const buffTotals = useMemo(() => {
    return getCustomSanctuaryBuffTotals(sanctuaryState);
  }, [sanctuaryState]);

  // 3. Current & Next Vein Configs
  const currentVeinConfig: SanctuaryVeinTierConfig = useMemo(() => {
    return SANCTUARY_VEIN_CONFIG[sanctuaryState.veinTier] || SANCTUARY_VEIN_CONFIG[1];
  }, [sanctuaryState.veinTier]);

  const nextVeinTier = sanctuaryState.veinTier < 9
    ? ((sanctuaryState.veinTier + 1) as SanctuaryVeinTier)
    : null;

  const nextVeinConfig: SanctuaryVeinTierConfig | null = useMemo(() => {
    return nextVeinTier ? SANCTUARY_VEIN_CONFIG[nextVeinTier] : null;
  }, [nextVeinTier]);

  // 4. Upgrade Validation
  const upgradeValidation = useMemo(() => {
    return canUpgradeSanctuaryVein(player);
  }, [player]);

  // 5. Available Formations from inventory to socket
  const availableFormations = useMemo(() => {
    const list = player.inventory?.formations || [];
    return list.filter((f: FormationItem) => !f.isSocketedInSanctuary);
  }, [player.inventory?.formations]);

  // 6. Action: Upgrade Vein
  const handleUpgradeVein = useCallback(() => {
    const result = upgradeSanctuaryVein(player);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    setPlayer(result.updatedPlayer);
    showToast(result.message);
    addLog(
      'Linh Mạch Động Phủ',
      result.message,
      'garden'
    );
  }, [player, setPlayer, showToast, addLog]);

  // 7. Action: Socket Array into slot
  const handleSocketArray = useCallback((socketIndex: number, arrayItemId: string) => {
    const result = socketArrayIntoSanctuary(player, socketIndex, arrayItemId);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    setPlayer(result.updatedPlayer);
    setIsSelectArrayModalOpen(false);
    setSelectedSocketIndex(null);
    showToast(result.message);
    addLog(
      'Khảm Nạp Trận Bàn',
      result.message,
      'formation'
    );
  }, [player, setPlayer, showToast, addLog]);

  // 8. Action: Unsocket Array from slot
  const handleUnsocketArray = useCallback((socketIndex: number) => {
    const result = unsocketArrayFromSanctuary(player, socketIndex);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    setPlayer(result.updatedPlayer);
    showToast(result.message);
    addLog(
      'Tháo Gỡ Trận Bàn',
      result.message,
      'formation'
    );
  }, [player, setPlayer, showToast, addLog]);

  // 9. Action: Rename Sanctuary
  const handleRenameSanctuary = useCallback((newName: string) => {
    const result = renameCustomSanctuary(player, newName);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    setPlayer(result.updatedPlayer);
    setIsRenameModalOpen(false);
    showToast(result.message);
    addLog(
      'Danh Xưng Linh Địa',
      result.message,
      'garden'
    );
  }, [player, setPlayer, showToast, addLog]);

  // 10. Action: Quick Meditate at Sanctuary
  const handleQuickMeditateAtSanctuary = useCallback(() => {
    if (onNavigateToMeditation) {
      onNavigateToMeditation(CUSTOM_SANCTUARY_LOCATION_ID);
    } else {
      // Tự động gán locationId sang custom_sanctuary_location
      setPlayer(prev => ({
        ...prev,
        meditationLocationId: CUSTOM_SANCTUARY_LOCATION_ID
      }));
      showToast('Đã chuyển mục tiêu Nhập Định sang Linh Địa Độc Quyền!');
    }
  }, [onNavigateToMeditation, setPlayer, showToast]);

  return {
    sanctuaryState,
    buffTotals,
    currentVeinConfig,
    nextVeinConfig,
    upgradeValidation,
    availableFormations,
    selectedSocketIndex,
    setSelectedSocketIndex,
    isSelectArrayModalOpen,
    setIsSelectArrayModalOpen,
    isRenameModalOpen,
    setIsRenameModalOpen,
    tempName,
    setTempName,
    handleUpgradeVein,
    handleSocketArray,
    handleUnsocketArray,
    handleRenameSanctuary,
    handleQuickMeditateAtSanctuary
  };
}
