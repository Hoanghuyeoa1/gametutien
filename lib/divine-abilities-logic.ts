// lib/divine-abilities-logic.ts
// Pure Business Logic Engine cho Hệ Thống Thần Thông Bí Thuật Cửu Giai

import { PlayerStats } from './types/player';
import { DivineAbilityShopItem, DivineTriggerCondition } from './types/divine-abilities';
import { DIVINE_SHOP_ITEMS_MAP } from './divine-abilities-data';
import { calculateTotalEquivalentHaPham } from './item-quality-data';

export interface BuyAndLearnDivineResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

export interface EquipDivineResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Số lượng Ô Thần Thông Xuất Chiến tối đa theo cảnh giới
 * - Realm 0–15 (Luyện Khí, Trúc Cơ): 1 Slot
 * - Realm 16–25 (Kim Đan, Nguyên Anh): 2 Slots
 * - Realm 26–35 (Hóa Thần, Luyện Hư): 3 Slots
 * - Realm 36+ (Hợp Thể, Đại Thừa, Tiên Nhân): 4 Slots
 */
export function getMaxDivineAbilitySlots(realmIndex: number): number {
  if (realmIndex < 16) return 1;
  if (realmIndex < 26) return 2;
  if (realmIndex < 36) return 3;
  return 4;
}

/**
 * Xử lý mua và trực tiếp đắc ngộ thần thông bí thuật
 */
export function buyAndLearnDivineAbility(
  player: PlayerStats,
  divineItem: DivineAbilityShopItem
): BuyAndLearnDivineResult {
  // 1. Kiểm tra vật phẩm hợp lệ
  if (!divineItem || !divineItem.id) {
    return { success: false, message: 'Thần thông bí thuật không tồn tại!' };
  }

  // 2. Ràng buộc cảnh giới (Realm Gating)
  const playerRealm = player.currentRealm || 0;
  if (playerRealm < divineItem.requiredRealmIndex) {
    return {
      success: false,
      message: `Cảnh giới không đủ! Cần đạt [${divineItem.requiredRealmName}] (Cảnh giới cấp ${divineItem.requiredRealmIndex}) để lĩnh ngộ pho thần thông này.`
    };
  }

  // 3. Quy tắc chống mua & học trùng lặp (Duplicate Guard)
  const currentLearned = player.divineAbilitiesState?.learnedDivineIds || [];
  if (currentLearned.includes(divineItem.id)) {
    return {
      success: false,
      message: `Đã đắc ngộ thần thông [${divineItem.name}], không thể tu luyện trùng lặp!`
    };
  }

  // 4. Kiểm tra ngân lượng
  const totalEquivalent = calculateTotalEquivalentHaPham(player);
  if (totalEquivalent < divineItem.price) {
    return {
      success: false,
      message: `Không đủ Linh Thạch! Cần ${divineItem.price.toLocaleString()} Linh Thạch để đắc ngộ [${divineItem.name}].`
    };
  }

  // 5. Khấu trừ Linh Thạch đa tầng an toàn
  let remainingCost = divineItem.price;
  let haPham = player.linhThach || 0;
  let trungPham = player.trungPhamLinhThach || 0;
  let thuongPham = player.thuongPhamLinhThach || 0;
  let cucPham = player.cucPhamLinhThach || 0;
  let tienPham = player.tienTinh || player.tienPhamLinhThach || 0;

  // Trừ Hạ Phẩm trước
  const fromHaPham = Math.min(haPham, remainingCost);
  haPham -= fromHaPham;
  remainingCost -= fromHaPham;

  // Nếu còn thiếu, trừ Trung Phẩm (1 TP = 1,000 HP)
  if (remainingCost > 0 && trungPham > 0) {
    const tpNeeded = Math.ceil(remainingCost / 1000);
    const tpToUse = Math.min(trungPham, tpNeeded);
    trungPham -= tpToUse;
    const surplus = tpToUse * 1000 - remainingCost;
    if (surplus > 0) {
      haPham += surplus;
      remainingCost = 0;
    } else {
      remainingCost -= tpToUse * 1000;
    }
  }

  // Nếu còn thiếu, trừ Thượng Phẩm (1 ThP = 1,000,000 HP)
  if (remainingCost > 0 && thuongPham > 0) {
    const thpNeeded = Math.ceil(remainingCost / 1000000);
    const thpToUse = Math.min(thuongPham, thpNeeded);
    thuongPham -= thpToUse;
    const surplus = thpToUse * 1000000 - remainingCost;
    if (surplus > 0) {
      haPham += surplus;
      remainingCost = 0;
    } else {
      remainingCost -= thpToUse * 1000000;
    }
  }

  // Nếu còn thiếu, trừ Cực Phẩm (1 CP = 1,000,000,000 HP)
  if (remainingCost > 0 && cucPham > 0) {
    const cpNeeded = Math.ceil(remainingCost / 1000000000);
    const cpToUse = Math.min(cucPham, cpNeeded);
    cucPham -= cpToUse;
    const surplus = cpToUse * 1000000000 - remainingCost;
    if (surplus > 0) {
      haPham += surplus;
      remainingCost = 0;
    } else {
      remainingCost -= cpToUse * 1000000000;
    }
  }

  // Nếu còn thiếu, trừ Tiên Phẩm (1 TienP = 1,000,000,000,000 HP)
  if (remainingCost > 0 && tienPham > 0) {
    const tienNeeded = Math.ceil(remainingCost / 1000000000000);
    const tienToUse = Math.min(tienPham, tienNeeded);
    tienPham -= tienToUse;
    const surplus = tienToUse * 1000000000000 - remainingCost;
    if (surplus > 0) {
      haPham += surplus;
      remainingCost = 0;
    } else {
      remainingCost -= tienToUse * 1000000000000;
    }
  }

  // 6. Cập nhật danh sách Thần Thông đã học
  const updatedLearned = [...currentLearned, divineItem.id];

  // 7. Tự động trang bị vào ô trống nếu còn slot
  const currentEquipped = player.divineAbilitiesState?.equippedDivineIds || [];
  const maxSlots = getMaxDivineAbilitySlots(playerRealm);
  let updatedEquipped = [...currentEquipped];
  let autoEquipNotice = '';

  if (updatedEquipped.length < maxSlots && !updatedEquipped.includes(divineItem.id)) {
    updatedEquipped.push(divineItem.id);
    autoEquipNotice = ` và tự động bố trí vào Ô Thần Thông Xuất Chiến (${updatedEquipped.length}/${maxSlots})`;
  }

  // 8. Đưa vào danh sách độc bản đã mua
  const currentPurchased = player.merchantState?.purchasedOneTimeIds || [];
  const updatedPurchased = currentPurchased.includes(divineItem.id)
    ? currentPurchased
    : [...currentPurchased, divineItem.id];

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: haPham,
    trungPhamLinhThach: trungPham,
    thuongPhamLinhThach: thuongPham,
    cucPhamLinhThach: cucPham,
    tienTinh: tienPham,
    tienPhamLinhThach: tienPham,
    divineAbilitiesState: {
      learnedDivineIds: updatedLearned,
      equippedDivineIds: updatedEquipped
    },
    merchantState: {
      ...player.merchantState,
      items: player.merchantState?.items || [],
      purchasedOneTimeIds: updatedPurchased
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đắc ngộ thành công Thần Thông [${divineItem.name}] (${divineItem.tierName}) tiêu hao ${divineItem.price.toLocaleString()} Linh Thạch${autoEquipNotice}! Uy danh chấn động cửu thiên!`
  };
}

/**
 * Trang bị Thần Thông vào Ô Xuất Chiến
 */
export function equipDivineAbility(
  player: PlayerStats,
  abilityId: string
): EquipDivineResult {
  const ability = DIVINE_SHOP_ITEMS_MAP[abilityId];
  if (!ability) {
    return { success: false, message: 'Thần thông không tồn tại!' };
  }

  const learned = player.divineAbilitiesState?.learnedDivineIds || [];
  if (!learned.includes(abilityId)) {
    return { success: false, message: `Chưa đắc ngộ thần thông [${ability.name}], không thể xuất chiến!` };
  }

  const equipped = player.divineAbilitiesState?.equippedDivineIds || [];
  if (equipped.includes(abilityId)) {
    return { success: false, message: `Thần thông [${ability.name}] đã được trang bị trong Ô Xuất Chiến!` };
  }

  const maxSlots = getMaxDivineAbilitySlots(player.currentRealm || 0);
  if (equipped.length >= maxSlots) {
    return {
      success: false,
      message: `Đã đầy Ô Thần Thông Xuất Chiến (${equipped.length}/${maxSlots})! Đạo hữu hãy tháo gỡ bớt thần thông hoặc đột phá cảnh giới để mở thêm ô.`
    };
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    divineAbilitiesState: {
      learnedDivineIds: learned,
      equippedDivineIds: [...equipped, abilityId]
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã trang bị Thần Thông [${ability.name}] vào Ô Xuất Chiến (${equipped.length + 1}/${maxSlots})!`
  };
}

/**
 * Gỡ bỏ Thần Thông khỏi Ô Xuất Chiến
 */
export function unequipDivineAbility(
  player: PlayerStats,
  abilityId: string
): EquipDivineResult {
  const ability = DIVINE_SHOP_ITEMS_MAP[abilityId];
  const abilityName = ability ? ability.name : abilityId;

  const equipped = player.divineAbilitiesState?.equippedDivineIds || [];
  if (!equipped.includes(abilityId)) {
    return { success: false, message: `Thần thông [${abilityName}] hiện không được trang bị!` };
  }

  const learned = player.divineAbilitiesState?.learnedDivineIds || [];
  const updatedEquipped = equipped.filter(id => id !== abilityId);

  const updatedPlayer: PlayerStats = {
    ...player,
    divineAbilitiesState: {
      learnedDivineIds: learned,
      equippedDivineIds: updatedEquipped
    }
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã gỡ bỏ Thần Thông [${abilityName}] khỏi Ô Xuất Chiến!`
  };
}

/**
 * Kết quả kích hoạt Thần Thông trong một hiệp giao tranh
 */
export interface CombatDivineResult {
  triggeredAbilities: DivineAbilityShopItem[];
  logs: string[];
  extraDamage: number;
  trueDamage: number;
  shieldValue: number;
  healValue: number;
  reflectPercent: number;
  stunTarget: boolean;
  debuffAtkPercent: number;
  buffAtkPercent: number;
  buffCritRatePercent: number;
  buffCritDmgPercent: number;
  buffSpeedPercent: number;
  buffDodgePercent: number;
  invulnerable: boolean;
  deathWardTriggered: boolean;
  executeTriggered: boolean;
}

/**
 * Xử lý kích hoạt các Thần Thông Xuất Chiến trong hiệp giao tranh
 */
export function processCombatDivineAbilities(
  player: PlayerStats,
  turn: number,
  playerCurHp: number,
  playerMaxHp: number,
  bossCurHp: number,
  bossMaxHp: number,
  playerAtk: number,
  isCrit: boolean = false,
  usedAbilityTracker: Set<string> = new Set()
): CombatDivineResult {
  const result: CombatDivineResult = {
    triggeredAbilities: [],
    logs: [],
    extraDamage: 0,
    trueDamage: 0,
    shieldValue: 0,
    healValue: 0,
    reflectPercent: 0,
    stunTarget: false,
    debuffAtkPercent: 0,
    buffAtkPercent: 0,
    buffCritRatePercent: 0,
    buffCritDmgPercent: 0,
    buffSpeedPercent: 0,
    buffDodgePercent: 0,
    invulnerable: false,
    deathWardTriggered: false,
    executeTriggered: false
  };

  const equippedIds = player.divineAbilitiesState?.equippedDivineIds || [];
  if (equippedIds.length === 0) return result;

  const playerName = player.name || 'Đạo Hữu';
  const hpPercent = (playerCurHp / Math.max(1, playerMaxHp)) * 100;
  const bossHpPercent = (bossCurHp / Math.max(1, bossMaxHp)) * 100;

  for (const abilityId of equippedIds) {
    const ability = DIVINE_SHOP_ITEMS_MAP[abilityId];
    if (!ability) continue;

    let shouldTrigger = false;
    const cond = ability.triggerCondition;

    if (cond === 'combat_start') {
      if (turn === 1) shouldTrigger = true;
    } else if (cond === 'hp_below_30') {
      // Chỉ kích hoạt khi HP dưới 30% và chưa kích hoạt trong trận này
      if (hpPercent <= 30 && !usedAbilityTracker.has(ability.id)) {
        shouldTrigger = true;
      }
    } else if (cond === 'on_crit_strike') {
      if (isCrit && (turn === 1 || turn % (ability.cooldownTurns || 3) === 0)) {
        shouldTrigger = true;
      }
    } else if (cond === 'active_cooldown') {
      // Kích hoạt theo nhịp hồi chiêu
      const cd = ability.cooldownTurns || 3;
      if (turn === 1 || turn % cd === 0) {
        shouldTrigger = true;
      }
    }

    if (!shouldTrigger) continue;

    usedAbilityTracker.add(ability.id);
    result.triggeredAbilities.push(ability);

    const eff = ability.combatEffects;
    let logMsg = `⚡ [THẦN THÔNG HIỂN LINH] ${playerName} thi triển [${ability.name}]!`;

    // 1. Sát thương % ATK
    if (eff.damageMultiplier && eff.damageMultiplier > 0) {
      const dmg = Math.floor(playerAtk * eff.damageMultiplier);
      result.extraDamage += dmg;
      logMsg += ` Giáng xuống ${dmg.toLocaleString()} sát thương thần thông (${Math.round(eff.damageMultiplier * 100)}% ATK)!`;
    }

    // 2. Sát thương chuẩn
    if (eff.trueDamageFlat && eff.trueDamageFlat > 0) {
      result.trueDamage += eff.trueDamageFlat;
      logMsg += ` Kèm theo ${eff.trueDamageFlat.toLocaleString()} sát thương chuẩn bỏ qua giáp!`;
    }

    // 3. Trảm sát kết liễu (Execute)
    if (eff.executeHpThresholdPercent && bossHpPercent <= eff.executeHpThresholdPercent) {
      result.executeTriggered = true;
      logMsg += ` ⚡ [TRẢM SÁT THẦN LÔI] Khí Huyết đối phương dưới ${eff.executeHpThresholdPercent}%, dẫn thiên lôi tức thì kết liễu!`;
    }

    // 4. Khiên chắn % Max HP
    if (eff.shieldPercentOfMaxHp && eff.shieldPercentOfMaxHp > 0) {
      const shield = Math.floor(playerMaxHp * (eff.shieldPercentOfMaxHp / 100));
      result.shieldValue += shield;
      logMsg += ` Ngưng tụ khiên hộ thể hấp thụ ${shield.toLocaleString()} sát thương!`;
    }

    // 5. Hồi phục máu % Max HP
    if (eff.healPercentOfMaxHp && eff.healPercentOfMaxHp > 0) {
      const heal = Math.floor(playerMaxHp * (eff.healPercentOfMaxHp / 100));
      result.healValue += heal;
      logMsg += ` Hồi phục ${heal.toLocaleString()} Khí Huyết!`;
    }

    // 6. Phản phệ
    if (eff.reflectPercent && eff.reflectPercent > 0) {
      result.reflectPercent = Math.max(result.reflectPercent, eff.reflectPercent);
      logMsg += ` Kích hoạt phản phệ ${eff.reflectPercent}% sát thương!`;
    }

    // 7. Choáng (Stun)
    if (eff.stunTarget) {
      result.stunTarget = true;
      logMsg += ` 💫 [ĐỊNH THÂN] Uy áp thần hồn khiến đối phương tê liệt mất lượt!`;
    }

    // 8. Suy yếu địch (Debuff ATK)
    if (eff.debuffAtkPercent && eff.debuffAtkPercent > 0) {
      result.debuffAtkPercent = Math.max(result.debuffAtkPercent, eff.debuffAtkPercent);
      logMsg += ` Trấn áp linh mạch làm suy yếu ${eff.debuffAtkPercent}% Công Kích của đối thủ!`;
    }

    // 9. Tước đoạt chuyển hóa ATK/DEF
    if (eff.drainEnemyAtkDefPercent && eff.drainEnemyAtkDefPercent > 0) {
      result.debuffAtkPercent = Math.max(result.debuffAtkPercent, eff.drainEnemyAtkDefPercent);
      result.buffAtkPercent += eff.drainEnemyAtkDefPercent;
      logMsg += ` Tước đoạt ${eff.drainEnemyAtkDefPercent}% Công Kích của đối phương chuyển hóa gia trì bản thân!`;
    }

    // 10. Buff bản thân
    if (eff.buffAtkPercent && eff.buffAtkPercent > 0) {
      result.buffAtkPercent += eff.buffAtkPercent;
    }
    if (eff.buffCritRatePercent && eff.buffCritRatePercent > 0) {
      result.buffCritRatePercent += eff.buffCritRatePercent;
    }
    if (eff.buffCritDmgPercent && eff.buffCritDmgPercent > 0) {
      result.buffCritDmgPercent += eff.buffCritDmgPercent;
    }
    if (eff.buffSpeedPercent && eff.buffSpeedPercent > 0) {
      result.buffSpeedPercent += eff.buffSpeedPercent;
    }
    if (eff.buffDodgePercent && eff.buffDodgePercent > 0) {
      result.buffDodgePercent += eff.buffDodgePercent;
    }

    // 11. Miễn tử / Bù nhìn thế mạng
    if (eff.deathWardReviveHpPercent && eff.deathWardReviveHpPercent > 0) {
      result.deathWardTriggered = true;
      const reviveHp = Math.floor(playerMaxHp * (eff.deathWardReviveHpPercent / 100));
      result.healValue += reviveHp;
      logMsg += ` 🌟 [NIẾT BÀN TRÙNG SINH] Thế thân cứu mạng, hồi sinh ${reviveHp.toLocaleString()} Khí Huyết và nhận trạng thái Vô Địch!`;
    }

    // 12. Vô địch (Invulnerable)
    if (eff.invulnerableTurns && eff.invulnerableTurns > 0) {
      result.invulnerable = true;
      logMsg += ` 🛡️ [HƯ VÔ VÔ ĐỊCH] Miễn nhiễm toàn bộ sát thương trong hiệp này!`;
    }

    result.logs.push(logMsg);
  }

  return result;
}
