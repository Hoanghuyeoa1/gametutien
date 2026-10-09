// components/tabs/MerchantTab.tsx
// Vạn Bảo Thương Hội — Root Orchestrator Tinh Gọn (~180 dòng)
// Điều phối 3 màn hình con: Phường Thị, Chợ Đen, Thu Mua & Hối Đoái
// 100% Strict TypeScript, Zero Any, Zero-Regression Audit

import React, { useEffect, useMemo } from 'react';
import { Store, Coins } from 'lucide-react';
import {
  PlayerStats,
  MerchantCategory,
  MerchantItem,
  HerbShopItem,
} from '@/lib/types';
import { OreShopItem } from '@/lib/types/ores-shop';
import { EquipmentShopItem } from '@/lib/types/equipment-shop';
import { CompanionShopItem } from '@/lib/types/companions-shop';
import { BeastShopItem } from '@/lib/types/beasts-shop';
import { StorageShopItem } from '@/lib/types/storage-shop';
import { calculateTotalEquivalentHaPham, formatLinhThachDenomination } from '@/lib/item-quality-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { useMerchantTabActions } from '@/hooks/useMerchantTabActions';
import { RegularShopView } from '@/components/tabs/merchant/RegularShopView';
import { BlackMarketView } from '@/components/tabs/merchant/BlackMarketView';
import { ItemRecycleView } from '@/components/tabs/merchant/ItemRecycleView';
import { MerchantTradeModal } from '@/components/tabs/merchant/MerchantTradeModal';

// ============================================================================
// PROPS INTERFACE (Giữ nguyên 100% không đổi từ GameDashboard)
// ============================================================================

export interface MerchantTabProps {
  player: PlayerStats;
  merchantSubTab: MerchantCategory;
  setMerchantSubTab: (tab: MerchantCategory) => void;
  handleRefreshMerchant: (force?: boolean) => void;
  handleBuyMerchantItem: (item: MerchantItem, quantity?: number) => void;
  handleBuyHerbsBatch?: (herbItem: HerbShopItem, quantity: number) => void;
  handleBuyOresBatch?: (oreItem: OreShopItem, quantity: number) => void;
  handleBuyEquipment?: (equipItem: EquipmentShopItem, autoEquip: boolean) => void;
  handleRecruitCompanion?: (companionItem: CompanionShopItem) => void;
  handleRecruitBeast?: (beastItem: BeastShopItem) => void;
  handleUnlockStorage?: (storageItem: StorageShopItem) => void;
  handleSetActiveCombatBeast?: (beastId: string) => void;
  handleSetActiveMountBeast?: (beastId: string) => void;
  handleSellAllBasicItems: () => void;
  handleSellItem: (type: 'pill' | 'herb' | 'ore' | 'equipment', id: string, count: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleExchangeLinhThach?: (fromType: any, toType: any, amount?: number) => void;
  usedSlots: number;
  onOpenAuction?: () => void;
  handleEquipDivineAbility?: (abilityId: string) => void;
  handleUnequipDivineAbility?: (abilityId: string) => void;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>>;
}

const REGULAR_SHOP_CATEGORIES: { id: MerchantCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Toàn Bộ', icon: '✨' },
  { id: 'pills', label: 'Đan Dược', icon: '💊' },
  { id: 'cultivation', label: 'Tu Luyện', icon: '🧘' },
  { id: 'manuals', label: 'Công Pháp', icon: '📜' },
  { id: 'skills', label: 'Thần Thông', icon: '🔮' },
  { id: 'materials', label: 'Dược Thảo', icon: '🌿' },
  { id: 'ores', label: 'Khoáng Thạch', icon: '⛏️' },
  { id: 'equipment', label: 'Trang Bị', icon: '⚔️' },
  { id: 'companions', label: 'Đạo Lữ', icon: '🌸' },
  { id: 'beasts', label: 'Linh Thú', icon: '🐾' },
  { id: 'storage', label: 'Trữ Vật', icon: '📦' },
];

// ============================================================================
// ROOT ORCHESTRATOR COMPONENT
// ============================================================================

export const MerchantTab: React.FC<MerchantTabProps> = ({
  player,
  merchantSubTab,
  setMerchantSubTab,
  handleRefreshMerchant,
  handleBuyMerchantItem,
  handleBuyHerbsBatch: _handleBuyHerbsBatch,
  handleBuyOresBatch: _handleBuyOresBatch,
  handleBuyEquipment: _handleBuyEquipment,
  handleRecruitCompanion: _handleRecruitCompanion,
  handleRecruitBeast: _handleRecruitBeast,
  handleUnlockStorage: _handleUnlockStorage,
  handleSetActiveCombatBeast: _handleSetActiveCombatBeast,
  handleSetActiveMountBeast: _handleSetActiveMountBeast,
  handleSellAllBasicItems,
  handleSellItem,
  handleExchangeLinhThach,
  usedSlots,
  onOpenAuction,
  handleEquipDivineAbility: _handleEquipDivineAbility,
  handleUnequipDivineAbility: _handleUnequipDivineAbility,
  setPlayer,
}) => {
  const merchant = useMerchantTabActions(player, setPlayer, {
    merchantSubTab,
    handleRefreshMerchant,
    handleBuyMerchantItem,
  });

  // Đồng bộ hai chiều giữa merchantSubTab của GameDashboard và activeSubTab
  useEffect(() => {
    if (merchantSubTab === 'sell' || merchantSubTab === 'exchange') {
      merchant.setActiveSubTab('thu_mua');
    }
  }, [merchantSubTab, merchant.setActiveSubTab]);

  const totalEquivalentLT = useMemo(() => calculateTotalEquivalentHaPham(player), [player]);
  const maTinhBalance = player.maTinh ?? 0;
  const companionBuffs = useMemo(() => getBondedCompanionBuffs(player), [player]);
  const discountPercent = companionBuffs.merchantDiscountPercent || 0;

  const handleSelectPhuongThi = () => {
    merchant.setActiveSubTab('phuong_thi');
    if (merchantSubTab === 'sell' || merchantSubTab === 'exchange') {
      setMerchantSubTab('all');
    }
  };

  const handleSelectChoDen = () => {
    merchant.setActiveSubTab('cho_den');
  };

  const handleSelectThuMua = () => {
    merchant.setActiveSubTab('thu_mua');
    if (merchantSubTab !== 'sell' && merchantSubTab !== 'exchange') {
      setMerchantSubTab('sell');
    }
  };

  const handleItemAction = (item: MerchantItem) => {
    merchant.openTradeModal(item, 'buy');
  };

  const handleConfirmTrade = () => {
    merchant.confirmTrade((item, qty) => {
      handleBuyMerchantItem(item, qty);
    });
  };

  return (
    <div className="h-full flex flex-col space-y-2.5 overflow-hidden">
      {/* ── Header: Banner Vạn Bảo & Badge Linh Thạch / Ma Tinh ── */}
      <div className="shrink-0 p-3 rounded-xl border border-amber-800/40 bg-gradient-to-r from-[#17120a] via-[#120e18] to-[#0a1017] shadow-lg flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600/30 to-purple-600/30 border border-amber-500/50 flex items-center justify-center text-base shadow-inner shrink-0">
            🏛️
          </div>
          <div>
            <h2 className="text-sm font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
              VẠN BẢO THƯƠNG HỘI
            </h2>
            <div className="text-[10px] text-zinc-400 font-serif">
              Thiên hạ kỳ trân • Vạn giới thông thương
            </div>
          </div>
        </div>

        {/* Badges Số Dư Linh Thạch & Ma Tinh */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-300 text-xs font-mono font-bold shadow-sm"
            title={formatLinhThachDenomination(totalEquivalentLT)}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{totalEquivalentLT.toLocaleString()} LT</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-700/50 text-purple-300 text-xs font-mono font-bold shadow-sm"
            title="Ma Tinh ngưng tụ từ ma vực và tà khí bí cảnh"
          >
            <span className="text-purple-400">🔮</span>
            <span>{maTinhBalance.toLocaleString()} Ma Tinh</span>
          </div>

          {onOpenAuction && (
            <button
              onClick={onOpenAuction}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-stone-950 font-serif font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span>🔨</span>
              <span>Đấu Giá</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3 Tab Điều Hướng Chính ── */}
      <div className="shrink-0 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-amber-900/30">
        <button
          onClick={handleSelectPhuongThi}
          className={`py-2 px-2 text-xs font-serif font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            merchant.activeSubTab === 'phuong_thi'
              ? 'bg-gradient-to-r from-amber-900/70 to-amber-700/60 text-amber-100 border border-amber-500/50 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>🏪 Phường Thị</span>
        </button>

        <button
          onClick={handleSelectChoDen}
          className={`py-2 px-2 text-xs font-serif font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            merchant.activeSubTab === 'cho_den'
              ? 'bg-gradient-to-r from-purple-950/90 to-purple-800/60 text-purple-100 border border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
          }`}
        >
          <span>🌑 Chợ Đen</span>
        </button>

        <button
          onClick={handleSelectThuMua}
          className={`py-2 px-2 text-xs font-serif font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            merchant.activeSubTab === 'thu_mua'
              ? 'bg-gradient-to-r from-emerald-950/90 to-teal-800/60 text-emerald-100 border border-emerald-500/50 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
          }`}
        >
          <span>♻️ Thu Mua</span>
        </button>
      </div>

      {/* ── Sub-tabs Danh Mục Phường Thị ── */}
      {merchant.activeSubTab === 'phuong_thi' && (
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5 border-b border-amber-900/30 shrink-0">
          {REGULAR_SHOP_CATEGORIES.map((cat) => {
            const isSelected =
              merchantSubTab === cat.id ||
              (cat.id === 'skills' && merchantSubTab === 'divine') ||
              (cat.id === 'materials' && merchantSubTab === 'herbs') ||
              (cat.id === 'storage' && merchantSubTab === 'inventory');
            return (
              <button
                key={cat.id}
                onClick={() => setMerchantSubTab(cat.id)}
                className={`flex-shrink-0 whitespace-nowrap px-2.5 py-1 text-xs rounded-lg font-serif transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/60 border border-transparent'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Dynamic Sub-Views ── */}
      {merchant.activeSubTab === 'phuong_thi' && (
        <RegularShopView
          filteredItems={merchant.filteredItems}
          merchantSubTab={merchantSubTab}
          countdownFormatted={merchant.countdownFormatted}
          onRefreshMerchant={handleRefreshMerchant}
          selectedTier={merchant.selectedTier}
          onSetSelectedTier={merchant.setSelectedTier}
          tierItemCounts={merchant.tierItemCounts}
          pillCategoryFilter={merchant.pillCategoryFilter}
          onSetPillCategoryFilter={merchant.setPillCategoryFilter}
          cultCategoryFilter={merchant.cultCategoryFilter}
          onSetCultCategoryFilter={merchant.setCultCategoryFilter}
          manualCategoryFilter={merchant.manualCategoryFilter}
          onSetManualCategoryFilter={merchant.setManualCategoryFilter}
          divineCategoryFilter={merchant.divineCategoryFilter}
          onSetDivineCategoryFilter={merchant.setDivineCategoryFilter}
          herbCategoryFilter={merchant.herbCategoryFilter}
          onSetHerbCategoryFilter={merchant.setHerbCategoryFilter}
          oreCategoryFilter={merchant.oreCategoryFilter}
          onSetOreCategoryFilter={merchant.setOreCategoryFilter}
          equipmentSlotFilter={merchant.equipmentSlotFilter}
          onSetEquipmentSlotFilter={merchant.setEquipmentSlotFilter}
          companionArchetypeFilter={merchant.companionArchetypeFilter}
          onSetCompanionArchetypeFilter={merchant.setCompanionArchetypeFilter}
          beastArchetypeFilter={merchant.beastArchetypeFilter}
          onSetBeastArchetypeFilter={merchant.setBeastArchetypeFilter}
          storageCategoryFilter={merchant.storageCategoryFilter}
          onSetStorageCategoryFilter={merchant.setStorageCategoryFilter}
          onActionClick={handleItemAction}
          playerMoney={totalEquivalentLT}
          playerRealmIndex={player.currentRealm || 0}
          discountPercent={discountPercent}
        />
      )}

      {merchant.activeSubTab === 'cho_den' && (
        <BlackMarketView
          filteredItems={merchant.blackMarketItems}
          blackMarketCountdown={merchant.blackMarketCountdown}
          blackMarketRefreshCost={merchant.blackMarketRefreshCost}
          playerMoney={totalEquivalentLT}
          playerRealmIndex={player.currentRealm || 0}
          onRefreshBlackMarket={merchant.handleRefreshBlackMarket}
          selectedTier={merchant.selectedTier}
          onSetSelectedTier={merchant.setSelectedTier}
          tierItemCounts={merchant.tierItemCounts}
          onActionClick={handleItemAction}
        />
      )}

      {merchant.activeSubTab === 'thu_mua' && (
        <ItemRecycleView
          player={player}
          activeTab={merchantSubTab === 'exchange' ? 'exchange' : 'sell'}
          handleSellAllBasicItems={handleSellAllBasicItems}
          handleSellItem={handleSellItem}
          handleExchangeLinhThach={handleExchangeLinhThach}
          usedSlots={usedSlots}
        />
      )}

      {/* ── Modal Giao Dịch Duy Nhất ── */}
      {merchant.tradeModalState && (
        <MerchantTradeModal
          tradeState={merchant.tradeModalState}
          quantity={merchant.tradeQuantity}
          onClose={merchant.closeTradeModal}
          onConfirm={handleConfirmTrade}
          onChangeQuantity={merchant.setTradeQuantity}
          isProcessing={merchant.isProcessing}
        />
      )}
    </div>
  );
};

export default MerchantTab;
