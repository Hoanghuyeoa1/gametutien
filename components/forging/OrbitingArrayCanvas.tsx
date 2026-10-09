// components/forging/OrbitingArrayCanvas.tsx
// Vẽ tâm đồ hình nhân vật tu sĩ tọa thiền tĩnh tại và quỹ đạo elip Bát Quái 36 phi kiếm / ngũ hành châu
// 100% Strict TypeScript, Tailwind CSS, SVG Graphics, Responsive Mobile & Desktop

import React, { useMemo } from 'react';
import { Shield, Sparkles, Sword, Flame, Compass } from 'lucide-react';
import { FormationSetCategory } from '@/lib/types/weapon-tribulation-array';

export interface OrbitingArrayCanvasProps {
  category: FormationSetCategory;
  setName: string;
  currentPieces: number;
  maxPieces: number;
  isEquipped: boolean;
  onToggleEquip?: () => void;
  unlockedThresholdCount?: number;
}

export const OrbitingArrayCanvas: React.FC<OrbitingArrayCanvasProps> = ({
  category,
  setName,
  currentPieces,
  maxPieces,
  isEquipped,
  onToggleEquip,
  unlockedThresholdCount = 0
}) => {
  // Theme màu sắc theo loại trận khí
  const theme = useMemo(() => {
    switch (category) {
      case 'chu_thien_kiem':
        return {
          primary: '#38bdf8', // Sky 400
          secondary: '#818cf8', // Indigo 400
          accent: '#34d399', // Emerald 400
          ringColor: 'rgba(56, 189, 248, 0.35)',
          itemIcon: 'sword',
          itemLabel: 'Phi Kiếm',
          bgGradient: 'from-sky-950/40 via-stone-950 to-indigo-950/40'
        };
      case 'ngu_hanh_chau':
        return {
          primary: '#fbbf24', // Amber 400
          secondary: '#f43f5e', // Rose 500
          accent: '#10b981', // Emerald 500
          ringColor: 'rgba(251, 191, 36, 0.35)',
          itemIcon: 'bead',
          itemLabel: 'Linh Châu',
          bgGradient: 'from-amber-950/40 via-stone-950 to-emerald-950/40'
        };
      case 'bat_quai_ky':
      default:
        return {
          primary: '#c084fc', // Purple 400
          secondary: '#fb923c', // Orange 400
          accent: '#e879f9', // Fuchsia 400
          ringColor: 'rgba(192, 132, 252, 0.35)',
          itemIcon: 'flag',
          itemLabel: 'Trận Kỳ',
          bgGradient: 'from-purple-950/40 via-stone-950 to-stone-950'
        };
    }
  }, [category]);

  // Ngũ hành 5 màu cho Ngũ Hành Châu
  const fiveElementColors = ['#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#d97706'];

  // Tính tọa độ phân bố đều trên quỹ đạo elip cho từng mảnh
  const orbitItems = useMemo(() => {
    const items: Array<{
      id: number;
      cx: number;
      cy: number;
      angleDeg: number;
      color: string;
      scale: number;
    }> = [];

    const effectivePieces = Math.min(currentPieces, maxPieces);
    if (effectivePieces === 0) return items;

    // Phân tầng theo 2 vòng quỹ đạo nếu số mảnh lớn (như 36 kiếm)
    const hasTwoRings = maxPieces > 12;
    const innerCount = hasTwoRings ? Math.min(effectivePieces, Math.floor(maxPieces / 3)) : effectivePieces;
    const outerCount = hasTwoRings ? Math.max(0, effectivePieces - innerCount) : 0;

    // Vòng quỹ đạo trong
    const rxInner = 110;
    const ryInner = 60;
    for (let i = 0; i < innerCount; i++) {
      const angle = (2 * Math.PI * i) / (hasTwoRings ? Math.floor(maxPieces / 3) : maxPieces);
      const cx = 200 + rxInner * Math.cos(angle);
      const cy = 175 + ryInner * Math.sin(angle);
      const angleDeg = (angle * 180) / Math.PI + 90;
      const color =
        category === 'ngu_hanh_chau'
          ? fiveElementColors[i % fiveElementColors.length]
          : theme.primary;

      items.push({
        id: i,
        cx,
        cy,
        angleDeg,
        color,
        scale: 0.9
      });
    }

    // Vòng quỹ đạo ngoài
    if (outerCount > 0) {
      const rxOuter = 160;
      const ryOuter = 95;
      const maxOuter = maxPieces - Math.floor(maxPieces / 3);
      for (let i = 0; i < outerCount; i++) {
        const angle = (2 * Math.PI * i) / maxOuter;
        const cx = 200 + rxOuter * Math.cos(angle);
        const cy = 175 + ryOuter * Math.sin(angle);
        const angleDeg = (angle * 180) / Math.PI + 90;
        const color =
          category === 'ngu_hanh_chau'
            ? fiveElementColors[(i + 2) % fiveElementColors.length]
            : theme.secondary;

        items.push({
          id: innerCount + i,
          cx,
          cy,
          angleDeg,
          color,
          scale: 1.1
        });
      }
    }

    return items;
  }, [currentPieces, maxPieces, category, theme]);

  return (
    <div className={`relative rounded-2xl bg-gradient-to-b ${theme.bgGradient} border border-stone-800/80 p-4 overflow-hidden shadow-2xl flex flex-col items-center justify-between min-h-[380px]`}>
      {/* Background Ambience: Huyền quang bát quái */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-900/30 blur-3xl animate-pulse" />
      </div>

      {/* Header Canvas: Tên bộ trận & Huy hiệu trạng thái xuất chiến */}
      <div className="relative z-10 w-full flex items-center justify-between pb-2 border-b border-stone-800/60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
          <h3 className="font-serif font-bold text-sm text-stone-100">{setName}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-stone-300 font-mono">
            {currentPieces}/{maxPieces} {theme.itemLabel}
          </span>
        </div>

        {/* Huy hiệu trạng thái: [🛡️ ĐANG XUẤT CHIẾN TÙY THÂN] hoặc [CHƯA TRANG BỊ] */}
        <div>
          {isEquipped ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-serif font-bold bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.35)] animate-pulse">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>🛡️ ĐANG XUẤT CHIẾN TÙY THÂN</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-serif font-medium bg-stone-900/80 border border-stone-700/60 text-stone-400">
              <span>CHƯA TRANG BỊ</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG Canvas: Tu sĩ tọa thiền & Quỹ đạo elip Bát Quái */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-2">
        <svg
          className="w-full max-w-[420px] h-[270px] sm:h-[300px] select-none"
          viewBox="0 0 400 350"
        >
          <defs>
            {/* Bộ lọc phát sáng */}
            <filter id="orbitGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Radial Gradient Thái Cực */}
            <radialGradient id="taijiGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={theme.primary} stopOpacity="0.4" />
              <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0c0a09" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Vầng sáng trận pháp Thái Cực nền */}
          <circle cx="200" cy="175" r="140" fill="url(#taijiGlow)" />

          {/* Quỹ đạo elip Bát Quái tầng trong */}
          <ellipse
            cx="200"
            cy="175"
            rx="110"
            ry="60"
            fill="none"
            stroke={theme.ringColor}
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className="animate-spin-slow origin-[200px_175px]"
            style={{ animationDuration: '35s' }}
          />

          {/* Quỹ đạo elip Bát Quái tầng ngoài */}
          <ellipse
            cx="200"
            cy="175"
            rx="160"
            ry="95"
            fill="none"
            stroke={theme.ringColor}
            strokeWidth="1"
            strokeDasharray="8 6"
            className="animate-spin-slow origin-[200px_175px]"
            style={{ animationDuration: '55s', animationDirection: 'reverse' }}
          />

          {/* 8 Quái Vị Trụ (Bát Quái Phù Văn mờ) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 175 * Math.cos(rad);
            const y = 175 + 105 * Math.sin(rad);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="3"
                fill={theme.primary}
                opacity="0.3"
              />
            );
          })}

          {/* Nhóm xoay quanh quỹ đạo: Các phi kiếm / linh châu bay lượn tuần hoàn */}
          <g
            className="origin-[200px_175px] animate-spin-slow"
            style={{ animationDuration: isEquipped ? '18s' : '36s' }}
          >
            {orbitItems.map(item => {
              if (theme.itemIcon === 'sword') {
                return (
                  <g
                    key={item.id}
                    transform={`translate(${item.cx}, ${item.cy}) rotate(${item.angleDeg}) scale(${item.scale})`}
                  >
                    {/* Vệt hào quang kiếm khí */}
                    <path
                      d="M 0,16 L 2,0 L -2,0 Z"
                      fill={item.color}
                      opacity="0.35"
                      filter="url(#orbitGlow)"
                    />
                    {/* Thân kiếm nhỏ */}
                    <path
                      d="M 0,-14 L 3,-6 L 1.5,8 L 4,10 L 0,14 L -4,10 L -1.5,8 L -3,-6 Z"
                      fill={item.color}
                      stroke="#ffffff"
                      strokeWidth="0.6"
                      filter="url(#orbitGlow)"
                    />
                    {/* Điểm sáng mũi kiếm */}
                    <circle cx="0" cy="-14" r="1.5" fill="#ffffff" />
                  </g>
                );
              }

              if (theme.itemIcon === 'bead') {
                return (
                  <g key={item.id} transform={`translate(${item.cx}, ${item.cy}) scale(${item.scale})`}>
                    {/* Hào quang linh châu */}
                    <circle cx="0" cy="0" r="8" fill={item.color} opacity="0.3" filter="url(#orbitGlow)" />
                    {/* Viên ngọc linh châu */}
                    <circle cx="0" cy="0" r="5" fill={item.color} stroke="#ffffff" strokeWidth="0.8" />
                    {/* Điểm lấp lánh phản quang */}
                    <circle cx="-1.5" cy="-1.5" r="1.5" fill="#ffffff" opacity="0.9" />
                  </g>
                );
              }

              // Trận kỳ (Bát Quái Kỳ)
              return (
                <g key={item.id} transform={`translate(${item.cx}, ${item.cy}) rotate(${item.angleDeg}) scale(${item.scale})`}>
                  {/* Cột cờ */}
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="#d4d4d8" strokeWidth="1" />
                  {/* Lá cờ tam giác */}
                  <polygon points="0,-12 12,-6 0,0" fill={item.color} filter="url(#orbitGlow)" stroke="#ffffff" strokeWidth="0.5" />
                </g>
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* TRUNG TÂM TÂM ĐỒ: HÌNH NHÂN VẬT TU SĨ TỌA THIỀN TĨNH TẠI       */}
          {/* ============================================================== */}
          <g transform="translate(200, 175)">
            {/* Vòng hào quang đài sen / hộ thể kết giới */}
            <circle
              cx="0"
              cy="0"
              r="34"
              fill="#09090b"
              stroke={theme.primary}
              strokeWidth="1.8"
              filter="url(#orbitGlow)"
              className="animate-pulse"
            />
            {/* Vòng đồ hình Thái Cực Âm Dương mờ */}
            <circle cx="0" cy="0" r="30" fill="none" stroke="#6366f1" strokeWidth="0.8" strokeDasharray="3 3" />

            {/* Silhouette / Biểu tượng Tu Sĩ Tọa Thiền Tĩnh Tại */}
            {/* Đầu tu sĩ búi tóc đạo quán */}
            <circle cx="0" cy="-14" r="6" fill="#f8fafc" />
            <path d="M -2.5,-19 L 2.5,-19 L 1.5,-23 L -1.5,-23 Z" fill="#e2e8f0" /> {/* Trâm cài / búi tóc */}

            {/* Thân & Áo đạo bào xếp tọa thiền kiết già */}
            <path
              d="M -7,-7 C -12,2 -18,12 -16,16 C -14,18 -8,18 0,18 C 8,18 14,18 16,16 C 18,12 12,2 7,-7 Z"
              fill="#cbd5e1"
              opacity="0.95"
            />
            {/* Hai cánh tay kết ấn trước đan điền */}
            <path
              d="M -9,-3 C -7,5 -3,8 0,8 C 3,8 7,5 9,-3"
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Linh quang Đan Điền tỏa sáng */}
            <circle cx="0" cy="6" r="2.8" fill={theme.primary} filter="url(#orbitGlow)" className="animate-ping" />

            {/* Đài sen dưới chân tọa thiền */}
            <path
              d="M -22,17 C -15,22 15,22 22,17 C 18,25 -18,25 -22,17 Z"
              fill="#334155"
              stroke={theme.primary}
              strokeWidth="0.8"
            />
          </g>
        </svg>
      </div>

      {/* Footer Canvas: Điều khiển kích hoạt / Thu hồi & Thống kê mốc đại trận */}
      <div className="relative z-10 w-full pt-2 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-xs font-serif text-stone-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Đã kích hoạt: <strong className="text-amber-300 font-mono">{unlockedThresholdCount}</strong> mốc hiệu ứng đại trận
          </span>
        </div>

        {onToggleEquip && (
          <button
            onClick={onToggleEquip}
            disabled={currentPieces === 0}
            className={`py-2 px-4 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-md ${
              currentPieces === 0
                ? 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-50'
                : isEquipped
                ? 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-600 active:scale-95'
                : 'bg-gradient-to-r from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.35)] active:scale-95'
            }`}
          >
            {isEquipped ? (
              <>
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span>THU HỒI TRẬN KHÍ VỀ THỨC HẢI</span>
              </>
            ) : (
              <>
                <Sword className="w-3.5 h-3.5 text-emerald-300" />
                <span>⚔️ KÍCH HOẠT TRẬN KHÍ TÙY THÂN</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
