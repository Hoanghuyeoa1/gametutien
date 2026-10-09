// components/tabs/OffspringSanctuaryView.tsx
// Giao diện Phân Hệ Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch
// Clean UI cổ phong, 100% Procedural SVG, không phụ thuộc tài nguyên ảnh ngoài

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Swords,
  Clock,
  Award,
  AlertTriangle,
  Baby,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Skull,
  UserCheck,
  GraduationCap,
  Building,
  Compass,
  Gift,
  LogOut,
} from 'lucide-react';
import type { PlayerStats } from '@/lib/types';
import type {
  DualCultivationMethod,
  ImmortalChild,
  GestationState,
  OffspringState
} from '@/lib/types/offspring';
import { COMPANIONS_DATA, COMPANIONS_MAP } from '@/lib/companions-data';
import {
  calculateGestationProgress,
  isDemonicCompanion,
  calculateChildCombatContribution
} from '@/lib/offspring-logic';
import {
  GESTATION_PILLS,
  CONCEPTION_REQUIRED_REALM,
  CONCEPTION_REQUIRED_AFFINITY,
  CONCEPTION_COST_LINH_THACH,
  STAGE_CONFIGS
} from '@/lib/offspring-data';
import { useOffspringActions } from '@/hooks/useOffspringActions';
import type { useDiscipleAppointmentActions } from '@/hooks/useDiscipleAppointmentActions';
import { DiscipleGraduationModal } from '@/components/modals/DiscipleGraduationModal';

interface OffspringSanctuaryViewProps {
  player: PlayerStats;
  offspringActions: ReturnType<typeof useOffspringActions>;
  appointmentActions?: ReturnType<typeof useDiscipleAppointmentActions>;
  currentTimestamp?: number;
}

export const OffspringSanctuaryView: React.FC<OffspringSanctuaryViewProps> = ({
  player,
  offspringActions,
  appointmentActions,
  currentTimestamp
}) => {
  const {
    offspringState,
    namingModalChild,
    setNamingModalChild,
    customChildName,
    setCustomChildName,
    handlePerformDualCultivation,
    handleInitiateGestation,
    handleNurtureGestation,
    handleBirthChild,
    handleDeployChild,
    handleTransferTuViToChild,
    handleNurtureChildRealm,
  } = offspringActions;

  const [graduationModalChild, setGraduationModalChild] = useState<ImmortalChild | null>(null);

  // Thời gian đếm ngược thực
  const [localNow, setLocalNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setLocalNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const now = currentTimestamp || localNow;

  // Lựa chọn đạo lữ đồng tu hiện tại
  const bondedCompanions = COMPANIONS_DATA.filter(comp => {
    const compState = player.companionsState?.companions?.[comp.id];
    return compState?.isBonded || (compState?.affinity || 0) >= 60;
  });

  const [selectedCompanionId, setSelectedCompanionId] = useState<string>(
    player.companionsState?.activeCompanionId || (bondedCompanions[0]?.id ?? COMPANIONS_DATA[0].id)
  );

  const activeCompanion = COMPANIONS_MAP[selectedCompanionId] || COMPANIONS_DATA[0];
  const activeCompPlayerState = player.companionsState?.companions?.[selectedCompanionId];
  const affinity = activeCompPlayerState?.affinity || 0;

  // Cooldown Song Tu: 4 giờ
  const SONG_TU_COOLDOWN_MS = 4 * 60 * 60 * 1000;
  const lastSongTu = activeCompPlayerState?.lastSongTuTime || offspringState.lastSongTuTimestamp || 0;
  const songTuRemainingMs = Math.max(0, SONG_TU_COOLDOWN_MS - (now - lastSongTu));
  const isSongTuReady = songTuRemainingMs <= 0;

  const formatSongTuCountdown = (ms: number) => {
    if (ms <= 0) return 'Sẵn Sàng';
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Tính tiến trình hoài thai
  const gestationProgress = calculateGestationProgress(offspringState.gestation, now);
  const gestation = offspringState.gestation;

  // Thông tin Đạo Lữ đủ điều kiện hoài thai
  const eligibleMothers = COMPANIONS_DATA.filter(comp => {
    const st = player.companionsState?.companions?.[comp.id];
    return (
      (st?.affinity || 0) >= CONCEPTION_REQUIRED_AFFINITY &&
      player.currentRealm >= CONCEPTION_REQUIRED_REALM &&
      comp.realmIndex >= CONCEPTION_REQUIRED_REALM
    );
  });

  const demonicKarma = offspringState.demonicKarma || 0;
  const isDemonicRisk = demonicKarma >= 80;

  // Tiên đồng đang xuất chiến
  const deployedChild = offspringState.deployedChildId
    ? offspringState.children?.find(c => c.id === offspringState.deployedChildId)
    : null;

  return (
    <div className="space-y-6">
      {/* ── Banner Giới Thiệu Phân Hệ ── */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 via-rose-950/40 to-purple-950/50 border border-amber-600/40 space-y-2 relative overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.12)]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-500/30 animate-pulse" />
            <h2 className="text-sm font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 uppercase tracking-widest">
              Song Tu Hóa Duyên • Tiên Đồng Huyết Mạch
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {deployedChild && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-purple-950/80 text-purple-300 border-purple-500/50 font-bold flex items-center gap-1">
                <Swords className="w-3 h-3 text-purple-400" />
                Tứ Trận Quy Nhất: {deployedChild.name}
              </span>
            )}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold flex items-center gap-1 ${
                isDemonicRisk
                  ? 'bg-red-950/90 text-red-300 border-red-500/80 animate-pulse'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60'
              }`}
            >
              <Skull className="w-3 h-3 text-red-400" />
              Ma Tính: {demonicKarma}/100
            </span>
          </div>
        </div>
        <p className="text-[11px] text-zinc-300 font-serif leading-relaxed">
          Khai phóng hai đại pháp môn Song Tu: <strong>Chính Đạo Tương Sinh</strong> nuôi dưỡng căn cơ tiên thiên hoặc <strong>Thái Bổ Lô Đỉnh</strong> đoạt thiên địa tạo hóa; bồi bổ ngưng tụ Linh Thai thần cấp, thừa hưởng huyết mạch dị biến và cùng Đạo Tử xuất sư trợ chiến Tứ Trận Quy Nhất!
        </p>

        {/* Thanh Đo Ma Tính Người Chơi */}
        <div className="pt-2 border-t border-amber-900/30">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
            <span>Tâm Thần Quỹ Đạo</span>
            <span>{isDemonicRisk ? '⚠️ MA KIẾP TRỪNG PHẠT ÁP SÁT' : demonicKarma > 30 ? 'Khí Tức Ma Đạo Khởi Phát' : 'Chính Đạo Thuần Khiết'}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isDemonicRisk
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400 animate-pulse'
                  : 'bg-gradient-to-r from-purple-800 to-rose-600'
              }`}
              style={{ width: `${Math.min(100, demonicKarma)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── KHU VỰC 1: ĐỘNG PHỦ SONG TU ── */}
      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-serif font-bold text-cyan-200 uppercase tracking-wider">
              Khu Vực 1 • Động Phủ Song Tu
            </h3>
          </div>

          {/* Chọn Đạo Lữ đồng tu */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-zinc-400 font-serif">Đạo Lữ Đồng Tu:</label>
            <select
              value={selectedCompanionId}
              onChange={e => setSelectedCompanionId(e.target.value)}
              className="text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-cyan-500 font-serif"
            >
              {COMPANIONS_DATA.map(comp => {
                const st = player.companionsState?.companions?.[comp.id];
                return (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.title}) - Hảo Cảm: {st?.affinity || 0}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Thông tin Đạo Lữ được chọn */}
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-900/40 to-purple-900/40 border border-rose-500/40 flex items-center justify-center text-2xl shadow-inner">
              {activeCompanion.avatar || '🌸'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-serif font-bold text-zinc-100">{activeCompanion.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-600/50 text-rose-300">
                  {activeCompanion.title}
                </span>
                {isDemonicCompanion(activeCompanion) && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-300 font-bold">
                    Ma Môn Nữ Tử
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-serif mt-0.5">
                Cảnh giới: {activeCompanion.initialRealm} (Bậc {activeCompanion.realmIndex}) • Hảo cảm: <strong className="text-rose-400">{affinity}/100</strong>
              </p>
            </div>
          </div>

          {/* Đồng hồ Cooldown */}
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 font-mono block">Thời Khắc Tĩnh Dưỡng</span>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded border inline-block mt-0.5 ${
                isSongTuReady
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700'
              }`}
            >
              {formatSongTuCountdown(songTuRemainingMs)}
            </span>
          </div>
        </div>

        {/* Hai Nút Lựa Chọn Song Tu Lớn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Lựa chọn 1: Chính Đạo Âm Dương */}
          <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-zinc-950/80 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-900/60 border border-cyan-500/50 flex items-center justify-center text-cyan-200">
                    ☯️
                  </div>
                  <h4 className="text-xs font-serif font-bold text-cyan-200 uppercase tracking-wide">
                    Chính Đạo Âm Dương (Tương Sinh)
                  </h4>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-600/50 text-cyan-300">
                  Hảo Cảm ≥ 60
                </span>
              </div>
              <p className="text-[10px] text-zinc-300 font-serif leading-relaxed">
                Âm Dương giao hòa tương sinh, chính khí đan điền bừng sáng. Hai bên cùng nhận lượng lớn Tu Vi, củng cố đạo tâm.
              </p>
              <ul className="text-[10px] text-cyan-300/90 font-mono space-y-1 list-disc list-inside">
                <li>Nhận lớn Tu Vi (+15% hiệu suất tu luyện 4 giờ)</li>
                <li>Tâm Cảnh +5, giảm 50% nguy cơ gặp Tâm Ma</li>
                <li>Hảo Cảm Đạo Lữ +2, không tăng Ma Tính</li>
                <li>Tỷ lệ 10% ngưng tụ Linh Thai nếu đạt 100 Hảo Cảm & Nguyên Anh</li>
              </ul>
            </div>

            <button
              onClick={() => handlePerformDualCultivation(selectedCompanionId, 'chinh_dao')}
              disabled={!isSongTuReady || affinity < 60}
              className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                !isSongTuReady || affinity < 60
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-900 to-blue-900 hover:brightness-125 text-cyan-100 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
              }`}
            >
              <span>☯️ Khởi Động Chính Đạo Song Tu</span>
            </button>
          </div>

          {/* Lựa chọn 2: Thái Bổ Tà Pháp */}
          <div className="p-4 rounded-xl border border-rose-600/50 bg-gradient-to-br from-rose-950/50 via-purple-950/40 to-black space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(225,29,72,0.15)] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-200">
                    🩸
                  </div>
                  <h4 className="text-xs font-serif font-bold text-rose-200 uppercase tracking-wide">
                    Thái Bổ Tà Pháp (Lô Đỉnh Nghịch Mệnh)
                  </h4>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-600/60 text-red-300">
                  Ma Tính ≥ 20 hoặc Ma Môn
                </span>
              </div>
              <p className="text-[10px] text-zinc-300 font-serif leading-relaxed">
                Nghịch chuyển càn khôn cưỡng chế rút tỉa chân nguyên của Đạo Lữ biến thành chiến lực cuồng bạo của bản thân.
              </p>
              <ul className="text-[10px] text-rose-300/90 font-mono space-y-1 list-disc list-inside">
                <li>Tăng vọt gấp đôi Tu Vi, nhận +20% Công Kích & +15% Bạo Kích 8 giờ</li>
                <li className="text-red-400 font-bold">Trừ 10 Hảo Cảm Đạo Lữ (nguy cơ bỏ đi nếu &lt; 20)</li>
                <li className="text-red-400 font-bold">Tăng mạnh +15 Ma Tính (≥80 kích hoạt Ma Kiếp Trừng Phạt)</li>
                <li>Không thể ngưng tụ Linh Thai thần thánh</li>
              </ul>
            </div>

            <button
              onClick={() => handlePerformDualCultivation(selectedCompanionId, 'thai_bo')}
              disabled={!isSongTuReady || (demonicKarma < 20 && !isDemonicCompanion(activeCompanion))}
              className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                !isSongTuReady || (demonicKarma < 20 && !isDemonicCompanion(activeCompanion))
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-950 to-rose-900 hover:brightness-125 text-rose-100 border border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.3)]'
              }`}
            >
              <span>🩸 Cưỡng Chế Thái Bổ Tà Pháp</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KHU VỰC 2: LINH THAI DƯỠNG DỤC ĐÌNH ── */}
      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-serif font-bold text-amber-200 uppercase tracking-wider">
              Khu Vực 2 • Linh Thai Dưỡng Dục Đình
            </h3>
          </div>
          {gestation?.isGestationActive && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-amber-950/80 text-amber-300 border-amber-500/50 font-bold animate-pulse">
              Đang Thai Nghén ({gestationProgress.progressPercent}%)
            </span>
          )}
        </div>

        {/* Nội dung khi ĐANG HOÀI THAI */}
        {gestation?.isGestationActive ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-zinc-950 border border-amber-500/40 flex items-center justify-between flex-wrap gap-4">
              {/* Procedural SVG Quả Trứng Linh Thai */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-20 flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse" viewBox="0 0 100 120">
                    <defs>
                      <linearGradient id="eggGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#7c2d12" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <ellipse cx="50" cy="65" rx="38" ry="48" fill="url(#eggGrad)" filter="url(#glow)" />
                    {/* Họa tiết vân mây linh quang */}
                    <path d="M 30 55 Q 50 35 70 55 Q 50 75 30 55" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
                    <circle cx="50" cy="65" r="10" fill="#ffffff" opacity="0.4" className="animate-ping" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-bold text-amber-200">
                    Linh Thai Tiên Thiên
                  </h4>
                  <p className="text-[11px] text-zinc-300 font-serif">
                    Mẫu thân: <strong className="text-rose-300">{gestation.motherName}</strong>
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                    <span>Phẩm cấp bồi đắp:</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < (gestation.nurturingLevel || 1) ? 'text-amber-300' : 'text-zinc-600'}>
                        ★
                      </span>
                    ))}
                    <span className="text-zinc-400">({gestation.nurturingLevel || 1}/5)</span>
                  </div>
                </div>
              </div>

              {/* Tiến độ và Đồng hồ */}
              <div className="text-right space-y-1 min-w-[160px]">
                <span className="text-[10px] text-zinc-400 font-mono block">Thời Gian Sinh Hạ</span>
                <span className="text-sm font-mono font-bold text-amber-300 block">
                  {gestationProgress.formattedRemaining}
                </span>
                <div className="w-full h-2 bg-zinc-900 rounded-full border border-zinc-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500 rounded-full"
                    style={{ width: `${gestationProgress.progressPercent}%` }}
                  />
                </div>
                <span className="text-[9px] text-zinc-400 font-mono block">
                  Hoàn thành: {gestationProgress.progressPercent}%
                </span>
              </div>
            </div>

            {/* Danh mục Đan Dược Bồi Bổ */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-serif font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                <span>🧪 Ban Đan Dưỡng Thai (Bồi Đắp Căn Cốt)</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {Object.values(GESTATION_PILLS)
                  .filter(p => p.id !== 'pill_linh_thai_tao_hoa')
                  .map(pill => {
                    const canAfford = player.linhThach >= pill.price;
                    return (
                      <div
                        key={pill.id}
                        className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-serif font-bold text-zinc-200">
                            <span>{pill.name}</span>
                            <span className="text-amber-400 font-mono text-[10px]">
                              {pill.price.toLocaleString()} LT
                            </span>
                          </div>
                          <p className="text-[9px] text-zinc-400 font-serif leading-tight mt-1">
                            {pill.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNurtureGestation(pill.id)}
                          disabled={!canAfford}
                          className={`w-full py-1 rounded text-[10px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                            canAfford
                              ? 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/50'
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                          }`}
                        >
                          <span>Ban Đan ({pill.price.toLocaleString()} LT)</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Nút Khai Thai Điểm Hóa khi đầy 100% */}
            {gestationProgress.readyToBirth && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setNamingModalChild(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-serif font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse hover:brightness-110 transition cursor-pointer border border-yellow-200"
                >
                  👶 KHAI THAI ĐIỂM HÓA TIÊN ĐỒNG (PHÁ NOÃN CHÀO ĐỜI)
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Nội dung khi CHƯA HOÀI THAI */
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-950/40 border border-amber-600/30 flex items-center justify-center mx-auto text-2xl">
              🥚
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-xs font-serif font-bold text-zinc-200">
                Linh Thai Chưa Ngưng Tụ
              </h4>
              <p className="text-[10px] text-zinc-400 font-serif leading-relaxed">
                Yêu cầu: Kết Duyên với Đạo Lữ đạt <strong>100 Hảo Cảm (Sinh Tử Bất Ly)</strong>, cả hai cùng đạt từ <strong>Nguyên Anh Kỳ trở lên (Cảnh giới 21+)</strong> và tiêu hao 50,000 Linh Thạch.
              </p>
            </div>

            {eligibleMothers.length > 0 ? (
              <div className="pt-2 flex flex-col items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-serif font-bold">
                  ✨ Đủ điều kiện khởi động Nghi Thức Tạo Hóa cùng:
                </span>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {eligibleMothers.map(mother => (
                    <button
                      key={mother.id}
                      onClick={() => handleInitiateGestation(mother.id)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-900 to-rose-900 hover:brightness-125 text-amber-200 border border-amber-600/60 text-[10px] font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Cùng {mother.name} Hoài Thai (50,000 LT)</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-1">
                <span className="text-[10px] text-zinc-500 font-serif italic">
                  Chưa có Đạo Lữ nào đạt đủ 100 Hảo Cảm và Nguyên Anh Kỳ để cử hành Nghi Thức.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── KHU VỰC 3: PHẢ HỆ TIÊN ĐỒNG & TỨ TRẬN QUY NHẤT ── */}
      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-serif font-bold text-purple-200 uppercase tracking-wider">
              Khu Vực 3 • Phả Hệ Tiên Đồng ({offspringState.children?.length || 0})
            </h3>
          </div>
          {deployedChild && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-purple-950/90 text-purple-300 border-purple-500/60 font-bold">
              ⚔️ Đang Trợ Chiến: {deployedChild.name} ({deployedChild.innateTalent.name})
            </span>
          )}
        </div>

        {/* Danh Sách Tiên Đồng */}
        {offspringState.children && offspringState.children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offspringState.children.map(child => {
              const stageConf = STAGE_CONFIGS[child.stage];
              const isDeployed = child.id === offspringState.deployedChildId;
              const isAdult = child.stage === 'adult';
              const canTransfer = child.stage !== 'adult' && player.tuVi >= 50000;

              return (
                <div
                  key={child.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 relative overflow-hidden flex flex-col justify-between ${
                    isDeployed
                      ? 'border-purple-500/70 bg-gradient-to-br from-purple-950/50 via-zinc-950 to-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                      : 'border-zinc-800 bg-zinc-900/60'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Header Thẻ Bài */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-900/40 to-amber-900/40 border border-purple-500/40 flex items-center justify-center text-xl shadow-inner">
                          {child.gender === 'nam' ? '👦' : '👧'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-serif font-bold text-zinc-100">{child.name}</h4>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                              {child.gender === 'nam' ? 'Nam' : 'Nữ'} • {child.ageYears || 0} Tuổi
                            </span>
                          </div>
                          <p className="text-[9px] text-zinc-400 font-serif">
                            Mẫu thân: <strong className="text-rose-300">{child.motherName}</strong> • Cảnh giới: <strong className="text-amber-300">{child.realmName}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Giai đoạn badge / Xuất sư badge */}
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                            isAdult
                              ? 'bg-purple-950 text-purple-300 border-purple-500'
                              : child.stage === 'child'
                              ? 'bg-blue-950 text-blue-300 border-blue-500'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          }`}
                        >
                          {stageConf.name}
                        </span>

                        {child.appointmentData?.isGraduated && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold shadow-sm ${
                              child.appointmentData.assignedRole === 'tinh_hai_guardian'
                                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500 shadow-indigo-500/30'
                                : child.appointmentData.assignedRole === 'sect_treasury_deacon'
                                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-amber-500/30'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                            }`}
                          >
                            {child.appointmentData.assignedRole === 'tinh_hai_guardian'
                              ? '🌌 Trấn Thủ Tinh Hải'
                              : child.appointmentData.assignedRole === 'sect_treasury_deacon'
                              ? '🏛️ Chấp Sự Khố Phòng'
                              : '🎓 Đã Xuất Sư (Tự Do)'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Linh Căn & Thiên Phú */}
                    <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400 font-serif">Linh Căn:</span>
                        <span
                          className={`font-mono font-bold ${
                            child.spiritualRoots.grade === 'than'
                              ? 'text-yellow-300 animate-pulse'
                              : child.spiritualRoots.grade === 'cuc'
                              ? 'text-purple-300'
                              : 'text-cyan-300'
                          }`}
                        >
                          {child.spiritualRoots.elementName} ({child.spiritualRoots.grade.toUpperCase()})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400 font-serif">Thiên Phú Thần Thông:</span>
                        <span className="text-amber-300 font-mono font-bold">
                          {child.innateTalent.name}
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-400 font-serif italic leading-tight">
                        "{child.innateTalent.description}"
                      </p>

                      {/* Hiển thị bonus nếu đã xuất sư */}
                      {child.appointmentData?.isGraduated && (
                        <div className="pt-1 border-t border-zinc-800/60 grid grid-cols-2 gap-1 text-[9px] text-zinc-300">
                          <span className="text-indigo-300">
                            🌌 Tinh Hải: +{Math.round((child.appointmentData.specialtyBonus.starHarvestMultiplier || 0) * 100)}%
                          </span>
                          <span className="text-amber-300">
                            🏛️ Khố Phòng: +{Math.round((child.appointmentData.specialtyBonus.treasuryEfficiency || 0) * 100)}%
                          </span>
                        </div>
                      )}

                      <div className="text-[9px] text-zinc-400 font-mono pt-1 border-t border-zinc-800 flex items-center justify-between">
                        <span>Chiến Lực: <strong className="text-amber-300">{child.combatPower.toLocaleString()}</strong></span>
                        <span>Buff Động Phủ: +{stageConf.abodeBuffs.herbSpeedBonusPercent}% Thảo / +{stageConf.abodeBuffs.abodeReikiBonus} Khí</span>
                      </div>
                    </div>

                    {/* Thanh Tiến Độ Trưởng Thành nếu chưa là Adult */}
                    {!isAdult && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                          <span>Tiến Độ Đột Phá Giai Đoạn</span>
                          <span>{child.growthProgress || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${child.growthProgress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nút Tương Tác / Xuất Sư / Xuất Chiến */}
                  <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-1.5">
                    {!isAdult ? (
                      <button
                        onClick={() => handleTransferTuViToChild(child.id)}
                        disabled={!canTransfer}
                        className={`w-full py-1.5 rounded-lg text-[10px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          canTransfer
                            ? 'bg-gradient-to-r from-blue-950 to-purple-950 hover:brightness-125 text-blue-200 border border-blue-600/50 shadow'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span>Truyền Thụ Tiên Pháp (50,000 Tu Vi)</span>
                      </button>
                    ) : (
                      <>
                        {/* 1. Nếu chưa xuất sư */}
                        {!child.appointmentData?.isGraduated && (
                          <div className="flex gap-1.5">
                            {/* Nút Đại Lễ Xuất Sư nếu >= Hóa Thần */}
                            {((child.realmIndex || 0) >= 26 || child.realmName.includes('Hóa Thần')) ? (
                              <button
                                onClick={() => setGraduationModalChild(child)}
                                className="w-full py-2 rounded-lg text-xs font-serif font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 hover:brightness-110 shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                              >
                                <GraduationCap className="w-4 h-4 text-stone-950" />
                                <span>🎓 Cử Hành Đại Lễ Xuất Sư</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleNurtureChildRealm(child.id)}
                                className="flex-1 py-1.5 rounded-lg text-[10px] font-serif font-bold bg-gradient-to-r from-indigo-950 to-purple-950 hover:brightness-125 text-indigo-200 border border-indigo-600/50 transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Zap className="w-3 h-3 text-indigo-400" />
                                <span>⚡ Bồi Dưỡng Lên Hóa Thần</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* 2. Nếu đã xuất sư và đang nhận nhiệm vụ */}
                        {child.appointmentData?.isGraduated && child.appointmentData.assignedRole !== 'none' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => appointmentActions?.handleRecallRole(child.id)}
                              className="flex-1 py-1.5 rounded-lg text-[10px] font-serif font-bold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-700/60 transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <LogOut className="w-3 h-3 text-rose-400" />
                              <span>Bãi Nhiệm / Triệu Hồi</span>
                            </button>
                            <button
                              onClick={() => appointmentActions?.handleRewardDisciple(child.id, 10000)}
                              className="py-1.5 px-3 rounded-lg text-[10px] font-serif font-bold bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60 transition flex items-center justify-center gap-1 cursor-pointer"
                              title="Ban thưởng 10,000 Linh Thạch tăng trung thành"
                            >
                              <Gift className="w-3 h-3 text-amber-400" />
                              <span>Thưởng</span>
                            </button>
                          </div>
                        )}

                        {/* 3. Nút Xuất Chiến thông thường (nếu không đang bổ nhiệm Tinh Hải / Khố Phòng) */}
                        {(!child.appointmentData?.assignedRole || child.appointmentData.assignedRole === 'none') && (
                          isDeployed ? (
                            <button
                              onClick={() => handleDeployChild(null)}
                              className="w-full py-1.5 rounded-lg text-[10px] font-serif font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 transition flex items-center justify-center gap-1 cursor-pointer shadow"
                            >
                              <XCircle className="w-3 h-3 text-zinc-400" />
                              <span>Thu Hồi Về Tiên Đình</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeployChild(child.id)}
                              className="w-full py-1.5 rounded-lg text-[10px] font-serif font-bold bg-gradient-to-r from-purple-900 to-amber-900 hover:brightness-125 text-purple-100 border border-purple-500/60 transition flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            >
                              <Swords className="w-3 h-3 text-amber-300" />
                              <span>⚔️ Chỉ Định Xuất Sư Trợ Chiến</span>
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
            <Baby className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 font-serif">
              Chưa có Tiên Đồng nào sinh hạ. Hãy thực hiện nghi thức hoài thai tại Linh Thai Dưỡng Dục Đình!
            </p>
          </div>
        )}
      </div>

      {/* ── MODAL ĐẶT TÊN CỔ PHONG CHO HÀI NHI ── */}
      {namingModalChild && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 border border-amber-500/50 p-5 space-y-4 shadow-2xl relative">
            <div className="text-center space-y-1">
              <span className="text-3xl">👶</span>
              <h3 className="text-sm font-serif font-bold text-amber-200 uppercase tracking-wider">
                Khai Thai Điểm Hóa • Ban Danh Cho Hài Nhi
              </h3>
              <p className="text-[11px] text-zinc-400 font-serif">
                Linh Thai đã viên mãn, chuẩn bị phá vỏ đón nhận linh khí thế gian. Hãy ban tặng một cái tên cổ phong cho con trẻ!
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-300 font-serif block">
                Tên Hài Nhi (Để trống sẽ sinh ngẫu nhiên tên cổ phong):
              </label>
              <input
                type="text"
                value={customChildName}
                onChange={e => setCustomChildName(e.target.value)}
                placeholder="Ví dụ: Diệp Trường Phong, Lâm Tuyết Nhi..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-serif focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setNamingModalChild(false)}
                className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-serif font-bold transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => handleBirthChild(customChildName)}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 text-zinc-950 text-xs font-serif font-bold transition cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                👶 Phá Noãn Chào Đời
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ĐẠI LỄ XUẤT SƯ CỔ PHONG ── */}
      <DiscipleGraduationModal
        isOpen={Boolean(graduationModalChild)}
        disciple={graduationModalChild}
        onConfirmGraduation={(id) => {
          appointmentActions?.handleGraduateDisciple(id);
          setGraduationModalChild(null);
        }}
        onClose={() => setGraduationModalChild(null)}
      />
    </div>
  );
};
