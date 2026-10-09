// components/forging/ReforgeComparisonCard.tsx
// Bang so sanh chi so Truoc & Sau khi Trung Chu Nang Bac Than Binh
// 100% Strict TypeScript, Tailwind CSS, Phong cach Co Phong Tien Hiep

import React from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Flame,
  AlertTriangle,
  Layers,
  Gem,
  Coins
} from 'lucide-react';
import { Equipment } from '@/lib/types/items';
import { ReforgePreviewResult } from '@/lib/types/legacy-tempering';
import { TIER_STAT_SCALE_CONFIG, resolveEquipmentTier } from '@/lib/legacy-tempering-logic';
import { PlayerState } from '@/lib/types/player';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';

export interface ReforgeComparisonCardProps {
  equipment: Equipment | null;
  reforgePreview: ReforgePreviewResult | null;
  previewError: string | null;
  targetTierSelection: number;
  maxAllowedTier: number;
  onSelectTargetTier: (tier: number) => void;
  onExecuteReforge: () => void;
  isProcessing: boolean;
  player: PlayerState;
}

export const ReforgeComparisonCard: React.FC<ReforgeComparisonCardProps> = ({
  equipment,
  reforgePreview,
  previewError,
  targetTierSelection,
  maxAllowedTier,
  onSelectTargetTier,
  onExecuteReforge,
  isProcessing,
  player
}) => {
  if (!equipment) {
    return (
      <div className="p-8 rounded-xl bg-gradient-to-b from-stone-950/90 via-[#0e0c0f] to-stone-950 border border-stone-800 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-900/80 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Zap className="w-7 h-7 text-amber-400/80" />
        </div>
        <h4 className="font-serif text-sm font-bold text-amber-200/90">
          Chưa Chọn Thần Binh Để Trùng Chú
        </h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          Xin hãy chọn một món Pháp Bảo hoặc Bản Mệnh Vũ Khí trong danh sách để mở lò Trùng Chú Tái Sinh, đột phá giai vị thần khí.
        </p>
      </div>
    );
  }

  const currentTier = resolveEquipmentTier(equipment);
  const currentConfig = TIER_STAT_SCALE_CONFIG[currentTier] || TIER_STAT_SCALE_CONFIG[1];
  const targetConfig = TIER_STAT_SCALE_CONFIG[targetTierSelection] || TIER_STAT_SCALE_CONFIG[Math.min(9, currentTier + 1)];

  // Helper check owned mineral
  const getOwnedMineralCount = (mineralId: string): number => {
    const fromOres = (player.inventory?.ores || []).find((o: { id: string; quantity: number }) => o.id === mineralId)?.quantity || 0;
    if (fromOres > 0) return fromOres;
    const mats = (player.inventory as any)?.materials as Array<{ id: string; quantity: number }> | undefined;
    const fromMats = (mats || []).find((m: { id: string; quantity: number }) => m.id === mineralId)?.quantity || 0;
    return fromMats;
  };

  const isMaxRealmCapped = currentTier >= maxAllowedTier;
  const isMaxTier9 = currentTier >= 9;
  const minSliderTier = Math.min(9, currentTier + 1);
  const maxSliderTier = Math.min(9, Math.max(minSliderTier, maxAllowedTier));

  // Check costs fulfillment
  const costs = reforgePreview?.costs;
  const spiritStonesCost = costs?.spiritStonesCost ?? 0;
  const hasEnoughSpiritStones = (player.linhThach ?? 0) >= spiritStonesCost;

  const mineralRequirements = costs?.requiredMinerals || [];
  const hasEnoughMinerals = mineralRequirements.every(
    (m: { itemId: string; name: string; amount: number }) => getOwnedMineralCount(m.itemId) >= m.amount
  );

  const canExecute = Boolean(
    reforgePreview &&
    !previewError &&
    !isProcessing &&
    targetTierSelection > currentTier &&
    targetTierSelection <= maxAllowedTier &&
    hasEnoughSpiritStones &&
    hasEnoughMinerals
  );

  return (
    <div className="rounded-xl bg-gradient-to-b from-stone-950/95 via-[#120e11] to-stone-950 border border-stone-800 shadow-2xl p-4 sm:p-5 space-y-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Thần Binh đang chọn */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-serif font-bold text-amber-200">
              [{convertGradeToGiai(equipment.grade)}] {equipment.name}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${getItemQuality(equipment.quality).badgeClass}`}>
              {getItemQuality(equipment.quality).name}
            </span>
            {equipment.reforgeCount && equipment.reforgeCount > 0 ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-600/40 font-mono">
                Trùng Chú x{equipment.reforgeCount}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-zinc-400">
            Cảnh giới hiện tại: <span className="text-amber-400 font-semibold">{currentConfig.gradeName}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-stone-900 border border-stone-700/60">
          <span className="text-zinc-400">Trần Tu Vi:</span>
          <span className="text-cyan-300 font-bold">Tier {maxAllowedTier}/9</span>
        </div>
      </div>

      {/* SLIDER CHỌN CẢNH GIỚI ĐÍCH */}
      <div className="p-3.5 rounded-lg bg-stone-900/60 border border-amber-500/20 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-serif font-bold text-amber-200">
              Chọn Cảnh Giới Đích (Nâng Bậc Thần Binh)
            </span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950/70 border border-rose-600/50 text-rose-200">
            Bậc {targetTierSelection}: {targetConfig?.realmName} ({targetConfig?.gradeName})
          </span>
        </div>

        {isMaxTier9 ? (
          <div className="text-xs text-amber-300/90 italic py-1 text-center bg-amber-950/30 rounded border border-amber-800/40">
            ✨ Thần binh đã đạt đỉnh cao Cửu Giai Thái Sơ Thần Binh, không thể nâng thêm!
          </div>
        ) : isMaxRealmCapped ? (
          <div className="text-xs text-rose-300/90 py-1.5 px-2.5 bg-rose-950/40 rounded border border-rose-700/40 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Đã chạm trần cảnh giới nhân vật ({currentConfig.realmName}). Cần đột phá tu vi để trùng chú tiếp!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="range"
              min={minSliderTier}
              max={maxSliderTier}
              step={1}
              value={targetTierSelection}
              onChange={(e) => onSelectTargetTier(Number(e.target.value))}
              disabled={isProcessing || minSliderTier >= maxSliderTier}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rose-600 disabled:opacity-50 transition-all"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 px-1">
              {Array.from({ length: 9 }).map((_, idx) => {
                const tierNum = idx + 1;
                const isCurrent = tierNum === currentTier;
                const isTarget = tierNum === targetTierSelection;
                const isLocked = tierNum > maxAllowedTier;
                return (
                  <button
                    key={tierNum}
                    type="button"
                    disabled={tierNum <= currentTier || isLocked}
                    onClick={() => onSelectTargetTier(tierNum)}
                    className={`transition cursor-pointer px-1 rounded ${
                      isTarget
                        ? 'text-rose-400 font-bold scale-110'
                        : isCurrent
                        ? 'text-amber-400 font-semibold'
                        : isLocked
                        ? 'text-zinc-600 opacity-40 cursor-not-allowed'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    G.{tierNum}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* BẢNG SO SÁNH CHỈ SỐ (ATK / DEF / HP) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-serif text-zinc-300 px-1">
          <span className="font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            So Sánh Biến Thiên Thuộc Tính
          </span>
          <span className="text-[11px] font-mono text-amber-400/90">
            Hệ số tăng tiến: x{targetConfig?.scaleMultiplier ?? 1.0}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* ATK */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-stone-800 flex flex-col justify-between space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-serif">
              <span>⚔️ Tấn Công (ATK)</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-300">{reforgePreview?.currentAtk ?? (equipment.baseStats?.attack || 0)}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-emerald-400 font-bold animate-pulse" />
                {reforgePreview?.projectedAtk ?? (equipment.baseStats?.attack || 0)}
              </span>
            </div>
            {reforgePreview && reforgePreview.projectedAtk > reforgePreview.currentAtk ? (
              <div className="text-[10px] font-mono text-emerald-400 text-right font-semibold">
                +{reforgePreview.projectedAtk - reforgePreview.currentAtk}
              </div>
            ) : null}
          </div>

          {/* DEF */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-stone-800 flex flex-col justify-between space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-serif">
              <span>🛡️ Phòng Ngự (DEF)</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-300">{reforgePreview?.currentDef ?? (equipment.baseStats?.defense || 0)}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-emerald-400 font-bold animate-pulse" />
                {reforgePreview?.projectedDef ?? (equipment.baseStats?.defense || 0)}
              </span>
            </div>
            {reforgePreview && reforgePreview.projectedDef > reforgePreview.currentDef ? (
              <div className="text-[10px] font-mono text-emerald-400 text-right font-semibold">
                +{reforgePreview.projectedDef - reforgePreview.currentDef}
              </div>
            ) : null}
          </div>

          {/* HP */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-stone-800 flex flex-col justify-between space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-serif">
              <span>❤️ Khí Huyết (HP)</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-300">{reforgePreview?.currentHp ?? (equipment.baseStats?.hp || 0)}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-emerald-400 font-bold animate-pulse" />
                {reforgePreview?.projectedHp ?? (equipment.baseStats?.hp || 0)}
              </span>
            </div>
            {reforgePreview && reforgePreview.projectedHp > reforgePreview.currentHp ? (
              <div className="text-[10px] font-mono text-emerald-400 text-right font-semibold">
                +{reforgePreview.projectedHp - reforgePreview.currentHp}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* DÒNG CAM KẾT BẢO TỒN NỔI BẬT */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-950/30 border border-amber-500/40 shadow-sm space-y-1.5">
        <div className="text-center font-serif text-xs font-bold text-amber-200 tracking-wide flex items-center justify-center gap-1.5">
          <span>✨ Hợp Kim Ngũ Hành, Mạch Dẫn Linh & Khí Linh được bảo lưu vĩnh viễn 100%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px] font-mono text-zinc-300">
          <div className="p-1.5 rounded bg-black/40 border border-amber-900/30 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Hợp Kim: <strong className="text-amber-200">{reforgePreview?.preservedAlloyName || 'Nguyên bản'}</strong></span>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-cyan-900/30 flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">Trận Văn: <strong className="text-cyan-200">{reforgePreview?.preservedInscriptionCount ?? 0} Đồ hình</strong></span>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-purple-900/30 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">Khí Linh: <strong className="text-purple-200">{reforgePreview?.preservedSoulName || 'Chưa phong hồn'}</strong></span>
          </div>
        </div>
      </div>

      {/* BẢNG CHI PHÍ TÀI NGUYÊN */}
      <div className="p-3 rounded-lg bg-black/50 border border-stone-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-serif text-zinc-300">
          <span className="font-bold flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-rose-400" />
            Tài Nguyên Yêu Cầu
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            Yêu cầu: Luyện Khí Sư Bậc {targetConfig?.requiredBlacksmithRealmIndex ? Math.ceil(targetConfig.requiredBlacksmithRealmIndex / 10) : 1}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {/* Khoáng thạch */}
          {mineralRequirements.map((m) => {
            const owned = getOwnedMineralCount(m.itemId);
            const isSufficient = owned >= m.amount;
            return (
              <div
                key={m.itemId}
                className={`p-2 rounded border flex items-center justify-between ${
                  isSufficient
                    ? 'bg-stone-900/60 border-stone-700 text-zinc-200'
                    : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400">⛏️</span>
                  <span>{m.name}</span>
                </div>
                <span className={isSufficient ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {owned}/{m.amount}
                </span>
              </div>
            );
          })}

          {/* Linh thạch */}
          <div
            className={`p-2 rounded border flex items-center justify-between ${
              hasEnoughSpiritStones
                ? 'bg-stone-900/60 border-stone-700 text-zinc-200'
                : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Linh Thạch</span>
            </div>
            <span className={hasEnoughSpiritStones ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {(player.linhThach ?? 0).toLocaleString()}/{spiritStonesCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ERROR FEEDBACK NẾU CÓ */}
      {previewError && (
        <div className="p-2.5 rounded bg-rose-950/50 border border-rose-700/60 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{previewError}</span>
        </div>
      )}

      {/* NÚT BẤM PHÁT QUANG */}
      <button
        type="button"
        onClick={onExecuteReforge}
        disabled={!canExecute}
        className={`w-full py-3 px-4 rounded-xl font-serif text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
          canExecute
            ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-500 hover:via-rose-500 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.7)] hover:brightness-110 active:scale-[0.99]'
            : 'bg-stone-900 text-zinc-500 border border-stone-800 cursor-not-allowed opacity-60'
        }`}
      >
        <Zap className={`w-4 h-4 ${canExecute ? 'text-amber-200 animate-bounce' : 'text-zinc-600'}`} />
        <span>[⚡ TRÙNG CHÚ TÁI SINH (NÂNG BẬC THẦN BINH)]</span>
      </button>
    </div>
  );
};
