// lib/cosmic-map-logic.ts
// Pure business logic cho phân hệ Chư Thiên Tinh Đồ • Thái Cổ Tinh Mạch

import type { PlayerStats } from './types/player';
import type {
  CosmicState,
  CosmicNode,
  CosmicBattleResult,
  CosmicHarvestResult,
  CosmicCargo,
  CosmicVessel,
} from './types/cosmic-map';
import type { CombatStats } from './types/combat';
import {
  COSMIC_NODES_MAP,
  VESSEL_CONFIGS,
  calcTravelTimeMs,
  MAX_CARGO_ACCUMULATION_HOURS,
  COSMIC_UNLOCK_REALM,
  createDefaultCosmicState,
} from './cosmic-map-data';

// ─── Eligibility & Navigation ─────────────────────────────────────────────────

/** Kiểm tra người chơi đủ điều kiện mở khóa Tinh Đồ */
export function isCosmicMapUnlocked(player: PlayerStats): boolean {
  return player.currentRealm >= COSMIC_UNLOCK_REALM;
}

/** Kiểm tra có thể du hành đến node đích */
export function canTravelToNode(
  state: CosmicState,
  targetNodeId: string,
  playerRealm: number
): { allowed: boolean; reason?: string } {
  if (state.travelingToNodeId !== null) {
    return { allowed: false, reason: 'Tinh Chu đang trên đường du hành!' };
  }

  const currentNode = COSMIC_NODES_MAP[state.currentNodeId];
  const targetNode = COSMIC_NODES_MAP[targetNodeId];

  if (!currentNode) return { allowed: false, reason: 'Node hiện tại không hợp lệ.' };
  if (!targetNode) return { allowed: false, reason: 'Node đích không tồn tại.' };

  if (!currentNode.connectedNodeIds.includes(targetNodeId)) {
    return { allowed: false, reason: `Không có Tinh Lộ nối từ ${currentNode.name} đến ${targetNode.name}.` };
  }

  if (playerRealm < targetNode.requiredRealm) {
    return {
      allowed: false,
      reason: `Cảnh giới chưa đủ! Yêu cầu Realm ${targetNode.requiredRealm}, hiện tại Realm ${playerRealm}.`,
    };
  }

  return { allowed: true };
}

/** Khởi động hành trình du hành — trả về state mới */
export function initiateTravel(
  state: CosmicState,
  targetNodeId: string,
  now: number = Date.now()
): CosmicState {
  const fromNode = COSMIC_NODES_MAP[state.currentNodeId];
  const toNode = COSMIC_NODES_MAP[targetNodeId];
  if (!fromNode || !toNode) return state;

  const travelMs = calcTravelTimeMs(fromNode, toNode, state.vessel.speedLyPerMin);

  return {
    ...state,
    travelingToNodeId: targetNodeId,
    travelStartTime: now,
    travelEndTime: now + travelMs,
    eventLogs: [
      {
        timestamp: now,
        type: 'travel',
        nodeId: targetNodeId,
        message: `🚀 Xuất phát từ ${fromNode.name} → ${toNode.name} (dự kiến ${Math.ceil(travelMs / 1000)}s)`,
      },
      ...state.eventLogs.slice(0, 49),
    ],
  };
}

/** Hoàn tất hành trình — gọi khi travelEndTime đã qua */
export function completeTravel(state: CosmicState, now: number = Date.now()): CosmicState {
  if (!state.travelingToNodeId || !state.travelEndTime) return state;
  if (now < state.travelEndTime) return state; // Chưa đến giờ

  const toNode = COSMIC_NODES_MAP[state.travelingToNodeId];
  return {
    ...state,
    currentNodeId: state.travelingToNodeId,
    travelingToNodeId: null,
    travelStartTime: null,
    travelEndTime: null,
    eventLogs: [
      {
        timestamp: now,
        type: 'travel',
        nodeId: state.travelingToNodeId,
        message: `✅ Đã cập bến ${toNode?.name ?? state.travelingToNodeId}!`,
      },
      ...state.eventLogs.slice(0, 49),
    ],
  };
}

/** % tiến độ hành trình (0-100) */
export function getTravelProgressPercent(state: CosmicState, now: number = Date.now()): number {
  if (!state.travelStartTime || !state.travelEndTime) return 0;
  const total = state.travelEndTime - state.travelStartTime;
  const elapsed = now - state.travelStartTime;
  return Math.min(100, Math.max(0, Math.floor((elapsed / total) * 100)));
}

// ─── Node Battle ─────────────────────────────────────────────────────────────

/**
 * Mô phỏng trận chiến với Hư Không Cổ Thú trấn thủ node.
 * Turn-based đơn giản — pure function.
 */
export function resolveNodeBattle(
  player: PlayerStats,
  node: CosmicNode,
  cStats: CombatStats
): { result: CosmicBattleResult; newState?: Partial<CosmicState> } {
  const guardian = node.guardian;
  if (!guardian) {
    return {
      result: {
        victory: true,
        nodeId: node.id,
        guardianName: 'Không có',
        damageDealt: 0,
        rounds: 0,
        rewards: { tuVi: 0, honDonThanThiet: 0, tienThienDiBao: 0, linhThach: 0 },
        message: `${node.name} không có quái thủ hộ — tự động chiếm đóng!`,
      },
    };
  }

  const playerMaxHp = player.maxKhiHuyet || 10_000;
  let playerHp = playerMaxHp;
  let guardianHp = guardian.maxHp;
  let rounds = 0;
  const maxRounds = 25;
  let totalPlayerDmg = 0;

  while (rounds < maxRounds && playerHp > 0 && guardianHp > 0) {
    rounds++;

    // Player attacks
    const isCrit = Math.random() * 100 < (cStats.critRate || 5);
    let pDmg = Math.max(1, cStats.atk - guardian.def * 0.5) * (0.9 + Math.random() * 0.3);
    if (isCrit) pDmg *= (cStats.critDmg || 150) / 100;
    pDmg = Math.floor(pDmg);
    guardianHp = Math.max(0, guardianHp - pDmg);
    totalPlayerDmg += pDmg;

    if (guardianHp <= 0) break;

    // Guardian attacks
    const guardIsCrit = Math.random() < 0.1;
    let gDmg = Math.max(1, guardian.atk - (cStats.def || 0) * 0.4) * (0.85 + Math.random() * 0.35);
    if (guardIsCrit) gDmg *= 1.8;
    const reduction = Math.max(0.15, 1 - ((cStats.dmgReduction || 0) / 100));
    gDmg = Math.floor(gDmg * reduction);
    playerHp = Math.max(0, playerHp - gDmg);
  }

  const victory = guardianHp <= 0;

  // Tính phần thưởng
  const rewards = {
    tuVi: victory ? guardian.expYield : Math.floor(guardian.expYield * 0.1),
    honDonThanThiet: victory && guardian.dropRates?.honDonThanThiet
      ? Math.floor(guardian.dropRates.honDonThanThiet * (0.8 + Math.random() * 0.5))
      : 0,
    tienThienDiBao: victory && guardian.dropRates?.tienThienDiBao
      ? Math.random() < guardian.dropRates.tienThienDiBao ? 1 : 0
      : 0,
    linhThach: victory && guardian.dropRates?.linhThach
      ? Math.floor(guardian.dropRates.linhThach * (0.8 + Math.random() * 0.4))
      : 0,
  };

  const message = victory
    ? `⚔️ Tiêu diệt [${guardian.name}] trong ${rounds} hiệp! Nhận ${rewards.honDonThanThiet} Hỗn Độn Thần Thiết!`
    : `💔 Thất bại trước [${guardian.name}] sau ${rounds} hiệp. Tu vi +${rewards.tuVi.toLocaleString()}.`;

  return {
    result: {
      victory,
      nodeId: node.id,
      guardianName: guardian.name,
      damageDealt: totalPlayerDmg,
      rounds,
      rewards,
      message,
    },
  };
}

/** Áp dụng kết quả chiến đấu vào CosmicState */
export function applyBattleToState(
  state: CosmicState,
  result: CosmicBattleResult,
  now: number = Date.now()
): CosmicState {
  let newOccupied = [...state.occupiedNodeIds];
  let newDefeated = [...state.defeatedGuardianIds];

  if (result.victory) {
    if (!newOccupied.includes(result.nodeId)) newOccupied.push(result.nodeId);
    if (!newDefeated.includes(result.nodeId)) newDefeated.push(result.nodeId);
  }

  return {
    ...state,
    occupiedNodeIds: newOccupied,
    defeatedGuardianIds: newDefeated,
    totalBattlesWon: result.victory ? state.totalBattlesWon + 1 : state.totalBattlesWon,
    eventLogs: [
      {
        timestamp: now,
        type: result.victory ? 'battle_win' : 'battle_lose',
        nodeId: result.nodeId,
        message: result.message,
      },
      ...state.eventLogs.slice(0, 49),
    ],
  };
}

// ─── Yield Calculation (AFK / Offline) ───────────────────────────────────────

/**
 * Tính toán sản lượng tích lũy từ các Tinh Mạch đang kiểm soát.
 * Pure function — không có side effects.
 */
export function calculateCosmicYield(
  state: CosmicState,
  currentTimestamp: number = Date.now(),
  player?: PlayerStats
): CosmicHarvestResult {
  const lastHarvest = state.cargo.lastHarvestTime || currentTimestamp;
  const elapsedMs = currentTimestamp - lastHarvest;
  const elapsedHours = Math.min(
    MAX_CARGO_ACCUMULATION_HOURS,
    elapsedMs / (1000 * 60 * 60)
  );

  if (elapsedHours < 0.01 || state.occupiedNodeIds.length === 0) {
    return {
      honDonThanThiet: 0,
      tienThienDiBao: 0,
      vanCoDeRuyi: 0,
      linhThach: 0,
      fromNodeIds: [],
      hoursElapsed: elapsedHours,
      message: 'Chưa có Tinh Mạch nào được kiểm soát hoặc thời gian chưa đủ.',
    };
  }

  let honDon = 0, tienThien = 0, vanco = 0, linh = 0;
  const activeNodes: string[] = [];

  for (const nodeId of state.occupiedNodeIds) {
    const node = COSMIC_NODES_MAP[nodeId];
    if (!node) continue;

    let harvestMultiplier = 1;
    const guardianId = state.nodeGuardians?.[nodeId];
    if (guardianId && player) {
      const disciple =
        player.offspringState?.children?.find((c: any) => c.id === guardianId) ||
        player.customSectState?.disciples?.find((d: any) => d.id === guardianId);
      if (disciple?.appointmentData?.specialtyBonus?.starHarvestMultiplier) {
        harvestMultiplier += disciple.appointmentData.specialtyBonus.starHarvestMultiplier;
      }
    }

    const y = node.yieldPerHour;
    honDon += (y.honDonThanThiet || 0) * elapsedHours * harvestMultiplier;
    tienThien += (y.tienThienDiBao || 0) * elapsedHours * harvestMultiplier;
    vanco += (y.vanCoDeRuyi || 0) * elapsedHours * harvestMultiplier;
    linh += (y.linhThach || 0) * elapsedHours * harvestMultiplier;
    activeNodes.push(nodeId);
  }

  // Clamp to cargo capacity remaining
  const currentTotal = state.cargo.honDonThanThiet + state.cargo.tienThienDiBao + state.cargo.vanCoDeRuyi + state.cargo.linhThach;
  const remainingCapacity = state.vessel.cargoCapacity - currentTotal;
  const totalYield = honDon + tienThien + vanco + linh;

  if (totalYield > remainingCapacity && remainingCapacity > 0) {
    const scale = remainingCapacity / totalYield;
    honDon *= scale; tienThien *= scale; vanco *= scale; linh *= scale;
  } else if (remainingCapacity <= 0) {
    return {
      honDonThanThiet: 0, tienThienDiBao: 0, vanCoDeRuyi: 0, linhThach: 0,
      fromNodeIds: activeNodes,
      hoursElapsed: elapsedHours,
      message: '⚠️ Khoang chứa đã đầy! Hãy thu hoạch để tiếp tục tích lũy.',
    };
  }

  return {
    honDonThanThiet: Math.floor(honDon),
    tienThienDiBao: Math.floor(tienThien),
    vanCoDeRuyi: Math.floor(vanco),
    linhThach: Math.floor(linh),
    fromNodeIds: activeNodes,
    hoursElapsed: elapsedHours,
    message: `⛏️ Thu hoạch từ ${activeNodes.length} Tinh Mạch sau ${elapsedHours.toFixed(1)} giờ!`,
  };
}

/** Cộng yield vào cargo state */
export function applyYieldToCargo(state: CosmicState, yield_: CosmicHarvestResult, now: number = Date.now()): CosmicState {
  return {
    ...state,
    cargo: {
      honDonThanThiet: state.cargo.honDonThanThiet + yield_.honDonThanThiet,
      tienThienDiBao: state.cargo.tienThienDiBao + yield_.tienThienDiBao,
      vanCoDeRuyi: state.cargo.vanCoDeRuyi + yield_.vanCoDeRuyi,
      linhThach: state.cargo.linhThach + yield_.linhThach,
      lastHarvestTime: now,
    },
  };
}

// ─── Harvest (Transfer cargo → player inventory) ──────────────────────────────

/**
 * Chuyển toàn bộ hàng hóa khoang Tinh Chu vào inventory người chơi.
 * Returns updated player and zeroed cargo.
 */
export function harvestCosmicCargo(
  player: PlayerStats,
  state: CosmicState,
  now: number = Date.now()
): { updatedPlayer: PlayerStats; updatedState: CosmicState; result: CosmicHarvestResult } {
  // Tính lượng tích lũy thêm trước khi harvest
  const pendingYield = calculateCosmicYield(state, now);
  const cargoWithPending: CosmicCargo = {
    honDonThanThiet: state.cargo.honDonThanThiet + pendingYield.honDonThanThiet,
    tienThienDiBao: state.cargo.tienThienDiBao + pendingYield.tienThienDiBao,
    vanCoDeRuyi: state.cargo.vanCoDeRuyi + pendingYield.vanCoDeRuyi,
    linhThach: state.cargo.linhThach + pendingYield.linhThach,
    lastHarvestTime: now,
  };

  const honDon = cargoWithPending.honDonThanThiet;
  const tienThien = cargoWithPending.tienThienDiBao;
  const vanco = cargoWithPending.vanCoDeRuyi;
  const linhThach = cargoWithPending.linhThach;

  // Thêm vào inventory.ores
  const existingOres = player.inventory?.ores || [];
  const addOre = (ores: any[], id: string, name: string, qty: number, grade: string): any[] => {
    if (qty <= 0) return ores;
    const idx = ores.findIndex((o: any) => o.id === id);
    if (idx >= 0) {
      const updated = [...ores];
      updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 0) + qty };
      return updated;
    }
    return [...ores, {
      id,
      name,
      grade,
      description: `Thu hoạch từ Chư Thiên Tinh Đồ`,
      element: 'ngu_hanh',
      price: 0,
      quantity: qty,
    }];
  };

  let updatedOres = [...existingOres];
  updatedOres = addOre(updatedOres, 'ore_hon_don_than_thiet', 'Hỗn Độn Thần Thiết', honDon, 'Thần Phẩm');
  updatedOres = addOre(updatedOres, 'ore_tien_thien_di_bao', 'Tiên Thiên Dị Bảo', tienThien, 'Thần Phẩm');
  updatedOres = addOre(updatedOres, 'ore_van_co_de_ruy', 'Vạn Cổ Đế Tủy', vanco, 'Thần Phẩm');

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) + linhThach,
    inventory: {
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      ...(player.inventory || {}),
      ores: updatedOres,
    },
    cosmicState: {
      ...state,
      cargo: { honDonThanThiet: 0, tienThienDiBao: 0, vanCoDeRuyi: 0, linhThach: 0, lastHarvestTime: now },
      totalHonDonHarvested: (state.totalHonDonHarvested || 0) + honDon,
    },
  };

  const updatedState: CosmicState = {
    ...state,
    cargo: { honDonThanThiet: 0, tienThienDiBao: 0, vanCoDeRuyi: 0, linhThach: 0, lastHarvestTime: now },
    totalHonDonHarvested: (state.totalHonDonHarvested || 0) + honDon,
    eventLogs: [
      {
        timestamp: now,
        type: 'harvest',
        nodeId: state.currentNodeId,
        message: `⛏️ Thu hoạch: ${honDon} Hỗn Độn Thần Thiết, ${tienThien} Tiên Thiên Dị Bảo, ${linhThach.toLocaleString()} Linh Thạch`,
      },
      ...state.eventLogs.slice(0, 49),
    ],
  };

  return {
    updatedPlayer: {
      ...updatedPlayer,
      inventory: {
        pills: player.inventory?.pills ?? [],
        herbs: player.inventory?.herbs ?? [],
        ...(player.inventory || {}),
        ores: updatedOres,
      },
      cosmicState: updatedState,
    },
    updatedState,
    result: {
      honDonThanThiet: honDon,
      tienThienDiBao: tienThien,
      vanCoDeRuyi: vanco,
      linhThach,
      fromNodeIds: state.occupiedNodeIds,
      hoursElapsed: pendingYield.hoursElapsed,
      message: `✅ Đã thu hoạch ${honDon} Hỗn Độn Thần Thiết và ${tienThien} Tiên Thiên Dị Bảo vào kho!`,
    },
  };
}

// ─── Vessel Upgrade ───────────────────────────────────────────────────────────

/** Kiểm tra đủ điều kiện nâng cấp tàu */
export function canUpgradeVessel(state: CosmicState, player: PlayerStats): { allowed: boolean; reason?: string } {
  const currentLevel = state.vessel.level as 1 | 2 | 3 | 4 | 5;
  if (currentLevel >= 5) return { allowed: false, reason: 'Tinh Chu đã đạt cấp tối đa!' };

  const nextCfg = VESSEL_CONFIGS[(currentLevel + 1) as 2 | 3 | 4 | 5];
  const cost = VESSEL_CONFIGS[currentLevel].upgradeCost;
  if (!cost) return { allowed: false, reason: 'Không có dữ liệu nâng cấp.' };

  const ores = player.inventory?.ores || [];
  const honDonOwned = ores.find((o: any) => o.id === 'ore_hon_don_than_thiet')?.quantity || 0;
  const linhThachOwned = player.linhThach || 0;

  if ((cost.honDonThanThiet || 0) > honDonOwned) {
    return { allowed: false, reason: `Thiếu Hỗn Độn Thần Thiết! Cần ${cost.honDonThanThiet}, có ${honDonOwned}.` };
  }
  if ((cost.linhThach || 0) > linhThachOwned) {
    return { allowed: false, reason: `Thiếu Linh Thạch! Cần ${(cost.linhThach || 0).toLocaleString()}, có ${linhThachOwned.toLocaleString()}.` };
  }

  return { allowed: true };
}

/** Thực hiện nâng cấp tàu — trả về updatedPlayer với CosmicState mới */
export function upgradeVessel(
  player: PlayerStats,
  state: CosmicState,
  now: number = Date.now()
): { updatedPlayer: PlayerStats; updatedState: CosmicState; message: string } | null {
  const { allowed, reason } = canUpgradeVessel(state, player);
  if (!allowed) return null;

  const currentLevel = state.vessel.level as 1 | 2 | 3 | 4;
  const cost = VESSEL_CONFIGS[currentLevel].upgradeCost!;
  const nextLevel = (currentLevel + 1) as 2 | 3 | 4 | 5;
  const nextCfg = VESSEL_CONFIGS[nextLevel];

  // Deduct costs
  const ores = (player.inventory?.ores || []).map((o: any) =>
    o.id === 'ore_hon_don_than_thiet'
      ? { ...o, quantity: o.quantity - (cost.honDonThanThiet || 0) }
      : o
  );

  const newVessel: CosmicVessel = {
    ...nextCfg,
    hullIntegrity: 100,
    upgradeCost: VESSEL_CONFIGS[nextLevel]?.upgradeCost,
  };

  const newState: CosmicState = {
    ...state,
    vessel: newVessel,
    eventLogs: [
      {
        timestamp: now,
        type: 'upgrade',
        nodeId: state.currentNodeId,
        message: `🚀 Nâng cấp Tinh Chu lên [${newVessel.name}]! Tốc độ +${((nextCfg.speedLyPerMin - VESSEL_CONFIGS[currentLevel].speedLyPerMin)).toFixed(1)} lần`,
      },
      ...state.eventLogs.slice(0, 49),
    ],
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) - (cost.linhThach || 0),
    inventory: {
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      ...(player.inventory || {}),
      ores,
    },
    cosmicState: newState,
  };

  return {
    updatedPlayer,
    updatedState: newState,
    message: `✅ ${newVessel.name} sẵn sàng xuất phát! Tốc độ: ${newVessel.speedLyPerMin}x, Khoang: ${newVessel.cargoCapacity.toLocaleString()}`,
  };
}

// ─── Tier 9 Crafting ──────────────────────────────────────────────────────────

import { TIER9_RECIPES_MAP } from './cosmic-map-data';

/** Kiểm tra đủ nguyên liệu Tier 9 */
export function canCraftTier9(
  player: PlayerStats,
  recipeId: string
): { allowed: boolean; reason?: string } {
  const recipe = TIER9_RECIPES_MAP[recipeId];
  if (!recipe) return { allowed: false, reason: 'Công thức không tồn tại.' };
  if (player.currentRealm < recipe.requiredRealm) {
    return { allowed: false, reason: `Yêu cầu cảnh giới Realm ${recipe.requiredRealm}, hiện tại Realm ${player.currentRealm}.` };
  }

  const ores = player.inventory?.ores || [];
  const getQty = (oreId: string) => ores.find((o: any) => o.id === oreId)?.quantity || 0;
  const cost = recipe.cost;

  if ((cost.honDonThanThiet || 0) > getQty('ore_hon_don_than_thiet')) {
    return { allowed: false, reason: `Thiếu Hỗn Độn Thần Thiết! Cần ${cost.honDonThanThiet}, có ${getQty('ore_hon_don_than_thiet')}.` };
  }
  if ((cost.tienThienDiBao || 0) > getQty('ore_tien_thien_di_bao')) {
    return { allowed: false, reason: `Thiếu Tiên Thiên Dị Bảo! Cần ${cost.tienThienDiBao}, có ${getQty('ore_tien_thien_di_bao')}.` };
  }
  if ((cost.vanCoDeRuyi || 0) > getQty('ore_van_co_de_ruy')) {
    return { allowed: false, reason: `Thiếu Vạn Cổ Đế Tủy! Cần ${cost.vanCoDeRuyi}, có ${getQty('ore_van_co_de_ruy')}.` };
  }
  if ((cost.linhThach || 0) > (player.linhThach || 0)) {
    return { allowed: false, reason: `Thiếu Linh Thạch!` };
  }

  return { allowed: true };
}

/** Đúc trang bị Tier 9 */
export function craftTier9Equipment(
  player: PlayerStats,
  recipeId: string
): { updatedPlayer: PlayerStats; newEquip: any; message: string } | null {
  const { allowed, reason } = canCraftTier9(player, recipeId);
  if (!allowed) return null;

  const recipe = TIER9_RECIPES_MAP[recipeId];
  if (!recipe) return null;

  const cost = recipe.cost;

  // Deduct materials
  const ores = (player.inventory?.ores || []).map((o: any) => {
    if (o.id === 'ore_hon_don_than_thiet') return { ...o, quantity: o.quantity - (cost.honDonThanThiet || 0) };
    if (o.id === 'ore_tien_thien_di_bao') return { ...o, quantity: o.quantity - (cost.tienThienDiBao || 0) };
    if (o.id === 'ore_van_co_de_ruy') return { ...o, quantity: o.quantity - (cost.vanCoDeRuyi || 0) };
    return o;
  }).filter((o: any) => o.quantity > 0);

  // Build equipment object
  const newEquip: import('./types/items').Equipment = {
    id: `${recipeId}_${Date.now()}`,
    baseId: recipeId,
    name: recipe.name,
    slot: recipe.slot,
    grade: recipe.grade,
    quality: 'than_pham',
    tier: recipe.tier,
    description: recipe.description,
    // Required Equipment fields
    powerBonus: 0,
    enhancement: 0,
    hpBonus: recipe.baseStats.hp ?? 0,
    mpBonus: recipe.baseStats.mp ?? 0,
    // Base stats spread
    ...recipe.baseStats,
    passiveEffect: recipe.passiveEffect,
    activeSkill: recipe.activeSkill,
    sockets: [],
    affixes: [],
    icon: recipe.icon,
    craftedAt: Date.now(),
    craftedByRealm: player.currentRealm,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) - (cost.linhThach || 0),
    inventory: {
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      ...(player.inventory || {}),
      ores,
      equipment: [...(player.inventory?.equipment || []), newEquip],
    },
  };

  return {
    updatedPlayer,
    newEquip,
    message: `✅ Đúc thành công [${recipe.name}] Tier 9 Thần Cấp!`,
  };
}

// ─── Offline Progress Integration ────────────────────────────────────────────

/**
 * Được gọi bởi processOfflineProgress — tính và cộng dồn sản lượng khi offline.
 * Returns updated player (với cosmicState & inventory đã cập nhật).
 */
export function processCosmicOfflineYield(
  player: PlayerStats,
  now: number = Date.now()
): PlayerStats {
  const cs = player.cosmicState;
  if (!cs || !cs.unlocked || cs.occupiedNodeIds.length === 0) return player;

  const yieldResult = calculateCosmicYield(cs, now);
  if (
    yieldResult.honDonThanThiet === 0 &&
    yieldResult.tienThienDiBao === 0 &&
    yieldResult.linhThach === 0
  ) return player;

  const updatedCargo = {
    honDonThanThiet: Math.min(cs.vessel.cargoCapacity, cs.cargo.honDonThanThiet + yieldResult.honDonThanThiet),
    tienThienDiBao: Math.min(cs.vessel.cargoCapacity, cs.cargo.tienThienDiBao + yieldResult.tienThienDiBao),
    vanCoDeRuyi: cs.cargo.vanCoDeRuyi + yieldResult.vanCoDeRuyi,
    linhThach: cs.cargo.linhThach + yieldResult.linhThach,
    lastHarvestTime: now,
  };

  return {
    ...player,
    cosmicState: {
      ...cs,
      cargo: updatedCargo,
    },
  };
}

/** Khởi tạo CosmicState cho nhân vật mới đạt cảnh giới Phi Thăng */
export function initCosmicStateForPlayer(): CosmicState {
  return {
    ...createDefaultCosmicState(),
    unlocked: true,
  };
}

/** Tính tổng sản lượng/giờ của tất cả node đang kiểm soát */
export function getTotalYieldPerHour(state: CosmicState): { honDon: number; tienThien: number; linhThach: number } {
  let honDon = 0, tienThien = 0, linhThach = 0;
  for (const id of state.occupiedNodeIds) {
    const node = COSMIC_NODES_MAP[id];
    if (!node) continue;
    honDon += node.yieldPerHour.honDonThanThiet || 0;
    tienThien += node.yieldPerHour.tienThienDiBao || 0;
    linhThach += node.yieldPerHour.linhThach || 0;
  }
  return { honDon, tienThien, linhThach };
}
