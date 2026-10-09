// lib/offspring-data.ts
// Dữ liệu Đan Dược Dưỡng Thai, Công thức Lai Tạo Linh Căn Dị Biến, Thiên Phú Thần Thông & Phả Hệ Tiên Đồng

import type {
  GestationPillEffect,
  OffspringSpiritualRoot,
  OffspringInnateTalent,
  OffspringStage
} from './types/offspring';

// ─── 1. Đan Dược Dưỡng Thai & Nghi Thức Hoài Thai ─────────────────────────────

export const GESTATION_TOTAL_DURATION_MS = 48 * 60 * 60 * 1000; // 48 giờ thực tế
export const CONCEPTION_COST_LINH_THACH = 50000;
export const CONCEPTION_REQUIRED_REALM = 21; // Nguyên Anh sơ kỳ trở lên
export const CONCEPTION_REQUIRED_AFFINITY = 100; // Sinh Tử Bất Ly
export const NATURAL_CONCEPTION_CHANCE = 0.10; // 10% tỷ lệ hoài thai tự nhiên mỗi lần Song Tu khi đủ điều kiện

export const GESTATION_PILLS: Record<string, GestationPillEffect> = {
  pill_linh_thai_tao_hoa: {
    id: 'pill_linh_thai_tao_hoa',
    name: 'Linh Thai Tạo Hóa Đan',
    price: 50000,
    type: 'conception',
    description: 'Thần đan nghịch chuyển âm dương, kích phát tiên duyên ngưng tụ Linh Thai giữa hai vị đại năng.',
  },
  pill_cuu_chuyen_duc_anh: {
    id: 'pill_cuu_chuyen_duc_anh',
    name: 'Cửu Chuyển Dục Anh Đan',
    price: 35000,
    type: 'root_quality',
    guaranteedGrade: 'cuc',
    talentBonus: 25,
    description: 'Bồi đắp căn nguyên tiên thiên cho linh thai, đảm bảo sinh ra đạt Cực Phẩm hoặc Thiên Phẩm Linh Căn.',
  },
  pill_bo_thien_hoan_tuyen: {
    id: 'pill_bo_thien_hoan_tuyen',
    name: 'Bổ Thiên Chi Thủy',
    price: 30000,
    type: 'progress_boost',
    progressReductionHours: 12,
    description: 'Dung dịch sinh mệnh chi nguyên, rút ngắn 12 giờ quá trình hoài thai và tẩy trừ tạp chất.',
  },
  pill_tien_thien_khi_linh: {
    id: 'pill_tien_thien_khi_linh',
    name: 'Tiên Thiên Khí Linh Tinh Hoa',
    price: 40000,
    type: 'stat_boost',
    talentBonus: 30,
    description: 'Khai mở trí tuệ thần hồn cho thai nhi từ trong trứng nước, gia tăng 30% chiến lực bẩm sinh.',
  },
};

// ─── 2. Công Thức Lai Tạo Linh Căn Dị Biến & Hỗn Độn ─────────────────────────

export interface RootCombinationRule {
  fatherElements: string[];
  motherElements: string[];
  mutationResult: {
    type: 'ngu_hanh' | 'di_bien' | 'hon_don';
    elementName: string;
    description: string;
    damageBonusPercent: number;
    grade: 'ha' | 'trung' | 'thuong' | 'cuc' | 'than';
  };
  mutationRate: number; // 0.0 -> 1.0
}

export const ROOT_COMBINATION_RULES: RootCombinationRule[] = [
  // Hỏa + Thủy -> Dị Biến Lôi Linh Căn hoặc Hỗn Độn
  {
    fatherElements: ['hoa', 'thuy'],
    motherElements: ['thuy', 'hoa'],
    mutationResult: {
      type: 'di_bien',
      elementName: 'Cửu Tiêu Lôi Linh Căn',
      description: 'Âm Dương xung khắc sinh sấm sét nghịch thiên, công kích mang lôi kiếp xé rách vạn vật.',
      damageBonusPercent: 28,
      grade: 'cuc',
    },
    mutationRate: 0.35,
  },
  // Kim + Thủy -> Băng Linh Căn
  {
    fatherElements: ['kim', 'thuy'],
    motherElements: ['thuy', 'kim'],
    mutationResult: {
      type: 'di_bien',
      elementName: 'Huyền Minh Băng Linh Căn',
      description: 'Hàn khí thấu xương, kết tinh từ kiếm khí sắc bén và nhu thủy chí hàn.',
      damageBonusPercent: 25,
      grade: 'thuong',
    },
    mutationRate: 0.45,
  },
  // Hỏa + Lôi -> Cửu Tiêu Thần Lôi
  {
    fatherElements: ['hoa', 'loi'],
    motherElements: ['loi', 'hoa'],
    mutationResult: {
      type: 'di_bien',
      elementName: 'Thiên Hỏa Thần Lôi Linh Căn',
      description: 'Sự cuồng bạo tột cùng kết hợp giữa hỏa diễm bạt thiên và lôi đình vạn trượng.',
      damageBonusPercent: 32,
      grade: 'cuc',
    },
    mutationRate: 0.40,
  },
  // Kim + Lôi -> Cực Quang Linh Căn
  {
    fatherElements: ['kim', 'loi'],
    motherElements: ['loi', 'kim'],
    mutationResult: {
      type: 'di_bien',
      elementName: 'Thái Hư Cực Quang Linh Căn',
      description: 'Ánh sáng cực quang xé rách hư không, tốc độ và lực xuyên giáp tuyệt đối.',
      damageBonusPercent: 30,
      grade: 'cuc',
    },
    mutationRate: 0.35,
  },
  // Thổ + Mộc -> Huyền Hoàng Địa Linh Căn
  {
    fatherElements: ['tho', 'moc'],
    motherElements: ['moc', 'tho'],
    mutationResult: {
      type: 'di_bien',
      elementName: 'Huyền Hoàng Sinh Linh Căn',
      description: 'Sinh sôi bất diệt, dung hợp đất mẹ dày đặc và mộc linh trường sinh.',
      damageBonusPercent: 22,
      grade: 'thuong',
    },
    mutationRate: 0.40,
  },
];

export const CHAOS_ROOT_DEFINITION: OffspringSpiritualRoot = {
  type: 'hon_don',
  elementName: 'Vạn Cổ Hỗn Độn Linh Căn',
  grade: 'than',
  description: 'Thần thể hỗn độn sinh ra từ thuở hồng hoang, dung hợp vạn đạo quy nhất, áp chế chư thiên ngũ hành!',
  damageBonusPercent: 45,
};

// ─── 3. Danh Mục Thiên Phú Thần Thông Bẩm Sinh ───────────────────────────────

export const INNATE_TALENTS_POOL: OffspringInnateTalent[] = [
  {
    name: 'Hỗn Độn Kiếm Ý',
    description: 'Sinh ra đã mang kiếm tâm thuần khiết, kiếm quang xuất ra tự động phá hộ thể chân khí.',
    statModifiers: { atkPercent: 22, critDmg: 20, speed: 10 },
  },
  {
    name: 'Băng Phách Huyền Tâm',
    description: 'Thần hồn lãnh triệt như băng tuyết ngàn năm, miễn nhiễm tâm ma và phản chấn thương tích.',
    statModifiers: { defPercent: 20, speed: 15, hpPercent: 15 },
  },
  {
    name: 'Thái Cực Bất Diệt',
    description: 'Âm dương song toàn, sinh sinh bất tức, hồi phục sinh lực và củng cố căn cơ thâm hậu.',
    statModifiers: { hpPercent: 30, defPercent: 20 },
  },
  {
    name: 'Cửu U Ma Đồng',
    description: 'Đồng tử dị sắc nhìn thấu nhược điểm địch nhân, bạo kích cuồng bạo chí mạng.',
    statModifiers: { atkPercent: 25, critRate: 15, critDmg: 25 },
  },
  {
    name: 'Thiên Khí Quy Nguyên',
    description: 'Hấp thụ linh khí nhật nguyệt từ bé, mọi chỉ số đều được thiên đạo gia trì.',
    statModifiers: { atkPercent: 15, defPercent: 15, speed: 15, hpPercent: 15 },
  },
  {
    name: 'Chu Tước Huyết Thần',
    description: 'Kế thừa hỏa diễm bất tử của Thần Cầm Chu Tước, tốc độ và hỏa lực vô song.',
    statModifiers: { atkPercent: 20, speed: 25, critRate: 12 },
  },
  {
    name: 'Huyền Vũ Hộ Thể',
    description: 'Mang huyết mạch Thần Thú trấn thủ Bắc Minh, phòng ngự vững như bàn thạch.',
    statModifiers: { defPercent: 35, hpPercent: 25 },
  },
  {
    name: 'Thanh Long Đao Phách',
    description: 'Huyết khí sôi trào như rồng thiêng vẫy vùng, trảm phá vạn pháp cản đường.',
    statModifiers: { atkPercent: 24, critRate: 14, speed: 12 },
  },
];

// ─── 4. Danh Sách Tên Cổ Phong Cho Tiên Đồng ─────────────────────────────────

export const FATHER_SURNAMES = ['Lý', 'Diệp', 'Tiêu', 'Lâm', 'Sở', 'Trần', 'Cố', 'Thẩm', 'Lăng', 'Bạch', 'Tần', 'Cơ'];

export const MALE_NAMES = [
  'Trường Phong',
  'Triều Ca',
  'Vũ Thần',
  'Minh Dạ',
  'Thiên Tầm',
  'Bắc Thần',
  'Huyền Diệp',
  'Tinh Lạc',
  'Tử Tiêu',
  'Vô Trần',
  'Huyền Tông',
  'Cảnh Diễm',
];

export const FEMALE_NAMES = [
  'Tuyết Nhi',
  'Linh Tê',
  'Tử Yên',
  'Vân Hi',
  'Nhược Lam',
  'Thanh Hà',
  'Dao Trì',
  'Tố Linh',
  'Cửu Ca',
  'Nguyệt Thiền',
  'Như Ngọc',
  'Tố Tâm',
];

// ─── 5. Cảnh Giới & Giai Đoạn Trưởng Thành ────────────────────────────────────

export interface OffspringStageConfig {
  stage: OffspringStage;
  name: string;
  ageRange: string;
  description: string;
  abodeBuffs: {
    herbSpeedBonusPercent: number;
    abodeReikiBonus: number;
  };
  canCombat: boolean;
}

export const STAGE_CONFIGS: Record<OffspringStage, OffspringStageConfig> = {
  infant: {
    stage: 'infant',
    name: 'Linh Thai Sơ Sinh',
    ageRange: '0 - 3 Tuổi',
    description: 'Hài nhi nằm trong nôi tiên động phủ, hấp thu linh khí thiên địa, trợ giúp linh điền đâm chồi nảy lộc.',
    abodeBuffs: {
      herbSpeedBonusPercent: 10,
      abodeReikiBonus: 15,
    },
    canCombat: false,
  },
  child: {
    stage: 'child',
    name: 'Tiên Đồng Tập Khí',
    ageRange: '3 - 16 Tuổi',
    description: 'Bắt đầu đả tọa ngưng tụ khí hải, được phụ mẫu chỉ điểm truyền thụ tiên pháp, bước chân vào Luyện Khí kỳ.',
    abodeBuffs: {
      herbSpeedBonusPercent: 15,
      abodeReikiBonus: 25,
    },
    canCombat: false,
  },
  adult: {
    stage: 'adult',
    name: 'Đạo Tử Xuất Sư',
    ageRange: '16+ Tuổi',
    description: 'Ngưng kết Kim Đan thành công, phong hoa tuyệt đại, chính thức xuất sư trợ chiến phụ mẫu, kích hoạt Huyết Mạch Thần Uy!',
    abodeBuffs: {
      herbSpeedBonusPercent: 20,
      abodeReikiBonus: 40,
    },
    canCombat: true,
  },
};
