import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Trophy,
  Swords,
  Shield,
  Zap,
  Crown,
  Sparkles,
  RefreshCw,
  Gift,
  Clock,
  ChevronRight,
  Flame,
  Award,
  Play,
  Pause,
  FastForward,
  SkipForward,
  CheckCircle2,
  XCircle,
  Eye,
  Scroll,
  Search,
  AlertCircle
} from 'lucide-react';
import {
  PlayerStats,
  LadderOpponent,
  PvPLadderState,
  PvPBattleResult,
  PvPTurnLog
} from '@/lib/types';
import { usePvPLadderActions } from '@/hooks/usePvPLadderActions';
import { SmoothHealthBar, FloatingDamageOverlay, DamagePopup } from '@/components/battle';
import TrinitySynergyGauge from './TrinitySynergyGauge';
import { calculateCombatPower } from '@/lib/game-logic';
import { audioEngine } from '@/lib/audio-engine';
import { createDefaultTrinitySynergyGaugeState } from '@/lib/combat-synergy-data';

export interface PvPLadderViewProps {
  player: PlayerStats;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onShowToast?: (msg: string) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
}

export const PvPLadderView: React.FC<PvPLadderViewProps> = ({
  player,
  onUpdatePlayer,
  onShowToast,
  onAddLog
}) => {
  const {
    ladderState,
    activePvPTab,
    setActivePvPTab,
    selectedOpponent,
    isFighting,
    pvpBattleResult,
    showBattleModal,
    currentMatchmakingTargets,
    topThreeOpponents,
    handleChallengeOpponent,
    handleClaimWeeklyReward,
    handleRefreshTargets,
    handleCloseBattleModal
  } = usePvPLadderActions({
    player,
    setPlayer: onUpdatePlayer
      ? (updater) => {
          if (typeof updater === 'function') {
            onUpdatePlayer(updater(player));
          } else {
            onUpdatePlayer(updater);
          }
        }
      : undefined,
    addLog: onAddLog,
    showToast: onShowToast
  });

  // Search & Filter trong bảng xếp hạng toàn diện
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'top10' | 'top50' | 'top100'>('all');

  // Trạng thái tua / xem chiến báo PvP
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [combatSpeed, setCombatSpeed] = useState<1 | 2>(1);
  const [playerHp, setPlayerHp] = useState(0);
  const [oppHp, setOppHp] = useState(0);
  const [playerPopups, setPlayerPopups] = useState<DamagePopup[]>([]);
  const [oppPopups, setOppPopups] = useState<DamagePopup[]>([]);
  const [playerSlashing, setPlayerSlashing] = useState(false);
  const [oppSlashing, setOppSlashing] = useState(false);
  const [isSlashCrit, setIsSlashCrit] = useState(false);
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  const playerPower = useMemo(() => calculateCombatPower(player), [player]);
  const playerMaxHp = player.maxKhiHuyet || 1000;
  const playerMaxMp = player.maxLinhLuc || 500;

  // Kiểm tra thời gian kết toán tuần (7 ngày)
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const lastSettlement = ladderState.lastWeeklySettlementTime || Date.now();
  const timeSinceSettlement = Date.now() - lastSettlement;
  const canClaimWeekly = timeSinceSettlement >= SEVEN_DAYS_MS;
  const timeUntilNextSettlement = Math.max(0, SEVEN_DAYS_MS - timeSinceSettlement);
  const daysLeft = Math.floor(timeUntilNextSettlement / (24 * 60 * 60 * 1000));
  const hoursLeft = Math.floor((timeUntilNextSettlement % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  // Khi modal chiến báo mở ra, khởi tạo animation từng lượt
  useEffect(() => {
    if (showBattleModal && pvpBattleResult) {
      setCurrentRoundIdx(0);
      setIsAutoPlaying(true);
      setIsBattleFinished(false);
      setPlayerHp(playerMaxHp);
      setOppHp(pvpBattleResult.opponentMaxHp);
      setPlayerPopups([]);
      setOppPopups([]);

      if (pvpBattleResult.rounds.length > 0) {
        applyRoundEffects(pvpBattleResult.rounds[0]);
      }
    }
  }, [showBattleModal, pvpBattleResult, playerMaxHp]);

  // Vòng lặp autoplay cho từng hiệp đấu
  useEffect(() => {
    if (!showBattleModal || !pvpBattleResult || !isAutoPlaying || isBattleFinished) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    const intervalTime = combatSpeed === 2 ? 800 : 1500;
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentRoundIdx((prev) => {
        const nextRound = prev + 1;
        if (nextRound >= pvpBattleResult.rounds.length) {
          setIsBattleFinished(true);
          setIsAutoPlaying(false);
          setPlayerHp(pvpBattleResult.finalPlayerHp);
          setOppHp(pvpBattleResult.finalOpponentHp);
          return prev;
        }
        applyRoundEffects(pvpBattleResult.rounds[nextRound]);
        return nextRound;
      });
    }, intervalTime);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [showBattleModal, pvpBattleResult, isAutoPlaying, combatSpeed, isBattleFinished]);

  // Cuộn log chiến báo xuống dòng mới nhất
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentRoundIdx]);

  // Hiệu ứng chữ sát thương bay & chém kiếm khí cho từng round
  const applyRoundEffects = (roundLog: PvPTurnLog) => {
    if (!roundLog) return;
    setPlayerHp(roundLog.playerHpAfter);
    setOppHp(roundLog.opponentHpAfter);

    const xOff1 = (Math.random() - 0.5) * 35;
    const yOff1 = (Math.random() - 0.5) * 25;
    const xOff2 = (Math.random() - 0.5) * 35;
    const yOff2 = (Math.random() - 0.5) * 25;

    // 1. Đòn đánh của người chơi
    if (roundLog.playerAction.isDodge) {
      setOppPopups((prev) => [
        ...prev.slice(-3),
        { id: `pop_opp_${Date.now()}_1`, text: 'NÉ TRÁNH', type: 'dodge', x: xOff1, y: yOff1 }
      ]);
    } else if (roundLog.playerAction.damage > 0) {
      setOppSlashing(true);
      setIsSlashCrit(Boolean(roundLog.playerAction.isCrit));
      setTimeout(() => setOppSlashing(false), 260);

      setOppPopups((prev) => [
        ...prev.slice(-3),
        {
          id: `pop_opp_${Date.now()}_1`,
          text: `-${roundLog.playerAction.damage.toLocaleString()}`,
          type: roundLog.playerAction.isCrit ? 'crit' : 'normal',
          x: xOff1,
          y: yOff1
        }
      ]);
      audioEngine.playSFX('slash', roundLog.playerAction.isCrit);
    }

    // 2. Đòn đánh đáp trả của NPC
    if (roundLog.opponentAction.isDodge) {
      setPlayerPopups((prev) => [
        ...prev.slice(-3),
        { id: `pop_ply_${Date.now()}_2`, text: 'NÉ TRÁNH', type: 'dodge', x: xOff2, y: yOff2 }
      ]);
    } else if (roundLog.opponentAction.damage > 0) {
      setTimeout(() => {
        setPlayerSlashing(true);
        setTimeout(() => setPlayerSlashing(false), 260);

        setPlayerPopups((prev) => [
          ...prev.slice(-3),
          {
            id: `pop_ply_${Date.now()}_2`,
            text: `-${roundLog.opponentAction.damage.toLocaleString()}`,
            type: roundLog.opponentAction.isCrit ? 'crit' : 'normal',
            x: xOff2,
            y: yOff2
          }
        ]);
        audioEngine.playSFX('thunder');
      }, 350);
    }
  };

  // Nút bỏ qua chiến đấu xem kết quả ngay
  const handleSkipToEnd = () => {
    if (!pvpBattleResult) return;
    setIsAutoPlaying(false);
    setCurrentRoundIdx(pvpBattleResult.rounds.length - 1);
    setPlayerHp(pvpBattleResult.finalPlayerHp);
    setOppHp(pvpBattleResult.finalOpponentHp);
    setIsBattleFinished(true);
  };

  // Danh sách NPC đã lọc
  const filteredLadderNpcs = useMemo(() => {
    let list = ladderState.ladderNpcs || [];
    if (tierFilter === 'top10') list = list.filter((n) => n.rank <= 10);
    else if (tierFilter === 'top50') list = list.filter((n) => n.rank <= 50);
    else if (tierFilter === 'top100') list = list.filter((n) => n.rank <= 100);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.sectName.toLowerCase().includes(q) ||
          n.realmName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [ladderState.ladderNpcs, tierFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. HEADER ĐẤU TRƯỜNG THIÊN KIÊU BẢNG */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#18110b] via-[#120f18] to-[#1a140d] border border-amber-600/40 p-4 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          {/* Thông tin thứ hạng nhân vật */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)] shrink-0">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-300">
                {ladderState.currentRank <= 100 ? `#${ladderState.currentRank}` : '101+'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
                  VẠN TIÊN ĐẠI HỘI • THIÊN KIÊU BẢNG
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/50 text-amber-300 font-mono">
                  Mô Phỏng PvP
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs font-mono text-zinc-300 flex-wrap">
                <span>
                  Thứ Hạng:{' '}
                  <strong
                    className={
                      ladderState.currentRank <= 10
                        ? 'text-rose-400'
                        : ladderState.currentRank <= 50
                        ? 'text-amber-300'
                        : 'text-emerald-400'
                    }
                  >
                    {ladderState.currentRank <= 100
                      ? `Hạng #${ladderState.currentRank} / 100`
                      : 'Chưa Lên Bảng (101+)'}
                  </strong>
                </span>
                <span className="text-zinc-600">•</span>
                <span>
                  Kỷ Lục:{' '}
                  <span className="text-yellow-400 font-bold">
                    {ladderState.bestRank <= 100 ? `Hạng #${ladderState.bestRank}` : 'Chưa có'}
                  </span>
                </span>
                <span className="text-zinc-600">•</span>
                <span>
                  Lực Chiến:{' '}
                  <span className="text-amber-400 font-bold">{playerPower.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Vé khiêu chiến & Kết toán tuần */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Lệnh Bài Khiêu Chiến */}
            <div className="px-3 py-2 rounded-lg bg-black/60 border border-amber-800/40 flex items-center gap-2 shadow-sm">
              <span className="text-sm">🎫</span>
              <div className="text-left font-mono">
                <div className="text-[10px] text-zinc-400">Lệnh Bài:</div>
                <div className="text-xs font-bold text-amber-300">
                  {ladderState.challengeTickets} / 5
                </div>
              </div>
              <button
                type="button"
                onClick={handleRefreshTargets}
                className="ml-1 p-1.5 rounded-md hover:bg-amber-950/50 text-amber-400 hover:text-amber-200 transition cursor-pointer border border-transparent hover:border-amber-700/50"
                title="Làm mới danh sách đối thủ"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bổng Lộc Kết Toán Tuần */}
            <div className="px-3 py-2 rounded-lg bg-black/60 border border-amber-800/40 flex items-center gap-2 shadow-sm">
              <Gift className="w-4 h-4 text-purple-400" />
              <div className="text-left font-mono text-[10px]">
                <div className="text-zinc-400 flex items-center gap-1">
                  <span>Kết toán:</span>
                  <span className="text-purple-300 font-bold">
                    {canClaimWeekly ? 'Đã Đến Hạn' : `${daysLeft}n ${hoursLeft}g`}
                  </span>
                </div>
                {canClaimWeekly ? (
                  <button
                    type="button"
                    onClick={handleClaimWeeklyReward}
                    className="mt-0.5 px-2 py-0.5 rounded bg-gradient-to-r from-purple-700 to-indigo-700 hover:brightness-125 text-white font-serif font-bold text-[10px] cursor-pointer shadow-sm animate-pulse"
                  >
                    Lĩnh Thưởng Tuần
                  </button>
                ) : (
                  <span className="text-[9px] text-zinc-500">
                    Bổng lộc Hạng #{ladderState.currentRank <= 100 ? ladderState.currentRank : '101+'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thanh chuyển tab phân hệ: Khiêu Chiến | Thiên Kiêu Bảng | Chiến Báo */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-900/30">
          <button
            type="button"
            onClick={() => setActivePvPTab('challenge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activePvPTab === 'challenge'
                ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-md border border-amber-500/50'
                : 'bg-black/40 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-zinc-800'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>Sàn Đấu & Mục Tiêu</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePvPTab('ladder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activePvPTab === 'ladder'
                ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-md border border-amber-500/50'
                : 'bg-black/40 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-zinc-800'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span>Top 100 Thiên Kiêu</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePvPTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activePvPTab === 'history'
                ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-md border border-amber-500/50'
                : 'bg-black/40 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-zinc-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhật Ký Đấu Pháp ({ladderState.combatLogs?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB SÀN ĐẤU & MỤC TIÊU KHIÊU CHIẾN */}
      {/* ======================================================== */}
      {activePvPTab === 'challenge' && (
        <div className="space-y-4">
          {/* KHU VỰC 1: BẢNG PHONG THẦN (TOP 3 THIÊN KIÊU ĐỨNG ĐẦU) */}
          <div className="rounded-xl bg-gradient-to-b from-[#140e09] to-[#0c0a0f] border border-amber-800/40 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                BẢNG PHONG THẦN • TAM ĐẠI ĐỈNH PHONG
              </span>
              <span className="text-[10px] font-mono text-zinc-400 italic">
                Chí Tôn Thiên Kiêu Thống Trị Tiên Giới
              </span>
            </div>

            {/* Grid 3 bục vinh danh: Quán Quân (1) - Á Quân (2) - Quý Quân (3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {topThreeOpponents.map((npc) => {
                const isChampion = npc.rank === 1;
                const isRunnerUp = npc.rank === 2;
                const auraClass = isChampion
                  ? 'border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.5)] bg-gradient-to-b from-amber-950/40 to-black/60 ring-1 ring-amber-400/40'
                  : isRunnerUp
                  ? 'border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.4)] bg-gradient-to-b from-purple-950/30 to-black/60 ring-1 ring-purple-400/30'
                  : 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.4)] bg-gradient-to-b from-rose-950/30 to-black/60 ring-1 ring-rose-500/30';

                const rankBadge = isChampion ? '🥇 QUÁN QUÂN' : isRunnerUp ? '🥈 Á QUÂN' : '🥉 QUÝ QUÂN';
                const rankColor = isChampion ? 'text-yellow-300' : isRunnerUp ? 'text-purple-300' : 'text-rose-300';

                return (
                  <div
                    key={npc.id}
                    className={`relative rounded-xl p-3 border transition flex flex-col justify-between ${auraClass}`}
                  >
                    <div>
                      {/* Huy hiệu thứ hạng */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-serif font-black tracking-wider ${rankColor}`}>
                          {rankBadge}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 border border-zinc-700 text-zinc-300 font-bold">
                          Hạng #{npc.rank}
                        </span>
                      </div>

                      {/* Avatar & Tên đạo hiệu */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-black/70 border border-zinc-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {npc.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-xs text-amber-200 truncate flex items-center gap-1">
                            <span>{npc.name}</span>
                          </div>
                          <div className="text-[10px] font-serif text-amber-400/90 truncate italic">
                            "{npc.title}"
                          </div>
                          <div className="text-[9px] font-mono text-zinc-400 truncate">
                            {npc.sectName}
                          </div>
                        </div>
                      </div>

                      {/* Thông số cảnh giới & lực chiến */}
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-1 text-[9px] font-mono">
                        <div>
                          <span className="text-zinc-500">Cảnh Giới:</span>
                          <div className="text-emerald-400 font-bold truncate">{npc.realmName}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Lực Chiến:</span>
                          <div className="text-amber-300 font-bold">{npc.combatPower.toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Khí Linh & Linh Căn */}
                      <div className="mt-1.5 text-[9px] font-serif text-zinc-400 flex items-center justify-between">
                        <span>
                          Linh Căn: <strong className="text-sky-300">{npc.linhCan.name}</strong>
                        </span>
                        {npc.spiritCompanion && (
                          <span className="text-purple-300 font-mono truncate max-w-[100px]">
                            ⚔️ {npc.spiritCompanion.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Nút khiêu chiến */}
                    <div className="mt-3">
                      <button
                        type="button"
                        disabled={ladderState.challengeTickets <= 0 || isFighting}
                        onClick={() => handleChallengeOpponent(npc)}
                        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Khiêu Chiến Đoạt Hạng</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KHU VỰC 2: DANH SÁCH ĐỐI THỦ KHIÊU CHIẾN KHẢ DỤNG (TARGETS LIST) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-serif font-bold text-zinc-200 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                ĐỐI THỦ LUẬN KIẾM GỢI Ý ({currentMatchmakingTargets.length})
              </span>
              <button
                type="button"
                onClick={handleRefreshTargets}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-200 flex items-center gap-1 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Làm mới danh sách</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentMatchmakingTargets.map((target) => {
                const powerDiff = target.combatPower - playerPower;
                const isMuchStronger = powerDiff > playerPower * 0.35;
                const isWeaker = powerDiff < 0;

                return (
                  <div
                    key={target.id}
                    className="p-3.5 rounded-xl bg-[#0e0e16] border border-amber-900/30 hover:border-amber-600/60 transition flex flex-col justify-between shadow-md space-y-3"
                  >
                    <div>
                      {/* Header Card: Thứ hạng & Xuất thân */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-700/60 font-mono font-bold text-xs text-amber-300">
                            Hạng #{target.rank}
                          </span>
                          <span className="text-[10px] font-serif text-zinc-400">
                            {target.sectName}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                            isMuchStronger
                              ? 'bg-red-950/60 border-red-700/60 text-red-300'
                              : isWeaker
                              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                              : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                          }`}
                        >
                          {isMuchStronger
                            ? '⚠️ Vượt Cấp'
                            : isWeaker
                            ? '🟢 Khả Thắng'
                            : '⚖️ Thế Trận Ngang Ngửa'}
                        </span>
                      </div>

                      {/* Avatar, Tên & Đạo Hiệu */}
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="w-12 h-12 rounded-xl bg-black/60 border border-amber-900/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {target.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-sm text-amber-100 truncate">
                            {target.name}
                          </div>
                          <div className="text-[11px] font-serif text-amber-300/80 truncate italic">
                            "{target.title}"
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400 truncate">
                            {target.realmName}
                          </div>
                        </div>
                      </div>

                      {/* Thuộc tính chiến đấu then chốt */}
                      <div className="mt-3 p-2 rounded-lg bg-black/40 border border-zinc-800/80 grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                        <div>
                          <span className="text-zinc-500">Lực Chiến</span>
                          <div className="text-amber-300 font-bold">
                            {target.combatPower.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Linh Căn</span>
                          <div className="text-sky-300 font-bold truncate">{target.linhCan.name}</div>
                        </div>
                        <div>
                          <span className="text-zinc-500">Thần Thức</span>
                          <div className="text-purple-300 font-bold">{target.thanThuc}</div>
                        </div>
                      </div>

                      {/* Bộ công pháp tiêu biểu */}
                      <div className="mt-2 text-[9px] font-serif text-zinc-400 flex items-center gap-1 overflow-x-auto custom-scrollbar">
                        <span className="text-zinc-500 shrink-0">Công Pháp:</span>
                        {target.manuals.slice(0, 3).map((m, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0"
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Nút hành động Luận Kiếm Đoạt Hạng */}
                    <div>
                      <button
                        type="button"
                        disabled={ladderState.challengeTickets <= 0 || isFighting}
                        onClick={() => handleChallengeOpponent(target)}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(225,29,72,0.3)]"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>Luận Kiếm Đoạt Hạng (-1 Vé)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB THIÊN KIÊU BẢNG (TOP 100 NPC TOÀN CẢNH) */}
      {/* ======================================================== */}
      {activePvPTab === 'ladder' && (
        <div className="space-y-3">
          {/* Bộ lọc & Tìm kiếm */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-zinc-800">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo đạo hiệu, họ tên, tông môn hoặc cảnh giới..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-black/70 border border-zinc-800 rounded-md text-xs font-serif text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-600/60"
              />
            </div>

            <div className="flex items-center gap-1">
              {(['all', 'top10', 'top50', 'top100'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setTierFilter(tier)}
                  className={`px-2.5 py-1 rounded text-[10px] font-serif font-bold transition cursor-pointer ${
                    tierFilter === tier
                      ? 'bg-amber-800 text-amber-100 border border-amber-600/60'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {tier === 'all'
                    ? 'Tất Cả'
                    : tier === 'top10'
                    ? 'Thập Đại (1-10)'
                    : tier === 'top50'
                    ? 'Ngũ Thập (1-50)'
                    : 'Bách Cường (1-100)'}
                </button>
              ))}
            </div>
          </div>

          {/* Danh sách 100 Thiên Kiêu cuộn mượt */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredLadderNpcs.map((npc) => {
              const isPlayerRank = ladderState.currentRank === npc.rank;
              const isTopThree = npc.rank <= 3;
              const isTopTen = npc.rank <= 10;

              return (
                <div
                  key={npc.id}
                  className={`p-2.5 rounded-lg border transition flex items-center justify-between gap-3 ${
                    isPlayerRank
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isTopThree
                      ? 'bg-amber-950/20 border-amber-600/50'
                      : 'bg-black/30 border-zinc-800/80 hover:border-amber-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Số thứ hạng */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        npc.rank === 1
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/60 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                          : npc.rank === 2
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                          : npc.rank === 3
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                          : isTopTen
                          ? 'bg-amber-950/50 text-amber-300 border border-amber-700/50'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      #{npc.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-lg bg-black/60 border border-zinc-800 flex items-center justify-center text-lg shrink-0">
                      {npc.avatar}
                    </div>

                    {/* Tên, Đạo hiệu & Tông môn */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs text-zinc-200 truncate">
                          {npc.name}
                        </span>
                        {isPlayerRank && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 font-serif font-bold">
                            Vị Trí Đạo Hữu
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-serif text-amber-300/80 truncate">
                        "{npc.title}" • <span className="text-zinc-400">{npc.sectName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cảnh giới & Lực chiến & Nút Thách Đấu */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono">
                      <div className="text-emerald-400 font-bold text-xs">{npc.realmName}</div>
                      <div className="text-[10px] text-amber-300">
                        {npc.combatPower.toLocaleString()} LC
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={ladderState.challengeTickets <= 0 || isFighting || isPlayerRank}
                      onClick={() => handleChallengeOpponent(npc)}
                      className="px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-serif font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                    >
                      <Swords className="w-3 h-3" />
                      <span>Đoạt Hạng</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB NHẬT KÝ ĐẤU PHÁP (COMBAT LOGS) */}
      {/* ======================================================== */}
      {activePvPTab === 'history' && (
        <div className="space-y-2.5">
          <div className="text-xs font-serif font-bold text-zinc-300 px-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            LỊCH SỬ TRANH PHONG GẦN ĐÂY
          </div>

          {!ladderState.combatLogs || ladderState.combatLogs.length === 0 ? (
            <div className="p-8 text-center text-xs font-serif text-zinc-500 rounded-xl bg-black/40 border border-zinc-800">
              Đạo hữu chưa từng bước lên đài luận kiếm. Hãy chọn một đối thủ để khiêu chiến!
            </div>
          ) : (
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
              {ladderState.combatLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    log.isVictory
                      ? 'bg-emerald-950/20 border-emerald-700/40 text-emerald-200'
                      : 'bg-red-950/20 border-red-700/40 text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        log.isVictory
                          ? 'bg-emerald-900/40 text-emerald-400'
                          : 'bg-red-900/40 text-rose-400'
                      }`}
                    >
                      {log.isVictory ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-xs">
                        {log.isVictory ? 'ĐẮC THẮNG' : 'THẤT BẠI'} trước {log.targetName} (Hạng #{log.targetRank})
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        Biến động: <span className="text-amber-300 font-bold">{log.rankChange}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL SÀN ĐẤU PHÁP TRỰC TIẾP (LIVE TURN COMBAT MODAL) */}
      {/* ======================================================== */}
      {showBattleModal && pvpBattleResult && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="cophong-card w-full max-w-2xl bg-[#0c0c14] border border-amber-600/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col max-h-[92vh]">
            {/* Header Modal */}
            <div className="p-3.5 border-b border-amber-900/30 flex justify-between items-center bg-gradient-to-r from-amber-950/40 via-[#140f0c] to-amber-950/30">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                  SÀN ĐẤU PHÁP THIÊN KIÊU • HIỆP {currentRoundIdx + 1} / {pvpBattleResult.rounds.length}
                </h3>
              </div>

              {/* Điều khiển tốc độ & Autoplay */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
                  title={isAutoPlaying ? 'Tạm Dừng' : 'Tiếp Tục'}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setCombatSpeed(combatSpeed === 1 ? 2 : 1)}
                  className="px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-mono font-bold text-[10px] transition cursor-pointer"
                  title="Tốc độ trận đấu"
                >
                  {combatSpeed}x
                </button>
                <button
                  type="button"
                  onClick={handleSkipToEnd}
                  className="px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-300 font-serif font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                  title="Bỏ qua đến kết quả"
                >
                  <SkipForward className="w-3 h-3" />
                  <span>Bỏ Qua</span>
                </button>
              </div>
            </div>

            {/* Banner Uy Áp Thần Thức (Soul Suppression Message) */}
            {pvpBattleResult.soulSuppressionMessage && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-purple-950/80 border-b border-purple-800/40 text-[10px] font-serif text-purple-200 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>{pvpBattleResult.soulSuppressionMessage}</span>
              </div>
            )}

            {/* Banner Tam Vị Nhất Thể (Synergy Messages) */}
            {pvpBattleResult.synergyMessages && pvpBattleResult.synergyMessages.length > 0 && (
              <div className="px-3 py-2 bg-gradient-to-r from-yellow-950/80 via-amber-950/60 to-yellow-950/80 border-b border-yellow-700/40">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-yellow-300 animate-pulse text-sm">☯️</span>
                  <span className="text-[10px] font-serif font-bold text-yellow-200">TAM VỊ NHẤT THỂ — HỢP KÍCH ĐÃ KHAI PHÁT!</span>
                </div>
                <div className="space-y-0.5 max-h-16 overflow-y-auto custom-scrollbar">
                  {pvpBattleResult.synergyMessages.map((msg, i) => (
                    <div key={i} className="text-[9px] font-serif text-yellow-100/80 leading-relaxed">
                      {msg}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vùng đối đầu 2 Cột: Người Chơi vs Đối Thủ */}
            <div className="p-3 sm:p-4 border-b border-zinc-800/80 bg-black/60 grid grid-cols-2 gap-3 sm:gap-4 relative overflow-hidden">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-red-950/90 border border-red-500/70 flex items-center justify-center font-serif font-black text-xs text-rose-300 shadow-[0_0_15px_rgba(225,29,72,0.6)]">
                VS
              </div>

              {/* CỘT TRÁI: NGƯỜI CHƠI */}
              <div className="relative space-y-2 p-2.5 rounded-xl bg-gradient-to-b from-blue-950/30 to-black/40 border border-blue-900/40 shadow-sm overflow-hidden">
                <FloatingDamageOverlay
                  popups={playerPopups}
                  isSlashing={playerSlashing}
                  slashIsCrit={isSlashCrit}
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-600/50 flex items-center justify-center text-xl shrink-0">
                    🧘
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif font-bold text-xs text-blue-200 truncate">
                      {player.tongMon ? `${player.tongMon} Đạo Hữu` : 'Bản Thể Đạo Hữu'}
                    </div>
                    <div className="text-[9px] text-zinc-400 font-mono">
                      Hạng #{ladderState.currentRank <= 100 ? ladderState.currentRank : '101+'}
                    </div>
                  </div>
                </div>

                <SmoothHealthBar
                  currentHp={playerHp}
                  maxHp={playerMaxHp}
                  label="Khí Huyết"
                  barColor="bg-gradient-to-r from-emerald-600 to-teal-400"
                  trailingColor="bg-emerald-400/50"
                  heightClass="h-2"
                />
                {/* Tam Vị Nhất Thể compact gauge */}
                {(pvpBattleResult.finalSynergyGauge || createDefaultTrinitySynergyGaugeState()).totalSynergyActivations > 0 && (
                  <div className="mt-1">
                    <TrinitySynergyGauge
                      gauge={pvpBattleResult.finalSynergyGauge || createDefaultTrinitySynergyGaugeState()}
                      player={player}
                      compact
                    />
                  </div>
                )}
              </div>

              {/* CỘT PHẢI: NPC THIÊN KIÊU */}
              <div className="relative space-y-2 p-2.5 rounded-xl bg-gradient-to-b from-red-950/30 to-black/40 border border-red-900/40 shadow-sm overflow-hidden">
                <FloatingDamageOverlay
                  popups={oppPopups}
                  isSlashing={oppSlashing}
                  slashIsCrit={isSlashCrit}
                />
                <div className="flex items-center gap-2 justify-end text-right">
                  <div className="min-w-0 flex-1">
                    <div className="font-serif font-bold text-xs text-rose-200 truncate">
                      {pvpBattleResult.opponent.name}
                    </div>
                    <div className="text-[9px] text-zinc-400 font-mono">
                      Hạng #{pvpBattleResult.opponent.rank}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-600/50 flex items-center justify-center text-xl shrink-0">
                    {pvpBattleResult.opponent.avatar || '🥷'}
                  </div>
                </div>

                <SmoothHealthBar
                  currentHp={oppHp}
                  maxHp={pvpBattleResult.opponentMaxHp}
                  label="Khí Huyết"
                  barColor="bg-gradient-to-r from-rose-600 to-red-400"
                  trailingColor="bg-rose-400/50"
                  heightClass="h-2"
                />
              </div>
            </div>

            {/* Khung tường thuật chiêu thức thời gian thực */}
            <div
              ref={logContainerRef}
              className="flex-1 p-3.5 overflow-y-auto space-y-2 text-xs font-serif min-h-[160px] max-h-[220px] bg-black/40 custom-scrollbar"
            >
              {pvpBattleResult.rounds.slice(0, currentRoundIdx + 1).map((roundLog, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-amber-900/30 bg-black/50 text-xs leading-relaxed space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-b border-zinc-800/60 pb-1">
                    <span className="font-bold text-amber-300">Hiệp {roundLog.round}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">
                        Bản thể: {roundLog.playerHpAfter.toLocaleString()} HP
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-rose-400">
                        Đối thủ: {roundLog.opponentHpAfter.toLocaleString()} HP
                      </span>
                    </div>
                  </div>

                  {/* Hành động người chơi */}
                  <div className="text-blue-200">
                    <span className="font-bold text-blue-300 mr-1.5">
                      ⚔️ [{roundLog.playerAction.actionName}]:
                    </span>
                    <span>{roundLog.playerAction.description}</span>
                    {roundLog.playerAction.isCrit && (
                      <span className="ml-1 text-[10px] text-yellow-300 font-mono font-bold">
                        [BẠO KÍCH!]
                      </span>
                    )}
                    {roundLog.playerAction.isDoubleAction && (
                      <span className="ml-1 text-[10px] text-sky-300 font-mono font-bold">
                        [ĐÒN KÉP!]
                      </span>
                    )}
                    {roundLog.playerAction.specialEffect && (
                      <div className="text-[10px] text-purple-300 mt-0.5">
                        {roundLog.playerAction.specialEffect}
                      </div>
                    )}
                  </div>

                  {/* Hành động NPC */}
                  {roundLog.opponentAction && (
                    <div className="text-rose-200 pt-1 border-t border-zinc-800/40">
                      <span className="font-bold text-rose-300 mr-1.5">
                        🗡️ [{roundLog.opponentAction.actionName}]:
                      </span>
                      <span>{roundLog.opponentAction.description}</span>
                      {roundLog.opponentAction.isCrit && (
                        <span className="ml-1 text-[10px] text-yellow-300 font-mono font-bold">
                          [BẠO KÍCH!]
                        </span>
                      )}
                      {roundLog.opponentAction.isDoubleAction && (
                        <span className="ml-1 text-[10px] text-sky-300 font-mono font-bold">
                          [ĐÒN KÉP!]
                        </span>
                      )}
                  {/* Hiệu ứng đặc biệt NPC (Spirit Khí Linh) */}
                  {roundLog.opponentAction.specialEffect && (
                    <div className="text-[10px] text-amber-300 mt-0.5">
                      {roundLog.opponentAction.specialEffect}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* Synergy messages được hiển thị tích hợp trong từng round qua banner trên */}
        </div>

            {/* Footer Modal: Kết quả chiến đấu & Tiếp nhận */}
            <div className="p-3.5 border-t border-amber-900/40 bg-[#0d0a12] flex items-center justify-between">
              {isBattleFinished ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-lg font-serif font-black text-xs ${
                      pvpBattleResult.victory
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'bg-red-950 text-red-300 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    }`}
                  >
                    {pvpBattleResult.victory ? '🎉 ĐẮC THẮNG' : '💔 BẠI TRẬN'}
                  </div>
                  <span className="text-xs font-mono text-zinc-300">
                    {pvpBattleResult.victory
                      ? `Đoạt lấy Hạng #${pvpBattleResult.newRank}!`
                      : `Thứ hạng giữ nguyên (#${pvpBattleResult.newRank})`}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-serif text-zinc-400 italic">
                  Đang giao tranh đấu pháp...
                </span>
              )}

              <button
                type="button"
                onClick={handleCloseBattleModal}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-900 hover:brightness-125 text-white font-serif font-bold text-xs transition cursor-pointer shadow-md"
              >
                Tiếp Nhận Kết Quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
