// lib/cosmic-defense-logic.ts
// Pure Business Logic cho phân hệ "Vực Ngoại Dị Tộc Tập Kích & Xây Dựng Cứ Điểm Tinh Hải (Cosmic Invasions & Star Fortification)"

import type { PlayerStats } from './types/player';
import type { CosmicState } from './types/cosmic-map';
import type {
  CosmicDefenseState,
  FortificationType,
  GarrisonDeployment,
  GarrisonType,
  IncursionThreatLevel,
  NodeFortificationState,
  VoidIncursion,
} from './types/cosmic-defense';
import { FORTIFICATION_CONFIGS, VOID_BOSSES_CATALOG, FLEET_NAMES_POOL, THREAT_LEVEL_CONFIG } from './cosmic-defense-data';
import { COSMIC_NODES_MAP } from './cosmic-map-data';
import { calculateCrossFireArtillerySupport } from './sector-resonance-logic';

// ─── Default Initialization ───────────────────────────────────────────────────

export function createDefaultCosmicDefenseState(): CosmicDefenseState {
  return {
    fortifications: {},
    garrisons: {},
    activeIncursions: [],
    lastIncursionCheckTime: Date.now(),
    incursionsRepelledCount: 0,
    incursionsBreachedCount: 0,
  };
}

export function getDefaultNodeFortification(): NodeFortificationState {
  return {
    truMaPhaoLevel: 0,
    huyenTranLevel: 0,
    hoCuongGiapLevel: 0,
    tuLinhDaiLevel: 0,
  };
}

export function getNodeFortification(
  defenseState: CosmicDefenseState | undefined,
  nodeId: string
): NodeFortificationState {
  if (!defenseState || !defenseState.fortifications[nodeId]) {
    return getDefaultNodeFortification();
  }
  return defenseState.fortifications[nodeId];
}

// ─── Combat Power & Garrison Calculation ──────────────────────────────────────

export interface EffectiveDefensePowerResult {
  garrison: GarrisonDeployment | null;
  basePower: number;
  tuLinhDaiLevel: number;
  bonusPercent: number;
  totalPower: number;
}

/**
 * Tính toán Lực Chiến Trấn Thủ thực tế tại một Tinh Cầu
 * (Áp dụng buff khuếch đại từ Tụ Linh Trấn Ma Đài)
 */
export function calculateEffectiveDefensePower(
  nodeId: string,
  defenseState: CosmicDefenseState | undefined
): EffectiveDefensePowerResult {
  const garrison = defenseState?.garrisons[nodeId] || null;
  const forts = getNodeFortification(defenseState, nodeId);
  const tuLinhDaiLevel = forts.tuLinhDaiLevel;

  let bonusPercent = 0;
  if (tuLinhDaiLevel > 0) {
    const step = FORTIFICATION_CONFIGS.tu_linh_dai.steps[tuLinhDaiLevel - 1];
    bonusPercent = step?.effectValue || 0;
  }

  if (!garrison || garrison.type === 'none' || garrison.baseCombatPower <= 0) {
    return {
      garrison: null,
      basePower: 0,
      tuLinhDaiLevel,
      bonusPercent,
      totalPower: 0,
    };
  }

  const totalPower = Math.floor(garrison.baseCombatPower * (1 + bonusPercent / 100));

  return {
    garrison,
    basePower: garrison.baseCombatPower,
    tuLinhDaiLevel,
    bonusPercent,
    totalPower,
  };
}

/**
 * Tính toán Lực Chiến của thực thể người chơi muốn điều động trấn thủ
 */
export function getEntityCombatPower(
  type: GarrisonType,
  entityId: string | undefined,
  player: PlayerStats
): { entityName: string; baseCombatPower: number } {
  if (type === 'beast' && entityId) {
    const beasts = player.spiritBeasts || player.beasts || [];
    const beast = beasts.find(b => b.id === entityId);
    if (beast) {
      const stats = beast.stats;
      const basePower = (stats.atk * 3) + Math.floor(stats.hp / 5) + (stats.def * 2);
      return {
        entityName: beast.name || 'Linh Thú Trấn Thủ',
        baseCombatPower: Math.max(50000, basePower),
      };
    }
  }

  if (type === 'spirit') {
    const spirit = player.natalArtifact?.spirit;
    if (spirit) {
      const spiritLevel = spirit.stageLevel || (spirit as any).level || 1;
      const basePower = 100000 + (spiritLevel * 50000);
      return {
        entityName: spirit.name || 'Khí Linh Bản Mệnh',
        baseCombatPower: basePower,
      };
    }
  }

  if (type === 'disciple' && entityId) {
    const disciples = (player as any).customSectState?.disciples || [];
    const disciple = disciples.find((d: any) => d.id === entityId);
    if (disciple) {
      const combatPower = disciple.combatPower || (disciple.realmIndex ? disciple.realmIndex * 60000 : 80000);
      return {
        entityName: disciple.name || 'Chân Truyền Đệ Tử',
        baseCombatPower: combatPower,
      };
    }
  }

  return {
    entityName: 'Trấn Thủ Quân Vô Danh',
    baseCombatPower: 30000,
  };
}

// ─── Incursion Generation & Ticker ────────────────────────────────────────────

/**
 * Sinh ngẫu nhiên một đợt tập kích Hư Không Triều Tịch
 */
export function generateVoidIncursion(
  targetNodeId: string,
  cosmicState: CosmicState,
  playerRealm: number,
  forcedThreatLevel?: IncursionThreatLevel,
  now: number = Date.now()
): VoidIncursion {
  const node = COSMIC_NODES_MAP[targetNodeId];
  const nodeName = node?.name || 'Vô Danh Tinh Cầu';
  const sectorId = node?.sectorId || 'thai_vi';

  // Xác định cấp độ nguy hại (Threat Level)
  let threatLevel: IncursionThreatLevel = forcedThreatLevel || 'tieu_ba';
  if (!forcedThreatLevel) {
    const rand = Math.random();
    if (playerRealm >= 75) {
      threatLevel = rand < 0.25 ? 'tieu_ba' : rand < 0.65 ? 'trung_ba' : 'dai_ba';
    } else if (playerRealm >= 60) {
      threatLevel = rand < 0.45 ? 'tieu_ba' : rand < 0.85 ? 'trung_ba' : 'dai_ba';
    } else {
      threatLevel = rand < 0.75 ? 'tieu_ba' : 'trung_ba';
    }
  }

  // Chọn Boss và Hạm Đội
  const bossesOfThreat = VOID_BOSSES_CATALOG.filter(b => b.threatLevel === threatLevel);
  const boss = bossesOfThreat[Math.floor(Math.random() * bossesOfThreat.length)] || VOID_BOSSES_CATALOG[0];
  const fleetName = FLEET_NAMES_POOL[Math.floor(Math.random() * FLEET_NAMES_POOL.length)];

  // Scale theo Realm của người chơi
  const realmScale = Math.max(1, 1 + (playerRealm - 50) * 0.03);
  const enemyTotalHp = Math.floor(boss.baseHp * realmScale);
  const enemyAtk = Math.floor(boss.baseAtk * realmScale);
  const enemyCombatPower = Math.floor(boss.basePower * realmScale);

  // Tính thời gian tiếp cận có áp dụng hiệu ứng của Hỗn Độn Huyễn Trận
  const forts = getNodeFortification(cosmicState.defenseState, targetNodeId);
  const huyenTranLevel = forts.huyenTranLevel;
  let delayBonusPercent = 0;
  if (huyenTranLevel > 0) {
    const step = FORTIFICATION_CONFIGS.huyen_tran.steps[huyenTranLevel - 1];
    delayBonusPercent = step?.effectValue || 0;
  }

  const baseMinutes = THREAT_LEVEL_CONFIG[threatLevel].baseTimeMinutes;
  const effectiveMinutes = baseMinutes * (1 + delayBonusPercent / 100);
  const arrivalTimestamp = now + Math.round(effectiveMinutes * 60 * 1000);

  // Phần thưởng chiến lợi phẩm
  const baseLoot = THREAT_LEVEL_CONFIG[threatLevel].baseLoot;
  const lootRewards = {
    honDonThanThiet: Math.round(baseLoot.honDonThanThiet * (0.9 + Math.random() * 0.3)),
    tienThienDiBao: Math.round(baseLoot.tienThienDiBao * (0.9 + Math.random() * 0.3)),
    linhThach: Math.round(baseLoot.linhThach * (0.9 + Math.random() * 0.3)),
  };

  return {
    id: `inc_${now}_${Math.random().toString(36).slice(2, 7)}`,
    targetNodeId,
    targetNodeName: nodeName,
    sectorId,
    threatLevel,
    enemyLeaderName: boss.name,
    enemyFleetName: fleetName,
    enemyTotalHp,
    enemyCurrentHp: enemyTotalHp,
    enemyAtk,
    enemyCombatPower,
    dispatchedAt: now,
    arrivalTimestamp,
    status: 'approaching',
    lootRewards,
  };
}

/**
 * Đếm nhịp triều tịch hư không:
 * - Kiểm tra cập nhật trạng thái approaching -> sieging khi hết giờ
 * - Tự động kích hoạt đợt tập kích mới nếu đã qua chu kỳ thời gian (4-6h)
 */
export function tickCosmicIncursions(
  cosmicState: CosmicState,
  playerRealm: number,
  now: number = Date.now()
): {
  nextCosmicState: CosmicState;
  newIncursion: VoidIncursion | null;
  transitionedToSiege: VoidIncursion[];
} {
  const defenseState: CosmicDefenseState = cosmicState.defenseState
    ? { ...cosmicState.defenseState }
    : createDefaultCosmicDefenseState();

  const occupied = cosmicState.occupiedNodeIds || [];
  if (occupied.length === 0) {
    return {
      nextCosmicState: { ...cosmicState, defenseState },
      newIncursion: null,
      transitionedToSiege: [],
    };
  }

  // 1. Cập nhật các incursion đang tiếp cận -> chuyển thành 'sieging' nếu đã tới giờ
  const transitionedToSiege: VoidIncursion[] = [];
  const updatedActiveIncursions = (defenseState.activeIncursions || []).map(inc => {
    if (inc.status === 'approaching' && now >= inc.arrivalTimestamp) {
      const siegingInc: VoidIncursion = { ...inc, status: 'sieging' };
      transitionedToSiege.push(siegingInc);
      return siegingInc;
    }
    return inc;
  });

  // 2. Kiểm tra chu kỳ sinh đợt tập kích mới (mỗi 4 - 6 giờ hoặc khởi phát ban đầu)
  // Mỗi node chiếm đóng thêm làm tăng 3% khả năng bị tập kích (chu kỳ co ngắn lại)
  const baseIntervalMs = 4 * 3600 * 1000; // 4 giờ
  const occupancyReductionMs = Math.min(2 * 3600 * 1000, occupied.length * 15 * 60 * 1000);
  const effectiveIntervalMs = Math.max(1.5 * 3600 * 1000, baseIntervalMs - occupancyReductionMs);

  const lastCheck = defenseState.lastIncursionCheckTime || 0;
  const timeSinceLastIncursion = now - lastCheck;

  // Lọc các node hiện đang có incursion chủ động (approaching hoặc sieging)
  const occupiedNodesWithIncursion = new Set(
    updatedActiveIncursions
      .filter(inc => inc.status === 'approaching' || inc.status === 'sieging')
      .map(inc => inc.targetNodeId)
  );

  let newIncursion: VoidIncursion | null = null;
  // Giới hạn tối đa 2 đợt tập kích đồng thời để người chơi không bị ngợp
  if (
    occupiedNodesWithIncursion.size < 2 &&
    (timeSinceLastIncursion >= effectiveIntervalMs || defenseState.activeIncursions.length === 0)
  ) {
    const eligibleNodes = occupied.filter(nodeId => !occupiedNodesWithIncursion.has(nodeId));
    if (eligibleNodes.length > 0) {
      const targetNodeId = eligibleNodes[Math.floor(Math.random() * eligibleNodes.length)];
      newIncursion = generateVoidIncursion(targetNodeId, cosmicState, playerRealm, undefined, now);
      updatedActiveIncursions.push(newIncursion);
      defenseState.lastIncursionCheckTime = now;
    }
  }

  const nextDefenseState: CosmicDefenseState = {
    ...defenseState,
    activeIncursions: updatedActiveIncursions,
  };

  return {
    nextCosmicState: { ...cosmicState, defenseState: nextDefenseState },
    newIncursion,
    transitionedToSiege,
  };
}

// ─── Dual Defense Resolution Logic ────────────────────────────────────────────

export interface SimulatedDefenseReport {
  victory: boolean;
  incursionId: string;
  targetNodeId: string;
  targetNodeName: string;
  enemyLeaderName: string;
  truMaPhaoLevel: number;
  artilleryDamageDealt: number;
  artilleryDamagePercent: number;
  enemyHpRemaining: number;
  effectiveEnemyPower: number;
  garrisonPower: number;
  garrisonEntityName: string;
  winProbabilityPercent: number;
  crossFireDamageDealt?: number;
  crossFireSupportNodesCount?: number;
  gridAurasActive?: string[];
  absorbedShieldDamage?: number;
  lootRewards?: {
    honDonThanThiet: number;
    tienThienDiBao: number;
    linhThach: number;
  };
  cargoLoss?: {
    honDonLost: number;
    tienThienLost: number;
    linhThachLost: number;
  };
  fortificationDamagedType?: FortificationType;
  message: string;
}

/**
 * Phương án A: Tự Động Kết Toán Phòng Ngự Cứ Điểm (Simulated Garrison Defense)
 * - Cửu Cực Tru Ma Pháo nã trước 15% - 55% HP địch.
 * - Trấn Thủ Sĩ (Linh Thú/Khí Linh/Đệ Tử) giao chiến với tàn quân địch.
 */
export function resolveAutoGarrisonDefense(
  incursionId: string,
  cosmicState: CosmicState,
  player: PlayerStats,
  now: number = Date.now()
): {
  nextCosmicState: CosmicState;
  nextPlayer: PlayerStats;
  report: SimulatedDefenseReport;
} {
  const defenseState: CosmicDefenseState = cosmicState.defenseState
    ? { ...cosmicState.defenseState }
    : createDefaultCosmicDefenseState();

  const incursion = (defenseState.activeIncursions || []).find(i => i.id === incursionId);
  if (!incursion) {
    throw new Error('Không tìm thấy đợt tập kích tương ứng.');
  }

  const nodeId = incursion.targetNodeId;
  const forts = getNodeFortification(defenseState, nodeId);
  const garrisonResult = calculateEffectiveDefensePower(nodeId, defenseState);

  // 1. Cửu Cực Tru Ma Pháo nã đạn
  // 1. Cửu Cực Tru Ma Pháo nã đạn cục bộ
  let truMaPhaoPercent = 0;
  if (forts.truMaPhaoLevel > 0) {
    const step = FORTIFICATION_CONFIGS.tru_ma_phao.steps[forts.truMaPhaoLevel - 1];
    truMaPhaoPercent = step?.effectValue || 0;
  }
  const localArtilleryDamage = Math.floor(incursion.enemyTotalHp * (truMaPhaoPercent / 100));

  // 1.5. Hỏa Lực Bắn Tỉa Chi Viện Chéo từ Mạng Lưới Tinh Vực (Sector Resonance Support)
  const resonanceLinks = defenseState.resonanceLinks || defenseState.sectorResonanceGrid || [];
  let crossFireDamage = 0;
  let crossFireNodesCount = 0;
  let activeAuras: string[] = [];
  let absorbedShield = 0;
  let nextLinhThach = player.linhThach || 0;
  let nextEnergyBuffer = defenseState.crossFireEnergyBuffer || 0;

  if (resonanceLinks.length > 0) {
    const resonanceOutcome = calculateCrossFireArtillerySupport({
      defendingNodeId: nodeId,
      waveHp: Math.max(1, incursion.enemyTotalHp - localArtilleryDamage),
      waveAtk: incursion.enemyAtk,
      links: resonanceLinks,
      fortifications: defenseState.fortifications,
      garrisons: defenseState.garrisons,
      occupiedNodeIds: cosmicState.occupiedNodeIds,
      playerLinhThach: nextLinhThach,
      crossFireEnergyBuffer: nextEnergyBuffer,
    });

    crossFireDamage = resonanceOutcome.crossFireDamageTotal;
    crossFireNodesCount = resonanceOutcome.participatingNodes.filter(p => p.cannonsEngaged > 0).length;
    activeAuras = resonanceOutcome.activeAuras || [];
    absorbedShield = resonanceOutcome.absorbedShieldDamage;
    nextLinhThach = resonanceOutcome.remainingLinhThach;
    nextEnergyBuffer = resonanceOutcome.remainingEnergyBuffer;
  }

  const artilleryDamageDealt = localArtilleryDamage + crossFireDamage;
  const enemyHpRemaining = Math.max(1, incursion.enemyTotalHp - artilleryDamageDealt);

  // Lực chiến địch suy giảm tương ứng với lượng HP còn lại (nếu có Thái Vi Tỏa Ma Quang thì giảm thêm)
  let baseEnemyPowerAfterHp = Math.floor(incursion.enemyCombatPower * (enemyHpRemaining / incursion.enemyTotalHp));
  if (activeAuras.includes('thai_vi_toa_ma')) {
    baseEnemyPowerAfterHp = Math.floor(baseEnemyPowerAfterHp * 0.75);
  }
  const effectiveEnemyPower = Math.max(10000, baseEnemyPowerAfterHp);

  // 2. Tính tỷ lệ thắng (Hư Không Phản Chấn gia cố lá chắn cho lực lượng trấn thủ)
  const garrisonPower = garrisonResult.totalPower + Math.floor(absorbedShield * 0.5);
  let winProbability = 0;
  if (garrisonPower > 0) {
    // Tỷ lệ sức mạnh
    const ratio = garrisonPower / (garrisonPower + effectiveEnemyPower);
    // Chuẩn hóa xác suất thắng (dao động từ 10% đến 95%)
    winProbability = Math.min(0.95, Math.max(0.08, ratio * 1.15));
  } else {
    // Không có ai trấn thủ, chỉ có pháo -> tỷ lệ thắng
    winProbability = (truMaPhaoPercent >= 45 || crossFireDamage > incursion.enemyTotalHp * 0.4) ? 0.35 : 0.05;
  }

  const roll = Math.random();
  const victory = roll <= winProbability;

  let nextCosmicState = {
    ...cosmicState,
    defenseState: {
      ...defenseState,
      crossFireEnergyBuffer: nextEnergyBuffer,
    },
  };
  let nextPlayer = {
    ...player,
    linhThach: nextLinhThach,
    ...(player.spiritStones !== undefined ? { spiritStones: nextLinhThach } : {}),
  };

  if (victory) {
    // ─── THẮNG LỢI: Đánh lui kẻ địch, thu gom chiến lợi phẩm ───
    const loot = incursion.lootRewards;
    const currentCargo = nextCosmicState.cargo;
    const nextCargo = {
      ...currentCargo,
      honDonThanThiet: (currentCargo.honDonThanThiet || 0) + loot.honDonThanThiet,
      tienThienDiBao: (currentCargo.tienThienDiBao || 0) + loot.tienThienDiBao,
      linhThach: (currentCargo.linhThach || 0) + loot.linhThach,
    };

    const updatedIncursions = (defenseState.activeIncursions || []).map(inc => {
      if (inc.id === incursionId) {
        return { ...inc, status: 'repelled' as const, enemyCurrentHp: 0 };
      }
      return inc;
    });

    nextCosmicState = {
      ...nextCosmicState,
      cargo: nextCargo,
      defenseState: {
        ...nextCosmicState.defenseState,
        activeIncursions: updatedIncursions,
        incursionsRepelledCount: (defenseState.incursionsRepelledCount || 0) + 1,
      },
      eventLogs: [
        {
          timestamp: now,
          type: 'battle_win',
          nodeId,
          message: `🛡️ [Thủ Thành Thắng Lợi] Cứ điểm ${incursion.targetNodeName} đã đẩy lùi ${incursion.enemyLeaderName}! Nhận +${loot.honDonThanThiet} Thần Thiết, +${loot.tienThienDiBao} Dị Bảo.${crossFireNodesCount > 0 ? ` (Mạng lưới ${crossFireNodesCount} cứ điểm chi viện ${crossFireDamage.toLocaleString()} sát thương!)` : ''}`,
        },
        ...nextCosmicState.eventLogs.slice(0, 49),
      ],
    };

    const report: SimulatedDefenseReport = {
      victory: true,
      incursionId,
      targetNodeId: nodeId,
      targetNodeName: incursion.targetNodeName,
      enemyLeaderName: incursion.enemyLeaderName,
      truMaPhaoLevel: forts.truMaPhaoLevel,
      artilleryDamageDealt,
      artilleryDamagePercent: Math.round((artilleryDamageDealt / incursion.enemyTotalHp) * 100),
      enemyHpRemaining,
      effectiveEnemyPower,
      garrisonPower,
      garrisonEntityName: garrisonResult.garrison?.entityName || 'Không có trấn thủ sĩ',
      winProbabilityPercent: Math.round(winProbability * 100),
      crossFireDamageDealt: crossFireDamage,
      crossFireSupportNodesCount: crossFireNodesCount,
      gridAurasActive: activeAuras,
      absorbedShieldDamage: absorbedShield,
      lootRewards: loot,
      message: `Đại thắng! Trấn Thủ Sĩ cùng Cửu Cực Tru Ma Pháo ${crossFireNodesCount > 0 ? `và ${crossFireNodesCount} cứ điểm chi viện ` : ''}đã đánh tan hạm đội dị tộc, bảo toàn nguyên vẹn cứ điểm!`,
    };

    return { nextCosmicState, nextPlayer, report };
  } else {
    // ─── THẤT BẠI: Vỡ trận, cứ điểm bị hư hại và thất thoát tài nguyên ───
    const hoCuongGiapLevel = forts.hoCuongGiapLevel;
    let lossReductionPercent = 0;
    if (hoCuongGiapLevel > 0) {
      const step = FORTIFICATION_CONFIGS.ho_cuong_giap.steps[hoCuongGiapLevel - 1];
      lossReductionPercent = step?.effectValue || 0;
    }

    // Thiệt hại cơ bản 30% tài nguyên, được giảm bởi Hộ Cương Giáp
    const baseLossRate = 0.30;
    const effectiveLossRate = baseLossRate * (1 - lossReductionPercent / 100);

    const currentCargo = nextCosmicState.cargo;
    const honDonLost = Math.floor((currentCargo.honDonThanThiet || 0) * effectiveLossRate);
    const tienThienLost = Math.floor((currentCargo.tienThienDiBao || 0) * effectiveLossRate);
    const linhThachLost = Math.floor((currentCargo.linhThach || 0) * effectiveLossRate);

    const nextCargo = {
      ...currentCargo,
      honDonThanThiet: Math.max(0, (currentCargo.honDonThanThiet || 0) - honDonLost),
      tienThienDiBao: Math.max(0, (currentCargo.tienThienDiBao || 0) - tienThienLost),
      linhThach: Math.max(0, (currentCargo.linhThach || 0) - linhThachLost),
    };

    // Giảm 1 cấp của 1 công trình phòng ngự ngẫu nhiên (nếu có cấp > 0)
    const fortTypesWithLevel: FortificationType[] = [];
    if (forts.truMaPhaoLevel > 0) fortTypesWithLevel.push('tru_ma_phao');
    if (forts.huyenTranLevel > 0) fortTypesWithLevel.push('huyen_tran');
    if (forts.hoCuongGiapLevel > 0) fortTypesWithLevel.push('ho_cuong_giap');
    if (forts.tuLinhDaiLevel > 0) fortTypesWithLevel.push('tu_linh_dai');

    let damagedFortType: FortificationType | undefined;
    const updatedForts = { ...forts };

    if (fortTypesWithLevel.length > 0) {
      damagedFortType = fortTypesWithLevel[Math.floor(Math.random() * fortTypesWithLevel.length)];
      if (damagedFortType === 'tru_ma_phao') updatedForts.truMaPhaoLevel = Math.max(0, updatedForts.truMaPhaoLevel - 1);
      if (damagedFortType === 'huyen_tran') updatedForts.huyenTranLevel = Math.max(0, updatedForts.huyenTranLevel - 1);
      if (damagedFortType === 'ho_cuong_giap') updatedForts.hoCuongGiapLevel = Math.max(0, updatedForts.hoCuongGiapLevel - 1);
      if (damagedFortType === 'tu_linh_dai') updatedForts.tuLinhDaiLevel = Math.max(0, updatedForts.tuLinhDaiLevel - 1);
    }

    const updatedIncursions = (defenseState.activeIncursions || []).map(inc => {
      if (inc.id === incursionId) {
        return { ...inc, status: 'breached' as const };
      }
      return inc;
    });

    const updatedFortificationsRecord = {
      ...defenseState.fortifications,
      [nodeId]: updatedForts,
    };

    nextCosmicState = {
      ...nextCosmicState,
      cargo: nextCargo,
      defenseState: {
        ...nextCosmicState.defenseState,
        fortifications: updatedFortificationsRecord,
        activeIncursions: updatedIncursions,
        incursionsBreachedCount: (defenseState.incursionsBreachedCount || 0) + 1,
      },
      eventLogs: [
        {
          timestamp: now,
          type: 'battle_lose',
          nodeId,
          message: `🚨 [Cứ Điểm Thất Thủ] ${incursion.targetNodeName} bị quân đoàn ${incursion.enemyLeaderName} phá vỡ! Tổn thất ${honDonLost} Thần Thiết, ${tienThienLost} Dị Bảo.${crossFireNodesCount > 0 ? ` (Mạng lưới chi viện ${crossFireDamage.toLocaleString()} sát thương không đủ cứu viện)` : ''}`,
        },
        ...nextCosmicState.eventLogs.slice(0, 49),
      ],
    };

    const report: SimulatedDefenseReport = {
      victory: false,
      incursionId,
      targetNodeId: nodeId,
      targetNodeName: incursion.targetNodeName,
      enemyLeaderName: incursion.enemyLeaderName,
      truMaPhaoLevel: forts.truMaPhaoLevel,
      artilleryDamageDealt,
      artilleryDamagePercent: Math.round((artilleryDamageDealt / incursion.enemyTotalHp) * 100),
      enemyHpRemaining,
      effectiveEnemyPower,
      garrisonPower,
      garrisonEntityName: garrisonResult.garrison?.entityName || 'Không có trấn thủ sĩ',
      winProbabilityPercent: Math.round(winProbability * 100),
      crossFireDamageDealt: crossFireDamage,
      crossFireSupportNodesCount: crossFireNodesCount,
      gridAurasActive: activeAuras,
      absorbedShieldDamage: absorbedShield,
      cargoLoss: {
        honDonLost,
        tienThienLost,
        linhThachLost,
      },
      fortificationDamagedType: damagedFortType,
      message: `Cứ điểm bị chọc thủng! Kẻ địch cướp phá hầm mỏ, công trình phòng ngự bị phá hủy một phần.`,
    };

    return { nextCosmicState, nextPlayer, report };
  }
}

/**
 * Phương án B: Ngự Chu Nghênh Chiến Trực Tiếp (Manual Interception)
 * Người chơi trực tiếp lái Thái Hư Tinh Chu tới cứ điểm giải vây.
 * Nhận thưởng x2 khi chiến thắng!
 */
export function resolveManualInterceptionBattle(
  incursionId: string,
  playerVictory: boolean,
  cosmicState: CosmicState,
  now: number = Date.now()
): {
  nextCosmicState: CosmicState;
  lootAwarded?: {
    honDonThanThiet: number;
    tienThienDiBao: number;
    linhThach: number;
  };
} {
  const defenseState: CosmicDefenseState = cosmicState.defenseState
    ? { ...cosmicState.defenseState }
    : createDefaultCosmicDefenseState();

  const incursion = (defenseState.activeIncursions || []).find(i => i.id === incursionId);
  if (!incursion) {
    return { nextCosmicState: cosmicState };
  }

  let nextCosmicState = { ...cosmicState };

  if (playerVictory) {
    // Nhận thưởng gấp đôi cho dũng khí đích thân ngự chu nghênh chiến
    const lootAwarded = {
      honDonThanThiet: incursion.lootRewards.honDonThanThiet * 2,
      tienThienDiBao: incursion.lootRewards.tienThienDiBao * 2,
      linhThach: incursion.lootRewards.linhThach * 2,
    };

    const currentCargo = nextCosmicState.cargo;
    const nextCargo = {
      ...currentCargo,
      honDonThanThiet: (currentCargo.honDonThanThiet || 0) + lootAwarded.honDonThanThiet,
      tienThienDiBao: (currentCargo.tienThienDiBao || 0) + lootAwarded.tienThienDiBao,
      linhThach: (currentCargo.linhThach || 0) + lootAwarded.linhThach,
    };

    const updatedIncursions = (defenseState.activeIncursions || []).map(inc => {
      if (inc.id === incursionId) {
        return { ...inc, status: 'repelled' as const, enemyCurrentHp: 0 };
      }
      return inc;
    });

    nextCosmicState = {
      ...nextCosmicState,
      cargo: nextCargo,
      defenseState: {
        ...defenseState,
        activeIncursions: updatedIncursions,
        incursionsRepelledCount: (defenseState.incursionsRepelledCount || 0) + 1,
      },
      eventLogs: [
        {
          timestamp: now,
          type: 'battle_win',
          nodeId: incursion.targetNodeId,
          message: `👑 [Đích Thân Trảm Ma] Ngự chu tiếp viện cứ điểm ${incursion.targetNodeName}, trảm sát ${incursion.enemyLeaderName}! Nhận x2 Chiến Lợi Phẩm (+${lootAwarded.honDonThanThiet} Thần Thiết, +${lootAwarded.tienThienDiBao} Dị Bảo).`,
        },
        ...nextCosmicState.eventLogs.slice(0, 49),
      ],
    };

    return { nextCosmicState, lootAwarded };
  } else {
    // Thất bại trong trận chiến tay đôi -> chuyển sang trạng thái bị phá vỡ
    const updatedIncursions = (defenseState.activeIncursions || []).map(inc => {
      if (inc.id === incursionId) {
        return { ...inc, status: 'breached' as const };
      }
      return inc;
    });

    nextCosmicState = {
      ...nextCosmicState,
      defenseState: {
        ...defenseState,
        activeIncursions: updatedIncursions,
        incursionsBreachedCount: (defenseState.incursionsBreachedCount || 0) + 1,
      },
    };

    return { nextCosmicState };
  }
}

// ─── Fortification Upgrade & Garrison Management ──────────────────────────────

export function canUpgradeFortification(
  nodeId: string,
  type: FortificationType,
  cosmicState: CosmicState,
  player: PlayerStats
): { allowed: boolean; reason?: string; cost?: any } {
  const forts = getNodeFortification(cosmicState.defenseState, nodeId);
  let currentLevel = 0;
  if (type === 'tru_ma_phao') currentLevel = forts.truMaPhaoLevel;
  if (type === 'huyen_tran') currentLevel = forts.huyenTranLevel;
  if (type === 'ho_cuong_giap') currentLevel = forts.hoCuongGiapLevel;
  if (type === 'tu_linh_dai') currentLevel = forts.tuLinhDaiLevel;

  if (currentLevel >= 5) {
    return { allowed: false, reason: 'Công trình này đã đạt cấp tối đa (Cấp 5)!' };
  }

  const nextStep = FORTIFICATION_CONFIGS[type].steps[currentLevel];
  if (!nextStep) {
    return { allowed: false, reason: 'Không tìm thấy cấu hình cấp tiếp theo.' };
  }

  const cost = nextStep.cost;
  const cargo = cosmicState.cargo;

  const playerLinhThach = player.spiritStones || 0;
  const cargoHonDon = cargo.honDonThanThiet || 0;
  const cargoTienThien = cargo.tienThienDiBao || 0;

  if (playerLinhThach < cost.linhThach) {
    return {
      allowed: false,
      reason: `Thiếu Linh Thạch! Cần ${cost.linhThach.toLocaleString()}, hiện có ${playerLinhThach.toLocaleString()}.`,
      cost,
    };
  }

  if (cargoHonDon < cost.honDonThanThiet) {
    return {
      allowed: false,
      reason: `Thiếu Hỗn Độn Thần Thiết! Cần ${cost.honDonThanThiet}, khoang hiện có ${cargoHonDon}.`,
      cost,
    };
  }

  if (cargoTienThien < cost.tienThienDiBao) {
    return {
      allowed: false,
      reason: `Thiếu Tiên Thiên Dị Bảo! Cần ${cost.tienThienDiBao}, khoang hiện có ${cargoTienThien}.`,
      cost,
    };
  }

  return { allowed: true, cost };
}

export function upgradeFortification(
  nodeId: string,
  type: FortificationType,
  cosmicState: CosmicState,
  player: PlayerStats,
  now: number = Date.now()
): {
  nextCosmicState: CosmicState;
  nextPlayer: PlayerStats;
  upgradedLevel: number;
} {
  const check = canUpgradeFortification(nodeId, type, cosmicState, player);
  if (!check.allowed || !check.cost) {
    throw new Error(check.reason || 'Không đủ điều kiện nâng cấp công trình.');
  }

  const cost = check.cost;
  const defenseState: CosmicDefenseState = cosmicState.defenseState
    ? { ...cosmicState.defenseState }
    : createDefaultCosmicDefenseState();

  const currentForts = getNodeFortification(defenseState, nodeId);
  const updatedForts = { ...currentForts };

  let upgradedLevel = 1;
  if (type === 'tru_ma_phao') {
    updatedForts.truMaPhaoLevel += 1;
    upgradedLevel = updatedForts.truMaPhaoLevel;
  } else if (type === 'huyen_tran') {
    updatedForts.huyenTranLevel += 1;
    upgradedLevel = updatedForts.huyenTranLevel;
  } else if (type === 'ho_cuong_giap') {
    updatedForts.hoCuongGiapLevel += 1;
    upgradedLevel = updatedForts.hoCuongGiapLevel;
  } else if (type === 'tu_linh_dai') {
    updatedForts.tuLinhDaiLevel += 1;
    upgradedLevel = updatedForts.tuLinhDaiLevel;
  }

  // Khấu trừ tài nguyên
  const nextPlayer: PlayerStats = {
    ...player,
    spiritStones: (player.spiritStones || 0) - cost.linhThach,
  };

  const nextCargo = {
    ...cosmicState.cargo,
    honDonThanThiet: (cosmicState.cargo.honDonThanThiet || 0) - cost.honDonThanThiet,
    tienThienDiBao: (cosmicState.cargo.tienThienDiBao || 0) - cost.tienThienDiBao,
  };

  const nodeName = COSMIC_NODES_MAP[nodeId]?.name || nodeId;
  const config = FORTIFICATION_CONFIGS[type];

  const nextCosmicState: CosmicState = {
    ...cosmicState,
    cargo: nextCargo,
    defenseState: {
      ...defenseState,
      fortifications: {
        ...defenseState.fortifications,
        [nodeId]: updatedForts,
      },
    },
    eventLogs: [
      {
        timestamp: now,
        type: 'upgrade',
        nodeId,
        message: `🛠️ Nâng cấp [${config.name}] tại ${nodeName} lên Cấp ${upgradedLevel}!`,
      },
      ...cosmicState.eventLogs.slice(0, 49),
    ],
  };

  return { nextCosmicState, nextPlayer, upgradedLevel };
}

export function assignGarrisonToNode(
  nodeId: string,
  deployment: GarrisonDeployment,
  cosmicState: CosmicState,
  now: number = Date.now()
): CosmicState {
  const defenseState: CosmicDefenseState = cosmicState.defenseState
    ? { ...cosmicState.defenseState }
    : createDefaultCosmicDefenseState();

  const nodeName = COSMIC_NODES_MAP[nodeId]?.name || nodeId;
  const entityDesc = deployment.type === 'none'
    ? 'Hủy bỏ trấn thủ'
    : `Bố trí [${deployment.entityName}] (Lực Chiến: ${deployment.baseCombatPower.toLocaleString()})`;

  return {
    ...cosmicState,
    defenseState: {
      ...defenseState,
      garrisons: {
        ...defenseState.garrisons,
        [nodeId]: deployment,
      },
    },
    eventLogs: [
      {
        timestamp: now,
        type: 'upgrade',
        nodeId,
        message: `🛡️ [Trấn Thủ Sĩ] ${nodeName}: ${entityDesc}.`,
      },
      ...cosmicState.eventLogs.slice(0, 49),
    ],
  };
}

/**
 * Hỗ trợ kích hoạt thử nghiệm một đợt tập kích ngay lập tức (dành cho người chơi muốn nghênh chiến ngay)
 */
export function triggerManualIncursionForTesting(
  cosmicState: CosmicState,
  targetNodeId: string,
  threatLevel: IncursionThreatLevel = 'tieu_ba',
  playerRealm: number = 60,
  now: number = Date.now()
): { nextCosmicState: CosmicState; incursion: VoidIncursion } {
  const defenseState: CosmicDefenseState = cosmicState.defenseState
    ? { ...cosmicState.defenseState }
    : createDefaultCosmicDefenseState();

  const incursion = generateVoidIncursion(targetNodeId, cosmicState, playerRealm, threatLevel, now);

  const nextDefenseState: CosmicDefenseState = {
    ...defenseState,
    activeIncursions: [
      ...(defenseState.activeIncursions || []).filter(i => i.targetNodeId !== targetNodeId),
      incursion,
    ],
    lastIncursionCheckTime: now,
  };

  const nextCosmicState: CosmicState = {
    ...cosmicState,
    defenseState: nextDefenseState,
  };

  return { nextCosmicState, incursion };
}

/**
 * Mô phỏng và giải quyết các đợt tập kích khi người chơi ngoại tuyến (Offline Progress Sync)
 * Tự động quét mạng lưới cộng hưởng lân cận để trừ máu quái trước khi tính vào độ bền cứ điểm
 */
export function resolveOfflineCosmicDefense(
  cosmicState: CosmicState,
  player: PlayerStats,
  now: number = Date.now()
): {
  nextCosmicState: CosmicState;
  nextPlayer: PlayerStats;
  reports: SimulatedDefenseReport[];
} {
  const defenseState = cosmicState.defenseState;
  if (!defenseState || !Array.isArray(defenseState.activeIncursions) || defenseState.activeIncursions.length === 0) {
    return { nextCosmicState: cosmicState, nextPlayer: player, reports: [] };
  }

  let curCosmicState = cosmicState;
  let curPlayer = player;
  const reports: SimulatedDefenseReport[] = [];

  const incursionsToResolve = (defenseState.activeIncursions || []).filter(
    inc => (inc.status === 'sieging' || (inc.status === 'approaching' && now >= inc.arrivalTimestamp))
  );

  for (const inc of incursionsToResolve) {
    try {
      const outcome = resolveAutoGarrisonDefense(inc.id, curCosmicState, curPlayer, now);
      curCosmicState = outcome.nextCosmicState;
      curPlayer = outcome.nextPlayer;
      reports.push(outcome.report);
    } catch {
      // Bỏ qua incursion nếu có lỗi
    }
  }

  return {
    nextCosmicState: curCosmicState,
    nextPlayer: curPlayer,
    reports,
  };
}
