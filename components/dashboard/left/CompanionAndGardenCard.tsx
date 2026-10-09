// components/dashboard/left/CompanionAndGardenCard.tsx
import React from 'react';
import { Heart, Sparkles, Shield, Sprout, Plus, RotateCcw, Crown } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { COMPANIONS_MAP } from '@/lib/companions-data';
import { LINH_DIEN_LEVELS, HERB_SEEDS } from '@/lib/garden-data';
import { TabType } from './types';

export interface CompanionAndGardenCardProps {
  player: PlayerStats;
  setSelectedCompanionId: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
  currentTimestamp: number;
  setShowLinhDienUpgradeModal: (show: boolean) => void;
  handleHarvestAllPlots: () => void;
  setSelectedPlotId: (id: number) => void;
  setShowPlantSeedModal: (show: boolean) => void;
  handleHarvestPlot: (plotId: number) => void;
}

export const CompanionAndGardenCard: React.FC<CompanionAndGardenCardProps> = ({
  player,
  setSelectedCompanionId,
  setActiveTab,
  currentTimestamp,
  setShowLinhDienUpgradeModal,
  handleHarvestAllPlots,
  setSelectedPlotId,
  setShowPlantSeedModal,
  handleHarvestPlot
}) => {
  return (
    <>
        {(() => {
          const compState = player.companionsState;
          const bondedList = Object.values(compState?.companions || {}).filter(c => c.isBonded);
          const activeComp = bondedList.find(c => c.id === compState?.activeCompanionId) || bondedList[0];
          const activeDef = activeComp ? COMPANIONS_MAP[activeComp.id] : null;
          const isTamTinhActive = Boolean(
            player.activeBuffs?.tamTinhThanDieu ||
            (compState?.tamTinhThanDieuUntil && Date.now() < compState.tamTinhThanDieuUntil)
          );

          return (
            <div className="bg-[#0e0e14] p-3 rounded-lg border border-rose-900/30 space-y-2 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-rose-400 font-serif font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" /> ĐẠO LỮ TIÊN DUYÊN
                </span>
                {activeDef ? (
                  <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-rose-950/70 text-rose-300 border-rose-600/50 flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 text-amber-400" />
                    {bondedList.length} Đạo Lữ
                  </span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-zinc-900 text-zinc-400 border-zinc-700">
                    Chưa Kết Duyên
                  </span>
                )}
              </div>

              {activeDef && activeComp ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeDef.avatarGradient} flex items-center justify-center text-lg shadow-[0_0_12px_rgba(244,63,94,0.35)] shrink-0`}>
                      {activeDef.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 truncate flex items-center gap-1">
                        <span>{activeDef.name}</span>
                        <span className="text-[10px] text-amber-300 font-normal font-serif">({activeDef.title})</span>
                      </div>
                      <div className="text-[10px] text-rose-300/80 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="text-zinc-400">{activeDef.initialRealm}</span>
                        <span>•</span>
                        <span className="text-rose-400 font-serif">Đã Kết Duyên</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 italic line-clamp-2 font-serif">
                    "{activeDef.quote}"
                  </p>

                  {/* Buff Bị Động & Tâm Tịnh Thần Diệu */}
                  <div className="bg-black/40 p-2 rounded border border-rose-950/60 space-y-1 text-[10px] font-mono">
                    <div className="text-rose-300 font-serif font-medium flex items-center justify-between">
                      <span>Gia Trì Đạo Lữ:</span>
                      {isTamTinhActive && (
                        <span className="text-[9px] text-amber-300 px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-600/40 animate-pulse font-serif">
                          ✨ Tâm Tịnh Thần Diệu
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-rose-200/90 leading-relaxed space-y-0.5 font-serif">
                      {activeDef.buffs.cultivateSpeedBonus && <div>• +{activeDef.buffs.cultivateSpeedBonus}% Tốc độ tu luyện</div>}
                      {activeDef.buffs.tamMaDamageReduction && <div>• Giảm {activeDef.buffs.tamMaDamageReduction}% sát thương Tâm Ma</div>}
                      {activeDef.buffs.critDmgBonus && <div>• +{activeDef.buffs.critDmgBonus}% Sát thương Bạo Kích</div>}
                      {activeDef.buffs.lifestealPercent && <div>• Tăng {activeDef.buffs.lifestealPercent}% Hút Máu chiến đấu</div>}
                      {activeDef.buffs.alchemySuccessBonus && <div>• +{activeDef.buffs.alchemySuccessBonus}% Tỉ lệ Luyện Đan</div>}
                      {activeDef.buffs.atkBonusPercent && <div>• +{activeDef.buffs.atkBonusPercent}% Công Kích & Trợ Chiến Boss</div>}
                      {activeDef.buffs.ngoTinhBonus && <div>• +{activeDef.buffs.ngoTinhBonus} Ngộ Tính & +{activeDef.buffs.khiVanBonus} Khí Vận</div>}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCompanionId(activeDef.id);
                      setActiveTab('daolu');
                    }}
                    className="w-full py-1.5 rounded bg-gradient-to-r from-rose-950/70 via-pink-950/70 to-purple-950/70 hover:brightness-125 text-rose-200 border border-rose-700/50 text-[10px] font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>Đến Tiên Duyên Cùng Nàng</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-1 text-center">
                  <p className="text-[10px] text-zinc-400 italic font-serif">
                    Đạo lộ trường sinh xa xăm cô quạnh, chưa có hồng nhan sánh bước.
                  </p>
                  <button
                    onClick={() => setActiveTab('daolu')}
                    className="w-full py-1.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-800/40 text-[10px] font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>Tầm Kiếm Tiên Duyên</span>
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* TRANG BỊ ĐANG MẶC TÓM TẮT */}
        <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/20 space-y-2">
          <div className="flex justify-between items-center text-xs font-serif font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Shield className="w-3.5 h-3.5" /> PHÁP BẢO HỘ THÂN
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">4 Vị Trí</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
              ⚔️ {player.equipment?.weapon ? `${player.equipment.weapon.name} +${player.equipment.weapon.enhancement}` : 'Trống (Kiếm)'}
            </div>
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
              🛡️ {player.equipment?.armor ? `${player.equipment.armor.name} +${player.equipment.armor.enhancement}` : 'Trống (Giáp)'}
            </div>
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
              📿 {player.equipment?.accessory ? `${player.equipment.accessory.name} +${player.equipment.accessory.enhancement}` : 'Trống (Phù)'}
            </div>
            <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
              💍 {player.equipment?.artifact ? `${player.equipment.artifact.name} +${player.equipment.artifact.enhancement}` : 'Trống (Nhẫn)'}
            </div>
          </div>
        </div>

        {/* KHỐI: ĐỘNG PHỦ LINH ĐIỀN (HERBAL GARDEN) */}
        <div className="bg-[#0e0e14] p-3 rounded-lg border border-emerald-900/40 space-y-2 relative overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-1.5">
            <span className="text-[11px] text-emerald-400 font-serif font-bold flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" /> ĐỘNG PHỦ LINH ĐIỀN
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-emerald-950/60 text-emerald-300 border-emerald-700/50">
              {LINH_DIEN_LEVELS[player.linhDien?.level || 1]?.name || 'Linh Điền'}
            </span>
          </div>

          {/* Tóm tắt chỉ số sản lượng & tốc độ */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-serif">
            <span>
              Sản lượng: <strong className="text-emerald-300">+{player.linhDien?.yieldBonusPercent || 0}%</strong> • Tốc độ: <strong className="text-sky-300">+{player.linhDien?.speedBonusPercent || 0}%</strong>
            </span>
            <button
              onClick={() => setShowLinhDienUpgradeModal(true)}
              className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border border-amber-600/40 cursor-pointer font-serif flex items-center gap-0.5 transition"
              title="Nâng cấp Linh Điền để tăng sản lượng và mở thêm ô đất"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Nâng Cấp
            </button>
          </div>

          {/* Nút Thu Hoạch Toàn Bộ khi có cây chín */}
          {player.linhDien?.plots.some(p => p.seedId && p.harvestAt && (p.readyToHarvest || currentTimestamp >= p.harvestAt)) && (
            <button
              onClick={handleHarvestAllPlots}
              className="w-full py-1 px-2 rounded bg-gradient-to-r from-emerald-900/80 via-emerald-800 to-teal-900/80 hover:brightness-110 border border-emerald-500/60 text-[10px] text-emerald-200 font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>Thu Hoạch Toàn Bộ Linh Dược!</span>
            </button>
          )}

          {/* Lưới các ô đất trồng trọt (6 ô) */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {(player.linhDien?.plots || []).map((plot) => {
              const isPlotReady = Boolean(plot.seedId && plot.harvestAt && (plot.readyToHarvest || currentTimestamp >= plot.harvestAt));
              const seed = plot.seedId ? HERB_SEEDS.find(s => s.id === plot.seedId) : null;
              
              let timeLeftText = '';
              let progressPercent = 0;
              if (plot.seedId && plot.plantedAt && plot.harvestAt) {
                const totalDuration = plot.harvestAt - plot.plantedAt;
                const elapsed = currentTimestamp - plot.plantedAt;
                progressPercent = Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
                const remainingSeconds = Math.max(0, Math.ceil((plot.harvestAt - currentTimestamp) / 1000));
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                timeLeftText = `${mins > 0 ? `${mins}p ` : ''}${secs}s`;
              }

              if (!plot.isUnlocked) {
                return (
                  <div
                    key={plot.id}
                    className="p-1.5 rounded bg-zinc-950/60 border border-zinc-800/40 text-[10px] text-zinc-600 flex flex-col items-center justify-center min-h-[68px] space-y-0.5"
                  >
                    <span className="text-zinc-500">🔒 Ô #{plot.id + 1} Khóa</span>
                    <span className="text-[8px] text-zinc-600">Thăng cấp Linh Điền</span>
                  </div>
                );
              }

              if (!plot.seedId) {
                return (
                  <div
                    key={plot.id}
                    onClick={() => {
                      setSelectedPlotId(plot.id);
                      setShowPlantSeedModal(true);
                    }}
                    className="p-1.5 rounded bg-[#0b0f0e] border border-dashed border-emerald-900/40 hover:border-emerald-500/60 transition cursor-pointer flex flex-col items-center justify-center min-h-[68px] space-y-0.5 group"
                  >
                    <span className="text-[10px] text-zinc-400 group-hover:text-emerald-300 font-serif">Ô #{plot.id + 1} Trống</span>
                    <span className="text-[8px] text-emerald-400/90 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40 flex items-center gap-0.5 group-hover:bg-emerald-900/60">
                      <Plus className="w-2.5 h-2.5" /> Gieo Hạt
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={plot.id}
                  className={`p-1.5 rounded border transition relative flex flex-col justify-between min-h-[68px] ${
                    isPlotReady
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                      : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-start text-[10px]">
                    <div className="truncate pr-1">
                      <span className="font-serif font-bold text-amber-200 block truncate text-[10px]">{seed?.herbName || 'Linh Thảo'}</span>
                      <span className="text-[8px] text-zinc-400">{seed?.grade}</span>
                    </div>
                    {isPlotReady ? (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 font-mono animate-pulse">
                        Đã Chín!
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-sky-300 shrink-0">{timeLeftText}</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {!isPlotReady ? (
                    <div className="space-y-0.5 my-0.5">
                      <div className="w-full bg-zinc-950 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-600 to-sky-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleHarvestPlot(plot.id)}
                      className="mt-0.5 w-full py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-emerald-100 text-[9px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      <Sprout className="w-2.5 h-2.5" /> Thu Hoạch
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </>
  );
};
