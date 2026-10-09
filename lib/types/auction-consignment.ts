// lib/types/auction-consignment.ts
// Domain Types cho phân hệ "Ký Gửi Đấu Giá & Thao Túng Phường Thị (Player Auction Consignment & Market Manipulation)"

export type ConsignmentItemType = 'pill' | 'equipment' | 'beast_egg' | 'manual';

export interface ConsignmentItemSource {
  id: string;
  name: string;
  type: ConsignmentItemType;
  grade: string;
  quality: string;
  icon?: string;
  description: string;
  estimatedMarketValue: number; // Giá trị thị trường ước tính (Linh Thạch)
  rawItemData: any;             // Sao lưu cấu trúc gốc để hoàn trả nếu hủy/đấu giá thất bại
}

export type ConsignmentStatus = 'idle' | 'listing' | 'bidding' | 'sold' | 'unsold' | 'busted';

export interface NPCBidder {
  id: string;
  name: string;
  title: string;
  sectOrFamily: string;
  avatar: string;
  personality: 'timid' | 'aggressive' | 'greedy' | 'tycoon';
  divineSense: number;
  maxBudget: number;
  currentInterest: number; // 0 - 100
  hasWithdrawn: boolean;
  color?: string;
}

export interface BidRecord {
  round: number;
  bidderName: string;
  bidderTitle: string;
  isShill: boolean;
  bidAmount: number;
  timestamp: number;
  commentary: string; // Lời bình phẩm tiên hiệp khi nâng giá
}

export interface ActiveConsignmentSession {
  item: ConsignmentItemSource;
  startingPrice: number;
  reservePrice: number;
  currentBid: number;
  highestBidder: NPCBidder | { name: string; isShill: boolean; title?: string };
  currentRound: number;
  maxRounds: number;
  status: ConsignmentStatus;
  bidders: NPCBidder[];
  bidHistory: BidRecord[];
  shillBidCount: number;
  bustRiskPercent: number; // 0 - 100%
  divineSenseUsedCount: number;
  startedAt: number;
}

export interface ConfiscatedItemRecord {
  item: ConsignmentItemSource;
  confiscatedUntilTimestamp: number;
  fineAmount: number;
}

export interface ConsignmentTransactionRecord {
  itemName: string;
  finalPrice: number;
  profit: number;
  soldTo: string;
  timestamp: number;
}

export interface PlayerConsignmentState {
  merchantReputation: number; // 0 - 100 (Điểm Uy Tín Thương Nhân)
  totalSalesVolume: number;   // Tổng Linh Thạch kiếm được từ ký gửi
  successfulAuctionsCount: number;
  bustedCount: number;
  activeSession: ActiveConsignmentSession | null;
  confiscatedItems: ConfiscatedItemRecord[];
  history: ConsignmentTransactionRecord[];
}
