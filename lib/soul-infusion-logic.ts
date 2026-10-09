// lib/soul-infusion-logic.ts
// Pure Business Logic Engine: Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion & Artifact Spirit Awakening)
// 100% Strict TypeScript, Pure Functions, Immutable Deep Copy, Clean Architecture

import { Equipment } from './types/items';
import {
  SoulType,
  SpiritPersonality,
  SpiritEvolutionStage,
  SoulDialogueContext,
  SoulProcEffect,
  InfusedSoulMetadata,
  SoulVesselItem
} from './types/soul-infusion';

// ============================================================================
// 1. CONFIG & REGISTRY: SOUL_REGISTRY
// ============================================================================

export const SPIRIT_STAGE_NAMES: Record<SpiritEvolutionStage, string> = {
  1: 'Hư Ảnh Sơ Khai',
  2: 'Bán Thực Thể',
  3: 'Chân Thân Hóa Hình'
};

export const SPIRIT_PERSONALITY_NAMES: Record<SpiritPersonality, string> = {
  ngao_kieu: 'Ngạo Kiều',
  lanh_dam: 'Lãnh Đạm',
  hao_chien: 'Háo Chiến',
  trung_can: 'Trung Can'
};

/**
 * Registry 5 Bộ Hồn Phách Tiêu Chuẩn Của Thần Thú & Cổ Hồn
 */
export const SOUL_REGISTRY: Record<SoulType, SoulVesselItem> = {
  /**
   * 1. Hắc Giao Hồn: Hệ Thủy, hiệu ứng Long Uy (-30% ATK, sợ hãi mất lượt), tính cách Ngạo Kiều
   */
  hac_giao: {
    id: 'soul_hac_giao',
    name: 'Hắc Thủy Huyền Giao',
    soulType: 'hac_giao',
    tier: 2,
    requiredRealmIndex: 1, // Trúc Cơ trở lên
    element: 'Thủy',
    description: 'Hồn phách của Huyền Giao ngàn năm dưới đáy Bắc Hải, mang theo Long Uy khiếp đảm kẻ địch.',
    lore: 'Giao long chưa thành Chân Long, tâm tính ngạo mạn bất tuần, chỉ phục kẻ có khí phách kinh nhân.',
    personality: 'ngao_kieu',
    baseProc: {
      id: 'proc_hac_giao_long_uy',
      name: 'Long Uy Nhiếp Phách',
      effectType: 'debuff_fear',
      triggerChance: 0.20,
      potencyValue: 0.30,
      durationTurns: 1,
      description: '20% xác suất giáng Long Uy: giảm 30% ATK đối thủ và khiến đối thủ sợ hãi mất 1 lượt.'
    },
    dialoguePool: {
      onCombatStart: [
        'Hừ, lại là lũ sâu bọ không biết trời cao đất rộng! Đạo hữu, chuẩn bị nhìn bản tôn nuốt chửng chúng đi!',
        'Một đám kiến cỏ cũng dám cản đường? Đừng làm bẩn thân kiếm của ta!'
      ],
      onVictory: [
        'Biết uy lực của Long tộc chưa? Lần sau đừng để bản tôn phải ra tay vì loại phế vật này!',
        'Chiến thắng là lẽ đương nhiên, có gì đáng để reo hò chứ!'
      ],
      onLowHealth: [
        'Kẻ hèn này... dám làm tổn thương chủ nhân của ta?! Bản tôn liều mạng với ngươi!',
        'Đừng gục ngã đấy! Bản tôn còn chưa cho phép ngươi chết đâu!'
      ],
      onIdle: [
        'Kiếm phong cần được tắm linh khí mỗi ngày, đạo hữu chớ có lười biếng!',
        'Chừng nào bản tôn mới hóa thành Chân Long đây? Chờ đợi thật nhàm chán.'
      ]
    }
  },

  /**
   * 2. Hỏa Phượng Hồn: Hệ Hỏa, hiệu ứng Niết Bàn (thiêu đốt 4% Max HP/lượt), tính cách Háo Chiến
   */
  hoa_phuong: {
    id: 'soul_hoa_phuong',
    name: 'Cửu Thiên Hỏa Phượng',
    soulType: 'hoa_phuong',
    tier: 3,
    requiredRealmIndex: 2, // Kim Đan trở lên
    element: 'Hỏa',
    description: 'Chân hồn Hỏa Phượng dục hỏa trùng sinh, mang sức nóng thiêu rụi vạn vật.',
    lore: 'Sinh ra từ ngọn lửa bất diệt của Nam Minh, khát khao chiến đấu và thiêu đốt vạn dặm hồng trần.',
    personality: 'hao_chien',
    baseProc: {
      id: 'proc_hoa_phuong_niet_ban',
      name: 'Niết Bàn Hỏa Thiểm',
      effectType: 'burn_dot',
      triggerChance: 0.30,
      potencyValue: 0.04,
      durationTurns: 3,
      description: '30% xác suất thiêu đốt: thiêu đốt 4% Max HP của đối thủ mỗi hiệp trong 3 hiệp.'
    },
    dialoguePool: {
      onCombatStart: [
        'Huyết dịch của ta đang sôi trào! Đốt rụi bọn chúng thành tro tàn đi!',
        'Liệt diễm Niết Bàn tái xuất! Chiến thôi đạo hữu!'
      ],
      onVictory: [
        'Hahaha! Tro tàn cũng không còn lại! Trận chiến này thật sảng khoái!',
        'Kẻ tiếp theo là ai? Bản tôn còn chưa nóng máy!'
      ],
      onLowHealth: [
        'Càng cận kề cái chết, ngọn lửa Niết Bàn càng cháy rực! Cùng nhau thiêu cháy tất cả!',
        'Thương tích này chỉ làm ta thêm hưng phấn mà thôi!'
      ],
      onIdle: [
        'Có mùi của sát khí đâu đây... Khi nào chúng ta mới xuất chiến tiếp?',
        'Linh hỏa trong thân kiếm đang rạo rực, cần máu tươi quân thù tưới tắm!'
      ]
    }
  },

  /**
   * 3. Bạch Hổ Hồn: Hệ Lôi/Kim, hiệu ứng Sát Phạt (+15% Crit Rate, 25% Xuyên Giáp), tính cách Lãnh Đạm
   */
  bach_ho: {
    id: 'soul_bach_ho',
    name: 'Canh Kim Bạch Hổ',
    soulType: 'bach_ho',
    tier: 4,
    requiredRealmIndex: 3, // Nguyên Anh trở lên
    element: 'Lôi/Kim',
    description: 'Chiến thú viễn cổ đại biểu cho sát phạt vô song, chém sắt như bùn.',
    lore: 'Tây Phương Bạch Hổ chưởng quản binh đao sát kiếp, lạnh lùng tàn nhẫn, xuất thế tất kiến huyết.',
    personality: 'lanh_dam',
    baseProc: {
      id: 'proc_bach_ho_sat_phat',
      name: 'Bạch Hổ Sát Phạt',
      effectType: 'crit_and_pen',
      triggerChance: 1.0,
      potencyValue: 0.15,
      statKey: 'critRate',
      armorPenetration: 0.25,
      description: '+15% Tỷ lệ Bạo kích và 25% Xuyên giáp đối thủ.'
    },
    dialoguePool: {
      onCombatStart: [
        'Rút kiếm. Sát.',
        'Canh Kim vô tình, chém sắt như bùn. Chuẩn bị nhận cái chết.'
      ],
      onVictory: [
        'Kẻ yếu không có quyền tồn tại. Tra kiếm vào vỏ đi.',
        'Đã giải quyết xong. Đi tiếp.'
      ],
      onLowHealth: [
        'Vết thương nhỏ. Tập trung tinh thần, một kích tất sát.',
        'Chưa đến hồi kết. Kiếm ý của ta chưa gãy.'
      ],
      onIdle: [
        'Tâm tĩnh như nước, kiếm bén tựa sương.',
        'Rèn luyện sát khí, chớ để tạp niệm quấy nhiễu.'
      ]
    }
  },

  /**
   * 4. Huyền Vũ Hồn: Hệ Thổ, hiệu ứng Huyền Vũ Phản Chấn (+25% DEF, phản 15% sát thương), tính cách Trung Can
   */
  huyen_vu: {
    id: 'soul_huyen_vu',
    name: 'Bắc Minh Huyền Vũ',
    soulType: 'huyen_vu',
    tier: 4,
    requiredRealmIndex: 3, // Nguyên Anh trở lên
    element: 'Thổ',
    description: 'Thánh thú phòng ngự thượng thừa, linh giáp bất hoại, phản chấn vạn kích.',
    lore: 'Quy xà hợp thể trấn thủ Bắc Cực, trầm mặc như cự nhạc, vạn kiếp bất diệt.',
    personality: 'trung_can',
    baseProc: {
      id: 'proc_huyen_vu_reflect',
      name: 'Huyền Vũ Hộ Mệnh',
      effectType: 'defense_and_reflect',
      triggerChance: 1.0,
      potencyValue: 0.25,
      statKey: 'defensePercent',
      reflectPercent: 0.15,
      description: '+25% Hộ giáp và phản chấn 15% sát thương nhận vào về phía đối thủ.'
    },
    dialoguePool: {
      onCombatStart: [
        'Chủ nhân yên tâm, có lão phu ở đây, vạn pháp bất xâm!',
        'Thương hải biến vi tang điền, bản tâm hộ chủ trước sau như một.'
      ],
      onVictory: [
        'Chủ nhân bình an vô sự là phúc phận lớn nhất của lão phu.',
        'Phòng thủ kiên cố, quân địch tự khắc tan rã.'
      ],
      onLowHealth: [
        'Dù thân tàn ma dại, lão phu tuyệt đối không để chủ nhân chịu một vết xước!',
        'Lấy thân làm thuẫn! Huyền Vũ Giáp, khai!'
      ],
      onIdle: [
        'Tu hành chớ nóng vội, căn cơ vững chắc tựa thái sơn mới thành đại đạo.',
        'Lão phu đang ngưng tụ linh thuẫn, chủ nhân cứ an tâm tĩnh tọa.'
      ]
    }
  },

  /**
   * 5. Cổ Kiếm Tu Hồn: Hệ Hỗn Độn, hiệu ứng Kiếm Tâm (+20% Kiếm Khí, 15% Vạn Kiếm Quy Tông), tính cách Ngạo Kiều
   */
  co_kiem_tu: {
    id: 'soul_co_kiem_tu',
    name: 'Thượng Cổ Kiếm Tu',
    soulType: 'co_kiem_tu',
    tier: 5,
    requiredRealmIndex: 4, // Hóa Thần trở lên
    element: 'Hỗn Độn',
    description: 'Tàn hồn của Kiếm Tiên thượng cổ, kiếm ý thông thiên, vạn kiếm quy tông.',
    lore: 'Thời thượng cổ từng một kiếm trảm phá hư không, ngạo thị cửu thiên, dù chết ý chí kiếm đạo vẫn trường tồn.',
    personality: 'ngao_kieu',
    baseProc: {
      id: 'proc_co_kiem_tu_kiem_tam',
      name: 'Vạn Kiếm Quy Tông',
      effectType: 'sword_burst',
      triggerChance: 0.15,
      potencyValue: 0.20,
      bonusDamageMultiplier: 2.5,
      description: '+20% Sát thương kiếm khí và 15% xác suất bộc phát [Vạn Kiếm Quy Tông] gây đại lượng sát thương.'
    },
    dialoguePool: {
      onCombatStart: [
        'Nhìn cho kỹ, đây mới là Kiếm Đạo chân chính của thời Thượng Cổ!',
        'Thanh kiếm này rơi vào tay ngươi cũng không tệ, đừng làm bản tọa mất mặt!'
      ],
      onVictory: [
        'Một kiếm phá vạn pháp. Đám tiểu bối thời nay thật quá yếu ớt!',
        'Ngươi học được mấy phần kiếm ý của ta rồi? Đừng có tự mãn đấy.'
      ],
      onLowHealth: [
        'Hừ! Kiếm Tu chỉ tiến không lùi! Để bản tọa mượn kiếm của ngươi trảm sát kẻ này!',
        'Thần kiếm chưa gãy, cớ sao ngươi lại cúi đầu? Vung kiếm lên!'
      ],
      onIdle: [
        'Vạn vật đều là kiếm, ngọn cỏ nhánh cây cũng có thể trảm nhật nguyệt.',
        'Đạo hữu, kiếm tâm của ngươi hôm nay đã thông suốt chưa?'
      ]
    }
  }
};

// ============================================================================
// 2. PURE FUNCTION: canInfuseSoulIntoWeapon
// ============================================================================

/**
 * Kiểm tra tính hợp lệ khi phong ấn Hồn Phách vào trang bị:
 * - Vũ khí/Pháp bảo hợp lệ (weapon hoặc artifact).
 * - Cảnh giới người chơi phải đạt tối thiểu `soul.requiredRealmIndex`.
 * - Pure Function: 100% không biến đổi dữ liệu đầu vào.
 */
export function canInfuseSoulIntoWeapon(
  playerRealmIndex: number,
  weapon: Equipment,
  soul: SoulVesselItem
): { canInfuse: boolean; reason?: string } {
  // 1. Kiểm tra trang bị mục tiêu
  if (!weapon || !weapon.id) {
    return { canInfuse: false, reason: 'Trang bị mục tiêu không tồn tại hoặc dữ liệu bị lỗi.' };
  }

  const isWeaponOrArtifact =
    weapon.type === 'weapon' ||
    weapon.type === 'artifact' ||
    weapon.slot === 'weapon' ||
    weapon.slot === 'artifact';

  if (!isWeaponOrArtifact) {
    return {
      canInfuse: false,
      reason: 'Chỉ có thể phong ấn Hồn Phách vào Vũ Khí hoặc Pháp Bảo!'
    };
  }

  // 2. Kiểm tra vật phẩm Hồn Phách
  if (!soul || !soul.soulType) {
    return { canInfuse: false, reason: 'Vật phẩm Hồn Phách không hợp lệ.' };
  }

  // 3. Kiểm tra yêu cầu Cảnh Giới của người chơi
  const requiredRealm = typeof soul.requiredRealmIndex === 'number' ? soul.requiredRealmIndex : 0;
  const currentRealm = typeof playerRealmIndex === 'number' ? playerRealmIndex : 0;

  if (currentRealm < requiredRealm) {
    return {
      canInfuse: false,
      reason: `Cảnh giới chưa đủ. Yêu cầu tối thiểu cảnh giới bậc ${requiredRealm} để áp chế phong hồn (hiện tại: bậc ${currentRealm}).`
    };
  }

  return { canInfuse: true };
}

// ============================================================================
// 3. PURE FUNCTION: applySoulInfusion
// ============================================================================

/**
 * Phong ấn Hồn Phách vào trang bị:
 * - Soul Overwrite Guard: Nếu trang bị đã có Khí Linh trước đó, ghi đè an toàn và đặt cờ oldSoulSalvaged = true.
 * - Khởi tạo Khí Linh mới ở Giai Đoạn 1 (Hư Ảnh), 0 EXP, max EXP 1,000.
 * - Pure Function: Trả về đối tượng bản sao an toàn (Deep Copy).
 */
export function applySoulInfusion(
  weapon: Equipment,
  soul: SoulVesselItem,
  timestamp: number = Date.now()
): { updatedWeapon: Equipment; oldSoulSalvaged: boolean } {
  if (!weapon) {
    throw new Error('Trang bị mục tiêu không hợp lệ.');
  }
  if (!soul) {
    throw new Error('Hồn Phách phong ấn không hợp lệ.');
  }

  const oldSoulSalvaged = Boolean(weapon.infusedSoul);

  // Khởi tạo Khí Linh metadata mới
  const newSoul: InfusedSoulMetadata = {
    soulId: `${soul.soulType}_${timestamp}`,
    soulType: soul.soulType,
    soulName: soul.name,
    element: soul.element,
    personality: soul.personality,
    evolutionStage: 1,
    spiritExp: 0,
    maxSpiritExp: 1000,
    infusedAt: timestamp,
    awakenedName: undefined,
    dialoguePool: {
      onCombatStart: Array.isArray(soul.dialoguePool?.onCombatStart)
        ? [...soul.dialoguePool.onCombatStart]
        : [],
      onVictory: Array.isArray(soul.dialoguePool?.onVictory)
        ? [...soul.dialoguePool.onVictory]
        : [],
      onLowHealth: Array.isArray(soul.dialoguePool?.onLowHealth)
        ? [...soul.dialoguePool.onLowHealth]
        : [],
      onIdle: Array.isArray(soul.dialoguePool?.onIdle)
        ? [...soul.dialoguePool.onIdle]
        : []
    },
    baseProc: { ...soul.baseProc },
    currentProc: { ...soul.baseProc },
    hasAutoGuardianUnlocked: false
  };

  const updatedWeapon: Equipment = {
    ...weapon,
    stats: weapon.stats ? { ...weapon.stats } : undefined,
    affixes: Array.isArray(weapon.affixes) ? weapon.affixes.map(a => ({ ...a })) : undefined,
    sockets: Array.isArray(weapon.sockets) ? weapon.sockets.map(s => ({ ...s })) : undefined,
    inscriptionData: weapon.inscriptionData
      ? {
          ...weapon.inscriptionData,
          conduits: weapon.inscriptionData.conduits.map(c => ({
            ...c,
            currentEffects: c.currentEffects.map(e => ({ ...e }))
          }))
        }
      : weapon.inscriptionData,
    infusedSoul: newSoul
  };

  return { updatedWeapon, oldSoulSalvaged };
}

// ============================================================================
// 4. PURE FUNCTION: feedAndEvolveSpirit
// ============================================================================

/**
 * Cho Khí Linh hấp thu linh khí/hồn thạch để tiến hóa:
 * - Thang EXP:
 *   * Stage 1 -> Stage 2: Cần 1,000 EXP
 *   * Stage 2 -> Stage 3: Cần 5,000 EXP
 * - Khi đạt Stage 2 (Bán Thực Thể): Khuếch đại hiệu lực `potencyValue` thêm +50% (x1.5).
 * - Khi đạt Stage 3 (Chân Thân Hóa Hình): Khuếch đại hiệu lực `potencyValue` thêm +100% (x2.0)
 *   và mở khóa cờ tự động hộ chủ (`hasAutoGuardianUnlocked: true`).
 * - Pure Function: Trả về bản sao mới của InfusedSoulMetadata.
 */
export function feedAndEvolveSpirit(
  soul: InfusedSoulMetadata,
  expAdded: number
): {
  updatedSoul: InfusedSoulMetadata;
  evolved: boolean;
  oldStage: SpiritEvolutionStage;
} {
  if (!soul) {
    throw new Error('Khí Linh (infusedSoul) đầu vào không hợp lệ.');
  }

  const oldStage = soul.evolutionStage;
  const added = Math.max(0, Number(expAdded) || 0);
  const currentExp = (soul.spiritExp || 0) + added;

  let newStage: SpiritEvolutionStage = oldStage;
  let newMaxExp = 1000;

  if (currentExp >= 5000) {
    newStage = 3;
    newMaxExp = 5000;
  } else if (currentExp >= 1000) {
    newStage = 2;
    newMaxExp = 5000;
  } else {
    newStage = 1;
    newMaxExp = 1000;
  }

  const evolved = newStage > oldStage;

  // Tính toán hệ số khuếch đại hiệu lực (Proc Potency Multiplier)
  let multiplier = 1.0;
  let isAutoGuardianUnlocked = Boolean(soul.hasAutoGuardianUnlocked);

  if (newStage === 2) {
    multiplier = 1.5; // +50% hiệu lực
  } else if (newStage === 3) {
    multiplier = 2.0; // +100% hiệu lực
    isAutoGuardianUnlocked = true;
  }

  const basePotency = soul.baseProc?.potencyValue || 0;
  const newPotency = Number((basePotency * multiplier).toFixed(4));

  const updatedSoul: InfusedSoulMetadata = {
    ...soul,
    evolutionStage: newStage,
    spiritExp: currentExp,
    maxSpiritExp: newMaxExp,
    hasAutoGuardianUnlocked: isAutoGuardianUnlocked,
    dialoguePool: {
      onCombatStart: [...(soul.dialoguePool?.onCombatStart || [])],
      onVictory: [...(soul.dialoguePool?.onVictory || [])],
      onLowHealth: [...(soul.dialoguePool?.onLowHealth || [])],
      onIdle: [...(soul.dialoguePool?.onIdle || [])]
    },
    baseProc: { ...soul.baseProc },
    currentProc: {
      ...soul.baseProc,
      potencyValue: newPotency,
      description: `${soul.baseProc.description} [Khí Linh: ${SPIRIT_STAGE_NAMES[newStage]} - Uy Lực x${multiplier}]`
    }
  };

  return { updatedSoul, evolved, oldStage };
}

// ============================================================================
// 5. PURE FUNCTION: getSpiritDialogue
// ============================================================================

/**
 * Trích xuất câu thoại ngẫu nhiên của Khí Linh theo ngữ cảnh chiến đấu hoặc nhàn rỗi:
 * - Hỗ trợ deterministic randomFn phục vụ testing.
 * - Pure Function: Không làm thay đổi metadata Khí Linh.
 */
export function getSpiritDialogue(
  soul: InfusedSoulMetadata,
  context: SoulDialogueContext,
  randomFn: () => number = Math.random
): string {
  if (!soul) {
    return '...';
  }

  const pool = soul.dialoguePool?.[context];
  if (!Array.isArray(pool) || pool.length === 0) {
    // Fallback thoại cơ bản theo tính cách
    switch (soul.personality) {
      case 'ngao_kieu':
        return 'Hừ, đừng làm bản tôn thất vọng!';
      case 'lanh_dam':
        return 'Rút kiếm. Sát.';
      case 'hao_chien':
        return 'Chiến thôi! Đốt rụi tất cả!';
      case 'trung_can':
        return 'Chủ nhân yên tâm, lão phu luôn ở đây.';
      default:
        return 'Kiếm quang rực rỡ, hộ chủ bình an.';
    }
  }

  const roll = typeof randomFn === 'function' ? randomFn() : Math.random();
  const index = Math.min(pool.length - 1, Math.floor(roll * pool.length));
  return pool[index] || pool[0];
}

// ============================================================================
// 6. PURE FUNCTION: evaluateSpiritAutoGuardian
// ============================================================================

/**
 * Thẩm định điều kiện kích hoạt Hộ Chủ Thần Thông tự động của Khí Linh:
 * - Yêu cầu: Khí Linh đã đạt Giai Đoạn 3 (Chân Thân Hóa Hình, `evolutionStage === 3`).
 * - Ngưỡng kích hoạt: Sinh lực nhân vật rơi xuống dưới 20% Max HP (`currentHp / maxHp < 0.20`).
 * - Khống chế: Chưa từng kích hoạt trong trận chiến hiện tại (`!hasTriggeredInFight`).
 * - Kết quả: Triệt tiêu sát thương đòn đánh chí tử (`damageNegated: true`) và phản kích với hệ số x1.5 sát thương.
 * - Pure Function: 100% không mutate dữ liệu.
 */
export function evaluateSpiritAutoGuardian(
  soul: InfusedSoulMetadata | null | undefined,
  currentHp: number,
  maxHp: number,
  hasTriggeredInFight: boolean
): {
  shouldTrigger: boolean;
  damageNegated: boolean;
  counterDamageMultiplier: number;
} {
  if (!soul || soul.evolutionStage !== 3 || !soul.hasAutoGuardianUnlocked) {
    return {
      shouldTrigger: false,
      damageNegated: false,
      counterDamageMultiplier: 0
    };
  }

  if (hasTriggeredInFight) {
    return {
      shouldTrigger: false,
      damageNegated: false,
      counterDamageMultiplier: 0
    };
  }

  const safeMaxHp = Math.max(1, maxHp);
  const hpRatio = currentHp / safeMaxHp;

  if (hpRatio < 0.20) {
    return {
      shouldTrigger: true,
      damageNegated: true,
      counterDamageMultiplier: 1.5
    };
  }

  return {
    shouldTrigger: false,
    damageNegated: false,
    counterDamageMultiplier: 0
  };
}

// ============================================================================
// 7. HELPER: createSoulVesselItem
// ============================================================================

/**
 * Khởi tạo nhanh một vật phẩm Phong Hồn Bình từ SOUL_REGISTRY
 */
export function createSoulVesselItem(
  soulType: SoulType,
  quantity: number = 1
): SoulVesselItem {
  const base = SOUL_REGISTRY[soulType];
  if (!base) {
    throw new Error(`Hồn Phách [${soulType}] không tồn tại trong SOUL_REGISTRY.`);
  }

  return {
    ...base,
    id: `${base.id}_item`,
    quantity,
    count: quantity
  };
}
