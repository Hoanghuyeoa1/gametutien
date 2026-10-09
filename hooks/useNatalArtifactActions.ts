// hooks/useNatalArtifactActions.ts
// Custom hook quản lý toàn bộ tương tác giao diện và nghiệp vụ phân hệ Bản Mệnh Pháp Bảo & Khí Linh

import { useState } from 'react';
import { PlayerStats, LogType, Equipment } from '@/lib/types';
import { SpiritPersonality } from '@/lib/types/natal-artifact';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';
import {
  canBindEquipmentAsNatal,
  bindEquipmentAsNatal,
  unbindNatalArtifact,
  nourishSpiritWithEnergy,
  devourEquipment,
  devourOre,
  calculateNatalCombatBonus,
  canAscendNatalWithEssence,
  ascendNatalWithEssence
} from '@/lib/natal-artifact-logic';
import { NatalAscensionRequirement } from '@/lib/types/natal-artifact';
import { getRandomSpiritQuote } from '@/lib/natal-artifact-data';

interface UseNatalArtifactActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useNatalArtifactActions({
  player,
  setPlayer,
  addLog,
  showToast,
}: UseNatalArtifactActionsParams) {
  const [selectedPersonality, setSelectedPersonality] = useState<SpiritPersonality>('sat_phat');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeDialogQuote, setActiveDialogQuote] = useState<string | null>(null);

  const natal = player.natalArtifact || null;
  const spirit = natal?.spirit || null;
  const combatBonus = calculateNatalCombatBonus(player);
  const ascensionRequirement: NatalAscensionRequirement = canAscendNatalWithEssence(player);

  // 1. Tế Luyện Bản Mệnh (Natal Binding)
  const handleBindNatal = (equipmentId: string) => {
    if (isProcessing) return;

    // Tìm trang bị trong người hoặc trong túi đồ
    const allEquips: Equipment[] = [
      ...(player.equipment ? Object.values(player.equipment).filter(Boolean) as Equipment[] : []),
      ...(player.inventory?.equipments || [])
    ];
    const targetEquip = allEquips.find(e => e.id === equipmentId);

    if (!targetEquip) {
      showToast('❌ Không tìm thấy trang bị mục tiêu!');
      return;
    }

    const check = canBindEquipmentAsNatal(player, targetEquip);
    if (!check.canBind) {
      showToast(`❌ ${check.reason}`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const { success, updatedPlayer, message } = bindEquipmentAsNatal(player, targetEquip, selectedPersonality);
      if (success) {
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        addLog('🗡️ TẾ LUYỆN BẢN MỆNH THÀNH CÔNG', message, 'success');
        showToast('✨ Bản Mệnh Pháp Bảo đã tế luyện thành công! Khí Linh đã thức tỉnh!');
        if (updatedPlayer.natalArtifact?.spirit) {
          setActiveDialogQuote(updatedPlayer.natalArtifact.spirit.dialogueHistory[0] || null);
        }
      } else {
        showToast(`❌ ${message}`);
      }
      setIsProcessing(false);
    }, 700);
  };

  // 2. Hủy Bỏ Khế Ước Bản Mệnh (Unbind)
  const handleUnbindNatal = () => {
    if (isProcessing || !player.natalArtifact) return;

    setIsProcessing(true);
    setTimeout(() => {
      const { success, updatedPlayer, message } = unbindNatalArtifact(player);
      if (success) {
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        addLog('⚡ HỦY BỎ KHẾ ƯỚC BẢN MỆNH', message, 'warning');
        showToast('⚡ Đã hủy bỏ khế ước Bản Mệnh. Chịu phản phệ tâm mạch nhẹ!');
        setActiveDialogQuote(null);
      } else {
        showToast(`❌ ${message}`);
      }
      setIsProcessing(false);
    }, 600);
  };

  // 3. Ôn Dưỡng Khí Tức Hàng Ngày (Nourish Spirit With Energy)
  const handleNourishWithEnergy = () => {
    if (isProcessing) return;

    const { success, updatedPlayer, message, stageUp } = nourishSpiritWithEnergy(player);
    if (!success) {
      showToast(`❌ ${message}`);
      return;
    }

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    if (stageUp) {
      addLog('🌟 KHÍ LINH ĐỘT PHÁ CẢNH GIỚI', message, 'success');
      showToast('🌟 Chúc mừng! Khí Linh đã đột phá lên tầng linh trí mới!');
    } else {
      addLog('🧘 ÔN DƯỠNG BẢN MỆNH', message, 'info');
      showToast('🧘 Đã rót Chân Nguyên ôn dưỡng Khí Linh (+EXP & Hảo Cảm)!');
    }

    if (updatedPlayer.natalArtifact?.spirit) {
      setActiveDialogQuote(updatedPlayer.natalArtifact.spirit.dialogueHistory[0] || null);
    }
  };

  // 4. Thôn Phệ Trang Bị Dư Thừa (Devour Equipment)
  const handleDevourEquipment = (equipmentId: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setTimeout(() => {
      const { success, updatedPlayer, message, stageUp } = devourEquipment(player, equipmentId);
      if (success) {
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        if (stageUp) {
          addLog('🌟 KHÍ LINH ĐỘT PHÁ CẢNH GIỚI', message, 'success');
          showToast('🌟 Khí Linh thôn phệ tinh hoa, đột phá lên tầng linh trí mới!');
        } else {
          addLog('🌀 THÔN PHỆ TRANG BỊ', message, 'info');
          showToast('🌀 Khí Linh đã nuốt trọn trang bị và hấp thu linh tính!');
        }

        if (updatedPlayer.natalArtifact?.spirit) {
          setActiveDialogQuote(updatedPlayer.natalArtifact.spirit.dialogueHistory[0] || null);
        }
      } else {
        showToast(`❌ ${message}`);
      }
      setIsProcessing(false);
    }, 500);
  };

  // 5. Thôn Phệ Khoáng Thạch Quý (Devour Ore)
  const handleDevourOre = (oreId: string, count: number = 1) => {
    if (isProcessing) return;

    const { success, updatedPlayer, message, stageUp } = devourOre(player, oreId, count);
    if (!success) {
      showToast(`❌ ${message}`);
      return;
    }

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    if (stageUp) {
      addLog('🌟 KHÍ LINH ĐỘT PHÁ CẢNH GIỚI', message, 'success');
      showToast('🌟 Khí Linh đã đột phá lên tầng linh trí mới!');
    } else {
      addLog('🌀 THÔN PHỆ KHOÁNG THẠCH', message, 'info');
      showToast(`🌀 Khí Linh đã hấp thu tinh hoa khoáng thạch!`);
    }

    if (updatedPlayer.natalArtifact?.spirit) {
      setActiveDialogQuote(updatedPlayer.natalArtifact.spirit.dialogueHistory[0] || null);
    }
  };

  // 6. Tương Tác Cảm Xúc Với Khí Linh (Bấm vào Khí Linh để lắng nghe tâm sự)
  const handleInteractWithSpirit = () => {
    if (!spirit) return;
    const quote = getRandomSpiritQuote(spirit.personality, spirit.intimacy);
    setActiveDialogQuote(quote);
    showToast(`💭 "${quote}"`);
  };

  // 7. Thăng Giai Bản Mệnh Bằng Tinh Hoa Rèn Đúc (Essence Ascension)
  const handleAscendNatalWithEssence = () => {
    if (isProcessing || !player.natalArtifact) return;

    const check = canAscendNatalWithEssence(player);
    if (!check.canAscend) {
      showToast(`❌ ${check.reason || 'Chưa đủ điều kiện thăng giai!'}`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const { success, updatedPlayer, message, stageUp } = ascendNatalWithEssence(player);
      if (success) {
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

        addLog('⚡ THĂNG GIAI BẢN MỆNH THÀNH CÔNG', message, 'success');
        showToast(`✨ Bản Mệnh Pháp Bảo đã thăng giai lên 【${check.nextConfig?.tierName}】!`);

        if (stageUp) {
          showToast('🌟 Linh tính bùng nổ! Khí Linh đồng thời đột phá cảnh giới!');
        }

        if (updatedPlayer.natalArtifact?.spirit) {
          setActiveDialogQuote(updatedPlayer.natalArtifact.spirit.dialogueHistory[0] || null);
        }
      } else {
        showToast(`❌ ${message}`);
      }
      setIsProcessing(false);
    }, 600);
  };

  return {
    natal,
    spirit,
    combatBonus,
    ascensionRequirement,
    selectedPersonality,
    setSelectedPersonality,
    isProcessing,
    activeDialogQuote,
    handleBindNatal,
    handleUnbindNatal,
    handleNourishWithEnergy,
    handleDevourEquipment,
    handleDevourOre,
    handleInteractWithSpirit,
    handleAscendNatalWithEssence,
  };
}
