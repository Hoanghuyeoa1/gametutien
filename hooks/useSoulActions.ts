// hooks/useSoulActions.ts
// Hook quản lý tương tác và trạng thái phân hệ Thức Hải Thần Hồn

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  SoulState
} from '@/lib/types/soul';
import {
  createDefaultSoulState,
  SOUL_REALMS
} from '@/lib/soul-data';
import {
  canBreakthroughSoulRealm,
  breakthroughSoulRealm,
  processMeditationTick,
  exorciseMentalDemon,
  equipSoulRelic,
  useSoulNourishingItem
} from '@/lib/soul-logic';

export interface UseSoulActionsProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, desc: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useSoulActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseSoulActionsProps) {
  const [isSoulModalOpen, setIsSoulModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'soul_sea' | 'demon_altar' | 'soul_hall'>('soul_sea');

  const soulState: SoulState = useMemo(() => {
    return player.soulState || createDefaultSoulState();
  }, [player.soulState]);

  const commitPlayerState = useCallback((updated: PlayerStats) => {
    setPlayer(updated);
  }, [setPlayer]);

  // 1. Phá Cảnh Đại Cảnh Giới Thần Hồn
  const handleSoulBreakthrough = useCallback(() => {
    const check = canBreakthroughSoulRealm(player);
    if (!check.canBreakthrough) {
      showToast(check.reason || 'Chưa đủ điều kiện độ kiếp Thần Hồn!');
      return;
    }

    const res = breakthroughSoulRealm(player);
    if (!res.success) {
      showToast(res.msg);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.msg);
    addLog('Độ Kiếp Thần Hồn', res.msg, 'breakthrough');
  }, [player, commitPlayerState, showToast, addLog]);

  // 2. Tĩnh Tọa Minh Tưởng Thức Hải
  const handleMeditateInSoulSea = useCallback(() => {
    const res = processMeditationTick(player, 1); // Minh tưởng nhanh 1 canh giờ
    commitPlayerState(res.updatedPlayer);
    showToast(res.msg[0]);
    for (const m of res.msg) {
      addLog('Tĩnh Tọa Thần Hồn', m, 'cultivate');
    }
  }, [player, commitPlayerState, showToast, addLog]);

  // 3. Trảm Diệt Tâm Ma / Thanh Tẩy
  const handleExorciseDemon = useCallback(() => {
    const res = exorciseMentalDemon(player);
    if (!res.success) {
      showToast(res.message);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.message);
    addLog('Trảm Ma Đoạn Niệm', res.message, 'battle');
  }, [player, commitPlayerState, showToast, addLog]);

  // 4. Trang Bị / Tháo Hồn Khí
  const handleEquipSoulRelic = useCallback((relicId: string) => {
    const res = equipSoulRelic(player, relicId);
    if (!res.success) {
      showToast(res.msg);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.msg);
  }, [player, commitPlayerState, showToast]);

  // 5. Dùng vật phẩm ôn dưỡng Thần Hồn
  const handleUseNourishingItem = useCallback((itemId: string, quantity = 1) => {
    const res = useSoulNourishingItem(player, itemId, quantity);
    if (!res.success) {
      showToast(res.msg);
      return;
    }

    commitPlayerState(res.updatedPlayer);
    showToast(res.msg);
    addLog('Ôn Dưỡng Hồn Phách', res.msg, 'item');
  }, [player, commitPlayerState, showToast, addLog]);

  // 6. Notification Checker
  const hasSoulNotification = useMemo(() => {
    const check = canBreakthroughSoulRealm(player);
    if (check.canBreakthrough && !check.isLockedByRealm) return true;

    // Cảnh báo nếu Tâm Ma tích lũy quá cao (> 50%)
    if ((soulState.mindState.demonCorruption || 0) >= 50) return true;

    // Thời gian offline tích lũy >= 4h
    const lastTime = soulState.lastMeditationTimestamp || Date.now();
    const hours = (Date.now() - lastTime) / (1000 * 60 * 60);
    if (hours >= 4) return true;

    return false;
  }, [player, soulState]);

  return {
    isSoulModalOpen,
    setIsSoulModalOpen,
    activeTab,
    setActiveTab,
    soulState,
    hasSoulNotification,

    // Actions
    handleSoulBreakthrough,
    handleMeditateInSoulSea,
    handleExorciseDemon,
    handleEquipSoulRelic,
    handleUseNourishingItem
  };
}
