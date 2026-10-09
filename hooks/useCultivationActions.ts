import { useState } from 'react';
import {
  PlayerStats,
  LinhCan,
  DestinyFate,
  Physique,
  LogType
} from '@/lib/types';
import {
  performBodyRefinement,
  performSpiritualRootEvolution,
  createNewPlayer,
  getMaxKhiHuyet,
  getMaxLinhLuc
} from '@/lib/game-logic';
import {
  canUpgradeBodyRefinement,
  performUpgradeBodyRefinement
} from '@/lib/body-soul-data';
import {
  canUpgradeSoulProgression,
  performUpgradeSoulProgression
} from '@/lib/soul-cultivation-data';
import {
  rollRandomDestiny,
  rollDestinyOnReborn,
  DESTINY_REROLL_COST_LT,
  DESTINY_REROLL_PILL_ID,
  calculateCombatStats,
  equipDestinyFate,
  unequipDestinyFate,
  createDefaultDestinyBoard
} from '@/lib/destiny-data';
import { rollLinhCanOnReborn } from '@/lib/elemental-system';
import { createDefaultPhysique, rollRandomPhysiques } from '@/lib/physique-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseCultivationActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  setLogs?: React.Dispatch<React.SetStateAction<any[]>>;
}

export function useCultivationActions({
  player,
  setPlayer,
  addLog,
  showToast,
  setLogs
}: UseCultivationActionsParams) {
  // Modals cho Thể Chất & Linh Căn & Mệnh Cách
  const [showRefineModal, setShowRefineModal] = useState<boolean>(false);
  const [showRootModal, setShowRootModal] = useState<boolean>(false);
  const [showDestinyModal, setShowDestinyModal] = useState<boolean>(false);
  const [isRollingDestiny, setIsRollingDestiny] = useState<boolean>(false);

  // Modal Gacha Tẩy Tủy Trùng Sinh (Chuyển Sinh Luân Hồi)
  const [showRebornModal, setShowRebornModal] = useState<boolean>(false);
  const [rebornPreview, setRebornPreview] = useState<{
    linhCan: LinhCan;
    destiny: DestinyFate;
    physiques: Physique[];
  } | null>(null);
  const [isRerollingReborn, setIsRerollingReborn] = useState<boolean>(false);

  // Xử lý Tôi Thể (Body Refinement)
  const handleBodyRefine = () => {
    const result = performBodyRefinement(player);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(result.message);
    addLog('Tôi Thể Rèn Thân', result.message, 'physique');
  };

  // Xử lý Thăng Hoa Linh Căn (Spiritual Root Evolution)
  const handleRootEvolve = () => {
    const result = performSpiritualRootEvolution(player);
    if (!result.success) {
      showToast(result.message);
      return;
    }

    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(result.message);
    addLog('Thăng Hoa Linh Căn', result.message, 'root');
  };

  // Xử lý Tôi Thể Đột Phá (Hệ Thống Nhục Thân - Thể Tu Song Trục)
  const handleUpgradeBodyCultivation = () => {
    const check = canUpgradeBodyRefinement(player);
    if (!check.canUpgrade) {
      showToast(check.reason);
      return;
    }

    const result = performUpgradeBodyRefinement(player);
    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(result.message);
    addLog(result.success ? 'Tôi Thể Đột Phá' : 'Huyết Khí Thí Luyện', result.message, result.success ? 'physique' : 'danger');
  };

  // Xử lý Thần Hồn Thăng Hoa (Hệ Thống Thần Hồn - Hồn Tu Song Trục)
  const handleUpgradeSoulCultivation = () => {
    const check = canUpgradeSoulProgression(player);
    if (!check.canUpgrade) {
      showToast(check.reason);
      return;
    }

    const result = performUpgradeSoulProgression(player);
    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(result.message);
    addLog(
      result.isBreakthrough ? 'Thần Hồn Đột Phá' : 'Tôi Hồn Thăng Tầng',
      result.message,
      result.success ? 'system' : 'danger'
    );
  };

  // Xử lý Nghịch Thiên Cải Mệnh (Reroll Destiny)
  const handleRerollDestiny = (usePill: boolean) => {
    if (isRollingDestiny) return;

    const ownedPillCount = (player.inventory?.pills || []).find(p => p.id === DESTINY_REROLL_PILL_ID)?.quantity || 0;
    if (usePill) {
      if (ownedPillCount < 1) {
        showToast('Không đủ Cải Mệnh Đan!');
        return;
      }
    } else {
      if (player.linhThach < DESTINY_REROLL_COST_LT) {
        showToast(`Không đủ Linh Thạch! Cần ít nhất ${DESTINY_REROLL_COST_LT} Linh Thạch để tế thiên.`);
        return;
      }
    }

    setIsRollingDestiny(true);

    setTimeout(() => {
      const newFate = rollRandomDestiny(player.destiny?.id);

      setPlayer((prev) => {
        const inv = prev.inventory ? { ...prev.inventory } : { pills: [], herbs: [], ores: [], manuals: [], equipments: [] };
        const pills = (inv.pills || []).map(p => ({ ...p }));

        if (usePill) {
          const targetIdx = pills.findIndex(p => p.id === DESTINY_REROLL_PILL_ID);
          if (targetIdx >= 0) {
            pills[targetIdx].quantity -= 1;
            if (pills[targetIdx].quantity <= 0) {
              pills.splice(targetIdx, 1);
            }
          }
        }

        const currentBoard = prev.destinyBoard || createDefaultDestinyBoard(newFate.id);
        const newCollected = Array.from(new Set([...currentBoard.collectedIds, newFate.id]));
        let newEquipped = [...currentBoard.equippedIds];
        if (!newEquipped.includes(newFate.id)) {
          if (newEquipped.length < currentBoard.unlockedSlots) {
            newEquipped.push(newFate.id);
          } else {
            newEquipped[0] = newFate.id;
          }
        }
        const updatedBoard = {
          ...currentBoard,
          collectedIds: newCollected,
          equippedIds: newEquipped
        };

        const updated: PlayerStats = {
          ...prev,
          linhThach: usePill ? prev.linhThach : Math.max(0, prev.linhThach - DESTINY_REROLL_COST_LT),
          inventory: {
            ...inv,
            pills
          },
          destiny: newFate,
          destinyBoard: updatedBoard
        };

        const normalized = normalizePlayerData(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      });

      setIsRollingDestiny(false);

      if (usePill) {
        showToast('Đã tiêu hao 1 viên Cải Mệnh Đan, nghịch chuyển thiên cơ!');
      } else {
        showToast(`Nghịch Thiên Thành Công! Đã thức tỉnh Mệnh Cách [${newFate.name}]!`);
      }

      addLog(
        'Nghịch Thiên Cải Mệnh',
        `Tế thiên thành công! Khí vận luân chuyển, ngươi thu được Mệnh Cách [${newFate.name}] (${newFate.grade}) và bổ sung vào Mệnh Bàn! ${newFate.effectsSummary}`,
        'destiny'
      );
    }, 850);
  };

  // Khảm nạp Mệnh Cách vào Bát Quái Mệnh Bàn
  const handleEquipDestiny = (fateId: string) => {
    setPlayer((prev) => {
      const res = equipDestinyFate(prev, fateId);
      if (!res.success) {
        showToast(res.message);
        return prev;
      }
      showToast(res.message);
      addLog('Bát Quái Mệnh Bàn', res.message, 'destiny');
      const normalized = normalizePlayerData(res.updatedPlayer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    });
  };

  // Tháo gỡ Mệnh Cách khỏi Bát Quái Mệnh Bàn
  const handleUnequipDestiny = (fateId: string) => {
    setPlayer((prev) => {
      const res = unequipDestinyFate(prev, fateId);
      if (!res.success) {
        showToast(res.message);
        return prev;
      }
      showToast(res.message);
      addLog('Bát Quái Mệnh Bàn', res.message, 'destiny');
      const normalized = normalizePlayerData(res.updatedPlayer);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    });
  };

  // Mở modal Chuyển Sinh Luân Hồi (Gacha Tẩy Tủy)
  const openRebornModal = () => {
    const rolledRoot = rollLinhCanOnReborn();
    const rolledDestiny = rollDestinyOnReborn();
    const rolledPhysiques = rollRandomPhysiques();
    setRebornPreview({
      linhCan: rolledRoot,
      destiny: rolledDestiny,
      physiques: rolledPhysiques
    });
    setShowRebornModal(true);
  };

  // Tái tạo lại quẻ gacha (Reroll trong modal)
  const handleRerollReborn = () => {
    setIsRerollingReborn(true);
    setTimeout(() => {
      const rolledRoot = rollLinhCanOnReborn();
      const rolledDestiny = rollDestinyOnReborn();
      const rolledPhysiques = rollRandomPhysiques();
      setRebornPreview({
        linhCan: rolledRoot,
        destiny: rolledDestiny,
        physiques: rolledPhysiques
      });
      setIsRerollingReborn(false);
      showToast('Đã nghịch chuyển luân hồi, tái tạo Tiên Thiên cơ duyên!');
    }, 350);
  };

  // Nhập Đạo (Bắt đầu kiếp mới với kết quả gacha)
  const handleConfirmReborn = () => {
    if (!rebornPreview) return;
    const base = createNewPlayer();
    const freshRoot = rebornPreview.linhCan;
    const freshDestiny = rebornPreview.destiny;
    const freshPhysiques = rebornPreview.physiques;
    const primaryPhysique = freshPhysiques[0] || createDefaultPhysique();

    const maxHP = getMaxKhiHuyet(base.canCot, 0, undefined, undefined, freshPhysiques, undefined, freshRoot, freshDestiny);
    const maxMP = getMaxLinhLuc(base.tamCanh, base.ngoTinh, 0, undefined, undefined, undefined, freshRoot);

    const freshPlayer: PlayerStats = {
      ...base,
      khiHuyet: maxHP,
      maxKhiHuyet: maxHP,
      linhLuc: maxMP,
      maxLinhLuc: maxMP,
      linhCan: freshRoot,
      physique: primaryPhysique,
      physiques: freshPhysiques,
      destiny: freshDestiny,
      inventory: {
        pills: [],
        herbs: [],
        ores: [],
        manuals: [],
        equipments: [],
        books: [],
        bags: []
      },
      manuals: [],
      equipment: {},
      tuVi: 0,
      linhThach: 100,
      danhVong: 0,
      currentRealm: 0
    };

    const cStats = calculateCombatStats(freshPlayer);
    freshPlayer.congKich = cStats.atk;
    freshPlayer.phongNgu = cStats.def;
    freshPlayer.thanThuc = cStats.soul;
    freshPlayer.tocDo = cStats.speed;
    freshPlayer.baoKichRate = cStats.critRate;
    freshPlayer.baoKichDmg = cStats.critDmg;

    setPlayer(freshPlayer);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshPlayer));
    } catch (e) {
      console.error(e);
    }

    if (setLogs) setLogs([]);
    const physNames = freshPhysiques.map(p => `[${p.name}] (${p.grade})`).join(' + ');
    addLog(
      '🌟 Luân Hồi Nhập Đạo',
      `Ngươi đã rũ bỏ tiền kiếp, đúc lại tiên cốt! Thức tỉnh Linh Căn [${freshRoot.name}] (${freshRoot.grade}), Mệnh Cách [${freshDestiny.name}] (${freshDestiny.grade}) cùng Thể Chất: ${physNames}.`,
      'system'
    );
    if (freshPhysiques.length === 2) {
      addLog('✨ ĐẠI CƠ DUYÊN', 'Càn khôn dị tượng! Ngươi giác ngộ SONG THỂ TỀ TỤ, toàn bộ chỉ số hai thể chất cộng dồn!', 'system');
    } else if (freshPhysiques.length >= 3) {
      addLog('🔥 VẠN CỔ NGHỊCH THIÊN', 'VẠN CỔ KHÓ GẶP! TAM THỂ QUY NHẤT giáng thế, chư thiên chấn động, tiên ma kính sợ!', 'system');
    }

    setShowRebornModal(false);
    showToast('Tẩy Tủy Hoàn Nguyên thành công! Bước vào kỷ nguyên tu tiên mới!');
  };

  const handleResetGame = () => {
    openRebornModal();
  };

  // Vận công điều tức (Hồi phục Khí Huyết & Linh Lực)
  const handleRestAndHeal = () => {
    const cost = 20;
    if (player.linhThach < cost) {
      showToast(`Không đủ Linh thạch! Cần ${cost} linh thạch để mua đan dược điều tức.`);
      return;
    }

    const maxHP = player.maxKhiHuyet || getMaxKhiHuyet(player.canCot, player.currentRealm, player.equipment);
    const maxMP = player.maxLinhLuc || getMaxLinhLuc(player.tamCanh, player.ngoTinh, player.currentRealm, player.equipment);

    const updated: PlayerStats = {
      ...player,
      linhThach: player.linhThach - cost,
      khiHuyet: maxHP,
      linhLuc: maxMP
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast('Vận công điều tức hoàn tất! Khí Huyết và Linh Lực đã hồi phục đầy đủ.');
    addLog(
      'Vận Công Điều Tức',
      `Tiêu hao ${cost} Linh thạch nuốt một viên Tụ Khí Hồi Huyết Đan. Khí Huyết và Chân Nguyên dồi dào trở lại!`,
      'system'
    );
  };

  return {
    showRefineModal,
    setShowRefineModal,
    showRootModal,
    setShowRootModal,
    showDestinyModal,
    setShowDestinyModal,
    isRollingDestiny,
    setIsRollingDestiny,
    showRebornModal,
    setShowRebornModal,
    rebornPreview,
    setRebornPreview,
    isRerollingReborn,
    setIsRerollingReborn,
    handleBodyRefine,
    handleRootEvolve,
    handleUpgradeBodyCultivation,
    handleUpgradeSoulCultivation,
    handleRerollDestiny,
    handleEquipDestiny,
    handleUnequipDestiny,
    handleRestAndHeal,
    openRebornModal,
    handleRerollReborn,
    handleConfirmReborn,
    handleResetGame
  };
}
