// lib/forging-logic.ts
// Xử lý nghiệp vụ Đục Lỗ, Khảm Ngọc, Tháo Ngọc và Tẩy Luyện Thần Binh

import {
  PlayerStats,
  Equipment,
  EquipmentSocket,
  EquipmentAffix,
  GemItem,
  EquipmentSlot,
  DismantleReward
} from '@/lib/types';
import {
  SOCKET_PUNCH_COSTS,
  REFORGE_COSTS,
  getMaxSocketsForGrade,
  getInitialAffixCount,
  generateRandomAffix,
  generateHighGradeAffix
} from '@/lib/forging-gem-data';
import { checkArtisanCraftRequirement, parseGradeToTier } from '@/lib/artisan-lock-logic';

export interface ForgingActionResult {
  success: boolean;
  message: string;
  updatedPlayer: PlayerStats;
  updatedEquip?: Equipment;
  hasGodAffix?: boolean;
}

/**
 * Đảm bảo trang bị có cấu trúc sockets và affixes hợp lệ
 */
export function ensureEquipmentStructure(equip: Equipment): Equipment {
  const maxSockets = equip.maxSockets || getMaxSocketsForGrade(equip.grade, equip.quality);
  let sockets: EquipmentSocket[] = equip.sockets ? [...equip.sockets] : [];

  // Khởi tạo các ô socket nếu chưa đủ
  if (sockets.length < maxSockets) {
    for (let i = sockets.length; i < maxSockets; i++) {
      sockets.push({
        slotIndex: i,
        unlocked: i === 0, // Ô đầu tiên mở sẵn cho tiện lợi
        gem: null
      });
    }
  }

  // Khởi tạo affixes nếu chưa có và trang bị đạt phẩm cấp Thượng Phẩm trở lên
  let affixes: EquipmentAffix[] = equip.affixes ? [...equip.affixes] : [];
  if (affixes.length === 0) {
    const targetCount = getInitialAffixCount(equip.grade, equip.quality);
    const existingKeys: string[] = [];
    for (let i = 0; i < targetCount; i++) {
      const affix = generateRandomAffix(existingKeys);
      existingKeys.push(affix.statKey);
      affixes.push(affix);
    }
  }

  return {
    ...equip,
    maxSockets,
    sockets,
    affixes
  };
}

/**
 * Đục thêm lỗ (Socket Punching) cho trang bị
 */
export function punchEquipmentSocket(
  equipment: Equipment,
  player: PlayerStats
): ForgingActionResult {
  const equip = ensureEquipmentStructure(equipment);
  const sockets = [...(equip.sockets || [])];
  const maxSockets = equip.maxSockets || getMaxSocketsForGrade(equip.grade, equip.quality);

  // Tìm ô tiếp theo chưa mở khóa
  const nextLockedIndex = sockets.findIndex(s => !s.unlocked);
  if (nextLockedIndex === -1 || nextLockedIndex >= maxSockets) {
    return {
      success: false,
      message: 'Trang bị này đã đục tối đa số lỗ khảm nạp cho phép!',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  // Khóa đục lỗ thứ 3 và thứ 4 theo cảnh giới Khí Tu
  if (nextLockedIndex === 2 && (player.currentRealm || 0) < 16) {
    return {
      success: false,
      message: 'Đạo hữu cảnh giới chưa đủ! Đục Lỗ Khảm thứ 3 yêu cầu đạt cảnh giới Kim Đan trở lên.',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }
  if (nextLockedIndex === 3 && (player.currentRealm || 0) < 21) {
    return {
      success: false,
      message: 'Đạo hữu cảnh giới chưa đủ! Đục Lỗ Khảm thứ 4 yêu cầu đạt cảnh giới Nguyên Anh trở lên.',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  const cost = SOCKET_PUNCH_COSTS[nextLockedIndex] || { slotIndex: nextLockedIndex, linhThach: 100000 };

  // Kiểm tra linh thạch
  if (player.linhThach < cost.linhThach) {
    const reqLT = cost.linhThach;
    return {
      success: false,
      message: `Không đủ Linh thạch! Đục lỗ ${nextLockedIndex + 1} cần ${reqLT.toLocaleString()} Linh thạch.`,
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  const updatedPlayer: PlayerStats = { ...player };
  const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], gems: [] };

  // Kiểm tra khoáng thạch nếu có yêu cầu
  if (cost.oreId && cost.oreCount) {
    const oreList = inv.ores || [];
    const ownedOre = oreList.find(o => o.id === cost.oreId);
    if (!ownedOre || ownedOre.quantity < cost.oreCount) {
      return {
        success: false,
        message: `Không đủ khoáng thạch! Đục lỗ ${nextLockedIndex + 1} cần ${cost.oreCount} khối ${cost.oreName || 'Khoáng Thạch'}. Hãy mua tại Khoáng Phố!`,
        updatedPlayer: player,
        updatedEquip: equip
      };
    }
    // Trừ khoáng thạch
    ownedOre.quantity -= cost.oreCount;
    inv.ores = oreList.filter(o => o.quantity > 0);
  }

  // Trừ linh thạch
  updatedPlayer.linhThach -= cost.linhThach;

  // Mở khóa socket
  sockets[nextLockedIndex] = {
    ...sockets[nextLockedIndex],
    unlocked: true,
    gem: null
  };

  const updatedEquip: Equipment = {
    ...equip,
    sockets
  };

  // Cập nhật lại vào player.equipment hoặc player.inventory.equipments
  syncEquipmentToPlayer(updatedPlayer, updatedEquip);
  updatedPlayer.inventory = inv;

  return {
    success: true,
    message: `Đục thành công Lỗ Khảm thứ ${nextLockedIndex + 1} trên [${updatedEquip.name}]!`,
    updatedPlayer,
    updatedEquip
  };
}

/**
 * Khảm nạp Linh Ngọc vào ô lỗ đã đục
 */
export function inlayGemToSocket(
  equipment: Equipment,
  gemId: string,
  socketIndex: number,
  player: PlayerStats
): ForgingActionResult {
  const equip = ensureEquipmentStructure(equipment);
  const sockets = [...(equip.sockets || [])];

  if (!sockets[socketIndex]) {
    return {
      success: false,
      message: 'Vị trí lỗ khảm không hợp lệ!',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  if (!sockets[socketIndex].unlocked) {
    return {
      success: false,
      message: 'Lỗ này chưa được đục! Vui lòng đục lỗ trước khi khảm ngọc.',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  if (sockets[socketIndex].gem) {
    return {
      success: false,
      message: 'Lỗ này đã có ngọc khảm! Hãy tháo ngọc cũ trước khi khảm ngọc mới.',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  const updatedPlayer: PlayerStats = { ...player };
  const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], gems: [] };
  const gemList = inv.gems || [];
  const targetGem = gemList.find(g => g.id === gemId);

  if (!targetGem || targetGem.quantity <= 0) {
    return {
      success: false,
      message: 'Trong Túi Trữ Vật không có viên Linh Ngọc này!',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  // Trừ 1 viên ngọc khỏi túi đồ
  targetGem.quantity -= 1;
  inv.gems = gemList.filter(g => g.quantity > 0);

  // Gắn viên ngọc vào socket
  const embeddedGem: GemItem = {
    ...targetGem,
    quantity: 1
  };

  sockets[socketIndex] = {
    ...sockets[socketIndex],
    gem: embeddedGem
  };

  const updatedEquip: Equipment = {
    ...equip,
    sockets
  };

  syncEquipmentToPlayer(updatedPlayer, updatedEquip);
  updatedPlayer.inventory = inv;

  return {
    success: true,
    message: `Khảm nạp thành công [${embeddedGem.name}] vào [${updatedEquip.name}]! Thuộc tính chiến lực tăng vọt!`,
    updatedPlayer,
    updatedEquip
  };
}

/**
 * Tháo gỡ Linh Ngọc an toàn, hoàn trả lại vào túi trữ vật
 */
export function removeGemFromSocket(
  equipment: Equipment,
  socketIndex: number,
  player: PlayerStats
): ForgingActionResult {
  const equip = ensureEquipmentStructure(equipment);
  const sockets = [...(equip.sockets || [])];

  if (!sockets[socketIndex] || !sockets[socketIndex].gem) {
    return {
      success: false,
      message: 'Vị trí này không có ngọc để tháo gỡ!',
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  const gemToRemove = sockets[socketIndex].gem!;
  sockets[socketIndex] = {
    ...sockets[socketIndex],
    gem: null
  };

  const updatedPlayer: PlayerStats = { ...player };
  const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], gems: [] };
  const gemList = inv.gems ? [...inv.gems] : [];

  const existingInInv = gemList.find(g => g.id === gemToRemove.id);
  if (existingInInv) {
    existingInInv.quantity += 1;
  } else {
    gemList.push({
      ...gemToRemove,
      quantity: 1
    });
  }
  inv.gems = gemList;

  const updatedEquip: Equipment = {
    ...equip,
    sockets
  };

  syncEquipmentToPlayer(updatedPlayer, updatedEquip);
  updatedPlayer.inventory = inv;

  return {
    success: true,
    message: `Đã tháo gỡ an toàn [${gemToRemove.name}] và hoàn trả vào Túi Trữ Vật!`,
    updatedPlayer,
    updatedEquip
  };
}

/**
 * Khóa / Mở khóa dòng thuộc tính ẩn (Affix)
 */
export function toggleAffixLock(
  equipment: Equipment,
  affixId: string
): { success: boolean; message: string; updatedEquip: Equipment } {
  const equip = ensureEquipmentStructure(equipment);
  const affixes = [...(equip.affixes || [])];

  const target = affixes.find(a => a.id === affixId);
  if (!target) {
    return {
      success: false,
      message: 'Không tìm thấy dòng thuộc tính này!',
      updatedEquip: equip
    };
  }

  // Không cho khóa tất cả các dòng
  const lockedCount = affixes.filter(a => a.isLocked).length;
  if (!target.isLocked && lockedCount >= affixes.length - 1) {
    return {
      success: false,
      message: 'Phải chừa lại ít nhất 1 dòng thuộc tính để tẩy luyện!',
      updatedEquip: equip
    };
  }

  target.isLocked = !target.isLocked;

  const updatedEquip: Equipment = {
    ...equip,
    affixes
  };

  return {
    success: true,
    message: target.isLocked ? `Đã khóa dòng [${target.name}]!` : `Đã mở khóa dòng [${target.name}]!`,
    updatedEquip
  };
}

/**
 * Tẩy Luyện Trang Bị (Reforging Affixes)
 */
export function reforgeEquipmentAffixes(
  equipment: Equipment,
  player: PlayerStats
): ForgingActionResult {
  const equip = ensureEquipmentStructure(equipment);
  let affixes = [...(equip.affixes || [])];

  // Kiểm tra yêu cầu tu vi khi tẩy luyện trang bị cao giai (Cổ Bảo / Tiên Thiên)
  const equipTier = parseGradeToTier(equip.grade);
  const craftCheck = checkArtisanCraftRequirement(player.currentRealm || 0, equipTier);
  if (equipTier >= 4 && !craftCheck.canCraft) {
    return {
      success: false,
      message: `Đạo hữu cảnh giới chưa đủ để tẩy luyện bảo vật giai vị này! Cần đạt [${craftCheck.requiredRealmName}].`,
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  if (affixes.length === 0) {
    const targetCount = Math.max(2, getInitialAffixCount(equip.grade, equip.quality));
    for (let i = 0; i < targetCount; i++) {
      affixes.push(generateRandomAffix());
    }
  }

  const lockedCount = affixes.filter(a => a.isLocked).length;
  const costLinhThach = REFORGE_COSTS.baseLinhThach + lockedCount * REFORGE_COSTS.perLockedAffixLinhThach;
  const costOre = lockedCount * REFORGE_COSTS.perLockedAffixOreCount;

  // Kiểm tra linh thạch
  if (player.linhThach < costLinhThach) {
    return {
      success: false,
      message: `Không đủ Linh thạch tẩy luyện! Cần ${costLinhThach.toLocaleString()} Linh thạch (gồm phí giữ ${lockedCount} dòng khóa).`,
      updatedPlayer: player,
      updatedEquip: equip
    };
  }

  const updatedPlayer: PlayerStats = { ...player };
  const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], gems: [] };

  // Kiểm tra khoáng thạch khóa dòng nếu có
  if (costOre > 0) {
    const oreList = inv.ores || [];
    const ownedOre = oreList.find(o => o.id === REFORGE_COSTS.requiredOreId);
    if (!ownedOre || ownedOre.quantity < costOre) {
      return {
        success: false,
        message: `Khóa ${lockedCount} dòng cần ${costOre} khối ${REFORGE_COSTS.requiredOreName} làm chất ổn định pháp trận! Hãy bổ sung thêm khoáng thạch.`,
        updatedPlayer: player,
        updatedEquip: equip
      };
    }
    ownedOre.quantity -= costOre;
    inv.ores = oreList.filter(o => o.quantity > 0);
  }

  // Trừ linh thạch
  updatedPlayer.linhThach -= costLinhThach;

  // Tẩy luyện lại các dòng không bị khóa
  const existingLockedKeys = affixes.filter(a => a.isLocked).map(a => a.statKey);
  let hasGodAffix = false;

  const newAffixes = affixes.map(a => {
    if (a.isLocked) return a;
    const newAffix = generateRandomAffix(existingLockedKeys);
    if (newAffix.rarity === 'than' || newAffix.rarity === 'kim') {
      hasGodAffix = true;
    }
    return newAffix;
  });

  const updatedEquip: Equipment = {
    ...equip,
    affixes: newAffixes
  };

  syncEquipmentToPlayer(updatedPlayer, updatedEquip);
  updatedPlayer.inventory = inv;

  return {
    success: true,
    message: hasGodAffix
      ? `🔥 THIÊN ĐẠO HIỂN THÁNH! Tẩy ra dòng Hồng Hoang / Hoàng Kim cực hiếm trên [${updatedEquip.name}]!`
      : `Tẩy luyện thành công thuộc tính ẩn trên [${updatedEquip.name}]!`,
    updatedPlayer,
    updatedEquip,
    hasGodAffix
  };
}

/**
 * Xác định đơn giá Tinh Hoa cơ bản và phụ phí khóa dòng theo phẩm chất trang bị
 */
export function getEssenceReforgeBaseCost(quality?: string, grade?: string): { base: number; perLock: number } {
  const q = (quality || '').toLowerCase();
  const g = (grade || '').toLowerCase();

  // Tuyệt Phẩm / Tiên / Thần / Đế: 500 Tinh Hoa (+200 mỗi dòng khóa)
  if (
    q === 'tuyet_pham' || q === 'tien_pham' || q === 'de_binh' || q === 'than_pham' || q === 'chi_ton' ||
    g.includes('tiên') || g.includes('đế') || g.includes('thần') || g.includes('thất giai') || g.includes('bát giai') || g.includes('cửu giai')
  ) {
    return { base: 500, perLock: 200 };
  }

  // Cực Phẩm: 200 Tinh Hoa (+80 mỗi dòng khóa)
  if (
    q === 'cuc_pham' ||
    g.includes('cực phẩm') || g.includes('cổ bảo') || g.includes('ngũ giai') || g.includes('lục giai')
  ) {
    return { base: 200, perLock: 80 };
  }

  // Thượng Phẩm: 80 Tinh Hoa (+35 mỗi dòng khóa)
  if (
    q === 'thuong_pham' ||
    g.includes('thượng phẩm') || g.includes('bảo khí') || g.includes('tam giai') || g.includes('tứ giai')
  ) {
    return { base: 80, perLock: 35 };
  }

  // Hạ/Trung Phẩm / Phàm phẩm: 30 Tinh Hoa (+15 mỗi dòng khóa)
  return { base: 30, perLock: 15 };
}

/**
 * Tính toán chi phí Tinh Hoa Rèn Đúc cho việc Tẩy Luyện Thần Cấp
 */
export function calculateEssenceReforgeCost(equipment: Equipment, lockedCount: number): number {
  const { base, perLock } = getEssenceReforgeBaseCost(equipment.quality, equipment.grade);
  return base + Math.max(0, lockedCount) * perLock;
}

/**
 * Tẩy Luyện Thần Cấp bằng Tinh Hoa Rèn Đúc (Essence Divine Reforging)
 * - Tiêu hao forgingEssence thay vì Linh Thạch (0 Linh Thạch, 0 Khoáng Thạch)
 * - Bảo lưu 100% các dòng khóa (locked)
 * - Đảm bảo ít nhất 1 dòng thuộc tính mới xuất hiện đạt phẩm chất Cực Phẩm (Tím) hoặc Hoàng Kim/Thần Phẩm
 */
export function reforgeEquipmentWithEssence(
  equipment: Equipment,
  playerOrLockedAffixIds: PlayerStats | string[],
  playerEssenceOrLockedIds?: number | string[]
): ForgingActionResult & { newAffixes?: EquipmentAffix[]; essenceCost?: number } {
  const equip = ensureEquipmentStructure(equipment);
  let affixes = [...(equip.affixes || [])];

  // Phân giải tham số linh hoạt hỗ trợ cả 2 signature:
  // Signature 1: reforgeEquipmentWithEssence(equip, player, lockedAffixIds?)
  // Signature 2: reforgeEquipmentWithEssence(equip, lockedAffixIds, playerEssence)
  let player: PlayerStats | undefined;
  let lockedAffixIds: string[] = [];
  let availableEssence = 0;

  if (
    playerOrLockedAffixIds &&
    typeof playerOrLockedAffixIds === 'object' &&
    ('tuVi' in playerOrLockedAffixIds || 'linhThach' in playerOrLockedAffixIds)
  ) {
    player = playerOrLockedAffixIds as PlayerStats;
    availableEssence = player.inventory?.forgingEssence || 0;
    if (Array.isArray(playerEssenceOrLockedIds)) {
      lockedAffixIds = playerEssenceOrLockedIds;
    } else {
      lockedAffixIds = affixes.filter(a => a.isLocked).map(a => a.id);
    }
  } else if (Array.isArray(playerOrLockedAffixIds)) {
    lockedAffixIds = playerOrLockedAffixIds;
    availableEssence = typeof playerEssenceOrLockedIds === 'number' ? playerEssenceOrLockedIds : 0;
  }

  // Khởi tạo dòng ẩn nếu trang bị chưa có
  if (affixes.length === 0) {
    const targetCount = Math.max(2, getInitialAffixCount(equip.grade, equip.quality));
    for (let i = 0; i < targetCount; i++) {
      affixes.push(generateRandomAffix());
    }
  }

  // Xác định dòng khóa
  const lockedSet = new Set(lockedAffixIds);
  const lockedAffixes = affixes.filter(a => lockedSet.has(a.id) || a.isLocked);
  const lockedCount = lockedAffixes.length;

  // Tính chi phí Tinh Hoa
  const essenceCost = calculateEssenceReforgeCost(equip, lockedCount);

  // Kiểm tra số dư Tinh Hoa
  if (availableEssence < essenceCost) {
    return {
      success: false,
      message: `Thiếu Tinh Hoa Rèn Đúc! Cần ${essenceCost} Tinh Hoa (Hiện có: ${availableEssence}).`,
      updatedPlayer: player || ({} as PlayerStats),
      updatedEquip: equip,
      essenceCost
    };
  }

  // Kiểm tra cảnh giới nếu có player
  if (player) {
    const equipTier = parseGradeToTier(equip.grade);
    const craftCheck = checkArtisanCraftRequirement(player.currentRealm || 0, equipTier);
    if (equipTier >= 4 && !craftCheck.canCraft) {
      return {
        success: false,
        message: `Đạo hữu cảnh giới chưa đủ để tẩy luyện bảo vật giai vị này! Cần đạt [${craftCheck.requiredRealmName}].`,
        updatedPlayer: player,
        updatedEquip: equip,
        essenceCost
      };
    }
  }

  // Danh sách key thuộc tính của các dòng đang bị khóa để tránh trùng
  const existingLockedKeys = lockedAffixes.map(a => a.statKey);

  // Tiến hành roll các dòng không bị khóa
  let hasGodAffix = false;
  let hasGuaranteedHighGrade = false;
  const unlockedIndices: number[] = [];

  const newAffixes = affixes.map((a, idx) => {
    if (lockedSet.has(a.id) || a.isLocked) {
      return a; // Giữ nguyên 100% dòng khóa
    }
    unlockedIndices.push(idx);
    const newAffix = generateRandomAffix(existingLockedKeys);
    if (newAffix.rarity === 'tim' || newAffix.rarity === 'kim' || newAffix.rarity === 'than') {
      hasGuaranteedHighGrade = true;
    }
    if (newAffix.rarity === 'than' || newAffix.rarity === 'kim') {
      hasGodAffix = true;
    }
    return newAffix;
  });

  // ĐẶC QUYỀN TINH HOA: Đảm bảo chắc chắn ít nhất 1 dòng đạt Cực Phẩm (Tím), Hoàng Kim (Vàng) hoặc Thần Phẩm (Đỏ)
  if (!hasGuaranteedHighGrade && unlockedIndices.length > 0) {
    const targetIdx = unlockedIndices[0];
    const guaranteedAffix = generateHighGradeAffix(existingLockedKeys);
    newAffixes[targetIdx] = guaranteedAffix;
    if (guaranteedAffix.rarity === 'than' || guaranteedAffix.rarity === 'kim') {
      hasGodAffix = true;
    }
  }

  const updatedEquip: Equipment = {
    ...equip,
    affixes: newAffixes
  };

  // Cập nhật player nếu có
  let updatedPlayer = player ? { ...player } : ({} as PlayerStats);
  if (player) {
    const inv = updatedPlayer.inventory ? { ...updatedPlayer.inventory } : { pills: [], herbs: [], ores: [], gems: [] };
    inv.forgingEssence = Math.max(0, (inv.forgingEssence || 0) - essenceCost);
    updatedPlayer.inventory = inv as any;
    syncEquipmentToPlayer(updatedPlayer, updatedEquip);
  }

  return {
    success: true,
    message: hasGodAffix
      ? `🔥 [TINH HOA TRÚC THẦN] Dị tượng xuất hiện! Tẩy xuất dòng thuộc tính Hoàng Kim / Thần Phẩm cực phẩm trên [${updatedEquip.name}] (Tiêu hao ${essenceCost} Tinh Hoa)!`
      : `🔥 [TINH HOA TẨY LUYỆN] Tẩy luyện thành công! Ngưng tụ thuộc tính ẩn Cực Phẩm trên [${updatedEquip.name}] (Tiêu hao ${essenceCost} Tinh Hoa)!`,
    updatedPlayer,
    updatedEquip,
    hasGodAffix,
    newAffixes,
    essenceCost
  };
}

/**
 * Đồng bộ trang bị sau khi thay đổi vào người chơi
 */
function syncEquipmentToPlayer(player: PlayerStats, equip: Equipment) {
  const slot = equip.slot as EquipmentSlot;
  if (player.equipment && player.equipment[slot]?.id === equip.id) {
    player.equipment[slot] = equip;
  } else if (player.inventory?.equipments) {
    const idx = player.inventory.equipments.findIndex(e => e.id === equip.id);
    if (idx !== -1) {
      player.inventory.equipments[idx] = equip;
    }
  }
}

/**
 * Tính toán tổng chỉ số cộng thêm từ Linh Ngọc và Affixes của 1 trang bị
 */
export function calculateEquipmentTotalGemsAndAffixes(equip: Equipment) {
  let gemAtk = 0;
  let gemDef = 0;
  let gemHp = 0;
  let gemMp = 0;
  let gemCritRate = 0;
  let gemCritDmg = 0;
  let gemSpeed = 0;
  let gemArmorPen = 0;
  let gemDmgRed = 0;
  let gemHpRegen = 0;

  // Cộng dồn từ Linh Ngọc trong Sockets
  if (equip.sockets) {
    for (const s of equip.sockets) {
      if (s.gem && s.gem.statBonus) {
        const b = s.gem.statBonus;
        gemAtk += (b.congKich || 0);
        gemDef += (b.phongNgu || 0);
        gemHp += (b.maxKhiHuyet || 0);
        gemMp += (b.maxLinhLuc || 0);
        gemCritRate += (b.baoKichRate || 0);
        gemCritDmg += (b.baoKichDmg || 0);
        gemSpeed += (b.tocDo || 0);
        gemArmorPen += (b.xuyenGiapRate || 0);
        gemDmgRed += (b.dmgReduction || 0);
        gemHpRegen += (b.hpRegenPercent || 0);
      }
    }
  }

  // Cộng dồn từ Affixes
  let affixAtkPercent = 0;
  let affixDefPercent = 0;
  let affixCritDmg = 0;
  let affixHutMau = 0;
  let affixXuyenGiap = 0;
  let affixPhanDmg = 0;
  let affixTuViSpeed = 0;

  if (equip.affixes) {
    for (const a of equip.affixes) {
      if (a.statKey === 'congKichPercent') affixAtkPercent += a.value;
      if (a.statKey === 'phongNguPercent') affixDefPercent += a.value;
      if (a.statKey === 'baoKichDmg') affixCritDmg += a.value;
      if (a.statKey === 'hutMauRate') affixHutMau += a.value;
      if (a.statKey === 'xuyenGiapRate') affixXuyenGiap += a.value;
      if (a.statKey === 'phanDmgRate') affixPhanDmg += a.value;
      if (a.statKey === 'tuViSpeedPercent') affixTuViSpeed += a.value;
    }
  }

  return {
    gemAtk,
    gemDef,
    gemHp,
    gemMp,
    gemCritRate,
    gemCritDmg,
    gemSpeed,
    gemArmorPen,
    gemDmgRed,
    gemHpRegen,
    affixAtkPercent,
    affixDefPercent,
    affixCritDmg,
    affixHutMau,
    affixXuyenGiap,
    affixPhanDmg,
    affixTuViSpeed
  };
}

// =========================================================================
// PHÂN HỆ: LÒ DUNG LUYỆN • PHÂN GIẢI & TÁI CHẾ TRANG BỊ (DISMANTLE SYSTEM)
// =========================================================================

/**
 * Trích xuất Giai Vị (Tier 1-9) của trang bị
 */
export function getEquipmentTier(equip: Equipment): number {
  if (typeof equip.tier === 'number' && equip.tier > 0) {
    return Math.min(9, Math.max(1, Math.floor(equip.tier)));
  }
  return parseGradeToTier(equip.grade || 1);
}

/**
 * Chuẩn hóa mã định danh Phẩm Cấp (Quality) của trang bị
 */
export function getEquipQualityKey(equip: Equipment): string {
  const q = String(equip.quality || equip.grade || '').toLowerCase();
  if (q.includes('ha_pham') || q.includes('hạ')) return 'ha_pham';
  if (q.includes('trung_pham') || q.includes('trung')) return 'trung_pham';
  if (q.includes('thuong_pham') || q.includes('thượng')) return 'thuong_pham';
  if (q.includes('cuc_pham') || q.includes('cực')) return 'cuc_pham';
  if (q.includes('tuyet_pham') || q.includes('tuyệt')) return 'tuyet_pham';
  if (q.includes('tien_pham') || q.includes('tiên')) return 'tien_pham';
  if (q.includes('than_pham') || q.includes('thần')) return 'than_pham';
  if (q.includes('chi_ton') || q.includes('chí tôn')) return 'chi_ton';
  return 'ha_pham';
}

/**
 * Kiểm tra xem trang bị có thỏa mãn điều kiện an toàn để phân giải hay không
 * Chặn tuyệt đối:
 * 1. Đồ đang mặc trên người (player.equipment)
 * 2. Trang bị đã tế luyện Bản Mệnh Pháp Bảo (player.natalArtifact)
 */
export function canDismantleEquipment(
  equip: Equipment,
  player: PlayerStats
): { canDismantle: boolean; reason?: string } {
  if (!equip || !equip.id) {
    return { canDismantle: false, reason: 'Trang bị không hợp lệ!' };
  }

  // 1. Kiểm tra trang bị đang mặc trên thân (player.equipment)
  if (player.equipment) {
    const equippedSlots: EquipmentSlot[] = ['weapon', 'armor', 'accessory', 'artifact'];
    for (const slot of equippedSlots) {
      const item = player.equipment[slot];
      if (item && item.id === equip.id) {
        return {
          canDismantle: false,
          reason: 'Trang bị đang được trang bị trên thân, không thể dung luyện!'
        };
      }
    }
  }

  // Kiểm tra mảng phụ equippedItems nếu có
  if (Array.isArray((player as any).equippedItems)) {
    if ((player as any).equippedItems.some((e: any) => e?.id === equip.id)) {
      return {
        canDismantle: false,
        reason: 'Trang bị đang được trang bị trên thân, không thể dung luyện!'
      };
    }
  }

  // 2. Kiểm tra Bản Mệnh Pháp Bảo
  if (
    equip.isNatal ||
    (player.natalArtifact?.baseEquipmentId === equip.id) ||
    (player.natalArtifact?.id === equip.id) ||
    ((player.natalArtifact as any)?.equipment?.id === equip.id) ||
    ((player.natalArtifact as any)?.baseEquipment?.id === equip.id)
  ) {
    return {
      canDismantle: false,
      reason: 'Pháp bảo đã nhỏ máu tế luyện Bản Mệnh, không thể phân giải!'
    };
  }

  return { canDismantle: true };
}

/**
 * Tính toán tài nguyên thu hồi khi phân giải 1 trang bị:
 * 1. Khoáng thạch theo Tier
 * 2. Tinh hoa rèn đúc & Linh thạch theo Phẩm Cấp
 * 3. Tự động bảo tồn 100% Linh Ngọc trong sockets
 */
export function calculateDismantleReward(equip: Equipment): DismantleReward {
  const tier = getEquipmentTier(equip);
  const qualityKey = getEquipQualityKey(equip);

  // Trọng số Tinh Hoa Rèn Đúc & Linh Thạch theo Phẩm Cấp (Grade/Quality)
  let forgingEssence = 5;
  let linhThachRefund = 20;

  switch (qualityKey) {
    case 'ha_pham':
      forgingEssence = 5;
      linhThachRefund = 20;
      break;
    case 'trung_pham':
      forgingEssence = 15;
      linhThachRefund = 50;
      break;
    case 'thuong_pham':
      forgingEssence = 40;
      linhThachRefund = 150;
      break;
    case 'cuc_pham':
      forgingEssence = 100;
      linhThachRefund = 500;
      break;
    case 'tuyet_pham':
      forgingEssence = 250;
      linhThachRefund = 1500;
      break;
    case 'tien_pham':
    case 'than_pham':
    case 'chi_ton':
      forgingEssence = 600;
      linhThachRefund = 5000;
      break;
    default:
      forgingEssence = 5;
      linhThachRefund = 20;
  }

  // Bảng ánh xạ thu hồi Khoáng Thạch theo Giai Vị (Tier-to-Ore Recovery Table)
  let oreId = 'ore_hac_thiet';
  let oreName = 'Hắc Thiết Khoáng';
  let oreQuantity = 1;

  if (tier === 1) {
    oreId = 'ore_hac_thiet';
    oreName = 'Hắc Thiết Khoáng';
    oreQuantity = qualityKey === 'ha_pham' ? 1 : qualityKey === 'trung_pham' ? 2 : 3;
  } else if (tier === 2) {
    oreId = 'ore_huyen_thiet';
    oreName = 'Huyền Thiết Khoáng';
    oreQuantity = qualityKey === 'ha_pham' ? 1 : 2;
  } else if (tier === 3) {
    oreId = 'ore_huyen_thiet_tinh_thach';
    oreName = 'Huyền Thiết Tinh Thạch';
    oreQuantity = qualityKey === 'ha_pham' ? 1 : 2;
  } else if (tier === 4) {
    oreId = 'ore_tu_tinh_thach';
    oreName = 'Tử Tinh Thạch';
    oreQuantity = 1;
  } else {
    // Tier 5+
    oreId = 'ore_ngu_hanh_tinh_kim';
    oreName = 'Ngũ Hành Tinh Kim';
    oreQuantity = 1;
  }

  // Bảo tồn 100% Linh Ngọc đang khảm trên các lỗ
  const recoveredGems: GemItem[] = [];
  if (equip.sockets && Array.isArray(equip.sockets)) {
    for (const socket of equip.sockets) {
      if (socket.gem) {
        recoveredGems.push({ ...socket.gem });
      }
    }
  }

  return {
    oreId,
    oreName,
    oreQuantity,
    forgingEssence,
    recoveredGems,
    linhThachRefund,
    ores: [
      {
        oreId,
        oreName,
        oreQuantity
      }
    ]
  };
}

/**
 * Thực thi phân giải hàng loạt danh sách trang bị đã chọn
 */
export function executeDismantleBatch(
  player: PlayerStats,
  equipIds: string[]
): { updatedPlayer: PlayerStats; totalReward: DismantleReward } {
  const invEquips = player.inventory?.equipments || player.inventory?.equipment || [];
  const targetEquips = invEquips.filter(e => equipIds.includes(e.id));
  const validEquips = targetEquips.filter(e => canDismantleEquipment(e, player).canDismantle);

  let totalEssence = 0;
  let totalLinhThach = 0;
  const allRecoveredGems: GemItem[] = [];
  const oreMap: Record<string, { oreId: string; oreName: string; oreQuantity: number }> = {};

  for (const equip of validEquips) {
    const rew = calculateDismantleReward(equip);
    totalEssence += rew.forgingEssence;
    totalLinhThach += rew.linhThachRefund;
    allRecoveredGems.push(...rew.recoveredGems);

    if (!oreMap[rew.oreId]) {
      oreMap[rew.oreId] = {
        oreId: rew.oreId,
        oreName: rew.oreName,
        oreQuantity: rew.oreQuantity
      };
    } else {
      oreMap[rew.oreId].oreQuantity += rew.oreQuantity;
    }
  }

  const oreBreakdown = Object.values(oreMap);
  const totalOreQty = oreBreakdown.reduce((sum, o) => sum + o.oreQuantity, 0);

  // Tạo bản sao cập nhật trạng thái nhân vật
  const updatedOres = [...(player.inventory?.ores || [])];
  const updatedGems = [...(player.inventory?.gems || [])];
  const dismantledIdSet = new Set(validEquips.map(e => e.id));

  // 1. Cộng khoáng thạch thu hồi vào player.inventory.ores
  for (const oreInfo of oreBreakdown) {
    const existingOre = updatedOres.find(
      o => o.id === oreInfo.oreId || o.name === oreInfo.oreName
    );
    if (existingOre) {
      existingOre.quantity = (existingOre.quantity || 0) + oreInfo.oreQuantity;
    } else {
      updatedOres.push({
        id: oreInfo.oreId,
        name: oreInfo.oreName,
        grade: 'Nhất Giai',
        description: `Khoáng thạch thu hồi từ Lò Dung Luyện sau khi phân giải trang bị.`,
        price: 50,
        quantity: oreInfo.oreQuantity
      });
    }
  }

  // 2. Hoàn trả toàn bộ Linh Ngọc vào player.inventory.gems
  for (const gem of allRecoveredGems) {
    const existingGem = updatedGems.find(g => g.id === gem.id);
    if (existingGem) {
      existingGem.quantity = (existingGem.quantity || 0) + (gem.quantity || 1);
    } else {
      updatedGems.push({
        ...gem,
        quantity: gem.quantity || 1
      });
    }
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach || 0) + totalLinhThach,
    inventory: {
      pills: player.inventory?.pills || [],
      herbs: player.inventory?.herbs || [],
      manuals: player.inventory?.manuals || [],
      books: player.inventory?.books || [],
      bags: player.inventory?.bags || [],
      ...player.inventory,
      forgingEssence: (player.inventory?.forgingEssence || 0) + totalEssence,
      equipments: (player.inventory?.equipments || []).filter(e => !dismantledIdSet.has(e.id)),
      equipment: (player.inventory?.equipment || []).filter(e => !dismantledIdSet.has(e.id)),
      ores: updatedOres,
      gems: updatedGems
    }
  };

  const totalReward: DismantleReward = {
    oreId: oreBreakdown[0]?.oreId || 'ore_hac_thiet',
    oreName: oreBreakdown.length === 1 ? oreBreakdown[0].oreName : `${totalOreQty} Khoáng Thạch`,
    oreQuantity: totalOreQty,
    forgingEssence: totalEssence,
    recoveredGems: allRecoveredGems,
    linhThachRefund: totalLinhThach,
    ores: oreBreakdown
  };

  return { updatedPlayer, totalReward };
}

/**
 * Thực thi phân giải một trang bị đơn lẻ
 */
export function executeDismantleSingle(
  player: PlayerStats,
  equipId: string
): { updatedPlayer: PlayerStats; reward: DismantleReward } {
  const { updatedPlayer, totalReward } = executeDismantleBatch(player, [equipId]);
  return { updatedPlayer, reward: totalReward };
}
