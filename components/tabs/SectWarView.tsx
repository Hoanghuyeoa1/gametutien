// components/tabs/SectWarView.tsx
// Giao Diện "Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại"
// (Sect Wars & Wild Territory Conquest Hub)

import React, { useState, useMemo } from 'react';
import {
  Swords,
  Shield,
  Flag,
  Flame,
  Crown,
  Users,
  Scroll,
  Coins,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  X,
  History,
  Eye,
  Info,
  Zap,
  Target
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  WildSpiritMountain,
  RivalSectFaction,
  SectWarBattleReport,
  SpiritMountainType,
  SectDiplomacyStatus
} from '@/lib/types/sect-war';
import { ProceduralDisciple } from '@/lib/types/custom-sect';
import { useSectWarActions } from '@/hooks/useSectWarActions';
import { WAR_MARCH_COST_LINH_THACH, MIN_WAR_DISCIPLES } from '@/lib/sect-war-logic';

export interface SectWarViewProps {
  player: PlayerStats;
  sectWarActions: ReturnType<typeof useSectWarActions>;
}

// Bảng màu cho các thế lực trên Sa Bàn
const FACTION_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; name: string }> = {
  player_sect: {
    bg: 'fill-amber-950/80',
    border: 'stroke-amber-400',
    text: 'text-amber-300',
    glow: 'rgba(245, 158, 11, 0.4)',
    name: 'Bổn Môn'
  },
  sect_van_kiem: {
    bg: 'fill-cyan-950/80',
    border: 'stroke-cyan-400',
    text: 'text-cyan-300',
    glow: 'rgba(6, 182, 212, 0.4)',
    name: 'Vạn Kiếm Tiên Tông'
  },
  sect_huyet_ma: {
    bg: 'fill-red-950/80',
    border: 'stroke-red-500',
    text: 'text-red-400',
    glow: 'rgba(239, 68, 68, 0.4)',
    name: 'Huyết Ma Giáo'
  },
  sect_thien_co: {
    bg: 'fill-purple-950/80',
    border: 'stroke-purple-400',
    text: 'text-purple-300',
    glow: 'rgba(168, 85, 247, 0.4)',
    name: 'Thiên Cơ Các'
  },
  sect_bach_duoc: {
    bg: 'fill-emerald-950/80',
    border: 'stroke-emerald-400',
    text: 'text-emerald-300',
    glow: 'rgba(16, 185, 129, 0.4)',
    name: 'Bách Dược Cốc'
  },
  neutral: {
    bg: 'fill-zinc-900/80',
    border: 'stroke-zinc-500',
    text: 'text-zinc-400',
    glow: 'rgba(113, 113, 122, 0.3)',
    name: 'Vô Chủ / Trung Lập'
  }
};

const MOUNTAIN_TYPE_INFO: Record<SpiritMountainType, { label: string; icon: string; badge: string }> = {
  herb_mountain: { label: 'Thái Cổ Dược Sơn', icon: '🌿', badge: 'Thảo Dược' },
  ore_vein: { label: 'Linh Thạch Mạch', icon: '💎', badge: 'Linh Thạch' },
  spirit_spring: { label: 'Thiên Địa Linh Tuyền', icon: '✨', badge: 'Tu Vi' },
  ancient_monolith: { label: 'Cổ Bia Trấn Sơn', icon: '🗿', badge: 'Danh Vọng' }
};

export const SectWarView: React.FC<SectWarViewProps> = ({ player, sectWarActions }) => {
  const {
    sectState,
    mountains,
    rivalSects,
    warHistory,
    sectMorale,
    controlledMountainsCount,
    activeReport,
    setActiveReport,
    handleDeclareWar,
    handleStationGarrison,
    handleNegotiateDiplomacy,
    handleHarvestMountains
  } = sectWarActions;

  // Selected mountain for inspection
  const [selectedMountainId, setSelectedMountainId] = useState<string>(mountains[0]?.id || 'mountain_thai_co_duoc');
  
  // War Council Modal state
  const [showWarCouncil, setShowWarCouncil] = useState<boolean>(false);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('');
  const [selectedDisciples, setSelectedDisciples] = useState<string[]>([]);

  // Station garrison modal
  const [showGarrisonModal, setShowGarrisonModal] = useState<boolean>(false);
  const [selectedGarrisonLeaderId, setSelectedGarrisonLeaderId] = useState<string>('');

  // Active sub-tab in Sect War
  const [warSubTab, setWarSubTab] = useState<'map' | 'diplomacy' | 'history'>('map');

  const selectedMountain = useMemo(() => {
    return mountains.find(m => m.id === selectedMountainId) || mountains[0];
  }, [mountains, selectedMountainId]);

  // Danh sách ứng viên Thống Soái (Trưởng lão hoặc Đã xuất sư hoặc Cảnh giới >= 26)
  const candidateLeaders = useMemo(() => {
    if (!sectState?.disciples) return [];
    return sectState.disciples.filter(d => {
      const isElder = d.rank === 'truong_lao';
      const isGraduated = Boolean(d.appointmentData?.isGraduated);
      const isHighRealm = (d.realmIndex || 0) >= 26;
      return (isElder || isGraduated || isHighRealm) && !d.isDispatchedToWar;
    });
  }, [sectState?.disciples]);

  // Danh sách đệ tử sẵn sàng xuất chiến (không bị khóa viễn chinh)
  const availableTroops = useMemo(() => {
    if (!sectState?.disciples) return [];
    return sectState.disciples.filter(d => !d.isDispatchedToWar);
  }, [sectState?.disciples]);

  // Tự động chọn thống soái đầu tiên khi mở War Council nếu chưa chọn
  const openWarCouncil = (mId: string) => {
    setSelectedMountainId(mId);
    if (candidateLeaders.length > 0 && !selectedLeaderId) {
      setSelectedLeaderId(candidateLeaders[0].id);
    }
    // Mặc định chọn 10 đệ tử đầu tiên
    const defaultIds = availableTroops.slice(0, 12).map(d => d.id);
    setSelectedDisciples(defaultIds);
    setShowWarCouncil(true);
  };

  // Tính toán tỷ lệ dự toán chiến thắng
  const winOddsEstimate = useMemo(() => {
    if (!selectedMountain) return { winRate: 50, playerPower: 0, rivalPower: 0 };
    const leader = sectState?.disciples.find(d => d.id === selectedLeaderId);
    const leaderPower = leader?.stats.combatPower || 50_000;
    const troopsPower = selectedDisciples.reduce((sum, id) => {
      const d = sectState?.disciples.find(disc => disc.id === id);
      return sum + (d?.stats.combatPower || 10_000);
    }, 0);
    const totalPower = (leaderPower + troopsPower) * (sectMorale / 100);
    const rivalPower = selectedMountain.stationedGarrison?.combatPower || 300_000;
    const ratio = totalPower / Math.max(1, rivalPower);
    const winRate = Math.min(95, Math.max(5, Math.round(ratio * 55)));
    return { winRate, playerPower: Math.round(totalPower), rivalPower };
  }, [selectedMountain, selectedLeaderId, selectedDisciples, sectState?.disciples, sectMorale]);

  // Toggle chọn đệ tử xuất chiến
  const toggleSelectDisciple = (id: string) => {
    setSelectedDisciples(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllDisciples = () => {
    setSelectedDisciples(availableTroops.map(d => d.id));
  };

  const executeWar = () => {
    if (!selectedMountain) return;
    const res = handleDeclareWar(selectedMountain.id, selectedLeaderId, selectedDisciples);
    if (res.success) {
      setShowWarCouncil(false);
    }
  };

  const executeStationGarrison = () => {
    if (!selectedMountain || !selectedGarrisonLeaderId) return;
    handleStationGarrison(selectedMountain.id, selectedGarrisonLeaderId);
    setShowGarrisonModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ===================================================================== */}
      {/* 1. HEADER TÔNG MÔN ĐẠI CHIẾN & CHỈ SỐ QUÂN CƠ */}
      {/* ===================================================================== */}
      <div className="p-5 rounded-2xl border-2 border-amber-600/60 bg-gradient-to-r from-red-950/40 via-amber-950/40 to-black/90 shadow-[0_0_35px_rgba(239,68,68,0.2)] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-red-950/80 border border-red-600 text-red-300 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-red-400" />
              <span>TRANH ĐOẠT LINH SƠN DÃ NGOẠI</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-amber-300 bg-amber-950/50 border border-amber-800 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              Sĩ Khí Bổn Môn: <strong>{sectMorale}%</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-red-200 to-amber-300 tracking-wide">
            【Sa Bàn Vạn Dặm • Chinh Chiến Dã Ngoại】
          </h1>
          <p className="text-xs text-zinc-300 font-serif">
            Chiếm lĩnh linh sơn tài nguyên • Thảo phạt môn phái lân bang • Thu gom cống phẩm thiên hạ
          </p>
        </div>

        {/* THỐNG KÊ CHIẾN CỤC */}
        <div className="flex items-center gap-3">
          <div className="text-center p-3 rounded-xl bg-black/60 border border-amber-900/40 min-w-[110px]">
            <span className="text-[10px] text-zinc-400 font-serif block">LINH SƠN CHIẾM GIỮ</span>
            <span className="text-xl font-mono font-bold text-amber-300">
              {controlledMountainsCount} / {mountains.length}
            </span>
          </div>
          <div className="text-center p-3 rounded-xl bg-black/60 border border-amber-900/40 min-w-[120px]">
            <span className="text-[10px] text-zinc-400 font-serif block">THẾ LỰC LÂN BANG</span>
            <span className="text-xl font-mono font-bold text-cyan-300">
              {rivalSects.length} Đại Tông
            </span>
          </div>
          {controlledMountainsCount > 0 && (
            <button
              type="button"
              onClick={handleHarvestMountains}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-serif text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thu Hoạch Sản Lượng</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. SUB-TABS: SA BÀN / NGOẠI GIAO / LỊCH SỬ CHIẾN BÁO */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setWarSubTab('map')}
          className={`px-4 py-2 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            warSubTab === 'map'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>🗺️ Sa Bàn Cương Vực (Linh Sơn)</span>
        </button>

        <button
          type="button"
          onClick={() => setWarSubTab('diplomacy')}
          className={`px-4 py-2 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            warSubTab === 'diplomacy'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>📜 Sách Lược Ngoại Giao ({rivalSects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setWarSubTab('history')}
          className={`px-4 py-2 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            warSubTab === 'history'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>⚔️ Lịch Sử Chiến Báo ({warHistory.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 3. SUB-TAB 1: SA BÀN CƯƠNG VỰC (TERRITORY HEX MAP) */}
      {/* ===================================================================== */}
      {warSubTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SA BÀN VECTOR SVG CỔ PHONG (8 CỘT) */}
          <div className="lg:col-span-8 p-5 rounded-2xl border border-zinc-800 bg-[#0a0a0f] relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <h3 className="text-sm font-serif font-bold text-amber-200">
                  Sa Bàn Linh Mạch Dã Ngoại (Cửu Châu Cương Thổ)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Nhấp vào Linh Sơn để thẩm tra & hạ lệnh
              </span>
            </div>

            {/* BẢN ĐỒ SVG */}
            <div className="w-full aspect-[16/10] bg-gradient-to-b from-[#0b0c14] to-black rounded-xl border border-zinc-900 flex items-center justify-center p-4 relative">
              {/* Lưới tọa độ cổ phong */}
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

              <svg viewBox="0 0 800 500" className="w-full h-full">
                <defs>
                  <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Đường liên kết các Linh Sơn */}
                <g className="stroke-zinc-800/70" strokeWidth="2" strokeDasharray="4,4">
                  <line x1="200" y1="180" x2="400" y2="250" />
                  <line x1="400" y1="250" x2="600" y2="180" />
                  <line x1="400" y1="250" x2="200" y2="340" />
                  <line x1="400" y1="250" x2="600" y2="340" />
                  <line x1="400" y1="250" x2="400" y2="100" />
                  <line x1="200" y1="180" x2="400" y2="100" />
                  <line x1="600" y1="180" x2="400" y2="100" />
                </g>

                {/* CÁC CỨ ĐIỂM LINH SƠN (6 ĐIỂM) */}
                {mountains.map((mountain, idx) => {
                  // Bản đồ tọa độ 6 điểm
                  const coords: Record<string, { cx: number; cy: number }> = {
                    mountain_thai_co_duoc: { cx: 200, cy: 180 },
                    mountain_cuc_pham_khoang: { cx: 400, cy: 100 },
                    mountain_thien_dia_tuyen: { cx: 400, cy: 250 },
                    mountain_thien_kiem_phong: { cx: 600, cy: 180 },
                    mountain_huyet_ma_coc: { cx: 200, cy: 340 },
                    mountain_thien_co_dai: { cx: 600, cy: 340 }
                  };
                  const pos = coords[mountain.id] || { cx: 200 + idx * 80, cy: 200 };
                  const isSelected = selectedMountainId === mountain.id;
                  const factionStyle = FACTION_COLORS[mountain.controllingSectId] || FACTION_COLORS.neutral;
                  const typeInfo = MOUNTAIN_TYPE_INFO[mountain.type];

                  return (
                    <g
                      key={mountain.id}
                      onClick={() => setSelectedMountainId(mountain.id)}
                      className="cursor-pointer transition-all duration-300 group"
                    >
                      {/* Vòng tỏa sáng khi chọn */}
                      {isSelected && (
                        <circle
                          cx={pos.cx}
                          cy={pos.cy}
                          r="48"
                          fill="none"
                          stroke={mountain.controllingSectId === 'player_sect' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          className="animate-spin-slow opacity-80"
                        />
                      )}

                      {/* Nền cứ điểm lục giác hoặc tròn */}
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r="36"
                        className={`${factionStyle.bg} ${factionStyle.border} transition group-hover:scale-110`}
                        strokeWidth={isSelected ? '3.5' : '2'}
                        style={{
                          filter: isSelected ? 'drop-shadow(0 0 16px rgba(245,158,11,0.6))' : undefined
                        }}
                      />

                      {/* Icon Loại hình */}
                      <text
                        x={pos.cx}
                        y={pos.cy - 6}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="20"
                        className="select-none pointer-events-none"
                      >
                        {typeInfo.icon}
                      </text>

                      {/* Tên Linh Sơn */}
                      <text
                        x={pos.cx}
                        y={pos.cy + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fill="#fef08a"
                        className="select-none pointer-events-none font-serif tracking-wide"
                      >
                        {mountain.name}
                      </text>

                      {/* Phẩm cấp Tier badge */}
                      <rect
                        x={pos.cx + 18}
                        y={pos.cy - 34}
                        width="26"
                        height="16"
                        rx="8"
                        fill="#000000"
                        stroke="#f59e0b"
                        strokeWidth="1"
                      />
                      <text
                        x={pos.cx + 31}
                        y={pos.cy - 25}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#fbbf24"
                        className="font-mono"
                      >
                        T{mountain.tier}
                      </text>

                      {/* Cờ kiểm soát */}
                      <text
                        x={pos.cx}
                        y={pos.cy + 52}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fill="#9ca3af"
                        className="select-none pointer-events-none font-mono"
                      >
                        [{factionStyle.name}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* CHÚ GIẢI MÀU SẮC PHE PHÁI */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-900 text-[11px] font-mono">
              <span className="text-zinc-500 font-serif">Phe Kiểm Soát:</span>
              {Object.entries(FACTION_COLORS).map(([key, item]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full border ${item.border}`} style={{ backgroundColor: item.glow }} />
                  <span className="text-zinc-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHI TIẾT CỨ ĐIỂM ĐƯỢC CHỌN (4 CỘT) */}
          <div className="lg:col-span-4 p-5 rounded-2xl border border-zinc-800 bg-[#0e0e14] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Header Cứ Điểm */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 block">
                    GIAI {selectedMountain.tier} • {MOUNTAIN_TYPE_INFO[selectedMountain.type].badge}
                  </span>
                  <h3 className="text-lg font-serif font-black text-amber-200">
                    {selectedMountain.name}
                  </h3>
                </div>
                <div className="text-3xl">
                  {MOUNTAIN_TYPE_INFO[selectedMountain.type].icon}
                </div>
              </div>

              {/* Mô tả phong thủy */}
              <p className="text-xs text-zinc-400 font-serif leading-relaxed italic bg-black/40 p-2.5 rounded-xl border border-zinc-900">
                "{selectedMountain.description}"
              </p>

              {/* Thông số phòng thủ & lực trấn thủ */}
              <div className="space-y-2 text-xs font-serif">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      Độ Bền Hộ Sơn Cổ Trận:
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {selectedMountain.defenseArrayHp.toLocaleString()} / {selectedMountain.maxDefenseArrayHp.toLocaleString()}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full transition-all"
                      style={{
                        width: `${Math.round((selectedMountain.defenseArrayHp / selectedMountain.maxDefenseArrayHp) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      Lực Lượng Trấn Thủ:
                    </span>
                    <span className="font-mono text-amber-300 font-bold">
                      {selectedMountain.stationedGarrison?.combatPower.toLocaleString()} CP
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Thống Soái: <strong className="text-zinc-300">{selectedMountain.stationedGarrison?.leaderName || 'Vô Danh'}</strong></span>
                    <span>Quân số: <strong className="text-zinc-300">{selectedMountain.stationedGarrison?.discipleCount} đệ tử</strong></span>
                  </div>
                </div>

                {/* Sản lượng mỗi ngày */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
                  <span className="text-[10px] text-amber-400 font-mono block">SẢN LƯỢNG KHAI THÁC MỖI NGÀY:</span>
                  <div className="space-y-1 text-xs text-zinc-300 font-mono">
                    {selectedMountain.baseOutput.spiritStonesPerDay && (
                      <div className="flex items-center justify-between">
                        <span>💎 Linh Thạch:</span>
                        <strong className="text-amber-300">+{selectedMountain.baseOutput.spiritStonesPerDay.toLocaleString()} / ngày</strong>
                      </div>
                    )}
                    {selectedMountain.baseOutput.sectExpPerDay && (
                      <div className="flex items-center justify-between">
                        <span>📜 Danh Vọng:</span>
                        <strong className="text-yellow-400">+{selectedMountain.baseOutput.sectExpPerDay} / ngày</strong>
                      </div>
                    )}
                    {selectedMountain.baseOutput.herbsPerDay?.map(h => (
                      <div key={h.name} className="flex items-center justify-between">
                        <span>🌿 {h.name}:</span>
                        <strong className="text-emerald-400">+{h.amount} / ngày</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* THAO TÁC CÔNG PHẠT HOẶC TRẤN THỦ */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              {selectedMountain.controllingSectId === 'player_sect' ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 text-xs text-center font-serif flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Linh Sơn này thuộc quyền kiểm soát của Bổn Môn!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGarrisonModal(true)}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-200 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>🛡️ Điều Động Trấn Sơn Trưởng Lão</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openWarCouncil(selectedMountain.id)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-amber-600 to-red-700 hover:from-red-600 hover:to-amber-500 text-white text-xs font-serif font-black tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
                >
                  <Swords className="w-4 h-4" />
                  <span>🚩 PHÁT ĐỘNG THẢO PHẠT ĐẠI CHIẾN</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SUB-TAB 2: SÁCH LƯỢC NGOẠI GIAO (DIPLOMACY PANEL) */}
      {/* ===================================================================== */}
      {warSubTab === 'diplomacy' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e0e14] text-xs text-zinc-300 font-serif leading-relaxed">
            Môn phái lân bang có tính cách, trường phái và tôn chỉ khác nhau. Vận dụng sách lược ngoại giao để tránh đại chiến lưỡng bại câu thương, hoặc liên thủ diệt trừ Ma Đạo để mở rộng cương vực.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rivalSects.map(sect => {
              const statusColors: Record<SectDiplomacyStatus, { text: string; bg: string; border: string; label: string }> = {
                allied: { text: 'text-emerald-300', bg: 'bg-emerald-950/50', border: 'border-emerald-600', label: 'Đồng Minh Hữu Hảo' },
                neutral: { text: 'text-zinc-300', bg: 'bg-zinc-900', border: 'border-zinc-700', label: 'Bình Thường (Trung Lập)' },
                hostile: { text: 'text-amber-400', bg: 'bg-amber-950/50', border: 'border-amber-600', label: 'Căng Thẳng' },
                at_war: { text: 'text-red-400', bg: 'bg-red-950/60', border: 'border-red-600', label: 'Huyết Chiến Khai Đao' }
              };
              const statusCfg = statusColors[sect.diplomacy] || statusColors.neutral;

              return (
                <div
                  key={sect.id}
                  className="p-5 rounded-2xl border border-zinc-800 bg-[#0e0e14] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{sect.crestIcon || '🚩'}</span>
                        <div>
                          <h4 className="text-sm font-serif font-black text-amber-200">
                            {sect.name}
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400">
                            Tông Chủ: <strong className="text-zinc-200">{sect.leaderName}</strong> ({sect.leaderTitle})
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-serif font-bold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                        {statusCfg.label}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-serif italic bg-black/40 p-2 rounded-lg border border-zinc-900">
                      "{sect.motto}"
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="p-2 rounded-lg bg-black/50 border border-zinc-900">
                        <span className="text-[10px] text-zinc-500 block">CHIẾN LỰC TỔNG:</span>
                        <span className="text-amber-300 font-bold">{sect.totalCombatPower.toLocaleString()} CP</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/50 border border-zinc-900">
                        <span className="text-[10px] text-zinc-500 block">DANH VỌNG:</span>
                        <span className="text-yellow-400 font-bold">{sect.reputation.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* CÁC THAO TÁC NGOẠI GIAO */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleNegotiateDiplomacy(sect.id, 'truce')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-serif text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      🤝 Đình Chiến
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNegotiateDiplomacy(sect.id, 'bribe')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-serif text-amber-300 hover:text-amber-200 transition cursor-pointer"
                    >
                      🎁 Đút Lót (5v)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNegotiateDiplomacy(sect.id, 'alliance')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/60 text-[11px] font-serif text-emerald-300 transition cursor-pointer"
                    >
                      📜 Kết Minh (10v)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNegotiateDiplomacy(sect.id, 'declare_war')}
                      className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-[11px] font-serif text-red-300 transition cursor-pointer"
                    >
                      ⚔️ Tuyên Chiến
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SUB-TAB 3: LỊCH SỬ CHIẾN BÁO (WAR HISTORY) */}
      {/* ===================================================================== */}
      {warSubTab === 'history' && (
        <div className="space-y-4">
          {warHistory.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-[#0e0e14] space-y-3">
              <Scroll className="w-12 h-12 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-serif font-bold text-zinc-400">
                Chưa có ghi chép thảo phạt nào
              </h4>
              <p className="text-xs text-zinc-500 font-serif">
                Hãy cử quân đoàn viễn chinh tranh đoạt các cứ điểm Linh Sơn dã ngoại để lưu danh sử sách!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {warHistory.map(report => (
                <div
                  key={report.warId}
                  onClick={() => setActiveReport(report)}
                  className="p-4 rounded-xl border border-zinc-800 bg-[#0e0e14] hover:border-amber-600/60 transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${
                      report.overallWinner === 'player'
                        ? 'bg-amber-950/50 border-amber-600 text-amber-300'
                        : 'bg-red-950/50 border-red-600 text-red-300'
                    }`}>
                      <Swords className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-serif font-bold text-amber-200">
                          Thảo Phạt 【{report.targetMountainName}】 ({report.rivalSectName})
                        </h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          report.overallWinner === 'player'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-red-950 text-red-300 border border-red-700'
                        }`}>
                          {report.overallWinner === 'player' ? 'ĐẠI THẮNG' : 'THẤT BẠI'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        Thương vong: <strong className="text-zinc-200">{report.playerCasualtiesTotal} đệ tử</strong> • Danh vọng: <strong className={report.reputationDelta > 0 ? 'text-emerald-400' : 'text-red-400'}>{report.reputationDelta > 0 ? `+${report.reputationDelta}` : report.reputationDelta}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-serif text-amber-400">
                    <span>Xem Chiến Báo</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. MODAL BẢNG QUÂN CƠ VIỄN CHINH (WAR COUNCIL MODAL) */}
      {/* ===================================================================== */}
      {showWarCouncil && selectedMountain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-2xl w-full p-6 rounded-2xl border-2 border-red-600/60 bg-gradient-to-b from-[#131118] via-[#0e0e14] to-black shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-serif font-black text-amber-200">
                  Bảng Quân Cơ Viễn Chinh • Thảo Phạt 【{selectedMountain.name}】
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWarCouncil(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BƯỚC 1: CHỌN THỐNG SOÁI */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-amber-300 flex items-center justify-between">
                <span>1. Chỉ Định Thống Soái Xuất Chinh (Trưởng Lão / Xuất Sư):</span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Có {candidateLeaders.length} ứng viên
                </span>
              </label>

              {candidateLeaders.length === 0 ? (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/60 text-red-300 text-xs font-serif">
                  ⚠️ Chưa có Trưởng Lão hoặc Đệ Tử/Tiên Đồng xuất sư (Hóa Thần Kỳ) sẵn sàng để thống soái quân đoàn!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {candidateLeaders.map(c => {
                    const isSelected = selectedLeaderId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedLeaderId(c.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'border-zinc-800 bg-black/40 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-serif font-bold text-amber-200">{c.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {c.rank === 'truong_lao' ? 'Trưởng Lão' : 'Xuất Sư'} • {c.realmName}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {c.stats.combatPower.toLocaleString()} CP
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BƯỚC 2: CHỌN ĐỆ TỬ QUÂN ĐOÀN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-serif font-bold text-amber-300">
                  2. Tuyển Chọn Đệ Tử Quân Đoàn (Đã chọn: {selectedDisciples.length} / Tối thiểu {MIN_WAR_DISCIPLES}):
                </label>
                <button
                  type="button"
                  onClick={selectAllDisciples}
                  className="text-[11px] font-mono text-amber-400 hover:underline cursor-pointer"
                >
                  Chọn Toàn Bộ ({availableTroops.length})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-zinc-800">
                {availableTroops.map(d => {
                  const isChecked = selectedDisciples.includes(d.id);
                  return (
                    <div
                      key={d.id}
                      onClick={() => toggleSelectDisciple(d.id)}
                      className={`p-2 rounded-lg border text-xs transition cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-amber-500 bg-amber-950/30 text-amber-200'
                          : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="truncate">{d.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {Math.round(d.stats.combatPower / 1000)}k
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DỰ TOÁN CHIẾN CỤC & TỶ LỆ THẮNG */}
            <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-serif">
                <span>Dự Toán Chiến Lực Quân Đoàn:</span>
                <span className="font-mono text-amber-300 font-bold">{winOddsEstimate.playerPower.toLocaleString()} CP</span>
              </div>
              <div className="flex items-center justify-between text-xs font-serif">
                <span>Chiến Lực Quân Phòng Thủ:</span>
                <span className="font-mono text-red-400 font-bold">{winOddsEstimate.rivalPower.toLocaleString()} CP</span>
              </div>
              <div className="flex items-center justify-between text-xs font-serif">
                <span>Lộ Phí Hành Quân Bắt Buộc:</span>
                <span className="font-mono text-yellow-400 font-bold">{WAR_MARCH_COST_LINH_THACH.toLocaleString()} Linh Thạch</span>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-zinc-300">Xác Suất Đại Thắng Dự Kiến:</span>
                <span className={`text-base font-mono font-black ${
                  winOddsEstimate.winRate >= 70 ? 'text-emerald-400' : winOddsEstimate.winRate >= 45 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {winOddsEstimate.winRate}%
                </span>
              </div>
            </div>

            {/* NÚT XUẤT CHINH */}
            <button
              type="button"
              onClick={executeWar}
              disabled={selectedDisciples.length < MIN_WAR_DISCIPLES || !selectedLeaderId}
              className={`w-full py-3.5 rounded-xl font-serif text-sm font-black tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedDisciples.length >= MIN_WAR_DISCIPLES && selectedLeaderId
                  ? 'bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] active:scale-95'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>🚩 KHAI ĐAO THẢO PHẠT (TIÊU HAO 10,000 LT)</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. MODAL BỔ NHIỆM TRẤN SƠN TRƯỞNG LÃO */}
      {/* ===================================================================== */}
      {showGarrisonModal && selectedMountain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full p-6 rounded-2xl border-2 border-amber-600/60 bg-[#0e0e14] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-serif font-bold text-amber-200">
                Bổ Nhiệm Trấn Thủ • 【{selectedMountain.name}】
              </h3>
              <button
                type="button"
                onClick={() => setShowGarrisonModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-serif">
              Cử Trưởng Lão hoặc Tiên Đồng xuất sư dẫn dắt quân đồn trú bảo vệ cứ điểm trước sự nhòm ngó của các thế lực thù địch.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {candidateLeaders.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedGarrisonLeaderId(c.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedGarrisonLeaderId === c.id
                      ? 'border-amber-400 bg-amber-950/40'
                      : 'border-zinc-800 bg-black/40 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-serif text-amber-200">{c.name}</span>
                  <span className="text-xs font-mono text-zinc-400">{c.stats.combatPower.toLocaleString()} CP</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={executeStationGarrison}
              disabled={!selectedGarrisonLeaderId}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-serif text-xs font-bold transition disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer"
            >
              Xác Nhận Phong Trấn Sơn Trưởng Lão
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. CHIẾN BÁO TAM TRỌNG ĐOÁN ANIMATED MODAL */}
      {/* ===================================================================== */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
          <div className="max-w-2xl w-full p-6 rounded-2xl border-2 border-amber-600 bg-gradient-to-b from-[#181116] via-[#0f0e15] to-black shadow-[0_0_60px_rgba(245,158,11,0.35)] space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header Chiến Báo */}
            <div className="text-center space-y-1 border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                CHIẾN BÁO TAM TRỌNG ĐOÁN
              </span>
              <h2 className={`text-2xl font-serif font-black ${
                activeReport.overallWinner === 'player'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100'
                  : 'text-red-400'
              }`}>
                {activeReport.overallWinner === 'player' ? '🎉 THẢO PHẠT ĐẠI THẮNG!' : '⚠️ THẢO PHẠT BẤT THÀNH!'}
              </h2>
              <p className="text-xs font-serif text-zinc-400">
                Chiến trường: <strong className="text-amber-200">{activeReport.targetMountainName}</strong> • Đối thủ: <strong className="text-zinc-200">{activeReport.rivalSectName}</strong>
              </p>
            </div>

            {/* DIỄN BIẾN 3 HIỆP TAM TRỌNG ĐOÁN */}
            <div className="space-y-3">
              {activeReport.stages.map((stage, idx) => (
                <div
                  key={stage.stage}
                  className={`p-3.5 rounded-xl border space-y-1.5 transition ${
                    stage.winner === 'player'
                      ? 'border-amber-600/50 bg-amber-950/20'
                      : 'border-red-900/60 bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-serif font-bold">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      Hiệp {idx + 1}: {stage.stage === 'array_breach' ? 'Công Phá Đại Trận Hộ Sơn' : stage.stage === 'champion_duel' ? 'Đấu Tướng Lôi Đài 1v1' : 'Quân Đoàn Hỗn Chiến'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      stage.winner === 'player'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-red-950 text-red-300 border border-red-700'
                    }`}>
                      {stage.winner === 'player' ? 'THẮNG' : 'THẤT THẾ'}
                    </span>
                  </div>
                  <p className="text-xs font-serif text-zinc-300 leading-relaxed">
                    {stage.log}
                  </p>
                </div>
              ))}
            </div>

            {/* TỔNG KẾT CHIẾN LỢI PHẨM & TỔN THẤT */}
            <div className="p-4 rounded-xl bg-black/70 border border-amber-900/40 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-zinc-900/60">
                  <span className="text-[10px] text-zinc-500 block">THƯƠNG VONG:</span>
                  <span className="text-red-400 font-bold">{activeReport.playerCasualtiesTotal} đệ tử</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60">
                  <span className="text-[10px] text-zinc-500 block">SĨ KHÍ:</span>
                  <span className={activeReport.moraleDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {activeReport.moraleDelta >= 0 ? `+${activeReport.moraleDelta}` : activeReport.moraleDelta}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/60">
                  <span className="text-[10px] text-zinc-500 block">DANH VỌNG:</span>
                  <span className={activeReport.reputationDelta >= 0 ? 'text-amber-300 font-bold' : 'text-red-400 font-bold'}>
                    {activeReport.reputationDelta >= 0 ? `+${activeReport.reputationDelta}` : activeReport.reputationDelta}
                  </span>
                </div>
              </div>

              {activeReport.overallWinner === 'player' && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/60 text-xs font-serif space-y-1">
                  <span className="text-[10px] text-amber-300 font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    CHIẾN LỢI PHẨM THU ĐƯỢC:
                  </span>
                  <div className="text-amber-200 font-mono text-xs">
                    💎 Linh Thạch: +{activeReport.capturedResources.spiritStones.toLocaleString()}
                  </div>
                  {activeReport.capturedResources.rareItems?.map((item, idx) => (
                    <div key={idx} className="text-emerald-300 font-mono text-[11px]">
                      🎁 {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nút đóng */}
            <button
              type="button"
              onClick={() => setActiveReport(null)}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-serif text-xs font-bold transition cursor-pointer active:scale-95"
            >
              Thu Quân Bế Quan (Đóng Chiến Báo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
