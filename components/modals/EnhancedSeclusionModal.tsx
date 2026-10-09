// components/modals/EnhancedSeclusionModal.tsx
// Giao Diện Cổ Phong "Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh"
// (Pre-Seclusion Panel & Seclusion Harvest Summary)

'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Hourglass,
  Shield,
  Zap,
  Sword,
  Heart,
  Droplets,
  Flame,
  Award,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { DAO_SEEDS_REGISTRY } from '@/lib/seclusion-enhancement-logic';
import { DaoSeedConfig, DaoFruitItem } from '@/lib/types/seclusion-enhancement';
import { useEnhancedSeclusionActions } from '@/hooks/useEnhancedSeclusionActions';

interface EnhancedSeclusionModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: any) => void;
  showToast: (msg: string) => void;
}

export function EnhancedSeclusionModal({
  isOpen,
  onClose,
  player,
  setPlayer,
  addLog,
  showToast
}: EnhancedSeclusionModalProps) {
  const {
    showHarvestModal,
    lastHarvestResult,
    targetYears,
    selectedSeedId,
    nourishRatio,
    maxLifespan,
    remainingYears,
    validation,
    preview,
    setTargetYears,
    setSelectedSeedId,
    setNourishRatio,
    closeHarvestModal,
    handleExecuteEnhancedSeclusion,
    handleConsumeDaoFruit
  } = useEnhancedSeclusionActions({ player, setPlayer, addLog, showToast });

  const [activeTab, setActiveTab] = useState<'seclusion' | 'fruits'>('seclusion');

  if (!isOpen) return null;

  const currentAge = player.age || 16;
  const projectAge = Number((currentAge + targetYears).toFixed(1));
  const safeMaxYears = Math.max(1, Math.floor(remainingYears));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c0e14] border-2 border-amber-600/50 rounded-2xl shadow-[0_0_50px_rgba(217,119,6,0.25)] text-zinc-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* ================================================================= */}
        {/* HEADER: PHONG CÁCH CỔ TIÊN HOÀNG KIM                               */}
        {/* ================================================================= */}
        <div className="relative px-6 py-4 border-b border-amber-900/40 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                  Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                  Đại Đạo Tam Trọng
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif">
                Gieo Mầm Đạo Quả • Tẩy Đan Độc Kinh Mạch • Ôn Dưỡng Khí Linh Bản Mệnh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab chuyển đổi Túi Đạo Quả */}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'seclusion' ? 'fruits' : 'seclusion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-serif border transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'fruits'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.4)]'
                  : 'bg-zinc-900/80 border-amber-900/40 text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Túi Đạo Quả ({player.harvestedDaoFruits?.filter(f => !f.isConsumed).length || 0})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* NỘI DUNG CHÍNH (BODY)                                              */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {activeTab === 'fruits' ? (
            /* =============================================================== */
            /* TAB: TÚI ĐẠO QUẢ & NỘI TẠI KINH MẠCH ĐÃ DUNG HỢP                */
            /* =============================================================== */
            <div className="space-y-6">
              {/* Danh sách Affix vĩnh viễn đã hấp thụ */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 to-black/60 border border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-serif font-bold text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Đạo Vận Vĩnh Viễn Trong Kinh Mạch ({player.absorbedDaoAffixes?.length || 0})
                  </h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Cộng dồn trực tiếp vào thực chiến
                  </span>
                </div>

                {(!player.absorbedDaoAffixes || player.absorbedDaoAffixes.length === 0) ? (
                  <p className="text-xs text-zinc-500 italic py-2">
                    Chưa phục dụng Đạo Quả nào. Hãy gieo mầm Đạo Chủng và bế quan tích lũy để ngưng tụ Đạo Quả!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {player.absorbedDaoAffixes.map((affix, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-black/60 border border-amber-600/30 flex items-start gap-2.5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-base">
                          🍎
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-serif font-bold text-amber-200 truncate">
                            {affix.name}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                            {affix.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Danh sách Đạo Quả chín chờ phục dụng */}
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-serif font-bold text-zinc-200 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Đạo Quả Chờ Phục Dụng
                </h3>

                {(!player.harvestedDaoFruits || player.harvestedDaoFruits.filter(f => !f.isConsumed).length === 0) ? (
                  <div className="text-center py-6 text-zinc-500 text-xs font-serif">
                    Túi Đạo Quả trống rỗng. Hãy bế quan tích lũy để thu hoạch Đạo Quả!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {player.harvestedDaoFruits.filter(f => !f.isConsumed).map((fruit: DaoFruitItem) => (
                      <div
                        key={fruit.id}
                        className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 to-black/80 border border-amber-500/40 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="text-2xl shrink-0">🍎</div>
                          <div className="min-w-0">
                            <div className="text-xs font-serif font-bold text-amber-300 truncate">
                              {fruit.name}
                            </div>
                            <div className="text-[10px] text-emerald-400 truncate">
                              {fruit.affix.description}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleConsumeDaoFruit(fruit.id)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-serif text-xs font-bold hover:brightness-110 transition shadow-sm shrink-0 cursor-pointer"
                        >
                          Phục Dụng
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* =============================================================== */
            /* TAB: THIẾT LẬP NHẬP ĐỊNH TAM HÓA                                 */
            /* =============================================================== */
            <div className="space-y-5">
              {/* ------------------------------------------------------------- */}
              {/* THANH CHỌN THỌ NGUYÊN BẾ QUAN (SLIDER & PRESETS)              */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-[#10121a] border border-amber-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Hourglass className="w-4 h-4 text-amber-400" />
                    Thời Lượng Bế Quan (Tuế Nguyệt Thoi Đưa):
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-amber-300">
                      {targetYears} Năm
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono ml-2">
                      (Tuổi thọ: {currentAge} ➔ <span className="text-amber-400 font-bold">{projectAge}</span>/{maxLifespan})
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={1}
                    max={Math.max(1, safeMaxYears)}
                    value={targetYears}
                    onChange={(e) => setTargetYears(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>1 Năm</span>
                    <span>Thọ nguyên còn lại: {remainingYears.toFixed(1)} Năm</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {[
                    { yrs: 3, label: '3 Năm' },
                    { yrs: 5, label: '5 Năm' },
                    { yrs: 10, label: '10 Năm' },
                    { yrs: 20, label: '20 Năm' },
                    { yrs: 30, label: '30 Năm' },
                    { yrs: 50, label: '50 Năm' }
                  ].map((preset) => {
                    const isSel = targetYears === preset.yrs;
                    const isOver = preset.yrs > remainingYears;
                    return (
                      <button
                        key={preset.yrs}
                        type="button"
                        disabled={isOver}
                        onClick={() => setTargetYears(preset.yrs)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                          isOver
                            ? 'opacity-40 border-zinc-800 text-zinc-600 cursor-not-allowed'
                            : isSel
                              ? 'bg-amber-600/40 border-amber-500 text-amber-200 font-bold shadow-sm'
                              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* THẺ CHỌN TRỌNG TÂM TAM HÓA (3 CỘT ĐẶC TRƯNG)                 */}
              {/* ------------------------------------------------------------- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Ô 1: THANH LỌC KINH MẠCH (TẨY ĐAN ĐỘC) */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#14101c] to-[#0d0c14] border border-purple-900/50 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-purple-300 font-serif font-bold text-xs">
                      <Droplets className="w-4 h-4 text-purple-400" />
                      <span>1. Thanh Lọc Kinh Mạch</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed font-serif">
                      Đại chu thiên tự động đào thải đan độc tích tụ (2 điểm/năm), khôi phục độ thuần khiết chân nguyên.
                    </p>

                    {/* Thanh đo Đan Độc */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-zinc-400">Đan Độc:</span>
                        <span className="text-purple-400 font-bold">
                          {preview.curToxicity} ➔ <span className="text-emerald-400">{preview.estimatedNewToxicity}</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-red-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, preview.curToxicity)}%` }}
                        />
                      </div>
                    </div>

                    {/* Thanh đo Độ Tinh Khiết Chân Nguyên */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-zinc-400">Chân Nguyên:</span>
                        <span className="text-cyan-300 font-bold">
                          {player.qiPurity ?? 100}% ➔ <span className="text-emerald-300">{preview.estimatedNewPurity}%</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${preview.estimatedNewPurity}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-cyan-400/90 font-mono bg-cyan-950/30 p-2 rounded border border-cyan-800/30">
                    ⚡ Tỷ lệ đột phá cảnh giới: x{(preview.estimatedNewPurity / 100).toFixed(2)}
                  </div>
                </div>

                {/* Ô 2: ÔN DƯỠNG BẢN MỆNH */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#10141a] to-[#0c0f14] border border-blue-900/50 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-blue-300 font-serif font-bold text-xs">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span>2. Ôn Dưỡng Bản Mệnh</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed font-serif">
                      Trích xuất một phần tu vi nhập định nuôi dưỡng Khí Linh Bản Mệnh Pháp Bảo, tăng thân mật và cảnh giới.
                    </p>

                    {player.natalArtifact?.spirit ? (
                      <div className="space-y-2 bg-black/40 p-2.5 rounded-lg border border-blue-900/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-serif font-bold text-blue-200">
                            {player.natalArtifact.spirit.name}
                          </span>
                          <span className="text-[10px] font-mono text-blue-400 uppercase">
                            [{player.natalArtifact.spirit.stage}]
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                          <span>Độ Thân Mật:</span>
                          <span className="text-pink-400 font-bold">
                            {player.natalArtifact.spirit.intimacy || 0}/100
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-zinc-500 italic bg-black/30 p-2.5 rounded border border-zinc-800">
                        Chưa thức tỉnh Khí Linh Bản Mệnh Pháp Bảo.
                      </div>
                    )}

                    {/* Bộ chọn % trích xuất tu vi */}
                    <div className="space-y-1">
                      <div className="text-[11px] text-zinc-400 font-serif">
                        Tỷ lệ trích xuất Tu Vi:
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[0, 20, 35, 50].map((ratio) => {
                          const isSel = nourishRatio === ratio;
                          const disabled = !player.natalArtifact?.spirit && ratio > 0;
                          return (
                            <button
                              key={ratio}
                              type="button"
                              disabled={disabled}
                              onClick={() => setNourishRatio(ratio)}
                              className={`py-1 text-xs font-mono rounded transition cursor-pointer border ${
                                disabled
                                  ? 'opacity-30 border-zinc-800 text-zinc-600 cursor-not-allowed'
                                  : isSel
                                    ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-sm'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {ratio}%
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-blue-300 font-mono bg-blue-950/30 p-2 rounded border border-blue-800/30">
                    🛡️ Tu Vi Khí Linh nhận: {nourishRatio > 0 ? `${nourishRatio}% tổng thu hoạch` : '0%'}
                  </div>
                </div>

                {/* Ô 3: GIEO MẦM ĐẠO CHỦNG */}
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#18140e] to-[#120f0a] border border-amber-900/50 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>3. Gieo Mầm Đạo Chủng</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed font-serif">
                      Gieo mầm hạt giống đại đạo, bế quan đủ niên hạn sẽ đơm hoa kết trái thành Đạo Quả mang Affix nội tại.
                    </p>

                    {/* Hạt giống đang chọn hoặc hạt giống hiện tại */}
                    {preview.activeSeed ? (
                      <div className="bg-black/40 p-2.5 rounded-lg border border-amber-500/40 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
                            <span>{preview.activeSeed.icon || '🌱'}</span>
                            <span>{preview.activeSeed.name}</span>
                          </span>
                          <span className="text-[10px] font-mono text-amber-400">
                            {preview.nextAccum}/{preview.activeSeed.requiredYears} Năm
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (preview.nextAccum / preview.activeSeed.requiredYears) * 100)}%`
                            }}
                          />
                        </div>

                        <div className="text-[10px] text-emerald-400 font-mono">
                          ➔ {preview.activeSeed.resultingAffix.name}: {preview.activeSeed.resultingAffix.description}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-zinc-500 italic bg-black/30 p-2.5 rounded border border-zinc-800">
                        Chưa chọn hạt giống Đạo Chủng nào phía dưới.
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-amber-300 font-mono bg-amber-950/30 p-2 rounded border border-amber-800/30">
                    {preview.isSeedWillMature
                      ? '✨ Niên hạn đủ, sẽ ngưng tụ Đạo Quả!'
                      : preview.activeSeed
                        ? `🌱 Tích lũy tiến độ (+${targetYears} năm)`
                        : 'Vui lòng chọn 1 Đạo Chủng bên dưới'}
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* DANH SÁCH ĐẠO CHỦNG ĐỂ LỰA CHỌN                                */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Thiên Địa Đạo Chủng Phổ (Chọn 1 loại để gieo mầm):
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedSeedId(null)}
                    className="text-[10px] font-serif text-zinc-500 hover:text-zinc-300 cursor-pointer underline"
                  >
                    Bỏ chọn hạt giống
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {Object.values(DAO_SEEDS_REGISTRY).map((seed: DaoSeedConfig) => {
                    const isSelected = selectedSeedId === seed.id;
                    const isRealmLocked = (player.currentRealm || 0) < seed.minRealmIndex;

                    return (
                      <div
                        key={seed.id}
                        onClick={() => {
                          if (!isRealmLocked) setSelectedSeedId(seed.id);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isRealmLocked
                            ? 'opacity-40 border-zinc-800 bg-zinc-950/50 cursor-not-allowed'
                            : isSelected
                              ? 'border-amber-500 bg-gradient-to-br from-amber-950/40 to-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                              : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                              <span>{seed.icon}</span>
                              <span>{seed.name}</span>
                            </span>
                            {isRealmLocked ? (
                              <span className="text-[10px] text-red-400 font-mono flex items-center gap-0.5">
                                <Lock className="w-3 h-3" /> Cảnh giới {seed.minRealmIndex}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-amber-400/90">
                                {seed.requiredYears} Năm
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-zinc-400 font-serif leading-snug">
                            {seed.description}
                          </p>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-zinc-800/60 text-[10px] text-emerald-400 font-mono">
                          ★ {seed.resultingAffix.name}: {seed.resultingAffix.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* CHI PHÍ & CẢNH BÁO                                            */}
              {/* ------------------------------------------------------------- */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs">
                <div className="flex items-center gap-4 text-zinc-400 font-mono text-xs">
                  <span>Chi Phí:</span>
                  <span className={player.linhThach >= preview.costLinhThach ? 'text-amber-300' : 'text-red-400'}>
                    💎 {preview.costLinhThach.toLocaleString()} Linh Thạch
                  </span>
                  <span>hoặc</span>
                  <span className="text-emerald-300">
                    🌾 {preview.costTichCocDan} Tích Cốc Đan
                  </span>
                </div>

                {!validation.canSeclude && (
                  <div className="text-xs text-red-400 font-serif flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{validation.reason}</span>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* NÚT THỰC THI PHÁT QUANG HOÀNG KIM                              */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!validation.canSeclude}
                  onClick={handleExecuteEnhancedSeclusion}
                  className={`w-full py-3.5 px-6 rounded-xl font-serif text-sm font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                    validation.canSeclude
                      ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] hover:scale-[1.01] active:scale-[0.99]'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-black animate-spin" />
                  <span>🧘 BẾ QUAN NHẬP ĐỊNH (TAM HÓA QUY NGUYÊN)</span>
                  <Sparkles className="w-4 h-4 text-black animate-spin" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODAL SỚ TU TIÊN: BẢN THU HOẠCH ĐẠI ĐẠO (HARVEST SUMMARY)           */}
      {/* =================================================================== */}
      {showHarvestModal && lastHarvestResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0e1017] border-2 border-amber-500/80 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.4)] text-zinc-200 p-6 space-y-5">
            {/* Header Sớ */}
            <div className="text-center space-y-1 border-b border-amber-700/40 pb-4">
              <span className="text-[10px] px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono tracking-widest uppercase">
                Thiên Địa Tuế Nguyệt • Sớ Đại Đạo
              </span>
              <h3 className="text-xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                KẾT QUẢ BẾ QUAN TAM HÓA
              </h3>
              <p className="text-xs text-zinc-400 font-serif">
                Tuế nguyệt thoi đưa, công đức viên mãn, đốn ngộ xuất quan!
              </p>
            </div>

            {/* Chi tiết thành quả */}
            <div className="space-y-3 text-xs font-serif">
              {/* Năm & Tu vi */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/30">
                <span className="text-zinc-400">⏳ Tuế Nguyệt Trôi Qua:</span>
                <span className="text-amber-300 font-mono font-bold text-sm">
                  {lastHarvestResult.yearsPassed} Năm
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-amber-900/30">
                <span className="text-zinc-400">🧘 Tu Vi Bản Thân Hấp Thu:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  +{lastHarvestResult.tuviGainedPlayer.toLocaleString()} Tu Vi
                </span>
              </div>

              {/* Tẩy Đan Độc */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-purple-900/30">
                <span className="text-zinc-400">💧 Thanh Lọc Kinh Mạch:</span>
                <span className="text-purple-300 font-mono">
                  Đã tẩy trừ {lastHarvestResult.toxicityCleansed} điểm Đan Độc (Tinh Khiết: {lastHarvestResult.newQiPurity}%)
                </span>
              </div>

              {/* Bản Mệnh */}
              {lastHarvestResult.tuviDivertedArtifact > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/50 border border-blue-900/30">
                  <span className="text-zinc-400">🛡️ Ôn Dưỡng Khí Linh:</span>
                  <span className="text-blue-300 font-mono">
                    +{lastHarvestResult.spiritExpGained.toLocaleString()} EXP | +{lastHarvestResult.spiritAffinityGained} Hảo Cảm
                  </span>
                </div>
              )}

              {/* Đạo Quả Hoàn Thiện (nếu chín) */}
              {lastHarvestResult.maturedDaoFruit && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border-2 border-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.3)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-serif text-yellow-300 flex items-center gap-1.5">
                      <span>🍎</span>
                      <span>Đạo Quả Đơm Hoa: 【{lastHarvestResult.maturedDaoFruit.name}】</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-mono">
                      Cực Phẩm
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300 font-mono">
                    Nội tại ẩn: {lastHarvestResult.maturedDaoFruit.description}
                  </p>
                </div>
              )}
            </div>

            {/* Nút đóng */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={closeHarvestModal}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-serif font-bold text-xs hover:brightness-110 transition cursor-pointer shadow-md"
              >
                Thu Nhận & Đóng Sớ Đại Đạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
