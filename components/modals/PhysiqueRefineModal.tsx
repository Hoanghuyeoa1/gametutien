import React from 'react';
import { Flame, X, Sparkles } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { getRefinementCost, REFINEMENT_STAGES_ORDER } from '@/lib/physique-data';

export interface PhysiqueRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  onBodyRefine: () => void;
}

export const PhysiqueRefineModal: React.FC<PhysiqueRefineModalProps> = ({
  isOpen,
  onClose,
  player,
  onBodyRefine
}) => {
  if (!isOpen || !player.physique) return null;

  const currentPhysique = player.physique;
  const currentStage = currentPhysique.refinementStage || 'Đoạn Cốt';
  const currentLevel = currentPhysique.refinementLevel || 1;
  const currentExp = currentPhysique.refinementExp || 0;
  const maxExp = currentPhysique.maxRefinementExp || 100;
  const cost = getRefinementCost(currentStage, currentLevel);
  const ownedDan = player.inventory?.pills?.find(p => p.id === 'pill_khi_huyet')?.quantity || 0;
  const ownedTinhHuyet = player.tinhHuyetYeuThu || 0;
  const canAfford = ownedDan >= cost.khiHuyetDanCost && ownedTinhHuyet >= cost.tinhHuyetCost && player.linhThach >= cost.linhThachCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-xl w-full p-6 rounded-2xl border-2 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.35)] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-200 to-yellow-200">
              TÔI THỂ RÈN THÂN • LUYỆN THỂ ĐẠO THÂN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-rose-300 transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông tin Thể Chất hiện tại */}
        <div className="bg-gradient-to-br from-rose-950/40 via-[#0e0e15] to-[#120f18] p-4 rounded-xl border border-rose-800/40 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-serif font-bold text-rose-200">
                  {currentPhysique.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded border font-mono bg-rose-950 text-rose-300 border-rose-600/50 shadow-sm">
                  {currentPhysique.grade}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 italic mt-1 font-serif">
                "{currentPhysique.specialEffect}"
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400">Gia trì Bản Thể:</span>
              <div className="text-[11px] font-mono text-rose-400 font-bold">
                HP +{currentPhysique.hpBonusPercent}% • Công +{currentPhysique.damageBonusPercent}%
              </div>
              <div className="text-[10px] font-mono text-sky-400">
                Thủ +{currentPhysique.defenseBonusPercent}% • Bạo +{currentPhysique.critDamageBonus || 0}%
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-300/90 leading-relaxed border-t border-rose-900/30 pt-2 font-serif">
            {currentPhysique.description}
          </p>
        </div>

        {/* 4 Đại Cảnh Giới Tôi Thể */}
        <div className="space-y-2">
          <div className="text-xs font-serif font-bold text-amber-300 flex items-center justify-between">
            <span>Tứ Đại Cảnh Giới Tôi Thể:</span>
            <span className="text-rose-400 font-mono">
              {currentStage} • Tầng {currentLevel}/9
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-serif font-medium">
            {REFINEMENT_STAGES_ORDER.map((stg, i) => {
              const currIdx = REFINEMENT_STAGES_ORDER.indexOf(currentStage);
              const isCurrent = stg === currentStage;
              const isPassed = i < currIdx;
              return (
                <div
                  key={stg}
                  className={`p-2 rounded-lg border transition ${
                    isCurrent
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.3)] font-bold'
                      : isPassed
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <div className="text-[9px] font-mono text-zinc-400">Tầng {i + 1}</div>
                  <div>{stg}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thanh tiến độ rèn thân */}
        <div className="bg-[#0b0b10] p-3 rounded-xl border border-zinc-800/80 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between items-center text-zinc-300">
            <span>Khí Huyết Tôi Thể:</span>
            <span className="text-rose-400 font-bold">
              {currentExp} / {maxExp} EXP
            </span>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-rose-950">
            <div
              className="bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              style={{ width: `${Math.min(100, Math.floor((currentExp / maxExp) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 pt-0.5">
            <span>Rèn gân đúc cốt</span>
            <span>{currentLevel === 9 ? 'Xung Kích Đại Cảnh Giới!' : `Mỗi lần rèn: +25 EXP`}</span>
          </div>
        </div>

        {/* Yêu cầu tài nguyên tôi thể */}
        <div className="space-y-3">
          <div className="bg-[#0f0e15] p-3.5 rounded-xl border border-rose-900/30 space-y-2">
            <span className="text-xs font-serif font-bold text-amber-300">
              Tài Nguyên Cần Dùng Để Tôi Luyện:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className={`p-2 rounded border ${ownedDan >= cost.khiHuyetDanCost ? 'bg-zinc-900/80 border-zinc-700 text-zinc-200' : 'bg-red-950/40 border-red-800 text-red-300'}`}>
                <div className="text-[10px] text-zinc-400">Khí Huyết Đan:</div>
                <div className="font-bold">{cost.khiHuyetDanCost} viên (Có: {ownedDan})</div>
              </div>
              <div className={`p-2 rounded border ${ownedTinhHuyet >= cost.tinhHuyetCost ? 'bg-zinc-900/80 border-zinc-700 text-zinc-200' : 'bg-red-950/40 border-red-800 text-red-300'}`}>
                <div className="text-[10px] text-zinc-400">Tinh Huyết Boss:</div>
                <div className="font-bold">{cost.tinhHuyetCost} giọt (Có: {ownedTinhHuyet})</div>
              </div>
              <div className={`p-2 rounded border ${player.linhThach >= cost.linhThachCost ? 'bg-zinc-900/80 border-zinc-700 text-zinc-200' : 'bg-red-950/40 border-red-800 text-red-300'}`}>
                <div className="text-[10px] text-zinc-400">Linh Thạch:</div>
                <div className="font-bold">{cost.linhThachCost} LT (Có: {player.linhThach})</div>
              </div>
            </div>
          </div>

          {/* Thông điệp giác ngộ / thức tỉnh */}
          <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-800/30 text-[11px] text-amber-200/90 font-serif leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Khi rèn luyện đạt <strong>Tầng 9 Đỉnh Phong</strong> của mỗi đại cảnh giới, vận chuyển linh lực xung kích sẽ có xác suất <strong>Tiến Hóa / Thức Tỉnh Thể Chất Thượng Cổ</strong> (Hoang Cổ Thánh Thể, Tiên Thiên Đạo Thể, Hỗn Độn Thể, Thuần Dương Vô Cực Thể, Cửu U Minh Thể)!
            </span>
          </div>

          <button
            onClick={onBodyRefine}
            disabled={!canAfford}
            className={`w-full py-3 rounded-xl font-serif font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
              canAfford
                ? 'bg-gradient-to-r from-rose-800 via-red-700 to-amber-700 hover:brightness-110 text-white border border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>
              {canAfford ? 'Tôi Thể Rèn Đạo Thân (Hấp Thu Dược Lực & Tinh Huyết)' : 'Chưa Đủ Tài Nguyên Tôi Thể'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
