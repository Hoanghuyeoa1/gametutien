// components/modals/PillTribulationModal.tsx
// Modal Cổ Phong: Đan Lôi Kiếp & Đan Linh Hóa Hình
// (Pill Tribulation & Living Spirits Cinematic Modal)

import React from 'react';
import {
  Zap,
  Shield,
  Heart,
  Sparkles,
  Flame,
  AlertTriangle,
  Award,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  Coins
} from 'lucide-react';
import {
  PillTribulationEncounter,
  TribulationLightningWave,
  FinalizeTribulationResult
} from '@/lib/types/pill-tribulation';
import { PlayerStats } from '@/lib/types';
import { calculateCombatStats } from '@/lib/destiny-data';

export interface PillTribulationModalProps {
  isOpen: boolean;
  encounter: PillTribulationEncounter | null;
  currentWave: TribulationLightningWave | null;
  player: PlayerStats;
  companionInfo: {
    id: string;
    name: string;
    affinity: number;
    isFatigued: boolean;
    remainingFatigueMinutes: number;
  } | null;
  formationCost: number;
  isResolving: boolean;
  finalResult: FinalizeTribulationResult | null;
  roundLogs: string[];
  onChooseDefense: (choice: 'player' | 'companion' | 'formation') => void;
  onClose: () => void;
}

export const PillTribulationModal: React.FC<PillTribulationModalProps> = ({
  isOpen,
  encounter,
  currentWave,
  player,
  companionInfo,
  formationCost,
  isResolving,
  finalResult,
  roundLogs,
  onChooseDefense,
  onClose
}) => {
  if (!isOpen || !encounter) return null;

  const combatStats = calculateCombatStats(player);
  const def = combatStats.def || 100;
  const defReduction = Math.min(0.75, def / (def + 2000));
  const lRes = Math.min(0.75, (combatStats.lightningResistPercent || 0) / 100);

  const rawDmg = currentWave?.rawLightningDamage || 5000;
  const estPlayerDmg = Math.max(1, Math.round(rawDmg * (1 - defReduction) * (1 - lRes)));
  const canAffordFormation = (player.linhThach || 0) >= formationCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Container Chính */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#160a29] via-[#0d0717] to-[#05030a] border border-purple-500/50 shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden">
        
        {/* Nền hiệu ứng lôi vân cuộn trào & chớp giật */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-purple-600 pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 bg-cyan-600 pointer-events-none animate-pulse" />

        {/* 1. HEADER: TÊN THIÊN KIẾP & ĐỢT SẤM SÉT */}
        <div className="relative p-5 border-b border-purple-900/40 text-center space-y-1.5 shrink-0 bg-purple-950/20">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Đan Lôi Kiếp • {encounter.intensity === 'cuu_trong' ? 'Cửu Trọng Hỗn Độn Kiếp' : encounter.intensity === 'luc_trong' ? 'Lục Trọng Huyền Lôi' : 'Tam Trọng Thiên Kiếp'}</span>
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-cyan-200">
            {encounter.pillName}
          </h2>

          {/* Tiến độ đợt sét */}
          {!finalResult && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-xs font-serif text-purple-300">
                Đợt sấm sét: <strong className="text-amber-400 font-mono text-sm">{encounter.currentWave}</strong> / {encounter.totalWaves}
              </span>
              <div className="w-36 h-2 rounded-full bg-purple-950/80 border border-purple-800/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-amber-400 to-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                  style={{ width: `${(encounter.currentWave / encounter.totalWaves) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. BODY CONTENT (Cuộn nếu màn hình nhỏ) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">

          {/* KỊCH BẢN 1: ĐANG TRONG TRẬN LÔI ĐÌNH */}
          {!finalResult && currentWave && (
            <>
              {/* Lò nung & Viên đan đang lơ lửng */}
              <div className="relative py-6 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Vòng xoáy lôi điện xoay tròn */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/50 animate-spin duration-3000" />
                  <div className="absolute -inset-2 rounded-full border border-dashed border-purple-500/40 animate-spin duration-7000" />
                  <div className="absolute inset-0 rounded-full bg-radial from-amber-400/20 via-purple-600/10 to-transparent blur-md animate-pulse" />

                  {/* Viên thần đan phát quang */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.9)] animate-bounce duration-1000">
                    <Sparkles className="w-8 h-8 text-amber-900" />
                  </div>
                </div>

                {/* Tên chiêu sấm sét giáng xuống */}
                <div className="mt-3 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/50 text-xs font-serif font-bold text-purple-200">
                    <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>{currentWave.strikeName}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Sát thương lôi kiếp: <span className="text-amber-400 font-bold">{rawDmg.toLocaleString()}</span> (Xuyên giáp: {currentWave.piercePercent}%)
                  </div>
                </div>
              </div>

              {/* BẢNG 3 PHƯƠNG ÁN HỘ ĐAN CHIẾN THUẬT */}
              <div className="space-y-2.5">
                <div className="text-xs font-serif font-bold text-amber-300 pl-1 uppercase tracking-wide">
                  ⚔️ Lựa Chọn Tuyến Phòng Thủ Hộ Đan
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tuyến 1: Bản Thân Ngạnh Kháng */}
                  <button
                    onClick={() => onChooseDefense('player')}
                    disabled={isResolving}
                    className="p-3.5 rounded-xl bg-gradient-to-b from-purple-950/40 to-[#0e0717] border border-purple-700/50 hover:border-purple-400 hover:bg-purple-900/40 text-left transition cursor-pointer disabled:opacity-50 space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-purple-200 group-hover:text-purple-100">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span>Nhục Thân</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 font-mono">Tôi Thể</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                      Dùng Chân Thân gánh sét. Mất ~<strong className="text-rose-400 font-mono">{estPlayerDmg.toLocaleString()} HP</strong>.
                    </div>
                    <div className="text-[10px] text-emerald-400 font-serif">
                      + Ngộ Tính +1, Tu Vi Tôi Thể
                    </div>
                  </button>

                  {/* Tuyến 2: Đạo Lữ Hộ Pháp */}
                  <button
                    onClick={() => onChooseDefense('companion')}
                    disabled={isResolving || !companionInfo || companionInfo.isFatigued}
                    className="p-3.5 rounded-xl bg-gradient-to-b from-pink-950/40 to-[#0e0717] border border-pink-700/50 hover:border-pink-400 hover:bg-pink-900/40 text-left transition cursor-pointer disabled:opacity-40 space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-pink-200 group-hover:text-pink-100">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span>Đạo Lữ</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-900/80 text-pink-300 font-mono">Giảm 60%</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                      {companionInfo ? (
                        companionInfo.isFatigued ? (
                          <span className="text-amber-400 font-serif">
                            ⏳ {companionInfo.name} đang mệt mỏi ({companionInfo.remainingFatigueMinutes}p).
                          </span>
                        ) : (
                          <span>{companionInfo.name} tế bảo bối đỡ sét, nhận 1h nghỉ dưỡng.</span>
                        )
                      ) : (
                        <span className="text-zinc-500">Chưa chỉ định Đạo Lữ đồng hành.</span>
                      )}
                    </div>
                    <div className="text-[10px] text-pink-300 font-serif">
                      + Hảo Cảm +5 điểm
                    </div>
                  </button>

                  {/* Tuyến 3: Hộ Trận Động Phủ */}
                  <button
                    onClick={() => onChooseDefense('formation')}
                    disabled={isResolving || !canAffordFormation}
                    className="p-3.5 rounded-xl bg-gradient-to-b from-cyan-950/40 to-[#0e0717] border border-cyan-700/50 hover:border-cyan-400 hover:bg-cyan-900/40 text-left transition cursor-pointer disabled:opacity-40 space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-cyan-200 group-hover:text-cyan-100">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <span>Hộ Trận</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 font-mono">Giảm 80%</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                      Tiêu hao <strong className="text-amber-300 font-mono">{formationCost.toLocaleString()}</strong> Linh Thạch kích hoạt linh thuẫn.
                    </div>
                    <div className="text-[10px] text-cyan-300 font-serif">
                      Đang có: <span className="font-mono text-amber-400">{(player.linhThach || 0).toLocaleString()}</span> LT
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* KỊCH BẢN 2: THIÊN KIẾP KẾT THÚC (THÀNH CÔNG / THẤT BẠI / ĐAN LINH) */}
          {finalResult && (
            <div className="py-4 text-center space-y-4">
              {/* THẤT BẠI */}
              {finalResult.isFailed && (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-red-950/60 to-black border border-red-600/50 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-900/40 border border-red-500 flex items-center justify-center text-3xl">
                    💥
                  </div>
                  <h3 className="text-xl font-serif font-black text-red-200">
                    Thiên Kiếp Bạo Liệt • Lò Nung Rạn Nứt
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Sấm sét cửu thiên quá hung hãn, phòng tuyến phòng thủ sụp đổ. Mẻ đan đã biến thành{' '}
                    <strong className="text-red-400 font-serif">Phế Đan Độc Dược</strong> mang 100 điểm Đan Độc chí mạng.
                  </p>
                </div>
              )}

              {/* ĐAN LINH HÓA HÌNH XUẤT THẾ! */}
              {!finalResult.isFailed && finalResult.awakenedSpirit && (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-purple-950/30 to-black border border-amber-400/60 space-y-4 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                  {/* Sprite Vector Chibi Animation */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-radial from-amber-400/40 to-transparent blur-lg animate-pulse" />
                    <div className="text-5xl animate-bounce duration-1000 select-none">
                      🧚
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[11px] font-serif font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Đan Linh Hóa Hình Xuất Thế</span>
                    </div>
                    <h3 className="text-2xl font-serif font-black text-amber-200">
                      {finalResult.awakenedSpirit.name}
                    </h3>
                  </div>

                  {/* Lời thoại Đan Linh Nhi */}
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs font-serif text-purple-200 italic max-w-md mx-auto">
                    &ldquo;Đan Linh Nhi bái kiến Đan Sư đại nhân! Từ nay linh đan thảo dược nơi Động Phủ cứ để muội lo!&rdquo;
                  </div>

                  {/* Các chỉ số Buff của Đan Linh */}
                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-center pt-1">
                    <div className="p-2 rounded-lg bg-black/60 border border-emerald-500/40">
                      <div className="text-[10px] text-zinc-400 font-serif">Dược Viên</div>
                      <div className="text-xs font-mono font-bold text-emerald-300">
                        +{(finalResult.awakenedSpirit.buffs.gardenGrowthSpeedBonus * 100).toFixed(0)}% Tốc Độ
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/60 border border-amber-500/40">
                      <div className="text-[10px] text-zinc-400 font-serif">Đan Văn</div>
                      <div className="text-xs font-mono font-bold text-amber-300">
                        +{finalResult.awakenedSpirit.buffs.veinQualityBonus} Điểm
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/60 border border-cyan-500/40">
                      <div className="text-[10px] text-zinc-400 font-serif">Trừ Nổ Lò</div>
                      <div className="text-xs font-mono font-bold text-cyan-300">
                        -{finalResult.awakenedSpirit.buffs.explosionRiskReduction}% Rủi Ro
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIÊN THIÊN THẦN ĐAN THĂNG HOA (KHÔNG HÓA HÌNH) */}
              {!finalResult.isFailed && !finalResult.awakenedSpirit && finalResult.resultPill && (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 to-black border border-amber-500/50 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(251,191,36,0.7)] animate-pulse">
                    ✨
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest">
                      Thăng Hoa Tiên Thiên Thần Đan
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-amber-200">
                      {finalResult.resultPill.name}
                    </h3>
                  </div>
                  <div className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Đan dược được thiên lôi tẩy luyện triệt để: Dược lực tăng vọt <strong className="text-amber-400">+50%</strong>, Đan độc tiêu tán về <strong className="text-emerald-400">0%</strong>, kích hoạt hào quang vĩnh cửu <span className="text-cyan-300 font-bold">【Tiên Thiên Hộ Thể】</span>!
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. NHẬT KÝ CHIẾN TRƯỜNG THIÊN KIẾP */}
          <div className="p-3 rounded-xl bg-black/60 border border-purple-900/30 space-y-1">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
              📜 Thiên Cơ Ký Sự (Lôi Kiếp Tường Thuật)
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-[11px] font-sans text-zinc-300">
              {roundLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FOOTER: NÚT THU HOẠCH / ĐÓNG */}
        <div className="p-4 border-t border-purple-900/40 flex justify-end shrink-0 bg-purple-950/20">
          {finalResult ? (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:brightness-110 text-stone-950 font-serif font-black text-sm tracking-wide shadow-[0_0_20px_rgba(251,191,36,0.6)] cursor-pointer transition"
            >
              Thu Hoạch Đan Dược
            </button>
          ) : (
            <div className="text-[11px] font-serif text-purple-300 flex items-center gap-1.5 italic">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Thiên kiếp đang khóa chặt đan phòng, kiên trì chống chịu!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
