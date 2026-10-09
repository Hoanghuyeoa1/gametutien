// lib/realm-icons.ts
// Bộ ánh xạ Huy Hiệu / Icon Tiên Hiệp cho từng Cảnh Giới Tu Tiên

import {
  LucideIcon,
  Leaf,
  CircleDot,
  Wind,
  Feather,
  Layers,
  Landmark,
  Sun,
  Gem,
  Baby,
  Sparkle,
  Zap,
  Eye,
  Orbit,
  Eclipse,
  Infinity,
  Shuffle,
  Crown,
  ShieldAlert,
  CloudLightning,
  FlameKindling,
  Trophy,
  Award,
  Swords,
  Star,
  Sparkles
} from 'lucide-react';

export interface RealmBadgeConfig {
  stage: string;
  badgeTitle: string;
  badgeGrade: string; // Phẩm cấp huy hiệu
  icon: LucideIcon;
  subIcon: LucideIcon;
  theme: {
    borderClass: string;
    glowClass: string;
    bgGradient: string;
    iconColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    auraText: string;
  };
  description: string;
}

export const REALM_BADGES: Record<string, RealmBadgeConfig> = {
  'Phàm Nhân': {
    stage: 'Phàm Nhân',
    badgeTitle: 'Phàm Thể Thảo Mộc',
    badgeGrade: 'Phàm Trần',
    icon: Leaf,
    subIcon: CircleDot,
    theme: {
      borderClass: 'border-zinc-600/60 hover:border-zinc-400',
      glowClass: 'shadow-[0_0_20px_rgba(113,113,122,0.35)]',
      bgGradient: 'bg-gradient-to-br from-zinc-800/40 via-zinc-900/60 to-black/90',
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-zinc-900',
      badgeBorder: 'border-zinc-600/70',
      badgeText: 'text-zinc-300',
      auraText: 'Khí tức bình phàm, chưa ngưng tụ linh lực'
    },
    description: 'Thân phàm trần tục, hấp thu linh khí thảo mộc bước đầu cảm ứng thiên địa.'
  },
  'Luyện Khí': {
    stage: 'Luyện Khí',
    badgeTitle: 'Khí Tức Vòng Xoáy',
    badgeGrade: 'Linh Khí',
    icon: Wind,
    subIcon: Feather,
    theme: {
      borderClass: 'border-cyan-500/70 hover:border-cyan-400',
      glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.45)]',
      bgGradient: 'bg-gradient-to-br from-cyan-950/50 via-teal-950/40 to-[#0e171b]',
      iconColor: 'text-cyan-300 animate-pulse',
      badgeBg: 'bg-cyan-950/80',
      badgeBorder: 'border-cyan-600/60',
      badgeText: 'text-cyan-200',
      auraText: 'Linh khí vần vũ quanh thân, kinh mạch khai thông'
    },
    description: 'Dẫn khí nhập thể, chu thiên vận hành, linh lực tích tụ thành khí xoáy đan điền.'
  },
  'Trúc Cơ': {
    stage: 'Trúc Cơ',
    badgeTitle: 'Thần Tháp Đạo Cơ',
    badgeGrade: 'Đạo Cơ',
    icon: Layers,
    subIcon: Landmark,
    theme: {
      borderClass: 'border-amber-500/70 hover:border-amber-400',
      glowClass: 'shadow-[0_0_30px_rgba(245,158,11,0.5)]',
      bgGradient: 'bg-gradient-to-br from-amber-950/60 via-[#1f170e] to-[#120f0a]',
      iconColor: 'text-amber-300',
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-600/60',
      badgeText: 'text-amber-200',
      auraText: 'Đạo đài ngưng kết, nền tảng vạn thế trường tồn'
    },
    description: 'Linh khí hóa dịch, đúc thành cửu tầng đạo đài vững như bàn thạch.'
  },
  'Kim Đan': {
    stage: 'Kim Đan',
    badgeTitle: 'Kim Đan Thái Dương',
    badgeGrade: 'Kim Đan',
    icon: Sun,
    subIcon: Gem,
    theme: {
      borderClass: 'border-yellow-400/80 hover:border-yellow-300',
      glowClass: 'shadow-[0_0_35px_rgba(250,204,21,0.6)]',
      bgGradient: 'bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-[#181408]',
      iconColor: 'text-yellow-300 animate-pulse',
      badgeBg: 'bg-yellow-950/80',
      badgeBorder: 'border-yellow-500/70',
      badgeText: 'text-yellow-200',
      auraText: 'Nhất lạp kim đan thôn nhập phúc, ngã mệnh do ngã bất do thiên'
    },
    description: 'Đạo cơ kết tinh thành viên kim đan bất diệt, tỏa ra kim quang rực rỡ như thái dương.'
  },
  'Nguyên Anh': {
    stage: 'Nguyên Anh',
    badgeTitle: 'Kim Thân Anh Nhi',
    badgeGrade: 'Nguyên Anh',
    icon: Baby,
    subIcon: Sparkle,
    theme: {
      borderClass: 'border-purple-500/80 hover:border-purple-300',
      glowClass: 'shadow-[0_0_38px_rgba(168,85,247,0.6)]',
      bgGradient: 'bg-gradient-to-br from-purple-950/60 via-indigo-950/50 to-[#140e1f]',
      iconColor: 'text-purple-300',
      badgeBg: 'bg-purple-950/80',
      badgeBorder: 'border-purple-500/70',
      badgeText: 'text-purple-200',
      auraText: 'Tử khí đông lai tam vạn lý, Nguyên Anh hiển thánh'
    },
    description: 'Phá đan thành anh, ngưng tụ đạo thân thứ hai, nhục thân dẫu diệt hồn phách trường sinh.'
  },
  'Hóa Thần': {
    stage: 'Hóa Thần',
    badgeTitle: 'Thần Hồn Xuất Khiếu',
    badgeGrade: 'Hóa Thần',
    icon: Eye,
    subIcon: Zap,
    theme: {
      borderClass: 'border-indigo-500/80 hover:border-indigo-300',
      glowClass: 'shadow-[0_0_42px_rgba(99,102,241,0.65)]',
      bgGradient: 'bg-gradient-to-br from-indigo-950/60 via-purple-950/50 to-[#100d20]',
      iconColor: 'text-indigo-300 animate-pulse',
      badgeBg: 'bg-indigo-950/80',
      badgeBorder: 'border-indigo-500/70',
      badgeText: 'text-indigo-200',
      auraText: 'Thần niệm bao phủ vạn dặm, chưởng khống thiên địa quy tắc'
    },
    description: 'Thần thức hóa hình, dung nhập thiên địa quy tắc, một niệm di sơn đảo hải.'
  },
  'Luyện Hư': {
    stage: 'Luyện Hư',
    badgeTitle: 'Hư Không Phá Toái',
    badgeGrade: 'Luyện Hư',
    icon: Orbit,
    subIcon: Eclipse,
    theme: {
      borderClass: 'border-sky-400/80 hover:border-sky-300',
      glowClass: 'shadow-[0_0_45px_rgba(56,189,248,0.65)]',
      bgGradient: 'bg-gradient-to-br from-sky-950/60 via-slate-950/50 to-[#0a1218]',
      iconColor: 'text-sky-300',
      badgeBg: 'bg-sky-950/80',
      badgeBorder: 'border-sky-500/70',
      badgeText: 'text-sky-200',
      auraText: 'Thân dung hư không, xuất nhập vô ảnh'
    },
    description: 'Cảm ngộ hư vô chân lý, vượt thoát ràng buộc không gian, tự do ngao du giới vực.'
  },
  'Hợp Thể': {
    stage: 'Hợp Thể',
    badgeTitle: 'Âm Dương Giao Thoa',
    badgeGrade: 'Hợp Thể',
    icon: Infinity,
    subIcon: Shuffle,
    theme: {
      borderClass: 'border-teal-400/80 hover:border-teal-300',
      glowClass: 'shadow-[0_0_48px_rgba(45,212,191,0.7)]',
      bgGradient: 'bg-gradient-to-br from-teal-950/60 via-emerald-950/50 to-[#0a1815]',
      iconColor: 'text-teal-300',
      badgeBg: 'bg-teal-950/80',
      badgeBorder: 'border-teal-500/70',
      badgeText: 'text-teal-200',
      auraText: 'Thần nhục hợp nhất, thái cực âm dương viên mãn'
    },
    description: 'Nhục thân và pháp tướng hợp nhất viên mãn, đạt tới cảnh giới Thiên Nhân Tương Ứng.'
  },
  'Đại Thừa': {
    stage: 'Đại Thừa',
    badgeTitle: 'Đạo Pháp Tự Nhiên',
    badgeGrade: 'Đại Thừa',
    icon: Crown,
    subIcon: ShieldAlert,
    theme: {
      borderClass: 'border-rose-500/85 hover:border-rose-400',
      glowClass: 'shadow-[0_0_50px_rgba(244,63,94,0.75)]',
      bgGradient: 'bg-gradient-to-br from-rose-950/60 via-amber-950/50 to-[#1a0c12]',
      iconColor: 'text-rose-300 animate-pulse',
      badgeBg: 'bg-rose-950/85',
      badgeBorder: 'border-rose-500/80',
      badgeText: 'text-rose-200',
      auraText: 'Đạo pháp đại thành, tiệm cận tiên nhân chi cảnh'
    },
    description: 'Đại đạo viên mãn, linh khí chuyển hóa thành tiên khí, chuẩn bị vấn đỉnh trường sinh.'
  },
  'Độ Kiếp': {
    stage: 'Độ Kiếp',
    badgeTitle: 'Cửu Trọng Kiếp Lôi',
    badgeGrade: 'Độ Kiếp',
    icon: CloudLightning,
    subIcon: FlameKindling,
    theme: {
      borderClass: 'border-red-500 hover:border-red-400',
      glowClass: 'shadow-[0_0_55px_rgba(239,68,68,0.85)]',
      bgGradient: 'bg-gradient-to-br from-red-950/70 via-purple-950/60 to-[#1f0a0d]',
      iconColor: 'text-red-400 animate-bounce',
      badgeBg: 'bg-red-950/90',
      badgeBorder: 'border-red-500/90',
      badgeText: 'text-red-200',
      auraText: 'Cửu thiên kiếp lôi tôi luyện chân thân, nghịch thiên phi thăng'
    },
    description: 'Nghênh đón lôi kiếp hủy diệt của thiên đạo, lột xác phàm thai đúc thành tiên thể.'
  },
  'Tiên Nhân': {
    stage: 'Tiên Nhân',
    badgeTitle: 'Ngũ Sắc Tiên Quang',
    badgeGrade: 'Tiên Giai',
    icon: Star,
    subIcon: Sparkles,
    theme: {
      borderClass: 'border-amber-300 hover:border-amber-200',
      glowClass: 'shadow-[0_0_60px_rgba(253,224,71,0.85)]',
      bgGradient: 'bg-gradient-to-br from-amber-900/60 via-yellow-950/50 to-[#1a1408]',
      iconColor: 'text-amber-200 animate-pulse',
      badgeBg: 'bg-amber-950/90',
      badgeBorder: 'border-amber-400',
      badgeText: 'text-amber-100',
      auraText: 'Đăng lâm Tiên Giới, thọ ngang trời đất nhật nguyệt'
    },
    description: 'Vượt qua phàm trần tiến nhập tiên giai, cửu phẩm liên hoa nở rộ đan điền.'
  },
  'Tiên Đế': {
    stage: 'Tiên Đế',
    badgeTitle: 'Đế Vương Chi Ấn',
    badgeGrade: 'Đế Cấp',
    icon: Trophy,
    subIcon: Award,
    theme: {
      borderClass: 'border-yellow-400 hover:border-yellow-200',
      glowClass: 'shadow-[0_0_70px_rgba(250,204,21,0.95)]',
      bgGradient: 'bg-gradient-to-br from-yellow-900/70 via-amber-950/70 to-[#221706]',
      iconColor: 'text-yellow-200 animate-pulse',
      badgeBg: 'bg-yellow-950/95',
      badgeBorder: 'border-yellow-300',
      badgeText: 'text-yellow-100',
      auraText: 'Chí tôn vạn giới, ức vạn sinh linh cúng bái'
    },
    description: 'Vấn đỉnh chư thiên vạn giới, đế uy trấn áp cửu thiên thập địa, vạn pháp bất xâm.'
  },
  'Đế Tổ': {
    stage: 'Đế Tổ',
    badgeTitle: 'Thái Cổ Đế Tổ',
    badgeGrade: 'Chí Tôn',
    icon: Crown,
    subIcon: Swords,
    theme: {
      borderClass: 'border-yellow-300 hover:border-white',
      glowClass: 'shadow-[0_0_80px_rgba(253,224,71,1)]',
      bgGradient: 'bg-gradient-to-br from-yellow-800/80 via-amber-900/80 to-[#2c1d07]',
      iconColor: 'text-white animate-pulse',
      badgeBg: 'bg-gradient-to-r from-yellow-950 to-amber-900',
      badgeBorder: 'border-yellow-200',
      badgeText: 'text-yellow-200 font-bold',
      auraText: 'Khai thiên tích địa, siêu thoát luân hồi đại đạo'
    },
    description: 'Đế tổ khởi nguyên, một ý niệm sinh diệt ức triệu thiên địa, hóa thân của hỗn độn sơ khai.'
  }
};

/**
 * Tìm kiếm Huy Hiệu Cảnh Giới phù hợp dựa trên stage hoặc tên cảnh giới
 */
export function getRealmBadge(stageOrName: string): RealmBadgeConfig {
  const query = stageOrName || '';

  if (query.includes('Đế Tổ')) return REALM_BADGES['Đế Tổ'];
  if (query.includes('Tiên Đế') || query.includes('Đại Đế') || query.includes('Chuẩn Đế')) {
    return REALM_BADGES['Tiên Đế'];
  }
  if (
    query.includes('Tiên') ||
    query.includes('Phi Thăng') ||
    query.includes('Chân Tiên') ||
    query.includes('Huyền Tiên') ||
    query.includes('Địa Tiên') ||
    query.includes('Thiên Tiên') ||
    query.includes('Kim Tiên') ||
    query.includes('Thái Ất')
  ) {
    return REALM_BADGES['Tiên Nhân'];
  }
  if (query.includes('Độ Kiếp')) return REALM_BADGES['Độ Kiếp'];
  if (query.includes('Đại Thừa')) return REALM_BADGES['Đại Thừa'];
  if (query.includes('Hợp Thể')) return REALM_BADGES['Hợp Thể'];
  if (query.includes('Luyện Hư')) return REALM_BADGES['Luyện Hư'];
  if (query.includes('Hóa Thần')) return REALM_BADGES['Hóa Thần'];
  if (query.includes('Nguyên Anh')) return REALM_BADGES['Nguyên Anh'];
  if (query.includes('Kim Đan')) return REALM_BADGES['Kim Đan'];
  if (query.includes('Trúc Cơ')) return REALM_BADGES['Trúc Cơ'];
  if (query.includes('Luyện Khí')) return REALM_BADGES['Luyện Khí'];

  return REALM_BADGES['Phàm Nhân'];
}
