// lib/formation-logic.ts
// Business logic cho phân hệ Trận Đạo Bách Nghệ • Trận Pháp Các

import { PlayerStats, FormationItem, FormationArtisan } from '@/lib/types';
import {
  FormationRecipe,
  FormationCombatBuff,
  ArrayReforgeType,
  ArrayReforgeRecipe,
  ResourceCost,
} from '@/lib/types/formation';
import { ActiveCultivationArrayBuff } from '@/lib/types/cultivation-shop';
import {
  FORMATION_ARTISAN_RANKS,
  getFormationRecipeById,
  createDefaultFormationArtisan,
} from '@/lib/formation-data';
import { checkArtisanCraftRequirement, checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';

// ============================================================
// CHẤT LƯỢNG TRẬN BÀN
// ============================================================
export type FormationQuality = 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'than_pham';

export const FORMATION_QUALITY_CONFIG: Record<FormationQuality, { label: string; color: string; multiplier: number; durability: number }> = {
  ha_pham:    { label: 'Hạ Phẩm',    color: 'text-zinc-400',   multiplier: 0.8,  durability: 5  },
  trung_pham: { label: 'Trung Phẩm', color: 'text-green-400',  multiplier: 1.0,  durability: 10 },
  thuong_pham:{ label: 'Thượng Phẩm',color: 'text-blue-400',   multiplier: 1.25, durability: 15 },
  cuc_pham:   { label: 'Cực Phẩm',   color: 'text-purple-400', multiplier: 1.55, durability: 20 },
  than_pham:  { label: 'Thần Phẩm',  color: 'text-amber-300',  multiplier: 2.0,  durability: 30 },
};

const rollFormationQuality = (successRoll: number, artisanLevel: number, ngoTinh: number): FormationQuality => {
  const bonusChance = (artisanLevel * 3) + Math.floor(ngoTinh / 20);
  const rand = successRoll + bonusChance;
  if (rand >= 98) return 'than_pham';
  if (rand >= 90) return 'cuc_pham';
  if (rand >= 72) return 'thuong_pham';
  if (rand >= 45) return 'trung_pham';
  return 'ha_pham';
};

// ============================================================
// KIỂM TRA NGUYÊN LIỆU
// ============================================================
export const canCraftFormation = (
  player: PlayerStats,
  recipe: FormationRecipe
): { ok: boolean; missing: string[] } => {
  const missing: string[] = [];

  // Kiểm tra khóa theo cảnh giới Khí Tu
  const craftCheck = checkArtisanCraftRequirement(player.currentRealm || 0, recipe.tier);
  if (!craftCheck.canCraft) {
    missing.push(craftCheck.reason || 'Cảnh giới chưa đủ');
  }

  // Kiểm tra cấp trận sư
  const artisan = player.formationArtisan || createDefaultFormationArtisan();
  if (artisan.level < recipe.requiredArtisanLevel) {
    missing.push(`Cần Trận Sư cấp ${recipe.requiredArtisanLevel}`);
  }

  // Kiểm tra linh thạch
  if ((player.linhThach || 0) < recipe.linhThachCost) {
    missing.push(`Thiếu ${recipe.linhThachCost - (player.linhThach || 0)} Linh Thạch`);
  }

  // Kiểm tra từng nguyên liệu khoáng thạch
  for (const mat of recipe.requiredMaterials) {
    if (mat.itemCategory === 'ore') {
      const owned = (player.inventory?.ores || []).find(o => o.id === mat.itemId);
      const qty = owned?.quantity || 0;
      if (qty < mat.quantity) {
        missing.push(`Thiếu ${mat.quantity - qty} ${mat.name}`);
      }
    }
  }

  return { ok: missing.length === 0, missing };
};

// ============================================================
// KHẮC CHẾ TRẬN BÀN
// ============================================================
export interface CraftFormationResult {
  success: boolean;
  item?: FormationItem;
  expGain: number;
  newArtisanLevel: number;
  newArtisanExp: number;
  newArtisanMaxExp: number;
  logTitle: string;
  logContent: string;
  toastMsg: string;
}

export const craftFormationItem = (
  player: PlayerStats,
  recipeId: string
): { result: CraftFormationResult; updatedPlayer: PlayerStats } => {
  const recipe = getFormationRecipeById(recipeId);
  if (!recipe) {
    return {
      result: { success: false, expGain: 0, newArtisanLevel: 1, newArtisanExp: 0, newArtisanMaxExp: 100, logTitle: '', logContent: '', toastMsg: '❌ Không tìm thấy trận đồ.' },
      updatedPlayer: player,
    };
  }

  const { ok, missing } = canCraftFormation(player, recipe);
  if (!ok) {
    const errorMsg = missing[0]?.includes('cảnh giới') || missing[0]?.includes('Đạo hữu')
      ? `🔒 ${missing[0]}`
      : `❌ Thiếu nguyên liệu: ${missing[0]}`;
    return {
      result: { success: false, expGain: 0, newArtisanLevel: 1, newArtisanExp: 0, newArtisanMaxExp: 100, logTitle: '', logContent: '', toastMsg: errorMsg },
      updatedPlayer: player,
    };
  }

  const artisan: FormationArtisan = player.formationArtisan || createDefaultFormationArtisan();
  const ngoTinh = player.ngoTinh || 50;

  // Tính tỉ lệ thành công
  const artisanBonus = artisan.level * 4;
  const ngoTinhBonus = Math.floor(ngoTinh / 10);
  const finalSuccessRate = Math.min(95, recipe.baseSuccessRate + artisanBonus + ngoTinhBonus);
  const successRoll = Math.random() * 100;
  const success = successRoll < finalSuccessRate;

  // Trừ nguyên liệu
  let updatedOres = [...(player.inventory?.ores || [])];
  for (const mat of recipe.requiredMaterials) {
    if (mat.itemCategory === 'ore') {
      updatedOres = updatedOres.map(o =>
        o.id === mat.itemId ? { ...o, quantity: Math.max(0, o.quantity - mat.quantity) } : o
      ).filter(o => o.quantity > 0);
    }
  }
  const newLinhThach = (player.linhThach || 0) - recipe.linhThachCost;

  // EXP Trận Sư
  const expGain = success ? recipe.baseExpGain : Math.floor(recipe.baseExpGain * 0.3);
  const { newLevel, newExp, newMaxExp } = addFormationExp(artisan, expGain, player.currentRealm);

  let updatedFormations = [...(player.inventory?.formations || [])];
  let newItem: FormationItem | undefined;

  if (success) {
    const qualityRoll = Math.random() * 100;
    const quality = rollFormationQuality(qualityRoll, artisan.level, ngoTinh);
    const qConfig = FORMATION_QUALITY_CONFIG[quality];

    // Tính stat bonus theo quality
    const baseStats = recipe.combatBuff;
    const m = qConfig.multiplier;
    const statBonus: { [k: string]: number } = {};
    if (baseStats.atkBonus)         statBonus.atk        = Math.round(baseStats.atkBonus * m);
    if (baseStats.defBonus)         statBonus.def        = Math.round(baseStats.defBonus * m);
    if (baseStats.hpBonus)          statBonus.hp         = Math.round(baseStats.hpBonus * m);
    if (baseStats.critRateBonus)    statBonus.critRate   = Math.round(baseStats.critRateBonus * m * 10) / 10;
    if (baseStats.critDmgBonus)     statBonus.critDmg    = Math.round(baseStats.critDmgBonus * m);
    if (baseStats.speedBonus)       statBonus.speed      = Math.round(baseStats.speedBonus * m);
    if (baseStats.dmgReductionBonus)statBonus.dmgReduction = Math.round(baseStats.dmgReductionBonus * m);

    newItem = {
      id: `formation_${recipe.id}_${Date.now()}`,
      recipeId: recipe.id,
      name: recipe.name,
      type: recipe.type,
      tier: recipe.tier,
      grade: recipe.grade,
      element: recipe.element,
      description: recipe.description,
      quality,
      qualityMultiplier: qConfig.multiplier,
      durability: qConfig.durability,
      maxDurability: qConfig.durability,
      gemInlaid: null,
      statBonus,
      combatBuff: recipe.combatBuff,
    };
    updatedFormations = [...updatedFormations, newItem];
  }

  const updatedArtisan: FormationArtisan = {
    ...artisan,
    level: newLevel,
    exp: newExp,
    maxExp: newMaxExp,
    totalCrafted: artisan.totalCrafted + 1,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: newLinhThach,
    formationArtisan: updatedArtisan,
    inventory: {
      ...player.inventory,
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      ores: updatedOres,
      formations: updatedFormations,
    } as any,
  };

  const rank = FORMATION_ARTISAN_RANKS.find(r => r.level === newLevel);
  const logTitle = success
    ? `🌀 TRẬN BÀN KHẮC THÀNH! [${recipe.name}]`
    : `💨 KHẮC TRẬN THẤT BẠI [${recipe.name}]`;
  const logContent = success
    ? `Đạo Văn Trận Pháp thành hình! Khắc thành ${newItem?.quality === 'than_pham' ? '✨ THẦN PHẨM' : newItem?.quality === 'cuc_pham' ? '💜 CỰC PHẨM' : '【' + FORMATION_QUALITY_CONFIG[newItem!.quality].label + '】'} [${recipe.name}]. Trận Đạo EXP +${expGain}. ${newLevel > artisan.level ? `⬆️ Thăng Cấp → ${rank?.title}!` : ''}`
    : `Đạo Văn tản loạn, trận bàn khắc thất bại! Tiêu hao nguyên liệu. EXP +${expGain}.`;
  const toastMsg = success
    ? `✅ Khắc thành [${recipe.name}]! EXP +${expGain}`
    : `💨 Khắc trận thất bại. EXP +${expGain}`;

  return {
    result: {
      success,
      item: newItem,
      expGain,
      newArtisanLevel: newLevel,
      newArtisanExp: newExp,
      newArtisanMaxExp: newMaxExp,
      logTitle,
      logContent,
      toastMsg,
    },
    updatedPlayer,
  };
};

// ============================================================
// TÍNH TOÁN TĂNG EXP TRẬN SƯ
// ============================================================
export const addFormationExp = (
  artisan: FormationArtisan,
  exp: number,
  realmIndex?: number
): { newLevel: number; newExp: number; newMaxExp: number } => {
  let { level, exp: currentExp, maxExp } = artisan;
  currentExp += exp;
  while (currentExp >= maxExp && level < 9) {
    if (realmIndex !== undefined) {
      const promoCheck = checkArtisanPromotionRequirement(realmIndex, level);
      if (!promoCheck.canPromote) {
        currentExp = Math.min(currentExp, maxExp);
        break;
      }
    }
    currentExp -= maxExp;
    level++;
    const nextRank = FORMATION_ARTISAN_RANKS.find(r => r.level === level);
    maxExp = nextRank?.maxExp || 99999;
  }
  if (level >= 9) currentExp = Math.min(currentExp, 99999);
  return { newLevel: level, newExp: currentExp, newMaxExp: maxExp };
};

// ============================================================
// TÍNH TOÁN CHỈ SỐ CHIẾN ĐẤU TỪ TRẬN BÀN TRANG BỊ
// ============================================================
export const calculateFormationCombatStats = (equippedFormation?: FormationItem | null): {
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  critRateBonus: number;
  critDmgBonus: number;
  speedBonus: number;
  dmgReductionBonus: number;
  hpRegenPercent: number;
} => {
  const empty = { atkBonus: 0, defBonus: 0, hpBonus: 0, critRateBonus: 0, critDmgBonus: 0, speedBonus: 0, dmgReductionBonus: 0, hpRegenPercent: 0 };
  if (!equippedFormation) return empty;
  const s = equippedFormation.statBonus;
  const b = equippedFormation.combatBuff;
  return {
    atkBonus: (s.atk || 0),
    defBonus: (s.def || 0),
    hpBonus: (s.hp || 0),
    critRateBonus: (s.critRate || 0),
    critDmgBonus: (s.critDmg || 0),
    speedBonus: (s.speed || 0),
    dmgReductionBonus: (s.dmgReduction || b.dmgReductionBonus || 0),
    hpRegenPercent: (b.hpRegenPercent || 0),
  };
};

// ============================================================
// KÍCH HOẠT HIỆU ỨNG TRẬN PHÁP THEO HIỆP (TURN TRIGGER)
// ============================================================
export interface FormationTurnTriggerResult {
  triggered: boolean;
  effectLog: string;
  damageDealt: number;
  targetAtkDebuffPercent: number;
  targetCritBlockTurns: number;
  hpRestored: number;
}

export const executeFormationTurnTrigger = (
  formation: FormationItem | null | undefined,
  turnNumber: number,
  currentAtk: number,
  currentHp: number,
  maxHp: number
): FormationTurnTriggerResult => {
  const empty: FormationTurnTriggerResult = { triggered: false, effectLog: '', damageDealt: 0, targetAtkDebuffPercent: 0, targetCritBlockTurns: 0, hpRestored: 0 };
  if (!formation) return empty;

  const buff: FormationCombatBuff = formation.combatBuff;

  // Kiểm tra trigger theo hiệp cố định
  if (buff.turnTriggerInterval && buff.turnTriggerInterval > 0) {
    if (turnNumber % buff.turnTriggerInterval !== 0) return empty;
    const dmg = buff.triggerDamagePercent ? Math.round(currentAtk * buff.triggerDamagePercent / 100) : 0;
    const atkDebuff = buff.triggerAtkDebuffPercent || 0;
    const critBlock = buff.triggerCritBlockTurns || 0;
    const hpRegen = buff.hpRegenPercent ? Math.round(maxHp * buff.hpRegenPercent / 100) : 0;
    return {
      triggered: true,
      effectLog: `🌀 [TRẬN PHÁP BẢN MỆNH • ${formation.name.toUpperCase()}] ${buff.triggerEffectDescription}`,
      damageDealt: dmg,
      targetAtkDebuffPercent: atkDebuff,
      targetCritBlockTurns: critBlock,
      hpRestored: hpRegen,
    };
  }

  // Kiểm tra trigger theo xác suất ngẫu nhiên
  if (buff.triggerChance && buff.triggerChance > 0) {
    if (Math.random() * 100 >= buff.triggerChance) return empty;
    const dmg = buff.triggerDamagePercent ? Math.round(currentAtk * buff.triggerDamagePercent / 100) : 0;
    return {
      triggered: true,
      effectLog: `⚡ [TRẬN PHÁP KÍCH HOẠT • ${formation.name}] ${buff.triggerEffectDescription}`,
      damageDealt: dmg,
      targetAtkDebuffPercent: 0,
      targetCritBlockTurns: 0,
      hpRestored: 0,
    };
  }

  return empty;
};

// ============================================================
// PHÂN GIẢI TRẬN BÀN — Thu hồi một phần nguyên liệu
// ============================================================
export const dismantleFormation = (
  player: PlayerStats,
  formationId: string
): { updatedPlayer: PlayerStats; recoveredOres: { id: string; name: string; quantity: number }[] } => {
  const formations = player.inventory?.formations || [];
  const target = formations.find((f: FormationItem) => f.id === formationId);
  if (!target) return { updatedPlayer: player, recoveredOres: [] };

  const recipe = getFormationRecipeById(target.recipeId);
  const recoveredOres: { id: string; name: string; quantity: number }[] = [];

  if (recipe) {
    for (const mat of recipe.requiredMaterials) {
      if (mat.itemCategory === 'ore') {
        const recoveryQty = Math.max(1, Math.floor(mat.quantity * 0.4));
        recoveredOres.push({ id: mat.itemId, name: mat.name, quantity: recoveryQty });
      }
    }
  }

  // Trả lại khoáng thạch vào túi
  let updatedOres = [...(player.inventory?.ores || [])];
  for (const rec of recoveredOres) {
    const existing = updatedOres.find(o => o.id === rec.id);
    if (existing) {
      updatedOres = updatedOres.map(o => o.id === rec.id ? { ...o, quantity: o.quantity + rec.quantity } : o);
    } else {
      updatedOres = [...updatedOres, { id: rec.id, name: rec.name, grade: 'Phàm Phẩm', description: '', price: 0, quantity: rec.quantity }];
    }
  }

  const updatedFormations = formations.filter((f: FormationItem) => f.id !== formationId);
  // Tháo nếu đang trang bị
  const wasEquipped = player.equippedFormation?.id === formationId;

  return {
    updatedPlayer: {
      ...player,
      equippedFormation: wasEquipped ? null : player.equippedFormation,
      inventory: {
        ...player.inventory,
        pills: player.inventory?.pills ?? [],
        herbs: player.inventory?.herbs ?? [],
        ores: updatedOres,
        formations: updatedFormations,
      } as any,
    },
    recoveredOres,
  };
};

// ============================================================
// HỆ THỐNG TRÙNG CHÚ TRẬN BÀN CỬU GIAI (ARRAY REFORGING)
// ============================================================

export const HIGH_TIER_REFORGE_ORES = [
  'hon_don_than_thiet',
  'ore_hu_khong_thach',
  'ore_t9_crystal',
  'ore_t9_rare',
  'ore_t9_base',
  'ore_thai_at_than_kim',
];

export const ARRAY_REFORGE_CONFIG: Record<ArrayReforgeType, ArrayReforgeRecipe> = {
  permanence: {
    id: 'permanence',
    name: 'Bất Hủ Hóa (Permanence Ascension)',
    description: 'Dẫn động thiên địa linh khí và tinh hoa quy tắc, rèn đúc lại Trận Bàn Cửu Giai thành trạng thái Bất Hủ Vĩnh Viễn, không bao giờ tiêu hao hay hết hạn.',
    targetTier: 9,
    requiredRealmIndex: 26, // Hóa Thần Kỳ
    requiredRealmName: 'Hóa Thần Kỳ',
    requiredArtisanLevel: 5, // Trận Đạo Tông Sư
    requiredArtisanTitle: 'Trận Đạo Tông Sư (Ngũ Giai trở lên)',
    requiredPriorReforgeTier: 0,
    costs: [
      { type: 'linhThach', name: 'Cực Phẩm Linh Thạch', amount: 50_000_000 },
      { type: 'forgingEssence', name: 'Tinh Hoa Rèn Đúc', amount: 500 },
      { type: 'ore', itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết / Hư Không Thạch', amount: 3 },
    ],
    effects: {
      isPermanent: true,
      reforgeTier: 1,
      offlineAbsorptionBonus: 0,
      summary: 'Thời hạn hiệu lực trở thành Vĩnh Viễn (Bất Hủ), độ bền vô hạn, bảo lưu toàn bộ hiệu quả gia tốc linh khí.',
    },
  },
  max_efficiency: {
    id: 'max_efficiency',
    name: 'Tột Đỉnh Hấp Thu (Max Efficiency Boost)',
    description: 'Khai mở trận tâm cực hạn, dung hợp đại đạo quy tắc giúp Trận Bàn Bất Hủ bộc phát uy năng, gia tăng thần tốc +35% hiệu suất tích lũy tu vi khi bế quan ngoại tuyến.',
    targetTier: 9,
    requiredRealmIndex: 46, // Độ Kiếp Kỳ
    requiredRealmName: 'Độ Kiếp Kỳ',
    requiredArtisanLevel: 9, // Cửu Giai • Thần Trận Đại Tổ
    requiredArtisanTitle: 'Thần Trận Đại Tổ (Cửu Giai)',
    requiredPriorReforgeTier: 1, // Cần đạt Bất Hủ trước
    costs: [
      { type: 'linhThach', name: 'Cực Phẩm Linh Thạch', amount: 150_000_000 },
      { type: 'forgingEssence', name: 'Tinh Hoa Rèn Đúc', amount: 1000 },
      { type: 'ore', itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết / Sáng Thế Thạch', amount: 5 },
    ],
    effects: {
      isPermanent: true,
      reforgeTier: 2,
      offlineAbsorptionBonus: 0.35, // +35% offline tu vi efficiency
      summary: 'Gia tăng +35% tốc độ tích lũy tu vi bế quan ngoại tuyến (Offline Cultivation Efficiency).',
    },
  },
};

/**
 * Tra cứu số lượng khoáng thạch cấp cao có sẵn trong túi
 */
export function getAvailableHighTierOreQuantity(
  player: PlayerStats,
  preferredItemId?: string
): { quantity: number; matchedOreId?: string; matchedOreName?: string } {
  const ores = player.inventory?.ores || [];
  if (preferredItemId) {
    const found = ores.find(o => o.id === preferredItemId && o.quantity > 0);
    if (found && found.quantity > 0) {
      return { quantity: found.quantity, matchedOreId: found.id, matchedOreName: found.name };
    }
  }

  // Quét các khoáng thạch thần cấp tương đương
  for (const altId of HIGH_TIER_REFORGE_ORES) {
    const found = ores.find(o => o.id === altId && o.quantity > 0);
    if (found && found.quantity > 0) {
      return { quantity: found.quantity, matchedOreId: found.id, matchedOreName: found.name };
    }
  }

  // Quét bất kỳ khoáng thạch Cửu Giai / Thần Giai nào
  const anyGodOre = ores.find(o => (o.grade === 'Thần Giai' || (o as any).tier === 9) && o.quantity > 0);
  if (anyGodOre) {
    return { quantity: anyGodOre.quantity, matchedOreId: anyGodOre.id, matchedOreName: anyGodOre.name };
  }

  return { quantity: 0 };
}

/**
 * Tìm kiếm thực thể trận bàn theo ID hoặc đối tượng truyền vào
 */
export function resolveTargetArray(
  player: PlayerStats,
  target: FormationItem | ActiveCultivationArrayBuff | string
): {
  formationItem?: FormationItem;
  activeBuff?: ActiveCultivationArrayBuff;
  tier: number;
  isPermanent: boolean;
  reforgeTier: number;
  offlineAbsorptionBonus: number;
  source: 'inventory' | 'equipped' | 'active_buff';
} | null {
  if (typeof target === 'string') {
    // 1. Kiểm tra trong inventory formations
    const fromInv = (player.inventory?.formations || []).find((f: FormationItem) => f.id === target);
    if (fromInv) {
      return {
        formationItem: fromInv,
        tier: fromInv.tier,
        isPermanent: Boolean(fromInv.isPermanent),
        reforgeTier: fromInv.reforgeTier || 0,
        offlineAbsorptionBonus: fromInv.offlineAbsorptionBonus || 0,
        source: 'inventory',
      };
    }

    // 2. Kiểm tra equippedFormation
    if (player.equippedFormation && player.equippedFormation.id === target) {
      return {
        formationItem: player.equippedFormation,
        tier: player.equippedFormation.tier,
        isPermanent: Boolean(player.equippedFormation.isPermanent),
        reforgeTier: player.equippedFormation.reforgeTier || 0,
        offlineAbsorptionBonus: player.equippedFormation.offlineAbsorptionBonus || 0,
        source: 'equipped',
      };
    }

    // 3. Kiểm tra active cultivation array
    const fromActive = (player.cultivationBuffState?.activeArrays || []).find(
      (a: ActiveCultivationArrayBuff) => a.itemId === target || (a as any).id === target
    );
    if (fromActive) {
      const tier = (fromActive as any).tier || (fromActive.itemId.includes('t9') ? 9 : fromActive.name.includes('Cửu') ? 9 : 9);
      return {
        activeBuff: fromActive,
        tier,
        isPermanent: Boolean(fromActive.isPermanent),
        reforgeTier: fromActive.reforgeTier || 0,
        offlineAbsorptionBonus: fromActive.offlineAbsorptionBonus || 0,
        source: 'active_buff',
      };
    }

    return null;
  }

  // target là object
  if ('recipeId' in target || 'quality' in target) {
    const f = target as FormationItem;
    const isEq = player.equippedFormation?.id === f.id;
    return {
      formationItem: f,
      tier: f.tier,
      isPermanent: Boolean(f.isPermanent),
      reforgeTier: f.reforgeTier || 0,
      offlineAbsorptionBonus: f.offlineAbsorptionBonus || 0,
      source: isEq ? 'equipped' : 'inventory',
    };
  }

  if ('tuViSpeedPercent' in target) {
    const a = target as ActiveCultivationArrayBuff;
    const tier = (a as any).tier || (a.itemId.includes('t9') ? 9 : a.name.includes('Cửu') ? 9 : 9);
    return {
      activeBuff: a,
      tier,
      isPermanent: Boolean(a.isPermanent),
      reforgeTier: a.reforgeTier || 0,
      offlineAbsorptionBonus: a.offlineAbsorptionBonus || 0,
      source: 'active_buff',
    };
  }

  return null;
}

/**
 * Kiểm tra điều kiện Trùng Chú Trận Bàn (Pure Logic)
 */
export function canReforgeArrayDisc(
  player: PlayerStats,
  targetArrayItem: FormationItem | ActiveCultivationArrayBuff | string,
  reforgeType: ArrayReforgeType
): { eligible: boolean; reason?: string; missingCosts?: ResourceCost[] } {
  const recipe = ARRAY_REFORGE_CONFIG[reforgeType];
  if (!recipe) {
    return { eligible: false, reason: 'Lộ trình trùng chú không hợp lệ.' };
  }

  const resolved = resolveTargetArray(player, targetArrayItem);
  if (!resolved) {
    return { eligible: false, reason: 'Không tìm thấy thông tin Trận Bàn chỉ định.' };
  }

  // 1. Kiểm tra Phẩm Cấp Cửu Giai
  if (resolved.tier < recipe.targetTier) {
    return {
      eligible: false,
      reason: `Chỉ có Trận Bàn phẩm cấp Cửu Giai mới có thể thừa tải thiên địa quy tắc để Trùng Chú! (Hiện tại: ${resolved.tier} Giai)`,
    };
  }

  // 2. Kiểm tra Cảnh Giới Nhân Vật
  const currentRealm = player.currentRealm || 0;
  if (currentRealm < recipe.requiredRealmIndex) {
    return {
      eligible: false,
      reason: `Cảnh giới chưa đủ! Cần đạt tối thiểu [${recipe.requiredRealmName}] (Realm ${recipe.requiredRealmIndex}) để dẫn động thiên địa linh hỏa.`,
    };
  }

  // 3. Kiểm tra Cấp Bậc Trận Pháp Sư
  const artisanLevel = player.formationArtisan?.level || 1;
  if (artisanLevel < recipe.requiredArtisanLevel) {
    return {
      eligible: false,
      reason: `Cần đạt danh xưng Trận Pháp Sư [${recipe.requiredArtisanTitle}] (Cấp ${recipe.requiredArtisanLevel}) trở lên!`,
    };
  }

  // 4. Kiểm tra Phòng Vệ Chống Trùng Lặp (Anti-dup & Hard Invariant)
  if (reforgeType === 'permanence') {
    if (resolved.isPermanent || resolved.reforgeTier >= 1) {
      return {
        eligible: false,
        reason: 'Trận bàn này đã được thăng hoa thành [Bất Hủ], không thể trùng chú Bất Hủ lần thứ hai!',
      };
    }
  } else if (reforgeType === 'max_efficiency') {
    if (!resolved.isPermanent && resolved.reforgeTier < 1) {
      return {
        eligible: false,
        reason: 'Cần thăng hoa Trận Bàn lên cảnh giới [Bất Hủ] (Bậc 1) trước khi mở khóa Tột Đỉnh Hấp Thu!',
      };
    }
    if (resolved.reforgeTier >= 2) {
      return {
        eligible: false,
        reason: 'Trận bàn đã đạt cảnh giới [Cực Hạn Tột Đỉnh] (Bậc 2), không thể thăng hoa thêm!',
      };
    }
  }

  // 5. Kiểm tra Tài Nguyên Tiêu Hao
  const missingCosts: ResourceCost[] = [];

  for (const cost of recipe.costs) {
    if (cost.type === 'linhThach') {
      const owned = player.linhThach || 0;
      if (owned < cost.amount) {
        missingCosts.push({
          ...cost,
          amount: cost.amount - owned,
        });
      }
    } else if (cost.type === 'forgingEssence') {
      const owned = player.inventory?.forgingEssence || 0;
      if (owned < cost.amount) {
        missingCosts.push({
          ...cost,
          amount: cost.amount - owned,
        });
      }
    } else if (cost.type === 'ore') {
      const { quantity } = getAvailableHighTierOreQuantity(player, cost.itemId);
      if (quantity < cost.amount) {
        missingCosts.push({
          ...cost,
          amount: cost.amount - quantity,
        });
      }
    }
  }

  if (missingCosts.length > 0) {
    const missingDesc = missingCosts
      .map(c => `${c.name} thiếu ${c.amount.toLocaleString()}`)
      .join(', ');
    return {
      eligible: false,
      reason: `Thiếu nguyên liệu: ${missingDesc}`,
      missingCosts,
    };
  }

  return { eligible: true };
}

/**
 * Thực thi Trùng Chú Trận Bàn (Pure Function, Immutable State)
 */
export function reforgeArrayDisc(
  player: PlayerStats,
  targetArrayItem: FormationItem | ActiveCultivationArrayBuff | string,
  reforgeType: ArrayReforgeType
): {
  success: boolean;
  updatedPlayer: PlayerStats;
  reforgedItem?: FormationItem | ActiveCultivationArrayBuff;
  message: string;
} {
  const check = canReforgeArrayDisc(player, targetArrayItem, reforgeType);
  if (!check.eligible) {
    return {
      success: false,
      updatedPlayer: player,
      message: check.reason || 'Điều kiện không thỏa mãn.',
    };
  }

  const recipe = ARRAY_REFORGE_CONFIG[reforgeType];
  const resolved = resolveTargetArray(player, targetArrayItem);
  if (!resolved) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy trận bàn cần trùng chú.',
    };
  }

  // 1. Trừ tài nguyên an toàn
  let newLinhThach = player.linhThach || 0;
  let newForgingEssence = player.inventory?.forgingEssence || 0;
  let updatedOres = [...(player.inventory?.ores || [])];

  for (const cost of recipe.costs) {
    if (cost.type === 'linhThach') {
      newLinhThach = Math.max(0, newLinhThach - cost.amount);
    } else if (cost.type === 'forgingEssence') {
      newForgingEssence = Math.max(0, newForgingEssence - cost.amount);
    } else if (cost.type === 'ore') {
      let needed = cost.amount;
      // Trừ từ preferred ore trước
      if (cost.itemId) {
        updatedOres = updatedOres.map(o => {
          if (o.id === cost.itemId && needed > 0 && o.quantity > 0) {
            const take = Math.min(needed, o.quantity);
            needed -= take;
            return { ...o, quantity: o.quantity - take };
          }
          return o;
        });
      }
      // Nếu vẫn còn thiếu, trừ từ các khoáng thạch cao cấp khác
      if (needed > 0) {
        for (const altId of HIGH_TIER_REFORGE_ORES) {
          if (needed <= 0) break;
          updatedOres = updatedOres.map(o => {
            if (o.id === altId && needed > 0 && o.quantity > 0) {
              const take = Math.min(needed, o.quantity);
              needed -= take;
              return { ...o, quantity: o.quantity - take };
            }
            return o;
          });
        }
      }
      updatedOres = updatedOres.filter(o => o.quantity > 0);
    }
  }

  const now = Date.now();
  let updatedFormations = [...(player.inventory?.formations || [])];
  let updatedEquippedFormation = player.equippedFormation ? { ...player.equippedFormation } : null;
  let updatedActiveArrays = [...(player.cultivationBuffState?.activeArrays || [])];
  let reforgedResult: FormationItem | ActiveCultivationArrayBuff | undefined;

  // 2. Thăng hoa thuộc tính Trận Bàn (FormationItem)
  if (resolved.formationItem) {
    const oldF = resolved.formationItem;
    const isEquipped = player.equippedFormation?.id === oldF.id;

    const newF: FormationItem = {
      ...oldF,
      isPermanent: true,
      reforgeTier: reforgeType === 'permanence' ? 1 : 2,
      offlineAbsorptionBonus: reforgeType === 'max_efficiency' ? 0.35 : (oldF.offlineAbsorptionBonus || 0),
      reforgedAt: now,
      durability: Infinity,
      maxDurability: Infinity,
      description: oldF.description.includes('【BẤT HỦ】')
        ? oldF.description
        : `【BẤT HỦ】${oldF.description}`,
    };

    // Cập nhật trong inventory formations
    const idx = updatedFormations.findIndex(f => f.id === oldF.id);
    if (idx >= 0) {
      updatedFormations[idx] = newF;
    } else {
      updatedFormations.push(newF);
    }

    // Cập nhật equippedFormation nếu đang trang bị
    if (isEquipped) {
      updatedEquippedFormation = newF;
    }

    // Nếu có active buff tương ứng trong activeArrays, đồng bộ luôn
    updatedActiveArrays = updatedActiveArrays.map(arr => {
      if (arr.itemId === oldF.id || arr.itemId === oldF.recipeId || (arr.name === oldF.name)) {
        return {
          ...arr,
          isPermanent: true,
          expiresAt: Infinity,
          reforgeTier: newF.reforgeTier,
          offlineAbsorptionBonus: newF.offlineAbsorptionBonus,
          reforgedAt: now,
        };
      }
      return arr;
    });

    reforgedResult = newF;
  }

  // 3. Thăng hoa thuộc tính Active Array Buff (nếu target là buff đang vận hành)
  if (resolved.activeBuff) {
    const oldBuff = resolved.activeBuff;
    const newBuff: ActiveCultivationArrayBuff = {
      ...oldBuff,
      isPermanent: true,
      expiresAt: Infinity,
      reforgeTier: reforgeType === 'permanence' ? 1 : 2,
      offlineAbsorptionBonus: reforgeType === 'max_efficiency' ? 0.35 : (oldBuff.offlineAbsorptionBonus || 0),
      reforgedAt: now,
    };

    updatedActiveArrays = updatedActiveArrays.map(arr => {
      if (arr.itemId === oldBuff.itemId) {
        return newBuff;
      }
      return arr;
    });

    reforgedResult = newBuff;
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: newLinhThach,
    equippedFormation: updatedEquippedFormation,
    cultivationBuffState: {
      activeArrays: updatedActiveArrays,
      learnedManualIds: player.cultivationBuffState?.learnedManualIds || [],
      meditationEfficiencyModifier: player.cultivationBuffState?.meditationEfficiencyModifier || 0,
    },
    inventory: {
      ...player.inventory,
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      ores: updatedOres,
      formations: updatedFormations,
      forgingEssence: newForgingEssence,
    } as any,
  };

  const message = reforgeType === 'permanence'
    ? '🌀 Trận bàn dẫn động thiên địa linh khí, thăng hoa thành công thành Bất Hủ Tụ Linh Trận (Vĩnh Viễn)!'
    : '⚡ Trận bàn bộc phát đại đạo thần quang, thăng hoa Tột Đỉnh Hấp Thu (+35% tốc độ tu vi bế quan ngoại tuyến)!';

  return {
    success: true,
    updatedPlayer,
    reforgedItem: reforgedResult,
    message,
  };
}
