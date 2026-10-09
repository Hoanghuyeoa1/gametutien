// components/dashboard/left/FourAttributesCard.tsx
import React from 'react';
import { Heart, BookOpen, Compass, Activity, Sparkles, CheckCircle2, Feather, Eye, Shield } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { HEXAGRAM_CONFIGS } from '@/lib/divination-data';
import { getMaxStatLimit, getStatCapDescription, ATTRIBUTE_MILESTONE_PERKS } from '@/lib/attribute-perks';
import { FateTierInfo } from './types';

export interface FourAttributesCardProps {
  player: PlayerStats;
  fateTier: FateTierInfo;
  onOpenDivinationModal: () => void;
}

export const FourAttributesCard: React.FC<FourAttributesCardProps> = ({
  player,
  fateTier,
  onOpenDivinationModal
}) => {
  return (
    <>
        {(() => {
          const statCap = getMaxStatLimit(player.currentRealm || 0);
          const statCapDesc = getStatCapDescription(player.currentRealm || 0);
          const isDongCanUnlocked = (player.canCot || 0) >= 80;
          const isNhatNiemUnlocked = (player.ngoTinh || 0) >= 80;
          const isThienMenhUnlocked = (player.khiVan || 0) >= 80;
          const isBatDongUnlocked = (player.tamCanh || 0) >= 90;

          return (
            <div className="space-y-2.5 pt-2 border-t border-amber-900/30">
              <div className="flex justify-between items-center text-xs font-serif font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-amber-500" /> TỨ ĐẠI THUỘC TÍNH
                </span>
                <span
                  className="text-[10px] font-mono text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50 cursor-help flex items-center gap-1"
                  title={statCapDesc}
                >
                  <span>Trần:</span>
                  <span className="font-bold text-amber-300">{statCap}</span>
                </span>
              </div>

              {/* Căn Cốt */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400/90 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" /> Căn Cốt
                    {isDongCanUnlocked && (
                      <span
                        className="text-[9px] px-1 py-0.2 rounded border bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-serif font-bold animate-pulse"
                        title="Đồng Cân Thiết Cốt: +5% Miễn Thương vĩnh viễn"
                      >
                        🛡️ +5% MT
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-emerald-300 text-xs">
                    {player.canCot}<span className="text-zinc-500 text-[10px]">/{statCap}</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(3, (player.canCot / statCap) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Ngộ Tính */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-sky-400/90 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-sky-400" /> Ngộ Tính
                    {isNhatNiemUnlocked && (
                      <span
                        className="text-[9px] px-1 py-0.2 rounded border bg-sky-950/70 border-sky-500/60 text-sky-300 font-serif font-bold animate-pulse"
                        title="Nhất Niệm Thông Thiên: Giảm 15% Tu Vi cần thiết khi đột phá"
                      >
                        🧠 -15% TV
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-sky-300 text-xs">
                    {player.ngoTinh}<span className="text-zinc-500 text-[10px]">/{statCap}</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(3, (player.ngoTinh / statCap) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Khí Vận */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-400/90 flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Khí Vận:
                    </span>
                    <span className="font-mono font-bold text-amber-300">{player.khiVan}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-serif font-bold ${fateTier.badgeClass}`}>
                      [{fateTier.label}]
                    </span>
                    {isThienMenhUnlocked && (
                      <span
                        className="text-[9px] px-1 py-0.2 rounded border bg-amber-950/70 border-amber-500/60 text-amber-300 font-serif font-bold animate-pulse"
                        title="Thiên Mệnh Chi Tử: Nhân đôi tỷ lệ gặp Tàng Bảo Các & Dị Bảo Roguelite"
                      >
                        ⭐ x2 Bí Cảnh
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Huy hiệu quẻ mệnh Thiên Cơ */}
                    {player.dailyDivination?.hexagram ? (
                      (() => {
                        const hCfg = HEXAGRAM_CONFIGS[player.dailyDivination.hexagram];
                        return (
                          <button
                            onClick={onOpenDivinationModal}
                            className={`text-[9px] px-1.5 py-0.5 rounded border font-serif font-bold transition flex items-center gap-0.5 cursor-pointer hover:scale-105 active:scale-95 shadow-sm ${hCfg.badgeClass}`}
                            title="Bấm để xem Bát Quái Thiên Cơ & Nghịch Thiên Cải Mệnh"
                          >
                            <span>[{hCfg.badgeText}]</span>
                          </button>
                        );
                      })()
                    ) : (
                      <button
                        onClick={onOpenDivinationModal}
                        className="text-[9px] px-1.5 py-0.5 rounded border border-amber-500/60 bg-amber-950/70 text-amber-300 font-serif font-bold transition flex items-center gap-0.5 cursor-pointer hover:scale-105 active:scale-95 shadow-sm animate-pulse"
                        title="Hôm nay chưa gieo quẻ Thiên Cơ! Bấm để gieo quẻ"
                      >
                        <span>[Gieo Quẻ ✦]</span>
                      </button>
                    )}

                    {Boolean(player.stolenFatePoints && player.stolenFatePoints > 0) && (
                      <span className="text-[9px] text-amber-400/90 ml-0.5 font-bold" title={`Đã cướp đoạt +${player.stolenFatePoints} Khí Vận vĩnh viễn từ Thiên Kiêu`}>
                        (+{player.stolenFatePoints})
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden ${player.khiVan >= statCap ? fateTier.glowClass : ''}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${fateTier.barClass}`}
                    style={{ width: `${Math.min(100, Math.max(3, (player.khiVan / statCap) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Tâm Cảnh */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-400/90 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-purple-400" /> Tâm Cảnh
                    {isBatDongUnlocked && (
                      <span
                        className="text-[9px] px-1 py-0.2 rounded border bg-purple-950/70 border-purple-500/60 text-purple-300 font-serif font-bold animate-pulse"
                        title="Bất Động Minh Vương: Miễn 100% Tâm Ma tiểu cảnh giới"
                      >
                        🧘 Miễn Tâm Ma
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-purple-300 text-xs">
                    {player.tamCanh}<span className="text-zinc-500 text-[10px]">/{statCap}</span>
                  </span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(3, (player.tamCanh / statCap) * 100))}%` }}
                  />
                </div>
              </div>

              {/* MỐC ĐỘT BIẾN BỊ ĐỘNG (Milestone Perks HUD) */}
              <div className="pt-2 mt-2 border-t border-amber-900/25 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-serif font-bold text-amber-300/90">
                  <span className="flex items-center gap-1">
                    <span className="text-amber-400">✦</span> ĐẶC QUYỀN ĐỘT BIẾN
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400">
                    {ATTRIBUTE_MILESTONE_PERKS.filter(p => (player[p.statKey] || 0) >= p.requiredValue).length}/4 Mở
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ATTRIBUTE_MILESTONE_PERKS.map(perk => {
                    const curVal = player[perk.statKey] || 0;
                    const isUnlocked = curVal >= perk.requiredValue;
                    return (
                      <div
                        key={perk.id}
                        title={`${perk.name} (${perk.statName} ≥ ${perk.requiredValue}): ${perk.description}`}
                        className={`p-1.5 rounded border transition-all text-[10px] leading-tight flex flex-col justify-between ${
                          isUnlocked
                            ? `${perk.badgeClass} shadow-[0_0_8px_rgba(245,158,11,0.12)] ring-1 ring-amber-500/20`
                            : 'bg-zinc-950/50 border-zinc-800/60 text-zinc-500 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-serif font-bold">
                          <span className="flex items-center gap-1 truncate">
                            <span>{perk.icon}</span>
                            <span className={isUnlocked ? perk.colorClass : 'text-zinc-400'}>{perk.name}</span>
                          </span>
                          <span className="font-mono text-[9px] shrink-0 ml-1">
                            {isUnlocked ? '✓' : `${curVal}/${perk.requiredValue}`}
                          </span>
                        </div>
                        <div className="text-[9px] mt-0.5 opacity-90 truncate font-sans">
                          {perk.shortDesc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
};
