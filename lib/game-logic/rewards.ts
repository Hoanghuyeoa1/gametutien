// lib/game-logic/rewards.ts
import {
  PlayerStats,
  Pill,
  Ore,
  Herb,
  Equipment,
  BeastEgg,
  SpiritBeast,
  EventOutcome
} from '@/lib/types';
import { PILL_TEMPLATES, DEFAULT_ORES, DEFAULT_HERBS } from '@/lib/alchemy-data';
import { createRandomEgg } from '@/lib/beast-data';
import { addItemToInventory, getMaxInventoryCapacity } from '@/lib/inventory-data';
import { getItemQualityMultiplier } from '@/lib/item-quality-data';
import { getManualSynergy } from '@/lib/elemental-system';
import { slugifyItem } from './events';

export interface SecretRealmRewardResolved {
  type: 'herb' | 'pill' | 'ore' | 'equipment' | 'bag' | 'manual' | 'book';
  item: any;
  quantity: number;
}

/**
 * Phân tích và tạo đối tượng vật phẩm chuẩn cho bảo vật nhận từ Kỳ Duyên Bí Cảnh
 */
export function resolveSecretRealmRewardItem(
  rawReward: any
): SecretRealmRewardResolved | null {
  if (!rawReward) return null;

  let rewardObj: any = rawReward;
  let parsedQty = 1;

  if (typeof rawReward === 'string') {
    const trimmed = rawReward.trim();
    if (!trimmed) return null;
    const qtyMatch = trimmed.match(/\s*[xX*]\s*(\d+)$/);
    if (qtyMatch) {
      parsedQty = parseInt(qtyMatch[1], 10) || 1;
    }
    const cleanName = trimmed.replace(/\s*[xX*]\s*\d+$/, '').trim();
    rewardObj = { name: cleanName, quantity: parsedQty };
  } else if (typeof rawReward === 'object') {
    if (rawReward.item && typeof rawReward.item === 'object') {
      rewardObj = {
        ...rawReward.item,
        type: rawReward.type || rawReward.item.type,
        quantity: rawReward.quantity || rawReward.item.quantity || 1
      };
    }
  }

  const name: string = (rewardObj.name || rewardObj.id || '').trim();
  if (!name) return null;
  const lowerName = name.toLowerCase();
  const qty = Math.max(1, rewardObj.quantity || parsedQty || 1);

  // Bỏ qua các sự kiện cơ duyên chỉ mang tính cốt truyện/ngộ đạo/buff tinh thần, không phải vật phẩm vào túi
  const nonItemBlessings = [
    'sư phụ ẩn thế', 'nhập ma', 'cổ tiên truyền thừa', 'đồng môn tri kỷ',
    'cao nhân chỉ điểm', 'linh mạch tinh túy', 'cống hiến điểm', 'tiền bối chỉ điểm',
    'linh thú hộ vệ', 'linh hồn phù hộ', 'bảo vật đấu giá', 'bảo vật hắc thị',
    'vô địch đại tỷ', 'cổ đại truyền thừa', 'vị trí di tích', 'thiên đạo cảm ngộ',
    'thiên giáng bảo vật', 'nghiệp chướng tiêu tan', 'duyên định đạo lữ'
  ];
  if (nonItemBlessings.some(b => lowerName.includes(b))) {
    return null;
  }

  const expType: string = (rewardObj.type || '').toLowerCase();

  // 1. Phân loại Bí kíp / Sách / Đan Phương
  if (
    expType === 'book' || expType === 'manual' ||
    lowerName.includes('quyển') || lowerName.includes('quyết') || lowerName.includes('công pháp') ||
    lowerName.includes('bí tịch') || lowerName.includes('phiến') || lowerName.includes('đan phương') ||
    lowerName.includes('trận đồ')
  ) {
    const book = {
      id: rewardObj.id || `book_${slugifyItem(name)}`,
      name: name,
      grade: rewardObj.grade || (lowerName.includes('thượng cổ') ? 'Địa Giai' : 'Huyền Giai'),
      description: rewardObj.description || `Cổ tịch ghi chép đạo pháp huyền diệu: [${name}].`,
      quantity: qty
    };
    return { type: 'book', item: book, quantity: qty };
  }

  // 2. Phân loại Túi Trữ Vật
  if (expType === 'bag' || lowerName.includes('trữ vật') || lowerName.includes('túi')) {
    const bag = {
      id: rewardObj.id || `bag_${slugifyItem(name)}`,
      name: name,
      grade: rewardObj.grade || (lowerName.includes('hắc ma') ? 'Thượng Phẩm Bảo Khí' : 'Trung Phẩm Linh Khí'),
      maxSlots: rewardObj.maxSlots || (lowerName.includes('hắc ma') ? 80 : 50),
      description: rewardObj.description || `Túi trữ vật đoạt được từ kỳ ngộ bí cảnh, gia tăng dung tích chứa đồ.`,
      quantity: 1
    };
    return { type: 'bag', item: bag, quantity: 1 };
  }

  // 3. Phân loại Đan Dược
  if (
    expType === 'pill' || expType === 'pills' || expType === 'dan_duoc' ||
    lowerName.includes('đan') || lowerName.includes('viên')
  ) {
    // Kiểm tra xem có trùng với mẫu template đan dược có sẵn không
    const matchedTemplate = Object.values(PILL_TEMPLATES).find(
      p => p.id === rewardObj.id || p.name.toLowerCase() === lowerName
    );

    const pill: Pill = matchedTemplate ? {
      ...matchedTemplate,
      quantity: qty
    } : {
      id: rewardObj.id || (
        lowerName.includes('cải mệnh') ? 'pill_cai_menh' :
        lowerName.includes('tụ linh') ? 'pill_tu_linh' :
        lowerName.includes('phá cảnh') ? 'pill_pha_canh' :
        `pill_${slugifyItem(name)}`
      ),
      name: name,
      grade: rewardObj.grade || (
        lowerName.includes('cải mệnh') || lowerName.includes('thần') ? 'Ngũ Phẩm' :
        lowerName.includes('cửu chuyển') || lowerName.includes('bồ đề') ? 'Tứ Phẩm' : 'Tam Phẩm'
      ),
      description: rewardObj.description || (
        lowerName.includes('cải mệnh')
          ? 'Thần đan nghịch thiên đoạt mệnh, dùng trong nghi thức Tế Thiên Cải Mệnh tái tạo Mệnh Cách.'
          : lowerName.includes('tụ linh') || lowerName.includes('phá cảnh')
          ? 'Đan dược tụ linh phá cảnh, tăng mạnh tỉ lệ thành công khi đột phá cảnh giới.'
          : lowerName.includes('bồ đề')
          ? 'Đan dược tẩm nhuần đạo ý thanh tịnh, tăng vĩnh viễn Tâm Cảnh.'
          : 'Đan dược trân quý thu được từ cơ duyên bí cảnh.'
      ),
      effectType: rewardObj.effectType || (
        lowerName.includes('cải mệnh') ? 'destiny_reroll' :
        lowerName.includes('tụ linh') || lowerName.includes('phá cảnh') ? 'breakthrough_bonus' :
        lowerName.includes('tâm cảnh') || lowerName.includes('bồ đề') ? 'permanent_stat' :
        lowerName.includes('thanh tâm') || lowerName.includes('hồi') ? 'full_heal' : 'breakthrough_bonus'
      ),
      effectValue: rewardObj.effectValue || (
        lowerName.includes('cải mệnh') ? 1 :
        lowerName.includes('cửu chuyển') ? 25 :
        lowerName.includes('tụ linh') ? 15 : 20
      ),
      statTarget: rewardObj.statTarget || (lowerName.includes('bồ đề') ? 'tamCanh' : undefined),
      quantity: qty
    };
    return { type: 'pill', item: pill, quantity: qty };
  }

  // 4. Phân loại Dược Liệu (Herb)
  if (
    expType === 'herb' || expType === 'herbs' || expType === 'duoc_lieu' ||
    lowerName.includes('thảo') || lowerName.includes('hoa') || lowerName.includes('liên') ||
    lowerName.includes('lan') || lowerName.includes('diệp') || lowerName.includes('chi') ||
    lowerName.includes('nấm') || lowerName.includes('tủy') || lowerName.includes('quả') ||
    lowerName.includes('huyết') || lowerName.includes('tức') || lowerName.includes('kỳ lân')
  ) {
    const matchedHerb = DEFAULT_HERBS.find(
      h => h.id === rewardObj.id || h.name.toLowerCase() === lowerName
    );

    const herb: Herb = matchedHerb ? {
      ...matchedHerb,
      quantity: qty
    } : {
      id: rewardObj.id || (
        lowerName.includes('cửu diệp linh liên') ? 'cuu_diep_linh_lien' :
        lowerName.includes('linh thảo') ? 'linh_thao' :
        `herb_${slugifyItem(name)}`
      ),
      name: name,
      grade: rewardObj.grade || (
        lowerName.includes('thần') || lowerName.includes('vạn niên') || lowerName.includes('linh liên') || lowerName.includes('huyền hoàng') || lowerName.includes('kỳ lân')
          ? 'Thần Phẩm'
          : lowerName.includes('ngũ phẩm') || lowerName.includes('hóa thần')
          ? 'Ngũ Phẩm'
          : 'Tứ Phẩm'
      ),
      description: rewardObj.description || (
        lowerName.includes('cửu diệp linh liên')
          ? 'Cửu Diệp Linh Liên vạn năm sinh trưởng nơi u đầm cực hiểm, hấp thu tinh hoa nhật nguyệt, dược lực vô thượng.'
          : `Dược thảo quý hiếm [${name}] thu hái từ sâu trong cấm địa Kỳ Duyên Bí Cảnh.`
      ),
      price: rewardObj.price || (lowerName.includes('thần') || lowerName.includes('vạn niên') ? 3500 : 1200),
      quantity: qty
    };
    return { type: 'herb', item: herb, quantity: qty };
  }

  // 5. Phân loại Khoáng Thạch (Ore)
  if (
    expType === 'ore' || expType === 'ores' || expType === 'khoang_thach' ||
    lowerName.includes('thiết') || lowerName.includes('khoáng') || lowerName.includes('tinh kim') ||
    lowerName.includes('hỏa tinh') || lowerName.includes('minh thạch')
  ) {
    const matchedOre = DEFAULT_ORES.find(
      o => o.id === rewardObj.id || o.name.toLowerCase() === lowerName
    );

    const ore: Ore = matchedOre ? {
      ...matchedOre,
      quantity: qty
    } : {
      id: rewardObj.id || `ore_${slugifyItem(name)}`,
      name: name,
      grade: rewardObj.grade || (lowerName.includes('thần phẩm') ? 'Thần Phẩm' : 'Tam Phẩm'),
      description: rewardObj.description || `Khoáng thạch linh khí [${name}] đào được trong lòng địa mạch bí cảnh.`,
      price: rewardObj.price || 1200,
      quantity: qty
    };
    return { type: 'ore', item: ore, quantity: qty };
  }

  // 6. Phân loại Trang Bị (Equipment)
  if (
    expType === 'equipment' || expType === 'equipments' || expType === 'weapon' || expType === 'armor' || expType === 'accessory' || expType === 'artifact' ||
    lowerName.includes('kiếm') || lowerName.includes('đao') || lowerName.includes('bào') || lowerName.includes('phù') ||
    lowerName.includes('châu') || lowerName.includes('giới chỉ') || lowerName.includes('ngọc bội') || lowerName.includes('thần binh') ||
    lowerName.includes('bí bảo') || lowerName.includes('bảo vật cao nhân')
  ) {
    const slot = (
      lowerName.includes('kiếm') || lowerName.includes('đao') || lowerName.includes('thần binh') ? 'weapon' :
      lowerName.includes('bào') || lowerName.includes('giáp') ? 'armor' :
      lowerName.includes('giới chỉ') ? 'artifact' : 'accessory'
    );
    const equip: Equipment = {
      id: rewardObj.id || `equip_${slugifyItem(name)}`,
      name: name,
      slot: rewardObj.slot || slot,
      grade: rewardObj.grade || (lowerName.includes('tru tiên') ? 'Tiên Thiên Linh Bảo' : lowerName.includes('cổ') ? 'Cổ Bảo' : 'Bảo Khí'),
      enhancement: 0,
      powerBonus: rewardObj.powerBonus || (lowerName.includes('tru tiên') ? 75000 : lowerName.includes('cổ') ? 28000 : 12000),
      hpBonus: rewardObj.hpBonus || (lowerName.includes('tru tiên') ? 10000 : 3000),
      mpBonus: rewardObj.mpBonus || (lowerName.includes('tru tiên') ? 2000 : 500),
      description: rewardObj.description || `Bảo khí thượng cổ [${name}] phát hiện trong bí cảnh viễn cổ.`
    };
    return { type: 'equipment', item: equip, quantity: 1 };
  }

  // Mặc định an toàn: Dược liệu quý (Herb)
  const defaultHerb: Herb = {
    id: rewardObj.id || `herb_${slugifyItem(name)}`,
    name: name,
    grade: rewardObj.grade || 'Tam Phẩm',
    description: rewardObj.description || `Bảo vật thiên tài địa bảo [${name}] đoạt được từ kỳ duyên bí cảnh.`,
    price: 600,
    quantity: qty
  };
  return { type: 'herb', item: defaultHerb, quantity: qty };
}

export interface ApplyRewardResult {
  player: PlayerStats;
  rewardItem: any | null;
  rewardType: string | null;
  quantity: number;
  added: boolean;
  isFull: boolean;
  message: string;
}

/**
 * Xử lý thêm vật phẩm Kỳ Duyên vào Inventory của Người Chơi một cách bất biến (Immutable),
 * kiểm tra chặt chẽ sức chứa ô chứa của Túi Trữ Vật.
 */
export function applySecretRealmRewardToPlayer(
  player: PlayerStats,
  outcome: EventOutcome | any
): ApplyRewardResult {
  if (!outcome) {
    return {
      player,
      rewardItem: null,
      rewardType: null,
      quantity: 0,
      added: false,
      isFull: false,
      message: 'Không có dữ liệu kết quả sự kiện.'
    };
  }

  // Tìm kiếm trường phần thưởng vật phẩm
  const rawReward =
    outcome.itemReward ||
    outcome.rewardItem ||
    outcome.effects?.itemReward ||
    outcome.effects?.rewardItem ||
    outcome.effects?.specialReward;

  if (!rawReward) {
    return {
      player,
      rewardItem: null,
      rewardType: null,
      quantity: 0,
      added: false,
      isFull: false,
      message: 'Sự kiện không chứa phần thưởng vật phẩm.'
    };
  }

  const resolved = resolveSecretRealmRewardItem(rawReward);
  if (!resolved) {
    // Là cơ duyên phi vật phẩm (tinh thần/cảnh giới)
    return {
      player,
      rewardItem: null,
      rewardType: null,
      quantity: 0,
      added: false,
      isFull: false,
      message: 'Cơ duyên đặc biệt không phải vật phẩm túi trữ vật.'
    };
  }

  const maxCapacity = getMaxInventoryCapacity(player);
  const currentInv = player.inventory || {
    pills: [],
    herbs: [],
    ores: [],
    manuals: [],
    equipments: [],
    books: [],
    bags: []
  };

  const addResult = addItemToInventory(
    currentInv,
    maxCapacity,
    resolved.type,
    resolved.item,
    resolved.quantity
  );

  if (!addResult.success) {
    // Nếu là túi trữ vật mới tốt hơn túi hiện tại, đặc cách thu nạp để người chơi không bị nghẽn
    if (resolved.type === 'bag' && resolved.item && (resolved.item.maxSlots || 0) > (player.storageBag?.maxSlots || 20)) {
      const newBags = [...(currentInv.bags || []), resolved.item];
      const updatedPlayer: PlayerStats = {
        ...player,
        inventory: { ...currentInv, bags: newBags }
      };
      return {
        player: updatedPlayer,
        rewardItem: resolved.item,
        rewardType: resolved.type,
        quantity: 1,
        added: true,
        isFull: false,
        message: `Thu hoạch được [${resolved.item.name}] (${resolved.item.maxSlots} ô)! Mở tab Túi Đồ để trang bị.`
      };
    }

    return {
      player,
      rewardItem: resolved.item,
      rewardType: resolved.type,
      quantity: resolved.quantity,
      added: false,
      isFull: true,
      message: `Túi trữ vật đã đầy (${maxCapacity >= 9999 ? '∞' : maxCapacity} ô), không thể chứa thêm bảo vật!`
    };
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    inventory: addResult.inventory
  };

  return {
    player: updatedPlayer,
    rewardItem: resolved.item,
    rewardType: resolved.type,
    quantity: resolved.quantity,
    added: true,
    isFull: false,
    message: `Thu nhận thành công [${resolved.item.name}] x${resolved.quantity} vào Túi Trữ Vật!`
  };
}

// ============================================
