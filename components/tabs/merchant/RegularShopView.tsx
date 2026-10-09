// components/tabs/merchant/RegularShopView.tsx
// Phường Thị Chính Thống — Màn Hình Mua Sắm Vạn Bảo Thương Hội
// Props nhận từ useMerchantTabActions, không tự tạo state giao dịch
// < 400 dòng — Tailwind classes giữ nguyên 100% từ MerchantTab.tsx gốc

import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { MerchantItem, MerchantCategory, HerbCategory } from '@/lib/types';
import { MerchantTierFilter, MERCHANT_TIER_TABS, getItemTierWeight } from '@/lib/merchant-data';
import { OreCategory } from '@/lib/types/ores-shop';
import { EquipmentSlotType } from '@/lib/types/equipment-shop';
import { CompanionArchetype } from '@/lib/types/companions-shop';
import { BeastArchetype } from '@/lib/types/beasts-shop';
import { StorageCategory } from '@/lib/types/storage-shop';
import { MerchantItemCard } from './MerchantItemCard';

// ============================================================================
// PROPS
// ============================================================================

export interface RegularShopViewProps {
  // Danh sách đã lọc & sắp xếp (từ filteredItems trong MerchantTab / hook)
  filteredItems: MerchantItem[];
  merchantSubTab: MerchantCategory;

  // Countdown & refresh
  countdownFormatted: string;
  onRefreshMerchant: (force?: boolean) => void;

  // Tier filter state
  selectedTier: MerchantTierFilter;
  onSetSelectedTier: (tier: MerchantTierFilter) => void;
  tierItemCounts: Record<string | number, number>;

  // Sub-filters
  pillCategoryFilter: 'all' | 'tu_vi' | 'breakthrough' | 'lifespan' | 'stat_boost';
  onSetPillCategoryFilter: (v: 'all' | 'tu_vi' | 'breakthrough' | 'lifespan' | 'stat_boost') => void;

  cultCategoryFilter: 'all' | 'manual' | 'array' | 'essence' | 'incense';
  onSetCultCategoryFilter: (v: 'all' | 'manual' | 'array' | 'essence' | 'incense') => void;

  manualCategoryFilter: 'all' | 'cong_kich' | 'phong_ngu' | 'than_phap' | 'cam_thuat';
  onSetManualCategoryFilter: (v: 'all' | 'cong_kich' | 'phong_ngu' | 'than_phap' | 'cam_thuat') => void;

  divineCategoryFilter: 'all' | 'cong_phat' | 'ho_than' | 'tran_ap' | 'linh_vuc';
  onSetDivineCategoryFilter: (v: 'all' | 'cong_phat' | 'ho_than' | 'tran_ap' | 'linh_vuc') => void;

  herbCategoryFilter: 'all' | HerbCategory;
  onSetHerbCategoryFilter: (v: 'all' | HerbCategory) => void;

  oreCategoryFilter: 'all' | OreCategory;
  onSetOreCategoryFilter: (v: 'all' | OreCategory) => void;

  equipmentSlotFilter: 'all' | EquipmentSlotType;
  onSetEquipmentSlotFilter: (v: 'all' | EquipmentSlotType) => void;

  companionArchetypeFilter: 'all' | CompanionArchetype;
  onSetCompanionArchetypeFilter: (v: 'all' | CompanionArchetype) => void;

  beastArchetypeFilter: 'all' | BeastArchetype;
  onSetBeastArchetypeFilter: (v: 'all' | BeastArchetype) => void;

  storageCategoryFilter: 'all' | StorageCategory;
  onSetStorageCategoryFilter: (v: 'all' | StorageCategory) => void;

  // Render con (optional) — nếu không truyền thì tự render MerchantItemCard
  renderItemList?: (items: MerchantItem[]) => React.ReactNode;
  onActionClick?: (item: MerchantItem) => void;
  playerMoney?: number;
  playerRealmIndex?: number;
  discountPercent?: number;

  // Empty state custom fallback
  emptyNode?: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RegularShopView: React.FC<RegularShopViewProps> = ({
  filteredItems,
  merchantSubTab,
  countdownFormatted,
  onRefreshMerchant,
  selectedTier,
  onSetSelectedTier,
  tierItemCounts,
  pillCategoryFilter,
  onSetPillCategoryFilter,
  cultCategoryFilter,
  onSetCultCategoryFilter,
  manualCategoryFilter,
  onSetManualCategoryFilter,
  divineCategoryFilter,
  onSetDivineCategoryFilter,
  herbCategoryFilter,
  onSetHerbCategoryFilter,
  oreCategoryFilter,
  onSetOreCategoryFilter,
  equipmentSlotFilter,
  onSetEquipmentSlotFilter,
  companionArchetypeFilter,
  onSetCompanionArchetypeFilter,
  beastArchetypeFilter,
  onSetBeastArchetypeFilter,
  storageCategoryFilter,
  onSetStorageCategoryFilter,
  renderItemList,
  onActionClick,
  playerMoney = 0,
  playerRealmIndex = 0,
  discountPercent = 0,
  emptyNode,
}) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-2">

      {/* ── Thanh Thông Tin Làm Mới & Countdown HUD ── */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
            <span>Lô hàng Thương Hội:</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-800/40 text-amber-300 font-mono text-[10px]">
            <span className="text-amber-400">⏳ Hàng mới sau:</span>
            <span className="font-bold text-amber-200 tracking-wider">{countdownFormatted}</span>
          </div>
        </div>
        <button
          onClick={() => onRefreshMerchant(false)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-900/50 hover:border-amber-600/60 text-amber-300 hover:text-amber-200 text-[11px] font-serif transition cursor-pointer shadow-sm active:scale-95 shrink-0"
          title="Tốn 50 Linh thạch để mời Thương Hội điều chuyển đợt hàng mới ngay lập tức"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Đổi Lô Mới (50 LT)</span>
        </button>
      </div>

      {/* ── Bộ Lọc Giai Vị (Tier 1-9) ── */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-amber-900/20 bg-zinc-950/40 rounded-md">
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
                  ? `${t.badgeColor} ring-1 ring-amber-400/60 font-bold shadow-sm scale-[1.02]`
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
              }`}
              title={t.label}
            >
              <span>{t.shortLabel}</span>
              {count > 0 && (
                <span
                  className={`text-[9px] px-1 rounded-full font-mono ${
                    isSelected ? 'bg-amber-400/20 text-amber-200' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Bộ Lọc Phụ Công Dụng Đan Dược ── */}
      {merchantSubTab === 'pills' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-indigo-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Công Dụng:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả Loại' },
              { id: 'tu_vi', label: '⚡ Tu Vi' },
              { id: 'breakthrough', label: '🔥 Đột Phá' },
              { id: 'lifespan', label: '🌿 Thọ Mệnh' },
              { id: 'stat_boost', label: '💎 Thuộc Tính' },
            ] as const
          ).map((cat) => {
            const isSelected = pillCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetPillCategoryFilter(cat.id)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Vật Phẩm Tu Luyện ── */}
      {merchantSubTab === 'cultivation' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-cyan-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Chủng Loại:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'manual', label: '📜 Tâm Pháp' },
              { id: 'array', label: '🌀 Trận Pháp' },
              { id: 'essence', label: '💧 Tinh Hoa' },
              { id: 'incense', label: '🪔 Hương Đạo' },
            ] as const
          ).map((cat) => {
            const isSelected = cultCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetCultCategoryFilter(cat.id)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-600/30 text-cyan-200 border-cyan-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Phân Hệ Công Pháp ── */}
      {merchantSubTab === 'manuals' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-purple-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Phân Hệ:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'cong_kich', label: '⚔️ Công Kích' },
              { id: 'phong_ngu', label: '🛡️ Phòng Ngự' },
              { id: 'than_phap', label: '💨 Thân Pháp' },
              { id: 'cam_thuat', label: '🌀 Cấm Thuật' },
            ] as const
          ).map((cat) => {
            const isSelected = manualCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetManualCategoryFilter(cat.id)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/30 text-purple-200 border-purple-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Thần Thông ── */}
      {(merchantSubTab === 'skills' || merchantSubTab === 'divine') && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-purple-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Phân Môn:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'cong_phat', label: '⚡ Công Phát' },
              { id: 'ho_than', label: '🛡️ Hộ Thân' },
              { id: 'tran_ap', label: '🔱 Trấn Áp' },
              { id: 'linh_vuc', label: '🌀 Linh Vực' },
            ] as const
          ).map((cat) => {
            const isSelected = divineCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetDivineCategoryFilter(cat.id)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/30 text-purple-200 border-purple-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Dược Thảo ── */}
      {(merchantSubTab === 'materials' || merchantSubTab === 'herbs') && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-teal-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Chủng Loại:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'thao_duoc', label: '🌿 Thảo Dược' },
              { id: 'hoa_linh', label: '🌸 Hoa Linh' },
              { id: 'tinh_chat', label: '💧 Tinh Chất' },
              { id: 'linh_qua', label: '🍎 Linh Quả' },
              { id: 'nam_linh', label: '🍄 Nấm Linh' },
            ] as const
          ).map((cat) => {
            const isSelected = herbCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetHerbCategoryFilter(cat.id as 'all' | HerbCategory)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600/30 text-teal-200 border-teal-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Khoáng Thạch ── */}
      {merchantSubTab === 'ores' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-yellow-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Chủng Loại:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'kim_loai', label: '⚙️ Kim Loại' },
              { id: 'ngoc_thach', label: '💎 Ngọc Thạch' },
              { id: 'linh_thach', label: '🪨 Linh Thạch' },
              { id: 'hoa_thach', label: '🔥 Hỏa Thạch' },
              { id: 'bang_tinh', label: '❄️ Băng Tinh' },
            ] as const
          ).map((cat) => {
            const isSelected = oreCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetOreCategoryFilter(cat.id as 'all' | OreCategory)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-700/30 text-yellow-200 border-yellow-600/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Vị Trí Trang Bị ── */}
      {merchantSubTab === 'equipment' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-red-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Vị Trí:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'weapon', label: '⚔️ Vũ Khí' },
              { id: 'armor', label: '🛡️ Giáp Phòng' },
              { id: 'accessory', label: '📿 Linh Bảo' },
            ] as const
          ).map((cat) => {
            const isSelected = equipmentSlotFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetEquipmentSlotFilter(cat.id as 'all' | EquipmentSlotType)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-red-600/30 text-red-200 border-red-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Trường Phái Đạo Lữ ── */}
      {merchantSubTab === 'companions' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-rose-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Trường Phái:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'dan_dao', label: '🧪 Đan Đạo' },
              { id: 'kiep_so', label: '⚔️ Kiếm Sĩ' },
              { id: 'tu_tam', label: '🌸 Tu Tâm' },
              { id: 'bao_thu', label: '🔮 Bảo Thú' },
            ] as const
          ).map((cat) => {
            const isSelected = companionArchetypeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetCompanionArchetypeFilter(cat.id as 'all' | CompanionArchetype)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600/30 text-rose-200 border-rose-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Trường Phái Linh Thú ── */}
      {merchantSubTab === 'beasts' && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-amber-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Trường Phái:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'chien_dau', label: '⚔️ Chiến Đấu' },
              { id: 'thu_cuoi', label: '🐎 Tọa Kỵ' },
              { id: 'ho_the', label: '🛡️ Hộ Thể' },
              { id: 'tam_bao', label: '✨ Tam Bảo' },
            ] as const
          ).map((cat) => {
            const isSelected = beastArchetypeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetBeastArchetypeFilter(cat.id as 'all' | BeastArchetype)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600/30 text-amber-200 border-amber-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bộ Lọc Pháp Bảo Trữ Vật ── */}
      {(merchantSubTab === 'storage' || merchantSubTab === 'inventory') && (
        <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 border-b border-purple-900/30 bg-zinc-950/60 rounded-md">
          <span className="text-[10px] text-zinc-500 font-serif whitespace-nowrap pl-1 pr-0.5">
            Chủng Loại:
          </span>
          {(
            [
              { id: 'all', label: 'Tất Cả' },
              { id: 'tui_vat', label: '👜 Túi Vật' },
              { id: 'ngan_dược', label: '🌿 Ngăn Dược' },
              { id: 'ngan_khoan', label: '⛏️ Ngăn Khoáng' },
              { id: 'dong_phu', label: '🏯 Động Phủ' },
            ] as const
          ).map((cat) => {
            const isSelected = storageCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSetStorageCategoryFilter(cat.id as 'all' | StorageCategory)}
                className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600/30 text-purple-200 border-purple-500/60 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Danh Sách Hàng Hóa (cuộn dọc, delegate lên parent để zero-regression) ── */}
      <div className="flex-1 min-h-[420px] space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {filteredItems.length === 0
          ? emptyNode ?? (
              <div className="p-8 text-center text-xs text-zinc-500 italic font-serif space-y-3">
                {selectedTier !== 'all' ? (
                  <>
                    <p className="text-zinc-400">
                      Chưa có bảo vật Giai vị này cập bến Thương Hội, xin quay lại sau!
                    </p>
                    <button
                      onClick={() => onSetSelectedTier('all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 text-amber-300 transition cursor-pointer font-sans not-italic font-medium shadow-sm active:scale-95"
                    >
                      ✨ Xem Toàn Bộ Giai
                    </button>
                  </>
                ) : (
                  <p>
                    Khu vực này hiện tại chưa có hàng hóa hoặc đã bán hết. Hãy bấm &quot;Đổi Lô
                    Mới&quot; để Thương Hội nhập hàng mới!
                  </p>
                )}
              </div>
            )
          : renderItemList
          ? renderItemList(filteredItems)
          : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filteredItems.map((item) => (
                  <MerchantItemCard
                    key={item.id}
                    item={item}
                    mode="buy"
                    playerMoney={playerMoney}
                    playerRealmIndex={playerRealmIndex}
                    discountPercent={discountPercent}
                    onActionClick={onActionClick ? onActionClick : () => {}}
                  />
                ))}
              </div>
            )}
      </div>
    </div>
  );
};

export default RegularShopView;
