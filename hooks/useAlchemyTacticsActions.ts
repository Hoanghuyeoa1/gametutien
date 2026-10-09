// hooks/useAlchemyTacticsActions.ts
// Custom Hook điều phối tính năng: Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ
// (Tactical Heat Stances & Herbal Archetype Matrix)

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats } from '@/lib/types';
import {
  HerbRoleType,
  TacticalHeatStance,
  ConcoctionSetup,
  ConcoctionPreviewResult,
  TacticalAlchemyExecutionResult
} from '@/lib/types/alchemy-tactics';
import {
  previewConcoction,
  executeTacticalConcoction,
  createDefaultConcoctionSetup,
  getHerbRoleMetadata
} from '@/lib/alchemy-tactics-logic';
import { HEAVENLY_FLAMES_REGISTRY, DEFAULT_MORTAL_FLAME } from '@/lib/heavenly-flame-logic';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface UseAlchemyTacticsActionsProps {
  player: PlayerStats;
  setPlayer: (player: PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'alchemy' | 'system' | 'danger') => void;
  onHarvestSuccess?: (result: any) => void;
  onTribulationTrigger?: (encounter: any, basePill: any) => void;
}

export function useAlchemyTacticsActions({
  player,
  setPlayer,
  showToast,
  addLog,
  onHarvestSuccess,
  onTribulationTrigger
}: UseAlchemyTacticsActionsProps) {
  // Setup cấu hình 4 slot Quân - Thần - Tá - Sứ & Hỏa Hầu
  const [concoctionSetup, setConcoctionSetup] = useState<ConcoctionSetup>(() => {
    const defaultStance = player.alchemyTacticsState?.defaultStance || 'van_vu_song_hanh';
    return {
      ...createDefaultConcoctionSetup(),
      stance: defaultStance
    };
  });

  const [isCraftingAnimation, setIsCraftingAnimation] = useState<boolean>(false);
  const [tacticalHarvestResult, setTacticalHarvestResult] = useState<TacticalAlchemyExecutionResult | null>(null);

  // Cấu hình Dị Hỏa đang khảm vào đan lò
  const equippedFlameConfig = useMemo(() => {
    if (!player.flameState?.equippedFlameId) return DEFAULT_MORTAL_FLAME;
    return HEAVENLY_FLAMES_REGISTRY[player.flameState.equippedFlameId] || DEFAULT_MORTAL_FLAME;
  }, [player.flameState?.equippedFlameId]);

  // Live Preview kết quả dự toán thiên cơ (Zero-latency recalculation)
  const previewResult = useMemo<ConcoctionPreviewResult>(() => {
    return previewConcoction(player, concoctionSetup, equippedFlameConfig);
  }, [player, concoctionSetup, equippedFlameConfig]);

  // Gán hoặc gỡ thảo dược vào slot tương ứng
  const handleSelectHerbForRole = useCallback(
    (role: HerbRoleType, herbItemId: string | null) => {
      setConcoctionSetup(prev => {
        if (!herbItemId) {
          if (role === 'quan') {
            return {
              ...prev,
              quan: { herbItemId: null, role: 'quan', count: 0 }
            };
          }
          return {
            ...prev,
            [role]: null
          };
        }

        const herbMeta = getHerbRoleMetadata(herbItemId);
        const herbInInv = (player.inventory?.herbs || []).find(h => h.id === herbItemId);
        const herbName = herbMeta?.name || herbInInv?.name || herbItemId;

        const defaultCounts: Record<HerbRoleType, number> = {
          quan: 2,
          than: 1,
          ta: 1,
          su: 1
        };

        const newSlot = {
          herbItemId,
          herbName,
          role,
          count: defaultCounts[role]
        };

        return {
          ...prev,
          [role]: newSlot
        };
      });
    },
    [player.inventory?.herbs]
  );

  // Chuyển đổi chiến lược Hỏa Hầu
  const handleChangeStance = useCallback(
    (stance: TacticalHeatStance) => {
      setConcoctionSetup(prev => {
        // Nếu chuyển từ Vũ Hỏa sang Văn Hỏa hoặc Văn Vũ, reset batch về 1
        const newBatch = stance === 'vu_hoa' ? prev.batchMultiplier : 1;
        return {
          ...prev,
          stance,
          batchMultiplier: newBatch
        };
      });

      audioEngine.playSFX('alchemy');
      const stanceNames: Record<TacticalHeatStance, string> = {
        van_hoa: 'Văn Hỏa (Lửa Nhỏ Ôn Dưỡng)',
        vu_hoa: 'Vũ Hỏa (Lửa Lớn Cấp Tốc)',
        van_vu_song_hanh: 'Văn Vũ Tương Tế (Chu Thiên Cân Bằng)'
      };
      showToast?.(`🔥 Đã chuyển sang thế [${stanceNames[stance]}]!`);
    },
    [showToast]
  );

  // Điều chỉnh số lượng Batch (1, 5, 10 khi ở thế Vũ Hỏa)
  const handleChangeBatchMultiplier = useCallback(
    (batch: number) => {
      if (concoctionSetup.stance !== 'vu_hoa' && batch > 1) {
        showToast?.('⚠️ Chỉ có thế Vũ Hỏa mới có thể kích hoạt Luyện Hàng Loạt (Batch Craft)!');
        return;
      }
      setConcoctionSetup(prev => ({
        ...prev,
        batchMultiplier: Math.max(1, Math.min(10, batch))
      }));
    },
    [concoctionSetup.stance, showToast]
  );

  // Thực thi mẻ nung đan chiến thuật
  const handleExecuteConcoction = useCallback(() => {
    if (!previewResult.canCraft) {
      showToast?.(`⚠️ ${previewResult.errorMessage || 'Không thể bắt đầu mẻ nung'}`);
      return;
    }

    setIsCraftingAnimation(true);
    audioEngine.playAlchemyFurnaceSound(1.2);

    setTimeout(() => {
      setIsCraftingAnimation(false);

      const result = executeTacticalConcoction(player, concoctionSetup, {
        crafterRealmIndex: player.currentRealm,
        alchemySkillLevel: player.alchemyArtisan?.level
      });

      if (!result.success) {
        showToast?.(`⚠️ ${result.message}`);
        return;
      }

      if (result.updatedPlayer) {
        const normalized = normalizePlayerData(result.updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      }

      setTacticalHarvestResult(result);

      if (result.tribulationTriggered && result.tribulationEncounter && onTribulationTrigger) {
        showToast?.('⚡ THIÊN KIẾP GIÁNG LÂM! Đan lôi kiếp đang bao trùm đỉnh lò!');
        addLog?.('Đan Lôi Kiếp', result.message, 'danger');
        onTribulationTrigger(result.tribulationEncounter, {
          id: `${result.basePillId}_${Date.now()}`,
          name: result.basePillName,
          grade: result.veinTierRolled >= 9 ? 'Thần Giai' : result.veinTierRolled >= 6 ? 'Thượng Giai' : 'Tam Giai',
          description: `Đan dược chiến thuật phối ngũ: Quân [${concoctionSetup.quan.herbName}], Hỏa Hầu [${concoctionSetup.stance}].`,
          effectValue: result.effectivePotency,
          price: 150 * (result.veinTierRolled + 1),
          quantity: concoctionSetup.batchMultiplier,
          veinMetadata: {
            veinCount: result.veinTierRolled,
            veinMultiplier: 1.0,
            toxicityMultiplier: 1.0,
            mutation: result.mutationRolled
          }
        });
        return;
      }

      if (result.isExploded) {
        audioEngine.playSFX('danger');
        showToast?.('💥 NỔ LÒ! Hỏa hầu mất kiểm soát, Tá Dược đã bảo lưu 50% nguyên liệu!');
        addLog?.('Nổ Lò Chiến Thuật', result.message, 'danger');
      } else {
        audioEngine.playSFX('alchemy');
        showToast?.(`🎉 ${result.message}`);
        addLog?.('Luyện Đan Tứ Trụ', result.message, 'alchemy');
      }

      if (onHarvestSuccess) {
        // Tương thích với PillHarvestModal
        onHarvestSuccess({
          basePillId: result.basePillId,
          basePillName: result.basePillName,
          veinCount: result.veinTierRolled,
          finalYieldCount: result.pillsCraftedCount,
          veinMetadata: {
            veinCount: result.veinTierRolled,
            veinMultiplier: 1.0,
            toxicityMultiplier: 1.0,
            toxicityBurnPercent: previewResult.predictedToxicityReductionPercent,
            flameId: equippedFlameConfig.id,
            mutation: result.mutationRolled
          },
          isExploded: result.isExploded,
          logMessages: result.logs
        });
      }
    }, 600);
  }, [
    previewResult,
    player,
    concoctionSetup,
    setPlayer,
    showToast,
    addLog,
    onHarvestSuccess,
    equippedFlameConfig.id
  ]);

  return {
    concoctionSetup,
    previewResult,
    isCraftingAnimation,
    tacticalHarvestResult,
    equippedFlameConfig,
    handleSelectHerbForRole,
    handleChangeStance,
    handleChangeBatchMultiplier,
    handleExecuteConcoction
  };
}
