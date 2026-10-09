// components/tabs/merchant/BlackMarketView.tsx
// Hắc Thị / Chợ Đen — Màn Hình Vật Phẩm Quý Hiếm / Cấm Vật
// Banner ma mị + đồng hồ đếm ngược + nút tiêu hao linh thạch làm mới hàng hiếm
// Props từ useMerchantTabActions, không tự tạo state giao dịch
// < 400 dòng

import React from 'react';
import { RefreshCw, Lock } from 'lucide-react';
import { MerchantItem, MerchantCategory } from '@/lib/types';
import { MerchantTierFilter, MERCHANT_TIER_TABS } from '@/lib/merchant-data';
import { MerchantItemCard } from './MerchantItemCard';

// ============================================================================
// PROPS
// ============================================================================

export interface BlackMarketViewProps {
  // Danh sách hàng hiếm đã được lọc (items từ black_market sub-tab)
  filteredItems: MerchantItem[];

  // Countdown riêng cho hắc thị (reset mỗi 6 giờ)
  blackMarketCountdown: string;   // "HH:MM:SS"
  blackMarketRefreshCost: number; // Linh Thạch tiêu hao làm mới hắc thị

  playerMoney: number;            // calculateTotalEquivalentHaPham
  playerRealmIndex: number;       // player.currentRealm || 0

  // Refresh handler
  onRefreshBlackMarket: () => void;

  // Tier filter
  selectedTier: MerchantTierFilter;
  onSetSelectedTier: (tier: MerchantTierFilter) => void;
  tierItemCounts: Record<string | number, number>;

  // Render con (optional) — parent tự render item cards để zero-regression
  renderItemList?: (items: MerchantItem[]) => React.ReactNode;
  onActionClick?: (item: MerchantItem) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const BLACK_MARKET_EXCLUSIVE_ITEMS = [
  { icon: '💀', label: 'Cấm Vật' },
  { icon: '🩸', label: 'Huyết Dược' },
  { icon: '🌑', label: 'Dị Bảo' },
  { icon: '⚡', label: 'Thiên Lôi Tinh Thạch' },
  { icon: '🔮', label: 'Tà Thuật Bí Tịch' },
];

export const BlackMarketView: React.FC<BlackMarketViewProps> = ({
  filteredItems,
  blackMarketCountdown,
  blackMarketRefreshCost,
  playerMoney,
  playerRealmIndex,
  onRefreshBlackMarket,
  selectedTier,
  onSetSelectedTier,
  tierItemCounts,
  renderItemList,
  onActionClick,
}) => {
  const canAffordRefresh = playerMoney >= blackMarketRefreshCost;
  // Hắc thị yêu cầu tối thiểu Trúc Cơ (realm 3)
  const isRealmLocked = playerRealmIndex < 3;

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-2">

      {/* ── Banner Ma Mị Hắc Thị ── */}
      <div className="shrink-0 relative overflow-hidden rounded-xl border border-zinc-700/60 bg-gradient-to-br from-[#0d0a14] via-[#0f0b18] to-[#0a0d14] p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {/* Decorative glow corners */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-900/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-rose-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900/60 to-zinc-900 border border-purple-700/50 flex items-center justify-center text-base shadow-inner shrink-0">
                🌑
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-purple-200 to-zinc-300">
                  HẮC THỊ DỊ BẢO GIAO HỘI
                </h3>
                <p className="text-[9.5px] text-zinc-500 font-mono">
                  Cấm vật kỳ trân • Không lưu lại vết tích • Chỉ dành cho huyền nhân
                </p>
              </div>
            </div>

            {/* Realm lock badge */}
            {isRealmLocked && (
              <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-mono bg-red-950/80 text-red-300 border border-red-800/60 animate-pulse shrink-0">
                <Lock className="w-2.5 h-2.5" />
                Cần Trúc Cơ Cảnh
              </span>
            )}
            {!isRealmLocked && (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 shrink-0">
                ✓ Đủ Cảnh Giới
              </span>
            )}
          </div>

          {/* Exclusive item tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {BLACK_MARKET_EXCLUSIVE_ITEMS.map((tag) => (
              <span
                key={tag.label}
                className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-zinc-900/80 text-zinc-400 border border-zinc-800/60"
              >
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>

          {/* Countdown + Refresh */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/40">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-serif">Hàng hiếm đổi sau:</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-purple-800/40 text-purple-300 font-mono font-bold text-[11px] tracking-wider">
                ⏳ {blackMarketCountdown}
              </span>
            </div>

            <button
              onClick={onRefreshBlackMarket}
              disabled={!canAffordRefresh || isRealmLocked}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10.5px] font-serif font-bold transition active:scale-95 shrink-0 ${
                canAffordRefresh && !isRealmLocked
                  ? 'bg-gradient-to-r from-purple-900/80 to-zinc-900 hover:brightness-110 border border-purple-700/60 text-purple-200 cursor-pointer shadow-sm shadow-purple-950/40'
                  : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              }`}
              title={`Tiêu ${blackMarketRefreshCost.toLocaleString()} LT để làm mới ngay lập tức hàng hiếm Hắc Thị`}
            >
              <RefreshCw className="w-3 h-3" />
              <span>
                ⚡ Làm Mới Hắc Thị ({blackMarketRefreshCost >= 1000
                  ? `${(blackMarketRefreshCost / 1000).toFixed(0)}k`
                  : blackMarketRefreshCost}{' '}
                LT)
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bộ Lọc Giai Vị ── */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-zinc-800/40 bg-zinc-950/40 rounded-md">
        <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
          Lọc Giai:
        </span>
        {MERCHANT_TIER_TABS.map((t) => {
          const isSelected = selectedTier === t.tier;
          const count = tierItemCounts[t.tier] || 0;
          return (
            <button
              key={String(t.tier)}
              onClick={() => onSetSelectedTier(t.tier)}
              className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? `${t.badgeColor} ring-1 ring-purple-400/40 font-bold shadow-sm scale-[1.02]`
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
              }`}
              title={t.label}
            >
              <span>{t.shortLabel}</span>
              {count > 0 && (
                <span
                  className={`text-[9px] px-1 rounded-full font-mono ${
                    isSelected ? 'bg-purple-400/20 text-purple-200' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Disclaimer cảnh báo ── */}
      <div className="shrink-0 px-2 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/40 flex items-center gap-1.5">
        <span className="text-amber-500/70 text-[10px]">⚠️</span>
        <p className="text-[9.5px] text-zinc-500 font-serif italic leading-tight">
          Giao dịch tại Hắc Thị không được hoàn trả. Mọi mua bán đều ẩn danh và chịu rủi ro của đạo hữu.
        </p>
      </div>

      {/* ── Danh Sách Hàng Hiếm ── */}
      <div className="flex-1 min-h-[400px] space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {isRealmLocked ? (
          <div className="p-8 text-center space-y-2">
            <div className="text-3xl">🔒</div>
            <p className="text-xs text-zinc-500 font-serif italic">
              Hắc Thị chỉ mở cửa cho tu sĩ từ Trúc Cơ Cảnh trở lên.
              <br />
              Đạo hữu cần đột phá thêm để bước vào khu vực này.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="text-3xl opacity-40">🌑</div>
            <p className="text-xs text-zinc-500 italic font-serif">
              Hắc Thị tạm thời vắng hàng... Bóng tối che phủ mọi nẻo đường.
              <br />
              Hãy làm mới để triệu hồi hàng hiếm mới.
            </p>
            <button
              onClick={onRefreshBlackMarket}
              disabled={!canAffordRefresh}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md border transition cursor-pointer font-sans font-medium active:scale-95 ${
                canAffordRefresh
                  ? 'bg-purple-950/60 hover:bg-purple-900/80 border-purple-600/50 text-purple-300'
                  : 'bg-zinc-900/60 text-zinc-600 border-zinc-800 cursor-not-allowed'
              }`}
            >
              🌑 Triệu Hồi Hàng Hiếm
            </button>
          </div>
        ) : renderItemList ? (
          renderItemList(filteredItems)
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredItems.map((item) => (
              <MerchantItemCard
                key={item.id}
                item={item}
                mode="buy"
                playerMoney={playerMoney}
                playerRealmIndex={playerRealmIndex}
                onActionClick={onActionClick ? onActionClick : () => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlackMarketView;
