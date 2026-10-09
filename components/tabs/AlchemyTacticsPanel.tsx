// components/tabs/AlchemyTacticsPanel.tsx
// Giao diện Cổ Phong: Bàn Nung Bát Quái Tứ Trụ & Hỏa Hậu Chiến Thuật
// (Tactical Heat Stances & Herbal Archetype Matrix Panel)

import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Shield,
  Zap,
  Crown,
  Swords,
  Scroll,
  Layers,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  RefreshCw,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { PlayerStats, Herb } from '@/lib/types';
import {
  HerbRoleType,
  TacticalHeatStance,
  ConcoctionSetup,
  ConcoctionPreviewResult
} from '@/lib/types/alchemy-tactics';
import {
  HERB_ROLE_REGISTRY,
  getHerbRoleMetadata
} from '@/lib/alchemy-tactics-logic';
import { calculateMultiplicativeToxicity } from '@/lib/pill-vein-logic';
import { ProceduralFlameSvg } from './HeavenlyFlamePanel';

export interface AlchemyTacticsPanelProps {
  player: PlayerStats;
  concoctionSetup: ConcoctionSetup;
  previewResult: ConcoctionPreviewResult;
  isCraftingAnimation: boolean;
  equippedFlameConfig: any;
  handleSelectHerbForRole: (role: HerbRoleType, herbItemId: string | null) => void;
  handleChangeStance: (stance: TacticalHeatStance) => void;
  handleChangeBatchMultiplier: (batch: number) => void;
  handleExecuteConcoction: () => void;
  onBackToNormalCauldron?: () => void;
}

export const AlchemyTacticsPanel: React.FC<AlchemyTacticsPanelProps> = ({
  player,
  concoctionSetup,
  previewResult,
  isCraftingAnimation,
  equippedFlameConfig,
  handleSelectHerbForRole,
  handleChangeStance,
  handleChangeBatchMultiplier,
  handleExecuteConcoction,
  onBackToNormalCauldron
}) => {
  // Modal chọn thảo dược cho từng vị trí
  const [activeSelectRole, setActiveSelectRole] = useState<HerbRoleType | null>(null);

  const invHerbs = player.inventory?.herbs || [];

  // Thông tin metadata 4 vị thảo dược đang gắn vào slot
  const quanMeta = getHerbRoleMetadata(concoctionSetup.quan?.herbItemId);
  const thanMeta = getHerbRoleMetadata(concoctionSetup.than?.herbItemId);
  const taMeta = getHerbRoleMetadata(concoctionSetup.ta?.herbItemId);
  const suMeta = getHerbRoleMetadata(concoctionSetup.su?.herbItemId);

  // Đếm số lượng thảo dược sở hữu trong túi
  const getHerbCount = (herbId: string | null | undefined) => {
    if (!herbId) return 0;
    return invHerbs.find(h => h.id === herbId)?.quantity || 0;
  };

  return (
    <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
      {/* Banner Tiêu Đề Cổ Phong */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#18120c] via-[#1f1710] to-[#18120c] border border-amber-600/50 shadow-md flex justify-between items-center flex-wrap gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400 animate-spin duration-3000" />
            <h2 className="font-serif font-black text-sm text-amber-100 tracking-wide flex items-center gap-1.5">
              <span>Bàn Nung Bát Quái • Phối Ngũ Tứ Trụ</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50">
                Quân • Thần • Tá • Sứ
              </span>
            </h2>
          </div>
          <p className="text-[10.5px] text-zinc-400 font-serif">
            Đan đạo biến hóa khôn lường: Quân định hình đan, Thần tăng dược lực, Tá trừ độc dập nổ lò, Sứ dẫn khí khai mở đan văn cửu trùng.
          </p>
        </div>

        {onBackToNormalCauldron && (
          <button
            onClick={onBackToNormalCauldron}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer flex items-center gap-1"
          >
            <span>Về Đan Phương Cũ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* BÀN NUNG BÁT QUÁI TỨ TRỤ (4 SLOTS VÒNG TRÒN) */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#140e0a] to-[#0a0806] border border-amber-700/40 relative overflow-hidden shadow-inner">
        {/* Vòng tròn Bát Quái mờ nền */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full border-2 border-dashed border-amber-500 animate-spin duration-3000" />
        </div>

        {/* Lõi Lò Luyện Trung Tâm & Dị Hỏa */}
        <div className="text-center space-y-1 pb-3">
          <div className="flex items-center justify-center gap-2">
            <ProceduralFlameSvg
              archetype={equippedFlameConfig?.archetype || 'pham_hoa'}
              glowColor={equippedFlameConfig?.visualColor?.glowColor || '#f59e0b'}
              size={40}
            />
            <div className="text-left">
              <div className="text-[10px] font-mono text-zinc-400">Đan Hỏa Trấn Đỉnh:</div>
              <div className="font-serif font-bold text-xs text-amber-300">
                {equippedFlameConfig?.name || 'Phàm Hỏa Cơ Bản'}
              </div>
            </div>
          </div>
        </div>

        {/* 4 TRẬN NHÃN TỨ TRỤ (QUÂN - THẦN - TÁ - SỨ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 1. Ô BẮC: [👑 QUÂN DƯỢC] - Hoàng Kim */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.25)] space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="font-serif font-black text-xs text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>QUÂN DƯỢC (Chủ Đạo • Bắt Buộc)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900/80 border border-amber-600/50 text-amber-200 font-mono">
                Số lượng: 2x
              </span>
            </div>

            {concoctionSetup.quan?.herbItemId ? (
              <div className="p-2 rounded-lg bg-black/60 border border-amber-600/50 flex justify-between items-center gap-2">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-amber-200">
                    {quanMeta?.name || concoctionSetup.quan.herbName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Hệ: <span className="text-amber-300">{quanMeta?.elementalAffinity}</span> • Có:{' '}
                    <strong className="text-emerald-400">{getHerbCount(concoctionSetup.quan.herbItemId)}</strong>
                  </div>
                  <div className="text-[9.5px] text-amber-300/80 italic">
                    {quanMeta?.description}
                  </div>
                </div>

                <button
                  onClick={() => setActiveSelectRole('quan')}
                  className="px-2 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-[10px] font-serif border border-amber-600/40 transition cursor-pointer shrink-0"
                >
                  Đổi
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveSelectRole('quan')}
                className="w-full py-3 rounded-lg border border-dashed border-amber-500/60 hover:border-amber-400 bg-black/40 text-amber-300 text-xs font-serif transition cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Chọn Thảo Dược Làm Vị Quân Dược</span>
              </button>
            )}
          </div>

          {/* 2. Ô ĐÔNG: [⚔️ THẦN DƯỢC] - Đỏ Chu Sa */}
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-600/60 space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="font-serif font-black text-xs text-rose-300 flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-rose-400" />
                <span>THẦN DƯỢC (Khuếch Đại Dược Lực)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-900/80 border border-rose-600/50 text-rose-200 font-mono">
                Số lượng: 1x
              </span>
            </div>

            {concoctionSetup.than?.herbItemId ? (
              <div className="p-2 rounded-lg bg-black/60 border border-rose-600/50 flex justify-between items-center gap-2">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-rose-200">
                    {thanMeta?.name || concoctionSetup.than.herbName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Hệ: <span className="text-rose-300">{thanMeta?.elementalAffinity}</span> • Có:{' '}
                    <strong className="text-emerald-400">{getHerbCount(concoctionSetup.than.herbItemId)}</strong>
                  </div>
                  <div className="text-[9.5px] text-yellow-400 font-mono font-bold">
                    +{thanMeta?.powerValue}% Công Hiệu Dược Lực
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveSelectRole('than')}
                    className="px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-[10px] font-serif border border-rose-600/40 transition cursor-pointer"
                  >
                    Đổi
                  </button>
                  <button
                    onClick={() => handleSelectHerbForRole('than', null)}
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveSelectRole('than')}
                className="w-full py-3 rounded-lg border border-dashed border-rose-800/60 hover:border-rose-600 bg-black/40 text-rose-400/80 text-xs font-serif transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-rose-400" />
                <span>+ Phối Thần Dược (+Dược Lực)</span>
              </button>
            )}
          </div>

          {/* 3. Ô TÂY: [🛡️ TÁ DƯỢC] - Lam Ngọc */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/60 space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="font-serif font-black text-xs text-cyan-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>TÁ DƯỢC (Triệt Độc & Dập Nổ Lò)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900/80 border border-cyan-600/50 text-cyan-200 font-mono">
                Số lượng: 1x
              </span>
            </div>

            {concoctionSetup.ta?.herbItemId ? (
              <div className="p-2 rounded-lg bg-black/60 border border-cyan-500/50 flex justify-between items-center gap-2">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-cyan-200">
                    {taMeta?.name || concoctionSetup.ta.herbName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Hệ: <span className="text-cyan-300">{taMeta?.elementalAffinity}</span> • Có:{' '}
                    <strong className="text-emerald-400">{getHerbCount(concoctionSetup.ta.herbItemId)}</strong>
                  </div>
                  <div className="text-[9.5px] text-cyan-300 font-mono font-bold">
                    Triệt tiêu {taMeta?.powerValue}% Đan Độc & Dập Nổ Lò
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveSelectRole('ta')}
                    className="px-2 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 text-[10px] font-serif border border-cyan-600/40 transition cursor-pointer"
                  >
                    Đổi
                  </button>
                  <button
                    onClick={() => handleSelectHerbForRole('ta', null)}
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveSelectRole('ta')}
                className="w-full py-3 rounded-lg border border-dashed border-cyan-800/60 hover:border-cyan-600 bg-black/40 text-cyan-400/80 text-xs font-serif transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>+ Phối Tá Dược (-Độc, -Nổ Lò)</span>
              </button>
            )}
          </div>

          {/* 4. Ô NAM: [📜 SỨ DƯỢC] - Tím Huyền Ảo */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/60 space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="font-serif font-black text-xs text-purple-300 flex items-center gap-1.5">
                <Scroll className="w-4 h-4 text-purple-400" />
                <span>SỨ DƯỢC (Dẫn Khí & Đan Văn)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/80 border border-purple-600/50 text-purple-200 font-mono">
                Số lượng: 1x
              </span>
            </div>

            {concoctionSetup.su?.herbItemId ? (
              <div className="p-2 rounded-lg bg-black/60 border border-purple-500/50 flex justify-between items-center gap-2">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-purple-200">
                    {suMeta?.name || concoctionSetup.su.herbName}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Hệ: <span className="text-purple-300">{suMeta?.elementalAffinity}</span> • Có:{' '}
                    <strong className="text-emerald-400">{getHerbCount(concoctionSetup.su.herbItemId)}</strong>
                  </div>
                  <div className="text-[9.5px] text-purple-300 font-mono font-bold">
                    +{suMeta?.powerValue}% Xác Suất Đan Văn 6 - 9
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setActiveSelectRole('su')}
                    className="px-2 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[10px] font-serif border border-purple-600/40 transition cursor-pointer"
                  >
                    Đổi
                  </button>
                  <button
                    onClick={() => handleSelectHerbForRole('su', null)}
                    className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveSelectRole('su')}
                className="w-full py-3 rounded-lg border border-dashed border-purple-800/60 hover:border-purple-600 bg-black/40 text-purple-400/80 text-xs font-serif transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                <span>+ Phối Sứ Dược (+Đan Văn)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHIẾN LƯỢC HỎA HẦU TAM TRỌNG (STANCE SELECTOR) */}
      <div className="p-3 rounded-xl bg-black/50 border border-amber-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-amber-200">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Chiến Lược Hỏa Hầu Tam Trọng</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Chọn thế hỏa phù hợp trước khi nhóm lò
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Thế 1: Văn Hỏa */}
          <div
            onClick={() => handleChangeStance('van_hoa')}
            className={`p-2.5 rounded-xl border text-left cursor-pointer transition space-y-1 ${
              concoctionSetup.stance === 'van_hoa'
                ? 'bg-emerald-950/60 border-emerald-400 ring-1 ring-emerald-400/50 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                : 'bg-[#12100d] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="font-serif font-bold text-xs flex items-center justify-between">
              <span className="text-emerald-300">🕯️ Văn Hỏa</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                0% Nổ Lò
              </span>
            </div>
            <p className="text-[10px] leading-tight text-zinc-300">
              Lửa nhỏ ôn dưỡng an toàn: Đan độc -25%, tăng đan văn cực phẩm, rủi ro nổ lò tuyệt đối 0%.
            </p>
          </div>

          {/* Thế 2: Văn Vũ Tương Tế */}
          <div
            onClick={() => handleChangeStance('van_vu_song_hanh')}
            className={`p-2.5 rounded-xl border text-left cursor-pointer transition space-y-1 ${
              concoctionSetup.stance === 'van_vu_song_hanh'
                ? 'bg-amber-950/60 border-amber-400 ring-1 ring-amber-400/50 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-[#12100d] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="font-serif font-bold text-xs flex items-center justify-between">
              <span className="text-amber-300">☯️ Văn Vũ Tương Tế</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                Cân Bằng
              </span>
            </div>
            <p className="text-[10px] leading-tight text-zinc-300">
              Chu thiên hòa hợp âm dương: Các chỉ số vận hành ổn định, bảo toàn dược tính tự nhiên.
            </p>
          </div>

          {/* Thế 3: Vũ Hỏa */}
          <div
            onClick={() => handleChangeStance('vu_hoa')}
            className={`p-2.5 rounded-xl border text-left cursor-pointer transition space-y-1 ${
              concoctionSetup.stance === 'vu_hoa'
                ? 'bg-rose-950/60 border-rose-400 ring-1 ring-rose-400/50 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                : 'bg-[#12100d] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="font-serif font-bold text-xs flex items-center justify-between">
              <span className="text-rose-300">🌪️ Vũ Hỏa</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700/50">
                Batch Luyện
              </span>
            </div>
            <p className="text-[10px] leading-tight text-zinc-300">
              Cuồng nhiệt cấp tốc: Dược lực +15%, mở khóa Luyện Hàng Loạt (x5/x10 mẻ), rủi ro nổ lò 15%.
            </p>
          </div>
        </div>

        {/* Nút Chọn Batch Multiplier Khi Dùng Thế Vũ Hỏa */}
        {concoctionSetup.stance === 'vu_hoa' && (
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-xs">
            <span className="font-serif text-amber-200 text-[11px] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Sản Lượng Batch Xuất Lò:</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              {[1, 5, 10].map(batch => (
                <button
                  key={batch}
                  onClick={() => handleChangeBatchMultiplier(batch)}
                  className={`px-3 py-1 rounded border text-xs transition cursor-pointer font-bold ${
                    concoctionSetup.batchMultiplier === batch
                      ? 'bg-rose-600 text-white border-rose-400 shadow'
                      : 'bg-black/40 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  x{batch} Mẻ
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BẢNG DỰ TOÁN THIÊN CƠ & ĐIỂM HÒA HỢP (TELEMETRY HUD) */}
      <div className="p-3.5 rounded-xl bg-black/70 border border-amber-900/60 space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-serif font-bold text-amber-200">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Dự Toán Thiên Cơ • Điểm Hòa Hợp Tứ Trụ:</span>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">
            {previewResult.harmonyScore}% Hòa Hợp
          </span>
        </div>

        {/* Thanh Gauge Hòa Hợp Âm Dương */}
        <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800 flex">
          <div
            className="h-full transition-all duration-500 bg-gradient-to-r from-yellow-500 via-amber-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            style={{ width: `${previewResult.harmonyScore}%` }}
          />
        </div>

        {/* Chỉ Số Chi Tiết Sau Khi Phối Vị */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10.5px] font-mono">
          <div className="p-1.5 rounded bg-zinc-900/70 border border-zinc-800 flex flex-col">
            <span className="text-zinc-400 text-[9.5px]">Dược Lực Thực Nhận:</span>
            <span className="text-amber-300 font-bold text-xs">
              {previewResult.effectivePotencyValue.toLocaleString()} ({previewResult.predictedPotencyMultiplier >= 1 ? `+${Math.round((previewResult.predictedPotencyMultiplier - 1) * 100)}%` : `${Math.round((previewResult.predictedPotencyMultiplier - 1) * 100)}%`})
            </span>
          </div>

          <div className="p-1.5 rounded bg-zinc-900/70 border border-zinc-800 flex flex-col">
            <span className="text-zinc-400 text-[9.5px]">Đan Độc Kinh Mạch:</span>
            <span className="text-emerald-400 font-bold text-xs">
              {previewResult.effectiveToxicityValue} điểm (-{previewResult.predictedToxicityReductionPercent}%)
            </span>
          </div>

          <div className="p-1.5 rounded bg-zinc-900/70 border border-zinc-800 flex flex-col">
            <span className="text-zinc-400 text-[9.5px]">Phẩm Chất Đan Văn:</span>
            <span className="text-purple-300 font-bold text-xs">
              +{previewResult.veinQualityBonusPercent} Điểm (6-9 Văn)
            </span>
          </div>

          <div className="p-1.5 rounded bg-zinc-900/70 border border-zinc-800 flex flex-col">
            <span className="text-zinc-400 text-[9.5px]">Nguy Cơ Nổ Lò:</span>
            <span
              className={`font-bold text-xs ${
                previewResult.explosionRiskPercent > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
              }`}
            >
              {previewResult.explosionRiskPercent}% {previewResult.explosionRiskPercent === 0 ? '(Tuyệt Đối An Toàn)' : '(Cảnh Báo)'}
            </span>
          </div>
        </div>

        {/* BẢNG DỰ TOÁN THIÊN CƠ • PHÂN RÃ ĐỘC TÍNH CẤP NHÂN (COMPOUNDING DECAY BREAKDOWN) */}
        {(() => {
          const rawToxicityBase = quanMeta?.baseToxicityValue || 40;
          const flameBurnRatio = (equippedFlameConfig?.baseToxicityBurnPercent || 0) / 100;
          const taSuppressionRatio = (taMeta?.powerValue || 0) / 100;
          const stanceReductionRatio = concoctionSetup.stance === 'van_hoa' ? 0.25 : 0;

          const toxCalc = calculateMultiplicativeToxicity({
            baseToxicity: rawToxicityBase,
            veinTier: 0,
            flameBurnRatio,
            taSuppressionRatio,
            stanceReductionRatio
          });

          const b = toxCalc.breakdown;
          const finalEffectiveTox = concoctionSetup.stance === 'vu_hoa'
            ? Number((toxCalc.finalToxicity * 1.25).toFixed(1))
            : toxCalc.finalToxicity;
          const displayFinalTox = Math.round(finalEffectiveTox);

          const remainingPercent = rawToxicityBase > 0
            ? Math.min(100, Math.max(0, Math.round((finalEffectiveTox / rawToxicityBase) * 100)))
            : 0;
          const purityPercent = 100 - remainingPercent;

          return (
            <div className="p-3 rounded-xl bg-gradient-to-b from-[#13100d] to-[#0b0907] border border-amber-900/50 space-y-2.5">
              <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                <span className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Phân Rã Đan Độc Cấp Nhân (Compounding Decay):</span>
                </span>
                <span className="font-mono text-[10.5px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  Đã thanh lọc {purityPercent}% độc tố
                </span>
              </div>

              {/* Chuỗi suy hao trực quan */}
              <div className="p-2.5 rounded-lg bg-black/60 border border-stone-800/80">
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono justify-start">
                  {/* Tầng 0: Độc cơ sở */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-stone-900/90 border border-stone-700/80 text-stone-300 shadow-sm">
                    <span className="text-[10px] text-stone-400">Độc cơ sở:</span>
                    <strong className="text-stone-100 font-bold">{b.baseToxicity}</strong>
                  </div>

                  <span className="text-amber-500 font-bold text-xs select-none">➔</span>

                  {/* Tầng 1: Sau Đan Văn */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-sky-950/60 border border-sky-600/50 text-sky-200 shadow-sm">
                    <span className="text-[10px] text-sky-400">Sau Đan Văn:</span>
                    <strong className="text-cyan-300 font-bold">{b.afterVein}</strong>
                  </div>

                  <span className="text-amber-500 font-bold text-xs select-none">➔</span>

                  {/* Tầng 2: Dị Hỏa */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/60 border border-amber-600/50 text-amber-200 shadow-sm">
                    <span className="text-[10px] text-amber-400">
                      Dị Hỏa ({flameBurnRatio > 0 ? `-${Math.round(flameBurnRatio * 100)}%` : '0%'}):
                    </span>
                    <strong className="text-amber-300 font-bold">{b.afterFlame}</strong>
                  </div>

                  <span className="text-amber-500 font-bold text-xs select-none">➔</span>

                  {/* Tầng 3: Tá Dược */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 shadow-sm">
                    <span className="text-[10px] text-emerald-400">
                      Tá Dược ({taSuppressionRatio > 0 ? `-${Math.round(taSuppressionRatio * 100)}%` : '0%'}):
                    </span>
                    <strong className="text-emerald-300 font-bold">{b.afterTa}</strong>
                  </div>

                  <span className="text-amber-500 font-bold text-xs select-none">➔</span>

                  {/* Tầng 4: Hỏa Hầu */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded border shadow-sm ${
                    concoctionSetup.stance === 'van_hoa'
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                      : concoctionSetup.stance === 'vu_hoa'
                      ? 'bg-rose-950/90 border-rose-400 text-rose-100'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  }`}>
                    <span className="text-[10px]">
                      {concoctionSetup.stance === 'van_hoa'
                        ? 'Văn Hỏa (-25%):'
                        : concoctionSetup.stance === 'vu_hoa'
                        ? 'Vũ Hỏa (+25%):'
                        : 'Văn Vũ (0%):'}
                    </span>
                    <strong className="text-yellow-300 font-bold">{displayFinalTox} điểm</strong>
                  </div>
                </div>
              </div>

              {/* Thanh Tiến Trình Trực Quan (% Độc tố còn lại / Tổng độ thanh khiết) */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex justify-between items-center text-[10.5px] font-mono">
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Độ Thanh Khiết: <strong>{purityPercent}%</strong></span>
                  </span>
                  <span className="text-rose-400 font-bold">
                    Độc Tố Còn Lại: <strong>{remainingPercent}%</strong> ({displayFinalTox} điểm)
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-zinc-950 border border-stone-800 overflow-hidden flex shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                    style={{ width: `${purityPercent}%` }}
                    title={`Độ thanh khiết: ${purityPercent}%`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-rose-600 transition-all duration-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                    style={{ width: `${remainingPercent}%` }}
                    title={`Độc tố còn lại: ${remainingPercent}%`}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Nút Nhóm Lò Thực Thi */}
        <button
          disabled={!previewResult.canCraft || isCraftingAnimation}
          onClick={handleExecuteConcoction}
          className={`w-full py-3 rounded-xl font-serif font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
            !previewResult.canCraft || isCraftingAnimation
              ? 'bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 hover:brightness-110 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse'
          }`}
        >
          {isCraftingAnimation ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang Luyện Hóa Tinh Hoa Tứ Trụ...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>
                Nhóm Lửa Luyện Đan • [{previewResult.basePillName}] {concoctionSetup.batchMultiplier > 1 ? `x${concoctionSetup.batchMultiplier} Mẻ` : ''}
              </span>
            </>
          )}
        </button>

        {previewResult.errorMessage && (
          <div className="text-[10px] text-red-400 font-mono text-center">
            {previewResult.errorMessage}
          </div>
        )}
      </div>

      {/* MODAL / DRAWER CHỌN THẢO DƯỢC TỪ TÚI ĐỒ */}
      {activeSelectRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#18120c] via-[#120e0a] to-[#080705] border border-amber-600/60 p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-amber-900/60 pb-2">
              <div className="font-serif font-bold text-sm text-amber-100 flex items-center gap-2">
                <span>Chọn Thảo Dược Cho Slot:</span>
                <span className="uppercase text-amber-400 font-black">
                  [{activeSelectRole === 'quan' ? 'Quân Dược' : activeSelectRole === 'than' ? 'Thần Dược' : activeSelectRole === 'ta' ? 'Tá Dược' : 'Sứ Dược'}]
                </span>
              </div>
              <button
                onClick={() => setActiveSelectRole(null)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 font-serif">
              Danh sách thảo dược có trong Túi Trữ Vật. Chọn loại phù hợp với đặc tính của vị trí để kích hoạt tối đa uy lực dược tính.
            </p>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {invHerbs.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 italic font-serif">
                  Túi Trữ Vật không có thảo dược nào. Hãy mua tại Dược Phố hoặc trồng tại Dược Viên Động Phủ.
                </div>
              ) : (
                invHerbs.map(herb => {
                  const meta = getHerbRoleMetadata(herb.id);
                  const isMatchRole = meta?.role === activeSelectRole;

                  return (
                    <div
                      key={herb.id}
                      onClick={() => {
                        handleSelectHerbForRole(activeSelectRole, herb.id);
                        setActiveSelectRole(null);
                      }}
                      className={`p-2.5 rounded-lg border flex justify-between items-center gap-2 text-xs cursor-pointer transition ${
                        isMatchRole
                          ? 'bg-amber-950/50 border-amber-500/70 hover:bg-amber-900/60 text-amber-100'
                          : 'bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold flex items-center gap-2">
                          <span className={isMatchRole ? 'text-amber-300' : 'text-zinc-200'}>
                            {herb.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                            Hệ {meta?.elementalAffinity || 'Mộc'}
                          </span>
                          {isMatchRole && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-mono font-bold">
                              Khuyên Dùng
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {meta?.description || herb.description}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10.5px] font-mono text-emerald-400 font-bold">
                          Có: {herb.quantity}
                        </div>
                        <div className="text-[9px] text-zinc-500">
                          Phẩm: {herb.grade}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setActiveSelectRole(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
