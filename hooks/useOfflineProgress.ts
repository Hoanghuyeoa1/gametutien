// hooks/useOfflineProgress.ts
// Hook quản lý kiểm tra và xử lý tiến độ Bế Quan Ngoại Tuyến (AFK Offline Progress)

import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, LogType, OfflineProgressResult } from '@/lib/types';
import { calculateOfflineProgress, formatOfflineTime } from '@/lib/offline-progress';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { DEFAULT_HERBS, DEFAULT_ORES } from '@/lib/alchemy-data';
import { saveGameData } from '@/lib/save-migration';
import { applyMeditationProgressToPlayer } from '@/lib/meditation-logic';

export interface UseOfflineProgressParams {
  player: PlayerStats;
  isLoaded: boolean;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast?: (msg: string) => void;
}

export interface UseOfflineProgressReturn {
  offlineResult: OfflineProgressResult | null;
  showOfflineModal: boolean;
  setShowOfflineModal: (show: boolean) => void;
  claimOfflineRewards: () => void;
  dismissOfflineModal: () => void;
}

export function useOfflineProgress({
  player,
  isLoaded,
  setPlayer,
  addLog,
  showToast
}: UseOfflineProgressParams): UseOfflineProgressReturn {
  const [offlineResult, setOfflineResult] = useState<OfflineProgressResult | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const evaluatedRef = useRef<boolean>(false);

  // Đánh giá tiến độ ngoại tuyến một lần duy nhất khi game tải xong save data
  useEffect(() => {
    if (!isLoaded || evaluatedRef.current) return;
    evaluatedRef.current = true;

    const result = calculateOfflineProgress(player, Date.now());
    if (result && result.elapsedSeconds >= 60) {
      setOfflineResult(result);
      setShowOfflineModal(true);
    }
  }, [isLoaded, player]);

  // Lĩnh nhận toàn bộ thành quả bế quan
  const claimOfflineRewards = useCallback(() => {
    if (!offlineResult) return;

    setPlayer(prev => {
      let currentInv = prev.inventory || {
        pills: [],
        herbs: [],
        ores: [],
        manuals: [],
        equipments: [],
        books: [],
        bags: []
      };
      const maxCap = getMaxInventoryCapacity(prev);

      // Cộng dồn các vật phẩm cơ duyên vào túi trữ vật
      if (offlineResult.bonusItems && offlineResult.bonusItems.length > 0) {
        for (const item of offlineResult.bonusItems) {
          if (item.type === 'herb') {
            const baseHerb = DEFAULT_HERBS.find(h => h.id === item.id) || {
              id: item.id,
              name: item.name,
              grade: 'Nhất Giai',
              price: 30,
              description: 'Linh thảo thu hoạch ngoại tuyến',
              quantity: 0
            };
            const addRes = addItemToInventory(
              currentInv,
              maxCap,
              'herb',
              { ...baseHerb, quality: item.quality },
              item.quantity
            );
            if (addRes.success) {
              currentInv = addRes.inventory;
            }
          } else if (item.type === 'ore') {
            const baseOre = DEFAULT_ORES.find(o => o.id === item.id) || {
              id: item.id,
              name: item.name,
              grade: 'Nhất Giai',
              price: 50,
              description: 'Khoáng thạch thu hoạch ngoại tuyến',
              quantity: 0
            };
            const addRes = addItemToInventory(
              currentInv,
              maxCap,
              'ore',
              { ...baseOre, quality: item.quality },
              item.quantity
            );
            if (addRes.success) {
              currentInv = addRes.inventory;
            }
          }
        }
      }

      const updatedPlayer: PlayerStats = {
        ...prev,
        tuVi: prev.tuVi + offlineResult.tuViGained,
        linhThach: prev.linhThach + offlineResult.linhThachGained,
        linhDien: offlineResult.updatedLinhDien || prev.linhDien,
        cosmicState: offlineResult.updatedCosmicState || prev.cosmicState,
        customSectState: offlineResult.updatedCustomSectState || prev.customSectState,
        inventory: currentInv,
        lastActiveTimestamp: Date.now()
      };

      let finalPlayer = updatedPlayer;
      if (offlineResult.meditationOfflineResult) {
        finalPlayer = applyMeditationProgressToPlayer(finalPlayer, offlineResult.meditationOfflineResult);
        finalPlayer.meditationState = {
          isMeditating: false,
          startTime: 0,
          locationId: finalPlayer.meditationState?.locationId || 'linh_mach_tong_mon',
          stance: finalPlayer.meditationState?.stance || 'co_ban',
          wardItemId: finalPlayer.meditationState?.wardItemId || null
        };
      }

      // Ngay lập tức lưu lại vào localStorage
      saveGameData(finalPlayer);

      return finalPlayer;
    });

    // Thêm các bản ghi nhật ký tu tiên
    addLog?.(
      'Xuất Quan Bế Quan',
      `Đạo hữu đã hoàn tất bế quan ngoại tuyến ${formatOfflineTime(offlineResult.creditedSeconds)}, lĩnh hội +${offlineResult.tuViGained.toLocaleString()} Tu Vi và +${offlineResult.linhThachGained.toLocaleString()} Linh Thạch.`,
      'cultivate'
    );

    if (offlineResult.meditationOfflineResult) {
      const medRes = offlineResult.meditationOfflineResult;
      addLog?.(
        'Thu Hoạch Thiên Địa Nhập Định',
        `Nhập định ngoại tuyến hoàn tất (${medRes.effectiveHours}h hiệu lực)! Thu được +${medRes.totalTuviGained.toLocaleString()} Tu Vi, +${medRes.totalStonesGained.toLocaleString()} Linh Thạch${medRes.demonicCleanseTotal > 0 ? `, tẩy trừ ${medRes.demonicCleanseTotal} Ma Tính & ${medRes.toxicityCleanseTotal} Đan Độc` : ''}${medRes.appliedBreakthroughBuff ? ' [Kích hoạt buff Tâm Cảnh Thanh Lãng +15% Đột Phá]' : ''}.`,
        'cultivate'
      );
    }

    if (offlineResult.sectWarOfflineYield && offlineResult.sectWarOfflineYield.spiritStones > 0) {
      addLog?.(
        'Linh Sơn Sản Lượng',
        `Chiếm lĩnh ${offlineResult.sectWarOfflineYield.controlledMountainsCount} cứ điểm Linh Sơn dã ngoại mang về +${offlineResult.sectWarOfflineYield.spiritStones.toLocaleString()} Linh Thạch cho Khố Phòng Tông Môn!`,
        'sect'
      );
    }

    if (offlineResult.maturedPlotsCount > 0) {
      addLog?.(
        'Dược Điền Thành Thục',
        `Có ${offlineResult.maturedPlotsCount} ô linh thảo tại Linh Điền đã chín mùi trong thời gian bế quan!`,
        'garden'
      );
    }

    if (offlineResult.bonusItems && offlineResult.bonusItems.length > 0) {
      const dropSummary = offlineResult.bonusItems.map(i => `${i.name} x${i.quantity}`).join(', ');
      addLog?.(
        'Cơ Duyên Ngoại Tuyến',
        `Bế quan xuất thần nhặt được cơ duyên thiên địa: ${dropSummary}`,
        'system'
      );
    }

    showToast?.(`Đã thu hoạch +${offlineResult.tuViGained.toLocaleString()} Tu Vi ngoại tuyến!`);

    setShowOfflineModal(false);
    setOfflineResult(null);
  }, [offlineResult, setPlayer, addLog, showToast]);

  // Đóng modal tự động lĩnh nhận
  const dismissOfflineModal = useCallback(() => {
    claimOfflineRewards();
  }, [claimOfflineRewards]);

  return {
    offlineResult,
    showOfflineModal,
    setShowOfflineModal,
    claimOfflineRewards,
    dismissOfflineModal
  };
}
