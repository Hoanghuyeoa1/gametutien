// scripts/test-black-market-auction.ts
// Test suite toàn diện cho phân hệ:
// "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"
//
// 6 Ca Kiểm Thử Bắt Buộc:
// 1. Kiểm Tra Chu Kỳ Mở Cửa (Full Moon Gating)
// 2. Ký Quỹ Tiền Tệ & Cơ Chế Hoàn Trả (Escrow & Outbid Invariant)
// 3. Lợi Nhuận Ký Gửi Gấp Đôi (Double Profit Settlement)
// 4. Tích Lũy Bust Risk & Kích Hoạt Đột Kích (Bust Risk Threshold)
// 5. Giải Quyết Biến Cố Đột Kích & Ma Tính (Raid Resolution)
// 6. Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)

import { createNewPlayer } from '../lib/game-logic/character';
import {
  evaluateMoonPhase,
  generateBlackMarketLots,
  playerPlaceBid,
  handleNpcOutbidRefund,
  consignPlayerContraband,
  settleBlackMarketLot,
  checkBustRaidTrigger,
  resolveRaidEncounter,
  CONTRABAND_TEMPLATES
} from '../lib/black-market-auction-logic';
import { migrateBlackMarketData } from '../lib/save-migration';
import { BlackMarketSessionState } from '../lib/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('================================================================');
console.log('🧪 TEST SUITE: Đấu Giá Hắc Thị (Black Market Auction)');
console.log('================================================================\n');

// =====================================================================
// CA 1: KIỂM TRA CHU KỲ MỞ CỬA (FULL MOON GATING)
// =====================================================================
console.log('--- Ca 1: Kiểm Tra Chu Kỳ Mở Cửa (Full Moon Gating) ---');
{
  // Ngày 5: Trăng khuyết đầu tháng (Waxing) -> Đóng cửa
  const day5 = evaluateMoonPhase(5);
  assert(day5.isAuctionOpen === false, 'Ngày 5: Hắc Thị đóng cửa (isAuctionOpen === false)');
  assert(day5.currentMoonPhase === 'waxing', 'Ngày 5: Pha mặt trăng là waxing');
  assert(day5.nextOpenGameDay === 14, `Ngày 5: Ngày mở cửa tiếp theo là 14 (nhận được ${day5.nextOpenGameDay})`);

  // Ngày 20: Trăng khuyết cuối tháng (Waning) -> Đóng cửa
  const day20 = evaluateMoonPhase(20);
  assert(day20.isAuctionOpen === false, 'Ngày 20: Hắc Thị đóng cửa (isAuctionOpen === false)');
  assert(day20.currentMoonPhase === 'waning', 'Ngày 20: Pha mặt trăng là waning');
  assert(day20.nextOpenGameDay === 44, `Ngày 20: Ngày mở cửa chu kỳ sau là 44 (nhận được ${day20.nextOpenGameDay})`);

  // Ngày 14, 15, 16: Đêm Trăng Tròn (Vọng Nguyệt / Full Moon) -> Mở cửa
  const day14 = evaluateMoonPhase(14);
  assert(day14.isAuctionOpen === true, 'Ngày 14: Hắc Thị mở cửa thành công (isAuctionOpen === true)');
  assert(day14.currentMoonPhase === 'full_moon', 'Ngày 14: Pha mặt trăng là full_moon');

  const day15 = evaluateMoonPhase(15);
  assert(day15.isAuctionOpen === true, 'Ngày 15: Hắc Thị mở cửa thành công');
  assert(day15.currentMoonPhase === 'full_moon', 'Ngày 15: Đêm chính rằm Vọng Nguyệt');

  const day16 = evaluateMoonPhase(16);
  assert(day16.isAuctionOpen === true, 'Ngày 16: Hắc Thị mở cửa ngày cuối rằm');

  // Chu kỳ tháng thứ 2: Ngày 44 (tức ngày 14 của tháng 2: 30 + 14 = 44)
  const day44 = evaluateMoonPhase(44);
  assert(day44.isAuctionOpen === true, 'Ngày 44 (Chu kỳ 2): Hắc Thị mở cửa chính xác');
  assert(day44.dayInCycle === 14, 'Ngày 44: Ngày trong chu kỳ là 14');
}

// =====================================================================
// CA 2: KÝ QUỸ TIỀN TỆ & CƠ CHẾ HOÀN TRẢ (ESCROW & OUTBID INVARIANT)
// =====================================================================
console.log('\n--- Ca 2: Ký Quỹ Tiền Tệ & Cơ Chế Hoàn Trả (Escrow & Outbid Invariant) ---');
{
  const player = createNewPlayer();
  player.linhThach = 50000;
  player.spiritStones = 50000;

  const testLot: any = {
    id: 'test_lot_escrow',
    itemId: 'contra_pill_01',
    itemName: 'Huyết Linh Đoạt Hồn Đan',
    category: 'forbidden_pill',
    rarityTier: 4,
    description: 'Cấm đan thử nghiệm',
    basePrice: 5000,
    currentBid: 8000,
    minIncrement: 1000,
    sellerType: 'npc',
    sellerName: 'Hắc Xà Lão Quái',
    highestBidderName: 'Hắc Xà Lão Quái',
    isPlayerHighestBidder: false,
    timeLeftSeconds: 120,
    isSettled: false,
    bustRiskAdded: 8
  };

  const session: BlackMarketSessionState = {
    isAuctionOpen: true,
    currentMoonPhase: 'full_moon',
    currentDay: 15,
    nextOpenGameDay: 15,
    bustRiskMeter: 0,
    activeLots: [testLot],
    playerEscrowStones: 0,
    raidIncidentActive: false,
    contrabandHistory: []
  };

  const lotId = testLot.id;
  const bidAmount = 10000;

  // 1. Người chơi trả giá 10,000 Linh Thạch
  const bidRes = playerPlaceBid(player, session, lotId, bidAmount);
  assert(bidRes.success === true, `Đặt giá 10,000 thành công: ${bidRes.message}`);
  assert(bidRes.updatedPlayer.linhThach === 40000, `Số dư Linh Thạch giảm đúng 10,000 (còn 40,000, thực tế ${bidRes.updatedPlayer.linhThach})`);
  assert(bidRes.updatedPlayer.spiritStones === 40000, `Số dư spiritStones đồng bộ 40,000`);
  assert(bidRes.updatedSession.playerEscrowStones === 10000, `Số tiền ký quỹ là 10,000 (thực tế ${bidRes.updatedSession.playerEscrowStones})`);

  const updatedLot = bidRes.updatedSession.activeLots.find(l => l.id === lotId)!;
  assert(updatedLot.isPlayerHighestBidder === true, 'Người chơi đang là người trả giá cao nhất');
  assert(updatedLot.currentBid === 10000, 'Giá hiện tại của lot cập nhật thành 10,000');

  // 2. NPC nâng giá lên 11,000 -> Kích hoạt Outbid Refund
  const outbidRes = handleNpcOutbidRefund(bidRes.updatedPlayer, bidRes.updatedSession, lotId, 10000);
  assert(outbidRes.refundedAmount === 10000, 'Khoản tiền hoàn trả đúng 10,000');
  assert(outbidRes.updatedPlayer.linhThach === 50000, `Số dư hoàn trả nguyên vẹn về 50,000 (thực tế ${outbidRes.updatedPlayer.linhThach})`);
  assert(outbidRes.updatedPlayer.spiritStones === 50000, `Số dư spiritStones hoàn trả nguyên vẹn về 50,000`);
  assert(outbidRes.updatedSession.playerEscrowStones === 0, `Ký quỹ trở về 0 sau khi hoàn trả`);
}

// =====================================================================
// CA 3: LỢI NHUẬN KÝ GỬI GẤP ĐÔI (DOUBLE PROFIT SETTLEMENT)
// =====================================================================
console.log('\n--- Ca 3: Lợi Nhuận Ký Gửi Gấp Đôi (Double Profit Settlement) ---');
{
  const player = createNewPlayer();
  player.linhThach = 20000;
  player.spiritStones = 20000;

  // Tạo vật phẩm cấm kỵ của người chơi: Giá gốc 5,000
  const contrabandItem = {
    id: 'player_contra_soul_orb',
    name: 'U Hồn Huyết Tinh Thạch',
    type: 'material',
    category: 'materials',
    tier: 3,
    description: 'Khoáng thạch ma đạo thấm đẫm oán niệm u hồn.',
    price: 5000,
    stackable: false,
    quantity: 1
  };
  player.inventory = {
    ores: [contrabandItem as any]
  } as any;

  const session: BlackMarketSessionState = {
    isAuctionOpen: true,
    currentMoonPhase: 'full_moon',
    currentDay: 15,
    nextOpenGameDay: 15,
    bustRiskMeter: 0,
    activeLots: [],
    playerEscrowStones: 0,
    raidIncidentActive: false,
    contrabandHistory: []
  };

  // Ký gửi cấm vật lên sàn với giá khởi điểm x2 (>= 10,000)
  const consignRes = consignPlayerContraband(player, session, contrabandItem, 10000);
  assert(consignRes.success === true, `Ký gửi cấm phẩm thành công: ${consignRes.message}`);
  assert((consignRes.createdLot?.basePrice ?? 0) === 5000, 'Giá gốc cấm vật là 5,000');
  assert((consignRes.createdLot?.currentBid ?? 0) >= 10000, `Giá khởi điểm tối thiểu gấp đôi >= 10,000 (nhận ${consignRes.createdLot?.currentBid})`);

  // Kiểm tra vật phẩm trong hòm đồ đã bị khóa ký quỹ (Anti-Dup)
  const lockedInBag = consignRes.updatedPlayer.inventory?.ores?.find((i: any) => i.id === contrabandItem.id);
  assert(Boolean(lockedInBag?.isLockedInEscrow) === true, 'Vật phẩm trong hòm đồ bị khóa ký quỹ (isLockedInEscrow === true)');

  // Giả lập đấu giá kết thúc thành công: NPC trả 12,000 và thắng phiên
  const consignedLot = consignRes.updatedSession.activeLots[0];
  consignedLot.currentBid = 12000;
  consignedLot.highestBidderName = 'U Minh Lão Quái';
  consignedLot.isPlayerHighestBidder = false;
  consignedLot.timeLeftSeconds = 0;

  const settleRes = settleBlackMarketLot(consignRes.updatedPlayer, consignRes.updatedSession, consignedLot.id);
  assert(settleRes.success === true, `Kết toán phiên đấu giá ký gửi: ${settleRes.message}`);
  assert(settleRes.rewardStones >= 10000, `Thu về tối thiểu gấp đôi giá gốc (nhận ${settleRes.rewardStones} >= 10,000)`);
  // Số dư ban đầu 20,000 + 12,000 = 32,000
  assert(settleRes.updatedPlayer.linhThach === 32000, `Linh Thạch người chơi nhận đủ tiền bán (thực tế ${settleRes.updatedPlayer.linhThach})`);

  // Vật phẩm đã bán thành công bị gỡ khỏi túi đồ
  const remainingInBag = settleRes.updatedPlayer.inventory?.ores?.find((i: any) => i.id === contrabandItem.id);
  assert(!remainingInBag, 'Vật phẩm đã bán thành công không còn trong túi đồ');
}

// =====================================================================
// CA 4: TÍCH LŨY BUST RISK & KÍCH HOẠT ĐỘT KÍCH (BUST RISK THRESHOLD)
// =====================================================================
console.log('\n--- Ca 4: Tích Lũy Bust Risk & Kích Hoạt Đột Kích (Bust Risk Threshold) ---');
{
  // 1. Dưới hoặc bằng 50%: Không bao giờ kích hoạt đột kích
  const noRaid1 = checkBustRaidTrigger(0, 0.01);
  assert(noRaid1 === false, 'Bust Risk 0%: Không kích hoạt đột kích');

  const noRaid2 = checkBustRaidTrigger(50, 0.01);
  assert(noRaid2 === false, 'Bust Risk 50%: Chưa vượt ngưỡng 50% -> Không đột kích');

  // 2. Trên 50%: Xác suất là (bustRiskMeter - 40)%
  // Ví dụ: bustRiskMeter = 70% -> Xác suất (70 - 40)% = 30% (0.30)
  // Nếu roll = 0.20 (<= 0.30) -> Kích hoạt!
  const raidTriggered = checkBustRaidTrigger(70, 0.20);
  assert(raidTriggered === true, 'Bust Risk 70% với roll 0.20 (<= 0.30): Kích hoạt đột kích thành công');

  // Nếu roll = 0.50 (> 0.30) -> Không kích hoạt
  const raidAvoided = checkBustRaidTrigger(70, 0.50);
  assert(raidAvoided === false, 'Bust Risk 70% với roll 0.50 (> 0.30): May mắn chưa bị đột kích');

  // 3. Kiểm tra tích lũy qua lượt trả giá của người chơi
  const player = createNewPlayer();
  player.linhThach = 500000;
  player.spiritStones = 500000;

  const session: BlackMarketSessionState = {
    isAuctionOpen: true,
    currentMoonPhase: 'full_moon',
    currentDay: 15,
    nextOpenGameDay: 15,
    bustRiskMeter: 0,
    activeLots: generateBlackMarketLots(15, 3),
    playerEscrowStones: 0,
    raidIncidentActive: false
  };

  // Trả giá lot có bustRiskAdded = 10
  const lot = session.activeLots[0];
  const res1 = playerPlaceBid(player, session, lot.id, lot.currentBid + lot.minIncrement);
  assert(res1.updatedSession.bustRiskMeter > 0, `Bust Risk tích lũy tăng: ${res1.updatedSession.bustRiskMeter}%`);
}

// =====================================================================
// CA 5: GIẢI QUYẾT BIẾN CỐ ĐỘT KÍCH & MA TÍNH (RAID RESOLUTION)
// =====================================================================
console.log('\n--- Ca 5: Giải Quyết Biến Cố Đột Kích & Ma Tính (Raid Resolution) ---');
{
  const basePlayer = createNewPlayer();
  basePlayer.linhThach = 100000;
  basePlayer.spiritStones = 100000;
  basePlayer.demonicNature = 15;

  const raidSession: BlackMarketSessionState = {
    isAuctionOpen: true,
    currentMoonPhase: 'full_moon',
    currentDay: 15,
    nextOpenGameDay: 15,
    bustRiskMeter: 75,
    activeLots: generateBlackMarketLots(15, 2),
    playerEscrowStones: 20000,
    raidIncidentActive: true
  };

  // Kịch bản A: Huyết Chiến (Fight) & Thắng trận -> Ma Tính +30
  const fightWinRes = resolveRaidEncounter('fight', basePlayer, raidSession, true);
  assert(fightWinRes.success === true, `Huyết chiến thắng lợi: ${fightWinRes.message}`);
  assert(fightWinRes.demonicNatureChange === 30, 'Ma Tính tăng đúng +30 điểm');
  assert(fightWinRes.updatedPlayer.demonicNature === 45, `Ma Tính người chơi từ 15 lên 45 (nhận ${fightWinRes.updatedPlayer.demonicNature})`);
  assert(fightWinRes.updatedSession.raidIncidentActive === false, 'Biến cố đột kích được giải tỏa (raidIncidentActive === false)');
  assert(fightWinRes.updatedSession.bustRiskMeter === 10, 'Bust Risk hạ về mức cảnh giác thấp 10%');

  // Kịch bản B: Nộp Phạt Đút Lót (Bribe) -> Tiêu hao 30% Linh Thạch, bustRisk = 0
  const bribeRes = resolveRaidEncounter('bribe', basePlayer, raidSession);
  assert(bribeRes.success === true, `Đút lót thoát thân: ${bribeRes.message}`);
  assert(bribeRes.spiritStonesLost === 30000, `Khấu trừ đúng 30% tổng Linh Thạch (100,000 * 30% = 30,000)`);
  assert(bribeRes.updatedPlayer.linhThach === 70000, `Số dư Linh Thạch còn lại 70,000 (thực tế ${bribeRes.updatedPlayer.linhThach})`);
  assert(bribeRes.updatedSession.bustRiskMeter === 0, 'Nguy cơ bại lộ xóa về 0% sau khi hối lộ quan chức');
  assert(bribeRes.updatedSession.raidIncidentActive === false, 'Biến cố đột kích kết thúc an toàn');

  // Kịch bản C: Vứt Của Chạy Lấy Người (Flee) -> Tịch thu ký quỹ, không tăng ma tính
  const fleeRes = resolveRaidEncounter('flee', basePlayer, raidSession);
  assert(fleeRes.success === true, `Vứt của chạy trốn: ${fleeRes.message}`);
  assert(fleeRes.spiritStonesLost === 20000, `Tịch thu toàn bộ 20,000 tiền ký quỹ`);
  assert(fleeRes.demonicNatureChange === 0, 'Không tăng Ma Tính khi chạy trốn');
  assert(fleeRes.updatedPlayer.demonicNature === 15, 'Ma Tính người chơi giữ nguyên 15');
}

// =====================================================================
// CA 6: KIỂM THỬ KHẢ NĂNG TƯƠNG THÍCH SAVE CŨ (SAVE MIGRATION INVARIANT)
// =====================================================================
console.log('\n--- Ca 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant) ---');
{
  // Giả lập mock save v6 cũ: không có blackMarketState, bustRiskMeter, contrabandHistory
  // và có 1 item trong kho bị kẹt isLockedInEscrow: true từ phiên trước
  const legacyMockSave: any = {
    id: 'legacy_player_1001',
    name: 'Vô Danh Tu Sĩ',
    currentRealm: 5,
    linhThach: 88888,
    inventory: {
      ores: [
        {
          id: 'stuck_contraband_item',
          name: 'Tử Linh Thạch',
          type: 'material',
          price: 3000,
          isLockedInEscrow: true // Bị kẹt lỗi phiên chợ cũ
        }
      ],
      equipments: [
        {
          id: 'normal_sword',
          name: 'Thanh Phong Kiếm',
          type: 'weapon',
          price: 1500
        }
      ]
    },
    beastGarden: {
      facility: { level: 1 },
      eggs: [
        {
          id: 'egg_legacy_01',
          name: 'Hỏa Tước Noãn',
          isHeretical: true // Đã là trứng tà đạo
        }
      ]
    }
  };

  const migrated = migrateBlackMarketData(legacyMockSave);

  // 1. Kiểm tra không bị lỗi undefined và khởi tạo chuẩn
  assert(migrated.blackMarketState === null, 'blackMarketState được gán an toàn là null');
  assert(migrated.bustRiskMeter === 0, 'bustRiskMeter được khởi tạo an toàn bằng 0');
  assert(Array.isArray(migrated.contrabandHistory) && migrated.contrabandHistory.length === 0, 'contrabandHistory là mảng rỗng []');

  // 2. Kiểm tra đồng bộ spiritStones
  assert(migrated.spiritStones === 88888, `spiritStones đồng bộ chuẩn xác với linhThach (88,888)`);

  // 3. Kiểm tra tự động giải phóng vật phẩm kẹt trong escrow
  const healedItem = migrated.inventory?.ores?.find((i: any) => i.id === 'stuck_contraband_item');
  assert(Boolean(healedItem?.isLockedInEscrow) === false, 'Vật phẩm kẹt trong escrow được giải phóng an toàn (isLockedInEscrow === false)');

  // 4. Kiểm tra bảo tồn nguyên vẹn beastGarden.eggs và cờ isHeretical
  const hereticalEgg = migrated.beastGarden?.eggs?.find((e: any) => e.id === 'egg_legacy_01');
  assert(Boolean(hereticalEgg?.isHeretical) === true, 'Cờ isHeretical của Linh Noãn được bảo toàn nguyên vẹn');

  console.log('✅ Save cũ chuẩn hóa 100% không phát sinh bất kỳ lỗi undefined hay corruption nào!');
}

console.log('\n================================================================');
console.log('🎉 TẤT CẢ 6/6 CA KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC (100% PASSED)!');
console.log('================================================================');
