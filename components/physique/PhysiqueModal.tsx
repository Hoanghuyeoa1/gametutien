// components/physique/PhysiqueModal.tsx
// Giao diện Sa Bàn "Huyền Công Luyện Thể" (Expanded Physique System)

import React, { useMemo } from 'react';
import {
  X,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Activity,
  Flame,
  ChevronRight,
  TrendingUp,
  Award,
  Clock,
  Plus,
  Lock
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  PhysiqueState,
  PhysiqueRealm,
  PhysiquePart
} from '@/lib/types/physique';
import {
  PHYSIQUE_REALMS,
  PHYSIQUE_PARTS_CONFIG,
  PHYSIQUE_ITEMS,
  createDefaultPhysiqueState
} from '@/lib/physique-system-data';
import {
  calculateTotalPhysiqueStats,
  canBreakthroughPhysiqueRealm
} from '@/lib/physique-logic';
import { calculateEffectiveRequiredTuVi } from '@/lib/attribute-perks';
import realmsDataRaw from '@/data/realms-data.json';
import { scrollToElementWithHighlight } from '@/lib/navigation-utils';

export interface PhysiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  physiqueState?: PhysiqueState;
  selectedPartId?: string;
  setSelectedPartId?: (id: string) => void;
  onBreakthroughRealm?: () => void;
  onBreakthrough?: () => void;
  onUpgradePart: (partId: string) => void;
  onUsePhysiqueItem?: (itemId: string, quantity?: number) => void;
  onUseItem?: (itemId: string, quantity?: number) => void;
  isBreakthroughReady?: boolean;
  onNavigateToCultivate?: (target: 'cultivate' | 'breakthrough') => void;
}

export const PhysiqueModal: React.FC<PhysiqueModalProps> = ({
  isOpen,
  onClose,
  player,
  physiqueState: propPhysiqueState,
  selectedPartId: propSelectedPartId,
  setSelectedPartId: propSetSelectedPartId,
  onBreakthroughRealm,
  onBreakthrough,
  onUpgradePart,
  onUsePhysiqueItem,
  onUseItem,
  isBreakthroughReady,
  onNavigateToCultivate
}) => {
  const [internalPartId, setInternalPartId] = React.useState<string>('bi');
  const selectedPartId = propSelectedPartId !== undefined ? propSelectedPartId : internalPartId;
  const setSelectedPartId = propSetSelectedPartId || setInternalPartId;
  const handleBreakthrough = onBreakthrough || onBreakthroughRealm || (() => {});
  const handleUseItem = onUseItem || onUsePhysiqueItem || (() => {});

  const currentPhysiqueState = propPhysiqueState || player.physiqueState || createDefaultPhysiqueState();
  const cultivation = currentPhysiqueState.cultivation;
  const currentRealm = useMemo(() => {
    return PHYSIQUE_REALMS.find(r => r.id === cultivation.currentRealmId) || PHYSIQUE_REALMS[0];
  }, [cultivation.currentRealmId]);

  const nextRealm = useMemo(() => {
    return PHYSIQUE_REALMS[currentRealm.realmIndex + 1] || null;
  }, [currentRealm]);

  const breakthroughCheck = useMemo(() => {
    return canBreakthroughPhysiqueRealm(player);
  }, [player]);

  const nextCultivationRealm = useMemo(() => {
    return (realmsDataRaw as any[])[player.currentRealm + 1] || null;
  }, [player.currentRealm]);

  const requiredTuVi = useMemo(() => {
    return nextCultivationRealm ? calculateEffectiveRequiredTuVi(player, nextCultivationRealm) : 0;
  }, [player, nextCultivationRealm]);

  const isTuViReady = Boolean(nextCultivationRealm && player.tuVi >= requiredTuVi);

  const handleQuickNavigation = (target: 'cultivate' | 'breakthrough') => {
    onClose();
    if (onNavigateToCultivate) {
      onNavigateToCultivate(target);
    }
    const targetId = target === 'breakthrough' ? 'breakthrough-panel' : 'cultivation-panel';
    setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scrollToElementWithHighlight(targetId);
    }, 150);
  };

  const totalStats = useMemo(() => {
    return calculateTotalPhysiqueStats(currentPhysiqueState);
  }, [currentPhysiqueState]);

  // Selected Part Data
  const selectedPart = useMemo(() => {
    return (currentPhysiqueState.parts || []).find(p => p.id === selectedPartId) || currentPhysiqueState.parts[0];
  }, [currentPhysiqueState.parts, selectedPartId]);

  const selectedPartConfig = useMemo(() => {
    return selectedPart ? PHYSIQUE_PARTS_CONFIG[selectedPart.id] : PHYSIQUE_PARTS_CONFIG.bi;
  }, [selectedPart]);

  // EXP progress
  const expPercent = Math.min(
    100,
    Math.max(0, Math.floor((cultivation.currentExp / Math.max(1, cultivation.expToNextStage)) * 100))
  );

  // Available consumables in inventory
  const tinhHuyetCount = player.tinhHuyetYeuThu || 0;
  const invPills = player.inventory?.pills || [];
  const khiHuyetPillCount = invPills.find(p => p.id === 'pill_khi_huyet')?.quantity || 0;
  const khiHuyetCucPhamCount = invPills.find(p => p.id === 'pill_khi_huyet_cuc_pham')?.quantity || 0;
  const tayTuyPillCount = invPills.find(p => p.id === 'pill_tay_tuy')?.quantity || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl border border-amber-600/50 bg-gradient-to-b from-[#16121e] via-[#0d0a14] to-[#07060a] shadow-[0_0_50px_rgba(245,158,11,0.25)] text-zinc-200 overflow-hidden font-sans">
        
        {/* ======================================================== */}
        {/* 1. TOP HEADER */}
        {/* ======================================================== */}
        <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-amber-900/40 bg-gradient-to-r from-amber-950/60 via-[#1e1528] to-rose-950/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/40 to-rose-600/20 border border-amber-500/50 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
              💪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200 tracking-wide">
                  HUYỀN CÔNG LUYỆN THỂ
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  {currentRealm.name} • Tầng {cultivation.currentStage}/9
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-serif">
                Nhục Thân Thành Thánh • Đoán Cốt Hoán Huyết • Vạn Tượng Bất Hoại
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-amber-900/50 text-xs font-mono font-bold text-yellow-300">
              <span>🪙 {player.linhThach.toLocaleString()} Linh Thạch</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN 3-COLUMN CONTENT */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* ==================================================== */}
          {/* CỘT 1: CẢNH GIỚI NHỤC THÂN (LEFT - 4 cols) */}
          {/* ==================================================== */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Visual Aura & Silhouette */}
            <div className="relative rounded-2xl border border-amber-700/40 bg-gradient-to-b from-[#130f1d] to-[#0a0810] p-4 flex flex-col items-center text-center overflow-hidden shadow-inner">
              <div
                className="absolute inset-0 opacity-20 blur-2xl pointer-events-none transition-all duration-700"
                style={{ backgroundColor: currentRealm.glowColor }}
              />

              {/* Body Aura Core */}
              <div className="relative my-3 w-36 h-36 rounded-full border-2 border-amber-500/40 flex flex-col items-center justify-center bg-black/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="text-5xl select-none filter drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse">
                  🧘
                </span>
                <span className="text-[10px] font-mono text-amber-300 mt-1">
                  Cấp Giai {currentRealm.realmIndex + 1}/10
                </span>
              </div>

              {/* Realm Name & Stage */}
              <h3 className="text-xl font-serif font-bold text-amber-200 mt-1">
                {currentRealm.name}
              </h3>
              <div className="text-xs text-amber-400/90 font-mono mt-0.5">
                Tiểu Tầng: {cultivation.currentStage} / 9 Viên Mãn
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 px-2 italic">
                &ldquo;{currentRealm.description}&rdquo;
              </p>

              {/* EXP Progress Bar */}
              <div className="w-full mt-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Tiến độ Khí Huyết:</span>
                  <span className="text-amber-300 font-bold">
                    {cultivation.currentExp.toLocaleString()} / {cultivation.expToNextStage.toLocaleString()} ({expPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/80 border border-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${expPercent}%` }}
                  />
                </div>
              </div>

              {/* Special Ability Badge */}
              {currentRealm.specialAbilityName && (
                <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-left">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span>Nội Tại Kích Hoạt: {currentRealm.specialAbilityName}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1">
                    {currentRealm.specialAbilityDesc}
                  </p>
                </div>
              )}

              {/* Breakthrough Button */}
              <div className="w-full mt-4 space-y-2">
                {breakthroughCheck.isLockedByRealm && (
                  <div className="w-full p-2.5 rounded-xl bg-gradient-to-r from-red-950/60 via-amber-950/50 to-stone-900/80 border border-amber-600/50 text-amber-200 text-center font-serif text-[11px] flex flex-col items-center justify-center gap-1.5 shadow-sm animate-in fade-in">
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        🔒 Giới Hạn Bản Thể: Yêu cầu đạt <strong className="text-amber-300 font-bold underline underline-offset-2">{breakthroughCheck.requiredRealmName}</strong> mới có thể phá cảnh
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickNavigation(isTuViReady ? 'breakthrough' : 'cultivate')}
                      className={`mt-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isTuViReady
                          ? 'bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border border-amber-400 ring-1 ring-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse font-bold'
                          : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {isTuViReady ? '⚡ [Đột Phá Bản Thể Ngay]' : '🧘 [Đi Bế Quan Thổ Nạp]'}
                    </button>
                  </div>
                )}

                {nextRealm ? (
                  <button
                    onClick={handleBreakthrough}
                    disabled={breakthroughCheck.isLockedByRealm || !breakthroughCheck.canBreakthrough}
                    className={`w-full py-2.5 rounded-xl font-serif font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 ${
                      breakthroughCheck.isLockedByRealm
                        ? 'bg-zinc-900/90 text-zinc-500 border border-zinc-700/60 opacity-60 cursor-not-allowed'
                        : breakthroughCheck.canBreakthrough
                        ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-rose-600 text-stone-950 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer animate-pulse'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    {breakthroughCheck.isLockedByRealm ? (
                      <Lock className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>
                      {breakthroughCheck.isLockedByRealm
                        ? `🔒 Bị Phong Ấn (Cần [${breakthroughCheck.requiredRealmName}])`
                        : breakthroughCheck.canBreakthrough
                        ? `Phá Cảnh Đột Phá [${nextRealm.name}]`
                        : breakthroughCheck.reason}
                    </span>
                  </button>
                ) : (
                  <div className="py-2.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 font-serif font-bold text-xs">
                    🌟 Đã đạt cảnh giới Bất Diệt Tiên Thể cực hạn!
                  </div>
                )}
              </div>
            </div>

            {/* Total Physique Buffs Summary */}
            <div className="rounded-xl border border-amber-900/30 bg-black/40 p-3 space-y-2">
              <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Tổng Gia Trì Thể Phách:</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-400">Khí Huyết: </span>
                  <span className="text-emerald-400 font-bold">+{totalStats.hp?.toLocaleString() || 0}</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-400">Phòng Ngự: </span>
                  <span className="text-blue-400 font-bold">+{totalStats.def?.toLocaleString() || 0}</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-400">Công Kích: </span>
                  <span className="text-rose-400 font-bold">+{totalStats.atk?.toLocaleString() || 0}</span>
                </div>
                <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-400">Miễn Thương: </span>
                  <span className="text-amber-400 font-bold">+{totalStats.damageReduction || 0}%</span>
                </div>
                {totalStats.hpRegen ? (
                  <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Hồi Máu/Hiệp: </span>
                    <span className="text-teal-400 font-bold">+{totalStats.hpRegen}%</span>
                  </div>
                ) : null}
                {totalStats.trueDmgPercent ? (
                  <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80">
                    <span className="text-zinc-400">Sát Thương Chuẩn: </span>
                    <span className="text-purple-400 font-bold">+{totalStats.trueDmgPercent}%</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* CỘT 2: 6 ĐẠI BỘ PHẬN CƯỜNG HÓA (MIDDLE - 5 cols) */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#15111e] to-purple-950/20 border border-amber-800/40">
              <h3 className="text-sm font-serif font-bold text-amber-200">
                Lục Đại Bộ Vị Cường Hóa (Bì • Cốt • Huyết • Kinh • Tạng • Thần)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Chọn bộ phận để tôi luyện nâng cao chỉ số chuyên biệt và mở khóa năng lực
              </p>
            </div>

            {/* 6 Parts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(currentPhysiqueState.parts || []).map((part) => {
                const cfg = PHYSIQUE_PARTS_CONFIG[part.id];
                if (!cfg) return null;
                const isSelected = selectedPartId === part.id;

                return (
                  <div
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`rounded-xl border p-3 flex flex-col justify-between transition cursor-pointer min-h-[105px] ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'border-zinc-800 bg-black/40 hover:border-amber-600/50 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{cfg.icon}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/50 text-amber-300 border border-amber-600/30">
                        Cấp {part.level}/{cfg.maxLevel}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h5 className="text-xs font-serif font-bold text-amber-200">
                        {cfg.name}
                      </h5>
                      <div className="text-[10px] text-zinc-400 truncate">
                        {cfg.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Part Upgrade Card */}
            {selectedPart && selectedPartConfig && (
              <div className="rounded-xl border border-amber-700/50 bg-gradient-to-b from-[#181324] to-[#0f0c16] p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedPartConfig.icon}</span>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-amber-200">
                        {selectedPartConfig.name} • {selectedPartConfig.subtitle}
                      </h4>
                      <div className="text-[10px] text-zinc-400">
                        Cấp hiện tại: {selectedPart.level} / {selectedPartConfig.maxLevel}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-300">
                  {selectedPartConfig.description}
                </p>

                {/* Stats per level display */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 text-xs font-mono space-y-1">
                  <div className="text-[10px] text-zinc-400 font-serif">Mỗi Cấp Gia Tăng:</div>
                  <div className="flex flex-wrap gap-2 text-emerald-400">
                    {selectedPartConfig.statPerLevel.hp ? <span>+HP {selectedPartConfig.statPerLevel.hp}</span> : null}
                    {selectedPartConfig.statPerLevel.def ? <span>+DEF {selectedPartConfig.statPerLevel.def}</span> : null}
                    {selectedPartConfig.statPerLevel.atk ? <span>+ATK {selectedPartConfig.statPerLevel.atk}</span> : null}
                    {selectedPartConfig.statPerLevel.speed ? <span>+SPD {selectedPartConfig.statPerLevel.speed}</span> : null}
                    {selectedPartConfig.statPerLevel.damageReduction ? <span>+Miễn Thương {selectedPartConfig.statPerLevel.damageReduction}%</span> : null}
                    {selectedPartConfig.statPerLevel.hpRegen ? <span>+Hồi Huyết {selectedPartConfig.statPerLevel.hpRegen}%</span> : null}
                    {selectedPartConfig.statPerLevel.trueDmgPercent ? <span>+Sát Thương Chuẩn {selectedPartConfig.statPerLevel.trueDmgPercent}%</span> : null}
                  </div>
                </div>

                {/* Upgrade Cost & Action */}
                {selectedPart.level < selectedPartConfig.maxLevel ? (
                  (() => {
                    const costLinhThach = Math.floor(
                      selectedPartConfig.baseCostLinhThach * Math.pow(selectedPartConfig.costMultiplier, selectedPart.level)
                    );
                    const reqCount = Math.max(1, Math.floor((selectedPart.level + 1) / 10) + 1);

                    return (
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs font-mono space-y-1">
                          <div className="text-zinc-400">
                            Chi phí: <strong className="text-amber-300">{costLinhThach.toLocaleString()} Linh Thạch</strong>
                          </div>
                          <div className="text-zinc-400">
                            Vật phẩm: <strong className="text-rose-300">{selectedPartConfig.requiredMaterialName} x{reqCount}</strong>
                          </div>
                        </div>

                        <button
                          onClick={() => onUpgradePart(selectedPart.id)}
                          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-serif font-bold text-xs shadow-md hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition cursor-pointer"
                        >
                          Cường Hóa (Cấp {selectedPart.level + 1})
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-2 text-center text-xs font-serif text-amber-300">
                    Đã đạt cấp độ tối đa!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================================================== */}
          {/* CỘT 3: KHO LUYỆN THỂ & DƯỢC LIỆU (RIGHT - 3 cols) */}
          {/* ==================================================== */}
          <div className="lg:col-span-3 space-y-4">
            {/* Potential Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-950/40 via-[#151020] to-black/60 border border-purple-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-purple-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tiềm Năng Nhục Thân:</span>
                </span>
                <span className="text-xs font-mono font-bold text-purple-300">
                  {cultivation.physiquePotential} / {cultivation.maxPotential || 1000}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tiềm năng càng cao, tốc độ tu luyện thụ động và hiệu suất hấp thu đan dược càng nhanh.
              </p>
            </div>

            {/* Consumable Items List */}
            <div className="space-y-2.5">
              <div className="text-xs font-serif font-bold text-zinc-300 flex items-center justify-between">
                <span>VẬT PHẨM TÔI THỂ SỞ HỮU</span>
              </div>

              {/* 1. Tinh Huyết Yêu Thú */}
              <div className="p-3 rounded-xl border border-rose-900/40 bg-black/40 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-serif font-bold text-rose-300 flex items-center gap-1">
                    <span>🩸 Tinh Huyết Yêu Thú</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Sở hữu: <strong className="text-rose-400 font-mono">{tinhHuyetCount}</strong> giọt (+50 EXP/giọt)
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleUseItem('tinhHuyet', 1)}
                    disabled={tinhHuyetCount < 1}
                    className="px-2 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-[10px] font-mono disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Dùng 1
                  </button>
                  <button
                    onClick={() => handleUseItem('tinhHuyet', Math.min(10, tinhHuyetCount))}
                    disabled={tinhHuyetCount < 1}
                    className="px-2 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white text-[10px] font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Dùng 10
                  </button>
                </div>
              </div>

              {/* 2. Khí Huyết Đan */}
              <div className="p-3 rounded-xl border border-amber-900/40 bg-black/40 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1">
                    <span>💊 Khí Huyết Đan</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Sở hữu: <strong className="text-amber-400 font-mono">{khiHuyetPillCount}</strong> viên (+250 EXP)
                  </div>
                </div>

                <button
                  onClick={() => handleUseItem('pill_khi_huyet', 1)}
                  disabled={khiHuyetPillCount < 1}
                  className="px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-600 text-stone-950 text-[10px] font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Uống Đan
                </button>
              </div>

              {/* 3. Khí Huyết Đan Cực Phẩm */}
              <div className="p-3 rounded-xl border border-yellow-900/40 bg-black/40 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-serif font-bold text-yellow-300 flex items-center gap-1">
                    <span>✨ Khí Huyết Đan Cực Phẩm</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Sở hữu: <strong className="text-yellow-400 font-mono">{khiHuyetCucPhamCount}</strong> viên (+1,500 EXP)
                  </div>
                </div>

                <button
                  onClick={() => handleUseItem('pill_khi_huyet_cuc_pham', 1)}
                  disabled={khiHuyetCucPhamCount < 1}
                  className="px-2.5 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-stone-950 text-[10px] font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Uống Đan
                </button>
              </div>

              {/* 4. Tẩy Tủy Đan */}
              <div className="p-3 rounded-xl border border-teal-900/40 bg-black/40 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-serif font-bold text-teal-300 flex items-center gap-1">
                    <span>🧪 Tẩy Tủy Đan</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Sở hữu: <strong className="text-teal-400 font-mono">{tayTuyPillCount}</strong> viên (+80 Tiềm Năng)
                  </div>
                </div>

                <button
                  onClick={() => handleUseItem('pill_tay_tuy', 1)}
                  disabled={tayTuyPillCount < 1}
                  className="px-2.5 py-1 rounded bg-teal-700 hover:bg-teal-600 text-white text-[10px] font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Tẩy Tủy
                </button>
              </div>
            </div>

            {/* Lore Note */}
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-[11px] text-zinc-400 font-serif leading-relaxed">
              💡 <strong>Khuyên Bảo Tu Hành:</strong> Có thể tìm thêm Tinh Huyết Yêu Thú và Khí Huyết Đan tại Vạn Bảo Thương Hội hoặc săn Boss Yêu Thú để bồi dưỡng Nhục Thân siêu phàm!
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
