// hooks/useTalismanActions.ts
// Custom hook quản lý toàn bộ tương tác giao diện và nghiệp vụ Phù Lục Các

import { useState } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import { TalismanItem, TalismanBeltSlot } from '@/lib/types/talisman';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';
import {
  craftTalisman,
  equipTalismanToBelt,
  unequipTalismanFromBelt,
  useUtilityTalisman,
} from '@/lib/talisman-logic';
import {
  createDefaultTalismanArtisan,
  createDefaultTalismanBelt,
} from '@/lib/talisman-data';

interface UseTalismanActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useTalismanActions({
  player,
  setPlayer,
  addLog,
  showToast,
}: UseTalismanActionsParams) {
  const [talismanSubTab, setTalismanSubTab] = useState<'crafting' | 'belt' | 'inventory'>('crafting');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>('recipe_giap_binh_phu');
  const [craftCount, setCraftCount] = useState<number>(1);
  const [isCrafting, setIsCrafting] = useState<boolean>(false);

  const artisan = player.talismanArtisan || createDefaultTalismanArtisan();
  const talismanInventory: TalismanItem[] = Array.isArray(player.inventory?.talismans)
    ? player.inventory.talismans
    : [];
  const equippedBelt: TalismanBeltSlot[] = Array.isArray(player.equippedTalismans) && player.equippedTalismans.length >= 3
    ? player.equippedTalismans
    : createDefaultTalismanBelt();

  // ── Họa Phù (Chấp Bút Điểm Chu Sa) ─────────────────────────
  const handleCraftTalisman = (recipeId?: string, countOverride?: number) => {
    const targetRecipeId = recipeId || selectedRecipeId;
    if (!targetRecipeId || isCrafting) return;

    const count = countOverride || craftCount || 1;
    setIsCrafting(true);

    setTimeout(() => {
      const { result, updatedPlayer } = craftTalisman(player, targetRecipeId, count);
      const normalized = normalizePlayerData(updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      addLog(result.logTitle, result.logContent, result.success ? 'success' : 'info');
      showToast(result.toastMsg);
      setIsCrafting(false);
    }, 600);
  };

  // ── Trang Bị Bùa Vào Phù Nang (0, 1, 2) ───────────────────
  const handleEquipTalisman = (slotIndex: number, talismanId: string) => {
    const { success, updatedPlayer, message } = equipTalismanToBelt(player, slotIndex, talismanId);
    if (!success) {
      showToast(`❌ ${message}`);
      return;
    }

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    const item = talismanInventory.find(t => t.id === talismanId);
    addLog(
      '🎒 PHÙ NANG XUẤT CHIẾN',
      `Đã trang bị 【${item?.name || 'Linh Phù'}】 vào ô Phù Nang ${slotIndex + 1}. Bùa sẽ tự động kích hoạt khi lâm trận!`,
      'success'
    );
    showToast(`✅ ${message}`);
  };

  // ── Tháo Bùa Khỏi Phù Nang ───────────────────────────────
  const handleUnequipTalisman = (slotIndex: number) => {
    const { success, updatedPlayer, message } = unequipTalismanFromBelt(player, slotIndex);
    if (!success) return;

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    addLog('🔓 THÁO BÙA KHỎI PHÙ NANG', message, 'info');
    showToast(`🔓 ${message}`);
  };

  // ── Sử Dụng Phù Lục Phụ Trợ (Tàng Phù Hòm) ────────────────
  const handleUseUtilityTalisman = (talismanId: string) => {
    const { success, updatedPlayer, message, logText } = useUtilityTalisman(player, talismanId);
    if (!success) {
      showToast(`❌ ${message}`);
      return;
    }

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    addLog('📜 SỬ DỤNG LINH PHÙ', logText, 'success');
    showToast(`✨ ${message}`);
  };

  // Thông báo chấm đỏ nếu có ô phù nang trống mà trong túi có bùa chiến đấu
  const hasCombatTalismans = talismanInventory.some(t => t.type === 'combat' && t.quantity > 0);
  const hasEmptyBeltSlot = equippedBelt.some(s => !s.talismanId);
  const hasTalismanNotification = hasCombatTalismans && hasEmptyBeltSlot;

  return {
    talismanSubTab,
    setTalismanSubTab,
    selectedRecipeId,
    setSelectedRecipeId,
    craftCount,
    setCraftCount,
    isCrafting,
    artisan,
    talismanInventory,
    equippedBelt,
    hasTalismanNotification,
    handleCraftTalisman,
    handleEquipTalisman,
    handleUnequipTalisman,
    handleUseUtilityTalisman,
  };
}
