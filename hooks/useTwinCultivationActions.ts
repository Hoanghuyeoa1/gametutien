// hooks/useTwinCultivationActions.ts
// Hook chuyên trách điều phối Song Trục Tu Đạo: Nhục Thân (Tôi Thể) & Thần Hồn (Hồn Tu + Phân Thần Du Ngoạn)

import { useCallback } from 'react';
import { PlayerStats, ExpeditionDestinationId } from '@/lib/types';
import {
  canUpgradeSoulProgression,
  performUpgradeSoulProgression,
  startSoulExpedition,
  claimSoulExpedition
} from '@/lib/soul-cultivation-data';
import {
  canUpgradeBodyRefinement,
  performUpgradeBodyRefinement
} from '@/lib/body-soul-data';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';

interface UseTwinCultivationActionsProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  showToast: (msg: string) => void;
  addLog: (title: string, content: string, type: any) => void;
}

export function useTwinCultivationActions({
  player,
  setPlayer,
  showToast,
  addLog
}: UseTwinCultivationActionsProps) {
  // 1. Tôi Thể Nhục Thân (Thể Tu)
  const handleUpgradeBodyCultivation = useCallback(() => {
    const check = canUpgradeBodyRefinement(player);
    if (!check.canUpgrade) {
      showToast(check.reason);
      return;
    }

    const result = performUpgradeBodyRefinement(player);
    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error('Save failed during body refinement:', e);
    }
    showToast(result.message);
    addLog(
      result.success ? 'Tôi Thể Đột Phá' : 'Huyết Khí Thí Luyện',
      result.message,
      result.success ? 'physique' : 'danger'
    );
  }, [player, setPlayer, showToast, addLog]);

  // 2. Tôi Hồn Thần Thức (Hồn Tu)
  const handleSoulCultivateUpgrade = useCallback(() => {
    const check = canUpgradeSoulProgression(player);
    if (!check.canUpgrade) {
      showToast(check.reason);
      return;
    }

    const result = performUpgradeSoulProgression(player);
    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error('Save failed during soul upgrade:', e);
    }
    showToast(result.message);
    addLog(
      result.isBreakthrough ? 'Thần Hồn Đột Phá' : 'Tôi Hồn Thăng Tầng',
      result.message,
      result.success ? 'system' : 'danger'
    );
  }, [player, setPlayer, showToast, addLog]);

  // 3. Khởi hành Phân Thần Du Ngoạn
  const handleStartSoulExpedition = useCallback(
    (destination: ExpeditionDestinationId, hours: number) => {
      const result = startSoulExpedition(player, destination, hours);
      if (!result.success) {
        showToast(result.message);
        return;
      }

      const normalized = normalizePlayerData(result.updatedPlayer);
      setPlayer(normalized);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (e) {
        console.error('Save failed during expedition start:', e);
      }
      showToast(result.message);
      addLog('Phân Thần Xuất Hành', result.message, 'event');
    },
    [player, setPlayer, showToast, addLog]
  );

  // 4. Thu hồi Phân Thần Du Ngoạn
  const handleClaimSoulExpedition = useCallback(() => {
    const result = claimSoulExpedition(player);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error('Save failed during expedition claim:', e);
    }
    showToast(result.message);
    addLog('Thu Hồi Phân Thần', `Chiến lợi phẩm: ${result.rewardsSummary}`, 'reward');
  }, [player, setPlayer, showToast, addLog]);

  return {
    handleUpgradeBodyCultivation,
    handleSoulCultivateUpgrade,
    handleStartSoulExpedition,
    handleClaimSoulExpedition
  };
}
