// lib/tu-vi-empowerment-data.ts
// Dữ liệu cấu hình cho phân hệ "Vạn Năng Tu Vi: Quán Đỉnh Đạo Lữ, Khai Thông Kinh Mạch & Ngưng Đan Chân Nguyên"

import type {
  MeridianDefinition,
  TuViCrystallizeRecipe,
  TuViEmpowermentState,
} from './types/tu-vi-empowerment';


// ─── Danh Mục 8 Đại Mạch Thần Thông & 32 Khiếu Huyệt Nhân Thể ────────────────

export const MERIDIANS_CONFIG: MeridianDefinition[] = [
  {
    id: 'nham_mach',
    name: 'Nhâm Mạch (Âm Mạch Chi Hải)',
    elementColor: '#38bdf8',
    description: 'Chủ quản toàn bộ âm kinh trong nhân thể, ngưng tụ khí huyết tinh hoa, bồi bổ đan điền khí hải.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Khí Huyết Tối Đa +25%, Kháng Sát Thương +5%',
    completionStatBonus: {
      maxHpPercent: 25,
      damageReductionPercent: 5,
    },
    acupoints: [
      {
        id: 'nham_khuc_cot',
        name: 'Khúc Cốt Huyệt',
        meridianId: 'nham_mach',
        tuViCost: 30000,
        statBonus: { maxHpPercent: 3 },
        x: 50,
        y: 68,
      },
      {
        id: 'nham_quan_nguyen',
        name: 'Quan Nguyên Huyệt',
        meridianId: 'nham_mach',
        tuViCost: 50000,
        statBonus: { maxHpPercent: 5 },
        x: 50,
        y: 60,
      },
      {
        id: 'nham_khi_hai',
        name: 'Khí Hải Huyệt',
        meridianId: 'nham_mach',
        tuViCost: 80000,
        statBonus: { maxHpPercent: 7 },
        x: 50,
        y: 52,
      },
      {
        id: 'nham_dan_trung',
        name: 'Đản Trung Huyệt',
        meridianId: 'nham_mach',
        tuViCost: 120000,
        statBonus: { maxHpPercent: 10 },
        x: 50,
        y: 36,
      },
    ],
  },
  {
    id: 'doc_mach',
    name: 'Đốc Mạch (Dương Mạch Chi Hải)',
    elementColor: '#f59e0b',
    description: 'Thống lĩnh toàn bộ dương kinh, cương dương bất diệt, hộ trì cột sống và thức hải bách hội.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Phòng Ngự +20%, Giảm Sát Thương Bạo Kích Nhận Vào -12%',
    completionStatBonus: {
      defPercent: 20,
      damageReductionPercent: 6,
    },
    acupoints: [
      {
        id: 'doc_menh_mon',
        name: 'Mệnh Môn Huyệt',
        meridianId: 'doc_mach',
        tuViCost: 50000,
        statBonus: { defPercent: 4 },
        x: 50,
        y: 56,
      },
      {
        id: 'doc_dai_chuy',
        name: 'Đại Chùy Huyệt',
        meridianId: 'doc_mach',
        tuViCost: 80000,
        statBonus: { defPercent: 6 },
        x: 50,
        y: 28,
      },
      {
        id: 'doc_phong_phu',
        name: 'Phong Phủ Huyệt',
        meridianId: 'doc_mach',
        tuViCost: 120000,
        statBonus: { defPercent: 8 },
        x: 50,
        y: 20,
      },
      {
        id: 'doc_bach_hoi',
        name: 'Bách Hội Huyệt',
        meridianId: 'doc_mach',
        tuViCost: 180000,
        statBonus: { defPercent: 10, damageReductionPercent: 3 },
        x: 50,
        y: 10,
      },
    ],
  },
  {
    id: 'xung_mach',
    name: 'Xung Mạch (Thập Nhị Kinh Chi Hải)',
    elementColor: '#ef4444',
    description: 'Dẫn dắt khí huyết cuồn cuộn như sóng thần, bùng nổ sát phạt, gia tăng uy lực kiếm chiêu pháp thuật.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Công Kích +20%, Tỷ Lệ Bạo Kích +5%',
    completionStatBonus: {
      atkPercent: 20,
      critRatePercent: 5,
    },
    acupoints: [
      {
        id: 'xung_u_mon',
        name: 'U Môn Huyệt',
        meridianId: 'xung_mach',
        tuViCost: 60000,
        statBonus: { atkPercent: 4 },
        x: 46,
        y: 38,
      },
      {
        id: 'xung_thong_coc',
        name: 'Thông Cốc Huyệt',
        meridianId: 'xung_mach',
        tuViCost: 90000,
        statBonus: { atkPercent: 5 },
        x: 46,
        y: 44,
      },
      {
        id: 'xung_am_do',
        name: 'Âm Đô Huyệt',
        meridianId: 'xung_mach',
        tuViCost: 140000,
        statBonus: { atkPercent: 7 },
        x: 46,
        y: 50,
      },
      {
        id: 'xung_hoang_du',
        name: 'Hoang Du Huyệt',
        meridianId: 'xung_mach',
        tuViCost: 200000,
        statBonus: { atkPercent: 10, critRatePercent: 2 },
        x: 46,
        y: 56,
      },
    ],
  },
  {
    id: 'doi_mach',
    name: 'Đới Mạch (Chu Lưu Bát Hoang)',
    elementColor: '#10b981',
    description: 'Vòng quanh vùng eo như đai ngọc ước thúc chư kinh, gia tăng tốc độ thân pháp và khả năng né tránh.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Tốc Độ Thân Pháp +18, Né Tránh +8%',
    completionStatBonus: {
      speedBonus: 18,
    },
    acupoints: [
      {
        id: 'doi_mach_huyet',
        name: 'Đới Mạch Huyệt',
        meridianId: 'doi_mach',
        tuViCost: 70000,
        statBonus: { speedBonus: 4 },
        x: 36,
        y: 54,
      },
      {
        id: 'doi_ngu_xu',
        name: 'Ngũ Xu Huyệt',
        meridianId: 'doi_mach',
        tuViCost: 100000,
        statBonus: { speedBonus: 5 },
        x: 38,
        y: 60,
      },
      {
        id: 'doi_duy_dao',
        name: 'Duy Đạo Huyệt',
        meridianId: 'doi_mach',
        tuViCost: 150000,
        statBonus: { speedBonus: 6 },
        x: 62,
        y: 60,
      },
      {
        id: 'doi_cu_lieu',
        name: 'Cự Liêu Huyệt',
        meridianId: 'doi_mach',
        tuViCost: 220000,
        statBonus: { speedBonus: 8 },
        x: 64,
        y: 54,
      },
    ],
  },
  {
    id: 'am_kieu',
    name: 'Âm Kiều Mạch (Nhiệt Lôi Khởi Xung)',
    elementColor: '#a855f7',
    description: 'Khởi phát từ gót chân hướng lên mắt trong, dẫn dắt lôi đình kình lực bộc phát hiểm hóc.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Bạo Kích +10%, Sát Thương Bạo Kích +15%',
    completionStatBonus: {
      critRatePercent: 10,
      critDmgPercent: 15,
    },
    acupoints: [
      {
        id: 'am_kieu_chieu_hai',
        name: 'Chiếu Hải Huyệt',
        meridianId: 'am_kieu',
        tuViCost: 80000,
        statBonus: { critRatePercent: 2 },
        x: 44,
        y: 88,
      },
      {
        id: 'am_kieu_giao_tin',
        name: 'Giao Tín Huyệt',
        meridianId: 'am_kieu',
        tuViCost: 120000,
        statBonus: { critRatePercent: 3 },
        x: 44,
        y: 78,
      },
      {
        id: 'am_kieu_truc_tan',
        name: 'Trúc Tân Huyệt',
        meridianId: 'am_kieu',
        tuViCost: 180000,
        statBonus: { critDmgPercent: 6 },
        x: 45,
        y: 72,
      },
      {
        id: 'am_kieu_tinh_minh',
        name: 'Tinh Minh Huyệt',
        meridianId: 'am_kieu',
        tuViCost: 260000,
        statBonus: { critRatePercent: 4, critDmgPercent: 10 },
        x: 48,
        y: 18,
      },
    ],
  },
  {
    id: 'duong_kieu',
    name: 'Dương Kiều Mạch (Kình Lực Bạt Sơn)',
    elementColor: '#ec4899',
    description: 'Khởi phát từ mắt cá ngoài hướng lên vai cổ, kích phát sức mạnh dời non lấp biển tàn khốc.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Bạo Kích +12%, Sát Thương Bạo Kích +25%',
    completionStatBonus: {
      critRatePercent: 12,
      critDmgPercent: 25,
    },
    acupoints: [
      {
        id: 'duong_kieu_than_mach',
        name: 'Thân Mạch Huyệt',
        meridianId: 'duong_kieu',
        tuViCost: 90000,
        statBonus: { critRatePercent: 2 },
        x: 56,
        y: 88,
      },
      {
        id: 'duong_kieu_boc_tham',
        name: 'Bộc Tham Huyệt',
        meridianId: 'duong_kieu',
        tuViCost: 130000,
        statBonus: { critRatePercent: 3 },
        x: 56,
        y: 82,
      },
      {
        id: 'duong_kieu_con_lon',
        name: 'Côn Lôn Huyệt',
        meridianId: 'duong_kieu',
        tuViCost: 190000,
        statBonus: { critDmgPercent: 8 },
        x: 55,
        y: 74,
      },
      {
        id: 'duong_kieu_cu_cot',
        name: 'Cự Cốt Huyệt',
        meridianId: 'duong_kieu',
        tuViCost: 280000,
        statBonus: { critRatePercent: 5, critDmgPercent: 15 },
        x: 64,
        y: 26,
      },
    ],
  },
  {
    id: 'am_duy',
    name: 'Âm Duy Mạch (Ngũ Hành Hộ Thể)',
    elementColor: '#06b6d4',
    description: 'Liên kết toàn bộ âm kinh, hộ vệ tâm mạch và ngũ tạng, giúp tâm cảnh an định trước tâm ma.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Khí Huyết +15%, Kháng Sát Thương Ngũ Hành +10%',
    completionStatBonus: {
      maxHpPercent: 15,
      damageReductionPercent: 5,
    },
    acupoints: [
      {
        id: 'am_duy_phu_xa',
        name: 'Phủ Xá Huyệt',
        meridianId: 'am_duy',
        tuViCost: 100000,
        statBonus: { maxHpPercent: 3 },
        x: 40,
        y: 64,
      },
      {
        id: 'am_duy_dai_hoanh',
        name: 'Đại Hoành Huyệt',
        meridianId: 'am_duy',
        tuViCost: 150000,
        statBonus: { maxHpPercent: 4 },
        x: 38,
        y: 52,
      },
      {
        id: 'am_duy_phuc_ai',
        name: 'Phúc Ai Huyệt',
        meridianId: 'am_duy',
        tuViCost: 220000,
        statBonus: { maxHpPercent: 5, damageReductionPercent: 2 },
        x: 40,
        y: 44,
      },
      {
        id: 'am_duy_ky_mon',
        name: 'Kỳ Môn Huyệt',
        meridianId: 'am_duy',
        tuViCost: 320000,
        statBonus: { maxHpPercent: 7, damageReductionPercent: 3 },
        x: 42,
        y: 36,
      },
    ],
  },
  {
    id: 'duong_duy',
    name: 'Dương Duy Mạch (Kim Cương Bất Hoại)',
    elementColor: '#eab308',
    description: 'Liên kết toàn bộ dương kinh, đúc thành hộ thể cương khí vững như bàn thạch vạn pháp bất xâm.',
    completionBonusDescription: 'Đại Chu Thiên Dị Tượng: Giảm Sát Thương Toàn Diện +12%',
    completionStatBonus: {
      damageReductionPercent: 12,
    },
    acupoints: [
      {
        id: 'duong_duy_kim_mon',
        name: 'Kim Môn Huyệt',
        meridianId: 'duong_duy',
        tuViCost: 120000,
        statBonus: { damageReductionPercent: 2 },
        x: 60,
        y: 84,
      },
      {
        id: 'duong_duy_duong_giao',
        name: 'Dương Giao Huyệt',
        meridianId: 'duong_duy',
        tuViCost: 180000,
        statBonus: { damageReductionPercent: 3 },
        x: 58,
        y: 68,
      },
      {
        id: 'duong_duy_nhu_du',
        name: 'Nhu Du Huyệt',
        meridianId: 'duong_duy',
        tuViCost: 260000,
        statBonus: { damageReductionPercent: 4 },
        x: 66,
        y: 32,
      },
      {
        id: 'duong_duy_thien_lieu',
        name: 'Thiên Liêu Huyệt',
        meridianId: 'duong_duy',
        tuViCost: 380000,
        statBonus: { damageReductionPercent: 5 },
        x: 60,
        y: 24,
      },
    ],
  },
];

// ─── Danh Sách Bản Đồ Tra Cứu Huyệt Vị ────────────────────────────────────────

export const ACUPOINTS_MAP = (() => {
  const map: Record<string, import('./types/tu-vi-empowerment').AcupointNode> = {};
  MERIDIANS_CONFIG.forEach(m => {
    m.acupoints.forEach(a => {
      map[a.id] = a;
    });
  });
  return map;
})();

// ─── 3 Công Thức Ngưng Tụ Tu Vi Chân Đan ──────────────────────────────────────

export const TU_VI_CRYSTALLIZE_RECIPES: TuViCrystallizeRecipe[] = [
  {
    id: 'recipe_tieu_nguyen_dan',
    name: 'Tiểu Nguyên Đan',
    tuViCost: 50000,
    outputItemId: 'pill_tieu_nguyen_dan',
    storedTuVi: 40000,
    description: 'Hạt đan óng ánh ngưng tụ từ 50,000 chân nguyên tu vi, khi nuốt vào lập tức hấp thu 40,000 Tu Vi.',
    icon: '💊',
    grade: 'Cực Phẩm',
    quality: 'cuc_pham',
  },
  {
    id: 'recipe_cuu_chuyen_chan_nguyen_dan',
    name: 'Cửu Chuyển Chân Nguyên Đan',
    tuViCost: 250000,
    outputItemId: 'pill_cuu_chuyen_chan_nguyen_dan',
    storedTuVi: 210000,
    description: 'Đan dược chín vòng hào quang rực rỡ, tích lũy 210,000 Tu Vi tinh thuần không chút tạp chất.',
    icon: '🔮',
    grade: 'Thần Phẩm',
    quality: 'than_pham',
  },
  {
    id: 'recipe_van_co_dao_qua_dan',
    name: 'Vạn Cổ Đạo Quả Đan',
    tuViCost: 1000000,
    outputItemId: 'pill_van_co_dao_qua_dan',
    storedTuVi: 850000,
    description: 'Tuyệt thế tiên đan kết tinh từ 1,000,000 tu vi vĩ đại, ẩn chứa 850,000 Tu Vi nghịch thiên cải mệnh.',
    icon: '✨',
    grade: 'Tiên Phẩm',
    quality: 'tien_pham',
  },
];

// ─── Cấu Hình Mức Quán Đỉnh Đạo Lữ ───────────────────────────────────────────

export interface CompanionInfusionTier {
  id: string;
  name: string;
  tuViCost: number;
  effectiveTuVi: number;
  affinityBonus: number;
}

export const COMPANION_INFUSION_TIERS: CompanionInfusionTier[] = [
  {
    id: 'tier_so_thanh',
    name: 'Sơ Cấp Quán Đỉnh',
    tuViCost: 50000,
    effectiveTuVi: 42500, // Hao hụt 15%
    affinityBonus: 5,
  },
  {
    id: 'tier_trung_thanh',
    name: 'Trung Cấp Quán Đỉnh',
    tuViCost: 200000,
    effectiveTuVi: 170000, // Hao hụt 15%
    affinityBonus: 12,
  },
  {
    id: 'tier_dai_thanh',
    name: 'Đại Viên Mãn Quán Đỉnh',
    tuViCost: 1000000,
    effectiveTuVi: 880000, // Hao hụt 12%
    affinityBonus: 25,
  },
];

export const createDefaultTuViEmpowermentState = (): TuViEmpowermentState => ({
  unlockedAcupointIds: [],
  completedMeridianIds: [],
  totalTuViInfusedToCompanions: 0,
  totalTuViCrystallized: 0,
  crystallizedCount: 0,
  overdriveBuff: null,
  overdriveActiveTurns: 0,
  catalystBonusPercent: 0,
});


