// lib/weapon-tribulation-array-logic.ts
// Pure Business Logic Engine: Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân (Weapon Tribulation & Orbiting Array Sets)
// 100% Strict TypeScript, Pure Functions, Immutable Deep Copy, Clean Architecture

import { Equipment } from './types/items';
import {
  FormationSetCategory,
  WeaponTribulationStrike,
  LightningTemperedMetadata,
  FormationSetThresholdBonus,
  FormationSetConfig,
  PlayerFormationSetProgress,
  FormationSetsState
} from './types/weapon-tribulation-array';
import { resolveEquipmentTier } from './legacy-tempering-logic';

// ============================================================================
// 1. CONFIG & REGISTRY: FORMATION_SETS_REGISTRY
// ============================================================================

/**
 * Danh mục đăng ký 3 Bộ Trận Khí Tùy Thân Thượng Cổ Tiêu Chuẩn
 */
export const FORMATION_SETS_REGISTRY: Record<FormationSetCategory, FormationSetConfig> = {
  /**
   * 1. Chu Thiên Kiếm Trận (36 thanh phi kiếm)
   * - Mốc 12: +15% ATK, phóng 3 kiếm khí/lượt (turnDamagePercent: 20)
   * - Mốc 24: Kiếm Võng Hộ Thể (damageReductionPercent: 15)
   * - Mốc 36: Tuyệt Kỹ Chu Thiên Vạn Kiếm Trận (unlockedSkillName: 'Chu Thiên Vạn Kiếm Trận')
   */
  chu_thien_kiem: {
    id: 'chu_thien_kiem',
    name: 'Chu Thiên Tinh Đẩu Kiếm Trận',
    category: 'chu_thien_kiem',
    maxPieces: 36,
    pieceCraftCost: {
      minerals: [
        { itemId: 'thai_at_tinh_kim', name: 'Thái Ất Tinh Kim', amount: 5 },
        { itemId: 'canh_kim', name: 'Canh Kim Thạch', amount: 10 }
      ],
      spiritStones: 50000
    },
    thresholdBonuses: [
      {
        requiredPieces: 12,
        title: 'Tam Chu Kiếm Khí',
        description: '+15% Công kích thần binh, mỗi lượt phóng 3 đạo kiếm khí tinh đẩu gây 20% sát thương.',
        effects: {
          turnDamagePercent: 20
        }
      },
      {
        requiredPieces: 24,
        title: 'Kiếm Võng Hộ Thể',
        description: 'Kiếm khí đan xen kết thành kiếm võng vô hình, giảm 15% toàn bộ sát thương gánh chịu.',
        effects: {
          damageReductionPercent: 15
        }
      },
      {
        requiredPieces: 36,
        title: 'Chu Thiên Vạn Kiếm Trận',
        description: 'Đại trận viên mãn 36 thanh phi kiếm tùy thân, mở khóa Tuyệt Kỹ [Chu Thiên Vạn Kiếm Trận].',
        effects: {
          unlockedSkillName: 'Chu Thiên Vạn Kiếm Trận',
          turnDamagePercent: 35,
          damageReductionPercent: 20
        }
      }
    ],
    lore: 'Mô phỏng 36 Thiên Cương Tinh Đẩu thượng cổ, 36 thanh phi kiếm bay quanh thân thể câu thông tinh hà, kiếm khí tung hoành trảm diệt vạn ma.'
  },

  /**
   * 2. Ngũ Hành Linh Châu (5 viên linh châu)
   * - Mốc 2: Kháng ngũ hành (damageReductionPercent: 10)
   * - Mốc 5: Khiên Hỗn Nguyên: giảm 25% sát thương, phản 15% ngũ hành sát
   */
  ngu_hanh_chau: {
    id: 'ngu_hanh_chau',
    name: 'Ngũ Hành Linh Châu Trận',
    category: 'ngu_hanh_chau',
    maxPieces: 5,
    pieceCraftCost: {
      minerals: [
        { itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', amount: 15 },
        { itemId: 'han_bang_tinh', name: 'Hàn Băng Tinh', amount: 20 }
      ],
      spiritStones: 100000
    },
    thresholdBonuses: [
      {
        requiredPieces: 2,
        title: 'Ngũ Hành Tương Sinh',
        description: 'Hai viên linh châu lưu chuyển tuần hoàn, sinh sôi bất tức, giảm 10% sát thương ngũ hành thuộc tính.',
        effects: {
          damageReductionPercent: 10
        }
      },
      {
        requiredPieces: 5,
        title: 'Khiên Hỗn Nguyên',
        description: 'Ngũ Hành quy nhất ngưng kết Khiên Hỗn Nguyên: giảm 25% sát thương và phản chấn 15% ngũ hành sát thương.',
        effects: {
          damageReductionPercent: 25,
          turnDamagePercent: 15
        }
      }
    ],
    lore: 'Năm viên linh châu hội tụ bản nguyên Kim Mộc Thủy Hỏa Thổ, hình thành chu kỳ tương sinh bất diệt bảo hộ chân nguyên.'
  },

  /**
   * 3. Bát Quái Kỳ (8 cờ trận kỳ)
   * - Mốc 4: Giảm tiêu hao chân nguyên (damageReductionPercent: 5)
   * - Mốc 8: Phong tỏa tốc độ địch (unlockedSkillName: 'Bát Quái Phong Ma Trận')
   */
  bat_quai_ky: {
    id: 'bat_quai_ky',
    name: 'Bát Quái Phong Ma Kỳ Trận',
    category: 'bat_quai_ky',
    maxPieces: 8,
    pieceCraftCost: {
      minerals: [
        { itemId: 'thien_ngoai_vi_thach', name: 'Thiên Ngoại Vi Thạch', amount: 10 },
        { itemId: 'cuu_u_minh_thiet', name: 'Cửu U Minh Thiết', amount: 8 }
      ],
      spiritStones: 80000
    },
    thresholdBonuses: [
      {
        requiredPieces: 4,
        title: 'Bát Quái Tụ Linh',
        description: 'Bốn phương trận kỳ trấn áp linh huyệt, giảm 20% lượng Chân Nguyên tiêu hao trong chiến đấu.',
        effects: {
          damageReductionPercent: 5
        }
      },
      {
        requiredPieces: 8,
        title: 'Bát Quái Phong Ma Trận',
        description: 'Bát phương trận kỳ cắm rễ hư không, phong tỏa càn khôn, giảm 30% tốc độ địch và kích hoạt Tuyệt Kỹ [Bát Quái Phong Ma Trận].',
        effects: {
          unlockedSkillName: 'Bát Quái Phong Ma Trận',
          damageReductionPercent: 20
        }
      }
    ],
    lore: 'Tám đạo trận kỳ Càn Khảm Cấn Chấn Tốn Ly Khôn Đoài trấn giữ bát hoang lục hợp, cấm cố hư không khiến địch không đường đào thoát.'
  }
};

/**
 * Trạng thái khởi tạo mặc định của phân hệ Trận Khí Tùy Thân
 */
export const DEFAULT_FORMATION_SETS_STATE: FormationSetsState = {
  ownedSets: {},
  equippedArraySetId: null,
  tribulationHistory: []
};

// ============================================================================
// 2. PURE FUNCTION: evaluateWeaponTribulationTrigger
// ============================================================================

/**
 * Thẩm định điều kiện dẫn động Khí Lôi Kiếp:
 * - Điều kiện cần: Vũ khí chưa từng độ lôi kiếp thành công (chặn lặp lại).
 * - Điều kiện đủ (Thỏa mãn ít nhất 1 trong 3):
 *   1. Thần binh đạt Cửu Giai (Tier >= 9).
 *   2. Khí Linh đã đạt cảnh giới Hóa Hình (evolutionStage === 3).
 *   3. Đã ký Huyết Khế Bản Mệnh (isBloodBound === true) VÀ có tối thiểu 4 Mạch Dẫn Linh hoàn chỉnh (unlocked >= 4).
 * - 100% Pure Function, không biến đổi dữ liệu đầu vào.
 */
export function evaluateWeaponTribulationTrigger(
  weapon: Equipment
): { canTrigger: boolean; reason?: string } {
  if (!weapon || !weapon.id) {
    return {
      canTrigger: false,
      reason: 'Trang bị mục tiêu không tồn tại hoặc dữ liệu bị thiếu.'
    };
  }

  // 1. Guard: Chặn vũ khí đã từng độ kiếp
  if (weapon.lightningTempering?.isTempered) {
    return {
      canTrigger: false,
      reason: 'Vũ khí này đã độ lôi kiếp thành công, đúc thành Cửu Tiêu Lôi Thần Binh!'
    };
  }

  // 2. Điều kiện đủ 1: Thần binh Cửu Giai (Tier >= 9)
  const tier = resolveEquipmentTier(weapon);
  const isTier9 = tier >= 9 || (typeof (weapon as any).tier === 'number' && (weapon as any).tier >= 9);

  // 3. Điều kiện đủ 2: Khí Linh Hóa Hình (Stage 3)
  const isSoulStage3 = weapon.infusedSoul?.evolutionStage === 3;

  // 4. Điều kiện đủ 3: Huyết Khế Bản Mệnh với >= 4 Mạch Dẫn Linh mở khóa
  const isBloodBound = weapon.bloodBondData?.isBloodBound === true;
  const unlockedConduitsCount = (weapon.inscriptionData?.conduits || []).filter(c => c.isUnlocked).length;
  const isBondAndFourConduits = isBloodBound && unlockedConduitsCount >= 4;

  if (isTier9 || isSoulStage3 || isBondAndFourConduits) {
    return { canTrigger: true };
  }

  return {
    canTrigger: false,
    reason:
      'Chưa đủ linh tính để dẫn động Thiên Kiếp. Yêu cầu: Thần binh Cửu Giai (Tier 9), HOẶC Khí Linh Hóa Hình (Stage 3), HOẶC Huyết Khế Bản Mệnh với 4 Mạch Dẫn Linh hoàn chỉnh.'
  };
}

// ============================================================================
// 3. PURE FUNCTION: resolveWeaponLightningTemper
// ============================================================================

/**
 * Đánh giá kết quả của một đợt sét đánh trong Khí Lôi Kiếp:
 * - Dựa trên độ bền, phẩm bậc vũ khí và lượng Chân Nguyên Hộ Thân (playerShieldQi).
 * - Hấp thu năng lượng lôi đình chuyển hóa thành uy lực lôi điện.
 * - Sát thương độ bền được giảm trừ qua phẩm bậc vũ khí và khiên chân nguyên.
 * - 100% Pure Function, nhận tham số `roll` tùy chọn để kiểm thử tất định (deterministic test).
 */
export function resolveWeaponLightningTemper(
  weapon: Equipment,
  strike: WeaponTribulationStrike,
  playerShieldQi: number = 0,
  roll?: number
): { success: boolean; durabilityDamage: number; absorbedPower: number } {
  const tier = resolveEquipmentTier(weapon);
  const safeShieldQi = Math.max(0, playerShieldQi);

  // 1. Phẩm bậc và Chân Nguyên giảm trừ uy lực sát thương của tia sét
  const tierResistance = 1 + (tier * 0.12);
  const shieldMitigation = Math.min(safeShieldQi * 0.5, strike.lightningPower * 0.7);
  const netPower = Math.max(0, strike.lightningPower - shieldMitigation);

  // 2. Độ hao tổn độ bền
  const isInvulnerable = (weapon as any).durability === Infinity || (weapon as any).isPermanent === true;
  const durabilityDamage = isInvulnerable ? 0 : Math.max(1, Math.round(netPower / (8 * tierResistance)));

  // 3. Lực lượng lôi đình được thần binh hấp thu chuyển hóa
  const absorptionRate = Math.min(1.0, 0.4 + (tier * 0.05) + (safeShieldQi > 0 ? 0.1 : 0));
  const absorbedPower = Math.round(strike.lightningPower * absorptionRate);

  // 4. Đánh giá tỷ lệ thành công của đợt tôi luyện
  const shieldSuccessBonus = safeShieldQi >= strike.lightningPower ? 15 : (safeShieldQi >= strike.lightningPower * 0.5 ? 8 : 0);
  const effectiveSuccessRate = Math.min(100, Math.max(5, strike.temperSuccessRate + shieldSuccessBonus));

  const actualRoll = roll !== undefined ? roll : Math.random() * 100;
  const success = actualRoll <= effectiveSuccessRate;

  return {
    success,
    durabilityDamage,
    absorbedPower
  };
}

// ============================================================================
// 4. PURE FUNCTION: finalizeLightningTempering
// ============================================================================

/**
 * Hoàn tất quá trình Khí Lôi Kiếp:
 * - Gán metadata `lightningTempering` với các chỉ số lôi kiếp mặc định:
 *   * `isTempered`: true
 *   * `lightningElementBonus`: 35% (+35% sát thương Lôi)
 *   * `paralysisProcChance`: 20% (20% xác suất gây Tê Liệt / Choáng)
 *   * `armorPiercingPercent`: 30% (30% Xuyên Giáp)
 * - Tự động gắn tiền tố danh xưng `【Cửu Tiêu Lôi Kiếp】` vào tên trang bị nếu chưa có.
 * - Trả về bản sao an toàn (Deep Copy) 100% không mutate trang bị gốc.
 */
export function finalizeLightningTempering(weapon: Equipment): Equipment {
  if (!weapon) {
    throw new Error('Trang bị mục tiêu không hợp lệ để hoàn tất Lôi Kiếp.');
  }

  const cloned: Equipment = JSON.parse(JSON.stringify(weapon));
  const prefix = '【Cửu Tiêu Lôi Kiếp】';

  // Gắn tiền tố nếu tên trang bị chưa có
  if (!cloned.name.includes(prefix)) {
    cloned.name = `${prefix} ${cloned.name}`;
  }

  // Gán metadata lôi kiếp vĩnh viễn
  cloned.lightningTempering = {
    isTempered: true,
    temperedAt: Date.now(),
    lightningElementBonus: 35,
    paralysisProcChance: 20,
    armorPiercingPercent: 30
  };

  return cloned;
}

// ============================================================================
// 5. PURE FUNCTION: calculateCraftPieceProgress
// ============================================================================

/**
 * Tính toán tiến độ đúc mảnh bộ trận khí tùy thân:
 * - Cap Guard: Nếu số mảnh vượt quá giới hạn trần (`maxPieces`) -> ném ngoại lệ chặn đúc vượt giới hạn.
 * - Cập nhật danh sách các mốc hiệu ứng đã mở khóa (`unlockedThresholds`).
 * - Xác định chính xác các mốc vừa mới mở khóa trong lượt này (`newlyUnlockedThresholds`).
 * - Trả về bản sao an toàn của tiến độ người chơi.
 */
export function calculateCraftPieceProgress(
  currentSet: PlayerFormationSetProgress | undefined,
  setConfig: FormationSetConfig,
  piecesToAdd: number
): { updatedSet: PlayerFormationSetProgress; newlyUnlockedThresholds: number[] } {
  if (typeof piecesToAdd !== 'number' || piecesToAdd <= 0 || isNaN(piecesToAdd)) {
    throw new Error('Số lượng mảnh trận khí cần đúc phải là số nguyên dương lớn hơn 0.');
  }

  const existingPieces = currentSet?.currentPieces || 0;
  const newPieces = existingPieces + Math.floor(piecesToAdd);

  // Cap Guard: Chặn đúc vượt quá số mảnh tối đa của bộ trận
  if (newPieces > setConfig.maxPieces) {
    throw new Error(
      `Không thể đúc vượt quá số lượng tối đa của bộ trận khí [${setConfig.name}] (Tối đa: ${setConfig.maxPieces}, Hiện có: ${existingPieces}, Yêu cầu thêm: ${piecesToAdd}).`
    );
  }

  const prevUnlocked = currentSet?.unlockedThresholds || [];

  // Xác định toàn bộ các mốc thỏa mãn điều kiện số mảnh mới
  const allUnlocked = setConfig.thresholdBonuses
    .filter(tb => newPieces >= tb.requiredPieces)
    .map(tb => tb.requiredPieces);

  // Lọc ra các mốc vừa mới mở khóa trong lần đúc này
  const newlyUnlockedThresholds = allUnlocked.filter(t => !prevUnlocked.includes(t));

  const isCompleted = newPieces >= setConfig.maxPieces;

  const updatedSet: PlayerFormationSetProgress = {
    setId: setConfig.id,
    currentPieces: newPieces,
    isCompleted,
    unlockedThresholds: allUnlocked,
    assembledAt: currentSet?.assembledAt || Date.now()
  };

  return {
    updatedSet,
    newlyUnlockedThresholds
  };
}

// ============================================================================
// 6. PURE FUNCTION: equipFormationSet
// ============================================================================

/**
 * Kích hoạt hoặc tháo gỡ Bộ Trận Khí Tùy Thân:
 * - Đảm bảo tính độc lập (Array Slot Independence): Chỉ gán/thay đổi trường `player.formationSetsState.equippedArraySetId`.
 * - Tuyệt đối không can thiệp, ghi đè hoặc thay thế ô trang bị vũ khí `player.equipment.weapon`.
 * - Trả về bản sao an toàn (Deep Copy) 100% không mutate object player ban đầu.
 */
export function equipFormationSet<T extends { equipment?: any; formationSetsState?: FormationSetsState; [key: string]: any }>(
  player: T,
  setId: string | null
): T {
  if (setId !== null && !FORMATION_SETS_REGISTRY[setId as FormationSetCategory]) {
    throw new Error(`Bộ trận khí [${setId}] không tồn tại trong danh mục.`);
  }

  const cloned: T = JSON.parse(JSON.stringify(player));
  if (!cloned.formationSetsState) {
    cloned.formationSetsState = {
      ownedSets: {},
      equippedArraySetId: null,
      tribulationHistory: []
    };
  }

  cloned.formationSetsState.equippedArraySetId = setId;
  return cloned;
}
