/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/migrations/migrate-forging.ts
// Module Chuẩn Hóa & Di Trú Dữ Liệu Phân Hệ Khí Đạo (Forging Migration Subsystem)
// Trích xuất từ lib/save-migration.ts — Giữ nguyên 100% logic, key names & fallback mặc định

import { PlayerState, PlayerStats } from '@/lib/types';

// ============================================================================
// 1. MIGRATION ĐOÁN CỐT HỢP KIM & PHÔI KHÍ (MODULAR METALLURGY)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Đoán Cốt Hợp Kim & Tự Chọn Phôi Khí (Modular Metallurgy & Weapon Archetypes)":
 * - Khởi tạo an toàn player.modularMetallurgyState nếu chưa tồn tại:
 *   {
 *     craftedWeaponsCount: 0,
 *     unlockedArchetypes: ['phi_kiem', 'trong_kiem', 'bao_dinh', 'tran_ky'],
 *     metallurgyHistory: []
 *   }
 * - Quét qua toàn bộ player.inventory và player.equipment: gán alloyMetadata = null nếu chưa có, bảo toàn đồ cũ.
 * - Đảm bảo tính lũy đẳng (Idempotent): thực thi nhiều lần trên cùng 1 save không làm thay đổi trạng thái dữ liệu.
 */
export function migrateModularForgingData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Khởi tạo an toàn nếu chưa tồn tại
  if (!cloned.modularMetallurgyState || typeof cloned.modularMetallurgyState !== 'object') {
    cloned.modularMetallurgyState = {
      craftedWeaponsCount: 0,
      unlockedArchetypes: ['phi_kiem', 'trong_kiem', 'bao_dinh', 'tran_ky'],
      metallurgyHistory: []
    };
  } else {
    const rawState = cloned.modularMetallurgyState as any;
    cloned.modularMetallurgyState = {
      craftedWeaponsCount: typeof rawState.craftedWeaponsCount === 'number'
        ? Math.max(0, rawState.craftedWeaponsCount)
        : (typeof rawState.forgeCount === 'number' ? Math.max(0, rawState.forgeCount) : 0),
      unlockedArchetypes: Array.isArray(rawState.unlockedArchetypes) && rawState.unlockedArchetypes.length > 0
        ? Array.from(new Set(rawState.unlockedArchetypes))
        : ['phi_kiem', 'trong_kiem', 'bao_dinh', 'tran_ky'],
      metallurgyHistory: Array.isArray(rawState.metallurgyHistory)
        ? rawState.metallurgyHistory.filter((h: any) => h && typeof h === 'object')
        : []
    };
  }

  // 2. Helper gán alloyMetadata: null nếu chưa có
  const normalizeEquipmentAlloy = (item: any) => {
    if (!item || typeof item !== 'object') return item;
    return {
      ...item,
      alloyMetadata: item.alloyMetadata !== undefined ? item.alloyMetadata : null
    };
  };

  // 3. Quét qua toàn bộ player.equipment & player.equippedEquipment
  if (cloned.equipment && typeof cloned.equipment === 'object') {
    if (Array.isArray(cloned.equipment)) {
      cloned.equipment = cloned.equipment.map(normalizeEquipmentAlloy) as any;
    } else {
      const eqMap = cloned.equipment as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentAlloy(equip);
      }
      cloned.equipment = updatedMap as any;
    }
  }

  if (cloned.equippedEquipment && typeof cloned.equippedEquipment === 'object') {
    const rawEquipped = cloned.equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      cloned.equippedEquipment = rawEquipped.map(normalizeEquipmentAlloy);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentAlloy(equip);
      }
      cloned.equippedEquipment = updatedMap;
    }
  }

  // 4. Quét qua toàn bộ player.inventory
  if (cloned.inventory && typeof cloned.inventory === 'object') {
    if (Array.isArray(cloned.inventory.equipment)) {
      cloned.inventory.equipment = cloned.inventory.equipment.map(normalizeEquipmentAlloy);
    }
    if (Array.isArray(cloned.inventory.equipments)) {
      cloned.inventory.equipments = cloned.inventory.equipments.map(normalizeEquipmentAlloy);
    }
  }

  return cloned;
}

// ============================================================================
// 2. MIGRATION MINH KHẮC TRẬN VĂN (FORMATION INSCRIPTION)
// ============================================================================

/**
 * Migration an toàn phân hệ Minh Khắc Trận Văn & Mạch Dẫn Linh (Formation Inscription)
 * - Khởi tạo an toàn cấu trúc player.inscriptionState nếu chưa có:
 *   {
 *     totalInscribedCount: 0,
 *     unlockedInscriptions: ['tu_khi_tran', 'phong_nhan_tran'],
 *     cleansingWaterCount: player.inscriptionState?.cleansingWaterCount ?? 5
 *   }
 * - Quét qua player.inventory và player.equipment: Nếu trang bị là vũ khí/pháp bảo chưa có inscriptionData, gán an toàn:
 *   inscriptionData: {
 *     maxConduits: 2,
 *     totalSlots: 2,
 *     unlockedSlots: 2,
 *     inscribedCount: 0,
 *     conduits: [
 *       { slotIndex: 0, isUnlocked: true, inscribedFormationId: null, currentEffects: [] },
 *       { slotIndex: 1, isUnlocked: true, inscribedFormationId: null, currentEffects: [] }
 *     ]
 *   }
 * - Đảm bảo tính lũy đẳng (Idempotent): Chạy nhiều lần không làm hỏng dữ liệu.
 */
export function migrateFormationInscriptionData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Khởi tạo an toàn player.inscriptionState nếu chưa có
  cloned.inscriptionState = cloned.inscriptionState ?? {
    totalInscribedCount: 0,
    unlockedInscriptions: ['tu_khi_tran', 'phong_nhan_tran'],
    cleansingWaterCount: cloned.inscriptionState?.cleansingWaterCount ?? 5
  };

  // Đảm bảo cấu trúc các trường bên trong inscriptionState
  if (!Array.isArray(cloned.inscriptionState.unlockedInscriptions) || cloned.inscriptionState.unlockedInscriptions.length === 0) {
    cloned.inscriptionState.unlockedInscriptions = ['tu_khi_tran', 'phong_nhan_tran'];
  } else {
    cloned.inscriptionState.unlockedInscriptions = Array.from(new Set(cloned.inscriptionState.unlockedInscriptions));
  }
  if (typeof cloned.inscriptionState.totalInscribedCount !== 'number') {
    cloned.inscriptionState.totalInscribedCount = 0;
  }
  if (typeof cloned.inscriptionState.cleansingWaterCount !== 'number') {
    cloned.inscriptionState.cleansingWaterCount = 5;
  }

  // 2. Helper nhận diện vũ khí / pháp bảo
  const isWeaponOrArtifact = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;
    const slot = String(item.slot || item.type || item.category || '').toLowerCase();
    return slot.includes('weapon') || slot.includes('artifact') || slot === 'vu_khi' || slot === 'phap_bao';
  };

  // 3. Helper gán an toàn inscriptionData cho trang bị
  const normalizeEquipmentInscription = (item: any) => {
    if (!item || typeof item !== 'object') return item;
    if (isWeaponOrArtifact(item) && !item.inscriptionData) {
      return {
        ...item,
        inscriptionData: {
          maxConduits: 2,
          totalSlots: 2,
          unlockedSlots: 2,
          inscribedCount: 0,
          conduits: [
            { slotIndex: 0, isUnlocked: true, inscribedFormationId: null, currentEffects: [] },
            { slotIndex: 1, isUnlocked: true, inscribedFormationId: null, currentEffects: [] }
          ]
        }
      };
    }
    return item;
  };

  // 4. Quét qua player.equipment & player.equippedEquipment
  if (cloned.equipment && typeof cloned.equipment === 'object') {
    if (Array.isArray(cloned.equipment)) {
      cloned.equipment = cloned.equipment.map(normalizeEquipmentInscription) as any;
    } else {
      const eqMap = cloned.equipment as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentInscription(equip);
      }
      cloned.equipment = updatedMap as any;
    }
  }

  if (cloned.equippedEquipment && typeof cloned.equippedEquipment === 'object') {
    const rawEquipped = cloned.equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      cloned.equippedEquipment = rawEquipped.map(normalizeEquipmentInscription);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentInscription(equip);
      }
      cloned.equippedEquipment = updatedMap;
    }
  }

  // 5. Quét qua player.inventory
  if (cloned.inventory && typeof cloned.inventory === 'object') {
    if (Array.isArray(cloned.inventory)) {
      cloned.inventory = (cloned.inventory as any[]).map(normalizeEquipmentInscription) as any;
    } else {
      if (Array.isArray(cloned.inventory.equipment)) {
        cloned.inventory.equipment = cloned.inventory.equipment.map(normalizeEquipmentInscription);
      }
      if (Array.isArray(cloned.inventory.equipments)) {
        cloned.inventory.equipments = cloned.inventory.equipments.map(normalizeEquipmentInscription);
      }
      if (Array.isArray(cloned.inventory.items)) {
        cloned.inventory.items = cloned.inventory.items.map(normalizeEquipmentInscription);
      }
    }
  }

  return cloned;
}

// ============================================================================
// 3. MIGRATION TRÙNG CHÚ TÁI SINH & HUYẾT KHẾ (LEGACY TEMPERING & BLOOD BOND)
// ============================================================================

/**
 * Khởi tạo / đồng bộ an toàn dữ liệu Huyết Khế & Trùng Chú cho save game cũ.
 * Idempotent: chạy nhiều lần không làm hỏng dữ liệu đã tồn tại.
 */
export function migrateLegacyTemperingData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Khởi tạo an toàn legacyTemperingState
  const existing = cloned.legacyTemperingState;
  cloned.legacyTemperingState = {
    totalReforgesPerformed:
      typeof existing?.totalReforgesPerformed === 'number'
        ? existing.totalReforgesPerformed
        : 0,
    bloodBoundEquipmentIds: Array.isArray(existing?.bloodBoundEquipmentIds)
      ? existing.bloodBoundEquipmentIds
      : []
  };

  // 2. Helper chuẩn hóa trang bị: gán bloodBondData = null, reforgeCount = 0 nếu chưa có
  const normalizeEquipBloodBond = (item: any) => {
    if (!item || typeof item !== 'object') return item;
    const isEquip = Boolean(
      item.slot || item.type === 'weapon' || item.type === 'armor' ||
      item.type === 'artifact' || item.powerBonus !== undefined
    );
    if (!isEquip) return item;
    return {
      ...item,
      bloodBondData: item.bloodBondData !== undefined ? item.bloodBondData : null,
      reforgeCount: typeof item.reforgeCount === 'number' ? item.reforgeCount : 0
    };
  };

  // 3. Quét player.equipment (object map hoặc array)
  if (cloned.equipment && typeof cloned.equipment === 'object') {
    if (Array.isArray(cloned.equipment)) {
      cloned.equipment = (cloned.equipment as any[]).map(normalizeEquipBloodBond) as any;
    } else {
      const eqMap = cloned.equipment as Record<string, any>;
      const updated: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updated[key] = normalizeEquipBloodBond(equip);
      }
      cloned.equipment = updated as any;
    }
  }

  // 4. Quét player.equippedEquipment (tương thích ngược)
  if (cloned.equippedEquipment && typeof cloned.equippedEquipment === 'object') {
    const rawEq = cloned.equippedEquipment;
    if (Array.isArray(rawEq)) {
      cloned.equippedEquipment = rawEq.map(normalizeEquipBloodBond);
    } else {
      const updated: Record<string, any> = {};
      for (const [key, equip] of Object.entries(rawEq as Record<string, any>)) {
        updated[key] = normalizeEquipBloodBond(equip);
      }
      cloned.equippedEquipment = updated;
    }
  }

  // 5. Quét player.inventory
  if (cloned.inventory && typeof cloned.inventory === 'object') {
    if (Array.isArray(cloned.inventory)) {
      cloned.inventory = (cloned.inventory as any[]).map(normalizeEquipBloodBond) as any;
    } else {
      if (Array.isArray(cloned.inventory.equipment)) {
        cloned.inventory.equipment = cloned.inventory.equipment.map(normalizeEquipBloodBond);
      }
      if (Array.isArray(cloned.inventory.equipments)) {
        cloned.inventory.equipments = cloned.inventory.equipments.map(normalizeEquipBloodBond);
      }
      if (Array.isArray(cloned.inventory.items)) {
        cloned.inventory.items = cloned.inventory.items.map(normalizeEquipBloodBond);
      }
    }
  }

  return cloned;
}

// ============================================================================
// 4. MIGRATION PHONG HỒN ĐOẠT PHÁCH & KHÍ LINH (SOUL INFUSION & SPIRIT AWAKENING)
// ============================================================================

/**
 * Migration an toàn cho phân hệ Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion & Artifact Spirit Awakening)
 * - Khởi tạo an toàn player.soulInfusionState nếu chưa có.
 * - Quét qua player.inventory, player.equipment, và player.natalArtifact:
 *   gán an toàn infusedSoul: item.infusedSoul ?? null cho tất cả trang bị cũ.
 * - Đảm bảo tính Idempotent: chạy nhiều lần không làm hỏng dữ liệu.
 */
export function migrateSoulInfusionData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Khởi tạo an toàn player.soulInfusionState
  const existingSoulState = cloned.soulInfusionState as any;
  cloned.soulInfusionState = {
    harvestedSouls: (existingSoulState?.harvestedSouls && typeof existingSoulState.harvestedSouls === 'object')
      ? existingSoulState.harvestedSouls
      : {},
    totalInfusionsPerformed: typeof existingSoulState?.totalInfusionsPerformed === 'number'
      ? existingSoulState.totalInfusionsPerformed
      : 0,
    unlockedSpiritLore: Array.isArray(existingSoulState?.unlockedSpiritLore)
      ? existingSoulState.unlockedSpiritLore
      : [],
    totalSoulsInfused: typeof existingSoulState?.totalSoulsInfused === 'number'
      ? existingSoulState.totalSoulsInfused
      : 0,
    highestStageReached: existingSoulState?.highestStageReached ?? 1,
    unlockedSoulTypes: Array.isArray(existingSoulState?.unlockedSoulTypes)
      ? existingSoulState.unlockedSoulTypes
      : []
  };

  // 2. Helper nhận diện trang bị và chuẩn hóa infusedSoul
  const normalizeEquipmentSoul = (item: any) => {
    if (!item || typeof item !== 'object') return item;
    const isEquip = Boolean(
      item.slot ||
      item.type === 'weapon' ||
      item.type === 'armor' ||
      item.type === 'artifact' ||
      item.powerBonus !== undefined
    );
    if (isEquip) {
      return {
        ...item,
        infusedSoul: item.infusedSoul !== undefined ? item.infusedSoul : null
      };
    }
    return item;
  };

  // 3. Quét qua player.equipment & player.equippedEquipment & player.equippedItems
  if (cloned.equipment && typeof cloned.equipment === 'object') {
    if (Array.isArray(cloned.equipment)) {
      cloned.equipment = cloned.equipment.map(normalizeEquipmentSoul) as any;
    } else {
      const eqMap = cloned.equipment as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentSoul(equip);
      }
      cloned.equipment = updatedMap as any;
    }
  }

  if (cloned.equippedEquipment && typeof cloned.equippedEquipment === 'object') {
    const rawEquipped = cloned.equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      cloned.equippedEquipment = rawEquipped.map(normalizeEquipmentSoul);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentSoul(equip);
      }
      cloned.equippedEquipment = updatedMap;
    }
  }

  if (cloned.equippedItems && typeof cloned.equippedItems === 'object') {
    const eqMap = cloned.equippedItems as Record<string, any>;
    const updatedMap: Record<string, any> = {};
    for (const [key, equip] of Object.entries(eqMap)) {
      updatedMap[key] = normalizeEquipmentSoul(equip);
    }
    cloned.equippedItems = updatedMap as any;
  }

  // 4. Quét qua player.inventory
  if (cloned.inventory && typeof cloned.inventory === 'object') {
    if (Array.isArray(cloned.inventory)) {
      cloned.inventory = (cloned.inventory as any[]).map(normalizeEquipmentSoul) as any;
    } else {
      if (Array.isArray(cloned.inventory.equipment)) {
        cloned.inventory.equipment = cloned.inventory.equipment.map(normalizeEquipmentSoul);
      }
      if (Array.isArray(cloned.inventory.equipments)) {
        cloned.inventory.equipments = cloned.inventory.equipments.map(normalizeEquipmentSoul);
      }
      if (Array.isArray(cloned.inventory.items)) {
        cloned.inventory.items = cloned.inventory.items.map(normalizeEquipmentSoul);
      }
    }
  }

  // 5. Quét qua player.natalArtifact
  if (cloned.natalArtifact && typeof cloned.natalArtifact === 'object') {
    if (cloned.natalArtifact.baseEquipment) {
      cloned.natalArtifact.baseEquipment = normalizeEquipmentSoul(cloned.natalArtifact.baseEquipment);
    }
    cloned.natalArtifact.infusedSoul = cloned.natalArtifact.infusedSoul !== undefined
      ? cloned.natalArtifact.infusedSoul
      : (cloned.natalArtifact.baseEquipment?.infusedSoul ?? null);
  }

  return cloned;
}

// ============================================================================
// 5. MIGRATION KHÍ LÔI KIẾP & TRẬN KHÍ TÙY THÂN (WEAPON TRIBULATION & ARRAYS)
// ============================================================================

/**
 * Migration an toàn cho phân hệ "Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân" (Weapon Tribulation & Orbiting Array Sets)
 * - Khởi tạo an toàn cấu trúc player.formationSetsState nếu chưa có:
 *   {
 *     ownedSets: {},
 *     equippedArraySetId: null,
 *     tribulationHistory: []
 *   }
 * - Quét qua player.inventory và player.equipment: gán an toàn lightningTempering: item.lightningTempering ?? null cho tất cả trang bị cũ.
 * - Đảm bảo tính Idempotent: chạy nhiều lần không làm hỏng dữ liệu.
 */
export function migrateWeaponTribulationArrayData(player: any): any {
  if (!player) return player;

  const cloned = JSON.parse(JSON.stringify(player));

  // 1. Khởi tạo an toàn player.formationSetsState
  const existingFormationState = cloned.formationSetsState as any;
  cloned.formationSetsState = {
    ownedSets: (existingFormationState?.ownedSets && typeof existingFormationState.ownedSets === 'object')
      ? existingFormationState.ownedSets
      : {},
    equippedArraySetId: existingFormationState?.equippedArraySetId ?? null,
    tribulationHistory: Array.isArray(existingFormationState?.tribulationHistory)
      ? existingFormationState.tribulationHistory
      : []
  };

  // 2. Helper nhận diện trang bị và chuẩn hóa lightningTempering
  const normalizeEquipmentLightning = (item: any) => {
    if (!item || typeof item !== 'object') return item;
    const isEquip = Boolean(
      item.slot ||
      item.type === 'weapon' ||
      item.type === 'armor' ||
      item.type === 'boots' ||
      item.type === 'accessory' ||
      item.type === 'artifact' ||
      item.powerBonus !== undefined
    );
    if (isEquip) {
      return {
        ...item,
        lightningTempering: item.lightningTempering !== undefined ? item.lightningTempering : null
      };
    }
    return item;
  };

  // 3. Quét qua player.equipment & player.equippedEquipment & player.equippedItems
  if (cloned.equipment && typeof cloned.equipment === 'object') {
    if (Array.isArray(cloned.equipment)) {
      cloned.equipment = cloned.equipment.map(normalizeEquipmentLightning) as any;
    } else {
      const eqMap = cloned.equipment as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentLightning(equip);
      }
      cloned.equipment = updatedMap as any;
    }
  }

  if (cloned.equippedEquipment && typeof cloned.equippedEquipment === 'object') {
    const rawEquipped = cloned.equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      cloned.equippedEquipment = rawEquipped.map(normalizeEquipmentLightning);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentLightning(equip);
      }
      cloned.equippedEquipment = updatedMap;
    }
  }

  if (cloned.equippedItems && typeof cloned.equippedItems === 'object') {
    const eqMap = cloned.equippedItems as Record<string, any>;
    const updatedMap: Record<string, any> = {};
    for (const [key, equip] of Object.entries(eqMap)) {
      updatedMap[key] = normalizeEquipmentLightning(equip);
    }
    cloned.equippedItems = updatedMap as any;
  }

  // 4. Quét qua player.inventory
  if (cloned.inventory && typeof cloned.inventory === 'object') {
    if (Array.isArray(cloned.inventory)) {
      cloned.inventory = (cloned.inventory as any[]).map(normalizeEquipmentLightning) as any;
    } else {
      if (Array.isArray(cloned.inventory.equipment)) {
        cloned.inventory.equipment = cloned.inventory.equipment.map(normalizeEquipmentLightning);
      }
      if (Array.isArray(cloned.inventory.equipments)) {
        cloned.inventory.equipments = cloned.inventory.equipments.map(normalizeEquipmentLightning);
      }
      if (Array.isArray(cloned.inventory.items)) {
        cloned.inventory.items = cloned.inventory.items.map(normalizeEquipmentLightning);
      }
    }
  }

  // 5. Quét qua player.natalArtifact
  if (cloned.natalArtifact && typeof cloned.natalArtifact === 'object') {
    if (cloned.natalArtifact.baseEquipment) {
      cloned.natalArtifact.baseEquipment = normalizeEquipmentLightning(cloned.natalArtifact.baseEquipment);
    }
  }

  return cloned;
}

// ============================================================================
// 6. ORCHESTRATOR PHÂN HỆ KHÍ ĐẠO (NORMALIZE FORGING STATE)
// ============================================================================

/**
 * Chuẩn hóa toàn diện phân hệ Khí Đạo cho người chơi:
 * Gọi tuần tự các hàm di trú Khí Đạo theo thứ tự logic:
 * 1. migrateModularForgingData (Đoán cốt hợp kim & phôi khí)
 * 2. migrateFormationInscriptionData (Minh khắc trận văn & mạch dẫn linh)
 * 3. migrateLegacyTemperingData (Trùng chú tái sinh & huyết khế bản mệnh)
 * 4. migrateSoulInfusionData (Phong hồn đoạt phách & thức tỉnh khí linh)
 * 5. migrateWeaponTribulationArrayData (Khí lôi kiếp & bộ trận khí tùy thân)
 */
export function normalizeForgingState(player: PlayerState): PlayerState {
  if (!player) return player;

  let state = migrateModularForgingData(player);
  state = migrateFormationInscriptionData(state);
  state = migrateLegacyTemperingData(state);
  state = migrateSoulInfusionData(state);
  state = migrateWeaponTribulationArrayData(state);

  return state as PlayerState;
}
