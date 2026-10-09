// hooks/useMerchantTabActions.ts
// Custom Hook — Điều Phối Toàn Bộ UI State & Logic Của Phân Hệ Vạn Bảo Thương Hội
// 100% Strict TypeScript, Zero Any, Parity với MerchantTab.tsx gốc

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerStats, MerchantCategory, MerchantItem, HerbShopItem } from '@/lib/types';
import { OreShopItem } from '@/lib/types/ores-shop';
import { EquipmentShopItem } from '@/lib/types/equipment-shop';
import { CompanionShopItem } from '@/lib/types/companions-shop';
import { BeastShopItem } from '@/lib/types/beasts-shop';
import { StorageShopItem } from '@/lib/types/storage-shop';
import { HerbCategory } from '@/lib/types';
import { OreCategory } from '@/lib/types/ores-shop';
import { EquipmentSlotType } from '@/lib/types/equipment-shop';
import { CompanionArchetype } from '@/lib/types/companions-shop';
import { BeastArchetype } from '@/lib/types/beasts-shop';
import { StorageCategory } from '@/lib/types/storage-shop';
import {
  matchMerchantCategory,
  matchMerchantTier,
  sortMerchantItems,
  getItemTierWeight,
  DAILY_REFRESH_INTERVAL_MS,
  type MerchantTierFilter,
} from '@/lib/merchant-data';
import { MANUALS_SHOP_ITEMS_MAP } from '@/lib/manuals-shop-data';
import { DIVINE_SHOP_ITEMS_MAP } from '@/lib/divine-abilities-data';
import { HERBS_SHOP_ITEMS_MAP } from '@/lib/herbs-shop-data';
import { ORES_SHOP_ITEMS_MAP } from '@/lib/ores-shop-data';
import { EQUIPMENT_SHOP_ITEMS_MAP } from '@/lib/equipment-shop-data';
import { COMPANIONS_SHOP_ITEMS_MAP } from '@/lib/companions-shop-data';
import { BEASTS_SHOP_ITEMS_MAP } from '@/lib/beasts-shop-data';
import { STORAGE_SHOP_ITEMS_MAP } from '@/lib/storage-shop-data';
import { TradeModalState } from '@/components/tabs/merchant/MerchantTradeModal';
import { calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';

// ============================================================================
// INTERNAL TYPES
// ============================================================================

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
}

type PillCategoryFilter = 'all' | 'tu_vi' | 'breakthrough' | 'lifespan' | 'stat_boost';
type CultCategoryFilter = 'all' | 'manual' | 'array' | 'essence' | 'incense';
type ManualCategoryFilter = 'all' | 'cong_kich' | 'phong_ngu' | 'than_phap' | 'cam_thuat';
type DivineCategoryFilter = 'all' | 'cong_phat' | 'ho_than' | 'tran_ap' | 'linh_vuc';

// ============================================================================
// HOOK PARAMS & RETURN INTERFACE
// ============================================================================

export interface UseMerchantTabActionsParams {
  player: PlayerStats;
  merchantSubTab: MerchantCategory;
  handleRefreshMerchant: (force?: boolean) => void;
  handleBuyMerchantItem?: (item: MerchantItem, quantity?: number) => void;
}

export interface UseMerchantTabActionsReturn {
  // --- Active Tab State (Root Orchestrator) ---
  activeSubTab: 'phuong_thi' | 'cho_den' | 'thu_mua';
  setActiveSubTab: React.Dispatch<React.SetStateAction<'phuong_thi' | 'cho_den' | 'thu_mua'>>;

  // --- Black Market State ---
  blackMarketCountdown: string;
  blackMarketRefreshCost: number;
  handleRefreshBlackMarket: () => void;
  blackMarketItems: MerchantItem[];

  // --- Shared Trade Modal State ---
  tradeModalState: TradeModalState | null;
  setTradeModalState: React.Dispatch<React.SetStateAction<TradeModalState | null>>;
  tradeQuantity: number;
  setTradeQuantity: (qty: number) => void;
  isProcessing: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openTradeModal: (item: any, mode?: 'buy' | 'sell', unitPrice?: number, maxStock?: number) => void;
  closeTradeModal: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirmTrade: (onSuccessBuy?: (item: any, qty: number) => void) => void;

  // --- Countdown Timer ---
  countdownFormatted: string;
  timeLeft: CountdownState;

  // --- Tier Filter ---
  selectedTier: MerchantTierFilter;
  setSelectedTier: (tier: MerchantTierFilter) => void;
  tierItemCounts: Record<string | number, number>;

  // --- Sub-Category Filters ---
  pillCategoryFilter: PillCategoryFilter;
  setPillCategoryFilter: (f: PillCategoryFilter) => void;
  cultCategoryFilter: CultCategoryFilter;
  setCultCategoryFilter: (f: CultCategoryFilter) => void;
  manualCategoryFilter: ManualCategoryFilter;
  setManualCategoryFilter: (f: ManualCategoryFilter) => void;
  divineCategoryFilter: DivineCategoryFilter;
  setDivineCategoryFilter: (f: DivineCategoryFilter) => void;
  herbCategoryFilter: 'all' | HerbCategory;
  setHerbCategoryFilter: (f: 'all' | HerbCategory) => void;
  oreCategoryFilter: 'all' | OreCategory;
  setOreCategoryFilter: (f: 'all' | OreCategory) => void;
  equipmentSlotFilter: 'all' | EquipmentSlotType;
  setEquipmentSlotFilter: (f: 'all' | EquipmentSlotType) => void;
  companionArchetypeFilter: 'all' | CompanionArchetype;
  setCompanionArchetypeFilter: (f: 'all' | CompanionArchetype) => void;
  beastArchetypeFilter: 'all' | BeastArchetype;
  setBeastArchetypeFilter: (f: 'all' | BeastArchetype) => void;
  storageCategoryFilter: 'all' | StorageCategory;
  setStorageCategoryFilter: (f: 'all' | StorageCategory) => void;

  // --- Derived / Filtered Items ---
  filteredItems: MerchantItem[];

  // --- Buy Modal States ---
  buyingPillModal: MerchantItem | null;
  setBuyingPillModal: (item: MerchantItem | null) => void;
  buyQuantity: number;
  setBuyQuantity: (qty: number) => void;

  batchBuyingHerbModal: HerbShopItem | null;
  setBatchBuyingHerbModal: (item: HerbShopItem | null) => void;
  herbBatchQuantity: number;
  setHerbBatchQuantity: (qty: number) => void;

  batchBuyingOreModal: OreShopItem | null;
  setBatchBuyingOreModal: (item: OreShopItem | null) => void;
  oreBatchQuantity: number;
  setOreBatchQuantity: (qty: number) => void;

  // --- Detail View Modal States ---
  viewingManualModal: MerchantItem | null;
  setViewingManualModal: (item: MerchantItem | null) => void;
  viewingDivineModal: MerchantItem | null;
  setViewingDivineModal: (item: MerchantItem | null) => void;
  viewingEquipModal: EquipmentShopItem | null;
  setViewingEquipModal: (item: EquipmentShopItem | null) => void;
  viewingCompanionModal: CompanionShopItem | null;
  setViewingCompanionModal: (item: CompanionShopItem | null) => void;
  viewingBeastModal: BeastShopItem | null;
  setViewingBeastModal: (item: BeastShopItem | null) => void;
  viewingStorageModal: StorageShopItem | null;
  setViewingStorageModal: (item: StorageShopItem | null) => void;

  // --- Helper ---
  resetAllFilters: () => void;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

const padZero = (n: number) => n.toString().padStart(2, '0');

export function useMerchantTabActions(
  playerOrParams: PlayerStats | UseMerchantTabActionsParams,
  _setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>>,
  options?: {
    merchantSubTab?: MerchantCategory;
    handleRefreshMerchant?: (force?: boolean) => void;
    handleBuyMerchantItem?: (item: MerchantItem, quantity?: number) => void;
  }
): UseMerchantTabActionsReturn {
  const isParamsObj =
    typeof playerOrParams === 'object' &&
    playerOrParams !== null &&
    'player' in playerOrParams &&
    'merchantSubTab' in playerOrParams;

  const player = isParamsObj
    ? (playerOrParams as UseMerchantTabActionsParams).player
    : (playerOrParams as PlayerStats);

  const merchantSubTab = isParamsObj
    ? (playerOrParams as UseMerchantTabActionsParams).merchantSubTab
    : (options?.merchantSubTab || 'all');

  const handleRefreshMerchant = isParamsObj
    ? (playerOrParams as UseMerchantTabActionsParams).handleRefreshMerchant
    : (options?.handleRefreshMerchant || (() => {}));

  // ---------------------------------------------------------------------------
  // 0. ROOT ORCHESTRATOR SUB-TAB NAVIGATION & UNIFIED TRADE MODAL
  // ---------------------------------------------------------------------------
  const [activeSubTab, setActiveSubTab] = useState<'phuong_thi' | 'cho_den' | 'thu_mua'>('phuong_thi');

  const [tradeModalState, setTradeModalState] = useState<TradeModalState | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openTradeModal = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any, mode: 'buy' | 'sell' = 'buy', customPrice?: number, customMaxStock?: number) => {
      if (!item) return;
      const unitPrice = customPrice !== undefined ? customPrice : (item.price || 0);
      const playerMoney = calculateTotalEquivalentHaPham(player);
      const maxStock = customMaxStock !== undefined ? customMaxStock : (item.stock ?? 99);
      const maxAffordable = unitPrice > 0 ? Math.floor(playerMoney / unitPrice) : maxStock;

      setTradeModalState({
        item,
        unitPrice,
        playerMoney,
        maxStock,
        maxAffordable,
        mode,
        icon: item.icon,
      });
      setTradeQuantity(1);
    },
    [player]
  );

  const closeTradeModal = useCallback(() => {
    setTradeModalState(null);
    setTradeQuantity(1);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const confirmTrade = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onSuccessBuy?: (item: any, qty: number) => void) => {
      if (!tradeModalState) return;
      setIsProcessing(true);
      try {
        if (onSuccessBuy) {
          onSuccessBuy(tradeModalState.item, tradeQuantity);
        } else if (options?.handleBuyMerchantItem) {
          options.handleBuyMerchantItem(tradeModalState.item, tradeQuantity);
        }
        closeTradeModal();
      } finally {
        setIsProcessing(false);
      }
    },
    [tradeModalState, tradeQuantity, closeTradeModal, options]
  );

  // ---------------------------------------------------------------------------
  // 0B. HẮC THỊ (BLACK MARKET) LOGIC
  // ---------------------------------------------------------------------------
  const [blackMarketTimeLeft, setBlackMarketTimeLeft] = useState<CountdownState>({
    hours: 6,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateBmCountdown = () => {
      const now = Date.now();
      const interval = 6 * 60 * 60 * 1000;
      const diff = interval - (now % interval);
      setBlackMarketTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateBmCountdown();
    const timer = setInterval(updateBmCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const blackMarketCountdown = `${padZero(blackMarketTimeLeft.hours)}:${padZero(blackMarketTimeLeft.minutes)}:${padZero(blackMarketTimeLeft.seconds)}`;
  const blackMarketRefreshCost = 500;

  const handleRefreshBlackMarket = useCallback(() => {
    handleRefreshMerchant(true);
  }, [handleRefreshMerchant]);

  const blackMarketItems = useMemo(() => {
    const items = player.merchantState?.items || [];
    return items.filter((it) => {
      const weight = getItemTierWeight(it);
      return (
        it.isBlackMarket ||
        it.isContraband ||
        weight >= 3 ||
        it.price >= 500 ||
        it.quality === 'cuc_pham' ||
        it.quality === 'tuyet_pham'
      );
    });
  }, [player.merchantState?.items]);

  // ---------------------------------------------------------------------------
  // 1. COUNTDOWN TIMER ĐẾN PHIÊN HÀNG MỚI (24H)
  // ---------------------------------------------------------------------------
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const lastRefresh =
        player.merchantState?.lastDailyRefreshTime ||
        player.merchantState?.lastRefreshTime ||
        Date.now();
      const nextRefresh = lastRefresh + DAILY_REFRESH_INTERVAL_MS;
      const diff = Math.max(0, nextRefresh - Date.now());

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });

      // Tự động làm mới miễn phí khi hết đồng hồ
      if (diff <= 0) {
        handleRefreshMerchant(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [player.merchantState?.lastDailyRefreshTime, handleRefreshMerchant]);

  const countdownFormatted = `${padZero(timeLeft.hours)}:${padZero(timeLeft.minutes)}:${padZero(timeLeft.seconds)}`;

  // ---------------------------------------------------------------------------
  // 2. BỘ LỌC NHANH GIAI VỊ (TIER 1-9 + ALL)
  // ---------------------------------------------------------------------------
  const [selectedTier, setSelectedTier] = useState<MerchantTierFilter>('all');

  // ---------------------------------------------------------------------------
  // 3. BỘ LỌC PHỤ THEO DANH MỤC CON
  // ---------------------------------------------------------------------------
  const [pillCategoryFilter, setPillCategoryFilter] = useState<PillCategoryFilter>('all');
  const [cultCategoryFilter, setCultCategoryFilter] = useState<CultCategoryFilter>('all');
  const [manualCategoryFilter, setManualCategoryFilter] = useState<ManualCategoryFilter>('all');
  const [divineCategoryFilter, setDivineCategoryFilter] = useState<DivineCategoryFilter>('all');
  const [herbCategoryFilter, setHerbCategoryFilter] = useState<'all' | HerbCategory>('all');
  const [oreCategoryFilter, setOreCategoryFilter] = useState<'all' | OreCategory>('all');
  const [equipmentSlotFilter, setEquipmentSlotFilter] = useState<'all' | EquipmentSlotType>('all');
  const [companionArchetypeFilter, setCompanionArchetypeFilter] = useState<'all' | CompanionArchetype>('all');
  const [beastArchetypeFilter, setBeastArchetypeFilter] = useState<'all' | BeastArchetype>('all');
  const [storageCategoryFilter, setStorageCategoryFilter] = useState<'all' | StorageCategory>('all');

  // ---------------------------------------------------------------------------
  // 4. RESET TẤT CẢ BỘ LỌC KHI ĐỔI SubTab
  // ---------------------------------------------------------------------------
  const resetAllFilters = useCallback(() => {
    setSelectedTier('all');
    setPillCategoryFilter('all');
    setCultCategoryFilter('all');
    setManualCategoryFilter('all');
    setDivineCategoryFilter('all');
    setHerbCategoryFilter('all');
    setOreCategoryFilter('all');
    setEquipmentSlotFilter('all');
    setCompanionArchetypeFilter('all');
    setBeastArchetypeFilter('all');
    setStorageCategoryFilter('all');
  }, []);

  useEffect(() => {
    resetAllFilters();
  }, [merchantSubTab, resetAllFilters]);

  // ---------------------------------------------------------------------------
  // 5. ĐẾM VẬT PHẨM THEO GIAI VỊ (ĐỂ HIỂN THỊ BADGE)
  // ---------------------------------------------------------------------------
  const tierItemCounts = useMemo(() => {
    const merchantItems = player.merchantState?.items || [];
    const currentCategoryItems = merchantItems.filter(item =>
      matchMerchantCategory(item, merchantSubTab)
    );
    const counts: Record<string | number, number> = { all: currentCategoryItems.length };
    currentCategoryItems.forEach(item => {
      const t = getItemTierWeight(item);
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [player.merchantState?.items, merchantSubTab]);

  // ---------------------------------------------------------------------------
  // 6. LỌC VÀ SẮP XẾP HÀNG HÓA (100% PARITY VỚI MerchantTab.tsx GỐC)
  // ---------------------------------------------------------------------------
  const filteredItems = useMemo<MerchantItem[]>(() => {
    const merchantItems = player.merchantState?.items || [];
    const matched = merchantItems.filter(item => {
      const catMatch = matchMerchantCategory(item, merchantSubTab);
      if (!catMatch) return false;
      const tierMatch = matchMerchantTier(item, selectedTier);
      if (!tierMatch) return false;

      // Lọc phụ công dụng đan dược
      if (merchantSubTab === 'pills' && pillCategoryFilter !== 'all') {
        const pCat =
          item.data?.category ||
          (item.pillType === 'exp'
            ? 'tu_vi'
            : item.pillType === 'breakthrough'
            ? 'breakthrough'
            : item.pillType === 'lifespan'
            ? 'lifespan'
            : item.pillType === 'stat'
            ? 'stat_boost'
            : undefined);
        if (pCat !== pillCategoryFilter) {
          if (
            pillCategoryFilter === 'tu_vi' &&
            !(
              item.id.includes('tuvi') ||
              item.id.includes('tu_khi') ||
              item.id.includes('chan_nguyen')
            )
          )
            return false;
          if (
            pillCategoryFilter === 'breakthrough' &&
            !(item.id.includes('break') || item.id.includes('pha_canh'))
          )
            return false;
          if (
            pillCategoryFilter === 'lifespan' &&
            !(
              item.id.includes('life') ||
              item.id.includes('tho_nguyen') ||
              item.id.includes('duong_huyet') ||
              item.id.includes('truong_sinh') ||
              item.id.includes('hoi_thien')
            )
          )
            return false;
          if (
            pillCategoryFilter === 'stat_boost' &&
            !(
              item.id.includes('stat') ||
              item.id.includes('tay_tuy') ||
              item.id.includes('kien_the') ||
              item.id.includes('ngu_than') ||
              item.id.includes('van_phap')
            )
          )
            return false;
        }
      }

      // Lọc phụ vật phẩm tu luyện
      if (merchantSubTab === 'cultivation' && cultCategoryFilter !== 'all') {
        const cCat =
          item.cultivationCategory ||
          item.data?.category ||
          (item.id.includes('_manual')
            ? 'manual'
            : item.id.includes('_array')
            ? 'array'
            : item.id.includes('_essence')
            ? 'essence'
            : item.id.includes('_incense')
            ? 'incense'
            : item.cultivationItemType === 'incense'
            ? 'incense'
            : item.cultivationItemType === 'array_flag'
            ? 'array'
            : undefined);
        if (cCat !== cultCategoryFilter) return false;
      }

      // Lọc phụ phân hệ công pháp bí tịch cửu giai
      if (merchantSubTab === 'manuals' && manualCategoryFilter !== 'all') {
        const mCat = item.manualCategory || MANUALS_SHOP_ITEMS_MAP[item.id]?.category;
        if (mCat !== manualCategoryFilter) return false;
      }

      // Lọc phụ phân môn thần thông cửu giai
      if (
        (merchantSubTab === 'skills' || merchantSubTab === 'divine') &&
        divineCategoryFilter !== 'all'
      ) {
        const dCat =
          item.divineCategory ||
          DIVINE_SHOP_ITEMS_MAP[item.id]?.category ||
          item.data?.category;
        if (dCat !== divineCategoryFilter) return false;
      }

      // Lọc phụ chủng loại dược thảo cửu giai
      if (
        (merchantSubTab === 'materials' || merchantSubTab === 'herbs') &&
        herbCategoryFilter !== 'all'
      ) {
        const hCat =
          item.herbCategory || HERBS_SHOP_ITEMS_MAP[item.id]?.category || item.data?.category;
        if (hCat !== herbCategoryFilter) return false;
      }

      // Lọc phụ chủng loại khoáng thạch cửu giai
      if (merchantSubTab === 'ores' && oreCategoryFilter !== 'all') {
        const oCat =
          item.oreCategory || ORES_SHOP_ITEMS_MAP[item.id]?.category || item.data?.category;
        if (oCat !== oreCategoryFilter) return false;
      }

      // Lọc phụ vị trí trang bị cửu giai
      if (merchantSubTab === 'equipment' && equipmentSlotFilter !== 'all') {
        const eqSlot =
          item.equipmentSlot ||
          EQUIPMENT_SHOP_ITEMS_MAP[item.id]?.slot ||
          item.data?.slot ||
          item.equipmentData?.slot ||
          (item.equipmentType === 'weapon'
            ? 'weapon'
            : item.equipmentType === 'armor'
            ? 'armor'
            : item.equipmentType === 'accessory'
            ? 'accessory'
            : undefined);
        if (eqSlot !== equipmentSlotFilter) return false;
      }

      // Lọc phụ trường phái đạo lữ cửu giai
      if (merchantSubTab === 'companions' && companionArchetypeFilter !== 'all') {
        const arch =
          item.companionArchetype ||
          item.companionData?.archetype ||
          COMPANIONS_SHOP_ITEMS_MAP[item.id]?.archetype;
        if (arch !== companionArchetypeFilter) return false;
      }

      // Lọc phụ trường phái linh thú thần sủng cửu giai
      if (merchantSubTab === 'beasts' && beastArchetypeFilter !== 'all') {
        const arch =
          item.beastArchetype ||
          item.beastData?.archetype ||
          BEASTS_SHOP_ITEMS_MAP[item.id]?.archetype;
        if (arch !== beastArchetypeFilter) return false;
      }

      // Lọc phụ phân nhóm pháp bảo trữ vật cửu giai
      if (
        (merchantSubTab === 'storage' || merchantSubTab === 'inventory') &&
        storageCategoryFilter !== 'all'
      ) {
        const sCat =
          item.storageCategory ||
          item.storageData?.category ||
          STORAGE_SHOP_ITEMS_MAP[item.id]?.category;
        if (sCat !== storageCategoryFilter) return false;
      }

      return true;
    });
    return sortMerchantItems(matched);
  }, [
    player.merchantState?.items,
    merchantSubTab,
    selectedTier,
    pillCategoryFilter,
    cultCategoryFilter,
    manualCategoryFilter,
    divineCategoryFilter,
    herbCategoryFilter,
    oreCategoryFilter,
    equipmentSlotFilter,
    companionArchetypeFilter,
    beastArchetypeFilter,
    storageCategoryFilter,
  ]);

  // ---------------------------------------------------------------------------
  // 7. MODAL STATE — MUA ĐAN DƯỢC / VẬT PHẨM (QUANTITY PICKER)
  // ---------------------------------------------------------------------------
  const [buyingPillModal, setBuyingPillModal] = useState<MerchantItem | null>(null);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);

  const [batchBuyingHerbModal, setBatchBuyingHerbModal] = useState<HerbShopItem | null>(null);
  const [herbBatchQuantity, setHerbBatchQuantity] = useState<number>(1);

  const [batchBuyingOreModal, setBatchBuyingOreModal] = useState<OreShopItem | null>(null);
  const [oreBatchQuantity, setOreBatchQuantity] = useState<number>(1);

  // ---------------------------------------------------------------------------
  // 8. MODAL STATE — XEM CHI TIẾT VẬT PHẨM (READ-ONLY DETAILS)
  // ---------------------------------------------------------------------------
  const [viewingManualModal, setViewingManualModal] = useState<MerchantItem | null>(null);
  const [viewingDivineModal, setViewingDivineModal] = useState<MerchantItem | null>(null);
  const [viewingEquipModal, setViewingEquipModal] = useState<EquipmentShopItem | null>(null);
  const [viewingCompanionModal, setViewingCompanionModal] = useState<CompanionShopItem | null>(null);
  const [viewingBeastModal, setViewingBeastModal] = useState<BeastShopItem | null>(null);
  const [viewingStorageModal, setViewingStorageModal] = useState<StorageShopItem | null>(null);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------
  return {
    // --- Active Tab State (Root Orchestrator) ---
    activeSubTab,
    setActiveSubTab,

    // --- Black Market ---
    blackMarketCountdown,
    blackMarketRefreshCost,
    handleRefreshBlackMarket,
    blackMarketItems,

    // --- Shared Trade Modal ---
    tradeModalState,
    setTradeModalState,
    tradeQuantity,
    setTradeQuantity,
    isProcessing,
    openTradeModal,
    closeTradeModal,
    confirmTrade,

    // Countdown
    countdownFormatted,
    timeLeft,

    // Tier filter
    selectedTier,
    setSelectedTier,
    tierItemCounts,

    // Sub-category filters
    pillCategoryFilter,
    setPillCategoryFilter,
    cultCategoryFilter,
    setCultCategoryFilter,
    manualCategoryFilter,
    setManualCategoryFilter,
    divineCategoryFilter,
    setDivineCategoryFilter,
    herbCategoryFilter,
    setHerbCategoryFilter,
    oreCategoryFilter,
    setOreCategoryFilter,
    equipmentSlotFilter,
    setEquipmentSlotFilter,
    companionArchetypeFilter,
    setCompanionArchetypeFilter,
    beastArchetypeFilter,
    setBeastArchetypeFilter,
    storageCategoryFilter,
    setStorageCategoryFilter,

    // Filtered items
    filteredItems,

    // Buy modals
    buyingPillModal,
    setBuyingPillModal,
    buyQuantity,
    setBuyQuantity,
    batchBuyingHerbModal,
    setBatchBuyingHerbModal,
    herbBatchQuantity,
    setHerbBatchQuantity,
    batchBuyingOreModal,
    setBatchBuyingOreModal,
    oreBatchQuantity,
    setOreBatchQuantity,

    // Detail view modals
    viewingManualModal,
    setViewingManualModal,
    viewingDivineModal,
    setViewingDivineModal,
    viewingEquipModal,
    setViewingEquipModal,
    viewingCompanionModal,
    setViewingCompanionModal,
    viewingBeastModal,
    setViewingBeastModal,
    viewingStorageModal,
    setViewingStorageModal,

    // Helper
    resetAllFilters,
  };
}
