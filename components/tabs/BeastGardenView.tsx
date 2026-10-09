// components/tabs/BeastGardenView.tsx
// Phân khu Thú Uyển Động Phủ (Lạc Viên, Thần Đàn Lai Tạo, Ấp Noãn Trì & Thối Huyết Thần Đỉnh)

import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Heart,
  Zap,
  Flame,
  Clock,
  Swords,
  Crown,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  ChevronRight,
  Droplets,
  Layers,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Egg,
  Compass
} from 'lucide-react';
import { PlayerStats } from '@/lib/types/player';
import { SpiritBeast, BeastEgg } from '@/lib/types/beasts';
import {
  BLOODLINE_TIER_NAMES,
  BLOODLINE_TIER_COLORS,
  ELEMENT_ICONS,
  BREEDING_CATALYSTS,
  areElementsCompatible
} from '@/lib/beast-breeding-logic';
import { useBeastGardenActions } from '@/hooks/useBeastGardenActions';
import { BloodlineTier, BeastElement } from '@/lib/types/beasts';

const getTierName = (tier?: number): string => {
  const t = (tier || 2) as BloodlineTier;
  return BLOODLINE_TIER_NAMES[t] || 'Linh Thú';
};

const getTierColor = (tier?: number) => {
  const t = (tier || 2) as BloodlineTier;
  return BLOODLINE_TIER_COLORS[t] || BLOODLINE_TIER_COLORS[2];
};

const getElementIcon = (elem?: string): string => {
  if (!elem) return '🐾';
  return (ELEMENT_ICONS as Record<string, string>)[elem] || '✨';
};

export interface BeastGardenViewProps {
  player: PlayerStats;
  onUpdatePlayer: (updated: PlayerStats) => void;
  onAddLog: (title: string, content: string, type: any) => void;
  onShowToast: (msg: string) => void;
  onBackToMain?: () => void;
}

export const BeastGardenView: React.FC<BeastGardenViewProps> = ({
  player,
  onUpdatePlayer,
  onAddLog,
  onShowToast,
  onBackToMain
}) => {
  const {
    activeGardenSubTab,
    setActiveGardenSubTab,
    selectedParentAId,
    setSelectedParentAId,
    selectedParentBId,
    setSelectedParentBId,
    selectedCatalystId,
    setSelectedCatalystId,
    selectedBeastForEvolveId,
    setSelectedBeastForEvolveId,
    isProcessing,
    facility,
    beasts,
    eggs,
    parentA,
    parentB,
    breedingPreview,
    eligibility,
    catalysts,
    handleStartBreeding,
    handleHatchEgg,
    handleSpeedUpIncubation,
    handleEvolveBloodline,
    handleToggleEquipBeast,
    handleUpgradeFacility
  } = useBeastGardenActions({
    player,
    onUpdatePlayer,
    onAddLog,
    onShowToast
  });

  const [filterElement, setFilterElement] = useState<string>('all');
  const activeMountId = player.beastGarden?.activeMountId || player.beastsState?.activeMountBeastId;
  const activeCombatId = player.beastGarden?.activeCombatId || player.beastsState?.activeCombatBeastId || player.activeBeastId;

  const filteredBeasts = beasts.filter(b => {
    if (filterElement === 'all') return true;
    return b.element === filterElement;
  });

  const beastForEvolution = beasts.find(b => b.id === selectedBeastForEvolveId) || beasts[0] || null;

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. HEADER BANNER: THÚ UYỂN ĐỘNG PHỦ */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-stone-950 via-[#181318] to-stone-900 p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-2xl animate-pulse">🐾</span>
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                Động Phủ Bí Cảnh · Thú Uyển Tiên Cung (Cấp {facility.level})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Sức Chứa Lồng Ấp: {eggs.length}/{facility.maxBreedingSlots}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-sm">
              Tiến Hóa Huyết Mạch & Lai Tạo Thần Thú
            </h2>
            <p className="text-xs md:text-sm text-zinc-300 font-serif max-w-2xl leading-relaxed">
              Dung hợp ngũ hành tương sinh, thức tỉnh huyết mạch nguyên sơ từ Phàm Thú ➔ Thái Cổ Hung Thú.
              Sáng tạo Dị Chủng Biến Dị sở hữu thần năng <strong className="text-amber-300">Chiến Tọa Song Toàn</strong> (Vừa Cưỡi Vừa Xuất Chiến).
            </p>
          </div>

          {/* Right Action: Facility Info & Upgrade */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={handleUpgradeFacility}
              disabled={facility.level >= 5}
              className={`px-4 py-2 rounded-xl font-serif text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
                facility.level >= 5
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 text-stone-950 border border-amber-300/40 cursor-pointer shadow-amber-900/40'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>{facility.level >= 5 ? 'Cấp Tối Cao (Vạn Thú Cung)' : `Nâng Cấp Cấp ${facility.level + 1}`}</span>
            </button>
            <div className="text-[10px] text-zinc-400 font-mono text-right">
              Tốc độ ấp: <span className="text-emerald-400">{facility.incubationSpeedMultiplier}x</span> | Tỷ lệ đột biến: <span className="text-amber-400">+{facility.mutationRateBonus}%</span>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveGardenSubTab('beasts')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 cursor-pointer ${
              activeGardenSubTab === 'beasts'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80'
            }`}
          >
            <span>🏡 Linh Thú Lạc Viên ({beasts.length})</span>
          </button>

          <button
            onClick={() => setActiveGardenSubTab('altar')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 cursor-pointer ${
              activeGardenSubTab === 'altar'
                ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-yellow-300 border border-yellow-500/50 shadow-md'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>🔥 Lai Tạo Thần Đàn</span>
          </button>

          <button
            onClick={() => setActiveGardenSubTab('incubator')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 cursor-pointer relative ${
              activeGardenSubTab === 'incubator'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:bg-zinc-800/80'
            }`}
          >
            <Egg className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ấp Noãn Trì & Tiến Hóa ({eggs.length})</span>
            {eggs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -top-1 -right-1" />
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PHÂN KHU 1: LINH THÚ LẠC VIÊN (BEAST SANCTUARY LIST) */}
      {/* ======================================================== */}
      {activeGardenSubTab === 'beasts' && (
        <div className="space-y-6">
          {/* Element Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs font-serif">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Lọc hệ nguyên tố:</span>
              <div className="flex flex-wrap gap-1">
                {['all', 'Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', 'Lôi', 'Phong', 'Âm Dương', 'Hỗn Độn'].map(elem => (
                  <button
                    key={elem}
                    onClick={() => setFilterElement(elem)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition cursor-pointer ${
                      filterElement === elem
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {elem === 'all' ? 'Tất cả' : `${getElementIcon(elem)} ${elem}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Hiển thị: <strong className="text-amber-300">{filteredBeasts.length}</strong> / {beasts.length} linh thú
            </div>
          </div>

          {/* Beast Cards Grid */}
          {filteredBeasts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-zinc-800/80 bg-zinc-950/40 space-y-3">
              <span className="text-4xl opacity-40">🐾</span>
              <p className="text-sm font-serif text-zinc-400">Chưa có linh thú nào thuộc hệ này trong Thú Uyển.</p>
              <button
                onClick={() => setActiveGardenSubTab('altar')}
                className="px-4 py-2 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs transition cursor-pointer"
              >
                Tới Thần Đàn Lai Tạo Thú Mới
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBeasts.map(beast => {
                const tier = beast.tier || 2;
                const tierConf = getTierColor(tier);
                const isMount = activeMountId === beast.id;
                const isCombat = activeCombatId === beast.id;
                const isBoth = isMount && isCombat;
                const purity = beast.bloodlinePurity || 30;
                const isHybrid = Boolean(beast.isHybrid);
                const elem = (beast.element as any) || 'Hỏa';

                return (
                  <div
                    key={beast.id}
                    className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 backdrop-blur-md ${
                      isBoth
                        ? 'border-amber-400/90 bg-gradient-to-b from-amber-950/40 via-stone-950/80 to-[#1e1710] shadow-xl shadow-amber-900/20 ring-1 ring-amber-400/50'
                        : isHybrid
                        ? 'border-purple-500/60 bg-gradient-to-b from-purple-950/30 via-stone-950/80 to-stone-950 shadow-lg'
                        : 'border-zinc-800 bg-stone-950/70 hover:border-zinc-700'
                    }`}
                  >
                    {/* Top Header: Avatar, Name, Badges */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-2xl shadow-inner shrink-0">
                            {beast.avatar || '🐾'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-serif font-bold text-sm text-zinc-100 hover:text-amber-200 transition">
                                {beast.name}
                              </h3>
                              {isHybrid && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                  F{beast.generation || 1}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-serif font-bold border ${tierConf.bg} ${tierConf.text} ${tierConf.border}`}>
                                {getTierName(tier)}
                              </span>
                              <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                                <span>{getElementIcon(elem)}</span>
                                <span>{elem}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {beast.isLockedInBreeding ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-serif bg-red-950/60 text-red-300 border border-red-500/40 flex items-center gap-1 animate-pulse">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Đang Phối</span>
                            </span>
                          ) : isBoth ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-serif bg-amber-500/20 text-amber-300 border border-amber-400/60 font-bold shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Chiến Tọa</span>
                            </span>
                          ) : isMount ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-serif bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                              🏇 Tọa Kỵ
                            </span>
                          ) : isCombat ? (
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-serif bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                              ⚔️ Chiến Thú
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-zinc-400 font-serif line-clamp-2 italic">
                        {beast.description || 'Linh thú thần bí dưỡng tại Động Phủ.'}
                      </p>
                    </div>

                    {/* Stats Gauges */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      {/* Purity Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <span>🩸 Thuần Khiết Huyết Mạch</span>
                          </span>
                          <span className="text-amber-400 font-bold">{purity}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 transition-all duration-500"
                            style={{ width: `${purity}%` }}
                          />
                        </div>
                      </div>

                      {/* Combat & Speed Stats */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/60">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Compass className="w-3 h-3 text-emerald-400" />
                          <span>Tốc độ: +{beast.travelSpeedBonus || beast.stats?.mountSpeedBonus || 15}%</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-400">
                          <Swords className="w-3 h-3 text-red-400" />
                          <span>Công: +{beast.combatStats?.atkBonus || beast.stats?.atk || 50}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400">
                          <Shield className="w-3 h-3 text-blue-400" />
                          <span>Thủ: +{beast.combatStats?.defBonus || beast.stats?.def || 30}</span>
                        </div>
                        <div className="flex items-center gap-1 text-rose-400">
                          <Heart className="w-3 h-3 text-rose-400" />
                          <span>Khí Huyết: +{beast.combatStats?.hpBonus || beast.stats?.hp || 300}</span>
                        </div>
                      </div>

                      {/* Innate Aura Badge if present */}
                      {beast.innateAura && (
                        <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[10px] space-y-0.5">
                          <div className="flex items-center gap-1 font-serif font-bold text-purple-300">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>Thiên Phú: {beast.innateAura.name}</span>
                          </div>
                          <p className="text-zinc-400 font-serif leading-tight">
                            {beast.innateAura.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-1.5">
                      {/* Equip Mount */}
                      <button
                        onClick={() => handleToggleEquipBeast(beast.id, 'mount')}
                        disabled={beast.isLockedInBreeding}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-serif transition flex items-center justify-center gap-1 cursor-pointer ${
                          isMount
                            ? 'bg-emerald-600 text-stone-950 font-bold shadow-md'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        } ${beast.isLockedInBreeding ? 'opacity-40 cursor-not-allowed' : ''}`}
                        title="Gán làm Tọa Kỵ di chuyển"
                      >
                        <span>🏇 {isMount ? 'Đang Cưỡi' : 'Cưỡi'}</span>
                      </button>

                      {/* Equip Combat */}
                      <button
                        onClick={() => handleToggleEquipBeast(beast.id, 'combat')}
                        disabled={beast.isLockedInBreeding}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-serif transition flex items-center justify-center gap-1 cursor-pointer ${
                          isCombat
                            ? 'bg-cyan-600 text-stone-950 font-bold shadow-md'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        } ${beast.isLockedInBreeding ? 'opacity-40 cursor-not-allowed' : ''}`}
                        title="Gán làm Chiến Thú trợ trận"
                      >
                        <span>⚔️ {isCombat ? 'Đang Đánh' : 'Xuất Chiến'}</span>
                      </button>

                      {/* Both (Chiến Tọa Song Toàn) */}
                      {(beast.canMount && beast.canFight) || isHybrid ? (
                        <button
                          onClick={() => handleToggleEquipBeast(beast.id, 'both')}
                          disabled={beast.isLockedInBreeding}
                          className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            isBoth
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-md shadow-amber-900/40'
                              : 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-700/60'
                          } ${beast.isLockedInBreeding ? 'opacity-40 cursor-not-allowed' : ''}`}
                          title="Kích hoạt Chiến Tọa Song Toàn (Vừa cưỡi vừa xuất chiến)"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Song Toàn</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PHÂN KHU 2: LAI TẠO THẦN ĐÀN (BREEDING ALTAR) */}
      {/* ======================================================== */}
      {activeGardenSubTab === 'altar' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-amber-600/40 bg-gradient-to-b from-stone-950 via-[#1a141c] to-stone-950 space-y-6 shadow-2xl">
            {/* Header info */}
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                Ngũ Hành Tương Sinh · Kết Tinh Linh Noãn
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-black text-amber-200">
                Thần Đàn Ghép Đôi Huyết Mạch
              </h3>
              <p className="text-xs text-zinc-400 font-serif">
                Chọn 2 Linh Thú hợp nguyên tố cùng chất xúc tác bí truyền. Sau khi kích hoạt, cha mẹ sẽ tiến vào buồng phối giống để kết tinh Linh Noãn.
              </p>
            </div>

            {/* Selection Grid: Parent A + Altar Core + Parent B */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Slot 1: Father Beast */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 space-y-4 text-center">
                <div className="text-xs font-serif font-bold text-amber-400 uppercase tracking-wider">
                  Trận Nhãn 1: Linh Thú Cha
                </div>

                {parentA ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-950 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner">
                      {parentA.avatar || '🐺'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-zinc-100">{parentA.name}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {parentA.element} · {getTierName(parentA.tier)} · Thuần khiết: {parentA.bloodlinePurity}%
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedParentAId(null)}
                      className="px-3 py-1 rounded-lg text-xs font-serif bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      Đổi thú khác
                    </button>
                  </div>
                ) : (
                  <div className="py-6 space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-2xl text-zinc-600">
                      <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-zinc-400 font-serif">Chưa chọn Linh Thú</p>
                    <select
                      onChange={(e) => setSelectedParentAId(e.target.value || null)}
                      value={selectedParentAId || ''}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-serif text-zinc-200 cursor-pointer"
                    >
                      <option value="">-- Chọn Linh Thú Cha --</option>
                      {beasts
                        .filter(b => b.id !== selectedParentBId && !b.isLockedInBreeding)
                        .map(b => (
                          <option key={b.id} value={b.id}>
                            [{b.element}] {b.name} (Bậc {b.tier || 2})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Altar Core / Projection Display */}
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-zinc-950 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-stone-950 text-2xl shadow-xl shadow-amber-900/50 animate-pulse">
                  <Flame className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-serif font-bold text-amber-300">Dự Toán Huyết Mạch</span>
                  {breedingPreview ? (
                    <div className="text-[11px] font-mono space-y-1 text-zinc-300 pt-1">
                      <div className="text-amber-400 font-bold">
                        ⚡ Dị Biến Thiên Phú: {(breedingPreview.mutationChance * 100).toFixed(0)}%
                      </div>
                      <div>Tốc độ dự kiến: ~{breedingPreview.travelSpeedBonus}%</div>
                      <div>Công: ~+{breedingPreview.combatStats.atkBonus} | Thủ: ~+{breedingPreview.combatStats.defBonus}</div>
                      <div className="text-emerald-400">Thời gian ấp: {Math.round(breedingPreview.incubateDuration / 1000)}s</div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500 font-serif">
                      Đặt đủ 2 Linh Thú để kích hoạt dự toán ngũ hành tương sinh.
                    </p>
                  )}
                </div>

                {/* Eligibility Notice */}
                {eligibility && !eligibility.eligible && (
                  <div className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] text-red-300 font-serif flex items-center gap-1.5 text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{eligibility.reason}</span>
                  </div>
                )}
              </div>

              {/* Slot 2: Mother Beast */}
              <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 space-y-4 text-center">
                <div className="text-xs font-serif font-bold text-cyan-400 uppercase tracking-wider">
                  Trận Nhãn 2: Linh Thú Mẹ
                </div>

                {parentB ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-950 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner">
                      {parentB.avatar || '🦊'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-zinc-100">{parentB.name}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {parentB.element} · {getTierName(parentB.tier)} · Thuần khiết: {parentB.bloodlinePurity}%
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedParentBId(null)}
                      className="px-3 py-1 rounded-lg text-xs font-serif bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      Đổi thú khác
                    </button>
                  </div>
                ) : (
                  <div className="py-6 space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-zinc-700 flex items-center justify-center text-2xl text-zinc-600">
                      <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-zinc-400 font-serif">Chưa chọn Linh Thú</p>
                    <select
                      onChange={(e) => setSelectedParentBId(e.target.value || null)}
                      value={selectedParentBId || ''}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-serif text-zinc-200 cursor-pointer"
                    >
                      <option value="">-- Chọn Linh Thú Mẹ --</option>
                      {beasts
                        .filter(b => b.id !== selectedParentAId && !b.isLockedInBreeding)
                        .map(b => (
                          <option key={b.id} value={b.id}>
                            [{b.element}] {b.name} (Bậc {b.tier || 2})
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Catalyst Selection Cards */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs font-serif">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Chọn Đan Dược Xúc Tác (Gia Tăng Đột Biến):</span>
                </span>
                <span className="text-zinc-400 font-mono">
                  Linh Thạch hiện có: <strong className="text-amber-300">{(player.linhThach || 0).toLocaleString()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {catalysts.map(cat => {
                  const isSelected = selectedCatalystId === cat.id;
                  const canAfford = (player.linhThach || 0) >= cat.costLinhThach;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCatalystId(isSelected ? null : cat.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/40 shadow-lg ring-1 ring-amber-400/50'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <div className="text-xs font-serif font-bold text-zinc-100">{cat.name}</div>
                          <div className="text-[10px] text-amber-400 font-mono">
                            +{(cat.mutationRateBonus * 100).toFixed(0)}% Dị Biến · +{cat.purityBonus}% Thuần Khiết
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Phí: {cat.costLinhThach.toLocaleString()} Linh Thạch
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-700" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Breeding Action Button */}
            <div className="pt-2 text-center">
              <button
                onClick={handleStartBreeding}
                disabled={!eligibility?.eligible || isProcessing}
                className={`w-full max-w-md py-3.5 px-6 rounded-2xl font-serif text-sm font-black transition-all shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer ${
                  eligibility?.eligible && !isProcessing
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-stone-950 shadow-amber-900/40 animate-pulse'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                }`}
              >
                <Flame className="w-5 h-5" />
                <span>
                  {isProcessing
                    ? 'Đang Dẫn Động Linh Khí...'
                    : `🔥 KÍCH HOẠT LAI TẠO HUYẾT MẠCH (${(eligibility?.linhThachCost || 25000).toLocaleString()} LINH THẠCH)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHÂN KHU 3: ẤP NOÃN TRÌ & THỐI HUYẾT THẦN ĐỈNH */}
      {/* ======================================================== */}
      {activeGardenSubTab === 'incubator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Incubator Chamber (Lồng Ấp Trứng) */}
          <div className="p-6 rounded-3xl border border-cyan-500/30 bg-zinc-950/80 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">🥚</span>
                <div>
                  <h3 className="font-serif font-bold text-base text-cyan-200">Ấp Noãn Trì (Lồng Ấp Thần Thú)</h3>
                  <p className="text-[11px] text-zinc-400 font-serif">Linh Noãn đang hấp thu thiên địa tinh hoa để phá vỏ</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                {eggs.length} / {facility.maxBreedingSlots} Noãn
              </span>
            </div>

            {eggs.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                <span className="text-3xl opacity-40">🪹</span>
                <p className="text-xs text-zinc-400 font-serif">Hiện không có Linh Noãn nào trong lồng ấp.</p>
                <button
                  onClick={() => setActiveGardenSubTab('altar')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white font-serif text-xs transition cursor-pointer"
                >
                  Ghép Đôi Tạo Trứng Mới
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {eggs.map(egg => {
                  const now = Date.now();
                  const finishTime = (egg.incubateStartTime || 0) + (egg.incubateDuration || 0);
                  const isReady = now >= finishTime || egg.isHatched;
                  const remainingSec = Math.max(0, Math.ceil((finishTime - now) / 1000));
                  const totalSec = Math.max(1, Math.ceil((egg.incubateDuration || 180000) / 1000));
                  const progressPercent = isReady ? 100 : Math.min(99, Math.round(((totalSec - remainingSec) / totalSec) * 100));

                  return (
                    <div
                      key={egg.id}
                      className="p-4 rounded-2xl border border-cyan-800/50 bg-gradient-to-r from-zinc-900 via-[#101920] to-zinc-900 space-y-3 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-2xl shadow-inner ${isReady ? 'animate-bounce' : 'animate-pulse'}`}>
                            🥚
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-xs text-cyan-200">{egg.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Cha: {egg.parents?.fatherName} × Mẹ: {egg.parents?.motherName}
                            </p>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-serif">
                              Hệ {egg.parents?.element} · {getTierName(egg.rarity)}
                            </span>
                          </div>
                        </div>

                        {/* Status */}
                        {isReady ? (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-serif bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold animate-pulse">
                            ✨ Đã Sẵn Sàng Nở
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-zinc-800 text-zinc-300">
                            Còn lại: {remainingSec}s
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-zinc-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isReady
                                ? 'bg-gradient-to-r from-emerald-400 to-cyan-300 animate-pulse'
                                : 'bg-gradient-to-r from-cyan-600 to-teal-400'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Actions: Hatch or Speed Up */}
                      <div className="flex items-center gap-2 pt-1">
                        {isReady ? (
                          <button
                            onClick={() => handleHatchEgg(egg.id)}
                            disabled={isProcessing}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:brightness-110 text-stone-950 font-serif font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5 animate-bounce"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Ấp Nở Nhận Dị Thú</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSpeedUpIncubation(egg.id)}
                            disabled={isProcessing}
                            className="w-full py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/50 font-serif text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Tăng Tốc Bằng Linh Thạch ({remainingSec * 10} Đá)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Bloodline Evolution Furnace (Thối Huyết Thần Đỉnh) */}
          <div className="p-6 rounded-3xl border border-rose-500/30 bg-zinc-950/80 space-y-5 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">🩸</span>
              <div>
                <h3 className="font-serif font-bold text-base text-rose-200">Thối Huyết Thần Đỉnh</h3>
                <p className="text-[11px] text-zinc-400 font-serif">Bơm Huyết Mạch Đan, thăng hoa cảnh giới từ Linh Thú lên Thần Thú / Thái Cổ</p>
              </div>
            </div>

            {/* Select Beast for Evolution */}
            <div className="space-y-2">
              <label className="text-xs font-serif text-zinc-300">Chọn Linh Thú Thối Luyện:</label>
              <select
                value={selectedBeastForEvolveId || (beastForEvolution ? beastForEvolution.id : '')}
                onChange={(e) => setSelectedBeastForEvolveId(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-serif text-zinc-100 cursor-pointer"
              >
                {beasts.map(b => (
                  <option key={b.id} value={b.id}>
                    [{getTierName(b.tier)}] {b.name} (Thuần khiết: {b.bloodlinePurity || 30}%)
                  </option>
                ))}
              </select>
            </div>

            {beastForEvolution ? (
              <div className="p-5 rounded-2xl border border-rose-900/40 bg-gradient-to-b from-[#1c1214] to-zinc-950 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-rose-500/40 flex items-center justify-center text-2xl shadow-inner">
                      {beastForEvolution.avatar || '🐾'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-rose-200">{beastForEvolution.name}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Cấp hiện tại: {getTierName(beastForEvolution.tier)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 font-mono block">Tiến độ bậc:</span>
                    <span className="text-sm font-bold font-mono text-rose-300">
                      {beastForEvolution.bloodlinePurity || 30}% / 100%
                    </span>
                  </div>
                </div>

                {/* Evolution Progress Gauge */}
                <div className="space-y-1">
                  <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${beastForEvolution.bloodlinePurity || 30}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-serif flex items-center justify-between">
                    <span>0% Sơ Khai</span>
                    <span className="text-amber-300 font-bold">100% Đột Phá Bậc + Mở Khóa Aura</span>
                  </div>
                </div>

                {/* Evolution Boost Preview */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] space-y-1 text-zinc-300 font-mono">
                  <div className="text-rose-400 font-bold font-serif">Hiệu quả khi đạt 100%:</div>
                  <div>• Thăng bậc lên: <strong className="text-amber-300">{getTierName(Math.min(5, (beastForEvolution.tier || 2) + 1))}</strong></div>
                  <div>• Tăng +25% toàn bộ chỉ số Công, Thủ, Khí Huyết</div>
                  <div>• Tăng +10% Tốc độ di chuyển Tọa Kỵ</div>
                  <div>• Giác ngộ Thiên Phú Hào Quang Độc Nhất (Hút máu, Choáng, Kháng thương...)</div>
                </div>

                {/* Feed Pill Action Button */}
                <button
                  onClick={() => handleEvolveBloodline(beastForEvolution.id, 'blood_pill')}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Droplets className="w-4 h-4 text-red-300" />
                  <span>🩸 Bơm Huyết Mạch Đan (+25% Thuần Khiết)</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
