// hooks/useReincarnationActions.ts
// Custom Domain Hook điều phối quy trình Binh Giải / Tọa Hóa / Lục Đạo Luân Hồi (Roguelite Meta-Progression)

import { useState, useMemo } from 'react';
import { PlayerStats, LinhCan } from '@/lib/types';
import {
  calculateKarmaReward,
  canBinhGiai,
  executeReincarnation,
  executeInheritDiscipleReincarnation,
  REINCARNATION_PERKS_CATALOG,
  SPIRITUAL_ROOT_UPGRADES,
  upgradeSpiritualRoot,
  getNextSpiritualRootUpgrade,
  KarmaRewardBreakdown
} from '@/lib/reincarnation-logic';
import { createNewPlayer } from '@/lib/game-logic/character';
import { saveGameData, STORAGE_KEY } from '@/lib/save-migration';
import { saveToSlot } from '@/lib/save-encryption';

export interface UseReincarnationActionsProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type?: any) => void;
  showToast?: (message: string) => void;
  playSfx?: (soundName: any) => void;
}

export function useReincarnationActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx
}: UseReincarnationActionsProps) {
  const [isRebornModalOpen, setIsRebornModalOpen] = useState<boolean>(false);
  const [rebornScreen, setRebornScreen] = useState<'summary' | 'inheritance'>('summary');
  const [isBinhGiaiMode, setIsBinhGiaiMode] = useState<boolean>(false);

  // Temporary choices made inside the modal before finalizing rebirth
  const [selectedPerks, setSelectedPerks] = useState<Record<string, number>>({});
  const [selectedLinhCan, setSelectedLinhCan] = useState<LinhCan | null>(null);
  const [selectedInheritedDestinyId, setSelectedInheritedDestinyId] = useState<string | null>(null);
  const [keepSealedNatal, setKeepSealedNatal] = useState<boolean>(true);
  const [karmaSpentInModal, setKarmaSpentInModal] = useState<number>(0);

  // Tính toán Karma nhận được từ kiếp hiện tại
  const karmaReward: KarmaRewardBreakdown = useMemo(() => {
    return calculateKarmaReward(player, isBinhGiaiMode);
  }, [player, isBinhGiaiMode]);

  // Tổng Karma khả dụng để tiêu trong modal
  const initialAvailableKarma = (player.reincarnationState?.currentKarmaPoints || 0) + karmaReward.totalKarma;
  const currentAvailableKarma = Math.max(0, initialAvailableKarma - karmaSpentInModal);

  // Mở modal Luân Hồi
  const openRebornModal = (isBinhGiai: boolean = false) => {
    setIsBinhGiaiMode(isBinhGiai);
    setRebornScreen('summary');
    setSelectedPerks({});
    setSelectedLinhCan(null);
    setSelectedInheritedDestinyId(null);
    setKeepSealedNatal(Boolean(player.natalArtifact));
    setKarmaSpentInModal(0);
    setIsRebornModalOpen(true);
  };

  const closeRebornModal = () => {
    setIsRebornModalOpen(false);
  };

  // Kích hoạt Binh Giải chủ động khi đủ cảnh giới (Kim Đan Kỳ trở lên)
  const handleTriggerBinhGiai = () => {
    const realmIdx = player.currentRealm || 0;
    if (!canBinhGiai(realmIdx)) {
      showToast?.('Chỉ có tu sĩ từ Kim Đan Kỳ (Tầng 16) trở lên mới đủ thần niệm xuất khiếu Binh Giải Luân Hồi!');
      return;
    }
    openRebornModal(true);
  };

  // Nâng cấp Perk Luân Hồi vĩnh viễn trong modal
  const handleUpgradeRebornPerk = (perkId: string) => {
    const perkConfig = REINCARNATION_PERKS_CATALOG.find(p => p.id === perkId);
    if (!perkConfig) return;

    const currentBaseLvl = player.reincarnationState?.permanentPerks?.[perkId] || 0;
    const additionalLvl = selectedPerks[perkId] || 0;
    const totalLvl = currentBaseLvl + additionalLvl;

    if (totalLvl >= perkConfig.maxLevel) {
      showToast?.(`【${perkConfig.name}】 đã đạt cấp tối đa (${perkConfig.maxLevel})!`);
      return;
    }

    if (currentAvailableKarma < perkConfig.karmaCost) {
      showToast?.(`Không đủ Điểm Luân Hồi! Cần ${perkConfig.karmaCost} Karma.`);
      return;
    }

    setSelectedPerks(prev => ({
      ...prev,
      [perkId]: (prev[perkId] || 0) + 1
    }));
    setKarmaSpentInModal(prev => prev + perkConfig.karmaCost);
    showToast?.(`Đã thăng cấp 【${perkConfig.name}】 lên Cấp ${totalLvl + 1}!`);
  };

  // Thăng hoa Linh Căn bằng Karma
  const handleUpgradeSpiritualRootWithKarma = () => {
    const rootToUpgrade = selectedLinhCan || player.linhCan;
    if (!rootToUpgrade) return;

    const nextCfg = getNextSpiritualRootUpgrade(rootToUpgrade.grade);
    if (!nextCfg) {
      showToast?.('Linh Căn đã đạt phẩm cấp Hỗn Độn tối cao, không thể thăng hoa thêm!');
      return;
    }

    if (currentAvailableKarma < nextCfg.karmaCost) {
      showToast?.(`Không đủ Điểm Luân Hồi! Cần ${nextCfg.karmaCost.toLocaleString()} Karma để thăng hoa.`);
      return;
    }

    const upgraded = upgradeSpiritualRoot(rootToUpgrade);
    setSelectedLinhCan(upgraded);
    setKarmaSpentInModal(prev => prev + nextCfg.karmaCost);
    showToast?.(`Thăng hoa thành công! Tiên Thiên Linh Căn tiến giai thành [${upgraded.grade}]!`);
  };

  // Chọn Mệnh Cách Luân Hồi độc quyền
  const handleSelectInheritedDestiny = (destinyId: string | null) => {
    setSelectedInheritedDestinyId(prev => (prev === destinyId ? null : destinyId));
  };

  // Chuyển màn hình trong modal
  const handleProceedToInheritance = () => {
    setRebornScreen('inheritance');
  };

  // Thực thi Tái Sinh Kiếp Mới
  const handleConfirmReincarnation = () => {
    const { newPlayer, karmaReward: resultReward, logTitle, logContent } = executeReincarnation(player, {
      isBinhGiai: isBinhGiaiMode,
      keepSealedNatal,
      upgradedLinhCan: selectedLinhCan,
      chosenInheritedDestinyId: selectedInheritedDestinyId,
      upgradedPerks: selectedPerks,
      karmaSpent: karmaSpentInModal
    });

    setPlayer(newPlayer);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayer));
    } catch (err) {
      console.error('Lỗi lưu trữ chuyển sinh:', err);
    }

    addLog?.(logTitle, logContent, 'system');
    playSfx?.('breakthrough');
    showToast?.(`Niết Bàn Trùng Sinh thành công! Bước vào Kiếp Thứ ${newPlayer.reincarnationState?.totalRebornTimes || 1}!`);
    setIsRebornModalOpen(false);
  };

  // Khởi tạo nhân vật mới hoàn toàn (Làm lại từ đầu / Fresh New Game)
  const handleStartFreshNewGame = () => {
    // 1. Khởi tạo dữ liệu người chơi mới hoàn toàn từ con số 0
    const freshPlayer = createNewPlayer();

    // 2. Ghi đè vào save slot chính và slot 1 trong localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
      saveGameData(freshPlayer);
      saveToSlot(1, freshPlayer, 'Khởi tạo mới từ đầu');
    } catch (err) {
      console.error('Lỗi khởi tạo nhân vật mới:', err);
    }

    // 3. Đóng modal và cập nhật state toàn cục
    setPlayer(freshPlayer);
    setIsRebornModalOpen(false);
    showToast?.('Đã khởi tạo nhân vật mới thành công! Hành trình tu tiên bắt đầu từ con số 0.');
    addLog?.(
      '🌱 KHỞI TẠO LẠI TỪ ĐẦU (NEW GAME)',
      'Đạo hữu đã từ bỏ luân hồi, xé bỏ tiền kiếp, tái sinh thành một phàm nhân sơ khởi từ con số 0!',
      'system'
    );
    playSfx?.('breakthrough');
  };

  // Kế thừa thân xác Chân Truyền Đệ Tử khi Luân Hồi
  const handleInheritDisciple = (discipleId: string) => {
    const sect = player.customSectState;
    if (!sect || !sect.isFounded) {
      showToast?.('Chưa lập môn phái!');
      return;
    }
    const disciple = sect.disciples.find(d => d.id === discipleId);
    if (!disciple) {
      showToast?.('Không tìm thấy đệ tử chân truyền!');
      return;
    }

    const { newPlayer, logTitle, logContent } = executeInheritDiscipleReincarnation(player, disciple, {
      isBinhGiai: isBinhGiaiMode,
      keepSealedNatal
    });

    setPlayer(newPlayer);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayer));
    } catch (err) {
      console.error('Lỗi lưu trữ chuyển sinh kế thừa:', err);
    }

    addLog?.(logTitle, logContent, 'system');
    playSfx?.('breakthrough');
    showToast?.(`Y Bát Kế Thừa thành công! Tái sinh vào thân xác ${disciple.name} (${disciple.realmName})!`);
    setIsRebornModalOpen(false);
  };

  return {
    isRebornModalOpen,
    rebornScreen,
    setRebornScreen,
    isBinhGiaiMode,
    karmaReward,
    currentAvailableKarma,
    selectedPerks,
    selectedLinhCan,
    selectedInheritedDestinyId,
    keepSealedNatal,
    setKeepSealedNatal,
    openRebornModal,
    closeRebornModal,
    handleTriggerBinhGiai,
    handleUpgradeRebornPerk,
    handleUpgradeSpiritualRootWithKarma,
    handleSelectInheritedDestiny,
    handleProceedToInheritance,
    handleConfirmReincarnation,
    handleStartFreshNewGame,
    handleInheritDisciple
  };
}
