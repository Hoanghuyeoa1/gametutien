// components/abode/SanctuaryVeinView.tsx
// Giao diện Cổ Phong Phân Khu "Linh Mạch Thần Đài & Khảm Nạp Trận Bàn"
// (Custom Sanctuary & Vein Socketing — Tự Chế Linh Địa Độc Quyền)

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Coins,
  Lock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Layers,
  Flame,
  Droplets,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { PlayerStats, FormationItem, LogType } from '@/lib/types';
import {
  SANCTUARY_VEIN_CONFIG,
  SANCTUARY_RESONANCES_REGISTRY,
  CUSTOM_SANCTUARY_LOCATION_ID
} from '@/lib/custom-sanctuary-logic';
import { useCustomSanctuaryActions } from '@/hooks/useCustomSanctuaryActions';

export interface SanctuaryVeinViewProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  onNavigateToMeditation?: (locationId: string) => void;
  onCloseParentModal?: () => void;
}

export const SanctuaryVeinView: React.FC<SanctuaryVeinViewProps> = ({
  player,
  setPlayer,
  addLog,
  showToast,
  onNavigateToMeditation,
  onCloseParentModal
}) => {
  const {
    sanctuaryState,
    buffTotals,
    currentVeinConfig,
    nextVeinConfig,
    upgradeValidation,
    availableFormations,
    selectedSocketIndex,
    setSelectedSocketIndex,
    isSelectArrayModalOpen,
    setIsSelectArrayModalOpen,
    isRenameModalOpen,
    setIsRenameModalOpen,
    tempName,
    setTempName,
    handleUpgradeVein,
    handleSocketArray,
    handleUnsocketArray,
    handleRenameSanctuary,
    handleQuickMeditateAtSanctuary
  } = useCustomSanctuaryActions({
    player,
    setPlayer,
    addLog,
    showToast,
    onNavigateToMeditation
  });

  const [inputName, setInputName] = useState<string>(
    sanctuaryState.customLocationName || `${player.name || 'Đạo Hữu'} • Tiên Phủ Động Thiên`
  );

  const ownedLinhThach = player.linhThach || 0;
  const ownedEssence = player.inventory?.forgingEssence || 0;

  // Socket slot positions & status mapping (1 - 5 slots)
  const socketSlots = Array.from({ length: 5 }, (_, idx) => {
    const isUnlocked = idx < sanctuaryState.unlockedSockets;
    const socketedData = sanctuaryState.socketedArrays.find(s => s.socketIndex === idx);
    let requiredTierToUnlock = 1;
    if (idx === 1) requiredTierToUnlock = 3;
    if (idx === 2) requiredTierToUnlock = 5;
    if (idx === 3) requiredTierToUnlock = 7;
    if (idx === 4) requiredTierToUnlock = 9;

    return {
      index: idx,
      isUnlocked,
      socketedData,
      requiredTierToUnlock
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ======================================================== */}
      {/* 1. TOP HEADER BANNER: SANCTUARY IDENTITY & QUICK ACTIONS */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-[#0d1418] to-emerald-950/30 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 overflow-hidden shadow-lg">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-950/60 border border-teal-500/50 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(20,184,166,0.3)] shrink-0">
            {currentVeinConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-serif font-bold text-teal-200">
                {sanctuaryState.customLocationName || `${player.name || 'Đạo Hữu'} • Tiên Phủ Động Thiên`}
              </h3>
              <button
                onClick={() => {
                  setInputName(sanctuaryState.customLocationName || `${player.name || 'Đạo Hữu'} • Tiên Phủ Động Thiên`);
                  setIsRenameModalOpen(true);
                }}
                className="p-1 rounded text-teal-400 hover:text-teal-200 hover:bg-teal-900/40 transition cursor-pointer"
                title="Đổi tên Linh Địa Độc Quyền"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 font-serif flex items-center gap-1.5 mt-0.5">
              <span>{currentVeinConfig.name}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-teal-300 font-mono">Bậc {sanctuaryState.veinTier}/9</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-300 font-mono">Trận Nhãn: {sanctuaryState.socketedArrays.length}/{sanctuaryState.unlockedSockets}</span>
            </p>
          </div>
        </div>

        {/* Quick Meditate Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              handleQuickMeditateAtSanctuary();
              if (onCloseParentModal) onCloseParentModal();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-stone-950 font-serif font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🧘</span>
            <span>Nhập Định Tại Động Phủ</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TRẬN ĐỒ BÁT QUÁI TRUNG TÂM (CENTRAL SOCKETING ALTAR) */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl border border-teal-500/30 bg-gradient-to-b from-[#0e171b] via-[#091014] to-[#070b0e] p-6 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(20,184,166,0.15)]">
        {/* Ambient Halo */}
        <div className="absolute w-96 h-96 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

        {/* Central Vein Core */}
        <div className="relative flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-teal-500/40 flex items-center justify-center bg-teal-950/40 shadow-[0_0_35px_rgba(20,184,166,0.35)]">
            <div className="absolute inset-1 rounded-full border border-dashed border-teal-400/40 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border border-emerald-400/20 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="text-4xl sm:text-5xl select-none filter drop-shadow-[0_0_15px_rgba(20,184,166,0.8)] animate-pulse">
              {currentVeinConfig.icon}
            </div>
            <div className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-teal-900 border border-teal-400 text-teal-200 text-[10px] sm:text-xs font-mono font-bold shadow-md whitespace-nowrap">
              BẬC {sanctuaryState.veinTier} • TIÊN MẠCH
            </div>
          </div>
          <div className="mt-4 text-center">
            <h4 className="text-sm sm:text-base font-serif font-bold text-teal-200">
              {currentVeinConfig.name}
            </h4>
            <p className="text-[11px] text-zinc-400 max-w-sm mt-0.5">
              {currentVeinConfig.description}
            </p>
          </div>
        </div>

        {/* 5 Socket Slots Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {socketSlots.map(slot => {
            // Case 1: Slot chưa mở khóa
            if (!slot.isUnlocked) {
              return (
                <div
                  key={slot.index}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 flex flex-col items-center justify-center text-center opacity-60 min-h-[140px]"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-2">
                    <Lock className="w-5 h-5 text-zinc-500" />
                  </div>
                  <span className="text-xs font-serif font-bold text-zinc-400">
                    Trận Nhãn #{slot.index + 1}
                  </span>
                  <span className="text-[10px] text-amber-500/80 font-mono mt-1">
                    🔒 Bậc {slot.requiredTierToUnlock} Mở Khóa
                  </span>
                </div>
              );
            }

            // Case 2: Slot đã khảm Trận Bàn
            if (slot.socketedData) {
              const arr = slot.socketedData;
              return (
                <div
                  key={slot.index}
                  className="relative rounded-xl border border-amber-500/60 bg-gradient-to-b from-amber-950/40 via-[#151218] to-purple-950/30 p-3 flex flex-col justify-between shadow-[0_0_20px_rgba(245,158,11,0.2)] min-h-[140px] hover:border-amber-400 transition"
                >
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Nhãn #{slot.index + 1}
                    </span>
                    {arr.isPermanent && (
                      <span className="text-[9px] font-serif px-1 py-0.2 rounded bg-red-950/80 text-rose-300 border border-rose-500/40">
                        Bất Hủ
                      </span>
                    )}
                  </div>

                  {/* Array Name & Tier */}
                  <div className="my-2">
                    <div className="text-xs font-serif font-bold text-amber-100 line-clamp-1" title={arr.arrayName}>
                      {arr.arrayName}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <span className="text-purple-300 font-mono">Giai {arr.arrayTier}</span>
                      <span>•</span>
                      <span className="capitalize text-teal-300">{arr.element || 'Hỗn Độn'}</span>
                    </div>
                  </div>

                  {/* Unsocket Button */}
                  <button
                    onClick={() => handleUnsocketArray(slot.index)}
                    className="w-full py-1 rounded-lg bg-zinc-900/80 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/50 text-[10px] font-serif transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Gỡ Bỏ</span>
                  </button>
                </div>
              );
            }

            // Case 3: Slot trống sẵn sàng khảm
            return (
              <div
                key={slot.index}
                onClick={() => {
                  setSelectedSocketIndex(slot.index);
                  setIsSelectArrayModalOpen(true);
                }}
                className="rounded-xl border border-dashed border-teal-500/40 hover:border-teal-400 bg-teal-950/20 hover:bg-teal-950/40 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] min-h-[140px] group"
              >
                <div className="w-10 h-10 rounded-full bg-teal-900/40 border border-teal-500/40 group-hover:scale-110 flex items-center justify-center text-teal-400 mb-2 transition">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-serif font-bold text-teal-200">
                  Trận Nhãn #{slot.index + 1}
                </span>
                <span className="text-[10px] text-teal-400/80 mt-1 font-serif">
                  [+ Khảm Nạp Trận Bàn]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ACTIVE RESONANCES (BẢNG TỔ HỢP DỊ TƯỢNG ĐANG KÍCH HOẠT) */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-[#100d1a] to-indigo-950/30 p-5 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h4 className="text-sm sm:text-base font-serif font-bold text-purple-200">
              Dị Tượng Linh Mạch Độc Bản (Cộng Hưởng Trận Đồ)
            </h4>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {sanctuaryState.activeResonances.length} / {SANCTUARY_RESONANCES_REGISTRY.length} Kích Hoạt
          </span>
        </div>

        {sanctuaryState.activeResonances.length === 0 ? (
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center">
            <p className="text-xs text-zinc-400 font-serif">
              Chưa kích hoạt Dị Tượng nào. Hãy khảm nạp tổ hợp Trận Bàn tương thích (2 Tụ Linh, Tụ Linh + Thanh Tâm, Trận Ngũ Hành tương sinh...) để đánh thức uy năng linh mạch!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sanctuaryState.activeResonances.map(combo => (
              <div
                key={combo.id}
                className="p-3 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-purple-950/30 flex items-start gap-2.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-sm shrink-0">
                  ✨
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-serif font-bold text-amber-200">
                      {combo.name}
                    </h5>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                      Cộng Hưởng
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-snug">
                    {combo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buff Summary Bar */}
        <div className="mt-4 pt-3.5 border-t border-purple-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20">
            <span className="text-[10px] text-zinc-400 block font-serif">Hệ Số Tu Vi Bế Quan:</span>
            <span className="text-sm font-bold text-purple-300">
              x{buffTotals.totalTuviMultiplier}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20">
            <span className="text-[10px] text-zinc-400 block font-serif">Hấp Thu Ngoại Tuyến:</span>
            <span className="text-sm font-bold text-teal-300">
              +{((buffTotals.offlineAbsorptionBonus || 0) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20">
            <span className="text-[10px] text-zinc-400 block font-serif">Tẩy Độc / Trừ Ma:</span>
            <span className="text-sm font-bold text-emerald-300">
              -{buffTotals.pillToxicityCleansePerHour || 0}/giờ
            </span>
          </div>
          <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/20">
            <span className="text-[10px] text-zinc-400 block font-serif">Sản Lượng Dược Viên:</span>
            <span className="text-sm font-bold text-amber-300">
              +{((buffTotals.gardenYieldBonus || 0) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. VEIN PROGRESSION PANEL (BỒI DƯỠNG & THĂNG PHẨM LINH MẠCH) */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/20 via-[#0e161a] to-emerald-950/20 p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            <h4 className="text-sm sm:text-base font-serif font-bold text-teal-200">
              Bồi Dưỡng & Thăng Phẩm Linh Mạch
            </h4>
          </div>

          {nextVeinConfig ? (
            <span className="text-xs font-serif text-zinc-400">
              Mục tiêu kế tiếp: <strong className="text-teal-300">{nextVeinConfig.name}</strong>
            </span>
          ) : (
            <span className="text-xs font-serif text-amber-300 font-bold">
              👑 Đã đạt Cửu Phẩm Hỗn Độn Tiên Mạch Tối Cực!
            </span>
          )}
        </div>

        {nextVeinConfig && (
          <div className="space-y-3">
            {/* Cost Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Linh Thạch */}
              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-serif">Linh Thạch:</span>
                <span className={`text-xs font-mono font-bold ${ownedLinhThach >= nextVeinConfig.costLinhThach ? 'text-teal-300' : 'text-rose-400'}`}>
                  {ownedLinhThach.toLocaleString()} / {nextVeinConfig.costLinhThach.toLocaleString()}
                </span>
              </div>

              {/* Tinh Hoa Rèn Đúc */}
              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-serif">Tinh Hoa Rèn Đúc:</span>
                <span className={`text-xs font-mono font-bold ${ownedEssence >= nextVeinConfig.costForgingEssence ? 'text-teal-300' : 'text-rose-400'}`}>
                  {ownedEssence.toLocaleString()} / {nextVeinConfig.costForgingEssence.toLocaleString()}
                </span>
              </div>

              {/* Cảnh Giới */}
              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-serif">Cảnh Giới Tối Thiểu:</span>
                <span className={`text-xs font-mono font-bold ${(player.currentRealm || 0) >= nextVeinConfig.requiredRealmIndex ? 'text-teal-300' : 'text-rose-400'}`}>
                  Mốc Index {nextVeinConfig.requiredRealmIndex}
                </span>
              </div>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={handleUpgradeVein}
              disabled={!upgradeValidation.canUpgrade}
              className={`w-full py-2.5 rounded-xl font-serif font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                upgradeValidation.canUpgrade
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-stone-950 shadow-[0_0_20px_rgba(20,184,166,0.35)]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {upgradeValidation.canUpgrade
                  ? `⚡ BỒI DƯỠNG LINH MẠCH • ĐỘT PHÁ LÊN [${nextVeinConfig.name}]`
                  : (upgradeValidation.reason || 'Chưa đủ điều kiện thăng phẩm')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CHỌN TRẬN BÀN ĐỂ KHẢM */}
      {/* ======================================================== */}
      {isSelectArrayModalOpen && selectedSocketIndex !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-teal-500/50 bg-[#10171a] p-5 shadow-2xl text-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h4 className="text-sm font-serif font-bold text-teal-200 flex items-center gap-2">
                <span>☯️</span>
                <span>Khảm Nạp Trận Bàn Vào Trận Nhãn #{selectedSocketIndex + 1}</span>
              </h4>
              <button
                onClick={() => {
                  setIsSelectArrayModalOpen(false);
                  setSelectedSocketIndex(null);
                }}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 max-h-64 overflow-y-auto space-y-2 pr-1">
              {availableFormations.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 font-serif">
                  Túi đồ hiện không có Trận Bàn nào khả dụng. Hãy chế tác thêm Trận Bàn tại Trận Pháp Các!
                </div>
              ) : (
                availableFormations.map((arr: FormationItem) => (
                  <div
                    key={arr.id}
                    onClick={() => handleSocketArray(selectedSocketIndex, arr.id)}
                    className="p-3 rounded-xl border border-zinc-800 hover:border-teal-500/60 bg-zinc-900/40 hover:bg-teal-950/30 flex items-center justify-between cursor-pointer transition group"
                  >
                    <div>
                      <div className="text-xs font-serif font-bold text-amber-200 group-hover:text-teal-200">
                        {arr.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-purple-300 font-mono">Bậc {arr.tier}</span>
                        <span>•</span>
                        <span className="capitalize text-teal-300">{arr.element || 'Hỗn Độn'}</span>
                        {arr.isPermanent && (
                          <span className="text-rose-400 font-serif">[Bất Hủ]</span>
                        )}
                      </div>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-stone-950 font-serif text-[11px] font-bold">
                      Khảm Nạp
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ĐỔI TÊN LINH ĐỊA ĐỘC QUYỀN */}
      {/* ======================================================== */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-teal-500/50 bg-[#10171a] p-5 shadow-2xl text-zinc-200">
            <h4 className="text-sm font-serif font-bold text-teal-200 mb-3 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-teal-400" />
              <span>Đặt Danh Xưng Linh Địa Độc Quyền</span>
            </h4>
            <p className="text-xs text-zinc-400 mb-3 font-serif">
              Danh xưng này sẽ hiển thị trang trọng trong danh mục Thiên Địa Nhập Định của toàn cõi tu chân.
            </p>
            <input
              type="text"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              maxLength={25}
              placeholder="Nhập danh xưng tiên phủ..."
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-teal-500/40 text-teal-200 text-xs font-serif focus:outline-none focus:border-teal-400 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-serif hover:bg-zinc-700"
              >
                Hủy
              </button>
              <button
                onClick={() => handleRenameSanctuary(inputName)}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-stone-950 font-serif font-bold text-xs shadow-md"
              >
                Xác Nhận Đổi Tên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
