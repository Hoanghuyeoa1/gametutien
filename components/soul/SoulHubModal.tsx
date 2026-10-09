// components/soul/SoulHubModal.tsx
// Sa Bàn "Thức Hải Thần Hồn & Tâm Ma Đài" (Soul & Consciousness System)

import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Shield,
  Activity,
  AlertTriangle,
  Flame,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  Sword,
  Moon,
  Sun,
  Eye,
  Feather,
  Lock
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  SoulState,
  SoulRealm,
  SoulRelic
} from '@/lib/types/soul';
import {
  SOUL_REALMS,
  SOUL_NOURISHING_ITEMS,
  SOUL_RELICS_CATALOG,
  createDefaultSoulState
} from '@/lib/soul-data';
import {
  calculateSoulBuffs,
  canBreakthroughSoulRealm,
  calculateBreakthroughSuccessModifier
} from '@/lib/soul-logic';
import { calculateEffectiveRequiredTuVi } from '@/lib/attribute-perks';
import realmsDataRaw from '@/data/realms-data.json';
import { scrollToElementWithHighlight } from '@/lib/navigation-utils';

export interface SoulHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  soulState?: SoulState;
  activeTab?: 'soul_sea' | 'demon_altar' | 'soul_hall';
  setActiveTab?: (tab: 'soul_sea' | 'demon_altar' | 'soul_hall') => void;
  onSoulBreakthrough?: () => void;
  onMeditate?: () => void;
  onExorciseDemon?: () => void;
  onEquipRelic?: (relicId: string) => void;
  onUseItem?: (itemId: string, quantity?: number) => void;
  onNavigateToCultivate?: (target: 'cultivate' | 'breakthrough') => void;
}

export const SoulHubModal: React.FC<SoulHubModalProps> = ({
  isOpen,
  onClose,
  player,
  soulState: propSoulState,
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab,
  onSoulBreakthrough,
  onMeditate,
  onExorciseDemon,
  onEquipRelic,
  onUseItem,
  onNavigateToCultivate
}) => {
  const [internalTab, setInternalTab] = useState<'soul_sea' | 'demon_altar' | 'soul_hall'>('soul_sea');
  const currentTab = propActiveTab || internalTab;
  const setTab = propSetActiveTab || setInternalTab;

  const soul = propSoulState || player.soulState || createDefaultSoulState();
  const cultivation = soul.cultivation;
  const mindState = soul.mindState;

  const realmIndex = Math.max(0, SOUL_REALMS.findIndex(r => r.id === cultivation.currentRealmId));
  const currentRealm = SOUL_REALMS[realmIndex] || SOUL_REALMS[0];
  const nextRealm = SOUL_REALMS[realmIndex + 1] || null;

  const breakthroughCheck = useMemo(() => {
    return canBreakthroughSoulRealm(player);
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

  const soulBuffs = useMemo(() => {
    return calculateSoulBuffs(soul);
  }, [soul]);

  const breakthroughMod = useMemo(() => {
    return calculateBreakthroughSuccessModifier(soul);
  }, [soul]);

  // EXP percentage
  const expPercent = Math.min(
    100,
    Math.max(0, Math.floor((cultivation.currentExp / Math.max(1, cultivation.expToNextStage)) * 100))
  );

  // Soul Power percentage
  const powerPercent = Math.min(
    100,
    Math.max(0, Math.floor((cultivation.currentSoulPower / Math.max(1, cultivation.soulSeaCapacity)) * 100))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col rounded-2xl border border-indigo-500/50 bg-gradient-to-b from-[#110f22] via-[#090815] to-[#04040a] shadow-[0_0_60px_rgba(99,102,241,0.25)] text-zinc-200 overflow-hidden font-sans">
        
        {/* ======================================================== */}
        {/* 1. TOP HEADER */}
        {/* ======================================================== */}
        <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-indigo-900/40 bg-gradient-to-r from-indigo-950/70 via-[#18122b] to-purple-950/60 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/40 to-purple-600/30 border border-indigo-400/50 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0">
              🔮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-indigo-200 tracking-wide">
                  THỨC HẢI THẦN HỒN
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                  {currentRealm.name} • Tầng {cultivation.currentStage}/9
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-serif">
                Ngưng Thần Luyện Phách • Khai Mở Thức Hải • Trấn Nhiếp Tâm Ma
              </p>
            </div>
          </div>

          {/* Quick Stats & Close */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-indigo-900/50 text-xs font-mono">
              <span className="text-indigo-400">Uy Áp:</span>
              <strong className="text-yellow-300">+{soulBuffs.spiritualPressure}</strong>
              <span className="text-zinc-600">|</span>
              <span className="text-purple-400">Tâm Cảnh:</span>
              <strong className={mindState.stability >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                {mindState.stability}%
              </strong>
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
        {/* SUB-NAV TABS */}
        {/* ======================================================== */}
        <div className="shrink-0 flex items-center justify-between border-b border-indigo-900/30 bg-black/40 px-4 py-2 text-xs font-serif">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('soul_sea')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-bold ${
                currentTab === 'soul_sea'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'text-zinc-400 hover:text-indigo-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Thức Hải & Cảnh Giới</span>
            </button>

            <button
              onClick={() => setTab('demon_altar')}
              className={`relative px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-bold ${
                currentTab === 'demon_altar'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'text-zinc-400 hover:text-purple-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Tâm Ma Đài & Minh Tưởng</span>
              {mindState.demonCorruption >= 40 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            <button
              onClick={() => setTab('soul_hall')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-bold ${
                currentTab === 'soul_hall'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'text-zinc-400 hover:text-cyan-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Hồn Điện & Hồn Khí ({soul.equippedRelics?.length || 0}/3)</span>
            </button>
          </div>

          <div className="text-[11px] text-zinc-400 font-mono hidden md:block">
            🪙 Linh Thạch: <span className="text-yellow-400 font-bold">{player.linhThach.toLocaleString()}</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN 3-ZONE CONTENT */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">

          {/* TAB 1: THỨC HẢI & CẢNH GIỚI */}
          {currentTab === 'soul_sea' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* CỘT TRÁI: NGUYÊN THẦN ĐẠO ĐÀI (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-indigo-900/40 bg-gradient-to-b from-[#131126] to-[#0a0914] p-4 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
                <div
                  className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
                  style={{ backgroundColor: currentRealm.glowColor }}
                />

                {/* Soul Avatar Ethereal Halo */}
                <div className="relative my-3 w-40 h-40 rounded-full border-2 border-indigo-400/40 flex flex-col items-center justify-center bg-black/60 shadow-[0_0_35px_rgba(99,102,241,0.35)]">
                  <span className="text-6xl select-none filter drop-shadow-[0_0_15px_rgba(99,102,241,0.9)] animate-pulse">
                    🧘
                  </span>
                  <span className="text-[10px] font-mono text-indigo-300 mt-2">
                    Cấp Giai {currentRealm.realmIndex + 1}/10
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-indigo-200 mt-1">
                  {currentRealm.name}
                </h3>
                <div className="text-xs text-indigo-400/90 font-mono mt-0.5">
                  Tiểu Tầng: {cultivation.currentStage} / 9 Viên Mãn
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 px-3 italic leading-relaxed">
                  &ldquo;{currentRealm.description}&rdquo;
                </p>

                {/* Thanh EXP Thần Hồn */}
                <div className="w-full mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Tiến Độ Thần Thức:</span>
                    <span className="text-indigo-300 font-bold">
                      {cultivation.currentExp.toLocaleString()} / {cultivation.expToNextStage.toLocaleString()} ({expPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/80 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${expPercent}%` }}
                    />
                  </div>
                </div>

                {/* Thanh Thần Niệm Hiện Tại / Dung Lượng Thức Hải */}
                <div className="w-full mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Dung Lượng Thần Niệm:</span>
                    <span className="text-cyan-300 font-bold">
                      {cultivation.currentSoulPower} / {cultivation.soulSeaCapacity} ({powerPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/80 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-600 to-cyan-400 transition-all duration-500"
                      style={{ width: `${powerPercent}%` }}
                    />
                  </div>
                </div>

                {/* Kỹ Năng / Đặc Quyền Cảnh Giới */}
                {currentRealm.specialAbilityName && (
                  <div className="w-full mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-left">
                    <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Đặc Quyền Cảnh Giới: {currentRealm.specialAbilityName}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                      {currentRealm.specialAbilityDesc}
                    </p>
                  </div>
                )}

                {/* Nút Độ Kiếp Phá Cảnh */}
                <div className="w-full mt-4 space-y-2">
                  {breakthroughCheck.isLockedByRealm && (
                    <div className="w-full p-2.5 rounded-xl bg-gradient-to-r from-red-950/60 via-purple-950/50 to-stone-900/80 border border-purple-500/50 text-purple-200 text-center font-serif text-[11px] flex flex-col items-center justify-center gap-1.5 shadow-sm animate-in fade-in">
                      <div className="flex items-center justify-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>
                          🔒 Thức Hải Chưa Mở: Cần đạt <strong className="text-purple-300 font-bold underline underline-offset-2">{breakthroughCheck.requiredRealmName}</strong> để ngưng tụ Thần Hồn bậc tiếp theo
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
                      onClick={onSoulBreakthrough}
                      disabled={breakthroughCheck.isLockedByRealm || !breakthroughCheck.canBreakthrough}
                      className={`w-full py-2.5 rounded-xl font-serif font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 ${
                        breakthroughCheck.isLockedByRealm
                          ? 'bg-zinc-900/90 text-zinc-500 border border-zinc-700/60 opacity-50 cursor-not-allowed'
                          : breakthroughCheck.canBreakthrough
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white hover:brightness-110 shadow-[0_0_20px_rgba(99,102,241,0.5)] cursor-pointer animate-pulse'
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
                          ? `Độ Kiếp Thần Hồn [${nextRealm.name}]`
                          : breakthroughCheck.reason}
                      </span>
                    </button>
                  ) : (
                    <div className="py-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/50 text-indigo-300 font-serif font-bold text-xs">
                      🌟 Đã đạt đỉnh phong Hỗn Độn Thần Niệm cực hạn!
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT PHẢI: BẢNG GIA TRÌ & ĐẶC TÍNH CHI TIẾT (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Tổng Hợp Chỉ Số Thần Thức */}
                <div className="rounded-2xl border border-indigo-900/40 bg-black/40 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-900/40 pb-2">
                    <h4 className="text-sm font-serif font-bold text-indigo-200 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span>Gia Trì Thần Hồn Lên Bản Thể & Chiến Đấu</span>
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                      Slot Xuất Chiến: {soulBuffs.maxControlSlots}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Trí Lực: </span>
                      <strong className="text-indigo-400 font-bold">+{soulBuffs.statsBonus.triLuc || 0}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Tinh Thần: </span>
                      <strong className="text-purple-400 font-bold">+{soulBuffs.statsBonus.tinhThan || 0}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Kháng Phép: </span>
                      <strong className="text-sky-400 font-bold">+{soulBuffs.statsBonus.khangPhep || 0}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Kháng Khống Chế: </span>
                      <strong className="text-emerald-400 font-bold">+{soulBuffs.statsBonus.khangKhongChe || 0}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Thân Pháp: </span>
                      <strong className="text-amber-400 font-bold">+{soulBuffs.statsBonus.speed || 0}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Bạo Kích: </span>
                      <strong className="text-rose-400 font-bold">+{soulBuffs.statsBonus.critRate || 0}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Công Kích: </span>
                      <strong className="text-rose-300 font-bold">+{soulBuffs.statsBonus.atk || 0}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Phòng Ngự: </span>
                      <strong className="text-blue-300 font-bold">+{soulBuffs.statsBonus.def || 0}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-zinc-400">Khí Huyết: </span>
                      <strong className="text-emerald-300 font-bold">+{soulBuffs.statsBonus.hp?.toLocaleString() || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Thẻ Ảnh Hưởng Lên Độ Kiếp Khí Tu */}
                <div className="rounded-2xl border border-purple-900/40 bg-gradient-to-r from-purple-950/30 to-indigo-950/20 p-4 space-y-2">
                  <h4 className="text-xs font-serif font-bold text-purple-200 flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ảnh Hưởng Đến Độ Kiếp Khí Tu & Thiên Kiếp</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-2 rounded bg-black/40 border border-purple-800/30">
                      <div className="text-zinc-400 text-[10px]">Tỉ Lệ Đột Phá:</div>
                      <div className={`font-bold text-sm ${breakthroughMod.successRateBonus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {breakthroughMod.successRateBonus >= 0 ? `+${breakthroughMod.successRateBonus}%` : `${breakthroughMod.successRateBonus}%`}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-purple-800/30">
                      <div className="text-zinc-400 text-[10px]">Giảm ST Lôi Kiếp:</div>
                      <div className="font-bold text-sm text-sky-300">
                        -{breakthroughMod.tribulationDamageReduction}%
                      </div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-purple-800/30">
                      <div className="text-zinc-400 text-[10px]">Giảm Nguy Cơ Tâm Ma:</div>
                      <div className="font-bold text-sm text-teal-300">
                        -{breakthroughMod.tamMaChanceReduction}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Lối Tắt Đến Tâm Ma & Hồn Khí */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setTab('demon_altar')}
                    className="p-3 rounded-xl border border-rose-900/40 bg-gradient-to-br from-rose-950/30 to-black/50 hover:border-rose-500/60 transition cursor-pointer flex items-center gap-3"
                  >
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h5 className="text-xs font-serif font-bold text-rose-200">Tâm Ma Đài</h5>
                      <p className="text-[10px] text-zinc-400">Ma Tính: {mindState.demonCorruption}% • Cấp {mindState.demonLevel}</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setTab('soul_hall')}
                    className="p-3 rounded-xl border border-cyan-900/40 bg-gradient-to-br from-cyan-950/30 to-black/50 hover:border-cyan-500/60 transition cursor-pointer flex items-center gap-3"
                  >
                    <span className="text-2xl">🗡️</span>
                    <div>
                      <h5 className="text-xs font-serif font-bold text-cyan-200">Hồn Điện Trấn Giữ</h5>
                      <p className="text-[10px] text-zinc-400">Đã khảm: {soul.equippedRelics?.length || 0}/3 Hồn Khí</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TÂM MA ĐÀI & MINH TƯỞNG */}
          {currentTab === 'demon_altar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* CỘT TRÁI: BÀNG CÂN ÂM DƯƠNG TÂM CẢNH (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-rose-900/40 bg-gradient-to-b from-[#180e1a] to-[#0a070f] p-4 flex flex-col items-center text-center space-y-4 shadow-lg">
                <div className="flex items-center justify-between w-full border-b border-rose-900/40 pb-2">
                  <h4 className="text-sm font-serif font-bold text-rose-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Cán Cân Âm Dương Thức Hải</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/50">
                    Ma Cấp: {mindState.demonLevel}
                  </span>
                </div>

                {/* Biểu Tượng Âm Dương Tĩnh Tâm */}
                <div className="relative my-2 w-36 h-36 rounded-full border-2 border-rose-500/40 flex items-center justify-center bg-black/80 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                  <div className="text-5xl select-none animate-spin" style={{ animationDuration: '20s' }}>
                    ☯
                  </div>
                </div>

                {/* Cảnh Báo Ma Tính */}
                {mindState.demonCorruption >= 50 && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs font-serif flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>CẢNH BÁO: Ma Tính vượt 50%! Nguy cơ Tẩu Hỏa Nhập Ma khi độ kiếp cực lớn!</span>
                  </div>
                )}

                {/* Thanh Đo Tâm Cảnh (Bạch) */}
                <div className="w-full space-y-1 text-left">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-yellow-400" /> Tâm Cảnh (Bạch Minh):
                    </span>
                    <strong className="text-emerald-400">{mindState.stability}%</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/80 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${mindState.stability}%` }}
                    />
                  </div>
                </div>

                {/* Thanh Đo Ma Tính (Hắc) */}
                <div className="w-full space-y-1 text-left">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300 flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-purple-400" /> Ma Tính (Hắc Ám):
                    </span>
                    <strong className="text-rose-400">{mindState.demonCorruption}%</strong>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/80 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-rose-600 transition-all duration-500"
                      style={{ width: `${mindState.demonCorruption}%` }}
                    />
                  </div>
                </div>

                {/* 2 Nút Hành Động Cốt Lõi */}
                <div className="w-full grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={onMeditate}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-serif font-bold text-xs tracking-wide shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🧘 Tĩnh Tọa</span>
                  </button>

                  <button
                    onClick={onExorciseDemon}
                    disabled={mindState.demonCorruption <= 0 && mindState.stability >= 100}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-800 to-purple-800 hover:from-rose-700 hover:to-purple-700 text-white font-serif font-bold text-xs tracking-wide shadow-md transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <span>🗡️ Trảm Ma</span>
                  </button>
                </div>
              </div>

              {/* CỘT PHẢI: KHO VẬT PHẨM TỊNH TÂM & ÔN DƯỠNG (7 cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-indigo-900/40 bg-black/40 p-4 space-y-3">
                <div className="border-b border-indigo-900/40 pb-2 flex items-center justify-between">
                  <h4 className="text-sm font-serif font-bold text-indigo-200 flex items-center gap-2">
                    <span>🪔</span>
                    <span>Vật Phẩm Tịnh Tâm & Ôn Dưỡng Hồn Phách</span>
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    (Tiêu hao Linh Thạch kích hoạt)
                  </span>
                </div>

                <div className="space-y-2.5">
                  {SOUL_NOURISHING_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:border-indigo-600/50 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-serif font-bold text-indigo-200">
                              {item.name}
                            </h5>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40 font-mono">
                              {item.tierName}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                          <div className="text-[9px] font-mono text-emerald-400/90 mt-1 flex gap-2">
                            <span>+{item.expGain} EXP</span>
                            <span>Tâm Cảnh +{item.stabilityGain}%</span>
                            <span>Ma Tính -{item.corruptionCleansed}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onUseItem && onUseItem(item.id, 1)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white text-[10px] font-mono font-bold transition cursor-pointer"
                        >
                          Dùng 1
                        </button>
                        <button
                          onClick={() => onUseItem && onUseItem(item.id, 5)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-white text-[10px] font-mono font-bold transition cursor-pointer"
                        >
                          Dùng 5
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-[11px] text-zinc-400 font-serif leading-relaxed">
                  💡 <strong>Khuyên Bảo Tu Luyện:</strong> Bế quan lâu dài hoặc độ kiếp nhiều lần có thể sinh ra ma chướng. Hãy định kỳ tĩnh tọa và dùng Trầm Hương để giữ tâm cảnh trong sáng trước khi đột phá cảnh giới lớn!
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: HỒN ĐIỆN & HỒN KHÍ */}
          {currentTab === 'soul_hall' && (
            <div className="space-y-4">
              
              {/* 3 Bệ Đá Ngọc Đang Khảm */}
              <div className="rounded-2xl border border-cyan-900/40 bg-gradient-to-b from-[#0f172a] to-[#070b14] p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
                  <h4 className="text-sm font-serif font-bold text-cyan-200 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Tam Đại Trận Nhãn Hồn Khí Đang Trấn Thủ</span>
                  </h4>
                  <span className="text-[10px] font-mono text-yellow-300">
                    Chỉ số Uy Áp Hiện Tại: +{soulBuffs.spiritualPressure}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[0, 1, 2].map((slotIdx) => {
                    const relic = soul.equippedRelics && soul.equippedRelics[slotIdx];
                    return (
                      <div
                        key={slotIdx}
                        className={`rounded-xl border p-3 min-h-[120px] flex flex-col justify-between transition ${
                          relic
                            ? 'border-cyan-500/60 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'border-dashed border-zinc-800 bg-black/30'
                        }`}
                      >
                        {relic ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl">{relic.icon || '🗡️'}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-cyan-300 font-mono border border-cyan-600/40">
                                Phẩm {relic.tier}
                              </span>
                            </div>
                            <div className="mt-1">
                              <h5 className="text-xs font-serif font-bold text-cyan-100">{relic.name}</h5>
                              <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{relic.passiveEffect}</p>
                            </div>
                            <button
                              onClick={() => onEquipRelic && onEquipRelic(relic.id)}
                              className="mt-2 w-full py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 text-[10px] font-serif border border-rose-800/40 transition cursor-pointer"
                            >
                              Thu Hồi Khỏi Thức Hải
                            </button>
                          </>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-3 text-zinc-500">
                            <span className="text-xl opacity-40">🪨</span>
                            <span className="text-[11px] font-serif mt-1">Trận Nhãn {slotIdx + 1} Còn Trống</span>
                            <span className="text-[9px] text-zinc-600 mt-0.5">Chọn Hồn Khí bên dưới để tế luyện</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Danh Sách Hồn Khí Trấn Thức Hải */}
              <div className="rounded-2xl border border-indigo-900/40 bg-black/40 p-4 space-y-3">
                <div className="border-b border-indigo-900/40 pb-2">
                  <h4 className="text-sm font-serif font-bold text-indigo-200">
                    Kho Hồn Khí Thần Bí Tồn Tại Trong Thiên Địa
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Mỗi Hồn Khí mang lại một năng lực nội tại độc nhất và gia tăng chỉ số Uy Áp
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SOUL_RELICS_CATALOG.map((relic) => {
                    const isEquipped = soul.equippedRelics?.some(r => r.id === relic.id);
                    return (
                      <div
                        key={relic.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isEquipped
                            ? 'border-cyan-500/70 bg-cyan-950/30'
                            : 'border-zinc-800 bg-zinc-950/60 hover:border-indigo-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{relic.icon || '🗡️'}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-xs font-serif font-bold text-indigo-200">{relic.name}</h5>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 text-yellow-300 font-mono border border-yellow-600/40">
                                Phẩm Cấp {relic.tier}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{relic.description}</p>
                            <div className="text-[9px] font-mono text-cyan-400 mt-0.5">{relic.passiveEffect}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => onEquipRelic && onEquipRelic(relic.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition cursor-pointer shrink-0 ${
                            isEquipped
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900'
                              : 'bg-indigo-700 hover:bg-indigo-600 text-white shadow-sm'
                          }`}
                        >
                          {isEquipped ? 'Gỡ Bỏ' : 'Tế Luyện'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
