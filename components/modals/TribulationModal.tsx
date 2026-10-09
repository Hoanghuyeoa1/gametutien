// components/modals/TribulationModal.tsx
// Giao diện Thiên Kiếp Lôi Đài • Minigame Lôi Kiếp Độ Kiếp Tương Tác Thời Gian Thực

import React, { useEffect, useRef } from 'react';
import { PlayerStats } from '@/lib/types';
import {
  TribulationRunState,
  TribulationActionType,
} from '@/lib/types/tribulation';
import { canPerformTribulationAction } from '@/lib/tribulation-logic';

export interface TribulationModalProps {
  isOpen: boolean;
  player: PlayerStats;
  tribulationState: TribulationRunState | null;
  isLightningFlashing: boolean;
  onSelectAction: (action: TribulationActionType) => void;
  onClaimVictory: () => void;
  onCloseDefeat: () => void;
}

export const TribulationModal: React.FC<TribulationModalProps> = ({
  isOpen,
  player,
  tribulationState,
  isLightningFlashing,
  onSelectAction,
  onClaimVictory,
  onCloseDefeat,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối log khi có log mới
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [tribulationState?.logs]);

  if (!isOpen || !tribulationState) return null;

  const { config, currentWaveIndex, currentHp, maxHp, currentMp, maxMp, phase, timerSeconds, logs } =
    tribulationState;
  const currentWave = config.waves[currentWaveIndex - 1] || config.waves[config.waves.length - 1];

  const hpPercent = Math.max(0, Math.min(100, (currentHp / (maxHp || 1)) * 100));
  const mpPercent = Math.max(0, Math.min(100, (currentMp / (maxMp || 1)) * 100));

  // Kiểm tra điều kiện cho 4 quyết sách
  const bodyCheck = canPerformTribulationAction('body_tank', player, currentMp, maxMp);
  const arrayCheck = canPerformTribulationAction('array_shield', player, currentMp, maxMp);
  const talismanCheck = canPerformTribulationAction('talisman_sacrifice', player, currentMp, maxMp);
  const soulCheck = canPerformTribulationAction('soul_focus', player, currentMp, maxMp);

  const isDecisionPhase = phase === 'decision';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden select-none">
      {/* HIỆU ỨNG CHỚP LÓA KHI LÔI ĐÌNH GIÁNG THẾ */}
      {isLightningFlashing && (
        <div className="absolute inset-0 bg-white/70 z-50 pointer-events-none animate-pulse duration-75" />
      )}

      {/* KHUNG THIÊN KIẾP CHÍNH */}
      <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-gradient-to-b from-slate-900 via-indigo-950/90 to-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden">
        {/* NỀN SẤM CHỚP HUYỀN ẢO */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-purple-600 to-transparent" />

        {/* ── 1. HEADER: TÊN ĐẠI KIẾP & TIẾN TRÌNH CÁC ĐỢT ───────── */}
        <div className="relative px-5 py-4 border-b border-amber-500/30 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">⚡</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 uppercase drop-shadow">
                  {config.tribulationName}
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-200">
                  {config.scaleTitle}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Trùng kích thiên môn: <span className="text-amber-300 font-semibold">{config.fromRealmName}</span> ➔{' '}
                <span className="text-emerald-400 font-bold underline">{config.toRealmName}</span>
              </p>
            </div>
          </div>

          {/* ĐỢT LÔI KIẾP */}
          <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-xl border border-amber-500/20">
            <div className="text-right">
              <div className="text-xs text-slate-400">Đợt Lôi Kiếp</div>
              <div className="text-lg font-black text-amber-400">
                {currentWaveIndex} / {config.totalWaves}
              </div>
            </div>
            {/* Thanh chấm chỉ số wave */}
            <div className="flex gap-1.5">
              {Array.from({ length: config.totalWaves }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-5 rounded-sm transition-all duration-300 flex items-center justify-center text-[10px] ${
                    idx + 1 < currentWaveIndex
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : idx + 1 === currentWaveIndex
                      ? 'bg-amber-400 ring-2 ring-amber-300 animate-pulse text-slate-950 font-bold'
                      : 'bg-slate-800 border border-slate-700 text-slate-500'
                  }`}
                >
                  {idx + 1 < currentWaveIndex ? '✓' : idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. THANH KHÍ HUYẾT, CHÂN NGUYÊN & BUFF TÔI THỂ ───────── */}
        <div className="relative px-5 py-3 bg-slate-950/70 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Cột HP */}
          <div>
            <div className="flex justify-between font-semibold mb-1 text-red-300">
              <span>🩸 Khí Huyết Đạo Thể (HP)</span>
              <span>
                {currentHp.toLocaleString()} / {maxHp.toLocaleString()} ({Math.round(hpPercent)}%)
              </span>
            </div>
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-red-900/60 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Cột MP */}
          <div>
            <div className="flex justify-between font-semibold mb-1 text-cyan-300">
              <span>💧 Chân Nguyên Bản Mệnh (MP)</span>
              <span>
                {currentMp.toLocaleString()} / {maxMp.toLocaleString()} ({Math.round(mpPercent)}%)
              </span>
            </div>
            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/60 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-teal-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>

          {/* Buff tích lũy tôi thể */}
          {(tribulationState.permanentDefBonusGained > 0 ||
            tribulationState.permanentDmgReductionBonusGained > 0) && (
            <div className="md:col-span-2 flex items-center gap-2 text-xs bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-300">
              <span>✨ Đạo thể tôi luyện:</span>
              <span className="font-bold text-emerald-400">
                +{tribulationState.permanentDefBonusGained} Phòng Ngự
              </span>
              <span>•</span>
              <span className="font-bold text-cyan-300">
                +{tribulationState.permanentDmgReductionBonusGained.toFixed(1)}% Miễn Thương vĩnh viễn
              </span>
            </div>
          )}
        </div>

        {/* ── 3. KHU VỰC THIÊN UY NGƯNG TỤ & NHỊP ĐẾM 3 PHA ───────── */}
        <div className="relative px-6 py-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900/60 to-purple-950/40 border-b border-slate-800">
          {/* Nhãn loại đợt */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold px-3 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
              Đạo Lôi Đệ {currentWave.waveIndex} Trọng
            </span>
            {currentWave.isMentalDemonWave && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-rose-950/80 border border-rose-500/60 text-rose-300 rounded-full animate-pulse">
                👁️ Kèm Ảo Cảnh Tâm Ma!
              </span>
            )}
          </div>

          {/* Tên đạo lôi */}
          <h3 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-rose-400 drop-shadow-md">
            {currentWave.name}
          </h3>

          <p className="text-xs text-slate-300 max-w-lg mt-1 italic leading-relaxed">
            "{currentWave.description}"
          </p>

          <div className="text-xs text-slate-400 mt-1">
            Uy lực cơ sở: <span className="font-bold text-rose-400">~{currentWave.baseDamage.toLocaleString()} sát thương</span>
          </div>

          {/* ĐẾM NGƯỢC THỜI GIAN THEO PHA */}
          <div className="mt-3">
            {phase === 'gathering' && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-500/40 text-indigo-200 text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                Thiên Uy Đang Ngưng Tụ... ({timerSeconds}s)
              </div>
            )}

            {phase === 'decision' && (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-200 text-sm font-black animate-bounce shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                <span>⏱️</span>
                <span>QUYẾT SÁCH ỨNG BIẾN: CÒN {timerSeconds} GIÂY!</span>
              </div>
            )}

            {phase === 'impact' && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-900/60 border border-rose-500 text-rose-200 text-xs font-black animate-ping">
                ⚡ THIÊN LÔI GIÁNG THẾ!
              </div>
            )}
          </div>
        </div>

        {/* ── 4. 4 QUYẾT SÁCH CHIẾN THUẬT (ACTION CARDS) ───────── */}
        <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-950/80 border-b border-slate-800">
          {/* [1. Nhục Thân Ngạnh Kháng] */}
          <button
            type="button"
            disabled={!isDecisionPhase}
            onClick={() => onSelectAction('body_tank')}
            className={`group relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
              isDecisionPhase
                ? 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30 hover:scale-[1.02] shadow-sm cursor-pointer'
                : 'bg-slate-950/40 border-slate-800 opacity-60 cursor-not-allowed'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl">🥋</span>
                <span className="text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                  Tôi Thể
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mt-1 group-hover:text-amber-300">
                Nhục Thân Ngạnh Kháng
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Dùng thể phách nghênh đón lôi phạt. Giảm thương theo Căn Cốt & Phòng Ngự.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px]">
              <div className="text-rose-400 font-semibold">• Tiêu hao: HP trực tiếp</div>
              <div className="text-emerald-400 font-bold mt-0.5">
                • Thưởng: +5 Thủ, +0.2% Miễn Thương
              </div>
            </div>
          </button>

          {/* [2. Khai Mở Hộ Thân Trận Pháp] */}
          <button
            type="button"
            disabled={!isDecisionPhase || !arrayCheck.ok}
            onClick={() => onSelectAction('array_shield')}
            className={`group relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
              isDecisionPhase && arrayCheck.ok
                ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/30 hover:scale-[1.02] shadow-sm cursor-pointer'
                : 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl">🛡️</span>
                <span className="text-[10px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
                  Triệt Tiêu 60-75%
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mt-1 group-hover:text-cyan-300">
                Hộ Thân Trận Pháp
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Vận chuyển Chân Nguyên kích hoạt Trận Bàn Bản Mệnh tạo kết giới hộ thể.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px]">
              <div className={`${arrayCheck.ok ? 'text-cyan-400' : 'text-rose-400 font-bold'}`}>
                • Tiêu hao: 15% Max MP + 1k Linh Thạch
              </div>
              {!arrayCheck.ok && (
                <div className="text-rose-400 font-semibold mt-0.5">({arrayCheck.reason})</div>
              )}
            </div>
          </button>

          {/* [3. Hiến Tế Tị Lôi Phù / Đan Dược] */}
          <button
            type="button"
            disabled={!isDecisionPhase || !talismanCheck.ok}
            onClick={() => onSelectAction('talisman_sacrifice')}
            className={`group relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
              isDecisionPhase && talismanCheck.ok
                ? 'bg-slate-900/90 border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/30 hover:scale-[1.02] shadow-sm cursor-pointer'
                : 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl">📜</span>
                <span className="text-[10px] font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/40">
                  Miễn Thương 100%
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mt-1 group-hover:text-purple-300">
                Hiến Tế Tị Lôi Phù
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Đốt cháy 1 lá Tị Lôi Phù hoặc Độ Kiếp Đan. Hóa giải sát thương & hồi 10% HP!
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px]">
              <div className={`${talismanCheck.ok ? 'text-purple-300' : 'text-rose-400 font-bold'}`}>
                • Tiêu hao: 1x Tị Lôi Phù / Đan Dược
              </div>
              {!talismanCheck.ok && (
                <div className="text-rose-400 font-semibold mt-0.5">({talismanCheck.reason})</div>
              )}
            </div>
          </button>

          {/* [4. Thần Hồn Định Phách] */}
          <button
            type="button"
            disabled={!isDecisionPhase || !soulCheck.ok}
            onClick={() => onSelectAction('soul_focus')}
            className={`group relative flex flex-col justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
              isDecisionPhase && soulCheck.ok
                ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 hover:scale-[1.02] shadow-sm cursor-pointer'
                : 'bg-slate-950/40 border-slate-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl">👁️</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    currentWave.isMentalDemonWave
                      ? 'text-rose-300 bg-rose-950/80 border-rose-500/60 animate-pulse'
                      : 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                  }`}
                >
                  {currentWave.isMentalDemonWave ? 'Khắc Chế 85%!' : 'Khắc Chế 40%'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-100 mt-1 group-hover:text-emerald-300">
                Thần Hồn Định Phách
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Vận chuyển Thần Niệm củng cố thức hải. Cực kỳ hiệu quả khi chống Tâm Ma Huyễn Lôi!
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 text-[10px]">
              <div className={`${soulCheck.ok ? 'text-emerald-400' : 'text-rose-400 font-bold'}`}>
                • Tiêu hao: 20 Thần Niệm
              </div>
              {!soulCheck.ok && (
                <div className="text-rose-400 font-semibold mt-0.5">({soulCheck.reason})</div>
              )}
            </div>
          </button>
        </div>

        {/* ── 5. BẢNG NHẬT KÝ CHIẾN BÁO LÔI KIẾP ───────── */}
        <div className="flex-1 min-h-[120px] max-h-[160px] p-4 bg-slate-950/95 overflow-y-auto font-mono text-xs text-slate-300 space-y-1.5 border-b border-slate-800" ref={logContainerRef}>
          {logs.map((log, index) => (
            <div
              key={index}
              className={`leading-relaxed ${
                log.includes('THÀNH CÔNG') || log.includes('VẠN ĐẠO QUANG MINH')
                  ? 'text-emerald-300 font-bold'
                  : log.includes('THẤT BẠI') || log.includes('gãy vụn')
                  ? 'text-rose-400 font-bold'
                  : log.includes('QUYẾT SÁCH') || log.includes('⏱️')
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* ── 6. FOOTER OVERLAY: KẾT THÚC THẮNG HOẶC BẠI ───────── */}
        {phase === 'victory' && (
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border-t border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🌟</span>
              <div>
                <h4 className="text-base font-black text-emerald-300">
                  VƯỢT THIÊN KIẾP THÀNH CÔNG!
                </h4>
                <p className="text-xs text-emerald-200/90">
                  Đạo thể thoát thai hoán cốt, chính thức bước vào cảnh giới{' '}
                  <span className="font-bold underline">{config.toRealmName}</span>! HP & MP phục hồi 100%.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClaimVictory}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer whitespace-nowrap"
            >
              Tiếp Nhận Thiên Đạo (Hoàn Tất)
            </button>
          </div>
        )}

        {phase === 'defeat' && (
          <div className="p-4 bg-gradient-to-r from-rose-950 via-red-950 to-slate-950 border-t border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-pulse">💥</span>
              <div>
                <h4 className="text-base font-black text-rose-300">
                  ĐỘ KIẾP THẤT BẠI • TRỌNG THƯƠNG!
                </h4>
                <p className="text-xs text-rose-200/90">
                  Khí huyết rơi về 10%, tổn thất 20% Tu Vi hiện tại, Ma Tính thức hải tăng +15%.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseDefeat}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all cursor-pointer whitespace-nowrap"
            >
              Tĩnh Dưỡng Liệu Thương (Thoát)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
