// components/dashboard/left/HeritageAndCultivationCard.tsx
import React from 'react';
import { Dna, Sparkles, BookOpen, Coins, Award, Flame, Zap } from 'lucide-react';
import { PlayerStats, Manual } from '@/lib/types';
import { TabType } from './types';
import { ELEMENT_ICONS, ELEMENT_NAMES, getManualSynergy } from '@/lib/elemental-system';
import { calculateEffectiveRequiredTuVi } from '@/lib/attribute-perks';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

export interface HeritageAndCultivationCardProps {
  player: PlayerStats;
  setShowRefineModal: (show: boolean) => void;
  setShowRootModal: (show: boolean) => void;
  setShowMeridianModal?: (show: boolean) => void;
  equippedTamPhap?: Manual | null;
  equippedTheThuat?: Manual | null;
  equippedTT1?: Manual | null;
  equippedTT2?: Manual | null;
  nextRealm: any;
  tuViPercent: number;
  setActiveTab: (tab: TabType) => void;
}

export const HeritageAndCultivationCard: React.FC<HeritageAndCultivationCardProps> = ({
  player,
  setShowRefineModal,
  setShowRootModal,
  setShowMeridianModal,
  equippedTamPhap,
  equippedTheThuat,
  equippedTT1,
  equippedTT2,
  nextRealm,
  tuViPercent,
  setActiveTab
}) => {

  const currentRealmIndex = Math.max(
    0,
    Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
  );
  const currentRealmData = realmsData[currentRealmIndex];
  const nextRealmIndex = currentRealmIndex + 1;
  const targetNextRealm = nextRealm || (nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : undefined);

  return (
    <>
        {((player.physiques && player.physiques.length > 0) || player.physique) && (() => {
          const myPhysiques = (player.physiques && player.physiques.length > 0)
            ? player.physiques
            : (player.physique ? [player.physique] : []);
          const mainPhysique = myPhysiques[0];

          // Tổng buff thể chất
          let sumHP = 0;
          let sumAtk = 0;
          let sumDef = 0;
          let sumCritDmg = 0;
          let sumSpeed = 0;
          for (const p of myPhysiques) {
            sumHP += (p.hpBonusPercent || 0);
            sumAtk += (p.damageBonusPercent || 0);
            sumDef += (p.defenseBonusPercent || 0);
            sumCritDmg += (p.critDamageBonus || 0);
            if (p.cultivationSpeedBonusPercent) sumSpeed += p.cultivationSpeedBonusPercent;
          }

          return (
            <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/30 space-y-2.5 relative overflow-hidden">
              {/* Tiêu đề & Danh hiệu Song/Tam Thể */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-400 font-serif font-bold flex items-center gap-1">
                  <Dna className="w-3.5 h-3.5 text-rose-400" /> THỂ CHẤT TIÊN THIÊN
                </span>
                {myPhysiques.length >= 3 ? (
                  <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse">
                    🔥 Tam Thể Quy Nhất
                  </span>
                ) : myPhysiques.length === 2 ? (
                  <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-gradient-to-r from-purple-950/60 to-cyan-950/60 text-cyan-300 border border-cyan-600/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    ✨ Song Thể Tề Tụ
                  </span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-gradient-to-r from-rose-950/60 to-purple-950/60 text-rose-300 border-rose-700/50 shadow-sm">
                    {mainPhysique.grade}
                  </span>
                )}
              </div>

              {/* Danh sách từng Thể Chất */}
              <div className="space-y-1.5">
                {myPhysiques.map((p, idx) => (
                  <div key={p.id + '_' + idx} className="bg-black/40 p-2 rounded border border-zinc-800/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-200 to-yellow-200">
                        {idx + 1}. {p.name}
                      </span>
                      <span className={`text-[8px] px-1.5 py-0.2 rounded border font-mono ${p.badgeClass || 'text-zinc-400 border-zinc-700'}`}>
                        {p.grade}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-400 italic line-clamp-2">
                      "{p.specialEffect || p.description}"
                    </p>
                    <div className="flex flex-wrap gap-1 text-[8px] pt-0.5 font-mono">
                      {Boolean(p.hpBonusPercent && p.hpBonusPercent > 0) && <span className="text-rose-400 bg-rose-950/40 px-1 rounded border border-rose-900/30">HP +{p.hpBonusPercent}%</span>}
                      {Boolean(p.damageBonusPercent && p.damageBonusPercent > 0) && <span className="text-amber-400 bg-amber-950/40 px-1 rounded border border-amber-900/30">Công +{p.damageBonusPercent}%</span>}
                      {Boolean(p.defenseBonusPercent && p.defenseBonusPercent > 0) && <span className="text-sky-400 bg-sky-950/40 px-1 rounded border border-sky-900/30">Thủ +{p.defenseBonusPercent}%</span>}
                      {p.cultivationSpeedBonusPercent ? <span className="text-emerald-400 bg-emerald-950/40 px-1 rounded border border-emerald-900/30">Tốc độ +{p.cultivationSpeedBonusPercent}%</span> : null}
                      {p.critDamageBonus ? <span className="text-purple-400 bg-purple-950/40 px-1 rounded border border-purple-900/30">Bạo ST +{p.critDamageBonus}%</span> : null}
                      {p.khangTamMaPercent ? <span className="text-teal-400 bg-teal-950/40 px-1 rounded border border-teal-900/30">Kháng ma +{p.khangTamMaPercent}%</span> : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng cộng dồn nếu có từ 2 thể chất trở lên */}
              {myPhysiques.length > 1 && (
                <div className="bg-amber-950/20 p-1.5 rounded border border-amber-700/30 space-y-0.5 text-[9px] font-mono">
                  <div className="text-amber-300 font-serif font-bold text-[10px] flex items-center gap-1">
                    <span>⚡</span> Tổng Gia Trì Đa Thể Chất:
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center pt-0.5">
                    <span className="text-rose-400">HP +{sumHP}%</span>
                    <span className="text-amber-400">Công +{sumAtk}%</span>
                    <span className="text-sky-400">Thủ +{sumDef}%</span>
                  </div>
                </div>
              )}

              {/* Tầng Tôi Thể & Tiến độ của Thể Chất Chủ Tu */}
              <div className="bg-black/40 p-2 rounded border border-zinc-800/60 space-y-1.5 text-[10px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300 font-serif font-medium">
                    Cảnh giới Tôi Thể ({mainPhysique.name}):
                  </span>
                  <span className="text-rose-400 font-bold">
                    [{mainPhysique.refinementStage} • Tầng {mainPhysique.refinementLevel}/9]
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-rose-950">
                    <div
                      className="bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.floor((mainPhysique.refinementExp / mainPhysique.maxRefinementExp) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>Tiến cảnh</span>
                    <span>{mainPhysique.refinementExp}/{mainPhysique.maxRefinementExp} EXP</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-rose-300 flex items-center gap-1">
                  🩸 Tinh Huyết: <strong className="text-rose-400">{player.tinhHuyetYeuThu || 0}</strong> giọt
                </span>
                <button
                  onClick={() => setShowRefineModal(true)}
                  className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 border border-rose-700/50 text-[10px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Tôi Thể Rèn Thân</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* KHỐI 2: LINH CĂN THIÊN PHÚ & THĂNG HOA */}
        {player.linhCan && (
          <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-400 font-serif font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-purple-400" /> LINH CĂN THIÊN PHÚ
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-purple-950/50 text-purple-300 border-purple-800/40">
                {player.linhCan.grade}
              </span>
            </div>

            <div>
              <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <span>{ELEMENT_ICONS[player.linhCan.element] || '✨'}</span>
                <span>{player.linhCan.name}</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                Thuộc tính: <span className="text-amber-200">{ELEMENT_NAMES[player.linhCan.element] || player.linhCan.element}</span>
              </div>
            </div>

            {/* Thanh Độ Tinh Thuần Linh Căn */}
            <div className="bg-black/40 p-2 rounded border border-zinc-800/60 space-y-1 text-[10px] font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Độ Tinh Thuần:</span>
                <span className="text-purple-300 font-bold">{player.linhCan.purity || 40}% / 100%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-purple-950">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, player.linhCan.purity || 40)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-1 text-[9px] pt-1 text-center border-t border-zinc-800">
                <span className="text-rose-400">⚔️ Công: +{player.linhCan.damageBonus}%</span>
                <span className="text-emerald-400">⚡ Tu: +{player.linhCan.speedBonus}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-purple-300">
                💊 Tẩy Linh Đan: <strong className="text-purple-400">{player.inventory?.pills?.find(p => p.id === 'pill_tay_linh')?.quantity || 0}</strong>
              </span>
              <button
                onClick={() => setShowRootModal(true)}
                className="px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50 text-[10px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Tẩy Linh Thăng Hoa</span>
              </button>
            </div>
          </div>
        )}

        {/* KHỐI 3: CÔNG PHÁP ĐANG TRANG BỊ & TƯƠNG THÍCH (4 SLOTS) */}
        <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/30 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5">
            <span className="text-[11px] text-amber-400 font-serif font-bold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> CÔNG PHÁP KÍCH HOẠT
            </span>
            <button
              onClick={() => setActiveTab('manuals')}
              className="text-[10px] text-blue-300 hover:text-blue-200 underline cursor-pointer font-serif"
            >
              Công Pháp Các
            </button>
          </div>

          <div className="space-y-1.5 text-[10px]">
            {/* Slot 1: Tâm Pháp */}
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div className="truncate">
                <span className="text-blue-400 font-serif font-medium">[Tâm Pháp]</span>{' '}
                <span className="text-zinc-200">{equippedTamPhap ? equippedTamPhap.name : 'Chưa trang bị'}</span>
              </div>
              {equippedTamPhap && getManualSynergy(equippedTamPhap, player.linhCan).isSynergy && (
                <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 shrink-0 font-mono">
                  🔥 +50%
                </span>
              )}
            </div>

            {/* Slot 2: Thể Thuật */}
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div className="truncate">
                <span className="text-emerald-400 font-serif font-medium">[Thể Thuật]</span>{' '}
                <span className="text-zinc-200">{equippedTheThuat ? equippedTheThuat.name : 'Chưa trang bị'}</span>
              </div>
              {equippedTheThuat && getManualSynergy(equippedTheThuat, player.linhCan).isSynergy && (
                <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 shrink-0 font-mono">
                  🔥 +50%
                </span>
              )}
            </div>

            {/* Slot 3: Thần Thông 1 */}
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div className="truncate">
                <span className="text-rose-400 font-serif font-medium">[Thần Thông 1]</span>{' '}
                <span className="text-zinc-200">{equippedTT1 ? equippedTT1.name : 'Trống'}</span>
              </div>
              {equippedTT1 && getManualSynergy(equippedTT1, player.linhCan).isSynergy && (
                <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 shrink-0 font-mono">
                  🔥 +50%
                </span>
              )}
            </div>

            {/* Slot 4: Thần Thông 2 */}
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div className="truncate">
                <span className="text-rose-400 font-serif font-medium">[Thần Thông 2]</span>{' '}
                <span className="text-zinc-200">{equippedTT2 ? equippedTT2.name : 'Trống'}</span>
              </div>
              {equippedTT2 && getManualSynergy(equippedTT2, player.linhCan).isSynergy && (
                <span className="text-[8px] px-1 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 shrink-0 font-mono">
                  🔥 +50%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thanh Tu Vi & Đột Phá Progress */}
        {(() => {
          const effectiveTuViReq = targetNextRealm ? calculateEffectiveRequiredTuVi(player, targetNextRealm) : 0;
          const tuViPct = effectiveTuViReq > 0 ? Math.min(100, Math.floor((player.tuVi / effectiveTuViReq) * 100)) : 100;
          const hasNhatNiem = (player.ngoTinh || 0) >= 80;

          return (
            <div className="space-y-1.5 bg-[#0e0e14] p-3 rounded-lg border border-amber-900/20">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Tu Vi
                  {hasNhatNiem && (
                    <span className="text-[9px] text-sky-400 font-serif font-bold">(-15%)</span>
                  )}
                </span>
                <span className="font-mono text-amber-300 font-medium text-[11px]">
                  {player.tuVi.toLocaleString()} / {effectiveTuViReq > 0 ? effectiveTuViReq.toLocaleString() : 'Cực Hạn'}
                </span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-amber-950 p-[1px]">
                <div
                  className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  style={{ width: `${tuViPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Tiến độ cảnh giới</span>
                <span className="text-amber-400">
                  {tuViPct}%
                </span>
              </div>
              {setShowMeridianModal && (
                <div className="pt-1.5 border-t border-amber-950/60 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-serif">
                    Kỳ Kinh Bát Mạch: <strong className="text-cyan-400">{player.tuViEmpowermentState?.unlockedAcupointIds?.length || 0}/32 Khiếu</strong>
                  </span>
                  <button
                    onClick={() => setShowMeridianModal(true)}
                    className="px-2 py-0.5 rounded bg-gradient-to-r from-cyan-950/70 to-blue-950/70 hover:brightness-125 text-cyan-200 border border-cyan-700/50 text-[10px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>Khai Khiếu • Ngưng Đan</span>
                  </button>
                </div>
              )}
            </div>
          );
        })()}


        {/* Tài Nguyên: Linh Thạch & Danh Vọng */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-[#0e0e14] p-2.5 rounded-lg border border-amber-900/20 flex flex-col justify-between" title="Hạ Phẩm Linh Thạch (Đơn vị cơ sở)">
            <span className="text-zinc-400 text-[11px] flex items-center gap-1 font-sans">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Hạ Phẩm Linh Thạch
            </span>
            <span className="text-emerald-400 font-bold text-sm mt-1 truncate">
              {player.linhThach.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#0e0e14] p-2.5 rounded-lg border border-amber-900/20 flex flex-col justify-between">
            <span className="text-zinc-400 text-[11px] flex items-center gap-1 font-sans">
              <Award className="w-3 h-3 text-yellow-400" /> Danh Vọng
            </span>
            <span className="text-yellow-400 font-bold text-sm mt-1 truncate">
              {player.danhVong.toLocaleString()}
            </span>
          </div>
        </div>
    </>
  );
};
