// components/forging/HeavenTemperedRelicModal.tsx
// Modal hoạt ảnh thần binh thăng hoa hào quang sét bạc & tím thẫm khi hoàn thành lôi kiếp
// 100% Strict TypeScript, Tailwind CSS, Cổ Phong Tiên Hiệp

import React, { useEffect } from 'react';
import {
  Zap,
  Sparkles,
  Sword,
  Shield,
  CheckCircle2,
  X,
  Award
} from 'lucide-react';
import { Equipment } from '@/lib/types/items';
import { audioEngine } from '@/lib/audio-engine';

export interface HeavenTemperedRelicModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapon: Equipment | null;
}

export const HeavenTemperedRelicModal: React.FC<HeavenTemperedRelicModalProps> = ({
  isOpen,
  onClose,
  weapon
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        audioEngine.playBreakthroughSuccessSound?.(1.0);
      } catch {
        // Safe audio fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !weapon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container Thần Binh Thăng Hoa */}
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-stone-950 via-[#18112c] to-stone-950 border-2 border-purple-400/80 shadow-[0_0_60px_rgba(168,85,247,0.6)] p-6 sm:p-7 overflow-hidden text-center animate-scaleUp">
        {/* Nền hoạt ảnh sét bạc SVG bung tỏa */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 500">
            <defs>
              <radialGradient id="silverBurst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#c084fc" stopOpacity="0.4" />
                <stop offset="80%" stopColor="#7e22ce" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="200" r="180" fill="url(#silverBurst)" className="animate-pulse" />
            {/* Các tia sét bạc bắn ra từ tâm */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <line
                key={deg}
                x1="250"
                y1="200"
                x2={250 + 200 * Math.cos((deg * Math.PI) / 180)}
                y2={200 + 200 * Math.sin((deg * Math.PI) / 180)}
                stroke="#e2e8f0"
                strokeWidth="1.2"
                strokeDasharray="4 8"
                opacity="0.6"
              />
            ))}
          </svg>
        </div>

        {/* Nút đóng modal */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-900/80 border border-purple-700/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-stone-800 transition cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Biểu tượng Thần Binh Thăng Hoa */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-800 via-indigo-900 to-amber-600 p-0.5 shadow-[0_0_35px_rgba(251,191,36,0.6)] animate-bounce">
              <div className="w-full h-full rounded-2xl bg-stone-950 flex items-center justify-center border border-purple-400/60">
                <Sword className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.9)]" />
              </div>
            </div>
            {/* Vòng lôi quang */}
            <div className="absolute -inset-2 rounded-2xl border-2 border-purple-400/60 animate-ping pointer-events-none" />
          </div>

          {/* Banner Tiêu Đề */}
          <div className="space-y-1 mb-4">
            <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50">
              ⚡ THIÊN LÔI HOÀN NGUYÊN • ĐẠI VIÊN MÃN ⚡
            </span>
            <h2 className="font-serif font-black text-lg sm:text-xl text-white tracking-wide mt-2">
              Khí Lôi Kiếp Hoàn Thành!
            </h2>
            <p className="text-xs text-purple-200 font-serif max-w-sm mx-auto">
              Thần binh ngạnh kháng thành công Cửu Tiêu Kiếp Lôi, lột xác đoạt thiên địa tạo hóa!
            </p>
          </div>

          {/* Danh Xưng Mới Của Thần Binh */}
          <div className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-stone-900 to-purple-950/80 border border-purple-400/60 shadow-inner mb-4">
            <span className="text-[10px] text-zinc-400 font-serif block mb-1">
              Danh Xưng Chí Tôn Mới:
            </span>
            <h3 className="font-serif font-extrabold text-base sm:text-lg text-amber-300 flex items-center justify-center gap-1.5 flex-wrap">
              <span>{weapon.name}</span>
            </h3>
            <div className="mt-1 text-[11px] font-mono text-purple-300">
              Bậc {weapon.tier || 9} • Cường hóa +{weapon.enhancement || 0}
            </div>
          </div>

          {/* 2 Dòng Thuộc Tính Cốt Lõi Được Kích Hoạt */}
          <div className="w-full space-y-2 mb-5 text-left">
            {/* Dòng 1: Lôi Sát Xuyên Giáp */}
            <div className="p-3 rounded-xl bg-stone-900/90 border border-purple-500/50 flex items-start gap-3 shadow-md">
              <div className="p-2 rounded-lg bg-purple-950 border border-purple-600/60 text-purple-300 shrink-0">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-xs">
                <div className="font-serif font-bold text-amber-300">
                  +35% Lôi Sát Xuyên Giáp
                </div>
                <div className="text-[11px] text-zinc-300 font-serif mt-0.5 leading-relaxed">
                  Đòn đánh thường giải phóng lôi điện bản nguyên, tăng thêm 35% sát thương sấm sét và bỏ qua 30% giáp hộ thể của đối thủ.
                </div>
              </div>
            </div>

            {/* Dòng 2: Thiên Lôi Tê Liệt */}
            <div className="p-3 rounded-xl bg-stone-900/90 border border-purple-500/50 flex items-start gap-3 shadow-md">
              <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-600/60 text-indigo-300 shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-xs">
                <div className="font-serif font-bold text-cyan-300">
                  20% Thiên Lôi Tê Liệt
                </div>
                <div className="text-[11px] text-zinc-300 font-serif mt-0.5 leading-relaxed">
                  20% cơ hội đánh trúng làm đối thủ lâm vào trạng thái 【Thiên Lôi Tê Liệt】, triệt để gián đoạn đòn tấn công và mất lượt hành động.
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú bảo toàn linh hồn & hợp kim */}
          <div className="text-[11px] text-emerald-400/90 font-serif mb-5 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Toàn bộ Hợp Kim, Trận Văn và Chân Hồn Khí Linh được bảo toàn 100%</span>
          </div>

          {/* Nút Tiếp Nhận Thần Binh */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl font-serif font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-purple-700 to-violet-800 hover:brightness-110 text-white border border-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>TIẾP NHẬN THẦN BINH ĐỘ KIẾP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
