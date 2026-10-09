// hooks/useForbiddenZoneActions.ts
// Hook điều khiển phân hệ "Thái Cổ Cấm Địa • Khám Phá Sa Bàn Sương Mù & Thần Ma Cấm Khu"

import { useState, useCallback, useRef } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  ForbiddenZoneId,
  ForbiddenZoneState,
  ForbiddenZoneCell,
  ForbiddenZoneConfig,
} from '@/lib/types/forbidden-zone';
import { FORBIDDEN_ZONES, getForbiddenZoneById } from '@/lib/forbidden-zone-data';
import {
  generateForbiddenZoneGrid,
  canMoveToCell,
  revealFogOfWar,
  processStepAuraAndEnvironment,
  resolveCellInteraction,
  finalizeEscape,
  finalizeDefeat,
  calculateVisionRadius,
} from '@/lib/forbidden-zone-logic';
import { audioEngine } from '@/lib/audio-engine';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';

export interface UseForbiddenZoneActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export function useForbiddenZoneActions({
  player,
  setPlayer,
  addLog,
  showToast,
}: UseForbiddenZoneActionsParams) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoneState, setZoneState] = useState<ForbiddenZoneState | null>(null);
  const [currentHp, setCurrentHp] = useState<number>(player.khiHuyet || 1000);
  const [maxHp, setMaxHp] = useState<number>(player.maxKhiHuyet || 1000);

  const playerRef = useRef<PlayerStats>(player);
  playerRef.current = player;

  // 1. KHỞI ĐỘNG THÁM HIỂM CẤM KHU
  const handleStartZone = useCallback(
    (zoneId: ForbiddenZoneId) => {
      const config = getForbiddenZoneById(zoneId);
      if (!config) {
        showToast('Cấm địa không tồn tại!');
        return;
      }

      const p = playerRef.current;
      if ((p.currentRealm || 0) < config.minRealmId) {
        showToast(`Cảnh giới chưa đủ! Cần đạt [${config.minRealmName}] trở lên để bước vào.`);
        return;
      }

      const currentMp = p.linhLuc ?? 100;
      if (currentMp < config.mpCost) {
        showToast(`Chân nguyên không đủ! Cần ${config.mpCost.toLocaleString()} MP để mở kết giới cấm địa.`);
        return;
      }

      // Trừ MP mở kết giới
      const updatedPlayer = {
        ...p,
        linhLuc: Math.max(0, currentMp - config.mpCost),
      };
      setPlayer(updatedPlayer);

      const pMaxHp = p.maxKhiHuyet || p.khiHuyet || 10000;
      const pCurHp = p.khiHuyet && p.khiHuyet > 0 ? p.khiHuyet : pMaxHp;
      setCurrentHp(pCurHp);
      setMaxHp(pMaxHp);

      const { cells, visionRadius } = generateForbiddenZoneGrid(config, p);
      const { desc: visionDesc } = calculateVisionRadius(p);

      const initialState: ForbiddenZoneState = {
        zoneId,
        gridSize: config.gridSize,
        playerPos: { x: 0, y: 0 },
        visionRadius,
        auraPower: config.baseAura,
        maxAuraPower: config.baseAura,
        cells,
        lootBag: { linhThach: 0, items: [] },
        stepCount: 0,
        isActive: true,
        exitUnlocked: false,
        logs: [
          `🌌 Bước vào 【${config.name}】! Sương mù cấm địa bao trùm tứ phương.`,
          `✨ ${visionDesc}`,
          `⚠️ ${config.environmentalEffectName}: ${config.environmentalEffectDesc}`,
        ],
      };

      setZoneState(initialState);
      setIsModalOpen(true);
      audioEngine.playThunderSound(0.5);
    },
    [setPlayer, showToast]
  );

  // 2. DI CHUYỂN TRÊN SA BÀN LƯỚI
  const handleMove = useCallback(
    (targetX: number, targetY: number) => {
      if (!zoneState || !zoneState.isActive) return;

      const config = getForbiddenZoneById(zoneState.zoneId);
      if (!config) return;

      if (!canMoveToCell(zoneState.playerPos, { x: targetX, y: targetY })) {
        showToast('⚠️ Chỉ có thể bước vào các ô lân cận!');
        return;
      }

      const p = playerRef.current;
      const stepRes = processStepAuraAndEnvironment(zoneState, p, config);

      // Trừ máu nếu bị ăn mòn hoặc hiệu ứng cấm khu
      let newHp = currentHp;
      if (stepRes.hpLost > 0) {
        newHp = Math.max(0, currentHp - stepRes.hpLost);
        setCurrentHp(newHp);
      }

      // Trừ tâm cảnh nếu có
      if (stepRes.mindLost > 0 && p.soulState?.mindState) {
        const updatedMind = Math.max(0, (p.soulState.mindState.stability || 80) - stepRes.mindLost);
        setPlayer((prev) => {
          if (!prev.soulState || !prev.soulState.mindState) return prev;
          return {
            ...prev,
            soulState: {
              ...prev.soulState,
              mindState: {
                ...prev.soulState.mindState,
                stability: updatedMind,
              },
            } as any,
          };
        });
      }

      // Cập nhật vị trí và mở sương mù
      const newRevealed = revealFogOfWar(
        zoneState.cells,
        targetX,
        targetY,
        zoneState.visionRadius,
        zoneState.gridSize
      );

      newRevealed[targetY][targetX].isVisited = true;
      const targetCell = newRevealed[targetY][targetX];

      const newLogs = [...zoneState.logs];
      if (stepRes.environmentalLog) {
        newLogs.push(stepRes.environmentalLog);
      }
      newLogs.push(`👣 Bước vào ô [${targetX}, ${targetY}]: 【${targetCell.name || targetCell.type}】.`);

      // Kiểm tra nếu tử trận
      if (newHp <= 0) {
        newLogs.push('💥 Đạo thể tan nát! Khí tức cấm khu cắn trả tử trận!');
        const { updatedPlayer, logTitle, logContent, toastMsg } = finalizeDefeat(p, zoneState, config);
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (e) {
          console.error(e);
        }
        addLog(logTitle, logContent, 'dungeon');
        showToast(toastMsg);
        setZoneState(null);
        setIsModalOpen(false);
        audioEngine.playThunderSound(0.7);
        return;
      }

      setZoneState({
        ...zoneState,
        playerPos: { x: targetX, y: targetY },
        auraPower: stepRes.newAura,
        stepCount: zoneState.stepCount + 1,
        cells: newRevealed,
        logs: newLogs,
      });

      audioEngine.playSFX('click');
    },
    [zoneState, currentHp, setPlayer, addLog, showToast]
  );

  // 3. TƯƠNG TÁC SỰ KIỆN Ô (GIẢI CẤM CHẾ / ĐÁNH QUÁI / MỞ RƯƠNG)
  const handleInteract = useCallback(
    (actionChoice?: 'use_formation' | 'brute_force' | 'use_talisman' | 'soul_suppress') => {
      if (!zoneState || !zoneState.isActive) return;

      const { x, y } = zoneState.playerPos;
      const currentCell = zoneState.cells[y][x];
      if (currentCell.isResolved) {
        showToast('Ô này đã được khám phá và giải quyết!');
        return;
      }

      const config = getForbiddenZoneById(zoneState.zoneId);
      if (!config) return;

      const p = playerRef.current;
      const res = resolveCellInteraction(currentCell, p, config, actionChoice);

      // Cập nhật máu nếu có
      let nextHp = currentHp;
      if (res.hpDelta) {
        nextHp = Math.max(0, Math.min(maxHp, currentHp + res.hpDelta));
        setCurrentHp(nextHp);
      }

      // Cập nhật linh quang nếu có
      let nextAura = zoneState.auraPower;
      if (res.auraDelta) {
        nextAura = Math.min(zoneState.maxAuraPower, zoneState.auraPower + res.auraDelta);
      }

      // Cập nhật player nếu có
      if (res.updatedPlayer) {
        setPlayer((prev) => ({ ...prev, ...res.updatedPlayer }));
      }

      // Cập nhật lootBag
      const newLootBag = {
        linhThach: zoneState.lootBag.linhThach + (res.lootStones || 0),
        items: [...zoneState.lootBag.items, ...(res.lootItems || [])],
      };

      // Cập nhật ô
      const updatedCells = zoneState.cells.map((row, rIdx) =>
        row.map((c, cIdx) => (rIdx === y && cIdx === x ? res.updatedCell : c))
      );

      const newLogs = [...zoneState.logs, res.log];

      // Kiểm tra nếu tử trận khi giải cấm chế hoặc đánh quái
      if (nextHp <= 0) {
        newLogs.push('💥 Đạo thể kiệt quệ tử trận trong cấm khu!');
        const { updatedPlayer, logTitle, logContent, toastMsg } = finalizeDefeat(p, zoneState, config);
        const normalized = normalizePlayerData(updatedPlayer);
        setPlayer(normalized);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (e) {
          console.error(e);
        }
        addLog(logTitle, logContent, 'dungeon');
        showToast(toastMsg);
        setZoneState(null);
        setIsModalOpen(false);
        audioEngine.playThunderSound(0.7);
        return;
      }

      setZoneState({
        ...zoneState,
        auraPower: nextAura,
        cells: updatedCells,
        lootBag: newLootBag,
        logs: newLogs,
      });

      audioEngine.playSFX('breakthrough');
    },
    [zoneState, currentHp, maxHp, setPlayer, addLog, showToast]
  );

  // 4. SỬ DỤNG ĐAN DƯỢC HỒI LINH QUANG KHẨN CẤP
  const handleConsumePillForAura = useCallback(() => {
    if (!zoneState || !zoneState.isActive) return;

    const p = playerRef.current;
    const pills = p.inventory?.pills || [];
    const pIdx = pills.findIndex((pill) => pill.quantity > 0);

    if (pIdx < 0) {
      showToast('❌ Không có đan dược trong túi để bồi bổ chân nguyên!');
      return;
    }

    const usedPill = pills[pIdx];
    const updatedPills = [...pills];
    updatedPills[pIdx].quantity -= 1;

    setPlayer((prev) => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        pills: updatedPills.filter((p) => p.quantity > 0),
        herbs: prev.inventory?.herbs || [],
        talismans: prev.inventory?.talismans || [],
      } as any,
    }));

    const restoredAura = 35;
    const nextAura = Math.min(zoneState.maxAuraPower, zoneState.auraPower + restoredAura);

    setZoneState({
      ...zoneState,
      auraPower: nextAura,
      logs: [
        ...zoneState.logs,
        `💊 Nuốt vào 1 viên 【${usedPill.name}】! Dược lực tỏa ra xua tan tử khí, hồi phục +${restoredAura} Hộ Thân Linh Quang!`,
      ],
    });

    showToast(`💊 Đã hồi phục +${restoredAura} Hộ Thân Linh Quang!`);
    audioEngine.playSFX('alchemy');
  }, [zoneState, setPlayer, showToast]);

  // 5. RÚT LUI AN TOÀN TẠI CỔ TRẬN (ESCAPE)
  const handleEscape = useCallback(() => {
    if (!zoneState || !zoneState.isActive) return;

    const { x, y } = zoneState.playerPos;
    const currentCell = zoneState.cells[y][x];

    if (currentCell.type !== 'exit_portal') {
      showToast('⚠️ Phải tìm thấy và đứng tại 【Truyền Tống Cổ Trận】 mới có thể rút lui an toàn!');
      return;
    }

    const config = getForbiddenZoneById(zoneState.zoneId);
    if (!config) return;

    const p = playerRef.current;
    const { updatedPlayer, logTitle, logContent, toastMsg } = finalizeEscape(p, zoneState, config);

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error(e);
    }

    addLog(logTitle, logContent, 'dungeon');
    showToast(toastMsg);
    audioEngine.playSFX('breakthrough');

    setZoneState(null);
    setIsModalOpen(false);
  }, [zoneState, setPlayer, addLog, showToast]);

  // 6. THOÁT KHẨN CẤP GIỮA ĐƯỜNG (BỎ CHẠY - MẤT 50% LOOT)
  const handleRetreatEmergency = useCallback(() => {
    if (!zoneState || !zoneState.isActive) return;

    const config = getForbiddenZoneById(zoneState.zoneId);
    if (!config) return;

    const p = playerRef.current;
    const savedStones = Math.floor(zoneState.lootBag.linhThach * 0.5);
    const savedItems = zoneState.lootBag.items.slice(0, Math.ceil(zoneState.lootBag.items.length * 0.5));

    let updatedPlayer: PlayerStats = {
      ...p,
      linhThach: (p.linhThach || 0) + savedStones,
    };

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.error(e);
    }

    addLog(
      `🏃 BỎ CHẠY KHỎI 【${config.name.toUpperCase()}】!`,
      `Ngươi xé rách không gian trốn chạy khỏi cấm khu! Chỉ kịp mang theo 50% chiến lợi phẩm (+${savedStones.toLocaleString()} Linh Thạch).`,
      'dungeon'
    );
    showToast('🏃 Đã rút lui khẩn cấp! Bảo lưu 50% chiến lợi phẩm.');

    setZoneState(null);
    setIsModalOpen(false);
  }, [zoneState, setPlayer, addLog, showToast]);

  const closeModal = useCallback(() => {
    if (zoneState && zoneState.isActive) {
      showToast('⚠️ Đang trong cấm địa! Hãy chọn Rút lui an toàn hoặc Rút lui khẩn cấp.');
      return;
    }
    setIsModalOpen(false);
  }, [zoneState, showToast]);

  return {
    isModalOpen,
    zoneState,
    currentHp,
    maxHp,
    handleStartZone,
    handleMove,
    handleInteract,
    handleConsumePillForAura,
    handleEscape,
    handleRetreatEmergency,
    closeModal,
  };
}
