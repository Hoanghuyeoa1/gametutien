import React, { useState } from 'react';
import {
  Swords,
  Backpack,
  Save,
  RotateCcw,
  Coins,
  ChevronDown,
  Volume2,
  VolumeX,
  Volume1,
  Music,
  Sliders,
  Trophy,
  Award,
  Scroll
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';
import { useSound, UseSoundReturn } from '@/hooks';
import { getTitleDefinition } from '@/lib/achievements-data';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu';

export interface HeaderNavProps {
  combatPower: number;
  currentRealm: { name: string; emoji: string; [key: string]: any };
  player: PlayerStats;
  isInventoryFull: boolean;
  isInventoryNearFull: boolean;
  usedSlots: number;
  maxSlots: number;
  setActiveTab: (tab: TabType) => void;
  handleSaveProgress: () => void;
  openRebornModal: () => void;
  sound?: UseSoundReturn;
  openAchievementsModal?: () => void;
  unclaimedAchievementsCount?: number;
  openStorylineModal?: () => void;
  hasStorylineUnclaimed?: boolean;
  openAuctionModal?: () => void;
  openAbodeModal?: () => void;
  hasAbodeNotification?: boolean;
  openPhysiqueModal?: () => void;
  hasPhysiqueNotification?: boolean;
  openSoulModal?: () => void;
  hasSoulNotification?: boolean;
  openCosmicMapModal?: () => void;
  openSaveModal?: () => void;
  openMemorialModal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  combatPower,
  currentRealm,
  player,
  isInventoryFull,
  isInventoryNearFull,
  usedSlots,
  maxSlots,
  setActiveTab,
  handleSaveProgress,
  openRebornModal,
  sound,
  openAchievementsModal,
  unclaimedAchievementsCount = 0,
  openStorylineModal,
  hasStorylineUnclaimed = false,
  openAuctionModal,
  openAbodeModal,
  hasAbodeNotification = false,
  openPhysiqueModal,
  hasPhysiqueNotification = false,
  openSoulModal,
  hasSoulNotification = false,
  openCosmicMapModal,
  openSaveModal,
  openMemorialModal,
}) => {
  const fallbackSound = useSound();
  const soundCtrl = sound || fallbackSound;
  const [showSoundPopover, setShowSoundPopover] = useState(false);
  return (
    <header className="border-b border-amber-900/30 bg-[#0d0d12]/90 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-4 py-1.5 sm:py-2">
      <div className="w-full max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo & Tiêu đề game */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-600/30 to-amber-900/20 border border-amber-500/40 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(217,119,6,0.2)]">
            ☯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-serif leading-none">
                TU TIÊN CHI LỘ
              </h1>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full border border-amber-600/40 bg-amber-950/40 text-amber-400 uppercase tracking-widest font-mono">
                Text-RPG
              </span>
            </div>
            <p className="text-[11px] text-amber-200/50 leading-tight mt-0.5">Vấn Đỉnh Trường Sinh • Vạn Giới Độc Tôn</p>
          </div>
        </div>

        {/* Cảnh giới & Chiến Lực tóm tắt & Các nút điều khiển */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Huy hiệu Kiếp Tu Luân Hồi Header */}
          {(player.reincarnationState?.totalRebornTimes ?? 0) > 0 && (
            <div
              onClick={openRebornModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/60 bg-gradient-to-r from-purple-950/70 to-indigo-950/60 text-xs shadow-[0_0_12px_rgba(168,85,247,0.35)] cursor-pointer hover:border-purple-400 transition"
              title="Nhấp để xem Lục Đạo Luân Hồi & Đạo Vận Kế Thừa"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
              <span className="text-purple-300 font-serif font-bold text-[11px]">
                Kiếp Thứ {(player.reincarnationState?.totalRebornTimes ?? 0) + 1}
              </span>
            </div>
          )}

          {/* Nút Lục Đạo Tiên Bi */}
          {openMemorialModal && (
            <button
              type="button"
              onClick={openMemorialModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-700/80 bg-stone-900/80 hover:bg-stone-800 text-xs shadow-[0_0_10px_rgba(217,119,6,0.15)] cursor-pointer hover:border-amber-500/60 transition group"
              title="Lục Đạo Tiên Bi • Xem bia mộ và văn bia các tiền kiếp"
            >
              <span className="text-xs group-hover:scale-110 transition-transform">🏛️</span>
              <span className="text-stone-300 group-hover:text-amber-300 font-serif font-semibold text-[11px] hidden sm:inline">
                Tiên Bi
              </span>
              {(player.reincarnationState?.pastLives?.length ?? 0) > 0 && (
                <span className="text-[10px] font-mono px-1 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300">
                  {player.reincarnationState?.pastLives?.length}
                </span>
              )}
            </button>
          )}

          {/* Huy hiệu Chiến Lực Header */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/50 bg-gradient-to-r from-amber-950/50 to-[#1c1614] text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400/80 font-serif text-[11px]">Chiến Lực:</span>
            <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
              {combatPower.toLocaleString()}
            </span>
          </div>

          {/* Huy hiệu Linh Thạch Đa Tầng Header (Hover hiện chi tiết 5 cấp) */}
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('inventory')}>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-[#181410] to-[#121218] text-xs shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:border-amber-400/70 transition">
              <Coins className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-zinc-400 font-serif leading-none flex items-center gap-1">
                  Linh Thạch <ChevronDown className="w-2 h-2 text-zinc-500 group-hover:text-amber-400 transition" />
                </span>
                <span className="font-mono font-bold text-amber-300 text-xs leading-tight">
                  {player.linhThach.toLocaleString()} <span className="text-[9px] font-normal text-amber-400/80">Hạ Phẩm</span>
                </span>
              </div>
            </div>

            {/* Dropdown / Hover Popover chi tiết 5 Cấp Bậc Linh Thạch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 rounded-xl bg-[#0c0c14]/95 backdrop-blur-xl border border-amber-600/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-1.5">
                <span className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-yellow-400" /> Ngân Khố Linh Thạch
                </span>
                <span className="text-[9px] text-amber-400/80 font-mono">Tỷ Giá 1:1,000</span>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono">
                {/* 1. Hạ Phẩm */}
                <div className="flex justify-between items-center p-1 rounded bg-black/40 border border-zinc-800">
                  <span className="text-zinc-300">1. Hạ Phẩm:</span>
                  <span className="text-amber-300 font-bold">{player.linhThach.toLocaleString()}</span>
                </div>
                {/* 2. Trung Phẩm */}
                <div className="flex justify-between items-center p-1 rounded bg-emerald-950/20 border border-emerald-900/30">
                  <span className="text-emerald-400">2. Trung Phẩm:</span>
                  <span className="text-emerald-300 font-bold">{(player.trungPhamLinhThach || 0).toLocaleString()}</span>
                </div>
                {/* 3. Thượng Phẩm */}
                <div className="flex justify-between items-center p-1 rounded bg-sky-950/20 border border-sky-900/30">
                  <span className="text-sky-400">3. Thượng Phẩm:</span>
                  <span className="text-sky-300 font-bold">{(player.thuongPhamLinhThach || 0).toLocaleString()}</span>
                </div>
                {/* 4. Cực Phẩm */}
                <div className="flex justify-between items-center p-1 rounded bg-purple-950/25 border border-purple-900/40">
                  <span className="text-purple-400">4. Cực Phẩm:</span>
                  <span className="text-purple-300 font-bold">{(player.cucPhamLinhThach || 0).toLocaleString()}</span>
                </div>
                {/* 5. Tiên Phẩm */}
                <div className="flex justify-between items-center p-1 rounded bg-rose-950/25 border border-rose-900/40">
                  <span className="text-rose-400">5. Tiên Phẩm:</span>
                  <span className="text-rose-300 font-bold">{((player.tienTinh || player.tienPhamLinhThach || 0)).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-amber-900/30 text-[10px] text-zinc-400 flex justify-between items-center">
                <span>Tổng giá trị quy đổi:</span>
                <span className="text-amber-300 font-mono font-semibold">
                  {calculateTotalEquivalentHaPham(player).toLocaleString()} Hạ Phẩm
                </span>
              </div>
              <div className="text-[9px] text-amber-400/70 italic text-center">
                (Bấm vào để mở Tệ Điếm / Đổi Linh Thạch)
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-900/40 bg-[#14141c] text-xs">
            <span className="text-amber-400/70 text-[11px]">Cảnh giới:</span>
            <span className="font-semibold text-amber-300 text-xs">
              {currentRealm.emoji} {currentRealm.name}
            </span>
          </div>

          {/* Danh Hiệu Tiên Giới Đã Trang Bị */}
          {(() => {
            const equippedId = player.achievementsState?.equippedTitleId;
            const titleDef = equippedId ? getTitleDefinition(equippedId) : null;
            if (!titleDef) return null;
            return (
              <button
                onClick={openAchievementsModal}
                className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-serif transition cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${titleDef.badgeClass}`}
                title={`Danh Hiệu: ${titleDef.name}\n${titleDef.description}\n(Bấm để đổi Danh Hiệu & Thành Tựu)`}
              >
                <span>{titleDef.icon || '🎖️'}</span>
                <span className="font-bold tracking-wide text-xs">{titleDef.name}</span>
              </button>
            );
          })()}

          {/* Nút & Huy hiệu Túi Đồ Header */}
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition shadow-sm ${
              isInventoryFull
                ? 'border-rose-500/70 bg-rose-950/60 text-rose-300 animate-pulse'
                : isInventoryNearFull
                ? 'border-amber-500/60 bg-amber-950/40 text-amber-300'
                : 'border-emerald-800/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-500/40'
            }`}
            title={`${player.storageBag?.name || 'Túi Trữ Vật'}: ${usedSlots}/${maxSlots >= 9999 ? '∞' : maxSlots} ô`}
          >
            <Backpack className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-serif hidden md:inline text-xs">{player.storageBag?.name || 'Túi Đồ'}</span>
            <span className="font-mono font-bold text-xs">
              [{usedSlots}/{maxSlots >= 9999 ? '∞' : maxSlots}]
            </span>
          </button>

          {/* Nút Điều Khiển Âm Thanh & Popover Ngũ Cung */}
          <div className="relative">
            <div className="flex items-center rounded-lg border border-amber-800/40 bg-[#14141c] p-0.5 shadow-sm hover:border-amber-600/60 transition">
              {/* Nút Mute / Unmute nhanh */}
              <button
                onClick={soundCtrl.toggleMute}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs cursor-pointer text-amber-300 hover:text-amber-100 transition"
                title={soundCtrl.settings.isMuted ? 'Đang tắt tiếng (Bấm để bật)' : 'Đang bật tiếng (Bấm để tắt)'}
              >
                {soundCtrl.settings.isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                ) : soundCtrl.settings.bgmEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                ) : (
                  <Volume1 className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span className="font-serif hidden sm:inline text-[11px]">
                  {soundCtrl.settings.isMuted ? 'Tắt Tiếng' : 'Âm Thanh'}
                </span>
              </button>

              {/* Nút Mở Popover Cài Đặt */}
              <button
                onClick={() => setShowSoundPopover(!showSoundPopover)}
                className="px-1.5 py-1 text-zinc-400 hover:text-amber-300 border-l border-zinc-800 transition cursor-pointer"
                title="Cài đặt Âm lượng Nhạc Nền (BGM) & Hiệu Ứng (SFX)"
              >
                <Sliders className="w-3 h-3" />
              </button>
            </div>

            {/* Popover Bảng Điều Khiển Âm Thanh */}
            {showSoundPopover && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSoundPopover(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#0c0c14]/95 backdrop-blur-xl border border-amber-600/50 shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Popover */}
                  <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                    <span className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-amber-400" /> Âm Thanh Tiên Hiệp
                    </span>
                    <button
                      onClick={soundCtrl.toggleMute}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border transition cursor-pointer ${
                        soundCtrl.settings.isMuted
                          ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                          : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                      }`}
                    >
                      {soundCtrl.settings.isMuted ? '🔇 Đã Tắt' : '🔊 Đang Bật'}
                    </button>
                  </div>

                  {/* Thanh trượt BGM */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-serif">
                      <span className="text-zinc-300 flex items-center gap-1">
                        Nhạc Nền (BGM):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={soundCtrl.toggleBgm}
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono cursor-pointer border ${
                            soundCtrl.settings.bgmEnabled
                              ? 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {soundCtrl.settings.bgmEnabled ? 'Bật' : 'Tắt'}
                        </button>
                        <span className="text-amber-400 font-mono font-bold text-[10px]">
                          {Math.round(soundCtrl.settings.bgmVolume * 100)}%
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundCtrl.settings.bgmVolume}
                      onChange={e => soundCtrl.setBgmVolume(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="text-[9px] text-zinc-500 font-serif italic">
                      Thiền định Solfeggio & Chuông Ngũ Cung
                    </div>
                  </div>

                  {/* Thanh trượt SFX */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-serif">
                      <span className="text-zinc-300">Hiệu Ứng (SFX):</span>
                      <span className="text-sky-400 font-mono font-bold text-[10px]">
                        {Math.round(soundCtrl.settings.sfxVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundCtrl.settings.sfxVolume}
                      onChange={e => soundCtrl.setSfxVolume(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <div className="text-[9px] text-zinc-500 font-serif italic">
                      Kiếm khí, lôi kiếp, đan hỏa
                    </div>
                  </div>

                  {/* Thử âm thanh mẫu */}
                  <div className="pt-2 border-t border-amber-900/30">
                    <div className="text-[10px] text-zinc-400 font-serif mb-1.5">Thử nghiệm hiệu ứng:</div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-serif">
                      <button
                        onClick={() => soundCtrl.playSFX('slash', true)}
                        className="p-1 rounded bg-zinc-900/80 border border-zinc-800 hover:border-amber-600/50 text-amber-200 transition cursor-pointer text-center"
                      >
                        ⚔️ Kiếm Khí
                      </button>
                      <button
                        onClick={() => soundCtrl.playSFX('thunder')}
                        className="p-1 rounded bg-zinc-900/80 border border-zinc-800 hover:border-purple-600/50 text-purple-200 transition cursor-pointer text-center"
                      >
                        ⚡ Thiên Lôi
                      </button>
                      <button
                        onClick={() => soundCtrl.playSFX('alchemy')}
                        className="p-1 rounded bg-zinc-900/80 border border-zinc-800 hover:border-emerald-600/50 text-emerald-200 transition cursor-pointer text-center"
                      >
                        🔮 Đan Hỏa
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Nút Cuộn Tranh Cốt Truyện */}
          <button
            onClick={openStorylineModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/60 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-[#1e171b] hover:border-amber-400 text-amber-200 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.35)]"
            title="Cuộn Tranh Cốt Truyện • Nhiệm Vụ Chính Tuyến"
          >
            <Scroll className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline font-medium text-xs">Cốt Truyện</span>
            {hasStorylineUnclaimed && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-ping shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
            )}
            {hasStorylineUnclaimed && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
            )}
          </button>

          {/* Nút Động Thiên Phúc Địa */}
          <button
            onClick={openAbodeModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-teal-500/60 bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-cyan-950/60 hover:border-teal-400 text-teal-200 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.35)]"
            title="Động Thiên Phúc Địa (Homestead & Abode Core)"
          >
            <span className="text-xs">🏯</span>
            <span className="hidden sm:inline font-bold text-xs">Động Phủ</span>
            {hasAbodeNotification && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-ping shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
            )}
            {hasAbodeNotification && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
            )}
          </button>

          {/* Nút Huyền Công Luyện Thể (Nhục Thân) */}
          <button
            onClick={openPhysiqueModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-600/70 bg-gradient-to-r from-red-950/70 via-amber-950/50 to-orange-950/60 hover:border-amber-400 text-amber-200 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.35)]"
            title="Huyền Công Luyện Thể (Cảnh Giới Nhục Thân & Cường Hóa Bộ Phận)"
          >
            <span className="text-xs">💪</span>
            <span className="hidden sm:inline font-bold text-xs">Nhục Thân</span>
            {hasPhysiqueNotification && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-ping shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
            )}
            {hasPhysiqueNotification && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
            )}
          </button>

          {/* Nút Thức Hải Thần Hồn */}
          <button
            onClick={openSoulModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-500/70 bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-cyan-950/60 hover:border-indigo-400 text-indigo-200 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            title="Thức Hải Thần Hồn (Cảnh Giới Thần Thức & Trấn Nhiếp Tâm Ma)"
          >
            <span className="text-xs">🔮</span>
            <span className="hidden sm:inline font-bold text-xs">Thần Hồn</span>
            {hasSoulNotification && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-ping shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
            )}
            {hasSoulNotification && (
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
            )}
          </button>

          {/* Nút Chư Thiên Tinh Đồ (Mở khi Phi Thăng Realm >= 51) */}
          {player.currentRealm >= 51 && (
            <button
              onClick={openCosmicMapModal}
              className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-500/70 bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-purple-950/60 hover:border-blue-400 text-blue-200 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse-slow"
              title="Chư Thiên Tinh Đồ • Thái Cổ Tinh Mạch — Du hành Tam Đại Tinh Vực, khai thác Hỗn Độn Thần Thiết & đúc Tier 9 Thần Binh"
            >
              <span className="text-sm">🌌</span>
              <span className="hidden sm:inline font-bold text-xs">Tinh Đồ</span>
              {(player.cosmicState?.cargo?.honDonThanThiet ?? 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-blue-400 border border-blue-200 animate-ping shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
              )}
              {(player.cosmicState?.cargo?.honDonThanThiet ?? 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-blue-400 border border-blue-200" />
              )}
            </button>
          )}

          {/* Nút Vạn Bảo Đấu Giá Đại Hội */}
          <button
            onClick={openAuctionModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-yellow-500/60 bg-gradient-to-r from-amber-950/70 via-yellow-950/40 to-purple-950/60 hover:border-yellow-400 text-yellow-300 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(234,179,8,0.35)]"
            title="Vạn Bảo Đấu Giá Đại Hội (Bidding War & Săn Dị Bảo)"
          >
            <span className="text-xs">🔨</span>
            <span className="hidden sm:inline font-bold text-xs">Đấu Giá Hội</span>
            <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[8px] font-mono font-bold animate-pulse">
              HOT
            </span>
          </button>

          {/* Nút Thành Tựu & Danh Hiệu */}
          <button
            onClick={openAchievementsModal}
            className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-600/50 bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-[#1c1614] hover:border-amber-400 text-amber-300 text-xs font-serif transition cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            title="Thành Tựu & Danh Hiệu Tiên Giới"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium text-xs">Thành Tựu</span>
            {(unclaimedAchievementsCount ?? 0) > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-rose-600 border border-rose-400 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                {unclaimedAchievementsCount}
              </span>
            )}
          </button>

          {/* Nút Lưu Tiến Trình & Tiên Thư Mã Hóa */}
          <button
            onClick={() => {
              if (openSaveModal) {
                openSaveModal();
              } else {
                handleSaveProgress();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-600/50 bg-gradient-to-r from-emerald-950/60 to-teal-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-serif font-bold transition cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            title="Lưu tiến trình tu vi • Tiên Thư Bản Thể & 3 Khe Snapshot"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs">Lưu Game</span>
          </button>

          {/* Nút Lục Đạo Luân Hồi / Chuyển Sinh */}
          <button
            onClick={openRebornModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-800/50 bg-gradient-to-r from-purple-950/40 to-rose-950/40 hover:from-purple-900/50 hover:to-rose-900/50 text-purple-300 hover:text-purple-100 text-xs transition cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]"
            title="Lục Đạo Luân Hồi • Đạo Vận Kế Thừa (Quy đổi Karma, thăng hoa Linh Căn, Mệnh Cách & Kế thừa Bản Mệnh)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline font-serif font-medium text-xs">Luân Hồi</span>
          </button>
        </div>
      </div>
    </header>
  );
};
