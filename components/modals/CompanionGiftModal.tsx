import React from 'react';
import { X, Gift } from 'lucide-react';
import { PlayerStats, CompanionDefinition } from '@/lib/types';
import { calculateGiftAffinity } from '@/lib/companions-data';

export type GiftFilterType = 'all' | 'pill' | 'herb' | 'ore' | 'equipment' | 'manual';

export interface CompanionGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftingCompanion: CompanionDefinition | null;
  player: PlayerStats;
  giftFilter: GiftFilterType;
  setGiftFilter: (filter: GiftFilterType) => void;
  onSendGift: (
    type: 'pill' | 'herb' | 'ore' | 'equipment' | 'manual',
    item: any,
    count: number
  ) => void;
}

export const CompanionGiftModal: React.FC<CompanionGiftModalProps> = ({
  isOpen,
  onClose,
  giftingCompanion,
  player,
  giftFilter,
  setGiftFilter,
  onSendGift
}) => {
  if (!isOpen || !giftingCompanion) return null;

  const inv = player.inventory || { pills: [], herbs: [], ores: [], equipments: [], manuals: [] };
  const list: { type: 'pill' | 'herb' | 'ore' | 'equipment' | 'manual'; item: any }[] = [];

  if (giftFilter === 'all' || giftFilter === 'pill') {
    (inv.pills || []).filter(p => p.quantity > 0).forEach(p => list.push({ type: 'pill', item: p }));
  }
  if (giftFilter === 'all' || giftFilter === 'herb') {
    (inv.herbs || []).filter(h => h.quantity > 0).forEach(h => list.push({ type: 'herb', item: h }));
  }
  if (giftFilter === 'all' || giftFilter === 'ore') {
    (inv.ores || []).filter(o => o.quantity > 0).forEach(o => list.push({ type: 'ore', item: o }));
  }
  if (giftFilter === 'all' || giftFilter === 'equipment') {
    (inv.equipments || []).forEach(e => list.push({ type: 'equipment', item: e }));
  }
  if (giftFilter === 'all' || giftFilter === 'manual') {
    (inv.manuals || []).forEach(m => list.push({ type: 'manual', item: m }));
  }

  const filterTabs: { key: GiftFilterType; label: string }[] = [
    { key: 'all', label: 'Tất Cả' },
    { key: 'pill', label: 'Đan Dược' },
    { key: 'herb', label: 'Dược Liệu' },
    { key: 'ore', label: 'Khoáng Thạch' },
    { key: 'equipment', label: 'Pháp Bảo' },
    { key: 'manual', label: 'Bí Kíp' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-lg w-full p-5 rounded-2xl border-2 border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.3)] space-y-4 max-h-[85vh] flex flex-col">
        {/* Header modal */}
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${giftingCompanion.avatarGradient} flex items-center justify-center text-lg shadow-sm shrink-0`}>
              {giftingCompanion.avatar}
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-rose-200">
                Tặng Quà Cho {giftingCompanion.name}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                {giftingCompanion.title} • {giftingCompanion.origin}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông tin sở thích */}
        <div className="p-2.5 bg-rose-950/20 rounded-xl border border-rose-900/30 text-xs text-rose-200/90 font-serif leading-relaxed flex items-center justify-between gap-2">
          <span>{giftingCompanion.favoriteDescription}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-700/50 font-mono shrink-0">
            x2 Hảo Cảm
          </span>
        </div>

        {/* Filter vật phẩm */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar text-[10px] font-serif">
          {filterTabs.map(f => (
            <button
              key={f.key}
              onClick={() => setGiftFilter(f.key)}
              className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap cursor-pointer ${
                giftFilter === f.key
                  ? 'bg-rose-950/70 text-rose-200 border-rose-600 font-bold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Danh sách vật phẩm có thể tặng */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[350px]">
          {list.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 italic font-serif space-y-2">
              <Gift className="w-8 h-8 text-zinc-600 mx-auto" />
              <p>Không có vật phẩm phù hợp trong Túi Trữ Vật để tặng nàng.</p>
            </div>
          ) : (
            list.map((entry, idx) => {
              const { type, item } = entry;
              const isFav = giftingCompanion.favoriteGifts.includes(type);
              const affInfo = calculateGiftAffinity(giftingCompanion, type, item.grade, item.name);

              return (
                <div
                  key={`${type}_${item.id || idx}`}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isFav
                      ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700/70'
                      : 'bg-[#0f0e14] border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-serif font-bold text-zinc-200 truncate">
                        {item.name}
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {item.grade || 'Phàm'}
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-amber-950/40 text-amber-300 border border-amber-800/30">
                        x{item.quantity || 1}
                      </span>
                      {isFav && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-700/50 font-serif flex items-center gap-0.5">
                          ❤️ Sở Thích (x2)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1 font-serif">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onSendGift(type, item, 1)}
                      className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/50 text-[10px] font-serif font-bold transition cursor-pointer"
                      title={`Tăng +${affInfo.finalPoints} Hảo Cảm`}
                    >
                      Tặng 1 (+{affInfo.finalPoints})
                    </button>
                    {(item.quantity || 1) >= 5 && (
                      <button
                        onClick={() => onSendGift(type, item, 5)}
                        className="px-2 py-1 rounded bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-700/50 text-[10px] font-serif font-bold transition cursor-pointer"
                        title={`Tăng +${affInfo.finalPoints * 5} Hảo Cảm`}
                      >
                        Tặng 5 (+{affInfo.finalPoints * 5})
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
