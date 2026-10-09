// components/modals/DualCultivationEventModal.tsx
// MODAL CỔ PHONG XỬ LÝ BIẾN CỐ NGẪU NHIÊN KHI SONG TU ĐẠO LỮ CỬU GIAI

import React from 'react';
import {
  Sparkles,
  Heart,
  Flame,
  Shield,
  Zap,
  Lock,
  Clock,
  AlertTriangle,
  Award,
  Crown,
  Droplets,
  Package
} from 'lucide-react';
import {
  DualCultivationEvent,
  DualEventChoice,
  CompanionWithState,
  PlayerStats
} from '@/lib/types';

export interface DualCultivationEventModalProps {
  isOpen: boolean;
  event: DualCultivationEvent | null;
  partner: CompanionWithState | null;
  player: PlayerStats;
  isResolving?: boolean;
  onSelectChoice: (choiceId: string) => void;
  onClose?: () => void;
}

export const DualCultivationEventModal: React.FC<DualCultivationEventModalProps> = ({
  isOpen,
  event,
  partner,
  player,
  isResolving = false,
  onSelectChoice,
  onClose
}) => {
  if (!isOpen || !event || !partner) return null;

  const currentAffection = Math.max(0, Math.min(100, partner.affinity ?? 0));
  const currentDemonic = Math.max(0, Math.min(100, player.demonicNature ?? 0));

  const isDemonicHazard = event.type === 'demonic_hazard' || event.backgroundEffect === 'crimson_demonic';
  const isHarmony = event.type === 'harmony' || event.backgroundEffect === 'yin_yang_flow';
  const isEpiphany = event.type === 'epiphany' || event.backgroundEffect === 'golden_zen';

  // Helper kiểm tra điều kiện lựa chọn của người chơi
  const checkChoiceCondition = (choice: DualEventChoice): { eligible: boolean; reason?: string } => {
    if (!choice.condition) return { eligible: true };
    const cond = choice.condition;

    if (cond.minAffection !== undefined && currentAffection < cond.minAffection) {
      return { eligible: false, reason: `Cần Hảo Cảm ≥ ${cond.minAffection} (Hiện có: ${currentAffection})` };
    }

    if (cond.minRealmIndex !== undefined && (player.currentRealm || 0) < cond.minRealmIndex) {
      return { eligible: false, reason: `Cần Cảnh Giới Realm Index ≥ ${cond.minRealmIndex}` };
    }

    if (cond.maxDemonicNature !== undefined && currentDemonic > cond.maxDemonicNature) {
      return { eligible: false, reason: `Yêu cầu Ma Tính ≤ ${cond.maxDemonicNature} (Hiện tại: ${currentDemonic})` };
    }

    if (cond.requiredItemCost) {
      const targetId = cond.requiredItemCost.itemId;
      const targetName = cond.requiredItemCost.name.toLowerCase();
      const count = cond.requiredItemCost.count;

      const pills = player.inventory?.pills || [];
      const herbs = player.inventory?.herbs || [];
      const ores = player.inventory?.ores || [];

      let totalFound = 0;
      pills.forEach((p: any) => {
        if (p.id === targetId || (p.name && p.name.toLowerCase().includes(targetName))) {
          totalFound += p.quantity || 1;
        }
      });
      herbs.forEach((h: any) => {
        if (h.id === targetId || (h.name && h.name.toLowerCase().includes(targetName))) {
          totalFound += h.quantity || 1;
        }
      });
      ores.forEach((o: any) => {
        if (o.id === targetId || (o.name && o.name.toLowerCase().includes(targetName))) {
          totalFound += o.quantity || 1;
        }
      });

      if (totalFound < count) {
        return {
          eligible: false,
          reason: `Thiếu [${cond.requiredItemCost.name}] (Cần ${count}, có ${totalFound})`
        };
      }
    }

    return { eligible: true };
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className={`cophong-card cophong-corner max-w-2xl w-full p-5 sm:p-7 rounded-2xl border-2 transition-all duration-500 space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar relative ${
          isDemonicHazard
            ? 'border-rose-600/70 shadow-[0_0_60px_rgba(225,29,72,0.4)] bg-gradient-to-b from-stone-950 via-rose-950/30 to-stone-950'
            : isHarmony
            ? 'border-purple-500/70 shadow-[0_0_60px_rgba(168,85,247,0.35)] bg-gradient-to-b from-stone-950 via-purple-950/30 to-stone-950'
            : 'border-amber-500/70 shadow-[0_0_60px_rgba(245,158,11,0.35)] bg-gradient-to-b from-stone-950 via-amber-950/25 to-stone-950'
        }`}
      >
        {/* Banner Hiệu Ứng Nền Cổ Phong */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl border shadow-lg flex items-center justify-center ${
                isDemonicHazard
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-rose-900/40 animate-pulse'
                  : isHarmony
                  ? 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-purple-900/40'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-amber-900/40'
              }`}
            >
              {isDemonicHazard ? (
                <Flame className="w-7 h-7 text-rose-400" />
              ) : isHarmony ? (
                <Sparkles className="w-7 h-7 text-purple-300 animate-spin" style={{ animationDuration: '8s' }} />
              ) : (
                <Zap className="w-7 h-7 text-amber-300" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    isDemonicHazard
                      ? 'bg-rose-950/80 text-rose-300 border-rose-600/60'
                      : isHarmony
                      ? 'bg-purple-950/80 text-purple-300 border-purple-600/60'
                      : 'bg-amber-950/80 text-amber-300 border-amber-600/60'
                  }`}
                >
                  {isDemonicHazard
                    ? '⚠️ Hiểm Họa Tâm Ma'
                    : isHarmony
                    ? '☯️ Thần Thông Hiển Thánh'
                    : '✨ Cơ Duyên Đốn Ngộ'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Song Tu Cửu Giai</span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300">
                {event.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Thông Tin Đạo Lữ Cửu Giai & Hai Thanh Đo Chỉ Số */}
        <div className="bg-stone-900/80 border border-zinc-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${partner.avatarGradient || 'from-amber-600 to-rose-950'} border border-amber-500/40 shadow`}>
                {partner.avatar || '🌸'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm sm:text-base text-zinc-100">{partner.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-yellow-400" /> Cửu Giai
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 italic font-serif">{partner.title}</div>
              </div>
            </div>

            {partner.fatigueUntil && partner.fatigueUntil > Date.now() ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 border border-stone-600 text-stone-300 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Đang Tĩnh Dưỡng</span>
              </div>
            ) : null}
          </div>

          {/* Ma trận Chỉ số Hảo Cảm vs Ma Tính */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Thanh Hảo Cảm */}
            <div className="bg-stone-950/60 p-2.5 rounded-lg border border-rose-900/30">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-rose-300 font-medium flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" /> Hảo Cảm (Affection)
                </span>
                <span className="font-mono font-bold text-rose-200">{currentAffection} / 100</span>
              </div>
              <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-rose-950">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-500 rounded-full"
                  style={{ width: `${currentAffection}%` }}
                />
              </div>
            </div>

            {/* Thanh Ma Tính */}
            <div className="bg-stone-950/60 p-2.5 rounded-lg border border-purple-900/30">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-purple-300 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-purple-400 fill-purple-400/30" /> Ma Tính (Demonic Nature)
                </span>
                <span className="font-mono font-bold text-purple-200">{currentDemonic} / 100</span>
              </div>
              <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-purple-950">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-rose-600 to-red-500 transition-all duration-500 rounded-full"
                  style={{ width: `${currentDemonic}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Đoạn Văn Tự Sự Tiên Hiệp (Narrative Lore) */}
        <div className="relative bg-gradient-to-b from-stone-950 to-stone-900/90 border border-amber-900/30 p-4 sm:p-5 rounded-xl text-zinc-300 leading-relaxed font-serif text-sm sm:text-base italic shadow-inner">
          <div className="absolute top-2 left-2 text-amber-500/20 text-3xl font-serif select-none">“</div>
          <div className="relative z-10 pl-2 pr-2 text-justify text-zinc-200">{event.narrative}</div>
          <div className="absolute bottom-1 right-3 text-amber-500/20 text-3xl font-serif select-none">”</div>
        </div>

        {/* Danh Sách Lựa Chọn Tương Tác */}
        <div className="space-y-3">
          <div className="text-xs uppercase font-mono tracking-wider text-amber-400/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Quyết Định Song Tu Của Đạo Hữu:
          </div>

          <div className="space-y-2.5">
            {event.choices.map((choice, index) => {
              const condCheck = checkChoiceCondition(choice);
              const isEligible = condCheck.eligible && !isResolving;

              return (
                <button
                  key={choice.id}
                  disabled={!isEligible}
                  onClick={() => onSelectChoice(choice.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-300 relative group flex flex-col justify-between ${
                    isEligible
                      ? 'bg-gradient-to-r from-stone-900/90 via-stone-850 to-stone-900 hover:from-amber-950/40 hover:to-stone-900 border-zinc-700/60 hover:border-amber-500/80 hover:shadow-lg cursor-pointer'
                      : 'bg-stone-950/50 border-stone-800 text-zinc-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-amber-400/90">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className={`font-serif font-bold text-sm sm:text-base ${isEligible ? 'text-zinc-100 group-hover:text-amber-300' : 'text-zinc-500'}`}>
                          {choice.text}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-serif leading-normal pl-4">
                        {choice.description}
                      </p>
                    </div>

                    {!isEligible && (
                      <span className="text-[11px] font-mono text-rose-400 bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <Lock className="w-3 h-3 text-rose-400" />
                        {condCheck.reason}
                      </span>
                    )}
                  </div>

                  {/* Nhãn Tiên Đoán Kết Quả (Outcome Preview) */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5 pl-4 pt-1.5 border-t border-zinc-800/50">
                    {choice.outcome.tuviGain !== undefined && choice.outcome.tuviGain !== 0 && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          choice.outcome.tuviGain > 0
                            ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                            : 'bg-rose-950/60 text-rose-300 border-rose-700/50'
                        }`}
                      >
                        {choice.outcome.tuviGain > 0
                          ? `+${choice.outcome.tuviGain.toLocaleString()} Tu Vi`
                          : `${choice.outcome.tuviGain.toLocaleString()} Tu Vi`}
                      </span>
                    )}

                    {choice.outcome.demonicDelta !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          choice.outcome.demonicDelta < 0
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                            : 'bg-purple-950/60 text-purple-300 border-purple-700/50'
                        }`}
                      >
                        {choice.outcome.demonicDelta < 0
                          ? `${choice.outcome.demonicDelta} Ma Tính`
                          : `+${choice.outcome.demonicDelta} Ma Tính`}
                      </span>
                    )}

                    {choice.outcome.affectionDelta !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          choice.outcome.affectionDelta > 0
                            ? 'bg-rose-950/60 text-rose-300 border-rose-700/50'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {choice.outcome.affectionDelta > 0
                          ? `+${choice.outcome.affectionDelta} Hảo Cảm`
                          : `${choice.outcome.affectionDelta} Hảo Cảm`}
                      </span>
                    )}

                    {choice.outcome.partnerFatigue ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-stone-900 text-amber-300 border-amber-700/50 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Tĩnh Dưỡng 2 Giờ
                      </span>
                    ) : null}

                    {choice.outcome.appliedBuffId ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-yellow-950/60 text-yellow-300 border-yellow-600/50 flex items-center gap-1">
                        <Award className="w-2.5 h-2.5" /> Hào Quang Hộ Thể (24h)
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chân Trang Cảnh Báo Chống Trục Lợi */}
        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span className="flex items-center gap-1 text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            Bế quan tạm dừng • Chọn phương án để tiếp tục
          </span>
          <span className="text-zinc-600">GAMETUTIEN Anti-Scum Invariant</span>
        </div>
      </div>
    </div>
  );
};
