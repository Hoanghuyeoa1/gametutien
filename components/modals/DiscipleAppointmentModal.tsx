// components/modals/DiscipleAppointmentModal.tsx
// MODAL CỔ PHONG ĐIỀU PHỐI BỔ NHIỆM TRẤN THỦ SĨ / CHẤP SỰ KHỐ PHÒNG

import React from 'react';
import {
  X,
  Compass,
  Building,
  UserCheck,
  UserX,
  Shield,
  Zap,
  TrendingUp,
  Award,
  AlertCircle,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import type { PlayerStats } from '@/lib/types';
import type {
  DiscipleAppointmentRole,
} from '@/lib/types/disciple-appointment';
import type { ImmortalChild } from '@/lib/types/offspring';
import type { ProceduralDisciple } from '@/lib/types/custom-sect';

export interface DiscipleAppointmentModalProps {
  isOpen: boolean;
  role: DiscipleAppointmentRole;
  targetId: string;
  targetName: string;
  player: PlayerStats;
  onAppoint: (discipleId: string, role: DiscipleAppointmentRole, targetId: string) => void;
  onRecall: (discipleId: string) => void;
  onClose: () => void;
}

export const DiscipleAppointmentModal: React.FC<DiscipleAppointmentModalProps> = ({
  isOpen,
  role,
  targetId,
  targetName,
  player,
  onAppoint,
  onRecall,
  onClose,
}) => {
  if (!isOpen) return null;

  // Lấy toàn bộ đệ tử đã xuất sư
  const allGraduatedDisciples: (ImmortalChild | ProceduralDisciple)[] = [];

  if (player.offspringState?.children) {
    player.offspringState.children.forEach((c) => {
      if (c.appointmentData?.isGraduated) {
        allGraduatedDisciples.push(c);
      }
    });
  }

  if (player.customSectState?.disciples) {
    player.customSectState.disciples.forEach((d) => {
      if (d.appointmentData?.isGraduated) {
        allGraduatedDisciples.push(d);
      }
    });
  }

  // Xác định người đương nhiệm tại vị trí này
  let currentAssignedDiscipleId: string | undefined = undefined;
  if (role === 'tinh_hai_guardian') {
    currentAssignedDiscipleId =
      player.cosmicState?.nodeGuardians?.[targetId] ||
      player.cosmicDefenseState?.garrisons?.[targetId]?.entityId;
  } else if (role === 'sect_treasury_deacon') {
    currentAssignedDiscipleId = player.customSectState?.sectVault?.deaconDiscipleId;
  }

  const currentAssignedDisciple = allGraduatedDisciples.find(
    (d) => d.id === currentAssignedDiscipleId
  );

  const isStarSea = role === 'tinh_hai_guardian';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border-2 border-indigo-500/50 bg-gradient-to-b from-stone-950 via-stone-900 to-indigo-950/40 shadow-2xl shadow-indigo-950/50">
        {/* Nền hiệu ứng */}
        <div className="absolute top-0 right-1/4 w-80 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              {isStarSea ? <Compass size={22} /> : <Building size={22} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                {isStarSea ? 'Bổ Nhiệm Trấn Thủ Sĩ Tinh Hải' : 'Bổ Nhiệm Chấp Sự Khố Phòng'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {targetName}
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Lựa chọn Tiên Đồng đã đại thành xuất sư để điều phối phòng ngự và tối ưu hóa tài nguyên
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung danh sách cuộn */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Khu Vực Người Đương Nhiệm */}
          {currentAssignedDisciple ? (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 font-bold">
                  {currentAssignedDisciple.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      Đang Đương Nhiệm
                    </span>
                    <span className="text-xs px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Hoạt Động
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-indigo-100">
                    {currentAssignedDisciple.name}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Cảnh giới: {currentAssignedDisciple.realmName} • Công trạng: {currentAssignedDisciple.appointmentData?.meritPoints || 0} điểm
                  </p>
                </div>
              </div>

              <button
                onClick={() => onRecall(currentAssignedDisciple.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UserX size={15} />
                Bãi Nhiệm / Triệu Hồi
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 border-dashed text-center">
              <AlertCircle className="mx-auto text-amber-500/60 mb-1" size={24} />
              <p className="text-sm font-medium text-stone-300">Vị trí hiện đang bỏ trống</p>
              <p className="text-xs text-stone-500">
                Hãy lựa chọn một Tiên Đồng đã xuất sư bên dưới để đảm nhiệm chức vụ này.
              </p>
            </div>
          )}

          {/* Danh Sách Tiên Đồng Đã Xuất Sư */}
          <div>
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Danh Sách Tiên Đồng Đã Xuất Sư ({allGraduatedDisciples.length})
            </h3>

            {allGraduatedDisciples.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-stone-900/40 border border-stone-800 text-stone-500">
                <p className="text-sm">Chưa có Tiên Đồng nào cử hành Đại Lễ Xuất Sư.</p>
                <p className="text-xs mt-1">
                  Hãy nuôi dưỡng Tiên Đồng tại Động Phủ đạt cảnh giới Hóa Thần Kỳ trở lên để cử hành xuất sư.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allGraduatedDisciples.map((disciple) => {
                  const isCurrentAssigned = disciple.id === currentAssignedDiscipleId;
                  const isBusyOtherRole =
                    disciple.appointmentData?.assignedRole &&
                    disciple.appointmentData.assignedRole !== 'none' &&
                    !isCurrentAssigned;

                  const bonus = disciple.appointmentData?.specialtyBonus || {};

                  return (
                    <div
                      key={disciple.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrentAssigned
                          ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                          : isBusyOtherRole
                          ? 'bg-stone-900/40 border-stone-800/80 opacity-75'
                          : 'bg-stone-900/80 border-stone-700/80 hover:border-indigo-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-stone-100">
                              {disciple.name}
                            </span>
                            <span className="text-xs px-1.5 py-0.2 rounded bg-stone-800 text-amber-300 border border-stone-700">
                              {disciple.realmName}
                            </span>
                          </div>
                          <span className="text-xs text-stone-400 block mt-0.5">
                            Trung thành: {disciple.appointmentData?.loyalty ?? 100}/100 • Công trạng: {disciple.appointmentData?.meritPoints ?? 0}
                          </span>
                        </div>

                        {/* Badge trạng thái */}
                        {isCurrentAssigned ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-500/40">
                            Đương Nhiệm
                          </span>
                        ) : isBusyOtherRole ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                            {disciple.appointmentData?.assignedRole === 'tinh_hai_guardian'
                              ? 'Trấn Thủ Tinh Hải'
                              : 'Chấp Sự Khố Phòng'}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                            Sẵn Sàng
                          </span>
                        )}
                      </div>

                      {/* Hiển thị chỉ số chuyên môn dự kiến */}
                      <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800/60 mb-3 text-xs space-y-1">
                        {isStarSea ? (
                          <>
                            <div className="flex items-center justify-between text-indigo-300">
                              <span className="text-stone-400 flex items-center gap-1">
                                <Zap size={13} /> Gia Tốc Tinh Thạch:
                              </span>
                              <span className="font-bold">
                                +{Math.round((bonus.starHarvestMultiplier || 0) * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-blue-300">
                              <span className="text-stone-400 flex items-center gap-1">
                                <Shield size={13} /> Thủ Ngự Cứ Điểm:
                              </span>
                              <span className="font-bold">
                                +{Math.round((bonus.starDefenseBonus || 0) * 100)}%
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between text-amber-300">
                              <span className="text-stone-400 flex items-center gap-1">
                                <TrendingUp size={13} /> Tăng Sản Lượng:
                              </span>
                              <span className="font-bold">
                                +{Math.round((bonus.treasuryEfficiency || 0) * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-300">
                              <span className="text-stone-400 flex items-center gap-1">
                                <Award size={13} /> Giảm Tiêu Hao:
                              </span>
                              <span className="font-bold">
                                -{Math.round((bonus.resourceDecayReduction || 0) * 100)}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Nút hành động */}
                      {isCurrentAssigned ? (
                        <button
                          onClick={() => onRecall(disciple.id)}
                          className="w-full py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <UserX size={14} />
                          Bãi Nhiệm / Triệu Hồi
                        </button>
                      ) : isBusyOtherRole ? (
                        <button
                          disabled
                          className="w-full py-1.5 rounded-lg bg-stone-800 text-stone-500 border border-stone-700/50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          Đang Đảm Nhiệm Nơi Khác
                        </button>
                      ) : (
                        <button
                          onClick={() => onAppoint(disciple.id, role, targetId)}
                          className="w-full py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        >
                          <UserCheck size={14} />
                          {currentAssignedDisciple ? 'Hoán Đổi Đảm Nhiệm' : 'Sắc Phong Bổ Nhiệm'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};
