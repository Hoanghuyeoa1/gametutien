// components/dashboard/left/DestinyCard.tsx
import React from 'react';
import { Compass, Sparkles, Zap, ShieldAlert, PlusCircle } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  DESTINY_REROLL_PILL_ID,
  DESTINY_FATES,
  getActiveDestinySynergies,
  getDestinySlotMaxCount
} from '@/lib/destiny-data';

export interface DestinyCardProps {
  player: PlayerStats;
  setShowDestinyModal: (show: boolean) => void;
}

export const DestinyCard: React.FC<DestinyCardProps> = ({
  player,
  setShowDestinyModal
}) => {
  const totalRebornTimes = player.reincarnationState?.totalRebornTimes || 0;
  const maxSlots = getDestinySlotMaxCount(player.currentRealm, totalRebornTimes);
  const destinyBoard = player.destinyBoard || {
    unlockedSlots: maxSlots,
    equippedIds: player.destiny ? [player.destiny.id] : ['pham_nhan_menh'],
    collectedIds: player.destiny ? [player.destiny.id] : ['pham_nhan_menh']
  };

  const equippedIds = destinyBoard.equippedIds || [];
  const activeSynergies = getActiveDestinySynergies(equippedIds);
  const pillCount = player.inventory?.pills?.find(p => p.id === DESTINY_REROLL_PILL_ID)?.quantity || 0;

  return (
    <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/40 space-y-2.5 relative overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-amber-400 font-serif font-bold flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          MỆNH BÀN BÁT QUÁI
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-600/40 bg-amber-950/40 text-amber-300 font-mono">
            {equippedIds.length}/{destinyBoard.unlockedSlots} Ô Khảm
          </span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${player.destiny?.badgeClass || 'text-zinc-300 border-zinc-700 bg-zinc-900'}`}>
            {player.destiny?.grade || 'Phàm Cấp'}
          </span>
        </div>
      </div>

      {/* Danh sách Ô Khảm Mệnh Cách (Destiny Slots) */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-1 gap-1.5">
          {Array.from({ length: destinyBoard.unlockedSlots }).map((_, idx) => {
            const fateId = equippedIds[idx];
            const fate = fateId ? DESTINY_FATES[fateId] : null;
            const isRebornSlot = idx === 5;

            if (fate) {
              return (
                <div
                  key={idx}
                  onClick={() => setShowDestinyModal(true)}
                  className={`p-1.5 px-2 rounded border flex items-center justify-between transition cursor-pointer group ${
                    isRebornSlot
                      ? 'bg-gradient-to-r from-purple-950/60 to-black/80 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                      : 'bg-gradient-to-r from-black/60 to-zinc-900/60 border-amber-900/40 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${isRebornSlot ? 'text-purple-400' : 'text-amber-500/70'}`}>
                      {isRebornSlot ? '🌀 #6' : `#${idx + 1}`}
                    </span>
                    <span className="text-[11px] font-serif font-bold text-amber-200 group-hover:text-amber-100 truncate">
                      {fate.name}
                    </span>
                  </div>
                  <span className={`text-[8.5px] px-1.5 py-0.2 rounded border font-mono shrink-0 ${fate.badgeClass}`}>
                    {fate.grade}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={idx}
                onClick={() => setShowDestinyModal(true)}
                className={`p-1.5 px-2 rounded border border-dashed flex items-center justify-between transition cursor-pointer text-[10px] font-mono ${
                  isRebornSlot
                    ? 'bg-purple-950/20 border-purple-600/50 text-purple-300 hover:text-purple-200'
                    : 'bg-black/30 border-zinc-800 hover:border-amber-600/40 text-zinc-500 hover:text-amber-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isRebornSlot ? (
                    <>
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="font-bold">#6 Luân Hồi Đạo Nhãn (Trống)</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3 h-3 text-zinc-600" />
                      <span>Ô Mệnh Cách #{idx + 1} (Trống)</span>
                    </>
                  )}
                </span>
                <span className={`text-[9px] italic ${isRebornSlot ? 'text-purple-400 font-bold' : 'text-zinc-600'}`}>
                  Khảm nạp
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tổ Hợp Mệnh Cách Kích Hoạt (Destiny Synergies) */}
      {activeSynergies.length > 0 ? (
        <div className="space-y-1 pt-1 border-t border-amber-900/30">
          <div className="text-[10px] text-amber-300 font-serif font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Tổ Hợp Cộng Hưởng ({activeSynergies.length}):
          </div>
          <div className="space-y-1">
            {activeSynergies.map(syn => (
              <div
                key={syn.id}
                className="p-1.5 rounded bg-gradient-to-r from-amber-950/50 via-purple-950/30 to-black/60 border border-amber-500/40 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">
                    ⚡ {syn.name}
                  </span>
                  <span className="text-[8.5px] font-mono text-emerald-300 bg-emerald-950/60 px-1 rounded border border-emerald-800/60">
                    Kích Hoạt
                  </span>
                </div>
                <div className="text-[9.5px] font-mono text-amber-200/90 leading-tight mt-0.5">
                  {syn.effectsSummary}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-1.5 rounded bg-black/40 border border-zinc-800/60 text-[9.5px] font-mono text-zinc-400 italic flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-amber-500/60 shrink-0" />
          <span>Khảm cặp Mệnh Cách tương hợp để thức tỉnh Tổ Hợp Tiên Thiên.</span>
        </div>
      )}

      {/* Footer & Nút Mở Modal Bát Quái */}
      <div className="flex items-center justify-between pt-1 border-t border-amber-900/30">
        <span className="text-[10px] font-mono text-amber-300/80 flex items-center gap-1">
          🔮 Cải Mệnh: <strong className="text-amber-300">{pillCount}</strong> viên
        </span>
        <button
          onClick={() => setShowDestinyModal(true)}
          className="px-2.5 py-1 rounded bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-700/60 text-[10px] font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Mở Mệnh Bàn</span>
        </button>
      </div>
    </div>
  );
};
