// components/modals/PillHarvestModal.tsx
// Modal Xuất Lò Đan Dược Cổ Phong (Pill Harvest Showcase)
// Hiển thị viên đan bay lượn, các tầng đan văn ngưng tụ, dược tính biến dị và Dị Hỏa trợ lực (hoặc cảnh báo Nổ Lò)

import React from 'react';
import { Sparkles, Flame, CheckCircle, Dna, ShieldAlert, Award, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PillCraftingResult } from '@/lib/types/pill-veins';
import { PILL_VEIN_CONFIG, calculateCompoundingToxicity } from '@/lib/pill-vein-logic';
import { HEAVENLY_FLAMES_REGISTRY, DEFAULT_MORTAL_FLAME } from '@/lib/heavenly-flame-logic';
import { PILL_DEFINITIONS_MAP } from '@/lib/pill-tier-data';

export interface PillHarvestModalProps {
  harvestResult: PillCraftingResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PillHarvestModal: React.FC<PillHarvestModalProps> = ({
  harvestResult,
  isOpen,
  onClose
}) => {
  if (!isOpen || !harvestResult) return null;

  const { veinCount, basePillName, veinMetadata, isExploded } = harvestResult;
  const veinInfo = PILL_VEIN_CONFIG[veinCount];
  const isNineVeins = veinCount === 9;
  const mutation = veinMetadata.mutation;

  const flameConfig = veinMetadata.flameId
    ? HEAVENLY_FLAMES_REGISTRY[veinMetadata.flameId] || DEFAULT_MORTAL_FLAME
    : null;

  // Tính toán đan độc và độ thanh lọc
  const pillDef = PILL_DEFINITIONS_MAP[harvestResult.basePillId];
  const baseToxicity = pillDef?.effects?.toxicityPercent ?? 20;

  const toxOutcome = calculateCompoundingToxicity({
    baseToxicity,
    veinTier: veinCount,
    flameBurnRatio: (veinMetadata.toxicityBurnPercent || 0) / 100
  });

  const actualToxicity = veinCount === 9 ? 0 : Math.round(toxOutcome.finalToxicity);
  const reductionPercent = baseToxicity > 0
    ? Math.min(100, Math.max(0, Math.round(((baseToxicity - actualToxicity) / baseToxicity) * 100)))
    : 100;
  const purityPercent = 100 - (baseToxicity > 0 ? Math.min(100, Math.round((actualToxicity / baseToxicity) * 100)) : 0);

  // Trường hợp NỔ LÒ do Dị Hỏa bạo liệt
  if (isExploded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#240d0a] via-[#140807] to-[#0a0403] border border-red-600/60 p-6 text-center shadow-[0_0_50px_rgba(239,68,68,0.35)] space-y-5 overflow-hidden">
          {/* Hào quang đỏ rực bạo liệt */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-red-600 pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-amber-600 pointer-events-none animate-pulse" />

          {/* Tiêu đề Nổ Lò */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
              <span>Biến Cố Đan Đạo • Lò Luyện Bạo Liệt</span>
              <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
            </div>
            <h2 className="text-xl font-serif font-black text-red-200">
              {basePillName}
            </h2>
            <div className="inline-block px-3 py-0.5 rounded-full border border-red-500/60 bg-red-950/80 text-red-300 text-[11px] font-serif font-bold">
              💥 Mẻ Đan Biến Thành Phế Đan
            </div>
          </div>

          {/* Biểu tượng lò luyện bốc khói tro tàn */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-red-500/40 animate-spin duration-1000" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-stone-900 via-red-950 to-zinc-900 border border-red-700/60 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <Flame className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
          </div>

          {/* Thông tin phòng vệ bảo toàn nguyên liệu */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-red-900/50 text-left space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-red-300 font-serif font-bold border-b border-red-900/60 pb-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Nguyên Nhân: Dị Hỏa Cuồng Bạo Mất Kiểm Soát</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
              Hỏa lực bạo liệt vượt quá ngưỡng dung nạp của đan đỉnh, mẻ đan đã cháy khét thành Phế Đan.
            </p>
            <div className="p-2 rounded bg-amber-950/40 border border-amber-600/40 text-amber-200 flex items-center gap-2 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Cơ chế bảo vệ:</strong> Đã thu hồi an toàn <strong className="text-emerald-400">50% Thảo Dược</strong> gốc vào Túi Trữ Vật.
              </span>
            </div>
          </div>

          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-amber-700 to-red-800 hover:brightness-110 text-white font-serif font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Dọn Dẹp Tro Tàn & Đóng Lò</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#181310] via-[#0f0c0b] to-[#080706] border p-6 text-center shadow-2xl space-y-4 overflow-hidden"
        style={{
          borderColor: isNineVeins ? '#eab308' : veinInfo.glowColor,
          boxShadow: `0 0 35px ${isNineVeins ? 'rgba(234, 179, 8, 0.35)' : 'rgba(168, 85, 247, 0.25)'}`
        }}
      >
        {/* Hào quang nền xoay nhẹ */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"
          style={{ backgroundColor: veinInfo.glowColor }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"
          style={{ backgroundColor: isNineVeins ? '#f59e0b' : '#6366f1' }}
        />

        {/* Tiêu đề Modal */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Đan Đạo Dị Tượng • Xuất Lò Thành Công</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          </div>
          <h2 className="text-xl font-serif font-black text-amber-100 flex items-center justify-center gap-2">
            <span>{basePillName}</span>
          </h2>
          <div
            className="inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-serif font-bold"
            style={{
              borderColor: veinInfo.glowColor,
              color: veinInfo.glowColor,
              backgroundColor: `${veinInfo.glowColor}15`
            }}
          >
            {veinInfo.title} • {veinInfo.rankName}
          </div>
        </div>

        {/* Animation Viên Đan và Vòng Sáng Đan Văn */}
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          {/* Các vòng đan văn đồng tâm */}
          {Array.from({ length: Math.min(9, Math.max(1, veinCount)) }).map((_, idx) => {
            const size = 56 + idx * 8;
            return (
              <div
                key={idx}
                className="absolute rounded-full border border-dashed transition-all duration-700 animate-spin"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderColor: isNineVeins ? 'rgba(234, 179, 8, 0.6)' : `${veinInfo.glowColor}50`,
                  animationDuration: `${12 - idx}s`
                }}
              />
            );
          })}

          {/* Viên ngọc đan trung tâm */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-500 scale-105 ${
              isNineVeins
                ? 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.8)]'
                : 'bg-gradient-to-tr from-zinc-700 via-amber-800 to-yellow-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            }`}
          >
            <Flame className={`w-7 h-7 ${isNineVeins ? 'text-amber-950 animate-bounce' : 'text-amber-200'}`} />
          </div>

          {/* Huy hiệu số đan văn */}
          <div className="absolute -bottom-2 px-2 py-0.5 rounded-md bg-black/90 border border-amber-500/50 text-[10px] font-mono text-amber-300 font-bold shadow">
            {veinCount} Đan Văn
          </div>
        </div>

        {/* Thẻ Tổng Kết Xuất Lò Đan Dược & Thanh Lọc Đan Độc */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-emerald-950/40 border border-amber-600/40 text-left space-y-2.5 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Tổng Kết Xuất Lò • Thanh Lọc Đan Độc:</span>
            </span>
            <span className="text-[10.5px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
              Đã thanh lọc {reductionPercent}% độc tính thảo dược
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-black/60 border border-stone-800 space-y-0.5">
              <div className="text-zinc-400 text-[9.5px]">Đan Độc Thực Tế Tích Tụ:</div>
              <div className={`font-bold text-xs ${actualToxicity === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                {actualToxicity} Điểm {actualToxicity === 0 ? '(0% Vô Tạp Chất)' : ''}
              </div>
            </div>

            <div className="p-2 rounded bg-black/60 border border-stone-800 space-y-0.5">
              <div className="text-zinc-400 text-[9.5px]">Tỷ Lệ Chiết Giảm Độc:</div>
              <div className="font-bold text-xs text-emerald-400">
                -{reductionPercent}% (Độ thanh khiết: {purityPercent}%)
              </div>
            </div>
          </div>

          {/* Thanh Tiến Trình Thanh Lọc */}
          <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-stone-800 flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${purityPercent}%` }}
              title={`Độ thanh khiết: ${purityPercent}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
              style={{ width: `${100 - purityPercent}%` }}
              title={`Độc tính còn lại: ${100 - purityPercent}%`}
            />
          </div>
        </div>

        {/* Bảng Chỉ Số Hiệu Năng & Dị Hỏa Trợ Lực */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-amber-900/30 text-left space-y-2 text-xs font-mono">
          {/* Dị Hỏa Trợ Lực (Nếu có) */}
          {flameConfig && flameConfig.id !== 'flame_pham_hoa' && (
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/80">
              <span className="text-zinc-400 flex items-center gap-1 font-serif">
                <Flame className={`w-3.5 h-3.5 ${flameConfig.visualColor.flameColor}`} />
                <span>Hỏa Trợ Lực:</span>
              </span>
              <span className={`font-bold font-serif ${flameConfig.visualColor.flameColor}`}>
                {flameConfig.name}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-zinc-300 pb-1.5 border-b border-zinc-800/80">
            <span className="text-zinc-400">Dược Lực Thực Nhận:</span>
            <span className="text-amber-300 font-bold">
              x{veinMetadata.veinMultiplier} (+{Math.round((veinMetadata.veinMultiplier - 1) * 100)}%)
            </span>
          </div>

          <div className="flex justify-between items-center text-zinc-300 pb-1.5 border-b border-zinc-800/80">
            <span className="text-zinc-400">Đan Độc Kinh Mạch:</span>
            {isNineVeins ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>0 điểm (Tuyệt Đối 0% Đan Độc)</span>
              </span>
            ) : (
              <span className="text-amber-300 font-bold">
                {actualToxicity} điểm ({Math.round(veinMetadata.toxicityMultiplier * 100)}% độc sau văn)
                {veinMetadata.toxicityBurnPercent ? (
                  <span className="text-emerald-400 text-[10px] ml-1">
                    (Dị Hỏa -{veinMetadata.toxicityBurnPercent}%)
                  </span>
                ) : null}
              </span>
            )}
          </div>

          {/* Dược Tính Biến Dị Thiên Phú (Nếu có) */}
          {mutation ? (
            <div className="pt-1 text-[11px] p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-300 font-serif">
                <Dna className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dị Biến Thiên Phú: {mutation.affixName}</span>
              </div>
              <div className="text-[10px] text-emerald-300/80 pl-5">
                {mutation.description}
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-zinc-500 italic text-center pt-0.5">
              Đan dược bình hòa, chưa kích hoạt dị biến dược tính.
            </div>
          )}
        </div>

        {/* Nút Thu Hoạch */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-amber-200" />
          <span>Thu Nạp Vào Túi Trữ Vật</span>
        </button>
      </div>
    </div>
  );
};
