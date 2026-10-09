// components/tabs/merchant/MerchantItemCard.tsx
// Thẻ Hàng Hóa Vạn Bảo Thương Hội — Component Dùng Chung (Shared)
// Hiển thị: tên, badge giai vị/phẩm cấp, giá, trạng thái, nút thao tác
// Giữ nguyên 100% Tailwind CSS classes từ MerchantTab.tsx gốc

import React from 'react';
import { Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { getTierVisualTheme } from '@/lib/pill-tier-data';
import { getItemQuality, formatLinhThachDenomination, convertGradeToGiai } from '@/lib/item-quality-data';
import { PillTier } from '@/lib/types';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

export interface MerchantItemCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  mode: 'buy' | 'sell' | 'exchange';
  playerMoney: number;       // Tổng Hạ Phẩm quy đổi (calculateTotalEquivalentHaPham)
  playerRealmIndex: number;  // player.currentRealm || 0
  discountPercent?: number;  // Chiết khấu từ Đạo Lữ (merchantDiscountPercent)
  isPermanentSoldOut?: boolean;
  isSoldOut?: boolean;
  isRealmLocked?: boolean;
  isCurrentlyEquipped?: boolean;
  isAlreadyOwned?: boolean;  // Generic "đã sở hữu" flag (learned/bonded/equipped)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActionClick: (item: any) => void;
  onSecondaryClick?: () => void;  // "Chi Tiết" / "Khẩu Quyết" button
  secondaryLabel?: string;
  actionLabel?: string;       // Custom nút chính nếu không muốn default
  isProcessing?: boolean;
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

function formatCompactPrice(price: number): string {
  if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(0)}M`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(0)}k`;
  return String(price);
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MerchantItemCard: React.FC<MerchantItemCardProps> = ({
  item,
  mode,
  playerMoney,
  playerRealmIndex: _playerRealmIndex,
  discountPercent = 0,
  isPermanentSoldOut = false,
  isSoldOut = false,
  isRealmLocked = false,
  isCurrentlyEquipped = false,
  isAlreadyOwned = false,
  onActionClick,
  onSecondaryClick,
  secondaryLabel,
  actionLabel,
  isProcessing = false,
}) => {
  // --- Computed price ---
  const finalPrice =
    mode === 'buy'
      ? discountPercent > 0
        ? Math.max(1, Math.floor(item.price * (1 - discountPercent / 100)))
        : item.price
      : item.price; // sell mode: price already computed externally

  const canAfford = playerMoney >= finalPrice;

  // --- Item metadata ---
  const itemTier = (item.tier ||
    (typeof item.grade === 'number' ? item.grade : undefined)) as PillTier | undefined;
  const tierTheme = itemTier ? getTierVisualTheme(itemTier) : undefined;
  const qualityInfo = getItemQuality(item.quality || 'ha_pham');

  const isDisabled = mode === 'buy'
    ? isRealmLocked || isSoldOut || isPermanentSoldOut || isAlreadyOwned || !canAfford || isProcessing
    : isProcessing;

  // --- Card border class ---
  const cardBorderClass = isRealmLocked
    ? 'border-red-950/50 bg-[#0a080c] opacity-75'
    : isCurrentlyEquipped
    ? 'border-emerald-600/70 bg-[#0c1410] shadow-sm shadow-emerald-950/40'
    : isPermanentSoldOut || isAlreadyOwned
    ? 'border-zinc-800/60 opacity-80 bg-[#0e0e15]'
    : tierTheme
    ? `${tierTheme.borderClass} ${tierTheme.glowClass} bg-[#0e0e15]`
    : 'border-amber-900/20 hover:border-amber-700/40 bg-[#0e0e15]';

  // --- Action button ---
  const renderActionButton = () => {
    if (isRealmLocked) {
      return (
        <button
          disabled
          className="px-2.5 py-1 rounded text-[10.5px] font-serif font-bold transition flex items-center gap-1 bg-red-950/40 border border-red-900/60 text-red-400 cursor-not-allowed"
          title={`Cần đạt ${item.requiredRealmName || `Cảnh giới ${item.requiredRealmIndex}`} để mở khóa`}
        >
          <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>🔒 Cần: {item.requiredRealmName || 'Cảnh Giới'}</span>
        </button>
      );
    }

    if (mode === 'buy' && (isPermanentSoldOut || isAlreadyOwned)) {
      return (
        <button
          disabled
          className="px-2.5 py-1 rounded text-[10.5px] font-serif font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed flex items-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Đã Sở Hữu</span>
        </button>
      );
    }

    if (mode === 'buy' && isSoldOut) {
      return (
        <button
          disabled
          className="px-2.5 py-1 rounded text-[10.5px] font-serif font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
        >
          Hết Hàng
        </button>
      );
    }

    const label = actionLabel
      ?? (mode === 'buy'
        ? !canAfford
          ? 'Thiếu Linh Thạch'
          : `🛒 Mua (${formatCompactPrice(finalPrice)} LT)`
        : `💰 Bán (${formatCompactPrice(finalPrice)} LT)`);

    return (
      <button
        onClick={() => !isDisabled && onActionClick(item)}
        disabled={isDisabled}
        className={`px-2.5 py-1 rounded text-[10.5px] font-serif font-bold transition flex items-center gap-1 shadow-md active:scale-95 ${
          !isDisabled
            ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white cursor-pointer shadow-amber-950/50 ring-1 ring-amber-400/30'
            : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
        }`}
      >
        {!isDisabled && <Sparkles className="w-3.5 h-3.5 text-amber-200 shrink-0" />}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div
      className={`p-2 sm:p-2.5 rounded-lg border transition space-y-1.5 ${cardBorderClass}`}
    >
      {/* Top row: Name + badges + price */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          {/* Item name + status badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`font-serif font-bold text-xs ${
                isCurrentlyEquipped
                  ? 'text-emerald-300'
                  : isPermanentSoldOut || isAlreadyOwned
                  ? 'text-zinc-400'
                  : isRealmLocked
                  ? 'text-zinc-400'
                  : tierTheme
                  ? tierTheme.textColor
                  : 'text-amber-200'
              }`}
            >
              {item.name}
            </span>

            {isRealmLocked && (
              <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-red-950/80 text-red-300 border border-red-800/60 flex items-center gap-0.5 animate-pulse">
                <Lock className="w-2.5 h-2.5 inline" />
                Cần: {item.requiredRealmName || `Cảnh giới ${item.requiredRealmIndex}`}
              </span>
            )}
            {!isRealmLocked && item.requiredRealmName && (
              <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                ✓ Đạt {item.requiredRealmName}
              </span>
            )}
            {isCurrentlyEquipped && (
              <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-500 font-bold flex items-center gap-0.5 shadow-sm shadow-emerald-500/30 animate-pulse">
                ✓ ĐANG TRANG BỊ
              </span>
            )}
            {isAlreadyOwned && !isCurrentlyEquipped && (
              <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-600/70 font-bold flex items-center gap-0.5">
                ✓ Đã Sở Hữu
              </span>
            )}
            {item.isOneTime && (
              <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-purple-950/70 text-purple-300 border border-purple-800/60">
                ✨ Độc Bản
              </span>
            )}
            <span
              className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono border ${qualityInfo.badgeClass}`}
            >
              {qualityInfo.name}
            </span>
            <span
              className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono border ${
                tierTheme?.badgeBg || 'bg-amber-950/40 text-amber-300 border-amber-800/40'
              }`}
            >
              {item.tierName || (itemTier ? `Giai ${itemTier}` : convertGradeToGiai(item.grade))}
            </span>
            {discountPercent > 0 && mode === 'buy' && (
              <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono bg-rose-950 text-rose-300 border border-rose-800/50">
                -{discountPercent}% Dạ Mộng Ly
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Price block */}
        <div className="text-right shrink-0">
          <div className="text-xs font-mono font-bold text-amber-300">
            {formatLinhThachDenomination(finalPrice)}
          </div>
          {isPermanentSoldOut || isAlreadyOwned ? (
            <div className="text-[8.5px] text-emerald-500 font-serif font-medium flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3 inline" />
              <span>Đã sở hữu</span>
            </div>
          ) : discountPercent > 0 && mode === 'buy' ? (
            <div className="text-[8.5px] text-emerald-400 font-mono">
              <span className="line-through text-zinc-500 mr-1">{item.price.toLocaleString()}</span>
              Còn: {item.stock} cái
            </div>
          ) : (
            <div className="text-[8.5px] text-zinc-400 font-mono">
              {item.price >= 1000
                ? `${(item.price / 1000).toFixed(1)}k LT`
                : `${item.price} LT`}{' '}
              {item.stock !== undefined && `• Còn: ${item.stock} cái`}
            </div>
          )}
        </div>
      </div>

      {/* Footer row: type tag + action buttons */}
      <div className="flex justify-between items-center pt-1 border-t border-amber-900/20">
        <div className="text-[9.5px] text-zinc-500 font-serif">
          {item.category === 'pills' || item.itemType === 'pill'
            ? '💊 Đan Dược'
            : item.category === 'cultivation'
            ? '🧘 Tu Luyện'
            : item.category === 'manuals' || item.itemType === 'manual'
            ? '📜 Công Pháp'
            : item.category === 'skills' || item.category === 'divine'
            ? '🔮 Thần Thông'
            : item.category === 'herbs' || item.itemType === 'herb'
            ? '🌿 Dược Thảo'
            : item.category === 'ores' || item.itemType === 'ore'
            ? '⛏️ Khoáng Thạch'
            : item.category === 'equipment' || item.itemType === 'equipment'
            ? '⚔️ Pháp Bảo'
            : 'Vật Phẩm'}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onSecondaryClick && secondaryLabel && (
            <button
              onClick={onSecondaryClick}
              className="px-2 py-1 rounded text-[10px] font-serif font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition cursor-pointer active:scale-95"
            >
              {secondaryLabel}
            </button>
          )}
          {renderActionButton()}
        </div>
      </div>
    </div>
  );
};

export default MerchantItemCard;
