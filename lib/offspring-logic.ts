// lib/offspring-logic.ts
// Pure Business Logic cho phân hệ Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch

import type { PlayerStats } from './types/player';
import type { CompanionDefinition, CompanionPlayerState } from './types/companions';
import type {
  DualCultivationMethod,
  DualCultivationResult,
  GestationState,
  ImmortalChild,
  OffspringSpiritualRoot,
  OffspringInnateTalent,
} from './types/offspring';
import {
  GESTATION_TOTAL_DURATION_MS,
  CONCEPTION_REQUIRED_REALM,
  CONCEPTION_REQUIRED_AFFINITY,
  NATURAL_CONCEPTION_CHANCE,
  ROOT_COMBINATION_RULES,
  CHAOS_ROOT_DEFINITION,
  INNATE_TALENTS_POOL,
  FATHER_SURNAMES,
  MALE_NAMES,
  FEMALE_NAMES,
  GESTATION_PILLS,
} from './offspring-data';

// ─── 1. Thực Hiện Song Tu (Chính Đạo vs Thái Bổ) ──────────────────────────────

/**
 * Kiểm tra xem Đạo Lữ có mang thiên hướng Ma Đạo / Tà Pháp hay không
 */
export function isDemonicCompanion(comp: CompanionDefinition): boolean {
  const secret = (comp.secretBackground || '').toLowerCase();
  const desc = (comp.description || '').toLowerCase();
  const title = (comp.title || '').toLowerCase();
  return (
    secret.includes('ma môn') ||
    secret.includes('u minh') ||
    secret.includes('hợp hoan') ||
    secret.includes('tà tu') ||
    desc.includes('ma môn') ||
    title.includes('ma') ||
    comp.id === 'comp_co_da_suong' // Cổ Dạ Sương - U Hồn Thánh Nữ
  );
}

/**
 * Thực thi Song Tu phân nhánh: Chính Tông Tương Sinh hoặc Thái Bổ Tà Pháp
 */
export function executeDualCultivation(
  player: PlayerStats,
  companion: CompanionDefinition,
  compPlayerState: CompanionPlayerState,
  method: DualCultivationMethod
): DualCultivationResult {
  const affinity = compPlayerState.affinity || 0;
  const currentKarma = player.offspringState?.demonicKarma || 0;

  // Tính lượng Tu Vi cơ bản dựa theo cảnh giới của cả hai
  const realmFactor = Math.max(1, Math.min(player.currentRealm, 30));
  const baseTuVi = Math.floor(Math.pow(1.35, realmFactor) * 800) + 3000;

  if (method === 'chinh_dao') {
    // Điều kiện Chính Đạo: Hảo Cảm >= 60
    if (affinity < 60) {
      throw new Error(`Đạo Lữ chưa đủ tình thâm ý trọng (Cần Hảo Cảm ≥ 60, hiện tại: ${affinity}). Hãy tặng quà bồi dưỡng tình cảm!`);
    }

    const playerTuViGain = Math.floor(baseTuVi * 1.5);
    const companionTuViGain = Math.floor(baseTuVi * 1.2);

    // Kiểm tra hoài thai tự nhiên (Hảo cảm 100 + Cả hai >= Nguyên Anh + Chưa có thai)
    let conceptionTriggered = false;
    const isPregnant = Boolean(player.offspringState?.gestation?.isGestationActive);
    const meetsConceptionConditions =
      affinity >= CONCEPTION_REQUIRED_AFFINITY &&
      player.currentRealm >= CONCEPTION_REQUIRED_REALM &&
      companion.realmIndex >= CONCEPTION_REQUIRED_REALM &&
      !isPregnant;

    if (meetsConceptionConditions && Math.random() < NATURAL_CONCEPTION_CHANCE) {
      conceptionTriggered = true;
    }

    return {
      method: 'chinh_dao',
      playerTuViGain,
      companionTuViGain,
      playerBuffDurationHours: 4,
      atkBonusPercent: 0,
      critRateBonusPercent: 0,
      tamCanhDelta: 5, // +5 Tâm Cảnh
      demonicKarmaDelta: 0,
      affinityDelta: 2, // +2 Hảo Cảm
      conceptionTriggered,
      message: `☯️ [CHÍNH ĐẠO SONG TU] Âm Dương hòa hợp, thiên địa cộng minh! Ngươi nhận được ${playerTuViGain.toLocaleString()} Tu Vi, đạo lữ nhận ${companionTuViGain.toLocaleString()} Tu Vi, tâm cảnh thăng hoa (+5), hảo cảm +2! Hiệu suất tu luyện +15% trong 4 giờ.${
        conceptionTriggered ? ' 🌟 Kỳ tích giáng lâm! Trong đan điền đạo lữ đã ngưng tụ một luồng Linh Thai Chi Khí!' : ''
      }`,
    };
  } else {
    // Thái Bổ Tà Pháp
    // Điều kiện: Ma Tính >= 20 hoặc Đạo Lữ theo Ma Môn
    const isDemo = isDemonicCompanion(companion);
    if (currentKarma < 20 && !isDemo) {
      throw new Error('Tâm ma chưa đủ sâu dày (Ma Tính < 20) và Đạo Lữ thuộc chính đạo quang minh, không thể thi triển Thái Bổ Tà Pháp!');
    }

    // Cưỡng chế rút tỉa chân nguyên: Buff cuồng bạo
    const playerTuViGain = Math.floor(baseTuVi * 3.2);
    const companionTuViGain = 0; // Đạo Lữ bị rút cạn

    return {
      method: 'thai_bo',
      playerTuViGain,
      companionTuViGain,
      playerBuffDurationHours: 8,
      atkBonusPercent: 20, // +20% Công Kích
      critRateBonusPercent: 15, // +15% Bạo Kích
      tamCanhDelta: -3,
      demonicKarmaDelta: 15, // +15 Ma Tính
      affinityDelta: -10, // -10 Hảo Cảm
      conceptionTriggered: false, // Tà pháp không thể ngưng tụ Linh Thai thần thánh
      message: `🩸 [THÁI BỔ TÀ PHÁP] Rút tỉa chân nguyên càn khôn! Ngươi cưỡng chế hấp thu ${playerTuViGain.toLocaleString()} Tu Vi, tăng cuồng bạo +20% Công Kích và +15% Bạo Kích trong 8 giờ! Song cái giá phải trả là Ma Tính tăng mạnh (+15), Đạo Lữ hao tổn nguyên khí, hảo cảm sụt giảm (-10)!`,
    };
  }
}

// ─── 2. Tính Toán Tiến Độ Hoài Thai ──────────────────────────────────────────

export interface GestationProgressResult {
  progressPercent: number;
  timeRemainingMs: number;
  readyToBirth: boolean;
  formattedRemaining: string;
}

export function calculateGestationProgress(
  gestation: GestationState | null,
  currentTimestamp: number
): GestationProgressResult {
  if (!gestation || !gestation.isGestationActive) {
    return {
      progressPercent: 0,
      timeRemainingMs: 0,
      readyToBirth: false,
      formattedRemaining: 'Chưa hoài thai',
    };
  }

  const elapsed = Math.max(0, currentTimestamp - gestation.startGestationTimestamp);
  const total = Math.max(1, gestation.estimatedBirthTimestamp - gestation.startGestationTimestamp);
  const rawProgress = (elapsed / total) * 100;
  const progressPercent = Math.min(100, Math.max(0, Math.floor(rawProgress)));
  const timeRemainingMs = Math.max(0, gestation.estimatedBirthTimestamp - currentTimestamp);
  const readyToBirth = timeRemainingMs <= 0 || progressPercent >= 100;

  let formattedRemaining = 'Đã viên mãn';
  if (!readyToBirth) {
    const totalSec = Math.floor(timeRemainingMs / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    formattedRemaining = `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }

  return {
    progressPercent,
    timeRemainingMs,
    readyToBirth,
    formattedRemaining,
  };
}

// ─── 3. Thuật Toán Di Truyền Huyết Mạch & Điểm Hóa Tiên Đồng ──────────────────

/**
 * Di truyền và lai tạo Linh Căn dị biến dựa theo ngũ hành của Cha và Mẹ
 */
export function determineOffspringSpiritualRoot(
  fatherElement: string,
  motherElement: string,
  consumedPills: string[] = []
): OffspringSpiritualRoot {
  const hasCuuChuyenDụcAnh = consumedPills.includes('pill_cuu_chuyen_duc_anh');
  const hasKhiLinhTinhHoa = consumedPills.includes('pill_tien_thien_khi_linh');

  // Tỷ lệ xuất hiện Hỗn Độn Linh Căn (5% mặc định, tăng lên 15% nếu dùng Cửu Chuyển Dục Anh Đan)
  const chaosChance = hasCuuChuyenDụcAnh ? 0.15 : 0.05;
  if (Math.random() < chaosChance) {
    return { ...CHAOS_ROOT_DEFINITION };
  }

  // So khớp với bảng công thức lai tạo dị biến
  const matchedRule = ROOT_COMBINATION_RULES.find(rule => {
    const match1 = rule.fatherElements.includes(fatherElement) && rule.motherElements.includes(motherElement);
    const match2 = rule.fatherElements.includes(motherElement) && rule.motherElements.includes(fatherElement);
    return match1 || match2;
  });

  if (matchedRule) {
    const bonusRate = hasCuuChuyenDụcAnh ? 0.25 : 0;
    if (Math.random() < matchedRule.mutationRate + bonusRate) {
      return {
        type: matchedRule.mutationResult.type,
        elementName: matchedRule.mutationResult.elementName,
        grade: hasCuuChuyenDụcAnh ? 'cuc' : matchedRule.mutationResult.grade,
        description: matchedRule.mutationResult.description,
        damageBonusPercent: matchedRule.mutationResult.damageBonusPercent + (hasKhiLinhTinhHoa ? 5 : 0),
      };
    }
  }

  // Thừa hưởng linh căn của cha hoặc mẹ
  const inheritFather = Math.random() < 0.5;
  const chosenElem = inheritFather ? fatherElement : motherElement;
  const grade = hasCuuChuyenDụcAnh ? 'cuc' : 'thuong';

  const elemNames: Record<string, string> = {
    kim: 'Thanh Cương Kim Linh Căn',
    moc: 'Thanh Mộc Trường Sinh Linh Căn',
    thuy: 'Huyền Thủy Lưu Ly Linh Căn',
    hoa: 'Liệt Diễm Thuần Dương Linh Căn',
    tho: 'Trầm Thổ Bàn Thạch Linh Căn',
    loi: 'Cửu Tiêu Lôi Linh Căn',
    phong: 'Thái Hư Phong Linh Căn',
    bang: 'Huyền Minh Băng Linh Căn',
  };

  return {
    type: 'ngu_hanh',
    elementName: elemNames[chosenElem] || 'Thuần Dương Tiên Linh Căn',
    grade,
    description: `Kế thừa chân truyền huyết mạch thuần túy từ ${inheritFather ? 'phụ thân' : 'mẫu thân'}, linh khí tự nhiên lưu chuyển không ngừng.`,
    damageBonusPercent: hasCuuChuyenDụcAnh ? 22 : 15,
  };
}

/**
 * Sinh ngẫu nhiên một Tiên Đồng với đầy đủ phả hệ và chỉ số
 */
export function generateProceduralChild(
  fatherStats: PlayerStats,
  motherCompanion: CompanionDefinition,
  nurturingLevel: number,
  consumedPills: string[] = [],
  customName?: string
): ImmortalChild {
  const gender: 'nam' | 'nu' = Math.random() < 0.5 ? 'nam' : 'nu';

  // Đặt tên cổ phong
  let name = customName?.trim();
  if (!name) {
    const surname = FATHER_SURNAMES[Math.floor(Math.random() * FATHER_SURNAMES.length)];
    const pool = gender === 'nam' ? MALE_NAMES : FEMALE_NAMES;
    const givenName = pool[Math.floor(Math.random() * pool.length)];
    name = `${surname} ${givenName}`;
  }

  const fatherElem = fatherStats.linhCan?.element || 'kim';
  const motherElem = motherCompanion.element || 'thuy';

  const spiritualRoots = determineOffspringSpiritualRoot(fatherElem, motherElem, consumedPills);

  // Chọn ngẫu nhiên 1 Thiên Phú Thần Thông
  const talentIndex = Math.floor(Math.random() * INNATE_TALENTS_POOL.length);
  const innateTalent = { ...INNATE_TALENTS_POOL[talentIndex] };

  // Gia cố chỉ số nếu có Tiên Thiên Khí Linh Tinh Hoa
  const hasStatBoost = consumedPills.includes('pill_tien_thien_khi_linh');
  if (hasStatBoost) {
    innateTalent.statModifiers = {
      ...innateTalent.statModifiers,
      atkPercent: (innateTalent.statModifiers.atkPercent || 0) + 5,
      hpPercent: (innateTalent.statModifiers.hpPercent || 0) + 8,
    };
  }

  // Tính lực chiến cơ bản
  const baseCombatPower = Math.floor(
    2000 + nurturingLevel * 800 + (spiritualRoots.damageBonusPercent || 15) * 60
  );

  return {
    id: `child_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    gender,
    motherCompanionId: motherCompanion.id,
    motherName: motherCompanion.name,
    birthTimestamp: Date.now(),
    stage: 'infant', // Bắt đầu ở giai đoạn Linh Thai Sơ Sinh
    realmIndex: 1,
    realmName: 'Luyện Khí Tầng 1',
    spiritualRoots,
    innateTalent,
    growthProgress: 0,
    combatPower: baseCombatPower,
    isDeployed: false,
    ageYears: 0,
    transferredTuVi: 0,
  };
}

// ─── 4. Hiệu Ứng Trợ Chiến Của Tiên Đồng ─────────────────────────────────────

export interface ChildCombatModifiers {
  atkBonusPercent: number;
  defBonusPercent: number;
  hpBonusPercent: number;
  critRateBonus: number;
  critDmgBonus: number;
  speedBonus: number;
  trueDamagePercent: number;
}

/**
 * Tính toán chỉ số trợ chiến cho người chơi khi Tiên Đồng được chỉ định xuất chiến
 */
export function calculateChildCombatContribution(child: ImmortalChild | null): ChildCombatModifiers {
  if (!child || !child.isDeployed || child.stage !== 'adult') {
    return {
      atkBonusPercent: 0,
      defBonusPercent: 0,
      hpBonusPercent: 0,
      critRateBonus: 0,
      critDmgBonus: 0,
      speedBonus: 0,
      trueDamagePercent: 0,
    };
  }

  const talentMods = child.innateTalent.statModifiers;
  const rootBonus = child.spiritualRoots.damageBonusPercent || 15;

  return {
    atkBonusPercent: (talentMods.atkPercent || 0) + Math.floor(rootBonus * 0.5),
    defBonusPercent: talentMods.defPercent || 0,
    hpBonusPercent: talentMods.hpPercent || 0,
    critRateBonus: talentMods.critRate || 0,
    critDmgBonus: talentMods.critDmg || 0,
    speedBonus: talentMods.speed || 0,
    trueDamagePercent: Math.floor(rootBonus * 0.75), // Sát thương chuẩn dựa theo độ thuần khiết của linh căn
  };
}
