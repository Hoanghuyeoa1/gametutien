// ============================================
// HỆ THỐNG LINH THÚ & TỌA KÝ TIÊN GIA
// ============================================

import {
  SpiritBeast,
  SpiritBeastSkill,
  SpiritBeastStats,
  SpiritBeastStage,
  BeastRole,
  BeastQuality,
  BeastEgg,
  PlayerStats,
  Pill,
  Herb
} from './types';

export interface StageConfig {
  stage: SpiritBeastStage;
  name: string;
  badgeClass: string;
  maxLevel: number;
  maxExp: number;
  statMultiplier: number;
  evolutionCost?: {
    tinhHuyet: number;
    linhThach: number;
  };
}

export const BEAST_STAGES_CONFIG: Record<SpiritBeastStage, StageConfig> = {
  1: {
    stage: 1,
    name: 'Ấu Thể',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50',
    maxLevel: 10,
    maxExp: 300,
    statMultiplier: 1.0,
    evolutionCost: {
      tinhHuyet: 8,
      linhThach: 5000
    }
  },
  2: {
    stage: 2,
    name: 'Thành Niên',
    badgeClass: 'bg-blue-950/60 text-blue-300 border-blue-700/50',
    maxLevel: 25,
    maxExp: 1200,
    statMultiplier: 2.2,
    evolutionCost: {
      tinhHuyet: 25,
      linhThach: 25000
    }
  },
  3: {
    stage: 3,
    name: 'Biến Dị Thần Thú',
    badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-700/50',
    maxLevel: 40,
    maxExp: 4000,
    statMultiplier: 4.5,
    evolutionCost: {
      tinhHuyet: 80,
      linhThach: 100000
    }
  },
  4: {
    stage: 4,
    name: 'Thượng Cổ Thánh Thú',
    badgeClass: 'bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 text-amber-200 border-amber-500/70 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    maxLevel: 60,
    maxExp: 15000,
    statMultiplier: 9.0
  }
};

export interface BeastQualityConfig {
  name: string;
  badgeClass: string;
  color: string;
  glowClass: string;
  multiplier: number;
}

export const BEAST_QUALITY_CONFIG: Record<string, BeastQualityConfig> = {
  ha_pham: {
    name: 'Hạ Phẩm',
    badgeClass: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60',
    color: 'text-zinc-400',
    glowClass: '',
    multiplier: 0.8
  },
  trung_pham: {
    name: 'Trung Phẩm',
    badgeClass: 'bg-blue-950/50 text-blue-300 border-blue-800/40',
    color: 'text-blue-400',
    glowClass: '',
    multiplier: 1.0
  },
  thuong_pham: {
    name: 'Thượng Phẩm',
    badgeClass: 'bg-purple-950/50 text-purple-300 border-purple-800/40',
    color: 'text-purple-400',
    glowClass: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]',
    multiplier: 1.5
  },
  cuc_pham: {
    name: 'Cực Phẩm',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-600/50',
    color: 'text-amber-400',
    glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    multiplier: 2.2
  },
  tuyet_pham: {
    name: 'Tuyệt Phẩm',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50',
    color: 'text-emerald-400',
    glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    multiplier: 2.8
  },
  than_pham: {
    name: 'Thần Phẩm',
    badgeClass: 'bg-gradient-to-r from-rose-950/70 via-amber-950/70 to-red-950/70 text-rose-300 border-rose-500/60',
    color: 'text-rose-400',
    glowClass: 'shadow-[0_0_16px_rgba(244,63,94,0.5)]',
    multiplier: 3.5
  },
  thien_pham: {
    name: 'Thiên Phẩm',
    badgeClass: 'bg-gradient-to-r from-cyan-950/70 via-blue-950/70 to-indigo-950/70 text-cyan-300 border-cyan-500/60',
    color: 'text-cyan-400',
    glowClass: 'shadow-[0_0_16px_rgba(6,182,212,0.5)]',
    multiplier: 4.2
  },
  tien_pham: {
    name: 'Tiên Phẩm',
    badgeClass: 'bg-gradient-to-r from-yellow-950/70 via-amber-900/70 to-yellow-900/70 text-yellow-200 border-yellow-500/70 shadow-[0_0_18px_rgba(234,179,8,0.5)]',
    color: 'text-yellow-300',
    glowClass: 'shadow-[0_0_18px_rgba(234,179,8,0.5)]',
    multiplier: 5.0
  },
  // Aliases for compatibility
  than: {
    name: 'Thần Phẩm',
    badgeClass: 'bg-gradient-to-r from-rose-950/70 via-amber-950/70 to-red-950/70 text-rose-300 border-rose-500/60',
    color: 'text-rose-400',
    glowClass: 'shadow-[0_0_16px_rgba(244,63,94,0.5)]',
    multiplier: 3.5
  },
  tien: {
    name: 'Tiên Phẩm',
    badgeClass: 'bg-gradient-to-r from-yellow-950/70 via-amber-900/70 to-yellow-900/70 text-yellow-200 border-yellow-500/70 shadow-[0_0_18px_rgba(234,179,8,0.5)]',
    color: 'text-yellow-300',
    glowClass: 'shadow-[0_0_18px_rgba(234,179,8,0.5)]',
    multiplier: 5.0
  },
  common: {
    name: 'Hạ Phẩm',
    badgeClass: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60',
    color: 'text-zinc-400',
    glowClass: '',
    multiplier: 0.8
  },
  uncommon: {
    name: 'Trung Phẩm',
    badgeClass: 'bg-blue-950/50 text-blue-300 border-blue-800/40',
    color: 'text-blue-400',
    glowClass: '',
    multiplier: 1.0
  },
  rare: {
    name: 'Thượng Phẩm',
    badgeClass: 'bg-purple-950/50 text-purple-300 border-purple-800/40',
    color: 'text-purple-400',
    glowClass: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]',
    multiplier: 1.5
  },
  epic: {
    name: 'Cực Phẩm',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-600/50',
    color: 'text-amber-400',
    glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    multiplier: 2.2
  },
  legendary: {
    name: 'Tuyệt Phẩm',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50',
    color: 'text-emerald-400',
    glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    multiplier: 2.8
  },
  mythic: {
    name: 'Thần Phẩm',
    badgeClass: 'bg-gradient-to-r from-rose-950/70 via-amber-950/70 to-red-950/70 text-rose-300 border-rose-500/60',
    color: 'text-rose-400',
    glowClass: 'shadow-[0_0_16px_rgba(244,63,94,0.5)]',
    multiplier: 3.5
  }
};

export const DEFAULT_BEAST_QUALITY_CONFIG: BeastQualityConfig = {
  name: 'Phổ Thông',
  badgeClass: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60',
  color: 'text-zinc-400',
  glowClass: '',
  multiplier: 1.0
};

export function getBeastQualityConfig(quality?: string | null): BeastQualityConfig {
  if (!quality) return DEFAULT_BEAST_QUALITY_CONFIG;
  const key = String(quality).toLowerCase().trim();
  return BEAST_QUALITY_CONFIG[key] || DEFAULT_BEAST_QUALITY_CONFIG;
}

export interface SpeciesTemplate {
  species: string;
  baseName: string;
  stageNames: [string, string, string, string];
  avatars: [string, string, string, string];
  defaultQuality: BeastQuality;
  description: string;
  element: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho' | 'ngu_hanh';
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    blockPercent: number;
    mountSpeedBonus: number;
    mpRegenBonus: number;
  };
  skillsByStage: SpiritBeastSkill[];
}

export const SPECIES_TEMPLATES: Record<string, SpeciesTemplate> = {
  thanh_diem_lang: {
    species: 'thanh_diem_lang',
    baseName: 'Thanh Diễm Ma Lang',
    stageNames: [
      'Ấu Lang',
      'Thanh Diễm Ma Lang',
      'U Minh Viêm Lang',
      'Thôn Thiên Ma Lang'
    ],
    avatars: ['🐺', '🐺', '🔥🐺', '👑🐺'],
    defaultQuality: 'thuong_pham',
    description: 'Lang thú sinh ra từ U Minh Địa Hỏa, thần tốc dũng mãnh, răng sắc xé trời.',
    element: 'hoa',
    baseStats: {
      hp: 1200,
      atk: 180,
      def: 95,
      blockPercent: 22,
      mountSpeedBonus: 20,
      mpRegenBonus: 30
    },
    skillsByStage: [
      {
        id: 'lang_viem_no',
        name: 'Viêm Huyết Cuồng Nộ',
        description: 'Tăng 15% Công kích cho chủ nhân khi xuất chiến.',
        effectType: 'damage',
        value: 15,
        icon: '🔥'
      },
      {
        id: 'u_minh_ho_the',
        name: 'U Minh Hộ Thể',
        description: 'Hấp thụ 25% sát thương nhận vào cho chủ nhân.',
        effectType: 'block',
        value: 25,
        icon: '🛡️'
      },
      {
        id: 'thon_thien_chi_no',
        name: 'Thôn Thiên Cuồng Bạo',
        description: 'Khi chủ nhân hấp hối (HP < 20%), kích hoạt Hộ Chủ Chí Tử tạo khiên máu tương đương 30% HP thú cưng.',
        effectType: 'shield',
        value: 30,
        icon: '🐺'
      }
    ]
  },

  bang_phuong: {
    species: 'bang_phuong',
    baseName: 'Băng Tinh Phượng Hoàng',
    stageNames: [
      'Băng Tước',
      'Băng Tinh Phượng',
      'Cửu Thiên Băng Phượng',
      'Thái Sơ Thần Hoàng'
    ],
    avatars: ['🐣', '🦅', '❄️🦅', '👑🦅'],
    defaultQuality: 'than_pham',
    description: 'Thần cầm sinh ra từ Cực Bắc Hàn Băng, lông vũ kết tinh vạn năm huyền băng, niết bàn bất diệt.',
    element: 'thuy',
    baseStats: {
      hp: 2000,
      atk: 220,
      def: 130,
      blockPercent: 28,
      mountSpeedBonus: 25,
      mpRegenBonus: 40
    },
    skillsByStage: [
      {
        id: 'bang_tinh_ho_chu',
        name: 'Băng Cương Hộ Thể',
        description: 'Đỡ đòn 30% sát thương cho chủ nhân và giảm tốc độ kẻ địch.',
        effectType: 'block',
        value: 30,
        icon: '❄️'
      },
      {
        id: 'phuong_hoang_niet_ban',
        name: 'Phượng Hoàng Niết Bàn',
        description: 'Khi chủ nhân nhận đòn chí tử, lập tức dựng hàn băng kết giới hấp thu 35% sát thương.',
        effectType: 'shield',
        value: 35,
        icon: '✨'
      },
      {
        id: 'thoi_khong_phi_hanh',
        name: 'Thái Sơ Phi Hành',
        description: 'Rút ngắn 25% thời gian bế quan thổ nạp và tăng 40% tốc độ hồi phục Chân Nguyên.',
        effectType: 'cultivate_speed',
        value: 25,
        icon: '💨'
      }
    ]
  },

  cuu_vi_ho: {
    species: 'cuu_vi_ho',
    baseName: 'Cửu Vĩ Linh Hồ',
    stageNames: [
      'Bạch Linh Hồ',
      'Tam Vĩ Linh Hồ',
      'Lục Vĩ Yêu Hồ',
      'Cửu Vĩ Thiên Hồ'
    ],
    avatars: ['🦊', '🦊', '🌸🦊', '👑🦊'],
    defaultQuality: 'cuc_pham',
    description: 'Linh hồ Thanh Khâu, tu luyện ngàn năm sinh thêm đuôi mới, thông tuệ hơn người, huyễn thuật vô song.',
    element: 'moc',
    baseStats: {
      hp: 1500,
      atk: 195,
      def: 110,
      blockPercent: 25,
      mountSpeedBonus: 22,
      mpRegenBonus: 35
    },
    skillsByStage: [
      {
        id: 'ho_mi_huyen_thuat',
        name: 'Hồ Mị Huyễn Thuật',
        description: 'Làm rối loạn tâm trí địch nhân, giảm 15% công kích của Boss.',
        effectType: 'debuff',
        value: 15,
        icon: '🌸'
      },
      {
        id: 'linh_ho_ho_chu',
        name: 'Linh Vĩ Hộ Thân',
        description: 'Chín đuôi cuộn tròn đỡ thay 26% sát thương và hồi phục khí huyết cho chủ nhân.',
        effectType: 'heal',
        value: 20,
        icon: '✨'
      }
    ]
  },

  thao_thiet: {
    species: 'thao_thiet',
    baseName: 'Thao Thiết Ấu Thú',
    stageNames: [
      'Thao Thiết Con',
      'Hắc Ám Thao Thiết',
      'Thôn Thiên Thao Thiết',
      'Thái Cổ Hỗn Độn Thao Thiết'
    ],
    avatars: ['🐾', '🐲', '🌑🐲', '👑🐲'],
    defaultQuality: 'than_pham',
    description: 'Thượng Cổ Tứ Đại Hung Thú, dạ dày chứa cả càn khôn, vạn vật đều có thể nuốt trọn chuyển hóa thành linh lực.',
    element: 'tho',
    baseStats: {
      hp: 2500,
      atk: 250,
      def: 160,
      blockPercent: 35,
      mountSpeedBonus: 20,
      mpRegenBonus: 30
    },
    skillsByStage: [
      {
        id: 'thao_thiet_thon_phe',
        name: 'Thao Thiết Thôn Phệ',
        description: 'Hút 20% sát thương của Boss chuyển hóa thành khiên đỡ hộ chủ.',
        effectType: 'block',
        value: 35,
        icon: '🌀'
      },
      {
        id: 'hon_don_ho_chu',
        name: 'Hộ Chủ Chí Tử',
        description: 'Khi chủ nhân dưới 20% HP, tạo lồng hộ thân cực hạn tương đương 35% máu của Thao Thiết.',
        effectType: 'shield',
        value: 35,
        icon: '🛡️'
      }
    ]
  },

  bach_ho: {
    species: 'bach_ho',
    baseName: 'Bạch Hổ Chiến Thú',
    stageNames: [
      'Bạch Hổ Ấu',
      'Tây Phương Bạch Hổ',
      'Canh Kim Bạch Hổ',
      'Thượng Cổ Sát Phạt Bạch Hổ'
    ],
    avatars: ['🐯', '🐯', '⚡🐯', '👑🐯'],
    defaultQuality: 'cuc_pham',
    description: 'Thánh thú chủ quản sát phạt phương Tây, mang theo Canh Kim Sát Khí, một trảo phá nát phòng ngự.',
    element: 'kim',
    baseStats: {
      hp: 1700,
      atk: 240,
      def: 115,
      blockPercent: 24,
      mountSpeedBonus: 22,
      mpRegenBonus: 28
    },
    skillsByStage: [
      {
        id: 'canh_kim_sat_khi',
        name: 'Canh Kim Sát Khí',
        description: 'Tăng 20% Bạo kích và xuyên phá 20% giáp của Boss.',
        effectType: 'damage',
        value: 20,
        icon: '⚔️'
      }
    ]
  },

  huyen_vu: {
    species: 'huyen_vu',
    baseName: 'Huyền Vũ Thần Quy',
    stageNames: [
      'Linh Quy',
      'Huyền Giáp Quy',
      'Bắc Minh Huyền Vũ',
      'Hỗn Độn Huyền Vũ Thánh Thú'
    ],
    avatars: ['🐢', '🐢', '🌊🐢', '👑🐢'],
    defaultQuality: 'thuong_pham',
    description: 'Thánh thú phương Bắc, mai rùa vững chắc như thái sơn, bất tử bất diệt, hộ chủ vô song.',
    element: 'thuy',
    baseStats: {
      hp: 2800,
      atk: 130,
      def: 210,
      blockPercent: 35,
      mountSpeedBonus: 18,
      mpRegenBonus: 35
    },
    skillsByStage: [
      {
        id: 'huyen_giap_ho_the',
        name: 'Huyền Giáp Thái Sơn',
        description: 'Đỡ đòn 35% sát thương trực diện cho chủ nhân.',
        effectType: 'block',
        value: 35,
        icon: '🛡️'
      }
    ]
  }
};

/**
 * Mẫu Trứng Thần Thú (Linh Noãn)
 */
export const BEAST_EGG_TEMPLATES: Record<string, {
  name: string;
  quality: BeastQuality;
  potentialSpecies: string[];
  description: string;
  avatar: string;
}> = {
  egg_bach_thu: {
    name: 'Bạch Thú Linh Noãn',
    quality: 'trung_pham',
    potentialSpecies: ['thanh_diem_lang', 'huyen_vu'],
    description: 'Trứng linh thú cơ bản phát ra linh khí dịu nhẹ, cần rót chân nguyên nuôi dưỡng.',
    avatar: '🥚'
  },
  egg_u_minh: {
    name: 'U Minh Yêu Noãn',
    quality: 'thuong_pham',
    potentialSpecies: ['thanh_diem_lang', 'huyen_vu', 'cuu_vi_ho'],
    description: 'Bên trong ẩn chứa tiếng gầm gừ trầm thấp, tỏa ra hơi thở yêu thú thượng thừa.',
    avatar: '🟣🥚'
  },
  egg_thanh_tinh: {
    name: 'Thánh Tinh Thần Noãn',
    quality: 'cuc_pham',
    potentialSpecies: ['cuu_vi_ho', 'bach_ho', 'bang_phuong'],
    description: 'Trứng thần thú ngưng tụ tinh hoa nhật nguyệt, vỏ ngoài lưu chuyển ngũ sắc thần quang.',
    avatar: '✨🥚'
  },
  egg_thai_co: {
    name: 'Thái Cổ Hồng Hoang Noãn',
    quality: 'than_pham',
    potentialSpecies: ['bang_phuong', 'thao_thiet', 'bach_ho'],
    description: 'Dị quả hồng hoang ngàn năm hiếm gặp, ẩn chứa huyết mạch thánh thú thái cổ vạn kiếp bất diệt!',
    avatar: '👑🥚'
  }
};

/**
 * Khởi tạo một Linh Thú mới từ Species
 */
export function createBeastFromSpecies(
  speciesKey: string,
  quality?: BeastQuality,
  customName?: string
): SpiritBeast {
  const template = SPECIES_TEMPLATES[speciesKey] || SPECIES_TEMPLATES.thanh_diem_lang;
  const beastQuality = quality || template.defaultQuality;
  const qCfg = getBeastQualityConfig(beastQuality);
  const sCfg = BEAST_STAGES_CONFIG[1];

  const mul = qCfg.multiplier * sCfg.statMultiplier;

  const stats: SpiritBeastStats = {
    hp: Math.floor(template.baseStats.hp * mul),
    maxHp: Math.floor(template.baseStats.hp * mul),
    atk: Math.floor(template.baseStats.atk * mul),
    def: Math.floor(template.baseStats.def * mul),
    blockPercent: Math.min(45, Math.floor(template.baseStats.blockPercent * (1 + (qCfg.multiplier - 1) * 0.2))),
    mountSpeedBonus: template.baseStats.mountSpeedBonus,
    mpRegenBonus: template.baseStats.mpRegenBonus
  };

  return {
    id: `beast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    species: template.species,
    name: customName || template.stageNames[0],
    quality: beastQuality,
    stage: 1,
    stageName: sCfg.name,
    level: 1,
    exp: 0,
    maxExp: sCfg.maxExp,
    loyalty: 80,
    role: 'combat',
    stats,
    skills: [template.skillsByStage[0]],
    avatar: template.avatars[0],
    description: template.description,
    element: template.element
  };
}

/**
 * Tạo ngẫu nhiên một Trứng Linh Thú
 */
export function createRandomEgg(specificKey?: string): BeastEgg {
  const keys = Object.keys(BEAST_EGG_TEMPLATES);
  const pickedKey = specificKey || keys[Math.floor(Math.random() * keys.length)];
  const tpl = BEAST_EGG_TEMPLATES[pickedKey] || BEAST_EGG_TEMPLATES.egg_u_minh;
  const species = tpl.potentialSpecies[Math.floor(Math.random() * tpl.potentialSpecies.length)];

  return {
    id: `egg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: tpl.name,
    quality: tpl.quality,
    potentialSpecies: species,
    progress: 0,
    requiredProgress: 100,
    infusedLinhThach: 0,
    infusedMp: 0,
    description: tpl.description,
    avatar: tpl.avatar
  };
}

/**
 * Rót Chân Nguyên (MP) để ấp trứng
 */
export function infuseEggWithMp(
  egg: BeastEgg,
  currentMp: number
): {
  updatedEgg: BeastEgg;
  mpCost: number;
  progressGain: number;
  hatchedBeast?: SpiritBeast;
  message: string;
} {
  const mpCost = 60;
  if (currentMp < mpCost) {
    return {
      updatedEgg: egg,
      mpCost: 0,
      progressGain: 0,
      message: 'Chân Nguyên không đủ để quán chú vào linh noãn (cần 60 MP)!'
    };
  }

  const progressGain = 15;
  const newProgress = Math.min(egg.requiredProgress, egg.progress + progressGain);
  const isHatched = newProgress >= egg.requiredProgress;

  const updatedEgg: BeastEgg = {
    ...egg,
    progress: newProgress,
    infusedMp: egg.infusedMp + mpCost
  };

  let hatchedBeast: SpiritBeast | undefined = undefined;
  if (isHatched) {
    hatchedBeast = createBeastFromSpecies(egg.potentialSpecies, egg.quality);
  }

  return {
    updatedEgg,
    mpCost,
    progressGain,
    hatchedBeast,
    message: isHatched
      ? `✨ Linh Noãn đã nứt vỏ! Một đầu [${hatchedBeast?.name}] giáng thế thành công!`
      : `Quán chú ${mpCost} Chân Nguyên thành công! Tiến độ ấp nở +${progressGain}%.`
  };
}

/**
 * Rót Linh Thạch để ấp trứng
 */
export function infuseEggWithLinhThach(
  egg: BeastEgg,
  currentLinhThach: number
): {
  updatedEgg: BeastEgg;
  linhThachCost: number;
  progressGain: number;
  hatchedBeast?: SpiritBeast;
  message: string;
} {
  const linhThachCost = 2500;
  if (currentLinhThach < linhThachCost) {
    return {
      updatedEgg: egg,
      linhThachCost: 0,
      progressGain: 0,
      message: 'Linh Thạch không đủ để bày trận ấp trứng (cần 2,500 Linh Thạch)!'
    };
  }

  const progressGain = 25;
  const newProgress = Math.min(egg.requiredProgress, egg.progress + progressGain);
  const isHatched = newProgress >= egg.requiredProgress;

  const updatedEgg: BeastEgg = {
    ...egg,
    progress: newProgress,
    infusedLinhThach: egg.infusedLinhThach + linhThachCost
  };

  let hatchedBeast: SpiritBeast | undefined = undefined;
  if (isHatched) {
    hatchedBeast = createBeastFromSpecies(egg.potentialSpecies, egg.quality);
  }

  return {
    updatedEgg,
    linhThachCost,
    progressGain,
    hatchedBeast,
    message: isHatched
      ? `✨ Linh Thạch tràn đầy, Linh Noãn vỡ tung! Một đầu [${hatchedBeast?.name}] giáng thế thành công!`
      : `Đốt ${linhThachCost} Linh Thạch trợ trận! Tiến độ ấp nở +${progressGain}%.`
  };
}

/**
 * Cho Linh Thú ăn Đan Dược thừa (Bể tiêu thụ đan dược thừa)
 */
export function feedBeastWithPill(
  beast: SpiritBeast,
  pill: Pill,
  count: number = 1
): {
  updatedBeast: SpiritBeast;
  expGained: number;
  loyaltyGained: number;
  levelUps: number;
  message: string;
} {
  // Điểm linh khí tính theo grade và quality của đan dược
  let baseExp = 25;
  if (pill.grade === 'Nhị Giai') baseExp = 60;
  else if (pill.grade === 'Tam Giai') baseExp = 150;
  else if (pill.grade === 'Tứ Giai') baseExp = 380;
  else if (pill.grade === 'Ngũ Giai') baseExp = 900;
  else if (pill.grade === 'Lục Giai' || pill.grade === 'Thất Giai') baseExp = 2500;

  const qualityMul = pill.quality === 'tuyet_pham' ? 2.5
    : pill.quality === 'cuc_pham' ? 2.0
    : pill.quality === 'thuong_pham' ? 1.6
    : pill.quality === 'trung_pham' ? 1.3 : 1.0;

  const expPerItem = Math.floor(baseExp * qualityMul);
  const expGained = expPerItem * count;
  const loyaltyGained = Math.min(100 - beast.loyalty, Math.max(1, count * 2));

  let currentExp = beast.exp + expGained;
  let currentLevel = beast.level;
  let currentMaxExp = beast.maxExp;
  let levelUps = 0;

  const stageCfg = BEAST_STAGES_CONFIG[beast.stage];

  while (currentExp >= currentMaxExp && currentLevel < stageCfg.maxLevel) {
    currentExp -= currentMaxExp;
    currentLevel++;
    levelUps++;
    currentMaxExp = Math.floor(currentMaxExp * 1.25);
  }

  // Tăng chỉ số khi level up
  let newStats = { ...beast.stats };
  if (levelUps > 0) {
    const qCfg = getBeastQualityConfig(beast.quality);
    const statGrowth = levelUps * qCfg.multiplier * 0.08;
    newStats.hp = Math.floor(newStats.hp * (1 + statGrowth));
    newStats.maxHp = Math.floor(newStats.maxHp * (1 + statGrowth));
    newStats.atk = Math.floor(newStats.atk * (1 + statGrowth));
    newStats.def = Math.floor(newStats.def * (1 + statGrowth));
  }

  const updatedBeast: SpiritBeast = {
    ...beast,
    level: currentLevel,
    exp: currentExp,
    maxExp: currentMaxExp,
    loyalty: Math.min(100, beast.loyalty + loyaltyGained),
    stats: newStats
  };

  const message = levelUps > 0
    ? `Cho ăn ${count}x [${pill.name}]! Nhận +${expGained} Linh Khí, độ trung thành +${loyaltyGained}%. Linh thú thăng liền ${levelUps} cấp (Cấp ${currentLevel})!`
    : `Cho ăn ${count}x [${pill.name}]! Nhận +${expGained} Linh Khí, độ trung thành +${loyaltyGained}%.`;

  return {
    updatedBeast,
    expGained,
    loyaltyGained,
    levelUps,
    message
  };
}

/**
 * Cho Linh Thú ăn Thảo Dược thừa
 */
export function feedBeastWithHerb(
  beast: SpiritBeast,
  herb: Herb,
  count: number = 1
): {
  updatedBeast: SpiritBeast;
  expGained: number;
  loyaltyGained: number;
  levelUps: number;
  message: string;
} {
  let baseExp = 12;
  if (herb.grade === 'Nhị Giai') baseExp = 30;
  else if (herb.grade === 'Tam Giai') baseExp = 80;
  else if (herb.grade === 'Tứ Giai') baseExp = 200;
  else if (herb.grade === 'Ngũ Giai') baseExp = 500;

  const qualityMul = herb.quality === 'tuyet_pham' ? 2.2
    : herb.quality === 'cuc_pham' ? 1.8
    : herb.quality === 'thuong_pham' ? 1.5
    : herb.quality === 'trung_pham' ? 1.2 : 1.0;

  const expGained = Math.floor(baseExp * qualityMul) * count;
  const loyaltyGained = Math.min(100 - beast.loyalty, Math.max(1, count));

  let currentExp = beast.exp + expGained;
  let currentLevel = beast.level;
  let currentMaxExp = beast.maxExp;
  let levelUps = 0;

  const stageCfg = BEAST_STAGES_CONFIG[beast.stage];

  while (currentExp >= currentMaxExp && currentLevel < stageCfg.maxLevel) {
    currentExp -= currentMaxExp;
    currentLevel++;
    levelUps++;
    currentMaxExp = Math.floor(currentMaxExp * 1.25);
  }

  let newStats = { ...beast.stats };
  if (levelUps > 0) {
    const qCfg = getBeastQualityConfig(beast.quality);
    const statGrowth = levelUps * qCfg.multiplier * 0.08;
    newStats.hp = Math.floor(newStats.hp * (1 + statGrowth));
    newStats.maxHp = Math.floor(newStats.maxHp * (1 + statGrowth));
    newStats.atk = Math.floor(newStats.atk * (1 + statGrowth));
    newStats.def = Math.floor(newStats.def * (1 + statGrowth));
  }

  const updatedBeast: SpiritBeast = {
    ...beast,
    level: currentLevel,
    exp: currentExp,
    maxExp: currentMaxExp,
    loyalty: Math.min(100, beast.loyalty + loyaltyGained),
    stats: newStats
  };

  return {
    updatedBeast,
    expGained,
    loyaltyGained,
    levelUps,
    message: `Bồi bổ ${count}x [${herb.name}]! Nhận +${expGained} Linh Khí, độ trung thành +${loyaltyGained}%.`
  };
}

/**
 * Kiểm tra điều kiện tiến hóa đột phá của Linh Thú
 */
export function checkCanEvolveBeast(
  beast: SpiritBeast,
  player: PlayerStats
): {
  canEvolve: boolean;
  reason?: string;
  cost?: { tinhHuyet: number; linhThach: number };
} {
  if (beast.stage >= 4) {
    return { canEvolve: false, reason: 'Linh Thú đã đạt đến đỉnh phong cảnh giới: Thượng Cổ Thánh Thú!' };
  }

  const currentCfg = BEAST_STAGES_CONFIG[beast.stage];
  if (beast.level < currentCfg.maxLevel) {
    return {
      canEvolve: false,
      reason: `Linh Thú cần đạt Cấp độ tối đa ${currentCfg.maxLevel} của giai đoạn hiện tại (hiện tại: Lv ${beast.level})!`
    };
  }

  const nextStage = (beast.stage + 1) as SpiritBeastStage;
  const cost = currentCfg.evolutionCost;
  if (!cost) {
    return { canEvolve: false, reason: 'Không tìm thấy thông tin tiến hóa!' };
  }

  const currentTinhHuyet = player.tinhHuyetYeuThu || 0;
  if (currentTinhHuyet < cost.tinhHuyet) {
    return {
      canEvolve: false,
      reason: `Không đủ Tinh Huyết Yêu Thú! Cần ${cost.tinhHuyet} giọt (hiện có: ${currentTinhHuyet}). Đánh bại Boss thí luyện để thu thập!`,
      cost
    };
  }

  if (player.linhThach < cost.linhThach) {
    return {
      canEvolve: false,
      reason: `Không đủ Linh Thạch! Cần ${cost.linhThach.toLocaleString()} Linh Thạch (hiện có: ${player.linhThach.toLocaleString()}).`,
      cost
    };
  }

  return { canEvolve: true, cost };
}

/**
 * Thực hiện Tiến Hóa Linh Thú
 */
export function evolveBeast(
  beast: SpiritBeast,
  player: PlayerStats
): {
  updatedBeast: SpiritBeast;
  updatedPlayer: PlayerStats;
  message: string;
} {
  const check = checkCanEvolveBeast(beast, player);
  if (!check.canEvolve || !check.cost) {
    return {
      updatedBeast: beast,
      updatedPlayer: player,
      message: check.reason || 'Tiến hóa thất bại!'
    };
  }

  const nextStage = (beast.stage + 1) as SpiritBeastStage;
  const nextStageCfg = BEAST_STAGES_CONFIG[nextStage];
  const tpl = SPECIES_TEMPLATES[beast.species] || SPECIES_TEMPLATES.thanh_diem_lang;

  // Cập nhật tên và avatar theo giai thoại
  const newName = tpl.stageNames[nextStage - 1] || beast.name;
  const newAvatar = tpl.avatars[nextStage - 1] || beast.avatar;

  // Nhân chỉ số stats
  const statMul = 2.1;
  const newStats: SpiritBeastStats = {
    hp: Math.floor(beast.stats.hp * statMul),
    maxHp: Math.floor(beast.stats.maxHp * statMul),
    atk: Math.floor(beast.stats.atk * statMul),
    def: Math.floor(beast.stats.def * statMul),
    blockPercent: Math.min(45, beast.stats.blockPercent + 5),
    mountSpeedBonus: Math.min(30, beast.stats.mountSpeedBonus + 3),
    mpRegenBonus: Math.min(50, beast.stats.mpRegenBonus + 5)
  };

  // Mở khóa kỹ năng mới nếu có
  const newSkills = [...beast.skills];
  if (tpl.skillsByStage[nextStage - 1] && !newSkills.some(s => s.id === tpl.skillsByStage[nextStage - 1].id)) {
    newSkills.push(tpl.skillsByStage[nextStage - 1]);
  }

  const updatedBeast: SpiritBeast = {
    ...beast,
    stage: nextStage,
    stageName: nextStageCfg.name,
    name: newName,
    avatar: newAvatar,
    stats: newStats,
    skills: newSkills,
    exp: 0,
    maxExp: nextStageCfg.maxExp,
    loyalty: 100
  };

  // Trừ tài nguyên player
  const updatedPlayer: PlayerStats = {
    ...player,
    tinhHuyetYeuThu: Math.max(0, (player.tinhHuyetYeuThu || 0) - check.cost.tinhHuyet),
    linhThach: Math.max(0, player.linhThach - check.cost.linhThach),
    beasts: (player.beasts || []).map(b => b.id === beast.id ? updatedBeast : b)
  };

  return {
    updatedBeast,
    updatedPlayer,
    message: `🎉 Thần thú tiến hóa vang dội! [${beast.name}] đã lột xác thành công lên [${updatedBeast.name}] (${nextStageCfg.name})! Chỉ số sinh mệnh tăng vọt, mở khóa thần thông hộ chủ!`
  };
}
