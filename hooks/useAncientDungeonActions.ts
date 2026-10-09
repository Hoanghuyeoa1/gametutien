// hooks/useAncientDungeonActions.ts
// Custom Hook điều phối các tương tác với Tàng Bảo Các & Thượng Cổ Bí Cảnh

import { useState, useCallback } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  GuaranteedDivineReward,
  AncientMapVaultState
} from '@/lib/types/ancient-map-dungeon';
import {
  ANCIENT_MAP_SETS_REGISTRY,
  synthesizeAncientMap,
  openAncientDungeonInstance,
  resolveDungeonStageBattle,
  createDefaultAncientMapVault
} from '@/lib/ancient-map-dungeon-logic';
import { BattleResult } from '@/lib/game-logic/combat';
import { audioEngine } from '@/lib/audio-engine';

interface UseAncientDungeonActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useAncientDungeonActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseAncientDungeonActionsParams) {
  const [selectedSetId, setSelectedSetId] = useState<string>('thai_co_kiem_chung');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [lastBattleReport, setLastBattleReport] = useState<BattleResult | null>(null);
  const [lastRewardModalData, setLastRewardModalData] = useState<GuaranteedDivineReward | null>(null);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  // Đảm bảo vault luôn có dữ liệu an toàn
  const vault: AncientMapVaultState = player.ancientMapVault || createDefaultAncientMapVault();

  // 1. GHÉP MẢNH TÀN ĐỒ THÀNH BÍ ĐỒ HOÀN CHỈNH
  const handleSynthesizeMap = useCallback((setId: string) => {
    setIsSynthesizing(true);

    const setDef = ANCIENT_MAP_SETS_REGISTRY[setId];
    if (!setDef) {
      showToast('Bộ di tích không tồn tại!');
      setIsSynthesizing(false);
      return;
    }

    const currentStones = player.linhThach || 0;
    const result = synthesizeAncientMap(vault, setId, currentStones);

    if (!result.success) {
      showToast(result.reason || 'Ghép bí đồ thất bại!');
      setIsSynthesizing(false);
      return;
    }

    audioEngine.playSFX('alchemy');

    // Cập nhật người chơi: trừ Linh Thạch và cập nhật ancientMapVault
    setPlayer(prev => ({
      ...prev,
      linhThach: Math.max(0, (prev.linhThach || 0) - result.spiritStonesCost),
      ancientMapVault: result.vault
    }));

    addLog(
      'Hợp Nhất Tàn Đồ Bát Hoang',
      `Tụ linh hóa khí, thành công hợp nhất 4 mảnh tàn đồ tạo thành 【${result.createdMap?.name}】! Tiêu hao ${result.spiritStonesCost.toLocaleString()} Linh Thạch.`,
      'craft'
    );
    showToast(`⚡ Hợp nhất thành công 【${result.createdMap?.name}】!`);

    setIsSynthesizing(false);
  }, [vault, player.linhThach, setPlayer, addLog, showToast]);

  // 2. SỬ DỤNG BÍ ĐỒ KHAI MỞ PHÓ BẢN CỔ ĐẠI
  const handleOpenDungeon = useCallback((mapId: string) => {
    const currentRealm = player.currentRealm || 0;
    const result = openAncientDungeonInstance(vault, mapId, currentRealm);

    if (!result.success) {
      showToast(result.reason || 'Khai mở phó bản thất bại!');
      return;
    }

    audioEngine.playSFX('breakthrough');

    setPlayer(prev => ({
      ...prev,
      ancientMapVault: result.vault
    }));

    addLog(
      'Khai Mở Thượng Cổ Bí Cảnh',
      `Kích hoạt bí đồ, mở ra thông đạo không gian tiến vào 【${result.instance?.dungeonName}】! Cổng không gian sẽ duy trì trong 2 giờ.`,
      'adventure'
    );
    showToast(`🌌 Khai mở 【${result.instance?.dungeonName}】 thành công! Cổng duy trì trong 2 giờ.`);
  }, [vault, player.currentRealm, setPlayer, addLog, showToast]);

  // 3. KHIÊU CHIẾN TẦNG ẢI TRONG PHÓ BẢN
  const handleFightDungeonStage = useCallback((stageIndex: 1 | 2 | 3, usedSkillManualId?: string) => {
    if (isFighting) return;
    setIsFighting(true);

    const result = resolveDungeonStageBattle(player, vault, stageIndex, usedSkillManualId);

    setLastBattleReport(result.battleReport);

    if (result.error) {
      showToast(result.error);
      setIsFighting(false);
      return;
    }

    // Cập nhật player và vault
    setPlayer(result.updatedPlayer);

    if (result.victory) {
      audioEngine.playSFX('victory');

      if (stageIndex < 3) {
        showToast(`⚔️ Đại thắng Ải ${stageIndex}! Thông đạo mở ra Ải tiếp theo.`);
        addLog(
          'Đại Thắng Ải Bí Cảnh',
          `Vượt qua Ải ${stageIndex} của phó bản cổ đại. Tiến nhập ải tiếp theo!`,
          'battle'
        );
      } else {
        // Đánh bại Boss cuối
        showToast(`🏆 Toàn thắng Thượng Cổ Bí Cảnh! Thần Binh xuất thế!`);
        addLog(
          'Chinh Phục Thượng Cổ Bí Cảnh',
          `Đánh bại Boss cuối! Thu hoạch Thần Binh Độc Bản 【${result.rewardsClaimed?.equipmentName}】 cùng ${result.rewardsClaimed?.spiritStones.toLocaleString()} Linh Thạch!`,
          'battle'
        );

        if (result.rewardsClaimed) {
          setLastRewardModalData(result.rewardsClaimed);
          setShowRewardModal(true);
        }
      }
    } else {
      audioEngine.playSFX('defeat');
      showToast(`Chiến bại tại Ải ${stageIndex}! Hãy tẩm bổ nguyên khí và thử lại trước khi phó bản đóng.`);
      addLog(
        'Chiến Bại Ải Bí Cảnh',
        `Chưa thể đánh bại thủ hộ Ải ${stageIndex}. Cần củng cố thực lực trước khi cổng không gian sụp đổ!`,
        'battle'
      );
    }

    setIsFighting(false);
  }, [isFighting, player, vault, setPlayer, addLog, showToast]);

  const closeRewardModal = useCallback(() => {
    setShowRewardModal(false);
  }, []);

  return {
    vault,
    selectedSetId,
    setSelectedSetId,
    isSynthesizing,
    isFighting,
    lastBattleReport,
    lastRewardModalData,
    showRewardModal,
    handleSynthesizeMap,
    handleOpenDungeon,
    handleFightDungeonStage,
    closeRewardModal
  };
}
