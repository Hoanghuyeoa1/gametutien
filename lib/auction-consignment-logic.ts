// lib/auction-consignment-logic.ts
// Pure Business Logic cho phân hệ "Ký Gửi Đấu Giá & Thao Túng Phường Thị (Player Auction Consignment & Market Manipulation)"

import type { PlayerStats } from './types/player';
import type {
  ActiveConsignmentSession,
  ConsignmentItemSource,
  ConsignmentItemType,
  ConsignmentTransactionRecord,
  NPCBidder,
  PlayerConsignmentState,
} from './types/auction-consignment';
import {
  NPC_BIDDERS_CATALOG,
  BIDDER_QUOTES,
  MERCHANT_REPUTATION_TIERS,
  MerchantReputationTierConfig,
} from './auction-consignment-data';

// ─── Khởi tạo State Mặc Định ──────────────────────────────────────────────────

export function createDefaultConsignmentState(): PlayerConsignmentState {
  return {
    merchantReputation: 50, // Khởi đầu ở mức Thương Nhân Đứng Đắn
    totalSalesVolume: 0,
    successfulAuctionsCount: 0,
    bustedCount: 0,
    activeSession: null,
    confiscatedItems: [],
    history: [],
  };
}

// ─── Xếp Hạng Uy Tín Thương Nhân ─────────────────────────────────────────────

export function getReputationTier(reputation: number): MerchantReputationTierConfig {
  const safeRep = Math.max(0, Math.min(100, reputation));
  const tier = MERCHANT_REPUTATION_TIERS.find(
    t => safeRep >= t.minReputation && safeRep <= t.maxReputation
  );
  return tier || MERCHANT_REPUTATION_TIERS[1];
}

// ─── Lọc Vật Phẩm Đủ Điều Kiện Ký Gửi ───────────────────────────────────────

/**
 * Quét toàn bộ túi đồ của người chơi, lọc ra các vật phẩm cực phẩm có thể ký gửi
 */
export function getValidConsignmentItems(player: PlayerStats): ConsignmentItemSource[] {
  const inventory = player.inventory;
  if (!inventory) return [];

  const items: ConsignmentItemSource[] = [];

  // 1. Đan Dược Cực Phẩm / Thần Phẩm / Tiên Phẩm
  if (Array.isArray(inventory.pills)) {
    inventory.pills.forEach((pill: any) => {
      const isRare =
        pill.grade?.includes('Cực') ||
        pill.grade?.includes('Thần') ||
        pill.grade?.includes('Tiên') ||
        pill.quality?.includes('cuc') ||
        pill.quality?.includes('than') ||
        pill.quality?.includes('tien') ||
        pill.tier >= 4 ||
        pill.price >= 5000;

      if (isRare && (pill.quantity || 1) > 0) {
        const estValue = Math.max(20000, (pill.price || 15000) * 2.5);
        items.push({
          id: pill.id || `pill_${pill.name}`,
          name: pill.name,
          type: 'pill',
          grade: pill.grade || 'Cực Phẩm',
          quality: pill.quality || 'cuc_pham',
          icon: pill.icon || '💊',
          description: pill.description || 'Đan dược trân quý ngưng tụ linh khí thiên địa.',
          estimatedMarketValue: Math.round(estValue),
          rawItemData: { ...pill, quantity: 1 },
        });
      }
    });
  }

  // 2. Trang Bị Bậc 7 - 9 hoặc Hoàng Kim
  if (Array.isArray(inventory.equipment)) {
    inventory.equipment.forEach((eq: any) => {
      const isHighTier =
        (eq.tier && eq.tier >= 6) ||
        eq.quality === 'mythic' ||
        eq.quality === 'legendary' ||
        eq.grade?.includes('Tiên') ||
        eq.grade?.includes('Đế');

      if (isHighTier && !eq.isEquipped) {
        const estValue = Math.max(40000, (eq.tier || 6) * 15000 + (eq.enhancement || 0) * 5000);
        items.push({
          id: eq.id || `eq_${eq.name}`,
          name: eq.name,
          type: 'equipment',
          grade: eq.grade || `Bậc ${eq.tier || 7}`,
          quality: eq.quality || 'legendary',
          icon: eq.icon || '⚔️',
          description: eq.description || 'Thần binh pháp bảo ẩn chứa uy năng kinh thế.',
          estimatedMarketValue: Math.round(estValue),
          rawItemData: { ...eq },
        });
      }
    });
  }

  // 3. Trứng Linh Thú (Linh Noãn)
  if (Array.isArray((player as any).beastEggs)) {
    (player as any).beastEggs.forEach((egg: any) => {
      const estValue = 60000 + (egg.rarityIndex || 3) * 25000;
      items.push({
        id: egg.id || `egg_${egg.name}`,
        name: egg.name || 'Linh Noãn Thần Thú',
        type: 'beast_egg',
        grade: egg.grade || 'Thần Noãn',
        quality: egg.quality || 'than_pham',
        icon: '🥚',
        description: egg.description || 'Trứng dị thú viễn cổ đang hấp thu nhật nguyệt tinh hoa.',
        estimatedMarketValue: Math.round(estValue),
        rawItemData: { ...egg },
      });
    });
  }

  // 4. Công Pháp & Bí Tịch Tuyệt Phẩm
  if (Array.isArray((player as any).manuals)) {
    (player as any).manuals.forEach((m: any) => {
      if (m.grade?.includes('Thiên') || m.grade?.includes('Thần') || m.tier >= 4) {
        const estValue = 50000 + (m.tier || 4) * 20000;
        items.push({
          id: m.id || `manual_${m.name}`,
          name: m.name,
          type: 'manual',
          grade: m.grade || 'Thiên Giai',
          quality: m.quality || 'tuyet_pham',
          icon: '📜',
          description: m.description || 'Pho bí tịch thất truyền ghi chép huyền cơ tu tiên.',
          estimatedMarketValue: Math.round(estValue),
          rawItemData: { ...m },
        });
      }
    });
  }

  return items;
}

// ─── Rút Vật Phẩm Khỏi Túi Đồ An Toàn ────────────────────────────────────────

export function removeConsignmentItemFromInventory(
  player: PlayerStats,
  item: ConsignmentItemSource
): PlayerStats {
  const inv = player.inventory;
  if (!inv) return player;

  const nextPlayer = { ...player };
  const nextInv = { ...inv };

  if (item.type === 'pill' && Array.isArray(nextInv.pills)) {
    nextInv.pills = nextInv.pills
      .map((p: any) => {
        if (p.id === item.id || p.name === item.name) {
          const qty = (p.quantity || 1) - 1;
          return qty > 0 ? { ...p, quantity: qty } : null;
        }
        return p;
      })
      .filter(Boolean);
  } else if (item.type === 'equipment' && Array.isArray(nextInv.equipment)) {
    nextInv.equipment = nextInv.equipment.filter((e: any) => e.id !== item.id);
  } else if (item.type === 'beast_egg' && Array.isArray((nextPlayer as any).beastEggs)) {
    (nextPlayer as any).beastEggs = (nextPlayer as any).beastEggs.filter((e: any) => e.id !== item.id);
  } else if (item.type === 'manual' && Array.isArray((nextPlayer as any).manuals)) {
    (nextPlayer as any).manuals = (nextPlayer as any).manuals.filter((m: any) => m.id !== item.id);
  }

  nextPlayer.inventory = nextInv;
  return nextPlayer;
}

// ─── Hoàn Trả Vật Phẩm Vào Túi Đồ Khi Đấu Giá Hỏng ───────────────────────────

export function returnConsignmentItemToInventory(
  player: PlayerStats,
  item: ConsignmentItemSource
): PlayerStats {
  const nextPlayer = { ...player };
  const nextInv = { ...(player.inventory || {}) };
  const raw = item.rawItemData;

  if (item.type === 'pill') {
    nextInv.pills = [...(nextInv.pills || [])];
    const existing = nextInv.pills.find((p: any) => p.name === raw.name);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      nextInv.pills.push({ ...raw, quantity: 1 });
    }
  } else if (item.type === 'equipment') {
    nextInv.equipment = [...(nextInv.equipment || []), raw];
  } else if (item.type === 'beast_egg') {
    (nextPlayer as any).beastEggs = [...((nextPlayer as any).beastEggs || []), raw];
  } else if (item.type === 'manual') {
    (nextPlayer as any).manuals = [...((nextPlayer as any).manuals || []), raw];
  }

  nextPlayer.inventory = nextInv as any;
  return nextPlayer;
}

// ─── Khởi Tạo Phiên Ký Gửi Đấu Giá Mới ───────────────────────────────────────

export function startConsignmentSession(
  player: PlayerStats,
  item: ConsignmentItemSource,
  startingPrice: number,
  reservePrice: number,
  now: number = Date.now()
): { nextPlayer: PlayerStats; session: ActiveConsignmentSession } {
  const consignmentState = player.consignmentState || createDefaultConsignmentState();
  const tier = getReputationTier(consignmentState.merchantReputation);

  // Tính phí niêm yết
  const listingFee = Math.floor(startingPrice * (tier.listingFeePercent / 100));
  const currentStones = player.spiritStones || player.linhThach || 0;

  if (currentStones < listingFee) {
    throw new Error(`Thiếu Linh Thạch nộp phí niêm yết sàn! Cần ${listingFee.toLocaleString()} LT, hiện có ${currentStones.toLocaleString()} LT.`);
  }

  // 1. Trừ phí niêm yết
  let nextPlayer: PlayerStats = {
    ...player,
    linhThach: Math.max(0, currentStones - listingFee),
    spiritStones: Math.max(0, currentStones - listingFee),
  };

  // 2. Rút vật phẩm khỏi kho đồ an toàn
  nextPlayer = removeConsignmentItemFromInventory(nextPlayer, item);

  // 3. Triệu tập 4-5 NPC Bidders ngẫu nhiên
  const shuffled = [...NPC_BIDDERS_CATALOG].sort(() => Math.random() - 0.5);
  const selectedBidders = shuffled.slice(0, 5).map(npc => ({
    ...npc,
    currentInterest: Math.min(100, 60 + Math.floor(Math.random() * 40)),
    hasWithdrawn: false,
    maxBudget: Math.max(startingPrice * 2.5, npc.maxBudget),
  }));

  const session: ActiveConsignmentSession = {
    item,
    startingPrice,
    reservePrice,
    currentBid: startingPrice,
    highestBidder: {
      name: 'Vạn Bảo Hội (Khởi Điểm)',
      isShill: false,
      title: 'Chủ Tọa Sàn Đấu',
    },
    currentRound: 1,
    maxRounds: 6,
    status: 'bidding',
    bidders: selectedBidders,
    bidHistory: [
      {
        round: 1,
        bidderName: 'Vạn Bảo Hội',
        bidderTitle: 'Chủ Tọa Sàn Đấu',
        isShill: false,
        bidAmount: startingPrice,
        timestamp: now,
        commentary: `Vật phẩm [${item.name}] bắt đầu lên sàn với giá khởi điểm ${startingPrice.toLocaleString()} Linh Thạch!`,
      },
    ],
    shillBidCount: 0,
    bustRiskPercent: 0,
    divineSenseUsedCount: 0,
    startedAt: now,
  };

  nextPlayer = {
    ...nextPlayer,
    consignmentState: {
      ...consignmentState,
      activeSession: session,
    },
  };

  return { nextPlayer, session };
}

// ─── Mô Phỏng Vòng Đấu Giá Kế Tiếp (Simulate Next Round) ────────────────────

export function simulateNextAuctionRound(
  session: ActiveConsignmentSession,
  player: PlayerStats,
  now: number = Date.now()
): { nextSession: ActiveConsignmentSession; roundSummary: string } {
  if (session.status !== 'bidding') {
    return { nextSession: session, roundSummary: 'Phiên đấu giá đã kết thúc.' };
  }

  const activeBidders = session.bidders.filter(b => !b.hasWithdrawn);
  let bestBidder: NPCBidder | null = null;
  let highestOfferedAmount = session.currentBid;

  // Lần lượt từng NPC cân nhắc nâng giá
  const updatedBidders = session.bidders.map(bidder => {
    if (bidder.hasWithdrawn) return bidder;

    // Kiểm tra nếu giá đã vượt quá ngân sách tối đa
    if (session.currentBid >= bidder.maxBudget) {
      return { ...bidder, hasWithdrawn: true };
    }

    // Tỷ lệ quyết định tăng giá dựa trên tính cách
    let bidChance = 0.5;
    let minIncreaseRatio = 0.1;
    let maxIncreaseRatio = 0.25;

    if (bidder.personality === 'tycoon') {
      bidChance = 0.85;
      minIncreaseRatio = 0.15;
      maxIncreaseRatio = 0.35;
    } else if (bidder.personality === 'aggressive') {
      bidChance = 0.75;
      minIncreaseRatio = 0.18;
      maxIncreaseRatio = 0.38;
    } else if (bidder.personality === 'greedy') {
      bidChance = 0.55;
      minIncreaseRatio = 0.08;
      maxIncreaseRatio = 0.18;
    } else if (bidder.personality === 'timid') {
      bidChance = 0.4;
      minIncreaseRatio = 0.05;
      maxIncreaseRatio = 0.14;
    }

    const wantsToBid = Math.random() < bidChance;
    if (!wantsToBid) {
      // NPC do dự hoặc rút lui
      if (Math.random() < 0.35) {
        return { ...bidder, hasWithdrawn: true };
      }
      return bidder;
    }

    // Tính mức giá NPC sẵn sàng trả
    const increaseRatio = minIncreaseRatio + Math.random() * (maxIncreaseRatio - minIncreaseRatio);
    const proposedBid = Math.min(
      bidder.maxBudget,
      Math.floor(session.currentBid * (1 + increaseRatio))
    );

    if (proposedBid > highestOfferedAmount) {
      highestOfferedAmount = proposedBid;
      bestBidder = bidder;
    }

    return bidder;
  });

  const nextRound = session.currentRound + 1;
  const isFinalRound = nextRound > session.maxRounds || !bestBidder;

  let nextBid = session.currentBid;
  let nextHighest = session.highestBidder;
  const updatedHistory = [...session.bidHistory];
  let roundSummary = '';

  if (bestBidder) {
    const winner: NPCBidder = bestBidder;
    nextBid = highestOfferedAmount;
    nextHighest = winner;

    const quotes = BIDDER_QUOTES[winner.personality] || BIDDER_QUOTES.tycoon;
    const commentary = quotes[Math.floor(Math.random() * quotes.length)];

    updatedHistory.push({
      round: session.currentRound,
      bidderName: winner.name,
      bidderTitle: winner.title,
      isShill: false,
      bidAmount: nextBid,
      timestamp: now,
      commentary,
    });

    roundSummary = `[${winner.name}] giơ biển nâng giá lên ${nextBid.toLocaleString()} Linh Thạch!`;
  } else {
    roundSummary = 'Các đại năng đều đang lưỡng lự, không ai ra giá mới!';
  }

  // Kết thúc phiên nếu đạt vòng tối đa hoặc không còn ai nâng giá
  let finalStatus: import('./types/auction-consignment').ConsignmentStatus = session.status;
  if (isFinalRound) {
    if (nextHighest && 'isShill' in nextHighest && nextHighest.isShill) {
      // Tự ôm bom: Chân gỗ trả giá cao nhất nhưng không có ai khác đu theo!
      finalStatus = 'unsold';
      roundSummary = '⚠️ Tự ôm bom! Chân gỗ trả giá cao nhất, không ai theo tiếp. Phiên đấu giá kết thúc!';
    } else if (nextBid >= session.reservePrice) {
      finalStatus = 'sold';
      roundSummary = `🎉 Gõ búa lần 3! Món bảo vật đã thuộc về [${(nextHighest as any).name}] với mức giá ${nextBid.toLocaleString()} Linh Thạch!`;
    } else {
      finalStatus = 'unsold';
      roundSummary = `Chưa đạt Giá Bảo Lưu (${session.reservePrice.toLocaleString()} LT). Phiên đấu giá không thành!`;
    }
  }

  const nextSession: ActiveConsignmentSession = {
    ...session,
    currentRound: nextRound,
    currentBid: nextBid,
    highestBidder: nextHighest,
    bidders: updatedBidders,
    bidHistory: updatedHistory,
    status: finalStatus,
  };

  return { nextSession, roundSummary };
}

// ─── Chiêu Thức 1: Thần Thức Dằn Mặt (Divine Sense Intimidation) ─────────────

export interface DivineSenseResult {
  success: boolean;
  message: string;
  nextSession: ActiveConsignmentSession;
}

export function executeDivineSensePressure(
  session: ActiveConsignmentSession,
  player: PlayerStats,
  targetBidderId: string,
  now: number = Date.now()
): DivineSenseResult {
  if (session.status !== 'bidding') {
    return { success: false, message: 'Phiên đấu giá không trong trạng thái trả giá.', nextSession: session };
  }

  const targetBidder = session.bidders.find(b => b.id === targetBidderId);
  if (!targetBidder || targetBidder.hasWithdrawn) {
    return { success: false, message: 'Mục tiêu không tồn tại hoặc đã rút lui khỏi sàn.', nextSession: session };
  }

  const playerSoul = player.thanThuc || (player as any).stats?.thanThuc || 40;
  const soulDiff = playerSoul - targetBidder.divineSense;
  const successChance = Math.min(92, Math.max(12, 50 + soulDiff * 1.6));
  const roll = Math.random() * 100;
  const success = roll <= successChance;

  let nextSession = { ...session };
  let message = '';

  if (success) {
    // Ép NPC hoảng sợ nâng giá vọt thêm 25% - 45%
    const boostRatio = 1.25 + Math.random() * 0.2;
    const newBid = Math.floor(session.currentBid * boostRatio);

    const quotes = BIDDER_QUOTES.intimidated;
    const commentary = quotes[Math.floor(Math.random() * quotes.length)];

    nextSession = {
      ...nextSession,
      currentBid: newBid,
      highestBidder: targetBidder,
      divineSenseUsedCount: session.divineSenseUsedCount + 1,
      bidHistory: [
        ...session.bidHistory,
        {
          round: session.currentRound,
          bidderName: targetBidder.name,
          bidderTitle: targetBidder.title,
          isShill: false,
          bidAmount: newBid,
          timestamp: now,
          commentary: `👁️ [Thần Thức Áp Chế] ${commentary}`,
        },
      ],
    };

    message = `Uy áp Thần Thức thành công! [${targetBidder.name}] run sợ vội vàng nâng giá vọt lên ${newBid.toLocaleString()} Linh Thạch!`;
  } else {
    // Phản phệ: NPC phát hiện uy áp thô thiển, tức giận bỏ về
    const updatedBidders = session.bidders.map(b =>
      b.id === targetBidderId ? { ...b, hasWithdrawn: true } : b
    );

    nextSession = {
      ...nextSession,
      bidders: updatedBidders,
      divineSenseUsedCount: session.divineSenseUsedCount + 1,
      bidHistory: [
        ...session.bidHistory,
        {
          round: session.currentRound,
          bidderName: targetBidder.name,
          bidderTitle: targetBidder.title,
          isShill: false,
          bidAmount: session.currentBid,
          timestamp: now,
          commentary: `Hừ! Có kẻ dùng Thần Thức thăm dò lão phu?! Thật vô lễ, lão phu không thèm tiếp tục dây dưa!`,
        },
      ],
    };

    message = `Thần Thức dằn mặt thất bại! [${targetBidder.name}] nhận ra có kẻ giở trò, tức giận phất tay áo rời khỏi sàn đấu giá!`;
  }

  return { success, message, nextSession };
}

// ─── Chiêu Thức 2: Cài Cắm Chân Gỗ Kích Giá Ảo (Shill Bidding) ───────────────

export interface ShillBidResult {
  busted: boolean;
  message: string;
  nextSession: ActiveConsignmentSession;
  reputationLost: number;
}

export function executeShillBid(
  session: ActiveConsignmentSession,
  player: PlayerStats,
  helperName: string = 'Đạo Lữ / Đệ Tử',
  now: number = Date.now()
): ShillBidResult {
  if (session.status !== 'bidding') {
    return { busted: false, message: 'Phiên đấu giá không trong trạng thái trả giá.', nextSession: session, reputationLost: 0 };
  }

  const shillCount = session.shillBidCount + 1;
  // Nguy cơ bóc phốt tăng dần theo số lần cài chân gỗ
  const riskIncrement = shillCount === 1 ? 20 : shillCount === 2 ? 30 : 40;
  const newBustRisk = Math.min(95, session.bustRiskPercent + riskIncrement);

  const roll = Math.random() * 100;
  const isBusted = roll < newBustRisk;

  if (isBusted) {
    // ─── BỊ BÓC PHỐT (BUSTED)! ───
    const nextSession: ActiveConsignmentSession = {
      ...session,
      status: 'busted',
      shillBidCount: shillCount,
      bustRiskPercent: newBustRisk,
      bidHistory: [
        ...session.bidHistory,
        {
          round: session.currentRound,
          bidderName: 'Hội Chủ Vạn Bảo',
          bidderTitle: 'Chấp Pháp Trưởng Lão',
          isShill: false,
          bidAmount: session.currentBid,
          timestamp: now,
          commentary: `🚨 GIAN THƯƠNG ĐÁNG CHẾT! Dám cài cắm chân gỗ kích giá ảo làm loạn hội trường! Tịch thu tang vật giam 24 giờ!`,
        },
      ],
    };

    return {
      busted: true,
      message: `🚨 BỊ BÓC PHỐT! Hội Chủ Vạn Bảo đập bàn bắt quả tang chân gỗ của bạn! Phiên đấu giá bị hủy, vật phẩm bị tịch thu và bạn bị trừ 25 điểm Uy Tín!`,
      nextSession,
      reputationLost: 25,
    };
  } else {
    // ─── KÍCH GIÁ THÀNH CÔNG ───
    const boostRatio = 1.3 + Math.random() * 0.15; // Tăng +30% đến +45%
    const newBid = Math.floor(session.currentBid * boostRatio);

    const quotes = BIDDER_QUOTES.shill;
    const commentary = quotes[Math.floor(Math.random() * quotes.length)];

    const nextSession: ActiveConsignmentSession = {
      ...session,
      currentBid: newBid,
      highestBidder: {
        name: `${helperName} (Chân Gỗ)`,
        isShill: true,
        title: 'Bí Mật Khách VIP',
      },
      shillBidCount: shillCount,
      bustRiskPercent: newBustRisk,
      bidHistory: [
        ...session.bidHistory,
        {
          round: session.currentRound,
          bidderName: `${helperName} (Chân Gỗ)`,
          bidderTitle: 'Bí Mật Khách VIP',
          isShill: true,
          bidAmount: newBid,
          timestamp: now,
          commentary: `🎭 ${commentary}`,
        },
      ],
    };

    return {
      busted: false,
      message: `Cài chân gỗ thành công! Giá bảo vật vọt lên ${newBid.toLocaleString()} Linh Thạch! (Nguy cơ bóc phốt hiện tại: ${newBustRisk}%)`,
      nextSession,
      reputationLost: 0,
    };
  }
}

// ─── Kết Toán & Nhận Tiền Về Túi (Finalize & Claim) ─────────────────────────

export interface FinalizeConsignmentResult {
  nextPlayer: PlayerStats;
  profitEarned: number;
  reputationChange: number;
  message: string;
}

export function finalizeConsignmentSession(
  player: PlayerStats,
  now: number = Date.now()
): FinalizeConsignmentResult {
  const consignmentState = player.consignmentState || createDefaultConsignmentState();
  const session = consignmentState.activeSession;

  if (!session) {
    throw new Error('Không có phiên đấu giá nào đang diễn ra để kết toán.');
  }

  const tier = getReputationTier(consignmentState.merchantReputation);
  let nextPlayer = { ...player };
  let profitEarned = 0;
  let reputationChange = 0;
  let message = '';

  if (session.status === 'sold') {
    // Bán thành công: Thu tiền, trừ hoa hồng sàn
    const finalPrice = session.currentBid;
    const commission = Math.floor(finalPrice * (tier.finalCommissionPercent / 100));
    const bonusProceeds = Math.floor(finalPrice * (tier.bonusProceedsPercent / 100));
    profitEarned = finalPrice - commission + bonusProceeds;

    reputationChange = Math.floor(3 + Math.random() * 5); // Tăng +3 đến +7 điểm Uy Tín
    const nextRep = Math.min(100, consignmentState.merchantReputation + reputationChange);

    const buyerName = (session.highestBidder as any).name || 'Khách Mua Ẩn Danh';

    const newRecord: ConsignmentTransactionRecord = {
      itemName: session.item.name,
      finalPrice,
      profit: profitEarned,
      soldTo: buyerName,
      timestamp: now,
    };

    const currentStones = nextPlayer.spiritStones || nextPlayer.linhThach || 0;
    nextPlayer = {
      ...nextPlayer,
      spiritStones: currentStones + profitEarned,
      linhThach: currentStones + profitEarned,
      consignmentState: {
        ...consignmentState,
        merchantReputation: nextRep,
        totalSalesVolume: consignmentState.totalSalesVolume + profitEarned,
        successfulAuctionsCount: consignmentState.successfulAuctionsCount + 1,
        activeSession: null,
        history: [newRecord, ...consignmentState.history.slice(0, 29)],
      },
    };

    message = `🎉 Đại kết toán! Bảo vật [${session.item.name}] bán được ${finalPrice.toLocaleString()} LT, thu về ${profitEarned.toLocaleString()} LT (sau hoa hồng)! Uy Tín +${reputationChange}!`;
  } else if (session.status === 'busted') {
    // Bị bóc phốt: Tịch thu đồ giam 24h, phạt tiền
    const fineAmount = Math.floor(session.item.estimatedMarketValue * 0.15);
    const confiscatedUntilTimestamp = now + 24 * 3600 * 1000;

    reputationChange = -25;
    const nextRep = Math.max(0, consignmentState.merchantReputation - 25);

    nextPlayer = {
      ...nextPlayer,
      consignmentState: {
        ...consignmentState,
        merchantReputation: nextRep,
        bustedCount: consignmentState.bustedCount + 1,
        activeSession: null,
        confiscatedItems: [
          ...consignmentState.confiscatedItems,
          {
            item: session.item,
            confiscatedUntilTimestamp,
            fineAmount,
          },
        ],
      },
    };

    message = `🚨 Phiên đấu giá bị tịch thu do bóc phốt! Món đồ bị niêm phong 24h tại Vạn Bảo Các, Uy Tín giảm 25 điểm.`;
  } else {
    // Đấu giá không thành (unsold / tự ôm bom): Hoàn trả lại vật phẩm vào túi
    nextPlayer = returnConsignmentItemToInventory(nextPlayer, session.item);

    // Nếu tự ôm bom: Phạt hoa hồng 10%
    const isShillBom = session.highestBidder && 'isShill' in session.highestBidder && session.highestBidder.isShill;
    if (isShillBom) {
      const penaltyFee = Math.floor(session.currentBid * 0.08);
      const currentStones = nextPlayer.spiritStones || nextPlayer.linhThach || 0;
      nextPlayer.spiritStones = Math.max(0, currentStones - penaltyFee);
      nextPlayer.linhThach = Math.max(0, currentStones - penaltyFee);
      message = `⚠️ Tự ôm bom! Chân gỗ của bạn thắng đấu giá, phải bồi hoàn ${penaltyFee.toLocaleString()} LT hoa hồng sàn! Vật phẩm được hoàn trả về túi.`;
    } else {
      message = `Bảo vật chưa đạt Giá Bảo Lưu, đã được an toàn hoàn trả về Túi Trữ Vật của đạo hữu.`;
    }

    nextPlayer = {
      ...nextPlayer,
      consignmentState: {
        ...consignmentState,
        activeSession: null,
      },
    };
  }

  return { nextPlayer, profitEarned, reputationChange, message };
}

// ─── Chuộc Lại Vật Phẩm Bị Tịch Thu ──────────────────────────────────────────

export function redeemConfiscatedItem(
  player: PlayerStats,
  index: number,
  now: number = Date.now()
): { nextPlayer: PlayerStats; itemRedeemed: ConsignmentItemSource } {
  const consignmentState = player.consignmentState;
  if (!consignmentState || !consignmentState.confiscatedItems[index]) {
    throw new Error('Không tìm thấy vật phẩm bị tịch thu tương ứng.');
  }

  const record = consignmentState.confiscatedItems[index];
  if (now < record.confiscatedUntilTimestamp) {
    const hoursLeft = Math.ceil((record.confiscatedUntilTimestamp - now) / (3600 * 1000));
    throw new Error(`Chưa hết thời hạn thụ án niêm phong! Còn khoảng ${hoursLeft} giờ nữa mới được chuộc đồ.`);
  }

  const currentStones = player.spiritStones || player.linhThach || 0;
  if (currentStones < record.fineAmount) {
    throw new Error(`Thiếu Linh Thạch nộp phạt! Cần ${record.fineAmount.toLocaleString()} LT để chuộc lại tang vật.`);
  }

  // Trừ tiền phạt và trả lại đồ
  let nextPlayer: PlayerStats = {
    ...player,
    linhThach: Math.max(0, currentStones - record.fineAmount),
    spiritStones: Math.max(0, currentStones - record.fineAmount),
  };

  nextPlayer = returnConsignmentItemToInventory(nextPlayer, record.item);

  const updatedConfiscated = consignmentState.confiscatedItems.filter((_, i) => i !== index);
  nextPlayer = {
    ...nextPlayer,
    consignmentState: {
      ...consignmentState,
      confiscatedItems: updatedConfiscated,
    },
  };

  return { nextPlayer, itemRedeemed: record.item };
}
