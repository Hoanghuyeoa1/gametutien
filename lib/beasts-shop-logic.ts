// lib/beasts-shop-logic.ts
import { PlayerStats, SpiritBeast } from './types';
import { BeastShopItem } from './types/beasts-shop';
import { calculateTotalEquivalentHaPham } from './item-quality-data';
import { deductEquivalentLinhThach } from './merchant-data';
import { getBondedCompanionBuffs } from './companions-data';
import { BEASTS_SHOP_ITEMS_MAP } from './beasts-shop-data';

export interface RecruitBeastResult {
  success: boolean;
  updatedPlayer?: PlayerStats;
  message: string;
}

/**
 * Kiểm tra xem người chơi đã kết khế ước hoặc sở hữu Thần Thú này chưa
 */
export function isBeastAlreadyRecruited(player: PlayerStats, beastId: string): boolean {
  if (!beastId) return false;

  // 1. Kiểm tra trong beastsState.ownedBeastIds
  if (player.beastsState?.ownedBeastIds?.includes(beastId)) return true;

  // 2. Kiểm tra trong player.beasts
  if (player.beasts?.some(b => b.id === beastId)) return true;

  // 3. Kiểm tra trong player.spiritBeasts
  if (player.spiritBeasts?.some(b => b.id === beastId)) return true;

  // 4. Kiểm tra trong danh sách đã mua độc bản của Thương Hội
  const purchasedIds = player.merchantState?.purchasedOneTimeIds || [];
  if (purchasedIds.includes(beastId)) return true;

  const boughtIds = player.merchantState?.boughtOneTimeItemIds || [];
  if (boughtIds.includes(beastId)) return true;

  return false;
}

/**
 * Logic thuần hóa / ký kết khế ước linh hồn cùng Thần Thú Cửu Giai từ Vạn Bảo Thương Hội
 */
export function recruitBeastFromShop(
  player: PlayerStats,
  item: BeastShopItem
): RecruitBeastResult {
  // 1. Xác thực điều kiện cảnh giới tối thiểu
  const playerRealm = player.currentRealm || 0;
  if (playerRealm < item.requiredRealmIndex) {
    return {
      success: false,
      message: `Cảnh giới của đạo hữu chưa đủ uy áp thần thức để hàng phục ${item.name}! Cần đạt tối thiểu ${item.requiredRealmName}.`
    };
  }

  // 2. Kiểm tra chống khế ước trùng lặp (One-Time Beast Bond Guard)
  if (isBeastAlreadyRecruited(player, item.id)) {
    return {
      success: false,
      message: `Đã kết linh khế cùng ${item.name} (${item.speciesTitle}), không thể ký trùng lặp!`
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
      message: `Linh thạch không đủ để kết duyên thần thú ${item.name}! Cần ${finalPrice.toLocaleString()} Hạ Phẩm Linh Thạch.`
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

  // 6. Cập nhật PlayerBeastsState
  const currentOwnedBeasts = Array.from(new Set([
    ...(p.beastsState?.ownedBeastIds || []),
    item.id
  ]));

  let activeCombatId = p.beastsState?.activeCombatBeastId;
  let activeMountId = p.beastsState?.activeMountBeastId;

  // Tự động gắn thú xuất chiến nếu chưa có (đối với Chiến Đấu / Hộ Thể)
  if (!activeCombatId && (item.archetype === 'chien_dau' || item.archetype === 'ho_the')) {
    activeCombatId = item.id;
  }

  // Tự động gắn thú cưỡi nếu chưa có (đối với Thần Hành Tọa Kỵ)
  if (!activeMountId && item.archetype === 'thu_cuoi') {
    activeMountId = item.id;
  }

  const newBeastsState = {
    ownedBeastIds: currentOwnedBeasts,
    activeCombatBeastId: activeCombatId,
    activeMountBeastId: activeMountId
  };

  // 7. Đồng bộ hóa vào danh sách player.beasts để tương thích 100% với giao diện BeastTab
  const legacyBeast: SpiritBeast = {
    id: item.id,
    name: item.name,
    species: item.speciesTitle,
    quality: item.tier >= 9 ? 'tien_pham' : item.tier >= 7 ? 'cuc_pham' : item.tier >= 5 ? 'tuyet_pham' : item.tier >= 3 ? 'thuong_pham' : 'trung_pham',
    element: item.elementalAffinity === 'hoa' ? 'hỏa' : item.elementalAffinity === 'thuy' ? 'thủy' : item.elementalAffinity === 'tho' ? 'thổ' : item.elementalAffinity === 'kim' ? 'kim' : 'mộc',
    level: item.tier * 10,
    exp: 0,
    maxExp: 1000 * item.tier,
    stage: item.tier,
    loyalty: 100,
    role: item.archetype === 'thu_cuoi' ? 'mount' : item.archetype === 'ho_the' ? 'guardian' : 'combat',
    stats: {
      hp: item.stats.hpBonusFlat || (item.stats.combatPower * 5),
      maxHp: item.stats.hpBonusFlat || (item.stats.combatPower * 5),
      atk: Math.floor(item.stats.combatPower * 0.4),
      def: Math.floor(item.stats.combatPower * 0.2),
      blockPercent: item.archetype === 'ho_the' ? 20 : 5,
      mountSpeedBonus: item.stats.speedBonusFlat || 0,
      mpRegenBonus: 5
    },
    skills: [{
      name: item.innateSkillName,
      description: item.innateSkillDesc
    }],
    avatar: '🐾',
    description: item.description,
    isDeployed: activeCombatId === item.id
  };

  const updatedBeastsList = [...(p.beasts || [])];
  if (!updatedBeastsList.some(b => b.id === item.id)) {
    updatedBeastsList.push(legacyBeast);
  }

  // 8. Cập nhật danh sách vật phẩm đã mua độc bản trong Thương Hội
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

  // 9. Áp dụng Khí Vận vĩnh viễn nếu Thần Thú có thiên phú Khí Vận
  let updatedKhiVan = p.khiVan || 10;
  if (item.stats.khiVanBonus) {
    updatedKhiVan += item.stats.khiVanBonus;
  }

  const updatedPlayer: PlayerStats = {
    ...p,
    khiVan: updatedKhiVan,
    beastsState: newBeastsState,
    beasts: updatedBeastsList,
    spiritBeasts: updatedBeastsList,
    activeBeastId: activeCombatId || p.activeBeastId,
    merchantState: newMerchantState
  };

  return {
    success: true,
    updatedPlayer,
    message: `Đã dùng đại uy áp hàng phục và kết giao khế ước linh hồn cùng ${item.name} (${item.speciesTitle})!`
  };
}

/**
 * Đổi Thần Thú xuất chiến (Combat Slot)
 */
export function setActiveCombatBeast(player: PlayerStats, beastId: string | null): PlayerStats {
  const currentBeastsState = player.beastsState || { ownedBeastIds: [] };
  const updatedBeastsState = {
    ...currentBeastsState,
    activeCombatBeastId: beastId || undefined
  };

  const updatedBeasts = (player.beasts || []).map(b => ({
    ...b,
    isDeployed: b.id === beastId
  }));

  return {
    ...player,
    beastsState: updatedBeastsState,
    beasts: updatedBeasts,
    spiritBeasts: updatedBeasts,
    activeBeastId: beastId
  };
}

/**
 * Đổi Thần Hành Tọa Kỵ (Mount Slot)
 */
export function setActiveMountBeast(player: PlayerStats, beastId: string | null): PlayerStats {
  const currentBeastsState = player.beastsState || { ownedBeastIds: [] };
  const updatedBeastsState = {
    ...currentBeastsState,
    activeMountBeastId: beastId || undefined
  };

  return {
    ...player,
    beastsState: updatedBeastsState
  };
}

/**
 * Tính toán tổng chỉ số gia trì từ Thần Thú Xuất Chiến và Tọa Kỵ
 */
export function calculateActiveBeastsBuffs(player: PlayerStats): {
  combatPower: number;
  atkBonusPercent: number;
  defBonusPercent: number;
  hpBonusFlat: number;
  speedBonusFlat: number;
  critRateBonus: number;
  dodgeBonus: number;
  dropRateBonusPercent: number;
} {
  const buffs = {
    combatPower: 0,
    atkBonusPercent: 0,
    defBonusPercent: 0,
    hpBonusFlat: 0,
    speedBonusFlat: 0,
    critRateBonus: 0,
    dodgeBonus: 0,
    dropRateBonusPercent: 0
  };

  const combatBeastId = player.beastGarden?.activeCombatId || player.beastsState?.activeCombatBeastId || player.activeBeastId;
  const mountBeastId = player.beastGarden?.activeMountId || player.beastsState?.activeMountBeastId;

  const appliedIds = new Set<string>();

  // 1. Kiểm tra trong danh mục Thần Thú Vạn Bảo Thương Hội (BEASTS_SHOP_ITEMS_MAP)
  if (combatBeastId && BEASTS_SHOP_ITEMS_MAP[combatBeastId]) {
    appliedIds.add(combatBeastId);
    const b = BEASTS_SHOP_ITEMS_MAP[combatBeastId];
    buffs.combatPower += b.stats.combatPower || 0;
    buffs.atkBonusPercent += b.stats.atkBonusPercent || 0;
    buffs.defBonusPercent += b.stats.defBonusPercent || 0;
    buffs.hpBonusFlat += b.stats.hpBonusFlat || 0;
    buffs.speedBonusFlat += b.stats.speedBonusFlat || 0;
    buffs.critRateBonus += b.stats.critRateBonus || 0;
    buffs.dodgeBonus += b.stats.dodgeBonus || 0;
    buffs.dropRateBonusPercent += b.stats.dropRateBonusPercent || 0;
  }

  if (mountBeastId && BEASTS_SHOP_ITEMS_MAP[mountBeastId] && !appliedIds.has(mountBeastId)) {
    appliedIds.add(mountBeastId);
    const b = BEASTS_SHOP_ITEMS_MAP[mountBeastId];
    buffs.combatPower += b.stats.combatPower || 0;
    buffs.atkBonusPercent += b.stats.atkBonusPercent || 0;
    buffs.defBonusPercent += b.stats.defBonusPercent || 0;
    buffs.hpBonusFlat += b.stats.hpBonusFlat || 0;
    buffs.speedBonusFlat += b.stats.speedBonusFlat || 0;
    buffs.critRateBonus += b.stats.critRateBonus || 0;
    buffs.dodgeBonus += b.stats.dodgeBonus || 0;
    buffs.dropRateBonusPercent += b.stats.dropRateBonusPercent || 0;
  }

  // 2. Kiểm tra trong Thú Uyển & Danh sách Linh Thú của người chơi (SpiritBeast / Biến Chủng Lai Tạo)
  const allBeasts = player.beastGarden?.beasts || player.beasts || player.spiritBeasts || [];

  const applyCustomSpiritBeastBuff = (sb: any, isCombat: boolean, isMount: boolean) => {
    if (!sb || appliedIds.has(sb.id)) return;
    appliedIds.add(sb.id);

    // Chỉ số chiến đấu từ combatStats hoặc stats
    const atk = sb.combatStats?.atkBonus ?? (sb.stats?.atk || 0);
    const def = sb.combatStats?.defBonus ?? (sb.stats?.def || 0);
    const hp = sb.combatStats?.hpBonus ?? (sb.stats?.hp || 0);
    const crit = sb.combatStats?.critRate ?? 0;
    const speed = sb.travelSpeedBonus ?? (sb.stats?.mountSpeedBonus || 0);

    if (isCombat || sb.canFight || sb.isHybrid) {
      buffs.atkBonusPercent += Math.min(60, Math.floor(atk / 20));
      buffs.defBonusPercent += Math.min(60, Math.floor(def / 20));
      buffs.hpBonusFlat += hp;
      buffs.critRateBonus += crit;
      buffs.combatPower += Math.floor(atk * 2 + def * 1.5 + hp * 0.1);
    }

    if (isMount || sb.canMount || sb.isHybrid) {
      buffs.speedBonusFlat += speed;
    }

    // Hào quang thiên phú (Innate Aura)
    if (sb.innateAura) {
      const val = sb.innateAura.value || 0;
      if (sb.innateAura.effectType === 'damage_reduction') {
        buffs.dodgeBonus += Math.min(25, val);
      } else if (sb.innateAura.effectType === 'elemental_burst') {
        buffs.atkBonusPercent += val;
      } else if (sb.innateAura.effectType === 'stun') {
        buffs.critRateBonus += val;
      }
    }
  };

  if (combatBeastId && !appliedIds.has(combatBeastId)) {
    const sb = allBeasts.find((b: any) => b.id === combatBeastId);
    if (sb) applyCustomSpiritBeastBuff(sb, true, false);
  }

  if (mountBeastId && !appliedIds.has(mountBeastId)) {
    const sb = allBeasts.find((b: any) => b.id === mountBeastId);
    if (sb) applyCustomSpiritBeastBuff(sb, false, true);
  }

  return buffs;
}
