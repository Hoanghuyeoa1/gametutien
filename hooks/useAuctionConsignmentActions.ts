'use client';
// hooks/useAuctionConsignmentActions.ts
// Custom domain hook điều phối toàn bộ phiên Đấu Giá Ký Gửi & Thao Túng Phường Thị

import { useState, useCallback, useMemo } from 'react';
import type { PlayerStats } from '@/lib/types/player';
import type {
  ActiveConsignmentSession,
  ConsignmentItemSource,
  PlayerConsignmentState,
} from '@/lib/types/auction-consignment';
import {
  createDefaultConsignmentState,
  getReputationTier,
  getValidConsignmentItems,
  startConsignmentSession,
  simulateNextAuctionRound,
  executeDivineSensePressure,
  executeShillBid,
  finalizeConsignmentSession,
  redeemConfiscatedItem,
} from '@/lib/auction-consignment-logic';

interface UseAuctionConsignmentActionsProps {
  player: PlayerStats;
  setPlayer?: (updater: (prev: PlayerStats) => PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: any) => void;
}

export function useAuctionConsignmentActions({
  player,
  setPlayer,
  showToast,
  addLog,
}: UseAuctionConsignmentActionsProps) {
  const [isHammerHitting, setIsHammerHitting] = useState(false);
  const [selectedItemForListing, setSelectedItemForListing] = useState<ConsignmentItemSource | null>(null);

  // State ký gửi an toàn
  const consignmentState: PlayerConsignmentState = useMemo(() => {
    return player.consignmentState || createDefaultConsignmentState();
  }, [player.consignmentState]);

  const activeSession: ActiveConsignmentSession | null = consignmentState.activeSession;
  const reputationTier = useMemo(() => {
    return getReputationTier(consignmentState.merchantReputation);
  }, [consignmentState.merchantReputation]);

  const validItems = useMemo(() => {
    return getValidConsignmentItems(player);
  }, [player.inventory, (player as any).beastEggs, (player as any).manuals]);

  // ─── 1. Bắt Đầu Phiên Ký Gửi ───────────────────────────────────────────────
  const handleStartConsignment = useCallback((
    item: ConsignmentItemSource,
    startingPrice: number,
    reservePrice: number
  ) => {
    if (!setPlayer) return;

    try {
      const { nextPlayer, session } = startConsignmentSession(
        player,
        item,
        startingPrice,
        reservePrice
      );

      setPlayer(() => nextPlayer);
      setSelectedItemForListing(null);

      showToast?.(`🏷️ Đã niêm yết [${item.name}] lên sàn đấu giá thành công!`);
      addLog?.(
        'Ký Gửi Đấu Giá',
        `Đã đưa [${item.name}] lên sàn Vạn Bảo Các với giá khởi điểm ${startingPrice.toLocaleString()} Linh Thạch. Các đại năng thế gia đang tiến vào hội trường!`,
        'info'
      );
    } catch (err: any) {
      showToast?.(`❌ ${err.message || 'Không thể bắt đầu phiên ký gửi.'}`);
    }
  }, [player, setPlayer, showToast, addLog]);

  // ─── 2. Gõ Búa Sang Vòng Kế Tiếp ───────────────────────────────────────────
  const handleNextRound = useCallback(() => {
    if (!activeSession || !setPlayer) return;

    setIsHammerHitting(true);
    setTimeout(() => {
      setIsHammerHitting(false);
      const { nextSession, roundSummary } = simulateNextAuctionRound(activeSession, player);

      setPlayer(prev => ({
        ...prev,
        consignmentState: {
          ...(prev.consignmentState || createDefaultConsignmentState()),
          activeSession: nextSession,
        },
      }));

      showToast?.(roundSummary);

      if (nextSession.status === 'sold') {
        addLog?.(
          'Đấu Giá Kết Thúc',
          `Bảo vật [${nextSession.item.name}] đã được gõ búa bán thành công với mức giá ${nextSession.currentBid.toLocaleString()} Linh Thạch!`,
          'success'
        );
      } else if (nextSession.status === 'unsold') {
        addLog?.(
          'Đấu Giá Bất Thành',
          `Phiên đấu giá bảo vật [${nextSession.item.name}] kết thúc không thành công.`,
          'warning'
        );
      }
    }, 450);
  }, [activeSession, player, setPlayer, showToast, addLog]);

  // ─── 3. Dùng Thần Thức Dằn Mặt NPC ─────────────────────────────────────────
  const handleIntimidateBidder = useCallback((targetBidderId: string) => {
    if (!activeSession || !setPlayer) return;

    const { success, message, nextSession } = executeDivineSensePressure(
      activeSession,
      player,
      targetBidderId
    );

    setPlayer(prev => ({
      ...prev,
      consignmentState: {
        ...(prev.consignmentState || createDefaultConsignmentState()),
        activeSession: nextSession,
      },
    }));

    showToast?.(message);
    if (success) {
      addLog?.('Thần Thức Áp Chế', message, 'success');
    } else {
      addLog?.('Thần Thức Bị Phát Hiện', message, 'danger');
    }
  }, [activeSession, player, setPlayer, showToast, addLog]);

  // ─── 4. Cài Cắm Chân Gỗ Kích Giá Ảo ────────────────────────────────────────
  const handleTriggerShillBid = useCallback((helperName: string = 'Đạo Lữ / Đệ Tử') => {
    if (!activeSession || !setPlayer) return;

    const { busted, message, nextSession, reputationLost } = executeShillBid(
      activeSession,
      player,
      helperName
    );

    setPlayer(prev => ({
      ...prev,
      consignmentState: {
        ...(prev.consignmentState || createDefaultConsignmentState()),
        activeSession: nextSession,
      },
    }));

    showToast?.(message);

    if (busted) {
      addLog?.(
        '🚨 Bị Bóc Phốt Đấu Giá!',
        `Hội Chủ Vạn Bảo phát hiện chân gỗ giở trò gian lận! Vật phẩm bị tịch thu và bạn bị trừ ${reputationLost} điểm Uy Tín!`,
        'danger'
      );
    } else {
      addLog?.(
        'Cài Chân Gỗ Thành Công',
        `Chân gỗ ${helperName} đã kích giá ảo thành công lên ${nextSession.currentBid.toLocaleString()} Linh Thạch!`,
        'warning'
      );
    }
  }, [activeSession, player, setPlayer, showToast, addLog]);

  // ─── 5. Kết Toán & Rút Tiền Về Túi ─────────────────────────────────────────
  const handleFinalizeConsignment = useCallback(() => {
    if (!activeSession || !setPlayer) return;

    try {
      const { nextPlayer, profitEarned, reputationChange, message } = finalizeConsignmentSession(player);

      setPlayer(() => nextPlayer);
      showToast?.(message);

      if (profitEarned > 0) {
        addLog?.(
          'Thu Hoạch Ký Gửi Đấu Giá',
          `Đã chuyển ${profitEarned.toLocaleString()} Linh Thạch tiền lãi ròng vào Túi Trữ Vật. Uy Tín Thương Nhân: ${nextPlayer.consignmentState?.merchantReputation} điểm.`,
          'success'
        );
      }
    } catch (err: any) {
      showToast?.(`❌ ${err.message || 'Không thể kết toán phiên ký gửi.'}`);
    }
  }, [activeSession, player, setPlayer, showToast, addLog]);

  // ─── 6. Chuộc Lại Đồ Bị Tịch Thu ───────────────────────────────────────────
  const handleRedeemConfiscatedItem = useCallback((index: number) => {
    if (!setPlayer) return;

    try {
      const { nextPlayer, itemRedeemed } = redeemConfiscatedItem(player, index);
      setPlayer(() => nextPlayer);
      showToast?.(`📦 Đã nộp phạt và chuộc lại [${itemRedeemed.name}] vào Túi Trữ Vật thành công!`);
      addLog?.(
        'Chuộc Tang Vật',
        `Đã nộp phạt chuộc lại [${itemRedeemed.name}] từ Vạn Bảo Các.`,
        'info'
      );
    } catch (err: any) {
      showToast?.(`❌ ${err.message || 'Không thể chuộc lại vật phẩm.'}`);
    }
  }, [player, setPlayer, showToast, addLog]);

  return {
    consignmentState,
    activeSession,
    reputationTier,
    validItems,
    selectedItemForListing,
    setSelectedItemForListing,
    isHammerHitting,
    handleStartConsignment,
    handleNextRound,
    handleIntimidateBidder,
    handleTriggerShillBid,
    handleFinalizeConsignment,
    handleRedeemConfiscatedItem,
  };
}
