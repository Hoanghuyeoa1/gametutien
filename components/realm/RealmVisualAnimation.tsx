'use client';

import React, { useId, useState, useTransition } from 'react';
import { getRealmVisualConfig, RealmVisualConfig } from '@/lib/realm-visuals-data';

export interface RealmVisualAnimationProps {
  realmIndex: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBadge?: boolean;
  showDescriptionTooltip?: boolean;
}

export const RealmVisualAnimation: React.FC<RealmVisualAnimationProps> = ({
  realmIndex,
  size = 'md',
  className = '',
  showBadge = true,
  showDescriptionTooltip = true
}) => {
  const config: RealmVisualConfig = getRealmVisualConfig(realmIndex);
  const rawId = useId();
  const filterId = `realm-glow-${rawId.replace(/[:]/g, '')}`;
  const gradId = `realm-grad-${rawId.replace(/[:]/g, '')}`;
  const auraGradId = `realm-aura-${rawId.replace(/[:]/g, '')}`;
  const mistGradId = `realm-mist-${rawId.replace(/[:]/g, '')}`;
  const pillarGradId = `realm-pillar-${rawId.replace(/[:]/g, '')}`;
  const jindanGradId = `realm-jindan-${rawId.replace(/[:]/g, '')}`;
  const flameGradId = `realm-flame-${rawId.replace(/[:]/g, '')}`;
  const nascentGradId = `realm-nascent-${rawId.replace(/[:]/g, '')}`;
  const titanGradId = `realm-titan-${rawId.replace(/[:]/g, '')}`;
  const [showTooltip, setShowTooltip] = useState(false);

  // Kích thước chuẩn khung hình thẻ bài (Tỉ lệ 5:6)
  const sizeStyles = {
    sm: 'w-24 h-28 text-[9px]',
    md: 'w-40 h-48 text-[11px]',
    lg: 'w-60 h-72 text-xs'
  }[size];

  // Cường độ phát sáng viền thẻ bài theo auraIntensity
  const auraGlowStyle = {
    low: `0 0 14px ${config.themeColor}33`,
    medium: `0 0 20px ${config.themeColor}55, inset 0 0 12px ${config.themeColor}22`,
    high: `0 0 28px ${config.themeColor}88, inset 0 0 16px ${config.themeColor}33`,
    supreme: `0 0 36px ${config.themeColor}aa, 0 0 16px ${config.subColor || '#fbbf24'}66, inset 0 0 20px ${config.themeColor}44`
  }[config.auraIntensity];

  return (
    <div
      className={`relative select-none flex flex-col items-center group ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      title={`${config.realmName} • ${config.badgeTitle}\n${config.description}`}
    >
      {/* Khung chứa Card Thẻ Bài Cổ Phong */}
      <div
        key={`realm-card-${realmIndex}`}
        className={`relative ${sizeStyles} rounded-2xl overflow-hidden border transition-all duration-700 bg-[#07080c] flex items-center justify-center animate-realm-crossfade`}
        style={{
          borderColor: `${config.themeColor}77`,
          boxShadow: auraGlowStyle
        }}
      >
        {/* 4 Góc Trang Trí Bát Giác Cổ Phong Hoàng Kim */}
        <div
          className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 pointer-events-none z-20"
          style={{ borderColor: config.themeColor }}
        />
        <div
          className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 pointer-events-none z-20"
          style={{ borderColor: config.themeColor }}
        />
        <div
          className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 pointer-events-none z-20"
          style={{ borderColor: config.themeColor }}
        />
        <div
          className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 pointer-events-none z-20"
          style={{ borderColor: config.themeColor }}
        />

        {/* Lớp SVG Hoạt Họa Vector Độ Nét Vô Hạn (Zero-Asset Architecture) */}
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full object-contain pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Filter Phát Sáng Hào Quang (Gaussian Blur Shader) */}
            <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur
                stdDeviation={config.auraIntensity === 'supreme' ? '5.5' : config.auraIntensity === 'high' ? '4' : '2.5'}
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient Nền Huyền Ảo Không Gian */}
            <radialGradient id={gradId} cx="50%" cy="58%" r="65%">
              <stop offset="0%" stopColor={config.themeColor} stopOpacity={config.auraIntensity === 'supreme' ? '0.35' : '0.2'} />
              <stop offset="60%" stopColor={config.subColor || config.themeColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor="#040508" stopOpacity="0.95" />
            </radialGradient>

            {/* Gradient Hào Quang Vầng Linh Quang */}
            <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={config.themeColor} stopOpacity="0.8" />
              <stop offset="50%" stopColor={config.subColor || config.themeColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={config.themeColor} stopOpacity="0" />
            </radialGradient>

            {/* Gradient Luồng Khí Thổ Nạp */}
            <linearGradient id={mistGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="50%" stopColor={config.themeColor} stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>

            {/* Gradient Cột Trụ Linh Quang (Trúc Cơ) */}
            <linearGradient id={pillarGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>

            {/* Gradient Kim Đan Thái Dương Hoàng Kim */}
            <radialGradient id={jindanGradId} cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
            </radialGradient>

            {/* Gradient Đan Hỏa Xích Hồng */}
            <linearGradient id={flameGradId} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>

            {/* Gradient Hư Ảnh Hài Đồng Nguyên Anh */}
            <radialGradient id={nascentGradId} cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#c084fc" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#8b5cf6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>

            {/* Gradient Hư Ảnh Cự Thần Pháp Tướng */}
            <linearGradient id={titanGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#881337" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* LỚP 1: BẦU KHÔNG KHÍ NỀN VÀ LINH QUANG BÁT HOANG */}
          <rect width="200" height="240" fill={`url(#${gradId})`} />

          {/* Tinh vân lấp lánh nhẹ hậu cảnh */}
          <g opacity="0.35">
            <circle cx="35" cy="45" r="1" fill="#fff" />
            <circle cx="165" cy="35" r="1" fill="#fff" />
            <circle cx="25" cy="170" r="1" fill="#fff" />
            <circle cx="175" cy="180" r="1" fill="#fff" />
            <circle cx="100" cy="25" r="1.2" fill={config.themeColor} />
          </g>

          {/* ======================================================== */}
          {/* LỚP 2: HIỆU ỨNG ĐỘC NHẤT RIÊNG CHO TỪNG CẢNH GIỚI (0 - 9) */}
          {/* ======================================================== */}

          {/* CẢNH GIỚI 0: PHÀM NHÂN (SƠN THÔN MỘC MẠC) */}
          {config.realmIndex === 0 && (
            <g id="effect-mortal-pine">
              {/* Nhánh tùng cổ thụ rủ xuống từ góc trên */}
              <path
                d="M 210 20 Q 165 35 130 25 T 90 40 Q 80 44 65 38"
                stroke="#57534e"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 130 25 Q 115 45 95 48"
                stroke="#44403c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tán lá thông mộc mạc */}
              <circle cx="70" cy="40" r="8" fill="#3f3f46" opacity="0.75" />
              <circle cx="85" cy="36" r="10" fill="#27272a" opacity="0.85" />
              <circle cx="115" cy="28" r="12" fill="#3f3f46" opacity="0.65" />
              <circle cx="140" cy="24" r="14" fill="#27272a" opacity="0.75" />

              {/* Ngọn gió núi lượn lờ */}
              <path
                d="M 15 90 Q 50 82 85 88 T 155 84"
                stroke="#78716c"
                strokeWidth="1"
                strokeDasharray="12 18"
                fill="none"
                opacity="0.4"
              />

              {/* Lá tùng rơi lơ lửng chậm rãi */}
              <g className="animate-realm-leaf-1" style={{ transformOrigin: '70px 45px' }}>
                <path d="M 70 45 C 72 49 76 50 78 48 C 80 46 78 42 74 43 Z" fill="#a8a29e" opacity="0.85" />
              </g>
              <g className="animate-realm-leaf-2" style={{ transformOrigin: '120px 35px' }}>
                <path d="M 120 35 C 122 39 126 40 128 38 C 130 36 128 32 124 33 Z" fill="#78716c" opacity="0.75" />
              </g>
            </g>
          )}

          {/* CẢNH GIỚI 1: LUYỆN KHÍ TẦNG 1 (DẪN KHÍ SƠ KHAI) */}
          {config.realmIndex === 1 && (
            <g id="effect-convergent-mist">
              {/* 4 Luồng bạch khí mờ nhạt từ bốn phương xoay tròn tụ về đan điền (100, 158) */}
              <g className="animate-realm-mist-spin">
                <path
                  d="M 30 50 Q 60 90 85 130 Q 95 148 100 158"
                  stroke={`url(#${mistGradId})`}
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="16 10"
                />
                <path
                  d="M 170 50 Q 140 90 115 130 Q 105 148 100 158"
                  stroke={`url(#${mistGradId})`}
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="16 10"
                />
                <path
                  d="M 25 210 Q 55 180 82 168 Q 95 162 100 158"
                  stroke={`url(#${mistGradId})`}
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                />
                <path
                  d="M 175 210 Q 145 180 118 168 Q 105 162 100 158"
                  stroke={`url(#${mistGradId})`}
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                />
              </g>
            </g>
          )}

          {/* CẢNH GIỚI 2: LUYỆN KHÍ TẦNG 2 (KINH MẠCH KHAI THÔNG) */}
          {config.realmIndex === 2 && (
            <g id="effect-double-helix">
              {/* Hai luồng linh khí dạng sợi xoắn ốc (double helix) bao quanh thân thể */}
              <path
                d="M 88 198 Q 66 175 92 155 T 120 130 T 82 102 T 100 84"
                stroke="#38bdf8"
                strokeWidth="2.2"
                fill="none"
                filter={`url(#${filterId})`}
                className="animate-realm-helix-1"
                opacity="0.8"
              />
              <path
                d="M 112 198 Q 134 175 108 155 T 80 130 T 118 102 T 100 84"
                stroke="#0ea5e9"
                strokeWidth="2.2"
                fill="none"
                filter={`url(#${filterId})`}
                className="animate-realm-helix-2"
                opacity="0.8"
              />
            </g>
          )}

          {/* CẢNH GIỚI 3: LUYỆN KHÍ TẦNG 3 (THỔ NẠP TIỂU THÀNH) */}
          {config.realmIndex === 3 && (
            <g id="effect-spirit-motes">
              {/* Vòng tròn linh khí dưới chân xoay nhẹ */}
              <g transform="translate(100, 196)">
                <ellipse
                  rx="68"
                  ry="15"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="10 8"
                  className="animate-realm-mist-spin"
                  filter={`url(#${filterId})`}
                  opacity="0.75"
                />
                <ellipse
                  rx="48"
                  ry="10"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                  opacity="0.5"
                />
              </g>

              {/* Các hạt linh tử phát sáng bay từ dưới đất thăng hoa lên trời */}
              <circle cx="65" cy="180" r="2" fill="#34d399" filter={`url(#${filterId})`} className="animate-realm-mote-1" />
              <circle cx="135" cy="185" r="2.4" fill="#10b981" filter={`url(#${filterId})`} className="animate-realm-mote-2" />
              <circle cx="85" cy="190" r="1.8" fill="#6ee7b7" filter={`url(#${filterId})`} className="animate-realm-mote-3" />
              <circle cx="115" cy="175" r="2.2" fill="#a7f3d0" filter={`url(#${filterId})`} className="animate-realm-mote-1" />
              <circle cx="95" cy="182" r="1.5" fill="#34d399" filter={`url(#${filterId})`} className="animate-realm-mote-2" />
            </g>
          )}

          {/* CẢNH GIỚI 4: LUYỆN KHÍ TẦNG 4 (LINH ÁP SƠ HIỆN) */}
          {config.realmIndex === 4 && (
            <g id="effect-bagua-ripples">
              {/* Sóng linh áp lan tỏa từng đợt gợn sóng (ripple wave) */}
              <circle
                cx="100"
                cy="194"
                r="18"
                fill="none"
                stroke="#06b6d4"
                filter={`url(#${filterId})`}
                className="animate-realm-ripple-1"
              />
              <circle
                cx="100"
                cy="194"
                r="18"
                fill="none"
                stroke="#22d3ee"
                filter={`url(#${filterId})`}
                className="animate-realm-ripple-2"
              />

              {/* Vầng hào quang Bát Quái mờ ảo dưới tọa thiền */}
              <g transform="translate(100, 195) scale(1, 0.32)" className="animate-realm-mist-spin">
                <circle cx="0" cy="0" r="58" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="14 6" opacity="0.6" />
                <polygon
                  points="0,-48 34,-34 48,0 34,34 0,48 -34,34 -48,0 -34,-34"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="1"
                  opacity="0.45"
                />
              </g>
            </g>
          )}

          {/* CẢNH GIỚI 5: LUYỆN KHÍ TẦNG 5 (NGŨ TẠNG TỤ KHÍ) */}
          {config.realmIndex === 5 && (
            <g id="effect-five-elements">
              {/* Đường dây liên kết ngũ hành luân chuyển tuần hoàn */}
              <path
                d="M 100 120 L 114 135 L 100 152 L 86 135 Z"
                stroke="#fbbf24"
                strokeWidth="1"
                fill="none"
                strokeDasharray="3 3"
                opacity="0.45"
              />
              <path
                d="M 100 120 L 100 152 M 86 135 L 114 135"
                stroke="#38bdf8"
                strokeWidth="0.8"
                fill="none"
                opacity="0.3"
              />

              {/* 5 Điểm quang hoa tương ứng Ngũ Tạng (Tâm, Can, Tỳ, Phế, Thận) */}
              {/* Tâm Hỏa - Đỏ son rực rỡ */}
              <circle
                cx="100"
                cy="120"
                r="3.5"
                fill="#f43f5e"
                filter={`url(#${filterId})`}
                className="animate-realm-node-1"
              />
              {/* Can Mộc - Xanh ngọc lục bảo */}
              <circle
                cx="86"
                cy="135"
                r="3.2"
                fill="#10b981"
                filter={`url(#${filterId})`}
                className="animate-realm-node-2"
              />
              {/* Tỳ Thổ - Vàng hổ phách */}
              <circle
                cx="114"
                cy="135"
                r="3.2"
                fill="#f59e0b"
                filter={`url(#${filterId})`}
                className="animate-realm-node-3"
              />
              {/* Phế Kim - Trắng bạc kim quang */}
              <circle
                cx="100"
                cy="108"
                r="2.8"
                fill="#f8fafc"
                filter={`url(#${filterId})`}
                className="animate-realm-node-4"
              />
              {/* Thận Thủy - Lam ngọc u lam */}
              <circle
                cx="100"
                cy="152"
                r="3.5"
                fill="#38bdf8"
                filter={`url(#${filterId})`}
                className="animate-realm-node-5"
              />
            </g>
          )}

          {/* CẢNH GIỚI 6: LUYỆN KHÍ TẦNG 6 (THẦN THỨC SƠ KHAI) */}
          {config.realmIndex === 6 && (
            <g id="effect-divine-sense">
              {/* Linh vụ tím thạch anh bao bọc thân hình mờ ảo */}
              <path
                d="M 40 140 Q 70 110 100 125 T 160 135 Q 140 170 100 165 T 40 140"
                fill="#8b5cf6"
                opacity="0.2"
                filter={`url(#${filterId})`}
                className="animate-realm-mist-spin"
              />

              {/* Sóng linh niệm tỏa ra từ Mi Tâm */}
              <circle
                cx="100"
                cy="92"
                r="8"
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.2"
                className="animate-realm-ripple-1"
                opacity="0.7"
              />
              <circle
                cx="100"
                cy="92"
                r="16"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="0.8"
                className="animate-realm-ripple-2"
                opacity="0.5"
              />

              {/* Mi tâm (trán) phát ra vầng sáng thần niệm nhấp nháy sắc sảo */}
              <polygon
                points="100,87 103,92 100,97 97,92"
                fill="#e9d5ff"
                filter={`url(#${filterId})`}
                className="animate-realm-third-eye"
              />
            </g>
          )}

          {/* CẢNH GIỚI 7: LUYỆN KHÍ TẦNG 7 (NGƯNG KHÍ HÓA HÌNH) */}
          {config.realmIndex === 7 && (
            <g id="effect-flying-swords">
              {/* Lôi quang điện mỏng chớp nháy */}
              <path
                d="M 65 110 L 72 125 L 68 132 L 78 145"
                stroke="#c084fc"
                strokeWidth="1.2"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M 135 110 L 128 125 L 132 132 L 122 145"
                stroke="#c084fc"
                strokeWidth="1.2"
                fill="none"
                opacity="0.7"
              />

              {/* Vòng quỹ đạo hư ảnh phi kiếm */}
              <ellipse
                cx="100"
                cy="145"
                rx="52"
                ry="22"
                fill="none"
                stroke="#a855f7"
                strokeWidth="0.8"
                strokeDasharray="4 6"
                opacity="0.4"
                transform="rotate(-15 100 145)"
              />

              {/* 3 Thanh Phi Kiếm tí hon xoay quanh hộ thể */}
              {/* Phi Kiếm 1 */}
              <g className="animate-realm-sword-orbit-1">
                <g transform="translate(100, 145) rotate(45)">
                  {/* Lưỡi kiếm */}
                  <polygon points="0,-12 3,0 0,6 -3,0" fill="#f3e8ff" filter={`url(#${filterId})`} />
                  {/* Chuôi kiếm */}
                  <rect x="-1" y="6" width="2" height="4" fill="#a855f7" />
                  <line x1="-3" y1="6" x2="3" y2="6" stroke="#fbbf24" strokeWidth="1" />
                </g>
              </g>

              {/* Phi Kiếm 2 */}
              <g className="animate-realm-sword-orbit-2">
                <g transform="translate(100, 145) rotate(45)">
                  <polygon points="0,-12 3,0 0,6 -3,0" fill="#e9d5ff" filter={`url(#${filterId})`} />
                  <rect x="-1" y="6" width="2" height="4" fill="#a855f7" />
                  <line x1="-3" y1="6" x2="3" y2="6" stroke="#fbbf24" strokeWidth="1" />
                </g>
              </g>

              {/* Phi Kiếm 3 */}
              <g className="animate-realm-sword-orbit-3">
                <g transform="translate(100, 145) rotate(45)">
                  <polygon points="0,-12 3,0 0,6 -3,0" fill="#fae8ff" filter={`url(#${filterId})`} />
                  <rect x="-1" y="6" width="2" height="4" fill="#a855f7" />
                  <line x1="-3" y1="6" x2="3" y2="6" stroke="#fbbf24" strokeWidth="1" />
                </g>
              </g>
            </g>
          )}

          {/* CẢNH GIỚI 8: LUYỆN KHÍ TẦNG 8 (CHU THIÊN VẠN TRIỆT) */}
          {config.realmIndex === 8 && (
            <g id="effect-highspeed-vortex">
              {/* Vòng xoáy linh khí tốc độ cao (vortex kim quang phối tử khí) */}
              <g className="animate-realm-vortex-fast">
                <path
                  d="M 100 145 m -58, 0 a 58,24 0 1,0 116,0 a 58,24 0 1,0 -116,0"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.2"
                  strokeDasharray="28 16"
                  filter={`url(#${filterId})`}
                  opacity="0.85"
                />
              </g>
              <g className="animate-realm-vortex-reverse">
                <path
                  d="M 100 145 m -44, 0 a 44,18 0 1,0 88,0 a 44,18 0 1,0 -88,0"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.8"
                  strokeDasharray="20 12"
                  filter={`url(#${filterId})`}
                  opacity="0.75"
                />
              </g>

              {/* Mạng lưới kinh mạch toàn thân phát sáng kim quang rực rỡ */}
              <g opacity="0.85">
                {/* Mạch Nhâm Đốc chính */}
                <line x1="100" y1="88" x2="100" y2="185" stroke="#fde047" strokeWidth="1.5" filter={`url(#${filterId})`} />
                {/* Mạch tay */}
                <line x1="100" y1="120" x2="68" y2="155" stroke="#fbbf24" strokeWidth="1.2" />
                <line x1="100" y1="120" x2="132" y2="155" stroke="#fbbf24" strokeWidth="1.2" />
                {/* Mạch chân */}
                <line x1="100" y1="165" x2="55" y2="185" stroke="#fbbf24" strokeWidth="1.2" />
                <line x1="100" y1="165" x2="145" y2="185" stroke="#fbbf24" strokeWidth="1.2" />
                {/* Các huyệt đạo lấp lánh */}
                <circle cx="100" cy="120" r="2.2" fill="#fff" />
                <circle cx="100" cy="140" r="2.2" fill="#fff" />
                <circle cx="100" cy="158" r="2.8" fill="#fff" />
                <circle cx="68" cy="155" r="2" fill="#fff" />
                <circle cx="132" cy="155" r="2" fill="#fff" />
              </g>
            </g>
          )}

          {/* CẢNH GIỚI 9 & 10: LUYỆN KHÍ TẦNG 9 & VIÊN MÃN (ĐỈNH PHONG CỰC CẢNH) */}
          {(config.realmIndex === 9 || config.realmIndex === 10) && (
            <g id="effect-taichi-perfection">
              {/* Ngọn lửa vàng kim rực lửa chực chờ bùng nổ (Golden Flame Aura) */}
              <path
                d="M 60 190 Q 50 140 75 110 Q 85 90 100 65 Q 115 90 125 110 Q 150 140 140 190 Z"
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                opacity="0.45"
                filter={`url(#${filterId})`}
              />

              {/* Vầng Thái Cực Đồ xoay vần phía sau lưng tu sĩ */}
              <g className="animate-realm-taiji">
                <g transform="translate(100, 125)">
                  {/* Vành Bát Quái ngũ sắc ngoài cùng */}
                  <circle cx="0" cy="0" r="46" fill="none" stroke="#eab308" strokeWidth="1.8" strokeDasharray="8 4" opacity="0.8" />
                  <circle cx="0" cy="0" r="42" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />

                  {/* Đĩa Thái Cực Âm Dương */}
                  <circle cx="0" cy="0" r="36" fill="#18181b" opacity="0.65" />
                  <path
                    d="M 0 -36 A 36 36 0 0 1 0 36 A 18 18 0 0 1 0 0 A 18 18 0 0 0 0 -36"
                    fill="#eab308"
                    opacity="0.75"
                  />
                  {/* Ngư nhãn (mắt cá Thái Cực) */}
                  <circle cx="0" cy="-18" r="4" fill="#18181b" />
                  <circle cx="0" cy="18" r="4" fill="#fef08a" />
                </g>
              </g>

              {/* Linh khí nén thành các giọt dịch lơ lửng quanh đan điền */}
              <g className="animate-realm-liquid">
                <circle cx="85" cy="155" r="2.8" fill="#fef08a" filter={`url(#${filterId})`} />
                <circle cx="115" cy="152" r="3.2" fill="#f59e0b" filter={`url(#${filterId})`} />
                <circle cx="100" cy="168" r="2.5" fill="#fde047" filter={`url(#${filterId})`} />
              </g>
            </g>
          )}

          {/* ======================================================== */}
          {/* CẢNH GIỚI 11 - 15: TRÚC CƠ (BÁT GIÁC ĐẠO ĐÀI & LINH DỊCH) */}
          {/* ======================================================== */}
          {(config.specialEffect === 'daotai' || (config.realmIndex >= 11 && config.realmIndex <= 15)) && (
            <g id="effect-truc-co-daotai">
              {/* Cột trụ Linh Quang (Pillar of Essence) chiếu thẳng từ thiên không xuống đỉnh đầu */}
              <g opacity={config.realmIndex >= 14 ? 0.65 : 0.45}>
                <rect
                  x="96"
                  y="15"
                  width="8"
                  height="180"
                  fill={`url(#${pillarGradId})`}
                  filter={`url(#${filterId})`}
                />
                <line x1="94" y1="20" x2="94" y2="170" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="10 15" opacity="0.6" />
                <line x1="106" y1="20" x2="106" y2="170" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="10 15" opacity="0.6" />
              </g>

              {/* Bát Giác Đạo Đài (Octagonal Foundation) xoay chậm 20s dưới tọa thiền */}
              <g className="animate-realm-daotai-spin" style={{ transformOrigin: '100px 195px' }}>
                {/* Vành Bát Giác ngoài cùng */}
                <polygon
                  points="
                    100,174
                    125,180
                    139,195
                    125,210
                    100,216
                    75,210
                    61,195
                    75,180
                  "
                  fill="none"
                  stroke={config.themeColor}
                  strokeWidth="1.8"
                  filter={`url(#${filterId})`}
                  opacity="0.85"
                />
                {/* Vành Bát Giác lồng phía trong */}
                <polygon
                  points="
                    100,180
                    119,185
                    130,195
                    119,205
                    100,210
                    81,205
                    70,195
                    81,185
                  "
                  fill="none"
                  stroke={config.subColor || '#38bdf8'}
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity="0.75"
                />
                {/* 8 Phù văn cổ tại 8 đỉnh bát giác đạo đài */}
                <circle cx="100" cy="174" r="1.8" fill="#fbbf24" />
                <circle cx="125" cy="180" r="1.8" fill="#38bdf8" />
                <circle cx="139" cy="195" r="2.2" fill="#fbbf24" />
                <circle cx="125" cy="210" r="1.8" fill="#38bdf8" />
                <circle cx="100" cy="216" r="1.8" fill="#fbbf24" />
                <circle cx="75" cy="210" r="1.8" fill="#38bdf8" />
                <circle cx="61" cy="195" r="2.2" fill="#fbbf24" />
                <circle cx="75" cy="180" r="1.8" fill="#38bdf8" />
              </g>

              {/* Linh Dịch Xoay Vần (Liquid Stream - Giọt & luồng ngọc bích dâng lên) */}
              <g id="liquid-stream-particles">
                {/* Luồng xoáy uốn lượn trái */}
                <path
                  d="M 68 200 Q 55 175 75 160 Q 90 152 100 158"
                  stroke="#10b981"
                  strokeWidth="1.4"
                  fill="none"
                  strokeDasharray="14 10"
                  opacity="0.75"
                  className="animate-realm-liquid-rise-1"
                />
                {/* Luồng xoáy uốn lượn phải */}
                <path
                  d="M 132 200 Q 145 175 125 160 Q 110 152 100 158"
                  stroke="#38bdf8"
                  strokeWidth="1.4"
                  fill="none"
                  strokeDasharray="14 10"
                  opacity="0.75"
                  className="animate-realm-liquid-rise-2"
                />

                {/* 3 Hạt linh dịch dạng giọt ngọc phát quang bốc lên nhấp nhô */}
                <g className="animate-realm-liquid-rise-1">
                  <circle cx="82" cy="178" r="3" fill="#34d399" filter={`url(#${filterId})`} />
                  <circle cx="82" cy="178" r="1.4" fill="#ffffff" />
                </g>
                <g className="animate-realm-liquid-rise-2">
                  <circle cx="118" cy="172" r="3.2" fill="#38bdf8" filter={`url(#${filterId})`} />
                  <circle cx="118" cy="172" r="1.5" fill="#ffffff" />
                </g>
                <g className="animate-realm-liquid-rise-3">
                  <circle cx="100" cy="184" r="2.8" fill="#fbbf24" filter={`url(#${filterId})`} />
                  <circle cx="100" cy="184" r="1.2" fill="#ffffff" />
                </g>
              </g>

              {/* Mặt nước Khí Hải đan điền gợn sóng xoay vần */}
              <ellipse
                cx="100"
                cy="195"
                rx="62"
                ry="14"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="8 6"
                opacity="0.55"
                className="animate-realm-mist-spin"
              />
            </g>
          )}

          {/* ======================================================== */}
          {/* CẢNH GIỚI 16 - 20: KIM ĐAN (KIM ĐAN LỰC, ĐAN VĂN & ĐAN HỎA)*/}
          {/* ======================================================== */}
          {(config.specialEffect === 'jindan' || (config.realmIndex >= 16 && config.realmIndex <= 20)) && (
            <g id="effect-kim-dan">
              {/* Đan Hỏa Cháy Bập Bùng (Alchemy Flame Ring bao bọc quanh thân) */}
              <g className="animate-realm-flame-wave" style={{ transformOrigin: '100px 155px' }}>
                {/* Vệt lửa chân hỏa tả hữu */}
                <path
                  d="M 52 195 Q 40 160 55 135 Q 68 115 62 90 Q 78 112 75 140 Q 62 165 72 192 Z"
                  fill={`url(#${flameGradId})`}
                  filter={`url(#${filterId})`}
                  opacity="0.6"
                />
                <path
                  d="M 148 195 Q 160 160 145 135 Q 132 115 138 90 Q 122 112 125 140 Q 138 165 128 192 Z"
                  fill={`url(#${flameGradId})`}
                  filter={`url(#${filterId})`}
                  opacity="0.6"
                />
                {/* Vòng lửa đáy bồ đoàn */}
                <ellipse
                  cx="100"
                  cy="195"
                  rx="54"
                  ry="13"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="12 6"
                  opacity="0.75"
                />
              </g>

              {/* Cửu Chuyển Đan Văn - Vòng 1 xoay xuôi nghiêng -20 độ quanh đan điền (100, 158) */}
              <g className="animate-realm-glyph-rotate" style={{ transformOrigin: '100px 158px' }}>
                <ellipse
                  cx="100"
                  cy="158"
                  rx="36"
                  ry="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                  strokeDasharray="6 8"
                  transform="rotate(-20 100 158)"
                  opacity="0.8"
                />
                <g transform="rotate(-20 100 158)">
                  <polygon points="64,158 66,155 68,158 66,161" fill="#fde047" />
                  <circle cx="100" cy="144" r="1.8" fill="#fde047" />
                  <polygon points="136,158 134,155 132,158 134,161" fill="#fde047" />
                  <circle cx="100" cy="172" r="1.8" fill="#fde047" />
                </g>
              </g>

              {/* Cửu Chuyển Đan Văn - Vòng 2 xoay ngược nghiêng +25 độ */}
              <g className="animate-realm-glyph-rotate-reverse" style={{ transformOrigin: '100px 158px' }}>
                <ellipse
                  cx="100"
                  cy="158"
                  rx="42"
                  ry="16"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  transform="rotate(25 100 158)"
                  opacity="0.65"
                />
                <g transform="rotate(25 100 158)">
                  <circle cx="58" cy="158" r="1.5" fill="#f97316" />
                  <polygon points="100,142 102,140 100,138 98,140" fill="#fbbf24" />
                  <circle cx="142" cy="158" r="1.5" fill="#f97316" />
                  <polygon points="100,174 102,176 100,178 98,176" fill="#fbbf24" />
                </g>
              </g>

              {/* Khối Cầu Kim Đan Xoay Tít (Core of Sun) - Lơ lửng tại Đan Điền */}
              <g className="animate-realm-jindan-pulse" style={{ transformOrigin: '100px 158px' }}>
                {/* Vầng hào quang nhật hoa tỏa ra */}
                <circle
                  cx="100"
                  cy="158"
                  r="14"
                  fill={`url(#${auraGradId})`}
                  opacity="0.85"
                />
                {/* Khối Cầu Kim Đan Hoàng Kim Bất Hoại */}
                <circle
                  cx="100"
                  cy="158"
                  r="8.5"
                  fill={`url(#${jindanGradId})`}
                  filter={`url(#${filterId})`}
                />
                {/* Tia Kim Quang Thái Dương 8 hướng */}
                <polygon
                  points="
                    100,145 102,155 113,158 102,161
                    100,171 98,161 87,158 98,155
                  "
                  fill="#ffffff"
                  opacity="0.95"
                />
                {/* Đạo văn nứt vỡ nếu là Đại Viên Mãn (index 20) */}
                {config.realmIndex === 20 && (
                  <path
                    d="M 98 153 L 100 158 L 103 162"
                    stroke="#a855f7"
                    strokeWidth="1.2"
                    fill="none"
                    filter={`url(#${filterId})`}
                  />
                )}
              </g>
            </g>
          )}

          {/* ======================================================== */}
          {/* CẢNH GIỚI 21 - 25: NGUYÊN ANH (HÀI ĐỒNG XUẤT KHIẾU & TỬ KHÍ) */}
          {/* ======================================================== */}
          {(config.specialEffect === 'nascent' || (config.realmIndex >= 21 && config.realmIndex <= 25)) && (
            <g id="effect-nguyen-anh">
              {/* Tử Khí Đông Lai & Tinh Hà Ngân Hà xoay vần sau lưng (100, 120) */}
              <g className="animate-realm-nebula-spin" style={{ transformOrigin: '100px 120px' }}>
                {/* Vòng xoắn tinh vân cực quang 1 */}
                <path
                  d="M 100 55 C 135 60 160 85 160 120 C 160 155 135 180 100 185 C 65 180 40 155 40 120 C 40 85 65 60 100 55"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeDasharray="24 16 8 16"
                  filter={`url(#${filterId})`}
                  opacity="0.45"
                />
                {/* Vòng xoắn tinh vân cực quang 2 */}
                <path
                  d="M 100 70 C 125 75 145 95 145 120 C 145 145 125 165 100 170 C 75 165 55 145 55 120 C 55 95 75 75 100 70"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="16 12"
                  opacity="0.5"
                />
                {/* Chòm sao tinh tú xoay vần */}
                <circle cx="140" cy="80" r="1.5" fill="#f3e8ff" />
                <circle cx="60" cy="160" r="1.5" fill="#f3e8ff" />
                <circle cx="150" cy="140" r="1.2" fill="#c084fc" />
                <circle cx="50" cy="100" r="1.2" fill="#c084fc" />
              </g>

              {/* Lưới Thần Niệm (Soul Boundary Shield - Vòng hào quang đa giác đan xen) */}
              <g id="soul-shield">
                <polygon
                  points="
                    100,45 138,62 160,100 160,140 138,178 100,195 62,178 40,140 40,100 62,62
                  "
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  opacity="0.55"
                />
                {/* Các node kết tinh thần niệm tại đỉnh */}
                <circle cx="100" cy="45" r="1.8" fill="#e0e7ff" />
                <circle cx="160" cy="100" r="1.8" fill="#e0e7ff" />
                <circle cx="160" cy="140" r="1.8" fill="#e0e7ff" />
                <circle cx="100" cy="195" r="1.8" fill="#e0e7ff" />
                <circle cx="40" cy="140" r="1.8" fill="#e0e7ff" />
                <circle cx="40" cy="100" r="1.8" fill="#e0e7ff" />
              </g>

              {/* Hư Ảnh Tiểu Hài Đồng Nguyên Anh Phát Quang (Nascent Soul Silhouette) */}
              {/* Lơ lửng tại vị trí ngực / đan điền trên (100, 118) */}
              <g className="animate-realm-nascent-float" style={{ transformOrigin: '100px 118px' }}>
                {/* Hào quang hình cầu quanh Nguyên Anh */}
                <circle
                  cx="100"
                  cy="118"
                  r="18"
                  fill={`url(#${nascentGradId})`}
                  filter={`url(#${filterId})`}
                  opacity="0.8"
                />
                <circle
                  cx="100"
                  cy="118"
                  r="15"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1"
                  strokeDasharray="6 3"
                  opacity="0.85"
                />

                {/* Đầu Hài Đồng phát quang thanh tú */}
                <circle cx="100" cy="108" r="4.8" fill="#ffffff" filter={`url(#${filterId})`} />
                {/* Vầng hào quang mi tâm hài đồng */}
                <circle cx="100" cy="108" r="6.5" fill="none" stroke="#e0e7ff" strokeWidth="0.8" />

                {/* Thân Hài Đồng xếp bằng tọa thiền */}
                <path
                  d="
                    M 100 113
                    C 93 115 89 121 90 126
                    C 93 128 107 128 110 126
                    C 111 121 107 115 100 113 Z
                  "
                  fill="#f3e8ff"
                  stroke="#c084fc"
                  strokeWidth="0.8"
                  filter={`url(#${filterId})`}
                />

                {/* Đôi tay chắp ấn Dhyana Mudra tí hon */}
                <ellipse cx="100" cy="122" rx="2.5" ry="1.2" fill="#ffffff" />

                {/* Tia thần thức linh động lóe sáng từ tâm hài đồng */}
                <circle cx="100" cy="116" r="1.5" fill="#38bdf8" />
              </g>
            </g>
          )}

          {/* ======================================================== */}
          {/* CẢNH GIỚI 26 - 30: HÓA THẦN (PHÁP TƯỚNG CỰ THẦN & VẾT RÁCH HƯ KHÔNG) */}
          {/* ======================================================== */}
          {(config.specialEffect === 'phaptuong' || (config.realmIndex >= 26 && config.realmIndex <= 30)) && (
            <g id="effect-hoa-than">
              {/* HƯ ẢNH CỰ THẦN PHÁP TƯỚNG (Titanic Dharma Idol sừng sững sau lưng) */}
              <g className="animate-realm-phap-tuong-aura" style={{ transformOrigin: '100px 75px' }}>
                {/* Vương miện Thần Ma / Tiên Miện Cổ Đại khổng lồ trên đỉnh đầu */}
                <path
                  d="M 100 16 L 109 35 L 126 26 L 118 45 L 132 46 L 116 58 L 100 52 L 84 58 L 68 46 L 82 45 L 74 26 L 91 35 Z"
                  fill={`url(#${titanGradId})`}
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                  filter={`url(#${filterId})`}
                  opacity="0.8"
                />

                {/* Khối thân thể & bờ vai Cự Thần sừng sững uy nghiêm */}
                <path
                  d="
                    M 100 52
                    C 120 54 145 64 162 86
                    C 172 108 168 145 160 175
                    C 140 170 60 170 40 175
                    C 32 145 28 108 38 86
                    C 55 64 80 54 100 52 Z
                  "
                  fill="#3b0716"
                  stroke="#f43f5e"
                  strokeWidth="1.6"
                  filter={`url(#${filterId})`}
                  opacity="0.55"
                />

                {/* Đôi mắt Thần Quang rực cháy (Thần Mục trảm hư không) */}
                <g filter={`url(#${filterId})`}>
                  {/* Mắt trái */}
                  <ellipse cx="86" cy="68" rx="5" ry="2" fill="#fef08a" />
                  <line x1="86" y1="68" x2="72" y2="65" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Mắt phải */}
                  <ellipse cx="114" cy="68" rx="5" ry="2" fill="#fef08a" />
                  <line x1="114" y1="68" x2="128" y2="65" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </g>

              {/* Quy Tắc Lĩnh Vực (Domain Ring of Karma xoay vần quy nạp vạn vật) */}
              <g className="animate-realm-domain-spin" style={{ transformOrigin: '100px 125px' }}>
                <circle
                  cx="100"
                  cy="125"
                  r="68"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.6"
                  strokeDasharray="18 10 6 10"
                  opacity="0.65"
                />
                <circle
                  cx="100"
                  cy="125"
                  r="60"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1"
                  strokeDasharray="10 8"
                  opacity="0.5"
                />
                {/* 4 Căn nguyên quy tắc phù hiệu trên vòng lĩnh vực */}
                <polygon points="100,57 103,62 100,67 97,62" fill="#fbbf24" />
                <polygon points="168,125 163,128 158,125 163,122" fill="#f43f5e" />
                <polygon points="100,193 97,188 100,183 103,188" fill="#fbbf24" />
                <polygon points="32,125 37,122 42,125 37,128" fill="#f43f5e" />
              </g>

              {/* Không Gian Rạn Nứt & Thiên Lôi (Void Rifts tia chớp giật xé rách không gian) */}
              <g className="animate-realm-void-lightning">
                {/* Tia sấm sét xé rách bên trái */}
                <path
                  d="M 18 68 L 32 85 L 24 102 L 38 120 L 26 142 L 35 158"
                  stroke="#f43f5e"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Tia sấm sét xé rách bên phải */}
                <path
                  d="M 182 62 L 168 82 L 176 98 L 162 118 L 174 138 L 165 156"
                  stroke="#a855f7"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Mảnh vỡ không gian bay lơ lửng */}
                <polygon points="26,92 31,88 34,95 28,98" fill="#f43f5e" opacity="0.8" />
                <polygon points="172,110 178,106 179,114 174,116" fill="#a855f7" opacity="0.8" />
              </g>
            </g>
          )}

          {/* HIỆU ỨNG TỔNG QUÁT CHO CẢNH GIỚI > 30 (LUYỆN HƯ, HỢP THỂ, ĐẠI THỪA...) */}
          {config.realmIndex > 30 && (
            <g id="effect-major-fallback">
              {/* Đạo Đài Bát Giác & Hào quang đại cảnh giới */}
              <g className="animate-realm-taiji">
                <g transform="translate(100, 130)">
                  <circle cx="0" cy="0" r="50" fill="none" stroke={config.themeColor} strokeWidth="2" strokeDasharray="12 6" opacity="0.75" />
                  <polygon
                    points="0,-45 32,-32 45,0 32,32 0,45 -32,32 -45,0 -32,-32"
                    fill="none"
                    stroke={config.subColor || '#fbbf24'}
                    strokeWidth="1.2"
                    opacity="0.6"
                  />
                </g>
              </g>
              {/* Đan điền hóa hải cuồn cuộn */}
              <ellipse
                cx="100"
                cy="195"
                rx="65"
                ry="16"
                fill="none"
                stroke={config.themeColor}
                strokeWidth="2"
                strokeDasharray="14 8"
                className="animate-realm-mist-spin"
                filter={`url(#${filterId})`}
              />
            </g>
          )}

          {/* ======================================================== */}
          {/* LỚP 3: BÓNG DÁNG TU SĨ NHẬP ĐỊNH (MEDITATING SILHOUETTE)   */}
          {/* ======================================================== */}
          <g id="cultivator-silhouette">
            {/* Đệm Bồ Đoàn Tọa Thiền */}
            <ellipse cx="100" cy="195" rx="56" ry="12" fill="#18181b" stroke="#27272a" strokeWidth="1" />

            {/* Hào quang viền thân thể (Rim light / Body Aura) */}
            <path
              d="
                M 100 78
                C 92 78 86 85 87 95
                C 82 102 75 110 68 122
                C 60 135 55 152 48 175
                C 42 192 65 195 100 195
                C 135 195 158 192 152 175
                C 145 152 140 135 132 122
                C 125 110 118 102 113 95
                C 114 85 108 78 100 78 Z
              "
              fill="none"
              stroke={config.themeColor}
              strokeWidth={config.realmIndex === 0 ? "0.8" : "1.8"}
              filter={`url(#${filterId})`}
              opacity={config.realmIndex === 0 ? "0.3" : "0.75"}
            />

            {/* Khối thân thể tu sĩ (Màu mực đen tuyền thoát tục) */}
            {/* Thân & Trường bào tọa thiền */}
            <path
              d="
                M 100 102
                C 88 106 72 118 66 128
                C 58 140 52 160 48 180
                C 46 186 52 192 75 193
                C 90 194 110 194 125 193
                C 148 192 154 186 152 180
                C 148 160 142 140 134 128
                C 128 118 112 106 100 102 Z
              "
              fill="#090a0f"
            />

            {/* Nếp gấp vạt áo và tay áo thụng (Dáng thiền khoan thai) */}
            <path
              d="M 66 128 C 76 142 82 165 100 168 C 118 165 124 142 134 128"
              stroke="#1c1917"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Vạt áo chéo Cổ Phong */}
            <path
              d="M 88 112 L 108 140 M 112 112 L 98 130"
              stroke="#292524"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />

            {/* Đầu & Khuôn mặt nhập định thanh tĩnh */}
            <ellipse cx="100" cy="94" rx="10" ry="12" fill="#090a0f" />

            {/* Búi tóc đạo gia & Trâm cài tóc */}
            <circle cx="100" cy="79" r="6" fill="#090a0f" />
            <line
              x1="91"
              y1="80"
              x2="109"
              y2="80"
              stroke={config.realmIndex === 0 ? "#78716c" : "#eab308"}
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Đôi bàn tay kết Ấn Thiền Định (Dhyana Mudra) trước Đan Điền */}
            <ellipse cx="100" cy="162" rx="7" ry="3.5" fill="#1c1917" stroke="#292524" strokeWidth="0.8" />

            {/* HUYỆT ĐAN ĐIỀN PHÁT SÁNG NHỊP THỞ (Trừ Phàm Nhân) */}
            {config.realmIndex > 0 && (
              <g className="animate-realm-dantian">
                {/* Hào quang đan điền */}
                <circle
                  cx="100"
                  cy="158"
                  r={config.realmIndex >= 8 ? "6.5" : config.realmIndex >= 4 ? "5" : "3.5"}
                  fill={config.themeColor}
                  filter={`url(#${filterId})`}
                  opacity="0.9"
                />
                {/* Tâm điểm linh quang */}
                <circle
                  cx="100"
                  cy="158"
                  r={config.realmIndex >= 8 ? "3" : "2"}
                  fill="#ffffff"
                />
              </g>
            )}
          </g>

          {/* ======================================================== */}
          {/* LỚP 4: HẠT LINH KHÍ NỔI TIÊN GIA (AMBIENT PARTICLES)      */}
          {/* ======================================================== */}
          <g id="ambient-particles" opacity="0.85">
            {Array.from({ length: Math.min(config.ambientParticleCount, 24) }).map((_, idx) => {
              // Tính toán tọa độ phân bố giả lập không gây re-render giật CPU
              const angle = (idx * 37) % 360;
              const rad = (angle * Math.PI) / 180;
              const dist = 35 + ((idx * 23) % 55);
              const px = Math.round(100 + Math.cos(rad) * dist);
              const py = Math.round(140 + Math.sin(rad) * (dist * 0.75));
              const r = 0.8 + ((idx % 4) * 0.4);
              const animDelay = (idx * 0.3) % 3;

              return (
                <circle
                  key={`pt-${idx}`}
                  cx={px}
                  cy={py}
                  r={r}
                  fill={idx % 2 === 0 ? config.themeColor : config.subColor || '#ffffff'}
                  opacity={0.4 + ((idx % 5) * 0.12)}
                  className="animate-realm-mote-1"
                  style={{
                    animationDelay: `${animDelay}s`,
                    animationDuration: `${3 + (idx % 3)}s`
                  }}
                />
              );
            })}
          </g>
        </svg>

        {/* Lớp màng chuyển sắc tối dưới đáy thẻ bài để làm nổi bật nhãn tên */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        {/* Tag Phẩm Cấp & Danh Hiệu Cảnh Giới Đính Ở Đáy */}
        {showBadge && (
          <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between pointer-events-none z-10">
            <span
              className="text-[9px] font-serif font-bold tracking-tight truncate max-w-[90px] drop-shadow"
              style={{ color: config.themeColor }}
            >
              {config.badgeTitle}
            </span>
            <span className="text-[8px] font-mono font-semibold px-1 rounded bg-black/70 border border-white/10 text-zinc-300">
              {config.stageCategory}
            </span>
          </div>
        )}
      </div>

      {/* Tooltip Khí Tượng Tiên Hiệp hiển thị khi rê chuột */}
      {showDescriptionTooltip && showTooltip && (
        <div className="absolute -top-16 z-50 w-52 p-2 rounded-lg bg-black/95 border border-amber-500/40 shadow-2xl backdrop-blur-md text-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[11px] font-serif font-bold" style={{ color: config.themeColor }}>
            {config.realmName}
          </div>
          <p className="text-[10px] text-zinc-300 font-serif italic mt-0.5 leading-tight">
            "{config.description}"
          </p>
        </div>
      )}
    </div>
  );
};

export default RealmVisualAnimation;
