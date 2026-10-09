// components/tabs/merchant/ItemRecycleView.tsx
// Thu Mua & Phân Giải — Màn Hình Bán Đồ + Tệ Điếm Hối Đoái Linh Thạch
// Trích xuất từ MerchantTab.tsx (lines 2703-3096)
// Props từ useMerchantTabActions, không tự tạo state giao dịch
// < 400 dòng — Tailwind classes giữ nguyên 100%

import React, { useMemo } from 'react';
import { Coins, Trash2 } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { calculateSellPrice } from '@/lib/merchant-data';
import { getItemQuality, convertGradeToGiai, formatLinhThachDenomination, calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';

// ============================================================================
// PROPS
// ============================================================================

export interface ItemRecycleViewProps {
  player: PlayerStats;
  activeTab?: 'sell' | 'exchange';

  // Handlers
  handleSellAllBasicItems: () => void;
  handleSellItem: (type: 'pill' | 'herb' | 'ore' | 'equipment', id: string, count: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleExchangeLinhThach?: (fromType: any, toType: any, amount?: number) => void;

  usedSlots: number;
}

// ============================================================================
// SELL TAB
// ============================================================================

const SellSection: React.FC<Pick<ItemRecycleViewProps, 'player' | 'handleSellAllBasicItems' | 'handleSellItem' | 'usedSlots'>> = ({
  player,
  handleSellAllBasicItems,
  handleSellItem,
  usedSlots,
}) => {
  const pills = useMemo(() => (player.inventory?.pills || []).filter((p) => p.quantity > 0), [player.inventory?.pills]);
  const herbs = useMemo(() => (player.inventory?.herbs || []).filter((h) => h.quantity > 0), [player.inventory?.herbs]);
  const ores  = useMemo(() => (player.inventory?.ores || []).filter((o) => o.quantity > 0), [player.inventory?.ores]);
  const equips = useMemo(() => player.inventory?.equipments || [], [player.inventory?.equipments]);

  // Ước tính tổng linh thạch thu về nếu bán hết thảo dược + khoáng thạch
  const estimatedTotal = useMemo(() => {
    let total = 0;
    herbs.forEach((h) => { total += calculateSellPrice(h) * h.quantity; });
    ores.forEach((o) => { total += calculateSellPrice(o) * o.quantity; });
    return total;
  }, [herbs, ores]);

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-2">
      {/* ── Thanh Lý Nhanh Header ── */}
      <div className="shrink-0 p-3 rounded-lg bg-emerald-950/25 border border-emerald-800/40 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-serif font-bold text-emerald-300">
            Thanh Lý Nhanh Dược Khoáng
          </div>
          <p className="text-[10px] text-zinc-400">
            Bán toàn bộ dược liệu &amp; khoáng thạch trong túi thu hồi Linh Thạch và dọn sạch chỗ trống.
          </p>
          {estimatedTotal > 0 && (
            <p className="text-[10px] text-amber-400 font-mono mt-0.5">
              Ước tính thu về: {formatLinhThachDenomination(estimatedTotal)}
            </p>
          )}
        </div>
        <button
          onClick={handleSellAllBasicItems}
          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold text-xs shadow-sm cursor-pointer transition shrink-0 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Thanh Lý Hết</span>
        </button>
      </div>

      {/* ── Bảng Tổng Kết Ước Tính ── */}
      {(herbs.length > 0 || ores.length > 0) && (
        <div className="shrink-0 grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/40 flex justify-between items-center">
            <span className="text-zinc-500">🌿 Dược thảo</span>
            <span className="text-emerald-400 font-bold">{herbs.reduce((s, h) => s + h.quantity, 0)} cành</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/40 flex justify-between items-center">
            <span className="text-zinc-500">⛏️ Khoáng thạch</span>
            <span className="text-cyan-400 font-bold">{ores.reduce((s, o) => s + o.quantity, 0)} khối</span>
          </div>
        </div>
      )}

      {/* ── Danh Sách Vật Phẩm Có Thể Thanh Lý ── */}
      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto custom-scrollbar pr-1">
        {/* 1. Đan Dược */}
        {pills.map((pill) => {
          const price = calculateSellPrice(pill);
          return (
            <div key={pill.id} className="p-2.5 rounded-lg bg-[#0e0e15] border border-zinc-800 flex justify-between items-center gap-2">
              <div>
                <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1 flex-wrap">
                  <span>[{convertGradeToGiai(pill.grade)}] {pill.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${getItemQuality(pill.quality).badgeClass}`}>
                    {getItemQuality(pill.quality).name}
                  </span>
                  <span className="text-amber-400 font-mono font-bold">x{pill.quantity}</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Giá thu hồi: <span className="text-amber-300 font-semibold">{formatLinhThachDenomination(price)}</span>/viên
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSellItem('pill', pill.id, 1)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-serif transition cursor-pointer"
                >
                  Bán 1
                </button>
                {pill.quantity > 1 && (
                  <button
                    onClick={() => handleSellItem('pill', pill.id, pill.quantity)}
                    className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/40 text-[10px] font-serif transition cursor-pointer"
                  >
                    Bán Hết
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 2. Dược Liệu */}
        {herbs.map((herb) => {
          const price = calculateSellPrice(herb);
          return (
            <div key={herb.id} className="p-2.5 rounded-lg bg-[#0e0e15] border border-zinc-800 flex justify-between items-center gap-2">
              <div>
                <div className="text-xs font-serif font-bold text-emerald-200 flex items-center gap-1 flex-wrap">
                  <span>[{convertGradeToGiai(herb.grade)}] {herb.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${getItemQuality(herb.quality).badgeClass}`}>
                    {getItemQuality(herb.quality).name}
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">x{herb.quantity}</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Giá thu hồi: <span className="text-amber-300 font-semibold">{formatLinhThachDenomination(price)}</span>/cành
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSellItem('herb', herb.id, 1)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-serif transition cursor-pointer"
                >
                  Bán 1
                </button>
                {herb.quantity > 1 && (
                  <button
                    onClick={() => handleSellItem('herb', herb.id, herb.quantity)}
                    className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/40 text-[10px] font-serif transition cursor-pointer"
                  >
                    Bán Hết
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 3. Khoáng Thạch */}
        {ores.map((ore) => {
          const price = calculateSellPrice(ore);
          return (
            <div key={ore.id} className="p-2.5 rounded-lg bg-[#0e0e15] border border-zinc-800 flex justify-between items-center gap-2">
              <div>
                <div className="text-xs font-serif font-bold text-cyan-200 flex items-center gap-1 flex-wrap">
                  <span>[{convertGradeToGiai(ore.grade)}] {ore.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${getItemQuality(ore.quality).badgeClass}`}>
                    {getItemQuality(ore.quality).name}
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">x{ore.quantity}</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Giá thu hồi: <span className="text-amber-300 font-semibold">{formatLinhThachDenomination(price)}</span>/khối
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSellItem('ore', ore.id, 1)}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-serif transition cursor-pointer"
                >
                  Bán 1
                </button>
                {ore.quantity > 1 && (
                  <button
                    onClick={() => handleSellItem('ore', ore.id, ore.quantity)}
                    className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/40 text-[10px] font-serif transition cursor-pointer"
                  >
                    Bán Hết
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 4. Pháp Bảo Dư Thừa */}
        {equips.map((eq) => {
          const price = calculateSellPrice(eq);
          return (
            <div key={eq.id} className="p-2.5 rounded-lg bg-[#0e0e15] border border-cyan-900/40 flex justify-between items-center gap-2">
              <div>
                <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 flex-wrap">
                  <span>[{convertGradeToGiai(eq.grade)}] {eq.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${getItemQuality(eq.quality).badgeClass}`}>
                    {getItemQuality(eq.quality).name}
                  </span>
                  {eq.enhancement > 0 && <span className="text-cyan-400 font-mono font-bold">+{eq.enhancement}</span>}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  Giá thu hồi: <span className="text-amber-300 font-semibold">{formatLinhThachDenomination(price)}</span>
                </div>
              </div>
              <button
                onClick={() => handleSellItem('equipment', eq.id, 1)}
                className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-[10px] font-serif transition cursor-pointer"
              >
                Thu Hồi
              </button>
            </div>
          );
        })}

        {/* Empty state */}
        {usedSlots === 0 && (
          <div className="p-8 text-center text-xs text-zinc-500 italic font-serif">
            Túi trữ vật hoàn toàn trống rỗng, không có vật phẩm nào để bán.
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EXCHANGE TAB (Tệ Điếm — Hối Đoái 5 Tầng Tiền Tệ)
// ============================================================================

const ExchangeSection: React.FC<Pick<ItemRecycleViewProps, 'player' | 'handleExchangeLinhThach'>> = ({
  player,
  handleExchangeLinhThach,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-3">
      {/* Intro banner */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/30 via-[#14120e] to-zinc-950 border border-amber-800/40 space-y-1">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <h4 className="text-xs font-serif font-bold text-amber-200">
            TỆ ĐIẾM VẠN BẢO • HỐI ĐOÁI 5 TẦNG TIỀN TỆ
          </h4>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Theo quy chuẩn tu chân giới, tỷ giá quy đổi cố định <strong>1:1,000</strong> giữa các bậc.
          Đạo hữu có thể dùng nút <span className="text-amber-300">&quot;Đổi Lên&quot;</span> để cô đọng
          linh khí hoặc <span className="text-zinc-300">&quot;Tách Xuống&quot;</span> để phân rã giao dịch hàng ngày.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
        {/* 1. Hạ Phẩm */}
        <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-zinc-400 font-serif font-bold">
              <span>Hạ Phẩm</span>
              <span className="text-[10px] text-zinc-500 font-mono">x1 Cơ sở</span>
            </div>
            <div className="font-mono font-bold text-amber-300 text-sm mt-1 truncate">
              {(player.linhThach || 0).toLocaleString()}
            </div>
            <p className="text-[9px] text-zinc-500 mt-1">Đơn vị lưu thông rộng khắp phàm trần và tu tiên giới.</p>
          </div>
          {handleExchangeLinhThach && (
            <div className="space-y-1 pt-2 border-t border-zinc-800">
              <button
                onClick={() => handleExchangeLinhThach('ha_pham', 'trung_pham', 1000)}
                disabled={player.linhThach < 1000}
                className={`w-full py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                  player.linhThach >= 1000
                    ? 'bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-200 font-bold'
                    : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
                title="Đổi 1,000 Hạ Phẩm sang 1 Trung Phẩm"
              >
                Đổi Lên 1 Trung (1k)
              </button>
              {player.linhThach >= 2000 && (
                <button
                  onClick={() => handleExchangeLinhThach('ha_pham', 'trung_pham', Math.floor(player.linhThach / 1000) * 1000)}
                  className="w-full py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[9px] text-zinc-300 font-mono transition cursor-pointer"
                >
                  Đổi Lên Hết ({Math.floor(player.linhThach / 1000)} viên)
                </button>
              )}
            </div>
          )}
        </div>

        {/* 2. Trung Phẩm */}
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-emerald-400 font-serif font-bold">
              <span>Trung Phẩm</span>
              <span className="text-[10px] text-emerald-500 font-mono">x1,000</span>
            </div>
            <div className="font-mono font-bold text-emerald-300 text-sm mt-1 truncate">
              {(player.trungPhamLinhThach || 0).toLocaleString()}
            </div>
            <p className="text-[9px] text-zinc-500 mt-1">1 Trung Phẩm = 1,000 Hạ Phẩm. Dùng giao dịch pháp bảo tầm trung.</p>
          </div>
          {handleExchangeLinhThach && (
            <div className="flex flex-col gap-1 pt-2 border-t border-emerald-900/30">
              <div className="flex gap-1">
                <button
                  onClick={() => handleExchangeLinhThach('trung_pham', 'ha_pham', 1)}
                  disabled={(player.trungPhamLinhThach || 0) < 1}
                  className={`flex-1 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    (player.trungPhamLinhThach || 0) >= 1
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                      : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title="1 Trung Phẩm → 1,000 Hạ Phẩm"
                >
                  Tách Xuống (1k)
                </button>
                <button
                  onClick={() => handleExchangeLinhThach('trung_pham', 'thuong_pham', 1000)}
                  disabled={(player.trungPhamLinhThach || 0) < 1000}
                  className={`flex-1 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    (player.trungPhamLinhThach || 0) >= 1000
                      ? 'bg-sky-950/70 hover:bg-sky-900 border border-sky-700/60 text-sky-200 font-bold'
                      : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title="1,000 Trung Phẩm → 1 Thượng Phẩm"
                >
                  Đổi Lên 1 Thượng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Thượng Phẩm */}
        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-sky-400 font-serif font-bold">
              <span>Thượng Phẩm</span>
              <span className="text-[10px] text-sky-500 font-mono">x1,000,000</span>
            </div>
            <div className="font-mono font-bold text-sky-300 text-sm mt-1 truncate">
              {(player.thuongPhamLinhThach || 0).toLocaleString()}
            </div>
            <p className="text-[9px] text-zinc-500 mt-1">1 Thượng Phẩm = 1,000 Trung Phẩm = 1,000,000 Hạ Phẩm.</p>
          </div>
          {handleExchangeLinhThach && (
            <div className="flex flex-col gap-1 pt-2 border-t border-sky-900/30">
              <div className="flex gap-1">
                <button
                  onClick={() => handleExchangeLinhThach('thuong_pham', 'trung_pham', 1)}
                  disabled={(player.thuongPhamLinhThach || 0) < 1}
                  className={`flex-1 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    (player.thuongPhamLinhThach || 0) >= 1
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                      : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title="1 Thượng Phẩm → 1,000 Trung Phẩm"
                >
                  Tách Xuống
                </button>
                <button
                  onClick={() => handleExchangeLinhThach('thuong_pham', 'cuc_pham', 1000)}
                  disabled={(player.thuongPhamLinhThach || 0) < 1000}
                  className={`flex-1 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    (player.thuongPhamLinhThach || 0) >= 1000
                      ? 'bg-purple-950/70 hover:bg-purple-900 border border-purple-700/60 text-purple-200 font-bold'
                      : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title="1,000 Thượng Phẩm → 1 Cực Phẩm"
                >
                  Đổi Lên 1 Cực
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Cực Phẩm */}
        <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-700/50 space-y-2 flex flex-col justify-between shadow-[0_0_12px_rgba(192,132,252,0.1)]">
          <div>
            <div className="flex justify-between items-center text-purple-300 font-serif font-bold">
              <span>Cực Phẩm</span>
              <span className="text-[10px] text-purple-400 font-mono">x1 Tỷ</span>
            </div>
            <div className="font-mono font-bold text-purple-200 text-sm mt-1 truncate">
              {(player.cucPhamLinhThach || 0).toLocaleString()}
            </div>
            <p className="text-[9px] text-zinc-500 mt-1">1 Cực Phẩm = 1,000 Thượng Phẩm. Báu vật đấu giá và bình cảnh thiên kiếp.</p>
          </div>
          {handleExchangeLinhThach && (
            <div className="flex flex-col gap-1 pt-2 border-t border-purple-900/30">
              <div className="flex gap-1">
                <button
                  onClick={() => handleExchangeLinhThach('cuc_pham', 'thuong_pham', 1)}
                  disabled={(player.cucPhamLinhThach || 0) < 1}
                  className={`flex-1 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    (player.cucPhamLinhThach || 0) >= 1
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                      : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title="1 Cực Phẩm → 1,000 Thượng Phẩm"
                >
                  Tách Xuống
                </button>
                <button
                  onClick={() => handleExchangeLinhThach('cuc_pham', 'tien_tinh', 1000)}
                  disabled={(player.cucPhamLinhThach || 0) < 1000}
                  className={`flex-1 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                    (player.cucPhamLinhThach || 0) >= 1000
                      ? 'bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 text-rose-200 font-bold'
                      : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                  title="1,000 Cực Phẩm → 1 Tiên Phẩm Linh Thạch"
                >
                  Đổi Lên 1 Tiên
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Tiên Phẩm Linh Thạch */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/30 via-purple-950/30 to-amber-950/30 border border-rose-500/60 space-y-2 flex flex-col justify-between shadow-[0_0_15px_rgba(244,63,94,0.15)]">
          <div>
            <div className="flex justify-between items-center text-rose-300 font-serif font-bold">
              <span>Tiên Phẩm</span>
              <span className="text-[10px] text-rose-400 font-mono">x1,000 Tỷ</span>
            </div>
            <div className="font-mono font-bold text-rose-200 text-sm mt-1 truncate">
              {((player.tienTinh || player.tienPhamLinhThach || 0)).toLocaleString()}
            </div>
            <p className="text-[9px] text-zinc-400 mt-1">1 Tiên Phẩm = 1,000 Cực Phẩm. Tinh hoa thượng giới chí tôn vô giá.</p>
          </div>
          {handleExchangeLinhThach && (
            <div className="pt-2 border-t border-rose-900/40">
              <button
                onClick={() => handleExchangeLinhThach('tien_tinh', 'cuc_pham', 1)}
                disabled={(player.tienTinh || player.tienPhamLinhThach || 0) < 1}
                className={`w-full py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                  (player.tienTinh || player.tienPhamLinhThach || 0) >= 1
                    ? 'bg-purple-950/70 hover:bg-purple-900 border border-purple-700/60 text-purple-200 font-bold'
                    : 'bg-zinc-900/60 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
                title="1 Tiên Phẩm → 1,000 Cực Phẩm Linh Thạch"
              >
                Tách Xuống (1,000 Cực Phẩm)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tổng quy đổi */}
      <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/40 flex justify-between items-center text-[10.5px]">
        <span className="text-zinc-500 font-serif">Tổng sức mua (quy Hạ Phẩm):</span>
        <span className="font-mono font-bold text-amber-300">
          {calculateTotalEquivalentHaPham(player).toLocaleString()} Hạ Phẩm
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// ROOT COMPONENT
// ============================================================================

export const ItemRecycleView: React.FC<ItemRecycleViewProps> = (props) => {
  const [internalTab, setInternalTab] = React.useState<'sell' | 'exchange'>(props.activeTab || 'sell');
  const currentTab = props.activeTab || internalTab;

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-2">
      {/* ── Sub-tabs Thu Mua (Thanh Lý & Tệ Điếm) ── */}
      <div className="shrink-0 flex items-center gap-2 border-b border-amber-900/30 pb-1.5 px-0.5">
        <button
          onClick={() => setInternalTab('sell')}
          className={`px-3 py-1.5 text-xs rounded-lg font-serif font-medium transition cursor-pointer flex items-center gap-1.5 ${
            currentTab === 'sell'
              ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 border border-transparent'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>♻️ Thanh Lý Hàng Hóa</span>
        </button>
        <button
          onClick={() => setInternalTab('exchange')}
          className={`px-3 py-1.5 text-xs rounded-lg font-serif font-medium transition cursor-pointer flex items-center gap-1.5 ${
            currentTab === 'exchange'
              ? 'bg-gradient-to-r from-yellow-600/40 to-amber-600/40 text-yellow-200 border border-yellow-500/50 font-bold shadow-sm'
              : 'text-yellow-400/80 hover:text-yellow-200 bg-zinc-900/40 border border-transparent'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span>💰 Tệ Điếm Hối Đoái</span>
        </button>
      </div>

      {currentTab === 'sell' ? (
        <SellSection
          player={props.player}
          handleSellAllBasicItems={props.handleSellAllBasicItems}
          handleSellItem={props.handleSellItem}
          usedSlots={props.usedSlots}
        />
      ) : (
        <ExchangeSection
          player={props.player}
          handleExchangeLinhThach={props.handleExchangeLinhThach}
        />
      )}
    </div>
  );
};

export default ItemRecycleView;
