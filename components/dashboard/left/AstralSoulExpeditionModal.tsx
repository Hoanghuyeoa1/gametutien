// components/dashboard/left/AstralSoulExpeditionModal.tsx
// Modal Phân Thần Du Ngoạn AFK Độc Lập cho Hệ Thống Thần Hồn

import React, { useState, useEffect } from 'react';
import { X, Compass, Clock, Sparkles, Gift, CheckCircle2 } from 'lucide-react';
import { PlayerStats, ExpeditionDestinationId } from '@/lib/types';
import {
  EXPEDITION_DESTINATIONS,
  EXPEDITION_DURATIONS,
  getSoulCultivationProgression
} from '@/lib/soul-cultivation-data';

interface AstralSoulExpeditionModalProps {
  player: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
  onStartExpedition: (destination: ExpeditionDestinationId, hours: number) => void;
  onClaimExpedition: () => void;
}

export const AstralSoulExpeditionModal: React.FC<AstralSoulExpeditionModalProps> = ({
  player,
  isOpen,
  onClose,
  onStartExpedition,
  onClaimExpedition
}) => {
  const [selectedDest, setSelectedDest] = useState<ExpeditionDestinationId>('duoc_vuong_coc');
  const [selectedHours, setSelectedHours] = useState<number>(2);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const prog = getSoulCultivationProgression(player);
  const expedition = player.soulCultivation?.expeditionState;
  const isExpeditionActive = Boolean(expedition && expedition.isActive);
  const isFinished = isExpeditionActive && expedition && now >= expedition.startTime + expedition.durationMs;

  const remainingMs = isExpeditionActive && expedition ? Math.max(0, expedition.startTime + expedition.durationMs - now) : 0;
  const remainingHours = Math.floor(remainingMs / 3600000);
  const remainingMins = Math.floor((remainingMs % 3600000) / 60000);
  const remainingSecs = Math.floor((remainingMs % 60000) / 1000);

  const formatCountdown = () => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(remainingHours)}:${pad(remainingMins)}:${pad(remainingSecs)}`;
  };

  const progressPercent = isExpeditionActive && expedition
    ? Math.min(100, Math.floor(((now - expedition.startTime) / expedition.durationMs) * 100))
    : 0;

  const currentDestCfg = EXPEDITION_DESTINATIONS[selectedDest];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cophong-card cophong-corner w-full max-w-lg flex flex-col rounded-2xl border border-purple-600/50 bg-[#0d0d15] shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-purple-900/40 flex items-center justify-between bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-indigo-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-lg shadow-inner">
              🌌
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-100 to-cyan-300">
                PHÂN THẦN DU NGOẠN
              </h3>
              <p className="text-[10px] text-zinc-400 font-serif">
                Thái Hư Huyễn Cảnh • Thám Hiểm AFK Độc Lập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung chính */}
        <div className="p-3 sm:p-4 space-y-3.5 overflow-y-auto max-h-[75vh] custom-scrollbar text-xs">
          {/* Trạng thái hiện tại nếu đang du ngoạn */}
          {isExpeditionActive && expedition ? (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-600/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{EXPEDITION_DESTINATIONS[expedition.destination as ExpeditionDestinationId]?.icon || '🌌'}</span>
                  <div>
                    <div className="font-serif font-bold text-purple-200 text-xs">
                      {EXPEDITION_DESTINATIONS[expedition.destination as ExpeditionDestinationId]?.name || expedition.destinationName}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {isFinished ? 'Đã hoàn thành chuyến thám hiểm!' : 'Thần niệm đang du hành thái hư...'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isFinished ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 font-mono text-[10px] animate-pulse">
                      ĐÃ TRỞ VỀ
                    </span>
                  ) : (
                    <div className="font-mono text-cyan-300 font-bold text-xs flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span>{formatCountdown()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thanh tiến trình */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Tiến độ hành trình:</span>
                  <span className="text-purple-300">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-purple-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Nút hành động khi kết thúc */}
              {isFinished ? (
                <button
                  onClick={() => {
                    onClaimExpedition();
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-serif font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-4 h-4" />
                  <span>Thu Hồi Phân Thần & Nhận Chiến Lợi Phẩm</span>
                </button>
              ) : (
                <div className="text-center text-[10px] text-zinc-400 italic font-serif">
                  💡 Phân thần tự động tích lũy tài nguyên mà không cản trở việc bế quan tu vi hay chiến đấu của bản thể.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Giới thiệu tính năng */}
              <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-300 font-serif leading-relaxed">
                Tách xuất một đạo thần niệm ly thể du ngoạn độc lập. Càng có nhiều điểm <strong className="text-purple-300">Thần Thức ({player.thanThuc || 10})</strong>, lượng Tu Vi và bảo vật thu về càng dồi dào!
              </div>

              {/* Bước 1: Chọn Địa Điểm */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Chọn Lộ Trình Du Ngoạn:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(Object.keys(EXPEDITION_DESTINATIONS) as ExpeditionDestinationId[]).map(key => {
                    const dest = EXPEDITION_DESTINATIONS[key];
                    const isSelected = selectedDest === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedDest(key)}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-950/60 border-purple-500 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-serif font-bold">
                            <span>{dest.icon}</span>
                            <span className={isSelected ? 'text-purple-200' : 'text-zinc-300'}>{dest.name}</span>
                          </div>
                          <p className="text-[9.5px] text-zinc-400 mt-1 leading-snug line-clamp-2 font-sans">
                            {dest.description}
                          </p>
                        </div>
                        <div className="mt-1.5 pt-1 border-t border-zinc-800/60 text-[9px] text-amber-300/90 font-mono">
                          🎁 {dest.mainDropTypes}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bước 2: Chọn Thời Gian */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Chọn Thời Gian Phân Thần:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EXPEDITION_DURATIONS.map(dur => {
                    const isSelected = selectedHours === dur.hours;
                    return (
                      <button
                        key={dur.hours}
                        onClick={() => setSelectedHours(dur.hours)}
                        className={`p-2 rounded-lg border text-center transition cursor-pointer font-mono ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 text-cyan-200 shadow-sm font-bold'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{dur.label}</div>
                        <div className="text-[9px] text-zinc-400 mt-0.5">{dur.bonusDesc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tóm tắt phần thưởng dự kiến */}
              <div className="p-2.5 rounded-lg bg-[#08080e] border border-purple-900/30 text-[10.5px] space-y-1 font-mono">
                <div className="text-zinc-400 font-serif flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Sản vật dự kiến thu hoạch:</span>
                </div>
                <div className="text-zinc-300">
                  • Địa điểm: <strong className="text-purple-300">{currentDestCfg.name}</strong> ({selectedHours} giờ)
                </div>
                <div className="text-emerald-400">
                  • Tu Vi: ~{(15000 * selectedHours * (EXPEDITION_DURATIONS.find(d => d.hours === selectedHours)?.multiplier || 1)).toLocaleString()}
                </div>
                <div className="text-amber-300">
                  • Linh Thạch: ~{(1200 * selectedHours * (EXPEDITION_DURATIONS.find(d => d.hours === selectedHours)?.multiplier || 1)).toLocaleString()}
                </div>
                <div className="text-cyan-300">
                  • Chắc chắn thu hoạch: <strong className="text-purple-200">U Hồn Thạch</strong> ({Math.max(2, Math.floor(selectedHours * 1.5))} - {Math.max(4, Math.floor(selectedHours * 3))} viên)
                </div>
              </div>

              {/* Nút Xuất Hành */}
              <button
                onClick={() => {
                  onStartExpedition(selectedDest, selectedHours);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🌌</span>
                <span>Khởi Hành Phân Thần Du Ngoạn</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
