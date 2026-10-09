// hooks/useAbodeActions.ts
// Hook quản lý toàn bộ phân hệ Động Thiên Phúc Địa (Homestead & Abode Core)

import { useState, useMemo, useEffect, useCallback } from 'react';
import { PlayerStats, Herb, LogType } from '@/lib/types';
import {
  AbodeSoilType,
  AbodePlotState,
  AbodeState,
  AbodeDisciple
} from '@/lib/types/abode';
import {
  SPIRIT_ARRAY_LEVELS,
  SOIL_CONFIGS,
  ABODE_LEVELS,
  PLOT_UNLOCK_COSTS,
  DISCIPLE_RECRUIT_COST_LINH_THACH,
  DISCIPLE_TRIBUTE_INTERVAL_MS,
  BEAST_FERTILIZER_TICK_SECONDS,
  createDefaultAbodeState
} from '@/lib/abode-data';
import {
  calculateSpiritArrayBuffs,
  calculateSoilCropEfficiency,
  applyFertilizerToPlot,
  tickBeastFertilizer,
  recruitNewDisciple,
  claimDiscipleTribute
} from '@/lib/abode-logic';
import { HERB_SEEDS, calculateGrowthDuration } from '@/lib/garden-data';
import { DEFAULT_HERBS } from '@/lib/alchemy-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';
import { getCustomSanctuaryBuffTotals } from '@/lib/custom-sanctuary-logic';

interface UseAbodeActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useAbodeActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseAbodeActionsParams) {
  // Modal visibility
  const [isAbodeModalOpen, setIsAbodeModalOpen] = useState<boolean>(false);
  const [activeAbodeTab, setActiveAbodeTab] = useState<'array' | 'garden' | 'beasts' | 'pavilion' | 'sanctuary'>('array');
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [showSeedModal, setShowSeedModal] = useState<boolean>(false);
  const [showSoilModal, setShowSoilModal] = useState<boolean>(false);

  // Active abode state helper
  const abodeState: AbodeState = useMemo(() => {
    return player.abodeState || createDefaultAbodeState();
  }, [player.abodeState]);

  // Periodic passive tick for beast fertilizer
  useEffect(() => {
    if (!isAbodeModalOpen) return;
    const interval = setInterval(() => {
      const sanctuary = abodeState.beastSanctuary;
      if (!sanctuary || !sanctuary.roamingBeastIds || sanctuary.roamingBeastIds.length === 0) return;

      const res = tickBeastFertilizer(sanctuary);
      if (res.generatedCount > 0) {
        const updatedAbode: AbodeState = {
          ...abodeState,
          beastSanctuary: {
            ...sanctuary,
            fertilizerStored: res.newFertilizerStored,
            lastFertilizerTick: res.newLastFertilizerTick
          }
        };
        const updated = normalizePlayerData({
          ...player,
          abodeState: updatedAbode
        });
        setPlayer(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAbodeModalOpen, abodeState, player, setPlayer]);

  // Helper commit state
  const commitPlayerState = useCallback((updatedPlayer: PlayerStats) => {
    // Đồng bộ lại 6 ô đầu với player.linhDien nếu có
    if (updatedPlayer.abodeState && updatedPlayer.linhDien) {
      const syncPlots = updatedPlayer.linhDien.plots.map((oldP, idx) => {
        const abodeP = updatedPlayer.abodeState?.plots[idx];
        if (!abodeP) return oldP;
        return {
          ...oldP,
          isUnlocked: abodeP.unlocked,
          seedId: abodeP.seedId,
          plantedAt: abodeP.plantedAt,
          harvestAt: abodeP.harvestAt,
          readyToHarvest: Boolean(abodeP.harvestAt && Date.now() >= abodeP.harvestAt),
          fertilized: abodeP.fertilized
        };
      });
      updatedPlayer.linhDien = {
        ...updatedPlayer.linhDien,
        plots: syncPlots
      };
    }

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }, [setPlayer]);

  // 1. NÂNG CẤP TỤ LINH TRẬN
  const handleUpgradeSpiritArray = () => {
    const currentArray = abodeState.spiritArray;
    const nextLevel = currentArray.level + 1;
    if (nextLevel > 10) {
      showToast('Tụ Linh Trận đã đạt Cấp 10 (Đại Trận Viên Mãn), không thể tăng thêm!');
      return;
    }

    const targetConfig = SPIRIT_ARRAY_LEVELS[nextLevel];
    if (!targetConfig) return;

    // Kiểm tra Linh Thạch
    if (player.linhThach < targetConfig.costLinhThach) {
      showToast(`Linh thạch không đủ! Cần ${targetConfig.costLinhThach.toLocaleString()} Linh thạch.`);
      return;
    }

    // Kiểm tra Trận Kỳ trong túi đồ (nếu có yêu cầu)
    let flagConsumed = false;
    let invBags = [...(player.inventory?.bags || [])];
    let invOres = [...(player.inventory?.ores || [])];

    if (targetConfig.requiredFlagId && targetConfig.requiredFlagCount) {
      const reqId = targetConfig.requiredFlagId;
      const reqCount = targetConfig.requiredFlagCount;
      const bagIndex = invBags.findIndex(b => b.id === reqId && (b.quantity || 1) >= reqCount);
      const oreIndex = invOres.findIndex(o => o.id === reqId && (o.quantity || 1) >= reqCount);

      if (bagIndex !== -1) {
        invBags[bagIndex].quantity = (invBags[bagIndex].quantity || 1) - reqCount;
        if (invBags[bagIndex].quantity <= 0) invBags.splice(bagIndex, 1);
        flagConsumed = true;
      } else if (oreIndex !== -1) {
        invOres[oreIndex].quantity = (invOres[oreIndex].quantity || 1) - reqCount;
        if (invOres[oreIndex].quantity <= 0) invOres.splice(oreIndex, 1);
        flagConsumed = true;
      } else {
        // Tự động mua trận kỳ nếu người chơi có đủ linh thạch tương đương
        const flagCost = targetConfig.level * 2000;
        if (player.linhThach < targetConfig.costLinhThach + flagCost) {
          showToast(`Thiếu [${targetConfig.requiredFlagName} x${reqCount}]! Có thể mua tại Vạn Bảo Thương Hội hoặc chuẩn bị thêm ${flagCost.toLocaleString()} Linh thạch để luyện hóa.`);
          return;
        }
        // Cho phép dùng Linh thạch bù đắp nếu đủ
        showToast(`Đã chi thêm ${flagCost.toLocaleString()} Linh thạch để ngưng luyện [${targetConfig.requiredFlagName}].`);
        targetConfig.costLinhThach += flagCost;
        flagConsumed = true;
      }
    }

    const updatedAbode: AbodeState = {
      ...abodeState,
      spiritArray: {
        level: nextLevel,
        tuViRateBonus: targetConfig.tuViRateBonus,
        autoHealBonus: targetConfig.autoHealBonus
      }
    };

    const updated = {
      ...player,
      linhThach: player.linhThach - targetConfig.costLinhThach,
      inventory: {
        ...(player.inventory || {}),
        bags: invBags,
        ores: invOres,
        pills: player.inventory?.pills || [],
        herbs: player.inventory?.herbs || [],
        manuals: player.inventory?.manuals || [],
        equipments: player.inventory?.equipments || [],
        gems: player.inventory?.gems || [],
        books: player.inventory?.books || []
      },
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    showToast(`⚡ Đại Trận đột phá Cấp ${nextLevel}: [${targetConfig.name}]! +${targetConfig.tuViRateBonus}% Tốc độ tu vi bế quan!`);
    addLog('Tụ Linh Trận', `Thăng cấp Tụ Linh Trận lên Cấp ${nextLevel} [${targetConfig.name}]. Tiêu hao ${targetConfig.costLinhThach.toLocaleString()} Linh thạch. Hiệu ứng: +${targetConfig.tuViRateBonus}% Tu vi toàn cục.`, 'cultivation');
  };

  // 2. NÂNG CẤP CẤP ĐỘNG PHỦ
  const handleUpgradeAbodeLevel = () => {
    const currentLvl = abodeState.level || 1;
    const nextLvl = currentLvl + 1;
    if (nextLvl > 5) {
      showToast('Động Phủ đã đạt cấp tối đa (Cấp 5 - Động Thiên Phúc Địa Thần Cảnh)!');
      return;
    }

    const nextConf = ABODE_LEVELS[nextLvl];
    if (!nextConf) return;

    if (player.currentRealm < nextConf.requiredRealm) {
      showToast(`Cảnh giới chưa đủ! Cần đạt Cảnh giới ${nextConf.requiredRealm} để mở rộng Động Phủ.`);
      return;
    }

    if (player.linhThach < nextConf.upgradeCostLinhThach) {
      showToast(`Linh thạch không đủ! Cần ${nextConf.upgradeCostLinhThach.toLocaleString()} Linh thạch.`);
      return;
    }

    // Tự động mở khóa các ô đất tương ứng với cấp mới
    const updatedPlots = abodeState.plots.map((p, idx) => {
      if (idx < nextConf.maxPlotsUnlocked) {
        return { ...p, unlocked: true };
      }
      return p;
    });

    const updatedAbode: AbodeState = {
      ...abodeState,
      level: nextLvl,
      plots: updatedPlots
    };

    const updated = {
      ...player,
      linhThach: player.linhThach - nextConf.upgradeCostLinhThach,
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    showToast(`🏯 Chúc mừng! Động Phủ thăng cấp thành [${nextConf.name}]! Mở khóa thêm ô đất và thu nạp đệ tử!`);
    addLog('Động Thiên Phúc Địa', `Nâng cấp Động Phủ lên Cấp ${nextLvl} [${nextConf.name}]. Tiêu hao ${nextConf.upgradeCostLinhThach.toLocaleString()} Linh thạch.`, 'garden');
  };

  // 3. MỞ KHÓA Ô ĐẤT DƯỢC VIÊN
  const handleUnlockPlot = (plotId: number) => {
    const plot = abodeState.plots.find(p => p.id === plotId);
    if (!plot) return;
    if (plot.unlocked) {
      showToast(`Ô Đất #${plotId + 1} đã được khai khẩn rồi!`);
      return;
    }

    const cost = PLOT_UNLOCK_COSTS[plotId] || 5000;
    if (player.linhThach < cost) {
      showToast(`Linh thạch không đủ! Cần ${cost.toLocaleString()} Linh thạch để khai khẩn ô đất này.`);
      return;
    }

    const updatedPlots = abodeState.plots.map(p => {
      if (p.id === plotId) {
        return { ...p, unlocked: true };
      }
      return p;
    });

    const updatedAbode: AbodeState = {
      ...abodeState,
      plots: updatedPlots
    };

    const updated = {
      ...player,
      linhThach: player.linhThach - cost,
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    showToast(`🌾 Khai khẩn thành công Ô Đất #${plotId + 1}!`);
    addLog('Dược Viên Khai Khẩn', `Khai khẩn Ô Đất #${plotId + 1}. Tiêu hao ${cost.toLocaleString()} Linh thạch.`, 'garden');
  };

  // 4. CHUYỂN ĐỔI THỔ NHƯỠNG DỊ BIẾN
  const handleChangeSoilType = (plotId: number, targetSoil: AbodeSoilType) => {
    const plot = abodeState.plots.find(p => p.id === plotId);
    if (!plot || !plot.unlocked) {
      showToast('Ô đất chưa được mở khóa!');
      return;
    }

    if (plot.soilType === targetSoil) {
      showToast('Ô đất hiện đã thuộc hệ thổ nhưỡng này!');
      return;
    }

    const soilConf = SOIL_CONFIGS[targetSoil];
    const cost = soilConf.switchCostLinhThach;

    if (player.linhThach < cost) {
      showToast(`Linh thạch không đủ! Cần ${cost.toLocaleString()} Linh thạch để cải tạo thổ nhưỡng.`);
      return;
    }

    const updatedPlots = abodeState.plots.map(p => {
      if (p.id === plotId) {
        return { ...p, soilType: targetSoil };
      }
      return p;
    });

    const updatedAbode: AbodeState = {
      ...abodeState,
      plots: updatedPlots
    };

    const updated = {
      ...player,
      linhThach: player.linhThach - cost,
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    setShowSoilModal(false);
    setSelectedPlotId(null);
    showToast(`✨ Cải tạo Ô Đất #${plotId + 1} thành [${soilConf.name}]!`);
    addLog('Cải Tạo Thổ Nhưỡng', `Chuyển hóa Ô Đất #${plotId + 1} sang thổ nhưỡng [${soilConf.name}]. Tiêu hao ${cost.toLocaleString()} Linh thạch.`, 'garden');
  };

  // 5. GIEO HẠT TRÊN Ô ĐẤT DƯỢC VIÊN
  const handlePlantSeed = (plotId: number, seedId: string) => {
    const seed = HERB_SEEDS.find(s => s.id === seedId);
    if (!seed) return;

    if (player.linhThach < seed.costLinhThach) {
      showToast(`Linh thạch không đủ! Cần ${seed.costLinhThach} Linh thạch để gieo hạt giống này.`);
      return;
    }

    const plot = abodeState.plots.find(p => p.id === plotId);
    if (!plot || !plot.unlocked || plot.seedId) {
      showToast('Ô đất này không khả dụng để gieo hạt!');
      return;
    }

    // Tính thời gian sinh trưởng có xét đến Thổ Nhưỡng Dị Biến
    const soilEff = calculateSoilCropEfficiency(plot.soilType, seed.id);
    const baseDuration = seed.growthDurationSeconds;
    const arrayBuffs = calculateSpiritArrayBuffs(abodeState.spiritArray);

    // Hệ số giảm thời gian từ Thổ Nhưỡng
    const effectiveDurationSeconds = Math.max(
      5,
      Math.floor(baseDuration * soilEff.growthTimeMultiplier)
    );

    const now = Date.now();
    const harvestAt = now + effectiveDurationSeconds * 1000;

    const updatedPlots = abodeState.plots.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          seedId,
          plantedAt: now,
          harvestAt,
          fertilized: false
        };
      }
      return p;
    });

    const updatedAbode: AbodeState = {
      ...abodeState,
      plots: updatedPlots
    };

    const updated = {
      ...player,
      linhThach: player.linhThach - seed.costLinhThach,
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    setShowSeedModal(false);
    setSelectedPlotId(null);

    const extraMsg = soilEff.isSynergized ? ` (${soilEff.description})` : '';
    showToast(`🌱 Đã gieo [${seed.name}] vào Ô Đất #${plotId + 1}! Chín sau: ${effectiveDurationSeconds}s${extraMsg}.`);
    addLog('Gieo Trồng Thảo Dược', `Gieo [${seed.name}] tại Ô Đất #${plotId + 1} (${SOIL_CONFIGS[plot.soilType].name}). Tiêu hao ${seed.costLinhThach} Linh thạch.`, 'garden');
  };

  // 6. THU HOẠCH Ô ĐẤT DƯỢC VIÊN
  const handleHarvestPlot = (plotId: number) => {
    const plot = abodeState.plots.find(p => p.id === plotId);
    if (!plot || !plot.seedId || !plot.harvestAt) return;

    if (Date.now() < plot.harvestAt) {
      const remainSec = Math.ceil((plot.harvestAt - Date.now()) / 1000);
      showToast(`Dược thảo chưa chín! Cần đợi thêm ${remainSec} giây.`);
      return;
    }

    const seed = HERB_SEEDS.find(s => s.id === plot.seedId);
    if (!seed) return;

    const soilEff = calculateSoilCropEfficiency(plot.soilType, seed.id);
    const arrayBuffs = calculateSpiritArrayBuffs(abodeState.spiritArray);
    const sanctuaryBuffs = getCustomSanctuaryBuffTotals(player.customSanctuary);
    const sanctuaryYieldPercent = (sanctuaryBuffs.gardenYieldBonus || 0) * 100;

    // Tính sản lượng thu hoạch: base * soilMultiplier + arrayBonus + sanctuaryResonanceBonus
    const arrayYieldPercent = (arrayBuffs.gardenYieldBonus || 0) + sanctuaryYieldPercent;
    const baseCount = seed.baseYield || 2;
    const totalYield = Math.max(
      1,
      Math.floor(baseCount * soilEff.yieldMultiplier * (1 + arrayYieldPercent / 100))
    );

    // Thêm vào kho dược thảo
    const invHerbs = [...(player.inventory?.herbs || [])];
    const existingHerb = invHerbs.find((h: Herb) => h.id === seed.herbId);
    if (existingHerb) {
      existingHerb.quantity = (existingHerb.quantity || 0) + totalYield;
    } else {
      const herbBase = DEFAULT_HERBS.find(h => h.id === seed.herbId);
      invHerbs.push({
        id: seed.herbId,
        name: seed.herbName || herbBase?.name || 'Linh Thảo',
        grade: seed.grade || 'Nhất Phẩm',
        description: seed.description || '',
        price: seed.costLinhThach || 20,
        quantity: totalYield,
        quality: 'thuong_pham'
      });
    }

    // Kiểm tra tỷ lệ rơi Băng Tinh Linh Ngọc trên Hàn Băng Thổ
    let extraGemEarned = false;
    let invGems = [...(player.inventory?.gems || [])];
    if (soilEff.extraGemChance > 0 && Math.random() < soilEff.extraGemChance) {
      extraGemEarned = true;
      const iceGem = invGems.find(g => g.type === 'thủy');
      if (iceGem) {
        iceGem.count = (iceGem.count || 0) + 1;
      }
    }

    const updatedPlots = abodeState.plots.map(p => {
      if (p.id === plotId) {
        return {
          ...p,
          seedId: null,
          plantedAt: null,
          harvestAt: null,
          fertilized: false
        };
      }
      return p;
    });

    const updatedAbode: AbodeState = {
      ...abodeState,
      plots: updatedPlots
    };

    const updated = {
      ...player,
      inventory: {
        ...(player.inventory || {}),
        herbs: invHerbs,
        gems: invGems,
        pills: player.inventory?.pills || [],
        ores: player.inventory?.ores || [],
        manuals: player.inventory?.manuals || [],
        equipments: player.inventory?.equipments || [],
        books: player.inventory?.books || [],
        bags: player.inventory?.bags || []
      },
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    const gemMsg = extraGemEarned ? ' + Thu được 1 Băng Tinh Thạch 💎!' : '';
    showToast(`🌾 Đã thu hoạch ${totalYield}x [${seed.herbName}] từ Ô Đất #${plotId + 1}!${gemMsg}`);
    addLog('Thu Hoạch Thảo Dược', `Thu hoạch Ô Đất #${plotId + 1}: Nhận ${totalYield}x [${seed.herbName}]${gemMsg}.`, 'garden');
  };

  // 7. THU HOẠCH TOÀN BỘ Ô ĐẤT SẴN SÀNG
  const handleHarvestAllPlots = () => {
    const readyPlots = abodeState.plots.filter(p => p.unlocked && p.seedId && p.harvestAt && Date.now() >= p.harvestAt);
    if (readyPlots.length === 0) {
      showToast('Chưa có ô đất nào chín thảo dược!');
      return;
    }

    readyPlots.forEach(p => handleHarvestPlot(p.id));
  };

  // 8. BÓN PHÂN CHO Ô ĐẤT DƯỢC VIÊN
  const handleFertilizePlot = (plotId: number) => {
    const sanctuary = abodeState.beastSanctuary;
    if (!sanctuary || sanctuary.fertilizerStored <= 0) {
      showToast('Hết phân bón! Hãy thả linh thú vào Linh Thú Viên để sản sinh phân bón.');
      return;
    }

    const plot = abodeState.plots.find(p => p.id === plotId);
    if (!plot || !plot.unlocked || !plot.seedId || !plot.harvestAt) {
      showToast('Ô đất này không có thảo dược đang sinh trưởng để bón phân!');
      return;
    }

    if (Date.now() >= plot.harvestAt) {
      showToast('Dược thảo đã chín, có thể thu hoạch ngay không cần bón phân!');
      return;
    }

    if (plot.fertilized) {
      showToast('Ô đất này đã được bón phân rồi!');
      return;
    }

    // Kiểm tra có linh thú Thần Thú để xác định phẩm cấp phân
    const hasGodBeast = (player.beasts || []).some(
      b => sanctuary.roamingBeastIds?.includes(b.id) && (b.stage >= 3 || b.quality === 'than_pham')
    );
    const tier = hasGodBeast ? 2 : 1;

    const { updatedPlot, savedSeconds } = applyFertilizerToPlot(plot, tier);

    const updatedPlots = abodeState.plots.map(p => (p.id === plotId ? updatedPlot : p));
    const updatedAbode: AbodeState = {
      ...abodeState,
      beastSanctuary: {
        ...sanctuary,
        fertilizerStored: Math.max(0, sanctuary.fertilizerStored - 1)
      },
      plots: updatedPlots
    };

    const updated = {
      ...player,
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    showToast(`💩 Đã bón [${tier === 2 ? 'Thần Thú Linh Phân' : 'Yêu Thú Linh Phân'}]! Rút ngắn ${savedSeconds}s thời gian chín!`);
    addLog('Bón Phân Dược Điền', `Bón phân cho Ô Đất #${plotId + 1}, rút ngắn ngay ${savedSeconds} giây sinh trưởng.`, 'garden');
  };

  // 9. THẢ LINH THÚ VÀO KHU THẢ RÔNG
  const handleAssignBeastToSanctuary = (beastId: string) => {
    const sanctuary = abodeState.beastSanctuary;
    const roaming = sanctuary.roamingBeastIds || [];

    if (roaming.includes(beastId)) {
      // Triệu hồi về
      const updatedRoaming = roaming.filter(id => id !== beastId);
      const updatedAbode: AbodeState = {
        ...abodeState,
        beastSanctuary: {
          ...sanctuary,
          roamingBeastIds: updatedRoaming
        }
      };
      const updated = { ...player, abodeState: updatedAbode };
      commitPlayerState(updated);
      showToast('Đã gọi linh thú trở về túi linh thú!');
      return;
    }

    if (roaming.length >= 3) {
      showToast('Linh Thú Viên chỉ thả rông tối đa 3 Linh Thú cùng lúc!');
      return;
    }

    const updatedRoaming = [...roaming, beastId];
    const updatedAbode: AbodeState = {
      ...abodeState,
      beastSanctuary: {
        ...sanctuary,
        roamingBeastIds: updatedRoaming,
        lastFertilizerTick: Date.now()
      }
    };

    const beast = (player.beasts || []).find(b => b.id === beastId);
    const updated = { ...player, abodeState: updatedAbode };
    commitPlayerState(updated);
    showToast(`🐾 Đã đưa [${beast?.name || 'Linh Thú'}] vào Linh Thú Viên tự do dạo chơi!`);
    addLog('Linh Thú Viên', `Thả [${beast?.name || 'Linh Thú'}] dạo chơi trong Linh Thú Viên. Định kỳ sản sinh Linh Phân bón cây.`, 'companion');
  };

  // 10. THU GOM LINH PHÂN TỪ LINH THÚ VIÊN
  const handleClaimFertilizer = () => {
    const sanctuary = abodeState.beastSanctuary;
    const res = tickBeastFertilizer(sanctuary);

    if (res.generatedCount <= 0 && sanctuary.fertilizerStored <= 0) {
      showToast('Chưa có phân bón mới! Cần thời gian cho linh thú dạo chơi sinh sản.');
      return;
    }

    const updatedAbode: AbodeState = {
      ...abodeState,
      beastSanctuary: {
        ...sanctuary,
        fertilizerStored: res.newFertilizerStored,
        lastFertilizerTick: res.newLastFertilizerTick
      }
    };

    const updated = { ...player, abodeState: updatedAbode };
    commitPlayerState(updated);
    showToast(`💩 Đã thu gom! Hiện có ${res.newFertilizerStored} túi phân bón sẵn sàng sử dụng.`);
  };

  // 11. TRƯNG BÀY CÔNG PHÁP TRONG TÀNG KINH CÁC
  const handleShowcaseManual = (manualId: string) => {
    const pavilion = abodeState.scripturePavilion;
    const showcased = pavilion.showcasedManualIds || [];

    if (showcased.includes(manualId)) {
      const updatedShowcased = showcased.filter(id => id !== manualId);
      const updatedAbode: AbodeState = {
        ...abodeState,
        scripturePavilion: {
          ...pavilion,
          showcasedManualIds: updatedShowcased
        }
      };
      commitPlayerState({ ...player, abodeState: updatedAbode });
      showToast('Đã gỡ bí kíp khỏi giá sách Tàng Kinh Các!');
      return;
    }

    if (showcased.length >= 5) {
      showToast('Tàng Kinh Các chỉ có thể trưng bày tối đa 5 bộ công pháp tâm đắc nhất!');
      return;
    }

    const updatedShowcased = [...showcased, manualId];
    const updatedAbode: AbodeState = {
      ...abodeState,
      scripturePavilion: {
        ...pavilion,
        showcasedManualIds: updatedShowcased
      }
    };

    const manual = (player.manuals || []).find(m => m.id === manualId);
    commitPlayerState({ ...player, abodeState: updatedAbode });
    showToast(`📜 Đã trưng bày [${manual?.name || 'Bí Kíp'}] lên giá ngọc Tàng Kinh Các!`);
    addLog('Tàng Kinh Các', `Trưng bày bí kíp [${manual?.name || 'Bí Kíp'}] thu hút thiên hạ nhân tài quy phục.`, 'sect');
  };

  // 12. CHIÊU MỘ ĐỆ TỬ
  const handleRecruitDisciple = () => {
    const pavilion = abodeState.scripturePavilion;
    const disciples = pavilion.disciples || [];
    const maxDisciples = ABODE_LEVELS[abodeState.level]?.maxDisciples || 1;

    if (disciples.length >= maxDisciples) {
      showToast(`Động Phủ Cấp ${abodeState.level} chỉ có thể thu nhận tối đa ${maxDisciples} Đệ Tử! Hãy nâng cấp Động Phủ hoặc giải phóng đệ tử.`);
      return;
    }

    if (player.linhThach < DISCIPLE_RECRUIT_COST_LINH_THACH) {
      showToast(`Linh thạch không đủ! Cần ${DISCIPLE_RECRUIT_COST_LINH_THACH.toLocaleString()} Linh thạch để phát thiếp Tầm Đạo Thu Đồ.`);
      return;
    }

    // Điểm cộng phẩm cấp công pháp trưng bày
    const weightBonus = (pavilion.showcasedManualIds || []).length;
    const newDisciple = recruitNewDisciple(weightBonus);

    const updatedAbode: AbodeState = {
      ...abodeState,
      scripturePavilion: {
        ...pavilion,
        disciples: [...disciples, newDisciple]
      }
    };

    const updated = {
      ...player,
      linhThach: player.linhThach - DISCIPLE_RECRUIT_COST_LINH_THACH,
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    showToast(`🎉 Thu nhận đệ tử mới: [${newDisciple.name}] - Tư chất [${newDisciple.aptitude.toUpperCase()}]!`);
    addLog('Tầm Đạo Thu Đồ', `Thu nạp đệ tử [${newDisciple.name}] bái nhập môn hạ. Tư chất: [${newDisciple.aptitude.toUpperCase()}]. Chi phí 2,000 Linh thạch.`, 'sect');
  };

  // 13. TRỤC XUẤT ĐỆ TỬ
  const handleDismissDisciple = (discipleId: string) => {
    const pavilion = abodeState.scripturePavilion;
    const updatedDisciples = (pavilion.disciples || []).filter(d => d.id !== discipleId);

    const updatedAbode: AbodeState = {
      ...abodeState,
      scripturePavilion: {
        ...pavilion,
        disciples: updatedDisciples
      }
    };

    commitPlayerState({ ...player, abodeState: updatedAbode });
    showToast('Đã cho đệ tử hạ sơn xuất môn!');
  };

  // 14. THU BỔNG LỘC CỐNG NẠP CỦA ĐỆ TỬ
  const handleClaimDiscipleTribute = (discipleId: string) => {
    const pavilion = abodeState.scripturePavilion;
    const disciple = (pavilion.disciples || []).find(d => d.id === discipleId);
    if (!disciple) return;

    if (Date.now() < disciple.tributeReadyAt) {
      const remainHours = Math.ceil((disciple.tributeReadyAt - Date.now()) / (1000 * 60 * 60));
      showToast(`Đệ tử đang bế quan tham ngộ! Vui lòng quay lại sau ${remainHours} giờ.`);
      return;
    }

    const reward = claimDiscipleTribute(disciple);

    // Cập nhật thảo dược cống nạp
    const invHerbs = [...(player.inventory?.herbs || [])];
    const existingHerb = invHerbs.find(h => h.id === reward.herbId);
    if (existingHerb) {
      existingHerb.quantity = (existingHerb.quantity || 0) + reward.herbQuantity;
    } else {
      invHerbs.push({
        id: reward.herbId,
        name: reward.herbName,
        grade: 'Nhị Phẩm',
        description: 'Dược thảo đệ tử dâng hiến sư phụ.',
        price: 50,
        quantity: reward.herbQuantity,
        quality: 'thuong_pham'
      });
    }

    const now = Date.now();
    const updatedDisciples = pavilion.disciples.map(d => {
      if (d.id === discipleId) {
        return {
          ...d,
          lastClaimedAt: now,
          tributeReadyAt: now + DISCIPLE_TRIBUTE_INTERVAL_MS
        };
      }
      return d;
    });

    const updatedAbode: AbodeState = {
      ...abodeState,
      scripturePavilion: {
        ...pavilion,
        disciples: updatedDisciples
      }
    };

    const updated = {
      ...player,
      linhThach: player.linhThach + reward.linhThach,
      danhVong: (player.danhVong || 0) + reward.danhVong,
      inventory: {
        ...(player.inventory || {}),
        herbs: invHerbs,
        pills: player.inventory?.pills || [],
        ores: player.inventory?.ores || [],
        manuals: player.inventory?.manuals || [],
        equipments: player.inventory?.equipments || [],
        gems: player.inventory?.gems || [],
        books: player.inventory?.books || [],
        bags: player.inventory?.bags || []
      },
      abodeState: updatedAbode
    };

    commitPlayerState(updated);
    showToast(`🎁 Đệ tử [${disciple.name}] cống nạp: +${reward.linhThach.toLocaleString()} Linh thạch, +${reward.danhVong} Danh vọng & ${reward.herbQuantity}x [${reward.herbName}]!`);
    addLog('Bổng Lộc Đệ Tử', `Đệ tử [${disciple.name}] dâng lễ bái sư: +${reward.linhThach.toLocaleString()} Linh thạch, +${reward.danhVong} Danh vọng, ${reward.herbQuantity}x [${reward.herbName}].`, 'sect');
  };

  // 15. THU BỔNG LỘC TOÀN BỘ ĐỆ TỬ
  const handleClaimAllDiscipleTributes = () => {
    const readyDisciples = (abodeState.scripturePavilion?.disciples || []).filter(
      d => Date.now() >= d.tributeReadyAt
    );
    if (readyDisciples.length === 0) {
      showToast('Chưa có đệ tử nào chuẩn bị xong bổng lộc cống nạp!');
      return;
    }
    readyDisciples.forEach(d => handleClaimDiscipleTribute(d.id));
  };

  // 16. NOTIFICATION BADGE CHECKER
  const hasAbodeNotification = useMemo(() => {
    const hasReadyPlot = abodeState.plots?.some(p => p.unlocked && p.seedId && p.harvestAt && Date.now() >= p.harvestAt);
    const hasReadyTribute = abodeState.scripturePavilion?.disciples?.some(d => Date.now() >= d.tributeReadyAt);
    const hasFertilizerStored = (abodeState.beastSanctuary?.fertilizerStored || 0) > 0;
    return Boolean(hasReadyPlot || hasReadyTribute || hasFertilizerStored);
  }, [abodeState]);

  return {
    isAbodeModalOpen,
    setIsAbodeModalOpen,
    activeAbodeTab,
    setActiveAbodeTab,
    selectedPlotId,
    setSelectedPlotId,
    showSeedModal,
    setShowSeedModal,
    showSoilModal,
    setShowSoilModal,
    abodeState,
    hasAbodeNotification,

    // Actions
    handleUpgradeSpiritArray,
    handleUpgradeAbodeLevel,
    handleUnlockPlot,
    handleChangeSoilType,
    handlePlantSeed,
    handleHarvestPlot,
    handleHarvestAllPlots,
    handleFertilizePlot,
    handleAssignBeastToSanctuary,
    handleClaimFertilizer,
    handleShowcaseManual,
    handleRecruitDisciple,
    handleDismissDisciple,
    handleClaimDiscipleTribute,
    handleClaimAllDiscipleTributes
  };
}
