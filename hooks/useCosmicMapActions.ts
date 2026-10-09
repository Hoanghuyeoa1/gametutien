'use client';
// hooks/useCosmicMapActions.ts
// Custom domain hook điều phối toàn bộ Chư Thiên Tinh Đồ

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PlayerStats } from '@/lib/types/player';
import type {
  CosmicState,
  CosmicNode,
  CosmicBattleResult,
  CosmicHarvestResult,
} from '@/lib/types/cosmic-map';
import {
  canTravelToNode,
  initiateTravel,
  completeTravel,
  getTravelProgressPercent,
  resolveNodeBattle,
  applyBattleToState,
  harvestCosmicCargo,
  calculateCosmicYield,
  applyYieldToCargo,
  canUpgradeVessel,
  upgradeVessel,
  canCraftTier9,
  craftTier9Equipment,
  getTotalYieldPerHour,
  initCosmicStateForPlayer,
  isCosmicMapUnlocked,
} from '@/lib/cosmic-map-logic';
import {
  COSMIC_NODES,
  COSMIC_NODES_MAP,
  TIER9_RECIPES,
  createDefaultCosmicState,
} from '@/lib/cosmic-map-data';
import { calculateCombatStats } from '@/lib/destiny-data';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseCosmicMapActionsProps {
  player: PlayerStats;
  setPlayer: ((updater: (prev: PlayerStats) => PlayerStats) => void) | undefined;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: any) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCosmicMapActions({
  player,
  setPlayer,
  showToast,
  addLog,
}: UseCosmicMapActionsProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [travelProgressPercent, setTravelProgressPercent] = useState(0);
  const [isBattleModalOpen, setIsBattleModalOpen] = useState(false);
  const [lastBattleResult, setLastBattleResult] = useState<CosmicBattleResult | null>(null);
  const [lastHarvestResult, setLastHarvestResult] = useState<CosmicHarvestResult | null>(null);
  const [showHarvestToast, setShowHarvestToast] = useState(false);
  const [craftingId, setCraftingId] = useState<string | null>(null);

  // ─── Derived State ───────────────────────────────────────────────────────────

  const cosmicState: CosmicState = useMemo(() => {
    if (player.cosmicState) return player.cosmicState;
    if (isCosmicMapUnlocked(player)) return { ...initCosmicStateForPlayer() };
    return createDefaultCosmicState();
  }, [player.cosmicState, player.currentRealm]);

  const currentNode = useMemo(() => COSMIC_NODES_MAP[cosmicState.currentNodeId], [cosmicState.currentNodeId]);
  const selectedNode = useMemo(() => (selectedNodeId ? COSMIC_NODES_MAP[selectedNodeId] : null), [selectedNodeId]);
  const isTraveling = cosmicState.travelingToNodeId !== null;
  const yieldPerHour = useMemo(() => getTotalYieldPerHour(cosmicState), [cosmicState.occupiedNodeIds]);

  // ─── Travel Progress Ticker ──────────────────────────────────────────────────

  useEffect(() => {
    if (!isTraveling) {
      setTravelProgressPercent(0);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const pct = getTravelProgressPercent(cosmicState, now);
      setTravelProgressPercent(pct);

      // Auto-complete travel when done
      if (now >= (cosmicState.travelEndTime || 0)) {
        handleCompleteTravel();
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isTraveling, cosmicState.travelEndTime]);

  // ─── Yield Accumulation Ticker (every 30s) ───────────────────────────────────

  useEffect(() => {
    if (!cosmicState.unlocked || cosmicState.occupiedNodeIds.length === 0) return;

    const tick = () => {
      const now = Date.now();
      const yld = calculateCosmicYield(cosmicState, now);
      if (yld.honDonThanThiet > 0 || yld.linhThach > 0) {
        const newCs = applyYieldToCargo(cosmicState, yld, now);
        setPlayer?.((prev: PlayerStats) => ({ ...prev, cosmicState: newCs }));
      }
    };

    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, [cosmicState.occupiedNodeIds.length, cosmicState.unlocked]);

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const handleInitiateTravel = useCallback((targetNodeId: string) => {
    const check = canTravelToNode(cosmicState, targetNodeId, player.currentRealm);
    if (!check.allowed) {
      showToast?.(`⚠️ ${check.reason}`);
      return;
    }

    const newCs = initiateTravel(cosmicState, targetNodeId);
    setPlayer?.((prev: PlayerStats) => ({ ...prev, cosmicState: newCs }));
    const target = COSMIC_NODES_MAP[targetNodeId];
    showToast?.(`🚀 Tinh Chu khởi hành đến ${target?.name}!`);
    setSelectedNodeId(null);
  }, [cosmicState, player.currentRealm, setPlayer, showToast]);

  const handleCompleteTravel = useCallback(() => {
    const now = Date.now();
    if ((cosmicState.travelEndTime ?? 0) > now) return;

    const newCs = completeTravel(cosmicState, now);
    if (newCs.currentNodeId !== cosmicState.currentNodeId) {
      setPlayer?.((prev: PlayerStats) => ({ ...prev, cosmicState: newCs }));
      const arrived = COSMIC_NODES_MAP[newCs.currentNodeId];
      showToast?.(`✅ Đã đến ${arrived?.name}!`);
      addLog?.('Tinh Chu Cập Bến', `Đã cập bến ${arrived?.name ?? ''}. ${arrived?.description ?? ''}`, 'info');
    }
  }, [cosmicState, setPlayer, showToast, addLog]);

  const handleAttackNodeGuardian = useCallback((nodeId: string) => {
    const node = COSMIC_NODES_MAP[nodeId];
    if (!node) return;
    if (nodeId !== cosmicState.currentNodeId) {
      showToast?.('⚠️ Tinh Chu phải ở cùng vị trí để tham chiến!');
      return;
    }
    if (cosmicState.occupiedNodeIds.includes(nodeId)) {
      showToast?.('✅ Tinh Mạch này đã được kiểm soát!');
      return;
    }

    const cStats = calculateCombatStats(player);
    const { result } = resolveNodeBattle(player, node, cStats as any);
    const newCs = applyBattleToState(cosmicState, result);

    // Rewards → player
    let updatedPlayer: PlayerStats = {
      ...player,
      tuVi: (player.tuVi || 0) + result.rewards.tuVi,
      linhThach: (player.linhThach || 0) + result.rewards.linhThach,
      cosmicState: newCs,
    };

    // Add drop ores
    if (result.rewards.honDonThanThiet > 0 || result.rewards.tienThienDiBao > 0) {
      const ores = [...(player.inventory?.ores || [])];
      const upsert = (id: string, name: string, qty: number) => {
        if (qty <= 0) return;
        const idx = ores.findIndex((o: any) => o.id === id);
        if (idx >= 0) ores[idx] = { ...ores[idx], quantity: ores[idx].quantity + qty };
        else ores.push({ id, name, grade: 'Thần Phẩm', description: 'Chiến lợi phẩm Tinh Đồ', element: 'ngu_hanh', price: 0, quantity: qty });
      };
      upsert('ore_hon_don_than_thiet', 'Hỗn Độn Thần Thiết', result.rewards.honDonThanThiet);
      upsert('ore_tien_thien_di_bao', 'Tiên Thiên Dị Bảo', result.rewards.tienThienDiBao);
      updatedPlayer = {
        ...updatedPlayer,
        inventory: {
          pills: updatedPlayer.inventory?.pills ?? [],
          herbs: updatedPlayer.inventory?.herbs ?? [],
          ...(updatedPlayer.inventory || {}),
          ores,
        },
      };
    }

    setPlayer?.(() => updatedPlayer);
    setLastBattleResult(result);
    setIsBattleModalOpen(true);
    addLog?.(
      result.victory ? '⚔️ Đoạt Tinh Mạch Thành Công!' : '💔 Chiến Bại Tinh Đồ',
      result.message,
      result.victory ? 'success' : 'combat'
    );
  }, [cosmicState, player, setPlayer, showToast, addLog]);

  const handleHarvestAllVeins = useCallback(() => {
    if (cosmicState.occupiedNodeIds.length === 0) {
      showToast?.('⚠️ Chưa kiểm soát Tinh Mạch nào!');
      return;
    }

    const { updatedPlayer, result } = harvestCosmicCargo(player, cosmicState);
    if (result.honDonThanThiet === 0 && result.linhThach === 0) {
      showToast?.('ℹ️ Khoang hàng trống — chưa có gì để thu hoạch.');
      return;
    }

    setPlayer?.(() => updatedPlayer);
    setLastHarvestResult(result);
    setShowHarvestToast(true);
    setTimeout(() => setShowHarvestToast(false), 4000);
    showToast?.(`⛏️ Thu hoạch: ${result.honDonThanThiet} Hỗn Độn Thần Thiết!`);
    addLog?.('⛏️ Thu Hoạch Tinh Mạch', result.message, 'resource');
  }, [cosmicState, player, setPlayer, showToast, addLog]);

  const handleUpgradeVessel = useCallback(() => {
    const res = upgradeVessel(player, cosmicState);
    if (!res) {
      const { reason } = canUpgradeVessel(cosmicState, player);
      showToast?.(`⚠️ ${reason}`);
      return;
    }
    setPlayer?.(() => res.updatedPlayer);
    showToast?.(`🚀 ${res.message}`);
    addLog?.('🚀 Nâng Cấp Tinh Chu', res.message, 'upgrade');
  }, [cosmicState, player, setPlayer, showToast, addLog]);

  const handleCraftTier9 = useCallback((recipeId: string) => {
    const { allowed, reason } = canCraftTier9(player, recipeId);
    if (!allowed) {
      showToast?.(`⚠️ ${reason}`);
      return;
    }
    setCraftingId(recipeId);
    setTimeout(() => {
      const res = craftTier9Equipment(player, recipeId);
      if (!res) {
        showToast?.('❌ Đúc thất bại.');
        setCraftingId(null);
        return;
      }
      setPlayer?.(() => res.updatedPlayer);
      showToast?.(`✅ ${res.message}`);
      addLog?.('🔨 Đúc Trang Bị Tier 9', res.message, 'forge');
      setCraftingId(null);
    }, 1500); // Hiệu ứng rèn đúc
  }, [player, setPlayer, showToast, addLog]);

  // ─── Getters ─────────────────────────────────────────────────────────────────

  const getNodeStatus = useCallback((nodeId: string) => {
    const occupied = cosmicState.occupiedNodeIds.includes(nodeId);
    const isCurrent = cosmicState.currentNodeId === nodeId;
    const isTravelingTo = cosmicState.travelingToNodeId === nodeId;
    const isSelected = selectedNodeId === nodeId;
    const node = COSMIC_NODES_MAP[nodeId];
    const canTravel = node ? canTravelToNode(cosmicState, nodeId, player.currentRealm).allowed : false;
    return { occupied, isCurrent, isTravelingTo, isSelected, canTravel };
  }, [cosmicState, selectedNodeId, player.currentRealm]);

  const pendingCargo = useMemo(() => {
    const yld = calculateCosmicYield(cosmicState, Date.now());
    return {
      honDon: cosmicState.cargo.honDonThanThiet + yld.honDonThanThiet,
      tienThien: cosmicState.cargo.tienThienDiBao + yld.tienThienDiBao,
      linhThach: cosmicState.cargo.linhThach + yld.linhThach,
    };
  }, [cosmicState]);

  const cargoPercent = useMemo(() => {
    const total = pendingCargo.honDon + pendingCargo.tienThien + pendingCargo.linhThach;
    return Math.min(100, Math.floor((total / cosmicState.vessel.cargoCapacity) * 100));
  }, [pendingCargo, cosmicState.vessel.cargoCapacity]);

  return {
    // State
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
    lastHarvestResult,
    showHarvestToast,
    craftingId,
    yieldPerHour,
    pendingCargo,
    cargoPercent,
    // Node data
    allNodes: COSMIC_NODES,
    tier9Recipes: TIER9_RECIPES,
    // Actions
    handleInitiateTravel,
    handleAttackNodeGuardian,
    handleHarvestAllVeins,
    handleUpgradeVessel,
    handleCraftTier9,
    getNodeStatus,
    // Helpers
    canCraftTier9: (id: string) => canCraftTier9(player, id),
    canUpgradeVessel: () => canUpgradeVessel(cosmicState, player),
  };
}
