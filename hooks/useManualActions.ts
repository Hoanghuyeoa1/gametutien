import { useState } from 'react';
import { PlayerStats, Manual, LogType } from '@/lib/types';
import { getMaxKhiHuyet, getMaxLinhLuc } from '@/lib/game-logic';
import { getManualSynergy } from '@/lib/elemental-system';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseManualActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useManualActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseManualActionsParams) {
  const [manualsSubTab, setManualsSubTab] = useState<'my_manuals' | 'tang_kinh_cac' | 'dung_hop'>('my_manuals');
  const [manualTypeFilter, setManualTypeFilter] = useState<'all' | 'tam_phap' | 'the_thuat' | 'than_thong'>('all');

  // Trang bị công pháp vào ô tương ứng
  const handleEquipManual = (manual: Manual, slot: 'tamPhap' | 'theThuat' | 'thanThong1' | 'thanThong2') => {
    const updated = { ...player };
    if (!updated.equippedManuals) updated.equippedManuals = {};
    updated.equippedManuals[slot] = manual.id;

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    const slotNames = {
      tamPhap: 'Tâm Pháp Chủ Tu',
      theThuat: 'Thể Thuật Hộ Thân',
      thanThong1: 'Thần Thông Chiến Đấu 1',
      thanThong2: 'Thần Thông Chiến Đấu 2'
    };
    const synergy = getManualSynergy(manual, normalized.linhCan);
    const synergyText = synergy.isSynergy ? ' (Trùng hệ Linh Căn: +50% Hiệu Lực!)' : '';

    showToast(`Đã trang bị [${manual.name}] vào ${slotNames[slot]}!${synergyText}`);
    addLog('Kích Hoạt Công Pháp', `Trang bị [${manual.name}] (${manual.grade}) vào vị trí ${slotNames[slot]}.${synergyText}`, 'manual');
  };

  // Tháo công pháp
  const handleUnequipManual = (slot: 'tamPhap' | 'theThuat' | 'thanThong1' | 'thanThong2') => {
    const updated = { ...player };
    if (!updated.equippedManuals) return;
    delete updated.equippedManuals[slot];

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast('Đã gỡ công pháp khỏi vị trí kích hoạt.');
  };

  // Thăng tầng lĩnh ngộ công pháp
  const handleLevelUpManual = (manualId: string) => {
    const list = player.manuals || [];
    const idx = list.findIndex(m => m.id === manualId);
    if (idx === -1) return;

    const manual = list[idx];
    if (manual.level >= manual.maxLevel) {
      showToast('Công pháp đã đạt đến cảnh giới Viên Mãn tối cao (Tầng 10)!');
      return;
    }

    if (player.ngoTinh < manual.minNgoTinh) {
      showToast(`Ngộ tính chưa đủ! Cần tối thiểu ${manual.minNgoTinh} Ngộ Tính để lĩnh hội tầng tiếp theo.`);
      return;
    }

    if (player.tuVi < manual.tuViPerLevel) {
      showToast(`Tu vi không đủ! Cần ${manual.tuViPerLevel.toLocaleString()} tu vi để thăng tầng.`);
      return;
    }

    if (player.linhThach < manual.linhThachPerLevel) {
      showToast(`Linh thạch không đủ! Cần ${manual.linhThachPerLevel.toLocaleString()} linh thạch để vận công.`);
      return;
    }

    const nextLevel = manual.level + 1;
    const updatedManual = { ...manual, level: nextLevel };
    const updatedList = [...list];
    updatedList[idx] = updatedManual;

    const updatedPlayer = {
      ...player,
      tuVi: player.tuVi - manual.tuViPerLevel,
      linhThach: player.linhThach - manual.linhThachPerLevel,
      manuals: updatedList
    };

    updatedPlayer.maxKhiHuyet = getMaxKhiHuyet(updatedPlayer.canCot, updatedPlayer.currentRealm, updatedPlayer.equipment, updatedList);
    updatedPlayer.maxLinhLuc = getMaxLinhLuc(updatedPlayer.tamCanh, updatedPlayer.ngoTinh, updatedPlayer.currentRealm, updatedPlayer.equipment, updatedList);

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    if (nextLevel === manual.maxLevel) {
      addLog(
        `🌟 VIÊN MÃN CÔNG PHÁP: [${manual.name}]`,
        `Chúc mừng đạo hữu tu luyện [${manual.name}] đạt TẦNG 10 ĐẠI VIÊN MÃN!\nKích hoạt hiệu ứng bị động tối thượng: [${manual.maxLevelPassive.name}] - ${manual.maxLevelPassive.description}!`,
        'breakthrough'
      );
      showToast(`Chúc mừng! [${manual.name}] đã đạt TẦNG 10 VIÊN MÃN!`);
    } else {
      addLog(
        'Lĩnh Ngộ Thăng Tầng',
        `Tiêu hao ${manual.tuViPerLevel.toLocaleString()} Tu vi và ${manual.linhThachPerLevel} Linh thạch, [${manual.name}] đã đột phá lên Tầng ${nextLevel}/${manual.maxLevel}!`,
        'cultivate'
      );
      showToast(`Lĩnh ngộ thành công! [${manual.name}] đạt Tầng ${nextLevel}.`);
    }
  };

  // Mua công pháp mới tại Tàng Kinh Các
  const handleBuyManual = (manual: Manual) => {
    const list = player.manuals || [];
    if (list.some(m => m.id === manual.id)) {
      showToast('Đạo hữu đã sở hữu bí tịch này rồi!');
      return;
    }

    const costLT = manual.priceLinhThach || 500;
    const costDV = manual.priceDanhVong || 0;

    if (player.linhThach < costLT) {
      showToast(`Linh thạch không đủ! Cần ${costLT.toLocaleString()} linh thạch.`);
      return;
    }
    if (costDV > 0 && player.danhVong < costDV) {
      showToast(`Danh vọng không đủ! Cần ${costDV.toLocaleString()} danh vọng tông môn.`);
      return;
    }

    const updatedList = [...list, { ...manual, level: 1 }];
    const updatedPlayer = {
      ...player,
      linhThach: player.linhThach - costLT,
      danhVong: player.danhVong - costDV,
      manuals: updatedList
    };

    updatedPlayer.maxKhiHuyet = getMaxKhiHuyet(updatedPlayer.canCot, updatedPlayer.currentRealm, updatedPlayer.equipment, updatedList);
    updatedPlayer.maxLinhLuc = getMaxLinhLuc(updatedPlayer.tamCanh, updatedPlayer.ngoTinh, updatedPlayer.currentRealm, updatedPlayer.equipment, updatedList);

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    addLog(
      'Tàng Kinh Các Thu Đắc Bí Tịch',
      `Tiêu hao ${costLT.toLocaleString()} Linh thạch trao đổi thành công bí tịch [${manual.name}] (${manual.grade})! Bắt đầu tu luyện Tầng 1.`,
      'system'
    );
    showToast(`Đã thu được [${manual.name}] và nhập môn thành công!`);
  };

  return {
    manualsSubTab,
    setManualsSubTab,
    manualTypeFilter,
    setManualTypeFilter,
    handleEquipManual,
    handleUnequipManual,
    handleLevelUpManual,
    handleBuyManual
  };
}
