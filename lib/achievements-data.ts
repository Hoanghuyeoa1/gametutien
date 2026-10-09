// lib/achievements-data.ts
// Dữ liệu & Logic Hệ Thống Thành Tựu & Danh Hiệu Tiên Giới (Achievements & Titles)

import {
  TitleRarity,
  TitleDefinition,
  TitleBuff,
  AchievementDefinition,
  AchievementCategory,
  AchievementsState,
  PlayerStats
} from '@/lib/types';

export const TITLE_RARITY_CONFIG: Record<TitleRarity, { label: string; color: string; borderClass: string; bgClass: string }> = {
  pham: {
    label: 'Phàm Phẩm',
    color: '#9ca3af',
    borderClass: 'border-zinc-600/50',
    bgClass: 'bg-zinc-900/60 text-zinc-300'
  },
  linh: {
    label: 'Linh Phẩm',
    color: '#34d399',
    borderClass: 'border-emerald-500/50',
    bgClass: 'bg-emerald-950/60 text-emerald-300'
  },
  huyen: {
    label: 'Huyền Phẩm',
    color: '#38bdf8',
    borderClass: 'border-sky-500/50',
    bgClass: 'bg-sky-950/60 text-sky-300'
  },
  dia: {
    label: 'Địa Phẩm',
    color: '#c084fc',
    borderClass: 'border-purple-500/60',
    bgClass: 'bg-purple-950/60 text-purple-300'
  },
  thien: {
    label: 'Thiên Phẩm',
    color: '#fbbf24',
    borderClass: 'border-amber-500/70',
    bgClass: 'bg-amber-950/70 text-amber-200'
  },
  than: {
    label: 'Thần Phẩm',
    color: '#f43f5e',
    borderClass: 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    bgClass: 'bg-gradient-to-r from-rose-950/80 via-purple-950/80 to-amber-950/80 text-rose-200'
  }
};

export const TITLES_CONFIG: Record<string, TitleDefinition> = {
  title_pham_nhan: {
    id: 'title_pham_nhan',
    name: 'Sơ Khai Tu Tiên',
    icon: '🌱',
    rarity: 'pham',
    description: 'Vừa bước chân vào con đường tầm tiên vấn đạo, trần duyên chưa dứt.',
    badgeClass: 'border-zinc-600/60 bg-zinc-900/60 text-zinc-300 shadow-sm',
    textGradient: 'from-zinc-200 to-zinc-400',
    glowColor: 'rgba(156, 163, 175, 0.2)',
    buffs: {
      cultivateSpeedBonusPercent: 3,
      hpPercent: 3
    }
  },
  title_kiem_tien: {
    id: 'title_kiem_tien',
    name: 'Kiếm Tiên Tái Thế',
    icon: '⚔️',
    rarity: 'huyen',
    description: 'Kiếm ý quán triệt nhật nguyệt, một kiếm phá vạn pháp!',
    badgeClass: 'border-sky-500/60 bg-sky-950/60 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.25)]',
    textGradient: 'from-sky-200 via-cyan-300 to-blue-200',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    buffs: {
      atkPercent: 10,
      critRatePercent: 5,
      critDmgPercent: 15
    }
  },
  title_dan_dao: {
    id: 'title_dan_dao',
    name: 'Đan Đạo Tông Sư',
    icon: '🔮',
    rarity: 'huyen',
    description: 'Lô hỏa thuần thanh, luyện đan thông thần, được muôn người kính ngưỡng.',
    badgeClass: 'border-emerald-500/60 bg-emerald-950/60 text-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.25)]',
    textGradient: 'from-emerald-200 via-teal-300 to-green-200',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    buffs: {
      alchemySuccessBonus: 15,
      cultivateSpeedBonusPercent: 6,
      defPercent: 6
    }
  },
  title_linh_nong: {
    id: 'title_linh_nong',
    name: 'Linh Nông Chân Nhân',
    icon: '🌿',
    rarity: 'linh',
    description: 'Am hiểu thổ nhưỡng linh điền, bách thảo tươi tốt quanh năm.',
    badgeClass: 'border-emerald-600/50 bg-emerald-950/50 text-emerald-300',
    textGradient: 'from-emerald-300 to-teal-400',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    buffs: {
      gardenYieldBonusPercent: 25,
      hpPercent: 8
    }
  },
  title_da_tinh: {
    id: 'title_da_tinh',
    name: 'Đa Tình Tiên Tôn',
    icon: '🌸',
    rarity: 'dia',
    description: 'Tiên hoa vây quanh, giai nhân bầu bạn, song tu cùng tiến bước trường sinh.',
    badgeClass: 'border-purple-500/70 bg-purple-950/60 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.3)]',
    textGradient: 'from-purple-200 via-pink-300 to-rose-200',
    glowColor: 'rgba(192, 132, 252, 0.35)',
    buffs: {
      cultivateSpeedBonusPercent: 12,
      defPercent: 10,
      hpPercent: 10
    }
  },
  title_sat_than: {
    id: 'title_sat_than',
    name: 'Vạn Yêu Tru Diệt',
    icon: '🩸',
    rarity: 'dia',
    description: 'Sát khí ngút trời, trảm sát hàng trăm yêu ma hung thú chấn nhiếp bát hoang.',
    badgeClass: 'border-red-500/70 bg-red-950/60 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.35)]',
    textGradient: 'from-red-300 via-rose-300 to-amber-300',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    buffs: {
      atkPercent: 15,
      critDmgPercent: 25,
      speedBonus: 8
    }
  },
  title_tran_ma: {
    id: 'title_tran_ma',
    name: 'Trấn Ma Thần Quân',
    icon: '🏯',
    rarity: 'thien',
    description: 'Vượt 50 tầng Trấn Ma Tháp, phong ấn vạn ma tàn niệm.',
    badgeClass: 'border-amber-500/80 bg-gradient-to-r from-amber-950/80 to-purple-950/80 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.4)]',
    textGradient: 'from-amber-200 via-yellow-200 to-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    buffs: {
      atkPercent: 16,
      defPercent: 16,
      speedBonus: 12
    }
  },
  title_luyen_khi: {
    id: 'title_luyen_khi',
    name: 'Thần Binh Tông Sư',
    icon: '🔨',
    rarity: 'linh',
    description: 'Tay cầm thần chùy tôi luyện trăm trượng huyền thiết, đúc tạo thần binh.',
    badgeClass: 'border-amber-600/50 bg-amber-950/50 text-amber-300',
    textGradient: 'from-amber-300 to-orange-400',
    glowColor: 'rgba(217, 119, 6, 0.25)',
    buffs: {
      atkPercent: 8,
      defPercent: 8
    }
  },
  title_phu_ho: {
    id: 'title_phu_ho',
    name: 'Vạn Bảo Cự Phú',
    icon: '💰',
    rarity: 'linh',
    description: 'Linh thạch chồng chất như núi, thương đội tung hoành tam giới.',
    badgeClass: 'border-yellow-500/60 bg-yellow-950/50 text-yellow-300',
    textGradient: 'from-yellow-200 to-amber-400',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    buffs: {
      critRatePercent: 6,
      cultivateSpeedBonusPercent: 5
    }
  },
  title_truong_sinh: {
    id: 'title_truong_sinh',
    name: 'Đế Tổ Vô Song',
    icon: '👑',
    rarity: 'than',
    description: 'Chí tôn tam giới, siêu thoát luân hồi, muôn đời vạn kiếp bất diệt!',
    badgeClass: 'border-rose-400/90 bg-gradient-to-r from-rose-950 via-purple-950 to-amber-950 text-amber-100 shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse',
    textGradient: 'from-yellow-200 via-rose-300 to-amber-200',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    buffs: {
      atkPercent: 30,
      defPercent: 25,
      hpPercent: 25,
      cultivateSpeedBonusPercent: 25,
      critRatePercent: 12,
      critDmgPercent: 35,
      speedBonus: 20
    }
  },
  title_cuu_chuyen_dan_ton: {
    id: 'title_cuu_chuyen_dan_ton',
    name: 'Cửu Chuyển Đan Tôn',
    icon: '🌟',
    rarity: 'thien',
    description: 'Nghịch thiên ngưng tụ Cửu Chuyển Hỗn Độn Đan, đan khí chấn động chư thiên vạn giới.',
    badgeClass: 'border-amber-500/80 bg-gradient-to-r from-amber-950/80 via-yellow-950/80 to-black/80 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    textGradient: 'from-amber-200 via-yellow-300 to-amber-100',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    buffs: {
      critRatePercent: 8,
      critDmgPercent: 20,
      atkPercent: 12
    }
  },
  title_da_tinh_kiem_tien: {
    id: 'title_da_tinh_kiem_tien',
    name: 'Đa Tình Kiếm Tiên',
    icon: '🌸',
    rarity: 'thien',
    description: 'Vấn tình nhập đạo, lấy tình dưỡng kiếm, kiếm ý trường tồn bất diệt thủ hộ hồng nhan.',
    badgeClass: 'border-purple-500/80 bg-gradient-to-r from-purple-950/80 via-pink-950/80 to-black/80 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.35)]',
    textGradient: 'from-purple-200 via-pink-300 to-indigo-200',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    buffs: {
      hpPercent: 15,
      defPercent: 12,
      cultivateSpeedBonusPercent: 15
    }
  },
  title_hoa_than_thien_ton: {
    id: 'title_hoa_than_thien_ton',
    name: 'Hóa Thần Thiên Tôn',
    icon: '👑',
    rarity: 'than',
    description: 'Khai mở Thần Chi Lĩnh Vực, ngạo thị nhân gian, vạn tu sĩ đều phải cúi đầu xưng thần.',
    badgeClass: 'border-rose-500/90 bg-gradient-to-r from-rose-950/90 via-amber-950/90 to-purple-950/90 text-amber-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse',
    textGradient: 'from-amber-200 via-rose-300 to-yellow-200',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    buffs: {
      atkPercent: 25,
      defPercent: 20,
      speedBonus: 15,
      critRatePercent: 10
    }
  },
  title_tinh_khong_du_gia: {
    id: 'title_tinh_khong_du_gia',
    name: 'Tinh Không Du Giả',
    icon: '🪐',
    rarity: 'thien',
    description: 'Độc hành nơi Vực Ngoại Tinh Không, cùng Tinh Không Cổ Thú tương giao, thấu suốt huyền bí hư không chư thiên.',
    badgeClass: 'border-amber-500/80 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-amber-950/80 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    textGradient: 'from-amber-200 via-purple-300 to-indigo-200',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    buffs: {
      cultivateSpeedBonusPercent: 5,
      speedBonus: 25
    }
  },
  title_tien_minh_chap_phap: {
    id: 'title_tien_minh_chap_phap',
    name: 'Tiên Minh Chấp Pháp Sứ',
    icon: '🏛️',
    rarity: 'thien',
    description: 'Chưởng quản lệnh bài chấp pháp Thái Cổ Tiên Minh, duy trì trật tự tinh vực, vạn tà quy phục.',
    badgeClass: 'border-cyan-500/80 bg-gradient-to-r from-cyan-950/80 via-sky-950/80 to-amber-950/80 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    textGradient: 'from-cyan-200 via-sky-300 to-amber-200',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    buffs: {
      dmgReduction: 8,
      dmgReductionPercent: 8,
      defPercent: 12
    }
  },
  title_tinh_vuc_ma_quan: {
    id: 'title_tinh_vuc_ma_quan',
    name: 'Tinh Vực Ma Quân',
    icon: '🦹',
    rarity: 'thien',
    description: 'Nhập trận Vạn Ma Tinh Vực, lấy sát phạt khai lộ, ma diễm cuồn cuộn chấn nhiếp chư thiên.',
    badgeClass: 'border-rose-600/80 bg-gradient-to-r from-rose-950/80 via-red-950/80 to-black/80 text-rose-200 shadow-[0_0_15px_rgba(225,29,72,0.35)]',
    textGradient: 'from-rose-300 via-red-400 to-amber-300',
    glowColor: 'rgba(225, 29, 72, 0.4)',
    buffs: {
      lifestealPercent: 10,
      hutMauPercent: 10,
      critRatePercent: 8,
      atkPercent: 12
    }
  },
  title_nghich_thien_dao_ton: {
    id: 'title_nghich_thien_dao_ton',
    name: 'Nghịch Thiên Đạo Tôn',
    icon: '⚡',
    rarity: 'than',
    description: 'Bản mệnh do ngã bất do thiên! Trước Thiên Đạo Chi Ý sừng sững bất khuất, ngưng tụ Nghịch Thiên Đạo Quả vô song.',
    badgeClass: 'border-rose-500/90 bg-gradient-to-r from-rose-950/90 via-purple-950/90 to-amber-950/90 text-amber-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse',
    textGradient: 'from-yellow-200 via-rose-300 to-amber-200',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    buffs: {
      atkPercent: 15,
      critRatePercent: 10,
      critDmgPercent: 20
    }
  },
  title_chan_tien_hoa_than: {
    id: 'title_chan_tien_hoa_than',
    name: 'Chân Tiên Hóa Thân',
    icon: '⛩️',
    rarity: 'than',
    description: 'Vượt qua Cửu Cửu Thiên Kiếp, tắm mình trong tiên quang tiếp dẫn, đạp mây vàng phi thăng Tiên Giới thượng tầng!',
    badgeClass: 'border-amber-400/90 bg-gradient-to-r from-amber-950 via-yellow-950 to-orange-950 text-yellow-100 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-pulse',
    textGradient: 'from-yellow-100 via-amber-200 to-yellow-400',
    glowColor: 'rgba(251, 191, 36, 0.6)',
    buffs: {
      atkPercent: 20,
      defPercent: 20,
      speedBonus: 25,
      critRatePercent: 10,
      critDmgPercent: 20,
      cultivateSpeedBonusPercent: 20
    }
  },
  title_nhan_gian_tran_thu: {
    id: 'title_nhan_gian_tran_thu',
    name: 'Nhân Gian Trấn Thủ Giả',
    icon: '🛡️',
    rarity: 'than',
    description: 'Phong ấn Tiên Giới Chi Môn, cắm đại kiếm thủ hộ cố thổ quê hương, một người trấn thủ ranh giới nhân gian vạn năm bất động!',
    badgeClass: 'border-emerald-500/90 bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-amber-950/90 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse',
    textGradient: 'from-emerald-200 via-teal-300 to-amber-200',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    buffs: {
      dmgReduction: 25,
      dmgReductionPercent: 25,
      hpRegenPercent: 5,
      defPercent: 25,
      hpPercent: 20
    }
  },

  // -------------------------------------------------------------
  // DANH HIỆU THIÊN KIÊU BẢNG (VẠN TIÊN ĐẠI HỘI LADDER)
  // -------------------------------------------------------------
  title_van_gioi_de_nhat_kiem: {
    id: 'title_van_gioi_de_nhat_kiem',
    name: 'Vạn Giới Đệ Nhất Kiếm',
    icon: '🗡️',
    rarity: 'than',
    description: 'Quán quân Đương Thế Vô Địch của Thiên Kiêu Bảng, một kiếm áp đảo chư thiên vạn giới!',
    badgeClass: 'border-amber-400 bg-gradient-to-r from-amber-950 via-yellow-950 to-orange-950 text-amber-100 shadow-[0_0_25px_rgba(251,191,36,0.8)] animate-pulse ring-2 ring-yellow-400/60',
    textGradient: 'from-yellow-200 via-amber-200 to-yellow-400',
    glowColor: 'rgba(251, 191, 36, 0.8)',
    aura: 'divine_gold',
    buffs: {
      atkPercent: 30,
      critRatePercent: 15,
      critDmgPercent: 20,
      speedBonus: 20
    }
  },
  title_thien_kieu_van_dinh: {
    id: 'title_thien_kieu_van_dinh',
    name: 'Thiên Kiêu Vấn Đỉnh',
    icon: '👑',
    rarity: 'than',
    description: 'Top 2–3 Thiên Kiêu Bảng, đứng trên đỉnh cao vạn người ngưỡng vọng, vấn đỉnh chí tôn tam giới.',
    badgeClass: 'border-purple-400 bg-gradient-to-r from-purple-950 via-violet-950 to-indigo-950 text-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.7)] animate-pulse ring-2 ring-purple-400/50',
    textGradient: 'from-purple-200 via-violet-300 to-indigo-200',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    aura: 'celestial_purple',
    buffs: {
      atkPercent: 20,
      defPercent: 20,
      speedBonus: 15,
      critRatePercent: 10,
      critDmgPercent: 15
    }
  },
  title_thap_dai_thien_kieu: {
    id: 'title_thap_dai_thien_kieu',
    name: 'Thập Đại Thiên Kiêu',
    icon: '🔥',
    rarity: 'thien',
    description: 'Một trong mười vị thiên kiêu cái thế đứng đầu vạn giới (Top 4–10), danh chấn bát hoang chư thiên.',
    badgeClass: 'border-rose-500 bg-gradient-to-r from-rose-950 via-red-950 to-amber-950 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.6)] ring-1 ring-rose-500/50',
    textGradient: 'from-rose-200 via-red-300 to-amber-200',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    aura: 'crimson_flame',
    buffs: {
      atkPercent: 15,
      defPercent: 15,
      dmgReduction: 10,
      speedBonus: 10
    }
  },
  title_bach_cuong_thien_kieu: {
    id: 'title_bach_cuong_thien_kieu',
    name: 'Bách Cường Thiên Kiêu',
    icon: '🌟',
    rarity: 'thien',
    description: 'Ghi tên vào Thiên Kiêu Bảng Bách Cường (Top 11–100), danh môn đệ tử muôn người nể sợ.',
    badgeClass: 'border-amber-500/70 bg-gradient-to-r from-amber-950/70 to-zinc-900/80 text-amber-200 shadow-sm',
    textGradient: 'from-amber-200 to-yellow-300',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    buffs: {
      atkPercent: 8,
      defPercent: 8,
      speedBonus: 5
    }
  },

  // -------------------------------------------------------------
  // DANH HIỆU THIÊN CỔ & ENDGAME MỚI
  // -------------------------------------------------------------
  title_tu_dia_chi_chu: {
    id: 'title_tu_dia_chi_chu',
    name: 'Tử Địa Chi Chủ',
    icon: '💀',
    rarity: 'thien',
    description: 'Sống sót nơi sâu thẳm Cấm Địa Thái Cổ, ngưng tụ Tử Khí Hóa Sinh, sinh tử luân chuyển bất diệt.',
    badgeClass: 'border-red-600/80 bg-gradient-to-r from-stone-950 via-red-950 to-neutral-900 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.35)]',
    textGradient: 'from-red-300 via-rose-300 to-amber-200',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    buffs: {
      hpPercent: 18,
      defPercent: 15,
      dmgReduction: 12
    }
  },
  title_van_vat_hoa_than: {
    id: 'title_van_vat_hoa_than',
    name: 'Vạn Vật Hóa Thần',
    icon: '⚒️',
    rarity: 'thien',
    description: 'Bách nghệ thông thần, lò rèn tôi luyện vạn vật quy nguyên, thấu triệt linh tính thiên địa.',
    badgeClass: 'border-amber-500/80 bg-gradient-to-r from-amber-950/80 via-orange-950/70 to-zinc-900 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    textGradient: 'from-amber-200 via-orange-300 to-yellow-200',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    buffs: {
      atkPercent: 12,
      defPercent: 12,
      critRatePercent: 8
    }
  },
  title_than_thuc_nhiep_the: {
    id: 'title_than_thuc_nhiep_the',
    name: 'Thần Thức Nhiếp Thế',
    icon: '👁️',
    rarity: 'thien',
    description: 'Thần thức như biển rộng mênh mông, một ánh nhìn chấn nhiếp quần hùng tại Vạn Bảo Đấu Giá Hội.',
    badgeClass: 'border-indigo-500/80 bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-cyan-950/70 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.35)]',
    textGradient: 'from-indigo-200 via-purple-300 to-cyan-200',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    buffs: {
      atkPercent: 15,
      critDmgPercent: 20,
      speedBonus: 10
    }
  },
  title_tam_kiep_tien_ton: {
    id: 'title_tam_kiep_tien_ton',
    name: 'Tam Kiếp Tiên Tôn',
    icon: '🌀',
    rarity: 'than',
    description: 'Trải ba đời luân hồi tôi luyện đạo tâm, ký ức tiền kiếp thức tỉnh, đạo vận bao phủ ba ngàn đại đạo.',
    badgeClass: 'border-purple-400/90 bg-gradient-to-r from-purple-950 via-indigo-950 to-rose-950 text-purple-100 shadow-[0_0_22px_rgba(168,85,247,0.55)] animate-pulse',
    textGradient: 'from-purple-200 via-rose-300 to-amber-200',
    glowColor: 'rgba(168, 85, 247, 0.55)',
    buffs: {
      atkPercent: 22,
      defPercent: 20,
      hpPercent: 20,
      cultivateSpeedBonusPercent: 20
    }
  },
  title_tinh_khong_linh_chu: {
    id: 'title_tinh_khong_linh_chu',
    name: 'Tinh Không Lĩnh Chủ',
    icon: '🌌',
    rarity: 'than',
    description: 'Chiếm cứ chư thiên tinh mạch, thống soái tinh hạm viễn chinh, danh xưng Vực Ngoại Chúa Tể!',
    badgeClass: 'border-blue-400/90 bg-gradient-to-r from-blue-950 via-cyan-950 to-indigo-950 text-cyan-100 shadow-[0_0_25px_rgba(59,130,246,0.6)] animate-pulse',
    textGradient: 'from-cyan-100 via-blue-200 to-purple-300',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    buffs: {
      atkPercent: 25,
      defPercent: 25,
      speedBonus: 20,
      critRatePercent: 10
    }
  }
};

export const ACHIEVEMENTS_CONFIG: AchievementDefinition[] = [
  // 1. TU VI CẢNH GIỚI (Cultivation)
  {
    id: 'ach_realm_luyenkhi',
    name: 'Đạp Nhập Tiên Lộ',
    category: 'cultivation',
    description: 'Đột phá gông cùm phàm trần, chính thức bước vào Luyện Khí Kỳ.',
    target: 1,
    rewardTuVi: 200,
    rewardLinhThach: 100,
    rewardKhiVan: 1,
    unlockedTitleId: 'title_pham_nhan',
    icon: '🌱'
  },
  {
    id: 'ach_realm_luyenkhi_max',
    name: 'Luyện Khí Viên Mãn',
    category: 'cultivation',
    description: 'Thấu triệt thập tầng Luyện Khí, linh khí sung mãn chạm đến bình chướng Trúc Cơ.',
    target: 10,
    rewardTuVi: 600,
    rewardLinhThach: 250,
    rewardKhiVan: 1,
    icon: '✨'
  },
  {
    id: 'ach_realm_trucco',
    name: 'Trúc Cơ Thành Tựu',
    category: 'cultivation',
    description: 'Tẩy tủy phạt mao, đúc thành tiên cơ, thăng cấp Trúc Cơ Kỳ.',
    target: 11,
    rewardTuVi: 1500,
    rewardLinhThach: 500,
    rewardKhiVan: 2,
    icon: '🏯'
  },
  {
    id: 'ach_realm_kimdan',
    name: 'Kim Đan Đại Đạo',
    category: 'cultivation',
    description: 'Nhất lạp kim đan thôn nhập phúc, thủy tri ngã mệnh do ngã bất do thiên!',
    target: 16,
    rewardTuVi: 8000,
    rewardLinhThach: 2000,
    rewardKhiVan: 3,
    unlockedTitleId: 'title_kiem_tien',
    icon: '✨'
  },
  {
    id: 'ach_realm_nguyenanh',
    name: 'Nguyên Anh Phá Giới',
    category: 'cultivation',
    description: 'Nguyên thần ngưng tụ thành hình, xuất khiếu du ngoạn cửu tiêu.',
    target: 21,
    rewardTuVi: 25000,
    rewardLinhThach: 6000,
    rewardKhiVan: 4,
    icon: '🧘'
  },
  {
    id: 'ach_realm_hoathan',
    name: 'Hóa Thần Quy Nhất',
    category: 'cultivation',
    description: 'Lĩnh ngộ thiên đạo pháp tắc, thần thông quảng đại bước vào Hóa Thần.',
    target: 26,
    rewardTuVi: 80000,
    rewardLinhThach: 20000,
    rewardKhiVan: 5,
    icon: '🌌'
  },
  {
    id: 'ach_realm_tiende',
    name: 'Tiên Đế Vấn Đỉnh',
    category: 'cultivation',
    description: 'Thống ngự chư thiên vạn giới, uy chấn bát hoang, trở thành Tiên Đế vô thượng!',
    target: 96,
    rewardTuVi: 300000,
    rewardLinhThach: 60000,
    rewardKhiVan: 8,
    icon: '👑'
  },
  {
    id: 'ach_realm_deto',
    name: 'Đế Tổ Quy Vị',
    category: 'cultivation',
    description: 'Vấn đỉnh đỉnh cao tam giới, bước lên ngai vàng Đế Tổ chí tôn!',
    target: 101,
    rewardTuVi: 500000,
    rewardLinhThach: 100000,
    rewardKhiVan: 10,
    unlockedTitleId: 'title_truong_sinh',
    icon: '🔱'
  },

  // 2. TRẢM YÊU TRỪ MA (Battle)
  {
    id: 'ach_boss_10',
    name: 'Trảm Yêu Sơ Thí',
    category: 'battle',
    description: 'Trảm sát tích lũy 10 yêu ma hung thú tại Thí Luyện.',
    target: 10,
    rewardTuVi: 1000,
    rewardLinhThach: 300,
    icon: '⚔️'
  },
  {
    id: 'ach_boss_50',
    name: 'Trảm Yêu Đại Năng',
    category: 'battle',
    description: 'Trảm sát tích lũy 50 yêu thú hung bạo.',
    target: 50,
    rewardTuVi: 6000,
    rewardLinhThach: 1500,
    rewardKhiVan: 2,
    icon: '🗡️'
  },
  {
    id: 'ach_boss_100',
    name: 'Vạn Yêu Tru Diệt',
    category: 'battle',
    description: 'Trảm sát 100 Boss yêu ma, danh chấn bát hoang!',
    target: 100,
    rewardTuVi: 20000,
    rewardLinhThach: 5000,
    rewardKhiVan: 5,
    unlockedTitleId: 'title_sat_than',
    icon: '🩸'
  },
  {
    id: 'ach_tower_20',
    name: 'Trấn Ma Tháp Tầng 20',
    category: 'battle',
    description: 'Vượt qua Tầng 20 Trấn Ma Tháp thanh trừng ma khí.',
    target: 20,
    rewardTuVi: 5000,
    rewardLinhThach: 1200,
    icon: '🗼'
  },
  {
    id: 'ach_tower_50',
    name: 'Trấn Ma Thần Quân',
    category: 'battle',
    description: 'Vượt qua Tầng 50 Trấn Ma Tháp phong ấn đại ma đầu.',
    target: 50,
    rewardTuVi: 35000,
    rewardLinhThach: 8000,
    rewardKhiVan: 3,
    unlockedTitleId: 'title_tran_ma',
    icon: '⚡'
  },
  {
    id: 'ach_world_boss_dmg',
    name: 'Chấn Nhiếp Thần Thú',
    category: 'battle',
    description: 'Tích lũy 100,000 sát thương lên Boss Thế Giới.',
    target: 100000,
    rewardTuVi: 15000,
    rewardLinhThach: 4000,
    icon: '🐲'
  },

  // 3. ĐỘNG PHỦ LINH NÔNG (Garden)
  {
    id: 'ach_harvest_20',
    name: 'Khai Hoang Lập Điền',
    category: 'garden',
    description: 'Thu hoạch 20 gốc linh thảo tại Linh Điền động phủ.',
    target: 20,
    rewardTuVi: 800,
    rewardLinhThach: 250,
    icon: '🌿'
  },
  {
    id: 'ach_harvest_100',
    name: 'Bách Thảo Vườn Đan',
    category: 'garden',
    description: 'Thu hoạch 100 gốc linh thảo các loại.',
    target: 100,
    rewardTuVi: 5000,
    rewardLinhThach: 1200,
    icon: '🌾'
  },
  {
    id: 'ach_harvest_500',
    name: 'Linh Nông Chân Nhân',
    category: 'garden',
    description: 'Thu hoạch 500 gốc dược liệu, dược hương ngào ngạt khắp động phủ.',
    target: 500,
    rewardTuVi: 25000,
    rewardLinhThach: 6000,
    rewardKhiVan: 3,
    unlockedTitleId: 'title_linh_nong',
    icon: '🍃'
  },
  {
    id: 'ach_garden_max',
    name: 'Thần Điền Huyền Hoàng',
    category: 'garden',
    description: 'Nâng cấp Linh Điền Động Phủ lên Cực Phẩm hoặc Huyền Hoàng (Cấp 5+).',
    target: 5,
    rewardTuVi: 18000,
    rewardLinhThach: 5000,
    icon: '🏡'
  },

  // 4. TIÊN DUYÊN ĐẠO LỮ (Companion)
  {
    id: 'ach_bonded_1',
    name: 'Hồng Nhan Tri Kỷ',
    category: 'companion',
    description: 'Kết duyên Đạo Lữ với 1 vị tiên tử.',
    target: 1,
    rewardTuVi: 3000,
    rewardLinhThach: 800,
    rewardKhiVan: 2,
    icon: '❤️'
  },
  {
    id: 'ach_bonded_3',
    name: 'Bách Hoa Tề Phóng',
    category: 'companion',
    description: 'Kết duyên Đạo Lữ với 3 vị tiên tử xinh đẹp.',
    target: 3,
    rewardTuVi: 20000,
    rewardLinhThach: 5000,
    rewardKhiVan: 5,
    unlockedTitleId: 'title_da_tinh',
    icon: '🌸'
  },
  {
    id: 'ach_dual_cultivate_30',
    name: 'Tâm Thần Hợp Nhất',
    category: 'companion',
    description: 'Thực hiện Song Tu Thổ Nạp 30 lần cùng Đạo Lữ.',
    target: 30,
    rewardTuVi: 10000,
    rewardLinhThach: 2500,
    icon: '☯️'
  },

  // 5. BÁCH NGHỆ LUYỆN ĐAN & LUYỆN KHÍ (Crafting)
  {
    id: 'ach_alchemy_20',
    name: 'Sơ Nhập Đan Đạo',
    category: 'crafting',
    description: 'Luyện chế thành công 20 viên đan dược các loại.',
    target: 20,
    rewardTuVi: 2000,
    rewardLinhThach: 600,
    icon: '🔮'
  },
  {
    id: 'ach_alchemy_100',
    name: 'Đan Đạo Tông Sư',
    category: 'crafting',
    description: 'Luyện chế thành công 100 viên đan dược thần diệu.',
    target: 100,
    rewardTuVi: 25000,
    rewardLinhThach: 6000,
    rewardKhiVan: 3,
    unlockedTitleId: 'title_dan_dao',
    icon: '🔥'
  },
  {
    id: 'ach_forge_20',
    name: 'Thần Binh Tông Sư',
    category: 'crafting',
    description: 'Rèn đúc thành công 20 món thần binh bảo giáp.',
    target: 20,
    rewardTuVi: 10000,
    rewardLinhThach: 3000,
    unlockedTitleId: 'title_luyen_khi',
    icon: '🔨'
  },

  // 6. TÍCH LŨY LINH THẠCH & THƯƠNG HỘI (Wealth)
  {
    id: 'ach_wealth_10k',
    name: 'Tiểu Hữu Gia Tư',
    category: 'wealth',
    description: 'Sở hữu 10,000 Hạ Phẩm Linh Thạch.',
    target: 10000,
    rewardTuVi: 1000,
    rewardKhiVan: 1,
    icon: '💰'
  },
  {
    id: 'ach_wealth_500k',
    name: 'Vạn Bảo Cự Phú',
    category: 'wealth',
    description: 'Sở hữu 500,000 Hạ Phẩm Linh Thạch, tài phú ngút trời.',
    target: 500000,
    rewardTuVi: 30000,
    rewardKhiVan: 4,
    unlockedTitleId: 'title_phu_ho',
    icon: '💎'
  },

  // 7. CỐT TRUYỆN ĐẠI CHƯƠNG (Storyline Chapters)
  {
    id: 'ach_story_chap_8',
    name: 'Tinh Không Vấn Đạo',
    category: 'special',
    description: 'Phá toái hư không, tiến vào Vực Ngoại Tinh Không và hoàn thành toàn bộ Chương VIII.',
    target: 1,
    rewardTuVi: 200000,
    rewardLinhThach: 100000,
    rewardKhiVan: 5,
    icon: '🪐'
  },
  {
    id: 'ach_story_chap_9',
    name: 'Vũ Hóa Phi Thăng',
    category: 'special',
    description: 'Vượt qua Cửu Cửu Thiên Kiếp, đối đáp Thiên Đạo và hoàn thành toàn bộ Chương IX.',
    target: 1,
    rewardTuVi: 500000,
    rewardLinhThach: 250000,
    rewardKhiVan: 10,
    icon: '⛩️'
  },

  // 8. THIÊN KIÊU BẢNG (PvP Ladder)
  {
    id: 'ach_pvp_top100',
    name: 'Ghi Danh Thiên Kiêu',
    category: 'battle',
    description: 'Đánh bại đối thủ, chính thức ghi tên vào Bách Cường Thiên Kiêu Bảng (Top 100).',
    target: 1,
    rewardTuVi: 100000,
    rewardLinhThach: 50000,
    rewardKhiVan: 3,
    icon: '🏆'
  },
  {
    id: 'ach_pvp_top1',
    name: 'Vạn Giới Đệ Nhất',
    category: 'battle',
    description: 'Đánh bại Quán Quân, đoạt lấy vị trí Hạng 1 Đương Thế Vô Địch của Thiên Kiêu Bảng!',
    target: 1,
    rewardTuVi: 1000000,
    rewardLinhThach: 500000,
    rewardKhiVan: 10,
    icon: '🗡️'
  },

  // 9. CẤM ĐỊA THÁI CỔ (Forbidden Zone)
  {
    id: 'ach_fz_survive_zero',
    name: 'Tử Địa Hậu Sinh',
    category: 'forbidden_zone',
    description: 'Di chuyển và sống sót qua 5 bước khi Hộ Thân Linh Quang chạm đáy 0.',
    target: 5,
    rewardTuVi: 35000,
    rewardLinhThach: 12000,
    rewardKhiVan: 3,
    icon: '💀'
  },
  {
    id: 'ach_fz_clear_fog',
    name: 'Thấu Triệt Hư Không',
    category: 'forbidden_zone',
    description: 'Khai mở trọn vẹn 100% sương mù hư không trên sa bàn Cấm Địa 7x7 (49 ô).',
    target: 49,
    rewardTuVi: 60000,
    rewardLinhThach: 25000,
    rewardKhiVan: 4,
    icon: '🌫️'
  },
  {
    id: 'ach_fz_kill_beast',
    name: 'Trảm Thần Diệt Ma',
    category: 'forbidden_zone',
    description: 'Trảm sát Hung Thú Trấn Cấm Khu nơi tận cùng Thái Cổ Cấm Địa.',
    target: 1,
    rewardTuVi: 120000,
    rewardLinhThach: 40000,
    rewardKhiVan: 5,
    unlockedTitleId: 'title_tu_dia_chi_chu',
    icon: '👹'
  },
  {
    id: 'ach_fz_escape_safe',
    name: 'Tuyệt Địa Đào Sinh',
    category: 'forbidden_zone',
    description: 'Rút lui an toàn khỏi Cấm Địa khi mang theo trên 5 Dị Bảo Thái Cổ.',
    target: 5,
    rewardTuVi: 45000,
    rewardLinhThach: 16000,
    rewardKhiVan: 3,
    icon: '🏃'
  },

  // 10. TỨ ĐẠI BÁCH NGHỆ MỞ RỘNG (Crafting Extended)
  {
    id: 'ach_craft_cuc_pham',
    name: 'Đan Thánh Xuất Thế',
    category: 'crafting',
    description: 'Luyện chế thành công 10 viên đan dược phẩm chất Cực Phẩm hoặc Thần Phẩm.',
    target: 10,
    rewardTuVi: 70000,
    rewardLinhThach: 28000,
    rewardKhiVan: 4,
    unlockedTitleId: 'title_cuu_chuyen_dan_ton',
    icon: '✨'
  },
  {
    id: 'ach_forge_4_sockets',
    name: 'Thiên Công Khai Vật',
    category: 'crafting',
    description: 'Rèn hoặc đục mở đủ 4 lỗ khảm bảo ngọc trên một trang bị.',
    target: 4,
    rewardTuVi: 80000,
    rewardLinhThach: 30000,
    rewardKhiVan: 4,
    icon: '💎'
  },
  {
    id: 'ach_artisan_tier9',
    name: 'Cửu Giai Thái Đẩu',
    category: 'crafting',
    description: 'Đạt cấp bậc Cửu Giai Đại Tông Sư trong một nghề Bách Nghệ.',
    target: 9,
    rewardTuVi: 160000,
    rewardLinhThach: 65000,
    rewardKhiVan: 6,
    icon: '📜'
  },
  {
    id: 'ach_dismantle_master',
    name: 'Vạn Vật Quy Nguyên',
    category: 'crafting',
    description: 'Phân giải tích lũy 50 món trang bị trong Lò Dung Luyện.',
    target: 50,
    rewardTuVi: 55000,
    rewardLinhThach: 22000,
    rewardKhiVan: 3,
    unlockedTitleId: 'title_van_vat_hoa_than',
    icon: '♻️'
  },
  {
    id: 'ach_talisman_master',
    name: 'Phù Đạo Chân Nhân',
    category: 'crafting',
    description: 'Vẽ thành công 20 lá bùa Thái Thượng Phù Lục.',
    target: 20,
    rewardTuVi: 45000,
    rewardLinhThach: 18000,
    rewardKhiVan: 3,
    icon: '📜'
  },
  {
    id: 'ach_formation_master',
    name: 'Trận Pháp Vô Song',
    category: 'crafting',
    description: 'Bố trí hoặc nâng cấp 5 Đại Trận Hộ Động Phủ & Tông Môn.',
    target: 5,
    rewardTuVi: 50000,
    rewardLinhThach: 20000,
    rewardKhiVan: 3,
    icon: '☸️'
  },

  // 11. VẠN BẢO ĐẤU GIÁ HỘI (Auction)
  {
    id: 'ach_auction_intimidate_10',
    name: 'Thần Thức Nhiếp Hồn',
    category: 'auction',
    description: 'Thi triển Thần Thức Dằn Mặt áp chế tu sĩ đối thủ thành công 10 lần.',
    target: 10,
    rewardTuVi: 80000,
    rewardLinhThach: 35000,
    rewardKhiVan: 4,
    unlockedTitleId: 'title_than_thuc_nhiep_the',
    icon: '👁️'
  },
  {
    id: 'ach_auction_win_tier5',
    name: 'Cự Phú Tiên Giới',
    category: 'auction',
    description: 'Đấu giá thắng một lô kỳ bảo có mức giá trên 200,000 Linh Thạch.',
    target: 200000,
    rewardTuVi: 100000,
    rewardLinhThach: 50000,
    rewardKhiVan: 5,
    icon: '🏛️'
  },
  {
    id: 'ach_auction_bankrupt_foe',
    name: 'Áp Đảo Quần Hùng',
    category: 'auction',
    description: 'Ép đối thủ máy cạn kiệt tài lực phải tuyên bố bỏ cuộc 5 lần.',
    target: 5,
    rewardTuVi: 55000,
    rewardLinhThach: 25000,
    rewardKhiVan: 3,
    icon: '💸'
  },

  // 12. TÔNG MÔN & CỨ ĐIỂM (Sect)
  {
    id: 'ach_sect_tier5_join',
    name: 'Bái Nhập Thánh Địa',
    category: 'sect',
    description: 'Bái nhập một trong 4 Vạn Cổ Thánh Địa Tiên Giới Tier 5.',
    target: 1,
    rewardTuVi: 130000,
    rewardLinhThach: 55000,
    rewardKhiVan: 6,
    icon: '🏯'
  },
  {
    id: 'ach_sect_hold_all_veins',
    name: 'Độc Chiếm Tinh Hoa',
    category: 'sect',
    description: 'Cùng Tông Môn chiếm giữ trọn vẹn 3/3 Linh Mạch Thái Cổ.',
    target: 3,
    rewardTuVi: 110000,
    rewardLinhThach: 45000,
    rewardKhiVan: 5,
    icon: '🏔️'
  },
  {
    id: 'ach_sect_array_max',
    name: 'Kim Cang Bất Hoại Trận',
    category: 'sect',
    description: 'Nâng cấp Hộ Sơn Đại Trận môn phái đạt Cấp 10.',
    target: 10,
    rewardTuVi: 90000,
    rewardLinhThach: 40000,
    rewardKhiVan: 4,
    icon: '🛡️'
  },
  {
    id: 'ach_sect_chancellor',
    name: 'Chưởng Giáo Chí Tôn',
    category: 'sect',
    description: 'Thăng tiến lên vị thế Chưởng Môn hoặc Trưởng Lão Tối Cao của Tông Môn.',
    target: 1,
    rewardTuVi: 220000,
    rewardLinhThach: 90000,
    rewardKhiVan: 7,
    icon: '👑'
  },

  // 13. LỤC ĐẠO LUÂN HỒI & META-PROGRESSION (Reincarnation)
  {
    id: 'ach_reborn_1',
    name: 'Binh Giải Chuyển Sinh',
    category: 'reincarnation',
    description: 'Trải qua lần Luân Hồi Chuyển Kiếp đầu tiên, đúc lại tiên duyên.',
    target: 1,
    rewardTuVi: 60000,
    rewardLinhThach: 25000,
    rewardKhiVan: 3,
    icon: '🌀'
  },
  {
    id: 'ach_reborn_3',
    name: 'Tam Thế Luân Hồi',
    category: 'reincarnation',
    description: 'Trải qua 3 kiếp luân hồi chuyển sinh, thức tỉnh túc mệnh tiền kiếp (+50 Thọ Nguyên).',
    target: 3,
    rewardTuVi: 220000,
    rewardLinhThach: 90000,
    rewardKhiVan: 8,
    unlockedTitleId: 'title_tam_kiep_tien_ton',
    icon: '☯️'
  },
  {
    id: 'ach_reborn_unseal',
    name: 'Thức Tỉnh Tiền Kiếp',
    category: 'reincarnation',
    description: 'Giải phong thành công Bản Mệnh Pháp Bảo kế thừa khi chạm mốc Trúc Cơ.',
    target: 1,
    rewardTuVi: 70000,
    rewardLinhThach: 30000,
    rewardKhiVan: 4,
    icon: '🗡️'
  },
  {
    id: 'ach_reborn_slot6',
    name: 'Lục Đạo Quy Vị',
    category: 'reincarnation',
    description: 'Khai mở và khảm nạp trọn vẹn ô Mệnh Cách thứ 6 trên Bàn Mệnh.',
    target: 6,
    rewardTuVi: 160000,
    rewardLinhThach: 65000,
    rewardKhiVan: 6,
    icon: '🔯'
  },
  {
    id: 'ach_reborn_karma_1000',
    name: 'Đạo Vận Hằng Hà',
    category: 'reincarnation',
    description: 'Tích lũy đạt 1,000 Điểm Đạo Vận Luân Hồi.',
    target: 1000,
    rewardTuVi: 200000,
    rewardLinhThach: 80000,
    rewardKhiVan: 7,
    icon: '📿'
  },

  // 14. TAM VỊ HỢP KÍCH (Combat Synergy)
  {
    id: 'ach_synergy_20',
    name: 'Tam Vị Đồng Tâm',
    category: 'combat',
    description: 'Thi triển Tuyệt Kỹ Hợp Kích 20 lần trong các trận kịch chiến.',
    target: 20,
    rewardTuVi: 65000,
    rewardLinhThach: 26000,
    rewardKhiVan: 3,
    icon: '⚡'
  },
  {
    id: 'ach_synergy_mega_dmg',
    name: 'Thiên Hủy Địa Diệt',
    category: 'combat',
    description: 'Gây ra một đòn Hợp Kích đạt trên 500,000 sát thương.',
    target: 500000,
    rewardTuVi: 120000,
    rewardLinhThach: 45000,
    rewardKhiVan: 5,
    icon: '💥'
  },
  {
    id: 'ach_synergy_million_dmg',
    name: 'Vạn Kiếp Tru Diệt',
    category: 'combat',
    description: 'Gây ra đòn Hợp Kích vượt mốc 1,000,000 sát thương trong 1 chiêu thức!',
    target: 1000000,
    rewardTuVi: 280000,
    rewardLinhThach: 110000,
    rewardKhiVan: 8,
    icon: '☄️'
  },

  // 15. THIÊN KIÊU BẢNG BỔ SUNG (PvP Ladder Extended)
  {
    id: 'ach_pvp_win_streak_10',
    name: 'Bất Bại Thần Thoại',
    category: 'combat',
    description: 'Đạt chuỗi 10 trận toàn thắng liên tiếp trên Thiên Kiêu Bảng.',
    target: 10,
    rewardTuVi: 130000,
    rewardLinhThach: 55000,
    rewardKhiVan: 5,
    icon: '🔥'
  },
  {
    id: 'ach_pvp_top10',
    name: 'Thập Đại Chí Tôn',
    category: 'combat',
    description: 'Bước vào hàng ngũ Thập Đại Thiên Kiêu (Top 10) đứng đầu vạn giới.',
    target: 1,
    rewardTuVi: 320000,
    rewardLinhThach: 130000,
    rewardKhiVan: 8,
    unlockedTitleId: 'title_thap_dai_thien_kieu',
    icon: '🏆'
  },

  // 16. CHƯ THIÊN TINH ĐỒ (Cosmic Map)
  {
    id: 'ach_cosmic_unlock',
    name: 'Vực Ngoại Tinh Đồ',
    category: 'cosmic',
    description: 'Phi thăng thượng giới, ngự Tinh Chu tiến vào Chư Thiên Tinh Đồ.',
    target: 1,
    rewardTuVi: 200000,
    rewardLinhThach: 80000,
    rewardKhiVan: 5,
    icon: '🌌'
  },
  {
    id: 'ach_cosmic_occupy_5',
    name: 'Tinh Không Lĩnh Chủ',
    category: 'cosmic',
    description: 'Chiếm đóng 5 Tinh Cầu tài nguyên trong Chư Thiên Tinh Đồ.',
    target: 5,
    rewardTuVi: 380000,
    rewardLinhThach: 160000,
    rewardKhiVan: 8,
    unlockedTitleId: 'title_tinh_khong_linh_chu',
    icon: '🪐'
  },
  {
    id: 'ach_cosmic_craft_tier9',
    name: 'Đế Binh Xuất Thế',
    category: 'cosmic',
    description: 'Đúc thành công món trang bị Tier 9 Thần Phẩm đầu tiên.',
    target: 1,
    rewardTuVi: 550000,
    rewardLinhThach: 220000,
    rewardKhiVan: 10,
    icon: '⚔️'
  },
  {
    id: 'ach_cosmic_travel_100ly',
    name: 'Vạn Lý Tinh Hà',
    category: 'cosmic',
    description: 'Tích lũy du hành 100 năm ánh sáng giữa các Tinh Cầu.',
    target: 100,
    rewardTuVi: 160000,
    rewardLinhThach: 65000,
    rewardKhiVan: 4,
    icon: '🚀'
  },
  {
    id: 'ach_cosmic_upgrade_vessel_3',
    name: 'Chiến Hạm Cực Phẩm',
    category: 'cosmic',
    description: 'Nâng cấp Tinh Chu đạt cấp bậc Cấp 3 trở lên.',
    target: 3,
    rewardTuVi: 260000,
    rewardLinhThach: 105000,
    rewardKhiVan: 6,
    icon: '🛸'
  },

  // 17. THỂ TU & HỒN TU & LÔI KIẾP (Physique, Soul & Tribulation)
  {
    id: 'ach_physique_breakthrough',
    name: 'Nhục Thân Thành Thánh',
    category: 'cultivation',
    description: 'Đột phá Huyền Công Luyện Thể đạt Tầng 3 (Kim Cương Bất Hoại).',
    target: 3,
    rewardTuVi: 85000,
    rewardLinhThach: 32000,
    rewardKhiVan: 4,
    icon: '💪'
  },
  {
    id: 'ach_soul_exorcise_demon',
    name: 'Trấn Nhiếp Tâm Ma',
    category: 'cultivation',
    description: 'Trừ diệt 10 lần Tâm Ma tàn niệm trong Thức Hải Thần Hồn.',
    target: 10,
    rewardTuVi: 75000,
    rewardLinhThach: 30000,
    rewardKhiVan: 4,
    icon: '🔮'
  },
  {
    id: 'ach_tribulation_survive_9',
    name: 'Cửu Kiếp Bất Diệt',
    category: 'cultivation',
    description: 'Vượt qua 9 đợt Lôi Kiếp cuồng bạo trong Cửu Trọng Thiên Kiếp.',
    target: 9,
    rewardTuVi: 190000,
    rewardLinhThach: 75000,
    rewardKhiVan: 7,
    icon: '⚡'
  }
];

/**
 * Khởi tạo AchievementsState mặc định
 */
export function createDefaultAchievementsState(): AchievementsState {
  return {
    claimedAchievementIds: [],
    equippedTitleId: null,
    unlockedTitleIds: [],
    stats: {
      bossKills: 0,
      herbsHarvested: 0,
      pillsCrafted: 0,
      equipmentsForged: 0,
      dualCultivations: 0,
      breakthroughsSuccess: 0,
      towerFloorsCleared: 0,
      secretRealmsExplored: 0,
      totalLinhThachEarned: 0,
      rebornCount: 0
    }
  };
}

/**
 * Tính toán tiến độ hiện tại của một thành tựu dựa trên dữ liệu người chơi
 */
export function getAchievementCurrentProgress(
  ach: AchievementDefinition,
  player: PlayerStats
): number {
  const stats = player.achievementsState?.stats || {};

  switch (ach.id) {
    // 1. Cảnh giới
    case 'ach_realm_luyenkhi':
    case 'ach_realm_luyenkhi_max':
    case 'ach_realm_trucco':
    case 'ach_realm_kimdan':
    case 'ach_realm_nguyenanh':
    case 'ach_realm_hoathan':
    case 'ach_realm_tiende':
    case 'ach_realm_deto':
      return player.currentRealm || 0;

    // 2. Trảm boss
    case 'ach_boss_10':
    case 'ach_boss_50':
    case 'ach_boss_100':
      return stats.bossKills || 0;

    // 3. Trấn Ma Tháp
    case 'ach_tower_20':
    case 'ach_tower_50':
      return player.towerFloor || 1;

    // 4. Boss Thế Giới
    case 'ach_world_boss_dmg':
      return player.worldBossDamage || 0;

    // 5. Thu hoạch thảo dược
    case 'ach_harvest_20':
    case 'ach_harvest_100':
    case 'ach_harvest_500':
      return stats.herbsHarvested || 0;

    // 6. Cấp Linh Điền
    case 'ach_garden_max':
      return player.linhDien?.level || 1;

    // 7. Đạo lữ kết duyên
    case 'ach_bonded_1':
    case 'ach_bonded_3':
      return Object.values(player.companionsState?.companions || {}).filter(c => c.isBonded).length;

    // 8. Song Tu
    case 'ach_dual_cultivate_30':
      return stats.dualCultivations || 0;

    // 9. Luyện đan
    case 'ach_alchemy_20':
    case 'ach_alchemy_100':
      return stats.pillsCrafted || 0;

    // 10. Luyện khí
    case 'ach_forge_20':
      return stats.equipmentsForged || 0;

    // 11. Linh thạch
    case 'ach_wealth_10k':
    case 'ach_wealth_500k':
      return player.linhThach || 0;

    // 12. Cốt truyện đại chương
    case 'ach_story_chap_8':
      return player.storylineState?.completedQuestIds?.includes('quest_8_3') ? 1 : 0;
    case 'ach_story_chap_9':
      return player.storylineState?.completedQuestIds?.includes('quest_9_3') ? 1 : 0;

    // 13. Thiên Kiêu Bảng
    case 'ach_pvp_top100':
      return (player.pvpLadderState?.currentRank && player.pvpLadderState.currentRank <= 100) ? 1 : 0;
    case 'ach_pvp_top10':
      return (player.pvpLadderState?.currentRank && player.pvpLadderState.currentRank <= 10) || (player.pvpLadderState?.bestRank && player.pvpLadderState.bestRank <= 10) ? 1 : 0;
    case 'ach_pvp_top1':
      return (player.pvpLadderState?.currentRank === 1 || player.pvpLadderState?.bestRank === 1) ? 1 : 0;
    case 'ach_pvp_win_streak_10':
      return stats.pvpWinStreak || (player.pvpLadderState as any)?.winStreak || (player.pvpLadderState as any)?.highestStreak || 0;

    // 14. Cấm Địa Thái Cổ
    case 'ach_fz_survive_zero':
      return (player.forbiddenZoneState as any)?.zeroLightStepsTaken || (player.forbiddenZoneState as any)?.consecutiveZeroLightSteps || stats.fzZeroLightSteps || (player.forbiddenZoneState?.auraLight === 0 ? 5 : 0);
    case 'ach_fz_clear_fog':
      return player.forbiddenZoneState?.grid
        ? Object.values(player.forbiddenZoneState.grid).filter((t: any) => t.isRevealed).length
        : ((player.forbiddenZoneState as any)?.revealedTilesCount || 0);
    case 'ach_fz_kill_beast':
      return (player.forbiddenZoneState as any)?.bossDefeated ? 1 : (stats.fzBossKills || 0);
    case 'ach_fz_escape_safe':
      return (player.forbiddenZoneState as any)?.relicsCollected || stats.fzEscapesWithRelics || 0;

    // 15. Bách Nghệ mở rộng
    case 'ach_craft_cuc_pham':
      return stats.cucPhamPillsCrafted || (stats.pillsCrafted >= 10 ? 10 : stats.pillsCrafted) || 0;
    case 'ach_forge_4_sockets':
      return Math.max(0, ...Object.values(player.equipment || {}).map((eq: any) => eq?.gemSockets?.length || eq?.sockets || 0));
    case 'ach_artisan_tier9':
      return Math.max(player.artisan?.alchemyLevel || 1, player.artisan?.forgingLevel || 1, player.artisan?.formationLevel || 1, player.artisan?.talismanLevel || 1);
    case 'ach_dismantle_master':
      return stats.equipmentsDismantled || Math.floor((player.inventory?.forgingEssence || 0) / 10) || 0;
    case 'ach_talisman_master':
      return stats.talismansCrafted || (player.talismanState?.craftedCount || 0);
    case 'ach_formation_master':
      return stats.formationsDeployed || (player.formationState?.activeFormations?.length || 0) || (player.abodeState?.spiritArray?.level || 0);

    // 16. Đấu Giá Hội
    case 'ach_auction_intimidate_10':
      return (player.auctionState as any)?.successfulIntimidations || stats.auctionIntimidations || 0;
    case 'ach_auction_win_tier5':
      return (player.auctionState as any)?.highestWinningBid || stats.auctionHighestBid || ((player.auctionState as any)?.totalWins ? 200000 : 0);
    case 'ach_auction_bankrupt_foe':
      return (player.auctionState as any)?.opponentsBankrupted || stats.auctionBankruptedFoes || 0;

    // 17. Tông Môn
    case 'ach_sect_tier5_join':
      return player.sectState?.sectId && ['sect_thai_at', 'sect_vo_cuc', 'sect_thien_ma', 'sect_van_phat'].includes(player.sectState.sectId) ? 1 : 0;
    case 'ach_sect_hold_all_veins':
      return (player.sectState as any)?.occupiedVeins?.length || (player.sectState as any)?.territoryVeinsCount || ((player.cosmicState?.occupiedNodeIds?.length ?? 0) >= 3 ? 3 : 0);
    case 'ach_sect_array_max':
      return player.sectState?.guardianArray?.level ?? player.abodeState?.spiritArray?.level ?? 1;
    case 'ach_sect_chancellor':
      return (player.sectState?.position === 'master' || player.sectState?.position === 'grand_elder' || Number(player.sectState?.rank ?? 0) >= 5) ? 1 : 0;

    // 18. Luân Hồi
    case 'ach_reborn_1':
    case 'ach_reborn_3':
      return player.reincarnationState?.totalRebornTimes || 0;
    case 'ach_reborn_unseal':
      return player.reincarnationState?.sealedArtifact?.isUnsealed ? 1 : (player.currentRealm >= 11 && player.reincarnationState?.sealedArtifact ? 1 : 0);
    case 'ach_reborn_slot6':
      return (player.destiny as any)?.unlockedSlotsCount || (player.reincarnationState as any)?.unlockedDestinySlots || (player.destinyBoard ? Object.keys(player.destinyBoard).length : 0);
    case 'ach_reborn_karma_1000':
      return player.reincarnationState?.currentKarmaPoints || player.reincarnationState?.lifetimeKarmaPoints || stats.totalKarmaEarned || 0;

    // 19. Hợp Kích
    case 'ach_synergy_20':
      return player.synergyState?.totalActivations || stats.synergyActivations || 0;
    case 'ach_synergy_mega_dmg':
    case 'ach_synergy_million_dmg':
      return player.synergyState?.highestDamageSynergy || stats.highestDamageDealt || 0;

    // 20. Chư Thiên Tinh Đồ
    case 'ach_cosmic_unlock':
      return player.cosmicState?.unlocked || (player.currentRealm >= 51) ? 1 : 0;
    case 'ach_cosmic_occupy_5':
      return player.cosmicState?.occupiedNodeIds?.length || 0;
    case 'ach_cosmic_craft_tier9':
      return stats.tier9Crafted || (Object.values(player.equipment || {}).some((eq: any) => eq?.tier === 9 || eq?.grade === 'Thần Phẩm') ? 1 : 0);
    case 'ach_cosmic_travel_100ly':
      return (player.cosmicState as any)?.totalLightYearsTraveled || stats.cosmicTravelLy || 0;
    case 'ach_cosmic_upgrade_vessel_3':
      return player.cosmicState?.vessel?.level || 1;

    // 21. Thể Tu, Hồn Tu & Lôi Kiếp
    case 'ach_physique_breakthrough':
      return Number(player.physiqueState?.cultivation?.currentStage ?? (player.bodyRefinement?.stage ?? 1)) || 1;
    case 'ach_soul_exorcise_demon':
      return (player.soulState as any)?.demonsDefeatedCount || stats.demonsDefeated || 0;
    case 'ach_tribulation_survive_9':
      return stats.tribulationWavesSurvived || (player.currentRealm >= 20 ? 9 : 0);

    default:
      return 0;
  }
}

/**
 * Kiểm tra xem thành tựu đã hoàn thành mục tiêu hay chưa
 */
export function isAchievementCompleted(
  ach: AchievementDefinition,
  player: PlayerStats
): boolean {
  const current = getAchievementCurrentProgress(ach, player);
  return current >= ach.target;
}

/**
 * Kiểm tra xem thành tựu đã nhận quà hay chưa
 */
export function isAchievementClaimed(
  achId: string,
  player: PlayerStats
): boolean {
  return (player.achievementsState?.claimedAchievementIds || []).includes(achId);
}

/**
 * Đếm số lượng thành tựu đã hoàn thành nhưng chưa nhận thưởng
 */
export function getUnclaimedAchievementsCount(player: PlayerStats): number {
  return ACHIEVEMENTS_CONFIG.filter(
    ach => isAchievementCompleted(ach, player) && !isAchievementClaimed(ach.id, player)
  ).length;
}

/**
 * Lấy cấu hình Danh Hiệu theo ID
 */
export function getTitleDefinition(titleId?: string | null): TitleDefinition | null {
  if (!titleId) return null;
  return TITLES_CONFIG[titleId] || null;
}

/**
 * Lấy toàn bộ Buffs từ danh hiệu đang trang bị của người chơi
 */
export function getEquippedTitleBuffs(player: PlayerStats): TitleBuff {
  const titleId = player.achievementsState?.equippedTitleId;
  if (!titleId) return {};
  const titleDef = TITLES_CONFIG[titleId];
  return titleDef?.buffs || {};
}
