// lib/game-logic/cultivation.ts
import {
  PlayerStats,
  Realm,
  CultivationSession,
  CultivateStance,
  BeastEgg,
  Manual,
  RandomEvent
} from '@/lib/types';
import {
  calculateCultivationSpeed,
  calculateCultivationReward,
  calculateBreakthroughChance,
  calculateTamMaChance,
  calculateThienKiepDifficulty,
  calculateBreakthroughRewards,
  calculateEventChance,
  GAME_CONSTANTS,
  calculateEffectiveRequiredTuVi
} from '@/lib/game-constants';
import { hasMilestonePerk, isMajorBreakthroughRealm } from '@/lib/attribute-perks';
import { createRandomEgg } from '@/lib/beast-data';
import { getManualSynergy } from '@/lib/elemental-system';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { TITLES_CONFIG } from '@/lib/achievements-data';
import { calculateBreakthroughSuccessModifier } from '@/lib/soul-logic';
import { getBreakthroughTalismanModifier } from '@/lib/talisman-logic';
import { getOccupiedVeinsBuffs } from '@/lib/sect-logic';
import { getCultivationShopPermanentSpeedBonus } from '@/lib/cultivation-shop-data';
import { getCustomSanctuaryBuffTotals } from '@/lib/custom-sanctuary-logic';
import {
  resolveBreakthroughFailureBacklash,
  recordBacklashToInjuryState
} from '@/lib/breakthrough-backlash-logic';
import { BacklashResolutionResult } from '@/lib/types/breakthrough-backlash';
import { checkIsMajorRealmTransition } from '@/lib/dao-foundation-logic';
import { MajorRealmTransitionConfig } from '@/lib/types/dao-foundation';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as { id: number }[];

// TU LUYỆN (CULTIVATION)
// ============================================

export function processCultivation(
  player: PlayerStats,
  duration: number, // minutes
  realms: Realm[],
  stance: CultivateStance = 'co_ban'
): CultivationSession {
  // Manuals speed bonus (Tâm Pháp Nội Công với Synergy)
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

  // Buff "Tâm Thần Hợp Nhất" từ Song Tu Thổ Nạp (Tăng 20% tốc độ tu luyện bế quan 12 giờ)
  const isTamThanActive = Boolean(
    player.companionsState?.tamThanHopNhatUntil && Date.now() < player.companionsState.tamThanHopNhatUntil
  );
  const tamThanSpeedBonus = isTamThanActive ? 0.20 : 0;

  // Buff Thiên Cơ Quẻ Mệnh:
  // [Đại Cát / Thượng Cát]: Tăng 30% tốc độ tu luyện bế quan thổ nạp
  let divinationSpeedBonus = 0;
  if (player.dailyDivination?.hexagram === 'dai_cat' || player.dailyDivination?.hexagram === 'thuong_cat') {
    divinationSpeedBonus = 0.30;
  } else if (player.dailyDivination?.hexagram === 'dai_hung') {
    divinationSpeedBonus = -0.15;
  }

  // Buff Tọa Kỵ Linh Thú (Mount Mode): Giảm 20% thời gian bế quan (tương ứng tăng 20-25% tốc độ tu luyện)
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

  // Buff Danh Hiệu Tiên Giới
  let titleSpeedBonus = 0;
  const equippedTitle = player.achievementsState?.equippedTitleId;
  if (equippedTitle && TITLES_CONFIG[equippedTitle]?.buffs?.cultivateSpeedBonusPercent) {
    titleSpeedBonus = (TITLES_CONFIG[equippedTitle].buffs.cultivateSpeedBonusPercent || 0) / 100;
  }

  // Buff Tụ Linh Trận (Động Thiên Phúc Địa)
  let spiritArrayBonus = 0;
  if (player.abodeState?.spiritArray?.tuViRateBonus) {
    spiritArrayBonus = (player.abodeState.spiritArray.tuViRateBonus || 0) / 100;
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
    const now = Date.now();
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

  const totalSpeedMultiplier = Math.max(
    0.2,
    1 + sectBonus + manualSpeedBonus + linhCanSpeedBonus + physiqueSpeedBonus +
    companionSpeedBonus + tamThanSpeedBonus + divinationSpeedBonus + mountBeastBonus + titleSpeedBonus + spiritArrayBonus + veinTuViBonus + rebornTuViBonus +
    cultShopArrayBonus + cultShopManualBonus + sanctuaryTuViBonus
  );

  // Tính tu vi gain
  const baseTuViPerMinute = calculateCultivationSpeed(
    player.currentRealm,
    player.canCot,
    0
  );
  const tuViPerMinute = Math.max(1, Math.floor(baseTuViPerMinute * totalSpeedMultiplier));
  
  // Áp dụng hệ số theo Tâm Pháp Bế Quan: Thế 2 (Đốn Ngộ Hiểm Cảnh) tăng 50% Tu Vi
  const stanceMultiplier = stance === 'hiem_canh' ? 1.5 : 1.0;
  const totalTuViGain = Math.floor(tuViPerMinute * duration * stanceMultiplier);
  
  // Tính linh thạch gain
  const linhThachGain = calculateCultivationReward(
    player.currentRealm,
    duration,
    player.khiVan
  );
  
  // Check random events
  const randomEvents: RandomEvent[] = [];
  const eventChance = calculateEventChance(player.khiVan);
  
  const numEventChecks = Math.floor(duration / 30);
  for (let i = 0; i < numEventChecks; i++) {
    if (Math.random() * 100 < eventChance) {
      // Event checks
    }
  }
  
  return {
    duration,
    tuViGain: totalTuViGain,
    randomEvents,
    stance,
    stanceMultiplier
  };
}

// ============================================

// ĐỘT PHÁ (BREAKTHROUGH)
// ============================================

export interface BreakthroughResult {
  success: boolean;
  tamMaEncountered: boolean;
  tamMaPassed?: boolean;
  thienKiepEncountered: boolean;
  thienKiepPassed?: boolean;
  isMajorTransition?: boolean;
  majorTransitionConfig?: MajorRealmTransitionConfig | null;
  newRealm?: number;
  rewards?: {
    tuVi: number;
    linhThach: number;
    danhVong: number;
  };
  penalties?: {
    tuVi: number;
    linhThach?: number;
    tamCanh?: number;
    hpLoss?: number;
    backlashType?: string;
  };
  backlashResolution?: BacklashResolutionResult;
  message: string;
  flavorText: string;
}

export function attemptBreakthrough(
  player: PlayerStats,
  nextRealm: Realm,
  itemBonus: number = 0
): BreakthroughResult {
  // Pre-condition Gate: Kinh mạch trọng thương
  if (player.injuryState?.isInjured) {
    return {
      success: false,
      tamMaEncountered: false,
      thienKiepEncountered: false,
      message: 'Kinh mạch đang trọng thương, không thể cưỡng ép phá cảnh!',
      flavorText: 'Kinh mạch đang trọng thương, không thể cưỡng ép phá cảnh! Hãy tu dưỡng thương thế hoặc dùng linh dược trị thương trước khi trùng kích cảnh giới.'
    };
  }

  const currentRealm = Math.max(
    0,
    parseInt(String(player?.currentRealm ?? 0), 10) || 0
  );
  const nextRealmId = typeof nextRealm === 'object' && nextRealm !== null ? nextRealm.id : (currentRealm + 1);
  const majorTransition = checkIsMajorRealmTransition(currentRealm, nextRealmId);

  // Gate: Chặn đột phá tiểu cảnh giới nếu chạm ngưỡng Đại Cảnh Giới
  if (majorTransition) {
    return {
      success: false,
      tamMaEncountered: false,
      thienKiepEncountered: false,
      isMajorTransition: true,
      majorTransitionConfig: majorTransition,
      message: `Ngưỡng cửa [${majorTransition.transitionName}] là Đại Cảnh Giới!`,
      flavorText: `Đây là mốc chuyển giao Đại Cảnh Giới [${majorTransition.transitionName}]! Ngươi cần chọn Phẩm Vị Đạo Cơ (Hạ Phẩm, Địa Phẩm, hoặc Thiên Đạo) để ngưng tụ đạo đài vững chắc, không thể bấm nút đột phá tiểu cảnh giới đơn thuần.`
    };
  }
  
  // Tính tu vi cần thiết (Áp dụng Thể chất, Mệnh cách, và Perk Nhất Niệm Thông Thiên -15%)
  const effectiveRequiredTuVi = calculateEffectiveRequiredTuVi(player, nextRealm);

  // Check requirements
  if (player.tuVi < effectiveRequiredTuVi) {
    const hasNhatNiem = (player.ngoTinh || 0) >= 80;
    return {
      success: false,
      tamMaEncountered: false,
      thienKiepEncountered: false,
      message: 'Tu vi chưa đủ để đột phá!',
      flavorText: hasNhatNiem
        ? `Nhất Niệm Thông Thiên đã giảm 15% tu vi! Nhưng vẫn cần tới ${effectiveRequiredTuVi.toLocaleString()} tu vi để ngưng tụ đạo quả.`
        : 'Cơ sở chưa vững, cưỡng ép đột phá chỉ có hại mà thôi.'
    };
  }
  
  if (player.linhThach < nextRealm.requirements.linhThach) {
    return {
      success: false,
      tamMaEncountered: false,
      thienKiepEncountered: false,
      message: 'Hạ Phẩm Linh Thạch không đủ!',
      flavorText: 'Đột phá cần nhiều linh dược hỗ trợ. Cần gom thêm Hạ Phẩm Linh Thạch.'
    };
  }
  
  // Consume linh thạch
  const linhThachCost = nextRealm.requirements.linhThach;
  
  // Check Tâm Ma (Thuần Dương Vô Cực Thể giảm 50% tỉ lệ gặp Tâm Ma, Thần Hồn giảm nguy cơ và tăng kháng)
  const soulMod = calculateBreakthroughSuccessModifier(player.soulState);
  const talismanMod = getBreakthroughTalismanModifier(player);
  let tamMaEncountered = false;
  let tamMaPassed = false;
  
  if (currentRealm >= GAME_CONSTANTS.TAM_MA_APPEAR_FROM) {
    const isTamTinhActive = Boolean(
      player.activeBuffs?.tamTinhThanDieu ||
      (player.companionsState?.tamTinhThanDieuUntil && Date.now() < player.companionsState.tamTinhThanDieuUntil)
    );
    const compBuffs = getBondedCompanionBuffs(player);

    let tamMaChance = calculateTamMaChance(currentRealm, player.tamCanh);
    if (player.physique?.tamMaChanceMultiplier) {
      tamMaChance *= player.physique.tamMaChanceMultiplier;
    }
    if (player.destiny?.effects?.tamMaChanceMultiplier) {
      tamMaChance *= player.destiny.effects.tamMaChanceMultiplier;
    }
    if (isTamTinhActive) {
      tamMaChance *= 0.5; // Giảm 50% nguy cơ gặp Tâm Ma từ Tâm Tịnh Thần Diệu (Song Tu)
    }
    if (soulMod.tamMaChanceReduction > 0) {
      tamMaChance *= (1 - soulMod.tamMaChanceReduction / 100);
    }

    // Quẻ Hung / Đại Hung: Tăng 25% nguy cơ gặp Tâm Ma phản phệ khi Bế quan / Đột phá
    if (player.dailyDivination?.hexagram === 'hung' || player.dailyDivination?.hexagram === 'dai_hung') {
      tamMaChance *= 1.25;
    }

    // Tác động trực tiếp từ Ma Tính (Demonic Nature): Ma tính càng cao, tâm ma quấy nhiễu càng lớn (+0.3% mỗi điểm Ma Tính)
    if (player.demonicNature && player.demonicNature > 0) {
      tamMaChance += (player.demonicNature * 0.3);
    }

    if (Math.random() * 100 < tamMaChance) {
      tamMaEncountered = true;
      // Tâm ma check
      const tamMaResistChance = Math.min(98, 50 + (player.tamCanh - 50) * 0.5 + soulMod.successRateBonus + talismanMod.tamMaResistBonus);
      tamMaPassed = Math.random() * 100 < tamMaResistChance;
      
      if (!tamMaPassed) {
        let tuViLoss = Math.floor(player.tuVi * 0.15);
        let tamCanhLoss = 10;
        if (compBuffs.tamMaDamageReduction) {
          tuViLoss = Math.floor(tuViLoss * (1 - compBuffs.tamMaDamageReduction / 100)); // -20% sát thương Tâm Ma từ Lạc Thanh Tuyết
          tamCanhLoss = Math.max(1, Math.floor(tamCanhLoss * (1 - compBuffs.tamMaDamageReduction / 100)));
        }
        if (isTamTinhActive) {
          tuViLoss = Math.floor(tuViLoss * 0.5); // Giảm 50% sát thương phản phệ từ Tâm Tịnh Thần Diệu
          tamCanhLoss = Math.max(1, Math.floor(tamCanhLoss * 0.5));
        }
        if (soulMod.tribulationDamageReduction > 0) {
          tuViLoss = Math.floor(tuViLoss * (1 - soulMod.tribulationDamageReduction / 100));
        }
        if (talismanMod.tribulationReduction > 0) {
          tuViLoss = Math.floor(tuViLoss * (1 - talismanMod.tribulationReduction / 100));
        }

        return {
          success: false,
          tamMaEncountered: true,
          tamMaPassed: false,
          thienKiepEncountered: false,
          penalties: {
            tuVi: tuViLoss,
            linhThach: linhThachCost,
            tamCanh: tamCanhLoss
          },
          message: 'Đột phá thất bại! Bị tâm ma xâm nhập!',
          flavorText: '\"Ngươi không xứng đáng...\" Giọng nói ma mị vang lên. Nhờ có Đạo Lữ hộ trì, phản phệ đã được giảm thiểu đáng kể.'
        };
      }
    }
  }
  
  // Check Thiên Kiếp
  let thienKiepEncountered = false;
  let thienKiepPassed = false;
  
  if (nextRealm.requirements.thienKiep) {
    thienKiepEncountered = true;
    const kiepDifficulty = calculateThienKiepDifficulty(currentRealm);
    
    // Tính khả năng vượt kiếp dựa vào tu vi và tâm cảnh + thể chất + mệnh cách
    const physiqueDefenseMod = player.physique ? ((player.physique.defenseBonusPercent || 0) / 100) : 0;
    const destinyDefMod = (player.destiny?.effects?.defBonusPercent || 0) / 100;
    const kiepPassChance = 
      kiepDifficulty.survivability * 
      (0.8 + player.tamCanh / 500) *
      (0.9 + player.khiVan / 1000) *
      (1 + (physiqueDefenseMod + destinyDefMod) * 0.5);
    
    thienKiepPassed = Math.random() * 100 < kiepPassChance;
    
    if (!thienKiepPassed) {
      let tuViLossKiep = Math.floor(player.tuVi * 0.2);
      if (talismanMod.tribulationReduction > 0) {
        tuViLossKiep = Math.floor(tuViLossKiep * (1 - talismanMod.tribulationReduction / 100));
      }
      return {
        success: false,
        tamMaEncountered,
        tamMaPassed,
        thienKiepEncountered: true,
        thienKiepPassed: false,
        penalties: {
          tuVi: tuViLossKiep,
          linhThach: linhThachCost
        },
        message: 'Thiên kiếp quá mạnh! Đột phá thất bại!',
        flavorText: `Trời đổ xuống ${kiepDifficulty.waves} đợt thiên lôi! Ngươi không thể chống đỡ, thân thể bị thiên lôi đánh rạn nứt...${talismanMod.hasTalisman ? ` Nhờ có [${talismanMod.talismanItem?.name}] triệt tiêu ${talismanMod.tribulationReduction}% tổn thất!` : ''}`
      };
    }
  }
    
    // Calculate breakthrough success chance with destiny bonus (Thiên Mệnh Chi Tử +20%, Hỗn Độn Đạo Thể +15%)
    let destinyBreakthroughBonus = player.destiny?.effects?.breakthroughRateBonus || 0;
    if (player.destiny?.effects?.noBottleneck) {
      destinyBreakthroughBonus += 15;
    }

    // Quẻ Đại Cát / Thượng Cát: Tăng 20% tỉ lệ thành công khi Đột Phá cảnh giới
    let divinationBreakthroughBonus = 0;
    if (player.dailyDivination?.hexagram === 'dai_cat' || player.dailyDivination?.hexagram === 'thuong_cat') {
      divinationBreakthroughBonus = 20;
    }

    const rawBaseChance = calculateBreakthroughChance(
      currentRealm,
      player.ngoTinh,
      player.khiVan,
      itemBonus
    );
    // Độ Tinh Khiết Chân Nguyên tác động trực tiếp lên tỷ lệ đột phá: breakthroughChance = baseChance * (qiPurity / 100)
    const qiPurityPercent = typeof player.qiPurity === 'number' ? Math.max(10, Math.min(100, player.qiPurity)) : 100;
    const baseChance = Math.floor(rawBaseChance * (qiPurityPercent / 100));

    // Ma Tính quá cao làm tâm cảnh dao động, giảm tối đa 20% tỉ lệ đột phá thành công
    const demonicPenalty = player.demonicNature ? Math.floor(player.demonicNature * 0.2) : 0;
    const successChance = Math.min(98, Math.max(1, baseChance + destinyBreakthroughBonus + divinationBreakthroughBonus + soulMod.successRateBonus + talismanMod.successRateBonus - demonicPenalty));
  
  const breakthroughSuccess = Math.random() * 100 < successChance;
  
  if (breakthroughSuccess) {
    const rewards = calculateBreakthroughRewards(currentRealm + 1);
    
    return {
      success: true,
      tamMaEncountered,
      tamMaPassed: tamMaEncountered ? tamMaPassed : undefined,
      thienKiepEncountered,
      thienKiepPassed: thienKiepEncountered ? thienKiepPassed : undefined,
      newRealm: currentRealm + 1,
      rewards,
      message: 'Đột phá thành công!',
      flavorText: nextRealm.successText
    };
  } else {
      const isTamTinhActive = Boolean(
        player.activeBuffs?.tamTinhThanDieu ||
        (player.companionsState?.tamTinhThanDieuUntil && Date.now() < player.companionsState.tamTinhThanDieuUntil)
      );

      const toxicity = (player as any).danDoc ?? (player as any).toxicity ?? 0;
      const currentHp = player.khiHuyet ?? 1000;
      const targetRealmName = nextRealm.name || `Cảnh Giới ${currentRealm + 1}`;

      const backlash = resolveBreakthroughFailureBacklash(
        currentHp,
        player.tuVi,
        toxicity,
        targetRealmName
      );

      let penaltyTuVi = backlash.tuviLoss;
      if (isTamTinhActive) {
        penaltyTuVi = Math.floor(penaltyTuVi * 0.5); // Giảm 50% sát thương phản phệ
      }

      // Áp dụng debuff trọng thương / tâm ma nếu có
      if (backlash.isInjuredApplied || backlash.isBottleneckApplied) {
        player.injuryState = recordBacklashToInjuryState(
          player.injuryState,
          backlash,
          targetRealmName,
          toxicity
        );
      }
      if (player.khiHuyet !== undefined) {
        player.khiHuyet = backlash.resultingHp;
      }

      return {
        success: false,
        tamMaEncountered,
        tamMaPassed: tamMaEncountered ? tamMaPassed : undefined,
        thienKiepEncountered,
        thienKiepPassed: thienKiepEncountered ? thienKiepPassed : undefined,
        penalties: {
          tuVi: penaltyTuVi,
          linhThach: linhThachCost,
          hpLoss: backlash.hpLoss,
          backlashType: backlash.backlashType
        },
        backlashResolution: backlash,
        message: 'Đột phá thất bại!',
        flavorText: isTamTinhActive
          ? `${backlash.logMessage} (Có buff [Tâm Tịnh Thần Diệu] hộ thể, tổn thất tu vi đã giảm một nửa!)`
          : backlash.logMessage
      };
  }
}

// ============================================

export interface CanBreakthroughResult {
  canBreak: boolean;
  reason?: string;
  isMajorTransition?: boolean;
  majorTransitionConfig?: MajorRealmTransitionConfig | null;
}

export function canBreakthrough(
  player: PlayerStats,
  nextRealm: Realm
): CanBreakthroughResult {
  const currentRealmId = typeof player.currentRealm === 'object' && player.currentRealm !== null
    ? (player.currentRealm as any).id
    : player.currentRealm ?? 0;
  const nextRealmId = typeof nextRealm === 'object' && nextRealm !== null ? nextRealm.id : nextRealm;
  const majorTransition = checkIsMajorRealmTransition(currentRealmId, nextRealmId);

  // Pre-condition Gate: Trọng thương
  if (player.injuryState?.isInjured) {
    return {
      canBreak: false,
      reason: 'Kinh mạch đang trọng thương, không thể cưỡng ép phá cảnh!',
      isMajorTransition: Boolean(majorTransition),
      majorTransitionConfig: majorTransition
    };
  }

  const effectiveRequiredTuVi = calculateEffectiveRequiredTuVi(player, nextRealm);

  if (player.tuVi < effectiveRequiredTuVi) {
    const hasNhatNiem = (player.ngoTinh || 0) >= 80;
    return {
      canBreak: false,
      reason: `Cần ${effectiveRequiredTuVi.toLocaleString()} tu vi (hiện tại: ${player.tuVi.toLocaleString()})${hasNhatNiem ? ' [Nhất Niệm Thông Thiên -15% Tu Vi]' : ''}`,
      isMajorTransition: Boolean(majorTransition),
      majorTransitionConfig: majorTransition
    };
  }
  
  if (player.linhThach < nextRealm.requirements.linhThach) {
    return {
      canBreak: false,
      reason: `Cần ${nextRealm.requirements.linhThach.toLocaleString()} Hạ Phẩm Linh Thạch (hiện tại: ${player.linhThach.toLocaleString()} Hạ Phẩm Linh Thạch)`,
      isMajorTransition: Boolean(majorTransition),
      majorTransitionConfig: majorTransition
    };
  }

  // Điều Hướng Đột Phá Đại Cảnh Giới:
  // Nếu là Đại Cảnh Giới: Đánh dấu cờ isMajorTransition: true, yêu cầu người chơi
  // phải chọn Phẩm Vị Đạo Cơ thay vì cho phép bấm nút đột phá tiểu cảnh giới đơn thuần.
  if (majorTransition) {
    return {
      canBreak: false,
      isMajorTransition: true,
      majorTransitionConfig: majorTransition,
      reason: `Ngưỡng cửa [${majorTransition.transitionName}] là Đại Cảnh Giới! Cần tiến hành ngưng tụ Phẩm Vị Đạo Cơ (Hạ Phẩm / Địa Phẩm / Thiên Đạo) thay vì đột phá tiểu cảnh giới đơn thuần.`
    };
  }
  
  return {
    canBreak: true,
    isMajorTransition: false,
    majorTransitionConfig: null
  };
}

export const executeBreakthrough = attemptBreakthrough;


