// lib/physique-system-data.ts
// Dữ liệu cấu hình Phân Hệ "Huyền Công Luyện Thể" (Expanded Physique System)

import {
  PhysiqueRealm,
  PhysiquePart,
  PhysiqueState,
  PhysiqueItemConfig
} from './types/physique';

// 1. 10 CẢNH GIỚI NHỤC THÂN (PHYSIQUE REALMS)
export const PHYSIQUE_REALMS: PhysiqueRealm[] = [
  {
    id: 'pham_thai',
    realmIndex: 0,
    name: 'Phàm Thai',
    maxStage: 9,
    description: 'Thân xác phàm trần chưa qua rèn giũa, chứa nhiều tạp chất nhưng ẩn tàng tiềm năng vô hạn.',
    lore: 'Khởi đầu phàm trần, lấy ý chí sắt đá nung nấu gân cốt sơ khai.',
    bodyColor: 'from-amber-900/40 via-stone-800/60 to-zinc-900/80',
    glowColor: 'rgba(217, 119, 6, 0.25)',
    baseStatsBonus: {
      hp: 500,
      def: 35,
      atk: 25,
      speed: 5
    },
    specialAbilityId: 'pham_thai_kien_tri',
    specialAbilityName: 'Bền Bỉ Phàm Nhân',
    specialAbilityDesc: 'Tăng 5% tốc độ tích lũy Khí Huyết cơ bản.'
  },
  {
    id: 'dong_bi_thiet_cot',
    realmIndex: 1,
    name: 'Đồng Bì Thiết Cốt',
    maxStage: 9,
    description: 'Da cứng như đồng hun, xương cốt rắn như thép nguội, gươm đao bình thường chém vào tóe lửa.',
    lore: 'Nấu dầu sôi ngâm thuốc bắc, bách luyện thành đồng thiếc bất hoại sơ thành.',
    bodyColor: 'from-amber-600/50 via-yellow-900/60 to-stone-900/80',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    baseStatsBonus: {
      hp: 2000,
      def: 180,
      atk: 90,
      damageReduction: 5
    },
    specialAbilityId: 'thiet_cot_ho_the',
    specialAbilityName: 'Thiết Cốt Hộ Thể',
    specialAbilityDesc: 'Giảm 5% toàn bộ sát thương vật lý gánh chịu.'
  },
  {
    id: 'ngoc_nhu_huyet',
    realmIndex: 2,
    name: 'Ngọc Nhũ Huyết',
    maxStage: 9,
    description: 'Khí huyết chuyển hóa thành sắc trắng ngọc nhũ, bài trừ hoàn toàn độc tố, tự động khép miệng vết thương.',
    lore: 'Huyết sắc tựa ngọc dịch quỳnh tương, sinh cơ bừng bừng chảy khắp kinh lạc.',
    bodyColor: 'from-teal-500/50 via-emerald-950/60 to-stone-950/80',
    glowColor: 'rgba(20, 184, 166, 0.45)',
    baseStatsBonus: {
      hp: 6000,
      def: 420,
      atk: 220,
      hpRegen: 3,
      damageReduction: 8
    },
    specialAbilityId: 'ngoc_nhu_khang_doc',
    specialAbilityName: 'Bách Độc Bất Xâm',
    specialAbilityDesc: 'Hồi phục 3% Khí Huyết tối đa mỗi hiệp chiến đấu, miễn nhiễm độc tố.'
  },
  {
    id: 'tinh_the_chan_nhan',
    realmIndex: 3,
    name: 'Tinh Thể Chân Nhân',
    maxStage: 9,
    description: 'Từng thớ cơ bắp ngưng kết thành tinh thể lưu ly trong suốt, bộc phát sức mạnh xuyên thấu hộ giáp.',
    lore: 'Thân như lưu ly, nội ngoại thấu triệt, lực quán sơn hà toái thạch.',
    bodyColor: 'from-sky-500/50 via-blue-950/60 to-indigo-950/80',
    glowColor: 'rgba(14, 165, 233, 0.5)',
    baseStatsBonus: {
      hp: 15000,
      def: 950,
      atk: 650,
      critRate: 8,
      trueDmgPercent: 10
    },
    specialAbilityId: 'tinh_the_xuyen_giap',
    specialAbilityName: 'Xuyên Giáp Tinh Mang',
    specialAbilityDesc: 'Đòn đánh kèm 10% Sát thương chuẩn (True Damage) bỏ qua giáp phòng ngự.'
  },
  {
    id: 'van_tuong_luc',
    realmIndex: 4,
    name: 'Vạn Tượng Lực',
    maxStage: 9,
    description: 'Một cánh tay mang sức mạnh của vạn đầu thần tượng, xuất quyền xé rách cuồng phong, chấn động lục phủ ngũ tạng địch nhân.',
    lore: 'Cự tượng đạp đại địa, quyền phong toái hư không nứt nẻ.',
    bodyColor: 'from-orange-500/50 via-red-950/60 to-stone-950/80',
    glowColor: 'rgba(249, 115, 22, 0.55)',
    baseStatsBonus: {
      hp: 35000,
      def: 2100,
      atk: 1800,
      critRate: 12,
      critDmg: 25
    },
    specialAbilityId: 'chan_dong_bat_hoang',
    specialAbilityName: 'Vạn Tượng Chấn Động',
    specialAbilityDesc: 'Đòn bạo kích có 30% tỷ lệ làm đối thủ chấn động mất thăng bằng, tăng 25% sát thương bạo kích.'
  },
  {
    id: 'kim_cang_bat_hoai',
    realmIndex: 5,
    name: 'Kim Cang Bất Hoại',
    maxStage: 9,
    description: 'Thân thể đúc thành Kim Cang Bất Hoại Thân, đao thương bất nhập, thủy hỏa bất xâm, phản ngược sát thương cho kẻ tấn công.',
    lore: 'Phật môn Bồ Đề Kim Thân viễn cổ, vạn kiếp bất ma trường tồn.',
    bodyColor: 'from-yellow-400/60 via-amber-900/60 to-stone-950/80',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    baseStatsBonus: {
      hp: 80000,
      def: 4800,
      atk: 3500,
      damageReduction: 18,
      counterDmgPercent: 20
    },
    specialAbilityId: 'kim_cang_phan_chan',
    specialAbilityName: 'Kim Cang Phản Chấn',
    specialAbilityDesc: 'Miễn giảm 18% sát thương gánh chịu và phản trả 20% sát thương nhận vào cho đối thủ.'
  },
  {
    id: 'dao_the_so_thanh',
    realmIndex: 6,
    name: 'Đạo Thể Sơ Thành',
    maxStage: 9,
    description: 'Cơ thể hòa quyện với đại đạo quy tắc, hô hấp đồng điệu cùng thiên địa linh mạch, giảm tiêu hao Chân Nguyên.',
    lore: 'Thân quy đại đạo, vạn pháp tự nhiên quy tụ, tâm nhục hợp nhất.',
    bodyColor: 'from-emerald-400/60 via-teal-900/60 to-stone-950/80',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    baseStatsBonus: {
      hp: 180000,
      def: 10500,
      atk: 7800,
      damageReduction: 22,
      speed: 80
    },
    specialAbilityId: 'dao_the_tiet_khi',
    specialAbilityName: 'Hòa Hợp Đại Đạo',
    specialAbilityDesc: 'Giảm 25% tiêu hao Chân Nguyên khi thi triển Thần Thông, +80 Tốc độ thân pháp.'
  },
  {
    id: 'hu_khong_chi_than',
    realmIndex: 7,
    name: 'Hư Không Chi Thân',
    maxStage: 9,
    description: 'Thân xác nửa hư nửa thực, tan biến vào hư vô khi bị tấn công, né tránh đòn hiểm trong chớp mắt.',
    lore: 'Bộ nhập hư không, hành tẩu giữa kẽ nứt càn khôn vô ảnh vô tung.',
    bodyColor: 'from-purple-500/60 via-indigo-950/70 to-stone-950/80',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    baseStatsBonus: {
      hp: 420000,
      def: 24000,
      atk: 18000,
      speed: 200,
      critRate: 18
    },
    specialAbilityId: 'hu_khong_doat_menh',
    specialAbilityName: 'Hư Không Thiểm Dịch',
    specialAbilityDesc: 'Tăng 20% tỷ lệ né đòn hoàn toàn và tăng vọt +200 Thân pháp tốc độ.'
  },
  {
    id: 'thanh_the_vien_co',
    realmIndex: 8,
    name: 'Thánh Thể Viễn Cổ',
    maxStage: 9,
    description: 'Thức tỉnh huyết mạch Thái Cổ Thánh Thể, hoàng kim huyết khí xông thẳng cửu trùng thiên, khai mở Thánh Thể Giáng Lâm.',
    lore: 'Hoàng kim thánh huyết cuồn cuộn vạn dặm, chấn nhiếp chư thiên thần ma quy phục.',
    bodyColor: 'from-yellow-300/70 via-amber-600/60 to-red-950/80',
    glowColor: 'rgba(252, 211, 77, 0.75)',
    baseStatsBonus: {
      hp: 1000000,
      def: 55000,
      atk: 45000,
      critRate: 25,
      critDmg: 50,
      damageReduction: 30
    },
    specialAbilityId: 'thanh_the_giang_lam',
    specialAbilityName: 'Thánh Thể Giáng Lâm',
    specialAbilityDesc: 'Kích phát cuồng nộ: Tăng 40% toàn bộ sát thương gây ra và miễn nhiễm 30% sát thương gánh chịu.'
  },
  {
    id: 'bat_diet_tien_the',
    realmIndex: 9,
    name: 'Bất Diệt Tiên Thể',
    maxStage: 9,
    description: 'Đạt tới cực cảnh của nhục thân tu luyện, nhỏ một giọt máu cũng có thể tái sinh, thọ ngang nhật nguyệt, vĩnh hằng bất diệt.',
    lore: 'Nhục thân thành Thánh, siêu thoát tam giới, vạn kiếp bất tử bất diệt.',
    bodyColor: 'from-rose-400/70 via-purple-600/60 to-amber-400/80',
    glowColor: 'rgba(244, 63, 94, 0.85)',
    baseStatsBonus: {
      hp: 2800000,
      def: 140000,
      atk: 120000,
      critRate: 35,
      critDmg: 80,
      hpRegen: 8,
      damageReduction: 40,
      trueDmgPercent: 25
    },
    specialAbilityId: 'bat_diet_phuc_sinh',
    specialAbilityName: 'Niết Bàn Bất Tử',
    specialAbilityDesc: 'Khi nhận sát thương chí tử, lập tức hồi sinh với 50% Khí Huyết (1 lần mỗi trận đấu)!'
  }
];

// 2. 6 BỘ PHẬN CƯỜNG HÓA NHỤC THÂN (PHYSIQUE PARTS)
export interface PhysiquePartConfigTemplate {
  id: 'bi' | 'cot' | 'huyet' | 'kinh' | 'tang' | 'than';
  name: string;
  subtitle: string;
  maxLevel: number;
  statPerLevel: {
    hp?: number;
    def?: number;
    atk?: number;
    speed?: number;
    damageReduction?: number;
    trueDmgPercent?: number;
    hpRegen?: number;
  };
  baseCostLinhThach: number;
  costMultiplier: number;
  requiredMaterialId: string;
  requiredMaterialName: string;
  icon: string;
  description: string;
}

export const PHYSIQUE_PARTS_CONFIG: Record<string, PhysiquePartConfigTemplate> = {
  bi: {
    id: 'bi',
    name: 'Tôi Bì',
    subtitle: 'Luyện Da Đồng Vách Sắt',
    maxLevel: 50,
    statPerLevel: {
      def: 18,
      hp: 120,
      damageReduction: 0.2
    },
    baseCostLinhThach: 150,
    costMultiplier: 1.15,
    requiredMaterialId: 'tinhHuyet',
    requiredMaterialName: 'Tinh Huyết Yêu Thú',
    icon: '🛡️',
    description: 'Rèn luyện tầng biểu bì da thịt, tăng mạnh Phòng Ngự và Giảm Sát Thương nhận vào.'
  },
  cot: {
    id: 'cot',
    name: 'Đoán Cốt',
    subtitle: 'Đúc Rèn Ngọc Cốt Thần Tủy',
    maxLevel: 50,
    statPerLevel: {
      hp: 350,
      def: 25
    },
    baseCostLinhThach: 250,
    costMultiplier: 1.16,
    requiredMaterialId: 'hac_thiet_khoang',
    requiredMaterialName: 'Hắc Thiết Khoáng',
    icon: '🦴',
    description: 'Gọt giũa khung xương như ngọc thạch, nâng cao giới hạn Khí Huyết tối đa.'
  },
  huyet: {
    id: 'huyet',
    name: 'Hoán Huyết',
    subtitle: 'Thanh Lọc Huyết Khí Thuần Dương',
    maxLevel: 50,
    statPerLevel: {
      hp: 250,
      hpRegen: 0.15
    },
    baseCostLinhThach: 300,
    costMultiplier: 1.16,
    requiredMaterialId: 'huyet_tinh_thao',
    requiredMaterialName: 'Huyết Tinh Thảo',
    icon: '🩸',
    description: 'Thanh lọc tạp chất trong dòng máu, tăng khả năng Tự Hồi Phục Khí Huyết mỗi hiệp.'
  },
  kinh: {
    id: 'kinh',
    name: 'Thông Kinh',
    subtitle: 'Khai Mở Chu Thiên Bát Mạch',
    maxLevel: 50,
    statPerLevel: {
      speed: 6,
      hp: 150
    },
    baseCostLinhThach: 350,
    costMultiplier: 1.17,
    requiredMaterialId: 'tu_khi_hoa',
    requiredMaterialName: 'Tụ Khí Hoa',
    icon: '⚡',
    description: 'Khai thông 108 khiếu huyệt và kinh lạc, tăng vọt Thân Pháp Tốc Độ.'
  },
  tang: {
    id: 'tang',
    name: 'Luyện Tạng',
    subtitle: 'Nung Nấu Lục Phủ Ngũ Tạng',
    maxLevel: 50,
    statPerLevel: {
      hp: 450,
      def: 20
    },
    baseCostLinhThach: 450,
    costMultiplier: 1.18,
    requiredMaterialId: 'tay_tuy_linh_nhi',
    requiredMaterialName: 'Tẩy Tủy Linh Chi',
    icon: '🫀',
    description: 'Bồi bổ tâm can tỳ phế thận, tăng sinh lực kiên cố chống chịu công kích.'
  },
  than: {
    id: 'than',
    name: 'Ngưng Thần Thể',
    subtitle: 'Đồng Hóa Ý Chí Vào Thớ Thịt',
    maxLevel: 50,
    statPerLevel: {
      atk: 35,
      trueDmgPercent: 0.3
    },
    baseCostLinhThach: 600,
    costMultiplier: 1.20,
    requiredMaterialId: 'cuong_bao_hoa',
    requiredMaterialName: 'Cuồng Bạo Ma Hoa',
    icon: '🧠',
    description: 'Kết nối thần thức vào từng thớ cơ bắp, bộc phát Công Kích Vật Lý và Sát Thương Chuẩn.'
  }
};

// 3. EXP YÊU CẦU THEO CẢNH GIỚI VÀ TIỂU TẦNG
export const REALM_BASE_STAGE_EXP: Record<number, number> = {
  0: 100,    // Phàm Thai
  1: 300,    // Đồng Bì Thiết Cốt
  2: 800,    // Ngọc Nhũ Huyết
  3: 2000,   // Tinh Thể Chân Nhân
  4: 5000,   // Vạn Tượng Lực
  5: 12000,  // Kim Cang Bất Hoại
  6: 30000,  // Đạo Thể Sơ Thành
  7: 75000,  // Hư Không Chi Thân
  8: 180000, // Thánh Thể Viễn Cổ
  9: 450000  // Bất Diệt Tiên Thể
};

// 4. VẬT PHẨM CHUYÊN DỤNG CHO HUYỀN CÔNG LUYỆN THỂ
export const PHYSIQUE_ITEMS: Record<string, PhysiqueItemConfig> = {
  item_tinh_huyet: {
    id: 'tinhHuyet',
    name: 'Tinh Huyết Yêu Thú',
    type: 'exp',
    grade: 'Nhất Giai',
    expGain: 50,
    potentialGain: 2,
    description: 'Giọt máu tinh hoa của yêu thú sơ kỳ, dùng để tôi luyện da thịt và gân cốt.',
    icon: '🩸'
  },
  item_khi_huyet_dan: {
    id: 'pill_khi_huyet',
    name: 'Khí Huyết Đan',
    type: 'exp',
    grade: 'Nhị Giai',
    expGain: 250,
    potentialGain: 10,
    description: 'Đan dược bồi bổ khí huyết dồi dào, gia tăng đáng kể tiến độ Tôi Thể.',
    icon: '💊'
  },
  item_khi_huyet_dan_cuc_pham: {
    id: 'pill_khi_huyet_cuc_pham',
    name: 'Khí Huyết Đan Cực Phẩm',
    type: 'exp',
    grade: 'Tứ Giai',
    expGain: 1500,
    potentialGain: 50,
    description: 'Đan dược tinh luyện từ huyết tủy yêu thú ngàn năm, đại bổ nhục thân!',
    icon: '✨'
  },
  item_tay_tuy_dan: {
    id: 'pill_tay_tuy',
    name: 'Tẩy Tủy Đan',
    type: 'potential',
    grade: 'Tam Giai',
    potentialGain: 80,
    description: 'Tẩy trừ cặn bã trong kinh mạch, tăng mạnh Tiềm Năng Nhục Thân.',
    icon: '🧪'
  },
  item_pha_canh_dan_luyen_the: {
    id: 'item_pha_canh_dan_luyen_the',
    name: 'Phá Cảnh Đan Luyện Thể',
    type: 'breakthrough',
    grade: 'Ngũ Giai',
    description: 'Thần đan phá vỡ bình cảnh nhục thân, dùng khi đột phá đại cảnh giới Luyện Thể.',
    icon: '🌟'
  }
};

// 5. KHỞI TẠO STATE MẶC ĐỊNH CHO NHỤC THÂN
export const createDefaultPhysiqueParts = (): PhysiquePart[] => {
  return Object.values(PHYSIQUE_PARTS_CONFIG).map((cfg) => ({
    id: cfg.id,
    name: cfg.name,
    subtitle: cfg.subtitle,
    level: 0,
    maxLevel: cfg.maxLevel,
    statsBonus: {},
    upgradeResources: [
      {
        itemId: cfg.requiredMaterialId,
        name: cfg.requiredMaterialName,
        quantity: 1
      }
    ]
  }));
};

export const createDefaultPhysiqueState = (): PhysiqueState => {
  return {
    cultivation: {
      currentRealmId: 'pham_thai',
      currentStage: 1,
      currentExp: 0,
      expToNextStage: REALM_BASE_STAGE_EXP[0],
      physiquePotential: 100,
      maxPotential: 1000
    },
    parts: createDefaultPhysiqueParts(),
    passiveTickerTimestamp: Date.now()
  };
};

/**
 * 6. MA TRẬN RÀNG BUỘC CẢNH GIỚI NHỤC THÂN (REALM LOCK MATRIX)
 * Trả về Bậc Nhục Thân tối đa (1-10) mà tu sĩ có thể đột phá tương ứng với cảnh giới bản thể.
 * - Phàm Nhân (0) -> Tier 1 (Phàm Thai)
 * - Luyện Khí (1-10) -> Tier 2 (Đồng Bì Thiết Cốt)
 * - Trúc Cơ (11-15) -> Tier 3 (Ngọc Nhũ Huyết)
 * - Kim Đan (16-20) -> Tier 4 (Tinh Thể Chân Nhân)
 * - Nguyên Anh (21-25) -> Tier 5 (Vạn Tượng Lực)
 * - Hóa Thần (26-30) -> Tier 6 (Kim Cang Bất Hoại)
 * - Luyện Hư (31-35) -> Tier 7 (Đạo Thể Sơ Thành)
 * - Hợp Thể (36-40) -> Tier 8 (Hư Không Chi Thân)
 * - Đại Thừa - Độ Kiếp (41-50) -> Tier 9 (Thánh Thể Viễn Cổ)
 * - Tiên Giới - Đế Cảnh (51-104) -> Tier 10 (Bất Diệt Tiên Thể)
 */
export function getMaxPhysiqueTierForRealm(cultivationRealmIndex: number = 0): number {
  if (cultivationRealmIndex <= 0) return 1;
  if (cultivationRealmIndex <= 10) return 2;
  if (cultivationRealmIndex <= 15) return 3;
  if (cultivationRealmIndex <= 20) return 4;
  if (cultivationRealmIndex <= 25) return 5;
  if (cultivationRealmIndex <= 30) return 6;
  if (cultivationRealmIndex <= 35) return 7;
  if (cultivationRealmIndex <= 40) return 8;
  if (cultivationRealmIndex <= 50) return 9;
  return 10;
}

/**
 * Trả về tên Đại Cảnh Giới Khí Tu yêu cầu để mở khóa Bậc Nhục Thân tương ứng.
 */
export function getRequiredRealmNameForPhysiqueTier(targetPhysiqueTier: number): string {
  switch (targetPhysiqueTier) {
    case 1: return 'Phàm Nhân';
    case 2: return 'Luyện Khí';
    case 3: return 'Trúc Cơ';
    case 4: return 'Kim Đan';
    case 5: return 'Nguyên Anh';
    case 6: return 'Hóa Thần';
    case 7: return 'Luyện Hư';
    case 8: return 'Hợp Thể';
    case 9: return 'Đại Thừa';
    case 10: return 'Tiên Giới';
    default: return 'Tiên Giới';
  }
}

