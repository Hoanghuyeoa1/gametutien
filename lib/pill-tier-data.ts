// lib/pill-tier-data.ts
// Danh mục toàn diện 36 Đan Dược từ Nhất Giai đến Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { PillDefinition, PillCategory, PillTier } from './types/pill-tier';
import { MerchantItem } from './types/items';

export const PILL_DEFINITIONS_36: PillDefinition[] = [
  // ─── NHẤT GIAI (Tier 1 - Luyện Khí Kỳ - Realm 0-10) ──────────────────────────
  {
    id: 'pill_tier1_tuvi',
    name: 'Tụ Khí Đan',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Đan dược nhập môn ngưng tụ linh khí sơ khai, gia tăng trực tiếp +1,500 điểm Tu Vi khi phục dụng.',
    flavorText: 'Luyện Khí sơ nhập, tụ khí thành luồng, bồi bổ đan điền.',
    colorGrade: 'text-stone-300 border-stone-600/40 bg-stone-900/40',
    price: 80,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    effects: {
      tuViGain: 1500,
      toxicityPercent: 2,
    },
  },
  {
    id: 'pill_tier1_break',
    name: 'Phá Chướng Đan',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Tẩy trừ chướng khí tích tụ trong kinh mạch, tăng thêm +15% tỷ lệ đột phá cho bình cảnh Luyện Khí.',
    flavorText: 'Phá tan mê chướng, khí hải quán thông vững vàng.',
    colorGrade: 'text-stone-300 border-stone-600/40 bg-stone-900/40',
    price: 150,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    effects: {
      breakthroughBonusPercent: 15,
      toxicityPercent: 3,
    },
  },
  {
    id: 'pill_tier1_life',
    name: 'Dưỡng Huyết Đan',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Bồi bổ huyết khí, gia tăng vĩnh viễn +10 năm thọ nguyên và lập tức hồi phục 100% Khí Huyết.',
    flavorText: 'Huyết khí tràn trề, sinh mệnh bất diệt chốn hồng trần.',
    colorGrade: 'text-stone-300 border-stone-600/40 bg-stone-900/40',
    price: 100,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    effects: {
      lifespanYears: 10,
      fullHeal: true,
      toxicityPercent: 2,
    },
  },
  {
    id: 'pill_tier1_stat',
    name: 'Kiện Thể Đan',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Thối luyện gân cốt phàm nhân, tăng vĩnh viễn +2 điểm Căn Cốt (Tối đa dùng 5 viên trong 1 cảnh giới).',
    flavorText: 'Nhục thân kiên cố, đặt nền móng trường sinh.',
    colorGrade: 'text-stone-300 border-stone-600/40 bg-stone-900/40',
    price: 250,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    effects: {
      canCotBonus: 2,
      toxicityPercent: 3,
    },
    maxUsagePerRealm: 5,
  },

  // ─── NHỊ GIAI (Tier 2 - Trúc Cơ Kỳ - Realm 11-15) ───────────────────────────
  {
    id: 'pill_tier2_tuvi',
    name: 'Chân Nguyên Đan',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Kết tinh linh dịch thành chân nguyên thuần khiết, gia tăng +12,000 điểm Tu Vi khi nuốt.',
    flavorText: 'Khí hóa thành dịch, chân nguyên lưu chuyển khắp linh trì.',
    colorGrade: 'text-emerald-300 border-emerald-600/40 bg-emerald-950/40',
    price: 800,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    effects: {
      tuViGain: 12000,
      toxicityPercent: 3,
    },
  },
  {
    id: 'pill_tier2_break',
    name: 'Trúc Cơ Đan',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Bảo hộ tâm mạch khỏi phản phệ khi đúc Đạo Đài, tăng +20% tỷ lệ đột phá Trúc Cơ Kỳ.',
    flavorText: 'Nghịch thiên Trúc Cơ, đúc thành cửu phẩm Đạo Đài thượng thừa.',
    colorGrade: 'text-emerald-300 border-emerald-600/40 bg-emerald-950/40',
    price: 1800,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    effects: {
      breakthroughBonusPercent: 20,
      toxicityPercent: 4,
    },
  },
  {
    id: 'pill_tier2_life',
    name: 'Cố Bản Bồi Nguyên Đan',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Củng cố căn bản đạo hạnh, kéo dài thêm +25 năm thọ nguyên tối đa.',
    flavorText: 'Bản nguyên kiên cố, thọ số tăng tiến vững bền.',
    colorGrade: 'text-emerald-300 border-emerald-600/40 bg-emerald-950/40',
    price: 1200,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    effects: {
      lifespanYears: 25,
      toxicityPercent: 3,
    },
  },
  {
    id: 'pill_tier2_stat',
    name: 'Tẩy Tủy Đan',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Thanh lọc tủy não và kinh lạc, tăng vĩnh viễn +4 Căn Cốt, +2 Ngộ Tính (Tối đa 5 viên/cảnh giới).',
    flavorText: 'Tẩy tủy phạt mao, thoát thai hoán cốt.',
    colorGrade: 'text-emerald-300 border-emerald-600/40 bg-emerald-950/40',
    price: 3000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    effects: {
      canCotBonus: 4,
      ngoTinhBonus: 2,
      toxicityPercent: 4,
    },
    maxUsagePerRealm: 5,
  },

  // ─── TAM GIAI (Tier 3 - Kim Đan Kỳ - Realm 16-20) ───────────────────────────
  {
    id: 'pill_tier3_tuvi',
    name: 'Kim Dương Đan',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Chứa tinh hoa kim dương chi khí, gia tăng nhanh chóng +80,000 điểm Tu Vi.',
    flavorText: 'Kim dương chiếu rọi, đan điền kim quang rực rỡ.',
    colorGrade: 'text-sky-300 border-sky-600/40 bg-sky-950/40',
    price: 6000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    effects: {
      tuViGain: 80000,
      toxicityPercent: 4,
    },
  },
  {
    id: 'pill_tier3_break',
    name: 'Kết Kim Đan',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Hỗ trợ dịch hóa ngưng tụ thành đan hoàn, tăng +20% tỷ lệ ngưng tụ Kim Đan Cực Phẩm.',
    flavorText: 'Một hạt kim đan nuốt vào bụng, ta mạng do ta chẳng do trời.',
    colorGrade: 'text-sky-300 border-sky-600/40 bg-sky-950/40',
    price: 15000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    effects: {
      breakthroughBonusPercent: 20,
      toxicityPercent: 5,
    },
  },
  {
    id: 'pill_tier3_life',
    name: 'Thanh Mệnh Đan',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Chiết xuất từ cỏ trường thọ trăm năm, bồi đắp thêm +50 năm thọ nguyên vĩnh cửu.',
    flavorText: 'Thanh tâm định mệnh, tự tại tiêu dao nửa thiên niên kỷ.',
    colorGrade: 'text-sky-300 border-sky-600/40 bg-sky-950/40',
    price: 10000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    effects: {
      lifespanYears: 50,
      toxicityPercent: 4,
    },
  },
  {
    id: 'pill_tier3_stat',
    name: 'Ngưng Thần Đan',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Ngưng tụ ý niệm thành thức hải, tăng vĩnh viễn +6 Thần Thức và +3 Khí Vận.',
    flavorText: 'Thần niệm xuất khiếu, bao quát vạn dặm non sông.',
    colorGrade: 'text-sky-300 border-sky-600/40 bg-sky-950/40',
    price: 20000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    effects: {
      thanThucBonus: 6,
      khiVanBonus: 3,
      toxicityPercent: 5,
    },
    maxUsagePerRealm: 5,
  },

  // ─── TỨ GIAI (Tier 4 - Nguyên Anh Kỳ - Realm 21-25) ─────────────────────────
  {
    id: 'pill_tier4_tuvi',
    name: 'Tụ Anh Đan',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Nuôi dưỡng Nguyên Anh thai nghén, gia tăng lập tức +450,000 điểm Tu Vi đại đạo.',
    flavorText: 'Thai nghén nguyên anh, pháp thân dần hiển lộ cốt cách.',
    colorGrade: 'text-purple-300 border-purple-600/40 bg-purple-950/40',
    price: 40000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    effects: {
      tuViGain: 450000,
      toxicityPercent: 5,
    },
  },
  {
    id: 'pill_tier4_break',
    name: 'Hóa Anh Đan',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Hỗ trợ toái đan hóa anh viên mãn, tăng +20% tỷ lệ đột phá cảnh giới Nguyên Anh.',
    flavorText: 'Toái đan sinh hài nhi, thần thông bất diệt.',
    colorGrade: 'text-purple-300 border-purple-600/40 bg-purple-950/40',
    price: 100000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    effects: {
      breakthroughBonusPercent: 20,
      toxicityPercent: 6,
    },
  },
  {
    id: 'pill_tier4_life',
    name: 'Bổ Thiên Đan',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Vá lấp thiên đạo khiếm khuyết, tăng +100 năm thọ nguyên, đồng thời thanh tẩy tâm ma và giảm 30% đan độc.',
    flavorText: 'Nữ Oa luyện đá vá trời, tu sĩ ngậm đan bù đắp thiên mệnh.',
    colorGrade: 'text-purple-300 border-purple-600/40 bg-purple-950/40',
    price: 80000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    effects: {
      lifespanYears: 100,
      toxicityPercent: -30,
    },
  },
  {
    id: 'pill_tier4_stat',
    name: 'Cửu Chuyển Hồn Đan',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Thần hồn tôi luyện qua cửu chuyển lò lửa, tăng vĩnh viễn +12 Thần Thức, +5 Ngộ Tính.',
    flavorText: 'Hồn phách bất diệt, linh đài thanh tịnh như lưu ly.',
    colorGrade: 'text-purple-300 border-purple-600/40 bg-purple-950/40',
    price: 150000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    effects: {
      thanThucBonus: 12,
      ngoTinhBonus: 5,
      toxicityPercent: 6,
    },
    maxUsagePerRealm: 5,
  },

  // ─── NGŨ GIAI (Tier 5 - Hóa Thần Kỳ - Realm 26-30) ─────────────────────────
  {
    id: 'pill_tier5_tuvi',
    name: 'Thái Hư Đan',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Dung hợp thái hư tinh khí thiên địa, gia tăng kinh người +2,500,000 điểm Tu Vi.',
    flavorText: 'Lạc vào cõi thái hư, lĩnh ngộ căn nguyên vũ trụ.',
    colorGrade: 'text-amber-400 border-amber-500/50 bg-amber-950/50',
    price: 250000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    effects: {
      tuViGain: 2500000,
      toxicityPercent: 6,
    },
  },
  {
    id: 'pill_tier5_break',
    name: 'Hóa Thần Đan',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Hỗ trợ Nguyên Thần xuất khiếu cảm ứng thiên đạo quy tắc, tăng +20% tỷ lệ đột phá Hóa Thần Kỳ.',
    flavorText: 'Thần niệm hóa thiên địa, dạo chơi vạn giới hư không.',
    colorGrade: 'text-amber-400 border-amber-500/50 bg-amber-950/50',
    price: 600000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    effects: {
      breakthroughBonusPercent: 20,
      toxicityPercent: 7,
    },
  },
  {
    id: 'pill_tier5_life',
    name: 'Trường Sinh Đan',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Nghịch đoạt tạo hóa diên thọ, tăng thêm +200 năm thọ nguyên cho Hóa Thần chân quân.',
    flavorText: 'Bút thiên đình gạch tên, trường sinh tại thế.',
    colorGrade: 'text-amber-400 border-amber-500/50 bg-amber-950/50',
    price: 450000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    effects: {
      lifespanYears: 200,
      toxicityPercent: 5,
    },
  },
  {
    id: 'pill_tier5_stat',
    name: 'Ngộ Đạo Đan',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Chứa đựng mảnh vỡ đạo ngân vạn năm, tăng vĩnh viễn +15 Ngộ Tính và +10 Khí Vận.',
    flavorText: 'Dưới cội bồ đề bừng tỉnh ngộ, hiểu thấu đạo lý ngàn đời.',
    colorGrade: 'text-amber-400 border-amber-500/50 bg-amber-950/50',
    price: 800000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    effects: {
      ngoTinhBonus: 15,
      khiVanBonus: 10,
      toxicityPercent: 7,
    },
    maxUsagePerRealm: 5,
  },

  // ─── LỤC GIAI (Tier 6 - Luyện Hư Kỳ - Realm 31-35) ─────────────────────────
  {
    id: 'pill_tier6_tuvi',
    name: 'Thái Ất Chân Đan',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Luyện chế từ Thái Ất tiên thảo, gia tăng cuồn cuộn +12,000,000 điểm Tu Vi thuần dương.',
    flavorText: 'Thái Ất thuần dương, đan điền tựa hồ nhật nguyệt đồng huy.',
    colorGrade: 'text-rose-400 border-rose-500/50 bg-rose-950/50',
    price: 1800000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    effects: {
      tuViGain: 12000000,
      toxicityPercent: 7,
    },
  },
  {
    id: 'pill_tier6_break',
    name: 'Luyện Hư Đan',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Dung hợp chân thân và hư không giới, tăng +20% tỷ lệ phản phác quy chân đột phá Luyện Hư Kỳ.',
    flavorText: 'Thực thực hư hư, thân thể hòa vào càn khôn vũ trụ.',
    colorGrade: 'text-rose-400 border-rose-500/50 bg-rose-950/50',
    price: 4000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    effects: {
      breakthroughBonusPercent: 20,
      toxicityPercent: 8,
    },
  },
  {
    id: 'pill_tier6_life',
    name: 'Thiên Niên Bất Lão Đan',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Giữ dung nhan và thọ nguyên vĩnh viễn bất lão, tăng thêm +400 năm thọ nguyên.',
    flavorText: 'Ngàn năm như bóng câu qua cửa sổ, dung nhan thuở thiếu thời chẳng đổi.',
    colorGrade: 'text-rose-400 border-rose-500/50 bg-rose-950/50',
    price: 3000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    effects: {
      lifespanYears: 400,
      toxicityPercent: 6,
    },
  },
  {
    id: 'pill_tier6_stat',
    name: 'Hư Không Linh Đan',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Lĩnh ngộ không gian pháp tắc, tăng vĩnh viễn +25 Thần Thức và +5% Tốc độ né tránh.',
    flavorText: 'Bước chân lướt giữa hư vô, né tránh vạn đạo công kích.',
    colorGrade: 'text-rose-400 border-rose-500/50 bg-rose-950/50',
    price: 5500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    effects: {
      thanThucBonus: 25,
      speedBonusPercent: 5,
      toxicityPercent: 8,
    },
    maxUsagePerRealm: 5,
  },

  // ─── THẤT GIAI (Tier 7 - Hợp Thể Kỳ - Realm 36-40) ─────────────────────────
  {
    id: 'pill_tier7_tuvi',
    name: 'Cửu Dương Quy Nguyên Đan',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Chín luồng chí dương quy tụ về nguyên hải, bạo phát +60,000,000 điểm Tu Vi.',
    flavorText: 'Cửu dương tương hội, khí thế ngập trời rung chuyển sơn hà.',
    colorGrade: 'text-red-400 border-red-500/50 bg-red-950/50',
    price: 12000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    effects: {
      tuViGain: 60000000,
      toxicityPercent: 8,
    },
  },
  {
    id: 'pill_tier7_break',
    name: 'Hợp Thể Đan',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Hỗ trợ pháp thân cùng nhục thân dung hợp làm một thể, tăng +25% tỷ lệ đột phá Hợp Thể Kỳ.',
    flavorText: 'Thiên nhân hợp nhất, pháp thân hiển thánh.',
    colorGrade: 'text-red-400 border-red-500/50 bg-red-950/50',
    price: 25000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    effects: {
      breakthroughBonusPercent: 25,
      toxicityPercent: 9,
    },
  },
  {
    id: 'pill_tier7_life',
    name: 'Niết Bàn Tái Sinh Đan',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Tăng +800 năm thọ nguyên, đồng thời ban phúc duyên Miễn Tử 1 lần trong đời khi gặp nguy biến chí mạng.',
    flavorText: 'Phượng hoàng niết bàn, dục hỏa hồi sinh.',
    colorGrade: 'text-red-400 border-red-500/50 bg-red-950/50',
    price: 35000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    effects: {
      lifespanYears: 800,
      preventDeathOnce: true,
      toxicityPercent: 7,
    },
  },
  {
    id: 'pill_tier7_stat',
    name: 'Vạn Kiếp Kim Đan',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Đúc thành kim thân bất hoại sau vạn kiếp trầm luân, tăng vĩnh viễn +30 Căn Cốt, +10% Miễn thương toàn cục.',
    flavorText: 'Trải qua vạn kiếp diệt lôi, kim thân bất diệt bất hoại.',
    colorGrade: 'text-red-400 border-red-500/50 bg-red-950/50',
    price: 45000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    effects: {
      canCotBonus: 30,
      damageReductionPercent: 10,
      toxicityPercent: 9,
    },
    maxUsagePerRealm: 5,
  },

  // ─── BÁT GIAI (Tier 8 - Đại Thừa Kỳ - Realm 41-45) ─────────────────────────
  {
    id: 'pill_tier8_tuvi',
    name: 'Hỗn Nguyên Thánh Đan',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Ngưng tụ hỗn nguyên thánh khí viễn cổ, lập tức hấp thu +300,000,000 điểm Tu Vi thiên cực.',
    flavorText: 'Hỗn nguyên nhập thể, thánh đạo viên mãn gần kề.',
    colorGrade: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/50',
    price: 80000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    effects: {
      tuViGain: 300000000,
      toxicityPercent: 10,
    },
  },
  {
    id: 'pill_tier8_break',
    name: 'Đại Thừa Đan',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Tăng +25% tỷ lệ bước chân vào Đại Thừa Cực Cảnh, ngưng tụ đạo quả chí tôn.',
    flavorText: 'Bước chân vào Đại Thừa, vạn giới chúng sinh đều phải cúi đầu.',
    colorGrade: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/50',
    price: 180000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    effects: {
      breakthroughBonusPercent: 25,
      toxicityPercent: 11,
    },
  },
  {
    id: 'pill_tier8_life',
    name: 'Cửu Chuyển Hồi Thiên Đan',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Hồi sinh khí cơ thiên địa, gia tăng phi phàm +1,500 năm thọ nguyên cho Đại Thừa Thánh Giả.',
    flavorText: 'Cửu chuyển hồi thiên, cướp đoạt thần cơ từ tay Diêm Vương.',
    colorGrade: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/50',
    price: 150000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    effects: {
      lifespanYears: 1500,
      toxicityPercent: 9,
    },
  },
  {
    id: 'pill_tier8_stat',
    name: 'Thông Thiên Vạn Pháp Đan',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Thông suốt vạn pháp đại đạo, tăng vĩnh viễn +50 điểm cho TOÀN BỘ thuộc tính (Căn Cốt, Ngộ Tính, Khí Vận, Thần Thức).',
    flavorText: 'Vạn pháp quy tông, thông thiên triệt địa.',
    colorGrade: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-950/50',
    price: 250000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    effects: {
      canCotBonus: 50,
      ngoTinhBonus: 50,
      khiVanBonus: 50,
      thanThucBonus: 50,
      toxicityPercent: 11,
    },
    maxUsagePerRealm: 5,
  },

  // ─── CỬU GIAI (Tier 9 - Độ Kiếp / Phi Thăng / Tiên Nhân - Realm 46+) ────────
  {
    id: 'pill_tier9_tuvi',
    name: 'Hỗn Độn Tạo Hóa Tiên Đan',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'tu_vi',
    categoryName: 'Tăng Tu Vi',
    description: 'Thần đan sinh ra từ thuở hồng mông sơ khai, trực tiếp ban tặng +1,500,000,000 điểm Tu Vi Tiên Nhân.',
    flavorText: 'Hỗn Độn sơ khai, một viên tiên đan định càn khôn vạn cổ.',
    colorGrade: 'text-yellow-300 border-yellow-400/60 bg-yellow-950/60',
    price: 600000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    effects: {
      tuViGain: 1500000000,
      toxicityPercent: 12,
    },
  },
  {
    id: 'pill_tier9_break',
    name: 'Độ Kiếp Tiên Đan',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'breakthrough',
    categoryName: 'Đột Phá',
    description: 'Giảm 50% sát thương lôi đình kiếp nạn, tăng +30% tỷ lệ vượt qua Cửu Trọng Thiên Kiếp phi thăng Tiên Giới.',
    flavorText: 'Đỡ lấy lôi đình vạn trượng, đạp mây phi thăng Tiên môn.',
    colorGrade: 'text-yellow-300 border-yellow-400/60 bg-yellow-950/60',
    price: 1200000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    effects: {
      breakthroughBonusPercent: 30,
      reduceTribulationDamagePercent: 50,
      toxicityPercent: 13,
    },
  },
  {
    id: 'pill_tier9_life',
    name: 'Bất Tử Vĩnh Sinh Đan',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'lifespan',
    categoryName: 'Thọ Mệnh',
    description: 'Thoát ly ngũ hành luân hồi, kéo dài thêm +5,000 năm thọ nguyên, đồng thọ cùng trời đất.',
    flavorText: 'Thiên địa mục nát mà ta bất hủ, nhật nguyệt tàn lụi mà ta trường tồn.',
    colorGrade: 'text-yellow-300 border-yellow-400/60 bg-yellow-950/60',
    price: 1000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    effects: {
      lifespanYears: 5000,
      toxicityPercent: 10,
    },
  },
  {
    id: 'pill_tier9_stat',
    name: 'Hồng Mông Đạo Quả Đan',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'stat_boost',
    categoryName: 'Thuộc Tính',
    description: 'Ngưng tụ Tiên Thể vô thượng, tăng vĩnh viễn +100 TOÀN BỘ thuộc tính, tăng +20% Sát thương bạo kích chí tử.',
    flavorText: 'Thành tựu Tiên Thể, chấp chưởng thiên đạo quy tắc.',
    colorGrade: 'text-yellow-300 border-yellow-400/60 bg-yellow-950/60',
    price: 2000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    effects: {
      canCotBonus: 100,
      ngoTinhBonus: 100,
      khiVanBonus: 100,
      thanThucBonus: 100,
      critDmgPercent: 20,
      toxicityPercent: 14,
    },
    maxUsagePerRealm: 5,
  },
];

export const PILL_DEFINITIONS_MAP: Record<string, PillDefinition> = PILL_DEFINITIONS_36.reduce(
  (acc, pill) => {
    acc[pill.id] = pill;
    return acc;
  },
  {} as Record<string, PillDefinition>
);

/**
 * Chuyển đổi PillDefinition sang MerchantItem để hiển thị và bán trong Vạn Bảo Thương Hội
 */
export function pillDefinitionToMerchantItem(pill: PillDefinition): MerchantItem {
  return {
    id: pill.id,
    name: pill.name,
    category: 'pills',
    itemType: 'pill',
    type: 'pill',
    pillType: pill.category === 'tu_vi'
      ? 'exp'
      : pill.category === 'breakthrough'
      ? 'breakthrough'
      : pill.category === 'lifespan'
      ? 'lifespan'
      : pill.category === 'stat_boost'
      ? 'stat'
      : 'recovery',
    tier: pill.tier,
    grade: pill.tierName,
    price: pill.price,
    stock: 20,
    maxStock: 20,
    requiredRealmIndex: pill.requiredRealmIndex,
    requiredRealmName: pill.requiredRealmName,
    description: pill.description,
    data: {
      pillDefinition: pill,
      ...pill.effects,
      tier: pill.tier,
      tierName: pill.tierName,
      category: pill.category,
      categoryName: pill.categoryName,
      requiredRealmIndex: pill.requiredRealmIndex,
      requiredRealmName: pill.requiredRealmName,
      flavorText: pill.flavorText,
      maxUsagePerRealm: pill.maxUsagePerRealm,
    },
  };
}

/**
 * Danh sách MerchantItem của 36 Đan Dược Cửu Giai sẵn sàng phục vụ Thương Hội
 */
export const TIER_PILLS_MERCHANT_ITEMS: MerchantItem[] = PILL_DEFINITIONS_36.map(pillDefinitionToMerchantItem);

/**
 * Lấy bảng màu viền, hiệu ứng phát quang và badge cho từng Phẩm Giai (Tier 1 -> Tier 9)
 */
export function getTierVisualTheme(tier: number): {
  borderClass: string;
  glowClass: string;
  badgeBg: string;
  textColor: string;
} {
  switch (tier) {
    case 1:
      return {
        borderClass: 'border-stone-700/60 hover:border-stone-500',
        glowClass: 'shadow-stone-900/40',
        badgeBg: 'bg-stone-800 text-stone-300 border-stone-600',
        textColor: 'text-stone-200',
      };
    case 2:
      return {
        borderClass: 'border-emerald-800/60 hover:border-emerald-500',
        glowClass: 'shadow-emerald-950/40',
        badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60',
        textColor: 'text-emerald-300',
      };
    case 3:
      return {
        borderClass: 'border-sky-800/60 hover:border-sky-500',
        glowClass: 'shadow-sky-950/40',
        badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-600/60',
        textColor: 'text-sky-300',
      };
    case 4:
      return {
        borderClass: 'border-purple-800/60 hover:border-purple-500',
        glowClass: 'shadow-purple-950/40',
        badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-600/60',
        textColor: 'text-purple-300',
      };
    case 5:
      return {
        borderClass: 'border-amber-700/60 hover:border-amber-400',
        glowClass: 'shadow-amber-950/50',
        badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/60',
        textColor: 'text-amber-300',
      };
    case 6:
      return {
        borderClass: 'border-rose-700/60 hover:border-rose-400',
        glowClass: 'shadow-rose-950/50',
        badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/60',
        textColor: 'text-rose-300',
      };
    case 7:
      return {
        borderClass: 'border-red-700/60 hover:border-red-400',
        glowClass: 'shadow-red-950/60',
        badgeBg: 'bg-red-950/80 text-red-300 border-red-500/60',
        textColor: 'text-red-300',
      };
    case 8:
      return {
        borderClass: 'border-fuchsia-700/70 hover:border-fuchsia-400',
        glowClass: 'shadow-fuchsia-950/60',
        badgeBg: 'bg-fuchsia-950/80 text-fuchsia-200 border-fuchsia-500/70',
        textColor: 'text-fuchsia-200',
      };
    case 9:
      return {
        borderClass: 'border-yellow-500/80 hover:border-amber-300 animate-pulse',
        glowClass: 'shadow-[0_0_15px_rgba(234,179,8,0.25)]',
        badgeBg: 'bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30 text-yellow-200 border-yellow-400/80',
        textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-rose-200 font-bold',
      };
    default:
      return {
        borderClass: 'border-zinc-800 hover:border-zinc-600',
        glowClass: 'shadow-zinc-950',
        badgeBg: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        textColor: 'text-zinc-200',
      };
  }
}

