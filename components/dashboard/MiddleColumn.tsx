import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Sparkles,
  Scroll,
  ShieldCheck,
  Flame,
  Gift,
  AlertTriangle,
  CheckCircle2,
  X,
  Sprout,
  Gem,
  Award,
  ChevronRight,
  TrendingUp,
  Heart,
  Hourglass,
  Compass,
  BookOpen,
  Lock,
  Shield
} from 'lucide-react';
import { PlayerStats, CultivateStance, CultivateSummaryData, CultivateDropItem, CultivateEncounterEvent, Realm, StorylineQuest } from '@/lib/types';
import { DeepCultivateUnit } from '@/lib/types/lifespan';
import { calculateDeepCultivationEstimate } from '@/lib/lifespan-logic';
import { CULTIVATE_STANCES, getCultivateResonanceInfo } from '@/lib/cultivate-data';
import { QuestProgressResult } from '@/lib/storyline-logic';
import { calculateEffectiveRequiredTuVi, isMajorBreakthroughRealm } from '@/lib/attribute-perks';
import { UseMeditationActionsReturn } from '@/hooks/useMeditationActions';
import { MEDITATION_LOCATIONS, MEDITATION_STANCES_CONFIG } from '@/lib/meditation-logic';
import { MeditationStanceType, MeditationLocationConfig } from '@/lib/types/meditation';
import { BreakthroughCatalystAltar } from '@/components/breakthrough/BreakthroughCatalystAltar';
import { useDaoFoundationActions } from '@/hooks/useDaoFoundationActions';
import { MajorBreakthroughModal, HeavenPhenomenonModal } from '@/components/modals';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as Realm[];

function formatMeditationTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h} giờ ${m} phút ${s} giây`;
  }
  if (m > 0) {
    return `${m} phút ${s} giây`;
  }
  return `${s} giây`;
}

import { LogEntry } from '../GameDashboard';
export type { LogEntry };
import { scrollToElementWithHighlight } from '@/lib/navigation-utils';
export { scrollToElementWithHighlight };

export interface MiddleColumnProps {
  estimatedTuVi: number;
  cultivateDuration: number;
  setCultivateDuration: (mins: number) => void;
  isCultivating: boolean;
  handleCultivate: (stance?: CultivateStance) => void;
  handleDeepCultivate?: (amount: number, unit: DeepCultivateUnit) => void;
  nextRealm: any;
  player: PlayerStats;
  setPlayer?: (p: PlayerStats) => void;
  onBreakthroughSuccess?: () => void;
  handleBreakthrough: () => void;
  isBreakingThrough: boolean;
  canBreak: boolean;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  logContainerRef: React.RefObject<HTMLDivElement | null>;
  cultivateStance?: CultivateStance;
  setCultivateStance?: (stance: CultivateStance) => void;
  cultivateSummary?: CultivateSummaryData | null;
  setCultivateSummary?: (summary: CultivateSummaryData | null) => void;
  openStorylineModal?: (targetQuestId?: string) => void;
  activeStorylineQuest?: StorylineQuest | null;
  storylineProgress?: QuestProgressResult | null;
  openRebornModal?: () => void;
  openEnhancedSeclusionModal?: () => void;
  meditation?: UseMeditationActionsReturn;
}

export const MiddleColumn: React.FC<MiddleColumnProps> = ({
  estimatedTuVi,
  cultivateDuration,
  setCultivateDuration,
  isCultivating,
  handleCultivate,
  handleDeepCultivate,
  nextRealm,
  player,
  setPlayer,
  onBreakthroughSuccess,
  handleBreakthrough,
  isBreakingThrough,
  canBreak,
  logs,
  setLogs,
  logContainerRef,
  cultivateStance,
  setCultivateStance,
  cultivateSummary,
  setCultivateSummary,
  openStorylineModal,
  activeStorylineQuest,
  storylineProgress,
  openRebornModal,
  openEnhancedSeclusionModal,
  meditation
}) => {
  // Hook điều phối ngưng tụ Đạo Cơ Đại Cảnh Giới
  const {
    selectedGrade,
    isTranscendenceModalOpen,
    isCinematicOpen,
    cinematicData,
    isExecuting: isFoundationExecuting,
    activeTransition,
    isMajorTransition,
    validationMap,
    handleSelectGrade,
    openTranscendenceModal,
    closeTranscendenceModal,
    closeCinematic,
    handleExecuteMajorBreakthrough
  } = useDaoFoundationActions(player, setPlayer);

  // Mode bế quan: 'deep' (Tuế Nguyệt Bế Quan) | 'realtime' (Nhập Định Ngắn Hạn)
  const [cultivateMode, setCultivateMode] = useState<'deep' | 'realtime'>('deep');
  const [deepAmount, setDeepAmount] = useState<number>(1);
  const [deepUnit, setDeepUnit] = useState<DeepCultivateUnit>('years');

  // Dự toán Tuế Nguyệt Bế Quan
  const safeDeepAmount = Math.max(1, deepAmount || 1);
  const deepEstimate = calculateDeepCultivationEstimate(player, safeDeepAmount, deepUnit);

  const pills = player.inventory?.pills || [];
  const tichCocPill = pills.find((p: any) => p.id === 'pill_tich_coc' || p.name?.includes('Tích Cốc'));
  const tichCocCount = tichCocPill?.quantity || 0;
  const hasEnoughTichCoc = tichCocCount >= deepEstimate.costTichCocDan;
  const hasEnoughLinhThach = (player.linhThach || 0) >= deepEstimate.costLinhThach;

  // Quản lý thế bế quan (Hỗ trợ cả prop ngoài và local fallback)
  const [internalStance, setInternalStance] = useState<CultivateStance>('co_ban');
  const activeStance = cultivateStance ?? internalStance;
  const updateStance = (st: CultivateStance) => {
    if (setCultivateStance) setCultivateStance(st);
    setInternalStance(st);
  };

  // Quản lý Modal Tổng Kết Chiến Lợi Phẩm Bế Quan
  const [internalSummary, setInternalSummary] = useState<CultivateSummaryData | null>(null);
  const activeSummary = cultivateSummary !== undefined ? cultivateSummary : internalSummary;
  const closeSummaryModal = () => {
    if (setCultivateSummary) setCultivateSummary(null);
    setInternalSummary(null);
  };

  const curStanceCfg = CULTIVATE_STANCES[activeStance] || CULTIVATE_STANCES.co_ban;

  // Lấy thông tin cộng hưởng Đạo Lữ & Tông Môn
  const resonance = getCultivateResonanceInfo(player);

  // Hiệu ứng màu theo Stance
  const getStanceTheme = () => {
    if (activeStance === 'hiem_canh') {
      return {
        badgeBg: 'bg-purple-950/40 border-purple-600/40 text-purple-300',
        glowBtn: 'from-purple-900/90 to-purple-700/90 hover:from-purple-800 hover:to-purple-600 text-purple-100 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
        spinRing: 'border-purple-400 border-t-transparent'
      };
    }
    if (activeStance === 'doat_bao') {
      return {
        badgeBg: 'bg-amber-950/40 border-amber-600/40 text-amber-300',
        glowBtn: 'from-amber-800/90 to-amber-700/90 hover:from-amber-700 hover:to-amber-600 text-amber-100 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        spinRing: 'border-amber-400 border-t-transparent'
      };
    }
    return {
      badgeBg: 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300',
      glowBtn: 'from-emerald-800/90 to-emerald-700/90 hover:from-emerald-700 hover:to-emerald-600 text-emerald-100 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      spinRing: 'border-emerald-400 border-t-transparent'
    };
  };

  const stanceTheme = getStanceTheme();

  // Đảm bảo tính toán an toàn tuyệt đối cho cảnh giới hiện tại và cảnh giới kế tiếp
  const currentRealmIndex = Math.max(
    0,
    Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
  );
  const currentRealmData = realmsData[currentRealmIndex];
  const nextRealmIndex = currentRealmIndex + 1;
  const targetNextRealm: Realm | undefined = nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : undefined;
  const isMaxRealm = currentRealmIndex >= realmsData.length - 1;

  const tuViReq = targetNextRealm ? calculateEffectiveRequiredTuVi(player, targetNextRealm) : 0;
  const linhThachReq = targetNextRealm?.requirements.linhThach ?? 0;
  const tuViMissing = targetNextRealm ? Math.max(0, tuViReq - player.tuVi) : 0;
  const linhThachMissing = targetNextRealm ? Math.max(0, linhThachReq - player.linhThach) : 0;
  const effectiveCanBreak = Boolean(targetNextRealm && tuViMissing === 0 && linhThachMissing === 0);

  return (
    <section className="lg:col-span-5 h-full flex flex-col space-y-2.5 min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 shrink-0">
        
        {/* Panel 1: Bế Quan Tu Luyện (Tuế Nguyệt & Nhập Định) */}
        <div id="cultivation-panel" className="cophong-card cophong-corner p-2.5 sm:p-3 rounded-xl space-y-2 flex flex-col justify-between relative overflow-hidden transition-all duration-500">
          {/* Ambient aura theo chế độ & thế tu luyện */}
          <div
            className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
              cultivateMode === 'deep'
                ? 'bg-amber-600/15'
                : activeStance === 'hiem_canh'
                ? 'bg-purple-600/10'
                : activeStance === 'doat_bao'
                ? 'bg-amber-600/10'
                : 'bg-emerald-600/10'
            }`}
          />

          <div>
            {/* Header: Chuyển đổi 2 Chế Độ Bế Quan */}
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-1.5 gap-1 flex-wrap">
              {/* Tabs chuyển đổi giữa Tuế Nguyệt và Nhập Định */}
              <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-amber-900/40">
                <button
                  type="button"
                  onClick={() => setCultivateMode('deep')}
                  className={`text-[10.5px] px-2 py-0.5 rounded font-serif font-bold transition flex items-center gap-1 cursor-pointer ${
                    cultivateMode === 'deep'
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-amber-200'
                  }`}
                  title="Tuế Nguyệt Bế Quan: Bế quan theo Ngày/Tháng/Năm, phương thức thăng cấp chính thống"
                >
                  <Hourglass className="w-3 h-3 text-amber-300" />
                  <span>Tuế Nguyệt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCultivateMode('realtime')}
                  className={`text-[10.5px] px-2 py-0.5 rounded font-serif font-bold transition flex items-center gap-1 cursor-pointer ${
                    cultivateMode === 'realtime'
                      ? 'bg-gradient-to-r from-emerald-800 to-emerald-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-emerald-200'
                  }`}
                  title="Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà (AFK Cultivation)"
                >
                  <Clock className="w-3 h-3 text-emerald-300" />
                  <span>Nhập Định</span>
                  {meditation?.isMeditating && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block ml-0.5" />
                  )}
                </button>
              </div>

              {/* Tu Vi Dự Kiến Badge */}
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold transition-all ${
                cultivateMode === 'deep'
                  ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                  : stanceTheme.badgeBg
              }`}>
                {cultivateMode === 'deep'
                  ? `+${deepEstimate.tuViGained.toLocaleString()} Tu Vi`
                  : meditation?.isMeditating
                  ? `Đang Nhập Định (${Math.min(24, Math.floor(meditation.elapsedSeconds / 3600))}h)`
                  : meditation
                  ? `${meditation.currentLocationConfig.name} (x${meditation.currentLocationConfig.tuviMultiplier})`
                  : `+${Math.floor(estimatedTuVi * (activeStance === 'hiem_canh' ? 1.5 : 1)).toLocaleString()} Tu Vi`}
              </span>
            </div>

            {/* NỘI DUNG CHẾ ĐỘ 1: TUẾ NGUYỆT BẾ QUAN (DEEP CULTIVATION) */}
            {cultivateMode === 'deep' && (
              <div className="mt-1.5 space-y-2">
                {/* Banner Truy Cập Nhanh: Tam Hóa Chi Cảnh */}
                {openEnhancedSeclusionModal && (
                  <div
                    onClick={openEnhancedSeclusionModal}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-purple-950/50 to-blue-950/70 border border-amber-500/50 hover:border-amber-400 shadow-[0_0_15px_rgba(217,119,6,0.25)] transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition shrink-0">
                        🧘
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-serif font-bold text-amber-200 flex items-center gap-1.5 truncate">
                          <span>Tam Hóa Chi Cảnh (Đại Đạo Tam Trọng)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30 shrink-0">
                            Mới
                          </span>
                        </div>
                        <div className="text-[9.5px] text-zinc-300 font-serif flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="text-purple-300">Đan Độc: {player.pillToxicity || 0}</span>
                          <span>•</span>
                          <span className="text-cyan-300">Chân Nguyên: {player.qiPurity ?? 100}%</span>
                          {player.activeDaoSeed && (
                            <>
                              <span>•</span>
                              <span className="text-amber-300">Đạo Chủng: {player.activeDaoSeed.accumulatedYears} năm</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEnhancedSeclusionModal();
                      }}
                      className="text-[10px] font-serif px-2.5 py-1 rounded bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-bold group-hover:brightness-110 transition shadow-sm shrink-0 flex items-center gap-0.5 ml-2 cursor-pointer"
                    >
                      <span>Thiết Lập</span>
                      <ChevronRight className="w-3 h-3 text-black" />
                    </button>
                  </div>
                )}

                {/* Input số lượng và đơn vị */}
                <div className="bg-[#0b0c12]/90 p-2 rounded-lg border border-amber-900/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 font-serif font-semibold flex items-center gap-1">
                      <Hourglass className="w-3.5 h-3.5 text-amber-400" /> Thời Lượng Bế Quan:
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/90">
                      ≈ {deepEstimate.yearsAdded.toFixed(2)} năm thọ nguyên
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Input Number */}
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={1}
                        max={deepUnit === 'years' ? 1000 : 36500}
                        value={deepAmount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setDeepAmount(isNaN(val) || val < 1 ? 1 : val);
                        }}
                        disabled={isCultivating}
                        className="w-full bg-black/80 border border-amber-800/60 rounded px-2.5 py-1 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
                        placeholder="Số lượng..."
                      />
                    </div>

                    {/* Unit Selector */}
                    <div className="flex items-center gap-0.5 bg-black/60 p-0.5 rounded border border-amber-900/50 shrink-0">
                      {(['days', 'months', 'years'] as DeepCultivateUnit[]).map((u) => {
                        const label = u === 'days' ? 'Ngày' : u === 'months' ? 'Tháng' : 'Năm';
                        const isSel = deepUnit === u;
                        return (
                          <button
                            key={u}
                            type="button"
                            disabled={isCultivating}
                            onClick={() => setDeepUnit(u)}
                            className={`text-[10px] font-serif px-2 py-0.5 rounded transition cursor-pointer ${
                              isSel
                                ? 'bg-amber-700/80 text-white font-bold shadow-sm'
                                : 'text-zinc-400 hover:text-amber-200'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nút chọn nhanh (Quick Presets) */}
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {[
                      { amount: 30, unit: 'days' as DeepCultivateUnit, label: '30 Ngày' },
                      { amount: 6, unit: 'months' as DeepCultivateUnit, label: '6 Tháng' },
                      { amount: 1, unit: 'years' as DeepCultivateUnit, label: '1 Năm' },
                      { amount: 5, unit: 'years' as DeepCultivateUnit, label: '5 Năm' },
                      { amount: 10, unit: 'years' as DeepCultivateUnit, label: '10 Năm' },
                      { amount: 50, unit: 'years' as DeepCultivateUnit, label: '50 Năm' }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={isCultivating}
                        onClick={() => {
                          setDeepAmount(p.amount);
                          setDeepUnit(p.unit);
                        }}
                        className={`text-[9px] px-1.5 py-0.5 rounded border font-mono transition cursor-pointer ${
                          deepAmount === p.amount && deepUnit === p.unit
                            ? 'bg-amber-600/40 border-amber-500 text-amber-200 font-bold'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BẢNG DỰ TOÁN HIỆU QUẢ & CHI PHÍ */}
                <div className="p-2 rounded-lg bg-black/60 border border-amber-900/40 space-y-1.5 text-[10.5px]">
                  {/* Hàng 1: Biến đổi Tuổi thọ */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-serif flex items-center gap-1">
                      <span>⏳ Tuổi Thọ:</span>
                    </span>
                    <span className="font-mono text-zinc-200">
                      <span className="text-zinc-400">{deepEstimate.currentAge}</span>
                      <span className="text-amber-500 mx-1">➔</span>
                      <span className={deepEstimate.isLifespanExceeded ? 'text-red-400 font-bold' : 'text-amber-300 font-bold'}>
                        {deepEstimate.newAge}
                      </span>
                      <span className="text-zinc-500"> / </span>
                      <span className="text-amber-400/90">
                        {deepEstimate.maxLifespan >= 99999999 ? 'Vĩnh Sinh' : `${deepEstimate.maxLifespan} Tuổi`}
                      </span>
                    </span>
                  </div>

                  {/* Hàng 2: Tu Vi Thu Hoạch */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-serif">⚡ Tu Vi Gặt Hái:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      +{deepEstimate.tuViGained.toLocaleString()}
                    </span>
                  </div>

                  {/* Hàng 3: Tiêu Hao Nhu Yếu Phẩm */}
                  <div className="border-t border-zinc-800/60 pt-1 flex items-center justify-between">
                    <span className="text-zinc-400 font-serif">💎 Tiêu Hao:</span>
                    <div className="text-right font-mono text-[10px]">
                      {hasEnoughTichCoc ? (
                        <span className="text-emerald-400">
                          {deepEstimate.costTichCocDan} Tích Cốc Đan (Có: {tichCocCount})
                        </span>
                      ) : (
                        <span className={hasEnoughLinhThach ? 'text-amber-300' : 'text-red-400'}>
                          {deepEstimate.costLinhThach.toLocaleString()} Linh Thạch (Có: {(player.linhThach || 0).toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cảnh báo Tọa Hóa nếu vượt thọ nguyên */}
                  {deepEstimate.isLifespanExceeded && (
                    <div className="p-1.5 rounded bg-red-950/80 border border-red-600/70 text-red-200 text-[10px] flex items-center gap-1.5 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>Thọ nguyên không đủ! Bế quan sẽ bị [Tọa Hóa] trước khi xuất quan!</span>
                    </div>
                  )}

                  {!deepEstimate.isLifespanExceeded && deepEstimate.isToaHoaWarning && (
                    <div className="p-1 rounded bg-amber-950/60 border border-amber-600/60 text-amber-300 text-[9.5px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Cảnh báo: Thọ nguyên sau khi xuất quan còn dưới 5 năm!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NỘI DUNG CHẾ ĐỘ 2: THIÊN ĐỊA NHẬP ĐỊNH & KỲ NGỘ SƠN HÀ (STRATEGIC AFK MEDITATION) */}
            {cultivateMode === 'realtime' && meditation && (
              meditation.isMeditating ? (
                /* GIAO DIỆN KHI ĐANG TREO MÁY (ACTIVE MEDITATION STATE) */
                <div className="mt-1.5 p-3 rounded-xl bg-gradient-to-b from-[#0e0f18] to-[#07080d] border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-2.5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Info */}
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center bg-black/60 shadow-inner shrink-0">
                        <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 border-t-amber-300 animate-spin" />
                        <span className="text-sm select-none animate-pulse">☯️</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 truncate">
                          <span>{meditation.currentLocationConfig.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-amber-950/60 border border-amber-700/50 text-amber-300 shrink-0">
                            {meditation.currentLocationConfig.element} • x{meditation.currentLocationConfig.tuviMultiplier}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-serif flex items-center gap-1 mt-0.5 truncate">
                          <span className="text-amber-400 font-semibold">Thế:</span>
                          <span>{meditation.currentStanceConfig.name}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-emerald-400 font-mono text-[9px]">{meditation.currentStanceConfig.badge}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Đang Nhập Định
                      </span>
                    </div>
                  </div>

                  {/* Live Timer Counter */}
                  <div className="text-center py-2 bg-black/40 rounded-lg border border-zinc-800/60 relative z-10">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-serif mb-0.5">
                      Thời Gian Tĩnh Tọa
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-bold text-amber-300 tracking-wider">
                      {formatMeditationTime(meditation.elapsedSeconds)}
                    </div>
                    <div className="text-[9.5px] text-zinc-500 font-mono mt-0.5">
                      Tích lũy tối đa: 24 giờ • Đã tích lũy: {Math.min(24, Math.floor(meditation.elapsedSeconds / 3600))}h
                    </div>
                  </div>

                  {/* Progress to Next Hour Tick */}
                  <div className="space-y-1 relative z-10">
                    <div className="flex justify-between text-[10px] font-serif text-zinc-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Mốc giờ kế tiếp (Kỳ Ngộ & Tài Nguyên):
                      </span>
                      <span className="font-mono text-cyan-300">
                        còn {Math.max(1, Math.ceil((3600 - (meditation.elapsedSeconds % 3600)) / 60))} phút
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 via-amber-500 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, Math.floor(((meditation.elapsedSeconds % 3600) / 3600) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Notice & Ward Protection */}
                  <div className="p-2 rounded bg-zinc-950/70 border border-zinc-800/80 text-[10px] font-sans leading-relaxed relative z-10 space-y-1">
                    {meditation.selectedWardId ? (
                      <div className="flex items-center gap-1.5 text-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Bùa hộ mệnh đang kích hoạt: Bảo vệ nguyên thần khỏi hiểm họa đứt đoạn 100%.</span>
                      </div>
                    ) : meditation.selectedStance === 'hiem_canh' ? (
                      <div className="flex items-center gap-1.5 text-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Cảnh báo: Không mang bùa hộ mệnh. Nguy cơ gặp Khí Huyết Nghịch Chuyển làm gián đoạn bế quan!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Tâm cảnh thanh tịnh, chu thiên vận chuyển thuận lợi. Không có nguy cơ đứt đoạn.</span>
                      </div>
                    )}

                    {meditation.selectedStance === 'luyen_tam' && (
                      <div className="text-purple-300 flex items-center gap-1">
                        <span>🧘</span>
                        <span>Mỗi giờ tự động tẩy trừ 3 Ma Tính & 3 Đan Độc. Xuất quan nhận buff [Tâm Cảnh Thanh Lãng].</span>
                      </div>
                    )}
                    {meditation.selectedStance === 'thao_dien' && (
                      <div className="text-amber-300 flex items-center gap-1">
                        <span>⚔️</span>
                        <span>Toàn bộ tu vi đang chuyển hóa thành điểm thuần thục cho các công pháp đang trang bị.</span>
                      </div>
                    )}
                  </div>

                  {/* THÔNG TIN ĐẠO LỮ & LINH THÚ ĐANG HỘ PHÁP (ACTIVE GUARDIANS) */}
                  {(player.meditationState?.accompanyingCompanionId || player.meditationState?.accompanyingBeastId) && (
                    <div className="p-2 rounded-lg bg-black/60 border border-amber-600/30 text-[10px] font-serif space-y-1.5 relative z-10">
                      <div className="text-[9.5px] uppercase tracking-wider text-amber-300 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1">🛡️ Hộ Đạo Trận Vị Đang Xuất Trận:</span>
                        {meditation.elementalResonance?.hasResonance && (
                          <span className="text-[8.5px] text-amber-400 font-mono animate-pulse bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/40">
                            ⚡ +15% Tu Vi & Dị Bảo
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                        {meditation.selectedCompanionDef && (
                          <div className="flex items-center gap-2 p-1.5 rounded bg-zinc-900/90 border border-rose-900/50">
                            <span className="text-base select-none">🌸</span>
                            <div className="min-w-0">
                              <div className="text-rose-200 font-bold truncate flex items-center gap-1 text-[10px]">
                                <span>{meditation.selectedCompanionDef.name}</span>
                                <span className="text-[8px] px-1 rounded bg-rose-950/80 border border-rose-700/50 text-rose-300 font-mono">
                                  {meditation.selectedCompanionDef.element}
                                </span>
                              </div>
                              <div className="text-[8.5px] text-zinc-400 font-sans">
                                [🌸 Đồng Hành] • Hộ Pháp Cứu Nguy & Định Thần
                              </div>
                            </div>
                          </div>
                        )}

                        {meditation.selectedBeastObj && (
                          <div className="flex items-center gap-2 p-1.5 rounded bg-zinc-900/90 border border-amber-900/50">
                            <span className="text-base select-none">🐾</span>
                            <div className="min-w-0">
                              <div className="text-amber-200 font-bold truncate flex items-center gap-1 text-[10px]">
                                <span>{meditation.selectedBeastObj.name}</span>
                                <span className="text-[8px] px-1 rounded bg-amber-950/80 border border-amber-700/50 text-amber-300 font-mono">
                                  {meditation.selectedBeastObj.element}
                                </span>
                              </div>
                              <div className="text-[8.5px] text-zinc-400 font-sans">
                                [🐾 Hộ Vệ] • Dũng Mãnh Phá Địch & Tuần Tra
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons inside Cockpit */}
                  <div className="grid grid-cols-3 gap-2 relative z-10 pt-1">
                    <button
                      type="button"
                      onClick={() => meditation.handleClaimMeditationRewards()}
                      className="col-span-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black font-serif font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-black animate-spin" />
                      <span>Xuất Quan Thu Hoạch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => meditation.handleCancelMeditation()}
                      className="py-2 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 font-serif text-[11px] transition cursor-pointer text-center"
                      title="Dừng nhập định ngay lập tức"
                    >
                      Dừng Sớm
                    </button>
                  </div>
                </div>
              ) : (
                /* BẢNG THIẾT LẬP NHẬP ĐỊNH (PRE-MEDITATION COCKPIT) */
                <div className="mt-1.5 space-y-2">
                  {/* 1. KHU VỰC CHỌN LINH ĐỊA */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] font-serif text-zinc-300 font-semibold flex items-center gap-1">
                        <Compass className="w-3 h-3 text-amber-400" /> Chọn Linh Địa Tĩnh Tọa:
                      </span>
                      <span className="text-[9px] text-amber-400/90 font-mono">
                        Hệ số: x{meditation.currentLocationConfig.tuviMultiplier} Tu Vi
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
                      {meditation.availableLocations.map((loc: MeditationLocationConfig) => {
                        const isSelected = meditation.selectedLocationId === loc.id;
                        const playerRealmIdx = player.currentRealm || 0;
                        const isUnlocked = playerRealmIdx >= loc.requiredRealmIndex;
                        const reqRealmName = realmsData[loc.requiredRealmIndex]?.name || 'Cao Hơn';

                        const elemColor =
                          loc.element === 'Kim' ? 'text-amber-300 border-amber-700/40 bg-amber-950/40' :
                          loc.element === 'Thủy' ? 'text-cyan-300 border-cyan-700/40 bg-cyan-950/40' :
                          loc.element === 'Hỏa' ? 'text-rose-300 border-rose-700/40 bg-rose-950/40' :
                          loc.element === 'Mộc' ? 'text-emerald-300 border-emerald-700/40 bg-emerald-950/40' :
                          loc.element === 'Thổ' ? 'text-yellow-300 border-yellow-700/40 bg-yellow-950/40' :
                          'text-purple-300 border-purple-700/40 bg-purple-950/40';

                        return (
                          <button
                            key={loc.id}
                            type="button"
                            disabled={!isUnlocked}
                            onClick={() => meditation.setSelectedLocationId(loc.id)}
                            className={`p-1.5 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                              !isUnlocked
                                ? 'opacity-40 grayscale bg-zinc-950/60 border-zinc-800 cursor-not-allowed'
                                : isSelected
                                ? 'bg-gradient-to-b from-amber-950/80 to-[#12101b] border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                                : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] font-serif font-bold text-zinc-200 truncate">
                                  {loc.name}
                                </span>
                                <span className={`text-[8px] px-1 rounded font-mono border ${elemColor} shrink-0`}>
                                  {loc.element}
                                </span>
                              </div>
                              <div className="text-[8.5px] text-zinc-400 line-clamp-1 font-sans">
                                {loc.description}
                              </div>
                            </div>

                            <div className="mt-1 pt-1 border-t border-zinc-800/40 flex items-center justify-between text-[8px] font-mono">
                              <span className="text-amber-300">x{loc.tuviMultiplier} Tu Vi</span>
                              {!isUnlocked ? (
                                <span className="text-red-400 flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" /> {reqRealmName}
                                </span>
                              ) : (
                                <span className="text-emerald-400 flex items-center gap-0.5">
                                  {isSelected ? '✓ Đang chọn' : 'Khả dụng'}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. CHỌN 4 THẾ NHẬP ĐỊNH */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] font-serif text-zinc-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Thế Nhập Định (Chiến Thuật):
                      </span>
                      <span className="text-[9px] text-zinc-400 font-mono italic">
                        {meditation.currentStanceConfig.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {(['co_ban', 'luyen_tam', 'thao_dien', 'hiem_canh'] as MeditationStanceType[]).map(stKey => {
                        const cfg = MEDITATION_STANCES_CONFIG[stKey];
                        const isSelected = meditation.selectedStance === stKey;

                        return (
                          <button
                            key={stKey}
                            type="button"
                            onClick={() => meditation.setSelectedStance(stKey)}
                            className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? stKey === 'co_ban'
                                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                                  : stKey === 'luyen_tam'
                                  ? 'bg-purple-950/70 border-purple-500/80 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                                  : stKey === 'thao_dien'
                                  ? 'bg-amber-950/70 border-amber-500/80 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                                  : 'bg-rose-950/70 border-rose-500/80 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                                : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              {stKey === 'co_ban' && <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                              {stKey === 'luyen_tam' && <Heart className="w-3 h-3 text-purple-400 shrink-0" />}
                              {stKey === 'thao_dien' && <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />}
                              {stKey === 'hiem_canh' && <Flame className="w-3 h-3 text-rose-400 shrink-0" />}
                              <span className="text-[10px] font-serif font-bold truncate">
                                {cfg.name}
                              </span>
                            </div>
                            <div className="text-[8px] font-mono opacity-90">
                              {cfg.badge}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Chi tiết thế đang chọn */}
                    <div className="mt-1 bg-[#0b0c12]/90 p-1.5 rounded border border-zinc-800/70 text-[9.5px] text-zinc-400 leading-snug">
                      <span className="text-zinc-200 font-semibold">{meditation.currentStanceConfig.name}: </span>
                      {meditation.currentStanceConfig.description}
                    </div>
                  </div>

                  {/* 3. BÙA HỘ MỆNH & HỘ TRẬN (WARDS) */}
                  <div className="p-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-serif">
                      <span className="text-zinc-300 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" /> Bùa Hộ Mệnh / Hộ Trận:
                      </span>
                      <span className="text-[8.5px] text-zinc-500 font-mono">
                        (Phòng vệ rủi ro gián đoạn)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={meditation.selectedWardId || ''}
                        onChange={e => meditation.setSelectedWardId(e.target.value || null)}
                        className="w-full bg-[#0d0e14] border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-300 focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Không mang bùa hộ mệnh --</option>
                        {meditation.availableWardsInInventory.map((w: { id: string; name: string; description: string; count: number }) => (
                          <option key={w.id} value={w.id}>
                            🛡️ {w.name} (Có: {w.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    {meditation.selectedWardId ? (
                      <div className="text-[9px] text-emerald-300 font-sans flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Đã kích hoạt bùa hộ mệnh: Miễn nhiễm 100% rủi ro đứt đoạn khi chọn Hiểm Cảnh!</span>
                      </div>
                    ) : meditation.selectedStance === 'hiem_canh' ? (
                      <div className="text-[9px] text-rose-400 font-sans flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>Chưa trang bị bùa: Có 20% nguy cơ gặp Khí Huyết Nghịch Chuyển làm gián đoạn bế quan!</span>
                      </div>
                    ) : (
                      <div className="text-[9px] text-zinc-500 font-sans">
                        Thế hiện tại an toàn 100%, không bắt buộc mang bùa.
                      </div>
                    )}
                  </div>

                  {/* 4. HỘ ĐẠO TRẬN VỊ (CỬ ĐẠO LỮ & LINH THÚ HỘ PHÁP) */}
                  <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-serif">
                      <span className="text-zinc-200 font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3 text-amber-400" /> 🛡️ Hộ Đạo Trận Vị (Đạo Lữ & Linh Thú):
                      </span>
                      <span className="text-[8.5px] text-zinc-500 font-mono">
                        (Cứu viện hiểm cảnh & Cùng tăng trưởng)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {/* Ô 1: Đạo Lữ Hộ Pháp */}
                      <div className="p-1.5 rounded bg-[#0d0e14] border border-zinc-700/80 space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-serif">
                          <span className="text-rose-300 font-bold flex items-center gap-1">
                            🌸 Đạo Lữ Hộ Pháp
                          </span>
                          <span className="text-[8px] px-1 rounded font-mono bg-rose-950/60 border border-rose-800/50 text-rose-300">
                            [🌸 Đồng Hành]
                          </span>
                        </div>
                        <select
                          value={meditation.selectedCompanionId || ''}
                          onChange={e => meditation.setSelectedCompanionId(e.target.value || null)}
                          className="w-full bg-black/60 border border-zinc-700 rounded px-1.5 py-1 text-[9.5px] text-zinc-300 focus:outline-none focus:border-rose-500"
                        >
                          <option value="">-- Không cử Đạo Lữ --</option>
                          {meditation.availableCompanions.map(c => (
                            <option key={c.id} value={c.id}>
                              🌸 {c.name} ({c.element} • Hảo Cảm: {c.affinity})
                            </option>
                          ))}
                        </select>
                        {meditation.selectedCompanionDef ? (
                          <div className="text-[8.5px] text-zinc-400 leading-tight">
                            {meditation.selectedCompanionDef.name} ({meditation.selectedCompanionDef.element}): Cứu viện $\ge$85%, hưởng 30% tu vi & +Hảo Cảm.
                          </div>
                        ) : (
                          <div className="text-[8.5px] text-zinc-500 italic">
                            Chưa chọn Đạo Lữ đi cùng
                          </div>
                        )}
                      </div>

                      {/* Ô 2: Linh Thú Hộ Pháp */}
                      <div className="p-1.5 rounded bg-[#0d0e14] border border-zinc-700/80 space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-serif">
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            🐾 Linh Thú Hộ Vệ
                          </span>
                          <span className="text-[8px] px-1 rounded font-mono bg-amber-950/60 border border-amber-800/50 text-amber-300">
                            [🐾 Hộ Vệ]
                          </span>
                        </div>
                        <select
                          value={meditation.selectedBeastId || ''}
                          onChange={e => meditation.setSelectedBeastId(e.target.value || null)}
                          className="w-full bg-black/60 border border-zinc-700 rounded px-1.5 py-1 text-[9.5px] text-zinc-300 focus:outline-none focus:border-amber-500"
                        >
                          <option value="">-- Không cử Linh Thú --</option>
                          {meditation.availableBeasts.map(b => (
                            <option key={b.id} value={b.id}>
                              🐾 {b.name} ({b.element} • Cấp {b.level || 1} • Giai {b.tier || 1})
                            </option>
                          ))}
                        </select>
                        {meditation.selectedBeastObj ? (
                          <div className="text-[8.5px] text-zinc-400 leading-tight">
                            {meditation.selectedBeastObj.name} ({meditation.selectedBeastObj.element}): Cứu viện $\ge$75%, nhận Thú EXP & tinh luyện huyết mạch.
                          </div>
                        ) : (
                          <div className="text-[8.5px] text-zinc-500 italic">
                            Chưa chọn Linh Thú đi cùng
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gợi ý cộng hưởng nguyên tố */}
                    {meditation.elementalResonance?.hasResonance && (
                      <div className="p-1.5 rounded bg-amber-950/40 border border-amber-500/60 text-[9px] text-amber-300 font-serif flex items-center gap-1.5 animate-pulse">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>⚡ {meditation.elementalResonance.description}</span>
                      </div>
                    )}
                  </div>

                  {/* DÒNG CỘNG HƯỞNG ĐẠO LỮ & TÔNG MÔN */}
                  {(resonance.companionText || resonance.sectText || resonance.tamThanText || resonance.tamTinhText) && (
                    <div className="pt-1 border-t border-zinc-800/40 flex flex-wrap gap-1 text-[9px] font-mono">
                      {resonance.companionText && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-950/30 border border-rose-800/30 text-rose-300/90 flex items-center gap-1">
                          {resonance.companionText}
                        </span>
                      )}
                      {resonance.sectText && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-950/30 border border-blue-800/30 text-blue-300/90 flex items-center gap-1">
                          {resonance.sectText}
                        </span>
                      )}
                      {resonance.tamThanText && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-950/30 border border-purple-800/30 text-purple-300/90 flex items-center gap-1">
                          {resonance.tamThanText}
                        </span>
                      )}
                      {resonance.tamTinhText && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950/30 border border-emerald-800/30 text-emerald-300/90 flex items-center gap-1">
                          {resonance.tamTinhText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* NÚT BẮT ĐẦU NHẬP ĐỊNH TRONG COCKPIT */}
                  <button
                    type="button"
                    onClick={() => meditation.handleStartMeditation()}
                    className="w-full mt-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-serif font-bold text-xs tracking-wider border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-200" />
                    <span>🧘 Khởi Thực Nhập Định (Tĩnh Tọa Hành Thiền)</span>
                  </button>
                </div>
              )
            )}

            {/* FALLBACK CHẾ ĐỘ 2 CŨ NẾU KHÔNG CÓ MEDITATION HOOK */}
            {cultivateMode === 'realtime' && !meditation && (
              <div className="mt-1.5 space-y-1">
                {/* 3 Nút chọn thế bế quan */}
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-serif text-zinc-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Phương Hướng Tu Hành:
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono italic">
                    {curStanceCfg.badge}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  {(['co_ban', 'hiem_canh', 'doat_bao'] as CultivateStance[]).map(stKey => {
                    const cfg = CULTIVATE_STANCES[stKey];
                    const isSelected = activeStance === stKey;
                    return (
                      <button
                        key={stKey}
                        type="button"
                        disabled={isCultivating}
                        onClick={() => updateStance(stKey)}
                        className={`py-1 px-1 rounded-md border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? cfg.activeClass
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {stKey === 'co_ban' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                          {stKey === 'hiem_canh' && <Flame className="w-3 h-3 text-purple-400" />}
                          {stKey === 'doat_bao' && <Sparkles className="w-3 h-3 text-amber-400" />}
                          <span className="text-[10px] font-serif font-bold leading-none">
                            {stKey === 'co_ban' ? 'Cố Bản' : stKey === 'hiem_canh' ? 'Hiểm Cảnh' : 'Đoạt Bảo'}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono opacity-80 scale-95">
                          {stKey === 'co_ban' ? 'An toàn 100%' : stKey === 'hiem_canh' ? '+50% Tu Vi' : 'x2.5 Dị Bảo'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-[#0b0c12]/90 py-1 px-1.5 rounded border border-zinc-800/70 text-[9.5px] text-zinc-400 font-sans leading-snug">
                  <span className="text-zinc-200 font-semibold">{curStanceCfg.name}: </span>
                  {curStanceCfg.description}
                </div>

                {/* DÒNG CỘNG HƯỞNG ĐẠO LỮ & TÔNG MÔN */}
                {(resonance.companionText || resonance.sectText || resonance.tamThanText || resonance.tamTinhText) && (
                  <div className="mt-1 pt-1 border-t border-zinc-800/40 flex flex-wrap gap-1 text-[9px] font-mono">
                    {resonance.companionText && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-950/30 border border-rose-800/30 text-rose-300/90 flex items-center gap-1">
                        {resonance.companionText}
                      </span>
                    )}
                    {resonance.sectText && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-950/30 border border-blue-800/30 text-blue-300/90 flex items-center gap-1">
                        {resonance.sectText}
                      </span>
                    )}
                    {resonance.tamThanText && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-950/30 border border-purple-800/30 text-purple-300/90 flex items-center gap-1">
                        {resonance.tamThanText}
                      </span>
                    )}
                    {resonance.tamTinhText && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950/30 border border-emerald-800/30 text-emerald-300/90 flex items-center gap-1">
                        {resonance.tamTinhText}
                      </span>
                    )}
                  </div>
                )}

                {/* Chọn thời gian phút */}
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Thời gian nhập định:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {cultivateDuration < 60
                        ? `${cultivateDuration} phút`
                        : `${Math.floor(cultivateDuration / 60)} giờ ${cultivateDuration % 60 > 0 ? `${cultivateDuration % 60}p` : ''}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { mins: 15, label: '15p' },
                      { mins: 60, label: '1h' },
                      { mins: 240, label: '4h' },
                      { mins: 720, label: '12h' },
                      { mins: 1440, label: '24h' }
                    ].map(item => (
                      <button
                        key={item.mins}
                        type="button"
                        disabled={isCultivating}
                        onClick={() => setCultivateDuration(item.mins)}
                        className={`text-[9.5px] py-0.5 rounded border transition font-mono cursor-pointer text-center ${
                          cultivateDuration === item.mins
                            ? 'bg-amber-600/40 border-amber-500 text-amber-200 shadow-sm font-bold'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-0.5">
                    <input
                      type="range"
                      min={1}
                      max={1440}
                      step={1}
                      value={cultivateDuration}
                      onChange={e => setCultivateDuration(Number(e.target.value))}
                      disabled={isCultivating}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[8.5px] text-zinc-500 font-mono">
                      <span>1 phút</span>
                      <span>12 giờ</span>
                      <span>24 giờ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NÚT THỰC THI BẾ QUAN TƯƠNG ỨNG THEO CHẾ ĐỘ */}
          {isCultivating ? (
            <div className="w-full mt-1.5 p-2 rounded-lg bg-zinc-950/90 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-between gap-2.5">
              <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-2 ${stanceTheme.spinRing} animate-spin`} />
                <div className="absolute inset-1 rounded-full border border-amber-500/30 animate-ping opacity-30" />
                <Zap className="w-3 h-3 text-amber-300 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[10.5px] font-serif font-bold text-amber-300 mb-0.5">
                  <span>{cultivateMode === 'deep' ? 'Tuế Nguyệt Vô Tình... Đang Bế Quan' : 'Đang Thổ Nạp Thiên Địa...'}</span>
                  <span className="font-mono text-[11px] animate-pulse">
                    {cultivateMode === 'deep' ? `${deepAmount} ${deepUnit === 'days' ? 'Ngày' : deepUnit === 'months' ? 'Tháng' : 'Năm'}` : 'Nhập Định'}
                  </span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-purple-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] w-full" />
                </div>
              </div>
            </div>
          ) : cultivateMode === 'deep' ? (
            deepEstimate.isLifespanExceeded ? (
              <button
                type="button"
                onClick={() => {
                  if (openRebornModal) openRebornModal();
                }}
                className="w-full mt-1.5 py-2 px-3 rounded-lg font-serif font-bold text-xs tracking-wider border border-red-500/80 bg-gradient-to-r from-red-950 via-rose-900 to-purple-950 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse hover:brightness-125 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Hourglass className="w-3.5 h-3.5 text-red-200" />
                <span>⚠️ Nguy Cơ Tọa Hóa • Nhấp Để Tọa Hóa Luân Hồi</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (handleDeepCultivate) {
                    handleDeepCultivate(safeDeepAmount, deepUnit);
                  }
                }}
                disabled={isCultivating || !deepEstimate.canAfford}
                className={`w-full mt-1.5 py-2 px-3 rounded-lg font-serif font-bold text-xs tracking-wider border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  !deepEstimate.canAfford
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                }`}
              >
                <Hourglass className="w-3.5 h-3.5 text-amber-200" />
                <span>
                  {!deepEstimate.canAfford
                    ? '❌ Thiếu Linh Thạch / Tích Cốc Đan'
                    : `Bắt Đầu Tuế Nguyệt Bế Quan (${safeDeepAmount} ${deepUnit === 'days' ? 'Ngày' : deepUnit === 'months' ? 'Tháng' : 'Năm'})`}
                </span>
              </button>
            )
          ) : (
            <button
              onClick={() => {
                if (meditation) {
                  if (meditation.isMeditating) {
                    meditation.handleClaimMeditationRewards();
                  } else {
                    meditation.handleStartMeditation();
                  }
                } else {
                  handleCultivate(activeStance);
                }
              }}
              disabled={isCultivating}
              className={`w-full mt-1.5 py-2 px-3 rounded-lg ${
                meditation?.isMeditating
                  ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] border-amber-400'
                  : `bg-gradient-to-r ${stanceTheme.glowBtn} text-white`
              } font-serif font-bold text-xs tracking-wider border transition cursor-pointer flex items-center justify-center gap-1.5`}
            >
              {meditation?.isMeditating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-black animate-spin" />
                  <span>✨ Thu Hoạch Thành Quả & Mở Sớ Kỳ Ngộ</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-200" />
                  <span>{meditation ? '🧘 Bắt Đầu Nhập Định (Tĩnh Tọa Hành Thiền)' : 'Bắt Đầu Nhập Định Tu Luyện'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Panel 2: Đột Phá Cảnh Giới */}
        <div id="breakthrough-panel" className="cophong-card cophong-corner p-2.5 sm:p-3 rounded-xl space-y-2 flex flex-col justify-between transition-all duration-500">
          <div>
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-1.5">
              <h3 className="text-sm font-serif font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" /> ĐỘT PHÁ CẢNH GIỚI
              </h3>
              {targetNextRealm?.requirements.thienKiep && (
                <span className="text-[10px] text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-800/40 animate-pulse">
                  ⚡ Thiên Kiếp
                </span>
              )}
            </div>

            {targetNextRealm ? (
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 text-[11px]">Mục tiêu:</span>
                  <span className="font-serif font-bold text-amber-300 text-xs">
                    {targetNextRealm.emoji} {targetNextRealm.name}
                  </span>
                </div>

                <div className="bg-[#0e0e14] p-1.5 rounded border border-amber-900/20 space-y-0.5 text-[10.5px] font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Yêu cầu Tu vi:</span>
                    <span className={player.tuVi >= tuViReq ? 'text-emerald-400 font-semibold' : 'text-red-400'}>
                      {player.tuVi.toLocaleString()}/{tuViReq.toLocaleString()}
                      {(player.ngoTinh || 0) >= 80 && (
                        <span className="ml-1 text-[10px] text-sky-400 font-serif font-bold">(-15%)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-1">
                    <span className="text-zinc-400">Yêu cầu Linh thạch:</span>
                    <span className={`text-right ${player.linhThach >= targetNextRealm.requirements.linhThach ? 'text-emerald-400 font-semibold' : 'text-red-400 font-medium'}`}>
                      {player.linhThach.toLocaleString()} Hạ Phẩm / {targetNextRealm.requirements.linhThach.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* BANNER ĐỈNH PHONG ĐẠI CẢNH GIỚI • NGƯNG TỤ ĐẠO CƠ */}
                {isMajorTransition && (
                  <div
                    onClick={openTranscendenceModal}
                    className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-purple-950/80 via-amber-950/70 to-purple-950/80 border border-amber-400/80 hover:border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)] cursor-pointer transition-all duration-300 group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl group-hover:scale-110 transition shrink-0 animate-bounce">🌌</span>
                      <div className="min-w-0">
                        <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5 truncate">
                          <span>Đại Đạo Quan Đầu • Ngưng Tụ Đạo Cơ</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                            Đại Cảnh Giới
                          </span>
                        </div>
                        <div className="text-[10px] text-purple-200/90 font-serif truncate mt-0.5">
                          {activeTransition?.transitionName || 'Đỉnh phong cảnh giới • Lựa chọn phẩm vị Đạo Cơ để trùng kích!'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTranscendenceModal();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-serif font-bold text-[10.5px] shadow-[0_0_10px_rgba(251,191,36,0.5)] group-hover:brightness-110 transition shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Chọn Đạo Cơ</span>
                      <ChevronRight className="w-3 h-3 text-stone-950" />
                    </button>
                  </div>
                )}

                {/* BÀN KHẢM NẠP HỘ MỆNH & BẢNG DỰ TOÁN THIÊN CƠ */}
                <BreakthroughCatalystAltar
                  player={player}
                  setPlayer={setPlayer}
                  onExecuteFallback={handleBreakthrough}
                  isBreakingThrough={isBreakingThrough}
                  onBreakthroughSuccess={onBreakthroughSuccess}
                  openEnhancedSeclusionModal={openEnhancedSeclusionModal}
                  onSwitchToDeepCultivation={() => {
                    setCultivateMode('deep');
                    scrollToElementWithHighlight('cultivate-panel');
                  }}
                  className="mt-2"
                  isMajorTransition={isMajorTransition}
                  onMajorBreakthroughClick={openTranscendenceModal}
                />
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-amber-300 font-serif">
                Đã đạt tới Cực Cảnh Thiên Đạo (Đế Tổ)!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Nhiệm Vụ Chính Tuyến Thu Nhỏ */}
      {activeStorylineQuest && (
        <div
          onClick={() => openStorylineModal?.(activeStorylineQuest.id)}
          className="px-3 py-1.5 rounded-lg border border-amber-600/40 bg-gradient-to-r from-[#17141f] via-[#1c1824] to-[#14121a] hover:border-amber-500/70 transition-all cursor-pointer shadow-[0_0_12px_rgba(217,119,6,0.15)] flex items-center justify-between gap-2 shrink-0 group"
          title="Bấm để mở Cuộn Tranh Cốt Truyện"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-amber-950/80 border border-amber-600/50 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition shadow-sm">
              <Scroll className="w-3 h-3 text-amber-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-serif font-bold text-amber-400">
                  📜 Chính Tuyến:
                </span>
                <span className="text-[11px] font-serif font-semibold text-zinc-200 group-hover:text-amber-200 transition truncate">
                  {activeStorylineQuest.title}
                </span>
              </div>
              <p className="text-[9.5px] font-mono text-zinc-400 truncate">
                {storylineProgress?.progressText || activeStorylineQuest.objectives.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {storylineProgress?.isCompleted ? (
              <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 animate-pulse">
                Sẵn Sàng Nhận
              </span>
            ) : (
              <span className="text-[9.5px] font-mono text-amber-400/90 hidden sm:inline">
                {storylineProgress ? `${storylineProgress.progressPercent}%` : ''}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openStorylineModal?.(activeStorylineQuest.id);
              }}
              className="text-[9.5px] font-serif px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300 hover:bg-amber-900/60 hover:text-amber-100 transition cursor-pointer flex items-center gap-0.5"
            >
              <span>Xem</span>
              <ChevronRight className="w-2.5 h-2.5 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* Khung Nhật Ký Tu Tiên */}
      <div className="cophong-card cophong-corner p-2.5 sm:p-3 rounded-xl flex-1 min-h-[360px] flex flex-col">
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-1.5 mb-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <Scroll className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs sm:text-sm font-serif font-bold text-amber-300 tracking-wide">
              NHẬT KÝ TU TIÊN
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-mono">
              {logs.length} sự kiện
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer font-serif"
              title="Xóa nhật ký"
            >
              Xóa
            </button>
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="flex-1 overflow-y-auto pr-1 space-y-1.5 text-xs font-mono select-text min-h-0 custom-scrollbar"
        >
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-500 italic text-xs font-serif">
              Linh đài thanh tịnh, chưa có biến cố nào phát sinh...
            </div>
          ) : (
            logs.map(item => {
              let badgeColor = 'text-zinc-400 border-zinc-800 bg-zinc-900/60';
              let titleColor = 'text-zinc-300';
              let borderLeft = 'border-l-2 border-zinc-700';

              if (item.type === 'cultivate') {
                badgeColor = 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30';
                titleColor = 'text-emerald-300 font-medium';
                borderLeft = 'border-l-2 border-emerald-500/60';
              } else if (item.type === 'breakthrough') {
                badgeColor = 'text-amber-300 border-amber-600/50 bg-amber-950/40';
                titleColor = 'text-amber-300 font-bold';
                borderLeft = 'border-l-2 border-amber-400';
              } else if (item.type === 'battle') {
                badgeColor = 'text-rose-400 border-rose-800/40 bg-rose-950/30';
                titleColor = 'text-rose-300 font-medium';
                borderLeft = 'border-l-2 border-rose-500/70';
              } else if (item.type === 'danger') {
                badgeColor = 'text-red-400 border-red-700/50 bg-red-950/40 animate-pulse';
                titleColor = 'text-red-400 font-bold';
                borderLeft = 'border-l-2 border-red-500';
              } else if (item.type === 'event') {
                badgeColor = 'text-purple-300 border-purple-800/40 bg-purple-950/30';
                titleColor = 'text-purple-300 font-medium';
                borderLeft = 'border-l-2 border-purple-500/60';
              } else if (item.type === 'alchemy') {
                badgeColor = 'text-yellow-400 border-yellow-800/40 bg-yellow-950/30';
                titleColor = 'text-yellow-300 font-medium';
                borderLeft = 'border-l-2 border-yellow-500/60';
              } else if (item.type === 'forging') {
                badgeColor = 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30';
                titleColor = 'text-cyan-300 font-medium';
                borderLeft = 'border-l-2 border-cyan-500/60';
              } else if (item.type === 'manual') {
                badgeColor = 'text-blue-400 border-blue-800/40 bg-blue-950/30';
                titleColor = 'text-blue-300 font-medium';
                borderLeft = 'border-l-2 border-blue-500/60';
              } else if (item.type === 'companion') {
                badgeColor = 'text-rose-300 border-rose-600/40 bg-rose-950/40';
                titleColor = 'text-rose-300 font-bold';
                borderLeft = 'border-l-2 border-rose-400';
              }

              return (
                <div
                  key={item.id}
                  className={`p-2 rounded bg-[#0d0d13]/80 border border-zinc-800/60 ${borderLeft} transition-all`}
                >
                  <div className="flex items-center justify-between text-[9.5px] mb-0.5">
                    <span className={`px-1.5 py-0.2 rounded border font-sans text-[8.5px] ${badgeColor}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-zinc-500 font-mono text-[9.5px]">{item.timestamp}</span>
                  </div>
                  <h4 className={`text-[10.5px] ${titleColor} mb-0.5 font-serif`}>
                    {item.title}
                  </h4>
                  <p className="text-[10.5px] text-zinc-300/90 whitespace-pre-line leading-snug font-sans">
                    {item.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL POP-UP: CHIẾN LỢI PHẨM BẾ QUAN THỔ NẠP */}
      {/* ======================================================== */}
      {activeSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="cophong-card cophong-corner w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-amber-600/50 bg-[#0d0e14] shadow-[0_0_50px_rgba(217,119,6,0.25)] overflow-hidden">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-amber-900/40 flex items-center justify-between bg-gradient-to-r from-amber-950/30 via-zinc-900/50 to-amber-950/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40">
                  <Gift className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-300 flex items-center gap-2">
                    CHIẾN LỢI PHẨM BẾ QUAN
                    <span className="text-[10px] px-2 py-0.5 rounded font-sans font-normal border border-amber-500/40 bg-amber-950/40 text-amber-300">
                      {CULTIVATE_STANCES[activeSummary.stance]?.name || 'Ổn Định Cố Bản'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Bế quan đại chu thiên viên mãn ({activeSummary.duration} phút)
                  </p>
                </div>
              </div>
              <button
                onClick={closeSummaryModal}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar flex-1">
              {/* Thống kê tài nguyên chính nhận được */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-600/30 flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-serif">Tu Vi Đắc Được</span>
                  <span className="text-sm font-mono font-bold text-emerald-300 mt-0.5">
                    +{activeSummary.tuViGain.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-600/30 flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-serif">Hạ Phẩm Linh Thạch</span>
                  <span className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                    +{activeSummary.linhThachGain.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-600/30 flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-serif">Trung Phẩm Linh Thạch</span>
                  <span className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                    +{activeSummary.trungPhamLinhThachGain.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-600/30 flex flex-col">
                  <span className="text-[10px] text-zinc-400 font-serif">Kỳ Duyên Kích Hoạt</span>
                  <span className="text-sm font-mono font-bold text-purple-300 mt-0.5">
                    {activeSummary.events.length} Biến Cố
                  </span>
                </div>
              </div>

              {/* Phần thưởng phụ đặc biệt (Ngộ tính, Khí vận, Tôi thể, Tinh huyết) */}
              {(activeSummary.tinhHuyetGain > 0 || activeSummary.ngoTinhGain > 0 || activeSummary.khiVanGain > 0 || activeSummary.bodyExpGain > 0) && (
                <div className="p-2.5 rounded-xl bg-amber-950/15 border border-amber-700/30 flex flex-wrap gap-2 text-xs font-mono">
                  {activeSummary.tinhHuyetGain > 0 && (
                    <span className="px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 font-bold">
                      🩸 +{activeSummary.tinhHuyetGain} Tinh Huyết Yêu Thú
                    </span>
                  )}
                  {activeSummary.ngoTinhGain > 0 && (
                    <span className="px-2 py-1 rounded bg-blue-950/40 border border-blue-800/40 text-blue-300 font-bold">
                      🧠 +{activeSummary.ngoTinhGain} Ngộ Tính Thiên Phú
                    </span>
                  )}
                  {activeSummary.khiVanGain > 0 && (
                    <span className="px-2 py-1 rounded bg-yellow-950/40 border border-yellow-800/40 text-yellow-300 font-bold">
                      🌟 +{activeSummary.khiVanGain} Khí Vận Tiên Thiên
                    </span>
                  )}
                  {activeSummary.bodyExpGain > 0 && (
                    <span className="px-2 py-1 rounded bg-red-950/40 border border-red-800/40 text-red-300 font-bold">
                      🔥 +{activeSummary.bodyExpGain.toLocaleString()} Tôi Thể Exp
                    </span>
                  )}
                </div>
              )}

              {/* Cảnh báo Tâm Ma Phản Phệ nếu có */}
              {activeSummary.tamMaTriggered && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-700/50 text-xs text-red-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-serif text-red-200">Tâm Ma Phản Phệ: </span>
                    Linh lực cuồng bạo xung kích kinh mạch, đạo hữu bị tổn hao{' '}
                    {activeSummary.hpLoss > 0
                      ? `${activeSummary.hpLoss.toLocaleString()} Khí Huyết (HP)`
                      : `${activeSummary.mpLoss.toLocaleString()} Chân Nguyên (MP)`}!
                  </div>
                </div>
              )}

              {/* Danh sách Kỳ Duyên Bế Quan đã phát sinh */}
              {activeSummary.events && activeSummary.events.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> KỲ DUYÊN ĐỘNG PHỦ GẶP ĐƯỢC ({activeSummary.events.length})
                  </h4>
                  <div className="space-y-1.5">
                    {activeSummary.events.map((evt, idx) => {
                      let tagBg = 'bg-amber-950/40 border-amber-800/40 text-amber-300';
                      if (evt.category === 'tam_ma') tagBg = 'bg-red-950/40 border-red-800/40 text-red-300';
                      if (evt.category === 'bien_co') tagBg = 'bg-blue-950/40 border-blue-800/40 text-blue-300';

                      return (
                        <div
                          key={evt.id || idx}
                          className="p-2.5 rounded-lg bg-[#07080c] border border-zinc-800/80 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-zinc-200">
                              {idx + 1}. {evt.title}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${tagBg}`}>
                              {evt.category === 'dai_phu' ? 'ĐẠI PHÚ' : evt.category === 'bien_co' ? 'BIẾN CỐ' : 'TÂM MA'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                            {evt.description}
                          </p>
                          {evt.rewardSummary && (
                            <div className="text-[10px] text-amber-300 font-mono font-semibold pt-0.5">
                              🎁 {evt.rewardSummary}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Danh sách toàn bộ Dược Liệu, Khoáng Thạch, Đan Dược nhặt được */}
              {activeSummary.drops && activeSummary.drops.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-serif font-bold text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" /> BẢO VẬT THU THẬP VÀO TÚI ĐỒ ({activeSummary.drops.length})
                    </span>
                    {activeSummary.bagFull && (
                      <span className="text-[10px] text-red-400 font-mono font-normal">
                        ⚠️ Túi đầy: Một số đồ bị rơi
                      </span>
                    )}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {activeSummary.drops.map((drop, idx) => {
                      let typeIcon = <Gift className="w-3.5 h-3.5 text-zinc-400" />;
                      if (drop.type === 'herb') typeIcon = <Sprout className="w-3.5 h-3.5 text-emerald-400" />;
                      if (drop.type === 'ore') typeIcon = <Gem className="w-3.5 h-3.5 text-cyan-400" />;
                      if (drop.type === 'pill') typeIcon = <Award className="w-3.5 h-3.5 text-yellow-400" />;
                      if (drop.type === 'manual') typeIcon = <Scroll className="w-3.5 h-3.5 text-blue-400" />;
                      if (drop.type === 'tinhHuyet') typeIcon = <Heart className="w-3.5 h-3.5 text-rose-400" />;
                      if (drop.type === 'linhThach') typeIcon = <Gem className="w-3.5 h-3.5 text-amber-400" />;
                      if (drop.type === 'trungPhamLinhThach') typeIcon = <Sparkles className="w-3.5 h-3.5 text-cyan-300" />;

                      return (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-[#07080c] border border-zinc-800/80 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="p-1 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                              {typeIcon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-serif font-bold text-zinc-200 truncate">
                                {drop.name}
                              </div>
                              <div className="text-[9px] text-zinc-500 font-mono">
                                Phẩm cấp: {drop.quality}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                            x{drop.quantity.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-amber-900/40 bg-zinc-950/60 flex items-center justify-end">
              <button
                onClick={closeSummaryModal}
                className="py-2 px-5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-serif font-bold text-xs tracking-wider border border-amber-500/40 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Thu Vào Túi Trữ Vật & Tiếp Tục</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ĐẠI ĐẠO QUAN ĐẦU • NGƯNG TỤ ĐẠO CƠ               */}
      {/* ======================================================== */}
      <MajorBreakthroughModal
        isOpen={isTranscendenceModalOpen}
        onClose={closeTranscendenceModal}
        player={player}
        activeTransition={activeTransition}
        selectedGrade={selectedGrade}
        onSelectGrade={handleSelectGrade}
        onExecute={() => {
          handleExecuteMajorBreakthrough(player, setPlayer, onBreakthroughSuccess);
        }}
        isExecuting={isFoundationExecuting}
        validationMap={validationMap}
      />

      {/* ======================================================== */}
      {/* MODAL: DỊ TƯỢNG THIÊN ĐỊA • VINH DANH THIÊN ĐẠO ĐẠO CƠ  */}
      {/* ======================================================== */}
      <HeavenPhenomenonModal
        isOpen={isCinematicOpen}
        onClose={closeCinematic}
        data={cinematicData}
        realmName={targetNextRealm?.name}
      />
    </section>
  );
};
