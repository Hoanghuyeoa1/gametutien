'use client';
// components/cosmic/CosmicMapModal.tsx
// Sa Bàn Tinh Không Node-based — 100% Procedural SVG + CSS Keyframes
// Zero external assets: tinh vân, tinh lộ, tinh cầu, phi thuyền đều là SVG/CSS
// Tích hợp: Vực Ngoại Dị Tộc Tập Kích & Xây Dựng Cứ Điểm Tinh Hải (Cosmic Invasions & Star Fortification)

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Rocket,
  Swords,
  Package,
  ChevronUp,
  Hammer,
  Star,
  Navigation,
  X,
  Zap,
  Clock,
  Shield,
  BarChart2,
  AlertTriangle,
  Radio,
  UserCheck,
  GraduationCap,
} from 'lucide-react';
import type { PlayerStats } from '@/lib/types/player';
import type { CosmicNode, CosmicSectorId } from '@/lib/types/cosmic-map';
import type { FortificationType, GarrisonType, IncursionThreatLevel } from '@/lib/types/cosmic-defense';
import { useCosmicMapActions } from '@/hooks/useCosmicMapActions';
import { useCosmicDefenseActions } from '@/hooks/useCosmicDefenseActions';
import { useSectorResonanceActions } from '@/hooks/useSectorResonanceActions';
import { calculateCosmicDistance } from '@/lib/sector-resonance-logic';
import { COSMIC_NODES, COSMIC_NODES_MAP } from '@/lib/cosmic-map-data';
import { FORTIFICATION_CONFIGS, THREAT_LEVEL_CONFIG } from '@/lib/cosmic-defense-data';
import { DiscipleAppointmentModal } from '@/components/modals/DiscipleAppointmentModal';
import { appointDiscipleRole, recallDiscipleRole } from '@/lib/disciple-appointment-logic';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

// ─── Sector Color Palettes ────────────────────────────────────────────────────

const SECTOR_COLORS: Record<CosmicSectorId, { bg: string; glow: string; line: string; node: string; label: string }> = {
  thai_vi: { bg: '#0a1628', glow: '#3b82f6', line: '#60a5fa', node: '#93c5fd', label: 'Thái Vi Tinh Vực' },
  tu_vi:   { bg: '#1a0a28', glow: '#a855f7', line: '#c084fc', node: '#d8b4fe', label: 'Tử Vi Tinh Viên' },
  hon_don: { bg: '#1a0808', glow: '#ef4444', line: '#f87171', node: '#fca5a5', label: 'Hỗn Độn Phế Khư' },
};

const NODE_TYPE_ICONS: Record<string, string> = {
  star_core: '⭐',
  mineral_vein: '💎',
  ruins: '🏛️',
  space_rift: '🌀',
  station: '🏯',
};

// ─── Procedural SVG Background (Tinh Vân) ────────────────────────────────────

function CosmicBackground({ svgW, svgH }: { svgW: number; svgH: number }) {
  return (
    <>
      {/* Thái Vi — Lam */}
      <ellipse cx="20%" cy="45%" rx="18%" ry="14%" fill="#1d3a6a" fillOpacity="0.45" />
      {/* Tử Vi — Tím */}
      <ellipse cx="60%" cy="60%" rx="20%" ry="16%" fill="#3b0764" fillOpacity="0.4" />
      {/* Hỗn Độn — Đỏ đen */}
      <ellipse cx="80%" cy="65%" rx="18%" ry="14%" fill="#450a0a" fillOpacity="0.55" />
      {/* Biên giới tinh vực */}
      <line x1="39%" y1="0" x2="39%" y2="100%" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.35" />
      <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#3b1a5a" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.35" />
      {/* Điểm sao nền ngẫu nhiên (procedural) */}
      {Array.from({ length: 80 }, (_, i) => {
        const px = ((i * 137.5) % 100).toFixed(1);
        const py = ((i * 97.3 + 13) % 100).toFixed(1);
        const r = (0.8 + (i % 5) * 0.3).toFixed(1);
        const op = (0.2 + (i % 7) * 0.08).toFixed(2);
        return <circle key={i} cx={`${px}%`} cy={`${py}%`} r={r} fill="white" opacity={op} />;
      })}
    </>
  );
}

// ─── Particle Effect trên Tinh Lộ ─────────────────────────────────────────────

function StarLaneParticle({ x1, y1, x2, y2, color, delay }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay: number;
}) {
  return (
    <circle r="2" fill={color} opacity="0.7">
      <animateMotion
        dur={`${3 + delay}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={`M${x1},${y1} L${x2},${y2}`}
      />
      <animate attributeName="opacity" values="0;0.8;0" dur={`${3 + delay}s`} repeatCount="indefinite" begin={`${delay}s`} />
    </circle>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────────

interface CosmicMapModalProps {
  player: PlayerStats;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onShowToast?: (msg: string) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
  onClose: () => void;
}

export default function CosmicMapModal({
  player,
  onUpdatePlayer,
  onShowToast,
  onAddLog,
  onClose,
}: CosmicMapModalProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'forge' | 'logs'>('map');
  const [drawerSubTab, setDrawerSubTab] = useState<'info' | 'defense' | 'resonance'>('info');
  const [garrisonModalOpen, setGarrisonModalOpen] = useState(false);
  const [discipleAppointmentModalOpen, setDiscipleAppointmentModalOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDims, setSvgDims] = useState({ w: 800, h: 500 });

  const handleAppointDiscipleToNode = (discipleId: string) => {
    if (!selectedNode) return;
    const res = appointDiscipleRole(player, discipleId, 'tinh_hai_guardian', selectedNode.id);
    if (!res.success) {
      onShowToast?.(`⚠️ ${res.message}`);
      return;
    }
    const normalized = normalizePlayerData(res.updatedPlayer);
    onUpdatePlayer?.(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    onShowToast?.(`🌌 ${res.message}`);
    setDiscipleAppointmentModalOpen(false);
  };

  const handleRecallDiscipleFromNode = (discipleId: string) => {
    const res = recallDiscipleRole(player, discipleId);
    if (!res.success) {
      onShowToast?.(`⚠️ ${res.message}`);
      return;
    }
    const normalized = normalizePlayerData(res.updatedPlayer);
    onUpdatePlayer?.(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    onShowToast?.(`📜 ${res.message}`);
  };

  // 1. Hook bản đồ và du hành
  const {
    cosmicState,
    currentNode,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    isTraveling,
    travelProgressPercent,
    isBattleModalOpen,
    setIsBattleModalOpen,
    lastBattleResult,
    yieldPerHour,
    cargoPercent,
    tier9Recipes,
    handleInitiateTravel,
    handleAttackNodeGuardian,
    handleHarvestAllVeins,
    handleCraftTier9,
    getNodeStatus,
    canCraftTier9,
  } = useCosmicMapActions({
    player,
    setPlayer: onUpdatePlayer ? (updater) => {
      const next = typeof updater === 'function' ? updater(player) : updater;
      onUpdatePlayer(next);
    } : undefined,
    showToast: onShowToast,
    addLog: onAddLog,
  });

  // 2. Hook phòng thủ cứ điểm & tập kích Dị Tộc
  const {
    defenseState,
    activeIncursions,
    incursionByNodeId,
    urgentIncursion,
    isDefenseModalOpen,
    setIsDefenseModalOpen,
    lastDefenseReport,
    isFiringLaser,
    tickerNow,
    handleUpgradeFortification,
    handleAssignGarrison,
    handleResolveSimulatedDefense,
    handleManualInterception,
    handleTriggerTestIncursion,
    getNodeFortification,
    getEffectiveDefensePower,
    canUpgradeFort,
  } = useCosmicDefenseActions({
    player,
    setPlayer: onUpdatePlayer ? (updater) => {
      const next = typeof updater === 'function' ? updater(player) : updater;
      onUpdatePlayer(next);
    } : undefined,
    showToast: onShowToast,
    addLog: onAddLog,
  });

  // 3. Hook Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense)
  const {
    resonanceLinks,
    activeAuras,
    hasTriangle,
    crossFireEnergyBuffer,
    isBombarding,
    lastResonanceResult,
    checkLinkEstablishment,
    handleToggleLink,
    handleUpgradeGridTransmission,
    handleManualBombardment,
  } = useSectorResonanceActions({
    player,
    setPlayer: onUpdatePlayer ? (updater) => {
      const next = typeof updater === 'function' ? updater(player) : updater;
      onUpdatePlayer(next);
    } : undefined,
    showToast: onShowToast,
    addLog: onAddLog,
  });

  // Responsive SVG size
  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSvgDims({ w: rect.width || 800, h: rect.height || 500 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Build edges list (dedup)
  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ from: CosmicNode; to: CosmicNode }> = [];
    for (const node of COSMIC_NODES) {
      for (const connId of node.connectedNodeIds) {
        const key = [node.id, connId].sort().join('|');
        if (!seen.has(key)) {
          seen.add(key);
          const toNode = COSMIC_NODES.find(n => n.id === connId);
          if (toNode) result.push({ from: node, to: toNode });
        }
      }
    }
    return result;
  }, []);

  // Vessel position (interpolate along travel path)
  const vesselPos = useMemo(() => {
    if (!isTraveling || !cosmicState.travelingToNodeId) {
      const n = COSMIC_NODES.find(n => n.id === cosmicState.currentNodeId);
      return { x: n?.x ?? 15, y: n?.y ?? 50 };
    }
    const from = COSMIC_NODES.find(n => n.id === cosmicState.currentNodeId);
    const to = COSMIC_NODES.find(n => n.id === cosmicState.travelingToNodeId);
    if (!from || !to) return { x: 15, y: 50 };
    const t = travelProgressPercent / 100;
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  }, [isTraveling, travelProgressPercent, cosmicState.currentNodeId, cosmicState.travelingToNodeId]);

  const toSvgX = (pct: number) => (pct / 100) * svgDims.w;
  const toSvgY = (pct: number) => (pct / 100) * svgDims.h;

  // Format đếm ngược thời gian
  const formatCountdown = (targetTime: number) => {
    const diff = Math.max(0, Math.floor((targetTime - tickerNow) / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedNodeOccupied = selectedNode && cosmicState.occupiedNodeIds.includes(selectedNode.id);
  const selectedNodeIncursion = selectedNode ? incursionByNodeId.get(selectedNode.id) : null;
  const selectedNodeForts = selectedNode ? getNodeFortification(selectedNode.id) : null;
  const selectedNodeDefensePower = selectedNode ? getEffectiveDefensePower(selectedNode.id) : null;

  return (
    <div className="fixed inset-0 z-[9990] flex flex-col bg-[#03050f]/98 backdrop-blur-xl">
      {/* ─── Header HUD ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-blue-900/40 bg-black/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌌</span>
          <div>
            <h2 className="text-sm font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-rose-300">
              CHƯ THIÊN TINH ĐỒ • CỨ ĐIỂM TINH HẢI
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono">
              Vị trí: <span className="text-blue-300">{currentNode?.name ?? '—'}</span>
              {isTraveling && (
                <span className="text-purple-300 ml-2 animate-pulse">
                  ✈️ Du hành → {COSMIC_NODES.find(n => n.id === cosmicState.travelingToNodeId)?.name} ({travelProgressPercent}%)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Stats HUD */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex flex-col items-end">
            <span className="text-zinc-500">Thần Thiết/h</span>
            <span className="text-amber-300 font-bold">{yieldPerHour.honDon}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-zinc-500">Dị Bảo/h</span>
            <span className="text-purple-300 font-bold">{yieldPerHour.tienThien}</span>
          </div>
          {/* Cargo bar */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-zinc-500">Khoang: {cargoPercent}%</span>
            <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cargoPercent}%`,
                  background: cargoPercent > 90 ? '#ef4444' : cargoPercent > 60 ? '#f59e0b' : '#22c55e',
                }}
              />
            </div>
          </div>

          {/* Harvest button */}
          <button
            onClick={handleHarvestAllVeins}
            disabled={cosmicState.occupiedNodeIds.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-600/60 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 text-[10px] font-bold font-serif transition disabled:opacity-30 cursor-pointer"
          >
            ⛏️ Thu Hoạch
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-800/80 border border-zinc-700 hover:bg-rose-900/60 hover:border-rose-500 text-zinc-400 hover:text-white transition flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Urgent Incursion Banner (Cảnh Báo Tập Kích Nguy Cấp) ─────────── */}
      {urgentIncursion && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-rose-950/90 via-red-900/80 to-purple-950/90 border-b border-rose-500/50 animate-pulse text-[11px] font-serif shrink-0">
          <div className="flex items-center gap-2 text-rose-200">
            <span className="text-base">🚨</span>
            <span className="font-bold text-rose-300">[HƯ KHÔNG TRIỀU TỊCH]</span>
            <span>
              Quân đoàn <span className="text-yellow-300 font-bold">{urgentIncursion.enemyFleetName}</span> ({urgentIncursion.enemyLeaderName}) đang nhắm tới{' '}
              <span className="text-white font-bold">{urgentIncursion.targetNodeName}</span>!
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 font-mono text-[10px] text-rose-400 font-bold border border-rose-500/40">
              {urgentIncursion.status === 'sieging' ? '⚔️ ĐANG CÔNG HÃM!' : `Tiếp cận sau: ${formatCountdown(urgentIncursion.arrivalTimestamp)}`}
            </span>
          </div>

          <button
            onClick={() => {
              setSelectedNodeId(urgentIncursion.targetNodeId);
              setDrawerSubTab('defense');
            }}
            className="px-2.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] transition cursor-pointer shadow-lg shadow-rose-900/40"
          >
            Đến Cứ Điểm ➔
          </button>
        </div>
      )}

      {/* ─── Tab Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 px-4 py-1.5 border-b border-zinc-900 bg-black/40 shrink-0">
        {[
          { id: 'map', label: '🌌 Sa Bàn Tinh Không', icon: Navigation },
          { id: 'forge', label: '🔨 Thần Binh Các', icon: Hammer },
          { id: 'logs', label: '📜 Nhật Ký Chiến Sự', icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 rounded text-[11px] font-serif font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-900/60 border border-blue-500/60 text-blue-200'
                : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ══════════ TAB: SA BÀN TINH KHÔNG ══════════ */}
        {activeTab === 'map' && (
          <div className="flex flex-1 overflow-hidden">
            {/* SVG Map */}
            <div className="flex-1 relative overflow-hidden">
              <svg
                ref={svgRef}
                className="w-full h-full"
                viewBox={`0 0 ${svgDims.w} ${svgDims.h}`}
                style={{ background: 'radial-gradient(ellipse at 30% 50%, #0a1628 0%, #03050f 100%)' }}
              >
                {/* Background tinh vân */}
                <CosmicBackground svgW={svgDims.w} svgH={svgDims.h} />

                {/* Sector labels */}
                {(['thai_vi', 'tu_vi', 'hon_don'] as CosmicSectorId[]).map(sec => {
                  const c = SECTOR_COLORS[sec];
                  const x = sec === 'thai_vi' ? '19%' : sec === 'tu_vi' ? '52%' : '74%';
                  return (
                    <text
                      key={sec}
                      x={x}
                      y="6%"
                      textAnchor="middle"
                      fill={c.glow}
                      fontSize={svgDims.w > 600 ? 11 : 8}
                      fontFamily="serif"
                      opacity="0.6"
                    >
                      {c.label}
                    </text>
                  );
                })}

                {/* Tinh Lộ (Edges) */}
                {edges.map(({ from, to }) => {
                  const fx = toSvgX(from.x), fy = toSvgY(from.y);
                  const tx = toSvgX(to.x), ty = toSvgY(to.y);
                  const sectorColor = SECTOR_COLORS[from.sectorId].line;
                  const isConnectedToSelected =
                    selectedNodeId === from.id || selectedNodeId === to.id;
                  return (
                    <g key={`${from.id}|${to.id}`}>
                      <line
                        x1={fx} y1={fy} x2={tx} y2={ty}
                        stroke={sectorColor}
                        strokeWidth={isConnectedToSelected ? 1.5 : 0.8}
                        strokeOpacity={isConnectedToSelected ? 0.8 : 0.3}
                        strokeDasharray={isConnectedToSelected ? '' : '4 6'}
                      />
                      {/* Particle chạy theo tinh lộ */}
                      <StarLaneParticle
                        x1={fx} y1={fy} x2={tx} y2={ty}
                        color={sectorColor}
                        delay={(from.x * 0.07 + to.y * 0.05) % 2.5}
                      />
                    </g>
                  );
                })}

                {/* ⚡ Tuyến Năng Lượng Tinh Vực (Sector Resonance Energy Grid Vectors) */}
                {resonanceLinks.map(link => {
                  const from = COSMIC_NODES.find(n => n.id === link.sourceNodeId);
                  const to = COSMIC_NODES.find(n => n.id === link.targetNodeId);
                  if (!from || !to) return null;

                  const fx = toSvgX(from.x), fy = toSvgY(from.y);
                  const tx = toSvgX(to.x), ty = toSvgY(to.y);
                  const isConnectedToSelected = selectedNodeId === from.id || selectedNodeId === to.id;
                  const isCombatActive = isBombarding || isFiringLaser;

                  return (
                    <g key={`res_vec_${link.id}`}>
                      {/* Vầng hào quang tuyến năng lượng */}
                      <line
                        x1={fx} y1={fy} x2={tx} y2={ty}
                        stroke={isCombatActive ? '#fbbf24' : '#06b6d4'}
                        strokeWidth={isCombatActive ? 3.5 : isConnectedToSelected ? 2.5 : 1.8}
                        strokeOpacity={isCombatActive ? 0.95 : isConnectedToSelected ? 0.75 : 0.4}
                        strokeDasharray={isCombatActive ? '' : '5 4'}
                        className={isCombatActive ? 'animate-pulse' : ''}
                      />
                      {/* Particle luồng năng lượng chạy dọc theo tuyến */}
                      <circle r={isCombatActive ? 3 : 2} fill={isCombatActive ? '#f59e0b' : '#22d3ee'}>
                        <animateMotion
                          dur={isCombatActive ? '1.2s' : '3s'}
                          repeatCount="indefinite"
                          path={`M${fx},${fy} L${tx},${ty}`}
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* Đường hải trình tập kích của Dị Tộc (Incursion Path Lines) */}
                {activeIncursions.map(inc => {
                  const targetNode = COSMIC_NODES.find(n => n.id === inc.targetNodeId);
                  if (!targetNode) return null;
                  const tx = toSvgX(targetNode.x), ty = toSvgY(targetNode.y);
                  // Ranh giới Hư Không Liệt Phùng (tọa độ xuất phát góc rìa sa bàn)
                  const rx = toSvgX(92), ry = toSvgY(10);
                  return (
                    <g key={inc.id}>
                      <line
                        x1={rx} y1={ry} x2={tx} y2={ty}
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeOpacity="0.75"
                      />
                      {/* Particle ma hạm đang di chuyển */}
                      <circle r="3" fill="#f43f5e" opacity="0.9">
                        <animateMotion
                          dur="2.5s"
                          repeatCount="indefinite"
                          path={`M${rx},${ry} L${tx},${ty}`}
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* Tinh Cầu (Nodes) */}
                {COSMIC_NODES.map(node => {
                  const nx = toSvgX(node.x), ny = toSvgY(node.y);
                  const sc = SECTOR_COLORS[node.sectorId];
                  const { occupied, isCurrent, isTravelingTo, isSelected, canTravel } = getNodeStatus(node.id);
                  const realmOk = player.currentRealm >= node.requiredRealm;
                  const incursion = incursionByNodeId.get(node.id);

                  const r = node.type === 'star_core' ? 14 : node.type === 'station' ? 13 : 11;
                  const fillColor = incursion ? '#e11d48' : occupied ? '#22c55e' : isCurrent ? '#fbbf24' : realmOk ? sc.node : '#374151';
                  const strokeColor = isSelected ? '#ffffff' : incursion ? '#f43f5e' : isCurrent ? '#fbbf24' : occupied ? '#22c55e' : sc.glow;
                  const strokeW = isSelected || isCurrent || incursion ? 2.5 : 1.5;

                  return (
                    <g
                      key={node.id}
                      style={{ cursor: realmOk ? 'pointer' : 'not-allowed' }}
                      onClick={() => realmOk && setSelectedNodeId(isSelected ? null : node.id)}
                    >
                      {/* 🚨 Sóng xung kích Hải Đăng Cảnh Báo Đỏ (Beacon) */}
                      {incursion && (
                        <circle cx={nx} cy={ny} r={r + 8} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3">
                          <animate attributeName="r" values={`${r + 6};${r + 20};${r + 6}`} dur="1.3s" repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values="1;0.1;1" dur="1.3s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Glow ring */}
                      {(isCurrent || occupied || isSelected) && !incursion && (
                        <circle cx={nx} cy={ny} r={r + 6} fill={fillColor} fillOpacity="0.15">
                          <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`} dur="2s" repeatCount="indefinite" />
                          <animate attributeName="fillOpacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      {/* Main circle */}
                      <circle
                        cx={nx} cy={ny} r={r}
                        fill={`${fillColor}33`}
                        stroke={strokeColor}
                        strokeWidth={strokeW}
                        opacity={realmOk ? 1 : 0.35}
                      />

                      {/* Icon */}
                      <text
                        x={nx} y={ny + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={node.type === 'star_core' ? 12 : 10}
                        opacity={realmOk ? 1 : 0.4}
                      >
                        {incursion ? '🚨' : occupied ? '✅' : NODE_TYPE_ICONS[node.type]}
                      </text>

                      {/* Label */}
                      <text
                        x={nx} y={ny + r + 11}
                        textAnchor="middle"
                        fill={incursion ? '#fca5a5' : realmOk ? '#e2e8f0' : '#6b7280'}
                        fontSize={9}
                        fontFamily="serif"
                        fontWeight={incursion ? 'bold' : 'normal'}
                        opacity={realmOk ? 0.9 : 0.4}
                      >
                        {node.name.length > 14 ? node.name.slice(0, 13) + '…' : node.name}
                      </text>

                      {/* Incursion Countdown Label */}
                      {incursion && (
                        <text
                          x={nx} y={ny - r - 6}
                          textAnchor="middle"
                          fill="#f43f5e"
                          fontSize={8}
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {incursion.status === 'sieging' ? 'CÔNG HÃM' : formatCountdown(incursion.arrivalTimestamp)}
                        </text>
                      )}

                      {/* Travel arrow if connected to selected */}
                      {canTravel && selectedNodeId !== node.id && !incursion && (
                        <text x={nx} y={ny - r - 5} textAnchor="middle" fontSize="9" fill="#fbbf24" opacity="0.7">
                          ✈
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* ✈ Thái Hư Tinh Chu (vessel icon) */}
                <g transform={`translate(${toSvgX(vesselPos.x)}, ${toSvgY(vesselPos.y)})`}>
                  <circle r="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" opacity="0.9" />
                  <text textAnchor="middle" dominantBaseline="middle" fontSize="10">🚀</text>
                  {isTraveling && (
                    <circle r="12" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>

                {/* ⚡ Hiệu ứng Laser Tru Ma Pháo (khi bắn pháo thủ thành) */}
                {isFiringLaser && selectedNode && (
                  <g>
                    <line
                      x1={toSvgX(selectedNode.x)}
                      y1={toSvgY(selectedNode.y)}
                      x2={toSvgX(92)}
                      y2={toSvgY(10)}
                      stroke="#f59e0b"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.9"
                    >
                      <animate attributeName="stroke-width" values="8;3;10;0" dur="0.7s" repeatCount="1" />
                    </line>
                    <line
                      x1={toSvgX(selectedNode.x)}
                      y1={toSvgY(selectedNode.y)}
                      x2={toSvgX(92)}
                      y2={toSvgY(10)}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* ─── Node Detail Drawer (right panel) ─────────────────────── */}
            <div
              className="w-80 border-l border-zinc-800/80 bg-black/75 overflow-y-auto shrink-0 flex flex-col custom-scrollbar"
              style={{ display: selectedNode ? 'flex' : 'none' }}
            >
              {selectedNode && (
                <div className="p-3 space-y-3">
                  {/* Node header */}
                  <div
                    className="rounded-xl p-3 border"
                    style={{
                      borderColor: selectedNodeIncursion ? '#f43f5e88' : `${SECTOR_COLORS[selectedNode.sectorId].glow}55`,
                      background: selectedNodeIncursion ? 'rgba(69,10,10,0.6)' : `${SECTOR_COLORS[selectedNode.sectorId].bg}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl">{selectedNodeIncursion ? '🚨' : NODE_TYPE_ICONS[selectedNode.type]}</span>
                      <div>
                        <h3 className="font-serif font-black text-sm" style={{ color: selectedNodeIncursion ? '#fca5a5' : SECTOR_COLORS[selectedNode.sectorId].node }}>
                          {selectedNode.name}
                        </h3>
                        <p className="text-[9px] font-mono" style={{ color: selectedNodeIncursion ? '#f43f5e' : SECTOR_COLORS[selectedNode.sectorId].glow }}>
                          {SECTOR_COLORS[selectedNode.sectorId].label} • Yêu cầu Realm {selectedNode.requiredRealm}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{selectedNode.description}</p>
                  </div>

                  {/* Sub-Tabs: Chỉ hiện khi node đã chiếm đóng */}
                  {selectedNodeOccupied && (
                    <div className="flex rounded-lg bg-zinc-900/90 p-0.5 border border-zinc-800 text-[10px] font-serif font-bold">
                      <button
                        onClick={() => setDrawerSubTab('info')}
                        className={`flex-1 py-1 text-center rounded transition cursor-pointer ${
                          drawerSubTab === 'info'
                            ? 'bg-blue-900/70 text-blue-200 shadow'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        ⛏️ Mỏ Khoáng
                      </button>
                      <button
                        onClick={() => setDrawerSubTab('defense')}
                        className={`flex-1 py-1 text-center rounded transition cursor-pointer relative ${
                          drawerSubTab === 'defense'
                            ? 'bg-rose-900/70 text-rose-200 shadow'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        🛡️ Phòng Ngự
                        {selectedNodeIncursion && (
                          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </button>
                      <button
                        onClick={() => setDrawerSubTab('resonance')}
                        className={`flex-1 py-1 text-center rounded transition cursor-pointer relative ${
                          drawerSubTab === 'resonance'
                            ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/50 shadow'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        ⚡ Tinh Vực Liên Kết
                        {activeAuras.length > 0 && (
                          <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* ─── PHÂN KHU: THÔNG TIN MỎ KHOÁNG (TAB INFO) ─── */}
                  {(!selectedNodeOccupied || drawerSubTab === 'info') && (
                    <>
                      {/* Yield per hour */}
                      <div className="rounded-lg p-2 border border-amber-900/30 bg-amber-950/20">
                        <p className="text-[10px] font-bold text-amber-300 mb-1.5">⛏️ Sản Lượng / Giờ</p>
                        <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                          {selectedNode.yieldPerHour.honDonThanThiet && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Thần Thiết</span>
                              <span className="text-amber-300 font-bold">{selectedNode.yieldPerHour.honDonThanThiet}</span>
                            </div>
                          )}
                          {selectedNode.yieldPerHour.tienThienDiBao && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Dị Bảo</span>
                              <span className="text-purple-300 font-bold">{selectedNode.yieldPerHour.tienThienDiBao}</span>
                            </div>
                          )}
                          {selectedNode.yieldPerHour.linhThach && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Linh Thạch</span>
                              <span className="text-yellow-300 font-bold">{selectedNode.yieldPerHour.linhThach}</span>
                            </div>
                          )}
                          {selectedNode.yieldPerHour.expBonusPercent && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Tu Vi Buff</span>
                              <span className="text-green-300 font-bold">+{selectedNode.yieldPerHour.expBonusPercent}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Guardian info */}
                      {selectedNode.guardian && !selectedNodeOccupied && (
                        <div className="rounded-lg p-2 border border-red-900/40 bg-red-950/20">
                          <p className="text-[10px] font-bold text-red-300 mb-1.5">⚔️ Thủ Hộ Giả</p>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{selectedNode.guardian.avatar}</span>
                            <div>
                              <p className="text-[11px] font-serif text-red-200 font-bold">{selectedNode.guardian.name}</p>
                              <p className="text-[9px] text-zinc-400 italic">"{selectedNode.guardian.title}"</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                            <div>
                              <span className="text-zinc-500">HP</span>
                              <div className="text-red-300 font-bold">{(selectedNode.guardian.maxHp / 1_000_000).toFixed(1)}M</div>
                            </div>
                            <div>
                              <span className="text-zinc-500">ATK</span>
                              <div className="text-orange-300 font-bold">{selectedNode.guardian.atk.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-zinc-500">Realm</span>
                              <div className="text-purple-300 font-bold">{selectedNode.guardian.realmIndex}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Travel & Attack buttons */}
                      <div className="space-y-1.5">
                        {selectedNode.id !== cosmicState.currentNodeId && (
                          <button
                            onClick={() => handleInitiateTravel(selectedNode.id)}
                            disabled={isTraveling || player.currentRealm < selectedNode.requiredRealm}
                            className="w-full py-2 rounded-lg text-xs font-serif font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-500/60 text-blue-200 hover:brightness-125"
                          >
                            <Rocket className="w-3.5 h-3.5" />
                            {isTraveling ? `Du hành... (${travelProgressPercent}%)` : '🚀 Du Hành Tới Đây'}
                          </button>
                        )}

                        {selectedNode.id === cosmicState.currentNodeId && selectedNode.guardian && !selectedNodeOccupied && (
                          <button
                            onClick={() => handleAttackNodeGuardian(selectedNode.id)}
                            className="w-full py-2 rounded-lg text-xs font-serif font-bold flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-red-900 to-rose-900 border border-red-500/60 text-red-200 hover:brightness-125 transition"
                          >
                            <Swords className="w-3.5 h-3.5" />
                            ⚔️ Khai Chiến Đoạt Mạch
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* ─── PHÂN KHU: CỨ ĐIỂM PHÒNG NGỰ & TẬP KÍCH (TAB DEFENSE) ─── */}
                  {selectedNodeOccupied && drawerSubTab === 'defense' && (
                    <div className="space-y-3">
                      {/* 1. CẢNH BÁO TẬP KÍCH TẠI NODE NÀY */}
                      {selectedNodeIncursion ? (
                        <div className="rounded-xl p-2.5 border border-rose-500/70 bg-gradient-to-b from-rose-950/60 to-black/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-rose-300 font-serif flex items-center gap-1">
                              <Radio className="w-3 h-3 text-rose-400 animate-pulse" /> Địch Tập Kích
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-500/40">
                              {THREAT_LEVEL_CONFIG[selectedNodeIncursion.threatLevel].badge}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-serif font-bold text-white">{selectedNodeIncursion.enemyLeaderName}</p>
                            <p className="text-[9px] text-zinc-400 font-serif">{selectedNodeIncursion.enemyFleetName}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
                            <div className="bg-black/40 p-1.5 rounded border border-rose-950">
                              <span className="text-zinc-500">HP Hạm Đội</span>
                              <p className="text-rose-300 font-bold">{(selectedNodeIncursion.enemyTotalHp / 1_000_000).toFixed(2)}M</p>
                            </div>
                            <div className="bg-black/40 p-1.5 rounded border border-rose-950">
                              <span className="text-zinc-500">Lực Chiến</span>
                              <p className="text-amber-300 font-bold">{selectedNodeIncursion.enemyCombatPower.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-center py-1 bg-black/60 rounded border border-rose-900/40">
                            {selectedNodeIncursion.status === 'sieging' ? (
                              <span className="text-rose-400 font-bold animate-pulse">⚔️ QUÂN ĐỊCH ĐANG CÔNG HÃM!</span>
                            ) : (
                              <span className="text-yellow-400 font-bold">
                                ⏳ Đến nơi sau: {formatCountdown(selectedNodeIncursion.arrivalTimestamp)}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: 2 Phương Thức Phòng Ngự */}
                          <div className="space-y-1.5 pt-1">
                            {/* Phương án A: Tự Động Rảnh Tay */}
                            <button
                              onClick={() => handleResolveSimulatedDefense(selectedNodeIncursion.id)}
                              disabled={isFiringLaser}
                              className="w-full py-1.5 rounded-lg text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-900 to-yellow-800 hover:brightness-125 border border-amber-500/60 text-amber-100 transition cursor-pointer"
                            >
                              <Zap className="w-3 h-3 text-amber-300" />
                              ⚡ Khai Hỏa Tru Ma Pháo & Tự Động Thủ Thành
                            </button>

                            {/* Phương án B: Ngự Chu Nghênh Chiến */}
                            {cosmicState.currentNodeId === selectedNode.id ? (
                              <button
                                onClick={() => handleManualInterception(selectedNodeIncursion.id, true)}
                                className="w-full py-1.5 rounded-lg text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-900 to-red-800 hover:brightness-125 border border-rose-500/60 text-rose-100 transition cursor-pointer"
                              >
                                <Swords className="w-3 h-3 text-rose-300" />
                                👑 Ngự Chu Nghênh Chiến (Chiến Lợi Phẩm x2)
                              </button>
                            ) : (
                              <button
                                onClick={() => handleInitiateTravel(selectedNode.id)}
                                disabled={isTraveling}
                                className="w-full py-1.5 rounded-lg text-[10px] font-serif font-bold flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 transition cursor-pointer"
                              >
                                <Rocket className="w-3 h-3" />
                                🚀 Điều Khiển Tinh Chu Tới Giải Vây
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-center">
                          <p className="text-[10px] font-serif font-bold text-emerald-300">🛡️ Cứ Điểm Bình Yên</p>
                          <p className="text-[9px] text-zinc-500">Chưa phát hiện dấu hiệu xâm lấn của Dị Tộc</p>
                        </div>
                      )}

                      {/* 2. TRẤN THỦ CỨ ĐIỂM (GARRISON & DISCIPLE APPOINTMENT) */}
                      <div className="rounded-xl p-2.5 border border-indigo-900/50 bg-indigo-950/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-300 font-serif flex items-center gap-1">
                            <Shield className="w-3 h-3 text-indigo-400" /> Trấn Thủ Cứ Điểm Tinh Hải
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setDiscipleAppointmentModalOpen(true)}
                              className="text-[9px] font-serif text-amber-400 hover:text-amber-200 underline cursor-pointer flex items-center gap-0.5"
                            >
                              <GraduationCap size={11} /> Tiên Đồng Xuất Sư
                            </button>
                            <button
                              onClick={() => setGarrisonModalOpen(true)}
                              className="text-[9px] font-serif text-blue-400 hover:text-blue-200 underline cursor-pointer"
                            >
                              Đổi Linh Thú
                            </button>
                          </div>
                        </div>

                        {selectedNodeDefensePower?.garrison && selectedNodeDefensePower.garrison.type !== 'none' ? (
                          <div className="p-2 rounded bg-black/40 border border-blue-900/40 space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-serif">
                              <span className="text-white font-bold">{selectedNodeDefensePower.garrison.entityName}</span>
                              <span className="text-[9px] px-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                                {selectedNodeDefensePower.garrison.type === 'beast' ? 'Linh Thú' : selectedNodeDefensePower.garrison.type === 'spirit' ? 'Khí Linh' : 'Đệ Tử'}
                              </span>
                            </div>
                            <div className="flex justify-between text-[9px] font-mono">
                              <span className="text-zinc-500">Lực Chiến Gốc:</span>
                              <span className="text-zinc-300">{selectedNodeDefensePower.basePower.toLocaleString()}</span>
                            </div>
                            {selectedNodeDefensePower.bonusPercent > 0 && (
                              <div className="flex justify-between text-[9px] font-mono">
                                <span className="text-zinc-500">Buff Tụ Linh Đài:</span>
                                <span className="text-emerald-400">+{selectedNodeDefensePower.bonusPercent}%</span>
                              </div>
                            )}

                            {/* Bonus Tiên Đồng Trấn Thủ Sĩ */}
                            {(() => {
                              const gId = player.cosmicState?.nodeGuardians?.[selectedNode.id];
                              const guardian = gId
                                ? player.offspringState?.children?.find(c => c.id === gId) ||
                                  player.customSectState?.disciples?.find(d => d.id === gId)
                                : null;
                              if (!guardian?.appointmentData?.specialtyBonus) return null;
                              return (
                                <div className="text-[9px] font-mono text-amber-300 pt-0.5 border-t border-indigo-900/60 flex justify-between">
                                  <span>Gia Tốc Tinh Thạch:</span>
                                  <span className="font-bold">+{Math.round((guardian.appointmentData.specialtyBonus.starHarvestMultiplier || 0) * 100)}%</span>
                                </div>
                              );
                            })()}

                            <div className="flex justify-between text-[10px] font-mono pt-1 border-t border-zinc-800">
                              <span className="text-zinc-400 font-bold">Tổng Lực Chiến:</span>
                              <span className="text-amber-300 font-bold">{selectedNodeDefensePower.totalPower.toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 bg-black/30 rounded border border-zinc-800 text-[9px] text-zinc-500 font-serif space-y-1">
                            <span>Chưa bố trí trấn thủ sĩ.</span>
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => setDiscipleAppointmentModalOpen(true)}
                                className="text-amber-400 font-bold underline cursor-pointer flex items-center gap-0.5"
                              >
                                <GraduationCap size={11} /> + Bổ Nhiệm Tiên Đồng
                              </button>
                              <button
                                onClick={() => setGarrisonModalOpen(true)}
                                className="text-blue-400 font-bold underline cursor-pointer"
                              >
                                + Linh Thú / Khí Linh
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. BẢNG 4 CÔNG TRÌNH HỘ MẠCH TRẬN BÀN */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-300 font-serif flex items-center gap-1">
                          <Hammer className="w-3 h-3 text-amber-400" /> Hộ Mạch Trận Bàn (Cứ Điểm)
                        </p>

                        {(['tru_ma_phao', 'huyen_tran', 'ho_cuong_giap', 'tu_linh_dai'] as FortificationType[]).map(type => {
                          const config = FORTIFICATION_CONFIGS[type];
                          let curLevel = 0;
                          if (selectedNodeForts) {
                            if (type === 'tru_ma_phao') curLevel = selectedNodeForts.truMaPhaoLevel;
                            if (type === 'huyen_tran') curLevel = selectedNodeForts.huyenTranLevel;
                            if (type === 'ho_cuong_giap') curLevel = selectedNodeForts.hoCuongGiapLevel;
                            if (type === 'tu_linh_dai') curLevel = selectedNodeForts.tuLinhDaiLevel;
                          }

                          const curStep = curLevel > 0 ? config.steps[curLevel - 1] : null;
                          const nextStep = curLevel < 5 ? config.steps[curLevel] : null;
                          const upgradeCheck = canUpgradeFort(selectedNode.id, type);

                          return (
                            <div
                              key={type}
                              className="rounded-lg p-2 border border-zinc-800/80 bg-black/40 hover:border-zinc-700 transition space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">{config.icon}</span>
                                  <div>
                                    <p className="text-[10px] font-serif font-bold text-zinc-200">{config.name}</p>
                                    <p className="text-[8px] text-zinc-500 font-mono">
                                      Cấp {curLevel}/5 {'★'.repeat(curLevel)}{'☆'.repeat(5 - curLevel)}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                                  {curStep ? curStep.effectDescription : 'Chưa xây'}
                                </span>
                              </div>

                              {nextStep && (
                                <div className="text-[8px] font-mono text-zinc-400 bg-zinc-950/60 p-1 rounded border border-zinc-900 flex justify-between items-center">
                                  <span>Cấp tới: {nextStep.effectDescription}</span>
                                  <span className="text-amber-400">
                                    {nextStep.cost.honDonThanThiet} Thần Thiết • {nextStep.cost.tienThienDiBao} Dị Bảo
                                  </span>
                                </div>
                              )}

                              {curLevel < 5 && (
                                <button
                                  onClick={() => handleUpgradeFortification(selectedNode.id, type)}
                                  disabled={!upgradeCheck.allowed}
                                  className="w-full py-1 rounded text-[9px] font-serif font-bold transition cursor-pointer disabled:opacity-30 bg-gradient-to-r from-amber-950 to-zinc-900 border border-amber-600/50 text-amber-200 hover:brightness-125"
                                >
                                  {upgradeCheck.allowed ? `Nâng Cấp Cấp ${curLevel + 1}` : upgradeCheck.reason}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* 4. Nút Thử Nghiệm Kích Hoạt Tập Kích */}
                      <button
                        onClick={() => handleTriggerTestIncursion(selectedNode.id, 'tieu_ba')}
                        className="w-full py-1.5 rounded-lg border border-dashed border-rose-800/60 bg-rose-950/20 text-rose-300 text-[9px] font-serif font-bold hover:bg-rose-950/40 transition cursor-pointer"
                      >
                        🚨 Thử Nghiệm: Triệu Hồi Tập Kích Ngay
                      </button>
                    </div>
                  )}

                  {/* ─── PHÂN KHU: TRẬN PHÁP LIÊN KẾT TINH VỰC (TAB RESONANCE) ─── */}
                  {selectedNodeOccupied && drawerSubTab === 'resonance' && (
                    <div className="space-y-3">
                      {/* 1. LĨNH VỰC CỘNG HƯỞNG ĐA ĐIỂM (GRID AURAS) */}
                      <div className="rounded-xl p-2.5 border border-cyan-800/60 bg-gradient-to-b from-cyan-950/40 to-black/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-cyan-300 font-serif flex items-center gap-1">
                            <Zap className="w-3 h-3 text-cyan-400" /> Lĩnh Vực Tinh Võng
                          </span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300">
                            {hasTriangle ? '🌀 Chu Trình Tam Giác' : activeAuras.length > 0 ? '✨ Đa Điểm Liên Thông' : 'Đơn Tuyến'}
                          </span>
                        </div>

                        {/* Auras Badges */}
                        <div className="space-y-1.5">
                          <div className={`p-1.5 rounded border text-[9px] transition ${
                            activeAuras.includes('thai_vi_toa_ma')
                              ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
                              : 'border-zinc-800 bg-zinc-950/50 text-zinc-500'
                          }`}>
                            <div className="flex justify-between items-center font-serif font-bold">
                              <span>🌌 Thái Vi Tỏa Ma Quang</span>
                              <span>{activeAuras.includes('thai_vi_toa_ma') ? 'KÍCH HOẠT' : 'CHƯA ĐỦ ĐIỀU KIỆN'}</span>
                            </div>
                            <p className="text-[8px] text-zinc-400 mt-0.5">Giảm 25% công kích của toàn bộ đợt xâm lăng dị tộc.</p>
                          </div>

                          <div className={`p-1.5 rounded border text-[9px] transition ${
                            activeAuras.includes('hu_khong_phan_chan')
                              ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200'
                              : 'border-zinc-800 bg-zinc-950/50 text-zinc-500'
                          }`}>
                            <div className="flex justify-between items-center font-serif font-bold">
                              <span>🛡️ Hư Không Phản Chấn Trận</span>
                              <span>{activeAuras.includes('hu_khong_phan_chan') ? 'KÍCH HOẠT' : 'CHƯA ĐỦ ĐIỀU KIỆN'}</span>
                            </div>
                            <p className="text-[8px] text-zinc-400 mt-0.5">Chuyển hóa 15% tổng hỏa lực pháo kích chi viện thành lá chắn hộ trận.</p>
                          </div>
                        </div>

                        <p className="text-[8px] text-zinc-500 italic">
                          * Kết nối từ 3 cứ điểm trở lên tạo thành lưới tam giác để mở khóa toàn bộ Lĩnh Vực.
                        </p>
                      </div>

                      {/* 2. LỆNH KHẨN CẤP: KHAI HỎA CHI VIỆN VƯỢT KHÔNG GIAN */}
                      <div className="rounded-xl p-2.5 border border-amber-800/50 bg-gradient-to-b from-amber-950/30 to-black/60 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-amber-300 font-serif flex items-center gap-1">
                            💥 Hỏa Lực Chi Viện Chéo
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400">
                            Kho: <span className="text-yellow-300 font-bold">{(player.linhThach || 0).toLocaleString()}</span> LT
                          </span>
                        </div>

                        <button
                          onClick={() => handleManualBombardment(selectedNode.id)}
                          disabled={isBombarding}
                          className={`w-full py-2 rounded-lg text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 ${
                            isBombarding
                              ? 'bg-amber-600 text-black animate-pulse'
                              : 'bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 border border-amber-500/80 text-amber-100 hover:brightness-125 shadow-lg shadow-amber-900/30'
                          }`}
                        >
                          <Zap className={`w-3.5 h-3.5 ${isBombarding ? 'animate-spin' : ''}`} />
                          {isBombarding ? 'Đang Khai Hỏa Chi Viện...' : '⚡ Khai Hỏa Chi Viện Khẩn Cấp'}
                        </button>

                        <p className="text-[8px] text-zinc-500 text-center font-mono">
                          Tiêu hao: 500 Linh Thạch / phát nã từ mỗi cứ điểm lân cận
                        </p>

                        {/* Báo cáo lượt bắn gần nhất */}
                        {lastResonanceResult && lastResonanceResult.defendingNodeId === selectedNode.id && (
                          <div className="p-2 rounded bg-black/60 border border-zinc-800 text-[8px] font-mono space-y-1">
                            <div className="flex justify-between text-amber-300 font-bold">
                              <span>Sát Thương Pháo Kích:</span>
                              <span>+{lastResonanceResult.crossFireDamageTotal.toLocaleString()}</span>
                            </div>
                            {lastResonanceResult.absorbedShieldDamage > 0 && (
                              <div className="flex justify-between text-cyan-300">
                                <span>Lá Chắn Hộ Trận:</span>
                                <span>+{lastResonanceResult.absorbedShieldDamage.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="text-zinc-400 pt-0.5 border-t border-zinc-800">
                              {lastResonanceResult.participatingNodes.filter(p => p.cannonsEngaged > 0).length} cứ điểm tham gia nã pháo.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. DANH SÁCH TUYẾN NĂNG LƯỢNG ĐANG KẾT NỐI */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-cyan-200 font-serif flex items-center gap-1">
                          ⚡ Tuyến Năng Lượng Đang Hoạt Động
                        </p>

                        {(() => {
                          const connectedLinks = resonanceLinks.filter(
                            l => l.sourceNodeId === selectedNode.id || l.targetNodeId === selectedNode.id
                          );

                          if (connectedLinks.length === 0) {
                            return (
                              <div className="text-center py-2.5 bg-black/40 rounded border border-zinc-800 text-[9px] text-zinc-500 font-serif">
                                Cứ điểm này chưa kết nối tuyến năng lượng nào.
                              </div>
                            );
                          }

                          return connectedLinks.map(link => {
                            const otherNodeId = link.sourceNodeId === selectedNode.id ? link.targetNodeId : link.sourceNodeId;
                            const otherNode = COSMIC_NODES_MAP[otherNodeId];
                            const otherForts = defenseState?.fortifications?.[otherNodeId];
                            const cannonLvl = otherForts?.truMaPhaoLevel || 1;
                            const upLvl = link.upgradeLevel || 1;

                            return (
                              <div
                                key={link.id}
                                className="p-2 rounded-lg border border-cyan-900/50 bg-black/50 space-y-1.5"
                              >
                                <div className="flex justify-between items-center text-[10px] font-serif">
                                  <span className="text-cyan-200 font-bold flex items-center gap-1">
                                    <span className="text-amber-400">⚡</span> {otherNode?.name || otherNodeId}
                                  </span>
                                  <span className="text-[9px] font-mono text-emerald-400 font-bold">
                                    Tru Ma Pháo Cấp {cannonLvl}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-1 text-[8px] font-mono text-zinc-400">
                                  <div>Cự ly: <span className="text-zinc-200">{link.distance.toFixed(0)} đv</span></div>
                                  <div>Hiệu suất: <span className="text-cyan-300">{(link.energyTransmissionEfficiency * 100).toFixed(0)}%</span></div>
                                  <div>Dây chuyền: <span className="text-amber-300">Cấp {upLvl}/5</span></div>
                                </div>

                                <div className="flex gap-2 pt-1 border-t border-zinc-800/80">
                                  {upLvl < 5 && (
                                    <button
                                      onClick={() => handleUpgradeGridTransmission(link.id)}
                                      className="flex-1 py-1 rounded text-[8px] font-serif font-bold bg-cyan-950/60 border border-cyan-600/50 text-cyan-200 hover:bg-cyan-900/60 transition cursor-pointer"
                                    >
                                      Gia Cố Dây Chuyền (10,000 LT)
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleToggleLink(selectedNode.id, otherNodeId)}
                                    className="py-1 px-2 rounded text-[8px] font-serif font-bold bg-rose-950/40 border border-rose-800/50 text-rose-300 hover:bg-rose-900/50 transition cursor-pointer"
                                  >
                                    Hủy Tuyến
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* 4. CỨ ĐIỂM LÂN CẬN KHẢ DỤNG (BÁN KÍNH R <= 250) */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-300 font-serif flex items-center gap-1">
                          🌐 Cứ Điểm Lân Cận Có Thể Liên Kết (R ≤ 250)
                        </p>

                        {(() => {
                          const occupiedIds = cosmicState?.occupiedNodeIds || [];
                          const connectedOtherIds = new Set(
                            resonanceLinks
                              .filter(l => l.sourceNodeId === selectedNode.id || l.targetNodeId === selectedNode.id)
                              .map(l => (l.sourceNodeId === selectedNode.id ? l.targetNodeId : l.sourceNodeId))
                          );

                          const candidates = occupiedIds
                            .filter(id => id !== selectedNode.id && !connectedOtherIds.has(id))
                            .map(id => {
                              const node = COSMIC_NODES_MAP[id];
                              const dist = node ? calculateCosmicDistance(selectedNode, node) : 999;
                              const forts = defenseState?.fortifications?.[id];
                              const cannonLvl = forts?.truMaPhaoLevel || 0;
                              const check = checkLinkEstablishment(selectedNode.id, id);
                              return { id, node, dist, cannonLvl, check };
                            })
                            .sort((a, b) => a.dist - b.dist);

                          if (candidates.length === 0) {
                            return (
                              <div className="text-center py-2 bg-black/30 rounded border border-zinc-800 text-[9px] text-zinc-500 font-serif">
                                Không còn cứ điểm đã chiếm đóng nào chưa kết nối.
                              </div>
                            );
                          }

                          return candidates.map(({ id, node, dist, cannonLvl, check }) => {
                            return (
                              <div
                                key={id}
                                className="p-2 rounded-lg border border-zinc-800 bg-black/40 space-y-1.5"
                              >
                                <div className="flex justify-between items-center text-[10px] font-serif">
                                  <span className="text-zinc-200 font-bold">{node?.name || id}</span>
                                  <span className="text-[8px] font-mono text-zinc-400">
                                    Cự ly: <span className={dist <= 250 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{dist.toFixed(0)}</span> / 250
                                  </span>
                                </div>

                                <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                                  <span>Tru Ma Pháo: {cannonLvl > 0 ? `Cấp ${cannonLvl}` : 'Chưa lắp đặt'}</span>
                                  <span>Chi phí: 5,000 LT</span>
                                </div>

                                <button
                                  onClick={() => handleToggleLink(selectedNode.id, id)}
                                  disabled={!check.allowed}
                                  className={`w-full py-1 rounded text-[8px] font-serif font-bold transition cursor-pointer disabled:opacity-30 ${
                                    check.allowed
                                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-600/60 text-cyan-200 hover:brightness-125'
                                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                                  }`}
                                >
                                  {check.allowed ? '⚡ Khai Thông Tuyến Năng Lượng' : (check.reason || 'Không đủ điều kiện')}
                                </button>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ TAB: THẦN BINH CÁC (TIER 9 FORGE) ══════════ */}
        {activeTab === 'forge' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-4">
                <h3 className="text-sm font-black font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400">
                  ⚒️ THẦN BINH CÁC — TIÊN THIÊN LINH BẢO & ĐẾ KHÍ
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Đúc chế 6 món Thần Binh Tối Thượng từ Hỗn Độn Thần Thiết và Tiên Thiên Dị Bảo</p>
              </div>

              {/* Materials owned */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { id: 'ore_hon_don_than_thiet', label: 'Hỗn Độn Thần Thiết', color: '#f59e0b', icon: '🔩' },
                  { id: 'ore_tien_thien_di_bao', label: 'Tiên Thiên Dị Bảo', color: '#a855f7', icon: '💠' },
                  { id: 'ore_van_co_de_ruy', label: 'Vạn Cổ Đế Tủy', color: '#ef4444', icon: '🔮' },
                ].map(mat => {
                  const qty = (player.inventory?.ores || []).find((o: any) => o.id === mat.id)?.quantity || 0;
                  return (
                    <div key={mat.id} className="rounded-xl p-2.5 border text-center"
                      style={{ borderColor: `${mat.color}44`, background: `${mat.color}11` }}>
                      <div className="text-xl mb-0.5">{mat.icon}</div>
                      <div className="text-[9px] text-zinc-400">{mat.label}</div>
                      <div className="text-sm font-black font-mono" style={{ color: mat.color }}>{qty}</div>
                    </div>
                  );
                })}
              </div>

              {/* Recipe cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tier9Recipes.map(recipe => {
                  const { allowed, reason } = canCraftTier9(recipe.id);
                  const alreadyCrafted = (player.inventory?.equipment || []).some((e: any) => e.baseId === recipe.id);

                  return (
                    <div
                      key={recipe.id}
                      className="rounded-xl p-3 border transition-all"
                      style={{
                        borderColor: allowed ? '#f59e0b55' : '#374151',
                        background: allowed ? 'rgba(251,191,36,0.05)' : 'rgba(0,0,0,0.3)',
                        boxShadow: allowed ? '0 0 15px rgba(251,191,36,0.1)' : 'none',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{recipe.icon}</span>
                        <div>
                          <h4 className="text-xs font-serif font-black text-amber-200">{recipe.name}</h4>
                          <p className="text-[9px] text-zinc-500 italic">Slot: {recipe.slot} • Realm {recipe.requiredRealm}+</p>
                        </div>
                        {alreadyCrafted && (
                          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-green-950 border border-green-700 text-green-300 font-bold">ĐÃ ĐÚC</span>
                        )}
                      </div>

                      <p className="text-[9px] text-zinc-400 leading-relaxed mb-2">{recipe.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] font-mono mb-2">
                        {Object.entries(recipe.baseStats).map(([k, v]) => v ? (
                          <div key={k} className="flex justify-between">
                            <span className="text-zinc-500">{k}</span>
                            <span className="text-amber-300">+{v}</span>
                          </div>
                        ) : null)}
                      </div>

                      {/* Passive */}
                      <p className="text-[9px] text-purple-300 leading-relaxed mb-2">{recipe.passiveEffect}</p>
                      {recipe.activeSkill && (
                        <p className="text-[9px] text-red-300 leading-relaxed mb-2">{recipe.activeSkill}</p>
                      )}

                      {/* Cost */}
                      <div className="flex items-center gap-2 text-[9px] font-mono mb-2">
                        <span className="text-zinc-500">Chi phí:</span>
                        {recipe.cost.honDonThanThiet && <span className="text-amber-300">{recipe.cost.honDonThanThiet} Thần Thiết</span>}
                        {recipe.cost.tienThienDiBao && <span className="text-purple-300">{recipe.cost.tienThienDiBao} Dị Bảo</span>}
                        {recipe.cost.vanCoDeRuyi && <span className="text-red-300">{recipe.cost.vanCoDeRuyi} Đế Tủy</span>}
                      </div>

                      {!allowed && reason && (
                        <p className="text-[9px] text-rose-400 mb-1.5">{reason}</p>
                      )}

                      <button
                        onClick={() => handleCraftTier9(recipe.id)}
                        disabled={!allowed}
                        className="w-full py-1.5 rounded-lg text-[10px] font-bold font-serif transition cursor-pointer disabled:opacity-30 flex items-center justify-center gap-1.5"
                        style={{
                          background: allowed ? 'linear-gradient(135deg, #92400e, #b45309)' : '#1c1917',
                          border: `1px solid ${allowed ? '#f59e0b' : '#374151'}`,
                          color: allowed ? '#fef3c7' : '#6b7280',
                        }}
                      >
                        <Hammer className="w-3 h-3" />
                        {alreadyCrafted ? '⚒️ Đúc Thêm' : '⚒️ Khai Lò Đúc'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: NHẬT KÝ ══════════ */}
        {activeTab === 'logs' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {cosmicState.eventLogs.length === 0 ? (
              <div className="text-center text-zinc-600 text-xs py-12 font-serif">
                Chưa có sự kiện nào được ghi lại.<br />
                Bắt đầu du hành để viết nên lịch sử của Đạo Hữu.
              </div>
            ) : (
              cosmicState.eventLogs.map((log, i) => (
                <div key={i} className="rounded-lg px-3 py-2 border border-zinc-800/60 bg-black/40 text-[10px] font-serif">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-bold ${
                      log.type === 'battle_win' ? 'text-green-400'
                      : log.type === 'battle_lose' ? 'text-red-400'
                      : log.type === 'harvest' ? 'text-amber-400'
                      : log.type === 'upgrade' ? 'text-blue-400'
                      : 'text-zinc-400'
                    }`}>
                      {log.type === 'battle_win' ? '⚔️ Đại Thắng'
                        : log.type === 'battle_lose' ? '💔 Bại Trận'
                        : log.type === 'harvest' ? '⛏️ Thu Hoạch'
                        : log.type === 'upgrade' ? '🚀 Nâng Cấp'
                        : '📍 Sự Kiện'}
                    </span>
                    <span className="text-zinc-600 font-mono text-[9px]">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{log.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ─── Modal Chọn Trấn Thủ Sĩ (Garrison Selector Modal) ───────────────── */}
      {garrisonModalOpen && selectedNode && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-blue-500/40 bg-zinc-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-serif font-black text-sm text-blue-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" /> Chỉ Định Trấn Thủ Sĩ • {selectedNode.name}
              </h3>
              <button
                onClick={() => setGarrisonModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar">
              {/* Option 1: Khí Linh Bản Mệnh */}
              {player.natalArtifact?.spirit && (
                <div
                  onClick={() => {
                    handleAssignGarrison(selectedNode.id, 'spirit');
                    setGarrisonModalOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-purple-800/50 bg-purple-950/20 hover:bg-purple-900/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <p className="text-xs font-serif font-bold text-purple-200">
                        {player.natalArtifact.spirit.name || 'Khí Linh Bản Mệnh'}
                      </p>
                      <p className="text-[9px] text-zinc-400">Khí Linh Cấp {player.natalArtifact.spirit.stageLevel || 1}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    {(100000 + ((player.natalArtifact.spirit.stageLevel || 1) * 50000)).toLocaleString()} LC
                  </span>
                </div>
              )}

              {/* Option 2: Danh sách Linh Thú */}
              {(player.spiritBeasts || player.beasts || []).map((beast: any) => (
                <div
                  key={beast.id}
                  onClick={() => {
                    handleAssignGarrison(selectedNode.id, 'beast', beast.id);
                    setGarrisonModalOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-emerald-800/50 bg-emerald-950/20 hover:bg-emerald-900/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦁</span>
                    <div>
                      <p className="text-xs font-serif font-bold text-emerald-200">{beast.name}</p>
                      <p className="text-[9px] text-zinc-400 font-mono">Giai {beast.stage || 1} • {beast.element || 'Hỗn Độn'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    {Math.max(50000, (beast.stats?.atk * 3 || 0) + Math.floor((beast.stats?.hp || 0) / 5) + ((beast.stats?.def || 0) * 2)).toLocaleString()} LC
                  </span>
                </div>
              ))}

              {/* Option 3: Chân Truyền Đệ Tử */}
              {((player as any).customSectState?.disciples || []).map((disciple: any) => (
                <div
                  key={disciple.id}
                  onClick={() => {
                    handleAssignGarrison(selectedNode.id, 'disciple', disciple.id);
                    setGarrisonModalOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-blue-800/50 bg-blue-950/20 hover:bg-blue-900/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-xs font-serif font-bold text-blue-200">{disciple.name}</p>
                      <p className="text-[9px] text-zinc-400 font-mono">{disciple.title || 'Chân Truyền Đệ Tử'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    {(disciple.combatPower || 100000).toLocaleString()} LC
                  </span>
                </div>
              ))}

              {/* Option 4: Giải trừ trấn thủ */}
              <div
                onClick={() => {
                  handleAssignGarrison(selectedNode.id, 'none');
                  setGarrisonModalOpen(false);
                }}
                className="p-2 rounded-xl border border-zinc-800 hover:bg-zinc-800/50 text-center transition cursor-pointer text-[10px] text-zinc-500 font-serif"
              >
                Hủy bỏ trấn thủ (Cứ điểm không có người canh giữ)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Kết Toán Chiến Trận Thủ Thành (Siege Battle Result Modal) ── */}
      {isDefenseModalOpen && lastDefenseReport && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div
            className="w-full max-w-sm rounded-2xl border p-5 space-y-3"
            style={{
              background: lastDefenseReport.victory
                ? 'linear-gradient(135deg, #052e16, #0c1a2e)'
                : 'linear-gradient(135deg, #2b0b0b, #0c0808)',
              borderColor: lastDefenseReport.victory ? '#22c55e88' : '#ef444488',
              boxShadow: lastDefenseReport.victory ? '0 0 40px rgba(34,197,94,0.3)' : '0 0 40px rgba(239,68,68,0.3)',
            }}
          >
            <div className="text-center">
              <span className="text-3xl">{lastDefenseReport.victory ? '🏆' : '🚨'}</span>
              <h3 className={`text-base font-black font-serif mt-1 ${lastDefenseReport.victory ? 'text-green-300' : 'text-rose-400'}`}>
                {lastDefenseReport.victory ? 'PHÒNG NGỰ CỨ ĐIỂM TOÀN THẮNG!' : 'CỨ ĐIỂM BỊ PHÁ VỠ!'}
              </h3>
              <p className="text-[10px] text-zinc-400 font-serif">
                vs [{lastDefenseReport.enemyLeaderName}] tại {lastDefenseReport.targetNodeName}
              </p>
            </div>

            {/* Thống kê Tru Ma Pháo nã đạn */}
            <div className="rounded-lg p-2 bg-black/40 border border-zinc-800 space-y-1 text-[9px] font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">⚡ Tru Ma Pháo Khai Hỏa:</span>
                <span className="text-amber-300 font-bold">
                  {lastDefenseReport.artilleryDamagePercent > 0 ? `Nã -${lastDefenseReport.artilleryDamagePercent}% HP` : 'Chưa xây pháo'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Trấn Thủ Sĩ:</span>
                <span className="text-blue-300">{lastDefenseReport.garrisonEntityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Lực Chiến Ta / Địch:</span>
                <span className="text-white font-bold">
                  {lastDefenseReport.garrisonPower.toLocaleString()} vs {lastDefenseReport.effectiveEnemyPower.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tỷ lệ thắng ước tính:</span>
                <span className="text-emerald-400 font-bold">{lastDefenseReport.winProbabilityPercent}%</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-300 font-serif text-center leading-relaxed">
              {lastDefenseReport.message}
            </p>

            {/* Chiến lợi phẩm hoặc Báo cáo tổn thất */}
            {lastDefenseReport.victory && lastDefenseReport.lootRewards && (
              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                <div className="rounded p-1.5 bg-amber-950/40 border border-amber-800 text-center">
                  <span className="text-zinc-400">Thần Thiết</span>
                  <p className="text-amber-300 font-bold">+{lastDefenseReport.lootRewards.honDonThanThiet}</p>
                </div>
                <div className="rounded p-1.5 bg-purple-950/40 border border-purple-800 text-center">
                  <span className="text-zinc-400">Dị Bảo</span>
                  <p className="text-purple-300 font-bold">+{lastDefenseReport.lootRewards.tienThienDiBao}</p>
                </div>
              </div>
            )}

            {!lastDefenseReport.victory && lastDefenseReport.cargoLoss && (
              <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-[9px] font-mono text-center text-rose-300">
                Thất thoát {lastDefenseReport.cargoLoss.honDonLost} Thần Thiết, {lastDefenseReport.cargoLoss.tienThienLost} Dị Bảo!
                {lastDefenseReport.fortificationDamagedType && (
                  <p className="text-amber-300 mt-0.5">Một công trình Hộ Mạch Trận Bàn bị giảm 1 cấp!</p>
                )}
              </div>
            )}

            <button
              onClick={() => setIsDefenseModalOpen(false)}
              className="w-full py-2 rounded-xl font-serif font-bold text-xs transition cursor-pointer"
              style={{
                background: lastDefenseReport.victory
                  ? 'linear-gradient(135deg, #166534, #14532d)'
                  : 'linear-gradient(135deg, #7f1d1d, #450a0a)',
                color: lastDefenseReport.victory ? '#86efac' : '#fca5a5',
              }}
            >
              Tiếp Tục Bảo Vệ Tinh Hải
            </button>
          </div>
        </div>
      )}

      {/* ─── Normal Battle Result Modal (Đoạt Mạch) ─────────────────────────── */}
      {isBattleModalOpen && lastBattleResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-sm mx-4 rounded-2xl border p-5"
            style={{
              background: lastBattleResult.victory ? 'linear-gradient(135deg, #052e16, #0c1a2e)' : 'linear-gradient(135deg, #1c0505, #0a0a0f)',
              borderColor: lastBattleResult.victory ? '#22c55e88' : '#ef444488',
              boxShadow: lastBattleResult.victory ? '0 0 40px rgba(34,197,94,0.3)' : '0 0 40px rgba(239,68,68,0.3)',
            }}
          >
            <h3 className={`text-lg font-black font-serif text-center mb-1 ${lastBattleResult.victory ? 'text-green-300' : 'text-red-300'}`}>
              {lastBattleResult.victory ? '🎉 ĐOẠT TINH MẠCH THÀNH CÔNG!' : '💔 CHIẾN BẠI'}
            </h3>
            <p className="text-[11px] text-zinc-400 text-center mb-3 font-serif">
              vs [{lastBattleResult.guardianName}] — {lastBattleResult.rounds} hiệp
            </p>
            <p className="text-xs text-zinc-300 font-serif text-center mb-4 leading-relaxed">{lastBattleResult.message}</p>
            {lastBattleResult.victory && (
              <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-mono">
                <div className="rounded-lg p-2 bg-amber-950/30 border border-amber-800/40 text-center">
                  <div className="text-amber-300 font-bold">{lastBattleResult.rewards.honDonThanThiet}</div>
                  <div className="text-zinc-500">Hỗn Độn Thần Thiết</div>
                </div>
                <div className="rounded-lg p-2 bg-yellow-950/30 border border-yellow-800/40 text-center">
                  <div className="text-yellow-300 font-bold">{lastBattleResult.rewards.linhThach.toLocaleString()}</div>
                  <div className="text-zinc-500">Linh Thạch</div>
                </div>
                <div className="rounded-lg p-2 bg-green-950/30 border border-green-800/40 text-center col-span-2">
                  <div className="text-green-300 font-bold">+{lastBattleResult.rewards.tuVi.toLocaleString()}</div>
                  <div className="text-zinc-500">Tu Vi</div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsBattleModalOpen(false)}
              className="w-full py-2 rounded-xl font-serif font-bold text-sm transition cursor-pointer"
              style={{
                background: lastBattleResult.victory ? 'linear-gradient(135deg, #166534, #14532d)' : 'linear-gradient(135deg, #7f1d1d, #450a0a)',
                color: lastBattleResult.victory ? '#86efac' : '#fca5a5',
              }}
            >
              Tiếp Tục Hành Trình
            </button>
          </div>
        </div>
      )}

      {/* ─── Modal Bổ Nhiệm Tiên Đồng Trấn Thủ Cứ Điểm Tinh Hải ─────────────── */}
      {selectedNode && (
        <DiscipleAppointmentModal
          isOpen={discipleAppointmentModalOpen}
          role="tinh_hai_guardian"
          targetId={selectedNode.id}
          targetName={selectedNode.name}
          player={player}
          onAppoint={(discipleId) => handleAppointDiscipleToNode(discipleId)}
          onRecall={(discipleId) => handleRecallDiscipleFromNode(discipleId)}
          onClose={() => setDiscipleAppointmentModalOpen(false)}
        />
      )}
    </div>
  );
}
