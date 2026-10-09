// hooks/useHeavenlyFlameActions.ts
// Custom Hook điều phối tính năng: Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats } from '@/lib/types';
import {
  HeavenlyFlameConfig,
  PlayerFlameInstance,
  HeavenlyFlameState
} from '@/lib/types/heavenly-flame';
import {
  HEAVENLY_FLAMES_REGISTRY,
  DEFAULT_MORTAL_FLAME,
  feedHeavenlyFlame,
  unlockHeavenlyFlame,
  createDefaultHeavenlyFlameState
} from '@/lib/heavenly-flame-logic';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface UseHeavenlyFlameActionsProps {
  player: PlayerStats;
  setPlayer: (player: PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'alchemy' | 'system' | 'danger') => void;
}

export function useHeavenlyFlameActions({
  player,
  setPlayer,
  showToast,
  addLog
}: UseHeavenlyFlameActionsProps) {
  // Trạng thái Dị Hỏa an toàn từ player.flameState
  const flameState: HeavenlyFlameState = useMemo(() => {
    return player.flameState || createDefaultHeavenlyFlameState();
  }, [player.flameState]);

  // Cấu hình ngọn Dị Hỏa đang trang bị (fallback về Phàm Hỏa Cơ Bản nếu null)
  const equippedFlameConfig: HeavenlyFlameConfig = useMemo(() => {
    if (!flameState.equippedFlameId) return DEFAULT_MORTAL_FLAME;
    return HEAVENLY_FLAMES_REGISTRY[flameState.equippedFlameId] || DEFAULT_MORTAL_FLAME;
  }, [flameState.equippedFlameId]);

  // Instance thực thể Dị Hỏa của người chơi
  const equippedFlameInstance: PlayerFlameInstance | null = useMemo(() => {
    if (!flameState.equippedFlameId) return null;
    return flameState.unlockedFlames[flameState.equippedFlameId] || null;
  }, [flameState.equippedFlameId, flameState.unlockedFlames]);

  // Danh sách toàn bộ cấu hình Dị Hỏa trong Thiên Địa
  const allFlamesList: HeavenlyFlameConfig[] = useMemo(() => {
    return Object.values(HEAVENLY_FLAMES_REGISTRY);
  }, []);

  // Danh sách Dị Hỏa người chơi đã thuần phục
  const unlockedFlamesMap = flameState.unlockedFlames || {};

  /**
   * Thao tác đổi hoặc gỡ Dị Hỏa (Zero-latency recalculation)
   */
  const handleEquipFlame = useCallback(
    (flameId: string | null) => {
      if (flameId !== null && !flameState.unlockedFlames[flameId]) {
        showToast?.('⚠️ Ngươi chưa thuần phục Dị Hỏa này!');
        return;
      }

      const updatedFlameState: HeavenlyFlameState = {
        ...flameState,
        equippedFlameId: flameId
      };

      const updatedPlayer: PlayerStats = {
        ...player,
        flameState: updatedFlameState
      };

      const normalized = normalizePlayerData(updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      audioEngine.playSFX('alchemy');
      if (flameId === null) {
        showToast?.('🔥 Đã tháo Dị Hỏa, đan lò chuyển về sử dụng Phàm Hỏa Cơ Bản.');
        addLog?.('Thay Đổi Đan Hỏa', 'Đan lò trở về dùng Phàm Hỏa Cơ Bản.', 'system');
      } else {
        const targetConf = HEAVENLY_FLAMES_REGISTRY[flameId];
        const flameName = targetConf ? targetConf.name : flameId;
        showToast?.(`🔥 Đã dẫn nhập [${flameName}] vào Đan Lò!`);
        addLog?.('Khảm Nạp Dị Hỏa', `Đã dẫn nhập [${flameName}] vào Đan Lò trợ lực luyện đan.`, 'alchemy');
      }
    },
    [flameState, player, setPlayer, showToast, addLog]
  );

  /**
   * Cho Dị Hỏa hấp thu khoáng thạch để tăng EXP & thăng cấp
   */
  const handleFeedFlameWithOre = useCallback(
    (flameId: string, oreItemId: string, count: number) => {
      const currentInstance = flameState.unlockedFlames[flameId];
      if (!currentInstance) {
        showToast?.('⚠️ Dị Hỏa chưa được thuần phục!');
        return;
      }

      if (currentInstance.tier >= 9 && currentInstance.currentExp >= currentInstance.maxExp) {
        showToast?.('🌟 Dị Hỏa này đã đạt Cửu Giai Cực Hạn, không thể thăng cấp thêm!');
        return;
      }

      const invOres = player.inventory?.ores || [];
      const targetOre = invOres.find(o => o.id === oreItemId);
      if (!targetOre || targetOre.quantity < count || count <= 0) {
        showToast?.('⚠️ Không đủ số lượng khoáng thạch trong Túi Trữ Vật!');
        return;
      }

      // Xác định phẩm cấp khoáng thạch
      let oreTier = 1;
      const gradeStr = String(targetOre.grade || '');
      if (gradeStr.includes('Cửu') || gradeStr.includes('9')) oreTier = 9;
      else if (gradeStr.includes('Bát') || gradeStr.includes('8')) oreTier = 8;
      else if (gradeStr.includes('Thất') || gradeStr.includes('7')) oreTier = 7;
      else if (gradeStr.includes('Lục') || gradeStr.includes('6')) oreTier = 6;
      else if (gradeStr.includes('Ngũ') || gradeStr.includes('5')) oreTier = 5;
      else if (gradeStr.includes('Tứ') || gradeStr.includes('4')) oreTier = 4;
      else if (gradeStr.includes('Tam') || gradeStr.includes('3')) oreTier = 3;
      else if (gradeStr.includes('Nhị') || gradeStr.includes('2')) oreTier = 2;

      // Thực thi logic ôn dưỡng
      const feedResult = feedHeavenlyFlame(currentInstance, 'mineral', count, oreTier);

      // Trừ khoáng thạch
      const updatedOres = invOres
        .map(o => {
          if (o.id === oreItemId) {
            return { ...o, quantity: o.quantity - count };
          }
          return o;
        })
        .filter(o => o.quantity > 0);

      const updatedFlameState: HeavenlyFlameState = {
        ...flameState,
        unlockedFlames: {
          ...flameState.unlockedFlames,
          [flameId]: feedResult.updatedFlame
        }
      };

      const currentInv = player.inventory || { pills: [], herbs: [], ores: [] };
      const updatedPlayer: PlayerStats = {
        ...player,
        inventory: {
          ...currentInv,
          pills: currentInv.pills || [],
          herbs: currentInv.herbs || [],
          ores: updatedOres
        },
        flameState: updatedFlameState
      };

      const normalized = normalizePlayerData(updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      const flameConfig = HEAVENLY_FLAMES_REGISTRY[flameId];
      const flameName = flameConfig?.name || flameId;
      audioEngine.playSFX('alchemy');

      if (feedResult.isLeveledUp) {
        showToast?.(`🌟 [${flameName}] thăng hoa đột phá lên Giai Thứ ${feedResult.updatedFlame.tier}!`);
        addLog?.('Dị Hỏa Tiến Hóa', `[${flameName}] đột phá Giai Thứ ${feedResult.updatedFlame.tier}! Uy lực gia tăng.`, 'alchemy');
      } else {
        showToast?.(`🔥 [${flameName}] hấp thu ${count}x ${targetOre.name}, thu hoạch ${feedResult.expGained} EXP!`);
      }

      if (feedResult.newAurasUnlocked.length > 0) {
        showToast?.(`✨ Mở khóa ${feedResult.newAurasUnlocked.length} tầng Aura Đan Đạo mới!`);
      }
    },
    [flameState, player, setPlayer, showToast, addLog]
  );

  /**
   * Trích xuất Chân Nguyên / Tu Vi của người chơi để nuôi Dị Hỏa
   */
  const handleFeedFlameWithTuVi = useCallback(
    (flameId: string, tuviAmount: number) => {
      const currentInstance = flameState.unlockedFlames[flameId];
      if (!currentInstance) {
        showToast?.('⚠️ Dị Hỏa chưa được thuần phục!');
        return;
      }

      if (currentInstance.tier >= 9 && currentInstance.currentExp >= currentInstance.maxExp) {
        showToast?.('🌟 Dị Hỏa này đã đạt Cửu Giai Cực Hạn, không thể thăng cấp thêm!');
        return;
      }

      if (player.tuVi < tuviAmount || tuviAmount <= 0) {
        showToast?.('⚠️ Tu Vi hiện tại không đủ để trích xuất Chân Nguyên!');
        return;
      }

      const feedResult = feedHeavenlyFlame(currentInstance, 'tuvi', tuviAmount);

      const updatedFlameState: HeavenlyFlameState = {
        ...flameState,
        unlockedFlames: {
          ...flameState.unlockedFlames,
          [flameId]: feedResult.updatedFlame
        }
      };

      const updatedPlayer: PlayerStats = {
        ...player,
        tuVi: Math.max(0, player.tuVi - tuviAmount),
        flameState: updatedFlameState
      };

      const normalized = normalizePlayerData(updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      const flameConfig = HEAVENLY_FLAMES_REGISTRY[flameId];
      const flameName = flameConfig?.name || flameId;
      audioEngine.playSFX('alchemy');

      if (feedResult.isLeveledUp) {
        showToast?.(`🌟 [${flameName}] đột phá lên Giai Thứ ${feedResult.updatedFlame.tier}!`);
        addLog?.('Dị Hỏa Đột Phá', `Trích xuất ${tuviAmount} Tu Vi giúp [${flameName}] đột phá Giai ${feedResult.updatedFlame.tier}!`, 'alchemy');
      } else {
        showToast?.(`⚡ Trích xuất ${tuviAmount} Chân Nguyên, [${flameName}] thu hoạch ${feedResult.expGained} EXP!`);
      }

      if (feedResult.newAurasUnlocked.length > 0) {
        showToast?.(`✨ Mở khóa ${feedResult.newAurasUnlocked.length} Aura Đan Đạo mới!`);
      }
    },
    [flameState, player, setPlayer, showToast, addLog]
  );

  /**
   * Dung hợp / Mở khóa mồi lửa mới nhặt được từ Bí Cảnh / Boss / Sự Kiện
   */
  const handleUnlockFlame = useCallback(
    (flameId: string) => {
      const config = HEAVENLY_FLAMES_REGISTRY[flameId];
      if (!config) {
        showToast?.('⚠️ Không tìm thấy mồi Dị Hỏa tương ứng trong trời đất!');
        return;
      }

      if (flameState.unlockedFlames[flameId]) {
        showToast?.(`ℹ️ Ngươi đã từng thuần phục [${config.name}] từ trước.`);
        return;
      }

      const updatedFlameState = unlockHeavenlyFlame(flameState, flameId);
      const updatedPlayer: PlayerStats = {
        ...player,
        flameState: updatedFlameState
      };

      const normalized = normalizePlayerData(updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      audioEngine.playSFX('breakthrough');
      showToast?.(`🎉 Đại Cơ Duyên! Đã thuần phục thành công [${config.name}]!`);
      addLog?.(
        'Thuần Phục Dị Hỏa',
        `Luyện hóa thành công mồi lửa [${config.name}], đan hỏa nhập thể viên mãn.`,
        'alchemy'
      );
    },
    [flameState, player, setPlayer, showToast, addLog]
  );

  return {
    flameState,
    equippedFlameConfig,
    equippedFlameInstance,
    allFlamesList,
    unlockedFlamesMap,
    handleEquipFlame,
    handleFeedFlameWithOre,
    handleFeedFlameWithTuVi,
    handleUnlockFlame
  };
}
