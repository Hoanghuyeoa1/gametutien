// components/dashboard/left/DivinationFateModal.tsx
import React, { useState } from 'react';
import { Sparkles, Crown, RotateCcw, X, AlertTriangle, CheckCircle2, RefreshCw, Flame } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  HEXAGRAM_CONFIGS,
  rollDailyDivination,
  canDivinateToday,
  getDivinationRerollCost,
  performFateReroll
} from '@/lib/divination-data';
import { DESTINY_REROLL_PILL_ID } from '@/lib/destiny-data';
import { getSectProfile } from '@/lib/sect-data';
import { getFateTierInfo } from './types';

export interface DivinationFateModalProps {
  player: PlayerStats;
  onClose: () => void;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
  onShowToast?: (msg: string) => void;
}

export const DivinationFateModal: React.FC<DivinationFateModalProps> = ({
  player,
  onClose,
  onUpdatePlayer,
  onAddLog,
  onShowToast
}) => {
  const [isDivining, setIsDivining] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);
  const [coinFlipping, setCoinFlipping] = useState(false);
  const fateTier = getFateTierInfo(player.khiVan);

  // 1. Gieo Quẻ Thiên Cơ
  const handleDivinateRoll = () => {
    setIsDivining(true);
    setCoinFlipping(true);

    setTimeout(() => {
      const newDivination = rollDailyDivination(player.khiVan);
      const updatedPlayer: PlayerStats = {
        ...player,
        dailyDivination: newDivination
      };

      if (onUpdatePlayer) {
        onUpdatePlayer(updatedPlayer);
      }

      const hexCfg = HEXAGRAM_CONFIGS[newDivination.hexagram];
      if (onShowToast) {
        onShowToast(`☯️ Gieo quẻ Thiên Cơ: [${hexCfg.name} - ${hexCfg.hexagramName}]!`);
      }
      if (onAddLog) {
        onAddLog(
          `☯️ Thiên Cơ Bát Quái: [${hexCfg.name}]`,
          `Quẻ tượng: "${hexCfg.hexagramName}". Đạo ngôn: "${hexCfg.poetry}". ${hexCfg.description}`,
          hexCfg.id === 'hung' || hexCfg.id === 'dai_hung' ? 'danger' : 'special'
        );
      }

      setCoinFlipping(false);
      setIsDivining(false);
    }, 700);
  };

  // 2. Thuật Nghịch Thiên Cải Mệnh
  const handleRerollFateMethod = (method: 'pill' | 'sect' | 'linh_thach') => {
    setIsRerolling(true);
    setTimeout(() => {
      const res = performFateReroll(player, method);
      if (res.success) {
        if (onUpdatePlayer) {
          onUpdatePlayer(res.updatedPlayer);
        }
        if (onShowToast) {
          onShowToast(res.message);
        }
        if (onAddLog && res.updatedPlayer.dailyDivination) {
          const cfg = HEXAGRAM_CONFIGS[res.updatedPlayer.dailyDivination.hexagram];
          onAddLog(
            '🌟 Nghịch Thiên Cải Mệnh',
            res.message + ` Quẻ mới: [${cfg.name} - ${cfg.hexagramName}]. Vận mệnh đã xoay chuyển!`,
            'special'
          );
        }
      } else {
        if (onShowToast) {
          onShowToast(res.message);
        }
      }
      setIsRerolling(false);
    }, 500);
  };

  return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f0e17] border border-amber-600/60 rounded-2xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-amber-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center border border-amber-400/60 shadow-inner">
                  <span className="text-lg">☯️</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-200 text-sm sm:text-base flex items-center gap-1.5">
                    THIÊN CƠ BÁT QUÁI • ĐOÁN MỆNH
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-serif">
                    Gieo quẻ âm dương định phúc họa, nghịch thiên cải mệnh xoay vần càn khôn.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Khí Vận & Cướp Đoạt Tổng Quan */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/50 border border-amber-800/30 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400 font-serif flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Khí Vận Bản Thân
                </span>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-amber-300 font-bold text-base">{player.khiVan}</span>
                  <span className={`text-[9px] font-serif font-bold px-1.5 py-0.5 rounded border ${fateTier.badgeClass}`}>
                    [{fateTier.label}]
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500 font-serif">Vô hạn hạn mức • Quyết định cơ duyên & tỉ lệ quẻ Cát</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/50 border border-amber-800/30 flex flex-col justify-between">
                <span className="text-[10px] text-zinc-400 font-serif flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> Đã Cướp Đoạt
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-emerald-400 font-bold text-base">+{player.stolenFatePoints || 0}</span>
                  <span className="text-zinc-500 text-[10px]">điểm</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-serif">Đoạt từ Thiên Kiêu & Trấn Ma Tháp</span>
              </div>
            </div>

            {/* Vùng Lật Quẻ / Quẻ Mệnh Hiện Tại */}
            {coinFlipping ? (
              <div className="py-8 px-4 rounded-xl bg-black/60 border border-amber-500/40 text-center space-y-4 shadow-inner">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-950/80 flex items-center justify-center text-amber-300 font-serif font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-spin">
                    Càn
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-950/80 flex items-center justify-center text-amber-300 font-serif font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-spin" style={{ animationDirection: 'reverse' }}>
                    Khôn
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-950/80 flex items-center justify-center text-amber-300 font-serif font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-spin">
                    Khảm
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-serif font-bold text-amber-300 animate-pulse">
                    Đang tung 3 đồng tiền Càn Khôn Thông Bảo...
                  </p>
                  <p className="text-[10px] text-zinc-400 font-serif italic">
                    "Âm dương tương thôi nhi sinh biến hóa, thần cơ mạc trắc!"
                  </p>
                </div>
              </div>
            ) : player.dailyDivination?.hexagram ? (
              (() => {
                const hexCfg = HEXAGRAM_CONFIGS[player.dailyDivination.hexagram];
                const isBad = hexCfg.id === 'hung' || hexCfg.id === 'dai_hung';

                return (
                  <div className={`p-4 rounded-xl bg-gradient-to-b ${hexCfg.bgGradient} border ${hexCfg.borderClass} space-y-3 shadow-lg relative overflow-hidden`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base sm:text-lg font-serif font-bold ${hexCfg.color}`}>
                            {hexCfg.name}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded border font-mono ${hexCfg.badgeClass}`}>
                            {hexCfg.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-serif font-bold text-zinc-200 mt-0.5">
                          {hexCfg.hexagramName}
                        </h4>
                      </div>

                      <div className="text-right text-[10px] font-mono text-zinc-400">
                        <div>Đổi quẻ: {player.dailyDivination.rerollCount || 0} lần</div>
                      </div>
                    </div>

                    {/* Câu Thơ Quẻ Mệnh */}
                    <p className="text-xs text-amber-200/90 font-serif italic bg-black/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                      "{hexCfg.poetry}"
                    </p>

                    <p className="text-[11px] text-zinc-300 leading-relaxed font-serif">
                      {hexCfg.description}
                    </p>

                    {/* Danh sách Buff / Debuff Ngày */}
                    <div className="bg-black/50 p-3 rounded-lg border border-white/10 space-y-1.5 text-xs">
                      <div className="text-amber-300 font-serif font-bold text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hiệu Ứng Gia Trì / Họa Sát Hôm Nay:</span>
                      </div>
                      <div className="space-y-1">
                        {hexCfg.buffs.map((b, idx) => (
                          <div
                            key={idx}
                            className={`text-[11px] font-mono flex items-start gap-1.5 ${
                              b.includes('Tăng') || b.includes('Bảo hộ') || b.includes('Giảm 1') || b.includes('Giảm 2')
                                ? 'text-emerald-300'
                                : 'text-rose-400 font-bold'
                            }`}
                          >
                            <span>•</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nút Gieo Quẻ Mới nếu đã qua ngày */}
                    {canDivinateToday(player.dailyDivination.lastDivinedAt) && (
                      <button
                        onClick={handleDivinateRoll}
                        disabled={isDivining}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-serif font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isDivining ? 'animate-spin' : ''}`} />
                        <span>Gieo Quẻ Thiên Cơ Ngày Mới (Miễn Phí)</span>
                      </button>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="p-6 rounded-xl bg-black/50 border border-dashed border-amber-600/40 text-center space-y-3">
                <span className="text-3xl block">🪙</span>
                <div>
                  <h4 className="font-serif font-bold text-amber-200 text-sm">Hôm Nay Chưa Gieo Quẻ Thiên Cơ</h4>
                  <p className="text-[11px] text-zinc-400 font-serif mt-1">
                    Gieo 1 quẻ mỗi ngày để nhận buff tăng 30% tốc độ tu luyện, bảo đảm kho báu Bí Cảnh và tăng tỉ lệ đột phá!
                  </p>
                </div>
                <button
                  onClick={handleDivinateRoll}
                  disabled={isDivining}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white font-serif font-bold text-xs transition cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.4)] flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Khai Trận Gieo Quẻ Thiên Cơ</span>
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* THUẬT NGHỊCH THIÊN CẢI MỆNH (ĐỔI QUẺ TẨY HUNG) */}
            {/* ======================================================== */}
            {(() => {
              const costs = getDivinationRerollCost(player);
              const curHex = player.dailyDivination?.hexagram;
              const isBad = curHex === 'hung' || curHex === 'dai_hung';

              return (
                <div className="p-3.5 rounded-xl bg-[#090a10] border border-amber-900/40 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <h4 className="font-serif font-bold text-amber-200 text-xs sm:text-sm">
                        THUẬT NGHỊCH THIÊN CẢI MỆNH
                      </h4>
                    </div>
                    {isBad ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-600/60 font-mono animate-pulse">
                        Vận Rủi Cần Tẩy Trừ!
                      </span>
                    ) : (
                      <span className="text-[9px] text-zinc-500 font-mono">
                        Chắc chắn Cát Vận
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-400 font-serif leading-relaxed">
                    Dùng bí thuật tế thiên chuyển hóa số mệnh! Tẩy sạch toàn bộ trạng thái Hung / Đại Hung, cam kết chuyển hóa thành quẻ <strong className="text-emerald-300">Trung Cát</strong>, <strong className="text-yellow-300">Thượng Cát</strong> hoặc <strong className="text-amber-300">Đại Cát</strong>.
                  </p>

                  <div className="space-y-2 pt-1">
                    {/* Cách 1: Dùng Cải Mệnh Đan */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-serif font-bold text-amber-300 text-[11px] flex items-center gap-1">
                          <span>Cách 1: Tế Luyện [Cải Mệnh Đan]</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          Tiêu hao: 1 Cải Mệnh Đan • Sở hữu: <strong className={costs.hasPill ? 'text-emerald-400' : 'text-rose-400'}>{costs.pillCount}/1</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRerollFateMethod('pill')}
                        disabled={!costs.hasPill || isRerolling}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition shrink-0 ${
                          costs.hasPill && !isRerolling
                            ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-sm'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                        }`}
                      >
                        {isRerolling ? 'Đang Tế Đan...' : 'Tế Đan Đổi Vận'}
                      </button>
                    </div>

                    {/* Cách 2: Nhờ Trưởng Lão Tông Môn */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-serif font-bold text-indigo-300 text-[11px] flex items-center gap-1">
                          <span>Cách 2: Trưởng Lão Hộ Mệnh Trận</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          Tiêu hao: 500 Cống Hiến • Hiện có: <strong className={costs.canSect ? 'text-emerald-400' : 'text-rose-400'}>{costs.sectContrib.toLocaleString()}/500</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRerollFateMethod('sect')}
                        disabled={!costs.canSect || isRerolling}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition shrink-0 ${
                          costs.canSect && !isRerolling
                            ? 'bg-indigo-700 hover:bg-indigo-600 text-white cursor-pointer shadow-sm'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                        }`}
                      >
                        {isRerolling ? 'Đang Khởi Trận...' : 'Nhờ Trưởng Lão'}
                      </button>
                    </div>

                    {/* Cách 3: Dùng Hạ Phẩm Linh Thạch */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="font-serif font-bold text-emerald-300 text-[11px] flex items-center gap-1">
                          <span>Cách 3: Tế Thiên Đổi Vận Linh Thạch</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          Tiêu hao: {costs.linhThachCost.toLocaleString()} LT • Hiện có: <strong className={costs.canLinhThach ? 'text-emerald-400' : 'text-rose-400'}>{player.linhThach.toLocaleString()}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRerollFateMethod('linh_thach')}
                        disabled={!costs.canLinhThach || isRerolling}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition shrink-0 ${
                          costs.canLinhThach && !isRerolling
                            ? 'bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer shadow-sm'
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                        }`}
                      >
                        {isRerolling ? 'Đang Tế Thiên...' : 'Tế Thiên Đổi Vận'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
  );
};
