// lib/natal-artifact-logic.ts
// Business Logic Engine cho "Bản Mệnh Pháp Bảo & Bồi Dưỡng Khí Linh (Natal Artifact & Spirit Sentience)"

import { PlayerStats, Equipment, Ore } from '@/lib/types';
import {
  NatalArtifact,
  ArtifactSpirit,
  SpiritStage,
  SpiritPersonality,
  ArtifactSpiritSkill,
  NatalAscensionConfig,
  NatalAscensionRequirement
} from '@/lib/types/natal-artifact';
import {
  SPIRIT_STAGES_CONFIG,
  SPIRIT_PERSONALITIES_CONFIG,
  SPIRIT_ARCHETYPES,
  getRandomSpiritQuote
} from '@/lib/natal-artifact-data';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

// ============================================================
// 1. KIỂM TRA ĐIỀU KIỆN TẾ LUYỆN BẢN MỆNH (CAN BIND)
// ============================================================
export function canBindEquipmentAsNatal(
  player: PlayerStats,
  equipment: Equipment
): { canBind: boolean; reason?: string } {
  // 1. Cảnh giới tối thiểu: Trúc Cơ Kỳ (Index 11+)
  const currentRealm = player.currentRealm || 0;
  if (currentRealm < 11) {
    return {
      canBind: false,
      reason: 'Yêu cầu tu vi đạt tối thiểu [Trúc Cơ Sơ Kỳ] (Tầng 11) mới có thể mở rộng đan điền tế luyện Bản Mệnh!'
    };
  }

  // 2. Phẩm cấp trang bị: Cực Phẩm trở lên
  const validQualities = ['cuc_pham', 'tuyet_pham', 'tien_pham', 'de_binh'];
  const equipQuality = equipment.quality || 'thuong_pham';
  const isHighQuality = validQualities.includes(equipQuality);
  const isHighGrade = equipment.grade && (
    equipment.grade.includes('Tứ Giai') ||
    equipment.grade.includes('Ngũ Giai') ||
    equipment.grade.includes('Lục Giai') ||
    equipment.grade.includes('Thất Giai') ||
    equipment.grade.includes('Bát Giai') ||
    equipment.grade.includes('Cửu Giai') ||
    equipment.grade.includes('Tiên') ||
    equipment.grade.includes('Đế')
  );

  if (!isHighQuality && !isHighGrade) {
    return {
      canBind: false,
      reason: 'Trang bị phẩm chất quá tầm thường! Chỉ có trang bị từ [Cực Phẩm] hoặc [Tứ Giai] trở lên mới có đủ linh tính để tế luyện Bản Mệnh!'
    };
  }

  // 3. Quy tắc duy nhất: Chưa từng tế luyện Bản Mệnh nào khác
  if (player.natalArtifact) {
    return {
      canBind: false,
      reason: `Đã có Bản Mệnh Pháp Bảo 【${player.natalArtifact.name}】! Muốn tế luyện món mới phải hủy bỏ khế ước cũ.`
    };
  }

  // 4. Chi phí nghi thức: 10 Trung Phẩm Linh Thạch và 50 Thần Thức
  const playerTrungPham = player.trungPhamLinhThach || 0;
  if (playerTrungPham < 10) {
    return {
      canBind: false,
      reason: `Thiếu tài nguyên nghi thức! Cần tối thiểu 10 Trung Phẩm Linh Thạch (Hiện có: ${playerTrungPham}).`
    };
  }

  const playerThanThuc = player.thanThuc || 10;
  if (playerThanThuc < 50) {
    return {
      canBind: false,
      reason: `Thần Thức không đủ ngưng tụ Tinh Huyết Khế Ước! Cần tối thiểu 50 Thần Thức (Hiện có: ${playerThanThuc}).`
    };
  }

  return { canBind: true };
}

// ============================================================
// 2. THỰC HIỆN TẾ LUYỆN BẢN MỆNH (BIND NATAL ARTIFACT)
// ============================================================
export function bindEquipmentAsNatal(
  player: PlayerStats,
  equipment: Equipment,
  personalityChoice?: SpiritPersonality
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  const check = canBindEquipmentAsNatal(player, equipment);
  if (!check.canBind) {
    return { success: false, updatedPlayer: player, message: check.reason || 'Không đủ điều kiện tế luyện!' };
  }

  // 1. Trừ chi phí: 10 Trung Phẩm Linh Thạch
  let updatedPlayer = { ...player };
  updatedPlayer.trungPhamLinhThach = Math.max(0, (player.trungPhamLinhThach || 0) - 10);

  // 2. Tính toán Stats Bonus (+25% chỉ số cơ bản của trang bị + thưởng từ Khí Linh)
  let baseResonance = 25; // +25%
  let baseEquipmentCopy = { ...equipment };

  // Đồng bộ hóa với Khí Linh Phong Hồn (infusedSoul) nếu có
  if (equipment.infusedSoul) {
    const soulCopy = {
      ...equipment.infusedSoul,
      awakenedAsNatalSpirit: true
    };
    baseEquipmentCopy.infusedSoul = soulCopy;

    // Đồng bộ chỉ số cộng hưởng giữa phẩm cấp Bản Mệnh và giai đoạn tiến hóa của Khí Linh:
    // Stage 1: +5%, Stage 2: +15%, Stage 3: +30% cộng hưởng Bản Mệnh
    const spiritStageResonanceBonus = soulCopy.evolutionStage === 3 ? 30 : soulCopy.evolutionStage === 2 ? 15 : 5;
    baseResonance += spiritStageResonanceBonus;
  }

  const multiplier = baseResonance / 100;
  const statsBonus = {
    atk: Math.floor((equipment.atkBonus || (equipment.slot === 'weapon' ? equipment.powerBonus : 0)) * multiplier),
    def: Math.floor((equipment.defBonus || (equipment.slot === 'armor' ? equipment.powerBonus : 0)) * multiplier),
    hp: Math.floor((equipment.hpBonus || 0) * multiplier),
    mp: Math.floor((equipment.mpBonus || 0) * multiplier),
    speed: Math.floor((equipment.speedBonus || 0) * multiplier),
    critRate: equipment.critRateBonus ? Number((equipment.critRateBonus * multiplier).toFixed(1)) : 0,
    critDmg: equipment.critDmgBonus ? Number((equipment.critDmgBonus * multiplier).toFixed(1)) : 0,
  };

  // 3. Chọn ngẫu nhiên hoặc gán phôi Khí Linh ban đầu
  const compatibleArchetypes = SPIRIT_ARCHETYPES.filter(a =>
    a.compatibleSlots.includes(equipment.slot as string) || a.compatibleSlots.includes('artifact')
  );
  const archetype = compatibleArchetypes.length > 0
    ? compatibleArchetypes[Math.floor(Math.random() * compatibleArchetypes.length)]
    : SPIRIT_ARCHETYPES[0];

  const personality = personalityChoice || archetype.defaultPersonality;
  const pConfig = SPIRIT_PERSONALITIES_CONFIG[personality];

  const awakenedSkill: ArtifactSpiritSkill = {
    id: `skill_${personality}`,
    name: pConfig.skillName,
    description: pConfig.skillDesc,
    triggerCondition: personality === 'sat_phat' ? 'boss_low' : personality === 'thu_ho' ? 'hp_low' : personality === 'co_xao' ? 'turn_start' : 'interval',
    cooldownTurns: personality === 'tinh_hoa' ? 3 : 99,
    effectValue: 100
  };

  const initialSpirit: ArtifactSpirit = {
    name: archetype.name,
    title: archetype.title,
    avatar: archetype.avatar,
    stage: 'mong_muoi',
    stageLevel: 1,
    exp: 0,
    maxExp: SPIRIT_STAGES_CONFIG.mong_muoi.maxExp,
    intimacy: 15,
    personality,
    awakenedSkill,
    dialogueHistory: [`"Chủ nhân... linh thức của ta vừa thức tỉnh trong ${equipment.name}..."`],
    dailyNourishCount: 0,
    lastNourishDate: new Date().toISOString().slice(0, 10)
  };

  const natalArtifact: NatalArtifact = {
    id: `natal_${Date.now()}`,
    baseEquipmentId: equipment.id,
    name: equipment.name,
    slot: equipment.slot as string,
    type: equipment.type,
    tier: 1,
    grade: equipment.grade,
    quality: equipment.quality || 'cuc_pham',
    resonanceRate: baseResonance,
    boundRealmId: player.currentRealm || 0,
    realmAdvancementBonus: 0,
    spirit: initialSpirit,
    statsBonus,
    baseEquipment: baseEquipmentCopy,
    boundAtTimestamp: Date.now()
  };

  if (baseEquipmentCopy.infusedSoul) {
    (natalArtifact as any).infusedSoul = baseEquipmentCopy.infusedSoul;
  }

  updatedPlayer.natalArtifact = natalArtifact;

  // Đồng bộ trạng thái awakenedAsNatalSpirit vào kho đồ / trang bị đang mặc của người chơi
  if (equipment.infusedSoul) {
    if (updatedPlayer.equipment) {
      for (const [key, eq] of Object.entries(updatedPlayer.equipment)) {
        if (eq && eq.id === equipment.id && eq.infusedSoul) {
          eq.infusedSoul.awakenedAsNatalSpirit = true;
        }
      }
    }
    if (updatedPlayer.inventory?.equipments) {
      for (const eq of updatedPlayer.inventory.equipments) {
        if (eq && eq.id === equipment.id && eq.infusedSoul) {
          eq.infusedSoul.awakenedAsNatalSpirit = true;
        }
      }
    }
  }

  const logMsg = `🩸 [TẾ LUYỆN BẢN MỆNH THÀNH CÔNG] Dùng 1 giọt Bản Mệnh Tinh Huyết kết hợp 10 Trung Phẩm Linh Thạch, ngươi đã tế luyện thành công 【${equipment.name}】 thành Bản Mệnh Pháp Bảo! Khí Linh 【${initialSpirit.name}】 (${initialSpirit.title}) sơ bộ thức tỉnh!${equipment.infusedSoul ? ' Hồn Phách bên trong đã chính thức thăng hoa thành Bản Mệnh Khí Linh!' : ''}`;

  return {
    success: true,
    updatedPlayer,
    message: logMsg
  };
}

// ============================================================
// 3. HỦY BỎ KHẾ ƯỚC BẢN MỆNH (UNBIND NATAL ARTIFACT)
// ============================================================
export function unbindNatalArtifact(
  player: PlayerStats
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  if (!player.natalArtifact) {
    return { success: false, updatedPlayer: player, message: 'Ngươi chưa từng tế luyện Bản Mệnh Pháp Bảo nào!' };
  }

  const natalName = player.natalArtifact.name;
  let updatedPlayer = { ...player };

  // Phản phệ tâm mạch: trừ 20% HP hiện tại, giảm nhẹ 5% Tu Vi
  const curHp = player.khiHuyet || 1000;
  const hpLoss = Math.floor(curHp * 0.20);
  updatedPlayer.khiHuyet = Math.max(1, curHp - hpLoss);

  const curTuVi = player.tuVi || 0;
  const tuViLoss = Math.floor(curTuVi * 0.05);
  updatedPlayer.tuVi = Math.max(0, curTuVi - tuViLoss);

  // Xóa bỏ Bản Mệnh
  updatedPlayer.natalArtifact = null;

  const msg = `⚡ [HỦY BỎ KHẾ ƯỚC BẢN MỆNH] Ngươi cưỡng ép cắt đứt tâm mạch liên kết với 【${natalName}】! Khí huyết quay cuồng (-${hpLoss.toLocaleString()} HP), tu vi chấn động (-${tuViLoss.toLocaleString()} Tu Vi). Pháp bảo trở lại thành trang bị thường.`;

  return {
    success: true,
    updatedPlayer,
    message: msg
  };
}

// ============================================================
// 4. ÔN DƯỠNG KHÍ TỨC HÀNG NGÀY (NOURISH SPIRIT WITH ENERGY)
// ============================================================
export function nourishSpiritWithEnergy(
  player: PlayerStats
): { success: boolean; updatedPlayer: PlayerStats; message: string; stageUp: boolean } {
  if (!player.natalArtifact || !player.natalArtifact.spirit) {
    return { success: false, updatedPlayer: player, message: 'Chưa có Bản Mệnh Pháp Bảo hoặc Khí Linh chưa thức tỉnh!', stageUp: false };
  }

  const spirit = player.natalArtifact.spirit;
  const today = new Date().toISOString().slice(0, 10);
  const dailyCount = spirit.lastNourishDate === today ? (spirit.dailyNourishCount || 0) : 0;

  if (dailyCount >= 3) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Hôm nay Khí Linh đã hấp thu đủ Chân Nguyên (3/3 lần)! Cần đợi ngày mai để ôn dưỡng tiếp tục.',
      stageUp: false
    };
  }

  // Tiêu hao: 100 Linh Lực (MP)
  const curMp = player.linhLuc || 0;
  if (curMp < 100) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Không đủ Chân Nguyên (MP)! Cần tối thiểu 100 Chân Nguyên để ôn dưỡng Khí Linh.',
      stageUp: false
    };
  }

  let updatedPlayer = { ...player };
  updatedPlayer.linhLuc = Math.max(0, curMp - 100);

  // Cộng EXP và Hảo Cảm
  const expGain = 180;
  const intimacyGain = 6;
  const newIntimacy = Math.min(100, spirit.intimacy + intimacyGain);
  const newExp = spirit.exp + expGain;

  // Kiểm tra thăng cấp Tầng Linh Trí
  let newStage = spirit.stage;
  let newStageLevel = spirit.stageLevel;
  let newMaxExp = spirit.maxExp;
  let stageUp = false;

  const stageKeys: SpiritStage[] = ['mong_muoi', 'thuc_tinh', 'thong_tue', 'huyen_the', 'hoa_hinh'];
  const curStageIdx = stageKeys.indexOf(spirit.stage);

  if (newExp >= spirit.maxExp && curStageIdx < stageKeys.length - 1) {
    const nextStageKey = stageKeys[curStageIdx + 1];
    const nextCfg = SPIRIT_STAGES_CONFIG[nextStageKey];
    newStage = nextStageKey;
    newStageLevel = nextCfg.stageLevel;
    newMaxExp = nextCfg.maxExp;
    stageUp = true;
  }

  const quote = getRandomSpiritQuote(spirit.personality, newIntimacy);

  const updatedSpirit: ArtifactSpirit = {
    ...spirit,
    exp: stageUp ? Math.max(0, newExp - spirit.maxExp) : newExp,
    maxExp: newMaxExp,
    stage: newStage,
    stageLevel: newStageLevel,
    intimacy: newIntimacy,
    dailyNourishCount: dailyCount + 1,
    lastNourishDate: today,
    dialogueHistory: [quote, ...spirit.dialogueHistory.slice(0, 4)]
  };

  updatedPlayer.natalArtifact = {
    ...player.natalArtifact,
    spirit: updatedSpirit
  };

  const msg = stageUp
    ? `✨ [KHÍ LINH ĐỘT PHÁ • ${SPIRIT_STAGES_CONFIG[newStage].name.toUpperCase()}!] Ôn dưỡng Chân Nguyên hoàn tất (+${expGain} EXP, +${intimacyGain} Hảo Cảm). Khí Linh đã hấp thụ viên mãn linh tính, thăng cấp lên 【${SPIRIT_STAGES_CONFIG[newStage].name}】!\n"${quote}"`
    : `🧘 [ÔN DƯỠNG BẢN MỆNH] Rót Chân Nguyên uẩn dưỡng Khí Linh thành công (+${expGain} EXP, +${intimacyGain} Hảo Cảm). Khí Linh truyền âm: "${quote}"`;

  return {
    success: true,
    updatedPlayer,
    message: msg,
    stageUp
  };
}

// ============================================================
// 5. THÔN PHỆ TRANG BỊ NÂNG CẤP KHÍ LINH (DEVOUR EQUIPMENT)
// ============================================================
export function devourEquipment(
  player: PlayerStats,
  equipmentId: string
): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  expGained: number;
  statAbsorbed?: string;
  stageUp: boolean;
} {
  if (!player.natalArtifact || !player.natalArtifact.spirit) {
    return { success: false, updatedPlayer: player, message: 'Chưa có Bản Mệnh Pháp Bảo hoặc Khí Linh chưa thức tỉnh!', expGained: 0, stageUp: false };
  }

  const invEquips = player.inventory?.equipments || [];
  const targetEquip = invEquips.find((e: any) => e.id === equipmentId);

  if (!targetEquip) {
    return { success: false, updatedPlayer: player, message: 'Không tìm thấy trang bị trong túi trữ vật!', expGained: 0, stageUp: false };
  }

  // Khấu trừ trang bị khỏi túi đồ
  let updatedPlayer = { ...player };
  const updatedEquips = invEquips.filter((e: any) => e.id !== equipmentId);
  updatedPlayer.inventory = {
    ...player.inventory,
    equipments: updatedEquips
  } as any;

  // Tính EXP dựa theo phẩm cấp trang bị
  const quality = targetEquip.quality || 'ha_pham';
  let expGain = 120;
  if (quality === 'trung_pham') expGain = 200;
  else if (quality === 'thuong_pham') expGain = 350;
  else if (quality === 'cuc_pham') expGain = 600;
  else if (quality === 'tuyet_pham') expGain = 1200;
  else if (quality === 'tien_pham' || quality === 'de_binh') expGain = 3000;

  // 15% Tỷ lệ hấp thu dòng thuộc tính đặc biệt vào Bản Mệnh Pháp Bảo!
  let statAbsorbed = '';
  let updatedStatsBonus = { ...player.natalArtifact.statsBonus };
  const rollAbsorb = Math.random() < 0.15;

  if (rollAbsorb) {
    if (targetEquip.atkBonus && targetEquip.atkBonus > 0) {
      const extraAtk = Math.max(5, Math.floor(targetEquip.atkBonus * 0.15));
      updatedStatsBonus.atk = (updatedStatsBonus.atk || 0) + extraAtk;
      statAbsorbed = `+${extraAtk} Công Kích`;
    } else if (targetEquip.defBonus && targetEquip.defBonus > 0) {
      const extraDef = Math.max(5, Math.floor(targetEquip.defBonus * 0.15));
      updatedStatsBonus.def = (updatedStatsBonus.def || 0) + extraDef;
      statAbsorbed = `+${extraDef} Phòng Ngự`;
    } else if (targetEquip.hpBonus && targetEquip.hpBonus > 0) {
      const extraHp = Math.max(30, Math.floor(targetEquip.hpBonus * 0.15));
      updatedStatsBonus.hp = (updatedStatsBonus.hp || 0) + extraHp;
      statAbsorbed = `+${extraHp} Khí Huyết`;
    } else {
      updatedStatsBonus.atk = (updatedStatsBonus.atk || 0) + 10;
      statAbsorbed = `+10 Công Kích`;
    }
  }

  // Tăng EXP và kiểm tra tiến cấp
  const spirit = player.natalArtifact.spirit;
  const newIntimacy = Math.min(100, spirit.intimacy + 3);
  const newExp = spirit.exp + expGain;

  let newStage = spirit.stage;
  let newStageLevel = spirit.stageLevel;
  let newMaxExp = spirit.maxExp;
  let stageUp = false;

  const stageKeys: SpiritStage[] = ['mong_muoi', 'thuc_tinh', 'thong_tue', 'huyen_the', 'hoa_hinh'];
  const curStageIdx = stageKeys.indexOf(spirit.stage);

  if (newExp >= spirit.maxExp && curStageIdx < stageKeys.length - 1) {
    const nextStageKey = stageKeys[curStageIdx + 1];
    const nextCfg = SPIRIT_STAGES_CONFIG[nextStageKey];
    newStage = nextStageKey;
    newStageLevel = nextCfg.stageLevel;
    newMaxExp = nextCfg.maxExp;
    stageUp = true;
  }

  const quote = getRandomSpiritQuote(spirit.personality, newIntimacy);

  const updatedSpirit: ArtifactSpirit = {
    ...spirit,
    exp: stageUp ? Math.max(0, newExp - spirit.maxExp) : newExp,
    maxExp: newMaxExp,
    stage: newStage,
    stageLevel: newStageLevel,
    intimacy: newIntimacy,
    dialogueHistory: [quote, ...spirit.dialogueHistory.slice(0, 4)]
  };

  updatedPlayer.natalArtifact = {
    ...player.natalArtifact,
    statsBonus: updatedStatsBonus,
    spirit: updatedSpirit
  };

  const absorbText = statAbsorbed ? ` 🌟 [ĐỒNG HÓA LINH TÍNH] Khí Linh nuốt trọn tinh hoa, vĩnh viễn cộng thêm ${statAbsorbed} vào Bản Mệnh!` : '';
  const msg = stageUp
    ? `🌀 [THÔN PHỆ ĐẠI THÀNH • KHÍ LINH THĂNG HOA] Nuốt 【${targetEquip.name}】 nhận +${expGain} EXP.${absorbText} Khí Linh đã đột phá lên 【${SPIRIT_STAGES_CONFIG[newStage].name}】!\n"${quote}"`
    : `🌀 [THÔN PHỆ TRANG BỊ] Khí Linh nuốt chửng 【${targetEquip.name}】, tinh luyện binh khí nhận +${expGain} EXP.${absorbText} "${quote}"`;

  return {
    success: true,
    updatedPlayer,
    message: msg,
    expGained: expGain,
    statAbsorbed: statAbsorbed || undefined,
    stageUp
  };
}

// ============================================================
// 6. THÔN PHỆ KHOÁNG THẠCH NÂNG CẤP KHÍ LINH (DEVOUR ORE)
// ============================================================
export function devourOre(
  player: PlayerStats,
  oreId: string,
  count: number = 1
): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  expGained: number;
  stageUp: boolean;
} {
  if (!player.natalArtifact || !player.natalArtifact.spirit) {
    return { success: false, updatedPlayer: player, message: 'Chưa có Bản Mệnh Pháp Bảo hoặc Khí Linh chưa thức tỉnh!', expGained: 0, stageUp: false };
  }

  const invOres = player.inventory?.ores || [];
  const oreIndex = invOres.findIndex((o: any) => o.id === oreId && o.quantity >= count);

  if (oreIndex < 0) {
    return { success: false, updatedPlayer: player, message: 'Không đủ khoáng thạch trong túi đồ!', expGained: 0, stageUp: false };
  }

  const targetOre = invOres[oreIndex];
  let updatedPlayer = { ...player };

  // Khấu trừ khoáng thạch
  const updatedOres = [...invOres];
  updatedOres[oreIndex] = {
    ...targetOre,
    quantity: targetOre.quantity - count
  };

  updatedPlayer.inventory = {
    ...player.inventory,
    ores: updatedOres.filter((o: any) => o.quantity > 0)
  } as any;

  // Tính EXP từ khoáng thạch (dựa trên giá và phẩm giai)
  const baseOreExp = Math.max(30, Math.floor((targetOre.price || 50) * 0.8));
  const expGain = baseOreExp * count;

  const spirit = player.natalArtifact.spirit;
  const newIntimacy = Math.min(100, spirit.intimacy + Math.min(10, count * 2));
  const newExp = spirit.exp + expGain;

  let newStage = spirit.stage;
  let newStageLevel = spirit.stageLevel;
  let newMaxExp = spirit.maxExp;
  let stageUp = false;

  const stageKeys: SpiritStage[] = ['mong_muoi', 'thuc_tinh', 'thong_tue', 'huyen_the', 'hoa_hinh'];
  const curStageIdx = stageKeys.indexOf(spirit.stage);

  if (newExp >= spirit.maxExp && curStageIdx < stageKeys.length - 1) {
    const nextStageKey = stageKeys[curStageIdx + 1];
    const nextCfg = SPIRIT_STAGES_CONFIG[nextStageKey];
    newStage = nextStageKey;
    newStageLevel = nextCfg.stageLevel;
    newMaxExp = nextCfg.maxExp;
    stageUp = true;
  }

  const quote = getRandomSpiritQuote(spirit.personality, newIntimacy);

  const updatedSpirit: ArtifactSpirit = {
    ...spirit,
    exp: stageUp ? Math.max(0, newExp - spirit.maxExp) : newExp,
    maxExp: newMaxExp,
    stage: newStage,
    stageLevel: newStageLevel,
    intimacy: newIntimacy,
    dialogueHistory: [quote, ...spirit.dialogueHistory.slice(0, 4)]
  };

  updatedPlayer.natalArtifact = {
    ...player.natalArtifact,
    spirit: updatedSpirit
  };

  const msg = stageUp
    ? `💎 [THÔN PHỆ KHOÁNG THẠCH • KHÍ LINH THĂNG CẤP] Nuốt ${count}x 【${targetOre.name}】 nhận +${expGain} EXP. Khí Linh đã thăng cấp lên 【${SPIRIT_STAGES_CONFIG[newStage].name}】!\n"${quote}"`
    : `💎 [THÔN PHỆ KHOÁNG THẠCH] Khí Linh luyện hóa ${count}x 【${targetOre.name}】 nhận +${expGain} EXP. "${quote}"`;

  return {
    success: true,
    updatedPlayer,
    message: msg,
    expGained: expGain,
    stageUp
  };
}

// ============================================================
// 7. TÍNH TOÁN TOÀN BỘ CHỈ SỐ GIA TĂNG TỪ BẢN MỆNH & KHÍ LINH
// ============================================================
export function calculateNatalCombatBonus(player: PlayerStats): {
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  mpBonus: number;
  critRateBonus: number;
  dmgReductionBonus: number;
  cultivationSpeedBonus: number;
  summaryText: string;
} {
  if (!player.natalArtifact) {
    return {
      atkBonus: 0,
      defBonus: 0,
      hpBonus: 0,
      mpBonus: 0,
      critRateBonus: 0,
      dmgReductionBonus: 0,
      cultivationSpeedBonus: 0,
      summaryText: ''
    };
  }

  const natal = player.natalArtifact;
  const currentRealm = player.currentRealm || 0;
  const boundRealm = natal.boundRealmId || 0;

  // 1. Thăng tiến cảnh giới: Mỗi đại cảnh giới (cách nhau 5 tầng) tăng thêm +5%
  const majorRealmsGained = Math.max(0, Math.floor((currentRealm - boundRealm) / 5));
  const realmBonusRate = majorRealmsGained * 5; // +5% mỗi đại cảnh giới
  const totalResonancePercent = (natal.resonanceRate || 25) + realmBonusRate; // 25% + X%
  const resonanceMul = 1 + (totalResonancePercent / 100);

  // 2. Chỉ số cơ sở đã cộng hưởng
  const sb = natal.statsBonus || (natal as any).stats || { atk: 0, def: 0, hp: 0, mp: 0, critRate: 0, dmgReduction: 0 };
  let atk = Math.floor((sb.atk || 0) * resonanceMul);
  let def = Math.floor((sb.def || 0) * resonanceMul);
  let hp = Math.floor((sb.hp || 0) * resonanceMul);
  let mp = Math.floor((sb.mp || 0) * resonanceMul);
  let critRate = sb.critRate || 0;
  let dmgReduction = sb.dmgReduction || 0;
  let cultivationSpeed = 0;

  // 3. Gia trì từ Tầng Linh Trí của Khí Linh & Khí Linh Phong Hồn (infusedSoul)
  if (natal.spirit) {
    const stageCfg = SPIRIT_STAGES_CONFIG[natal.spirit.stage] || SPIRIT_STAGES_CONFIG.mong_muoi;
    atk += Math.floor(atk * (stageCfg.atkBonusPercent / 100));
    def += Math.floor(def * (stageCfg.defBonusPercent / 100));
    critRate += (stageCfg.critRateBonusPercent || 0);
    dmgReduction += (stageCfg.dmgReductionBonusPercent || 0);
    cultivationSpeed += (stageCfg.cultivationSpeedBonusPercent || 0);
  }

  const infused = natal.baseEquipment?.infusedSoul || (natal as any).infusedSoul;
  if (infused) {
    const stageMultiplier = infused.evolutionStage === 3 ? 0.30 : infused.evolutionStage === 2 ? 0.15 : 0.05;
    atk += Math.floor(atk * stageMultiplier);
    def += Math.floor(def * stageMultiplier);
    critRate += (infused.evolutionStage * 2);
  }

  const summaryText = `Bản Mệnh 【${natal.name}】 (+${totalResonancePercent}% Cộng Hưởng${natal.spirit ? `, Khí Linh ${SPIRIT_STAGES_CONFIG[natal.spirit.stage].name}` : ''}${infused ? ` [Khí Linh: ${infused.soulName} Giai Đoạn ${infused.evolutionStage}]` : ''})`;

  return {
    atkBonus: atk,
    defBonus: def,
    hpBonus: hp,
    mpBonus: mp,
    critRateBonus: critRate,
    dmgReductionBonus: dmgReduction,
    cultivationSpeedBonus: cultivationSpeed,
    summaryText
  };
}

// ============================================================
// 8. KÍCH HOẠT CHIẾN KỸ HỘ CHỦ CỦA KHÍ LINH TRONG COMBAT
// ============================================================
export interface SpiritCombatTriggerResult {
  triggered: boolean;
  skillName?: string;
  spiritName?: string;
  avatar?: string;
  extraDamage?: number;
  blockLethal?: boolean;
  healAmount?: number;
  stunBoss?: boolean;
  slowBossPercent?: number;
  cleanseDebuffs?: boolean;
  logText?: string;
}

export function processSpiritCombatTrigger(
  player: PlayerStats,
  turn: number,
  playerCurHp: number,
  playerMaxHp: number,
  bossCurHp: number,
  bossMaxHp: number
): SpiritCombatTriggerResult {
  if (!player.natalArtifact || !player.natalArtifact.spirit) {
    return { triggered: false };
  }

  const spirit = player.natalArtifact.spirit;
  const personality = spirit.personality;
  const pCfg = SPIRIT_PERSONALITIES_CONFIG[personality];
  const hpRatio = playerCurHp / Math.max(1, playerMaxHp);
  const bossHpRatio = bossCurHp / Math.max(1, bossMaxHp);

  // 1. SÁT PHẠT: Khi Boss tụt xuống < 35% HP
  if (personality === 'sat_phat' && bossHpRatio <= 0.35) {
    const extraDamage = Math.floor(playerMaxHp * 0.45 + (player.congKich || 500) * 2.5);
    return {
      triggered: true,
      skillName: pCfg.skillName,
      spiritName: spirit.name,
      avatar: spirit.avatar,
      extraDamage,
      stunBoss: true,
      logText: `🗡️ [BẢN MỆNH KHÍ LINH • TRU TIÊN TRẢM HỒN] Khí Linh 【${spirit.name}】 bùng nổ sát ý ngập trời, chém xuất đạo kiếm quang tuyệt thế gây ${extraDamage.toLocaleString()} sát thương chuẩn, phong tỏa nguyên thần đối thủ 1 hiệp!`
    };
  }

  // 2. THỦ HỘ: Khi HP người chơi < 25% (Lâm nguy hộ chủ)
  if (personality === 'thu_ho' && hpRatio <= 0.25) {
    const healAmount = Math.floor(playerMaxHp * 0.15);
    return {
      triggered: true,
      skillName: pCfg.skillName,
      spiritName: spirit.name,
      avatar: spirit.avatar,
      blockLethal: true,
      healAmount,
      logText: `🛡️ [BẢN MỆNH KHÍ LINH • LINH THỂ CHẮN KIẾP] Khí Linh 【${spirit.name}】 hiển hóa kim cang hộ thể chắn trước người đạo hữu, triệt tiêu hoàn toàn sát thương đòn đánh chí mạng và hồi phục +${healAmount.toLocaleString()} Khí Huyết!`
    };
  }

  // 3. CƠ XẢO: Đầu trận đấu (Turn 1)
  if (personality === 'co_xao' && turn === 1) {
    const roll = Math.random() < 0.60;
    if (roll) {
      return {
        triggered: true,
        skillName: pCfg.skillName,
        spiritName: spirit.name,
        avatar: spirit.avatar,
        slowBossPercent: 50,
        stunBoss: Math.random() < 0.30,
        logText: `⚡ [BẢN MỆNH KHÍ LINH • HUYỄN ẢNH TRÓI HỒN] Khí Linh 【${spirit.name}】 tung cấm chế huyễn trận, làm hỗn loạn thân pháp đối thủ (Giảm 50% Tốc Độ trong 2 hiệp đầu)!`
      };
    }
  }

  // 4. TỊNH HÓA: Định kỳ mỗi 3 hiệp (Turn 3, 6, 9)
  if (personality === 'tinh_hoa' && turn % 3 === 0) {
    const healAmount = Math.floor(playerMaxHp * 0.20);
    return {
      triggered: true,
      skillName: pCfg.skillName,
      spiritName: spirit.name,
      avatar: spirit.avatar,
      healAmount,
      cleanseDebuffs: true,
      logText: `🌿 [BẢN MỆNH KHÍ LINH • HỒI QUANG QUY NGUYÊN] Khí Linh 【${spirit.name}】 niệm xướng thanh tâm quyết, gột rửa u ám, hồi phục +${healAmount.toLocaleString()} Khí Huyết & Chân Nguyên!`
    };
  }

  return { triggered: false };
}

// ============================================================
// 9. THĂNG GIAI BẢN MỆNH BẰNG TINH HOA RÈN ĐÚC (ESSENCE ASCENSION)
// ============================================================

export const NATAL_ASCENSION_COSTS: Record<number, NatalAscensionConfig> = {
  2: {
    targetTier: 2,
    tierName: 'Nhị Giai (Trúc Cơ)',
    requiredEssence: 150,
    requiredRealmIndex: 11, // Trúc Cơ Sơ Kỳ
    requiredRealmName: 'Trúc Cơ Kỳ',
    statMultiplierBonus: 0.15, // +15%
    spiritExpBonus: 200,
    maxSocketsUnlock: 2
  },
  3: {
    targetTier: 3,
    tierName: 'Tam Giai (Kim Đan)',
    requiredEssence: 450,
    requiredRealmIndex: 16, // Kim Đan Sơ Kỳ
    requiredRealmName: 'Kim Đan Kỳ',
    statMultiplierBonus: 0.15, // +15%
    spiritExpBonus: 500,
    maxSocketsUnlock: 3
  },
  4: {
    targetTier: 4,
    tierName: 'Tứ Giai (Nguyên Anh)',
    requiredEssence: 1200,
    requiredRealmIndex: 21, // Nguyên Anh Sơ Kỳ
    requiredRealmName: 'Nguyên Anh Kỳ',
    statMultiplierBonus: 0.15, // +15%
    spiritExpBonus: 1200,
    maxSocketsUnlock: 4
  },
  5: {
    targetTier: 5,
    tierName: 'Ngũ Giai (Hóa Thần)',
    requiredEssence: 3000,
    requiredRealmIndex: 26, // Hóa Thần Sơ Kỳ
    requiredRealmName: 'Hóa Thần Kỳ',
    statMultiplierBonus: 0.20, // +20%
    spiritExpBonus: 3000,
    maxSocketsUnlock: 4
  },
  6: {
    targetTier: 6,
    tierName: 'Lục Giai (Luyện Hư)',
    requiredEssence: 8000,
    requiredRealmIndex: 31, // Luyện Hư Sơ Kỳ
    requiredRealmName: 'Luyện Hư Kỳ',
    statMultiplierBonus: 0.20, // +20%
    spiritExpBonus: 8000,
    maxSocketsUnlock: 4
  },
  7: {
    targetTier: 7,
    tierName: 'Thất Giai (Hợp Thể)',
    requiredEssence: 20000,
    requiredRealmIndex: 36, // Hợp Thể Sơ Kỳ
    requiredRealmName: 'Hợp Thể Kỳ',
    statMultiplierBonus: 0.25, // +25%
    spiritExpBonus: 20000,
    maxSocketsUnlock: 4
  },
  8: {
    targetTier: 8,
    tierName: 'Bát Giai (Đại Thừa)',
    requiredEssence: 50000,
    requiredRealmIndex: 41, // Đại Thừa Sơ Kỳ
    requiredRealmName: 'Đại Thừa Kỳ',
    statMultiplierBonus: 0.25, // +25%
    spiritExpBonus: 50000,
    maxSocketsUnlock: 4
  },
  9: {
    targetTier: 9,
    tierName: 'Cửu Giai (Độ Kiếp / Tiên Nhân)',
    requiredEssence: 120000,
    requiredRealmIndex: 46, // Độ Kiếp Sơ Kỳ
    requiredRealmName: 'Độ Kiếp Kỳ',
    statMultiplierBonus: 0.30, // +30%
    spiritExpBonus: 100000,
    maxSocketsUnlock: 4
  }
};

/**
 * Kiểm tra điều kiện thăng giai Bản Mệnh bằng Tinh Hoa
 */
export function canAscendNatalWithEssence(player: PlayerStats): NatalAscensionRequirement {
  const currentRealmIndex = player.currentRealm || 0;
  const playerEssence = player.inventory?.forgingEssence || 0;

  if (!player.natalArtifact) {
    return {
      canAscend: false,
      reason: 'Chưa có Bản Mệnh Pháp Bảo để thăng giai!',
      currentTier: 0,
      playerEssence,
      requiredEssence: 0,
      currentRealmIndex,
      requiredRealmIndex: 0,
      isRealmQualified: false,
      hasEnoughEssence: false,
      isMaxTier: false
    };
  }

  const currentTier = player.natalArtifact.tier || 1;
  if (currentTier >= 9) {
    return {
      canAscend: false,
      reason: 'Bản Mệnh Pháp Bảo đã đạt Cửu Giai cực hạn, không thể thăng giai thêm!',
      currentTier,
      playerEssence,
      requiredEssence: 0,
      currentRealmIndex,
      requiredRealmIndex: 0,
      isRealmQualified: true,
      hasEnoughEssence: true,
      isMaxTier: true
    };
  }

  const nextTier = currentTier + 1;
  const nextConfig = NATAL_ASCENSION_COSTS[nextTier];
  if (!nextConfig) {
    return {
      canAscend: false,
      reason: `Không tìm thấy cấu hình thăng giai cho bậc ${nextTier}!`,
      currentTier,
      playerEssence,
      requiredEssence: 0,
      currentRealmIndex,
      requiredRealmIndex: 0,
      isRealmQualified: false,
      hasEnoughEssence: false,
      isMaxTier: false
    };
  }

  const isRealmQualified = currentRealmIndex >= nextConfig.requiredRealmIndex;
  const hasEnoughEssence = playerEssence >= nextConfig.requiredEssence;

  let reason = '';
  if (!isRealmQualified) {
    reason = `🔒 Cần đạt [${nextConfig.requiredRealmName}] để thăng giai Bản Mệnh lên ${nextConfig.tierName}!`;
  } else if (!hasEnoughEssence) {
    const missing = nextConfig.requiredEssence - playerEssence;
    reason = `Thiếu ${missing.toLocaleString()} Tinh Hoa Rèn Đúc (Cần ${nextConfig.requiredEssence.toLocaleString()}, hiện có ${playerEssence.toLocaleString()})!`;
  }

  return {
    canAscend: isRealmQualified && hasEnoughEssence,
    reason: reason || undefined,
    currentTier,
    nextTier,
    nextConfig,
    playerEssence,
    requiredEssence: nextConfig.requiredEssence,
    currentRealmIndex,
    requiredRealmIndex: nextConfig.requiredRealmIndex,
    isRealmQualified,
    hasEnoughEssence,
    isMaxTier: false
  };
}

/**
 * Thực hiện thăng giai Bản Mệnh Pháp Bảo bằng Tinh Hoa Rèn Đúc
 */
export function ascendNatalWithEssence(player: PlayerStats): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  stageUp?: boolean;
} {
  const req = canAscendNatalWithEssence(player);
  if (!req.canAscend || !req.nextConfig || !player.natalArtifact) {
    return {
      success: false,
      updatedPlayer: player,
      message: req.reason || 'Không đủ điều kiện thăng giai Bản Mệnh Pháp Bảo!'
    };
  }

  const nextCfg = req.nextConfig;
  const updatedPlayer: PlayerStats = { ...player };
  const updatedInventory = { ...(updatedPlayer.inventory || { pills: [], herbs: [], ores: [], gems: [] }) };

  // Khấu trừ Tinh Hoa Rèn Đúc an toàn (chống âm)
  const curEssence = updatedInventory.forgingEssence || 0;
  if (curEssence < nextCfg.requiredEssence) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Thiếu ${nextCfg.requiredEssence - curEssence} Tinh Hoa Rèn Đúc!`
    };
  }
  updatedInventory.forgingEssence = Math.max(0, curEssence - nextCfg.requiredEssence);
  updatedPlayer.inventory = updatedInventory as any;

  // Nâng cấp chỉ số statsBonus của Bản Mệnh (+15% đến 30% tùy tier)
  const currentStats = { ...player.natalArtifact.statsBonus };
  const mul = 1 + nextCfg.statMultiplierBonus;

  const upgradedStats: Record<string, number | undefined> = {
    atk: currentStats.atk !== undefined ? Math.max((currentStats.atk || 0) + 15, Math.floor((currentStats.atk || 0) * mul)) : undefined,
    def: currentStats.def !== undefined ? Math.max((currentStats.def || 0) + 15, Math.floor((currentStats.def || 0) * mul)) : undefined,
    hp: currentStats.hp !== undefined ? Math.max((currentStats.hp || 0) + 80, Math.floor((currentStats.hp || 0) * mul)) : undefined,
    mp: currentStats.mp !== undefined ? Math.max((currentStats.mp || 0) + 50, Math.floor((currentStats.mp || 0) * mul)) : undefined,
    speed: currentStats.speed !== undefined ? Math.max((currentStats.speed || 0) + 5, Math.floor((currentStats.speed || 0) * mul)) : undefined,
    critRate: currentStats.critRate ? Number((currentStats.critRate * mul).toFixed(1)) : 0,
    critDmg: currentStats.critDmg ? Number((currentStats.critDmg * mul).toFixed(1)) : 0,
    dmgReduction: currentStats.dmgReduction ? Number((currentStats.dmgReduction * mul).toFixed(1)) : 0,
  };

  // Cập nhật Base Equipment và mở trần lỗ khảm
  let updatedBaseEquip = player.natalArtifact.baseEquipment ? { ...player.natalArtifact.baseEquipment } : undefined;
  if (updatedBaseEquip) {
    updatedBaseEquip.tier = nextCfg.targetTier;
    updatedBaseEquip.maxSockets = Math.max(updatedBaseEquip.maxSockets || 1, nextCfg.maxSocketsUnlock);

    // Đảm bảo cấu trúc mảng sockets có đủ các slot (dù chưa mở khóa)
    const curSockets = updatedBaseEquip.sockets ? [...updatedBaseEquip.sockets] : [];
    while (curSockets.length < updatedBaseEquip.maxSockets) {
      curSockets.push({
        slotIndex: curSockets.length,
        index: curSockets.length,
        unlocked: false,
        gem: null
      });
    }
    updatedBaseEquip.sockets = curSockets;

    // Cập nhật lại vào player.equipment nếu trang bị này đang được đeo
    if (updatedPlayer.equipment) {
      const slotKey = updatedBaseEquip.slot as 'weapon' | 'armor' | 'accessory' | 'artifact';
      const currentEquipped = updatedPlayer.equipment[slotKey];
      if (currentEquipped && currentEquipped.id === updatedBaseEquip.id) {
        updatedPlayer.equipment[slotKey] = {
          ...currentEquipped,
          tier: nextCfg.targetTier,
          maxSockets: updatedBaseEquip.maxSockets,
          sockets: curSockets
        };
      }
    }
  }

  // Khí Linh nhận thêm EXP và tăng hảo cảm
  let stageUp = false;
  let updatedSpirit = player.natalArtifact.spirit ? { ...player.natalArtifact.spirit } : null;
  if (updatedSpirit) {
    const newIntimacy = Math.min(100, updatedSpirit.intimacy + 5);
    const newExp = updatedSpirit.exp + nextCfg.spiritExpBonus;

    let newStage = updatedSpirit.stage;
    let newStageLevel = updatedSpirit.stageLevel;
    let newMaxExp = updatedSpirit.maxExp;

    const stageKeys: SpiritStage[] = ['mong_muoi', 'thuc_tinh', 'thong_tue', 'huyen_the', 'hoa_hinh'];
    const curStageIdx = stageKeys.indexOf(updatedSpirit.stage);

    if (newExp >= updatedSpirit.maxExp && curStageIdx < stageKeys.length - 1) {
      const nextStageKey = stageKeys[curStageIdx + 1];
      const stageConfig = SPIRIT_STAGES_CONFIG[nextStageKey];
      newStage = nextStageKey;
      newStageLevel = stageConfig.stageLevel;
      newMaxExp = stageConfig.maxExp;
      stageUp = true;
    }

    const quote = getRandomSpiritQuote(updatedSpirit.personality, newIntimacy);
    updatedSpirit = {
      ...updatedSpirit,
      exp: stageUp ? Math.max(0, newExp - updatedSpirit.maxExp) : newExp,
      maxExp: newMaxExp,
      stage: newStage,
      stageLevel: newStageLevel,
      intimacy: newIntimacy,
      dialogueHistory: [`"Cảm tạ chủ nhân! Tinh Hoa Rèn Đúc tràn đầy linh tính đã bồi dưỡng bản nguyên của ta!"`, ...updatedSpirit.dialogueHistory.slice(0, 4)]
    };
  }

  // Tăng bậc Bản Mệnh
  const updatedNatal: NatalArtifact = {
    ...player.natalArtifact,
    tier: nextCfg.targetTier,
    grade: `${nextCfg.tierName} Bản Mệnh`,
    statsBonus: upgradedStats,
    baseEquipment: updatedBaseEquip,
    spirit: updatedSpirit
  };

  updatedPlayer.natalArtifact = updatedNatal;

  const msg = `⚡ [THĂNG GIAI BẢN MỆNH THÀNH CÔNG] Dùng ${nextCfg.requiredEssence.toLocaleString()} Tinh Hoa Rèn Đúc, 【${updatedNatal.name}】 đã đột phá lên 【${nextCfg.tierName}】! Tất cả chỉ số bản mệnh tăng +${Math.round(nextCfg.statMultiplierBonus * 100)}%, mở rộng trần đục lỗ (${nextCfg.maxSocketsUnlock} ô), Khí Linh nhận +${nextCfg.spiritExpBonus.toLocaleString()} EXP!`;

  return {
    success: true,
    updatedPlayer,
    message: msg,
    stageUp
  };
}
