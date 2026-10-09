// components/breakthrough/BreakthroughCatalystAltar.tsx
// Bàn Khảm Nạp Hộ Mệnh, Bảng Dự Toán Thiên Cơ & Hệ Thống Đan Độc / Tâm Ma phong cách Tiên Hiệp Cổ Phong
// 100% Strict TypeScript, Tailwind CSS, Responsive

import React from 'react';
import { PlayerState } from '@/lib/types/player';
import { useBreakthroughCatalystActions } from '@/hooks/useBreakthroughCatalystActions';
import { useBreakthroughBacklashActions } from '@/hooks/useBreakthroughBacklashActions';
import { CatalystItemDrawer } from './CatalystItemDrawer';
import { BreakthroughResultModal } from './BreakthroughResultModal';
import { Sparkles, Shield, X, Plus, AlertTriangle, Zap, CheckCircle2, Flame, Eye } from 'lucide-react';

export interface BreakthroughCatalystAltarProps {
  player: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  onExecuteFallback?: () => void;
  isBreakingThrough?: boolean;
  onBreakthroughSuccess?: () => void;
  openEnhancedSeclusionModal?: () => void;
  onSwitchToDeepCultivation?: () => void;
  className?: string;
  isMajorTransition?: boolean;
  onMajorBreakthroughClick?: () => void;
}

export const BreakthroughCatalystAltar: React.FC<BreakthroughCatalystAltarProps> = ({
  player,
  setPlayer,
  onExecuteFallback,
  isBreakingThrough = false,
  onBreakthroughSuccess,
  openEnhancedSeclusionModal,
  onSwitchToDeepCultivation,
  className = '',
  isMajorTransition = false,
  onMajorBreakthroughClick
}) => {
  const {
    selectedPillInstanceId,
    selectedTalismanItemId,
    isExecuting,
    executionResult,
    activeDrawerSlot,
    selectedPill,
    selectedTalisman,
    availablePills,
    availableTalismans,
    rateCalculation,
    targetNextRealm,
    requiredTuVi,
    handleSelectPill,
    handleSelectTalisman,
    handleOpenDrawer,
    handleCloseDrawer,
    handleClearExecutionResult,
    handleExecuteBreakthrough
  } = useBreakthroughCatalystActions(player);

  const {
    toxicityModifier,
    isInjured,
    hasBottleneck,
    healingPillsInInventory,
    dispelTalismansInInventory,
    handleHealWithPill,
    handleDispelBottleneck,
    isProcessing: isBacklashProcessing
  } = useBreakthroughBacklashActions(player, setPlayer, targetNextRealm);

  if (!targetNextRealm) {
    return (
      <div className="p-4 text-center text-xs text-amber-300 font-serif border border-amber-600/30 rounded-xl bg-black/40">
        🌟 Đạo hữu đã đạt tới Cực Cảnh Thiên Đạo (Đế Tổ), thiên địa vô địch!
      </div>
    );
  }

  // Phân tích đan văn của đan đã khảm
  const pillVeinCount = selectedPill?.veinMetadata?.veinCount ?? selectedPill?.veinCount ?? 0;
  const isNineVeinPill = pillVeinCount === 9;
  const isHighVeinPill = pillVeinCount >= 6 && pillVeinCount <= 8;

  // Tỷ lệ phần trăm tính toán & điều chỉnh đan độc, tâm ma
  const baseRatePercent = Math.round(rateCalculation.baseRate * 100);
  const pillBonusPercent = Math.round(rateCalculation.pillBonusRate * 100);
  const toxModPercent = Math.round(toxicityModifier.rateModifier * 100);
  const toxModStr = toxModPercent >= 0 ? `+${toxModPercent}%` : `${toxModPercent}%`;

  // Tính toán final rate có xét đến bottleneck (tâm ma chướng) nếu có
  const rawSumRate = rateCalculation.baseRate + rateCalculation.pillBonusRate + toxicityModifier.rateModifier;
  const bottleneckMultiplier = hasBottleneck && !isNineVeinPill ? 0.5 : 1.0;
  const effectiveFinalRate = isNineVeinPill || rateCalculation.isGuaranteedSuccess
    ? 1.0
    : Math.max(0.05, Math.min(1.0, rawSumRate * bottleneckMultiplier));
  const effectiveFinalPercent = Math.round(effectiveFinalRate * 100);
  const isGuaranteed = isNineVeinPill || rateCalculation.isGuaranteedSuccess || effectiveFinalPercent >= 100;

  // Tính toán điều kiện đủ tu vi và linh thạch
  const effectiveSpiritStoneCost = rateCalculation.spiritStoneCost;
  const canBreakTuVi = player.tuVi >= requiredTuVi;
  const canBreakLinhThach = player.linhThach >= effectiveSpiritStoneCost;
  const canExecute = canBreakTuVi && canBreakLinhThach && !isExecuting && !isInjured;

  // Công thức breakdown theo yêu cầu: Tỉ lệ: Cơ bản (90%) + Đan độc (-20%) = 70%
  const breakdownFormula = pillBonusPercent > 0
    ? `Tỉ lệ: Cơ bản (${baseRatePercent}%) + Đan (+${pillBonusPercent}%) + Đan độc (${toxModStr}) = ${effectiveFinalPercent}%`
    : `Tỉ lệ: Cơ bản (${baseRatePercent}%) + Đan độc (${toxModStr}) = ${effectiveFinalPercent}%`;

  // Tìm vật phẩm trị thương & trừ tâm ma đầu tiên trong kho
  const firstHealingPill = healingPillsInInventory[0];
  const healPillId = firstHealingPill
    ? firstHealingPill.id || firstHealingPill.itemId || 'item_dai_hoan_dan'
    : 'item_dai_hoan_dan';
  const totalHealingPillCount = healingPillsInInventory.reduce(
    (acc, p) => acc + (p.quantity ?? p.count ?? 1),
    0
  );

  const firstDispelItem = dispelTalismansInInventory[0];
  const dispelItemId = firstDispelItem
    ? firstDispelItem.id || firstDispelItem.itemId || 'item_thanh_tam_phu'
    : 'item_thanh_tam_phu';
  const totalDispelItemCount = dispelTalismansInInventory.reduce(
    (acc, t) => acc + (t.quantity ?? t.count ?? 1),
    0
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* ============================================================ */}
      {/* 1. BÀN KHẢM NẠP 2 Ô NGANG (CATALYST SLOTS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {/* --- Ô TRÁI: ĐAN DƯỢC PHÁ CẢNH --- */}
        <div
          className={`relative p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-between min-h-[92px] ${
            selectedPill
              ? isNineVeinPill
                ? 'bg-gradient-to-br from-[#241a08] to-[#120e06] border-yellow-400/80 shadow-[0_0_15px_rgba(250,204,21,0.25)]'
                : 'bg-cyan-950/20 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
              : 'border-dashed border-cyan-500/35 hover:border-cyan-400 bg-cyan-950/10 hover:bg-cyan-950/20 cursor-pointer'
          }`}
          onClick={() => {
            if (!selectedPill) handleOpenDrawer('pill');
          }}
        >
          {/* Header slot */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-serif font-bold text-cyan-400 flex items-center gap-1 tracking-wider">
              <span>💊</span> ĐAN DƯỢC
            </span>
            {selectedPill ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPill(null);
                }}
                className="w-4 h-4 rounded-full bg-black/60 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-300 flex items-center justify-center transition cursor-pointer"
                title="Gỡ đan dược"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            ) : (
              <span className="text-[9px] font-mono text-zinc-400">Trống</span>
            )}
          </div>

          {/* Slot Body */}
          {selectedPill ? (
            <div className="my-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border ${
                isNineVeinPill
                  ? 'bg-yellow-950/80 border-yellow-400 text-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-pulse'
                  : 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
              }`}>
                {selectedPill.icon || '💊'}
              </div>

              <div className="min-w-0 space-y-0.5">
                <span className="font-serif font-bold text-xs text-zinc-100 truncate block">
                  {selectedPill.name}
                </span>
                {isNineVeinPill ? (
                  <span className="inline-block px-1 py-0.2 rounded text-[8.5px] font-serif font-extrabold bg-gradient-to-r from-amber-500 to-yellow-300 text-stone-950 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse">
                    🌟 9 VĂN • 100% THÀNH CÔNG
                  </span>
                ) : isHighVeinPill ? (
                  <span className="inline-block px-1 py-0.2 rounded text-[8.5px] font-serif font-bold bg-purple-950 text-purple-300 border border-purple-500/50">
                    ✨ {pillVeinCount} Văn (+15%)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 block">
                    +{Math.round((selectedPill.config?.baseSuccessRateBonus ?? selectedPill.baseSuccessRateBonus ?? 0.2) * 100)}% Tỷ Lệ
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="my-auto py-1 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer('pill');
                }}
                className="w-full py-1 px-1.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-600/40 text-[10.5px] font-serif text-cyan-300 hover:text-cyan-100 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Khảm Đan Dược</span>
              </button>
            </div>
          )}

          {/* Slot Footer indicator */}
          <div className="text-[9.5px] text-zinc-400 font-mono truncate">
            {selectedPill ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer('pill');
                }}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Đổi đan dược ({availablePills.length} có sẵn)
              </span>
            ) : (
              <span>{availablePills.length} đan dược có sẵn</span>
            )}
          </div>
        </div>

        {/* --- Ô PHẢI: TRẬN BÀN / PHÙ CHÚ --- */}
        <div
          className={`relative p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-between min-h-[92px] ${
            selectedTalisman
              ? 'bg-amber-950/25 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.18)]'
              : 'border-dashed border-amber-500/35 hover:border-amber-400 bg-amber-950/10 hover:bg-amber-950/20 cursor-pointer'
          }`}
          onClick={() => {
            if (!selectedTalisman) handleOpenDrawer('talisman');
          }}
        >
          {/* Header slot */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-serif font-bold text-amber-400 flex items-center gap-1 tracking-wider">
              <span>📜</span> TRẬN / PHÙ
            </span>
            {selectedTalisman ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTalisman(null);
                }}
                className="w-4 h-4 rounded-full bg-black/60 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-300 flex items-center justify-center transition cursor-pointer"
                title="Gỡ phù chú"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            ) : (
              <span className="text-[9px] font-mono text-zinc-400">Trống</span>
            )}
          </div>

          {/* Slot Body */}
          {selectedTalisman ? (
            <div className="my-1 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-500/60 text-amber-300 flex items-center justify-center text-lg shrink-0 shadow-sm">
                {selectedTalisman.icon || '📜'}
              </div>

              <div className="min-w-0 space-y-0.5">
                <span className="font-serif font-bold text-xs text-zinc-100 truncate block">
                  {selectedTalisman.name}
                </span>
                <span className="text-[9.5px] font-serif font-semibold text-amber-300 block truncate">
                  {selectedTalisman.effectType === 'reduce_spirit_stones' || selectedTalisman.itemId === 'item_tu_linh_tran_ban'
                    ? '🌀 Giảm 40% Linh Thạch'
                    : selectedTalisman.effectType === 'prevent_backlash' || selectedTalisman.itemId === 'item_ho_mach_phu'
                      ? '🛡️ Chặn 100% Phản Phệ'
                      : '🧘 Triệt Tiêu Đan Độc'}
                </span>
              </div>
            </div>
          ) : (
            <div className="my-auto py-1 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer('talisman');
                }}
                className="w-full py-1 px-1.5 rounded-md bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-[10.5px] font-serif text-amber-300 hover:text-amber-100 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Khảm Trận Bàn / Phù</span>
              </button>
            </div>
          )}

          {/* Slot Footer indicator */}
          <div className="text-[9.5px] text-zinc-400 font-mono truncate">
            {selectedTalisman ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDrawer('talisman');
                }}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Đổi phù ({availableTalismans.length} có sẵn)
              </span>
            ) : (
              <span>{availableTalismans.length} trận/phù có sẵn</span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. BANNER KHẨN CẤP TRỌNG THƯƠNG (Nổi bật trung tâm thẻ khi isInjured === true) */}
      {/* ============================================================ */}
      {isInjured && (
        <div className="p-3 rounded-xl border border-rose-600/80 bg-gradient-to-r from-rose-950/90 via-red-950/80 to-rose-950/90 text-rose-200 shadow-[0_0_16px_rgba(225,29,72,0.35)] space-y-2.5 animate-fadeIn">
          <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
            <span className="text-base shrink-0 leading-none">🩸</span>
            <p className="font-semibold text-rose-100">
              Thể phách trọng thương do Tẩu Hỏa Nhập Ma! Thuộc tính thực chiến -30%. Đang bị khóa đột phá!
            </p>
          </div>

          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            <button
              type="button"
              disabled={isBacklashProcessing || totalHealingPillCount === 0}
              onClick={() => {
                if (setPlayer) {
                  handleHealWithPill(healPillId, player, setPlayer);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-md ${
                totalHealingPillCount > 0
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:scale-[1.02] cursor-pointer'
                  : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
              }`}
              title={totalHealingPillCount > 0 ? `Dùng ${firstHealingPill?.name || 'Đại Hoàn Đan'}` : 'Chưa có đan trị thương trong túi'}
            >
              <span>💊 Dùng Đại Hoàn Đan Trị Thương</span>
              {totalHealingPillCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-rose-200">
                  x{totalHealingPillCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSwitchToDeepCultivation) {
                  onSwitchToDeepCultivation();
                } else if (openEnhancedSeclusionModal) {
                  openEnhancedSeclusionModal();
                }
              }}
              className="px-3 py-1 rounded-full text-xs font-serif font-bold bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-600/40 transition flex items-center gap-1.5 shadow-md hover:scale-[1.02] cursor-pointer"
            >
              <span>⏳ Bế Quan Dưỡng Thương</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. BANNER TÂM MA CHƯỚNG (Huyền bí khi hasBottleneck === true) */}
      {/* ============================================================ */}
      {hasBottleneck && (
        <div className="p-3 rounded-xl border border-purple-600/70 bg-gradient-to-r from-purple-950/90 via-[#1b0d2e] to-purple-950/90 text-purple-200 shadow-[0_0_16px_rgba(168,85,247,0.3)] space-y-2.5 animate-fadeIn">
          <div className="flex items-start gap-2 text-xs font-serif leading-relaxed">
            <span className="text-base shrink-0 leading-none">👁️</span>
            <p className="font-semibold text-purple-100">
              Đạo tâm vướng bận Tâm Ma Chướng! Cơ hội đột phá bị giảm một nửa (-50%).
            </p>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              disabled={isBacklashProcessing || totalDispelItemCount === 0}
              onClick={() => {
                if (setPlayer) {
                  handleDispelBottleneck(dispelItemId, player, setPlayer);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-md ${
                totalDispelItemCount > 0
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50 hover:scale-[1.02] cursor-pointer'
                  : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
              }`}
              title={totalDispelItemCount > 0 ? `Kích hoạt ${firstDispelItem?.name || 'Thanh Tâm Phù'}` : 'Chưa có phù chú/đan thanh tâm trong túi'}
            >
              <span>📜 Phục Dụng Thanh Tâm Phù</span>
              {totalDispelItemCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-purple-200">
                  x{totalDispelItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. BẢNG DỰ TOÁN THIÊN CƠ (LIVE SUCCESS BREAKDOWN HUD) */}
      {/* ============================================================ */}
      <div className="p-2 sm:p-2.5 rounded-xl border border-amber-900/40 bg-gradient-to-b from-[#14111a] to-[#0a080d] space-y-2 shadow-inner">
        {/* Breakdown bar */}
        <div className="flex items-center justify-between flex-wrap gap-1 text-[11px] font-mono border-b border-amber-950/40 pb-1.5">
          <div className="flex items-center gap-1 flex-wrap text-zinc-300">
            <span className="text-zinc-400 font-serif">Thiên Cơ:</span>
            <span>Gốc {baseRatePercent}%</span>
            {pillBonusPercent > 0 && (
              <>
                <span className="text-zinc-500">➔</span>
                <span className="text-cyan-400 font-bold">Đan +{pillBonusPercent}%</span>
              </>
            )}
            {toxModPercent !== 0 && (
              <>
                <span className="text-zinc-500">➔</span>
                <span className={`font-bold ${toxModPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Độc {toxModStr}
                </span>
              </>
            )}
            {hasBottleneck && !isNineVeinPill && (
              <>
                <span className="text-zinc-500">➔</span>
                <span className="text-purple-400 font-bold">Tâm Ma -50%</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-zinc-400 font-serif text-[10px]">TỔNG:</span>
            <span className={`text-xs font-black ${
              isGuaranteed
                ? 'text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse'
                : effectiveFinalPercent >= 75
                  ? 'text-emerald-400'
                  : 'text-amber-400'
            }`}>
              {effectiveFinalPercent}% {isGuaranteed ? '👑 [VIÊN MÃN]' : ''}
            </span>
          </div>
        </div>

        {/* Cảnh báo an toàn phản phệ */}
        <div className="text-[10.5px] font-serif flex items-center gap-1.5">
          {rateCalculation.isBacklashProtected ? (
            <div className="flex items-center gap-1.5 text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded-md border border-cyan-600/40 w-full shadow-sm">
              <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold truncate">
                🛡️ Kinh Mạch: Được Hộ Mạch Phù / Thần Đan Bảo Vệ (An Toàn Tuyệt Đối)
              </span>
            </div>
          ) : isInjured ? (
            <div className="flex items-center gap-1.5 text-rose-300 bg-rose-950/40 px-2 py-1 rounded-md border border-rose-800/60 w-full shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="font-semibold text-rose-200 truncate">
                🩸 Thể Phách: Đang Trọng Thương - Tuyệt đối không thể xung kích!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-300/90 bg-rose-950/30 px-2 py-1 rounded-md border border-rose-900/40 w-full">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-rose-300/90 truncate">
                ⚠️ Thất bại sẽ bị phản phệ: Tổn thương Máu và Tu Vi!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. DÒNG ĐO ĐAN ĐỘC & TRẠNG THÁI CĂN CƠ (NẰM NGAY TRÊN NÚT ĐỘT PHÁ) */}
      {/* ============================================================ */}
      <div className="w-full">
        {toxicityModifier.statusTag === 'tinh_khiet' && (
          <div className="w-full py-1.5 px-3 rounded-lg border border-emerald-500/40 text-emerald-300 bg-emerald-950/30 shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1.5 text-xs font-serif font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span>✨ CĂN CƠ BĂNG THANH • +10% TỈ LỆ</span>
          </div>
        )}

        {toxicityModifier.statusTag === 'binh_thuong' && (
          <div className="w-full py-1.5 px-3 rounded-lg border border-stone-800/80 text-stone-300 bg-stone-900/50 flex items-center justify-center gap-1.5 text-xs font-serif tracking-wide">
            <span>Đan Độc: {toxicityModifier.toxicity}% • Dược Tính Hài Hòa</span>
          </div>
        )}

        {toxicityModifier.statusTag === 'tac_nghen' && (
          <div className="w-full py-1.5 px-3 rounded-lg border border-amber-600/50 text-amber-400 bg-amber-950/40 flex items-center justify-center gap-1.5 text-xs font-serif font-bold tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>⚠️ KINH MẠCH TẮC NGHẼN • -20% TỈ LỆ</span>
          </div>
        )}

        {toxicityModifier.statusTag === 'tam_ma_nguy_hiem' && (
          <div className="w-full py-1.5 px-3 rounded-lg border border-rose-600 text-rose-300 bg-rose-950/60 animate-pulse flex items-center justify-center gap-1.5 text-xs font-serif font-bold tracking-wide shadow-[0_0_15px_rgba(225,29,72,0.3)]">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce shrink-0" />
            <span>🔥 TÂM MA RÌNH RẬP • -40% TỈ LỆ • NGUY CƠ TẨU HỎA</span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 6. NÚT BẤM ĐỘT PHÁ CHÍNH (DYNAMIC STYLING & BREAKDOWN FORMULA) */}
      {/* ============================================================ */}
      {isMajorTransition && onMajorBreakthroughClick ? (
        <button
          type="button"
          disabled={isInjured || isBreakingThrough}
          onClick={() => {
            if (isInjured) return;
            onMajorBreakthroughClick();
          }}
          className={`w-full py-3 px-3 rounded-xl font-serif font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xl ${
            isInjured
              ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-950 via-amber-900 to-purple-950 hover:from-purple-900 hover:to-amber-800 text-amber-200 border-2 border-amber-400 ring-2 ring-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-pulse hover:brightness-110 active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isInjured ? (
            <>
              <AlertTriangle className="w-4 h-4 text-stone-500 shrink-0" />
              <span>⚠️ Đang Trọng Thương - Cần Trị Thương Trước</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin shrink-0" />
              <span className="truncate drop-shadow">
                🌌 VƯỢT ĐẠI KIẾP • NGƯNG TỤ ĐẠO CƠ
              </span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={isInjured || !canExecute || isBreakingThrough}
          onClick={() => {
            if (isInjured) return;
            if (setPlayer) {
              handleExecuteBreakthrough(player, setPlayer, onBreakthroughSuccess);
            } else if (onExecuteFallback) {
              onExecuteFallback();
            }
          }}
          className={`w-full py-2.5 px-3 rounded-xl font-serif font-bold text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
            isInjured
              ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-not-allowed'
              : isExecuting || isBreakingThrough
                ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                : !canBreakTuVi || !canBreakLinhThach
                  ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                  : isGuaranteed
                    ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-stone-950 ring-2 ring-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] font-black hover:brightness-110 active:scale-[0.99] animate-pulse cursor-pointer'
                    : 'bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-amber-100 border border-amber-400/50 shadow-[0_0_15px_rgba(217,119,6,0.3)] active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isInjured ? (
            <>
              <AlertTriangle className="w-4 h-4 text-stone-500 shrink-0" />
              <span>⚠️ Đang Trọng Thương - Cần Trị Thương Trước</span>
            </>
          ) : isExecuting || isBreakingThrough ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Đang Xung Kích Gông Cùm Thiên Đạo...</span>
            </>
          ) : !canBreakTuVi ? (
            <span>Cần thêm {(requiredTuVi - player.tuVi).toLocaleString()} Tu Vi</span>
          ) : !canBreakLinhThach ? (
            <span>Cần thêm {(effectiveSpiritStoneCost - player.linhThach).toLocaleString()} Linh Thạch</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
              <span className="truncate">
                {breakdownFormula}
              </span>
            </>
          )}
        </button>
      )}

      {/* ============================================================ */}
      {/* 7. MODALS & DRAWERS PHỤ TRỢ */}
      {/* ============================================================ */}
      <CatalystItemDrawer
        isOpen={activeDrawerSlot !== null}
        slotType={activeDrawerSlot}
        items={activeDrawerSlot === 'pill' ? availablePills : availableTalismans}
        selectedId={activeDrawerSlot === 'pill' ? selectedPillInstanceId : selectedTalismanItemId}
        onSelect={(id) => {
          if (activeDrawerSlot === 'pill') {
            handleSelectPill(id);
          } else {
            handleSelectTalisman(id);
          }
          handleCloseDrawer();
        }}
        onClose={handleCloseDrawer}
      />

      <BreakthroughResultModal
        isOpen={executionResult !== null}
        result={executionResult}
        onClose={handleClearExecutionResult}
      />
    </div>
  );
};
