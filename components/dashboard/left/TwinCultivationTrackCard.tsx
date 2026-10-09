// components/dashboard/left/TwinCultivationTrackCard.tsx
import React, { useState } from 'react';
import { Activity, Zap, Sparkles, Flame, Heart, Eye, Target, Compass, Gift, Clock } from 'lucide-react';
import { PlayerStats, ExpeditionDestinationId } from '@/lib/types';
import {
  BODY_REALMS_CONFIG,
  getBodyRefinementStats,
  canUpgradeBodyRefinement,
  createDefaultBodyRefinement
} from '@/lib/body-soul-data';
import {
  SOUL_STAGES_CONFIG,
  getSoulCultivationProgression,
  canUpgradeSoulProgression,
  countSoulStones,
  countSoulPills,
  EXPEDITION_DESTINATIONS
} from '@/lib/soul-cultivation-data';
import { AstralSoulExpeditionModal } from './AstralSoulExpeditionModal';

export interface TwinCultivationTrackCardProps {
  player: PlayerStats;
  handleUpgradeBodyRefinement?: () => void;
  handleUpgradeSoulCultivation?: () => void;
  handleStartSoulExpedition?: (destination: ExpeditionDestinationId, hours: number) => void;
  handleClaimSoulExpedition?: () => void;
}

export const TwinCultivationTrackCard: React.FC<TwinCultivationTrackCardProps> = ({
  player,
  handleUpgradeBodyRefinement,
  handleUpgradeSoulCultivation,
  handleStartSoulExpedition,
  handleClaimSoulExpedition
}) => {
  const [dualCultivationTab, setDualCultivationTab] = useState<'body' | 'soul'>('body');
  const [showExpeditionModal, setShowExpeditionModal] = useState<boolean>(false);

  const bodyRef = player.bodyRefinement || createDefaultBodyRefinement();
  const bodyStats = getBodyRefinementStats(bodyRef);
  const bodyRealmConfig = BODY_REALMS_CONFIG[bodyRef.realmIndex] || BODY_REALMS_CONFIG[0];
  const bodyCheck = canUpgradeBodyRefinement(player);
  const ownedKhiHuyetPills = player.inventory?.pills?.find(p => p.id === 'pill_khi_huyet')?.quantity || 0;
  const isBodyMaxed = bodyRef.realmIndex >= 8 && bodyRef.level >= 9;
  const trialRate = Math.min(95, Math.max(35, 45 + Math.floor((player.canCot || 50) * 0.4)));
  const bodyExpPercent = Math.min(100, Math.floor((bodyRef.currentExp / Math.max(1, bodyRef.maxExp)) * 100));

  // Thần Hồn Progression
  const soulProg = getSoulCultivationProgression(player);
  const soulCheck = canUpgradeSoulProgression(player);
  const soulExpPercent = Math.min(100, Math.floor((soulProg.subTier / 9) * 100));

  // Phân thần expedition state
  const expedition = player.soulCultivation?.expeditionState;
  const isExpeditionActive = Boolean(expedition && expedition.isActive);
  const isExpeditionFinished = isExpeditionActive && expedition && Date.now() >= expedition.startTime + expedition.durationMs;

  return (
    <>
      <div className="bg-[#0e0e14] p-2.5 sm:p-3 rounded-lg border border-amber-900/30 space-y-2 relative overflow-hidden shadow-sm">
        {/* Header & Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
          <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>SONG TRỤC TU ĐẠO</span>
          </div>
          <div className="flex rounded bg-black/60 p-0.5 border border-zinc-800 text-[10px] font-serif">
            <button
              onClick={() => setDualCultivationTab('body')}
              className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                dualCultivationTab === 'body'
                  ? 'bg-red-950/80 text-rose-300 border border-red-700/50 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🩸 Nhục Thân</span>
            </button>
            <button
              onClick={() => setDualCultivationTab('soul')}
              className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                dualCultivationTab === 'soul'
                  ? 'bg-purple-950/80 text-purple-200 border border-purple-700/50 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🔮 Thần Hồn</span>
              {isExpeditionFinished && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: NHỤC THÂN (THỂ TU) */}
        {dualCultivationTab === 'body' && (
          <div className="space-y-2 bg-gradient-to-b from-red-950/20 to-transparent p-2 rounded border border-red-900/30">
            {/* Cảnh giới & Tầng */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-serif font-bold text-rose-300 flex items-center gap-1.5">
                  <span>{bodyRealmConfig.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-red-950/60 text-rose-300 border border-red-800/50 rounded font-mono">
                    {isBodyMaxed ? 'Đại Viên Mãn' : `Tầng ${bodyRef.level}/9`}
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-400 italic font-serif mt-0.5">
                  "{bodyRealmConfig.description}"
                </p>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold shrink-0">
                Bậc {bodyRef.realmIndex + 1}/9
              </span>
            </div>

            {/* Thanh Khí Huyết Tôi Thể */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9.5px] font-mono text-zinc-400">
                <span className="text-rose-300/90 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-rose-400" /> Khí Huyết Tôi Thể
                </span>
                <span className="text-rose-200">
                  {bodyRef.currentExp}/{bodyRef.maxExp} ({bodyExpPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-red-900/40">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                  style={{ width: `${bodyExpPercent}%` }}
                />
              </div>
            </div>

            {/* Chỉ số gia trì */}
            <div className="grid grid-cols-3 gap-1 text-[9.5px] font-mono py-0.5">
              <div className="p-1 rounded bg-black/40 border border-red-900/20 text-center">
                <span className="text-zinc-400 block text-[8.5px]">Sinh Lực</span>
                <span className="text-rose-300 font-bold">+{bodyStats.hpBonus.toLocaleString()}</span>
              </div>
              <div className="p-1 rounded bg-black/40 border border-red-900/20 text-center">
                <span className="text-zinc-400 block text-[8.5px]">Phòng Ngự</span>
                <span className="text-amber-300 font-bold">+{bodyStats.defBonus}</span>
              </div>
              <div className="p-1 rounded bg-black/40 border border-red-900/20 text-center">
                <span className="text-zinc-400 block text-[8.5px]">Miễn Thương</span>
                <span className="text-emerald-300 font-bold">+{bodyStats.dmgReduction}%</span>
              </div>
            </div>

            {/* Hiệu ứng Kim Thân Hồi Phục */}
            {bodyStats.hpRegenPercent > 0 && (
              <div className="p-1 rounded bg-rose-950/40 border border-rose-800/40 text-[9.5px] text-rose-200 flex items-center gap-1.5 font-serif">
                <Heart className="w-3 h-3 text-rose-400 shrink-0" />
                <span>Nội tại Kim Thân: Hồi phục <strong>+{bodyStats.hpRegenPercent}% HP</strong> mỗi hiệp giao chiến!</span>
              </div>
            )}

            {/* Chi phí thăng cấp */}
            {!isBodyMaxed && (
              <div className="bg-black/50 p-1.5 rounded border border-zinc-800/70 text-[9.5px] space-y-0.5">
                <div className="text-zinc-400 font-serif">Nguyên Liệu Tôi Thể:</div>
                <div className="grid grid-cols-3 gap-1 font-mono">
                  <span className={`flex items-center gap-1 ${ (player.tinhHuyetYeuThu || 0) >= bodyCheck.cost.tinhHuyet ? 'text-emerald-400' : 'text-red-400'}`}>
                    🩸 {player.tinhHuyetYeuThu || 0}/{bodyCheck.cost.tinhHuyet}
                  </span>
                  <span className={`flex items-center gap-1 ${ownedKhiHuyetPills >= bodyCheck.cost.khiHuyetDan ? 'text-emerald-400' : 'text-red-400'}`}>
                    💊 {ownedKhiHuyetPills}/{bodyCheck.cost.khiHuyetDan}
                  </span>
                  <span className={`flex items-center gap-1 ${player.linhThach >= bodyCheck.cost.linhThach ? 'text-emerald-400' : 'text-red-400'}`}>
                    💎 {player.linhThach.toLocaleString()}/{bodyCheck.cost.linhThach}
                  </span>
                </div>
              </div>
            )}

            {/* Nút hành động */}
            {isBodyMaxed ? (
              <div className="w-full py-1 text-center text-[9.5px] font-serif font-bold text-amber-300 bg-amber-950/30 rounded border border-amber-800/40">
                ✨ Hỗn Độn Bá Thể - Vô Địch Thế Gian
              </div>
            ) : (
              <button
                onClick={handleUpgradeBodyRefinement}
                disabled={!bodyCheck.canUpgrade}
                className={`w-full py-1.5 px-2 rounded font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                  bodyCheck.canUpgrade
                    ? 'bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 hover:brightness-110 text-white shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-300" />
                <span>
                  {bodyRef.level === 9
                    ? `Vượt Huyết Khí Thí Luyện (Tỉ lệ: ~${trialRate}%)`
                    : 'Tôi Thể Thăng Tầng'}
                </span>
              </button>
            )}
          </div>
        )}

        {/* TAB 2: THẦN HỒN (HỒN TU - CANONICAL 4 STAGES) */}
        {dualCultivationTab === 'soul' && (
          <div className="space-y-2 bg-gradient-to-b from-purple-950/20 to-transparent p-2 rounded border border-purple-900/30">
            {/* Cảnh giới & Tầng */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-serif font-bold text-purple-200 flex items-center gap-1.5">
                  <span>{soulProg.stageConfig.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-purple-950/60 text-purple-300 border border-purple-800/50 rounded font-mono">
                    {soulProg.isUltimateMax ? 'Đại Viên Mãn' : `Tầng ${soulProg.subTier}/9`}
                  </span>
                </div>
                <p className="text-[9.5px] text-zinc-400 italic font-serif mt-0.5">
                  "{soulProg.stageConfig.description}"
                </p>
              </div>
              <span className="text-[10px] font-mono text-purple-400 font-bold shrink-0">
                Bậc {soulProg.stageIndex + 1}/4
              </span>
            </div>

            {/* Thanh Khí Tượng Thức Hải */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9.5px] font-mono text-zinc-400">
                <span className="text-purple-300/90 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-purple-400" /> Thức Hải Linh Quang
                </span>
                <span className="text-purple-200">
                  Tầng {soulProg.subTier}/9 ({soulExpPercent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-purple-900/40">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                  style={{ width: `${soulExpPercent}%` }}
                />
              </div>
            </div>

            {/* Chỉ số gia trì */}
            <div className="grid grid-cols-3 gap-1 text-[9.5px] font-mono py-0.5">
              <div className="p-1 rounded bg-black/40 border border-purple-900/20 text-center">
                <span className="text-zinc-400 block text-[8.5px]">Chân Nguyên</span>
                <span className="text-indigo-300 font-bold">+{soulProg.bonuses.maxMp.toLocaleString()}</span>
              </div>
              <div className="p-1 rounded bg-black/40 border border-purple-900/20 text-center">
                <span className="text-zinc-400 block text-[8.5px]">Thần Thức</span>
                <span className="text-purple-300 font-bold">+{soulProg.bonuses.thanThuc}</span>
              </div>
              <div className="p-1 rounded bg-black/40 border border-purple-900/20 text-center">
                <span className="text-zinc-400 block text-[8.5px]">Bạo Kích Hồn</span>
                <span className="text-cyan-300 font-bold">+{soulProg.bonuses.critRate}%</span>
              </div>
            </div>

            {/* Hiệu ứng Đặc Quyền & Kỹ Năng Nội Tại */}
            <div className="p-1.5 rounded bg-purple-950/40 border border-purple-800/40 text-[9.5px] text-purple-200 space-y-1 font-serif">
              {soulProg.bonuses.hasMindBlade ? (
                <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                  <Target className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>🗡️ [Thần Niệm Kiếm]: Đầu Hiệp 1 phóng kiếm khí xuyên 100% giáp (~{soulProg.bonuses.mindBladeDamage.toLocaleString()} ST Chuẩn)!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>Khai ngộ thức hải, giảm 10% Chân Nguyên tiêu hao trong Bí Cảnh.</span>
                </div>
              )}

              {soulProg.bonuses.hasYangSoul && (
                <div className="flex items-center gap-1.5 text-amber-300 font-medium pt-0.5 border-t border-purple-900/30">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>☀️ [Dương Thần Viên Mãn]: Miễn nhiễm mê muội/chấn nhiếp, Thần Niệm Kiếm +25% ST!</span>
                </div>
              )}
            </div>

            {/* Chi phí thăng cấp */}
            {!soulProg.isUltimateMax && (
              <div className="bg-black/50 p-1.5 rounded border border-zinc-800/70 text-[9.5px] space-y-0.5">
                <div className="text-zinc-400 font-serif">Tài Nguyên Ngưng Hồn:</div>
                <div className="grid grid-cols-3 gap-1 font-mono">
                  <span className={`flex items-center gap-1 ${soulProg.ownedResources.linhThach >= soulProg.cost.linhThach ? 'text-emerald-400' : 'text-red-400'}`}>
                    💎 {soulProg.ownedResources.linhThach.toLocaleString()}/{soulProg.cost.linhThach.toLocaleString()}
                  </span>
                  <span className={`flex items-center gap-1 ${soulProg.ownedResources.soulStone >= soulProg.cost.soulStone ? 'text-emerald-400' : 'text-red-400'}`}>
                    🔮 {soulProg.ownedResources.soulStone}/{soulProg.cost.soulStone} U Hồn
                  </span>
                  <span className={`flex items-center gap-1 ${soulProg.ownedResources.soulPill >= soulProg.cost.soulPill ? 'text-emerald-400' : 'text-red-400'}`}>
                    💊 {soulProg.ownedResources.soulPill}/{soulProg.cost.soulPill} Đan
                  </span>
                </div>
              </div>
            )}

            {/* Nút hành động */}
            <div className="space-y-1.5 pt-0.5">
              {soulProg.isUltimateMax ? (
                <div className="w-full py-1 text-center text-[9.5px] font-serif font-bold text-purple-300 bg-purple-950/30 rounded border border-purple-800/40">
                  🔮 Dương Thần Cực Cảnh - Thần Thức Bất Diệt
                </div>
              ) : (
                <button
                  onClick={handleUpgradeSoulCultivation}
                  disabled={!soulCheck.canUpgrade}
                  className={`w-full py-1.5 px-2 rounded font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                    soulCheck.canUpgrade
                      ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-700 hover:brightness-110 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>
                    {soulProg.isMaxTierInStage
                      ? `Đột Phá Đại Cảnh Giới (Tỉ lệ ~${soulCheck.successRate}%)`
                      : 'Tôi Hồn Thăng Tầng'}
                  </span>
                </button>
              )}

              {/* Nút Phân Thần Du Ngoạn (Mở khi đạt Tầng 3 - Nguyên Thần Xuất Khiếu) */}
              {soulProg.bonuses.hasExpedition && (
                <button
                  onClick={() => {
                    if (isExpeditionFinished && handleClaimSoulExpedition) {
                      handleClaimSoulExpedition();
                    } else {
                      setShowExpeditionModal(true);
                    }
                  }}
                  className={`w-full py-1 px-2 rounded-lg font-serif font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                    isExpeditionFinished
                      ? 'bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-500 text-white border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                      : isExpeditionActive
                      ? 'bg-purple-950/70 border-purple-500/50 text-purple-200 hover:bg-purple-900/60'
                      : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-indigo-950/80 border-indigo-500/40 text-cyan-200 hover:border-cyan-400/60 shadow-sm'
                  }`}
                >
                  {isExpeditionFinished ? (
                    <>
                      <Gift className="w-3.5 h-3.5 text-amber-300" />
                      <span>🎁 Thu Hồi Phân Thần (Đã Về - Bấm Nhận Quà)</span>
                    </>
                  ) : isExpeditionActive ? (
                    <>
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span>⏳ Phân Thần Đang Du Ngoạn (Bấm Xem)</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>🌌 Phân Thần Du Ngoạn (AFK Độc Lập)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Phân Thần Du Ngoạn */}
      <AstralSoulExpeditionModal
        player={player}
        isOpen={showExpeditionModal}
        onClose={() => setShowExpeditionModal(false)}
        onStartExpedition={(dest, hours) => {
          if (handleStartSoulExpedition) {
            handleStartSoulExpedition(dest, hours);
          }
        }}
        onClaimExpedition={() => {
          if (handleClaimSoulExpedition) {
            handleClaimSoulExpedition();
          }
        }}
      />
    </>
  );
};

