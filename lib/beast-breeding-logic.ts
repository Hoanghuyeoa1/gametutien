// lib/beast-breeding-logic.ts
// Pure Business Logic cho Hệ Thống Tiến Hóa Huyết Mạch & Lai Tạo Linh Thú (Thú Uyển Động Phủ)

import {
  SpiritBeast,
  BeastEgg,
  BeastElement,
  BloodlineTier,
  BeastCombatStats,
  BeastInnateAura,
  BeastGardenFacility,
  BeastGardenState,
  BreedingCatalystItem
} from '@/lib/types/beasts';
import { PlayerStats } from '@/lib/types/player';

// =========================================================================
// 1. CẤU HÌNH HẰNG SỐ (CONSTANTS & CONFIGURATIONS)
// =========================================================================

export const DEFAULT_BREEDING_COOLDOWN_MS = 60 * 60 * 1000; // 1 giờ hồi chiêu phối giống
export const DEFAULT_INCUBATION_DURATION_MS = 3 * 60 * 1000; // 3 phút ấp trứng mặc định

export const BLOODLINE_TIER_NAMES: Record<BloodlineTier, string> = {
  1: 'Phàm Thú',
  2: 'Linh Thú',
  3: 'Dị Thú',
  4: 'Thần Thú',
  5: 'Thái Cổ Hung Thú'
};

export const BLOODLINE_TIER_COLORS: Record<BloodlineTier, { text: string; bg: string; border: string }> = {
  1: { text: 'text-zinc-300', bg: 'bg-zinc-800/80', border: 'border-zinc-600' },
  2: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-600/50' },
  3: { text: 'text-cyan-300', bg: 'bg-cyan-950/40', border: 'border-cyan-500/50' },
  4: { text: 'text-purple-300', bg: 'bg-purple-950/40', border: 'border-purple-500/60' },
  5: { text: 'text-amber-300', bg: 'bg-amber-950/60', border: 'border-amber-400/80' }
};

export const ELEMENT_ICONS: Record<BeastElement, string> = {
  'Kim': '⚔️',
  'Mộc': '🌿',
  'Thủy': '💧',
  'Hỏa': '🔥',
  'Thổ': '⛰️',
  'Lôi': '⚡',
  'Phong': '🌪️',
  'Âm Dương': '☯️',
  'Hỗn Độn': '🌌'
};

export const INNATE_AURAS_POOL: BeastInnateAura[] = [
  {
    id: 'aura_huyet_te',
    name: 'Huyết Tế Thôn Phệ',
    description: 'Đòn đánh kèm 15% hút máu chuyển hóa thành sinh mệnh cho chủ nhân.',
    effectType: 'vampirism',
    value: 15
  },
  {
    id: 'aura_loi_dinh',
    name: 'Thiên Cương Lôi Đình',
    description: 'Đòn đánh có 20% tỷ lệ làm choáng đối thủ và gây sát thương sấm sét bộc phát.',
    effectType: 'stun',
    value: 20
  },
  {
    id: 'aura_chan_hoa',
    name: 'Tam Muội Chân Hỏa',
    description: 'Gia tăng 25% sát thương nguyên tố bộc phát và thiêu đốt phòng ngự địch.',
    effectType: 'elemental_burst',
    value: 25
  },
  {
    id: 'aura_kim_cuong',
    name: 'Kim Cương Bất Hoại',
    description: 'Giảm 20% toàn bộ sát thương nhận vào cho cả thú cưỡi và chủ nhân.',
    effectType: 'damage_reduction',
    value: 20
  }
];

export const BREEDING_CATALYSTS: BreedingCatalystItem[] = [
  {
    id: 'catalyst_duc_thu_thao',
    name: 'Dục Thú Thảo',
    description: 'Thảo dược kỳ diệu kích thích huyết mạch nguyên sơ, tăng +10% tỷ lệ dị biến và +10% độ thuần khiết.',
    rarity: 'Nhị Giai',
    mutationRateBonus: 0.10,
    purityBonus: 10,
    costLinhThach: 10000,
    icon: '🌿'
  },
  {
    id: 'catalyst_huyet_tinh_dan',
    name: 'Huyết Tinh Đan',
    description: 'Luyện chế từ tinh huyết yêu thú cổ xưa, tăng +20% tỷ lệ dị biến và +20% độ thuần khiết con non.',
    rarity: 'Tứ Giai',
    mutationRateBonus: 0.20,
    purityBonus: 20,
    costLinhThach: 50000,
    icon: '🩸'
  },
  {
    id: 'catalyst_thai_so_ngoc_tuy',
    name: 'Thái Sơ Ngọc Tủy',
    description: 'Chí bảo thiên địa hỗn nguyên, tăng +35% tỷ lệ đột biến biến chủng hiếm và +30% độ thuần khiết.',
    rarity: 'Thất Giai',
    mutationRateBonus: 0.35,
    purityBonus: 30,
    costLinhThach: 200000,
    icon: '💎'
  }
];

// =========================================================================
// 2. LOGIC NGUYÊN TỐ & TƯƠNG SINH (ELEMENTAL COMPATIBILITY)
// =========================================================================

/**
 * Kiểm tra tính tương thích nguyên tố giữa 2 linh thú:
 * - Cùng hệ: Luôn tương thích
 * - Ngũ hành tương sinh: Kim -> Thủy -> Mộc -> Hỏa -> Thổ -> Kim
 * - Phong trợ Hỏa (Phong + Hỏa), Lôi tương thông Thủy/Kim
 * - Âm Dương & Hỗn Độn: Dung nạp tương sinh với vạn vật
 */
export function areElementsCompatible(elemA: BeastElement, elemB: BeastElement): boolean {
  if (elemA === elemB) return true;

  // Âm Dương và Hỗn Độn hòa hợp với mọi hệ
  if (elemA === 'Âm Dương' || elemB === 'Âm Dương') return true;
  if (elemA === 'Hỗn Độn' || elemB === 'Hỗn Độn') return true;

  // Ngũ hành tương sinh
  const mutualGenerationMap: Record<string, string[]> = {
    'Kim': ['Thủy', 'Lôi'],
    'Thủy': ['Mộc', 'Lôi'],
    'Mộc': ['Hỏa', 'Phong'],
    'Hỏa': ['Thổ', 'Phong'],
    'Thổ': ['Kim'],
    'Phong': ['Hỏa', 'Mộc', 'Lôi'],
    'Lôi': ['Kim', 'Thủy', 'Phong']
  };

  const aCanGenerateB = mutualGenerationMap[elemA]?.includes(elemB);
  const bCanGenerateA = mutualGenerationMap[elemB]?.includes(elemA);

  return Boolean(aCanGenerateB || bCanGenerateA);
}

/**
 * Xác định nguyên tố con lai và khả năng dị biến nguyên tố hiếm
 */
export function determineOffspringElement(
  elemA: BeastElement,
  elemB: BeastElement,
  isMutated: boolean
): BeastElement {
  if (isMutated) {
    // Dị biến nguyên tố đặc biệt
    const pair = [elemA, elemB].sort().join('+');
    if (pair.includes('Hỏa') && pair.includes('Phong')) return 'Lôi';
    if (pair.includes('Thủy') && pair.includes('Phong')) return 'Âm Dương';
    if (pair.includes('Kim') && pair.includes('Thổ')) return 'Hỗn Độn';
    if (pair.includes('Lôi') || pair.includes('Âm Dương')) return 'Hỗn Độn';
    
    // Ngẫu nhiên các nguyên tố hiếm
    const rarePool: BeastElement[] = ['Lôi', 'Phong', 'Âm Dương', 'Hỗn Độn'];
    return rarePool[Math.floor(Math.random() * rarePool.length)];
  }

  // Nếu không dị biến, thừa hưởng 1 trong 2 nguyên tố của cha mẹ (50/50)
  return Math.random() < 0.5 ? elemA : elemB;
}

// =========================================================================
// 3. THẨM ĐỊNH ĐIỀU KIỆN GHÉP ĐÔI (VALIDATION GUARDS)
// =========================================================================

export interface BreedingEligibilityResult {
  eligible: boolean;
  reason?: string;
  missingCosts?: { name: string; required: number; current: number }[];
  linhThachCost: number;
}

export function calculateBreedingCost(parentA: SpiritBeast, parentB: SpiritBeast): number {
  const maxTier = Math.max(parentA.tier || 2, parentB.tier || 2);
  // Bậc 1: 5k, Bậc 2: 15k, Bậc 3: 50k, Bậc 4: 150k, Bậc 5: 500k
  const tierCostMap: Record<number, number> = {
    1: 5000,
    2: 15000,
    3: 50000,
    4: 150000,
    5: 500000
  };
  return tierCostMap[maxTier] || 25000;
}

export function canBreedBeasts(
  player: PlayerStats,
  parentA: SpiritBeast,
  parentB: SpiritBeast,
  catalystItemId?: string,
  currentTime: number = Date.now()
): BreedingEligibilityResult {
  // 1. Không thể tự phối giống với chính mình
  if (parentA.id === parentB.id) {
    return {
      eligible: false,
      reason: 'Không thể ghép đôi linh thú với chính bản thân nó!',
      linhThachCost: 0
    };
  }

  // 2. Chặn thú đang bị khóa trong buồng phối giống
  if (parentA.isLockedInBreeding) {
    return {
      eligible: false,
      reason: `Linh thú [${parentA.name}] hiện đang trong buồng phối giống, không thể ghép đôi!`,
      linhThachCost: 0
    };
  }
  if (parentB.isLockedInBreeding) {
    return {
      eligible: false,
      reason: `Linh thú [${parentB.name}] hiện đang trong buồng phối giống, không thể ghép đôi!`,
      linhThachCost: 0
    };
  }

  // 2b. Chặn thú đang tham gia Hộ Pháp Nhập Định
  if (parentA.isAssignedToMeditation) {
    return {
      eligible: false,
      reason: `Linh thú [${parentA.name}] đang tham gia Hộ Pháp Nhập Định cùng chủ nhân, không thể ghép đôi!`,
      linhThachCost: 0
    };
  }
  if (parentB.isAssignedToMeditation) {
    return {
      eligible: false,
      reason: `Linh thú [${parentB.name}] đang tham gia Hộ Pháp Nhập Định cùng chủ nhân, không thể ghép đôi!`,
      linhThachCost: 0
    };
  }

  // 3. Chặn thú đang trong thời gian hồi chiêu giao phối
  if ((parentA.breedingCooldownEnd || 0) > currentTime) {
    const remainSec = Math.ceil(((parentA.breedingCooldownEnd || 0) - currentTime) / 1000);
    return {
      eligible: false,
      reason: `Linh thú [${parentA.name}] đang trong thời gian tĩnh dưỡng hồi khí (${remainSec}s còn lại)!`,
      linhThachCost: 0
    };
  }
  if ((parentB.breedingCooldownEnd || 0) > currentTime) {
    const remainSec = Math.ceil(((parentB.breedingCooldownEnd || 0) - currentTime) / 1000);
    return {
      eligible: false,
      reason: `Linh thú [${parentB.name}] đang trong thời gian tĩnh dưỡng hồi khí (${remainSec}s còn lại)!`,
      linhThachCost: 0
    };
  }

  // 4. Kiểm tra tương thích nguyên tố ngũ hành
  const elemA = (parentA.element as BeastElement) || 'Hỏa';
  const elemB = (parentB.element as BeastElement) || 'Hỏa';
  if (!areElementsCompatible(elemA, elemB)) {
    return {
      eligible: false,
      reason: `Nguyên tố [${elemA}] và [${elemB}] xung khắc, không thể hòa hợp kết tinh linh noãn!`,
      linhThachCost: 0
    };
  }

  // 5. Kiểm tra sức chứa lồng ấp Thú Uyển
  const facility = player.beastGarden?.facility || {
    level: 1,
    maxBreedingSlots: 2,
    incubationSpeedMultiplier: 1.0,
    mutationRateBonus: 0
  };
  const activeEggsCount = (player.beastGarden?.eggs || []).filter(e => !e.isHatched).length;
  if (activeEggsCount >= facility.maxBreedingSlots) {
    return {
      eligible: false,
      reason: `Thú Uyển đã đạt giới hạn ấp noãn tối đa (${activeEggsCount}/${facility.maxBreedingSlots}). Hãy nâng cấp Thú Uyển hoặc ấp nở trứng hiện có!`,
      linhThachCost: 0
    };
  }

  // 6. Kiểm tra tài nguyên tiêu hao (Linh Thạch & Xúc Tác)
  const baseCost = calculateBreedingCost(parentA, parentB);
  let totalCost = baseCost;
  let catalyst: BreedingCatalystItem | undefined;

  if (catalystItemId) {
    catalyst = BREEDING_CATALYSTS.find(c => c.id === catalystItemId);
    if (catalyst) {
      totalCost += catalyst.costLinhThach;
    }
  }

  const currentLinhThach = player.linhThach || 0;
  if (currentLinhThach < totalCost) {
    return {
      eligible: false,
      reason: `Linh Thạch không đủ! Cần ${totalCost.toLocaleString()} Linh Thạch (Hiện có: ${currentLinhThach.toLocaleString()}).`,
      missingCosts: [{ name: 'Linh Thạch', required: totalCost, current: currentLinhThach }],
      linhThachCost: totalCost
    };
  }

  return {
    eligible: true,
    linhThachCost: totalCost
  };
}

// =========================================================================
// 4. THUẬT TOÁN DI TRUYỀN & DỊ BIẾN (INHERITANCE & MUTATION ENGINE)
// =========================================================================

export interface BreedingOutcomePreview {
  offspringName: string;
  offspringSpeciesId: string;
  offspringElement: BeastElement;
  offspringTier: BloodlineTier;
  bloodlinePurity: number;
  generation: number;
  isHybrid: boolean;
  canMount: boolean;
  canFight: boolean;
  travelSpeedBonus: number;
  combatStats: BeastCombatStats;
  innateAura?: BeastInnateAura;
  mutationChance: number;
  isMutated: boolean;
  incubateDuration: number;
}

/**
 * Thuật toán di truyền chỉ số và đột biến
 */
export function generateBeastBreedingResult(
  parentA: SpiritBeast,
  parentB: SpiritBeast,
  facility: BeastGardenFacility,
  catalystItemId?: string,
  forcedMutationRandom?: number
): BreedingOutcomePreview {
  const catalyst = BREEDING_CATALYSTS.find(c => c.id === catalystItemId);
  
  // 1. Tỷ lệ đột biến
  const baseMutationChance = 0.15; // 15% cơ bản
  const facilityBonus = (facility.mutationRateBonus || 0) / 100;
  const catalystBonus = catalyst?.mutationRateBonus || 0;
  const totalMutationChance = Math.min(0.85, baseMutationChance + facilityBonus + catalystBonus);

  const roll = forcedMutationRandom !== undefined ? forcedMutationRandom : Math.random();
  const isMutated = roll < totalMutationChance;

  // 2. Di truyền Tốc độ Di chuyển (Mount Speed)
  // travelSpeedBonus = Math.max(A, B) * 0.8 + Math.min(A, B) * 0.4 + Variance(±5%)
  const speedA = parentA.travelSpeedBonus ?? (parentA.stats?.mountSpeedBonus || 15);
  const speedB = parentB.travelSpeedBonus ?? (parentB.stats?.mountSpeedBonus || 15);
  const maxSpeed = Math.max(speedA, speedB);
  const minSpeed = Math.min(speedA, speedB);
  const baseInheritedSpeed = maxSpeed * 0.8 + minSpeed * 0.4;
  const variance = ((roll * 100) % 10 - 5) / 100 * baseInheritedSpeed; // ±5%
  let finalSpeed = Math.max(12, Math.round(baseInheritedSpeed + variance));

  // 3. Di truyền Chỉ số Chiến đấu (Combat Stats)
  // combatStats = (A + B) / 2 + GenerationBonus(gen * 3%)
  const atkA = parentA.combatStats?.atkBonus ?? (parentA.stats?.atk || 50);
  const atkB = parentB.combatStats?.atkBonus ?? (parentB.stats?.atk || 50);
  const defA = parentA.combatStats?.defBonus ?? (parentA.stats?.def || 30);
  const defB = parentB.combatStats?.defBonus ?? (parentB.stats?.def || 30);
  const hpA = parentA.combatStats?.hpBonus ?? (parentA.stats?.hp || 300);
  const hpB = parentB.combatStats?.hpBonus ?? (parentB.stats?.hp || 300);

  const genA = parentA.generation ?? 0;
  const genB = parentB.generation ?? 0;
  const nextGen = Math.max(genA, genB) + 1;
  const genBonusMultiplier = 1 + nextGen * 0.03; // +3% mỗi thế hệ

  let finalAtk = Math.max(30, Math.round(((atkA + atkB) / 2) * genBonusMultiplier));
  let finalDef = Math.max(15, Math.round(((defA + defB) / 2) * genBonusMultiplier));
  let finalHp = Math.max(150, Math.round(((hpA + hpB) / 2) * genBonusMultiplier));
  const avgCrit = ((parentA.combatStats?.critRate ?? 5) + (parentB.combatStats?.critRate ?? 5)) / 2;
  let finalCrit = Math.min(45, Math.max(5, Math.round(avgCrit + nextGen * 0.5)));

  // 4. Độ thuần khiết huyết mạch
  const purityA = parentA.bloodlinePurity ?? 30;
  const purityB = parentB.bloodlinePurity ?? 30;
  let finalPurity = Math.round((purityA + purityB) / 2);
  if (catalyst?.purityBonus) {
    finalPurity += catalyst.purityBonus;
  }
  finalPurity = Math.min(100, Math.max(15, finalPurity));

  // 5. Xác định Bậc Phẩm Cấp (Tier)
  const tierA = parentA.tier || 2;
  const tierB = parentB.tier || 2;
  let finalTier: BloodlineTier = Math.max(tierA, tierB) as BloodlineTier;

  // 6. Xử lý Đột Biến (Mutation Effect)
  const elemA = (parentA.element as BeastElement) || 'Hỏa';
  const elemB = (parentB.element as BeastElement) || 'Hỏa';
  const finalElement = determineOffspringElement(elemA, elemB, isMutated);

  let innateAura: BeastInnateAura | undefined = undefined;

  if (isMutated) {
    // Đột biến nâng bậc huyết mạch nếu chưa đạt bậc 5
    if (finalTier < 5) {
      finalTier = (finalTier + 1) as BloodlineTier;
    }
    // Thưởng thêm chỉ số bộc phát đột biến (+25% tốc độ & công thủ)
    finalSpeed = Math.round(finalSpeed * 1.25);
    finalAtk = Math.round(finalAtk * 1.25);
    finalDef = Math.round(finalDef * 1.25);
    finalHp = Math.round(finalHp * 1.25);
    finalCrit += 5;

    // Kích hoạt Thiên Phú Hào Quang Độc Nhất
    const auraIndex = Math.floor(Math.random() * INNATE_AURAS_POOL.length);
    innateAura = { ...INNATE_AURAS_POOL[auraIndex] };
  } else if (parentA.innateAura || parentB.innateAura) {
    // Kế thừa hào quang từ cha hoặc mẹ nếu có
    innateAura = parentA.innateAura || parentB.innateAura;
  }

  // Đặt tên biến chủng
  const prefix = isMutated ? 'Biến Dị' : 'Dị Chủng';
  const offspringName = `${prefix} ${parentA.name.split(' ')[0] || 'Linh'}-${parentB.name.split(' ')[0] || 'Thú'} (F${nextGen})`;
  const offspringSpeciesId = `hybrid_${parentA.speciesId || 'beast'}_${parentB.speciesId || 'beast'}_${Date.now()}`;

  // Thời gian ấp trứng (giảm theo cấp độ Thú Uyển)
  const speedMult = facility.incubationSpeedMultiplier || 1.0;
  const baseDuration = DEFAULT_INCUBATION_DURATION_MS;
  const incubateDuration = Math.max(15000, Math.round(baseDuration / speedMult));

  return {
    offspringName,
    offspringSpeciesId,
    offspringElement: finalElement,
    offspringTier: finalTier,
    bloodlinePurity: finalPurity,
    generation: nextGen,
    isHybrid: true,
    canMount: true, // Chiến Tọa Song Toàn
    canFight: true, // Chiến Tọa Song Toàn
    travelSpeedBonus: finalSpeed,
    combatStats: {
      atkBonus: finalAtk,
      defBonus: finalDef,
      hpBonus: finalHp,
      critRate: finalCrit
    },
    innateAura,
    mutationChance: totalMutationChance,
    isMutated,
    incubateDuration
  };
}

// =========================================================================
// 5. THỰC THI BẮT ĐẦU LAI TẠO (START BREEDING)
// =========================================================================

export interface StartBreedingResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  eggId?: string;
  message: string;
}

export function startBeastBreeding(
  player: PlayerStats,
  parentAId: string,
  parentBId: string,
  catalystItemId?: string,
  currentTime: number = Date.now(),
  forcedMutationRandom?: number
): StartBreedingResult {
  const beasts = player.beastGarden?.beasts || player.beasts || [];
  const parentA = beasts.find(b => b.id === parentAId);
  const parentB = beasts.find(b => b.id === parentBId);

  if (!parentA || !parentB) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy thông tin linh thú cha mẹ đã chọn!'
    };
  }

  // 1. Thẩm định điều kiện
  const check = canBreedBeasts(player, parentA, parentB, catalystItemId, currentTime);
  if (!check.eligible) {
    return {
      success: false,
      updatedPlayer: player,
      message: check.reason || 'Điều kiện lai tạo chưa thỏa mãn!'
    };
  }

  const facility = player.beastGarden?.facility || {
    level: 1,
    maxBreedingSlots: 2,
    incubationSpeedMultiplier: 1.0,
    mutationRateBonus: 0
  };

  // 2. Tính toán kết quả di truyền
  const preview = generateBeastBreedingResult(parentA, parentB, facility, catalystItemId, forcedMutationRandom);

  // 3. Khởi tạo Trứng Dị Thú
  const eggId = `egg_breed_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const newEgg: BeastEgg = {
    id: eggId,
    name: `Linh Noãn ${preview.offspringName}`,
    quality: preview.offspringTier >= 4 ? 'than_pham' : preview.offspringTier >= 3 ? 'tuyet_pham' : 'thuong_pham',
    potentialSpecies: preview.offspringSpeciesId,
    progress: 0,
    requiredProgress: 100,
    infusedLinhThach: 0,
    infusedMp: 0,
    parents: {
      fatherName: parentA.name,
      motherName: parentB.name,
      element: preview.offspringElement,
      fatherId: parentA.id,
      motherId: parentB.id
    },
    rarity: preview.offspringTier,
    incubateStartTime: currentTime,
    incubateDuration: preview.incubateDuration,
    isHatched: false,
    predictedMutations: preview.isMutated ? ['Đột Biến Huyết Mạch', 'Hào Quang Thiên Phú'] : ['Kế Thừa Huyết Thống'],
    inheritedTraits: {
      speciesId: preview.offspringSpeciesId,
      name: preview.offspringName,
      element: preview.offspringElement,
      tier: preview.offspringTier,
      bloodlinePurity: preview.bloodlinePurity,
      generation: preview.generation,
      isHybrid: true,
      canMount: true,
      canFight: true,
      travelSpeedBonus: preview.travelSpeedBonus,
      combatStats: preview.combatStats,
      innateAura: preview.innateAura
    },
    catalystItemId
  };

  // 4. Khóa linh thú cha mẹ
  const updatedBeasts = beasts.map(b => {
    if (b.id === parentA.id || b.id === parentB.id) {
      return {
        ...b,
        isLockedInBreeding: true
      };
    }
    return b;
  });

  // 5. Cập nhật state Thú Uyển
  const curEggs = player.beastGarden?.eggs || [];
  const updatedEggs = [...curEggs, newEgg];

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: Math.max(0, (player.linhThach || 0) - check.linhThachCost),
    beasts: updatedBeasts,
    beastGarden: {
      facility,
      beasts: updatedBeasts,
      eggs: updatedEggs,
      activeMountId: player.beastGarden?.activeMountId || null,
      activeCombatId: player.beastGarden?.activeCombatId || null,
      breedingPairs: [
        ...(player.beastGarden?.breedingPairs || []),
        {
          id: `pair_${Date.now()}`,
          fatherId: parentA.id,
          motherId: parentB.id,
          eggId,
          startTime: currentTime,
          finishTime: currentTime + preview.incubateDuration,
          catalystItemId
        }
      ]
    }
  };

  const catalystName = BREEDING_CATALYSTS.find(c => c.id === catalystItemId)?.name;
  const msg = catalystName
    ? `🔥 Khởi động Lai Tạo Huyết Mạch giữa [${parentA.name}] và [${parentB.name}] kèm [${catalystName}] thành công! Đã chuyển Linh Noãn vào lồng ấp.`
    : `🔥 Khởi động Lai Tạo Huyết Mạch giữa [${parentA.name}] và [${parentB.name}] thành công! Đã chuyển Linh Noãn vào lồng ấp.`;

  return {
    success: true,
    updatedPlayer,
    eggId,
    message: msg
  };
}

// =========================================================================
// 6. HOÀN TẤT ẤP NỞ LINH NOÃN (HATCH EGG)
// =========================================================================

export interface HatchEggResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  newBeast?: SpiritBeast;
  message: string;
}

export function hatchBeastEgg(
  player: PlayerStats,
  eggId: string,
  currentTime: number = Date.now()
): HatchEggResult {
  const eggs = player.beastGarden?.eggs || [];
  const targetEgg = eggs.find(e => e.id === eggId);

  if (!targetEgg) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy Linh Noãn trong lồng ấp!'
    };
  }

  // Kiểm tra thời gian ấp
  const finishTime = (targetEgg.incubateStartTime || 0) + (targetEgg.incubateDuration || 0);
  if (!targetEgg.isHatched && currentTime < finishTime) {
    const remainSec = Math.ceil((finishTime - currentTime) / 1000);
    return {
      success: false,
      updatedPlayer: player,
      message: `Linh Noãn chưa hấp thu đủ linh khí thiên địa để phá vỏ (Còn lại ${remainSec}s)!`
    };
  }

  const traits = targetEgg.inheritedTraits;
  if (!traits) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Linh Noãn thiếu thông tin huyết thống di truyền!'
    };
  }

  // Khởi tạo Dị Thú mới hoàn chỉnh
  const newBeastId = `beast_hybrid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const tier = traits.tier || 2;
  const quality = tier >= 5 ? 'tien_pham' : tier >= 4 ? 'than_pham' : tier >= 3 ? 'tuyet_pham' : 'thuong_pham';

  const newBeast: SpiritBeast = {
    id: newBeastId,
    name: traits.name,
    species: traits.speciesId,
    speciesId: traits.speciesId,
    quality,
    element: traits.element,
    level: 1,
    maxLevel: 100,
    exp: 0,
    maxExp: 1000,
    star: 1,
    maxStar: 5,
    stage: 1,
    stageName: 'Ấu Thể',
    loyalty: 100,
    role: 'both',
    avatar: traits.tier >= 4 ? '🐉' : traits.tier >= 3 ? '⚡🐺' : '🐾',
    description: `Biến chủng Dị Thú thế hệ F${traits.generation} kết hợp giữa [${targetEgg.parents?.fatherName}] và [${targetEgg.parents?.motherName}]. Sở hữu năng lực Chiến Tọa Song Toàn.`,
    isDeployed: false,

    // Thuộc tính Lai Tạo & Huyết Mạch
    tier: traits.tier,
    bloodlinePurity: traits.bloodlinePurity,
    generation: traits.generation,
    isHybrid: true,
    canMount: true,
    canFight: true,
    travelSpeedBonus: traits.travelSpeedBonus,
    combatStats: traits.combatStats,
    innateAura: traits.innateAura,
    breedingCooldownEnd: currentTime + DEFAULT_BREEDING_COOLDOWN_MS,
    isLockedInBreeding: false,

    // Legacy Stats Compatibility
    stats: {
      hp: traits.combatStats.hpBonus,
      maxHp: traits.combatStats.hpBonus,
      atk: traits.combatStats.atkBonus,
      def: traits.combatStats.defBonus,
      blockPercent: 15,
      mountSpeedBonus: traits.travelSpeedBonus,
      mpRegenBonus: 20
    },
    skills: traits.innateAura ? [
      {
        id: traits.innateAura.id,
        name: traits.innateAura.name,
        description: traits.innateAura.description,
        effectType: traits.innateAura.effectType,
        value: traits.innateAura.value
      }
    ] : []
  };

  // Mở khóa cho cha mẹ và đặt thời gian hồi chiêu phối giống
  const fatherId = targetEgg.parents?.fatherId;
  const motherId = targetEgg.parents?.motherId;

  const curBeasts = player.beastGarden?.beasts || player.beasts || [];
  const updatedBeasts = curBeasts.map(b => {
    if (b.id === fatherId || b.id === motherId) {
      return {
        ...b,
        isLockedInBreeding: false,
        breedingCooldownEnd: currentTime + DEFAULT_BREEDING_COOLDOWN_MS
      };
    }
    return b;
  });

  // Thêm linh thú mới vào danh sách
  const finalBeasts = [...updatedBeasts, newBeast];

  // Loại bỏ quả trứng đã nở khỏi danh sách trứng đang ấp
  const remainingEggs = eggs.filter(e => e.id !== eggId);

  // Xóa phiên ghép đôi tương ứng
  const remainingPairs = (player.beastGarden?.breedingPairs || []).filter(p => p.eggId !== eggId);

  const updatedPlayer: PlayerStats = {
    ...player,
    beasts: finalBeasts,
    spiritBeasts: finalBeasts,
    beastGarden: {
      facility: player.beastGarden?.facility || {
        level: 1,
        maxBreedingSlots: 2,
        incubationSpeedMultiplier: 1.0,
        mutationRateBonus: 0
      },
      beasts: finalBeasts,
      eggs: remainingEggs,
      activeMountId: player.beastGarden?.activeMountId || null,
      activeCombatId: player.beastGarden?.activeCombatId || null,
      breedingPairs: remainingPairs
    }
  };

  const auraMsg = traits.innateAura ? ` Kèm Thiên Phú Hào Quang [${traits.innateAura.name}]!` : '';
  const msg = `🎉 Linh Noãn phá vỏ thành công! Chúc mừng đạo hữu nhận được [${newBeast.name}] phẩm cấp [${BLOODLINE_TIER_NAMES[newBeast.tier || 2]}], Chiến Tọa Song Toàn!${auraMsg}`;

  return {
    success: true,
    updatedPlayer,
    newBeast,
    message: msg
  };
}

// =========================================================================
// 7. DÙNG LINH THẠCH TĂNG TỐC ẤP NỞ (SPEED UP INCUBATION)
// =========================================================================

export function speedUpIncubation(
  player: PlayerStats,
  eggId: string,
  currentTime: number = Date.now()
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  const eggs = player.beastGarden?.eggs || [];
  const targetEgg = eggs.find(e => e.id === eggId);

  if (!targetEgg) {
    return { success: false, updatedPlayer: player, message: 'Không tìm thấy Linh Noãn cần tăng tốc!' };
  }

  const finishTime = (targetEgg.incubateStartTime || 0) + (targetEgg.incubateDuration || 0);
  const remainingSec = Math.max(0, Math.ceil((finishTime - currentTime) / 1000));

  if (remainingSec <= 0) {
    return { success: false, updatedPlayer: player, message: 'Linh Noãn đã sẵn sàng ấp nở, không cần tăng tốc!' };
  }

  // 10 Linh Thạch cho mỗi giây còn lại
  const cost = remainingSec * 10;
  if ((player.linhThach || 0) < cost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Thiếu Linh Thạch! Cần ${cost.toLocaleString()} Linh Thạch để rút ngắn ${remainingSec}s.`
    };
  }

  const updatedEggs = eggs.map(e => {
    if (e.id === eggId) {
      return {
        ...e,
        incubateDuration: 0 // nở tức thì
      };
    }
    return e;
  });

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) - cost,
    beastGarden: {
      ...player.beastGarden!,
      eggs: updatedEggs
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `⚡ Tiêu hao ${cost.toLocaleString()} Linh Thạch quán chú linh lực, Linh Noãn lập tức sẵn sàng nở!`
  };
}

// =========================================================================
// 8. TIẾN HÓA HUYẾT MẠCH (BLOODLINE EVOLUTION & AWAKENING)
// =========================================================================

export interface EvolveBloodlineResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  evolvedBeast?: SpiritBeast;
  tierUp: boolean;
  message: string;
}

export function evolveBloodline(
  player: PlayerStats,
  beastId: string,
  pillType: 'beast_dan' | 'blood_pill' = 'beast_dan'
): EvolveBloodlineResult {
  const beasts = player.beastGarden?.beasts || player.beasts || [];
  const targetBeast = beasts.find(b => b.id === beastId);

  if (!targetBeast) {
    return {
      success: false,
      updatedPlayer: player,
      tierUp: false,
      message: 'Không tìm thấy linh thú cần tiến hóa huyết mạch!'
    };
  }

  const currentTier = targetBeast.tier || 2;
  const currentPurity = targetBeast.bloodlinePurity || 30;

  if (currentTier >= 5 && currentPurity >= 100) {
    return {
      success: false,
      updatedPlayer: player,
      tierUp: false,
      message: 'Linh thú đã đạt tới cảnh giới Thái Cổ Cực Hạn (100% Thuần Khiết), không thể thăng hoa thêm!'
    };
  }

  // Chi phí tiến hóa
  const costMap: Record<number, number> = {
    1: 5000,
    2: 15000,
    3: 50000,
    4: 150000,
    5: 500000
  };
  const linhThachCost = costMap[currentTier] || 20000;

  if ((player.linhThach || 0) < linhThachCost) {
    return {
      success: false,
      updatedPlayer: player,
      tierUp: false,
      message: `Thiếu Linh Thạch! Cần ${linhThachCost.toLocaleString()} Linh Thạch để thối luyện huyết mạch.`
    };
  }

  const purityGain = pillType === 'blood_pill' ? 25 : 15;
  let newPurity = currentPurity + purityGain;
  let tierUp = false;
  let newTier = currentTier;
  let newAura = targetBeast.innateAura;

  let newAtk = targetBeast.combatStats?.atkBonus ?? (targetBeast.stats?.atk || 50);
  let newDef = targetBeast.combatStats?.defBonus ?? (targetBeast.stats?.def || 30);
  let newHp = targetBeast.combatStats?.hpBonus ?? (targetBeast.stats?.hp || 300);
  let newSpeed = targetBeast.travelSpeedBonus ?? (targetBeast.stats?.mountSpeedBonus || 20);

  // Đột phá Bậc Huyết Mạch khi đạt 100%
  if (newPurity >= 100) {
    if (currentTier < 5) {
      tierUp = true;
      newTier = (currentTier + 1) as BloodlineTier;
      newPurity = 0; // Bắt đầu tích lũy cho bậc kế tiếp

      // Thưởng đột phá bậc: +25% chỉ số cơ bản, +10% tốc độ
      newAtk = Math.round(newAtk * 1.25);
      newDef = Math.round(newDef * 1.25);
      newHp = Math.round(newHp * 1.25);
      newSpeed = Math.min(100, Math.round(newSpeed * 1.10));

      // Mở khóa Hào Quang Thiên Phú nếu chưa có khi đạt Tier >= 3
      if (newTier >= 3 && !newAura) {
        const auraIndex = Math.floor(Math.random() * INNATE_AURAS_POOL.length);
        newAura = { ...INNATE_AURAS_POOL[auraIndex] };
      }
    } else {
      newPurity = 100;
      newAtk = Math.round(newAtk * 1.05);
      newDef = Math.round(newDef * 1.05);
      newHp = Math.round(newHp * 1.05);
    }
  }

  const evolvedBeast: SpiritBeast = {
    ...targetBeast,
    tier: newTier,
    bloodlinePurity: newPurity,
    travelSpeedBonus: newSpeed,
    combatStats: {
      atkBonus: newAtk,
      defBonus: newDef,
      hpBonus: newHp,
      critRate: targetBeast.combatStats?.critRate ?? 5
    },
    innateAura: newAura,
    stats: {
      ...targetBeast.stats,
      atk: newAtk,
      def: newDef,
      hp: newHp,
      maxHp: newHp,
      mountSpeedBonus: newSpeed
    }
  };

  const updatedBeasts = beasts.map(b => (b.id === beastId ? evolvedBeast : b));

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) - linhThachCost,
    beasts: updatedBeasts,
    spiritBeasts: updatedBeasts,
    beastGarden: {
      facility: player.beastGarden?.facility || {
        level: 1,
        maxBreedingSlots: 2,
        incubationSpeedMultiplier: 1.0,
        mutationRateBonus: 0
      },
      beasts: updatedBeasts,
      eggs: player.beastGarden?.eggs || [],
      activeMountId: player.beastGarden?.activeMountId || null,
      activeCombatId: player.beastGarden?.activeCombatId || null,
      breedingPairs: player.beastGarden?.breedingPairs || []
    }
  };

  const auraMsg = tierUp && newAura ? ` Đồng thời giác ngộ Hào Quang [${newAura.name}]!` : '';
  const message = tierUp
    ? `🌟 Huyết Mạch Thăng Hoa! [${targetBeast.name}] đã đột phá lên [${BLOODLINE_TIER_NAMES[newTier as BloodlineTier]}], chỉ số tăng vọt!${auraMsg}`
    : `🩸 Quán chú Huyết Mạch Đan thành công! Độ thuần khiết huyết mạch của [${targetBeast.name}] tăng lên ${newPurity}%.`;

  return {
    success: true,
    updatedPlayer,
    evolvedBeast,
    tierUp,
    message
  };
}

// =========================================================================
// 9. THIẾT LẬP VAI TRÒ (TOGGLE EQUIP BEAST - MOUNT / COMBAT / BOTH)
// =========================================================================

export function toggleEquipBeastRole(
  player: PlayerStats,
  beastId: string,
  slot: 'mount' | 'combat' | 'both'
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  const beasts = player.beastGarden?.beasts || player.beasts || [];
  const targetBeast = beasts.find(b => b.id === beastId);

  if (!targetBeast) {
    return { success: false, updatedPlayer: player, message: 'Không tìm thấy linh thú!' };
  }

  let activeMountId = player.beastGarden?.activeMountId || null;
  let activeCombatId = player.beastGarden?.activeCombatId || null;

  if (slot === 'mount') {
    activeMountId = activeMountId === beastId ? null : beastId;
  } else if (slot === 'combat') {
    activeCombatId = activeCombatId === beastId ? null : beastId;
  } else if (slot === 'both') {
    const isBothActive = activeMountId === beastId && activeCombatId === beastId;
    if (isBothActive) {
      activeMountId = null;
      activeCombatId = null;
    } else {
      activeMountId = beastId;
      activeCombatId = beastId;
    }
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    activeBeastId: activeCombatId || activeMountId || player.activeBeastId,
    beastsState: {
      ...player.beastsState,
      ownedBeastIds: player.beastsState?.ownedBeastIds || [],
      activeCombatBeastId: activeCombatId || undefined,
      activeMountBeastId: activeMountId || undefined
    },
    beastGarden: {
      facility: player.beastGarden?.facility || {
        level: 1,
        maxBreedingSlots: 2,
        incubationSpeedMultiplier: 1.0,
        mutationRateBonus: 0
      },
      beasts,
      eggs: player.beastGarden?.eggs || [],
      activeMountId,
      activeCombatId,
      breedingPairs: player.beastGarden?.breedingPairs || []
    }
  };

  const actionDesc =
    slot === 'both'
      ? activeMountId === beastId ? 'Chiến Tọa Song Toàn (Vừa cưỡi vừa xuất chiến)' : 'Đã thu hồi'
      : slot === 'mount'
      ? activeMountId === beastId ? 'Tọa Kỵ Thần Hành' : 'Đã tháo Tọa Kỵ'
      : activeCombatId === beastId ? 'Chiến Thú Hộ Thân' : 'Đã thu hồi Chiến Thú';

  return {
    success: true,
    updatedPlayer,
    message: `🐾 [${targetBeast.name}]: ${actionDesc}!`
  };
}

// =========================================================================
// 10. NÂNG CẤP THÚ UYỂN (UPGRADE BEAST GARDEN FACILITY)
// =========================================================================

export function upgradeBeastGardenFacility(
  player: PlayerStats
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  const currentFacility = player.beastGarden?.facility || {
    level: 1,
    maxBreedingSlots: 2,
    incubationSpeedMultiplier: 1.0,
    mutationRateBonus: 0
  };

  if (currentFacility.level >= 5) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Thú Uyển đã đạt cấp bậc tối cao (Cấp 5 - Vạn Thú Tiên Cung)!'
    };
  }

  const nextLevel = currentFacility.level + 1;
  const upgradeCost = nextLevel * 50000; // 100k, 150k, 200k, 250k

  if ((player.linhThach || 0) < upgradeCost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Thiếu Linh Thạch! Cần ${upgradeCost.toLocaleString()} Linh Thạch để nâng cấp Thú Uyển lên Cấp ${nextLevel}.`
    };
  }

  const newFacility: BeastGardenFacility = {
    level: nextLevel,
    maxBreedingSlots: nextLevel + 1, // 3, 4, 5, 6
    incubationSpeedMultiplier: 1.0 + (nextLevel - 1) * 0.25, // 1.25x, 1.5x, 1.75x, 2.0x
    mutationRateBonus: (nextLevel - 1) * 5 // +5%, +10%, +15%, +20%
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) - upgradeCost,
    beastGarden: {
      facility: newFacility,
      beasts: player.beastGarden?.beasts || player.beasts || [],
      eggs: player.beastGarden?.eggs || [],
      activeMountId: player.beastGarden?.activeMountId || null,
      activeCombatId: player.beastGarden?.activeCombatId || null,
      breedingPairs: player.beastGarden?.breedingPairs || []
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `🏰 Thú Uyển đã nâng cấp thành công lên Cấp ${nextLevel}! Sức chứa lồng ấp: ${newFacility.maxBreedingSlots}, Tốc độ ấp: ${newFacility.incubationSpeedMultiplier}x, Tỷ lệ dị biến: +${newFacility.mutationRateBonus}%.`
  };
}
