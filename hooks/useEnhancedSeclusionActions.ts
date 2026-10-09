// hooks/useEnhancedSeclusionActions.ts
// Custom Hook cho Phân Hệ "Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh"

import { useState, useMemo } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  DAO_SEEDS_REGISTRY,
  canEnterEnhancedSeclusion,
  executeEnhancedSeclusion,
  consumeDaoFruit
} from '@/lib/seclusion-enhancement-logic';
import {
  SeclusionExecutionResult,
  EnhancedSeclusionValidation,
  DaoSeedConfig
} from '@/lib/types/seclusion-enhancement';
import { calculateEffectiveLifespan } from '@/lib/lifespan-logic';

export interface UseEnhancedSeclusionActionsProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useEnhancedSeclusionActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseEnhancedSeclusionActionsProps) {
  // Modal states
  const [isSeclusionModalOpen, setIsSeclusionModalOpen] = useState<boolean>(false);
  const [showHarvestModal, setShowHarvestModal] = useState<boolean>(false);
  const [lastHarvestResult, setLastHarvestResult] = useState<SeclusionExecutionResult | null>(null);

  // Configuration states before secluding
  const [targetYears, setTargetYears] = useState<number>(10);
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>(
    player.activeDaoSeed?.seedId || player.activeSeclusionSeed?.seedId || null
  );
  const [nourishRatio, setNourishRatio] = useState<number>(
    player.natalArtifact?.spirit ? 20 : 0
  );

  // Remaining lifespan calculations
  const maxLifespan = useMemo(() => calculateEffectiveLifespan(player), [player]);
  const currentAge = player.age || 16;
  const remainingYears = useMemo(() => Math.max(0, maxLifespan - currentAge), [maxLifespan, currentAge]);

  // Validation & Previews
  const validation: EnhancedSeclusionValidation = useMemo(() => {
    return canEnterEnhancedSeclusion(player, targetYears, selectedSeedId || undefined, nourishRatio);
  }, [player, targetYears, selectedSeedId, nourishRatio]);

  // Preview calculations
  const preview = useMemo(() => {
    const curToxicity = player.pillToxicity || 0;
    const estimatedCleansed = Math.min(curToxicity, targetYears * 2);
    const estimatedNewToxicity = Math.max(0, curToxicity - estimatedCleansed);
    const estimatedNewPurity = Math.max(10, Math.min(100, 100 - estimatedNewToxicity));

    const activeSeed = selectedSeedId ? DAO_SEEDS_REGISTRY[selectedSeedId] : null;
    const currentAccum = (player.activeDaoSeed?.seedId === selectedSeedId ? player.activeDaoSeed.accumulatedYears : 0) ||
      (player.activeSeclusionSeed?.seedId === selectedSeedId ? player.activeSeclusionSeed.accumulatedYears : 0);
    const nextAccum = currentAccum + targetYears;
    const isSeedWillMature = Boolean(activeSeed && nextAccum >= activeSeed.requiredYears);

    return {
      curToxicity,
      estimatedCleansed,
      estimatedNewToxicity,
      estimatedNewPurity,
      activeSeed,
      currentAccum,
      nextAccum,
      isSeedWillMature,
      hasNatalSpirit: Boolean(player.natalArtifact?.spirit),
      costLinhThach: validation.costLinhThach,
      costTichCocDan: validation.costTichCocDan,
      canAfford: validation.canAfford
    };
  }, [player, targetYears, selectedSeedId, nourishRatio, validation]);

  // Open & Close handlers
  const openSeclusionModal = () => {
    // Tự động đồng bộ seed đang gieo dở nếu có
    const active = player.activeDaoSeed?.seedId || player.activeSeclusionSeed?.seedId;
    if (active && DAO_SEEDS_REGISTRY[active]) {
      setSelectedSeedId(active);
    }
    setIsSeclusionModalOpen(true);
  };

  const closeSeclusionModal = () => {
    setIsSeclusionModalOpen(false);
  };

  const closeHarvestModal = () => {
    setShowHarvestModal(false);
    setLastHarvestResult(null);
  };

  // Thực thi bế quan Tam Hóa Quy Nguyên
  const handleExecuteEnhancedSeclusion = () => {
    if (!validation.canSeclude) {
      showToast(validation.reason || 'Không đủ điều kiện bế quan!');
      return;
    }

    const { updatedPlayer, result } = executeEnhancedSeclusion(
      player,
      targetYears,
      selectedSeedId || undefined,
      nourishRatio
    );

    if (!result.success) {
      showToast(result.logs[0] || 'Bế quan thất bại!');
      return;
    }

    // Ghi chép nhật ký đại đạo
    addLog(
      'Tuế Nguyệt Bế Quan',
      `Nhập định ${targetYears} năm thành công. Đan độc tẩy trừ: -${result.toxicityCleansed}, Chân Nguyên thuần khiết: ${result.newQiPurity}%. Tu Vi thu hoạch: +${result.tuviGainedPlayer.toLocaleString()}.${result.maturedDaoFruit ? ` Ngưng tụ thành công 【${result.maturedDaoFruit.name}】!` : ''}`,
      'cultivation'
    );

    setPlayer(updatedPlayer);
    setLastHarvestResult(result);
    setIsSeclusionModalOpen(false);
    setShowHarvestModal(true);

    showToast(`🧘 Bế quan ${targetYears} năm viên mãn!`);
  };

  // Phục dụng Đạo Quả
  const handleConsumeDaoFruit = (fruitId: string) => {
    const res = consumeDaoFruit(player, fruitId);
    if (!res.success) {
      showToast(res.message);
      return;
    }

    setPlayer(res.updatedPlayer);
    showToast(res.message);
    addLog(
      'Phục Dụng Đạo Quả',
      res.message,
      'breakthrough'
    );
  };

  return {
    isSeclusionModalOpen,
    showHarvestModal,
    lastHarvestResult,
    targetYears,
    selectedSeedId,
    nourishRatio,
    maxLifespan,
    remainingYears,
    validation,
    preview,
    setTargetYears,
    setSelectedSeedId,
    setNourishRatio,
    openSeclusionModal,
    closeSeclusionModal,
    closeHarvestModal,
    handleExecuteEnhancedSeclusion,
    handleConsumeDaoFruit
  };
}
