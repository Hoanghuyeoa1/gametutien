// components/tabs/AncientMapDungeonView.tsx
// Giao Diện Cổ Phong: Sa Bàn Ghép Tàn Đồ Bát Hoang & Thượng Cổ Bí Cảnh
// (Secret Realm Map Fragments Synthesis Altar & Ancient Dungeon Instances)

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Shield,
  Zap,
  Sword,
  Clock,
  Gem,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight,
  Skull,
  Coins,
  Package,
  Layers,
  Info
} from 'lucide-react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  FragmentDirection,
  AncientDungeonTier,
  AncientDungeonInstance,
  GuaranteedDivineReward
} from '@/lib/types/ancient-map-dungeon';
import {
  ANCIENT_MAP_SETS_REGISTRY,
  DIRECTION_NAMES,
  createDefaultAncientMapVault
} from '@/lib/ancient-map-dungeon-logic';
import { useAncientDungeonActions } from '@/hooks/useAncientDungeonActions';

export interface AncientMapDungeonViewProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
}

export const AncientMapDungeonView: React.FC<AncientMapDungeonViewProps> = ({
  player,
  setPlayer,
  addLog,
  showToast
}) => {
  const {
    vault,
    selectedSetId,
    setSelectedSetId,
    isSynthesizing,
    isFighting,
    lastBattleReport,
    lastRewardModalData,
    showRewardModal,
    handleSynthesizeMap,
    handleOpenDungeon,
    handleFightDungeonStage,
    closeRewardModal
  } = useAncientDungeonActions({
    player,
    setPlayer,
    addLog,
    showToast
  });

  const activeSet = ANCIENT_MAP_SETS_REGISTRY[selectedSetId] || ANCIENT_MAP_SETS_REGISTRY.thai_co_kiem_chung;
  const currentStones = player.linhThach || 0;
  const activeDungeon = vault.activeDungeon;

  // Tính thời gian đếm ngược phó bản đang mở
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [isDungeonExpired, setIsDungeonExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!activeDungeon || activeDungeon.isCompleted) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = activeDungeon.expiresAt - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setIsDungeonExpired(true);
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (3600 * 1000));
        const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
        setIsDungeonExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDungeon]);

  // Kiểm tra số lượng mảnh hiện có của set đang chọn
  const fragmentCounts = useMemo(() => {
    const inv = vault.fragmentsInventory || {};
    return {
      dong: inv[activeSet.fragments.dong.id] || 0,
      tay: inv[activeSet.fragments.tay.id] || 0,
      nam: inv[activeSet.fragments.nam.id] || 0,
      bac: inv[activeSet.fragments.bac.id] || 0
    };
  }, [vault.fragmentsInventory, activeSet]);

  const hasAllPieces = fragmentCounts.dong >= 1 &&
    fragmentCounts.tay >= 1 &&
    fragmentCounts.nam >= 1 &&
    fragmentCounts.bac >= 1;

  const totalPiecesOwned = (fragmentCounts.dong > 0 ? 1 : 0) +
    (fragmentCounts.tay > 0 ? 1 : 0) +
    (fragmentCounts.nam > 0 ? 1 : 0) +
    (fragmentCounts.bac > 0 ? 1 : 0);

  const hasEnoughStones = currentStones >= activeSet.synthesisCostStones;

  return (
    <div className="space-y-6 animate-fade-in text-zinc-200">
      {/* =================================================================== */}
      {/* 1. HEADER: BANNER GIỚI THIỆU PHÂN HỆ TÀNG BẢO CÁC                   */}
      {/* =================================================================== */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#151221] to-amber-950/60 border border-amber-600/50 shadow-[0_0_30px_rgba(217,119,6,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                Tàng Bảo Các & Thượng Cổ Bí Cảnh
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold">
                Thái Cổ Di Tích
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-serif mt-0.5 max-w-xl leading-relaxed">
              Tĩnh tọa nhập định kích hoạt kỳ ngộ, thu thập 4 mảnh Tàn Đồ Đông - Tây - Nam - Bắc để ngưng tụ Thượng Cổ Bí Khóa, mở ra không gian phó bản trảm ma đoạt Thần Binh vô thượng!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-amber-900/50 text-right">
            <span className="text-[10px] text-zinc-400 block font-serif">Đã Chinh Phục</span>
            <span className="text-sm font-mono font-bold text-amber-300">
              {vault.clearedDungeonsCount || 0} Bí Cảnh
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-yellow-900/50 text-right">
            <span className="text-[10px] text-zinc-400 block font-serif">Linh Thạch Hiện Có</span>
            <span className="text-sm font-mono font-bold text-yellow-400">
              {currentStones.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. NẾU CÓ PHÓ BẢN ĐANG KHAI MỞ (ACTIVE DUNGEON INSTANCE VIEW)        */}
      {/* =================================================================== */}
      {activeDungeon && !activeDungeon.isCompleted && !isDungeonExpired && (
        <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#180f2b] to-[#0d0918] border-2 border-purple-500/70 shadow-[0_0_40px_rgba(168,85,247,0.3)] space-y-5 animate-pulse-border">
          {/* CỔNG KHÔNG GIAN BANNER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-800/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-400 flex items-center justify-center text-xl animate-spin-slow">
                🌌
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-purple-200">
                    {activeDungeon.dungeonName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-500 text-purple-300 font-mono font-bold">
                    Tier {activeDungeon.tier}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-serif">
                  Thông đạo không gian thượng cổ đang mở! Hãy vượt qua 3 ải thử thách để đoạt Thần Binh.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-rose-600/60 shadow">
              <Clock className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-xs text-zinc-400 font-serif">Hạn Giờ Đóng Cửa:</span>
              <span className="text-sm font-mono font-bold text-rose-300 tracking-wider">
                {timeLeft}
              </span>
            </div>
          </div>

          {/* LỘ TRÌNH 3 ẢI (STAGE PATH) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {activeDungeon.stages.map((stage) => {
              const isCurrent = activeDungeon.currentStageIndex === stage.stageIndex;
              const isCleared = stage.isCleared;
              const isLocked = activeDungeon.currentStageIndex < stage.stageIndex;

              return (
                <div
                  key={stage.stageIndex}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isCleared
                      ? 'bg-emerald-950/20 border-emerald-600/50 text-emerald-200'
                      : isCurrent
                        ? 'bg-gradient-to-b from-purple-950/70 to-black/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/50'
                        : 'bg-black/40 border-zinc-800 text-zinc-500 opacity-75'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-serif font-bold">
                      <span className="flex items-center gap-1.5">
                        {isCleared ? '✅' : isCurrent ? '⚔️' : '🔒'} {stage.stageName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 border border-zinc-700">
                        {isCleared ? 'Đã Vượt' : isCurrent ? 'Đang Khiêu Chiến' : 'Đang Khóa'}
                      </span>
                    </div>

                    <div className="font-serif font-bold text-sm text-zinc-100 flex items-center justify-between">
                      <span>{stage.enemyName}</span>
                    </div>
                    <span className="text-[10px] text-amber-300/80 font-serif block">
                      [{stage.enemyTitle}]
                    </span>

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono bg-black/50 p-2 rounded border border-zinc-800/80 text-zinc-400 mt-2">
                      <div>Máu: <span className="text-rose-400">{stage.enemyStats.maxHp.toLocaleString()}</span></div>
                      <div>Công: <span className="text-amber-400">{stage.enemyStats.atk.toLocaleString()}</span></div>
                      <div>Thủ: <span className="text-cyan-400">{stage.enemyStats.def.toLocaleString()}</span></div>
                      <div>Bạo: <span className="text-yellow-400">{stage.enemyStats.critRate}%</span></div>
                    </div>

                    {stage.specialAura && (
                      <p className="text-[10px] text-purple-300 italic pt-1">
                        ✨ {stage.specialAura}
                      </p>
                    )}
                  </div>

                  <div>
                    {isCurrent && (
                      <button
                        onClick={() => handleFightDungeonStage(stage.stageIndex)}
                        disabled={isFighting}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 hover:from-purple-600 hover:to-indigo-500 text-white font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
                      >
                        {isFighting ? (
                          <span>Đang Giao Tranh...</span>
                        ) : (
                          <>
                            <Sword className="w-4 h-4 text-yellow-300" />
                            <span>KHIÊU CHIẾN ẢI {stage.stageIndex}</span>
                          </>
                        )}
                      </button>
                    )}
                    {isCleared && (
                      <div className="w-full py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-center text-xs text-emerald-300 font-serif font-bold">
                        Đã Vượt Qua Viên Mãn
                      </div>
                    )}
                    {isLocked && (
                      <div className="w-full py-1.5 rounded-lg bg-black/40 border border-zinc-800 text-center text-xs text-zinc-500 font-serif">
                        Cần vượt ải trước
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PHẦN THƯỞNG CUỐI CỦA PHÓ BẢN ĐANG MỞ */}
          <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 flex items-center justify-between text-xs font-serif">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-zinc-400">Phần Thưởng Cuối Khi Toàn Thắng:</span>
              <span className="font-bold text-amber-300">
                【{activeDungeon.guaranteedRewards.equipmentName}】 + {activeDungeon.guaranteedRewards.spiritStones.toLocaleString()} Linh Thạch
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              Bảo đảm rơi 100% khi hạ Boss Ải 3
            </span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. SA BÀN GHÉP TÀN ĐỒ BÁT HOANG (JIGSAW SYNTHESIS ALTAR)            */}
      {/* =================================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0d15] border-2 border-amber-700/50 shadow-2xl space-y-6">
        {/* SELECTOR CÁC BỘ TÀN ĐỒ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-amber-300 flex items-center gap-2">
              <span>⚡</span>
              <span>Sa Bàn Ghép Tàn Đồ Bát Hoang</span>
            </h3>
            <p className="text-xs text-zinc-400 font-serif">
              Chọn bộ di tích để quan sát các mảnh cổ quyển đã thu thập và tiến hành hợp nhất bí đồ.
            </p>
          </div>

          {/* TABS CHỌN BỘ */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-zinc-800">
            {Object.values(ANCIENT_MAP_SETS_REGISTRY).map(set => {
              const isSelected = selectedSetId === set.id;
              return (
                <button
                  key={set.id}
                  onClick={() => setSelectedSetId(set.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-700 to-yellow-600 text-white font-bold shadow'
                      : 'text-zinc-400 hover:text-amber-200'
                  }`}
                >
                  <span>{set.shortName}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-black/40 text-amber-200">
                    T{set.tier}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* THÔNG TIN BỘ ĐANG CHỌN */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/30 to-black/40 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-amber-200">
                {activeSet.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Yêu cầu: {activeSet.realmRequirementName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-serif mt-0.5">
              {activeSet.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-400 font-serif">Tiến độ thu thập:</span>
            <span className="text-sm font-mono font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-900/50">
              {totalPiecesOwned}/4 Mảnh
            </span>
          </div>
        </div>

        {/* JIGSAW 4 GÓC: ĐÔNG (TL), TÂY (BL), NAM (TR), BẮC (BR) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GÓC 1: MẢNH ĐÔNG (TRÁI TRÊN) */}
          <FragmentCard
            fragment={activeSet.fragments.dong}
            ownedCount={fragmentCounts.dong}
            directionLabel="Đông (I)"
            corner="Top-Left"
          />

          {/* GÓC 3: MẢNH NAM (PHẢI TRÊN) */}
          <FragmentCard
            fragment={activeSet.fragments.nam}
            ownedCount={fragmentCounts.nam}
            directionLabel="Nam (III)"
            corner="Top-Right"
          />

          {/* GÓC 2: MẢNH TÂY (TRÁI DƯỚI) */}
          <FragmentCard
            fragment={activeSet.fragments.tay}
            ownedCount={fragmentCounts.tay}
            directionLabel="Tây (II)"
            corner="Bottom-Left"
          />

          {/* GÓC 4: MẢNH BẮC (PHẢI DƯỚI) */}
          <FragmentCard
            fragment={activeSet.fragments.bac}
            ownedCount={fragmentCounts.bac}
            directionLabel="Bắc (IV)"
            corner="Bottom-Right"
          />
        </div>

        {/* TRUNG TÂM SA BÀN: NÚT GHÉP BÍ ĐỒ */}
        <div className="pt-2 text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-xs font-serif text-zinc-400">
            <span>Chi phí hợp nhất: <strong className="text-yellow-400 font-mono">{activeSet.synthesisCostStones.toLocaleString()} Linh Thạch</strong></span>
            <span>•</span>
            <span>Tỷ lệ thành công: <strong className="text-emerald-400 font-mono">100%</strong></span>
          </div>

          <button
            onClick={() => handleSynthesizeMap(activeSet.id)}
            disabled={!hasAllPieces || !hasEnoughStones || isSynthesizing}
            className={`w-full max-w-md mx-auto py-3 rounded-xl font-serif font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl ${
              hasAllPieces && hasEnoughStones
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-stone-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse'
                : 'bg-black/50 border border-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isSynthesizing ? (
              <span>Đang Tụ Linh Ngưng Đồ...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-stone-900" />
                <span>
                  {hasAllPieces
                    ? `⚡ HỢP NHẤT BÍ ĐỒ (KHAI THÁI CỔ CẢNH)`
                    : `THU THẬP ĐỦ 4 MẢNH ĐỂ HỢP NHẤT (${totalPiecesOwned}/4)`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. KHO BÍ ĐỒ ĐÃ GHÉP THÀNH CÔNG (SYNTHESIZED MAPS VAULT)              */}
      {/* =================================================================== */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0b0d14] border border-amber-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-amber-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Kho Bí Đồ Hoàn Chỉnh Đã Ghép ({vault.synthesizedMaps?.length || 0})</span>
          </h3>
          <span className="text-[11px] text-zinc-500 font-serif">
            Sử dụng Bí Đồ để khai mở thông đạo vào phó bản cổ đại
          </span>
        </div>

        {(!vault.synthesizedMaps || vault.synthesizedMaps.length === 0) ? (
          <div className="p-8 rounded-xl bg-black/40 border border-dashed border-zinc-800 text-center space-y-1.5">
            <span className="text-3xl block">📜</span>
            <p className="text-xs text-zinc-400 font-serif">
              Chưa có Bí Đồ hoàn chỉnh nào. Hãy thu thập đủ 4 mảnh tàn đồ tại Sa Bàn phía trên để tiến hành hợp nhất!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {vault.synthesizedMaps.map((mapItem) => {
              const setDef = ANCIENT_MAP_SETS_REGISTRY[mapItem.setId];
              const isEligible = (player.currentRealm || 0) >= mapItem.requiredRealmIndex;
              const hasActive = Boolean(activeDungeon && !activeDungeon.isCompleted);

              return (
                <div
                  key={mapItem.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-amber-950/20 via-black/40 to-black/60 border border-amber-700/40 hover:border-amber-500 transition flex flex-col justify-between space-y-3 shadow-md"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-serif font-bold text-sm text-amber-200 flex items-center gap-2">
                        <span>📜</span>
                        <span>{mapItem.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shrink-0">
                        Bậc {mapItem.tier}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 font-serif">
                      {mapItem.description}
                    </p>

                    <div className="text-[11px] font-mono text-zinc-400 bg-black/40 p-2 rounded border border-zinc-800">
                      <div>Đích đến: <span className="text-purple-300 font-bold">{mapItem.targetDungeonName}</span></div>
                      <div>Yêu cầu: <span className={isEligible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{setDef?.realmRequirementName || 'Chưa rõ'}</span></div>
                      <div>Thời gian tồn tại phó bản: <span className="text-amber-300">2 giờ thực tế</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDungeon(mapItem.id)}
                    disabled={!isEligible || hasActive}
                    className={`w-full py-2 rounded-xl font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                      isEligible && !hasActive
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-black/50 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-stone-900" />
                    <span>
                      {hasActive
                        ? 'Đang có phó bản khác mở'
                        : isEligible
                          ? 'MỞ PHÓ BẢN CỔ ĐẠI (2 GIỜ)'
                          : 'Cảnh giới chưa đủ'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. MODAL CHIẾN BÁO & THU HOẠCH THẦN BINH (DIVINE REWARD MODAL)      */}
      {/* =================================================================== */}
      {showRewardModal && lastRewardModalData && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e0c18] border-2 border-yellow-500/80 rounded-2xl shadow-[0_0_60px_rgba(234,179,8,0.5)] text-zinc-200 overflow-hidden flex flex-col p-6 space-y-5 text-center">
            {/* HOẠT ẢNH BẬT MỞ */}
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border-2 border-yellow-400 mx-auto flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(234,179,8,0.5)] animate-bounce">
              👑
            </div>

            <div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 uppercase font-bold tracking-wider">
                Thượng Cổ Thần Binh Xuất Thế
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-400 mt-2">
                {lastRewardModalData.equipmentName}
              </h2>
              <p className="text-xs text-zinc-400 font-serif mt-1">
                Đã đánh bại Boss tối thượng, khai mở kho báu di tích cổ!
              </p>
            </div>

            {/* CARD THUỘC TÍNH THẦN BINH */}
            {lastRewardModalData.equipmentStats && (
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#181328] to-black border border-yellow-600/60 text-left space-y-2.5 shadow-inner">
                <div className="flex items-center justify-between text-xs font-serif font-bold text-yellow-300 border-b border-yellow-900/40 pb-2">
                  <span>Loại: {lastRewardModalData.divineWeaponType || 'Thần Binh Độc Bản'}</span>
                  <span className="font-mono text-emerald-400">
                    Uy Lực: +{lastRewardModalData.equipmentStats.powerBonus.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                  {lastRewardModalData.equipmentStats.atkBonus && (
                    <div>Công Kích: <span className="text-amber-400 font-bold">+{lastRewardModalData.equipmentStats.atkBonus}</span></div>
                  )}
                  {lastRewardModalData.equipmentStats.defBonus && (
                    <div>Phòng Ngự: <span className="text-cyan-400 font-bold">+{lastRewardModalData.equipmentStats.defBonus}</span></div>
                  )}
                  {lastRewardModalData.equipmentStats.hpBonus && (
                    <div>Khí Huyết: <span className="text-rose-400 font-bold">+{lastRewardModalData.equipmentStats.hpBonus.toLocaleString()}</span></div>
                  )}
                  {lastRewardModalData.equipmentStats.mpBonus && (
                    <div>Chân Nguyên: <span className="text-sky-400 font-bold">+{lastRewardModalData.equipmentStats.mpBonus.toLocaleString()}</span></div>
                  )}
                  {lastRewardModalData.equipmentStats.critRateBonus && (
                    <div>Bạo Kích: <span className="text-yellow-400 font-bold">+{lastRewardModalData.equipmentStats.critRateBonus}%</span></div>
                  )}
                  {lastRewardModalData.equipmentStats.critDmgBonus && (
                    <div>Sát Thương Bạo: <span className="text-orange-400 font-bold">+{lastRewardModalData.equipmentStats.critDmgBonus}%</span></div>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 font-serif italic pt-1 border-t border-zinc-800">
                  "{lastRewardModalData.equipmentStats.description}"
                </p>
              </div>
            )}

            {/* TÀI NGUYÊN BỔ SUNG */}
            <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-xs font-serif flex items-center justify-between">
              <span className="text-zinc-400">Linh Thạch Thu Được:</span>
              <span className="font-mono font-bold text-yellow-400">
                +{lastRewardModalData.spiritStones.toLocaleString()} Linh Thạch
              </span>
            </div>

            <button
              onClick={closeRewardModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-stone-950 font-serif font-bold text-xs transition cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.4)]"
            >
              THU NẠP VÀO TÚI TRỮ VẬT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT PHỤ: THẺ HIỂN THỊ TỪNG MẢNH TÀN ĐỒ (FRAGMENT CARD)
// ============================================================================
interface FragmentCardProps {
  fragment: import('@/lib/types/ancient-map-dungeon').MapFragmentItem;
  ownedCount: number;
  directionLabel: string;
  corner: string;
}

const FragmentCard: React.FC<FragmentCardProps> = ({
  fragment,
  ownedCount,
  directionLabel,
  corner
}) => {
  const isOwned = ownedCount > 0;

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-2 relative overflow-hidden ${
        isOwned
          ? 'bg-gradient-to-br from-amber-950/40 via-black/60 to-yellow-950/30 border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          : 'bg-black/50 border-zinc-800/80 opacity-60'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-black/60 border border-zinc-700 text-amber-300">
            {directionLabel}
          </span>
          {isOwned ? (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Đã Sở Hữu x{ownedCount}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-500 italic">
              [Chưa Khai Phá]
            </span>
          )}
        </div>

        <div className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
          <span>{isOwned ? '📜' : '🔒'}</span>
          <span className={isOwned ? 'text-amber-200' : 'text-zinc-400'}>
            {fragment.setName} • Mảnh {DIRECTION_NAMES[fragment.direction]}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 font-serif leading-relaxed">
          {isOwned ? fragment.description : 'Mảnh tàn đồ còn thất lạc trong các mốc giờ nhập định hoặc tại các hiểm cảnh thượng cổ.'}
        </p>

        {isOwned && fragment.lore && (
          <p className="text-[10px] text-amber-300/80 font-serif italic pt-1 border-t border-amber-900/30">
            "{fragment.lore}"
          </p>
        )}
      </div>

      <div className="pt-1 text-[9px] text-zinc-500 font-serif flex items-center justify-between">
        <span>Góc vị: {corner}</span>
        <span>Phẩm: Bậc {fragment.rarityTier}</span>
      </div>
    </div>
  );
};
