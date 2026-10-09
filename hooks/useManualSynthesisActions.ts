// hooks/useManualSynthesisActions.ts
// Custom Hook điều phối Hệ Thống Dung Hợp Công Pháp (Bàn Diễn Võ Vạn Pháp)

'use client';

import { useState, useCallback } from 'react';
import { PlayerStats, Manual, LogType } from '@/lib/types';
import { SynthesizedManualExtension, SynthesisCatalyst, SynthesisResult } from '@/lib/types/manual-synthesis';
import {
  canSynthesizeManuals,
  synthesizeManuals,
  findEligibleSynthesisPairs,
  calculateDisplayedMutationRate,
  SYNTHESIS_CATALYSTS,
  SYNTHESIS_TIER_CONFIG,
  MANUAL_GRADE_ORDER
} from '@/lib/manual-synthesis-logic';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

type SynthesisManual = Manual & SynthesizedManualExtension;

interface UseManualSynthesisActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  playSfx?: (sfx: string) => void;
}

export function useManualSynthesisActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx
}: UseManualSynthesisActionsParams) {
  // ─── State UI ───────────────────────────────────────────────────────────────
  const [slotA, setSlotA] = useState<SynthesisManual | null>(null);
  const [slotB, setSlotB] = useState<SynthesisManual | null>(null);
  const [selectedCatalyst, setSelectedCatalyst] = useState<SynthesisCatalyst | null>(null);
  const [lastResult, setLastResult] = useState<SynthesisResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSynthesisView, setShowSynthesisView] = useState(false);

  // ─── Computed Preview ───────────────────────────────────────────────────────
  const previewMutationRate = slotA
    ? calculateDisplayedMutationRate(slotA.grade, selectedCatalyst)
    : 20;

  const tierConfig = slotA
    ? (() => {
        const gradeOrder = MANUAL_GRADE_ORDER[slotA.grade] ?? 0;
        return SYNTHESIS_TIER_CONFIG[gradeOrder] ?? null;
      })()
    : null;

  const previewCost = tierConfig?.costLinhThach ?? 0;

  const eligibilityCheck = slotA && slotB
    ? canSynthesizeManuals(
        slotA, slotB,
        player.linhThach ?? 0,
        player.currentRealm ?? 0,
        player.equippedManuals ?? {},
        getCatalystCount(),
        selectedCatalyst
      )
    : null;

  function getCatalystCount(): number {
    if (!selectedCatalyst) return 0;
    const pills = player.inventory?.pills ?? [];
    const herbs = player.inventory?.herbs ?? [];
    const allItems = [...pills, ...herbs, ...(player.inventory?.manuals ?? [])];
    const found = allItems.find((i: any) => i.id === selectedCatalyst.itemId);
    return (found as any)?.quantity ?? 0;
  }

  // ─── 1. Gán Bí Kíp Vào Slot ─────────────────────────────────────────────────
  const handleSelectSlot = useCallback(
    (slot: 'A' | 'B', manual: SynthesisManual) => {
      // Anti-self: không cho chọn cùng 1 bí kíp
      if (slot === 'A') {
        if (slotB && slotB.id === manual.id) {
          showToast('⚠️ Bí kíp này đã được chọn ở Slot B! Không thể dung hợp với chính mình.');
          return;
        }
        setSlotA(manual);
      } else {
        if (slotA && slotA.id === manual.id) {
          showToast('⚠️ Bí kíp này đã được chọn ở Slot A! Không thể dung hợp với chính mình.');
          return;
        }
        setSlotB(manual);
      }
    },
    [slotA, slotB, showToast]
  );

  // ─── 2. Gỡ Bí Kíp Khỏi Slot ─────────────────────────────────────────────────
  const handleClearSlot = useCallback((slot: 'A' | 'B') => {
    if (slot === 'A') setSlotA(null);
    else setSlotB(null);
  }, []);

  // ─── 3. Chọn Đạo Cụ Xúc Tác ─────────────────────────────────────────────────
  const handleSelectCatalyst = useCallback((catalyst: SynthesisCatalyst | null) => {
    setSelectedCatalyst(catalyst);
  }, []);

  // ─── 4. Tự Động Ghép Cặp (Auto-Match QoL) ───────────────────────────────────
  const handleAutoMatch = useCallback(() => {
    const manuals = player.manuals ?? [];
    // Loại bỏ các bí kíp đang trang bị
    const equippedIds = Object.values(player.equippedManuals ?? {})
      .filter(Boolean)
      .map(v => (typeof v === 'string' ? v : (v as any)?.id));
    const available = manuals.filter(m => !equippedIds.includes(m.id));
    const pairs = findEligibleSynthesisPairs(available);

    if (pairs.length === 0) {
      showToast('🔍 Không tìm được cặp bí kíp nào hợp lệ trong kho! Cần 2 bí kíp cùng phân hệ và cùng giai bậc.');
      return;
    }

    const [bestA, bestB] = pairs[0];
    setSlotA(bestA as SynthesisManual);
    setSlotB(bestB as SynthesisManual);
    showToast(`✨ Đã tự động chọn: [${bestA.name}] + [${bestB.name}]`);
  }, [player.manuals, player.equippedManuals, showToast]);

  // ─── 5. Thực Thi Dung Hợp ───────────────────────────────────────────────────
  const handleExecuteSynthesis = useCallback(() => {
    if (!slotA || !slotB) {
      showToast('⚠️ Vui lòng đặt 2 bí kíp vào bàn dung hợp trước!');
      return;
    }

    const allManuals = player.manuals ?? [];
    const catalystCount = getCatalystCount();

    const result = synthesizeManuals(
      slotA, slotB,
      player.linhThach ?? 0,
      player.currentRealm ?? 0,
      player.equippedManuals ?? {},
      allManuals,
      selectedCatalyst,
      catalystCount
    );

    if (!result.success) {
      showToast(`❌ Dung hợp thất bại: ${result.reason}`);
      return;
    }

    // Cập nhật kho đồ và Linh Thạch
    let updatedPlayer: PlayerStats = {
      ...player,
      linhThach: result.updatedLinhThach ?? player.linhThach,
      manuals: result.updatedManualsInventory as Manual[]
    };

    // Trừ xúc tác khỏi kho (tìm trong pills/herbs/manuals)
    if (selectedCatalyst && result.synthesisResult?.costCatalystCount) {
      const deductCatalyst = (items: any[]) => {
        const idx = items.findIndex(i => i.id === selectedCatalyst.itemId);
        if (idx !== -1 && items[idx].quantity > 0) {
          const updated = [...items];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
          return updated;
        }
        return items;
      };

      if (updatedPlayer.inventory) {
        updatedPlayer = {
          ...updatedPlayer,
          inventory: {
            ...updatedPlayer.inventory,
            pills: deductCatalyst(updatedPlayer.inventory.pills ?? []),
            herbs: deductCatalyst(updatedPlayer.inventory.herbs ?? [])
          }
        };
      }
    }

    // Ghi nhật ký
    const sr = result.synthesisResult!;
    if (!Array.isArray((updatedPlayer as any).manualSynthesisLog)) {
      (updatedPlayer as any).manualSynthesisLog = [];
    }
    (updatedPlayer as any).manualSynthesisLog.push({
      timestamp: Date.now(),
      resultName: sr.synthesizedManual?.name,
      resultGrade: sr.synthesizedManual?.grade,
      mutationTriggered: sr.mutationTriggered,
      auraName: sr.aura?.name ?? null
    });

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    // Hiệu ứng âm thanh & thông báo
    if (sr.mutationTriggered) {
      playSfx?.('breakthrough');
    } else {
      playSfx?.('upgrade');
    }

    setLastResult(sr);
    setShowResultModal(true);

    if (addLog) {
      addLog(
        '⚡ Bàn Diễn Võ: Dung Hợp Công Pháp',
        sr.logMessage,
        'manual'
      );
    }

    // Dọn slot sau dung hợp thành công
    setSlotA(null);
    setSlotB(null);
    setSelectedCatalyst(null);
  }, [slotA, slotB, player, selectedCatalyst, setPlayer, addLog, showToast, playSfx]);

  // ─── 6. Đóng Modal Kết Quả ───────────────────────────────────────────────────
  const handleCloseResultModal = useCallback(() => {
    setShowResultModal(false);
    setLastResult(null);
  }, []);

  return {
    // State
    slotA,
    slotB,
    selectedCatalyst,
    lastResult,
    showResultModal,
    showSynthesisView,
    setShowSynthesisView,
    // Computed
    previewMutationRate,
    previewCost,
    eligibilityCheck,
    availableCatalysts: SYNTHESIS_CATALYSTS,
    catalystCount: getCatalystCount(),
    // Actions
    handleSelectSlot,
    handleClearSlot,
    handleSelectCatalyst,
    handleAutoMatch,
    handleExecuteSynthesis,
    handleCloseResultModal
  };
}
