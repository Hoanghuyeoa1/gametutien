// components/abode/AbodeHubModal.tsx
// Giao diện Sa Bàn Động Thiên Phúc Địa (Homestead & Abode Core)

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Sprout,
  Shield,
  Coins,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  Award,
  BookOpen,
  ChevronRight,
  Flame,
  Droplets,
  Layers
} from 'lucide-react';
import { PlayerStats, Manual, Herb, LogType } from '@/lib/types';
import {
  AbodePlotState,
  AbodeSoilType,
  AbodeState,
  AbodeDisciple
} from '@/lib/types/abode';
import {
  SPIRIT_ARRAY_LEVELS,
  SOIL_CONFIGS,
  ABODE_LEVELS,
  PLOT_UNLOCK_COSTS,
  DISCIPLE_APTITUDE_CONFIG,
  DISCIPLE_RECRUIT_COST_LINH_THACH,
  HERB_ELEMENT_MAP,
  BEAST_FERTILIZER_TICK_SECONDS
} from '@/lib/abode-data';
import {
  calculateSpiritArrayBuffs,
  calculateSoilCropEfficiency
} from '@/lib/abode-logic';
import { HERB_SEEDS } from '@/lib/garden-data';
import { SanctuaryVeinView } from './SanctuaryVeinView';

export interface AbodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  abodeState: AbodeState;
  activeTab: 'array' | 'garden' | 'beasts' | 'pavilion' | 'sanctuary';
  setActiveTab: (tab: 'array' | 'garden' | 'beasts' | 'pavilion' | 'sanctuary') => void;
  onUpgradeSpiritArray: () => void;
  onUpgradeAbodeLevel: () => void;
  onUnlockPlot: (plotId: number) => void;
  onChangeSoilType: (plotId: number, soilType: AbodeSoilType) => void;
  onPlantSeed: (plotId: number, seedId: string) => void;
  onHarvestPlot: (plotId: number) => void;
  onHarvestAllPlots: () => void;
  onFertilizePlot: (plotId: number) => void;
  onAssignBeastToSanctuary: (beastId: string) => void;
  onClaimFertilizer: () => void;
  onShowcaseManual: (manualId: string) => void;
  onRecruitDisciple: () => void;
  onDismissDisciple: (discipleId: string) => void;
  onClaimDiscipleTribute: (discipleId: string) => void;
  onClaimAllDiscipleTributes: () => void;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast?: (msg: string) => void;
  onNavigateToMeditation?: (locationId: string) => void;
}

export const AbodeHubModal: React.FC<AbodeHubModalProps> = ({
  isOpen,
  onClose,
  player,
  abodeState,
  activeTab,
  setActiveTab,
  onUpgradeSpiritArray,
  onUpgradeAbodeLevel,
  onUnlockPlot,
  onChangeSoilType,
  onPlantSeed,
  onHarvestPlot,
  onHarvestAllPlots,
  onFertilizePlot,
  onAssignBeastToSanctuary,
  onClaimFertilizer,
  onShowcaseManual,
  onRecruitDisciple,
  onDismissDisciple,
  onClaimDiscipleTribute,
  onClaimAllDiscipleTributes,
  setPlayer,
  addLog,
  showToast,
  onNavigateToMeditation
}) => {
  // Current real-time ticker
  const [currentNow, setCurrentNow] = useState<number>(Date.now());
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setCurrentNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Dialog sub-modals
  const [activePlotForPlant, setActivePlotForPlant] = useState<number | null>(null);
  const [activePlotForSoil, setActivePlotForSoil] = useState<number | null>(null);
  const [showBeastPicker, setShowBeastPicker] = useState<boolean>(false);
  const [showManualPicker, setShowManualPicker] = useState<boolean>(false);

  // Buff computations
  const spiritArrayConfig = SPIRIT_ARRAY_LEVELS[abodeState.spiritArray.level] || SPIRIT_ARRAY_LEVELS[1];
  const nextSpiritConfig = SPIRIT_ARRAY_LEVELS[abodeState.spiritArray.level + 1];
  const currentAbodeConfig = ABODE_LEVELS[abodeState.level] || ABODE_LEVELS[1];
  const nextAbodeConfig = ABODE_LEVELS[abodeState.level + 1];

  // Disciples count & ready status
  const maxDisciples = currentAbodeConfig.maxDisciples;
  const currentDisciples = abodeState.scripturePavilion?.disciples || [];
  const readyTributesCount = currentDisciples.filter(d => currentNow >= d.tributeReadyAt).length;

  // Garden plots summary
  const plots = abodeState.plots || [];
  const readyHarvestCount = plots.filter(p => p.unlocked && p.seedId && p.harvestAt && currentNow >= p.harvestAt).length;
  const fertilizerCount = abodeState.beastSanctuary?.fertilizerStored || 0;

  // Beasts in sanctuary
  const roamingIds = abodeState.beastSanctuary?.roamingBeastIds || [];
  const roamingBeasts = useMemo(() => {
    return (player.beasts || []).filter(b => roamingIds.includes(b.id));
  }, [player.beasts, roamingIds]);

  const hasGodBeast = roamingBeasts.some(b => b.stage >= 3 || b.quality === 'than_pham');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl border border-amber-600/50 bg-gradient-to-b from-[#15121e] via-[#0d0b14] to-[#09080e] shadow-[0_0_50px_rgba(217,119,6,0.25)] text-zinc-200 overflow-hidden font-sans">
        
        {/* ======================================================== */}
        {/* 1. MODAL TOP HEADER */}
        {/* ======================================================== */}
        <div className="relative shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-amber-900/40 bg-gradient-to-r from-amber-950/60 via-[#1a1424] to-purple-950/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
          {/* Left Title & Level */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/40 to-yellow-600/20 border border-amber-500/50 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
              🏯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-amber-200 tracking-wide flex items-center gap-1.5">
                  ĐỘNG THIÊN PHÚC ĐỊA
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-normal">
                    {currentAbodeConfig.name} (Cấp {abodeState.level}/5)
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 font-serif">
                Tiên Phủ Bản Vị • Tụ Linh Khí Bát Hoang • Vạn Dược Dị Điền • Thần Thú Tụ Triều
              </p>
            </div>
          </div>

          {/* Right Controls: Currency & Upgrade Abode & Close */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Linh Thạch Balance */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-amber-900/50 text-xs font-mono font-bold text-yellow-300">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span>{player.linhThach.toLocaleString()} Linh Thạch</span>
            </div>

            {/* Nút nâng cấp Động Phủ */}
            {nextAbodeConfig && (
              <button
                onClick={onUpgradeAbodeLevel}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-700/80 to-yellow-600/80 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-serif font-bold text-xs shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition cursor-pointer flex items-center gap-1"
                title={`Nâng cấp lên ${nextAbodeConfig.name} (Cần: ${nextAbodeConfig.upgradeCostLinhThach.toLocaleString()} Linh thạch, Cảnh giới ${nextAbodeConfig.requiredRealm})`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Thăng Cấp Động Phủ</span>
                <span className="md:hidden">Thăng Cấp</span>
              </button>
            )}

            {/* Nút Đóng */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. 4-QUADRANT NAVIGATION TABS */}
        {/* ======================================================== */}
        <div className="shrink-0 px-3 sm:px-6 py-2 border-b border-amber-900/30 bg-[#0e0c16] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Tab 1: Tụ Linh Trận */}
          <button
            onClick={() => setActiveTab('array')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-serif text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === 'array'
                ? 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 text-purple-200 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] font-bold'
                : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <span>☯️</span>
            <span>Tụ Linh Đạo Đài</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
              Cấp {abodeState.spiritArray.level}/10 (+{spiritArrayConfig.tuViRateBonus}%)
            </span>
          </button>

          {/* Tab 2: Dược Viên 12 Ô */}
          <button
            onClick={() => setActiveTab('garden')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-serif text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === 'garden'
                ? 'bg-gradient-to-r from-emerald-950/80 to-teal-950/80 text-emerald-200 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold'
                : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <span>🌿</span>
            <span>Huyền Thiên Dược Viên</span>
            {readyHarvestCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold animate-pulse">
                {readyHarvestCount} chín
              </span>
            )}
          </button>

          {/* Tab 3: Linh Thú Viên */}
          <button
            onClick={() => setActiveTab('beasts')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-serif text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === 'beasts'
                ? 'bg-gradient-to-r from-amber-950/80 to-yellow-950/80 text-amber-200 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-bold'
                : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <span>🐾</span>
            <span>Linh Thú Thảo Nguyên</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
              {roamingIds.length}/3 Thú • 💩 {fertilizerCount}
            </span>
          </button>

          {/* Tab 4: Tàng Kinh Các & Đệ Tử */}
          <button
            onClick={() => setActiveTab('pavilion')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-serif text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === 'pavilion'
                ? 'bg-gradient-to-r from-sky-950/80 to-blue-950/80 text-sky-200 border border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.3)] font-bold'
                : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <span>📜</span>
            <span>Tàng Kinh Các & Đệ Tử</span>
            {readyTributesCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold animate-pulse">
                {readyTributesCount} bổng lộc
              </span>
            )}
          </button>

          {/* Tab 5: Linh Mạch Thần Đài */}
          <button
            onClick={() => setActiveTab('sanctuary')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-serif text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === 'sanctuary'
                ? 'bg-gradient-to-r from-teal-950/80 to-emerald-950/80 text-teal-200 border border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.3)] font-bold'
                : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <span>🏔️</span>
            <span>Linh Mạch Thần Đài</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono">
              Bậc {player.customSanctuary?.veinTier || 1}/9 • {player.customSanctuary?.socketedArrays?.length || 0}/{player.customSanctuary?.unlockedSockets || 1} Trận
            </span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. TAB CONTENT BODY (SCROLLABLE) */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ==================================================== */}
          {/* PHÂN KHU 1: TỤ LINH ĐẠO ĐÀI (SPIRIT GATHERING ARRAY) */}
          {/* ==================================================== */}
          {activeTab === 'array' && (
            <div className="space-y-6">
              {/* Array Center Showcase */}
              <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-[#100d1c] to-indigo-950/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                {/* Visual Glow Aura */}
                <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

                {/* Left: Bagua Visual */}
                <div className="relative flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-purple-500/40 flex items-center justify-center bg-purple-950/30 shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-400/50 animate-[spin_25s_linear_infinite]" />
                    <div className="absolute inset-5 rounded-full border border-purple-400/30 animate-[spin_18s_linear_infinite_reverse]" />
                    
                    {/* Center Bagua Symbol */}
                    <div className="text-5xl sm:text-6xl select-none filter drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-pulse">
                      ☯️
                    </div>

                    {/* Array Level Badge */}
                    <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-purple-900 border border-purple-400 text-amber-300 text-xs font-mono font-bold shadow-md">
                      CẤP {abodeState.spiritArray.level} / 10
                    </div>
                  </div>
                </div>

                {/* Right: Formation Details & Buffs */}
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400">
                      Cổ Thần Trận Pháp
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                      {spiritArrayConfig.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {spiritArrayConfig.description}
                    </p>
                  </div>

                  {/* Active Buffs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                      <div className="text-[10px] text-zinc-400">Tốc Độ Tu Vi Bế Quan:</div>
                      <div className="text-base font-mono font-bold text-purple-300">
                        +{spiritArrayConfig.tuViRateBonus}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                      <div className="text-[10px] text-zinc-400">Hồi Phục HP/MP Tự Nhiên:</div>
                      <div className="text-base font-mono font-bold text-indigo-300">
                        +{spiritArrayConfig.autoHealBonus}%
                      </div>
                    </div>
                    {spiritArrayConfig.gardenYieldBonus ? (
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                        <div className="text-[10px] text-zinc-400">Sản Lượng Dược Viên:</div>
                        <div className="text-base font-mono font-bold text-emerald-300">
                          +{spiritArrayConfig.gardenYieldBonus}%
                        </div>
                      </div>
                    ) : null}
                    {spiritArrayConfig.breakthroughBonus ? (
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                        <div className="text-[10px] text-zinc-400">Tỷ Lệ Đột Phá:</div>
                        <div className="text-base font-mono font-bold text-amber-300">
                          +{spiritArrayConfig.breakthroughBonus}%
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Next Tier Upgrade Info */}
                  {nextSpiritConfig ? (
                    <div className="p-3.5 rounded-xl bg-black/40 border border-purple-800/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-serif">Kế tiếp: [Cấp {nextSpiritConfig.level} - {nextSpiritConfig.name}]</span>
                        <span className="text-purple-300 font-mono font-bold">+{nextSpiritConfig.tuViRateBonus}% Tu Vi</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/40 text-amber-300 font-mono">
                          🪙 {nextSpiritConfig.costLinhThach.toLocaleString()} Linh Thạch
                        </span>
                        {nextSpiritConfig.requiredFlagName && (
                          <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-600/40 text-purple-300 font-mono">
                            🚩 {nextSpiritConfig.requiredFlagName} x{nextSpiritConfig.requiredFlagCount}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={onUpgradeSpiritArray}
                        className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white font-serif font-bold text-sm shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span>Khai Mở Đại Trận Cấp {nextSpiritConfig.level}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/50 text-amber-300 text-xs font-serif text-center font-bold">
                      🌟 Đại Trận đã đạt tới cảnh giới Viên Mãn tối thượng!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PHÂN KHU 2: HUYỀN THIÊN DƯỢC VIÊN (12-PLOT GARDEN) */}
          {/* ==================================================== */}
          {activeTab === 'garden' && (
            <div className="space-y-4">
              {/* Garden Control Bar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#101915] to-teal-950/40 border border-emerald-800/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-emerald-200">
                      Huyền Thiên Dược Viên (12 Ô Thổ Nhưỡng Dị Biến)
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Nuôi trồng kỳ hoa dị thảo làm nguyên liệu cho Luyện Đan Phòng
                    </p>
                  </div>
                  {/* Fertilizer Pill in Garden */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-amber-700/40 text-xs font-mono text-amber-300">
                    <span>💩</span>
                    <span>Phân bón: <strong>{fertilizerCount}</strong> túi</span>
                  </div>
                </div>

                {/* Quick harvest all */}
                <div className="flex items-center gap-2">
                  {readyHarvestCount > 0 && (
                    <button
                      onClick={onHarvestAllPlots}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-serif font-bold text-xs shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition cursor-pointer flex items-center gap-1.5 animate-pulse"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Thu Hoạch Toàn Bộ ({readyHarvestCount})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Soil System Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-600/30 flex items-center gap-2">
                  <span className="text-lg">🌾</span>
                  <div>
                    <div className="font-bold text-amber-300">Hoàng Thổ Thường</div>
                    <div className="text-[10px] text-zinc-400">Đất màu phì nhiêu, gieo trồng mọi loại thảo dược.</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/40 flex items-center gap-2">
                  <span className="text-lg">❄️</span>
                  <div>
                    <div className="font-bold text-cyan-300">Hàn Băng Thổ</div>
                    <div className="text-[10px] text-zinc-400">-40% tg Thủy Thảo, 30% rớt Băng Tinh Ngọc!</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-600/40 flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <div>
                    <div className="font-bold text-rose-300">Hỏa Diễm Thổ</div>
                    <div className="text-[10px] text-zinc-400">-40% tg Hỏa Thảo, +50% sản lượng!</div>
                  </div>
                </div>
              </div>

              {/* 12-Plot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {plots.map((plot) => {
                  const soilConf = SOIL_CONFIGS[plot.soilType] || SOIL_CONFIGS.hoang_tho;
                  const seed = plot.seedId ? HERB_SEEDS.find(s => s.id === plot.seedId) : null;
                  const isMature = Boolean(plot.harvestAt && currentNow >= plot.harvestAt);
                  const isPlanted = Boolean(plot.seedId && plot.harvestAt);

                  // Remaining time
                  let remainingSeconds = 0;
                  let progressPercent = 0;
                  if (isPlanted && plot.plantedAt && plot.harvestAt) {
                    const totalMs = plot.harvestAt - plot.plantedAt;
                    const elapsedMs = currentNow - plot.plantedAt;
                    progressPercent = Math.min(100, Math.max(0, Math.floor((elapsedMs / totalMs) * 100)));
                    remainingSeconds = Math.max(0, Math.ceil((plot.harvestAt - currentNow) / 1000));
                  }

                  return (
                    <div
                      key={plot.id}
                      className={`relative rounded-xl border p-3 flex flex-col justify-between transition min-h-[175px] shadow-sm ${
                        !plot.unlocked
                          ? 'border-zinc-800 bg-zinc-950/40 opacity-75'
                          : isMature
                          ? 'border-amber-400 bg-gradient-to-b from-amber-950/30 to-black/60 shadow-[0_0_18px_rgba(251,191,36,0.3)]'
                          : `${soilConf.borderColor} ${soilConf.bgColor}`
                      }`}
                    >
                      {/* Top Header of Plot: ID and Soil Badge */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-zinc-400">
                          #{plot.id + 1}
                        </span>
                        {plot.unlocked && (
                          <button
                            onClick={() => setActivePlotForSoil(plot.id)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-serif border cursor-pointer hover:brightness-125 transition flex items-center gap-1 ${soilConf.color} ${soilConf.borderColor} bg-black/40`}
                            title="Bấm để đổi hệ thổ nhưỡng"
                          >
                            <span>{plot.soilType === 'han_bang' ? '❄️' : plot.soilType === 'hoa_diem' ? '🔥' : '🌾'}</span>
                            <span>{soilConf.name.split(' ')[0]}</span>
                          </button>
                        )}
                      </div>

                      {/* Content Area */}
                      {!plot.unlocked ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-3">
                          <span className="text-2xl">🔒</span>
                          <span className="text-xs text-zinc-400 font-serif">Ô Đất Chưa Khai Khẩn</span>
                          <button
                            onClick={() => onUnlockPlot(plot.id)}
                            className="px-3 py-1 rounded bg-amber-700/80 hover:bg-amber-600 text-stone-950 text-xs font-mono font-bold transition cursor-pointer shadow-sm"
                          >
                            Khai Khẩn ({(PLOT_UNLOCK_COSTS[plot.id] || 5000).toLocaleString()} 🪙)
                          </button>
                        </div>
                      ) : !plot.seedId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-3">
                          <span className="text-2xl opacity-40">🌱</span>
                          <span className="text-xs text-zinc-400 font-serif">Đất màu phì nhiêu</span>
                          <button
                            onClick={() => setActivePlotForPlant(plot.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-serif font-bold transition cursor-pointer shadow-sm flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Gieo Hạt</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-serif font-bold text-amber-200">
                                {seed?.herbName || 'Linh Dược'}
                              </span>
                              {plot.fertilized && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Đã bón phân
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                              <span>Phẩm: {seed?.grade || 'Nhất Phẩm'}</span>
                            </div>
                          </div>

                          {/* Progress Bar & Timer */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-400">
                                {isMature ? 'Đã chín mùi' : `Còn lại: ${remainingSeconds}s`}
                              </span>
                              <span className="text-emerald-400">{progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  isMature
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Bottom Action: Harvest or Fertilize */}
                          <div className="pt-1 flex items-center gap-1.5">
                            {isMature ? (
                              <button
                                onClick={() => onHarvestPlot(plot.id)}
                                className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-serif font-bold text-xs shadow-md hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-1 animate-bounce"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Thu Hoạch</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onFertilizePlot(plot.id)}
                                disabled={plot.fertilized || fertilizerCount <= 0}
                                className={`w-full py-1 rounded text-[11px] font-serif transition flex items-center justify-center gap-1 ${
                                  plot.fertilized || fertilizerCount <= 0
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/50 cursor-pointer'
                                }`}
                                title={
                                  plot.fertilized
                                    ? 'Đã bón phân'
                                    : fertilizerCount <= 0
                                    ? 'Hết phân bón'
                                    : 'Bón phân rút ngắn 30-50% thời gian'
                                }
                              >
                                <span>💩 Bón Phân</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PHÂN KHU 3: LINH THÚ VIÊN & PHÂN BÓN (BEAST SANCTUARY) */}
          {/* ==================================================== */}
          {activeTab === 'beasts' && (
            <div className="space-y-6">
              {/* Sanctuary Banner */}
              <div className="p-4 rounded-2xl border border-amber-700/40 bg-gradient-to-r from-amber-950/30 via-[#181216] to-yellow-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                    Thảo Nguyên Động Phủ
                  </div>
                  <h3 className="text-lg font-serif font-bold text-amber-200">
                    Linh Thú Thả Rông & Cơ Chế Sinh Phân Bón
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Linh thú tự do dạo chơi hấp thụ tinh hoa thổ nhưỡng, mỗi chu kỳ sản sinh Linh Phân gia tốc Dược Viên!
                  </p>
                </div>

                {/* Fertilizer Collection Card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-amber-600/40 shrink-0">
                  <div className="text-3xl">💩</div>
                  <div>
                    <div className="text-[10px] text-zinc-400">Kho Linh Phân:</div>
                    <div className="text-base font-mono font-bold text-amber-300">
                      {fertilizerCount} Túi
                      <span className="text-[10px] ml-1 font-normal text-amber-400">
                        ({hasGodBeast ? 'Thần Thú Phân: -50% tg' : 'Yêu Thú Phân: -30% tg'})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClaimFertilizer}
                    className="ml-2 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Thu Gom
                  </button>
                </div>
              </div>

              {/* 3 Roaming Beast Platforms */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-serif font-bold text-zinc-300 uppercase tracking-wide">
                    Đài Thả Rông (Tối đa 3 Linh Thú: {roamingIds.length}/3)
                  </h4>
                  <button
                    onClick={() => setShowBeastPicker(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-serif flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chọn Thú Thả Rông</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[0, 1, 2].map((slotIdx) => {
                    const beastId = roamingIds[slotIdx];
                    const beast = beastId ? (player.beasts || []).find(b => b.id === beastId) : null;

                    return (
                      <div
                        key={slotIdx}
                        className="rounded-xl border border-amber-900/40 bg-zinc-900/50 p-4 flex flex-col justify-between min-h-[160px] relative overflow-hidden"
                      >
                        {beast ? (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                                {beast.avatar || '🐾'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-serif font-bold text-amber-200 truncate">
                                  {beast.name}
                                </h5>
                                <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                                  <span className="capitalize">{beast.species}</span>
                                  <span>•</span>
                                  <span className="text-amber-300 font-mono">
                                    Cấp {beast.level} ({beast.stage >= 3 ? 'Thần Thú' : beast.stage >= 2 ? 'Thành Niên' : 'Ấu Niên'})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 p-2 rounded-lg bg-black/40 text-[11px] text-zinc-300 font-serif flex items-center justify-between">
                              <span className="text-emerald-400">✨ Tự do dạo chơi</span>
                              <span className="text-amber-300 font-mono">
                                +1 Phân / 30ph
                              </span>
                            </div>

                            <button
                              onClick={() => onAssignBeastToSanctuary(beast.id)}
                              className="mt-3 w-full py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer"
                            >
                              Thu Hồi Về Túi
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-4">
                            <span className="text-2xl opacity-30">🐾</span>
                            <span className="text-xs text-zinc-500 font-serif">Đài Thả Rông #{slotIdx + 1} Còn Trống</span>
                            <button
                              onClick={() => setShowBeastPicker(true)}
                              className="px-3 py-1 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 border border-amber-700/40 text-xs font-serif transition cursor-pointer"
                            >
                              Thả Linh Thú
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PHÂN KHU 4: TÀNG KINH CÁC & ĐỆ TỬ BÁI SƯ (PAVILION) */}
          {/* ==================================================== */}
          {activeTab === 'pavilion' && (
            <div className="space-y-6">
              {/* Scripture Showcase Pavilion */}
              <div className="p-4 rounded-2xl border border-sky-800/40 bg-gradient-to-r from-sky-950/30 via-[#10141f] to-indigo-950/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-sky-200 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>Tàng Kinh Các Tiên Gia (Trưng Bày Tối Đa 5 Bí Kíp)</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Công pháp trưng bày càng thâm hậu sẽ gia tăng tỷ lệ thu hút Đệ Tử Thiên Kiêu bái sư!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowManualPicker(true)}
                    className="px-3 py-1 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-serif font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Bí Kíp Trưng Bày</span>
                  </button>
                </div>

                {/* 5 Scripture Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const manualId = abodeState.scripturePavilion?.showcasedManualIds?.[idx];
                    const manual = manualId ? (player.manuals || []).find(m => m.id === manualId) : null;

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-sky-900/40 bg-black/40 p-3 flex flex-col justify-between min-h-[110px]"
                      >
                        {manual ? (
                          <>
                            <div>
                              <div className="text-[10px] text-sky-400 font-mono">Kệ Thư #{idx + 1}</div>
                              <h5 className="text-xs font-serif font-bold text-amber-200 truncate mt-0.5">
                                {manual.name}
                              </h5>
                              <div className="text-[10px] text-zinc-400 mt-0.5">
                                {manual.grade}
                              </div>
                            </div>
                            <button
                              onClick={() => onShowcaseManual(manual.id)}
                              className="text-[10px] text-rose-400 hover:text-rose-300 font-serif text-right mt-2 cursor-pointer"
                            >
                              Gỡ Khỏi Kệ
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-1">
                            <span className="text-xs opacity-40">📜</span>
                            <span className="text-[10px] text-zinc-500 font-serif">Kệ Trống #{idx + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Disciples Hall (Đệ Tử Bái Sư) */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#181418] to-purple-950/30 border border-amber-800/40 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5">
                      <span>Đệ Tử Nhập Môn ({currentDisciples.length}/{maxDisciples})</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Đệ tử tham ngộ kinh thư định kỳ cống nạp Linh Thạch, Dược Liệu và Danh Vọng cho Sư Phụ
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {readyTributesCount > 0 && (
                      <button
                        onClick={onClaimAllDiscipleTributes}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-serif font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1 animate-pulse"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Thu Bổng Lộc Toàn Bộ ({readyTributesCount})</span>
                      </button>
                    )}

                    <button
                      onClick={onRecruitDisciple}
                      disabled={currentDisciples.length >= maxDisciples}
                      className={`px-3 py-1.5 rounded-lg font-serif font-bold text-xs shadow-sm transition flex items-center gap-1 ${
                        currentDisciples.length >= maxDisciples
                          ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tầm Đạo Thu Đồ ({DISCIPLE_RECRUIT_COST_LINH_THACH.toLocaleString()} 🪙)</span>
                    </button>
                  </div>
                </div>

                {/* Disciples List */}
                {currentDisciples.length === 0 ? (
                  <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/40 text-center space-y-2">
                    <span className="text-3xl opacity-40">🧑‍🎓</span>
                    <h4 className="text-sm font-serif text-zinc-400">Môn Hạ Chưa Có Đệ Tử</h4>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Hãy bấm &quot;Tầm Đạo Thu Đồ&quot; để phát tiên thư chiêu mộ kỳ tài khắp thiên hạ bái nhập sơn môn!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentDisciples.map((disciple) => {
                      const aptConf = DISCIPLE_APTITUDE_CONFIG[disciple.aptitude] || DISCIPLE_APTITUDE_CONFIG.ha;
                      const isReady = currentNow >= disciple.tributeReadyAt;
                      const remainHours = Math.max(0, Math.ceil((disciple.tributeReadyAt - currentNow) / (1000 * 60 * 60)));

                      return (
                        <div
                          key={disciple.id}
                          className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 bg-zinc-900/60 ${
                            isReady
                              ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                              : 'border-zinc-800'
                          }`}
                        >
                          {/* Top: Avatar & Name & Aptitude */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-950/60 to-purple-950/40 border border-amber-600/40 flex items-center justify-center text-2xl shrink-0">
                              {disciple.avatar || '👨‍🎓'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-serif font-bold text-amber-200 truncate">
                                {disciple.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] px-2 py-0.2 rounded-full border font-mono font-bold ${aptConf.badgeBg} ${aptConf.color}`}>
                                  {aptConf.name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="p-2.5 rounded-lg bg-black/40 text-xs font-mono space-y-1">
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Trạng thái:</span>
                              <span className={isReady ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                                {isReady ? '✨ Chuẩn bị xong bổng lộc' : `Đang bế quan (${remainHours}h)`}
                              </span>
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              Bổng lộc ước tính: ~{aptConf.minLinhThach}-{aptConf.maxLinhThach} 🪙 + Dược liệu
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            {isReady ? (
                              <button
                                onClick={() => onClaimDiscipleTribute(disciple.id)}
                                className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-serif font-bold text-xs shadow-md hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-1 animate-bounce"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Nhận Bổng Lộc</span>
                              </button>
                            ) : (
                              <div className="flex-1 py-1.5 rounded-lg bg-zinc-800 text-zinc-500 text-xs font-serif text-center">
                                Đang tham ngộ kinh thư...
                              </div>
                            )}

                            <button
                              onClick={() => onDismissDisciple(disciple.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-serif transition cursor-pointer"
                              title="Trục xuất đệ tử hạ sơn"
                            >
                              Hạ Sơn
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* PHÂN KHU 5: LINH MẠCH THẦN ĐÀI (TỰ CHẾ LINH ĐỊA) */}
          {/* ==================================================== */}
          {activeTab === 'sanctuary' && (
            <SanctuaryVeinView
              player={player}
              setPlayer={setPlayer || (() => {})}
              addLog={addLog || (() => {})}
              showToast={showToast || (() => {})}
              onNavigateToMeditation={onNavigateToMeditation}
              onCloseParentModal={onClose}
            />
          )}

        </div>

        {/* ======================================================== */}
        {/* 4. DIALOG: CHỌN HẠT GIỐNG GIEO TRỒNG */}
        {/* ======================================================== */}
        {activePlotForPlant !== null && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-emerald-600/50 bg-[#121815] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2.5">
                <h4 className="text-sm font-serif font-bold text-emerald-200 flex items-center gap-2">
                  <span>🌱 Gieo Hạt Tại Ô Đất #{activePlotForPlant + 1}</span>
                </h4>
                <button
                  onClick={() => setActivePlotForPlant(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {HERB_SEEDS.map((seed) => {
                  const targetPlot = plots.find(p => p.id === activePlotForPlant);
                  const soilType = targetPlot?.soilType || 'hoang_tho';
                  const soilEff = calculateSoilCropEfficiency(soilType, seed.id);
                  const reducedDuration = Math.max(5, Math.floor(seed.growthDurationSeconds * soilEff.growthTimeMultiplier));

                  return (
                    <div
                      key={seed.id}
                      onClick={() => {
                        onPlantSeed(activePlotForPlant, seed.id);
                        setActivePlotForPlant(null);
                      }}
                      className="p-3 rounded-xl border border-emerald-900/40 bg-black/40 hover:bg-emerald-950/40 hover:border-emerald-500/60 transition cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif font-bold text-amber-200">
                            {seed.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            ({seed.grade})
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          Thời gian: <strong className="text-emerald-300 font-mono">{reducedDuration}s</strong>
                          {soilEff.isSynergized && (
                            <span className="ml-1 text-cyan-300 font-mono font-bold">(Hợp Đất -40%!)</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded bg-amber-950 border border-amber-600/40 text-amber-300 font-mono text-xs font-bold">
                          {seed.costLinhThach} 🪙
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. DIALOG: CHỌN HỆ THỔ NHƯỠNG CẢI TẠO */}
        {/* ======================================================== */}
        {activePlotForSoil !== null && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-amber-600/50 bg-[#161219] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-2.5">
                <h4 className="text-sm font-serif font-bold text-amber-200">
                  Cải Tạo Thổ Nhưỡng Ô Đất #{activePlotForSoil + 1}
                </h4>
                <button
                  onClick={() => setActivePlotForSoil(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {(['hoang_tho', 'han_bang', 'hoa_diem'] as AbodeSoilType[]).map((type) => {
                  const conf = SOIL_CONFIGS[type];
                  return (
                    <div
                      key={type}
                      onClick={() => {
                        onChangeSoilType(activePlotForSoil, type);
                        setActivePlotForSoil(null);
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-1 hover:brightness-125 ${conf.borderColor} ${conf.bgColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-serif font-bold ${conf.color}`}>
                          {type === 'han_bang' ? '❄️ ' : type === 'hoa_diem' ? '🔥 ' : '🌾 '}
                          {conf.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {conf.switchCostLinhThach.toLocaleString()} 🪙
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        {conf.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. DIALOG: CHỌN LINH THÚ THẢ RÔNG */}
        {/* ======================================================== */}
        {showBeastPicker && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-amber-600/50 bg-[#151218] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-2.5">
                <h4 className="text-sm font-serif font-bold text-amber-200">
                  Chọn Linh Thú Thả Rông ({roamingIds.length}/3)
                </h4>
                <button
                  onClick={() => setShowBeastPicker(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {(player.beasts || []).length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400 font-serif">
                    Bạn chưa có linh thú nào! Hãy ấp nở Linh Noãn ở tab Linh Thú trước.
                  </div>
                ) : (
                  (player.beasts || []).map((beast) => {
                    const isRoaming = roamingIds.includes(beast.id);
                    return (
                      <div
                        key={beast.id}
                        onClick={() => {
                          onAssignBeastToSanctuary(beast.id);
                          setShowBeastPicker(false);
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isRoaming
                            ? 'border-amber-500 bg-amber-950/40'
                            : 'border-zinc-800 bg-black/40 hover:border-amber-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{beast.avatar || '🐾'}</span>
                          <div>
                            <div className="text-xs font-serif font-bold text-amber-200">
                              {beast.name}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              Cấp {beast.level} • {beast.stage >= 3 ? 'Thần Thú' : beast.stage >= 2 ? 'Thành Niên' : 'Ấu Niên'}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded font-serif ${isRoaming ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                          {isRoaming ? 'Đang Dạo Chơi' : 'Thả Rông'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. DIALOG: CHỌN CÔNG PHÁP TRƯNG BÀY TÀNG KINH CÁC */}
        {/* ======================================================== */}
        {showManualPicker && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-sky-600/50 bg-[#10141f] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-sky-900/40 pb-2.5">
                <h4 className="text-sm font-serif font-bold text-sky-200">
                  Chọn Công Pháp Trưng Bày Lên Kệ
                </h4>
                <button
                  onClick={() => setShowManualPicker(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {(player.manuals || []).length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400 font-serif">
                    Bạn chưa tu luyện bí kíp công pháp nào!
                  </div>
                ) : (
                  (player.manuals || []).map((manual) => {
                    const isShowcased = (abodeState.scripturePavilion?.showcasedManualIds || []).includes(manual.id);
                    return (
                      <div
                        key={manual.id}
                        onClick={() => {
                          onShowcaseManual(manual.id);
                          setShowManualPicker(false);
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isShowcased
                            ? 'border-sky-500 bg-sky-950/40'
                            : 'border-zinc-800 bg-black/40 hover:border-sky-600/50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-serif font-bold text-sky-200">
                            {manual.name}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {manual.grade}
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded font-serif ${isShowcased ? 'bg-sky-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                          {isShowcased ? 'Đã Trưng Bày' : 'Đặt Lên Kệ'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
