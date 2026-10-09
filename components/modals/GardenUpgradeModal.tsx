import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { createDefaultLinhDien, LINH_DIEN_LEVELS } from '@/lib/garden-data';

export interface GardenUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  onUpgradeLinhDien: () => void;
}

export const GardenUpgradeModal: React.FC<GardenUpgradeModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpgradeLinhDien
}) => {
  if (!isOpen) return null;

  const curLinhDien = player.linhDien || createDefaultLinhDien();
  const curLevel = curLinhDien.level;
  const curInfo = LINH_DIEN_LEVELS[curLevel] || LINH_DIEN_LEVELS[1];
  const isMax = curLevel >= 6;
  const nextInfo = !isMax ? LINH_DIEN_LEVELS[curLevel + 1] : null;
  const canAfford = nextInfo ? player.linhThach >= nextInfo.upgradeCostLinhThach : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-xl w-full p-6 rounded-2xl border-2 border-teal-500/50 shadow-[0_0_50px_rgba(20,184,166,0.35)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-amber-200">
              THĂNG CẤP LINH ĐIỀN • KHAI MỞ PHÚC ĐỊA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-teal-300 transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông tin Cấp Hiện Tại & Cấp Kế Tiếp */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {/* Cấp hiện tại */}
            <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-teal-400 uppercase tracking-wider font-bold">
                  Đương Tiền Cấp {curLevel}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-900/50 text-teal-300 border border-teal-700/40">
                  Hiện Tại
                </span>
              </div>
              <div className="text-sm font-serif font-bold text-teal-200">
                {curInfo.name}
              </div>
              <div className="space-y-1 text-[11px] text-zinc-300">
                <div>🌾 Ô Đất Khả Dụng: <strong className="text-teal-300">{curInfo.maxPlots} Ô</strong></div>
                <div>📈 Sản Lượng: <strong className="text-emerald-400">+{curInfo.yieldBonusPercent}%</strong></div>
                <div>⚡ Tốc Độ Sinh Trưởng: <strong className="text-teal-400">+{curInfo.speedBonusPercent}%</strong></div>
              </div>
            </div>

            {/* Cấp kế tiếp */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isMax
                ? 'bg-amber-950/20 border-amber-800/40'
                : 'bg-emerald-950/30 border-emerald-600/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                  {isMax ? 'Đỉnh Phong Thần Điền' : `Thăng Tiến Cấp ${curLevel + 1}`}
                </span>
                {!isMax && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
                    Mục Tiêu
                  </span>
                )}
              </div>
              <div className="text-sm font-serif font-bold text-amber-200">
                {isMax ? 'Huyền Hoàng Thần Điền' : nextInfo?.name}
              </div>
              {isMax ? (
                <div className="text-[11px] text-amber-300/80 font-serif italic pt-1">
                  Linh Điền đã đạt cảnh giới tối cao viễn cổ, không thể thăng cấp thêm!
                </div>
              ) : (
                <div className="space-y-1 text-[11px] text-zinc-300">
                  <div>🌾 Ô Đất Khả Dụng: <strong className="text-amber-300">{nextInfo?.maxPlots} Ô</strong> ({nextInfo && nextInfo.maxPlots > curInfo.maxPlots ? `+${nextInfo.maxPlots - curInfo.maxPlots}` : 'Tối đa'})</div>
                  <div>📈 Sản Lượng: <strong className="text-emerald-400">+{nextInfo?.yieldBonusPercent}%</strong> (+{nextInfo ? nextInfo.yieldBonusPercent - curInfo.yieldBonusPercent : 0}%)</div>
                  <div>⚡ Tốc Độ Sinh Trưởng: <strong className="text-teal-400">+{nextInfo?.speedBonusPercent}%</strong> (+{nextInfo ? nextInfo.speedBonusPercent - curInfo.speedBonusPercent : 0}%)</div>
                </div>
              )}
            </div>
          </div>

          {/* Lục Giai Linh Điền Đồ Phổ */}
          <div className="space-y-2">
            <span className="text-xs font-serif font-bold text-teal-300">
              Lục Trọng Linh Điền Cảnh Giới:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-serif">
              {Object.values(LINH_DIEN_LEVELS).map((lvl) => {
                const isCurrent = lvl.level === curLevel;
                const isPassed = lvl.level < curLevel;
                return (
                  <div
                    key={lvl.level}
                    className={`p-2 rounded-lg border transition ${
                      isCurrent
                        ? 'bg-teal-950/60 border-teal-500 text-teal-200 font-bold shadow-[0_0_10px_rgba(20,184,166,0.3)]'
                        : isPassed
                        ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400/70'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span>Cấp {lvl.level}</span>
                      {isCurrent && <span className="text-amber-400">★ Hiện tại</span>}
                      {isPassed && <span className="text-emerald-400">✓ Đạt</span>}
                    </div>
                    <div className="font-bold text-zinc-200">{lvl.name}</div>
                    <div className="text-[9px] text-zinc-400">{lvl.maxPlots} Ô • +{lvl.yieldBonusPercent}% Sản lượng</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chi phí thăng cấp & nút thực hiện */}
          {!isMax && nextInfo && (
            <div className="space-y-3 border-t border-teal-900/30 pt-3">
              <div className="bg-[#0f1412] p-3 rounded-xl border border-teal-900/40 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Tiêu hao thăng cấp:</span>
                  <span className="text-amber-300 font-bold text-sm">
                    {nextInfo.upgradeCostLinhThach.toLocaleString()} Linh Thạch
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px]">Hiện có:</span>
                  <span className={`font-bold ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                    {player.linhThach.toLocaleString()} LT
                  </span>
                </div>
              </div>

              <button
                onClick={onUpgradeLinhDien}
                disabled={!canAfford}
                className={`w-full py-3 rounded-xl font-serif font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                  canAfford
                    ? 'bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 hover:brightness-110 text-white border border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.4)]'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {canAfford
                    ? `Khai Canh Thăng Cấp [${nextInfo.name}]`
                    : `Chưa Đủ Linh Thạch (Cần ${nextInfo.upgradeCostLinhThach.toLocaleString()} LT)`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
