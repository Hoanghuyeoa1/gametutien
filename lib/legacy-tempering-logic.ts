// lib/legacy-tempering-logic.ts
// Pure Business Logic Engine: Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh (Legacy Tempering & Blood-Bonding)
// 100% Strict TypeScript, Pure Functions, Immutable Deep Copy, Clean Architecture

import { Equipment } from './types/items';
import {
  BloodBondMetadata,
  ReforgeCostRequirement,
  ReforgePreviewResult,
  LegacyTemperingPlayerState
} from './types/legacy-tempering';
import { parseGradeToTier } from './artisan-lock-logic';

// ============================================================================
// 1. CONFIG & SCALE MATRIX: TIER_STAT_SCALE_CONFIG
// ============================================================================

export interface TierScaleConfigEntry {
  tier: number;
  realmName: string;
  gradeName: string;
  scaleMultiplier: number;
  baseMineral: {
    itemId: string;
    name: string;
    baseAmount: number;
  };
  spiritStonesCost: number;
  requiredBlacksmithRealmIndex: number;
}

/**
 * Thang Điểm & Hệ Số Tăng Tiến Chỉ Số Từ Tier 1 (Luyện Khí) Đến Tier 9 (Độ Kiếp/Tiên Nhân)
 */
export const TIER_STAT_SCALE_CONFIG: Record<number, TierScaleConfigEntry> = {
  1: {
    tier: 1,
    realmName: 'Luyện Khí',
    gradeName: 'Nhất Giai (Phàm Khí)',
    scaleMultiplier: 1.0,
    baseMineral: { itemId: 'huyen_thiet', name: 'Huyền Thiết', baseAmount: 10 },
    spiritStonesCost: 1000,
    requiredBlacksmithRealmIndex: 1
  },
  2: {
    tier: 2,
    realmName: 'Trúc Cơ',
    gradeName: 'Nhị Giai (Linh Khí)',
    scaleMultiplier: 1.8,
    baseMineral: { itemId: 'canh_kim', name: 'Canh Kim Thạch', baseAmount: 20 },
    spiritStonesCost: 5000,
    requiredBlacksmithRealmIndex: 11
  },
  3: {
    tier: 3,
    realmName: 'Kim Đan',
    gradeName: 'Tam Giai (Bảo Khí)',
    scaleMultiplier: 3.2,
    baseMineral: { itemId: 'han_bang_tinh', name: 'Hàn Băng Tinh', baseAmount: 35 },
    spiritStonesCost: 25000,
    requiredBlacksmithRealmIndex: 16
  },
  4: {
    tier: 4,
    realmName: 'Nguyên Anh',
    gradeName: 'Tứ Giai (Cổ Bảo)',
    scaleMultiplier: 5.8,
    baseMineral: { itemId: 'thien_ngoai_vi_thach', name: 'Thiên Ngoại Vi Thạch', baseAmount: 50 },
    spiritStonesCost: 100000,
    requiredBlacksmithRealmIndex: 21
  },
  5: {
    tier: 5,
    realmName: 'Hóa Thần',
    gradeName: 'Ngũ Giai (Hóa Thần Bảo)',
    scaleMultiplier: 10.5,
    baseMineral: { itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', baseAmount: 75 },
    spiritStonesCost: 500000,
    requiredBlacksmithRealmIndex: 26
  },
  6: {
    tier: 6,
    realmName: 'Luyện Hư',
    gradeName: 'Lục Giai (Thông Thiên Linh Bảo)',
    scaleMultiplier: 18.0,
    baseMineral: { itemId: 'thai_at_tinh_kim', name: 'Thái Ất Tinh Kim', baseAmount: 100 },
    spiritStonesCost: 2500000,
    requiredBlacksmithRealmIndex: 31
  },
  7: {
    tier: 7,
    realmName: 'Hợp Thể',
    gradeName: 'Thất Giai (Huyền Thiên Linh Bảo)',
    scaleMultiplier: 32.0,
    baseMineral: { itemId: 'cuu_u_minh_thiet', name: 'Cửu U Minh Thiết', baseAmount: 150 },
    spiritStonesCost: 12000000,
    requiredBlacksmithRealmIndex: 36
  },
  8: {
    tier: 8,
    realmName: 'Đại Thừa',
    gradeName: 'Bát Giai (Hồng Mông Tiên Khí)',
    scaleMultiplier: 55.0,
    baseMineral: { itemId: 'hong_mong_tu_tinh', name: 'Hồng Mông Tử Tinh', baseAmount: 200 },
    spiritStonesCost: 60000000,
    requiredBlacksmithRealmIndex: 41
  },
  9: {
    tier: 9,
    realmName: 'Độ Kiếp',
    gradeName: 'Cửu Giai (Thái Sơ Thần Binh)',
    scaleMultiplier: 90.0,
    baseMineral: { itemId: 'thien_dao_than_thach', name: 'Thiên Đạo Thần Thạch', baseAmount: 300 },
    spiritStonesCost: 250000000,
    requiredBlacksmithRealmIndex: 46
  }
};

/**
 * Trích xuất Giai Vị (Tier 1 -> 9) của trang bị an toàn
 */
export function resolveEquipmentTier(equipment: Equipment): number {
  if (typeof equipment.tier === 'number' && equipment.tier >= 1) {
    return Math.min(9, Math.max(1, Math.floor(equipment.tier)));
  }
  const parsed = parseGradeToTier(equipment.grade || 1);
  return Math.min(9, Math.max(1, Math.floor(parsed || 1)));
}

// ============================================================================
// 2. PURE FUNCTION: calculateReforgeStatsScale
// ============================================================================

/**
 * Thẩm định & Dự phóng chỉ số trang bị khi Trùng Chú lên Tier mục tiêu:
 * - Validation: Bắt buộc targetTier > currentTier. Nếu không hợp lệ -> ném ngoại lệ rõ ràng.
 * - Công thức tăng tiến:
 *     Stat_projected = Math.round(Stat_current * (Scale(targetTier) / Scale(currentTier)))
 * - Bảo tồn 100% thuộc tính quý:
 *     * preservedAlloyName: từ alloyMetadata
 *     * preservedInscriptionCount: số lượng trận đồ đã khắc trên mạch dẫn linh
 *     * preservedSoulName: từ infusedSoul
 * - Pure Function: 100% không biến đổi dữ liệu đầu vào.
 */
export function calculateReforgeStatsScale(
  equipment: Equipment,
  targetTier: number
): ReforgePreviewResult {
  if (!equipment || !equipment.id) {
    throw new Error('Trang bị mục tiêu không hợp lệ hoặc dữ liệu bị thiếu.');
  }

  const currentTier = resolveEquipmentTier(equipment);

  if (typeof targetTier !== 'number' || targetTier < 1 || targetTier > 9) {
    throw new Error(`Cảnh giới mục tiêu (${targetTier}) không hợp lệ. Phải nằm trong khoảng từ Tier 1 đến Tier 9.`);
  }

  if (targetTier <= currentTier) {
    throw new Error(
      `Cảnh giới mục tiêu (Tier ${targetTier}) phải lớn hơn cảnh giới hiện tại của trang bị (Tier ${currentTier}).`
    );
  }

  const currentConfig = TIER_STAT_SCALE_CONFIG[currentTier] || TIER_STAT_SCALE_CONFIG[1];
  const targetConfig = TIER_STAT_SCALE_CONFIG[targetTier] || TIER_STAT_SCALE_CONFIG[9];

  const currentScale = currentConfig.scaleMultiplier;
  const targetScale = targetConfig.scaleMultiplier;
  const ratio = targetScale / currentScale;

  // Lấy các chỉ số cơ bản hiện thời của trang bị
  const currentAtk = equipment.atkBonus ?? equipment.powerBonus ?? (equipment.stats?.atk || 0);
  const currentDef = equipment.defBonus ?? (equipment.stats?.def || 0);
  const currentHp = equipment.hpBonus ?? (equipment.stats?.hp || 0);

  // Tính toán chỉ số dự phóng theo tỷ lệ thang bậc
  const projectedAtk = Math.max(1, Math.round(currentAtk * ratio));
  const projectedDef = currentDef > 0 ? Math.max(1, Math.round(currentDef * ratio)) : 0;
  const projectedHp = currentHp > 0 ? Math.max(1, Math.round(currentHp * ratio)) : 0;

  // Trích xuất các thành tố quý được bảo toàn
  const preservedAlloyName = equipment.alloyMetadata?.archetypeName || equipment.name;

  let preservedInscriptionCount = 0;
  if (equipment.inscriptionData?.conduits && Array.isArray(equipment.inscriptionData.conduits)) {
    preservedInscriptionCount = equipment.inscriptionData.conduits.filter(
      c => c.isUnlocked && c.inscribedFormationId
    ).length;
  }

  const preservedSoulName = equipment.infusedSoul?.soulName || undefined;

  // Tính toán chi phí Trùng Chú
  const costs: ReforgeCostRequirement = {
    targetTier,
    requiredMinerals: [
      {
        itemId: targetConfig.baseMineral.itemId,
        name: targetConfig.baseMineral.name,
        amount: targetConfig.baseMineral.baseAmount
      }
    ],
    spiritStonesCost: targetConfig.spiritStonesCost,
    requiredBlacksmithRealmIndex: targetConfig.requiredBlacksmithRealmIndex
  };

  return {
    currentTier,
    targetTier,
    currentAtk,
    projectedAtk,
    currentDef,
    projectedDef,
    currentHp,
    projectedHp,
    preservedAlloyName,
    preservedInscriptionCount,
    preservedSoulName,
    costs
  };
}

// ============================================================================
// 3. PURE FUNCTION: applyEquipmentReforge
// ============================================================================

/**
 * Thực thi Trùng Chú Tái Sinh cho Thần Binh:
 * - Nâng trang bị lên targetTier.
 * - Cập nhật chỉ số ATK, DEF, HP, powerBonus theo tỷ lệ tăng tiến.
 * - Tăng biến đếm reforgeCount += 1.
 * - Sao chép sâu (Deep Copy) toàn vẹn 100% dữ liệu alloyMetadata, inscriptionData, infusedSoul, bloodBondData.
 * - Pure Function: Trả về bản sao đối tượng mới hoàn toàn.
 */
export function applyEquipmentReforge(
  equipment: Equipment,
  targetTier: number
): Equipment {
  // Thẩm định và lấy chỉ số dự phóng
  const preview = calculateReforgeStatsScale(equipment, targetTier);
  const targetConfig = TIER_STAT_SCALE_CONFIG[targetTier] || TIER_STAT_SCALE_CONFIG[9];

  // Deep clone toàn bộ mảng và lồng sâu
  const clonedAffixes = Array.isArray(equipment.affixes)
    ? equipment.affixes.map(a => ({ ...a }))
    : undefined;

  const clonedSockets = Array.isArray(equipment.sockets)
    ? equipment.sockets.map(s => ({
        ...s,
        gem: s.gem ? { ...s.gem } : null
      }))
    : undefined;

  const clonedAlloy = equipment.alloyMetadata
    ? {
        ...equipment.alloyMetadata,
        alloyComposition: {
          ...equipment.alloyMetadata.alloyComposition,
          ores: Array.isArray(equipment.alloyMetadata.alloyComposition?.ores)
            ? equipment.alloyMetadata.alloyComposition.ores.map(o => ({ ...o }))
            : [],
          elementalStats: { ...(equipment.alloyMetadata.alloyComposition?.elementalStats || {}) },
          specialAffixes: equipment.alloyMetadata.alloyComposition?.specialAffixes
            ? { ...equipment.alloyMetadata.alloyComposition.specialAffixes }
            : undefined
        },
        elementalEffects: { ...(equipment.alloyMetadata.elementalEffects || {}) },
        archetypeMultipliers: { ...(equipment.alloyMetadata.archetypeMultipliers || {}) }
      }
    : null;

  const clonedInscription = equipment.inscriptionData
    ? {
        ...equipment.inscriptionData,
        conduits: Array.isArray(equipment.inscriptionData.conduits)
          ? equipment.inscriptionData.conduits.map(c => ({
              ...c,
              currentEffects: Array.isArray(c.currentEffects)
                ? c.currentEffects.map(e => ({ ...e }))
                : []
            }))
          : []
      }
    : null;

  const clonedSoul = equipment.infusedSoul
    ? {
        ...equipment.infusedSoul,
        baseProc: { ...equipment.infusedSoul.baseProc },
        currentProc: { ...equipment.infusedSoul.currentProc },
        dialoguePool: {
          onCombatStart: [...(equipment.infusedSoul.dialoguePool?.onCombatStart || [])],
          onVictory: [...(equipment.infusedSoul.dialoguePool?.onVictory || [])],
          onLowHealth: [...(equipment.infusedSoul.dialoguePool?.onLowHealth || [])],
          onIdle: [...(equipment.infusedSoul.dialoguePool?.onIdle || [])]
        }
      }
    : null;

  const clonedBloodBond = equipment.bloodBondData
    ? { ...equipment.bloodBondData }
    : null;

  const updatedEquipment: Equipment = {
    ...equipment,
    tier: targetTier,
    grade: targetConfig.gradeName || equipment.grade,
    powerBonus: preview.projectedAtk,
    atkBonus: preview.projectedAtk,
    defBonus: preview.projectedDef,
    hpBonus: preview.projectedHp,
    stats: equipment.stats
      ? {
          ...equipment.stats,
          atk: preview.projectedAtk,
          def: preview.projectedDef,
          hp: preview.projectedHp
        }
      : undefined,
    reforgeCount: (equipment.reforgeCount || 0) + 1,
    affixes: clonedAffixes,
    sockets: clonedSockets,
    alloyMetadata: clonedAlloy,
    inscriptionData: clonedInscription,
    infusedSoul: clonedSoul,
    bloodBondData: clonedBloodBond
  };

  return updatedEquipment;
}

// ============================================================================
// 4. PURE FUNCTION: validateBloodBondEligibility
// ============================================================================

/**
 * Thẩm định điều kiện ký kết Huyết Khế Bản Mệnh:
 * - Lifespan Guard: Thọ nguyên còn lại của nhân vật phải > 15 năm.
 * - Anti-Rebond Guard: Trang bị chưa từng ký kết Huyết Khế (chặn ký lần 2).
 * - Pure Function: 100% không mutate dữ liệu.
 */
export function validateBloodBondEligibility(
  playerRemainingLifespan: number,
  equipment: Equipment
): { eligible: boolean; reason?: string } {
  if (!equipment || !equipment.id) {
    return {
      eligible: false,
      reason: 'Trang bị mục tiêu không tồn tại hoặc dữ liệu bị thiếu.'
    };
  }

  // 1. Anti-Rebond Guard: Chặn ký đè nhiều lần
  if (equipment.bloodBondData?.isBloodBound) {
    return {
      eligible: false,
      reason: 'Trang bị này đã ký kết Huyết Khế Bản Mệnh với chủ nhân, không thể lặp lại khế ước!'
    };
  }

  // 2. Lifespan Guard: Chặn tu sĩ sắp cạn thọ nguyên
  const lifespan = typeof playerRemainingLifespan === 'number' ? playerRemainingLifespan : 0;
  if (lifespan <= 15) {
    return {
      eligible: false,
      reason: `Thọ nguyên còn lại không đủ (${lifespan} năm <= 15 năm). Ký kết Huyết Khế tiêu hao thọ nguyên sẽ dẫn đến nguy cơ Tọa Hóa vẫn lạc!`
    };
  }

  return { eligible: true };
}

// ============================================================================
// 5. PURE FUNCTION: applyBloodBond
// ============================================================================

/**
 * Gán Huyết Khế Bản Mệnh vào Thần Binh:
 * - Gán bloodBondData với isBloodBound = true, combatPowerMultiplier = 1.30, disarmImmunity = true.
 * - Tiêu hao thọ nguyên hiến tế (lifespanSacrificed).
 * - Pure Function: Trả về bản sao trang bị mới, không mutate trực tiếp object ban đầu.
 */
export function applyBloodBond(
  equipment: Equipment,
  ownerId: string,
  ownerName: string,
  lifespanCost: number = 5,
  timestamp: number = Date.now()
): Equipment {
  if (!equipment) {
    throw new Error('Trang bị mục tiêu không hợp lệ.');
  }

  const bloodBondData: BloodBondMetadata = {
    isBloodBound: true,
    boundOwnerId: ownerId || 'unknown_owner',
    boundOwnerName: ownerName || 'Vô Danh Tu Sĩ',
    bondedAt: timestamp,
    lifespanSacrificed: Math.max(1, lifespanCost),
    combatPowerMultiplier: 1.30,
    disarmImmunity: true,
    bondResonanceLevel: 1
  };

  const clonedAffixes = Array.isArray(equipment.affixes)
    ? equipment.affixes.map(a => ({ ...a }))
    : undefined;

  const clonedSockets = Array.isArray(equipment.sockets)
    ? equipment.sockets.map(s => ({
        ...s,
        gem: s.gem ? { ...s.gem } : null
      }))
    : undefined;

  const updatedEquipment: Equipment = {
    ...equipment,
    stats: equipment.stats ? { ...equipment.stats } : undefined,
    affixes: clonedAffixes,
    sockets: clonedSockets,
    alloyMetadata: equipment.alloyMetadata
      ? {
          ...equipment.alloyMetadata,
          alloyComposition: {
            ...equipment.alloyMetadata.alloyComposition,
            ores: Array.isArray(equipment.alloyMetadata.alloyComposition?.ores)
              ? equipment.alloyMetadata.alloyComposition.ores.map(o => ({ ...o }))
              : [],
            elementalStats: { ...(equipment.alloyMetadata.alloyComposition?.elementalStats || {}) },
            specialAffixes: equipment.alloyMetadata.alloyComposition?.specialAffixes
              ? { ...equipment.alloyMetadata.alloyComposition.specialAffixes }
              : undefined
          },
          elementalEffects: { ...(equipment.alloyMetadata.elementalEffects || {}) },
          archetypeMultipliers: { ...(equipment.alloyMetadata.archetypeMultipliers || {}) }
        }
      : equipment.alloyMetadata,
    inscriptionData: equipment.inscriptionData
      ? {
          ...equipment.inscriptionData,
          conduits: Array.isArray(equipment.inscriptionData.conduits)
            ? equipment.inscriptionData.conduits.map(c => ({
                ...c,
                currentEffects: Array.isArray(c.currentEffects)
                  ? c.currentEffects.map(e => ({ ...e }))
                  : []
              }))
            : []
        }
      : equipment.inscriptionData,
    infusedSoul: equipment.infusedSoul
      ? {
          ...equipment.infusedSoul,
          baseProc: { ...equipment.infusedSoul.baseProc },
          currentProc: { ...equipment.infusedSoul.currentProc },
          dialoguePool: {
            onCombatStart: [...(equipment.infusedSoul.dialoguePool?.onCombatStart || [])],
            onVictory: [...(equipment.infusedSoul.dialoguePool?.onVictory || [])],
            onLowHealth: [...(equipment.infusedSoul.dialoguePool?.onLowHealth || [])],
            onIdle: [...(equipment.infusedSoul.dialoguePool?.onIdle || [])]
          }
        }
      : equipment.infusedSoul,
    bloodBondData
  };

  return updatedEquipment;
}
