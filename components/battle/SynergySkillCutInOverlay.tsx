'use client';
// components/battle/SynergySkillCutInOverlay.tsx
// Hoạt ảnh CutIn khi kích hoạt Tuyệt Kỹ Hợp Kích
// Zero-Asset: 100% procedural SVG + CSS animation, không phụ thuộc ảnh ngoài

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { SynergyActivationResult } from '@/lib/types/combat-synergy';

interface SynergySkillCutInOverlayProps {
  result: SynergyActivationResult | null;
  onAnimationEnd?: () => void;
}

// ─── Particle engine (procedural SVG) ────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

function generateParticles(color: string, count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 1.5 + Math.random() * 3.5;
    return {
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 5,
      opacity: 0.8 + Math.random() * 0.2,
      color,
      life: 0,
      maxLife: 60 + Math.floor(Math.random() * 40),
    };
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SynergySkillCutInOverlay({
  result,
  onAnimationEnd,
}: SynergySkillCutInOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit' | 'hidden'>('hidden');
  const [particles, setParticles] = useState<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particleTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (particleTickRef.current) clearInterval(particleTickRef.current);
  }, []);

  useEffect(() => {
    if (!result?.triggered) return;

    cleanup();
    const cutIn = result.cutInData;
    const duration = cutIn.durationMs;
    const color = cutIn.particleColor;

    // Khởi động
    setParticles(generateParticles(color, 40));
    setVisible(true);
    setPhase('enter');

    // Chuyển phase hold
    timerRef.current = setTimeout(() => {
      setPhase('hold');
      // Particle ticker
      particleTickRef.current = setInterval(() => {
        setParticles(prev => prev.map(p => {
          const life = p.life + 1;
          if (life >= p.maxLife) return { ...p, life, opacity: 0 };
          return {
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.08, // gravity
            opacity: p.opacity * 0.97,
            life,
          };
        }));
      }, 16);
    }, 300);

    // Exit phase
    timerRef.current = setTimeout(() => {
      if (particleTickRef.current) clearInterval(particleTickRef.current);
      setPhase('exit');
    }, duration - 500);

    // Hidden + callback
    timerRef.current = setTimeout(() => {
      setPhase('hidden');
      setVisible(false);
      setParticles([]);
      onAnimationEnd?.();
    }, duration);

    return cleanup;
  }, [result, cleanup, onAnimationEnd]);

  if (!visible || !result) return null;

  const cutIn = result.cutInData;
  const glowColor = cutIn.glowColor;
  const particleColor = cutIn.particleColor;

  const isEnter = phase === 'enter';
  const isExit = phase === 'exit';

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* ─── Flash Overlay ─── */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor}44 0%, transparent 70%)`,
          opacity: isEnter ? 1 : isExit ? 0 : 0.6,
        }}
      />

      {/* ─── Diagonal Slash Lines (ký hiệu hợp kích) ─── */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isEnter ? 1 : isExit ? 0 : 0.85,
          transition: 'opacity 0.4s ease',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Ba đường chém hội tụ */}
        <line x1="0" y1="0" x2="50" y2="50" stroke={glowColor} strokeWidth="0.3" strokeOpacity="0.7" />
        <line x1="100" y1="0" x2="50" y2="50" stroke={particleColor} strokeWidth="0.3" strokeOpacity="0.7" />
        <line x1="50" y1="0" x2="50" y2="100" stroke={glowColor} strokeWidth="0.2" strokeOpacity="0.5" />

        {/* Vòng tròn hội tụ — "Tam Hoa Quy Nguyên" symbol */}
        <circle cx="50" cy="50" r="12" fill="none" stroke={glowColor} strokeWidth="0.4" strokeOpacity="0.8"
          style={{
            transformOrigin: '50% 50%',
            animation: phase === 'hold' ? 'spin 2s linear infinite' : 'none',
          }}
        />
        <circle cx="50" cy="50" r="8" fill="none" stroke={particleColor} strokeWidth="0.3" strokeOpacity="0.6" />
        <circle cx="50" cy="50" r="3" fill={glowColor} fillOpacity="0.9" />

        {/* Particles */}
        {particles.map(p => p.opacity > 0.02 ? (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.size * 0.3}
            fill={p.color}
            opacity={p.opacity}
          />
        ) : null)}
      </svg>

      {/* ─── CutIn Text Card ─── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-6 py-4 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor}22, rgba(0,0,0,0.85))`,
          border: `1px solid ${glowColor}88`,
          boxShadow: `0 0 32px 8px ${glowColor}44, inset 0 0 16px ${glowColor}22`,
          transform: `translate(-50%, -50%) scale(${isEnter ? 0.8 : isExit ? 1.1 : 1})`,
          opacity: isEnter ? 0 : isExit ? 0 : 1,
          transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
          minWidth: 280,
          maxWidth: 480,
        }}
      >
        {/* Tên chiêu */}
        <h2
          className="text-xl font-black mb-1 tracking-wider"
          style={{
            color: glowColor,
            textShadow: `0 0 20px ${glowColor}, 0 0 40px ${particleColor}`,
            fontFamily: "'Noto Serif SC', serif",
          }}
        >
          {result.skillName}
        </h2>

        {/* Quote */}
        <p
          className="text-xs italic mb-3 leading-relaxed"
          style={{ color: `${glowColor}cc`, fontFamily: 'serif' }}
        >
          {result.quote}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-4 text-sm">
          {result.totalDamage > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-white/50 uppercase tracking-wide">Sát Thương</span>
              <span
                className="text-lg font-black"
                style={{ color: result.isCrit ? '#ff4444' : glowColor }}
              >
                {result.totalDamage.toLocaleString()}
                {result.isCrit && <span className="text-xs ml-1 text-red-400">BẠO!</span>}
              </span>
            </div>
          )}
          {result.healAmount > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-white/50 uppercase tracking-wide">Hồi HP</span>
              <span className="text-lg font-black text-green-400">
                +{result.healAmount.toLocaleString()}
              </span>
            </div>
          )}
          {result.shieldAmount > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-white/50 uppercase tracking-wide">Khiên</span>
              <span className="text-lg font-black text-blue-300">
                +{result.shieldAmount.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Active effects */}
        {result.newEffects.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {result.newEffects.map((eff, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide"
                style={{ background: `${particleColor}33`, color: particleColor }}
              >
                {eff.type === 'freeze' ? '🌊 Đóng Băng'
                  : eff.type === 'stun' ? '💫 Choáng Váng'
                  : eff.type === 'shatter_armor' ? '🛡️ Phá Giáp'
                  : eff.type === 'dot_burn' ? '🔥 Thiêu Đốt'
                  : eff.type === 'debuff_atk' ? '⬇️ Giảm Công'
                  : eff.type === 'debuff_speed' ? '🐢 Giảm Tốc'
                  : eff.type === 'buff_player_atk' ? '⬆️ Tăng Công'
                  : eff.type === 'true_damage' ? '⚔️ Xuyên Giáp'
                  : eff.type
                }
                {eff.roundsRemaining > 1 ? ` ×${eff.roundsRemaining}` : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ─── Scanlines (thẩm mỹ) ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
          opacity: 0.5,
        }}
      />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
