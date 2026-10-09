// components/modals/HeavenPhenomenonModal.tsx
// Modal Dị Tượng Thiên Địa & Vinh Danh Thiên Đạo Đạo Cơ phong cách Tiên Hiệp Cổ Phong
// 100% Strict TypeScript, Tailwind CSS, Responsive Mobile & Desktop

import React from 'react';
import { Sparkles, Crown, Bell, Flame, Check, Shield, Zap, X } from 'lucide-react';
import { InnateTalentDefinition } from '@/lib/types/dao-foundation';

export interface HeavenPhenomenonData {
  talent: InnateTalentDefinition;
  phenomenonName: string;
  phenomenonDesc: string;
}

export interface HeavenPhenomenonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HeavenPhenomenonData | null;
  realmName?: string;
}

export const HeavenPhenomenonModal: React.FC<HeavenPhenomenonModalProps> = ({
  isOpen,
  onClose,
  data,
  realmName
}) => {
  if (!isOpen || !data) return null;

  const { talent, phenomenonName, phenomenonDesc } = data;
  const gradeTitle = talent.realmOrigin ? `Thiên Đạo ${talent.realmOrigin}` : 'Thiên Đạo Đạo Cơ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/90 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden select-none">
      {/* HIỆU ỨNG TỬ KHÍ ĐÔNG LAI & HÀO QUANG CUỘN TRÀO */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-r from-purple-600/30 via-amber-500/25 to-purple-800/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-purple-950/40 to-transparent" />
      </div>

      {/* KHUNG VĂN BIA THIÊN ĐẠO */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#211438] via-[#140b24] to-[#0c0517] border-2 border-amber-400/90 rounded-3xl shadow-[0_0_80px_rgba(251,191,36,0.5)] overflow-hidden text-center">
        {/* Nút đóng góc trên */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-zinc-400 hover:text-zinc-100 transition z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── 1. ĐỒ HỌA HOA SEN VÀNG & CHUÔNG ĐẠI ĐẠO ───────── */}
        <div className="pt-6 sm:pt-8 pb-3 px-4 relative flex flex-col items-center justify-center">
          {/* Vòng hào quang Thái Cực / Bát Quái */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Vòng hào quang xoay tròn */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300/60 animate-[spin_12s_linear_infinite]" />
            <div className="absolute -inset-2 rounded-full border border-purple-400/40 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-t from-amber-500/20 via-yellow-400/30 to-purple-600/20 blur-sm animate-pulse" />

            {/* Biểu tượng Sen Vàng Hư Không */}
            <div className="relative text-5xl sm:text-6xl drop-shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-bounce duration-1000 select-none">
              🪷
            </div>
          </div>

          {/* Tiếng chuông đại đạo ngân vang */}
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/60 text-amber-300 text-[11px] font-serif shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="tracking-widest uppercase font-bold">
              ĐẠI ĐẠO THẦN CHUNG • CỬU TIẾNG NGÂN VANG
            </span>
          </div>
        </div>

        {/* ── 2. VĂN BIA THIÊN ĐẠO GIÁNG CHỈ ───────── */}
        <div className="px-5 sm:px-8 py-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {/* Header Vinh Danh */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase font-mono tracking-widest text-purple-300">
              ⚡ THIÊN ĐỊA CỘNG MINH • VẠN ĐẠO TRIỀU BÁI ⚡
            </div>
            <h1 className="text-lg sm:text-2xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
              {phenomenonName}
            </h1>
          </div>

          {/* Văn chỉ Thiên Đạo */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-amber-500/40 space-y-2 text-xs sm:text-sm font-serif leading-relaxed text-amber-100 shadow-inner">
            <p className="font-bold text-amber-200 text-sm sm:text-base">
              "Chúc mừng tu sĩ nghịch thiên thành công, đúc thành 【{gradeTitle}】, chấn động Cửu Thiên Thập Địa!"
            </p>
            <p className="text-zinc-300 text-xs italic font-sans leading-normal">
              "{phenomenonDesc}"
            </p>
          </div>

          {/* ── 3. HUY HIỆU THIÊN PHÚ ẨN BỪNG SÁNG ───────── */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-purple-950/60 to-amber-950/70 border-2 border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.4)] space-y-2 relative overflow-hidden">
            {/* Ambient ánh sáng */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-amber-500/40 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-serif font-bold text-amber-200 uppercase tracking-wider">
                  THIÊN PHÚ ẨN THỨC TỈNH
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-serif font-black text-[9px] uppercase tracking-wider shadow-sm">
                Vĩnh Viễn
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-base sm:text-lg font-serif font-black text-amber-300 drop-shadow">
                ✨ {talent.name}
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                {talent.description}
              </div>
              <p className="text-[11px] text-zinc-300 font-serif italic pt-1 leading-snug">
                "{talent.lore}"
              </p>
            </div>

            <div className="pt-1.5 border-t border-amber-500/30 flex items-center justify-center gap-1.5 text-[10.5px] font-serif text-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Thiên phú đã hòa nhập đan điền • Đạo cơ vĩnh cố • Vạn kiếp bất hủ</span>
            </div>
          </div>
        </div>

        {/* ── 4. NÚT HÀNH ĐỘNG: CẢM TẠ THIÊN ÂN ───────── */}
        <div className="p-4 sm:p-5 border-t border-amber-500/40 bg-[#0e071a] flex items-center justify-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-w-[280px] py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-serif font-black text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:brightness-110 active:scale-98 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Cảm Tạ Thiên Ân • Tiếp Tục Tu Hành</span>
          </button>
        </div>
      </div>
    </div>
  );
};
