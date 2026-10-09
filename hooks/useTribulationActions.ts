// hooks/useTribulationActions.ts
// Hook điều khiển hệ thống "Cửu Trọng Thiên Kiếp Tương Tác • Lôi Kiếp Độ Kiếp"

import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, Realm } from '@/lib/types';
import {
  TribulationRunState,
  TribulationActionType,
  TribulationPhase,
} from '@/lib/types/tribulation';
import {
  getTribulationConfig,
  canPerformTribulationAction,
  resolveTribulationWave,
  finalizeTribulationVictory,
  finalizeTribulationDefeat,
} from '@/lib/tribulation-logic';
import { audioEngine } from '@/lib/audio-engine';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';

export interface UseTribulationActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: any) => void;
  showToast: (msg: string) => void;
  onMajorBreakthrough?: (newRealmIndex: number, realmName: string) => void;
}

export interface UseTribulationActionsReturn {
  isModalOpen: boolean;
  tribulationState: TribulationRunState | null;
  isLightningFlashing: boolean;
  startTribulation: (fromRealmId: number, toRealmId: number, targetRealm?: Realm) => void;
  handleSelectAction: (actionType: TribulationActionType) => void;
  handleClaimVictory: () => void;
  handleCloseDefeat: () => void;
  closeModal: () => void;
}

export function useTribulationActions({
  player,
  setPlayer,
  addLog,
  showToast,
  onMajorBreakthrough,
}: UseTribulationActionsParams): UseTribulationActionsReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tribulationState, setTribulationState] = useState<TribulationRunState | null>(null);
  const [isLightningFlashing, setIsLightningFlashing] = useState(false);

  // Giữ ref tham chiếu state mới nhất để timer callback không bị stale closure
  const stateRef = useRef<TribulationRunState | null>(null);
  stateRef.current = tribulationState;

  const playerRef = useRef<PlayerStats>(player);
  playerRef.current = player;

  // 1. KHỞI ĐỘNG THIÊN KIẾP
  const startTribulation = useCallback(
    (fromRealmId: number, toRealmId: number) => {
      const currentPlayer = playerRef.current;
      const rawHp = currentPlayer.khiHuyet ?? 0;
      const rawMp = currentPlayer.linhLuc ?? 0;
      const maxHp = (currentPlayer.maxKhiHuyet && currentPlayer.maxKhiHuyet > 0) ? currentPlayer.maxKhiHuyet : (rawHp > 0 ? rawHp : 10000);
      const maxMp = (currentPlayer.maxLinhLuc && currentPlayer.maxLinhLuc > 0) ? currentPlayer.maxLinhLuc : (rawMp > 0 ? rawMp : 10000);
      const currentHp = rawHp > 0 ? rawHp : maxHp;
      const currentMp = rawMp > 0 ? rawMp : maxMp;

      const config = getTribulationConfig(fromRealmId, toRealmId, maxHp);

      const firstWave = config.waves[0];
      const initialLogs = [
        `⚡ THIÊN ĐỊA DỊ BIẾN! Mây đen che phủ vạn dặm, cuồng lôi xé toạc hư không!`,
        `🌩️ 【${config.tribulationName}】 chính thức buông xuống đỉnh đầu!`,
        `🌀 Đợt 1/${config.totalWaves}: 【${firstWave.name}】 đang ngưng tụ thiên uy hủy diệt...`,
      ];

      const initialState: TribulationRunState = {
        isActive: true,
        config,
        currentWaveIndex: 1,
        currentHp,
        maxHp,
        currentMp,
        maxMp,
        phase: 'gathering',
        timerSeconds: 2,
        logs: initialLogs,
        permanentDefBonusGained: 0,
        permanentDmgReductionBonusGained: 0,
        selectedAction: null,
      };

      setTribulationState(initialState);
      setIsModalOpen(true);
      audioEngine.playThunderSound(0.7);
    },
    []
  );

  // 2. CHỌN QUYẾT SÁCH CHIẾN THUẬT & GIẢI QUYẾT SÁT THƯƠNG
  const handleSelectAction = useCallback(
    (actionType: TribulationActionType) => {
      const current = stateRef.current;
      if (!current || !current.isActive || current.phase !== 'decision') return;

      const currentPlayer = playerRef.current;
      const check = canPerformTribulationAction(
        actionType,
        currentPlayer,
        current.currentMp,
        current.maxMp
      );

      if (!check.ok) {
        showToast(`❌ Không thể chọn: ${check.reason}`);
        return;
      }

      // Khóa pha thành 'impact' để người chơi không spam bấm
      setTribulationState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phase: 'impact',
          selectedAction: actionType,
          timerSeconds: 0,
        };
      });

      // Bật hiệu ứng sấm chớp rung giật và âm thanh thiên lôi
      setIsLightningFlashing(true);
      audioEngine.playThunderSound(1.1);

      // Đợi 1000ms để hiệu ứng sấm chớp phát nổ rồi tính toán kết quả
      setTimeout(() => {
        setIsLightningFlashing(false);
        const stateNow = stateRef.current;
        if (!stateNow) return;

        const currentWave = stateNow.config.waves[stateNow.currentWaveIndex - 1];
        const res = resolveTribulationWave(
          currentWave,
          actionType,
          playerRef.current,
          stateNow.currentHp,
          stateNow.maxHp,
          stateNow.currentMp,
          stateNow.maxMp
        );

        // Đồng bộ player mới (tài nguyên bùa/đan/mp/linh thạch...)
        const normalized = normalizePlayerData(res.updatedPlayer);
        setPlayer(normalized);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (e) {
          console.error('Failed to sync storage:', e);
        }

        const newLogs = [...stateNow.logs, res.logText];
        const newTotalDef = stateNow.permanentDefBonusGained + res.permanentDefGained;
        const newTotalDmgRed = stateNow.permanentDmgReductionBonusGained + res.permanentDmgReductionGained;

        // KIỂM TRA SINH TỬ
        if (!res.survived) {
          // Thất bại
          setTribulationState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              currentHp: 0,
              currentMp: res.newMp,
              phase: 'defeat',
              logs: [
                ...newLogs,
                `💥 THẤT BẠI! Thể phách gãy vụn trước thiên uy, ngã xuống lôi đài!`,
              ],
              permanentDefBonusGained: newTotalDef,
              permanentDmgReductionBonusGained: newTotalDmgRed,
              lastWaveDamageTaken: res.damageTaken,
            };
          });
          audioEngine.playThunderSound(0.6);
          return;
        }

        // Nếu còn sống: Kiểm tra xem đã qua hết các đợt chưa
        if (stateNow.currentWaveIndex >= stateNow.config.totalWaves) {
          // CHIẾN THẮNG TOÀN DIỆN
          setTribulationState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              currentHp: res.newHp,
              currentMp: res.newMp,
              phase: 'victory',
              logs: [
                ...newLogs,
                `🌈 VẠN ĐẠO QUANG MINH! Toàn bộ ${stateNow.config.totalWaves} đợt lôi kiếp đã bị hóa giải!`,
              ],
              permanentDefBonusGained: newTotalDef,
              permanentDmgReductionBonusGained: newTotalDmgRed,
              lastWaveDamageTaken: res.damageTaken,
            };
          });
          audioEngine.playBreakthroughSuccessSound(1.2);
        } else {
          // CHUYỂN TIẾP SANG ĐỢT TIẾP THEO
          const nextWaveIndex = stateNow.currentWaveIndex + 1;
          const nextWaveConfig = stateNow.config.waves[nextWaveIndex - 1];

          setTribulationState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              currentWaveIndex: nextWaveIndex,
              currentHp: res.newHp,
              currentMp: res.newMp,
              phase: 'gathering',
              timerSeconds: 2,
              selectedAction: null,
              logs: [
                ...newLogs,
                `⚡ Đợt ${nextWaveIndex}/${prev.config.totalWaves}: 【${nextWaveConfig.name}】 ngưng tụ thiên phạt!`,
              ],
              permanentDefBonusGained: newTotalDef,
              permanentDmgReductionBonusGained: newTotalDmgRed,
              lastWaveDamageTaken: res.damageTaken,
            };
          });
          audioEngine.playThunderSound(0.6);
        }
      }, 1000);
    },
    [setPlayer, showToast]
  );

  // 3. VÒNG LẶP ĐẾM THỜI GIAN THEO TỪNG PHA (GAME TICK ENGINE)
  useEffect(() => {
    if (!isModalOpen || !tribulationState || !tribulationState.isActive) return;

    // Chỉ đếm thời gian khi ở pha 'gathering' hoặc 'decision'
    if (tribulationState.phase !== 'gathering' && tribulationState.phase !== 'decision') {
      return;
    }

    const interval = setInterval(() => {
      const current = stateRef.current;
      if (!current || !current.isActive) return;

      if (current.phase === 'gathering') {
        if (current.timerSeconds > 1) {
          setTribulationState((prev) => (prev ? { ...prev, timerSeconds: prev.timerSeconds - 1 } : null));
        } else {
          // Chuyển sang pha Quyết sách (4 giây đếm ngược)
          setTribulationState((prev) => {
            if (!prev) return null;
            const currentWave = prev.config.waves[prev.currentWaveIndex - 1];
            return {
              ...prev,
              phase: 'decision',
              timerSeconds: 4,
              selectedAction: null,
              logs: [
                ...prev.logs,
                `⏱️ Thiên lôi đã giáng xuống trong gang tấc! Quyết sách ứng biến ngay trong 4 giây!`,
              ],
            };
          });
        }
      } else if (current.phase === 'decision') {
        if (current.timerSeconds > 1) {
          setTribulationState((prev) => (prev ? { ...prev, timerSeconds: prev.timerSeconds - 1 } : null));
        } else {
          // Hết 4 giây không chọn -> Bắt buộc dùng Nhục Thân Ngạnh Kháng!
          handleSelectAction('body_tank');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isModalOpen, tribulationState?.phase, handleSelectAction]);

  // 4. KẾT THÚC THÀNH CÔNG: NHẬN CẢNH GIỚI VÀ PHẦN THƯỞNG
  const handleClaimVictory = useCallback(() => {
    const current = stateRef.current;
    if (!current || current.phase !== 'victory') return;

    const { updatedPlayer, logTitle, logContent, toastMsg } = finalizeTribulationVictory(
      playerRef.current,
      current.config.toRealmId,
      current.permanentDefBonusGained,
      current.permanentDmgReductionBonusGained
    );

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error('Failed to sync storage:', e);
    }

    addLog(logTitle, logContent, 'breakthrough');
    showToast(toastMsg);
    onMajorBreakthrough?.(current.config.toRealmId, current.config.toRealmName);

    setIsModalOpen(false);
    setTribulationState(null);
  }, [addLog, showToast, onMajorBreakthrough, setPlayer]);

  // 5. KẾT THÚC THẤT BẠI: TRỌNG THƯƠNG VÀ ĐÓNG MODAL
  const handleCloseDefeat = useCallback(() => {
    const current = stateRef.current;
    if (!current || current.phase !== 'defeat') return;

    const currentWave = current.config.waves[current.currentWaveIndex - 1];
    const { updatedPlayer, logTitle, logContent, toastMsg } = finalizeTribulationDefeat(
      playerRef.current,
      currentWave?.name || 'Thiên Lôi Sát Kiếp'
    );

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error('Failed to sync storage:', e);
    }

    addLog(logTitle, logContent, 'breakthrough');
    showToast(toastMsg);

    setIsModalOpen(false);
    setTribulationState(null);
  }, [addLog, showToast, setPlayer]);

  const closeModal = useCallback(() => {
    // Không cho phép đóng modal tùy tiện khi đang trong lôi kiếp (chỉ đóng khi đã victory hoặc defeat)
    const current = stateRef.current;
    if (!current || current.phase === 'victory' || current.phase === 'defeat') {
      setIsModalOpen(false);
      setTribulationState(null);
    } else {
      showToast('⚠️ Đang trong thiên kiếp sát phạt, không thể tự ý thoát lôi đài!');
    }
  }, [showToast]);

  return {
    isModalOpen,
    tribulationState,
    isLightningFlashing,
    startTribulation,
    handleSelectAction,
    handleClaimVictory,
    handleCloseDefeat,
    closeModal,
  };
}
