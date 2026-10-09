import React from 'react';
import { Compass, X, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { RandomEvent, EventOutcome, EventChoice, PlayerStats, CombatStats } from '@/lib/types';
import realmsData from '@/data/realms-data.json';

export interface StoryEncounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: RandomEvent | null;
  eventOutcome: EventOutcome | null;
  isResolvingEvent: boolean;
  player: PlayerStats;
  combatStats: CombatStats;
  combatPower: number;
  onSelectChoice: (choice: EventChoice) => void;
}

export const StoryEncounterModal: React.FC<StoryEncounterModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  eventOutcome,
  isResolvingEvent,
  player,
  combatStats,
  combatPower,
  onSelectChoice
}) => {
  if (!isOpen || !activeEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-2xl w-full p-5 sm:p-7 rounded-2xl border-2 border-amber-600/60 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar relative">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-600/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60">
                  Bí Cảnh Kỳ Duyên
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Cảnh giới: {player.currentRealm}/{realmsData.length - 1}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 mt-0.5">
                {activeEvent.name}
              </h2>
            </div>
          </div>

          {!isResolvingEvent && (
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-rose-300 transition cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900/60"
              title="Đóng / Rút lui"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bối cảnh cổ phong huyền ảo */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#14121a] to-[#09080e] border border-amber-900/40 text-xs sm:text-sm font-serif leading-relaxed text-zinc-200 shadow-inner">
          <p className="first-letter:text-2xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
            {activeEvent.description}
          </p>
        </div>

        {/* KẾT QUẢ CƠ DUYÊN (NẾU ĐÃ LỰA CHỌN XONG) */}
        {eventOutcome ? (
          <div className="space-y-4 animate-fadeIn">
            <div
              className={`p-4 rounded-xl border ${
                (eventOutcome.effects?.khiHuyet && eventOutcome.effects.khiHuyet < 0) ||
                (eventOutcome.effects?.tuVi && eventOutcome.effects.tuVi < 0)
                  ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  : 'bg-amber-950/30 border-amber-700/50 text-amber-200'
              } space-y-2`}
            >
              <div className="flex items-center gap-2 text-sm font-serif font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Kết Quả Quyết Định</span>
              </div>
              <p className="text-xs font-serif leading-relaxed text-zinc-300">
                {eventOutcome.description}
              </p>
              <div className="text-xs font-serif italic text-amber-300/90 pt-1 border-t border-amber-900/30">
                "{eventOutcome.flavor}"
              </div>
            </div>

            {/* Danh sách biến chuyển chỉ số */}
            {eventOutcome.effects && (
              <div className="bg-[#0b0a10] p-3.5 rounded-xl border border-zinc-800 space-y-2 text-xs font-mono">
                <span className="text-[11px] font-serif font-bold text-amber-300 block">
                  Biến chuyển đạo hạnh & thu hoạch:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {eventOutcome.effects.tuVi !== undefined && eventOutcome.effects.tuVi !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        eventOutcome.effects.tuVi > 0
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                      }`}
                    >
                      {eventOutcome.effects.tuVi > 0 ? '+' : ''}
                      {eventOutcome.effects.tuVi.toLocaleString()} Tu Vi
                    </span>
                  )}
                  {eventOutcome.effects.linhThach !== undefined && eventOutcome.effects.linhThach !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        eventOutcome.effects.linhThach > 0
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                      }`}
                    >
                      {eventOutcome.effects.linhThach > 0 ? '+' : ''}
                      {eventOutcome.effects.linhThach.toLocaleString()} Linh Thạch
                    </span>
                  )}
                  {eventOutcome.effects.khiHuyet !== undefined && eventOutcome.effects.khiHuyet !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        eventOutcome.effects.khiHuyet > 0
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                      }`}
                    >
                      {eventOutcome.effects.khiHuyet > 0 ? '+' : ''}
                      {eventOutcome.effects.khiHuyet} Khí Huyết
                    </span>
                  )}
                  {eventOutcome.effects.linhLuc !== undefined && eventOutcome.effects.linhLuc !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        eventOutcome.effects.linhLuc > 0
                          ? 'bg-sky-950/60 text-sky-300 border-sky-800/50'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                      }`}
                    >
                      {eventOutcome.effects.linhLuc > 0 ? '+' : ''}
                      {eventOutcome.effects.linhLuc} Chân Nguyên
                    </span>
                  )}
                  {eventOutcome.effects.tinhHuyet !== undefined && (
                    <span className="px-2 py-0.5 rounded border bg-rose-950/70 text-rose-300 border-rose-600/60 font-bold">
                      +{eventOutcome.effects.tinhHuyet} Tinh Huyết Yêu Thú
                    </span>
                  )}
                  {eventOutcome.effects.ngoTinh !== undefined && (
                    <span className="px-2 py-0.5 rounded border bg-purple-950/60 text-purple-300 border-purple-800/50">
                      +{eventOutcome.effects.ngoTinh} Ngộ Tính
                    </span>
                  )}
                  {eventOutcome.effects.tamCanh !== undefined && (
                    <span className="px-2 py-0.5 rounded border bg-blue-950/60 text-blue-300 border-blue-800/50">
                      +{eventOutcome.effects.tamCanh} Tâm Cảnh
                    </span>
                  )}
                  {eventOutcome.effects.khiVan !== undefined && (
                    <span className="px-2 py-0.5 rounded border bg-yellow-950/60 text-yellow-300 border-yellow-800/50">
                      +{eventOutcome.effects.khiVan} Khí Vận
                    </span>
                  )}
                  {eventOutcome.effects.canCot !== undefined && (
                    <span className="px-2 py-0.5 rounded border bg-teal-950/60 text-teal-300 border-teal-800/50">
                      +{eventOutcome.effects.canCot} Căn Cốt
                    </span>
                  )}
                  {eventOutcome.effects.companionAffinity !== undefined && (
                    <span className="px-2 py-0.5 rounded border bg-pink-950/70 text-pink-300 border-pink-700/60 font-bold">
                      +{eventOutcome.effects.companionAffinity} Hảo Cảm Tiên Tử
                    </span>
                  )}
                  {eventOutcome.effects.specialReward && (
                    <span className="px-2.5 py-0.5 rounded border bg-amber-900/60 text-amber-200 border-amber-500/70 font-bold shadow-sm">
                      🏆 {eventOutcome.effects.specialReward}
                    </span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Thu Thập Phần Thưởng & Tiếp Tục Tu Hành</span>
            </button>
          </div>
        ) : (
          /* DANH SÁCH 2 - 3 PHƯƠNG ÁN LỰA CHỌN (A / B / C) */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-serif text-amber-300/90 font-bold px-1">
              <span>Đạo hữu muốn ứng phó thế nào?</span>
              <span className="text-[10px] text-zinc-400 font-mono font-normal">
                Lựa chọn cẩn trọng, phúc họa tương sinh
              </span>
            </div>

            <div className="space-y-2.5">
              {activeEvent.choices.map((choice, idx) => {
                const reqs = choice.requirements;
                let canChoose = true;
                const missingReasons: string[] = [];

                if (reqs) {
                  if (reqs.ngoTinh && player.ngoTinh < reqs.ngoTinh) {
                    canChoose = false;
                    missingReasons.push(`Ngộ Tính: ${player.ngoTinh}/${reqs.ngoTinh}`);
                  }
                  if (reqs.tamCanh && player.tamCanh < reqs.tamCanh) {
                    canChoose = false;
                    missingReasons.push(`Tâm Cảnh: ${player.tamCanh}/${reqs.tamCanh}`);
                  }
                  if (reqs.khiVan && player.khiVan < reqs.khiVan) {
                    canChoose = false;
                    missingReasons.push(`Khí Vận: ${player.khiVan}/${reqs.khiVan}`);
                  }
                  if (reqs.canCot && player.canCot < reqs.canCot) {
                    canChoose = false;
                    missingReasons.push(`Căn Cốt: ${player.canCot}/${reqs.canCot}`);
                  }
                  if (reqs.linhThach && player.linhThach < reqs.linhThach) {
                    canChoose = false;
                    missingReasons.push(
                      `Linh Thạch: ${player.linhThach.toLocaleString()}/${reqs.linhThach.toLocaleString()} LT`
                    );
                  }
                  if (reqs.hp && (player.khiHuyet ?? 500) < reqs.hp) {
                    canChoose = false;
                    missingReasons.push(`Khí Huyết: ${player.khiHuyet ?? 500}/${reqs.hp} HP`);
                  }
                  if (reqs.mp && (player.linhLuc ?? 200) < reqs.mp) {
                    canChoose = false;
                    missingReasons.push(`Chân Nguyên: ${player.linhLuc ?? 200}/${reqs.mp} MP`);
                  }
                  const curAtk = Math.max(combatStats.atk, combatPower);
                  if (reqs.atk && curAtk < reqs.atk) {
                    canChoose = false;
                    missingReasons.push(`Công Kích: ${curAtk}/${reqs.atk} ATK`);
                  }
                }

                const choiceLetters = ['A', 'B', 'C', 'D'];
                const letter = choiceLetters[idx] || (idx + 1).toString();

                return (
                  <div
                    key={choice.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      canChoose
                        ? 'bg-[#100e17] hover:bg-[#171422] border-amber-900/40 hover:border-amber-500/70 shadow-sm cursor-pointer group'
                        : 'bg-[#0a0a0f] border-zinc-800/80 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (canChoose && !isResolvingEvent) {
                        onSelectChoice(choice);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                            canChoose
                              ? 'bg-amber-950 text-amber-300 border border-amber-700/60 group-hover:bg-amber-800 group-hover:text-white'
                              : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                          }`}
                        >
                          {letter}
                        </span>
                        <div className="space-y-1">
                          <h4
                            className={`text-xs sm:text-sm font-serif font-bold transition ${
                              canChoose ? 'text-zinc-100 group-hover:text-amber-200' : 'text-zinc-500'
                            }`}
                          >
                            {choice.text}
                          </h4>

                          {/* Điều kiện yêu cầu */}
                          {reqs && Object.keys(reqs).length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] font-mono">
                              <span className="text-zinc-500 font-serif">Điều kiện:</span>
                              {reqs.ngoTinh && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    player.ngoTinh >= reqs.ngoTinh
                                      ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Ngộ Tính ≥ {reqs.ngoTinh}
                                </span>
                              )}
                              {reqs.tamCanh && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    player.tamCanh >= reqs.tamCanh
                                      ? 'bg-blue-950/60 text-blue-300 border-blue-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Tâm Cảnh ≥ {reqs.tamCanh}
                                </span>
                              )}
                              {reqs.khiVan && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    player.khiVan >= reqs.khiVan
                                      ? 'bg-yellow-950/60 text-yellow-300 border-yellow-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Khí Vận ≥ {reqs.khiVan}
                                </span>
                              )}
                              {reqs.canCot && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    player.canCot >= reqs.canCot
                                      ? 'bg-teal-950/60 text-teal-300 border-teal-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Căn Cốt ≥ {reqs.canCot}
                                </span>
                              )}
                              {reqs.linhThach && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    player.linhThach >= reqs.linhThach
                                      ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  {reqs.linhThach.toLocaleString()} Linh Thạch
                                </span>
                              )}
                              {reqs.hp && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    (player.khiHuyet ?? 500) >= reqs.hp
                                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Khí Huyết ≥ {reqs.hp} HP
                                </span>
                              )}
                              {reqs.mp && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    (player.linhLuc ?? 200) >= reqs.mp
                                      ? 'bg-sky-950/60 text-sky-300 border-sky-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Chân Nguyên ≥ {reqs.mp} MP
                                </span>
                              )}
                              {reqs.atk && (
                                <span
                                  className={`px-1.5 py-0.2 rounded border ${
                                    Math.max(combatStats.atk, combatPower) >= reqs.atk
                                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                      : 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                  }`}
                                >
                                  Công Kích ≥ {reqs.atk} ATK
                                </span>
                              )}
                            </div>
                          )}

                          {!canChoose && missingReasons.length > 0 && (
                            <p className="text-[10px] text-rose-400 font-mono italic">
                              ⚠️ Chưa đủ điều kiện: {missingReasons.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        disabled={!canChoose || isResolvingEvent}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1 shrink-0 ${
                          canChoose
                            ? 'bg-amber-900/60 group-hover:bg-amber-700 text-amber-200 group-hover:text-white border border-amber-600/50 shadow-sm'
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                        }`}
                      >
                        {isResolvingEvent ? (
                          <div className="w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{canChoose ? 'Quyết Định' : 'Thiếu Chỉ Số'}</span>
                            {canChoose && <ChevronRight className="w-3.5 h-3.5" />}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
