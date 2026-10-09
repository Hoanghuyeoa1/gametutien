import { useState } from 'react';
import { PlayerStats, Herb, LogType } from '@/lib/types';
import {
  HERB_SEEDS,
  LINH_DIEN_LEVELS,
  createDefaultLinhDien,
  calculateYieldCount,
  calculateGrowthDuration
} from '@/lib/garden-data';
import { DEFAULT_HERBS } from '@/lib/alchemy-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseGardenActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useGardenActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseGardenActionsParams) {
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [showPlantSeedModal, setShowPlantSeedModal] = useState<boolean>(false);
  const [showLinhDienUpgradeModal, setShowLinhDienUpgradeModal] = useState<boolean>(false);

  // Gieo hạt giống
  const handlePlantSeed = (plotId: number, seedId: string) => {
    const seed = HERB_SEEDS.find(s => s.id === seedId);
    if (!seed) return;

    if (player.linhThach < seed.costLinhThach) {
      showToast(`Linh thạch không đủ! Cần ${seed.costLinhThach} linh thạch để mua hạt giống.`);
      return;
    }

    const linhDien = player.linhDien || createDefaultLinhDien();
    const plot = linhDien.plots.find(p => p.id === plotId);
    if (!plot || !plot.isUnlocked || plot.seedId) {
      showToast('Ô đất này không khả dụng để gieo hạt!');
      return;
    }

    const isCompanionStationed = Boolean(linhDien.stationedCompanionId || player.companionsState?.stationedGardenCompanionId);
    const durationSeconds = calculateGrowthDuration(seed.growthDurationSeconds, linhDien.speedBonusPercent, isCompanionStationed);
    const now = Date.now();

    const updatedPlots = linhDien.plots.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          seedId,
          plantedAt: now,
          harvestAt: now + durationSeconds * 1000,
          readyToHarvest: false
        };
      }
      return p;
    });

    const updated: PlayerStats = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - seed.costLinhThach,
      linhDien: {
        ...linhDien,
        plots: updatedPlots
      }
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowPlantSeedModal(false);
    setSelectedPlotId(null);
    showToast(`🌱 Đã gieo [${seed.name}] vào Ô Đất #${plotId + 1}! Thời gian chín: ${durationSeconds}s${isCompanionStationed ? ' (Tiên Tử giảm 15% tg)' : ''}.`);
    addLog('Gieo Trồng Linh Thảo', `Gieo [${seed.name}] tại ô đất #${plotId + 1}. Tiêu hao ${seed.costLinhThach} Linh thạch.`, 'garden');
  };

  // Thu hoạch một ô đất
  const handleHarvestPlot = (plotId: number) => {
    const linhDien = player.linhDien || createDefaultLinhDien();
    const plot = linhDien.plots.find(p => p.id === plotId);
    if (!plot || !plot.seedId || !plot.harvestAt) return;

    const isReady = plot.readyToHarvest || Date.now() >= plot.harvestAt;
    if (!isReady) {
      const leftSec = Math.ceil((plot.harvestAt - Date.now()) / 1000);
      showToast(`Linh thảo chưa chín! Cần đợi thêm ${leftSec} giây.`);
      return;
    }

    const seed = HERB_SEEDS.find(s => s.id === plot.seedId);
    if (!seed) return;

    const isCompanionStationed = Boolean(linhDien.stationedCompanionId || player.companionsState?.stationedGardenCompanionId);
    const yieldCount = calculateYieldCount(seed.baseYield, linhDien.yieldBonusPercent, isCompanionStationed);
    const invHerbs = [...(player.inventory?.herbs || [])];
    const existingHerb = invHerbs.find((h: Herb) => h.id === seed.herbId);
    if (existingHerb) {
      existingHerb.quantity += yieldCount;
    } else {
      const defaultHerbDef = DEFAULT_HERBS.find(h => h.id === seed.herbId);
      invHerbs.push({
        id: seed.herbId,
        name: seed.herbName,
        grade: seed.grade,
        description: defaultHerbDef?.description || seed.description,
        price: defaultHerbDef?.price || 50,
        quantity: yieldCount
      });
    }

    const updatedPlots = linhDien.plots.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          seedId: null,
          plantedAt: null,
          harvestAt: null,
          readyToHarvest: false
        };
      }
      return p;
    });

    let updatedSect = player.sectState ? { ...player.sectState } : undefined;
    if (updatedSect?.dailyQuests) {
      const q = updatedSect.dailyQuests.find(quest => quest.category === 'garden' && !quest.isCompleted);
      if (q) {
        q.currentCount = Math.min(q.targetCount, q.currentCount + yieldCount);
        if (q.currentCount >= q.targetCount) q.isCompleted = true;
      }
    }

    const updated: PlayerStats = normalizePlayerData({
      ...player,
      inventory: {
        ...(player.inventory || { pills: [], ores: [], manuals: [] }),
        herbs: invHerbs
      },
      linhDien: {
        ...linhDien,
        plots: updatedPlots
      },
      sectState: updatedSect,
      achievementsState: {
        ...player.achievementsState,
        claimedAchievementIds: player.achievementsState?.claimedAchievementIds || [],
        unlockedTitleIds: player.achievementsState?.unlockedTitleIds || [],
        stats: {
          ...player.achievementsState?.stats,
          herbsHarvested: (player.achievementsState?.stats?.herbsHarvested || 0) + yieldCount
        }
      }
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`🎉 Thu hoạch thành công! Nhận được ${yieldCount} cọng [${seed.herbName}]!`);
    addLog('Thu Hoạch Linh Thảo', `Linh khí đất trời kết tinh! Thu hoạch được ${yieldCount} [${seed.herbName}] (${seed.grade}).`, 'garden');
  };

  // Thu hoạch toàn bộ các ô đất chín
  const handleHarvestAllPlots = () => {
    const linhDien = player.linhDien || createDefaultLinhDien();
    const readyPlots = linhDien.plots.filter(p => p.seedId && p.harvestAt && (p.readyToHarvest || Date.now() >= p.harvestAt));
    if (readyPlots.length === 0) {
      showToast('Không có ô đất nào đã chín để thu hoạch!');
      return;
    }

    const invHerbs = [...(player.inventory?.herbs || [])];
    let totalHerbsCount = 0;
    const harvestedNames: string[] = [];

    const updatedPlots = linhDien.plots.map(p => {
      if (p.seedId && p.harvestAt && (p.readyToHarvest || Date.now() >= p.harvestAt)) {
        const seed = HERB_SEEDS.find(s => s.id === p.seedId);
        if (seed) {
          const isCompanionStationed = Boolean(linhDien.stationedCompanionId || player.companionsState?.stationedGardenCompanionId);
          const yieldCount = calculateYieldCount(seed.baseYield, linhDien.yieldBonusPercent, isCompanionStationed);
          totalHerbsCount += yieldCount;
          harvestedNames.push(`${yieldCount}x ${seed.herbName}`);

          const existing = invHerbs.find((h: Herb) => h.id === seed.herbId);
          if (existing) {
            existing.quantity += yieldCount;
          } else {
            const defaultHerbDef = DEFAULT_HERBS.find(h => h.id === seed.herbId);
            invHerbs.push({
              id: seed.herbId,
              name: seed.herbName,
              grade: seed.grade,
              description: defaultHerbDef?.description || seed.description,
              price: defaultHerbDef?.price || 50,
              quantity: yieldCount
            });
          }
        }
        return {
          ...p,
          seedId: null,
          plantedAt: null,
          harvestAt: null,
          readyToHarvest: false
        };
      }
      return p;
    });

    let updatedSect = player.sectState ? { ...player.sectState } : undefined;
    if (updatedSect?.dailyQuests) {
      const q = updatedSect.dailyQuests.find(quest => quest.category === 'garden' && !quest.isCompleted);
      if (q) {
        q.currentCount = Math.min(q.targetCount, q.currentCount + totalHerbsCount);
        if (q.currentCount >= q.targetCount) q.isCompleted = true;
      }
    }

    const updated: PlayerStats = normalizePlayerData({
      ...player,
      inventory: {
        ...(player.inventory || { pills: [], ores: [], manuals: [] }),
        herbs: invHerbs
      },
      linhDien: {
        ...linhDien,
        plots: updatedPlots
      },
      sectState: updatedSect,
      achievementsState: {
        ...player.achievementsState,
        claimedAchievementIds: player.achievementsState?.claimedAchievementIds || [],
        unlockedTitleIds: player.achievementsState?.unlockedTitleIds || [],
        stats: {
          ...player.achievementsState?.stats,
          herbsHarvested: (player.achievementsState?.stats?.herbsHarvested || 0) + totalHerbsCount
        }
      }
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast(`🌾 Đã thu hoạch toàn bộ: ${harvestedNames.join(', ')}!`);
    addLog('Đại Thu Hoạch Linh Điền', `Thu hoạch toàn bộ linh thảo chín rộ trong Động Phủ: ${harvestedNames.join(', ')}.`, 'garden');
  };

  // Nâng cấp Linh Điền
  const handleUpgradeLinhDien = () => {
    const linhDien = player.linhDien || createDefaultLinhDien();
    const curLevel = linhDien.level;
    if (curLevel >= 6) {
      showToast('Linh Điền đã đạt cảnh giới tối cao Huyền Hoàng Thần Điền!');
      return;
    }

    const nextInfo = LINH_DIEN_LEVELS[curLevel + 1];
    if (!nextInfo) return;

    if (player.linhThach < nextInfo.upgradeCostLinhThach) {
      showToast(`Linh thạch không đủ! Cần ${nextInfo.upgradeCostLinhThach.toLocaleString()} Linh Thạch để thăng cấp.`);
      return;
    }

    const updatedPlots = linhDien.plots.map((p, idx) => ({
      ...p,
      isUnlocked: idx < nextInfo.maxPlots
    }));

    const updated: PlayerStats = normalizePlayerData({
      ...player,
      linhThach: player.linhThach - nextInfo.upgradeCostLinhThach,
      linhDien: {
        level: curLevel + 1,
        yieldBonusPercent: nextInfo.yieldBonusPercent,
        speedBonusPercent: nextInfo.speedBonusPercent,
        plots: updatedPlots
      }
    });

    setPlayer(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowLinhDienUpgradeModal(false);
    showToast(`🌟 Nâng cấp thành công! Linh Điền đã đạt cấp ${curLevel + 1}: [${nextInfo.name}]!`);
    addLog('Nâng Cấp Linh Điền', `Tiêu hao ${nextInfo.upgradeCostLinhThach.toLocaleString()} Linh Thạch nâng cấp Linh Điền lên [${nextInfo.name}]. Sản lượng +${nextInfo.yieldBonusPercent}%, Tốc độ +${nextInfo.speedBonusPercent}%, Mở rộng ${nextInfo.maxPlots} ô đất.`, 'garden');
  };

  return {
    selectedPlotId,
    setSelectedPlotId,
    showPlantSeedModal,
    setShowPlantSeedModal,
    showLinhDienUpgradeModal,
    setShowLinhDienUpgradeModal,
    handlePlantSeed,
    handleHarvestPlot,
    handleHarvestAllPlots,
    handleUpgradeLinhDien
  };
}
