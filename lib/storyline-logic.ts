// lib/storyline-logic.ts
// Xử lý tiến độ nhiệm vụ cốt truyện, kiểm tra điều kiện và áp dụng kết quả lựa chọn phân nhánh

import {
  PlayerStats,
  StorylineQuest,
  StorylineChoice,
  StorylineChapter,
  QuestStatus,
  StorylineState
} from '@/lib/types';
import {
  getAllQuests,
  getQuestById,
  getNextQuest,
  getChapterById,
  getChapterByQuestId,
  STORYLINE_CHAPTERS,
  createDefaultStorylineState
} from '@/lib/storyline-data';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { TITLES_CONFIG, createDefaultAchievementsState } from '@/lib/achievements-data';
import { getMaxStatLimit } from '@/lib/attribute-perks';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as { id: number; name: string; emoji?: string }[];

export interface QuestProgressResult {
  isCompleted: boolean;
  currentCount: number;
  targetCount: number;
  progressPercent: number;
  progressText: string;
}

/**
 * Kiểm tra tiến độ hoàn thành mục tiêu của một nhiệm vụ cốt truyện
 */
export function checkQuestProgress(player: PlayerStats, quest: StorylineQuest): QuestProgressResult {
  const obj = quest.objectives;

  switch (obj.type) {
    case 'reach_realm': {
      const targetRealmIndex = Number(obj.targetId ?? quest.realmRequirement ?? 0);
      const currentRealmIndex = Number(player.currentRealm ?? 0);
      const isCompleted = currentRealmIndex >= targetRealmIndex;
      const targetName = realmsData[targetRealmIndex]?.name || `Cảnh giới ${targetRealmIndex}`;
      const curName = realmsData[currentRealmIndex]?.name || `Cảnh giới ${currentRealmIndex}`;
      const progressPercent = isCompleted ? 100 : Math.min(99, Math.floor((currentRealmIndex / Math.max(1, targetRealmIndex)) * 100));

      return {
        isCompleted,
        currentCount: currentRealmIndex,
        targetCount: targetRealmIndex,
        progressPercent,
        progressText: isCompleted ? `Đã đạt ${targetName}` : `${curName} / Yêu cầu: ${targetName}`
      };
    }

    case 'harvest_herb': {
      const targetCount = obj.targetCount || 1;
      const currentCount = player.achievementsState?.stats?.herbsHarvested || 0;
      const isCompleted = currentCount >= targetCount;
      const progressPercent = Math.min(100, Math.floor((currentCount / targetCount) * 100));

      return {
        isCompleted,
        currentCount,
        targetCount,
        progressPercent,
        progressText: `Đã thu hoạch: ${currentCount}/${targetCount} Dược liệu`
      };
    }

    case 'craft_pill': {
      const targetCount = obj.targetCount || 1;
      const currentCount = player.achievementsState?.stats?.pillsCrafted || 0;
      const isCompleted = currentCount >= targetCount;
      const progressPercent = Math.min(100, Math.floor((currentCount / targetCount) * 100));

      return {
        isCompleted,
        currentCount,
        targetCount,
        progressPercent,
        progressText: `Đã luyện chế: ${currentCount}/${targetCount} Đan dược`
      };
    }

    case 'defeat_boss': {
      const targetCount = obj.targetCount || 1;
      const currentCount = player.achievementsState?.stats?.bossKills || 0;
      const isCompleted = currentCount >= targetCount;
      const progressPercent = Math.min(100, Math.floor((currentCount / targetCount) * 100));

      return {
        isCompleted,
        currentCount,
        targetCount,
        progressPercent,
        progressText: `Đã trảm sát: ${currentCount}/${targetCount} Yêu Thú/Boss`
      };
    }

    case 'make_choice': {
      const choiceId = player.storylineState?.choiceHistory?.[quest.id];
      const isCompleted = Boolean(choiceId);

      return {
        isCompleted,
        currentCount: isCompleted ? 1 : 0,
        targetCount: 1,
        progressPercent: isCompleted ? 100 : 0,
        progressText: isCompleted ? 'Đã quyết định tâm niệm' : 'Chờ đưa ra lựa chọn phân nhánh'
      };
    }

    default:
      return {
        isCompleted: false,
        currentCount: 0,
        targetCount: 1,
        progressPercent: 0,
        progressText: obj.description
      };
  }
}

/**
 * Kiểm tra xem một nhiệm vụ trong chương có khả dụng để thực hiện hay không (tuân thủ tuần tự 100%)
 */
export function isQuestAvailable(
  chapter: StorylineChapter,
  questIndex: number,
  player: PlayerStats
): { isAvailable: boolean; lockReason?: string } {
  const completedQuests = player.storylineState?.completedQuestIds || [];
  const currentRealm = Number(player.currentRealm ?? 0);
  const currentQuest = chapter.quests[questIndex];
  if (!currentQuest) {
    return { isAvailable: false, lockReason: 'Nhiệm vụ không tồn tại' };
  }

  // 1. Kiểm tra yêu cầu cảnh giới của nhiệm vụ
  if (currentRealm < currentQuest.realmRequirement) {
    const reqRealmName = realmsData[currentQuest.realmRequirement]?.name || `Cảnh giới ${currentQuest.realmRequirement}`;
    return {
      isAvailable: false,
      lockReason: `Yêu cầu cảnh giới ${reqRealmName} (Tầng ${currentQuest.realmRequirement}+)`
    };
  }

  // 2. Nếu là Hồi 1 (questIndex === 0): Cần kiểm tra chương trước đã hoàn thành chưa (nếu có chương trước)
  if (questIndex === 0) {
    const currentChapIdx = STORYLINE_CHAPTERS.findIndex(c => c.id === chapter.id);
    if (currentChapIdx > 0) {
      const prevChap = STORYLINE_CHAPTERS[currentChapIdx - 1];
      const isPrevChapDone = prevChap.quests.every(q => completedQuests.includes(q.id));
      if (!isPrevChapDone) {
        return {
          isAvailable: false,
          lockReason: `Cần hoàn thành toàn bộ ${prevChap.title.split(':')[0]} trước`
        };
      }
    }
    return { isAvailable: true };
  }

  // 3. Nếu là Hồi 2, Hồi 3... (questIndex > 0): BẮT BUỘC Hồi liền trước trong cùng chương đã hoàn thành
  const previousQuest = chapter.quests[questIndex - 1];
  if (!completedQuests.includes(previousQuest.id)) {
    return {
      isAvailable: false,
      lockReason: `Cần hoàn thành "${previousQuest.title}" trước`
    };
  }

  return { isAvailable: true };
}

/**
 * Xác định trạng thái của một quest: locked | available | in_progress | completed
 */
export function getQuestStatus(player: PlayerStats, quest: StorylineQuest): QuestStatus {
  const state = player.storylineState || createDefaultStorylineState();

  if (state.completedQuestIds?.includes(quest.id)) {
    return 'completed';
  }

  const chapter = getChapterByQuestId(quest.id) || STORYLINE_CHAPTERS.find(c => c.quests.some(q => q.id === quest.id));
  if (chapter) {
    const qIndex = chapter.quests.findIndex(q => q.id === quest.id);
    const availability = isQuestAvailable(chapter, qIndex, player);
    if (!availability.isAvailable) {
      return 'locked';
    }
  }

  if (state.activeQuestId === quest.id) {
    return 'in_progress';
  }

  return 'available';
}

/**
 * Kiểm tra xem có quest nào đang có thể nhận thưởng hoặc hoàn thành không
 */
export function hasClaimableQuests(player: PlayerStats): boolean {
  const state = player.storylineState || createDefaultStorylineState();
  if (!state.activeQuestId) return false;

  const quest = getQuestById(state.activeQuestId);
  if (!quest) return false;

  if (state.completedQuestIds?.includes(quest.id)) return false;

  const progress = checkQuestProgress(player, quest);
  return progress.isCompleted;
}

/**
 * Áp dụng kết quả khi người chơi đưa ra Lựa Chọn Phân Nhánh
 */
export function applyChoiceOutcomes(
  player: PlayerStats,
  quest: StorylineQuest,
  choice: StorylineChoice
): {
  updatedPlayer: PlayerStats;
  logMessage: string;
  rewardSummary: string;
} {
  // Phòng vệ: Chặn hoàn toàn nếu nhiệm vụ chưa đủ điều kiện tuần tự
  const chapter = getChapterByQuestId(quest.id) || STORYLINE_CHAPTERS.find(c => c.quests.some(q => q.id === quest.id));
  if (chapter) {
    const qIndex = chapter.quests.findIndex(q => q.id === quest.id);
    const availability = isQuestAvailable(chapter, qIndex, player);
    if (!availability.isAvailable) {
      return {
        updatedPlayer: player,
        logMessage: `[Chưa Mở Khóa] ${availability.lockReason}`,
        rewardSummary: 'Nhiệm vụ chưa đủ điều kiện thực hiện'
      };
    }
  }

  const outcomes = choice.outcomes;
  const state = player.storylineState || createDefaultStorylineState();

  // Khí vận & Tâm cảnh
  const curKhiVan = player.khiVan ?? 50;
  const curTamCanh = player.tamCanh ?? 50;
  const maxStat = getMaxStatLimit(player.currentRealm || 0);
  const newKhiVan = Math.max(0, Math.min(maxStat, curKhiVan + (outcomes.khiVanChange || 0)));
  const newTamCanh = Math.max(1, Math.min(maxStat, curTamCanh + (outcomes.tamCanhChange || 0)));

  // Thuộc tính & Chỉ số chiến đấu
  const newCanCot = (player.canCot ?? 10) + (outcomes.canCotChange || 0);
  const newNgoTinh = (player.ngoTinh ?? 10) + (outcomes.ngoTinhChange || 0);
  const newThanThuc = (player.thanThuc ?? 10) + (outcomes.thanThucChange || 0);
  const newCongKich = (player.congKich ?? 20) + (outcomes.congKichChange || 0);
  const newPhongNgu = (player.phongNgu ?? 10) + (outcomes.phongNguChange || 0);
  const newBaoKichRate = (player.baoKichRate ?? 5) + (outcomes.critRateChange || 0);
  const newBaoKichDmg = (player.baoKichDmg ?? 150) + (outcomes.critDmgChange || 0);
  const newDanhVong = (player.danhVong ?? 0) + (outcomes.danhVongChange || 0);
  const newDmgReduction = (player.permanentDmgReduction ?? player.dmgReduction ?? 0) + (outcomes.dmgReductionChange || 0);
  const newMaTinh = (player.maTinh ?? 0) + (outcomes.maTinhChange || 0);

  // Khí huyết phần trăm
  let newMaxHP = player.maxKhiHuyet ?? 100;
  let newHP = player.khiHuyet ?? 100;
  if (outcomes.hpPercentChange) {
    if (outcomes.hpPercentChange < 0) {
      // Giảm HP hiện tại tạm thời (ví dụ: -40% HP khi Dĩ Thân Hóa Lôi), giữ tối thiểu 1 HP
      const hpLoss = Math.floor(newHP * (Math.abs(outcomes.hpPercentChange) / 100));
      newHP = Math.max(1, newHP - hpLoss);
    } else {
      const hpMultiplier = 1 + outcomes.hpPercentChange / 100;
      newMaxHP = Math.floor(newMaxHP * hpMultiplier);
      newHP = Math.floor(newHP * hpMultiplier);
    }
  }

  // Tu vi & Linh thạch
  const newTuVi = (player.tuVi ?? 0) + (outcomes.rewardTuVi || 0);
  const newLinhThach = (player.linhThach ?? 0) + (outcomes.rewardLinhThach || 0);

  // Thêm vật phẩm vào túi
  let updatedInventory = player.inventory;
  const maxCapacity = getMaxInventoryCapacity(player);
  const itemNames: string[] = [];

  if (outcomes.rewardItems && outcomes.rewardItems.length > 0) {
    for (const rewardItem of outcomes.rewardItems) {
      if (rewardItem.type === 'pill' || rewardItem.type === 'herb' || rewardItem.type === 'ore') {
        const itemObj = {
          id: rewardItem.id,
          name: rewardItem.name,
          grade: rewardItem.grade || 'Nhất Phẩm',
          quality: rewardItem.quality || 'thuong_pham',
          description: rewardItem.description || `Vật phẩm cơ duyên từ cốt truyện [${quest.title}].`,
          price: 100,
          effectType: 'breakthrough_bonus',
          effectValue: 10
        };
        const res = addItemToInventory(
          updatedInventory,
          maxCapacity,
          rewardItem.type,
          itemObj,
          rewardItem.quantity || 1
        );
        if (res.success) {
          updatedInventory = res.inventory;
          itemNames.push(`${rewardItem.name} x${rewardItem.quantity || 1}`);
        }
      } else if (rewardItem.type === 'equipment') {
        const equipObj = {
          id: rewardItem.id || `equip_story_${Date.now()}`,
          name: rewardItem.name,
          slot: rewardItem.slot || 'artifact',
          grade: rewardItem.grade || 'Cổ Bảo',
          quality: rewardItem.quality || 'cuc_pham',
          description: rewardItem.description || `Pháp bảo cơ duyên từ cốt truyện [${quest.title}].`,
          stats: rewardItem.stats || { atk: 50, def: 30 },
          price: 10000,
          affixes: [],
          sockets: []
        };
        const res = addItemToInventory(
          updatedInventory,
          maxCapacity,
          'equipment',
          equipObj,
          1
        );
        if (res.success) {
          updatedInventory = res.inventory;
          itemNames.push(`Pháp bảo [${rewardItem.name}]`);
        }
      }
    }
  }

  // Danh hiệu nếu có
  const currentAchState = player.achievementsState || createDefaultAchievementsState();
  let updatedUnlockedTitles = [...(currentAchState.unlockedTitleIds || [])];
  let titleName = '';
  if (outcomes.rewardTitleId && !updatedUnlockedTitles.includes(outcomes.rewardTitleId)) {
    updatedUnlockedTitles.push(outcomes.rewardTitleId);
    titleName = TITLES_CONFIG[outcomes.rewardTitleId]?.name || outcomes.rewardTitleId;
  }

  // Cập nhật storylineState
  const newChoiceHistory = {
    ...(state.choiceHistory || {}),
    [quest.id]: choice.id
  };
  const newCompletedQuests = state.completedQuestIds.includes(quest.id)
    ? state.completedQuestIds
    : [...state.completedQuestIds, quest.id];

  const nextQuest = getNextQuest(quest.id);
  const nextActiveQuestId = nextQuest ? nextQuest.id : null;
  const nextChapterId = nextQuest ? nextQuest.chapterId : state.currentChapterId;

  const updatedPlayer: PlayerStats = {
    ...player,
    khiVan: newKhiVan,
    tamCanh: newTamCanh,
    canCot: newCanCot,
    ngoTinh: newNgoTinh,
    thanThuc: newThanThuc,
    congKich: newCongKich,
    phongNgu: newPhongNgu,
    baoKichRate: newBaoKichRate,
    baoKichDmg: newBaoKichDmg,
    danhVong: newDanhVong,
    maxKhiHuyet: newMaxHP,
    khiHuyet: newHP,
    tuVi: newTuVi,
    linhThach: newLinhThach,
    permanentDmgReduction: newDmgReduction,
    dmgReduction: newDmgReduction,
    maTinh: newMaTinh,
    inventory: updatedInventory,
    achievementsState: {
      ...currentAchState,
      unlockedTitleIds: updatedUnlockedTitles
    },
    storylineState: {
      currentChapterId: nextChapterId,
      activeQuestId: nextActiveQuestId,
      completedQuestIds: newCompletedQuests,
      choiceHistory: newChoiceHistory
    }
  };

  // Tổng hợp mô tả phần thưởng
  const rewardParts: string[] = [];
  if (outcomes.congKichChange) {
    rewardParts.push(`${outcomes.congKichChange > 0 ? '+' : ''}${outcomes.congKichChange} Công Kích`);
  }
  if (outcomes.phongNguChange) {
    rewardParts.push(`${outcomes.phongNguChange > 0 ? '+' : ''}${outcomes.phongNguChange} Phòng Ngự`);
  }
  if (outcomes.canCotChange) {
    rewardParts.push(`${outcomes.canCotChange > 0 ? '+' : ''}${outcomes.canCotChange} Căn Cốt`);
  }
  if (outcomes.ngoTinhChange) {
    rewardParts.push(`${outcomes.ngoTinhChange > 0 ? '+' : ''}${outcomes.ngoTinhChange} Ngộ Tính`);
  }
  if (outcomes.thanThucChange) {
    rewardParts.push(`${outcomes.thanThucChange > 0 ? '+' : ''}${outcomes.thanThucChange} Thần Thức`);
  }
  if (outcomes.critRateChange) {
    rewardParts.push(`+${outcomes.critRateChange}% Bạo Kích`);
  }
  if (outcomes.critDmgChange) {
    rewardParts.push(`+${outcomes.critDmgChange}% Sát Thương Bạo`);
  }
  if (outcomes.hpPercentChange) {
    rewardParts.push(`+${outcomes.hpPercentChange}% Khí Huyết`);
  }
  if (outcomes.dmgReductionChange) {
    rewardParts.push(`+${outcomes.dmgReductionChange}% Miễn Thương`);
  }
  if (outcomes.maTinhChange) {
    rewardParts.push(`+${outcomes.maTinhChange}% Ma Tính`);
  }
  if (outcomes.danhVongChange) {
    rewardParts.push(`+${outcomes.danhVongChange} Danh Vọng`);
  }
  if (outcomes.khiVanChange) {
    rewardParts.push(`${outcomes.khiVanChange > 0 ? '+' : ''}${outcomes.khiVanChange} Khí Vận`);
  }
  if (outcomes.tamCanhChange) {
    rewardParts.push(`${outcomes.tamCanhChange > 0 ? '+' : ''}${outcomes.tamCanhChange} Tâm Cảnh`);
  }
  if (outcomes.rewardTuVi) {
    rewardParts.push(`+${outcomes.rewardTuVi.toLocaleString()} Tu Vi`);
  }
  if (outcomes.rewardLinhThach) {
    rewardParts.push(`+${outcomes.rewardLinhThach.toLocaleString()} Linh Thạch`);
  }
  if (itemNames.length > 0) {
    rewardParts.push(itemNames.join(', '));
  }
  if (titleName) {
    rewardParts.push(`Danh hiệu: [${titleName}]`);
  }

  const rewardSummary = rewardParts.join(' • ');
  const logMessage = `Đạo hữu đã quyết định: [${choice.label}]. ${outcomes.dialogue} (${rewardSummary})`;

  return {
    updatedPlayer,
    logMessage,
    rewardSummary
  };
}

/**
 * Nhận thưởng và hoàn thành nhiệm vụ theo mục tiêu (reach_realm, harvest_herb, defeat_boss)
 */
export function claimQuestRewardLogic(
  player: PlayerStats,
  quest: StorylineQuest
): {
  updatedPlayer: PlayerStats;
  logMessage: string;
} {
  // Phòng vệ: Chặn hoàn toàn nếu nhiệm vụ chưa mở khóa tuần tự
  const chapter = getChapterByQuestId(quest.id) || STORYLINE_CHAPTERS.find(c => c.quests.some(q => q.id === quest.id));
  if (chapter) {
    const qIndex = chapter.quests.findIndex(q => q.id === quest.id);
    const availability = isQuestAvailable(chapter, qIndex, player);
    if (!availability.isAvailable) {
      return {
        updatedPlayer: player,
        logMessage: `[Chưa Mở Khóa] ${availability.lockReason}`
      };
    }
  }

  const state = player.storylineState || createDefaultStorylineState();
  if (state.completedQuestIds.includes(quest.id)) {
    return { updatedPlayer: player, logMessage: 'Nhiệm vụ đã hoàn thành trước đó.' };
  }

  const baseRewardTuVi = Math.max(100, (quest.realmRequirement + 1) * 150);
  const baseRewardLinhThach = Math.max(50, (quest.realmRequirement + 1) * 80);

  const newTuVi = (player.tuVi ?? 0) + baseRewardTuVi;
  const newLinhThach = (player.linhThach ?? 0) + baseRewardLinhThach;
  const newCompletedQuests = [...state.completedQuestIds, quest.id];

  const nextQuest = getNextQuest(quest.id);
  const nextActiveQuestId = nextQuest ? nextQuest.id : null;
  const nextChapterId = nextQuest ? nextQuest.chapterId : state.currentChapterId;

  const updatedPlayer: PlayerStats = {
    ...player,
    tuVi: newTuVi,
    linhThach: newLinhThach,
    storylineState: {
      currentChapterId: nextChapterId,
      activeQuestId: nextActiveQuestId,
      completedQuestIds: newCompletedQuests,
      choiceHistory: state.choiceHistory || {}
    }
  };

  const logMessage = `Hoàn thành chính tuyến [${quest.title}]: Nhận +${baseRewardTuVi.toLocaleString()} Tu Vi & +${baseRewardLinhThach.toLocaleString()} Linh Thạch!`;

  return {
    updatedPlayer,
    logMessage
  };
}

/**
 * Tự động đồng bộ và hỗ trợ save cũ có cảnh giới cao:
 * Đảm bảo người chơi không bị kẹt ở hồi cũ nếu cảnh giới đã vượt xa hoặc chương mới được cập nhật.
 */
export function autoCatchUpStorylineForHighRealm(player: PlayerStats): PlayerStats {
  let state = player.storylineState;
  if (!state) {
    state = createDefaultStorylineState();
  }

  const allQuests = getAllQuests();
  const completedSet = new Set(Array.isArray(state.completedQuestIds) ? state.completedQuestIds : []);

  let activeId = state.activeQuestId;
  // Nếu chưa có activeQuestId, hoặc quest hiện tại đã nằm trong danh sách completed, tìm quest tiếp theo chưa xong
  if (!activeId || completedSet.has(activeId)) {
    const firstUnfinished = allQuests.find(q => !completedSet.has(q.id));
    activeId = firstUnfinished ? firstUnfinished.id : null;
  }

  const currentQuest = activeId ? getQuestById(activeId) : null;
  let currentChapterId = currentQuest ? currentQuest.chapterId : (state.currentChapterId || 'chap_1');

  // Nâng ngưỡng kiểm tra cảnh giới cao (Luyện Hư Kỳ 31+, Hợp Thể, Đại Thừa, Độ Kiếp Kỳ 46+, Phi Thăng, Tiên Giới, Đế Cảnh):
  // Đảm bảo chương tương ứng được đồng bộ vào currentChapterId để mở khóa giao diện sáng rõ
  const currentRealm = Number(player.currentRealm ?? 0);
  if (currentRealm >= 46 && currentQuest && (currentQuest.chapterId === 'chap_9' || currentQuest.chapterId === 'chap_8')) {
    currentChapterId = currentQuest.chapterId;
  } else if (currentRealm >= 31 && currentQuest && currentQuest.chapterId === 'chap_8') {
    currentChapterId = 'chap_8';
  }

  return {
    ...player,
    storylineState: {
      currentChapterId,
      activeQuestId: activeId,
      completedQuestIds: Array.from(completedSet),
      choiceHistory: state.choiceHistory && typeof state.choiceHistory === 'object' ? state.choiceHistory : {}
    }
  };
}
