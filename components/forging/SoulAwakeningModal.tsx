// components/forging/SoulAwakeningModal.tsx
// Modal hoạt ảnh thức tỉnh Thần Thú & Bung tỏa hào quang Phong Hồn Thành Công
// 100% Strict TypeScript, Tailwind CSS, Hiệu ứng Tiên Hiệp Tráng Lệ

import React, { useEffect } from 'react';
import { Equipment } from '@/lib/types/items';
import { SoulType } from '@/lib/types/soul-infusion';
import { SPIRIT_STAGE_NAMES, SPIRIT_PERSONALITY_NAMES } from '@/lib/soul-infusion-logic';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import { audioEngine } from '@/lib/audio-engine';
import {
  Sparkles,
  Zap,
  Shield,
  Flame,
  Award,
  Sword,
  CheckCircle2,
  X
} from 'lucide-react';

export interface SoulAwakeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapon: Equipment | null;
}

const BEAST_AWAKENING_CONFIG: Record<SoulType, {
  avatar: string;
  roar: string;
  awakenedPrefix: string;
  bannerColor: string;
  glowColor: string;
  auraGradient: string;
}> = {
  hac_giao: {
    avatar: '🐉',
    roar: 'NGAO~~~! Long ngâm chín tầng trời! Hắc Thủy quy vị, nhiếp phục vạn ma!',
    awakenedPrefix: 'Long Ngâm • ',
    bannerColor: 'from-cyan-900/90 via-blue-950/90 to-cyan-900/90 border-cyan-500/60',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    auraGradient: 'from-cyan-500/20 via-blue-600/30 to-purple-600/20'
  },
  hoa_phuong: {
    avatar: '🦚',
    roar: 'TIÊU TIÊU~~~! Hót vang cửu thiên! Dục hỏa trùng sinh, đốt rụi vạn dặm!',
    awakenedPrefix: 'Phượng Hỏa • ',
    bannerColor: 'from-rose-900/90 via-orange-950/90 to-rose-900/90 border-rose-500/60',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    auraGradient: 'from-rose-500/20 via-orange-600/30 to-amber-600/20'
  },
  bach_ho: {
    avatar: '🐯',
    roar: 'HỐNG~~~! Bạch Hổ lâm uy! Canh Kim sát phạt, kiếm ý xé rách thương khung!',
    awakenedPrefix: 'Canh Kim • ',
    bannerColor: 'from-amber-900/90 via-yellow-950/90 to-amber-900/90 border-amber-500/60',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    auraGradient: 'from-amber-500/20 via-yellow-600/30 to-red-600/20'
  },
  huyen_vu: {
    avatar: '🐢',
    roar: 'ẦM ẦM~~~! Huyền Vũ thức tỉnh! Bắc Minh vô tận, vạn pháp bất xâm!',
    awakenedPrefix: 'Bắc Minh • ',
    bannerColor: 'from-emerald-900/90 via-teal-950/90 to-emerald-900/90 border-emerald-500/60',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    auraGradient: 'from-emerald-500/20 via-teal-600/30 to-cyan-600/20'
  },
  co_kiem_tu: {
    avatar: '⚔️',
    roar: 'KENG~~~! Vạn Kiếm Quy Tông! Kiếm tâm thông thiên, thượng cổ bất diệt!',
    awakenedPrefix: 'Cổ Kiếm • ',
    bannerColor: 'from-purple-900/90 via-violet-950/90 to-purple-900/90 border-purple-500/60',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    auraGradient: 'from-purple-500/20 via-indigo-600/30 to-pink-600/20'
  }
};

export const SoulAwakeningModal: React.FC<SoulAwakeningModalProps> = ({
  isOpen,
  onClose,
  weapon
}) => {
  const soul = weapon?.infusedSoul;
  const config = soul ? BEAST_AWAKENING_CONFIG[soul.soulType] : null;

  // Phát âm thanh tiếng sấm sét và đột phá khi mở modal
  useEffect(() => {
    if (isOpen) {
      try {
        audioEngine.playSFX('thunder', false, 0.7);
        setTimeout(() => {
          audioEngine.playSFX('breakthrough', true, 0.85);
        }, 300);
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen || !weapon || !soul || !config) {
    return null;
  }

  const awakenedWeaponName = soul.awakenedName || `${config.awakenedPrefix}${weapon.name}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Vòng sáng hào quang bung tỏa nền */}
      <div className={`absolute w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-r ${config.auraGradient} blur-3xl pointer-events-none animate-pulse`} />

      {/* Khung chính Modal Thức Tỉnh */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#160d2e] via-[#0f091f] to-[#080512] border-2 border-amber-500/60 p-5 sm:p-6 shadow-[0_0_50px_rgba(251,191,36,0.35)] overflow-hidden text-center space-y-4">
        {/* Nút đóng góc phải */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-purple-800/60 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tiêu đề Chấn Động Thiên Địa */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>THỨC TỈNH THẦN BINH KHÍ LINH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            PHONG HỒN ĐOẠT PHÁCH THÀNH CÔNG
          </h2>
        </div>

        {/* Linh Thú Avatar & Hiệu ứng lơ lửng */}
        <div className="relative py-2 flex flex-col items-center justify-center">
          {/* Vòng tròn phù văn xoay quanh linh thú */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-amber-500/50 border-dashed animate-spin-slow flex items-center justify-center absolute" />
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-purple-950 via-slate-900 to-amber-950/60 border-2 border-amber-400 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(251,191,36,0.5)] animate-bounce-slow">
            {config.avatar}
          </div>
        </div>

        {/* Tiếng gầm xuất thế của Thần Thú */}
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-amber-200 font-serif italic text-xs leading-relaxed shadow-inner">
          "{config.roar}"
        </div>

        {/* Danh tính Thần Binh sau khi thức tỉnh */}
        <div className="p-3.5 rounded-xl bg-black/50 border border-amber-600/40 space-y-2 text-left">
          <div className="flex justify-between items-center flex-wrap gap-1">
            <span className="text-[11px] font-mono text-zinc-400">Thần Binh Xuất Thế:</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono border border-amber-500/50 bg-amber-950/50 text-amber-300 font-bold">
              {SPIRIT_STAGE_NAMES[soul.evolutionStage]}
            </span>
          </div>

          <div className="font-serif font-bold text-amber-200 text-sm sm:text-base flex items-center gap-2">
            <Sword className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{awakenedWeaponName}</span>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-mono text-zinc-300 pt-1">
            <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-700/50 text-purple-200">
              Chân Hồn: {soul.soulName} ({soul.element})
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/50 text-indigo-200">
              Tính Cách: {SPIRIT_PERSONALITY_NAMES[soul.personality]}
            </span>
          </div>
        </div>

        {/* Danh sách Thần Hiệu & Proc Buffs */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/50 via-black to-purple-950/50 border border-purple-800/40 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-purple-200">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Thần Hiệu Độc Bản: {soul.currentProc.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/40 p-2 rounded border border-purple-950">
            <div>
              <span className="text-zinc-500">Xác Suất Kích Hoạt: </span>
              <span className="text-amber-400 font-bold">
                {Math.round(soul.currentProc.triggerChance * 100)}%
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Cường Độ Hiệu Lực: </span>
              <span className="text-cyan-400 font-bold">
                {soul.currentProc.potencyValue * 100}%
              </span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-300 font-serif leading-relaxed">
            {soul.currentProc.description}
          </p>
        </div>

        {/* Nút Lĩnh Ngộ Hoàn Tất */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-stone-950 font-serif font-bold text-sm shadow-[0_0_20px_rgba(251,191,36,0.4)] transition cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-stone-900" />
          <span>Lĩnh Ngộ Thần Binh • Quy Nhập Thức Hải</span>
        </button>
      </div>
    </div>
  );
};
