import { useState, useEffect } from 'react';
import {
  PlayerStats,
  MerchantItem,
  MerchantCategory,
  Equipment,
  EquipmentGrade,
  PillGrade,
  HerbGrade,
  Pill,
  Herb,
  LogType
} from '@/lib/types';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import {
  calculateTotalEquivalentHaPham,
  LINH_THACH_RATES
} from '@/lib/item-quality-data';
import {
  canAddItemToInventory,
  createDefaultArtisanState,
  getMaxInventoryCapacity,
  getCurrentInventoryOccupiedSlots
} from '@/lib/inventory-data';
import {
  deductEquivalentLinhThach,
  generateMerchantInventory,
  calculateSellPrice,
  REFRESH_MERCHANT_COST_LT,
  isOneTimeMerchantItem,
  checkAndTriggerDailyShopReset,
  DAILY_REFRESH_INTERVAL_MS
} from '@/lib/merchant-data';
import { createRandomEgg } from '@/lib/beast-data';
import { DEFAULT_HERBS, DEFAULT_PILLS } from '@/lib/alchemy-data';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';
import { useCultivationShopItem } from '@/lib/cultivation-shop-logic';
import {
  getMaxDivineAbilitySlots,
  buyAndLearnDivineAbility,
  equipDivineAbility,
  unequipDivineAbility
} from '@/lib/divine-abilities-logic';
import { DIVINE_SHOP_ITEMS_MAP } from '@/lib/divine-abilities-data';
import { buyHerbsBatch } from '@/lib/herbs-shop-logic';
import { HerbShopItem } from '@/lib/types/herbs-shop';
import { buyOresBatch } from '@/lib/ores-shop-logic';
import { OreShopItem } from '@/lib/types/ores-shop';
import { buyEquipmentItem } from '@/lib/equipment-shop-logic';
import { EquipmentShopItem } from '@/lib/types/equipment-shop';
import { recruitCompanionFromShop } from '@/lib/companions-shop-logic';
import { CompanionShopItem } from '@/lib/types/companions-shop';
import { COMPANIONS_SHOP_ITEMS_MAP } from '@/lib/companions-shop-data';
import { recruitBeastFromShop, setActiveCombatBeast, setActiveMountBeast } from '@/lib/beasts-shop-logic';
import { BeastShopItem } from '@/lib/types/beasts-shop';
import { buyAndUnlockStorage } from '@/lib/storage-shop-logic';
import { StorageShopItem } from '@/lib/types/storage-shop';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';

interface UseMerchantInventoryActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  playSfx?: (soundName: any) => void;
}

export function useMerchantInventoryActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx
}: UseMerchantInventoryActionsParams) {
  const [merchantSubTab, setMerchantSubTab] = useState<MerchantCategory>('all');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'pills' | 'herbs' | 'ores' | 'equipments' | 'manuals' | 'books' | 'bags'>('all');
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);

  // Tá»± Ä‘á»™ng kiá»ƒm tra lÃ m má»›i hÃ ng hÃ³a hÃ ng ngÃ y (24h)
  useEffect(() => {
    const check = checkAndTriggerDailyShopReset(player);
    if (check.shouldReset) {
      const normalized = normalizePlayerData(check.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      addLog('ThÆ°Æ¡ng Há»™i Äá»•i LÃ´ Má»›i', 'ThÆ°Æ¡ng Há»™i Ä‘Ã£ cáº­p báº¿n lÃ´ hÃ ng má»›i ngÃ y hÃ´m nay!', 'merchant');
      showToast('ðŸ“¦ ThÆ°Æ¡ng Há»™i Ä‘Ã£ cáº­p báº¿n lÃ´ hÃ ng má»›i ngÃ y hÃ´m nay!');
    }
  }, []);

  // Há»‘i Ä‘oÃ¡i cÃ¡c loáº¡i Linh Tháº¡ch
  const handleExchangeLinhThach = (
    fromType: 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'tien_tinh' | 'tien_pham',
    toType: 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'tien_tinh' | 'tien_pham',
    amount: number = 1
  ) => {
    if (amount <= 0) return;
    const updated = { ...player };
    const propMap = {
      ha_pham: 'linhThach',
      trung_pham: 'trungPhamLinhThach',
      thuong_pham: 'thuongPhamLinhThach',
      cuc_pham: 'cucPhamLinhThach',
      tien_tinh: 'tienTinh',
      tien_pham: 'tienTinh'
    } as const;

    const fromProp = propMap[fromType];
    const toProp = propMap[toType];
    const fromRate = LINH_THACH_RATES[fromType as keyof typeof LINH_THACH_RATES] || 1;
    const toRate = LINH_THACH_RATES[toType as keyof typeof LINH_THACH_RATES] || 1;

    const currentFromAmount = (updated as any)[fromProp] || 0;
    if (currentFromAmount < amount) {
      showToast('Sá»‘ lÆ°á»£ng linh tháº¡ch khÃ´ng Ä‘á»§ Ä‘á»ƒ chuyá»ƒn Ä‘á»•i!');
      return;
    }

    const totalBaseValue = amount * fromRate;
    const receivedAmount = Math.floor(totalBaseValue / toRate);
    if (receivedAmount <= 0) {
      showToast('Sá»‘ lÆ°á»£ng khÃ´ng Ä‘á»§ Ä‘á»ƒ quy Ä‘á»•i lÃªn báº­c cao hÆ¡n (cáº§n 1,000 viÃªn)!');
      return;
    }

    const spentFrom = Math.ceil((receivedAmount * toRate) / fromRate);

    (updated as any)[fromProp] -= spentFrom;
    (updated as any)[toProp] = ((updated as any)[toProp] || 0) + receivedAmount;

    // Äá»“ng bá»™ tienTinh vÃ  tienPhamLinhThach
    if (toProp === 'tienTinh' || fromProp === 'tienTinh') {
      updated.tienTinh = (updated as any).tienTinh || 0;
      updated.tienPhamLinhThach = updated.tienTinh;
    }

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`Há»‘i Ä‘oÃ¡i thÃ nh cÃ´ng! Nháº­n Ä‘Æ°á»£c ${receivedAmount.toLocaleString()} viÃªn.`);
    addLog(
      'Há»‘i ÄoÃ¡i Tá»‡ Äiáº¿m',
      `Tá»‡ Äiáº¿m giao dá»‹ch: TiÃªu hao ${spentFrom.toLocaleString()} viÃªn, thu hoáº¡ch ${receivedAmount.toLocaleString()} viÃªn má»›i.`,
      'system'
    );
  };

  // Mua hÃ ng tá»« Váº¡n Báº£o ThÆ°Æ¡ng Há»™i (há»— trá»£ sá»‘ lÆ°á»£ng mua 1, 5, 10...)
  const handleBuyMerchantItem = (item: MerchantItem, buyQuantity: number = 1) => {
    // Kiá»ƒm tra Cáº£nh Giá»›i yÃªu cáº§u
    if (item.requiredRealmIndex !== undefined && (player.currentRealm || 0) < item.requiredRealmIndex) {
      showToast(`ðŸ”’ Cáº£nh giá»›i chÆ°a Ä‘á»§ Ä‘á»ƒ mua [${item.name}]! Cáº§n Ä‘áº¡t [${item.requiredRealmName || 'Cáº£nh Giá»›i Cao HÆ¡n'}].`);
      return;
    }

    if (item.stock <= 0) {
      showToast('Váº­t pháº©m nÃ y Ä‘Ã£ bÃ¡n háº¿t!');
      return;
    }

    // Kiểm tra nếu là Đạo Lữ Khế Ước Cửu Giai -> Chuyển sang xử lý kết duyên chuyên biệt
    const isTierCompanion = Boolean(item.companionData || item.category === 'companions' || item.id.startsWith('comp_t'));
    if (isTierCompanion) {
      const compItem = item.companionData || COMPANIONS_SHOP_ITEMS_MAP[item.id];
      if (compItem) {
        handleRecruitCompanion(compItem);
        return;
      }
    }

    // Kiá»ƒm tra náº¿u lÃ  TÃ¢m PhÃ¡p Tu Luyá»‡n Ä‘Ã£ há»c thÃ¬ cháº·n mua Ä‘á»ƒ trÃ¡nh lÃ£ng phÃ­
    if (item.cultivationCategory === 'manual' || item.data?.category === 'manual' || item.id.includes('_manual')) {
      if (player.cultivationBuffState?.learnedManualIds?.includes(item.id)) {
        showToast(`âš ï¸ Báº¡n Ä‘Ã£ lÄ©nh ngá»™ tÃ¢m phÃ¡p [${item.name}] rá»“i, khÃ´ng thá»ƒ mua trÃ¹ng láº·p!`);
        return;
      }
    }

    // Kiá»ƒm tra náº¿u lÃ  CÃ´ng PhÃ¡p BÃ­ Tá»‹ch Cá»­u Giai Ä‘Ã£ lÄ©nh ngá»™ thÃ¬ cháº·n mua
    const isTierManual = Boolean(item.manualStatModifiers || item.id.startsWith('man_t') || (item.category === 'manuals' && item.manualCategory));
    if (isTierManual) {
      if (player.manualsState?.learnedManualIds?.includes(item.id)) {
        showToast(`âš ï¸ Báº¡n Ä‘Ã£ lÄ©nh ngá»™ cÃ´ng phÃ¡p [${item.name}] rá»“i, khÃ´ng thá»ƒ tu luyá»‡n trÃ¹ng láº·p!`);
        return;
      }
    }

    // Kiá»ƒm tra náº¿u lÃ  Tháº§n ThÃ´ng BÃ­ Thuáº­t Cá»­u Giai Ä‘Ã£ Ä‘áº¯c ngá»™ thÃ¬ cháº·n mua
    const isTierDivine = Boolean(item.divineAbility || item.id.startsWith('div_t') || (item.category === 'skills' && item.divineCategory));
    if (isTierDivine) {
      if (player.divineAbilitiesState?.learnedDivineIds?.includes(item.id)) {
        showToast(`âš ï¸ Báº¡n Ä‘Ã£ Ä‘áº¯c ngá»™ tháº§n thÃ´ng [${item.name}] rá»“i, khÃ´ng thá»ƒ tu luyá»‡n trÃ¹ng láº·p!`);
        return;
      }
    }

    const compBuffs = getBondedCompanionBuffs(player);
    const discountPercent = compBuffs.merchantDiscountPercent || 0;
    const effectiveUnitPrice = discountPercent > 0
      ? Math.max(1, Math.floor(item.price * (1 - discountPercent / 100)))
      : item.price;

    const qty = Math.max(1, Math.min(item.stock || 1, buyQuantity));
    const totalPrice = effectiveUnitPrice * qty;
    const effectivePrice = totalPrice;

    const totalAvailable = calculateTotalEquivalentHaPham(player);
    if (totalAvailable < totalPrice) {
      showToast(`Linh tháº¡ch khÃ´ng Ä‘á»§! Cáº§n tÆ°Æ¡ng Ä‘Æ°Æ¡ng ${totalPrice.toLocaleString()} Háº¡ Pháº©m Linh Tháº¡ch Ä‘á»ƒ mua x${qty}.`);
      return;
    }

    const itype = item.itemType;
    const isTinhHuyet = item.id.includes('tinh_huyet') || item.type === 'tinhHuyet' || !!(item.data && item.data.tinhHuyetCount);
    const isEgg = item.id === 'm_beast_linh_noan_than_bi' || item.id === 'm_beast_hoa_long_noan' || !!item.data?.isBeastEgg;

    if (isEgg && (player.beastEggs?.length || 0) >= 10) {
      showToast('âš ï¸ Äá»™ng phá»§ linh noÃ£n Ä‘Ã£ Ä‘áº§y (Tá»‘i Ä‘a 10 trá»©ng)! HÃ£y áº¥p ná»Ÿ bá»›t trÆ°á»›c.');
      return;
    }

    if (!isTinhHuyet && !isEgg && itype !== 'storage_bag' && !isTierManual && !isTierDivine) {
      const invCheckType = itype === 'seed' ? 'herb' : itype;
      const currentMax = getMaxInventoryCapacity(player);
      const usedSlots = getCurrentInventoryOccupiedSlots(player);
      if (!canAddItemToInventory(player, currentMax, invCheckType as any, item.id)) {
        showToast(`âš ï¸ TÃºi Ä‘á»“ Ä‘Ã£ Ä‘áº§y (${usedSlots}/${currentMax >= 9999 ? 'âˆž' : currentMax})! HÃ£y dá»n tÃºi hoáº·c nÃ¢ng cáº¥p TÃºi Trá»¯ Váº­t trÆ°á»›c.`);
        return;
      }
    }

    const deductRes = deductEquivalentLinhThach(player, totalPrice);
    if (!deductRes.success) {
      showToast(deductRes.deductedMessage || 'Linh tháº¡ch khÃ´ng Ä‘á»§!');
      return;
    }

    const updated = { ...deductRes.updatedPlayer };
    const inv = {
      pills: [...(updated.inventory?.pills || [])],
      herbs: [...(updated.inventory?.herbs || [])],
      ores: [...(updated.inventory?.ores || [])],
      equipments: [...(updated.inventory?.equipments || [])],
      manuals: [...(updated.inventory?.manuals || [])],
      books: [...(updated.inventory?.books || [])],
      bags: [...(updated.inventory?.bags || [])],
    };

    if (isTinhHuyet) {
      const dropCount = item.data?.tinhHuyetCount || 1;
      updated.tinhHuyetYeuThu = (updated.tinhHuyetYeuThu || 0) + dropCount;
      showToast(`âœ… ÄÃ£ mua [${item.name}]! Thu Ä‘Æ°á»£c +${dropCount} giá»t Tinh Huyáº¿t YÃªu ThÃº Ä‘á»ƒ TÃ´i Thá»ƒ!`);
      addLog('ThÆ°Æ¡ng Há»™i Tinh Huyáº¿t', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua [${item.name}], nháº­n Ä‘Æ°á»£c +${dropCount} Tinh Huyáº¿t YÃªu ThÃº!`, 'physique');
    } else if (isEgg) {
      const pickedKey = item.data?.eggKey || (item.id === 'm_beast_hoa_long_noan' ? 'egg_thai_co' : undefined);
      const newEgg = createRandomEgg(pickedKey);
      if (item.id === 'm_beast_hoa_long_noan') {
        newEgg.name = 'HÃ³a Long NoÃ£n';
        newEgg.avatar = 'ðŸ‰ðŸ¥š';
        newEgg.quality = 'tuyet_pham';
        newEgg.description = 'Trá»©ng giao long viá»…n cá»• mang long vÄƒn kim sáº¯c, áº¥p ná»Ÿ cháº¯c cháº¯n ra Tháº§n ThÃº thÆ°á»£ng cá»•!';
      }
      updated.beastEggs = [...(updated.beastEggs || []), newEgg];
      showToast(`âœ… ÄÃ£ mua [${item.name}]! Má»Ÿ tab Linh ThÃº Ä‘á»ƒ rÃ³t ChÃ¢n NguyÃªn áº¥p ná»Ÿ!`);
      addLog('ThÆ°Æ¡ng Há»™i Linh ThÃº', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua [${item.name}], nháº­n Ä‘Æ°á»£c 1 Linh NoÃ£n Ä‘Æ°a vÃ o Äá»™ng Phá»§ Linh ThÃº.`, 'companion');
    } else if (item.id === 'm_gift_dong_tam_ket' || item.data?.isDongTamKet) {
      inv.equipments.push({
        id: `dong_tam_ket_${Date.now()}`,
        name: 'Äá»“ng TÃ¢m Káº¿t',
        slot: 'artifact',
        grade: 'Tá»© Giai',
        enhancement: 0,
        powerBonus: 150,
        hpBonus: 600,
        mpBonus: 600,
        description: 'Váº­t pháº©m nghi thá»©c tÆ¡ há»“ng tiÃªn gia, gia trÃ¬ tÄƒng gáº¥p Ä‘Ã´i (+100%) Ä‘iá»ƒm háº£o cáº£m khi Ä‘Ã m Ä‘áº¡o cÃ¹ng Äáº¡o Lá»¯.'
      });
      updated.dongTamKet = true;
      showToast(`âœ… ÄÃ£ mua [Äá»“ng TÃ¢m Káº¿t]! Tá»« nay Ä‘Ã m Ä‘áº¡o vá»›i Äáº¡o Lá»¯ sáº½ nháº­n gáº¥p Ä‘Ã´i (+100%) Ä‘iá»ƒm Háº£o Cáº£m!`);
      addLog('ThÆ°Æ¡ng Há»™i TiÃªn DuyÃªn', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch sá»Ÿ há»¯u báº£o váº­t [Äá»“ng TÃ¢m Káº¿t]!`, 'companion');
    } else if (item.id === 'm_gift_uyen_uong_song_boi' || item.data?.isUyenUongSongBoi) {
      inv.equipments.push({
        id: `uyen_uong_song_boi_${Date.now()}`,
        name: 'UyÃªn Æ¯Æ¡ng Song Bá»™i',
        slot: 'artifact',
        grade: 'NgÅ© Giai',
        enhancement: 0,
        powerBonus: 500,
        hpBonus: 2000,
        mpBonus: 1000,
        description: 'Cáº·p ngá»c bá»™i long phá»¥ng cá»™ng hÆ°á»Ÿng. Khi sá»Ÿ há»¯u, tÄƒng vÄ©nh viá»…n +30% Tu Vi thu Ä‘Æ°á»£c sau má»—i láº§n ThiÃªn Äá»‹a Song Tu.'
      });
      updated.uyenUongSongBoi = true;
      showToast(`âœ… ÄÃ£ mua [UyÃªn Æ¯Æ¡ng Song Bá»™i]! Tá»« nay má»—i láº§n Song Tu nháº­n thÃªm +30% Tu Vi!`);
      addLog('ThÆ°Æ¡ng Há»™i TiÃªn DuyÃªn', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch sá»Ÿ há»¯u báº£o váº­t Ä‘á»™c báº£n [UyÃªn Æ¯Æ¡ng Song Bá»™i]!`, 'companion');
    } else if (item.id === 'm_gift_huong_tui_tinh_nong' || item.data?.isHuongTuiTinhNong) {
      inv.equipments.push({
        id: `huong_tui_tinh_nong_${Date.now()}`,
        name: 'HÆ°Æ¡ng TÃºi TÃ¬nh Ná»“ng',
        slot: 'artifact',
        grade: 'Tam Giai',
        enhancement: 0,
        powerBonus: 200,
        hpBonus: 800,
        mpBonus: 400,
        description: 'TÃºi hÆ°Æ¡ng ngÃ¡t hÆ°Æ¡ng hoa ngÃ n nÄƒm, giáº£m 50% thá»i gian há»“i chiÃªu giá»¯a cÃ¡c láº§n táº·ng quÃ /Ä‘Ã m Ä‘áº¡o.'
      });
      updated.huongTuiTinhNong = true;
      showToast(`âœ… ÄÃ£ mua [HÆ°Æ¡ng TÃºi TÃ¬nh Ná»“ng]! Giáº£m 50% thá»i gian há»“i chiÃªu ÄÃ m Äáº¡o cÃ¹ng Äáº¡o Lá»¯!`);
      addLog('ThÆ°Æ¡ng Há»™i TiÃªn DuyÃªn', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch sá»Ÿ há»¯u báº£o váº­t [HÆ°Æ¡ng TÃºi TÃ¬nh Ná»“ng]!`, 'companion');
    } else if (item.id === 'm_beast_thu_hon_thao' || item.data?.isBeastHerb) {
      const existing = inv.herbs.find(h => h.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        inv.herbs.push({
          id: item.id,
          name: item.name,
          grade: (item.grade as HerbGrade) || 'Nhá»‹ Giai',
          price: effectivePrice,
          quantity: 1,
          description: item.description
        });
      }
      showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  bá» vÃ o TÃºi DÆ°á»£c Tháº£o! Má»Ÿ tab Linh ThÃº Ä‘á»ƒ cho Äƒn tÄƒng Trung ThÃ nh!`);
      addLog('ThÆ°Æ¡ng Há»™i Linh ThÃº', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua 1 bÃ³ [${item.name}], cáº¥t vÃ o TÃºi Äá»“.`, 'companion');
    } else if (item.id === 'm_beast_huyet_mach_than_dan' || item.data?.isBeastEvolution) {
      const existing = inv.pills.find(p => p.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        inv.pills.push({
          id: item.id,
          name: item.name,
          grade: (item.grade as PillGrade) || 'Tá»© Giai',
          description: item.description,
          effectType: 'beast_evolution',
          effectValue: 15,
          quantity: 1
        });
      }
      showToast(`âœ… ÄÃ£ mua [${item.name}]! Sá»­ dá»¥ng cho linh thÃº Ä‘á»ƒ thá»©c tá»‰nh huyáº¿t máº¡ch tá»• tiÃªn (+15% CÃ´ng/Thá»§)!`);
      addLog('ThÆ°Æ¡ng Há»™i Linh ThÃº', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua 1 viÃªn [${item.name}], cáº¥t vÃ o TÃºi Äan DÆ°á»£c.`, 'companion');
    } else if (item.id === 'm_beast_huyen_thiet_thu_giap' || (item.category === 'beasts' && item.beastItemType === 'armor')) {
      const eq = item.data?.equipment || {
        id: `huyen_thiet_thu_giap_${Date.now()}`,
        name: item.name,
        slot: 'armor',
        grade: (item.grade as EquipmentGrade) || 'Tam Giai',
        enhancement: 0,
        powerBonus: 350,
        hpBonus: 300,
        defBonus: 50,
        description: item.description
      };
      inv.equipments.push(eq);
      showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  cáº¥t vÃ o TÃºi Äá»“!`);
      addLog('ThÆ°Æ¡ng Há»™i Linh ThÃº', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua giÃ¡p thÃº [${item.name}], cáº¥t vÃ o TÃºi Äá»“.`, 'companion');
    } else if (item.id.startsWith('m_beast_pill_') || item.data?.isBeastPill) {
      const existing = inv.pills.find(p => p.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        inv.pills.push({
          id: item.id,
          name: item.name,
          grade: (item.grade as PillGrade) || 'Nháº¥t Giai',
          description: item.description,
          effectType: 'full_heal',
          effectValue: item.data?.beastExp || 100,
          quantity: 1
        });
      }
      showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  bá» vÃ o TÃºi Äá»“! Má»Ÿ tab Linh ThÃº Ä‘á»ƒ cho Äƒn bá»“i dÆ°á»¡ng EXP!`);
      addLog('ThÆ°Æ¡ng Há»™i Linh ThÃº', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua 1 viÃªn [${item.name}], cáº¥t vÃ o TÃºi Äá»“.`, 'companion');
    } else if (item.id === 'm_beast_thu_phuc_toa_lien') {
      inv.equipments.push({
        id: `thu_phuc_toa_lien_${Date.now()}`,
        name: 'Thu Phá»¥c Tá»a LiÃªn',
        slot: 'artifact',
        grade: 'Tam Giai',
        enhancement: 0,
        powerBonus: 350,
        hpBonus: 1000,
        mpBonus: 500,
        description: 'PhÃ¡p báº£o xÃ­ch sáº¯t phong linh thÆ°á»£ng cá»•, gia tÄƒng Ä‘Ã¡ng ká»ƒ tá»‰ lá»‡ báº¯t thÃº trong BÃ­ Cáº£nh.'
      });
      showToast(`âœ… ÄÃ£ mua [Thu Phá»¥c Tá»a LiÃªn] vÃ  cáº¥t vÃ o TÃºi Äá»“!`);
      addLog('ThÆ°Æ¡ng Há»™i PhÃ¡p Báº£o', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua phÃ¡p báº£o [Thu Phá»¥c Tá»a LiÃªn], cáº¥t vÃ o TÃºi Äá»“.`, 'merchant');
    } else if (item.id.startsWith('m_gift_') || item.data?.companionGift) {
      if (itype === 'equipment') {
        inv.equipments.push({
          id: `${item.id}_${Date.now()}`,
          name: item.name,
          slot: 'artifact',
          grade: (item.grade as EquipmentGrade) || 'Tá»© Giai',
          enhancement: 0,
          powerBonus: 500,
          hpBonus: 1500,
          mpBonus: 500,
          description: item.description
        });
      } else if (itype === 'herb') {
        const existing = inv.herbs.find(h => h.id === item.id);
        if (existing) existing.quantity += 1;
        else {
          inv.herbs.push({
            id: item.id,
            name: item.name,
            grade: item.grade,
            description: item.description,
            price: item.price,
            quantity: 1
          });
        }
      } else if (itype === 'ore') {
        const existing = inv.ores.find(o => o.id === item.id);
        if (existing) existing.quantity += 1;
        else {
          inv.ores.push({
            id: item.id,
            name: item.name,
            grade: item.grade,
            description: item.description,
            price: item.price,
            quantity: 1
          });
        }
      }
      showToast(`âœ… ÄÃ£ mua mÃ³n quÃ  [${item.name}] cáº¥t vÃ o TÃºi Äá»“! HÃ£y má»Ÿ tab Äáº¡o Lá»¯ Ä‘á»ƒ táº·ng quÃ .`);
      addLog('ThÆ°Æ¡ng Há»™i TiÃªn DuyÃªn', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua mÃ³n quÃ  [${item.name}] (${item.grade}), cáº¥t vÃ o TÃºi Äá»“.`, 'companion');
    } else if (itype === 'herb') {
      const existing = inv.herbs.find(h => h.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        const baseDef = DEFAULT_HERBS.find(h => h.id === item.data?.herbId || h.id === item.id);
        inv.herbs.push({
          id: item.id,
          name: item.name,
          grade: item.grade,
          description: item.description,
          price: item.price,
          quantity: 1,
          ...(baseDef ? { id: baseDef.id } : {})
        });
      }
      showToast(`âœ… ÄÃ£ mua 1 cÃ¢y [${item.name}] vÃ  bá» vÃ o TÃºi Äá»“!`);
      addLog('ThÆ°Æ¡ng Há»™i Giao Dá»‹ch', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua 1 cÃ¢y [${item.name}] (${item.grade}), cáº¥t vÃ o TÃºi Äá»“.`, 'merchant');
    } else if (itype === 'ore') {
      const existing = inv.ores.find(o => o.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        inv.ores.push({
          id: item.id,
          name: item.name,
          grade: item.grade,
          description: item.description,
          price: item.price,
          quantity: 1
        });
      }
      showToast(`âœ… ÄÃ£ mua 1 khá»‘i [${item.name}] vÃ  bá» vÃ o TÃºi Äá»“!`);
      addLog('ThÆ°Æ¡ng Há»™i Giao Dá»‹ch', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua 1 khá»‘i [${item.name}] (${item.grade}), cáº¥t vÃ o TÃºi Äá»“.`, 'merchant');
    } else if (itype === 'pill' || item.category === 'pills') {
      const existing = inv.pills.find(p => p.id === item.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        const pDef = DEFAULT_PILLS.find((p: Pill) => p.id === item.id || p.id === item.data?.pillId);
        inv.pills.push({
          id: item.id,
          name: item.name,
          grade: item.grade as PillGrade,
          description: item.description,
          effectType: pDef?.effectType || item.data?.effectType || 'full_heal',
          effectValue: pDef?.effectValue || item.data?.effectValue || 100,
          durationBattles: pDef?.durationBattles,
          statTarget: pDef?.statTarget || item.data?.statTarget,
          quantity: qty,
          tier: item.tier,
          data: item.data
        });
      }
      showToast(`âœ… ÄÃ£ mua [${item.name}] x${qty}, cáº¥t vÃ o BÃ¬nh Äan Trá»¯ Váº­t!`);
      addLog('ThÆ°Æ¡ng Há»™i Äan DÆ°á»£c', `Chi ${totalPrice.toLocaleString()} Linh Tháº¡ch mua ${qty} viÃªn [${item.name}], cáº¥t vÃ o BÃ¬nh Äan Trá»¯ Váº­t!`, 'merchant');
    } else if (itype === 'equipment' || item.category === 'equipment' || item.equipmentData) {
      const eqData = item.equipmentData;
      const slot = eqData?.slot || (item.equipmentType as any) || 'weapon';
      const baseStats = eqData?.baseStats || {};

      const newEquip: Equipment = {
        id: `eq_${item.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: item.name,
        slot,
        type: eqData?.type || item.equipmentType || 'weapon',
        grade: (eqData?.grade || item.grade as EquipmentGrade) || 'Nháº¥t Giai',
        quality: item.quality || 'ha_pham',
        enhancement: 0,
        powerBonus: (baseStats.atk ? baseStats.atk * 3 : 0) + (baseStats.hp ? Math.floor(baseStats.hp * 0.5) : 0) + (baseStats.def ? baseStats.def * 2 : 0) + (item.data?.powerBonus || 50),
        atkBonus: baseStats.atk || 0,
        defBonus: baseStats.def || 0,
        hpBonus: baseStats.hp || (item.data?.hpBonus || 0),
        mpBonus: baseStats.mp || (item.data?.mpBonus || 0),
        speedBonus: baseStats.speed || 0,
        critRateBonus: baseStats.critRate || 0,
        critDmgBonus: baseStats.critDmg || 0,
        damageReduction: baseStats.damageReduction || 0,
        sockets: Array.from({ length: eqData?.sockets || 0 }, () => ({ gem: null, unlocked: true })),
        maxSockets: eqData?.sockets || 0,
        affixes: (eqData?.affixes || []).map((aff, i) => {
          const statKey = Object.keys(aff.bonus || {})[0] || 'atk';
          const val = (aff.bonus as any)?.[statKey] || 0;
          return {
            id: `aff_${i}_${Date.now()}`,
            name: aff.name,
            rarity: 'lam' as const,
            statKey,
            value: val,
            bonus: aff.bonus
          };
        }),
        isNatalCandidate: Boolean(eqData?.isNatalCandidate),
        durability: 100,
        maxDurability: 100,
        price: effectivePrice,
        description: item.description
      };
      inv.equipments.push(newEquip);
      showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  cáº¥t vÃ o TÃºi Trá»¯ Váº­t! Má»Ÿ tab TÃºi Äá»“ Ä‘á»ƒ trang bá»‹ hoáº·c Táº¿ Luyá»‡n Báº£n Má»‡nh.`);
      addLog('ThÆ°Æ¡ng Há»™i PhÃ¡p Báº£o', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch sá»Ÿ há»¯u phÃ¡p báº£o [${item.name}] (${item.grade}), cáº¥t vÃ o TÃºi Trá»¯ Váº­t!`, 'merchant');
    } else if (itype === 'manual') {
      const alreadyOwned = inv.books.some(b => b.id === item.id);
      if (alreadyOwned) {
        showToast(`ÄÃ£ cÃ³ [${item.name}] trong TÃºi Äá»“ rá»“i!`);
        return;
      }
      const unlockArtisan = item.data?.unlockArtisan as 'alchemy' | 'forging' | undefined;
      inv.books.push({
        id: item.id,
        name: item.name,
        grade: item.grade,
        description: item.description,
        itemType: unlockArtisan ? 'artisan_book' : 'manual',
        unlockArtisan,
        manualId: item.data?.manualId,
        quantity: 1
      });
      showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  bá» vÃ o TÃºi Äá»“! Má»Ÿ TÃºi Äá»“ â†’ chá»n sÃ¡ch â†’ báº¥m "LÄ©nh Ngá»™" Ä‘á»ƒ kÃ­ch hoáº¡t.`);
      addLog('ThÆ°Æ¡ng Há»™i BÃ­ Tá»‹ch', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua bÃ­ kÃ­p [${item.name}] (${item.grade}), cáº¥t vÃ o TÃºi Äá»“ chá» lÄ©nh ngá»™.`, 'merchant');
    } else if (itype === 'storage_bag') {
      const newCapacity = item.data?.maxSlots || item.bagCapacity || 35;
      const curMax = getMaxInventoryCapacity(player);
      if (newCapacity > curMax) {
        updated.storageBag = {
          id: item.id,
          name: item.name,
          grade: item.grade,
          maxSlots: newCapacity,
          price: 0,
          description: item.description
        };
        showToast(`ðŸŽ‰ ÄÃ£ mua vÃ  trang bá»‹ [${item.name}]! Sá»©c chá»©a TÃºi Äá»“ láº­p tá»©c tÄƒng lÃªn ${newCapacity >= 9999 ? 'VÃ” Háº N' : `${newCapacity} Ã´`}!`);
        addLog('ThÆ°Æ¡ng Há»™i Trá»¯ Váº­t', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua vÃ  trang bá»‹ [${item.name}], nÃ¢ng sá»©c chá»©a tÃºi lÃªn ${newCapacity >= 9999 ? 'VÃ” Háº N' : `${newCapacity} Ã´`}!`, 'merchant');
      } else {
        const existing = inv.bags.find(b => b.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          inv.bags.push({
            id: item.id,
            name: item.name,
            grade: item.grade,
            description: item.description,
            maxSlots: newCapacity,
            quantity: 1
          });
        }
        showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  bá» vÃ o TÃºi Äá»“!`);
        addLog('ThÆ°Æ¡ng Há»™i Trá»¯ Váº­t', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua [${item.name}], cáº¥t vÃ o TÃºi Äá»“.`, 'merchant');
      }
    } else if (itype === 'seed') {
      const seedHerbId = item.data?.seedId || item.id;
      const existing = inv.herbs.find(h => h.id === seedHerbId);
      if (existing) {
        existing.quantity += 1;
      } else {
        inv.herbs.push({
          id: seedHerbId,
          name: item.name,
          grade: item.grade,
          description: item.description,
          price: item.price,
          quantity: 1
        });
      }
      showToast(`âœ… ÄÃ£ mua [${item.name}] vÃ  bá» vÃ o TÃºi Äá»“! DÃ¹ng trong tab Linh Äiá»n Ä‘á»ƒ gieo trá»“ng.`);
      addLog('ThÆ°Æ¡ng Há»™i Háº¡t Giá»‘ng', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua háº¡t giá»‘ng [${item.name}], cáº¥t vÃ o TÃºi Äá»“.`, 'merchant');
    } else if (item.cultivationEffects || item.cultivationCategory || item.id.startsWith('cult_t')) {
      // Ãp dá»¥ng trá»±c tiáº¿p hiá»‡u á»©ng cá»§a Váº­t Pháº©m Tu Luyá»‡n Cá»­u Giai
      const useRes = useCultivationShopItem(updated, item.id, qty);
      if (useRes.success) {
        Object.assign(updated, useRes.updatedPlayer);
        showToast(`âœ… ÄÃ£ mua vÃ  kÃ­ch hoáº¡t [${item.name}]! ${useRes.message}`);
        addLog('ThÆ°Æ¡ng Há»™i Tu Luyá»‡n', `Chi ${effectivePrice.toLocaleString()} Linh Tháº¡ch sá»Ÿ há»¯u [${item.name}] x${qty}: ${useRes.message}`, 'cultivation');
      } else {
        showToast(useRes.message);
        return;
      }
    } else if (item.category === 'cultivation' || item.cultivationItemType) {
      inv.equipments.push({
        id: `cult_${item.id}_${Date.now()}`,
        name: item.name,
        slot: 'artifact',
        grade: (item.grade as EquipmentGrade) || 'Tam Giai',
        quality: item.quality || 'thuong_pham',
        enhancement: 0,
        powerBonus: 150,
        hpBonus: 500,
        mpBonus: 300,
        description: item.description
      });
      showToast(`âœ… ÄÃ£ mua báº£o váº­t [${item.name}] cáº¥t vÃ o TÃºi Trá»¯ Váº­t!`);
      addLog('ThÆ°Æ¡ng Há»™i Báº£o Váº­t', `Chi ${effectivePrice.toLocaleString()} Linh Tháº¡ch sá»Ÿ há»¯u báº£o váº­t [${item.name}], há»— trá»£ báº¿ quan thá»• náº¡p!`, 'cultivation');
    } else if (isTierManual) {
      // CÃ´ng PhÃ¡p BÃ­ Tá»‹ch Cá»­u Giai: LÄ©nh ngá»™ trá»±c tiáº¿p, vÄ©nh viá»…n
      const curLearned = updated.manualsState?.learnedManualIds || [];
      updated.manualsState = {
        learnedManualIds: curLearned.includes(item.id) ? curLearned : [...curLearned, item.id],
        equippedManualIds: updated.manualsState?.equippedManualIds || [],
      };
      playSfx?.('breakthrough');
      showToast(`ðŸŽ‰ LÄ©nh ngá»™ thÃ nh cÃ´ng tuyá»‡t ká»¹ [${item.name}]! Uy lá»±c chiáº¿n Ä‘áº¥u tÄƒng vá»t!`);
      addLog(
        'LÄ©nh Ngá»™ BÃ­ Tá»‹ch Cá»­u Giai',
        `Chi ${effectivePrice.toLocaleString()} Linh Tháº¡ch lÄ©nh ngá»™ tuyá»‡t há»c [${item.name}]. ToÃ n bá»™ thuá»™c tÃ­nh uy lá»±c Ä‘Ã£ Ä‘Æ°á»£c vÄ©nh viá»…n dung há»£p!`,
        'breakthrough'
      );
    } else if (isTierDivine) {
      // Tháº§n ThÃ´ng BÃ­ Thuáº­t Cá»­u Giai: Äáº¯c ngá»™ trá»±c tiáº¿p, vÄ©nh viá»…n
      const curLearned = updated.divineAbilitiesState?.learnedDivineIds || [];
      const updatedLearned = curLearned.includes(item.id) ? curLearned : [...curLearned, item.id];
      const curEquipped = updated.divineAbilitiesState?.equippedDivineIds || [];
      const maxSlots = getMaxDivineAbilitySlots(updated.currentRealm || 0);
      let updatedEquipped = [...curEquipped];
      let autoEquipNotice = '';

      if (updatedEquipped.length < maxSlots && !updatedEquipped.includes(item.id)) {
        updatedEquipped.push(item.id);
        autoEquipNotice = ` vÃ  tá»± Ä‘á»™ng bá»‘ trÃ­ vÃ o Ã” Tháº§n ThÃ´ng Xuáº¥t Chiáº¿n (${updatedEquipped.length}/${maxSlots})`;
      }

      updated.divineAbilitiesState = {
        learnedDivineIds: updatedLearned,
        equippedDivineIds: updatedEquipped,
      };
      playSfx?.('breakthrough');
      showToast(`ðŸŽ‰ Äáº¯c ngá»™ thÃ nh cÃ´ng Tháº§n ThÃ´ng [${item.name}]${autoEquipNotice}! Uy danh cháº¥n Ä‘á»™ng cá»­u thiÃªn!`);
      addLog(
        'Äáº¯c Ngá»™ Tháº§n ThÃ´ng Cá»­u Giai',
        `Chi ${effectivePrice.toLocaleString()} Linh Tháº¡ch Ä‘áº¯c ngá»™ tháº§n thÃ´ng [${item.name}] (${item.tierName || 'Cá»­u Giai'}). ${autoEquipNotice}`,
        'breakthrough'
      );
    } else {
      showToast(`ÄÃ£ mua [${item.name}]! (Loáº¡i: ${itype})`);
      addLog('ThÆ°Æ¡ng Há»™i Giao Dá»‹ch', `Chi ${effectivePrice.toLocaleString()} Linh tháº¡ch mua [${item.name}].`, 'merchant');
    }

    if (updated.merchantState?.items) {
      const isOneTime = isOneTimeMerchantItem(item);
      const currentPurchased = updated.merchantState.purchasedOneTimeIds || [];
      const newPurchased = [...currentPurchased];
      if (isOneTime) {
        if (!newPurchased.includes(item.id)) newPurchased.push(item.id);
        if (item.data?.manualId && !newPurchased.includes(item.data.manualId)) {
          newPurchased.push(item.data.manualId);
        }
      }

      updated.merchantState = {
        ...updated.merchantState,
        purchasedOneTimeIds: newPurchased,
        items: updated.merchantState.items.map(it => {
          if (it.id === item.id) {
            const nextStock = Math.max(0, it.stock - qty);
            return {
              ...it,
              stock: nextStock,
              isSoldOutPermanent: isOneTime ? true : it.isSoldOutPermanent
            };
          }
          return it;
        })
      };
    }

    updated.inventory = inv;
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  // Trang bá»‹ tÃºi trá»¯ váº­t
  const handleEquipBagFromInventory = (bag: { id: string; name: string; maxSlots: number; grade: string; description: string }) => {
    const curMax = getMaxInventoryCapacity(player);
    if (bag.maxSlots <= curMax) {
      showToast(`TÃºi trá»¯ váº­t hiá»‡n táº¡i (${curMax >= 9999 ? 'VÃ” Háº N' : `${curMax} Ã´`}) Ä‘Ã£ tá»‘t hÆ¡n hoáº·c báº±ng [${bag.name}]!`);
      return;
    }
    const updated = { ...player };
    const inv = {
      ...updated.inventory,
      pills: updated.inventory?.pills || [],
      herbs: updated.inventory?.herbs || [],
      ores: updated.inventory?.ores || [],
      equipments: updated.inventory?.equipments || [],
      manuals: updated.inventory?.manuals || [],
      books: updated.inventory?.books || [],
      bags: (updated.inventory?.bags || []).map(b =>
        b.id === bag.id ? { ...b, quantity: Math.max(0, b.quantity - 1) } : b
      ).filter(b => b.quantity > 0)
    };
    updated.storageBag = {
      id: bag.id,
      name: bag.name,
      grade: bag.grade,
      maxSlots: bag.maxSlots,
      price: 0,
      description: bag.description
    };
    updated.inventory = inv;
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`ðŸŽ‰ ÄÃ£ trang bá»‹ [${bag.name}]! Sá»©c chá»©a TÃºi Äá»“ tÄƒng lÃªn ${bag.maxSlots >= 9999 ? 'VÃ” Háº N' : `${bag.maxSlots} Ã´`}!`);
    addLog('Trang Bá»‹ TÃºi Trá»¯ Váº­t', `Láº¥y [${bag.name}] ra khá»i tÃºi Ä‘á»“ vÃ  trang bá»‹, nÃ¢ng dung tÃ­ch lÃªn ${bag.maxSlots >= 9999 ? 'VÃ” Háº N' : `${bag.maxSlots} Ã´`}!`, 'merchant');
  };

  // Trang bá»‹ phÃ¡p báº£o
  const handleEquipEquipment = (eq: Equipment) => {
    const updated = { ...player };
    if (!updated.equipment) updated.equipment = {};
    const old = updated.equipment[eq.slot];
    updated.equipment[eq.slot] = eq;
    if (updated.inventory?.equipments) {
      updated.inventory.equipments = updated.inventory.equipments.filter(x => x.id !== eq.id);
      if (old) updated.inventory.equipments.push(old);
    }
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`ÄÃ£ trang bá»‹ [${eq.name}]!`);
  };

  // LÄ©nh ngá»™ bÃ­ kÃ­p / sÃ¡ch
  const handleLearnBookFromInventory = (book: { id: string; name: string; itemType: string; unlockArtisan?: 'alchemy' | 'forging'; manualId?: string; grade: string; description: string }) => {
    const updated = { ...player };
    const inv = {
      ...updated.inventory,
      pills: updated.inventory?.pills || [],
      herbs: updated.inventory?.herbs || [],
      ores: updated.inventory?.ores || [],
      equipments: updated.inventory?.equipments || [],
      manuals: updated.inventory?.manuals || [],
      books: (updated.inventory?.books || []).map(b =>
        b.id === book.id ? { ...b, quantity: Math.max(0, b.quantity - 1) } : b
      ).filter(b => b.quantity > 0),
      bags: updated.inventory?.bags || []
    };

    if (book.itemType === 'artisan_book' && book.unlockArtisan) {
      const artisanType = book.unlockArtisan;
      if (artisanType === 'alchemy') {
        if (updated.alchemyArtisan?.unlocked) {
          showToast('Äan Äáº¡o Ä‘Ã£ Ä‘Æ°á»£c khai má»Ÿ rá»“i!');
          return;
        }
        updated.alchemyArtisan = updated.alchemyArtisan
          ? { ...updated.alchemyArtisan, unlocked: true }
          : createDefaultArtisanState('alchemy', true);
        showToast('ðŸŒŸ Khai má»Ÿ thÃ nh cÃ´ng Äan Äáº¡o! Báº¡n Ä‘Ã£ trá»Ÿ thÃ nh SÆ¡ Cáº¥p Luyá»‡n Äan SÆ°!');
        addLog('Khai Má»Ÿ Äan Äáº¡o', `LÄ©nh ngá»™ [${book.name}], khai má»Ÿ Luyá»‡n Äan CÃ¡c vÃ  tiáº¿p nháº­n Ä‘áº¡o thá»‘ng Äan Äáº¡o!`, 'alchemy');
      } else if (artisanType === 'forging') {
        if (updated.forgingArtisan?.unlocked) {
          showToast('KhÃ­ Äáº¡o Ä‘Ã£ Ä‘Æ°á»£c khai má»Ÿ rá»“i!');
          return;
        }
        updated.forgingArtisan = updated.forgingArtisan
          ? { ...updated.forgingArtisan, unlocked: true }
          : createDefaultArtisanState('forging', true);
        showToast('ðŸŒŸ Khai má»Ÿ thÃ nh cÃ´ng KhÃ­ Äáº¡o! Báº¡n Ä‘Ã£ trá»Ÿ thÃ nh SÆ¡ Cáº¥p Luyá»‡n KhÃ­ SÆ°!');
        addLog('Khai Má»Ÿ KhÃ­ Äáº¡o', `LÄ©nh ngá»™ [${book.name}], khai má»Ÿ Luyá»‡n KhÃ­ PhÃ²ng vÃ  tiáº¿p nháº­n Ä‘áº¡o thá»‘ng KhÃ­ Äáº¡o!`, 'forging');
      }
      if (!updated.learnedManuals?.includes(book.id)) {
        updated.learnedManuals = [...(updated.learnedManuals || []), book.id];
      }
    } else {
      const manualId = book.manualId || book.id;
      const mDef = DEFAULT_MANUALS.find(m => m.id === manualId) || {
        id: manualId,
        name: book.name,
        type: 'tam_phap' as const,
        grade: 'Huyá»n Giai' as const,
        description: book.description,
        level: 1,
        maxLevel: 10,
        tuViPerLevel: 100,
        linhThachPerLevel: 50,
        minNgoTinh: 0,
        maxLevelPassive: {
          name: 'ViÃªn MÃ£n Ã Cáº£nh',
          description: 'LÄ©nh ngá»™ Ä‘áº¡i viÃªn mÃ£n, gia tÄƒng tu vi vÃ  linh lá»±c dá»“i dÃ o.'
        }
      };
      if (!updated.manuals) updated.manuals = [];
      const alreadyLearned = updated.manuals.some(m => m.id === manualId) || updated.learnedManuals?.includes(manualId);
      if (alreadyLearned) {
        showToast(`ÄÃ£ lÄ©nh ngá»™ bÃ­ tá»‹ch [${book.name}] rá»“i!`);
        return;
      }
      updated.manuals.push({ ...mDef, level: 1 });
      if (!updated.learnedManuals?.includes(manualId)) {
        updated.learnedManuals = [...(updated.learnedManuals || []), manualId];
      }
      showToast(`ðŸŒŸ LÄ©nh ngá»™ thÃ nh cÃ´ng [${book.name}]! CÃ´ng phÃ¡p Ä‘Ã£ Ä‘Æ°á»£c ghi vÃ o Tháº§n Háº£i.`);
      addLog('LÄ©nh Ngá»™ BÃ­ Tá»‹ch', `Äá»c thÃ´ng vÃ  lÄ©nh ngá»™ [${book.name}] (${book.grade}), cÃ´ng phÃ¡p ghi kháº¯c vÃ o Tháº§n Háº£i vÄ©nh cá»­u!`, 'alchemy');
    }

    updated.inventory = inv;
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  // LÃ m má»›i thÆ°Æ¡ng há»™i
  const handleRefreshMerchant = (free: boolean = false) => {
    if (!free && player.linhThach < REFRESH_MERCHANT_COST_LT) {
      showToast(`KhÃ´ng Ä‘á»§ linh tháº¡ch má»i ThÆ°Æ¡ng Há»™i Ä‘á»•i hÃ ng! Cáº§n ${REFRESH_MERCHANT_COST_LT} linh tháº¡ch.`);
      return;
    }

    const updated = { ...player };
    if (!free) {
      updated.linhThach -= REFRESH_MERCHANT_COST_LT;
    }

    const newItems = generateMerchantInventory(updated);
    updated.merchantState = {
      lastRefreshTime: Date.now(),
      lastDailyRefreshTime: free ? Date.now() : (player.merchantState?.lastDailyRefreshTime || Date.now()),
      refreshCountToday: free ? 0 : ((player.merchantState?.refreshCountToday || 0) + 1),
      purchasedOneTimeIds: player.merchantState?.purchasedOneTimeIds || [],
      currentStock: {},
      items: newItems
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    if (free) {
      showToast('âœ¨ ThÆ°Æ¡ng Há»™i Ä‘Ã£ tá»± Ä‘á»™ng lÃ m má»›i hÃ ng hÃ³a miá»…n phÃ­ hÃ´m nay!');
      addLog('ThÆ°Æ¡ng Há»™i Äá»•i LÃ´ HÃ ng', 'ThÆ°Æ¡ng Há»™i Ä‘Ã£ cáº­p báº¿n lÃ´ hÃ ng má»›i ngÃ y hÃ´m nay!', 'merchant');
    } else {
      showToast('âœ¨ ThÆ°Æ¡ng Há»™i Ä‘Ã£ Ä‘iá»u chuyá»ƒn má»™t Ä‘á»£t hÃ ng hÃ³a má»›i!');
      addLog('ThÆ°Æ¡ng Há»™i Äá»•i LÃ´ HÃ ng', 'ThÆ°Æ¡ng Ä‘á»™i Váº¡n Báº£o ThÆ°Æ¡ng Há»™i Ä‘Ã£ cáº­p báº¿n lÃ´ trÃ¢n pháº©m má»›i.', 'merchant');
    }
  };

  // BÃ¡n 1 váº­t pháº©m
  const handleSellItem = (type: 'pill' | 'herb' | 'ore' | 'equipment', id: string, amount: number = 1) => {
    const updated = { ...player };
    const inv = updated.inventory || { pills: [], herbs: [], ores: [], equipments: [] };
    let soldItemName = '';
    let unitPrice = 10;

    if (type === 'pill') {
      const p = (inv.pills || []).find(x => x.id === id);
      if (!p || p.quantity < amount) return;
      soldItemName = p.name;
      unitPrice = calculateSellPrice(p);
      p.quantity -= amount;
      if (p.quantity <= 0) inv.pills = inv.pills.filter(x => x.id !== id);
    } else if (type === 'herb') {
      const h = (inv.herbs || []).find((x: Herb) => x.id === id);
      if (!h || h.quantity < amount) return;
      soldItemName = h.name;
      unitPrice = calculateSellPrice(h);
      h.quantity -= amount;
      if (h.quantity <= 0) inv.herbs = inv.herbs.filter((x: Herb) => x.id !== id);
    } else if (type === 'ore') {
      const o = (inv.ores || []).find(x => x.id === id);
      if (!o || o.quantity < amount) return;
      soldItemName = o.name;
      unitPrice = calculateSellPrice(o);
      o.quantity -= amount;
      if (o.quantity <= 0) inv.ores = inv.ores.filter(x => x.id !== id);
    } else if (type === 'equipment') {
      const equipments = inv.equipments || [];
      const eqIdx = equipments.findIndex(x => x.id === id);
      if (eqIdx === -1) return;
      soldItemName = equipments[eqIdx].name;
      unitPrice = calculateSellPrice(equipments[eqIdx]);
      equipments.splice(eqIdx, 1);
      inv.equipments = equipments;
    }

    const totalEarn = unitPrice * amount;
    updated.linhThach += totalEarn;
    updated.inventory = inv;

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`ÄÃ£ thanh lÃ½ ${amount}x [${soldItemName}] thu vá» +${totalEarn.toLocaleString()} Linh tháº¡ch!`);
    addLog('Thu Há»“i Linh Váº­t', `BÃ¡n ${amount}x [${soldItemName}] cho Váº¡n Báº£o ThÆ°Æ¡ng Há»™i, thu vá» +${totalEarn.toLocaleString()} Linh tháº¡ch.`, 'merchant');
  };

  // BÃ¡n táº¥t cáº£ dÆ°á»£c khoÃ¡ng cÆ¡ báº£n
  const handleSellAllBasicItems = () => {
    const inv = player.inventory;
    if (!inv) return;

    let totalEarn = 0;
    let itemsCount = 0;

    (inv.herbs || []).forEach((h: Herb) => {
      if (h.quantity > 0) {
        totalEarn += calculateSellPrice(h) * h.quantity;
        itemsCount += h.quantity;
      }
    });

    (inv.ores || []).forEach(o => {
      if (o.quantity > 0) {
        totalEarn += calculateSellPrice(o) * o.quantity;
        itemsCount += o.quantity;
      }
    });

    if (itemsCount === 0) {
      showToast('KhÃ´ng cÃ³ dÆ°á»£c liá»‡u hay khoÃ¡ng tháº¡ch nÃ o Ä‘á»ƒ thanh lÃ½!');
      return;
    }

    const updated = { ...player };
    updated.linhThach += totalEarn;
    if (updated.inventory) {
      updated.inventory.herbs = [];
      updated.inventory.ores = [];
    }

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`âš¡ Thanh lÃ½ toÃ n bá»™ ${itemsCount} dÆ°á»£c khoÃ¡ng, thu vá» +${totalEarn.toLocaleString()} Linh tháº¡ch!`);
    addLog('ThÆ°Æ¡ng Há»™i Thu Há»“i HÃ ng Loáº¡t', `Thanh lÃ½ ${itemsCount} váº­t liá»‡u cÆ¡ báº£n, thu vá» +${totalEarn.toLocaleString()} Linh tháº¡ch, giáº£i phÃ³ng toÃ n bá»™ sá»©c chá»©a!`, 'merchant');
  };

  // Sáº¯p xáº¿p tÃºi Ä‘á»“
  const handleSortInventory = () => {
    const updated = { ...player };
    if (!updated.inventory) return;

    const pillGradeOrder: Record<string, number> = {
      'Tháº§n Pháº©m': 6,
      'NgÅ© Pháº©m': 5,
      'Tá»© Pháº©m': 4,
      'Tam Pháº©m': 3,
      'Nhá»‹ Pháº©m': 2,
      'Nháº¥t Pháº©m': 1
    };

    if (updated.inventory.pills) {
      updated.inventory.pills = updated.inventory.pills
        .filter(p => p.quantity > 0)
        .sort((a, b) => (pillGradeOrder[b.grade] || 0) - (pillGradeOrder[a.grade] || 0));
    }
    if (updated.inventory.herbs) {
      updated.inventory.herbs = updated.inventory.herbs
        .filter((h: Herb) => h.quantity > 0)
        .sort((a: Herb, b: Herb) => (b.price || 0) - (a.price || 0));
    }
    if (updated.inventory.ores) {
      updated.inventory.ores = updated.inventory.ores
        .filter(o => o.quantity > 0)
        .sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast('âœ¨ ÄÃ£ sáº¯p xáº¿p láº¡i TÃºi Trá»¯ Váº­t ngÄƒn náº¯p!');
  };

  const handleBuyAndLearnManual = (manualItem: MerchantItem) => {
    handleBuyMerchantItem(manualItem, 1);
  };

  const handleBuyAndLearnDivineAbility = (item: any) => {
    const divineItem = item.divineAbility || DIVINE_SHOP_ITEMS_MAP[item.id] || item;
    const res = buyAndLearnDivineAbility(player, divineItem);
    if (!res.success) {
      showToast(res.message);
      return;
    }
    if (res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      playSfx?.('breakthrough');
      showToast(res.message);
      addLog('Äáº¯c Ngá»™ Tháº§n ThÃ´ng Cá»­u Giai', res.message, 'breakthrough');
    }
  };

  const handleEquipDivineAbility = (abilityId: string) => {
    const res = equipDivineAbility(player, abilityId);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      addLog('Bá»‘ TrÃ­ Tháº§n ThÃ´ng Xuáº¥t Chiáº¿n', res.message, 'combat');
    }
  };

  const handleUnequipDivineAbility = (abilityId: string) => {
    const res = unequipDivineAbility(player, abilityId);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      addLog('ThÃ¡o Gá»¡ Tháº§n ThÃ´ng Xuáº¥t Chiáº¿n', res.message, 'combat');
    }
  };

  const handleBuyHerbsBatch = (herbItem: HerbShopItem, quantity: number) => {
    const res = buyHerbsBatch(player, herbItem, quantity);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      playSfx?.('alchemy');
      addLog('Thu Mua DÆ°á»£c Tháº£o', res.message, 'merchant');
    }
  };

  const handleBuyOresBatch = (oreItem: OreShopItem, quantity: number) => {
    const res = buyOresBatch(player, oreItem, quantity);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      playSfx?.('refine');
      addLog('Thu Mua Khoang Thach', res.message, 'merchant');
    }
  };

  const handleBuyEquipment = (equipItem: EquipmentShopItem, autoEquip: boolean = false) => {
    const res = buyEquipmentItem(player, equipItem, autoEquip);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      if (autoEquip) {
        playSfx?.('breakthrough');
        addLog('Trang Bị Thần Binh', res.message, 'merchant');
      } else {
        playSfx?.('craft');
        addLog('Thu Mua Trang Bị', res.message, 'merchant');
      }
    }
  };

  const handleRecruitCompanion = (companionItem: CompanionShopItem) => {
    const res = recruitCompanionFromShop(player, companionItem);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      playSfx?.('breakthrough');
      addLog('Tiên Duyên Kết Định', `[KẾT DUYÊN] Đạo hữu đã giải cứu và đón nhận [${companionItem.name}] về Động Phủ!`, 'companion');
    }
  };

  const handleRecruitBeast = (beastItem: BeastShopItem) => {
    const res = recruitBeastFromShop(player, beastItem);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      playSfx?.('breakthrough');
      addLog('Thuần Hóa Thần Thú', `[THUẦN HÓA] Đạo hữu đã ký kết khế ước linh hồn cùng Thần Thú [${beastItem.name}]!`, 'event');
    }
  };

  const handleSetActiveCombatBeast = (beastId: string) => {
    const isCurrent = player.beastsState?.activeCombatBeastId === beastId;
    const targetId = isCurrent ? null : beastId;
    const updated = setActiveCombatBeast(player, targetId);
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    playSfx?.('click');
    if (targetId) {
      showToast(`Đã phái Thần Thú xuất chiến!`);
      addLog('Thần Thú Xuất Chiến', `Đã chỉ định thần thú tham chiến cùng đạo hữu!`, 'event');
    } else {
      showToast(`Đã thu hồi Thần Thú xuất chiến.`);
    }
  };

  const handleSetActiveMountBeast = (beastId: string) => {
    const isCurrent = player.beastsState?.activeMountBeastId === beastId;
    const targetId = isCurrent ? null : beastId;
    const updated = setActiveMountBeast(player, targetId);
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    playSfx?.('click');
    if (targetId) {
      showToast(`Đã cưỡi Thần Hành Tọa Kỵ!`);
      addLog('Thần Hành Tọa Kỵ', `Đã cưỡi tọa kỵ, tốc độ du ngoạn bí cảnh gia tăng mạnh!`, 'event');
    } else {
      showToast(`Đã xuống tọa kỵ.`);
    }
  };

  const handleUnlockStorage = (storageItem: StorageShopItem) => {
    const res = buyAndUnlockStorage(player, storageItem);
    showToast(res.message);
    if (res.success && res.updatedPlayer) {
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      playSfx?.('breakthrough');
      addLog('Càn Khôn Trữ Vật', `[CÀN KHÔN] Đạo hữu đã luyện hóa [${storageItem.name}], mở rộng không gian trữ vật!`, 'event');
    }
  };

  return {
    merchantSubTab,
    setMerchantSubTab,
    inventoryFilter,
    setInventoryFilter,
    showInventoryModal,
    setShowInventoryModal,
    handleExchangeLinhThach,
    handleBuyMerchantItem,
    handleBuyAndLearnManual,
    handleBuyAndLearnDivineAbility,
    handleEquipDivineAbility,
    handleUnequipDivineAbility,
    handleBuyHerbsBatch,
    handleBuyOresBatch,
    handleBuyEquipment,
    handleRecruitCompanion,
    handleRecruitBeast,
    handleSetActiveCombatBeast,
    handleSetActiveMountBeast,
    handleUnlockStorage,
    handleRefreshMerchant,
    handleSellItem,
    handleSellAllBasicItems,
    handleSortInventory,
    handleEquipBagFromInventory,
    handleEquipEquipment,
    handleLearnBookFromInventory
  };
}
