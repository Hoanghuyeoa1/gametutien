import React from 'react';
import { Sprout, X, Clock, Coins } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  createDefaultLinhDien,
  LINH_DIEN_LEVELS,
  HERB_SEEDS,
  calculateGrowthDuration,
  calculateYieldCount
} from '@/lib/garden-data';

export interface PlantSeedModalProps {
  isOpen: boolean;
  selectedPlotId: number | null;
  onClose: () => void;
  player: PlayerStats;
  onPlantSeed: (plotId: number, seedId: string) => void;
}

export const PlantSeedModal: React.FC<PlantSeedModalProps> = ({
  isOpen,
  selectedPlotId,
  onClose,
  player,
  onPlantSeed
}) => {
  if (!isOpen || selectedPlotId === null) return null;

  const curLinhDien = player.linhDien || createDefaultLinhDien();
  const curInfo = LINH_DIEN_LEVELS[curLinhDien.level] || LINH_DIEN_LEVELS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-2xl w-full p-6 rounded-2xl border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.35)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200">
              GIEO TRỒNG LINH DƯỢC • Ô ĐẤT #{selectedPlotId + 1}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-emerald-300 transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Linh Điền trạng thái hiện tại */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-[#0e1511] to-[#111815] p-3.5 rounded-xl border border-emerald-800/40 flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-emerald-300">
                {curInfo.name} (Cấp {curLinhDien.level})
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                +{curLinhDien.yieldBonusPercent}% Sản Lượng
              </span>
              {curLinhDien.speedBonusPercent > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800 font-mono">
                  +{curLinhDien.speedBonusPercent}% Tốc Độ
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-serif mt-1">
              {curInfo.description}
            </p>
          </div>
          <div className="text-right shrink-0 pl-3">
            <span className="text-[10px] text-zinc-400 font-mono block">Linh Thạch Hiện Có:</span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {player.linhThach.toLocaleString()} LT
            </span>
          </div>
        </div>

        {/* Danh sách các loại Hạt Giống */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-serif font-bold text-emerald-300">
            <span>Chọn Linh Chủng Gieo Trồng:</span>
            <span className="text-[10px] text-zinc-400 font-mono">
              8 Đại Linh Thảo Dược Viên
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {HERB_SEEDS.map((seed) => {
              const isCompanionStationed = Boolean(curLinhDien.stationedCompanionId || player.companionsState?.stationedGardenCompanionId);
              const durationSec = calculateGrowthDuration(seed.growthDurationSeconds, curLinhDien.speedBonusPercent, isCompanionStationed);
              const minYield = calculateYieldCount(seed.baseYield, curLinhDien.yieldBonusPercent, isCompanionStationed);
              const canAfford = player.linhThach >= seed.costLinhThach;

              const minutes = Math.floor(durationSec / 60);
              const seconds = durationSec % 60;
              const timeText = minutes > 0 ? `${minutes}p${seconds > 0 ? ` ${seconds}s` : ''}` : `${seconds}s`;

              return (
                <div
                  key={seed.id}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between space-y-2.5 ${
                    canAfford
                      ? 'bg-[#0f1412] hover:bg-[#141b18] border-emerald-900/40 hover:border-emerald-600/50'
                      : 'bg-[#121215] border-zinc-800/80 opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="font-serif font-bold text-xs text-emerald-200">
                          {seed.name}
                        </div>
                        <div className="text-[10px] text-emerald-400/80 font-mono">
                          Thu hoạch: {seed.herbName}
                        </div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono bg-emerald-950/70 text-emerald-300 border-emerald-700/50 shrink-0">
                        {seed.grade}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-serif leading-relaxed line-clamp-2">
                      {seed.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono">
                    <div className="space-y-0.5 text-[10px]">
                      <div className="text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-400" />
                        <span>Trưởng thành: <strong className="text-teal-300">{timeText}</strong></span>
                      </div>
                      <div className="text-zinc-400 flex items-center gap-1">
                        <Sprout className="w-3 h-3 text-emerald-400" />
                        <span>Dự kiến: <strong className="text-emerald-300">~{minYield} cọng</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => onPlantSeed(selectedPlotId, seed.id)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-800 to-teal-700 hover:brightness-110 text-emerald-100 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3 h-3 text-amber-300" />
                      <span>{seed.costLinhThach} LT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
