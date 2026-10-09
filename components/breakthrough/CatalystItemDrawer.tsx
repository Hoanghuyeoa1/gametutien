// components/breakthrough/CatalystItemDrawer.tsx
// Drawer/Modal phong cách Tiên Hiệp Cổ Phong lựa chọn Đan Dược & Phù Chú Hộ Mạch
// 100% Strict TypeScript, Tailwind CSS, Responsive

import React from 'react';
import { X, Sparkles, Shield, AlertCircle, Check } from 'lucide-react';

interface CatalystItemDrawerProps {
  isOpen: boolean;
  slotType: 'pill' | 'talisman' | null;
  items: any[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onClose: () => void;
}

export const CatalystItemDrawer: React.FC<CatalystItemDrawerProps> = ({
  isOpen,
  slotType,
  items,
  selectedId,
  onSelect,
  onClose
}) => {
  if (!isOpen || !slotType) return null;

  const isPill = slotType === 'pill';
  const title = isPill
    ? 'CHỌN ĐAN DƯỢC PHÁ CẢNH'
    : 'CHỌN TRẬN BÀN / PHÙ CHÚ HỘ MẠCH';
  const subtitle = isPill
    ? 'Khảm nạp thánh đan gia tăng tỷ lệ phá cảnh & giảm trừ phản phệ'
    : 'Bảo hộ tâm mạch, giảm trừ hao phí linh thạch & thanh tẩy đan độc';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gradient-to-b from-[#181520] via-[#121019] to-[#0c0a10] border-t sm:border border-amber-600/40 rounded-t-2xl sm:rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-900/40 bg-black/40">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isPill
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                : 'bg-amber-950/60 border-amber-500/50 text-amber-400'
            }`}>
              {isPill ? <Sparkles className="w-4 h-4 animate-pulse" /> : <Shield className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-amber-300">
                {title}
              </h3>
              <p className="text-[10px] text-zinc-400 font-serif">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-amber-200 hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-3 overflow-y-auto space-y-2.5 flex-1 divide-y divide-amber-950/30">
          {items.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-zinc-400 font-serif">
                {isPill
                  ? 'Trong Túi Trữ Vật hiện không có Đan Dược phá cảnh phù hợp.'
                  : 'Trong Túi Trữ Vật hiện không có Trận Bàn hoặc Phù Chú Hộ Mạch.'}
              </p>
              <p className="text-[10.5px] text-amber-500/80 font-mono">
                {isPill
                  ? 'Gợi ý: Luyện đan tại Đan Phòng hoặc tìm mua tại Vạn Bảo Các.'
                  : 'Gợi ý: Chế tác tại Phù Lục Các hoặc mua Tụ Linh Trận Bàn tại Phường Thị.'}
              </p>
            </div>
          ) : (
            items.map((item: any) => {
              const itemId = item.instanceId || item.id;
              const isSelected = selectedId === itemId;
              const veinCount = item.veinMetadata?.veinCount ?? item.veinCount ?? 0;
              const isNineVein = veinCount === 9;
              const isHighVein = veinCount >= 6 && veinCount <= 8;

              return (
                <div
                  key={itemId}
                  onClick={() => onSelect(isSelected ? null : itemId)}
                  className={`pt-2.5 first:pt-0 p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? isPill
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'bg-black/30 border-amber-900/20 hover:border-amber-600/50 hover:bg-black/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-lg border flex items-center justify-center text-2xl shadow-inner ${
                        isNineVein
                          ? 'bg-gradient-to-br from-amber-950 via-yellow-900 to-amber-950 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)] animate-pulse'
                          : isPill
                            ? 'bg-cyan-950/40 border-cyan-600/50'
                            : 'bg-amber-950/40 border-amber-600/50'
                      }`}>
                        {item.icon || (isPill ? '💊' : '📜')}
                      </div>
                      {typeof item.quantity === 'number' && (
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-zinc-950 text-[9.5px] font-mono font-bold text-amber-300 border border-amber-700/60 shadow">
                          x{item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-serif font-bold text-xs text-zinc-100 truncate">
                          {item.name}
                        </span>
                        {isNineVein && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-serif font-extrabold bg-gradient-to-r from-amber-500 to-yellow-300 text-stone-950 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse">
                            🌟 9 VĂN • 100% THÀNH CÔNG
                          </span>
                        )}
                        {!isNineVein && isHighVein && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-serif font-bold bg-purple-950 text-purple-300 border border-purple-500/50">
                            ✨ {veinCount} Đan Văn (+15%)
                          </span>
                        )}
                        {item.grade && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {item.grade}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-zinc-400 font-serif line-clamp-2">
                        {item.description}
                      </p>

                      {/* Thông số gia trì */}
                      <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono">
                        {item.baseSuccessRateBonus && (
                          <span className="text-emerald-400 font-bold">
                            +{Math.round(item.baseSuccessRateBonus * 100)}% Tỷ Lệ
                          </span>
                        )}
                        {item.powerValue && item.effectType === 'reduce_spirit_stones' && (
                          <span className="text-sky-400 font-bold">
                            Giảm {Math.round(item.powerValue * 100)}% Linh Thạch
                          </span>
                        )}
                        {item.effectType === 'prevent_backlash' && (
                          <span className="text-amber-400 font-bold">
                            🛡️ Chặn 100% Phản Phệ
                          </span>
                        )}
                        {item.effectType === 'cleanse_inner_demon' && (
                          <span className="text-emerald-400 font-bold">
                            🧘 Triệt Tiêu Đan Độc
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(isSelected ? null : itemId);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition shrink-0 cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-amber-950/80 hover:text-amber-200 border border-amber-900/40'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã Khảm</span>
                      </>
                    ) : (
                      <span>Khảm Nạp</span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-amber-900/40 bg-black/40 flex justify-between items-center">
          {selectedId && (
            <button
              onClick={() => onSelect(null)}
              className="text-xs font-serif text-rose-400 hover:text-rose-300 transition cursor-pointer underline underline-offset-4"
            >
              Gỡ Khảm Nạp
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-serif font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
