// hooks/usePillVeinAlchemyActions.ts
// Custom Hook điều phối tính năng: Phân Tầng Đan Văn Cửu Trọng & Dược Tính Biến Dị

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats, DanRecipe, Pill } from '@/lib/types';
import {
  PillVeinTier,
  CatalystItemConfig,
  PillCraftingResult,
  VeinedPillMetadata
} from '@/lib/types/pill-veins';
import {
  CATALYST_REGISTRY,
  PILL_VEIN_CONFIG,
  getVeinProbabilities,
  executeVeinedAlchemyCraft,
  consumeVeinedPill,
  VeinProbabilities
} from '@/lib/pill-vein-logic';
import { HEAVENLY_FLAMES_REGISTRY } from '@/lib/heavenly-flame-logic';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface UsePillVeinAlchemyActionsProps {
  player: PlayerStats;
  setPlayer: (player: PlayerStats) => void;
  showToast: (msg: string) => void;
  addLog: (title: string, msg: string, type: 'alchemy' | 'system' | 'danger') => void;
}

export function usePillVeinAlchemyActions({
  player,
  setPlayer,
  showToast,
  addLog
}: UsePillVeinAlchemyActionsProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [selectedCatalystId, setSelectedCatalystId] = useState<string | null>(null);
  const [harvestResult, setHarvestResult] = useState<PillCraftingResult | null>(null);
  const [isCraftingAnimation, setIsCraftingAnimation] = useState<boolean>(false);

  // Danh sách các phụ liệu xúc tác mà người chơi đang sở hữu trong túi đồ
  const availableCatalysts = useMemo(() => {
    const inv = player.inventory || { pills: [], herbs: [], ores: [] };
    const list: { id: string; name: string; quantity: number; config: CatalystItemConfig }[] = [];

    for (const [catId, conf] of Object.entries(CATALYST_REGISTRY)) {
      // Tìm số lượng trong ores hoặc herbs
      const oreCount = inv.ores?.find(o => o.id === catId)?.quantity || 0;
      const herbCount = inv.herbs?.find(h => h.id === catId)?.quantity || 0;
      const totalOwned = oreCount + herbCount;

      if (totalOwned > 0) {
        list.push({
          id: catId,
          name: conf.name,
          quantity: totalOwned,
          config: conf
        });
      }
    }

    return list;
  }, [player.inventory]);

  // Dự toán thiên cơ: Tỷ lệ xuất hiện từng bậc Đan Văn & Dị Biến (tính cả Dị Hỏa đang trang bị)
  const previewChances = useMemo<VeinProbabilities>(() => {
    const crafterRealm = player.currentRealm || 0;
    const alchemyLevel = player.alchemyArtisan?.level || 1;
    const catalystConf = selectedCatalystId ? CATALYST_REGISTRY[selectedCatalystId] : null;
    const catalystBonus = catalystConf?.veinQualityBonus || 0;

    const equippedFlameId = player.flameState?.equippedFlameId;
    const flameConf = equippedFlameId ? HEAVENLY_FLAMES_REGISTRY[equippedFlameId] : null;
    const flameBonus = flameConf?.baseVeinQualityBonus || 0;

    return getVeinProbabilities(crafterRealm, alchemyLevel, 1, catalystBonus + flameBonus);
  }, [player.currentRealm, player.alchemyArtisan?.level, selectedCatalystId, player.flameState?.equippedFlameId]);

  // Thực thi luyện đan có đan văn và phụ liệu biến dị
  const handleCraftPillWithVeins = useCallback(
    (recipe: DanRecipe, customCatalystId?: string | null) => {
      const activeCatalystId = customCatalystId !== undefined ? customCatalystId : selectedCatalystId;

      setIsCraftingAnimation(true);
      audioEngine.playAlchemyFurnaceSound(1.0);

      // Timeout nhẹ 600ms tạo cảm giác nung lò cổ phong
      setTimeout(() => {
        setIsCraftingAnimation(false);

        const craftOutcome = executeVeinedAlchemyCraft(
          recipe,
          player,
          activeCatalystId,
          {
            crafterRealmIndex: player.currentRealm,
            alchemySkillLevel: player.alchemyArtisan?.level
          }
        );

        if (!craftOutcome.success) {
          showToast(`⚠️ Luyện đan thất bại: ${craftOutcome.message}`);
          return;
        }

        const normalized = normalizePlayerData(craftOutcome.updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        if (craftOutcome.craftingResult) {
          setHarvestResult(craftOutcome.craftingResult);

          if (craftOutcome.craftingResult.isExploded) {
            audioEngine.playSFX('danger');
            showToast(`💥 NỔ LÒ! Dị Hỏa bạo liệt khiến mẻ đan biến thành Phế Đan! Hoàn trả 50% nguyên liệu.`);
            addLog(
              'Dị Hỏa Nổ Lò',
              craftOutcome.message,
              'danger'
            );
          } else {
            audioEngine.playSFX('alchemy');
            showToast(`🎉 Luyện thành công [${craftOutcome.craftingResult.basePillName}] (${craftOutcome.craftingResult.veinCount} Đan Văn)!`);
            addLog(
              'Luyện Đan Đan Văn',
              craftOutcome.message,
              'alchemy'
            );
          }
        }
      }, 500);
    },
    [player, selectedCatalystId, setPlayer, showToast, addLog]
  );

  // Phục dụng đan dược có đan văn và biến dị
  const handleConsumeVeinedPillAction = useCallback(
    (pill: Pill) => {
      const result = consumeVeinedPill(player, pill);
      if (!result.success) {
        showToast(result.message);
        return;
      }

      audioEngine.playSFX('alchemy');
      const normalized = normalizePlayerData(result.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      showToast(result.message);
      addLog('Phục Dược Đan Văn', result.message, result.logType);
    },
    [player, setPlayer, showToast, addLog]
  );

  return {
    selectedRecipeId,
    setSelectedRecipeId,
    selectedCatalystId,
    setSelectedCatalystId,
    harvestResult,
    setHarvestResult,
    isCraftingAnimation,
    previewChances,
    availableCatalysts,
    handleCraftPillWithVeins,
    handleConsumeVeinedPillAction
  };
}
