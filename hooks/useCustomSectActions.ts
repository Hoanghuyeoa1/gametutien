// hooks/useCustomSectActions.ts
// Custom Domain Hook điều phối toàn bộ phân hệ "Khai Tông Lập Phái & Chân Truyền Đệ Tử"

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  CustomSectState,
  ProceduralDisciple,
  DiscipleRank,
  DiscipleTaskType,
  SectDoctrine
} from '@/lib/types/custom-sect';
import {
  createDefaultCustomSectState,
  foundCustomSect,
  generateProceduralCandidate,
  calculateSectVaultYield,
  harvestSectVault,
  recruitCandidate,
  promoteDisciple,
  dismissDisciple,
  assignDiscipleTask,
  setChosenInheritor,
  upgradeSectFacility,
  trainDiscipleWithTuVi
} from '@/lib/custom-sect-logic';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';

interface UseCustomSectActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  playSfx?: (name: any) => void;
}

export function useCustomSectActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx
}: UseCustomSectActionsParams) {
  const [localNow, setLocalNow] = useState<number>(Date.now());
  const [candidates, setCandidates] = useState<ProceduralDisciple[]>([]);

  // Tự động làm mới thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setLocalNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sectState: CustomSectState = useMemo(() => {
    return player.customSectState || createDefaultCustomSectState();
  }, [player.customSectState]);

  // Sinh 3 ứng viên bái sư ban đầu nếu chưa có
  useEffect(() => {
    if (sectState.isFounded && candidates.length === 0) {
      setCandidates([
        generateProceduralCandidate(sectState.reputation, sectState.doctrine),
        generateProceduralCandidate(sectState.reputation, sectState.doctrine),
        generateProceduralCandidate(sectState.reputation, sectState.doctrine)
      ]);
    }
  }, [sectState.isFounded, sectState.reputation, sectState.doctrine, candidates.length]);

  // Tính toán sản lượng Khố Phòng hiện tại
  const vaultYield = useMemo(() => {
    return calculateSectVaultYield(sectState, localNow);
  }, [sectState, localNow]);

  const saveUpdatedPlayer = useCallback((updated: PlayerStats) => {
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (err) {
      console.error('Lỗi lưu trữ môn phái:', err);
    }
  }, [setPlayer]);

  // 1. Khai Sơn Lập Phái
  const handleFoundSect = (sectName: string, mountainName: string, doctrine: SectDoctrine) => {
    const res = foundCustomSect(player, sectName, mountainName, doctrine);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Khai Sơn Lập Phái', res.message, 'sect');
      showToast(res.message);
      playSfx?.('breakthrough');
    } else {
      showToast(res.message);
    }
  };

  // 2. Thu Hoạch Khố Phòng
  const handleHarvestVault = () => {
    const res = harvestSectVault(player, Date.now());
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Khố Phòng Tông Môn', res.message, 'sect');
      showToast(res.message);
      playSfx?.('coin');
    } else {
      showToast(res.message);
    }
  };

  // 3. Chiêu Mộ Đệ Tử
  const handleRecruitDisciple = (candidate: ProceduralDisciple) => {
    const res = recruitCandidate(player, candidate);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      setCandidates(prev => prev.filter(c => c.id !== candidate.id));
      addLog('Đệ Tử Bái Sư', res.message, 'sect');
      showToast(res.message);
      playSfx?.('bell');
    } else {
      showToast(res.message);
    }
  };

  // 4. Mở Đại Điển Khai Môn (Làm mới ứng viên)
  const handleRefreshCandidates = () => {
    const COST = 5000;
    if ((player.linhThach || 0) < COST) {
      showToast(`Không đủ Linh Thạch! Cần ${COST.toLocaleString()} Linh Thạch mở Đại Điển Khai Môn.`);
      return;
    }

    const updated = {
      ...player,
      linhThach: player.linhThach - COST
    };
    saveUpdatedPlayer(updated);

    const newCandidates = [
      generateProceduralCandidate(sectState.reputation, sectState.doctrine),
      generateProceduralCandidate(sectState.reputation, sectState.doctrine),
      generateProceduralCandidate(sectState.reputation, sectState.doctrine)
    ];
    setCandidates(newCandidates);
    showToast('Đại Điển Khai Môn đã mở! 3 thiên tài phàm trần mới đã đến trước cổng núi xin bái sư.');
    playSfx?.('bell');
  };

  // 5. Thăng Cấp Đệ Tử
  const handlePromoteDisciple = (discipleId: string, newRank: DiscipleRank) => {
    const res = promoteDisciple(player, discipleId, newRank);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Sắc Phong Đệ Tử', res.message, 'sect');
      showToast(res.message);
      playSfx?.('bell');
    } else {
      showToast(res.message);
    }
  };

  // 6. Trục Xuất Đệ Tử
  const handleDismissDisciple = (discipleId: string) => {
    const res = dismissDisciple(player, discipleId);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Trục Xuất Môn Hạ', res.message, 'sect');
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  // 7. Phân Công Nhiệm Vụ
  const handleAssignTask = (discipleId: string, taskType: DiscipleTaskType) => {
    const res = assignDiscipleTask(player, discipleId, taskType);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  // 8. Chỉ Định Chân Truyền Y Bát
  const handleSetInheritor = (discipleId: string) => {
    const res = setChosenInheritor(player, discipleId);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Truyền Thừa Y Bát', res.message, 'sect');
      showToast(res.message);
      playSfx?.('breakthrough');
    } else {
      showToast(res.message);
    }
  };

  // 9. Nâng Cấp Kiến Trúc
  const handleUpgradeFacility = (facilityKey: keyof CustomSectState['facilities']) => {
    const res = upgradeSectFacility(player, facilityKey);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Kiến Thiết Sơn Môn', res.message, 'sect');
      showToast(res.message);
      playSfx?.('hammer');
    } else {
      showToast(res.message);
    }
  };

  // 10. Truyền Thụ Tu Vi Đột Phá
  const handleTrainDisciple = (discipleId: string, tuViAmount: number = 50000) => {
    const res = trainDiscipleWithTuVi(player, discipleId, tuViAmount);
    if (res.success && res.updatedPlayer) {
      saveUpdatedPlayer(res.updatedPlayer);
      addLog('Chỉ Điểm Đệ Tử', res.message, 'cultivate');
      showToast(res.message);
      playSfx?.('breakthrough');
    } else {
      showToast(res.message);
    }
  };

  return {
    sectState,
    isFounded: sectState.isFounded,
    candidates,
    vaultYield,
    handleFoundSect,
    handleHarvestVault,
    handleRecruitDisciple,
    handleRefreshCandidates,
    handlePromoteDisciple,
    handleDismissDisciple,
    handleAssignTask,
    handleSetInheritor,
    handleUpgradeFacility,
    handleTrainDisciple
  };
}
