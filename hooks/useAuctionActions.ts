// hooks/useAuctionActions.ts
// CUSTOM HOOK QUẢN LÝ VÒNG LẶP ĐẤU TRÍ VẠN BẢO ĐẤU GIÁ HỘI

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlayerStats,
  AuctionSessionState,
  AuctionBidRecord,
  LogType
} from '@/lib/types';
import {
  generateAuctionSession,
  calculateNextNPCBid,
  attemptSoulIntimidation,
  resolveAuctionItemWin,
  calculateNpcBudgetForLot
} from '@/lib/auction-logic';
import { audioEngine } from '@/lib/audio-engine';
import { STORAGE_KEY } from '@/lib/save-migration';

export interface UseAuctionActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (message: string) => void;
}

export function useAuctionActions({
  player,
  setPlayer,
  addLog,
  showToast
}: UseAuctionActionsParams) {
  const [session, setSession] = useState<AuctionSessionState | null>(null);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState<boolean>(false);
  const [isBiddingRunning, setIsBiddingRunning] = useState<boolean>(false);

  const hammerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const npcDeliberationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dọn dẹp timers khi unmount
  useEffect(() => {
    return () => {
      if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
      if (npcDeliberationTimerRef.current) clearTimeout(npcDeliberationTimerRef.current);
    };
  }, []);

  // ============================================
  // 1. KHỞI TẠO PHIÊN ĐẤU GIÁ
  // ============================================
  const startAuctionSession = useCallback((customTitle?: string, isBreakthroughEvent?: boolean) => {
    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (npcDeliberationTimerRef.current) clearTimeout(npcDeliberationTimerRef.current);

    const newSession = generateAuctionSession(
      player.currentRealm || 0,
      player.thanThuc || 30,
      customTitle,
      isBreakthroughEvent
    );

    setSession(newSession);
    setIsAuctionModalOpen(true);
    setIsBiddingRunning(false);
    audioEngine.playSFX('click');

    addLog(
      '🏛️ Vạn Bảo Đấu Giá Đại Hội',
      `Ngươi bước vào sảnh đấu giá nguy nga tráng lệ! Phiên đấu giá gồm ${newSession.items.length} kỳ trân dị bảo tuyệt thế quy tụ các đại năng, thế gia thiếu chủ và chưởng quỹ thương hội!`,
      'system'
    );
  }, [player.currentRealm, player.thanThuc, addLog]);

  // ============================================
  // 2. KẾT TOÁN LÔ ĐẤU GIÁ (SOLD)
  // ============================================
  const finalizeCurrentLot = useCallback((currentSession: AuctionSessionState) => {
    const lot = currentSession.items[currentSession.currentItemIndex];
    if (!lot) return;

    if (currentSession.highestBidder.isPlayer) {
      // Người chơi thắng đấu giá
      audioEngine.playSFX('breakthrough');
      const { updatedPlayer, rewardMessage } = resolveAuctionItemWin(
        player,
        lot,
        currentSession.currentPrice
      );

      setPlayer(updatedPlayer);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
      } catch (e) {
        console.error(e);
      }

      showToast(`🎉 Thành giao! Ngươi đã đoạt được [${lot.name}]!`);
      addLog(
        'Đấu Giá Thắng Lợi',
        `Dưới sự chứng kiến của toàn trường, ngươi thành công mua được [${lot.name}] (${lot.rarity.toUpperCase()}) với giá ${currentSession.currentPrice.toLocaleString()} Linh Thạch!\n${rewardMessage}`,
        'breakthrough'
      );
    } else {
      // NPC thắng đấu giá
      audioEngine.playSFX('click');
      showToast(`[${currentSession.highestBidder.name}] đã mua được [${lot.name}]!`);
      addLog(
        'Đấu Giá Kết Thúc',
        `Lô đấu giá [${lot.name}] đã thuộc về [${currentSession.highestBidder.name}] với giá ${currentSession.currentPrice.toLocaleString()} Linh Thạch.`,
        'system'
      );
    }

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'sold',
        hammerCount: 3,
        narratorLog: `🔨 ĐẤU GIÁ SƯ GÕ BÚA: "THÀNH GIAO! [${lot.name}] chính thức thuộc về ${currentSession.highestBidder.name} với giá ${currentSession.currentPrice.toLocaleString()} Linh Thạch!"`
      };
    });
    setIsBiddingRunning(false);
  }, [player, setPlayer, addLog, showToast]);

  // ============================================
  // 3. TIẾN TRÌNH GÕ BÚA (HAMMER PROGRESSION)
  // ============================================
  const triggerHammerCountdown = useCallback((fromCount: number = 1) => {
    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);

    setSession(prev => {
      if (!prev || prev.status === 'sold' || prev.status === 'finished') return prev;
      const lot = prev.items[prev.currentItemIndex];
      const countText = fromCount === 1 ? 'LẦN THỨ NHẤT' : fromCount === 2 ? 'LẦN THỨ HAI' : 'THÀNH GIAO';
      return {
        ...prev,
        status: fromCount >= 3 ? 'sold' : 'hammering',
        hammerCount: fromCount,
        narratorLog: `🔨 Đấu Giá Sư hô vang: "${prev.currentPrice.toLocaleString()} Linh Thạch... ${countText}!"`
      };
    });

    audioEngine.playSFX('click');

    if (fromCount >= 3) {
      // Thành giao
      setSession(prev => {
        if (prev) finalizeCurrentLot(prev);
        return prev;
      });
      return;
    }

    // Đợi 2.2 giây để gõ búa nhịp tiếp theo (nếu không có ai nâng giá)
    hammerTimerRef.current = setTimeout(() => {
      setSession(currentSession => {
        if (!currentSession || currentSession.status === 'sold' || currentSession.status === 'finished') {
          return currentSession;
        }

        // Kiểm tra xem NPC có bất ngờ ra giá phút chót hay không
        const npcBid = calculateNextNPCBid(currentSession, false);
        if (npcBid) {
          audioEngine.playSFX('click');
          const newRecord: AuctionBidRecord = {
            id: `bid_${Date.now()}`,
            bidderName: npcBid.nextBidder.name,
            bidderType: 'npc',
            amount: npcBid.bidAmount,
            timestamp: 'Vừa xong',
            quote: npcBid.quote
          };

          return {
            ...currentSession,
            currentPrice: npcBid.bidAmount,
            highestBidder: {
              name: npcBid.nextBidder.name,
              isPlayer: false,
              bidderId: npcBid.nextBidder.id
            },
            hammerCount: 0,
            status: 'bidding',
            bidHistory: [newRecord, ...currentSession.bidHistory.slice(0, 19)],
            narratorLog: `💥 [${npcBid.nextBidder.title} - ${npcBid.nextBidder.name}] bất ngờ đè giá: "${npcBid.quote}" (${npcBid.bidAmount.toLocaleString()} Linh Thạch)!`
          };
        } else {
          // Tiếp tục nhịp búa kế tiếp
          triggerHammerCountdown(fromCount + 1);
          return currentSession;
        }
      });
    }, 2200);
  }, [finalizeCurrentLot]);

  // ============================================
  // 4. NGƯỜI CHƠI TRẢ GIÁ (BID)
  // ============================================
  const placeBid = useCallback((bidType: 'normal' | 'aggressive') => {
    if (!session || session.status === 'sold' || session.status === 'finished') return;
    if (isBiddingRunning) return;

    const currentLot = session.items[session.currentItemIndex];
    if (!currentLot) return;

    const minIncrement = currentLot.minBidIncrement || 2000;
    const currentPrice = session.currentPrice;

    // Tính toán số tiền ra giá
    let increment = bidType === 'normal'
      ? Math.max(minIncrement, Math.floor(currentPrice * 0.08))
      : Math.max(minIncrement * 3, Math.floor(currentPrice * 0.28));

    // Làm tròn số chẵn 1,000
    increment = Math.ceil(increment / 1000) * 1000;
    const newPrice = currentPrice + increment;

    // Kiểm tra số dư Linh Thạch của người chơi
    if (player.linhThach < newPrice) {
      showToast(`Không đủ Linh Thạch! Cần ${newPrice.toLocaleString()} Linh Thạch (Hiện có: ${player.linhThach.toLocaleString()}).`);
      return;
    }

    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (npcDeliberationTimerRef.current) clearTimeout(npcDeliberationTimerRef.current);

    audioEngine.playSFX('click');
    setIsBiddingRunning(true);

    const playerRecord: AuctionBidRecord = {
      id: `bid_${Date.now()}`,
      bidderName: 'Đạo Hữu (Ngươi)',
      bidderType: 'player',
      amount: newPrice,
      timestamp: 'Vừa xong',
      quote: bidType === 'aggressive'
        ? `Ta ra giá ${newPrice.toLocaleString()} Linh Thạch! Ai dám cản đường?!`
        : `Ta theo giá ${newPrice.toLocaleString()} Linh Thạch!`
    };

    const updatedSession: AuctionSessionState = {
      ...session,
      currentPrice: newPrice,
      highestBidder: {
        name: 'Đạo Hữu (Ngươi)',
        isPlayer: true,
        bidderId: 'player'
      },
      hammerCount: 0,
      status: 'bidding',
      bidHistory: [playerRecord, ...session.bidHistory.slice(0, 19)],
      narratorLog: bidType === 'aggressive'
        ? `🔥 Ngươi dằn mặt toàn trường, hét lớn: "${newPrice.toLocaleString()} Linh Thạch!" Toàn bộ hội trường ồ lên kinh ngạc!`
        : `Ngươi giơ thẻ bài ra giá: "${newPrice.toLocaleString()} Linh Thạch!"`
    };

    setSession(updatedSession);

    // Cho NPC suy ngẫm từ 1.2s - 2.2s trước khi phản ứng
    npcDeliberationTimerRef.current = setTimeout(() => {
      setIsBiddingRunning(false);

      const npcBid = calculateNextNPCBid(updatedSession, true);
      if (npcBid) {
        audioEngine.playSFX('click');
        const npcRecord: AuctionBidRecord = {
          id: `bid_${Date.now()}`,
          bidderName: npcBid.nextBidder.name,
          bidderType: 'npc',
          amount: npcBid.bidAmount,
          timestamp: 'Vừa xong',
          quote: npcBid.quote
        };

        const postNpcSession: AuctionSessionState = {
          ...updatedSession,
          currentPrice: npcBid.bidAmount,
          highestBidder: {
            name: npcBid.nextBidder.name,
            isPlayer: false,
            bidderId: npcBid.nextBidder.id
          },
          hammerCount: 0,
          status: 'bidding',
          bidHistory: [npcRecord, ...updatedSession.bidHistory.slice(0, 19)],
          narratorLog: `⚡ [${npcBid.nextBidder.title} - ${npcBid.nextBidder.name}] lập tức phản kích: "${npcBid.quote}" (${npcBid.bidAmount.toLocaleString()} Linh Thạch)!`
        };

        setSession(postNpcSession);

        // Sau khi NPC ra giá, bắt đầu đếm búa sau 3 giây nếu người chơi không trả giá tiếp
        hammerTimerRef.current = setTimeout(() => {
          triggerHammerCountdown(1);
        }, 3000);
      } else {
        // Toàn bộ NPC chùn bước, bắt đầu nhịp đếm búa cho người chơi
        triggerHammerCountdown(1);
      }
    }, 1500);
  }, [session, player.linhThach, isBiddingRunning, showToast, triggerHammerCountdown]);

  // ============================================
  // 5. THẦN THỨC ÁP CHẾ (SOUL PRESSURE)
  // ============================================
  const useSoulIntimidation = useCallback((targetNpcId?: string) => {
    if (!session || session.status === 'sold' || session.status === 'finished') return;
    const leadingNpcId = (!session.highestBidder.isPlayer && session.highestBidder.bidderId !== 'auctioneer')
      ? session.highestBidder.bidderId
      : undefined;
    const res = attemptSoulIntimidation(player.thanThuc || 30, session.npcs, targetNpcId, leadingNpcId);
    if (!res) {
      showToast('Không còn đối thủ nào khả dụng để áp chế thần thức!');
      return;
    }

    if (res.success) {
      audioEngine.playSFX('thunder');
      showToast(res.message);
      addLog('Thần Thức Áp Chế', res.message, 'breakthrough');
    } else {
      audioEngine.playSFX('thunder');
      showToast(res.message);
      addLog('Thần Thức Bị Phản Phệ', res.message, 'danger');

      // Giảm Chân Nguyên nếu bị phản phệ
      if (res.backlashCost > 0) {
        setPlayer(prev => ({
          ...prev,
          linhLuc: Math.max(1, (prev.linhLuc || 100) - res.backlashCost)
        }));
      }
    }

    setSession(prev => {
      if (!prev) return null;
      const updatedNpcs = prev.npcs.map(npc => npc.id === res.affectedNpc.id ? { ...res.affectedNpc } : npc);
      return {
        ...prev,
        npcs: updatedNpcs,
        narratorLog: res.message
      };
    });

    // Nếu người chơi đang dẫn đầu và đối thủ bị dọa sợ, kích hoạt đếm búa ngay
    if (session.highestBidder.isPlayer && res.success) {
      triggerHammerCountdown(1);
    }
  }, [session, player.thanThuc, isBiddingRunning, setPlayer, showToast, addLog, triggerHammerCountdown]);

  // ============================================
  // 6. BỎ QUA / NHƯỜNG LÔ HIỆN TẠI (PASS)
  // ============================================
  const passCurrentLot = useCallback(() => {
    if (!session || session.status === 'sold' || session.status === 'finished') return;

    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (npcDeliberationTimerRef.current) clearTimeout(npcDeliberationTimerRef.current);

    showToast('Ngươi thu tay, nhường quyền tranh đoạt lô này cho các vị đồng đạo.');

    // Nếu người chơi không dẫn đầu, để NPC tự động kết thúc hoặc thành giao
    if (session.highestBidder.isPlayer) {
      finalizeCurrentLot(session);
      return;
    }

    finalizeCurrentLot(session);
  }, [session, showToast, finalizeCurrentLot]);

  // ============================================
  // 7. CHUYỂN SANG LÔ ĐẤU GIÁ KẾ TIẾP
  // ============================================
  const nextLot = useCallback(() => {
    if (!session) return;
    const nextIdx = session.currentItemIndex + 1;

    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (npcDeliberationTimerRef.current) clearTimeout(npcDeliberationTimerRef.current);

    if (nextIdx >= session.items.length) {
      // Đã đấu giá hết toàn bộ các lô
      setSession(prev => prev ? {
        ...prev,
        status: 'finished',
        narratorLog: '🏆 Đấu Giá Sư cúi đầu tạ lễ: "Vạn Bảo Đấu Giá Đại Hội hôm nay đã viên mãn kết thúc! Kính chúc chư vị đạo hữu đạo đồ thuận buồm xuôi gió!"'
      } : null);
      showToast('Phiên Đấu Giá Hội đã viên mãn bế mạc!');
      return;
    }

    const nextLotItem = session.items[nextIdx];
    const isBreakthrough = Boolean(session.isBreakthroughEvent);
    // Reset trạng thái bỏ cuộc của các NPC và tính toán lại ngân sách theo giá ước tính của lô mới
    const resetNpcs = session.npcs.map(npc => {
      const role = npc.roleType || 'tan_tu';
      const newCeiling = calculateNpcBudgetForLot(role, nextLotItem.reservePrice, isBreakthrough);
      return {
        ...npc,
        budget: newCeiling,
        originalBudget: newCeiling,
        budgetCeiling: newCeiling,
        hasFolded: false,
        isIntimidated: false,
        intimidateCount: 0,
        intimidateStatusText: undefined
      };
    });

    const newStartRecord: AuctionBidRecord = {
      id: `bid_lot_${nextIdx}_${Date.now()}`,
      bidderName: 'Đấu Giá Sư',
      bidderType: 'npc',
      amount: nextLotItem.startingPrice,
      timestamp: 'Vừa xong',
      quote: `Khai mở lô đấu giá thứ ${nextIdx + 1}: [${nextLotItem.name}]! Giá khởi điểm ${nextLotItem.startingPrice.toLocaleString()} Linh Thạch (Ước tính: ~${nextLotItem.reservePrice.toLocaleString()} LT)!`
    };

    setSession({
      ...session,
      currentItemIndex: nextIdx,
      currentPrice: nextLotItem.startingPrice,
      highestBidder: {
        name: 'Đấu Giá Sư',
        isPlayer: false,
        bidderId: 'auctioneer'
      },
      hammerCount: 0,
      npcs: resetNpcs,
      bidHistory: [newStartRecord],
      status: 'bidding',
      narratorLog: `Đấu Giá Sư vén màn lụa đỏ: "Lô đấu giá tiếp theo: [${nextLotItem.name}]! ${nextLotItem.lore}"`
    });

    audioEngine.playSFX('click');
  }, [session, showToast]);

  // ============================================
  // 8. ĐÓNG MODAL ĐẤU GIÁ
  // ============================================
  const closeAuction = useCallback(() => {
    if (hammerTimerRef.current) clearTimeout(hammerTimerRef.current);
    if (npcDeliberationTimerRef.current) clearTimeout(npcDeliberationTimerRef.current);
    setIsAuctionModalOpen(false);
  }, []);

  return {
    auctionSession: session,
    isAuctionModalOpen,
    setIsAuctionModalOpen,
    isBiddingRunning,
    startAuctionSession,
    placeBid,
    useSoulIntimidation,
    passCurrentLot,
    nextLot,
    closeAuction
  };
}
