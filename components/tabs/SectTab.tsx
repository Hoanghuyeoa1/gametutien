import React, { useState } from 'react';
import {
  Landmark,
  Award,
  Crown,
  Sparkles,
  RefreshCw,
  Shield,
  Sprout,
  Swords,
  Coins,
  Flame,
  Gift,
  ShoppingBag,
  Zap,
  ChevronRight,
  AlertTriangle,
  Heart,
  CheckCircle2,
  XCircle,
  Scroll,
  TrendingUp,
  Skull,
  Feather,
  Lock,
  Filter,
  Mountain,
  Crosshair,
  ShieldCheck,
  Layers,
  CircleDot,
  Compass
} from 'lucide-react';
import {
  PlayerStats,
  SectId,
  SectRank,
  SectShopItem,
  SectArenaFighter,
  SectTier,
  SectData,
  SectSubTab,
  SpiritVein,
  SectGuardianArray,
  FormationItem
} from '@/lib/types';
import {
  SECT_LIST,
  SECT_DATA_MAP,
  SECT_PROFILES,
  SECT_SHOP_ITEMS,
  getSectShopItems,
  SECT_RANKS_CONFIG,
  getRankTitle,
  checkCanPromoteSectRank,
  canClaimDailySalary,
  getSectArenaFighters,
  SECT_ARRAY_LEVELS_CONFIG,
  getSectVeinsForTier,
  getSectVeinById
} from '@/lib/sect-data';
import { CustomSectTab } from './CustomSectTab';
import { useCustomSectActions } from '@/hooks/useCustomSectActions';
import type { useDiscipleAppointmentActions } from '@/hooks/useDiscipleAppointmentActions';
import type { useSectWarActions } from '@/hooks/useSectWarActions';
import {
  checkSectJoinRequirements,
  getTierBadgeStyle,
  getSpecialtyDisplay,
  getRealmNameByIndex,
  getLinhCanGradeName,
  getLinhCanGradeValue,
  getOccupiedVeinsBuffs,
  VeinCombatResult
} from '@/lib/sect-logic';
import { ELEMENT_ICONS, ELEMENT_NAMES } from '@/lib/elemental-system';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu';

export interface SectTabProps {
  player: PlayerStats;
  sectSubTab: SectSubTab;
  setSectSubTab: (tab: SectSubTab) => void;
  hasUnclaimedQuest: boolean;
  handleJoinSect: (sectId: SectId) => void;
  handleLeaveSect: () => void;
  handleResetQuests: () => void;
  handleClaimQuestReward: (questId: string) => void;
  handleDoPatrolQuest: (questId: string) => void;
  handleDonateLinhThachQuest: (questId: string) => void;
  handleDonateHerbsQuest: (questId: string) => void;
  handleDonateOresQuest?: (questId: string) => void;
  handleClaimDailySalary: () => void;
  handlePromoteRank: () => void;
  handleFightArena: (opponent: SectArenaFighter) => { victory: boolean; logs: string[] };
  setActiveTab: (tab: TabType) => void;
  handleBuySectShopItem: (item: SectShopItem) => void;
  handleDonateToArray?: (type: 'linhThach' | 'contribution' | 'formation', amountOrItemId: number | string) => void;
  handleAttackVein?: (veinId: string) => void;
  handleClaimVeinStipend?: () => void;
  handleReinforceVein?: (veinId: string) => void;
  activeVeinBattle?: (VeinCombatResult & { veinId: string; veinName: string }) | null;
  handleCloseVeinBattleModal?: () => void;
  isFightingVein?: boolean;
  customSectActions?: ReturnType<typeof useCustomSectActions>;
  appointmentActions?: ReturnType<typeof useDiscipleAppointmentActions>;
  sectWarActions?: ReturnType<typeof useSectWarActions>;
}

export const SectTab: React.FC<SectTabProps> = ({
  player,
  sectSubTab,
  setSectSubTab,
  hasUnclaimedQuest,
  handleJoinSect,
  handleLeaveSect,
  handleResetQuests,
  handleClaimQuestReward,
  handleDoPatrolQuest,
  handleDonateLinhThachQuest,
  handleDonateHerbsQuest,
  handleDonateOresQuest,
  handleClaimDailySalary,
  handlePromoteRank,
  handleFightArena,
  setActiveTab,
  handleBuySectShopItem,
  handleDonateToArray,
  handleAttackVein,
  handleClaimVeinStipend,
  handleReinforceVein,
  activeVeinBattle,
  handleCloseVeinBattleModal,
  isFightingVein,
  customSectActions,
  appointmentActions,
  sectWarActions
}) => {
  // Chuyển đổi giữa Nhị Thập Tông Môn và Tông Môn Tự Lập
  const [sectMode, setSectMode] = useState<'twenty_sects' | 'my_sect'>('twenty_sects');

  // State for arena battle modal
  const [selectedOpponent, setSelectedOpponent] = useState<SectArenaFighter | null>(null);
  const [battleResult, setBattleResult] = useState<{ victory: boolean; logs: string[] } | null>(null);
  const [isFighting, setIsFighting] = useState<boolean>(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<boolean>(false);

  // State lọc Tier môn phái khi chưa gia nhập
  const [selectedTier, setSelectedTier] = useState<'all' | SectTier>('all');

  // Active sect profile
  const currentSectId = (player.sectState?.sectId || player.sect || null) as SectId | null;
  const profile = currentSectId ? (SECT_DATA_MAP[currentSectId] || SECT_PROFILES[currentSectId]) : null;
  const currentRank = player.sectState?.rank || player.sectRank || 'tap_dich';
  const rankTitle = getRankTitle(currentSectId, currentRank);
  const rankConfig = SECT_RANKS_CONFIG[currentRank] || SECT_RANKS_CONFIG.tap_dich;
  const isElderOrMaster = currentRank === 'truong_lao' || currentRank === 'chuong_mon';

  // Promotion check
  const promotionInfo = checkCanPromoteSectRank(player);

  // Daily Salary check
  const salaryInfo = canClaimDailySalary(player.sectState);

  // Arena fighters list
  const arenaFighters = getSectArenaFighters(currentSectId);
  const playerArenaRank = player.sectState?.arenaRank ?? 5;
  const arenaTitle = player.sectState?.arenaTitle;

  // Veins & Guardian Array calculations
  const currentTier: SectTier = (profile?.tier as SectTier) || 1;
  const currentVeins = getSectVeinsForTier(currentTier, player.sectState);
  const occupiedVeinBuffs = getOccupiedVeinsBuffs(player);
  const occupiedCount = occupiedVeinBuffs.occupiedCount;
  const guardianArray: SectGuardianArray = (player.sectState || player.sectData)?.guardianArray || {
    level: 1,
    exp: 0,
    maxExp: 2000,
    arrayName: 'Cửu Cung Bát Quái Trận',
    buffs: { damageReduction: 2, combatStartShieldHp: 500, tribulationInjuryReduction: 0 }
  };
  const arrayConfig = SECT_ARRAY_LEVELS_CONFIG[guardianArray.level] || SECT_ARRAY_LEVELS_CONFIG[1];
  const nextArrayConfig = guardianArray.level < 10 ? SECT_ARRAY_LEVELS_CONFIG[guardianArray.level + 1] : null;
  const formationsInBag = (player.inventory?.formations || []) as FormationItem[];

  // Vein stipend claim check
  const lastVeinClaim = player.sectState?.lastVeinClaimAt || 0;
  const canClaimVeinStipend = occupiedVeinBuffs.dailyLinhThachStipend > 0 && (Date.now() - lastVeinClaim >= 24 * 60 * 60 * 1000);

  const getArrayTheme = (lvl: number) => {
    if (lvl >= 8) {
      return {
        badge: 'text-purple-300 bg-purple-950/70 border-purple-500/70 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
        border: 'border-purple-600/50 shadow-[0_0_25px_rgba(168,85,247,0.25)]',
        gradient: 'from-purple-950/40 via-fuchsia-950/30 to-[#0e0e15]',
        ringColor: 'border-purple-400/60 shadow-[0_0_20px_rgba(192,132,252,0.5)]',
        glowText: 'text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]',
        progressBar: 'from-purple-600 to-fuchsia-500'
      };
    }
    if (lvl >= 4) {
      return {
        badge: 'text-amber-300 bg-amber-950/70 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        border: 'border-amber-600/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        gradient: 'from-amber-950/40 via-yellow-950/30 to-[#0e0e15]',
        ringColor: 'border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.5)]',
        glowText: 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]',
        progressBar: 'from-amber-500 to-yellow-400'
      };
    }
    return {
      badge: 'text-cyan-300 bg-cyan-950/70 border-cyan-500/70 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
      border: 'border-cyan-600/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      gradient: 'from-cyan-950/40 via-blue-950/30 to-[#0e0e15]',
      ringColor: 'border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.5)]',
      glowText: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]',
      progressBar: 'from-cyan-500 to-blue-400'
    };
  };

  const onStartDuel = (fighter: SectArenaFighter) => {
    setSelectedOpponent(fighter);
    setIsFighting(true);
    setBattleResult(null);

    setTimeout(() => {
      const res = handleFightArena(fighter);
      setBattleResult(res);
      setIsFighting(false);
    }, 600);
  };

  const filteredSects = selectedTier === 'all'
    ? SECT_LIST
    : SECT_LIST.filter(s => s.tier === selectedTier);

  return (
    <div className="space-y-4">
      {/* THANH CHUYỂN ĐỔI CHẾ ĐỘ MÔN PHÁI: NHỊ THẬP TÔNG MÔN VS TÔNG MÔN TỰ LẬP */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-black/60 border border-zinc-800">
        <button
          type="button"
          onClick={() => setSectMode('twenty_sects')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            sectMode === 'twenty_sects'
              ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5 text-indigo-400" />
          <span>Nhị Thập Tông Môn (Thiên Hạ)</span>
        </button>

        <button
          type="button"
          onClick={() => setSectMode('my_sect')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            sectMode === 'my_sect'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {player.customSectState?.isFounded
              ? `【${player.customSectState.sectName}】(Tự Lập)`
              : '🚩 Khai Tông Lập Phái'}
          </span>
          {player.customSectState?.isFounded && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* HIỂN THỊ PHÂN HỆ TƯƠNG ỨNG */}
      {sectMode === 'my_sect' && customSectActions ? (
        <CustomSectTab
          player={player}
          sectActions={customSectActions}
          appointmentActions={appointmentActions}
          sectWarActions={sectWarActions}
        />
      ) : !currentSectId ? (
        /* GIAO DIỆN BÁI NHẬP MÔN PHÁI (TÁN TU TỰ DO - 20 TÔNG MÔN 5 TIER) */
        <div className="space-y-3">
          {/* Banner giới thiệu */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-cyan-950/40 rounded-xl border border-amber-500/30 text-center space-y-1 shadow-md">
            <div className="text-sm font-serif font-bold text-amber-200 flex items-center justify-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>BÁT HOANG NHỊ THẬP ĐẠI TÔNG MÔN</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-serif italic">
              Đạo hữu hiện là <strong className="text-amber-300">Tán Tu Tự Do</strong>. Đại đạo tam thiên, 20 đại tông môn phân chia theo 5 bậc Tier. Càng lên cao, sơn môn đòi hỏi Cảnh Giới Khí Tu, Căn Cốt và Phẩm Cấp Linh Căn khắt khe để bái nhập!
            </p>
          </div>

          {/* Thanh Lọc Tier (Tier Filter Tabs) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-serif">
            {[
              { key: 'all' as const, label: 'Tất Cả', count: SECT_LIST.length },
              { key: 1 as const, label: '⭐ Tier 1', count: 4 },
              { key: 2 as const, label: '⭐⭐ Tier 2', count: 4 },
              { key: 3 as const, label: '⭐⭐⭐ Tier 3', count: 4 },
              { key: 4 as const, label: '⭐⭐⭐⭐ Tier 4', count: 4 },
              { key: 5 as const, label: '👑 Tier 5 Thánh Địa', count: 4 }
            ].map(tab => {
              const isActive = selectedTier === tab.key;
              return (
                <button
                  key={String(tab.key)}
                  onClick={() => setSelectedTier(tab.key)}
                  className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-900/60 to-yellow-900/60 border-amber-500/70 text-amber-200 font-bold shadow-sm'
                      : 'bg-[#0e0e15] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded-full ${isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-zinc-800 text-zinc-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Danh sách thẻ môn phái theo Filter */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredSects.map((sect) => {
              const checkResult = checkSectJoinRequirements(player, sect);
              const tierStyle = getTierBadgeStyle(sect.tier);
              const specialtyInfo = getSpecialtyDisplay(sect.specialty);

              const reqRealmName = getRealmNameByIndex(sect.requirements.minRealmIndex);
              const isRealmMet = (player.currentRealm ?? 0) >= sect.requirements.minRealmIndex;

              const isCanCotMet = (player.canCot ?? 0) >= sect.requirements.minCanCot;

              const reqGradeName = sect.requirements.minLinhCanGrade
                ? getLinhCanGradeName(sect.requirements.minLinhCanGrade)
                : 'Tạp Linh Căn';
              const isGradeMet = !sect.requirements.minLinhCanGrade ||
                (getLinhCanGradeValue(player.linhCan?.grade) >= getLinhCanGradeValue(sect.requirements.minLinhCanGrade));
              const playerGradeName = player.linhCan?.grade || 'Tạp Linh Căn';

              return (
                <div
                  key={sect.id}
                  className={`p-3.5 rounded-xl bg-gradient-to-b ${tierStyle.cardBg} border ${tierStyle.borderClass} space-y-2.5 transition-all shadow-md ${tierStyle.glowClass}`}
                >
                  {/* Header thẻ môn phái */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sect.icon}</span>
                      <div>
                        <div className="font-serif font-bold text-sm flex items-center gap-1.5 flex-wrap">
                          <span className={sect.color || 'text-amber-200'}>{sect.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${tierStyle.badgeClass}`}>
                            {sect.tierName}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${specialtyInfo.tagClass}`}>
                            {specialtyInfo.icon} {sect.specialtyName}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-serif mt-0.5">
                          Tông Chủ: <strong className="text-zinc-200">{sect.leader}</strong> • Phe: <span className="text-amber-300">{sect.faction === 'chinh_dao' ? 'Chính Đạo' : sect.faction === 'ma_dao' ? 'Ma Đạo' : sect.faction === 'kiem_phai' ? 'Kiếm Tông' : 'Trung Lập'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tôn chỉ môn phái */}
                  <p className="text-[11px] text-zinc-300 italic font-serif leading-relaxed bg-black/40 p-2 rounded border border-white/5">
                    "{sect.tagline}"
                  </p>

                  {/* Mô tả */}
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    {sect.description}
                  </p>

                  {/* Đặc tính trấn phái */}
                  <div className="bg-black/50 p-2.5 rounded-lg border border-white/10 text-[10px] space-y-1">
                    <div className="text-amber-300 font-serif font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Đặc Tính Trấn Phái:
                    </div>
                    <div className="text-emerald-300 font-mono leading-relaxed">{sect.specialBuff}</div>
                  </div>

                  {/* Khối Yêu Cầu Bái Sư (Entry Requirements Checklist) */}
                  <div className="bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1.5 text-[11px] font-sans">
                    <div className="text-zinc-400 font-serif text-[10px] uppercase tracking-wider flex items-center gap-1 font-medium">
                      <Shield className="w-3 h-3 text-amber-400" />
                      <span>Tiêu Chuẩn Bái Sư Khảo Hạch:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] font-mono">
                      {/* Cảnh Giới */}
                      <div className={`p-1.5 rounded border flex items-center gap-1.5 ${
                        isRealmMet
                          ? 'bg-emerald-950/30 border-emerald-700/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}>
                        {isRealmMet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className="truncate" title={`Yêu cầu: ${reqRealmName}`}>
                          Cảnh giới: <strong>{reqRealmName}</strong>
                        </span>
                      </div>

                      {/* Căn Cốt */}
                      <div className={`p-1.5 rounded border flex items-center gap-1.5 ${
                        isCanCotMet
                          ? 'bg-emerald-950/30 border-emerald-700/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}>
                        {isCanCotMet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className="truncate">
                          Căn Cốt: <strong>{player.canCot ?? 0}/{sect.requirements.minCanCot}</strong>
                        </span>
                      </div>

                      {/* Phẩm cấp Linh Căn */}
                      <div className={`p-1.5 rounded border flex items-center gap-1.5 ${
                        isGradeMet
                          ? 'bg-emerald-950/30 border-emerald-700/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}>
                        {isGradeMet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className="truncate" title={`Yêu cầu: ${reqGradeName} (Hiện có: ${playerGradeName})`}>
                          Linh Căn: <strong>{reqGradeName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nút Hành Động */}
                  {checkResult.canJoin ? (
                    <button
                      onClick={() => handleJoinSect(sect.id as SectId)}
                      className="w-full py-2.5 rounded-lg font-serif font-bold text-xs transition cursor-pointer border shadow-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:brightness-110 text-stone-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:shadow-[0_0_18px_rgba(245,158,11,0.5)] active:scale-[0.99]"
                    >
                      <Zap className="w-4 h-4 fill-stone-950 text-stone-950" />
                      <span>⚡ Bái Nhập {sect.name}</span>
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <button
                        disabled
                        className="w-full py-2 rounded-lg font-serif font-bold text-xs bg-zinc-900/60 text-zinc-500 border border-zinc-800/70 cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>🔒 Tư Chất Chưa Đạt ({checkResult.missingReasons.length} tiêu chuẩn còn thiếu)</span>
                      </button>
                      <p className="text-[10px] text-rose-400/90 italic font-mono text-center">
                        ⚠️ {checkResult.missingReasons[0]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GIAO DIỆN ĐÃ GIA NHẬP TÔNG MÔN */
        <div className="space-y-3">
          {/* Sub-tabs điều hướng 6 phân khu Tông Môn */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 rounded-lg bg-[#0e0e15] p-1 border border-indigo-900/30 text-xs">
            <button
              onClick={() => setSectSubTab('overview')}
              className={`py-1.5 px-1.5 rounded text-center cursor-pointer transition font-serif truncate ${
                sectSubTab === 'overview'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📜 Đại Điện
            </button>
            <button
              onClick={() => setSectSubTab('quests')}
              className={`py-1.5 px-1.5 rounded text-center cursor-pointer transition font-serif relative truncate ${
                sectSubTab === 'quests'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📋 Nhiệm Vụ
              {hasUnclaimedQuest && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setSectSubTab('arena')}
              className={`py-1.5 px-1.5 rounded text-center cursor-pointer transition font-serif relative truncate ${
                sectSubTab === 'arena'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ⚔️ Luận Kiếm
              {arenaTitle && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-2" />
              )}
            </button>
            <button
              onClick={() => setSectSubTab('veins')}
              className={`py-1.5 px-1.5 rounded text-center cursor-pointer transition font-serif relative truncate ${
                sectSubTab === 'veins'
                  ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/50 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🏔️ Linh Mạch
              {occupiedCount > 0 && (
                <span className="ml-1 text-[10px] text-emerald-400 font-bold">({occupiedCount})</span>
              )}
            </button>
            <button
              onClick={() => setSectSubTab('array')}
              className={`py-1.5 px-1.5 rounded text-center cursor-pointer transition font-serif truncate ${
                sectSubTab === 'array'
                  ? 'bg-amber-950/60 text-amber-200 border border-amber-500/50 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🛡️ Hộ Sơn Trận
            </button>
            <button
              onClick={() => setSectSubTab('shop')}
              className={`py-1.5 px-1.5 rounded text-center cursor-pointer transition font-serif truncate ${
                sectSubTab === 'shop'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🏪 Tàng Kinh Các
            </button>
          </div>

          {/* SUB-TAB 1: ĐẠI ĐIỆN TÔNG MÔN (OVERVIEW & PROMOTION & SALARY) */}
          {sectSubTab === 'overview' && profile && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {/* Banner Tông Môn */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#14121e] via-[#1a1727] to-[#14121e] border border-indigo-500/40 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{profile.icon}</span>
                    <div>
                      <h3 className="font-serif font-bold text-amber-200 text-sm flex items-center gap-1.5 flex-wrap">
                        <span>{profile.name}</span>
                        {profile.tier && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${getTierBadgeStyle(profile.tier).badgeClass}`}>
                            {profile.tierName || `Tier ${profile.tier}`}
                          </span>
                        )}
                        {profile.specialty && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${getSpecialtyDisplay(profile.specialty).tagClass}`}>
                            {getSpecialtyDisplay(profile.specialty).icon} {profile.specialtyName}
                          </span>
                        )}
                        {profile.shortName && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${profile.badgeClass || ''}`}>
                            {profile.shortName}
                          </span>
                        )}
                      </h3>
                      <div className="text-[10px] text-zinc-400 font-serif mt-0.5">
                        Tông Chủ: <strong className="text-zinc-200">{profile.leader}</strong> • Phe: <span className="text-amber-300">{profile.faction === 'chinh_dao' ? 'Chính Đạo' : profile.faction === 'ma_dao' ? 'Ma Đạo' : 'Kiếm Tông'}</span>
                      </div>
                    </div>
                  </div>

                  {isElderOrMaster && (
                    <span className="text-[9px] font-serif uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/50 text-amber-300 animate-pulse">
                      Hào Quang Trấn Phái
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-zinc-300 italic font-serif leading-relaxed border-t border-indigo-950/60 pt-1.5">
                  "{profile.tagline}"
                </p>

                {arenaTitle && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-600/30 font-serif">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tôn hiệu Luận Kiếm: <strong>{arenaTitle}</strong> (Top 1)</span>
                  </div>
                )}
              </div>

              {/* KHỐI 1: ĐỊA VỊ & LÃNH THƯỞNG BỔNG LỘC HẰNG NGÀY */}
              <div className="p-3 rounded-xl bg-[#0e0e15] border border-amber-900/30 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-serif flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Thân Phận Hiện Tại:
                  </span>
                  <span className={`font-serif font-bold text-xs px-2.5 py-0.5 rounded border ${
                    isElderOrMaster
                      ? 'text-amber-200 bg-gradient-to-r from-amber-950/70 to-yellow-950/70 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      : 'text-amber-300 bg-amber-950/50 border-amber-700/40'
                  }`}>
                    {rankTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#12121c] p-2.5 rounded border border-indigo-900/30">
                    <div className="text-[10px] text-zinc-400 font-sans flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-400" /> Bổng Lộc Hằng Ngày
                    </div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      +{(rankConfig.salary ?? rankConfig.dailySalary?.linhThach ?? 150).toLocaleString()} LT / ngày
                    </div>
                  </div>
                  <div className="bg-[#12121c] p-2.5 rounded border border-indigo-900/30">
                    <div className="text-[10px] text-zinc-400 font-sans flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-400" /> Điểm Cống Hiến
                    </div>
                    <div className="text-sm font-bold text-emerald-300 mt-0.5">
                      {(player.sectState?.contribution ?? 0).toLocaleString()} CH
                    </div>
                  </div>
                </div>

                {/* NÚT LÃNH THƯỞNG BỔNG LỘC */}
                <div className="pt-1">
                  <button
                    onClick={handleClaimDailySalary}
                    disabled={!salaryInfo.canClaim}
                    className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      salaryInfo.canClaim
                        ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white animate-pulse border border-amber-400/50'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <Gift className="w-4 h-4 text-amber-300" />
                    <span>
                      {salaryInfo.canClaim
                        ? `Lãnh Thưởng Bổng Lộc (+${(rankConfig.salary ?? rankConfig.dailySalary?.linhThach ?? 150).toLocaleString()} Linh Thạch)`
                        : `Đã Lãnh Bổng Lộc Hôm Nay (Hồi sau ${Math.ceil(salaryInfo.timeRemainingMs / (1000 * 60 * 60))} giờ)`}
                    </span>
                  </button>
                </div>
              </div>

              {/* KHỐI 2: THĂNG TIẾN BẬC THANG ĐỊA VỊ */}
              <div className="p-3 rounded-xl bg-[#0e0e15] border border-amber-900/30 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-serif font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Bậc Thang Địa Vị Môn Phái:
                  </span>
                  {promotionInfo.nextRankDetail && (
                    <span className="text-[10px] text-indigo-300 font-mono">
                      Mục tiêu: [{promotionInfo.nextRankDetail.title}]
                    </span>
                  )}
                </div>

                {promotionInfo.nextRankDetail ? (
                  <div className="space-y-2 text-[11px]">
                    <div className="bg-[#12121c] p-2.5 rounded-lg border border-indigo-900/30 space-y-1.5">
                      <div className="flex justify-between text-zinc-400">
                        <span>Điều kiện Cảnh Giới:</span>
                        <span className={`font-mono ${promotionInfo.missingRealm === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {promotionInfo.missingRealm === 0 ? '✓ Đạt' : `Yêu cầu [${promotionInfo.nextRankDetail.realmName}]`}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Cống Hiến Tích Lũy:</span>
                        <span className="font-mono text-amber-300">
                          {(player.sectState?.totalContribution || 0).toLocaleString()} / {promotionInfo.nextRankDetail.requiredContribution.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.floor(((player.sectState?.totalContribution || 0) / promotionInfo.nextRankDetail.requiredContribution) * 100))}%`
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handlePromoteRank}
                      disabled={!promotionInfo.canPromote}
                      className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                        promotionInfo.canPromote
                          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white animate-bounce border border-emerald-400/50'
                          : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>
                        {promotionInfo.canPromote
                          ? `Thăng Phong [${promotionInfo.nextRankDetail.title}]`
                          : promotionInfo.reason}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs font-serif text-amber-400 bg-amber-950/20 rounded border border-amber-900/30">
                    👑 Đạo hữu đã đạt tới vị thế Chưởng Môn tối cao của tông môn!
                  </div>
                )}
              </div>

              {/* KHỐI 3: ĐẶC TÍNH & HÀO QUANG TRẤN PHÁI */}
              <div className="p-3 rounded-xl bg-[#0e0e15] border border-amber-900/30 space-y-1.5">
                <div className="text-xs font-serif font-bold text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> ĐẶC TÍNH TRẤN PHÁI ĐANG HƯỞNG:
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-emerald-950/60 text-[11px] font-mono text-emerald-300 leading-relaxed">
                  {profile.specialBuff}
                </div>
                {isElderOrMaster && (
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-600/40 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Hào Quang Trấn Phái: Toàn thuộc tính chiến đấu tăng +{currentRank === 'chuong_mon' ? '20%' : '10%'}!</span>
                  </div>
                )}
              </div>

              {/* KHỐI 4: PHẢN XUẤT TÔNG MÔN */}
              <div className="pt-2 border-t border-zinc-800/60">
                {!showLeaveConfirm ? (
                  <button
                    onClick={() => setShowLeaveConfirm(true)}
                    className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-700/50 text-xs font-serif transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Phản Xuất Tông Môn (Rời Phái)</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-600/50 space-y-2">
                    <div className="text-xs text-rose-300 font-serif font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>CẢNH BÁO PHẢN XUẤT MÔN QUY</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Phản xuất tông môn sẽ bị môn quy trừng phạt: <strong className="text-rose-400">Mất toàn bộ Điểm Cống Hiến</strong> và <strong className="text-rose-400">Giảm 200 Điểm Danh Vọng</strong>. Các công pháp và đan phương đã học vẫn được giữ nguyên. Đạo hữu chắc chắn muốn phản xuất?
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          handleLeaveSect();
                          setShowLeaveConfirm(false);
                        }}
                        className="flex-1 py-1.5 rounded bg-rose-800 hover:bg-rose-700 text-white font-serif font-bold text-xs cursor-pointer border border-rose-500/50 transition"
                      >
                        Quyết Định Phản Xuất
                      </button>
                      <button
                        onClick={() => setShowLeaveConfirm(false)}
                        className="flex-1 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs cursor-pointer border border-zinc-700 transition"
                      >
                        Hủy Bỏ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: BẢNG NHIỆM VỤ HẰNG NGÀY (DAILY QUESTS) */}
          {sectSubTab === 'quests' && player.sectState?.dailyQuests && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1 text-xs text-zinc-400">
                <span className="font-serif">Bảng Nhiệm Vụ Tông Môn Hằng Ngày:</span>
                <button
                  onClick={handleResetQuests}
                  className="text-[11px] text-indigo-300 hover:text-indigo-200 underline flex items-center gap-1 cursor-pointer font-serif"
                  title="Làm mới lại toàn bộ nhiệm vụ"
                >
                  <RefreshCw className="w-3 h-3" /> Làm Mới Bảng Nhiệm Vụ
                </button>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {player.sectState.dailyQuests.map((quest) => {
                  const isDone = quest.isCompleted;
                  const isClaimed = quest.isClaimed;

                  return (
                    <div
                      key={quest.id}
                      className={`p-3 rounded-xl border transition space-y-2 ${
                        isClaimed
                          ? 'bg-[#0a0a0f] border-zinc-850 opacity-60'
                          : isDone
                          ? 'bg-gradient-to-r from-[#121815] to-[#0e1411] border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : 'bg-[#0e0e15] border-zinc-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-serif font-bold text-xs text-amber-200 flex items-center gap-1.5">
                            {quest.category === 'patrol' && <Shield className="w-3.5 h-3.5 text-blue-400" />}
                            {quest.category === 'garden' && <Sprout className="w-3.5 h-3.5 text-emerald-400" />}
                            {quest.category === 'battle' && <Swords className="w-3.5 h-3.5 text-rose-400" />}
                            {quest.category === 'donate' && <Coins className="w-3.5 h-3.5 text-amber-400" />}
                            {quest.category === 'alchemy' && <Flame className="w-3.5 h-3.5 text-yellow-400" />}
                            <span>{quest.title}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{quest.description}</p>
                        </div>

                        <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                          +{quest.rewardContribution} CH
                        </span>
                      </div>

                      {/* Tiến trình & Phần thưởng */}
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-zinc-400 font-mono text-[9px]">
                          <span>Tiến độ: {quest.currentCount}/{quest.targetCount}</span>
                          <span>
                            Thưởng: +{quest.rewardLinhThach} LT {quest.rewardDanhVong ? `• +${quest.rewardDanhVong} Danh Vọng` : ''} {quest.rewardTuVi ? `• +${quest.rewardTuVi} Tu Vi` : ''}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isDone ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.floor((quest.currentCount / quest.targetCount) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Hành động nhiệm vụ */}
                      <div>
                        {isClaimed ? (
                          <div className="text-center py-1 text-[10px] text-zinc-500 font-serif font-medium bg-zinc-900/40 rounded">
                            ✓ Đã Hoàn Thành & Lãnh Thưởng
                          </div>
                        ) : isDone ? (
                          <button
                            onClick={() => handleClaimQuestReward(quest.id)}
                            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-emerald-700 to-teal-600 hover:brightness-110 text-emerald-100 font-serif font-bold text-xs transition cursor-pointer shadow-sm animate-pulse flex items-center justify-center gap-1"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>Nhận Thưởng Nhiệm Vụ</span>
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            {quest.category === 'patrol' && (
                              <button
                                onClick={() => handleDoPatrolQuest(quest.id)}
                                className="flex-1 py-1 rounded bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-700/50 text-[10px] font-serif transition cursor-pointer"
                              >
                                Tuần Tra Sơn Môn
                              </button>
                            )}
                            {quest.category === 'donate' && (
                              <button
                                onClick={() => handleDonateLinhThachQuest(quest.id)}
                                disabled={player.linhThach < quest.targetCount}
                                className="flex-1 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border border-amber-700/50 text-[10px] font-serif transition cursor-pointer disabled:opacity-40"
                              >
                                Quyên Góp {quest.targetCount} LT
                              </button>
                            )}
                            {quest.category === 'garden' && (
                              <button
                                onClick={() => handleDonateHerbsQuest(quest.id)}
                                className="flex-1 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 text-[10px] font-serif transition cursor-pointer"
                              >
                                Cống Nộp Linh Thảo ({player.inventory?.herbs?.reduce((acc, h) => acc + h.quantity, 0) || 0})
                              </button>
                            )}
                            {quest.type === 'donate_ore' && handleDonateOresQuest && (
                              <button
                                onClick={() => handleDonateOresQuest(quest.id)}
                                className="flex-1 py-1 rounded bg-orange-950/60 hover:bg-orange-900/60 text-orange-200 border border-orange-700/50 text-[10px] font-serif transition cursor-pointer"
                              >
                                Quyên Góp Khoáng Thạch ({player.inventory?.ores?.reduce((acc, o) => acc + o.quantity, 0) || 0})
                              </button>
                            )}
                            {quest.category === 'battle' && (
                              <button
                                onClick={() => setActiveTab('trials')}
                                className="flex-1 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-700/50 text-[10px] font-serif transition cursor-pointer"
                              >
                                Đến Thí Luyện Trảm Yêu →
                              </button>
                            )}
                            {quest.category === 'alchemy' && (
                              <button
                                onClick={() => setActiveTab('alchemy')}
                                className="flex-1 py-1 rounded bg-yellow-950/60 hover:bg-yellow-900/60 text-yellow-200 border border-yellow-700/50 text-[10px] font-serif transition cursor-pointer"
                              >
                                Đến Lò Luyện Đan →
                              </button>
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

          {/* SUB-TAB 3: TÀNG KINH CÁC (ĐỘC QUYỀN MÔN PHÁI) */}
          {sectSubTab === 'shop' && currentSectId && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-[#0e0e15] border border-amber-900/30 flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-serif">Điểm Cống Hiến Hiện Có:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {(player.sectState?.contribution ?? 0).toLocaleString()} CH
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {getSectShopItems(currentSectId).map((item: SectShopItem) => {
                  const rankOrder: SectRank[] = ['tap_dich', 'ngoai_mon', 'noi_mon', 'chan_truyen', 'truong_lao', 'chuong_mon'];
                  const userRankIdx = rankOrder.indexOf(currentRank);
                  const reqRankIdx = rankOrder.indexOf(item.requiredRank);
                  const isRankMet = userRankIdx >= reqRankIdx;
                  const reqTitle = SECT_RANKS_CONFIG[item.requiredRank]?.title || item.requiredRank;

                  const isAlreadyBought =
                    (item.type === 'dan_phuong' && item.recipeId && player.sectState?.unlockedRecipes?.includes(item.recipeId)) ||
                    (item.type === 'bi_tich' && item.manualId && ((player.manuals || []).some(m => m.id === item.manualId) || player.sectState?.unlockedManuals?.includes(item.manualId)));

                  const canAfford = (player.sectState?.contribution ?? 0) >= item.costContribution;

                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border space-y-2 bg-[#0e0e15] ${
                        isAlreadyBought
                          ? 'border-emerald-800/40 opacity-75'
                          : isRankMet && canAfford
                          ? 'border-indigo-500/40 hover:border-indigo-400/80 shadow-sm'
                          : 'border-zinc-800/60'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-serif font-bold text-xs text-amber-200 flex items-center gap-1.5">
                            {item.type === 'dan_phuong' && <Scroll className="w-3.5 h-3.5 text-amber-400" />}
                            {item.type === 'bi_tich' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                            {item.type === 'item' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
                            {item.type === 'seed' && <Sprout className="w-3.5 h-3.5 text-emerald-400" />}
                            <span>{item.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-mono">
                              {item.grade}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-amber-300">
                            {item.costContribution.toLocaleString()} CH
                          </div>
                          <div className="text-[9px] text-zinc-500 font-mono">
                            Yêu cầu: {reqTitle}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded bg-black/40 border border-zinc-800 text-[10px] font-mono text-emerald-300/90 leading-relaxed">
                        {item.effectSummary}
                      </div>

                      <div>
                        {isAlreadyBought ? (
                          <div className="text-center py-1.5 text-xs text-emerald-400 font-serif font-medium bg-emerald-950/30 rounded-lg border border-emerald-800/40 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã Lĩnh Hội / Đã Sở Hữu
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBuySectShopItem(item)}
                            disabled={!canAfford || !isRankMet}
                            className={`w-full py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 ${
                              canAfford && isRankMet
                                ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 hover:brightness-110 text-white cursor-pointer shadow-sm'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>
                              {!isRankMet
                                ? `Yêu cầu thân phận [${reqTitle}]`
                                : !canAfford
                                ? 'Điểm Cống Hiến Chưa Đủ'
                                : `Đổi (${item.costContribution.toLocaleString()} Cống Hiến)`}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 4: LUẬN KIẾM SƠN MÔN (ARENA RANKING) */}
          {sectSubTab === 'arena' && currentSectId && (
            <div className="space-y-3">
              {/* Header Luận Kiếm Đài */}
              <div className="p-3 bg-gradient-to-r from-amber-950/30 via-rose-950/20 to-purple-950/30 rounded-xl border border-amber-600/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-amber-400" />
                    <span>LUẬN KIẾM SƠN MÔN - ĐẠI HỘI ĐẤU PHÁP</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-serif mt-0.5">
                    Thứ hạng hiện tại: <strong className="text-amber-300 font-mono">Hạng {playerArenaRank}</strong>
                    {arenaTitle && (
                      <span className="text-amber-400 ml-1.5">({arenaTitle})</span>
                    )}
                  </div>
                </div>
                {arenaTitle ? (
                  <div className="px-2 py-1 rounded bg-amber-500/20 border border-amber-400/40 text-[10px] text-amber-300 font-serif font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Vô Địch Sơn Môn
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-500 font-mono">Top 5 Đệ Tử</span>
                )}
              </div>

              {/* Danh sách 5 Đệ tử thiên tài xếp từ Hạng 5 -> Hạng 1 */}
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {arenaFighters.map((fighter) => {
                  const fighterRank = fighter.rank ?? fighter.rankPosition;
                  const isCurrentRankFighter = playerArenaRank === fighterRank;
                  const isDefeated = playerArenaRank < fighterRank;
                  const isNextTarget = playerArenaRank >= fighterRank;

                  return (
                    <div
                      key={fighter.id}
                      className={`p-3 rounded-xl border transition space-y-2 relative overflow-hidden ${
                        fighterRank === 1
                          ? 'bg-gradient-to-r from-[#1c150c] via-[#261c10] to-[#1c150c] border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : isDefeated
                          ? 'bg-[#0d0e12] border-zinc-800/80 opacity-70'
                          : 'bg-[#101018] border-indigo-900/40 hover:border-indigo-700/60'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-xs ${
                            fighterRank === 1
                              ? 'bg-amber-500 text-black border border-amber-300'
                              : fighterRank === 2
                              ? 'bg-zinc-300 text-black border border-zinc-100'
                              : fighterRank === 3
                              ? 'bg-amber-800 text-amber-200 border border-amber-600'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}>
                            {fighterRank === 1 ? <Crown className="w-4 h-4 text-black" /> : `#${fighterRank}`}
                          </div>

                          <div>
                            <div className="font-serif font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                              <span>{fighter.name}</span>
                              <span className="text-[10px] text-amber-300 font-mono font-normal">
                                ({fighter.realm})
                              </span>
                              <span className="text-[10px]" title={`Hệ ${ELEMENT_NAMES[fighter.element]}`}>
                                {ELEMENT_ICONS[fighter.element]}
                              </span>
                              {fighter.khiVan && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-600/40 text-amber-300 font-mono flex items-center gap-0.5" title="Khí Vận Thiên Kiêu">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                  <span>Khí Vận: {fighter.khiVan}</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-serif mt-0.5">
                              {fighter.title} • Tuyệt Kỹ: <span className="text-indigo-300">[{fighter.skillName}]</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-amber-300 font-mono font-bold">
                            +{fighter.rewards.contribution.toLocaleString()} CH
                          </div>
                          <div className="text-[9px] text-zinc-400 font-mono">
                            +{fighter.rewards.linhThach.toLocaleString()} LT
                          </div>
                        </div>
                      </div>

                      {/* Thuộc tính cơ bản */}
                      <div className="grid grid-cols-4 gap-1 text-[10px] font-mono bg-black/40 p-1.5 rounded border border-white/5 text-center text-zinc-300">
                        <div>Khí Huyết: <span className="text-rose-400">{fighter.stats.maxHp.toLocaleString()}</span></div>
                        <div>Công Kích: <span className="text-amber-400">{fighter.stats.atk.toLocaleString()}</span></div>
                        <div>Phòng Ngự: <span className="text-blue-400">{fighter.stats.def.toLocaleString()}</span></div>
                        <div>Tốc Độ: <span className="text-emerald-400">{fighter.stats.speed.toLocaleString()}</span></div>
                      </div>

                      {/* Nút Khiêu Chiến */}
                      <div>
                        <button
                          onClick={() => onStartDuel(fighter)}
                          className={`w-full py-1.5 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                            fighterRank === 1
                              ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white border border-amber-400/60'
                              : 'bg-gradient-to-r from-rose-800 to-red-800 hover:brightness-110 text-white border border-rose-600/50'
                          }`}
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>
                            {fighterRank === 1
                              ? `Khiêu Chiến Thủ Tịch (Tranh Đoạt "Đệ Nhất Thiên Kiêu")`
                              : `Khiêu Chiến ${fighter.name}`}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 5: TRANH ĐOẠT LINH MẠCH THÁI CỔ */}
          {sectSubTab === 'veins' && currentSectId && (
            <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              {/* Header Thống Kê & Buff Tổng Hợp */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-[#0d1613] to-teal-950/40 border border-emerald-600/40 space-y-3 shadow-lg relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏔️</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-emerald-200 text-sm">
                          Tranh Đoạt Linh Mạch Thái Cổ
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-900/60 border border-emerald-500/50 text-emerald-300">
                          Tier {currentTier}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-serif">
                        Cạnh tranh quyền kiểm soát 3 Đại Linh Mạch cùng các môn phái đồng giai
                      </p>
                    </div>
                  </div>

                  {/* Badge số lượng kiểm soát */}
                  <div className="flex items-center gap-2">
                    <div className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${
                      occupiedCount > 0
                        ? 'bg-emerald-900/70 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-900/80 border-zinc-700 text-zinc-400'
                    }`}>
                      Kiểm Soát: <span className="text-amber-300">{occupiedCount}</span>/3 Mạch
                    </div>

                    {/* Nút Lãnh Bổng Lộc */}
                    {handleClaimVeinStipend && (
                      <button
                        onClick={handleClaimVeinStipend}
                        disabled={occupiedVeinBuffs.dailyLinhThachStipend <= 0}
                        className={`px-3 py-1 rounded-lg font-serif font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          canClaimVeinStipend
                            ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:brightness-110 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                        }`}
                        title={canClaimVeinStipend ? 'Lãnh bổng lộc Linh Mạch hôm nay' : 'Chưa đến giờ hoặc chưa chiếm giữ linh mạch'}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Lãnh Bổng Lộc {occupiedVeinBuffs.dailyLinhThachStipend > 0 ? `(+${occupiedVeinBuffs.dailyLinhThachStipend.toLocaleString()} LT)` : ''}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Danh sách Buff Tổng Hợp đang kích hoạt */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-black/40 border border-cyan-800/40 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-zinc-400 font-serif">🌀 Tốc Độ Tu Vi</div>
                    <div className="text-xs font-mono font-bold text-cyan-300">
                      {occupiedVeinBuffs.tuViSpeedBonus > 0 ? `+${occupiedVeinBuffs.tuViSpeedBonus}%` : 'Chưa có'}
                    </div>
                  </div>
                  <div className="bg-black/40 border border-emerald-800/40 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-zinc-400 font-serif">🌿 Sinh Trưởng Dược Điền</div>
                    <div className="text-xs font-mono font-bold text-emerald-300">
                      {occupiedVeinBuffs.herbGrowthSpeedBonus > 0 ? `+${occupiedVeinBuffs.herbGrowthSpeedBonus}%` : 'Chưa có'}
                    </div>
                  </div>
                  <div className="bg-black/40 border border-amber-800/40 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-zinc-400 font-serif">⛏️ Sản Lượng Quặng</div>
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {occupiedVeinBuffs.oreYieldBonus > 0 ? `+${occupiedVeinBuffs.oreYieldBonus}%` : 'Chưa có'}
                    </div>
                  </div>
                  <div className="bg-black/40 border border-yellow-800/40 rounded-lg p-2 text-center">
                    <div className="text-[10px] text-zinc-400 font-serif">💰 Bổng Lộc Mỗi Ngày</div>
                    <div className="text-xs font-mono font-bold text-yellow-300">
                      +{occupiedVeinBuffs.dailyLinhThachStipend.toLocaleString()} LT
                    </div>
                  </div>
                </div>
              </div>

              {/* Lưới 3 Linh Mạch Của Tier Hiện Tại */}
              <div className="space-y-3">
                {currentVeins.map((vein) => {
                  const isPlayerSectOccupied = vein.occupiedSectId === currentSectId;
                  const occupierSect = vein.occupiedSectId
                    ? (SECT_DATA_MAP[vein.occupiedSectId] || SECT_PROFILES[vein.occupiedSectId])
                    : null;
                  const occupierName = isPlayerSectOccupied
                    ? (profile?.name || 'Bản Môn')
                    : (occupierSect?.name || 'Môn Phái Đối Thủ');

                  const veinIcon = vein.type === 'herb' ? '🌿' : vein.type === 'ore' ? '⛏️' : '🌀';
                  const typeLabel = vein.type === 'herb' ? 'Dược Mạch Thái Cổ' : vein.type === 'ore' ? 'Khoáng Mạch Thần Cấp' : 'Tụ Khí Linh Nhãn';

                  return (
                    <div
                      key={vein.id}
                      className={`p-3.5 rounded-xl border transition space-y-3 relative ${
                        isPlayerSectOccupied
                          ? 'bg-gradient-to-r from-[#0a1813] via-[#091510] to-[#0a1813] border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-gradient-to-r from-[#170e10] via-[#120a0d] to-[#170e10] border-rose-900/50 hover:border-rose-700/60'
                      }`}
                    >
                      {/* Tiêu đề mỏ & Trạng thái chiếm đóng */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 rounded-lg bg-black/50 border border-white/10">
                            {veinIcon}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-sm text-zinc-100">
                                {vein.name}
                              </h4>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-serif bg-zinc-800/80 border border-zinc-700 text-zinc-300">
                                {typeLabel}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono mt-0.5 flex items-center gap-2 text-zinc-400">
                              <span>Phòng ngự cứ điểm: <strong className="text-amber-300">{vein.defensePower.toLocaleString()}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Cờ tông môn chiếm đóng */}
                        <div>
                          {isPlayerSectOccupied ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-serif font-bold bg-emerald-950/80 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1">
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                              <span>{occupierName} (Đang Chiếm Giữ)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-serif font-bold bg-rose-950/80 border border-rose-600/70 text-rose-300 flex items-center gap-1">
                              <Swords className="w-3.5 h-3.5 text-rose-400" />
                              <span>{occupierName} đang chiếm đóng</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Khối Thủ Hộ Giả NPC */}
                      <div className="bg-black/50 rounded-xl p-2.5 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-base">👤</span>
                            <div>
                              <span className="font-serif font-bold text-zinc-200">{vein.guardianNpc.name}</span>
                              <span className="text-[10px] text-zinc-400 font-serif ml-1.5">({vein.guardianNpc.title})</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/50 text-indigo-300">
                            {getRealmNameByIndex(vein.guardianNpc.realmIndex)}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-[10px] font-mono bg-black/40 p-1.5 rounded border border-white/5 text-center text-zinc-300">
                          <div>HP: <span className="text-rose-400">{vein.guardianNpc.combatStats.maxHp.toLocaleString()}</span></div>
                          <div>Công: <span className="text-amber-400">{vein.guardianNpc.combatStats.atk.toLocaleString()}</span></div>
                          <div>Thủ: <span className="text-blue-400">{vein.guardianNpc.combatStats.def.toLocaleString()}</span></div>
                          <div>Tốc: <span className="text-emerald-400">{vein.guardianNpc.combatStats.speed}</span></div>
                        </div>
                      </div>

                      {/* Buff gia trì khi kiểm soát */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-serif bg-black/30 p-2 rounded-lg border border-white/5">
                        <div className="text-zinc-300">
                          Hiệu quả gia trì:
                          {vein.buffs.tuViSpeedBonus && <span className="text-cyan-300 font-bold ml-1.5">+{vein.buffs.tuViSpeedBonus}% Tốc độ Tu Vi</span>}
                          {vein.buffs.herbGrowthSpeedBonus && <span className="text-emerald-300 font-bold ml-1.5">+{vein.buffs.herbGrowthSpeedBonus}% Chín Dược Thảo</span>}
                          {vein.buffs.oreYieldBonus && <span className="text-amber-300 font-bold ml-1.5">+{vein.buffs.oreYieldBonus}% Sản Lượng Quặng</span>}
                          <span className="text-yellow-300 font-bold ml-2">+{vein.buffs.dailyLinhThachStipend.toLocaleString()} LT/ngày</span>
                        </div>

                        {/* Nút Hành Động */}
                        <div className="flex items-center gap-2">
                          {isPlayerSectOccupied ? (
                            handleReinforceVein && (
                              <button
                                onClick={() => handleReinforceVein(vein.id)}
                                className="px-3 py-1.5 rounded-lg font-serif font-bold text-xs bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-200 cursor-pointer shadow-sm transition flex items-center gap-1 active:scale-95"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Gia Cố Trận Địa (-200 LT, +100 Thủ)</span>
                              </button>
                            )
                          ) : (
                            handleAttackVein && (
                              <button
                                onClick={() => handleAttackVein(vein.id)}
                                disabled={isFightingVein}
                                className="px-4 py-1.5 rounded-lg font-serif font-bold text-xs bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 hover:brightness-110 text-white border border-rose-400/80 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)] transition flex items-center gap-1.5 active:scale-95 animate-pulse"
                              >
                                <Swords className="w-3.5 h-3.5" />
                                <span>{isFightingVein ? 'Đang Giao Chiến...' : '⚔️ Khai Chiến Đoạt Mạch'}</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 6: ĐẠI TRẬN HỘ SƠN (SECT GUARDIAN ARRAY) */}
          {sectSubTab === 'array' && currentSectId && (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {(() => {
                const theme = getArrayTheme(guardianArray.level);
                const expPct = Math.min(100, (guardianArray.exp / guardianArray.maxExp) * 100);

                return (
                  <>
                    {/* Bát Quái Trận Đồ Visual Box */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${theme.gradient} border ${theme.border} space-y-3 relative overflow-hidden text-center`}>
                      {/* Vòng xoay Bát Quái */}
                      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                        {/* Vòng ngoài xoay chậm */}
                        <div className={`absolute inset-0 rounded-full border-2 border-dashed ${theme.ringColor} animate-spin`} style={{ animationDuration: '24s' }} />
                        {/* Vòng giữa xoay ngược chiều */}
                        <div className={`absolute inset-2 rounded-full border border-dotted ${theme.ringColor} animate-spin`} style={{ animationDuration: '16s', animationDirection: 'reverse' }} />
                        {/* Biểu tượng trung tâm Bát Quái */}
                        <div className="z-10 text-center">
                          <span className="text-3xl block filter drop-shadow">☯️</span>
                          <span className={`text-[10px] font-mono font-bold ${theme.glowText} block mt-0.5`}>
                            Cấp {guardianArray.level}
                          </span>
                        </div>
                      </div>

                      {/* Tên Trận & Cấp Độ */}
                      <div>
                        <div className="flex items-center justify-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border ${theme.badge}`}>
                            Cấp {guardianArray.level}/10
                          </span>
                          <h3 className={`font-serif font-bold text-base ${theme.glowText}`}>
                            {guardianArray.arrayName}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-300 font-serif max-w-md mx-auto mt-1">
                          {arrayConfig.description}
                        </p>
                      </div>

                      {/* Thanh Tiến Trình EXP */}
                      <div className="max-w-md mx-auto space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                          <span>Tiến độ tu sửa đại trận:</span>
                          <span className="text-amber-300 font-bold">
                            {guardianArray.exp.toLocaleString()} / {guardianArray.maxExp.toLocaleString()} EXP ({expPct.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                          <div
                            className={`h-full bg-gradient-to-r ${theme.progressBar} rounded-full transition-all duration-500 shadow-sm`}
                            style={{ width: `${expPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Danh sách Buff Thụ Động Vĩnh Viễn */}
                    <div className="bg-[#12101b] border border-indigo-900/40 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-serif font-bold text-indigo-200 border-b border-indigo-950 pb-2">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <span>Gia Trì Thụ Động Đại Trận Hộ Thân (Có Hiệu Lực Toàn Bộ Gameplay)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Buff 1: Miễn thương */}
                        <div className="bg-black/40 border border-emerald-900/40 rounded-xl p-2.5 space-y-1">
                          <div className="text-[11px] text-zinc-400 font-serif flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Miễn Thương Combat</span>
                          </div>
                          <div className="text-base font-mono font-bold text-emerald-300">
                            +{guardianArray.buffs.damageReduction}%
                          </div>
                          {nextArrayConfig && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Cấp {guardianArray.level + 1}: +{nextArrayConfig.buffs.damageReduction}%
                            </div>
                          )}
                        </div>

                        {/* Buff 2: Khiên Turn 1 */}
                        <div className="bg-black/40 border border-cyan-900/40 rounded-xl p-2.5 space-y-1">
                          <div className="text-[11px] text-zinc-400 font-serif flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Hộ Thuẫn Turn 1</span>
                          </div>
                          <div className="text-base font-mono font-bold text-cyan-300">
                            +{guardianArray.buffs.combatStartShieldHp.toLocaleString()} HP
                          </div>
                          {nextArrayConfig && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Cấp {guardianArray.level + 1}: +{nextArrayConfig.buffs.combatStartShieldHp.toLocaleString()} HP
                            </div>
                          )}
                        </div>

                        {/* Buff 3: Giảm tổn thất độ kiếp */}
                        <div className="bg-black/40 border border-purple-900/40 rounded-xl p-2.5 space-y-1">
                          <div className="text-[11px] text-zinc-400 font-serif flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Giảm Tổn Thất Độ Kiếp</span>
                          </div>
                          <div className="text-base font-mono font-bold text-purple-300">
                            -{guardianArray.buffs.tribulationInjuryReduction}%
                          </div>
                          {nextArrayConfig && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              Cấp {guardianArray.level + 1}: -{nextArrayConfig.buffs.tribulationInjuryReduction}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Khung Đóng Góp Xây Dựng Đại Trận */}
                    <div className="bg-[#12101b] border border-amber-900/40 rounded-xl p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-950 pb-2">
                        <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-200">
                          <Flame className="w-4 h-4 text-amber-400" />
                          <span>Hiến Tế Tài Nguyên Gia Cố Đại Trận</span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-3">
                          <span>Linh Thạch: <strong className="text-amber-300">{(player.linhThach || 0).toLocaleString()}</strong></span>
                          <span>Cống Hiến: <strong className="text-indigo-300">{(player.sectState?.contribution || 0).toLocaleString()}</strong></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Option 1: Linh Thạch */}
                        <div className="bg-black/50 border border-white/5 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-300">
                              <Coins className="w-3.5 h-3.5" />
                              <span>Hiến Tế Linh Thạch</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-serif mt-1">
                              Tỷ lệ quy đổi: 100 Linh Thạch = +10 EXP trận đồ.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-2">
                            <button
                              onClick={() => handleDonateToArray && handleDonateToArray('linhThach', 500)}
                              disabled={(player.linhThach || 0) < 500}
                              className="py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 text-amber-200 font-mono text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              500 LT (+50 EXP)
                            </button>
                            <button
                              onClick={() => handleDonateToArray && handleDonateToArray('linhThach', 2000)}
                              disabled={(player.linhThach || 0) < 2000}
                              className="py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/60 text-amber-100 font-mono text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              2,000 LT (+200 EXP)
                            </button>
                          </div>
                        </div>

                        {/* Option 2: Cống Hiến */}
                        <div className="bg-black/50 border border-white/5 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-indigo-300">
                              <Award className="w-3.5 h-3.5" />
                              <span>Hiến Tế Cống Hiến</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-serif mt-1">
                              Tỷ lệ quy đổi: 50 Cống Hiến = +25 EXP trận đồ.
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-2">
                            <button
                              onClick={() => handleDonateToArray && handleDonateToArray('contribution', 100)}
                              disabled={(player.sectState?.contribution || 0) < 100}
                              className="py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-600/50 text-indigo-200 font-mono text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              100 CH (+50 EXP)
                            </button>
                            <button
                              onClick={() => handleDonateToArray && handleDonateToArray('contribution', 500)}
                              disabled={(player.sectState?.contribution || 0) < 500}
                              className="py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-500/60 text-indigo-100 font-mono text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              500 CH (+250 EXP)
                            </button>
                          </div>
                        </div>

                        {/* Option 3: Nung Chảy Trận Bàn */}
                        <div className="bg-black/50 border border-white/5 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-purple-300">
                              <Layers className="w-3.5 h-3.5" />
                              <span>Nung Chảy Trận Bàn</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-serif mt-1">
                              Trận Bàn chế tác từ Thần Binh Các mang lại lượng lớn EXP linh năng.
                            </p>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {formationsInBag.length === 0 ? (
                              <div className="text-[10px] text-zinc-500 font-mono text-center py-2 bg-black/30 rounded border border-white/5">
                                Túi đồ không có Trận Bàn
                              </div>
                            ) : (
                              <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                                {formationsInBag.slice(0, 3).map((formation) => {
                                  const tierVal = formation.tier || 1;
                                  const expGain = tierVal === 1 ? 200 : tierVal === 2 ? 600 : tierVal === 3 ? 1500 : tierVal === 4 ? 4000 : 10000;
                                  return (
                                    <div key={formation.id} className="flex items-center justify-between bg-black/40 p-1.5 rounded border border-white/5 text-[10px]">
                                      <div className="truncate max-w-[120px]">
                                        <span className="text-zinc-200 font-serif">{formation.name}</span>
                                        <span className="text-purple-400 font-mono ml-1">(+{expGain} EXP)</span>
                                      </div>
                                      <button
                                        onClick={() => handleDonateToArray && handleDonateToArray('formation', formation.id)}
                                        className="px-2 py-0.5 rounded bg-purple-950/70 hover:bg-purple-900 border border-purple-500/60 text-purple-200 font-mono font-bold cursor-pointer transition"
                                      >
                                        Nung Chảy
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* POPUP / MODAL CHIẾN ĐẤU LUẬN KIẾM ĐÀI */}
      {selectedOpponent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className="bg-[#12101a] border border-amber-600/60 rounded-2xl max-w-md w-full p-4 space-y-3 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-amber-900/40 pb-2">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-amber-200 text-sm">
                  Luận Kiếm Sơn Môn: {selectedOpponent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOpponent(null)}
                className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-0.5 rounded bg-zinc-800/80 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {isFighting ? (
              <div className="py-8 text-center space-y-3">
                <Swords className="w-10 h-10 text-amber-400 mx-auto animate-spin" />
                <p className="text-xs text-amber-300 font-serif italic animate-pulse">
                  Kiếm khí tung hoành! Đang giao phong cùng {selectedOpponent.name}...
                </p>
              </div>
            ) : battleResult ? (
              <div className="space-y-3">
                {/* Kết quả thắng / bại */}
                <div className={`p-3 rounded-xl border text-center space-y-1 ${
                  battleResult.victory
                    ? 'bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border-emerald-500/60 text-emerald-200'
                    : 'bg-gradient-to-r from-rose-950/60 to-red-950/60 border-rose-500/60 text-rose-200'
                }`}>
                  <div className="text-base font-serif font-bold flex items-center justify-center gap-1.5">
                    {battleResult.victory ? (
                      <>
                        <TrophyIcon className="w-5 h-5 text-amber-400" />
                        <span>ĐẠI THẮNG LUẬN KIẾM!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>THẤT BẠI TIẾC NUỐI!</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] font-mono">
                    {battleResult.victory
                      ? `Nhận +${selectedOpponent.rewards.contribution.toLocaleString()} Cống Hiến, +${selectedOpponent.rewards.linhThach.toLocaleString()} Linh Thạch!`
                      : 'Đạo hữu hãy tích lũy thêm tu vi và thần thông trước khi tái chiến!'}
                  </p>
                </div>

                {/* Nhật ký đấu pháp */}
                <div className="bg-black/60 rounded-xl p-3 border border-white/10 max-h-48 overflow-y-auto space-y-1 text-[11px] font-mono">
                  {battleResult.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes('CHIẾN THẮNG') || log.includes('BẠO KÍCH')
                          ? 'text-amber-300 font-bold'
                          : log.includes('THẤT BẠI')
                          ? 'text-rose-400'
                          : log.includes('áp chế')
                          ? 'text-emerald-300'
                          : 'text-zinc-300'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedOpponent(null)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-serif font-bold text-xs cursor-pointer shadow-md transition"
                >
                  Xác Nhận & Trở Về
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* POPUP / MODAL CHIẾN ĐẤU TRANH ĐOẠT LINH MẠCH */}
      {activeVeinBattle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-[#12101a] border border-emerald-600/60 rounded-2xl max-w-md w-full p-4 space-y-3 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-emerald-900/40 pb-2">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif font-bold text-emerald-200 text-sm">
                  Chiến Sự Linh Mạch: {activeVeinBattle.veinName}
                </h3>
              </div>
              {handleCloseVeinBattleModal && (
                <button
                  onClick={handleCloseVeinBattleModal}
                  className="text-zinc-400 hover:text-zinc-200 text-xs px-2 py-0.5 rounded bg-zinc-800/80 cursor-pointer"
                >
                  Đóng
                </button>
              )}
            </div>

            {/* Kết Quả */}
            <div className={`p-3 rounded-xl border text-center space-y-1 ${
              activeVeinBattle.victory
                ? 'bg-gradient-to-r from-emerald-950/70 via-[#0a1813] to-teal-950/70 border-emerald-500/60 text-emerald-200'
                : 'bg-gradient-to-r from-rose-950/70 to-red-950/70 border-rose-500/60 text-rose-200'
            }`}>
              <div className="text-base font-serif font-bold flex items-center justify-center gap-1.5">
                {activeVeinBattle.victory ? (
                  <>
                    <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
                    <span>ĐẠI THẮNG ĐOẠT MẠCH!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>THẤT BẠI BỊ ĐẨY LUI!</span>
                  </>
                )}
              </div>
              <p className="text-[11px] font-mono">
                {activeVeinBattle.victory
                  ? `Cứ điểm [${activeVeinBattle.veinName}] đã thuộc quyền kiểm soát của tông môn! Thưởng +${activeVeinBattle.rewards.contribution} Cống Hiến, +${activeVeinBattle.rewards.linhThach.toLocaleString()} Linh Thạch!`
                  : 'Thủ Hộ Giả cứ điểm thần uy hiển hách, ngươi bị đánh trọng thương thoái lui, nhận 30 phút điều dưỡng.'}
              </p>
            </div>

            {/* Nhật ký đấu pháp */}
            <div className="bg-black/60 rounded-xl p-3 border border-white/10 max-h-52 overflow-y-auto space-y-1 text-[11px] font-mono">
              {activeVeinBattle.logs.map((log, idx) => (
                <div
                  key={idx}
                  className={
                    log.includes('CHIẾN THẮNG') || log.includes('BẠO KÍCH')
                      ? 'text-amber-300 font-bold'
                      : log.includes('THẤT BẠI')
                      ? 'text-rose-400 font-bold'
                      : log.includes('Hộ Thuẫn')
                      ? 'text-cyan-300'
                      : log.includes('thân pháp') || log.includes('né tránh')
                      ? 'text-emerald-300'
                      : 'text-zinc-300'
                  }
                >
                  {log}
                </div>
              ))}
            </div>

            {handleCloseVeinBattleModal && (
              <button
                onClick={handleCloseVeinBattleModal}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 text-white font-serif font-bold text-xs cursor-pointer shadow-md transition"
              >
                Xác Nhận & Thu Quân
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
