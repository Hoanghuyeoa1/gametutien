'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Compass,
  BookOpen,
  Flame,
  Hammer,
  Landmark,
  Store,
  Backpack,
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import {
  PlayerStats,
  Realm,
  Boss,
  LogType,
  CultivateStance
} from '@/lib/types';
import realmsDataRaw from '@/data/realms-data.json';
import bossesDataRaw from '@/data/bosses-data.json';
import {
  calculateCombatPower,
  getMaxKhiHuyet,
  getMaxLinhLuc,
  calculateEffectiveRequiredTuVi
} from '@/lib/game-logic';
import { calculateCombatStats } from '@/lib/destiny-data';
import { calculateCultivationSpeed } from '@/lib/game-constants';
import { DAN_RECIPES, SECT_DAN_RECIPES } from '@/lib/alchemy-data';
import { getRealmBadge } from '@/lib/realm-icons';
import {
  getInventoryUsedSlots,
  getMaxInventoryCapacity,
  getCurrentInventoryOccupiedSlots
} from '@/lib/inventory-data';
import { COMPANIONS_DATA, createDefaultCompanionsState } from '@/lib/companions-data';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

// Custom Domain Hooks
import {
  useGameSave,
  useGardenTimer,
  useGameActions,
  useSecretRealmActions,
  useManualActions,
  useCraftingActions,
  useMerchantInventoryActions,
  useSectActions,
  useCompanionActions,
  useGardenActions,
  useCultivationActions,
  useTwinCultivationActions,
  useOfflineProgress,
  useSound,
  useAchievements,
  useStorylineActions,
  useAuctionActions,
  useAbodeActions,
  usePhysiqueActions,
  useSoulActions,
  useFormationActions,
  useTalismanActions,
  useTribulationActions,
  useForbiddenZoneActions,
  useReincarnationActions,
  useOffspringActions,
  useAncestralBlessingActions,
  useCustomSectActions,
  useTuViEmpowermentActions,
  useDiscipleAppointmentActions,
  useManualSynthesisActions,
  useSectWarActions,
  useMeditationActions
} from '@/hooks';


// Dashboard Structural Components
import { HeaderNav } from './dashboard/HeaderNav';
import { LeftColumn } from './dashboard/LeftColumn';
import { MiddleColumn } from './dashboard/MiddleColumn';

// 10 Tabs Tiên Hiệp
import { BattleTab } from './tabs/BattleTab';
import { SecretRealmTab } from './tabs/SecretRealmTab';
import { ManualsTab } from './tabs/ManualsTab';
import { AlchemyTab } from './tabs/AlchemyTab';
import { ForgingTab } from './tabs/ForgingTab';
import { SectTab } from './tabs/SectTab';
import { MerchantTab } from './tabs/MerchantTab';
import { InventoryTab } from './tabs/InventoryTab';
import { CompanionTab } from './tabs/CompanionTab';
import { BeastTab } from './tabs/BeastTab';
import { FormationTab } from './tabs/FormationTab';
import { TalismanTab } from './tabs/TalismanTab';

// Modals Độc Lập
import {
  CompanionGiftModal,
  PhysiqueRefineModal,
  SpiritualRootModal,
  DestinyModal,
  PlantSeedModal,
  GardenUpgradeModal,
  RebornModal,
  StoryEncounterModal,
  OfflineProgressModal,
  AchievementsModal,
  StorylineModal,
  AuctionModal,
  TribulationModal,
  ForbiddenZoneModal,
  SaveManagementModal,
  AncestralMemorialModal,
  MeridianCultivationModal,
  DualCultivationEventModal,
  EnhancedSeclusionModal,
  MeditationJournalModal
} from './modals';


import { AbodeHubModal } from './abode/AbodeHubModal';
import { PhysiqueModal } from './physique/PhysiqueModal';
import { SoulHubModal } from './soul/SoulHubModal';
import CosmicMapModal from './cosmic/CosmicMapModal';

const realmsData = realmsDataRaw as Realm[];
const bossesData = bossesDataRaw as unknown as Boss[];

export interface LogEntry {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  type: LogType;
}

export default function GameDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 12 Tabs chính ở Cột Phải (Tứ Đại Bách Nghệ: Đan + Khí + Trận + Phù)
  const [activeTab, setActiveTab] = useState<'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'formation' | 'talisman' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu' | 'beasts'>('trials');

  // Nhật Ký Tu Tiên (Logs)
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCosmicMapOpen, setIsCosmicMapOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isMemorialModalOpen, setIsMemorialModalOpen] = useState(false);
  const [showMeridianModal, setShowMeridianModal] = useState(false);


  // Lấy thời gian cổ phong cho nhật ký
  const getAncientTimeStr = () => {
    const hours = [
      'Giờ Tý', 'Giờ Sửu', 'Giờ Dần', 'Giờ Mão', 'Giờ Thìn', 'Giờ Tỵ',
      'Giờ Ngọ', 'Giờ Mùi', 'Giờ Thân', 'Giờ Dậu', 'Giờ Tuất', 'Giờ Hợi'
    ];
    const now = new Date();
    const idx = Math.floor(((now.getHours() + 1) % 24) / 2);
    const timeFormatted = now.toTimeString().split(' ')[0];
    return `${hours[idx]} (${timeFormatted})`;
  };

  // Thêm log vào nhật ký
  const addLog = (title: string, content: string, type: LogType) => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: getAncientTimeStr(),
      title,
      content,
      type
    };
    setLogs(prev => [...prev.slice(-90), newEntry]);
  };

  // Hiển thị Toast nhanh
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tự động cuộn Action Log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // ========================================================
  // HOOKS ORCHESTRATION LAYER
  // ========================================================

  // 1. Quản lý Lưu Trữ & Migration localStorage & Tiên Thư Bản Thể
  const gameSave = useGameSave({ onLog: addLog, onToast: showToast });
  const {
    player,
    setPlayer,
    isLoaded,
    saveProgress: handleSaveProgress
  } = gameSave;

  // 2. Ticker Thời Gian Thực Linh Điền (1s độc lập)
  const { currentTimestamp } = useGardenTimer();

  // 2b. Hệ Thống Âm Thanh & Nhạc Nền Tiên Hiệp (Web Audio Controller)
  const sound = useSound();

  // 3. Hệ Thống Thể Chất, Linh Căn, Mệnh Cách, Luân Hồi
  const cultivation = useCultivationActions({
    player,
    setPlayer,
    addLog,
    showToast,
    setLogs
  });

  // 3b. Hệ Thống Song Trục Tu Đạo: Thể Tu & Hồn Tu + Phân Thần Du Ngoạn
  const twinCultivation = useTwinCultivationActions({
    player,
    setPlayer,
    showToast,
    addLog
  });

  // 4. Hệ Thống Vạn Bảo Đấu Giá Hội (Grand Xianxia Auction Hall)
  const auction = useAuctionActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 4b. Hệ Thống Cửu Trọng Thiên Kiếp Tương Tác • Lôi Kiếp Độ Kiếp
  const tribulation = useTribulationActions({
    player,
    setPlayer,
    addLog,
    showToast,
    onMajorBreakthrough: (_realmIdx, realmName) => {
      addLog(
        '🏛️ THIÊN CỔ ĐẤU GIÁ HỘI GIÁNG LÂM!',
        `Thiên địa sinh dị tượng khi đạo hữu bước vào [${realmName}]! Vạn Bảo Thương Hội lập tức mở Phiên Đấu Giá Thiên Cổ nghênh tiếp cường giả!`,
        'breakthrough'
      );
      showToast(`🏛️ Phiên Đấu Giá Thiên Cổ đã mở mừng đạo hữu bước vào ${realmName}!`);
      auction.startAuctionSession(`Đấu Giá Thiên Cổ • Mừng Đại Đạo ${realmName}`, true);
      auction.setIsAuctionModalOpen(true);
    }
  });

  // 5. Các API Handlers Cốt Lõi (Tu Luyện, Đột Phá, Boss Chiến, Kỳ Duyên)
  const gameActions = useGameActions({
    player,
    setPlayer,
    addLog,
    showToast,
    onTriggerTribulation: tribulation.startTribulation,
    onMajorBreakthrough: (_realmIdx, realmName) => {
      addLog(
        '🏛️ THIÊN CỔ ĐẤU GIÁ HỘI GIÁNG LÂM!',
        `Thiên địa sinh dị tượng khi đạo hữu bước vào [${realmName}]! Vạn Bảo Thương Hội lập tức mở Phiên Đấu Giá Thiên Cổ nghênh tiếp cường giả!`,
        'breakthrough'
      );
      showToast(`🏛️ Phiên Đấu Giá Thiên Cổ đã mở mừng đạo hữu bước vào ${realmName}!`);
      auction.startAuctionSession(`Đấu Giá Thiên Cổ • Mừng Đại Đạo ${realmName}`, true);
      auction.setIsAuctionModalOpen(true);
    }
  });

  // 5. Hệ Thống Bí Cảnh Đa Tầng
  const secretRealm = useSecretRealmActions({
    player,
    setPlayer,
    addLog,
    showToast,
    onExploreRandomEvent: gameActions.handleExploreRandomEvent
  });

  // 5b. Hệ Thống Thái Cổ Cấm Địa (Sinh Tử Cấm Khu Sa Bàn Sương Mù)
  const forbiddenZone = useForbiddenZoneActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 6. Hệ Thống Công Pháp Các
  const manuals = useManualActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 6b. Hệ Thống Dung Hợp Công Pháp (Bàn Diễn Võ Vạn Pháp)
  const manualSynthesis = useManualSynthesisActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 7. Hệ Thống Bách Nghệ (Luyện Đan & Luyện Khí)
  const crafting = useCraftingActions({
    player,
    setPlayer,
    addLog,
    showToast,
    openDestinyModal: () => cultivation.setShowDestinyModal(true)
  });

  // 8. Hệ Thống Vạn Bảo Thương Hội & Túi Trữ Vật
  const merchantInv = useMerchantInventoryActions({
    player,
    setPlayer,
    addLog,
    showToast,
    playSfx: sound.playSFX
  });

  // 9. Hệ Thống Tông Môn
  const sect = useSectActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 10. Hệ Thống Đạo Lữ Tiên Duyên & Song Tu
  const companions = useCompanionActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 10b. Phân Hệ Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch
  const offspring = useOffspringActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 11. Hệ Thống Linh Điền Động Phủ
  const garden = useGardenActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 12. Hệ Thống Treo Máy / AFK Offline Progress
  const offlineProgress = useOfflineProgress({
    player,
    isLoaded,
    setPlayer,
    addLog,
    showToast
  });

  // 14. Hệ Thống Thành Tựu & Danh Hiệu Tiên Giới
  const achievements = useAchievements({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 15. Hệ Thống Cốt Truyện Phân Nhánh & Nhiệm Vụ Chính Tuyến
  const storyline = useStorylineActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 16. Hệ Thống Động Thiên Phúc Địa (Homestead & Abode Core)
  const abode = useAbodeActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 17. Phân Hệ Huyền Công Luyện Thể (Expanded Physique Subsystem)
  const physique = usePhysiqueActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 18. Phân Hệ Thức Hải Thần Hồn (Soul & Consciousness Subsystem)
  const soul = useSoulActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 19. Phân Hệ Trận Đạo Bách Nghệ • Trận Pháp Các
  const formation = useFormationActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 20. Phân Hệ Phù Đạo Bách Nghệ • Phù Lục Các
  const talisman = useTalismanActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 21. Hệ Thống Lục Đạo Luân Hồi • Đạo Vận Kế Thừa (Roguelite Meta-Progression)
  const reincarnation = useReincarnationActions({
    player,
    setPlayer,
    addLog,
    showToast,
    playSfx: sound.playSFX
  });

  // 22. Phân Hệ Đạo Vận Tiên Bi • Tổ Tiên Phù Hộ & Huyết Mạch Thế Gia
  const ancestralBlessing = useAncestralBlessingActions({
    player,
    setPlayer,
    addLog,
    showToast,
    playSfx: sound.playSFX
  });

  // 23. Phân Hệ Khai Tông Lập Phái & Chân Truyền Đệ Tử
  const customSect = useCustomSectActions({
    player,
    setPlayer,
    addLog,
    showToast,
    playSfx: sound.playSFX
  });

  // 24. Phân Hệ Vạn Năng Tu Vi: Quán Đỉnh Đạo Lữ, Khai Thông Bát Mạch & Ngưng Đan Chân Nguyên
  const tuViEmpowerment = useTuViEmpowermentActions({
    player,
    setPlayer,
    addLog,
    showToast,
  });

  // 25. Phân Hệ Bổ Nhiệm Tiên Đồng Xuất Sư (Disciple Graduation & Dominion Appointment)
  const discipleAppointment = useDiscipleAppointmentActions({
    player,
    setPlayer,
    addLog,
    showToast,
    playSfx: sound.playSFX
  });

  // 26. Phân Hệ Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại (Sect Wars)
  const sectWar = useSectWarActions({
    player,
    setPlayer,
    addLog,
    showToast,
    playSfx: sound.playSFX
  });

  // 27. Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà (Strategic AFK Meditation & Event Journal)
  const meditation = useMeditationActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  // 22. Modal Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh
  const [isEnhancedSeclusionOpen, setIsEnhancedSeclusionOpen] = useState<boolean>(false);

  // ========================================================

  // COMPUTED STATS & GAME VALUES
  // ========================================================

  const currentRealmIndex = Math.max(
    0,
    Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
  );
  const safeRealmIndex = currentRealmIndex;
  const currentRealm = realmsData[currentRealmIndex] || realmsData[0];
  const nextRealmIndex = currentRealmIndex + 1;
  const nextRealm = nextRealmIndex < realmsData.length ? (realmsData[nextRealmIndex] as Realm) : undefined;
  const currentRealmBadge = getRealmBadge(currentRealm.stage || currentRealm.name);

  // Tính toán dung tích túi trữ vật
  const usedSlots = getCurrentInventoryOccupiedSlots(player);
  const maxSlots = getMaxInventoryCapacity(player);
  const isInventoryFull = maxSlots < 9999 && usedSlots >= maxSlots;
  const isInventoryNearFull = maxSlots < 9999 && usedSlots >= Math.floor(maxSlots * 0.85);

  // Dữ liệu & trạng thái Đạo Lữ
  const compState = player.companionsState || createDefaultCompanionsState();
  const safeCompanions = compState?.companions || {};
  const bondedCount = Object.values(safeCompanions).filter(c => Boolean(c?.isBonded)).length;
  const isTamTinhActive = Boolean(
    player.activeBuffs?.tamTinhThanDieu ||
    (compState?.tamTinhThanDieuUntil && Date.now() < compState.tamTinhThanDieuUntil)
  );
  const tamTinhRemainingHours = isTamTinhActive && compState?.tamTinhThanDieuUntil
    ? Math.max(1, Math.ceil((compState.tamTinhThanDieuUntil - Date.now()) / (60 * 60 * 1000)))
    : 0;

  // Boss khả dụng ở cảnh giới hiện tại (-5 đến +10 realms)
  const availableBosses = bossesData.filter(
    b => b.realm >= Math.max(0, safeRealmIndex - 5) && b.realm <= safeRealmIndex + 10
  );

  // Tính % tiến độ tu vi để đột phá (áp dụng giảm 15% khi Ngộ Tính >= 80)
  const tuViReq = nextRealm ? calculateEffectiveRequiredTuVi(player, nextRealm) : 1;
  const tuViPercent = nextRealm ? Math.min(100, Math.floor((player.tuVi / tuViReq) * 100)) : 100;
  const canBreak = Boolean(nextRealm && player.tuVi >= tuViReq && player.linhThach >= nextRealm.requirements.linhThach);

  // Tốc độ tu luyện (kèm bonus linh căn)
  const linhCanSpeedBonus = player.linhCan ? (player.linhCan.speedBonus / 100) : 0;
  const currentSpeed = calculateCultivationSpeed(safeRealmIndex, player.canCot, (player.tongMon ? 0.1 : 0) + linhCanSpeedBonus);
  const estimatedTuVi = Math.floor(currentSpeed * gameActions.cultivateDuration * (gameActions.cultivateStance === 'hiem_canh' ? 1.5 : 1.0));

  // Bộ Chỉ Số Chiến Đấu & Chiến Lực Bản Thể chuẩn hóa mới
  const combatStats = calculateCombatStats(player);
  const combatPower = calculateCombatPower(player);

  // Khí Huyết & Linh Lực hiện tại
  const maxHP = player.maxKhiHuyet || getMaxKhiHuyet(
    player.canCot,
    player.currentRealm,
    player.equipment,
    player.manuals,
    player.physique,
    player.equippedManuals,
    player.linhCan,
    player.destiny,
    player.bodyRefinement,
    player.companionsState,
    player.physiqueState,
    player.tuViEmpowermentState,
    player.manualsState,
    player.beastsState
  );
  const curHP = player.khiHuyet ?? maxHP;
  const hpPercent = Math.min(100, Math.max(0, Math.floor((curHP / maxHP) * 100)));

  const maxMP = player.maxLinhLuc || getMaxLinhLuc(player.tamCanh, player.ngoTinh, player.currentRealm, player.equipment, player.manuals, player.equippedManuals, player.linhCan);
  const curMP = player.linhLuc ?? maxMP;
  const mpPercent = Math.min(100, Math.max(0, Math.floor((curMP / maxMP) * 100)));

  // Công Pháp đang trang bị
  const equippedTamPhap = player.manuals?.find(m => m.id === player.equippedManuals?.tamPhap);
  const equippedTheThuat = player.manuals?.find(m => m.id === player.equippedManuals?.theThuat);
  const equippedTT1 = player.manuals?.find(m => m.id === player.equippedManuals?.thanThong1);
  const equippedTT2 = player.manuals?.find(m => m.id === player.equippedManuals?.thanThong2);

  // Danh sách Đan Phương (bao gồm đan phương Tông Môn)
  const availableDanRecipes = [
    ...DAN_RECIPES,
    ...SECT_DAN_RECIPES.filter(r => player.sectState?.unlockedRecipes?.includes(r.id))
  ];

  // Kiểm tra có nhiệm vụ môn phái nào hoàn thành mà chưa nhận thưởng
  const hasUnclaimedQuest = Boolean(
    player.sectState?.dailyQuests?.some(q => q.isCompleted && !q.isClaimed)
  );

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-amber-500 font-serif text-sm tracking-widest animate-pulse">
        Đang cảm ứng thiên địa linh khí...
      </div>
    );
  }

  return (
    <div className={`h-screen w-full bg-gradient-to-b from-[#0a0d14] via-[#07080b] to-[#030406] text-zinc-200 relative overflow-hidden flex flex-col ${gameActions.screenShake ? 'animate-bounce' : ''}`}>
      {/* Tiên Cảnh Huyền Ảo - Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-amber-950/15 rounded-full blur-[140px]" />
      </div>

      {/* Hiệu ứng cảnh báo Tâm Ma & Thiên Kiếp */}
      {gameActions.tammaAlert && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-red-950/20 border-4 border-red-600/50 animate-pulse flex items-center justify-center">
          <span className="text-red-500 font-serif text-2xl font-bold tracking-widest bg-black/80 px-6 py-3 rounded-xl border border-red-500/50">
            ⚠️ TÂM MA PHẢN PHỆ! NGUY HIỂM!
          </span>
        </div>
      )}
      {gameActions.thienkiepAlert && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-indigo-950/20 border-4 border-indigo-500/50 animate-pulse flex items-center justify-center">
          <span className="text-indigo-400 font-serif text-2xl font-bold tracking-widest bg-black/80 px-6 py-3 rounded-xl border border-indigo-500/50">
            ⚡ THIÊN KIẾP GIÁNG THẾ!
          </span>
        </div>
      )}

      {/* Thông báo Toast toàn cục */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-amber-300 border border-amber-500/60 px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] text-xs font-serif tracking-wider animate-in fade-in slide-in-from-top-4 duration-300">
          {toastMessage}
        </div>
      )}

      <div className="relative z-10 flex flex-col h-screen w-full overflow-hidden">
        {/* HEADER NAV */}
        <div className="shrink-0">
          <HeaderNav
            combatPower={combatPower}
            currentRealm={currentRealm}
            player={player}
            isInventoryFull={isInventoryFull}
            isInventoryNearFull={isInventoryNearFull}
            usedSlots={usedSlots}
            maxSlots={maxSlots}
            setActiveTab={setActiveTab}
            handleSaveProgress={handleSaveProgress}
            openRebornModal={() => reincarnation.openRebornModal(false)}
            sound={sound}
            openAchievementsModal={() => achievements.setShowModal(true)}
            unclaimedAchievementsCount={achievements.unclaimedCount}
            openStorylineModal={() => storyline.openStorylineModal()}
            hasStorylineUnclaimed={storyline.hasUnclaimed}
            openAuctionModal={() => {
              if (!auction.auctionSession || auction.auctionSession.status === 'finished') {
                auction.startAuctionSession();
              }
              auction.setIsAuctionModalOpen(true);
            }}
            openAbodeModal={() => abode.setIsAbodeModalOpen(true)}
            hasAbodeNotification={abode.hasAbodeNotification}
            openPhysiqueModal={() => physique.setIsPhysiqueModalOpen(true)}
            hasPhysiqueNotification={physique.hasPhysiqueNotification}
            openSoulModal={() => soul.setIsSoulModalOpen(true)}
            hasSoulNotification={soul.hasSoulNotification}
            openCosmicMapModal={() => setIsCosmicMapOpen(true)}
            openSaveModal={() => setIsSaveModalOpen(true)}
            openMemorialModal={() => setIsMemorialModalOpen(true)}
          />
        </div>

        <main
          style={{ zoom: 0.93 }}
          className="flex-1 min-h-0 w-full max-w-[1720px] mx-auto px-2 sm:px-3 py-1.5 sm:py-2 grid grid-cols-1 lg:grid-cols-12 gap-2.5 overflow-hidden"
        >
          {/* ======================================================== */}
          {/* CỘT 1: ĐỘNG PHỦ & BẢN THỂ (LEFT COLUMN - 3 cols) */}
          {/* ======================================================== */}
          <LeftColumn
            player={player}
            combatPower={combatPower}
            currentRealm={currentRealm}
            currentRealmBadge={currentRealmBadge}
            combatStats={combatStats}
            curHP={curHP}
            maxHP={maxHP}
            hpPercent={hpPercent}
            curMP={curMP}
            maxMP={maxMP}
            mpPercent={mpPercent}
            handleRestAndHeal={cultivation.handleRestAndHeal}
            setShowDestinyModal={cultivation.setShowDestinyModal}
            setSelectedCompanionId={companions.setSelectedCompanionId}
            setActiveTab={setActiveTab}
            setShowRefineModal={cultivation.setShowRefineModal}
            setShowRootModal={cultivation.setShowRootModal}
            setShowMeridianModal={setShowMeridianModal}
            equippedTamPhap={equippedTamPhap}

            equippedTheThuat={equippedTheThuat}
            equippedTT1={equippedTT1}
            equippedTT2={equippedTT2}
            nextRealm={nextRealm}
            tuViPercent={tuViPercent}
            onUpdatePlayer={(p) => {
              const normalized = normalizePlayerData(p);
              setPlayer(normalized);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            }}
            onAddLog={addLog}
            onShowToast={showToast}
            openAchievementsModal={() => achievements.setShowModal(true)}
            openRebornModal={() => reincarnation.openRebornModal(false)}
            openMemorialModal={() => setIsMemorialModalOpen(true)}
          />

          {/* ======================================================== */}
          {/* CỘT 2: TU ĐẠO & NHẬT KÝ HÀNH TRÌNH (CENTER COLUMN - 5 cols) */}
          {/* ======================================================== */}
          <MiddleColumn
            estimatedTuVi={estimatedTuVi}
            cultivateDuration={gameActions.cultivateDuration}
            setCultivateDuration={gameActions.setCultivateDuration}
            isCultivating={gameActions.isCultivating}
            handleCultivate={gameActions.handleCultivate}
            handleDeepCultivate={gameActions.handleDeepCultivate}
            nextRealm={nextRealm}
            player={player}
            setPlayer={setPlayer}
            handleBreakthrough={gameActions.handleBreakthrough}
            isBreakingThrough={gameActions.isBreakingThrough}
            openRebornModal={() => reincarnation.openRebornModal(false)}
            canBreak={Boolean(canBreak)}
            logs={logs}
            setLogs={setLogs}
            logContainerRef={logContainerRef}
            cultivateStance={gameActions.cultivateStance}
            setCultivateStance={gameActions.setCultivateStance}
            cultivateSummary={gameActions.cultivateSummary}
            setCultivateSummary={gameActions.setCultivateSummary}
            openStorylineModal={storyline.openStorylineModal}
            activeStorylineQuest={storyline.currentActiveQuest}
            storylineProgress={storyline.activeQuestProgress}
            openEnhancedSeclusionModal={() => setIsEnhancedSeclusionOpen(true)}
            meditation={meditation}
          />

          {/* ======================================================== */}
          {/* CỘT 3: 10 TABS TIÊN HIỆP (RIGHT COLUMN - 4 cols) */}
          {/* ======================================================== */}
          <section className="lg:col-span-4 h-full flex flex-col min-h-0">
            <div className="cophong-card cophong-corner p-2.5 sm:p-3 rounded-xl h-full flex flex-col min-h-0">
              {/* Header Tab Grid 11 Tabs (2 hàng: 6+5) */}
              <div className="grid grid-cols-6 gap-1 border-b border-amber-900/30 pb-1.5 mb-1.5 shrink-0">
                {/* Hàng 1 */}
                <button
                  onClick={() => setActiveTab('trials')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                    activeTab === 'trials'
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Lịch Luyện Thí Luyện"
                >
                  <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">Thí Luyện</span>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                    activeTab === 'events'
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Bí Cảnh Thám Hiểm"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">Bí Cảnh</span>
                </button>
                <button
                  onClick={() => setActiveTab('manuals')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                    activeTab === 'manuals'
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Công Pháp Các"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Công Pháp</span>
                </button>
                <button
                  onClick={() => setActiveTab('alchemy')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                    activeTab === 'alchemy'
                      ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Luyện Đan Các"
                >
                  {player.alchemyArtisan?.unlocked ? (
                    <Flame className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                  )}
                  <span className="truncate">Luyện Đan</span>
                </button>
                <button
                  onClick={() => setActiveTab('forging')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                    activeTab === 'forging'
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Luyện Khí Phòng"
                >
                  {player.forgingArtisan?.unlocked ? (
                    <Hammer className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" />
                  )}
                  <span className="truncate">Luyện Khí</span>
                </button>

                <button
                  onClick={() => setActiveTab('formation')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                    activeTab === 'formation'
                      ? 'bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-indigo-900/60 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-900/30'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Trận Đạo Bách Nghệ • Trận Pháp Các"
                >
                  <span className="text-[11px] shrink-0">🌀</span>
                  <span className="truncate">Trận Đạo</span>
                  {formation.hasFormationNotification && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 shadow-[0_0_6px_rgba(99,102,241,0.8)] animate-ping" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('sect')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                    activeTab === 'sect'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Hệ Thống Tông Môn"
                >
                  <Landmark className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Tông Môn</span>
                  {hasUnclaimedQuest && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-ping" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('merchant')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                    activeTab === 'merchant'
                      ? 'bg-amber-600/25 text-amber-300 border border-amber-500/50 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Vạn Bảo Thương Hội"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Thương Hội</span>
                </button>
                <button
                  onClick={() => setActiveTab('daolu')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                    activeTab === 'daolu' || activeTab === 'companions'
                      ? 'bg-gradient-to-r from-rose-950/90 via-pink-950/85 to-purple-950/80 text-rose-300 border border-rose-500/60 shadow-sm shadow-rose-900/40'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-rose-900/30'
                  }`}
                  title="Hệ Thống Đạo Lữ & Song Tu"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 fill-rose-500/25 animate-pulse" />
                  <span className="truncate">Đạo Lữ</span>
                  {player.companionsState && Object.values(player.companionsState.companions).some(c => c.isBonded) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('beasts')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                    activeTab === 'beasts'
                      ? 'bg-gradient-to-r from-amber-950/90 via-yellow-950/85 to-amber-950/80 text-amber-300 border border-amber-500/60 shadow-sm shadow-amber-900/40'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-amber-900/30'
                  }`}
                  title={`Hệ Thống Linh Thú & Tọa Kỵ (${player.beasts?.length || 0})`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                  <span className="truncate">Linh Thú</span>
                  {Boolean(player.activeBeastId) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                    activeTab === 'inventory'
                      ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title={`Túi Trữ Vật (${usedSlots}/${maxSlots === 9999 ? '∞' : maxSlots})`}
                >
                  <Backpack className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Túi Đồ</span>
                </button>

                <button
                  onClick={() => setActiveTab('talisman')}
                  className={`py-1 px-0.5 sm:px-1 rounded-md text-[10px] sm:text-[10.5px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate relative ${
                    activeTab === 'talisman'
                      ? 'bg-gradient-to-r from-red-950/90 via-amber-950/85 to-red-950/80 text-amber-300 border border-amber-500/60 shadow-sm shadow-amber-900/40'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40'
                  }`}
                  title="Phù Đạo Bách Nghệ • Phù Lục Các"
                >
                  <span className="text-[11px] shrink-0">📜</span>
                  <span className="truncate">Phù Đạo</span>
                  {talisman.hasTalismanNotification && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-ping" />
                  )}
                </button>
              </div>

              {/* VÙNG NỘI DUNG TABS */}
              <div className={`flex-1 min-h-0 ${activeTab === 'merchant' || activeTab === 'inventory' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto pr-1 custom-scrollbar'}`}>
                {activeTab === 'trials' && (
                  <BattleTab
                    player={player}
                    availableBosses={availableBosses}
                    combatPower={combatPower}
                    isBattling={gameActions.isBattling}
                    handleBattleBoss={gameActions.handleBattleBoss}
                    onUpdatePlayer={(p) => {
                      const normalized = normalizePlayerData(p);
                      setPlayer(normalized);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
                    }}
                    onShowToast={showToast}
                    onAddLog={addLog}
                  />
                )}

                {activeTab === 'events' && (
                  <SecretRealmTab
                    player={player}
                    eventsSubTab={secretRealm.eventsSubTab}
                    setEventsSubTab={secretRealm.setEventsSubTab}
                    activeDungeon={secretRealm.activeDungeon}
                    dungeonFloor={secretRealm.dungeonFloor}
                    isAdvancingFloor={secretRealm.isAdvancingFloor}
                    dungeonLogs={secretRealm.dungeonLogs}
                    handleStartDungeon={secretRealm.handleStartDungeon}
                    handleSelectRoom={secretRealm.handleSelectRoom}
                    handleResolveCurrentRoom={secretRealm.handleResolveCurrentRoom}
                    handleNextStep={secretRealm.handleNextStep}
                    handleRetreatDungeon={secretRealm.handleRetreatDungeon}
                    handleEnterDungeon={secretRealm.handleEnterDungeon}
                    handleExitDungeon={secretRealm.handleExitDungeon}
                    handleAdvanceDungeonFloor={secretRealm.handleAdvanceDungeonFloor}
                    handleClaimDungeonTreasure={secretRealm.handleClaimDungeonTreasure}
                    handleExploreRandomEvent={gameActions.handleExploreRandomEvent}
                    fetchRandomEvent={gameActions.handleExploreRandomEvent}
                    onStartForbiddenZone={forbiddenZone.handleStartZone}
                    onAddLog={addLog}
                    onShowToast={showToast}
                    onUpdatePlayer={(updatedPlayer) => {
                      const normalized = normalizePlayerData(updatedPlayer);
                      setPlayer(normalized);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
                    }}
                  />
                )}

                {activeTab === 'manuals' && (
                  <ManualsTab
                    player={player}
                    manualsSubTab={manuals.manualsSubTab}
                    setManualsSubTab={manuals.setManualsSubTab}
                    manualTypeFilter={manuals.manualTypeFilter}
                    setManualTypeFilter={manuals.setManualTypeFilter}
                    handleEquipManual={manuals.handleEquipManual}
                    handleUnequipManual={manuals.handleUnequipManual}
                    handleLevelUpManual={manuals.handleLevelUpManual}
                    handleBuyManual={manuals.handleBuyManual}
                    synthesisActions={manualSynthesis}
                  />
                )}

                {activeTab === 'alchemy' && (
                  <AlchemyTab
                    player={player}
                    alchemySubTab={crafting.alchemySubTab}
                    setAlchemySubTab={crafting.setAlchemySubTab}
                    availableDanRecipes={availableDanRecipes}
                    handleUnlockArtisan={crafting.handleUnlockArtisan}
                    setActiveTab={setActiveTab}
                    handleCraftPill={crafting.handleCraftPill}
                    handleConsumePill={crafting.handleConsumePill}
                    handleBuyHerb={crafting.handleBuyHerb}
                    handleBuyMissingMaterials={crafting.handleBuyMissingMaterials}
                    handleToggleAutoBuySupply={crafting.handleToggleAutoBuySupply}
                    setPlayer={setPlayer}
                    showToast={showToast}
                    addLog={addLog}
                  />
                )}

                {activeTab === 'forging' && (
                  <ForgingTab
                    player={player}
                    forgingMainTab={crafting.forgingMainTab}
                    setForgingMainTab={crafting.setForgingMainTab}
                    forgingSubTab={crafting.forgingSubTab}
                    setForgingSubTab={crafting.setForgingSubTab}
                    forgingSelectedSlot={crafting.forgingSelectedSlot}
                    setForgingSelectedSlot={crafting.setForgingSelectedSlot}
                    handleUnlockArtisan={crafting.handleUnlockArtisan}
                    setActiveTab={setActiveTab}
                    handleEnhanceEquip={crafting.handleEnhanceEquip}
                    handleForgeEquip={crafting.handleForgeEquip}
                    handleBuyOre={crafting.handleBuyOre}
                    handlePunchSocket={crafting.handlePunchSocket}
                    handleInlayGem={crafting.handleInlayGem}
                    handleRemoveGem={crafting.handleRemoveGem}
                    handleToggleLockAffix={crafting.handleToggleLockAffix}
                    handleReforgeEquipment={crafting.handleReforgeEquipment}
                    selectedDismantleIds={crafting.selectedDismantleIds}
                    handleSelectDismantleEquip={crafting.handleSelectDismantleEquip}
                    handleSelectAllByGrade={crafting.handleSelectAllByGrade}
                    handleClearDismantleSelection={crafting.handleClearDismantleSelection}
                    handleConfirmDismantle={crafting.handleConfirmDismantle}
                    handleBuyMissingMaterials={crafting.handleBuyMissingMaterials}
                    handleToggleAutoBuySupply={crafting.handleToggleAutoBuySupply}
                    useEssenceReforge={crafting.useEssenceReforge}
                    handleToggleEssenceReforge={crafting.handleToggleEssenceReforge}
                    forgedEquipmentResult={crafting.forgedEquipmentResult}
                    isHarvestModalOpen={crafting.isHarvestModalOpen}
                    isForging={crafting.isForging}
                    handleEquipNewlyForgedItem={crafting.handleEquipNewlyForgedItem}
                    handleStoreNewlyForgedItem={crafting.handleStoreNewlyForgedItem}
                    setIsHarvestModalOpen={crafting.setIsHarvestModalOpen}
                    setPlayer={setPlayer}
                    addLog={addLog}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'formation' && (
                  <FormationTab
                    player={player}
                    formationSubTab={formation.formationSubTab}
                    setFormationSubTab={formation.setFormationSubTab}
                    selectedRecipeId={formation.selectedRecipeId}
                    setSelectedRecipeId={formation.setSelectedRecipeId}
                    isCrafting={formation.isCrafting}
                    handleCraftFormation={formation.handleCraftFormation}
                    handleEquipFormation={formation.handleEquipFormation}
                    handleUnequipFormation={formation.handleUnequipFormation}
                    handleDismantleFormation={formation.handleDismantleFormation}
                    artisan={formation.artisan}
                    formationInventory={formation.formationInventory}
                    setActiveTab={setActiveTab}
                    isReforging={formation.isReforging}
                    selectedReforgeTargetId={formation.selectedReforgeTargetId}
                    setSelectedReforgeTargetId={formation.setSelectedReforgeTargetId}
                    selectedReforgeType={formation.selectedReforgeType}
                    setSelectedReforgeType={formation.setSelectedReforgeType}
                    handleReforgeArray={formation.handleReforgeArray}
                  />
                )}

                {activeTab === 'talisman' && (
                  <TalismanTab
                    player={player}
                    talismanSubTab={talisman.talismanSubTab}
                    setTalismanSubTab={talisman.setTalismanSubTab}
                    selectedRecipeId={talisman.selectedRecipeId}
                    setSelectedRecipeId={talisman.setSelectedRecipeId}
                    craftCount={talisman.craftCount}
                    setCraftCount={talisman.setCraftCount}
                    isCrafting={talisman.isCrafting}
                    artisan={talisman.artisan}
                    talismanInventory={talisman.talismanInventory}
                    equippedBelt={talisman.equippedBelt}
                    handleCraftTalisman={talisman.handleCraftTalisman}
                    handleEquipTalisman={talisman.handleEquipTalisman}
                    handleUnequipTalisman={talisman.handleUnequipTalisman}
                    handleUseUtilityTalisman={talisman.handleUseUtilityTalisman}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === 'sect' && (
                  <SectTab
                    player={player}
                    sectSubTab={sect.sectSubTab}
                    setSectSubTab={sect.setSectSubTab}
                    hasUnclaimedQuest={hasUnclaimedQuest}
                    handleJoinSect={sect.handleJoinSect}
                    handleLeaveSect={sect.handleLeaveSect}
                    handleResetQuests={sect.handleResetQuests}
                    handleClaimQuestReward={sect.handleClaimQuestReward}
                    handleDoPatrolQuest={sect.handleDoPatrolQuest}
                    handleDonateLinhThachQuest={sect.handleDonateLinhThachQuest}
                    handleDonateHerbsQuest={sect.handleDonateHerbsQuest}
                    handleDonateOresQuest={sect.handleDonateOresQuest}
                    handleClaimDailySalary={sect.handleClaimDailySalary}
                    handlePromoteRank={sect.handlePromoteRank}
                    handleFightArena={sect.handleFightArena}
                    setActiveTab={setActiveTab}
                    handleBuySectShopItem={sect.handleBuySectShopItem}
                    handleDonateToArray={sect.handleDonateToArray}
                    handleAttackVein={sect.handleAttackVein}
                    handleClaimVeinStipend={sect.handleClaimVeinStipend}
                    handleReinforceVein={sect.handleReinforceVein}
                    activeVeinBattle={sect.activeVeinBattle}
                    handleCloseVeinBattleModal={sect.handleCloseVeinBattleModal}
                    isFightingVein={sect.isFightingVein}
                    customSectActions={customSect}
                    appointmentActions={discipleAppointment}
                    sectWarActions={sectWar}
                  />
                )}

                {activeTab === 'merchant' && (
                  <MerchantTab
                    player={player}
                    merchantSubTab={merchantInv.merchantSubTab}
                    setMerchantSubTab={merchantInv.setMerchantSubTab}
                    handleRefreshMerchant={merchantInv.handleRefreshMerchant}
                    handleBuyMerchantItem={merchantInv.handleBuyMerchantItem}
                    handleBuyHerbsBatch={merchantInv.handleBuyHerbsBatch}
                    handleBuyOresBatch={merchantInv.handleBuyOresBatch}
                    handleBuyEquipment={merchantInv.handleBuyEquipment}
                    handleRecruitCompanion={merchantInv.handleRecruitCompanion}
                    handleRecruitBeast={merchantInv.handleRecruitBeast}
                    handleUnlockStorage={merchantInv.handleUnlockStorage}
                    handleSetActiveCombatBeast={merchantInv.handleSetActiveCombatBeast}
                    handleSetActiveMountBeast={merchantInv.handleSetActiveMountBeast}
                    handleSellAllBasicItems={merchantInv.handleSellAllBasicItems}
                    handleSellItem={merchantInv.handleSellItem}
                    handleExchangeLinhThach={merchantInv.handleExchangeLinhThach}
                    handleEquipDivineAbility={merchantInv.handleEquipDivineAbility}
                    handleUnequipDivineAbility={merchantInv.handleUnequipDivineAbility}
                    usedSlots={usedSlots}
                    onOpenAuction={() => {
                      if (!auction.auctionSession || auction.auctionSession.status === 'finished') {
                        auction.startAuctionSession();
                      }
                      auction.setIsAuctionModalOpen(true);
                    }}
                  />
                )}

                {activeTab === 'inventory' && (
                  <InventoryTab
                    player={player}
                    isInventoryFull={isInventoryFull}
                    isInventoryNearFull={isInventoryNearFull}
                    usedSlots={usedSlots}
                    maxSlots={maxSlots}
                    inventoryFilter={merchantInv.inventoryFilter}
                    setInventoryFilter={merchantInv.setInventoryFilter}
                    handleSortInventory={merchantInv.handleSortInventory}
                    handleSellAllBasicItems={merchantInv.handleSellAllBasicItems}
                    setActiveTab={setActiveTab}
                    handleUsePill={crafting.handleConsumePill}
                    handleSellItem={merchantInv.handleSellItem}
                    handleEquipEquipment={merchantInv.handleEquipEquipment}
                    handleLearnBookFromInventory={merchantInv.handleLearnBookFromInventory}
                    handleEquipBagFromInventory={merchantInv.handleEquipBagFromInventory}
                    handleExchangeLinhThach={merchantInv.handleExchangeLinhThach}
                  />
                )}

                {(activeTab === 'daolu' || activeTab === 'companions') && (
                  <CompanionTab
                    player={player}
                    bondedCount={bondedCount}
                    isTamTinhActive={isTamTinhActive}
                    tamTinhRemainingHours={tamTinhRemainingHours}
                    handleTravelCompanion={companions.handleTravelCompanion}
                    handleEncounterCompanion={companions.handleEncounterCompanion}
                    handleChatCompanion={companions.handleChatCompanion}
                    handleOpenGiftModal={companions.handleOpenGiftModal}
                    handleBondCompanion={companions.handleBondCompanion}
                    handleSongTu={companions.handleSongTu}
                    handleSetActiveCompanion={companions.handleSetActiveCompanion}
                    handleCompleteQuest={companions.handleCompleteQuest}
                    handleStationGarden={companions.handleStationGarden}
                    handleInfuseCompanion={tuViEmpowerment.handleInfuseCompanion}
                    currentTimestamp={currentTimestamp}
                    offspringActions={offspring}
                    activeDualEvent={companions.activeDualEvent}
                    isResolvingDualEvent={companions.isResolvingDualEvent}
                    handleChooseDualEventOption={companions.handleChooseDualEventOption}
                    handleCloseDualEventModal={companions.handleCloseDualEventModal}
                    appointmentActions={discipleAppointment}
                  />


                )}

                {activeTab === 'beasts' && (
                  <BeastTab
                    player={player}
                    onUpdatePlayer={(p) => {
                      const normalized = normalizePlayerData(p);
                      setPlayer(normalized);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
                    }}
                    onAddLog={addLog}
                    onShowToast={showToast}
                    setActiveTab={setActiveTab}
                  />
                )}
              </div>
            </div>
          </section>
        </main>

        {/* ======================================================== */}
        {/* CÁC MODALS ĐỘC LẬP (EXTRACTED TO /components/modals/) */}
        {/* ======================================================== */}

        {/* 1. Modal Tặng Quà Cho Đạo Lữ */}
        <CompanionGiftModal
          isOpen={companions.showGiftModal}
          onClose={() => companions.setShowGiftModal(false)}
          giftingCompanion={companions.giftingCompanion}
          player={player}
          giftFilter={companions.giftFilter}
          setGiftFilter={companions.setGiftFilter}
          onSendGift={companions.handleSendGift}
        />

        {/* 2. Modal Tôi Thể Rèn Thân */}
        <PhysiqueRefineModal
          isOpen={cultivation.showRefineModal}
          onClose={() => cultivation.setShowRefineModal(false)}
          player={player}
          onBodyRefine={cultivation.handleBodyRefine}
        />

        {/* 3. Modal Thăng Hoa Linh Căn */}
        <SpiritualRootModal
          isOpen={cultivation.showRootModal}
          onClose={() => cultivation.setShowRootModal(false)}
          player={player}
          onRootEvolve={cultivation.handleRootEvolve}
        />

        {/* 4. Modal Nghịch Thiên Cải Mệnh */}
        <DestinyModal
          isOpen={cultivation.showDestinyModal}
          onClose={() => !cultivation.isRollingDestiny && cultivation.setShowDestinyModal(false)}
          player={player}
          isRollingDestiny={cultivation.isRollingDestiny}
          onRerollDestiny={cultivation.handleRerollDestiny}
          onEquipDestiny={cultivation.handleEquipDestiny}
          onUnequipDestiny={cultivation.handleUnequipDestiny}
        />

        {/* 5. Modal Gieo Trồng Thảo Dược */}
        <PlantSeedModal
          isOpen={garden.showPlantSeedModal}
          selectedPlotId={garden.selectedPlotId}
          onClose={() => {
            garden.setShowPlantSeedModal(false);
            garden.setSelectedPlotId(null);
          }}
          player={player}
          onPlantSeed={garden.handlePlantSeed}
        />

        {/* 6. Modal Thăng Cấp Linh Điền */}
        <GardenUpgradeModal
          isOpen={garden.showLinhDienUpgradeModal}
          onClose={() => garden.setShowLinhDienUpgradeModal(false)}
          player={player}
          onUpgradeLinhDien={garden.handleUpgradeLinhDien}
        />

        {/* 7. Modal Lục Đạo Luân Hồi • Đạo Vận Kế Thừa (Roguelite Meta-Progression) */}
        <RebornModal
          isOpen={reincarnation.isRebornModalOpen}
          onClose={reincarnation.closeRebornModal}
          player={player}
          isBinhGiaiMode={reincarnation.isBinhGiaiMode}
          rebornScreen={reincarnation.rebornScreen}
          setRebornScreen={reincarnation.setRebornScreen}
          karmaReward={reincarnation.karmaReward}
          currentAvailableKarma={reincarnation.currentAvailableKarma}
          selectedPerks={reincarnation.selectedPerks}
          selectedLinhCan={reincarnation.selectedLinhCan}
          selectedInheritedDestinyId={reincarnation.selectedInheritedDestinyId}
          keepSealedNatal={reincarnation.keepSealedNatal}
          setKeepSealedNatal={reincarnation.setKeepSealedNatal}
          onUpgradePerk={reincarnation.handleUpgradeRebornPerk}
          onUpgradeSpiritualRoot={reincarnation.handleUpgradeSpiritualRootWithKarma}
          onSelectInheritedDestiny={reincarnation.handleSelectInheritedDestiny}
          onProceedToInheritance={reincarnation.handleProceedToInheritance}
          onConfirmReincarnation={reincarnation.handleConfirmReincarnation}
          onStartFreshNewGame={reincarnation.handleStartFreshNewGame}
          onOpenMemorial={() => setIsMemorialModalOpen(true)}
          onInheritDisciple={reincarnation.handleInheritDisciple}
        />

        {/* 7.1 Modal Lục Đạo Tiên Bi • Bia Mộ Tiền Kiếp & Danh Hiệu Kiếp Tu */}
        <AncestralMemorialModal
          isOpen={isMemorialModalOpen}
          onClose={() => setIsMemorialModalOpen(false)}
          player={player}
          ancestralActions={ancestralBlessing}
        />

        {/* 8. Modal Tiên Duyên Kỳ Ngộ Phân Nhánh */}
        <StoryEncounterModal
          isOpen={Boolean(gameActions.activeEvent)}
          onClose={() => {
            gameActions.setActiveEvent(null);
            gameActions.setEventOutcome(null);
          }}
          activeEvent={gameActions.activeEvent}
          eventOutcome={gameActions.eventOutcome}
          isResolvingEvent={gameActions.isResolvingEvent}
          player={player}
          combatStats={combatStats}
          combatPower={combatPower}
          onSelectChoice={gameActions.handleSelectEventChoice}
        />

        {/* 9. Modal Bế Quan Ngoại Tuyến Trở Về (AFK Offline Progress) */}
        <OfflineProgressModal
          isOpen={offlineProgress.showOfflineModal}
          result={offlineProgress.offlineResult}
          onClaim={offlineProgress.claimOfflineRewards}
        />

        {/* 10. Modal Thành Tựu & Danh Hiệu Tiên Giới */}
        <AchievementsModal
          isOpen={achievements.showModal}
          onClose={() => achievements.setShowModal(false)}
          player={player}
          activeTab={achievements.activeTab}
          setActiveTab={achievements.setActiveTab}
          selectedCategory={achievements.selectedCategory}
          setSelectedCategory={achievements.setSelectedCategory}
          onClaimAchievement={achievements.claimAchievement}
          onClaimAllAchievements={achievements.claimAllAchievements}
          onEquipTitle={achievements.equipTitle}
          unclaimedCount={achievements.unclaimedCount}
        />

        {/* 11. Modal Cuộn Tranh Cốt Truyện & Lựa Chọn Phân Nhánh */}
        <StorylineModal
          isOpen={storyline.showModal}
          onClose={() => storyline.setShowModal(false)}
          player={player}
          activeChapterId={storyline.activeChapterId}
          setActiveChapterId={storyline.setActiveChapterId}
          selectedQuestId={storyline.selectedQuestId}
          setSelectedQuestId={storyline.setSelectedQuestId}
          dialogueIndex={storyline.dialogueIndex}
          setDialogueIndex={storyline.setDialogueIndex}
          advanceDialogue={storyline.advanceDialogue}
          onSelectChoice={storyline.selectChoice}
          onClaimReward={storyline.claimQuestReward}
          getQuestProgressInfo={storyline.getQuestProgressInfo}
          getQuestStatusInfo={storyline.getQuestStatusInfo}
        />

        {/* 12. Modal Vạn Bảo Đấu Giá Đại Hội */}
        <AuctionModal
          isOpen={auction.isAuctionModalOpen}
          onClose={auction.closeAuction}
          player={player}
          onUpdatePlayer={setPlayer}
          onShowToast={showToast}
          onAddLog={addLog}
          session={auction.auctionSession}
          isBiddingRunning={auction.isBiddingRunning}
          onPlaceBid={auction.placeBid}
          onSoulIntimidation={auction.useSoulIntimidation}
          onPassLot={auction.passCurrentLot}
          onNextLot={auction.nextLot}
        />

        {/* 13. Modal Động Thiên Phúc Địa (Homestead & Abode Core) */}
        <AbodeHubModal
          isOpen={abode.isAbodeModalOpen}
          onClose={() => abode.setIsAbodeModalOpen(false)}
          player={player}
          abodeState={abode.abodeState}
          activeTab={abode.activeAbodeTab}
          setActiveTab={abode.setActiveAbodeTab}
          onUpgradeSpiritArray={abode.handleUpgradeSpiritArray}
          onUpgradeAbodeLevel={abode.handleUpgradeAbodeLevel}
          onUnlockPlot={abode.handleUnlockPlot}
          onChangeSoilType={abode.handleChangeSoilType}
          onPlantSeed={abode.handlePlantSeed}
          onHarvestPlot={abode.handleHarvestPlot}
          onHarvestAllPlots={abode.handleHarvestAllPlots}
          onFertilizePlot={abode.handleFertilizePlot}
          onAssignBeastToSanctuary={abode.handleAssignBeastToSanctuary}
          onClaimFertilizer={abode.handleClaimFertilizer}
          onShowcaseManual={abode.handleShowcaseManual}
          onRecruitDisciple={abode.handleRecruitDisciple}
          onDismissDisciple={abode.handleDismissDisciple}
          onClaimDiscipleTribute={abode.handleClaimDiscipleTribute}
          onClaimAllDiscipleTributes={abode.handleClaimAllDiscipleTributes}
          setPlayer={setPlayer}
          addLog={addLog}
          showToast={showToast}
          onNavigateToMeditation={(locationId) => {
            meditation.setSelectedLocationId(locationId);
            abode.setIsAbodeModalOpen(false);
          }}
        />

        {/* 14. Modal Huyền Công Luyện Thể (Expanded Physique Subsystem) */}
        <PhysiqueModal
          isOpen={physique.isPhysiqueModalOpen}
          onClose={() => physique.setIsPhysiqueModalOpen(false)}
          player={player}
          onBreakthrough={physique.handleBreakthroughRealm}
          onUpgradePart={physique.handleUpgradePart}
          onUseItem={physique.handleUsePhysiqueItem}
          isBreakthroughReady={physique.hasPhysiqueNotification}
        />

        {/* 15. Modal Thức Hải Thần Hồn (Soul & Consciousness System) */}
        <SoulHubModal
          isOpen={soul.isSoulModalOpen}
          onClose={() => soul.setIsSoulModalOpen(false)}
          player={player}
          soulState={soul.soulState}
          activeTab={soul.activeTab}
          setActiveTab={soul.setActiveTab}
          onSoulBreakthrough={soul.handleSoulBreakthrough}
          onMeditate={soul.handleMeditateInSoulSea}
          onExorciseDemon={soul.handleExorciseDemon}
          onEquipRelic={soul.handleEquipSoulRelic}
          onUseItem={soul.handleUseNourishingItem}
        />

        {/* 16. Modal Cửu Trọng Thiên Kiếp Tương Tác (Tribulation Minigame) */}
        <TribulationModal
          isOpen={tribulation.isModalOpen}
          player={player}
          tribulationState={tribulation.tribulationState}
          isLightningFlashing={tribulation.isLightningFlashing}
          onSelectAction={tribulation.handleSelectAction}
          onClaimVictory={tribulation.handleClaimVictory}
          onCloseDefeat={tribulation.handleCloseDefeat}
        />

        {/* 17. Modal Thái Cổ Cấm Địa (Forbidden Zone Fog of War Grid) */}
        <ForbiddenZoneModal
          isOpen={forbiddenZone.isModalOpen}
          player={player}
          zoneState={forbiddenZone.zoneState}
          currentHp={forbiddenZone.currentHp}
          maxHp={forbiddenZone.maxHp}
          onMove={forbiddenZone.handleMove}
          onInteract={forbiddenZone.handleInteract}
          onConsumePill={forbiddenZone.handleConsumePillForAura}
          onEscape={forbiddenZone.handleEscape}
          onRetreatEmergency={forbiddenZone.handleRetreatEmergency}
          onClose={forbiddenZone.closeModal}
        />

        {/* 18. Modal Chư Thiên Tinh Đồ (Endgame Cosmic Map sau Phi Thăng 51+) */}
        {isCosmicMapOpen && (
          <CosmicMapModal
            player={player}
            onUpdatePlayer={setPlayer}
            onShowToast={showToast}
            onAddLog={addLog}
            onClose={() => setIsCosmicMapOpen(false)}
          />
        )}

        {/* 19. Modal Quản Lý Lưu Trữ & Tiên Thư Bản Thể */}
        <SaveManagementModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          player={player}
          onSaveProgress={gameSave.saveProgress}
          onExportEncryptedString={gameSave.handleExportString}
          onImportEncryptedString={gameSave.handleImportString}
          onRestoreSnapshot={gameSave.handleRestoreSnapshot}
          onSaveSnapshot={gameSave.handleSaveSnapshot}
          onExportJson={gameSave.exportSave}
          onImportJson={gameSave.importSave}
          showToast={showToast}
          onResetNewGame={reincarnation.handleStartFreshNewGame}
        />

        {/* 20. Modal Vạn Năng Tu Vi: Khai Khiếu Bát Mạch, Ngưng Đan Chân Nguyên & Nhiên Huyết Overdrive */}
        <MeridianCultivationModal
          isOpen={showMeridianModal}
          onClose={() => setShowMeridianModal(false)}
          player={player}
          setPlayer={setPlayer}
          tuViActions={tuViEmpowerment}
          showToast={showToast}
          addLog={addLog}
        />

        {/* 21. Modal Biến Cố Ngẫu Nhiên Khi Song Tu (Dual Cultivation Dynamic Events) */}
        {companions.activeDualEvent && (
          <DualCultivationEventModal
            isOpen={Boolean(companions.activeDualEvent)}
            event={companions.activeDualEvent.event}
            partner={companions.activeDualEvent.partner}
            player={player}
            isResolving={companions.isResolvingDualEvent}
            onSelectChoice={companions.handleChooseDualEventOption}
            onClose={companions.handleCloseDualEventModal}
          />
        )}


        {/* 22. Modal Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh */}
        <EnhancedSeclusionModal
          isOpen={isEnhancedSeclusionOpen}
          onClose={() => setIsEnhancedSeclusionOpen(false)}
          player={player}
          setPlayer={setPlayer}
          addLog={addLog}
          showToast={showToast}
        />

        {/* 23. Modal Nhật Ký Kỳ Ngộ Sơn Hà (Meditation Journal Modal) */}
        <MeditationJournalModal
          isOpen={meditation.showJournalModal}
          onClose={meditation.closeJournalModal}
          progressResult={meditation.lastProgressResult}
          locationName={meditation.currentLocationConfig?.name}
          stanceName={meditation.currentStanceConfig?.name}
        />

        {/* FOOTER BẢN QUYỀN */}
        <footer className="shrink-0 border-t border-amber-900/20 py-1.5 text-center text-[11px] text-zinc-500 font-serif bg-[#08080c]/80">
          Đạo Pháp Tự Nhiên • Tu Tiên Chi Lộ Text-RPG © 2026
        </footer>
      </div>
    </div>
  );
}
