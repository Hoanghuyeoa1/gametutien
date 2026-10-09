// lib/cultivation-shop-data.ts
// Danh mục toàn diện 36 Vật Phẩm Tu Luyện & Bổ Trợ Đạo Hạnh từ Nhất Giai đến Cửu Giai (Tier 1 -> Tier 9)

import { CultivationShopItem, CultivationItemCategory, CultivationItemTier } from './types/cultivation-shop';
import { MerchantItem } from './types/items';

export const CULTIVATION_SHOP_ITEMS_36: CultivationShopItem[] = [
  // ─── NHẤT GIAI (Tier 1 - Luyện Khí Kỳ - Realm 0-10) ──────────────────────────
  {
    id: 'cult_t1_manual',
    name: 'Trường Xuân Thổ Nạp Quyết',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Bí pháp điều tức sơ nhập, gia tăng vĩnh viễn +5% tốc độ hấp thu tu vi thiên địa cơ bản.',
    flavorText: 'Khí hải lưu thông, xuân phong hóa vũ, thổ nạp không ngừng.',
    price: 120,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-600/40 text-stone-300 bg-stone-900/40',
    effects: {
      permanentTuViSpeedPercent: 5,
    },
  },
  {
    id: 'cult_t1_array',
    name: 'Sơ Cấp Tụ Linh Trận Bàn',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Trận bàn khắc trận phù sơ cấp, tụ nạp linh khí tăng +10% tốc độ tu vi trong 12 giờ.',
    flavorText: 'Linh thạch dẫn trận, hào quang lượn quanh đan điền.',
    price: 200,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-600/40 text-stone-300 bg-stone-900/40',
    effects: {
      temporaryTuViSpeedPercent: 10,
      durationHours: 12,
    },
  },
  {
    id: 'cult_t1_essence',
    name: 'Thạch Nhũ Tinh Hoa',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Giọt tinh hoa tích tụ từ thạch nhũ trăm năm, tăng +5% hiệu suất bế quan ngoại tuyến.',
    flavorText: 'Thấm vào tâm mạch, thanh lương vô cùng.',
    price: 150,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-600/40 text-stone-300 bg-stone-900/40',
    effects: {
      meditationEfficiencyBonus: 5,
    },
  },
  {
    id: 'cult_t1_incense',
    name: 'Thanh Tâm Hương',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Hương thơm xoa dịu tạp niệm, tăng vĩnh viễn +3 Tâm Cảnh và +1 Ngộ Tính khi thắp hương.',
    flavorText: 'Làn khói nhẹ lan tỏa, tâm thần an định như nước lặng.',
    price: 180,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-600/40 text-stone-300 bg-stone-900/40',
    effects: {
      tamCanhBonus: 3,
      permanentNgoTinh: 1,
    },
  },

  // ─── NHỊ GIAI (Tier 2 - Trúc Cơ Kỳ - Realm 11-15) ──────────────────────────
  {
    id: 'cult_t2_manual',
    name: 'Thuần Dương Dẫn Khí Thiên',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Khai mở khí môn dẫn dương khí tẩy thể, tăng vĩnh viễn +8% tốc độ tu vi cơ bản.',
    flavorText: 'Thuần dương ngưng tụ, khí hải dạt dào như triều dâng.',
    price: 1500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    effects: {
      permanentTuViSpeedPercent: 8,
    },
  },
  {
    id: 'cult_t2_array',
    name: 'Lưỡng Nghi Tụ Khí Bàn',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Trận pháp âm dương phối ngẫu, tăng +15% tốc độ tu vi duy trì trong 16 giờ.',
    flavorText: 'Âm dương chuyển hóa, linh dịch liên miên bất tuyệt.',
    price: 2500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    effects: {
      temporaryTuViSpeedPercent: 15,
      durationHours: 16,
    },
  },
  {
    id: 'cult_t2_essence',
    name: 'Bách Niên Linh Dịch',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Linh dịch ngưng tụ trên đỉnh núi thiêng trăm năm, tăng +8% hiệu suất bế quan tích lũy.',
    flavorText: 'Một giọt linh dịch tựa như ngàn trượng mưa xuân bồi dưỡng nguyên thần.',
    price: 2000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    effects: {
      meditationEfficiencyBonus: 8,
    },
  },
  {
    id: 'cult_t2_incense',
    name: 'Uẩn Thần Huân Hương',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Xông hương huân thần định phách, tăng vĩnh viễn +5 Tâm Cảnh và +3 Ngộ Tính.',
    flavorText: 'Trầm hương vấn vương ngưng thần đài, tâm ý thông suốt.',
    price: 2200,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    effects: {
      tamCanhBonus: 5,
      permanentNgoTinh: 3,
    },
  },

  // ─── TAM GIAI (Tier 3 - Kim Đan Kỳ - Realm 16-20) ──────────────────────────
  {
    id: 'cult_t3_manual',
    name: 'Tử Phủ Kim Đan Bí Quyển',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Bí thuật ngưng đan dưỡng khí tử phủ, tăng vĩnh viễn +10% tốc độ tu vi cơ bản.',
    flavorText: 'Kim đan xoay vần tỏa hào quang tử hà, nhật dạ không dứt.',
    price: 12000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    effects: {
      permanentTuViSpeedPercent: 10,
    },
  },
  {
    id: 'cult_t3_array',
    name: 'Tam Tài Hóa Khí Trận Bàn',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Thiên Địa Nhân tam tài tương ứng, kích phát đại trận tăng +20% tốc độ tu vi trong 24 giờ.',
    flavorText: 'Tam hoa tụ đỉnh, khí tức cuồn cuộn đổ vào đan điền.',
    price: 20000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    effects: {
      temporaryTuViSpeedPercent: 20,
      durationHours: 24,
    },
  },
  {
    id: 'cult_t3_essence',
    name: 'Thiên Niên Địa Nhũ',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Địa nhũ ẩn sâu ngàn năm trong lòng đất, mở rộng đan điền tăng +12% hiệu suất bế quan.',
    flavorText: 'Địa khí ngưng tụ thành nhũ, bồi đắp căn cơ sâu dày.',
    price: 18000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    effects: {
      meditationEfficiencyBonus: 12,
    },
  },
  {
    id: 'cult_t3_incense',
    name: 'Tĩnh Tâm Trúc Hương',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Hương trúc ngàn năm tẩy rửa trần duyên, tăng vĩnh viễn +8 Tâm Cảnh và +5 Ngộ Tính.',
    flavorText: 'Tâm an như trúc xanh đứng thẳng giữa bão táp hồng trần.',
    price: 22000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    effects: {
      tamCanhBonus: 8,
      permanentNgoTinh: 5,
    },
  },

  // ─── TỨ GIAI (Tier 4 - Nguyên Anh Kỳ - Realm 21-25) ──────────────────────────
  {
    id: 'cult_t4_manual',
    name: 'Cửu Chuyển Hóa Anh Kinh',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Dưỡng thai nguyên anh qua cửu chuyển lò lửa, tăng vĩnh viễn +12% tốc độ tu vi cơ bản.',
    flavorText: 'Nguyên anh xuất khiếu đằng vân, thần thông câu thông thiên địa.',
    price: 90000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    effects: {
      permanentTuViSpeedPercent: 12,
    },
  },
  {
    id: 'cult_t4_array',
    name: 'Tứ Tượng Tụ Linh Pháp Trận',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Tứ linh Thanh Long, Bạch Hổ, Chu Tước, Huyền Vũ trấn ngự, tăng +25% tốc độ tu vi trong 24 giờ.',
    flavorText: 'Tứ phương linh khí tụ về trung cung, pháp lực dồi dào vô tận.',
    price: 150000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    effects: {
      temporaryTuViSpeedPercent: 25,
      durationHours: 24,
    },
  },
  {
    id: 'cult_t4_essence',
    name: 'Vạn Niên Huyền Băng Tủy',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Băng tủy ngàn năm tôi luyện thần hồn, tăng +15% hiệu suất bế quan và giảm 30% nguy cơ tâm ma.',
    flavorText: 'Băng hàn cực độ đóng băng tạp niệm, linh đài thanh tịnh như băng ngọc.',
    price: 120000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    effects: {
      meditationEfficiencyBonus: 15,
      tamCanhBonus: 10,
    },
  },
  {
    id: 'cult_t4_incense',
    name: 'Tử Tiêu Uẩn Đạo Hương',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Hương mây tử tiêu từ tiên cảnh, tăng vĩnh viễn +10 Tâm Cảnh và +8 Ngộ Tính.',
    flavorText: 'Khói tía lượn quanh ngai thần, đại đạo như hiện trước mắt.',
    price: 140000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    effects: {
      tamCanhBonus: 10,
      permanentNgoTinh: 8,
    },
  },

  // ─── NGŨ GIAI (Tier 5 - Hóa Thần Kỳ - Realm 26-30) ──────────────────────────
  {
    id: 'cult_t5_manual',
    name: 'Thái Hư Du Thần Quyết',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Hóa thần du ngoạn thái hư tinh tú, tăng vĩnh viễn +15% tốc độ tu vi cơ bản.',
    flavorText: 'Thần niệm ngao du vạn dặm hư không, cảm ngộ quy luật thiên địa.',
    price: 600000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    effects: {
      permanentTuViSpeedPercent: 15,
    },
  },
  {
    id: 'cult_t5_array',
    name: 'Ngũ Hành Quy Nguyên Trận',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Kim Mộc Thủy Hỏa Thổ luân chuyển bất tức, tăng +30% tốc độ tu vi duy trì trong 24 giờ.',
    flavorText: 'Ngũ hành tương sinh tương khắc, linh lực hóa thành dòng thác luân chuyển.',
    price: 1000000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    effects: {
      temporaryTuViSpeedPercent: 30,
      durationHours: 24,
    },
  },
  {
    id: 'cult_t5_essence',
    name: 'Chân Long Tủy Tinh',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Tủy tinh đọng lại của Chân Long viễn cổ, tăng +20% hiệu suất bế quan ngoại tuyến.',
    flavorText: 'Long uy ẩn hiện trong huyết mạch, bồi bổ khí huyết vạn kiếp bất suy.',
    price: 800000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    effects: {
      meditationEfficiencyBonus: 20,
    },
  },
  {
    id: 'cult_t5_incense',
    name: 'Bồ Đề Vấn Đạo Trà',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Trà hái từ cội Bồ Đề thượng cổ, uống vào ngộ đạo tăng vĩnh viễn +15 Tâm Cảnh và +12 Ngộ Tính.',
    flavorText: 'Nhấp một ngụm trà đắng, thấu suốt ngàn kiếp nhân sinh.',
    price: 950000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    effects: {
      tamCanhBonus: 15,
      permanentNgoTinh: 12,
    },
  },

  // ─── LỤC GIAI (Tier 6 - Luyện Hư Kỳ - Realm 31-35) ──────────────────────────
  {
    id: 'cult_t6_manual',
    name: 'Quy Chân Luyện Hư Thần Thiên',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Phản phác quy chân hóa thân vào hư không, tăng vĩnh viễn +18% tốc độ tu vi cơ bản.',
    flavorText: 'Thân dung hòa cùng hư vô, hít thở cùng nhịp đập vũ trụ.',
    price: 4000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/60 text-rose-300 bg-rose-950/40',
    effects: {
      permanentTuViSpeedPercent: 18,
    },
  },
  {
    id: 'cult_t6_array',
    name: 'Lục Hợp Hỗn Nguyên Trận Bàn',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Đông Tây Nam Bắc Thượng Hạ lục hợp quy nhất, tăng +35% tốc độ tu vi kéo dài 36 giờ.',
    flavorText: 'Bao quát càn khôn lục hợp, linh khí dồn về như đại dương tiếp nạp trăm sông.',
    price: 6500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/60 text-rose-300 bg-rose-950/40',
    effects: {
      temporaryTuViSpeedPercent: 35,
      durationHours: 36,
    },
  },
  {
    id: 'cult_t6_essence',
    name: 'Hư Không Linh Tinh Tủy',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Tinh tủy ngưng kết giữa khe nứt hư không, gia tăng +25% hiệu suất bế quan.',
    flavorText: 'Lực lượng không gian tinh khiết bồi bổ linh thể vượt giới hạn phàm trần.',
    price: 5500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/60 text-rose-300 bg-rose-950/40',
    effects: {
      meditationEfficiencyBonus: 25,
    },
  },
  {
    id: 'cult_t6_incense',
    name: 'Cửu Khiếu Thông Linh Hương',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Khói hương đả thông cửu khiếu thân thể, tăng vĩnh viễn +20 Tâm Cảnh và +18 Ngộ Tính.',
    flavorText: 'Cửu khiếu quán thông, thiên nhân hợp nhất cảnh giới sâu sắc.',
    price: 6000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/60 text-rose-300 bg-rose-950/40',
    effects: {
      tamCanhBonus: 20,
      permanentNgoTinh: 18,
    },
  },

  // ─── THẤT GIAI (Tier 7 - Hợp Thể Kỳ - Realm 36-40) ──────────────────────────
  {
    id: 'cult_t7_manual',
    name: 'Bát Hoang Pháp Thân Thổ Nạp Đạo',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Hợp nhất bản thể và pháp thân cùng thổ nạp bát hoang, tăng vĩnh viễn +20% tốc độ tu vi cơ bản.',
    flavorText: 'Pháp thân nguy nga vạn trượng, hút trọn linh triều bát hoang tứ hải.',
    price: 25000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/60 text-red-300 bg-red-950/40',
    effects: {
      permanentTuViSpeedPercent: 20,
    },
  },
  {
    id: 'cult_t7_array',
    name: 'Thất Tinh Tụ Hồn Pháp Bàn',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Dẫn tinh quang Bắc Đẩu Thất Tinh giáng trần, tăng +40% tốc độ tu vi trong 48 giờ.',
    flavorText: 'Tinh tú tỏa sáng giữa ban ngày, linh khí cuồn cuộn tựa sông ngân hà thác lũ.',
    price: 40000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/60 text-red-300 bg-red-950/40',
    effects: {
      temporaryTuViSpeedPercent: 40,
      durationHours: 48,
    },
  },
  {
    id: 'cult_t7_essence',
    name: 'Tiên Thiên Tức Nhưỡng Linh Tủy',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Linh tủy thai nghén từ Tiên Thiên Tức Nhưỡng, tăng vĩnh viễn +30% hiệu suất bế quan.',
    flavorText: 'Sinh sôi nảy nở không ngừng nghỉ, khí tức ngưng đọng thành ngọc thạch.',
    price: 35000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/60 text-red-300 bg-red-950/40',
    effects: {
      meditationEfficiencyBonus: 30,
    },
  },
  {
    id: 'cult_t7_incense',
    name: 'Độ Ách Liên Hoa Hương',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Hương sen độ ách giúp miễn nhiễm 100% tâm ma khi bế quan, tăng vĩnh viễn +25 Ngộ Tính.',
    flavorText: 'Liên hoa nở rộ trừ ma chướng, độ ách tiêu tai bước vào cảnh giới viên dung.',
    price: 38000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/60 text-red-300 bg-red-950/40',
    effects: {
      immuneTamMa: true,
      permanentNgoTinh: 25,
      tamCanhBonus: 25,
    },
  },

  // ─── BÁT GIAI (Tier 8 - Đại Thừa Kỳ - Realm 41-45) ──────────────────────────
  {
    id: 'cult_t8_manual',
    name: 'Vạn Cổ Đạo Diễn Thánh Thư',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Diễn dịch vạn cổ đại đạo tuần hoàn, tăng vĩnh viễn +25% tốc độ tu vi cơ bản.',
    flavorText: 'Từng trang sách mở ra là ngàn năm hưng phế, đại đạo quy nguyên về bản thể.',
    price: 150000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/70 text-fuchsia-200 bg-fuchsia-950/50',
    effects: {
      permanentTuViSpeedPercent: 25,
    },
  },
  {
    id: 'cult_t8_array',
    name: 'Bát Quái Tru Thiên Tụ Khí Đài',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Thần đài chuyển dịch bát quái câu thông chư thiên, tăng +50% tốc độ tu vi trong 48 giờ.',
    flavorText: 'Hỗn độn phân phân, bát quái định vị, khí vận chư thiên tụ về ngai thần.',
    price: 250000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/70 text-fuchsia-200 bg-fuchsia-950/50',
    effects: {
      temporaryTuViSpeedPercent: 50,
      durationHours: 48,
    },
  },
  {
    id: 'cult_t8_essence',
    name: 'Thái Sơ Hỗn Độn Tinh Hoa',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Tinh hoa thời kỳ khai thiên lập địa thái sơ, khai mở thần thể tăng +35% hiệu suất bế quan.',
    flavorText: 'Ngưng tụ nguyên khí thái sơ sơ khai, hóa thần thành đạo bất tử.',
    price: 200000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/70 text-fuchsia-200 bg-fuchsia-950/50',
    effects: {
      meditationEfficiencyBonus: 35,
    },
  },
  {
    id: 'cult_t8_incense',
    name: 'Hồng Mông Khai Thiên Hương',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Mùi hương sơ khai từ hồng mông, tăng vĩnh viễn +35 Tâm Cảnh và +35 Ngộ Tính.',
    flavorText: 'Mây hồng mông tan rã, thiên địa mở lối quang minh vạn trượng.',
    price: 220000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/70 text-fuchsia-200 bg-fuchsia-950/50',
    effects: {
      tamCanhBonus: 35,
      permanentNgoTinh: 35,
    },
  },

  // ─── CỬU GIAI (Tier 9 - Độ Kiếp / Tiên Nhân - Realm 46+) ───────────────────
  {
    id: 'cult_t9_manual',
    name: 'Hỗn Độn Bất Diệt Vô Thượng Thần Kinh',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'manual',
    categoryName: 'Tâm Pháp Thổ Nạp',
    description: 'Chí cao vô thượng công pháp bất diệt, tăng vĩnh viễn +35% tốc độ tu vi cơ bản toàn diện.',
    flavorText: 'Vượt ngoài tam giới ngũ hành, bất tử bất diệt cùng thiên địa trường tồn.',
    price: 1000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    badgeColor: 'border-yellow-400/80 text-yellow-200 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30',
    effects: {
      permanentTuViSpeedPercent: 35,
    },
  },
  {
    id: 'cult_t9_array',
    name: 'Cửu Cực Vô Thượng Tiên Trận',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'array',
    categoryName: 'Tụ Linh Trận Bàn',
    description: 'Cửu cửu quy nhất tiên trận thượng cổ, tăng cực đại +75% tốc độ tu vi duy trì suốt 72 giờ.',
    flavorText: 'Cửu trọng thiên môn mở toang, linh thủy thượng giới rót xuống như thác lũ.',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    badgeColor: 'border-yellow-400/80 text-yellow-200 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30',
    effects: {
      temporaryTuViSpeedPercent: 75,
      durationHours: 72,
    },
  },
  {
    id: 'cult_t9_essence',
    name: 'Huyền Hoàng Tiên Thiên Đạo Tủy',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'essence',
    categoryName: 'Linh Tủy Tinh Hoa',
    description: 'Đạo tủy tiên thiên huyền hoàng vô thượng, tăng +50% hiệu suất bế quan ngoại tuyến.',
    flavorText: 'Khí huyền hoàng bao bọc, mỗi hơi thở tương đương trăm năm khổ tu phàm tục.',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    badgeColor: 'border-yellow-400/80 text-yellow-200 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30',
    effects: {
      meditationEfficiencyBonus: 50,
    },
  },
  {
    id: 'cult_t9_incense',
    name: 'Hỗn Độn Bồ Đề Thần Hương',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'incense',
    categoryName: 'Ngộ Đạo Dị Bảo',
    description: 'Thần hương bồ đề hỗn độn, tăng vĩnh viễn +50 Tâm Cảnh, +50 Ngộ Tính, kích phát dị tượng Tử Khí Triều Tịch.',
    flavorText: 'Tử khí đông lai ba vạn dặm, đốn ngộ vô thượng đạo quả thành tựu chân tiên.',
    price: 2000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp / Tiên Nhân',
    badgeColor: 'border-yellow-400/80 text-yellow-200 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-cyan-500/30',
    effects: {
      tamCanhBonus: 50,
      permanentNgoTinh: 50,
      specialPhenomenon: 'Tử Khí Triều Tịch',
    },
  },
];

export const CULTIVATION_SHOP_ITEMS_MAP = new Map<string, CultivationShopItem>(
  CULTIVATION_SHOP_ITEMS_36.map((item) => [item.id, item])
);

/**
 * Chuyển đổi CultivationShopItem sang chuẩn MerchantItem để tích hợp trực tiếp vào Vạn Bảo Thương Hội
 */
export function cultivationShopItemToMerchantItem(item: CultivationShopItem): MerchantItem {
  return {
    id: item.id,
    name: item.name,
    category: 'cultivation',
    cultivationItemType: item.category === 'array' ? 'array_flag' : item.category === 'incense' ? 'incense' : item.category === 'essence' ? 'relic' : 'cushion',
    itemType: 'cultivation',
    type: 'cultivation',
    tier: item.tier,
    tierName: item.tierName,
    grade: item.tierName,
    quality: item.tier <= 2 ? 'ha_pham' : item.tier <= 4 ? 'trung_pham' : item.tier <= 6 ? 'thuong_pham' : item.tier <= 8 ? 'cuc_pham' : 'tuyet_pham',
    price: item.price,
    costLinhThach: item.price,
    stock: 99,
    maxStock: 99,
    description: item.description,
    requiredRealmIndex: item.requiredRealmIndex,
    requiredRealmName: item.requiredRealmName,
    cultivationEffects: item.effects,
    cultivationCategory: item.category,
    data: {
      cultivationShopItem: item,
      category: item.category,
      effects: item.effects,
      tier: item.tier,
      requiredRealmIndex: item.requiredRealmIndex,
      requiredRealmName: item.requiredRealmName,
    },
  };
}

export const TIER_CULTIVATION_MERCHANT_ITEMS: MerchantItem[] = CULTIVATION_SHOP_ITEMS_36.map(
  cultivationShopItemToMerchantItem
);

/**
 * Tính tổng % tốc độ tu vi cộng vĩnh viễn từ danh sách các tâm pháp đã giác ngộ
 */
export function getCultivationShopPermanentSpeedBonus(learnedManualIds: string[] = []): number {
  if (!learnedManualIds || learnedManualIds.length === 0) return 0;
  let totalPercent = 0;
  for (const id of learnedManualIds) {
    const item = CULTIVATION_SHOP_ITEMS_MAP.get(id);
    if (item && item.category === 'manual' && item.effects.permanentTuViSpeedPercent) {
      totalPercent += item.effects.permanentTuViSpeedPercent;
    }
  }
  return totalPercent / 100;
}

/**
 * Trả về thông tin hiển thị huy hiệu theo loại hình vật phẩm tu luyện
 */
export function getCultivationCategoryBadge(category: CultivationItemCategory): {
  label: string;
  icon: string;
  badgeClass: string;
} {
  switch (category) {
    case 'manual':
      return {
        label: 'Tâm Pháp Vĩnh Viễn',
        icon: '📜',
        badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700/50',
      };
    case 'array':
      return {
        label: 'Tụ Linh Trận Bàn',
        icon: '🌀',
        badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50',
      };
    case 'essence':
      return {
        label: 'Linh Tủy Tinh Hoa',
        icon: '💧',
        badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
      };
    case 'incense':
      return {
        label: 'Ngộ Đạo Dị Bảo',
        icon: '🪔',
        badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
      };
    default:
      return {
        label: 'Vật Phẩm Tu Luyện',
        icon: '🧘',
        badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      };
  }
}
