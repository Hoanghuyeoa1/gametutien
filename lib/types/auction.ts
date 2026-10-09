// lib/types/auction.ts

export type AuctionItemCategory = 'equipment' | 'manual' | 'pill' | 'egg' | 'material' | 'special' | string;
export type AuctionRarity = 'rare' | 'epic' | 'legendary' | 'mythic' | string;

export interface AuctionNPC {
  id: string;
  name: string;
  title?: string;
  personality?: string;
  avatar?: string;
  budget: number;
  thanThuc: number;
  color?: string;
  dialogue?: string;
  maxBidMultiplier?: number;
  targetCategories?: AuctionItemCategory[];
  currentBid?: number;
  isPassed?: boolean;
  hasFolded?: boolean;
  isIntimidated?: boolean;
  roleType?: 'tan_tu' | 'the_gia' | 'truong_lao' | 'thuong_hoi';
  intimidateCount?: number;
  intimidateStatusText?: string;
  originalBudget?: number;
  budgetCeiling?: number;
  [key: string]: any;
}

export interface AuctionBidRecord {
  id?: string;
  bidderId?: string;
  bidderName: string;
  bidderType?: string;
  amount: number;
  isPlayer?: boolean;
  timestamp?: string | number;
  quote?: string;
  [key: string]: any;
}

export interface AuctionLotItem {
  id: string;
  name: string;
  type?: string;
  category: string;
  rarity: AuctionRarity | string;
  grade?: string;
  icon?: string;
  description: string;
  lore?: string;
  startingPrice: number;
  reservePrice: number;
  minBidIncrement?: number;
  currentPrice?: number;
  roundsRemaining?: number;
  itemData?: any;
  rewardPayload?: any;
  [key: string]: any;
}

export interface AuctionSessionState {
  isActive: boolean;
  sessionTitle: string;
  items: AuctionLotItem[];
  currentItemIndex: number;
  currentPrice: number;
  highestBidder: {
    name: string;
    isPlayer: boolean;
    bidderId: string;
    [key: string]: any;
  };
  currentLotIndex?: number;
  totalLots?: number;
  currentLot?: any;
  playerCurrentBid?: number;
  hammerCount: number;
  roundTimer?: number;
  biddingHistory?: any[];
  bidHistory: AuctionBidRecord[];
  npcs: AuctionNPC[];
  status?: 'preview' | 'bidding' | 'sold' | 'passed' | 'completed' | string;
  logs?: any[];
  lastActionTime: number;
  [key: string]: any;
}
