// lib/custom-sect-data.ts
// Dữ liệu & Cấu hình cho Phân Hệ "Khai Tông Lập Phái & Chân Truyền Đệ Tử"

import { SectDoctrine, DiscipleRank, DiscipleTaskType } from '@/lib/types/custom-sect';

export interface DoctrineConfig {
  id: SectDoctrine;
  name: string;
  badge: string;
  icon: string;
  description: string;
  lore: string;
  bonuses: {
    discipleTuViSpeedPercent?: number;
    reputationGainPercent?: number;
    betrayalRiskReductionPercent?: number;
    resourceYieldPercent?: number;
    atkBonusPercent?: number;
    critRateBonusPercent?: number;
    herbYieldPercent?: number;
    guardianArrayBonusPercent?: number;
    incidentRiskReductionPercent?: number;
  };
}

export const SECT_DOCTRINES_CONFIG: Record<SectDoctrine, DoctrineConfig> = {
  chinh_dao: {
    id: 'chinh_dao',
    name: 'Chính Đạo Huyền Môn',
    badge: 'Chính Khí Trường Tồn',
    icon: '☯️',
    description: 'Tôn sùng đại đạo tự nhiên, chính khí quang minh, bồi dưỡng tâm tính đệ tử kiên định.',
    lore: 'Lấy thanh quy giới luật làm gốc, vạn linh kính ngưỡng, chính khí ngút trời.',
    bonuses: {
      discipleTuViSpeedPercent: 20,
      reputationGainPercent: 15,
      betrayalRiskReductionPercent: 50,
    }
  },
  ma_dao: {
    id: 'ma_dao',
    name: 'Ma Đạo Cực Lạc',
    badge: 'Huyết Sát Vô Biên',
    icon: '🩸',
    description: 'Bất chấp luân thường, lấy mạnh hiếp yếu, cướp đoạt tinh hoa thiên địa làm của riêng.',
    lore: 'Cá lớn nuốt cá bé, chỉ có lực lượng tối thượng mới là chân lý vĩnh hằng.',
    bonuses: {
      resourceYieldPercent: 30,
      atkBonusPercent: 10,
    }
  },
  kiem_tong: {
    id: 'kiem_tong',
    name: 'Vạn Kiếm Quy Tông',
    badge: 'Nhất Kiếm Phá Vạn Pháp',
    icon: '⚔️',
    description: 'Chuyên tu kiếm đạo, dĩ kiếm nhập đạo, môn hạ sát phạt vô song kinh thiên động địa.',
    lore: 'Trời không sinh ta Diệp Kiếm Tiên, kiếm đạo vạn cổ như đêm dài.',
    bonuses: {
      atkBonusPercent: 15,
      critRateBonusPercent: 10,
    }
  },
  dan_lo: {
    id: 'dan_lo',
    name: 'Đan Đạo Dược Tông',
    badge: 'Đan Hương Phiêu Diểu',
    icon: '🌿',
    description: 'Lấy đan lập phái, thông tường thảo mộc, linh dược đan hoàn cung cấp vô tận.',
    lore: 'Một viên kim đan nuốt vào bụng, mới biết tính mệnh chẳng do trời.',
    bonuses: {
      herbYieldPercent: 35,
      resourceYieldPercent: 15,
    }
  },
  tran_dao: {
    id: 'tran_dao',
    name: 'Bát Quái Trận Tông',
    badge: 'Kỳ Môn Độn Giáp',
    icon: '🛡️',
    description: 'Hòa quyện thiên địa trận pháp, thủ hộ sơn môn kiên cố vững như bàn thạch.',
    lore: 'Tung hoành vạn dặm trận đồ, dời non lấp biển chỉ trong một cái phất tay.',
    bonuses: {
      guardianArrayBonusPercent: 50,
      incidentRiskReductionPercent: 80,
    }
  }
};

export interface SacredMountain {
  id: string;
  name: string;
  title: string;
  aura: string;
  description: string;
  naturalBonus: string;
  baseLinhKhi: number;
}

export const SACRED_MOUNTAINS_POOL: SacredMountain[] = [
  {
    id: 'mountain_thanh_van',
    name: 'Thanh Vân Sơn',
    title: 'Đệ Nhất Tiên Sơn',
    aura: 'emerald',
    description: 'Đỉnh núi quanh năm mây xanh bao phủ, linh khí tụ thành dòng suối ngọc, linh điền màu mỡ bậc nhất phương đông.',
    naturalBonus: '+15% Tốc độ sinh trưởng thảo mộc',
    baseLinhKhi: 85
  },
  {
    id: 'mountain_cuu_tieu',
    name: 'Cửu Tiêu Kiếm Phong',
    title: 'Thiên Ngoại Cô Kiếm',
    aura: 'cyan',
    description: 'Ngọn núi sừng sững như cự kiếm cắm thẳng vào cửu thiên, kiếm khí bẩm sinh vờn quanh vách đá.',
    naturalBonus: '+10% Lực chiến đệ tử môn hạ',
    baseLinhKhi: 90
  },
  {
    id: 'mountain_huyet_ma',
    name: 'Huyết Ma Lĩnh',
    title: 'Thái Cổ Ma Vực',
    aura: 'crimson',
    description: 'Dãy núi đá đen nhuốm máu thượng cổ, âm sát cuồn cuộn, nơi ngưng tụ chân nguyên ma đạo cực thịnh.',
    naturalBonus: '+20% Sản lượng khai thác mỏ khoáng',
    baseLinhKhi: 80
  },
  {
    id: 'mountain_thai_hu',
    name: 'Thái Hư Nhai',
    title: 'Hư Không Vấn Đạo',
    aura: 'purple',
    description: 'Vách đá lơ lửng giữa biển mây hư không, đạo vận mờ ảo, nơi các bậc đại năng xưa thường bế quan ngộ đạo.',
    naturalBonus: '+15% Tốc độ ngộ tính đệ tử',
    baseLinhKhi: 92
  },
  {
    id: 'mountain_bat_quai',
    name: 'Bát Quái Đảo',
    title: 'Kỳ Môn Thần Địa',
    aura: 'amber',
    description: 'Hòn đảo giữa hồ linh tuyền hình bát quái tự nhiên, thiên địa kỳ môn quy tụ, phòng ngự bất khả xâm phạm.',
    naturalBonus: '+25% Độ bền Hộ Sơn Trận',
    baseLinhKhi: 88
  },
  {
    id: 'mountain_thien_hoa',
    name: 'Thiên Hỏa Lôi Lĩnh',
    title: 'Cửu Lôi Viêm Sơn',
    aura: 'orange',
    description: 'Lôi hỏa giao thoa, địa hỏa sôi trào ngàn năm, là thánh địa rèn đúc pháp bảo và đan dược cực phẩm.',
    naturalBonus: '+15% Tỷ lệ chế tác đan bảo',
    baseLinhKhi: 86
  },
  {
    id: 'mountain_u_minh',
    name: 'U Minh Cốc',
    title: 'U U Hắc Lĩnh',
    aura: 'slate',
    description: 'Hẻm núi u tịch ngập tràn kỳ hoa dị thảo chỉ nở trong bóng tối, linh hồn thanh tịnh khó bị tâm ma quấy nhiễu.',
    naturalBonus: '+10% Giảm nguy cơ phản bội',
    baseLinhKhi: 82
  },
  {
    id: 'mountain_bong_lai',
    name: 'Bồng Lai Tiên Đảo',
    title: 'Hải Thượng Tiên Sơn',
    aura: 'gold',
    description: 'Tiên sơn ngoài biển đông với hạc trắng bay rợp trời, trường sinh bất tử khí thấm đượm từng nhành cây ngọn cỏ.',
    naturalBonus: '+10 năm Thọ nguyên khởi điểm đệ tử',
    baseLinhKhi: 95
  }
];

export const DISCIPLE_SURNAMES = [
  'Diệp', 'Tiêu', 'Sở', 'Lâm', 'Nam Cung', 'Mộ Dung', 'Lục', 'Trần', 'Vương', 'Lý',
  'Hoàng', 'Vũ', 'Tống', 'Tạ', 'Liễu', 'Bạch', 'Khương', 'Doãn', 'Thẩm', 'Tần',
  'Chu', 'Hàn', 'Cố', 'Phùng', 'Trình', 'Kỷ', 'Đông Phương', 'Tư Mã', 'Gia Cát', 'Hề'
];

export const DISCIPLE_GIVEN_NAMES_MALE = [
  'Vô Nhai', 'Trần Hiên', 'Thiên Hành', 'Cửu Châu', 'Nhất Kiếm', 'Mặc Ngôn', 'Tử Dật', 'Hạo Nhiên',
  'Phong Miên', 'Huyền Chân', 'Vấn Thiên', 'Tầm Đạo', 'Bá Thiên', 'Lạc Thần', 'Thanh Tiêu', 'Ngự Phong',
  'Dật Phàm', 'Minh Viễn', 'Tinh Thần', 'Duệ Phong', 'Vân Đình', 'Nguyên Khang', 'Bắc Thần', 'Thiên Ân',
  'Trọng Lăng', 'Cảnh Diễm', 'Bách Xuyên', 'Lâm Phong', 'Trường An', 'Thương Lãng', 'Huyền Dạ', 'Trọng Hoa',
  'Nhược Hư', 'Phá Quân', 'Kình Thiên', 'Tử Mặc', 'Kỳ Phong', 'Cửu Tiêu', 'Thanh Lôi', 'Dực Phi',
  'Văn Kiếm', 'Khải Phong', 'Tử Hiên', 'Tuấn Khiết', 'Nhất Trần', 'Thanh Lương', 'Hạo Thiên', 'Thụy Phong',
  'Đức Khang', 'Vô Vọng'
];

export const DISCIPLE_GIVEN_NAMES_FEMALE = [
  'Thanh Tuyết', 'Linh Lung', 'Vân Hi', 'Nguyệt Thiền', 'Mộng Dao', 'Hàm Hương', 'Y Tuyết', 'Dao Quang',
  'Thi Ngữ', 'Tố Nguyệt', 'Chỉ Nhi', 'Nhược Lan', 'Tử Yên', 'Uyển Nhi', 'Thu Thủy', 'Băng Ngưng',
  'Yên Nhiên', 'Sở San', 'Lạc Tình', 'Tuệ Tâm', 'Cẩm Tú', 'Lục Bình', 'Tâm Di', 'Phương Hoa',
  'Họa Mi', 'Bạch Chỉ', 'Thải Điệp', 'Tuyết Mai', 'Như Yên', 'Bảo Hân', 'Mộng Đình', 'Tố Vân',
  'Lãnh Nguyệt', 'Vân Thiền', 'Diệp Lạc', 'Khánh Lam', 'Ngọc Trúc', 'Huyền Cơ', 'Thanh Thảo', 'Trúc Dao',
  'Lục Hà', 'Thanh Vân', 'Hàm Tiếu', 'Minh Nguyệt', 'Tử Huyên', 'Mộc Lam', 'Thủy Trúc', 'Huyền Nguyệt',
  'Tiên Dung', 'Phương Thảo'
];

export interface DiscipleTrait {
  id: string;
  name: string;
  icon: string;
  description: string;
  bonusType: 'work' | 'combat' | 'herb' | 'mine' | 'loyalty' | 'growth' | 'safety';
  value: number; // Tỷ lệ %
}

export const DISCIPLE_TRAITS_CONFIG: Record<string, DiscipleTrait> = {
  can_cu: {
    id: 'can_cu',
    name: 'Cần Cù',
    icon: '🔨',
    description: 'Chăm chỉ chuyên cần, tăng +20% hiệu suất khi được phân công làm việc.',
    bonusType: 'work',
    value: 20
  },
  hieu_chien: {
    id: 'hieu_chien',
    name: 'Hiếu Chiến',
    icon: '⚔️',
    description: 'Bản tính cuồng chiến, tăng +25% lực chiến khi thám hiểm bí cảnh dã ngoại.',
    bonusType: 'combat',
    value: 25
  },
  dan_si: {
    id: 'dan_si',
    name: 'Đan Si',
    icon: '🌿',
    description: 'Say mê thảo mộc, tăng +30% sản lượng khi chăm sóc Dược Viên.',
    bonusType: 'herb',
    value: 30
  },
  khoang_si: {
    id: 'khoang_si',
    name: 'Thiết Cốt',
    icon: '⛏️',
    description: 'Nhục thân dẻo dai, tăng +30% sản lượng khi khai thác mỏ khoáng.',
    bonusType: 'mine',
    value: 30
  },
  trung_thanh: {
    id: 'trung_thanh',
    name: 'Trung Trinh',
    icon: '🛡️',
    description: 'Lòng trung thành vững bền, không bao giờ phản trắc rời bỏ sơn môn.',
    bonusType: 'loyalty',
    value: 30
  },
  thien_kieu: {
    id: 'thien_kieu',
    name: 'Thiên Kiêu',
    icon: '⭐',
    description: 'Ngộ tính siêu phàm, cần ít hơn 25% tu vi khi được Chưởng Môn chỉ điểm đột phá.',
    bonusType: 'growth',
    value: 25
  },
  can_than: {
    id: 'can_than',
    name: 'Cẩn Mật',
    icon: '🕊️',
    description: 'Cẩn trọng chu toàn, giảm 60% nguy cơ gặp tai nạn thương tích khi thám hiểm.',
    bonusType: 'safety',
    value: 60
  },
  phong_luu: {
    id: 'phong_luu',
    name: 'Tiêu Sái',
    icon: '🍶',
    description: 'Phong lưu tiêu sái, tăng 10 điểm danh vọng môn phái khi hoàn thành nhiệm vụ tuần sơn.',
    bonusType: 'work',
    value: 10
  }
};

export interface FacilityUpgradeStep {
  level: number;
  name: string;
  costLinhThach: number;
  requiredMainHallLevel?: number;
  effectDescription: string;
  capacity?: number;
  hourlyYield?: number;
  maxDurability?: number;
}

export const FACILITY_UPGRADE_CONFIG = {
  mainHall: [
    { level: 1, name: 'Sơn Môn Trúc Lộ', costLinhThach: 0, effectDescription: 'Sức chứa tối đa 6 đệ tử', capacity: 6 },
    { level: 2, name: 'Chính Điện Mộc Linh', costLinhThach: 25000, effectDescription: 'Sức chứa tối đa 10 đệ tử', capacity: 10 },
    { level: 3, name: 'Tử Vân Bảo Điện', costLinhThach: 60000, effectDescription: 'Sức chứa tối đa 15 đệ tử', capacity: 15 },
    { level: 4, name: 'Thái Hư Ngọc Điện', costLinhThach: 150000, effectDescription: 'Sức chứa tối đa 22 đệ tử', capacity: 22 },
    { level: 5, name: 'Hỗn Độn Tiên Cung', costLinhThach: 350000, effectDescription: 'Sức chứa tối đa 30 đệ tử', capacity: 30 }
  ],
  herbGarden: [
    { level: 1, name: 'Linh Dược Viện Nhỏ', costLinhThach: 10000, effectDescription: 'Sản lượng 3 thảo dược / giờ', hourlyYield: 3 },
    { level: 2, name: 'Bách Thảo Phong', costLinhThach: 30000, effectDescription: 'Sản lượng 6 thảo dược / giờ', hourlyYield: 6 },
    { level: 3, name: 'Dược Vương Thung Lũng', costLinhThach: 80000, effectDescription: 'Sản lượng 12 thảo dược / giờ', hourlyYield: 12 },
    { level: 4, name: 'Tiên Thiên Dược Cảnh', costLinhThach: 180000, effectDescription: 'Sản lượng 20 thảo dược / giờ', hourlyYield: 20 },
    { level: 5, name: 'Tạo Hóa Thần Viên', costLinhThach: 400000, effectDescription: 'Sản lượng 32 thảo dược / giờ', hourlyYield: 32 }
  ],
  mineralVein: [
    { level: 1, name: 'Hắc Thiết Mỏ Sơ', costLinhThach: 10000, effectDescription: '150 Linh Thạch & 1 Quặng / giờ', hourlyYield: 150 },
    { level: 2, name: 'Bạch Ngân Khoáng Nhai', costLinhThach: 30000, effectDescription: '400 Linh Thạch & 2 Quặng / giờ', hourlyYield: 400 },
    { level: 3, name: 'Tử Tinh Linh Mạch', costLinhThach: 80000, effectDescription: '900 Linh Thạch & 4 Quặng / giờ', hourlyYield: 900 },
    { level: 4, name: 'Huyền Thiết Thần Mạch', costLinhThach: 180000, effectDescription: '1,800 Linh Thạch & 7 Quặng / giờ', hourlyYield: 1800 },
    { level: 5, name: 'Tiên Tinh Địa Mạch', costLinhThach: 400000, effectDescription: '3,500 Linh Thạch & 12 Quặng / giờ', hourlyYield: 3500 }
  ],
  guardianArray: [
    { level: 1, name: 'Tứ Tượng Hộ Thân Trận', costLinhThach: 15000, effectDescription: 'Độ bền 1,500 điểm', maxDurability: 1500 },
    { level: 2, name: 'Bát Quái Phong Ma Trận', costLinhThach: 45000, effectDescription: 'Độ bền 4,000 điểm', maxDurability: 4000 },
    { level: 3, name: 'Thập Tuyệt Tru Tiên Trận', costLinhThach: 100000, effectDescription: 'Độ bền 9,000 điểm', maxDurability: 9000 },
    { level: 4, name: 'Chu Thiên Tinh Đấu Trận', costLinhThach: 220000, effectDescription: 'Độ bền 18,000 điểm', maxDurability: 18000 },
    { level: 5, name: 'Hỗn Độn Vô Cực Trận', costLinhThach: 500000, effectDescription: 'Độ bền 35,000 điểm', maxDurability: 35000 }
  ]
};

export const DISCIPLE_TASKS_CONFIG: Record<DiscipleTaskType, { name: string; icon: string; description: string; durationHours?: number }> = {
  idle: {
    name: 'Bế Quan Tu Hành',
    icon: '🧘',
    description: 'Đệ tử tự mình thổ nạp linh khí trong tịnh thất môn phái, chậm rãi tích lũy tu vi.'
  },
  tend_garden: {
    name: 'Trồng Trọt Dược Viên',
    icon: '🌿',
    description: 'Chăm sóc linh điền thảo mộc, bồi dưỡng linh dược cống nộp vào Khố Phòng Tông Môn.'
  },
  mine_ores: {
    name: 'Khai Thác Mỏ Khoáng',
    icon: '⛏️',
    description: 'Khai quật linh thạch và quặng khoáng sản quý hiếm từ linh mạch dưới chân núi.'
  },
  guard_gate: {
    name: 'Tuần Sơn Hộ Vệ',
    icon: '🛡️',
    description: 'Trấn thủ sơn môn, gia cố kết giới đại trận và xua đuổi yêu thú quấy nhiễu.'
  },
  explore_realm: {
    name: 'Lịch Luyện Bí Cảnh',
    icon: '🗺️',
    description: 'Tổ đội thám hiểm di tích cổ phương xa trong 4 giờ, mang về kỳ trân dị bảo.',
    durationHours: 4
  }
};
