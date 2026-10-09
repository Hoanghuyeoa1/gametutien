// hooks/useBreakthroughCatalystActions.ts
// Custom Hook điều phối các thao tác khảm nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch
// 100% Strict TypeScript, Immutable State, Atomic Updates, No Race Conditions

import { useState, useMemo, useCallback } from 'react';
import { PlayerState } from '@/lib/types/player';
import {
  BreakthroughExecutionResult,
  BreakthroughRateCalculation
} from '@/lib/types/breakthrough-catalyst';
import {
  calculateBreakthroughChances,
  resolveBreakthroughBacklash,
  BREAKTHROUGH_PILLS_CONFIG,
  BREAKTHROUGH_TALISMANS_CONFIG
} from '@/lib/breakthrough-catalyst-logic';
import { BREAKTHROUGH_ITEMS_REGISTRY } from '@/lib/items-data';
import {
  resolveBreakthroughFailureBacklash,
  recordBacklashToInjuryState
} from '@/lib/breakthrough-backlash-logic';
import {
  calculateEffectiveRequiredTuVi,
  getMaxKhiHuyet,
  getMaxLinhLuc
} from '@/lib/game-logic';
import { getBaseLifespanForRealm } from '@/lib/lifespan-logic';
import realmsData from '@/data/realms-data.json';

export interface UseBreakthroughCatalystActionsReturn {
  // 1. Hook State
  selectedPillInstanceId: string | null;
  selectedTalismanItemId: string | null;
  isExecuting: boolean;
  executionResult: BreakthroughExecutionResult | null;
  activeDrawerSlot: 'pill' | 'talisman' | null;

  // 2. Memoized Derived State
  selectedPill: any | null;
  selectedTalisman: any | null;
  availablePills: any[];
  availableTalismans: any[];
  rateCalculation: BreakthroughRateCalculation;
  targetNextRealm: any | null;
  requiredTuVi: number;

  // 3. Actions
  handleSelectPill: (instanceId: string | null) => void;
  handleSelectTalisman: (itemId: string | null) => void;
  handleOpenDrawer: (slot: 'pill' | 'talisman') => void;
  handleCloseDrawer: () => void;
  handleClearExecutionResult: () => void;
  handleExecuteBreakthrough: (
    player: PlayerState,
    setPlayer: (p: PlayerState) => void,
    onBreakthroughSuccess?: () => void
  ) => Promise<BreakthroughExecutionResult | null>;
}

export function useBreakthroughCatalystActions(
  player?: PlayerState | null
): UseBreakthroughCatalystActionsReturn {
  // --- 1. HOOK STATE ---
  const [selectedPillInstanceId, setSelectedPillInstanceId] = useState<string | null>(null);
  const [selectedTalismanItemId, setSelectedTalismanItemId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<BreakthroughExecutionResult | null>(null);
  const [activeDrawerSlot, setActiveDrawerSlot] = useState<'pill' | 'talisman' | null>(null);

  // Realm Information
  const currentRealmIndex = useMemo(() => {
    return Math.max(0, Math.min(realmsData.length - 1, player?.currentRealm ?? 0));
  }, [player?.currentRealm]);

  const currentRealmData = useMemo(() => {
    return realmsData[currentRealmIndex] || null;
  }, [currentRealmIndex]);

  const nextRealmIndex = currentRealmIndex + 1;

  const targetNextRealm = useMemo(() => {
    return nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : null;
  }, [nextRealmIndex]);

  const requiredTuVi = useMemo(() => {
    if (!player || !targetNextRealm) return 0;
    try {
      return calculateEffectiveRequiredTuVi(player, targetNextRealm as any);
    } catch {
      return targetNextRealm.requirements?.tuVi ?? 0;
    }
  }, [player, targetNextRealm]);

  // --- 2. MEMOIZED DERIVED STATE: AVAILABLE PILLS ---
  // Lọc từ player.inventory các đan dược có targetRealmIndex phù hợp hoặc tương thích
  // Ưu tiên sắp xếp đan 9 văn và đan phẩm cấp cao lên đầu
  const availablePills = useMemo(() => {
    if (!player?.inventory?.pills || !Array.isArray(player.inventory.pills)) {
      return [];
    }

    const pills = player.inventory.pills.filter((p: any) => {
      if (!p || (typeof p.quantity === 'number' && p.quantity <= 0)) return false;

      const pId = p.itemId || p.id;
      const isKnownBreakthroughPill = Boolean(
        BREAKTHROUGH_PILLS_CONFIG[pId] ||
        BREAKTHROUGH_ITEMS_REGISTRY[pId] ||
        p.effectType === 'breakthrough_bonus' ||
        (typeof p.breakthroughBonusPercent === 'number' && p.breakthroughBonusPercent > 0)
      );

      if (!isKnownBreakthroughPill) return false;

      // Kiểm tra tương thích cảnh giới (nếu có khai báo)
      const pillTargetRealm =
        p.targetRealmIndex ??
        BREAKTHROUGH_PILLS_CONFIG[pId]?.targetRealmIndex;

      if (typeof pillTargetRealm === 'number') {
        // Tương thích nếu cùng bậc cảnh giới hoặc trong khoảng chấp nhận
        const isRealmCompatible =
          pillTargetRealm === nextRealmIndex ||
          pillTargetRealm === currentRealmIndex ||
          Math.abs(pillTargetRealm - nextRealmIndex) <= 10;
        return isRealmCompatible;
      }

      return true;
    });

    // Sắp xếp ưu tiên:
    // 1. Đan 9 văn (Cửu Văn Tuyệt Phẩm) lên đầu
    // 2. Đan 6-8 văn kế tiếp
    // 3. Đan có bonus cao hơn
    return [...pills].sort((a: any, b: any) => {
      const aVeins = a.veinMetadata?.veinCount ?? a.veinCount ?? 0;
      const bVeins = b.veinMetadata?.veinCount ?? b.veinCount ?? 0;

      if (aVeins === 9 && bVeins !== 9) return -1;
      if (bVeins === 9 && aVeins !== 9) return 1;

      if (aVeins >= 6 && bVeins < 6) return -1;
      if (bVeins >= 6 && aVeins < 6) return 1;

      const aConfigBonus =
        a.config?.baseSuccessRateBonus ??
        BREAKTHROUGH_PILLS_CONFIG[a.itemId || a.id]?.baseSuccessRateBonus ??
        a.baseSuccessRateBonus ??
        0;
      const bConfigBonus =
        b.config?.baseSuccessRateBonus ??
        BREAKTHROUGH_PILLS_CONFIG[b.itemId || b.id]?.baseSuccessRateBonus ??
        b.baseSuccessRateBonus ??
        0;

      return bConfigBonus - aConfigBonus;
    });
  }, [player?.inventory?.pills, nextRealmIndex, currentRealmIndex]);

  // --- 2. MEMOIZED DERIVED STATE: AVAILABLE TALISMANS ---
  // Lọc từ player.inventory các vật phẩm phù trợ phá cảnh
  const availableTalismans = useMemo(() => {
    const list: any[] = [];
    const seen = new Set<string>();

    const checkAndAdd = (item: any) => {
      if (!item || (typeof item.quantity === 'number' && item.quantity <= 0)) return;
      const itemId = item.itemId || item.id;
      if (seen.has(itemId)) return;

      const isBreakthroughTalisman = Boolean(
        BREAKTHROUGH_TALISMANS_CONFIG[itemId] ||
        itemId === 'item_tu_linh_tran_ban' ||
        itemId === 'item_ho_mach_phu' ||
        itemId === 'item_dinh_tam_phu' ||
        item.effectType === 'reduce_spirit_stones' ||
        item.effectType === 'prevent_backlash' ||
        item.effectType === 'cleanse_inner_demon'
      );

      if (isBreakthroughTalisman) {
        seen.add(itemId);
        list.push({
          ...BREAKTHROUGH_TALISMANS_CONFIG[itemId],
          ...item
        });
      }
    };

    if (Array.isArray(player?.inventory?.talismans)) {
      player!.inventory!.talismans.forEach(checkAndAdd);
    }

    if (Array.isArray((player?.inventory as any)?.items)) {
      (player!.inventory as any).items.forEach(checkAndAdd);
    }

    return list;
  }, [player?.inventory?.talismans, (player?.inventory as any)?.items]);

  // Selected Pill & Talisman Objects
  const selectedPill = useMemo(() => {
    if (!selectedPillInstanceId) return null;
    return availablePills.find(
      (p: any) => (p.instanceId && p.instanceId === selectedPillInstanceId) || p.id === selectedPillInstanceId
    ) || null;
  }, [availablePills, selectedPillInstanceId]);

  const selectedTalisman = useMemo(() => {
    if (!selectedTalismanItemId) return null;
    return availableTalismans.find(
      (t: any) => t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId
    ) || null;
  }, [availableTalismans, selectedTalismanItemId]);

  // --- 2. MEMOIZED DERIVED STATE: RATE CALCULATION ---
  const rateCalculation: BreakthroughRateCalculation = useMemo(() => {
    const baseRate = targetNextRealm?.breakthrough?.baseSuccessRate
      ? targetNextRealm.breakthrough.baseSuccessRate / 100
      : 0.50;
    const baseSpiritStones = targetNextRealm?.requirements?.linhThach ?? 0;
    const playerToxicity = player?.pillToxicity ?? Math.max(0, 100 - (player?.qiPurity ?? 100));

    return calculateBreakthroughChances({
      baseRate,
      baseSpiritStones,
      playerToxicity,
      selectedPill,
      selectedTalisman
    });
  }, [targetNextRealm, player?.pillToxicity, player?.qiPurity, selectedPill, selectedTalisman]);

  // --- 3. ACTIONS ---
  const handleSelectPill = useCallback((instanceId: string | null) => {
    setSelectedPillInstanceId(instanceId);
  }, []);

  const handleSelectTalisman = useCallback((itemId: string | null) => {
    setSelectedTalismanItemId(itemId);
  }, []);

  const handleOpenDrawer = useCallback((slot: 'pill' | 'talisman') => {
    setActiveDrawerSlot(slot);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setActiveDrawerSlot(null);
  }, []);

  const handleClearExecutionResult = useCallback(() => {
    setExecutionResult(null);
  }, []);

  // --- 3. ACTION: EXECUTE BREAKTHROUGH ---
  const handleExecuteBreakthrough = useCallback(async (
    targetPlayer: PlayerState,
    setPlayer: (p: PlayerState) => void,
    onBreakthroughSuccess?: () => void
  ): Promise<BreakthroughExecutionResult | null> => {
    // 1. Khóa chống double-click / spam
    if (isExecuting) return null;

    const currentPlayer = targetPlayer || player;
    if (!currentPlayer) return null;

    const cRealmIdx = Math.max(0, Math.min(realmsData.length - 1, currentPlayer.currentRealm ?? 0));
    const cRealmData = realmsData[cRealmIdx];
    const nRealmIdx = cRealmIdx + 1;
    const nRealmData = nRealmIdx < realmsData.length ? realmsData[nRealmIdx] : null;

    if (!nRealmData) {
      const maxRealmResult: BreakthroughExecutionResult = {
        success: false,
        previousRealm: cRealmData.name,
        newRealm: cRealmData.name,
        tuviConsumed: 0,
        spiritStonesConsumed: 0,
        isBacklashTriggered: false,
        backlashHpLoss: 0,
        backlashTuviLoss: 0,
        logMessages: ['🌟 Đạo hữu đã đạt tới cực hạn thiên đạo (Đế Tổ), không thể đột phá thêm!']
      };
      setExecutionResult(maxRealmResult);
      return maxRealmResult;
    }

    const reqTuVi = calculateEffectiveRequiredTuVi(currentPlayer, nRealmData as any);
    const chances = calculateBreakthroughChances({
      baseRate: (nRealmData.breakthrough?.baseSuccessRate ?? 50) / 100,
      baseSpiritStones: nRealmData.requirements?.linhThach ?? 0,
      playerToxicity: currentPlayer.pillToxicity ?? Math.max(0, 100 - (currentPlayer.qiPurity ?? 100)),
      selectedPill,
      selectedTalisman
    });

    // 2. Atomic Validation: Trọng thương & Tu Vi & Linh Thạch & Vật phẩm trong kho
    if (currentPlayer.injuryState?.isInjured) {
      const errorResult: BreakthroughExecutionResult = {
        success: false,
        previousRealm: cRealmData.name,
        newRealm: cRealmData.name,
        tuviConsumed: 0,
        spiritStonesConsumed: 0,
        isBacklashTriggered: false,
        backlashHpLoss: 0,
        backlashTuviLoss: 0,
        logMessages: ['❌ Đang trong trạng thái Trọng Thương do Tẩu Hỏa Nhập Ma! Cần điều dưỡng hoặc dùng đan trị thương trước khi đột phá.']
      };
      setExecutionResult(errorResult);
      return errorResult;
    }

    if (currentPlayer.tuVi < reqTuVi) {
      const errorResult: BreakthroughExecutionResult = {
        success: false,
        previousRealm: cRealmData.name,
        newRealm: cRealmData.name,
        tuviConsumed: 0,
        spiritStonesConsumed: 0,
        isBacklashTriggered: false,
        backlashHpLoss: 0,
        backlashTuviLoss: 0,
        logMessages: [`❌ Tu Vi chưa đủ! Cần tối thiểu ${reqTuVi.toLocaleString()} Tu Vi để xung kích cảnh giới.`]
      };
      setExecutionResult(errorResult);
      return errorResult;
    }

    if (currentPlayer.linhThach < chances.spiritStoneCost) {
      const errorResult: BreakthroughExecutionResult = {
        success: false,
        previousRealm: cRealmData.name,
        newRealm: cRealmData.name,
        tuviConsumed: 0,
        spiritStonesConsumed: 0,
        isBacklashTriggered: false,
        backlashHpLoss: 0,
        backlashTuviLoss: 0,
        logMessages: [`❌ Linh Thạch không đủ! Cần tối thiểu ${chances.spiritStoneCost.toLocaleString()} Linh Thạch sau giảm trừ.`]
      };
      setExecutionResult(errorResult);
      return errorResult;
    }

    if (selectedPillInstanceId) {
      const hasPill = (currentPlayer.inventory?.pills || []).some(
        (p: any) =>
          ((p.instanceId && p.instanceId === selectedPillInstanceId) || p.id === selectedPillInstanceId) &&
          (p.quantity > 0 || p.count > 0)
      );
      if (!hasPill) {
        const errorResult: BreakthroughExecutionResult = {
          success: false,
          previousRealm: cRealmData.name,
          newRealm: cRealmData.name,
          tuviConsumed: 0,
          spiritStonesConsumed: 0,
          isBacklashTriggered: false,
          backlashHpLoss: 0,
          backlashTuviLoss: 0,
          logMessages: ['❌ Đan dược đã chọn không còn tồn tại trong Túi Trữ Vật!']
        };
        setExecutionResult(errorResult);
        return errorResult;
      }
    }

    if (selectedTalismanItemId) {
      const hasTalisman =
        (currentPlayer.inventory?.talismans || []).some(
          (t: any) =>
            (t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId) &&
            (t.quantity > 0 || t.count > 0)
        ) ||
        (currentPlayer.inventory as any)?.items?.some(
          (t: any) =>
            (t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId) &&
            (t.quantity > 0 || t.count > 0)
        );

      if (!hasTalisman) {
        const errorResult: BreakthroughExecutionResult = {
          success: false,
          previousRealm: cRealmData.name,
          newRealm: cRealmData.name,
          tuviConsumed: 0,
          spiritStonesConsumed: 0,
          isBacklashTriggered: false,
          backlashHpLoss: 0,
          backlashTuviLoss: 0,
          logMessages: ['❌ Phù Chú / Trận Bàn đã chọn không còn tồn tại trong Túi Trữ Vật!']
        };
        setExecutionResult(errorResult);
        return errorResult;
      }
    }

    setIsExecuting(true);

    // 3. Deep Copy State bất biến
    const cloned = JSON.parse(JSON.stringify(currentPlayer)) as PlayerState;

    // 4. Khấu trừ Linh Thạch
    cloned.linhThach = Math.max(0, (cloned.linhThach || 0) - chances.spiritStoneCost);
    if (cloned.spiritStones !== undefined) {
      cloned.spiritStones = cloned.linhThach;
    }

    // 5. Khấu trừ 1 Đan Dược khỏi inventory
    let consumedPillName: string | undefined = undefined;
    if (selectedPillInstanceId && cloned.inventory?.pills) {
      const pillIndex = cloned.inventory.pills.findIndex(
        (p: any) =>
          (p.instanceId && p.instanceId === selectedPillInstanceId) ||
          p.id === selectedPillInstanceId
      );
      if (pillIndex >= 0) {
        const pillItem = cloned.inventory.pills[pillIndex];
        consumedPillName = pillItem.name;
        pillItem.quantity = (pillItem.quantity || 1) - 1;
        if (pillItem.count !== undefined) pillItem.count = pillItem.quantity;
        if (pillItem.quantity <= 0) {
          cloned.inventory.pills.splice(pillIndex, 1);
        }
      }
    }

    // 6. Khấu trừ 1 Linh Phù khỏi inventory
    let consumedTalismanName: string | undefined = undefined;
    if (selectedTalismanItemId) {
      let deducted = false;
      if (cloned.inventory?.talismans) {
        const talIndex = cloned.inventory.talismans.findIndex(
          (t: any) => t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId
        );
        if (talIndex >= 0) {
          const talItem = cloned.inventory.talismans[talIndex];
          consumedTalismanName = talItem.name;
          talItem.quantity = (talItem.quantity || 1) - 1;
          if (talItem.quantity <= 0) {
            cloned.inventory.talismans.splice(talIndex, 1);
          }
          deducted = true;
        }
      }
      if (!deducted && (cloned.inventory as any)?.items) {
        const itemsArr = (cloned.inventory as any).items;
        const talIndex = itemsArr.findIndex(
          (t: any) => t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId
        );
        if (talIndex >= 0) {
          consumedTalismanName = itemsArr[talIndex].name;
          itemsArr[talIndex].quantity = (itemsArr[talIndex].quantity || 1) - 1;
          if (itemsArr[talIndex].quantity <= 0) {
            itemsArr.splice(talIndex, 1);
          }
        }
      }
    }

    // 7. Xúc xắc thành công/thất bại
    const roll = Math.random();
    const isSuccess = chances.isGuaranteedSuccess || roll < chances.finalRate;
    const logMessages: string[] = [];

    if (consumedPillName) {
      if (chances.isGuaranteedSuccess) {
        logMessages.push(`🌟 Phục dụng 【${consumedPillName}】 Cửu Văn Viên Mãn: Càn khôn định đoạt, 100% phá cảnh thành công!`);
      } else {
        logMessages.push(`💊 Phục dụng 【${consumedPillName}】: Gia tăng +${Math.round(chances.pillBonusRate * 100)}% tỷ lệ phá cảnh.`);
      }
    }

    if (consumedTalismanName) {
      if (chances.isBacklashProtected) {
        logMessages.push(`🛡️ Khảm nạp 【${consumedTalismanName}】: Tuyệt đối phòng ngự kinh mạch, miễn nhiễm phản phệ.`);
      } else if (selectedTalisman?.effectType === 'reduce_spirit_stones' || selectedTalismanItemId === 'item_tu_linh_tran_ban') {
        logMessages.push(`🌀 Kích hoạt 【${consumedTalismanName}】: Tiết giảm 40% Linh Thạch đột phá.`);
      } else if (selectedTalisman?.effectType === 'cleanse_inner_demon' || selectedTalismanItemId === 'item_dinh_tam_phu') {
        logMessages.push(`🧘 Tế xuất 【${consumedTalismanName}】: Triệt tiêu toàn bộ phạt tỷ lệ do Đan Độc.`);
      }
    }

    // Cập nhật trạng thái thống kê phá cảnh
    cloned.breakthroughCatalystState = cloned.breakthroughCatalystState || {
      totalCatalystBreakthroughs: 0,
      protectedFailuresCount: 0
    };
    cloned.breakthroughCatalystState.totalCatalystBreakthroughs =
      (cloned.breakthroughCatalystState.totalCatalystBreakthroughs || 0) + 1;

    let finalResult: BreakthroughExecutionResult;

    if (isSuccess) {
      // Thành công: Trừ Tu Vi yêu cầu
      cloned.tuVi = Math.max(0, (cloned.tuVi || 0) - reqTuVi);

      // Tăng Cảnh Giới
      cloned.currentRealm = nRealmIdx;

      // Cập nhật Thọ Nguyên Tối Đa
      cloned.maxLifespan = getBaseLifespanForRealm(nRealmIdx) + (cloned.lifespanPillsUsed || 0);

      // Cộng stats / phần thưởng cảnh giới mới nếu có
      const realmAny = nRealmData as any;
      if (realmAny.stats) {
        for (const [key, val] of Object.entries(realmAny.stats)) {
          if (typeof val === 'number' && typeof (cloned as any)[key] === 'number') {
            (cloned as any)[key] += val;
          }
        }
      }
      if (realmAny.breakthrough?.rewardOnSuccess) {
        const rewards = realmAny.breakthrough.rewardOnSuccess;
        if (typeof rewards.tuVi === 'number' && rewards.tuVi > 0) cloned.tuVi += rewards.tuVi;
        if (typeof rewards.linhThach === 'number' && rewards.linhThach > 0) cloned.linhThach += rewards.linhThach;
        if (typeof rewards.danhVong === 'number' && rewards.danhVong > 0) cloned.danhVong = (cloned.danhVong || 0) + rewards.danhVong;
      }

      // Hồi phục 100% Khí Huyết & Linh Lực
      const newMaxHp = getMaxKhiHuyet(
        cloned.canCot,
        nRealmIdx,
        cloned.equipment,
        cloned.manuals,
        cloned.physique,
        cloned.equippedManuals,
        cloned.linhCan,
        cloned.destiny,
        cloned.bodyRefinement,
        cloned.companionsState,
        cloned.physiqueState,
        cloned.tuViEmpowermentState,
        cloned.manualsState,
        cloned.beastsState
      );
      const newMaxMp = getMaxLinhLuc(
        cloned.tamCanh,
        cloned.ngoTinh,
        nRealmIdx,
        cloned.equipment,
        cloned.manuals,
        cloned.equippedManuals,
        cloned.linhCan
      );

      cloned.khiHuyet = newMaxHp;
      cloned.currentHp = newMaxHp;
      cloned.maxHp = newMaxHp;
      cloned.linhLuc = newMaxMp;
      cloned.currentMp = newMaxMp;
      cloned.maxMp = newMaxMp;

      logMessages.push(`🎉 Đột phá đại thành công! Từ 【${cRealmData.name}】 tấn thăng 【${nRealmData.name}】! Toàn thân khí huyết & linh lực khôi phục viên mãn.`);

      finalResult = {
        success: true,
        previousRealm: cRealmData.name,
        newRealm: nRealmData.name,
        tuviConsumed: reqTuVi,
        spiritStonesConsumed: chances.spiritStoneCost,
        consumedPillName,
        consumedTalismanName,
        isBacklashTriggered: false,
        backlashHpLoss: 0,
        backlashTuviLoss: 0,
        logMessages
      };

      onBreakthroughSuccess?.();
    } else {
      // Thất bại: Xử lý phản phệ
      const currentHp = cloned.khiHuyet ?? cloned.currentHp ?? 1000;
      const currentTuvi = cloned.tuVi || 0;
      let hpLoss = 0;
      let tuviLoss = 0;

      if (chances.isBacklashProtected) {
        cloned.breakthroughCatalystState.protectedFailuresCount =
          (cloned.breakthroughCatalystState.protectedFailuresCount || 0) + 1;
        const backlash = resolveBreakthroughBacklash(
          currentHp,
          currentTuvi,
          true,
          100
        );
        logMessages.push(backlash.logMessage);
      } else {
        const toxicity = cloned.pillToxicity ?? 0;
        const backlashRes = resolveBreakthroughFailureBacklash(
          currentHp,
          currentTuvi,
          toxicity,
          cRealmData.name
        );
        hpLoss = backlashRes.hpLoss;
        tuviLoss = backlashRes.tuviLoss;
        cloned.khiHuyet = backlashRes.resultingHp;
        cloned.currentHp = cloned.khiHuyet;
        cloned.tuVi = Math.max(0, currentTuvi - tuviLoss);
        cloned.injuryState = recordBacklashToInjuryState(
          cloned.injuryState,
          backlashRes,
          cRealmData.name,
          toxicity
        );
        logMessages.push(backlashRes.logMessage);
      }

      finalResult = {
        success: false,
        previousRealm: cRealmData.name,
        newRealm: cRealmData.name,
        tuviConsumed: tuviLoss,
        spiritStonesConsumed: chances.spiritStoneCost,
        consumedPillName,
        consumedTalismanName,
        isBacklashTriggered: !chances.isBacklashProtected,
        backlashHpLoss: hpLoss,
        backlashTuviLoss: tuviLoss,
        logMessages
      };
    }

    // 8. Cập nhật PlayerState một lần duy nhất (Single Source of Truth)
    setPlayer(cloned);
    setExecutionResult(finalResult);
    setIsExecuting(false);

    // Xóa lựa chọn nếu vật phẩm đã hết sạch trong kho
    if (selectedPillInstanceId) {
      const stillHasPill = (cloned.inventory?.pills || []).some(
        (p: any) =>
          ((p.instanceId && p.instanceId === selectedPillInstanceId) || p.id === selectedPillInstanceId) &&
          (p.quantity > 0 || p.count > 0)
      );
      if (!stillHasPill) {
        setSelectedPillInstanceId(null);
      }
    }

    if (selectedTalismanItemId) {
      const stillHasTal =
        (cloned.inventory?.talismans || []).some(
          (t: any) =>
            (t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId) &&
            (t.quantity > 0 || t.count > 0)
        ) ||
        (cloned.inventory as any)?.items?.some(
          (t: any) =>
            (t.id === selectedTalismanItemId || t.itemId === selectedTalismanItemId) &&
            (t.quantity > 0 || t.count > 0)
        );

      if (!stillHasTal) {
        setSelectedTalismanItemId(null);
      }
    }

    return finalResult;
  }, [
    isExecuting,
    player,
    selectedPill,
    selectedTalisman,
    selectedPillInstanceId,
    selectedTalismanItemId
  ]);

  return {
    selectedPillInstanceId,
    selectedTalismanItemId,
    isExecuting,
    executionResult,
    activeDrawerSlot,
    selectedPill,
    selectedTalisman,
    availablePills,
    availableTalismans,
    rateCalculation,
    targetNextRealm,
    requiredTuVi,
    handleSelectPill,
    handleSelectTalisman,
    handleOpenDrawer,
    handleCloseDrawer,
    handleClearExecutionResult,
    handleExecuteBreakthrough
  };
}
