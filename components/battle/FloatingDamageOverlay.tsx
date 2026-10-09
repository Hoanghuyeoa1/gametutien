import React from 'react';

export type DamagePopupType = 'normal' | 'crit' | 'dodge' | 'heal';

export interface DamagePopup {
  id: string;
  text: string;
  type: DamagePopupType;
  x: number; // offset X (%) from center (-30 to 30)
  y: number; // offset Y (%) from center (-30 to 30)
}

export interface FloatingDamageOverlayProps {
  popups: DamagePopup[];
  isSlashing?: boolean;
  slashIsCrit?: boolean;
  className?: string;
}

export const FloatingDamageOverlay: React.FC<FloatingDamageOverlayProps> = ({
  popups,
  isSlashing = false,
  slashIsCrit = false,
  className = ''
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Vệt kiếm khí chém chéo qua khung mục tiêu */}
      {isSlashing && (
        <div
          className={`sword-slash-line ${slashIsCrit ? 'crit' : ''} animate-sword-slash`}
        />
      )}

      {/* Danh sách chữ sát thương nổi bay lên */}
      {popups.map(popup => {
        const leftPercent = 50 + popup.x;
        const topPercent = 50 + popup.y;

        return (
          <div
            key={popup.id}
            className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
              popup.type === 'crit' ? 'animate-combat-crit' : 'animate-combat-float'
            }`}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`
            }}
          >
            {popup.type === 'crit' && (
              <div className="flex flex-col items-center leading-none text-center">
                <span className="text-[10px] sm:text-xs font-serif font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-red-950/90 border border-red-500/80 text-yellow-300 shadow-[0_0_12px_rgba(239,68,68,0.9)] mb-0.5">
                  💥 BẠO KÍCH!
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-rose-500 drop-shadow-[0_2px_12px_rgba(244,63,94,0.95)]">
                  {popup.text}
                </span>
              </div>
            )}

            {popup.type === 'normal' && (
              <span className="text-base sm:text-lg font-mono font-black text-zinc-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {popup.text}
              </span>
            )}

            {popup.type === 'dodge' && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
                <span className="text-xs sm:text-sm font-serif font-black italic text-emerald-300 tracking-wide">
                  🍃 NÉ TRÁNH!
                </span>
              </div>
            )}

            {popup.type === 'heal' && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-950/90 border border-lime-500/70 shadow-[0_0_10px_rgba(132,204,22,0.6)]">
                <span className="text-xs sm:text-sm font-mono font-black text-lime-300">
                  💚 {popup.text}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
