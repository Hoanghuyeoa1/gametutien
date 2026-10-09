// components/dashboard/left/CharacterIdentityCard.tsx
import React, { useState } from 'react';
import { Crown, Sparkles, Feather, Zap, Heart } from 'lucide-react';
import { PlayerStats, SectId } from '@/lib/types';
import { COMPANIONS_MAP } from '@/lib/companions-data';
import { getTitleDefinition } from '@/lib/achievements-data';
import { getSectProfile, getRankTitle } from '@/lib/sect-data';
import { RealmVisualAnimation } from '@/components/realm/RealmVisualAnimation';
import { getRealmVisualConfig } from '@/lib/realm-visuals-data';
import realmsDataRaw from '@/data/realms-data.json';
import { TabType } from './types';

const realmsData = realmsDataRaw as any[];

const REALM_STEPPER_GROUPS = [
  { id: 'lk', label: '0-10', name: 'Phàm & Luyện Khí', range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], defaultIdx: 0, color: '#38bdf8' },
  { id: 'trucco', label: 'Trúc Cơ', name: 'Trúc Cơ (11-15)', range: [11, 12, 13, 14, 15], defaultIdx: 11, color: '#10b981' },
  { id: 'kimdan', label: 'Kim Đan', name: 'Kim Đan (16-20)', range: [16, 17, 18, 19, 20], defaultIdx: 16, color: '#f59e0b' },
  { id: 'nguyenanh', label: 'Nguyên Anh', name: 'Nguyên Anh (21-25)', range: [21, 22, 23, 24, 25], defaultIdx: 21, color: '#a855f7' },
  { id: 'hoathan', label: 'Hóa Thần', name: 'Hóa Thần (26-30)', range: [26, 27, 28, 29, 30], defaultIdx: 26, color: '#f43f5e' }
];

export interface CharacterIdentityCardProps {
  player: PlayerStats;
  currentRealm?: any;
  currentRealmBadge: any;
  setActiveTab: (tab: TabType) => void;
  openAchievementsModal?: () => void;
  openRebornModal?: () => void;
  openMemorialModal?: () => void;
}

export const CharacterIdentityCard: React.FC<CharacterIdentityCardProps> = ({
  player,
  currentRealm,
  currentRealmBadge,
  setActiveTab,
  openAchievementsModal,
  openRebornModal,
  openMemorialModal
}) => {
  const [previewRealm, setPreviewRealm] = useState<number | null>(null);
  const [showRealmStepper, setShowRealmStepper] = useState<boolean>(false);
  const [activeStepperGroup, setActiveStepperGroup] = useState<string>('lk');

  const currentRealmIndex = Math.max(
    0,
    Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
  );

  return (
    <>
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm tracking-wide">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>BẢN THỂ CHÂN NHÂN</span>
            {openMemorialModal && (
              <button
                type="button"
                onClick={openMemorialModal}
                className="ml-1 px-1.5 py-0.5 rounded border border-stone-700/80 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 text-[10px] font-serif transition cursor-pointer flex items-center gap-1 shadow-sm"
                title="Lục Đạo Tiên Bi • Xem bia mộ tiền kiếp"
              >
                <span>🏛️</span>
                <span>Tiên Bi</span>
              </button>
            )}
          </div>
          <span className="text-[11px] font-mono text-amber-200/50 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/30">
            Tầng {currentRealmIndex}/{realmsData.length - 1}
          </span>
        </div>

        {/* Chân dung cảnh giới & Hoạt Họa Tu Chân Nhập Định */}
        {(() => {
          const badge = currentRealmBadge;
          const displayRealmIndex = previewRealm !== null ? previewRealm : currentRealmIndex;
          const previewCfg = previewRealm !== null ? getRealmVisualConfig(previewRealm) : null;
          const equippedTitleDef = player.achievementsState?.equippedTitleId
            ? getTitleDefinition(player.achievementsState.equippedTitleId)
            : null;
          const auraType = equippedTitleDef?.aura;

          return (
            <div className="text-center py-2 relative">
              {/* Khung Hoạt Họa Cảnh Giới Trực Quan (Procedural Animated Visuals) */}
              <div className="relative mx-auto flex flex-col items-center justify-center mb-2.5">
                <div className="relative inline-flex items-center justify-center">
                  {auraType && (
                    <div
                      className={`absolute -inset-3 rounded-full pointer-events-none transition-all duration-700 animate-pulse z-0 ${
                        auraType === 'divine_gold'
                          ? 'border-2 border-amber-400/90 shadow-[0_0_35px_rgba(251,191,36,0.9)] bg-radial from-amber-400/20 via-yellow-400/10 to-transparent'
                          : auraType === 'celestial_purple'
                          ? 'border-2 border-purple-400/90 shadow-[0_0_30px_rgba(168,85,247,0.85)] bg-radial from-purple-500/25 via-fuchsia-400/10 to-transparent'
                          : auraType === 'crimson_flame'
                          ? 'border-2 border-rose-500/90 shadow-[0_0_30px_rgba(244,63,94,0.85)] bg-radial from-rose-600/25 via-red-400/10 to-transparent'
                          : ''
                      }`}
                    />
                  )}
                  <div className="relative z-10">
                    <RealmVisualAnimation
                      realmIndex={displayRealmIndex}
                      size="md"
                      showBadge={true}
                      showDescriptionTooltip={true}
                    />
                  </div>
                </div>

                {/* Thanh điều khiển nhanh chuyển đổi Đại Cảnh Giới (Preview & Test) */}
                <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowRealmStepper(!showRealmStepper)}
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-amber-800/40 bg-black/50 text-amber-300/80 hover:text-amber-200 hover:border-amber-500/60 transition cursor-pointer flex items-center gap-1 shadow-sm"
                    title="Bấm để mở danh sách chuyển đổi hoạt họa 5 Đại Cảnh Giới"
                  >
                    <span>👁️ Hoạt Họa</span>
                    {previewRealm !== null ? (
                      <span className="text-emerald-400 font-bold">Tầng {previewRealm} ({previewCfg?.stageCategory || ''})</span>
                    ) : (
                      <span className="text-zinc-400">(0-30)</span>
                    )}
                  </button>

                  {previewRealm !== null && (
                    <button
                      type="button"
                      onClick={() => setPreviewRealm(null)}
                      className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-950/60 border border-red-700/50 text-red-300 hover:text-red-100 transition cursor-pointer shadow-sm"
                      title="Quay lại cảnh giới thực của nhân vật"
                    >
                      ✕ Về thực (Tầng {currentRealmIndex})
                    </button>
                  )}
                </div>

                {/* Bảng điều khiển chọn nhanh 5 Đại Cảnh Giới & Các Tầng con */}
                {showRealmStepper && (() => {
                  const currentGroup = REALM_STEPPER_GROUPS.find(g =>
                    g.id === activeStepperGroup
                  ) || REALM_STEPPER_GROUPS.find(g =>
                    displayRealmIndex >= g.range[0] && displayRealmIndex <= g.range[g.range.length - 1]
                  ) || REALM_STEPPER_GROUPS[0];

                  return (
                    <div className="mt-2 p-2 rounded-xl bg-black/95 border border-amber-900/60 flex flex-col items-center gap-2 max-w-[280px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-20">
                      {/* Dải 5 nút chuyển nhanh Đại Cảnh Giới: [0-10], [Trúc Cơ], [Kim Đan], [Nguyên Anh], [Hóa Thần] */}
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {REALM_STEPPER_GROUPS.map(grp => {
                          const isGroupActive = currentGroup.id === grp.id;
                          return (
                            <button
                              key={`grp-${grp.id}`}
                              type="button"
                              onClick={() => {
                                setActiveStepperGroup(grp.id);
                                setPreviewRealm(grp.defaultIdx);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition cursor-pointer border ${
                                isGroupActive
                                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] font-extrabold'
                                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-600/60'
                              }`}
                              style={isGroupActive ? {} : { color: grp.color }}
                              title={`Chuyển nhanh đến ${grp.name} (Tầng ${grp.defaultIdx})`}
                            >
                              {grp.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Dải nút tiểu cảnh giới chi tiết của nhóm đang chọn */}
                      <div className="flex items-center justify-center gap-1 flex-wrap pt-1.5 border-t border-zinc-800/80 w-full">
                        {currentGroup.range.map(rIdx => {
                          const isSelected = displayRealmIndex === rIdx;
                          const cfg = getRealmVisualConfig(rIdx);
                          return (
                            <button
                              key={`stepper-r-${rIdx}`}
                              type="button"
                              onClick={() => setPreviewRealm(rIdx)}
                              className={`min-w-6 h-5 px-1.5 rounded text-[9px] font-mono font-bold transition flex items-center justify-center cursor-pointer border ${
                                isSelected
                                  ? 'bg-emerald-400 text-black border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105 font-extrabold'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-amber-600/70'
                              }`}
                              title={`Tầng ${rIdx}: ${cfg.realmName} (${cfg.badgeTitle})`}
                            >
                              {rIdx}
                            </button>
                          );
                        })}
                      </div>

                      {/* Nút Reset về cảnh giới thực */}
                      {previewRealm !== null && (
                        <button
                          type="button"
                          onClick={() => setPreviewRealm(null)}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950/70 border border-red-700/60 text-red-300 hover:text-white hover:bg-red-900/80 transition cursor-pointer"
                        >
                          ✕ Về cảnh giới thực (Tầng {currentRealmIndex})
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Tên cảnh giới & Danh xưng huy hiệu & Linh Thú theo sau */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-200 font-serif tracking-wide">
                  {previewCfg ? `${previewCfg.realmName} (Xem Thử)` : currentRealm.name}
                </h2>
                {(() => {
                  const activeBeast = (player.beasts || []).find(b => b.id === player.activeBeastId);
                  if (!activeBeast) return null;
                  return (
                    <button
                      onClick={() => setActiveTab('beasts')}
                      className="px-1.5 py-0.5 rounded border border-amber-600/50 bg-amber-950/70 text-[10px] font-serif text-amber-200 flex items-center gap-1 hover:scale-105 active:scale-95 transition cursor-pointer shadow-sm"
                      title={`Linh Thú theo sau: ${activeBeast.name} (${activeBeast.role === 'mount' ? 'Tọa Kỵ' : 'Hộ Vệ'})`}
                    >
                      <span className="text-xs">{activeBeast.avatar}</span>
                      <span className="truncate max-w-[85px]">{activeBeast.name}</span>
                    </button>
                  );
                })()}
              </div>
              <div className="text-xs text-amber-400/90 font-mono flex items-center justify-center gap-1.5 mt-0.5">
                <span>{currentRealm.stage} {currentRealm.tier ? `• ${currentRealm.tier}` : ''}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border bg-black/40 ${badge.theme.badgeBorder} ${badge.theme.badgeText} font-serif`}>
                  {badge.badgeTitle}
                </span>
              </div>

              {/* WIDGET THỌ NGUYÊN & TUẾ NGUYỆT (LIFESPAN & AGE) */}
              {(() => {
                const age = Number((player.age || 16).toFixed(1));
                const maxLifespan = player.maxLifespan || 100;
                const isImmortal = maxLifespan >= 99999999;
                const percentUsed = isImmortal ? 0 : Math.min(100, Math.max(0, (age / maxLifespan) * 100));
                const remaining = Math.max(0, maxLifespan - age);
                const isDanger = !isImmortal && remaining < 5;
                const isWarning = !isImmortal && remaining < 20;

                return (
                  <div className="mt-2 mx-1 p-2 rounded-lg bg-black/60 border border-amber-900/40 text-left shadow-sm">
                    <div className="flex items-center justify-between text-[11px] font-serif">
                      <span className="flex items-center gap-1.5 text-zinc-300">
                        <span className="text-amber-400">⏳</span>
                        <span>Tuế Nguyệt:</span>
                        <strong className="text-amber-200 font-mono">{age}</strong>
                        <span className="text-zinc-500 font-mono">/</span>
                        <span className="text-amber-400/90 font-mono font-bold">
                          {isImmortal ? 'Vĩnh Sinh' : `${maxLifespan} Tuổi`}
                        </span>
                      </span>
                      {isImmortal ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/60 border border-purple-700/50 text-purple-300 font-mono animate-pulse">
                          Bất Tử
                        </span>
                      ) : isDanger ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 border border-red-600/70 text-red-300 font-mono font-bold animate-pulse">
                          ⚠️ Tọa Hóa! ({remaining.toFixed(1)} năm)
                        </span>
                      ) : isWarning ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-600/50 text-amber-300 font-mono">
                          Còn {remaining.toFixed(1)} năm
                        </span>
                      ) : (
                        <span className="text-[9px] text-zinc-400 font-mono">
                          Dư {remaining.toFixed(1)} năm
                        </span>
                      )}
                    </div>

                    {!isImmortal && (
                      <div className="mt-1.5 w-full bg-zinc-900/90 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isDanger
                              ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                              : isWarning
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          }`}
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>
                    )}

                    {isDanger && openRebornModal && (
                      <button
                        type="button"
                        onClick={openRebornModal}
                        className="mt-2 w-full py-1.5 px-2.5 rounded-lg border border-red-500/80 bg-gradient-to-r from-red-950 via-rose-900 to-purple-950 text-white font-serif font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse hover:brightness-125"
                      >
                        <span>⚡</span>
                        <span>TỌA HÓA NIẾT BÀN • BƯỚC VÀO LUÂN HỒI</span>
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Danh Hiệu Tiên Giới Đã Trang Bị */}
              {(() => {
                const equippedId = player.achievementsState?.equippedTitleId;
                const titleDef = equippedId ? getTitleDefinition(equippedId) : null;
                if (!titleDef) {
                  return (
                    <div className="flex justify-center mt-1.5">
                      <button
                        onClick={openAchievementsModal}
                        className="px-2.5 py-0.5 rounded-full border border-dashed border-amber-900/60 hover:border-amber-500/60 bg-black/40 text-[10px] font-serif text-zinc-500 hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
                        title="Chưa trang bị danh hiệu (Bấm để xem Thành Tựu & Danh Hiệu)"
                      >
                        <span>🎖️</span>
                        <span>+ Danh Hiệu Tiên Giới</span>
                      </button>
                    </div>
                  );
                }
                return (
                  <div className="flex justify-center mt-1.5">
                    <button
                      onClick={openAchievementsModal}
                      className={`px-3 py-0.5 rounded-full border text-[11px] font-serif font-bold tracking-wide flex items-center gap-1.5 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer ${titleDef.badgeClass}`}
                      title={`Danh Hiệu: ${titleDef.name}\n${titleDef.description}\n(Bấm để đổi Danh Hiệu & Thành Tựu)`}
                    >
                      <span>{titleDef.icon || '🎖️'}</span>
                      <span>{titleDef.name}</span>
                    </button>
                  </div>
                );
              })()}

              {/* Khí tức cảm ứng (Aura text) */}
              <p className="text-[10px] text-amber-200/75 italic mt-1 font-serif">
                "{badge.theme.auraText}"
              </p>

              <p className="text-[11px] text-zinc-400 mt-1.5 px-1 line-clamp-2 leading-relaxed italic border-t border-amber-900/20 pt-1.5 font-serif">
                "{currentRealm.description}"
              </p>

              {/* KHỐI LINH THÚ HỘ THỂ & TỌA KÝ TIÊN GIA DƯỚI AVATAR */}
              {(() => {
                const activeBeast = (player.beasts || []).find(b => b.id === player.activeBeastId);
                const beastCount = (player.beasts || []).length;
                return (
                  <div
                    onClick={() => setActiveTab('beasts')}
                    className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-950/30 via-black/50 to-purple-950/30 border border-amber-900/40 hover:border-amber-500/60 flex items-center justify-between gap-2 transition cursor-pointer group shadow-sm text-left"
                    title="Bấm để mở Quản Lý Linh Thú & Tọa Kỵ Tiên Gia"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-black/60 border border-amber-800/40 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                        {activeBeast ? activeBeast.avatar : '🐾'}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-zinc-400 font-serif">Linh Thú:</span>
                          <span className="text-[11px] font-serif font-bold text-amber-200 truncate">
                            {activeBeast ? activeBeast.name : 'Chưa Xuất Trận'}
                          </span>
                        </div>
                        <div className="text-[9px] font-mono text-zinc-400 truncate">
                          {activeBeast ? (
                            <>
                              <span className="text-amber-400/90">{activeBeast.stageName} (Lv {activeBeast.level})</span>
                              <span className="mx-1">•</span>
                              <span className={activeBeast.role === 'mount' ? 'text-sky-300' : 'text-rose-400'}>
                                {activeBeast.role === 'mount' ? '🏇 Tọa Kỵ' : `⚔️ Đỡ ${activeBeast.stats.blockPercent}% ST`}
                              </span>
                            </>
                          ) : (
                            <span>{beastCount > 0 ? `${beastCount} thú đang đợi xuất trận` : 'Chưa có thần thú • Bấm nhận'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-serif font-bold text-amber-400/90 group-hover:text-amber-200 shrink-0">
                      {activeBeast ? 'Đổi ❯' : 'Quản Lý ❯'}
                    </span>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* KHỐI HIỂN THỊ TÔNG MÔN & ĐỊA VỊ TRƯỞNG LÃO */}
        {(() => {
          const sectId = (player.sectState?.sectId || player.sect || null) as SectId | null;
          const sectProfile = getSectProfile(sectId);
          const currentRank = player.sectState?.rank || player.sectRank || 'tap_dich';
          const rankTitle = getRankTitle(sectId, currentRank);
          const isElderOrMaster = currentRank === 'truong_lao' || currentRank === 'chuong_mon';
          const arenaTitle = player.sectState?.arenaTitle;

          return (
            <div 
              onClick={() => setActiveTab('sect')}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden group ${
                isElderOrMaster
                  ? 'bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)] hover:border-amber-400'
                  : sectProfile
                    ? 'bg-gradient-to-r from-stone-900/70 to-zinc-900/70 border-amber-900/40 hover:border-amber-700/60'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {isElderOrMaster && (
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{sectProfile?.icon || '🥋'}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold font-serif ${sectProfile?.color || 'text-zinc-400'}`}>
                        {sectProfile ? sectProfile.name : 'Tán Tu Tự Do'}
                      </span>
                      {sectProfile && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20 font-mono">
                          {sectProfile.faction === 'chinh_dao' ? 'Chính Đạo' : sectProfile.faction === 'ma_dao' ? 'Ma Đạo' : 'Kiếm Tông'}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-300 flex items-center gap-1 mt-0.5">
                      <span className={isElderOrMaster ? 'text-amber-300 font-bold' : 'text-zinc-400'}>
                        {rankTitle}
                      </span>
                      {sectProfile && (
                        <span className="text-[10px] text-amber-500/70">
                          • {player.sectState?.contribution ?? player.sectContribution ?? 0} cống hiến
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isElderOrMaster && (
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-serif uppercase tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/50 text-amber-300 animate-pulse">
                      Trấn Phái
                    </span>
                    <span className="text-[9px] text-amber-400/80 font-mono mt-0.5">
                      +{currentRank === 'chuong_mon' ? '20%' : '10%'} Uy Lực
                    </span>
                  </div>
                )}
              </div>

              {arenaTitle && (
                <div className="mt-1.5 pt-1.5 border-t border-amber-900/30 flex items-center justify-between text-[10px]">
                  <span className="text-amber-400/90 font-serif flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> {arenaTitle}
                  </span>
                  <span className="text-zinc-500 text-[9px] font-mono">Luận Kiếm Hạng 1</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* KHỐI HIỂN THỊ ĐẠO LỮ ĐỒNG HÀNH SÁNH BƯỚC */}
        {(() => {
          const compId = player.companionsState?.activeCompanionId;
          const pCompState = compId && player.companionsState?.companions ? player.companionsState.companions[compId] : null;
          const isValidActive = Boolean(compId && pCompState && (pCompState.isBonded || pCompState.isMet));
          const activeComp = isValidActive && compId ? COMPANIONS_MAP[compId] : null;
          const isBonded = Boolean(pCompState?.isBonded);
          const affinity = pCompState?.affinity || 0;

          return (
            <div
              onClick={() => setActiveTab('daolu')}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden group ${
                isBonded
                  ? 'bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.25)] hover:border-rose-400'
                  : activeComp
                  ? 'bg-gradient-to-r from-[#120d18] to-[#0c0912] border-rose-900/40 hover:border-rose-700/60'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {isBonded && (
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-rose-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border relative ${
                    activeComp ? `bg-gradient-to-br ${activeComp.avatarGradient} border-white/20` : 'bg-zinc-800 border-zinc-700'
                  }`}>
                    {activeComp ? activeComp.avatar : '✨'}
                    {isBonded && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 border border-white flex items-center justify-center">
                        <Heart className="w-2 h-2 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
                        {activeComp ? activeComp.name : 'Chưa Chọn Đạo Lữ'}
                      </span>
                      {activeComp && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-700/40 font-serif">
                          {activeComp.title}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      {activeComp ? (
                        <>
                          <span className={isBonded ? 'text-rose-400 font-bold' : 'text-zinc-400'}>
                            {isBonded ? '💍 Tiên Lữ Kết Duyên' : `Hảo Cảm: ${affinity}/100`}
                          </span>
                          <span className="text-amber-400/80">• Trợ Chiến</span>
                        </>
                      ) : (
                        <span className="text-zinc-500 italic">Nhấn để kết giao Tiên Lữ</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className={`text-[9px] font-serif uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                    isBonded
                      ? 'bg-rose-950/80 text-rose-300 border-rose-600/60 animate-pulse font-bold'
                      : activeComp
                      ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}>
                    {isBonded ? 'Đạo Lữ' : activeComp ? 'Đồng Hành' : 'Tiên Duyên'}
                  </span>
                  {activeComp && (
                    <span className="text-[9px] text-amber-300/80 font-mono mt-0.5">
                      {activeComp.id === 'companion_lac_thanh_tuyet' && '+25% Thủ & Băng'}
                      {activeComp.id === 'companion_co_vo_diem' && '+15% Bạo Kích'}
                      {activeComp.id === 'companion_diep_chi_ham' && '+8% Hồi HP/Hiệp'}
                      {activeComp.id === 'companion_nam_cung_uyen' && '+35 Tốc & +25% Công'}
                      {activeComp.id === 'companion_tan_vu_mong' && '+60 Hồn & +15% Né'}
                    </span>
                  )}
                </div>
              </div>

              {pCompState?.tokenName && (
                <div className="mt-1.5 pt-1.5 border-t border-rose-900/30 flex items-center justify-between text-[10px]">
                  <span className="text-rose-300 font-serif flex items-center gap-1 truncate">
                    <span>{pCompState.tokenIcon || '💍'}</span>
                    <span className="truncate">Tín vật: {pCompState.tokenName}</span>
                  </span>
                  <span className="text-emerald-400 text-[9px] font-mono shrink-0">Đã Kích Hoạt</span>
                </div>
              )}
            </div>
          );
        })()}
    </>
  );
};
