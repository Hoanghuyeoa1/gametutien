'use client';

// components/tabs/DomainResonanceView.tsx
// Giao diện người dùng Cổ Phong: "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"

import React from 'react';
import {
  Sparkles,
  Flame,
  Shield,
  Zap,
  Droplets,
  Sword,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
  Activity
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { useDomainResonance } from '@/hooks/useDomainResonance';
import { DOMAIN_RESONANCES_REGISTRY } from '@/lib/domain-resonance-logic';

export interface DomainResonanceViewProps {
  player: PlayerStats;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: any) => void;
  showToast?: (msg: string) => void;
}

export const DomainResonanceView: React.FC<DomainResonanceViewProps> = ({
  player,
  setPlayer,
  addLog,
  showToast
}) => {
  const {
    allResonanceConfigs,
    equippedManuals,
    activeResonances,
    activeResonancesCount,
    potentialResonances,
    bonuses,
    selectedResonanceId,
    selectedResonanceConfig,
    isResonanceActive,
    handlePreviewResonance
  } = useDomainResonance({
    player,
    setPlayer,
    addLog,
    showToast
  });

  const spirit = player.natalArtifact?.spirit;

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. HEADER: DANH VỊ BÁT QUÁI DỊ TƯỢNG                     */}
      {/* ======================================================== */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-blue-950/40 border border-amber-600/40 shadow-[0_0_25px_rgba(245,158,11,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">☯️</span>
            <div>
              <h3 className="text-sm md:text-base font-serif font-bold text-amber-200 tracking-wide flex items-center gap-2">
                Cộng Hưởng Dị Tượng Ngũ Hành
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-normal">
                  Domain Resonances
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-serif">
                Thần Thông Trang Bị ⚔️ Khí Linh Bản Mệnh • Hiển Hóa Lĩnh Vực Cổ Phong
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/40 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-serif font-bold text-amber-100">
              {activeResonancesCount > 0 ? (
                <span className="text-emerald-300">{activeResonancesCount} Dị Tượng Kích Hoạt</span>
              ) : (
                <span className="text-zinc-400">Chưa Kích Hoạt Dị Tượng</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. KHU VỰC BÁT QUÁI NGŨ HÀNH TRẬN ĐỒ                      */}
      {/* ======================================================== */}
      <div className="p-4 rounded-xl bg-gradient-to-b from-[#12101b] via-[#0d0c14] to-[#08070d] border border-purple-900/40 shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-purple-950/80 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🌌</span>
            <h4 className="text-xs font-serif font-bold text-purple-200 uppercase tracking-wider">
              Bát Quái Ngũ Hành Trận Đồ
            </h4>
          </div>
          <span className="text-[10px] text-zinc-400 font-serif">
            Nhấp vào trận nhãn để xem chi tiết yêu cầu cộng hưởng
          </span>
        </div>

        {/* Trận Đồ Các Trụ Ngũ Hành */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {allResonanceConfigs.map(config => {
            const active = isResonanceActive(config.id);
            const isSelected = selectedResonanceId === config.id;

            return (
              <div
                key={config.id}
                onClick={() => handlePreviewResonance(config.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                  active
                    ? `bg-gradient-to-b ${config.auraVisual.bgGradient} ${config.auraVisual.borderColor} ${config.auraVisual.glowEffect} ring-1 ring-amber-400/50`
                    : isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                    : 'bg-black/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-white/5'
                }`}
              >
                {/* Trạng thái phát sáng đỉnh card */}
                {active && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-amber-400 text-black shadow-[0_0_8px_#f59e0b] animate-pulse">
                    KÍCH HOẠT
                  </span>
                )}

                <div className="space-y-1.5 text-center">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${
                    active ? 'bg-black/40 shadow-inner' : 'bg-zinc-900/60'
                  }`}>
                    {config.auraVisual.icon}
                  </div>

                  <div>
                    <h5 className={`text-xs font-serif font-bold truncate ${
                      active ? 'text-amber-200' : 'text-zinc-300'
                    }`}>
                      {config.title}
                    </h5>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Hệ: <strong style={{ color: config.auraVisual.elementColor }}>{config.element}</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/5 text-center">
                  <span className={`text-[9px] font-serif ${
                    active ? 'text-emerald-300 font-bold' : 'text-zinc-500'
                  }`}>
                    {active ? '● Đang Che Phủ' : '○ Tiềm Ẩn'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. THẺ BÀI DỊ TƯỢNG ĐANG VẬN HÀNH (ACTIVE CARDS)          */}
      {/* ======================================================== */}
      {activeResonances.length > 0 ? (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-base">🔥</span>
            <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-wider">
              Dị Tượng Lĩnh Vực Đang Vận Hành ({activeResonances.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeResonances.map(res => (
              <div
                key={res.resonanceId}
                className="p-4 rounded-xl bg-gradient-to-r from-[#191118] via-[#120d18] to-[#0a0812] border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)] space-y-2.5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{res.auraVisual?.icon || '🌟'}</span>
                    <div>
                      <h5 className="text-xs md:text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5">
                        【DỊ TƯỢNG: {res.name.toUpperCase()}】
                      </h5>
                      <span className="text-[10px] text-amber-400/80 font-mono">
                        Cấp {res.level} • Lĩnh Vực Toàn Trận
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Hiệu Lực</span>
                  </span>
                </div>

                {/* Nguồn gốc phối hợp */}
                <div className="p-2 rounded-lg bg-black/40 border border-amber-900/30 text-[11px] font-serif space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Sword className="w-3 h-3 text-amber-400" />
                    <span className="text-zinc-400">Thần Thông Kích Hoạt:</span>
                    <strong className="text-amber-200">{res.sourceSkillName}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-zinc-400">Khí Linh Bản Mệnh:</span>
                    <strong className="text-purple-200">{res.spiritName}</strong>
                  </div>
                </div>

                {/* Mô tả hiệu ứng thực chiến */}
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed pl-1 italic">
                  &ldquo;{res.effectDescription}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-950 via-[#10121a] to-zinc-950 border border-zinc-800 text-center space-y-2">
          <p className="text-xs font-serif text-zinc-400">
            Chưa có Dị Tượng Lĩnh Vực nào kích hoạt.
          </p>
          <p className="text-[11px] text-zinc-500 max-w-lg mx-auto">
            Hãy trang bị Thần Thông tương sinh cùng hệ và uẩn dưỡng Khí Linh Bản Mệnh Pháp Bảo để khai mở Dị Tượng Ngũ Hành.
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. CHI TIẾT DỊ TƯỢNG ĐANG CHỌN (PREVIEW CARD)             */}
      {/* ======================================================== */}
      {selectedResonanceConfig && (
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#13111f] via-[#0d0c17] to-[#080710] border border-cyan-800/40 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedResonanceConfig.auraVisual.icon}</span>
              <div>
                <h4 className="text-xs md:text-sm font-serif font-bold text-cyan-200">
                  Khảo Cứu Dị Tượng: 【{selectedResonanceConfig.title}】
                </h4>
                <p className="text-[10px] text-zinc-400 font-serif">
                  Quy luật Ngũ Hành Tương Sinh & Sát Kỹ Khí Linh
                </p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-serif font-bold ${
              isResonanceActive(selectedResonanceConfig.id)
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}>
              {isResonanceActive(selectedResonanceConfig.id) ? 'Đang Kích Hoạt' : 'Chưa Kích Hoạt'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Cột 1: Điều kiện cần */}
            <div className="p-3 rounded-lg bg-black/40 border border-cyan-900/30 space-y-2">
              <div className="font-serif font-bold text-cyan-300 flex items-center gap-1.5 border-b border-cyan-950 pb-1">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Yêu Cầu Khởi Tạo Dị Tượng</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">1. Hệ Thần Thông:</span>
                  <strong style={{ color: selectedResonanceConfig.auraVisual.elementColor }}>
                    Hệ {selectedResonanceConfig.requirement.requiredElement}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">2. Tính Cách Khí Linh:</span>
                  <span className="text-purple-300 font-serif">
                    {Array.isArray(selectedResonanceConfig.requirement.requiredPersonality)
                      ? selectedResonanceConfig.requirement.requiredPersonality.join(' / ')
                      : selectedResonanceConfig.requirement.requiredPersonality}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-400">3. Bậc Bản Mệnh Tối Thiểu:</span>
                  <span className="text-amber-300 font-mono">
                    Giai {selectedResonanceConfig.requirement.minArtifactTier || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Cột 2: Hiệu ứng chiến đấu */}
            <div className="p-3 rounded-lg bg-black/40 border border-cyan-900/30 space-y-2">
              <div className="font-serif font-bold text-amber-300 flex items-center gap-1.5 border-b border-cyan-950 pb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quy Tắc Vận Hành Thực Chiến</span>
              </div>

              <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                {selectedResonanceConfig.description}
              </p>

              <div className="pt-1 text-[10px] text-cyan-400/80 font-mono">
                * Tự động phát động trong Boss Thí Luyện, Trấn Ma Tháp và Lôi Đài PvP.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GỢI Ý DỊ TƯỢNG SẮP ĐẠT ĐƯỢC (POTENTIAL RESONANCES)     */}
      {/* ======================================================== */}
      {potentialResonances.length > 0 && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/20 via-black to-blue-950/20 border border-amber-900/30 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chỉ Điểm Tu Luyện • Gợi Ý Kích Hoạt Dị Tượng</span>
          </div>

          <div className="space-y-1.5">
            {potentialResonances.map(pot => (
              <div
                key={pot.config.id}
                className="p-2 rounded bg-black/30 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span>{pot.config.auraVisual.icon}</span>
                  <span className="font-serif font-bold text-zinc-200">
                    {pot.config.title}:
                  </span>
                  <span className="text-zinc-400 font-serif">
                    {pot.missingRequirements.join(' • ')}
                  </span>
                </div>
                <button
                  onClick={() => handlePreviewResonance(pot.config.id)}
                  className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-serif transition self-end sm:self-auto cursor-pointer"
                >
                  Xem Yêu Cầu
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
