// components/forging/SoulAltarCanvas.tsx
// Đồ họa Vector Bát Quái Cổ Trận biểu diễn Tế Đàn Phong Hồn Đoạt Phách
// 100% SVG Vector thuần túy, Micro-animations, Chuẩn Tiên Hiệp Cổ Phong

import React, { useId } from 'react';
import { Equipment } from '@/lib/types/items';
import { SoulVesselItem, SoulType } from '@/lib/types/soul-infusion';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import { Zap, Sparkles, Sword, Flame, Shield, HelpCircle } from 'lucide-react';

export interface SoulAltarCanvasProps {
  selectedWeapon: Equipment | null;
  selectedSoul: SoulVesselItem | null;
  isInfusing: boolean;
  onSelectWeaponClick?: () => void;
  onSelectSoulClick?: () => void;
  canInfuse?: boolean;
}

const SOUL_THEME_MAP: Record<SoulType, {
  color: string;
  glowColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  label: string;
}> = {
  hac_giao: {
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    gradientFrom: '#083344',
    gradientTo: '#06b6d4',
    icon: '🐉',
    label: 'Hắc Thủy Huyền Giao'
  },
  hoa_phuong: {
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    gradientFrom: '#4c0519',
    gradientTo: '#f43f5e',
    icon: '🦚',
    label: 'Cửu Thiên Hỏa Phượng'
  },
  bach_ho: {
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    gradientFrom: '#451a03',
    gradientTo: '#fbbf24',
    icon: '🐯',
    label: 'Canh Kim Bạch Hổ'
  },
  huyen_vu: {
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    gradientFrom: '#064e3b',
    gradientTo: '#10b981',
    icon: '🐢',
    label: 'Bắc Minh Huyền Vũ'
  },
  co_kiem_tu: {
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    gradientFrom: '#3b0764',
    gradientTo: '#a855f7',
    icon: '⚔️',
    label: 'Thượng Cổ Kiếm Tu'
  }
};

export const SoulAltarCanvas: React.FC<SoulAltarCanvasProps> = ({
  selectedWeapon,
  selectedSoul,
  isInfusing,
  onSelectWeaponClick,
  onSelectSoulClick,
  canInfuse = false
}) => {
  const filterIdGlow = useId();
  const filterIdPurple = useId();
  const filterIdSoulOrb = useId();
  const maskIdBeam = useId();

  const activeSoulTheme = selectedSoul ? SOUL_THEME_MAP[selectedSoul.soulType] : null;

  // Bát Quái Cổ Phù Ký Tự
  const baguaTrigrams = ['☰ Càn', '☱ Đoài', '☲ Ly', '☳ Chấn', '☴ Tốn', '☵ Khảm', '☶ Cấn', '☷ Khôn'];

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#0e071e] via-[#090814] to-[#05040a] border border-purple-800/40 p-4 shadow-2xl overflow-hidden select-none">
      {/* Background Decor: Bát Quái Cổ Trận Huyền Bí */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className={`w-80 h-80 rounded-full border border-purple-500/40 border-dashed transition-all duration-1000 ${
          isInfusing ? 'animate-spin' : 'animate-spin-slow'
        }`} />
        <div className="absolute w-60 h-60 rounded-full border border-cyan-500/30 border-dotted animate-reverse-spin" />
      </div>

      {/* Header trạng thái tế đàn */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            isInfusing ? 'bg-rose-400 animate-ping' : canInfuse ? 'bg-cyan-400 animate-pulse' : 'bg-purple-400'
          }`} />
          <h4 className="font-serif text-sm font-bold text-purple-200 tracking-wide flex items-center gap-1.5">
            <span>Bát Quái Phong Hồn Tế Đàn</span>
            <span className="text-zinc-600 font-normal">|</span>
            <span className="text-amber-300 font-medium text-xs font-mono">
              {isInfusing
                ? '⚡ ĐANG PHONG HỒN ĐOẠT PHÁCH...'
                : selectedWeapon
                ? `[${convertGradeToGiai(selectedWeapon.grade)}] ${selectedWeapon.name}`
                : 'Chờ Đặt Thần Binh'}
            </span>
          </h4>
        </div>

        {/* Legend chú thích nhỏ */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span className="text-cyan-300">Linh Hồn Rót Thân</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-purple-300">Cổ Hồn Trận Nhãn</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Đồ Họa Vector Tế Đàn (540x330 viewBox) */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.2/1] max-h-[340px]">
        <svg
          viewBox="0 0 540 330"
          className="w-full h-full filter drop-shadow-lg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow Filter ma mị */}
            <filter id={filterIdGlow} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={filterIdPurple} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={filterIdSoulOrb} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients cho tia sét linh hồn */}
            <linearGradient id="soulStreamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeSoulTheme ? activeSoulTheme.color : '#a855f7'} stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="altarPedestalGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3b0764" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.2" />
            </linearGradient>

            {/* Radial gradient cho Hồn Châu */}
            <radialGradient id="soulOrbRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor={activeSoulTheme ? activeSoulTheme.color : '#c084fc'} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.4" />
            </radialGradient>
          </defs>

          {/* 1. VÒNG TRÒN BÁT QUÁI NỀN */}
          <g transform="translate(270, 165)" opacity="0.45">
            {/* Vành ngoài */}
            <circle r="145" fill="none" stroke="#6b21a8" strokeWidth="1.2" strokeDasharray="4,6" />
            <circle r="130" fill="none" stroke="#4c1d95" strokeWidth="1" />

            {/* 8 Quẻ Bát Quái bố trí vòng quanh */}
            {baguaTrigrams.map((trigram, idx) => {
              const angle = (idx * 45 * Math.PI) / 180;
              const tx = Math.cos(angle) * 115;
              const ty = Math.sin(angle) * 115;
              return (
                <text
                  key={trigram}
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#c084fc"
                  fontSize="9"
                  fontFamily="serif"
                  opacity="0.6"
                >
                  {trigram}
                </text>
              );
            })}

            {/* Thái Cực Lưỡng Nghi mờ ảo */}
            <circle r="60" fill="none" stroke="#581c87" strokeWidth="1" strokeDasharray="3,3" />
          </g>

          {/* 2. DÒNG CHẢY LINH HỒN (SOUL STREAM SVG BEAM) */}
          {selectedSoul && selectedWeapon && (
            <g filter={`url(#${filterIdGlow})`}>
              {/* Dòng chính dạng tia sét bezier */}
              <path
                d="M 270 95 C 255 130, 285 160, 270 215"
                fill="none"
                stroke="url(#soulStreamGrad)"
                strokeWidth={isInfusing ? '5' : '3'}
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Nhánh sét thứ cấp 1 */}
              <path
                d="M 270 95 Q 240 145 260 215"
                fill="none"
                stroke={activeSoulTheme ? activeSoulTheme.color : '#38bdf8'}
                strokeWidth="1.5"
                strokeDasharray="6,4"
                className="animate-pulse"
                opacity={isInfusing ? '0.9' : '0.6'}
              />

              {/* Nhánh sét thứ cấp 2 */}
              <path
                d="M 270 95 Q 300 155 280 215"
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4,6"
                className="animate-pulse"
                opacity={isInfusing ? '0.9' : '0.6'}
              />

              {/* Hạt linh hồn rơi dọc theo dòng chảy */}
              <circle cx="265" cy={isInfusing ? '150' : '135'} r="3" fill="#ffffff" className="animate-ping" />
              <circle cx="275" cy={isInfusing ? '180' : '175'} r="2" fill={activeSoulTheme ? activeSoulTheme.color : '#38bdf8'} />
            </g>
          )}

          {/* Đường dẫn linh mờ khi chưa đặt đủ 2 bên */}
          {(!selectedSoul || !selectedWeapon) && (
            <path
              d="M 270 95 L 270 215"
              fill="none"
              stroke="#4c1d95"
              strokeWidth="1"
              strokeDasharray="3,5"
              opacity="0.3"
            />
          )}

          {/* 3. ĐỈNH TRẬN: PHONG MA HỒN CHÂU (TOP NODE: 270, 68) */}
          <g transform="translate(270, 68)" className="cursor-pointer" onClick={onSelectSoulClick}>
            {/* Vòng hào quang xung quanh */}
            <circle
              r="34"
              fill="none"
              stroke={selectedSoul ? (activeSoulTheme ? activeSoulTheme.color : '#a855f7') : '#581c87'}
              strokeWidth="1.5"
              strokeDasharray={selectedSoul ? 'none' : '4,4'}
              filter={`url(#${filterIdPurple})`}
              className={selectedSoul ? 'animate-pulse' : ''}
              opacity={selectedSoul ? '0.8' : '0.4'}
            />

            <circle
              r="26"
              fill={selectedSoul ? 'url(#soulOrbRadial)' : '#170f2c'}
              stroke={selectedSoul ? '#ffffff' : '#6b21a8'}
              strokeWidth={selectedSoul ? '2' : '1'}
              filter={selectedSoul ? `url(#${filterIdSoulOrb})` : undefined}
            />

            {/* Nội dung Hồn Châu */}
            {selectedSoul ? (
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fontSize="20"
                className="select-none pointer-events-none"
              >
                {activeSoulTheme?.icon || '🔮'}
              </text>
            ) : (
              <g className="pointer-events-none">
                <text x="0" y="-3" textAnchor="middle" fill="#c084fc" fontSize="16">➕</text>
                <text x="0" y="11" textAnchor="middle" fill="#a855f7" fontSize="8" fontFamily="serif">Đặt Hồn</text>
              </g>
            )}

            {/* Tên Hồn Phách bên dưới Hồn Châu */}
            {selectedSoul && (
              <text
                x="0"
                y="48"
                textAnchor="middle"
                fill="#f3e8ff"
                fontSize="10"
                fontFamily="serif"
                fontWeight="bold"
                filter={`url(#${filterIdGlow})`}
              >
                {selectedSoul.name}
              </text>
            )}
          </g>

          {/* 4. TÂM TRẬN: THẦN BINH MỤC TIÊU (BOTTOM PEDESTAL: 270, 235) */}
          <g transform="translate(270, 235)">
            {/* Bệ đài tế kiếm */}
            <ellipse
              cx="0"
              cy="25"
              rx="160"
              ry="28"
              fill="url(#altarPedestalGrad)"
              stroke="#6b21a8"
              strokeWidth="1.2"
              opacity="0.7"
            />
            <ellipse
              cx="0"
              cy="25"
              rx="110"
              ry="18"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />

            {/* Hình chiếu thân kiếm hoặc vị trí đặt kiếm */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={onSelectWeaponClick}
            >
              {selectedWeapon ? (
                <>
                  {/* Hào quang khi kiếm đã nạp hồn */}
                  {selectedWeapon.infusedSoul && (
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="90"
                      ry="16"
                      fill={activeSoulTheme ? activeSoulTheme.glowColor : 'rgba(168, 85, 247, 0.3)'}
                      filter={`url(#${filterIdGlow})`}
                      className="animate-pulse"
                    />
                  )}

                  {/* Thanh kiếm nằm ngang trên tế đàn */}
                  <rect
                    x="-95"
                    y="-12"
                    width="190"
                    height="24"
                    rx="12"
                    fill="#181329"
                    stroke={selectedWeapon.infusedSoul ? '#fbbf24' : '#06b6d4'}
                    strokeWidth="1.8"
                    filter={`url(#${filterIdGlow})`}
                  />

                  {/* Đường vân dẫn linh trên thân kiếm */}
                  <line
                    x1="-70"
                    y1="0"
                    x2="70"
                    y2="0"
                    stroke={selectedWeapon.infusedSoul ? '#f59e0b' : '#38bdf8'}
                    strokeWidth="2"
                    strokeDasharray={isInfusing ? '8,4' : 'none'}
                    className={isInfusing ? 'animate-pulse' : ''}
                  />

                  {/* Icon Kiếm */}
                  <text x="-75" y="5" fontSize="13">⚔️</text>

                  {/* Tên Thần Binh */}
                  <text
                    x="5"
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    {selectedWeapon.name}
                    {selectedWeapon.enhancement > 0 ? ` (+${selectedWeapon.enhancement})` : ''}
                  </text>

                  {/* Badge Khí Linh nếu đã có */}
                  {selectedWeapon.infusedSoul && (
                    <text
                      x="0"
                      y="-18"
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize="9"
                      fontFamily="serif"
                      fontWeight="bold"
                      filter={`url(#${filterIdGlow})`}
                    >
                      ✨ Khí Linh: {selectedWeapon.infusedSoul.soulName} (Bậc {selectedWeapon.infusedSoul.evolutionStage})
                    </text>
                  )}
                </>
              ) : (
                <>
                  <rect
                    x="-80"
                    y="-14"
                    width="160"
                    height="28"
                    rx="6"
                    fill="#130d24"
                    stroke="#7e22ce"
                    strokeWidth="1.2"
                    strokeDasharray="4,4"
                    className="hover:stroke-purple-400"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#c084fc"
                    fontSize="10"
                    fontFamily="serif"
                  >
                    ⚔️ Nhấp Để Chọn Thần Binh
                  </text>
                </>
              )}
            </g>
          </g>

          {/* 5. HIỆU ỨNG KHI ĐANG PHONG HỒN (INFUSION STORM EFFECT) */}
          {isInfusing && (
            <g filter={`url(#${filterIdPurple})`}>
              <circle cx="270" cy="155" r="70" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="10,15" className="animate-spin" />
              <circle cx="270" cy="155" r="95" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="15,20" className="animate-reverse-spin" />
              <text x="270" y="160" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="serif" className="animate-pulse">
                HỒN PHÁCH NHẬP THÂN
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Footer thanh công cụ tế đàn */}
      <div className="relative z-10 mt-3 pt-2 border-t border-purple-900/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSelectWeaponClick}
            className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-700/40 text-[11px] font-serif transition cursor-pointer flex items-center gap-1.5"
          >
            <Sword className="w-3.5 h-3.5 text-purple-400" />
            <span>{selectedWeapon ? 'Đổi Thần Binh' : 'Chọn Thần Binh'}</span>
          </button>

          <button
            type="button"
            onClick={onSelectSoulClick}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-700/40 text-[11px] font-serif transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{selectedSoul ? 'Đổi Hồn Phách' : 'Chọn Hồn Phách'}</span>
          </button>
        </div>

        {/* Trạng thái sẵn sàng */}
        <div className="text-[11px] font-mono">
          {canInfuse ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Tế Đàn Đã Đầy Đủ Linh Khí
            </span>
          ) : (
            <span className="text-zinc-500">
              Chưa đủ điều kiện kích hoạt phong hồn
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
