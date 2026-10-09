import React, { useMemo } from 'react';
import { OreElementProperty } from '@/lib/types/modular-metallurgy';

export interface ElementalRadarChartProps {
  elementBreakdown?: Record<OreElementProperty, number>; // Ratios (0.0 to 1.0)
  dominantElement?: OreElementProperty | null;
  purityScore?: number;
  size?: number;
  className?: string;
  showLabels?: boolean;
}

interface RadarAxisConfig {
  element: OreElementProperty;
  label: string;
  subLabel: string;
  color: string;
  glowColor: string;
  textColor: string;
  strokeColor: string;
  icon: string;
}

export const RADAR_AXES: RadarAxisConfig[] = [
  {
    element: 'canh_kim',
    label: 'Canh Kim',
    subLabel: 'Sát Thương Chuẩn',
    color: '#fbbf24', // amber-400
    glowColor: 'rgba(251, 191, 36, 0.65)',
    textColor: 'text-amber-400',
    strokeColor: '#f59e0b',
    icon: '✨'
  },
  {
    element: 'han_bang',
    label: 'Hàn Băng',
    subLabel: 'Làm Chậm Tốc',
    color: '#38bdf8', // sky-400
    glowColor: 'rgba(56, 189, 248, 0.65)',
    textColor: 'text-sky-400',
    strokeColor: '#0ea5e9',
    icon: '❄️'
  },
  {
    element: 'xich_hoa',
    label: 'Xích Hỏa',
    subLabel: 'Thiêu Đốt DoT',
    color: '#f43f5e', // rose-500
    glowColor: 'rgba(244, 63, 94, 0.65)',
    textColor: 'text-rose-400',
    strokeColor: '#e11d48',
    icon: '🔥'
  },
  {
    element: 'huyen_thiet',
    label: 'Huyền Thiết',
    subLabel: 'Miễn Thương',
    color: '#94a3b8', // slate-400
    glowColor: 'rgba(148, 163, 184, 0.65)',
    textColor: 'text-slate-300',
    strokeColor: '#64748b',
    icon: '🛡️'
  },
  {
    element: 'tinh_than',
    label: 'Tinh Thần',
    subLabel: 'Kháng Bạo',
    color: '#c084fc', // purple-400
    glowColor: 'rgba(192, 132, 252, 0.65)',
    textColor: 'text-purple-400',
    strokeColor: '#a855f7',
    icon: '🔮'
  }
];

export const ElementalRadarChart: React.FC<ElementalRadarChartProps> = ({
  elementBreakdown = {
    canh_kim: 0,
    han_bang: 0,
    xich_hoa: 0,
    huyen_thiet: 0,
    tinh_than: 0
  },
  dominantElement,
  purityScore,
  size = 280,
  className = '',
  showLabels = true
}) => {
  const center = size / 2;
  const maxRadius = size * 0.33; // Bán kính tối đa của vòng ngoài cùng
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Tính tọa độ góc cho 5 đỉnh ngũ giác (đỉnh Canh Kim hướng lên trên 12h)
  const axisCoordinates = useMemo(() => {
    return RADAR_AXES.map((axis, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        ...axis,
        angle,
        cos,
        sin,
        outerX: center + maxRadius * cos,
        outerY: center + maxRadius * sin,
        labelX: center + (maxRadius + 28) * cos,
        labelY: center + (maxRadius + 22) * sin
      };
    });
  }, [center, maxRadius]);

  // Tọa độ các vòng ngũ giác đồng tâm
  const gridPolygons = useMemo(() => {
    return levels.map(level => {
      const r = maxRadius * level;
      const points = axisCoordinates
        .map(axis => `${(center + r * axis.cos).toFixed(1)},${(center + r * axis.sin).toFixed(1)}`)
        .join(' ');
      return { level, points };
    });
  }, [levels, maxRadius, axisCoordinates, center]);

  // Tọa độ đa giác dữ liệu thực tế (Data Polygon)
  const { dataPointsString, dataVertices, hasData } = useMemo(() => {
    let nonZeroCount = 0;
    const vertices = axisCoordinates.map(axis => {
      const rawVal = elementBreakdown[axis.element] || 0;
      if (rawVal > 0.001) nonZeroCount++;
      // Đảm bảo bán kính tối thiểu 0.08 để tạo hình khối trực quan
      const effectiveRatio = Math.max(0.08, Math.min(1.0, rawVal));
      const r = maxRadius * effectiveRatio;
      const x = center + r * axis.cos;
      const y = center + r * axis.sin;
      const isDominant = dominantElement === axis.element && rawVal > 0;
      return {
        ...axis,
        val: rawVal,
        x,
        y,
        isDominant
      };
    });

    const pointsString = vertices.map(v => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');
    return {
      dataPointsString: pointsString,
      dataVertices: vertices,
      hasData: nonZeroCount >= 2
    };
  }, [axisCoordinates, elementBreakdown, dominantElement, maxRadius, center]);

  const dominantConfig = useMemo(() => {
    return RADAR_AXES.find(a => a.element === dominantElement);
  }, [dominantElement]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          {/* Hiệu ứng phát quang hoàng kim Tiên Đạo */}
          <filter id="relicRadarGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradient đổ bóng cho vùng ngũ hành */}
          <radialGradient id="relicRadarFillGradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={dominantConfig ? dominantConfig.color : '#f59e0b'}
              stopOpacity="0.45"
            />
            <stop
              offset="70%"
              stopColor={dominantConfig ? dominantConfig.strokeColor : '#d97706'}
              stopOpacity="0.25"
            />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* 1. Vòng hào quang nền mờ */}
        <circle
          cx={center}
          cy={center}
          r={maxRadius + 4}
          fill="none"
          stroke="rgba(245, 158, 11, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* 2. Các vòng ngũ giác đồng tâm thiên can địa chi */}
        {gridPolygons.map(({ level, points }) => (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke={level === 1.0 ? 'rgba(245, 158, 11, 0.28)' : 'rgba(217, 119, 6, 0.12)'}
            strokeWidth={level === 1.0 ? '1.5' : '1'}
            strokeDasharray={level === 1.0 ? undefined : '3 3'}
          />
        ))}

        {/* 3. 5 Trục nan hoa hướng ra các cực ngũ hành */}
        {axisCoordinates.map(axis => (
          <line
            key={axis.element}
            x1={center}
            y1={center}
            x2={axis.outerX}
            y2={axis.outerY}
            stroke="rgba(217, 119, 6, 0.25)"
            strokeWidth="1"
          />
        ))}

        {/* 4. Vùng dữ liệu ngũ hành thực tế (Data Polygon) */}
        <polygon
          points={dataPointsString}
          fill="url(#relicRadarFillGradient)"
          stroke={dominantConfig ? dominantConfig.color : '#fbbf24'}
          strokeWidth={hasData ? '2.5' : '1.5'}
          strokeLinejoin="round"
          filter={hasData ? 'url(#relicRadarGlow)' : undefined}
          className="transition-all duration-500 ease-out"
        />

        {/* 5. Các điểm mấu chốt ngũ giác (Data Vertex Dots) */}
        {dataVertices.map(v => {
          const hasVal = v.val > 0.001;
          return (
            <g key={v.element} className="transition-all duration-300">
              {v.isDominant && (
                <circle
                  cx={v.x}
                  cy={v.y}
                  r="7"
                  fill="none"
                  stroke={v.color}
                  strokeWidth="1.5"
                  className="animate-ping opacity-75"
                />
              )}
              <circle
                cx={v.x}
                cy={v.y}
                r={v.isDominant ? 4.5 : hasVal ? 3.5 : 2}
                fill={hasVal ? v.color : '#52525b'}
                stroke="#09090b"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* 6. Tâm lò đúc (Crucible Core) */}
        <circle
          cx={center}
          cy={center}
          r="8"
          fill="#18181b"
          stroke={dominantConfig ? dominantConfig.color : '#f59e0b'}
          strokeWidth="2"
        />
        <circle
          cx={center}
          cy={center}
          r="3"
          fill={dominantConfig ? dominantConfig.color : '#fbbf24'}
        />

        {/* 7. Nhãn các thuộc tính ngũ hành bao quanh (Labels) */}
        {showLabels &&
          axisCoordinates.map(axis => {
            const rawVal = elementBreakdown[axis.element] || 0;
            const percentStr = `${Math.round(rawVal * 100)}%`;
            const isDom = dominantElement === axis.element && rawVal > 0;

            // Căn chỉnh chữ theo vị trí góc
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dyOffset = 0;
            if (axis.cos > 0.25) {
              textAnchor = 'start';
            } else if (axis.cos < -0.25) {
              textAnchor = 'end';
            }
            if (axis.sin < -0.7) {
              dyOffset = -8;
            } else if (axis.sin > 0.7) {
              dyOffset = 14;
            }

            return (
              <g
                key={axis.element}
                transform={`translate(${axis.labelX}, ${axis.labelY + dyOffset})`}
                className="transition-all duration-300 cursor-default"
              >
                <text
                  textAnchor={textAnchor}
                  fill={isDom ? axis.color : rawVal > 0 ? '#e4e4e7' : '#71717a'}
                  fontSize="10"
                  fontWeight={isDom ? 'bold' : 'normal'}
                  fontFamily="var(--font-serif), serif"
                  className="select-none"
                >
                  {axis.icon} {axis.label}
                </text>
                <text
                  textAnchor={textAnchor}
                  y="11"
                  fill={isDom ? '#fbbf24' : rawVal > 0 ? axis.color : '#52525b'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                  className="select-none"
                >
                  {percentStr}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Huy hiệu độ tinh khiết ngay dưới chân biểu đồ */}
      {typeof purityScore === 'number' && purityScore > 0 && (
        <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 border border-amber-500/40 text-[11px] font-mono shadow-sm">
          <span className="text-amber-400 font-serif">Độ Tinh Khiết:</span>
          <span className="text-amber-200 font-bold">{purityScore.toFixed(1)}%</span>
          {dominantConfig && (
            <span
              className="text-[10px] px-1.5 py-0.2 rounded font-serif border ml-1"
              style={{
                borderColor: dominantConfig.strokeColor,
                color: dominantConfig.color,
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
              }}
            >
              Chủ {dominantConfig.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
