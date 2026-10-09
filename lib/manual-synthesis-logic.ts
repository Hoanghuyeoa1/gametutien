// lib/manual-synthesis-logic.ts
// Pure Business Logic cho Hệ Thống Dung Hợp Công Pháp (Bàn Diễn Võ Vạn Pháp)
// KHÔNG CHỨA React hooks, side-effects hay LocalStorage — hoàn toàn thuần túy và dễ kiểm thử.

import { Manual } from '@/lib/types/items';
import {
  ManualCombatAura,
  ManualAuraEffectType,
  SynthesizedManualExtension,
  SynthesisEligibilityResult,
  SynthesisResult,
  SynthesisTierConfig,
  SynthesisCatalyst
} from '@/lib/types/manual-synthesis';

// ─── Bảng Phẩm Cấp Công Pháp ─────────────────────────────────────────────────
// Ánh xạ grade string -> số thứ tự giai bậc (dùng để so sánh và tính tier+1)
export const MANUAL_GRADE_ORDER: Record<string, number> = {
  'Hoàng Giai': 1,
  'Huyền Giai': 2,
  'Địa Giai': 3,
  'Thiên Giai': 4,
  'Thần Giai': 5,
  'Thái Cổ Giai': 6,
  'Tiên Thiên Giai': 7,
};

export const MANUAL_GRADE_BY_ORDER: Record<number, string> = {
  1: 'Hoàng Giai',
  2: 'Huyền Giai',
  3: 'Địa Giai',
  4: 'Thiên Giai',
  5: 'Thần Giai',
  6: 'Thái Cổ Giai',
  7: 'Tiên Thiên Giai',
};

// ─── Bảng Cấu Hình Chi Phí Theo Giai Bậc ────────────────────────────────────
export const SYNTHESIS_TIER_CONFIG: Record<number, SynthesisTierConfig> = {
  1: { tier: 1, tierName: 'Hoàng Giai', costLinhThach: 500,    mutationBaseChance: 20, statInheritMultiplier: 0.75, requiredRealmIndex: 3  },
  2: { tier: 2, tierName: 'Huyền Giai', costLinhThach: 2000,   mutationBaseChance: 20, statInheritMultiplier: 0.75, requiredRealmIndex: 10 },
  3: { tier: 3, tierName: 'Địa Giai',   costLinhThach: 6000,   mutationBaseChance: 20, statInheritMultiplier: 0.75, requiredRealmIndex: 18 },
  4: { tier: 4, tierName: 'Thiên Giai', costLinhThach: 20000,  mutationBaseChance: 20, statInheritMultiplier: 0.75, requiredRealmIndex: 28 },
  5: { tier: 5, tierName: 'Thần Giai',  costLinhThach: 80000,  mutationBaseChance: 20, statInheritMultiplier: 0.75, requiredRealmIndex: 38 },
  6: { tier: 6, tierName: 'Thái Cổ Giai', costLinhThach: 300000, mutationBaseChance: 20, statInheritMultiplier: 0.75, requiredRealmIndex: 48 },
};

// ─── Danh Sách Đạo Cụ Xúc Tác ───────────────────────────────────────────────
export const SYNTHESIS_CATALYSTS: SynthesisCatalyst[] = [
  {
    itemId: 'ngo_dao_thach',
    name: 'Ngộ Đạo Thạch',
    successRateBonus: 0,
    mutationRateBonus: 25,
    guaranteedAura: false
  },
  {
    itemId: 'vo_tu_thien_thu',
    name: 'Vô Tự Thiên Thư',
    successRateBonus: 0,
    mutationRateBonus: 45,
    guaranteedAura: false
  },
  {
    itemId: 'thien_dao_tinh_thach',
    name: 'Thiên Đạo Tinh Thạch',
    successRateBonus: 0,
    mutationRateBonus: 80,
    guaranteedAura: true
  }
];

// ─── Kho Thần Thông Dị Biến ──────────────────────────────────────────────────
const COMBAT_AURA_POOL: ManualCombatAura[] = [
  {
    id: 'aura_liet_hoa_phan_kich',
    name: 'Liệt Hỏa Phản Kích',
    description: 'Mỗi lần bị tấn công, có xác suất bùng cháy phản kích đốt cháy kẻ địch.',
    triggerChance: 25,
    effectType: 'burn_dot',
    effectValue: 18
  },
  {
    id: 'aura_pha_giap_ham_long',
    name: 'Phá Giáp Hàm Long',
    description: 'Mỗi đòn đánh chứa kỳ năng xuyên phá hộ giáp kẻ địch, giảm phòng ngự.',
    triggerChance: 30,
    effectType: 'armor_break',
    effectValue: 25
  },
  {
    id: 'aura_ho_huyet_phong_an',
    name: 'Hồi Huyết Phong Ấn',
    description: 'Chân khí tuần hoàn trong cơ thể, mỗi đòn đánh hút một phần sinh lực đối thủ.',
    triggerChance: 20,
    effectType: 'lifesteal',
    effectValue: 15
  },
  {
    id: 'aura_kiem_dong_nhat_thoi',
    name: 'Kiếm Đông Nhất Thời',
    description: 'Kình lực mang theo hàn khí, mỗi đòn có xác suất phong ấn cử động đối thủ.',
    triggerChance: 20,
    effectType: 'freeze_stun',
    effectValue: 1 // 1 lượt
  },
  {
    id: 'aura_thuan_di_huyem_than',
    name: 'Thuấn Di Huyễn Thân',
    description: 'Thân pháp hư ảo như huyễn ảnh, mỗi lượt có xác suất né tránh một đòn đánh.',
    triggerChance: 35,
    effectType: 'evasion_boost',
    effectValue: 40 // +40% né cho 1 lượt
  },
  {
    id: 'aura_lien_kich_song_long',
    name: 'Liên Kích Song Long',
    description: 'Kình lực dư thừa từ đòn trước chuyển hóa, mỗi đòn có xác suất xuất hiện kép.',
    triggerChance: 22,
    effectType: 'double_strike',
    effectValue: 60 // 60% sát thương đòn thứ hai
  },
  {
    id: 'aura_kim_thien_phan_dam',
    name: 'Kim Thân Phản Đạm',
    description: 'Phòng ngự cứng rắn như kim thân, có xác suất phản kích nguyên vẹn đòn đánh.',
    triggerChance: 18,
    effectType: 'counter_strike',
    effectValue: 80 // 80% sát thương phản kích
  },
  {
    id: 'aura_linh_luc_hut_tron',
    name: 'Linh Lực Hút Trộm',
    description: 'Mỗi đòn khiến đối thủ tiêu hao thêm linh lực, làm cạn kiệt sức mạnh thần thông.',
    triggerChance: 28,
    effectType: 'mp_drain',
    effectValue: 12
  }
];

// ─── Từ Vựng Ghép Tên Cổ Phong ───────────────────────────────────────────────
const LORE_PREFIXES: Record<string, string[]> = {
  tam_phap: ['Huyền', 'Cửu', 'Thái', 'Vô Cực', 'Thiên Địa', 'Hỗn Nguyên', 'Đại Đạo', 'Vạn Tượng'],
  cong_phap: ['Liệt', 'Bôn', 'Cuồng', 'Siêu', 'Khai', 'Phá', 'Hỏa', 'Lôi', 'Băng'],
  than_thong: ['Cửu Trùng', 'Vạn Kiếm', 'Thiên Phong', 'Địa Ngục', 'Lôi Hỏa', 'Huyền Minh', 'Thái Ất'],
  than_phap: ['Lăng', 'Hư', 'Linh', 'Ảo', 'Tinh', 'Tán', 'Hoán', 'Vân'],
  default:   ['Huyền', 'Thái', 'Vô Cực', 'Đại', 'Cửu']
};

const LORE_MIDDLE: Record<string, string[]> = {
  tam_phap: ['Tâm', 'Thần', 'Đạo', 'Khí', 'Linh'],
  cong_phap: ['Kiếm', 'Chưởng', 'Quyền', 'Hỏa', 'Lôi', 'Thiên', 'Long'],
  than_thong: ['Thiên', 'Địa', 'Hỏa', 'Băng', 'Lôi', 'Phong', 'Huyễn'],
  than_phap: ['Hư', 'Ảnh', 'Bộ', 'Hình', 'Vân'],
  default:   ['Đạo', 'Linh', 'Thiên', 'Huyễn']
};

const LORE_SUFFIXES: Record<string, string[]> = {
  tam_phap: ['Kinh', 'Quyết', 'Chú', 'Tông', 'Điển'],
  cong_phap: ['Pháp', 'Quyết', 'Kiếm Pháp', 'Chưởng Pháp', 'Quyền Kinh'],
  than_thong: ['Thuật', 'Thần Thông', 'Bí Thuật', 'Tuyệt Kỹ', 'Tuyệt Chiêu'],
  than_phap: ['Bộ Pháp', 'Thân Pháp', 'Thần Bộ', 'Thân Kỹ', 'Bộ'],
  default:   ['Tuyệt Kỹ', 'Bí Kíp', 'Thần Pháp', 'Quyết']
};

const LORE_CONNECTOR = ['Hỗn Nguyên', 'Tuyệt Thế', 'Thần Cơ', 'Vô Song', 'Đệ Nhất', 'Vạn Pháp'];

// ─── 1. Thuật Toán Sinh Tên Cổ Phong ─────────────────────────────────────────
export function generateSynthesizedName(manualA: Manual, manualB: Manual): string {
  const type = manualA.type || 'default';
  const prefixes = LORE_PREFIXES[type] || LORE_PREFIXES.default;
  const middles  = LORE_MIDDLE[type]   || LORE_MIDDLE.default;
  const suffixes = LORE_SUFFIXES[type] || LORE_SUFFIXES.default;
  const connector = LORE_CONNECTOR;

  // Seed từ tên 2 bí kíp (deterministic dựa trên id nhưng có cảm giác ngẫu nhiên)
  const seed = (manualA.id + manualB.id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pick = <T>(arr: T[], offset = 0): T => arr[(seed + offset) % arr.length];

  const prefix = pick(prefixes, 0);
  const middle = pick(middles, 3);
  const conn   = pick(connector, 7);
  const suffix = pick(suffixes, 11);

  // Lấy 1-2 ký tự đầu tiên từ tên mỗi bí kíp để làm prefix cá nhân hóa
  const headA = (manualA.name || '').slice(0, 2);
  const headB = (manualB.name || '').slice(0, 2);

  // Xây dựng 1 trong 3 pattern ngẫu nhiên theo seed
  const pattern = seed % 3;
  if (pattern === 0) {
    return `${prefix} ${middle} ${conn} ${suffix}`;
  } else if (pattern === 1) {
    return `${headA}${headB} ${conn} ${suffix}`;
  } else {
    return `${prefix} ${headB} ${middle} ${suffix}`;
  }
}

// ─── 2. Thẩm Định Điều Kiện Dung Hợp ────────────────────────────────────────
export function canSynthesizeManuals(
  manualA: Manual & SynthesizedManualExtension,
  manualB: Manual & SynthesizedManualExtension,
  playerLinhThach: number,
  playerRealmIndex: number,
  equippedManualSlots: Record<string, any>,
  catalystCount: number,
  catalystItem?: SynthesisCatalyst | null
): SynthesisEligibilityResult {
  // Phòng vệ tự trùng lặp (Anti-Self)
  if (manualA.id === manualB.id) {
    return { eligible: false, reason: 'Không thể dung hợp một bí tịch với chính nó!' };
  }

  // Kiểm tra cùng phân hệ (type)
  if (manualA.type !== manualB.type) {
    return {
      eligible: false,
      reason: `Dung hợp thất bại! Hai bí tịch phải cùng phân hệ. [${manualA.type}] ≠ [${manualB.type}]`
    };
  }

  // Kiểm tra cùng giai bậc (grade)
  if (manualA.grade !== manualB.grade) {
    return {
      eligible: false,
      reason: `Dung hợp thất bại! Hai bí tịch phải cùng giai bậc. [${manualA.grade}] ≠ [${manualB.grade}]`
    };
  }

  // Kiểm tra chưa đạt trần tối đa (không thể nâng cao hơn Tiên Thiên Giai)
  const currentGradeOrder = MANUAL_GRADE_ORDER[manualA.grade] ?? 0;
  if (currentGradeOrder >= 7) {
    return { eligible: false, reason: 'Bí kíp đã đạt tuyệt đỉnh Tiên Thiên Giai, không thể dung hợp thêm!' };
  }
  if (currentGradeOrder === 0) {
    return { eligible: false, reason: 'Giai bậc bí kíp không xác định, không thể dung hợp!' };
  }

  // Kiểm tra cảnh giới người chơi
  const tierConfig = SYNTHESIS_TIER_CONFIG[currentGradeOrder];
  if (tierConfig && playerRealmIndex < tierConfig.requiredRealmIndex) {
    return {
      eligible: false,
      reason: `Cảnh giới chưa đủ! Cần đạt cảnh giới thứ ${tierConfig.requiredRealmIndex} để dung hợp ${manualA.grade}.`
    };
  }

  // Kiểm tra bí kíp đang được trang bị
  const equippedIds = Object.values(equippedManualSlots || {})
    .filter(Boolean)
    .map(v => (typeof v === 'string' ? v : (v as any)?.id));
  if (equippedIds.includes(manualA.id)) {
    return { eligible: false, reason: `Bí tịch [${manualA.name}] đang được trang bị! Hãy tháo ra trước.` };
  }
  if (equippedIds.includes(manualB.id)) {
    return { eligible: false, reason: `Bí tịch [${manualB.name}] đang được trang bị! Hãy tháo ra trước.` };
  }

  // Kiểm tra đủ Linh Thạch
  const cost = tierConfig?.costLinhThach ?? 500;
  if (playerLinhThach < cost) {
    return {
      eligible: false,
      reason: `Linh Thạch không đủ! Cần ${cost.toLocaleString()} Linh Thạch để dung hợp ${manualA.grade}.`
    };
  }

  // Kiểm tra đủ Đạo Cụ Xúc Tác (nếu có chọn)
  if (catalystItem && catalystCount < 1) {
    return { eligible: false, reason: `Không đủ [${catalystItem.name}]! Cần ít nhất 1 để làm đạo cụ xúc tác.` };
  }

  return { eligible: true };
}

// ─── 3. Tính Toán Chỉ Số Lai ─────────────────────────────────────────────────
export function calculateSynthesizedStats(
  manualA: Manual,
  manualB: Manual,
  newGradeOrder: number
): Partial<Manual> {
  const multi = SYNTHESIS_TIER_CONFIG[newGradeOrder - 1]?.statInheritMultiplier ?? 0.75;
  // Hệ số tăng theo giai mới: mỗi giai tăng thêm 25%
  const tierBoost = 1 + (newGradeOrder - 1) * 0.25;

  const avg = (a?: number, b?: number): number | undefined => {
    if (!a && !b) return undefined;
    return Math.floor(((a ?? 0) + (b ?? 0)) * multi * tierBoost);
  };

  return {
    tuViPerLevel:       Math.floor(((manualA.tuViPerLevel || 0) + (manualB.tuViPerLevel || 0)) * multi * tierBoost),
    linhThachPerLevel:  Math.floor(((manualA.linhThachPerLevel || 30) + (manualB.linhThachPerLevel || 30)) * multi * tierBoost),
    speedBonusPerLevel: avg(manualA.speedBonusPerLevel, manualB.speedBonusPerLevel),
    mpBonusPerLevel:    avg(manualA.mpBonusPerLevel, manualB.mpBonusPerLevel),
    atkBonus:           avg(manualA.atkBonus, manualB.atkBonus),
    defBonus:           avg(manualA.defBonus, manualB.defBonus),
    hpBonus:            avg(manualA.hpBonus, manualB.hpBonus),
    cultivateBonus:     avg(manualA.cultivateBonus, manualB.cultivateBonus),
    minNgoTinh:         Math.floor(((manualA.minNgoTinh || 0) + (manualB.minNgoTinh || 0)) * 0.5),
  };
}

// ─── 4. Cơ Chế Dị Biến Thiên Đạo ────────────────────────────────────────────
export function rollSynthesisMutation(
  manualA: Manual,
  manualB: Manual,
  catalyst?: SynthesisCatalyst | null,
  forceMutation?: boolean
): ManualCombatAura | null {
  // Tỉ lệ cơ bản: 20%
  let mutationChance = 20;

  // Xúc tác nâng cao tỉ lệ
  if (catalyst) {
    mutationChance += catalyst.mutationRateBonus;
    if (catalyst.guaranteedAura) mutationChance = 100;
  }

  // Override cho test
  if (forceMutation) mutationChance = 100;

  const roll = Math.random() * 100;
  if (roll >= mutationChance) return null;

  // Chọn Aura phù hợp với phân hệ bí kíp
  const type = manualA.type || 'default';
  const suitableAuras: ManualCombatAura[] = COMBAT_AURA_POOL.filter(a => {
    if (type === 'than_phap') return a.effectType === 'evasion_boost' || a.effectType === 'double_strike' || a.effectType === 'counter_strike';
    if (type === 'tam_phap')  return a.effectType === 'lifesteal' || a.effectType === 'mp_drain' || a.effectType === 'freeze_stun';
    if (type === 'cong_phap') return a.effectType === 'armor_break' || a.effectType === 'burn_dot' || a.effectType === 'double_strike';
    return true; // than_thong và default: tất cả
  });

  const pool = suitableAuras.length > 0 ? suitableAuras : COMBAT_AURA_POOL;

  // Seed từ ID để reproducible trong test, nhưng đủ đa dạng trong game
  const seed = (manualA.id + manualB.id + Date.now().toString()).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[seed % pool.length];
}

// ─── 5. Hàm Thực Thi Dung Hợp (Atomic) ──────────────────────────────────────
export function synthesizeManuals(
  manualA: Manual & SynthesizedManualExtension,
  manualB: Manual & SynthesizedManualExtension,
  playerLinhThach: number,
  playerRealmIndex: number,
  equippedManualSlots: Record<string, any>,
  allManualsInInventory: Manual[],
  catalyst?: SynthesisCatalyst | null,
  catalystCountInInventory?: number,
  forceMutation?: boolean
): {
  success: boolean;
  reason?: string;
  updatedLinhThach?: number;
  updatedManualsInventory?: Manual[];
  synthesisResult?: SynthesisResult;
} {
  // Validate
  const eligibility = canSynthesizeManuals(
    manualA, manualB,
    playerLinhThach,
    playerRealmIndex,
    equippedManualSlots,
    catalystCountInInventory ?? (catalyst ? 1 : 0),
    catalyst
  );
  if (!eligibility.eligible) {
    return { success: false, reason: eligibility.reason };
  }

  const currentGradeOrder = MANUAL_GRADE_ORDER[manualA.grade] ?? 1;
  const newGradeOrder     = currentGradeOrder + 1;
  const newGrade          = MANUAL_GRADE_BY_ORDER[newGradeOrder] ?? 'Thần Giai';
  const tierConfig        = SYNTHESIS_TIER_CONFIG[currentGradeOrder];
  const costLinhThach     = tierConfig?.costLinhThach ?? 500;

  // Sinh chỉ số lai
  const inheritedStats = calculateSynthesizedStats(manualA, manualB, newGradeOrder);

  // Sinh tên độc bản
  const newName = generateSynthesizedName(manualA, manualB);

  // Cơ chế Dị Biến
  const aura = rollSynthesisMutation(manualA, manualB, catalyst, forceMutation);

  // Tạo bí kíp mới
  const newManual: Manual & SynthesizedManualExtension = {
    // Kế thừa cơ bản từ manualA
    ...manualA,
    // Ghi đè với metadata dung hợp
    id:          `synth_${manualA.id}_${manualB.id}_${Date.now()}`,
    name:        newName,
    grade:       newGrade,
    level:       0,
    maxLevel:    10,
    description: `Tuyệt kỹ dung hợp từ [${manualA.name}] và [${manualB.name}]. Sở hữu chân khí lai của cả hai bộ bí tịch gốc, uy lực vượt trội một giai.`,
    // Chỉ số lai
    ...inheritedStats,
    // Metadata dung hợp
    isSynthesized: true,
    synthesisTier: newGradeOrder,
    synthesisParents: {
      nameA: manualA.name,
      nameB: manualB.name,
      category: (manualA.type || 'default') as any
    },
    innateAura: aura ?? null,
    synthesizedAt: Date.now(),
    // Giá (không thể mua trong cửa hàng)
    priceLinhThach: 0,
    priceDanhVong:  0,
  };

  // Cập nhật kho đồ: loại bỏ 2 bí kíp gốc, thêm bí kíp mới
  const updatedInventory = allManualsInInventory
    .filter(m => m.id !== manualA.id && m.id !== manualB.id)
    .concat(newManual);

  const synthesisResult: SynthesisResult = {
    success: true,
    synthesizedManual: newManual,
    mutationTriggered: aura !== null,
    aura: aura ?? null,
    costLinhThach,
    costCatalystCount: catalyst ? 1 : 0,
    logMessage: aura
      ? `Dung hợp thành công! [${newName}] (${newGrade}) ra đời kèm Dị Biến Tuyệt Kỹ: [${aura.name}]!`
      : `Dung hợp thành công! [${newName}] (${newGrade}) ra đời!`
  };

  return {
    success: true,
    updatedLinhThach: playerLinhThach - costLinhThach,
    updatedManualsInventory: updatedInventory,
    synthesisResult
  };
}

// ─── 6. Tính Toán Tỉ Lệ Dị Biến Hiển Thị (Preview) ─────────────────────────
export function calculateDisplayedMutationRate(
  manualGrade: string,
  catalyst?: SynthesisCatalyst | null
): number {
  let rate = 20;
  if (catalyst) {
    rate += catalyst.mutationRateBonus;
    if (catalyst.guaranteedAura) rate = 100;
  }
  return Math.min(rate, 100);
}

// ─── 7. Tự Động Tìm Cặp Bí Kíp Hợp Lệ (Auto-Match QoL) ─────────────────────
export function findEligibleSynthesisPairs(
  manuals: Manual[]
): [Manual, Manual][] {
  const pairs: [Manual, Manual][] = [];
  const seen = new Set<string>();

  for (let i = 0; i < manuals.length; i++) {
    for (let j = i + 1; j < manuals.length; j++) {
      const a = manuals[i];
      const b = manuals[j];
      if (
        a.type === b.type &&
        a.grade === b.grade &&
        (MANUAL_GRADE_ORDER[a.grade] ?? 0) < 7
      ) {
        const key = [a.id, b.id].sort().join('|');
        if (!seen.has(key)) {
          seen.add(key);
          pairs.push([a, b]);
        }
      }
    }
  }
  return pairs;
}

// ─── 8. Tính Toán Aura Effect trong Combat ───────────────────────────────────
// Hàm này được gọi từ combat engine để xử lý Innate Aura trigger
export function processCombatAuraTrigger(
  aura: ManualCombatAura,
  attackerAtk: number
): {
  triggered: boolean;
  effectType: ManualAuraEffectType;
  effectValue: number;
  damageBonus: number;
  description: string;
} {
  const triggered = Math.random() * 100 < aura.triggerChance;
  if (!triggered) {
    return { triggered: false, effectType: aura.effectType, effectValue: 0, damageBonus: 0, description: '' };
  }

  let damageBonus = 0;
  if (aura.effectType === 'burn_dot') damageBonus = Math.floor(attackerAtk * aura.effectValue / 100);
  if (aura.effectType === 'armor_break') damageBonus = Math.floor(attackerAtk * aura.effectValue / 100);
  if (aura.effectType === 'double_strike') damageBonus = Math.floor(attackerAtk * aura.effectValue / 100);
  if (aura.effectType === 'counter_strike') damageBonus = Math.floor(attackerAtk * aura.effectValue / 100);

  return {
    triggered: true,
    effectType: aura.effectType,
    effectValue: aura.effectValue,
    damageBonus,
    description: `✨ [${aura.name}] kích hoạt! ${aura.description}`
  };
}
