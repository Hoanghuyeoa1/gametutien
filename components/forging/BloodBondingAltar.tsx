// components/forging/BloodBondingAltar.tsx
// Te dan Huyet Khe Chu Sa: "Hien Huyet Doan Khi & Dong Hoa Ban Menh"
// 100% Strict TypeScript, Tailwind CSS, Phong cach Co Phong Tien Hiep

import React from 'react';
import {
  Flame,
  Shield,
  Zap,
  AlertTriangle,
  Heart,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  Clock,
  Skull
} from 'lucide-react';
import { Equipment } from '@/lib/types/items';
import { PlayerState } from '@/lib/types/player';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';

export interface BloodBondingAltarProps {
  equipment: Equipment | null;
  player: PlayerState;
  remainingLifespan: number;
  bloodBondLifespanCost: number;
  onExecuteBloodBond: () => void;
  isProcessing: boolean;
  actionFeedback: { type: 'success' | 'error'; message: string } | null;
}

export const BloodBondingAltar: React.FC<BloodBondingAltarProps> = ({
  equipment,
  player,
  remainingLifespan,
  bloodBondLifespanCost,
  onExecuteBloodBond,
  isProcessing,
  actionFeedback
}) => {
  if (!equipment) {
    return (
      <div className="p-8 rounded-xl bg-gradient-to-b from-stone-950/90 via-[#140b0f] to-stone-950 border border-rose-900/40 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-950/40 border border-rose-600/30 flex items-center justify-center text-rose-400 text-2xl shadow-[0_0_15px_rgba(225,29,72,0.15)]">
          <Flame className="w-7 h-7 text-rose-500 animate-pulse" />
        </div>
        <h4 className="font-serif text-sm font-bold text-rose-200/90">
          Chưa Chọn Vũ Khí Đặt Lên Tế Đàn
        </h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          Hãy chọn Bản Mệnh Vũ Khí để thắp nến chu sa tế đàn, chuẩn bị nghi thức hiến tế chân huyết dung hợp kinh mạch.
        </p>
      </div>
    );
  }

  const isWeapon = equipment.slot === 'weapon';
  const isAlreadyBound = Boolean(equipment.bloodBondData?.isBloodBound);
  const bloodBondData = equipment.bloodBondData;
  const isLifespanInsufficient = remainingLifespan < 15;

  const canSign = Boolean(
    !isAlreadyBound &&
    isWeapon &&
    !isLifespanInsufficient &&
    !isProcessing
  );

  return (
    <div className="rounded-xl bg-gradient-to-b from-rose-950/40 via-stone-950/95 to-black border-2 border-rose-800/60 shadow-[0_0_35px_rgba(225,29,72,0.18)] p-4 sm:p-6 space-y-5 relative overflow-hidden">
      {/* Cinnabar occult rune accents */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent" />
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-rose-950/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-red-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Tế Đàn */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rose-900/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-rose-200 tracking-wide flex items-center gap-1.5">
              <span>🩸 Tế Đàn Huyết Khế Chu Sa</span>
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400">
            Hiến tế chân huyết tâm mạch, vĩnh viễn khóa thần binh vào bổn mạng nguyên thần
          </p>
        </div>

        {/* Trạng thái Thọ Nguyên hiện tại */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-rose-900/50 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-zinc-400">Thọ Nguyên Còn Lại:</span>
          <span className={`font-bold ${
            remainingLifespan >= 20 ? 'text-emerald-400' : remainingLifespan >= 15 ? 'text-amber-400' : 'text-rose-400 animate-pulse'
          }`}>
            {remainingLifespan} Năm
          </span>
        </div>
      </div>

      {/* Thông tin Thần Binh được chọn */}
      <div className="p-3.5 rounded-lg bg-black/50 border border-stone-800 flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-serif font-bold text-amber-200">
              [{convertGradeToGiai(equipment.grade)}] {equipment.name}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${getItemQuality(equipment.quality).badgeClass}`}>
              {getItemQuality(equipment.quality).name}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">
            Phân loại: <span className="text-zinc-300 font-semibold">{isWeapon ? 'Bản Mệnh Kiếm (Vũ Khí)' : 'Pháp Bảo Khác (Không Thể Ký)'}</span>
          </p>
        </div>

        {isAlreadyBound ? (
          <div className="px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/60 text-rose-300 font-serif text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Đã Ký Huyết Khế</span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded bg-stone-900 border border-stone-700 text-zinc-400 font-serif text-xs flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Chưa Nhận Chủ</span>
          </div>
        )}
      </div>

      {/* CẢNH BÁO TU VI NGHIÊM NGẶT */}
      <div className="p-3.5 rounded-lg bg-gradient-to-r from-rose-950/60 via-red-950/40 to-stone-950 border border-rose-600/50 space-y-1.5 shadow-inner">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1 text-xs text-rose-200/90 leading-relaxed font-serif">
            <div className="font-bold text-rose-300">Cảnh Báo Tu Vi Nghiêm Ngặt:</div>
            <p className="text-[11px] text-rose-200/80">
              &quot;Ký Huyết Khế tiêu hao 5 năm Thọ Nguyên để vĩnh viễn đồng hóa vũ khí vào kinh mạch. Thọ nguyên dưới 15 năm không thể tiến hành!&quot;
            </p>
          </div>
        </div>
      </div>

      {/* HIỂN THỊ TRẠNG THÁI: ĐÃ KÝ vs CHƯA KÝ */}
      {isAlreadyBound && bloodBondData ? (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-rose-950/50 via-[#180a0f] to-black border-2 border-rose-600/70 space-y-4 shadow-[0_0_25px_rgba(244,63,94,0.3)]">
          {/* Triện ấn đỏ chói */}
          <div className="text-center py-2">
            <div className="inline-block px-4 py-2 rounded-lg border-2 border-rose-500 bg-gradient-to-r from-rose-950/90 via-red-950/90 to-rose-950/90 text-rose-300 font-serif text-sm sm:text-base font-black tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.5)] transform -rotate-1 select-none animate-pulse">
              【HUYẾT KHẾ BẢN MỆNH • BẤT PHỤ CHI KHÍ】
            </div>
            <p className="text-[11px] text-rose-400/80 mt-1 font-mono">
              (+30% Lực Chiến, Miễn Tước Khí)
            </p>
          </div>

          {/* Chi tiết Huyết Khế */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-black/50 border border-rose-900/40 space-y-0.5">
              <span className="text-zinc-400">Chủ Nhân Khế Ước:</span>
              <div className="text-rose-200 font-serif font-bold text-xs">
                {bloodBondData.boundOwnerName || player.name || 'Vô Danh Tu Sĩ'}
              </div>
            </div>

            <div className="p-2.5 rounded bg-black/50 border border-rose-900/40 space-y-0.5">
              <span className="text-zinc-400">Thọ Nguyên Đã Hiến:</span>
              <div className="text-rose-300 font-bold text-xs">
                {bloodBondData.lifespanSacrificed || 5} Năm Chân Huyết
              </div>
            </div>

            <div className="p-2.5 rounded bg-black/50 border border-rose-900/40 space-y-0.5">
              <span className="text-zinc-400">Cấp Độ Cộng Hưởng:</span>
              <div className="text-amber-300 font-bold text-xs flex items-center gap-1">
                <span>Cấp {bloodBondData.bondResonanceLevel || 1}/5</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
            </div>

            <div className="p-2.5 rounded bg-black/50 border border-rose-900/40 space-y-0.5">
              <span className="text-zinc-400">Ngày Kết Khế:</span>
              <div className="text-zinc-300 text-[11px]">
                {bloodBondData.bondedAt ? new Date(bloodBondData.bondedAt).toLocaleDateString('vi-VN') : 'Thượng Cổ'}
              </div>
            </div>
          </div>

          {/* Danh sách hiệu ứng kích hoạt */}
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 space-y-1.5 text-xs">
            <div className="font-serif font-bold text-rose-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-rose-400" />
              <span>Đặc Tính Bản Mệnh Đã Kích Hoạt Vĩnh Viễn:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-zinc-300 pl-4 list-disc font-mono">
              <li>
                <strong className="text-amber-300">Khuếch đại Uy Lực:</strong> Toàn bộ sát thương và chỉ số vũ khí tăng <strong className="text-emerald-400">+30%</strong>.
              </li>
              <li>
                <strong className="text-rose-300">Bản Mệnh Bất Diệt:</strong> Miễn nhiễm 100% trước tất cả các đòn tước khí, đoạt khí hoặc khóa thần binh của đối thủ.
              </li>
              <li>
                <strong className="text-cyan-300">Kinh Mạch Đồng Hóa:</strong> Không thể tháo bỏ hay giao dịch cho tu sĩ khác.
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lợi ích dự kiến khi ký */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-black/40 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-rose-400 font-serif font-bold">
                <Skull className="w-3.5 h-3.5 text-rose-500" />
                <span>Tiêu Hao Nghi Thức</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Hiến tế <strong className="text-rose-400">{bloodBondLifespanCost} Năm</strong> Thọ Nguyên vĩnh viễn từ kinh mạch
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-serif font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Thần Lực Thu Được</span>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Khuếch đại <strong className="text-emerald-400">+30% Lực Chiến</strong> & <strong className="text-cyan-300">Miễn Tước Khí</strong>
              </p>
            </div>
          </div>

          {!isWeapon && (
            <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Chỉ có Bản Mệnh Phi Kiếm (Vũ Khí) mới có thể kết nối Huyết Khế.</span>
            </div>
          )}

          {isWeapon && isLifespanInsufficient && (
            <div className="p-2.5 rounded bg-rose-950/50 border border-rose-700/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Thọ nguyên còn lại ({remainingLifespan} năm) dưới 15 năm, không đủ điều kiện an toàn để hiến tế!</span>
            </div>
          )}

          {/* Feedback thông báo lỗi / thành công */}
          {actionFeedback && (
            <div className={`p-2.5 rounded text-xs flex items-center gap-2 border ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
            }`}>
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{actionFeedback.message}</span>
            </div>
          )}

          {/* NÚT BẤM KÝ KẾT HUYẾT KHẾ */}
          <button
            type="button"
            onClick={onExecuteBloodBond}
            disabled={!canSign}
            className={`w-full py-3.5 px-4 rounded-xl font-serif text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              canSign
                ? 'bg-gradient-to-r from-red-700 via-rose-600 to-rose-800 hover:from-red-600 hover:via-rose-500 hover:to-rose-700 text-white shadow-[0_0_25px_rgba(225,29,72,0.45)] hover:shadow-[0_0_35px_rgba(225,29,72,0.7)] hover:brightness-110 active:scale-[0.99] animate-pulse'
                : 'bg-stone-900 text-zinc-500 border border-stone-800 cursor-not-allowed opacity-60'
            }`}
          >
            <Flame className={`w-4 h-4 ${canSign ? 'text-rose-200' : 'text-zinc-600'}`} />
            <span>[🩸 HIẾN HUYẾT ĐOẠN KHÍ (KÝ KẾT HUYẾT KHẾ)]</span>
          </button>
        </div>
      )}
    </div>
  );
};
