// components/forging/FormationSetPieceCrafter.tsx
// Bảng đúc mảnh và mở khóa mốc threshold cho 3 bộ Trận Khí Tùy Thân Thượng Cổ
// 100% Strict TypeScript, Tailwind CSS, Responsive Design

import React, { useMemo } from 'react';
import {
  Hammer,
  Zap,
  Shield,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Flame,
  Award,
  AlertCircle
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import {
  FormationSetConfig,
  FormationSetCategory,
  PlayerFormationSetProgress
} from '@/lib/types/weapon-tribulation-array';
import { FORMATION_SETS_REGISTRY } from '@/lib/weapon-tribulation-array-logic';

export interface FormationSetPieceCrafterProps {
  player: PlayerState;
  selectedSetId: string;
  onSelectSetId: (id: string) => void;
  onCraftPieces: (setId: string, count: number) => Promise<boolean>;
  onToggleEquip: (setId: string) => void;
  isProcessing: boolean;
}

export const FormationSetPieceCrafter: React.FC<FormationSetPieceCrafterProps> = ({
  player,
  selectedSetId,
  onSelectSetId,
  onCraftPieces,
  onToggleEquip,
  isProcessing
}) => {
  const allSets = useMemo<FormationSetConfig[]>(() => {
    return Object.values(FORMATION_SETS_REGISTRY);
  }, []);

  const activeSet = useMemo<FormationSetConfig>(() => {
    return (
      FORMATION_SETS_REGISTRY[selectedSetId as FormationSetCategory] ||
      FORMATION_SETS_REGISTRY['chu_thien_kiem']
    );
  }, [selectedSetId]);

  const setProgress = useMemo<PlayerFormationSetProgress | undefined>(() => {
    return player.formationSetsState?.ownedSets?.[activeSet.id];
  }, [player.formationSetsState, activeSet.id]);

  const currentPieces = setProgress?.currentPieces || 0;
  const maxPieces = activeSet.maxPieces;
  const isCompleted = currentPieces >= maxPieces;
  const isCurrentlyEquipped = player.formationSetsState?.equippedArraySetId === activeSet.id;

  // Tính toán mốc hiệu ứng cao nhất hiện tại đã mở khóa
  const currentActiveMilestone = useMemo(() => {
    const unlocked = activeSet.thresholdBonuses.filter(th => currentPieces >= th.requiredPieces);
    if (unlocked.length === 0) return null;
    return unlocked[unlocked.length - 1];
  }, [activeSet, currentPieces]);

  // Kiểm tra tài nguyên người chơi
  const playerLinhThach =
    typeof player.linhThach === 'number'
      ? player.linhThach
      : typeof (player as any).spiritStones === 'number'
      ? (player as any).spiritStones
      : 0;

  const playerOres = player.inventory?.ores || [];

  // Tính chi phí cho 1 mảnh và 6 mảnh
  const costFor1 = activeSet.pieceCraftCost;
  const countBatch = Math.min(6, Math.max(1, maxPieces - currentPieces));
  const canCraft1 =
    !isCompleted &&
    playerLinhThach >= costFor1.spiritStones &&
    costFor1.minerals.every(m => {
      const owned = playerOres.find(o => o.name === m.name || o.id === m.itemId);
      return (owned?.quantity || 0) >= m.amount;
    });

  const canCraftBatch =
    !isCompleted &&
    playerLinhThach >= costFor1.spiritStones * countBatch &&
    costFor1.minerals.every(m => {
      const owned = playerOres.find(o => o.name === m.name || o.id === m.itemId);
      return (owned?.quantity || 0) >= m.amount * countBatch;
    });

  return (
    <div className="space-y-4">
      {/* 1. Bộ chuyển đổi 3 Bộ Trận Khí Thượng Cổ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {allSets.map(set => {
          const isSelected = set.id === activeSet.id;
          const setProg = player.formationSetsState?.ownedSets?.[set.id];
          const pieces = setProg?.currentPieces || 0;
          const isEquip = player.formationSetsState?.equippedArraySetId === set.id;

          return (
            <button
              key={set.id}
              onClick={() => onSelectSetId(set.id)}
              className={`relative p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-gradient-to-b from-stone-900 to-purple-950/60 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40'
                  : 'bg-stone-950/70 border-stone-800/80 hover:border-purple-800/50 hover:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-stone-200">
                  {set.name}
                </span>
                {isEquip && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>
                  Tiến độ: <strong className={pieces >= set.maxPieces ? 'text-emerald-400' : 'text-amber-400'}>{pieces}/{set.maxPieces}</strong>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-900 border border-stone-800">
                  {set.category === 'chu_thien_kiem' ? '36 Kiếm' : set.category === 'ngu_hanh_chau' ? '5 Châu' : '8 Kỳ'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Banner Tiến Độ Bộ Trận Khí Hiện Tại */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-stone-950 via-purple-950/30 to-stone-950 border border-purple-900/50 space-y-2.5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">🗡️</span>
            <span className="font-serif font-bold text-xs sm:text-sm text-stone-100">
              {currentPieces}/{maxPieces} {activeSet.name}
            </span>
            {isCompleted && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-serif font-bold animate-pulse">
                ★ VIÊN MÃN
              </span>
            )}
          </div>

          <div className="text-[11px] font-serif text-purple-300">
            {currentActiveMilestone ? (
              <span>Mở Khóa: <strong>{currentActiveMilestone.title}</strong> ({currentActiveMilestone.description})</span>
            ) : (
              <span className="text-zinc-500">Chưa kích hoạt mốc đại trận nào</span>
            )}
          </div>
        </div>

        {/* Thanh Progress Bar */}
        <div className="w-full h-2 rounded-full bg-stone-900 border border-purple-900/40 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-violet-500 to-amber-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.floor((currentPieces / maxPieces) * 100))}%` }}
          />
        </div>
      </div>

      {/* 3. Danh sách các Mốc Hiệu Ứng Đại Trận (Threshold Bonuses) */}
      <div className="space-y-2">
        <h4 className="font-serif font-bold text-xs text-purple-200 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Mốc Linh Uy Trận Khí</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {activeSet.thresholdBonuses.map(th => {
            const isUnlocked = currentPieces >= th.requiredPieces;
            return (
              <div
                key={th.requiredPieces}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-stone-900/90 to-purple-950/70 border-purple-500/70 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'bg-stone-950/50 border-stone-800/80 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-900 border border-purple-800/50 text-purple-300">
                    Mốc {th.requiredPieces} Mảnh
                  </span>
                  {isUnlocked ? (
                    <span className="text-[10px] text-emerald-400 font-serif flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã Mở</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-serif flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Còn {th.requiredPieces - currentPieces} mảnh</span>
                    </span>
                  )}
                </div>

                <h5 className="font-serif font-bold text-xs text-stone-200">{th.title}</h5>
                <p className="text-[11px] text-zinc-400 font-serif mt-1 leading-relaxed">
                  {th.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bảng Chi Phí Tài Nguyên Đúc Mảnh */}
      <div className="p-3.5 rounded-xl bg-stone-900/80 border border-purple-900/40 space-y-2 text-xs">
        <span className="font-serif font-bold text-purple-200 block">
          Nguyên Liệu Đúc Mỗi Mảnh:
        </span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-purple-900/30">
            <span className="text-amber-400">⚡ Linh Thạch:</span>
            <span className={playerLinhThach >= costFor1.spiritStones ? 'text-stone-200' : 'text-rose-400 font-bold'}>
              {costFor1.spiritStones.toLocaleString()} LT
            </span>
          </div>

          {costFor1.minerals.map(m => {
            const owned = playerOres.find(o => o.name === m.name || o.id === m.itemId);
            const qty = owned?.quantity || 0;
            const hasEnough = qty >= m.amount;
            return (
              <div
                key={m.itemId || m.name}
                className="flex items-center gap-1.5 bg-stone-950/80 px-2.5 py-1 rounded-lg border border-purple-900/30"
              >
                <span className="text-purple-300">{m.name}:</span>
                <span className={hasEnough ? 'text-stone-200' : 'text-rose-400 font-bold'}>
                  {qty}/{m.amount}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Nút Thao Tác: Đúc +1 Mảnh, Đúc Cấp Tốc, Kích Hoạt Trận Khí */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Nút Đúc +1 Mảnh */}
        <button
          onClick={() => onCraftPieces(activeSet.id, 1)}
          disabled={!canCraft1 || isProcessing || isCompleted}
          className={`py-2.5 px-3 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-md ${
            !canCraft1 || isProcessing || isCompleted
              ? 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-purple-800 to-indigo-800 hover:brightness-110 text-white border border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.3)] active:scale-95'
          }`}
        >
          <Hammer className="w-3.5 h-3.5 text-purple-200" />
          <span>[🔨 Đúc +1 Mảnh]</span>
        </button>

        {/* Nút Đúc Cấp Tốc +6 Mảnh */}
        <button
          onClick={() => onCraftPieces(activeSet.id, countBatch)}
          disabled={!canCraftBatch || isProcessing || isCompleted}
          className={`py-2.5 px-3 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-md ${
            !canCraftBatch || isProcessing || isCompleted
              ? 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-amber-700 to-purple-800 hover:brightness-110 text-white border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)] active:scale-95'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{`[⚡ Đúc Cấp Tốc +${countBatch} Mảnh]`}</span>
        </button>

        {/* Nút Trang Bị / Thu Hồi */}
        <button
          onClick={() => onToggleEquip(activeSet.id)}
          disabled={currentPieces === 0 || isProcessing}
          className={`py-2.5 px-3 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-md ${
            currentPieces === 0 || isProcessing
              ? 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-50'
              : isCurrentlyEquipped
              ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-600 active:scale-95'
              : 'bg-gradient-to-r from-emerald-800 to-teal-700 hover:brightness-110 text-white border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95'
          }`}
        >
          {isCurrentlyEquipped ? (
            <>
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span>[THU HỒI TRẬN KHÍ]</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-emerald-300" />
              <span>[⚔️ KÍCH HOẠT TRẬN KHÍ TÙY THÂN]</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
