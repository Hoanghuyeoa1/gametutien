// components/forging/WeaponConduitCanvas.tsx
// Đồ họa Vector Cổ Phong biểu diễn Mạch Dẫn Linh & Trận Nhãn trên Thần Binh
// 100% SVG Vector thuần túy, Responsive, Micro-animations, Chuẩn Tiên Hiệp

import React, { useId } from 'react';
import { InscriptionConduitSlot } from '@/lib/types/formation-inscription';
import { Lock, Sparkles, Zap, Shield, Flame, Wind } from 'lucide-react';

export interface WeaponConduitCanvasProps {
  conduits: InscriptionConduitSlot[];
  maxSlots?: number;
  selectedSlotIndex: number | null;
  onSelectSlot: (slotIndex: number) => void;
  weaponName?: string;
  weaponGrade?: string;
}

export const WeaponConduitCanvas: React.FC<WeaponConduitCanvasProps> = ({
  conduits,
  maxSlots = 4,
  selectedSlotIndex,
  onSelectSlot,
  weaponName = 'Thần Binh',
  weaponGrade = 'Bảo Khí'
}) => {
  const filterIdGold = useId();
  const filterIdCyan = useId();
  const patternIdGrid = useId();

  // Tọa độ 4 Trận Nhãn (Conduit Nodes) trên thân kiếm (520x260 viewBox)
  const nodePositions = [
    { x: 105, y: 130, label: 'Nhất Trận Nhãn (Chuôi Kiếm)', short: 'Slot 1' },
    { x: 205, y: 130, label: 'Nhị Trận Nhãn (Kiếm Cách)', short: 'Slot 2' },
    { x: 305, y: 130, label: 'Tam Trận Nhãn (Thân Kiếm)', short: 'Slot 3' },
    { x: 405, y: 130, label: 'Tứ Trận Nhãn (Mũi Kiếm)', short: 'Slot 4' }
  ];

  // Chuẩn bị danh sách slot tối đa 4 slot
  const displaySlots: Array<{
    slotIndex: number;
    conduit?: InscriptionConduitSlot;
    isUnlocked: boolean;
    isInscribed: boolean;
    formationName?: string;
  }> = [];

  for (let i = 0; i < maxSlots; i++) {
    const found = conduits.find(c => c.slotIndex === i);
    displaySlots.push({
      slotIndex: i,
      conduit: found,
      isUnlocked: Boolean(found?.isUnlocked),
      isInscribed: Boolean(found?.isUnlocked && found?.inscribedFormationId),
      formationName: found?.inscribedFormationName
    });
  }

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0a0c14] via-[#0d101d] to-[#07080e] border border-cyan-900/40 p-4 shadow-2xl overflow-hidden select-none">
      {/* Background Decor: Bát Quái Cổ Trận Mờ Ảo */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        <div className="w-72 h-72 rounded-full border border-cyan-400 border-dashed animate-spin-slow" />
      </div>

      {/* Header trạng thái thần binh */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h4 className="font-serif text-sm font-bold text-cyan-200 tracking-wide flex items-center gap-1.5">
            <span>Đồ Trận Mạch Dẫn Linh</span>
            <span className="text-zinc-500 font-normal">|</span>
            <span className="text-amber-300 font-medium text-xs font-mono">[{weaponGrade}] {weaponName}</span>
          </h4>
        </div>

        {/* Legend chú thích màu sắc */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-amber-200">Đã Khắc Trận</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/50 border border-cyan-400" />
            <span className="text-cyan-300">Mạch Trống</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
            <span className="text-stone-400">Phong Ấn</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Đồ Họa Vector */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.3/1] max-h-[300px]">
        <svg
          viewBox="0 0 520 260"
          className="w-full h-full filter drop-shadow-md"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Bộ lọc ánh kim rực rỡ */}
            <filter id={filterIdGold} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Bộ lọc ánh lam linh khí */}
            <filter id={filterIdCyan} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Lưới tinh thể linh mạch */}
            <pattern id={patternIdGrid} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Lưới nền tinh thể */}
          <rect width="520" height="260" fill={`url(#${patternIdGrid})`} rx="12" />

          {/* Khung Kiếm Thể Cổ Xưa (Silhouetted Ancient Blade Outline) */}
          <g opacity="0.35" transform="translate(10, 0)">
            {/* Chuôi kiếm & Đốc kiếm */}
            <path
              d="M 50 130 L 70 122 L 70 138 Z"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            {/* Cán kiếm */}
            <rect x="70" y="125" width="25" height="10" rx="2" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
            {/* Kiếm cách (Bảo vệ tay cầm) */}
            <path
              d="M 95 105 L 102 120 L 102 140 L 95 155 L 90 148 L 92 130 L 90 112 Z"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            {/* Thân kiếm vươn dài & Mũi kiếm sắc nhọn */}
            <path
              d="M 102 118 L 440 123 L 475 130 L 440 137 L 102 142 Z"
              fill="rgba(15, 23, 42, 0.6)"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            {/* Rãnh huyết tủy trung tâm */}
            <line x1="102" y1="130" x2="435" y2="130" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Các Đường Mạch Dẫn Linh Uốn Lượn Nối Giữa Các Slot (Winding Spirit Conduits) */}
          {displaySlots.map((slot, idx) => {
            if (idx === displaySlots.length - 1) return null;
            const nextSlot = displaySlots[idx + 1];
            const p1 = nodePositions[idx];
            const p2 = nodePositions[idx + 1];

            // Mạch uốn lượn hình sóng âm dương
            const isWaveUp = idx % 2 === 0;
            const ctrlY1 = isWaveUp ? p1.y - 32 : p1.y + 32;
            const ctrlY2 = isWaveUp ? p2.y - 32 : p2.y + 32;
            const pathD = `M ${p1.x} ${p1.y} C ${p1.x + 35} ${ctrlY1}, ${p2.x - 35} ${ctrlY2}, ${p2.x} ${p2.y}`;

            // Trạng thái đường dẫn:
            // 1. Cả 2 đều có trận: Hoàng kim rực rỡ tuần hoàn
            // 2. Một trong 2 mở: Lam linh mờ ảo
            // 3. Khóa: Nét đứt đá xám
            const bothInscribed = slot.isInscribed && nextSlot.isInscribed;
            const isPathUnlocked = slot.isUnlocked && nextSlot.isUnlocked;

            return (
              <g key={`conduit-path-${idx}`}>
                {/* Lớp hào quang phát sáng dưới nền */}
                {bothInscribed && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeOpacity="0.3"
                    filter={`url(#${filterIdGold})`}
                    className="animate-pulse"
                  />
                )}
                {/* Đường dẫn chính */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={
                    bothInscribed
                      ? '#fbbf24'
                      : isPathUnlocked
                      ? 'rgba(6, 182, 212, 0.45)'
                      : 'rgba(82, 82, 91, 0.35)'
                  }
                  strokeWidth={bothInscribed ? 2.5 : isPathUnlocked ? 1.5 : 1}
                  strokeDasharray={bothInscribed ? 'none' : isPathUnlocked ? '4 3' : '2 4'}
                  filter={bothInscribed ? `url(#${filterIdGold})` : undefined}
                />
              </g>
            );
          })}

          {/* Vòng Xoáy Khí Trung Ương Tuần Hoàn */}
          <g transform="translate(255, 130)">
            <circle
              r="75"
              fill="none"
              stroke="rgba(6, 182, 212, 0.12)"
              strokeWidth="1"
              strokeDasharray="6 6"
              className="animate-spin-slow"
            />
            <circle
              r="55"
              fill="none"
              stroke="rgba(245, 158, 11, 0.1)"
              strokeWidth="0.8"
              strokeDasharray="3 4"
            />
          </g>

          {/* 4 Nút Trận Nhãn Tương Tác (Interactive Conduit Nodes) */}
          {displaySlots.map((slot, idx) => {
            const pos = nodePositions[idx];
            const isSelected = selectedSlotIndex === slot.slotIndex;
            const isUnlocked = slot.isUnlocked;
            const isInscribed = slot.isInscribed;

            return (
              <g
                key={`node-${slot.slotIndex}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectSlot(slot.slotIndex);
                  }
                }}
                className={`transition-all duration-300 ${
                  isUnlocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-60'
                }`}
              >
                {/* Hào quang khi được chọn (Selection Indicator Ring) */}
                {isSelected && (
                  <>
                    <circle
                      r="32"
                      fill="none"
                      stroke={isInscribed ? '#f59e0b' : '#22d3ee'}
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      className="animate-spin-slow"
                    />
                    <circle
                      r="26"
                      fill="none"
                      stroke={isInscribed ? '#fbbf24' : '#06b6d4'}
                      strokeWidth="2"
                      className="animate-ping opacity-35"
                    />
                  </>
                )}

                {/* Vòng ngoài phụ trợ */}
                <circle
                  r="22"
                  fill={
                    isInscribed
                      ? 'rgba(245, 158, 11, 0.15)'
                      : isUnlocked
                      ? 'rgba(6, 182, 212, 0.08)'
                      : 'rgba(24, 24, 27, 0.6)'
                  }
                  stroke={
                    isInscribed
                      ? '#f59e0b'
                      : isUnlocked
                      ? isSelected
                        ? '#22d3ee'
                        : '#0e7490'
                      : '#3f3f46'
                  }
                  strokeWidth={isInscribed ? 2 : isSelected ? 2 : 1.2}
                  filter={isInscribed ? `url(#${filterIdGold})` : isSelected ? `url(#${filterIdCyan})` : undefined}
                  className="transition-all duration-300 group-hover:scale-110"
                />

                {/* Lõi bên trong Trận Nhãn */}
                <circle
                  r="14"
                  fill={
                    isInscribed
                      ? '#d97706'
                      : isUnlocked
                      ? '#083344'
                      : '#18181b'
                  }
                  stroke={isInscribed ? '#fef08a' : '#155e75'}
                  strokeWidth="1"
                />

                {/* Biểu tượng trung tâm Trận Nhãn */}
                {isInscribed ? (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fef08a"
                    fontSize="11"
                    fontWeight="bold"
                    className="select-none font-serif"
                  >
                    陣
                  </text>
                ) : isUnlocked ? (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#38bdf8"
                    fontSize="13"
                    fontWeight="bold"
                    className="select-none"
                  >
                    +
                  </text>
                ) : (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#71717a"
                    fontSize="10"
                    className="select-none"
                  >
                    🔒
                  </text>
                )}

                {/* Nhãn số thứ tự Slot phía dưới */}
                <text
                  y="38"
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : isInscribed ? '#fbbf24' : '#a1a1aa'}
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="font-mono tracking-wider select-none"
                >
                  {pos.short}
                </text>

                {/* Tên Trận Văn đã khắc nếu có */}
                {isInscribed && slot.formationName && (
                  <text
                    y="-30"
                    textAnchor="middle"
                    fill="#fde047"
                    fontSize="9.5"
                    fontWeight="bold"
                    className="font-serif select-none"
                  >
                    {slot.formationName}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer gợi ý thao tác */}
      <div className="mt-2 pt-2 border-t border-cyan-900/30 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5 text-cyan-300/80">
          <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Nhấp trực tiếp vào Trận Nhãn để bắt đầu khắc ấn phù văn hoặc tẩy luyện</span>
        </div>
        {selectedSlotIndex !== null && (
          <span className="font-mono text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-600/40">
            Đang chọn: Trận Nhãn #{selectedSlotIndex + 1}
          </span>
        )}
      </div>
    </div>
  );
};
