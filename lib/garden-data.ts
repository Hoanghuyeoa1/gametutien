// lib/garden-data.ts
// Dữ liệu Động Phủ Linh Điền (Trồng Linh Dược)

import { HerbSeed, LinhDienLevelInfo, LinhDienState, GardenPlot } from '@/lib/types';

export const HERB_SEEDS: HerbSeed[] = [
  {
    id: 'seed_linh_thao',
    herbId: 'linh_thao',
    name: 'Hạt Giống Bách Thảo',
    herbName: 'Bách Thảo Sơ Thiên',
    grade: 'Nhất Phẩm',
    growthDurationSeconds: 30, // 30 giây
    costLinhThach: 20,
    baseYield: 2,
    description: 'Hạt giống linh thảo căn bản, thích nghi với mọi loại linh thổ, sinh trưởng thần tốc.'
  },
  {
    id: 'seed_huyet_tinh_thao',
    herbId: 'huyet_tinh_thao',
    name: 'Hạt Giống Huyết Tinh',
    herbName: 'Huyết Tinh Thảo',
    grade: 'Nhị Phẩm',
    growthDurationSeconds: 60, // 1 phút
    costLinhThach: 45,
    baseYield: 2,
    description: 'Hạt giống đượm màu đỏ thắm, hấp thụ huyết khí thiên địa ngưng tụ dược tính dồi dào.'
  },
  {
    id: 'seed_tu_khi_hoa',
    herbId: 'tu_khi_hoa',
    name: 'Hạt Giống Tụ Khí Hoa',
    herbName: 'Tụ Khí Thanh Hoa',
    grade: 'Nhị Phẩm',
    growthDurationSeconds: 90, // 1.5 phút
    costLinhThach: 60,
    baseYield: 2,
    description: 'Nảy mầm đóa hoa lam biếc, ngưng tụ chân nguyên thiên địa hỗ trợ luyện chế hồi phục đan.'
  },
  {
    id: 'seed_tay_tuy_linh_nhi',
    herbId: 'tay_tuy_linh_nhi',
    name: 'Bào Tử Tẩy Tủy Chi',
    herbName: 'Tẩy Tủy Linh Chi',
    grade: 'Tam Phẩm',
    growthDurationSeconds: 150, // 2.5 phút
    costLinhThach: 180,
    baseYield: 2,
    description: 'Bào tử nấm linh chi ngàn năm, dùng trồng tại linh điền thanh lọc cốt tủy tịnh hóa kinh mạch.'
  },
  {
    id: 'seed_cuong_bao_hoa',
    herbId: 'cuong_bao_hoa',
    name: 'Hạt Giống Cuồng Bạo Ma Hoa',
    herbName: 'Cuồng Bạo Ma Hoa',
    grade: 'Tam Phẩm',
    growthDurationSeconds: 180, // 3 phút
    costLinhThach: 150,
    baseYield: 2,
    description: 'Hạt ma hoa kỳ dị, sinh trưởng cần linh khí bạo liệt, dược liệu cốt lõi của Cuồng Bạo Đan.'
  },
  {
    id: 'seed_truc_co_chi_lan',
    herbId: 'truc_co_chi_lan',
    name: 'Mầm Trúc Cơ Lan',
    herbName: 'Trúc Cơ Chi Lan',
    grade: 'Tứ Phẩm',
    growthDurationSeconds: 300, // 5 phút
    costLinhThach: 350,
    baseYield: 2,
    description: 'Mầm thảo trân quý chuyên dùng luyện chế Trúc Cơ Đan phá vỡ bình cảnh tu sĩ.'
  },
  {
    id: 'seed_hoa_than_linh_diep',
    herbId: 'hoa_than_linh_diep',
    name: 'Chiết Cành Hóa Thần Diệp',
    herbName: 'Hóa Thần Linh Diệp',
    grade: 'Ngũ Phẩm',
    growthDurationSeconds: 450, // 7.5 phút
    costLinhThach: 900,
    baseYield: 2,
    description: 'Cành lá ngậm linh thức viễn cổ, sinh trưởng chầm chậm nhưng giá trị vạn lượng linh thạch.'
  },
  {
    id: 'seed_cuu_chuyen_ngoc_tuy',
    herbId: 'cuu_chuyen_ngoc_tuy',
    name: 'Tinh Thể Ngọc Tủy Thần Thảo',
    herbName: 'Cửu Chuyển Ngọc Tủy',
    grade: 'Thần Phẩm',
    growthDurationSeconds: 600, // 10 phút
    costLinhThach: 2200,
    baseYield: 2,
    description: 'Ngọc tủy ngưng kết triệu năm, sinh trưởng kết tinh thần dược luyện Cải Mệnh Thần Đan.'
  }
];

export const LINH_DIEN_LEVELS: Record<number, LinhDienLevelInfo> = {
  1: {
    level: 1,
    name: 'Phàm Điền Sơ Khai',
    upgradeCostLinhThach: 200,
    yieldBonusPercent: 0,
    speedBonusPercent: 0,
    maxPlots: 4,
    description: 'Đất phù sa phàm trần khai khẩn quanh động phủ, linh khí mỏng manh, sản lượng cơ bản.'
  },
  2: {
    level: 2,
    name: 'Hạ Phẩm Tụ Linh Điền',
    upgradeCostLinhThach: 500,
    yieldBonusPercent: 25,
    speedBonusPercent: 5,
    maxPlots: 4,
    description: 'Bố trí Tụ Linh Trận cấp thấp, linh khí vây quanh đất trồng, tăng +25% sản lượng thu hoạch.'
  },
  3: {
    level: 3,
    name: 'Trung Phẩm Ngũ Hành Điền',
    upgradeCostLinhThach: 1200,
    yieldBonusPercent: 50,
    speedBonusPercent: 10,
    maxPlots: 5,
    description: 'Dẫn linh tuyền ngũ hành tưới tiêu, khai mở thêm Ô Đất Thứ 5, tăng +50% sản lượng.'
  },
  4: {
    level: 4,
    name: 'Thượng Phẩm Tử Ngọc Điền',
    upgradeCostLinhThach: 3000,
    yieldBonusPercent: 75,
    speedBonusPercent: 15,
    maxPlots: 6,
    description: 'Linh thổ hóa thành ngọc sắc tím biếc, khai mở thêm Ô Đất Thứ 6, tăng +75% sản lượng.'
  },
  5: {
    level: 5,
    name: 'Cực Phẩm Tiên Thiên Điền',
    upgradeCostLinhThach: 8000,
    yieldBonusPercent: 100,
    speedBonusPercent: 20,
    maxPlots: 6,
    description: 'Tiên thiên linh tức thấm đẫm gốc rễ, nhân đôi toàn bộ sản lượng (+100%), sinh trưởng nhanh +20%.'
  },
  6: {
    level: 6,
    name: 'Huyền Hoàng Thần Điền',
    upgradeCostLinhThach: 0, // Max level
    yieldBonusPercent: 150,
    speedBonusPercent: 30,
    maxPlots: 6,
    description: 'Đỉnh phong thần thổ thái cổ, sản lượng bùng nổ (+150%), linh thảo kết tinh rực rỡ!'
  }
};

export function createDefaultLinhDien(): LinhDienState {
  const plots: GardenPlot[] = [
    { id: 0, isUnlocked: true, seedId: null, plantedAt: null, harvestAt: null, readyToHarvest: false },
    { id: 1, isUnlocked: true, seedId: null, plantedAt: null, harvestAt: null, readyToHarvest: false },
    { id: 2, isUnlocked: true, seedId: null, plantedAt: null, harvestAt: null, readyToHarvest: false },
    { id: 3, isUnlocked: true, seedId: null, plantedAt: null, harvestAt: null, readyToHarvest: false },
    { id: 4, isUnlocked: false, seedId: null, plantedAt: null, harvestAt: null, readyToHarvest: false },
    { id: 5, isUnlocked: false, seedId: null, plantedAt: null, harvestAt: null, readyToHarvest: false }
  ];

  return {
    level: 1,
    yieldBonusPercent: 0,
    speedBonusPercent: 0,
    plots
  };
}

export function calculateYieldCount(baseYield: number, yieldBonusPercent: number, companionStationed: boolean = false): number {
  const bonusMultiplier = 1 + yieldBonusPercent / 100;
  const exactYield = baseYield * bonusMultiplier;
  const guaranteed = Math.floor(exactYield);
  const fractional = exactYield - guaranteed;
  // Tỉ lệ nhận thêm 1 nhánh thảo dược nếu có phần dư
  const luckyBonus = Math.random() < fractional ? 1 : 0;
  // Tiên Tử trấn thủ Linh Điền: Tăng 35% tỉ lệ thu hoạch thêm thảo dược biến dị/ngàn năm
  const companionMutantBonus = companionStationed && Math.random() < 0.35 ? 1 : 0;
  return Math.max(1, guaranteed + luckyBonus + companionMutantBonus);
}

export function calculateGrowthDuration(baseSeconds: number, speedBonusPercent: number, companionStationed: boolean = false): number {
  // Tiên tử hỗ trợ: Tự động tưới tiêu, giảm thêm 15% thời gian sinh trưởng
  const companionFactor = companionStationed ? 0.85 : 1.0;
  const speedMultiplier = (1 - Math.min(0.5, speedBonusPercent / 100)) * companionFactor;
  return Math.max(5, Math.round(baseSeconds * speedMultiplier));
}
