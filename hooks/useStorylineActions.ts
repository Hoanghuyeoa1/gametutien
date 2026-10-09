// hooks/useStorylineActions.ts
// Hook quản lý Hệ Thống Cốt Truyện Phân Nhánh & Nhiệm Vụ Chính Tuyến

import { useState, useCallback, useMemo } from 'react';
import {
  PlayerStats,
  LogType,
  StorylineQuest,
  StorylineChoice,
  QuestStatus
} from '@/lib/types';
import {
  STORYLINE_CHAPTERS,
  getQuestById,
  getChapterById,
  getChapterByQuestId,
  createDefaultStorylineState
} from '@/lib/storyline-data';
import {
  checkQuestProgress,
  applyChoiceOutcomes,
  claimQuestRewardLogic,
  getQuestStatus,
  hasClaimableQuests,
  isQuestAvailable,
  QuestProgressResult
} from '@/lib/storyline-logic';
import { audioEngine } from '@/lib/audio-engine';

export interface UseStorylineActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast?: (msg: string) => void;
}

export interface UseStorylineActionsReturn {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  activeChapterId: string;
  setActiveChapterId: (chapterId: string) => void;
  selectedQuestId: string | null;
  setSelectedQuestId: (questId: string | null) => void;
  dialogueIndex: number;
  setDialogueIndex: React.Dispatch<React.SetStateAction<number>>;
  advanceDialogue: () => void;
  resetDialogue: () => void;
  selectChoice: (questId: string, choiceId: string) => boolean;
  claimQuestReward: (questId: string) => boolean;
  openStorylineModal: (targetQuestId?: string) => void;
  hasUnclaimed: boolean;
  currentActiveQuest: StorylineQuest | null;
  activeQuestProgress: QuestProgressResult | null;
  getQuestProgressInfo: (quest: StorylineQuest) => QuestProgressResult;
  getQuestStatusInfo: (quest: StorylineQuest) => QuestStatus;
}

export function useStorylineActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseStorylineActionsParams): UseStorylineActionsReturn {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeChapterId, setActiveChapterId] = useState<string>('chap_1');
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);

  const state = player.storylineState || createDefaultStorylineState();

  // Quest đang kích hoạt hiện tại
  const currentActiveQuest = useMemo(() => {
    const qId = state.activeQuestId || 'quest_1_1';
    return getQuestById(qId) || null;
  }, [state.activeQuestId]);

  // Tiến độ của quest đang làm
  const activeQuestProgress = useMemo(() => {
    if (!currentActiveQuest) return null;
    return checkQuestProgress(player, currentActiveQuest);
  }, [player, currentActiveQuest]);

  // Kiểm tra có nhiệm vụ sẵn sàng nhận thưởng hay có lựa chọn mới không
  const hasUnclaimed = useMemo(() => {
    return hasClaimableQuests(player);
  }, [player]);

  // Mở modal và tự động focus vào quest mong muốn hoặc quest đang active
  const openStorylineModal = useCallback((targetQuestId?: string) => {
    const questToFocus = targetQuestId ? getQuestById(targetQuestId) : currentActiveQuest;
    if (questToFocus) {
      setActiveChapterId(questToFocus.chapterId);
      setSelectedQuestId(questToFocus.id);
    } else {
      setActiveChapterId(state.currentChapterId || 'chap_1');
      setSelectedQuestId(state.activeQuestId || 'quest_1_1');
    }
    setDialogueIndex(0);
    setShowModal(true);
    audioEngine.playSFX('click');
  }, [currentActiveQuest, state.currentChapterId, state.activeQuestId]);

  // Chuyển câu thoại kế tiếp trong khung tự sự tiểu thuyết
  const advanceDialogue = useCallback(() => {
    const activeQuest = selectedQuestId ? getQuestById(selectedQuestId) : currentActiveQuest;
    if (!activeQuest || !activeQuest.dialogues) return;

    audioEngine.playSFX('click');
    setDialogueIndex(prev => {
      if (prev < activeQuest.dialogues.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [selectedQuestId, currentActiveQuest]);

  const resetDialogue = useCallback(() => {
    setDialogueIndex(0);
  }, []);

  // Lựa chọn ngã rẽ cốt truyện
  const selectChoice = useCallback((questId: string, choiceId: string): boolean => {
    const quest = getQuestById(questId);
    if (!quest || !quest.choices) return false;

    // Kiểm tra tính tuần tự 100%: Bắt buộc nhiệm vụ phải mở khóa
    const chapter = getChapterByQuestId(quest.id);
    if (chapter) {
      const qIndex = chapter.quests.findIndex(q => q.id === quest.id);
      const availability = isQuestAvailable(chapter, qIndex, player);
      if (!availability.isAvailable) {
        showToast?.(`Chưa thể thực hiện! ${availability.lockReason}`);
        return false;
      }
    }

    const choice = quest.choices.find(c => c.id === choiceId);
    if (!choice) return false;

    // Kiểm tra điều kiện ẩn nếu có
    if (choice.requiredStats) {
      const { canCot, ngoTinh, tamCanh, khiVan } = choice.requiredStats;
      if (canCot !== undefined && (player.canCot ?? 0) < canCot) {
        showToast?.(`Căn cốt chưa đủ! Yêu cầu Căn Cốt ≥ ${canCot}`);
        return false;
      }
      if (ngoTinh !== undefined && (player.ngoTinh ?? 0) < ngoTinh) {
        showToast?.(`Ngộ tính chưa đủ! Yêu cầu Ngộ Tính ≥ ${ngoTinh}`);
        return false;
      }
      if (tamCanh !== undefined && (player.tamCanh ?? 0) < tamCanh) {
        showToast?.(`Tâm cảnh chưa đủ! Yêu cầu Tâm Cảnh ≥ ${tamCanh}`);
        return false;
      }
      if (khiVan !== undefined && (player.khiVan ?? 0) < khiVan) {
        showToast?.(`Khí vận chưa đủ! Yêu cầu Khí Vận ≥ ${khiVan}`);
        return false;
      }
    }

    const { updatedPlayer, logMessage, rewardSummary } = applyChoiceOutcomes(player, quest, choice);
    setPlayer(updatedPlayer);

    audioEngine.playSFX('breakthrough');
    addLog?.('Cốt Truyện', logMessage, 'event');
    showToast?.(`Quyết định thành công! Thu hoạch: ${rewardSummary}`);

    return true;
  }, [player, setPlayer, addLog, showToast]);

  // Nhận thưởng nhiệm vụ mục tiêu
  const claimQuestReward = useCallback((questId: string): boolean => {
    const quest = getQuestById(questId);
    if (!quest) return false;

    // Kiểm tra tính tuần tự 100%: Bắt buộc nhiệm vụ phải mở khóa
    const chapter = getChapterByQuestId(quest.id);
    if (chapter) {
      const qIndex = chapter.quests.findIndex(q => q.id === quest.id);
      const availability = isQuestAvailable(chapter, qIndex, player);
      if (!availability.isAvailable) {
        showToast?.(`Chưa thể nhận thưởng! ${availability.lockReason}`);
        return false;
      }
    }

    const progress = checkQuestProgress(player, quest);
    if (!progress.isCompleted) {
      showToast?.(`Chưa hoàn thành mục tiêu nhiệm vụ: ${quest.objectives.description}`);
      return false;
    }

    const { updatedPlayer, logMessage } = claimQuestRewardLogic(player, quest);
    setPlayer(updatedPlayer);

    audioEngine.playSFX('breakthrough');
    addLog?.('Cốt Truyện', logMessage, 'system');
    showToast?.(`Nhận thưởng chính tuyến thành công!`);

    return true;
  }, [player, setPlayer, addLog, showToast]);

  // Helper lấy thông tin tiến độ
  const getQuestProgressInfo = useCallback((quest: StorylineQuest) => {
    return checkQuestProgress(player, quest);
  }, [player]);

  // Helper lấy trạng thái quest
  const getQuestStatusInfo = useCallback((quest: StorylineQuest) => {
    return getQuestStatus(player, quest);
  }, [player]);

  return {
    showModal,
    setShowModal,
    activeChapterId,
    setActiveChapterId,
    selectedQuestId,
    setSelectedQuestId,
    dialogueIndex,
    setDialogueIndex,
    advanceDialogue,
    resetDialogue,
    selectChoice,
    claimQuestReward,
    openStorylineModal,
    hasUnclaimed,
    currentActiveQuest,
    activeQuestProgress,
    getQuestProgressInfo,
    getQuestStatusInfo
  };
}
