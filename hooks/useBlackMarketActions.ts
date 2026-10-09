'use client';

// hooks/useBlackMarketActions.ts
// Custom Hook quản lý trạng thái, vòng lặp đếm ngược và AI NPC của:
// "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  BlackMarketLot,
  BlackMarketSessionState,
  RaidResolutionChoice,
  RaidResolutionResult,
  MoonPhase
} from '@/lib/types/black-market';
import {
  evaluateMoonPhase,
  generateBlackMarketLots,
  simulateNpcBiddingStep,
  playerPlaceBid,
  handleNpcOutbidRefund,
  consignPlayerContraband,
  settleBlackMarketLot,
  checkBustRaidTrigger,
  resolveRaidEncounter
} from '@/lib/black-market-auction-logic';
import { audioEngine } from '@/lib/audio-engine';

export interface UseBlackMarketActionsProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast?: (message: string) => void;
}

export function useBlackMarketActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseBlackMarketActionsProps) {
  // 1. Tính toán ngày tu tiên hiện tại và pha mặt trăng
  const currentDay = useMemo(() => {
    return (
      player.gameDays ??
      player.dayCount ??
      Math.floor(((player.age || 16) - 16) * 365) + 1
    );
  }, [player.gameDays, player.dayCount, player.age]);

  const moonInfo = useMemo(() => {
    return evaluateMoonPhase(currentDay);
  }, [currentDay]);

  // 2. Khởi tạo trạng thái phiên chợ Hắc Thị
  const [session, setSession] = useState<BlackMarketSessionState>(() => {
    if (player.blackMarketState) {
      return {
        ...player.blackMarketState,
        isAuctionOpen: moonInfo.isAuctionOpen,
        currentMoonPhase: moonInfo.currentMoonPhase,
        currentDay,
        nextOpenGameDay: moonInfo.nextOpenGameDay
      };
    }

    return {
      isAuctionOpen: moonInfo.isAuctionOpen,
      currentMoonPhase: moonInfo.currentMoonPhase,
      currentDay,
      nextOpenGameDay: moonInfo.nextOpenGameDay,
      bustRiskMeter: typeof player.bustRiskMeter === 'number' ? player.bustRiskMeter : 0,
      activeLots: moonInfo.isAuctionOpen ? generateBlackMarketLots(currentDay, player.currentRealm || 0) : [],
      playerEscrowStones: 0,
      raidIncidentActive: false,
      contrabandHistory: Array.isArray(player.contrabandHistory) ? player.contrabandHistory : []
    };
  });

  // Modal biến cố truy quét
  const [raidResultModal, setRaidResultModal] = useState<RaidResolutionResult | null>(null);

  // Ref lưu giữ giá trị mới nhất của player và session trong timer loop
  const playerRef = useRef(player);
  playerRef.current = player;

  const sessionRef = useRef(session);
  sessionRef.current = session;

  // Cập nhật trạng thái mở cửa khi chu kỳ thay đổi
  useEffect(() => {
    setSession(prev => {
      const isNowOpen = moonInfo.isAuctionOpen;
      let activeLots = prev.activeLots;

      if (isNowOpen && (!activeLots || activeLots.length === 0)) {
        activeLots = generateBlackMarketLots(currentDay, playerRef.current.currentRealm || 0);
      }

      return {
        ...prev,
        isAuctionOpen: isNowOpen,
        currentMoonPhase: moonInfo.currentMoonPhase,
        currentDay,
        nextOpenGameDay: moonInfo.nextOpenGameDay,
        activeLots
      };
    });
  }, [moonInfo, currentDay]);

  // Đồng bộ session và bustRiskMeter vào player state
  const syncToPlayer = useCallback((updatedPlayer: PlayerStats, updatedSession: BlackMarketSessionState) => {
    const finalPlayer: PlayerStats = {
      ...updatedPlayer,
      blackMarketState: updatedSession,
      bustRiskMeter: updatedSession.bustRiskMeter,
      contrabandHistory: updatedSession.contrabandHistory || []
    };

    setPlayer(finalPlayer);
    setSession(updatedSession);
  }, [setPlayer]);

  // ============================================================
  // 3. VÒNG LẶP ĐẾM NGƯỢC THỜI GIAN ĐẤU GIÁ (1s TICK)
  // ============================================================
  useEffect(() => {
    if (!session.isAuctionOpen || session.raidIncidentActive) return;

    const timer = setInterval(() => {
      const curSession = sessionRef.current;
      const curPlayer = playerRef.current;

      if (!curSession.activeLots || curSession.activeLots.length === 0) return;

      let hasSettled = false;
      let updatedLots = curSession.activeLots.map(lot => {
        if (lot.isSettled) return lot;
        const newTime = Math.max(0, lot.timeLeftSeconds - 1);
        if (newTime === 0 && !lot.isSettled) {
          hasSettled = true;
        }
        return { ...lot, timeLeftSeconds: newTime };
      });

      let updatedSession = { ...curSession, activeLots: updatedLots };
      let updatedPlayer = { ...curPlayer };

      // Tự động kết toán các lot đã về 0s
      if (hasSettled) {
        for (const lot of updatedLots) {
          if (lot.timeLeftSeconds === 0 && !lot.isSettled) {
            const settleRes = settleBlackMarketLot(updatedPlayer, updatedSession, lot.id);
            updatedPlayer = settleRes.updatedPlayer;
            updatedSession = settleRes.updatedSession;

            if (settleRes.message) {
              if (showToast) showToast(settleRes.message);
              if (addLog) addLog('⚖️ Hắc Thị Gõ Búa Kết Toán', settleRes.message, 'system');
              try { audioEngine.playSFX('breakthrough'); } catch (_) {}
            }
          }
        }
      }

      // Giảm nhẹ Bust Risk theo thời gian (mỗi 15s giảm 1% nếu không làm gì)
      if (Math.random() < 0.07 && updatedSession.bustRiskMeter > 0) {
        updatedSession.bustRiskMeter = Math.max(0, updatedSession.bustRiskMeter - 1);
      }

      setSession(updatedSession);
      setPlayer(prev => ({
        ...prev,
        ...updatedPlayer,
        blackMarketState: updatedSession,
        bustRiskMeter: updatedSession.bustRiskMeter
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [session.isAuctionOpen, session.raidIncidentActive, addLog, showToast, setPlayer]);

  // ============================================================
  // 4. VÒNG LẶP NPC MA ĐẦU TỰ ĐỘNG NÂNG GIÁ (3s - 5s TICK)
  // ============================================================
  useEffect(() => {
    if (!session.isAuctionOpen || session.raidIncidentActive) return;

    const npcTimer = setInterval(() => {
      const curSession = sessionRef.current;
      const curPlayer = playerRef.current;

      const nonSettledLots = curSession.activeLots.filter(
        l => !l.isSettled && l.timeLeftSeconds > 2
      );
      if (nonSettledLots.length === 0) return;

      // Chọn ngẫu nhiên 1 lô hàng để NPC cân nhắc trả giá
      const targetLot = nonSettledLots[Math.floor(Math.random() * nonSettledLots.length)];
      const simRes = simulateNpcBiddingStep(targetLot);

      if (simRes.newBidAmount > targetLot.currentBid) {
        let updatedPlayer = { ...curPlayer };
        let updatedSession = { ...curSession };

        // Nếu người chơi bị NPC vượt giá (Outbid) -> Hoàn trả 100% tiền ký quỹ!
        if (simRes.outbidPlayer) {
          const refundRes = handleNpcOutbidRefund(
            updatedPlayer,
            updatedSession,
            targetLot.id,
            targetLot.currentBid
          );
          updatedPlayer = refundRes.updatedPlayer;
          updatedSession = refundRes.updatedSession;

          if (showToast) {
            showToast(`⚠️ [BỊ VƯỢT GIÁ] ${simRes.bidderName} đã trả giá ${simRes.newBidAmount.toLocaleString()} Linh Thạch cho "${targetLot.itemName}"! Tiền ký quỹ đã được hoàn trả.`);
          }
          if (addLog) {
            addLog(
              '⚠️ Hắc Thị Tranh Đoạt',
              `Ma Tu 【${simRes.bidderName}】 đã nâng giá lô hàng 【${targetLot.itemName}】 lên ${simRes.newBidAmount.toLocaleString()} Linh Thạch! 100% tiền ký quỹ đã hoàn về túi đạo hữu.`,
              'warning'
            );
          }
          try { audioEngine.playSFX('breakthrough_fail'); } catch (_) {}
        }

        // Cập nhật lô hàng với giá mới của NPC
        const lotIdx = updatedSession.activeLots.findIndex(l => l.id === targetLot.id);
        if (lotIdx !== -1) {
          const newLots = [...updatedSession.activeLots];
          newLots[lotIdx] = simRes.lot;
          updatedSession.activeLots = newLots;
        }

        setSession(updatedSession);
        setPlayer(prev => ({
          ...prev,
          ...updatedPlayer,
          blackMarketState: updatedSession
        }));
      }
    }, 4500);

    return () => clearInterval(npcTimer);
  }, [session.isAuctionOpen, session.raidIncidentActive, addLog, showToast, setPlayer]);

  // ============================================================
  // 5. HÀNH ĐỘNG: ĐẶT GIÁ MUA (PLACE BID)
  // ============================================================
  const handlePlaceBid = useCallback((lotId: string, customBid?: number) => {
    const curPlayer = playerRef.current;
    const curSession = sessionRef.current;

    const res = playerPlaceBid(curPlayer, curSession, lotId, customBid);
    if (!res.success) {
      if (showToast) showToast(`❌ ${res.reason || res.message}`);
      try { audioEngine.playSFX('click'); } catch (_) {}
      return false;
    }

    syncToPlayer(res.updatedPlayer, res.updatedSession);

    if (showToast) showToast(res.message || 'Đặt giá thành công!');
    if (addLog) {
      addLog(
        '🔥 Đấu Giá Hắc Thị',
        res.message || `Đạo hữu đã ra giá cho lô hàng trên sàn Hắc Thị!`,
        'success'
      );
    }
    try { audioEngine.playSFX('click'); } catch (_) {}

    // Nếu kích hoạt đột kích
    if (res.updatedSession.raidIncidentActive) {
      if (showToast) {
        showToast('🚨 [NGUY CƠ BẠI LỘ] Tiên Quan Chấp Pháp đã phát hiện tung tích Hắc Thị và đang ập vào truy quét!');
      }
      if (addLog) {
        addLog(
          '🚨 CHÍNH ĐẠO TRUY QUÉT',
          'Đại trận Tiên Quan bao trùm U Minh Hắc Thị! Đội Tuần Tra Chấp Pháp rầm rộ ập vào! Hãy mau chóng đưa ra quyết định sinh tử!',
          'danger'
        );
      }
      try { audioEngine.playSFX('tribulation_hit'); } catch (_) {}
    }

    return true;
  }, [syncToPlayer, addLog, showToast]);

  // ============================================================
  // 6. HÀNH ĐỘNG: KÝ GỬI CẤM PHẨM (CONSIGN ITEM)
  // ============================================================
  const handleConsignItem = useCallback((item: any, customStartingPrice?: number) => {
    const curPlayer = playerRef.current;
    const curSession = sessionRef.current;

    const res = consignPlayerContraband(curPlayer, curSession, item, customStartingPrice);
    if (!res.success) {
      if (showToast) showToast(`❌ ${res.reason || 'Ký gửi thất bại!'}`);
      return false;
    }

    syncToPlayer(res.updatedPlayer, res.updatedSession);

    if (showToast) showToast(res.message || 'Ký gửi cấm phẩm thành công!');
    if (addLog) {
      addLog('📦 Ký Gửi Hắc Thị', res.message || 'Ký gửi cấm phẩm thành công!', 'success');
    }
    try { audioEngine.playSFX('click'); } catch (_) {}

    if (res.updatedSession.raidIncidentActive) {
      if (showToast) {
        showToast('🚨 [NGUY CƠ BẠI LỘ] Ký gửi cấm phẩm gây chấn động tà khí! Tiên Quan đang truy quét!');
      }
      try { audioEngine.playSFX('tribulation_hit'); } catch (_) {}
    }

    return true;
  }, [syncToPlayer, addLog, showToast]);

  // ============================================================
  // 7. HÀNH ĐỘNG: GIẢI QUYẾT ĐỘT KÍCH (RESOLVE RAID)
  // ============================================================
  const handleResolveRaid = useCallback((choice: RaidResolutionChoice) => {
    const curPlayer = playerRef.current;
    const curSession = sessionRef.current;

    // Giả lập kết quả combat: nếu người chơi có công kích cao hoặc cảnh giới >= 5 (Kim Đan) -> tỷ lệ thắng cao
    const combatVictory = choice === 'fight'
      ? (curPlayer.currentRealm || 0) >= 4 || (curPlayer.congKich || 0) >= 3000 || Math.random() < 0.70
      : undefined;

    const result = resolveRaidEncounter(choice, curPlayer, curSession, combatVictory);

    syncToPlayer(result.updatedPlayer, result.updatedSession);
    setRaidResultModal(result);

    if (showToast) showToast(result.message);
    if (addLog) {
      addLog(
        choice === 'fight'
          ? (result.success ? '⚔️ Huyết Chiến Đại Thắng' : '💀 Huyết Chiến Thất Bại')
          : choice === 'bribe'
          ? '💸 Đút Lót Thoát Thân'
          : '🏃 Vứt Của Chạy Trốn',
        result.message,
        result.success ? 'success' : 'danger'
      );
    }

    try {
      if (result.success) {
        audioEngine.playSFX('breakthrough');
      } else {
        audioEngine.playSFX('breakthrough_fail');
      }
    } catch (_) {}

    return result;
  }, [syncToPlayer, addLog, showToast]);

  // ============================================================
  // 8. HÀNH ĐỘNG: KẾT TOÁN THỦ CÔNG (SETTLE LOT)
  // ============================================================
  const handleSettleLot = useCallback((lotId: string) => {
    const curPlayer = playerRef.current;
    const curSession = sessionRef.current;

    const res = settleBlackMarketLot(curPlayer, curSession, lotId);
    if (!res.success) return false;

    syncToPlayer(res.updatedPlayer, res.updatedSession);
    if (res.message) {
      if (showToast) showToast(res.message);
      if (addLog) addLog('⚖️ Kết Toán Lô Hàng', res.message, 'success');
      try { audioEngine.playSFX('breakthrough'); } catch (_) {}
    }
    return true;
  }, [syncToPlayer, addLog, showToast]);

  return {
    currentDay,
    moonInfo,
    session,
    setSession,
    raidResultModal,
    setRaidResultModal,
    handlePlaceBid,
    handleConsignItem,
    handleResolveRaid,
    handleSettleLot
  };
}
