// lib/disciple-appointment-logic.ts
// Pure Business Logic Engine cho Phân Hệ "Bổ Nhiệm Tiên Đồng Xuất Sư (Disciple Graduation & Dominion Appointment)"

import type { PlayerStats } from './types/player';
import type { ImmortalChild } from './types/offspring';
import type { ProceduralDisciple } from './types/custom-sect';
import type {
  DiscipleAppointmentRole,
  DiscipleAppointmentData,
  DiscipleSpecialtyBonus,
  GraduationCheckResult,
  AppointmentCheckResult,
  AppointmentYieldResult,
} from './types/disciple-appointment';

export const REALM_INDEX_HOA_THAN = 26; // Mốc Hóa Thần Sơ Kỳ theo data/realms-data.json
export const MIN_GRADUATION_LOYALTY = 70;

const HIGH_REALM_KEYWORDS = [
  'Hóa Thần',
  'Hoa Than',
  'Luyện Hư',
  'Luyen Hu',
  'Hợp Thể',
  'Hop The',
  'Đại Thừa',
  'Dai Thua',
  'Độ Kiếp',
  'Do Kiep',
  'Địa Tiên',
  'Dia Tien',
  'Thiên Tiên',
  'Thien Tien',
  'Kim Tiên',
  'Kim Tien',
  'Thái Ất',
  'Thai At',
  'Đại La',
  'Dai La',
  'Hỗn Nguyên',
  'Hon Nguyen',
  'Chuẩn Thánh',
  'Chuan Thanh',
  'Thánh Nhân',
  'Thanh Nhan',
];

function isHighRealmName(realmName?: string): boolean {
  if (!realmName) return false;
  return HIGH_REALM_KEYWORDS.some((kw) =>
    realmName.toLowerCase().includes(kw.toLowerCase())
  );
}

/**
 * Thẩm định điều kiện cử hành Đại Lễ Xuất Sư cho Tiên Đồng / Đệ Tử
 */
export function canGraduateDisciple(
  disciple: ImmortalChild | ProceduralDisciple
): GraduationCheckResult {
  if (disciple.appointmentData?.isGraduated) {
    return {
      eligible: false,
      reason: 'Tiên đồng đã cử hành Đại Lễ Xuất Sư rồi!',
    };
  }

  // Với Tiên Đồng Động Phủ (ImmortalChild), bắt buộc phải trưởng thành (stage === 'adult')
  if ('stage' in disciple && disciple.stage !== 'adult') {
    return {
      eligible: false,
      reason:
        'Tiên đồng còn trong giai đoạn ấu thơ, chưa đủ tuổi trưởng thành để xuất sư (Cần giai đoạn Đạo Tử Xuất Sư)!',
    };
  }

  // Thẩm định Cảnh Giới: Tối thiểu Hóa Thần Kỳ
  const realmIdx = disciple.realmIndex ?? 0;
  const meetsRealm =
    realmIdx >= REALM_INDEX_HOA_THAN || isHighRealmName(disciple.realmName);

  if (!meetsRealm) {
    return {
      eligible: false,
      reason: `Cảnh giới chưa đạt Hóa Thần Kỳ (Hiện tại: ${
        disciple.realmName || 'Chưa rõ'
      } - Bậc ${realmIdx}). Cần đạt tối thiểu Hóa Thần Kỳ để lĩnh hội pháp tắc xuất sư!`,
    };
  }

  // Thẩm định Độ Trung Thành: Tối thiểu 70
  const loyalty =
    disciple.appointmentData?.loyalty ??
    ('stats' in disciple && disciple.stats?.loyalty !== undefined
      ? disciple.stats.loyalty
      : 100);

  if (loyalty < MIN_GRADUATION_LOYALTY) {
    return {
      eligible: false,
      reason: `Độ trung thành chưa đạt yêu cầu (Hiện tại: ${loyalty}/100, cần tối thiểu ${MIN_GRADUATION_LOYALTY}). Hãy ban thưởng bồi dưỡng thêm ân nghĩa!`,
    };
  }

  return { eligible: true };
}

/**
 * Tính toán chỉ số thiên phú chuyên môn (Specialty Bonus) khi Tiên Đồng xuất sư
 */
export function calculateGraduationSpecialtyBonus(
  disciple: ImmortalChild | ProceduralDisciple
): DiscipleSpecialtyBonus {
  let grade = 'ha';
  let element = '';

  if ('spiritualRoots' in disciple && disciple.spiritualRoots) {
    grade = disciple.spiritualRoots.grade || 'ha';
    element = (
      disciple.spiritualRoots.elementName ||
      disciple.spiritualRoots.type ||
      ''
    ).toLowerCase();
  } else if ('linhCan' in disciple && disciple.linhCan) {
    grade = disciple.linhCan.grade || 'ha';
    element = (disciple.linhCan.element || disciple.linhCan.name || '').toLowerCase();
  }

  // Hệ số phẩm cấp (0.35 ~ 1.0)
  const gradeFactor =
    grade === 'than'
      ? 1.0
      : grade === 'cuc'
      ? 0.85
      : grade === 'thuong'
      ? 0.7
      : grade === 'trung'
      ? 0.5
      : 0.35;

  const isCombatOriented =
    element.includes('hỏa') ||
    element.includes('hoa') ||
    element.includes('lôi') ||
    element.includes('loi') ||
    element.includes('kim') ||
    element.includes('hỗn độn') ||
    element.includes('hon don') ||
    element.includes('kiếm') ||
    element.includes('kiem');

  const isTreasuryOriented =
    element.includes('mộc') ||
    element.includes('moc') ||
    element.includes('thổ') ||
    element.includes('tho') ||
    element.includes('thủy') ||
    element.includes('thuy') ||
    element.includes('thương') ||
    element.includes('thuong');

  let starHarvestMultiplier: number;
  let starDefenseBonus: number;
  let treasuryEfficiency: number;
  let resourceDecayReduction: number;

  if (isCombatOriented) {
    // Thiên hướng Chiến Đấu / Trấn Thủ Tinh Hải
    starHarvestMultiplier = 0.25 + 0.25 * gradeFactor; // +25% ~ +50%
    starDefenseBonus = 0.30 + 0.30 * gradeFactor;      // +30% ~ +60%
    treasuryEfficiency = 0.10 + 0.10 * gradeFactor;    // +10% ~ +20%
    resourceDecayReduction = 0.15 + 0.10 * gradeFactor;// -15% ~ -25%
  } else if (isTreasuryOriented) {
    // Thiên hướng Khố Phòng Tông Môn / Kinh Doanh
    starHarvestMultiplier = 0.10 + 0.10 * gradeFactor; // +10% ~ +20%
    starDefenseBonus = 0.15 + 0.15 * gradeFactor;      // +15% ~ +30%
    treasuryEfficiency = 0.20 + 0.20 * gradeFactor;    // +20% ~ +40%
    resourceDecayReduction = 0.20 + 0.20 * gradeFactor;// -20% ~ -40%
  } else {
    // Quân bình
    starHarvestMultiplier = 0.15 + 0.20 * gradeFactor;
    starDefenseBonus = 0.20 + 0.20 * gradeFactor;
    treasuryEfficiency = 0.15 + 0.20 * gradeFactor;
    resourceDecayReduction = 0.15 + 0.20 * gradeFactor;
  }

  return {
    starHarvestMultiplier: Number(starHarvestMultiplier.toFixed(2)),
    starDefenseBonus: Number(starDefenseBonus.toFixed(2)),
    treasuryEfficiency: Number(treasuryEfficiency.toFixed(2)),
    resourceDecayReduction: Number(resourceDecayReduction.toFixed(2)),
  };
}

/**
 * Thực hiện Đại Lễ Xuất Sư (Graduation Rite)
 */
export function graduateDisciple<T extends ImmortalChild | ProceduralDisciple>(
  disciple: T,
  now: number = Date.now()
): T {
  const check = canGraduateDisciple(disciple);
  if (!check.eligible) {
    throw new Error(check.reason || 'Tiên đồng chưa đủ điều kiện xuất sư!');
  }

  const loyalty =
    disciple.appointmentData?.loyalty ??
    ('stats' in disciple && disciple.stats?.loyalty !== undefined
      ? disciple.stats.loyalty
      : 100);

  const specialtyBonus = calculateGraduationSpecialtyBonus(disciple);

  const appointmentData: DiscipleAppointmentData = {
    isGraduated: true,
    graduatedAt: now,
    graduationRealmIndex: disciple.realmIndex ?? REALM_INDEX_HOA_THAN,
    assignedRole: 'none',
    assignedTargetId: null,
    assignedAt: undefined,
    loyalty,
    meritPoints: 0,
    specialtyBonus,
  };

  return {
    ...disciple,
    appointmentData,
  };
}

/**
 * Thẩm định điều kiện bổ nhiệm Tiên Đồng vào một chức vụ cụ thể
 */
export function canAppointDisciple(
  disciple: ImmortalChild | ProceduralDisciple,
  role: DiscipleAppointmentRole,
  targetId: string,
  player: PlayerStats
): AppointmentCheckResult {
  // 1. Phải đã xuất sư
  if (!disciple.appointmentData?.isGraduated) {
    return {
      eligible: false,
      reason: 'Tiên đồng chưa cử hành Đại Lễ Xuất Sư! Chưa thể phong chức.',
    };
  }

  // 1.5. Khóa Đơn Nhiệm Đệ Tử Khi Xuất Chinh (War Dispatch State Lock)
  if (disciple.isDispatchedToWar) {
    return {
      eligible: false,
      reason: 'Đệ tử/Tiên đồng đang viễn chinh tham gia Tông Môn Đại Chiến, không thể bổ nhiệm chức vụ mới!'
    };
  }

  // 2. Phòng vệ Đơn Nhiệm & Khóa trạng thái (Single-Duty Invariant)
  if (
    disciple.appointmentData.assignedRole &&
    disciple.appointmentData.assignedRole !== 'none'
  ) {
    const roleName =
      disciple.appointmentData.assignedRole === 'tinh_hai_guardian'
        ? 'Trấn Thủ Sĩ Tinh Hải'
        : 'Chấp Sự Khố Phòng Tông Môn';
    return {
      eligible: false,
      reason: `Tiên đồng hiện đang đảm nhiệm chức vụ [${roleName}], không thể kiêm nhiệm! Hãy bãi nhiệm chức vụ cũ trước.`,
    };
  }

  // 3. Nếu là ImmortalChild và đang xuất chiến, phải gỡ xuất chiến trước
  if ('isDeployed' in disciple && disciple.isDeployed) {
    return {
      eligible: false,
      reason:
        'Tiên đồng đang trong đội hình xuất chiến cùng nhân vật, không thể phân thân nhận nhiệm vụ viễn chinh/khố phòng!',
    };
  }

  // 4. Kiểm tra điều kiện đích đến
  if (role === 'tinh_hai_guardian') {
    if (!player.cosmicState || !player.cosmicState.unlocked) {
      return {
        eligible: false,
        reason: 'Phân hệ Chư Thiên Tinh Đồ chưa được mở khóa!',
      };
    }
    if (!player.cosmicState.occupiedNodeIds.includes(targetId)) {
      return {
        eligible: false,
        reason: 'Cứ điểm Tinh Hải này chưa được chiếm lĩnh hoặc đã thất thủ!',
      };
    }
    const currentGuardianId =
      player.cosmicState.nodeGuardians?.[targetId] ||
      player.cosmicDefenseState?.garrisons?.[targetId]?.entityId;
    if (currentGuardianId && currentGuardianId !== disciple.id) {
      return {
        eligible: false,
        reason:
          'Cứ điểm Tinh Hải này đã có Trấn Thủ Sĩ đương nhiệm! Cần triệu hồi người cũ trước.',
      };
    }
  } else if (role === 'sect_treasury_deacon') {
    if (!player.customSectState || !player.customSectState.isFounded) {
      return {
        eligible: false,
        reason: 'Chưa khai sơn lập phái, Khố Phòng Tông Môn chưa được kiến thiết!',
      };
    }
    const currentDeaconId = player.customSectState.sectVault?.deaconDiscipleId;
    if (currentDeaconId && currentDeaconId !== disciple.id) {
      return {
        eligible: false,
        reason:
          'Khố Phòng Tông Môn đã có Chấp Sự đương nhiệm! Hãy bãi nhiệm người cũ trước.',
      };
    }
  }

  return { eligible: true };
}

/**
 * Thực thi Bổ Nhiệm Chức Vụ cho Tiên Đồng (Atomic Two-Way Sync)
 */
export function appointDiscipleRole(
  player: PlayerStats,
  discipleId: string,
  role: DiscipleAppointmentRole,
  targetId: string,
  now: number = Date.now()
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  // Tìm Tiên Đồng trong offspringState hoặc customSectState
  let foundInOffspring = false;
  let foundInSect = false;
  let targetDisciple: ImmortalChild | ProceduralDisciple | null = null;

  if (player.offspringState?.children) {
    const child = player.offspringState.children.find((c) => c.id === discipleId);
    if (child) {
      foundInOffspring = true;
      targetDisciple = child;
    }
  }

  if (!targetDisciple && player.customSectState?.disciples) {
    const disciple = player.customSectState.disciples.find((d) => d.id === discipleId);
    if (disciple) {
      foundInSect = true;
      targetDisciple = disciple;
    }
  }

  if (!targetDisciple) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy Tiên Đồng / Đệ Tử chỉ định!',
    };
  }

  const check = canAppointDisciple(targetDisciple, role, targetId, player);
  if (!check.eligible) {
    return {
      success: false,
      updatedPlayer: player,
      message: check.reason || 'Bổ nhiệm thất bại!',
    };
  }

  const updatedAppointmentData: DiscipleAppointmentData = {
    ...targetDisciple.appointmentData!,
    assignedRole: role,
    assignedTargetId: targetId,
    assignedAt: now,
  };

  let updatedPlayer: PlayerStats = { ...player };

  // 1. Cập nhật thực thể Đệ tử
  if (foundInOffspring && updatedPlayer.offspringState?.children) {
    const newChildren = updatedPlayer.offspringState.children.map((c) => {
      if (c.id === discipleId) {
        return {
          ...c,
          isDeployed: false, // Gỡ khỏi xuất chiến nếu có
          appointmentData: updatedAppointmentData,
        };
      }
      return c;
    });

    const newDeployedId =
      updatedPlayer.offspringState.deployedChildId === discipleId
        ? null
        : updatedPlayer.offspringState.deployedChildId;

    updatedPlayer = {
      ...updatedPlayer,
      offspringState: {
        ...updatedPlayer.offspringState,
        children: newChildren,
        deployedChildId: newDeployedId,
      },
    };
  } else if (foundInSect && updatedPlayer.customSectState?.disciples) {
    const newDisciples = updatedPlayer.customSectState.disciples.map((d) => {
      if (d.id === discipleId) {
        return {
          ...d,
          currentTask: 'idle' as const, // Rời khỏi lao tác thông thường
          appointmentData: updatedAppointmentData,
        };
      }
      return d;
    });

    updatedPlayer = {
      ...updatedPlayer,
      customSectState: {
        ...updatedPlayer.customSectState,
        disciples: newDisciples,
      },
    };
  }

  // 2. Đồng bộ vào Engine Tinh Hải hoặc Tông Môn
  const discipleName = targetDisciple.name;
  const combatPower =
    'combatPower' in targetDisciple
      ? targetDisciple.combatPower
      : 'stats' in targetDisciple
      ? targetDisciple.stats.combatPower
      : 10000;

  if (role === 'tinh_hai_guardian' && updatedPlayer.cosmicState) {
    const nodeGuardians = {
      ...(updatedPlayer.cosmicState.nodeGuardians || {}),
      [targetId]: discipleId,
    };

    let defenseState = updatedPlayer.cosmicDefenseState || {
      fortifications: {},
      garrisons: {},
      activeIncursions: [],
      lastIncursionCheckTime: now,
      incursionsRepelledCount: 0,
      incursionsBreachedCount: 0,
    };

    defenseState = {
      ...defenseState,
      garrisons: {
        ...defenseState.garrisons,
        [targetId]: {
          type: 'disciple',
          entityId: discipleId,
          entityName: discipleName,
          baseCombatPower: combatPower,
          assignedAt: now,
        },
      },
    };

    updatedPlayer = {
      ...updatedPlayer,
      cosmicState: {
        ...updatedPlayer.cosmicState,
        nodeGuardians,
      },
      cosmicDefenseState: defenseState,
    };
  } else if (role === 'sect_treasury_deacon' && updatedPlayer.customSectState) {
    updatedPlayer = {
      ...updatedPlayer,
      customSectState: {
        ...updatedPlayer.customSectState,
        sectVault: {
          ...updatedPlayer.customSectState.sectVault,
          deaconDiscipleId: discipleId,
        },
      },
    };
  }

  const roleTitle =
    role === 'tinh_hai_guardian'
      ? '🌌 Trấn Thủ Sĩ Tinh Hải'
      : '🏛️ Chấp Sự Khố Phòng Tông Môn';

  return {
    success: true,
    updatedPlayer,
    message: `Sắc lệnh ban hành thành công! Bổ nhiệm [${discipleName}] đảm nhiệm vị trí [${roleTitle}].`,
  };
}

/**
 * Bãi nhiệm / Triệu hồi Tiên Đồng về trạng thái rảnh rỗi (Safe Recall)
 */
export function recallDiscipleRole(
  player: PlayerStats,
  discipleId: string
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  let targetDisciple: ImmortalChild | ProceduralDisciple | null = null;
  let foundInOffspring = false;
  let foundInSect = false;

  if (player.offspringState?.children) {
    const child = player.offspringState.children.find((c) => c.id === discipleId);
    if (child) {
      foundInOffspring = true;
      targetDisciple = child;
    }
  }

  if (!targetDisciple && player.customSectState?.disciples) {
    const disciple = player.customSectState.disciples.find((d) => d.id === discipleId);
    if (disciple) {
      foundInSect = true;
      targetDisciple = disciple;
    }
  }

  if (!targetDisciple) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy Tiên Đồng / Đệ Tử chỉ định!',
    };
  }

  const currentRole = targetDisciple.appointmentData?.assignedRole;
  const currentTargetId = targetDisciple.appointmentData?.assignedTargetId;

  if (!currentRole || currentRole === 'none') {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Tiên đồng hiện đang tự do, không đảm nhiệm chức vụ nào!',
    };
  }

  const updatedAppointmentData: DiscipleAppointmentData = {
    ...targetDisciple.appointmentData!,
    assignedRole: 'none',
    assignedTargetId: null,
    assignedAt: undefined,
  };

  let updatedPlayer: PlayerStats = { ...player };

  // 1. Cập nhật thực thể đệ tử
  if (foundInOffspring && updatedPlayer.offspringState?.children) {
    const newChildren = updatedPlayer.offspringState.children.map((c) => {
      if (c.id === discipleId) {
        return {
          ...c,
          appointmentData: updatedAppointmentData,
        };
      }
      return c;
    });

    updatedPlayer = {
      ...updatedPlayer,
      offspringState: {
        ...updatedPlayer.offspringState,
        children: newChildren,
      },
    };
  } else if (foundInSect && updatedPlayer.customSectState?.disciples) {
    const newDisciples = updatedPlayer.customSectState.disciples.map((d) => {
      if (d.id === discipleId) {
        return {
          ...d,
          appointmentData: updatedAppointmentData,
        };
      }
      return d;
    });

    updatedPlayer = {
      ...updatedPlayer,
      customSectState: {
        ...updatedPlayer.customSectState,
        disciples: newDisciples,
      },
    };
  }

  // 2. Gỡ khỏi Tinh Hải hoặc Khố Phòng
  if (currentRole === 'tinh_hai_guardian' && currentTargetId) {
    if (updatedPlayer.cosmicState?.nodeGuardians) {
      const newNodeGuardians = { ...updatedPlayer.cosmicState.nodeGuardians };
      delete newNodeGuardians[currentTargetId];
      updatedPlayer = {
        ...updatedPlayer,
        cosmicState: {
          ...updatedPlayer.cosmicState,
          nodeGuardians: newNodeGuardians,
        },
      };
    }

    if (updatedPlayer.cosmicDefenseState?.garrisons) {
      const newGarrisons = { ...updatedPlayer.cosmicDefenseState.garrisons };
      delete newGarrisons[currentTargetId];
      updatedPlayer = {
        ...updatedPlayer,
        cosmicDefenseState: {
          ...updatedPlayer.cosmicDefenseState,
          garrisons: newGarrisons,
        },
      };
    }
  } else if (currentRole === 'sect_treasury_deacon' && updatedPlayer.customSectState?.sectVault) {
    const newVault = { ...updatedPlayer.customSectState.sectVault };
    delete newVault.deaconDiscipleId;
    updatedPlayer = {
      ...updatedPlayer,
      customSectState: {
        ...updatedPlayer.customSectState,
        sectVault: newVault,
      },
    };
  }

  return {
    success: true,
    updatedPlayer,
    message: `Đã thu hồi lệnh bài! Tiên đồng [${targetDisciple.name}] đã rời nhiệm sở trở về Động Phủ an tĩnh tu hành.`,
  };
}

/**
 * Tính toán Lợi Tức Bổ Nhiệm (Yield & Protection Boost Formula)
 */
export function calculateAppointmentYield(
  target: { type: 'outpost' | 'treasury'; id: string; baseYield: Record<string, number> },
  disciple: ImmortalChild | ProceduralDisciple,
  elapsedSeconds: number
): AppointmentYieldResult {
  const bonus = disciple.appointmentData?.specialtyBonus || {};
  const elapsedHours = Math.max(0, elapsedSeconds / 3600);

  const resourceBonus: Record<string, number> = {};
  const decaySaved: Record<string, number> = {};

  let defenseRating = 0;

  if (target.type === 'outpost') {
    const mult = bonus.starHarvestMultiplier || 0;
    defenseRating = Math.floor((bonus.starDefenseBonus || 0) * 100);

    for (const [key, baseVal] of Object.entries(target.baseYield)) {
      if (baseVal > 0) {
        resourceBonus[key] = Math.floor(baseVal * mult * elapsedHours);
      }
    }
  } else if (target.type === 'treasury') {
    const eff = bonus.treasuryEfficiency || 0;
    const decayRed = bonus.resourceDecayReduction || 0;

    for (const [key, baseVal] of Object.entries(target.baseYield)) {
      if (baseVal > 0) {
        resourceBonus[key] = Math.floor(baseVal * eff * elapsedHours);
        decaySaved[key] = Math.floor(baseVal * decayRed * 0.15 * elapsedHours);
      }
    }
  }

  // Tích lũy điểm công trạng: 2 điểm mỗi giờ hoàn thành nhiệm vụ
  const meritGained = Math.floor(elapsedHours * 2);

  // Biến động độ trung thành: tăng 1 điểm mỗi 24 giờ hoàn thành tốt nhiệm vụ (tối đa 100)
  const currentLoyalty = disciple.appointmentData?.loyalty ?? 100;
  const loyaltyDelta = Math.min(100 - currentLoyalty, Math.floor(elapsedHours / 24));

  return {
    resourceBonus,
    decaySaved,
    meritGained,
    loyaltyDelta,
    defenseRating,
  };
}

/**
 * Ban thưởng bổng lộc cho Tiên Đồng gia tăng độ trung thành
 */
export function rewardDisciple(
  player: PlayerStats,
  discipleId: string,
  spiritStones: number
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  if (spiritStones <= 0) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Số lượng linh thạch ban thưởng không hợp lệ!',
    };
  }

  if (player.linhThach < spiritStones) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Không đủ linh thạch! Ngươi có ${player.linhThach.toLocaleString()} nhưng cần ${spiritStones.toLocaleString()} linh thạch.`,
    };
  }

  let found = false;
  let discipleName = '';
  let currentLoyalty = 100;
  const loyaltyGain = Math.min(25, Math.max(5, Math.floor(spiritStones / 5000)));

  let updatedPlayer: PlayerStats = {
    ...player,
    linhThach: player.linhThach - spiritStones,
  };

  if (updatedPlayer.offspringState?.children) {
    const newChildren = updatedPlayer.offspringState.children.map((c) => {
      if (c.id === discipleId) {
        found = true;
        discipleName = c.name;
        currentLoyalty = c.appointmentData?.loyalty ?? 100;
        const newLoyalty = Math.min(100, currentLoyalty + loyaltyGain);
        return {
          ...c,
          appointmentData: {
            ...(c.appointmentData || {
              isGraduated: false,
              graduationRealmIndex: 0,
              assignedRole: 'none' as const,
              assignedTargetId: null,
              meritPoints: 0,
              specialtyBonus: {},
            }),
            loyalty: newLoyalty,
          },
        };
      }
      return c;
    });

    if (found) {
      updatedPlayer = {
        ...updatedPlayer,
        offspringState: {
          ...updatedPlayer.offspringState,
          children: newChildren,
        },
      };
    }
  }

  if (!found && updatedPlayer.customSectState?.disciples) {
    const newDisciples = updatedPlayer.customSectState.disciples.map((d) => {
      if (d.id === discipleId) {
        found = true;
        discipleName = d.name;
        currentLoyalty = d.appointmentData?.loyalty ?? d.stats.loyalty ?? 100;
        const newLoyalty = Math.min(100, currentLoyalty + loyaltyGain);
        return {
          ...d,
          stats: {
            ...d.stats,
            loyalty: newLoyalty,
          },
          appointmentData: {
            ...(d.appointmentData || {
              isGraduated: false,
              graduationRealmIndex: 0,
              assignedRole: 'none' as const,
              assignedTargetId: null,
              meritPoints: 0,
              specialtyBonus: {},
            }),
            loyalty: newLoyalty,
          },
        };
      }
      return d;
    });

    if (found) {
      updatedPlayer = {
        ...updatedPlayer,
        customSectState: {
          ...updatedPlayer.customSectState,
          disciples: newDisciples,
        },
      };
    }
  }

  if (!found) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy Tiên Đồng / Đệ Tử chỉ định!',
    };
  }

  return {
    success: true,
    updatedPlayer,
    message: `Đã ban thưởng ${spiritStones.toLocaleString()} Linh Thạch cho [${discipleName}]! Độ trung thành tăng +${loyaltyGain} (Hiện tại: ${Math.min(
      100,
      currentLoyalty + loyaltyGain
    )}/100).`,
  };
}
