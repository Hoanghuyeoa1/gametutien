'use client';
// components/modals/MeridianCultivationModal.tsx
// Giao diện Vạn Năng Tu Vi: Sa Bàn Bát Mạch Procedural SVG & Lò Ngưng Đan Chân Nguyên

import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  CircleDot,
  Heart,
  Sword,
  Gauge,
  Atom,
  Feather,
  Info,
  Gift,
} from 'lucide-react';
import type { PlayerStats } from '@/lib/types/player';
import type { MeridianType, AcupointNode } from '@/lib/types/tu-vi-empowerment';
import {
  useTuViEmpowermentActions,
  type UseTuViEmpowermentActionsReturn,
} from '@/hooks/useTuViEmpowermentActions';
import { MERIDIANS_CONFIG, ACUPOINTS_MAP, TU_VI_CRYSTALLIZE_RECIPES } from '@/lib/tu-vi-empowerment-data';
import { canUnlockAcupoint } from '@/lib/tu-vi-empowerment-logic';


export interface MeridianCultivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>> | ((p: PlayerStats) => void) | ((updater: (prev: PlayerStats) => PlayerStats) => void);
  tuViActions?: UseTuViEmpowermentActionsReturn;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: any) => void;
}

export const MeridianCultivationModal: React.FC<MeridianCultivationModalProps> = ({
  isOpen,
  onClose,
  player,
  setPlayer,
  tuViActions,
  showToast,
  addLog,
}) => {
  const [activeTab, setActiveTab] = useState<'meridians' | 'alchemy' | 'overdrive'>('meridians');

  const fallbackActions = useTuViEmpowermentActions({ player, setPlayer, showToast, addLog });
  const actions: UseTuViEmpowermentActionsReturn = tuViActions || fallbackActions;

  const {
    tuViState,
    meridianBonuses,
    selectedMeridianId,
    setSelectedMeridianId,
    selectedAcupointId,
    setSelectedAcupointId,
    activeMeridian,
    activeAcupoint,
    canUnlockActiveAcupoint,
    unlockFailureReason,
    handleUnlockAcupoint,
    handleCrystallize,
    handleInfuseCompanion,
    handleTriggerOverdrive,
    isProcessing,
    meridiansList,
    recipesList,
  } = actions;

  const activeAcupointUnlockable = actions.activeAcupointUnlockable || {
    canUnlock: canUnlockActiveAcupoint,
    reason: unlockFailureReason,
  };

  // Tọa độ SVG cho 32 huyệt vị tương đối trên sa bàn nhân thể (ViewBox: 0 0 400 620)
  const ACUPOINT_COORDS: Record<string, { x: number; y: number }> = {
    // 1. Nhâm Mạch (Dọc trục trước cơ thể từ bụng dưới lên ngực)
    nham_dan_trung: { x: 200, y: 220 },
    nham_quan_nguyen: { x: 200, y: 310 },
    nham_khi_hai: { x: 200, y: 275 },
    nham_khuc_cot: { x: 200, y: 355 },

    // 2. Đốc Mạch (Trục sau đỉnh đầu xuống lưng)
    doc_bach_hoi: { x: 200, y: 80 },
    doc_phong_phu: { x: 200, y: 130 },
    doc_dai_chuy: { x: 200, y: 175 },
    doc_menh_mon: { x: 200, y: 335 },

    // 3. Xung Mạch (Hai bên trục ngực bụng)
    xung_u_mon: { x: 180, y: 250 },
    xung_thong_coc: { x: 220, y: 250 },
    xung_am_do: { x: 180, y: 290 },
    xung_thuong_khuc: { x: 220, y: 290 },

    // 4. Đới Mạch (Vòng quanh vùng eo lưng)
    doi_doi_mach: { x: 145, y: 325 },
    doi_ngu_khu: { x: 255, y: 325 },
    doi_duy_dao: { x: 155, y: 350 },
    doi_kinh_mon: { x: 245, y: 350 },

    // 5. Âm Kiều Mạch (Mặt trong chân trái & phải dưới)
    am_kieu_chieu_hai: { x: 165, y: 550 },
    am_kieu_giao_tin: { x: 170, y: 495 },
    am_kieu_khuyet_bon: { x: 175, y: 205 },
    am_kieu_tinh_minh: { x: 188, y: 110 },

    // 6. Dương Kiều Mạch (Mặt ngoài chân lên vai gáy)
    duong_kieu_than_mach: { x: 235, y: 550 },
    duong_kieu_boc_tham: { x: 230, y: 495 },
    duong_kieu_cu_cot: { x: 240, y: 195 },
    duong_kieu_phong_tri: { x: 215, y: 120 },

    // 7. Âm Duy Mạch (Mạng lưới âm liên kết lồng ngực)
    am_duy_truc_tan: { x: 160, y: 440 },
    am_duy_phu_ai: { x: 170, y: 315 },
    am_duy_ky_mon: { x: 175, y: 260 },
    am_duy_thien_dot: { x: 200, y: 160 },

    // 8. Dương Duy Mạch (Mạng lưới dương bảo hộ bên ngoài)
    duong_duy_kim_mon: { x: 240, y: 440 },
    duong_duy_duong_giao: { x: 230, y: 380 },
    duong_duy_nhu_du: { x: 245, y: 230 },
    duong_duy_nao_khong: { x: 220, y: 100 },
  };

  if (!isOpen) return null;

  const currentTuVi = player.tuVi || 0;
  const unlockedCount = tuViState.unlockedAcupointIds.length;
  const completedMeridianCount = tuViState.completedMeridianIds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-stone-950 border border-amber-900/60 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
        {/* Background Hào Quang Huyền Ảo */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* ─── HEADER MODAL ──────────────────────────────────────────────── */}
        <div className="relative px-6 py-4 border-b border-stone-800/80 bg-stone-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent flex items-center gap-2">
                Vạn Năng Tu Vi • Chân Nguyên Đạo Thể
              </h2>
              <p className="text-xs text-stone-400">
                Kỳ Kinh Bát Mạch • Khai Khiếu Đả Huyệt • Ngưng Đan Chân Nguyên • Nhiên Huyết Overdrive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-stone-950/80 border border-amber-500/20">
              <span className="text-xs text-stone-400">Chân Nguyên Tích Lũy:</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {currentTuVi.toLocaleString()} Tu Vi
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/70 transition-colors"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── TABS NAVIGATION ───────────────────────────────────────────── */}
        <div className="px-6 py-2 border-b border-stone-800 bg-stone-900/30 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('meridians')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'meridians'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Kỳ Kinh Bát Mạch ({unlockedCount}/32 Khiếu)</span>
          </button>

          <button
            onClick={() => setActiveTab('alchemy')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'alchemy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Ngưng Đan Chân Nguyên ({tuViState.totalTuViCrystallized.toLocaleString()} Đã Luyện)</span>
          </button>

          <button
            onClick={() => setActiveTab('overdrive')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'overdrive'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>Nhiên Huyết Bí Thuật</span>
          </button>
        </div>

        {/* ─── TAB CONTENT BODY ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: KỲ KINH BÁT MẠCH */}
          {activeTab === 'meridians' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CỘT TRÁI: DANH SÁCH 8 ĐẠI MẠCH */}
              <div className="lg:col-span-3 space-y-2">
                <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center justify-between">
                  <span>8 Đại Thần Mạch</span>
                  <span className="text-amber-400">{completedMeridianCount}/8 Hoàn Thành</span>
                </h3>

                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {meridiansList.map(m => {
                    const isCompleted = tuViState.completedMeridianIds.includes(m.id);
                    const isSelected = selectedMeridianId === m.id;
                    const unlockedInM = m.acupoints.filter(a => tuViState.unlockedAcupointIds.includes(a.id)).length;

                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMeridianId(m.id);
                          setSelectedAcupointId(m.acupoints[0].id);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500/50 shadow-md'
                            : 'bg-stone-900/40 border-stone-800/80 hover:bg-stone-800/40'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-stone-200">{m.name}</span>
                            {isCompleted && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[10px] text-stone-400 line-clamp-1">{m.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isCompleted
                              ? 'bg-amber-500/20 text-amber-300 font-bold'
                              : 'bg-stone-800 text-stone-400'
                          }`}>
                            {unlockedInM}/{m.acupoints.length}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* TỔNG HỢP GIA TRÌ BÁT MẠCH */}
                <div className="mt-4 p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tổng Gia Trì Thân Thể</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-300 font-mono">
                    {meridianBonuses.maxHpPercent > 0 && (
                      <div className="text-emerald-400">+{meridianBonuses.maxHpPercent}% Khí Huyết</div>
                    )}
                    {meridianBonuses.atkPercent > 0 && (
                      <div className="text-red-400">+{meridianBonuses.atkPercent}% Công Kích</div>
                    )}
                    {meridianBonuses.defPercent > 0 && (
                      <div className="text-blue-400">+{meridianBonuses.defPercent}% Phòng Ngự</div>
                    )}
                    {meridianBonuses.speedBonus > 0 && (
                      <div className="text-yellow-400">+{meridianBonuses.speedBonus} Thân Pháp</div>
                    )}
                    {meridianBonuses.critRatePercent > 0 && (
                      <div className="text-purple-400">+{meridianBonuses.critRatePercent}% Bạo Kích</div>
                    )}
                    {meridianBonuses.critDmgPercent > 0 && (
                      <div className="text-rose-400">+{meridianBonuses.critDmgPercent}% Bạo Thương</div>
                    )}
                    {meridianBonuses.damageReductionPercent > 0 && (
                      <div className="text-cyan-400">+{meridianBonuses.damageReductionPercent}% Miễn Thương</div>
                    )}
                  </div>
                </div>
              </div>

              {/* CỘT GIỮA: SA BÀN NHÂN THỂ BÁT MẠCH PROCEDURAL SVG */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-900/40 border border-stone-800/80 relative overflow-hidden min-h-[440px]">
                <div className="absolute top-2 left-3 text-[11px] text-stone-400 flex items-center gap-1">
                  <CircleDot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sơ Đồ Nhân Thể Bát Mạch</span>
                </div>

                <div className="absolute top-2 right-3 flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Đã Mở
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Khả Mở
                  </span>
                  <span className="flex items-center gap-1 text-stone-500">
                    <span className="w-2 h-2 rounded-full bg-stone-700" /> Bế Tắc
                  </span>
                </div>

                {/* SVG Vector Sơ đồ Nhân Thể & Đường Dẫn Bát Mạch */}
                <svg
                  viewBox="0 0 400 620"
                  className="w-full max-w-[340px] h-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] select-none"
                >
                  <defs>
                    <radialGradient id="bodyGlow" cx="50%" cy="45%" r="50%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.12" />
                      <stop offset="60%" stopColor="#0284c7" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Vầng hào quang cơ thể */}
                  <ellipse cx="200" cy="300" rx="130" ry="250" fill="url(#bodyGlow)" />

                  {/* Silhouette Phác họa cơ thể Đạo Thể Cổ Xưa (Huyền Ảo) */}
                  <g stroke="#3f3f46" strokeWidth="1.2" fill="none" opacity="0.45" strokeDasharray="3 3">
                    {/* Đầu */}
                    <circle cx="200" cy="95" r="42" />
                    {/* Cổ */}
                    <path d="M188 135 L188 155 M212 135 L212 155" />
                    {/* Vai và Thân */}
                    <path d="M188 155 Q140 165 110 205 Q90 240 100 320 Q120 340 135 340" />
                    <path d="M212 155 Q260 165 290 205 Q310 240 300 320 Q280 340 265 340" />
                    {/* Ngực & Bụng & Hông */}
                    <path d="M135 340 L145 420 L160 580 M265 340 L255 420 L240 580" />
                    {/* Cột sống trung tâm */}
                    <line x1="200" y1="135" x2="200" y2="380" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 2" />
                  </g>

                  {/* Vẽ các đường dẫn Kinh Mạch phát quang giữa các huyệt của mạch đang chọn */}
                  {activeMeridian.acupoints.map((ac, idx) => {
                    if (idx === 0) return null;
                    const prev = activeMeridian.acupoints[idx - 1];
                    const p1 = ACUPOINT_COORDS[prev.id];
                    const p2 = ACUPOINT_COORDS[ac.id];
                    if (!p1 || !p2) return null;

                    const isPrevUnlocked = tuViState.unlockedAcupointIds.includes(prev.id);
                    const isCurUnlocked = tuViState.unlockedAcupointIds.includes(ac.id);
                    const isFlowActive = isPrevUnlocked && isCurUnlocked;

                    return (
                      <line
                        key={`flow-${prev.id}-${ac.id}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={isFlowActive ? '#fbbf24' : '#0284c7'}
                        strokeWidth={isFlowActive ? 3 : 1.5}
                        strokeDasharray={isFlowActive ? undefined : '4 4'}
                        opacity={isFlowActive ? 0.9 : 0.4}
                        filter={isFlowActive ? 'url(#glowGold)' : undefined}
                      />
                    );
                  })}

                  {/* Render 32 Khiếu Huyệt Tương Tác */}
                  {meridiansList.map(m => {
                    const isCurrentM = m.id === selectedMeridianId;

                    return m.acupoints.map(ac => {
                      const coords = ACUPOINT_COORDS[ac.id];
                      if (!coords) return null;

                      const isUnlocked = tuViState.unlockedAcupointIds.includes(ac.id);
                      const isSelected = selectedAcupointId === ac.id;
                      const unlockCheck = canUnlockAcupoint(player, ac.id);
                      const canUnlock = !isUnlocked && unlockCheck.canUnlock;

                      // Kích thước và màu sắc dựa trên trạng thái
                      let fillColor = '#1c1917';
                      let strokeColor = '#44403c';
                      let radius = isCurrentM ? 7.5 : 5;
                      let filterStr = undefined;

                      if (isUnlocked) {
                        fillColor = '#f59e0b';
                        strokeColor = '#fef08a';
                        filterStr = 'url(#glowGold)';
                      } else if (canUnlock) {
                        fillColor = '#06b6d4';
                        strokeColor = '#a5f3fc';
                        filterStr = 'url(#glowCyan)';
                      }

                      return (
                        <g
                          key={ac.id}
                          className="cursor-pointer transition-transform hover:scale-125"
                          onClick={() => {
                            setSelectedMeridianId(m.id);
                            setSelectedAcupointId(ac.id);
                          }}
                        >
                          {/* Vòng hào quang lớn nếu đang chọn */}
                          {isSelected && (
                            <circle
                              cx={coords.x}
                              cy={coords.y}
                              r={radius + 6}
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              className="animate-spin"
                              style={{ animationDuration: '6s', transformOrigin: `${coords.x}px ${coords.y}px` }}
                            />
                          )}

                          <circle
                            cx={coords.x}
                            cy={coords.y}
                            r={radius}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={isSelected ? 2.5 : 1.5}
                            filter={filterStr}
                            opacity={isCurrentM ? 1 : 0.4}
                          />

                          {/* Nhãn tên huyệt vị nếu thuộc mạch đang chọn */}
                          {isCurrentM && (
                            <text
                              x={coords.x > 200 ? coords.x + 12 : coords.x - 12}
                              y={coords.y + 3}
                              textAnchor={coords.x > 200 ? 'start' : 'end'}
                              fill={isUnlocked ? '#fef08a' : canUnlock ? '#67e8f9' : '#a8a29e'}
                              fontSize="9"
                              fontWeight="600"
                              fontFamily="sans-serif"
                            >
                              {ac.name}
                            </text>
                          )}
                        </g>
                      );
                    });
                  })}
                </svg>
              </div>

              {/* CỘT PHẢI: CHI TIẾT HUYỆT VỊ & NÚT ĐẢ THÔNG */}
              <div className="lg:col-span-4 space-y-4">
                {activeAcupoint ? (
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                    <div className="border-b border-stone-800 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 font-mono tracking-wider">
                          {activeMeridian.name}
                        </span>
                        {tuViState.unlockedAcupointIds.includes(activeAcupoint.id) ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Đã Đả Thông
                          </span>
                        ) : activeAcupointUnlockable.canUnlock ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Khả Đả Thông
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-stone-800 text-stone-400 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Chưa Đủ Điều Kiện
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-stone-100 mt-1">
                        Khiếu Huyệt: {activeAcupoint.name}
                      </h4>
                    </div>

                    {/* CHI TIẾT CHỈ SỐ GIA TRÌ VĨNH VIỄN */}
                    <div className="space-y-2">
                      <span className="text-xs text-stone-400 font-medium">Gia Trì Khi Hoàn Tất:</span>
                      <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5 font-mono text-xs">
                        {activeAcupoint.statBonus.maxHpPercent && (
                          <div className="flex items-center justify-between text-emerald-400">
                            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Khí Huyết Tối Đa:</span>
                            <span>+{activeAcupoint.statBonus.maxHpPercent}%</span>
                          </div>
                        )}
                        {activeAcupoint.statBonus.atkPercent && (
                          <div className="flex items-center justify-between text-red-400">
                            <span className="flex items-center gap-1.5"><Sword className="w-3.5 h-3.5" /> Công Kích Cơ Bản:</span>
                            <span>+{activeAcupoint.statBonus.atkPercent}%</span>
                          </div>
                        )}
                        {activeAcupoint.statBonus.defPercent && (
                          <div className="flex items-center justify-between text-blue-400">
                            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Phòng Ngự Cơ Bản:</span>
                            <span>+{activeAcupoint.statBonus.defPercent}%</span>
                          </div>
                        )}
                        {activeAcupoint.statBonus.speedBonus && (
                          <div className="flex items-center justify-between text-yellow-400">
                            <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> Thân Pháp Tốc Độ:</span>
                            <span>+{activeAcupoint.statBonus.speedBonus}</span>
                          </div>
                        )}
                        {activeAcupoint.statBonus.critRatePercent && (
                          <div className="flex items-center justify-between text-purple-400">
                            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Tỷ Lệ Bạo Kích:</span>
                            <span>+{activeAcupoint.statBonus.critRatePercent}%</span>
                          </div>
                        )}
                        {activeAcupoint.statBonus.critDmgPercent && (
                          <div className="flex items-center justify-between text-rose-400">
                            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Sát Thương Bạo Kích:</span>
                            <span>+{activeAcupoint.statBonus.critDmgPercent}%</span>
                          </div>
                        )}
                        {activeAcupoint.statBonus.damageReductionPercent && (
                          <div className="flex items-center justify-between text-cyan-400">
                            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Miễn Thương Hộ Thể:</span>
                            <span>+{activeAcupoint.statBonus.damageReductionPercent}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ĐIỀU KIỆN & TIÊU HAO */}
                    <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/60 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-stone-300">
                        <span>Tiêu Hao Chân Nguyên:</span>
                        <span className={`font-mono font-bold ${currentTuVi >= activeAcupoint.tuViCost ? 'text-amber-400' : 'text-red-400'}`}>
                          {activeAcupoint.tuViCost.toLocaleString()} Tu Vi
                        </span>
                      </div>
                      {!activeAcupointUnlockable.canUnlock && !tuViState.unlockedAcupointIds.includes(activeAcupoint.id) && (
                        <p className="text-[11px] text-rose-400/90 italic pt-1">
                          * {activeAcupointUnlockable.reason}
                        </p>
                      )}
                    </div>

                    {/* NÚT THAO TÁC ĐẢ THÔNG */}
                    <button
                      onClick={() => handleUnlockAcupoint(activeAcupoint.id)}
                      disabled={
                        isProcessing ||
                        tuViState.unlockedAcupointIds.includes(activeAcupoint.id) ||
                        !activeAcupointUnlockable.canUnlock
                      }
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                        tuViState.unlockedAcupointIds.includes(activeAcupoint.id)
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                          : activeAcupointUnlockable.canUnlock
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-amber-500/20 active:scale-98'
                          : 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {tuViState.unlockedAcupointIds.includes(activeAcupoint.id)
                          ? 'Đã Khai Thông Khiếu Này'
                          : 'Vận Công Đả Thông Khiếu Huyệt'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-500 text-xs">
                    Nhấp chọn một huyệt vị trên sơ đồ để xem thông tin và tiến hành đả thông.
                  </div>
                )}

                {/* ĐẠI CHU THIÊN DỊ TƯỢNG CỦA MẠCH HIỆN TẠI */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/20 to-stone-900/60 border border-amber-900/30 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Feather className="w-3.5 h-3.5 text-amber-400" />
                    <span>Đại Chu Thiên Dị Tượng: {activeMeridian.name}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    {activeMeridian.completionBonusDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NGƯNG KẾT CHÂN ĐAN */}
          {activeTab === 'alchemy' && (
            <div className="space-y-6">
              {/* Giới thiệu Lò Ngưng Đan */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-stone-900/40 to-stone-900/20 border border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-cyan-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Huyền Lò Ngưng Kết Tu Vi Chân Đan
                  </h3>
                  <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
                    Khi tu vi tích tụ vượt bậc mà chưa sẵn sàng nghênh tiếp thiên kiếp, tu sĩ có thể vận công
                    kết tinh chân nguyên thành đan dược. Đan này cất giữ vĩnh viễn trong Túi Đồ, có thể dùng lại
                    khi cần, đem tặng Đạo Lữ hoặc bán đấu giá thu về hàng vạn Linh Thạch!
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/80 border border-cyan-500/20 shrink-0 text-center font-mono">
                  <div className="text-[11px] text-stone-400">Tu Vi Sẵn Có:</div>
                  <div className="text-base font-bold text-amber-400">{currentTuVi.toLocaleString()}</div>
                </div>
              </div>

              {/* 3 CÔNG THỨC NGƯNG ĐAN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipesList.map(recipe => {
                  const canAfford = currentTuVi >= recipe.tuViCost;
                  const ownedCount = player.inventory?.pills?.find(p => p.id === recipe.outputItemId)?.quantity || 0;

                  return (
                    <div
                      key={recipe.id}
                      className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-md group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                            Trong Túi: {ownedCount} viên
                          </span>
                          <span className="text-[11px] font-mono text-stone-400">
                            Tích {recipe.storedTuVi.toLocaleString()} Tu Vi
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-stone-100 group-hover:text-cyan-300 transition-colors">
                          {recipe.name}
                        </h4>

                        <p className="text-xs text-stone-400 leading-relaxed min-h-[40px]">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-stone-800/80">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-400">Tiêu Hao:</span>
                          <span className={`font-mono font-bold ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
                            {recipe.tuViCost.toLocaleString()} Tu Vi
                          </span>
                        </div>

                        <button
                          onClick={() => handleCrystallize(recipe.id)}
                          disabled={isProcessing || !canAfford}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                            canAfford
                              ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-stone-950 shadow-md shadow-cyan-500/20 active:scale-98'
                              : 'bg-stone-800/60 text-stone-500 border border-stone-700/40 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Ngưng Tụ 1 Viên</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lời khuyên Đạo Môn */}
              <div className="p-4 rounded-xl bg-stone-900/30 border border-stone-800 text-xs text-stone-400 space-y-1">
                <div className="font-bold text-stone-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ứng Dụng Đa Năng Của Chân Đan:</span>
                </div>
                <p>• Sử dụng trực tiếp từ Túi Đồ để hoàn trả Tu Vi khi cần đột phá khẩn cấp.</p>
                <p>• Ký gửi trên Phường Thị / Đấu Giá Hội để thu hoạch lượng lớn Linh Thạch từ các gia tộc NPC.</p>
                <p>• Tặng Đạo Lữ hoặc đệ tử chân truyền để bồi đắp tu vi tăng cấp nhanh chóng.</p>
              </div>
            </div>
          )}

          {/* TAB 3: NHIÊN HUYẾT OVERDRIVE */}
          {activeTab === 'overdrive' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 via-stone-900/60 to-stone-950 border border-red-900/40 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
                  <Flame className="w-7 h-7 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-red-300 via-rose-400 to-amber-200 bg-clip-text text-transparent">
                    Nhiên Huyết Bí Thuật • Thiêu Đốt Chân Nguyên
                  </h3>
                  <p className="text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
                    Trong nghịch cảnh sinh tử trước Cự Thú Vực Ngoại hay Thiên Kiêu Tuyệt Đỉnh, tu sĩ có thể thiêu đốt
                    10% Tu Vi hiện tại để kích phát tiềm năng cực hạn của nhục thân và thần hồn.
                  </p>
                </div>

                {/* HỘP HIỆU ỨNG OVERDRIVE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono">
                  <div className="p-3 rounded-xl bg-stone-950/80 border border-red-900/40">
                    <span className="text-[11px] text-stone-400 block">Toàn Bộ Công Kích</span>
                    <span className="text-lg font-bold text-red-400">+25% ATK</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950/80 border border-rose-900/40">
                    <span className="text-[11px] text-stone-400 block">Tỷ Lệ Bạo Kích</span>
                    <span className="text-lg font-bold text-rose-400">+15% CRIT</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950/80 border border-emerald-900/40">
                    <span className="text-[11px] text-stone-400 block">Hồi Phục Sinh Mệnh</span>
                    <span className="text-lg font-bold text-emerald-400">+30% MAX HP</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-stone-400">
                  <span>Tiêu hao dự kiến: </span>
                  <span className="font-mono font-bold text-amber-400">
                    {Math.floor(currentTuVi * 0.1).toLocaleString()} Tu Vi (10%)
                  </span>
                </div>

                <button
                  onClick={handleTriggerOverdrive}
                  disabled={isProcessing || currentTuVi < 5000}
                  className={`px-8 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 shadow-xl transition-all ${
                    currentTuVi >= 5000
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-stone-100 shadow-red-500/20 active:scale-98'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                  <span>Kích Hoạt Nhiên Huyết Overdrive (3 Hiệp)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── FOOTER ────────────────────────────────────────────────────── */}
        <div className="px-6 py-3 border-t border-stone-800/80 bg-stone-900/50 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kỳ Kinh Bát Mạch liên thông đan điền • Vĩnh cửu bất diệt</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
