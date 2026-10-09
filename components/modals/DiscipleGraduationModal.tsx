// components/modals/DiscipleGraduationModal.tsx
// MODAL CỔ PHONG CỬ HÀNH ĐẠI LỄ XUẤT SƯ (DISCIPLE GRADUATION CEREMONY)

import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Award,
  Shield,
  Zap,
  TrendingUp,
  X,
  Scroll,
  Crown
} from 'lucide-react';
import type { ImmortalChild } from '@/lib/types/offspring';
import type { ProceduralDisciple } from '@/lib/types/custom-sect';
import {
  canGraduateDisciple,
  calculateGraduationSpecialtyBonus,
} from '@/lib/disciple-appointment-logic';

export interface DiscipleGraduationModalProps {
  isOpen: boolean;
  disciple: ImmortalChild | ProceduralDisciple | null;
  onConfirmGraduation: (discipleId: string) => void;
  onClose: () => void;
}

export const DiscipleGraduationModal: React.FC<DiscipleGraduationModalProps> = ({
  isOpen,
  disciple,
  onConfirmGraduation,
  onClose,
}) => {
  if (!isOpen || !disciple) return null;

  const check = canGraduateDisciple(disciple);
  const potentialBonus = calculateGraduationSpecialtyBonus(disciple);

  const rootName =
    'spiritualRoots' in disciple
      ? `${disciple.spiritualRoots?.elementName} (${disciple.spiritualRoots?.grade?.toUpperCase()})`
      : 'linhCan' in disciple
      ? `${disciple.linhCan?.name} (${disciple.linhCan?.grade?.toUpperCase()})`
      : 'Tiên Thiên Linh Căn';

  const combatPower =
    'combatPower' in disciple
      ? disciple.combatPower
      : 'stats' in disciple
      ? disciple.stats.combatPower
      : 10000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 shadow-2xl shadow-amber-900/40 p-6 md:p-8">
        {/* Nền hiệu ứng hào quang kim sắc */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-amber-300 rounded-lg hover:bg-stone-800/60 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header Tiêu Đề */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/60 shadow-lg shadow-amber-500/20 mb-3 text-amber-300">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
            Đại Lễ Xuất Sư • Phong Chức Chân Truyền
          </h2>
          <p className="text-sm text-stone-400 mt-1">
            Thiên địa linh khí quy tụ, chứng minh đạo tâm và đạo hạnh trưởng thành
          </p>
        </div>

        {/* Thông tin Tiên Đồng */}
        <div className="p-4 rounded-xl bg-stone-900/80 border border-amber-900/40 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3 mb-3">
            <div>
              <span className="text-xs text-amber-500 uppercase font-semibold tracking-wider">
                Đạo Tử Thụ Lễ
              </span>
              <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                {disciple.name}
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {disciple.realmName}
                </span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Lực Chiến</span>
              <p className="text-sm font-bold text-emerald-400">
                {combatPower.toLocaleString()} CP
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-400">Linh Căn: </span>
              <span className="text-stone-200 font-medium">{rootName}</span>
            </div>
            <div>
              <span className="text-stone-400">Tâm Cảnh / Thần Thái: </span>
              <span className="text-amber-200 font-medium">Viên Mãn Thuần Khiết</span>
            </div>
          </div>
        </div>

        {/* Văn tự truyền đạo */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 mb-6 relative">
          <Scroll className="absolute top-3 right-3 text-amber-500/30" size={32} />
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={14} /> Văn Tự Truyền Thừa Sư Tôn
          </h4>
          <p className="text-sm italic text-amber-200/90 leading-relaxed font-serif">
            "Ngươi khổ tu nhiều năm, từ lúc còn là phàm đồng cho đến nay đốn ngộ Hóa Thần. Nay sư môn sắc phong xuất sư, tiếp nhận đạo bào truyền thừa và trấn sơn pháp ấn. Ngươi có thể viễn chinh trấn thủ Tinh Hải thái cổ hoặc chấp chưởng Khố Phòng điều phối tông môn!"
          </p>
        </div>

        {/* Bảng Đặc Tính Thiên Phú Sau Xuất Sư */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award size={14} className="text-amber-400" /> Thiên Phú Bổ Nhiệm Dự Kiến (Specialty Bonus)
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-stone-900/90 border border-indigo-900/40 flex items-center gap-3">
              <Zap className="text-indigo-400 shrink-0" size={20} />
              <div>
                <span className="text-xs text-stone-400 block">Khai Thác Tinh Hải</span>
                <span className="text-sm font-bold text-indigo-300">
                  +{Math.round((potentialBonus.starHarvestMultiplier || 0) * 100)}% Sản Lượng
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-900/90 border border-blue-900/40 flex items-center gap-3">
              <Shield className="text-blue-400 shrink-0" size={20} />
              <div>
                <span className="text-xs text-stone-400 block">Thủ Ngự Cứ Điểm</span>
                <span className="text-sm font-bold text-blue-300">
                  +{Math.round((potentialBonus.starDefenseBonus || 0) * 100)}% Phòng Ngự
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-900/90 border border-amber-900/40 flex items-center gap-3">
              <TrendingUp className="text-amber-400 shrink-0" size={20} />
              <div>
                <span className="text-xs text-stone-400 block">Hiệu Suất Khố Phòng</span>
                <span className="text-sm font-bold text-amber-300">
                  +{Math.round((potentialBonus.treasuryEfficiency || 0) * 100)}% Thu Nhập
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-900/90 border border-emerald-900/40 flex items-center gap-3">
              <Crown className="text-emerald-400 shrink-0" size={20} />
              <div>
                <span className="text-xs text-stone-400 block">Bảo Quản Tài Nguyên</span>
                <span className="text-sm font-bold text-emerald-300">
                  -{Math.round((potentialBonus.resourceDecayReduction || 0) * 100)}% Tiêu Hao
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thông báo điều kiện nếu chưa đạt */}
        {!check.eligible && (
          <div className="p-3 mb-6 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{check.reason}</span>
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 text-sm font-medium transition-colors"
          >
            Tạm Hoãn
          </button>

          <button
            disabled={!check.eligible}
            onClick={() => onConfirmGraduation(disciple.id)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
              check.eligible
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 hover:brightness-110 shadow-amber-500/25 active:scale-95'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/50'
            }`}
          >
            <GraduationCap size={18} />
            Cử Hành Đại Lễ Xuất Sư
          </button>
        </div>
      </div>
    </div>
  );
};
