// lib/companions-shop-logic.ts
import { PlayerStats, CompanionPlayerState } from './types';
import { CompanionShopItem } from './types/companions-shop';
import { calculateTotalEquivalentHaPham } from './item-quality-data';
import { deductEquivalentLinhThach } from './merchant-data';
import { getBondedCompanionBuffs } from './companions-data';

export interface RecruitCompanionResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Kiểm tra xem người chơi đã kết duyên hoặc sở hữu Đạo Lữ này chưa
 */
export function isCompanionAlreadyRecruited(player: PlayerStats, companionId: string): boolean {
  if (!companionId) return false;
  
  // 1. Kiểm tra trong companionsState.companions
  const compInState = player.companionsState?.companions?.[companionId];
  if (compInState && compInState.isBonded) return true;

  // 2. Kiểm tra trong companions legacy map
  const compInLegacy = (player.companions as any)?.[companionId];
  if (compInLegacy && compInLegacy.isBonded) return true;

  // 3. Kiểm tra trong danh sách đã mua độc bản của Thương Hội
  const purchasedIds = player.merchantState?.purchasedOneTimeIds || [];
  if (purchasedIds.includes(companionId)) return true;

  return false;
}

/**
 * Logic chiêu mộ / chuộc thân / kết duyên Đạo Lữ Cửu Giai từ Vạn Bảo Thương Hội
 */
export function recruitCompanionFromShop(
  player: PlayerStats,
  item: CompanionShopItem
): RecruitCompanionResult {
  // 1. Xác thực điều kiện cảnh giới tối thiểu
  const playerRealm = player.currentRealm || 0;
  if (playerRealm < item.requiredRealmIndex) {
    return {
      success: false,
      message: `Cảnh giới của đạo hữu chưa đủ uy áp để che chở cho ${item.name}! Cần đạt tối thiểu ${item.requiredRealmName}.`
    };
  }

  // 2. Kiểm tra chống kết duyên trùng lặp (One-Time Recruitment Guard)
  if (isCompanionAlreadyRecruited(player, item.id)) {
    return {
      success: false,
      message: `Đã kết duyên cùng ${item.name} (${item.title}), không thể ký ước trùng lặp!`
    };
  }

  // 3. Tính toán giá thực tế có kèm chiết khấu Đạo Lữ (Dạ Mộng Ly / Vạn Bảo Nữ Thần Tôn)
  const companionBuffs = getBondedCompanionBuffs(player);
  const discountPercent = companionBuffs.merchantDiscountPercent || 0;
  const finalPrice = discountPercent > 0
    ? Math.max(1, Math.floor(item.price * (1 - discountPercent / 100)))
    : item.price;

  // 4. Kiểm tra số dư Linh Thạch quy đổi
  const totalEquivalent = calculateTotalEquivalentHaPham(player);
  if (totalEquivalent < finalPrice) {
    return {
      success: false,
      message: `Linh thạch không đủ để chuộc thân cho ${item.name}! Cần ${finalPrice.toLocaleString()} Hạ Phẩm Linh Thạch.`
    };
  }

  // 5. Khấu trừ Linh Thạch tự động
  const deductRes = deductEquivalentLinhThach(player, finalPrice);
  if (!deductRes.success || !deductRes.updatedPlayer) {
    return {
      success: false,
      message: 'Không thể khấu trừ Linh Thạch, xin kiểm tra lại túi trữ vật!'
    };
  }

  const p = deductRes.updatedPlayer;

  // 6. Cập nhật hồ sơ Đạo Lữ trong companionsState
  const currentCompanions = { ...(p.companionsState?.companions || {}) };
  const existingComp = currentCompanions[item.id];
  const newCompState: CompanionPlayerState = {
    id: item.id,
    isMet: true,
    affinity: Math.max(existingComp?.affinity || 0, item.stats.favorabilityInitial, 60),
    isBonded: true,
    bondedAt: existingComp?.bondedAt || Date.now(),
    lastSongTuTime: existingComp?.lastSongTuTime || 0,
    lastChatTime: existingComp?.lastChatTime || 0,
    totalSongTuCount: existingComp?.totalSongTuCount || 0,
    questStarted: existingComp?.questStarted || false,
    questCompleted: existingComp?.questCompleted || false,
    tokenEquipped: existingComp?.tokenEquipped || false,
    assignedGarden: existingComp?.assignedGarden || false,
    lastSongTuType: existingComp?.lastSongTuType || 'tu_vi',
    combatPower: item.stats.combatPower,
    tuViBonusPercent: item.stats.tuViBonusPercent,
    innatePhysique: item.innatePhysique,
    title: item.title,
    name: item.name
  };
  currentCompanions[item.id] = newCompState;

  const newCompanionsState = {
    ...(p.companionsState || {
      activeCompanionId: null,
      stationedGardenCompanionId: null,
      tamThanHopNhatUntil: 0,
      companions: {},
      tamTinhThanDieuUntil: 0
    }),
    companions: currentCompanions
  };

  // 7. Cập nhật danh sách vật phẩm đã mua độc bản trong Thương Hội
  const purchasedIds = Array.from(new Set([
    ...(p.merchantState?.purchasedOneTimeIds || []),
    item.id
  ]));
  const boughtIds = Array.from(new Set([
    ...(p.merchantState?.boughtOneTimeItemIds || []),
    item.id
  ]));

  const updatedMerchantItems = (p.merchantState?.items || []).map(shopItem => {
    if (shopItem.id === item.id) {
      return {
        ...shopItem,
        stock: 0,
        isSoldOutPermanent: true
      };
    }
    return shopItem;
  });

  const newMerchantState = {
    ...(p.merchantState || { items: [] }),
    purchasedOneTimeIds: purchasedIds,
    boughtOneTimeItemIds: boughtIds,
    items: updatedMerchantItems
  };

  // 8. Áp dụng gia trì vĩnh viễn cho tu sĩ nếu là Khí Vận Dị Thể (permanentPlayerBuff)
  let updatedKhiVan = p.khiVan || 10;
  let updatedCanCot = p.canCot || 10;
  let updatedNgoTinh = p.ngoTinh || 10;
  let updatedTamCanh = p.tamCanh || 10;

  if (item.stats.permanentPlayerBuff) {
    const buff = item.stats.permanentPlayerBuff;
    if (buff.khiVan) updatedKhiVan += buff.khiVan;
    if (buff.canCot) updatedCanCot += buff.canCot;
    if (buff.ngoTinh) updatedNgoTinh += buff.ngoTinh;
    if (buff.tamCanh) updatedTamCanh += buff.tamCanh;
  }

  const updatedPlayer: PlayerStats = {
    ...p,
    khiVan: updatedKhiVan,
    canCot: updatedCanCot,
    ngoTinh: updatedNgoTinh,
    tamCanh: updatedTamCanh,
    companionsState: newCompanionsState,
    companions: newCompanionsState,
    merchantState: newMerchantState
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã giải trừ kiếp nạn lưu lạc, chính thức kết duyên cùng ${item.name} (${item.title})!`
  };
}
