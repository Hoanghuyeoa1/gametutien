// lib/auction-logic.ts
// MODULE LOGIC TRẢ GIÁ, ĐẤU TRÍ TÂM LÝ & THẦN THỨC ÁP CHẾ VẠN BẢO ĐẤU GIÁ HỘI

import {
  PlayerStats,
  AuctionNPC,
  AuctionLotItem,
  AuctionSessionState,
  AuctionBidRecord,
  BeastEgg,
  Equipment,
  GemItem,
  Manual,
  Ore
} from './types';
import { AUCTION_LOTS, AUCTION_NPC_TEMPLATES, AuctionNPCTemplate } from './auction-data';
import { DEFAULT_MANUALS } from './manuals-data';

// ============================================
// 1. TÍNH TOÁN TRẦN NGÂN SÁCH (HARD CAP) NPC CHO LÔ ĐẤU GIÁ
// ============================================

export function calculateNpcBudgetForLot(
  roleType: 'tan_tu' | 'the_gia' | 'truong_lao' | 'thuong_hoi' = 'tan_tu',
  reservePrice: number,
  isBreakthroughEvent: boolean = false
): number {
  let multiplierMin = 1.05;
  let multiplierMax = 1.15;

  switch (roleType) {
    case 'tan_tu':
      // Tán Tu (như Lâm Viêm, U Minh, Độc Cô Nhất Kiếm): Ngân sách tối đa 1.05x - 1.15x Giá Ước Tính
      multiplierMin = 1.05;
      multiplierMax = 1.15;
      break;
    case 'the_gia':
      // Thiếu Chủ Thế Gia (như Vương Đằng, Huyết Nguyệt): Ngân sách tối đa 1.15x - 1.25x Giá Ước Tính
      multiplierMin = 1.15;
      multiplierMax = 1.25;
      break;
    case 'truong_lao':
      // Trưởng Lão Tông Môn (như Cổ Phong, Mộc Diệp): Ngân sách tối đa 1.20x - 1.30x Giá Ước Tính
      multiplierMin = 1.20;
      multiplierMax = 1.30;
      break;
    case 'thuong_hoi':
      // Thương Hội / Cự Phú (như Yên Nhiên Tiên Tử): Tối đa 1.30x - 1.35x Giá Ước Tính
      multiplierMin = 1.30;
      multiplierMax = 1.35;
      break;
    default:
      multiplierMin = 1.10;
      multiplierMax = 1.20;
  }

  const randomMultiplier = multiplierMin + Math.random() * (multiplierMax - multiplierMin);
  let budget = Math.floor(reservePrice * randomMultiplier);

  // Cân bằng riêng cho sự kiện "Đấu Giá Mừng Đột Phá": Giảm thêm 15% trần ngân sách chung
  if (isBreakthroughEvent) {
    budget = Math.floor(budget * 0.85);
  }

  return Math.max(Math.floor(reservePrice * 1.02), budget);
}

// ============================================
// 2. SINH PHIÊN ĐẤU GIÁ MỚI
// ============================================

export function generateAuctionSession(
  playerRealmIndex: number = 0,
  playerThanThuc: number = 20,
  customTitle?: string,
  isBreakthroughEventOverride?: boolean
): AuctionSessionState {
  const isBreakthroughEvent = Boolean(
    isBreakthroughEventOverride ||
    (customTitle && (
      customTitle.toLowerCase().includes('đột phá') ||
      customTitle.toLowerCase().includes('mừng') ||
      customTitle.toLowerCase().includes('phá cảnh')
    ))
  );

  // Chọn 3 - 4 vật phẩm ngẫu nhiên từ kho đấu giá
  const shuffledLots = [...AUCTION_LOTS].sort(() => Math.random() - 0.5);
  const selectedLots: AuctionLotItem[] = shuffledLots.slice(0, Math.floor(Math.random() * 2) + 3);

  // Chọn 3 - 4 NPC đối thủ ngẫu nhiên
  const shuffledNpcTemplates = [...AUCTION_NPC_TEMPLATES].sort(() => Math.random() - 0.5);
  const selectedTemplates = shuffledNpcTemplates.slice(0, 4);

  const firstLot = selectedLots[0];

  const npcs: AuctionNPC[] = selectedTemplates.map(tpl => {
    const role = (tpl.roleType || 'tan_tu') as 'tan_tu' | 'the_gia' | 'truong_lao' | 'thuong_hoi';
    const ceiling = calculateNpcBudgetForLot(role, firstLot.reservePrice, isBreakthroughEvent);
    const randomizedThanThuc = Math.floor(tpl.baseThanThuc * (0.9 + Math.random() * 0.25) + playerRealmIndex * 8);

    return {
      id: tpl.id,
      name: tpl.name,
      title: tpl.title,
      avatar: tpl.avatar,
      personality: tpl.personality,
      roleType: role,
      budget: ceiling,
      originalBudget: ceiling,
      budgetCeiling: ceiling,
      thanThuc: randomizedThanThuc,
      color: tpl.color,
      dialogue: tpl.quotes.bid[Math.floor(Math.random() * tpl.quotes.bid.length)],
      isIntimidated: false,
      hasFolded: false,
      intimidateCount: 0,
      intimidateStatusText: undefined
    };
  });

  const initialRecord: AuctionBidRecord = {
    id: `bid_init_${Date.now()}`,
    bidderName: 'Đấu Giá Sư',
    bidderType: 'npc',
    amount: firstLot.startingPrice,
    timestamp: 'Vừa xong',
    quote: `Khai mở lô đấu giá thứ nhất: [${firstLot.name}]! Giá khởi điểm ${firstLot.startingPrice.toLocaleString()} Linh Thạch (Ước tính: ~${firstLot.reservePrice.toLocaleString()} LT)!`
  };

  return {
    isActive: true,
    sessionTitle: customTitle || '🏛️ Vạn Bảo Đấu Giá Đại Hội',
    isBreakthroughEvent,
    items: selectedLots,
    currentItemIndex: 0,
    currentPrice: firstLot.startingPrice,
    highestBidder: {
      name: 'Đấu Giá Sư',
      isPlayer: false,
      bidderId: 'auctioneer'
    },
    hammerCount: 0,
    npcs,
    bidHistory: [initialRecord],
    status: 'bidding',
    narratorLog: `Đấu Giá Sư gõ búa: "Chào mừng chư vị đại năng quang lâm Vạn Bảo Đấu Giá Đại Hội! Lô đấu giá đầu tiên chính thức bắt đầu!"`,
    lastActionTime: Date.now()
  };
}

// ============================================
// 3. TÍNH TOÁN LƯỢT RA GIÁ CỦA NPC
// ============================================

export interface NextNPCBidResult {
  nextBidder: AuctionNPC;
  bidAmount: number;
  quote: string;
  isAggressive?: boolean;
}

export function calculateNextNPCBid(
  session: AuctionSessionState,
  playerJustBid: boolean = false
): NextNPCBidResult | null {
  const currentLot = session.items[session.currentItemIndex];
  if (!currentLot) return null;

  // Lọc các NPC còn đủ điều kiện tham gia
  const activeNpcs = session.npcs.filter(npc => !npc.hasFolded && !npc.isIntimidated);
  if (activeNpcs.length === 0) return null;

  // Xáo trộn thứ tự để phản xạ tự nhiên
  const randomizedNpcs = [...activeNpcs].sort(() => Math.random() - 0.5);

  for (const npc of randomizedNpcs) {
    // Không tự đấu giá với chính mình nếu đang dẫn đầu
    if (session.highestBidder.bidderId === npc.id) continue;

    const tpl = AUCTION_NPC_TEMPLATES.find(t => t.id === npc.id);
    const minIncrement = currentLot.minBidIncrement || 2000;
    const currentPrice = session.currentPrice;
    const effectiveCeiling = npc.budgetCeiling || npc.budget;

    // 1. Kiểm tra ngân sách trần
    if (currentPrice + minIncrement > effectiveCeiling || currentPrice + minIncrement > npc.budget) {
      npc.hasFolded = true;
      if (tpl) {
        npc.dialogue = tpl.quotes.fold[Math.floor(Math.random() * tpl.quotes.fold.length)];
      }
      continue;
    }

    // 2. Quy tắc ngắt theo ngưỡng giá thị trường (reservePrice)
    const reservePrice = currentLot.reservePrice || 10000;
    const priceRatio = currentPrice / Math.max(1, reservePrice);

    if (priceRatio >= 1.25 && Math.random() < 0.95) {
      npc.hasFolded = true;
      if (tpl) npc.dialogue = tpl.quotes.fold[Math.floor(Math.random() * tpl.quotes.fold.length)];
      continue;
    } else if (priceRatio >= 1.15 && Math.random() < 0.75) {
      npc.hasFolded = true;
      if (tpl) npc.dialogue = tpl.quotes.fold[Math.floor(Math.random() * tpl.quotes.fold.length)];
      continue;
    } else if (priceRatio >= 1.00 && Math.random() < 0.40) {
      npc.hasFolded = true;
      if (tpl) npc.dialogue = tpl.quotes.fold[Math.floor(Math.random() * tpl.quotes.fold.length)];
      continue;
    }

    // 3. Tính tỷ lệ ra giá theo tính cách
    let willBidChance = 0.75;
    let bidMultiplier = 1.05; // mặc định +5%
    let isAggressive = false;

    switch (npc.personality) {
      case 'arrogant': {
        willBidChance = playerJustBid ? 0.85 : 0.65;
        if (Math.random() < 0.35 && currentPrice * 1.15 <= effectiveCeiling) {
          bidMultiplier = 1.12 + Math.random() * 0.08;
          isAggressive = true;
        } else {
          bidMultiplier = 1.06 + Math.random() * 0.05;
        }
        break;
      }
      case 'prudent': {
        willBidChance = priceRatio < 1.10 ? 0.65 : 0.25;
        bidMultiplier = 1.04 + Math.random() * 0.04;
        break;
      }
      case 'mysterious': {
        const isFavoredItem = ['beast_egg', 'material', 'manual', 'pill_formula'].includes(currentLot.category);
        willBidChance = isFavoredItem ? 0.80 : 0.35;
        bidMultiplier = isFavoredItem ? (1.08 + Math.random() * 0.08) : 1.05;
        isAggressive = isFavoredItem && Math.random() < 0.3;
        break;
      }
      case 'merchant': {
        willBidChance = priceRatio < 1.08 ? 0.60 : 0.20;
        bidMultiplier = 1.05 + Math.random() * 0.04;
        break;
      }
      default: {
        willBidChance = 0.50;
        bidMultiplier = 1.05;
      }
    }

    // 4. Hiệu ứng giảm ham muốn trả giá nếu đã bị dằn mặt: Giảm 50% cho mỗi lần bị dằn mặt
    if (npc.intimidateCount && npc.intimidateCount > 0) {
      willBidChance *= Math.pow(0.5, npc.intimidateCount);
    }

    if (Math.random() > willBidChance) {
      continue;
    }

    // Tính toán số tiền ra giá
    let calculatedBid = Math.floor(currentPrice * bidMultiplier);
    if (calculatedBid < currentPrice + minIncrement) {
      calculatedBid = currentPrice + minIncrement;
    }
    // Làm tròn 1,000
    calculatedBid = Math.ceil(calculatedBid / 1000) * 1000;
    // Chặn triệt để không vượt ngân sách trần
    calculatedBid = Math.min(effectiveCeiling, Math.min(npc.budget, calculatedBid));

    if (calculatedBid > currentPrice) {
      let quote = 'Ta trả giá cao hơn!';
      if (tpl) {
        if (playerJustBid && tpl.quotes.outbid.length > 0) {
          quote = tpl.quotes.outbid[Math.floor(Math.random() * tpl.quotes.outbid.length)];
        } else {
          quote = tpl.quotes.bid[Math.floor(Math.random() * tpl.quotes.bid.length)];
        }
      }
      npc.dialogue = quote;

      return {
        nextBidder: npc,
        bidAmount: calculatedBid,
        quote,
        isAggressive
      };
    }
  }

  return null;
}

// ============================================
// 4. THẦN THỨC ÁP CHẾ (SOUL PRESSURE INTIMIDATION)
// ============================================

export interface SoulIntimidationResult {
  success: boolean;
  affectedNpc: AuctionNPC;
  message: string;
  backlashCost: number; // Chân Nguyên / MP tiêu hao nếu phản phệ
}

export function attemptSoulIntimidation(
  playerThanThuc: number,
  npcs: AuctionNPC[],
  targetNpcId?: string,
  currentLeadingBidderId?: string
): SoulIntimidationResult | null {
  const candidateNpcs = npcs.filter(n => !n.hasFolded && !n.isIntimidated);
  if (candidateNpcs.length === 0) return null;

  let target: AuctionNPC | undefined;
  if (targetNpcId) {
    target = candidateNpcs.find(n => n.id === targetNpcId);
  }

  // Nếu không chỉ định target, ưu tiên chọn NPC đang dẫn đầu giá
  if (!target && currentLeadingBidderId) {
    target = candidateNpcs.find(n => n.id === currentLeadingBidderId);
  }

  // Nếu vẫn chưa có target, chọn NPC có ngân sách cao nhất
  if (!target) {
    target = candidateNpcs.sort((a, b) => b.budget - a.budget)[0];
  }

  if (!target) return null;

  const tpl = AUCTION_NPC_TEMPLATES.find(t => t.id === target.id);
  const diff = playerThanThuc - target.thanThuc;
  const count = (target.intimidateCount || 0) + 1;
  target.intimidateCount = count;

  // ========================================================
  // TRƯỜNG HỢP 1: THẦN THỨC NGƯỜI CHƠI NGANG BẰNG HOẶC CAO HƠN (diff >= 0)
  // ========================================================
  if (diff >= 0) {
    // QUY TẮC LẦN 3 TRỞ LÊN: 100% NPC PHẢI SỢ HÃI BỎ CUỘC NGAY LẬP TỨC!
    if (count >= 3) {
      target.isIntimidated = true;
      target.hasFolded = true;
      target.intimidateStatusText = '✕ Đã Rút Lui (Bị Thần Thức Áp Chế)';
      const quote = `Thần thức uy áp quá khủng khiếp... Đầu ta sắp nổ tung rồi! Ta xin rút lui, không tranh nữa!`;
      target.dialogue = quote;

      return {
        success: true,
        affectedNpc: target,
        message: `💥 Nhận thấy Thần Thức uy áp như núi non đè ép (Lần ${count}), [${target.title || target.name}] sợ hãi toát mồ hôi lạnh, chắp tay tuyên bố rút lui khỏi cuộc đấu giá!`,
        backlashCost: 0
      };
    }

    // LẦN 2 DẰN MẶT: 75% TỶ LỆ LẬP TỨC BỎ CUỘC, NẾU CHƯA THÌ GIẢM 30% NGÂN SÁCH
    if (count === 2) {
      const willFold = Math.random() < 0.75;
      if (willFold) {
        target.isIntimidated = true;
        target.hasFolded = true;
        target.intimidateStatusText = '✕ Đã Rút Lui (Bị Thần Thức Áp Chế)';
        let quote = 'Đạo hữu thần niệm thông thiên... Ta xin nhận thua!';
        if (tpl && tpl.quotes.intimidated.length > 0) {
          quote = tpl.quotes.intimidated[Math.floor(Math.random() * tpl.quotes.intimidated.length)];
        }
        target.dialogue = quote;

        return {
          success: true,
          affectedNpc: target,
          message: `👁️ Thần Thức giáng hạ lần thứ 2! [${target.title || target.name}] thần hồn chao đảo, không chịu nổi uy áp đành nuốt hận rút lui!`,
          backlashCost: 0
        };
      } else {
        // Chưa bỏ cuộc: Giảm thêm 30% ngân sách còn lại
        const budgetLoss = Math.floor(target.budget * 0.30);
        target.budget = Math.max(1, target.budget - budgetLoss);
        target.budgetCeiling = Math.max(1, (target.budgetCeiling || target.budget) - budgetLoss);
        target.intimidateStatusText = '😨 Hồn Phi Phách Tán (Ngân sách -30%)';
        target.dialogue = 'Áp lực thật kinh người... Tay ta run rẩy không cầm nổi linh thạch...';

        return {
          success: true,
          affectedNpc: target,
          message: `⚡ [Dằn Mặt Lần 2] Thần Thức áp chế khiến [${target.name}] hồn phi phách tán! Ngân sách giảm thêm 30% (-${budgetLoss.toLocaleString()} LT) và giảm 50% ý chí theo giá!`,
          backlashCost: 0
        };
      }
    }

    // LẦN 1 DẰN MẶT: 45% TỶ LỆ BỎ CUỘC, NẾU CHƯA THÌ GIẢM 25% NGÂN SÁCH
    const willFold = Math.random() < 0.45;
    if (willFold) {
      target.isIntimidated = true;
      target.hasFolded = true;
      target.intimidateStatusText = '✕ Đã Rút Lui (Bị Thần Thức Áp Chế)';
      let quote = 'Khí tức thật kinh khủng... Ta xin nhường!';
      if (tpl && tpl.quotes.intimidated.length > 0) {
        quote = tpl.quotes.intimidated[Math.floor(Math.random() * tpl.quotes.intimidated.length)];
      }
      target.dialogue = quote;

      return {
        success: true,
        affectedNpc: target,
        message: `👁️ Thần Thức uy áp như đại hải cuộn trào! [${target.title || target.name}] kinh hãi thức hải, mặt mày tái mét lập tức tuyên bố bỏ cuộc!`,
        backlashCost: 0
      };
    } else {
      // Giảm 25% ngân sách
      const budgetLoss = Math.floor(target.budget * 0.25);
      target.budget = Math.max(1, target.budget - budgetLoss);
      target.budgetCeiling = Math.max(1, (target.budgetCeiling || target.budget) - budgetLoss);
      target.intimidateStatusText = '😰 Kinh Hãi (Ngân sách -25%)';
      target.dialogue = 'Thần thức bàng bạc thật... Ta phải dè chừng hơn rồi...';

      return {
        success: true,
        affectedNpc: target,
        message: `👁️ [Dằn Mặt Lần 1] Thần Thức bao trùm làm chấn động tâm trí [${target.name}]! Đối thủ sợ hãi cắt giảm 25% ngân sách (-${budgetLoss.toLocaleString()} LT) và suy giảm ý chí nâng giá!`,
        backlashCost: 0
      };
    }
  }

  // ========================================================
  // TRƯỜNG HỢP 2: THẦN THỨC NGƯỜI CHƠI THẤP HƠN (diff < 0)
  // ========================================================
  const successChance = count >= 3 ? 0.75 : count === 2 ? 0.45 : 0.20;
  const isSuccess = Math.random() < successChance;

  if (isSuccess) {
    target.isIntimidated = true;
    target.hasFolded = true;
    target.intimidateStatusText = '✕ Đã Rút Lui (Bị Thần Thức Áp Chế)';
    let quote = 'Dù thần thức ngươi yếu hơn nhưng sát ý thật hung hãn... Ta nhường!';
    if (tpl && tpl.quotes.intimidated.length > 0) {
      quote = tpl.quotes.intimidated[Math.floor(Math.random() * tpl.quotes.intimidated.length)];
    }
    target.dialogue = quote;

    return {
      success: true,
      affectedNpc: target,
      message: `✨ Dù Thần Thức đối thủ nhỉnh hơn, nhưng khí thế kiên định của ngươi (Lần ${count}) đã khiến [${target.name}] e dè thoái lui!`,
      backlashCost: 0
    };
  } else {
    // Không thành công: Giảm nhẹ 10% budget thay vì tăng, và phản phệ nhẹ MP
    const budgetLoss = Math.floor(target.budget * 0.10);
    target.budget = Math.max(1, target.budget - budgetLoss);
    target.budgetCeiling = Math.max(1, (target.budgetCeiling || target.budget) - budgetLoss);
    target.intimidateStatusText = '😠 Khinh Thị (Ngân sách -10%)';

    let quote = 'Chút thần niệm nhỏ nhoi này cũng dám múa rìu qua mắt thợ?!';
    if (tpl && tpl.quotes.intimidateResist.length > 0) {
      quote = tpl.quotes.intimidateResist[Math.floor(Math.random() * tpl.quotes.intimidateResist.length)];
    }
    target.dialogue = quote;

    const backlashMp = Math.max(10, Math.floor(Math.abs(diff) * 0.3));

    return {
      success: false,
      affectedNpc: target,
      message: `⚡ Thần Thức đối đầu bất phân! [${target.name}] thần hồn kiên cố phản chấn nhẹ (-${backlashMp} MP), nhưng đối thủ cũng bị hao tổn nguyên khí (-10% ngân sách)!`,
      backlashCost: backlashMp
    };
  }
}

// ============================================
// 4. TRAO THƯỞNG KHI THẮNG ĐẤU GIÁ
// ============================================

export interface AuctionWinResult {
  updatedPlayer: PlayerStats;
  rewardMessage: string;
}

export function resolveAuctionItemWin(
  player: PlayerStats,
  wonItem: AuctionLotItem,
  finalPrice: number
): AuctionWinResult {
  let updated = { ...player };

  // 1. Trừ Linh Thạch
  updated.linhThach = Math.max(0, updated.linhThach - finalPrice);

  const payload = wonItem.rewardPayload;
  let rewardMessage = `🎉 Chúc mừng đạo hữu đắc thắng đấu giá thành công [${wonItem.name}] với giá ${finalPrice.toLocaleString()} Linh Thạch!`;

  // 2. Trao thưởng theo danh mục
  if (!updated.inventory) {
    updated.inventory = { pills: [], herbs: [], ores: [], equipments: [], manuals: [], gems: [] };
  }

  switch (wonItem.category) {
    case 'beast_egg': {
      const newEgg: BeastEgg = {
        id: `egg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: payload.beastName || wonItem.name,
        quality: payload.quality || (payload.rarity === 'than' ? 'than_pham' : payload.rarity === 'tien' ? 'tien_pham' : 'cuc_pham'),
        potentialSpecies: payload.species || 'Thái Cổ Thần Thú',
        progress: 0,
        requiredProgress: 100,
        infusedLinhThach: 0,
        infusedMp: 0,
        avatar: payload.avatar || '🥚',
        description: wonItem.description
      };
      updated.beastEggs = [...(updated.beastEggs || []), newEgg];
      rewardMessage += ` Đã cất [${newEgg.name}] vào Chuồng Thú Tiên Gia!`;
      break;
    }

    case 'equipment': {
      const newEquip: Equipment = {
        id: `eq_auc_${Date.now()}`,
        name: payload.name || wonItem.name,
        slot: payload.slot || 'weapon',
        grade: payload.grade || 'Tiên Thiên Linh Bảo',
        enhancement: 0,
        powerBonus: payload.powerBonus || 500,
        hpBonus: payload.hpBonus || 2500,
        mpBonus: payload.mpBonus || 1500,
        description: wonItem.description,
        sockets: [
          { slotIndex: 0, unlocked: true, gem: null },
          { slotIndex: 1, unlocked: true, gem: null },
          { slotIndex: 2, unlocked: true, gem: null },
          { slotIndex: 3, unlocked: true, gem: null }
        ],
        affixes: [
          {
            id: 'aff_auc_1',
            name: 'Sát Thương Bạo Kích +25%',
            statKey: 'baoKichDmg',
            value: 25,
            rarity: 'than'
          },
          {
            id: 'aff_auc_2',
            name: 'Hút Máu +8%',
            statKey: 'hutMauRate',
            value: 8,
            rarity: 'kim'
          },
          {
            id: 'aff_auc_3',
            name: 'Công Kích +18%',
            statKey: 'congKichPercent',
            value: 18,
            rarity: 'than'
          },
          {
            id: 'aff_auc_4',
            name: 'Tốc Độ Tu Vi +15%',
            statKey: 'tuViSpeedPercent',
            value: 15,
            rarity: 'than'
          }
        ]
      };
      const currentEquips = updated.inventory.equipments || [];
      updated.inventory.equipments = [...currentEquips, newEquip];
      rewardMessage += ` Đã chuyển [${newEquip.name}] (4 lỗ khảm & 4 dòng ẩn) vào Túi Trữ Vật!`;
      break;
    }

    case 'gem': {
      const newGem: GemItem = {
        id: `gem_auc_${Date.now()}`,
        name: payload.name || wonItem.name,
        gemType: 'lôi',
        level: 5,
        statBonus: { tocDo: 35, baoKichRate: 12 },
        description: wonItem.description,
        quantity: 1
      };
      const currentGems = updated.inventory.gems || [];
      updated.inventory.gems = [...currentGems, newGem];
      rewardMessage += ` Đã cất [${newGem.name}] vào Khay Linh Ngọc!`;
      break;
    }

    case 'manual':
    case 'pill_formula': {
      const existingInCatalog = DEFAULT_MANUALS.find(m => m.id === payload.id);
      const newManual: Manual = existingInCatalog
        ? { ...existingInCatalog, level: 0 }
        : {
            id: payload.id || `manual_auc_${Date.now()}`,
            name: payload.name || wonItem.name,
            type: wonItem.category === 'pill_formula' ? 'tam_phap' : 'than_thong',
            grade: 'Thần Giai',
            element: payload.element || 'lôi',
            level: 0,
            maxLevel: 10,
            tuViPerLevel: 25000,
            linhThachPerLevel: 5000,
            minNgoTinh: 20,
            powerBonusPerLevel: 350,
            speedBonusPerLevel: 15,
            description: wonItem.description,
            maxLevelPassive: {
              name: 'Viên Mãn Chi Uy',
              description: 'Gia tăng vĩnh viễn uy áp và linh lực nghịch thiên',
              combatBonusPercent: 20,
              cultivateSpeedBonus: 25
            }
          };
      const currentManuals = updated.inventory.manuals || [];
      updated.inventory.manuals = [...currentManuals, newManual];
      if (payload.id) {
        if (!updated.merchantState) {
          updated.merchantState = {
            lastRefreshTime: Date.now(),
            lastDailyRefreshTime: Date.now(),
            refreshCountToday: 0,
            purchasedOneTimeIds: [payload.id],
            currentStock: {},
            items: []
          };
        } else if (!updated.merchantState.purchasedOneTimeIds?.includes(payload.id)) {
          updated.merchantState.purchasedOneTimeIds = [...(updated.merchantState.purchasedOneTimeIds || []), payload.id];
        }
      }
      rewardMessage += ` Đã chuyển bí kíp [${newManual.name}] vào Tàng Kinh Các!`;
      break;
    }

    case 'material': {
      if (payload.type === 'currency') {
        updated.linhThach += payload.linhThach || 0;
        updated.trungPhamLinhThach = (updated.trungPhamLinhThach || 0) + (payload.trungPham || 0);
        rewardMessage += ` Mở rương thu hoạch +${payload.linhThach?.toLocaleString()} Hạ Phẩm và +${payload.trungPham} Trung Phẩm Linh Thạch!`;
      } else {
        const currentOres = updated.inventory.ores || [];
        const newOre: Ore = {
          id: payload.id || `mat_${Date.now()}`,
          name: payload.name || wonItem.name,
          grade: 'Cực Phẩm',
          quantity: payload.count || 1,
          price: 5000,
          description: wonItem.description
        };
        updated.inventory.ores = [...currentOres, newOre];
        rewardMessage += ` Đã cất ${payload.count || 1}x [${payload.name || wonItem.name}] vào Kho Quặng!`;
      }
      break;
    }
  }

  return {
    updatedPlayer: updated,
    rewardMessage
  };
}
