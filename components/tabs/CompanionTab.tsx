import React, { useState, useEffect } from 'react';
import {
  Heart,
  Compass,
  Crown,
  Sparkles,
  Gift,
  Scroll,
  Sprout,
  Shield,
  Zap,
  Flame,
  Droplet,
  Eye,
  CheckCircle2,
  Lock,
  X,
  Clock,
  Swords,
  Award,
  Baby
} from 'lucide-react';
import {
  PlayerStats,
  CompanionDefinition,
  CompanionPlayerState,
  CompanionsDataState,
  DualCultivationEvent,
  CompanionWithState
} from '@/lib/types';
import { DualCultivationEventModal } from '@/components/modals/DualCultivationEventModal';
import {
  COMPANIONS_DATA,
  COMPANIONS_MAP,
  getAffinityTier,
  createDefaultCompanionPlayerState,
  SONG_TU_COOLDOWN_MS,
  CHAT_COOLDOWN_MS,
  CHAT_COOLDOWN_DISCOUNT_MS,
  getChatCooldownMs,
  DUAL_CULTIVATION_OPTIONS,
  DualCultivationType
} from '@/lib/companions-data';
import { OffspringSanctuaryView } from './OffspringSanctuaryView';
import type { useOffspringActions } from '@/hooks/useOffspringActions';

export interface CompanionTabProps {
  player: PlayerStats;
  bondedCount: number;
  isTamTinhActive: boolean;
  tamTinhRemainingHours: number;
  handleTravelCompanion: () => void;
  handleEncounterCompanion: (comp: CompanionDefinition) => void;
  handleChatCompanion: (comp: CompanionDefinition) => void;
  handleOpenGiftModal: (comp: CompanionDefinition) => void;
  handleBondCompanion: (comp: CompanionDefinition) => void;
  handleSongTu: (comp: CompanionDefinition, type?: DualCultivationType) => void;
  handleSetActiveCompanion: (companionId: string) => void;
  handleCompleteQuest?: (comp: CompanionDefinition) => void;
  handleStationGarden?: (companionId: string | null) => void;
  handleInfuseCompanion?: (companionId: string, tuViAmount: number) => any;
  currentTimestamp?: number;
  offspringActions?: ReturnType<typeof useOffspringActions>;
  appointmentActions?: ReturnType<typeof import('@/hooks/useDiscipleAppointmentActions').useDiscipleAppointmentActions>;
  activeDualEvent?: {
    event: DualCultivationEvent;
    partner: CompanionWithState;
    songTuType: any;
  } | null;
  isResolvingDualEvent?: boolean;
  handleChooseDualEventOption?: (choiceId: string) => void;
  handleCloseDualEventModal?: () => void;
}


export const CompanionTab: React.FC<CompanionTabProps> = ({
  player,
  bondedCount,
  isTamTinhActive,
  tamTinhRemainingHours,
  handleTravelCompanion,
  handleEncounterCompanion,
  handleChatCompanion,
  handleOpenGiftModal,
  handleBondCompanion,
  handleSongTu,
  handleSetActiveCompanion,
  handleCompleteQuest,
  handleStationGarden,
  handleInfuseCompanion,
  currentTimestamp,
  offspringActions,
  appointmentActions,
  activeDualEvent,
  isResolvingDualEvent,
  handleChooseDualEventOption,
  handleCloseDualEventModal
}) => {
  const compState: CompanionsDataState = player.companionsState || {
    activeCompanionId: null,
    stationedGardenCompanionId: null,
    tamThanHopNhatUntil: 0,
    companions: {},
    tamTinhThanDieuUntil: 0
  };
  const safeCompanions = (compState.companions || {}) as Record<string, CompanionPlayerState>;

  // Sub-tab chuyển đổi giữa Danh Sách Đạo Lữ và Song Tu & Tiên Đình
  const [activeSubTab, setActiveSubTab] = useState<'companions' | 'offspring'>('companions');

  // Thời gian thực địa phương cho đồng hồ đếm ngược
  const [localTime, setLocalTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setLocalTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const now = currentTimestamp || localTime;

  // Trạng thái các Modal tương tác
  const [secretModalComp, setSecretModalComp] = useState<CompanionDefinition | null>(null);
  const [questModalComp, setQuestModalComp] = useState<CompanionDefinition | null>(null);
  const [songTuModalComp, setSongTuModalComp] = useState<CompanionDefinition | null>(null);
  const [ceremonyModalComp, setCeremonyModalComp] = useState<CompanionDefinition | null>(null);
  const [infusionModalComp, setInfusionModalComp] = useState<CompanionDefinition | null>(null);
  const [selectedInfusionAmount, setSelectedInfusionAmount] = useState<number>(50000);


  // Hàm định dạng đồng hồ đếm ngược
  const formatCountdown = (ms: number): string => {
    if (ms <= 0) return 'Sẵn sàng';
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Trạng thái Tâm Thần Hợp Nhất (+20% tốc độ tu luyện 12h)
  const isTamThanActive = Boolean(
    compState?.tamThanHopNhatUntil && now < compState.tamThanHopNhatUntil
  );
  const tamThanRemainingHours = isTamThanActive && compState?.tamThanHopNhatUntil
    ? Math.max(1, Math.ceil((compState.tamThanHopNhatUntil - now) / (60 * 60 * 1000)))
    : 0;

  return (
    <div className="space-y-4">
      {/* Sub-Tabs Header Chuyển Đổi */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSubTab('companions')}
          className={`px-4 py-2 rounded-xl font-serif font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
            activeSubTab === 'companions'
              ? 'bg-gradient-to-r from-rose-950 to-purple-950 text-rose-200 border border-rose-600/60 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>🎎 Danh Sách Đạo Lữ ({bondedCount} Đã Kết Duyên)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('offspring')}
          className={`px-4 py-2 rounded-xl font-serif font-bold text-xs flex items-center gap-2 transition cursor-pointer relative ${
            activeSubTab === 'offspring'
              ? 'bg-gradient-to-r from-amber-950 to-purple-950 text-amber-200 border border-amber-600/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>🌸 Song Tu & Tiên Đình</span>
          {player.offspringState?.gestation?.isGestationActive && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
          )}
        </button>
      </div>

      {/* Render Sub-Tab Song Tu & Tiên Đình */}
      {activeSubTab === 'offspring' && offspringActions && (
        <OffspringSanctuaryView
          player={player}
          offspringActions={offspringActions}
          appointmentActions={appointmentActions}
          currentTimestamp={now}
        />
      )}

      {/* Render Sub-Tab Danh Sách Đạo Lữ Hiện Tại */}
      {activeSubTab === 'companions' && (
        <div className="space-y-4">
          {/* Banner Tổng Quan Tiên Duyên */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-amber-950/40 border border-rose-800/50 space-y-2.5 relative overflow-hidden shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-500/25 animate-pulse" />
                <h3 className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 uppercase tracking-wider">
                  Tiên Duyên Kết Giao • Đạo Lữ Song Tu
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-rose-950/80 text-rose-300 border-rose-600/50 shadow-sm font-bold">
                  {bondedCount}/8 Đã Kết Duyên
                </span>
              </div>
            </div>

        <p className="text-[10px] text-zinc-300 font-serif leading-relaxed">
          Gặp gỡ 8 đại Tiên Tử cổ phong, thấu hiểu tâm tình qua các tầng Hảo Cảm (30 - 60 - 90 - 100). Đạt 100 Hảo Cảm cử hành <strong>Thiên Địa Song Tu Đại Điển</strong> để kích hoạt vĩnh viễn Buff Bản Mệnh và cùng nàng xuất chiến với Tuyệt Kỹ Hợp Kích!
        </p>

        {/* Trạng thái các Buff toàn cục */}
        <div className="flex items-center justify-between pt-2 border-t border-rose-900/40 text-[10px] flex-wrap gap-2">
          <div className="flex items-center gap-3 font-mono flex-wrap">
            {isTamTinhActive ? (
              <span className="text-amber-300 flex items-center gap-1 font-serif animate-pulse font-bold">
                ✨ Tâm Tịnh Thần Diệu (Còn {tamTinhRemainingHours}h: -50% Tâm Ma)
              </span>
            ) : (
              <span className="text-zinc-500 font-serif italic">Chưa kích hoạt Tâm Tịnh Thần Diệu</span>
            )}

            {isTamThanActive && (
              <span className="text-purple-300 flex items-center gap-1 font-serif animate-pulse font-bold">
                🔮 Tâm Thần Hợp Nhất (Còn {tamThanRemainingHours}h: +20% Tu Luyện)
              </span>
            )}

            {/* Chỉ Số Ma Tính / Tâm Ma */}
            <span className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border ${
              (player.demonicNature || 0) >= 60
                ? 'bg-rose-950/80 text-rose-300 border-rose-600/60 font-bold animate-pulse'
                : (player.demonicNature || 0) >= 30
                ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700/60'
            }`}>
              <Flame className="w-3 h-3 text-purple-400" />
              <span>Ma Tính: {player.demonicNature || 0}/100</span>
            </span>

            {/* Hào quang Đạo Lữ Đồng Tâm Hộ Thể */}
            {player.protectiveAuraActive && (
              <span className="text-yellow-300 flex items-center gap-1 font-serif font-bold text-[10px] px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/60 shadow">
                🛡️ Đạo Lữ Đồng Tâm Hộ Thể
              </span>
            )}
          </div>

          <button
            onClick={handleTravelCompanion}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-900/80 to-rose-900/80 hover:brightness-125 text-amber-200 border border-amber-600/60 text-[10px] font-serif font-bold transition flex items-center gap-1.5 cursor-pointer shadow ml-auto"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Du Lịch Tầm Duyên (5,000 LT)</span>
          </button>
        </div>
      </div>

      {/* Danh Sách Đạo Lữ */}
      <div className="space-y-4">
        {COMPANIONS_DATA.filter(comp => !comp.shopTier || safeCompanions[comp.id]?.isBonded || safeCompanions[comp.id]?.isMet).map(comp => {
          const pC = safeCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);
          const affinityInfo = getAffinityTier(pC?.affinity || 0);
          const isBonded = Boolean(pC?.isBonded);
          const isMet = Boolean(pC?.isMet);
          const isCurrentActive = compState?.activeCompanionId === comp.id;
          const isStationedGarden = compState?.stationedGardenCompanionId === comp.id;

          const chatCdMs = getChatCooldownMs(pC?.affinity || 0);
          const chatCooldownRemaining = pC?.lastChatTime && now - pC.lastChatTime < chatCdMs
            ? chatCdMs - (now - pC.lastChatTime)
            : 0;

          const songTuCooldownRemaining = pC?.lastSongTuTime && now - pC.lastSongTuTime < SONG_TU_COOLDOWN_MS
            ? SONG_TU_COOLDOWN_MS - (now - pC.lastSongTuTime)
            : 0;

          const isFatigued = Boolean(pC?.fatigueUntil && pC.fatigueUntil > now);
          const fatigueMinutesRemaining = isFatigued ? Math.max(1, Math.ceil((pC!.fatigueUntil! - now) / 60000)) : 0;

          // Trạng thái quan hệ text
          const relationStatusText = !isMet
            ? 'Chưa gặp gỡ'
            : isBonded
            ? 'Đạo Lữ'
            : pC.affinity >= 90
            ? 'Tình Đầu Ý Hợp'
            : pC.affinity >= 60
            ? 'Tri Kỷ'
            : pC.affinity >= 30
            ? 'Hảo Hữu'
            : 'Sơ Thức';

          return (
            <div
              key={comp.id}
              className={`p-4 rounded-xl border transition-all space-y-3 relative overflow-hidden ${
                isBonded
                  ? 'bg-gradient-to-b from-[#1c1024] to-[#0e0a15] border-rose-500/80 shadow-[0_0_25px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/40'
                  : isMet
                  ? 'bg-[#0f0e18] border-zinc-800 hover:border-zinc-700'
                  : 'bg-[#090910] border-zinc-900 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Hào quang nền cho Đạo Lữ đã kết duyên */}
              {isBonded && (
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              )}

              {/* Top Header: Avatar + Tên + Danh Hiệu + Cảnh Giới + Trạng Thái */}
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${comp.avatarGradient} flex items-center justify-center text-2xl shadow-md shrink-0 border border-white/20 relative`}>
                    {comp.avatar}
                    {isBonded && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 border border-white flex items-center justify-center shadow">
                        <Heart className="w-2.5 h-2.5 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Tên, Danh Hiệu, Cảnh Giới */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
                        {comp.name}
                      </h4>
                      <span className="text-[10px] font-serif px-1.5 py-0.2 rounded bg-rose-950/70 text-rose-300 border border-rose-700/50">
                        {comp.title}
                      </span>
                      {isCurrentActive && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-500/80 flex items-center gap-0.5 shadow animate-pulse">
                          <Crown className="w-2.5 h-2.5 text-amber-400" /> Đồng Hành Trợ Chiến
                        </span>
                      )}
                      {isStationedGarden && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/60 flex items-center gap-0.5">
                          <Sprout className="w-2.5 h-2.5 text-emerald-400" /> Trấn Thủ Linh Điền
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="text-amber-400">{comp.initialRealm}</span>
                      <span>•</span>
                      <span className="text-zinc-400 font-serif">{comp.origin}</span>
                    </div>
                  </div>
                </div>

                {/* Badge Trạng Thái Quan Hệ */}
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                    !isMet
                      ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      : isBonded
                      ? 'bg-gradient-to-r from-rose-950 to-pink-950 text-rose-200 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)] font-bold'
                      : affinityInfo.badgeClass
                  }`}>
                    {isBonded ? '💍 ĐẠO LỮ' : relationStatusText}
                  </span>

                  {isFatigued && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-400" /> Tĩnh Dưỡng ({fatigueMinutesRemaining}p)
                    </span>
                  )}

                  {Boolean(pC.totalEpiphanies && pC.totalEpiphanies > 0) && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-yellow-950/60 text-yellow-300 border border-yellow-700/50 font-mono flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-yellow-400" /> {pC.totalEpiphanies} Đốn Ngộ
                    </span>
                  )}
                </div>
              </div>

              {/* Tính Cách & Xuất Thân */}
              <div className="text-[10px] text-zinc-400 font-serif bg-black/40 p-2.5 rounded-lg border border-zinc-800/80 leading-relaxed">
                <span className="text-amber-300 font-bold">Tính cách: </span>
                {comp.personality}
              </div>

              {/* Lời Thoại / Trích Dẫn */}
              <div className="text-[10px] text-zinc-300 font-serif italic pl-2.5 border-l-2 border-rose-500/60 leading-relaxed">
                "{comp.quote}"
              </div>

              {/* Thanh Tiến Độ Hảo Cảm & Các Mốc Tâm Tình */}
              <div className="space-y-1.5 bg-[#0a0a14] p-3 rounded-lg border border-rose-950/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-300 font-serif font-bold text-[11px] flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
                    Hảo Cảm Tiên Duyên
                  </span>
                  <div className="flex items-center gap-2">
                    {pC.affinity >= 90 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600/50 font-mono font-bold">
                        ⚡ Đàm Đạo -50% CD
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-rose-300 font-bold">
                      {pC.affinity}/100
                    </span>
                  </div>
                </div>

                <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-rose-950">
                  <div
                    className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    style={{ width: `${pC.affinity}%` }}
                  />
                </div>

                {/* Các nút tương tác theo từng Mốc Cốt Truyện */}
                <div className="grid grid-cols-4 gap-1 pt-1 text-[8px] font-mono">
                  {/* Mốc 30: Xuất Thân Bí Mật */}
                  <button
                    onClick={() => setSecretModalComp(comp)}
                    disabled={pC.affinity < 30}
                    className={`py-1 px-1 rounded border text-center transition truncate ${
                      pC.affinity >= 30
                        ? 'bg-sky-950/60 border-sky-600/50 text-sky-200 hover:brightness-125 cursor-pointer font-bold'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Mốc 30: Thân Thế {pC.affinity >= 30 ? '🔓' : '🔒'}
                  </button>

                  {/* Mốc 60: Tâm Nguyện Tiên Tử */}
                  <button
                    onClick={() => setQuestModalComp(comp)}
                    disabled={pC.affinity < 60}
                    className={`py-1 px-1 rounded border text-center transition truncate ${
                      pC.questCompleted
                        ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300 font-bold'
                        : pC.affinity >= 60
                        ? 'bg-purple-950/60 border-purple-500/50 text-purple-200 hover:brightness-125 cursor-pointer font-bold animate-pulse'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Mốc 60: Tâm Nguyện {pC.questCompleted ? '✓' : pC.affinity >= 60 ? '🎁' : '🔒'}
                  </button>

                  {/* Mốc 90: Giảm 50% CD */}
                  <div
                    className={`py-1 px-1 rounded border text-center transition truncate ${
                      pC.affinity >= 90
                        ? 'bg-rose-950/60 border-rose-600/50 text-rose-300 font-bold'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-600'
                    }`}
                  >
                    Mốc 90: -50% CD {pC.affinity >= 90 ? '⚡' : '🔒'}
                  </div>

                  {/* Mốc 100: Kết Duyên */}
                  <div
                    className={`py-1 px-1 rounded border text-center transition truncate ${
                      isBonded
                        ? 'bg-amber-950/60 border-amber-500/60 text-amber-300 font-bold'
                        : pC.affinity >= 100
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold animate-pulse'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-600'
                    }`}
                  >
                    Mốc 100: Đại Điển {isBonded ? '💍' : pC.affinity >= 100 ? '❤️' : '🔒'}
                  </div>
                </div>
              </div>

              {/* Tín Vật Định Tình (Nếu đã hoàn thành Mốc 60) */}
              {pC.tokenEquipped && pC.tokenName && (
                <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-950/40 via-[#181024] to-pink-950/30 border border-purple-600/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pC.tokenIcon || '💍'}</span>
                    <div>
                      <div className="text-[10px] font-serif font-bold text-purple-200">
                        Tín Vật Định Tình: [{pC.tokenName}]
                      </div>
                      <div className="text-[9px] text-zinc-400 font-serif leading-tight">
                        {pC.tokenDescription}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/50 font-mono shrink-0">
                    Đã Khắc Cốt
                  </span>
                </div>
              )}

              {/* Trợ Chiến & Tuyệt Kỹ Hợp Kích */}
              <div className="p-2.5 rounded-lg bg-[#110d18] border border-rose-900/50 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-amber-300 font-serif font-bold flex items-center gap-1">
                    <Swords className="w-3 h-3 text-amber-400" />
                    Trợ Chiến & Tuyệt Kỹ Hợp Kích:
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono ${
                    isCurrentActive
                      ? 'bg-amber-950 text-amber-300 border border-amber-500 font-bold'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}>
                    {isCurrentActive ? '✓ ĐANG SÁNH BƯỚC' : 'CHƯA ĐỒNG HÀNH'}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-300 font-serif leading-relaxed">
                  <div className="text-rose-300 font-bold">
                    ⚔️ Tuyệt Kỹ: [{comp.combinedSkill.name}]
                  </div>
                  <div className="text-zinc-400 italic text-[9px]">
                    "{comp.combinedSkill.quote}"
                  </div>
                  <div className="text-amber-200/90 text-[9px] mt-0.5">
                    • {comp.combinedSkill.bonusEffect}
                  </div>
                </div>

                {/* Chi tiết Buff Bị Động */}
                <div className="pt-1 border-t border-rose-950 text-[9px] text-zinc-400 font-serif space-y-0.5">
                  <div className="font-bold text-zinc-300">Buff Bản Mệnh Khi Kết Duyên:</div>
                  {comp.buffs.cultivateSpeedBonus && (
                    <div>• Tăng <strong>+{comp.buffs.cultivateSpeedBonus}%</strong> Tốc độ tu luyện bế quan thổ nạp.</div>
                  )}
                  {comp.buffs.tamMaDamageReduction && (
                    <div>• Giảm <strong>{comp.buffs.tamMaDamageReduction}%</strong> sát thương Tâm Ma khi đột phá.</div>
                  )}
                  {comp.buffs.critDmgBonus && (
                    <div>• Tăng <strong>+{comp.buffs.critDmgBonus}%</strong> Sát thương Bạo Kích.</div>
                  )}
                  {comp.buffs.lifestealPercent && (
                    <div>• Hút máu <strong>+{comp.buffs.lifestealPercent}%</strong> khí huyết trong chiến đấu.</div>
                  )}
                  {comp.buffs.alchemySuccessBonus && (
                    <div>• Tăng <strong>+{comp.buffs.alchemySuccessBonus}%</strong> Tỉ lệ luyện đan thành công.</div>
                  )}
                  {comp.buffs.atkBonusPercent && (
                    <div>• Tăng <strong>+{comp.buffs.atkBonusPercent}%</strong> Công Kích bản thể.</div>
                  )}
                  {comp.buffs.hpBonusPercent && (
                    <div>• Tăng <strong>+{comp.buffs.hpBonusPercent}%</strong> Khí Huyết (HP) tối đa.</div>
                  )}
                  {comp.buffs.speedBonus && (
                    <div>• Tăng <strong>+{comp.buffs.speedBonus}</strong> Tốc Độ (Speed).</div>
                  )}
                  {comp.buffs.merchantDiscountPercent && (
                    <div>• Giảm <strong>{comp.buffs.merchantDiscountPercent}%</strong> giá mua vật phẩm tại Vạn Bảo Thương Hội.</div>
                  )}
                  {comp.buffs.swordManualBonusPercent && (
                    <div>• Tăng <strong>+{comp.buffs.swordManualBonusPercent}%</strong> Uy Lực Thần Thông kiếm pháp.</div>
                  )}
                  {comp.buffs.defBonusPercent && (
                    <div>• Tăng <strong>+{comp.buffs.defBonusPercent}%</strong> Phòng Ngự bản thể.</div>
                  )}
                  {comp.buffs.ngoTinhBonus && (
                    <div>• Tăng vĩnh viễn <strong>+{comp.buffs.ngoTinhBonus} Ngộ Tính</strong> và <strong>+{comp.buffs.khiVanBonus} Khí Vận</strong>.</div>
                  )}
                </div>
              </div>

              {/* Sở Thích Quà Tặng */}
              <div className="flex items-center justify-between text-[10px] bg-black/30 px-2.5 py-1.5 rounded-lg border border-zinc-800/60">
                <div className="flex items-center gap-1.5 text-zinc-300 font-serif truncate">
                  <Gift className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{comp.favoriteDescription}</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-700/50 font-mono shrink-0 ml-1">
                  x2 Hảo Cảm
                </span>
              </div>

              {/* Hàng Nút Hành Động */}
              <div className="pt-1">
                {!isMet ? (
                  <button
                    onClick={() => handleEncounterCompanion(comp)}
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-rose-800 to-amber-700 hover:brightness-125 text-rose-100 font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tương Ngộ Kỳ Duyên (5,000 Linh Thạch)</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Nút Đàm Đạo kèm đồng hồ đếm ngược */}
                      <button
                        onClick={() => handleChatCompanion(comp)}
                        disabled={chatCooldownRemaining > 0}
                        className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                          chatCooldownRemaining > 0
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white shadow-sm'
                        }`}
                      >
                        <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">
                          {chatCooldownRemaining > 0
                            ? `Tĩnh tọa (${formatCountdown(chatCooldownRemaining)})`
                            : `Đàm Đạo (+6-10)`}
                        </span>
                      </button>

                      {/* Nút Tặng Quà */}
                      <button
                        onClick={() => handleOpenGiftModal(comp)}
                        className="py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-900/70 to-yellow-900/70 hover:brightness-125 border border-amber-600/50 text-amber-200 text-[11px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm truncate"
                      >
                        <Gift className="w-3 h-3 text-amber-300 shrink-0" />
                        <span className="truncate">Tặng Quà</span>
                      </button>
                    </div>

                    {/* Nút Quán Đỉnh Truyền Công */}
                    <button
                      onClick={() => {
                        setInfusionModalComp(comp);
                        setSelectedInfusionAmount(50000);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-purple-950/80 hover:brightness-125 border border-cyan-500/50 text-cyan-200 text-[11px] font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>🌀 Quán Đỉnh Truyền Công</span>
                    </button>


                    {/* Nút Kết Duyên Tiên Lữ (khi chưa kết duyên) */}
                    {!isBonded && (
                      <button
                        onClick={() => setCeremonyModalComp(comp)}
                        disabled={pC.affinity < 100}
                        className={`w-full py-2 px-3 rounded-lg font-serif font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 ${
                          pC.affinity >= 100
                            ? 'bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 hover:brightness-125 text-white border border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] cursor-pointer animate-pulse'
                            : 'bg-zinc-900/70 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${pC.affinity >= 100 ? 'text-white fill-white' : 'text-zinc-500'}`} />
                        <span>
                          {pC.affinity >= 100
                            ? '💍 Thiên Địa Song Tu Đại Điển (50,000 LT)'
                            : `Cần đạt 100 Hảo Cảm để Kết Duyên (${pC.affinity}/100)`}
                        </span>
                      </button>
                    )}

                    {/* Nút Song Tu Thổ Nạp & Quản Lý Đạo Lữ (khi đã kết duyên) */}
                    {isBonded && (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => setSongTuModalComp(comp)}
                          disabled={songTuCooldownRemaining > 0 || isFatigued}
                          className={`w-full py-2 px-3 rounded-lg font-serif font-bold text-xs tracking-wide transition flex items-center justify-center gap-1.5 ${
                            isFatigued
                              ? 'bg-zinc-900/80 border border-amber-800/60 text-amber-400/80 cursor-not-allowed'
                              : songTuCooldownRemaining > 0
                              ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-amber-600 via-rose-600 to-pink-600 hover:brightness-125 text-white border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer animate-pulse'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>
                            {isFatigued
                              ? `Đang Tĩnh Dưỡng (${fatigueMinutesRemaining} phút)`
                              : songTuCooldownRemaining > 0
                              ? `Hồi Khí Song Tu (${formatCountdown(songTuCooldownRemaining)})`
                              : 'Song Tu Thổ Nạp (Chọn 4 Pháp Môn)'}
                          </span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Nút Đặt Làm Đồng Hành Chính */}
                          <button
                            onClick={() => handleSetActiveCompanion(comp.id)}
                            className={`py-1.5 px-2 rounded-lg border text-[10px] font-serif transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                              isCurrentActive
                                ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold'
                                : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{isCurrentActive ? 'Đang Sánh Bước' : 'Sánh Bước Trợ Chiến'}</span>
                          </button>

                          {/* Nút Bố Trí Trấn Thủ Linh Điền */}
                          <button
                            onClick={() => handleStationGarden && handleStationGarden(comp.id)}
                            className={`py-1.5 px-2 rounded-lg border text-[10px] font-serif transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                              isStationedGarden
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                                : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <Sprout className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{isStationedGarden ? 'Thu Hồi Tiên Phủ' : 'Trấn Thủ Linh Điền'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: XUẤT THÂN BÍ MẬT & TÂM SỰ KÍN ĐÁO (MỐC 30) */}
      {/* ======================================================== */}
      {secretModalComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="cophong-card cophong-corner max-w-lg w-full p-5 rounded-2xl border-2 border-sky-500/40 shadow-[0_0_40px_rgba(56,189,248,0.25)] space-y-4 max-h-[85vh] flex flex-col bg-[#0c0d18]">
            <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{secretModalComp.avatar}</span>
                <div>
                  <h3 className="text-sm font-serif font-bold text-sky-200">
                    Tâm Sự & Thân Thế Bí Mật: {secretModalComp.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-serif">Mốc Hảo Cảm 30 (Hảo Hữu Tri Kỷ)</p>
                </div>
              </div>
              <button
                onClick={() => setSecretModalComp(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 text-xs text-zinc-300 font-serif leading-relaxed italic bg-black/40 p-4 rounded-xl border border-sky-900/30">
              <div className="text-amber-300 font-bold not-italic text-[11px] border-b border-sky-900/30 pb-1">
                Lời giải bày tâm sự của {secretModalComp.title}:
              </div>
              <p>"{secretModalComp.secretBackground}"</p>
            </div>

            <button
              onClick={() => setSecretModalComp(null)}
              className="w-full py-2 rounded-lg bg-sky-900/60 hover:bg-sky-800/70 border border-sky-600/50 text-sky-200 text-xs font-serif font-bold transition cursor-pointer"
            >
              Khắc Ghi Vào Tâm Trí
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TÂM NGUYỆN TIÊN TỬ & NHẬN TÍN VẬT (MỐC 60) */}
      {/* ======================================================== */}
      {questModalComp && (() => {
        const q = questModalComp.storyQuest;
        const curCompState = safeCompanions[questModalComp.id] || createDefaultCompanionPlayerState(questModalComp.id);
        const isCompleted = Boolean(curCompState.questCompleted);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="cophong-card cophong-corner max-w-lg w-full p-5 rounded-2xl border-2 border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.25)] space-y-4 max-h-[85vh] flex flex-col bg-[#110d1c]">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{questModalComp.avatar}</span>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-purple-200">
                      Tâm Nguyện Tiên Tử: [{q.title}]
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-serif">Mốc Hảo Cảm 60 (Tri Kỷ Thân Mật)</p>
                  </div>
                </div>
                <button
                  onClick={() => setQuestModalComp(null)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto pr-1 text-xs font-serif leading-relaxed">
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 text-purple-200 italic">
                  "{q.dialogueOnAccept}"
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5">
                  <div className="text-amber-300 font-bold text-[11px]">Mục Tiêu Thu Thập:</div>
                  <div className="text-zinc-300">• {q.description}</div>
                  <div className="text-zinc-400">• Yêu cầu vật phẩm: <strong>{q.targetItemName}</strong></div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-500/40 space-y-1">
                  <div className="text-rose-300 font-bold text-[11px] flex items-center gap-1.5">
                    <span>{q.tokenReward.icon}</span>
                    <span>Tín Vật Định Tình: [{q.tokenReward.name}]</span>
                  </div>
                  <p className="text-zinc-300 text-[10px]">{q.tokenReward.description}</p>
                </div>
              </div>

              {isCompleted ? (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-center text-emerald-300 font-serif font-bold text-xs">
                  ✓ Ngươi đã hoàn thành tâm nguyện và đang mang theo Tín Vật Định Tình!
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (handleCompleteQuest) handleCompleteQuest(questModalComp);
                    setQuestModalComp(null);
                  }}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-700 to-pink-600 hover:brightness-125 text-white font-serif font-bold text-xs transition cursor-pointer shadow-lg animate-pulse"
                >
                  Hoàn Thành Tâm Nguyện & Trao Quà
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL 3: BỐN HÌNH THỨC SONG TU ĐẶC THÙ */}
      {/* ======================================================== */}
      {songTuModalComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="cophong-card cophong-corner max-w-lg w-full p-5 rounded-2xl border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4 max-h-[85vh] flex flex-col bg-[#140e10]">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{songTuModalComp.avatar}</span>
                <div>
                  <h3 className="text-sm font-serif font-bold text-amber-200">
                    Song Tu Thổ Nạp • {songTuModalComp.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-serif">Chọn 1 trong 4 Pháp Môn Song Tu</p>
                </div>
              </div>
              <button
                onClick={() => setSongTuModalComp(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1">
              {DUAL_CULTIVATION_OPTIONS.map(opt => (
                <div
                  key={opt.type}
                  onClick={() => {
                    handleSongTu(songTuModalComp, opt.type);
                    setSongTuModalComp(null);
                  }}
                  className={`p-3 rounded-xl border bg-gradient-to-r ${opt.gradient} hover:brightness-125 transition cursor-pointer space-y-1 relative group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{opt.icon}</span>
                      <div>
                        <div className={`text-xs font-serif font-bold ${opt.color}`}>
                          {opt.name}
                        </div>
                        <div className="text-[9px] text-zinc-400 font-mono">
                          {opt.subtitle}
                        </div>
                      </div>
                    </div>
                    {opt.costDescription && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-rose-300 border border-rose-700/60 font-mono">
                        {opt.costDescription}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-300 font-serif leading-relaxed">
                    {opt.description}
                  </p>
                  <div className="text-[9px] text-amber-200 font-mono pt-0.5 border-t border-white/10">
                    ✨ Hiệu quả: {opt.effectSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: THIÊN ĐỊA SONG TU ĐẠI ĐIỂN (MỐC 100) */}
      {/* ======================================================== */}
      {ceremonyModalComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="cophong-card cophong-corner max-w-md w-full p-6 rounded-2xl border-2 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.4)] space-y-4 text-center bg-gradient-to-b from-[#1a0f1d] via-[#100a14] to-[#0a070e]">
            <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(244,63,94,0.6)] flex items-center justify-center">
              <div className="w-full h-full bg-[#140b17] rounded-full flex items-center justify-center text-3xl">
                {ceremonyModalComp.avatar}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
                THIÊN ĐỊA SONG TU ĐẠI ĐIỂN
              </h3>
              <p className="text-[11px] text-rose-300 font-serif">
                Kết Duyên Tiên Lữ cùng {ceremonyModalComp.title} [{ceremonyModalComp.name}]
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/50 border border-rose-900/60 text-xs text-zinc-300 font-serif italic leading-relaxed">
              "Lấy Thiên Địa vi chứng, Nhật Nguyệt vi minh. Nguyện cùng quân kết tóc se duyên, đồng sinh cộng tử, vượt vạn kiếp luân hồi, vấn đỉnh trường sinh bất hối!"
            </div>

            <div className="text-[10px] text-zinc-400 font-mono space-y-1 border-t border-rose-950 pt-2">
              <div>• Kích hoạt vĩnh viễn toàn bộ Buff Bản Mệnh.</div>
              <div>• Mở khóa Song Tu Thổ Nạp hằng ngày.</div>
              <div>• Chi phí lễ vật tế cáo thiên địa: <strong>50,000 Linh Thạch</strong>.</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCeremonyModalComp(null)}
                className="py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer"
              >
                Hẹn Dịp Khác
              </button>
              <button
                onClick={() => {
                  handleBondCompanion(ceremonyModalComp);
                  setCeremonyModalComp(null);
                }}
                className="py-2 rounded-lg bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 hover:brightness-125 text-white font-serif font-bold text-xs transition cursor-pointer shadow-lg animate-pulse"
              >
                Lập Lời Thề Thiên Địa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: QUÁN ĐỈNH TRUYỀN CÔNG CHO ĐẠO LỮ */}
      {/* ======================================================== */}
      {infusionModalComp && (() => {
        const comp = infusionModalComp;
        const pC = safeCompanions[comp.id] || createDefaultCompanionPlayerState(comp.id);
        const currentExp = pC.exp || 0;
        const currentStage = pC.stage || 1;
        const expPerStage = 150000;
        const currentStageExp = currentExp % expPerStage;
        const stageProgressPct = Math.min(100, Math.floor((currentStageExp / expPerStage) * 100));

        let effectiveRatio = 0.85;
        let affinityBonus = 5;
        if (selectedInfusionAmount >= 1000000) {
          effectiveRatio = 0.88;
          affinityBonus = 25;
        } else if (selectedInfusionAmount >= 200000) {
          effectiveRatio = 0.85;
          affinityBonus = 12;
        }
        const effectiveTuViGained = Math.floor(selectedInfusionAmount * effectiveRatio);
        const expAfter = currentExp + effectiveTuViGained;
        const targetStage = Math.min(9, 1 + Math.floor(expAfter / expPerStage));
        const stageAdvanced = targetStage > currentStage;
        const playerTuVi = player.tuVi || 0;
        const canAfford = playerTuVi >= selectedInfusionAmount;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="cophong-card cophong-corner max-w-lg w-full p-5 rounded-2xl border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] space-y-4 max-h-[90vh] flex flex-col bg-[#080d1a]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{comp.avatar}</span>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-cyan-200 flex items-center gap-1.5">
                      <span>Quán Đỉnh Truyền Công:</span>
                      <span className="text-amber-300">{comp.name}</span>
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-serif">
                      {comp.title} • Giai Đoạn {currentStage}/9 • Hảo Cảm {pC.affinity}/100
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInfusionModalComp(null)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto pr-1 text-xs font-serif leading-relaxed">
                {/* Thông tin Tu Vi người chơi */}
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
                  <div className="text-zinc-400 text-[11px]">
                    Tu Vi Hiện Có Của Bản Thể:
                  </div>
                  <div className="font-mono font-bold text-amber-400 text-sm">
                    {playerTuVi.toLocaleString()} Tu Vi
                  </div>
                </div>

                {/* Thanh tiến độ hiện tại của Đạo Lữ */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-cyan-300">
                    <span>Tiến Độ Cảnh Giới (Giai {currentStage})</span>
                    <span className="font-mono">{currentStageExp.toLocaleString()} / {expPerStage.toLocaleString()} ({stageProgressPct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full border border-cyan-800/50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${stageProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* 3 Mốc Quán Đỉnh Lựa Chọn */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-zinc-300">Chọn Lượng Tu Vi Truyền Thụ:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { amount: 50000, name: 'Sơ Cấp', loss: '15%', aff: '+5' },
                      { amount: 200000, name: 'Trung Cấp', loss: '15%', aff: '+12' },
                      { amount: 1000000, name: 'Đại Viên Mãn', loss: '12%', aff: '+25' },
                    ].map(tier => {
                      const isSelected = selectedInfusionAmount === tier.amount;
                      const canPick = playerTuVi >= tier.amount;
                      return (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => setSelectedInfusionAmount(tier.amount)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                              : canPick
                              ? 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-800 text-zinc-300'
                              : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 opacity-60'
                          }`}
                        >
                          <div className="font-bold text-xs text-cyan-200">{tier.name}</div>
                          <div className="text-[11px] font-mono text-amber-300 font-bold mt-1">
                            {tier.amount >= 1000000 ? `${tier.amount / 1000000}M` : `${tier.amount / 1000}k`}
                          </div>
                          <div className="text-[9px] text-zinc-400 mt-0.5">
                            Hảo Cảm: <span className="text-rose-400">{tier.aff}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dự kiến kết quả sau Quán Đỉnh */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1.5 font-mono">
                  <div className="text-zinc-400 font-serif font-bold text-xs text-amber-300">
                    Dự Báo Sau Khi Quán Đỉnh:
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Tu Vi Đạo Lữ Nhận:</span>
                    <span className="text-cyan-300">+{effectiveTuViGained.toLocaleString()} Tu Vi</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Hảo Cảm Tăng Thêm:</span>
                    <span className="text-rose-400">+{affinityBonus} Điểm ({Math.min(100, pC.affinity + affinityBonus)}/100)</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Cảnh Giới Dự Kiến:</span>
                    <span className={stageAdvanced ? 'text-amber-400 font-bold animate-pulse' : 'text-zinc-300'}>
                      {stageAdvanced ? `ĐỘT PHÁ LÊN GIAI ${targetStage}! 🎉` : `Giai Đoạn ${currentStage}/9`}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-1 border-t border-zinc-800/80">
                    <span>Tu Vi Bản Thân Còn Lại:</span>
                    <span className={canAfford ? 'text-emerald-400' : 'text-red-400'}>
                      {Math.max(0, playerTuVi - selectedInfusionAmount).toLocaleString()} Tu Vi
                    </span>
                  </div>
                </div>

                {!canAfford && (
                  <p className="text-[11px] text-rose-400 italic text-center">
                    * Tu Vi bản thể không đủ để thực hiện mức quán đỉnh này!
                  </p>
                )}
              </div>

              {/* Nút hành động */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-cyan-900/40">
                <button
                  type="button"
                  onClick={() => setInfusionModalComp(null)}
                  className="py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => {
                    if (canAfford && handleInfuseCompanion) {
                      handleInfuseCompanion(comp.id, selectedInfusionAmount);
                    }
                    setInfusionModalComp(null);
                  }}
                  className={`py-2.5 rounded-xl font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg ${
                    canAfford
                      ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:brightness-125 text-white border border-cyan-400 shadow-cyan-500/20 cursor-pointer active:scale-98'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Xác Nhận Quán Đỉnh</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL 7: BIẾN CỐ NGẪU NHIÊN KHI SONG TU ĐẠO LỮ CỬU GIAI */}
      {/* ======================================================== */}
      {activeDualEvent && handleChooseDualEventOption && (
        <DualCultivationEventModal
          isOpen={Boolean(activeDualEvent)}
          event={activeDualEvent.event}
          partner={activeDualEvent.partner}
          player={player}
          isResolving={isResolvingDualEvent}
          onSelectChoice={handleChooseDualEventOption}
          onClose={handleCloseDualEventModal}
        />
      )}
    </div>
  );
};

