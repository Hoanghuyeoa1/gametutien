// lib/equipment-shop-logic.ts
// Pure Business Logic cho phân hệ Trang Bị Cửu Giai trong Vạn Bảo Thương Hội

import { PlayerStats } from '@/lib/types/player';
import { EquipmentShopItem, EquipmentStatDiff } from '@/lib/types/equipment-shop';
import { Equipment } from '@/lib/types/items';
import { deductEquivalentLinhThach } from '@/lib/merchant-data';
import { calculateTotalEquivalentHaPham } from '@/lib/item-quality-data';
import { getMaxInventoryCapacity, getCurrentInventoryOccupiedSlots } from '@/lib/inventory-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { equipmentShopItemToEquipment } from '@/lib/equipment-shop-data';

export interface BuyEquipmentResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
  equippedNow?: boolean;
}

const STAT_CONFIGS: Record<string, { label: string; unit: string; isPercent: boolean }> = {
  atk: { label: 'Công Kích', unit: '', isPercent: false },
  def: { label: 'Phòng Ngự', unit: '', isPercent: false },
  maxHp: { label: 'Khí Huyết', unit: '', isPercent: false },
  speed: { label: 'Thân Pháp', unit: '', isPercent: false },
  critRate: { label: 'Bạo Kích', unit: '%', isPercent: true },
  critDmg: { label: 'Bạo Thương', unit: '%', isPercent: true },
  dodge: { label: 'Né Tránh', unit: '%', isPercent: true },
  penetration: { label: 'Xuyên Giáp', unit: '%', isPercent: true },
  damageReduction: { label: 'Miễn Thương', unit: '%', isPercent: true },
  lifesteal: { label: 'Hút Máu', unit: '%', isPercent: true }
};

/**
 * Trích xuất chỉ số của một trang bị (hỗ trợ cả Equipment cổ điển và EquipmentShopItem)
 */
function extractEquipmentStat(equip: any, statKey: string): number {
  if (!equip) return 0;
  if (equip.equipmentStats && equip.equipmentStats[statKey] !== undefined) {
    return equip.equipmentStats[statKey] || 0;
  }
  if (equip.stats && equip.stats[statKey] !== undefined) {
    return equip.stats[statKey] || 0;
  }
  switch (statKey) {
    case 'atk':
      return equip.atkBonus || 0;
    case 'def':
      return equip.defBonus || 0;
    case 'maxHp':
      return equip.hpBonus || 0;
    case 'speed':
      return equip.speedBonus || 0;
    case 'critRate':
      return equip.critRateBonus || 0;
    case 'critDmg':
      return equip.critDmgBonus || 0;
    case 'dodge':
      return equip.dodgeBonus || 0;
    case 'penetration':
      return equip.penetrationBonus || 0;
    case 'damageReduction':
      return equip.damageReduction || 0;
    case 'lifesteal':
      return equip.lifesteal || 0;
    default:
      return 0;
  }
}

/**
 * Động cơ so sánh chỉ số giữa trang bị mới và trang bị hiện tại đang mặc
 */
export function compareEquipmentStats(
  newEquip: EquipmentShopItem,
  currentEquip?: Equipment | EquipmentShopItem | null
): Record<string, EquipmentStatDiff> {
  const result: Record<string, EquipmentStatDiff> = {};

  for (const [key, cfg] of Object.entries(STAT_CONFIGS)) {
    const newVal = newEquip.stats[key as keyof typeof newEquip.stats] || 0;
    const curVal = extractEquipmentStat(currentEquip, key);

    if (newVal > 0 || curVal > 0) {
      result[key] = {
        current: curVal,
        new: newVal,
        delta: newVal - curVal,
        label: cfg.label,
        unit: cfg.unit,
        isPercent: cfg.isPercent
      };
    }
  }

  return result;
}

/**
 * Xử lý mua trang bị từ Vạn Bảo Thương Hội:
 * - Hỗ trợ Mua Vào Túi (autoEquip = false)
 * - Hỗ trợ Mua & Mặc Ngay (autoEquip = true)
 */
export function buyEquipmentItem(
  player: PlayerStats,
  equipItem: EquipmentShopItem,
  autoEquip: boolean = false
): BuyEquipmentResult {
  if (!player || !equipItem) {
    return { success: false, message: 'Dữ liệu giao dịch không hợp lệ!' };
  }

  const playerRealm = player.currentRealm || 0;

  // 1. Xác thực cảnh giới yêu cầu
  if (playerRealm < equipItem.requiredRealmIndex) {
    return {
      success: false,
      message: `Chưa đủ cảnh giới! [${equipItem.name}] (${equipItem.tierName}) yêu cầu đạo hữu đạt tối thiểu [${equipItem.requiredRealmName}].`
    };
  }

  // 2. Tính toán đơn giá chiết khấu từ đạo lữ
  const compBuffs = getBondedCompanionBuffs(player);
  const discountPercent = compBuffs.merchantDiscountPercent || 0;
  const effectivePrice = discountPercent > 0
    ? Math.max(1, Math.floor(equipItem.price * (1 - discountPercent / 100)))
    : equipItem.price;

  // 3. Kiểm tra số dư Linh Thạch
  const totalAvailable = calculateTotalEquivalentHaPham(player);
  if (totalAvailable < effectivePrice) {
    return {
      success: false,
      message: `Linh thạch không đủ! Cần ${effectivePrice.toLocaleString()} Linh Thạch để thỉnh [${equipItem.name}], hiện chỉ có tương đương ${totalAvailable.toLocaleString()} Hạ Phẩm.`
    };
  }

  // 4. Kiểm tra sức chứa túi đồ (nếu không autoEquip hoặc nếu autoEquip thay thế món cũ vào túi)
  const currentEquipped = player.equipment?.[equipItem.slot] || (player as any).equippedEquipment?.[equipItem.slot];
  const maxCapacity = getMaxInventoryCapacity(player);
  const usedSlots = getCurrentInventoryOccupiedSlots(player);

  if (!autoEquip && usedSlots >= maxCapacity) {
    return {
      success: false,
      message: `Túi đồ đã đầy (${usedSlots}/${maxCapacity >= 9999 ? '∞' : maxCapacity})! Hãy dọn dẹp hoặc nâng cấp túi trữ vật trước.`
    };
  }

  // 5. Khấu trừ Linh Thạch an toàn
  const deductRes = deductEquivalentLinhThach(player, effectivePrice);
  if (!deductRes.success || !deductRes.updatedPlayer) {
    return {
      success: false,
      message: deductRes.deductedMessage || 'Giao dịch Linh Thạch thất bại!'
    };
  }

  const basePlayer = deductRes.updatedPlayer;
  const newEquipmentObj = equipmentShopItemToEquipment(equipItem);

  // Chuẩn hóa cấu trúc trang bị & túi đồ
  const currentEquipMap: Record<string, Equipment | undefined> = {
    ...(basePlayer.equipment || {}),
    ...((basePlayer as any).equippedEquipment || {})
  };

  const currentInventoryEquips: Equipment[] = [
    ...(basePlayer.inventory?.equipments || basePlayer.inventory?.equipment || [])
  ];

  if (autoEquip) {
    // Nếu trước đó đã mặc đồ ở slot này, chuyển đồ cũ vào túi đồ
    const oldEquip = currentEquipMap[equipItem.slot];
    if (oldEquip && oldEquip.id !== newEquipmentObj.id) {
      currentInventoryEquips.push(oldEquip);
    }
    // Mặc đồ mới vào slot
    currentEquipMap[equipItem.slot] = newEquipmentObj;
  } else {
    // Đưa món đồ mới vào túi đồ
    currentInventoryEquips.push(newEquipmentObj);
  }

  const updatedPlayer: PlayerStats = {
    ...basePlayer,
    equipment: currentEquipMap,
    equippedEquipment: currentEquipMap,
    inventory: {
      ...(basePlayer.inventory || { pills: [], herbs: [], ores: [] }),
      equipment: currentInventoryEquips,
      equipments: currentInventoryEquips
    }
  };

  const actionMsg = autoEquip
    ? `Đã mua và trang bị ngay [${equipItem.name}] (${equipItem.tierName} • ${equipItem.slotName})! Uy lực gia tăng vượt bậc.`
    : `Đã thu mua thành công [${equipItem.name}] (${equipItem.tierName} • ${equipItem.slotName}) cất vào túi đồ!`;

  return {
    success: true,
    updatedPlayer,
    message: `${actionMsg} Tiêu hao ${effectivePrice.toLocaleString()} Linh Thạch.`,
    equippedNow: autoEquip
  };
}
