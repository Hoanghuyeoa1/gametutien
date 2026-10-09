// lib/formation-inscription-logic.ts
// Pure Logic Engine: Minh Khắc Trận Văn & Mạch Dẫn Linh (Formation Inscription)
// 100% Strict TypeScript, Pure Functions, Clean Architecture

import { Equipment } from './types/items';
import {
  FormationInscriptionConfig,
  FormationInscriptionMaterial,
  InscriptionConduitSlot,
  InscriptionEffect,
  WeaponInscriptionMetadata
} from './types/formation-inscription';

// ============================================================================
// 1. REGISTRY: FORMATION_INSCRIPTIONS_REGISTRY
// ============================================================================

/**
 * Registry danh mục các Trận Đồ tiêu biểu dùng trong Minh Khắc Trận Văn
 */
export const FORMATION_INSCRIPTIONS_REGISTRY: Record<string, FormationInscriptionConfig> = {
  /**
   * Tier 2 (Passive): Tụ Khí Trận
   * Giảm 20% chân nguyên tiêu hao khi xuất chiêu.
   */
  tu_khi_tran: {
    id: 'tu_khi_tran',
    name: 'Tụ Khí Trận',
    vietnameseName: 'Tụ Khí Quy Nguyên Trận',
    tier: 2,
    triggerType: 'passive_stat',
    description: 'Giảm 20% chân nguyên tiêu hao khi xuất chiêu.',
    lore: 'Trận văn hấp thu thiên địa linh khí uẩn dưỡng thân kiếm, giảm hao tổn chân nguyên khi ngự kiếm xuất chiêu.',
    requiredDivineSense: 100,
    requiredMaterials: [
      { id: 'linh_muc_ha_pham', name: 'Hạ Phẩm Linh Mực', quantity: 2, itemCategory: 'material' },
      { id: 'tran_sa_so_cap', name: 'Sơ Cấp Trận Sa', quantity: 3, itemCategory: 'material' }
    ],
    effects: [
      {
        id: 'eff_tu_khi_tran_passive',
        name: 'Tụ Khí Quy Nguyên',
        triggerType: 'passive_stat',
        statKey: 'manaCostReduction',
        value: 0.20,
        description: 'Giảm 20% chân nguyên tiêu hao khi xuất chiêu'
      }
    ],
    rarity: 'lam',
    badgeColor: 'emerald'
  },

  /**
   * Tier 3 (On-Hit Proc): Phong Nhận Trận
   * 25% tỷ lệ phóng kiếm khí gây thêm 40% ATK sát thương.
   */
  phong_nhan_tran: {
    id: 'phong_nhan_tran',
    name: 'Phong Nhận Trận',
    vietnameseName: 'Phong Nhận Liệt Không Trận',
    tier: 3,
    triggerType: 'on_hit_proc',
    description: '25% tỷ lệ phóng kiếm khí gây thêm 40% ATK sát thương.',
    lore: 'Trận văn phong hệ ngưng tụ cuồng phong thành lưỡi đao vô hình, kích phát bất ngờ khi kiếm phong chạm đích.',
    requiredDivineSense: 250,
    requiredMaterials: [
      { id: 'linh_muc_trung_pham', name: 'Trung Phẩm Linh Mực', quantity: 3, itemCategory: 'material' },
      { id: 'phong_ngung_sa', name: 'Phong Ngưng Sa', quantity: 4, itemCategory: 'material' }
    ],
    effects: [
      {
        id: 'eff_phong_nhan_tran_proc',
        name: 'Phong Nhận Liệt Không',
        triggerType: 'on_hit_proc',
        chance: 0.25,
        statKey: 'bonusAtkDamagePercent',
        value: 0.40,
        description: '25% tỷ lệ phóng kiếm khí gây thêm 40% ATK sát thương'
      }
    ],
    rarity: 'tim',
    badgeColor: 'cyan'
  },

  /**
   * Tier 5 (Emergency Shield): Bát Quái Hộ Thân Trận
   * Khi HP < 30%, chặn 1 đòn chí mạng và tạo khiên 20% Max HP (1 lần/trận).
   */
  bat_quai_ho_than: {
    id: 'bat_quai_ho_than',
    name: 'Bát Quái Hộ Thân Trận',
    vietnameseName: 'Bát Quái Hộ Mệnh Trận',
    tier: 5,
    triggerType: 'emergency_shield',
    description: 'Khi HP < 30%, chặn 1 đòn chí mạng và tạo khiên 20% Max HP (1 lần/trận).',
    lore: 'Trận văn khắc sâu bát quái đồ trận, tự động hộ chủ khi sinh tử ngàn cân treo sợi tóc, hóa giải sát kiếp.',
    requiredDivineSense: 600,
    requiredMaterials: [
      { id: 'linh_muc_thuong_pham', name: 'Thượng Phẩm Linh Mực', quantity: 3, itemCategory: 'material' },
      { id: 'huyen_quy_sa', name: 'Huyền Quy Sa', quantity: 5, itemCategory: 'material' }
    ],
    effects: [
      {
        id: 'eff_bat_quai_ho_than_shield',
        name: 'Bát Quái Kim Cương Hộ Mệnh',
        triggerType: 'emergency_shield',
        thresholdHpPercent: 0.30,
        shieldHpPercent: 0.20,
        maxTriggersPerBattle: 1,
        value: 0.20,
        description: 'Khi HP < 30%, chặn 1 đòn chí mạng và tạo khiên 20% Max HP (1 lần/trận)'
      }
    ],
    rarity: 'kim',
    badgeColor: 'amber'
  },

  /**
   * Tier 6 (Crowd Control): Cửu Tiêu Lôi Trận
   * 15% cơ hội gọi sét gây choáng 1 lượt.
   */
  cuu_tieu_loi_tran: {
    id: 'cuu_tieu_loi_tran',
    name: 'Cửu Tiêu Lôi Trận',
    vietnameseName: 'Cửu Tiêu Thần Lôi Trận',
    tier: 6,
    triggerType: 'crowd_control',
    description: '15% cơ hội gọi sét gây choáng 1 lượt.',
    lore: 'Dẫn dụ lôi đình cửu thiên phong ấn vào thân khí, mỗi kích đều có xác suất làm tê liệt nguyên thần đối phương.',
    requiredDivineSense: 1000,
    requiredMaterials: [
      { id: 'linh_muc_cuc_pham', name: 'Cực Phẩm Linh Mực', quantity: 4, itemCategory: 'material' },
      { id: 'loi_tinh_sa', name: 'Lôi Tinh Sa', quantity: 6, itemCategory: 'material' }
    ],
    effects: [
      {
        id: 'eff_cuu_tieu_loi_tran_cc',
        name: 'Cửu Tiêu Thần Lôi Cố Định',
        triggerType: 'crowd_control',
        chance: 0.15,
        durationTurns: 1,
        value: 1,
        description: '15% cơ hội gọi thiên lôi giáng thế gây choáng 1 lượt'
      }
    ],
    rarity: 'than',
    badgeColor: 'purple'
  },

  /**
   * Tier 7 (Vampiric): Huyết Sát Phệ Huyết Trận
   * Chuyển hóa 12% sát thương thành hồi phục HP.
   */
  huyet_sat_the_huyet: {
    id: 'huyet_sat_the_huyet',
    name: 'Huyết Sát Phệ Huyết Trận',
    vietnameseName: 'Huyết Sát Ma Văn Trận',
    tier: 7,
    triggerType: 'vampiric_lifesteal',
    description: 'Chuyển hóa 12% sát thương thành hồi phục HP.',
    lore: 'Ma đạo cổ trận dĩ sát dưỡng thương, hấp thu huyết khí của địch nhân chuyển hóa thành sinh mệnh lực bồi đắp nhục thân.',
    requiredDivineSense: 1500,
    requiredMaterials: [
      { id: 'huyet_linh_muc', name: 'Huyết Linh Mực', quantity: 5, itemCategory: 'material' },
      { id: 'sat_hon_sa', name: 'Sát Hồn Sa', quantity: 8, itemCategory: 'material' }
    ],
    effects: [
      {
        id: 'eff_huyet_sat_the_huyet_vamp',
        name: 'Huyết Ma Phệ Huyết',
        triggerType: 'vampiric_lifesteal',
        statKey: 'lifestealPercent',
        value: 0.12,
        description: 'Chuyển hóa 12% sát thương gây ra thành hồi phục HP'
      }
    ],
    rarity: 'than',
    badgeColor: 'rose'
  }
};

// ============================================================================
// 2. PURE FUNCTION: rollWeaponConduits
// ============================================================================

/**
 * Đổ xúc xắc mở Mạch Dẫn Linh (Conduit Slots) khi đúc khí hoặc khai quang
 * - Số slot nằm nghiêm ngặt từ 1 đến 4.
 * - Cảnh giới thợ rèn (blacksmithRealmIndex) và Độ tinh khiết hợp kim (alloyPurity) càng cao
 *   thì tỷ lệ mở 3 - 4 slot càng lớn.
 * - Dị hỏa (flameTier) mang lại phụ gia mở thêm slot.
 * - Khởi tạo mảng conduits với các slot ban đầu có `isUnlocked: true`, `inscribedFormationId: null`, `currentEffects: []`.
 * - Hỗ trợ deterministic randomFn phục vụ unit test.
 */
export function rollWeaponConduits(
  blacksmithRealmIndex: number,
  alloyPurity: number,
  flameTier?: number,
  randomFn: () => number = Math.random
): WeaponInscriptionMetadata {
  const safePurity = Math.max(70, Math.min(100, Number(alloyPurity) || 70));
  const safeRealm = Math.max(0, Math.min(15, Number(blacksmithRealmIndex) || 0));
  const safeFlame = Math.max(0, Math.min(10, Number(flameTier) || 0));

  // Trọng số tính điểm tiềm năng mạch dẫn (Composite Conduit Score: 0.0 -> 1.0)
  const purityFactor = ((safePurity - 70) / 30) * 0.50; // max 0.50
  const realmFactor = (Math.min(10, safeRealm) / 10) * 0.35; // max 0.35
  const flameFactor = (Math.min(10, safeFlame) / 10) * 0.15; // max 0.15
  const score = Math.max(0, Math.min(1.0, purityFactor + realmFactor + flameFactor));

  // Phân bổ trọng số theo điểm tiềm năng:
  // - Điểm thấp (score ~ 0): chủ yếu 1 slot (65%), 2 slot (30%), 3 slot (5%), 4 slot (0%)
  // - Điểm trung (score ~ 0.5): 1 slot (15%), 2 slot (45%), 3 slot (30%), 4 slot (10%)
  // - Điểm cao (score ~ 1.0): 1 slot (0%), 2 slot (10%), 3 slot (40%), 4 slot (50%)
  const w4 = Math.max(0, (score - 0.35) * 0.77);
  const w3 = score < 0.25 ? score * 0.20 : 0.12 + Math.min(score, 0.85) * 0.33;
  const w2 = Math.max(0.10, 0.50 - Math.abs(score - 0.50) * 0.40);
  const w1 = Math.max(0, 1.0 - (w2 + w3 + w4));

  const totalWeight = w1 + w2 + w3 + w4;
  const p1 = w1 / totalWeight;
  const p2 = p1 + (w2 / totalWeight);
  const p3 = p2 + (w3 / totalWeight);

  const roll = typeof randomFn === 'function' ? randomFn() : Math.random();
  let slotCount = 1;

  // Bất biến: Thợ rèn cấp cao (Hóa Thần trở lên, realm >= 4) kết hợp Hợp Kim tinh khiết cực phẩm (>= 95%)
  // luôn luôn đạt tối thiểu 3 hoặc 4 Mạch Dẫn Linh
  if (safeRealm >= 4 && safePurity >= 95) {
    const chance4 = score >= 0.75 ? 0.60 : 0.45;
    slotCount = roll < (1 - chance4) ? 3 : 4;
  } else {
    if (roll < p1) {
      slotCount = 1;
    } else if (roll < p2) {
      slotCount = 2;
    } else if (roll < p3) {
      slotCount = 3;
    } else {
      slotCount = 4;
    }
  }

  // Đảm bảo slotCount nằm nghiêm ngặt trong đoạn [1, 4]
  slotCount = Math.max(1, Math.min(4, slotCount));

  // Khởi tạo danh sách các ô mạch dẫn linh đã mở khóa ban đầu
  const conduits: InscriptionConduitSlot[] = [];
  for (let i = 0; i < slotCount; i++) {
    conduits.push({
      slotIndex: i,
      isUnlocked: true,
      inscribedFormationId: null,
      inscribedFormationName: undefined,
      inscribedAt: undefined,
      currentEffects: []
    });
  }

  return {
    totalSlots: slotCount,
    unlockedSlots: slotCount,
    maxSlots: 4,
    conduits,
    inscribedCount: 0,
    lastInscribedAt: undefined
  };
}

// ============================================================================
// 3. PURE FUNCTION: validateInscriptionRequirements
// ============================================================================

/**
 * Trợ thủ trích xuất số lượng vật phẩm trong kho người chơi (hỗ trợ cả id, itemId và name)
 */
function getInventoryItemQuantity(inventory: any[], targetId: string, targetName?: string): number {
  if (!Array.isArray(inventory)) return 0;
  let total = 0;
  for (const item of inventory) {
    if (!item) continue;
    const matchId = item.id === targetId || item.itemId === targetId;
    const matchName = targetName && item.name === targetName;
    if (matchId || matchName) {
      const q = typeof item.quantity === 'number'
        ? item.quantity
        : (typeof item.count === 'number' ? item.count : 1);
      total += q;
    }
  }
  return total;
}

/**
 * Kiểm tra tính hợp lệ và điều kiện tiên quyết khi người chơi thực hiện khắc trận văn
 * - Kiểm tra Thần Thức >= requiredDivineSense.
 * - Kiểm tra đủ số lượng Linh Mực/Trận Sa trong túi đồ.
 * - Anti-Dup Guard: Kiểm tra formation.id đã tồn tại trên bất kỳ slot nào của trang bị chưa.
 * - Kiểm tra còn slot mạch dẫn linh trống và đã mở khóa.
 * - Pure Function: 100% không biến đổi dữ liệu đầu vào.
 */
export function validateInscriptionRequirements(
  playerDivineSense: number,
  playerInventory: any[],
  formation: FormationInscriptionConfig,
  currentSlots: InscriptionConduitSlot[]
): { valid: boolean; reason?: string } {
  // 1. Kiểm tra tham số cấu hình trận đồ
  if (!formation || !formation.id) {
    return { valid: false, reason: 'Trận đồ minh khắc không tồn tại hoặc dữ liệu cấu hình bị lỗi.' };
  }

  // 2. Kiểm tra danh sách slot mạch dẫn linh
  if (!Array.isArray(currentSlots) || currentSlots.length === 0) {
    return { valid: false, reason: 'Thần binh không có bất kỳ mạch dẫn linh nào để khắc trận văn.' };
  }

  // 3. Anti-Dup Guard: Tuyệt đối không cho phép khắc trùng cùng một trận đồ trên 1 vũ khí
  const alreadyInscribed = currentSlots.some(
    slot => slot && slot.isUnlocked && slot.inscribedFormationId === formation.id
  );
  if (alreadyInscribed) {
    return {
      valid: false,
      reason: `Trận văn [${formation.name}] đã được minh khắc trên một mạch dẫn linh khác của thần binh này. Mỗi trận đồ chỉ được khắc tối đa 1 lần!`
    };
  }

  // 4. Kiểm tra có ít nhất 1 slot mạch dẫn linh trống đã mở khóa
  const hasFreeSlot = currentSlots.some(
    slot => slot && slot.isUnlocked && !slot.inscribedFormationId
  );
  if (!hasFreeSlot) {
    return {
      valid: false,
      reason: 'Toàn bộ mạch dẫn linh đã mở khóa của thần binh đều đã được khắc trận văn. Hãy tẩy luyện hoặc mở thêm mạch mới.'
    };
  }

  // 5. Kiểm tra điểm Thần Thức của người chơi
  const currentDivineSense = typeof playerDivineSense === 'number' ? playerDivineSense : 0;
  if (currentDivineSense < formation.requiredDivineSense) {
    return {
      valid: false,
      reason: `Thần thức không đủ. Yêu cầu tối thiểu ${formation.requiredDivineSense} điểm thần thức (hiện có: ${currentDivineSense}).`
    };
  }

  // 6. Kiểm tra nguyên liệu trong túi đồ (Linh Mực, Trận Sa,...)
  if (Array.isArray(formation.requiredMaterials)) {
    for (const mat of formation.requiredMaterials) {
      const available = getInventoryItemQuantity(playerInventory, mat.id, mat.name);
      if (available < mat.quantity) {
        return {
          valid: false,
          reason: `Thiếu nguyên liệu [${mat.name}]: cần ${mat.quantity}, tồn kho hiện tại chỉ có ${available}.`
        };
      }
    }
  }

  return { valid: true };
}

// ============================================================================
// 4. PURE FUNCTION: cleanseConduitSlot
// ============================================================================

/**
 * Tẩy luyện (reset) một mạch dẫn linh về trạng thái nguyên bản
 * - Xóa trận văn đã khắc: inscribedFormationId = null, currentEffects = [].
 * - Pure Function: Trả về đối tượng slot mới, không mutate trực tiếp đối tượng cũ.
 */
export function cleanseConduitSlot(conduit: InscriptionConduitSlot): InscriptionConduitSlot {
  if (!conduit) {
    throw new Error('Mạch dẫn linh (conduit) đầu vào không hợp lệ.');
  }

  return {
    ...conduit,
    inscribedFormationId: null,
    inscribedFormationName: undefined,
    inscribedAt: undefined,
    currentEffects: []
  };
}

// ============================================================================
// 5. PURE FUNCTION: aggregateEquipmentInscriptions
// ============================================================================

/**
 * Quét toàn bộ trang bị đang mặc trên người nhân vật, trích xuất danh sách hiệu ứng trận văn
 * - Phân loại thành 2 nhóm:
 *   * passives: Hiệu ứng chỉ số bị động (triggerType === 'passive_stat')
 *   * procs: Hiệu ứng kích hoạt trong chiến đấu ('on_hit_proc', 'emergency_shield', 'crowd_control', 'vampiric_lifesteal')
 * - Pure Function: Trả về bản sao mới của mảng hiệu ứng, phục vụ Combat Engine.
 */
export function aggregateEquipmentInscriptions(equippedItems: Equipment[]): {
  passives: InscriptionEffect[];
  procs: InscriptionEffect[];
} {
  const passives: InscriptionEffect[] = [];
  const procs: InscriptionEffect[] = [];

  if (!Array.isArray(equippedItems) || equippedItems.length === 0) {
    return { passives, procs };
  }

  for (const item of equippedItems) {
    if (!item || !item.inscriptionData || !Array.isArray(item.inscriptionData.conduits)) {
      continue;
    }

    for (const slot of item.inscriptionData.conduits) {
      // Chỉ tính các slot đã mở khóa và có khắc trận văn
      if (!slot || !slot.isUnlocked || !slot.inscribedFormationId) {
        continue;
      }

      // Lấy danh sách hiệu ứng từ slot, nếu slot trống thì fallback về registry
      let effects = slot.currentEffects;
      if (!Array.isArray(effects) || effects.length === 0) {
        const config = FORMATION_INSCRIPTIONS_REGISTRY[slot.inscribedFormationId];
        if (config && Array.isArray(config.effects)) {
          effects = config.effects;
        }
      }

      if (Array.isArray(effects)) {
        for (const effect of effects) {
          if (!effect || !effect.triggerType) continue;
          if (effect.triggerType === 'passive_stat') {
            passives.push({ ...effect });
          } else {
            procs.push({ ...effect });
          }
        }
      }
    }
  }

  return { passives, procs };
}

// ============================================================================
// 6. BỔ TRỢ PURE FUNCTIONS: Inscribe & Inventory Deduction
// ============================================================================

/**
 * Minh khắc một Trận Đồ vào một Mạch Dẫn Linh cụ thể
 * - Pure Function: Trả về đối tượng slot mới đã khắc trận văn và gắn đầy đủ hiệu ứng.
 */
export function inscribeFormationToConduit(
  conduit: InscriptionConduitSlot,
  formation: FormationInscriptionConfig,
  timestamp: number = Date.now()
): InscriptionConduitSlot {
  if (!conduit.isUnlocked) {
    throw new Error(`Mạch dẫn linh số ${conduit.slotIndex + 1} chưa được mở khóa.`);
  }

  return {
    ...conduit,
    inscribedFormationId: formation.id,
    inscribedFormationName: formation.name,
    inscribedAt: timestamp,
    currentEffects: formation.effects.map(e => ({ ...e }))
  };
}

/**
 * Minh khắc trận văn vào một vị trí slot cụ thể trên metadata trang bị
 * - Pure Function: Trả về bản sao mới của WeaponInscriptionMetadata.
 */
export function inscribeFormationToWeapon(
  metadata: WeaponInscriptionMetadata,
  targetSlotIndex: number,
  formation: FormationInscriptionConfig,
  timestamp: number = Date.now()
): WeaponInscriptionMetadata {
  if (!metadata || !Array.isArray(metadata.conduits)) {
    throw new Error('Dữ liệu mạch dẫn linh trên trang bị không hợp lệ.');
  }

  const targetSlot = metadata.conduits.find(c => c.slotIndex === targetSlotIndex);
  if (!targetSlot) {
    throw new Error(`Không tìm thấy mạch dẫn linh số ${targetSlotIndex}.`);
  }

  if (!targetSlot.isUnlocked) {
    throw new Error(`Mạch dẫn linh số ${targetSlotIndex + 1} hiện đang bị phong ấn.`);
  }

  const updatedConduits = metadata.conduits.map(c => {
    if (c.slotIndex === targetSlotIndex) {
      return inscribeFormationToConduit(c, formation, timestamp);
    }
    return { ...c };
  });

  const activeInscriptions = updatedConduits.filter(c => c.isUnlocked && c.inscribedFormationId);

  return {
    ...metadata,
    conduits: updatedConduits,
    inscribedCount: activeInscriptions.length,
    lastInscribedAt: timestamp
  };
}

/**
 * Tẩy luyện một mạch dẫn linh trên metadata trang bị
 * - Pure Function: Trả về bản sao mới của WeaponInscriptionMetadata.
 */
export function cleanseWeaponConduit(
  metadata: WeaponInscriptionMetadata,
  targetSlotIndex: number
): WeaponInscriptionMetadata {
  if (!metadata || !Array.isArray(metadata.conduits)) {
    throw new Error('Dữ liệu mạch dẫn linh trên trang bị không hợp lệ.');
  }

  const updatedConduits = metadata.conduits.map(c => {
    if (c.slotIndex === targetSlotIndex) {
      return cleanseConduitSlot(c);
    }
    return { ...c };
  });

  const activeInscriptions = updatedConduits.filter(c => c.isUnlocked && c.inscribedFormationId);

  return {
    ...metadata,
    conduits: updatedConduits,
    inscribedCount: activeInscriptions.length
  };
}

/**
 * Khấu trừ nguyên liệu khắc trận từ túi đồ theo nguyên tắc Atomic
 * - Pure Function: Trả về danh sách kho đồ mới đã khấu trừ.
 */
export function deductInscriptionMaterials<T extends { id: string; name?: string; quantity?: number; count?: number }>(
  inventory: T[],
  requiredMaterials: FormationInscriptionMaterial[]
): T[] {
  // 1. Kiểm tra tồn kho trước khi khấu trừ (Atomic Pre-Check)
  for (const mat of requiredMaterials) {
    const available = getInventoryItemQuantity(inventory, mat.id, mat.name);
    if (available < mat.quantity) {
      throw new Error(`Không đủ nguyên liệu [${mat.name}]: cần ${mat.quantity}, tồn kho có ${available}!`);
    }
  }

  // 2. Khấu trừ an toàn
  const remainingDeductions = new Map<string, number>();
  for (const mat of requiredMaterials) {
    remainingDeductions.set(mat.id, mat.quantity);
  }

  return inventory.map(item => {
    if (!item) return item;
    const needed = remainingDeductions.get(item.id) ?? (item.name ? remainingDeductions.get(item.name) : undefined);
    if (!needed || needed <= 0) {
      return { ...item };
    }

    const currentQty = typeof item.quantity === 'number'
      ? item.quantity
      : (typeof item.count === 'number' ? item.count : 1);

    const deductAmount = Math.min(currentQty, needed);
    const newQty = currentQty - deductAmount;
    remainingDeductions.set(item.id, needed - deductAmount);

    return {
      ...item,
      quantity: newQty,
      count: newQty
    };
  });
}
