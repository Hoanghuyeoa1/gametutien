// components/modals/RebornModal.tsx
// Giao Diện "Lục Đạo Luân Hồi Bàn • Đạo Vận Kế Thừa (Roguelite Meta-Progression Hub)"

import React, { useState } from 'react';
import {
  RotateCcw,
  X,
  Zap,
  Crown,
  Sparkles,
  Shield,
  HeartHandshake,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  CircleDot,
  AlertTriangle
} from 'lucide-react';
import { PlayerStats, LinhCan, DestinyFate } from '@/lib/types';
import {
  REINCARNATION_PERKS_CATALOG,
  getNextSpiritualRootUpgrade,
  KarmaRewardBreakdown,
  isReincarnationDestinyUnlocked
} from '@/lib/reincarnation-logic';
import { REINCARNATION_DESTINY_FATES, REINCARNATION_DESTINY_DEFINITIONS } from '@/lib/destiny-data';
import { ELEMENT_ICONS, ELEMENT_NAMES } from '@/lib/elemental-system';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

export interface RebornModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  isBinhGiaiMode?: boolean;
  rebornScreen: 'summary' | 'inheritance';
  setRebornScreen: (screen: 'summary' | 'inheritance') => void;
  karmaReward: KarmaRewardBreakdown;
  currentAvailableKarma: number;
  selectedPerks: Record<string, number>;
  selectedLinhCan: LinhCan | null;
  selectedInheritedDestinyId: string | null;
  keepSealedNatal: boolean;
  setKeepSealedNatal: (keep: boolean) => void;
  onUpgradePerk: (perkId: string) => void;
  onUpgradeSpiritualRoot: () => void;
  onSelectInheritedDestiny: (destinyId: string | null) => void;
  onProceedToInheritance: () => void;
  onConfirmReincarnation: () => void;
  onStartFreshNewGame?: () => void;
  onOpenMemorial?: () => void;
  onInheritDisciple?: (discipleId: string) => void;
}

export const RebornModal: React.FC<RebornModalProps> = ({
  isOpen,
  onClose,
  player,
  isBinhGiaiMode = false,
  rebornScreen,
  setRebornScreen,
  karmaReward,
  currentAvailableKarma,
  selectedPerks,
  selectedLinhCan,
  selectedInheritedDestinyId,
  keepSealedNatal,
  setKeepSealedNatal,
  onUpgradePerk,
  onUpgradeSpiritualRoot,
  onSelectInheritedDestiny,
  onProceedToInheritance,
  onConfirmReincarnation,
  onStartFreshNewGame,
  onOpenMemorial,
  onInheritDisciple
}) => {
  const [showConfirmNewGame, setShowConfirmNewGame] = useState<boolean>(false);
  const inheritor = player.customSectState?.chosenInheritorId
    ? (player.customSectState.disciples || []).find(d => d.id === player.customSectState?.chosenInheritorId)
    : null;
  if (!isOpen) return null;

  const realmName = realmsData[player.currentRealm || 0]?.name || 'Phàm Nhân';
  const displayRoot = selectedLinhCan || player.linhCan;
  const nextRootUpgrade = displayRoot ? getNextSpiritualRootUpgrade(displayRoot.grade) : null;
  const totalRebornTimes = (player.reincarnationState?.totalRebornTimes || 0) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-4xl w-full p-5 sm:p-7 rounded-2xl border-2 border-purple-500/60 shadow-[0_0_80px_rgba(168,85,247,0.35)] space-y-6 max-h-[94vh] overflow-y-auto custom-scrollbar relative">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-600/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <RotateCcw className="w-6 h-6 text-purple-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-amber-200 to-rose-200 tracking-wide">
                  LỤC ĐẠO LUÂN HỒI • ĐẠO VẬN KẾ THỪA
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700/60 text-purple-300 font-mono font-bold">
                  Kiếp Thứ {totalRebornTimes}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif mt-0.5">
                {isBinhGiaiMode
                  ? 'Binh Giải Xuất Khiếu • Nghịch chuyển càn khôn • Tự tại luân hồi'
                  : 'Thiên Nhân Ngũ Suy • Tọa Hóa Niết Bàn • Tái sinh kỷ nguyên mới'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-rose-300 transition cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900/60"
            title="Đóng (Chưa luân hồi)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* MÀN HÌNH 1: KẾT TOÁN ĐẠO QUẢ KIẾP NÀY */}
        {/* ======================================================== */}
        {rebornScreen === 'summary' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Banner Lục Đạo Luân Hồi Bàn */}
            <div className="relative p-4 rounded-xl border border-purple-800/40 bg-gradient-to-r from-purple-950/40 via-black/80 to-amber-950/30 overflow-hidden shadow-inner">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/70">
                  <div className="text-[10px] text-zinc-400 font-serif">Đạo Hiệu</div>
                  <div className="text-sm font-serif font-bold text-amber-200 truncate mt-0.5">
                    {player.name || 'Tu Sĩ'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/70">
                  <div className="text-[10px] text-zinc-400 font-serif">Cảnh Giới Kiếp Này</div>
                  <div className="text-sm font-serif font-bold text-purple-300 truncate mt-0.5">
                    {realmName}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/70">
                  <div className="text-[10px] text-zinc-400 font-serif">Tuế Nguyệt Tu Đạo</div>
                  <div className="text-sm font-mono font-bold text-sky-300 mt-0.5">
                    {Number(player.age || 16).toFixed(1)} Tuổi
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/70">
                  <div className="text-[10px] text-zinc-400 font-serif">Duyên Khởi Luân Hồi</div>
                  <div className={`text-xs font-serif font-bold mt-0.5 ${isBinhGiaiMode ? 'text-amber-300' : 'text-rose-300'}`}>
                    {isBinhGiaiMode ? '⚡ Binh Giải Tự Tại' : '⏳ Tọa Hóa Niết Bàn'}
                  </div>
                </div>
              </div>
            </div>

            {/* BẢNG KẾT TOÁN CHI TIẾT ĐIỂM LUÂN HỒI (KARMA REWARD) */}
            <div className="p-5 rounded-xl border border-amber-900/50 bg-[#0e0e14] space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-serif font-bold text-amber-200">
                    BẢNG KẾT TOÁN ĐẠO QUẢ • QUY ĐỔI ĐIỂM LUÂN HỒI (KARMA)
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-400">
                  Ví hiện có: <strong className="text-purple-300 font-bold">{player.reincarnationState?.currentKarmaPoints || 0}</strong> Karma
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/50 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                    Cảnh Giới (Tầng {player.currentRealm || 0} × 150):
                  </span>
                  <span className="text-purple-300 font-bold">+{karmaReward.realmKarma.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/50 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    Tuế Nguyệt Tu Đạo ({Math.floor(player.age || 16)} ÷ 10):
                  </span>
                  <span className="text-sky-300 font-bold">+{karmaReward.ageKarma.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/50 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Thành Tựu Giác Ngộ ({player.achievementsState?.unlockedIds?.length || 0} × 50):
                  </span>
                  <span className="text-amber-300 font-bold">+{karmaReward.achievementKarma.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/50 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    Thiên Kiếp Lôi Đình:
                  </span>
                  <span className="text-rose-300 font-bold">+{karmaReward.tribulationKarma.toLocaleString()}</span>
                </div>
              </div>

              {isBinhGiaiMode && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/40 text-xs font-mono">
                  <span className="text-amber-300 font-serif flex items-center gap-1.5">
                    <span>✨ Thưởng Binh Giải Xuất Khiếu ("Tự Tại Giải Thoát" +20%):</span>
                  </span>
                  <span className="text-amber-300 font-bold">+{karmaReward.binhGiaiBonusKarma.toLocaleString()}</span>
                </div>
              )}

              {/* TỔNG KẾT KARMA */}
              <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-zinc-400 font-serif">
                  Điểm Luân Hồi thu hoạch kiếp này:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-purple-300 shadow-sm">
                    +{karmaReward.totalKarma.toLocaleString()} KARMA
                  </span>
                </div>
              </div>
            </div>

            {/* KHỐI ĐẶC QUYỀN: Y BÁT TRUYỀN THỪA (ĐOẠT XÁ CHÂN TRUYỀN) */}
            {inheritor && (
              <div className="p-4 rounded-2xl border-2 border-amber-500/70 bg-gradient-to-r from-amber-950/50 via-yellow-950/30 to-purple-950/40 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="text-sm font-serif font-bold text-amber-200">
                      Y BÁT TRUYỀN THỪA • THÂN XÁC CHÂN TRUYỀN
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-900/60 text-amber-300 border border-amber-700/60">
                      Chân Truyền Y Bát
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-serif">
                    Đoạt xá thân xác đệ tử <strong>【{inheritor.name}】</strong> • Cảnh giới: <strong className="text-emerald-400">{inheritor.realmName}</strong> • {inheritor.linhCan.name}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-serif">
                    Khởi đầu kiếp sau ngay tại <strong>{inheritor.realmName}</strong>, giữ nguyên toàn bộ cơ nghiệp <strong>【{player.customSectState?.sectName}】</strong> và tiếp tục làm Chưởng Môn!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onInheritDisciple && onInheritDisciple(inheritor.id)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-amber-400 bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.5)] transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Crown className="w-4 h-4 text-amber-200" />
                  <span>👑 KẾ THỪA THÂN XÁC NÀY</span>
                </button>
              </div>
            )}

            {/* Nút Chuyển Tiếp Sang Màn Hình Kế Thừa, Tạo Mới & Tiên Bi */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {onStartFreshNewGame && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewGame(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 hover:text-rose-100 text-xs font-serif font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                    title="Bỏ qua luân hồi, xóa sạch tiến trình để chơi lại từ đầu"
                  >
                    <span>🌱 TẠO NHÂN VẬT MỚI</span>
                  </button>
                )}

                {onOpenMemorial && (
                  <button
                    type="button"
                    onClick={onOpenMemorial}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-600/60 bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 hover:text-amber-100 text-xs font-serif font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    title="Mở Lục Đạo Tiên Bi để xem lại bia mộ và văn bia các tiền kiếp"
                  >
                    <span>🏛️ Xem Lục Đạo Tiên Bi</span>
                  </button>
                )}
              </div>

              <button
                onClick={onProceedToInheritance}
                className="w-full sm:w-auto px-7 py-3 rounded-xl border border-purple-500/80 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-700 hover:brightness-110 text-white font-serif font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              >
                <span>Bước Vào Luân Hồi Đài (Đạo Vận Kế Thừa)</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN HÌNH 2: ĐẠO VẬN KẾ THỪA & THIÊN ĐẠO CÁC (SHOP / TREE) */}
        {/* ======================================================== */}
        {rebornScreen === 'inheritance' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Thanh Ví Karma Khả Dụng */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-black/80 shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-serif font-bold text-amber-200">
                  ĐIỂM LUÂN HỒI KHẢ DỤNG (KARMA POINTS):
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300">
                  {currentAvailableKarma.toLocaleString()} Karma
                </span>
                <button
                  onClick={() => setRebornScreen('summary')}
                  className="text-[11px] font-serif text-purple-300 hover:text-purple-100 underline cursor-pointer"
                >
                  ← Xem lại kết toán
                </button>
              </div>
            </div>

            {/* KHỐI 1: BẢN MỆNH PHÁP BẢO PHONG ẤN & THĂNG HOA LINH CĂN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thẻ 1: Bản Mệnh Pháp Bảo Kế Thừa */}
              <div className="p-4 rounded-xl border border-purple-800/40 bg-[#0e0e14] space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="text-xs font-serif font-bold text-purple-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      Kế Thừa Bản Mệnh Pháp Bảo
                    </span>
                    {player.natalArtifact ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/60">
                        {player.natalArtifact.grade}
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                        Chưa Tế Luyện
                      </span>
                    )}
                  </div>

                  {player.natalArtifact ? (
                    <div className="mt-2.5 space-y-2">
                      <div className="text-sm font-serif font-bold text-amber-200">
                        {player.natalArtifact.name} (Giai Vị {player.natalArtifact.tier})
                      </div>
                      <p className="text-[11px] text-zinc-400 font-serif leading-relaxed">
                        Pháp bảo sẽ được phong ấn thành <strong>Phôi Cổ</strong> mang theo sang kiếp sau. Trong thời kỳ Luyện Khí nhận 30% chỉ số nền; khi đột phá <strong>Trúc Cơ Kỳ (Realm 11)</strong> sẽ tự động phá phong thức tỉnh trọn vẹn Khí Linh!
                      </p>
                      {player.natalArtifact.spirit && (
                        <div className="text-[10px] font-mono text-purple-300 bg-purple-950/40 p-1.5 rounded border border-purple-900/40">
                          Khí Linh: <strong>{player.natalArtifact.spirit.name}</strong> • Cấp {player.natalArtifact.spirit.stageLevel}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 text-center p-4 rounded-lg bg-black/40 border border-dashed border-zinc-800 text-xs text-zinc-500 font-serif">
                      Kiếp này chưa tế luyện Bản Mệnh Pháp Bảo. Hãy tế luyện ở kiếp sau để mang theo sang đời kế tiếp!
                    </div>
                  )}
                </div>

                {player.natalArtifact && (
                  <button
                    type="button"
                    onClick={() => setKeepSealedNatal(!keepSealedNatal)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                      keepSealedNatal
                        ? 'bg-purple-950/80 border-purple-500/80 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${keepSealedNatal ? 'text-purple-400' : 'text-zinc-600'}`} />
                    <span>{keepSealedNatal ? '✓ Đang Chọn Mang Theo (Được Bảo Lưu)' : 'Không Mang Theo'}</span>
                  </button>
                )}
              </div>

              {/* Thẻ 2: Thăng Hoa Tiên Thiên Linh Căn */}
              <div className="p-4 rounded-xl border border-amber-800/40 bg-[#0e0e14] space-y-3 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Thăng Hoa Tiên Thiên Linh Căn
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60">
                      {displayRoot?.grade || 'Tạp Linh Căn'}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2">
                    <div className="text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5">
                      <span>{displayRoot ? ELEMENT_ICONS[displayRoot.element] : '✨'}</span>
                      <span>{displayRoot?.name || 'Vô Danh Linh Căn'}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Hệ: <span className="text-amber-300">{displayRoot ? (ELEMENT_NAMES[displayRoot.element] || displayRoot.element) : 'Ngũ Hành'}</span> • Công Kích +{displayRoot?.damageBonus || 0}% • Tốc Độ +{displayRoot?.speedBonus || 0}
                    </div>

                    {nextRootUpgrade ? (
                      <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px] font-serif text-amber-300">
                        Thăng cấp lên <strong>[{nextRootUpgrade.toGrade}]</strong>: +{nextRootUpgrade.bonusDmg}% Công, +{nextRootUpgrade.bonusSpeed} Tốc độ!
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-purple-950/20 border border-purple-900/40 text-[11px] font-serif text-purple-300">
                        ✨ Linh Căn đã đạt cảnh giới Hỗn Độn cực hạn!
                      </div>
                    )}
                  </div>
                </div>

                {nextRootUpgrade && (
                  <button
                    type="button"
                    onClick={onUpgradeSpiritualRoot}
                    disabled={currentAvailableKarma < nextRootUpgrade.karmaCost}
                    className="w-full py-2 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-600/70 bg-gradient-to-r from-amber-700 to-yellow-600 hover:brightness-110 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Thăng Hoa Linh Căn (-{nextRootUpgrade.karmaCost.toLocaleString()} Karma)</span>
                  </button>
                )}
              </div>
            </div>

            {/* KHỐI 2: MỆNH CÁCH LUÂN HỒI ĐỘC QUYỀN (PHÂN CẤP CẢNH GIỚI) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-purple-900/40 pb-2">
                <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  MỆNH CÁCH LUÂN HỒI ĐỘC QUYỀN (CHỌN 1 MỆNH CÁCH ĐỂ KHẢM VÀO Ô THỨ 6)
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Mở khóa theo Cảnh Giới cao nhất: <strong className="text-purple-300">{realmsData[Math.max(player.currentRealm || 0, player.reincarnationState?.highestRealmIndexAchieved || 0)]?.name || 'Phàm Nhân'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {REINCARNATION_DESTINY_DEFINITIONS.map(destiny => {
                  const { isUnlocked } = isReincarnationDestinyUnlocked(destiny, player);
                  const isSelected = selectedInheritedDestinyId === destiny.id;

                  return (
                    <div
                      key={destiny.id}
                      onClick={() => {
                        if (isUnlocked) {
                          onSelectInheritedDestiny(destiny.id);
                        }
                      }}
                      className={`p-3.5 rounded-xl border transition flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                        !isUnlocked
                          ? 'opacity-50 grayscale border-zinc-800 bg-zinc-950/40 cursor-not-allowed select-none'
                          : isSelected
                            ? 'bg-purple-950/70 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[1.01] cursor-pointer'
                            : 'bg-[#0e0e14] border-zinc-800/80 hover:border-purple-600/50 hover:bg-zinc-900/60 cursor-pointer'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="text-xs font-serif font-bold truncate flex items-center gap-1"
                            style={{ color: isUnlocked ? (destiny.color || '#f59e0b') : '#71717a' }}
                          >
                            {!isUnlocked && <Lock className="w-3 h-3 text-zinc-500 shrink-0" />}
                            {destiny.name}
                          </span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold border shrink-0 ${destiny.badgeClass}`}>
                            {destiny.gradeName}
                          </span>
                        </div>

                        <p className="text-[10px] text-zinc-400 italic line-clamp-2">
                          "{destiny.description}"
                        </p>

                        <div className="text-[10.5px] font-mono text-amber-300/90 pt-1 border-t border-zinc-800/60">
                          {destiny.effectsSummary}
                        </div>

                        {!isUnlocked && (
                          <div className="mt-1 p-1.5 rounded-md bg-rose-950/60 border border-rose-800/40 text-[9px] font-serif text-rose-300 flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>🔒 Chưa thể kế thừa: Cần kiếp trước đạt <strong>{destiny.requiredRealmName}</strong>!</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] font-mono border-t border-zinc-800/40">
                        <span className={
                          !isUnlocked
                            ? 'text-zinc-600'
                            : isSelected
                              ? 'text-amber-300 font-bold'
                              : 'text-zinc-400 group-hover:text-purple-300'
                        }>
                          {!isUnlocked
                            ? '🔒 Chưa Mở Khóa'
                            : isSelected
                              ? '✓ Đã Chọn Kế Thừa'
                              : 'Bấm để chọn'}
                        </span>
                        {isUnlocked ? (
                          <CircleDot className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-zinc-600'}`} />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KHỐI 3: CÂY KỸ NĂNG THIÊN ĐẠO LUÂN HỒI (6 PERKS VĨNH VIỄN) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-purple-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  THIÊN ĐẠO LUÂN HỒI CÁC (PERKS GIA TRÌ VĨNH VIỄN CHO MỌI KIẾP SAU)
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Hiệu lực vĩnh cửu không bị reset khi chuyển sinh
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {REINCARNATION_PERKS_CATALOG.map(perk => {
                  const baseLevel = player.reincarnationState?.permanentPerks?.[perk.id] || 0;
                  const addedLevel = selectedPerks[perk.id] || 0;
                  const totalLevel = baseLevel + addedLevel;
                  const isMax = totalLevel >= perk.maxLevel;
                  const canAfford = currentAvailableKarma >= perk.karmaCost && !isMax;

                  return (
                    <div
                      key={perk.id}
                      className="p-3 rounded-xl border border-zinc-800/80 bg-[#0e0e14] flex flex-col justify-between space-y-2.5 shadow-sm hover:border-purple-600/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-serif font-bold text-amber-200 truncate">
                            {perk.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                            Cấp {totalLevel}/{perk.maxLevel}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-zinc-400 font-serif leading-relaxed line-clamp-2">
                          {perk.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400">
                          {isMax ? (
                            <span className="text-emerald-400 font-bold">✓ Cực Hạn</span>
                          ) : (
                            <span>Giá: <strong className="text-amber-300">{perk.karmaCost}</strong> Karma</span>
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() => onUpgradePerk(perk.id)}
                          disabled={!canAfford}
                          className="px-2.5 py-1 rounded-md text-[10px] font-serif font-bold transition flex items-center gap-1 cursor-pointer border border-purple-600/60 bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Zap className="w-3 h-3 text-purple-400" />
                          <span>{isMax ? 'Đã Max' : '+1 Cấp'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HÀNH ĐỘNG DƯỚI MODAL: NÚT TÁI SINH KIẾP MỚI & TẠO NHÂN VẬT MỚI */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-purple-900/40">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-serif transition cursor-pointer"
                >
                  Giữ Lại Kiếp Này (Đóng)
                </button>

                {onStartFreshNewGame && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewGame(true)}
                    className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 hover:text-rose-100 text-xs font-serif font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                    title="Xóa bỏ kiếp cũ, làm lại từ đầu với phàm nhân cấp 0"
                  >
                    <span>🌱 TẠO NHÂN VẬT MỚI (Làm Lại Từ Đầu)</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onConfirmReincarnation}
                className="w-full sm:w-auto px-8 py-3 rounded-xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 hover:brightness-110 text-white font-serif font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>🌀 BƯỚC VÀO LỤC ĐẠO LUÂN HỒI</span>
              </button>
            </div>
          </div>
        )}

        {/* HỘP THOẠI XÁC NHẬN TẠO NHÂN VẬT MỚI (2 BƯỚC AN TOÀN) */}
        {showConfirmNewGame && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="cophong-card max-w-md w-full p-5 rounded-2xl border-2 border-rose-600/80 bg-[#120a0d] shadow-[0_0_50px_rgba(225,29,72,0.4)] space-y-4">
              <div className="flex items-center gap-3 border-b border-rose-900/50 pb-3">
                <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-700 text-rose-300">
                  <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-rose-200">
                    XÁC NHẬN TẠO NHÂN VẬT MỚI
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-serif">
                    Khởi đầu lại từ đầu • Không lưu chuyển sinh
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-rose-900/40 text-xs font-serif text-zinc-300 leading-relaxed space-y-2">
                <p className="text-rose-300 font-semibold">
                  ⚠️ Đạo hữu có chắc chắn muốn bỏ qua Luân Hồi và làm lại từ đầu?
                </p>
                <p className="text-zinc-400">
                  Mọi điểm Karma, Pháp bảo phong ấn và tiến trình trước đây sẽ bị xóa hoàn toàn. Ngươi sẽ tái sinh thành một phàm nhân sơ khởi!
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmNewGame(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-serif transition cursor-pointer"
                >
                  Quay Lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmNewGame(false);
                    if (onStartFreshNewGame) {
                      onStartFreshNewGame();
                    }
                  }}
                  className="px-5 py-2 rounded-xl border border-rose-500 bg-rose-600 hover:bg-rose-500 text-white text-xs font-serif font-bold transition cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                >
                  Xác Nhận Tạo Lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RebornModal;
