// lib/custom-recipe-logic.ts
// Pure Business Logic: Khai Sáng Đan Phương & Đan Đạo Tông Sư
// (Custom Recipe Innovation & Alchemy Mastery Pure Logic Engine)
// Tuân thủ Clean Architecture, Client-First, không phụ thuộc UI / React hooks.

import {
  HerbThermalProperty,
  HerbMedicinalProperty,
  ExperimentSlot,
  CustomDanRecipe,
  ExperimentEvaluationResult,
  CustomRecipeState
} from './types/custom-recipe';
import { PlayerStats, Herb } from './types';

// =========================================================================
// 1. BẢNG THUỘC TÍNH DƯỢC LÝ THẢO MỘC (HERB_MEDICINAL_PROPERTIES)
// =========================================================================

export const THERMAL_SCORE_MAP: Record<HerbThermalProperty, number> = {
  dai_han: -2,
  han: -1,
  binh: 0,
  nhiet: 1,
  dai_nhiet: 2
};

export const HERB_MEDICINAL_PROPERTIES: Record<string, HerbMedicinalProperty> = {
  // Thảo dược cốt lõi trong alchemy-data
  linh_thao: {
    id: 'linh_thao',
    name: 'Bách Thảo Sơ Thiên',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 25,
    toxicityValue: 5,
    element: 'Mộc',
    rarityTier: 1,
    description: 'Dược thảo cơ bản chứa linh khí đất trời thanh hòa, tính bình, bổ khí sơ khai.'
  },
  huyet_tinh_thao: {
    id: 'huyet_tinh_thao',
    name: 'Huyết Tinh Thảo',
    thermal: 'nhiet',
    thermalScore: 1,
    tonicValue: 45,
    toxicityValue: 10,
    element: 'Hỏa',
    rarityTier: 2,
    description: 'Hấp thụ huyết khí dồi dào, ôn nhiệt hoạt huyết, bồi bổ huyết nhục.'
  },
  tu_khi_hoa: {
    id: 'tu_khi_hoa',
    name: 'Tụ Khí Thanh Hoa',
    thermal: 'han',
    thermalScore: -1,
    tonicValue: 40,
    toxicityValue: 8,
    element: 'Thủy',
    rarityTier: 2,
    description: 'Cánh hoa lam thanh mát ngưng tụ chân khí, hàn lương thanh nhiệt.'
  },
  tay_tuy_linh_nhi: {
    id: 'tay_tuy_linh_nhi',
    name: 'Tẩy Tủy Linh Chi',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 60,
    toxicityValue: 12,
    element: 'Thổ',
    rarityTier: 3,
    description: 'Linh chi ngàn năm tôi luyện cốt tủy, tính bình đại bổ, tẩy trừ trọc khí.'
  },
  cuong_bao_hoa: {
    id: 'cuong_bao_hoa',
    name: 'Cuồng Bạo Ma Hoa',
    thermal: 'dai_nhiet',
    thermalScore: 2,
    tonicValue: 55,
    toxicityValue: 35,
    element: 'Hỏa',
    rarityTier: 3,
    description: 'Độc hỏa bạo liệt, đại nhiệt táo huyết, tiềm tàng đan độc mãnh liệt.'
  },
  truc_co_chi_lan: {
    id: 'truc_co_chi_lan',
    name: 'Trúc Cơ Chi Lan',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 75,
    toxicityValue: 10,
    element: 'Mộc',
    rarityTier: 4,
    description: 'Tiên thảo quý hiếm tính bình vững chãi, đắp xây đạo cơ vững vàng.'
  },
  hoa_than_linh_diep: {
    id: 'hoa_than_linh_diep',
    name: 'Hóa Thần Linh Diệp',
    thermal: 'dai_han',
    thermalScore: -2,
    tonicValue: 90,
    toxicityValue: 15,
    element: 'Thủy',
    rarityTier: 5,
    description: 'Lá thần mộc vạn năm ngưng kết cực hàn, u tịnh thần hồn.'
  },
  cuu_chuyen_ngoc_tuy: {
    id: 'cuu_chuyen_ngoc_tuy',
    name: 'Cửu Chuyển Ngọc Tủy',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 100,
    toxicityValue: 5,
    element: 'Kim',
    rarityTier: 9,
    description: 'Ngọc tủy chí bảo vô hà vô độc, chí tôn đan đạo.'
  },

  // Dược liệu bổ trợ thường dùng trong chiến thuật và thương hội
  herb_ngan_hanh: {
    id: 'herb_ngan_hanh',
    name: 'Ngân Hạnh Thảo',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 30,
    toxicityValue: 5,
    element: 'Mộc',
    rarityTier: 1,
    description: 'Chủ dược bồi bổ nguyên khí, tính hòa dịu.'
  },
  ngan_hanh_thao: {
    id: 'ngan_hanh_thao',
    name: 'Ngân Hạnh Thảo',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 30,
    toxicityValue: 5,
    element: 'Mộc',
    rarityTier: 1,
    description: 'Chủ dược bồi bổ nguyên khí, tính hòa dịu.'
  },
  herb_thien_nien_sam: {
    id: 'herb_thien_nien_sam',
    name: 'Thiên Niên Nhân Sâm',
    thermal: 'dai_nhiet',
    thermalScore: 2,
    tonicValue: 85,
    toxicityValue: 12,
    element: 'Thổ',
    rarityTier: 5,
    description: 'Nhân sâm ngàn năm thuần dương đại bổ, hỏa khí ngút trời.'
  },
  herb_bang_linh: {
    id: 'herb_bang_linh',
    name: 'Băng Linh Thảo',
    thermal: 'dai_han',
    thermalScore: -2,
    tonicValue: 80,
    toxicityValue: 15,
    element: 'Thủy',
    rarityTier: 5,
    description: 'Băng thảo sinh trưởng vùng hàn cực tuyết sơn, cực hàn chí lãnh.'
  },
  herb_dan_hoa: {
    id: 'herb_dan_hoa',
    name: 'Đan Dương Hoa',
    thermal: 'nhiet',
    thermalScore: 1,
    tonicValue: 50,
    toxicityValue: 20,
    element: 'Hỏa',
    rarityTier: 3,
    description: 'Hoa mọc gần nham thạch, tính ôn nhiệt tăng cường dược hỏa.'
  },
  herb_u_hon: {
    id: 'herb_u_hon',
    name: 'U Hồn Thảo',
    thermal: 'han',
    thermalScore: -1,
    tonicValue: 45,
    toxicityValue: 22,
    element: 'Thủy',
    rarityTier: 3,
    description: 'Cỏ sinh trưởng nơi âm u tích tụ hàn khí, dưỡng tâm an thần.'
  },
  herb_tinh_than: {
    id: 'herb_tinh_than',
    name: 'Tinh Thần Chi',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 70,
    toxicityValue: 10,
    element: 'Kim',
    rarityTier: 4,
    description: 'Nấm hấp thu tinh túy tinh hoa đêm trăng, trung hòa dược tính.'
  },
  herb_loi_kich: {
    id: 'herb_loi_kich',
    name: 'Lôi Kích Mộc Căn',
    thermal: 'dai_nhiet',
    thermalScore: 2,
    tonicValue: 65,
    toxicityValue: 28,
    element: 'Lôi',
    rarityTier: 4,
    description: 'Rễ cây hấp thụ thiên lôi giáng xuống, cuồng nhiệt chí cương.'
  },

  // Các loại dược thảo cửu giai trong Herbs Shop
  herb_t1_qi: {
    id: 'herb_t1_qi',
    name: 'Ninh Thần Thảo',
    thermal: 'binh',
    thermalScore: 0,
    tonicValue: 30,
    toxicityValue: 5,
    element: 'Mộc',
    rarityTier: 1,
    description: 'Thảo mộc xanh nhạt ngưng tụ linh khí sơ khai.'
  },
  herb_t1_break: {
    id: 'herb_t1_break',
    name: 'Hoàng Tinh Căn',
    thermal: 'nhiet',
    thermalScore: 1,
    tonicValue: 35,
    toxicityValue: 10,
    element: 'Thổ',
    rarityTier: 1,
    description: 'Rễ cây trăm năm hấp thụ tinh hoa đất trời.'
  },
  herb_t1_life: {
    id: 'herb_t1_life',
    name: 'Huyết Khí Chi',
    thermal: 'nhiet',
    thermalScore: 1,
    tonicValue: 40,
    toxicityValue: 10,
    element: 'Hỏa',
    rarityTier: 1,
    description: 'Nấm linh chi đỏ thẫm bồi bổ khí huyết.'
  },
  herb_t1_rare: {
    id: 'herb_t1_rare',
    name: 'Bạch Ngọc Quả',
    thermal: 'han',
    thermalScore: -1,
    tonicValue: 45,
    toxicityValue: 5,
    element: 'Kim',
    rarityTier: 1,
    description: 'Quả mọng trắng ngần cường hóa gân cốt.'
  }
};

/**
 * Tra cứu thuộc tính dược lý của thảo dược với cơ chế fallback thông minh
 */
export function getHerbMedicinalProperty(herbId: string): HerbMedicinalProperty {
  if (HERB_MEDICINAL_PROPERTIES[herbId]) {
    return HERB_MEDICINAL_PROPERTIES[herbId];
  }

  // Fallback an toàn dựa trên tên / tiền tố id
  const lower = herbId.toLowerCase();
  let thermal: HerbThermalProperty = 'binh';
  let thermalScore = 0;

  if (lower.includes('dai_nhiet') || lower.includes('loi_kich') || lower.includes('thien_nien_sam') || lower.includes('cuong_bao')) {
    thermal = 'dai_nhiet';
    thermalScore = 2;
  } else if (lower.includes('dai_han') || lower.includes('bang_linh') || lower.includes('hoa_than') || lower.includes('tuyet')) {
    thermal = 'dai_han';
    thermalScore = -2;
  } else if (lower.includes('nhiet') || lower.includes('hoa') || lower.includes('duong') || lower.includes('huyet')) {
    thermal = 'nhiet';
    thermalScore = 1;
  } else if (lower.includes('han') || lower.includes('thuy') || lower.includes('am') || lower.includes('u_hon')) {
    thermal = 'han';
    thermalScore = -1;
  }

  // Ước lượng tier từ chuỗi herb_t[1-9]
  const tierMatch = lower.match(/_t([1-9])_/);
  const tier = tierMatch ? parseInt(tierMatch[1], 10) : 2;

  return {
    id: herbId,
    name: herbId.replace(/^(herb_|m_herb_)/, '').replace(/_/g, ' ').toUpperCase(),
    thermal,
    thermalScore,
    tonicValue: 20 + tier * 10,
    toxicityValue: 5 + tier * 3,
    rarityTier: tier,
    description: 'Dược thảo thiên nhiên được khai phá trong quá trình tầm bảo.'
  };
}

// =========================================================================
// 2. FINGERPRINT HASHING INVARIANT
// =========================================================================

/**
 * Tạo mã băm duy nhất (canonical fingerprint) cho công thức đan phương.
 * Quy tắc:
 * - Gộp số lượng của các slot trùng ID.
 * - Sắp xếp theo ID từ điển tăng dần.
 * - Định dạng: herb_1:c1|herb_2:c2
 */
export function generateRecipeFingerprint(slots: ExperimentSlot[]): string {
  const herbCountMap = new Map<string, number>();

  for (const slot of slots) {
    if (!slot || !slot.herbId || slot.count <= 0) continue;
    const current = herbCountMap.get(slot.herbId) || 0;
    herbCountMap.set(slot.herbId, current + slot.count);
  }

  const sortedHerbIds = Array.from(herbCountMap.keys()).sort();
  return sortedHerbIds.map(id => `${id}:${herbCountMap.get(id)}`).join('|');
}

// =========================================================================
// 3. PURE ENGINE: ĐÁNH GIÁ THỬ NGHIỆM ĐAN PHƯƠNG (EVALUATE HERB EXPERIMENT)
// =========================================================================

/**
 * Đánh giá tính hòa hợp, âm dương cân bằng, bổ độc tỷ lệ của tổ hợp dược liệu thử nghiệm.
 * Ràng buộc:
 * - Số slot thử nghiệm: tối thiểu 3, tối đa 5 vị thuốc.
 * - ThermalBalance = sum(thermalScore * count)
 * - TonicRatio = sum(tonicValue * count) / (sum(toxicityValue * count) + 1)
 * - Thất bại (nổ lò phế đan): |ThermalBalance| >= 3 HOẶC TonicRatio < 0.8
 * - Hòa hợp thành công: |ThermalBalance| <= 1 VÀ TonicRatio >= 0.8
 */
export function evaluateHerbExperiment(slots: ExperimentSlot[]): ExperimentEvaluationResult {
  // 1. Kiểm tra ràng buộc số slot (tối thiểu 3, tối đa 5 vị thuốc)
  if (!slots || !Array.isArray(slots) || slots.length < 3) {
    return {
      isHarmonious: false,
      thermalBalance: 0,
      tonicRatio: 0,
      predictedGrade: 'Phế Đan',
      predictedTier: 1,
      predictedEffectValue: 0,
      predictedToxicity: 50,
      harmonyScore: 0,
      message: 'Số lượng vị thuốc thử nghiệm không đủ! Cần tối thiểu 3 vị dược liệu để hình thành cấu trúc đan phương.',
      reason: 'insufficient_slots'
    };
  }

  if (slots.length > 5) {
    return {
      isHarmonious: false,
      thermalBalance: 0,
      tonicRatio: 0,
      predictedGrade: 'Phế Đan',
      predictedTier: 1,
      predictedEffectValue: 0,
      predictedToxicity: 100,
      harmonyScore: 0,
      message: 'Số lượng vị thuốc vượt quá giới hạn! Tối đa chỉ có thể phối hợp 5 vị dược liệu trong một lần ngưng đan.',
      reason: 'exceeded_slots'
    };
  }

  // 2. Tổng hợp chỉ số âm dương, đại bổ và độc tính
  let totalThermalScore = 0;
  let totalTonicValue = 0;
  let totalToxicityValue = 0;
  let totalHerbCount = 0;
  let weightedTierSum = 0;

  for (const slot of slots) {
    const prop = getHerbMedicinalProperty(slot.herbId);
    const count = Math.max(1, slot.count || 1);

    totalThermalScore += prop.thermalScore * count;
    totalTonicValue += prop.tonicValue * count;
    totalToxicityValue += prop.toxicityValue * count;
    totalHerbCount += count;
    weightedTierSum += prop.rarityTier * count;
  }

  const thermalBalance = totalThermalScore;
  const tonicRatio = totalTonicValue / (totalToxicityValue + 1);
  const avgTier = Math.max(1, Math.min(9, Math.round(weightedTierSum / Math.max(1, totalHerbCount))));

  // 3. Đánh giá thất bại (Nổ lò phế đan)
  const isExtremeThermal = Math.abs(thermalBalance) >= 3;
  const isExcessiveToxicity = tonicRatio < 0.8;

  if (isExtremeThermal || isExcessiveToxicity) {
    let reason = 'thermal_explosion';
    let message = '';

    if (isExtremeThermal && isExcessiveToxicity) {
      reason = 'thermal_and_toxic_catastrophe';
      message = thermalBalance > 0
        ? `Lò luyện nổ tung! Hỏa độc ngút trời (+${thermalBalance}), dược tính quá bạo liệt và độc tố vượt ngưỡng!`
        : `Lò luyện nổ tung! Hàn độc thấu xương (${thermalBalance}), cực hàn xung đột với độc tố làm tan nát đan thai!`;
    } else if (isExtremeThermal) {
      reason = thermalBalance > 0 ? 'hyperthermic_explosion' : 'hypothermic_freeze';
      message = thermalBalance > 0
        ? `Lò luyện quá nhiệt phát nổ (+${thermalBalance})! Hỏa khí quá thịnh thiêu rụi toàn bộ dược liệu thành tro tàn.`
        : `Lò luyện quá hàn đông cứng (${thermalBalance})! Cực hàn ngưng kết làm vỡ nát đan thai, tạo thành băng phế đan.`;
    } else {
      reason = 'toxic_pollution';
      message = `Luyện đan thất bại! Tỷ lệ đại bổ không bù đắp nổi độc tính (TonicRatio: ${tonicRatio.toFixed(2)} < 0.8), tạo thành phế đan ô uế.`;
    }

    return {
      isHarmonious: false,
      thermalBalance,
      tonicRatio: Number(tonicRatio.toFixed(2)),
      predictedGrade: 'Phế Đan',
      predictedTier: avgTier,
      predictedEffectValue: 0,
      predictedToxicity: Math.min(100, Math.round(totalToxicityValue / Math.max(1, slots.length))),
      harmonyScore: Math.max(0, Math.round(30 - Math.abs(thermalBalance) * 5)),
      message,
      reason
    };
  }

  // 4. Kiểm tra điều kiện hòa hợp thành công: |ThermalBalance| <= 1 và TonicRatio >= 0.8
  const isHarmonious = Math.abs(thermalBalance) <= 1 && tonicRatio >= 0.8;

  if (!isHarmonious) {
    // Trường hợp |ThermalBalance| == 2 (Bất ổn, không đủ để nổ lò nhưng không thể kết đan)
    return {
      isHarmonious: false,
      thermalBalance,
      tonicRatio: Number(tonicRatio.toFixed(2)),
      predictedGrade: 'Tàn Đan',
      predictedTier: avgTier,
      predictedEffectValue: Math.round(totalTonicValue * 0.2),
      predictedToxicity: Math.round(totalToxicityValue / Math.max(1, slots.length)),
      harmonyScore: 50,
      message: `Âm dương chưa đạt đến độ hòa hợp (|ThermalBalance| = ${Math.abs(thermalBalance)} > 1). Đan thai bất ổn, không thể ngưng tụ đan văn.`,
      reason: 'unstable_equilibrium'
    };
  }

  // 5. Tính toán HarmonyScore và phẩm chất đan dược thành công
  // Khi ThermalBalance = 0: điểm âm dương tuyệt hảo (50/50).
  // Khi |ThermalBalance| = 1: điểm âm dương khá (35/50).
  const thermalHarmonyPoints = thermalBalance === 0 ? 50 : 35;
  // Điểm dược lực / giải độc tỷ lệ: tối đa 50 điểm
  const tonicPoints = Math.min(50, Math.round(tonicRatio * 12));
  const rawHarmonyScore = thermalHarmonyPoints + tonicPoints;
  const harmonyScore = Math.max(60, Math.min(100, rawHarmonyScore));

  // Xác định phẩm cấp dự kiến
  let predictedGrade = 'Hạ Phẩm';
  if (harmonyScore >= 95) {
    predictedGrade = avgTier >= 8 ? 'Thần Phẩm' : 'Cực Phẩm';
  } else if (harmonyScore >= 80) {
    predictedGrade = 'Thượng Phẩm';
  } else if (harmonyScore >= 65) {
    predictedGrade = 'Trung Phẩm';
  }

  // Hiệu quả tăng tu vi căn bản
  const predictedEffectValue = Math.round(totalTonicValue * (harmonyScore / 100) * 15 * avgTier);
  const predictedToxicity = Math.max(0, Math.round((totalToxicityValue / Math.max(1, slots.length)) * (1.2 - harmonyScore / 120)));

  const successMessage = thermalBalance === 0
    ? `Âm dương thái cực hoàn hảo (Thermal = 0)! Dược tính giao hòa viên mãn, linh khí ngút trời!`
    : `Dược tính hài hòa ổn định (Thermal = ${thermalBalance > 0 ? '+' + thermalBalance : thermalBalance}), kết tinh đan đan hữu ích!`;

  return {
    isHarmonious: true,
    thermalBalance,
    tonicRatio: Number(tonicRatio.toFixed(2)),
    predictedGrade,
    predictedTier: avgTier,
    predictedEffectValue,
    predictedToxicity,
    harmonyScore,
    message: successMessage
  };
}

// =========================================================================
// 4. ATOMIC INNOVATION ENGINE: KHAI SÁNG ĐAN PHƯƠNG
// =========================================================================

export interface InnovateCustomRecipeResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  recipe?: CustomDanRecipe;
  evaluation: ExperimentEvaluationResult;
  error?: string;
}

/**
 * Thực hiện khai sáng đan phương mới:
 * 1. Kiểm tra tính hợp lệ của số slot.
 * 2. Đánh giá thử nghiệm thảo dược (evaluateHerbExperiment).
 * 3. Kiểm tra số lượng thảo dược trong túi đồ người chơi.
 * 4. Kiểm tra mã băm trùng lặp (Fingerprint collision guard).
 * 5. Khấu trừ thảo dược nguyên tử (atomic deduction).
 * 6. Khởi tạo và ghi nhận CustomDanRecipe mới vào PlayerState.
 */
export function innovateCustomRecipe(
  player: PlayerStats,
  slots: ExperimentSlot[],
  customName?: string,
  customLore?: string
): InnovateCustomRecipeResult {
  const currentRecipeState: CustomRecipeState = player.customRecipeState || {
    discoveredRecipes: [],
    totalResearchAttempts: 0,
    sectArchivedRecipeIds: []
  };

  // 1. Đánh giá thử nghiệm
  const evaluation = evaluateHerbExperiment(slots);

  // Nếu số slot vi phạm ràng buộc (dưới 3 hoặc trên 5) -> Dừng ngay trước khi trừ nguyên liệu
  if (evaluation.reason === 'insufficient_slots' || evaluation.reason === 'exceeded_slots') {
    return {
      success: false,
      updatedPlayer: player,
      evaluation,
      error: evaluation.message
    };
  }

  // 2. Tính tổng số lượng dược liệu yêu cầu theo từng loại
  const requiredCountMap = new Map<string, number>();
  for (const slot of slots) {
    if (!slot.herbId || slot.count <= 0) continue;
    const current = requiredCountMap.get(slot.herbId) || 0;
    requiredCountMap.set(slot.herbId, current + slot.count);
  }

  // 3. Kiểm tra hành trang người chơi
  const playerHerbs: Herb[] = player.inventory?.herbs || [];
  for (const [herbId, requiredQty] of requiredCountMap.entries()) {
    const invHerb = playerHerbs.find(h => h.id === herbId);
    const availableQty = invHerb ? (invHerb.quantity ?? (invHerb as any).count ?? 0) : 0;
    if (availableQty < requiredQty) {
      const herbProp = getHerbMedicinalProperty(herbId);
      return {
        success: false,
        updatedPlayer: player,
        evaluation,
        error: `Không đủ thảo dược [${invHerb?.name || herbProp.name}] trong túi đồ (cần ${requiredQty}, hiện có ${availableQty})!`
      };
    }
  }

  // 4. Kiểm tra trùng lặp đan phương đã khai sáng (Fingerprint Collision Guard)
  const fingerprint = generateRecipeFingerprint(slots);
  const isDuplicate = currentRecipeState.discoveredRecipes.some(r => r.fingerprint === fingerprint);
  if (isDuplicate) {
    return {
      success: false,
      updatedPlayer: player,
      evaluation,
      error: `Đan phương với tổ hợp dược liệu này đã được khai sáng trước đó (Mã băm: ${fingerprint})!`
    };
  }

  // 5. Khấu trừ thảo dược atomic
  const updatedHerbs = playerHerbs
    .map(h => {
      const deduct = requiredCountMap.get(h.id);
      if (!deduct) return { ...h };
      const current = h.quantity ?? (h as any).count ?? 0;
      const next = current - deduct;
      return {
        ...h,
        quantity: next,
        count: next
      };
    })
    .filter(h => (h.quantity ?? (h as any).count ?? 0) > 0);

  const updatedAttempts = currentRecipeState.totalResearchAttempts + 1;

  // 6. Xử lý kết quả thử nghiệm
  if (!evaluation.isHarmonious) {
    // Thử nghiệm thất bại (nổ lò hoặc tàn đan) -> Đã tiêu tốn thảo dược và tăng số lần nghiên cứu
    const updatedPlayer: PlayerStats = {
      ...player,
      inventory: {
        ...(player.inventory || { pills: [], herbs: [], ores: [] }),
        herbs: updatedHerbs
      },
      customRecipeState: {
        ...currentRecipeState,
        totalResearchAttempts: updatedAttempts
      }
    };

    return {
      success: false,
      updatedPlayer,
      evaluation,
      error: evaluation.message
    };
  }

  // 7. Tạo mới CustomDanRecipe thành công
  const recipeId = `custom_recipe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const defaultRecipeName = customName && customName.trim()
    ? customName.trim()
    : `Khai Sáng Đan Phương #${currentRecipeState.discoveredRecipes.length + 1}`;
  const defaultRecipeLore = customLore && customLore.trim()
    ? customLore.trim()
    : `Đan phương do đan sư ${player.name || 'Vô Danh'} tự tay nghiên cứu đúc kết từ ngàn vạn linh dược.`;

  const newRecipe: CustomDanRecipe = {
    id: recipeId,
    name: defaultRecipeName,
    lore: defaultRecipeLore,
    creatorName: player.name || 'Đan Đạo Tông Sư',
    createdAt: Date.now(),
    fingerprint,
    herbsRequired: slots.map(s => {
      const prop = getHerbMedicinalProperty(s.herbId);
      return {
        herbId: s.herbId,
        herbName: s.herbName || prop.name,
        count: s.count
      };
    }),
    tier: evaluation.predictedTier,
    grade: evaluation.predictedGrade,
    effectType: 'tu_vi',
    effectValue: evaluation.predictedEffectValue,
    toxicity: evaluation.predictedToxicity,
    harmonyScore: evaluation.harmonyScore,
    thermalBalance: evaluation.thermalBalance,
    successRate: Math.min(95, Math.max(50, Math.round(evaluation.harmonyScore * 0.95))),
    isArchivedInSect: false
  };

  const updatedDiscovered = [...currentRecipeState.discoveredRecipes, newRecipe];

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: {
      ...(player.inventory || { pills: [], herbs: [], ores: [] }),
      herbs: updatedHerbs
    },
    customRecipeState: {
      ...currentRecipeState,
      discoveredRecipes: updatedDiscovered,
      totalResearchAttempts: updatedAttempts
    }
  };

  return {
    success: true,
    updatedPlayer,
    recipe: newRecipe,
    evaluation
  };
}

// =========================================================================
// 5. CROSS-SYSTEM BRIDGE: TÀNG KINH CÁC TÔNG MÔN (Archive to Sect)
// =========================================================================

export interface ArchiveToSectResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  reputationGained: number;
  message: string;
  reason?: string;
}

/**
 * Hiến tặng đan phương tự sáng chế vào Tàng Kinh Các tông môn.
 * Quy tắc:
 * - Đan phương phải thuộc sở hữu người chơi (discoveredRecipes).
 * - Chưa được lưu trữ trước đó (isArchivedInSect = false).
 * - Cộng Danh Vọng Tông Môn theo Tier đan phương: Tier * 100 + harmonyScore * 2.
 * - Atomic: Chỉ đánh dấu isArchivedInSect = true, không xóa đan phương khỏi danh sách.
 */
export function archiveRecipeToSect(
  player: PlayerStats,
  recipeId: string
): ArchiveToSectResult {
  const currentRecipeState: CustomRecipeState = player.customRecipeState || {
    discoveredRecipes: [],
    totalResearchAttempts: 0,
    sectArchivedRecipeIds: []
  };

  // 1. Tìm đan phương trong danh sách
  const recipeIndex = currentRecipeState.discoveredRecipes.findIndex(r => r.id === recipeId);
  if (recipeIndex === -1) {
    return {
      success: false,
      updatedPlayer: player,
      reputationGained: 0,
      message: 'Không tìm thấy đan phương này trong danh sách khai sáng của đan sư!',
      reason: 'recipe_not_found'
    };
  }

  const recipe = currentRecipeState.discoveredRecipes[recipeIndex];

  // 2. Kiểm tra đã hiến tặng trước đó chưa
  if (recipe.isArchivedInSect || currentRecipeState.sectArchivedRecipeIds.includes(recipeId)) {
    return {
      success: false,
      updatedPlayer: player,
      reputationGained: 0,
      message: `Đan Phương [${recipe.name}] đã được lưu trữ trong Tàng Kinh Các tông môn trước đó!`,
      reason: 'already_archived'
    };
  }

  // 3. Tính điểm danh vọng dựa trên Tier và HarmonyScore
  const reputationGained = Math.round(recipe.tier * 100 + recipe.harmonyScore * 2);

  // 4. Cập nhật isArchivedInSect trên recipe
  const updatedRecipes = currentRecipeState.discoveredRecipes.map((r, idx) =>
    idx === recipeIndex ? { ...r, isArchivedInSect: true } : r
  );

  // 5. Cập nhật customSectState.reputation (nếu tông môn đã khai phái)
  const currentCustomSect = player.customSectState;
  const updatedCustomSect = currentCustomSect
    ? {
        ...currentCustomSect,
        reputation: (currentCustomSect.reputation || 0) + reputationGained
      }
    : undefined;

  const updatedPlayer: PlayerStats = {
    ...player,
    customRecipeState: {
      ...currentRecipeState,
      discoveredRecipes: updatedRecipes,
      sectArchivedRecipeIds: [...currentRecipeState.sectArchivedRecipeIds, recipeId]
    },
    ...(updatedCustomSect ? { customSectState: updatedCustomSect } : {})
  };

  return {
    success: true,
    updatedPlayer,
    reputationGained,
    message: `Đan Phương [${recipe.name}] (${recipe.grade}) đã được lưu trữ vào Tàng Kinh Các! Danh Vọng Tông Môn +${reputationGained.toLocaleString()} điểm.`
  };
}

// =========================================================================
// 6. CROSS-SYSTEM BRIDGE: ĐỊNH GIÁ HẮC THỊ ĐẤU GIÁ (Black Market Valuation)
// =========================================================================

export interface BlackMarketValuationResult {
  baseRefPrice: number;    // Giá tham chiếu đan dược cùng phẩm cấp tiêu chuẩn
  multiplier: number;      // Hệ số độc bản (2.5x - 5.0x)
  startingBid: number;     // Giá khởi điểm đấu giá
  reservePrice: number;    // Giá sàn (70% startingBid)
  estimatedFinalBid: number; // Dự báo giá cuối (NPC canh tranh)
  rarityLabel: string;     // "Độc Bản Hiếm", "Tiên Thiên Chí Bảo", v.v.
}

/**
 * Định giá đấu giá Hắc Thị cho đan phương tự sáng chế.
 * Quy tắc định giá:
 * - baseRefPrice = 500 * Tier^2 * effectValue / 1000 (Linh Thạch)
 * - multiplier = 2.5 đến 5.0 tỷ lệ với harmonyScore và Tier
 * - startingBid = baseRefPrice * multiplier
 * - reservePrice = startingBid * 0.70
 * - estimatedFinalBid = startingBid * 1.8 (NPC AI cạnh tranh)
 */
export function calculateBlackMarketValuation(recipe: CustomDanRecipe): BlackMarketValuationResult {
  // 1. Tính giá tham chiếu căn bản theo tier và effectValue
  const safeTier = Math.max(1, Math.min(9, recipe.tier));
  const safeEffect = Math.max(1, recipe.effectValue);
  const baseRefPrice = Math.round(500 * Math.pow(safeTier, 2) * (safeEffect / 1000));

  // 2. Hệ số độc bản: 2.5x (Hạ Phẩm) -> 5.0x (Thần Phẩm) tỷ lệ harmonyScore
  const harmonyFactor = Math.max(0, Math.min(100, recipe.harmonyScore)) / 100; // 0.0 - 1.0
  const multiplier = parseFloat((2.5 + harmonyFactor * 2.5).toFixed(2)); // 2.5x - 5.0x

  // 3. Điều chỉnh thêm theo grade text
  let gradeBonus = 1.0;
  const g = (recipe.grade || '').toLowerCase();
  if (g.includes('thần') || g.includes('tiên thiên')) {
    gradeBonus = 1.5;
  } else if (g.includes('cực') || g.includes('thánh')) {
    gradeBonus = 1.25;
  } else if (g.includes('thượng')) {
    gradeBonus = 1.1;
  }

  const startingBid = Math.round(baseRefPrice * multiplier * gradeBonus);
  const reservePrice = Math.round(startingBid * 0.70);
  const estimatedFinalBid = Math.round(startingBid * 1.8);

  // 4. Nhãn hiếm
  let rarityLabel = 'Độc Bản Khai Sáng';
  if (safeTier >= 8 && harmonyFactor >= 0.9) {
    rarityLabel = 'Tiên Thiên Chí Bảo • Vô Song Độc Phẩm';
  } else if (safeTier >= 6 || harmonyFactor >= 0.85) {
    rarityLabel = 'Độc Bản Cực Hiếm • Thiên Hạ Vô Nhị';
  } else if (safeTier >= 4 || harmonyFactor >= 0.75) {
    rarityLabel = 'Độc Bản Trân Quý';
  }

  return {
    baseRefPrice,
    multiplier,
    startingBid,
    reservePrice,
    estimatedFinalBid,
    rarityLabel
  };
}
