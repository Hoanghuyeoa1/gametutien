import { useState } from 'react';
import {
  PlayerStats,
  Herb,
  DanRecipe,
  Pill,
  Ore,
  Equipment,
  EquipmentSlot,
  PillGrade,
  ItemQuality,
  LogType,
  ForgingMainTab
} from '@/lib/types';
import {
  ARTISAN_TITLES,
  ARTISAN_PERKS,
  createDefaultArtisanState,
  addArtisanExp,
  canAddItemToInventory,
  getInventoryUsedSlots,
  getMaxInventoryCapacity,
  getCurrentInventoryOccupiedSlots
} from '@/lib/inventory-data';
import { checkArtisanCraftRequirement } from '@/lib/artisan-lock-logic';
import {
  rollAlchemyQuality,
  rollForgingQuality,
  getItemQuality,
  getItemQualityMultiplier,
  convertGradeToGiai,
  formatItemFullName,
  ITEM_QUALITIES
} from '@/lib/item-quality-data';
import { getBaseLifespanForRealm } from '@/lib/lifespan-logic';
import { PILL_TEMPLATES, EQUIP_RECIPES } from '@/lib/alchemy-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { audioEngine } from '@/lib/audio-engine';
import { getMaxKhiHuyet, getMaxLinhLuc, generateRandomLinhCan, getMaxStatLimit } from '@/lib/game-logic';
import { STORAGE_KEY, normalizePlayerData } from '@/lib/save-migration';
import { usePillItem } from '@/lib/pill-consumption-logic';
import { consumeVeinedPill } from '@/lib/pill-vein-logic';
import { PILL_DEFINITIONS_MAP } from '@/lib/pill-tier-data';
import {
  punchEquipmentSocket,
  inlayGemToSocket,
  removeGemFromSocket,
  toggleAffixLock,
  reforgeEquipmentAffixes,
  reforgeEquipmentWithEssence,
  canDismantleEquipment,
  getEquipQualityKey,
  executeDismantleBatch
} from '@/lib/forging-logic';
import {
  assessPillRecipeSupply,
  assessForgeRecipeSupply,
  executeBatchSupplyPurchase,
  CraftingSupplyAssessment
} from '@/lib/crafting-supply-logic';

interface UseCraftingActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  openDestinyModal?: () => void;
}

export function useCraftingActions({
  player,
  setPlayer,
  addLog,
  showToast,
  openDestinyModal
}: UseCraftingActionsParams) {
  const [alchemySubTab, setAlchemySubTab] = useState<'cauldron' | 'tactics' | 'market' | 'pills' | 'flames' | 'custom_recipe'>('cauldron');
  const [forgingMainTab, setForgingMainTab] = useState<ForgingMainTab>('forge');
  const [forgingSubTab, setForgingSubTab] = useState<'equipped' | 'forge' | 'ores' | 'modular' | 'inscription' | 'soul_infusion' | 'legacy_tempering' | 'tribulation_array'>('equipped');
  const [selectedDismantleIds, setSelectedDismantleIds] = useState<string[]>([]);
  const [useEssenceReforge, setUseEssenceReforge] = useState<boolean>(false);

  // Xuất Thiết Thần Binh & Thu Hoạch Modal State
  const [forgedEquipmentResult, setForgedEquipmentResult] = useState<Equipment | null>(null);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState<boolean>(false);
  const [isForging, setIsForging] = useState<boolean>(false);

  const handleToggleEssenceReforge = (val?: boolean) => {
    setUseEssenceReforge(prev => (typeof val === 'boolean' ? val : !prev));
  };

  // Mua thảo dược
  const handleBuyHerb = (herb: Herb) => {
    if (player.linhThach < herb.price) {
      showToast(`Linh thạch không đủ! Cần ${herb.price} linh thạch.`);
      return;
    }

    const updated = { ...player };
    updated.linhThach -= herb.price;
    const inv = updated.inventory || { pills: [], herbs: [], ores: [] };
    const existing = inv.herbs.find(h => h.id === herb.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      inv.herbs.push({ ...herb, quantity: 1 });
    }
    updated.inventory = inv;

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`Đã mua 1 ${herb.name}!`);
    addLog('Dược Phố Giao Dịch', `Tiêu hao ${herb.price} Linh thạch mua 1 cành ${herb.name}.`, 'alchemy');
  };

  // 1-Click Mua Đủ Thiếu Hụt nguyên liệu chế tác
  const handleBuyMissingMaterials = (assessment: CraftingSupplyAssessment): boolean => {
    const result = executeBatchSupplyPurchase(player, assessment);
    if (!result.success) {
      showToast(`⚠️ ${result.message}`);
      return false;
    }
    const normalized = normalizePlayerData(result.updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    audioEngine.playSFX('alchemy');
    showToast(`⚡ ${result.message}`);
    addLog(
      'Mua Bù Nguyên Liệu',
      `Đã chi trả ${assessment.totalCostLinhThach.toLocaleString()} Linh Thạch mua đủ nguyên liệu thiếu cho [${assessment.recipeName}].`,
      'merchant'
    );
    return true;
  };

  // Toggle Tự động mua thiếu bằng Linh Thạch
  const handleToggleAutoBuySupply = (checked?: boolean) => {
    const currentVal = Boolean(player.craftingSupplySettings?.autoBuyMissing);
    const newVal = checked !== undefined ? checked : !currentVal;
    const updated: PlayerStats = {
      ...player,
      craftingSupplySettings: {
        autoBuyMissing: newVal
      }
    };
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(newVal ? '✓ Đã BẬT tự động mua nguyên liệu khi chế tác!' : '✕ Đã TẮT tự động mua nguyên liệu khi chế tác!');
  };

  // Khai lò luyện đan
  const handleCraftPill = (recipe: DanRecipe) => {
    if (!player.alchemyArtisan?.unlocked) {
      showToast('Chưa khai ngộ đan đạo! Cần lĩnh ngộ [Thái Thượng Đan Kinh Tàn Quyển] để mở lò Luyện Đan.');
      return;
    }

    const artisanLevel = player.alchemyArtisan?.level || 1;
    const perks = ARTISAN_PERKS[artisanLevel];
    if (!perks.allowedGrades.includes(recipe.grade)) {
      showToast(`Đẳng cấp đan sĩ hiện tại (${ARTISAN_TITLES.alchemy[artisanLevel]}) chưa đủ trình độ luyện [${recipe.grade}]!`);
      return;
    }

    // Kiểm tra khóa theo cảnh giới Khí Tu
    const craftCheck = checkArtisanCraftRequirement(player.currentRealm, recipe.grade);
    if (!craftCheck.canCraft) {
      showToast(craftCheck.reason || `🔒 Cần đạt [${craftCheck.requiredRealmName}] để luyện chế đan dược này!`);
      return;
    }

    let activePlayer = player;
    const supply = assessPillRecipeSupply(activePlayer, recipe, 1);

    if (!supply.isFullySupplied) {
      if (player.craftingSupplySettings?.autoBuyMissing) {
        if (!supply.canExecuteAutoPurchase) {
          if (supply.hasUnmetRealmGating) {
            const unmet = supply.missingItems.find(i => !i.canPurchaseAtCurrentRealm);
            showToast(`🔒 Chưa đủ cảnh giới! Cần đạt [${unmet?.requiredRealmName || 'Cảnh giới cao hơn'}] để mua [${unmet?.name || 'nguyên liệu'}] tại Thương Hội!`);
            return;
          }
          if (!supply.hasEnoughLinhThach) {
            showToast(`Linh thạch không đủ để tự động mua nguyên liệu! Cần ${supply.totalCostLinhThach.toLocaleString()} LT.`);
            return;
          }
          showToast('Không đủ điều kiện để tự động mua nguyên liệu thiếu!');
          return;
        }

        // Tự động mua nguyên liệu thiếu
        const buyResult = executeBatchSupplyPurchase(activePlayer, supply);
        if (!buyResult.success) {
          showToast(`⚠️ Tự động mua thất bại: ${buyResult.message}`);
          return;
        }
        activePlayer = buyResult.updatedPlayer;
        addLog(
          'Tự Động Cung Ứng',
          `Tự động mua nguyên liệu còn thiếu cho đơn luyện [${recipe.name}]: Tiêu hao ${supply.totalCostLinhThach.toLocaleString()} Linh Thạch.`,
          'merchant'
        );
      } else {
        // Kiểm tra nguyên liệu thủ công khi không bật autoBuy
        const invHerbs = activePlayer.inventory?.herbs || [];
        for (const req of recipe.herbsRequired) {
          const owned = invHerbs.find(h => h.id === req.herbId)?.quantity || 0;
          if (owned < req.count) {
            showToast(`Không đủ ${req.herbName}! Cần ${req.count}, hiện có ${owned}.`);
            return;
          }
        }
      }
    }

    const usedSlots = getCurrentInventoryOccupiedSlots(activePlayer);
    const currentMaxSlots = getMaxInventoryCapacity(activePlayer);
    if (!canAddItemToInventory(activePlayer, currentMaxSlots, 'pill', recipe.pillId)) {
      showToast(`⚠️ Túi Trữ Vật đã đầy (${usedSlots}/${currentMaxSlots >= 9999 ? '∞' : currentMaxSlots})! Không thể chứa thêm đan dược mới.`);
      return;
    }

    if (activePlayer.linhThach < recipe.linhThachCost) {
      showToast(`Không đủ linh thạch mồi lửa! Cần ${recipe.linhThachCost} linh thạch.`);
      return;
    }

    const inv = activePlayer.inventory || { pills: [], herbs: [], ores: [] };
    // Kiểm tra nguyên liệu
    for (const req of recipe.herbsRequired) {
      const owned = inv.herbs.find(h => h.id === req.herbId)?.quantity || 0;
      if (owned < req.count) {
        showToast(`Không đủ ${req.herbName}! Cần ${req.count}, hiện có ${owned}.`);
        return;
      }
    }

    // Tiêu hao nguyên liệu & linh thạch
    const updated = { ...activePlayer };
    updated.linhThach -= recipe.linhThachCost;
    recipe.herbsRequired.forEach((req: { herbId: string; count: number }) => {
      const h = inv.herbs.find(x => x.id === req.herbId);
      if (h) h.quantity -= req.count;
    });

    const compBuffs = getBondedCompanionBuffs(player);
    const companionAlchemyBonus = compBuffs.alchemySuccessBonus || 0;
    const baseSuccess = recipe.baseSuccessRate + Math.floor((player.ngoTinh - 50) * 0.3) + Math.floor((player.khiVan - 50) * 0.2) + perks.successBonus + companionAlchemyBonus;
    const successRate = Math.min(98, Math.max(25, baseSuccess));
    const roll = Math.random() * 100;
    const success = roll < successRate;
    audioEngine.playAlchemyFurnaceSound(1.0);

    if (success) {
      const currentArtisan = player.alchemyArtisan || createDefaultArtisanState('alchemy', true);
      const rolledQuality: ItemQuality = rollAlchemyQuality(
        player.ngoTinh,
        currentArtisan.level || 1,
        player.soulCultivation?.realmIndex || 0
      );
      const qualityInfo = getItemQuality(rolledQuality);
      const isCritical = Math.random() * 100 < perks.critChance;
      const pillGain = isCritical ? 2 : 1;
      const displayGiai = convertGradeToGiai(recipe.grade);

      const existingPill = inv.pills.find(p => p.id === recipe.pillId && (p.quality || 'thuong_pham') === rolledQuality);
      let pillDef: Pill;
      if (PILL_TEMPLATES[recipe.pillId]) {
        pillDef = {
          ...PILL_TEMPLATES[recipe.pillId],
          grade: displayGiai,
          quality: rolledQuality,
          quantity: pillGain
        };
      } else {
        pillDef = {
          id: recipe.pillId,
          name: recipe.pillName,
          grade: displayGiai,
          quality: rolledQuality,
          description: recipe.description,
          effectType: 'breakthrough_bonus',
          effectValue: 20,
          quantity: pillGain
        };
      }

      if (existingPill) {
        existingPill.quantity += pillGain;
      } else {
        inv.pills.push(pillDef);
      }

      const expGain = (recipe.grade.includes('Nhất') || recipe.grade.includes('1')) ? 15 :
        (recipe.grade.includes('Nhị') || recipe.grade.includes('2')) ? 30 :
        (recipe.grade.includes('Tam') || recipe.grade.includes('3')) ? 60 :
        (recipe.grade.includes('Tứ') || recipe.grade.includes('4')) ? 120 :
        (recipe.grade.includes('Ngũ') || recipe.grade.includes('5')) ? 250 : 500;

      const { updated: updatedArtisan, leveledUp, newLevel } = addArtisanExp(currentArtisan, 'alchemy', expGain, isCritical, player.currentRealm);
      updated.alchemyArtisan = updatedArtisan;

      if (updated.sectState?.dailyQuests) {
        const q = updated.sectState.dailyQuests.find(quest => quest.category === 'alchemy' && !quest.isCompleted);
        if (q) {
          q.currentCount = Math.min(q.targetCount, q.currentCount + 1);
          if (q.currentCount >= q.targetCount) q.isCompleted = true;
        }
      }

      updated.inventory = inv;
      updated.achievementsState = {
        ...updated.achievementsState,
        claimedAchievementIds: updated.achievementsState?.claimedAchievementIds || [],
        unlockedTitleIds: updated.achievementsState?.unlockedTitleIds || [],
        stats: {
          ...updated.achievementsState?.stats,
          pillsCrafted: (updated.achievementsState?.stats?.pillsCrafted || 0) + pillGain
        }
      };
      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      const fullName = formatItemFullName(recipe.pillName, displayGiai, rolledQuality);
      if (leveledUp && newLevel) {
        showToast(`🎉 BÁCH NGHỆ THĂNG HOA! Ngươi đã tấn thăng [${ARTISAN_TITLES.alchemy[newLevel]}]!`);
      }
      if (isCritical) {
        showToast(`🌟 [ĐAN KHÍ NGHỊCH THIÊN] Luyện thành x2 viên [${fullName}]!`);
      } else {
        showToast(`🎉 Luyện đan thành công! Thu hoạch 1 viên [${fullName}] (+${expGain} EXP)!`);
      }

      addLog(
        isCritical ? 'Luyện Ra Đan Dược Nghịch Thiên' : 'Khai Lò Luyện Đan',
        `Khai lò luyện thành ${pillGain} viên ${fullName} (Hệ số x${qualityInfo.multiplier}). Tăng +${expGain} EXP Đan Đạo${isCritical ? ' (Kích hoạt bạo kích x2 viên)' : ''}.`,
        'alchemy'
      );
    } else {
      updated.inventory = inv;
      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast('❌ Nổ lò luyện đan! Dược liệu cháy thành tro bụi!');
      addLog(
        'Nổ Lò Luyện Đan',
        `Hỏa hầu không đều, một tiếng 'Oành' vang lên trong lò! Dược liệu tan thành mây khói đen kịt...`,
        'danger'
      );
    }
  };

  // Uống đan dược
  const handleConsumePill = (pill: Pill) => {
    if (pill.quantity <= 0) return;

    // Đan Dược Đan Văn & Dược Tính Biến Dị (Pill Veins System)
    if (pill.veinMetadata || pill.isMutated) {
      const result = consumeVeinedPill(player, pill);
      if (!result.success) {
        showToast(result.message);
        return;
      }
      audioEngine.playSFX('alchemy');
      const normalized = normalizePlayerData(result.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(result.message);
      addLog('Phục Dược Đan Văn', result.message, result.logType as any);
      return;
    }

    // Đan Dược Cửu Giai (Tier 1 -> Tier 9)
    if (PILL_DEFINITIONS_MAP[pill.id] || pill.id.startsWith('pill_tier')) {
      const result = usePillItem(player, pill, 1);
      if (!result.success) {
        showToast(result.message);
        return;
      }
      audioEngine.playSFX('alchemy');
      const normalized = normalizePlayerData(result.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(result.message);
      addLog('Phục Dược Cửu Giai', result.message, (result.logType || 'alchemy') as any);
      return;
    }

    if (pill.effectType === 'destiny_reroll') {
      if (openDestinyModal) openDestinyModal();
      showToast('Đã mở pháp đàn Nghịch Thiên Cải Mệnh!');
      return;
    }

    const updated = { ...player };
    const inv = updated.inventory || { pills: [], herbs: [], ores: [] };
    const targetPill = inv.pills.find(p => p.id === pill.id && (p.quality || 'thuong_pham') === (pill.quality || 'thuong_pham'))
      || inv.pills.find(p => p.id === pill.id);
    if (!targetPill || targetPill.quantity <= 0) return;

    targetPill.quantity -= 1;
    if (targetPill.quantity <= 0) {
      inv.pills = inv.pills.filter(p => p !== targetPill);
    }
    updated.inventory = inv;

    if (!updated.activeBuffs) updated.activeBuffs = {};

    const quality = pill.quality || 'thuong_pham';
    const qMult = getItemQualityMultiplier(quality);
    const scaledEffectValue = Math.max(1, Math.round(pill.effectValue * qMult));
    const qualityInfo = ITEM_QUALITIES[quality];
    const formattedTitle = formatItemFullName(pill.name, pill.grade, quality);

    if (pill.effectType === 'full_heal') {
      const maxHP = updated.maxKhiHuyet || getMaxKhiHuyet(updated.canCot, updated.currentRealm, updated.equipment);
      const maxMP = updated.maxLinhLuc || getMaxLinhLuc(updated.tamCanh, updated.ngoTinh, updated.currentRealm, updated.equipment);
      updated.khiHuyet = maxHP;
      updated.linhLuc = maxMP;
      showToast(`Khí Huyết và Chân Nguyên hồi phục 100% nhờ [${formattedTitle}]!`);
      addLog('Phục Dược Hồi Sinh', `Uống vào ${formattedTitle}, sinh cơ cuồn cuộn hồi sinh toàn diện!`, 'alchemy');
    } else if (pill.effectType === 'combat_buff') {
      updated.activeBuffs.combatBuffPercent = scaledEffectValue;
      updated.activeBuffs.combatBuffBattlesLeft = pill.durationBattles || 3;
      showToast(`Chiến ý sôi sục! Sát thương tăng +${scaledEffectValue}% (${qualityInfo.name} x${qMult}) trong ${pill.durationBattles || 3} trận!`);
      addLog('Uống Cuồng Bạo Đan', `Dược lực thiêu đốt huyết mạch! Sát thương chiến đấu tăng +${scaledEffectValue}% (${qualityInfo.name}) trong ${pill.durationBattles || 3} trận kế tiếp!`, 'alchemy');
    } else if (pill.effectType === 'breakthrough_bonus') {
      updated.activeBuffs.breakthroughBonus = (updated.activeBuffs.breakthroughBonus || 0) + scaledEffectValue;
      showToast(`Tỉ lệ đột phá lần tới được cộng thêm +${scaledEffectValue}% (${qualityInfo.name} x${qMult})!`);
      addLog('Hấp Thu Phá Cảnh Đan', `Dược lực mở rộng đan điền, tích lũy thêm +${scaledEffectValue}% tỉ lệ đột phá cảnh giới kế tiếp (${qualityInfo.name})!`, 'alchemy');
    } else if (pill.effectType === 'permanent_stat') {
      const maxStat = getMaxStatLimit(updated.currentRealm || 0);
      if (pill.statTarget === 'canCot') {
        updated.canCot = Math.min(maxStat, updated.canCot + scaledEffectValue);
        showToast(`Căn Cốt tăng vĩnh viễn +${scaledEffectValue} (${qualityInfo.name})!`);
        addLog('Tẩy Tủy Hoán Cốt', `Kinh mạch thanh lọc tạp chất! Căn Cốt tăng vĩnh viễn +${scaledEffectValue} điểm (Giới hạn: ${maxStat})!`, 'alchemy');
      } else if (pill.statTarget === 'ngoTinh') {
        updated.ngoTinh = Math.min(maxStat, updated.ngoTinh + scaledEffectValue);
        showToast(`Ngộ Tính tăng vĩnh viễn +${scaledEffectValue} (${qualityInfo.name})!`);
        addLog('Khai Mở Thần Trí', `Linh đài sáng tỏ như gương! Ngộ Tính tăng vĩnh viễn +${scaledEffectValue} điểm (Giới hạn: ${maxStat})!`, 'alchemy');
      } else if (pill.statTarget === 'tamCanh') {
        updated.tamCanh = Math.min(maxStat, (updated.tamCanh || 50) + scaledEffectValue);
        showToast(`Tâm Cảnh tăng vĩnh viễn +${scaledEffectValue} (${qualityInfo.name})!`);
        addLog('Định Thần Ngưng Phách', `Tâm ma tiêu tán, đạo tâm kiên định! Tâm Cảnh tăng vĩnh viễn +${scaledEffectValue} điểm (Giới hạn: ${maxStat})!`, 'alchemy');
      } else if (pill.statTarget === 'khiVan') {
        updated.khiVan = Math.min(maxStat, (updated.khiVan || 50) + scaledEffectValue);
        showToast(`Khí Vận tăng vĩnh viễn +${scaledEffectValue} (${qualityInfo.name})!`);
        addLog('Khí Vận Gia Trì', `Phúc duyên chiếu rọi! Khí Vận tăng vĩnh viễn +${scaledEffectValue} điểm (Giới hạn: ${maxStat})!`, 'alchemy');
      } else {
        const isCanCot = Math.random() < 0.5;
        if (isCanCot) {
          updated.canCot = Math.min(maxStat, updated.canCot + scaledEffectValue);
          showToast(`Căn Cốt tăng vĩnh viễn +${scaledEffectValue} (${qualityInfo.name})!`);
          addLog('Tẩy Tủy Hoán Cốt', `Kinh mạch thanh lọc tạp chất! Căn Cốt tăng vĩnh viễn +${scaledEffectValue} điểm (Giới hạn: ${maxStat})!`, 'alchemy');
        } else {
          updated.ngoTinh = Math.min(maxStat, updated.ngoTinh + scaledEffectValue);
          showToast(`Ngộ Tính tăng vĩnh viễn +${scaledEffectValue} (${qualityInfo.name})!`);
          addLog('Khai Mở Thần Trí', `Linh đài sáng tỏ như gương! Ngộ Tính tăng vĩnh viễn +${scaledEffectValue} điểm (Giới hạn: ${maxStat})!`, 'alchemy');
        }
      }
    } else if (pill.effectType === 'body_refinement') {
      const curHP = updated.khiHuyet || 100;
      const maxHP = updated.maxKhiHuyet || 200;
      const healAmount = Math.floor(maxHP * 0.5 * Math.min(2.0, qMult));
      updated.khiHuyet = Math.min(maxHP, curHP + healAmount);
      showToast(`Đã dùng ${formattedTitle}! Hồi phục ${healAmount} Khí Huyết và bồi bổ nhục thân.`);
      addLog('Uống Khí Huyết Đan', `Dược lực ôn nhuận huyết mạch, hồi phục Khí Huyết để chuẩn bị Tôi Thể!`, 'physique');
    } else if (pill.effectType === 'root_evolution') {
      const curRoot = updated.linhCan || generateRandomLinhCan();
      const newPurity = Math.min(100, (curRoot.purity || 40) + scaledEffectValue);
      updated.linhCan = { ...curRoot, purity: newPurity };
      showToast(`Linh căn thanh lọc tạp chất! Độ tinh thuần tăng lên ${newPurity}% (${qualityInfo.name}).`);
      addLog('Uống Tẩy Linh Đan', `Dược lực tẩy tủy phạt mao, độ tinh thuần của Linh Căn tăng lên ${newPurity}%!`, 'root');
    } else if (pill.effectType === 'lifespan' || pill.id.startsWith('pill_tho_nguyen')) {
      const bonusYears = pill.effectValue || 50;
      const currentPillBonus = updated.lifespanPillsUsed || 0;
      const newPillBonus = currentPillBonus + bonusYears;
      const baseLifespan = getBaseLifespanForRealm(updated.currentRealm || 0);
      updated.lifespanPillsUsed = newPillBonus;
      updated.maxLifespan = baseLifespan + newPillBonus;
      showToast(`Uống ${formattedTitle}! Thọ nguyên tăng thêm +${bonusYears} năm (Tối đa: ${updated.maxLifespan} tuổi)!`);
      addLog('Duyên Thọ Diên Niên', `Dược lực ngưng tụ sinh cơ vô tận, thọ nguyên tăng thêm +${bonusYears} năm! Tuổi thọ hiện tại: ${updated.age || 16}/${updated.maxLifespan} tuổi.`, 'alchemy');
    }

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  // Mua khoáng thạch
  const handleBuyOre = (ore: Ore) => {
    if (player.linhThach < ore.price) {
      showToast(`Linh thạch không đủ! Cần ${ore.price} linh thạch.`);
      return;
    }

    const updated = { ...player };
    updated.linhThach -= ore.price;
    const inv = updated.inventory || { pills: [], herbs: [], ores: [] };
    const existing = inv.ores.find(o => o.id === ore.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      inv.ores.push({ ...ore, quantity: 1 });
    }
    updated.inventory = inv;

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    showToast(`Đã mua 1 ${ore.name}!`);
    addLog('Khoáng Phòng Giao Dịch', `Tiêu hao ${ore.price} Linh thạch mua 1 khối ${ore.name}.`, 'forging');
  };

  // Đúc trang bị mới (Quy trình xuất thiết: Rèn -> Mở Modal chiêm ngưỡng -> Tùy chọn Trang Bị / Thu Nạp)
  const handleForgeEquip = (recipe: typeof EQUIP_RECIPES[0]) => {
    if (isForging) {
      showToast('Lò luyện đang vận hành, xin chớ nóng vội!');
      return;
    }

    if (!player.forgingArtisan?.unlocked) {
      showToast('⚠️ Luyện Khí Phòng chưa khai mở! Cần lĩnh ngộ [Bách Luyện Đúc Thuật].');
      return;
    }

    const currentArtisan = player.forgingArtisan;
    const perk = ARTISAN_PERKS[currentArtisan.level];
    if (!perk.allowedGrades.includes(recipe.grade)) {
      showToast(`Đẳng cấp ${ARTISAN_TITLES.forging[currentArtisan.level]} chưa đủ để rèn [${recipe.name}] (${recipe.grade})! Cần nâng cao cấp bậc.`);
      return;
    }

    // Kiểm tra khóa theo cảnh giới Khí Tu
    const craftCheck = checkArtisanCraftRequirement(player.currentRealm, recipe.grade);
    if (!craftCheck.canCraft) {
      showToast(craftCheck.reason || `🔒 Cần đạt [${craftCheck.requiredRealmName}] để rèn đúc pháp bảo này!`);
      return;
    }

    let activePlayer = player;
    const supply = assessForgeRecipeSupply(activePlayer, recipe, 1);

    if (!supply.isFullySupplied) {
      if (player.craftingSupplySettings?.autoBuyMissing) {
        if (!supply.canExecuteAutoPurchase) {
          if (supply.hasUnmetRealmGating) {
            const unmet = supply.missingItems.find(i => !i.canPurchaseAtCurrentRealm);
            showToast(`🔒 Cần đạt [${unmet?.requiredRealmName || 'Cảnh giới cao hơn'}] để mua [${unmet?.name || 'khoáng thạch'}] tại Thương Hội!`);
            return;
          }
          if (!supply.hasEnoughLinhThach) {
            showToast(`Linh thạch không đủ để tự động mua khoáng thạch! Cần ${supply.totalCostLinhThach.toLocaleString()} LT.`);
            return;
          }
          showToast('Không đủ điều kiện để tự động mua khoáng thạch thiếu!');
          return;
        }

        // Tự động mua khoáng thạch thiếu
        const buyResult = executeBatchSupplyPurchase(activePlayer, supply);
        if (!buyResult.success) {
          showToast(`⚠️ Tự động mua thất bại: ${buyResult.message}`);
          return;
        }
        activePlayer = buyResult.updatedPlayer;
        addLog(
          'Tự Động Cung Ứng',
          `Tự động mua khoáng thạch còn thiếu cho đơn rèn [${recipe.name}]: Tiêu hao ${supply.totalCostLinhThach.toLocaleString()} Linh Thạch.`,
          'merchant'
        );
      } else {
        const invOres = activePlayer.inventory?.ores || [];
        for (const req of recipe.oresRequired) {
          const owned = invOres.find(o => o.id === req.oreId)?.quantity || 0;
          if (owned < req.count) {
            showToast(`Không đủ ${req.oreName}! Cần ${req.count}, hiện có ${owned}.`);
            return;
          }
        }
      }
    }

    if (activePlayer.linhThach < recipe.linhThachCost) {
      showToast(`Không đủ linh thạch tôi luyện! Cần ${recipe.linhThachCost} linh thạch.`);
      return;
    }

    const inv = activePlayer.inventory || { pills: [], herbs: [], ores: [] };
    for (const req of recipe.oresRequired) {
      const owned = inv.ores.find(o => o.id === req.oreId)?.quantity || 0;
      if (owned < req.count) {
        showToast(`Không đủ ${req.oreName}! Cần ${req.count}, hiện có ${owned}.`);
        return;
      }
    }

    const usedSlots = getCurrentInventoryOccupiedSlots(activePlayer);
    const currentMaxSlots = getMaxInventoryCapacity(activePlayer);
    if (!canAddItemToInventory(activePlayer, currentMaxSlots, 'equipment', recipe.id)) {
      showToast(`⚠️ Túi Trữ Vật đã đầy (${usedSlots}/${currentMaxSlots >= 9999 ? '∞' : currentMaxSlots})! Không thể chứa thêm trang bị mới.`);
      return;
    }

    // Khóa chống click đúp / spam click
    setIsForging(true);

    try {
      // 1. Trừ nguyên liệu và Linh Thạch an toàn (immutable)
      const updated = { ...activePlayer };
      updated.linhThach -= recipe.linhThachCost;
      const updatedOres = (inv.ores || []).map(o => ({ ...o }));
      recipe.oresRequired.forEach((req: { oreId: string; count: number }) => {
        const o = updatedOres.find(x => x.id === req.oreId);
        if (o) o.quantity -= req.count;
      });

      // 2. Kích hoạt âm thanh rèn sắt (clang, sizzle)
      try {
        if (typeof (audioEngine as any).playSFX === 'function') {
          (audioEngine as any).playSFX('slash', true); // Âm kim khí bạo kích rền vang (clang)
          (audioEngine as any).playSFX('alchemy'); // Âm dị hỏa nung luyện (sizzle)
        } else {
          audioEngine.playAlchemyFurnaceSound(1.0);
        }
      } catch {
        // Fallback âm thanh an toàn
      }

      // 3. Tính toán phẩm chất và chỉ số trang bị
      const rolledQuality: ItemQuality = rollForgingQuality(
        player.canCot,
        currentArtisan.level || 1,
        player.bodyRefinement?.realmIndex || 0
      );
      const qualityInfo = getItemQuality(rolledQuality);
      const qMult = qualityInfo.multiplier;

      const isCrit = Math.random() * 100 < perk.critChance;
      const critMult = isCrit ? 1.5 : 1.0;
      const finalPower = Math.floor(recipe.basePower * qMult * critMult);
      const finalHp = Math.floor(recipe.baseHp * qMult * critMult);
      const finalMp = Math.floor(recipe.baseMp * qMult * critMult);
      const finalEnhancement = isCrit ? 1 : 0;
      const displayGiai = convertGradeToGiai(recipe.grade);
      const finalName = recipe.name;
      const uniqueEquipId = `${recipe.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newEquip: Equipment = {
        id: uniqueEquipId,
        name: finalName,
        slot: recipe.slot,
        grade: displayGiai,
        quality: rolledQuality,
        enhancement: finalEnhancement,
        powerBonus: finalPower,
        hpBonus: finalHp,
        mpBonus: finalMp,
        description: `${recipe.description} (Phẩm chất: ${qualityInfo.name} x${qMult}${isCrit ? ', Thiên Công Khai Vật: Khởi đầu +1 Cường Hóa!' : ''})`
      };

      // 4. Tách Rời Tự Động Trang Bị:
      // Đẩy trang bị vào túi đồ (inventory), KHÔNG tự động mặc vào player.equipment
      const currentEquips = [
        ...(updated.inventory?.equipments || updated.inventory?.equipment || [])
      ];
      currentEquips.push(newEquip);

      updated.inventory = {
        ...updated.inventory,
        pills: updated.inventory?.pills || [],
        herbs: updated.inventory?.herbs || [],
        ores: updatedOres,
        equipments: currentEquips,
        equipment: currentEquips
      };

      if (recipe.storageCapacity && recipe.storageCapacity > (updated.storageBag?.maxSlots || 0)) {
        updated.storageBag = {
          id: recipe.id,
          name: finalName,
          grade: recipe.grade,
          maxSlots: recipe.storageCapacity,
          price: recipe.linhThachCost,
          description: recipe.description
        };
        showToast(`🎉 Dung tích Túi Trữ Vật đã tăng vọt lên ${recipe.storageCapacity >= 9999 ? 'VÔ HẠN' : `${recipe.storageCapacity} ô`}!`);
      }

      const expGain = recipe.grade === 'Tiên Thiên Linh Bảo' ? 70 : recipe.grade === 'Cổ Bảo' ? 50 : recipe.grade === 'Bảo Khí' ? 30 : recipe.grade === 'Linh Khí' ? 20 : 10;
      const { updated: updatedArtisan, leveledUp, newLevel } = addArtisanExp(currentArtisan, 'forging', expGain, isCrit, player.currentRealm);
      updated.forgingArtisan = updatedArtisan;
      updated.achievementsState = {
        ...updated.achievementsState,
        claimedAchievementIds: updated.achievementsState?.claimedAchievementIds || [],
        unlockedTitleIds: updated.achievementsState?.unlockedTitleIds || [],
        stats: {
          ...updated.achievementsState?.stats,
          equipmentsForged: (updated.achievementsState?.stats?.equipmentsForged || 0) + 1
        }
      };

      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      // 5. Lưu thông tin trang bị vừa đúc và mở Modal Xuất Thiết Thần Binh
      setForgedEquipmentResult(newEquip);
      setIsHarvestModalOpen(true);

      if (isCrit) {
        showToast(`✨ THIÊN CÔNG KHAI VẬT! Rèn ra [${finalName}] (+1 Cường Hóa, Chỉ số x1.5)!`);
        addLog(
          'Thiên Công Khai Vật',
          `Khai lò thần quang chói lòa! Rèn đúc xuất thế [${finalName}] (${recipe.grade}) uy lực siêu phàm! EXP Luyện Khí +${expGain}.`,
          'forging'
        );
      } else {
        showToast(`✨ Đúc thành công [${recipe.name}]! (EXP Luyện Khí +${expGain})`);
        addLog(
          'Khai Lò Luyện Khí',
          `Tiêu hao khoáng thạch và ${recipe.linhThachCost} Linh thạch rèn đúc thành công [${recipe.name}] (${recipe.grade}). EXP Luyện Khí +${expGain}.`,
          'forging'
        );
      }

      if (leveledUp && newLevel) {
        const newTitle = ARTISAN_TITLES.forging[newLevel];
        showToast(`🎉 Chúc mừng! Tay nghề thăng cấp thành [${newTitle}]! Mở khóa phẩm cấp pháp bảo mới.`);
        addLog('Thăng Đẳng Cấp Luyện Khí', `Đạt tới cảnh giới nghệ nhân ${newTitle}! Tăng tỉ lệ thành công và cơ may xuất hiện Cực Phẩm!`, 'forging');
      }
    } finally {
      // Cooldown chống click đúp
      setTimeout(() => {
        setIsForging(false);
      }, 350);
    }
  };

  // Action sau thu hoạch: Trang Bị Ngay món vừa đúc
  const handleEquipNewlyForgedItem = () => {
    if (!forgedEquipmentResult) {
      setIsHarvestModalOpen(false);
      return;
    }

    const slot = forgedEquipmentResult.slot as EquipmentSlot;
    if (!slot) {
      showToast('⚠️ Không thể xác định vị trí trang bị!');
      setIsHarvestModalOpen(false);
      setForgedEquipmentResult(null);
      return;
    }

    try {
      if (typeof (audioEngine as any).playSFX === 'function') {
        (audioEngine as any).playSFX('slash', false);
      } else if (typeof (audioEngine as any).playSwordSlashSound === 'function') {
        (audioEngine as any).playSwordSlashSound(0.8, false);
      }
    } catch {
      // Safe audio fallback
    }

    const updated = { ...player };
    const currentEquipments = [
      ...(updated.inventory?.equipments || updated.inventory?.equipment || [])
    ];

    // Lấy trang bị cũ đang mặc ở slot này (nếu có)
    const currentEquipmentMap = { ...(updated.equipment || {}) };
    const oldEquip = currentEquipmentMap[slot];

    // Chuyển forgedEquipmentResult vào đúng slot trên player.equipment (bảo toàn trọn vẹn metadata)
    currentEquipmentMap[slot] = forgedEquipmentResult;
    updated.equipment = currentEquipmentMap;

    // Giữ đồng bộ với trường equippedEquipment (nếu có)
    if ((updated as any).equippedEquipment && typeof (updated as any).equippedEquipment === 'object') {
      (updated as any).equippedEquipment = {
        ...(updated as any).equippedEquipment,
        [slot]: forgedEquipmentResult
      };
    }

    // Loại bỏ trang bị mới khỏi túi đồ vì đã mặc lên người
    const updatedInventoryEquips = currentEquipments.filter(e => e && e.id !== forgedEquipmentResult.id);

    // Đưa trang bị cũ cùng slot từ player.equipment về player.inventory
    if (oldEquip && oldEquip.id !== forgedEquipmentResult.id) {
      updatedInventoryEquips.push(oldEquip);
    }

    updated.inventory = {
      ...updated.inventory,
      pills: updated.inventory?.pills || [],
      herbs: updated.inventory?.herbs || [],
      ores: updated.inventory?.ores || [],
      equipments: updatedInventoryEquips,
      equipment: updatedInventoryEquips
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    const equipMsg = oldEquip
      ? `Đã trang bị [${forgedEquipmentResult.name}], hoán chuyển [${oldEquip.name}] vào Túi Trữ Vật!`
      : `Đã trang bị thần binh [${forgedEquipmentResult.name}]!`;

    showToast(`⚔️ ${equipMsg}`);
    addLog('Trang Bị Thần Binh', equipMsg, 'forging');

    // Đóng modal và reset kết quả
    setIsHarvestModalOpen(false);
    setForgedEquipmentResult(null);
  };

  // Action sau thu hoạch: Thu Nạp Vào Túi món vừa đúc
  const handleStoreNewlyForgedItem = () => {
    if (forgedEquipmentResult) {
      showToast(`🎒 Đã thu nạp [${forgedEquipmentResult.name}] vào Túi Trữ Vật.`);
      addLog('Thu Nạp Thần Binh', `Đã cất giữ thần binh [${forgedEquipmentResult.name}] vào Túi Trữ Vật.`, 'forging');
    }
    try {
      if (typeof (audioEngine as any).playClickSound === 'function') {
        (audioEngine as any).playClickSound(0.8);
      }
    } catch {
      // Safe audio fallback
    }
    // Trang bị đã nằm sẵn trong túi từ bước rèn; chỉ cần đóng modal và reset
    setIsHarvestModalOpen(false);
    setForgedEquipmentResult(null);
  };

  // Cường hóa pháp bảo
  const handleEnhanceEquip = (slot: EquipmentSlot) => {
    const equip = player.equipment?.[slot];
    if (!equip) {
      showToast('Vị trí này chưa có pháp bảo để cường hóa!');
      return;
    }
    if (equip.enhancement >= 9) {
      showToast('Pháp bảo đã đạt cực hạn cường hóa (+9)!');
      return;
    }

    const cost = (equip.enhancement + 1) * 250;
    if (player.linhThach < cost) {
      showToast(`Không đủ linh thạch tôi luyện! Cần ${cost} linh thạch.`);
      return;
    }

    const updated = { ...player };
    updated.linhThach -= cost;

    const baseRate = equip.enhancement < 3 ? 100 : equip.enhancement < 6 ? 80 : 60;
    const isSuccess = Math.random() * 100 < baseRate;

    if (isSuccess) {
      equip.enhancement += 1;
      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(`🎉 Cường hóa thành công [${equip.name} +${equip.enhancement}]!`);
      addLog(
        'Cường Hóa Pháp Bảo',
        `Tôi luyện thành công [${equip.name}] lên +${equip.enhancement}! Uy lực pháp bảo tăng thêm +15%!`,
        'forging'
      );
    } else {
      setPlayer(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      showToast('❌ Cường hóa thất bại! Dị hỏa chấn động làm hao tổn linh thạch!');
      addLog('Cường Hóa Thất Bại', `Lực tôi luyện quá mạnh suýt làm nứt pháp bảo, cường hóa thất bại.`, 'danger');
    }
  };

  // Mở khóa Bách Nghệ
  const handleUnlockArtisan = (type: 'alchemy' | 'forging') => {
    const manualId = type === 'alchemy' ? 'manual_dan_kinh_tan_quyen' : 'manual_bach_luyen_duc_thuat';
    const manualName = type === 'alchemy' ? 'Thái Thượng Đan Kinh Tàn Quyển' : 'Bách Luyện Đúc Thuật';

    const hasInManuals = (player.manuals || []).some(m => m.id === manualId);
    const hasInInvManuals = (player.inventory?.manuals || []).some(m => m.id === manualId);
    const isLearned = (player.learnedManuals || []).includes(manualId);

    if (!hasInManuals && !hasInInvManuals && !isLearned) {
      showToast(`Chưa có bí kíp [${manualName}]! Hãy tìm mua tại Thương Hội hoặc thám hiểm Bí Cảnh.`);
      return;
    }

    const updated = { ...player };
    if (type === 'alchemy') {
      if (!updated.alchemyArtisan) updated.alchemyArtisan = createDefaultArtisanState('alchemy', true);
      else updated.alchemyArtisan = { ...updated.alchemyArtisan, unlocked: true };
      if (!updated.learnedManuals?.includes(manualId)) {
        updated.learnedManuals = [...(updated.learnedManuals || []), manualId];
      }
      showToast(`🌟 Khai mở thành công Đan Đạo! Bạn đã trở thành Sơ Cấp Luyện Đan Sư!`);
      addLog('Khai Mở Đan Đạo', `Lĩnh ngộ ${manualName}, mở khóa Luyện Đan Các và tiếp nhận đạo thống Đan Đạo!`, 'alchemy');
    } else {
      if (!updated.forgingArtisan) updated.forgingArtisan = createDefaultArtisanState('forging', true);
      else updated.forgingArtisan = { ...updated.forgingArtisan, unlocked: true };
      if (!updated.learnedManuals?.includes(manualId)) {
        updated.learnedManuals = [...(updated.learnedManuals || []), manualId];
      }
      showToast(`🌟 Khai mở thành công Khí Đạo! Bạn đã trở thành Sơ Cấp Luyện Khí Sư!`);
      addLog('Khai Mở Khí Đạo', `Lĩnh ngộ ${manualName}, mở khóa Luyện Khí Phòng và tiếp nhận đạo thống Khí Đạo!`, 'forging');
    }

    if (updated.inventory?.manuals) {
      updated.inventory.manuals = updated.inventory.manuals.filter(m => m.id !== manualId);
    }

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  };

  // ============================================
  // THẦN BINH CÁC: ĐỤC LỖ, KHẢM NGỌC & TẨY LUYỆN
  // ============================================
  const [forgingSelectedSlot, setForgingSelectedSlot] = useState<EquipmentSlot>('weapon');

  // 1. Đục lỗ trang bị
  const handlePunchSocket = (slot: EquipmentSlot) => {
    const equip = player.equipment?.[slot];
    if (!equip) {
      showToast('Chưa có trang bị ở vị trí này để đục lỗ!');
      return;
    }

    const res = punchEquipmentSocket(equip, player);
    if (res.success) {
      audioEngine.playSFX('alchemy');
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(res.message);
      addLog('Đục Lỗ Thần Binh', res.message, 'forging');
    } else {
      showToast(res.message);
    }
  };

  // 2. Khảm nạm Linh Ngọc
  const handleInlayGem = (slot: EquipmentSlot, socketIndex: number, gemId: string) => {
    const equip = player.equipment?.[slot];
    if (!equip) {
      showToast('Chưa có trang bị ở vị trí này để khảm ngọc!');
      return;
    }

    const res = inlayGemToSocket(equip, gemId, socketIndex, player);
    if (res.success) {
      audioEngine.playSFX('alchemy');
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(res.message);
      addLog('Khảm Nạp Linh Ngọc', res.message, 'forging');
    } else {
      showToast(res.message);
    }
  };

  // 3. Tháo gỡ Linh Ngọc
  const handleRemoveGem = (slot: EquipmentSlot, socketIndex: number) => {
    const equip = player.equipment?.[slot];
    if (!equip) {
      showToast('Chưa có trang bị ở vị trí này!');
      return;
    }

    const res = removeGemFromSocket(equip, socketIndex, player);
    if (res.success) {
      audioEngine.playSFX('click');
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(res.message);
      addLog('Tháo Gỡ Linh Ngọc', res.message, 'forging');
    } else {
      showToast(res.message);
    }
  };

  // 4. Khóa / Mở khóa dòng thuộc tính ẩn (Affix)
  const handleToggleLockAffix = (slot: EquipmentSlot, affixId: string) => {
    const equip = player.equipment?.[slot];
    if (!equip) {
      showToast('Chưa có trang bị ở vị trí này!');
      return;
    }

    const res = toggleAffixLock(equip, affixId);
    if (res.success && res.updatedEquip) {
      audioEngine.playSFX('click');
      const updated = { ...player };
      if (!updated.equipment) updated.equipment = {};
      updated.equipment[slot] = res.updatedEquip;

      const normalized = normalizePlayerData(updated);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  // 5. Tẩy luyện thuộc tính ẩn (Reforging)
  const handleReforgeEquipment = (slot: EquipmentSlot) => {
    const equip = player.equipment?.[slot];
    if (!equip) {
      showToast('Chưa có trang bị ở vị trí này để tẩy luyện!');
      return;
    }

    const res = useEssenceReforge
      ? reforgeEquipmentWithEssence(equip, player)
      : reforgeEquipmentAffixes(equip, player);

    if (res.success) {
      if (res.hasGodAffix) {
        audioEngine.playSFX('slash', true);
      } else {
        audioEngine.playSFX('alchemy');
      }
      const normalized = normalizePlayerData(res.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      showToast(res.message);
      addLog(useEssenceReforge ? '🔥 Tinh Hoa Thần Luyện' : 'Tẩy Luyện Thần Binh', res.message, 'forging');
    } else {
      showToast(res.message);
    }
  };

  // 6. Phân giải & Tái chế trang bị (Dismantle)
  const handleSelectDismantleEquip = (id: string) => {
    setSelectedDismantleIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        const invEquips = player.inventory?.equipments || player.inventory?.equipment || [];
        const equip = invEquips.find(e => e.id === id);
        if (equip) {
          const check = canDismantleEquipment(equip, player);
          if (!check.canDismantle) {
            showToast(check.reason || 'Trang bị không thể phân giải!');
            return prev;
          }
        }
        return [...prev, id];
      }
    });
  };

  const handleSelectAllByGrade = (grades: string[]) => {
    const inv = player.inventory?.equipments || player.inventory?.equipment || [];
    const targetIds: string[] = [];
    for (const equip of inv) {
      const check = canDismantleEquipment(equip, player);
      if (!check.canDismantle) continue;
      const qKey = getEquipQualityKey(equip);
      if (grades.includes(qKey) || grades.includes(equip.quality || '') || grades.includes(equip.grade)) {
        targetIds.push(equip.id);
      }
    }
    if (targetIds.length === 0) {
      showToast('Không tìm thấy trang bị phù hợp trong Túi Trữ Vật!');
      return;
    }
    setSelectedDismantleIds(targetIds);
    showToast(`Đã chọn nhanh ${targetIds.length} món trang bị để dung luyện.`);
  };

  const handleClearDismantleSelection = () => {
    setSelectedDismantleIds([]);
  };

  const handleConfirmDismantle = () => {
    if (selectedDismantleIds.length === 0) {
      showToast('Chưa chọn trang bị nào để dung luyện!');
      return;
    }

    const count = selectedDismantleIds.length;
    const { updatedPlayer, totalReward } = executeDismantleBatch(player, selectedDismantleIds);
    const oreCount = totalReward.oreQuantity;
    const gemCount = totalReward.recoveredGems.length;
    const essence = totalReward.forgingEssence;
    const lt = totalReward.linhThachRefund;

    const normalized = normalizePlayerData(updatedPlayer);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

    setSelectedDismantleIds([]);
    audioEngine.playSFX('alchemy');

    showToast(`Dung luyện thành công [${count}] món trang bị! Thu hồi [${oreCount}] Khoáng Thạch, [${gemCount}] Linh Ngọc và [${essence}] Tinh Hoa Rèn Đúc!`);
    addLog(
      'Lò Dung Luyện',
      `Dung luyện phân giải ${count} món trang bị. Thu hồi ${oreCount} Khoáng Thạch, ${gemCount} Linh Ngọc, ${essence} Tinh Hoa Rèn Đúc và ${lt.toLocaleString()} Linh Thạch.`,
      'forging'
    );
  };

  return {
    alchemySubTab,
    setAlchemySubTab,
    forgingMainTab,
    setForgingMainTab,
    forgingSubTab,
    setForgingSubTab,
    forgingSelectedSlot,
    setForgingSelectedSlot,
    handleBuyHerb,
    handleCraftPill,
    handleConsumePill,
    handleUsePill: handleConsumePill,
    handleBuyOre,
    handleForgeEquip,
    handleCraftEquipment: handleForgeEquip,
    forgedEquipmentResult,
    setForgedEquipmentResult,
    isHarvestModalOpen,
    setIsHarvestModalOpen,
    isForging,
    setIsForging,
    handleEquipNewlyForgedItem,
    handleStoreNewlyForgedItem,
    handleEnhanceEquip,
    handleUnlockArtisan,
    handlePunchSocket,
    handleInlayGem,
    handleRemoveGem,
    handleToggleLockAffix,
    handleReforgeEquipment,
    selectedDismantleIds,
    setSelectedDismantleIds,
    handleSelectDismantleEquip,
    handleSelectAllByGrade,
    handleClearDismantleSelection,
    handleConfirmDismantle,
    handleBuyMissingMaterials,
    handleToggleAutoBuySupply,
    useEssenceReforge,
    setUseEssenceReforge,
    handleToggleEssenceReforge
  };
}
