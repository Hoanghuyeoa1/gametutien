// lib/types/black-market.ts
// Kiểu dữ liệu cho phân hệ "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"

export type ContrabandCategory =
  | 'forbidden_pill'     // Ma đan cấm kỵ (Huyết Đan, Đoạt Hồn Đan...)
  | 'demonic_artifact'    // Pháp bảo ma đạo (Hồn Phiến, Cốt Kiếm...)
  | 'cursed_tome'        // Tà đạo bí kíp (Thôn Thiên Ma Công, Huyết Sát Quyết...)
  | 'heretical_egg'      // Linh noãn biến dị / tà đạo (Thú Uyển Dị Chủng)
  | 'abyssal_ore';       // Khoáng thạch cửu u / ma thạch vực sâu

export type MoonPhase = 'waxing' | 'full_moon' | 'waning' | 'new_moon';

export interface BlackMarketLot {
  id: string;
  itemId: string;
  itemName: string;
  category: ContrabandCategory;
  rarityTier: number;            // 1 - 9 (Nhất Giai -> Cửu Giai)
  description: string;
  basePrice: number;             // Giá gốc thị trường (Linh Thạch)
  currentBid: number;            // Giá hiện tại trên sàn
  minIncrement: number;          // Mức nâng giá tối thiểu
  sellerType: 'npc' | 'player';
  sellerName: string;
  highestBidderName: string;
  isPlayerHighestBidder: boolean;
  timeLeftSeconds: number;       // Đếm ngược phiên đấu giá (giây)
  isSettled: boolean;
  bustRiskAdded: number;         // % Nguy cơ bại lộ tích lũy nếu tham gia lot này
  attachedEggData?: any;         // Dữ liệu nếu là Linh Noãn Tà Đạo (hệ thống Thú Uyển)
  isLockedInEscrow?: boolean;    // Cờ khóa vật phẩm đang ký gửi trên sàn
}

export interface BlackMarketHistoryRecord {
  id: string;
  lotId: string;
  itemName: string;
  category: ContrabandCategory;
  price: number;
  type: 'buy' | 'sell' | 'confiscated';
  timestamp: number;
  notes?: string;
}

export interface BlackMarketSessionState {
  isAuctionOpen: boolean;
  currentMoonPhase: MoonPhase;
  currentDay: number;            // Ngày tu tiên hiện tại
  nextOpenGameDay: number;       // Ngày mở cửa gần nhất tiếp theo
  bustRiskMeter: number;         // 0 - 100% (Thanh nguy cơ bị truy quét)
  activeLots: BlackMarketLot[];
  playerEscrowStones: number;    // Linh thạch đang ký quỹ
  raidIncidentActive: boolean;   // Cờ đang bị Tiên Quan Chấp Pháp đột kích
  contrabandHistory?: BlackMarketHistoryRecord[];
  isLockedInEscrow?: boolean;
}

export type RaidResolutionChoice = 'bribe' | 'flee' | 'fight';

export interface RaidResolutionResult {
  success: boolean;
  choice: RaidResolutionChoice;
  message: string;
  demonicNatureChange: number;
  spiritStonesLost: number;
  itemsConfiscated: string[];
  combatVictory?: boolean;
  updatedPlayer: any;
  updatedSession: BlackMarketSessionState;
}

export interface ConsignItemPayload {
  id: string;
  name: string;
  category: ContrabandCategory;
  basePrice: number;
  rarityTier?: number;
  description?: string;
  rawItemData?: any;
}
