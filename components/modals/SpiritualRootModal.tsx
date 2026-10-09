import React from 'react';
import { Zap, X, Sparkles } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { ELEMENT_ICONS, ELEMENT_NAMES, LINH_CAN_TIERS } from '@/lib/elemental-system';

export interface SpiritualRootModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  onRootEvolve: () => void;
}

export const SpiritualRootModal: React.FC<SpiritualRootModalProps> = ({
  isOpen,
  onClose,
  player,
  onRootEvolve
}) => {
  if (!isOpen || !player.linhCan) return null;

  const currentTier = player.linhCan.tier || 1;
  const rootCostLT = currentTier * 1000;
  const ownedTayLinhDan = player.inventory?.pills?.find(p => p.id === 'pill_tay_linh')?.quantity || 0;
  const canAfford = ownedTayLinhDan >= 1 && player.linhThach >= rootCostLT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-xl w-full p-6 rounded-2xl border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.35)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200">
              THĂNG HOA LINH CĂN • TẨY TINH LỌC TẠP
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-purple-300 transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Linh căn hiện tại */}
        <div className="bg-gradient-to-br from-purple-950/40 via-[#0e0e15] to-[#140e1f] p-4 rounded-xl border border-purple-800/40 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{ELEMENT_ICONS[player.linhCan.element]}</span>
                <h4 className="text-sm font-serif font-bold text-amber-200">
                  {player.linhCan.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded border font-mono bg-purple-950 text-purple-300 border-purple-600/50 shadow-sm">
                  {player.linhCan.grade}
                </span>
              </div>
              <p className="text-xs text-purple-300 mt-1 font-serif">
                Thuộc tính Thiên Địa: <strong className="text-amber-300">{ELEMENT_NAMES[player.linhCan.element]}</strong>
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-rose-400 font-bold">
                Sát Thương: +{player.linhCan.damageBonus}%
              </div>
              <div className="text-xs text-emerald-400 font-bold">
                Tốc Độ Tu Luyện: +{player.linhCan.speedBonus}%
              </div>
            </div>
          </div>

          {/* Thanh Độ Tinh Thuần */}
          <div className="space-y-1 bg-black/40 p-2.5 rounded-lg border border-purple-900/30 font-mono text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Độ Tinh Thuần Khí Mạch:</span>
              <span className="text-purple-300 font-bold">{player.linhCan.purity || 40}% / 100%</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-purple-950">
              <div
                className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, player.linhCan.purity || 40)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 pt-0.5">
              <span>Mỗi viên Tẩy Linh Đan: +15% Tinh Thuần</span>
              <span>Đạt 100% -&gt; Thăng Phẩm Bậc Kế</span>
            </div>
          </div>
        </div>

        {/* Bảng 6 Phẩm Bậc Linh Căn */}
        <div className="space-y-2">
          <span className="text-xs font-serif font-bold text-amber-300">
            Lục Trọng Thiên Thê Linh Căn:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-[10px] font-serif">
            {LINH_CAN_TIERS.map(tier => {
              const isCurrent = tier.tier === currentTier;
              const isLower = tier.tier < currentTier;
              return (
                <div
                  key={tier.tier}
                  className={`p-2 rounded-lg border transition ${
                    isCurrent
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : isLower
                      ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400/80'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-zinc-400">Giai {tier.tier}</span>
                    {isCurrent && <span className="text-amber-400 text-[9px]">★ Hiện tại</span>}
                  </div>
                  <div className="font-bold text-amber-100">{tier.grade}</div>
                  <div className="text-[9px] text-zinc-400">{tier.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chi phí thăng hoa */}
        <div className="space-y-3">
          <div className="bg-[#0f0e15] p-3.5 rounded-xl border border-purple-900/30 space-y-2">
            <span className="text-xs font-serif font-bold text-amber-300">
              Tài Nguyên Cần Dùng:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`p-2 rounded border ${ownedTayLinhDan >= 1 ? 'bg-zinc-900/80 border-zinc-700 text-zinc-200' : 'bg-red-950/40 border-red-800 text-red-300'}`}>
                <div className="text-[10px] text-zinc-400">Cửu Khiếu Tẩy Linh Đan:</div>
                <div className="font-bold">1 viên (Có: {ownedTayLinhDan})</div>
              </div>
              <div className={`p-2 rounded border ${player.linhThach >= rootCostLT ? 'bg-zinc-900/80 border-zinc-700 text-zinc-200' : 'bg-red-950/40 border-red-800 text-red-300'}`}>
                <div className="text-[10px] text-zinc-400">Linh Thạch:</div>
                <div className="font-bold">{rootCostLT.toLocaleString()} LT (Có: {player.linhThach})</div>
              </div>
            </div>
          </div>

          {/* Hiệu quả tương khắc ngũ hành & công pháp */}
          <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-800/30 text-[11px] text-purple-200/90 font-serif leading-relaxed flex items-start gap-2">
            <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>
              Linh căn quyết định thuộc tính thần thông: Khi chiến đấu với Boss có thuộc tính bị ngươi khắc chế (ví dụ Thủy khắc Hỏa, Kim khắc Mộc), tăng <strong>+30% Sát thương</strong> và giảm <strong>20% Sát thương nhận vào</strong>! Đồng thời, trang bị Công Pháp cùng hệ sẽ kích hoạt hiệu ứng <strong>Cộng Hưởng +50% Uy Lực</strong>!
            </span>
          </div>

          <button
            onClick={onRootEvolve}
            disabled={!canAfford}
            className={`w-full py-3 rounded-xl font-serif font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              canAfford
                ? 'bg-gradient-to-r from-purple-800 via-indigo-700 to-pink-700 hover:brightness-110 text-white border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {canAfford ? 'Tẩy Lọc Tạp Chất • Thăng Hoa Linh Căn' : 'Chưa Đủ Tẩy Linh Đan Hoặc Linh Thạch'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
