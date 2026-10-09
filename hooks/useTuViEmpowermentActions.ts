'use client';
// hooks/useTuViEmpowermentActions.ts
// Custom domain hook điều phối Vạn Năng Tu Vi: Quán Đỉnh Đạo Lữ, Khai Thông Bát Mạch, Ngưng Đan & Nhiên Tu Vi

import React, { useState, useCallback, useMemo } from 'react';
import type { PlayerStats } from '@/lib/types/player';
import type {
  MeridianType,
  MeridianDefinition,
  AcupointNode,
  TuViEmpowermentState,
  MeridianCalculatedBonuses,
} from '@/lib/types/tu-vi-empowerment';
import {
  createDefaultTuViEmpowermentState,
  calculateMeridianCombatBonuses,
  unlockAcupoint,
  canUnlockAcupoint,
  infuseTuViToCompanion,
  crystallizeTuVi,
  triggerTuViCombatOverdrive,
  activateBreakthroughCatalyst,
} from '@/lib/tu-vi-empowerment-logic';

import { MERIDIANS_CONFIG, ACUPOINTS_MAP, TU_VI_CRYSTALLIZE_RECIPES } from '@/lib/tu-vi-empowerment-data';

export interface UseTuViEmpowermentActionsReturn {
  tuViState: TuViEmpowermentState;
  meridianBonuses: MeridianCalculatedBonuses;
  selectedMeridianId: MeridianType;
  setSelectedMeridianId: (id: MeridianType) => void;
  selectedAcupointId: string;
  setSelectedAcupointId: (id: string) => void;
  activeMeridian: MeridianDefinition;
  activeAcupoint: AcupointNode;
  canUnlockActiveAcupoint: boolean;
  unlockFailureReason?: string;
  activeAcupointUnlockable: { canUnlock: boolean; reason?: string };
  isProcessing: boolean;
  handleUnlockAcupoint: (acupointId: string) => { success: boolean; message: string; [key: string]: any } | void;
  handleCrystallize: (recipeId: string) => { success: boolean; message: string; [key: string]: any } | void;
  handleInfuseCompanion: (companionId: string, amount: number) => { success: boolean; message: string; [key: string]: any } | void;
  handleTriggerOverdrive: () => { success: boolean; message: string; [key: string]: any } | void;
  handleBreakthroughCatalyst: () => { success: boolean; message: string; [key: string]: any } | void;
  meridiansList: MeridianDefinition[];
  recipesList: typeof TU_VI_CRYSTALLIZE_RECIPES;
}

export interface UseTuViEmpowermentActionsProps {
  player: PlayerStats;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>> | ((p: PlayerStats) => void) | ((updater: (prev: PlayerStats) => PlayerStats) => void);
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: any) => void;
}

export function useTuViEmpowermentActions(
  player: PlayerStats,
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>> | ((p: PlayerStats) => void) | ((updater: (prev: PlayerStats) => PlayerStats) => void)
): UseTuViEmpowermentActionsReturn;

export function useTuViEmpowermentActions(
  props: UseTuViEmpowermentActionsProps
): UseTuViEmpowermentActionsReturn;

export function useTuViEmpowermentActions(
  playerOrProps: PlayerStats | UseTuViEmpowermentActionsProps,
  maybeSetPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>> | ((p: PlayerStats) => void) | ((updater: (prev: PlayerStats) => PlayerStats) => void)
): UseTuViEmpowermentActionsReturn {
  // Trích xuất an toàn dù gọi theo kiểu 2 params (player, setPlayer) hay object props
  let player: PlayerStats;
  let rawSetPlayer: React.Dispatch<React.SetStateAction<PlayerStats>> | ((p: PlayerStats) => void) | ((updater: (prev: PlayerStats) => PlayerStats) => void) | undefined;
  let showToast: ((msg: string) => void) | undefined;
  let addLog: ((title: string, content: string, type: any) => void) | undefined;

  if (playerOrProps && typeof playerOrProps === 'object' && 'tuVi' in playerOrProps) {
    player = playerOrProps as PlayerStats;
    rawSetPlayer = maybeSetPlayer;
  } else {
    const props = (playerOrProps || {}) as UseTuViEmpowermentActionsProps;
    player = props.player;
    rawSetPlayer = props.setPlayer;
    showToast = props.showToast;
    addLog = props.addLog;
  }

  const [selectedMeridianId, setSelectedMeridianId] = useState<MeridianType>('nham_mach');
  const [selectedAcupointId, setSelectedAcupointId] = useState<string>('nham_dan_trung');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // State Bát Mạch an toàn tuyệt đối
  const tuViState: TuViEmpowermentState = useMemo(() => {
    return player?.tuViEmpowermentState || createDefaultTuViEmpowermentState();
  }, [player?.tuViEmpowermentState]);

  // Tổng hợp chỉ số chiến đấu từ kinh mạch
  const meridianBonuses: MeridianCalculatedBonuses = useMemo(() => {
    return calculateMeridianCombatBonuses(tuViState);
  }, [tuViState]);

  // Kinh mạch đang chọn
  const activeMeridian: MeridianDefinition = useMemo(() => {
    return MERIDIANS_CONFIG.find(m => m.id === selectedMeridianId) || MERIDIANS_CONFIG[0];
  }, [selectedMeridianId]);

  // Huyệt vị đang chọn
  const activeAcupoint: AcupointNode = useMemo(() => {
    return ACUPOINTS_MAP[selectedAcupointId] || activeMeridian.acupoints[0] || MERIDIANS_CONFIG[0].acupoints[0];
  }, [selectedAcupointId, activeMeridian]);

  // Kiểm tra có thể đả thông huyệt đang chọn
  const activeAcupointUnlockable = useMemo(() => {
    if (!player || !activeAcupoint) return { canUnlock: false, reason: 'Chưa chọn khiếu huyệt' };
    return canUnlockAcupoint(player, activeAcupoint.id);
  }, [player, activeAcupoint]);

  const canUnlockActiveAcupoint = activeAcupointUnlockable.canUnlock;
  const unlockFailureReason = activeAcupointUnlockable.reason;

  // Safe state updater
  const updatePlayer = useCallback((updater: (prev: PlayerStats) => PlayerStats) => {
    if (!rawSetPlayer) return;
    try {
      (rawSetPlayer as any)(updater);
    } catch {
      if (player) {
        const next = updater(player);
        (rawSetPlayer as any)(next);
      }
    }
  }, [rawSetPlayer, player]);

  // ─── 1. Đả Thông Khiếu Huyệt ───────────────────────────────────────────────
  const handleUnlockAcupoint = useCallback((acupointId: string) => {
    if (!player || !rawSetPlayer) return { success: false, message: 'Lỗi đồng bộ nhân vật' };
    setIsProcessing(true);

    try {
      const result = unlockAcupoint(player, acupointId);
      if (!result.success) {
        showToast?.(result.message);
        return result;
      }

      updatePlayer(prev => {
        const update = unlockAcupoint(prev, acupointId);
        return update.success ? update.updatedPlayer : prev;
      });

      showToast?.(result.message);
      addLog?.(
        'Đả Thông Khiếu Huyệt',
        result.message + (result.isMeridianCompleted ? ' Đại Chu Thiên Dị Tượng thức tỉnh!' : ''),
        'success'
      );
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [player, rawSetPlayer, updatePlayer, showToast, addLog]);

  // ─── 2. Quán Đỉnh Cho Đạo Lữ ──────────────────────────────────────────────
  const handleInfuseCompanion = useCallback((companionId: string, tuViAmount: number) => {
    if (!player || !rawSetPlayer) return { success: false, message: 'Lỗi đồng bộ nhân vật' };
    setIsProcessing(true);

    try {
      const result = infuseTuViToCompanion(player, companionId, tuViAmount);
      if (!result.success) {
        showToast?.(result.message);
        return result;
      }

      updatePlayer(prev => {
        const update = infuseTuViToCompanion(prev, companionId, tuViAmount);
        return update.success ? update.updatedPlayer : prev;
      });

      showToast?.(result.message);
      addLog?.(
        'Quán Đỉnh Đạo Lữ',
        result.message + (result.brokeThrough ? ' Đạo Lữ đã đột phá cảnh giới mới!' : ''),
        'success'
      );
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [player, rawSetPlayer, updatePlayer, showToast, addLog]);

  // ─── 3. Ngưng Kết Tu Vi Chân Đan ──────────────────────────────────────────
  const handleCrystallize = useCallback((recipeId: string) => {
    if (!player || !rawSetPlayer) return { success: false, message: 'Lỗi đồng bộ nhân vật' };
    setIsProcessing(true);

    try {
      const result = crystallizeTuVi(player, recipeId);
      if (!result.success) {
        showToast?.(result.message);
        return result;
      }

      updatePlayer(prev => {
        const update = crystallizeTuVi(prev, recipeId);
        return update.success ? update.updatedPlayer : prev;
      });

      showToast?.(result.message);
      addLog?.(
        'Ngưng Đan Chân Nguyên',
        result.message,
        'success'
      );
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [player, rawSetPlayer, updatePlayer, showToast, addLog]);

  // ─── 4. Kích Hoạt Nhiên Tu Vi Overdrive ───────────────────────────────────
  const handleTriggerOverdrive = useCallback(() => {
    if (!player || !rawSetPlayer) return { success: false, message: 'Lỗi đồng bộ nhân vật' };
    setIsProcessing(true);

    try {
      const result = triggerTuViCombatOverdrive(player);
      if (!result.success) {
        showToast?.(result.message);
        return result;
      }

      updatePlayer(prev => {
        const update = triggerTuViCombatOverdrive(prev);
        return update.success ? update.updatedPlayer : prev;
      });

      showToast?.(result.message);
      addLog?.(
        'Nhiên Huyết Bí Thuật',
        result.message,
        'combat'
      );
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [player, rawSetPlayer, updatePlayer, showToast, addLog]);

  // ─── 5. Nhiên Thần Đột Phá ────────────────────────────────────────────────
  const handleBreakthroughCatalyst = useCallback(() => {
    if (!player || !rawSetPlayer) return { success: false, message: 'Lỗi đồng bộ nhân vật' };
    setIsProcessing(true);

    try {
      const result = activateBreakthroughCatalyst(player);
      if (!result.success) {
        showToast?.(result.message);
        return result;
      }

      updatePlayer(prev => {
        const update = activateBreakthroughCatalyst(prev);
        return update.success ? update.updatedPlayer : prev;
      });

      showToast?.(result.message);
      addLog?.(
        'Nhiên Thần Đột Phá',
        result.message,
        'breakthrough'
      );
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, [player, rawSetPlayer, updatePlayer, showToast, addLog]);

  return {
    tuViState,
    meridianBonuses,
    selectedMeridianId,
    setSelectedMeridianId,
    selectedAcupointId,
    setSelectedAcupointId,
    activeMeridian,
    activeAcupoint,
    canUnlockActiveAcupoint,
    unlockFailureReason,
    activeAcupointUnlockable,
    isProcessing,
    // Actions
    handleUnlockAcupoint,
    handleInfuseCompanion,
    handleCrystallize,
    handleTriggerOverdrive,
    handleBreakthroughCatalyst,
    // Configurations
    meridiansList: MERIDIANS_CONFIG,
    recipesList: TU_VI_CRYSTALLIZE_RECIPES,
  };
}
