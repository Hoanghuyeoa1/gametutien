// components/modals/MajorBreakthroughModal.tsx
// Modal Đột Phá Đại Cảnh Giới & Ngưng Tụ Đạo Cơ phong cách Tiên Hiệp Cổ Phong
// 100% Strict TypeScript, Tailwind CSS, Responsive Mobile & Desktop

import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Zap,
  Award,
  Flame,
  X,
  ChevronRight,
  Crown,
  Gem,
  Feather,
  Check,
  Hourglass,
  Layers,
  Heart
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import {
  DaoFoundationGrade,
  MajorRealmTransitionConfig,
  FoundationValidationResult,
  DaoFoundationConfig
} from '@/lib/types/dao-foundation';
import realmsDataRaw from '@/data/realms-data.json';
import { Realm } from '@/lib/types';
import { calculateEffectiveRequiredTuVi } from '@/lib/game-constants';

const realmsData = realmsDataRaw as Realm[];

export interface MajorBreakthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerState;
  activeTransition: MajorRealmTransitionConfig | null;
  selectedGrade: DaoFoundationGrade;
  onSelectGrade: (grade: DaoFoundationGrade) => void;
  onExecute: () => void;
  isExecuting?: boolean;
  validationMap?: Record<DaoFoundationGrade, FoundationValidationResult>;
  lastActionMessage?: string | null;
}

export const MajorBreakthroughModal: React.FC<MajorBreakthroughModalProps> = ({
  isOpen,
  onClose,
  player,
  activeTransition,
  selectedGrade,
  onSelectGrade,
  onExecute,
  isExecuting = false,
  validationMap,
  lastActionMessage
}) => {
  if (!isOpen || !activeTransition) return null;

  const { foundations, transitionName, fromRealmId, toRealmId } = activeTransition;
  const haPhamCfg = foundations.ha_pham;
  const diaPhamCfg = foundations.dia_pham;
  const thienDaoCfg = foundations.thien_dao;

  // Lấy cảnh giới mục tiêu
  const targetRealmIndex = Number(toRealmId);
  const targetRealm = realmsData[targetRealmIndex];
  const baseTuViCost = targetRealm ? calculateEffectiveRequiredTuVi(player, targetRealm) : 0;
  const baseStoneCost = targetRealm?.requirements?.linhThach || 0;

  // Kiểm tra vật phẩm trong túi trữ vật
  const checkHasPill = (requiredPillItemId?: string, requireNineVeins: boolean = false) => {
    if (!requiredPillItemId) return true;
    const inv = player.inventory;
    if (!inv) return false;

    const listKeys = Array.isArray(inv) ? [null] : ['pills', 'items', 'talismans'];
    for (const key of listKeys) {
      const list: any[] = key === null ? (inv as unknown as any[]) : (inv as any)[key];
      if (!Array.isArray(list)) continue;

      const found = list.some((item: any) => {
        if (!item) return false;
        const id = item.id || item.itemId || '';
        const qty = item.quantity ?? item.count ?? 0;
        if (qty <= 0) return false;
        const match = id === requiredPillItemId || id.includes(requiredPillItemId);
        if (!match) return false;
        if (requireNineVeins) {
          const veins = item.veinMetadata?.veinCount ?? item.veinCount ?? 0;
          return veins === 9;
        }
        return true;
      });
      if (found) return true;
    }
    return false;
  };

  const curToxicity = player.pillToxicity || 0;
  const curQiPurity = player.qiPurity ?? 100;

  // Trạng thái kiểm tra trực quan từng bậc
  const hasDiaPhamPill = checkHasPill(diaPhamCfg?.requiredPillItemId, false);
  const hasThienDaoPill = checkHasPill(thienDaoCfg?.requiredPillItemId, true);

  const selectedConfig: DaoFoundationConfig | undefined = foundations[selectedGrade];
  const currentValidation = validationMap?.[selectedGrade] || {
    canAttempt: true,
    reasons: [],
    missingItems: []
  };

  const totalTuViCost = baseTuViCost + (selectedConfig?.extraTuviCost || 0);
  const totalStoneCost = baseStoneCost + (selectedConfig?.extraSpiritStonesCost || 0);

  const hasEnoughTuVi = player.tuVi >= totalTuViCost;
  const hasEnoughStone = (player.linhThach || 0) >= totalStoneCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      {/* KHUNG MODAL CHÍNH */}
      <div className="relative w-full max-w-5xl max-h-[95vh] flex flex-col bg-gradient-to-b from-[#13111c] via-[#0d0d14] to-[#07060a] border-2 border-amber-500/50 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden">
        {/* NỀN TỬ KHÍ ĐẠI ĐẠO HUYỀN ẢO */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600 via-amber-600/30 to-transparent" />

        {/* ── 1. HEADER: TIÊU ĐỀ RỰC RỠ ÁNH TÍM HUYỀN ẢO ───────── */}
        <div className="relative px-4 sm:px-6 py-3.5 border-b border-amber-500/30 bg-[#0e0d16]/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] text-2xl animate-pulse">
              🌌
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-amber-200 uppercase drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                🌌 ĐẠI ĐẠO QUAN ĐẦU • NGƯNG TỤ ĐẠO CƠ
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/80 font-serif flex items-center gap-1.5 mt-0.5">
                <span>Trùng kích thiên môn:</span>
                <span className="text-amber-300 font-bold">{realmsData[Number(fromRealmId)]?.name || 'Đỉnh Phong'}</span>
                <span className="text-purple-400 font-bold">➔</span>
                <span className="text-emerald-300 font-bold underline">{targetRealm?.name || 'Đại Cảnh Giới'}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-purple-300 italic">{transitionName}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isExecuting}
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition cursor-pointer"
            title="Đóng giao diện"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── 2. NỘI DUNG CHÍNH: BỘ 3 THẺ BÀI TAM PHẨM ĐẠO CƠ ───────── */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1 relative z-10">
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-zinc-300 font-serif">
              Đạo cơ là căn bản trường sinh của tu sĩ. Phẩm vị Đạo Cơ định đoạt hạn mức thành tựu cả đời và sức mạnh chiến đấu!
            </p>
            <p className="text-[11px] text-amber-400/90 font-mono italic">
              ★ Hãy chọn phẩm vị phù hợp với tài nguyên và độ tinh khiết kinh mạch của bản thân ★
            </p>
          </div>

          {/* GRID 3 THẺ BÀI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* ═══════════════════════════════════════════════════════ */}
            {/* THẺ 1: HẠ PHẨM ĐẠO CƠ - PHÀM PHẨM                    */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div
              onClick={() => onSelectGrade('ha_pham')}
              className={`relative rounded-xl border p-3.5 sm:p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                selectedGrade === 'ha_pham'
                  ? 'border-stone-400 bg-stone-900/90 ring-2 ring-stone-400/70 shadow-[0_0_20px_rgba(168,162,158,0.35)] scale-[1.01]'
                  : 'border-stone-700 bg-stone-900/60 hover:border-stone-600 hover:bg-stone-900/80'
              }`}
            >
              {/* Header Thẻ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🪵</span>
                    <span className="text-xs font-serif font-bold text-stone-300 uppercase tracking-wider">
                      Hạ Phẩm Đạo Cơ
                    </span>
                  </div>
                  {/* Radio Indicator Cổ Phong */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                    selectedGrade === 'ha_pham'
                      ? 'border-stone-300 bg-stone-200 text-stone-950'
                      : 'border-stone-600 bg-black/40'
                  }`}>
                    {selectedGrade === 'ha_pham' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                  </div>
                </div>

                <div className="text-sm font-serif font-bold text-stone-200 mb-1">
                  {haPhamCfg?.title || 'Phàm Đạo Cơ'}
                </div>

                <p className="text-[11px] text-stone-400 font-sans leading-relaxed mb-3">
                  Dễ dàng vượt ải, chỉ số tăng cơ bản (x1.0). Không đòi hỏi bảo vật quý hiếm, phàm nhân cũng có thể đúc thành.
                </p>

                {/* Thuộc tính & Hệ số */}
                <div className="p-2 rounded-lg bg-black/50 border border-stone-800/80 space-y-1.5 text-[11px] font-mono mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Hệ số chỉ số:</span>
                    <span className="text-stone-300 font-bold">x1.0 (Cơ bản)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Bảo vật phụ trợ:</span>
                    <span className="text-emerald-400">Không yêu cầu</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Giới hạn đan độc:</span>
                    <span className="text-stone-300">Không hạn chế</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400">Chân nguyên tối thiểu:</span>
                    <span className="text-stone-300">0% (Bất kỳ)</span>
                  </div>
                </div>
              </div>

              {/* Footer Thẻ */}
              <div className="pt-2 border-t border-stone-800/70 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 font-serif">Điều kiện:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Khả Dụng
                </span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* THẺ 2: ĐỊA PHẨM ĐẠO CƠ - ĐỊA MẠCH LINH CƠ             */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div
              onClick={() => onSelectGrade('dia_pham')}
              className={`relative rounded-xl border p-3.5 sm:p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                selectedGrade === 'dia_pham'
                  ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-[1.01]'
                  : 'border-cyan-600/50 bg-cyan-950/25 hover:border-cyan-500 hover:bg-cyan-950/35'
              }`}
            >
              {/* Header Thẻ */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🥈</span>
                    <span className="text-xs font-serif font-bold text-cyan-300 uppercase tracking-wider">
                      Địa Phẩm Đạo Cơ
                    </span>
                  </div>
                  {/* Radio Indicator Cổ Phong */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                    selectedGrade === 'dia_pham'
                      ? 'border-cyan-300 bg-cyan-400 text-stone-950 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : 'border-cyan-700 bg-black/40'
                  }`}>
                    {selectedGrade === 'dia_pham' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                  </div>
                </div>

                <div className="text-sm font-serif font-bold text-cyan-200 mb-1">
                  {diaPhamCfg?.title || 'Địa Mạch Linh Cơ'}
                </div>

                <p className="text-[11px] text-cyan-200/80 font-sans leading-relaxed mb-3">
                  Chỉ số tăng +30%. Cần Đan Dược Trung Phẩm, Đan Độc ≤ 30%, Chân Nguyên ≥ 80%. Hút dẫn địa khí đúc thành đạo đài kiên cố.
                </p>

                {/* Thuộc tính & Hệ số */}
                <div className="p-2 rounded-lg bg-black/50 border border-cyan-900/60 space-y-1.5 text-[11px] font-mono mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400/90">Hệ số chỉ số:</span>
                    <span className="text-cyan-300 font-bold">x1.3 (+30% Chỉ số)</span>
                  </div>

                  {/* Checklist Live Condition */}
                  <div className="border-t border-cyan-900/40 pt-1.5 space-y-1 text-[10.5px]">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Đan Độc (≤ 30%):</span>
                      <span className={curToxicity <= 30 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-bold'}>
                        {curToxicity <= 30 ? `✓ ${curToxicity}% / 30%` : `✗ Quá cao (${curToxicity}%)`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Chân Nguyên (≥ 80%):</span>
                      <span className={curQiPurity >= 80 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-bold'}>
                        {curQiPurity >= 80 ? `✓ ${curQiPurity}%` : `✗ Chưa đủ (${curQiPurity}%)`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{diaPhamCfg?.requiredPillName || 'Đan Dược'}:</span>
                      <span className={hasDiaPhamPill ? 'text-emerald-400 font-semibold' : 'text-red-400 font-bold'}>
                        {hasDiaPhamPill ? '✓ Có Trong Túi' : '✗ Chưa Có'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Thẻ */}
              <div className="pt-2 border-t border-cyan-900/60 flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-serif">Đánh giá:</span>
                <span className={`font-bold flex items-center gap-1 font-mono ${
                  validationMap?.dia_pham?.canAttempt ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {validationMap?.dia_pham?.canAttempt ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đủ Điều Kiện
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Chưa Đạt Yêu Cầu
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* THẺ 3: THIÊN ĐẠO TRÚC CƠ - CỰC PHẨM VIÊN MÃN          */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div
              onClick={() => onSelectGrade('thien_dao')}
              className={`relative rounded-xl border-2 p-3.5 sm:p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
                selectedGrade === 'thien_dao'
                  ? 'border-amber-400 bg-gradient-to-b from-amber-950/60 via-purple-950/50 to-stone-950 ring-2 ring-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.6)] scale-[1.02]'
                  : 'border-amber-400/70 bg-gradient-to-b from-amber-950/30 via-purple-950/25 to-stone-950 hover:border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
              }`}
            >
              {/* Huy hiệu chói lọi */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-serif font-black text-[9px] uppercase tracking-wider shadow-[0_0_12px_rgba(251,191,36,0.6)] flex items-center gap-1 shrink-0 whitespace-nowrap animate-pulse">
                <Crown className="w-3 h-3 text-stone-950" />
                <span>NGHỊCH THIÊN CẢI MỆNH • THIÊN PHÚ ẨN</span>
              </div>

              {/* Header Thẻ */}
              <div className="mt-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">👑</span>
                    <span className="text-xs font-serif font-black text-amber-300 uppercase tracking-wider">
                      Thiên Đạo Đạo Cơ
                    </span>
                  </div>
                  {/* Radio Indicator Cổ Phong */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                    selectedGrade === 'thien_dao'
                      ? 'border-amber-200 bg-amber-400 text-stone-950 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                      : 'border-amber-600 bg-black/40'
                  }`}>
                    {selectedGrade === 'thien_dao' && <div className="w-2 h-2 rounded-full bg-stone-950" />}
                  </div>
                </div>

                <div className="text-sm font-serif font-black text-amber-200 mb-1 flex items-center gap-1.5">
                  <span>{thienDaoCfg?.title || 'Thiên Đạo Trúc Cơ'}</span>
                  <span className="text-[10px] text-purple-300 font-mono font-bold">
                    (+{Math.round(((thienDaoCfg?.statMultiplier || 1.6) - 1) * 100)}% Stats)
                  </span>
                </div>

                <p className="text-[11px] text-amber-200/80 font-sans leading-relaxed mb-3">
                  Đại đạo viên mãn, dẫn động Dị Tượng Thiên Địa rung chuyển tam giới! Khai mở Thiên Phú Ẩn vĩnh cửu.
                </p>

                {/* LIVE CONDITION CHECKLIST */}
                <div className="p-2 rounded-lg bg-black/60 border border-amber-500/40 space-y-1.5 text-[10.5px] font-mono mb-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Đan Độc (= 0%):</span>
                    <span className={curToxicity === 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {curToxicity === 0 ? '✓ Hoàn Mỹ (0%)' : `✗ Còn tạp chất (${curToxicity}%)`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Chân Nguyên (= 100%):</span>
                    <span className={curQiPurity >= 100 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {curQiPurity >= 100 ? '✓ Viên Mãn (100%)' : `✗ Chưa Đạt (${curQiPurity}%/100%)`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">{thienDaoCfg?.requiredPillName || 'Đan Dược'} 9 Văn:</span>
                    <span className={hasThienDaoPill ? 'text-amber-300 font-bold drop-shadow' : 'text-red-400 font-bold'}>
                      {hasThienDaoPill ? '✓ Có Trong Túi (9 Văn)' : '✗ Thiếu Đan 9 Văn'}
                    </span>
                  </div>
                </div>

                {/* KHUNG XEM TRƯỚC THIÊN PHÚ ẨN */}
                {thienDaoCfg?.innateTalent && (
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-950/60 to-amber-950/50 border border-purple-500/40 text-[10.5px] space-y-1 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                        <span>{thienDaoCfg.innateTalent.name}</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 border border-purple-400/40 font-mono">
                        Thiên Phú Ẩn
                      </span>
                    </div>
                    <div className="text-emerald-300 font-mono font-bold text-[10px]">
                      {thienDaoCfg.innateTalent.description}
                    </div>
                    <p className="text-[9.5px] text-zinc-400 italic line-clamp-2 font-serif">
                      "{thienDaoCfg.innateTalent.lore}"
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Thẻ */}
              <div className="pt-2 border-t border-amber-900/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-serif">Thiên Cơ:</span>
                <span className={`font-bold flex items-center gap-1 font-mono ${
                  validationMap?.thien_dao?.canAttempt ? 'text-amber-300 animate-pulse' : 'text-stone-400'
                }`}>
                  {validationMap?.thien_dao?.canAttempt ? (
                    <>
                      <Crown className="w-3.5 h-3.5 text-amber-400" /> Sẵn Sàng Trùng Kích
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-stone-500" /> Chưa Đủ Duyên
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ── 3. BẢNG DỰ TOÁN TIÊU HAO TÀI NGUYÊN ───────── */}
          <div className="p-3 rounded-xl bg-black/60 border border-amber-900/40 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
              <span className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> Tiêu Hao Xung Kích [{selectedConfig?.title || 'Đạo Cơ'}]
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                Độ Tinh Khiết Căn Cơ: {curQiPurity}% • Đan Độc: {curToxicity}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11.5px]">
              {/* Tu Vi */}
              <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 font-serif">⚡ Tu Vi Cần:</span>
                <span className={hasEnoughTuVi ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {totalTuViCost.toLocaleString()} (Có: {player.tuVi.toLocaleString()})
                </span>
              </div>

              {/* Linh Thạch */}
              <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 font-serif">💎 Linh Thạch:</span>
                <span className={hasEnoughStone ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {totalStoneCost.toLocaleString()} (Có: {(player.linhThach || 0).toLocaleString()})
                </span>
              </div>

              {/* Đan Dược */}
              <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
                <span className="text-zinc-400 font-serif">💊 Đan Dược:</span>
                <span className="text-zinc-200">
                  {selectedConfig?.requiredPillName ? (
                    <span className={
                      selectedGrade === 'thien_dao' ? (hasThienDaoPill ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold') :
                      (hasDiaPhamPill ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold')
                    }>
                      {selectedConfig.requiredPillName} {selectedConfig.requireNineVeinsPill ? '(9 Văn)' : ''}
                    </span>
                  ) : (
                    <span className="text-emerald-400">Không Cần</span>
                  )}
                </span>
              </div>
            </div>

            {/* Thông báo lỗi cản trở nếu có */}
            {!currentValidation.canAttempt && currentValidation.reasons.length > 0 && (
              <div className="p-2 rounded-lg bg-red-950/60 border border-red-600/70 text-red-200 text-[11px] font-sans flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold font-serif text-red-300">Chưa Đủ Điều Kiện Ngưng Tụ:</div>
                  {currentValidation.reasons.map((r, idx) => (
                    <div key={idx}>• {r}</div>
                  ))}
                </div>
              </div>
            )}

            {lastActionMessage && (
              <div className="text-[11px] text-amber-300 font-serif italic text-center">
                {lastActionMessage}
              </div>
            )}
          </div>
        </div>

        {/* ── 4. FOOTER: NÚT HÀNH ĐỘNG ĐỘT PHÁ ───────── */}
        <div className="p-3.5 sm:p-4 border-t border-amber-500/30 bg-[#0c0b12] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isExecuting}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 font-serif text-xs transition cursor-pointer text-center"
          >
            <span>Hủy Bỏ / Chuẩn Bị Thêm</span>
          </button>

          <button
            type="button"
            disabled={!currentValidation.canAttempt || isExecuting || !hasEnoughTuVi || !hasEnoughStone}
            onClick={onExecute}
            className={`w-full sm:w-auto min-w-[260px] py-2.5 px-6 rounded-xl font-serif font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              !currentValidation.canAttempt || !hasEnoughTuVi || !hasEnoughStone
                ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                : isExecuting
                ? 'bg-amber-900 text-amber-300 border border-amber-600 cursor-wait'
                : selectedGrade === 'thien_dao'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-stone-950 border-2 border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-pulse hover:brightness-110 active:scale-[0.99]'
                : selectedGrade === 'dia_pham'
                ? 'bg-gradient-to-r from-cyan-700 via-cyan-600 to-teal-600 hover:from-cyan-600 hover:to-teal-500 text-white border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.99]'
                : 'bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 hover:from-stone-600 hover:to-stone-500 text-white border border-stone-400 shadow-[0_0_15px_rgba(168,162,158,0.3)] active:scale-[0.99]'
            }`}
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Đang Ngưng Tụ Đạo Cơ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>✨ NGƯNG TỤ ĐẠO CƠ • PHÁ CẢNH THĂNG THIÊN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
