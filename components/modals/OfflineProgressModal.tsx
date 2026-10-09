// components/modals/OfflineProgressModal.tsx
// Modal Cổ Phong hiển thị thành quả Bế Quan Ngoại Tuyến (AFK Offline Progress)

import React from 'react';
import {
  Sparkles,
  Clock,
  Zap,
  Gem,
  Sprout,
  Gift,
  Award,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { OfflineProgressResult } from '@/lib/types';
import { formatOfflineTime } from '@/lib/offline-progress';

export interface OfflineProgressModalProps {
  isOpen: boolean;
  result: OfflineProgressResult | null;
  onClaim: () => void;
}

export const OfflineProgressModal: React.FC<OfflineProgressModalProps> = ({
  isOpen,
  result,
  onClaim
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-xl w-full p-5 sm:p-7 rounded-2xl border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar relative bg-[#0c0c14]/95 text-zinc-200">
        
        {/* Header Tiên Hiệp Cổ Phong */}
        <div className="flex items-center gap-3 border-b border-amber-900/40 pb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/80 to-amber-900/40 border border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)] shrink-0">
            <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                Thổ Nạp Ngoại Tuyến
              </span>
              {result.isCapped && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/50 flex items-center gap-1 font-serif">
                  <AlertCircle className="w-3 h-3" /> Chạm Trần Tối Đa
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wide mt-1">
              BẾ QUAN NGOẠI TUYẾN • KẾT THÚC THỔ NẠP
            </h2>
            <p className="text-xs text-zinc-400 font-serif">
              Thời gian trôi qua nơi cõi thế, đạo hữu tĩnh tâm bế quan, nay đốn ngộ xuất quan trở về!
            </p>
          </div>
        </div>

        {/* Khung thời gian bế quan */}
        <div className="bg-gradient-to-r from-amber-950/30 via-zinc-900/50 to-amber-950/30 border border-amber-800/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-serif">
          <div>
            <div className="text-zinc-400 text-[11px]">Thời gian rời khỏi hồng trần:</div>
            <div className="text-sm font-bold text-amber-300 tracking-wide font-sans">
              {formatOfflineTime(result.elapsedSeconds)}
            </div>
          </div>
          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-amber-900/30 pt-2 sm:pt-0 sm:pl-3">
            <div className="text-zinc-400 text-[11px]">Thời gian tính thưởng:</div>
            <div className="text-xs font-medium text-emerald-400 font-sans">
              {formatOfflineTime(result.creditedSeconds)}
              {result.isCapped && (
                <span className="text-[10px] text-zinc-400 ml-1">
                  (Trần: {formatOfflineTime(result.maxCapSeconds)})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cảnh báo trần nếu offline vượt mốc */}
        {result.isCapped && (
          <div className="bg-amber-950/20 border border-amber-700/40 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-300 font-serif leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              Thời gian rời game đã vượt trần tích lũy ({formatOfflineTime(result.maxCapSeconds)}).
              <span className="text-zinc-400 ml-1">
                Gia nhập Tông Môn chức vị Trưởng Lão / Chưởng Môn hoặc cưỡi Linh Thú Tọa Kỵ để mở rộng trần lên 10 - 12 giờ!
              </span>
            </div>
          </div>
        )}

        {/* Danh sách phần thưởng */}
        <div className="space-y-2.5">
          <div className="text-xs uppercase tracking-wider text-amber-300/80 font-serif font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Thành Quả Thu Hoạch Trong Thời Gian Bế Quan
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Card Tu Vi */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/30 to-zinc-900/60 border border-amber-700/40 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-900/40 border border-amber-600/50 text-amber-300 shrink-0">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-400 font-serif">Tu Vi Thu Hoạch</div>
                <div className="text-base font-bold text-amber-200 truncate">
                  +{result.tuViGained.toLocaleString()} <span className="text-[11px] font-normal text-amber-400/80">Tu Vi</span>
                </div>
                <div className="text-[10px] text-zinc-500">Hiệu suất 75% bế quan</div>
              </div>
            </div>

            {/* Card Linh Thạch */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-950/30 to-zinc-900/60 border border-sky-700/40 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-900/40 border border-sky-600/50 text-sky-300 shrink-0">
                <Gem className="w-5 h-5 text-sky-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-zinc-400 font-serif">Linh Thạch Ngưng Tụ</div>
                <div className="text-base font-bold text-sky-200 truncate">
                  +{result.linhThachGained.toLocaleString()} <span className="text-[11px] font-normal text-sky-400/80">Linh Thạch</span>
                </div>
                <div className="text-[10px] text-zinc-500">Ngưng kết từ linh khí</div>
              </div>
            </div>
          </div>

          {/* Linh Điền Thu Hoạch nếu có ô chín */}
          {result.maturedPlotsCount > 0 && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/30 to-zinc-900/60 border border-emerald-700/40 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-600/50 text-emerald-300 shrink-0">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-emerald-300 font-serif font-bold">Linh Điền Động Phủ</div>
                <div className="text-sm font-medium text-zinc-200">
                  <span className="font-bold text-emerald-400">{result.maturedPlotsCount} ô</span> dược thảo đã thành thục, sẵn sàng thu hoạch!
                </div>
              </div>
            </div>
          )}

          {/* Cơ duyên nhặt bảo vật ngẫu nhiên */}
          {result.bonusItems.length > 0 && (
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-serif font-bold">
                <Gift className="w-3.5 h-3.5 text-purple-400" />
                Cơ Duyên Linh Mạch (Bảo vật thu gom khi xuất thần)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.bonusItems.map((item, idx) => (
                  <span
                    key={`${item.id}_${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-purple-900/40 border border-purple-600/40 text-purple-200 font-serif"
                  >
                    <span>{item.type === 'herb' ? '🌿' : '💎'}</span>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-amber-300 font-bold">x{item.quantity}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nút bấm Hành Động */}
        <div className="pt-2">
          <button
            onClick={onClaim}
            className="w-full py-3 px-4 rounded-xl font-serif font-bold text-sm tracking-wide text-zinc-900 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-zinc-900" />
            <span>LĨNH NHẬN TU VI & XUẤT QUAN</span>
            <ArrowRight className="w-4 h-4 text-zinc-900" />
          </button>
        </div>

      </div>
    </div>
  );
};
