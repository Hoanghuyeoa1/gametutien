// hooks/usePillTribulationActions.ts
// Custom Hook điều phối tính năng: Đan Lôi Kiếp & Đan Linh Hóa Hình
// (Pill Tribulation & Living Spirits Actions Hook)

import { useState, useCallback, useMemo } from 'react';
import { PlayerStats, Pill } from '@/lib/types';
import {
  PillTribulationEncounter,
  TribulationLightningWave,
  LightningDefenseResult,
  FinalizeTribulationResult,
  DanSpiritCompanion
} from '@/lib/types/pill-tribulation';
import {
  resolveLightningDefenseRound,
  finalizePillTribulation,
  TRIBULATION_INTENSITY_CONFIG
} from '@/lib/pill-tribulation-logic';
import { audioEngine } from '@/lib/audio-engine';

export interface UsePillTribulationActionsProps {
  player: PlayerStats;
  setPlayer: (player: PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'alchemy' | 'system' | 'danger') => void;
  onHarvestSuccess?: (result: any) => void;
}

export function usePillTribulationActions({
  player,
  setPlayer,
  showToast,
  addLog,
  onHarvestSuccess
}: UsePillTribulationActionsProps) {
  const [activeTribulation, setActiveTribulation] = useState<PillTribulationEncounter | null>(() => {
    return player.pillTribulationState?.activeTribulation || null;
  });

  const [activeBasePill, setActiveBasePill] = useState<Pill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isResolvingRound, setIsResolvingRound] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<FinalizeTribulationResult | null>(null);
  const [roundLogs, setRoundLogs] = useState<string[]>([]);

  // Đợt sét hiện tại
  const currentWaveData = useMemo<TribulationLightningWave | null>(() => {
    if (!activeTribulation || !activeTribulation.waves) return null;
    const idx = activeTribulation.currentWave - 1;
    return activeTribulation.waves[idx] || null;
  }, [activeTribulation]);

  // Thông tin Đạo Lữ đồng hành
  const companionInfo = useMemo(() => {
    const compKey = player.companionsState?.activeCompanionId;
    if (!compKey || !player.companionsState?.companions) return null;
    const comp = player.companionsState.companions[compKey];
    if (!comp) return null;

    const isFatigued = Boolean(comp.fatigueUntil && comp.fatigueUntil > Date.now());
    const remainingFatigueMinutes = isFatigued
      ? Math.ceil((comp.fatigueUntil! - Date.now()) / (60 * 1000))
      : 0;

    return {
      id: compKey,
      name: comp.name || compKey,
      affinity: comp.affinity || 0,
      isFatigued,
      remainingFatigueMinutes
    };
  }, [player.companionsState]);

  // Chi phí Hộ Trận hiện tại
  const formationCost = useMemo(() => {
    if (!activeTribulation) return 5000;
    return TRIBULATION_INTENSITY_CONFIG[activeTribulation.intensity]?.formationLinhThachCost || 5000;
  }, [activeTribulation]);

  // Khởi động trận lôi kiếp mới
  const startTribulation = useCallback((encounter: PillTribulationEncounter, basePill: Pill) => {
    setActiveTribulation(encounter);
    setActiveBasePill(basePill);
    setFinalResult(null);
    setRoundLogs([
      `⚡ Thiên kiếp giáng lâm! ${encounter.intensity === 'cuu_trong' ? 'Cửu Trọng Hỗn Độn Lôi Kiếp' : encounter.intensity === 'luc_trong' ? 'Lục Trọng Huyền Lôi' : 'Tam Trọng Lôi Kiếp'} đang bao trùm đan phòng!`
    ]);
    setIsModalOpen(true);
    audioEngine.playSFX('danger');
  }, []);

  // Thực thi chọn phương án hộ đan
  const handleChooseDefense = useCallback((choice: 'player' | 'companion' | 'formation') => {
    if (!activeTribulation || isResolvingRound || finalResult) return;

    setIsResolvingRound(true);
    audioEngine.playSFX('click');

    setTimeout(() => {
      const outcome: LightningDefenseResult = resolveLightningDefenseRound(
        player,
        activeTribulation,
        choice,
        companionInfo?.id
      );

      // Cập nhật người chơi
      setPlayer(outcome.updatedPlayer);

      setRoundLogs(prev => [
        `[Đợt ${activeTribulation.currentWave}/${activeTribulation.totalWaves}] ${outcome.logMessage}`,
        ...prev
      ]);

      if (choice === 'player' && outcome.success) {
        audioEngine.playSFX('breakthrough');
      } else if (choice === 'companion' && outcome.success) {
        audioEngine.playSFX('success');
      } else if (choice === 'formation' && outcome.success) {
        audioEngine.playSFX('levelup');
      } else {
        audioEngine.playSFX('danger');
      }

      // Nếu encounter kết thúc (thất bại hoặc vượt qua toàn bộ wave)
      if (outcome.encounterFinished) {
        const finalizeOutcome = finalizePillTribulation(
          outcome.updatedPlayer,
          activeTribulation,
          activeBasePill || activeTribulation.basePillItem
        );

        setFinalResult(finalizeOutcome);
        setPlayer(finalizeOutcome.updatedPlayer);

        if (finalizeOutcome.isFailed) {
          audioEngine.playSFX('danger');
          showToast?.('💥 Thiên kiếp bạo liệt! Đan lò rạn nứt, nhận Phế Đan Độc Dược.');
          addLog?.('Đan Lôi Kiếp', 'Thiên kiếp giáng thế đánh tan mẻ đan!', 'danger');
        } else if (finalizeOutcome.awakenedSpirit) {
          audioEngine.playSFX('legendary');
          showToast?.(`🌟 Đan Linh Nhi đã hóa hình xuất thế! Tự động phụ giúp Động Phủ.`);
          addLog?.('Đan Linh Hóa Hình', `Thần đan hấp thu lôi đình hóa hình thành Đan Linh Nhi!`, 'alchemy');
        } else {
          audioEngine.playSFX('legendary');
          showToast?.('🎉 Vượt thiên kiếp thành công! Thăng hoa 【Tiên Thiên Thần Đan】.');
          addLog?.('Tiên Thiên Thần Đan', `Đan dược vượt qua thiên kiếp, dược lực +50%, đan độc = 0.`, 'alchemy');
        }
      }

      setIsResolvingRound(false);
    }, 600);
  }, [
    activeTribulation,
    activeBasePill,
    player,
    companionInfo,
    isResolvingRound,
    finalResult,
    setPlayer,
    showToast,
    addLog
  ]);

  // Đóng modal kết thúc thiên kiếp
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveTribulation(null);
    setActiveBasePill(null);
    setFinalResult(null);
    setRoundLogs([]);
  }, []);

  return {
    activeTribulation,
    currentWaveData,
    companionInfo,
    formationCost,
    isModalOpen,
    isResolvingRound,
    finalResult,
    roundLogs,
    startTribulation,
    handleChooseDefense,
    handleCloseModal
  };
}
