// components/forging/CalligraphyModal.tsx
// Hiệu ứng Hoạt Ảnh Vung Bút Chu Sa Khắc Trận Pháp Cổ Phong (Calligraphy Ritual)
// 100% Strict TypeScript, CSS SVG Animations, Tự động hoàn tất sau 1.2s

import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';

export interface CalligraphyModalProps {
  isOpen: boolean;
  formationName?: string;
  onComplete?: () => void;
}

export const CalligraphyModal: React.FC<CalligraphyModalProps> = ({
  isOpen,
  formationName = 'Trận Đồ Thần Phẩm',
  onComplete
}) => {
  const [phase, setPhase] = useState<'drawing' | 'radiance'>('drawing');

  useEffect(() => {
    if (!isOpen) {
      setPhase('drawing');
      return;
    }

    // Kích hoạt âm thanh kiếm khí xé toạc hư không
    try {
      audioEngine.playSwordSlashSound(0.85, true);
    } catch {
      // Fallback an toàn
    }

    // Giai đoạn 1: Vung bút vẽ phù văn (0 - 800ms)
    const timer1 = setTimeout(() => {
      setPhase('radiance');
    }, 750);

    // Giai đoạn 2: Hào quang bùng sáng và kết thúc (sau 1200ms)
    const timer2 = setTimeout(() => {
      onComplete?.();
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg select-none">
      <div className="relative flex flex-col items-center justify-center max-w-md w-full text-center">
        {/* Vòng Xoáy Bát Quái Cổ Trận */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Hào quang nền phát sáng */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              phase === 'radiance'
                ? 'bg-amber-400/25 blur-3xl scale-125'
                : 'bg-rose-600/20 blur-2xl scale-100'
            }`}
          />

          {/* Vòng ngoài Bát Quái xoay tròn */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full animate-spin-slow filter drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
          >
            {/* Vòng tròn kép âm dương */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="6 3" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 3" />

            {/* 8 Quái Tượng Bát Quái (☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷) */}
            {[
              { label: '☰', angle: 0 },
              { label: '☱', angle: 45 },
              { label: '☲', angle: 90 },
              { label: '☳', angle: 135 },
              { label: '☴', angle: 180 },
              { label: '☵', angle: 225 },
              { label: '☶', angle: 270 },
              { label: '☷', angle: 315 }
            ].map(({ label, angle }, idx) => {
              const rad = (angle * Math.PI) / 180;
              const x = 100 + 68 * Math.cos(rad);
              const y = 100 + 68 * Math.sin(rad);
              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fde047"
                  fontSize="13"
                  fontWeight="bold"
                  className="select-none font-serif"
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* Vết Mực Chu Sa Vẽ Nét Phù Văn Uốn Lượn Trung Tâm */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d="M 25 50 Q 50 15 75 50 T 25 50"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3.5"
              strokeLinecap="round"
              className={phase === 'radiance' ? 'animate-ping opacity-60' : 'animate-pulse'}
            />
            <path
              d="M 30 35 L 70 65 M 70 35 L 30 65"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </svg>

          {/* Biểu tượng trung tâm */}
          <div className="absolute z-10 flex flex-col items-center justify-center">
            <Sparkles className="w-10 h-10 text-amber-300 animate-bounce" />
          </div>
        </div>

        {/* Tiêu đề & Cổ ngữ */}
        <div className="mt-6 space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/60 text-rose-300 font-mono text-xs uppercase tracking-widest animate-pulse">
            Vung Bút Chu Sa • Minh Khắc Phù Văn
          </div>

          <h2 className="font-serif text-2xl font-black text-amber-300 tracking-wider drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
            【{formationName}】
          </h2>

          <p className="text-xs font-serif text-cyan-200/90 max-w-sm mx-auto leading-relaxed">
            Thiên địa linh khí cuồn cuộn quy tụ, chu sa ngưng tụ thành kim sắc phù văn khắc sâu vào kinh mạch thần binh...
          </p>
        </div>

        {/* Thanh Tiến Trình Huyền Bí */}
        <div className="w-64 h-1.5 mt-5 rounded-full bg-stone-900 border border-cyan-900/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-amber-400 to-cyan-400 transition-all duration-1000 ease-out"
            style={{ width: phase === 'radiance' ? '100%' : '70%' }}
          />
        </div>
      </div>
    </div>
  );
};
