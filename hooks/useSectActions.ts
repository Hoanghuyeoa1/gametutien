import { useState } from 'react';
import {
  PlayerStats,
  SectId,
  SectState,
  SectRank,
  SectShopItem,
  SectArenaFighter,
  Manual,
  LogType,
  SectSubTab,
  FormationItem
} from '@/lib/types';
import {
  SECT_DATA_MAP,
  SECT_PROFILES,
  SECT_RANKS_CONFIG,
  generateDailyQuests,
  checkCanPromoteSectRank,
  canClaimDailySalary,
  resolveSectArenaBattle,
  getSectVeinById,
  createDefaultGuardianArray
} from '@/lib/sect-data';
import {
  checkSectJoinRequirements,
  contributeToGuardianArray,
  executeVeinBattle,
  getOccupiedVeinsBuffs,
  VeinCombatResult
} from '@/lib/sect-logic';
import { audioEngine } from '@/lib/audio-engine';
import { DEFAULT_MANUALS, SECT_MANUALS } from '@/lib/manuals-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseSectActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useSectActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseSectActionsParams) {
  const [sectSubTab, setSectSubTab] = useState<SectSubTab>('overview');
  const [activeVeinBattle, setActiveVeinBattle] = useState<(VeinCombatResult & { veinId: string; veinName: string }) | null>(null);
  const [isFightingVein, setIsFightingVein] = useState<boolean>(false);

  // Bái nhập môn phái (kiểm tra 5 Tier yêu cầu: Cảnh giới, Căn cốt, Linh căn)
  const handleJoinSect = (sectId: SectId) => {
    const sect = SECT_DATA_MAP[sectId] || SECT_PROFILES[sectId];
    if (!sect) {
      showToast('⚠️ Môn phái không tồn tại hoặc đã thoái ẩn khỏi thế gian!');
      return;
    }

    // 1. Kiểm tra tiêu chuẩn gia nhập môn phái
    const checkResult = checkSectJoinRequirements(player, sect);
    if (!checkResult.canJoin) {
      audioEngine.playSFX('thunder', false, 0.7);
      const detailReasons = checkResult.missingReasons.join(' ');
      showToast(`🔒 Ngươi chưa đủ tư cách bái nhập [${sect.name}]! ${detailReasons}`);
      addLog(
        'Bái Sư Bị Cự Tuyệt',
        `Sơn môn [${sect.name}] phát ra cấm chế chấn lui đạo hữu! Tiêu chuẩn còn thiếu:\n• ${checkResult.missingReasons.join('\n• ')}`,
        'sect'
      );
      return;
    }

    // 2. Nếu đang ở tông môn khác -> thông báo chuyển môn phái
    const currentSectId = player.sectState?.sectId || player.sect;
    let transferNote = '';
    if (currentSectId && currentSectId !== sectId) {
      const oldSect = SECT_DATA_MAP[currentSectId] || SECT_PROFILES[currentSectId];
      transferNote = ` Đã chuyển từ [${oldSect?.name || 'môn phái cũ'}], cống hiến cũ đã được giải phóng.`;
    }

    const quests = generateDailyQuests();
    const updatedSect: SectState = {
      sectId,
      rank: 'tap_dich',
      contribution: 100, // Thưởng 100 điểm bái môn
      totalContribution: 100,
      joinedAt: Date.now(),
      dailyQuests: quests,
      arenaRank: 5,
      arenaTitle: undefined,
      unlockedRecipes: player.sectState?.unlockedRecipes || [],
      unlockedManuals: player.sectState?.unlockedManuals || []
    };

    const updated = normalizePlayerData({
      ...player,
      sect: sectId,
      sectRank: 'tap_dich',
      sectContribution: 100,
      sectState: updatedSect,
      tongMon: sect.name
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Phát SFX đột phá / chúc mừng bái sư
    audioEngine.playSFX('breakthrough');

    showToast(`🎉 Chúc mừng đạo hữu đã bái nhập [${sect.name}] (${sect.tierName})! Nhận danh xưng Tạp Dịch Đệ Tử!${transferNote}`);
    addLog(
      'Bái Nhập Môn Phái',
      `Chính thức gia nhập [${sect.name}] (${sect.tierName}) - Phái [${sect.specialtyName}]. Tôn chỉ: "${sect.tagline}". Thưởng lễ bái môn 100 Cống Hiến!${transferNote}`,
      'sect'
    );
  };

  // Phản xuất tông môn
  const handleLeaveSect = () => {
    if (!player.sectState?.sectId) return;
    const oldName = SECT_PROFILES[player.sectState.sectId]?.name || 'Tông Môn';
    const penaltyDanhVong = Math.min(player.danhVong, 200);

    const updatedSect: SectState = {
      sectId: null,
      rank: 'tap_dich',
      contribution: 0,
      totalContribution: 0,
      dailyQuests: [],
      arenaRank: 5,
      arenaTitle: undefined,
      unlockedRecipes: player.sectState?.unlockedRecipes || [],
      unlockedManuals: player.sectState?.unlockedManuals || []
    };

    const updated = normalizePlayerData({
      ...player,
      danhVong: Math.max(0, player.danhVong - penaltyDanhVong),
      sect: null,
      sectRank: 'tap_dich',
      sectContribution: 0,
      sectState: updatedSect,
      tongMon: undefined
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`⚡ Đạo hữu đã phản xuất khỏi ${oldName}, toàn bộ Cống Hiến bị hủy bỏ, giảm ${penaltyDanhVong} Danh Vọng!`);
    addLog('Phản Xuất Tông Môn', `Đoạn tuyệt quan hệ cùng ${oldName}, trừ toàn bộ điểm cống hiến môn quy và giảm ${penaltyDanhVong} Danh Vọng. Trở về thân phận Tán Tu.`, 'sect');
  };

  // Nhận thưởng nhiệm vụ môn phái
  const handleClaimQuestReward = (questId: string) => {
    if (!player.sectState || !player.sectState.sectId) return;
    const quests = [...player.sectState.dailyQuests];
    const q = quests.find(x => x.id === questId);
    if (!q || !q.isCompleted || q.isClaimed) return;

    q.isClaimed = true;
    const newContribution = (player.sectState.contribution || 0) + q.rewardContribution;
    const newTotal = (player.sectState.totalContribution || 0) + q.rewardContribution;
    const rewardDanhVong = q.rewardDanhVong || 10;

    const updatedSect: SectState = {
      ...player.sectState,
      contribution: newContribution,
      totalContribution: newTotal,
      dailyQuests: quests
    };

    const updated: PlayerStats = normalizePlayerData({
      ...player,
      linhThach: player.linhThach + q.rewardLinhThach,
      tuVi: player.tuVi + (q.rewardTuVi || 0),
      danhVong: player.danhVong + rewardDanhVong,
      sectContribution: newContribution,
      sectState: updatedSect
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`🎖️ Hoàn thành nhiệm vụ [${q.title}]! Nhận +${q.rewardContribution} Cống Hiến, +${q.rewardLinhThach} Linh Thạch, +${rewardDanhVong} Danh Vọng!`);
    addLog('Nhiệm Vụ Tông Môn', `Giao phó [${q.title}]. Nhận ${q.rewardContribution} Cống Hiến Môn Phái, ${q.rewardLinhThach} Linh Thạch & ${rewardDanhVong} Danh Vọng.`, 'sect');
  };

  // Làm mới nhiệm vụ
  const handleResetQuests = () => {
    if (!player.sectState || !player.sectState.sectId) return;
    const newQuests = generateDailyQuests();
    const updatedSect: SectState = {
      ...player.sectState,
      dailyQuests: newQuests
    };
    const updated = normalizePlayerData({
      ...player,
      sectState: updatedSect
    });
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('🔄 Đã làm mới bảng nhiệm vụ hằng ngày của Tông Môn!');
  };

  // Làm nhiệm vụ tuần tra
  const handleDoPatrolQuest = (questId: string) => {
    if (!player.sectState) return;
    const quests = [...player.sectState.dailyQuests];
    const q = quests.find(x => x.id === questId);
    if (!q || q.isCompleted) return;

    q.currentCount = q.targetCount;
    q.isCompleted = true;

    const updated = normalizePlayerData({
      ...player,
      sectState: {
        ...player.sectState,
        dailyQuests: quests
      }
    });
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('Đã hoàn thành tuần tra hộ sơn đại trận! Hãy nhận thưởng.');
    addLog('Tuần Sơn Hộ Tông', 'Tuần tra kết giới hộ sơn, phát hiện vài con yêu dơi nhỏ đã bị kiếm khí chém rụng.', 'sect');
  };

  // Quyên góp linh thạch
  const handleDonateLinhThachQuest = (questId: string) => {
    if (!player.sectState) return;
    const quests = [...player.sectState.dailyQuests];
    const q = quests.find(x => x.id === questId);
    if (!q || q.isCompleted) return;

    if (player.linhThach < q.targetCount) {
      showToast(`Không đủ ${q.targetCount} Linh Thạch để quyên góp!`);
      return;
    }

    q.currentCount = q.targetCount;
    q.isCompleted = true;

    const updated = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - q.targetCount,
      sectState: {
        ...player.sectState,
        dailyQuests: quests
      }
    });
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`Đã quyên góp ${q.targetCount} Linh Thạch vào ngân khố môn phái! Hãy nhận thưởng.`);
    addLog('Quyên Góp Tông Môn', `Dâng tặng ${q.targetCount} Linh Thạch vào phủ khố môn phái, tích lũy công đức.`, 'sect');
  };

  // Cống nộp dược liệu
  const handleDonateHerbsQuest = (questId: string) => {
    if (!player.sectState) return;
    const quests = [...player.sectState.dailyQuests];
    const q = quests.find(x => x.id === questId);
    if (!q || q.isCompleted) return;

    const invHerbs = [...(player.inventory?.herbs || [])];
    const totalHerbsOwned = invHerbs.reduce((sum, h) => sum + h.quantity, 0);
    const needed = q.targetCount - q.currentCount;

    if (totalHerbsOwned < needed) {
      showToast(`Không đủ linh thảo trong túi! Cần ${needed} cọng linh thảo bất kỳ.`);
      return;
    }

    let remainingToDeduct = needed;
    for (const h of invHerbs) {
      if (remainingToDeduct <= 0) break;
      const take = Math.min(h.quantity, remainingToDeduct);
      h.quantity -= take;
      remainingToDeduct -= take;
    }

    q.currentCount = q.targetCount;
    q.isCompleted = true;

    const updated = normalizePlayerData({
      ...player,
      inventory: {
        ...(player.inventory || { pills: [], ores: [], manuals: [] }),
        herbs: invHerbs.filter(h => h.quantity > 0)
      },
      sectState: {
        ...player.sectState,
        dailyQuests: quests
      }
    });
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`Đã cống nộp ${needed} linh thảo vào đan khố môn phái! Hãy nhận thưởng.`);
    addLog('Cống Nộp Dược Liệu', `Giao nộp ${needed} thảo dược từ Động Phủ vào đan phòng môn phái.`, 'sect');
  };

  // Quyên góp khoáng thạch
  const handleDonateOresQuest = (questId: string) => {
    if (!player.sectState) return;
    const quests = [...player.sectState.dailyQuests];
    const q = quests.find(x => x.id === questId);
    if (!q || q.isCompleted) return;

    const invOres = [...(player.inventory?.ores || [])];
    const totalOresOwned = invOres.reduce((sum, o) => sum + o.quantity, 0);
    const needed = q.targetCount - q.currentCount;

    if (totalOresOwned < needed) {
      showToast(`Không đủ khoáng thạch trong túi! Cần ${needed} khoáng thạch bất kỳ.`);
      return;
    }

    let remainingToDeduct = needed;
    for (const o of invOres) {
      if (remainingToDeduct <= 0) break;
      const take = Math.min(o.quantity, remainingToDeduct);
      o.quantity -= take;
      remainingToDeduct -= take;
    }

    q.currentCount = q.targetCount;
    q.isCompleted = true;

    const updated = normalizePlayerData({
      ...player,
      inventory: {
        ...(player.inventory || { pills: [], herbs: [], manuals: [] }),
        ores: invOres.filter(o => o.quantity > 0)
      },
      sectState: {
        ...player.sectState,
        dailyQuests: quests
      }
    });
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`Đã quyên góp ${needed} khoáng thạch vào luyện khí đường môn phái! Hãy nhận thưởng.`);
    addLog('Quyên Góp Khoáng Thạch', `Giao nộp ${needed} khoáng thạch hỗ trợ rèn đúc binh khí tông môn.`, 'sect');
  };

  // Lĩnh bổng lộc hằng ngày
  const handleClaimDailySalary = () => {
    if (!player.sectState?.sectId) {
      showToast('Đạo hữu là Tán Tu, không có bổng lộc môn phái!');
      return;
    }
    const check = canClaimDailySalary(player.sectState);
    if (!check.canClaim) {
      const hours = Math.ceil(check.timeRemainingMs / (1000 * 60 * 60));
      showToast(`Hôm nay đạo hữu đã nhận bổng lộc rồi! Vui lòng quay lại sau ${hours} giờ.`);
      return;
    }

    const rank = player.sectState.rank || 'tap_dich';
    const rankCfg = SECT_RANKS_CONFIG[rank];
    const salary = rankCfg?.salary || 50;

    const updatedSect: SectState = {
      ...player.sectState,
      lastSalaryClaimedAt: Date.now()
    };

    const updated = normalizePlayerData({
      ...player,
      linhThach: player.linhThach + salary,
      sectState: updatedSect
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`💰 Đã lĩnh thưởng bổng lộc hằng ngày: +${salary.toLocaleString()} Linh Thạch!`);
    addLog('Lĩnh Thưởng Bổng Lộc', `Nhận bổng lộc nhật thường cấp [${rankCfg?.title || 'Đệ tử'}]: +${salary.toLocaleString()} Linh Thạch từ Nội Vụ Đường.`, 'sect');
  };

  // Thăng chức địa vị môn phái
  const handlePromoteRank = () => {
    if (!player.sectState?.sectId) {
      showToast('Đạo hữu cần bái nhập môn phái trước!');
      return;
    }

    const check = checkCanPromoteSectRank(player);
    if (!check.canPromote || !check.nextRank || !check.nextRankDetail) {
      showToast(check.reason);
      return;
    }

    const newRank = check.nextRank;
    const newRankDetail = check.nextRankDetail;

    const updatedSect: SectState = {
      ...player.sectState,
      rank: newRank
    };

    const updated = normalizePlayerData({
      ...player,
      sectRank: newRank,
      sectState: updatedSect
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const isElderOrMaster = newRank === 'truong_lao' || newRank === 'chuong_mon';
    if (isElderOrMaster) {
      showToast(`🔥 CHÚC MỪNG! Đạo hữu đã được phong làm [${newRankDetail.title}], kích hoạt HÀO QUANG TRẤN PHÁI!`);
      addLog('Thăng Phong Địa Vị', `Được toàn tông tôn kính tấn thăng [${newRankDetail.title}], uy phong lẫm liệt, kích hoạt Hào Quang Trấn Phái hộ thể!`, 'sect');
    } else {
      showToast(`🎉 Chúc mừng đạo hữu đã được thăng phong làm [${newRankDetail.title}]!`);
      addLog('Thăng Phong Địa Vị', `Tích lũy đủ công đức và cảnh giới, chính thức tấn thăng thành [${newRankDetail.title}].`, 'sect');
    }
  };

  // Luận kiếm môn phái (Đấu trường Arena)
  const handleFightArena = (opponent: SectArenaFighter) => {
    if (!player.sectState?.sectId) {
      showToast('Cần gia nhập môn phái để tham gia Luận Kiếm!');
      return { victory: false, logs: ['Chưa gia nhập tông môn'] };
    }

    const battle = resolveSectArenaBattle(player, opponent);

    if (battle.victory) {
      const curArenaRank = player.sectState.arenaRank ?? 5;
      const oppRank = opponent.rank ?? opponent.rankPosition ?? 5;
      const newArenaRank = Math.min(curArenaRank, oppRank);
      const isDefeatedRank1 = oppRank === 1;
      const newTitle = isDefeatedRank1 ? 'Đệ Nhất Thiên Kiêu' : player.sectState.arenaTitle;

      const newContrib = (player.sectState.contribution || 0) + battle.rewards.contribution;
      const newTotalContrib = (player.sectState.totalContribution || 0) + battle.rewards.contribution;

      const updatedSect: SectState = {
        ...player.sectState,
        contribution: newContrib,
        totalContribution: newTotalContrib,
        arenaRank: newArenaRank,
        arenaTitle: newTitle
      };

      const oppRealm = Number(opponent.realm || 1);
      let stolenFate = 0;
      if (oppRealm >= player.currentRealm) {
        stolenFate = Math.random() < 0.5 ? 1 : 2;
      }
      const newKhiVan = (player.khiVan || 50) + (stolenFate > 0 ? stolenFate : 0);
      const newStolenFatePoints = (player.stolenFatePoints || 0) + stolenFate;

      const updated = normalizePlayerData({
        ...player,
        linhThach: player.linhThach + battle.rewards.linhThach,
        danhVong: player.danhVong + battle.rewards.danhVong,
        sectContribution: newContrib,
        sectState: updatedSect,
        khiVan: newKhiVan,
        stolenFatePoints: newStolenFatePoints
      });

      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (stolenFate > 0) {
        addLog(
          '✨ CƯỚP ĐOẠT KHÍ VẬN',
          `Thiên đạo vô tình, kẻ thắng làm vua! Ngươi đã cướp đoạt ${stolenFate} điểm Khí Vận từ [${opponent.name}]!`,
          'sect'
        );
      }

      if (isDefeatedRank1) {
        showToast(`👑 VÔ ĐỊCH THIÊN KIÊU! Đạo hữu đánh bại Thủ Tịch, nhận tôn hiệu [Đệ Nhất Thiên Kiêu]${stolenFate > 0 ? `, cướp đoạt +${stolenFate} Khí Vận` : ''} và +${battle.rewards.contribution} Cống Hiến!`);
        addLog('Luận Kiếm Sơn Môn', `Đánh bại ${opponent.name}, đăng quang ngôi vị [Đệ Nhất Thiên Kiêu] tông môn! Thưởng +${battle.rewards.contribution} Cống Hiến, +${battle.rewards.linhThach} Linh Thạch.`, 'sect');
      } else {
        showToast(`⚔️ Thắng trận luận kiếm trước [${opponent.name}]!${stolenFate > 0 ? ` Cướp đoạt +${stolenFate} Khí Vận!` : ''} Nhận +${battle.rewards.contribution} Cống Hiến, +${battle.rewards.linhThach} Linh Thạch!`);
        addLog('Luận Kiếm Sơn Môn', `Thắng trận trước ${opponent.name} (Hạng ${oppRank}). Tăng thứ hạng lên Top ${newArenaRank}, nhận +${battle.rewards.contribution} Cống Hiến.`, 'sect');
      }
    } else {
      const oppRank = opponent.rank ?? opponent.rankPosition ?? 5;
      showToast(`Đấu pháp bất phân thắng bại trước [${opponent.name}], đạo hữu hãy tiếp tục khổ tu!`);
      addLog('Luận Kiếm Sơn Môn', `Thất bại trước ${opponent.name} (Hạng ${oppRank}). Đạo tâm vững vàng, rút ra nhiều kinh nghiệm chiến đấu.`, 'sect');
    }

    return battle;
  };

  // Mua đồ Tàng Bảo Các Tông Môn
  const handleBuySectShopItem = (item: SectShopItem) => {
    if (!player.sectState || !player.sectState.sectId) {
      showToast('Cần bái nhập môn phái để đổi vật phẩm tại Tàng Kinh Các!');
      return;
    }

    if (player.sectState.contribution < item.costContribution) {
      showToast(`Điểm cống hiến không đủ! Cần ${item.costContribution.toLocaleString()} Cống Hiến (hiện có: ${player.sectState.contribution}).`);
      return;
    }

    const rankOrder: SectRank[] = ['tap_dich', 'ngoai_mon', 'noi_mon', 'chan_truyen', 'truong_lao', 'chuong_mon'];
    const currentRank = player.sectState.rank || 'tap_dich';
    const userRankIdx = rankOrder.indexOf(currentRank);
    const reqRankIdx = rankOrder.indexOf(item.requiredRank);

    if (userRankIdx < reqRankIdx) {
      const reqTitle = SECT_RANKS_CONFIG[item.requiredRank]?.title || item.requiredRank;
      showToast(`Thân phận chưa đủ! Yêu cầu tối thiểu từ [${reqTitle}] trở lên.`);
      return;
    }

    // Đan phương
    if (item.type === 'dan_phuong' && item.recipeId) {
      if (player.sectState.unlockedRecipes.includes(item.recipeId)) {
        showToast('Ngươi đã lĩnh hội Đan Phương này rồi!');
        return;
      }

      const newContrib = player.sectState.contribution - item.costContribution;
      const updatedSect: SectState = {
        ...player.sectState,
        contribution: newContrib,
        unlockedRecipes: [...player.sectState.unlockedRecipes, item.recipeId]
      };

      const updated = normalizePlayerData({
        ...player,
        sectContribution: newContrib,
        sectState: updatedSect
      });
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      showToast(`Đã đổi thành công Đan Phương [${item.name}]!`);
      addLog('Đổi Vật Phẩm Tông Môn', `Dùng ${item.costContribution} Cống Hiến đổi [${item.name}].`, 'sect');
      return;
    }

    // Bí tịch công pháp
    if (item.type === 'bi_tich' && item.manualId) {
      if (player.sectState.unlockedManuals.includes(item.manualId)) {
        showToast('Ngươi đã sở hữu Bí Tịch này rồi!');
        return;
      }
      const foundManual = [...DEFAULT_MANUALS, ...SECT_MANUALS].find((m: Manual) => m.id === item.manualId);
      const updatedManuals = foundManual ? [...(player.manuals || []), { ...foundManual, level: 1 }] : (player.manuals || []);
      const newContrib = player.sectState.contribution - item.costContribution;
      const updatedSect: SectState = {
        ...player.sectState,
        contribution: newContrib,
        unlockedManuals: [...player.sectState.unlockedManuals, item.manualId]
      };
      const updated = normalizePlayerData({
        ...player,
        manuals: updatedManuals,
        sectContribution: newContrib,
        sectState: updatedSect
      });
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      showToast(`Đã đổi thành công Bí Tịch [${item.name}]!`);
      addLog('Đổi Vật Phẩm Tông Môn', `Dùng ${item.costContribution} Cống Hiến đổi [${item.name}].`, 'sect');
      return;
    }

    // Tinh huyết yêu thú
    if (item.id.includes('tinh_huyet') || item.name.includes('Tinh Huyết') || item.id === 'shop_blood_pack') {
      const dropCount = item.id.includes('pack') ? 5 : 3;
      const newContrib = player.sectState.contribution - item.costContribution;
      const updatedSect: SectState = {
        ...player.sectState,
        contribution: newContrib
      };
      const updated = normalizePlayerData({
        ...player,
        tinhHuyetYeuThu: (player.tinhHuyetYeuThu || 0) + dropCount,
        sectContribution: newContrib,
        sectState: updatedSect
      });
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      showToast(`🎉 Đã đổi thành công [${item.name}]! Nhận +${dropCount} Tinh Huyết Yêu Thú để Tôi Thể!`);
      addLog('Đổi Vật Phẩm Tông Môn', `Dùng ${item.costContribution} Cống Hiến đổi [${item.name}], nhận ngay +${dropCount} Tinh Huyết Yêu Thú!`, 'sect');
      return;
    }

    // Hạt giống hoặc vật phẩm khác
    const newContrib = player.sectState.contribution - item.costContribution;
    const updatedSect: SectState = {
      ...player.sectState,
      contribution: newContrib
    };
    const updated = normalizePlayerData({
      ...player,
      sectContribution: newContrib,
      sectState: updatedSect
    });
    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`Đã đổi thành công [${item.name}]!`);
    addLog('Đổi Vật Phẩm Tông Môn', `Dùng ${item.costContribution} Cống Hiến đổi [${item.name}].`, 'sect');
  };

  // ----------------------------------------------------
  // HỆ THỐNG ĐẠI TRẬN HỘ SƠN (SECT GUARDIAN ARRAY HANDLERS)
  // ----------------------------------------------------
  const handleDonateToArray = (
    type: 'linhThach' | 'contribution' | 'formation',
    amountOrItemId: number | string
  ) => {
    if (!player.sectState?.sectId) {
      showToast('⚠️ Đạo hữu chưa gia nhập môn phái!');
      return;
    }

    const currentArray = player.sectState.guardianArray || createDefaultGuardianArray();
    if (currentArray.level >= 10 && currentArray.exp >= currentArray.maxExp) {
      showToast('⚡ Hộ Sơn Đại Trận đã đạt đến cảnh giới viên mãn cực đạo (Cấp 10)!');
      return;
    }

    let updatedInventory = player.inventory;
    let newLinhThach = player.linhThach || 0;
    let newContrib = player.sectState.contribution || 0;
    let paramVal = 0;

    if (type === 'linhThach') {
      const amount = typeof amountOrItemId === 'number' ? amountOrItemId : parseInt(amountOrItemId, 10);
      if (isNaN(amount) || amount <= 0) return;
      if (newLinhThach < amount) {
        showToast(`⚠️ Không đủ Linh Thạch! Cần ${amount.toLocaleString()} Linh Thạch.`);
        return;
      }
      newLinhThach -= amount;
      paramVal = amount;
    } else if (type === 'contribution') {
      const amount = typeof amountOrItemId === 'number' ? amountOrItemId : parseInt(amountOrItemId, 10);
      if (isNaN(amount) || amount <= 0) return;
      if (newContrib < amount) {
        showToast(`⚠️ Không đủ Điểm Cống Hiến! Cần ${amount.toLocaleString()} cống hiến.`);
        return;
      }
      newContrib -= amount;
      paramVal = amount;
    } else if (type === 'formation') {
      const itemId = String(amountOrItemId);
      const formations = (player.inventory?.formations || []) as FormationItem[];
      const targetIndex = formations.findIndex(f => f.id === itemId);
      if (targetIndex === -1) {
        showToast('⚠️ Không tìm thấy Trận Bàn này trong túi đồ!');
        return;
      }
      const targetFormation = formations[targetIndex];
      paramVal = targetFormation.tier || 1;
      const updatedFormations = [...formations];
      updatedFormations.splice(targetIndex, 1);
      updatedInventory = {
        pills: player.inventory?.pills || [],
        herbs: player.inventory?.herbs || [],
        ores: player.inventory?.ores || [],
        equipment: player.inventory?.equipment || [],
        storageGems: player.inventory?.storageGems || [],
        talismans: player.inventory?.talismans || [],
        ...(player.inventory || {}),
        formations: updatedFormations
      };
    }

    const contribRes = contributeToGuardianArray(currentArray, type, paramVal);

    const updatedSect: SectState = {
      ...player.sectState,
      contribution: newContrib,
      guardianArray: contribRes.updatedArray
    };

    const updated = normalizePlayerData({
      ...player,
      linhThach: newLinhThach,
      sectContribution: newContrib,
      sectState: updatedSect,
      sectData: updatedSect,
      inventory: updatedInventory
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (contribRes.leveledUp) {
      audioEngine.playSFX('breakthrough');
    } else {
      audioEngine.playSFX('craft');
    }

    showToast(contribRes.message);
    addLog('Đại Trận Hộ Sơn', contribRes.message, 'sect');
  };

  // ----------------------------------------------------
  // HỆ THỐNG TRANH ĐOẠT LINH MẠCH (SPIRIT VEIN WARS HANDLERS)
  // ----------------------------------------------------
  const handleAttackVein = (veinId: string) => {
    if (!player.sectState?.sectId) {
      showToast('⚠️ Đạo hữu chưa gia nhập môn phái!');
      return;
    }

    // Cooldown 30 phút sau khi thất bại
    const lastWar = player.sectState.lastVeinWarAt || 0;
    const cooldownMs = 30 * 60 * 1000;
    const timeSinceLast = Date.now() - lastWar;
    if (timeSinceLast < cooldownMs && (player.khiHuyet || 0) < (player.maxKhiHuyet || 500) * 0.5) {
      const minsLeft = Math.ceil((cooldownMs - timeSinceLast) / 60000);
      showToast(`⚠️ Đạo hữu thương thế chưa lành! Cần nghỉ ngơi thêm ${minsLeft} phút hoặc hồi phục Khí Huyết để khiêu chiến.`);
      return;
    }

    const vein = getSectVeinById(veinId, player.sectState);
    if (!vein) {
      showToast('⚠️ Cứ điểm linh mạch không tồn tại!');
      return;
    }

    setIsFightingVein(true);
    audioEngine.playSFX('thunder', false, 0.6);

    try {
      const battleRes = executeVeinBattle(player, veinId);
      const updated = normalizePlayerData(battleRes.updatedPlayer);
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (battleRes.combatResult.victory) {
        audioEngine.playSFX('breakthrough');
      } else {
        audioEngine.playSFX('death');
      }

      setActiveVeinBattle({
        ...battleRes.combatResult,
        veinId,
        veinName: vein.name
      });

      showToast(battleRes.message);
      addLog(
        battleRes.combatResult.victory ? 'Tranh Đoạt Linh Mạch Thắng Lợi' : 'Tranh Đoạt Linh Mạch Thất Bại',
        `Khiêu chiến cứ điểm [${vein.name}]: ${battleRes.combatResult.victory ? 'Chiến thắng oanh liệt!' : 'Bị đánh lui!'}`,
        'sect'
      );
    } finally {
      setIsFightingVein(false);
    }
  };

  const handleClaimVeinStipend = () => {
    if (!player.sectState?.sectId) {
      showToast('⚠️ Đạo hữu chưa gia nhập môn phái!');
      return;
    }

    const veinBuffs = getOccupiedVeinsBuffs(player);
    if (veinBuffs.occupiedCount === 0 || veinBuffs.dailyLinhThachStipend <= 0) {
      showToast('⚠️ Tông môn hiện chưa chiếm giữ Linh Mạch nào để nhận bổng lộc!');
      return;
    }

    const lastClaim = player.sectState.lastVeinClaimAt || 0;
    const cooldownMs = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastClaim;
    if (elapsed < cooldownMs) {
      const hoursLeft = Math.ceil((cooldownMs - elapsed) / 3600000);
      showToast(`⏳ Hôm nay đạo hữu đã nhận bổng lộc Linh Mạch rồi! Quay lại sau ${hoursLeft} giờ.`);
      return;
    }

    const stipend = veinBuffs.dailyLinhThachStipend;
    const updatedSect: SectState = {
      ...player.sectState,
      lastVeinClaimAt: Date.now()
    };

    const updated = normalizePlayerData({
      ...player,
      linhThach: (player.linhThach || 0) + stipend,
      sectState: updatedSect,
      sectData: updatedSect
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    audioEngine.playSFX('coins');
    showToast(`💰 Đã lĩnh nhận bổng lộc Linh Mạch: +${stipend.toLocaleString()} Linh Thạch!`);
    addLog('Bổng Lộc Linh Mạch', `Thu hoạch bổng lộc từ ${veinBuffs.occupiedCount} cứ điểm Linh Mạch đang chiếm đóng: +${stipend.toLocaleString()} Linh Thạch.`, 'sect');
  };

  const handleReinforceVein = (veinId: string) => {
    if (!player.sectState?.sectId) {
      showToast('⚠️ Đạo hữu chưa gia nhập môn phái!');
      return;
    }

    const costLT = 200;
    if ((player.linhThach || 0) < costLT) {
      showToast(`⚠️ Không đủ Linh Thạch để gia cố trận địa (Cần ${costLT} Linh Thạch)!`);
      return;
    }

    const vein = getSectVeinById(veinId, player.sectState);
    if (!vein) {
      showToast('⚠️ Không tìm thấy linh mạch!');
      return;
    }

    const currentVeinStates = { ...(player.sectState.veinStates || {}) };
    const currentDefense = currentVeinStates[veinId]?.defensePower ?? vein.defensePower;
    const newDefense = currentDefense + 100;

    currentVeinStates[veinId] = {
      occupiedSectId: currentVeinStates[veinId]?.occupiedSectId || vein.occupiedSectId,
      occupiedAt: currentVeinStates[veinId]?.occupiedAt || vein.occupiedAt,
      defensePower: newDefense
    };

    const updatedSect: SectState = {
      ...player.sectState,
      veinStates: currentVeinStates
    };

    const updated = normalizePlayerData({
      ...player,
      linhThach: (player.linhThach || 0) - costLT,
      sectState: updatedSect,
      sectData: updatedSect
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    audioEngine.playSFX('craft');
    showToast(`🛡️ Gia cố [${vein.name}] thành công! Phòng thủ tăng lên ${newDefense.toLocaleString()} (+100).`);
    addLog('Gia Cố Trận Địa', `Tiêu hao ${costLT} Linh Thạch để gia cố cấm chế cứ điểm [${vein.name}], nâng phòng ngự lên ${newDefense.toLocaleString()}.`, 'sect');
  };

  const handleCloseVeinBattleModal = () => {
    setActiveVeinBattle(null);
  };

  return {
    sectSubTab,
    setSectSubTab,
    activeVeinBattle,
    isFightingVein,
    handleJoinSect,
    handleLeaveSect,
    handleClaimQuestReward,
    handleResetQuests,
    handleDoPatrolQuest,
    handleDonateLinhThachQuest,
    handleDonateHerbsQuest,
    handleDonateOresQuest,
    handleClaimDailySalary,
    handlePromoteRank,
    handleFightArena,
    handleBuySectShopItem,
    handleDonateToArray,
    handleAttackVein,
    handleClaimVeinStipend,
    handleReinforceVein,
    handleCloseVeinBattleModal
  };
}
