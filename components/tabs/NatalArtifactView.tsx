import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  Flame,
  Heart,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  Sword,
  MessageSquare,
  Package,
  Layers,
  ChevronRight,
  Droplets,
  Eye,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { PlayerStats, Equipment, Ore } from '@/lib/types';
import { SpiritPersonality, SpiritStage } from '@/lib/types/natal-artifact';
import {
  SPIRIT_STAGES_CONFIG,
  SPIRIT_PERSONALITIES_CONFIG,
  SPIRIT_ARCHETYPES
} from '@/lib/natal-artifact-data';
import { useNatalArtifactActions } from '@/hooks/useNatalArtifactActions';
import { canBindEquipmentAsNatal } from '@/lib/natal-artifact-logic';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import realmsDataRaw from '@/data/realms-data.json';
import { DomainResonanceView } from './DomainResonanceView';

const realmsData = realmsDataRaw as any[];

export interface NatalArtifactViewProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: any) => void;
  showToast: (msg: string) => void;
}

export const NatalArtifactView: React.FC<NatalArtifactViewProps> = ({
  player,
  setPlayer,
  addLog,
  showToast,
}) => {
  const {
    natal,
    spirit,
    combatBonus,
    ascensionRequirement,
    selectedPersonality,
    setSelectedPersonality,
    isProcessing,
    activeDialogQuote,
    handleBindNatal,
    handleUnbindNatal,
    handleNourishWithEnergy,
    handleDevourEquipment,
    handleDevourOre,
    handleInteractWithSpirit,
    handleAscendNatalWithEssence,
  } = useNatalArtifactActions({
    player,
    setPlayer,
    addLog,
    showToast,
  });

  // Local state for UI
  const [selectedEquipToBind, setSelectedEquipToBind] = useState<string | null>(null);
  const [devourTab, setDevourTab] = useState<'equipment' | 'ore'>('equipment');
  const [showUnbindConfirm, setShowUnbindConfirm] = useState<boolean>(false);
  const [showDevourModal, setShowDevourModal] = useState<boolean>(false);

  // Danh sách trang bị có thể tế luyện (trong người và trong túi)
  const candidateEquips: Equipment[] = [
    ...(player.equipment ? Object.values(player.equipment).filter(Boolean) as Equipment[] : []),
    ...(player.inventory?.equipments || [])
  ].filter(e => canBindEquipmentAsNatal(player, e).canBind);

  // Danh sách trang bị rác có thể thôn phệ
  const devourableEquips: Equipment[] = (player.inventory?.equipments || []).filter(
    e => !natal || e.id !== natal.baseEquipmentId
  );

  // Danh sách khoáng thạch có thể thôn phệ
  const devourableOres: Ore[] = (player.inventory?.ores || []).filter(o => o && o.quantity > 0);

  const currentRealmIndex = player.currentRealm || 0;
  const currentRealmName = realmsData[currentRealmIndex]?.name || 'Phàm Nhân';
  const isTrucCoOrAbove = currentRealmIndex >= 11;

  // Hôm nay đã ôn dưỡng bao nhiêu lần
  const today = new Date().toISOString().slice(0, 10);
  const dailyNourishCount = spirit?.lastNourishDate === today ? (spirit.dailyNourishCount || 0) : 0;

  return (
    <div className="space-y-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TRƯỜNG HỢP 1: ĐÃ TẾ LUYỆN BẢN MỆNH PHÁP BẢO                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {natal ? (
        <div className="space-y-4">
          {/* KHỐI 1: TÂY DỰC (TRẬN ĐÀI BẢN MỆNH) & ĐÔNG DỰC (THẦN ĐIỆN KHÍ LINH) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* TÂY DỰC: TRẬN ĐÀI ÔN DƯỠNG BẢN MỆNH */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#14121e] via-[#0d0d17] to-[#08080f] border border-amber-600/40 shadow-[0_0_20px_rgba(245,158,11,0.12)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                {/* Header Trận Đài */}
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🗡️</span>
                    <div>
                      <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5">
                        Trận Đài Ôn Dưỡng Bản Mệnh
                      </h3>
                      <p className="text-[10px] text-amber-400/70 font-serif">
                        Đan điền uẩn dưỡng • Đồng sinh cộng tử
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/50 text-amber-300 font-bold">
                    Cộng Hưởng: +{combatBonus.summaryText ? natal.resonanceRate + Math.max(0, Math.floor((currentRealmIndex - (natal.boundRealmId || 0)) / 5) * 5) : natal.resonanceRate}%
                  </span>
                </div>

                {/* Khối Pháp Bảo Lơ Lửng Giữa Vòng Xoáy */}
                <div className="py-5 px-3 rounded-lg bg-black/40 border border-amber-800/30 text-center relative group">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-900/40 to-yellow-600/20 border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.35)] animate-pulse">
                    {natal.type === 'weapon' ? '⚔️' : natal.type === 'armor' ? '🛡️' : natal.type === 'accessory' ? '📿' : '🔮'}
                  </div>
                  <h4 className="mt-2.5 text-base font-serif font-bold text-amber-100 tracking-wide">
                    【{natal.name}】
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 font-serif">
                      {natal.grade}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-700 text-zinc-300">
                      Tế luyện tại: {realmsData[natal.boundRealmId]?.name || 'Trúc Cơ'}
                    </span>
                  </div>
                </div>

                {/* Các Dòng Thuộc Tính Thăng Hoa */}
                <div className="space-y-1.5 p-3 rounded-lg bg-black/30 border border-amber-900/30 text-xs font-mono">
                  <div className="text-[11px] font-serif font-bold text-amber-300/90 border-b border-amber-950 pb-1 flex justify-between">
                    <span>⚡ Thuộc Tính Thăng Hoa (Cộng Hưởng)</span>
                    <span className="text-amber-400">+{Math.max(0, Math.floor((currentRealmIndex - (natal.boundRealmId || 0)) / 5) * 5)}% Cảnh Giới</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-400">Công Kích:</span>
                      <span className="text-amber-300 font-bold">+{combatBonus.atkBonus.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span className="text-zinc-400">Phòng Ngự:</span>
                      <span className="text-cyan-300 font-bold">+{combatBonus.defBonus.toLocaleString()}</span>
                    </div>
                    {combatBonus.critRateBonus > 0 && (
                      <div className="flex justify-between text-zinc-300">
                        <span className="text-zinc-400">Tỉ Lệ Bạo:</span>
                        <span className="text-rose-300 font-bold">+{combatBonus.critRateBonus}%</span>
                      </div>
                    )}
                    {combatBonus.dmgReductionBonus > 0 && (
                      <div className="flex justify-between text-zinc-300">
                        <span className="text-zinc-400">Miễn Thương:</span>
                        <span className="text-emerald-300 font-bold">+{combatBonus.dmgReductionBonus}%</span>
                      </div>
                    )}
                    {combatBonus.cultivationSpeedBonus > 0 && (
                      <div className="flex justify-between text-zinc-300">
                        <span className="text-zinc-400">Tốc Tu Vi:</span>
                        <span className="text-purple-300 font-bold">+{combatBonus.cultivationSpeedBonus}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Khí Linh Phong Hồn nếu có trên Bản Mệnh */}
                {(() => {
                  const baseEq = player.natalArtifact?.baseEquipment ||
                    (player.equipment?.weapon?.id === natal.baseEquipmentId ? player.equipment.weapon : null) ||
                    (player.inventory?.equipment || []).find(e => e.id === natal.baseEquipmentId);
                  const soul = baseEq?.infusedSoul;
                  if (!soul) return null;

                  return (
                    <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-600/50 space-y-1">
                      <div className="flex items-center justify-between text-xs font-serif font-bold">
                        <span className="text-purple-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Khí Linh Thần Binh: 【{soul.awakenedName || soul.soulName}】</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/60 border border-purple-500/40 text-purple-200">
                          Bậc {soul.evolutionStage}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="text-amber-300">⚡ {soul.currentProc.name}</span>
                        <span>{soul.spiritExp}/{soul.maxSpiritExp} EXP</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Nút Hủy Bỏ Khế Ước */}
              <div className="pt-3 mt-2 border-t border-amber-950/60">
                {showUnbindConfirm ? (
                  <div className="p-2.5 rounded bg-rose-950/60 border border-rose-600/50 space-y-2">
                    <p className="text-[11px] text-rose-200 text-center font-serif">
                      ⚠️ Phản phệ tâm mạch: Mất 20% HP hiện tại và 5% Tu Vi. Pháp bảo trở lại thành trang bị thường. Xác nhận?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUnbindNatal}
                        disabled={isProcessing}
                        className="flex-1 py-1.5 rounded bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold font-serif transition cursor-pointer"
                      >
                        {isProcessing ? 'Đang Giải Trừ...' : 'Xác Nhận Hủy'}
                      </button>
                      <button
                        onClick={() => setShowUnbindConfirm(false)}
                        className="flex-1 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer"
                      >
                        Hủy Thao Tác
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUnbindConfirm(true)}
                    className="w-full py-1.5 rounded-lg bg-zinc-900/60 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-900/50 font-serif text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Giải Trừ Khế Ước Bản Mệnh</span>
                  </button>
                )}
              </div>
            </div>

            {/* ĐÔNG DỰC: THẦN ĐIỆN KHÍ LINH */}
            {spirit && (
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#121927] via-[#0d121c] to-[#080b12] border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  {/* Header Thần Điện */}
                  <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      <div>
                        <h3 className="text-sm font-serif font-bold text-cyan-200 flex items-center gap-1.5">
                          Thần Điện Khí Linh
                        </h3>
                        <p className="text-[10px] text-cyan-400/70 font-serif">
                          Linh trí thức tỉnh • Thần niệm tương thông
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-600/50 text-cyan-300 font-bold">
                      {SPIRIT_STAGES_CONFIG[spirit.stage].name}
                    </span>
                  </div>

                  {/* Chân Dung Huyễn Ảnh Khí Linh & Ô Hội Thoại */}
                  <div className="p-3 rounded-lg bg-black/40 border border-cyan-800/30 space-y-3 text-center">
                    <div
                      onClick={handleInteractWithSpirit}
                      className="cursor-pointer group relative inline-block"
                      title="Nhấp vào để trò chuyện cùng Khí Linh"
                    >
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-950 to-blue-900/40 border-2 border-cyan-400/60 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition transform group-hover:scale-105">
                        {spirit.avatar}
                      </div>
                      <span className="absolute bottom-0 right-1 text-xs">💬</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-serif font-bold text-cyan-100 flex items-center justify-center gap-2">
                        <span>【{spirit.name}】</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-normal border border-cyan-700/60 bg-cyan-950/60 text-cyan-300">
                          {SPIRIT_PERSONALITIES_CONFIG[spirit.personality].name}
                        </span>
                      </h4>
                      <p className="text-[10px] text-zinc-400 italic mt-0.5">
                        (Nhấp vào Khí Linh để lắng nghe truyền âm thức hải)
                      </p>
                    </div>

                    {/* Bong bóng thoại tâm tình */}
                    {activeDialogQuote && (
                      <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-600/40 text-cyan-200 text-xs font-serif italic text-left relative animate-fadeIn">
                        "{activeDialogQuote}"
                      </div>
                    )}

                    {/* Thanh EXP Tiến Hóa & Điểm Hảo Cảm */}
                    <div className="space-y-2 pt-1 text-left">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="text-zinc-400">Tiến Cấp Linh Trí:</span>
                          <span className="text-cyan-300 font-bold">{spirit.exp} / {spirit.maxExp} EXP</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-cyan-950">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.floor((spirit.exp / Math.max(1, spirit.maxExp)) * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
                            Độ Hảo Cảm (Đồng Hóa):
                          </span>
                          <span className="text-rose-300 font-bold">{spirit.intimacy} / 100</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-rose-950">
                          <div
                            className="h-full bg-gradient-to-r from-rose-600 to-pink-400 transition-all duration-500"
                            style={{ width: `${Math.min(100, spirit.intimacy)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chiến Kỹ Hộ Chủ Trong Combat */}
                  <div className="p-2.5 rounded-lg bg-black/30 border border-cyan-900/30 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-serif font-bold text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Chiến Kỹ Hộ Chủ: 【{SPIRIT_PERSONALITIES_CONFIG[spirit.personality].skillName}】</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans leading-relaxed pl-5">
                      {SPIRIT_PERSONALITIES_CONFIG[spirit.personality].skillDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-cyan-400/60 font-serif">
                  Tự động hiển hóa trợ chiến trong Boss Thí Luyện & Trấn Ma Tháp
                </div>
              </div>
            )}
          </div>

          {/* KHỐI 2: HẠ TẦNG (KHU THAO TÁC BỒI DƯỠNG & THÔN PHỆ) */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#10141f] via-[#0d1017] to-[#0a0c12] border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌀</span>
                <h3 className="text-sm font-serif font-bold text-cyan-200">
                  Bồi Dưỡng & Thôn Phệ Tiến Hóa
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                Ôn Dưỡng Hôm Nay: <strong className="text-cyan-300">{dailyNourishCount}/3</strong> lần
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Thao tác 1: Ôn Dưỡng Chân Nguyên */}
              <div className="p-3 rounded-lg bg-black/40 border border-cyan-800/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-cyan-300">
                    <span>🧘 Ôn Dưỡng Chân Nguyên</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Rót Chân Nguyên đan điền vào pháp bảo để uẩn dưỡng linh trí. Mỗi lần tăng <strong className="text-cyan-300">+120 EXP</strong> và <strong className="text-rose-300">+3 Hảo Cảm</strong>.
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Tiêu hao: 100 Chân Nguyên (MP) • Tối đa 3 lần/ngày
                  </p>
                </div>

                <button
                  onClick={handleNourishWithEnergy}
                  disabled={dailyNourishCount >= 3 || (player.linhLuc || 0) < 100 || isProcessing}
                  className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                    dailyNourishCount >= 3 || (player.linhLuc || 0) < 100
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-700 to-blue-700 hover:brightness-110 text-white border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>
                    {dailyNourishCount >= 3
                      ? 'Hôm Nay Đã Hết Lượt (3/3)'
                      : (player.linhLuc || 0) < 100
                      ? 'Không Đủ Chân Nguyên (100 MP)'
                      : 'Rót Chân Nguyên Ôn Dưỡng (+120 EXP)'}
                  </span>
                </button>
              </div>

              {/* Thao tác 2: Thôn Phệ Vạn Vật (Mở Drawer/Modal) */}
              <div className="p-3 rounded-lg bg-black/40 border border-purple-800/30 space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-purple-300">
                    <span>🌀 Thôn Phệ Vạn Vật</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Cho Khí Linh nuốt vũ khí, đạo bào rác hoặc khoáng thạch quý hiếm. Nhận lượng lớn EXP và có <strong className="text-amber-300">15% cơ hội</strong> đồng hóa vĩnh viễn dòng thuộc tính!
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Kho trang bị rác: {devourableEquips.length} món • Khoáng thạch: {devourableOres.length} loại
                  </p>
                </div>

                <button
                  onClick={() => setShowDevourModal(true)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-800 hover:brightness-110 text-purple-100 font-serif font-bold text-xs border border-purple-500/60 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                >
                  <Package className="w-3.5 h-3.5 text-purple-200" />
                  <span>Mở Giao Diện Thôn Phệ Trang Bị / Khoáng Thạch</span>
                </button>
              </div>
            </div>
          </div>

          {/* KHỐI 3: THĂNG GIAI BẢN MỆNH (TINH HOA TRÚC THẦN) */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#181410] via-[#120f0d] to-[#0a0807] border border-amber-500/40 space-y-3 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <h3 className="text-sm font-serif font-bold text-amber-300">
                  Thăng Giai Bản Mệnh (Tinh Hoa Trúc Thần)
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-zinc-400">Tinh Hoa Rèn Đúc:</span>
                <strong className={(player.inventory?.forgingEssence || 0) >= (ascensionRequirement.requiredEssence || 0) ? 'text-amber-400' : 'text-red-400'}>
                  {(player.inventory?.forgingEssence || 0).toLocaleString()}
                </strong>
                {ascensionRequirement.nextConfig && (
                  <span className="text-zinc-500">/{ascensionRequirement.requiredEssence.toLocaleString()}</span>
                )}
              </div>
            </div>

            {ascensionRequirement.isMaxTier ? (
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-600/40 text-center space-y-1">
                <div className="text-amber-300 font-serif font-bold text-xs flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Bản Mệnh Pháp Bảo Đạt Cực Hạn Cửu Giai</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Pháp bảo đã đạt phẩm giai tối cao, thần uy quán thông tam giới, vạn kiếp bất diệt!
                </p>
              </div>
            ) : ascensionRequirement.nextConfig ? (
              <div className="space-y-3">
                {/* Thông tin bậc & Cảnh giới yêu cầu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-amber-900/30">
                    <div className="text-[10px] text-zinc-400">Bậc Thăng Tiến</div>
                    <div className="text-amber-200 font-serif font-bold flex items-center gap-1 mt-0.5">
                      <span>Giai {natal?.tier || 1}</span>
                      <span className="text-amber-500">➔</span>
                      <span className="text-amber-300">Giai {ascensionRequirement.nextTier} ({ascensionRequirement.nextConfig.tierName})</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-amber-900/30">
                    <div className="text-[10px] text-zinc-400">Gia Trì Uy Lực</div>
                    <div className="text-emerald-300 font-serif font-bold mt-0.5 flex items-center gap-1">
                      <span>+{Math.round(ascensionRequirement.nextConfig.statMultiplierBonus * 100)}% Toàn Chỉ Số</span>
                      <span className="text-zinc-500 text-[10px]">• Mở {ascensionRequirement.nextConfig.maxSocketsUnlock} Lỗ</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-amber-900/30">
                    <div className="text-[10px] text-zinc-400">EXP Khí Linh Thưởng</div>
                    <div className="text-cyan-300 font-serif font-bold mt-0.5">
                      +{ascensionRequirement.nextConfig.spiritExpBonus.toLocaleString()} EXP
                    </div>
                  </div>
                </div>

                {/* Thanh đo Tinh Hoa & Cảnh giới kiểm tra */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400">Tiến Độ Tinh Hoa Rèn Đúc:</span>
                    <span className="font-mono text-xs">
                      <strong className={(player.inventory?.forgingEssence || 0) >= ascensionRequirement.requiredEssence ? 'text-amber-300' : 'text-zinc-400'}>
                        {(player.inventory?.forgingEssence || 0).toLocaleString()}
                      </strong>
                      <span className="text-zinc-500"> / {ascensionRequirement.requiredEssence.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-amber-950">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${Math.min(100, ((player.inventory?.forgingEssence || 0) / (ascensionRequirement.requiredEssence || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Cảnh báo khóa cảnh giới nếu chưa đạt */}
                {!ascensionRequirement.isRealmQualified && (
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-700/60 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>🔒 Cần đạt cảnh giới [{ascensionRequirement.nextConfig.requiredRealmName}] để thăng giai Bản Mệnh!</span>
                  </div>
                )}

                {/* Nút thăng giai */}
                <button
                  onClick={handleAscendNatalWithEssence}
                  disabled={!ascensionRequirement.canAscend || isProcessing}
                  className={`w-full py-2.5 rounded-lg font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                    !ascensionRequirement.canAscend || isProcessing
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:brightness-110 text-amber-50 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>
                    {!ascensionRequirement.isRealmQualified
                      ? `🔒 Cần Đạt [${ascensionRequirement.nextConfig.requiredRealmName}]`
                      : (player.inventory?.forgingEssence || 0) < ascensionRequirement.requiredEssence
                      ? `Thiếu ${(ascensionRequirement.requiredEssence - (player.inventory?.forgingEssence || 0)).toLocaleString()} Tinh Hoa Rèn Đúc`
                      : `⚡ THĂNG GIAI BẢN MỆNH (Tiêu hao ${ascensionRequirement.requiredEssence.toLocaleString()} Tinh Hoa)`}
                  </span>
                </button>
              </div>
            ) : null}
          </div>

          {/* ======================================================== */}
          {/* KHỐI 4: CỘNG HƯỞNG DỊ TƯỢNG NGŨ HÀNH (DOMAIN RESONANCES)  */}
          {/* ======================================================== */}
          <DomainResonanceView
            player={player}
            setPlayer={setPlayer}
            addLog={addLog}
            showToast={showToast}
          />
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* TRƯỜNG HỢP 2: CHƯA CÓ BẢN MỆNH PHÁP BẢO (NGHI THỨC TẾ LUYỆN)   */
        /* ───────────────────────────────────────────────────────────── */
        <div className="space-y-4">
          {/* Banner Giới Thiệu Cổ Phong */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-[#161224] via-[#0f0e1a] to-[#08080f] border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                🗡️
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Nghi Thức Tế Luyện Bản Mệnh & Thức Tỉnh Khí Linh
                </h3>
                <p className="text-xs text-amber-400/80 font-serif">
                  Trúc Cơ Kỳ Khởi Đầu • Vạn Vật Hóa Linh • Đồng Sinh Cộng Tử
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Trang bị thông thường dẫu sắc bén đến đâu cũng chỉ là vật vô tri vô giác. Chỉ khi lấy <span className="text-rose-400 font-semibold">Bản Mệnh Tinh Huyết</span> nhỏ vào pháp bảo, ôn dưỡng trong đan điền, mới có thể đánh thức linh trí ngủ say hàng vạn năm, ngưng tụ thành <span className="text-cyan-300 font-semibold">Khí Linh Hộ Chủ</span>.
            </p>

            {/* Điều Kiện Tế Luyện */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-xs font-serif">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                isTrucCoOrAbove ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300' : 'bg-rose-950/30 border-rose-700/50 text-rose-300'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Cảnh Giới: Trúc Cơ Kỳ+ ({currentRealmName})</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-amber-950/30 border-amber-700/50 text-amber-300 flex items-center gap-2">
                <span>💎</span>
                <span>Phẩm Cấp: Cực Phẩm trở lên</span>
              </div>
              <div className="p-2.5 rounded-lg border bg-blue-950/30 border-blue-700/50 text-blue-300 flex items-center gap-2">
                <span>🩸</span>
                <span>Tiêu Hao: 1 Tinh Huyết + 10 Trung Phẩm LT</span>
              </div>
            </div>
          </div>

          {/* LỰA CHỌN TRANG BỊ ĐỂ PHONG BẢN MỆNH */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#10141f] to-[#0a0c12] border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">⚔️</span>
                <h4 className="text-xs font-serif font-bold text-cyan-200">
                  Bước 1: Chọn Pháp Bảo Tâm Đắc Để Phong Bản Mệnh
                </h4>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                {candidateEquips.length} món đủ điều kiện
              </span>
            </div>

            {candidateEquips.length === 0 ? (
              <div className="p-6 text-center space-y-2 rounded-lg bg-black/40 border border-zinc-800 text-zinc-400">
                <p className="text-xs font-serif">
                  Không tìm thấy trang bị nào đạt chuẩn phẩm cấp <span className="text-amber-300 font-semibold">[Cực Phẩm]</span> trở lên trong người hoặc túi đồ!
                </p>
                <p className="text-[11px] text-zinc-500">
                  Hãy vào tab <strong>[Rèn Đúc]</strong> đúc trang bị cao giai hoặc tầm bảo tại <strong>[Bí Cảnh / Boss Thí Luyện]</strong>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {candidateEquips.map(equip => {
                  const isSelected = selectedEquipToBind === equip.id;
                  const qInfo = getItemQuality(equip.quality || 'cuc_pham');

                  return (
                    <div
                      key={equip.id}
                      onClick={() => setSelectedEquipToBind(equip.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/50 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-serif font-bold text-zinc-200" style={{ color: qInfo.color }}>
                            {equip.name}
                          </h5>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: `${qInfo.color}20`, color: qInfo.color }}>
                            {equip.grade}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">
                          {equip.type === 'weapon' ? 'Vũ khí' : equip.type === 'armor' ? 'Đạo bào' : equip.type === 'accessory' ? 'Trang sức' : 'Pháp bảo'} • Lực chiến: +{equip.powerBonus || equip.hpBonus || 100}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-zinc-800/60 flex justify-between items-center text-[10px]">
                        <span className="text-amber-400/90 font-mono">Bản Mệnh: +25% Stats</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-serif ${
                          isSelected ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {isSelected ? 'Đã Chọn' : 'Chọn Món Này'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* LỰA CHỌN BẢN TÍNH KHÍ LINH BAN SƠ */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#10141f] to-[#0a0c12] border border-cyan-900/40 space-y-3">
            <div className="flex items-center gap-2 border-b border-cyan-950 pb-2">
              <span className="text-base">🔮</span>
              <h4 className="text-xs font-serif font-bold text-cyan-200">
                Bước 2: Chọn Bản Tính Khí Linh Thức Tỉnh
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {(Object.keys(SPIRIT_PERSONALITIES_CONFIG) as SpiritPersonality[]).map(pKey => {
                const pCfg = SPIRIT_PERSONALITIES_CONFIG[pKey];
                const isSelected = selectedPersonality === pKey;

                return (
                  <div
                    key={pKey}
                    onClick={() => setSelectedPersonality(pKey)}
                    className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-cyan-200">
                          {pCfg.name}
                        </span>
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-zinc-700'}`} />
                      </div>
                      <div className="text-[11px] font-serif font-semibold text-amber-300">
                        【{pCfg.skillName}】
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                        {pCfg.skillDesc}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-zinc-800/60 text-[9px] text-cyan-400/80 font-mono">
                      {pCfg.triggerDesc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NÚT THỰC HIỆN NGHI THỨC TẾ LUYỆN */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-black to-cyan-950/30 border border-amber-600/40 text-center space-y-2">
            <button
              onClick={() => selectedEquipToBind && handleBindNatal(selectedEquipToBind)}
              disabled={!selectedEquipToBind || !isTrucCoOrAbove || isProcessing}
              className={`w-full max-w-md mx-auto py-3 rounded-xl font-serif font-bold text-sm tracking-wide transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                !selectedEquipToBind || !isTrucCoOrAbove
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:brightness-110 text-white border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] animate-pulse'
              }`}
            >
              <Droplets className="w-4 h-4 text-rose-200" />
              <span>
                {isProcessing
                  ? 'Đang Nhỏ Tinh Huyết Tế Luyện...'
                  : !isTrucCoOrAbove
                  ? 'Cần Cảnh Giới Trúc Cơ Kỳ Trở Lên'
                  : !selectedEquipToBind
                  ? 'Vui Lòng Chọn Pháp Bảo Ở Bước 1'
                  : '🩸 Nhỏ Tinh Huyết Tế Luyện Bản Mệnh'}
              </span>
            </button>
            <p className="text-[10px] text-zinc-500 font-serif">
              * Tiêu hao: 1 Tinh Huyết (-10% HP tạm thời), 10 Trung Phẩm Linh Thạch, 50 Thần Niệm
            </p>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL THÔN PHỆ TRANG BỊ & KHOÁNG THẠCH                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showDevourModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-gradient-to-b from-[#121624] via-[#0d101a] to-[#090b12] border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.25)] flex flex-col overflow-hidden animate-fadeIn">
            {/* Header Modal */}
            <div className="p-4 border-b border-purple-900/40 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌀</span>
                <div>
                  <h3 className="text-sm font-serif font-bold text-purple-200">
                    Thôn Phệ Vạn Vật • Bồi Dưỡng Khí Linh
                  </h3>
                  <p className="text-[10px] text-purple-400/70 font-serif">
                    Chuyển hóa tạp chất thành tinh hoa linh khí
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDevourModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub-Tabs: Trang Bị Rác vs Khoáng Thạch */}
            <div className="flex border-b border-zinc-800/80 bg-black/40 px-4 pt-2 gap-2">
              <button
                onClick={() => setDevourTab('equipment')}
                className={`py-1.5 px-3 rounded-t-lg font-serif text-xs font-bold transition cursor-pointer ${
                  devourTab === 'equipment'
                    ? 'bg-purple-950/80 text-purple-200 border-t border-x border-purple-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ⚔️ Nuốt Trang Bị ({devourableEquips.length})
              </button>
              <button
                onClick={() => setDevourTab('ore')}
                className={`py-1.5 px-3 rounded-t-lg font-serif text-xs font-bold transition cursor-pointer ${
                  devourTab === 'ore'
                    ? 'bg-purple-950/80 text-purple-200 border-t border-x border-purple-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                💎 Nuốt Khoáng Thạch ({devourableOres.length})
              </button>
            </div>

            {/* Nội dung danh sách */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[50vh]">
              {devourTab === 'equipment' ? (
                devourableEquips.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-serif">
                    Túi đồ hiện không có trang bị rác nào để thôn phệ!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {devourableEquips.map(equip => {
                      const qInfo = getItemQuality(equip.quality || 'thuong_pham');
                      // EXP ước tính
                      const tier = equip.tier || 1;
                      const expEst = 50 + tier * 40;

                      return (
                        <div
                          key={equip.id}
                          className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80 flex items-center justify-between hover:border-purple-700/50 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-serif font-bold" style={{ color: qInfo.color }}>
                                {equip.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono" style={{ backgroundColor: `${qInfo.color}15`, color: qInfo.color }}>
                                {equip.grade}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400">
                              Dự kiến: <strong className="text-cyan-300">+{expEst} EXP</strong> • 15% xác suất hấp thu dòng thuộc tính
                            </p>
                          </div>

                          <button
                            onClick={() => handleDevourEquipment(equip.id)}
                            disabled={isProcessing}
                            className="py-1.5 px-3 rounded bg-purple-900/60 hover:bg-purple-700 text-purple-200 text-xs font-serif font-bold border border-purple-500/40 transition cursor-pointer"
                          >
                            Nuốt Ngay
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                devourableOres.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-serif">
                    Túi đồ không có khoáng thạch nào!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {devourableOres.map(ore => {
                      return (
                        <div
                          key={ore.id}
                          className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80 flex items-center justify-between hover:border-purple-700/50 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-serif font-bold text-amber-200">
                                {ore.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-zinc-800 text-zinc-400">
                                Số lượng: x{ore.quantity}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400">
                              {ore.grade} • Tinh hoa khoáng mạch đúc binh
                            </p>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDevourOre(ore.id, 1)}
                              disabled={isProcessing}
                              className="py-1 px-2.5 rounded bg-purple-900/60 hover:bg-purple-700 text-purple-200 text-[11px] font-serif transition cursor-pointer"
                            >
                              Nuốt x1
                            </button>
                            {ore.quantity >= 5 && (
                              <button
                                onClick={() => handleDevourOre(ore.id, 5)}
                                disabled={isProcessing}
                                className="py-1 px-2.5 rounded bg-indigo-900/60 hover:bg-indigo-700 text-indigo-200 text-[11px] font-serif transition cursor-pointer"
                              >
                                Nuốt x5
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-3 border-t border-purple-950 bg-black/30 flex justify-end">
              <button
                onClick={() => setShowDevourModal(false)}
                className="py-1.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer"
              >
                Đóng Giao Diện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
