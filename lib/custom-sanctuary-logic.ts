// lib/custom-sanctuary-logic.ts
// Pure Business Logic cho Hệ Thống Linh Mạch Động Phủ Tự Chế (Custom Sanctuary & Vein Socketing)
// Architecture: Clean Architecture, Pure Logic Separation, Hard Invariants & Zero-Exploit Guards

import {
  SanctuaryVeinTier,
  SocketedFormationData,
  SanctuaryResonanceCombo,
  CustomSanctuaryState,
  SanctuaryVeinTierConfig,
  SanctuaryResonanceEffects
} from '@/lib/types/custom-sanctuary';
import { PlayerStats, FormationItem } from '@/lib/types';
import { MeditationLocationConfig } from '@/lib/types/meditation';

// ============================================================================
// 1. BẢNG CẤU HÌNH 9 BẬC LINH MẠCH (SANCTUARY VEIN CONFIG)
// ============================================================================
export const SANCTUARY_VEIN_CONFIG: Record<SanctuaryVeinTier, SanctuaryVeinTierConfig> = {
  1: {
    tier: 1,
    name: 'Nhất Phẩm Phàm Mạch',
    unlockedSockets: 1,
    requiredRealmIndex: 0,
    costLinhThach: 0,
    costForgingEssence: 0,
    tuviBaseMultiplier: 1.20,
    description: 'Linh mạch sơ khai phàm trần uẩn nhưỡng, linh khí mỏng manh nhưng đã thành hình.',
    icon: '🌱',
    colorClass: 'text-stone-400 border-stone-600'
  },
  2: {
    tier: 2,
    name: 'Nhị Phẩm Linh Mạch',
    unlockedSockets: 1,
    requiredRealmIndex: 5, // Luyện Khí Đỉnh Phong
    costLinhThach: 50_000,
    costForgingEssence: 50,
    tuviBaseMultiplier: 1.35,
    description: 'Linh tuyền róc rách chảy qua đạo trường, sương mù linh khí quanh năm không tan.',
    icon: '🌿',
    colorClass: 'text-emerald-400 border-emerald-600'
  },
  3: {
    tier: 3,
    name: 'Tam Phẩm Huyền Mạch',
    unlockedSockets: 2,
    requiredRealmIndex: 11, // Trúc Cơ Sơ Kỳ
    costLinhThach: 150_000,
    costForgingEssence: 150,
    tuviBaseMultiplier: 1.50,
    description: 'Huyền linh thông triệt địa biểu, mở thêm một đạo trận nhãn phụ trợ định trận.',
    icon: '💧',
    colorClass: 'text-cyan-400 border-cyan-600'
  },
  4: {
    tier: 4,
    name: 'Tứ Phẩm Địa Mạch',
    unlockedSockets: 2,
    requiredRealmIndex: 14, // Trúc Cơ Viên Mãn
    costLinhThach: 400_000,
    costForgingEssence: 300,
    tuviBaseMultiplier: 1.70,
    description: 'Địa long cuộn mình dưới lòng đất, thiên địa linh khí cô đọng thành từng giọt linh lộ.',
    icon: '⛰️',
    colorClass: 'text-amber-400 border-amber-600'
  },
  5: {
    tier: 5,
    name: 'Ngũ Phẩm Thiên Mạch',
    unlockedSockets: 3,
    requiredRealmIndex: 16, // Kim Đan Sơ Kỳ
    costLinhThach: 1_000_000,
    costForgingEssence: 600,
    tuviBaseMultiplier: 1.95,
    description: 'Thiên mạch quán thông, dẫn động tinh hoa nhật nguyệt, trận nhãn tam tài hình thành.',
    icon: '⚡',
    colorClass: 'text-indigo-400 border-indigo-600'
  },
  6: {
    tier: 6,
    name: 'Lục Phẩm Long Mạch',
    unlockedSockets: 3,
    requiredRealmIndex: 19, // Kim Đan Viên Mãn
    costLinhThach: 2_500_000,
    costForgingEssence: 1_200,
    tuviBaseMultiplier: 2.25,
    description: 'Long khí gầm thét cửu thiên, địa hình chuyển hóa thành phúc địa động thiên thượng thừa.',
    icon: '🐉',
    colorClass: 'text-purple-400 border-purple-600'
  },
  7: {
    tier: 7,
    name: 'Thất Phẩm Thánh Mạch',
    unlockedSockets: 4,
    requiredRealmIndex: 21, // Nguyên Anh Sơ Kỳ
    costLinhThach: 6_000_000,
    costForgingEssence: 2_500,
    tuviBaseMultiplier: 2.55,
    description: 'Thánh quang giáng thế, tứ tượng trận nhãn phong tỏa càn khôn, vạn tà bất xâm.',
    icon: '✨',
    colorClass: 'text-pink-400 border-pink-600'
  },
  8: {
    tier: 8,
    name: 'Bát Phẩm Thần Mạch',
    unlockedSockets: 4,
    requiredRealmIndex: 24, // Nguyên Anh Viên Mãn
    costLinhThach: 15_000_000,
    costForgingEssence: 5_000,
    tuviBaseMultiplier: 2.85,
    description: 'Thần mạch thông thiên triệt địa, linh vũ rền vang, uẩn nhưỡng thái sơ bảo quang.',
    icon: '🌟',
    colorClass: 'text-rose-400 border-rose-600'
  },
  9: {
    tier: 9,
    name: 'Cửu Phẩm Hỗn Độn Tiên Mạch',
    unlockedSockets: 5,
    requiredRealmIndex: 26, // Hóa Thần Sơ Kỳ
    costLinhThach: 40_000_000,
    costForgingEssence: 10_000,
    tuviBaseMultiplier: 3.20,
    description: 'Cực hạn linh mạch thế gian, đản sinh hỗn độn chi khí sơ khai, ngũ hành trận nhãn viên mãn tột cùng.',
    icon: '🌌',
    colorClass: 'text-amber-300 border-yellow-500 shadow-amber-500/50'
  }
};

// ============================================================================
// 2. DANH MỤC TỔ HỢP CỘNG HƯỞNG TRẬN ĐỒ (SANCTUARY RESONANCES REGISTRY)
// ============================================================================
export const SANCTUARY_RESONANCES_REGISTRY: SanctuaryResonanceCombo[] = [
  {
    id: 'luong_nghi_tu_linh',
    name: 'Lưỡng Nghi Tụ Linh',
    description: 'Hai đạo Trận Bàn Tụ Linh cùng trấn thủ trận nhãn tạo vòng xoáy linh khí tuần hoàn khép kín, gia tốc 35% tu vi bế quan.',
    requiredArrayTypes: ['tu_linh', 'tu_linh'],
    bonusEffects: {
      cultivationSpeedMultiplier: 1.35,
      offlineAbsorptionBonus: 0.25
    }
  },
  {
    id: 'thanh_tam_dinh_mach',
    name: 'Thanh Tâm Định Mạch',
    description: 'Tụ Linh Trận phối hợp cùng Thanh Tâm / Tỏa Ma Trận, vừa nạp khí vừa trừ uế tạp, tiêu trừ 2 Đan Độc và 2 Ma Tính mỗi giờ.',
    requiredArrayTypes: ['tu_linh', 'thanh_tam'],
    bonusEffects: {
      pillToxicityCleansePerHour: 2,
      demonicCleansePerHour: 2,
      breakthroughChanceBonus: 0.05
    }
  },
  {
    id: 'ngu_hanh_tuong_sinh',
    name: 'Ngũ Hành Tương Sinh',
    description: 'Tổ hợp trận bàn quy tụ các hệ tương sinh (Mộc sinh Hỏa hoặc Kim sinh Thủy), kích phát sinh cơ địa mạch, tăng 30% sản lượng Dược Viên và Linh Điền.',
    requiredArrayTypes: ['element_synergy'],
    bonusEffects: {
      gardenYieldBonus: 0.30
    }
  },
  {
    id: 'thai_so_hon_don_vuc',
    name: 'Thái Sơ Hỗn Độn Vực',
    description: 'Khảm nạp Trận Bàn Cửu Giai Bất Hủ cùng Trận Thần Cấp, diễn hóa tiểu thế giới sơ khai, tăng 50% Tu Vi và 10% tỷ lệ đột phá.',
    requiredArrayTypes: ['permanent_array', 'divine_tier'],
    bonusEffects: {
      cultivationSpeedMultiplier: 1.50,
      breakthroughChanceBonus: 0.10,
      offlineAbsorptionBonus: 0.35
    }
  },
  {
    id: 'kim_cuong_ho_son',
    name: 'Kim Cương Hộ Sơn',
    description: 'Song đại trận phòng hộ trấn áp linh mạch vững như bàn thạch, giảm 50% nguy cơ đứt đoạn hoặc biến cố hiểm họa khi nhập định.',
    requiredArrayTypes: ['defense', 'defense'],
    bonusEffects: {
      hazardRiskReduction: 0.50
    }
  }
];

// ============================================================================
// 3. KHỞI TẠO STATE MẶC ĐỊNH (DEFAULT STATE FACTORY)
// ============================================================================
export function createDefaultCustomSanctuaryState(): CustomSanctuaryState {
  return {
    veinTier: 1,
    veinExp: 0,
    unlockedSockets: 1,
    socketedArrays: [],
    activeResonances: [],
    customLocationName: ''
  };
}

// ============================================================================
// 4. THUẬT TOÁN THẨM ĐỊNH CỘNG HƯỞNG (RESONANCE EVALUATOR)
// ============================================================================
export function checkSanctuaryResonances(
  socketedArrays: SocketedFormationData[]
): SanctuaryResonanceCombo[] {
  if (!Array.isArray(socketedArrays) || socketedArrays.length === 0) {
    return [];
  }

  const activeCombos: SanctuaryResonanceCombo[] = [];

  // Helper check keywords
  const isTuLinh = (a: SocketedFormationData) =>
    a.arrayName.toLowerCase().includes('tụ linh') ||
    a.arrayName.toLowerCase().includes('tụ khí');

  const isThanhTam = (a: SocketedFormationData) =>
    a.arrayName.toLowerCase().includes('thanh tâm') ||
    a.arrayName.toLowerCase().includes('tỏa ma') ||
    a.arrayName.toLowerCase().includes('hộ thần') ||
    a.arrayName.toLowerCase().includes('an thần') ||
    a.arrayName.toLowerCase().includes('tịnh hóa');

  const isDefense = (a: SocketedFormationData) =>
    a.arrayName.toLowerCase().includes('hộ') ||
    a.arrayName.toLowerCase().includes('kim cương') ||
    a.arrayName.toLowerCase().includes('thủ') ||
    a.arrayName.toLowerCase().includes('bàn thạch') ||
    a.arrayName.toLowerCase().includes('hộ sơn');

  const isPermanentOrImmortality = (a: SocketedFormationData) =>
    Boolean(a.isPermanent || a.arrayTier >= 9 || a.arrayName.toLowerCase().includes('bất hủ'));

  const isDivineOrChaos = (a: SocketedFormationData) =>
    a.arrayTier >= 9 ||
    a.arrayName.toLowerCase().includes('thần') ||
    a.arrayName.toLowerCase().includes('thái sơ') ||
    a.arrayName.toLowerCase().includes('hỗn độn');

  // Elements set
  const elements = socketedArrays
    .map(a => (a.element || '').toLowerCase())
    .filter(Boolean);

  // 1. Lưỡng Nghi Tụ Linh: Có ít nhất 2 trận Tụ Linh
  const tuLinhCount = socketedArrays.filter(isTuLinh).length;
  if (tuLinhCount >= 2) {
    const combo = SANCTUARY_RESONANCES_REGISTRY.find(r => r.id === 'luong_nghi_tu_linh');
    if (combo) activeCombos.push(combo);
  }

  // 2. Thanh Tâm Định Mạch: Có ít nhất 1 Tụ Linh và 1 Thanh Tâm/Tỏa Ma
  const thanhTamCount = socketedArrays.filter(isThanhTam).length;
  if (tuLinhCount >= 1 && thanhTamCount >= 1) {
    const combo = SANCTUARY_RESONANCES_REGISTRY.find(r => r.id === 'thanh_tam_dinh_mach');
    if (combo) activeCombos.push(combo);
  }

  // 3. Ngũ Hành Tương Sinh: Mộc + Hỏa, Kim + Thủy, Thủy + Mộc, Hỏa + Thổ, Thổ + Kim
  const hasMocHoa = (elements.includes('moc') || elements.includes('mộc')) &&
                    (elements.includes('hoa') || elements.includes('hỏa'));
  const hasKimThuy = (elements.includes('kim')) &&
                     (elements.includes('thuy') || elements.includes('thủy'));
  const hasThuyMoc = (elements.includes('thuy') || elements.includes('thủy')) &&
                     (elements.includes('moc') || elements.includes('mộc'));
  const hasHoaTho = (elements.includes('hoa') || elements.includes('hỏa')) &&
                    (elements.includes('tho') || elements.includes('thổ'));
  const hasThoKim = (elements.includes('tho') || elements.includes('thổ')) &&
                    (elements.includes('kim'));

  if (hasMocHoa || hasKimThuy || hasThuyMoc || hasHoaTho || hasThoKim) {
    const combo = SANCTUARY_RESONANCES_REGISTRY.find(r => r.id === 'ngu_hanh_tuong_sinh');
    if (combo) activeCombos.push(combo);
  }

  // 4. Thái Sơ Hỗn Độn Vực: Ít nhất 1 Bất Hủ/Cửu Giai + 1 Thần Cấp/Hỗn Độn (hoặc 1 trận đạt cả 2 và tổng >= 2 trận)
  const permanentArrays = socketedArrays.filter(isPermanentOrImmortality);
  const divineArrays = socketedArrays.filter(isDivineOrChaos);

  if (socketedArrays.length >= 2 && permanentArrays.length >= 1 && divineArrays.length >= 1) {
    const combo = SANCTUARY_RESONANCES_REGISTRY.find(r => r.id === 'thai_so_hon_don_vuc');
    if (combo) activeCombos.push(combo);
  }

  // 5. Kim Cương Hộ Sơn: Có ít nhất 2 trận Hộ Thể / Kim Cương
  const defenseCount = socketedArrays.filter(isDefense).length;
  if (defenseCount >= 2) {
    const combo = SANCTUARY_RESONANCES_REGISTRY.find(r => r.id === 'kim_cuong_ho_son');
    if (combo) activeCombos.push(combo);
  }

  return activeCombos;
}

// ============================================================================
// 5. TỔNG HỢP TOÀN BỘ BUFF TỪ LINH MẠCH & TRẬN BÀN
// ============================================================================
export function getCustomSanctuaryBuffTotals(
  state?: CustomSanctuaryState
): SanctuaryResonanceEffects & { totalTuviMultiplier: number } {
  if (!state) {
    return { totalTuviMultiplier: 1.0 };
  }

  const veinConfig = SANCTUARY_VEIN_CONFIG[state.veinTier] || SANCTUARY_VEIN_CONFIG[1];
  let baseMult = veinConfig.tuviBaseMultiplier;

  // Hiệu suất từ các trận bàn đang khảm: mỗi bậc tier trận bàn đóng góp thêm 0.05
  if (Array.isArray(state.socketedArrays)) {
    for (const arr of state.socketedArrays) {
      baseMult += (arr.arrayTier || 1) * 0.04;
      if (arr.isPermanent) {
        baseMult += 0.15;
      }
    }
  }

  // Tổng hợp hiệu ứng từ các Resonance Combos
  const activeCombos = checkSanctuaryResonances(state.socketedArrays || []);
  let speedMultiplierAdd = 0;
  let offlineAbsorptionTotal = 0;
  let pillToxicityCleanse = 0;
  let demonicCleanse = 0;
  let gardenYield = 0;
  let breakthroughBonus = 0;
  let hazardReduction = 0;

  for (const combo of activeCombos) {
    const eff = combo.bonusEffects;
    if (eff.cultivationSpeedMultiplier) {
      speedMultiplierAdd += (eff.cultivationSpeedMultiplier - 1);
    }
    if (eff.offlineAbsorptionBonus) {
      offlineAbsorptionTotal += eff.offlineAbsorptionBonus;
    }
    if (eff.pillToxicityCleansePerHour) {
      pillToxicityCleanse += eff.pillToxicityCleansePerHour;
    }
    if (eff.demonicCleansePerHour) {
      demonicCleanse += eff.demonicCleansePerHour;
    }
    if (eff.gardenYieldBonus) {
      gardenYield += eff.gardenYieldBonus;
    }
    if (eff.breakthroughChanceBonus) {
      breakthroughBonus += eff.breakthroughChanceBonus;
    }
    if (eff.hazardRiskReduction) {
      hazardReduction += eff.hazardRiskReduction;
    }
  }

  const finalTuviMult = Number((baseMult + speedMultiplierAdd).toFixed(2));

  return {
    cultivationSpeedMultiplier: Number((1 + speedMultiplierAdd).toFixed(2)),
    offlineAbsorptionBonus: offlineAbsorptionTotal,
    pillToxicityCleansePerHour: pillToxicityCleanse,
    demonicCleansePerHour: demonicCleanse,
    gardenYieldBonus: gardenYield,
    breakthroughChanceBonus: breakthroughBonus,
    hazardRiskReduction: Math.min(1.0, hazardReduction),
    totalTuviMultiplier: finalTuviMult
  };
}

// ============================================================================
// 6. THẨM ĐỊNH & THĂNG PHẨM LINH MẠCH (VEIN PROGRESSION)
// ============================================================================
export function canUpgradeSanctuaryVein(player: PlayerStats): {
  canUpgrade: boolean;
  reason?: string;
  nextTier?: SanctuaryVeinTier;
  costLinhThach?: number;
  costForgingEssence?: number;
} {
  const currentTier = player.customSanctuary?.veinTier || 1;
  if (currentTier >= 9) {
    return {
      canUpgrade: false,
      reason: 'Linh Mạch Động Phủ đã đạt cảnh giới tối cao: Cửu Phẩm Hỗn Độn Tiên Mạch!'
    };
  }

  const nextTier = (currentTier + 1) as SanctuaryVeinTier;
  const nextConfig = SANCTUARY_VEIN_CONFIG[nextTier];

  const currentRealmIndex = player.currentRealm || 0;
  if (currentRealmIndex < nextConfig.requiredRealmIndex) {
    return {
      canUpgrade: false,
      reason: `Cảnh giới chưa đủ để đả thông 【${nextConfig.name}】! Yêu cầu mốc cảnh giới index ${nextConfig.requiredRealmIndex}.`,
      nextTier,
      costLinhThach: nextConfig.costLinhThach,
      costForgingEssence: nextConfig.costForgingEssence
    };
  }

  const ownedLinhThach = player.linhThach || 0;
  if (ownedLinhThach < nextConfig.costLinhThach) {
    return {
      canUpgrade: false,
      reason: `Không đủ Linh Thạch! Cần ${nextConfig.costLinhThach.toLocaleString()} Linh Thạch (Hiện có: ${ownedLinhThach.toLocaleString()}).`,
      nextTier,
      costLinhThach: nextConfig.costLinhThach,
      costForgingEssence: nextConfig.costForgingEssence
    };
  }

  const ownedEssence = player.inventory?.forgingEssence || 0;
  if (ownedEssence < nextConfig.costForgingEssence) {
    return {
      canUpgrade: false,
      reason: `Không đủ Tinh Hoa Rèn Đúc! Cần ${nextConfig.costForgingEssence} Tinh Hoa (Hiện có: ${ownedEssence}).`,
      nextTier,
      costLinhThach: nextConfig.costLinhThach,
      costForgingEssence: nextConfig.costForgingEssence
    };
  }

  return {
    canUpgrade: true,
    nextTier,
    costLinhThach: nextConfig.costLinhThach,
    costForgingEssence: nextConfig.costForgingEssence
  };
}

export function upgradeSanctuaryVein(player: PlayerStats): {
  success: boolean;
  message: string;
  updatedPlayer: PlayerStats;
} {
  const check = canUpgradeSanctuaryVein(player);
  if (!check.canUpgrade || !check.nextTier || check.costLinhThach === undefined || check.costForgingEssence === undefined) {
    return {
      success: false,
      message: check.reason || 'Không đủ điều kiện thăng phẩm Linh Mạch!',
      updatedPlayer: player
    };
  }

  const nextTier = check.nextTier;
  const nextConfig = SANCTUARY_VEIN_CONFIG[nextTier];

  const currentSanctuary = player.customSanctuary || createDefaultCustomSanctuaryState();
  const nextUnlockedSockets = Math.max(currentSanctuary.unlockedSockets, nextConfig.unlockedSockets);

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: Math.max(0, (player.linhThach || 0) - check.costLinhThach),
    inventory: player.inventory
      ? {
          ...player.inventory,
          forgingEssence: Math.max(0, (player.inventory.forgingEssence || 0) - check.costForgingEssence)
        }
      : player.inventory,
    customSanctuary: {
      ...currentSanctuary,
      veinTier: nextTier,
      unlockedSockets: nextUnlockedSockets,
      activeResonances: checkSanctuaryResonances(currentSanctuary.socketedArrays)
    }
  };

  return {
    success: true,
    message: `Đả thông thành công 【${nextConfig.name}】! Trận nhãn mở rộng lên ${nextUnlockedSockets} vị trí, nồng độ linh khí tăng vọt!`,
    updatedPlayer
  };
}

// ============================================================================
// 7. KHẢM NẠP & GỠ BỎ TRẬN BÀN (SOCKET & UNSOCKET GUARDS)
// ============================================================================
export function canSocketArray(
  player: PlayerStats,
  socketIndex: number,
  arrayItemId: string
): { canSocket: boolean; reason?: string } {
  const sanctuary = player.customSanctuary || createDefaultCustomSanctuaryState();

  if (socketIndex < 0 || socketIndex >= sanctuary.unlockedSockets) {
    return {
      canSocket: false,
      reason: `Trận nhãn vị trí ${socketIndex + 1} chưa được mở khóa! Cần thăng phẩm Linh Mạch.`
    };
  }

  const formations: FormationItem[] = player.inventory?.formations || [];
  const targetArray = formations.find((f: FormationItem) => f.id === arrayItemId);
  if (!targetArray) {
    return {
      canSocket: false,
      reason: 'Trận bàn không tồn tại trong túi đồ!'
    };
  }

  // Hard Invariant 3: Chống khảm trùng lặp cùng 1 instance Trận Bàn vào nhiều slot
  const isAlreadySocketedElsewhere = sanctuary.socketedArrays.some(
    s => s.arrayItemId === arrayItemId && s.socketIndex !== socketIndex
  );
  if (isAlreadySocketedElsewhere || targetArray.isSocketedInSanctuary) {
    const isReplacingSameSlot = sanctuary.socketedArrays.some(
      s => s.arrayItemId === arrayItemId && s.socketIndex === socketIndex
    );
    if (!isReplacingSameSlot) {
      return {
        canSocket: false,
        reason: `Trận bàn 【${targetArray.name}】 đã được khảm vào một Trận Nhãn khác! Không thể nhân bản.`
      };
    }
  }

  return { canSocket: true };
}

export function socketArrayIntoSanctuary(
  player: PlayerStats,
  socketIndex: number,
  arrayItemId: string
): { success: boolean; message: string; updatedPlayer: PlayerStats } {
  const check = canSocketArray(player, socketIndex, arrayItemId);
  if (!check.canSocket) {
    return {
      success: false,
      message: check.reason || 'Không thể khảm nạp Trận Bàn!',
      updatedPlayer: player
    };
  }

  const sanctuary = player.customSanctuary || createDefaultCustomSanctuaryState();
  const formations: FormationItem[] = player.inventory?.formations || [];
  const targetArray = formations.find((f: FormationItem) => f.id === arrayItemId)!;

  // 1. Nếu slot này đang có trận bàn khác, gỡ cờ khóa của trận bàn cũ trước
  const existingSocketed = sanctuary.socketedArrays.find(s => s.socketIndex === socketIndex);
  let updatedFormations = formations.map((f: FormationItem) => {
    if (existingSocketed && f.id === existingSocketed.arrayItemId) {
      return { ...f, isSocketedInSanctuary: false };
    }
    if (f.id === arrayItemId) {
      return { ...f, isSocketedInSanctuary: true };
    }
    return f;
  });

  // 2. Dữ liệu trận bàn mới được khảm
  const newSocketData: SocketedFormationData = {
    socketIndex,
    arrayItemId: targetArray.id,
    arrayName: targetArray.name,
    arrayTier: targetArray.tier || 1,
    element: targetArray.element || 'hon_don',
    isPermanent: Boolean(targetArray.isPermanent),
    baseEfficiencyBonus: targetArray.offlineAbsorptionBonus || 0.1,
    socketedAt: Date.now()
  };

  // 3. Cập nhật danh sách socketedArrays
  const updatedSocketedList = sanctuary.socketedArrays.filter(s => s.socketIndex !== socketIndex);
  updatedSocketedList.push(newSocketData);
  updatedSocketedList.sort((a, b) => a.socketIndex - b.socketIndex);

  // 4. Tự động tính toán lại toàn bộ Resonances tức thì (Zero-latency recalculation)
  const activeResonances = checkSanctuaryResonances(updatedSocketedList);

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: player.inventory
      ? { ...player.inventory, formations: updatedFormations }
      : player.inventory,
    customSanctuary: {
      ...sanctuary,
      socketedArrays: updatedSocketedList,
      activeResonances
    }
  };

  return {
    success: true,
    message: `Khảm nạp thành công 【${targetArray.name}】 vào Trận Nhãn ${socketIndex + 1}!`,
    updatedPlayer
  };
}

export function canUnsocketArray(
  player: PlayerStats,
  socketIndex: number
): { canUnsocket: boolean; reason?: string } {
  const sanctuary = player.customSanctuary;
  if (!sanctuary) {
    return { canUnsocket: false, reason: 'Chưa khởi tạo Linh Mạch!' };
  }

  const occupied = sanctuary.socketedArrays.find(s => s.socketIndex === socketIndex);
  if (!occupied) {
    return { canUnsocket: false, reason: 'Trận nhãn này hiện đang trống!' };
  }

  return { canUnsocket: true };
}

export function unsocketArrayFromSanctuary(
  player: PlayerStats,
  socketIndex: number
): { success: boolean; message: string; updatedPlayer: PlayerStats } {
  const check = canUnsocketArray(player, socketIndex);
  if (!check.canUnsocket) {
    return {
      success: false,
      message: check.reason || 'Không thể tháo gỡ Trận Bàn!',
      updatedPlayer: player
    };
  }

  const sanctuary = player.customSanctuary!;
  const targetSocketed = sanctuary.socketedArrays.find(s => s.socketIndex === socketIndex)!;

  // 1. Giải phóng cờ khóa an toàn 100% trong túi đồ
  const formations: FormationItem[] = player.inventory?.formations || [];
  const updatedFormations = formations.map((f: FormationItem) => {
    if (f.id === targetSocketed.arrayItemId) {
      return { ...f, isSocketedInSanctuary: false };
    }
    return f;
  });

  // 2. Xóa khỏi danh sách socketedArrays
  const updatedSocketedList = sanctuary.socketedArrays.filter(s => s.socketIndex !== socketIndex);

  // 3. Tự động tính toán lại toàn bộ Resonances
  const activeResonances = checkSanctuaryResonances(updatedSocketedList);

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: player.inventory
      ? { ...player.inventory, formations: updatedFormations }
      : player.inventory,
    customSanctuary: {
      ...sanctuary,
      socketedArrays: updatedSocketedList,
      activeResonances
    }
  };

  return {
    success: true,
    message: `Đã tháo gỡ 【${targetSocketed.arrayName}】 khỏi Trận Nhãn ${socketIndex + 1}! Trận bàn đã hoàn trả về trạng thái tự do.`,
    updatedPlayer
  };
}

// ============================================================================
// 8. ĐẶT TÊN LINH ĐỊA ĐỘC QUYỀN (CUSTOM SANCTUARY NAMING)
// ============================================================================
export function renameCustomSanctuary(
  player: PlayerStats,
  newName: string
): { success: boolean; message: string; updatedPlayer: PlayerStats } {
  const trimmed = newName.trim();
  if (trimmed.length < 2 || trimmed.length > 25) {
    return {
      success: false,
      message: 'Tên Linh Địa phải từ 2 đến 25 ký tự!',
      updatedPlayer: player
    };
  }

  const sanctuary = player.customSanctuary || createDefaultCustomSanctuaryState();
  const updatedPlayer: PlayerStats = {
    ...player,
    customSanctuary: {
      ...sanctuary,
      customLocationName: trimmed
    }
  };

  return {
    success: true,
    message: `Đã đổi danh xưng Linh Địa Độc Quyền thành 【${trimmed}】!`,
    updatedPlayer
  };
}

// ============================================================================
// 9. SINH DỮ LIỆU LINH ĐỊA ĐỘC QUYỀN CHO THIÊN ĐỊA NHẬP ĐỊNH
// ============================================================================
export const CUSTOM_SANCTUARY_LOCATION_ID = 'custom_sanctuary_location';

export function generateCustomSanctuaryLocation(player: PlayerStats): MeditationLocationConfig {
  const sanctuary = player.customSanctuary || createDefaultCustomSanctuaryState();
  const buffs = getCustomSanctuaryBuffTotals(sanctuary);
  const veinConfig = SANCTUARY_VEIN_CONFIG[sanctuary.veinTier] || SANCTUARY_VEIN_CONFIG[1];

  const defaultName = `${player.name || 'Đạo Hữu'} • Tiên Phủ Động Thiên`;
  const locationName = sanctuary.customLocationName?.trim() || defaultName;

  // Xác định nguyên tố chủ đạo
  let element = 'Hỗn Độn';
  if (sanctuary.socketedArrays && sanctuary.socketedArrays.length > 0) {
    const elemCounts: Record<string, number> = {};
    for (const arr of sanctuary.socketedArrays) {
      const el = arr.element || 'hon_don';
      elemCounts[el] = (elemCounts[el] || 0) + 1;
    }
    let topElem = 'hon_don';
    let topCount = 0;
    for (const [k, v] of Object.entries(elemCounts)) {
      if (v > topCount) {
        topCount = v;
        topElem = k;
      }
    }
    const elemMap: Record<string, string> = {
      kim: 'Kim',
      moc: 'Mộc',
      thuy: 'Thủy',
      hoa: 'Hỏa',
      tho: 'Thổ',
      hon_don: 'Hỗn Độn',
      loi: 'Lôi',
      phong: 'Phong'
    };
    element = elemMap[topElem] || 'Hỗn Độn';
  }

  // Multiplier dao động từ 1.5 đến 3.5 tùy theo cấp bậc và trận bàn
  const tuviMult = Math.min(3.5, Math.max(1.5, buffs.totalTuviMultiplier));

  let specialTrait = `Linh mạch ${veinConfig.name}, mở khóa ${sanctuary.unlockedSockets} Trận Nhãn.`;
  if (sanctuary.activeResonances.length > 0) {
    specialTrait += ` Đang kích hoạt ${sanctuary.activeResonances.length} dị tượng cộng hưởng.`;
  }

  return {
    id: CUSTOM_SANCTUARY_LOCATION_ID,
    name: locationName,
    description: `Động phủ linh địa độc quyền được bồi dưỡng từ 【${veinConfig.name}】, quy tụ ${sanctuary.socketedArrays.length} đạo trận bàn uy trấn thiên hạ.`,
    requiredRealmIndex: 0, // Động phủ của chính mình, luôn tự do vào
    element,
    tuviMultiplier: tuviMult,
    dropTableId: 'drop_custom_sanctuary',
    possibleEventTypes: ['herb', 'ore', 'ancient_tome', 'chaos_essence', 'sanctuary_spirit'],
    icon: '🏛️',
    bgGradient: 'from-emerald-950/50 via-teal-950/60 to-black',
    specialTrait
  };
}
