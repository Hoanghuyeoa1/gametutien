// lib/meditation-guardian-logic.ts
// Pure Business Logic: Đạo Lữ & Linh Thú Hộ Pháp (Companion & Beast Meditation Assistance)
// Tuân thủ Clean Architecture, 100% không phụ thuộc React hooks hay UI.

import { PlayerStats } from '@/lib/types';
import {
  MeditationStanceType,
  MeditationLocationConfig,
  MeditationEventLog,
  GuardianGrowthResult,
  GuardianRescueIncident
} from '@/lib/types/meditation';
import { CompanionDefinition } from '@/lib/types/companions';
import { SpiritBeast } from '@/lib/types/beasts';
import { COMPANIONS_MAP } from '@/lib/companions-data';

/**
 * Chuẩn hóa tên hệ nguyên tố để so sánh cộng hưởng
 */
export function normalizeElement(elem?: string | null): string {
  if (!elem) return '';
  const clean = elem.trim().toLowerCase();
  if (clean.includes('kim')) return 'Kim';
  if (clean.includes('mộc') || clean.includes('moc')) return 'Mộc';
  if (clean.includes('thủy') || clean.includes('thuy') || clean.includes('băng')) return 'Thủy';
  if (clean.includes('hỏa') || clean.includes('hoa') || clean.includes('lửa')) return 'Hỏa';
  if (clean.includes('thổ') || clean.includes('tho') || clean.includes('đất')) return 'Thổ';
  if (clean.includes('lôi') || clean.includes('loi') || clean.includes('sấm')) return 'Lôi';
  if (clean.includes('phong') || clean.includes('gió')) return 'Phong';
  if (clean.includes('hỗn độn') || clean.includes('hon don')) return 'Hỗn Độn';
  if (clean.includes('âm dương') || clean.includes('am duong')) return 'Âm Dương';
  return elem.trim();
}

/**
 * 1. Thẩm định tư cách Hộ Pháp của Đạo Lữ và Linh Thú
 */
export function validateMeditationGuardians(
  player: PlayerStats,
  companionId?: string | null,
  beastId?: string | null,
  now: number = Date.now()
): {
  validCompanion: boolean;
  validBeast: boolean;
  companionReason?: string;
  beastReason?: string;
} {
  let validCompanion = true;
  let companionReason: string | undefined;

  if (companionId) {
    const compState = player.companionsState?.companions?.[companionId];
    if (!compState) {
      validCompanion = false;
      companionReason = 'Đạo Lữ chưa được kết duyên hoặc không tồn tại!';
    } else if (!compState.isBonded) {
      validCompanion = false;
      companionReason = 'Đạo Lữ chưa kết thành Đạo Lữ Khế Ước!';
    } else if (compState.fatigueUntil && compState.fatigueUntil > now) {
      const remainMin = Math.max(1, Math.ceil((compState.fatigueUntil - now) / 60000));
      validCompanion = false;
      companionReason = `Đạo Lữ đang kiệt sức tĩnh dưỡng (còn ${remainMin} phút)!`;
    } else if (compState.isAssignedToMeditation) {
      validCompanion = false;
      companionReason = 'Đạo Lữ đang tham gia phiên hộ pháp khác!';
    }
  }

  let validBeast = true;
  let beastReason: string | undefined;

  if (beastId) {
    const allBeasts = player.beastGarden?.beasts || player.beasts || [];
    const beast = allBeasts.find(b => b && b.id === beastId);
    if (!beast) {
      validBeast = false;
      beastReason = 'Linh Thú không tồn tại trong Thú Uyển!';
    } else if (beast.isLockedInBreeding) {
      validBeast = false;
      beastReason = 'Linh Thú đang bị khóa trong buồng phối giống!';
    } else if (beast.isAssignedToMeditation) {
      validBeast = false;
      beastReason = 'Linh Thú đang tham gia phiên hộ pháp khác!';
    }
  }

  return {
    validCompanion,
    validBeast,
    companionReason,
    beastReason
  };
}

/**
 * 2. Kiểm tra Cộng Hưởng Thuộc Tính Linh Địa (Elemental Resonance)
 */
export function checkElementalResonance(
  location: MeditationLocationConfig,
  companionElement?: string | null,
  beastElement?: string | null
): {
  hasResonance: boolean;
  matchingSources: string[];
  bonusMultiplier: number;
  description: string;
} {
  const locElem = normalizeElement(location.element);
  const matchingSources: string[] = [];

  if (companionElement && normalizeElement(companionElement) === locElem) {
    matchingSources.push('Đạo Lữ');
  }

  if (beastElement && normalizeElement(beastElement) === locElem) {
    matchingSources.push('Linh Thú');
  }

  const hasResonance = matchingSources.length > 0;
  const bonusMultiplier = hasResonance ? 1.15 : 1.0;
  const description = hasResonance
    ? `Cộng hưởng thuộc tính [${location.element}] từ ${matchingSources.join(' & ')}: +15% Tu Vi & Tỷ Lệ Dị Bảo!`
    : '';

  return {
    hasResonance,
    matchingSources,
    bonusMultiplier,
    description
  };
}

/**
 * 3. Thuật Toán Cứu Viện Khi Gặp Nguy Hiểm (Hazard Rescue & Interruption Prevention)
 * Thứ tự ưu tiên:
 *   Ưu tiên 1: Bùa Hộ Mệnh (100% miễn nhiễm)
 *   Ưu tiên 2: Đạo Lữ Hộ Pháp (Tỷ lệ >= 85%, tăng dần theo cảnh giới)
 *   Ưu tiên 3: Linh Thú Hộ Pháp (Tỷ lệ >= 75%, tăng dần theo tier và cấp độ)
 */
export function resolveGuardianHazardRescue(
  hour: number,
  stance: MeditationStanceType,
  wardItemId?: string | null,
  companion?: { id: string; name: string; realmIndex?: number } | null,
  beast?: { id: string; name: string; level?: number; tier?: number } | null,
  rngSeed?: number
): {
  defended: boolean;
  rescuer?: 'ward' | 'companion' | 'beast';
  log: MeditationEventLog;
  rescueIncident?: GuardianRescueIncident;
} {
  // Ưu tiên 1: Bùa Hộ Mệnh
  if (wardItemId) {
    return {
      defended: true,
      rescuer: 'ward',
      log: {
        hour,
        title: 'Hộ Trận Hiển Uy • Miễn Nhiễm Biến Cố',
        narrative: `Giờ thứ ${hour}: Khí Huyết Nghịch Chuyển giáng lâm, Bùa Hộ Thân phát quang hộ trì nguyên thần, bình an vô sự!`,
        rewardType: 'hazard',
        isHazardIncident: true,
        wasDefended: true
      }
    };
  }

  const rng = rngSeed !== undefined ? rngSeed : Math.random();

  // Ưu tiên 2: Đạo Lữ Hộ Pháp
  if (companion) {
    const realmIdx = companion.realmIndex || 0;
    // Tỷ lệ cơ bản 85% + tối đa 15% theo cảnh giới (tổng cộng 85% -> 100%)
    const successRate = Math.min(1.0, 0.85 + realmIdx * 0.015);

    if (rng < successRate) {
      const narrative = `Giờ thứ ${hour}: Khí huyết nghịch chuyển suýt gây tẩu hỏa nhập ma, Đạo Lữ 【${companion.name}】 kịp thời thi triển bí thuật hộ pháp, truyền chân nguyên định thần, giúp bạn an toàn vượt qua kiếp nạn!`;
      return {
        defended: true,
        rescuer: 'companion',
        rescueIncident: {
          guardianName: companion.name,
          guardianType: 'companion',
          hour,
          incidentType: 'Khí Huyết Nghịch Chuyển',
          narrative
        },
        log: {
          hour,
          title: 'Đạo Lữ Hộ Pháp • Chuyển Nguy Thành An',
          narrative,
          rewardType: 'hazard',
          isHazardIncident: true,
          wasDefended: true
        }
      };
    }
  }

  // Ưu tiên 3: Linh Thú Hộ Pháp
  if (beast) {
    const tier = beast.tier || 1;
    const level = beast.level || 1;
    // Tỷ lệ cơ bản 75% + tối đa 20% theo phẩm cấp và cấp độ (tổng cộng 75% -> 95%)
    const successRate = Math.min(0.95, 0.75 + tier * 0.03 + Math.floor(level / 2) * 0.01);

    if (rng < successRate) {
      const narrative = `Giờ thứ ${hour}: Tà thú và tà tu tập kích linh địa, Linh Thú 【${beast.name}】 gầm vang hộ chủ, thi triển thiên phú dũng mãnh đẩy lùi hiểm họa, bảo vệ phiên nhập định an toàn!`;
      return {
        defended: true,
        rescuer: 'beast',
        rescueIncident: {
          guardianName: beast.name,
          guardianType: 'beast',
          hour,
          incidentType: 'Tà Tu / Hung Thú Tập Kích',
          narrative
        },
        log: {
          hour,
          title: 'Linh Thú Hộ Vệ • Dũng Mãnh Phá Địch',
          narrative,
          rewardType: 'hazard',
          isHazardIncident: true,
          wasDefended: true
        }
      };
    }
  }

  // Không có phòng bị hoặc cứu viện thất bại -> Bị gián đoạn
  return {
    defended: false,
    log: {
      hour,
      title: 'Khí Huyết Nghịch Chuyển • Bế Tắc Gián Đoạn',
      narrative: `Giờ thứ ${hour}: Thiếu trận bàn hộ thân và không có hộ pháp tương trợ kịp thời, kinh mạch hỗn loạn khí huyết nghịch chuyển, buộc phải ngưng nhập định sớm để bảo toàn tính mạng!`,
      rewardType: 'hazard',
      isHazardIncident: true,
      wasDefended: false
    }
  };
}

/**
 * 4. Tính toán phần thưởng tăng trưởng của Hộ Pháp (Guardian Growth)
 */
export function calculateGuardianGrowth(
  hours: number,
  stance: MeditationStanceType,
  location: MeditationLocationConfig,
  totalTuviGained: number,
  resonanceMultiplier: number = 1.0,
  companion?: { id: string; name: string; realmIndex?: number; affinity?: number; fatigueUntil?: number; totalEpiphanies?: number } | null,
  beast?: { id: string; name: string; level?: number; exp?: number; maxExp?: number; bloodlinePurity?: number; loyalty?: number } | null,
  rescues: GuardianRescueIncident[] = []
): GuardianGrowthResult {
  const result: GuardianGrowthResult = {};

  if (companion && hours > 0) {
    // Affection: Cố Bản +1/2h, Hiểm Cảnh +1/h
    const baseAffection = stance === 'hiem_canh' ? hours : Math.floor(hours / 2);
    const rescueBonusAffection = rescues.filter(r => r.guardianType === 'companion').length * 5;
    const affectionGained = Math.max(1, baseAffection + rescueBonusAffection);

    // Tu Vi: 30% tu vi người chơi nhận được
    const tuviGained = Math.floor(totalTuviGained * 0.30);

    // Giảm thời gian kiệt sức (mỗi giờ giảm 60 phút)
    const fatigueReducedMinutes = hours * 60;

    // Xác suất đốn ngộ đạo tâm (khi bế quan >= 4 giờ)
    const epiphanyTriggered = hours >= 6 || (hours >= 4 && Math.random() < 0.30);

    result.companion = {
      id: companion.id,
      name: companion.name,
      affectionGained,
      tuviGained,
      fatigueReducedMinutes,
      epiphanyTriggered
    };
  }

  if (beast && hours > 0) {
    // Beast EXP: (Cảnh giới linh địa * 50 + 150) * số giờ * cộng hưởng
    const baseExpPerHour = Math.max(100, (location.requiredRealmIndex * 50) + 150);
    const expGained = Math.floor(baseExpPerHour * hours * resonanceMultiplier);

    // Độ thuần khiết huyết mạch: +0.1% mỗi 4 giờ
    const bloodlinePurityGained = Number((Math.floor(hours / 4) * 0.1).toFixed(2));

    // Điểm trung thành: +1 mỗi 2 giờ
    const loyaltyGained = Math.max(1, Math.floor(hours / 2));

    // Thăng cấp nếu đủ EXP
    const currentExp = beast.exp || 0;
    const maxExp = beast.maxExp || 1000;
    const levelUpOccurred = currentExp + expGained >= maxExp;

    result.beast = {
      id: beast.id,
      name: beast.name,
      expGained,
      bloodlinePurityGained,
      levelUpOccurred,
      loyaltyGained
    };
  }

  return result;
}

/**
 * 5. Khóa trạng thái Đạo Lữ & Linh Thú khi bắt đầu nhập định (Atomic Lock)
 */
export function assignGuardiansLock(
  player: PlayerStats,
  companionId?: string | null,
  beastId?: string | null
): PlayerStats {
  const updated: PlayerStats = JSON.parse(JSON.stringify(player));

  if (companionId && updated.companionsState?.companions?.[companionId]) {
    updated.companionsState.companions[companionId].isAssignedToMeditation = true;
  }

  if (beastId) {
    if (updated.beastGarden?.beasts) {
      const b = updated.beastGarden.beasts.find((item: any) => item && item.id === beastId);
      if (b) b.isAssignedToMeditation = true;
    }
    if (updated.beasts) {
      const b = updated.beasts.find((item: any) => item && item.id === beastId);
      if (b) b.isAssignedToMeditation = true;
    }
  }

  updated.accompanyingCompanionId = companionId || null;
  updated.accompanyingBeastId = beastId || null;

  return updated;
}

/**
 * 6. Giải phóng trạng thái khóa của Hộ Pháp khi hoàn tất hoặc dừng nhập định (Atomic Release)
 */
export function releaseGuardiansLock(player: PlayerStats): PlayerStats {
  const updated: PlayerStats = JSON.parse(JSON.stringify(player));

  if (updated.companionsState?.companions) {
    Object.keys(updated.companionsState.companions).forEach(id => {
      if (updated.companionsState!.companions[id]) {
        updated.companionsState!.companions[id].isAssignedToMeditation = false;
      }
    });
  }

  if (updated.beastGarden?.beasts) {
    updated.beastGarden.beasts.forEach((b: any) => {
      if (b) b.isAssignedToMeditation = false;
    });
  }

  if (updated.beasts) {
    updated.beasts.forEach((b: any) => {
      if (b) b.isAssignedToMeditation = false;
    });
  }

  updated.accompanyingCompanionId = null;
  updated.accompanyingBeastId = null;

  return updated;
}

/**
 * 7. Đồng bộ chỉ số nhận được của Đạo Lữ & Linh Thú vào Save Game (Apply to Player)
 */
export function applyGuardianProgressToPlayer(
  player: PlayerStats,
  growth?: GuardianGrowthResult,
  rescues?: GuardianRescueIncident[]
): PlayerStats {
  let updated = releaseGuardiansLock(player);

  if (rescues && rescues.length > 0) {
    updated.guardianRescueCount = (updated.guardianRescueCount || 0) + rescues.length;
  }

  // 1. Cập nhật Đạo Lữ
  if (growth?.companion && updated.companionsState?.companions?.[growth.companion.id]) {
    const compId = growth.companion.id;
    const current = updated.companionsState.companions[compId];

    const newAffection = Math.min(100, (current.affinity || 0) + growth.companion.affectionGained);
    const newTuvi = (current.tuvi || 0) + growth.companion.tuviGained;

    // Rút ngắn thời gian mệt mỏi
    let newFatigue = current.fatigueUntil || 0;
    if (newFatigue > Date.now()) {
      newFatigue = Math.max(Date.now(), newFatigue - growth.companion.fatigueReducedMinutes * 60 * 1000);
    }

    const newEpiphanies = (current.totalEpiphanies || 0) + (growth.companion.epiphanyTriggered ? 1 : 0);

    updated.companionsState.companions[compId] = {
      ...current,
      affinity: newAffection,
      tuvi: newTuvi,
      fatigueUntil: newFatigue,
      totalEpiphanies: newEpiphanies,
      isAssignedToMeditation: false
    };
  }

  // 2. Cập nhật Linh Thú
  if (growth?.beast) {
    const beastId = growth.beast.id;

    const updateBeastItem = (b: SpiritBeast) => {
      if (!b || b.id !== beastId) return b;
      let newLevel = b.level || 1;
      let newExp = (b.exp || 0) + growth.beast!.expGained;
      let maxExp = b.maxExp || (newLevel * 1000);

      while (newExp >= maxExp && newLevel < (b.maxLevel || 100)) {
        newExp -= maxExp;
        newLevel++;
        maxExp = newLevel * 1000;
      }

      const newPurity = Math.min(100, Number(((b.bloodlinePurity || 0) + growth.beast!.bloodlinePurityGained).toFixed(2)));
      const newLoyalty = Math.min(100, (b.loyalty || 50) + (growth.beast!.loyaltyGained || 0));

      return {
        ...b,
        level: newLevel,
        exp: newExp,
        maxExp,
        bloodlinePurity: newPurity,
        loyalty: newLoyalty,
        isAssignedToMeditation: false
      };
    };

    if (updated.beastGarden?.beasts) {
      updated.beastGarden.beasts = updated.beastGarden.beasts.map(updateBeastItem);
    }
    if (updated.beasts) {
      updated.beasts = updated.beasts.map(updateBeastItem);
    }
  }

  return updated;
}
