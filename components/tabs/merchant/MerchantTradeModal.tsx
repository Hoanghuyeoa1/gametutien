// components/tabs/merchant/MerchantTradeModal.tsx
// Hộp Thoại Giao Dịch Vạn Bảo Thương Hội — Component Dùng Chung (Shared)
// Stepper số lượng + nút nhanh [1][5][10][Max] + cảnh báo + nút xác nhận hoàng kim
// Giữ nguyên 100% Tailwind CSS classes từ MerchantTab.tsx gốc (lines 3127-3351)

import React from 'react';
import { X, ShoppingBag, ArrowDownToLine } from 'lucide-react';
import { getTierVisualTheme } from '@/lib/pill-tier-data';
import { formatLinhThachDenomination } from '@/lib/item-quality-data';
import { PillTier } from '@/lib/types';

// ============================================================================
// TRADE MODAL STATE TYPE (tái sử dụng ở nhiều nơi)
// ============================================================================

export interface TradeModalState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  unitPrice: number;
  playerMoney: number;     // calculateTotalEquivalentHaPham
  maxStock: number;        // item.stock hoặc số lượng trong túi đồ (khi bán)
  maxAffordable: number;   // Math.floor(playerMoney / unitPrice)
  mode: 'buy' | 'sell';
  icon?: string;
}

// ============================================================================
// PROPS INTERFACE
// ============================================================================

export interface MerchantTradeModalProps {
  tradeState: TradeModalState;
  quantity: number;
  onClose: () => void;
  onConfirm: () => void;
  onChangeQuantity: (qty: number) => void;
  isProcessing: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MerchantTradeModal: React.FC<MerchantTradeModalProps> = ({
  tradeState,
  quantity,
  onClose,
  onConfirm,
  onChangeQuantity,
  isProcessing,
}) => {
  const { item, unitPrice, playerMoney, maxStock, maxAffordable, mode, icon } = tradeState;

  // --- Derived values ---
  const maxCanBuy = mode === 'buy'
    ? Math.min(maxStock, Math.max(1, maxAffordable))
    : maxStock; // sell: limited by owned qty

  const totalCost = unitPrice * quantity;
  const canAffordTotal = playerMoney >= totalCost;

  const itemTier = (item?.tier ||
    (typeof item?.grade === 'number' ? item?.grade : undefined)) as PillTier | undefined;
  const tierTheme = itemTier ? getTierVisualTheme(itemTier) : undefined;

  // --- Determine icon ---
  const cultivationCategory = item?.cultivationCategory || item?.data?.category;
  const modalIcon = icon ?? (
    cultivationCategory === 'manual' ? '📜'
    : cultivationCategory === 'array' ? '🌀'
    : cultivationCategory === 'essence' ? '💧'
    : cultivationCategory === 'incense' ? '🪔'
    : mode === 'sell' ? '💰'
    : '💊'
  );

  // --- Clamped setter ---
  const handleSetQty = (qty: number) => {
    const safeMax = Math.max(1, maxCanBuy > 0 ? maxCanBuy : maxStock);
    onChangeQuantity(Math.max(1, Math.min(safeMax, qty)));
  };

  const isBuyDisabled = !canAffordTotal || quantity <= 0 || isProcessing;
  const isConfirmDisabled = mode === 'buy' ? isBuyDisabled : quantity <= 0 || isProcessing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className={`relative w-full max-w-md rounded-2xl bg-[#0f0e14] border p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-4 ${
          tierTheme ? tierTheme.borderClass : 'border-amber-600/50'
        }`}
      >
        {/* ── HEADER ── */}
        <div className="flex items-start justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg ${
                tierTheme?.badgeBg || 'bg-amber-950/60 border-amber-700/60'
              }`}
            >
              {modalIcon}
            </div>
            <div>
              <h3
                className={`font-serif font-bold text-sm ${
                  tierTheme?.textColor || 'text-amber-200'
                }`}
              >
                {item?.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {itemTier && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${
                      tierTheme?.badgeBg || 'bg-amber-950/40 text-amber-300'
                    }`}
                  >
                    {item?.tierName || `Giai ${itemTier}`}
                  </span>
                )}
                <span className="text-[9px] text-zinc-400 font-mono">
                  {mode === 'buy'
                    ? `Còn: ${maxStock} cái trong hội`
                    : `Đang có: ${maxStock} cái`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── ITEM DESCRIPTION ── */}
        {item?.description && (
          <p className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded-lg border border-amber-900/20 leading-relaxed font-sans">
            {item.description}
          </p>
        )}

        {/* ── PILL EFFECTS ── */}
        {item?.pillEffects && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.pillEffects.tuViGain ? (
              <span className="text-[9.5px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 font-mono">
                +{item.pillEffects.tuViGain.toLocaleString()} Tu Vi / viên
              </span>
            ) : null}
            {item.pillEffects.breakthroughBonusPercent ? (
              <span className="text-[9.5px] px-2 py-0.5 rounded bg-yellow-950/60 text-yellow-300 border border-yellow-800/40 font-mono font-bold">
                +{item.pillEffects.breakthroughBonusPercent}% Đột Phá
              </span>
            ) : null}
            {item.pillEffects.lifespanYears ? (
              <span className="text-[9.5px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-mono">
                +{item.pillEffects.lifespanYears} Năm Thọ
              </span>
            ) : null}
            {item.pillEffects.allAttributesBonus ? (
              <span className="text-[9.5px] px-2 py-0.5 rounded bg-amber-950/80 text-yellow-300 border border-amber-600/60 font-mono font-bold">
                +{item.pillEffects.allAttributesBonus} Toàn Thuộc Tính
              </span>
            ) : null}
          </div>
        )}

        {/* ── PRICE OVERVIEW ── */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
          <div>
            <span className="text-zinc-400 block text-[10px]">
              {mode === 'buy' ? 'Đơn Giá:' : 'Giá Thu Mua / Cái:'}
            </span>
            <span className="font-mono font-bold text-amber-300">
              {formatLinhThachDenomination(unitPrice)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-zinc-400 block text-[10px]">Linh Thạch Hiện Có:</span>
            <span className="font-mono font-bold text-emerald-400">
              {formatLinhThachDenomination(playerMoney)}
            </span>
          </div>
        </div>

        {/* ── QUICK SELECT BUTTONS ── */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-zinc-400">
            <span>Chọn số lượng:</span>
            <span className="font-mono text-zinc-300 text-[11px]">
              {mode === 'buy'
                ? `Khả năng mua tối đa: ${maxCanBuy}`
                : `Tối đa có thể bán: ${maxStock}`}{' '}
              cái
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10].map((qty) => (
              <button
                key={qty}
                onClick={() => handleSetQty(qty)}
                disabled={maxStock < qty}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                  quantity === qty
                    ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                    : maxStock < qty
                    ? 'bg-zinc-900/60 text-zinc-600 border-zinc-800 cursor-not-allowed'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-amber-600/60'
                }`}
              >
                {qty}
              </button>
            ))}
            <button
              onClick={() => handleSetQty(maxCanBuy)}
              disabled={maxCanBuy <= 0}
              className={`py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                quantity === maxCanBuy && maxCanBuy > 0
                  ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                  : maxCanBuy <= 0
                  ? 'bg-zinc-900/60 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-950 to-yellow-950 text-amber-300 border-amber-700/60 hover:border-amber-500'
              }`}
            >
              Tối Đa ({maxCanBuy})
            </button>
          </div>
        </div>

        {/* ── STEPPER ── */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => handleSetQty(quantity - 1)}
            disabled={quantity <= 1}
            className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono font-bold flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={maxStock}
            value={quantity}
            onChange={(e) => handleSetQty(parseInt(e.target.value) || 1)}
            className="flex-1 text-center font-mono font-bold text-base text-amber-300 bg-transparent outline-none"
          />
          <button
            onClick={() => handleSetQty(quantity + 1)}
            disabled={quantity >= maxStock}
            className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono font-bold flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            +
          </button>
        </div>

        {/* ── TOTAL SUMMARY ── */}
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">
              {mode === 'buy' ? 'Tổng Linh Thạch:' : 'Tổng Thu Về:'}
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                mode === 'buy'
                  ? canAffordTotal
                    ? 'text-amber-300'
                    : 'text-rose-400'
                  : 'text-emerald-300'
              }`}
            >
              {formatLinhThachDenomination(totalCost)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10.5px]">
            <span className="text-zinc-500">
              {mode === 'buy' ? 'Linh Thạch còn lại:' : 'Sau khi bán:'}
            </span>
            <span className="font-mono text-zinc-400">
              {mode === 'buy'
                ? canAffordTotal
                  ? formatLinhThachDenomination(playerMoney - totalCost)
                  : 'Không đủ Linh Thạch!'
                : formatLinhThachDenomination(playerMoney + totalCost)}
            </span>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-serif text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`flex-1 py-2.5 rounded-xl font-serif text-xs font-bold transition shadow-lg flex items-center justify-center gap-1.5 ${
              !isConfirmDisabled
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white cursor-pointer shadow-amber-950/50 ring-1 ring-amber-400/30'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
            }`}
          >
            {mode === 'buy' ? (
              <ShoppingBag className="w-4 h-4" />
            ) : (
              <ArrowDownToLine className="w-4 h-4" />
            )}
            <span>
              {mode === 'buy'
                ? `Xác Nhận Mua (${quantity})`
                : `Xác Nhận Bán (${quantity})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantTradeModal;
