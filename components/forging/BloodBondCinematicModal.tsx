// components/forging/BloodBondCinematicModal.tsx
// Modal hoat anh dien anh: "Chan Huyet Dung Hop & Loi The Khi Linh"
// 100% Strict TypeScript, Tailwind CSS, Phong cach Co Phong Tien Hiep

import React, { useEffect, useState } from 'react';
import {
  Flame,
  Shield,
  Zap,
  Sparkles,
  Sword,
  Droplet,
  CheckCircle2,
  X
} from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';

export interface BloodBondCinematicModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentName?: string;
  ownerName?: string;
}

export const BloodBondCinematicModal: React.FC<BloodBondCinematicModalProps> = ({
  isOpen,
  onClose,
  equipmentName = 'Bản Mệnh Kiếm',
  ownerName = 'Đạo Hữu'
}) => {
  const [animationPhase, setAnimationPhase] = useState<'falling' | 'impact' | 'revealed'>('falling');

  useEffect(() => {
    if (!isOpen) {
      setAnimationPhase('falling');
      return;
    }

    // Sound effect on open
    try {
      audioEngine.playSFX('breakthrough');
    } catch (_) {
      try {
        audioEngine.playSFX('thunder');
      } catch (_) {
        /* no-op */
      }
    }

    // Sequence timer:
    // 0ms -> falling
    // 800ms -> impact & lightning surge
    // 1600ms -> seal revealed & oath
    const t1 = setTimeout(() => {
      setAnimationPhase('impact');
      try {
        audioEngine.playSFX('thunder');
      } catch (_) {
        /* no-op */
      }
    }, 800);

    const t2 = setTimeout(() => {
      setAnimationPhase('revealed');
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-stone-950 via-[#18090e] to-black border-2 border-rose-600/80 shadow-[0_0_60px_rgba(225,29,72,0.4)] p-6 sm:p-8 text-center space-y-6 overflow-hidden">
        {/* Ambient mystic red glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-950/40 rounded-full blur-3xl pointer-events-none" />

        {/* Nút đóng góc trên */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-stone-900/60 border border-stone-800 hover:bg-stone-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* CINEMATIC ANIMATION STAGE: Giọt chân huyết rơi vào thân kiếm */}
        <div className="relative h-44 flex flex-col items-center justify-center overflow-hidden">
          {/* Kiếm trung tâm */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Giọt máu rơi */}
            {animationPhase === 'falling' && (
              <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce">
                <div className="w-5 h-5 rounded-full bg-gradient-to-b from-red-400 via-rose-600 to-rose-900 shadow-[0_0_20px_rgba(244,63,94,1)] ring-2 ring-rose-300/80 flex items-center justify-center">
                  <Droplet className="w-3.5 h-3.5 text-white fill-rose-500" />
                </div>
                <div className="w-0.5 h-8 bg-gradient-to-b from-rose-500/80 to-transparent mt-0.5" />
              </div>
            )}

            {/* Vòng sóng chấn động khi máu chạm kiếm */}
            {(animationPhase === 'impact' || animationPhase === 'revealed') && (
              <div className="absolute -top-1 w-16 h-16 rounded-full border-2 border-rose-500/80 animate-ping pointer-events-none" />
            )}

            {/* Biểu tượng Kiếm Thần Binh */}
            <div className={`p-4 rounded-2xl border transition-all duration-700 relative ${
              animationPhase === 'revealed'
                ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.6)] scale-110'
                : animationPhase === 'impact'
                ? 'bg-rose-950/40 border-rose-600/80 shadow-[0_0_25px_rgba(225,29,72,0.4)] scale-105'
                : 'bg-black/60 border-stone-800 scale-100'
            }`}>
              <Sword className={`w-14 h-14 transition-colors duration-500 ${
                animationPhase === 'revealed'
                  ? 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]'
                  : animationPhase === 'impact'
                  ? 'text-rose-500'
                  : 'text-zinc-500'
              }`} />

              {/* Tia chớp huyết sắc chạy dọc mạch dẫn linh */}
              {(animationPhase === 'impact' || animationPhase === 'revealed') && (
                <>
                  <Zap className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                  <Zap className="w-4 h-4 text-rose-400 absolute bottom-1 -left-1 animate-pulse" />
                  <Sparkles className="w-5 h-5 text-rose-300 absolute top-1 -left-2 animate-bounce" />
                </>
              )}
            </div>

            {/* Chùm rễ huyết mạch tỏa ra chân kiếm */}
            <div className="mt-2 text-[10px] font-mono text-rose-400/90 tracking-widest uppercase">
              {animationPhase === 'falling' && '🩸 Chân Huyết Giáng Lâm...'}
              {animationPhase === 'impact' && '⚡ Huyết Mạch Quán Thông Thân Kiếm!'}
              {animationPhase === 'revealed' && '✨ Huyết Khế Hoàn Tất • Bản Mệnh Đồng Nhất'}
            </div>
          </div>
        </div>

        {/* TIÊU ĐỀ & TRIỆN ẤN ĐỎ CHÓI */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="font-serif text-lg sm:text-xl font-black text-rose-200 tracking-wider flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              <span>KÝ KẾT HUYẾT KHẾ THÀNH CÔNG</span>
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            </h2>
            <p className="text-xs text-zinc-400 font-serif">
              Thần binh <span className="text-amber-300 font-bold">[{equipmentName}]</span> đã dung nạp chân huyết của tu sĩ <span className="text-rose-300 font-bold">{ownerName}</span>
            </p>
          </div>

          {/* Triện ấn đỏ chói */}
          <div className="pt-1">
            <div className="inline-block px-5 py-2.5 rounded-xl border-2 border-rose-500 bg-gradient-to-r from-rose-950 via-red-950 to-rose-950 text-rose-200 font-serif text-base sm:text-lg font-black tracking-widest shadow-[0_0_30px_rgba(244,63,94,0.6)] transform -rotate-1 select-none animate-pulse">
              【HUYẾT KHẾ BẢN MỆNH • BẤT PHỤ CHI KHÍ】
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
              (+30% Lực Chiến, Miễn Tước Khí)
            </div>
          </div>
        </div>

        {/* LỜI THỀ KHÍ LINH (CALLIGRAPHY OATH) */}
        <div className="p-4 rounded-xl bg-black/60 border border-rose-900/60 relative">
          <div className="text-xs sm:text-sm font-serif italic text-amber-200/95 leading-relaxed tracking-wide">
            &quot;Chân huyết dung hợp, từ nay sinh tử có nhau, vạn kiếp không rời!&quot;
          </div>
          <div className="text-[10px] text-zinc-500 font-serif mt-1">
            — Khí Linh Bản Mệnh Lời Thề Khắc Cốt —
          </div>
        </div>

        {/* DANH SÁCH THẦN LỰC ĐẠT ĐƯỢC */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-center">
            <div className="text-emerald-400 font-bold">+30%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Toàn Lực Chiến</div>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-center">
            <div className="text-rose-400 font-bold">Miễn Tước Khí</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Bản Mệnh Bất Diệt</div>
          </div>
          <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-center">
            <div className="text-amber-400 font-bold">-5 Năm</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Đồng Hóa Thọ Nguyên</div>
          </div>
        </div>

        {/* NÚT HOÀN TẤT */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 hover:from-rose-600 hover:to-rose-600 text-white font-serif text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
        >
          [LĨNH NGỘ BẢN MỆNH THẦN BINH • NHẬP ĐẠO]
        </button>
      </div>
    </div>
  );
};
