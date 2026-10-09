// lib/black-market-auction-logic.ts
// Pure Business Logic cho phân hệ:
// "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"
// Ràng buộc bất biến: 100% logic thuần túy, không phụ thuộc React state hay Hook

import {
  BlackMarketLot,
  BlackMarketSessionState,
  MoonPhase,
  RaidResolutionChoice,
  RaidResolutionResult,
  ContrabandCategory
} from './types/black-market';
import { PlayerStats, BeastEgg } from './types';

// ============================================================
// 1. CHU KỲ TRĂNG TRÒN (FULL MOON / VỌNG NGUYỆT CHI DẠ)
// ============================================================
/**
 * Thẩm định chu kỳ thiên văn dựa trên số ngày tu tiên.
 * Chu kỳ 30 ngày: Ngày 14, 15, 16 là Đêm Trăng Tròn (Full Moon) -> Hắc Thị mở cửa.
 */
export function evaluateMoonPhase(dayNumber: number): {
  currentMoonPhase: MoonPhase;
  isAuctionOpen: boolean;
  dayInCycle: number;
  nextOpenGameDay: number;
} {
  const safeDay = Math.max(1, Math.floor(dayNumber || 1));
  const dayInCycle = ((safeDay - 1) % 30) + 1; // 1 -> 30

  let currentMoonPhase: MoonPhase = 'waxing';
  let isAuctionOpen = false;

  if (dayInCycle >= 14 && dayInCycle <= 16) {
    currentMoonPhase = 'full_moon';
    isAuctionOpen = true;
  } else if (dayInCycle < 14) {
    currentMoonPhase = 'waxing';
    isAuctionOpen = false;
  } else if (dayInCycle >= 17 && dayInCycle <= 28) {
    currentMoonPhase = 'waning';
    isAuctionOpen = false;
  } else {
    currentMoonPhase = 'new_moon';
    isAuctionOpen = false;
  }

  // Tính ngày mở cửa tiếp theo
  let nextOpenGameDay = safeDay;
  if (isAuctionOpen) {
    nextOpenGameDay = safeDay; // Hiện tại đang mở
  } else if (dayInCycle < 14) {
    nextOpenGameDay = safeDay + (14 - dayInCycle);
  } else {
    nextOpenGameDay = safeDay + (30 - dayInCycle) + 14;
  }

  return {
    currentMoonPhase,
    isAuctionOpen,
    dayInCycle,
    nextOpenGameDay
  };
}

// ============================================================
// 2. KHO MẪU CẤM PHẨM TÀ ĐẠO & DANH SÁCH NPC MA ĐẦU
// ============================================================
export const CONTRABAND_TEMPLATES: {
  itemId: string;
  itemName: string;
  category: ContrabandCategory;
  rarityTier: number;
  basePrice: number;
  description: string;
  bustRiskAdded: number;
  attachedEggData?: any;
}[] = [
  {
    itemId: 'contra_pill_01',
    itemName: 'Huyết Linh Đoạt Hồn Đan',
    category: 'forbidden_pill',
    rarityTier: 4,
    basePrice: 25000,
    description: 'Đan dược ma đạo luyện từ vạn sinh hồn, tăng vọt 35% xác suất phá vỡ bình cảnh nhưng sinh ra tâm ma ám ảnh.',
    bustRiskAdded: 8
  },
  {
    itemId: 'contra_pill_02',
    itemName: 'Thiên Ma Huyết Sát Đan',
    category: 'forbidden_pill',
    rarityTier: 6,
    basePrice: 50000,
    description: 'Tuyệt phẩm ma đan kích phát tiềm năng huyết mạch, tăng 50% Công Kích trong 3 hiệp sinh tử.',
    bustRiskAdded: 12
  },
  {
    itemId: 'contra_art_01',
    itemName: 'Vạn Ma Phệ Hồn Phiến',
    category: 'demonic_artifact',
    rarityTier: 5,
    basePrice: 60000,
    description: 'Pháp bảo tà khí phong ấn u hồn lệ quỷ, khi vung quạt phát xuất âm phong ăn mòn 30% chân khí đối phương.',
    bustRiskAdded: 10
  },
  {
    itemId: 'contra_art_02',
    itemName: 'Hắc Long Nghịch Lân Thương',
    category: 'demonic_artifact',
    rarityTier: 7,
    basePrice: 120000,
    description: 'Thần binh đúc từ nghịch lân hắc long sa đọa, mang theo oán niệm thái cổ gây sát thương chuẩn xuyên giáp.',
    bustRiskAdded: 15
  },
  {
    itemId: 'contra_art_03',
    itemName: 'U Hồn Câu Hồn Kính',
    category: 'demonic_artifact',
    rarityTier: 4,
    basePrice: 35000,
    description: 'Gương ma câu hồn nhiếp phách, làm chậm 25% tốc độ xuất chiêu của đối thủ trong giao tranh.',
    bustRiskAdded: 7
  },
  {
    itemId: 'contra_tome_01',
    itemName: 'Thôn Thiên Ma Kinh Tàn Quyển',
    category: 'cursed_tome',
    rarityTier: 8,
    basePrice: 150000,
    description: 'Cấm thuật tà đạo ghi chép bí pháp thôn phệ tu vi của vạn vật thiên địa để thăng tiến đại cảnh giới.',
    bustRiskAdded: 18
  },
  {
    itemId: 'contra_tome_02',
    itemName: 'Huyết Ảnh Thần Hành Độn Thuật',
    category: 'cursed_tome',
    rarityTier: 5,
    basePrice: 45000,
    description: 'Thân pháp tà môn thiêu đốt tinh huyết để hóa thân thành huyết ảnh đào tẩu trong gang tấc.',
    bustRiskAdded: 9
  },
  {
    itemId: 'contra_egg_01',
    itemName: 'Linh Noãn Cửu U Ma Tước',
    category: 'heretical_egg',
    rarityTier: 6,
    basePrice: 85000,
    description: 'Trứng ma cầm dị chủng sinh ra nơi U Minh Huyết Trì. Nở ra Cửu U Ma Tước mang thần thông Tru Hồn Ma Lôi.',
    bustRiskAdded: 14,
    attachedEggData: {
      name: 'Linh Noãn Cửu U Ma Tước',
      element: 'am',
      quality: 'tuyet_pham',
      rarity: 5,
      isHeretical: true,
      predictedMutations: ['Ma Lôi Quán Thể', 'Cửu U Lệ Trảo', 'Thôn Hồn Dực']
    }
  },
  {
    itemId: 'contra_egg_02',
    itemName: 'Linh Noãn Huyết Nhãn Ma Viên',
    category: 'heretical_egg',
    rarityTier: 5,
    basePrice: 65000,
    description: 'Linh noãn vượn ma mắt máu, ấp nở dị thú hung tợn với sức mạnh cuồng bạo xé rách pháp trận.',
    bustRiskAdded: 11,
    attachedEggData: {
      name: 'Linh Noãn Huyết Nhãn Ma Viên',
      element: 'hoa',
      quality: 'cuc_pham',
      rarity: 4,
      isHeretical: true,
      predictedMutations: ['Huyết Nộ Cuồng Thể', 'Kim Cang Ma Nhục']
    }
  },
  {
    itemId: 'contra_ore_01',
    itemName: 'Hỗn Độn Ma Cốt',
    category: 'abyssal_ore',
    rarityTier: 5,
    basePrice: 40000,
    description: 'Khối xương hóa thạch của cự ma thái cổ, dùng làm tài liệu rèn đúc pháp bảo tà đạo cực phẩm.',
    bustRiskAdded: 8
  },
  {
    itemId: 'contra_ore_02',
    itemName: 'U Minh Ma Tinh Thạch',
    category: 'abyssal_ore',
    rarityTier: 4,
    basePrice: 30000,
    description: 'Khoáng thạch cực âm ngưng kết dưới đáy cửu tuyền, tỏa ra hàn khí ma tính bức người.',
    bustRiskAdded: 6
  }
];

export const NPC_MA_DAU_NAMES = [
  'Hắc Xà Lão Quái',
  'Cốt Ma Tôn Giả',
  'Huyết Ảnh Cuồng Nhân',
  'Cửu U Ma Nữ',
  'U Minh Tà Tôn',
  'Huyết Sát Tà Quân',
  'Độc Cốc Lão Ma',
  'Vô Thường Quỷ Tướng',
  'Thi La Sát',
  'Bách Quỷ Dạ Hành Lão Tổ'
];

// ============================================================
// 3. TỰ ĐỘNG SINH DANH MỤC HÀNG ĐẤU GIÁ (AUCTION LOT GENERATOR)
// ============================================================
/**
 * Tự động sinh ngẫu nhiên 4 - 6 lô hàng cấm phẩm trên sàn Hắc Thị.
 * Giá khởi điểm bằng 1.5x - 2.0x giá trị gốc thị trường.
 */
export function generateBlackMarketLots(
  dayNumber: number,
  playerRealmIndex: number = 0
): BlackMarketLot[] {
  const lotCount = Math.floor(Math.random() * 3) + 4; // 4 - 6 lô hàng
  const shuffled = [...CONTRABAND_TEMPLATES].sort(() => 0.5 - Math.random());
  const selectedTemplates = shuffled.slice(0, lotCount);

  return selectedTemplates.map((template, idx) => {
    // Giá khởi điểm = 1.5x ~ 2.0x giá gốc
    const multiplier = 1.5 + (Math.random() * 0.5);
    const startPrice = Math.floor(template.basePrice * multiplier);
    const minIncrement = Math.max(1000, Math.floor(startPrice * 0.08));

    const sellerName = NPC_MA_DAU_NAMES[idx % NPC_MA_DAU_NAMES.length] || 'Ẩn Danh Ma Đầu';
    const initialBidderName = NPC_MA_DAU_NAMES[(idx + 1) % NPC_MA_DAU_NAMES.length] || 'Tà Tu Khách';

    return {
      id: `lot_bm_${dayNumber}_${idx}_${Date.now()}`,
      itemId: template.itemId,
      itemName: template.itemName,
      category: template.category,
      rarityTier: template.rarityTier,
      description: template.description,
      basePrice: template.basePrice,
      currentBid: startPrice,
      minIncrement,
      sellerType: 'npc',
      sellerName,
      highestBidderName: initialBidderName,
      isPlayerHighestBidder: false,
      timeLeftSeconds: Math.floor(Math.random() * 60) + 180, // 180s - 240s
      isSettled: false,
      bustRiskAdded: template.bustRiskAdded,
      attachedEggData: template.attachedEggData
    };
  });
}

// ============================================================
// 4. THUẬT TOÁN AI NPC NÂNG GIÁ (DYNAMIC NPC BIDDING AI)
// ============================================================
/**
 * Mô phỏng một bước đấu giá cạnh tranh của NPC Ma Tu.
 * Nếu người chơi đang dẫn đầu, NPC có xác suất trả giá cao hơn (Outbid).
 */
export function simulateNpcBiddingStep(lot: BlackMarketLot): {
  lot: BlackMarketLot;
  outbidPlayer: boolean;
  newBidAmount: number;
  bidderName: string;
} {
  if (lot.isSettled || lot.timeLeftSeconds <= 0) {
    return {
      lot,
      outbidPlayer: false,
      newBidAmount: lot.currentBid,
      bidderName: lot.highestBidderName
    };
  }

  // Xác suất NPC trả giá cạnh tranh (50% - 75%)
  const bidChance = 0.65;
  if (Math.random() > bidChance) {
    return {
      lot,
      outbidPlayer: false,
      newBidAmount: lot.currentBid,
      bidderName: lot.highestBidderName
    };
  }

  // NPC nâng giá thêm 1 bước giá (minIncrement hoặc 10% currentBid)
  const increment = Math.max(lot.minIncrement, Math.floor(lot.currentBid * 0.10));
  const newBidAmount = lot.currentBid + increment;

  // Lựa chọn NPC Ma Đầu khác với người đang dẫn đầu
  const candidateNames = NPC_MA_DAU_NAMES.filter(n => n !== lot.highestBidderName);
  const npcName = candidateNames[Math.floor(Math.random() * candidateNames.length)] || 'Bí Ẩn Tà Tu';

  const outbidPlayer = lot.isPlayerHighestBidder;

  const updatedLot: BlackMarketLot = {
    ...lot,
    currentBid: newBidAmount,
    highestBidderName: npcName,
    isPlayerHighestBidder: false,
    timeLeftSeconds: Math.max(15, lot.timeLeftSeconds) // Giữ phiên không kết thúc tức thì khi có tranh chấp
  };

  return {
    lot: updatedLot,
    outbidPlayer,
    newBidAmount,
    bidderName: npcName
  };
}

// ============================================================
// 5. CƠ CHẾ ĐẶT GIÁ CỦA NGƯỜI CHƠI (PLAYER BIDDING & ESCROW)
// ============================================================
/**
 * Người chơi đặt giá thầu (Bid).
 * Invariant 3: Đưa Linh Thạch vào Ký Quỹ (Escrow).
 * Gia tăng Bust Risk Meter (+5% ~ +15%).
 */
export function playerPlaceBid(
  player: PlayerStats,
  session: BlackMarketSessionState,
  lotId: string,
  customBid?: number
): {
  success: boolean;
  message?: string;
  reason?: string;
  updatedPlayer: PlayerStats;
  updatedSession: BlackMarketSessionState;
  bidAmount: number;
} {
  const lotIndex = session.activeLots.findIndex(l => l.id === lotId);
  if (lotIndex === -1) {
    const reason = 'Lô hàng không tồn tại trên sàn đấu giá Hắc Thị!';
    return {
      success: false,
      reason,
      message: reason,
      updatedPlayer: player,
      updatedSession: session,
      bidAmount: 0
    };
  }

  const lot = session.activeLots[lotIndex];
  if (lot.isSettled || lot.timeLeftSeconds <= 0) {
    const reason = 'Phiên đấu giá lô hàng này đã kết thúc!';
    return {
      success: false,
      reason,
      message: reason,
      updatedPlayer: player,
      updatedSession: session,
      bidAmount: 0
    };
  }

  const minRequiredBid = lot.currentBid + lot.minIncrement;
  const bidAmount = customBid ? Math.max(minRequiredBid, customBid) : minRequiredBid;

  const currentStones = typeof player.spiritStones === 'number'
    ? player.spiritStones
    : (player.linhThach ?? 0);

  // Tính số tiền cần ký quỹ thêm
  // Nếu người chơi đã là highest bidder (tự nâng giá của mình), chỉ ký quỹ phần chênh lệch
  const previousPlayerBid = lot.isPlayerHighestBidder ? lot.currentBid : 0;
  const additionalEscrowNeeded = bidAmount - previousPlayerBid;

  if (currentStones < additionalEscrowNeeded) {
    const reason = `Linh Thạch không đủ để đặt giá thầu! Cần thêm ${additionalEscrowNeeded.toLocaleString()} Linh Thạch (Hiện có: ${currentStones.toLocaleString()}).`;
    return {
      success: false,
      reason,
      message: reason,
      updatedPlayer: player,
      updatedSession: session,
      bidAmount: 0
    };
  }

  // 1. Trừ tiền người chơi và cộng vào Escrow
  const newStones = currentStones - additionalEscrowNeeded;
  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: newStones,
    spiritStones: newStones
  };

  const newEscrow = (session.playerEscrowStones || 0) + additionalEscrowNeeded;

  // 2. Cập nhật Lot
  const updatedLot: BlackMarketLot = {
    ...lot,
    currentBid: bidAmount,
    highestBidderName: player.name || 'Bản Thể Đạo Hữu',
    isPlayerHighestBidder: true
  };

  const updatedLots = [...session.activeLots];
  updatedLots[lotIndex] = updatedLot;

  // 3. Gia tăng Bust Risk Meter
  const addedRisk = lot.bustRiskAdded || 8;
  const newRisk = Math.min(100, (session.bustRiskMeter || 0) + addedRisk);

  // 4. Kiểm tra kích hoạt đột kích nếu nguy cơ cao
  const raidTriggered = checkBustRaidTrigger(newRisk);

  const updatedSession: BlackMarketSessionState = {
    ...session,
    activeLots: updatedLots,
    playerEscrowStones: newEscrow,
    bustRiskMeter: newRisk,
    raidIncidentActive: raidTriggered || session.raidIncidentActive
  };

  return {
    success: true,
    message: `🔥 [ĐẶT GIÁ THÀNH CÔNG] Đạo hữu đã ra giá ${bidAmount.toLocaleString()} Linh Thạch cho lô hàng "${lot.itemName}"!`,
    reason: undefined,
    updatedPlayer,
    updatedSession,
    bidAmount
  };
}

/**
 * Xử lý hoàn trả 100% tiền ký quỹ khi người chơi bị NPC vượt giá (Outbid).
 */
export function handleNpcOutbidRefund(
  player: PlayerStats,
  session: BlackMarketSessionState,
  lotId: string,
  refundedAmount: number
): {
  refundedAmount: number;
  message: string;
  updatedPlayer: PlayerStats;
  updatedSession: BlackMarketSessionState;
} {
  const safeRefund = Math.min(session.playerEscrowStones || 0, refundedAmount);
  const currentStones = typeof player.spiritStones === 'number'
    ? player.spiritStones
    : (player.linhThach ?? 0);

  const newStones = currentStones + safeRefund;
  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: newStones,
    spiritStones: newStones
  };

  const updatedSession: BlackMarketSessionState = {
    ...session,
    playerEscrowStones: Math.max(0, (session.playerEscrowStones || 0) - safeRefund)
  };

  const message = `🔔 [HOÀN TRẢ KÝ QUỸ] Đạo hữu đã bị vượt giá! Hệ thống Hắc Thị hoàn trả 100% số tiền ${safeRefund.toLocaleString()} Linh Thạch về túi!`;

  return {
    refundedAmount: safeRefund,
    message,
    updatedPlayer,
    updatedSession
  };
}

// ============================================================
// 6. KÝ GỬI CẤM VẬT THU LỢI NHUẬN GẤP ĐÔI (CONSIGNMENT x2)
// ============================================================
/**
 * Người chơi ký gửi cấm vật của mình lên sàn Hắc Thị.
 * Thu về lợi nhuận tối thiểu gấp đôi (x2) so với giá gốc thị trường.
 * Khóa vật phẩm trên sàn (`isLockedInEscrow = true`).
 */
export function consignPlayerContraband(
  player: PlayerStats,
  session: BlackMarketSessionState,
  item: any,
  customStartingPrice?: number
): {
  success: boolean;
  message?: string;
  reason?: string;
  updatedPlayer: PlayerStats;
  updatedSession: BlackMarketSessionState;
  newLot: BlackMarketLot | null;
  createdLot?: BlackMarketLot | null;
} {
  if (!item || !item.id) {
    const reason = 'Vật phẩm ký gửi không hợp lệ!';
    return {
      success: false,
      reason,
      message: reason,
      updatedPlayer: player,
      updatedSession: session,
      newLot: null,
      createdLot: null
    };
  }

  const basePrice = item.basePrice || item.price || 5000;
  // Giá khởi điểm tối thiểu bằng gấp đôi (x2) giá gốc
  const minStartPrice = basePrice * 2;
  const startPrice = customStartingPrice ? Math.max(minStartPrice, customStartingPrice) : minStartPrice;
  const minIncrement = Math.max(500, Math.floor(startPrice * 0.08));

  // Xác định category
  let category: ContrabandCategory = 'demonic_artifact';
  if (item.category === 'heretical_egg' || item.isHeretical || item.eggData) category = 'heretical_egg';
  else if (item.itemType === 'pill' || item.pillType) category = 'forbidden_pill';
  else if (item.itemType === 'ore' || item.oreType) category = 'abyssal_ore';
  else if (item.itemType === 'manual' || item.type === 'than_thong') category = 'cursed_tome';

  const newLot: BlackMarketLot = {
    id: `lot_player_${Date.now()}_${Math.random()}`,
    itemId: item.id,
    itemName: item.name || 'Cấm Vật Thượng Cổ',
    category,
    rarityTier: item.tier || item.rarity || 4,
    description: item.description || 'Cấm vật do đạo hữu mạo hiểm đoạt được mang lên Hắc Thị.',
    basePrice,
    currentBid: startPrice,
    minIncrement,
    sellerType: 'player',
    sellerName: player.name || 'Bản Thể Đạo Hữu',
    highestBidderName: NPC_MA_DAU_NAMES[Math.floor(Math.random() * NPC_MA_DAU_NAMES.length)],
    isPlayerHighestBidder: false,
    timeLeftSeconds: 240, // 4 phút
    isSettled: false,
    bustRiskAdded: 10,
    isLockedInEscrow: true,
    attachedEggData: item.eggData || (category === 'heretical_egg' ? item : undefined)
  };

  // Khóa vật phẩm trong kho người chơi (gắn cờ isLockedInEscrow)
  let updatedInventory: any = player.inventory;
  if (Array.isArray(player.inventory)) {
    updatedInventory = player.inventory.map((invItem: any) => {
      if (invItem && invItem.id === item.id) {
        return { ...invItem, isLockedInEscrow: true };
      }
      return invItem;
    });
  } else if (player.inventory && typeof player.inventory === 'object') {
    const inv = { ...player.inventory };
    ['ores', 'pills', 'equipments', 'equipment', 'herbs', 'manuals'].forEach(cat => {
      if (Array.isArray((inv as any)[cat])) {
        (inv as any)[cat] = (inv as any)[cat].map((invItem: any) => {
          if (invItem && invItem.id === item.id) {
            return { ...invItem, isLockedInEscrow: true };
          }
          return invItem;
        });
      }
    });
    updatedInventory = inv;
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: updatedInventory
  };

  // Tăng nguy cơ bị truy quét (+10%)
  const newRisk = Math.min(100, (session.bustRiskMeter || 0) + 10);
  const raidTriggered = checkBustRaidTrigger(newRisk);

  const updatedSession: BlackMarketSessionState = {
    ...session,
    activeLots: [newLot, ...session.activeLots],
    bustRiskMeter: newRisk,
    raidIncidentActive: raidTriggered || session.raidIncidentActive
  };

  const message = `📦 [KÝ GỬI THÀNH CÔNG] Đạo hữu đã ký gửi "${newLot.itemName}" với giá khởi điểm ${startPrice.toLocaleString()} Linh Thạch!`;

  return {
    success: true,
    message,
    reason: undefined,
    updatedPlayer,
    updatedSession,
    newLot,
    createdLot: newLot
  };
}

// ============================================================
// 7. KẾT TOÁN PHIÊN ĐẤU GIÁ (SETTLEMENT & DELIVERY)
// ============================================================
/**
 * Kết toán lô hàng khi đếm ngược về 0.
 * - Người chơi thắng: trừ tiền ký quỹ chính thức, nhận vật phẩm (Linh Noãn Tà Đạo hoặc Cấm Phẩm).
 * - Người chơi bán: nhận toàn bộ tiền thắng thầu (tối thiểu x2 giá gốc).
 */
export function settleBlackMarketLot(
  player: PlayerStats,
  session: BlackMarketSessionState,
  lotId: string
): {
  success: boolean;
  rewardStones: number;
  updatedPlayer: PlayerStats;
  updatedSession: BlackMarketSessionState;
  settledLot: BlackMarketLot | null;
  message: string;
} {
  const lotIndex = session.activeLots.findIndex(l => l.id === lotId);
  if (lotIndex === -1) {
    return { success: false, rewardStones: 0, updatedPlayer: player, updatedSession: session, settledLot: null, message: '' };
  }

  const lot = session.activeLots[lotIndex];
  if (lot.isSettled) {
    return { success: true, rewardStones: 0, updatedPlayer: player, updatedSession: session, settledLot: lot, message: '' };
  }

  let updatedPlayer = { ...player };
  let updatedSession = { ...session };
  let message = '';
  let rewardStones = 0;

  const markedLot: BlackMarketLot = { ...lot, isSettled: true, timeLeftSeconds: 0 };
  const updatedLots = [...session.activeLots];
  updatedLots[lotIndex] = markedLot;
  updatedSession.activeLots = updatedLots;

  // TRƯỜNG HỢP 1: NGƯỜI CHƠI THẮNG ĐẤU GIÁ MUA
  if (lot.isPlayerHighestBidder) {
    // Khấu trừ chính thức tiền ký quỹ
    updatedSession.playerEscrowStones = Math.max(0, (updatedSession.playerEscrowStones || 0) - lot.currentBid);

    // Chuyển vật phẩm vào kho đồ
    if (lot.category === 'heretical_egg') {
      const hereticalEgg: BeastEgg = {
        id: `egg_heretical_${Date.now()}`,
        name: lot.itemName,
        quality: 'tuyet_pham',
        rarity: 5,
        incubateStartTime: Date.now(),
        incubateDuration: 180000,
        isHatched: false,
        predictedMutations: lot.attachedEggData?.predictedMutations || ['Ma Đạo Dị Biến', 'Tru Hồn Lôi Sát'],
        parents: { fatherName: 'Vực Ngoại Tà Ma', motherName: 'U Minh Dị Chủng', element: 'am' },
        isHeretical: true
      } as any;

      if (updatedPlayer.beastGarden) {
        updatedPlayer.beastGarden = {
          ...updatedPlayer.beastGarden,
          eggs: [...(updatedPlayer.beastGarden.eggs || []), hereticalEgg]
        };
      } else {
        updatedPlayer.beastEggs = [...(updatedPlayer.beastEggs || []), hereticalEgg];
      }

      message = `🎉 Đấu giá thắng lợi! 【${lot.itemName}】 đã được chuyển thẳng vào lồng ấp Thú Uyển với cờ Dị Chủng Tà Đạo!`;
    } else {
      // Đưa vào inventory cấm vật
      const contrabandItem = {
        id: lot.itemId,
        name: lot.itemName,
        category: lot.category,
        tier: lot.rarityTier,
        description: lot.description,
        price: lot.basePrice,
        isContraband: true
      };

      let inv: any = updatedPlayer.inventory;
      if (Array.isArray(inv)) {
        (updatedPlayer as any).inventory = [...inv, contrabandItem];
      } else {
        inv = inv ? { ...inv } : { pills: [], herbs: [], ores: [], manuals: [], equipments: [] };
        if (lot.category === 'forbidden_pill') {
          inv.pills = [...(inv.pills || []), { ...contrabandItem, quantity: 1 }];
        } else if (lot.category === 'abyssal_ore') {
          inv.ores = [...(inv.ores || []), { ...contrabandItem, quantity: 1 }];
        } else {
          inv.equipments = [...(inv.equipments || []), contrabandItem];
        }
        updatedPlayer.inventory = inv;
      }

      message = `🎉 Đấu giá thắng lợi! Đoạt được cấm bảo 【${lot.itemName}】 với giá ${lot.currentBid.toLocaleString()} Linh Thạch!`;
    }

    // Ghi nhận lịch sử
    const historyItem = {
      id: `hist_${Date.now()}`,
      lotId: lot.id,
      itemName: lot.itemName,
      category: lot.category,
      price: lot.currentBid,
      type: 'buy' as const,
      timestamp: Date.now()
    };
    updatedSession.contrabandHistory = [historyItem, ...(updatedSession.contrabandHistory || [])];
  }

  // TRƯỜNG HỢP 2: HÀNG NGƯỜI CHƠI KÝ GỬI BÁN THÀNH CÔNG
  else if (lot.sellerType === 'player') {
    const revenue = lot.currentBid;
    rewardStones = revenue;
    const currentStones = typeof updatedPlayer.spiritStones === 'number'
      ? updatedPlayer.spiritStones
      : (updatedPlayer.linhThach ?? 0);

    const newStones = currentStones + revenue;
    updatedPlayer.linhThach = newStones;
    updatedPlayer.spiritStones = newStones;

    // Gỡ vật phẩm khỏi túi đồ người chơi
    if (updatedPlayer.inventory) {
      if (Array.isArray(updatedPlayer.inventory)) {
        (updatedPlayer as any).inventory = (updatedPlayer.inventory as any[]).filter((i: any) => i.id !== lot.itemId);
      } else {
        const inv: any = { ...updatedPlayer.inventory };
        ['ores', 'pills', 'equipments', 'equipment', 'herbs', 'manuals'].forEach(cat => {
          if (Array.isArray(inv[cat])) {
            inv[cat] = inv[cat].filter((i: any) => i.id !== lot.itemId);
          }
        });
        updatedPlayer.inventory = inv;
      }
    }

    message = `💰 Ký gửi thành công! 【${lot.itemName}】 đã được ${lot.highestBidderName} đấu giá với giá ${revenue.toLocaleString()} Linh Thạch (Lợi nhuận x${(revenue / Math.max(1, lot.basePrice)).toFixed(1)})!`;

    const historyItem = {
      id: `hist_${Date.now()}`,
      lotId: lot.id,
      itemName: lot.itemName,
      category: lot.category,
      price: revenue,
      type: 'sell' as const,
      timestamp: Date.now()
    };
    updatedSession.contrabandHistory = [historyItem, ...(updatedSession.contrabandHistory || [])];
  }

  return {
    success: true,
    rewardStones,
    updatedPlayer,
    updatedSession,
    settledLot: markedLot,
    message
  };
}

// ============================================================
// 8. THẨM ĐỊNH NGUY CƠ BẠI LỘ & ĐỘT KÍCH (BUST RISK TRIGGER)
// ============================================================
/**
 * Công thức kích hoạt đột kích:
 * Nếu Bust Risk Meter > 50%, mỗi lượt trả giá có xác suất (BustRisk - 40)% bị truy quét.
 */
export function checkBustRaidTrigger(bustRiskMeter: number, rngRoll?: number): boolean {
  if (bustRiskMeter <= 50) return false;

  const raidChance = bustRiskMeter - 40; // 51% -> 11%, 100% -> 60%
  const roll = rngRoll !== undefined ? (rngRoll <= 1 ? rngRoll * 100 : rngRoll) : (Math.random() * 100);
  return roll <= raidChance;
}

// ============================================================
// 9. GIẢI QUYẾT BIẾN CỐ ĐỘT KÍCH (RAID ENCOUNTER RESOLUTION)
// ============================================================
/**
 * 3 Lựa chọn sinh tử khi bị Đội Tuần Tra Tiên Quan đột kích:
 * 1. Bribe (Đút lót): Mất 30% Linh Thạch, an toàn thoát thân, xóa Bust Risk.
 * 2. Flee (Bỏ của chạy lấy người): Tịch thu toàn bộ vật phẩm đang đấu giá và tiền ký quỹ, thoát thân không tăng Ma Tính.
 * 3. Fight (Huyết chiến):
 *    - Thắng: Đoạt lại toàn bộ, Ma Tính (demonicNature) tăng +30 điểm!
 *    - Thua: Mất 20% tu vi, 20% linh thạch, mất tiền ký quỹ.
 */
export function resolveRaidEncounter(
  choice: RaidResolutionChoice,
  player: PlayerStats,
  session: BlackMarketSessionState,
  simulatedCombatVictory?: boolean
): RaidResolutionResult {
  let updatedPlayer: PlayerStats = { ...player };
  let updatedSession: BlackMarketSessionState = { ...session };
  let success = false;
  let message = '';
  let demonicNatureChange = 0;
  let spiritStonesLost = 0;
  const itemsConfiscated: string[] = [];

  const currentStones = typeof player.spiritStones === 'number'
    ? player.spiritStones
    : (player.linhThach ?? 0);

  switch (choice) {
    // 1. ĐÚT LÓT TIÊN QUAN (BRIBE)
    case 'bribe': {
      const bribeCost = Math.floor(currentStones * 0.30);
      spiritStonesLost = bribeCost;
      const remainingStones = Math.max(0, currentStones - bribeCost);

      updatedPlayer.linhThach = remainingStones;
      updatedPlayer.spiritStones = remainingStones;

      updatedSession.bustRiskMeter = 0;
      updatedSession.raidIncidentActive = false;
      success = true;

      message = `💸 [ĐÚT LÓT THÀNH CÔNG] Đạo hữu ngầm nhét ${bribeCost.toLocaleString()} Linh Thạch vào tay Đội Trưởng Tiên Quan. Hắn phất tay làm ngơ, hắc vụ tan biến, bình an thoát khỏi cấm địa!`;
      break;
    }

    // 2. VỨT BỎ CỦA CẢI CHẠY TRỐN (FLEE)
    case 'flee': {
      spiritStonesLost = session.playerEscrowStones || 0;
      updatedSession.playerEscrowStones = 0;
      updatedSession.bustRiskMeter = 0;
      updatedSession.raidIncidentActive = false;

      // Thu gom danh sách vật phẩm bị tịch thu
      for (const lot of session.activeLots) {
        if (lot.isPlayerHighestBidder || lot.sellerType === 'player') {
          itemsConfiscated.push(lot.itemName);
        }
      }

      // Xóa các lot người chơi tham gia khỏi sàn
      updatedSession.activeLots = session.activeLots.filter(
        lot => !lot.isPlayerHighestBidder && lot.sellerType !== 'player'
      );

      success = true;
      message = `🏃 [VỨT CỦA CHẠY LẤY NGƯỜI] Đạo hữu ném lại toàn bộ cấm phẩm và ${spiritStonesLost.toLocaleString()} Linh Thạch ký quỹ, mượn cớ chấn động chui vào khe nứt hư không tẩu thoát!`;
      break;
    }

    // 3. HUYẾT CHIẾN TRU SÁT TIÊN QUAN (FIGHT)
    case 'fight': {
      // Xác định thắng bại: nếu không truyền giả lập, dựa trên Lực Chiến hoặc tỷ lệ ngẫu nhiên 75%
      const isVictory = simulatedCombatVictory !== undefined
        ? simulatedCombatVictory
        : (Math.random() < 0.75);

      if (isVictory) {
        // Thắng trận: Ma Tính tăng mạnh +30 điểm!
        demonicNatureChange = 30;
        updatedPlayer.demonicNature = Math.min(100, (updatedPlayer.demonicNature || 0) + 30);

        updatedSession.bustRiskMeter = 10;
        updatedSession.raidIncidentActive = false;
        success = true;

        message = `⚔️ [HUYẾT CHIẾN TOÀN THẮNG] Sát khí ngập trời! Ngươi chém gục toàn bộ Chấp Pháp Giả, bảo vệ toàn vẹn bảo vật và tiền ký quỹ! Ma Tính bùng nổ (+30 điểm)!`;
      } else {
        // Thua trận: Tổn thất 20% tu vi và 20% linh thạch, mất sạch ký quỹ
        const lostTuVi = Math.floor((player.tuVi || 0) * 0.20);
        const penaltyStones = Math.floor(currentStones * 0.20);
        spiritStonesLost = penaltyStones + (session.playerEscrowStones || 0);

        updatedPlayer.tuVi = Math.max(0, (player.tuVi || 0) - lostTuVi);
        const remaining = Math.max(0, currentStones - penaltyStones);
        updatedPlayer.linhThach = remaining;
        updatedPlayer.spiritStones = remaining;

        updatedSession.playerEscrowStones = 0;
        updatedSession.bustRiskMeter = 0;
        updatedSession.raidIncidentActive = false;
        success = false;

        message = `💀 [HUYẾT CHIẾN THẤT BẠI] Bất địch Tiên Thiên Chấp Pháp Trận! Ngươi bị đánh trọng thương, tổn thất ${lostTuVi.toLocaleString()} Tu Vi và ${spiritStonesLost.toLocaleString()} Linh Thạch!`;
      }
      break;
    }
  }

  return {
    success,
    choice,
    message,
    demonicNatureChange,
    spiritStonesLost,
    itemsConfiscated,
    combatVictory: choice === 'fight' ? success : undefined,
    updatedPlayer,
    updatedSession
  };
}
