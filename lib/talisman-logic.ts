// lib/talisman-logic.ts
// Nghiệp vụ cốt lõi cho phân hệ Phù Đạo Bách Nghệ • Phù Lục Các

import { PlayerStats } from '@/lib/types/player';
import {
  TalismanItem,
  TalismanRecipe,
  TalismanArtisan,
  TalismanBeltSlot,
  TalismanCombatEffect,
} from '@/lib/types/talisman';
import {
  TALISMAN_ARTISAN_RANKS,
  getTalismanRecipeById,
  createDefaultTalismanArtisan,
  createDefaultTalismanBelt,
} from '@/lib/talisman-data';
import { checkArtisanCraftRequirement, checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';

// ============================================================
// CHẤT LƯỢNG BIẾN DỊ LINH PHÙ
// ============================================================
export type TalismanQuality = 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'than_pham';

export const TALISMAN_QUALITY_CONFIG: Record<
  TalismanQuality,
  { label: string; color: string; multiplier: number }
> = {
  ha_pham:    { label: 'Hạ Phẩm',    color: 'text-zinc-400',   multiplier: 0.8 },
  trung_pham: { label: 'Trung Phẩm', color: 'text-green-400',  multiplier: 1.0 },
  thuong_pham:{ label: 'Thượng Phẩm',color: 'text-blue-400',   multiplier: 1.25 },
  cuc_pham:   { label: 'Cực Phẩm',   color: 'text-purple-400', multiplier: 1.5 },
  than_pham:  { label: 'Thần Phẩm',  color: 'text-amber-300',  multiplier: 2.0 },
};

export const rollTalismanQuality = (
  artisanLevel: number,
  thanThuc: number
): { quality: TalismanQuality; multiplier: number } => {
  const roll = Math.random() * 100;
  // Thần thức và cấp phù sư càng cao, cơ hội ra Cực Phẩm / Thần Phẩm càng lớn
  const bonus = (artisanLevel * 3) + Math.floor(thanThuc / 15);
  const total = roll + bonus;

  if (total >= 96) return { quality: 'than_pham', multiplier: 2.0 };
  if (total >= 85) return { quality: 'cuc_pham', multiplier: 1.5 };
  if (total >= 65) return { quality: 'thuong_pham', multiplier: 1.25 };
  if (total >= 35) return { quality: 'trung_pham', multiplier: 1.0 };
  return { quality: 'ha_pham', multiplier: 0.8 };
};

// ============================================================
// EXP & LEVEL UP CHO PHÙ SƯ
// ============================================================
export const addTalismanArtisanExp = (
  artisan: TalismanArtisan,
  expGained: number,
  realmIndex?: number
): { newLevel: number; newExp: number; newMaxExp: number; leveledUp: boolean } => {
  let level = artisan.level;
  let exp = artisan.exp + expGained;
  let maxExp = artisan.maxExp;
  let leveledUp = false;

  while (level < 9 && exp >= maxExp) {
    if (realmIndex !== undefined) {
      const promoCheck = checkArtisanPromotionRequirement(realmIndex, level);
      if (!promoCheck.canPromote) {
        exp = Math.min(exp, maxExp);
        break;
      }
    }
    exp -= maxExp;
    level += 1;
    leveledUp = true;
    const rank = TALISMAN_ARTISAN_RANKS.find(r => r.level === level);
    maxExp = rank ? rank.maxExp : 99999;
  }

  return { newLevel: level, newExp: exp, newMaxExp: maxExp, leveledUp };
};

// ============================================================
// KIỂM TRA NGUYÊN LIỆU HỌA BÙA
// ============================================================
export const canCraftTalisman = (
  player: PlayerStats,
  recipe: TalismanRecipe,
  count: number = 1
): { ok: boolean; missing: string[] } => {
  const missing: string[] = [];

  // Kiểm tra khóa theo cảnh giới Khí Tu
  const craftCheck = checkArtisanCraftRequirement(player.currentRealm || 0, recipe.tier);
  if (!craftCheck.canCraft) {
    missing.push(craftCheck.reason || 'Cảnh giới chưa đủ');
  }

  const artisan = player.talismanArtisan || createDefaultTalismanArtisan();

  if (artisan.level < recipe.requiredArtisanLevel) {
    missing.push(`Cần Phù Sư cấp ${recipe.requiredArtisanLevel}`);
  }

  const totalLinhThachCost = recipe.linhThachCost * count;
  if ((player.linhThach || 0) < totalLinhThachCost) {
    missing.push(`Thiếu ${(totalLinhThachCost - (player.linhThach || 0)).toLocaleString()} Linh Thạch`);
  }

  // Quét nguyên liệu trong kho (ores, herbs hoặc bags)
  for (const mat of recipe.requiredMaterials) {
    const requiredTotal = mat.quantity * count;
    // Tìm trong ores hoặc herbs
    const inOres = (player.inventory?.ores || []).find(o => o.id === mat.itemId);
    const inHerbs = (player.inventory?.herbs || []).find(h => h.id === mat.itemId);
    const inBags = (player.inventory?.bags || []).find((b: any) => b.id === mat.itemId);

    const owned = (inOres?.quantity || 0) + (inHerbs?.quantity || 0) + (inBags?.quantity || 0);

    if (owned < requiredTotal) {
      missing.push(`Thiếu ${requiredTotal - owned} ${mat.name}`);
    }
  }

  return { ok: missing.length === 0, missing };
};

// ============================================================
// CHẾ TÁC LINH PHÙ (CRAFT TALISMAN)
// ============================================================
export interface CraftTalismanResult {
  success: boolean;
  successCount: number;
  totalCrafted: number;
  bestQuality?: TalismanQuality;
  expGained: number;
  newLevel: number;
  newExp: number;
  newMaxExp: number;
  logTitle: string;
  logContent: string;
  toastMsg: string;
}

export const craftTalisman = (
  player: PlayerStats,
  recipeId: string,
  count: number = 1
): { result: CraftTalismanResult; updatedPlayer: PlayerStats } => {
  const recipe = getTalismanRecipeById(recipeId);
  const artisan = player.talismanArtisan || createDefaultTalismanArtisan();

  if (!recipe) {
    return {
      result: {
        success: false,
        successCount: 0,
        totalCrafted: 0,
        expGained: 0,
        newLevel: artisan.level,
        newExp: artisan.exp,
        newMaxExp: artisan.maxExp,
        logTitle: 'Lỗi',
        logContent: 'Không tìm thấy phù đồ.',
        toastMsg: '❌ Không tìm thấy phù đồ.',
      },
      updatedPlayer: player,
    };
  }

  const { ok, missing } = canCraftTalisman(player, recipe, count);
  if (!ok) {
    return {
      result: {
        success: false,
        successCount: 0,
        totalCrafted: 0,
        expGained: 0,
        newLevel: artisan.level,
        newExp: artisan.exp,
        newMaxExp: artisan.maxExp,
        logTitle: missing[0]?.includes('cảnh giới') || missing[0]?.includes('Đạo hữu') ? 'Tu Vi Chưa Đủ' : 'Thiếu Nguyên Liệu',
        logContent: missing.join(', '),
        toastMsg: missing[0]?.includes('cảnh giới') || missing[0]?.includes('Đạo hữu')
          ? `🔒 ${missing[0]}`
          : `❌ Thiếu: ${missing[0]}`,
      },
      updatedPlayer: player,
    };
  }

  const thanThuc = player.thanThuc || player.tamCanh || 20;
  const artisanBonus = artisan.level * 4;
  const thanThucBonus = Math.floor(thanThuc / 12);
  const finalSuccessRate = Math.min(95, Math.max(25, recipe.baseSuccessRate + artisanBonus + thanThucBonus));

  // Trừ nguyên liệu
  let updatedOres = [...(player.inventory?.ores || [])];
  let updatedHerbs = [...(player.inventory?.herbs || [])];
  let updatedBags = [...(player.inventory?.bags || [])];

  for (const mat of recipe.requiredMaterials) {
    let needed = mat.quantity * count;

    // Trừ từ ores trước
    updatedOres = updatedOres.map(o => {
      if (o.id === mat.itemId && needed > 0) {
        const deduct = Math.min(o.quantity, needed);
        needed -= deduct;
        return { ...o, quantity: o.quantity - deduct };
      }
      return o;
    }).filter(o => o.quantity > 0);

    // Trừ từ herbs nếu còn
    if (needed > 0) {
      updatedHerbs = updatedHerbs.map(h => {
        if (h.id === mat.itemId && needed > 0) {
          const deduct = Math.min(h.quantity, needed);
          needed -= deduct;
          return { ...h, quantity: h.quantity - deduct };
        }
        return h;
      }).filter(h => h.quantity > 0);
    }

    // Trừ từ bags nếu còn
    if (needed > 0) {
      updatedBags = updatedBags.map((b: any) => {
        if (b.id === mat.itemId && needed > 0) {
          const deduct = Math.min(b.quantity, needed);
          needed -= deduct;
          return { ...b, quantity: b.quantity - deduct };
        }
        return b;
      }).filter((b: any) => b.quantity > 0);
    }
  }

  const totalCost = recipe.linhThachCost * count;
  const newLinhThach = Math.max(0, (player.linhThach || 0) - totalCost);

  // Tiến hành vẽ từng lá bùa
  let successCount = 0;
  let bestQuality: TalismanQuality = 'ha_pham';
  const qualityWeight: Record<TalismanQuality, number> = {
    ha_pham: 1,
    trung_pham: 2,
    thuong_pham: 3,
    cuc_pham: 4,
    than_pham: 5,
  };

  for (let i = 0; i < count; i++) {
    const roll = Math.random() * 100;
    if (roll < finalSuccessRate) {
      successCount++;
      const { quality } = rollTalismanQuality(artisan.level, thanThuc);
      if (qualityWeight[quality] > qualityWeight[bestQuality]) {
        bestQuality = quality;
      }
    }
  }

  // Tính EXP nhận được
  const baseExp = recipe.baseExpGain || 20;
  const expGain = (successCount * baseExp) + Math.floor((count - successCount) * baseExp * 0.25);
  const { newLevel, newExp, newMaxExp, leveledUp } = addTalismanArtisanExp(artisan, expGain, player.currentRealm);

  // Cập nhật Talismans trong kho
  const existingTalismans: TalismanItem[] = Array.isArray(player.inventory?.talismans)
    ? [...player.inventory.talismans]
    : [];

  if (successCount > 0) {
    const existingIndex = existingTalismans.findIndex(t => t.recipeId === recipe.id);
    if (existingIndex >= 0) {
      existingTalismans[existingIndex] = {
        ...existingTalismans[existingIndex],
        quantity: existingTalismans[existingIndex].quantity + successCount,
      };
    } else {
      const newTalisman: TalismanItem = {
        id: `talisman_${recipe.id}_${Date.now()}`,
        recipeId: recipe.id,
        name: recipe.name,
        type: recipe.type,
        tier: recipe.tier,
        grade: recipe.grade,
        quantity: successCount,
        description: recipe.description,
        triggerType: recipe.triggerType,
        triggerConditionValue: recipe.triggerConditionValue,
        combatEffect: recipe.combatEffect,
        breakthroughEffect: recipe.breakthroughEffect,
        utilityEffect: recipe.utilityEffect,
      };
      existingTalismans.push(newTalisman);
    }
  }

  const updatedArtisan: TalismanArtisan = {
    ...artisan,
    level: newLevel,
    exp: newExp,
    maxExp: newMaxExp,
    totalCrafted: (artisan.totalCrafted || 0) + successCount,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: newLinhThach,
    talismanArtisan: updatedArtisan,
    inventory: {
      ...player.inventory,
      pills: player.inventory?.pills ?? [],
      herbs: updatedHerbs,
      ores: updatedOres,
      bags: updatedBags,
      talismans: existingTalismans,
    } as any,
  };

  const rank = TALISMAN_ARTISAN_RANKS.find(r => r.level === newLevel);
  const logTitle = successCount > 0
    ? `✍️ CHẤP BÚT HỌA BÙA THÀNH CÔNG! [${recipe.name} x${successCount}]`
    : `💨 HỌA BÙA THẤT BẠI [${recipe.name}]`;

  const logContent = successCount > 0
    ? `Bút lông phát quang, linh khí quán nhập! Họa thành công ${successCount}/${count} lá 【${recipe.name}】 (${TALISMAN_QUALITY_CONFIG[bestQuality].label}). Phù Đạo EXP +${expGain}.${leveledUp ? ` 🌟 ĐỘT PHÁ CẤP BẬC PHÙ SƯ → ${rank?.title}!` : ''}`
    : `Tâm thần bất định, mực chu sa tản loạn! Vẽ ${count} lá phù lục bất thành. Tiêu hao nguyên liệu, EXP +${expGain}.`;

  const toastMsg = successCount > 0
    ? `✅ Họa thành [${recipe.name}] x${successCount}!`
    : `❌ Họa bùa thất bại!`;

  return {
    result: {
      success: successCount > 0,
      successCount,
      totalCrafted: count,
      bestQuality,
      expGained: expGain,
      newLevel,
      newExp,
      newMaxExp,
      logTitle,
      logContent,
      toastMsg,
    },
    updatedPlayer,
  };
};

// ============================================================
// TRANG BỊ & THÁO BÙA KHỎI PHÙ NANG BẢN MỆNH (3 SLOTS)
// ============================================================
export const equipTalismanToBelt = (
  player: PlayerStats,
  slotIndex: number,
  talismanId: string
): { success: boolean; updatedPlayer: PlayerStats; message: string } => {
  if (slotIndex < 0 || slotIndex > 2) {
    return { success: false, updatedPlayer: player, message: 'Vị trí Phù Nang không hợp lệ (0-2).' };
  }

  const talismans: TalismanItem[] = player.inventory?.talismans || [];
  const target = talismans.find(t => t.id === talismanId || t.recipeId === talismanId);

  if (!target || target.quantity <= 0) {
    return { success: false, updatedPlayer: player, message: 'Không tìm thấy linh phù trong túi hoặc đã hết số lượng.' };
  }

  if (target.type !== 'combat') {
    return { success: false, updatedPlayer: player, message: 'Chỉ có Chiến Đấu Phù mới có thể trang bị vào Phù Nang xuất chiến!' };
  }

  const currentBelt = player.equippedTalismans && Array.isArray(player.equippedTalismans)
    ? [...player.equippedTalismans]
    : createDefaultTalismanBelt();

  // Đảm bảo có đủ 3 slot
  while (currentBelt.length < 3) {
    currentBelt.push({ slotIndex: currentBelt.length, talismanId: null });
  }

  currentBelt[slotIndex] = {
    slotIndex,
    talismanId: target.id,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    equippedTalismans: currentBelt,
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã nạp [${target.name}] vào ô Phù Nang ${slotIndex + 1}!`,
  };
};

export const unequipTalismanFromBelt = (
  player: PlayerStats,
  slotIndex: number
): { success: boolean; updatedPlayer: PlayerStats; message: string } => {
  const currentBelt = player.equippedTalismans && Array.isArray(player.equippedTalismans)
    ? [...player.equippedTalismans]
    : createDefaultTalismanBelt();

  if (slotIndex < 0 || slotIndex >= currentBelt.length) {
    return { success: false, updatedPlayer: player, message: 'Vị trí không hợp lệ.' };
  }

  currentBelt[slotIndex] = {
    slotIndex,
    talismanId: null,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    equippedTalismans: currentBelt,
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã tháo bùa khỏi ô Phù Nang ${slotIndex + 1}.`,
  };
};

// ============================================================
// XỬ LÝ KÍCH HOẠT PHÙ LỤC TRONG CHIẾN ĐẤU (PROCESS COMBAT TALISMANS)
// ============================================================
export interface TalismanCombatTriggerResult {
  triggered: boolean;
  talismanName?: string;
  logText?: string;
  shieldAmount?: number;
  extraDamage?: number;
  damageMultiplier?: number;
  stunBoss?: boolean;
  healAmount?: number;
  evasionBonus?: number;
  burnPercent?: number;
  ignoreDefense?: boolean;
  consumedTalismanId?: string;
  updatedPlayer: PlayerStats;
}

export const processCombatTalismans = (
  player: PlayerStats,
  turnNumber: number,
  playerCurrentHp: number,
  playerMaxHp: number,
  playerAtk: number
): TalismanCombatTriggerResult => {
  const belt = player.equippedTalismans || [];
  const inventoryTalismans: TalismanItem[] = Array.isArray(player.inventory?.talismans)
    ? [...player.inventory.talismans]
    : [];

  const defaultResult: TalismanCombatTriggerResult = {
    triggered: false,
    updatedPlayer: player,
  };

  // Duyệt qua 3 ô Phù Nang
  for (const slot of belt) {
    if (!slot.talismanId) continue;

    const talisman = inventoryTalismans.find(t => (t.id === slot.talismanId || t.recipeId === slot.talismanId) && t.quantity > 0);
    if (!talisman || !talisman.combatEffect) continue;

    const hpRatio = (playerCurrentHp / Math.max(1, playerMaxHp)) * 100;
    let shouldTrigger = false;
    let triggerFlavor = '';

    if (talisman.triggerType === 'turn_start' && turnNumber === 1) {
      shouldTrigger = true;
      triggerFlavor = `📜 [PHÙ LỤC XUẤT THẾ • ${talisman.name.toUpperCase()}] Phù chỉ cháy rực, dẫn động thiên địa linh khí!`;
    } else if (talisman.triggerType === 'hp_low') {
      const threshold = talisman.triggerConditionValue || 15;
      if (hpRatio <= threshold) {
        shouldTrigger = true;
        triggerFlavor = `🩸 [HUYẾT ĐỘN BẢO MỆNH • ${talisman.name.toUpperCase()}] Sinh mệnh nguy nan (${Math.round(hpRatio)}% HP), phù lục hóa thành huyết quang cứu chủ!`;
      }
    }

    if (shouldTrigger) {
      // Tiêu hao 1 lá bùa trong kho
      talisman.quantity -= 1;
      let updatedBelt = [...belt];

      // Nếu hết bùa thì tự động gỡ khỏi ô Phù Nang
      if (talisman.quantity <= 0) {
        updatedBelt = updatedBelt.map(s => s.slotIndex === slot.slotIndex ? { ...s, talismanId: null } : s);
      }

      const eff = talisman.combatEffect;
      const shieldAmount = eff.shieldAmountPercent
        ? Math.floor(playerMaxHp * (eff.shieldAmountPercent / 100))
        : 0;
      const extraDamage = eff.flatDamageMultiplier
        ? Math.floor(playerAtk * eff.flatDamageMultiplier)
        : 0;
      const healAmount = eff.healPercent
        ? Math.floor(playerMaxHp * (eff.healPercent / 100))
        : 0;
      const stunBoss = eff.stunChance
        ? Math.random() * 100 < eff.stunChance
        : false;

      let effectDesc = '';
      if (shieldAmount > 0) effectDesc += ` Ngưng tụ kim quang hư ảnh hấp thụ ${shieldAmount.toLocaleString()} sát thương!`;
      if (extraDamage > 0) effectDesc += ` Phóng xuất công kích nổ tung gây ${extraDamage.toLocaleString()} sát thương!`;
      if (stunBoss) effectDesc += ` Đối thủ bị thần niệm trói buộc, tê liệt mất lượt!`;
      if (healAmount > 0) effectDesc += ` Lập tức hồi phục ${healAmount.toLocaleString()} Khí Huyết!`;
      if (eff.evasionBuffPercent) effectDesc += ` Tăng ${eff.evasionBuffPercent}% Né Tránh!`;

      const logText = `${triggerFlavor}${effectDesc}`;

      const updatedPlayer: PlayerStats = {
        ...player,
        equippedTalismans: updatedBelt,
        inventory: {
          ...player.inventory,
          pills: player.inventory?.pills ?? [],
          herbs: player.inventory?.herbs ?? [],
          talismans: inventoryTalismans.filter(t => t.quantity > 0),
        } as any,
      };

      return {
        triggered: true,
        talismanName: talisman.name,
        logText,
        shieldAmount,
        extraDamage,
        damageMultiplier: eff.flatDamageMultiplier,
        stunBoss,
        healAmount,
        evasionBonus: eff.evasionBuffPercent,
        burnPercent: eff.burnPercent,
        ignoreDefense: eff.ignoreDefense,
        consumedTalismanId: talisman.id,
        updatedPlayer,
      };
    }
  }

  return defaultResult;
};

// ============================================================
// SỬ DỤNG PHÙ LỤC PHỤ TRỢ (USE UTILITY TALISMAN)
// ============================================================
export const useUtilityTalisman = (
  player: PlayerStats,
  talismanId: string
): { success: boolean; updatedPlayer: PlayerStats; message: string; logText: string } => {
  const talismans: TalismanItem[] = Array.isArray(player.inventory?.talismans)
    ? [...player.inventory.talismans]
    : [];

  const itemIndex = talismans.findIndex(t => t.id === talismanId && t.quantity > 0);
  if (itemIndex < 0) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy phù lục hoặc số lượng đã hết.',
      logText: '',
    };
  }

  const item = talismans[itemIndex];
  if (item.type !== 'utility' || !item.utilityEffect) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Linh phù này không thể dùng trực tiếp.',
      logText: '',
    };
  }

  // Tiêu hao 1 lá
  item.quantity -= 1;
  const filteredTalismans = talismans.filter(t => t.quantity > 0);

  // Kích hoạt buff
  const eff = item.utilityEffect;
  const durationMs = (eff.durationHours || 2) * 60 * 60 * 1000;
  const activeBuffs = {
    ...(player.activeBuffs || {}),
    talismanCultivationSpeedBonus: eff.cultivationSpeedBonus || 0,
    talismanSecretRealmSpeedBonus: eff.secretRealmSpeedBonus || 0,
    talismanAmbushReduction: eff.ambushReductionChance || 0,
    talismanBuffUntil: Date.now() + durationMs,
  };

  const logText = `📜 [PHỤ TRỢ LINH PHÙ • ${item.name.toUpperCase()}] Phù chỉ hóa thành thanh phong bao bọc quanh thân! ${eff.description || ''} (Hiệu lực trong ${eff.durationHours || 2} giờ).`;
  const message = `Đã sử dụng [${item.name}]!`;

  const updatedPlayer: PlayerStats = {
    ...player,
    activeBuffs,
    inventory: {
      ...player.inventory,
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      talismans: filteredTalismans,
    } as any,
  };

  return {
    success: true,
    updatedPlayer,
    message,
    logText,
  };
};

// ============================================================
// HỖ TRỢ ĐỘT PHÁ CẢNH GIỚI (BREAKTHROUGH TALISMAN CONSUMPTION)
// ============================================================
export const getBreakthroughTalismanModifier = (
  player: PlayerStats
): {
  hasTalisman: boolean;
  talismanItem?: TalismanItem;
  tamMaResistBonus: number;
  tribulationReduction: number;
  successRateBonus: number;
  description: string;
} => {
  const talismans: TalismanItem[] = Array.isArray(player.inventory?.talismans)
    ? player.inventory.talismans
    : [];

  const btTalisman = talismans.find(t => t.type === 'breakthrough' && t.quantity > 0 && t.breakthroughEffect);
  if (!btTalisman || !btTalisman.breakthroughEffect) {
    return {
      hasTalisman: false,
      tamMaResistBonus: 0,
      tribulationReduction: 0,
      successRateBonus: 0,
      description: '',
    };
  }

  const eff = btTalisman.breakthroughEffect;
  return {
    hasTalisman: true,
    talismanItem: btTalisman,
    tamMaResistBonus: eff.tamMaResistBonus || 0,
    tribulationReduction: eff.tribulationDmgReduction || 0,
    successRateBonus: eff.breakthroughSuccessBonus || 0,
    description: eff.description || btTalisman.description,
  };
};

export const consumeBreakthroughTalisman = (
  player: PlayerStats,
  talismanId: string
): { success: boolean; updatedPlayer: PlayerStats; logMessage: string } => {
  const talismans: TalismanItem[] = Array.isArray(player.inventory?.talismans)
    ? [...player.inventory.talismans]
    : [];

  const idx = talismans.findIndex(t => t.id === talismanId && t.quantity > 0);
  if (idx < 0) {
    return { success: false, updatedPlayer: player, logMessage: '' };
  }

  const item = talismans[idx];
  item.quantity -= 1;

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: {
      ...player.inventory,
      pills: player.inventory?.pills ?? [],
      herbs: player.inventory?.herbs ?? [],
      talismans: talismans.filter(t => t.quantity > 0),
    } as any,
  };

  const logMessage = `📜 [HỘ MỆNH LINH PHÙ] Đã đốt cháy 1 lá 【${item.name}】 gia trì đạo tâm, gia tăng tỉ lệ đột phá thành công!`;

  return { success: true, updatedPlayer, logMessage };
};
