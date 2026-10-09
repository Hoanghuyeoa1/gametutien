// hooks/useAchievements.ts
// Hook quản lý Hệ Thống Thành Tựu & Danh Hiệu Tiên Giới (Achievements & Titles)

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  PlayerStats,
  LogType,
  AchievementCategory,
  TitleDefinition
} from '@/lib/types';
import {
  ACHIEVEMENTS_CONFIG,
  TITLES_CONFIG,
  isAchievementCompleted,
  isAchievementClaimed,
  getUnclaimedAchievementsCount,
  getTitleDefinition,
  createDefaultAchievementsState
} from '@/lib/achievements-data';
import { saveGameData } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface UseAchievementsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast?: (msg: string) => void;
}

export interface UseAchievementsReturn {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  activeTab: 'achievements' | 'titles';
  setActiveTab: (tab: 'achievements' | 'titles') => void;
  selectedCategory: AchievementCategory | 'all';
  setSelectedCategory: (cat: AchievementCategory | 'all') => void;
  claimAchievement: (achId: string) => boolean;
  claimAllAchievements: () => number;
  equipTitle: (titleId: string | null) => void;
  unclaimedCount: number;
  activeTitle: TitleDefinition | null;
}

export function useAchievements({
  player,
  setPlayer,
  addLog,
  showToast
}: UseAchievementsParams): UseAchievementsReturn {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'achievements' | 'titles'>('achievements');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  // Đếm số lượng thành tựu đã xong nhưng chưa nhận thưởng
  const unclaimedCount = useMemo(() => {
    return getUnclaimedAchievementsCount(player);
  }, [player]);

  // Thông tin danh hiệu đang trang bị
  const activeTitle = useMemo(() => {
    return getTitleDefinition(player.achievementsState?.equippedTitleId);
  }, [player.achievementsState?.equippedTitleId]);

  // Tự động quét và phát hiện thành tựu mới hoàn thành trong thời gian thực
  const completedIdsRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    const currentCompleted = new Set(
      ACHIEVEMENTS_CONFIG.filter(ach => isAchievementCompleted(ach, player)).map(ach => ach.id)
    );

    // Bỏ qua lần đầu tiên khởi chạy ứng dụng để tránh spam toast
    if (completedIdsRef.current === null) {
      completedIdsRef.current = currentCompleted;
      return;
    }

    // Tìm thành tựu mới hoàn thành
    for (const ach of ACHIEVEMENTS_CONFIG) {
      if (currentCompleted.has(ach.id) && !completedIdsRef.current.has(ach.id)) {
        if (!isAchievementClaimed(ach.id, player)) {
          showToast?.(`🏆 Đạt thành tựu mới: [${ach.name}]!`);
          addLog?.(
            `🏆 THÀNH TỰU ĐẠT ĐƯỢC: [${ach.name}]`,
            `Đạo hữu đã thỏa mãn điều kiện thành tựu "${ach.name}" (${ach.description}). Hãy mở giao diện Thành Tựu để nhận thưởng!`,
            'system'
          );
          audioEngine.playBreakthroughSuccessSound(0.5);
        }
      }
    }
    completedIdsRef.current = currentCompleted;
  }, [player, showToast, addLog]);

  // 1. Lĩnh nhận thưởng một thành tựu đơn lẻ
  const claimAchievement = useCallback((achId: string): boolean => {
    const ach = ACHIEVEMENTS_CONFIG.find(a => a.id === achId);
    if (!ach) return false;

    if (!isAchievementCompleted(ach, player)) {
      showToast?.('Chưa đạt điều kiện hoàn thành thành tựu này!');
      return false;
    }

    if (isAchievementClaimed(achId, player)) {
      showToast?.('Thành tựu này đã được lĩnh nhận phần thưởng trước đó!');
      return false;
    }

    setPlayer(prev => {
      const currentAchState = prev.achievementsState || createDefaultAchievementsState();
      const updatedClaimed = [...(currentAchState.claimedAchievementIds || []), achId];
      const updatedUnlockedTitles = [...(currentAchState.unlockedTitleIds || [])];

      let newTitleUnlockedName = '';
      if (ach.unlockedTitleId && !updatedUnlockedTitles.includes(ach.unlockedTitleId)) {
        updatedUnlockedTitles.push(ach.unlockedTitleId);
        const titleDef = TITLES_CONFIG[ach.unlockedTitleId];
        if (titleDef) {
          newTitleUnlockedName = titleDef.name;
        }
      }

      const updatedPlayer: PlayerStats = {
        ...prev,
        tuVi: prev.tuVi + (ach.rewardTuVi || 0),
        linhThach: prev.linhThach + (ach.rewardLinhThach || 0),
        khiVan: (prev.khiVan || 50) + (ach.rewardKhiVan || 0),
        achievementsState: {
          ...currentAchState,
          claimedAchievementIds: updatedClaimed,
          unlockedTitleIds: updatedUnlockedTitles
        }
      };

      saveGameData(updatedPlayer);

      // Nhật ký & Thông báo
      const rewardsText: string[] = [];
      if (ach.rewardTuVi) rewardsText.push(`+${ach.rewardTuVi.toLocaleString()} Tu Vi`);
      if (ach.rewardLinhThach) rewardsText.push(`+${ach.rewardLinhThach.toLocaleString()} Linh Thạch`);
      if (ach.rewardKhiVan) rewardsText.push(`+${ach.rewardKhiVan} Khí Vận`);
      if (newTitleUnlockedName) rewardsText.push(`Mở khóa Danh Hiệu [${newTitleUnlockedName}]`);

      addLog?.(
        `🏆 THÀNH TỰU TIÊN GIỚI: [${ach.name}]`,
        `Đạo hữu đã hoàn thành thành tựu "${ach.name}"!\nPhần thưởng: ${rewardsText.join(', ')}.`,
        'system'
      );

      showToast?.(`Đã lĩnh thưởng thành tựu [${ach.name}]!`);
      audioEngine.playBreakthroughSuccessSound(0.7);

      return updatedPlayer;
    });

    return true;
  }, [player, setPlayer, addLog, showToast]);

  // 2. Lĩnh nhận toàn bộ thành tựu hoàn thành trong một lần bấm
  const claimAllAchievements = useCallback((): number => {
    const unclaimedAchs = ACHIEVEMENTS_CONFIG.filter(
      ach => isAchievementCompleted(ach, player) && !isAchievementClaimed(ach.id, player)
    );

    if (unclaimedAchs.length === 0) {
      showToast?.('Không có thành tựu nào mới cần lĩnh nhận!');
      return 0;
    }

    let totalTuVi = 0;
    let totalLinhThach = 0;
    let totalKhiVan = 0;
    const newUnlockedTitleIds: string[] = [];
    const newClaimedIds: string[] = [];

    unclaimedAchs.forEach(ach => {
      newClaimedIds.push(ach.id);
      totalTuVi += ach.rewardTuVi || 0;
      totalLinhThach += ach.rewardLinhThach || 0;
      totalKhiVan += ach.rewardKhiVan || 0;
      if (ach.unlockedTitleId && !newUnlockedTitleIds.includes(ach.unlockedTitleId)) {
        newUnlockedTitleIds.push(ach.unlockedTitleId);
      }
    });

    setPlayer(prev => {
      const currentAchState = prev.achievementsState || createDefaultAchievementsState();
      const updatedClaimed = Array.from(new Set([...(currentAchState.claimedAchievementIds || []), ...newClaimedIds]));
      const updatedUnlockedTitles = Array.from(new Set([...(currentAchState.unlockedTitleIds || []), ...newUnlockedTitleIds]));

      const updatedPlayer: PlayerStats = {
        ...prev,
        tuVi: prev.tuVi + totalTuVi,
        linhThach: prev.linhThach + totalLinhThach,
        khiVan: (prev.khiVan || 50) + totalKhiVan,
        achievementsState: {
          ...currentAchState,
          claimedAchievementIds: updatedClaimed,
          unlockedTitleIds: updatedUnlockedTitles
        }
      };

      saveGameData(updatedPlayer);

      addLog?.(
        '🏆 LĨNH NHẬN TOÀN BỘ THÀNH TỰU',
        `Đã hoàn tất lĩnh nhận ${unclaimedAchs.length} mốc thành tựu!\nTổng thu: +${totalTuVi.toLocaleString()} Tu Vi, +${totalLinhThach.toLocaleString()} Linh Thạch, +${totalKhiVan} Khí Vận.`,
        'system'
      );

      showToast?.(`Đã lĩnh trọn ${unclaimedAchs.length} thành tựu tiên giới!`);
      audioEngine.playBreakthroughSuccessSound(1.0);

      return updatedPlayer;
    });

    return unclaimedAchs.length;
  }, [player, setPlayer, addLog, showToast]);

  // 3. Trang bị hoặc tháo bỏ danh hiệu
  const equipTitle = useCallback((titleId: string | null) => {
    setPlayer(prev => {
      const currentAchState = prev.achievementsState || createDefaultAchievementsState();

      if (titleId !== null) {
        // Kiểm tra xem đã mở khóa chưa
        const isUnlocked = (currentAchState.unlockedTitleIds || []).includes(titleId);
        if (!isUnlocked) {
          showToast?.('Chưa mở khóa danh hiệu này!');
          return prev;
        }
      }

      const updatedPlayer: PlayerStats = {
        ...prev,
        achievementsState: {
          ...currentAchState,
          equippedTitleId: titleId
        }
      };

      saveGameData(updatedPlayer);

      if (titleId) {
        const titleDef = TITLES_CONFIG[titleId];
        showToast?.(`Đã trang bị danh hiệu [${titleDef?.name || titleId}]!`);
        addLog?.(
          'Trang Bị Danh Hiệu',
          `Đạo hữu đã đính kèm danh hiệu Tiên Giới: [${titleDef?.name || titleId}]! Các thuộc tính gia trì đã có hiệu lực.`,
          'system'
        );
      } else {
        showToast?.('Đã tháo gỡ danh hiệu hiển thị.');
      }

      audioEngine.playClickSound(0.7);

      return updatedPlayer;
    });
  }, [setPlayer, addLog, showToast]);

  return {
    showModal,
    setShowModal,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    claimAchievement,
    claimAllAchievements,
    equipTitle,
    unclaimedCount,
    activeTitle
  };
}
