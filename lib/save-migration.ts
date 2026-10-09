// lib/save-migration.ts
// Module chuyên trách Lưu trữ, Xác thực và Migration dữ liệu người chơi qua các phiên bản (v1 -> v7)

import {
  PlayerStats,
  DaoFoundationGrade,
  BreakthroughCatalystPlayerState,
  Physique,
  EquippedManualSlots,
  CompanionsDataState,
  CompanionPlayerState,
  ArtisanState,
  MerchantState,
  SectState,
  SectId,
  AchievementsState,
  StorylineState,
  SoulCultivationState,
  DestinySlotState,
  AbodeState,
  AbodePlotState,
  PhysiqueState,
  PhysiquePart,
  SoulState,
  ReincarnationState,
  AncestralState,
  PlayerDivineAbilitiesState,
  FormationItem,
  SanctuaryVeinTier,
  MutagenicAffixType,
  HeavenlyFlameState,
  FlameTier,
  PillTribulationState,
} from '@/lib/types';
import { PillVeinTier } from '@/lib/types/pill-veins';
import {
  MUTATION_HARD_CAPS,
  PILL_VEIN_CONFIG,
  calculateCompoundingToxicity
} from '@/lib/pill-vein-logic';
import { PILL_DEFINITIONS_MAP } from '@/lib/pill-tier-data';
import {
  createDefaultHeavenlyFlameState,
  HEAVENLY_FLAMES_REGISTRY
} from '@/lib/heavenly-flame-logic';
import {
  createDefaultAbodeState,
  createDefaultAbodePlots,
  SPIRIT_ARRAY_LEVELS
} from '@/lib/abode-data';
import {
  createDefaultPhysiqueState,
  createDefaultPhysiqueParts,
  PHYSIQUE_REALMS,
  REALM_BASE_STAGE_EXP
} from '@/lib/physique-system-data';
import {
  createDefaultSoulState,
  SOUL_REALMS,
  SOUL_STAGE_EXP_BASE,
  SOUL_RELICS_CATALOG
} from '@/lib/soul-data';
import { createDefaultAchievementsState } from '@/lib/achievements-data';
import { createDefaultStorylineState } from '@/lib/storyline-data';
import { autoCatchUpStorylineForHighRealm } from '@/lib/storyline-logic';
import { createDefaultPvPLadderState } from '@/lib/pvp-ladder-data';
import {
  createNewPlayer,
  getMaxKhiHuyet,
  getMaxLinhLuc
} from '@/lib/game-logic';
import { STARTER_GEMS } from '@/lib/forging-gem-data';
import { ensureEquipmentStructure } from '@/lib/forging-logic';
import {
  DEFAULT_DESTINY,
  DESTINY_FATES,
  calculateCombatStats,
  getDestinySlotMaxCount,
  createDefaultDestinyBoard,
  getActiveDestinySynergies
} from '@/lib/destiny-data';
import {
  createDefaultBodyRefinement,
  createDefaultSoulCultivation
} from '@/lib/body-soul-data';
import {
  LINH_DIEN_LEVELS,
  createDefaultLinhDien
} from '@/lib/garden-data';
import {
  SECT_DATA_MAP,
  SECT_PROFILES,
  createDefaultSectState,
  createDefaultGuardianArray,
  generateDailyQuests
} from '@/lib/sect-data';
import {
  getTierFromGrade
} from '@/lib/elemental-system';
import {
  createDefaultStorageBag,
  DEFAULT_STORAGE_BAGS,
  getMaxInventoryCapacity,
  ARTISAN_TITLES,
  ARTISAN_LEVEL_EXP,
  createDefaultArtisanState
} from '@/lib/inventory-data';
import {
  createDefaultMerchantState,
  generateMerchantInventory,
  sortMerchantItems
} from '@/lib/merchant-data';
import {
  convertGradeToGiai
} from '@/lib/item-quality-data';
import {
  COMPANIONS_DATA,
  createDefaultCompanionsState,
  createDefaultCompanionPlayerState
} from '@/lib/companions-data';
import { createDefaultTuViEmpowermentState } from '@/lib/tu-vi-empowerment-data';
import realmsData from '@/data/realms-data.json';

import { getBaseLifespanForRealm } from '@/lib/lifespan-logic';
import { getMaxDivineAbilitySlots } from '@/lib/divine-abilities-logic';
import { INITIAL_SPIRIT_MOUNTAINS, INITIAL_RIVAL_SECTS } from '@/lib/sect-war-logic';

export const STORAGE_KEY = 'tutien_tam_gioi_save_v7';

export const LEGACY_STORAGE_KEYS = [
  'tutien_tam_gioi_save_v6',
  'tutien_tam_gioi_save_v5',
  'tutien_tam_gioi_save_v4',
  'tutien_tam_gioi_save_v3',
  'tutien_tam_gioi_save_v2',
  'tutien_tam_gioi_save_v1'
];

/**
 * Gộp dồn các vật phẩm trùng id trong túi đồ
 */
export const mergeDuplicateInventoryItems = <T extends { id: string; quantity: number }>(arr: T[] = []): T[] => {
  const map = new Map<string, T>();
  for (const item of arr) {
    if (!item || !item.id || item.quantity <= 0) continue;
    if (map.has(item.id)) {
      const existing = map.get(item.id)!;
      existing.quantity += item.quantity;
    } else {
      map.set(item.id, { ...item });
    }
  }
  return Array.from(map.values());
};

/**
 * Chuẩn hóa và bảo đảm tính tương thích dữ liệu nhân vật v7 (kèm migration từ v1-v6)
 */
export const normalizePlayerData = (data: Partial<PlayerStats>): PlayerStats => {
  const base = createNewPlayer();
  const canCot = typeof data.canCot === 'number' ? data.canCot : base.canCot;
  const tamCanh = typeof data.tamCanh === 'number' ? data.tamCanh : base.tamCanh;
  const ngoTinh = typeof data.ngoTinh === 'number' ? data.ngoTinh : base.ngoTinh;
  
  // 1. Ép kiểu và kiểm tra biên chặt chẽ cho currentRealm (ngăn chặn triệt để string/NaN/undefined/âm)
  const safeRealm = Number.isInteger(Number(data.currentRealm))
    ? Math.max(0, Math.min(realmsData.length - 1, Number(data.currentRealm)))
    : 0;
  const currentRealm = safeRealm;

  const rawEquipment = data.equipment || data.equippedEquipment || {};
  const normalizedEquipment = {
    weapon: rawEquipment.weapon ? ensureEquipmentStructure({ ...rawEquipment.weapon, quality: rawEquipment.weapon.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.weapon.grade) }) : undefined,
    armor: rawEquipment.armor ? ensureEquipmentStructure({ ...rawEquipment.armor, quality: rawEquipment.armor.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.armor.grade) }) : undefined,
    boots: rawEquipment.boots ? ensureEquipmentStructure({ ...rawEquipment.boots, quality: rawEquipment.boots.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.boots.grade) }) : undefined,
    accessory: rawEquipment.accessory ? ensureEquipmentStructure({ ...rawEquipment.accessory, quality: rawEquipment.accessory.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.accessory.grade) }) : undefined,
    artifact: rawEquipment.artifact ? ensureEquipmentStructure({ ...rawEquipment.artifact, quality: rawEquipment.artifact.quality || 'thuong_pham', grade: convertGradeToGiai(rawEquipment.artifact.grade) }) : undefined
  };
  const equipment = normalizedEquipment;
  const manuals = data.manuals || [];

  // Chuẩn hóa Đa Thể Chất (physiques) & Thể chất đơn (physique)
  let physiques: Physique[] = [];
  if (data.physiques && Array.isArray(data.physiques) && data.physiques.length > 0) {
    physiques = data.physiques;
  } else if (data.physique) {
    physiques = [data.physique];
  } else {
    physiques = base.physiques || (base.physique ? [base.physique] : []);
  }
  const physique = physiques[0] || base.physique;
  const equippedManuals: EquippedManualSlots = data.equippedManuals || {};

  // Tự động gán slot công pháp nếu chưa có
  if (!equippedManuals.tamPhap) {
    const tp = manuals.find(m => m.type === 'tam_phap' && m.level > 0);
    if (tp) equippedManuals.tamPhap = tp.id;
  }
  if (!equippedManuals.theThuat) {
    const tt = manuals.find(m => m.type === 'the_thuat' && m.level > 0);
    if (tt) equippedManuals.theThuat = tt.id;
  }
  if (!equippedManuals.thanThong1) {
    const thanThongs = manuals.filter(m => m.type === 'than_thong' && m.level > 0);
    if (thanThongs[0]) equippedManuals.thanThong1 = thanThongs[0].id;
    if (thanThongs[1]) equippedManuals.thanThong2 = thanThongs[1].id;
  }

  // Chuẩn hóa Linh Căn
  let linhCan = data.linhCan || base.linhCan;
  if (linhCan && !linhCan.tier) {
    linhCan = {
      ...linhCan,
      tier: getTierFromGrade(linhCan.grade),
      purity: linhCan.purity ?? 40
    };
  }

  const destiny = data.destiny || base.destiny || DEFAULT_DESTINY;
  const maxDestinySlots = getDestinySlotMaxCount(currentRealm);
  const rawDestinyBoard = data.destinyBoard || createDefaultDestinyBoard(destiny.id);
  const destinyBoard: DestinySlotState = {
    unlockedSlots: Math.max(maxDestinySlots, rawDestinyBoard.unlockedSlots || 3),
    equippedIds: Array.isArray(rawDestinyBoard.equippedIds) && rawDestinyBoard.equippedIds.length > 0
      ? rawDestinyBoard.equippedIds.slice(0, maxDestinySlots)
      : [destiny.id],
    collectedIds: Array.isArray(rawDestinyBoard.collectedIds) && rawDestinyBoard.collectedIds.length > 0
      ? Array.from(new Set([...rawDestinyBoard.collectedIds, destiny.id]))
      : [destiny.id]
  };
  const activeSynergies = getActiveDestinySynergies(destinyBoard.equippedIds).map(s => s.id);
  const destinies = destinyBoard.equippedIds.map(id => DESTINY_FATES[id]).filter(Boolean);
  const bodyRefinement = data.bodyRefinement || createDefaultBodyRefinement();
  const rawSoul = data.soulCultivation || createDefaultSoulCultivation();
  const soulCultivation: SoulCultivationState = {
    ...rawSoul,
    currentStageIndex: typeof rawSoul.currentStageIndex === 'number'
      ? rawSoul.currentStageIndex
      : (typeof rawSoul.realmIndex === 'number' ? Math.min(rawSoul.realmIndex, 3) : 0),
    currentSubTier: typeof rawSoul.currentSubTier === 'number'
      ? rawSoul.currentSubTier
      : (typeof rawSoul.level === 'number' ? Math.min(Math.max(1, rawSoul.level), 9) : 1),
    currentExp: typeof rawSoul.currentExp === 'number' ? rawSoul.currentExp : 0,
    maxExp: typeof rawSoul.maxExp === 'number' ? rawSoul.maxExp : 100,
    realmIndex: typeof rawSoul.realmIndex === 'number' ? rawSoul.realmIndex : 0,
    level: typeof rawSoul.level === 'number' ? rawSoul.level : 1,
    expeditionState: rawSoul.expeditionState || null
  };

  const maxHP = getMaxKhiHuyet(
    canCot,
    currentRealm,
    normalizedEquipment,
    manuals,
    physiques,
    equippedManuals,
    linhCan,
    destiny,
    bodyRefinement,
    data.companionsState,
    data.physiqueState,
    data.tuViEmpowermentState,
    data.manualsState,
    data.beastsState
  );
  const maxMP = getMaxLinhLuc(tamCanh, ngoTinh, currentRealm, normalizedEquipment, manuals, equippedManuals, linhCan);

  // Tính toán lại bộ chỉ số chiến đấu
  const cStats = calculateCombatStats({
    ...base,
    ...data,
    canCot,
    tamCanh,
    ngoTinh,
    currentRealm,
    equipment: normalizedEquipment,
    equippedEquipment: normalizedEquipment,
    manuals,
    physique,
    physiques,
    linhCan,
    destiny,
    destinies,
    destinyBoard,
    equippedManuals,
    bodyRefinement,
    soulCultivation
  });

  const invPills = mergeDuplicateInventoryItems(
    (data.inventory?.pills || [])
      .filter((p: any) => p && typeof p.quantity === 'number' && p.quantity > 0)
      .map((p: any) => ({ ...p }))
  );

  // Chuẩn hóa Thọ Nguyên & Tuế Nguyệt
  const safeAge = typeof data.age === 'number' && data.age > 0 ? Number(data.age.toFixed(2)) : 16;
  const rawPillBonus = typeof data.lifespanPillsUsed === 'number' ? data.lifespanPillsUsed : 0;
  const baseLifespan = getBaseLifespanForRealm(currentRealm);
  const safeMaxLifespan = Math.max(baseLifespan + rawPillBonus, typeof data.maxLifespan === 'number' ? data.maxLifespan : baseLifespan);
  const isToaHoaWarning = (safeMaxLifespan - safeAge) < 5;

  // Chuẩn hóa Linh Điền
  let linhDien = data.linhDien;
  if (!linhDien) {
    linhDien = createDefaultLinhDien();
  } else {
    const currentPlots = [...linhDien.plots];
    const maxAllowed = LINH_DIEN_LEVELS[linhDien.level]?.maxPlots || 4;
    while (currentPlots.length < 6) {
      const id = currentPlots.length;
      currentPlots.push({
        id,
        isUnlocked: id < maxAllowed,
        seedId: null,
        plantedAt: null,
        harvestAt: null,
        readyToHarvest: false
      });
    }
    linhDien = { ...linhDien, plots: currentPlots };
  }

  // Chuẩn hóa Động Thiên Phúc Địa (Abode Core) & Di trú 12 Ô Đất
  let abodeState: AbodeState;
  const defaultAbode = createDefaultAbodeState();

  if (data.abodeState && typeof data.abodeState === 'object') {
    const rawAbode = data.abodeState;
    const plots: AbodePlotState[] = createDefaultAbodePlots().map((defaultPlot, idx) => {
      const existingPlot = rawAbode.plots && rawAbode.plots[idx];
      if (existingPlot) {
        return {
          ...defaultPlot,
          ...existingPlot,
          soilType: existingPlot.soilType || defaultPlot.soilType,
          unlocked: typeof existingPlot.unlocked === 'boolean' ? existingPlot.unlocked : defaultPlot.unlocked,
          seedId: existingPlot.seedId || null,
          plantedAt: existingPlot.plantedAt || null,
          harvestAt: existingPlot.harvestAt || null,
          fertilized: Boolean(existingPlot.fertilized)
        };
      }
      return defaultPlot;
    });

    const spiritLvl = Math.max(1, Math.min(10, rawAbode.spiritArray?.level || 1));
    const spiritConf = SPIRIT_ARRAY_LEVELS[spiritLvl] || SPIRIT_ARRAY_LEVELS[1];

    abodeState = {
      level: Math.max(1, Math.min(5, typeof rawAbode.level === 'number' ? rawAbode.level : 1)),
      spiritArray: {
        level: spiritLvl,
        tuViRateBonus: spiritConf.tuViRateBonus,
        autoHealBonus: spiritConf.autoHealBonus
      },
      plots,
      beastSanctuary: {
        roamingBeastIds: Array.isArray(rawAbode.beastSanctuary?.roamingBeastIds) ? rawAbode.beastSanctuary.roamingBeastIds : [],
        fertilizerStored: typeof rawAbode.beastSanctuary?.fertilizerStored === 'number' ? rawAbode.beastSanctuary.fertilizerStored : 1,
        lastFertilizerTick: rawAbode.beastSanctuary?.lastFertilizerTick || Date.now()
      },
      scripturePavilion: {
        showcasedManualIds: Array.isArray(rawAbode.scripturePavilion?.showcasedManualIds) ? rawAbode.scripturePavilion.showcasedManualIds : [],
        disciples: Array.isArray(rawAbode.scripturePavilion?.disciples) ? rawAbode.scripturePavilion.disciples : []
      }
    };
  } else {
    // Di trú an toàn từ linhDien / garden cũ (6 ô) sang abodeState (12 ô)
    const sourcePlots = (linhDien && linhDien.plots) || (data.garden && data.garden.plots) || [];
    const plots: AbodePlotState[] = createDefaultAbodePlots().map((defaultPlot, idx) => {
      const oldPlot = sourcePlots[idx];
      if (oldPlot) {
        return {
          ...defaultPlot,
          unlocked: Boolean(oldPlot.isUnlocked !== undefined ? oldPlot.isUnlocked : defaultPlot.unlocked),
          seedId: oldPlot.seedId || null,
          plantedAt: oldPlot.plantedAt || null,
          harvestAt: oldPlot.harvestAt || null,
          fertilized: Boolean(oldPlot.fertilized)
        };
      }
      return defaultPlot;
    });

    abodeState = {
      ...defaultAbode,
      plots
    };
  }

  // Chuẩn hóa Huyền Công Luyện Thể (Expanded Physique System)
  let physiqueState: PhysiqueState;
  const defaultPhysique = createDefaultPhysiqueState();

  if (data.physiqueState && typeof data.physiqueState === 'object') {
    const rawP = data.physiqueState;
    const cult = rawP.cultivation || defaultPhysique.cultivation;
    const currentRealm = PHYSIQUE_REALMS.find(r => r.id === cult.currentRealmId) || PHYSIQUE_REALMS[0];
    const baseExp = REALM_BASE_STAGE_EXP[currentRealm.realmIndex] || 100;

    const parts: PhysiquePart[] = createDefaultPhysiqueParts().map(defaultPart => {
      const existing = (rawP.parts || []).find((p: any) => p && p.id === defaultPart.id);
      if (existing) {
        return {
          ...defaultPart,
          level: Math.max(0, Math.min(defaultPart.maxLevel, typeof existing.level === 'number' ? existing.level : 0))
        };
      }
      return defaultPart;
    });

    physiqueState = {
      cultivation: {
        currentRealmId: currentRealm.id,
        currentStage: Math.max(1, Math.min(9, cult.currentStage || 1)),
        currentExp: Math.max(0, typeof cult.currentExp === 'number' ? cult.currentExp : 0),
        expToNextStage: cult.expToNextStage || baseExp,
        physiquePotential: Math.max(50, cult.physiquePotential || 100),
        maxPotential: Math.max(500, cult.maxPotential || 1000)
      },
      parts,
      passiveTickerTimestamp: typeof rawP.passiveTickerTimestamp === 'number' && rawP.passiveTickerTimestamp > 0
        ? rawP.passiveTickerTimestamp
        : Date.now()
    };
  } else {
    // Tự động di trú hoặc bù đắp từ bodyRefinement cũ nếu có
    const oldBodyRef = data.bodyRefinement;
    if (oldBodyRef && typeof oldBodyRef.realmIndex === 'number' && oldBodyRef.realmIndex > 0) {
      const targetRealmIdx = Math.min(PHYSIQUE_REALMS.length - 1, oldBodyRef.realmIndex);
      const targetRealm = PHYSIQUE_REALMS[targetRealmIdx];
      const baseExp = REALM_BASE_STAGE_EXP[targetRealm.realmIndex] || 100;

      physiqueState = {
        cultivation: {
          currentRealmId: targetRealm.id,
          currentStage: Math.max(1, Math.min(9, oldBodyRef.level || 1)),
          currentExp: Math.max(0, oldBodyRef.currentExp || 0),
          expToNextStage: baseExp,
          physiquePotential: 150 + (targetRealmIdx * 50),
          maxPotential: 1000 + (targetRealmIdx * 200)
        },
        parts: createDefaultPhysiqueParts().map(p => ({
          ...p,
          level: Math.min(p.maxLevel, targetRealmIdx * 3)
        })),
        passiveTickerTimestamp: Date.now()
      };
    } else {
      physiqueState = defaultPhysique;
    }
  }

  // Chuẩn hóa Thức Hải Thần Hồn (Soul & Consciousness System)
  let soulState: SoulState;
  const defaultSoul = createDefaultSoulState();

  if (data.soulState && typeof data.soulState === 'object') {
    const rawS = data.soulState;
    const cult = rawS.cultivation || defaultSoul.cultivation;
    const currentSoulRealm = SOUL_REALMS.find(r => r.id === cult.currentRealmId) || SOUL_REALMS[0];
    const baseSoulExp = SOUL_STAGE_EXP_BASE[currentSoulRealm.realmIndex] || 100;

    soulState = {
      cultivation: {
        currentRealmId: currentSoulRealm.id,
        currentStage: Math.max(1, Math.min(9, cult.currentStage || 1)),
        currentExp: Math.max(0, cult.currentExp || 0),
        expToNextStage: typeof cult.expToNextStage === 'number' && cult.expToNextStage > 0 ? cult.expToNextStage : baseSoulExp,
        soulSeaCapacity: typeof cult.soulSeaCapacity === 'number' ? cult.soulSeaCapacity : defaultSoul.cultivation.soulSeaCapacity,
        currentSoulPower: typeof cult.currentSoulPower === 'number' ? cult.currentSoulPower : defaultSoul.cultivation.currentSoulPower
      },
      mindState: {
        stability: typeof rawS.mindState?.stability === 'number' ? Math.max(0, Math.min(100, rawS.mindState.stability)) : 100,
        demonCorruption: typeof rawS.mindState?.demonCorruption === 'number' ? Math.max(0, Math.min(100, rawS.mindState.demonCorruption)) : 0,
        demonLevel: typeof rawS.mindState?.demonLevel === 'number' ? Math.max(0, rawS.mindState.demonLevel) : 0,
        isTribulationActive: Boolean(rawS.mindState?.isTribulationActive)
      },
      equippedRelics: Array.isArray(rawS.equippedRelics) && rawS.equippedRelics.length > 0 ? rawS.equippedRelics : defaultSoul.equippedRelics,
      lastMeditationTimestamp: typeof rawS.lastMeditationTimestamp === 'number' ? rawS.lastMeditationTimestamp : Date.now()
    };
  } else {
    // Di trú an toàn từ soulCultivation cũ nếu có
    const oldSoul = data.soulCultivation;
    if (oldSoul && typeof oldSoul.level === 'number' && oldSoul.level > 0) {
      const targetSoulRealmIdx = Math.min(SOUL_REALMS.length - 1, Math.floor((oldSoul.level - 1) / 9));
      const targetSoulRealm = SOUL_REALMS[targetSoulRealmIdx] || SOUL_REALMS[0];
      const baseSoulExp = SOUL_STAGE_EXP_BASE[targetSoulRealmIdx] || 100;
      const stage = ((oldSoul.level - 1) % 9) + 1;

      soulState = {
        cultivation: {
          currentRealmId: targetSoulRealm.id,
          currentStage: stage,
          currentExp: Math.max(0, oldSoul.currentExp || 0),
          expToNextStage: baseSoulExp,
          soulSeaCapacity: 150 + targetSoulRealmIdx * 250,
          currentSoulPower: 150 + targetSoulRealmIdx * 250
        },
        mindState: {
          stability: typeof data.tamCanh === 'number' ? Math.max(0, Math.min(100, data.tamCanh)) : 100,
          demonCorruption: 0,
          demonLevel: 0,
          isTribulationActive: false
        },
        equippedRelics: [SOUL_RELICS_CATALOG[0]],
        lastMeditationTimestamp: Date.now()
      };
    } else {
      soulState = defaultSoul;
    }
  }

  // Chuẩn hóa Tông Môn
  let sectState = data.sectState;
  if (!sectState) {
    sectState = createDefaultSectState();
    if (data.sect) {
      sectState.sectId = data.sect as SectId;
    } else if (data.tongMon) {
      if (data.tongMon.includes('Thanh Vân') || data.tongMon.includes('Thái Thanh') || data.tongMon.includes('Chính Đạo')) {
        sectState.sectId = 'sect_thanh_van_mon';
      } else if (data.tongMon.includes('Huyết Sát') || data.tongMon.includes('Cửu U') || data.tongMon.includes('Ma')) {
        sectState.sectId = 'sect_huyet_sat_tong';
      } else if (data.tongMon.includes('Thiên Kiếm') || data.tongMon.includes('Kiếm')) {
        sectState.sectId = 'sect_thai_at_kiem_tong';
      }
    }
    if (data.sectRank) {
      sectState.rank = data.sectRank;
    }
  }

  // Bảo toàn 100% điểm cống hiến tông môn cũ
  if (typeof data.sectContribution === 'number') {
    sectState.contribution = Math.max(sectState.contribution || 0, data.sectContribution);
    sectState.totalContribution = Math.max(sectState.totalContribution || 0, data.sectContribution);
  }

  // Chuẩn hóa sectId an toàn: nếu ID không tồn tại hoặc là ID cũ, map về ID hợp lệ
  if (sectState.sectId) {
    const knownSect = SECT_DATA_MAP[sectState.sectId] || SECT_PROFILES[sectState.sectId];
    if (knownSect) {
      sectState.sectId = knownSect.id as SectId;
    } else {
      // Fallback về môn phái cơ bản để không làm crash app
      sectState.sectId = 'sect_thanh_van_mon';
    }
  }

  if (sectState.sectId && (!sectState.dailyQuests || sectState.dailyQuests.length === 0)) {
    sectState.dailyQuests = generateDailyQuests();
  }
  if (!sectState.unlockedRecipes) sectState.unlockedRecipes = [];
  if (!sectState.unlockedManuals) sectState.unlockedManuals = [];
  if (!sectState.rank) sectState.rank = 'tap_dich';
  if (typeof sectState.arenaRank !== 'number') sectState.arenaRank = 5;
  if (!sectState.guardianArray) {
    sectState.guardianArray = createDefaultGuardianArray();
  }
  if (!sectState.occupiedVeinIds) sectState.occupiedVeinIds = [];
  if (typeof sectState.lastVeinWarAt !== 'number') sectState.lastVeinWarAt = 0;
  if (typeof sectState.lastVeinClaimAt !== 'number') sectState.lastVeinClaimAt = 0;
  if (!sectState.veinStates) sectState.veinStates = {};

  const tongMonName = sectState.sectId ? (SECT_DATA_MAP[sectState.sectId]?.name || SECT_PROFILES[sectState.sectId]?.name) : data.tongMon;

  // Chuẩn hóa Túi Trữ Vật (Đảm bảo Single Source of Truth cho sức chứa)
  let storageBag = data.storageBag ? { ...data.storageBag } : createDefaultStorageBag();

  // Kiểm tra nếu túi có trong template DEFAULT_STORAGE_BAGS thì đảm bảo maxSlots đúng
  if (storageBag.id && DEFAULT_STORAGE_BAGS[storageBag.id]) {
    const template = DEFAULT_STORAGE_BAGS[storageBag.id];
    storageBag = {
      ...template,
      ...storageBag,
      maxSlots: Math.max(storageBag.maxSlots || template.maxSlots || 20, template.maxSlots || 20)
    };
  } else if (!storageBag.maxSlots || storageBag.maxSlots < 20) {
    storageBag.maxSlots = Math.max(20, storageBag.maxSlots || 20);
  }

  // Tương thích ngược: kiểm tra data.equippedBag hoặc data.equipped?.bag hoặc inventory.equippedBagCapacity
  const legacyBagCap =
    data.equippedBag?.maxSlots ||
    data.equippedBag?.capacity ||
    data.equipped?.bag?.maxSlots ||
    data.equipped?.bag?.capacityBonus ||
    data.inventory?.equippedBagCapacity ||
    0;

  if (legacyBagCap > (storageBag.maxSlots || 20)) {
    storageBag.maxSlots = legacyBagCap;
  }

  // Bảo toàn và đồng bộ sức chứa túi đồ từ Pháp Bảo Trữ Vật Cửu Giai (storageState)
  const rawStorageBonus = typeof (data as any).storageState?.totalBonusGeneralSlots === 'number'
    ? (data as any).storageState.totalBonusGeneralSlots
    : 0;
  if (rawStorageBonus > 0 && (storageBag.maxSlots || 20) < 9999) {
    const baseBagSlots = (storageBag.id && DEFAULT_STORAGE_BAGS[storageBag.id]?.maxSlots) || 20;
    storageBag.maxSlots = Math.max(storageBag.maxSlots || 20, baseBagSlots + rawStorageBonus);
  }

  // Kiểm tra cờ vô hạn ô (isInfiniteCapacity)
  if (
    data.isInfiniteCapacity ||
    data.inventory?.isInfiniteCapacity ||
    storageBag.isInfinite ||
    (typeof storageBag.maxSlots === 'number' && storageBag.maxSlots >= 9999)
  ) {
    storageBag.maxSlots = 9999;
  }

  // Chuẩn hóa Bách Nghệ (Luyện Đan & Luyện Khí)
  const hasDanKinh = (data.manuals || []).some((m: any) => m.id === 'manual_dan_kinh_tan_quyen') ||
    (data.inventory?.manuals || []).some((m: any) => m.id === 'manual_dan_kinh_tan_quyen');
  const hasDucThuat = (data.manuals || []).some((m: any) => m.id === 'manual_bach_luyen_duc_thuat') ||
    (data.inventory?.manuals || []).some((m: any) => m.id === 'manual_bach_luyen_duc_thuat');

  const alchemyArtisan: ArtisanState = data.alchemyArtisan
    ? {
        ...data.alchemyArtisan,
        title: ARTISAN_TITLES.alchemy[data.alchemyArtisan.level || 1],
        maxExp: ARTISAN_LEVEL_EXP[data.alchemyArtisan.level || 1]
      }
    : createDefaultArtisanState('alchemy', Boolean(hasDanKinh));

  const forgingArtisan: ArtisanState = data.forgingArtisan
    ? {
        ...data.forgingArtisan,
        title: ARTISAN_TITLES.forging[data.forgingArtisan.level || 1],
        maxExp: ARTISAN_LEVEL_EXP[data.forgingArtisan.level || 1]
      }
    : createDefaultArtisanState('forging', Boolean(hasDucThuat));

  // Chuẩn hóa Trận Đạo Bách Nghệ (formationArtisan)
  const formationArtisanRankMaxExp = [100, 250, 500, 900, 1500, 2500, 4000, 7000, 99999];
  const formationArtisan = data.formationArtisan
    ? {
        level: Math.max(1, Math.min(9, data.formationArtisan.level || 1)),
        exp: typeof data.formationArtisan.exp === 'number' ? Math.max(0, data.formationArtisan.exp) : 0,
        maxExp: formationArtisanRankMaxExp[(data.formationArtisan.level || 1) - 1] || 100,
        totalCrafted: typeof data.formationArtisan.totalCrafted === 'number' ? data.formationArtisan.totalCrafted : 0,
        learnedRecipeIds: Array.isArray(data.formationArtisan.learnedRecipeIds)
          ? data.formationArtisan.learnedRecipeIds
          : ['recipe_tu_tuong_ho_the', 'recipe_canh_kim_tru_yeu'],
      }
    : {
        level: 1,
        exp: 0,
        maxExp: 100,
        totalCrafted: 0,
        learnedRecipeIds: ['recipe_tu_tuong_ho_the', 'recipe_canh_kim_tru_yeu'],
      };
  const normalizeFormationItem = (f: any): FormationItem => ({
    ...f,
    isPermanent: Boolean(f.isPermanent),
    reforgeTier: typeof f.reforgeTier === 'number' ? f.reforgeTier : 0,
    offlineAbsorptionBonus: typeof f.offlineAbsorptionBonus === 'number' ? f.offlineAbsorptionBonus : 0,
    reforgedAt: typeof f.reforgedAt === 'number' ? f.reforgedAt : undefined,
  });
  const equippedFormation = data.equippedFormation ? normalizeFormationItem(data.equippedFormation) : null;
  const inventoryFormations = Array.isArray(data.inventory?.formations)
    ? data.inventory.formations.map(normalizeFormationItem)
    : [];

  // Chuẩn hóa Phù Đạo Bách Nghệ (talismanArtisan, equippedTalismans, inventory.talismans)
  const talismanArtisanRankMaxExp = [100, 250, 500, 900, 1500, 2500, 4000, 7000, 99999];
  const talismanArtisan = data.talismanArtisan
    ? {
        level: Math.max(1, Math.min(9, data.talismanArtisan.level || 1)),
        exp: typeof data.talismanArtisan.exp === 'number' ? Math.max(0, data.talismanArtisan.exp) : 0,
        maxExp: talismanArtisanRankMaxExp[(data.talismanArtisan.level || 1) - 1] || 100,
        totalCrafted: typeof data.talismanArtisan.totalCrafted === 'number' ? data.talismanArtisan.totalCrafted : 0,
        learnedRecipeIds: Array.isArray(data.talismanArtisan.learnedRecipeIds) && data.talismanArtisan.learnedRecipeIds.length > 0
          ? data.talismanArtisan.learnedRecipeIds
          : ['recipe_giap_binh_phu', 'recipe_hoa_cau_phu'],
      }
    : {
        level: 1,
        exp: 0,
        maxExp: 100,
        totalCrafted: 0,
        learnedRecipeIds: ['recipe_giap_binh_phu', 'recipe_hoa_cau_phu'],
      };

  const defaultBelt = [
    { slotIndex: 0, talismanId: null },
    { slotIndex: 1, talismanId: null },
    { slotIndex: 2, talismanId: null },
  ];
  const equippedTalismans = Array.isArray(data.equippedTalismans) && data.equippedTalismans.length >= 3
    ? data.equippedTalismans.slice(0, 3).map((slot: any, idx: number) => ({
        slotIndex: idx,
        talismanId: slot?.talismanId || null,
      }))
    : defaultBelt;

  const inventoryTalismans = Array.isArray(data.inventory?.talismans)
    ? data.inventory.talismans.filter((t: any) => t && typeof t.quantity === 'number' && t.quantity > 0)
    : [];

  // Chuẩn hóa Vạn Bảo Thương Hội
  let merchantState: MerchantState;
  if (data.merchantState?.items && data.merchantState.items.length > 0) {
    merchantState = {
      ...data.merchantState,
      lastDailyRefreshTime: data.merchantState.lastDailyRefreshTime || data.merchantState.lastRefreshTime || Date.now(),
      purchasedOneTimeIds: Array.isArray(data.merchantState.purchasedOneTimeIds)
        ? [...data.merchantState.purchasedOneTimeIds]
        : [],
      currentStock: data.merchantState.currentStock || {}
    };
  } else {
    merchantState = createDefaultMerchantState();
  }

  // Tự động quét các công pháp đã học / đã sở hữu đưa vào purchasedOneTimeIds để chống bán trùng
  if (!merchantState.purchasedOneTimeIds) {
    merchantState.purchasedOneTimeIds = [];
  }
  if (Array.isArray(data.manuals)) {
    data.manuals.forEach((m: any) => {
      if (m?.id && !merchantState.purchasedOneTimeIds!.includes(m.id)) {
        merchantState.purchasedOneTimeIds!.push(m.id);
      }
    });
  }
  if (Array.isArray(data.inventory?.manuals)) {
    data.inventory.manuals.forEach((m: any) => {
      if (m?.id && !merchantState.purchasedOneTimeIds!.includes(m.id)) {
        merchantState.purchasedOneTimeIds!.push(m.id);
      }
    });
  }
  if (Array.isArray(data.inventory?.books)) {
    data.inventory.books.forEach((b: any) => {
      if (b?.id && !merchantState.purchasedOneTimeIds!.includes(b.id)) {
        merchantState.purchasedOneTimeIds!.push(b.id);
      }
      if (b?.manualId && !merchantState.purchasedOneTimeIds!.includes(b.manualId)) {
        merchantState.purchasedOneTimeIds!.push(b.manualId);
      }
    });
  }
  if (Array.isArray(data.learnedManuals)) {
    data.learnedManuals.forEach((mId: string) => {
      if (mId && !merchantState.purchasedOneTimeIds!.includes(mId)) {
        merchantState.purchasedOneTimeIds!.push(mId);
      }
    });
  }

  // Đảm bảo các hàng hóa mới luôn sẵn sàng trong Thương Hội cho người chơi tiếp cận ngay
  if (merchantState.items && merchantState.items.length > 0) {
    const freshCatalog = generateMerchantInventory({ ...base, ...data, manuals, currentRealm });
    const freshCatalogMap = new Map(freshCatalog.map(it => [it.id, it]));
    // Cập nhật category, pillType, cultivationItemType, manualSlot, companionItemType, beastItemType mới nhất cho các hàng hóa đã có trong save
    merchantState.items = merchantState.items.map(it => {
      const fresh = freshCatalogMap.get(it.id);
      if (fresh) {
        return {
          ...it,
          category: fresh.category || it.category,
          pillType: fresh.pillType || it.pillType,
          cultivationItemType: fresh.cultivationItemType || it.cultivationItemType,
          manualSlot: fresh.manualSlot !== undefined ? fresh.manualSlot : it.manualSlot,
          companionItemType: fresh.companionItemType || it.companionItemType,
          beastItemType: fresh.beastItemType || it.beastItemType,
          herbCategory: fresh.herbCategory || (it as any).herbCategory,
          herbTier: fresh.herbTier || (it as any).herbTier,
          primaryAlchemyUse: fresh.primaryAlchemyUse || (it as any).primaryAlchemyUse,
          elementalAffinity: fresh.elementalAffinity || (it as any).elementalAffinity,
          isOneTime: fresh.isOneTime !== undefined ? fresh.isOneTime : it.isOneTime,
          tier: fresh.tier !== undefined ? fresh.tier : it.tier,
          tierName: fresh.tierName || it.tierName,
          requiredRealmIndex: fresh.requiredRealmIndex !== undefined ? fresh.requiredRealmIndex : it.requiredRealmIndex,
          requiredRealmName: fresh.requiredRealmName || it.requiredRealmName,
          pillEffects: fresh.pillEffects || it.pillEffects,
          cultivationEffects: fresh.cultivationEffects || it.cultivationEffects,
          cultivationCategory: fresh.cultivationCategory || it.cultivationCategory,
          equipmentSlot: fresh.equipmentSlot || it.equipmentSlot,
          equipmentTier: fresh.equipmentTier || it.equipmentTier,
          equipmentStats: fresh.equipmentStats || it.equipmentStats,
          companionData: fresh.companionData || (it as any).companionData,
          companionArchetype: fresh.companionArchetype || (it as any).companionArchetype,
          companionTier: fresh.companionTier || (it as any).companionTier,
          beastData: fresh.beastData || (it as any).beastData,
          beastArchetype: fresh.beastArchetype || (it as any).beastArchetype,
          beastTier: fresh.beastTier || (it as any).beastTier,
          storageData: fresh.storageData || (it as any).storageData,
          storageCategory: fresh.storageCategory || (it as any).storageCategory,
          storageTier: fresh.storageTier || (it as any).storageTier
        };
      }
      // Quét các item đan dược còn mang category 'cultivation', tự động di trú sang category 'pills'
      if (
        it.category === 'cultivation' &&
        (it.itemType === 'pill' || it.id.startsWith('m_pill_') || it.id.startsWith('pill_') || it.id.startsWith('dan_') || it.id.includes('pha_canh') || it.id.includes('tay_tuy') || it.id.includes('cai_menh') || it.id.includes('dinh_than') || it.id.includes('khi_huyet') || it.id.includes('tu_khi') || it.id.includes('hoi_huyet') || it.id.includes('ngo_dao_tra') || it.id.includes('tich_coc') || it.id.includes('duyen_tho'))
      ) {
        return {
          ...it,
          category: 'pills',
          itemType: 'pill'
        };
      }
      // Phân loại lại item linh thú cũ nếu category còn là companions_beasts hoặc companions
      if (it.category === 'companions_beasts' || it.category === 'companions') {
        if (it.id.includes('beast_') || it.id.includes('linh_noan') || it.id.includes('toa_lien') || it.id.includes('thu_giap') || it.id.includes('thu_hon')) {
          return {
            ...it,
            category: 'beasts',
            beastItemType: (it.id.includes('noan') ? 'egg' : it.id.includes('toa_lien') ? 'tool' : it.id.includes('giap') ? 'armor' : 'food') as any
          };
        }
        if (it.category === 'companions_beasts') {
          return {
            ...it,
            category: 'companions',
            companionItemType: (it.id.includes('dong_tam_ket') || it.id.includes('uyen_uong') || it.id.includes('huong_tui') ? 'token' : 'gift') as any
          };
        }
      }
      // Quét các item pháp bảo trữ vật
      if (it.id.startsWith('stor_t') || (it as any).storageData) {
        return {
          ...it,
          category: 'storage',
          isOneTime: true
        };
      }
      return it;
    });
    const existingShopIds = new Set(merchantState.items.map(it => it.id));
    const missingItems = freshCatalog.filter(it => 
      (it.category === 'pills' || it.category === 'cultivation' || it.category === 'manuals' || it.category === 'skills' || it.category === 'companions' || it.category === 'beasts' || it.category === 'equipment' || it.category === 'materials' || it.category === 'herbs' || it.category === 'ores' || it.category === 'storage' || it.category === 'inventory') && 
      !existingShopIds.has(it.id)
    );
    if (missingItems.length > 0) {
      merchantState.items = [...merchantState.items, ...missingItems];
    }
  }

  // Tự động chuẩn hóa và sắp xếp toàn bộ hàng hóa Thương Hội theo phẩm cấp/giai vị lũy tiến
  if (merchantState.items && Array.isArray(merchantState.items)) {
    merchantState.items = sortMerchantItems(merchantState.items);
  }

  // Chuẩn hóa Hệ Thống Đạo Lữ Tiên Duyên (Companions)
  let companionsState: CompanionsDataState;
  if (!data.companionsState || !data.companionsState.companions) {
    companionsState = createDefaultCompanionsState();
  } else {
    const mergedCompanions: Record<string, CompanionPlayerState> = { ...data.companionsState.companions };
    Object.keys(mergedCompanions).forEach(k => {
      if (mergedCompanions[k]) {
        mergedCompanions[k] = {
          ...mergedCompanions[k],
          fatigueUntil: typeof mergedCompanions[k].fatigueUntil === 'number' ? mergedCompanions[k].fatigueUntil : 0,
          totalEpiphanies: typeof mergedCompanions[k].totalEpiphanies === 'number' ? mergedCompanions[k].totalEpiphanies : 0
        };
      }
    });
    COMPANIONS_DATA.forEach(c => {
      if (!mergedCompanions[c.id]) {
        mergedCompanions[c.id] = createDefaultCompanionPlayerState(c.id);
      }
    });

    let activeCompId = data.companionsState.activeCompanionId || null;

    // Tự động thanh lọc mock data cũ cho save sơ kỳ (currentRealm <= 1) hoặc dữ liệu không hợp lệ:
    // Nếu người chơi ở cảnh giới sơ kỳ (Phàm Nhân / Luyện Khí tầng 1) bị dính mock data cũ của Lạc Thanh Tuyết (affinity === 15 và chưa kết duyên)
    if (currentRealm <= 1) {
      const lacThanhTuyetState = mergedCompanions['companion_lac_thanh_tuyet'];
      if (lacThanhTuyetState && !lacThanhTuyetState.isBonded && lacThanhTuyetState.affinity === 15) {
        lacThanhTuyetState.affinity = 0;
        lacThanhTuyetState.isMet = false;
      }
      // Người chơi sơ kỳ chưa từng kết duyên hợp lệ thì không thể có đạo lữ đồng hành
      if (activeCompId && (!mergedCompanions[activeCompId] || !mergedCompanions[activeCompId].isBonded)) {
        activeCompId = null;
      }
    } else if (activeCompId) {
      // Với save ở cảnh giới cao hơn, chỉ giữ activeCompanionId nếu đạo lữ đó đã được gặp gỡ hoặc đã kết duyên
      const compState = mergedCompanions[activeCompId];
      if (!compState || (!compState.isMet && !compState.isBonded)) {
        activeCompId = null;
      }
    }

    companionsState = {
      activeCompanionId: activeCompId,
      stationedGardenCompanionId: data.companionsState.stationedGardenCompanionId || null,
      tamThanHopNhatUntil: data.companionsState.tamThanHopNhatUntil || 0,
      companions: mergedCompanions,
      tamTinhThanDieuUntil: data.companionsState.tamTinhThanDieuUntil || 0
    };
  }

  // Cập nhật hiệu lực buff Tâm Tịnh Thần Diệu
  const isTamTinhActive = Boolean(
    companionsState.tamTinhThanDieuUntil && Date.now() < companionsState.tamTinhThanDieuUntil
  );
  const activeBuffs = {
    ...(data.activeBuffs || {}),
    tamTinhThanDieu: isTamTinhActive,
    tamTinhThanDieuUntil: companionsState.tamTinhThanDieuUntil
  };

  // Chuẩn hóa Hệ Thống Thành Tựu & Danh Hiệu (Tương thích ngược v1-v7)
  const rawAch = (data.achievementsState || {}) as any;
  const rawClaimed: string[] = Array.isArray(rawAch.claimedAchievementIds)
    ? rawAch.claimedAchievementIds
    : (Array.isArray(rawAch.claimedIds) ? rawAch.claimedIds : (Array.isArray(rawAch.unlockedAchievementIds) ? rawAch.unlockedAchievementIds : []));
  const rawUnlockedTitles: string[] = Array.isArray(rawAch.unlockedTitleIds) ? [...rawAch.unlockedTitleIds] : [];

  // Tự động mở khóa danh hiệu nếu người chơi đã đạt các mốc cảnh giới cao trước đó
  if (safeRealm >= 1 && !rawUnlockedTitles.includes('title_pham_nhan')) {
    rawUnlockedTitles.push('title_pham_nhan');
  }
  if (safeRealm >= 16 && !rawUnlockedTitles.includes('title_kiem_tien')) {
    rawUnlockedTitles.push('title_kiem_tien');
  }
  if (safeRealm >= 101 && !rawUnlockedTitles.includes('title_truong_sinh')) {
    rawUnlockedTitles.push('title_truong_sinh');
  }

  const achievementsState: AchievementsState = {
    claimedAchievementIds: Array.from(new Set(rawClaimed)),
    equippedTitleId: rawAch.equippedTitleId || null,
    unlockedTitleIds: Array.from(new Set(rawUnlockedTitles)),
    stats: {
      bossKills: rawAch.stats?.bossKills || 0,
      herbsHarvested: rawAch.stats?.herbsHarvested || 0,
      pillsCrafted: rawAch.stats?.pillsCrafted || 0,
      equipmentsForged: rawAch.stats?.equipmentsForged || 0,
      dualCultivations: rawAch.stats?.dualCultivations || 0,
      breakthroughsSuccess: rawAch.stats?.breakthroughsSuccess || 0,
      towerFloorsCleared: rawAch.stats?.towerFloorsCleared || 0,
      secretRealmsExplored: rawAch.stats?.secretRealmsExplored || 0,
      totalLinhThachEarned: rawAch.stats?.totalLinhThachEarned || 0,
      rebornCount: rawAch.stats?.rebornCount || 0
    }
  };

  const result: PlayerStats = {
    ...base,
    ...data,
    canCot,
    tamCanh,
    ngoTinh,
    currentRealm,
    maxKhiHuyet: maxHP,
    khiHuyet: typeof data.khiHuyet === 'number' ? Math.min(data.khiHuyet, maxHP) : maxHP,
    maxLinhLuc: maxMP,
    linhLuc: typeof data.linhLuc === 'number' ? Math.min(data.linhLuc, maxMP) : maxMP,
    maxMp: maxMP,
    mp: typeof data.linhLuc === 'number' ? Math.min(data.linhLuc, maxMP) : maxMP,
    linhCan,
    physique,
    physiques,
    destiny,
    destinies,
    destinyBoard,
    activeSynergies,
    congKich: cStats.atk,
    phongNgu: cStats.def,
    thanThuc: typeof data.thanThuc === 'number' ? Math.max(data.thanThuc, cStats.soul) : (cStats.soul || 10),
    tocDo: cStats.speed,
    baoKichRate: cStats.critRate,
    baoKichDmg: cStats.critDmg,
    equippedManuals,
    tinhHuyetYeuThu: typeof data.tinhHuyetYeuThu === 'number' ? data.tinhHuyetYeuThu : 0,
    trungPhamLinhThach: typeof data.trungPhamLinhThach === 'number' ? data.trungPhamLinhThach : 0,
    thuongPhamLinhThach: typeof data.thuongPhamLinhThach === 'number' ? data.thuongPhamLinhThach : 0,
    cucPhamLinhThach: typeof data.cucPhamLinhThach === 'number' ? data.cucPhamLinhThach : 0,
    tienTinh: typeof data.tienTinh === 'number' ? data.tienTinh : (typeof data.tienPhamLinhThach === 'number' ? data.tienPhamLinhThach : 0),
    tienPhamLinhThach: typeof data.tienTinh === 'number' ? data.tienTinh : (typeof data.tienPhamLinhThach === 'number' ? data.tienPhamLinhThach : 0),
    inventory: {
      pills: invPills.map((p: any) => ({
        ...p,
        quality: p.quality || 'thuong_pham',
        grade: convertGradeToGiai(p.grade),
        veinMetadata: p.veinMetadata && typeof p.veinMetadata === 'object' ? {
          veinCount: typeof p.veinMetadata.veinCount === 'number' ? Math.max(0, Math.min(9, p.veinMetadata.veinCount)) : 0,
          veinMultiplier: typeof p.veinMetadata.veinMultiplier === 'number' ? p.veinMetadata.veinMultiplier : 1.0,
          toxicityMultiplier: typeof p.veinMetadata.toxicityMultiplier === 'number' ? p.veinMetadata.toxicityMultiplier : 0.50,
          mutation: p.veinMetadata.mutation || null
        } : {
          veinCount: 0,
          veinMultiplier: 1.0,
          toxicityMultiplier: 0.50,
          mutation: null
        },
        isMutated: Boolean(p.isMutated || p.veinMetadata?.mutation)
      })),
      herbs: mergeDuplicateInventoryItems((data.inventory?.herbs || []).filter((h: any) => h && h.quantity > 0)).map((h: any) => ({
        ...h,
        quality: h.quality || 'thuong_pham',
        grade: convertGradeToGiai(h.grade)
      })),
      ores: (() => {
        const rawOres = mergeDuplicateInventoryItems((data.inventory?.ores || []).filter((o: any) => o && o.quantity > 0)).map((o: any) => ({
          ...o,
          quality: o.quality || 'thuong_pham',
          grade: convertGradeToGiai(o.grade)
        }));
        // Đảm bảo có nguyên liệu vẽ bùa cơ bản để trải nghiệm Phù Đạo
        const starterMats = [
          { id: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', grade: 'Nhất Giai', quantity: 20, price: 30, description: 'Giấy bùa làm từ vỏ linh trúc sơ thiên.' },
          { id: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', grade: 'Nhất Giai', quantity: 20, price: 40, description: 'Khoáng thạch chu sa xích hồng dùng điểm linh mực.' },
          { id: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', grade: 'Tam Giai', quantity: 10, price: 100, description: 'Da cóc ngọc hoặc yêu thú lột xác, chất liệu bền dai.' },
          { id: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', grade: 'Tam Giai', quantity: 10, price: 120, description: 'Huyết dịch ngưng tụ sát khí yêu thú.' },
        ];
        starterMats.forEach(sm => {
          if (!rawOres.some((o: any) => o.id === sm.id)) {
            rawOres.push(sm as any);
          }
        });
        return rawOres;
      })(),
      manuals: [...(data.inventory?.manuals || [])],
      equipments: [...(data.inventory?.equipments || data.inventory?.equipment || [])].map((e: any) => ensureEquipmentStructure({
        ...e,
        quality: e.quality || 'thuong_pham',
        grade: convertGradeToGiai(e.grade)
      })),
      equipment: [...(data.inventory?.equipments || data.inventory?.equipment || [])].map((e: any) => ensureEquipmentStructure({
        ...e,
        quality: e.quality || 'thuong_pham',
        grade: convertGradeToGiai(e.grade)
      })),
      gems: (data.inventory?.gems && Array.isArray(data.inventory.gems) && data.inventory.gems.length > 0)
        ? data.inventory.gems
        : [...STARTER_GEMS],
      books: [...(data.inventory?.books || [])],
      bags: [...(data.inventory?.bags || [])],
      formations: inventoryFormations,
      talismans: inventoryTalismans,
      forgingEssence: typeof data.inventory?.forgingEssence === 'number' ? Math.max(0, data.inventory.forgingEssence) : 0,
      maxSlots: storageBag.maxSlots,
    },
    manuals,
    equipment: normalizedEquipment,
    equippedEquipment: normalizedEquipment,
    activeBuffs,
    linhDien,
    abodeState,
    sectState,
    sectData: sectState,
    sect: sectState.sectId,
    sectRank: sectState.rank,
    sectContribution: sectState.contribution,
    tongMon: tongMonName,
    storageBag,
    alchemyArtisan,
    forgingArtisan,
    formationArtisan,
    equippedFormation,
    talismanArtisan,
    equippedTalismans,
    merchantState,
    companionsState,
    bodyRefinement,
    physiqueState,
    soulCultivation,
    soulState,
    towerFloor: typeof data.towerFloor === 'number' ? data.towerFloor : 1,
    towerPoints: typeof data.towerPoints === 'number' ? data.towerPoints : 0,
    worldBossDamage: typeof data.worldBossDamage === 'number' ? data.worldBossDamage : 0,
    worldBossClaimedMilestones: Array.isArray(data.worldBossClaimedMilestones) ? data.worldBossClaimedMilestones : [],
    dailyDivination: data.dailyDivination || undefined,
    stolenFatePoints: typeof data.stolenFatePoints === 'number' ? data.stolenFatePoints : 0,
    beasts: (() => {
      const rawBeasts = Array.isArray(data.beasts)
        ? data.beasts
        : Array.isArray((data as any).beastState?.beasts)
          ? (data as any).beastState.beasts
          : [];
      return rawBeasts.map((b: any) => ({
        ...b,
        quality: b.quality || b.rarity || 'trung_pham',
        stage: typeof b.stage === 'number' && b.stage >= 1 ? b.stage : 1,
        level: typeof b.level === 'number' && b.level >= 1 ? b.level : 1,
        loyalty: typeof b.loyalty === 'number' ? b.loyalty : 50,
        stats: b.stats || { hp: 1000, maxHp: 1000, atk: 100, def: 50, blockPercent: 10, mountSpeedBonus: 10, mpRegenBonus: 10 },
        skills: Array.isArray(b.skills) ? b.skills : [],
        // Huyết Mạch & Lai Tạo Mặc Định (Self-Healing Migration)
        tier: typeof b.tier === 'number' ? b.tier : 2,
        bloodlinePurity: typeof b.bloodlinePurity === 'number' ? b.bloodlinePurity : 30,
        generation: typeof b.generation === 'number' ? b.generation : 0,
        isHybrid: Boolean(b.isHybrid),
        canMount: typeof b.canMount === 'boolean' ? b.canMount : (b.role === 'mount' || b.role === 'both' || (b.stats?.mountSpeedBonus || 0) > 0),
        canFight: typeof b.canFight === 'boolean' ? b.canFight : (b.role !== 'mount'),
        travelSpeedBonus: typeof b.travelSpeedBonus === 'number' ? b.travelSpeedBonus : (b.stats?.mountSpeedBonus || 20),
        combatStats: b.combatStats || {
          atkBonus: b.stats?.atk || 100,
          defBonus: b.stats?.def || 50,
          hpBonus: b.stats?.hp || 1000,
          critRate: 5
        },
        breedingCooldownEnd: typeof b.breedingCooldownEnd === 'number' ? b.breedingCooldownEnd : 0,
        isLockedInBreeding: Boolean(b.isLockedInBreeding)
      }));
    })(),
    activeBeastId: data.activeBeastId || null,
    beastEggs: (() => {
      const rawEggs = Array.isArray(data.beastEggs)
        ? data.beastEggs
        : Array.isArray((data as any).beastState?.eggs)
          ? (data as any).beastState.eggs
          : [];
      return rawEggs.map((egg: any) => ({
        ...egg,
        quality: egg.quality || egg.rarity || 'trung_pham',
        progress: typeof egg.progress === 'number' ? egg.progress : 0,
        requiredProgress: typeof egg.requiredProgress === 'number' && egg.requiredProgress > 0 ? egg.requiredProgress : 100,
        avatar: egg.avatar || '🥚',
        name: egg.name || 'Linh Noãn',
        description: egg.description || 'Linh noãn chứa đựng sinh mệnh yêu thú thượng cổ, cần rót chân nguyên nuôi dưỡng.'
      }));
    })(),
    lastActiveTimestamp: typeof data.lastActiveTimestamp === 'number' && data.lastActiveTimestamp > 0 ? data.lastActiveTimestamp : Date.now(),
    achievementsState,
    storylineState: data.storylineState
      ? {
          currentChapterId: data.storylineState.currentChapterId || 'chap_1',
          activeQuestId: data.storylineState.activeQuestId !== undefined ? data.storylineState.activeQuestId : 'quest_1_1',
          completedQuestIds: Array.isArray(data.storylineState.completedQuestIds) ? data.storylineState.completedQuestIds : [],
          choiceHistory: data.storylineState.choiceHistory && typeof data.storylineState.choiceHistory === 'object'
            ? data.storylineState.choiceHistory
            : {}
        }
      : createDefaultStorylineState(),
    dungeonRunState: data.dungeonRunState || null,
    auctionState: data.auctionState || null,
    age: safeAge,
    maxLifespan: safeMaxLifespan,
    lifespanPillsUsed: rawPillBonus,
    isToaHoaWarning,
    natalArtifact: (() => {
      const rawReborn: any = data.reincarnationState || {};
      const safeSealed = rawReborn.sealedArtifact;
      // Tự động giải phong Bản Mệnh Pháp Bảo khi đạt Trúc Cơ Kỳ (Realm >= 11)
      if (currentRealm >= 11 && safeSealed && !safeSealed.isUnsealed && safeSealed.originalNatalData) {
        return {
          ...safeSealed.originalNatalData,
          boundRealmId: currentRealm,
          boundAtTimestamp: Date.now()
        };
      }
      return data.natalArtifact ? { ...data.natalArtifact } : null;
    })(),
    reincarnationState: (() => {
      const rawReborn: any = data.reincarnationState || {};
      let safeSealed: any = rawReborn.sealedArtifact ? { ...rawReborn.sealedArtifact } : null;
      if (currentRealm >= 11 && safeSealed && !safeSealed.isUnsealed) {
        safeSealed = { ...safeSealed, isUnsealed: true };
      }
      return {
        totalRebornTimes: typeof rawReborn.totalRebornTimes === 'number'
          ? Math.max(0, rawReborn.totalRebornTimes)
          : (data.achievementsState?.stats?.rebornCount || 0),
        currentKarmaPoints: typeof rawReborn.currentKarmaPoints === 'number'
          ? Math.max(0, rawReborn.currentKarmaPoints)
          : 0,
        lifetimeKarmaPoints: typeof rawReborn.lifetimeKarmaPoints === 'number'
          ? Math.max(0, rawReborn.lifetimeKarmaPoints)
          : 0,
        highestRealmIndexAchieved: typeof rawReborn.highestRealmIndexAchieved === 'number'
          ? Math.max(0, rawReborn.highestRealmIndexAchieved)
          : currentRealm,
        sealedArtifact: safeSealed,
        inheritedDestinyId: rawReborn.inheritedDestinyId || null,
        permanentPerks: rawReborn.permanentPerks && typeof rawReborn.permanentPerks === 'object'
          ? { ...rawReborn.permanentPerks }
          : {},
        lastReincarnationAt: rawReborn.lastReincarnationAt || undefined,
        pastLives: Array.isArray(rawReborn.pastLives) ? rawReborn.pastLives : []
      };
    })(),
    pvpLadderState: (() => {
      if (data.pvpLadderState && Array.isArray(data.pvpLadderState.ladderNpcs) && data.pvpLadderState.ladderNpcs.length > 0) {
        return {
          currentRank: typeof data.pvpLadderState.currentRank === 'number' ? data.pvpLadderState.currentRank : 101,
          bestRank: typeof data.pvpLadderState.bestRank === 'number' ? data.pvpLadderState.bestRank : 101,
          challengeTickets: typeof data.pvpLadderState.challengeTickets === 'number' ? Math.max(0, Math.min(5, data.pvpLadderState.challengeTickets)) : 5,
          lastTicketRegenTime: typeof data.pvpLadderState.lastTicketRegenTime === 'number' ? data.pvpLadderState.lastTicketRegenTime : Date.now(),
          lastWeeklySettlementTime: typeof data.pvpLadderState.lastWeeklySettlementTime === 'number' ? data.pvpLadderState.lastWeeklySettlementTime : Date.now(),
          combatLogs: Array.isArray(data.pvpLadderState.combatLogs) ? data.pvpLadderState.combatLogs : [],
          ladderNpcs: data.pvpLadderState.ladderNpcs
        };
      }
      return createDefaultPvPLadderState();
    })(),
    synergyState: (() => {
      const raw = data.synergyState;
      if (raw && typeof raw === 'object') {
        return {
          totalActivations: typeof raw.totalActivations === 'number' ? Math.max(0, raw.totalActivations) : 0,
          skillActivationCounts: raw.skillActivationCounts && typeof raw.skillActivationCounts === 'object'
            ? { ...raw.skillActivationCounts }
            : {},
          unlockedSkillIds: Array.isArray(raw.unlockedSkillIds) ? raw.unlockedSkillIds : [],
          lastUnlockedSkillId: raw.lastUnlockedSkillId || null,
          highestDamageSynergy: typeof raw.highestDamageSynergy === 'number' ? raw.highestDamageSynergy : 0,
        };
      }
      return {
        totalActivations: 0,
        skillActivationCounts: {},
        unlockedSkillIds: [],
        lastUnlockedSkillId: null,
        highestDamageSynergy: 0,
      };
    })(),
    cosmicState: (() => {
      const raw = data.cosmicState;
      const playerRealm = data.currentRealm ?? 0;
      // Nếu chưa có cosmicState và đạt cảnh giới Phi Thăng -> khởi tạo mặc định
      if (!raw) {
        if (playerRealm >= 51) {
          return {
            unlocked: true,
            currentNodeId: 'node_thai_vi_entry',
            travelingToNodeId: null,
            travelStartTime: null,
            travelEndTime: null,
            vessel: {
              name: 'Phi Chu Sơ Cấp',
              level: 1,
              speedLyPerMin: 1.0,
              hullIntegrity: 100,
              cargoCapacity: 500,
              upgradeCost: { honDonThanThiet: 20, linhThach: 100_000 },
            },
            occupiedNodeIds: [],
            defeatedGuardianIds: [],
            cargo: { honDonThanThiet: 0, tienThienDiBao: 0, vanCoDeRuyi: 0, linhThach: 0, lastHarvestTime: Date.now() },
            eventLogs: [],
            totalHonDonHarvested: 0,
            totalBattlesWon: 0,
            defenseState: {
              fortifications: {},
              garrisons: {},
              activeIncursions: [],
              lastIncursionCheckTime: Date.now(),
              incursionsRepelledCount: 0,
              incursionsBreachedCount: 0,
              sectorResonanceGrid: [],
              resonanceLinks: [],
              crossFireEnergyBuffer: 0,
            },
          };
        }
        return undefined;
      }
      // Migrate existing cosmicState với safe defaults
      return {
        unlocked: raw.unlocked ?? (playerRealm >= 51),
        currentNodeId: raw.currentNodeId || 'node_thai_vi_entry',
        travelingToNodeId: raw.travelingToNodeId ?? null,
        travelStartTime: raw.travelStartTime ?? null,
        travelEndTime: raw.travelEndTime ?? null,
        vessel: raw.vessel && typeof raw.vessel === 'object' ? {
          name: raw.vessel.name || 'Phi Chu Sơ Cấp',
          level: typeof raw.vessel.level === 'number' ? raw.vessel.level : 1,
          speedLyPerMin: typeof raw.vessel.speedLyPerMin === 'number' ? raw.vessel.speedLyPerMin : 1.0,
          hullIntegrity: typeof raw.vessel.hullIntegrity === 'number' ? raw.vessel.hullIntegrity : 100,
          cargoCapacity: typeof raw.vessel.cargoCapacity === 'number' ? raw.vessel.cargoCapacity : 500,
          upgradeCost: raw.vessel.upgradeCost,
        } : { name: 'Phi Chu Sơ Cấp', level: 1, speedLyPerMin: 1.0, hullIntegrity: 100, cargoCapacity: 500 },
        occupiedNodeIds: Array.isArray(raw.occupiedNodeIds) ? raw.occupiedNodeIds : [],
        defeatedGuardianIds: Array.isArray(raw.defeatedGuardianIds) ? raw.defeatedGuardianIds : [],
        nodeGuardians: raw.nodeGuardians && typeof raw.nodeGuardians === 'object' ? raw.nodeGuardians : {},
        cargo: raw.cargo && typeof raw.cargo === 'object' ? {
          honDonThanThiet: typeof raw.cargo.honDonThanThiet === 'number' ? raw.cargo.honDonThanThiet : 0,
          tienThienDiBao: typeof raw.cargo.tienThienDiBao === 'number' ? raw.cargo.tienThienDiBao : 0,
          vanCoDeRuyi: typeof raw.cargo.vanCoDeRuyi === 'number' ? raw.cargo.vanCoDeRuyi : 0,
          linhThach: typeof raw.cargo.linhThach === 'number' ? raw.cargo.linhThach : 0,
          lastHarvestTime: typeof raw.cargo.lastHarvestTime === 'number' ? raw.cargo.lastHarvestTime : Date.now(),
        } : { honDonThanThiet: 0, tienThienDiBao: 0, vanCoDeRuyi: 0, linhThach: 0, lastHarvestTime: Date.now() },
        eventLogs: Array.isArray(raw.eventLogs) ? raw.eventLogs.slice(0, 50) : [],
        totalHonDonHarvested: typeof raw.totalHonDonHarvested === 'number' ? raw.totalHonDonHarvested : 0,
        totalBattlesWon: typeof raw.totalBattlesWon === 'number' ? raw.totalBattlesWon : 0,
        defenseState: (raw.defenseState && typeof raw.defenseState === 'object') ? {
          fortifications: raw.defenseState.fortifications && typeof raw.defenseState.fortifications === 'object' ? raw.defenseState.fortifications : {},
          garrisons: raw.defenseState.garrisons && typeof raw.defenseState.garrisons === 'object' ? raw.defenseState.garrisons : {},
          activeIncursions: Array.isArray(raw.defenseState.activeIncursions) ? raw.defenseState.activeIncursions : [],
          lastIncursionCheckTime: typeof raw.defenseState.lastIncursionCheckTime === 'number' ? raw.defenseState.lastIncursionCheckTime : Date.now(),
          incursionsRepelledCount: typeof raw.defenseState.incursionsRepelledCount === 'number' ? raw.defenseState.incursionsRepelledCount : 0,
          incursionsBreachedCount: typeof raw.defenseState.incursionsBreachedCount === 'number' ? raw.defenseState.incursionsBreachedCount : 0,
          sectorResonanceGrid: Array.isArray(raw.defenseState.sectorResonanceGrid)
            ? raw.defenseState.sectorResonanceGrid
            : (Array.isArray(raw.defenseState.resonanceLinks) ? raw.defenseState.resonanceLinks : []),
          resonanceLinks: Array.isArray(raw.defenseState.resonanceLinks)
            ? raw.defenseState.resonanceLinks
            : (Array.isArray(raw.defenseState.sectorResonanceGrid) ? raw.defenseState.sectorResonanceGrid : []),
          crossFireEnergyBuffer: typeof raw.defenseState.crossFireEnergyBuffer === 'number'
            ? raw.defenseState.crossFireEnergyBuffer
            : 0,
        } : {
          fortifications: {},
          garrisons: {},
          activeIncursions: [],
          lastIncursionCheckTime: Date.now(),
          incursionsRepelledCount: 0,
          incursionsBreachedCount: 0,
          sectorResonanceGrid: [],
          resonanceLinks: [],
          crossFireEnergyBuffer: 0,
        },
      };
    })(),
    offspringState: (() => {
      const raw = (data as any).offspringState;
      if (raw && typeof raw === 'object') {
        return {
          gestation: raw.gestation && typeof raw.gestation === 'object' ? {
            isGestationActive: Boolean(raw.gestation.isGestationActive),
            motherCompanionId: raw.gestation.motherCompanionId || '',
            motherName: raw.gestation.motherName || 'Đạo Lữ',
            startGestationTimestamp: typeof raw.gestation.startGestationTimestamp === 'number' ? raw.gestation.startGestationTimestamp : Date.now(),
            estimatedBirthTimestamp: typeof raw.gestation.estimatedBirthTimestamp === 'number' ? raw.gestation.estimatedBirthTimestamp : Date.now() + 48 * 3600 * 1000,
            durationMs: typeof raw.gestation.durationMs === 'number' ? raw.gestation.durationMs : 48 * 3600 * 1000,
            nurturingLevel: typeof raw.gestation.nurturingLevel === 'number' ? raw.gestation.nurturingLevel : 1,
            consumedPillIds: Array.isArray(raw.gestation.consumedPillIds) ? raw.gestation.consumedPillIds : [],
          } : null,
          children: Array.isArray(raw.children)
            ? raw.children.map((c: any) => ({
                ...c,
                appointmentData: {
                  isGraduated: Boolean(c.appointmentData?.isGraduated),
                  graduationRealmIndex:
                    typeof c.appointmentData?.graduationRealmIndex === 'number'
                      ? c.appointmentData.graduationRealmIndex
                      : 0,
                  assignedRole: c.appointmentData?.assignedRole || 'none',
                  assignedTargetId: c.appointmentData?.assignedTargetId || null,
                  assignedAt: c.appointmentData?.assignedAt,
                  loyalty:
                    typeof c.appointmentData?.loyalty === 'number'
                      ? c.appointmentData.loyalty
                      : 100,
                  meritPoints:
                    typeof c.appointmentData?.meritPoints === 'number'
                      ? c.appointmentData.meritPoints
                      : 0,
                  specialtyBonus: c.appointmentData?.specialtyBonus || {},
                },
              }))
            : [],
          deployedChildId: raw.deployedChildId || null,
          demonicKarma: typeof raw.demonicKarma === 'number' ? Math.max(0, Math.min(100, raw.demonicKarma)) : 0,
          lastSongTuTimestamp: typeof raw.lastSongTuTimestamp === 'number' ? raw.lastSongTuTimestamp : 0,
          activeDualCultivationBuff: raw.activeDualCultivationBuff || null,
        };
      }
      return {
        gestation: null,
        children: [],
        deployedChildId: null,
        demonicKarma: 0,
        lastSongTuTimestamp: 0,
        activeDualCultivationBuff: null,
      };
    })(),
    ancestralState: (() => {
      const raw = (data as any).ancestralState;
      if (raw && typeof raw === 'object') {
        const activeBuff = raw.activeBuff && typeof raw.activeBuff === 'object' ? raw.activeBuff : null;
        const isStillActive = activeBuff && typeof activeBuff.expiresAt === 'number' && activeBuff.expiresAt > Date.now();
        return {
          activeBuff: isStillActive ? {
            incenseId: activeBuff.incenseId,
            incenseName: activeBuff.incenseName || 'Nhang Cúng Tế',
            startTime: typeof activeBuff.startTime === 'number' ? activeBuff.startTime : Date.now(),
            expiresAt: activeBuff.expiresAt,
            protectionCharges: typeof activeBuff.protectionCharges === 'number' ? Math.max(0, activeBuff.protectionCharges) : 0,
          } : null,
          totalOfferingsMade: typeof raw.totalOfferingsMade === 'number' ? raw.totalOfferingsMade : 0,
          protectionTriggersCount: typeof raw.protectionTriggersCount === 'number' ? raw.protectionTriggersCount : 0,
        };
      }
      return {
        activeBuff: null,
        totalOfferingsMade: 0,
        protectionTriggersCount: 0,
      };
    })(),
    customSectState: (() => {
      const raw = (data as any).customSectState;
      if (raw && typeof raw === 'object' && Boolean(raw.isFounded)) {
        return {
          isFounded: true,
          sectName: raw.sectName || 'Thanh Vân Tiên Tông',
          mountainName: raw.mountainName || 'Thanh Vân Sơn',
          doctrine: raw.doctrine || 'chinh_dao',
          reputation: typeof raw.reputation === 'number' ? raw.reputation : 0,
          sectVault: raw.sectVault && typeof raw.sectVault === 'object' ? {
            linhThach: typeof raw.sectVault.linhThach === 'number' ? raw.sectVault.linhThach : 0,
            herbs: raw.sectVault.herbs && typeof raw.sectVault.herbs === 'object' ? raw.sectVault.herbs : {},
            ores: raw.sectVault.ores && typeof raw.sectVault.ores === 'object' ? raw.sectVault.ores : {},
            lastHarvestTimestamp: typeof raw.sectVault.lastHarvestTimestamp === 'number' ? raw.sectVault.lastHarvestTimestamp : Date.now(),
            deaconDiscipleId: raw.sectVault.deaconDiscipleId || undefined,
          } : { linhThach: 0, herbs: {}, ores: {}, lastHarvestTimestamp: Date.now() },
          disciples: Array.isArray(raw.disciples)
            ? raw.disciples.map((d: any) => ({
                ...d,
                isDispatchedToWar: Boolean(d.isDispatchedToWar),
                appointmentData: {
                  isGraduated: Boolean(d.appointmentData?.isGraduated),
                  graduationRealmIndex:
                    typeof d.appointmentData?.graduationRealmIndex === 'number'
                      ? d.appointmentData.graduationRealmIndex
                      : 0,
                  assignedRole: d.appointmentData?.assignedRole || 'none',
                  assignedTargetId: d.appointmentData?.assignedTargetId || null,
                  assignedAt: d.appointmentData?.assignedAt,
                  loyalty:
                    typeof d.appointmentData?.loyalty === 'number'
                      ? d.appointmentData.loyalty
                      : (d.stats?.loyalty ?? 100),
                  meritPoints:
                    typeof d.appointmentData?.meritPoints === 'number'
                      ? d.appointmentData.meritPoints
                      : 0,
                  specialtyBonus: d.appointmentData?.specialtyBonus || {},
                },
              }))
            : [],
          chosenInheritorId: raw.chosenInheritorId || null,
          lastRecruitmentTimestamp: typeof raw.lastRecruitmentTimestamp === 'number' ? raw.lastRecruitmentTimestamp : 0,
          facilities: raw.facilities && typeof raw.facilities === 'object' ? {
            mainHallLevel: typeof raw.facilities.mainHallLevel === 'number' ? raw.facilities.mainHallLevel : 1,
            herbGardenFacilityLevel: typeof raw.facilities.herbGardenFacilityLevel === 'number' ? raw.facilities.herbGardenFacilityLevel : 1,
            mineralVeinFacilityLevel: typeof raw.facilities.mineralVeinFacilityLevel === 'number' ? raw.facilities.mineralVeinFacilityLevel : 1,
            guardianArrayLevel: typeof raw.facilities.guardianArrayLevel === 'number' ? raw.facilities.guardianArrayLevel : 1
          } : { mainHallLevel: 1, herbGardenFacilityLevel: 1, mineralVeinFacilityLevel: 1, guardianArrayLevel: 1 },
          wildSpiritMountains: Array.isArray(raw.wildSpiritMountains) && raw.wildSpiritMountains.length > 0
            ? raw.wildSpiritMountains
            : JSON.parse(JSON.stringify(INITIAL_SPIRIT_MOUNTAINS)),
          rivalSects: Array.isArray(raw.rivalSects) && raw.rivalSects.length > 0
            ? raw.rivalSects
            : JSON.parse(JSON.stringify(INITIAL_RIVAL_SECTS)),
          sectWarHistory: Array.isArray(raw.sectWarHistory) ? raw.sectWarHistory : [],
          tributeVault: raw.tributeVault && typeof raw.tributeVault === 'object' ? {
            spiritStones: typeof raw.tributeVault.spiritStones === 'number' ? raw.tributeVault.spiritStones : 0,
            herbs: raw.tributeVault.herbs && typeof raw.tributeVault.herbs === 'object' ? raw.tributeVault.herbs : {},
            lastTributeTimestamp: typeof raw.tributeVault.lastTributeTimestamp === 'number' ? raw.tributeVault.lastTributeTimestamp : Date.now()
          } : { spiritStones: 0, herbs: {}, lastTributeTimestamp: Date.now() },
          sectMorale: typeof raw.sectMorale === 'number' ? Math.max(0, Math.min(100, raw.sectMorale)) : 75
        };
      }
      return {
        isFounded: false,
        sectName: '',
        mountainName: '',
        doctrine: 'chinh_dao',
        reputation: 0,
        sectVault: { linhThach: 0, herbs: {}, ores: {}, lastHarvestTimestamp: Date.now() },
        disciples: [],
        chosenInheritorId: null,
        lastRecruitmentTimestamp: 0,
        facilities: { mainHallLevel: 1, herbGardenFacilityLevel: 1, mineralVeinFacilityLevel: 1, guardianArrayLevel: 1 },
        wildSpiritMountains: JSON.parse(JSON.stringify(INITIAL_SPIRIT_MOUNTAINS)),
        rivalSects: JSON.parse(JSON.stringify(INITIAL_RIVAL_SECTS)),
        sectWarHistory: [],
        tributeVault: { spiritStones: 0, herbs: {}, lastTributeTimestamp: Date.now() },
        sectMorale: 75
      };
    })(),
    consignmentState: (() => {
      const raw = (data as any).consignmentState;
      if (raw && typeof raw === 'object') {
        return {
          merchantReputation: typeof raw.merchantReputation === 'number' ? Math.max(0, Math.min(100, raw.merchantReputation)) : 50,
          totalSalesVolume: typeof raw.totalSalesVolume === 'number' ? raw.totalSalesVolume : 0,
          successfulAuctionsCount: typeof raw.successfulAuctionsCount === 'number' ? raw.successfulAuctionsCount : 0,
          bustedCount: typeof raw.bustedCount === 'number' ? raw.bustedCount : 0,
          activeSession: raw.activeSession && typeof raw.activeSession === 'object' ? raw.activeSession : null,
          confiscatedItems: Array.isArray(raw.confiscatedItems) ? raw.confiscatedItems : [],
          history: Array.isArray(raw.history) ? raw.history.slice(0, 30) : [],
        };
      }
      return {
        merchantReputation: 50,
        totalSalesVolume: 0,
        successfulAuctionsCount: 0,
        bustedCount: 0,
        activeSession: null,
        confiscatedItems: [],
        history: [],
      };
    })(),
    tuViEmpowermentState: (() => {
      const raw = (data as any).tuViEmpowermentState;
      if (raw && typeof raw === 'object') {
        return {
          unlockedAcupointIds: Array.isArray(raw.unlockedAcupointIds) ? raw.unlockedAcupointIds : [],
          completedMeridianIds: Array.isArray(raw.completedMeridianIds) ? raw.completedMeridianIds : [],
          totalTuViInfusedToCompanions: typeof raw.totalTuViInfusedToCompanions === 'number' ? Math.max(0, raw.totalTuViInfusedToCompanions) : 0,
          totalTuViCrystallized: typeof raw.totalTuViCrystallized === 'number' ? Math.max(0, raw.totalTuViCrystallized) : 0,
          crystallizedCount: typeof raw.crystallizedCount === 'number' ? Math.max(0, raw.crystallizedCount) : 0,
          overdriveActiveTurns: typeof raw.overdriveActiveTurns === 'number' ? raw.overdriveActiveTurns : 0,
          overdriveBuff: raw.overdriveBuff && typeof raw.overdriveBuff === 'object' && Boolean(raw.overdriveBuff.isActive) ? {
            isActive: true,
            tier: typeof raw.overdriveBuff.tier === 'number' ? raw.overdriveBuff.tier : 1,
            statMultiplier: typeof raw.overdriveBuff.statMultiplier === 'number' ? raw.overdriveBuff.statMultiplier : 0.1,
            remainingTurns: typeof raw.overdriveBuff.remainingTurns === 'number' ? raw.overdriveBuff.remainingTurns : 3,
            tuViCostPerTurn: typeof raw.overdriveBuff.tuViCostPerTurn === 'number' ? raw.overdriveBuff.tuViCostPerTurn : 100,
          } : null,
          catalystBonusPercent: typeof raw.catalystBonusPercent === 'number' ? Math.max(0, Math.min(25, raw.catalystBonusPercent)) : 0,
        };
      }
      return createDefaultTuViEmpowermentState();
    })(),
    pillToxicity: typeof data.pillToxicity === 'number' ? Math.max(0, Math.min(100, data.pillToxicity)) : 0,
    qiPurity: typeof data.qiPurity === 'number'
      ? Math.max(10, Math.min(100, data.qiPurity))
      : Math.max(10, 100 - (typeof data.pillToxicity === 'number' ? Math.max(0, Math.min(100, data.pillToxicity)) : 0)),
    consumedMutations: (() => {
      const raw = (data as any).consumedMutations;
      const res: Partial<Record<MutagenicAffixType, number>> = {};
      if (raw && typeof raw === 'object') {
        for (const [k, v] of Object.entries(raw)) {
          if (typeof v === 'number' && !isNaN(v) && v > 0) {
            const cap = MUTATION_HARD_CAPS[k as MutagenicAffixType] || 20;
            res[k as MutagenicAffixType] = Math.min(cap, Number(v.toFixed(2)));
          }
        }
      }
      return res;
    })(),
    flameState: (() => {
      const raw = (data as any).flameState;
      if (!raw || typeof raw !== 'object') {
        return createDefaultHeavenlyFlameState();
      }

      const unlockedFlames: Record<string, any> = {};
      if (raw.unlockedFlames && typeof raw.unlockedFlames === 'object') {
        for (const [fId, inst] of Object.entries(raw.unlockedFlames)) {
          if (HEAVENLY_FLAMES_REGISTRY[fId] && inst && typeof inst === 'object') {
            const rawInst = inst as any;
            const tier = (Number.isInteger(rawInst.tier) && rawInst.tier >= 1 && rawInst.tier <= 9)
              ? (rawInst.tier as FlameTier)
              : 1;
            const maxExp = tier * 250;
            const currentExp = typeof rawInst.currentExp === 'number' ? Math.max(0, Math.min(maxExp, rawInst.currentExp)) : 0;
            unlockedFlames[fId] = {
              flameId: fId,
              tier,
              currentExp,
              maxExp,
              unlockedAuraIds: Array.isArray(rawInst.unlockedAuraIds) ? rawInst.unlockedAuraIds : [],
              totalCraftsWithFlame: typeof rawInst.totalCraftsWithFlame === 'number' ? Math.max(0, rawInst.totalCraftsWithFlame) : 0
            };
          }
        }
      }

      const equippedFlameId = (typeof raw.equippedFlameId === 'string' && unlockedFlames[raw.equippedFlameId])
        ? raw.equippedFlameId
        : null;

      return {
        unlockedFlames,
        equippedFlameId
      };
    })(),
    alchemyTacticsState: (() => {
      const raw = (data as any).alchemyTacticsState;
      if (!raw || typeof raw !== 'object') {
        return {
          defaultStance: 'van_vu_song_hanh',
          customConcoctionsHistory: []
        };
      }
      const allowedStances = ['van_hoa', 'vu_hoa', 'van_vu_song_hanh'];
      const defaultStance = allowedStances.includes(raw.defaultStance)
        ? raw.defaultStance
        : 'van_vu_song_hanh';
      const history = Array.isArray(raw.customConcoctionsHistory)
        ? raw.customConcoctionsHistory.filter((e: any) => e && typeof e === 'object')
        : [];
      return {
        defaultStance,
        customConcoctionsHistory: history
      };
    })(),
    pillTribulationState: (() => {
      const raw = (data as any).pillTribulationState;
      if (!raw || typeof raw !== 'object') {
        return {
          totalTribulationsFaced: 0,
          successfulDefenses: 0,
          danSpirits: [],
          activeTribulation: null
        };
      }
      return {
        totalTribulationsFaced: typeof raw.totalTribulationsFaced === 'number' ? Math.max(0, raw.totalTribulationsFaced) : 0,
        successfulDefenses: typeof raw.successfulDefenses === 'number' ? Math.max(0, raw.successfulDefenses) : 0,
        danSpirits: Array.isArray(raw.danSpirits) ? raw.danSpirits.filter((s: any) => s && typeof s === 'object') : [],
        activeTribulation: raw.activeTribulation && typeof raw.activeTribulation === 'object' ? raw.activeTribulation : null
      };
    })(),
    activeDaoSeed: data.activeDaoSeed || (data as any).activeSeclusionSeed || null,
    activeSeclusionSeed: data.activeDaoSeed || (data as any).activeSeclusionSeed || null,
    harvestedDaoFruits: Array.isArray(data.harvestedDaoFruits) ? data.harvestedDaoFruits : [],
    absorbedDaoAffixes: Array.isArray(data.absorbedDaoAffixes) ? data.absorbedDaoAffixes : [],
    pillUsageInRealm: data.pillUsageInRealm && typeof data.pillUsageInRealm === 'object' ? { ...data.pillUsageInRealm } : {},
    breakthroughBonusPercent: typeof data.breakthroughBonusPercent === 'number' ? Math.max(0, data.breakthroughBonusPercent) : 0,
    hasDeathImmunity: Boolean(data.hasDeathImmunity),
    tribulationDamageReduction: typeof data.tribulationDamageReduction === 'number' ? Math.max(0, data.tribulationDamageReduction) : 0,
    meditationLocationId: typeof (data as any).meditationLocationId === 'string' ? (data as any).meditationLocationId : 'linh_mach_tong_mon',
    meditationStance: typeof (data as any).meditationStance === 'string' ? (data as any).meditationStance : 'co_ban',
    equippedWardItemId: typeof (data as any).equippedWardItemId === 'string' ? (data as any).equippedWardItemId : null,
    meditationEventLogs: Array.isArray((data as any).meditationEventLogs) ? (data as any).meditationEventLogs : [],
    meditationState: (() => {
      const raw = (data as any).meditationState;
      if (raw && typeof raw === 'object') {
        return {
          isMeditating: Boolean(raw.isMeditating),
          startTime: typeof raw.startTime === 'number' ? raw.startTime : 0,
          locationId: raw.locationId || (data as any).meditationLocationId || 'linh_mach_tong_mon',
          stance: raw.stance || (data as any).meditationStance || 'co_ban',
          wardItemId: raw.wardItemId ?? (data as any).equippedWardItemId ?? null,
          targetHours: typeof raw.targetHours === 'number' ? raw.targetHours : 8,
          lastTickTime: typeof raw.lastTickTime === 'number' ? raw.lastTickTime : 0
        };
      }
      return {
        isMeditating: false,
        startTime: 0,
        locationId: (data as any).meditationLocationId || 'linh_mach_tong_mon',
        stance: (data as any).meditationStance || 'co_ban',
        wardItemId: (data as any).equippedWardItemId || null
      };
    })(),
    cultivationBuffState: (() => {
      const raw = (data as any).cultivationBuffState;
      const now = Date.now();
      if (raw && typeof raw === 'object') {
        return {
          activeArrays: Array.isArray(raw.activeArrays)
            ? raw.activeArrays
                .filter((a: any) => a && (a.isPermanent || a.expiresAt === Infinity || (typeof a.expiresAt === 'number' && a.expiresAt > now)))
                .map((a: any) => ({
                  ...a,
                  isPermanent: Boolean(a.isPermanent || a.expiresAt === Infinity),
                  reforgeTier: typeof a.reforgeTier === 'number' ? a.reforgeTier : 0,
                  offlineAbsorptionBonus: typeof a.offlineAbsorptionBonus === 'number' ? a.offlineAbsorptionBonus : 0,
                  reforgedAt: typeof a.reforgedAt === 'number' ? a.reforgedAt : undefined,
                }))
            : [],
          learnedManualIds: Array.isArray(raw.learnedManualIds)
            ? Array.from(new Set(raw.learnedManualIds.filter((id: any) => typeof id === 'string')))
            : [],
          meditationEfficiencyModifier: typeof raw.meditationEfficiencyModifier === 'number'
            ? raw.meditationEfficiencyModifier
            : 0,
        };
      }
      return {
        activeArrays: [],
        learnedManualIds: [],
        meditationEfficiencyModifier: 0,
      };
    })(),
    manualsState: (() => {
      const raw = (data as any).manualsState;
      if (raw && typeof raw === 'object') {
        return {
          learnedManualIds: Array.isArray(raw.learnedManualIds)
            ? Array.from(new Set(raw.learnedManualIds.filter((id: any) => typeof id === 'string')))
            : [],
          equippedManualIds: Array.isArray(raw.equippedManualIds)
            ? Array.from(new Set(raw.equippedManualIds.filter((id: any) => typeof id === 'string')))
            : [],
        };
      }
      return {
        learnedManualIds: [],
        equippedManualIds: [],
      };
    })(),
    divineAbilitiesState: ((): PlayerDivineAbilitiesState => {
      const raw = (data as any).divineAbilitiesState;
      const maxSlots = getMaxDivineAbilitySlots(currentRealm);
      if (raw && typeof raw === 'object') {
        const learned: string[] = Array.isArray(raw.learnedDivineIds)
          ? Array.from(new Set<string>(raw.learnedDivineIds.filter((id: any): id is string => typeof id === 'string')))
          : [];
        let equipped: string[] = Array.isArray(raw.equippedDivineIds)
          ? Array.from(new Set<string>(raw.equippedDivineIds.filter((id: any): id is string => typeof id === 'string' && learned.includes(id))))
          : [];
        if (equipped.length > maxSlots) {
          equipped = equipped.slice(0, maxSlots);
        }
        return {
          learnedDivineIds: learned,
          equippedDivineIds: equipped,
        };
      }
      return {
        learnedDivineIds: [],
        equippedDivineIds: [],
      };
    })(),
    beastsState: (() => {
      const raw = (data as any).beastsState;
      if (raw && typeof raw === 'object') {
        return {
          ownedBeastIds: Array.isArray(raw.ownedBeastIds)
            ? Array.from(new Set<string>(raw.ownedBeastIds.filter((id: any): id is string => typeof id === 'string')))
            : [],
          activeCombatBeastId: typeof raw.activeCombatBeastId === 'string' ? raw.activeCombatBeastId : undefined,
          activeMountBeastId: typeof raw.activeMountBeastId === 'string' ? raw.activeMountBeastId : undefined,
        };
      }
      return {
        ownedBeastIds: [],
        activeCombatBeastId: undefined,
        activeMountBeastId: undefined,
      };
    })(),
    storageState: (() => {
      const raw = (data as any).storageState;
      if (raw && typeof raw === 'object') {
        return {
          unlockedStorageIds: Array.isArray(raw.unlockedStorageIds)
            ? Array.from(new Set<string>(raw.unlockedStorageIds.filter((id: any): id is string => typeof id === 'string')))
            : [],
          totalBonusGeneralSlots: typeof raw.totalBonusGeneralSlots === 'number' && !isNaN(raw.totalBonusGeneralSlots) ? raw.totalBonusGeneralSlots : 0,
          totalBonusHerbSlots: typeof raw.totalBonusHerbSlots === 'number' && !isNaN(raw.totalBonusHerbSlots) ? raw.totalBonusHerbSlots : 0,
          totalBonusOreSlots: typeof raw.totalBonusOreSlots === 'number' && !isNaN(raw.totalBonusOreSlots) ? raw.totalBonusOreSlots : 0,
        };
      }
      return {
        unlockedStorageIds: [],
        totalBonusGeneralSlots: 0,
        totalBonusHerbSlots: 0,
        totalBonusOreSlots: 0,
      };
    })(),
    craftingSupplySettings: {
      autoBuyMissing: Boolean(data.craftingSupplySettings?.autoBuyMissing)
    },
    demonicNature: typeof data.demonicNature === 'number' ? Math.max(0, Math.min(100, data.demonicNature)) : 0,
    dualEventsHistory: Array.isArray(data.dualEventsHistory) ? data.dualEventsHistory : [],
    lastDualEventTimestamp: typeof data.lastDualEventTimestamp === 'number' ? data.lastDualEventTimestamp : 0,
    protectiveAuraActive: Boolean(data.protectiveAuraActive),
    activeResonances: Array.isArray(data.activeResonances) ? data.activeResonances : [],
    resonanceLevel: typeof data.resonanceLevel === 'number' ? data.resonanceLevel : 1,
    beastGarden: (() => {
      const garden = (data as any).beastGarden;
      const facility = garden?.facility ? {
        level: typeof garden.facility.level === 'number' ? garden.facility.level : 1,
        maxBreedingSlots: typeof garden.facility.maxBreedingSlots === 'number' ? garden.facility.maxBreedingSlots : 2,
        incubationSpeedMultiplier: typeof garden.facility.incubationSpeedMultiplier === 'number' ? garden.facility.incubationSpeedMultiplier : 1.0,
        mutationRateBonus: typeof garden.facility.mutationRateBonus === 'number' ? garden.facility.mutationRateBonus : 0,
      } : {
        level: 1,
        maxBreedingSlots: 2,
        incubationSpeedMultiplier: 1.0,
        mutationRateBonus: 0
      };

      const rawEggs = Array.isArray(garden?.eggs)
        ? garden.eggs
        : Array.isArray(data.beastEggs)
          ? data.beastEggs
          : [];

      return {
        facility,
        beasts: [], // Sẽ được đồng bộ với beasts ở return autoCatchUpStorylineForHighRealm
        eggs: rawEggs.map((egg: any) => ({
          ...egg,
          id: egg.id || `egg_${Date.now()}_${Math.random()}`,
          name: egg.name || 'Linh Noãn',
          quality: egg.quality || egg.rarity || 'trung_pham',
          rarity: typeof egg.rarity === 'number' ? egg.rarity : 2,
          incubateStartTime: typeof egg.incubateStartTime === 'number' ? egg.incubateStartTime : Date.now(),
          incubateDuration: typeof egg.incubateDuration === 'number' ? egg.incubateDuration : 180000,
          isHatched: Boolean(egg.isHatched),
          isHeretical: Boolean(egg.isHeretical),
          predictedMutations: Array.isArray(egg.predictedMutations) ? egg.predictedMutations : [],
          parents: egg.parents || { fatherName: 'Linh Thú Cha', motherName: 'Linh Thú Mẹ', element: 'Hỏa' },
          inheritedTraits: egg.inheritedTraits || undefined
        })),
        activeMountId: garden?.activeMountId || data.beastsState?.activeMountBeastId || null,
        activeCombatId: garden?.activeCombatId || data.beastsState?.activeCombatBeastId || data.activeBeastId || null,
        breedingPairs: Array.isArray(garden?.breedingPairs) ? garden.breedingPairs : []
      };
    })(),
    blackMarketState: data.blackMarketState || null,
    bustRiskMeter: typeof data.bustRiskMeter === 'number' ? Math.max(0, Math.min(100, data.bustRiskMeter)) : 0,
    contrabandHistory: Array.isArray(data.contrabandHistory) ? data.contrabandHistory : [],
    gameDays: typeof data.gameDays === 'number' ? data.gameDays : (typeof data.dayCount === 'number' ? data.dayCount : 1),
    dayCount: typeof data.dayCount === 'number' ? data.dayCount : (typeof data.gameDays === 'number' ? data.gameDays : 1),
    spiritStones: typeof data.spiritStones === 'number' ? data.spiritStones : (typeof data.linhThach === 'number' ? data.linhThach : 0),
    customSanctuary: (() => {
      const raw = (data as any).customSanctuary;
      if (raw && typeof raw === 'object') {
        const veinTier = (Number.isInteger(raw.veinTier) && raw.veinTier >= 1 && raw.veinTier <= 9) ? (raw.veinTier as SanctuaryVeinTier) : 1;
        const unlockedSockets = Number.isInteger(raw.unlockedSockets) ? Math.max(1, Math.min(5, raw.unlockedSockets)) : Math.min(5, Math.ceil(veinTier / 2));
        const rawSocketed = Array.isArray(raw.socketedArrays) ? raw.socketedArrays : [];
        const formations = Array.isArray(data.inventory?.formations) ? data.inventory!.formations : [];
        const socketedArrays = rawSocketed.filter((item: any) => {
          if (!item || typeof item.socketIndex !== 'number' || typeof item.arrayItemId !== 'string') return false;
          if (formations.length > 0 && !formations.some((f: any) => f.id === item.arrayItemId)) {
            return false;
          }
          return true;
        });
        return {
          veinTier,
          veinExp: typeof raw.veinExp === 'number' ? Math.max(0, raw.veinExp) : 0,
          unlockedSockets,
          socketedArrays,
          activeResonances: Array.isArray(raw.activeResonances) ? raw.activeResonances : [],
          customLocationName: typeof raw.customLocationName === 'string' ? raw.customLocationName : ''
        };
      }
      return {
        veinTier: 1,
        veinExp: 0,
        unlockedSockets: 1,
        socketedArrays: [],
        activeResonances: [],
        customLocationName: ''
      };
    })(),
    customRecipeState: (() => {
      const raw = (data as any).customRecipeState;
      if (raw && typeof raw === 'object') {
        return {
          discoveredRecipes: Array.isArray(raw.discoveredRecipes) ? raw.discoveredRecipes : [],
          totalResearchAttempts: typeof raw.totalResearchAttempts === 'number' ? Math.max(0, raw.totalResearchAttempts) : 0,
          sectArchivedRecipeIds: Array.isArray(raw.sectArchivedRecipeIds) ? raw.sectArchivedRecipeIds : []
        };
      }
      return {
        discoveredRecipes: [],
        totalResearchAttempts: 0,
        sectArchivedRecipeIds: []
      };
    })(),
    breakthroughCatalystState: (() => {
      const raw = (data as any).breakthroughCatalystState;
      if (raw && typeof raw === 'object') {
        return {
          totalCatalystBreakthroughs: typeof raw.totalCatalystBreakthroughs === 'number' ? Math.max(0, raw.totalCatalystBreakthroughs) : 0,
          protectedFailuresCount: typeof raw.protectedFailuresCount === 'number' ? Math.max(0, raw.protectedFailuresCount) : 0,
        };
      }
      return {
        totalCatalystBreakthroughs: 0,
        protectedFailuresCount: 0,
      };
    })(),
  };

  // Đồng bộ beastGarden.beasts với result.beasts
  if (result.beastGarden) {
    result.beastGarden.beasts = result.beasts || [];
  }

  const migratedGuardianResult = migrateMeditationGuardianData(result);
  const migratedResult = migrateCustomRecipeData(migratedGuardianResult);
  const toxicityResult = migrateToxicityFormulaUpdate(migratedResult);
  const inscriptionResult = migrateFormationInscriptionData(toxicityResult);
  const soulResult = migrateSoulInfusionData(inscriptionResult);
  const legacyTemperingResult = migrateLegacyTemperingData(soulResult);
  const weaponTribulationResult = migrateWeaponTribulationArrayData(legacyTemperingResult);
  const breakthroughCatalystResult = migrateBreakthroughCatalystData(weaponTribulationResult);
  const backlashResult = migrateBreakthroughBacklashData(breakthroughCatalystResult);
  return migrateDaoFoundationData(backlashResult);
};

/**
 * Migration an toàn cho phân hệ Khai Sáng Đan Phương & Đan Đạo Tông Sư (Save Idempotency)
 */
export function migrateCustomRecipeData(player: PlayerStats): PlayerStats {
  const updated: PlayerStats = { ...player };

  if (!updated.customRecipeState || typeof updated.customRecipeState !== 'object') {
    updated.customRecipeState = {
      discoveredRecipes: [],
      totalResearchAttempts: 0,
      sectArchivedRecipeIds: []
    };
  } else {
    updated.customRecipeState = {
      discoveredRecipes: Array.isArray(updated.customRecipeState.discoveredRecipes)
        ? updated.customRecipeState.discoveredRecipes
        : [],
      totalResearchAttempts: typeof updated.customRecipeState.totalResearchAttempts === 'number'
        ? Math.max(0, updated.customRecipeState.totalResearchAttempts)
        : 0,
      sectArchivedRecipeIds: Array.isArray(updated.customRecipeState.sectArchivedRecipeIds)
        ? updated.customRecipeState.sectArchivedRecipeIds
        : []
    };
  }

  return updated;
}

/**
 * Migration an toàn cho phân hệ Đạo Lữ & Linh Thú Hộ Pháp (Hard Invariant 1)
 */
export function migrateMeditationGuardianData(player: PlayerStats): PlayerStats {
  const updated: PlayerStats = { ...player };

  // 1. Gán giá trị an toàn cho các trường hộ pháp
  if (updated.accompanyingCompanionId === undefined) {
    updated.accompanyingCompanionId = null;
  }
  if (updated.accompanyingBeastId === undefined) {
    updated.accompanyingBeastId = null;
  }
  if (typeof updated.guardianRescueCount !== 'number') {
    updated.guardianRescueCount = 0;
  }

  // 2. Chuẩn hóa meditationState
  if (updated.meditationState) {
    if (updated.meditationState.accompanyingCompanionId === undefined) {
      updated.meditationState.accompanyingCompanionId = updated.accompanyingCompanionId;
    }
    if (updated.meditationState.accompanyingBeastId === undefined) {
      updated.meditationState.accompanyingBeastId = updated.accompanyingBeastId;
    }
    if (typeof updated.meditationState.guardianRescueCount !== 'number') {
      updated.meditationState.guardianRescueCount = updated.guardianRescueCount;
    }
  } else {
    updated.meditationState = {
      isMeditating: false,
      startTime: 0,
      locationId: 'linh_mach_tong_mon',
      stance: 'co_ban',
      wardItemId: null,
      accompanyingCompanionId: null,
      accompanyingBeastId: null,
      guardianRescueCount: 0
    };
  }

  // 3. Dọn sạch cờ khóa mồ côi (orphaned lock cleanup) nếu không đang nhập định
  if (!updated.meditationState?.isMeditating) {
    if (updated.companionsState?.companions) {
      Object.keys(updated.companionsState.companions).forEach(id => {
        if (updated.companionsState!.companions[id]) {
          updated.companionsState!.companions[id].isAssignedToMeditation = false;
        }
      });
    }
    if (updated.beastGarden?.beasts) {
      updated.beastGarden.beasts.forEach((b: any) => {
        if (b) b.isAssignedToMeditation = false;
      });
    }
    if (updated.beasts) {
      updated.beasts.forEach((b: any) => {
        if (b) b.isAssignedToMeditation = false;
      });
    }
    updated.accompanyingCompanionId = null;
    updated.accompanyingBeastId = null;
    if (updated.meditationState) {
      updated.meditationState.accompanyingCompanionId = null;
      updated.meditationState.accompanyingBeastId = null;
    }
  }

  // 4. Chuẩn hóa Tàng Bảo Các & Thượng Cổ Bí Cảnh (ancientMapVault)
  if (!updated.ancientMapVault || typeof updated.ancientMapVault !== 'object') {
    updated.ancientMapVault = {
      fragmentsInventory: {},
      synthesizedMaps: [],
      activeDungeon: null,
      clearedDungeonsCount: 0
    };
  }

  return updated;
}

/**
 * Tự động phục hồi cảnh giới nếu phát hiện dữ liệu lưu bị lỗi/hỏng (Chỉ chạy 1 lần duy nhất lúc nạp save)
 * Tuyệt đối không tự ý hạ cảnh giới dựa theo số tu vi hiện có.
 */
export const repairCorruptedSaveData = (parsed: any): any => {
  if (!parsed || typeof parsed !== 'object') return parsed;

  const rawRealm = Number(parsed.currentRealm);
  const validRealm = Number.isInteger(rawRealm) && !isNaN(rawRealm) ? Math.max(0, Math.min(realmsData.length - 1, rawRealm)) : -1;
  const isCorrupted = validRealm === -1 || parsed.currentRealm === null || parsed.currentRealm === undefined || isNaN(rawRealm);

  let healedRealm = validRealm >= 0 ? validRealm : 0;

  // Dấu hiệu A: Thành tựu cảnh giới đã ghi nhận trong claimedAchievementIds hoặc unlockedAchievementIds
  const claimedAchievements = parsed.achievementsState?.claimedAchievementIds || [];
  const unlockedAchievements = parsed.achievementsState?.unlockedAchievementIds || [];
  const allAchievements = [
    ...(Array.isArray(claimedAchievements) ? claimedAchievements : []),
    ...(Array.isArray(unlockedAchievements) ? unlockedAchievements : [])
  ];

  if (allAchievements.includes('ach_realm_deto')) {
    healedRealm = Math.max(healedRealm, 101); // Đế Tổ Sơ Kỳ (id: 101)
  } else if (allAchievements.includes('ach_realm_tiende')) {
    healedRealm = Math.max(healedRealm, 96);  // Tiên Đế Sơ Kỳ (id: 96)
  } else if (allAchievements.includes('ach_realm_hoathan')) {
    healedRealm = Math.max(healedRealm, 26);  // Hóa Thần Sơ Kỳ (id: 26)
  } else if (allAchievements.includes('ach_realm_nguyenanh')) {
    healedRealm = Math.max(healedRealm, 21);  // Nguyên Anh Sơ Kỳ (id: 21)
  } else if (allAchievements.includes('ach_realm_kimdan')) {
    healedRealm = Math.max(healedRealm, 16);  // Kim Đan Sơ Kỳ (id: 16)
  } else if (allAchievements.includes('ach_realm_trucco')) {
    healedRealm = Math.max(healedRealm, 11);  // Trúc Cơ Sơ Kỳ (id: 11)
  } else if (allAchievements.includes('ach_realm_luyenkhi_max')) {
    healedRealm = Math.max(healedRealm, 10);  // Luyện Khí Viên Mãn (id: 10)
  } else if (allAchievements.includes('ach_realm_luyenkhi')) {
    healedRealm = Math.max(healedRealm, 1);   // Luyện Khí Tầng 1 (id: 1)
  }

  // Dấu hiệu B: Số lần đột phá thành công trong quá khứ
  const successes = parsed.achievementsState?.stats?.breakthroughsSuccess;
  if (typeof successes === 'number' && successes > 0) {
    healedRealm = Math.max(healedRealm, Math.min(realmsData.length - 1, successes));
  }

  // Dấu hiệu C: Danh hiệu cảnh giới cao đã mở khóa hoặc trang bị
  const unlockedTitles = parsed.achievementsState?.unlockedTitleIds || [];
  const equippedTitle = parsed.achievementsState?.equippedTitleId;
  const allTitles = [...(Array.isArray(unlockedTitles) ? unlockedTitles : []), equippedTitle].filter(Boolean);
  if (allTitles.includes('title_truong_sinh')) {
    healedRealm = Math.max(healedRealm, 101); // Đế Tổ
  } else if (allTitles.includes('title_kiem_tien')) {
    healedRealm = Math.max(healedRealm, 16);  // Kim Đan
  }

  // Dấu hiệu D: Nếu người chơi có thành tựu Hóa Thần nhưng cảnh giới thấp hơn index mới -> phục hồi về 26
  if (allAchievements.includes('ach_realm_hoathan') && (validRealm < 26 || isCorrupted)) {
    healedRealm = Math.max(healedRealm, 26);
  }

  // Chỉ phục hồi khi cảnh giới phục hồi cao hơn cảnh giới hiện tại hoặc dữ liệu bị hỏng
  if (healedRealm > validRealm || isCorrupted) {
    parsed.currentRealm = healedRealm;
  }

  return parsed;
};

/**
 * Tải dữ liệu lưu trữ từ localStorage (tự động fallback các key cũ v1..v6)
 */
export const loadGameSave = (): { player: PlayerStats; isNew: boolean } => {
  if (typeof window === 'undefined') {
    return { player: createNewPlayer(), isNew: true };
  }

  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const found = localStorage.getItem(legacyKey);
        if (found) {
          saved = found;
          break;
        }
      }
    }

    if (saved) {
      let parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        parsed = repairCorruptedSaveData(parsed);
        const normalized = normalizePlayerData(parsed);
        // Lưu ngược lại chuẩn v7
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return { player: normalized, isNew: false };
      }
    }
  } catch (e) {
    console.error('Không thể đọc lưu trữ:', e);
  }

  const fresh = createNewPlayer();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch (e) {
    console.error('Không thể khởi tạo lưu trữ:', e);
  }
  return { player: fresh, isNew: true };
};

/**
 * Lưu dữ liệu người chơi vào localStorage
 */
export const saveGameData = (player: PlayerStats, updateTimestamp: boolean = true): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const toSave: PlayerStats = updateTimestamp
      ? { ...player, lastActiveTimestamp: Date.now() }
      : player;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (e) {
    console.error('Lỗi lưu trữ:', e);
    return false;
  }
};

/**
 * Xuất dữ liệu nhân vật thành chuỗi JSON
 */
export const exportSaveToJson = (player: PlayerStats): string => {
  return JSON.stringify(player, null, 2);
};

/**
 * Nhập dữ liệu nhân vật từ chuỗi JSON và chuẩn hóa
 */
export const importSaveFromJson = (jsonString: string): PlayerStats => {
  let parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Dữ liệu lưu trữ không hợp lệ hoặc cấu trúc sai lệch!');
  }
  parsed = repairCorruptedSaveData(parsed);
  const normalized = normalizePlayerData(parsed);
  saveGameData(normalized);
  return normalized;
};

/**
 * Migration chuyên biệt cho Thú Uyển Động Phủ & Dữ liệu Linh Thú Huyết Mạch
 * Tương thích ngược với các trường cũ (player.mounts, player.pets, player.beasts)
 */
export const migrateBeastGardenData = (player: any): any => {
  if (!player || typeof player !== 'object') return player;

  const rawGarden = player.beastGarden;
  const facility = rawGarden?.facility ? {
    level: typeof rawGarden.facility.level === 'number' ? rawGarden.facility.level : 1,
    maxBreedingSlots: typeof rawGarden.facility.maxBreedingSlots === 'number' ? rawGarden.facility.maxBreedingSlots : 2,
    incubationSpeedMultiplier: typeof rawGarden.facility.incubationSpeedMultiplier === 'number' ? rawGarden.facility.incubationSpeedMultiplier : 1.0,
    mutationRateBonus: typeof rawGarden.facility.mutationRateBonus === 'number' ? rawGarden.facility.mutationRateBonus : 0,
  } : {
    level: 1,
    maxBreedingSlots: 2,
    incubationSpeedMultiplier: 1.0,
    mutationRateBonus: 0
  };

  const existingBeasts = Array.isArray(rawGarden?.beasts) && rawGarden.beasts.length > 0
    ? rawGarden.beasts
    : Array.isArray(player.beasts) && player.beasts.length > 0
      ? player.beasts
      : Array.isArray(player.spiritBeasts) && player.spiritBeasts.length > 0
        ? player.spiritBeasts
        : [];

  const legacyMounts = Array.isArray(player.mounts) ? player.mounts : [];
  const legacyPets = Array.isArray(player.pets) ? player.pets : [];

  const combinedList = [...existingBeasts];

  for (const m of legacyMounts) {
    if (m && m.id && !combinedList.some((b: any) => b.id === m.id)) {
      combinedList.push({
        id: m.id,
        name: m.name || 'Tọa Kỵ Cổ',
        species: m.species || 'mount_legacy',
        role: 'mount',
        canMount: true,
        canFight: false,
        travelSpeedBonus: m.speed || m.travelSpeedBonus || 20,
        quality: m.quality || 'thuong_pham',
        element: m.element || 'Phong',
        tier: m.tier || 2,
        bloodlinePurity: m.bloodlinePurity || 30,
        generation: m.generation || 0,
        isHybrid: false,
        level: m.level || 1,
        stats: { hp: 1000, maxHp: 1000, atk: 50, def: 30, blockPercent: 10, mountSpeedBonus: m.speed || 20, mpRegenBonus: 10 },
        combatStats: { atkBonus: 50, defBonus: 30, hpBonus: 1000, critRate: 5 }
      });
    }
  }

  for (const p of legacyPets) {
    if (p && p.id && !combinedList.some((b: any) => b.id === p.id)) {
      combinedList.push({
        id: p.id,
        name: p.name || 'Linh Sủng Cổ',
        species: p.species || 'pet_legacy',
        role: 'combat',
        canMount: false,
        canFight: true,
        travelSpeedBonus: p.travelSpeedBonus || 15,
        quality: p.quality || 'thuong_pham',
        element: p.element || 'Hỏa',
        tier: p.tier || 2,
        bloodlinePurity: p.bloodlinePurity || 30,
        generation: p.generation || 0,
        isHybrid: false,
        level: p.level || 1,
        stats: { hp: p.hp || 1200, maxHp: p.hp || 1200, atk: p.atk || 120, def: p.def || 60, blockPercent: 15, mountSpeedBonus: 15, mpRegenBonus: 15 },
        combatStats: { atkBonus: p.atk || 120, defBonus: p.def || 60, hpBonus: p.hp || 1200, critRate: 5 }
      });
    }
  }

  const normalizedBeasts = combinedList.map((b: any) => ({
    ...b,
    id: b.id || `beast_${Date.now()}_${Math.random()}`,
    name: b.name || 'Linh Thú',
    species: b.species || b.speciesId || 'beast_default',
    speciesId: b.speciesId || b.species || 'beast_default',
    quality: b.quality || b.rarity || 'trung_pham',
    element: b.element || 'Hỏa',
    stage: typeof b.stage === 'number' && b.stage >= 1 ? b.stage : 1,
    level: typeof b.level === 'number' && b.level >= 1 ? b.level : 1,
    exp: typeof b.exp === 'number' ? b.exp : 0,
    maxExp: typeof b.maxExp === 'number' ? b.maxExp : 1000,
    loyalty: typeof b.loyalty === 'number' ? b.loyalty : 50,
    avatar: b.avatar || '🐾',
    skills: Array.isArray(b.skills) ? b.skills : [],
    stats: b.stats || { hp: 1000, maxHp: 1000, atk: 100, def: 50, blockPercent: 10, mountSpeedBonus: 15, mpRegenBonus: 10 },
    tier: typeof b.tier === 'number' ? b.tier : 2,
    bloodlinePurity: typeof b.bloodlinePurity === 'number' ? b.bloodlinePurity : 30,
    generation: typeof b.generation === 'number' ? b.generation : 0,
    isHybrid: Boolean(b.isHybrid),
    canMount: typeof b.canMount === 'boolean' ? b.canMount : (b.role === 'mount' || b.role === 'both' || (b.stats?.mountSpeedBonus || 0) > 0),
    canFight: typeof b.canFight === 'boolean' ? b.canFight : (b.role !== 'mount'),
    travelSpeedBonus: typeof b.travelSpeedBonus === 'number' ? b.travelSpeedBonus : (b.stats?.mountSpeedBonus || 20),
    combatStats: b.combatStats || {
      atkBonus: b.stats?.atk || 100,
      defBonus: b.stats?.def || 50,
      hpBonus: b.stats?.hp || 1000,
      critRate: 5
    },
    breedingCooldownEnd: typeof b.breedingCooldownEnd === 'number' ? b.breedingCooldownEnd : 0,
    isLockedInBreeding: Boolean(b.isLockedInBreeding),
    innateAura: b.innateAura || undefined
  }));

  const rawEggs = Array.isArray(rawGarden?.eggs)
    ? rawGarden.eggs
    : Array.isArray(player.beastEggs)
      ? player.beastEggs
      : [];

  const normalizedEggs = rawEggs.map((egg: any) => ({
    ...egg,
    id: egg.id || `egg_${Date.now()}_${Math.random()}`,
    name: egg.name || 'Linh Noãn',
    quality: egg.quality || egg.rarity || 'trung_pham',
    rarity: typeof egg.rarity === 'number' ? egg.rarity : 2,
    incubateStartTime: typeof egg.incubateStartTime === 'number' ? egg.incubateStartTime : Date.now(),
    incubateDuration: typeof egg.incubateDuration === 'number' ? egg.incubateDuration : 180000,
    isHatched: Boolean(egg.isHatched),
    predictedMutations: Array.isArray(egg.predictedMutations) ? egg.predictedMutations : [],
    parents: egg.parents || { fatherName: 'Linh Thú Cha', motherName: 'Linh Thú Mẹ', element: 'Hỏa' },
    inheritedTraits: egg.inheritedTraits || undefined
  }));

  return {
    ...player,
    beasts: normalizedBeasts,
    spiritBeasts: normalizedBeasts,
    beastGarden: {
      facility,
      beasts: normalizedBeasts,
      eggs: normalizedEggs,
      activeMountId: rawGarden?.activeMountId || player.beastsState?.activeMountBeastId || null,
      activeCombatId: rawGarden?.activeCombatId || player.beastsState?.activeCombatBeastId || player.activeBeastId || null,
      breedingPairs: Array.isArray(rawGarden?.breedingPairs) ? rawGarden.breedingPairs : []
    }
  };
};

/**
 * Idempotent migration cho phân hệ Biến Cố Song Tu (Dual Cultivation Dynamic Events)
 * Chuẩn hóa các trường an toàn cho Save cũ:
 * - demonicNature: 0..100
 * - dualEventsHistory: []
 * - lastDualEventTimestamp: 0
 * - protectiveAuraActive: false
 * - Đạo lữ: fatigueUntil: 0, totalEpiphanies: 0
 */
export function migrateDualCultivationEventData(player: any): PlayerStats {
  if (!player) return normalizePlayerData({});
  
  const cloned = { ...player };

  // 1. Chuẩn hóa Ma Tính (Demonic Nature Clamping 0 - 100)
  cloned.demonicNature = typeof cloned.demonicNature === 'number'
    ? Math.max(0, Math.min(100, cloned.demonicNature))
    : 0;

  // 2. Chuẩn hóa lịch sử biến cố
  cloned.dualEventsHistory = Array.isArray(cloned.dualEventsHistory)
    ? cloned.dualEventsHistory
    : [];

  // 3. Chuẩn hóa timestamps & hào quang hộ thể
  cloned.lastDualEventTimestamp = typeof cloned.lastDualEventTimestamp === 'number'
    ? cloned.lastDualEventTimestamp
    : 0;
  cloned.protectiveAuraActive = Boolean(cloned.protectiveAuraActive);

  // 4. Chuẩn hóa các trường bổ trợ trên thực thể Đạo Lữ (fatigueUntil, totalEpiphanies)
  if (cloned.companionsState && cloned.companionsState.companions) {
    const comps = { ...cloned.companionsState.companions };
    Object.keys(comps).forEach(id => {
      const c = comps[id];
      if (c) {
        comps[id] = {
          ...c,
          fatigueUntil: typeof c.fatigueUntil === 'number' ? c.fatigueUntil : 0,
          totalEpiphanies: typeof c.totalEpiphanies === 'number' ? c.totalEpiphanies : 0
        };
      }
    });
    cloned.companionsState = {
      ...cloned.companionsState,
      companions: comps
    };
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration Idempotent & Bảo Toàn Dữ Liệu cho Phân Hệ:
 * "Bổ Nhiệm Tiên Đồng Xuất Sư (Disciple Graduation & Dominion Appointment)"
 *
 * 1. Khởi tạo an toàn các trường bổ nhiệm cho danh sách Tiên Đồng / Đệ Tử hiện có
 * 2. Self-Healing: Đồng bộ lại ID người trấn thủ trong dữ liệu cứ điểm Tinh Hải và Tông Môn nếu có save cũ bị lệch tham chiếu
 */
export function migrateDiscipleAppointmentData(player: any): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = { ...player };

  // Tập hợp danh sách ID đệ tử hợp lệ
  const validDiscipleIds = new Set<string>();

  if (cloned.offspringState && Array.isArray(cloned.offspringState.children)) {
    cloned.offspringState.children.forEach((c: any) => {
      if (c && c.id) validDiscipleIds.add(c.id);
    });
  }

  if (cloned.customSectState && Array.isArray(cloned.customSectState.disciples)) {
    cloned.customSectState.disciples.forEach((d: any) => {
      if (d && d.id) validDiscipleIds.add(d.id);
    });
  }

  // 1. Tự phục hồi Khố Phòng Tông Môn (Sect Vault Deacon)
  if (cloned.customSectState?.sectVault) {
    const currentDeaconId = cloned.customSectState.sectVault.deaconDiscipleId;
    if (currentDeaconId && !validDiscipleIds.has(currentDeaconId)) {
      cloned.customSectState.sectVault.deaconDiscipleId = undefined;
    }
  }

  // 2. Tự phục hồi Trấn Thủ Sĩ Tinh Hải (Cosmic Stronghold Guardians)
  if (cloned.cosmicState?.nodeGuardians) {
    const updatedGuardians: Record<string, string> = {};
    Object.entries(cloned.cosmicState.nodeGuardians).forEach(([nodeId, dId]) => {
      if (typeof dId === 'string' && validDiscipleIds.has(dId)) {
        updatedGuardians[nodeId] = dId;
      }
    });
    cloned.cosmicState.nodeGuardians = updatedGuardians;
  }

  if (cloned.cosmicDefenseState?.garrisons) {
    const updatedGarrisons: Record<string, any> = {};
    Object.entries(cloned.cosmicDefenseState.garrisons).forEach(([nodeId, g]: [string, any]) => {
      if (g && g.type === 'disciple') {
        if (g.entityId && validDiscipleIds.has(g.entityId)) {
          updatedGarrisons[nodeId] = g;
        }
      } else {
        updatedGarrisons[nodeId] = g;
      }
    });
    cloned.cosmicDefenseState.garrisons = updatedGarrisons;
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration Idempotent & Bảo Toàn Dữ Liệu cho Phân Hệ:
 * "Dung Hợp Công Pháp (Manual Synthesis / Bàn Diễn Võ Vạn Pháp)"
 *
 * 1. Quét toàn bộ player.manuals và tự động bổ sung an toàn các trường:
 *    isSynthesized, synthesisTier, synthesisParents, innateAura
 *    cho mọi công pháp chưa có (save cũ hoặc bí kíp từ bí cảnh).
 * 2. Đảm bảo player.manualSynthesisLog được khởi tạo an toàn.
 */
export function migrateManualSynthesisData(player: any): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = { ...player };

  // 1. Chuẩn hóa tất cả Manual trong player.manuals
  if (Array.isArray(cloned.manuals)) {
    cloned.manuals = cloned.manuals.map((m: any) => ({
      ...m,
      isSynthesized:    typeof m.isSynthesized === 'boolean' ? m.isSynthesized : false,
      synthesisTier:    typeof m.synthesisTier  === 'number'  ? m.synthesisTier  : 0,
      synthesisParents: m.synthesisParents ?? null,
      innateAura:       m.innateAura ?? null,
    }));
  }

  // 2. Khởi tạo nhật ký dung hợp
  if (!Array.isArray(cloned.manualSynthesisLog)) {
    cloned.manualSynthesisLog = [];
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration Idempotent & Bảo Toàn Dữ Liệu cho Phân Hệ:
 * "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"
 *
 * 1. Tuyệt đối không thay đổi cấu trúc dữ liệu của natalArtifact.spirit hoặc equippedManuals trong save cũ.
 * 2. Bổ sung migration tự động gán các trường an toàn (activeResonances: [], resonanceLevel: 1) khi nạp save game.
 */
export function migrateDomainResonanceData(player: any): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = { ...player };

  if (!Array.isArray(cloned.activeResonances)) {
    cloned.activeResonances = [];
  }

  if (typeof cloned.resonanceLevel !== 'number') {
    cloned.resonanceLevel = 1;
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration Idempotent & Bảo Toàn Dữ Liệu cho Phân Hệ:
 * "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"
 *
 * 1. Khởi tạo an toàn blackMarketState: null, bustRiskMeter: 0, contrabandHistory: []
 * 2. Tự động giải phóng các vật phẩm bị kẹt trong escrow (isLockedInEscrow) nếu phiên chợ bị gián đoạn
 * 3. Hoàn trả tiền ký quỹ nếu phiên chợ đã kết thúc bất thường
 * 4. Bảo tồn toàn vẹn cấu trúc player.inventory, player.spiritStones, beastGarden.eggs
 */
export function migrateBlackMarketData(player: any): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = { ...player };

  // 1. Khởi tạo an toàn các trường Hắc Thị
  if (cloned.blackMarketState === undefined) {
    cloned.blackMarketState = null;
  }
  if (typeof cloned.bustRiskMeter !== 'number') {
    cloned.bustRiskMeter = 0;
  }
  if (!Array.isArray(cloned.contrabandHistory)) {
    cloned.contrabandHistory = [];
  }

  // 2. Đồng bộ spiritStones và linhThach
  if (typeof cloned.spiritStones !== 'number' && typeof cloned.linhThach === 'number') {
    cloned.spiritStones = cloned.linhThach;
  } else if (typeof cloned.linhThach !== 'number' && typeof cloned.spiritStones === 'number') {
    cloned.linhThach = cloned.spiritStones;
  }

  // 3. Giải phóng vật phẩm kẹt trong escrow nếu phiên chợ không hoạt động
  const sessionActive = cloned.blackMarketState && cloned.blackMarketState.isAuctionOpen;
  const activeLotItemIds = new Set(
    sessionActive && Array.isArray(cloned.blackMarketState.activeLots)
      ? cloned.blackMarketState.activeLots.map((l: any) => l.itemId)
      : []
  );

  const unlockItem = (item: any) => {
    if (item && item.isLockedInEscrow && !activeLotItemIds.has(item.id)) {
      return {
        ...item,
        isLockedInEscrow: false
      };
    }
    return item;
  };

  if (Array.isArray(cloned.inventory)) {
    cloned.inventory = cloned.inventory.map(unlockItem);
  } else if (cloned.inventory && typeof cloned.inventory === 'object') {
    ['equipments', 'equipment', 'ores', 'pills', 'herbs', 'manuals'].forEach(cat => {
      if (Array.isArray(cloned.inventory[cat])) {
        cloned.inventory[cat] = cloned.inventory[cat].map(unlockItem);
      }
    });
  }

  // 4. Hoàn trả tiền ký quỹ nếu phiên chợ bị đóng hoặc lỗi
  if (cloned.blackMarketState && !cloned.blackMarketState.isAuctionOpen) {
    if (cloned.blackMarketState.playerEscrowStones > 0) {
      const escrow = cloned.blackMarketState.playerEscrowStones;
      cloned.linhThach = (cloned.linhThach || 0) + escrow;
      cloned.spiritStones = (cloned.spiritStones || 0) + escrow;
      cloned.blackMarketState.playerEscrowStones = 0;
    }
  }

  const result = normalizePlayerData(cloned);

  // Đảm bảo sau normalize, các sub-array trong result.inventory cũng được unlock an toàn
  if (result.inventory && typeof result.inventory === 'object') {
    ['equipments', 'equipment', 'ores', 'pills', 'herbs', 'manuals'].forEach(cat => {
      if (Array.isArray((result.inventory as any)[cat])) {
        (result.inventory as any)[cat] = (result.inventory as any)[cat].map(unlockItem);
      }
    });
  }

  return result;
}

/**
 * Migration an toàn cho phân hệ Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense)
 * Bổ sung idempotent các trường sectorResonanceGrid, resonanceLinks, crossFireEnergyBuffer
 */
export function migrateSectorResonanceData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

  if (cloned.cosmicState) {
    if (!cloned.cosmicState.defenseState) {
      cloned.cosmicState.defenseState = {
        fortifications: {},
        garrisons: {},
        activeIncursions: [],
        lastIncursionCheckTime: Date.now(),
        incursionsRepelledCount: 0,
        incursionsBreachedCount: 0,
        sectorResonanceGrid: [],
        resonanceLinks: [],
        crossFireEnergyBuffer: 0,
      };
    } else {
      const def = cloned.cosmicState.defenseState;
      if (!Array.isArray(def.sectorResonanceGrid)) {
        def.sectorResonanceGrid = Array.isArray(def.resonanceLinks) ? def.resonanceLinks : [];
      }
      if (!Array.isArray(def.resonanceLinks)) {
        def.resonanceLinks = Array.isArray(def.sectorResonanceGrid) ? def.sectorResonanceGrid : [];
      }
      if (typeof def.crossFireEnergyBuffer !== 'number' || isNaN(def.crossFireEnergyBuffer)) {
        def.crossFireEnergyBuffer = 0;
      }
    }
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại (Sect Wars)
 * Bổ sung idempotent các trường wildSpiritMountains, rivalSects, sectWarHistory, tributeVault, sectMorale
 */
export function migrateSectWarData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

  if (cloned.customSectState) {
    if (!Array.isArray(cloned.customSectState.wildSpiritMountains) || cloned.customSectState.wildSpiritMountains.length === 0) {
      cloned.customSectState.wildSpiritMountains = JSON.parse(JSON.stringify(INITIAL_SPIRIT_MOUNTAINS));
    }
    if (!Array.isArray(cloned.customSectState.rivalSects) || cloned.customSectState.rivalSects.length === 0) {
      cloned.customSectState.rivalSects = JSON.parse(JSON.stringify(INITIAL_RIVAL_SECTS));
    }
    if (!Array.isArray(cloned.customSectState.sectWarHistory)) {
      cloned.customSectState.sectWarHistory = [];
    }
    if (!cloned.customSectState.tributeVault || typeof cloned.customSectState.tributeVault !== 'object') {
      cloned.customSectState.tributeVault = {
        spiritStones: 0,
        herbs: {},
        lastTributeTimestamp: Date.now()
      };
    }
    if (typeof cloned.customSectState.sectMorale !== 'number') {
      cloned.customSectState.sectMorale = 75;
    }
    if (Array.isArray(cloned.customSectState.disciples)) {
      cloned.customSectState.disciples = cloned.customSectState.disciples.map((d: any) => ({
        ...d,
        isDispatchedToWar: Boolean(d.isDispatchedToWar)
      }));
    }
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ Tuế Nguyệt Bế Quan: "Tam Hóa Chi Cảnh"
 * Bổ sung idempotent các trường: pillToxicity, qiPurity, activeDaoSeed, harvestedDaoFruits, absorbedDaoAffixes
 */
export function migrateSeclusionEnhancementData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;
  const toxicity = typeof cloned.pillToxicity === 'number' ? Math.max(0, Math.min(100, cloned.pillToxicity)) : 0;
  cloned.pillToxicity = toxicity;
  cloned.qiPurity = typeof cloned.qiPurity === 'number'
    ? Math.max(10, Math.min(100, cloned.qiPurity))
    : Math.max(10, 100 - toxicity);
  cloned.activeDaoSeed = cloned.activeDaoSeed || (cloned as any).activeSeclusionSeed || null;
  cloned.activeSeclusionSeed = cloned.activeDaoSeed;
  cloned.harvestedDaoFruits = Array.isArray(cloned.harvestedDaoFruits) ? cloned.harvestedDaoFruits : [];
  cloned.absorbedDaoAffixes = Array.isArray(cloned.absorbedDaoAffixes) ? cloned.absorbedDaoAffixes : [];

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà (Strategic AFK Meditation)
 * Bổ sung idempotent các trường: meditationLocationId, meditationStance, equippedWardItemId, meditationEventLogs, meditationState
 */
export function migrateMeditationData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;
  cloned.meditationLocationId = typeof cloned.meditationLocationId === 'string' ? cloned.meditationLocationId : 'linh_mach_tong_mon';
  cloned.meditationStance = typeof cloned.meditationStance === 'string' ? cloned.meditationStance : 'co_ban';
  cloned.equippedWardItemId = typeof cloned.equippedWardItemId === 'string' ? cloned.equippedWardItemId : null;
  cloned.meditationEventLogs = Array.isArray(cloned.meditationEventLogs) ? cloned.meditationEventLogs : [];
  if (!cloned.meditationState || typeof cloned.meditationState !== 'object') {
    cloned.meditationState = {
      isMeditating: false,
      startTime: 0,
      locationId: cloned.meditationLocationId,
      stance: cloned.meditationStance,
      wardItemId: cloned.equippedWardItemId
    };
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ Linh Mạch Động Phủ Tự Chế (Custom Sanctuary & Vein Socketing)
 * Tự động chuẩn hóa an toàn cấu trúc customSanctuary, dọn sạch các ID Trận Bàn ma nếu vật phẩm không còn tồn tại trong kho
 */
export function migrateCustomSanctuaryData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;
  const raw = cloned.customSanctuary;
  if (!raw || typeof raw !== 'object') {
    cloned.customSanctuary = {
      veinTier: 1,
      veinExp: 0,
      unlockedSockets: 1,
      socketedArrays: [],
      activeResonances: [],
      customLocationName: ''
    };
  } else {
    const veinTier = (Number.isInteger(raw.veinTier) && raw.veinTier >= 1 && raw.veinTier <= 9) ? raw.veinTier : 1;
    const unlockedSockets = Number.isInteger(raw.unlockedSockets) ? Math.max(1, Math.min(5, raw.unlockedSockets)) : Math.min(5, Math.ceil(veinTier / 2));
    const rawSocketed = Array.isArray(raw.socketedArrays) ? raw.socketedArrays : [];
    const formations = Array.isArray(cloned.inventory?.formations) ? cloned.inventory!.formations : [];

    const socketedArrays = rawSocketed.filter((item: any) => {
      if (!item || typeof item.socketIndex !== 'number' || typeof item.arrayItemId !== 'string') return false;
      // Dọn sạch các ID Trận Bàn ma nếu danh sách formations tồn tại và không chứa ID này
      if (formations.length > 0 && !formations.some((f: any) => f.id === item.arrayItemId)) {
        return false;
      }
      return true;
    });

    cloned.customSanctuary = {
      veinTier: veinTier as SanctuaryVeinTier,
      veinExp: typeof raw.veinExp === 'number' ? Math.max(0, raw.veinExp) : 0,
      unlockedSockets,
      socketedArrays,
      activeResonances: Array.isArray(raw.activeResonances) ? raw.activeResonances : [],
      customLocationName: typeof raw.customLocationName === 'string' ? raw.customLocationName : ''
    };
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ "Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh" (Secret Realm Map Fragments & Ancient Dungeons)
 * Đảm bảo tính lũy thừa (Idempotent), tự động chuẩn hóa cấu trúc ancientMapVault khi nạp save game cũ.
 */
export function migrateAncientMapDungeonData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;
  const raw = cloned.ancientMapVault;

  if (!raw || typeof raw !== 'object') {
    cloned.ancientMapVault = {
      fragmentsInventory: {},
      synthesizedMaps: [],
      activeDungeon: null,
      clearedDungeonsCount: 0
    };
  } else {
    // 1. Chuẩn hóa fragmentsInventory
    const fragmentsInventory: Record<string, number> = {};
    if (raw.fragmentsInventory && typeof raw.fragmentsInventory === 'object') {
      for (const [key, val] of Object.entries(raw.fragmentsInventory)) {
        if (typeof key === 'string' && typeof val === 'number' && val > 0 && !isNaN(val)) {
          fragmentsInventory[key] = Math.floor(val);
        }
      }
    }

    // 2. Chuẩn hóa synthesizedMaps
    const synthesizedMaps = Array.isArray(raw.synthesizedMaps)
      ? raw.synthesizedMaps.filter((m: any) => m && typeof m.id === 'string' && typeof m.setId === 'string')
      : [];

    // 3. Chuẩn hóa activeDungeon (xóa nếu đã hết hạn hoặc không hợp lệ)
    let activeDungeon = null;
    if (raw.activeDungeon && typeof raw.activeDungeon === 'object' && typeof raw.activeDungeon.instanceId === 'string') {
      const now = Date.now();
      if (!raw.activeDungeon.isCompleted && typeof raw.activeDungeon.expiresAt === 'number' && raw.activeDungeon.expiresAt > now) {
        activeDungeon = raw.activeDungeon;
      }
    }

    cloned.ancientMapVault = {
      fragmentsInventory,
      synthesizedMaps,
      activeDungeon,
      clearedDungeonsCount: typeof raw.clearedDungeonsCount === 'number' && raw.clearedDungeonsCount >= 0
        ? Math.floor(raw.clearedDungeonsCount)
        : 0
    };
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ "Phân Tầng Đan Văn & Dược Tính Biến Dị (Pill Veins System & Mutagenic Potions)"
 * - Chuẩn hóa toàn bộ đan dược trong túi sang định dạng có veinMetadata nếu chưa có (veinCount: 0, isMutated: false).
 * - Khởi tạo an toàn player.consumedMutations: {} có kẹp trần MUTATION_HARD_CAPS.
 * - Đảm bảo tính lũy thừa (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migratePillVeinData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

  // 1. Chuẩn hóa consumedMutations
  if (!cloned.consumedMutations || typeof cloned.consumedMutations !== 'object') {
    cloned.consumedMutations = {};
  } else {
    for (const [affix, val] of Object.entries(cloned.consumedMutations)) {
      if (typeof val === 'number') {
        const cap = MUTATION_HARD_CAPS[affix as MutagenicAffixType];
        if (cap !== undefined) {
          cloned.consumedMutations[affix as MutagenicAffixType] = Math.max(0, Math.min(cap, Number(val.toFixed(2))));
        }
      }
    }
  }

  // 2. Chuẩn hóa đan dược trong inventory
  if (cloned.inventory && Array.isArray(cloned.inventory.pills)) {
    cloned.inventory.pills = cloned.inventory.pills.map((pill: any) => {
      if (!pill || typeof pill !== 'object') return pill;
      if (!pill.veinMetadata || typeof pill.veinMetadata !== 'object') {
        return {
          ...pill,
          veinMetadata: {
            veinCount: 0,
            veinMultiplier: 1.0,
            toxicityMultiplier: 0.50,
            mutation: null
          },
          isMutated: false
        };
      }
      return pill;
    });
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho phân hệ "Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)"
 * - Chuẩn hóa toàn bộ cấu trúc player.flameState: { unlockedFlames: {}, equippedFlameId: null }
 * - Lọc bỏ các ngọn Dị Hỏa ID không hợp lệ hoặc ma, dọn sạch equippedFlameId nếu không tồn tại trong unlockedFlames.
 * - Đảm bảo tính lũy thừa (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migrateHeavenlyFlameData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

  if (!cloned.flameState || typeof cloned.flameState !== 'object') {
    cloned.flameState = createDefaultHeavenlyFlameState();
  } else {
    const rawFlames = cloned.flameState.unlockedFlames;
    const sanitizedFlames: Record<string, any> = {};

    if (rawFlames && typeof rawFlames === 'object') {
      for (const [fId, inst] of Object.entries(rawFlames)) {
        if (HEAVENLY_FLAMES_REGISTRY[fId] && inst && typeof inst === 'object') {
          const rawInst = inst as any;
          const tier = (Number.isInteger(rawInst.tier) && rawInst.tier >= 1 && rawInst.tier <= 9)
            ? (rawInst.tier as FlameTier)
            : 1;
          const maxExp = tier * 250;
          const currentExp = typeof rawInst.currentExp === 'number' ? Math.max(0, Math.min(maxExp, rawInst.currentExp)) : 0;
          sanitizedFlames[fId] = {
            flameId: fId,
            tier,
            currentExp,
            maxExp,
            unlockedAuraIds: Array.isArray(rawInst.unlockedAuraIds) ? rawInst.unlockedAuraIds : [],
            totalCraftsWithFlame: typeof rawInst.totalCraftsWithFlame === 'number' ? Math.max(0, rawInst.totalCraftsWithFlame) : 0
          };
        }
      }
    }

    const equippedFlameId = (typeof cloned.flameState.equippedFlameId === 'string' && sanitizedFlames[cloned.flameState.equippedFlameId])
      ? cloned.flameState.equippedFlameId
      : null;

    cloned.flameState = {
      unlockedFlames: sanitizedFlames,
      equippedFlameId
    };
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho hệ thống Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ:
 * - Chuẩn hóa toàn bộ cấu trúc player.alchemyTacticsState: { defaultStance: 'van_vu_song_hanh', customConcoctionsHistory: [] }
 * - Đảm bảo tính lũy thừa (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migrateAlchemyTacticsData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

  if (!cloned.alchemyTacticsState || typeof cloned.alchemyTacticsState !== 'object') {
    cloned.alchemyTacticsState = {
      defaultStance: 'van_vu_song_hanh',
      customConcoctionsHistory: []
    };
  } else {
    const allowedStances = ['van_hoa', 'vu_hoa', 'van_vu_song_hanh'];
    const defaultStance = allowedStances.includes(cloned.alchemyTacticsState.defaultStance)
      ? cloned.alchemyTacticsState.defaultStance
      : 'van_vu_song_hanh';

    const history = Array.isArray(cloned.alchemyTacticsState.customConcoctionsHistory)
      ? cloned.alchemyTacticsState.customConcoctionsHistory.filter((e: any) => e && typeof e === 'object')
      : [];

    cloned.alchemyTacticsState = {
      defaultStance,
      customConcoctionsHistory: history
    };
  }

  return normalizePlayerData(cloned);
}

/**
 * Migration an toàn cho hệ thống Đan Lôi Kiếp & Đan Linh Hóa Hình:
 * - Chuẩn hóa toàn bộ cấu trúc player.pillTribulationState: { totalTribulationsFaced: 0, successfulDefenses: 0, danSpirits: [], activeTribulation: null }
 * - Đảm bảo tính lũy thừa (Idempotent), bảo toàn 100% dữ liệu save game cũ.
 */
export function migratePillTribulationData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

  if (!cloned.pillTribulationState || typeof cloned.pillTribulationState !== 'object') {
    cloned.pillTribulationState = {
      totalTribulationsFaced: 0,
      successfulDefenses: 0,
      danSpirits: [],
      activeTribulation: null
    };
  } else {
    cloned.pillTribulationState = {
      totalTribulationsFaced: typeof cloned.pillTribulationState.totalTribulationsFaced === 'number'
        ? Math.max(0, cloned.pillTribulationState.totalTribulationsFaced)
        : 0,
      successfulDefenses: typeof cloned.pillTribulationState.successfulDefenses === 'number'
        ? Math.max(0, cloned.pillTribulationState.successfulDefenses)
        : 0,
      danSpirits: Array.isArray(cloned.pillTribulationState.danSpirits)
        ? cloned.pillTribulationState.danSpirits.filter((s: any) => s && typeof s === 'object')
        : [],
      activeTribulation: cloned.pillTribulationState.activeTribulation && typeof cloned.pillTribulationState.activeTribulation === 'object'
        ? cloned.pillTribulationState.activeTribulation
        : null
    };
  }

  return normalizePlayerData(cloned);
}

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
export function migrateModularForgingData(player: PlayerStats): PlayerStats {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerStats;

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

  if ((cloned as any).equippedEquipment && typeof (cloned as any).equippedEquipment === 'object') {
    const rawEquipped = (cloned as any).equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      (cloned as any).equippedEquipment = rawEquipped.map(normalizeEquipmentAlloy);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentAlloy(equip);
      }
      (cloned as any).equippedEquipment = updatedMap;
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

  return normalizePlayerData(cloned);
}

export type PlayerState = PlayerStats;

/**
 * Migration an toàn cập nhật lại hệ số độc cho toàn bộ đan dược trong save game của người chơi
 * - Quét qua player.inventory (cả pills và items có category === 'pill' / 'pills')
 * - Kiểm tra cấp Đan Văn hiện có trên vật phẩm (veinTier, veinCount hoặc danVan)
 * - Cập nhật item.toxicityMultiplier theo PILL_VEIN_CONFIG mới:
 *   * 0 Văn -> 0.50
 *   * 1-2 Văn -> 0.40
 *   * 3-5 Văn -> 0.25
 *   * 6-8 Văn -> 0.10
 *   * 9 Văn -> 0.00
 * - Cập nhật đồng bộ veinMetadata.toxicityMultiplier
 * - Tính toán lại trường item.pillToxicity tương ứng nếu vật phẩm lưu trữ trực tiếp điểm độc cuối cùng
 * - Đảm bảo tính lũy đẳng (Idempotent), bảo toàn 100% dữ liệu không mất mát
 */
export function migrateToxicityFormulaUpdate(player: PlayerState): PlayerState {
  if (!player) return createNewPlayer();

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  const updatePill = (pill: any) => {
    if (!pill || typeof pill !== 'object') return pill;

    // Trích xuất cấp Đan Văn hiện có
    let rawTier = 0;
    if (pill.veinMetadata && typeof pill.veinMetadata.veinCount === 'number') {
      rawTier = pill.veinMetadata.veinCount;
    } else if (pill.veinMetadata && typeof pill.veinMetadata.veinTier === 'number') {
      rawTier = pill.veinMetadata.veinTier;
    } else if (typeof pill.veinCount === 'number') {
      rawTier = pill.veinCount;
    } else if (typeof pill.veinTier === 'number') {
      rawTier = pill.veinTier;
    } else if (typeof pill.danVan === 'number') {
      rawTier = pill.danVan;
    }
    const veinTier: PillVeinTier = Math.max(0, Math.min(9, Math.floor(rawTier))) as PillVeinTier;

    const config = PILL_VEIN_CONFIG[veinTier as PillVeinTier] || PILL_VEIN_CONFIG[0];
    const newMultiplier = config.toxicityMultiplier;

    // Lưu lại hệ số cũ để nội suy baseToxicity nếu save cũ không lưu baseToxicity
    const oldMultiplier = typeof pill.toxicityMultiplier === 'number'
      ? pill.toxicityMultiplier
      : (typeof pill.veinMetadata?.toxicityMultiplier === 'number' ? pill.veinMetadata.toxicityMultiplier : 1.0);

    // Cập nhật toxicityMultiplier ở cấp item và trong veinMetadata
    pill.toxicityMultiplier = newMultiplier;

    if (!pill.veinMetadata || typeof pill.veinMetadata !== 'object') {
      pill.veinMetadata = {
        veinCount: veinTier,
        veinMultiplier: config.veinMultiplier,
        toxicityMultiplier: newMultiplier,
        mutation: null
      };
    } else {
      pill.veinMetadata.veinCount = veinTier;
      pill.veinMetadata.toxicityMultiplier = newMultiplier;
      if (typeof pill.veinMetadata.veinMultiplier !== 'number') {
        pill.veinMetadata.veinMultiplier = config.veinMultiplier;
      }
    }

    // 9 Văn (Cửu Khổng Thần Đan) tuyệt đối 0% đan độc
    if (veinTier === 9) {
      pill.toxicityMultiplier = 0.00;
      pill.veinMetadata.toxicityMultiplier = 0.00;
      if (pill.pillToxicity !== undefined) pill.pillToxicity = 0;
      if (pill.toxicity !== undefined) pill.toxicity = 0;
      return pill;
    }

    // Tính toán lại trường pillToxicity / toxicity nếu vật phẩm lưu trữ trực tiếp điểm độc cuối cùng
    const pillDef = PILL_DEFINITIONS_MAP[pill.basePillId || pill.id];
    let baseTox: number;
    if (typeof pill.baseToxicity === 'number') {
      baseTox = pill.baseToxicity;
    } else if (pillDef?.effects?.toxicityPercent !== undefined) {
      baseTox = pillDef.effects.toxicityPercent;
    } else if (typeof pill.pillToxicity === 'number' && oldMultiplier > 0) {
      baseTox = Math.round(pill.pillToxicity / oldMultiplier);
    } else if (typeof pill.toxicity === 'number' && oldMultiplier > 0) {
      baseTox = Math.round(pill.toxicity / oldMultiplier);
    } else if (typeof pill.pillToxicity === 'number') {
      baseTox = pill.pillToxicity;
    } else {
      baseTox = 15;
    }

    // Lưu lại baseToxicity để đảm bảo Idempotent khi chạy lại nhiều lần
    pill.baseToxicity = baseTox;

    const flameBurnRatio = (pill.veinMetadata?.toxicityBurnPercent || 0) / 100;

    const toxResult = calculateCompoundingToxicity({
      baseToxicity: baseTox,
      veinTier,
      flameBurnRatio
    });
    const finalTox = Math.round(toxResult.finalToxicity);

    if (pill.pillToxicity !== undefined) {
      pill.pillToxicity = finalTox;
    }
    if (pill.toxicity !== undefined) {
      pill.toxicity = finalTox;
    }

    return pill;
  };

  const isPillItem = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;
    return Boolean(
      item.category === 'pill' ||
      item.category === 'pills' ||
      item.category === 'forbidden_pill' ||
      item.itemType === 'pill' ||
      item.type === 'pill' ||
      item.veinMetadata !== undefined ||
      item.danVan !== undefined ||
      item.veinTier !== undefined ||
      item.veinCount !== undefined ||
      item.pillToxicity !== undefined
    );
  };

  // 1. Quét player.inventory.pills
  if (cloned.inventory && Array.isArray(cloned.inventory.pills)) {
    cloned.inventory.pills = cloned.inventory.pills.map(updatePill);
  }

  // 2. Quét player.inventory nếu là mảng (legacy format) hoặc inventory.items
  if (Array.isArray(cloned.inventory)) {
    cloned.inventory = (cloned.inventory as any[]).map((item: any) => {
      if (isPillItem(item)) {
        return updatePill(item);
      }
      return item;
    }) as any;
  } else if ((cloned.inventory as any)?.items && Array.isArray((cloned.inventory as any).items)) {
    (cloned.inventory as any).items = (cloned.inventory as any).items.map((item: any) => {
      if (isPillItem(item)) {
        return updatePill(item);
      }
      return item;
    });
  }

  return cloned;
}

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
export function migrateFormationInscriptionData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  // 1. Khởi tạo an toàn player.inscriptionState nếu chưa có
  cloned.inscriptionState = cloned.inscriptionState ?? {
    totalInscribedCount: 0,
    unlockedInscriptions: ['tu_khi_tran', 'phong_nhan_tran'],
    cleansingWaterCount: (cloned.inscriptionState as any)?.cleansingWaterCount ?? 5
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

  if ((cloned as any).equippedEquipment && typeof (cloned as any).equippedEquipment === 'object') {
    const rawEquipped = (cloned as any).equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      (cloned as any).equippedEquipment = rawEquipped.map(normalizeEquipmentInscription);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentInscription(equip);
      }
      (cloned as any).equippedEquipment = updatedMap;
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
      if (Array.isArray((cloned.inventory as any).items)) {
        (cloned.inventory as any).items = (cloned.inventory as any).items.map(normalizeEquipmentInscription);
      }
    }
  }

  return cloned;
}

/**
 * Migration an toàn cho phân hệ Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion & Artifact Spirit Awakening)
 * - Khởi tạo an toàn player.soulInfusionState nếu chưa có:
 *   player.soulInfusionState = player.soulInfusionState ?? {
 *     harvestedSouls: {},
 *     totalInfusionsPerformed: 0,
 *     unlockedSpiritLore: []
 *   };
 * - Quét qua player.inventory, player.equipment, và player.natalArtifact:
 *   gán an toàn infusedSoul: item.infusedSoul ?? null cho tất cả trang bị cũ.
 * - Đảm bảo tính Idempotent: chạy nhiều lần không làm hỏng dữ liệu.
 */
// ============================================================
// MIGRATION: Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh
// ============================================================

/**
 * Khởi tạo / đồng bộ an toàn dữ liệu Huyết Khế & Trùng Chú cho save game cũ.
 * Idempotent: chạy nhiều lần không làm hỏng dữ liệu đã tồn tại.
 */
export function migrateLegacyTemperingData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  // 1. Khởi tạo an toàn legacyTemperingState
  const existing = (cloned as any).legacyTemperingState;
  (cloned as any).legacyTemperingState = {
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
  if ((cloned as any).equippedEquipment && typeof (cloned as any).equippedEquipment === 'object') {
    const rawEq = (cloned as any).equippedEquipment;
    if (Array.isArray(rawEq)) {
      (cloned as any).equippedEquipment = rawEq.map(normalizeEquipBloodBond);
    } else {
      const updated: Record<string, any> = {};
      for (const [key, equip] of Object.entries(rawEq as Record<string, any>)) {
        updated[key] = normalizeEquipBloodBond(equip);
      }
      (cloned as any).equippedEquipment = updated;
    }
  }

  // 5. Quét player.inventory
  if (cloned.inventory && typeof cloned.inventory === 'object') {
    if (Array.isArray(cloned.inventory)) {
      cloned.inventory = (cloned.inventory as any[]).map(normalizeEquipBloodBond) as any;
    } else {
      if (Array.isArray((cloned.inventory as any).equipment)) {
        (cloned.inventory as any).equipment = (cloned.inventory as any).equipment.map(normalizeEquipBloodBond);
      }
      if (Array.isArray((cloned.inventory as any).equipments)) {
        (cloned.inventory as any).equipments = (cloned.inventory as any).equipments.map(normalizeEquipBloodBond);
      }
      if (Array.isArray((cloned.inventory as any).items)) {
        (cloned.inventory as any).items = (cloned.inventory as any).items.map(normalizeEquipBloodBond);
      }
    }
  }

  return cloned;
}

export function migrateSoulInfusionData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  // 1. Khởi tạo an toàn player.soulInfusionState
  const existingSoulState = cloned.soulInfusionState as any;
  cloned.soulInfusionState = {
    harvestedSouls: (existingSoulState?.harvestedSouls && typeof existingSoulState.harvestedSouls === 'object') ? existingSoulState.harvestedSouls : {},
    totalInfusionsPerformed: typeof existingSoulState?.totalInfusionsPerformed === 'number' ? existingSoulState.totalInfusionsPerformed : 0,
    unlockedSpiritLore: Array.isArray(existingSoulState?.unlockedSpiritLore) ? existingSoulState.unlockedSpiritLore : [],
    totalSoulsInfused: typeof existingSoulState?.totalSoulsInfused === 'number' ? existingSoulState.totalSoulsInfused : 0,
    highestStageReached: existingSoulState?.highestStageReached ?? 1,
    unlockedSoulTypes: Array.isArray(existingSoulState?.unlockedSoulTypes) ? existingSoulState.unlockedSoulTypes : []
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

  // 3. Quét qua player.equipment & player.equippedEquipment
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

  if ((cloned as any).equippedEquipment && typeof (cloned as any).equippedEquipment === 'object') {
    const rawEquipped = (cloned as any).equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      (cloned as any).equippedEquipment = rawEquipped.map(normalizeEquipmentSoul);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentSoul(equip);
      }
      (cloned as any).equippedEquipment = updatedMap;
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
      if (Array.isArray((cloned.inventory as any).items)) {
        (cloned.inventory as any).items = (cloned.inventory as any).items.map(normalizeEquipmentSoul);
      }
    }
  }

  // 5. Quét qua player.natalArtifact
  if (cloned.natalArtifact && typeof cloned.natalArtifact === 'object') {
    if (cloned.natalArtifact.baseEquipment) {
      cloned.natalArtifact.baseEquipment = normalizeEquipmentSoul(cloned.natalArtifact.baseEquipment);
    }
    (cloned.natalArtifact as any).infusedSoul = (cloned.natalArtifact as any).infusedSoul !== undefined
      ? (cloned.natalArtifact as any).infusedSoul
      : (cloned.natalArtifact.baseEquipment?.infusedSoul ?? null);
  }

  return cloned;
}

// ============================================================
// MIGRATION: Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân
// ============================================================

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
export function migrateWeaponTribulationArrayData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

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

  if ((cloned as any).equippedEquipment && typeof (cloned as any).equippedEquipment === 'object') {
    const rawEquipped = (cloned as any).equippedEquipment;
    if (Array.isArray(rawEquipped)) {
      (cloned as any).equippedEquipment = rawEquipped.map(normalizeEquipmentLightning);
    } else {
      const eqMap = rawEquipped as Record<string, any>;
      const updatedMap: Record<string, any> = {};
      for (const [key, equip] of Object.entries(eqMap)) {
        updatedMap[key] = normalizeEquipmentLightning(equip);
      }
      (cloned as any).equippedEquipment = updatedMap;
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
      if (Array.isArray((cloned.inventory as any).items)) {
        (cloned.inventory as any).items = (cloned.inventory as any).items.map(normalizeEquipmentLightning);
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

// ============================================================
// MIGRATION: Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch
// ============================================================

/**
 * Migration an toàn cho phân hệ "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch" (Breakthrough Catalysts & Protective Talismans)
 * - Khởi tạo an toàn cấu trúc player.breakthroughCatalystState nếu chưa có:
 *   {
 *     totalCatalystBreakthroughs: 0,
 *     protectedFailuresCount: 0
 *   }
 * - Đảm bảo tính Idempotent: chạy nhiều lần trên cùng save không làm thay đổi trạng thái người chơi.
 */
export function migrateBreakthroughCatalystData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  // Khởi tạo an toàn cấu trúc nếu chưa có
  cloned.breakthroughCatalystState = cloned.breakthroughCatalystState ?? {
    totalCatalystBreakthroughs: 0,
    protectedFailuresCount: 0
  };

  // Đảm bảo kiểu số hợp lệ (Idempotent và Data Integrity)
  if (typeof cloned.breakthroughCatalystState.totalCatalystBreakthroughs !== 'number') {
    cloned.breakthroughCatalystState.totalCatalystBreakthroughs = 0;
  }
  if (typeof cloned.breakthroughCatalystState.protectedFailuresCount !== 'number') {
    cloned.breakthroughCatalystState.protectedFailuresCount = 0;
  }

  return cloned;
}

/**
 * Migration an toàn cho phân hệ "Tác Động Của Đan Độc & Tâm Ma Phản Phệ" (Inner Demon & Pill Toxicity Backlash System)
 * - Khởi tạo an toàn cấu trúc player.injuryState nếu chưa có:
 *   {
 *     isInjured: false,
 *     injurySeverity: 0,
 *     hasDemonicBottleneck: false,
 *     bottleneckPenaltyPercent: 0,
 *     backlashHistory: []
 *   }
 * - Đảm bảo tính Idempotent: chạy nhiều lần trên cùng save không làm thay đổi trạng thái người chơi.
 */
export function migrateBreakthroughBacklashData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  // Khởi tạo an toàn cấu trúc nếu chưa có
  cloned.injuryState = cloned.injuryState ?? {
    isInjured: false,
    injurySeverity: 0,
    hasDemonicBottleneck: false,
    bottleneckPenaltyPercent: 0,
    backlashHistory: []
  };

  // Đảm bảo các thuộc tính con có giá trị hợp lệ (Idempotent và Data Integrity)
  if (typeof cloned.injuryState.isInjured !== 'boolean') {
    cloned.injuryState.isInjured = false;
  }
  if (typeof cloned.injuryState.injurySeverity !== 'number') {
    cloned.injuryState.injurySeverity = 0;
  }
  if (typeof cloned.injuryState.hasDemonicBottleneck !== 'boolean') {
    cloned.injuryState.hasDemonicBottleneck = false;
  }
  if (typeof cloned.injuryState.bottleneckPenaltyPercent !== 'number') {
    cloned.injuryState.bottleneckPenaltyPercent = 0;
  }
  if (!Array.isArray(cloned.injuryState.backlashHistory)) {
    cloned.injuryState.backlashHistory = [];
  }

  return cloned;
}

/**
 * Migration an toàn cho phân hệ "Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa" (Dao Foundation Grades & Major Realm Transcendence)
 * - Khởi tạo an toàn cấu trúc nếu chưa tồn tại:
 *   player.daoFoundations = player.daoFoundations ?? {};
 *   player.unlockedInnateTalents = player.unlockedInnateTalents ?? [];
 * - Quét cảnh giới hiện tại của người chơi:
 *   Nếu người chơi cũ đã vượt qua Trúc Cơ (currentRealm >= 11), Kim Đan (currentRealm >= 16), Nguyên Anh (currentRealm >= 21)
 *   mà chưa có record trong daoFoundations, gán mặc định an toàn là 'ha_pham' để tránh lỗi undefined.
 * - Đảm bảo tính Idempotent: chạy nhiều lần không làm biến dạng dữ liệu.
 */
export function migrateDaoFoundationData(player: PlayerState): PlayerState {
  if (!player) return normalizePlayerData({});

  const cloned = JSON.parse(JSON.stringify(player)) as PlayerState;

  // 1. Khởi tạo an toàn cấu trúc nếu chưa tồn tại
  cloned.daoFoundations = cloned.daoFoundations ?? {};
  if (typeof cloned.daoFoundations !== 'object' || Array.isArray(cloned.daoFoundations)) {
    cloned.daoFoundations = {};
  }
  if (!Array.isArray(cloned.unlockedInnateTalents)) {
    cloned.unlockedInnateTalents = [];
  }

  // 2. Quét cảnh giới hiện tại của người chơi:
  // Nếu người chơi cũ đã vượt qua Trúc Cơ/Kim Đan mà chưa có record trong daoFoundations,
  // gán mặc định an toàn là 'ha_pham' để tránh lỗi undefined.
  const currentRealm = typeof cloned.currentRealm === 'number'
    ? cloned.currentRealm
    : parseInt(String(cloned.currentRealm || 0), 10) || 0;

  // Vượt qua Luyện Khí -> Trúc Cơ (Realm >= 11)
  if (currentRealm >= 11) {
    if (!cloned.daoFoundations.luyen_khi_to_truc_co) {
      cloned.daoFoundations.luyen_khi_to_truc_co = 'ha_pham';
    }
  }

  // Vượt qua Trúc Cơ -> Kim Đan (Realm >= 16)
  if (currentRealm >= 16) {
    if (!cloned.daoFoundations.truc_co_to_kim_dan) {
      cloned.daoFoundations.truc_co_to_kim_dan = 'ha_pham';
    }
  }

  // Vượt qua Kim Đan -> Nguyên Anh (Realm >= 21)
  if (currentRealm >= 21) {
    if (!cloned.daoFoundations.kim_dan_to_nguyen_anh) {
      cloned.daoFoundations.kim_dan_to_nguyen_anh = 'ha_pham';
    }
  }

  return cloned;
}

