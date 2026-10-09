// hooks/usePvPLadderActions.ts
// Custom Domain Hook quản lý State, điều phối giao tranh, kết toán và làm mới Thiên Kiêu Bảng

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  PlayerStats,
  LadderOpponent,
  PvPLadderState,
  PvPBattleResult
} from '@/lib/types';
import {
  regenChallengeTickets,
  getMatchmakingTargets,
  simulatePvPTurnCombat,
  resolveLadderChallenge,
  claimWeeklySettlement
} from '@/lib/pvp-ladder-logic';
import { createDefaultPvPLadderState } from '@/lib/pvp-ladder-data';
import { audioEngine } from '@/lib/audio-engine';

export interface UsePvPLadderActionsParams {
  player: PlayerStats;
  setPlayer?: (player: PlayerStats | ((prev: PlayerStats) => PlayerStats)) => void;
  addLog?: (title: string, message: string, type?: any) => void;
  showToast?: (msg: string) => void;
}

export interface UsePvPLadderActionsReturn {
  ladderState: PvPLadderState;
  activePvPTab: 'ladder' | 'challenge' | 'history';
  setActivePvPTab: (tab: 'ladder' | 'challenge' | 'history') => void;
  selectedOpponent: LadderOpponent | null;
  setSelectedOpponent: (opp: LadderOpponent | null) => void;
  isFighting: boolean;
  pvpBattleResult: PvPBattleResult | null;
  showBattleModal: boolean;
  setShowBattleModal: (show: boolean) => void;
  currentMatchmakingTargets: LadderOpponent[];
  topThreeOpponents: LadderOpponent[];
  handleChallengeOpponent: (opponent: LadderOpponent) => Promise<void>;
  handleClaimWeeklyReward: () => void;
  handleRefreshTargets: () => void;
  handleCloseBattleModal: () => void;
}

export function usePvPLadderActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UsePvPLadderActionsParams): UsePvPLadderActionsReturn {
  const [activePvPTab, setActivePvPTab] = useState<'ladder' | 'challenge' | 'history'>('challenge');
  const [selectedOpponent, setSelectedOpponent] = useState<LadderOpponent | null>(null);
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [pvpBattleResult, setPvpBattleResult] = useState<PvPBattleResult | null>(null);
  const [showBattleModal, setShowBattleModal] = useState<boolean>(false);
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // Lấy ladderState và tự động regen vé
  const ladderState = useMemo(() => {
    const raw = player.pvpLadderState || createDefaultPvPLadderState();
    return regenChallengeTickets(raw);
  }, [player.pvpLadderState]);

  // Top 3 Thiên Kiêu Đứng Đầu
  const topThreeOpponents = useMemo(() => {
    const npcs = ladderState.ladderNpcs || [];
    return [...npcs].sort((a, b) => a.rank - b.rank).slice(0, 3);
  }, [ladderState.ladderNpcs]);

  // Danh sách đối thủ khiêu chiến phù hợp
  const currentMatchmakingTargets = useMemo(() => {
    // refreshSeed ép tính toán lại nếu người chơi bấm nút làm mới
    if (refreshSeed >= 0) {
      return getMatchmakingTargets(ladderState, ladderState.currentRank ?? 101);
    }
    return [];
  }, [ladderState, refreshSeed]);

  // Làm mới danh sách đối thủ gợi ý
  const handleRefreshTargets = useCallback(() => {
    setRefreshSeed(prev => prev + 1);
    audioEngine.playSFX('click');
    showToast?.('Đã làm mới danh sách đối thủ khiêu chiến!');
  }, [showToast]);

  // Thực hiện khiêu chiến một đối thủ
  const handleChallengeOpponent = useCallback(async (opponent: LadderOpponent) => {
    if ((ladderState.challengeTickets ?? 0) <= 0) {
      showToast?.('Đã hết Lệnh Bài Khiêu Chiến! Hãy chờ hồi phục hoặc qua ngày mới.');
      audioEngine.playSFX('click');
      return;
    }

    setSelectedOpponent(opponent);
    setIsFighting(true);
    setShowBattleModal(true);
    audioEngine.playSFX('slash');

    // Chờ 600ms tạo cảm giác chuẩn bị đấu pháp
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mô phỏng trận đấu turn-based
    const result = simulatePvPTurnCombat(player, opponent);
    setPvpBattleResult(result);
    setIsFighting(false);

    // Xử lý hoán đổi thứ hạng & trừ vé
    if (setPlayer) {
      const { updatedPlayer, logMessage } = resolveLadderChallenge(player, result);
      setPlayer(updatedPlayer);

      if (result.victory) {
        audioEngine.playSFX('breakthrough');
        showToast?.(`Đắc thắng! Đạo hữu đã đoạt lấy Hạng #${result.newRank}!`);
      } else {
        audioEngine.playSFX('click');
        showToast?.(`Khiêu chiến bất thành trước ${opponent.name}. Thứ hạng giữ nguyên.`);
      }

      addLog?.('Thiên Kiêu Bảng', logMessage, result.victory ? 'event' : 'danger');
    }
  }, [ladderState.challengeTickets, player, setPlayer, addLog, showToast]);

  // Đóng modal chiến báo
  const handleCloseBattleModal = useCallback(() => {
    setShowBattleModal(false);
    setPvpBattleResult(null);
    setSelectedOpponent(null);
  }, []);

  // Nhận thưởng kết toán tuần
  const handleClaimWeeklyReward = useCallback(() => {
    if (!setPlayer) return;
    const { updatedPlayer, logMessage } = claimWeeklySettlement(player);
    setPlayer(updatedPlayer);
    audioEngine.playSFX('breakthrough');
    showToast?.('Đã nhận bổng lộc kết toán tuần của Thiên Kiêu Bảng!');
    addLog?.('Thiên Kiêu Bảng', logMessage, 'system');
  }, [player, setPlayer, addLog, showToast]);

  return {
    ladderState,
    activePvPTab,
    setActivePvPTab,
    selectedOpponent,
    setSelectedOpponent,
    isFighting,
    pvpBattleResult,
    showBattleModal,
    setShowBattleModal,
    currentMatchmakingTargets,
    topThreeOpponents,
    handleChallengeOpponent,
    handleClaimWeeklyReward,
    handleRefreshTargets,
    handleCloseBattleModal
  };
}
