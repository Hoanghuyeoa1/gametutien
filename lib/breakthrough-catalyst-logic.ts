// lib/breakthrough-catalyst-logic.ts
// Pure Business Logic & Domain Engine cho phân hệ:
// "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch (Breakthrough Catalysts & Protective Talismans)"
// 100% Strict TypeScript, Pure Functions, Zero Side Effects, No Uncontrolled RNG in Previews

import {
  BreakthroughPillConfig,
  BreakthroughTalismanConfig,
  BreakthroughRateCalculation,
  BreakthroughExecutionResult
} from './types/breakthrough-catalyst';

// ============================================================================
// 1. REGISTRY: CẤU HÌNH ĐAN DƯỢC VÀ PHÙ CHÚ / TRẬN BÀN CHUẨN
// ============================================================================

export const BREAKTHROUGH_PILLS_CONFIG: Record<string, BreakthroughPillConfig> = {
  item_boi_nguyen_dan: {
    itemId: 'item_boi_nguyen_dan',
    name: 'Bồi Nguyên Đan',
    targetRealmIndex: 1, // Luyện Khí Kỳ
    baseSuccessRateBonus: 0.20, // +20%
    backlashReductionPercent: 20,
    description: 'Đan dược cơ bản củng cố nguyên khí, gia tăng 20% tỷ lệ đột phá cho tu sĩ Luyện Khí Kỳ.'
  },
  item_truc_co_dan: {
    itemId: 'item_truc_co_dan',
    name: 'Trúc Cơ Đan',
    targetRealmIndex: 11, // Trúc Cơ Kỳ
    baseSuccessRateBonus: 0.30, // +30%
    backlashReductionPercent: 30,
    description: 'Thánh phẩm đan dược hộ mạch định thần, gia tăng 30% xác suất Trúc Cơ thành công.'
  },
  item_kim_dan_hoan: {
    itemId: 'item_kim_dan_hoan',
    name: 'Kim Đan Hoàn',
    targetRealmIndex: 16, // Kim Đan Kỳ
    baseSuccessRateBonus: 0.25, // +25%
    backlashReductionPercent: 25,
    description: 'Ngưng kết cửu chuyển kim đan, gia tăng 25% tỷ lệ kết đan.'
  },
  item_hoa_anh_dan: {
    itemId: 'item_hoa_anh_dan',
    name: 'Hóa Anh Đan',
    targetRealmIndex: 21, // Nguyên Anh Kỳ
    baseSuccessRateBonus: 0.30, // +30%
    backlashReductionPercent: 30,
    description: 'Hỗ trợ phá toái kim đan, hóa sinh Nguyên Anh, gia tăng 30% tỷ lệ đột phá.'
  },
  item_hoa_than_dan: {
    itemId: 'item_hoa_than_dan',
    name: 'Hóa Thần Đan',
    targetRealmIndex: 26, // Hóa Thần Kỳ
    baseSuccessRateBonus: 0.35, // +35%
    backlashReductionPercent: 40,
    description: 'Khai mở thần thức hóa thần, gia tăng 35% xác suất đột phá Hóa Thần Kỳ.'
  }
};

export const BREAKTHROUGH_TALISMANS_CONFIG: Record<string, BreakthroughTalismanConfig> = {
  item_tu_linh_tran_ban: {
    itemId: 'item_tu_linh_tran_ban',
    name: 'Tụ Linh Trận Bàn',
    effectType: 'reduce_spirit_stones',
    powerValue: 0.40, // Giảm 40% linh thạch
    description: 'Trận bàn tụ khí thượng cổ, giảm 40% chi phí Linh Thạch cần tiêu hao khi đột phá.'
  },
  item_ho_mach_phu: {
    itemId: 'item_ho_mach_phu',
    name: 'Hộ Mạch Phù',
    effectType: 'prevent_backlash',
    powerValue: 1.0, // Chặn 100% phản phệ
    description: 'Phù chú bảo hộ tâm mạch và khí hải, chặn 100% mất máu và tu vi khi đột phá thất bại.'
  },
  item_dinh_tam_phu: {
    itemId: 'item_dinh_tam_phu',
    name: 'Định Tâm Phù',
    effectType: 'cleanse_inner_demon',
    powerValue: 1.0, // Triệt tiêu toàn bộ phạt đan độc
    description: 'Phù lục an định thần hồn, triệt tiêu toàn bộ phạt tỷ lệ thành công do Đan Độc gây ra.'
  }
};

export const BREAKTHROUGH_CATALYSTS_REGISTRY = {
  pills: BREAKTHROUGH_PILLS_CONFIG,
  talismans: BREAKTHROUGH_TALISMANS_CONFIG,
  ...BREAKTHROUGH_PILLS_CONFIG,
  ...BREAKTHROUGH_TALISMANS_CONFIG
};

// ============================================================================
// 2. HELPER FUNCTIONS: TRÍCH XUẤT THUỘC TÍNH VẬT PHẨM
// ============================================================================

export function getBreakthroughPillConfig(itemId?: string | null): BreakthroughPillConfig | null {
  if (!itemId) return null;
  return BREAKTHROUGH_PILLS_CONFIG[itemId] || null;
}

export function getBreakthroughTalismanConfig(itemId?: string | null): BreakthroughTalismanConfig | null {
  if (!itemId) return null;
  return BREAKTHROUGH_TALISMANS_CONFIG[itemId] || null;
}

export function isNineVeinedPill(pill?: any | null): boolean {
  if (!pill) return false;
  return pill.veinMetadata?.veinCount === 9 || pill.veinCount === 9;
}

// ============================================================================
// 3. PURE FUNCTION: TÍNH TOÁN TỶ LỆ & CHI PHÍ ĐỘT PHÁ (PREVIEW / KHÔNG RNG)
// ============================================================================

export interface CalculateBreakthroughChancesParams {
  baseRate: number; // 0.0 -> 1.0 (hoặc 0 -> 100, tự động chuẩn hóa)
  baseSpiritStones: number;
  playerToxicity: number;
  selectedPill?: any | null;
  selectedTalisman?: any | null;
}

/**
 * Tính toán tỷ lệ đột phá và chi phí linh thạch với đầy đủ hiệu ứng của Đan Dược & Phù Chú.
 * Tuyệt đối là Pure Function, không gọi Math.random(), bảo toàn dữ liệu đầu vào.
 */
export function calculateBreakthroughChances(
  params: CalculateBreakthroughChancesParams
): BreakthroughRateCalculation {
  // 1. Chuẩn hóa tỷ lệ cơ bản (0.0 -> 1.0)
  const rawBaseRate = typeof params.baseRate === 'number' ? params.baseRate : 0.5;
  const baseRate = Number((rawBaseRate > 1 ? rawBaseRate / 100 : Math.max(0, rawBaseRate)).toFixed(4));
  const baseSpiritStones = Math.max(0, Math.floor(params.baseSpiritStones || 0));
  const playerToxicity = Math.max(0, Math.min(100, Math.floor(params.playerToxicity || 0)));

  // 2. Phân giải Phù Chú / Trận Bàn
  const talismanItemId =
    typeof params.selectedTalisman === 'string'
      ? params.selectedTalisman
      : params.selectedTalisman?.itemId || params.selectedTalisman?.id;
  const talismanConfig = talismanItemId ? BREAKTHROUGH_TALISMANS_CONFIG[talismanItemId] : null;
  const talisman =
    params.selectedTalisman && typeof params.selectedTalisman === 'object'
      ? { ...talismanConfig, ...params.selectedTalisman }
      : talismanConfig;

  // Hiệu ứng Phù Chú: Giảm Linh Thạch (item_tu_linh_tran_ban)
  let spiritStoneCost = baseSpiritStones;
  if (talisman && (talisman.effectType === 'reduce_spirit_stones' || talisman.itemId === 'item_tu_linh_tran_ban')) {
    const reductionFactor = typeof talisman.powerValue === 'number' ? talisman.powerValue : 0.40;
    spiritStoneCost = Math.round(baseSpiritStones * Math.max(0, 1 - reductionFactor));
  }

  // Hiệu ứng Phù Chú: Chặn phản phệ (item_ho_mach_phu)
  const isBacklashProtectedByTalisman = Boolean(
    talisman &&
      (talisman.effectType === 'prevent_backlash' || talisman.itemId === 'item_ho_mach_phu')
  );

  // Hiệu ứng Phù Chú: Triệt tiêu phạt đan độc (item_dinh_tam_phu)
  const isToxicityCleansedByTalisman = Boolean(
    talisman &&
      (talisman.effectType === 'cleanse_inner_demon' || talisman.itemId === 'item_dinh_tam_phu')
  );

  // 3. Phân giải Đan Dược
  const pillItemId =
    typeof params.selectedPill === 'string'
      ? params.selectedPill
      : params.selectedPill?.itemId || params.selectedPill?.id;
  const pillConfig = pillItemId ? BREAKTHROUGH_PILLS_CONFIG[pillItemId] : null;
  const pill =
    params.selectedPill && typeof params.selectedPill === 'object'
      ? { ...pillConfig, ...params.selectedPill }
      : pillConfig;

  const veinCount = pill?.veinMetadata?.veinCount ?? pill?.veinCount ?? 0;

  // 4. KIỂM TRA ĐẶC QUYỀN NINE-VEIN (ĐAN CỬU VĂN VIÊN MÃN)
  if (veinCount === 9) {
    return {
      baseRate,
      pillBonusRate: pill?.config?.baseSuccessRateBonus ?? pill?.baseSuccessRateBonus ?? pillConfig?.baseSuccessRateBonus ?? 0.30,
      nineVeinsBonusRate: 1.0,
      toxicityPenaltyRate: 0,
      finalRate: 1.0,
      spiritStoneCost,
      isGuaranteedSuccess: true,
      isBacklashProtected: true,
      backlashReductionPercent: 100
    };
  }

  // 5. TRƯỜNG HỢP ĐAN THƯỜNG / ĐAN VĂN DƯỚI 9 VĂN
  let pillBonusRate =
    pill?.config?.baseSuccessRateBonus ??
    pill?.baseSuccessRateBonus ??
    pillConfig?.baseSuccessRateBonus ??
    0;

  let backlashReductionPercent = pill?.backlashReductionPercent ?? pillConfig?.backlashReductionPercent ?? 0;

  // Nếu đan có 6-8 đan văn: Cộng thêm +15% bonus và giảm 50% phản phệ
  if (veinCount >= 6 && veinCount <= 8) {
    pillBonusRate += 0.15;
    backlashReductionPercent = Math.max(backlashReductionPercent, 50);
  }

  // Phạt đan độc:
  // Nếu có item_dinh_tam_phu -> toxicityPenaltyRate = 0
  // Ngược lại -> Phạt theo tỷ lệ đan độc hiện có: baseRate * (playerToxicity / 100)
  let toxicityPenaltyRate = 0;
  if (!isToxicityCleansedByTalisman && playerToxicity > 0) {
    toxicityPenaltyRate = Number((baseRate * (playerToxicity / 100)).toFixed(4));
  }

  // FinalRate = Math.max(0.05, Math.min(1.0, baseRate + pillBonusRate - toxicityPenaltyRate))
  const calculatedRate = baseRate + pillBonusRate - toxicityPenaltyRate;
  const finalRate = Number(Math.max(0.05, Math.min(1.0, calculatedRate)).toFixed(4));

  const isBacklashProtected = isBacklashProtectedByTalisman;

  return {
    baseRate,
    pillBonusRate: Number(pillBonusRate.toFixed(4)),
    nineVeinsBonusRate: 0,
    toxicityPenaltyRate: Number(toxicityPenaltyRate.toFixed(4)),
    finalRate,
    spiritStoneCost,
    isGuaranteedSuccess: false,
    isBacklashProtected,
    backlashReductionPercent
  };
}

// ============================================================================
// 4. PURE FUNCTION: GIẢI QUYẾT PHẢN PHỆ KHI ĐỘT PHÁ THẤT BẠI
// ============================================================================

export interface ResolveBacklashResult {
  hpLoss: number;
  tuviLoss: number;
  logMessage: string;
}

/**
 * Xử lý hình phạt khi đột phá thất bại:
 * - Nếu có bảo vệ (Hộ Mạch Phù hoặc Đan Cửu Văn): 0 HP, 0 Tu Vi.
 * - Nếu không có bảo vệ: Mất 35% HP hiện tại và 20% Tu Vi tích lũy hiện tại (có thể giảm trừ nếu có đan văn 6-8).
 */
export function resolveBreakthroughBacklash(
  playerCurrentHp: number,
  playerCurrentTuvi: number,
  isProtected: boolean,
  backlashReductionPercent: number = 0
): ResolveBacklashResult {
  if (isProtected) {
    return {
      hpLoss: 0,
      tuviLoss: 0,
      logMessage:
        '🛡️ Hộ Mạch Phù / Thần Đan hiển uy! Hộ trì đan điền và kinh mạch, triệt tiêu 100% phản phệ (0 Khí Huyết, 0 Tu Vi thất thoát).'
    };
  }

  const baseHpLoss = Math.floor(Math.max(0, playerCurrentHp) * 0.35);
  const baseTuviLoss = Math.floor(Math.max(0, playerCurrentTuvi) * 0.20);

  if (backlashReductionPercent > 0) {
    const factor = Math.max(0, 1 - Math.min(100, backlashReductionPercent) / 100);
    const hpLoss = Math.floor(baseHpLoss * factor);
    const tuviLoss = Math.floor(baseTuviLoss * factor);
    return {
      hpLoss,
      tuviLoss,
      logMessage: `⚠️ Đột phá thất bại! Dược tính đan dược giảm trừ ${backlashReductionPercent}% phản phệ, tổn thất ${hpLoss.toLocaleString()} Khí Huyết và ${tuviLoss.toLocaleString()} Tu Vi.`
    };
  }

  return {
    hpLoss: baseHpLoss,
    tuviLoss: baseTuviLoss,
    logMessage: `⚡ Đột phá thất bại! Thiên địa quy tắc phản phệ, kinh mạch rạn nứt tổn thất ${baseHpLoss.toLocaleString()} Khí Huyết (35%) và ${baseTuviLoss.toLocaleString()} Tu Vi (20%).`
  };
}

// ============================================================================
// 5. PURE FUNCTION: THỰC THI ĐỘT PHÁ CẢNH GIỚI VỚI VẬT PHẨM TRỢ LỰC
// ============================================================================

export interface ExecuteBreakthroughParams {
  previousRealm: string;
  newRealm: string;
  requiredTuVi: number;
  baseSpiritStones: number;
  baseRate: number;
  playerHp: number;
  playerTuvi: number;
  playerToxicity: number;
  selectedPill?: any | null;
  selectedTalisman?: any | null;
  roll?: number; // Tùy chọn truyền roll (0.0 -> 1.0) cho deterministic testing
}

/**
 * Thực thi mô phỏng một lần đột phá cảnh giới sử dụng đan dược và phù chú trợ lực
 */
export function executeBreakthroughWithCatalysts(
  params: ExecuteBreakthroughParams
): BreakthroughExecutionResult {
  const chances = calculateBreakthroughChances({
    baseRate: params.baseRate,
    baseSpiritStones: params.baseSpiritStones,
    playerToxicity: params.playerToxicity,
    selectedPill: params.selectedPill,
    selectedTalisman: params.selectedTalisman
  });

  const consumedPillName =
    params.selectedPill?.name ||
    BREAKTHROUGH_PILLS_CONFIG[params.selectedPill?.itemId || params.selectedPill?.id]?.name;
  const consumedTalismanName =
    params.selectedTalisman?.name ||
    BREAKTHROUGH_TALISMANS_CONFIG[params.selectedTalisman?.itemId || params.selectedTalisman?.id]?.name;

  const logMessages: string[] = [];

  if (consumedPillName) {
    if (chances.isGuaranteedSuccess) {
      logMessages.push(`🌟 Phục dụng 【${consumedPillName}】 Cửu Văn Viên Mãn: Càn khôn định đoạt, 100% phá cảnh thành công!`);
    } else {
      logMessages.push(`💊 Phục dụng 【${consumedPillName}】: Gia tăng +${Math.round(chances.pillBonusRate * 100)}% tỷ lệ phá cảnh.`);
    }
  }

  if (consumedTalismanName) {
    if (chances.isBacklashProtected) {
      logMessages.push(`🛡️ Khảm nạp 【${consumedTalismanName}】: Tuyệt đối phòng ngự kinh mạch, miễn nhiễm phản phệ.`);
    } else if (params.selectedTalisman?.effectType === 'reduce_spirit_stones' || params.selectedTalisman?.itemId === 'item_tu_linh_tran_ban') {
      logMessages.push(`🌀 Kích hoạt 【${consumedTalismanName}】: Tiết giảm 40% Linh Thạch đột phá.`);
    } else if (params.selectedTalisman?.effectType === 'cleanse_inner_demon' || params.selectedTalisman?.itemId === 'item_dinh_tam_phu') {
      logMessages.push(`🧘 Tế xuất 【${consumedTalismanName}】: Triệt tiêu toàn bộ phạt tỷ lệ do Đan Độc.`);
    }
  }

  // Quyết định thành công:
  // Nếu isGuaranteedSuccess -> 100% thành công
  // Ngược lại dùng roll được truyền vào hoặc sinh ngẫu nhiên
  const outcomeRoll = typeof params.roll === 'number' ? params.roll : Math.random();
  const isSuccess = chances.isGuaranteedSuccess || outcomeRoll < chances.finalRate;

  if (isSuccess) {
    logMessages.push(`🎉 Đột phá đại thành công! Từ 【${params.previousRealm}】 tấn thăng 【${params.newRealm}】!`);
    return {
      success: true,
      previousRealm: params.previousRealm,
      newRealm: params.newRealm,
      tuviConsumed: params.requiredTuVi,
      spiritStonesConsumed: chances.spiritStoneCost,
      consumedPillName,
      consumedTalismanName,
      isBacklashTriggered: false,
      backlashHpLoss: 0,
      backlashTuviLoss: 0,
      logMessages
    };
  }

  // Thất bại -> Xử lý phản phệ
  const backlash = resolveBreakthroughBacklash(
    params.playerHp,
    params.playerTuvi,
    chances.isBacklashProtected,
    chances.backlashReductionPercent
  );

  logMessages.push(backlash.logMessage);

  return {
    success: false,
    previousRealm: params.previousRealm,
    newRealm: params.previousRealm,
    tuviConsumed: Math.floor(params.requiredTuVi * 0.1), // Tiêu hao nhẹ tu vi cơ bản khi thử phá cảnh
    spiritStonesConsumed: chances.spiritStoneCost,
    consumedPillName,
    consumedTalismanName,
    isBacklashTriggered: !chances.isBacklashProtected,
    backlashHpLoss: backlash.hpLoss,
    backlashTuviLoss: backlash.tuviLoss,
    logMessages
  };
}
