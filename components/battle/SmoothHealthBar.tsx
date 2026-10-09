import React, { useState, useEffect, useRef } from 'react';

export interface SmoothHealthBarProps {
  currentHp: number;
  maxHp: number;
  label?: string;
  subLabel?: string;
  barColor?: string;
  trailingColor?: string;
  heightClass?: string;
  showText?: boolean;
  showPercent?: boolean;
  className?: string;
}

export const SmoothHealthBar: React.FC<SmoothHealthBarProps> = ({
  currentHp,
  maxHp,
  label = 'Sinh Lực',
  subLabel,
  barColor = 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400',
  trailingColor = 'bg-amber-500/60',
  heightClass = 'h-2 sm:h-2.5',
  showText = true,
  showPercent = true,
  className = ''
}) => {
  const safeMax = Math.max(1, maxHp);
  const safeCurrent = Math.max(0, Math.min(currentHp, safeMax));

  // Trailing Ghost HP (thanh bóng đuổi theo phía sau)
  const [trailingHp, setTrailingHp] = useState(safeCurrent);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (safeCurrent < trailingHp) {
      // Khi mất máu: giữ nguyên thanh bóng trong 250ms rồi từ từ co lại
      timeoutRef.current = setTimeout(() => {
        setTrailingHp(safeCurrent);
      }, 260);
    } else {
      // Khi hồi máu hoặc khởi tạo: cập nhật tức thì
      setTrailingHp(safeCurrent);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [safeCurrent, trailingHp]);

  const currentPercent = Math.max(0, Math.min(100, Math.round((safeCurrent / safeMax) * 100)));
  const trailingPercent = Math.max(0, Math.min(100, (trailingHp / safeMax) * 100));

  return (
    <div className={`space-y-1 w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono leading-none">
          <div className="flex items-center gap-1.5 text-zinc-400 font-serif">
            <span>{label}</span>
            {subLabel && <span className="text-zinc-500 font-mono text-[9px]">({subLabel})</span>}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-rose-300 font-bold">
              {safeCurrent.toLocaleString()}
            </span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-400">
              {safeMax.toLocaleString()}
            </span>
            {showPercent && (
              <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-black/40 text-amber-300/90 font-bold border border-amber-900/30">
                {currentPercent}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Khung thanh máu 2 lớp */}
      <div
        className={`relative w-full ${heightClass} rounded-full bg-zinc-950/90 overflow-hidden border border-zinc-800/80 shadow-inner`}
      >
        {/* Lớp 1 (Ghost/Trailing Bar): Nằm phía sau, co lại chậm sau 260ms */}
        <div
          className={`absolute top-0 left-0 h-full ${trailingColor} transition-all duration-500 ease-out`}
          style={{ width: `${trailingPercent}%` }}
        />

        {/* Lớp 2 (Foreground Bar): Co lại nhanh chóng theo HP thực tế */}
        <div
          className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-150 ease-out shadow-[0_0_8px_rgba(244,63,94,0.4)]`}
          style={{ width: `${(safeCurrent / safeMax) * 100}%` }}
        />
      </div>
    </div>
  );
};
