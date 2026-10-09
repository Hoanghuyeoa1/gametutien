// hooks/useBeastGardenActions.ts
// Hook quản lý toàn bộ tương tác và trạng thái của Thú Uyển Động Phủ (Lai Tạo & Huyết Mạch)

import { useState, useCallback } from 'react';
import { PlayerStats } from '@/lib/types/player';
import {
  canBreedBeasts,
  startBeastBreeding,
  hatchBeastEgg,
  speedUpIncubation,
  evolveBloodline,
  toggleEquipBeastRole,
  upgradeBeastGardenFacility,
  generateBeastBreedingResult,
  BREEDING_CATALYSTS
} from '@/lib/beast-breeding-logic';

export interface UseBeastGardenActionsProps {
  player: PlayerStats;
  onUpdatePlayer: (updated: PlayerStats) => void;
  onAddLog: (title: string, content: string, type: any) => void;
  onShowToast: (msg: string) => void;
}

export function useBeastGardenActions({
  player,
  onUpdatePlayer,
  onAddLog,
  onShowToast
}: UseBeastGardenActionsProps) {
  const [activeGardenSubTab, setActiveGardenSubTab] = useState<'beasts' | 'altar' | 'incubator'>('beasts');
  const [selectedParentAId, setSelectedParentAId] = useState<string | null>(null);
  const [selectedParentBId, setSelectedParentBId] = useState<string | null>(null);
  const [selectedCatalystId, setSelectedCatalystId] = useState<string | null>(null);
  const [selectedBeastForEvolveId, setSelectedBeastForEvolveId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const beasts = player.beastGarden?.beasts || player.beasts || [];
  const eggs = player.beastGarden?.eggs || [];
  const facility = player.beastGarden?.facility || {
    level: 1,
    maxBreedingSlots: 2,
    incubationSpeedMultiplier: 1.0,
    mutationRateBonus: 0
  };

  const parentA = beasts.find(b => b.id === selectedParentAId) || null;
  const parentB = beasts.find(b => b.id === selectedParentBId) || null;

  // Dự toán kết quả lai tạo (Preview)
  const breedingPreview = parentA && parentB
    ? generateBeastBreedingResult(parentA, parentB, facility, selectedCatalystId || undefined)
    : null;

  const eligibility = parentA && parentB
    ? canBreedBeasts(player, parentA, parentB, selectedCatalystId || undefined)
    : null;

  // 1. Khởi động phối giống
  const handleStartBreeding = useCallback(() => {
    if (!selectedParentAId || !selectedParentBId) {
      onShowToast('Vui lòng chọn đủ 2 Linh Thú Cha và Mẹ để bắt đầu phối giống!');
      return;
    }

    setIsProcessing(true);
    try {
      const res = startBeastBreeding(player, selectedParentAId, selectedParentBId, selectedCatalystId || undefined);
      if (res.success) {
        onUpdatePlayer(res.updatedPlayer);
        onShowToast(res.message);
        onAddLog('Lai Tạo Huyết Mạch', res.message, 'beast');
        setSelectedParentAId(null);
        setSelectedParentBId(null);
        setSelectedCatalystId(null);
        setActiveGardenSubTab('incubator'); // Chuyển sang xem trứng đang ấp
      } else {
        onShowToast(`❌ ${res.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [player, selectedParentAId, selectedParentBId, selectedCatalystId, onUpdatePlayer, onShowToast, onAddLog]);

  // 2. Ấp nở trứng Dị Thú
  const handleHatchEgg = useCallback((eggId: string) => {
    setIsProcessing(true);
    try {
      const res = hatchBeastEgg(player, eggId);
      if (res.success) {
        onUpdatePlayer(res.updatedPlayer);
        onShowToast(res.message);
        onAddLog('Ấp Nở Dị Thú', res.message, 'beast');
      } else {
        onShowToast(`❌ ${res.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [player, onUpdatePlayer, onShowToast, onAddLog]);

  // 3. Tăng tốc ấp nở bằng Linh Thạch
  const handleSpeedUpIncubation = useCallback((eggId: string) => {
    setIsProcessing(true);
    try {
      const res = speedUpIncubation(player, eggId);
      if (res.success) {
        onUpdatePlayer(res.updatedPlayer);
        onShowToast(res.message);
        onAddLog('Quán Chú Linh Khí', res.message, 'beast');
      } else {
        onShowToast(`❌ ${res.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [player, onUpdatePlayer, onShowToast, onAddLog]);

  // 4. Tiến hóa huyết mạch (Thối Huyết Thần Đỉnh)
  const handleEvolveBloodline = useCallback((beastId: string, pillType: 'beast_dan' | 'blood_pill' = 'beast_dan') => {
    setIsProcessing(true);
    try {
      const res = evolveBloodline(player, beastId, pillType);
      if (res.success) {
        onUpdatePlayer(res.updatedPlayer);
        onShowToast(res.message);
        onAddLog('Huyết Mạch Thăng Hoa', res.message, 'beast');
      } else {
        onShowToast(`❌ ${res.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [player, onUpdatePlayer, onShowToast, onAddLog]);

  // 5. Thiết lập vai trò thú cưỡi / xuất chiến
  const handleToggleEquipBeast = useCallback((beastId: string, slot: 'mount' | 'combat' | 'both') => {
    const res = toggleEquipBeastRole(player, beastId, slot);
    if (res.success) {
      onUpdatePlayer(res.updatedPlayer);
      onShowToast(res.message);
    } else {
      onShowToast(`❌ ${res.message}`);
    }
  }, [player, onUpdatePlayer, onShowToast]);

  // 6. Nâng cấp Thú Uyển
  const handleUpgradeFacility = useCallback(() => {
    const res = upgradeBeastGardenFacility(player);
    if (res.success) {
      onUpdatePlayer(res.updatedPlayer);
      onShowToast(res.message);
      onAddLog('Nâng Cấp Thú Uyển', res.message, 'abode');
    } else {
      onShowToast(`❌ ${res.message}`);
    }
  }, [player, onUpdatePlayer, onShowToast, onAddLog]);

  return {
    activeGardenSubTab,
    setActiveGardenSubTab,
    selectedParentAId,
    setSelectedParentAId,
    selectedParentBId,
    setSelectedParentBId,
    selectedCatalystId,
    setSelectedCatalystId,
    selectedBeastForEvolveId,
    setSelectedBeastForEvolveId,
    isProcessing,
    facility,
    beasts,
    eggs,
    parentA,
    parentB,
    breedingPreview,
    eligibility,
    catalysts: BREEDING_CATALYSTS,
    handleStartBreeding,
    handleHatchEgg,
    handleSpeedUpIncubation,
    handleEvolveBloodline,
    handleToggleEquipBeast,
    handleUpgradeFacility
  };
}
