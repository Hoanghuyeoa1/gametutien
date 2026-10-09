// lib/modular-metallurgy-logic.ts
// Pure Domain Logic: Đoán Cốt Hợp Kim & Tự Chọn Phôi Khí (Modular Metallurgy & Weapon Archetypes)
// Tuân thủ Clean Architecture, 100% Strict TypeScript, không side-effect

import {
  WeaponArchetypeId,
  OreElementProperty,
  WeaponArchetypeConfig,
  AlloyOrePropertyConfig,
  MetallurgyOreInput,
  AlloyOreDetail,
  AlloyCompositionResult,
  AlloyElementalStats,
  ModularWeaponMetadata,
  BaseModularWeaponStats
} from './types/modular-metallurgy';
import { Equipment, EquipmentGrade, EquipmentAffix, EquipmentSocket } from './types/items';

// ============================================================================
// 1. WEAPON ARCHETYPES REGISTRY (4 Loại Phôi Khí Cổ Điển)
// ============================================================================

export const WEAPON_ARCHETYPES_REGISTRY: Record<WeaponArchetypeId, WeaponArchetypeConfig> = {
  phi_kiem: {
    id: 'phi_kiem',
    name: 'Phi Kiếm',
    vietnameseName: 'Phi Kiếm',
    description: 'Thân kiếm thanh mảnh phi hành ngự kiếm, tốc độ xuất kiếm thần tốc và bạo kích kinh người, nhưng giảm nhẹ khí huyết gia cố.',
    icon: '🗡️',
    badgeClass: 'text-amber-300 border-amber-500/40 bg-amber-950/30',
    atkMultiplier: 1.2,
    speedMultiplier: 1.25,
    critRateBonus: 0.12,
    hpMultiplier: 0.8
  },
  trong_kiem: {
    id: 'trong_kiem',
    name: 'Trọng Kiếm',
    vietnameseName: 'Trọng Kiếm',
    description: 'Đại kiếm nặng ngàn cân chém nứt trời cao, công kích bạo liệt, phá vỡ giáp trụ và gây choáng đối thủ, nhưng giảm nhẹ tính linh hoạt.',
    icon: '⚔️',
    badgeClass: 'text-rose-300 border-rose-500/40 bg-rose-950/30',
    atkMultiplier: 1.6,
    armorPenBonus: 0.20,
    stunChanceBonus: 0.10,
    speedMultiplier: 0.85
  },
  bao_dinh: {
    id: 'bao_dinh',
    name: 'Bảo Đỉnh',
    vietnameseName: 'Bảo Đỉnh',
    description: 'Bảo đỉnh trấn sơn hộ mệnh, uẩn dưỡng khí huyết khổng lồ và hộ giáp vững như bàn thạch kèm khả năng miễn thương, sức công kích giảm bớt.',
    icon: '🏺',
    badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30',
    defMultiplier: 1.8,
    hpMultiplier: 1.5,
    damageReductionBonus: 0.08,
    atkMultiplier: 0.6
  },
  tran_ky: {
    id: 'tran_ky',
    name: 'Trận Kỳ',
    vietnameseName: 'Trận Kỳ',
    description: 'Pháp trận cờ lệnh hô phong hoán vũ, điều động thiên địa linh khí, tăng vọt uy lực pháp thuật và giảm tiêu hao linh lực khi xuất chiêu.',
    icon: '🚩',
    badgeClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30',
    skillDamageBonus: 0.30,
    manaCostReduction: 0.20,
    atkMultiplier: 1.0
  }
};

// ============================================================================
// 2. ALLOY ORES REGISTRY (5 Thuộc Tính Khoáng Thạch Hợp Kim)
// ============================================================================

export const ALLOY_ORES_REGISTRY: Record<OreElementProperty, AlloyOrePropertyConfig> = {
  canh_kim: {
    element: 'canh_kim',
    name: 'Canh Kim Thạch',
    statKey: 'trueDamagePercent',
    maxEffectPercent: 15,
    description: 'Chứa Canh Kim Chi Khí sắc bén vô song, đòn đánh chuyển hóa sát thương chuẩn xuyên thấu mọi hộ thể linh quang (tối đa +15%).',
    flavorText: 'Bạch hổ phương tây sinh canh kim, trảm thiết như trảm bùn.'
  },
  han_bang: {
    element: 'han_bang',
    name: 'Hàn Băng Tinh',
    statKey: 'slowSpeedPercent',
    maxEffectPercent: 20,
    description: 'Băng Phách hàn khí ngưng trệ kinh mạch, làm chậm đáng kể tốc độ xuất chiêu và di chuyển của đối phương (tối đa +20%).',
    flavorText: 'Băng đọng vạn năm dưới đáy U Minh, đụng vào lập tức kết sương.'
  },
  xich_hoa: {
    element: 'xich_hoa',
    name: 'Xích Hỏa Đồng',
    statKey: 'burnDamagePercent',
    maxEffectPercent: 12,
    description: 'Nung nấu Địa Hỏa chân diễm cuồn cuộn, gây sát thương thiêu đốt liên tục theo thời gian lên đối thủ (tối đa +12%).',
    flavorText: 'Đồng đỏ sinh từ miệng núi lửa thái cổ, lửa cháy vạn kiếp không tàn.'
  },
  huyen_thiet: {
    element: 'huyen_thiet',
    name: 'Huyền Thiết',
    statKey: 'damageReductionPercent',
    maxEffectPercent: 10,
    description: 'Vạn Niên Huyền Thiết cứng cỏi bất hoại, hấp thu dư chấn và giảm bớt mọi sát thương gánh chịu (tối đa +10%).',
    flavorText: 'Đen kịt nặng nề, dao chém không vết, sấm sét không tan.'
  },
  tinh_than: {
    element: 'tinh_than',
    name: 'Tinh Thần Sa',
    statKey: 'critResistPercent',
    maxEffectPercent: 10,
    description: 'Cát thiên thạch hấp thu tinh hoa chu thiên tinh tú, bảo hộ các huyệt đạo chí mạng, kháng bạo kích cực cao (tối đa +10%).',
    flavorText: 'Bụi sao rơi từ cửu thiên, lấp lánh ánh sáng ngân hà.'
  }
};

// ============================================================================
// 3. PURE FUNCTION: calculateAlloyComposition
// ============================================================================

/**
 * Tính toán tỷ lệ hợp kim, nguyên tố áp đảo và độ tinh khiết (Purity Score)
 * 
 * - Validation: Số lượng loại khoáng thạch phải từ 2 <= N <= 4. Nếu không hợp lệ trả về null.
 * - Chuẩn hóa tỷ lệ: Ratio_i = weight_i / sum(weight). Tổng tỷ lệ luôn làm tròn chính xác về 1.0.
 * - Purity Score: 70% -> 100% dựa trên độ đồng đều phối trộn, cảnh giới thợ rèn và phẩm cấp dị hỏa trợ lực.
 */
export function calculateAlloyComposition(
  ores: MetallurgyOreInput[],
  blacksmithRealmIndex: number = 0,
  flameBonusPercent: number = 0
): AlloyCompositionResult | null {
  // 1. Validation số lượng quặng: 2 <= N <= 4
  if (!ores || !Array.isArray(ores) || ores.length < 2 || ores.length > 4) {
    return null;
  }

  // Kiểm tra trọng lượng quặng hợp lệ
  for (const ore of ores) {
    if (typeof ore.weight !== 'number' || isNaN(ore.weight) || ore.weight <= 0) {
      return null;
    }
  }

  const totalWeight = ores.reduce((acc, curr) => acc + curr.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  const n = ores.length;
  const oreDetails: AlloyOreDetail[] = [];
  let allocatedRatioSum = 0;

  // 2. Chuẩn hóa tỷ lệ: tổng luôn bằng 1.0
  for (let i = 0; i < n; i++) {
    const item = ores[i];
    let ratio: number;

    if (i === n - 1) {
      // Phần tử cuối cùng nhận phần bù để đảm bảo tổng chính xác 1.0
      ratio = Number(Math.max(0, 1.0 - allocatedRatioSum).toFixed(4));
    } else {
      ratio = Number((item.weight / totalWeight).toFixed(4));
      allocatedRatioSum += ratio;
    }

    const oreConfig = ALLOY_ORES_REGISTRY[item.element];
    const maxPercent = oreConfig ? oreConfig.maxEffectPercent : 0;
    const effectiveBonus = Number((ratio * maxPercent).toFixed(2));

    oreDetails.push({
      oreId: item.oreId,
      oreName: item.oreName,
      element: item.element,
      weight: item.weight,
      ratio,
      effectiveBonus
    });
  }

  // 3. Xác định nguyên tố chiếm ưu thế (Dominant Element)
  let dominantOre = oreDetails[0];
  for (let i = 1; i < oreDetails.length; i++) {
    if (oreDetails[i].ratio > dominantOre.ratio) {
      dominantOre = oreDetails[i];
    }
  }

  // 4. Tính toán Độ Tinh Khiết (Purity Score: 70% -> 100%)
  // - Độ đồng đều (Uniformity U: 0.0 -> 1.0)
  const idealRatio = 1.0 / n;
  const meanDeviation = oreDetails.reduce((sum, item) => sum + Math.abs(item.ratio - idealRatio), 0);
  const maxDeviation = 2.0 * (1.0 - idealRatio);
  const uniformity = maxDeviation > 0 ? Math.max(0, Math.min(1.0, 1.0 - (meanDeviation / maxDeviation))) : 1.0;

  // Thưởng độ đồng đều: tối đa +15%
  const uniformityBonus = uniformity * 15.0;

  // Thưởng phẩm bậc thợ rèn: +1.2% mỗi cảnh giới (Luyện Khí 0 -> Chân Tiên 9: tối đa ~10.8%)
  const clampedRealm = Math.max(0, Math.min(10, blacksmithRealmIndex));
  const realmBonus = clampedRealm * 1.2;

  // Thưởng Dị Hỏa nung chảy: quy chuẩn về % (0 -> 10%)
  const rawFlame = flameBonusPercent > 1 ? flameBonusPercent : flameBonusPercent * 100;
  const flameBonus = Math.max(0, Math.min(10.0, rawFlame));

  // Base: 70%, trần 100%
  const calculatedPurity = 70.0 + uniformityBonus + realmBonus + flameBonus;
  const purityScore = Number(Math.min(100.0, Math.max(70.0, calculatedPurity)).toFixed(2));
  const purityMultiplier = Number((purityScore / 100).toFixed(4));

  // 5. Tổng hợp các hiệu ứng nguyên tố
  const elementalStats: AlloyElementalStats = {
    trueDamagePercent: 0,
    slowSpeedPercent: 0,
    burnDamagePercent: 0,
    damageReductionPercent: 0,
    critResistPercent: 0
  };

  for (const item of oreDetails) {
    const config = ALLOY_ORES_REGISTRY[item.element];
    if (config) {
      const bonus = Number((item.ratio * config.maxEffectPercent).toFixed(2));
      elementalStats[config.statKey] = Number((elementalStats[config.statKey] + bonus).toFixed(2));
    }
  }

  const oreSummaryList = oreDetails.map(o => `${o.oreName} (${(o.ratio * 100).toFixed(1)}%)`).join(' + ');
  const summary = `Hợp kim gồm ${oreSummaryList}, độ tinh khiết đạt ${purityScore}%.`;

  return {
    ores: oreDetails,
    totalWeight,
    dominantElement: dominantOre.element,
    dominantRatio: dominantOre.ratio,
    purityScore,
    purityMultiplier,
    elementalStats,
    specialAffixes: { ...elementalStats },
    summary
  };
}

/**
 * Phiên bản ném lỗi (Throw on invalid) dành cho các luồng nghiệp vụ yêu cầu xác thực nghiêm ngặt
 */
export function calculateAlloyCompositionOrThrow(
  ores: MetallurgyOreInput[],
  blacksmithRealmIndex: number = 0,
  flameBonusPercent: number = 0
): AlloyCompositionResult {
  const result = calculateAlloyComposition(ores, blacksmithRealmIndex, flameBonusPercent);
  if (!result) {
    throw new Error('Số lượng loại khoáng thạch phải từ 2 đến 4 loại và trọng lượng phải lớn hơn 0.');
  }
  return result;
}

// ============================================================================
// 4. PURE FUNCTION: generateModularWeaponName
// ============================================================================

/**
 * Tự động sinh tên cổ phong chuẩn tiên hiệp dựa trên nguyên tố chiếm ưu thế + phôi khí + độ tinh khiết
 */
export function generateModularWeaponName(
  archetypeId: WeaponArchetypeId,
  dominantElement: OreElementProperty,
  purity: number
): string {
  const archetypeConfig = WEAPON_ARCHETYPES_REGISTRY[archetypeId];
  const archetypeName = archetypeConfig ? archetypeConfig.vietnameseName : 'Thần Binh';

  // Quy chuẩn độ tinh khiết về thang 0-100 nếu đầu vào truyền dạng 0.7-1.0
  const normalizedPurity = purity <= 1 ? purity * 100 : purity;

  // Bảng tiền tố cổ phong theo nguyên tố và cấp bậc độ tinh khiết
  const ELEMENT_TITLES: Record<OreElementProperty, { divine: string; peerless: string; refined: string; mortal: string }> = {
    canh_kim: {
      divine: 'Thái Sơ Canh Kim',
      peerless: 'Bạch Hổ Canh Kim',
      refined: 'Bách Luyện Canh Kim',
      mortal: 'Sơ Luyện Canh Kim'
    },
    han_bang: {
      divine: 'Vạn Cổ Băng Phách',
      peerless: 'Huyền Băng Tuyết Lạc',
      refined: 'Cửu U Hàn Tinh',
      mortal: 'Hàn Băng Thạch'
    },
    xich_hoa: {
      divine: 'Cửu Dương Chân Hỏa',
      peerless: 'Viêm Long Thí Thiên',
      refined: 'Xích Hỏa Liệt Diễm',
      mortal: 'Xích Đồng Chước Lãng'
    },
    huyen_thiet: {
      divine: 'Kim Cương Bất Hoại',
      peerless: 'Hắc Diệu Huyền Thiết',
      refined: 'Bàn Thạch Huyền Thiết',
      mortal: 'Huyền Thiết Trọng Phôi'
    },
    tinh_than: {
      divine: 'Chu Thiên Tinh Đẩu',
      peerless: 'Bắc Đẩu Tinh Sa',
      refined: 'Tinh Hà Diệu Thế',
      mortal: 'Tinh Sa Lạc Trần'
    }
  };

  const titles = ELEMENT_TITLES[dominantElement] ?? ELEMENT_TITLES.canh_kim;

  let prefix: string;
  if (normalizedPurity >= 95) {
    prefix = titles.divine;
  } else if (normalizedPurity >= 88) {
    prefix = titles.peerless;
  } else if (normalizedPurity >= 80) {
    prefix = titles.refined;
  } else {
    prefix = titles.mortal;
  }

  return `${prefix} ${archetypeName}`;
}

// ============================================================================
// 5. PURE FUNCTION: craftModularEquipment
// ============================================================================

/**
 * Tham số đầu vào để chế tác trang bị phôi khí hợp kim
 */
export interface CraftModularEquipmentParams {
  id?: string;
  archetypeId: WeaponArchetypeId;
  alloyComposition: AlloyCompositionResult;
  baseStats: BaseModularWeaponStats;
  grade?: EquipmentGrade;
  quality?: string;
  name?: string;
  description?: string;
  blacksmithRealmIndex?: number;
  flameBonusPercent?: number;
  price?: number;
}

/**
 * Chế tác trang bị phôi khí hợp kim module hóa
 * 
 * - Tính toán chỉ số cuối cùng dựa trên: Base Stats phôi x Hệ số Archetype x Độ Tinh Khiết.
 * - Khởi tạo sockets, affixes nguyên tố và gắn ModularWeaponMetadata hoàn chỉnh.
 * - Pure Function: không mutate mảng hay đối tượng đầu vào.
 */
export function craftModularEquipment(params: CraftModularEquipmentParams): Equipment;
export function craftModularEquipment(
  archetypeId: WeaponArchetypeId,
  alloyComposition: AlloyCompositionResult,
  baseStats: BaseModularWeaponStats,
  options?: Partial<Omit<CraftModularEquipmentParams, 'archetypeId' | 'alloyComposition' | 'baseStats'>>
): Equipment;
export function craftModularEquipment(
  arg1: WeaponArchetypeId | CraftModularEquipmentParams,
  arg2?: AlloyCompositionResult,
  arg3?: BaseModularWeaponStats,
  arg4?: Partial<Omit<CraftModularEquipmentParams, 'archetypeId' | 'alloyComposition' | 'baseStats'>>
): Equipment {
  // Chuẩn hóa tham số nạp vào (hỗ trợ cả dạng object params lẫn positional arguments)
  let archetypeId: WeaponArchetypeId;
  let alloyComposition: AlloyCompositionResult;
  let baseStats: BaseModularWeaponStats;
  let optionalParams: Partial<Omit<CraftModularEquipmentParams, 'archetypeId' | 'alloyComposition' | 'baseStats'>> = {};

  if (typeof arg1 === 'object' && arg1 !== null) {
    archetypeId = arg1.archetypeId;
    alloyComposition = arg1.alloyComposition;
    baseStats = arg1.baseStats;
    optionalParams = arg1;
  } else {
    archetypeId = arg1;
    if (!arg2 || !arg3) {
      throw new Error('Thiếu tham số alloyComposition hoặc baseStats trong craftModularEquipment.');
    }
    alloyComposition = arg2;
    baseStats = arg3;
    if (arg4) {
      optionalParams = arg4;
    }
  }

  const archetype = WEAPON_ARCHETYPES_REGISTRY[archetypeId] ?? WEAPON_ARCHETYPES_REGISTRY.phi_kiem;
  const purityFactor = alloyComposition.purityMultiplier; // 0.70 -> 1.00

  // 1. Tính toán các chỉ số cơ bản sau khi áp dụng hệ số phôi khí và độ tinh khiết
  const rawBaseAtk = baseStats.atk ?? 100;
  const rawBaseDef = baseStats.def ?? 0;
  const rawBaseHp = baseStats.hp ?? 0;
  const rawBaseSpeed = baseStats.speed ?? 0;
  const rawBaseMp = baseStats.mp ?? 0;

  const atkBonus = Math.round(rawBaseAtk * archetype.atkMultiplier * purityFactor);
  const defBonus = Math.round(rawBaseDef * (archetype.defMultiplier ?? 1.0) * purityFactor);
  const hpBonus = Math.round(rawBaseHp * (archetype.hpMultiplier ?? 1.0) * purityFactor);
  const speedBonus = Math.round(rawBaseSpeed * (archetype.speedMultiplier ?? 1.0) * purityFactor);
  const mpBonus = Math.round(rawBaseMp * purityFactor);

  // Bonus bạo kích đặc thù (ví dụ: Phi Kiếm +12%)
  const critRateBonus = archetype.critRateBonus ? Number((archetype.critRateBonus * purityFactor).toFixed(4)) : undefined;

  // 2. Phân loại phẩm cấp và chất lượng nếu chưa truyền
  let finalGrade: EquipmentGrade = optionalParams.grade ?? 'Bảo Khí';
  let finalQuality: string = optionalParams.quality ?? 'thuong_pham';

  if (!optionalParams.grade) {
    if (alloyComposition.purityScore >= 95) {
      finalGrade = 'Tiên Thiên Linh Bảo';
      finalQuality = 'than_pham';
    } else if (alloyComposition.purityScore >= 88) {
      finalGrade = 'Cổ Bảo';
      finalQuality = 'cuc_pham';
    } else if (alloyComposition.purityScore >= 80) {
      finalGrade = 'Bảo Khí';
      finalQuality = 'thuong_pham';
    } else {
      finalGrade = 'Linh Khí';
      finalQuality = 'trung_pham';
    }
  }

  // 3. Tên thần binh
  const finalName = optionalParams.name ?? generateModularWeaponName(
    archetypeId,
    alloyComposition.dominantElement,
    alloyComposition.purityScore
  );

  // 4. Khởi tạo Affixes đặc trưng từ nguyên tố hợp kim
  const affixes: EquipmentAffix[] = [];
  const dominantElementConfig = ALLOY_ORES_REGISTRY[alloyComposition.dominantElement];

  if (alloyComposition.elementalStats.trueDamagePercent > 0) {
    affixes.push({
      id: `affix_truedmg_${archetypeId}`,
      name: 'Canh Kim Chân Thương',
      rarity: alloyComposition.purityScore >= 90 ? 'than' : 'kim',
      statKey: 'trueDamagePercent',
      value: alloyComposition.elementalStats.trueDamagePercent,
      description: `Kèm +${alloyComposition.elementalStats.trueDamagePercent}% Sát Thương Chuẩn bỏ qua phòng ngự`
    });
  }

  if (alloyComposition.elementalStats.slowSpeedPercent > 0) {
    affixes.push({
      id: `affix_slow_${archetypeId}`,
      name: 'Băng Phách Trì Hoãn',
      rarity: alloyComposition.purityScore >= 90 ? 'than' : 'kim',
      statKey: 'slowSpeedPercent',
      value: alloyComposition.elementalStats.slowSpeedPercent,
      description: `Làm chậm tốc độ đối thủ ${alloyComposition.elementalStats.slowSpeedPercent}%`
    });
  }

  if (alloyComposition.elementalStats.burnDamagePercent > 0) {
    affixes.push({
      id: `affix_burn_${archetypeId}`,
      name: 'Liệt Diễm Thiêu Đốt',
      rarity: alloyComposition.purityScore >= 90 ? 'than' : 'kim',
      statKey: 'burnDamagePercent',
      value: alloyComposition.elementalStats.burnDamagePercent,
      description: `Thiêu đốt sinh lực mục tiêu +${alloyComposition.elementalStats.burnDamagePercent}% mỗi lượt`
    });
  }

  if (alloyComposition.elementalStats.damageReductionPercent > 0) {
    affixes.push({
      id: `affix_dmgred_${archetypeId}`,
      name: 'Huyền Thiết Miễn Thương',
      rarity: alloyComposition.purityScore >= 90 ? 'than' : 'kim',
      statKey: 'damageReductionPercent',
      value: alloyComposition.elementalStats.damageReductionPercent,
      description: `Giảm +${alloyComposition.elementalStats.damageReductionPercent}% mọi sát thương nhận vào`
    });
  }

  if (alloyComposition.elementalStats.critResistPercent > 0) {
    affixes.push({
      id: `affix_critres_${archetypeId}`,
      name: 'Tinh Thần Hộ Thể',
      rarity: alloyComposition.purityScore >= 90 ? 'than' : 'kim',
      statKey: 'critResistPercent',
      value: alloyComposition.elementalStats.critResistPercent,
      description: `Kháng đòn bạo kích +${alloyComposition.elementalStats.critResistPercent}%`
    });
  }

  // 5. Khởi tạo Sockets linh thạch
  const maxSockets = alloyComposition.purityScore >= 95 ? 4 : (alloyComposition.purityScore >= 85 ? 3 : 2);
  const sockets: EquipmentSocket[] = [];
  for (let i = 0; i < maxSockets; i++) {
    sockets.push({
      slotIndex: i,
      index: i,
      unlocked: i === 0, // Ô đầu tiên mở sẵn
      gem: null
    });
  }

  // 6. Tính toán điểm Chiến Lực (Power Bonus)
  const statPower = Math.round(
    (atkBonus * 2.5) +
    (defBonus * 1.8) +
    (hpBonus * 0.2) +
    (speedBonus * 3.0) +
    (mpBonus * 0.15)
  );
  const elementalPower = Math.round(
    (alloyComposition.elementalStats.trueDamagePercent * 40) +
    (alloyComposition.elementalStats.slowSpeedPercent * 30) +
    (alloyComposition.elementalStats.burnDamagePercent * 35) +
    (alloyComposition.elementalStats.damageReductionPercent * 50) +
    (alloyComposition.elementalStats.critResistPercent * 35)
  );
  const powerBonus = Math.max(
    100,
    Math.round(
      (baseStats.power ? baseStats.power * purityFactor : statPower) +
      elementalPower +
      (alloyComposition.purityScore * 10)
    )
  );

  // 7. Giá bán Linh Thạch ước tính
  const price = optionalParams.price ?? Math.round(powerBonus * 3.5);

  // 8. Mô tả thần binh
  const dominantName = dominantElementConfig ? dominantElementConfig.name : 'Thiên Địa Khoáng';
  const description = optionalParams.description ??
    `[${archetype.vietnameseName} - ${dominantName}] Thần binh đoán cốt theo phương pháp hợp kim cổ đại. ` +
    `Nguyên tố chiếm ưu thế: ${dominantName} (${(alloyComposition.dominantRatio * 100).toFixed(1)}%). ` +
    `Độ tinh khiết đạt ${alloyComposition.purityScore}%. ` +
    `${archetype.description}`;

  // 9. Đóng gói ModularWeaponMetadata
  const alloyMetadata: ModularWeaponMetadata = {
    archetypeId,
    archetypeName: archetype.vietnameseName,
    alloyComposition,
    purity: alloyComposition.purityScore,
    dominantElement: alloyComposition.dominantElement,
    elementalEffects: { ...alloyComposition.elementalStats },
    archetypeMultipliers: {
      atkMultiplier: archetype.atkMultiplier,
      speedMultiplier: archetype.speedMultiplier,
      hpMultiplier: archetype.hpMultiplier,
      defMultiplier: archetype.defMultiplier,
      critRateBonus: archetype.critRateBonus,
      armorPenBonus: archetype.armorPenBonus,
      stunChanceBonus: archetype.stunChanceBonus,
      damageReductionBonus: archetype.damageReductionBonus,
      skillDamageBonus: archetype.skillDamageBonus,
      manaCostReduction: archetype.manaCostReduction
    },
    craftedAt: Date.now(),
    blacksmithRealmIndex: optionalParams.blacksmithRealmIndex ?? 0,
    flameBonusPercent: optionalParams.flameBonusPercent ?? 0
  };

  const id = optionalParams.id ?? `eq_modular_${archetypeId}_${Date.now()}`;

  const equipment: Equipment = {
    id,
    name: finalName,
    slot: 'weapon',
    type: 'weapon',
    grade: finalGrade,
    quality: finalQuality,
    powerBonus,
    enhancement: 0,
    atkBonus,
    defBonus,
    hpBonus,
    mpBonus,
    speedBonus,
    critRateBonus,
    refinementLevel: 0,
    affixes,
    sockets,
    maxSockets,
    description,
    price,
    alloyMetadata
  };

  return equipment;
}

// ============================================================================
// 6. PURE FUNCTION: deductOresFromInventory (Atomic Deduction & Boundary Guard)
// ============================================================================

/**
 * Kiểm tra tồn kho và khấu trừ quặng nạp vào lò luyện theo nguyên tắc Atomic
 * - Kiểm tra toàn bộ điều kiện trước khi thực hiện khấu trừ (Atomic Pre-check).
 * - Nếu bất kỳ loại quặng nào thiếu số lượng -> ném ngoại lệ rõ ràng, không làm thay đổi kho và không để số lượng âm.
 * - Pure Function: Trả về mảng kho mới đã cập nhật số lượng, không mutate mảng gốc.
 */
export function deductOresFromInventory<T extends { id: string; name?: string; quantity: number }>(
  inventoryOres: T[],
  requiredOres: MetallurgyOreInput[]
): T[] {
  // 1. Atomic Validation Guard
  for (const req of requiredOres) {
    const item = inventoryOres.find(o => o.id === req.oreId);
    const available = item ? item.quantity : 0;
    if (available < req.weight) {
      throw new Error(
        `Không đủ khoáng thạch [${req.oreName}]: yêu cầu ${req.weight}, tồn kho hiện tại chỉ có ${available}!`
      );
    }
  }

  // 2. Pure Deduction
  return inventoryOres.map(o => {
    const req = requiredOres.find(r => r.oreId === o.id);
    if (!req) return { ...o };
    const remaining = o.quantity - req.weight;
    if (remaining < 0) {
      throw new Error(`Lỗi số học: Số lượng quặng [${o.name || o.id}] không thể bị âm!`);
    }
    return {
      ...o,
      quantity: remaining
    };
  });
}
