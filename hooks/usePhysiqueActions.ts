// hooks/usePhysiqueActions.ts
// Hook quản lý toàn bộ phân hệ "Huyền Công Luyện Thể" (Expanded Physique System)

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  PhysiqueState,
  PhysiquePart
} from '@/lib/types/physique';
import {
  createDefaultPhysiqueState,
  PHYSIQUE_REALMS,
  PHYSIQUE_PARTS_CONFIG
} from '@/lib/physique-system-data';
import {
  calculateTotalPhysiqueStats,
  processPhysiquePassiveTick,
  canBreakthroughPhysiqueRealm,
  breakthroughPhysiqueRealm,
  upgradePhysiquePart,
  usePhysiqueItem
} from '@/lib/physique-logic';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UsePhysiqueActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function usePhysiqueActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UsePhysiqueActionsParams) {
  const [isPhysiqueModalOpen, setIsPhysiqueModalOpen] = useState<boolean>(false);
  const [selectedPartId, setSelectedPartId] = useState<string>('bi');

  const physiqueState: PhysiqueState = useMemo(() => {
    return player.physiqueState || createDefaultPhysiqueState();
  }, [player.physiqueState]);

  // Helper commit state
  const commitPlayerState = useCallback((updatedPlayer: PlayerStats) => {
    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }, [setPlayer]);

  // Passive AFK Ticker (Runs every 10s or when modal is opened)
  const handlePassivePhysiqueTick = useCallback(() => {
    const res = processPhysiquePassiveTick(player);
    if (res.expGained > 0) {
      commitPlayerState(res.updatedPlayer);
    }
  }, [player, commitPlayerState]);

  useEffect(() => {
    if (!isPhysiqueModalOpen) return;
    handlePassivePhysiqueTick();
    const interval = setInterval(handlePassivePhysiqueTick, 10000);
    return () => clearInterval(interval);
  }, [isPhysiqueModalOpen, handlePassivePhysiqueTick]);

  // 1. Đột phá đại cảnh giới Nhục Thân
  const handleBreakthroughRealm = () => {
    const check = canBreakthroughPhysiqueRealm(player);
    if (!check.canBreakthrough) {
      showToast(check.reason);
      return;
    }

    const res = breakthroughPhysiqueRealm(player);
    if (!res.success) {
      showToast(res.msg);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.msg);
    addLog('Huyền Công Luyện Thể', res.msg, 'physique');
  };

  // 2. Cường hóa bộ phận
  const handleUpgradePart = (partId: string) => {
    const res = upgradePhysiquePart(player, partId);
    if (!res.success) {
      showToast(res.msg);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.msg);
    addLog('Cường Hóa Nhục Thân', res.msg, 'physique');
  };

  // 3. Sử dụng vật phẩm luyện thể
  const handleUsePhysiqueItem = (itemId: string, quantity: number = 1) => {
    const res = usePhysiqueItem(player, itemId, quantity);
    if (!res.success) {
      showToast(res.msg);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.msg);
    addLog('Thu Nạp Luyện Thể', res.msg, 'physique');
  };

  // 4. Notification dot checker
  const hasPhysiqueNotification = useMemo(() => {
    const check = canBreakthroughPhysiqueRealm(player);
    if (check.canBreakthrough && !check.isLockedByRealm) return true;

    // Check if player has enough materials to upgrade at least 1 part
    const parts = physiqueState.parts || [];
    for (const part of parts) {
      const cfg = PHYSIQUE_PARTS_CONFIG[part.id];
      if (!cfg || part.level >= cfg.maxLevel) continue;
      const costLinhThach = Math.floor(cfg.baseCostLinhThach * Math.pow(cfg.costMultiplier, part.level));
      if (player.linhThach >= costLinhThach) {
        if (cfg.requiredMaterialId === 'tinhHuyet' && (player.tinhHuyetYeuThu || 0) >= 1) {
          return true;
        }
      }
    }

    return false;
  }, [player, physiqueState]);

  return {
    isPhysiqueModalOpen,
    setIsPhysiqueModalOpen,
    selectedPartId,
    setSelectedPartId,
    physiqueState,
    hasPhysiqueNotification,

    // Actions
    handlePassivePhysiqueTick,
    handleBreakthroughRealm,
    handleUpgradePart,
    handleUsePhysiqueItem
  };
}
