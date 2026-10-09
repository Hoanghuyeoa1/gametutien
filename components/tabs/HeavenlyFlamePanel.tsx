// components/tabs/HeavenlyFlamePanel.tsx
// Giao diện Cổ Phong: Bảng Khảo Cứu, Ôn Dưỡng & Tiến Hóa Thiên Địa Dị Hỏa (Flame Sanctuary Panel)

import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Zap,
  Gem,
  Award,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  ChevronRight,
  Info,
  X,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  HeavenlyFlameConfig,
  PlayerFlameInstance,
  HeavenlyFlameState,
  FlameArchetype
} from '@/lib/types/heavenly-flame';
import { HEAVENLY_FLAMES_REGISTRY, DEFAULT_MORTAL_FLAME } from '@/lib/heavenly-flame-logic';

export interface HeavenlyFlamePanelProps {
  player: PlayerStats;
  flameState: HeavenlyFlameState;
  equippedFlameConfig: HeavenlyFlameConfig;
  equippedFlameInstance: PlayerFlameInstance | null;
  allFlamesList: HeavenlyFlameConfig[];
  handleEquipFlame: (flameId: string | null) => void;
  handleFeedFlameWithOre: (flameId: string, oreItemId: string, count: number) => void;
  handleFeedFlameWithTuVi: (flameId: string, tuviAmount: number) => void;
  handleUnlockFlame: (flameId: string) => void;
  onBackToCauldron?: () => void;
}

export const TIER_ROMAN_MAP: Record<number, string> = {
  1: 'Nhất Giai',
  2: 'Nhị Giai',
  3: 'Tam Giai',
  4: 'Tứ Giai',
  5: 'Ngũ Giai',
  6: 'Lục Giai',
  7: 'Thất Giai',
  8: 'Bát Giai',
  9: 'Cửu Giai (Viên Mãn)'
};

export const ARCHETYPE_INFO: Record<FlameArchetype, { title: string; color: string; bg: string }> = {
  on_hoa: {
    title: 'Hỏa Ôn Hòa • Thanh Tẩy Đan Độc',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
  },
  bao_liet: {
    title: 'Hỏa Bạo Liệt • Nhân Đôi Sản Lượng',
    color: 'text-purple-400',
    bg: 'bg-purple-950/60 border-purple-500/40 text-purple-300'
  },
  bien_di: {
    title: 'Hỏa Biến Dị • Kích Kích Dược Tính',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-950/60 border-fuchsia-500/40 text-fuchsia-300'
  },
  hon_don: {
    title: 'Hỏa Tối Thượng • Vạn Hỏa Chi Tổ',
    color: 'text-amber-300',
    bg: 'bg-amber-950/80 border-amber-400/60 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
  }
};

/**
 * Ngọn lửa đồ họa thủ tục động (Procedural Animated Flame SVG)
 */
export const ProceduralFlameSvg: React.FC<{
  archetype: FlameArchetype | 'pham_hoa';
  glowColor: string;
  size?: number;
}> = ({ archetype, glowColor, size = 64 }) => {
  let flameGradientId = 'flameGrad_' + archetype;
  let colorStart = '#f59e0b';
  let colorMid = '#ef4444';
  let colorEnd = '#7c2d12';
  let dropShadowFilter = 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))';
  let animDuration = '2s';

  if (archetype === 'on_hoa') {
    colorStart = '#6ee7b7';
    colorMid = '#10b981';
    colorEnd = '#064e3b';
    dropShadowFilter = 'drop-shadow(0 0 16px rgba(52, 211, 153, 0.75))';
    animDuration = '2.5s';
  } else if (archetype === 'bao_liet') {
    colorStart = '#e9d5ff';
    colorMid = '#a855f7';
    colorEnd = '#581c87';
    dropShadowFilter = 'drop-shadow(0 0 16px rgba(192, 132, 252, 0.75))';
    animDuration = '1.2s';
  } else if (archetype === 'bien_di') {
    colorStart = '#f5d0fe';
    colorMid = '#c026d3';
    colorEnd = '#4a044e';
    dropShadowFilter = 'drop-shadow(0 0 16px rgba(232, 121, 249, 0.75))';
    animDuration = '1.8s';
  } else if (archetype === 'hon_don') {
    colorStart = '#fef08a';
    colorMid = '#f59e0b';
    colorEnd = '#b45309';
    dropShadowFilter = 'drop-shadow(0 0 22px rgba(245, 158, 11, 0.9))';
    animDuration = '1.5s';
  }

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 120"
        style={{
          width: size,
          height: size,
          filter: dropShadowFilter
        }}
        className="animate-pulse"
      >
        <defs>
          <linearGradient id={flameGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={colorEnd} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colorMid} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorStart} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Ngọn lửa ngoài cùng */}
        <path
          d="M 50 110 
             C 25 110, 10 90, 15 65 
             C 18 48, 30 35, 42 20 
             C 45 40, 55 35, 52 15 
             C 65 30, 85 50, 85 70 
             C 85 95, 75 110, 50 110 Z"
          fill={`url(#${flameGradientId})`}
          style={{
            transformOrigin: '50% 100%',
            animation: `flameWave ${animDuration} ease-in-out infinite alternate`
          }}
        />

        {/* Lõi lửa bên trong */}
        <path
          d="M 50 105 
             C 32 105, 25 90, 30 75 
             C 34 60, 44 48, 50 35 
             C 56 48, 66 60, 70 75 
             C 75 90, 68 105, 50 105 Z"
          fill={colorStart}
          opacity="0.8"
          style={{
            transformOrigin: '50% 100%',
            animation: `flameWave ${parseFloat(animDuration) * 0.75}s ease-in-out infinite alternate-reverse`
          }}
        />

        {/* Tia sáng đốm lửa bay bổng */}
        <circle cx="48" cy="25" r="2.5" fill="#ffffff" opacity="0.9" className="animate-ping" />
        <circle cx="58" cy="40" r="2" fill={colorStart} opacity="0.8" />
      </svg>
    </div>
  );
};

export const HeavenlyFlamePanel: React.FC<HeavenlyFlamePanelProps> = ({
  player,
  flameState,
  equippedFlameConfig,
  equippedFlameInstance,
  allFlamesList,
  handleEquipFlame,
  handleFeedFlameWithOre,
  handleFeedFlameWithTuVi,
  handleUnlockFlame,
  onBackToCauldron
}) => {
  // Modal State cho việc Nuôi Hỏa bằng Khoáng Thạch
  const [selectedOreFlameId, setSelectedOreFlameId] = useState<string | null>(null);

  // Modal State cho việc Truyền Chân Nguyên Nuôi Hỏa
  const [selectedTuViFlameId, setSelectedTuViFlameId] = useState<string | null>(null);

  const unlockedFlames = flameState.unlockedFlames || {};
  const equippedFlameId = flameState.equippedFlameId;

  // Lọc khoáng thạch sở hữu có số lượng > 0
  const ownedOres = (player.inventory?.ores || []).filter(o => o.quantity > 0);

  return (
    <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
      {/* Banner Tiêu Đề Cổ Phong */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#18110b] via-[#1f1610] to-[#18110b] border border-amber-600/50 shadow-md flex justify-between items-center flex-wrap gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="font-serif font-black text-sm text-amber-100 tracking-wide flex items-center gap-1.5">
              <span>Thiên Địa Dị Hỏa Các</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50">
                {Object.keys(unlockedFlames).length}/{allFlamesList.length} Đã Thuần Phục
              </span>
            </h2>
          </div>
          <p className="text-[10.5px] text-zinc-400 font-serif">
            Vạn hỏa chi linh ngưng tụ tinh hoa nhật nguyệt. Ôn dưỡng dị hỏa nâng cao phẩm chất xuất lò, thiêu rụi đan độc và kích phát dị biến thiên phú.
          </p>
        </div>

        {onBackToCauldron && (
          <button
            onClick={onBackToCauldron}
            className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 text-xs font-serif transition cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Đan Lô</span>
          </button>
        )}
      </div>

      {/* Hiển Thị Dị Hỏa Đang Khảm Trong Đan Lò */}
      <div className="p-3 rounded-xl bg-black/60 border border-amber-900/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProceduralFlameSvg
            archetype={equippedFlameConfig.archetype}
            glowColor={equippedFlameConfig.visualColor.glowColor}
            size={52}
          />
          <div className="space-y-0.5">
            <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
              <span>Đang Dẫn Hỏa Vào Đan Lô:</span>
              <span className="text-amber-400 font-bold">
                {equippedFlameInstance ? TIER_ROMAN_MAP[equippedFlameInstance.tier] : 'Cơ Bản'}
              </span>
            </div>
            <div className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
              <span className={equippedFlameConfig.visualColor.flameColor}>
                {equippedFlameConfig.name}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${ARCHETYPE_INFO[equippedFlameConfig.archetype].bg}`}>
                {ARCHETYPE_INFO[equippedFlameConfig.archetype].title}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono flex gap-2 flex-wrap">
              {equippedFlameConfig.baseToxicityBurnPercent > 0 && (
                <span className="text-emerald-400">
                  🔥 Thiêu rụi {equippedFlameConfig.baseToxicityBurnPercent}% độc
                </span>
              )}
              {equippedFlameConfig.baseYieldMultiplier > 1 && (
                <span className="text-purple-400">
                  ⚡ Sản lượng x{equippedFlameConfig.baseYieldMultiplier}
                </span>
              )}
              {equippedFlameConfig.explosionRiskPercent > 0 && (
                <span className="text-red-400">
                  ⚠️ Nổ lò {equippedFlameConfig.explosionRiskPercent}%
                </span>
              )}
              {equippedFlameConfig.mutationChanceMultiplier > 1 && (
                <span className="text-fuchsia-400">
                  ✨ Biến dị x{equippedFlameConfig.mutationChanceMultiplier}
                </span>
              )}
            </div>
          </div>
        </div>

        {equippedFlameId !== null && (
          <button
            onClick={() => handleEquipFlame(null)}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 text-[11px] font-serif transition cursor-pointer shrink-0"
          >
            Tháo Ra (Dùng Phàm Hỏa)
          </button>
        )}
      </div>

      {/* Danh Sách Thẻ Bài Dị Hỏa */}
      <div className="space-y-3">
        {allFlamesList.map(flame => {
          const instance = unlockedFlames[flame.id];
          const isUnlocked = Boolean(instance);
          const isEquipped = equippedFlameId === flame.id;
          const archetypeInfo = ARCHETYPE_INFO[flame.archetype];
          const isMaxTier = instance ? instance.tier >= 9 : false;

          return (
            <div
              key={flame.id}
              className={`p-3.5 rounded-xl border transition space-y-3 ${
                isEquipped
                  ? 'bg-gradient-to-r from-[#1c140d] via-[#17110c] to-[#1c140d] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/40'
                  : isUnlocked
                  ? 'bg-gradient-to-r from-[#14100d] to-[#0e0c0b] border-amber-900/40 hover:border-amber-700/60'
                  : 'bg-black/40 border-zinc-800/60 opacity-65'
              }`}
            >
              {/* Header Thẻ Bài */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ProceduralFlameSvg
                    archetype={flame.archetype}
                    glowColor={flame.visualColor.glowColor}
                    size={48}
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-serif font-black text-sm ${flame.visualColor.flameColor}`}>
                        {flame.name}
                      </h3>
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded border font-mono ${archetypeInfo.bg}`}>
                        {archetypeInfo.title}
                      </span>
                      <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {flame.element}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 italic font-serif">
                      "{flame.lore}"
                    </p>
                  </div>
                </div>

                {/* Nút hành động chính */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {isUnlocked ? (
                    isEquipped ? (
                      <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500 text-amber-300 text-[11px] font-serif font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        Đang Khảm Vào Lò
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEquipFlame(flame.id)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white text-[11px] font-serif font-bold transition cursor-pointer shadow flex items-center gap-1"
                      >
                        <Flame className="w-3.5 h-3.5 text-yellow-200" />
                        Khảm Vào Lò
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleUnlockFlame(flame.id)}
                      className="px-3 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-600/50 text-[10px] font-serif transition cursor-pointer flex items-center gap-1"
                    >
                      <Unlock className="w-3 h-3 text-amber-400" />
                      Dung Hợp Mồi Lửa
                    </button>
                  )}
                </div>
              </div>

              {/* Thông Số Luyện Đan Chi Tiết */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono p-2 rounded-lg bg-black/40 border border-zinc-900">
                <div className="flex justify-between items-center p-1 rounded bg-zinc-900/50">
                  <span className="text-zinc-500">Thiêu Độc:</span>
                  <span className="text-emerald-400 font-bold">{flame.baseToxicityBurnPercent}%</span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-zinc-900/50">
                  <span className="text-zinc-500">Sản Lượng:</span>
                  <span className="text-purple-400 font-bold">x{flame.baseYieldMultiplier}</span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-zinc-900/50">
                  <span className="text-zinc-500">Rủi Ro Nổ Lò:</span>
                  <span className={flame.explosionRiskPercent > 0 ? 'text-red-400 font-bold' : 'text-zinc-400'}>
                    {flame.explosionRiskPercent}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-zinc-900/50">
                  <span className="text-zinc-500">Dược Tính Biến Dị:</span>
                  <span className="text-fuchsia-400 font-bold">x{flame.mutationChanceMultiplier}</span>
                </div>
              </div>

              {/* Khu Vực Tiến Hóa & Ôn Dưỡng (Nếu Đã Thuần Phục) */}
              {isUnlocked && instance && (
                <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="font-serif font-bold text-amber-200">
                        Phẩm Bậc: {TIER_ROMAN_MAP[instance.tier]}
                      </span>
                    </div>
                    <span className="text-zinc-400 text-[10.5px]">
                      {isMaxTier
                        ? 'CỰC HẠN TIÊN THIÊN'
                        : `${instance.currentExp} / ${instance.maxExp} EXP (${Math.round((instance.currentExp / instance.maxExp) * 100)}%)`}
                    </span>
                  </div>

                  {/* Thanh Tiến Độ EXP */}
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isMaxTier
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-300 w-full animate-pulse'
                          : 'bg-gradient-to-r from-amber-600 to-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, (instance.currentExp / instance.maxExp) * 100)}%` }}
                    />
                  </div>

                  {/* 2 Nút Ôn Dưỡng: Khoáng Thạch & Tu Vi */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      disabled={isMaxTier}
                      onClick={() => setSelectedOreFlameId(flame.id)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 ${
                        isMaxTier
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                          : 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-700/50 text-amber-300 cursor-pointer shadow-sm'
                      }`}
                    >
                      <Gem className="w-3.5 h-3.5 text-amber-400" />
                      <span>Nuôi Bằng Khoáng Thạch</span>
                    </button>

                    <button
                      disabled={isMaxTier}
                      onClick={() => setSelectedTuViFlameId(flame.id)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 ${
                        isMaxTier
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                          : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-700/50 text-purple-300 cursor-pointer shadow-sm'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span>Truyền Chân Nguyên (+EXP)</span>
                    </button>
                  </div>

                  {/* Danh Sách Aura Đan Đạo Mở Khóa */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className="text-[10px] text-zinc-400 font-serif flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span>Aura Đan Đạo Thụ Động:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      {flame.auras.map(aura => {
                        const isAuraUnlocked = instance.tier >= aura.unlockedAtTier;

                        return (
                          <div
                            key={aura.id}
                            className={`p-2 rounded border text-left text-[10px] space-y-0.5 transition ${
                              isAuraUnlocked
                                ? 'bg-amber-950/40 border-amber-600/50 text-amber-200'
                                : 'bg-black/30 border-zinc-900 text-zinc-600 opacity-60'
                            }`}
                          >
                            <div className="flex justify-between items-center font-serif font-bold">
                              <span className={isAuraUnlocked ? 'text-amber-300' : 'text-zinc-500'}>
                                {aura.name}
                              </span>
                              <span className="font-mono text-[9px]">
                                {isAuraUnlocked ? (
                                  <span className="text-emerald-400 flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Giai {aura.unlockedAtTier}
                                  </span>
                                ) : (
                                  <span className="text-zinc-600 flex items-center gap-0.5">
                                    <Lock className="w-2.5 h-2.5" /> Giai {aura.unlockedAtTier}
                                  </span>
                                )}
                              </span>
                            </div>
                            <p className="text-[9.5px] leading-tight text-zinc-400">
                              {aura.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Cho Dị Hỏa Ăn Khoáng Thạch */}
      {selectedOreFlameId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#18120d] via-[#120e0a] to-[#0a0806] border border-amber-600/60 p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-amber-900/60 pb-2">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-sm text-amber-100">
                  Nuôi Hỏa Bằng Khoáng Thạch
                </h3>
              </div>
              <button
                onClick={() => setSelectedOreFlameId(null)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 font-serif">
              Chọn các loại linh thạch, thiết tinh, cát sao trong túi để Dị Hỏa hấp thụ tinh hoa kim thạch chuyển hóa thành EXP.
            </p>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {ownedOres.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 italic font-serif">
                  Túi Trữ Vật không có khoáng thạch nào. Hãy khai thác ở Tinh Hải hoặc mua tại Vạn Bảo Thương Hội.
                </div>
              ) : (
                ownedOres.map(ore => {
                  return (
                    <div
                      key={ore.id}
                      className="p-2.5 rounded-lg bg-black/50 border border-amber-900/40 flex justify-between items-center gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-amber-200">
                          {ore.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Phẩm: {ore.grade || 'Tam Giai'} • Đang có: <strong className="text-emerald-400">{ore.quantity}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleFeedFlameWithOre(selectedOreFlameId, ore.id, 1)}
                          className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/50 text-amber-200 text-[10px] font-mono transition cursor-pointer"
                        >
                          +1
                        </button>
                        {ore.quantity >= 5 && (
                          <button
                            onClick={() => handleFeedFlameWithOre(selectedOreFlameId, ore.id, 5)}
                            className="px-2 py-1 rounded bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/50 text-amber-200 text-[10px] font-mono transition cursor-pointer"
                          >
                            +5
                          </button>
                        )}
                        <button
                          onClick={() => handleFeedFlameWithOre(selectedOreFlameId, ore.id, ore.quantity)}
                          className="px-2 py-1 rounded bg-gradient-to-r from-amber-700 to-yellow-700 hover:brightness-110 text-white text-[10px] font-mono transition cursor-pointer"
                        >
                          Hết
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setSelectedOreFlameId(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
            >
              Hoàn Tất Nuôi Hỏa
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Truyền Chân Nguyên / Tu Vi Nuôi Hỏa */}
      {selectedTuViFlameId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#180f1e] via-[#100b14] to-[#070509] border border-purple-600/60 p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-purple-900/60 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <h3 className="font-serif font-bold text-sm text-purple-100">
                  Truyền Chân Nguyên Độ Hỏa
                </h3>
              </div>
              <button
                onClick={() => setSelectedTuViFlameId(null)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-black/50 border border-purple-900/40 text-xs font-mono flex justify-between items-center">
              <span className="text-zinc-400">Tu Vi Hiện Tại:</span>
              <span className="text-purple-300 font-bold">
                {player.tuVi.toLocaleString()} Tu Vi
              </span>
            </div>

            <p className="text-[11px] text-zinc-300 font-serif leading-relaxed">
              Trích xuất Chân Nguyên từ đan điền để ôn dưỡng ngọn lửa. Quá trình này sẽ tiêu hao vĩnh viễn Tu Vi tích lũy của đạo hữu:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { cost: 200, exp: 100 },
                { cost: 1000, exp: 500 },
                { cost: 5000, exp: 2500 },
                { cost: 20000, exp: 10000 }
              ].map(opt => {
                const canAfford = player.tuVi >= opt.cost;

                return (
                  <button
                    key={opt.cost}
                    disabled={!canAfford}
                    onClick={() => handleFeedFlameWithTuVi(selectedTuViFlameId, opt.cost)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      canAfford
                        ? 'bg-purple-950/60 hover:bg-purple-900/80 border-purple-500/50 text-purple-200'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-bold">-{opt.cost.toLocaleString()} Tu Vi</span>
                    <span className="text-[10px] text-yellow-400">+{opt.exp.toLocaleString()} EXP</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedTuViFlameId(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
            >
              Đóng Cửa Đan Phòng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
