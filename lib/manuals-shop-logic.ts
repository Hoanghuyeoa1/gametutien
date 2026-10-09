// lib/manuals-shop-logic.ts
// Pure Business Logic Engine cho Hệ Thống Công Pháp Bí Tịch Cửu Giai

import { PlayerStats } from './types/player';
import { ManualShopItem, ManualStatsModifiers, RequiredManualStatsModifiers } from './types/manuals-shop';
import { MANUALS_SHOP_ITEMS_MAP } from './manuals-shop-data';
import { calculateTotalEquivalentHaPham } from './item-quality-data';

export interface BuyAndLearnManualResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Tính toán toàn bộ chỉ số cộng dồn từ danh sách công pháp đã lĩnh ngộ
 */
export function calculateLearnedManualsModifiers(learnedManualIds: string[]): RequiredManualStatsModifiers {
  const result: RequiredManualStatsModifiers = {
    atkPercent: 0,
    defPercent: 0,
    speedFlat: 0,
    dodgePercent: 0,
    critRatePercent: 0,
    critDmgPercent: 0,
    damageReductionPercent: 0,
    lifestealPercent: 0,
    penetrationPercent: 0,
    maxHpPercent: 0,
  };

  if (!Array.isArray(learnedManualIds) || learnedManualIds.length === 0) {
    return result;
  }

  for (const manualId of learnedManualIds) {
    const manual = MANUALS_SHOP_ITEMS_MAP[manualId];
    if (!manual || !manual.statModifiers) continue;

    const m = manual.statModifiers;
    if (m.atkPercent) result.atkPercent = (result.atkPercent || 0) + m.atkPercent;
    if (m.defPercent) result.defPercent = (result.defPercent || 0) + m.defPercent;
    if (m.speedFlat) result.speedFlat = (result.speedFlat || 0) + m.speedFlat;
    if (m.dodgePercent) result.dodgePercent = (result.dodgePercent || 0) + m.dodgePercent;
    if (m.critRatePercent) result.critRatePercent = (result.critRatePercent || 0) + m.critRatePercent;
    if (m.critDmgPercent) result.critDmgPercent = (result.critDmgPercent || 0) + m.critDmgPercent;
    if (m.damageReductionPercent) result.damageReductionPercent = (result.damageReductionPercent || 0) + m.damageReductionPercent;
    if (m.lifestealPercent) result.lifestealPercent = (result.lifestealPercent || 0) + m.lifestealPercent;
    if (m.penetrationPercent) result.penetrationPercent = (result.penetrationPercent || 0) + m.penetrationPercent;
    if (m.maxHpPercent) result.maxHpPercent = (result.maxHpPercent || 0) + m.maxHpPercent;
  }

  return result;
}

/**
 * Xử lý mua và trực tiếp lĩnh ngộ công pháp bí tịch
 */
export function buyAndLearnManual(
  player: PlayerStats,
  manualItem: ManualShopItem
): BuyAndLearnManualResult {
  // 1. Kiểm tra yêu cầu Cảnh Giới
  const currentRealm = player.currentRealm || 0;
  if (currentRealm < manualItem.requiredRealmIndex) {
    return {
      success: false,
      message: `Cảnh giới chưa đủ! Cần đạt tối thiểu ${manualItem.requiredRealmName || `Cảnh giới ${manualItem.requiredRealmIndex}`} để lĩnh ngộ ${manualItem.name}.`
    };
  }

  // 2. Khởi tạo manualsState an toàn
  const learnedList = Array.isArray(player.manualsState?.learnedManualIds)
    ? [...player.manualsState.learnedManualIds]
    : [];

  // 3. Kiểm tra chống học trùng lặp
  if (learnedList.includes(manualItem.id)) {
    return {
      success: false,
      message: `Đã giác ngộ pho công pháp [${manualItem.name}], không thể tu luyện trùng lặp!`
    };
  }

  // 4. Kiểm tra ngân lượng
  const totalEquivalent = calculateTotalEquivalentHaPham(player);
  if (totalEquivalent < manualItem.price) {
    return {
      success: false,
      message: `Không đủ Linh Thạch! Cần ${manualItem.price.toLocaleString()} Linh Thạch để mua [${manualItem.name}].`
    };
  }

  // 5. Khấu trừ Linh Thạch đa tầng an toàn
  let remainingCost = manualItem.price;
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

  // 6. Cập nhật danh sách công pháp đã học
  learnedList.push(manualItem.id);

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: haPham,
    trungPhamLinhThach: trungPham,
    thuongPhamLinhThach: thuongPham,
    cucPhamLinhThach: cucPham,
    tienTinh: tienPham,
    tienPhamLinhThach: tienPham,
    manualsState: {
      ...player.manualsState,
      learnedManualIds: learnedList,
      equippedManualIds: player.manualsState?.equippedManualIds || []
    }
  };

  // 7. Tạo mô tả chiến quả lĩnh ngộ
  const effectDescParts: string[] = [];
  const m = manualItem.statModifiers;
  if (m.atkPercent) effectDescParts.push(`+${m.atkPercent}% Công Kích`);
  if (m.defPercent) effectDescParts.push(`+${m.defPercent}% Phòng Ngự`);
  if (m.speedFlat) effectDescParts.push(`+${m.speedFlat} Thân Pháp`);
  if (m.dodgePercent) effectDescParts.push(`+${m.dodgePercent}% Né Tránh`);
  if (m.critRatePercent) effectDescParts.push(`+${m.critRatePercent}% Bạo Kích`);
  if (m.critDmgPercent) effectDescParts.push(`+${m.critDmgPercent}% Bạo Thương`);
  if (m.damageReductionPercent) effectDescParts.push(`+${m.damageReductionPercent}% Miễn Thương`);
  if (m.lifestealPercent) effectDescParts.push(`+${m.lifestealPercent}% Hút Máu`);
  if (m.penetrationPercent) effectDescParts.push(`+${m.penetrationPercent}% Xuyên Giáp`);
  if (m.maxHpPercent) effectDescParts.push(`+${m.maxHpPercent}% Khí Huyết`);

  return {
    success: true,
    updatedPlayer,
    message: `Lĩnh ngộ thành công [${manualItem.name}]! Tăng vĩnh viễn: ${effectDescParts.join(', ')}.`
  };
}
