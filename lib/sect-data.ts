// lib/sect-data.ts
// Dữ liệu Hệ Thống Tông Môn: 3 Đại Tông Môn Thượng Cổ, Bậc Thang Địa Vị 6 Cấp, Lương Bổng, Nhiệm Vụ, Tàng Kinh Các & Luận Kiếm

import {
  SectProfile,
  SectData,
  SectId,
  SectRank,
  SectRankDetail,
  SectQuest,
  SectShopItem,
  SectState,
  SectArenaFighter,
  PlayerStats,
  SpiritVein,
  SpiritVeinType,
  SectGuardianArray,
  SectTier
} from '@/lib/types';
import { calculateCombatStats } from '@/lib/destiny-data';
import { getElementalCombatModifier } from '@/lib/elemental-system';

// ============================================
// 1. CẤU HÌNH 6 BẬC THANG ĐỊA VỊ TÔNG MÔN
// ============================================
export const SECT_RANKS_CONFIG: Record<SectRank, SectRankDetail> = {
  tap_dich: {
    rank: 'tap_dich',
    title: 'Tạp Dịch Đệ Tử',
    requiredContribution: 0,
    requiredRealm: 0,
    realmName: 'Phàm Nhân',
    dailySalary: {
      linhThach: 150,
      tuVi: 100
    },
    privileges: [
      'Nhập môn tu hành, dọn dẹp linh tuyền',
      'Làm nhiệm vụ tạp vụ sơn môn hằng ngày',
      'Lãnh bổng lộc hằng ngày'
    ]
  },
  ngoai_mon: {
    rank: 'ngoai_mon',
    title: 'Ngoại Môn Đệ Tử',
    requiredContribution: 500,
    requiredRealm: 3,
    realmName: 'Luyện Khí Tầng 3',
    dailySalary: {
      linhThach: 400,
      tuVi: 300
    },
    privileges: [
      'Mở khóa Tàng Kinh Các Tầng 1',
      'Tuần tra hộ sơn đại trận',
      'Đổi đan dược, tinh huyết cơ bản'
    ]
  },
  noi_mon: {
    rank: 'noi_mon',
    title: 'Nội Môn Đệ Tử',
    requiredContribution: 2000,
    requiredRealm: 10,
    realmName: 'Trúc Cơ Sơ Kỳ',
    dailySalary: {
      linhThach: 1000,
      tuVi: 800,
      tinhHuyet: 1
    },
    privileges: [
      'Mở khóa Tàng Kinh Các Tầng 2',
      'Quyền tham gia Luận Kiếm Sơn Môn Đấu Pháp',
      'Đổi đan phương ngũ phẩm độc quyền'
    ]
  },
  chan_truyen: {
    rank: 'chan_truyen',
    title: 'Chân Truyền Đệ Tử',
    requiredContribution: 6000,
    requiredRealm: 20,
    realmName: 'Kim Đan Sơ Kỳ',
    dailySalary: {
      linhThach: 2500,
      tuVi: 2000,
      tinhHuyet: 2
    },
    privileges: [
      'Mở khóa Công Pháp Trấn Phái Thiên Giai',
      'Được Chưởng Môn truyền thụ tuyệt học',
      'Lãnh bổng lộc Tinh Huyết cao cấp'
    ]
  },
  truong_lao: {
    rank: 'truong_lao',
    title: 'Hộ Pháp Trưởng Lão',
    requiredContribution: 15000,
    requiredRealm: 30,
    realmName: 'Nguyên Anh Sơ Kỳ',
    dailySalary: {
      linhThach: 6000,
      tuVi: 5000,
      tinhHuyet: 4
    },
    privileges: [
      'Kích hoạt Hào Quang Trấn Phái (+10% Công Kích & Phòng Ngự)',
      'Hiển thị Danh Hiệu Hoàng Kim tại Cột Trái',
      'Nắm quyền giám sát đệ tử toàn môn'
    ]
  },
  chuong_mon: {
    rank: 'chuong_mon',
    title: 'Chưởng Môn Tông Chủ',
    requiredContribution: 35000,
    requiredRealm: 40,
    realmName: 'Hóa Thần Sơ Kỳ',
    dailySalary: {
      linhThach: 15000,
      tuVi: 12000,
      tinhHuyet: 8
    },
    privileges: [
      'Kích hoạt Hào Quang Chí Tôn Trấn Phái (+20% Công Kích & Phòng Ngự)',
      'Độc chiếm linh tuyền địa mạch thượng cổ',
      'Vạn tiên cúng bái, danh chấn tam giới'
    ]
  }
};

Object.values(SECT_RANKS_CONFIG).forEach(rc => {
  rc.salary = rc.dailySalary?.linhThach ?? 0;
});

export const SECT_RANK_ORDER: SectRank[] = [
  'tap_dich',
  'ngoai_mon',
  'noi_mon',
  'chan_truyen',
  'truong_lao',
  'chuong_mon'
];

// ============================================
// 2. DANH MỤC 20 TÔNG MÔN THEO 5 TIER HOÀN CHỈNH
// ============================================
function makeRanks(titles: [string, string, string, string, string, string]): SectRankDetail[] {
  const [tapDich, ngoaiMon, noiMon, chanTruyen, truongLao, chuongMon] = titles;
  return [
    { ...SECT_RANKS_CONFIG.tap_dich, title: tapDich, salary: SECT_RANKS_CONFIG.tap_dich.dailySalary?.linhThach || 150 },
    { ...SECT_RANKS_CONFIG.ngoai_mon, title: ngoaiMon, salary: SECT_RANKS_CONFIG.ngoai_mon.dailySalary?.linhThach || 400 },
    { ...SECT_RANKS_CONFIG.noi_mon, title: noiMon, salary: SECT_RANKS_CONFIG.noi_mon.dailySalary?.linhThach || 1000 },
    { ...SECT_RANKS_CONFIG.chan_truyen, title: chanTruyen, salary: SECT_RANKS_CONFIG.chan_truyen.dailySalary?.linhThach || 2500 },
    { ...SECT_RANKS_CONFIG.truong_lao, title: truongLao, salary: SECT_RANKS_CONFIG.truong_lao.dailySalary?.linhThach || 6000 },
    { ...SECT_RANKS_CONFIG.chuong_mon, title: chuongMon, salary: SECT_RANKS_CONFIG.chuong_mon.dailySalary?.linhThach || 15000 }
  ];
}

export const SECT_LIST: SectData[] = [
  // -------------------------------------------------------------
  // TIER 1: BÁT CỬU PHÀM TRẦN (CỬU LƯU TÔNG MÔN)
  // -------------------------------------------------------------
  {
    id: 'sect_thanh_van_mon',
    name: 'Thanh Vân Môn',
    tier: 1,
    tierName: 'Cửu Lưu Tông Môn',
    badgeColor: 'border-emerald-600/40 bg-emerald-950/40 text-emerald-300',
    description: 'Chính đạo sơ cấp danh trấn bắc cương, tọa lạc trên đỉnh Thanh Vân linh khí thanh tĩnh. Đạo pháp tự nhiên dung hòa trời đất, tôi luyện tâm tính, an định đạo cơ.',
    specialty: 'am_duong',
    specialtyName: 'Đạo Pháp Cân Bằng',
    requirements: { minRealmIndex: 1, minCanCot: 15, minLinhCanGrade: 'tap' },
    shortName: 'Thanh Vân',
    tagline: 'Thanh tĩnh vô vi, đạo pháp tự nhiên, tâm như chỉ thủy, dưỡng thiên địa chính khí.',
    leader: 'Thanh Diệp Chân Nhân',
    badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
    themeColor: 'emerald',
    icon: '☯️',
    faction: 'chinh_dao',
    color: 'text-emerald-300',
    specialBuff: '⚡ Tăng +15% Tốc Độ Tu Luyện & 🛡️ Giảm 25% Sát Thương Tâm Ma',
    buffDetails: { cultivateSpeedBonus: 15, tamMaResist: 25 },
    ranks: makeRanks(['Tạp Dịch Đạo Đồng', 'Ngoại Môn Đệ Tử', 'Nội Môn Đệ Tử', 'Chân Truyền Đệ Tử', 'Chấp Sự Trưởng Lão', 'Thanh Vân Tông Chủ'])
  },
  {
    id: 'sect_thiet_khi_mon',
    name: 'Thiết Khí Môn',
    tier: 1,
    tierName: 'Cửu Lưu Tông Môn',
    badgeColor: 'border-amber-700/40 bg-amber-950/40 text-amber-300',
    description: 'Môn phái chuyên tâm rèn sắt đúc binh, tôi luyện gân cốt bằng hỏa diễm và thiết chùy, nhục thân cứng rắn hơn người.',
    specialty: 'the_tu',
    specialtyName: 'Luyện Thể Đúc Thần',
    requirements: { minRealmIndex: 1, minCanCot: 15, minLinhCanGrade: 'tap' },
    shortName: 'Thiết Khí',
    tagline: 'Lấy thân làm phôi, thiên lôi làm búa, tôi rèn thành bất hoại chi khu!',
    leader: 'Âu Dương Thiết Thủ',
    badgeClass: 'text-amber-300 border-amber-600/40 bg-amber-950/40',
    themeColor: 'amber',
    icon: '🔨',
    faction: 'trung_lap',
    color: 'text-amber-300',
    specialBuff: '🛡️ Tăng +20% Phòng Ngự & 🔨 +15% Tốc Độ Rèn Đúc Tinh Luyện',
    buffDetails: { defBonusPercent: 20, forgingSpeedBonus: 15 },
    ranks: makeRanks(['Luyện Lô Đồng Tử', 'Thiết Giáp Đệ Tử', 'Hóa Thiết Tinh Anh', 'Chân Truyền Luyện Thể', 'Đúc Kiếm Trưởng Lão', 'Thiết Khí Môn Chủ'])
  },
  {
    id: 'sect_thao_duoc_coc',
    name: 'Thảo Dược Cốc',
    tier: 1,
    tierName: 'Cửu Lưu Tông Môn',
    badgeColor: 'border-teal-600/40 bg-teal-950/40 text-teal-300',
    description: 'Thung lũng ẩn dật tràn ngập hoa cỏ tiên thảo, đệ tử chuyên tu bồi dưỡng linh dược, gieo mầm trường sinh.',
    specialty: 'dan_dao',
    specialtyName: 'Linh Điền Đan Đạo',
    requirements: { minRealmIndex: 1, minCanCot: 15, minLinhCanGrade: 'tap' },
    shortName: 'Thảo Dược',
    tagline: 'Vạn vật giai hữu linh, thảo mộc tức trường sinh, đan đạo thông thiên địa.',
    leader: 'Bách Thảo Lão Nhân',
    badgeClass: 'text-teal-300 border-teal-500/40 bg-teal-950/40',
    themeColor: 'teal',
    icon: '🌿',
    faction: 'chinh_dao',
    color: 'text-teal-300',
    specialBuff: '🌿 +25% Thu Hoạch Linh Dược & 💊 +10% Tỷ Lệ Đan Thành',
    buffDetails: { herbYieldBonus: 25, alchemyRateBonus: 10 },
    ranks: makeRanks(['Linh Điền Nông Đồng', 'Dược Viên Đệ Tử', 'Dược Lô Chấp Sự', 'Chân Truyền Đan Đồng', 'Thảo Mộc Trưởng Lão', 'Thảo Dược Cốc Chủ'])
  },
  {
    id: 'sect_hoang_nguyet_phai',
    name: 'Hoang Nguyệt Phái',
    tier: 1,
    tierName: 'Cửu Lưu Tông Môn',
    badgeColor: 'border-zinc-500/40 bg-zinc-900/50 text-zinc-200',
    description: 'Liên minh tán tu tự do lập nên dưới bóng trăng đại hoang, trợ giúp đệ tử tự do ngao du tìm kiếm tài nguyên linh thạch.',
    specialty: 'am_duong',
    specialtyName: 'Tán Tu Tự Do',
    requirements: { minRealmIndex: 1, minCanCot: 15, minLinhCanGrade: 'tap' },
    shortName: 'Hoang Nguyệt',
    tagline: 'Minh nguyệt chiếu đại hoang, phiêu diêu thiên địa gian, không màng thế tục ràng buộc.',
    leader: 'Hoang Nguyệt Tiên Cô',
    badgeClass: 'text-zinc-200 border-zinc-600/40 bg-zinc-900/40',
    themeColor: 'zinc',
    icon: '🌙',
    faction: 'trung_lap',
    color: 'text-zinc-200',
    specialBuff: '💰 +30% Bổng Lộc Linh Thạch & 🧭 +15% Tỷ Lệ Cơ Duyên Lịch Luyện',
    buffDetails: { salaryBonusPercent: 30, luckBonusPercent: 15 },
    ranks: makeRanks(['Hoang Dã Tán Tu', 'Nguyệt Hạ Hành Giả', 'Hoang Nguyệt Du Hiệp', 'Nguyệt Ảnh Chân Truyền', 'Hộ Pháp Tiên Cô', 'Hoang Nguyệt Chưởng Phái'])
  },

  // -------------------------------------------------------------
  // TIER 2: HUYỀN MÔN NHẬP ĐẠO (THẤT - LỤC LƯU TÔNG MÔN)
  // -------------------------------------------------------------
  {
    id: 'sect_kim_kiem_tong',
    name: 'Kim Kiếm Tông',
    tier: 2,
    tierName: 'Lục Lưu Tông Môn',
    badgeColor: 'border-sky-500/40 bg-sky-950/40 text-sky-300',
    description: 'Tông môn kiếm tu cương mãnh, chuộng sát phạt quyết đoán, một kiếm chém ra vạn đạo hào quang sắc bén xé rách hư không.',
    specialty: 'kiem_tu',
    specialtyName: 'Kiếm Tu Sát Phạt',
    requirements: { minRealmIndex: 11, minCanCot: 35, minLinhCanGrade: 'chan' },
    shortName: 'Kim Kiếm',
    tagline: 'Kim quang khai thiên địa, kiếm khí trảm bát hoang, bách chiến bất bại!',
    leader: 'Kim Kiếm Thần Quân',
    badgeClass: 'text-sky-300 border-sky-500/40 bg-sky-950/40',
    themeColor: 'sky',
    icon: '⚔️',
    faction: 'kiem_phai',
    color: 'text-sky-300',
    specialBuff: '⚔️ +20% Công Kích & 💥 +10% Tỷ Lệ Bạo Kích',
    buffDetails: { atkBonusPercent: 20, critRateBonus: 10 },
    ranks: makeRanks(['Kiếm Đồng Tạp Viện', 'Ngoại Viện Kiếm Thị', 'Nội Điện Kiếm Tu', 'Kim Kiếm Chân Truyền', 'Sát Phạt Trưởng Lão', 'Kim Kiếm Tông Chủ'])
  },
  {
    id: 'sect_huyen_thuy_cung',
    name: 'Huyền Thủy Cung',
    tier: 2,
    tierName: 'Lục Lưu Tông Môn',
    badgeColor: 'border-blue-500/40 bg-blue-950/40 text-blue-300',
    description: 'Cung điện dưới đáy hồ sâu ngàn trượng, tu luyện âm nhu thủy pháp, tĩnh dưỡng chân nguyên, kéo dài hơi thở chiến đấu.',
    specialty: 'am_duong',
    specialtyName: 'Âm Nhu Thủy Pháp',
    requirements: { minRealmIndex: 11, minCanCot: 35, minLinhCanGrade: 'chan' },
    shortName: 'Huyền Thủy',
    tagline: 'Thượng thiện nhược thủy, thủy thiện lợi vạn vật, nhu năng thắng cương.',
    leader: 'Lạc Thủy Tiên Tử',
    badgeClass: 'text-blue-300 border-blue-500/40 bg-blue-950/40',
    themeColor: 'blue',
    icon: '💧',
    faction: 'chinh_dao',
    color: 'text-blue-300',
    specialBuff: '🌊 +25% Chân Nguyên MP & 💧 Tự Hồi 2% Khí Huyết Mỗi Hiệp',
    buffDetails: { mpBonusPercent: 25, hpRegenPercent: 2 },
    ranks: makeRanks(['Thủy Nô Tạp Dịch', 'Tố Nữ Ngoại Cung', 'Thủy Nguyệt Đệ Tử', 'Chân Truyền Thần Nữ', 'Huyền Băng Trưởng Lão', 'Huyền Thủy Cung Chủ'])
  },
  {
    id: 'sect_man_hoang_tong',
    name: 'Man Hoang Tông',
    tier: 2,
    tierName: 'Thất Lưu Tông Môn',
    badgeColor: 'border-orange-600/40 bg-orange-950/40 text-orange-300',
    description: 'Cổ mạch hoang dã, dung nạp tinh huyết mãnh thú, rèn đúc thể phách như cự thú thời hồng hoang, sinh lực dồi dào bất tận.',
    specialty: 'the_tu',
    specialtyName: 'Cuồng Thể Mạch Phái',
    requirements: { minRealmIndex: 11, minCanCot: 35, minLinhCanGrade: 'chan' },
    shortName: 'Man Hoang',
    tagline: 'Khí huyết tựa uông dương, nhục thân phá vạn pháp, man hoang vô địch!',
    leader: 'Man Hoang Cự Tôn',
    badgeClass: 'text-orange-300 border-orange-600/40 bg-orange-950/40',
    themeColor: 'orange',
    icon: '🦬',
    faction: 'trung_lap',
    color: 'text-orange-300',
    specialBuff: '🩸 +30% Khí Huyết Tối Đa & 🛡️ Giảm 15% Sát Thương Nhận Vào',
    buffDetails: { hpBonusPercent: 30, damageReductionPercent: 15 },
    ranks: makeRanks(['Khổ Lực Đệ Tử', 'Huyết Khí Dũng Sĩ', 'Man Lực Chiến Tướng', 'Cuồng Thể Chân Truyền', 'Thể Phách Trưởng Lão', 'Man Hoang Tông Chủ'])
  },
  {
    id: 'sect_u_minh_giao',
    name: 'U Minh Giáo',
    tier: 2,
    tierName: 'Thất Lưu Tông Môn',
    badgeColor: 'border-purple-600/40 bg-purple-950/40 text-purple-300',
    description: 'Giáo phái tà dị ẩn trong sương đen U Minh, hấp thụ lệ quỷ u hồn, xuất thủ đoạt mệnh và chuyển hóa sinh cơ kẻ địch thành tự thân.',
    specialty: 'ma_dao',
    specialtyName: 'U Minh Quỷ Đạo',
    requirements: { minRealmIndex: 11, minCanCot: 35, minLinhCanGrade: 'chan' },
    shortName: 'U Minh',
    tagline: 'Hoàng tuyền lộ thượng linh hồn lạc, U Minh giới trung ngã xưng vương!',
    leader: 'U Minh Giáo Chủ',
    badgeClass: 'text-purple-300 border-purple-600/40 bg-purple-950/40',
    themeColor: 'purple',
    icon: '👻',
    faction: 'ma_dao',
    color: 'text-purple-300',
    specialBuff: '🩸 +15% Hút Máu & 💀 Phản 10% Sát Thương (⚠️ Giảm nhẹ 5 Tâm Cảnh)',
    buffDetails: { lifestealPercent: 15, reflectPercent: 10, tamCanhDebuff: 5 },
    ranks: makeRanks(['Hoàng Tuyền Quỷ Nô', 'Âm Sát Quỷ Đồ', 'U Hồn Quỷ Tướng', 'Chân Truyền Quỷ Tử', 'U Minh Trưởng Lão', 'U Minh Giáo Chủ'])
  },

  // -------------------------------------------------------------
  // TIER 3: DANH MÔN THẾ GIA (NGŨ - TỨ LƯU TÔNG MÔN)
  // -------------------------------------------------------------
  {
    id: 'sect_dan_dinh_tong',
    name: 'Đan Đỉnh Tông',
    tier: 3,
    tierName: 'Tứ Lưu Tông Môn',
    badgeColor: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
    description: 'Thánh địa đan đạo vang danh tam giới, nắm giữ Cửu Long Thần Lô cùng vô số cổ đan phương vô giá, tỷ lệ luyện đan cực phẩm phi thường.',
    specialty: 'dan_dao',
    specialtyName: 'Đan Đạo Tông Sư',
    requirements: { minRealmIndex: 16, minCanCot: 60, minLinhCanGrade: 'dia' },
    shortName: 'Đan Đỉnh',
    tagline: 'Cửu chuyển thành thần đan, nhất đỉnh định càn khôn, vạn cổ đan đạo vô song.',
    leader: 'Cửu Đỉnh Đan Tôn',
    badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
    themeColor: 'emerald',
    icon: '⚗️',
    faction: 'chinh_dao',
    color: 'text-emerald-300',
    specialBuff: '✨ +25% Tỷ Lệ Luyện Ra Đan Cực Phẩm & 💊 Giảm 30% Tiêu Hao Dược Liệu',
    buffDetails: { masterPillRateBonus: 25, herbSavingPercent: 30 },
    ranks: makeRanks(['Dược Lô Hỏa Đồng', 'Đan Đồng Ngoại Điện', 'Đan Sư Nội Viện', 'Cửu Chuyển Đan Tử', 'Đan Đạo Đại Tông Sư', 'Cửu Đỉnh Đan Tông Chủ'])
  },
  {
    id: 'sect_thien_tran_cac',
    name: 'Thiên Trận Các',
    tier: 3,
    tierName: 'Tứ Lưu Tông Môn',
    badgeColor: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300',
    description: 'Các phái chuyên nghiên cứu kỳ môn độn giáp và thiên địa cổ trận, lấy linh thạch khắc ấn càn khôn, một trận định càn khôn.',
    specialty: 'tran_phu',
    specialtyName: 'Trận Pháp Kỳ Môn',
    requirements: { minRealmIndex: 16, minCanCot: 60, minLinhCanGrade: 'dia' },
    shortName: 'Thiên Trận',
    tagline: 'Lấy trời làm bàn cờ, sao trời làm quân cờ, bày bố tru thiên đại trận!',
    leader: 'Thiên Trận Đạo Nhân',
    badgeClass: 'text-indigo-300 border-indigo-500/40 bg-indigo-950/40',
    themeColor: 'indigo',
    icon: '🔯',
    faction: 'chinh_dao',
    color: 'text-indigo-300',
    specialBuff: '🛡️ +25% Uy Lực Trận Bàn & ⚡ Giảm 20% Tiêu Hao Bùa Chú Trận Pháp',
    buffDetails: { formationPowerBonus: 25, formationCostReduction: 20 },
    ranks: makeRanks(['Bày Trận Học Đồ', 'Trận Văn Đệ Tử', 'Trận Bàn Tinh Anh', 'Chân Truyền Trận Tử', 'Kỳ Môn Trưởng Lão', 'Thiên Trận Các Chủ'])
  },
  {
    id: 'sect_van_thu_son',
    name: 'Vạn Thú Sơn',
    tier: 3,
    tierName: 'Ngũ Lưu Tông Môn',
    badgeColor: 'border-amber-600/40 bg-amber-950/40 text-amber-300',
    description: 'Ngự thú danh môn ngự trị rặng núi cổ thụ, kết giao tâm linh cùng vạn loài linh thú, sức mạnh linh sủng tăng tiến vượt bậc.',
    specialty: 'ngu_thu',
    specialtyName: 'Ngự Thú Danh Môn',
    requirements: { minRealmIndex: 16, minCanCot: 60, minLinhCanGrade: 'dia' },
    shortName: 'Vạn Thú',
    tagline: 'Thống lĩnh vạn thú hồng hoang, ngự long phi thiên, uy chấn bát phương.',
    leader: 'Vạn Thú Tôn Giả',
    badgeClass: 'text-amber-300 border-amber-600/40 bg-amber-950/40',
    themeColor: 'amber',
    icon: '🦁',
    faction: 'trung_lap',
    color: 'text-amber-300',
    specialBuff: '🐾 +40% EXP Linh Thú Nuôi Dưỡng & 🦁 +20% Thuộc Tính Toàn Thú Đi Cùng',
    buffDetails: { beastExpBonus: 40, beastStatsBonus: 20 },
    ranks: makeRanks(['Dưỡng Thú Đồng Tử', 'Tuần Thú Đệ Tử', 'Ngự Thú Dũng Sĩ', 'Vạn Thú Thiếu Tôn', 'Tê Giác Trưởng Lão', 'Vạn Thú Tông Chủ'])
  },
  {
    id: 'sect_huyet_sat_tong',
    name: 'Huyết Sát Tông',
    tier: 3,
    tierName: 'Tứ Lưu Tông Môn',
    badgeColor: 'border-rose-600/40 bg-rose-950/40 text-rose-400',
    description: 'Ma môn thiết huyết xưng bá Vạn Ma Uyên, tu sĩ tôi luyện ma thân cuồng bạo, càng cận kề hiểm cảnh càng bùng nổ chiến lực nghịch thiên.',
    specialty: 'ma_dao',
    specialtyName: 'Thiết Huyết Cuồng Ma',
    requirements: { minRealmIndex: 16, minCanCot: 60, minLinhCanGrade: 'dia' },
    shortName: 'Huyết Sát',
    tagline: 'Thiên địa bất nhân dĩ vạn vật vi sô cẩu. Khát máu hung tàn, sát sinh chứng đạo!',
    leader: 'Huyết Sát Ma Quân',
    badgeClass: 'text-rose-400 border-rose-600/40 bg-rose-950/40',
    themeColor: 'rose',
    icon: '🩸',
    faction: 'ma_dao',
    color: 'text-rose-400',
    specialBuff: '🩸 +25% Công Kích, Kích Hoạt Cuồng Bạo (+35% Dmg) Khi HP Dưới 30%',
    buffDetails: { atkBonusPercent: 25, berserkDamageBonus: 35 },
    ranks: makeRanks(['Huyết Nô Tạp Dịch', 'Ma Đồ Ngoại Điện', 'Ma Tướng Nội Điện', 'Huyết Ma Chân Truyền', 'Huyết Sát Trưởng Lão', 'Cửu U Ma Hoàng'])
  },

  // -------------------------------------------------------------
  // TIER 4: CỔ LÃO TÔNG TỘC (TAM - NHỊ LƯU TÔNG MÔN)
  // -------------------------------------------------------------
  {
    id: 'sect_thai_at_kiem_tong',
    name: 'Thái Ất Kiếm Tông',
    tier: 4,
    tierName: 'Nhị Lưu Tông Môn',
    badgeColor: 'border-cyan-400/50 bg-cyan-950/50 text-cyan-200',
    description: 'Cổ phái kiếm tu thượng thừa đạt đến cảnh giới vô vi kiếm ý, kiếm quang rực rỡ trảm phá hộ thể cương khí đối thủ như chém bùn.',
    specialty: 'kiem_tu',
    specialtyName: 'Thái Ất Tuyệt Kiếm',
    requirements: { minRealmIndex: 21, minCanCot: 85, minLinhCanGrade: 'thien' },
    shortName: 'Thái Ất',
    tagline: 'Thái Ất vô cực, kiếm khí tung hoành tam vạn lý, nhất kiếm quang hàn thập cửu châu!',
    leader: 'Thái Ất Kiếm Thánh',
    badgeClass: 'text-cyan-300 border-cyan-500/40 bg-sky-950/40',
    themeColor: 'cyan',
    icon: '🗡️',
    faction: 'kiem_phai',
    color: 'text-cyan-300',
    specialBuff: '⚔️ Bỏ Qua 25% Giáp Đối Thủ & 💥 +35% Sát Thương Bạo Kích',
    buffDetails: { armorPenPercent: 25, critDmgBonus: 35 },
    ranks: makeRanks(['Kiếm Đồng Tu Tâm', 'Thái Ất Kiếm Sĩ', 'Vô Cực Kiếm Tu', 'Thái Ất Kiếm Tử', 'Kiếm Tông Trưởng Lão', 'Thái Ất Kiếm Thánh'])
  },
  {
    id: 'sect_bat_quai_tien_mon',
    name: 'Bát Quái Tiên Môn',
    tier: 4,
    tierName: 'Nhị Lưu Tông Môn',
    badgeColor: 'border-violet-400/50 bg-violet-950/50 text-violet-200',
    description: 'Kế thừa tiên pháp Phục Hy, nhìn thấu mệnh lý càn khôn, biến hung thành cát, cường hóa toàn diện các ấn ký mệnh cách.',
    specialty: 'tran_phu',
    specialtyName: 'Mệnh Lý Bát Quái',
    requirements: { minRealmIndex: 21, minCanCot: 85, minLinhCanGrade: 'thien' },
    shortName: 'Bát Quái',
    tagline: 'Càn Khôn Đoài Ly Chấn Tốn Khảm Cấn, thấu triệt thiên cơ, nghịch thiên cải mệnh!',
    leader: 'Phục Hy Thần Toán',
    badgeClass: 'text-violet-300 border-violet-500/40 bg-violet-950/40',
    themeColor: 'violet',
    icon: '☯️',
    faction: 'chinh_dao',
    color: 'text-violet-300',
    specialBuff: '🌟 Tăng +30% Hiệu Ứng Mệnh Cách & 🔮 +25 Khí Vận May Mắn',
    buffDetails: { destinySynergyBonus: 30, khiVanBonus: 25 },
    ranks: makeRanks(['Mệnh Lý Đồng Tử', 'Chiêm Bốc Đệ Tử', 'Bát Quái Tu Sĩ', 'Khai Thiên Chân Truyền', 'Thiên Cơ Trưởng Lão', 'Bát Quái Tiên Chủ'])
  },
  {
    id: 'sect_cuu_u_ma_dien',
    name: 'Cửu U Ma Điện',
    tier: 4,
    tierName: 'Tam Lưu Tông Môn',
    badgeColor: 'border-red-500/50 bg-red-950/50 text-red-300',
    description: 'Ma môn viễn cổ dưới tầng sâu Cửu U, tu luyện ma khí chí thuần gây sát thương thực thể xuyên qua mọi lớp phòng hộ trần gian.',
    specialty: 'ma_dao',
    specialtyName: 'Cửu U Chân Ma',
    requirements: { minRealmIndex: 21, minCanCot: 85, minLinhCanGrade: 'thien' },
    shortName: 'Cửu U Ma Điện',
    tagline: 'Ma lâm thiên hạ, vạn giới trầm luân, vĩnh dạ bất diệt, duy ngã độc tôn!',
    leader: 'Cửu U Minh Hoàng',
    badgeClass: 'text-red-400 border-red-600/40 bg-red-950/40',
    themeColor: 'red',
    icon: '🔥',
    faction: 'ma_dao',
    color: 'text-red-400',
    specialBuff: '💀 Gây +20% Sát Thương Chân Thực (True Damage Bỏ Qua Phòng Thủ)',
    buffDetails: { trueDamagePercent: 20 },
    ranks: makeRanks(['Cửu U Nô Bộc', 'Ma Hồn Đệ Tử', 'Ma Sát Chiến Tướng', 'Cửu U Thiếu Chủ', 'Cực Ma Trưởng Lão', 'Cửu U Minh Hoàng'])
  },
  {
    id: 'sect_lac_ha_tien_cung',
    name: 'Lạc Hà Tiên Cung',
    tier: 4,
    tierName: 'Nhị Lưu Tông Môn',
    badgeColor: 'border-pink-400/50 bg-pink-950/50 text-pink-200',
    description: 'Tiên cung thanh tao giữa ráng chiều mây đỏ, đạo pháp hữu tình dung hòa âm dương, gắn kết tiên duyên song tu thăng tiến thần tốc.',
    specialty: 'am_duong',
    specialtyName: 'Tiên Duyên Lạc Hà',
    requirements: { minRealmIndex: 21, minCanCot: 85, minLinhCanGrade: 'thien' },
    shortName: 'Lạc Hà',
    tagline: 'Lạc hà dữ cô vụ tề phi, thu thủy cộng trường thiên nhất sắc, đại đạo hữu tình.',
    leader: 'Lạc Hà Cung Chủ',
    badgeClass: 'text-pink-300 border-pink-500/40 bg-pink-950/40',
    themeColor: 'pink',
    icon: '🪷',
    faction: 'chinh_dao',
    color: 'text-pink-300',
    specialBuff: '💖 +35% Hiệu Quả Song Tu Đạo Lữ & 🧘 +30% Tỷ Lệ Ngộ Đạo Đột Phá',
    buffDetails: { dualCultivationBonus: 35, comprehensionBonus: 30 },
    ranks: makeRanks(['Lạc Hà Đạo Đồng', 'Hà Quang Tiên Tử', 'Tố Tâm Tinh Anh', 'Tiên Duyên Chân Truyền', 'Nguyệt Dao Trưởng Lão', 'Lạc Hà Cung Chủ'])
  },

  // -------------------------------------------------------------
  // TIER 5: VẠN CỔ THÁNH ĐỊA (NHẤT LƯU CỔ GIÁO & ĐỈNH CẤP TIÊN MÔN)
  // -------------------------------------------------------------
  {
    id: 'sect_thai_so_thanh_dia',
    name: 'Thái Sơ Thánh Địa',
    tier: 5,
    tierName: 'Nhất Lưu Thánh Địa',
    badgeColor: 'border-rose-400 bg-rose-950/60 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)]',
    description: 'Tồn tại từ thuở hồng mông sơ khai, bao hàm quy tắc tiên thiên, đệ tử ngưng tụ thái sơ chi khí, tốc độ tu luyện đứng đầu vạn giới.',
    specialty: 'hon_don',
    specialtyName: 'Thái Sơ Chi Lực',
    requirements: { minRealmIndex: 26, minCanCot: 100, minLinhCanGrade: 'bien_di' },
    shortName: 'Thái Sơ',
    tagline: 'Tiên thiên nhi sinh, tiên địa nhi trường, Thái Sơ bất hủ, duy ngã vĩnh tồn!',
    leader: 'Thái Sơ Đạo Tổ',
    badgeClass: 'text-rose-200 border-rose-500/60 bg-rose-950/60',
    themeColor: 'rose',
    icon: '🌌',
    faction: 'chinh_dao',
    color: 'text-rose-200',
    specialBuff: '⚡ Tăng +40% Tốc Độ Tu Vi Toàn Diện & 🛡️ Kháng 30% Mọi Dạng Sát Thương',
    buffDetails: { cultivateSpeedBonus: 40, allDamageResist: 30 },
    ranks: makeRanks(['Thái Sơ Đạo Đồng', 'Tiên Thiên Đệ Tử', 'Thái Sơ Tinh Anh', 'Thái Sơ Thánh Tử', 'Bất Hủ Trưởng Lão', 'Thái Sơ Đạo Tổ'])
  },
  {
    id: 'sect_luan_hoi_tien_dien',
    name: 'Luân Hồi Tiên Điện',
    tier: 5,
    tierName: 'Đỉnh Cấp Tiên Môn',
    badgeColor: 'border-purple-400 bg-purple-950/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
    description: 'Điện thờ tối cao nắm giữ luân hồi thời không, điều khiển sinh tử, đệ tử siêu thoát khỏi quy luật thiên đạo, trường sinh bất tử.',
    specialty: 'am_duong',
    specialtyName: 'Luân Hồi Nghịch Thiên',
    requirements: { minRealmIndex: 26, minCanCot: 100, minLinhCanGrade: 'bien_di' },
    shortName: 'Luân Hồi',
    tagline: 'Chưởng quản sinh tử sổ bộ, nghịch chuyển luân hồi thời không, vạn kiếp bất diệt!',
    leader: 'Luân Hồi Tiên Tôn',
    badgeClass: 'text-purple-200 border-purple-500/60 bg-purple-950/60',
    themeColor: 'purple',
    icon: '⏳',
    faction: 'trung_lap',
    color: 'text-purple-200',
    specialBuff: '⏳ +100 Năm Thọ Nguyên & 💫 Tự Động Hồi Sinh 1 Lần Khi Trọng Thương (Hồi 50% HP)',
    buffDetails: { lifespanBonus: 100, autoReviveHpPercent: 50 },
    ranks: makeRanks(['Sinh Tử Đạo Đồng', 'Luân Hồi Hành Giả', 'Nghịch Mệnh Chân Tu', 'Luân Hồi Thánh Tử', 'Thời Không Trưởng Lão', 'Luân Hồi Tiên Tôn'])
  },
  {
    id: 'sect_hon_don_dao_tong',
    name: 'Hỗn Độn Đạo Tông',
    tier: 5,
    tierName: 'Nhất Lưu Thánh Địa',
    badgeColor: 'border-amber-400 bg-amber-950/60 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.4)]',
    description: 'Nơi dung hòa vạn pháp ngũ hành quy về hỗn độn vô cực, tu sĩ dung hợp mọi nguồn năng lượng trong vũ trụ, chỉ số toàn diện vô địch.',
    specialty: 'hon_don',
    specialtyName: 'Ngũ Hành Hỗn Độn',
    requirements: { minRealmIndex: 26, minCanCot: 100, minLinhCanGrade: 'hon_don' },
    shortName: 'Hỗn Độn',
    tagline: 'Hỗn độn sơ khai, ngũ hành quy nhất, vạn pháp quy tông, chúa tể càn khôn!',
    leader: 'Hỗn Độn Tông Tổ',
    badgeClass: 'text-amber-200 border-amber-500/60 bg-amber-950/60',
    themeColor: 'amber',
    icon: '✨',
    faction: 'chinh_dao',
    color: 'text-amber-200',
    specialBuff: '🔱 Tăng +25% Toàn Bộ Chỉ Số Chiến Đấu (ATK, DEF, HP, SPD, CRIT)',
    buffDetails: { allStatsBonusPercent: 25 },
    ranks: makeRanks(['Khai Thiên Đạo Đồng', 'Ngũ Hành Tinh Tu', 'Vạn Pháp Tinh Anh', 'Hỗn Độn Thánh Tử', 'Quy Nhất Trưởng Lão', 'Hỗn Độn Tông Tổ'])
  },
  {
    id: 'sect_bat_diet_ma_cung',
    name: 'Bất Diệt Ma Cung',
    tier: 5,
    tierName: 'Vạn Cổ Ma Môn',
    badgeColor: 'border-red-500 bg-red-950/70 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.45)]',
    description: 'Cực cảnh tối cao của ma đạo, rèn thành Bất Diệt Ma Thân, miễn tử chuyển nguy thành an, uy lực phản sát thương kinh thiên động địa.',
    specialty: 'ma_dao',
    specialtyName: 'Bất Diệt Chân Thân',
    requirements: { minRealmIndex: 26, minCanCot: 100, minLinhCanGrade: 'bien_di' },
    shortName: 'Bất Diệt',
    tagline: 'Nhục thân bất diệt, ma hồn trường tồn, dẫu trời sụp đất nứt vẫn sừng sững nghìn thu!',
    leader: 'Bất Diệt Ma Đế',
    badgeClass: 'text-red-300 border-red-500/60 bg-red-950/60',
    themeColor: 'red',
    icon: '👑',
    faction: 'ma_dao',
    color: 'text-red-300',
    specialBuff: '🛡️ Miễn Tử 1 Lần Trong Combat & 💥 Phản 35% Sát Thương Cho Kẻ Tấn Công',
    buffDetails: { cheatDeathOnce: true, reflectPercent: 35 },
    ranks: makeRanks(['Ma Cung Bộc Dịch', 'Bất Hoại Ma Đồ', 'Cực Ma Chiến Tướng', 'Bất Diệt Chân Thần', 'Ma Hoàng Trưởng Lão', 'Bất Diệt Ma Đế'])
  }
];

export const SECT_DATA_MAP: Record<string, SectData> = {};
export const SECT_PROFILES: Record<string, SectProfile> = {};

SECT_LIST.forEach((s) => {
  SECT_DATA_MAP[s.id] = s;
  SECT_PROFILES[s.id] = s as SectProfile;
});

// Map alias cũ để bảo đảm 100% tương thích ngược dữ liệu
SECT_PROFILES['thanh_van_mon'] = SECT_DATA_MAP['sect_thanh_van_mon'] as SectProfile;
SECT_PROFILES['huyet_sat_tong'] = SECT_DATA_MAP['sect_huyet_sat_tong'] as SectProfile;
SECT_PROFILES['thien_kiem_son'] = SECT_DATA_MAP['sect_thai_at_kiem_tong'] as SectProfile;
SECT_PROFILES['chinh_dao'] = SECT_PROFILES['sect_thanh_van_mon'];
SECT_PROFILES['ma_dao'] = SECT_PROFILES['sect_huyet_sat_tong'];
SECT_PROFILES['kiem_phai'] = SECT_PROFILES['sect_thai_at_kiem_tong'];

SECT_DATA_MAP['thanh_van_mon'] = SECT_DATA_MAP['sect_thanh_van_mon'];
SECT_DATA_MAP['huyet_sat_tong'] = SECT_DATA_MAP['sect_huyet_sat_tong'];
SECT_DATA_MAP['thien_kiem_son'] = SECT_DATA_MAP['sect_thai_at_kiem_tong'];
SECT_DATA_MAP['chinh_dao'] = SECT_DATA_MAP['sect_thanh_van_mon'];
SECT_DATA_MAP['ma_dao'] = SECT_DATA_MAP['sect_huyet_sat_tong'];
SECT_DATA_MAP['kiem_phai'] = SECT_DATA_MAP['sect_thai_at_kiem_tong'];

// ============================================
// 3. NHIỆM VỤ TÔNG MÔN HẰNG NGÀY (DAILY QUESTS)
// ============================================
export interface SectQuestTemplate {
  title: string;
  description: string;
  category: 'garden' | 'battle' | 'alchemy' | 'donate' | 'patrol' | 'ore' | string;
  rewardContribution: number;
  rewardLinhThach: number;
  rewardDanhVong?: number;
  rewardTuVi?: number;
  targetCount: number;
}

export const DEFAULT_DAILY_QUEST_TEMPLATES: SectQuestTemplate[] = [
  {
    title: 'Tuần Tra Hộ Sơn Đại Trận',
    description: 'Đi vòng quanh sơn môn kiểm tra kết giới trận nhãn, bảo vệ an bình cho bổn tông.',
    category: 'patrol',
    rewardContribution: 100,
    rewardLinhThach: 150,
    rewardDanhVong: 20,
    rewardTuVi: 1000,
    targetCount: 1
  },
  {
    title: 'Trảm Diệt Yêu Thú Phạm Giới',
    description: 'Xuống núi tiêu diệt 1 Yêu Thú hung hãn quấy nhiễu phàm nhân bá tánh gần biên cảnh.',
    category: 'battle',
    rewardContribution: 180,
    rewardLinhThach: 300,
    rewardDanhVong: 30,
    rewardTuVi: 2000,
    targetCount: 1
  },
  {
    title: 'Cống Nộp Linh Thảo Sơn Môn',
    description: 'Giao nộp 3 cọng linh thảo thu hoạch từ Động Phủ Linh Điền vào đan khố tông môn.',
    category: 'garden',
    rewardContribution: 150,
    rewardLinhThach: 200,
    rewardDanhVong: 25,
    rewardTuVi: 1200,
    targetCount: 3
  },
  {
    title: 'Quyên Góp Khoáng Thạch Luyện Khí',
    description: 'Cống nộp 2 khối khoáng thạch bất kỳ vào lò rèn đúc thần binh của tông môn.',
    category: 'ore',
    rewardContribution: 160,
    rewardLinhThach: 220,
    rewardDanhVong: 25,
    rewardTuVi: 1500,
    targetCount: 2
  },
  {
    title: 'Quyên Góp Linh Thạch Kiến Thiết',
    description: 'Ủng hộ 150 Linh Thạch để tu sửa tiên các và bổ sung linh tuyền hộ mạch.',
    category: 'donate',
    rewardContribution: 120,
    rewardLinhThach: 0,
    rewardDanhVong: 20,
    rewardTuVi: 800,
    targetCount: 150
  }
];

export function generateDailyQuests(): SectQuest[] {
  return DEFAULT_DAILY_QUEST_TEMPLATES.map((tmpl, idx) => ({
    ...tmpl,
    id: `quest_${idx}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    currentCount: 0,
    isCompleted: false,
    isClaimed: false
  }));
}

// ============================================
// 4. TÀNG KINH CÁC MÔN PHÁI (SECT SHOP)
// ============================================
export const SECT_SHOP_ITEMS: Record<SectId, SectShopItem[]> = {
  thanh_van_mon: [
    {
      id: 'shop_tinh_huyet_thanh_van',
      name: 'Bình Tinh Huyết Yêu Thú (x5)',
      type: 'item',
      grade: 'Tam Phẩm',
      costContribution: 150,
      requiredRank: 'tap_dich',
      description: 'Bình ngọc đựng 5 giọt tinh huyết yêu thú do đệ tử hạ sơn thu thập, dùng cho Tôi Thể nhục thân.',
      effectSummary: 'Nhận ngay +5 giọt Tinh Huyết Yêu Thú dùng cho Tôi Thể.'
    },
    {
      id: 'shop_recipe_truc_co_cuc_pham',
      name: 'Đan Phương: Trúc Cơ Cực Phẩm Đan',
      type: 'dan_phuong',
      grade: 'Tứ Phẩm',
      costContribution: 800,
      requiredRank: 'ngoai_mon',
      description: 'Phương thuốc bí truyền của Thanh Vân Môn, giúp đệ tử ngoại môn phá vỡ bình cảnh Trúc Cơ dễ dàng.',
      effectSummary: 'Mở khóa công thức luyện Trúc Cơ Cực Phẩm Thần Đan (+50% tỉ lệ thành công khi đột phá).',
      recipeId: 'recipe_truc_co_cuc_pham'
    },
    {
      id: 'shop_recipe_bach_ngoc',
      name: 'Đan Phương: Bạch Ngọc Phá Chướng Đan',
      type: 'dan_phuong',
      grade: 'Ngũ Phẩm',
      costContribution: 1800,
      requiredRank: 'noi_mon',
      description: 'Thần đan chí bảo của Chính Đạo, xua tan chướng khí đan điền, hỗ trợ đột phá cảnh giới cao.',
      effectSummary: 'Mở khóa công thức luyện Bạch Ngọc Phá Chướng Đan (+35% tỉ lệ đột phá cảnh giới tiếp theo).',
      recipeId: 'recipe_bach_ngoc_pha_chuong'
    },
    {
      id: 'shop_manual_cuu_thien',
      name: 'Bí Tịch: Cửu Thiên Huyền Lôi Ấn',
      type: 'bi_tich',
      grade: 'Địa Giai',
      costContribution: 1500,
      requiredRank: 'noi_mon',
      description: 'Thần thông chính tông dẫn động sấm sét cửu thiên hàng phục tà ma.',
      effectSummary: 'Thần Thông Chiến Đấu: Sát thương 220% lôi hệ, tạo khiên sấm sét phản sát thương.',
      manualId: 'tt_cuu_thien_huyen_loi'
    },
    {
      id: 'shop_manual_thanh_van_kiem_dien',
      name: 'Công Pháp: Thanh Vân Kiếm Điển',
      type: 'bi_tich',
      grade: 'Thiên Giai',
      costContribution: 3000,
      requiredRank: 'chan_truyen',
      description: 'Trấn phái tuyệt học tối cao của Thanh Vân Môn, kiếm ý thanh phong hòa hợp thiên địa.',
      effectSummary: 'Tâm Pháp Chủ Tu: +16% tốc độ tu luyện mỗi cấp, giảm 30% sát thương Tâm Ma.',
      manualId: 'tp_thanh_van_kiem_dien'
    },
    {
      id: 'shop_seed_hoa_than',
      name: '3x Chiết Cành Hóa Thần Diệp',
      type: 'seed',
      grade: 'Ngũ Phẩm',
      costContribution: 500,
      requiredRank: 'ngoai_mon',
      description: 'Cành giống tiên thảo Hóa Thần Diệp lấy từ linh viên môn phái để gieo trồng tại Động Phủ.',
      effectSummary: 'Nhận 3 Hạt Giống Hóa Thần Diệp đem về Động Phủ gieo hạt.',
      seedId: 'seed_hoa_than_linh_diep'
    }
  ],
  huyet_sat_tong: [
    {
      id: 'shop_tinh_huyet_huyet_sat',
      name: 'Túi Tinh Huyết Cổ Ma (x8)',
      type: 'item',
      grade: 'Tứ Phẩm',
      costContribution: 250,
      requiredRank: 'tap_dich',
      description: 'Huyết nang chứa 8 giọt tinh huyết cổ ma nồng đậm sát khí, tài liệu thượng thừa tôi thể.',
      effectSummary: 'Nhận ngay +8 giọt Tinh Huyết Yêu Thú dùng cho Tôi Thể Thể Chất.'
    },
    {
      id: 'shop_recipe_pha_canh_dan',
      name: 'Đan Phương: Cực Phẩm Phá Cảnh Đan',
      type: 'dan_phuong',
      grade: 'Tứ Phẩm',
      costContribution: 1000,
      requiredRank: 'ngoai_mon',
      description: 'Phương thuốc bạo liệt của Huyết Sát Tông dùng phá vỡ vách ngăn cảnh giới cứng rắn nhất.',
      effectSummary: 'Mở khóa công thức luyện Thần Bí Phá Cảnh Đan (+30% tỉ lệ đột phá cảnh giới).',
      recipeId: 'recipe_pha_canh_dan'
    },
    {
      id: 'shop_recipe_huyet_ma',
      name: 'Đan Phương: Huyết Ma Bạo Thể Đan',
      type: 'dan_phuong',
      grade: 'Tam Phẩm',
      costContribution: 600,
      requiredRank: 'ngoai_mon',
      description: 'Ma đan kích phát cuồng huyết, biến sát ý thành chiến lực tột đỉnh trong giao tranh.',
      effectSummary: 'Mở khóa công thức luyện Huyết Ma Bạo Thể Đan (+25% Công Kích trong 5 trận đánh).',
      recipeId: 'recipe_huyet_ma_bao_the'
    },
    {
      id: 'shop_recipe_cuu_u',
      name: 'Đan Phương: Cửu U Hóa Cốt Thần Đan',
      type: 'dan_phuong',
      grade: 'Ngũ Phẩm',
      costContribution: 1800,
      requiredRank: 'noi_mon',
      description: 'Hấp thu u minh độc khí tôi luyện xương cốt, tăng vĩnh viễn căn cốt và phá giáp ma thú.',
      effectSummary: 'Mở khóa công thức luyện Cửu U Hóa Cốt Thần Đan (vĩnh viễn +5 Căn Cốt, giảm 25% giáp Boss).',
      recipeId: 'recipe_cuu_u_hoa_cot'
    },
    {
      id: 'shop_manual_tu_la',
      name: 'Bí Tịch: Tu La Huyết Sát Kiếm',
      type: 'bi_tich',
      grade: 'Thần Giai',
      costContribution: 3500,
      requiredRank: 'chan_truyen',
      description: 'Sát chiêu kinh thiên động địa chém rách vạn cổ, mỗi kiếm đoạt mệnh yêu ma vạn trượng.',
      effectSummary: 'Thần Thông Chiến Đấu: Bạo phát 320% sát thương bỏ qua hoàn toàn phòng ngự mục tiêu!',
      manualId: 'tt_tu_la_huyet_sat'
    },
    {
      id: 'shop_manual_huyet_than_kinh',
      name: 'Công Pháp: Huyết Thần Kinh',
      type: 'bi_tich',
      grade: 'Thiên Giai',
      costContribution: 3000,
      requiredRank: 'chan_truyen',
      description: 'Trấn phái cấm kỵ ma điển của Huyết Sát Tông, lấy huyết hóa thần, sát sinh luyện đạo.',
      effectSummary: 'Tâm Pháp Chủ Tu: +16% tốc độ tu luyện mỗi cấp, tăng 40% Công Kích và hút máu 15%.',
      manualId: 'tp_huyet_than_kinh'
    }
  ],
  thien_kiem_son: [
    {
      id: 'shop_tinh_huyet_kiem',
      name: 'Bình Tinh Huyết Yêu Thú (x5)',
      type: 'item',
      grade: 'Tam Phẩm',
      costContribution: 150,
      requiredRank: 'tap_dich',
      description: 'Bình ngọc đựng 5 giọt tinh huyết yêu thú dùng để Tôi Thể nhục thân.',
      effectSummary: 'Nhận ngay +5 giọt Tinh Huyết Yêu Thú dùng cho Tôi Thể.'
    },
    {
      id: 'shop_recipe_kiem_y',
      name: 'Đan Phương: Kiếm Ý Thông Linh Đan',
      type: 'dan_phuong',
      grade: 'Tứ Phẩm',
      costContribution: 700,
      requiredRank: 'ngoai_mon',
      description: 'Đan dược đặc chế giúp kiếm tu dung hòa tâm kiếm hợp nhất, tăng vĩnh viễn bạo kích.',
      effectSummary: 'Mở khóa công thức luyện Kiếm Ý Thông Linh Đan (vĩnh viễn +5% Bạo Kích Rate, +20% Bạo Thương).',
      recipeId: 'recipe_kiem_y_thong_linh'
    },
    {
      id: 'shop_recipe_hu_khong',
      name: 'Đan Phương: Hư Không Trảm Kiếm Đan',
      type: 'dan_phuong',
      grade: 'Ngũ Phẩm',
      costContribution: 1800,
      requiredRank: 'noi_mon',
      description: 'Kết tinh kiếm khí hư không, uống vào tăng vĩnh viễn tốc độ xuất chiêu và công kích.',
      effectSummary: 'Mở khóa công thức luyện Hư Không Trảm Kiếm Đan (vĩnh viễn +15 Tốc Độ, +200 Công Kích).',
      recipeId: 'recipe_hu_khong_tram_kiem'
    },
    {
      id: 'shop_manual_van_kiem_quy_tong',
      name: 'Công Pháp: Vạn Kiếm Quy Tông',
      type: 'bi_tich',
      grade: 'Thiên Giai',
      costContribution: 3000,
      requiredRank: 'chan_truyen',
      description: 'Trấn phái kiếm kinh của Thiên Kiếm Sơn, biến chân nguyên thành vạn thanh phi kiếm bảo hộ.',
      effectSummary: 'Tâm Pháp Chủ Tu: +17% tốc độ tu luyện mỗi cấp, tăng 35% Sát Thương Bạo Kích.',
      manualId: 'tp_van_kiem_quy_tong'
    },
    {
      id: 'shop_manual_nhat_kiem',
      name: 'Bí Tịch: Nhất Kiếm Phá Vạn Pháp',
      type: 'bi_tich',
      grade: 'Thần Giai',
      costContribution: 3500,
      requiredRank: 'chan_truyen',
      description: 'Tuyệt thế kiếm quyết đạt tới cảnh giới vô kiếm thắng hữu kiếm, nhất kiếm trảm phá hư vô.',
      effectSummary: 'Thần Thông Chiến Đấu: Sát thương 350% kiếm khí, bạo kích x2.5 sát thương cơ bản!',
      manualId: 'tt_nhat_kiem_pha_van_phap'
    },
    {
      id: 'shop_seed_ngoc_tuy',
      name: '1x Tinh Thể Ngọc Tủy Thần Thảo',
      type: 'seed',
      grade: 'Thần Phẩm',
      costContribution: 800,
      requiredRank: 'noi_mon',
      description: 'Hạt giống Thần Phẩm Cửu Chuyển Ngọc Tủy quý hiếm nhất tam giới.',
      effectSummary: 'Nhận 1 Tinh Thể Ngọc Tủy đem về gieo tại Linh Điền Động Phủ.',
      seedId: 'seed_cuu_chuyen_ngoc_tuy'
    }
  ],
  chinh_dao: null as any,
  ma_dao: null as any,
  kiem_phai: null as any
};

SECT_SHOP_ITEMS.chinh_dao = SECT_SHOP_ITEMS.thanh_van_mon;
SECT_SHOP_ITEMS.ma_dao = SECT_SHOP_ITEMS.huyet_sat_tong;
SECT_SHOP_ITEMS.kiem_phai = SECT_SHOP_ITEMS.thien_kiem_son;
SECT_SHOP_ITEMS.sect_thanh_van_mon = SECT_SHOP_ITEMS.thanh_van_mon;
SECT_SHOP_ITEMS.sect_huyet_sat_tong = SECT_SHOP_ITEMS.huyet_sat_tong;
SECT_SHOP_ITEMS.sect_thai_at_kiem_tong = SECT_SHOP_ITEMS.thien_kiem_son;

/**
 * Lấy danh sách hàng hóa Tàng Kinh Các theo môn phái
 */
export function getSectShopItems(sectId: SectId | string | null): SectShopItem[] {
  if (!sectId) return [];
  if (SECT_SHOP_ITEMS[sectId]) return SECT_SHOP_ITEMS[sectId];
  const sect = SECT_DATA_MAP[sectId];
  if (!sect) return SECT_SHOP_ITEMS.thanh_van_mon || [];

  const specialtyItems: SectShopItem[] = [
    {
      id: `shop_${sect.id}_tinh_hoa`,
      name: `Bình Tinh Hoa [${sect.name}] (x5)`,
      type: 'item',
      grade: 'Tam Phẩm',
      costContribution: 150 * sect.tier,
      requiredRank: 'tap_dich',
      description: `Bình ngọc chứa linh dịch tinh hoa do đệ tử ${sect.name} tinh luyện, bồi bổ đan điền.`,
      effectSummary: 'Tăng cường linh lực và khí huyết căn bản.'
    },
    {
      id: `shop_${sect.id}_recipe_breakthrough`,
      name: `Đan Phương: ${sect.shortName || sect.name} Đột Phá Đan`,
      type: 'dan_phuong',
      grade: sect.tier >= 4 ? 'Cực Phẩm' : 'Tứ Phẩm',
      costContribution: 600 * sect.tier,
      requiredRank: 'ngoai_mon',
      description: `Bí phương độc quyền của ${sect.name}, hỗ trợ phá vỡ bình cảnh tu vi.`,
      effectSummary: `Mở khóa công thức luyện bí đan độc môn của ${sect.name}.`,
      recipeId: `recipe_${sect.id}_dan`
    },
    {
      id: `shop_${sect.id}_recipe_bo_huyet`,
      name: `Đan Phương: Bổ Nguyên Cố Bản Hoàn`,
      type: 'dan_phuong',
      grade: 'Ngũ Phẩm',
      costContribution: 1200 * sect.tier,
      requiredRank: 'noi_mon',
      description: `Phương thuốc thần hiệu củng cố căn cơ, gia tăng vĩnh viễn căn cốt và thể phách.`,
      effectSummary: 'Mở khóa công thức luyện linh đan củng cố căn bản tu hành.',
      recipeId: `recipe_${sect.id}_bo_nguyen`
    },
    {
      id: `shop_${sect.id}_manual_than_thong`,
      name: `Bí Tịch: ${sect.specialtyName} Tuyệt Kỹ`,
      type: 'bi_tich',
      grade: sect.tier >= 4 ? 'Thần Giai' : 'Địa Giai',
      costContribution: 1800 * sect.tier,
      requiredRank: 'noi_mon',
      description: `Tuyệt kỹ trấn phái lưu truyền ngàn năm của ${sect.name}.`,
      effectSummary: `Thần Thông Chiến Đấu: Bộc phát uy lực trường phái ${sect.specialtyName}.`,
      manualId: `tt_${sect.id}_specialty`
    },
    {
      id: `shop_${sect.id}_manual_tran_phai`,
      name: `Công Pháp: ${sect.name} Tâm Kinh`,
      type: 'bi_tich',
      grade: 'Thiên Giai',
      costContribution: 2500 * sect.tier,
      requiredRank: 'chan_truyen',
      description: `Bộ tâm pháp tối cao của môn phái, tu luyện giúp tốc độ tăng tiến thần tốc.`,
      effectSummary: `Tâm Pháp Chủ Tu: +${12 + sect.tier * 2}% tốc độ tu luyện mỗi cấp.`,
      manualId: `tp_${sect.id}_tam_kinh`
    },
    {
      id: `shop_${sect.id}_seed_bao_thao`,
      name: `Cành Giống: ${sect.name} Tiên Thảo`,
      type: 'seed',
      grade: 'Ngũ Phẩm',
      costContribution: 400 * sect.tier,
      requiredRank: 'ngoai_mon',
      description: `Hạt giống tiên thảo quý hiếm được ươm mầm từ linh tuyền của ${sect.name}.`,
      effectSummary: 'Hạt giống quý đem về gieo tại Linh Điền Động Phủ.',
      seedId: `seed_${sect.id}_thao`
    }
  ];

  SECT_SHOP_ITEMS[sectId] = specialtyItems;
  return specialtyItems;
}

// ============================================
// 5. DANH SÁCH 5 THIÊN KIÊU ĐẤU PHÁP (LUẬN KIẾM)
// ============================================
export const SECT_ARENA_FIGHTERS: Record<SectId, SectArenaFighter[]> = {
  thanh_van_mon: [
    {
      id: 'tv_arena_5',
      name: 'Tống Đại Lực',
      title: 'Hạng 5 • Ngoại Môn Lực Sĩ',
      rankPosition: 5,
      realm: 6,
      realmName: 'Luyện Khí Tầng 6',
      element: 'tho',
      khiVan: 65,
      stats: {
        atk: 3200,
        def: 2400,
        hp: 18000,
        maxHp: 18000,
        speed: 18,
        critRate: 10
      },
      avatarEmoji: '🛡️',
      skillName: 'Khối Lỗi Thổ Thuẫn',
      skillDmgMultiplier: 1.4,
      description: 'Đệ tử ngoại môn khổ luyện Thiết Bố Sam, thân thể như bàn thạch vững chãi.',
      rewards: { contribution: 300, linhThach: 400, danhVong: 30 }
    },
    {
      id: 'tv_arena_4',
      name: 'Điền Linh Nhi',
      title: 'Hạng 4 • Hỏa Vân Tiên Tử',
      rankPosition: 4,
      realm: 14,
      realmName: 'Trúc Cơ Tầng 4',
      element: 'hoa',
      khiVan: 72,
      stats: {
        atk: 9500,
        def: 6000,
        hp: 45000,
        maxHp: 45000,
        speed: 35,
        critRate: 18
      },
      avatarEmoji: '🪭',
      skillName: 'Hổ Phách Chu Lăng Bạo',
      skillDmgMultiplier: 2.0,
      description: 'Ái nữ của thủ tọa Đại Trúc Phong, pháp bảo Hổ Phách Chu Lăng uyển chuyển khôn lường.',
      rewards: { contribution: 600, linhThach: 1000, danhVong: 60 }
    },
    {
      id: 'tv_arena_3',
      name: 'Tề Hạo',
      title: 'Hạng 3 • Hàn Băng Kiếm Khách',
      rankPosition: 3,
      realm: 24,
      realmName: 'Kim Đan Sơ Kỳ',
      element: 'bang',
      khiVan: 80,
      stats: {
        atk: 28000,
        def: 18000,
        hp: 120000,
        maxHp: 120000,
        speed: 55,
        critRate: 25
      },
      avatarEmoji: '❄️',
      skillName: 'Hàn Băng Kiếm Trận',
      skillDmgMultiplier: 2.5,
      description: 'Thủ tịch đệ tử Long Thủ Phong, kiếm khí hàn băng đóng băng kinh mạch đối thủ.',
      rewards: { contribution: 1200, linhThach: 2500, danhVong: 120 }
    },
    {
      id: 'tv_arena_2',
      name: 'Lục Tuyết Kỳ',
      title: 'Hạng 2 • Thiên Gia Kiếm Tiên',
      rankPosition: 2,
      realm: 34,
      realmName: 'Nguyên Anh Sơ Kỳ',
      element: 'loi',
      khiVan: 88,
      stats: {
        atk: 75000,
        def: 45000,
        hp: 350000,
        maxHp: 350000,
        speed: 85,
        critRate: 35
      },
      avatarEmoji: '⚡',
      skillName: 'Thần Kiếm Ngự Lôi Chân Quyết',
      skillDmgMultiplier: 3.5,
      description: 'Tuyệt thế tiên tử Tiểu Trúc Phong, cầm trong tay Thiên Gia Thần Kiếm dẫn động chín tầng thiên lôi.',
      rewards: { contribution: 2500, linhThach: 6000, danhVong: 250 }
    },
    {
      id: 'tv_arena_1',
      name: 'Tiêu Dật Tài',
      title: 'Hạng 1 • Đệ Nhất Thiên Kiêu',
      rankPosition: 1,
      realm: 44,
      realmName: 'Hóa Thần Sơ Kỳ',
      element: 'phong',
      khiVan: 95,
      stats: {
        atk: 180000,
        def: 110000,
        hp: 850000,
        maxHp: 850000,
        speed: 120,
        critRate: 45
      },
      avatarEmoji: '👑',
      skillName: 'Thanh Vân Thất Tinh Trảm',
      skillDmgMultiplier: 4.5,
      description: 'Đại sư huynh Thông Thiên Phong, đệ tử chân truyền của Chưởng Môn, đệ nhất thiên kiêu Chính Đạo.',
      rewards: { contribution: 5000, linhThach: 15000, danhVong: 500 }
    }
  ],
  huyet_sat_tong: [
    {
      id: 'hs_arena_5',
      name: 'Lệ Bất Phàm',
      title: 'Hạng 5 • Thiết Thi Ngoại Môn',
      rankPosition: 5,
      realm: 6,
      realmName: 'Luyện Khí Tầng 6',
      element: 'am',
      khiVan: 65,
      stats: {
        atk: 3600,
        def: 2100,
        hp: 17000,
        maxHp: 17000,
        speed: 20,
        critRate: 15
      },
      avatarEmoji: '💀',
      skillName: 'Thi Khí Toái Cốt',
      skillDmgMultiplier: 1.5,
      description: 'Ma tu khổ luyện huyết thi công, đòn đánh ẩn chứa độc tính âm hàn.',
      rewards: { contribution: 300, linhThach: 400, danhVong: 30 }
    },
    {
      id: 'hs_arena_4',
      name: 'Huyết Đao Cuồng Đồ',
      title: 'Hạng 4 • Sát Huyết Đao Khách',
      rankPosition: 4,
      realm: 14,
      realmName: 'Trúc Cơ Tầng 4',
      element: 'kim',
      khiVan: 72,
      stats: {
        atk: 11000,
        def: 5500,
        hp: 42000,
        maxHp: 42000,
        speed: 38,
        critRate: 22
      },
      avatarEmoji: '🪓',
      skillName: 'Cuồng Huyết Trảm Đầu Đao',
      skillDmgMultiplier: 2.2,
      description: 'Đao khách cuồng loạn lấy máu nuôi đao, chém đứt sinh cơ kẻ thù.',
      rewards: { contribution: 600, linhThach: 1000, danhVong: 60 }
    },
    {
      id: 'hs_arena_3',
      name: 'U Minh Yêu Nữ',
      title: 'Hạng 3 • U Hồn Thiếu Chủ',
      rankPosition: 3,
      realm: 24,
      realmName: 'Kim Đan Sơ Kỳ',
      element: 'am',
      khiVan: 80,
      stats: {
        atk: 32000,
        def: 16000,
        hp: 115000,
        maxHp: 115000,
        speed: 60,
        critRate: 30
      },
      avatarEmoji: '🥀',
      skillName: 'Cửu U Hấp Tinh Chưởng',
      skillDmgMultiplier: 2.6,
      description: 'Thiếu nữ ma đạo mị hoặc mê hồn, xuất chiêu đoạt mạng và hút cạn tinh hoa chân nguyên.',
      rewards: { contribution: 1200, linhThach: 2500, danhVong: 120 }
    },
    {
      id: 'hs_arena_2',
      name: 'Hắc Tâm Lão Quái',
      title: 'Hạng 2 • Huyết Đồ Ma Tôn',
      rankPosition: 2,
      realm: 34,
      realmName: 'Nguyên Anh Sơ Kỳ',
      element: 'hoa',
      khiVan: 88,
      stats: {
        atk: 82000,
        def: 42000,
        hp: 330000,
        maxHp: 330000,
        speed: 88,
        critRate: 38
      },
      avatarEmoji: '🔥',
      skillName: 'Ma Viêm Đoạt Phách Sát',
      skillDmgMultiplier: 3.6,
      description: 'Lão ma hung tàn khát máu, thao túng địa hỏa ma viêm thiêu đốt vạn vật.',
      rewards: { contribution: 2500, linhThach: 6000, danhVong: 250 }
    },
    {
      id: 'hs_arena_1',
      name: 'Quỷ Lệ Thiếu Tôn',
      title: 'Hạng 1 • Đệ Nhất Thiên Kiêu',
      rankPosition: 1,
      realm: 44,
      realmName: 'Hóa Thần Sơ Kỳ',
      element: 'am',
      khiVan: 95,
      stats: {
        atk: 195000,
        def: 105000,
        hp: 820000,
        maxHp: 820000,
        speed: 125,
        critRate: 50
      },
      avatarEmoji: '👑',
      skillName: 'Phệ Hồn Ma Bổng Tuyệt Diệt',
      skillDmgMultiplier: 4.8,
      description: 'Đại đệ tử kiêm phó tông chủ Ma Tông, mang theo Phệ Huyết Châu chấn nhiếp quần hùng.',
      rewards: { contribution: 5000, linhThach: 15000, danhVong: 500 }
    }
  ],
  thien_kiem_son: [
    {
      id: 'tk_arena_5',
      name: 'Lý Thiếu Kiếm',
      title: 'Hạng 5 • Kiếm Đồng Nhập Đạo',
      rankPosition: 5,
      realm: 6,
      realmName: 'Luyện Khí Tầng 6',
      element: 'kim',
      khiVan: 65,
      stats: {
        atk: 3500,
        def: 1900,
        hp: 16000,
        maxHp: 16000,
        speed: 25,
        critRate: 20
      },
      avatarEmoji: '🗡️',
      skillName: 'Phá Phong Kiếm Thức',
      skillDmgMultiplier: 1.6,
      description: 'Kiếm tu sơ nhập sơn môn, kiếm ý ngây thơ nhưng sắc bén nhanh nhẹn.',
      rewards: { contribution: 300, linhThach: 400, danhVong: 30 }
    },
    {
      id: 'tk_arena_4',
      name: 'Bạch Lăng Tiêu',
      title: 'Hạng 4 • Tật Phong Kiếm Khách',
      rankPosition: 4,
      realm: 14,
      realmName: 'Trúc Cơ Tầng 4',
      element: 'phong',
      khiVan: 72,
      stats: {
        atk: 10500,
        def: 5000,
        hp: 40000,
        maxHp: 40000,
        speed: 48,
        critRate: 25
      },
      avatarEmoji: '💨',
      skillName: 'Tật Phong Liệt Kiếm',
      skillDmgMultiplier: 2.3,
      description: 'Kiếm xuất vô ảnh vô tung, tốc độ nhanh như gió lốc chém rách hư không.',
      rewards: { contribution: 600, linhThach: 1000, danhVong: 60 }
    },
    {
      id: 'tk_arena_3',
      name: 'Độc Cô Tuyệt',
      title: 'Hạng 3 • Cuồng Lôi Kiếm Tử',
      rankPosition: 3,
      realm: 24,
      realmName: 'Kim Đan Sơ Kỳ',
      element: 'loi',
      khiVan: 80,
      stats: {
        atk: 30000,
        def: 15000,
        hp: 110000,
        maxHp: 110000,
        speed: 70,
        critRate: 35
      },
      avatarEmoji: '⚡',
      skillName: 'Cửu Tiêu Lôi Đình Kiếm',
      skillDmgMultiplier: 2.8,
      description: 'Kiếm ý kết hợp thiên lôi cuồng bạo, mỗi đường kiếm là một đạo sấm sét giáng trần.',
      rewards: { contribution: 1200, linhThach: 2500, danhVong: 120 }
    },
    {
      id: 'tk_arena_2',
      name: 'Vạn Kiếm Nhất',
      title: 'Hạng 2 • Trảm Long Kiếm Thánh',
      rankPosition: 2,
      realm: 34,
      realmName: 'Nguyên Anh Sơ Kỳ',
      element: 'kim',
      khiVan: 88,
      stats: {
        atk: 80000,
        def: 38000,
        hp: 310000,
        maxHp: 310000,
        speed: 100,
        critRate: 42
      },
      avatarEmoji: '🐉',
      skillName: 'Trảm Long Kiếm Khí Quyết',
      skillDmgMultiplier: 3.8,
      description: 'Trưởng lão trẻ tuổi thiên tài, từng một kiếm chém chết Giao Long ngàn năm nơi Bắc Hải.',
      rewards: { contribution: 2500, linhThach: 6000, danhVong: 250 }
    },
    {
      id: 'tk_arena_1',
      name: 'Độc Cô Cầu Bại',
      title: 'Hạng 1 • Đệ Nhất Thiên Kiêu',
      rankPosition: 1,
      realm: 44,
      realmName: 'Hóa Thần Sơ Kỳ',
      element: 'kim',
      khiVan: 95,
      stats: {
        atk: 190000,
        def: 95000,
        hp: 780000,
        maxHp: 780000,
        speed: 135,
        critRate: 55
      },
      avatarEmoji: '👑',
      skillName: 'Nhất Kiếm Phá Vạn Kiếp',
      skillDmgMultiplier: 5.0,
      description: 'Thủ tịch đại đệ tử Kiếm Tông, cầu một trận thua mà không được, kiếm đạo đăng phong tạo cực.',
      rewards: { contribution: 5000, linhThach: 15000, danhVong: 500 }
    }
  ],
  chinh_dao: null as any,
  ma_dao: null as any,
  kiem_phai: null as any
};

SECT_ARENA_FIGHTERS.chinh_dao = SECT_ARENA_FIGHTERS.thanh_van_mon;
SECT_ARENA_FIGHTERS.ma_dao = SECT_ARENA_FIGHTERS.huyet_sat_tong;
SECT_ARENA_FIGHTERS.kiem_phai = SECT_ARENA_FIGHTERS.thien_kiem_son;
SECT_ARENA_FIGHTERS.sect_thanh_van_mon = SECT_ARENA_FIGHTERS.thanh_van_mon;
SECT_ARENA_FIGHTERS.sect_huyet_sat_tong = SECT_ARENA_FIGHTERS.huyet_sat_tong;
SECT_ARENA_FIGHTERS.sect_thai_at_kiem_tong = SECT_ARENA_FIGHTERS.thien_kiem_son;

// Gán trường rank cho tất cả fighters
Object.values(SECT_ARENA_FIGHTERS).forEach(fighters => {
  if (Array.isArray(fighters)) {
    fighters.forEach(f => {
      f.rank = f.rankPosition;
    });
  }
});

// ============================================
// 6. HELPER FUNCTIONS
// ============================================

export function calculateSectRank(sectId: SectId | string | null, totalContribution: number): SectRank {
  if (!sectId) return 'tap_dich';
  for (let i = SECT_RANK_ORDER.length - 1; i >= 0; i--) {
    const r = SECT_RANK_ORDER[i];
    const detail = SECT_RANKS_CONFIG[r];
    if (detail && totalContribution >= detail.requiredContribution) {
      return r;
    }
  }
  return 'tap_dich';
}

export function createDefaultSectState(): SectState {
  return {
    sectId: null,
    rank: 'tap_dich',
    contribution: 0,
    totalContribution: 0,
    dailyQuests: [],
    unlockedRecipes: [],
    unlockedManuals: [],
    guardianArray: createDefaultGuardianArray(),
    occupiedVeinIds: [],
    lastVeinWarAt: 0,
    lastVeinClaimAt: 0,
    veinStates: {}
  };
}

export function getSectProfile(sectId: SectId | string | null): SectProfile | null {
  if (!sectId) return null;
  return SECT_PROFILES[sectId as SectId] || null;
}

export function getRankDetail(rank: SectRank): SectRankDetail {
  return SECT_RANKS_CONFIG[rank] || SECT_RANKS_CONFIG.tap_dich;
}

export function getRankTitle(sectId: SectId | null, rank: SectRank): string {
  if (!sectId) return 'Tán Tu Tự Do';
  const profile = SECT_PROFILES[sectId];
  if (!profile) return 'Tán Tu';
  const r = profile.ranks.find(x => x.rank === rank);
  return r ? r.title : SECT_RANKS_CONFIG[rank]?.title || 'Đệ Tử';
}

/**
 * Kiểm tra xem người chơi có đủ điều kiện thăng chức thân phận tiếp theo không
 */
export function checkCanPromoteSectRank(player: PlayerStats): {
  canPromote: boolean;
  currentRank: SectRank;
  currentRankDetail: SectRankDetail;
  nextRank: SectRank | null;
  nextRankDetail: SectRankDetail | null;
  missingContribution: number;
  missingRealm: number;
  reason: string;
} {
  const currentRank: SectRank = player.sectState?.rank || 'tap_dich';
  const currentRankDetail = getRankDetail(currentRank);
  const currentIdx = SECT_RANK_ORDER.indexOf(currentRank);

  if (currentIdx >= SECT_RANK_ORDER.length - 1) {
    return {
      canPromote: false,
      currentRank,
      currentRankDetail,
      nextRank: null,
      nextRankDetail: null,
      missingContribution: 0,
      missingRealm: 0,
      reason: 'Đã đạt thân phận tối cao trong tông môn!'
    };
  }

  const nextRank = SECT_RANK_ORDER[currentIdx + 1];
  const profile = player.sectState?.sectId ? SECT_PROFILES[player.sectState.sectId] : null;
  const nextRankDetail = (profile?.ranks.find(r => r.rank === nextRank)) || SECT_RANKS_CONFIG[nextRank];

  const totalContrib = player.sectState?.totalContribution || 0;
  const curRealm = player.currentRealm || 0;

  const reqRealm = nextRankDetail.requiredRealm ?? 0;
  const reqRealmName = nextRankDetail.realmName || 'Tu Tiên Giả';
  const missingContrib = Math.max(0, nextRankDetail.requiredContribution - totalContrib);
  const missingRealm = Math.max(0, reqRealm - curRealm);

  if (missingRealm > 0 && missingContrib > 0) {
    return {
      canPromote: false,
      currentRank,
      currentRankDetail,
      nextRank,
      nextRankDetail,
      missingContribution: missingContrib,
      missingRealm,
      reason: `Cần đạt cảnh giới [${reqRealmName}] và thêm ${missingContrib.toLocaleString()} Cống Hiến tích lũy.`
    };
  }

  if (missingRealm > 0) {
    return {
      canPromote: false,
      currentRank,
      currentRankDetail,
      nextRank,
      nextRankDetail,
      missingContribution: 0,
      missingRealm,
      reason: `Cảnh giới tu vi chưa đủ! Yêu cầu tối thiểu: [${reqRealmName}].`
    };
  }

  if (missingContrib > 0) {
    return {
      canPromote: false,
      currentRank,
      currentRankDetail,
      nextRank,
      nextRankDetail,
      missingContribution: missingContrib,
      missingRealm: 0,
      reason: `Điểm cống hiến tích lũy chưa đủ! Cần thêm ${missingContrib.toLocaleString()} Cống Hiến.`
    };
  }

  return {
    canPromote: true,
    currentRank,
    currentRankDetail,
    nextRank,
    nextRankDetail,
    missingContribution: 0,
    missingRealm: 0,
    reason: `Đủ điều kiện thăng phong [${nextRankDetail.title}]!`
  };
}

/**
 * Kiểm tra xem đã đến giờ nhận bổng lộc chưa (mỗi 24h hoặc qua ngày)
 */
export function canClaimDailySalary(sectState?: SectState | null): {
  canClaim: boolean;
  timeRemainingMs: number;
} {
  if (!sectState || !sectState.sectId) {
    return { canClaim: false, timeRemainingMs: 0 };
  }

  const lastClaim = sectState.lastSalaryClaimedAt || 0;
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const diff = now - lastClaim;

  if (diff >= ONE_DAY_MS) {
    return { canClaim: true, timeRemainingMs: 0 };
  }

  return { canClaim: false, timeRemainingMs: ONE_DAY_MS - diff };
}

/**
 * Lấy danh sách 5 đệ tử thiên tài luận kiếm của tông môn (tự động cân bằng theo Tier)
 */
export function getSectArenaFighters(sectId: SectId | string | null): SectArenaFighter[] {
  if (!sectId) return [];
  if (SECT_ARENA_FIGHTERS[sectId]) return SECT_ARENA_FIGHTERS[sectId];

  const sect = SECT_DATA_MAP[sectId];
  if (!sect) return SECT_ARENA_FIGHTERS.thanh_van_mon || [];

  const baseRealm = sect.requirements.minRealmIndex + 2;
  const multiplier = Math.pow(1.8, sect.tier);

  const fighters: SectArenaFighter[] = [
    {
      id: `${sect.id}_arena_5`,
      name: `${sect.shortName || sect.name} Đạo Đồng`,
      title: 'Hạng 5 • Ngoại Viện Tân Tú',
      rankPosition: 5,
      rank: 5,
      realm: baseRealm,
      realmName: `Tầng ${baseRealm}`,
      element: 'kim',
      khiVan: 60 + sect.tier * 5,
      stats: {
        atk: Math.floor(3000 * multiplier),
        def: Math.floor(2000 * multiplier),
        hp: Math.floor(15000 * multiplier),
        maxHp: Math.floor(15000 * multiplier),
        speed: 15 + sect.tier * 10,
        critRate: 10 + sect.tier * 3
      },
      avatarEmoji: sect.icon || '⚔️',
      skillName: `${sect.specialtyName} Nhập Môn Thức`,
      skillDmgMultiplier: 1.4,
      description: `Đệ tử mới nhập môn của ${sect.name}, tu vi cơ bản vững chắc.`,
      rewards: { contribution: 200 * sect.tier, linhThach: 300 * sect.tier, danhVong: 20 * sect.tier }
    },
    {
      id: `${sect.id}_arena_4`,
      name: `${sect.shortName || sect.name} Kiệt Xuất`,
      title: 'Hạng 4 • Ngoại Viện Thủ Tịch',
      rankPosition: 4,
      rank: 4,
      realm: baseRealm + 4,
      realmName: `Tầng ${baseRealm + 4}`,
      element: 'hoa',
      khiVan: 65 + sect.tier * 5,
      stats: {
        atk: Math.floor(8000 * multiplier),
        def: Math.floor(5000 * multiplier),
        hp: Math.floor(38000 * multiplier),
        maxHp: Math.floor(38000 * multiplier),
        speed: 30 + sect.tier * 10,
        critRate: 15 + sect.tier * 4
      },
      avatarEmoji: '🪭',
      skillName: `${sect.specialtyName} Liệt Dương Kích`,
      skillDmgMultiplier: 2.0,
      description: `Đệ tử kiệt xuất ngoại môn của ${sect.name}, pháp thuật lão luyện.`,
      rewards: { contribution: 450 * sect.tier, linhThach: 700 * sect.tier, danhVong: 45 * sect.tier }
    },
    {
      id: `${sect.id}_arena_3`,
      name: `${sect.shortName || sect.name} Chân Truyền`,
      title: 'Hạng 3 • Nội Điện Tinh Anh',
      rankPosition: 3,
      rank: 3,
      realm: baseRealm + 8,
      realmName: `Tầng ${baseRealm + 8}`,
      element: 'loi',
      khiVan: 75 + sect.tier * 5,
      stats: {
        atk: Math.floor(22000 * multiplier),
        def: Math.floor(14000 * multiplier),
        hp: Math.floor(95000 * multiplier),
        maxHp: Math.floor(95000 * multiplier),
        speed: 50 + sect.tier * 12,
        critRate: 22 + sect.tier * 4
      },
      avatarEmoji: '⚡',
      skillName: `${sect.specialtyName} Lôi Đình Quyết`,
      skillDmgMultiplier: 2.6,
      description: `Chân truyền đệ tử nổi danh của ${sect.name}, kiếm ý sắc bén dị thường.`,
      rewards: { contribution: 900 * sect.tier, linhThach: 1800 * sect.tier, danhVong: 90 * sect.tier }
    },
    {
      id: `${sect.id}_arena_2`,
      name: `${sect.shortName || sect.name} Thánh Tử`,
      title: 'Hạng 2 • Tông Môn Thiên Kiêu',
      rankPosition: 2,
      rank: 2,
      realm: baseRealm + 12,
      realmName: `Tầng ${baseRealm + 12}`,
      element: 'bang',
      khiVan: 85 + sect.tier * 3,
      stats: {
        atk: Math.floor(60000 * multiplier),
        def: Math.floor(36000 * multiplier),
        hp: Math.floor(260000 * multiplier),
        maxHp: Math.floor(260000 * multiplier),
        speed: 75 + sect.tier * 12,
        critRate: 30 + sect.tier * 5
      },
      avatarEmoji: '❄️',
      skillName: `${sect.specialtyName} Băng Phách Hàn Quang`,
      skillDmgMultiplier: 3.5,
      description: `Thiên kiêu tuyệt đỉnh của ${sect.name}, có triển vọng kế thừa y bát tông chủ.`,
      rewards: { contribution: 1800 * sect.tier, linhThach: 4500 * sect.tier, danhVong: 180 * sect.tier }
    },
    {
      id: `${sect.id}_arena_1`,
      name: `${sect.shortName || sect.name} Đệ Nhất Kiêu`,
      title: 'Hạng 1 • Đệ Nhất Thiên Kiêu',
      rankPosition: 1,
      rank: 1,
      realm: baseRealm + 16,
      realmName: `Tầng ${baseRealm + 16}`,
      element: 'phong',
      khiVan: 95,
      stats: {
        atk: Math.floor(150000 * multiplier),
        def: Math.floor(90000 * multiplier),
        hp: Math.floor(650000 * multiplier),
        maxHp: Math.floor(650000 * multiplier),
        speed: 100 + sect.tier * 15,
        critRate: 40 + sect.tier * 5
      },
      avatarEmoji: '👑',
      skillName: `${sect.specialtyName} Vạn Kiếp Trấn Thế Trảm`,
      skillDmgMultiplier: 4.6,
      description: `Đại sư huynh chấp chưởng luận kiếm đài của ${sect.name}, bất khả chiến bại.`,
      rewards: { contribution: 3500 * sect.tier, linhThach: 10000 * sect.tier, danhVong: 350 * sect.tier }
    }
  ];

  SECT_ARENA_FIGHTERS[sectId] = fighters;
  return fighters;
}

/**
 * Giải quyết trận đấu Luận Kiếm Sơn Môn
 */
export function resolveSectArenaBattle(
  player: PlayerStats,
  opponent: SectArenaFighter
): {
  victory: boolean;
  logs: string[];
  playerRemainingHp: number;
  oppRemainingHp: number;
  rewards: {
    contribution: number;
    linhThach: number;
    danhVong: number;
  };
} {
  const cStats = calculateCombatStats(player);
  const playerAtk = Math.max(10, cStats.atk);
  const playerDef = Math.max(5, cStats.def);
  const playerMaxHp = Math.max(100, player.maxKhiHuyet || 500);
  const playerSpeed = Math.max(10, cStats.speed);
  const playerCrit = Math.min(80, cStats.critRate);

  const oppAtk = opponent.stats.atk;
  const oppDef = opponent.stats.def;
  const oppMaxHp = opponent.stats.maxHp;
  const oppSpeed = opponent.stats.speed;
  const oppCrit = opponent.stats.critRate;

  // Ngũ hành tương khắc
  const elemRel = getElementalCombatModifier(player.linhCan?.element, opponent.element);
  const elemMod = elemRel.playerDamageMod;
  const elemDefMod = elemRel.playerDefenseMod;

  let curPlayerHp = playerMaxHp;
  let curOppHp = oppMaxHp;
  const logs: string[] = [];

  const playerFirst = playerSpeed >= oppSpeed;
  logs.push(`Trận đấu bắt đầu! ${playerFirst ? 'Ngươi xuất chiêu trước!' : `${opponent.name} tốc độ vượt trội, chiếm tiên cơ!`}`);

  if (elemMod > 1) {
    logs.push(`✨ Thuộc tính Linh Căn áp chế đối thủ (+${Math.round((elemMod - 1) * 100)}% sát thương)!`);
  } else if (elemMod < 1) {
    logs.push(`⚠️ Thuộc tính đối phương khắc chế ngươi (-${Math.round((1 - elemMod) * 100)}% sát thương)!`);
  }

  // Giả lập tối đa 8 hiệp đấu
  for (let round = 1; round <= 8; round++) {
    if (curPlayerHp <= 0 || curOppHp <= 0) break;

    // Hiệp đấu
    if (playerFirst) {
      // Player đánh
      const isCrit = Math.random() * 100 < playerCrit;
      const critMul = isCrit ? (1.5 + (cStats.critDmg / 100)) : 1.0;
      const rawDmg = Math.max(playerAtk * 0.35, playerAtk - oppDef * 0.45);
      const dealt = Math.max(20, Math.floor(rawDmg * critMul * elemMod * (0.9 + Math.random() * 0.2)));
      curOppHp = Math.max(0, curOppHp - dealt);
      logs.push(`Hiệp ${round}: Ngươi vung thần thông giáng ${dealt.toLocaleString()} sát thương ${isCrit ? '💥 (BẠO KÍCH!)' : ''} lên ${opponent.name}.`);

      if (curOppHp <= 0) break;

      // Đối thủ đánh
      const isOppCrit = Math.random() * 100 < oppCrit;
      const oppRawDmg = Math.max(oppAtk * 0.3, oppAtk - playerDef * 0.5);
      const oppDealt = Math.max(15, Math.floor(oppRawDmg * (isOppCrit ? 1.5 : 1.0) * (0.9 + Math.random() * 0.2) * elemDefMod));
      curPlayerHp = Math.max(0, curPlayerHp - oppDealt);
      logs.push(`Hiệp ${round}: ${opponent.name} thi triển [${opponent.skillName}] đánh lui ngươi, gây ${oppDealt.toLocaleString()} sát thương!`);
    } else {
      // Đối thủ đánh trước
      const isOppCrit = Math.random() * 100 < oppCrit;
      const oppRawDmg = Math.max(oppAtk * 0.3, oppAtk - playerDef * 0.5);
      const oppDealt = Math.max(15, Math.floor(oppRawDmg * (isOppCrit ? 1.5 : 1.0) * (0.9 + Math.random() * 0.2) * elemDefMod));
      curPlayerHp = Math.max(0, curPlayerHp - oppDealt);
      logs.push(`Hiệp ${round}: ${opponent.name} xuất thủ [${opponent.skillName}], giáng ${oppDealt.toLocaleString()} sát thương!`);

      if (curPlayerHp <= 0) break;

      // Player phản công
      const isCrit = Math.random() * 100 < playerCrit;
      const critMul = isCrit ? (1.5 + (cStats.critDmg / 100)) : 1.0;
      const rawDmg = Math.max(playerAtk * 0.35, playerAtk - oppDef * 0.45);
      const dealt = Math.max(20, Math.floor(rawDmg * critMul * elemMod * (0.9 + Math.random() * 0.2)));
      curOppHp = Math.max(0, curOppHp - dealt);
      logs.push(`Hiệp ${round}: Ngươi phản kích mãnh liệt, gây ${dealt.toLocaleString()} sát thương ${isCrit ? '💥 (BẠO KÍCH!)' : ''}!`);
    }
  }

  const victory = curOppHp <= 0 || (curOppHp < curPlayerHp && curPlayerHp > 0);

  if (victory) {
    logs.push(`🏆 CHIẾN THẮNG! Đạo hữu đánh bại ${opponent.name}, danh chấn Luận Kiếm Đài!`);
  } else {
    logs.push(`💔 THẤT BẠI! Kiếm khí của ${opponent.name} quá mức hung hiểm, ngươi đành nhận thua thoái lui.`);
  }

  return {
    victory,
    logs,
    playerRemainingHp: curPlayerHp,
    oppRemainingHp: curOppHp,
    rewards: opponent.rewards
  };
}

// ============================================
// 8. CẤU HÌNH 10 CẤP HỘ SƠN ĐẠI TRẬN (SECT GUARDIAN ARRAY)
// ============================================
export interface SectArrayLevelDef {
  level: number;
  maxExp: number;
  arrayName: string;
  buffs: {
    damageReduction: number;
    combatStartShieldHp: number;
    tribulationInjuryReduction: number;
  };
  description: string;
}

export const SECT_ARRAY_LEVELS_CONFIG: Record<number, SectArrayLevelDef> = {
  1: {
    level: 1,
    maxExp: 2000,
    arrayName: 'Cửu Cung Bát Quái Trận',
    buffs: { damageReduction: 2, combatStartShieldHp: 500, tribulationInjuryReduction: 0 },
    description: 'Trận pháp hộ sơn sơ khai, lấy cửu cung bát quái làm cơ sở, giảm 2% thương tổn và tạo 500 hộ thuẫn Turn 1.'
  },
  2: {
    level: 2,
    maxExp: 4500,
    arrayName: 'Tứ Tượng Hộ Môn Trận',
    buffs: { damageReduction: 3.5, combatStartShieldHp: 1000, tribulationInjuryReduction: 5 },
    description: 'Tứ Tượng linh thú trấn giữ bốn phương, giảm 3.5% thương tổn, khiên 1,000 HP, giảm 5% tổn thất độ kiếp.'
  },
  3: {
    level: 3,
    maxExp: 8000,
    arrayName: 'Thái Ất Hộ Sơn Trận',
    buffs: { damageReduction: 5, combatStartShieldHp: 2000, tribulationInjuryReduction: 10 },
    description: 'Thái Ất huyền quang lưu chuyển, tăng 5% miễn thương, khiên 2,000 HP, giảm 10% tổn thất độ kiếp.'
  },
  4: {
    level: 4,
    maxExp: 15000,
    arrayName: 'Ngũ Hành Kim Cương Trận',
    buffs: { damageReduction: 7.5, combatStartShieldHp: 3500, tribulationInjuryReduction: 15 },
    description: 'Ngũ hành tương sinh kết thành kim cương bất hoại, giảm 7.5% thương tổn, khiên 3,500 HP, giảm 15% tổn thất độ kiếp.'
  },
  5: {
    level: 5,
    maxExp: 25000,
    arrayName: 'Thất Tinh Quy Tông Trận',
    buffs: { damageReduction: 10, combatStartShieldHp: 6000, tribulationInjuryReduction: 20 },
    description: 'Bắc Đẩu thất tinh dẫn động thiên uy, giảm 10% thương tổn, khiên 6,000 HP, giảm 20% tổn thất độ kiếp.'
  },
  6: {
    level: 6,
    maxExp: 45000,
    arrayName: 'Bát Hoang Càn Khôn Trận',
    buffs: { damageReduction: 12.5, combatStartShieldHp: 10000, tribulationInjuryReduction: 25 },
    description: 'Càn Khôn nghịch chuyển, bát hoang thần lôi hộ môn, giảm 12.5% thương tổn, khiên 10,000 HP, giảm 25% tổn thất độ kiếp.'
  },
  7: {
    level: 7,
    maxExp: 75000,
    arrayName: 'Cửu U Hỗn Thiên Trận',
    buffs: { damageReduction: 15, combatStartShieldHp: 15000, tribulationInjuryReduction: 30 },
    description: 'Hỗn Thiên linh quang giao hòa, giảm 15% thương tổn, khiên 15,000 HP, giảm 30% tổn thất độ kiếp.'
  },
  8: {
    level: 8,
    maxExp: 110000,
    arrayName: 'Hư Không Tru Ma Trận',
    buffs: { damageReduction: 17, combatStartShieldHp: 20000, tribulationInjuryReduction: 35 },
    description: 'Không gian vặn vẹo ngăn cản vạn kích, giảm 17% thương tổn, khiên 20,000 HP, giảm 35% tổn thất độ kiếp.'
  },
  9: {
    level: 9,
    maxExp: 150000,
    arrayName: 'Vạn Kiếm Quy Tông Hộ Sơn Trận',
    buffs: { damageReduction: 18.5, combatStartShieldHp: 25000, tribulationInjuryReduction: 40 },
    description: 'Hàng vạn chuôi phi kiếm lượn quanh sơn môn, sát khí trùng thiên, giảm 18.5% thương tổn, khiên 25,000 HP, giảm 40% tổn thất độ kiếp.'
  },
  10: {
    level: 10,
    maxExp: 200000,
    arrayName: 'Thái Sơ Hỗn Độn Tiên Thiên Đại Trận',
    buffs: { damageReduction: 20, combatStartShieldHp: 30000, tribulationInjuryReduction: 50 },
    description: 'Đại trận cực cảnh viên mãn, hỗn độn quy nhất, giảm 20% thương tổn, khiên 30,000 HP, giảm 50% tổn thất độ kiếp!'
  }
};

export function createDefaultGuardianArray(): SectGuardianArray {
  const cfg = SECT_ARRAY_LEVELS_CONFIG[1];
  return {
    level: 1,
    exp: 0,
    maxExp: cfg.maxExp,
    arrayName: cfg.arrayName,
    buffs: { ...cfg.buffs }
  };
}

// ============================================
// 9. DANH MỤC 15 ĐẠI LINH MẠCH THÁI CỔ (5 TIERS x 3 MẠCH)
// ============================================
export const SECT_SPIRIT_VEINS_CONFIG: SpiritVein[] = [
  // --- TIER 1 ---
  {
    id: 'vein_tier1_herb',
    name: 'Bách Thảo Nhất Giai Mạch',
    type: 'herb',
    tier: 1,
    occupiedSectId: 'sect_thao_duoc_coc',
    occupiedAt: 0,
    defensePower: 500,
    guardianNpc: {
      name: 'Triệu Thảo Trưởng Lão',
      title: 'Dược Mạch Trấn Thủ',
      realmIndex: 9, // Luyện Khí Đỉnh Phong
      combatStats: {
        hp: 3000,
        maxHp: 3000,
        atk: 280,
        def: 180,
        speed: 75
      }
    },
    buffs: {
      herbGrowthSpeedBonus: 15,
      dailyLinhThachStipend: 300
    }
  },
  {
    id: 'vein_tier1_ore',
    name: 'Hắc Thiết Quặng Mạch',
    type: 'ore',
    tier: 1,
    occupiedSectId: 'sect_thiet_khi_mon',
    occupiedAt: 0,
    defensePower: 500,
    guardianNpc: {
      name: 'Hắc Thiết Thủ Hộ Giả',
      title: 'Quáng Mạch Hộ Pháp',
      realmIndex: 9,
      combatStats: {
        hp: 3500,
        maxHp: 3500,
        atk: 260,
        def: 220,
        speed: 65
      }
    },
    buffs: {
      oreYieldBonus: 20,
      dailyLinhThachStipend: 350
    }
  },
  {
    id: 'vein_tier1_cult',
    name: 'Tụ Khí Linh Nhãn',
    type: 'cultivation',
    tier: 1,
    occupiedSectId: 'sect_hoang_nguyet_phai',
    occupiedAt: 0,
    defensePower: 500,
    guardianNpc: {
      name: 'Nguyệt Ảnh Chấp Sự',
      title: 'Linh Nhãn Trấn Tọa',
      realmIndex: 9,
      combatStats: {
        hp: 2800,
        maxHp: 2800,
        atk: 300,
        def: 160,
        speed: 85
      }
    },
    buffs: {
      tuViSpeedBonus: 10,
      dailyLinhThachStipend: 400
    }
  },

  // --- TIER 2 ---
  {
    id: 'vein_tier2_herb',
    name: 'Thanh Thủy Chu Quả Sơn',
    type: 'herb',
    tier: 2,
    occupiedSectId: 'sect_huyen_thuy_cung',
    occupiedAt: 0,
    defensePower: 1200,
    guardianNpc: {
      name: 'Thủy Nguyệt Tiên Cô',
      title: 'Dược Mạch Hộ Pháp',
      realmIndex: 18, // Trúc Cơ Đỉnh Phong
      combatStats: {
        hp: 8500,
        maxHp: 8500,
        atk: 850,
        def: 600,
        speed: 140
      }
    },
    buffs: {
      herbGrowthSpeedBonus: 25,
      dailyLinhThachStipend: 800
    }
  },
  {
    id: 'vein_tier2_ore',
    name: 'Huyền Thiết Khoáng Mạch',
    type: 'ore',
    tier: 2,
    occupiedSectId: 'sect_kim_kiem_tong',
    occupiedAt: 0,
    defensePower: 1200,
    guardianNpc: {
      name: 'Kim Cương Trưởng Lão',
      title: 'Huyền Thiết Thủ Tọa',
      realmIndex: 18,
      combatStats: {
        hp: 10000,
        maxHp: 10000,
        atk: 800,
        def: 750,
        speed: 120
      }
    },
    buffs: {
      oreYieldBonus: 30,
      dailyLinhThachStipend: 900
    }
  },
  {
    id: 'vein_tier2_cult',
    name: 'Ôn Tuyền Đạo Cốc',
    type: 'cultivation',
    tier: 2,
    occupiedSectId: 'sect_man_hoang_tong',
    occupiedAt: 0,
    defensePower: 1200,
    guardianNpc: {
      name: 'Minh Đạo Chân Nhân',
      title: 'Đạo Cốc Trấn Thủ',
      realmIndex: 18,
      combatStats: {
        hp: 9200,
        maxHp: 9200,
        atk: 920,
        def: 580,
        speed: 145
      }
    },
    buffs: {
      tuViSpeedBonus: 18,
      dailyLinhThachStipend: 1000
    }
  },

  // --- TIER 3 ---
  {
    id: 'vein_tier3_herb',
    name: 'Vạn Niên Huyết Chi Cốc',
    type: 'herb',
    tier: 3,
    occupiedSectId: 'sect_huyet_sat_tong',
    occupiedAt: 0,
    defensePower: 2500,
    guardianNpc: {
      name: 'Huyết Ma Lão Tổ',
      title: 'Dược Cốc Hộ Pháp',
      realmIndex: 27, // Kim Đan Hậu Kỳ
      combatStats: {
        hp: 25000,
        maxHp: 25000,
        atk: 2400,
        def: 1800,
        speed: 260
      }
    },
    buffs: {
      herbGrowthSpeedBonus: 35,
      dailyLinhThachStipend: 2000
    }
  },
  {
    id: 'vein_tier3_ore',
    name: 'Thiên Canh Thần Khoáng',
    type: 'ore',
    tier: 3,
    occupiedSectId: 'sect_thien_tran_cac',
    occupiedAt: 0,
    defensePower: 2500,
    guardianNpc: {
      name: 'Trận Trí Chân Quân',
      title: 'Thần Khoáng Đại Trận Chủ',
      realmIndex: 27,
      combatStats: {
        hp: 28000,
        maxHp: 28000,
        atk: 2200,
        def: 2100,
        speed: 240
      }
    },
    buffs: {
      oreYieldBonus: 40,
      dailyLinhThachStipend: 2200
    }
  },
  {
    id: 'vein_tier3_cult',
    name: 'Ngũ Hành Tụ Linh Phong',
    type: 'cultivation',
    tier: 3,
    occupiedSectId: 'sect_dan_dinh_tong',
    occupiedAt: 0,
    defensePower: 2500,
    guardianNpc: {
      name: 'Đan Đỉnh Thượng Nhân',
      title: 'Linh Phong Tọa Chủ',
      realmIndex: 27,
      combatStats: {
        hp: 24000,
        maxHp: 24000,
        atk: 2600,
        def: 1700,
        speed: 280
      }
    },
    buffs: {
      tuViSpeedBonus: 25,
      dailyLinhThachStipend: 2500
    }
  },

  // --- TIER 4 ---
  {
    id: 'vein_tier4_herb',
    name: 'Thái Ất Tinh Vân Động',
    type: 'herb',
    tier: 4,
    occupiedSectId: 'sect_thai_at_kiem_tong',
    occupiedAt: 0,
    defensePower: 5000,
    guardianNpc: {
      name: 'Thái Ất Kiếm Tôn',
      title: 'Kiếm Động Trấn Thủ',
      realmIndex: 36, // Nguyên Anh Viên Mãn
      combatStats: {
        hp: 65000,
        maxHp: 65000,
        atk: 6800,
        def: 5200,
        speed: 450
      }
    },
    buffs: {
      herbGrowthSpeedBonus: 50,
      dailyLinhThachStipend: 5000
    }
  },
  {
    id: 'vein_tier4_ore',
    name: 'Tử Tinh Thần Mạch',
    type: 'ore',
    tier: 4,
    occupiedSectId: 'sect_bat_quai_tien_mon',
    occupiedAt: 0,
    defensePower: 5000,
    guardianNpc: {
      name: 'Bát Quái Tôn Giả',
      title: 'Tử Tinh Khai Minh',
      realmIndex: 36,
      combatStats: {
        hp: 72000,
        maxHp: 72000,
        atk: 6200,
        def: 6000,
        speed: 420
      }
    },
    buffs: {
      oreYieldBonus: 55,
      dailyLinhThachStipend: 5500
    }
  },
  {
    id: 'vein_tier4_cult',
    name: 'Hư Không Linh Tuyền',
    type: 'cultivation',
    tier: 4,
    occupiedSectId: 'sect_cuu_u_ma_dien',
    occupiedAt: 0,
    defensePower: 5000,
    guardianNpc: {
      name: 'Cửu U Ma Tôn',
      title: 'Linh Tuyền Ma Soái',
      realmIndex: 36,
      combatStats: {
        hp: 68000,
        maxHp: 68000,
        atk: 7200,
        def: 5000,
        speed: 480
      }
    },
    buffs: {
      tuViSpeedBonus: 35,
      dailyLinhThachStipend: 6000
    }
  },

  // --- TIER 5 ---
  {
    id: 'vein_tier5_herb',
    name: 'Hỗn Độn Dược Điền Thái Cổ',
    type: 'herb',
    tier: 5,
    occupiedSectId: 'sect_thai_so_thanh_dia',
    occupiedAt: 0,
    defensePower: 10000,
    guardianNpc: {
      name: 'Thái Sơ Chí Tôn',
      title: 'Thái Cổ Dược Chủ',
      realmIndex: 45, // Hóa Thần Cực Cảnh
      combatStats: {
        hp: 180000,
        maxHp: 180000,
        atk: 18000,
        def: 14000,
        speed: 750
      }
    },
    buffs: {
      herbGrowthSpeedBonus: 70,
      dailyLinhThachStipend: 12000
    }
  },
  {
    id: 'vein_tier5_ore',
    name: 'Vạn Cổ Lôi Thần Mạch',
    type: 'ore',
    tier: 5,
    occupiedSectId: 'sect_bat_diet_ma_cung',
    occupiedAt: 0,
    defensePower: 10000,
    guardianNpc: {
      name: 'Bất Diệt Lôi Ma',
      title: 'Lôi Tộc Hộ Mạch Giả',
      realmIndex: 45,
      combatStats: {
        hp: 200000,
        maxHp: 200000,
        atk: 19500,
        def: 15000,
        speed: 720
      }
    },
    buffs: {
      oreYieldBonus: 80,
      dailyLinhThachStipend: 13000
    }
  },
  {
    id: 'vein_tier5_cult',
    name: 'Sinh Mệnh Bản Nguyên Trì',
    type: 'cultivation',
    tier: 5,
    occupiedSectId: 'sect_luan_hoi_tien_dien',
    occupiedAt: 0,
    defensePower: 10000,
    guardianNpc: {
      name: 'Luân Hồi Đạo Chủ',
      title: 'Bản Nguyên Thần Quân',
      realmIndex: 45,
      combatStats: {
        hp: 175000,
        maxHp: 175000,
        atk: 21000,
        def: 13500,
        speed: 800
      }
    },
    buffs: {
      tuViSpeedBonus: 50,
      dailyLinhThachStipend: 15000
    }
  }
];

/**
 * Lấy danh sách 3 Linh Mạch của Tier tương ứng, kết hợp runtime state đã lưu trong SectState
 */
export function getSectVeinsForTier(tier: SectTier, sectState?: SectState): SpiritVein[] {
  const baseVeins = SECT_SPIRIT_VEINS_CONFIG.filter(v => v.tier === tier);
  return baseVeins.map(v => {
    const saved = sectState?.veinStates?.[v.id];
    if (saved) {
      return {
        ...v,
        occupiedSectId: saved.occupiedSectId ?? v.occupiedSectId,
        occupiedAt: saved.occupiedAt ?? v.occupiedAt,
        defensePower: saved.defensePower ?? v.defensePower
      };
    }
    // Nếu sectState có occupiedVeinIds bao gồm vein này nhưng chưa có trong veinStates
    if (sectState?.occupiedVeinIds?.includes(v.id) && sectState.sectId) {
      return {
        ...v,
        occupiedSectId: sectState.sectId
      };
    }
    return { ...v };
  });
}

/**
 * Tra cứu thông tin Linh Mạch theo ID
 */
export function getSectVeinById(veinId: string, sectState?: SectState): SpiritVein | undefined {
  const base = SECT_SPIRIT_VEINS_CONFIG.find(v => v.id === veinId);
  if (!base) return undefined;
  const saved = sectState?.veinStates?.[base.id];
  if (saved) {
    return {
      ...base,
      occupiedSectId: saved.occupiedSectId ?? base.occupiedSectId,
      occupiedAt: saved.occupiedAt ?? base.occupiedAt,
      defensePower: saved.defensePower ?? base.defensePower
    };
  }
  if (sectState?.occupiedVeinIds?.includes(base.id) && sectState.sectId) {
    return {
      ...base,
      occupiedSectId: sectState.sectId
    };
  }
  return { ...base };
}

