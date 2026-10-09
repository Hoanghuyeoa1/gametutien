// components/forging/TribulationLightningAltar.tsx
// Đài Lôi Kiếp nung nấu sấm sét tím - Thần Binh bay lơ lửng giữa vòng xoáy kiếp lôi
// 100% Strict TypeScript, Tailwind CSS, Phong cách Cổ Phong Tiên Hiệp

import React, { useMemo } from 'react';
import {
  Zap,
  Shield,
  Sparkles,
  Flame,
  AlertCircle,
  CheckCircle2,
  Sword,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { Equipment } from '@/lib/types/items';
import { ActiveTribulationEncounter } from '@/hooks/useWeaponTribulationArrayActions';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';

export interface TribulationLightningAltarProps {
  weapon: Equipment | null;
  activeEncounter: ActiveTribulationEncounter | null;
  isProcessing: boolean;
  canTrigger: boolean;
  triggerReason?: string;
  playerQi?: number;
  onStartTribulation: () => void;
  onAbsorbStrike: () => void;
}

export const TribulationLightningAltar: React.FC<TribulationLightningAltarProps> = ({
  weapon,
  activeEncounter,
  isProcessing,
  canTrigger,
  triggerReason,
  playerQi = 3000,
  onStartTribulation,
  onAbsorbStrike
}) => {
  const isAlreadyTempered = !!weapon?.lightningTempering?.isTempered;
  const currentWave = activeEncounter ? activeEncounter.currentWave : 0;
  const totalWaves = activeEncounter ? activeEncounter.totalWaves : 3;
  const isComplete = !!activeEncounter?.isComplete;

  const qualityInfo = useMemo(() => {
    if (!weapon) return null;
    return getItemQuality(weapon.quality);
  }, [weapon]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-stone-950 via-[#130d22] to-stone-950 border border-purple-900/60 p-5 shadow-[0_0_35px_rgba(147,51,234,0.18)] overflow-hidden">
      {/* Background Ambience: Lôi vân xoáy cuộn */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-900/15 blur-2xl" />
      </div>

      {/* Header Đài Lôi Kiếp */}
      <div className="relative z-10 flex items-center justify-between pb-3.5 mb-4 border-b border-purple-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-800 to-indigo-950 border border-purple-400/50 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <Zap className="w-4 h-4 text-purple-200 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-purple-100 flex items-center gap-1.5">
              <span>Cửu Tiêu Lôi Kiếp Đài</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono">
                Tôi Luyện Thần Binh
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-serif">
              Dẫn thiên lôi cửu trọng tẩy luyện tạp chất, khắc họa lôi văn bản nguyên
            </p>
          </div>
        </div>

        {/* 3 Đèn chỉ báo sóng lôi kiếp */}
        <div className="flex items-center gap-1.5 bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-purple-900/50">
          {[1, 2, 3].map(wIndex => {
            const isPassed = currentWave > wIndex || (currentWave === 3 && isComplete);
            const isCurrent = currentWave === wIndex && !isComplete;
            return (
              <div
                key={wIndex}
                className="flex items-center gap-1"
                title={`Đợt lôi kiếp thứ ${wIndex}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 ${
                    isPassed
                      ? 'bg-emerald-500 text-stone-950 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                      : isCurrent
                      ? 'bg-amber-400 text-stone-950 animate-ping shadow-[0_0_10px_rgba(251,191,36,0.9)]'
                      : 'bg-stone-800 text-stone-500 border border-stone-700'
                  }`}
                >
                  {isPassed ? '✓' : wIndex}
                </div>
                {wIndex < 3 && <div className="w-2 h-0.5 bg-stone-800" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Altar Area: Thần binh bay lơ lửng & Vòng xoáy lôi đình SVG */}
      <div className="relative z-10 my-2 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[290px] rounded-xl bg-stone-950/70 border border-purple-900/40 p-4 overflow-hidden shadow-inner">
        {/* SVG Vòng Xoáy Lôi Kiếp & Tia Sét Nhịp Giật */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="altarVortex" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Vòng tròn xoáy bát quái linh phù */}
          <circle cx="200" cy="150" r="110" fill="url(#altarVortex)" />
          <circle
            cx="200"
            cy="150"
            r="90"
            fill="none"
            stroke="#7e22ce"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="animate-spin"
            style={{ animationDuration: '40s' }}
          />
          <circle
            cx="200"
            cy="150"
            r="125"
            fill="none"
            stroke="#a855f7"
            strokeWidth="0.8"
            strokeDasharray="8 8"
            className="animate-spin"
            style={{ animationDuration: '60s', animationDirection: 'reverse' }}
          />

          {/* Các tia sét SVG giáng xuống (khi đang trong trận lôi kiếp) */}
          {activeEncounter && !isComplete && (
            <g className="animate-pulse" style={{ animationDuration: '0.8s' }}>
              {/* Tia sét chính đánh vào trung tâm */}
              <path
                d="M 200,10 L 195,60 L 212,95 L 188,140 L 205,150 L 196,180 L 200,210"
                fill="none"
                stroke="url(#lightningGrad)"
                strokeWidth="3.5"
                filter="url(#glow)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Nhánh sét phụ tả */}
              <path
                d="M 195,60 L 160,85 L 175,115 L 155,145"
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.8"
                opacity="0.85"
                filter="url(#glow)"
                strokeLinecap="round"
              />
              {/* Nhánh sét phụ hữu */}
              <path
                d="M 212,95 L 245,120 L 230,150 L 250,175"
                fill="none"
                stroke="#fef08a"
                strokeWidth="1.8"
                opacity="0.85"
                filter="url(#glow)"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Hào quang khi hoàn thành đại viên mãn */}
          {isComplete && (
            <g className="animate-pulse" style={{ animationDuration: '1.5s' }}>
              <circle cx="200" cy="150" r="75" fill="none" stroke="#fef08a" strokeWidth="2" opacity="0.6" filter="url(#glow)" />
              <circle cx="200" cy="150" r="85" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.5" />
            </g>
          )}
        </svg>

        {/* Trung tâm: Thần Binh bay lơ lửng */}
        {weapon ? (
          <div className="relative z-10 flex flex-col items-center group cursor-pointer transition-transform duration-500 hover:scale-105">
            {/* Vòng hào quang quanh thân binh */}
            <div className={`relative p-5 rounded-2xl bg-stone-900/90 border transition-all duration-500 shadow-2xl ${
              isComplete
                ? 'border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.5)]'
                : activeEncounter
                ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.6)] animate-pulse'
                : 'border-purple-800/60 shadow-[0_0_15px_rgba(147,51,234,0.3)]'
            }`}>
              {/* Icon Thần Binh nổi bật */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-950 via-stone-900 to-indigo-950 flex items-center justify-center border border-purple-500/40">
                <Sword className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-300 ${
                  isComplete
                    ? 'text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.9)]'
                    : activeEncounter
                    ? 'text-purple-300 animate-bounce drop-shadow-[0_0_12px_rgba(192,132,252,0.8)]'
                    : 'text-purple-200'
                }`} />

                {/* Huy hiệu cấp cường hóa */}
                {weapon.enhancement > 0 && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500 text-stone-950 shadow-md">
                    +{weapon.enhancement}
                  </span>
                )}

                {/* Huy hiệu Lôi Kiếp Hoàn Thành */}
                {isAlreadyTempered && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-[9px] font-serif font-bold rounded-full bg-gradient-to-r from-purple-600 to-amber-500 text-white shadow-md border border-amber-300/60 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    <span>Lôi Kiếp Thần Binh</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thông tin tên & phẩm giai vũ khí */}
            <div className="mt-3 text-center space-y-1">
              <h4 className="font-serif font-bold text-sm text-purple-100 flex items-center justify-center gap-1.5">
                <span>{weapon.name}</span>
                {qualityInfo && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${qualityInfo.badgeClass}`}>
                    {qualityInfo.name}
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-purple-300/80 font-mono">
                {convertGradeToGiai(weapon.grade)} • Bậc {weapon.tier || 1} • Công kích +{weapon.atkBonus || weapon.powerBonus || 0}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-dashed border-purple-700/60 flex items-center justify-center text-purple-400">
              <Sword className="w-7 h-7 opacity-50" />
            </div>
            <p className="font-serif text-sm text-purple-200 font-medium">
              Chưa chọn Thần Binh để dẫn động Thiên Kiếp
            </p>
            <p className="text-xs text-zinc-500 font-serif max-w-xs">
              Vui lòng chọn vũ khí Cửu Giai (Bậc 9) hoặc mang Khí Linh Hóa Hình (Giai Đoạn 3) từ danh sách bên dưới
            </p>
          </div>
        )}
      </div>

      {/* Thông tin đợt lôi kiếp đang diễn ra / Điều kiện kích hoạt */}
      <div className="mt-4 p-3.5 rounded-xl bg-stone-900/80 border border-purple-900/50 space-y-2.5">
        {activeEncounter ? (
          <div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-serif font-bold text-purple-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeEncounter.strikeData.strikeName}</span>
              </span>
              <span className="font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/40">
                Đợt {currentWave}/{totalWaves}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-serif mt-1 leading-relaxed">
              {activeEncounter.strikeData.description}
            </p>

            {/* Thanh thuộc tính kiếp lôi */}
            <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-purple-800/30 text-[11px] font-mono">
              <div className="bg-stone-950/60 p-2 rounded-lg border border-purple-900/30">
                <span className="text-zinc-400 block text-[10px] font-serif">⚡ Uy Lực Sét:</span>
                <span className="text-amber-300 font-bold">
                  {activeEncounter.strikeData.lightningPower.toLocaleString()}
                </span>
              </div>
              <div className="bg-stone-950/60 p-2 rounded-lg border border-purple-900/30">
                <span className="text-zinc-400 block text-[10px] font-serif">🎯 Tỷ Lệ Tôi Khí:</span>
                <span className="text-emerald-400 font-bold">
                  {activeEncounter.strikeData.temperSuccessRate}%
                </span>
              </div>
              <div className="bg-stone-950/60 p-2 rounded-lg border border-purple-900/30">
                <span className="text-zinc-400 block text-[10px] font-serif">🛡️ Hộ Thể Linh Lực:</span>
                <span className="text-cyan-300 font-bold">
                  {playerQi.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-serif font-bold text-purple-200">
                Quy Tắc Dẫn Động Khí Lôi Kiếp:
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-serif">
                Thần binh phải đạt <strong>Cửu Giai (Bậc 9)</strong> hoặc được phong ấn <strong>Khí Linh Hóa Hình (Giai Đoạn 3)</strong> trở lên mới đủ linh tính chịu đựng 3 đợt lôi kiếp. Sau khi vượt qua, vũ khí vĩnh viễn nhận tiền tố <strong className="text-amber-300">【Cửu Tiêu Lôi Kiếp】</strong> (+35% Lôi Sát xuyên giáp, 20% Tê Liệt).
              </p>
              {!canTrigger && triggerReason && (
                <div className="p-2 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-[11px] flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{triggerReason}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: Dẫn Động hoặc Ngạnh Kháng Từng Đợt */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
        {!activeEncounter ? (
          <button
            onClick={onStartTribulation}
            disabled={!weapon || !canTrigger || isProcessing}
            className={`w-full py-3 px-4 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer ${
              !weapon || !canTrigger || isProcessing
                ? 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-purple-800 via-violet-700 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white border border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:brightness-110 active:scale-[0.98]'
            }`}
          >
            <Zap className={`w-4 h-4 ${canTrigger ? 'text-amber-300 animate-pulse' : ''}`} />
            <span>
              {isAlreadyTempered
                ? 'VŨ KHÍ ĐÃ ĐỘ KIẾP ĐẠI THÀNH'
                : '⚡ DẪN ĐỘNG THIÊN LÔI KIẾP (3 ĐỢT)'}
            </span>
          </button>
        ) : isComplete ? (
          <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/60 text-emerald-200 font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>✨ KHÍ LÔI KIẾP ĐẠI VIÊN MÃN - THẦN BINH THĂNG HOA THÀNH CÔNG!</span>
          </div>
        ) : (
          <button
            onClick={onAbsorbStrike}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl cursor-pointer ${
              isProcessing
                ? 'bg-purple-950/80 text-purple-400 border border-purple-700/50 cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-amber-600 via-purple-700 to-violet-800 hover:brightness-110 text-white border border-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.45)] active:scale-[0.98]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-200 animate-bounce" />
            <span>
              {isProcessing
                ? 'ĐANG NGẠNH KHÁNG LÔI ĐÌNH...'
                : `⚡ DẪN LÔI TÔI KHÍ (ĐỢT ${currentWave}/${totalWaves})`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
