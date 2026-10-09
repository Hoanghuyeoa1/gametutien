'use client';
// components/battle/TrinitySynergyGauge.tsx
// UI Đồng Hồ Nộ Khí Tam Vị Nhất Thể — hiển thị trong trận đấu
// Zero-Asset: 100% procedural SVG/CSS, không phụ thuộc ảnh ngoài

import React, { useMemo } from 'react';
import type { TrinitySynergyGaugeState } from '@/lib/types/combat-synergy';
import type { PlayerStats } from '@/lib/types/player';
import { canActivateSynergy, getGaugePercent, getEligibleSynergySkills, getEffectDisplayName } from '@/lib/combat-synergy-logic';

interface TrinitySynergyGaugeProps {
  gauge: TrinitySynergyGaugeState;
  player: PlayerStats;
  onManualActivate?: () => void;
  className?: string;
  compact?: boolean;
}

export default function TrinitySynergyGauge({
  gauge,
  player,
  onManualActivate,
  className = '',
  compact = false,
}: TrinitySynergyGaugeProps) {
  const pct = getGaugePercent(gauge);
  const canActivate = canActivateSynergy(gauge);
  const eligibleSkills = useMemo(() => getEligibleSynergySkills(player), [player]);
  const bestSkill = eligibleSkills[0] ?? null;
  const hasCooldown = gauge.cooldownRoundsRemaining > 0;

  // Màu gradient động theo % gauge
  const gaugeColor = pct >= 100
    ? '#ffd700'
    : pct >= 80
    ? '#ff8c00'
    : pct >= 50
    ? '#9b59b6'
    : '#3498db';

  const glowIntensity = pct >= 80 ? '0 0 12px 3px' : '0 0 4px 1px';
  const glowColor = bestSkill?.cutIn.glowColor || '#ffd700';

  if (compact) {
    // Phiên bản thu gọn — dùng trong header trận đấu
    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        title={`Nộ Khí: ${gauge.currentGauge}/${gauge.maxGauge}${hasCooldown ? ` (Hồi ${gauge.cooldownRoundsRemaining} hiệp)` : ''}`}
      >
        <span className="text-xs font-bold" style={{ color: gaugeColor }}>☯</span>
        <div className="relative h-2 w-20 rounded-full bg-white/10 overflow-hidden border border-white/20">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${gaugeColor}88, ${gaugeColor})`,
              boxShadow: canActivate ? `${glowIntensity} ${glowColor}` : 'none',
            }}
          />
        </div>
        <span className="text-[10px] tabular-nums" style={{ color: gaugeColor }}>{pct}%</span>
        {canActivate && bestSkill && (
          <span
            className="text-[10px] animate-pulse font-bold"
            style={{ color: glowColor }}
            title={`${bestSkill.name} sẵn sàng!`}
          >
            ⚡
          </span>
        )}
      </div>
    );
  }

  // Phiên bản đầy đủ — dùng trong panel bên
  return (
    <div
      className={`rounded-xl border p-3 backdrop-blur-sm select-none ${className}`}
      style={{
        borderColor: canActivate ? glowColor : 'rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.5)',
        boxShadow: canActivate ? `0 0 16px 2px ${glowColor}44` : 'none',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">☯️</span>
          <span className="text-xs font-bold text-white/80">Tam Vị Nhất Thể</span>
        </div>
        {hasCooldown && (
          <span className="text-[10px] text-orange-300 font-mono">
            ⏳ {gauge.cooldownRoundsRemaining}hiệp
          </span>
        )}
        {!hasCooldown && canActivate && (
          <span className="text-[10px] text-yellow-300 animate-pulse font-bold">SẴNSÀNG!</span>
        )}
      </div>

      {/* Thanh Nộ Khí — SVG procedural arc */}
      <div className="relative mb-2">
        <svg viewBox="0 0 200 20" className="w-full h-5">
          {/* Nền */}
          <rect x="2" y="4" width="196" height="12" rx="6" fill="rgba(255,255,255,0.08)" />
          {/* Điền gauge */}
          <rect
            x="2" y="4"
            width={Math.max(0, (pct / 100) * 196)}
            height="12" rx="6"
            fill={`url(#synergyGrad_${pct})`}
            style={{ transition: 'width 0.5s ease' }}
          />
          {/* Gradient định nghĩa */}
          <defs>
            <linearGradient id={`synergyGrad_${pct}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={gaugeColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor={gaugeColor} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Glow khi đầy */}
          {canActivate && (
            <rect x="2" y="4" width="196" height="12" rx="6" fill="none"
              stroke={glowColor} strokeWidth="1.5" strokeOpacity="0.8"
              style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
            />
          )}
          {/* Vạch chia 25/50/75 */}
          {[25, 50, 75].map(v => (
            <line
              key={v}
              x1={2 + (v / 100) * 196}
              y1="4"
              x2={2 + (v / 100) * 196}
              y2="16"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          ))}
        </svg>
        {/* Label */}
        <div className="flex justify-between text-[10px] mt-0.5">
          <span style={{ color: gaugeColor }} className="font-mono font-bold">{gauge.currentGauge}/{gauge.maxGauge}</span>
          <span className="text-white/40">{pct}%</span>
        </div>
      </div>

      {/* Chiêu thức sẵn có */}
      {bestSkill && (
        <div
          className="rounded-lg p-2 mb-2 border"
          style={{
            borderColor: `${bestSkill.colorTheme}44`,
            background: `${bestSkill.colorTheme}11`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span>{bestSkill.icon}</span>
            <span className="text-[11px] font-bold" style={{ color: bestSkill.colorTheme }}>
              {bestSkill.name}
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-0.5 leading-tight">{bestSkill.description}</p>
          {bestSkill.combat.effects.slice(0, 2).map((eff, i) => (
            <span
              key={i}
              className="inline-block text-[9px] rounded px-1 py-0.5 mr-1 mt-1"
              style={{ background: `${bestSkill.colorTheme}22`, color: bestSkill.colorTheme }}
            >
              {getEffectDisplayName(eff.type)}
            </span>
          ))}
        </div>
      )}

      {/* Nút thủ công */}
      {onManualActivate && canActivate && bestSkill && (
        <button
          onClick={onManualActivate}
          className="w-full rounded-lg py-1.5 text-xs font-bold transition-all duration-200 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${bestSkill.colorTheme}cc, ${glowColor})`,
            color: '#000',
            boxShadow: `0 0 12px 2px ${glowColor}66`,
          }}
        >
          ⚡ KHAI PHÁT HỢP KÍCH
        </button>
      )}

      {/* Hiệu ứng đang hoạt động */}
      {gauge.activeEffects.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {gauge.activeEffects.map((eff, i) => (
            <span
              key={i}
              className="text-[9px] rounded px-1 py-0.5 border border-white/10"
              style={{ background: 'rgba(255,200,0,0.1)', color: '#ffd700' }}
            >
              {getEffectDisplayName(eff.type)} ×{eff.roundsRemaining}
            </span>
          ))}
        </div>
      )}

      {/* Lần kích hoạt */}
      {gauge.totalSynergyActivations > 0 && (
        <p className="text-[9px] text-white/30 mt-1 text-right">
          Đã khai phát: {gauge.totalSynergyActivations} lần
        </p>
      )}
    </div>
  );
}
