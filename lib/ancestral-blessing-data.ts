// lib/ancestral-blessing-data.ts
// Dữ liệu Nhang Cúng Tế, Hào Quang Tiên Bi theo Danh Hiệu Tiền Kiếp & Ngưỡng Kẹp Biên Đạo Vận

import type { IncenseConfig, IncenseGrade } from './types/ancestral-blessing';

// ─── 1. Bảng 3 Cấp Bậc Nhang Cúng Tế Tông Tộc ────────────────────────────────

export const INCENSE_OFFERINGS_CONFIG: Record<IncenseGrade, IncenseConfig> = {
  thanh_truc: {
    id: 'thanh_truc',
    name: 'Thanh Trúc Linh Hương',
    description: 'Nhang thơm làm từ linh trúc ngàn năm, khói hương thanh khiết giúp tâm thần an định, thổ nạp hanh thông.',
    costLinhThach: 2000,
    durationHours: 24,
    statBuffs: {
      tuViSpeedPercent: 10,
      dropRatePercent: 5,
    },
    protectionCharges: 0,
    icon: '🎋',
  },
  tu_tieu: {
    id: 'tu_tieu',
    name: 'Tử Tiêu Uẩn Hồn Nhang',
    description: 'Bảo hương luyện từ Tử Tiêu khoáng và Uẩn Thần Thảo, kết nối ý chí tổ tiên, ban tặng 1 lần Hư Ảnh Bảo Mệnh.',
    costLinhThach: 15000,
    requiredItemName: 'Uẩn Thần Thảo',
    durationHours: 24,
    statBuffs: {
      tuViSpeedPercent: 18,
      atkDefPercent: 10,
    },
    protectionCharges: 1, // Ban tặng 1 lần Hư Ảnh Tổ Tiên đỡ đòn tử vong
    icon: '🔮',
  },
  thai_so: {
    id: 'thai_so',
    name: 'Thái Sơ Hỗn Độn Tiên Hương',
    description: 'Thần hương thượng cổ kết tinh hỗn độn chi khí, thông thiên triệt địa, ban tặng 2 lần Hư Ảnh Tiên Đế cứu mạng!',
    costLinhThach: 80000,
    requiredItemName: 'Hỗn Độn Thần Thiết',
    durationHours: 48,
    statBuffs: {
      tuViSpeedPercent: 25,
      allStatsPercent: 25,
      critRatePercent: 15,
    },
    protectionCharges: 2, // Ban tặng 2 lần Hư Ảnh Tổ Tiên đỡ đòn tử vong
    icon: '👑',
  },
};

// ─── 2. Ngưỡng Kẹp Biên Trần (Diminishing Stacking Caps) ──────────────────────

export const ANCESTRAL_CAPS = {
  MAX_DAN_CUC_PHAM_RATE: 25,     // % tối đa +25%
  MAX_SWORD_DMG_BONUS: 20,        // % tối đa +20%
  MAX_TRIBULATION_REDUCTION: 30,  // % tối đa +30%
  MAX_TU_VI_SPEED: 40,            // % tối đa +40%
  MAX_KHI_VAN: 35,                // Điểm tối đa +35
  MAX_ALL_STATS: 30,              // % tối đa +30%
  MAX_CRIT_DMG: 50,               // % tối đa +50%
  MAX_MARKET_BONUS: 30,           // % tối đa +30%
  MAX_LIFESPAN: 200,              // Năm thọ nguyên tối đa +200
  MAX_GESTATION_REDUCTION: 35,    // % giảm thời gian hoài thai tối đa +35%
};

// ─── 3. Bảng Tra Cứu Đạo Vận Theo Từng Danh Hiệu Tiền Kiếp ───────────────────

export interface EpithetResonanceEffect {
  title: string;
  grade: 'than' | 'thien' | 'dia' | 'huyen' | 'hoang';
  description: string;
  danCucPhamRate?: number;
  swordDamagePercent?: number;
  tribulationReductionPercent?: number;
  tuViSpeedPercent?: number;
  lifespanYears?: number;
  linhThachBonus?: number;
  canCot?: number;
  ngoTinh?: number;
  khiVan?: number;
  critDmgPercent?: number;
  marketSellBonusPercent?: number;
  gestationReductionPercent?: number;
  allStatsPercent?: number;
}

export const EPITHET_RESONANCE_MAP: Record<string, EpithetResonanceEffect> = {
  // ── THẦN GIAI ──
  'Vạn Cổ Đế Tôn': {
    title: 'Vạn Cổ Đế Tôn',
    grade: 'than',
    description: 'Dị tượng Tử Khí Đông Lai: Giảm 10% tiêu hao khi độ kiếp, +5% Toàn thuộc tính.',
    tribulationReductionPercent: 10,
    allStatsPercent: 5,
    khiVan: 10,
  },
  'Vũ Hóa Tiên Nhân': {
    title: 'Vũ Hóa Tiên Nhân',
    grade: 'than',
    description: 'Phi thăng tiên giới lưu lại tiên ngân: +8% Tốc độ tu vi, +50 năm Thọ nguyên khởi đầu.',
    tuViSpeedPercent: 8,
    lifespanYears: 50,
  },
  'Hỗn Độn Luân Hồi Giả': {
    title: 'Hỗn Độn Luân Hồi Giả',
    grade: 'than',
    description: 'Trầm luân vạn kiếp bất diệt: +10 Ngộ tính, giảm 15% thời gian dưỡng thai Tiên Đồng.',
    ngoTinh: 10,
    gestationReductionPercent: 15,
  },
  'Thiên Kiêu Vẫn Lạc': {
    title: 'Thiên Kiêu Vẫn Lạc',
    grade: 'than',
    description: 'Nghịch thiên tử chiến đúc kiếm hồn: +12% Sát thương bạo kích, +5% Toàn thuộc tính.',
    critDmgPercent: 12,
    allStatsPercent: 5,
  },
  'Độ Kiếp Thần Tôn': {
    title: 'Độ Kiếp Thần Tôn',
    grade: 'than',
    description: 'Bá chủ thiên kiếp: Giảm 12% tiêu hao độ kiếp, +8% Tốc độ tu vi.',
    tribulationReductionPercent: 12,
    tuViSpeedPercent: 8,
  },

  // ── THIÊN GIAI ──
  'Đan Đạo Thái Đẩu': {
    title: 'Đan Đạo Thái Đẩu',
    grade: 'thien',
    description: 'Tổ sư đan đạo phù hộ: +5% Tỷ lệ luyện chế đan dược Cực Phẩm.',
    danCucPhamRate: 5,
  },
  'Đương Thế Kiếm Tôn': {
    title: 'Đương Thế Kiếm Tôn',
    grade: 'thien',
    description: 'Kiếm ý thông thiên truyền thừa: +4% Sát thương Kiếm Pháp, +5 Khí Vận.',
    swordDamagePercent: 4,
    khiVan: 5,
  },
  'Vạn Bảo Hào Phú': {
    title: 'Vạn Bảo Hào Phú',
    grade: 'thien',
    description: 'Tài nguyên phong phú tích đức cho hậu bối: +8% Giá bán vật phẩm vào Thương Hội.',
    marketSellBonusPercent: 8,
    linhThachBonus: 5000,
  },
  'Phong Lưu Đạo Quân': {
    title: 'Phong Lưu Đạo Quân',
    grade: 'thien',
    description: 'Hồng nhan tri kỷ tương phùng: +8% Tốc độ tu vi, giảm 5% thời gian dưỡng thai.',
    tuViSpeedPercent: 8,
    gestationReductionPercent: 5,
  },
  'Cực Cảnh Trảm Lôi': {
    title: 'Cực Cảnh Trảm Lôi',
    grade: 'thien',
    description: 'Khắc chế lôi kiếp: Giảm 8% tiêu hao độ kiếp, +6% Sát thương bạo kích.',
    tribulationReductionPercent: 8,
    critDmgPercent: 6,
  },
  'Thông Thiên Đại Năng': {
    title: 'Thông Thiên Đại Năng',
    grade: 'thien',
    description: 'Căn cơ đại đạo thâm hậu: +6% Tốc độ tu vi, +8 Căn Cốt.',
    tuViSpeedPercent: 6,
    canCot: 8,
  },

  // ── ĐỊA GIAI ──
  'Nghịch Lôi Vẫn Lạc': {
    title: 'Nghịch Lôi Vẫn Lạc',
    grade: 'dia',
    description: 'Tâm đắc vượt lôi kiếp: Giảm 6% tiêu hao và sát thương lôi kiếp.',
    tribulationReductionPercent: 6,
  },
  'Giải Thoát Chân Nhân': {
    title: 'Giải Thoát Chân Nhân',
    grade: 'dia',
    description: 'Thấu hiểu sinh tử: +4% Tốc độ tu vi, +5 Ngộ Tính.',
    tuViSpeedPercent: 4,
    ngoTinh: 5,
  },
  'Bách Niên Đạo Tu': {
    title: 'Bách Niên Đạo Tu',
    grade: 'dia',
    description: 'Trường thọ tổ tông: +20 năm Thọ nguyên cơ bản.',
    lifespanYears: 20,
  },
  'Thiên Nhai Kiếm Si': {
    title: 'Thiên Nhai Kiếm Si',
    grade: 'dia',
    description: 'Si mê kiếm đạo: +3% Sát thương Kiếm Pháp.',
    swordDamagePercent: 3,
  },
  'Vấn Đạo Chân Nhân': {
    title: 'Vấn Đạo Chân Nhân',
    grade: 'dia',
    description: 'Tâm hướng đại đạo: +3% Tốc độ tu vi, +5 Căn Cốt.',
    tuViSpeedPercent: 3,
    canCot: 5,
  },
};
