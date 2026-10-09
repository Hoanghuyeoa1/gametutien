// hooks/useAncestralBlessingActions.ts
// Custom Domain Hook quản lý hành vi Dâng Hương Tông Tộc, Đạo Vận Tiên Bi & Hư Ảnh Bảo Mệnh

import { useState, useEffect, useMemo } from 'react';
import type { PlayerStats, LogType } from '@/lib/types';
import type { IncenseGrade, AncestralState, AggregatedAncestralResonance } from '@/lib/types/ancestral-blessing';
import {
  calculateAncestralResonance,
  performAncestralOffering,
  isOfferingBuffActive,
} from '@/lib/ancestral-blessing-logic';
import { INCENSE_OFFERINGS_CONFIG } from '@/lib/ancestral-blessing-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseAncestralBlessingActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  playSfx?: (sfx: any) => void;
}

export function useAncestralBlessingActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx
}: UseAncestralBlessingActionsParams) {
  const [localNow, setLocalNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setLocalNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ancestralState: AncestralState = player.ancestralState || {
    activeBuff: null,
    totalOfferingsMade: 0,
    protectionTriggersCount: 0,
  };

  const activeBuff = ancestralState.activeBuff;
  const isBuffActive = isOfferingBuffActive(activeBuff, localNow);

  // Tính toán Đạo Vận tổng hợp từ các kiếp tu
  const resonanceStats: AggregatedAncestralResonance = useMemo(() => {
    return calculateAncestralResonance(player.reincarnationState?.pastLives || []);
  }, [player.reincarnationState?.pastLives]);

  // Định dạng thời gian hương hỏa còn cháy
  const getRemainingBuffTime = (): string => {
    if (!activeBuff || !isBuffActive) {
      return 'Chưa thắp hương';
    }
    const diffMs = Math.max(0, activeBuff.expiresAt - localNow);
    const totalSec = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Hành động dâng hương
  const handlePerformOffering = (incenseId: IncenseGrade) => {
    const config = INCENSE_OFFERINGS_CONFIG[incenseId];
    if (!config) {
      showToast('Loại nhang cúng tế không hợp lệ!');
      return;
    }

    if (player.linhThach < config.costLinhThach) {
      showToast(`Không đủ Linh Thạch dâng hương! Cần ${config.costLinhThach.toLocaleString()} Linh Thạch.`);
      return;
    }

    const res = performAncestralOffering(player, incenseId, Date.now());
    if (res.success && res.updatedPlayer) {
      if (playSfx) {
        try {
          playSfx('bell');
        } catch {
          // ignore
        }
      }
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(res.message);
      addLog('Tông Tộc Tế Lễ', res.message, 'cultivate');
    } else {
      showToast(res.message);
    }
  };

  return {
    ancestralState,
    activeBuff,
    isBuffActive,
    resonanceStats,
    getRemainingBuffTime,
    handlePerformOffering,
  };
}
