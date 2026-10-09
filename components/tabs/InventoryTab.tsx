import React, { useState } from 'react';
import {
  Backpack,
  AlertTriangle,
  ArrowUpDown,
  Trash2,
  Store,
  Flame,
  Sprout,
  Hammer,
  Shield,
  BookOpen,
  Scroll,
  Unlock,
  Coins,
  ArrowRightLeft,
  Search,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PlayerStats, Equipment, Pill } from '@/lib/types';
import { getItemQuality, convertGradeToGiai, LINH_THACH_RATES } from '@/lib/item-quality-data';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu';

export interface InventoryTabProps {
  player: PlayerStats;
  isInventoryFull: boolean;
  isInventoryNearFull: boolean;
  usedSlots: number;
  maxSlots: number;
  inventoryFilter: 'all' | 'pills' | 'herbs' | 'ores' | 'equipments' | 'manuals' | 'books' | 'bags';
  setInventoryFilter: (filter: 'all' | 'pills' | 'herbs' | 'ores' | 'equipments' | 'manuals' | 'books' | 'bags') => void;
  handleSortInventory: () => void;
  handleSellAllBasicItems: () => void;
  setActiveTab: (tab: TabType) => void;
  handleUsePill: (pill: Pill) => void;
  handleSellItem: (type: 'pill' | 'herb' | 'ore' | 'equipment', id: string, count: number) => void;
  handleEquipEquipment: (eq: Equipment) => void;
  handleLearnBookFromInventory: (book: any) => void;
  handleEquipBagFromInventory: (bag: any) => void;
  handleExchangeLinhThach?: (fromType: any, toType: any, amount?: number) => void;
}

/**
 * Tự động gộp dồn các vật phẩm có cùng ID trong túi đồ
 */
function mergeDuplicateItems<T extends { id: string; quantity: number }>(items: T[] = []): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    if (!item || !item.id || item.quantity <= 0) continue;
    if (map.has(item.id)) {
      const existing = map.get(item.id)!;
      existing.quantity += item.quantity;
    } else {
      map.set(item.id, { ...item });
    }
  }
  return Array.from(map.values());
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  player,
  isInventoryFull,
  isInventoryNearFull,
  usedSlots,
  maxSlots,
  inventoryFilter,
  setInventoryFilter,
  handleSortInventory,
  handleSellAllBasicItems,
  setActiveTab,
  handleUsePill,
  handleSellItem,
  handleEquipEquipment,
  handleLearnBookFromInventory,
  handleEquipBagFromInventory,
  handleExchangeLinhThach
}) => {
  const [showExchange, setShowExchange] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.trim().toLowerCase();
  const matchesSearch = (name: string, desc?: string) => {
    if (!query) return true;
    return name.toLowerCase().includes(query) || (desc ? desc.toLowerCase().includes(query) : false);
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm & phân loại
  const visiblePills = (inventoryFilter === 'all' || inventoryFilter === 'pills')
    ? mergeDuplicateItems((player.inventory?.pills || []).filter(p => matchesSearch(p.name, p.description)))
    : [];

  const visibleHerbs = (inventoryFilter === 'all' || inventoryFilter === 'herbs')
    ? mergeDuplicateItems((player.inventory?.herbs || []).filter(h => matchesSearch(h.name, h.description)))
    : [];

  const visibleOres = (inventoryFilter === 'all' || inventoryFilter === 'ores')
    ? mergeDuplicateItems((player.inventory?.ores || []).filter(o => matchesSearch(o.name, o.description)))
    : [];

  const visibleEquips = (inventoryFilter === 'all' || inventoryFilter === 'equipments')
    ? (player.inventory?.equipments || []).filter(eq => matchesSearch(eq.name, eq.description))
    : [];

  const visibleManuals = (inventoryFilter === 'all' || inventoryFilter === 'manuals')
    ? (player.manuals || []).filter(m => matchesSearch(m.name, m.description))
    : [];

  const visibleBooks = (inventoryFilter === 'all' || inventoryFilter === 'books')
    ? mergeDuplicateItems((player.inventory?.books || []).filter(b => matchesSearch(b.name, b.description)))
    : [];

  const visibleBags = (inventoryFilter === 'all' || inventoryFilter === 'bags')
    ? mergeDuplicateItems((player.inventory?.bags || []).filter(b => matchesSearch(b.name, b.description)))
    : [];

  const totalVisible =
    visiblePills.length +
    visibleHerbs.length +
    visibleOres.length +
    visibleEquips.length +
    visibleManuals.length +
    visibleBooks.length +
    visibleBags.length;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* 1. HEADER & SUB-TABS: CỐ ĐỊNH, KHÔNG CUỘN (STICKY HEADER) */}
      <div className="flex-shrink-0 space-y-2 pb-2.5 border-b border-zinc-800/80">
        {/* Banner Túi Trữ Vật & Dung tích */}
        <div className={`p-2.5 sm:p-3 rounded-xl border space-y-2 ${
          isInventoryFull
            ? 'bg-gradient-to-r from-rose-950/50 via-[#180e10] to-rose-950/40 border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
            : isInventoryNearFull
            ? 'bg-gradient-to-r from-amber-950/40 via-[#18140c] to-amber-950/30 border-amber-500/60'
            : 'bg-gradient-to-r from-emerald-950/30 via-[#0e1612] to-emerald-950/20 border-emerald-800/40'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 min-w-0">
              <Backpack className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 flex-wrap">
                  <span className="truncate">{player.storageBag?.name || 'Hà Bao Phàm Trần'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-black/40 text-amber-300 border border-amber-700/40 shrink-0">
                    {player.storageBag?.grade || 'Phàm Cấp'}
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-400 truncate max-w-[240px] sm:max-w-none">{player.storageBag?.description}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-mono font-bold text-amber-300">
                {usedSlots} / {maxSlots >= 9999 ? 'VÔ HẠN' : `${maxSlots} ô`}
              </div>
              <div className="text-[9px] text-zinc-400 font-mono">
                {maxSlots >= 9999 ? 'Không giới hạn' : `${Math.floor((usedSlots / maxSlots) * 100)}% dung tích`}
              </div>
            </div>
          </div>

          {/* Thanh dung lượng trực quan */}
          {maxSlots < 9999 && (
            <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-zinc-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isInventoryFull
                    ? 'bg-gradient-to-r from-rose-600 to-red-500'
                    : isInventoryNearFull
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-400'
                }`}
                style={{ width: `${Math.min(100, Math.floor((usedSlots / maxSlots) * 100))}%` }}
              />
            </div>
          )}

          {/* Cảnh báo túi đầy */}
          {isInventoryFull && (
            <div className="p-1.5 rounded bg-rose-950/60 border border-rose-600/60 text-rose-200 text-[10px] flex items-center gap-1.5 animate-pulse font-serif">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>⚠️ Túi đồ đã đầy! Không thể thu nạp thêm vật phẩm. Hãy thanh lý hoặc nâng cấp Túi Trữ Vật!</span>
            </div>
          )}

          {/* Thanh công cụ: Sắp xếp, Bán nhanh, Nâng cấp, Tệ Điếm */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-zinc-800/50">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleSortInventory}
                className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-serif transition cursor-pointer flex items-center gap-1"
                title="Sắp xếp lại vật phẩm trong túi"
              >
                <ArrowUpDown className="w-3 h-3 text-amber-400" />
                <span>Sắp Xếp</span>
              </button>
              <button
                onClick={handleSellAllBasicItems}
                className="px-2 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 text-[10px] font-serif transition cursor-pointer flex items-center gap-1"
                title="Thanh lý nhanh toàn bộ dược liệu và khoáng thạch cấp thấp"
              >
                <Trash2 className="w-3 h-3 text-emerald-400" />
                <span>Thanh Lý Dược Khoáng</span>
              </button>
              <button
                onClick={() => setActiveTab('merchant')}
                className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/50 text-amber-300 text-[10px] font-serif transition cursor-pointer flex items-center gap-1"
                title="Đến Thương Hội mua túi trữ vật dung lượng lớn hơn"
              >
                <Store className="w-3 h-3 text-amber-400" />
                <span>Đổi Túi</span>
              </button>
            </div>

            {/* Nút toggle Tệ Điếm Hối Đoái */}
            <button
              onClick={() => setShowExchange(!showExchange)}
              className={`px-2 py-1 rounded text-[10px] font-serif transition cursor-pointer flex items-center gap-1 border ${
                showExchange
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500/60 font-bold shadow-sm'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Mở / Thu gọn bảng hối đoái 5 phẩm cấp Linh Thạch"
            >
              <Coins className="w-3 h-3 text-yellow-400" />
              <span>Tệ Điếm</span>
              {showExchange ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {/* Hệ Thống 5 Tầng Linh Thạch Phẩm Chất & Quy Đổi (Có thể thu gọn để tối ưu không gian) */}
        {showExchange && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#120f09] to-amber-950/20 border border-amber-800/40 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-200">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span>Tệ Điếm • Hối Đoái 5 Cấp Bậc Linh Thạch</span>
              </div>
              <span className="text-[9px] text-amber-400/80 font-mono">Tỷ Giá Quy Đổi 1:1,000</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 text-[10px]">
              {/* 1. Hạ Phẩm */}
              <div className="p-1.5 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1">
                <div className="text-zinc-400 font-serif font-semibold flex items-center justify-between text-[9px]">
                  <span>Hạ Phẩm</span>
                  <span className="text-[8px] text-zinc-500 font-mono">x1</span>
                </div>
                <div className="font-mono font-bold text-amber-300 text-xs truncate">
                  {(player.linhThach || 0).toLocaleString()}
                </div>
                {handleExchangeLinhThach && (
                  <div className="space-y-1 pt-0.5">
                    {player.linhThach >= 1000 && (
                      <button
                        onClick={() => handleExchangeLinhThach('ha_pham', 'trung_pham', 1000)}
                        className="w-full py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 text-[8.5px] text-amber-200 font-mono transition cursor-pointer"
                        title="Đổi Lên: 1,000 Hạ Phẩm -> 1 Trung Phẩm"
                      >
                        Đổi Lên 1 Trung
                      </button>
                    )}
                    {player.linhThach >= 2000 && (
                      <button
                        onClick={() => handleExchangeLinhThach('ha_pham', 'trung_pham', Math.floor(player.linhThach / 1000) * 1000)}
                        className="w-full py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[8px] text-zinc-300 font-mono transition cursor-pointer"
                        title="Đổi toàn bộ bội số 1,000 Hạ Phẩm lên Trung Phẩm"
                      >
                        Đổi Lên Hết
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Trung Phẩm */}
              <div className="p-1.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                <div className="text-emerald-400 font-serif font-semibold flex items-center justify-between text-[9px]">
                  <span>Trung Phẩm</span>
                  <span className="text-[8px] text-emerald-500 font-mono">x1k</span>
                </div>
                <div className="font-mono font-bold text-emerald-300 text-xs truncate">
                  {(player.trungPhamLinhThach || 0).toLocaleString()}
                </div>
                {handleExchangeLinhThach && (
                  <div className="flex gap-1 pt-0.5">
                    {(player.trungPhamLinhThach || 0) >= 1 && (
                      <button
                        onClick={() => handleExchangeLinhThach('trung_pham', 'ha_pham', 1)}
                        className="flex-1 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-600 text-[8px] text-zinc-200 font-mono transition cursor-pointer"
                        title="Tách Xuống: 1 Trung Phẩm -> 1,000 Hạ Phẩm"
                      >
                        Tách
                      </button>
                    )}
                    {(player.trungPhamLinhThach || 0) >= 1000 && (
                      <button
                        onClick={() => handleExchangeLinhThach('trung_pham', 'thuong_pham', 1000)}
                        className="flex-1 py-0.5 rounded bg-sky-950/70 hover:bg-sky-900 border border-sky-700/50 text-[8px] text-sky-200 font-mono transition cursor-pointer"
                        title="Đổi Lên: 1,000 Trung Phẩm -> 1 Thượng Phẩm"
                      >
                        Đổi Lên
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Thượng Phẩm */}
              <div className="p-1.5 rounded-lg bg-sky-950/20 border border-sky-800/40 space-y-1">
                <div className="text-sky-400 font-serif font-semibold flex items-center justify-between text-[9px]">
                  <span>Thượng Phẩm</span>
                  <span className="text-[8px] text-sky-500 font-mono">x1M</span>
                </div>
                <div className="font-mono font-bold text-sky-300 text-xs truncate">
                  {(player.thuongPhamLinhThach || 0).toLocaleString()}
                </div>
                {handleExchangeLinhThach && (
                  <div className="flex gap-1 pt-0.5">
                    {(player.thuongPhamLinhThach || 0) >= 1 && (
                      <button
                        onClick={() => handleExchangeLinhThach('thuong_pham', 'trung_pham', 1)}
                        className="flex-1 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-600 text-[8px] text-zinc-200 font-mono transition cursor-pointer"
                        title="Tách Xuống: 1 Thượng Phẩm -> 1,000 Trung Phẩm"
                      >
                        Tách
                      </button>
                    )}
                    {(player.thuongPhamLinhThach || 0) >= 1000 && (
                      <button
                        onClick={() => handleExchangeLinhThach('thuong_pham', 'cuc_pham', 1000)}
                        className="flex-1 py-0.5 rounded bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[8px] text-purple-200 font-mono transition cursor-pointer"
                        title="Đổi Lên: 1,000 Thượng Phẩm -> 1 Cực Phẩm"
                      >
                        Đổi Lên
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Cực Phẩm */}
              <div className="p-1.5 rounded-lg bg-purple-950/25 border border-purple-700/50 space-y-1 shadow-[0_0_8px_rgba(192,132,252,0.1)]">
                <div className="text-purple-300 font-serif font-semibold flex items-center justify-between text-[9px]">
                  <span>Cực Phẩm</span>
                  <span className="text-[8px] text-purple-400 font-mono">x1B</span>
                </div>
                <div className="font-mono font-bold text-purple-200 text-xs truncate">
                  {(player.cucPhamLinhThach || 0).toLocaleString()}
                </div>
                {handleExchangeLinhThach && (
                  <div className="flex gap-1 pt-0.5">
                    {(player.cucPhamLinhThach || 0) >= 1 && (
                      <button
                        onClick={() => handleExchangeLinhThach('cuc_pham', 'thuong_pham', 1)}
                        className="flex-1 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-600 text-[8px] text-zinc-200 font-mono transition cursor-pointer"
                        title="Tách Xuống: 1 Cực Phẩm -> 1,000 Thượng Phẩm"
                      >
                        Tách
                      </button>
                    )}
                    {(player.cucPhamLinhThach || 0) >= 1000 && (
                      <button
                        onClick={() => handleExchangeLinhThach('cuc_pham', 'tien_tinh', 1000)}
                        className="flex-1 py-0.5 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-700/50 text-[8px] text-rose-200 font-mono transition cursor-pointer"
                        title="Đổi Lên: 1,000 Cực Phẩm -> 1 Tiên Phẩm Linh Thạch"
                      >
                        Đổi Lên
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 5. Tiên Phẩm Linh Thạch (Tiên Tinh) */}
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-rose-950/30 via-purple-950/30 to-amber-950/30 border border-rose-500/60 space-y-1 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
                <div className="text-rose-300 font-serif font-bold flex items-center justify-between text-[9px]">
                  <span>Tiên Phẩm</span>
                  <span className="text-[8px] text-rose-400 font-mono">x1T</span>
                </div>
                <div className="font-mono font-bold text-rose-200 text-xs truncate">
                  {((player.tienTinh || player.tienPhamLinhThach || 0)).toLocaleString()}
                </div>
                {handleExchangeLinhThach && ((player.tienTinh || player.tienPhamLinhThach || 0)) >= 1 && (
                  <div className="pt-0.5">
                    <button
                      onClick={() => handleExchangeLinhThach('tien_tinh', 'cuc_pham', 1)}
                      className="w-full py-0.5 rounded bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[8px] text-purple-200 font-mono transition cursor-pointer"
                      title="Tách Xuống: 1 Tiên Phẩm -> 1,000 Cực Phẩm Linh Thạch"
                    >
                      Tách Xuống
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sub-tabs Phân Loại Danh Mục & Ô Tìm Kiếm */}
        <div className="space-y-1.5">
          <div className="flex rounded-lg bg-[#0e0e15] p-1 border border-zinc-800 text-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-0.5">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'pills', label: `Đan (${(player.inventory?.pills || []).filter(p => p.quantity > 0).length})` },
              { id: 'herbs', label: `Dược (${(player.inventory?.herbs || []).filter(h => h.quantity > 0).length})` },
              { id: 'ores', label: `Khoáng (${(player.inventory?.ores || []).filter(o => o.quantity > 0).length})` },
              { id: 'equipments', label: `Pháp Bảo (${(player.inventory?.equipments || []).length})` },
              { id: 'manuals', label: `Bí Tịch (${(player.manuals || []).length})` },
              { id: 'books', label: `Sách (${(player.inventory?.books || []).length})` },
              { id: 'bags', label: `Túi (${(player.inventory?.bags || []).length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setInventoryFilter(tab.id as any)}
                className={`flex-1 min-w-[46px] py-1 px-1 rounded text-center cursor-pointer transition font-serif text-[10px] truncate ${
                  inventoryFilter === tab.id
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ô Tìm Kiếm Nhanh */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm vật phẩm trong túi..."
              className="w-full bg-[#0a0a12] border border-zinc-800/80 focus:border-amber-500/50 rounded-lg pl-8 pr-7 py-1 text-[11px] text-zinc-200 placeholder-zinc-500 outline-none font-serif transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-0.5"
                title="Xóa tìm kiếm"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ITEM GRID: DUY NHẤT VÙNG NÀY ĐƯỢC CUỘN VỚI 1 THANH CUỘN CỔ PHONG */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-zinc-700/60 hover:scrollbar-thumb-amber-600/60 scrollbar-track-transparent custom-scrollbar space-y-2 pt-1 pb-4">
        {/* Nếu xem Tất Cả hoặc Đan Dược */}
        {visiblePills.map((pill, index) => (
          <div key={`pill-${pill.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-amber-900/30 flex justify-between items-center gap-2 hover:border-amber-600/40 transition">
            <div>
              <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 flex-wrap">
                <Flame className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>[{convertGradeToGiai(pill.grade)}] {pill.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(pill.quality).badgeClass}`}>
                  {getItemQuality(pill.quality).name}
                </span>
                <span className="text-amber-400 font-mono font-bold text-xs">x{pill.quantity}</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">{pill.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleUsePill(pill)}
                className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[10px] font-serif font-bold transition cursor-pointer"
              >
                Dùng
              </button>
              <button
                onClick={() => handleSellItem('pill', pill.id, 1)}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-serif transition cursor-pointer"
                title="Bán 1 viên"
              >
                Bán
              </button>
            </div>
          </div>
        ))}

        {/* Nếu xem Tất Cả hoặc Dược Liệu */}
        {visibleHerbs.map((herb, index) => (
          <div key={`herb-${herb.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-emerald-900/30 flex justify-between items-center gap-2 hover:border-emerald-600/40 transition">
            <div>
              <div className="text-xs font-serif font-bold text-emerald-200 flex items-center gap-1.5 flex-wrap">
                <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>[{convertGradeToGiai(herb.grade)}] {herb.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(herb.quality).badgeClass}`}>
                  {getItemQuality(herb.quality).name}
                </span>
                <span className="text-emerald-400 font-mono font-bold text-xs">x{herb.quantity}</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">{herb.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('alchemy')}
                className="px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-700/40 text-[10px] font-serif transition cursor-pointer"
              >
                Luyện Đan
              </button>
              <button
                onClick={() => handleSellItem('herb', herb.id, 1)}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-serif transition cursor-pointer"
              >
                Bán
              </button>
            </div>
          </div>
        ))}

        {/* Nếu xem Tất Cả hoặc Khoáng Thạch */}
        {visibleOres.map((ore, index) => (
          <div key={`ore-${ore.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-cyan-900/30 flex justify-between items-center gap-2 hover:border-cyan-600/40 transition">
            <div>
              <div className="text-xs font-serif font-bold text-cyan-200 flex items-center gap-1.5 flex-wrap">
                <Hammer className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>[{convertGradeToGiai(ore.grade)}] {ore.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(ore.quality).badgeClass}`}>
                  {getItemQuality(ore.quality).name}
                </span>
                <span className="text-cyan-400 font-mono font-bold text-xs">x{ore.quantity}</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">{ore.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('forging')}
                className="px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-700/40 text-[10px] font-serif transition cursor-pointer"
              >
                Luyện Khí
              </button>
              <button
                onClick={() => handleSellItem('ore', ore.id, 1)}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-serif transition cursor-pointer"
              >
                Bán
              </button>
            </div>
          </div>
        ))}

        {/* Nếu xem Tất Cả hoặc Pháp Bảo */}
        {visibleEquips.map((eq, index) => (
          <div key={`eq-${eq.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-amber-500/30 flex justify-between items-center gap-2 hover:border-amber-400/50 transition">
            <div>
              <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 flex-wrap">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>[{convertGradeToGiai(eq.grade)}] {eq.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(eq.quality).badgeClass}`}>
                  {getItemQuality(eq.quality).name} (x{getItemQuality(eq.quality).multiplier})
                </span>
                {eq.enhancement > 0 && <span className="text-cyan-400 font-mono font-bold">+{eq.enhancement}</span>}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">{eq.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleEquipEquipment(eq)}
                className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[10px] font-serif font-bold transition cursor-pointer"
              >
                Trang Bị
              </button>
              <button
                onClick={() => handleSellItem('equipment', eq.id, 1)}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-serif transition cursor-pointer"
              >
                Bán
              </button>
            </div>
          </div>
        ))}

        {/* Nếu xem Tất Cả hoặc Bí Tịch (đã học) */}
        {visibleManuals.map((manual, index) => (
          <div key={`manual-${manual.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-blue-900/30 flex justify-between items-center gap-2 hover:border-blue-600/40 transition">
            <div>
              <div className="text-xs font-serif font-bold text-blue-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>{manual.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-blue-950/40 text-blue-300 border border-blue-800/40">
                  {manual.grade}
                </span>
                <span className="text-blue-400 font-mono text-[10px]">Tầng {manual.level}/10</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">{manual.description}</p>
            </div>
            <button
              onClick={() => setActiveTab('manuals')}
              className="px-2.5 py-1 rounded bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-700/40 text-[10px] font-serif transition cursor-pointer shrink-0"
            >
              Tu Luyện
            </button>
          </div>
        ))}

        {/* Sách / Bí Kíp chưa học (cần bấm Lĩnh Ngộ) */}
        {visibleBooks.map((book, index) => (
          <div key={`book-${book.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-violet-900/40 flex justify-between items-center gap-2 hover:border-violet-500/50 transition">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-serif font-bold text-violet-200 flex items-center gap-1.5 flex-wrap">
                <Scroll className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span className="truncate">{book.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-violet-950/40 text-violet-300 border border-violet-800/40 shrink-0">
                  {book.grade}
                </span>
                {book.itemType === 'artisan_book' && (
                  <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-amber-950/40 text-amber-300 border border-amber-700/40 shrink-0">
                    {book.unlockArtisan === 'alchemy' ? '🔥 Đan Kinh' : '⚒️ Đúc Thuật'}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{book.description}</p>
            </div>
            <button
              onClick={() => handleLearnBookFromInventory(book)}
              className="px-2.5 py-1.5 rounded bg-gradient-to-r from-violet-800/50 to-purple-700/50 hover:brightness-125 text-violet-200 border border-violet-600/50 text-[10px] font-serif font-bold transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Unlock className="w-3 h-3" />
              Lĩnh Ngộ
            </button>
          </div>
        ))}

        {/* Túi Trữ Vật chưa trang bị (cần bấm Trang Bị) */}
        {visibleBags.map((bag, index) => (
          <div key={`bag-${bag.id}-${index}`} className="p-2.5 rounded-lg bg-[#0e0e15] border border-amber-700/40 flex justify-between items-center gap-2 hover:border-amber-500/60 transition">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 flex-wrap">
                <Backpack className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{bag.name}</span>
                <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-amber-950/40 text-amber-300 border border-amber-700/40 shrink-0">
                  {bag.grade}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 shrink-0">
                  {bag.maxSlots >= 9999 ? 'VÔ HẠN' : `${bag.maxSlots} ô`}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">{bag.description}</p>
              {maxSlots >= bag.maxSlots && (
                <p className="text-[9px] text-zinc-500 mt-0.5 italic">※ Túi hiện tại đã tốt hơn hoặc bằng.</p>
              )}
            </div>
            <button
              onClick={() => handleEquipBagFromInventory(bag)}
              disabled={maxSlots >= bag.maxSlots}
              className="px-2.5 py-1.5 rounded bg-gradient-to-r from-amber-800/50 to-yellow-700/50 hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed text-amber-200 border border-amber-600/50 text-[10px] font-serif font-bold transition cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Backpack className="w-3 h-3" />
              Trang Bị
            </button>
          </div>
        ))}

        {/* Trạng thái trống (Empty State) */}
        {totalVisible === 0 && (
          <div className="p-8 sm:p-12 text-center text-xs text-zinc-500 italic font-serif space-y-2">
            <Backpack className="w-8 h-8 text-zinc-600 mx-auto" />
            {searchQuery ? (
              <div className="space-y-1">
                <p>Không tìm thấy vật phẩm nào khớp với &quot;{searchQuery}&quot;.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-amber-400 hover:text-amber-300 text-[11px] underline cursor-pointer"
                >
                  Xóa từ khóa tìm kiếm
                </button>
              </div>
            ) : usedSlots === 0 ? (
              <p>Túi Trữ Vật trống rỗng. Hãy bế quan, thám hiểm bí cảnh hoặc ghé Thương Hội!</p>
            ) : (
              <p>Không có vật phẩm nào trong danh mục này.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
