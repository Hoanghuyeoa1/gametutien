// lib/breakthrough-backlash-logic.ts
// Pure Business Logic & Domain Engine cho phân hệ:
// "Tác Động Của Đan Độc & Tâm Ma Phản Phệ (Inner Demon & Pill Toxicity Backlash System)"
// 100% Strict TypeScript, Pure Functions, Zero Side Effects, No Uncontrolled RNG in Previews

import {
  PlayerInjuryState,
  ToxicityModifierResult,
  BacklashResolutionResult,
  BacklashType
} from './types/breakthrough-backlash';

// ============================================================================
// 1. FACTORY HELPER: KHỞI TẠO TRẠNG THÁI THƯƠNG THẾ BAN ĐẦU
// ============================================================================

export function createInitialPlayerInjuryState(): PlayerInjuryState {
  return {
    isInjured: false,
    injurySeverity: 0,
    hasDemonicBottleneck: false,
    bottleneckPenaltyPercent: 50,
    backlashHistory: []
  };
}

// ============================================================================
// 2. PURE FUNCTION: ĐÁNH GIÁ TÁC ĐỘNG CỦA ĐAN ĐỘC LÊN TỈ LỆ ĐỘT PHÁ
// ============================================================================

/**
 * Đánh giá điều chỉnh tỉ lệ đột phá dựa trên lượng đan độc tích tụ trong kinh mạch.
 * 
 * Quy tắc:
 * - toxicity < 10: +10% Tỉ lệ ('tinh_khiet')
 * - 10 <= toxicity <= 40: 0.00 ('binh_thuong')
 * - 41 <= toxicity <= 70: -20% Tỉ lệ ('tac_nghen')
 * - toxicity > 70: -40% Tỉ lệ ('tam_ma_nguy_hiem')
 */
export function evaluateToxicityBreakthroughModifier(toxicity: number): ToxicityModifierResult {
  const normToxicity = typeof toxicity === 'number' && !isNaN(toxicity) ? toxicity : 0;

  if (normToxicity < 10) {
    return {
      toxicity: normToxicity,
      rateModifier: 0.10,
      statusTag: 'tinh_khiet',
      warningMessage: 'Căn cơ ngọc khiết, đạo tâm thuần tịnh (+10% Tỉ lệ)'
    };
  }

  if (normToxicity <= 40) {
    return {
      toxicity: normToxicity,
      rateModifier: 0.00,
      statusTag: 'binh_thuong'
    };
  }

  if (normToxicity <= 70) {
    return {
      toxicity: normToxicity,
      rateModifier: -0.20,
      statusTag: 'tac_nghen',
      warningMessage: 'Kinh mạch tắc nghẽn do đan độc (-20% Tỉ lệ)'
    };
  }

  return {
    toxicity: normToxicity,
    rateModifier: -0.40,
    statusTag: 'tam_ma_nguy_hiem',
    warningMessage: 'Nguy cơ Tẩu Hỏa Nhập Ma cực đại (-40% Tỉ lệ)'
  };
}

// ============================================================================
// 3. PURE FUNCTION: TÍNH TOÁN TỈ LỆ ĐỘT PHÁ CUỐI CÙNG (FINAL RATE)
// ============================================================================

/**
 * Tính toán tỉ lệ đột phá sau khi tổng hợp:
 * - baseRate (tỉ lệ cơ sở của cảnh giới)
 * - rateModifier (tác động đan độc: +0.10, 0, -0.20, -0.40)
 * - catalystBonus (thưởng đan dược phá cảnh)
 * - hasBottleneck (hình phạt Bình Cảnh Tâm Ma: giảm 50% cơ hội)
 * 
 * Giới hạn an toàn: [0.05 (5%), 1.0 (100%)]
 */
export function calculateFinalBreakthroughRate(
  baseRate: number,
  toxicity: number,
  catalystBonus: number = 0,
  hasBottleneck: boolean = false
): { finalRate: number; toxicityMod: ToxicityModifierResult } {
  const rawBase = typeof baseRate === 'number' && !isNaN(baseRate) ? baseRate : 0.5;
  const normalizedBaseRate = rawBase > 1 ? rawBase / 100 : Math.max(0, rawBase);

  const rawBonus = typeof catalystBonus === 'number' && !isNaN(catalystBonus) ? catalystBonus : 0;
  const normalizedBonus = rawBonus > 1 ? rawBonus / 100 : rawBonus;

  const toxicityMod = evaluateToxicityBreakthroughModifier(toxicity);

  let rawRate = normalizedBaseRate + toxicityMod.rateModifier + normalizedBonus;

  if (hasBottleneck) {
    rawRate *= 0.5; // Giảm 50% cơ hội khi vướng phải Bình Cảnh Tâm Ma
  }

  // Chặn biên an toàn tuyệt đối từ 5% đến 100%
  const finalRate = Number(Math.max(0.05, Math.min(1.0, rawRate)).toFixed(4));

  return {
    finalRate,
    toxicityMod
  };
}

// ============================================================================
// 4. PURE FUNCTION: GIẢI QUYẾT PHẢN PHỆ KHI ĐỘT PHÁ THẤT BẠI
// ============================================================================

/**
 * Tính toán tổn thất Khí Huyết, Tu Vi và thương thế khi đột phá thất bại.
 * 
 * Quy tắc:
 * - toxicity <= 20: Phản phệ nhẹ ('nhe'), tuviLoss = 10%, hpLoss = 0
 * - 20 < toxicity <= 40: Tán khí ('tan_khi'), tuviLoss = 25%, hpLoss = 20%
 * - 40 < toxicity <= 70: Trọng thương ('trong_thuong'), tuviLoss = 35%, hpLoss = 50%, isInjuredApplied = true
 * - toxicity > 70: Tâm ma ('tam_ma'), tuviLoss = 35%, hpLoss = 50%, isInjuredApplied = true, isBottleneckApplied = true
 * 
 * HP Floor Guard: Luôn bảo đảm resultingHp >= 1, tuyệt đối không trừ máu về <= 0.
 */
export function resolveBreakthroughFailureBacklash(
  currentHp: number,
  currentTuvi: number,
  toxicity: number,
  targetRealmName: string
): BacklashResolutionResult {
  const normHp = Math.max(1, Math.floor(currentHp || 0));
  const normTuvi = Math.max(0, Math.floor(currentTuvi || 0));
  const normTox = Math.max(0, Math.floor(toxicity || 0));

  let backlashType: BacklashType = 'nhe';
  let tuviRatio = 0.10;
  let hpRatio = 0;
  let isInjuredApplied = false;
  let isBottleneckApplied = false;

  if (normTox <= 20) {
    backlashType = 'nhe';
    tuviRatio = 0.10;
    hpRatio = 0;
    isInjuredApplied = false;
    isBottleneckApplied = false;
  } else if (normTox <= 40) {
    backlashType = 'tan_khi';
    tuviRatio = 0.25;
    hpRatio = 0.20;
    isInjuredApplied = false;
    isBottleneckApplied = false;
  } else if (normTox <= 70) {
    backlashType = 'trong_thuong';
    tuviRatio = 0.35;
    hpRatio = 0.50;
    isInjuredApplied = true;
    isBottleneckApplied = false;
  } else {
    backlashType = 'tam_ma';
    tuviRatio = 0.35;
    hpRatio = 0.50;
    isInjuredApplied = true;
    isBottleneckApplied = true;
  }

  const tuviLoss = Math.round(normTuvi * tuviRatio);
  const potentialHpLoss = Math.round(normHp * hpRatio);

  // HP Floor Guard: Không bao giờ để máu rơi về <= 0
  const resultingHp = Math.max(1, normHp - potentialHpLoss);
  const hpLoss = normHp - resultingHp;

  let logMessage = '';
  switch (backlashType) {
    case 'nhe':
      logMessage = `[Đột Phá Thất Bại] Căn cơ vững vàng, đan độc thấp (${normTox}). Linh khí tán loạn nhẹ khi trùng kích [${targetRealmName}], tổn thất ${tuviLoss.toLocaleString()} Tu Vi.`;
      break;
    case 'tan_khi':
      logMessage = `[Đột Phá Thất Bại] Kinh mạch chấn động khi trùng kích [${targetRealmName}]! Đan độc (${normTox}) gây tán khí, tổn thất ${hpLoss.toLocaleString()} Khí Huyết và ${tuviLoss.toLocaleString()} Tu Vi.`;
      break;
    case 'trong_thuong':
      logMessage = `[Đột Phá Thất Bại] Đan độc tích tụ (${normTox}) bộc phát phản phệ! Thân thể thụ trọng thương khi phá cảnh [${targetRealmName}], tổn thất ${hpLoss.toLocaleString()} Khí Huyết và ${tuviLoss.toLocaleString()} Tu Vi!`;
      break;
    case 'tam_ma':
      logMessage = `[Đột Phá Thất Bại] TẨU HỎA NHẬP MA! Đan độc cực đại (${normTox}) kích động tâm ma bạo phát khi phá cảnh [${targetRealmName}]! Sinh ra Bình Cảnh Tâm Ma, tổn thất ${hpLoss.toLocaleString()} Khí Huyết và ${tuviLoss.toLocaleString()} Tu Vi!`;
      break;
  }

  return {
    backlashType,
    hpLoss,
    tuviLoss,
    resultingHp,
    isInjuredApplied,
    isBottleneckApplied,
    logMessage
  };
}

// ============================================================================
// 5. PURE FUNCTIONS: TRỊ THƯƠNG & GIẢI TÂM MA BÌNH CẢNH
// ============================================================================

/**
 * Trị thương: Phục hồi trạng thái cơ thể về khỏe mạnh (Pure Function, Zero Mutation)
 */
export function healPlayerInjury(injuryState?: PlayerInjuryState | null): PlayerInjuryState {
  const base = injuryState || createInitialPlayerInjuryState();
  return {
    ...base,
    isInjured: false,
    injurySeverity: 0,
    injuredAt: undefined
  };
}

/**
 * Tiêu trừ Bình Cảnh Tâm Ma: Xóa bỏ hình phạt giảm 50% tỉ lệ đột phá (Pure Function, Zero Mutation)
 */
export function dispelDemonicBottleneck(injuryState?: PlayerInjuryState | null): PlayerInjuryState {
  const base = injuryState || createInitialPlayerInjuryState();
  return {
    ...base,
    hasDemonicBottleneck: false,
    bottleneckPenaltyPercent: 0
  };
}

/**
 * Cập nhật trạng thái thương thế và ghi nhận lịch sử phản phệ một cách bất biến
 */
export function recordBacklashToInjuryState(
  currentState: PlayerInjuryState | undefined | null,
  resolution: BacklashResolutionResult,
  failedRealm: string,
  toxicity: number,
  timestamp: number = Date.now()
): PlayerInjuryState {
  const base = currentState || createInitialPlayerInjuryState();

  const newHistoryEntry = {
    timestamp,
    failedRealm,
    toxicityAtAttempt: toxicity,
    hpLost: resolution.hpLoss,
    tuviLost: resolution.tuviLoss,
    backlashType: resolution.backlashType
  };

  const newSeverity = resolution.backlashType === 'tam_ma' || resolution.backlashType === 'trong_thuong'
    ? 2
    : resolution.isInjuredApplied
    ? 1
    : base.injurySeverity;

  return {
    ...base,
    isInjured: resolution.isInjuredApplied ? true : base.isInjured,
    injurySeverity: resolution.isInjuredApplied ? newSeverity : base.injurySeverity,
    hasDemonicBottleneck: resolution.isBottleneckApplied ? true : base.hasDemonicBottleneck,
    bottleneckPenaltyPercent: resolution.isBottleneckApplied ? 50 : base.bottleneckPenaltyPercent,
    injuredAt: resolution.isInjuredApplied ? timestamp : base.injuredAt,
    backlashHistory: [newHistoryEntry, ...(base.backlashHistory || [])].slice(0, 30) // Giữ tối đa 30 bản ghi gần nhất
  };
}
