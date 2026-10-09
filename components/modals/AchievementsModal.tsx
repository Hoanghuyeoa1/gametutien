// components/modals/AchievementsModal.tsx
// Modal Cổ Phong hiển thị Hệ Thống Thành Tựu & Danh Hiệu Tiên Giới

import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Sparkles,
  X,
  CheckCircle2,
  Lock,
  Zap,
  Gem,
  Award,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  PlayerStats,
  AchievementCategory,
  TitleDefinition
} from '@/lib/types';
import {
  ACHIEVEMENTS_CONFIG,
  TITLES_CONFIG,
  TITLE_RARITY_CONFIG,
  getAchievementCurrentProgress,
  isAchievementCompleted,
  isAchievementClaimed
} from '@/lib/achievements-data';

export interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  activeTab: 'achievements' | 'titles';
  setActiveTab: (tab: 'achievements' | 'titles') => void;
  selectedCategory: AchievementCategory | 'all';
  setSelectedCategory: (cat: AchievementCategory | 'all') => void;
  onClaimAchievement: (achId: string) => void;
  onClaimAllAchievements: () => void;
  onEquipTitle: (titleId: string | null) => void;
  unclaimedCount: number;
}

const CATEGORY_TABS: Array<{ id: AchievementCategory | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'Tất Cả', icon: '✨' },
  { id: 'cultivation', label: 'Cảnh Giới', icon: '⚡' },
  { id: 'battle', label: 'Chiến Đấu', icon: '⚔️' },
  { id: 'sect', label: 'Tông Môn', icon: '🛡️' },
  { id: 'cosmic', label: 'Tinh Đồ', icon: '🌌' },
  { id: 'reincarnation', label: 'Luân Hồi', icon: '🌀' },
  { id: 'crafting', label: 'Bách Nghệ', icon: '📜' },
  { id: 'auction', label: 'Đấu Giá', icon: '🏛️' },
  { id: 'forbidden_zone', label: 'Cấm Địa', icon: '☠️' },
  { id: 'garden', label: 'Gia Viên', icon: '🌿' },
  { id: 'companion', label: 'Đạo Lữ', icon: '🌸' },
  { id: 'wealth', label: 'Tài Phú', icon: '💰' }
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  player,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  onClaimAchievement,
  onClaimAllAchievements,
  onEquipTitle,
  unclaimedCount
}) => {
  if (!isOpen) return null;

  const equippedTitleId = player.achievementsState?.equippedTitleId;
  const unlockedTitleIds = player.achievementsState?.unlockedTitleIds || [];
  const equippedTitle = equippedTitleId ? TITLES_CONFIG[equippedTitleId] : null;

  // Tính toán chỉ số tổng thể toàn phân hệ
  const totalAchievementsCount = ACHIEVEMENTS_CONFIG.length;
  const totalCompletedCount = ACHIEVEMENTS_CONFIG.filter(ach => isAchievementCompleted(ach, player)).length;
  const totalClaimedCount = ACHIEVEMENTS_CONFIG.filter(ach => isAchievementClaimed(ach.id, player)).length;
  const overallPercent = Math.min(100, Math.floor((totalCompletedCount / totalAchievementsCount) * 100));

  // Lọc danh sách thành tựu theo danh mục đã chọn
  const filteredAchievements = ACHIEVEMENTS_CONFIG.filter(ach => {
    if (selectedCategory === 'all') return true;
    return ach.category === selectedCategory;
  });

  const getCategoryCount = (catId: AchievementCategory | 'all') => {
    if (catId === 'all') return `${totalCompletedCount}/${totalAchievementsCount}`;
    const list = ACHIEVEMENTS_CONFIG.filter(a => a.category === catId);
    const done = list.filter(a => isAchievementCompleted(a, player)).length;
    return `${done}/${list.length}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-4xl w-full p-5 sm:p-6 rounded-2xl border-2 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4 max-h-[92vh] overflow-hidden flex flex-col bg-[#0c0c14]/95 text-zinc-200 relative">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-950/80 to-amber-900/40 border border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)] shrink-0">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  Thiên Đạo Chứng Giám
                </span>
                {unclaimedCount > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700/60 font-mono font-bold animate-pulse">
                    {unclaimedCount} chưa nhận
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wide mt-0.5">
                THÀNH TỰU & DANH HIỆU TIÊN GIỚI
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-rose-300 transition cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900/60"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chuyển đổi 2 Tab lớn: Thành Tựu vs Danh Hiệu */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'achievements'
                  ? 'bg-amber-950/80 border border-amber-500/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Thành Tựu Tu Chân</span>
              {unclaimedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center font-mono">
                  {unclaimedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('titles')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'titles'
                  ? 'bg-purple-950/80 border border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span>Danh Hiệu & Khí Vận</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                ({unlockedTitleIds.length}/{Object.keys(TITLES_CONFIG).length})
              </span>
            </button>
          </div>

          {/* Nút Lĩnh Nhanh Toàn Bộ (chỉ hiện ở Tab Thành Tựu) */}
          {activeTab === 'achievements' && unclaimedCount > 0 && (
            <button
              onClick={onClaimAllAchievements}
              className="px-3 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>LĨNH NHANH TOÀN BỘ ({unclaimedCount})</span>
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* NỘI DUNG TAB 1: THÀNH TỰU TU CHÂN */}
        {/* ======================================================== */}
        {activeTab === 'achievements' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-3 overflow-hidden">
            {/* Master Progress Bar: Đạo Quả Hoàn Thành */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-blue-950/40 border border-amber-500/40 shadow-sm shrink-0">
              <div className="flex items-center justify-between text-xs font-serif mb-1.5">
                <span className="text-amber-200 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ĐẠO QUẢ THÀNH TỰU TOÀN PHÂN HỆ
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {totalCompletedCount}/{totalAchievementsCount} Hoàn Thành ({overallPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-amber-900/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            {/* Bộ lọc Danh mục Category */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar shrink-0">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                    selectedCategory === tab.id
                      ? 'bg-amber-900/50 border-amber-500/70 text-amber-200 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    selectedCategory === tab.id ? 'bg-amber-950/80 text-amber-300' : 'bg-zinc-800/60 text-zinc-400'
                  }`}>
                    {getCategoryCount(tab.id)}
                  </span>
                </button>
              ))}
            </div>

            {/* Danh sách thẻ thành tựu cuộn được */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
              {filteredAchievements.map(ach => {
                const current = getAchievementCurrentProgress(ach, player);
                const isDone = isAchievementCompleted(ach, player);
                const isClaimed = isAchievementClaimed(ach.id, player);
                const percent = Math.min(100, Math.floor((current / ach.target) * 100));
                const titleReward = ach.unlockedTitleId ? TITLES_CONFIG[ach.unlockedTitleId] : null;

                return (
                  <div
                    key={ach.id}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                      isClaimed
                        ? 'bg-zinc-950/40 border-zinc-800/60 opacity-75'
                        : isDone
                        ? 'bg-gradient-to-r from-amber-950/40 via-zinc-900/70 to-amber-950/30 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-zinc-900/30 border-zinc-800/70 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Thông tin thành tựu */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="text-2xl p-2 rounded-xl bg-black/40 border border-zinc-800 shrink-0">
                          {ach.icon}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif font-bold text-sm text-zinc-100">
                              {ach.name}
                            </h4>
                            {titleReward && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/50 bg-purple-950/60 text-purple-300 font-serif font-medium flex items-center gap-1 shadow-sm">
                                👑 Danh hiệu: {titleReward.name}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 font-serif line-clamp-2">
                            {ach.description}
                          </p>

                          {/* Thanh Progress Bar */}
                          <div className="space-y-0.5 pt-1 max-w-md">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-zinc-500">Tiến cảnh:</span>
                              <span className={isDone ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                                {current.toLocaleString()} / {ach.target.toLocaleString()} ({percent}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isDone
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                    : 'bg-gradient-to-r from-amber-600 to-amber-400'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phần thưởng & Nút Hành động */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-zinc-800/50 pt-2 sm:pt-0">
                        {/* Tags Phần thưởng */}
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          {ach.rewardTuVi && (
                            <span className="text-amber-300 flex items-center gap-0.5 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                              <Zap className="w-3 h-3 text-amber-400" /> +{ach.rewardTuVi.toLocaleString()}
                            </span>
                          )}
                          {ach.rewardLinhThach && (
                            <span className="text-sky-300 flex items-center gap-0.5 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
                              <Gem className="w-3 h-3 text-sky-400" /> +{ach.rewardLinhThach.toLocaleString()}
                            </span>
                          )}
                          {ach.rewardKhiVan && (
                            <span className="text-purple-300 flex items-center gap-0.5 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/40">
                              ✨ +{ach.rewardKhiVan}
                            </span>
                          )}
                        </div>

                        {/* Nút Nhận hoặc Trạng thái */}
                        {isClaimed ? (
                          <div className="px-3 py-1 rounded-lg text-xs font-serif text-emerald-400/80 bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Đã Lĩnh</span>
                          </div>
                        ) : isDone ? (
                          <button
                            onClick={() => onClaimAchievement(ach.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-serif font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-1 animate-pulse"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>LĨNH THƯỞNG</span>
                          </button>
                        ) : (
                          <div className="px-3 py-1 rounded-lg text-xs font-serif text-zinc-500 bg-zinc-900/50 border border-zinc-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Chưa Đạt</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* NỘI DUNG TAB 2: DANH HIỆU & KHÍ VẬN */}
        {/* ======================================================== */}
        {activeTab === 'titles' && (
          <div className="flex-1 min-h-0 flex flex-col space-y-3.5 overflow-hidden">
            {/* Banner Danh Hiệu Đang Mang */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-amber-950/40 border border-purple-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/50 text-purple-300 shrink-0">
                  <Crown className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 font-serif">Danh Hiệu Đang Trang Bị:</div>
                  {equippedTitle ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm sm:text-base font-serif font-bold px-3 py-0.5 rounded-full border shadow-md ${equippedTitle.badgeClass}`}>
                        {equippedTitle.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-serif">
                        ({TITLE_RARITY_CONFIG[equippedTitle.rarity].label})
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-serif italic text-zinc-500">Chưa mang danh hiệu nào</span>
                  )}
                </div>
              </div>

              {equippedTitleId && (
                <button
                  onClick={() => onEquipTitle(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-serif text-zinc-400 hover:text-rose-300 border border-zinc-700/60 hover:border-rose-700/60 bg-black/40 transition cursor-pointer shrink-0"
                >
                  Tháo Gỡ Danh Hiệu
                </button>
              )}
            </div>

            {/* Danh sách thẻ Danh Hiệu */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar">
              {Object.values(TITLES_CONFIG).map(title => {
                const isUnlocked = unlockedTitleIds.includes(title.id);
                const isEquipped = equippedTitleId === title.id;
                const rarityCfg = TITLE_RARITY_CONFIG[title.rarity];

                return (
                  <div
                    key={title.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition duration-200 ${
                      isEquipped
                        ? 'bg-purple-950/30 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : isUnlocked
                        ? 'bg-zinc-900/40 border-zinc-700/80 hover:border-zinc-600'
                        : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Tiêu đề & Phẩm Cấp */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs sm:text-sm font-serif font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${title.badgeClass}`}>
                            {title.name}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-serif border ${rarityCfg.borderClass} ${rarityCfg.bgClass}`}>
                          {rarityCfg.label}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 font-serif italic">
                        "{title.description}"
                      </p>

                      {/* Danh sách Buff Thuộc Tính Gia Trì */}
                      <div className="p-2 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1 text-[11px] font-serif">
                        <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-400" /> Gia Trì Vĩnh Viễn:
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                          {title.buffs.atkPercent && (
                            <span className="text-rose-300">Công Kích +{title.buffs.atkPercent}%</span>
                          )}
                          {title.buffs.defPercent && (
                            <span className="text-blue-300">Phòng Ngự +{title.buffs.defPercent}%</span>
                          )}
                          {title.buffs.hpPercent && (
                            <span className="text-emerald-300">Khí Huyết +{title.buffs.hpPercent}%</span>
                          )}
                          {title.buffs.cultivateSpeedBonusPercent && (
                            <span className="text-amber-300">Tốc Độ Tu Vi +{title.buffs.cultivateSpeedBonusPercent}%</span>
                          )}
                          {title.buffs.critRatePercent && (
                            <span className="text-yellow-300">Bạo Kích +{title.buffs.critRatePercent}%</span>
                          )}
                          {title.buffs.critDmgPercent && (
                            <span className="text-orange-300">ST Bạo +{title.buffs.critDmgPercent}%</span>
                          )}
                          {title.buffs.speedBonus && (
                            <span className="text-cyan-300">Thân Pháp +{title.buffs.speedBonus}</span>
                          )}
                          {title.buffs.alchemySuccessBonus && (
                            <span className="text-teal-300">Luyện Đan +{title.buffs.alchemySuccessBonus}%</span>
                          )}
                          {title.buffs.gardenYieldBonusPercent && (
                            <span className="text-green-300">Sản Lượng Điền +{title.buffs.gardenYieldBonusPercent}%</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nút Trang Bị / Chưa Mở */}
                    <div className="pt-1">
                      {isEquipped ? (
                        <div className="w-full py-1.5 rounded-lg text-xs font-serif font-bold text-center bg-purple-900/50 border border-purple-500/60 text-purple-200">
                          ✨ ĐANG MANG
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipTitle(title.id)}
                          className="w-full py-1.5 rounded-lg text-xs font-serif font-bold text-center bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:brightness-110 text-zinc-950 shadow transition cursor-pointer active:scale-98"
                        >
                          TRANG BỊ DANH HIỆU
                        </button>
                      ) : (
                        <div className="w-full py-1.5 rounded-lg text-xs font-serif text-center bg-zinc-900/60 border border-zinc-800 text-zinc-500 flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Chưa Mở Khóa (Hoàn thành mốc Thành Tựu)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
