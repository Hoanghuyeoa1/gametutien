// lib/alchemy-tactics-logic.ts
// Pure Business Logic: Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ
// (Tactical Heat Stances & Herbal Archetype Matrix)
// Tuân thủ Clean Architecture, 4 Hard Invariants, không phụ thuộc UI

import {
  HerbRoleType,
  TacticalHeatStance,
  HerbRoleMetadata,
  TacticalHerbSlot,
  ConcoctionSetup,
  ConcoctionPreviewResult,
  TacticalAlchemyExecutionResult,
  AlchemyTacticsState
} from './types/alchemy-tactics';
import { PlayerStats, Pill, Herb, InventoryBag } from './types';
import { PillMutationData, PillVeinTier } from './types/pill-veins';
import {
  calculateVeinRoll,
  rollPillMutation,
  PILL_VEIN_CONFIG,
  calculateMultiplicativeToxicity
} from './pill-vein-logic';
import { HEAVENLY_FLAMES_REGISTRY, DEFAULT_MORTAL_FLAME } from './heavenly-flame-logic';
import {
  evaluatePillTribulationTrigger,
  createPillTribulationEncounter
} from './pill-tribulation-logic';

// ==========================================
// 1. BẢNG TRA CỨU ĐẶC TÍNH THẢO DƯỢC (HERB_ROLE_REGISTRY)
// ==========================================

export const HERB_ROLE_REGISTRY: Record<string, HerbRoleMetadata> = {
  // --- QUÂN DƯỢC (Monarch Herbs - Chủ Dược Định Hình Đan) ---
  herb_ngan_hanh: {
    id: 'herb_ngan_hanh',
    name: 'Ngân Hạnh Thảo',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 1000,
    elementalAffinity: 'Moc',
    pillTypeCreated: 'tu_vi',
    basePotencyValue: 1000, // 1,000 Tu Vi
    baseToxicityValue: 20,   // 20 Đan Độc gốc
    description: 'Chủ dược bồi bổ nguyên khí, gia tăng 1,000 Tu Vi căn cơ khi dùng.'
  },
  ngan_hanh_thao: {
    id: 'ngan_hanh_thao',
    name: 'Ngân Hạnh Thảo',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 1000,
    elementalAffinity: 'Moc',
    pillTypeCreated: 'tu_vi',
    basePotencyValue: 1000,
    baseToxicityValue: 20,
    description: 'Chủ dược bồi bổ nguyên khí, gia tăng 1,000 Tu Vi căn cơ khi dùng.'
  },
  linh_thao: {
    id: 'linh_thao',
    name: 'Bách Thảo Sơ Thiên',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 800,
    elementalAffinity: 'Moc',
    pillTypeCreated: 'tu_vi',
    basePotencyValue: 800,
    baseToxicityValue: 15,
    description: 'Linh thảo sơ thiên, luyện chế đan dược bồi nguyên ích khí.'
  },
  herb_huyet_tinh: {
    id: 'herb_huyet_tinh',
    name: 'Huyết Tinh Thảo',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 500,
    elementalAffinity: 'Hoa',
    pillTypeCreated: 'huyet_khi',
    basePotencyValue: 500,  // +500 Khí Huyết
    baseToxicityValue: 15,
    description: 'Chủ dược ngưng tụ huyết khí dồi dào, cường hóa thể phách và khí huyết.'
  },
  huyet_tinh_thao: {
    id: 'huyet_tinh_thao',
    name: 'Huyết Tinh Thảo',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 500,
    elementalAffinity: 'Hoa',
    pillTypeCreated: 'huyet_khi',
    basePotencyValue: 500,
    baseToxicityValue: 15,
    description: 'Chủ dược ngưng tụ huyết khí dồi dào, cường hóa thể phách và khí huyết.'
  },
  herb_cuu_diep: {
    id: 'herb_cuu_diep',
    name: 'Cửu Diệp Chi',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 15,
    elementalAffinity: 'Tho',
    pillTypeCreated: 'dot_pha',
    basePotencyValue: 15,   // +15% Tỷ lệ phá cảnh
    baseToxicityValue: 25,
    description: 'Chủ dược đột phá bình cảnh tu vi, nâng cao cơ hội tấn thăng đại cảnh giới.'
  },
  cuu_diep_chi: {
    id: 'cuu_diep_chi',
    name: 'Cửu Diệp Chi',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 15,
    elementalAffinity: 'Tho',
    pillTypeCreated: 'dot_pha',
    basePotencyValue: 15,
    baseToxicityValue: 25,
    description: 'Chủ dược đột phá bình cảnh tu vi, nâng cao cơ hội tấn thăng đại cảnh giới.'
  },
  truc_co_chi_lan: {
    id: 'truc_co_chi_lan',
    name: 'Trúc Cơ Chi Lan',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 12,
    elementalAffinity: 'Tho',
    pillTypeCreated: 'dot_pha',
    basePotencyValue: 12,
    baseToxicityValue: 22,
    description: 'Tiên lan hỗ trợ ngưng tụ đan điền, phá vỡ gông cùm phàm tục.'
  },
  herb_u_hon: {
    id: 'herb_u_hon',
    name: 'U Hồn Hoa',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 30,
    elementalAffinity: 'Thuy',
    pillTypeCreated: 'tay_tuy',
    basePotencyValue: 30,   // Giảm 30 Đan độc cơ thể khi nuốt
    baseToxicityValue: 10,  // Đan độc viên thuốc thấp
    description: 'Chủ dược tẩy tủy hóa ma, gột rửa kinh mạch và trừ bỏ đan độc tích tụ.'
  },
  u_hon_hoa: {
    id: 'u_hon_hoa',
    name: 'U Hồn Hoa',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 30,
    elementalAffinity: 'Thuy',
    pillTypeCreated: 'tay_tuy',
    basePotencyValue: 30,
    baseToxicityValue: 10,
    description: 'Chủ dược tẩy tủy hóa ma, gột rửa kinh mạch và trừ bỏ đan độc tích tụ.'
  },
  tay_tuy_linh_nhi: {
    id: 'tay_tuy_linh_nhi',
    name: 'Tẩy Tủy Linh Chi',
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 25,
    elementalAffinity: 'Thuy',
    pillTypeCreated: 'tay_tuy',
    basePotencyValue: 25,
    baseToxicityValue: 10,
    description: 'Linh chi tẩy trần, bài trừ cặn bã độc tố trong đan điền.'
  },

  // --- THẦN DƯỢC (Minister Herbs - Phụ Trợ Khuếch Đại Dược Lực) ---
  herb_thien_nien_sam: {
    id: 'herb_thien_nien_sam',
    name: 'Thiên Niên Linh Sâm',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 45, // +45% công hiệu (x1.45)
    elementalAffinity: 'Moc',
    description: 'Thần dược tương trợ, khuếch đại dược lực của Quân Dược thêm +45%.'
  },
  thien_nien_linh_sam: {
    id: 'thien_nien_linh_sam',
    name: 'Thiên Niên Linh Sâm',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 45,
    elementalAffinity: 'Moc',
    description: 'Thần dược tương trợ, khuếch đại dược lực của Quân Dược thêm +45%.'
  },
  herb_dan_hoa_tinh: {
    id: 'herb_dan_hoa_tinh',
    name: 'Đan Hỏa Chi Tinh',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 30, // +30% công hiệu (x1.30)
    elementalAffinity: 'Hoa',
    description: 'Dược tính thuần dương, kích phát dược tính Quân Dược thêm +30%.'
  },
  dan_hoa_chi_tinh: {
    id: 'dan_hoa_chi_tinh',
    name: 'Đan Hỏa Chi Tinh',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 30,
    elementalAffinity: 'Hoa',
    description: 'Dược tính thuần dương, kích phát dược tính Quân Dược thêm +30%.'
  },
  herb_tu_khi_thao: {
    id: 'herb_tu_khi_thao',
    name: 'Tụ Khí Thanh Hoa',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 25, // +25%
    elementalAffinity: 'Kim',
    description: 'Tụ nạp linh khí, gia tăng +25% dược lực của Quân Dược.'
  },
  tu_khi_hoa: {
    id: 'tu_khi_hoa',
    name: 'Tụ Khí Thanh Hoa',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 25,
    elementalAffinity: 'Kim',
    description: 'Tụ nạp linh khí, gia tăng +25% dược lực của Quân Dược.'
  },
  cuu_chuyen_ngoc_tuy: {
    id: 'cuu_chuyen_ngoc_tuy',
    name: 'Cửu Chuyển Ngọc Tủy',
    role: 'than',
    primaryEffect: 'potency_boost',
    powerValue: 50, // +50%
    elementalAffinity: 'Duong',
    description: 'Ngọc tủy thượng cổ, khuếch đại tối thượng +50% dược lực.'
  },

  // --- TÁ DƯỢC (Assistant Herbs - Điều Hòa & Triệt Tiêu Độc / Nổ Lò) ---
  herb_bang_linh: {
    id: 'herb_bang_linh',
    name: 'Băng Linh Thảo',
    role: 'ta',
    primaryEffect: 'toxicity_suppress',
    powerValue: 50, // Triệt tiêu 50% độc tính (-50%)
    elementalAffinity: 'Thuy',
    description: 'Hàn băng linh thảo, triệt tiêu 50% Đan Độc và đè bẹp 15% nguy cơ nổ lò.'
  },
  bang_linh_thao: {
    id: 'bang_linh_thao',
    name: 'Băng Linh Thảo',
    role: 'ta',
    primaryEffect: 'toxicity_suppress',
    powerValue: 50,
    elementalAffinity: 'Thuy',
    description: 'Hàn băng linh thảo, triệt tiêu 50% Đan Độc và đè bẹp 15% nguy cơ nổ lò.'
  },
  herb_thanh_tam: {
    id: 'herb_thanh_tam',
    name: 'Thanh Tâm Thảo',
    role: 'ta',
    primaryEffect: 'toxicity_suppress',
    powerValue: 40, // Hóa giải 40% tạp chất
    elementalAffinity: 'Moc',
    description: 'Thanh lọc tâm tính, giảm 40% Đan Độc và giảm 10% nguy cơ nổ lò.'
  },
  thanh_tam_thao: {
    id: 'thanh_tam_thao',
    name: 'Thanh Tâm Thảo',
    role: 'ta',
    primaryEffect: 'toxicity_suppress',
    powerValue: 40,
    elementalAffinity: 'Moc',
    description: 'Thanh lọc tâm tính, giảm 40% Đan Độc và giảm 10% nguy cơ nổ lò.'
  },
  hoa_than_linh_diep: {
    id: 'hoa_than_linh_diep',
    name: 'Hóa Thần Linh Diệp',
    role: 'ta',
    primaryEffect: 'toxicity_suppress',
    powerValue: 35,
    elementalAffinity: 'Than',
    description: 'Thần mộc thanh tẩy, triệt tiêu 35% độc tính và giảm 10% nguy cơ nổ lò.'
  },

  // --- SỨ DƯỢC (Envoy Herbs - Dẫn Khí & Khai Mở Đan Văn) ---
  herb_tinh_than: {
    id: 'herb_tinh_than',
    name: 'Tinh Thần Thảo',
    role: 'su',
    primaryEffect: 'vein_conduit',
    powerValue: 35, // +35% Tỷ lệ Đan Văn 6 - 9
    elementalAffinity: 'Kim',
    description: 'Dẫn khí thiên tinh, gia tăng mạnh +35% xác suất xuất hiện Đan Văn 6 - 9.'
  },
  tinh_than_thao: {
    id: 'tinh_than_thao',
    name: 'Tinh Thần Thảo',
    role: 'su',
    primaryEffect: 'vein_conduit',
    powerValue: 35,
    elementalAffinity: 'Kim',
    description: 'Dẫn khí thiên tinh, gia tăng mạnh +35% xác suất xuất hiện Đan Văn 6 - 9.'
  },
  herb_loi_kich: {
    id: 'herb_loi_kich',
    name: 'Lôi Kích Mộc',
    role: 'su',
    primaryEffect: 'vein_conduit',
    powerValue: 25,
    elementalAffinity: 'Loi',
    description: 'Dẫn khí thiên lôi, tăng +25% phẩm chất Đan Văn và kích thích biến dị Lôi Tính.'
  },
  loi_kich_moc: {
    id: 'loi_kich_moc',
    name: 'Lôi Kích Mộc',
    role: 'su',
    primaryEffect: 'vein_conduit',
    powerValue: 25,
    elementalAffinity: 'Loi',
    description: 'Dẫn khí thiên lôi, tăng +25% phẩm chất Đan Văn và kích thích biến dị Lôi Tính.'
  },
  cuong_bao_hoa: {
    id: 'cuong_bao_hoa',
    name: 'Cuồng Bạo Ma Hoa',
    role: 'su',
    primaryEffect: 'vein_conduit',
    powerValue: 20,
    elementalAffinity: 'Hoa',
    description: 'Kích phát dược lực dẫn nhập kinh mạch, tăng +20% phẩm chất Đan Văn.'
  }
};

/**
 * Tìm kiếm hoặc khởi tạo cấu hình vai trò cho thảo dược
 */
export function getHerbRoleMetadata(herbId: string | null | undefined): HerbRoleMetadata | null {
  if (!herbId) return null;
  const direct = HERB_ROLE_REGISTRY[herbId];
  if (direct) return direct;

  // Xử lý tiền tố/hậu tố nếu có
  const cleanId = herbId.replace(/^herb_/, '');
  const withPrefix = 'herb_' + cleanId;
  if (HERB_ROLE_REGISTRY[withPrefix]) return HERB_ROLE_REGISTRY[withPrefix];
  if (HERB_ROLE_REGISTRY[cleanId]) return HERB_ROLE_REGISTRY[cleanId];

  // Fallback linh hoạt cho các loại thảo dược khác
  return {
    id: herbId,
    name: herbId,
    role: 'quan',
    primaryEffect: 'base_pill_type',
    powerValue: 500,
    elementalAffinity: 'Moc',
    pillTypeCreated: 'tu_vi',
    basePotencyValue: 500,
    baseToxicityValue: 20,
    description: 'Linh thảo thiên nhiên, dùng làm vị Quân Dược định hình mẻ đan.'
  };
}

// ==========================================
// 2. THẨM ĐỊNH TƯƠNG SINH TƯƠNG KHẮC (HARMONY SCORE)
// ==========================================

const ELEMENT_GENERATION: Record<string, string> = {
  Moc: 'Hoa',
  Hoa: 'Tho',
  Tho: 'Kim',
  Kim: 'Thuy',
  Thuy: 'Moc'
};

const ELEMENT_DESTRUCTION: Record<string, string> = {
  Moc: 'Tho',
  Tho: 'Thuy',
  Thuy: 'Hoa',
  Hoa: 'Kim',
  Kim: 'Moc'
};

/**
 * Tính toán Điểm Hòa Hợp Tứ Trụ (0 - 100%)
 */
export function calculateHerbHarmonyScore(setup: ConcoctionSetup): {
  score: number;
  clashesCount: number;
  generationsCount: number;
  hasTaNeutralizer: boolean;
} {
  const quanMeta = getHerbRoleMetadata(setup.quan?.herbItemId);
  if (!quanMeta) {
    return { score: 0, clashesCount: 0, generationsCount: 0, hasTaNeutralizer: false };
  }

  const elements: string[] = [quanMeta.elementalAffinity];
  const thanMeta = getHerbRoleMetadata(setup.than?.herbItemId);
  const taMeta = getHerbRoleMetadata(setup.ta?.herbItemId);
  const suMeta = getHerbRoleMetadata(setup.su?.herbItemId);

  if (thanMeta) elements.push(thanMeta.elementalAffinity);
  if (taMeta) elements.push(taMeta.elementalAffinity);
  if (suMeta) elements.push(suMeta.elementalAffinity);

  const hasTaNeutralizer = Boolean(taMeta);
  let generationsCount = 0;
  let clashesCount = 0;

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const e1 = elements[i];
      const e2 = elements[j];

      if (ELEMENT_GENERATION[e1] === e2 || ELEMENT_GENERATION[e2] === e1) {
        generationsCount++;
      } else if (ELEMENT_DESTRUCTION[e1] === e2 || ELEMENT_DESTRUCTION[e2] === e1) {
        clashesCount++;
      }
    }
  }

  let baseScore = 65;
  baseScore += generationsCount * 12;

  if (clashesCount > 0) {
    if (hasTaNeutralizer) {
      // Tá Dược trung hòa xung khắc
      baseScore += 5;
    } else {
      baseScore -= clashesCount * 20;
    }
  }

  const finalScore = Math.max(10, Math.min(100, baseScore));
  return {
    score: finalScore,
    clashesCount,
    generationsCount,
    hasTaNeutralizer
  };
}

// ==========================================
// 3. TÍNH TOÁN THEO HỎA HẦU (HEAT STANCES MODIFIERS)
// ==========================================

export interface HeatStanceModifiers {
  potencyMultiplier: number;
  toxicityMultiplier: number;
  stanceReductionRatio: number; // Hệ số giảm độc từ Hỏa Hầu (0.0 -> 1.0)
  veinQualityBonus: number;
  explosionRiskPercent: number;
  log: string;
}

/**
 * Điều chỉnh các hệ số đan đạo theo Chiến Lược Hỏa Hầu
 */
export function applyHeatStanceModifiers(
  stance: TacticalHeatStance,
  taSuppressionPercent: number = 0,
  hasExtremeClash: boolean = false
): HeatStanceModifiers {
  switch (stance) {
    case 'van_hoa':
      return {
        potencyMultiplier: 1.0,
        toxicityMultiplier: 0.75, // Giảm thêm 25% Đan Độc
        stanceReductionRatio: 0.25, // Tỷ lệ giảm độc 0.25 cho mô hình cấp nhân
        veinQualityBonus: 25,     // Tăng +25 điểm Đan Văn
        explosionRiskPercent: 0,  // RỦI RO NỔ LÒ BẮT BUỘC = 0%
        log: 'Văn Hỏa ôn nhu dưỡng đan: Rủi ro nổ lò = 0%, đan độc chiết giảm -25%, tăng xác suất đan văn cực phẩm.'
      };

    case 'vu_hoa':
      // Vũ Hỏa: cơ sở 15% nổ lò, Tá Dược kiềm chế (ví dụ Băng Linh Thảo giảm 15% -> nổ lò = 0%)
      const taReduction = Math.min(15, Math.floor(taSuppressionPercent * 0.3));
      const calculatedRisk = Math.max(0, 15 - taReduction);

      return {
        potencyMultiplier: 1.15, // +15% Dược Lực
        toxicityMultiplier: 1.25, // +25% Đan Độc
        stanceReductionRatio: 0.0, // Không giảm độc
        veinQualityBonus: 0,
        explosionRiskPercent: calculatedRisk,
        log: `Vũ Hỏa bạo liệt cấp tốc: Dược lực +15%, đan độc +25%, rủi ro nổ lò: ${calculatedRisk}%.`
      };

    case 'van_vu_song_hanh':
    default:
      const clashRisk = hasExtremeClash ? 10 : 0;
      return {
        potencyMultiplier: 1.0,
        toxicityMultiplier: 1.0,
        stanceReductionRatio: 0.0,
        veinQualityBonus: 0,
        explosionRiskPercent: Math.max(0, clashRisk - Math.floor(taSuppressionPercent * 0.2)),
        log: 'Văn Vũ Tương Tế: Âm dương điều hòa chu thiên, vận hành ổn định.'
      };
  }
}

// ==========================================
// 4. DỰ TOÁN THIÊN CƠ (CONCOCTION PREVIEW)
// ==========================================

export function previewConcoction(
  player: PlayerStats,
  setup: ConcoctionSetup,
  equippedFlame?: any,
  expectedVeinTier?: PillVeinTier
): ConcoctionPreviewResult {
  const quanSlot = setup.quan;
  const quanMeta = getHerbRoleMetadata(quanSlot?.herbItemId);

  if (!quanSlot?.herbItemId || !quanMeta) {
    return {
      basePillName: 'Chưa Chọn Quân Dược',
      basePillId: '',
      predictedPotencyMultiplier: 1.0,
      effectivePotencyValue: 0,
      predictedToxicityReductionPercent: 0,
      effectiveToxicityValue: 0,
      veinQualityBonusPercent: 0,
      explosionRiskPercent: 0,
      harmonyScore: 0,
      canCraft: false,
      requiredHerbsSummary: [],
      errorMessage: 'Quân Dược là vị trí bắt buộc để định hình bản chất đan dược.'
    };
  }

  // 1. Thần Dược
  const thanMeta = getHerbRoleMetadata(setup.than?.herbItemId);
  const ministerPotencyBoost = thanMeta ? thanMeta.powerValue : 0; // %
  const ministerMultiplier = 1 + ministerPotencyBoost / 100;

  // 2. Tá Dược
  const taMeta = getHerbRoleMetadata(setup.ta?.herbItemId);
  const taToxicitySuppression = taMeta ? taMeta.powerValue : 0; // %
  const taSuppressionRatio = Math.max(0, Math.min(1, taToxicitySuppression / 100));

  // 3. Sứ Dược
  const suMeta = getHerbRoleMetadata(setup.su?.herbItemId);
  const envoyVeinQualityBonus = suMeta ? suMeta.powerValue : 0; // Điểm Đan Văn

  // 4. Điểm hòa hợp
  const harmony = calculateHerbHarmonyScore(setup);
  const hasExtremeClash = harmony.clashesCount > 0 && !harmony.hasTaNeutralizer;

  // 5. Hỏa Hầu
  const stanceMods = applyHeatStanceModifiers(
    setup.stance,
    taToxicitySuppression,
    hasExtremeClash
  );

  // 6. Tổng hợp Dược Lực
  const rawPotencyBase = quanMeta.basePotencyValue || 1000;
  const finalPotencyMultiplier = Number((ministerMultiplier * stanceMods.potencyMultiplier).toFixed(3));
  const effectivePotency = Math.round(rawPotencyBase * finalPotencyMultiplier);

  // 7. Tổng hợp Đan Độc gốc theo Mô hình Suy Hao Cấp Nhân (Multiplicative Compounding Decay)
  const rawToxicityBase = quanMeta.baseToxicityValue || 20;

  // Trích xuất hệ số Dị Hỏa (0.0 -> 1.0)
  const flameBurnRatio = equippedFlame?.flameBurnRatio !== undefined
    ? equippedFlame.flameBurnRatio
    : Math.max(0, Math.min(1, (equippedFlame?.baseToxicityBurnPercent || 0) / 100));
  const flameVeinBonus = equippedFlame?.baseVeinQualityBonus || 0;

  // Hỏa Hầu: Hệ số giảm độc (0.0 -> 1.0)
  const stanceReductionRatio = stanceMods.stanceReductionRatio;

  // Dự toán độc tính qua Pure Function calculateMultiplicativeToxicity
  const previewVeinTier: PillVeinTier = expectedVeinTier ?? 0;
  const toxCalc = calculateMultiplicativeToxicity({
    baseToxicity: rawToxicityBase,
    veinTier: previewVeinTier,
    flameBurnRatio,
    taSuppressionRatio,
    stanceReductionRatio
  });

  // Áp dụng hệ số tăng độc nếu ở thế Vũ Hỏa (toxicityMultiplier > 1)
  let effectiveToxicity = toxCalc.finalToxicity;
  if (stanceMods.toxicityMultiplier > 1) {
    effectiveToxicity = Number((effectiveToxicity * stanceMods.toxicityMultiplier).toFixed(2));
  }

  const effectiveToxicityValue = Math.max(0, Math.round(effectiveToxicity));
  const toxicityReductionPercent = rawToxicityBase > 0
    ? Math.min(100, Math.max(0, Number((((rawToxicityBase - effectiveToxicityValue) / rawToxicityBase) * 100).toFixed(1))))
    : 100;

  // 8. Đan Văn Quality Bonus
  const totalVeinQualityBonus = envoyVeinQualityBonus + stanceMods.veinQualityBonus + flameVeinBonus;

  // 9. Nguy cơ nổ lò
  let finalExplosionRisk = stanceMods.explosionRiskPercent;
  if (setup.stance === 'van_hoa') {
    finalExplosionRisk = 0; // Bất biến
  }

  // 10. Tên đan dược dựa theo Quân Dược
  let basePillName = 'Tiên Đan';
  let basePillId = 'pill_custom';
  if (quanMeta.pillTypeCreated === 'tu_vi') {
    basePillName = 'Cố Bản Bồi Nguyên Đan';
    basePillId = 'pill_co_ban_boi_nguyen';
  } else if (quanMeta.pillTypeCreated === 'huyet_khi') {
    basePillName = 'Thần Lực Huyết Tinh Đan';
    basePillId = 'pill_than_luc_huyet_tinh';
  } else if (quanMeta.pillTypeCreated === 'dot_pha') {
    basePillName = 'Cửu Khiếu Phá Cảnh Đan';
    basePillId = 'pill_cuu_khieu_pha_canh';
  } else if (quanMeta.pillTypeCreated === 'tay_tuy') {
    basePillName = 'Thanh Tâm Hóa Độc Đan';
    basePillId = 'pill_thanh_tam_hoa_doc';
  }

  // 11. Kiểm tra nguyên liệu trong Túi Trữ Vật & Chống Dup Slot
  const invHerbs = player.inventory?.herbs || [];
  const requiredCounts: Record<string, { count: number; name: string }> = {};

  const addReq = (slot: TacticalHerbSlot | null | undefined, defaultCnt: number) => {
    if (slot && slot.herbItemId) {
      const cur = requiredCounts[slot.herbItemId] || {
        count: 0,
        name: slot.herbName || getHerbRoleMetadata(slot.herbItemId)?.name || slot.herbItemId
      };
      cur.count += (slot.count || defaultCnt) * setup.batchMultiplier;
      requiredCounts[slot.herbItemId] = cur;
    }
  };

  addReq(setup.quan, 2);
  addReq(setup.than, 1);
  addReq(setup.ta, 1);
  addReq(setup.su, 1);

  const summary = Object.entries(requiredCounts).map(([herbId, data]) => {
    const owned = invHerbs.find(h => h.id === herbId)?.quantity || 0;
    return {
      herbId,
      herbName: data.name,
      requiredCount: data.count,
      ownedCount: owned
    };
  });

  const missing = summary.filter(s => s.ownedCount < s.requiredCount);
  const canCraft = missing.length === 0;

  return {
    basePillName,
    basePillId,
    predictedPotencyMultiplier: finalPotencyMultiplier,
    effectivePotencyValue: effectivePotency,
    predictedToxicityReductionPercent: toxicityReductionPercent,
    effectiveToxicityValue: effectiveToxicity,
    veinQualityBonusPercent: totalVeinQualityBonus,
    explosionRiskPercent: finalExplosionRisk,
    harmonyScore: harmony.score,
    canCraft,
    requiredHerbsSummary: summary,
    errorMessage: canCraft ? undefined : `Thiếu nguyên liệu: ${missing.map(m => `${m.herbName} (${m.ownedCount}/${m.requiredCount})`).join(', ')}`
  };
}

// ==========================================
// 5. THỰC THI PHỐI CHẾ CHIẾN THUẬT (EXECUTE CONCOCTION)
// ==========================================

export function executeTacticalConcoction(
  player: PlayerStats,
  setup: ConcoctionSetup,
  options?: {
    forceExplosion?: boolean;
    randomSeed?: number;
    equippedFlameInstance?: any;
    crafterRealmIndex?: number;
    alchemySkillLevel?: number;
  }
): TacticalAlchemyExecutionResult {
  const flameConfig = player.flameState?.equippedFlameId
    ? HEAVENLY_FLAMES_REGISTRY[player.flameState.equippedFlameId] || DEFAULT_MORTAL_FLAME
    : DEFAULT_MORTAL_FLAME;

  const preview = previewConcoction(player, setup, flameConfig);

  if (!preview.canCraft) {
    return {
      success: false,
      isExploded: false,
      pillsCraftedCount: 0,
      basePillId: '',
      basePillName: '',
      effectivePotency: 0,
      effectiveToxicity: 0,
      veinTierRolled: 0,
      salvagedHerbsCount: 0,
      logs: [preview.errorMessage || 'Không đủ nguyên liệu để bắt đầu mẻ nung.'],
      message: preview.errorMessage || 'Không đủ nguyên liệu.'
    };
  }

  // 1. Khấu trừ nguyên liệu nguyên tử
  const invHerbs = [...(player.inventory?.herbs || []).map(h => ({ ...h }))];
  let totalHerbsConsumed = 0;

  for (const req of preview.requiredHerbsSummary) {
    const foundIdx = invHerbs.findIndex(h => h.id === req.herbId);
    if (foundIdx >= 0) {
      invHerbs[foundIdx].quantity -= req.requiredCount;
      totalHerbsConsumed += req.requiredCount;
    }
  }

  const cleanedHerbs = invHerbs.filter(h => h.quantity > 0);

  // 2. Thẩm định Nổ Lò (Explosion Check)
  let isExploded = false;
  if (setup.stance !== 'van_hoa') {
    if (options?.forceExplosion) {
      isExploded = true;
    } else if (preview.explosionRiskPercent > 0) {
      const roll = (options?.randomSeed !== undefined ? options.randomSeed : Math.random()) * 100;
      isExploded = roll < preview.explosionRiskPercent;
    }
  }

  // BIẾN CỐ NỔ LÒ
  if (isExploded) {
    // Tá Dược bảo lưu tối thiểu 50% nguyên liệu quý
    const salvagedCount = Math.max(1, Math.floor(totalHerbsConsumed * 0.5));

    // Hoàn trả 50% nguyên liệu vào kho
    const refundedHerbs = [...cleanedHerbs];
    for (const req of preview.requiredHerbsSummary) {
      const refundCount = Math.max(1, Math.floor(req.requiredCount * 0.5));
      const exIdx = refundedHerbs.findIndex(h => h.id === req.herbId);
      if (exIdx >= 0) {
        refundedHerbs[exIdx].quantity += refundCount;
      } else {
        refundedHerbs.push({
          id: req.herbId,
          name: req.herbName,
          grade: 'Tam Giai',
          description: 'Thảo dược được bảo lưu sau nổ lò.',
          price: 50,
          quantity: refundCount
        });
      }
    }

    // Tạo Phế Đan
    const invPills = [...(player.inventory?.pills || []).map(p => ({ ...p }))];
    const pheDanId = 'pill_phe_dan';
    const existingPheDan = invPills.find(p => p.id === pheDanId);
    const pheDanCount = setup.batchMultiplier;

    if (existingPheDan) {
      existingPheDan.quantity += pheDanCount;
    } else {
      invPills.push({
        id: pheDanId,
        name: 'Phế Đan (Tro Tàn Hỏa Đỉnh)',
        grade: 'Phàm Giai',
        description: 'Mẻ đan bị nổ lò do hỏa lực mất kiểm soát, cháy đen thành tro.',
        effectValue: 0,
        price: 5,
        quantity: pheDanCount,
        veinMetadata: {
          veinCount: 0,
          veinMultiplier: 0.1,
          toxicityMultiplier: 1.0,
          mutation: null
        }
      });
    }

    const currentInventory = player.inventory || { pills: [], herbs: [], ores: [] };
    const updatedInventory: InventoryBag = {
      ...currentInventory,
      ores: currentInventory.ores || [],
      herbs: refundedHerbs,
      pills: invPills
    };

    const updatedPlayer: PlayerStats = {
      ...player,
      inventory: updatedInventory
    };

    return {
      success: true, // Vòng lặp kết thúc có hậu, không crash
      isExploded: true,
      pillsCraftedCount: 0,
      basePillId: pheDanId,
      basePillName: 'Phế Đan (Tro Tàn Hỏa Đỉnh)',
      effectivePotency: 0,
      effectiveToxicity: 50,
      veinTierRolled: 0,
      salvagedHerbsCount: salvagedCount,
      logs: [
        `💥 NỔ LÒ! Hỏa hầu [${setup.stance.toUpperCase()}] bạo liệt mất kiểm soát!`,
        `Trận đồ Tá Dược đã phong tỏa lò luyện, thu hồi an toàn ${salvagedCount} thảo dược gốc.`,
        `Thu về ${pheDanCount} viên Phế Đan tro tàn.`
      ],
      message: `💥 Biến cố Nổ Lò! Đã thu hồi 50% nguyên liệu và nhận Phế Đan.`,
      updatedPlayer
    };
  }

  // 3. THÀNH CÔNG: QUAY ĐAN VĂN & SẢN LƯỢNG
  const crafterRealm = options?.crafterRealmIndex ?? player.currentRealm ?? 1;
  const alchemyLevel = options?.alchemySkillLevel ?? player.alchemyArtisan?.level ?? 1;

  const rolledVein = calculateVeinRoll(
    crafterRealm,
    alchemyLevel,
    1,
    preview.veinQualityBonusPercent,
    options?.randomSeed
  );

  const veinConfig = PILL_VEIN_CONFIG[rolledVein];

  // Áp dụng Đan Văn lên Dược Lực
  const finalPotency = Math.round(preview.effectivePotencyValue * veinConfig.veinMultiplier);

  // Tính Đan Độc theo Mô hình Suy Hao Cấp Nhân (Multiplicative Compounding Decay)
  // Khớp 100% với hàm dự toán previewConcoction khi đã xác định bậc Đan Văn
  const veinPreview = previewConcoction(player, setup, flameConfig, rolledVein);
  const finalToxicity = veinPreview.effectiveToxicityValue;

  // Tính sản lượng xuất lò
  let totalYield = setup.batchMultiplier;
  if (flameConfig.baseYieldMultiplier > 1) {
    totalYield *= flameConfig.baseYieldMultiplier;
  }
  if (setup.stance === 'vu_hoa' && Math.random() < 0.15) {
    totalYield += 1; // Thưởng thêm 1 viên may mắn của Vũ Hỏa
  }

  // Thử quay Biến Dị Thiên Phú (nếu có Sứ Dược nguyên tố hoặc Dị Hỏa)
  let rolledMutation: PillMutationData | null = null;
  const suMeta = getHerbRoleMetadata(setup.su?.herbItemId);
  if (suMeta?.elementalAffinity === 'Loi') {
    rolledMutation = {
      affixType: 'lightning_resist_percent',
      affixName: 'Lôi Đình Kháng Tính',
      value: 1.0,
      description: 'Gia tăng +1% Kháng Lôi vĩnh viễn nhờ Lôi Kích Mộc dẫn khí.'
    };
  }

  // Thêm viên đan vào Túi Trữ Vật
  const invPills = [...(player.inventory?.pills || []).map(p => ({ ...p }))];
  const newPill: Pill = {
    id: `${preview.basePillId}_${Date.now()}`,
    name: preview.basePillName,
    grade: rolledVein >= 9 ? 'Thần Giai' : rolledVein >= 6 ? 'Thượng Giai' : 'Tam Giai',
    description: `Đan dược chiến thuật phối ngũ: Quân [${setup.quan.herbName}], Hỏa Hầu [${setup.stance}]. Dược lực: ${finalPotency}, Đan độc: ${finalToxicity}.`,
    effectValue: finalPotency,
    price: 150 * (rolledVein + 1),
    quantity: totalYield,
    veinMetadata: {
      veinCount: rolledVein,
      veinMultiplier: veinConfig.veinMultiplier,
      toxicityMultiplier: veinConfig.toxicityMultiplier,
      toxicityBurnPercent: veinPreview.predictedToxicityReductionPercent,
      flameId: flameConfig.id,
      mutation: rolledMutation
    }
  };

  // Thẩm định Đan Lôi Kiếp (Pill Tribulation Evaluation)
  const herbTierMap: Record<string, number> = {
    'tay_tuy': 8,
    'dot_pha': 7,
    'huyet_khi': 5,
    'tu_vi': 4
  };
  const quanRoleMeta = getHerbRoleMetadata(setup.quan.herbItemId);
  const derivedTier = quanRoleMeta?.pillTypeCreated ? (herbTierMap[quanRoleMeta.pillTypeCreated] || 4) : 4;
  const tacticalPillTier = rolledVein === 9 ? 9 : derivedTier;
  const tribCheck = evaluatePillTribulationTrigger(tacticalPillTier, rolledVein, Boolean(rolledMutation));

  let tribulationEncounter: any = null;
  if (tribCheck.shouldTrigger) {
    tribulationEncounter = createPillTribulationEncounter(
      preview.basePillId,
      preview.basePillName,
      tacticalPillTier,
      tribCheck.intensity,
      newPill,
      totalYield,
      newPill.veinMetadata
    );
  } else {
    invPills.push(newPill);
  }

  // Cập nhật lịch sử phối chế chiến thuật
  const currentTacticsState: AlchemyTacticsState = player.alchemyTacticsState || {
    defaultStance: setup.stance,
    customConcoctionsHistory: []
  };

  const newHistory = [
    {
      timestamp: Date.now(),
      pillName: preview.basePillName,
      veinCount: rolledVein,
      potency: finalPotency,
      toxicity: finalToxicity,
      stance: setup.stance,
      herbsUsed: preview.requiredHerbsSummary.map(r => r.herbName)
    },
    ...currentTacticsState.customConcoctionsHistory.slice(0, 19)
  ];

  const currentInventorySuccess = player.inventory || { pills: [], herbs: [], ores: [] };
  const updatedInventorySuccess: InventoryBag = {
    ...currentInventorySuccess,
    ores: currentInventorySuccess.ores || [],
    herbs: cleanedHerbs,
    pills: invPills
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: updatedInventorySuccess,
    alchemyTacticsState: {
      defaultStance: setup.stance,
      customConcoctionsHistory: newHistory
    },
    pillTribulationState: {
      totalTribulationsFaced: player.pillTribulationState?.totalTribulationsFaced || 0,
      successfulDefenses: player.pillTribulationState?.successfulDefenses || 0,
      danSpirits: player.pillTribulationState?.danSpirits || [],
      activeTribulation: tribulationEncounter
    }
  };

  return {
    success: true,
    isExploded: false,
    pillsCraftedCount: totalYield,
    basePillId: preview.basePillId,
    basePillName: preview.basePillName,
    effectivePotency: finalPotency,
    effectiveToxicity: finalToxicity,
    veinTierRolled: rolledVein,
    mutationRolled: rolledMutation,
    salvagedHerbsCount: 0,
    logs: [
      `🎉 Xuất lò thành công [${preview.basePillName}] x${totalYield}!`,
      `Đan phẩm: ${rolledVein} Đan Văn (${veinConfig.title}).`,
      `Dược Lực thực tế: ${finalPotency} | Đan Độc: ${finalToxicity} điểm.`,
      ...(tribCheck.shouldTrigger ? [tribCheck.reason] : [])
    ],
    message: tribCheck.shouldTrigger
      ? `⚡ Thiên kiếp giáng lâm! ${tribCheck.reason}`
      : `Xuất lò thành công [${preview.basePillName}] (${rolledVein} Đan Văn) x${totalYield}!`,
    updatedPlayer,
    tribulationTriggered: tribCheck.shouldTrigger,
    tribulationEncounter: tribulationEncounter || undefined
  };
}

// ==========================================
// 6. HELPER KHỞI TẠO SETUP MẶC ĐỊNH
// ==========================================

export function createDefaultConcoctionSetup(): ConcoctionSetup {
  return {
    quan: {
      herbItemId: 'herb_ngan_hanh',
      herbName: 'Ngân Hạnh Thảo',
      role: 'quan',
      count: 2
    },
    than: null,
    ta: null,
    su: null,
    stance: 'van_vu_song_hanh',
    batchMultiplier: 1
  };
}
