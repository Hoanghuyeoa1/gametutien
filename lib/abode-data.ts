// lib/abode-data.ts
// Dữ liệu cấu hình Động Thiên Phúc Địa (Homestead & Abode Core)

import {
  AbodePlotState,
  AbodeSoilType,
  AbodeState,
  AbodeLevelConfig,
  SpiritArrayLevelConfig,
  SoilConfig
} from './types/abode';

// 1. Cấu hình Thổ Nhưỡng Dị Biến
export const SOIL_CONFIGS: Record<AbodeSoilType, SoilConfig> = {
  hoang_tho: {
    type: 'hoang_tho',
    name: 'Hoàng Thổ Thường',
    color: 'text-amber-300',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-600/40',
    element: 'thổ',
    description: 'Đất màu phì nhiêu tiêu chuẩn, thích ứng gieo trồng mọi loại thảo dược căn bản.',
    switchCostLinhThach: 500,
    speedReductionPercent: 0,
    yieldBonusPercent: 0
  },
  han_bang: {
    type: 'han_bang',
    name: 'Hàn Băng Thổ',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/50',
    element: 'thủy',
    description: 'Đất phủ sương băng vĩnh cửu. Giảm 40% thời gian chín thảo dược hệ Thủy/Băng và có 30% tỷ lệ thu hoạch thêm Linh Ngọc Băng hệ.',
    switchCostLinhThach: 2000,
    speedReductionPercent: 40,
    yieldBonusPercent: 0,
    gemBonusPercent: 30
  },
  hoa_diem: {
    type: 'hoa_diem',
    name: 'Hỏa Diễm Thổ',
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/50',
    element: 'hỏa',
    description: 'Đất dung nham rực cháy. Giảm 40% thời gian chín thảo dược hệ Hỏa và tăng 50% sản lượng thu hoạch.',
    switchCostLinhThach: 2000,
    speedReductionPercent: 40,
    yieldBonusPercent: 50
  }
};

// 2. Cấu hình 10 Cấp Tụ Linh Trận
export const SPIRIT_ARRAY_LEVELS: Record<number, SpiritArrayLevelConfig> = {
  1: {
    level: 1,
    name: 'Sơ Khai Tụ Linh Trận',
    costLinhThach: 500,
    requiredFlagId: 'item_tran_ky_so_cap',
    requiredFlagName: 'Trận Kỳ Sơ Cấp',
    requiredFlagCount: 1,
    tuViRateBonus: 5,
    autoHealBonus: 2,
    description: '+5% Tốc độ tu vi bế quan, +2% hồi phục HP/MP tự nhiên.'
  },
  2: {
    level: 2,
    name: 'Thanh Hư Hóa Khí Trận',
    costLinhThach: 1500,
    requiredFlagId: 'item_tran_ky_so_cap',
    requiredFlagName: 'Trận Kỳ Sơ Cấp',
    requiredFlagCount: 2,
    tuViRateBonus: 10,
    autoHealBonus: 4,
    description: '+10% Tốc độ tu vi bế quan, +4% hồi phục HP/MP tự nhiên.'
  },
  3: {
    level: 3,
    name: 'Cửu Tiêu Linh Toàn Trận',
    costLinhThach: 3500,
    requiredFlagId: 'item_tran_ky_trung_cap',
    requiredFlagName: 'Trận Kỳ Trung Cấp',
    requiredFlagCount: 1,
    tuViRateBonus: 15,
    autoHealBonus: 6,
    description: '+15% Tốc độ tu vi bế quan, +6% hồi phục HP/MP tự nhiên.'
  },
  4: {
    level: 4,
    name: 'Tứ Tượng Tụ Triều Trận',
    costLinhThach: 7500,
    requiredFlagId: 'item_tran_ky_trung_cap',
    requiredFlagName: 'Trận Kỳ Trung Cấp',
    requiredFlagCount: 2,
    tuViRateBonus: 20,
    autoHealBonus: 8,
    description: '+20% Tốc độ tu vi bế quan, +8% hồi phục HP/MP tự nhiên.'
  },
  5: {
    level: 5,
    name: 'Ngũ Hành Hỗn Thiên Đại Trận',
    costLinhThach: 16000,
    requiredFlagId: 'item_tran_ky_cao_cap',
    requiredFlagName: 'Trận Kỳ Cao Cấp',
    requiredFlagCount: 1,
    tuViRateBonus: 25,
    autoHealBonus: 10,
    gardenYieldBonus: 10,
    description: '+25% Tốc độ tu vi, +10% sản lượng Linh Điền, mở khóa sương mù linh khí quanh động phủ.'
  },
  6: {
    level: 6,
    name: 'Bát Quái Càn Khôn Trận',
    costLinhThach: 32000,
    requiredFlagId: 'item_tran_ky_cao_cap',
    requiredFlagName: 'Trận Kỳ Cao Cấp',
    requiredFlagCount: 2,
    tuViRateBonus: 32,
    autoHealBonus: 12,
    gardenYieldBonus: 12,
    description: '+32% Tốc độ tu vi, +12% hồi phục HP/MP, +12% sản lượng Linh Điền.'
  },
  7: {
    level: 7,
    name: 'Thất Tinh Bắc Đẩu Linh Trận',
    costLinhThach: 65000,
    requiredFlagId: 'item_tran_ky_cao_cap',
    requiredFlagName: 'Trận Kỳ Cao Cấp',
    requiredFlagCount: 3,
    tuViRateBonus: 40,
    autoHealBonus: 14,
    gardenYieldBonus: 15,
    description: '+40% Tốc độ tu vi, +14% hồi phục, +15% sản lượng Linh Điền.'
  },
  8: {
    level: 8,
    name: 'Chu Thiên Tinh Đẩu Đại Trận',
    costLinhThach: 130000,
    requiredFlagId: 'item_tran_ky_dinh_cap',
    requiredFlagName: 'Trận Kỳ Đỉnh Cấp',
    requiredFlagCount: 1,
    tuViRateBonus: 48,
    autoHealBonus: 16,
    gardenYieldBonus: 18,
    description: '+48% Tốc độ tu vi, +16% hồi phục, +18% sản lượng Linh Điền.'
  },
  9: {
    level: 9,
    name: 'Thái Cực Lưỡng Nghi Thần Trận',
    costLinhThach: 260000,
    requiredFlagId: 'item_tran_ky_dinh_cap',
    requiredFlagName: 'Trận Kỳ Đỉnh Cấp',
    requiredFlagCount: 2,
    tuViRateBonus: 55,
    autoHealBonus: 18,
    gardenYieldBonus: 20,
    description: '+55% Tốc độ tu vi, +18% hồi phục, +20% sản lượng Linh Điền.'
  },
  10: {
    level: 10,
    name: 'Thái Hư Hỗn Độn Tụ Linh Đại Trận (Viên Mãn)',
    costLinhThach: 550000,
    requiredFlagId: 'item_tran_ky_dinh_cap',
    requiredFlagName: 'Trận Kỳ Đỉnh Cấp',
    requiredFlagCount: 3,
    tuViRateBonus: 60,
    autoHealBonus: 20,
    gardenYieldBonus: 25,
    breakthroughBonus: 10,
    description: '+60% Tốc độ tu vi toàn cục, +20% hồi phục Chân Nguyên khi đi Bí Cảnh, tăng 10% tỷ lệ đột phá cảnh giới.'
  }
};

// 3. Cấu hình Cấp Động Phủ
export const ABODE_LEVELS: Record<number, AbodeLevelConfig> = {
  1: {
    level: 1,
    name: 'Sơ Khai Thạch Động',
    maxPlotsUnlocked: 6,
    maxDisciples: 1,
    upgradeCostLinhThach: 2000,
    requiredRealm: 1,
    description: 'Hang động đơn sơ giữa vách núi, linh khí sơ khai đủ đặt 6 ô linh điền và 1 đệ tử bái kiến.'
  },
  2: {
    level: 2,
    name: 'Thanh U Động Phủ',
    maxPlotsUnlocked: 8,
    maxDisciples: 1,
    upgradeCostLinhThach: 8000,
    requiredRealm: 2,
    description: 'Thanh phong lượn lờ, suối tiên róc rách, mở rộng thêm 2 ô linh thổ nuôi dưỡng kỳ hoa dị thảo.'
  },
  3: {
    level: 3,
    name: 'Tử Vân Tiên Phủ',
    maxPlotsUnlocked: 10,
    maxDisciples: 2,
    upgradeCostLinhThach: 25000,
    requiredRealm: 3,
    description: 'Mây tía vờn quanh, linh mạch ngầm tuôn trào, mở khóa thu nhận đệ tử thứ hai và 10 ô dược điền.'
  },
  4: {
    level: 4,
    name: 'Bích Lạc Tiên Cung',
    maxPlotsUnlocked: 12,
    maxDisciples: 2,
    upgradeCostLinhThach: 80000,
    requiredRealm: 4,
    description: 'Cung các nguy nga giữa tầng mây, trọn vẹn 12 ô đất dị biến thu nạp linh khí tinh thuần nhất.'
  },
  5: {
    level: 5,
    name: 'Động Thiên Phúc Địa Thần Cảnh',
    maxPlotsUnlocked: 12,
    maxDisciples: 3,
    upgradeCostLinhThach: 200000,
    requiredRealm: 5,
    description: 'Tiên cảnh chí cao độc bộ thiên hạ, tụ hội 3 đại thiên kiêu đệ tử phụng dưỡng tôn sư.'
  }
};

// 4. Chi phí mở khóa từng ô đất nếu chưa mở theo cấp
export const PLOT_UNLOCK_COSTS: Record<number, number> = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 3000,
  7: 6000,
  8: 12000,
  9: 20000,
  10: 35000,
  11: 50000
};

// 5. Cấu hình 12 Ô Đất Mặc Định
export const createDefaultAbodePlots = (): AbodePlotState[] => {
  return [
    { id: 0, soilType: 'hoang_tho', unlocked: true, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 1, soilType: 'hoang_tho', unlocked: true, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 2, soilType: 'hoang_tho', unlocked: true, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 3, soilType: 'hoang_tho', unlocked: true, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 4, soilType: 'hoang_tho', unlocked: true, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 5, soilType: 'hoang_tho', unlocked: true, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 6, soilType: 'han_bang', unlocked: false, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 7, soilType: 'han_bang', unlocked: false, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 8, soilType: 'han_bang', unlocked: false, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 9, soilType: 'hoa_diem', unlocked: false, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 10, soilType: 'hoa_diem', unlocked: false, seedId: null, plantedAt: null, harvestAt: null, fertilized: false },
    { id: 11, soilType: 'hoa_diem', unlocked: false, seedId: null, plantedAt: null, harvestAt: null, fertilized: false }
  ];
};

// 6. Trạng Thái Động Phủ Mặc Định
export const createDefaultAbodeState = (): AbodeState => {
  return {
    level: 1,
    spiritArray: {
      level: 1,
      tuViRateBonus: 5,
      autoHealBonus: 2
    },
    plots: createDefaultAbodePlots(),
    beastSanctuary: {
      roamingBeastIds: [],
      fertilizerStored: 1,
      lastFertilizerTick: Date.now()
    },
    scripturePavilion: {
      showcasedManualIds: [],
      disciples: []
    }
  };
};

// 7. Kho Tên và Avatar Đệ Tử
export const DISCIPLE_NAME_POOL = [
  'Lâm Phong', 'Diệp Phàm', 'Tiêu Viêm', 'Sở Hưu', 'Bạch Ngưng Băng',
  'Nhiếp Ly', 'Hàn Lập', 'Mạnh Hạo', 'Vương Lâm', 'Cố Trường Ca',
  'Lục Tuyết Kỳ', 'Liễu Nhược Tình', 'Chu Tước Nhi', 'Vân Triệt',
  'Dương Khai', 'Phương Nguyên', 'Tống Thư Hàng', 'Tần Vũ',
  'Đường Tam', 'Lạc Băng Hà', 'Thẩm Thanh Thu', 'Vương Bảo Nhạc',
  'Từ Khuyết', 'Trần Bình An', 'Lục Thừa Minh', 'Bạch Tiểu Thuần'
];

export const DISCIPLE_AVATARS = [
  '👨‍🎓', '🧑‍🎓', '🧘‍♂️', '🧘‍♀️', '🗡️', '🧙‍♂️', '🧝‍♀️', '✨', '🍃', '🔥', '❄️', '⚡'
];

// 8. Cấu hình Tư Chất Đệ Tử
export interface DiscipleAptitudeInfo {
  aptitude: 'ha' | 'trung' | 'thuong' | 'thien_kieu';
  name: string;
  color: string;
  badgeBg: string;
  baseWeight: number;
  minLinhThach: number;
  maxLinhThach: number;
  minDanhVong: number;
  maxDanhVong: number;
  herbIds: string[];
}

export const DISCIPLE_APTITUDE_CONFIG: Record<'ha' | 'trung' | 'thuong' | 'thien_kieu', DiscipleAptitudeInfo> = {
  ha: {
    aptitude: 'ha',
    name: 'Hạ Phẩm',
    color: 'text-zinc-400',
    badgeBg: 'bg-zinc-800/80 border-zinc-600',
    baseWeight: 45,
    minLinhThach: 200,
    maxLinhThach: 500,
    minDanhVong: 10,
    maxDanhVong: 25,
    herbIds: ['linh_thao']
  },
  trung: {
    aptitude: 'trung',
    name: 'Trung Phẩm',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/60 border-emerald-600',
    baseWeight: 35,
    minLinhThach: 500,
    maxLinhThach: 1200,
    minDanhVong: 25,
    maxDanhVong: 50,
    herbIds: ['linh_thao', 'huyet_tinh_thao', 'tu_khi_hoa']
  },
  thuong: {
    aptitude: 'thuong',
    name: 'Thượng Phẩm',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-950/60 border-sky-500',
    baseWeight: 16,
    minLinhThach: 1500,
    maxLinhThach: 3000,
    minDanhVong: 60,
    maxDanhVong: 110,
    herbIds: ['tu_khi_hoa', 'tay_tuy_linh_nhi', 'cuong_bao_hoa']
  },
  thien_kieu: {
    aptitude: 'thien_kieu',
    name: 'Thiên Kiêu Chi Tử',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
    baseWeight: 4,
    minLinhThach: 4000,
    maxLinhThach: 8000,
    minDanhVong: 150,
    maxDanhVong: 280,
    herbIds: ['tay_tuy_linh_nhi', 'truc_co_chi_lan', 'hoa_than_linh_diep', 'cuu_chuyen_ngoc_tuy']
  }
};

// 9. Phân loại hệ Thảo Dược
export const HERB_ELEMENT_MAP: Record<string, 'thuy' | 'hoa' | 'pho_thong'> = {
  // Thủy / Băng
  seed_tu_khi_hoa: 'thuy',
  seed_tay_tuy_linh_nhi: 'thuy',
  seed_cuu_chuyen_ngoc_tuy: 'thuy',
  tu_khi_hoa: 'thuy',
  tay_tuy_linh_nhi: 'thuy',
  cuu_chuyen_ngoc_tuy: 'thuy',

  // Hỏa
  seed_huyet_tinh_thao: 'hoa',
  seed_cuong_bao_hoa: 'hoa',
  seed_hoa_than_linh_diep: 'hoa',
  huyet_tinh_thao: 'hoa',
  cuong_bao_hoa: 'hoa',
  hoa_than_linh_diep: 'hoa',

  // Phổ thông
  seed_linh_thao: 'pho_thong',
  seed_truc_co_chi_lan: 'pho_thong',
  linh_thao: 'pho_thong',
  truc_co_chi_lan: 'pho_thong'
};

// 10. Khoảng cách chu kỳ tạo phân bón của thú (mặc định mỗi 1 giờ = 3600 giây hoặc 1800 giây để trải nghiệm mượt mà)
export const BEAST_FERTILIZER_TICK_SECONDS = 1800; // 30 phút sinh 1 phân bón cho mỗi thú
export const DISCIPLE_TRIBUTE_INTERVAL_MS = 43200000; // 12 giờ mỗi lần cống nạp
export const DISCIPLE_RECRUIT_COST_LINH_THACH = 2000;
