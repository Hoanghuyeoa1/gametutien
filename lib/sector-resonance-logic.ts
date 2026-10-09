// lib/sector-resonance-logic.ts
// Pure Business Logic cho phân hệ "Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense / Tinh Vực Cộng Hưởng Trận)"
// Tuân thủ triệt để: Pure Logic Separation, Save Invariant, Energy Guard & Anti-Exploit

import type { PlayerStats } from './types/player';
import type { CosmicNode, CosmicState } from './types/cosmic-map';
import type {
  CosmicDefenseState,
  NodeFortificationState,
  GarrisonDeployment,
  VoidIncursion,
} from './types/cosmic-defense';
import type {
  SectorResonanceLink,
  CrossFireSupportReport,
  SectorResonanceDefenseResult,
  GridAuraType,
  ResonanceLinkEstablishCheck,
} from './types/sector-resonance';
import { FORTIFICATION_CONFIGS } from './cosmic-defense-data';
import { COSMIC_NODES_MAP } from './cosmic-map-data';

// ─── Constants & Configuration ───────────────────────────────────────────────

/** Bán kính cộng hưởng tối đa để thiết lập mạng lưới (đơn vị tọa độ) */
export const MAX_RESONANCE_DISTANCE = 250;

/** Mẫu số chuẩn hóa suy hao hỏa lực theo cự ly (1 - Distance / 300) */
export const DISTANCE_FALLOFF_BASE = 300;

/** Chi phí Tinh Thạch / Linh Thạch kích hoạt một tuyến liên kết */
export const LINK_ACTIVATION_COST_LINH_THACH = 5_000;

/** Chi phí nâng cấp dây chuyền truyền dẫn mỗi cấp */
export const LINK_UPGRADE_COST_LINH_THACH = 10_000;

/** Năng lượng / Linh Thạch tiêu hao cho mỗi phát đại pháo chi viện */
export const CROSS_FIRE_ENERGY_COST_PER_SHOT = 500;

/** Tỷ lệ giảm công kích của quái vật từ Thái Vi Tỏa Ma Quang (25%) */
export const THAI_VI_AURA_POWER_REDUCTION = 0.25;

/** Tỷ lệ chuyển hóa sát thương pháo thành lá chắn hộ trận từ Hư Không Phản Chấn (15%) */
export const HU_KHONG_AURA_SHIELD_CONVERSION = 0.15;

// ─── Geometry & Mathematical Calculations ────────────────────────────────────

/**
 * Tính khoảng cách Euclid giữa 2 tọa độ tinh cầu
 */
export function calculateCosmicDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.round(dist * 100) / 100;
}

/**
 * Tính hiệu suất truyền dẫn năng lượng (0.5 - 0.9) dựa theo khoảng cách
 * Công thức: Efficiency = 0.9 - 0.4 * (distance / 250)
 * Nâng cấp dây chuyền (+0.025 mỗi cấp, tối đa 0.95)
 */
export function calculateTransmissionEfficiency(
  distance: number,
  upgradeLevel: number = 1
): number {
  const clampedDist = Math.max(0, Math.min(MAX_RESONANCE_DISTANCE, distance));
  const base = 0.9 - 0.4 * (clampedDist / MAX_RESONANCE_DISTANCE);
  const bonus = Math.max(0, (upgradeLevel - 1) * 0.025);
  const total = Math.min(0.95, Math.max(0.5, base + bonus));
  return Math.round(total * 1000) / 1000;
}

/**
 * Công thức thuần tính sát thương pháo kích chi viện chéo:
 * Sát thương = (DamagePháo * TrấnThủSĩMultiplier) * TransmissionEfficiency * (1 - Distance / 300)
 */
export function calculateCrossFireDamage(
  cannonDamage: number,
  garrisonMultiplier: number = 1.0,
  distance: number,
  transmissionEfficiency?: number
): number {
  const efficiency = transmissionEfficiency ?? calculateTransmissionEfficiency(distance);
  const falloff = Math.max(0, 1 - distance / DISTANCE_FALLOFF_BASE);
  const damage = cannonDamage * garrisonMultiplier * efficiency * falloff;
  return Math.round(damage);
}

// ─── Topology Guard & Link Validation ─────────────────────────────────────────

export interface NodeCoordinateLookup {
  id: string;
  name?: string;
  x: number;
  y: number;
}

/**
 * Thẩm định điều kiện thiết lập liên kết giữa 2 Cứ Điểm Tinh Cầu
 */
export function canEstablishResonanceLink(
  sourceNodeId: string,
  targetNodeId: string,
  options: {
    occupiedNodeIds: string[];
    fortifications?: Record<string, NodeFortificationState>;
    nodesMap?: Record<string, NodeCoordinateLookup>;
    playerLinhThach: number;
    existingLinks?: SectorResonanceLink[];
  }
): ResonanceLinkEstablishCheck {
  if (sourceNodeId === targetNodeId) {
    return {
      allowed: false,
      reason: 'Không thể thiết lập liên kết với chính cứ điểm này.',
    };
  }

  // 1. Cả 2 cứ điểm phải do người chơi chiếm lĩnh
  const isSourceOccupied = options.occupiedNodeIds.includes(sourceNodeId);
  const isTargetOccupied = options.occupiedNodeIds.includes(targetNodeId);
  if (!isSourceOccupied || !isTargetOccupied) {
    return {
      allowed: false,
      reason: 'Cả 2 cứ điểm phải thuộc quyền chiếm lĩnh của người chơi.',
    };
  }

  // 2. Cả 2 cứ điểm đều đã lắp đặt tối thiểu 1 Tru Ma Pháo cấp 1 trở lên
  const sourceForts = options.fortifications?.[sourceNodeId];
  const targetForts = options.fortifications?.[targetNodeId];
  const sourceCannonLevel = sourceForts?.truMaPhaoLevel ?? 0;
  const targetCannonLevel = targetForts?.truMaPhaoLevel ?? 0;

  if (sourceCannonLevel < 1 || targetCannonLevel < 1) {
    return {
      allowed: false,
      reason: 'Cả 2 cứ điểm đều phải lắp đặt Cửu Cực Tru Ma Pháo (Cấp 1 trở lên) làm trụ truyền dẫn.',
    };
  }

  // 3. Kiểm tra liên kết đã tồn tại hay chưa
  const existingLinks = options.existingLinks || [];
  const alreadyLinked = existingLinks.some(
    l =>
      l.isActive &&
      ((l.sourceNodeId === sourceNodeId && l.targetNodeId === targetNodeId) ||
        (l.sourceNodeId === targetNodeId && l.targetNodeId === sourceNodeId))
  );
  if (alreadyLinked) {
    return {
      allowed: false,
      reason: 'Tuyến năng lượng giữa 2 cứ điểm này đã được thiết lập trước đó.',
    };
  }

  // 4. Kiểm tra tọa độ và khoảng cách Euclid (R <= 250)
  const nodeLookup = options.nodesMap || (COSMIC_NODES_MAP as unknown as Record<string, NodeCoordinateLookup>);
  const sourceNode = nodeLookup[sourceNodeId];
  const targetNode = nodeLookup[targetNodeId];

  if (!sourceNode || !targetNode) {
    return {
      allowed: false,
      reason: 'Không tìm thấy tọa độ vũ trụ của một trong hai cứ điểm.',
    };
  }

  const distance = calculateCosmicDistance(sourceNode, targetNode);
  if (distance > MAX_RESONANCE_DISTANCE) {
    return {
      allowed: false,
      distance,
      reason: `Khoảng cách vượt quá bán kính cộng hưởng tối đa (${distance.toFixed(1)} > ${MAX_RESONANCE_DISTANCE} đơn vị tọa độ).`,
    };
  }

  // 5. Kiểm tra tài nguyên kích hoạt
  if (options.playerLinhThach < LINK_ACTIVATION_COST_LINH_THACH) {
    return {
      allowed: false,
      distance,
      reason: `Không đủ Tinh Thạch / Linh Thạch kích hoạt trụ truyền dẫn (cần ${LINK_ACTIVATION_COST_LINH_THACH.toLocaleString()} Linh Thạch).`,
      activationCost: { linhThach: LINK_ACTIVATION_COST_LINH_THACH },
    };
  }

  const efficiency = calculateTransmissionEfficiency(distance, 1);
  return {
    allowed: true,
    distance,
    transmissionEfficiency: efficiency,
    activationCost: { linhThach: LINK_ACTIVATION_COST_LINH_THACH },
  };
}

/**
 * Thiết lập Tuyến Năng Lượng Tinh Vực mới
 */
export function establishResonanceLink(
  sourceNodeId: string,
  targetNodeId: string,
  options: {
    occupiedNodeIds: string[];
    fortifications?: Record<string, NodeFortificationState>;
    nodesMap?: Record<string, NodeCoordinateLookup>;
    playerLinhThach: number;
    existingLinks?: SectorResonanceLink[];
    now?: number;
  }
): {
  success: boolean;
  link?: SectorResonanceLink;
  remainingLinhThach: number;
  message: string;
} {
  const check = canEstablishResonanceLink(sourceNodeId, targetNodeId, options);
  if (!check.allowed || check.distance === undefined) {
    return {
      success: false,
      remainingLinhThach: options.playerLinhThach,
      message: check.reason || 'Không đủ điều kiện thiết lập liên kết.',
    };
  }

  const now = options.now || Date.now();
  const efficiency = check.transmissionEfficiency ?? calculateTransmissionEfficiency(check.distance, 1);

  const newLink: SectorResonanceLink = {
    id: `res_link_${sourceNodeId}_${targetNodeId}_${now}`,
    sourceNodeId,
    targetNodeId,
    distance: check.distance,
    isActive: true,
    energyTransmissionEfficiency: efficiency,
    establishedAt: now,
    upgradeLevel: 1,
  };

  return {
    success: true,
    link: newLink,
    remainingLinhThach: Math.max(0, options.playerLinhThach - LINK_ACTIVATION_COST_LINH_THACH),
    message: `Đã kết nối thành công Tuyến Năng Lượng Tinh Vực giữa ${sourceNodeId} và ${targetNodeId}!`,
  };
}

/**
 * Hủy liên kết Tuyến Năng Lượng
 */
export function disconnectResonanceLink(
  linkId: string,
  existingLinks: SectorResonanceLink[]
): {
  nextLinks: SectorResonanceLink[];
  removedLink: SectorResonanceLink | null;
} {
  const removedLink = existingLinks.find(l => l.id === linkId) || null;
  const nextLinks = existingLinks.filter(l => l.id !== linkId);
  return { nextLinks, removedLink };
}

/**
 * Nâng cấp dây chuyền truyền dẫn năng lượng
 */
export function upgradeResonanceLink(
  linkId: string,
  existingLinks: SectorResonanceLink[],
  playerLinhThach: number
): {
  success: boolean;
  nextLinks: SectorResonanceLink[];
  remainingLinhThach: number;
  message: string;
} {
  const linkIndex = existingLinks.findIndex(l => l.id === linkId);
  if (linkIndex === -1) {
    return {
      success: false,
      nextLinks: existingLinks,
      remainingLinhThach: playerLinhThach,
      message: 'Không tìm thấy tuyến năng lượng cần nâng cấp.',
    };
  }

  const link = existingLinks[linkIndex];
  const currentLevel = link.upgradeLevel || 1;
  if (currentLevel >= 5) {
    return {
      success: false,
      nextLinks: existingLinks,
      remainingLinhThach: playerLinhThach,
      message: 'Dây chuyền truyền dẫn đã đạt cấp tối đa (Cấp 5).',
    };
  }

  if (playerLinhThach < LINK_UPGRADE_COST_LINH_THACH) {
    return {
      success: false,
      nextLinks: existingLinks,
      remainingLinhThach: playerLinhThach,
      message: `Cần ${LINK_UPGRADE_COST_LINH_THACH.toLocaleString()} Linh Thạch để gia cố dây chuyền truyền dẫn.`,
    };
  }

  const nextLevel = currentLevel + 1;
  const nextEfficiency = calculateTransmissionEfficiency(link.distance, nextLevel);

  const updatedLink: SectorResonanceLink = {
    ...link,
    upgradeLevel: nextLevel,
    energyTransmissionEfficiency: nextEfficiency,
  };

  const nextLinks = [...existingLinks];
  nextLinks[linkIndex] = updatedLink;

  return {
    success: true,
    nextLinks,
    remainingLinhThach: playerLinhThach - LINK_UPGRADE_COST_LINH_THACH,
    message: `Đã nâng cấp dây chuyền truyền dẫn lên Cấp ${nextLevel}! Hiệu suất truyền đạt ${(nextEfficiency * 100).toFixed(1)}%.`,
  };
}

// ─── Resonance Grid Topology & Auras ─────────────────────────────────────────

export interface GridAuraEvaluationResult {
  activeAuras: GridAuraType[];
  hasTriangle: boolean;
  totalConnectedNodes: number;
  triangleNodes?: string[];
}

/**
 * Đánh giá Lĩnh Vực Cộng Hưởng Năng Lượng Đa Điểm
 * - Chu trình tam giác (3 cứ điểm nối vòng) HOẶC mạng lưới liên kết >= 3 cứ điểm
 * -> Kích hoạt: 'thai_vi_toa_ma' (giảm 25% công kích) và 'hu_khong_phan_chan' (15% sát thương thành khiên)
 */
export function evaluateResonanceGridAuras(
  links: SectorResonanceLink[]
): GridAuraEvaluationResult {
  const activeLinks = (links || []).filter(l => l.isActive !== false);
  if (activeLinks.length < 2) {
    return {
      activeAuras: [],
      hasTriangle: false,
      totalConnectedNodes: 0,
    };
  }

  // Xây dựng đồ thị vô hướng
  const adj = new Map<string, Set<string>>();
  for (const l of activeLinks) {
    if (!adj.has(l.sourceNodeId)) adj.set(l.sourceNodeId, new Set());
    if (!adj.has(l.targetNodeId)) adj.set(l.targetNodeId, new Set());
    adj.get(l.sourceNodeId)!.add(l.targetNodeId);
    adj.get(l.targetNodeId)!.add(l.sourceNodeId);
  }

  const uniqueNodes = Array.from(adj.keys());
  let hasTriangle = false;
  let triangleNodes: string[] | undefined = undefined;

  // Thuật toán kiểm tra tam giác (3-cycle)
  for (let i = 0; i < uniqueNodes.length; i++) {
    const u = uniqueNodes[i];
    const neighborsU = adj.get(u)!;

    for (let j = i + 1; j < uniqueNodes.length; j++) {
      const v = uniqueNodes[j];
      if (!neighborsU.has(v)) continue;

      for (let k = j + 1; k < uniqueNodes.length; k++) {
        const w = uniqueNodes[k];
        if (neighborsU.has(w) && adj.get(v)!.has(w)) {
          hasTriangle = true;
          triangleNodes = [u, v, w];
          break;
        }
      }
      if (hasTriangle) break;
    }
    if (hasTriangle) break;
  }

  // Mạng lưới có chu trình tam giác (3-cycle) hoặc mạng lưới kết nối >= 3 cứ điểm
  const hasThreeOrMoreNodes = uniqueNodes.length >= 3 && activeLinks.length >= 2;

  const activeAuras: GridAuraType[] = [];
  if (hasTriangle) {
    activeAuras.push('thai_vi_toa_ma');
  }
  if (hasTriangle || hasThreeOrMoreNodes) {
    activeAuras.push('hu_khong_phan_chan');
  }

  return {
    activeAuras,
    hasTriangle,
    totalConnectedNodes: uniqueNodes.length,
    triangleNodes,
  };
}

// ─── Cross-Fire Artillery Support Calculation ─────────────────────────────────

export interface CrossFireCalculationParams {
  defendingNodeId: string;
  waveHp: number;
  waveAtk?: number;
  links: SectorResonanceLink[];
  fortifications?: Record<string, NodeFortificationState>;
  garrisons?: Record<string, GarrisonDeployment>;
  occupiedNodeIds?: string[];
  nodesMap?: Record<string, NodeCoordinateLookup>;
  playerLinhThach?: number;
  crossFireEnergyBuffer?: number;
  /** Cho phép override trực tiếp sát thương cơ bản của pháo (dùng cho test/cố định) */
  baseCannonDamageOverride?: number;
}

export interface CrossFireSupportOutcome extends SectorResonanceDefenseResult {
  remainingLinhThach: number;
  remainingEnergyBuffer: number;
  totalEnergyConsumed: number;
  baseWaveAtk: number;
  reducedWaveAtk: number;
  hpRemainingAfterCrossFire: number;
}

/**
 * Tính toán Hỏa Lực Bắn Tỉa Chi Viện Chéo (Cross-Sector Artillery Support)
 * - Quét các cứ điểm lân cận liên kết với defendingNodeId
 * - Kiểm tra kho năng lượng/Tinh Thạch của người chơi (Anti-Exploit: cạn kiệt thì ngắt pháo ngay)
 * - Tính sát thương chi viện áp dụng cự ly và hiệu suất truyền dẫn
 * - Kích hoạt hiệu ứng Lĩnh Vực Cộng Hưởng (Thái Vi Tỏa Ma Quang, Hư Không Phản Chấn Trận)
 */
export function calculateCrossFireArtillerySupport(
  params: CrossFireCalculationParams
): CrossFireSupportOutcome {
  const {
    defendingNodeId,
    waveHp,
    waveAtk = 10_000,
    links,
    fortifications = {},
    garrisons = {},
    occupiedNodeIds = [],
    nodesMap,
    baseCannonDamageOverride,
  } = params;

  let currentLinhThach = params.playerLinhThach ?? 0;
  let currentBuffer = params.crossFireEnergyBuffer ?? 0;
  let totalEnergyConsumed = 0;

  const nodeLookup = nodesMap || (COSMIC_NODES_MAP as unknown as Record<string, NodeCoordinateLookup>);
  const logs: string[] = [];
  const participatingNodes: CrossFireSupportReport[] = [];

  // Lọc các liên kết đang kích hoạt nối tới defendingNodeId
  const connectedLinks = (links || []).filter(
    l => l.isActive !== false && (l.sourceNodeId === defendingNodeId || l.targetNodeId === defendingNodeId)
  );

  let crossFireDamageTotal = 0;

  for (const link of connectedLinks) {
    const supportingNodeId = link.sourceNodeId === defendingNodeId ? link.targetNodeId : link.sourceNodeId;
    const supportingNode = nodeLookup[supportingNodeId];
    const supportingNodeName = supportingNode?.name || supportingNodeId;

    // Kiểm tra cứ điểm chi viện có bị mất quyền chiếm lĩnh không
    if (occupiedNodeIds.length > 0 && !occupiedNodeIds.includes(supportingNodeId)) {
      continue;
    }

    const forts = fortifications[supportingNodeId] || { truMaPhaoLevel: 0 };
    const cannonLevel = forts.truMaPhaoLevel || 0;
    if (cannonLevel <= 0 && !baseCannonDamageOverride) {
      continue;
    }

    // ─── Anti-Exploit Guard: Kiểm tra tiêu hao năng lượng / Tinh Thạch ────────
    const energyNeeded = CROSS_FIRE_ENERGY_COST_PER_SHOT;
    const canAfford = (currentBuffer >= energyNeeded) || (currentLinhThach >= energyNeeded);

    if (!canAfford) {
      logs.push(
        `⚠️ [HẾT NĂNG LƯỢNG] Cứ điểm ${supportingNodeName} cạn kiệt Tinh Thạch, ngắt kết nối pháo kích chi viện!`
      );
      participatingNodes.push({
        supportingNodeId,
        supportingNodeName,
        cannonsEngaged: 0,
        totalDamageDealt: 0,
        energyConsumed: 0,
        critHits: 0,
      });
      continue;
    }

    // Khấu trừ tài nguyên (Ưu tiên buffer trước, sau đó tới Linh Thạch)
    if (currentBuffer >= energyNeeded) {
      currentBuffer -= energyNeeded;
    } else {
      currentLinhThach -= energyNeeded;
    }
    totalEnergyConsumed += energyNeeded;

    // ─── Tính toán Sát Thương Pháo Kích ────────────────────────────────────────
    let rawCannonDamage: number;
    if (typeof baseCannonDamageOverride === 'number') {
      rawCannonDamage = baseCannonDamageOverride;
    } else {
      const step = FORTIFICATION_CONFIGS.tru_ma_phao.steps[cannonLevel - 1];
      const cannonPercent = step?.effectValue || 15;
      rawCannonDamage = Math.floor(waveHp * (cannonPercent / 100));
    }

    // Hệ số trấn thủ sĩ
    let garrisonMultiplier = 1.0;
    const garrison = garrisons[supportingNodeId];
    if (garrison && garrison.type !== 'none' && garrison.baseCombatPower > 0) {
      // Có trấn thủ sĩ điều phối trận pháo: tăng từ 10% đến 25% hiệu lực
      garrisonMultiplier = Math.min(1.25, 1.0 + garrison.baseCombatPower / 1_000_000);
    }

    // Sát thương chi viện chéo đã suy hao theo cự ly và hiệu suất
    const nodeDamage = calculateCrossFireDamage(
      rawCannonDamage,
      garrisonMultiplier,
      link.distance,
      link.energyTransmissionEfficiency
    );

    crossFireDamageTotal += nodeDamage;

    participatingNodes.push({
      supportingNodeId,
      supportingNodeName,
      cannonsEngaged: 1,
      totalDamageDealt: nodeDamage,
      energyConsumed: energyNeeded,
      critHits: 0,
    });

    logs.push(
      `💥 Cứ điểm [${supportingNodeName}] khai hỏa Cửu Cực Tru Ma Pháo vượt không gian chi viện! Gây ${nodeDamage.toLocaleString()} sát thương (Cự ly: ${link.distance.toFixed(0)}, Hiệu suất: ${(link.energyTransmissionEfficiency * 100).toFixed(0)}%).`
    );
  }

  // ─── Kích hoạt Hiệu Ứng Lĩnh Vực Cộng Hưởng Đa Điểm ─────────────────────────
  const auraEval = evaluateResonanceGridAuras(links);
  const hpRemainingAfterCrossFire = Math.max(0, waveHp - crossFireDamageTotal);
  let reducedWavePower = hpRemainingAfterCrossFire;
  let reducedWaveAtk = waveAtk;
  let absorbedShieldDamage = 0;

  if (auraEval.activeAuras.includes('thai_vi_toa_ma')) {
    reducedWaveAtk = Math.round(waveAtk * (1 - THAI_VI_AURA_POWER_REDUCTION));
    logs.push(
      `🌌 [LĨNH VỰC] Thái Vi Tỏa Ma Quang phong tỏa chiến trường! Suy giảm ${(THAI_VI_AURA_POWER_REDUCTION * 100)}% uy lực hành quân của quân địch.`
    );
  }

  if (auraEval.activeAuras.includes('hu_khong_phan_chan')) {
    absorbedShieldDamage = Math.round(crossFireDamageTotal * HU_KHONG_AURA_SHIELD_CONVERSION);
    logs.push(
      `🛡️ [LĨNH VỰC] Hư Không Phản Chấn Trận chuyển hóa ${absorbedShieldDamage.toLocaleString()} hỏa lực thành màn chắn hộ trận!`
    );
  }

  const isVictorious = hpRemainingAfterCrossFire <= 0;

  return {
    defendingNodeId,
    baseWavePower: waveHp,
    crossFireDamageTotal,
    reducedWavePower,
    hpRemainingAfterCrossFire,
    baseWaveAtk: waveAtk,
    reducedWaveAtk,
    participatingNodes,
    gridAuraTriggered: auraEval.activeAuras[0],
    activeAuras: auraEval.activeAuras,
    absorbedShieldDamage,
    isVictorious,
    logs,
    remainingLinhThach: currentLinhThach,
    remainingEnergyBuffer: currentBuffer,
    totalEnergyConsumed,
  };
}

/**
 * Giải quyết phòng ngự toàn diện kết hợp hỏa lực cộng hưởng tinh vực
 */
export function resolveSectorResonanceDefense(
  defendingNodeId: string,
  waveHp: number,
  links: SectorResonanceLink[],
  fortifications: Record<string, NodeFortificationState>,
  garrisons: Record<string, GarrisonDeployment>,
  playerLinhThach: number,
  baseCannonDamageOverride?: number
): SectorResonanceDefenseResult {
  return calculateCrossFireArtillerySupport({
    defendingNodeId,
    waveHp,
    links,
    fortifications,
    garrisons,
    playerLinhThach,
    baseCannonDamageOverride,
  });
}
