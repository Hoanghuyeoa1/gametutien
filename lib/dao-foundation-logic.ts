// lib/dao-foundation-logic.ts
// Pure Business Logic cho phân hệ:
// "Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa (Dao Foundation Grades & Major Realm Transcendence)"
// 100% Strict TypeScript, Pure Functions, Zero Mutation, Zero Side Effects

import {
  DaoFoundationGrade,
  DaoFoundationConfig,
  MajorRealmTransitionConfig,
  FoundationValidationResult,
  InnateTalentDefinition
} from './types/dao-foundation';

// ============================================================================
// 1. REGISTRY CẤU HÌNH ĐẠI CẢNH GIỚI (MAJOR TRANSITIONS REGISTRY)
// ============================================================================

export const MAJOR_TRANSITIONS_REGISTRY: Record<string, MajorRealmTransitionConfig> = {
  luyen_khi_to_truc_co: {
    transitionId: 'luyen_khi_to_truc_co',
    fromRealmId: '10', // Luyện Khí Viên Mãn (Tầng 10)
    toRealmId: '11',   // Trúc Cơ Sơ Kỳ
    transitionName: 'Luyện Khí Viên Mãn ➔ Trúc Cơ Đạo Đài',
    foundations: {
      ha_pham: {
        grade: 'ha_pham',
        title: 'Phàm Trúc Cơ',
        statMultiplier: 1.0,
        maxAllowedToxicity: 100,
        minRequiredQiPurity: 0,
        extraTuviCost: 0,
        extraSpiritStonesCost: 0,
        phenomenonName: 'Bình Phàm Khí Hải',
        phenomenonDescription: 'Khí hải bình thường, không sinh dị tượng, đạo cơ bình phàm.'
      },
      dia_pham: {
        grade: 'dia_pham',
        title: 'Địa Mạch Trúc Cơ',
        statMultiplier: 1.3,
        requiredPillItemId: 'item_truc_co_dan',
        requiredPillName: 'Trúc Cơ Đan',
        requireNineVeinsPill: false,
        maxAllowedToxicity: 30,
        minRequiredQiPurity: 80,
        extraTuviCost: 300,
        extraSpiritStonesCost: 200,
        phenomenonName: 'Địa Mạch Hoàng Hà',
        phenomenonDescription: 'Hút dẫn địa khí ngưng tụ đạo đài, dâng trào hoàng hà chi khí.'
      },
      thien_dao: {
        grade: 'thien_dao',
        title: 'Thiên Đạo Trúc Cơ',
        statMultiplier: 1.6,
        requiredPillItemId: 'item_truc_co_dan',
        requiredPillName: 'Trúc Cơ Đan',
        requireNineVeinsPill: true,
        maxAllowedToxicity: 0,
        minRequiredQiPurity: 100,
        extraTuviCost: 800,
        extraSpiritStonesCost: 500,
        innateTalent: {
          id: 'thien_dao_dao_the',
          name: 'Thiên Đạo Đạo Thể',
          grade: 'thien_dao',
          realmOrigin: 'Trúc Cơ',
          description: '+10% Kháng tất cả, +15% Max HP',
          lore: 'Hòa hợp cùng thiên đạo ý chí, kinh mạch hóa thành thiên đạo quỹ tích, bách độc bất xâm, thể phách vô song.',
          statModifiers: {
            allResistPercent: 10,
            maxHpPercent: 15
          }
        },
        phenomenonName: 'Tử Khí Đông Lai Tam Vạn Dặm',
        phenomenonDescription: 'Thiên đạo cộng minh, tử khí từ phương đông tràn ngập tam vạn dặm, thiên địa vạn vật cúi đầu bái phục!'
      }
    }
  },

  truc_co_to_kim_dan: {
    transitionId: 'truc_co_to_kim_dan',
    fromRealmId: '15', // Trúc Cơ Đại Viên Mãn
    toRealmId: '16',   // Kim Đan Sơ Kỳ
    transitionName: 'Trúc Cơ Đại Viên Mãn ➔ Ngưng Kết Kim Đan',
    foundations: {
      ha_pham: {
        grade: 'ha_pham',
        title: 'Phàm Kim Đan',
        statMultiplier: 1.0,
        maxAllowedToxicity: 100,
        minRequiredQiPurity: 0,
        extraTuviCost: 0,
        extraSpiritStonesCost: 0,
        phenomenonName: 'Khí Tụ Đan Điền',
        phenomenonDescription: 'Kim đan bình thường, tạp chất chưa tiêu trừ hết.'
      },
      dia_pham: {
        grade: 'dia_pham',
        title: 'Huyền Linh Kim Đan',
        statMultiplier: 1.3,
        requiredPillItemId: 'item_kim_dan_hoan',
        requiredPillName: 'Kim Đan Hoàn',
        requireNineVeinsPill: false,
        maxAllowedToxicity: 30,
        minRequiredQiPurity: 80,
        extraTuviCost: 3000,
        extraSpiritStonesCost: 1000,
        phenomenonName: 'Thanh Liên Bừng Nở',
        phenomenonDescription: 'Huyền linh khí tụ, hư ảnh hoa sen thanh khiết nở rộ che chở kim đan.'
      },
      thien_dao: {
        grade: 'thien_dao',
        title: 'Cửu Chuyển Kim Đan',
        statMultiplier: 1.7,
        requiredPillItemId: 'item_kim_dan_hoan',
        requiredPillName: 'Kim Đan Hoàn',
        requireNineVeinsPill: true,
        maxAllowedToxicity: 0,
        minRequiredQiPurity: 100,
        extraTuviCost: 8000,
        extraSpiritStonesCost: 3000,
        innateTalent: {
          id: 'cuu_chuyen_kiem_the',
          name: 'Cửu Chuyển Kiếm Thể',
          grade: 'thien_dao',
          realmOrigin: 'Kim Đan',
          description: '+25% Sát thương Bạo kích, +50% Hồi phục Chân Nguyên',
          lore: 'Kim đan chín chuyển hóa kiếm phách, khí kình sắc bén vô song xé toạc hư không, chân nguyên luân chuyển vô tận.',
          statModifiers: {
            critDamageMultiplier: 0.25,
            qiRegenBonusPercent: 50
          }
        },
        phenomenonName: 'Cửu Long Phù Thiên',
        phenomenonDescription: 'Chín con cự long từ kim đan gầm thét bay vút lên cửu thiên, hào quang chiếu sáng vạn dặm sơn hà!'
      }
    }
  },

  kim_dan_to_nguyen_anh: {
    transitionId: 'kim_dan_to_nguyen_anh',
    fromRealmId: '20', // Kim Đan Đại Viên Mãn
    toRealmId: '21',   // Nguyên Anh Sơ Kỳ
    transitionName: 'Kim Đan Đại Viên Mãn ➔ Hóa Khí Phá Anh',
    foundations: {
      ha_pham: {
        grade: 'ha_pham',
        title: 'Phàm Anh',
        statMultiplier: 1.0,
        maxAllowedToxicity: 100,
        minRequiredQiPurity: 0,
        extraTuviCost: 0,
        extraSpiritStonesCost: 0,
        phenomenonName: 'Phá Toái Đan Thành',
        phenomenonDescription: 'Kim đan vỡ ra sinh ra phàm anh bình thường.'
      },
      dia_pham: {
        grade: 'dia_pham',
        title: 'Địa Tạng Anh',
        statMultiplier: 1.3,
        requiredPillItemId: 'item_hoa_anh_dan',
        requiredPillName: 'Hóa Anh Đan',
        requireNineVeinsPill: false,
        maxAllowedToxicity: 30,
        minRequiredQiPurity: 80,
        extraTuviCost: 15000,
        extraSpiritStonesCost: 5000,
        phenomenonName: 'Địa Tạng Bảo Quang',
        phenomenonDescription: 'Nguyên anh ngự trên đài sen hoàng kim, ánh sáng địa tạng phổ độ tam thiên thế giới.'
      },
      thien_dao: {
        grade: 'thien_dao',
        title: 'Hỗn Độn Thần Anh',
        statMultiplier: 1.8,
        requiredPillItemId: 'item_hoa_anh_dan',
        requiredPillName: 'Hóa Anh Đan',
        requireNineVeinsPill: true,
        maxAllowedToxicity: 0,
        minRequiredQiPurity: 100,
        extraTuviCost: 30000,
        extraSpiritStonesCost: 15000,
        innateTalent: {
          id: 'hon_don_than_the',
          name: 'Hỗn Độn Thần Thể',
          grade: 'thien_dao',
          realmOrigin: 'Nguyên Anh',
          description: '+20% Kháng tất cả, +30% Max HP, +20% Sát thương Bạo kích',
          lore: 'Nguyên anh hóa sinh từ tiên thiên hỗn độn khí, áp chế chư thiên vạn đạo, vạn pháp bất xâm.',
          statModifiers: {
            allResistPercent: 20,
            maxHpPercent: 30,
            critDamageMultiplier: 0.20
          }
        },
        phenomenonName: 'Hỗn Độn Khai Thiên • Vạn Tiên Triều Bái',
        phenomenonDescription: 'Khí hỗn độn sơ khai cuồn cuộn giáng lâm, hư ảnh vạn vị viễn cổ tiên nhân chắp tay triều bái Thần Anh!'
      }
    }
  }
};

export const INNATE_TALENTS_REGISTRY: Record<string, InnateTalentDefinition> = Object.values(
  MAJOR_TRANSITIONS_REGISTRY
).reduce<Record<string, InnateTalentDefinition>>((acc, transition) => {
  for (const foundation of Object.values(transition.foundations)) {
    if (foundation.innateTalent) {
      acc[foundation.innateTalent.id] = foundation.innateTalent;
    }
  }
  return acc;
}, {});

// ============================================================================
// 2. PURE FUNCTION: NHẬN DIỆN MỐC CHUYỂN GIAO ĐẠI CẢNH GIỚI
// ============================================================================

/**
 * Nhận diện chính xác mốc chuyển giao giữa 2 đại cảnh giới.
 * Nếu là tiểu cảnh giới (Tầng 1 -> Tầng 2, Sơ kỳ -> Trung kỳ) trả về null.
 */
export function checkIsMajorRealmTransition(
  currentRealmId: string | number,
  nextRealmId: string | number
): MajorRealmTransitionConfig | null {
  const fromStr = String(currentRealmId ?? '').trim().toLowerCase();
  const toStr = String(nextRealmId ?? '').trim().toLowerCase();

  // 1. Kiểm tra trực tiếp theo transitionId nếu truyền vào transitionId
  if (MAJOR_TRANSITIONS_REGISTRY[fromStr]) {
    return MAJOR_TRANSITIONS_REGISTRY[fromStr];
  }

  // 2. Duyệt qua danh sách transition trong registry
  for (const transition of Object.values(MAJOR_TRANSITIONS_REGISTRY)) {
    // Trùng khớp exact ID (dạng '10' -> '11', '15' -> '16', '20' -> '21' hoặc số)
    if (fromStr === transition.fromRealmId.toLowerCase() && toStr === transition.toRealmId.toLowerCase()) {
      return transition;
    }

    // Trùng khớp dạng realm_10 -> realm_11
    if (
      fromStr === `realm_${transition.fromRealmId}`.toLowerCase() &&
      toStr === `realm_${transition.toRealmId}`.toLowerCase()
    ) {
      return transition;
    }
  }

  // 3. Nhận diện theo tên hoặc stage cảnh giới
  // Luyện Khí -> Trúc Cơ
  if (
    (fromStr.includes('luyện khí') || fromStr.includes('luyen_khi') || fromStr === '10') &&
    (toStr.includes('trúc cơ') || toStr.includes('truc_co') || toStr === '11')
  ) {
    return MAJOR_TRANSITIONS_REGISTRY.luyen_khi_to_truc_co;
  }

  // Trúc Cơ -> Kim Đan
  if (
    (fromStr.includes('trúc cơ') || fromStr.includes('truc_co') || fromStr === '15') &&
    (toStr.includes('kim đan') || toStr.includes('kim_dan') || toStr === '16')
  ) {
    return MAJOR_TRANSITIONS_REGISTRY.truc_co_to_kim_dan;
  }

  // Kim Đan -> Nguyên Anh
  if (
    (fromStr.includes('kim đan') || fromStr.includes('kim_dan') || fromStr === '20') &&
    (toStr.includes('nguyên anh') || toStr.includes('nguyen_anh') || toStr === '21')
  ) {
    return MAJOR_TRANSITIONS_REGISTRY.kim_dan_to_nguyen_anh;
  }

  // Là tiểu cảnh giới hoặc không thuộc các mốc chuyển đại cảnh giới
  return null;
}

// ============================================================================
// 3. PURE FUNCTION: KIỂM TRA ĐIỀU KIỆN XUNG KÍCH PHẨM VỊ ĐẠO CƠ
// ============================================================================

/**
 * Thẩm định điều kiện để tu sĩ xung kích một phẩm vị Đạo Cơ cụ thể.
 * 
 * Ràng buộc Invariants:
 * - 100% Pure Functions, không mutate trực tiếp dữ liệu đầu vào.
 * - Zero-Toxicity Guard: Nếu grade === 'thien_dao', bắt buộc pillToxicity === 0. Dù chỉ 1 điểm độc cũng trả về canAttempt: false.
 * - Purity Guard: Nếu grade === 'thien_dao', bắt buộc qiPurity >= 100.
 * - Item & Vein Check: Nếu requireNineVeinsPill: true, phải có đan 9 văn.
 */
export function canAttemptFoundationGrade(
  player: any,
  transition: MajorRealmTransitionConfig,
  grade: DaoFoundationGrade,
  inventory?: any[]
): FoundationValidationResult {
  const reasons: string[] = [];
  const missingItems: string[] = [];

  const gradeConfig = transition?.foundations?.[grade];
  if (!gradeConfig) {
    return {
      canAttempt: false,
      reasons: [`Phẩm vị đạo cơ [${grade}] không tồn tại trong cấu hình cảnh giới.`],
      missingItems: []
    };
  }

  // 0. Immutability / Single-Attempt Guard: Không cho phép tái ngưng tụ đạo cơ ở cùng 1 đại cảnh giới
  if (player?.daoFoundations && transition?.transitionId && player.daoFoundations[transition.transitionId]) {
    const existingGrade = player.daoFoundations[transition.transitionId];
    return {
      canAttempt: false,
      reasons: [
        `Đại cảnh giới này đã được ngưng tụ Đạo Cơ thành công phẩm vị [${existingGrade}], đạo cơ đã định hình vĩnh viễn không thể ngưng tụ lại lần 2!`
      ],
      missingItems: []
    };
  }

  const toxicity = typeof player?.pillToxicity === 'number'
    ? player.pillToxicity
    : (typeof player?.danDoc === 'number' ? player.danDoc : 0);

  const qiPurity = typeof player?.qiPurity === 'number' ? player.qiPurity : 100;

  // 1. Zero-Toxicity Guard
  if (grade === 'thien_dao') {
    if (toxicity !== 0) {
      reasons.push(
        `Thiên Đạo Đạo Cơ yêu cầu Căn Cơ Băng Thanh hoàn mỹ: Đan Độc phải bằng đúng 0% (Hiện tại: ${toxicity}%)!`
      );
    }
  } else {
    if (toxicity > gradeConfig.maxAllowedToxicity) {
      reasons.push(
        `Đan Độc hiện tại (${toxicity}%) vượt quá mức cho phép tối đa (${gradeConfig.maxAllowedToxicity}%) của ${gradeConfig.title}!`
      );
    }
  }

  // 2. Purity Guard (Độ thuần tịnh chân nguyên)
  if (grade === 'thien_dao') {
    if (qiPurity < 100) {
      reasons.push(
        `Thiên Đạo Đạo Cơ yêu cầu Chân Nguyên thuần tịnh tuyệt đối 100% (Hiện tại: ${qiPurity}%)!`
      );
    }
  } else {
    if (qiPurity < gradeConfig.minRequiredQiPurity) {
      reasons.push(
        `Chân Nguyên hiện tại (${qiPurity}%) chưa đạt mức yêu cầu tối thiểu (${gradeConfig.minRequiredQiPurity}%) của ${gradeConfig.title}!`
      );
    }
  }

  // 3. Tu Vi & Linh Thạch bổ sung
  const playerTuVi = typeof player?.tuVi === 'number' ? player.tuVi : 0;
  const playerLinhThach = typeof player?.linhThach === 'number' ? player.linhThach : 0;

  if (gradeConfig.extraTuviCost > 0 && playerTuVi < gradeConfig.extraTuviCost) {
    reasons.push(
      `Tu Vi tích lũy không đủ bồi đắp ${gradeConfig.title}! Cần tối thiểu ${gradeConfig.extraTuviCost.toLocaleString()} Tu Vi (Hiện tại: ${playerTuVi.toLocaleString()}).`
    );
  }

  if (gradeConfig.extraSpiritStonesCost > 0 && playerLinhThach < gradeConfig.extraSpiritStonesCost) {
    reasons.push(
      `Linh Thạch không đủ tiêu hao bồi đắp ${gradeConfig.title}! Cần tối thiểu ${gradeConfig.extraSpiritStonesCost.toLocaleString()} Linh Thạch (Hiện tại: ${playerLinhThach.toLocaleString()}).`
    );
  }

  // 4. Item & Đan Văn Check (Vật phẩm bảo chứng và phẩm cấp đan văn)
  if (gradeConfig.requiredPillItemId) {
    const requiredId = gradeConfig.requiredPillItemId;
    const requiredName = gradeConfig.requiredPillName || requiredId;

    // Tổng hợp danh sách vật phẩm trong kho
    const candidateItems: any[] = [];
    if (Array.isArray(inventory)) {
      candidateItems.push(...inventory);
    } else if (player?.inventory) {
      if (Array.isArray(player.inventory.pills)) candidateItems.push(...player.inventory.pills);
      if (Array.isArray(player.inventory.items)) candidateItems.push(...player.inventory.items);
      if (Array.isArray(player.inventory.talismans)) candidateItems.push(...player.inventory.talismans);
    }

    const matchingPills = candidateItems.filter((item: any) => {
      if (!item) return false;
      const itemId = item.id || item.itemId || '';
      const qty = item.quantity ?? item.count ?? 0;
      return (itemId === requiredId || itemId.includes(requiredId)) && qty > 0;
    });

    if (matchingPills.length === 0) {
      missingItems.push(requiredId);
      reasons.push(
        `Cần có đan dược [${requiredName}] trong túi trữ vật để trùng kích ${gradeConfig.title}!`
      );
    } else if (gradeConfig.requireNineVeinsPill) {
      // Yêu cầu Cửu Khổng Thần Đan (9 Đan Văn)
      const hasNineVein = matchingPills.some((item: any) => {
        const veins = item.veinMetadata?.veinCount ?? item.veinCount ?? 0;
        return veins === 9;
      });

      if (!hasNineVein) {
        missingItems.push(`${requiredId}_9_veins`);
        reasons.push(
          `Thiên Đạo Đạo Cơ bắt buộc đan dược [${requiredName}] phải đạt Cửu Khổng Thần Đan (9 Đan Văn)! Hiện tại không có viên nào đạt chuẩn.`
        );
      }
    }
  }

  return {
    canAttempt: reasons.length === 0 && missingItems.length === 0,
    reasons,
    missingItems
  };
}

// ============================================================================
// 4. PURE FUNCTION: TÍNH TOÁN CHỈ SỐ NHÂN TĂNG THÊM TỪ ĐẠO CƠ
// ============================================================================

/**
 * Nhân hệ số statMultiplier của phẩm vị Đạo Cơ vào các chỉ số tăng thêm của cảnh giới mới.
 * Tuyệt đối là Pure Function, không làm biến dị object baseRealmStats đầu vào.
 */
export function calculateFoundationStatBonuses(
  baseRealmStats: any,
  gradeConfig: DaoFoundationConfig
): any {
  if (!baseRealmStats || typeof baseRealmStats !== 'object') {
    return {};
  }

  const multiplier = typeof gradeConfig?.statMultiplier === 'number' && gradeConfig.statMultiplier > 0
    ? gradeConfig.statMultiplier
    : 1.0;

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(baseRealmStats)) {
    if (typeof value === 'number') {
      result[key] = Math.round(value * multiplier);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// ============================================================================
// 5. HELPER UTILITIES: TRA CỨU TIỆN ÍCH
// ============================================================================

export function getMajorRealmTransitionById(transitionId: string): MajorRealmTransitionConfig | null {
  if (!transitionId) return null;
  return MAJOR_TRANSITIONS_REGISTRY[transitionId] || null;
}

export function getAllMajorTransitions(): MajorRealmTransitionConfig[] {
  return Object.values(MAJOR_TRANSITIONS_REGISTRY);
}

export function getFoundationConfig(
  transitionId: string,
  grade: DaoFoundationGrade
): DaoFoundationConfig | null {
  const transition = getMajorRealmTransitionById(transitionId);
  return transition?.foundations?.[grade] || null;
}
