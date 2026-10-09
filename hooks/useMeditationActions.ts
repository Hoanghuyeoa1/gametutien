// hooks/useMeditationActions.ts
// Custom Action Hook cho Phân Hệ "Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà"
// Tích hợp: Đạo Lữ & Linh Thú Hộ Pháp (Guardian Assistance & Elemental Resonance)

import { useState, useMemo, useEffect } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  MeditationStanceType,
  MeditationProgressResult,
  MeditationLocationConfig
} from '@/lib/types/meditation';
import {
  MEDITATION_LOCATIONS,
  MEDITATION_STANCES_CONFIG,
  WARD_ITEMS_REGISTRY,
  canStartMeditation,
  resolveOfflineMeditationProgress,
  applyMeditationProgressToPlayer,
  getAvailableMeditationLocations
} from '@/lib/meditation-logic';
import { COMPANIONS_MAP, COMPANIONS_DATA } from '@/lib/companions-data';
import {
  validateMeditationGuardians,
  checkElementalResonance,
  assignGuardiansLock,
  releaseGuardiansLock
} from '@/lib/meditation-guardian-logic';
import { SpiritBeast } from '@/lib/types/beasts';

export interface UseMeditationActionsProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export type UseMeditationActionsReturn = ReturnType<typeof useMeditationActions>;

export function useMeditationActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseMeditationActionsProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    player.meditationLocationId || player.meditationState?.locationId || 'linh_mach_tong_mon'
  );
  const [selectedStance, setSelectedStance] = useState<MeditationStanceType>(
    player.meditationStance || player.meditationState?.stance || 'co_ban'
  );
  const [selectedWardId, setSelectedWardId] = useState<string | null>(
    player.equippedWardItemId ?? player.meditationState?.wardItemId ?? null
  );
  const [targetHours, setTargetHours] = useState<number>(8);

  // Hộ Đạo Trận Vị: Đạo Lữ & Linh Thú được cử xuất trận
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(
    player.meditationState?.accompanyingCompanionId ?? player.accompanyingCompanionId ?? null
  );
  const [selectedBeastId, setSelectedBeastId] = useState<string | null>(
    player.meditationState?.accompanyingBeastId ?? player.accompanyingBeastId ?? null
  );

  const [showJournalModal, setShowJournalModal] = useState<boolean>(false);
  const [lastProgressResult, setLastProgressResult] = useState<MeditationProgressResult | null>(null);

  // Trạng thái đang nhập định
  const isMeditating = Boolean(player.meditationState?.isMeditating);
  const startTime = player.meditationState?.startTime || 0;

  // Realtime ticker cho thời gian trôi qua
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    if (!isMeditating) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isMeditating]);

  const elapsedSeconds = useMemo(() => {
    if (!isMeditating || startTime <= 0) return 0;
    return Math.max(0, Math.floor((now - startTime) / 1000));
  }, [isMeditating, startTime, now]);

  const elapsedHours = Math.floor(elapsedSeconds / 3600);
  const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);
  const displaySeconds = elapsedSeconds % 60;

  // Thẩm định điều kiện nhập định nhân vật
  const validation = useMemo(() => {
    return canStartMeditation(player, selectedLocationId, selectedStance);
  }, [player, selectedLocationId, selectedStance]);

  const availableLocations: MeditationLocationConfig[] = useMemo(() => {
    return getAvailableMeditationLocations(player);
  }, [player]);

  const currentLocationConfig: MeditationLocationConfig = useMemo(() => {
    return availableLocations.find(l => l.id === selectedLocationId) ||
      MEDITATION_LOCATIONS[selectedLocationId] ||
      MEDITATION_LOCATIONS.linh_mach_tong_mon;
  }, [availableLocations, selectedLocationId]);

  const currentStanceConfig = MEDITATION_STANCES_CONFIG[selectedStance] || MEDITATION_STANCES_CONFIG.co_ban;

  // Danh sách Đạo Lữ đủ điều kiện hộ pháp (Đã kết duyên, không kiệt sức, không bị khóa phiên khác)
  const availableCompanions = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      title: string;
      element: string;
      realmIndex: number;
      affinity: number;
      avatar?: string;
      isBonded: boolean;
      fatigueUntil?: number;
    }> = [];

    const compStates = player.companionsState?.companions || {};
    COMPANIONS_DATA.forEach(def => {
      const state = compStates[def.id];
      if (state && state.isBonded) {
        // Nếu đang trong phiên bế quan thì cho phép hiển thị đạo lữ đang được gán
        const isCurrentlyAssigned = state.isAssignedToMeditation && state.id === player.meditationState?.accompanyingCompanionId;
        const isFree = !state.isAssignedToMeditation || isCurrentlyAssigned;
        const isNotFatigued = !state.fatigueUntil || state.fatigueUntil <= now || isCurrentlyAssigned;

        if (isFree && isNotFatigued) {
          list.push({
            id: def.id,
            name: def.name,
            title: def.title,
            element: def.element || 'Hỗn Độn',
            realmIndex: def.realmIndex,
            affinity: state.affinity || 0,
            avatar: def.avatar,
            isBonded: true,
            fatigueUntil: state.fatigueUntil
          });
        }
      }
    });

    return list;
  }, [player.companionsState, player.meditationState, now]);

  // Danh sách Linh Thú đủ điều kiện hộ pháp (Có trong kho/thú uyển, không khóa buồng phối giống)
  const availableBeasts = useMemo(() => {
    const allBeasts: SpiritBeast[] = player.beastGarden?.beasts || player.beasts || [];
    return allBeasts.filter(b => {
      if (!b) return false;
      const isCurrentlyAssigned = b.isAssignedToMeditation && b.id === player.meditationState?.accompanyingBeastId;
      return (!b.isLockedInBreeding && (!b.isAssignedToMeditation || isCurrentlyAssigned));
    });
  }, [player.beastGarden, player.beasts, player.meditationState]);

  // Thông tin đối tượng hộ pháp đang chọn
  const selectedCompanionDef = selectedCompanionId ? COMPANIONS_MAP[selectedCompanionId] : null;
  const selectedBeastObj = selectedBeastId
    ? (player.beastGarden?.beasts || player.beasts || []).find(b => b && b.id === selectedBeastId)
    : null;

  // Tính toán Cộng Hưởng Nguyên Tố (Resonance)
  const elementalResonance = useMemo(() => {
    return checkElementalResonance(
      currentLocationConfig,
      selectedCompanionDef?.element,
      selectedBeastObj?.element
    );
  }, [currentLocationConfig, selectedCompanionDef, selectedBeastObj]);

  const availableWardsInInventory = useMemo(() => {
    const list: { id: string; name: string; description: string; count: number }[] = [];
    const inv = player.inventory;
    if (!inv) return list;

    const allItems = [
      ...(inv.bags || []),
      ...(inv.equipments || []),
      ...(inv.pills || []),
      ...(inv.herbs || []),
      ...(inv.ores || [])
    ];
    for (const item of allItems) {
      if (item && WARD_ITEMS_REGISTRY[item.id]) {
        list.push({
          id: item.id,
          name: item.name || WARD_ITEMS_REGISTRY[item.id].name,
          description: WARD_ITEMS_REGISTRY[item.id].description,
          count: item.quantity || 1
        });
      }
    }
    return list;
  }, [player.inventory]);

  // Handler: Bắt đầu nhập định (Kèm khóa nguyên tử cho Đạo Lữ & Linh Thú)
  const handleStartMeditation = () => {
    if (!validation.canMedidate) {
      showToast(validation.reason || 'Không đủ điều kiện nhập định!');
      return;
    }

    // Kiểm tra hợp lệ hộ pháp
    const guardianCheck = validateMeditationGuardians(
      player,
      selectedCompanionId,
      selectedBeastId,
      Date.now()
    );
    if (!guardianCheck.validCompanion) {
      showToast(guardianCheck.companionReason || 'Đạo Lữ không đủ điều kiện hộ pháp!');
      return;
    }
    if (!guardianCheck.validBeast) {
      showToast(guardianCheck.beastReason || 'Linh Thú không đủ điều kiện hộ pháp!');
      return;
    }

    const loc = currentLocationConfig;
    const stanceCfg = currentStanceConfig;

    // Gán cờ khóa trạng thái cho Đạo Lữ và Linh Thú hộ pháp (Hard Invariant 3)
    let updated = assignGuardiansLock(player, selectedCompanionId, selectedBeastId);

    updated = {
      ...updated,
      meditationLocationId: selectedLocationId,
      meditationStance: selectedStance,
      equippedWardItemId: selectedWardId,
      meditationState: {
        isMeditating: true,
        startTime: Date.now(),
        locationId: selectedLocationId,
        stance: selectedStance,
        wardItemId: selectedWardId,
        targetHours,
        lastTickTime: Date.now(),
        accompanyingCompanionId: selectedCompanionId || null,
        accompanyingBeastId: selectedBeastId || null,
        guardianRescueCount: 0
      }
    };

    setPlayer(updated);

    const compName = selectedCompanionDef?.name;
    const beastName = selectedBeastObj?.name;
    const companionsText = compName && beastName
      ? ` cùng Đạo Lữ 【${compName}】 & Linh Thú 【${beastName}】 hộ pháp`
      : compName
        ? ` cùng Đạo Lữ 【${compName}】 hộ pháp`
        : beastName
          ? ` cùng Linh Thú 【${beastName}】 hộ pháp`
          : '';

    addLog(
      'Thiên Địa Nhập Định',
      `Đã tĩnh tọa nhập định tại 【${loc.name}】 theo thế 【${stanceCfg.name}】${companionsText}${selectedWardId ? ' (Có kích hoạt Bùa Hộ Mệnh)' : ''}.`,
      'cultivation'
    );
    showToast(`🧘 Bắt đầu nhập định tại ${loc.name}!`);
  };

  // Handler: Thu hoạch thành quả nhập định (Kết thúc bình thường hoặc sau offline)
  const handleClaimMeditationRewards = () => {
    if (!isMeditating || startTime <= 0) {
      showToast('Hiện không có phiên nhập định nào đang diễn ra!');
      return;
    }

    const locId = player.meditationState?.locationId || selectedLocationId;
    const stance = player.meditationState?.stance || selectedStance;
    const wardId = player.meditationState?.wardItemId ?? selectedWardId;
    const compId = player.meditationState?.accompanyingCompanionId ?? selectedCompanionId;
    const beastId = player.meditationState?.accompanyingBeastId ?? selectedBeastId;

    const result = resolveOfflineMeditationProgress(
      player,
      startTime,
      Date.now(),
      locId,
      stance,
      wardId,
      { companionId: compId, beastId }
    );

    const updated = applyMeditationProgressToPlayer(player, result, stance);
    setPlayer(updated);
    setLastProgressResult(result);
    setShowJournalModal(true);

    addLog(
      'Xuất Quan Nhập Định',
      `Tĩnh tọa kết thúc sau ${result.effectiveHours} giờ hiệu lực. Thu hoạch: +${result.totalTuviGained.toLocaleString()} Tu Vi, +${result.totalStonesGained} Linh Thạch.${result.demonicCleanseTotal > 0 ? ` Tẩy trừ -${result.demonicCleanseTotal} Ma Tính!` : ''}${result.guardianGrowth?.companion ? ` Đạo Lữ +${result.guardianGrowth.companion.affectionGained} Hảo Cảm!` : ''}${result.guardianGrowth?.beast ? ` Linh Thú +${result.guardianGrowth.beast.expGained} EXP!` : ''}`,
      'cultivation'
    );
    showToast(`✨ Xuất quan viên mãn! Đã thu hoạch thành quả.`);
  };

  // Handler: Hủy hoặc dừng sớm trước thời hạn (vẫn kết toán đầy đủ số giờ đã trôi qua)
  const handleCancelMeditation = () => {
    if (!isMeditating) return;
    handleClaimMeditationRewards();
  };

  const closeJournalModal = () => {
    setShowJournalModal(false);
  };

  return {
    selectedLocationId,
    selectedStance,
    selectedWardId,
    selectedCompanionId,
    selectedBeastId,
    targetHours,
    isMeditating,
    elapsedSeconds,
    elapsedHours,
    elapsedMinutes,
    displaySeconds,
    validation,
    availableLocations,
    availableCompanions,
    availableBeasts,
    selectedCompanionDef,
    selectedBeastObj,
    elementalResonance,
    currentLocationConfig,
    currentStanceConfig,
    availableWardsInInventory,
    showJournalModal,
    lastProgressResult,
    setSelectedLocationId,
    setSelectedStance,
    setSelectedWardId,
    setSelectedCompanionId,
    setSelectedBeastId,
    setTargetHours,
    handleStartMeditation,
    handleClaimMeditationRewards,
    handleCancelMeditation,
    closeJournalModal
  };
}
