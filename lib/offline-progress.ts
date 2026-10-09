// lib/offline-progress.ts
// Hệ thống Bế Quan Ngoại Tuyến (AFK Offline Progress Engine)
// Tính toán Tu Vi, Linh Thạch, tiến độ Linh Điền và cơ duyên nhặt bảo vật khi người chơi vắng mặt

import {
  PlayerStats,
  LinhDienState,
  Manual,
  OfflineProgressResult,
  OfflineProgressItem
} from '@/lib/types';
import { calculateCultivationSpeed, calculateCultivationReward } from '@/lib/game-constants';
import { DEFAULT_HERBS, DEFAULT_ORES } from '@/lib/alchemy-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { getManualSynergy } from '@/lib/elemental-system';
import { TITLES_CONFIG } from '@/lib/achievements-data';
import { getOccupiedVeinsBuffs } from '@/lib/sect-logic';
import { getCultivationShopPermanentSpeedBonus } from '@/lib/cultivation-shop-data';
import { resolveOfflineCosmicDefense } from '@/lib/cosmic-defense-logic';
import { calculateMountainYields } from '@/lib/sect-war-logic';
import { resolveOfflineMeditationProgress } from '@/lib/meditation-logic';
import { getCustomSanctuaryBuffTotals } from '@/lib/custom-sanctuary-logic';

export type { OfflineProgressResult, OfflineProgressItem };

/**
 * Định dạng thời gian ngoại tuyến thành chuỗi dễ đọc: "X giờ Y phút Z giây"
 */
export function formatOfflineTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hrs > 0) parts.push(`${hrs} giờ`);
  if (mins > 0) parts.push(`${mins} phút`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} giây`);

  return parts.join(' ');
}

/**
 * Tính giới hạn thời gian bế quan ngoại tuyến (AFK Cap) dựa trên thân phận Tông Môn và Tọa Kỵ
 * - Cơ bản: 8 giờ (28,800s)
 * - Tông Môn Chưởng Môn / Trưởng Lão: +2 giờ (7,200s)
 * - Tọa Kỵ / Linh Thú cấp cao: +2 giờ (7,200s)
 * - Tối đa: 12 giờ (43,200s)
 */
export function calculateOfflineMaxCap(player: PlayerStats): {
  maxCapSeconds: number;
  bonusHours: number;
  sectBonusHours: number;
  beastBonusHours: number;
} {
  const baseSeconds = 8 * 3600; // 8 giờ
  let sectBonusSeconds = 0;
  let beastBonusSeconds = 0;

  // Thân phận tông môn
  const sectRank = player.sectState?.rank || player.sectRank;
  if (sectRank === 'chuong_mon' || sectRank === 'truong_lao') {
    sectBonusSeconds = 2 * 3600; // +2 giờ
  }

  // Linh thú / Tọa kỵ
  if (player.beasts && player.activeBeastId) {
    const activeBeast = player.beasts.find(b => b.id === player.activeBeastId);
    if (activeBeast) {
      // Có linh thú đang kích hoạt hoặc làm thú cưỡi
      beastBonusSeconds = 2 * 3600; // +2 giờ
    }
  }

  const totalCap = Math.min(12 * 3600, baseSeconds + sectBonusSeconds + beastBonusSeconds);
  const bonusHours = (totalCap - baseSeconds) / 3600;

  return {
    maxCapSeconds: totalCap,
    bonusHours,
    sectBonusHours: sectBonusSeconds / 3600,
    beastBonusHours: beastBonusSeconds / 3600
  };
}

/**
 * Tính tổng hệ số tốc độ tu luyện ngoại tuyến (bám sát processCultivation)
 */
export function calculateOfflineSpeedMultiplier(player: PlayerStats, now: number): number {
  let manualSpeedBonus = 0;
  if (player.manuals) {
    player.manuals.forEach((m: Manual) => {
      if (m.type === 'tam_phap' && m.level > 0) {
        const isEquipped = player.equippedManuals?.tamPhap === m.id;
        const synergy = getManualSynergy(m, player.linhCan);
        const synergyMultiplier = (isEquipped && synergy.isSynergy) ? 1.5 : 1.0;

        manualSpeedBonus += (((m.level * (m.speedBonusPerLevel || 0)) / 100) * synergyMultiplier);
        if (m.level >= m.maxLevel && m.maxLevelPassive?.cultivateSpeedBonus) {
          manualSpeedBonus += ((m.maxLevelPassive.cultivateSpeedBonus / 100) * synergyMultiplier);
        }
      }
    });
  }

  const linhCanSpeedBonus = player.linhCan ? (player.linhCan.speedBonus / 100) : 0;
  const currentSect = player.sectState?.sectId || player.sect;
  const sectBonus = (currentSect === 'thanh_van_mon' || currentSect === 'chinh_dao') ? 0.15 : (player.tongMon ? 0.1 : 0);

  const activePhysiques = (player.physiques && player.physiques.length > 0)
    ? player.physiques
    : (player.physique ? [player.physique] : []);
  let physiqueSpeedBonus = 0;
  for (const p of activePhysiques) {
    if (p.cultivationSpeedBonusPercent) {
      physiqueSpeedBonus += (p.cultivationSpeedBonusPercent / 100);
    }
  }

  const compBuffs = getBondedCompanionBuffs(player);
  let companionSpeedBonus = compBuffs.cultivateSpeedBonus ? (compBuffs.cultivateSpeedBonus / 100) : 0;
  const hasBonded = Object.values(player.companionsState?.companions || {}).some(c => c.isBonded);
  const activeCompId = player.companionsState?.activeCompanionId;
  const isActiveBonded = Boolean(activeCompId && player.companionsState?.companions?.[activeCompId]?.isBonded);
  if (isActiveBonded || hasBonded) {
    companionSpeedBonus += 0.15;
  }

  // Buff "Tâm Thần Hợp Nhất" từ Song Tu
  const isTamThanActive = Boolean(
    player.companionsState?.tamThanHopNhatUntil && now < player.companionsState.tamThanHopNhatUntil
  );
  const tamThanSpeedBonus = isTamThanActive ? 0.20 : 0;

  // Buff Thiên Cơ Quẻ Mệnh
  let divinationSpeedBonus = 0;
  if (player.dailyDivination?.hexagram === 'dai_cat' || player.dailyDivination?.hexagram === 'thuong_cat') {
    divinationSpeedBonus = 0.30;
  } else if (player.dailyDivination?.hexagram === 'dai_hung') {
    divinationSpeedBonus = -0.15;
  }

  // Buff Tọa Kỵ
  let mountBeastBonus = 0;
  const mountId = player.beastGarden?.activeMountId || player.beastsState?.activeMountBeastId || player.activeBeastId;
  const allBeasts = player.beastGarden?.beasts || player.beasts || [];
  if (mountId && allBeasts.length > 0) {
    const activeBeast = allBeasts.find(b => b.id === mountId);
    if (activeBeast && (activeBeast.role === 'mount' || activeBeast.canMount || activeBeast.isHybrid)) {
      const spd = activeBeast.travelSpeedBonus ?? (activeBeast.stats?.mountSpeedBonus || 20);
      mountBeastBonus = spd / 100;
    }
  }

  // Buff Danh Hiệu
  let titleSpeedBonus = 0;
  const equippedTitle = player.achievementsState?.equippedTitleId;
  if (equippedTitle && TITLES_CONFIG[equippedTitle]?.buffs?.cultivateSpeedBonusPercent) {
    titleSpeedBonus = (TITLES_CONFIG[equippedTitle].buffs.cultivateSpeedBonusPercent || 0) / 100;
  }

  // Buff Chiếm Giữ Đại Linh Mạch Tông Môn (Tụ Khí Mạch)
  const veinBuffs = getOccupiedVeinsBuffs(player);
  const veinTuViBonus = (veinBuffs.tuViSpeedBonus || 0) / 100;

  // Buff Perk Luân Hồi (Thiên Địa Tùy Linh: +5% mỗi cấp)
  const rebornTuViPerkLvl = player.reincarnationState?.permanentPerks?.['perk_thien_dia_tuy_linh'] || 0;
  const rebornTuViBonus = (rebornTuViPerkLvl * 5) / 100;

  // Buff Vật Phẩm Tu Luyện (Vạn Bảo Thương Hội: Trận Bàn Tụ Linh & Tâm Pháp Thổ Nạp)
  let cultShopArrayBonus = 0;
  let cultShopManualBonus = 0;
  if (player.cultivationBuffState) {
    if (Array.isArray(player.cultivationBuffState.activeArrays)) {
      player.cultivationBuffState.activeArrays.forEach((arr) => {
        if (arr && (arr.isPermanent || arr.expiresAt === Infinity || arr.expiresAt > now)) {
          cultShopArrayBonus += (arr.tuViSpeedPercent || 0) / 100;
        }
      });
    }
    if (Array.isArray(player.cultivationBuffState.learnedManualIds)) {
      cultShopManualBonus = getCultivationShopPermanentSpeedBonus(player.cultivationBuffState.learnedManualIds);
    }
  }

  // Buff Linh Mạch Động Phủ Tự Chế (Custom Sanctuary & Array Resonances)
  let sanctuaryTuViBonus = 0;
  if (player.customSanctuary) {
    const sanctuaryBuffs = getCustomSanctuaryBuffTotals(player.customSanctuary);
    if (sanctuaryBuffs.cultivationSpeedMultiplier && sanctuaryBuffs.cultivationSpeedMultiplier > 1) {
      sanctuaryTuViBonus = sanctuaryBuffs.cultivationSpeedMultiplier - 1;
    }
  }

  return Math.max(
    0.2,
    1 + sectBonus + manualSpeedBonus + linhCanSpeedBonus + physiqueSpeedBonus +
    companionSpeedBonus + tamThanSpeedBonus + divinationSpeedBonus + mountBeastBonus + titleSpeedBonus + veinTuViBonus + rebornTuViBonus +
    cultShopArrayBonus + cultShopManualBonus + sanctuaryTuViBonus
  );
}

/**
 * Lọc nguyên liệu rơi ngẫu nhiên phù hợp với cảnh giới hiện tại
 */
function getRealmAppropriateItems(realmIndex: number): {
  herbs: typeof DEFAULT_HERBS;
  ores: typeof DEFAULT_ORES;
} {
  // Realm 0-2 (Luyện Khí, Trúc Cơ, Kim Đan): Nhất - Nhị Giai
  if (realmIndex <= 2) {
    return {
      herbs: DEFAULT_HERBS.filter(h => h.grade === 'Nhất Giai' || h.grade === 'Nhị Giai'),
      ores: DEFAULT_ORES.filter(o => o.grade === 'Nhất Giai' || o.grade === 'Nhị Giai')
    };
  }
  // Realm 3-5 (Nguyên Anh, Hóa Thần, Luyện Hư): Nhị - Tứ Giai
  if (realmIndex <= 5) {
    return {
      herbs: DEFAULT_HERBS.filter(h => h.grade === 'Nhị Giai' || h.grade === 'Tam Giai' || h.grade === 'Tứ Giai'),
      ores: DEFAULT_ORES.filter(o => o.grade === 'Nhị Giai' || o.grade === 'Tam Giai' || o.grade === 'Tứ Giai')
    };
  }
  // Realm 6+ (Hợp Thể trở lên): Tứ Giai - Thần Giai
  return {
    herbs: DEFAULT_HERBS.filter(h => h.grade === 'Tứ Giai' || h.grade === 'Ngũ Giai' || h.grade === 'Thần Giai'),
    ores: DEFAULT_ORES.filter(o => o.grade === 'Tứ Giai' || o.grade === 'Thần Giai')
  };
}

/**
 * Sinh danh sách bảo vật rơi ngẫu nhiên khi bế quan ngoại tuyến
 * Cứ mỗi 30-45 phút có tỷ lệ ngưng tụ dược liệu hoặc quặng
 */
function generateOfflineDrops(player: PlayerStats, creditedSeconds: number): OfflineProgressItem[] {
  const creditedMinutes = creditedSeconds / 60;
  const numChecks = Math.floor(creditedMinutes / 45); // Mỗi 45 phút 1 đợt
  if (numChecks <= 0) return [];

  const { herbs, ores } = getRealmAppropriateItems(player.currentRealm || 0);
  const herbPool = herbs.length > 0 ? herbs : DEFAULT_HERBS;
  const orePool = ores.length > 0 ? ores : DEFAULT_ORES;

  const itemMap = new Map<string, OfflineProgressItem>();
  const khiVan = player.khiVan || 10;
  const dropChance = Math.min(85, 45 + khiVan * 0.5); // Tỷ lệ rơi dựa trên khí vận

  for (let i = 0; i < numChecks; i++) {
    if (Math.random() * 100 < dropChance) {
      const isHerb = Math.random() < 0.6; // 60% Thảo dược, 40% Khoáng thạch
      if (isHerb) {
        const picked = herbPool[Math.floor(Math.random() * herbPool.length)];
        const qty = Math.random() < 0.3 ? 2 : 1;
        const key = `herb_${picked.id}`;
        if (itemMap.has(key)) {
          itemMap.get(key)!.quantity += qty;
        } else {
          itemMap.set(key, {
            id: picked.id,
            name: picked.name,
            type: 'herb',
            quantity: qty,
            quality: 'thuong_pham'
          });
        }
      } else {
        const picked = orePool[Math.floor(Math.random() * orePool.length)];
        const qty = Math.random() < 0.3 ? 2 : 1;
        const key = `ore_${picked.id}`;
        if (itemMap.has(key)) {
          itemMap.get(key)!.quantity += qty;
        } else {
          itemMap.set(key, {
            id: picked.id,
            name: picked.name,
            type: 'ore',
            quantity: qty,
            quality: 'thuong_pham'
          });
        }
      }
    }
  }

  return Array.from(itemMap.values());
}

/**
 * Hàm tính toán chính: Đánh giá tiến độ ngoại tuyến kể từ `lastActiveTimestamp`
 * Trả về `OfflineProgressResult` nếu đủ điều kiện (>= 60 giây), ngược lại trả về `null`
 */
export function calculateOfflineProgress(
  player: PlayerStats,
  now: number = Date.now()
): OfflineProgressResult | null {
  const lastActive = player.lastActiveTimestamp;
  if (!lastActive || typeof lastActive !== 'number') {
    return null;
  }

  const elapsedSeconds = Math.max(0, Math.floor((now - lastActive) / 1000));
  // Yêu cầu tối thiểu 60 giây để tránh pop-up khi refresh trang nhanh
  if (elapsedSeconds < 60) {
    return null;
  }

  // 1. Giới hạn thời gian (Cap)
  const { maxCapSeconds } = calculateOfflineMaxCap(player);
  const creditedSeconds = Math.min(elapsedSeconds, maxCapSeconds);
  const isCapped = elapsedSeconds > maxCapSeconds;
  const creditedMinutes = creditedSeconds / 60;

  // 2. Tính Tu Vi (Hiệu suất 75% so với bế quan chủ động)
  const speedMultiplier = calculateOfflineSpeedMultiplier(player, now);
  const baseTuViPerMinute = calculateCultivationSpeed(
    player.currentRealm || 0,
    player.canCot || 10,
    0
  );
  const baseMeditationBonus = (player.cultivationBuffState?.meditationEfficiencyModifier || 0) / 100;
  
  // Hiệu suất gia tốc hấp thu tu vi ngoại tuyến từ Trùng Chú Trận Bàn (offlineAbsorptionBonus)
  let offlineAbsorptionBonus = 0;
  if (player.cultivationBuffState?.activeArrays) {
    player.cultivationBuffState.activeArrays.forEach((arr) => {
      if (arr && (arr.isPermanent || arr.expiresAt === Infinity || arr.expiresAt > now)) {
        if (arr.offlineAbsorptionBonus && arr.offlineAbsorptionBonus > 0) {
          offlineAbsorptionBonus += arr.offlineAbsorptionBonus;
        }
      }
    });
  }
  if (player.equippedFormation?.offlineAbsorptionBonus) {
    offlineAbsorptionBonus += player.equippedFormation.offlineAbsorptionBonus;
  }
  if (player.customSanctuary) {
    const sanctuaryBuffs = getCustomSanctuaryBuffTotals(player.customSanctuary);
    if (sanctuaryBuffs.offlineAbsorptionBonus) {
      offlineAbsorptionBonus += sanctuaryBuffs.offlineAbsorptionBonus;
    }
  }

  const offlineTuViEfficiency = 0.75 * (1 + baseMeditationBonus + offlineAbsorptionBonus);
  const tuViGained = Math.max(1, Math.floor(baseTuViPerMinute * speedMultiplier * creditedMinutes * offlineTuViEfficiency));

  // 3. Tính Linh Thạch (Thổ nạp thiên địa linh khí ngưng tụ linh thạch)
  const baseLinhThach = calculateCultivationReward(
    player.currentRealm || 0,
    creditedMinutes,
    player.khiVan || 10
  );
  const linhThachGained = Math.max(0, Math.floor(baseLinhThach * 0.65));

  // 4. Tiến độ Dược Điền (Linh Điền)
  let maturedPlotsCount = 0;
  let updatedLinhDien: LinhDienState | undefined = undefined;

  if (player.linhDien && Array.isArray(player.linhDien.plots)) {
    let hasChanges = false;
    const newPlots = player.linhDien.plots.map(plot => {
      if (plot.seedId && plot.harvestAt && !plot.readyToHarvest) {
        if (now >= plot.harvestAt) {
          maturedPlotsCount++;
          hasChanges = true;
          return {
            ...plot,
            readyToHarvest: true
          };
        }
      }
      return plot;
    });

    if (hasChanges) {
      updatedLinhDien = {
        ...player.linhDien,
        plots: newPlots
      };
    }
  }

  // 5. Cơ duyên nhặt thảo dược / khoáng thạch
  const bonusItems = generateOfflineDrops(player, creditedSeconds);

  // 6. Mô phỏng phòng ngự Tinh Hải ngoại tuyến (Đồng bộ hai chiều với Trận Pháp Liên Kết)
  let updatedCosmicState = undefined;
  let cosmicDefenseReports = undefined;
  if (player.cosmicState && player.cosmicState.unlocked && player.cosmicState.defenseState) {
    const defenseOutcome = resolveOfflineCosmicDefense(player.cosmicState, player, now);
    if (defenseOutcome.reports.length > 0) {
      updatedCosmicState = defenseOutcome.nextCosmicState;
      cosmicDefenseReports = defenseOutcome.reports;
    }
  }

  // 7. Đồng Bộ Hai Chiều Với Khố Phòng & Ngoại Tuyến (Offline Spirit Mountains Yield Sync)
  let updatedCustomSectState = undefined;
  let sectWarOfflineYield = undefined;
  if (
    player.customSectState &&
    player.customSectState.isFounded &&
    player.customSectState.wildSpiritMountains &&
    player.customSectState.wildSpiritMountains.length > 0
  ) {
    const controlledMountains = player.customSectState.wildSpiritMountains.filter(
      m => m.controllingSectId === 'player_sect'
    );
    if (controlledMountains.length > 0) {
      const yields = calculateMountainYields(controlledMountains, creditedSeconds);
      if (yields.spiritStonesGained > 0 || Object.keys(yields.herbsGained).length > 0) {
        const currentVault = player.customSectState.sectVault || {
          linhThach: 0,
          herbs: {},
          ores: {},
          lastHarvestTimestamp: now
        };
        const nextVaultHerbs = { ...(currentVault.herbs || {}) };
        Object.entries(yields.herbsGained).forEach(([herbName, count]) => {
          nextVaultHerbs[herbName] = (nextVaultHerbs[herbName] || 0) + count;
        });

        updatedCustomSectState = {
          ...player.customSectState,
          reputation: player.customSectState.reputation + yields.sectExpGained,
          sectVault: {
            ...currentVault,
            linhThach: (currentVault.linhThach || 0) + yields.spiritStonesGained,
            herbs: nextVaultHerbs,
            lastHarvestTimestamp: now
          }
        };

        sectWarOfflineYield = {
          spiritStones: yields.spiritStonesGained,
          herbs: yields.herbsGained,
          sectExp: yields.sectExpGained,
          controlledMountainsCount: controlledMountains.length
        };
      }
    }
  }

  // 6. Tiến độ Thiên Địa Nhập Định (nếu người chơi đang ở trạng thái nhập định)
  let meditationOfflineResult = undefined;
  if (player.meditationState?.isMeditating && player.meditationState.startTime > 0) {
    meditationOfflineResult = resolveOfflineMeditationProgress(
      player,
      player.meditationState.startTime,
      now,
      player.meditationState.locationId || player.meditationLocationId || 'linh_mach_tong_mon',
      player.meditationState.stance || player.meditationStance || 'co_ban',
      player.meditationState.wardItemId || player.equippedWardItemId,
      {
        companionId: player.meditationState.accompanyingCompanionId ?? player.accompanyingCompanionId,
        beastId: player.meditationState.accompanyingBeastId ?? player.accompanyingBeastId
      }
    );
  }

  // 7. Tiêu trừ Đan Độc / Ma Tính thụ động từ Linh Mạch Động Phủ (nếu không nhập định)
  let offlinePillToxicityCleansed = 0;
  let offlineDemonicCleansed = 0;
  if (player.customSanctuary && !player.meditationState?.isMeditating) {
    const sanctuaryBuffs = getCustomSanctuaryBuffTotals(player.customSanctuary);
    const creditedHours = creditedMinutes / 60;
    if (sanctuaryBuffs.pillToxicityCleansePerHour) {
      offlinePillToxicityCleansed = Math.floor(sanctuaryBuffs.pillToxicityCleansePerHour * creditedHours);
    }
    if (sanctuaryBuffs.demonicCleansePerHour) {
      offlineDemonicCleansed = Math.floor(sanctuaryBuffs.demonicCleansePerHour * creditedHours);
    }
  }

  return {
    elapsedSeconds,
    creditedSeconds,
    maxCapSeconds,
    isCapped,
    tuViGained,
    linhThachGained,
    maturedPlotsCount,
    bonusItems,
    updatedLinhDien,
    updatedCosmicState,
    cosmicDefenseReports,
    updatedCustomSectState,
    sectWarOfflineYield,
    meditationOfflineResult,
    offlinePillToxicityCleansed,
    offlineDemonicCleansed
  };
}
