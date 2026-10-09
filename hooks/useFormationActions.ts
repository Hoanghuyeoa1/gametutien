// hooks/useFormationActions.ts
// Custom hook quản lý toàn bộ tương tác Trận Pháp Các
import { useState } from 'react';
import { PlayerStats, LogType, FormationItem } from '@/lib/types';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';
import {
  craftFormationItem,
  dismantleFormation,
  FORMATION_QUALITY_CONFIG,
  FormationQuality,
  reforgeArrayDisc,
  canReforgeArrayDisc,
  ARRAY_REFORGE_CONFIG,
} from '@/lib/formation-logic';
import {
  createDefaultFormationArtisan,
  FORMATION_ARTISAN_RANKS,
} from '@/lib/formation-data';
import { checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';
import { ArrayReforgeType } from '@/lib/types/formation';

export type FormationSubTab = 'crafting' | 'active' | 'inventory' | 'reforge';

interface UseFormationActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useFormationActions({
  player,
  setPlayer,
  addLog,
  showToast,
}: UseFormationActionsParams) {
  const [formationSubTab, setFormationSubTab] = useState<FormationSubTab>('crafting');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [isReforging, setIsReforging] = useState(false);
  const [selectedReforgeTargetId, setSelectedReforgeTargetId] = useState<string | null>(null);
  const [selectedReforgeType, setSelectedReforgeType] = useState<ArrayReforgeType>('permanence');

  const artisan = player.formationArtisan || createDefaultFormationArtisan();

  // ── Trùng Chú Trận Bàn Cửu Giai (Array Reforging) ───────────
  const handleReforgeArray = (targetId: string, reforgeType: ArrayReforgeType) => {
    if (isReforging) return;
    setIsReforging(true);

    setTimeout(() => {
      const { success, updatedPlayer, message } = reforgeArrayDisc(player, targetId, reforgeType);
      if (success) {
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        const title = reforgeType === 'permanence'
          ? '🌀 THĂNG HOA BẤT HỦ THÀNH CÔNG!'
          : '⚡ TỘT ĐỈNH HẤP THU THÀNH CÔNG!';
        addLog(title, message, 'success');
        showToast(message);
      } else {
        addLog('💨 TRÙNG CHÚ THẤT BẠI', message, 'info');
        showToast(message);
      }
      setIsReforging(false);
    }, 600);
  };

  // ── Khắc Chế Trận Bàn ─────────────────────────────────────
  const handleCraftFormation = (recipeId: string) => {
    if (isCrafting) return;
    setIsCrafting(true);

    setTimeout(() => {
      const { result, updatedPlayer } = craftFormationItem(player, recipeId);
      const normalized = normalizePlayerData(updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      addLog(result.logTitle, result.logContent, result.success ? 'success' : 'info');
      showToast(result.toastMsg);

      setIsCrafting(false);
    }, 600);
  };

  // ── Trang Bị Trận Bàn ─────────────────────────────────────
  const handleEquipFormation = (formationId: string) => {
    const formations: FormationItem[] = player.inventory?.formations || [];
    const target = formations.find((f: FormationItem) => f.id === formationId);
    if (!target) return;

    const updatedPlayer: PlayerStats = {
      ...player,
      equippedFormation: target,
    };
    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    const qLabel = FORMATION_QUALITY_CONFIG[target.quality as FormationQuality]?.label || target.quality;
    addLog(
      `⚔️ TRANG BỊ TRẬN BÀN BẢN MỆNH`,
      `[${qLabel}] [${target.name}] đã được trang bị vào khe Xuất Chiến Bản Mệnh. Trận pháp sẽ kích hoạt trong mỗi chiến đấu!`,
      'success'
    );
    showToast(`✅ Trang bị [${target.name}]!`);
  };

  // ── Tháo Trận Bàn ─────────────────────────────────────────
  const handleUnequipFormation = () => {
    if (!player.equippedFormation) return;
    const name = player.equippedFormation.name;
    const updatedPlayer: PlayerStats = { ...player, equippedFormation: null };
    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    addLog('🔓 THÁO TRẬN BÀN', `[${name}] đã được thu về túi đồ.`, 'info');
    showToast(`🔓 Đã tháo [${name}]`);
  };

  // ── Phân Giải Trận Bàn ────────────────────────────────────
  const handleDismantleFormation = (formationId: string) => {
    const formations: FormationItem[] = player.inventory?.formations || [];
    const formation = formations.find((f: FormationItem) => f.id === formationId);
    const { updatedPlayer, recoveredOres } = dismantleFormation(player, formationId);
    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    const oreList = recoveredOres.map(o => `${o.name} x${o.quantity}`).join(', ');
    addLog(
      `♻️ PHÂN GIẢI TRẬN BÀN`,
      `[${formation?.name || '???'}] bị phân giải. Thu hồi: ${oreList || 'không có nguyên liệu'}.`,
      'info'
    );
    showToast(`♻️ Đã phân giải trận bàn.`);
  };

  // ── Thông tin hiển thị ────────────────────────────────────
  const currentRank = FORMATION_ARTISAN_RANKS.find(r => r.level === artisan.level) || FORMATION_ARTISAN_RANKS[0];
  const formationInventory: FormationItem[] = player.inventory?.formations || [];
  const promoCheck = checkArtisanPromotionRequirement(player.currentRealm || 0, artisan.level);
  const hasFormationNotification = Boolean(artisan.exp >= artisan.maxExp && artisan.level < 9 && promoCheck.canPromote);

  return {
    formationSubTab,
    setFormationSubTab,
    selectedRecipeId,
    setSelectedRecipeId,
    isCrafting,
    handleCraftFormation,
    handleEquipFormation,
    handleUnequipFormation,
    handleDismantleFormation,
    isReforging,
    selectedReforgeTargetId,
    setSelectedReforgeTargetId,
    selectedReforgeType,
    setSelectedReforgeType,
    handleReforgeArray,
    artisan,
    currentRank,
    formationInventory,
    hasFormationNotification,
  };
}
