// hooks/useDaoFoundationActions.ts
// Custom Hook điều phối các thao tác ngưng tụ Đạo Cơ (Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa)
// 100% Strict TypeScript, Immutable State, Atomic Updates, Pure Functions

import { useState, useMemo, useCallback } from 'react';
import { PlayerState } from '@/lib/types/player';
import { Realm } from '@/lib/types';
import {
  DaoFoundationGrade,
  DaoFoundationConfig,
  MajorRealmTransitionConfig,
  FoundationValidationResult,
  InnateTalentDefinition
} from '@/lib/types/dao-foundation';
import {
  checkIsMajorRealmTransition,
  canAttemptFoundationGrade,
  calculateFoundationStatBonuses
} from '@/lib/dao-foundation-logic';
import {
  calculateEffectiveRequiredTuVi,
  calculateBreakthroughRewards
} from '@/lib/game-constants';
import { getMaxKhiHuyet, getMaxLinhLuc } from '@/lib/game-logic/stats';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as Realm[];

export interface DaoFoundationCinematicData {
  talent: InnateTalentDefinition;
  phenomenonName: string;
  phenomenonDesc: string;
}

export interface UseDaoFoundationActionsProps {
  player?: PlayerState | null;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerState>> | ((p: PlayerState) => void);
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type?: any) => void;
}

export interface UseDaoFoundationActionsReturn {
  // 1. Hook State
  selectedGrade: DaoFoundationGrade;
  isTranscendenceModalOpen: boolean;
  isCinematicOpen: boolean;
  cinematicData: DaoFoundationCinematicData | null;
  isExecuting: boolean;
  lastActionMessage: string | null;

  // 2. Derived & Memoized State
  activeTransition: MajorRealmTransitionConfig | null;
  isMajorTransition: boolean;
  validationMap: Record<DaoFoundationGrade, FoundationValidationResult>;
  currentGradeConfig: DaoFoundationConfig | null;

  // 3. Actions
  handleSelectGrade: (grade: DaoFoundationGrade) => void;
  openTranscendenceModal: () => void;
  closeTranscendenceModal: () => void;
  closeCinematic: () => void;
  handleExecuteMajorBreakthrough: (
    player?: PlayerState,
    setPlayer?: (p: PlayerState) => void,
    onComplete?: () => void
  ) => Promise<boolean> | boolean;
  clearActionMessage: () => void;
}

/**
 * Helper khấu trừ đan dược/vật phẩm bảo chứng ngưng tụ đạo cơ (Immutable copy)
 */
export function deductPillForFoundation(
  inventory: any,
  requiredPillItemId: string,
  requireNineVeins: boolean
): { updatedInventory: any; deducted: boolean } {
  if (!inventory) return { updatedInventory: inventory, deducted: false };
  const cloned = Array.isArray(inventory) ? [...inventory] : { ...inventory };

  // Các danh mục có thể chứa đan dược bảo chứng
  const listKeys = Array.isArray(cloned) ? [null] : ['pills', 'items', 'talismans'];

  for (const key of listKeys) {
    const list: any[] = key === null ? (cloned as any[]) : cloned[key];
    if (!Array.isArray(list)) continue;

    const idx = list.findIndex((item: any) => {
      if (!item) return false;
      const itemId = item.id || item.itemId || '';
      const qty = item.quantity ?? item.count ?? 0;
      if (qty <= 0) return false;

      const matchId = itemId === requiredPillItemId || itemId.includes(requiredPillItemId);
      if (!matchId) return false;

      if (requireNineVeins) {
        const veins = item.veinMetadata?.veinCount ?? item.veinCount ?? 0;
        return veins === 9;
      }
      return true;
    });

    if (idx !== -1) {
      const updatedList = [...list];
      const target = updatedList[idx];
      const curQty = target.quantity ?? target.count ?? 1;
      if (curQty <= 1) {
        updatedList.splice(idx, 1);
      } else {
        updatedList[idx] = { ...target, quantity: curQty - 1, count: curQty - 1 };
      }

      if (key === null) {
        return { updatedInventory: updatedList, deducted: true };
      } else {
        cloned[key] = updatedList;
        return { updatedInventory: cloned, deducted: true };
      }
    }
  }

  return { updatedInventory: inventory, deducted: false };
}

export function useDaoFoundationActions(
  propsOrPlayer?: UseDaoFoundationActionsProps | PlayerState | null,
  setPlayerFn?: (p: PlayerState) => void
): UseDaoFoundationActionsReturn {
  // Chuẩn hóa props
  const isDirectPlayer = Boolean(propsOrPlayer && ('currentRealm' in propsOrPlayer || 'tuVi' in propsOrPlayer));

  const activePlayer = isDirectPlayer
    ? (propsOrPlayer as PlayerState)
    : (propsOrPlayer as UseDaoFoundationActionsProps)?.player ?? null;

  const activeSetPlayer = isDirectPlayer
    ? setPlayerFn
    : (propsOrPlayer as UseDaoFoundationActionsProps)?.setPlayer;

  const showToast = isDirectPlayer ? undefined : (propsOrPlayer as UseDaoFoundationActionsProps)?.showToast;
  const addLog = isDirectPlayer ? undefined : (propsOrPlayer as UseDaoFoundationActionsProps)?.addLog;

  // 1. Hook State
  const [selectedGrade, setSelectedGrade] = useState<DaoFoundationGrade>('ha_pham');
  const [isTranscendenceModalOpen, setIsTranscendenceModalOpen] = useState<boolean>(false);
  const [isCinematicOpen, setIsCinematicOpen] = useState<boolean>(false);
  const [cinematicData, setCinematicData] = useState<DaoFoundationCinematicData | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  // 2. Derived & Memoized State
  const activeTransition: MajorRealmTransitionConfig | null = useMemo(() => {
    if (!activePlayer) return null;
    const currentIdx = Math.max(0, parseInt(String(activePlayer.currentRealm ?? 0), 10) || 0);
    const nextIdx = currentIdx + 1;
    return checkIsMajorRealmTransition(currentIdx, nextIdx);
  }, [activePlayer?.currentRealm]);

  const isMajorTransition = Boolean(activeTransition);

  const currentGradeConfig: DaoFoundationConfig | null = useMemo(() => {
    if (!activeTransition) return null;
    return activeTransition.foundations?.[selectedGrade] || null;
  }, [activeTransition, selectedGrade]);

  const validationMap: Record<DaoFoundationGrade, FoundationValidationResult> = useMemo(() => {
    const defaultFail: FoundationValidationResult = {
      canAttempt: false,
      reasons: ['Chưa xác định được mốc chuyển giao Đại Cảnh Giới!'],
      missingItems: []
    };

    if (!activeTransition || !activePlayer) {
      return {
        ha_pham: defaultFail,
        dia_pham: defaultFail,
        thien_dao: defaultFail
      };
    }

    return {
      ha_pham: canAttemptFoundationGrade(activePlayer, activeTransition, 'ha_pham'),
      dia_pham: canAttemptFoundationGrade(activePlayer, activeTransition, 'dia_pham'),
      thien_dao: canAttemptFoundationGrade(activePlayer, activeTransition, 'thien_dao')
    };
  }, [activePlayer, activeTransition]);

  // 3. Actions
  const handleSelectGrade = useCallback((grade: DaoFoundationGrade) => {
    setSelectedGrade(grade);
  }, []);

  const openTranscendenceModal = useCallback(() => {
    setIsTranscendenceModalOpen(true);
  }, []);

  const closeTranscendenceModal = useCallback(() => {
    setIsTranscendenceModalOpen(false);
  }, []);

  const closeCinematic = useCallback(() => {
    setIsCinematicOpen(false);
    setCinematicData(null);
  }, []);

  const clearActionMessage = useCallback(() => {
    setLastActionMessage(null);
  }, []);

  /**
   * Thực thi ngưng tụ Đạo Cơ & Đột phá Đại Cảnh Giới (Atomic & Immutable)
   */
  const handleExecuteMajorBreakthrough = useCallback(
    (
      overridePlayer?: PlayerState,
      overrideSetPlayer?: (p: PlayerState) => void,
      onComplete?: () => void
    ): boolean => {
      if (isExecuting) return false;

      const targetPlayer = overridePlayer || activePlayer;
      const targetSetPlayer = overrideSetPlayer || activeSetPlayer;

      if (!targetPlayer || !targetSetPlayer) {
        const msg = 'Không tìm thấy dữ liệu nhân vật để thực thi ngưng tụ Đạo Cơ!';
        setLastActionMessage(msg);
        showToast?.(msg);
        return false;
      }

      setIsExecuting(true);

      try {
        const currentIdx = Math.max(0, parseInt(String(targetPlayer.currentRealm ?? 0), 10) || 0);
        const nextIdx = currentIdx + 1;
        const transition = activeTransition || checkIsMajorRealmTransition(currentIdx, nextIdx);

        if (!transition) {
          const msg = 'Cảnh giới hiện tại không phải là mốc chuyển giao Đại Cảnh Giới!';
          setLastActionMessage(msg);
          showToast?.(msg);
          return false;
        }

        // 1. Atomic Validation: Thẩm định lại điều kiện của selectedGrade
        const validation = canAttemptFoundationGrade(targetPlayer, transition, selectedGrade);
        if (!validation.canAttempt) {
          const reasonStr = validation.reasons.join('\n') || 'Chưa thỏa mãn điều kiện ngưng tụ Đạo Cơ!';
          setLastActionMessage(reasonStr);
          showToast?.(validation.reasons[0] || reasonStr);
          addLog?.('Đạo Cơ Trở Ngại', reasonStr, 'danger');
          return false;
        }

        const gradeConfig = transition.foundations?.[selectedGrade];
        if (!gradeConfig) {
          const msg = 'Cấu hình phẩm vị Đạo Cơ không hợp lệ!';
          setLastActionMessage(msg);
          showToast?.(msg);
          return false;
        }

        // 2. Tính toán chi phí tiêu hao (Tu Vi & Linh Thạch)
        const targetRealmId = Number(transition.toRealmId);
        const targetRealm = realmsData[targetRealmId];
        const baseTuViCost = targetRealm ? calculateEffectiveRequiredTuVi(targetPlayer, targetRealm) : 0;
        const baseStoneCost = targetRealm?.requirements?.linhThach || 0;

        const totalTuViCost = baseTuViCost + (gradeConfig.extraTuviCost || 0);
        const totalStoneCost = baseStoneCost + (gradeConfig.extraSpiritStonesCost || 0);

        if (targetPlayer.tuVi < totalTuViCost) {
          const msg = `Tu Vi không đủ! Cần ${totalTuViCost.toLocaleString()} Tu Vi (Hiện có: ${targetPlayer.tuVi.toLocaleString()}).`;
          setLastActionMessage(msg);
          showToast?.(msg);
          return false;
        }

        if (targetPlayer.linhThach < totalStoneCost) {
          const msg = `Hạ Phẩm Linh Thạch không đủ! Cần ${totalStoneCost.toLocaleString()} Linh Thạch (Hiện có: ${targetPlayer.linhThach.toLocaleString()}).`;
          setLastActionMessage(msg);
          showToast?.(msg);
          return false;
        }

        // 3. Khấu trừ vật phẩm đan dược bảo chứng từ kho đồ
        let finalInventory = targetPlayer.inventory;
        if (gradeConfig.requiredPillItemId) {
          const { updatedInventory, deducted } = deductPillForFoundation(
            targetPlayer.inventory,
            gradeConfig.requiredPillItemId,
            Boolean(gradeConfig.requireNineVeinsPill)
          );

          if (!deducted) {
            const pillName = gradeConfig.requiredPillName || gradeConfig.requiredPillItemId;
            const msg = `Không tìm thấy đan dược [${pillName}]${gradeConfig.requireNineVeinsPill ? ' (9 Đan Văn)' : ''} phù hợp trong túi trữ vật!`;
            setLastActionMessage(msg);
            showToast?.(msg);
            return false;
          }
          finalInventory = updatedInventory;
        }

        // 4. Khởi tạo bản clone bất biến của PlayerState
        const cloned: PlayerState = JSON.parse(JSON.stringify(targetPlayer));
        cloned.inventory = finalInventory;

        // Khấu trừ tài nguyên
        cloned.tuVi = Math.max(0, cloned.tuVi - totalTuViCost);
        cloned.linhThach = Math.max(0, cloned.linhThach - totalStoneCost);
        if (typeof cloned.spiritStones === 'number') {
          cloned.spiritStones = cloned.linhThach;
        }

        // Nâng cấp cảnh giới nhân vật lên đại cảnh giới mới
        cloned.currentRealm = targetRealmId;

        // Ghi nhận phẩm vị Đạo Cơ
        cloned.daoFoundations = cloned.daoFoundations ? { ...cloned.daoFoundations } : {};
        cloned.daoFoundations[transition.transitionId] = selectedGrade;

        // Mở khóa Thiên Phú Ẩn nếu có
        if (gradeConfig.innateTalent) {
          const talentId = gradeConfig.innateTalent.id;
          const currentTalents = Array.isArray(cloned.unlockedInnateTalents)
            ? [...cloned.unlockedInnateTalents]
            : [];
          if (!currentTalents.includes(talentId)) {
            currentTalents.push(talentId);
          }
          cloned.unlockedInnateTalents = currentTalents;
        }

        // Áp dụng phần thưởng cảnh giới kèm hệ số nhân phẩm vị (statMultiplier)
        const baseBreakthroughRewards = targetRealm?.breakthrough?.rewardOnSuccess || calculateBreakthroughRewards(targetRealmId);
        const scaledRewards = calculateFoundationStatBonuses(baseBreakthroughRewards, gradeConfig);
        if (scaledRewards.tuVi) cloned.tuVi += scaledRewards.tuVi;
        if (scaledRewards.linhThach) {
          cloned.linhThach += scaledRewards.linhThach;
          if (typeof cloned.spiritStones === 'number') cloned.spiritStones = cloned.linhThach;
        }
        if (scaledRewards.danhVong) {
          cloned.danhVong = (cloned.danhVong || 0) + scaledRewards.danhVong;
        }

        // Hồi phục 100% HP và MP của nhân vật
        const maxHp = getMaxKhiHuyet(
          cloned.canCot,
          cloned.currentRealm,
          cloned.equipment,
          cloned.manuals,
          cloned.physiques || cloned.physique,
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
        const maxMp = getMaxLinhLuc(
          cloned.tamCanh,
          cloned.ngoTinh,
          cloned.currentRealm,
          cloned.equipment,
          cloned.manuals,
          cloned.equippedManuals,
          cloned.linhCan
        );
        cloned.khiHuyet = maxHp;
        cloned.maxHp = maxHp;
        cloned.linhLuc = maxMp;
        cloned.maxLinhLuc = maxMp;

        // Chữa lành thương thế kinh mạch khi đột phá thành công
        if (cloned.injuryState) {
          cloned.injuryState = {
            ...cloned.injuryState,
            isInjured: false,
            injurySeverity: 0
          };
        }

        // Cập nhật PlayerState trong 1 lần setPlayer duy nhất
        targetSetPlayer(cloned);

        // Kích hoạt Dị Tượng Thiên Địa nếu chọn Thiên Đạo Đạo Cơ
        if (selectedGrade === 'thien_dao' && gradeConfig.innateTalent) {
          setCinematicData({
            talent: gradeConfig.innateTalent,
            phenomenonName: gradeConfig.phenomenonName || 'Dị Tượng Thiên Địa',
            phenomenonDesc: gradeConfig.phenomenonDescription || 'Thiên địa cộng minh, vạn đạo triều bái!'
          });
          setIsCinematicOpen(true);
        }

        // Đóng modal lựa chọn đạo cơ
        setIsTranscendenceModalOpen(false);

        const gradeTitle = selectedGrade === 'thien_dao' ? 'Thiên Đạo' : selectedGrade === 'dia_pham' ? 'Địa Phẩm' : 'Hạ Phẩm';
        const successMsg = `Đột phá đại cảnh giới thành công! Ngưng tụ [${gradeConfig.title}] (${gradeTitle}) uy chấn bát hoang!`;
        setLastActionMessage(successMsg);
        showToast?.(successMsg);
        addLog?.(
          `Đột Phá ${gradeConfig.title}`,
          `${successMsg}${gradeConfig.phenomenonDescription ? `\n✨ Dị tượng: ${gradeConfig.phenomenonDescription}` : ''}`,
          'breakthrough'
        );

        onComplete?.();
        return true;
      } catch (err: any) {
        const errorMsg = `Lỗi hệ thống khi ngưng tụ Đạo Cơ: ${err?.message || err}`;
        setLastActionMessage(errorMsg);
        showToast?.(errorMsg);
        return false;
      } finally {
        setIsExecuting(false);
      }
    },
    [
      isExecuting,
      activePlayer,
      activeSetPlayer,
      activeTransition,
      selectedGrade,
      showToast,
      addLog
    ]
  );

  return {
    // 1. Hook State
    selectedGrade,
    isTranscendenceModalOpen,
    isCinematicOpen,
    cinematicData,
    isExecuting,
    lastActionMessage,

    // 2. Derived & Memoized State
    activeTransition,
    isMajorTransition,
    validationMap,
    currentGradeConfig,

    // 3. Actions
    handleSelectGrade,
    openTranscendenceModal,
    closeTranscendenceModal,
    closeCinematic,
    handleExecuteMajorBreakthrough,
    clearActionMessage
  };
}
