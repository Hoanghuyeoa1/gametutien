// lib/ores-shop-data.ts
// Kho Khoáng Thạch Linh Quặng Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { OreShopItem, OreCategory } from '@/lib/types/ores-shop';
import { MerchantItem } from '@/lib/types/items';

export const ORES_SHOP_CATALOG: OreShopItem[] = [
  // ============================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0-10)
  // ============================================
  {
    id: 'ore_t1_base',
    name: 'Bách Luyện Thiết Tinh',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Quặng sắt qua trăm lần tôi luyện, phôi rèn kiếm kích phàm cấp. Nguyên liệu căn bản nhất của Thần Binh Các.',
    flavorText: 'Trăm lần trong lửa tôi, ngàn búa đập không ngừng – quặng sắt thành tinh, phàm nhân đúc thần binh sơ kỳ.',
    price: 70,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryForgingUse: 'Phàm Kích / Phàm Kiếm sơ cấp',
    elementalAffinity: 'kim',
    hardnessGrade: 'so_cap'
  },
  {
    id: 'ore_t1_crystal',
    name: 'Thanh Ngân Thạch',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh thạch ánh bạc giúp truyền dẫn chân khí sơ khai, dùng khảm nạm phù văn dẫn linh cấp thấp.',
    flavorText: 'Trong vắt như trăng bạch, mạch văn linh quang chảy ngầm – tinh thạch dẫn đường cho chân khí luyện khí kỳ.',
    price: 110,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryForgingUse: 'Khảm Phù Văn Sơ Cấp',
    elementalAffinity: 'thuy',
    hardnessGrade: 'so_cap'
  },
  {
    id: 'ore_t1_defense',
    name: 'Hắc Nham Thạch',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Đá nham thạch đen tuyền tăng độ bền giáp trụ, vật liệu gia cố hộ giáp phàm cấp.',
    flavorText: 'Đen như đêm vô nguyệt, rắn như thép thiên niên – nham thạch vô danh, gốc rễ của mọi hộ giáp thiên hạ.',
    price: 90,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryForgingUse: 'Hộ Giáp Phàm Cấp',
    elementalAffinity: 'tho',
    hardnessGrade: 'so_cap'
  },
  {
    id: 'ore_t1_rare',
    name: 'Bạch Vân Mẫu Khoáng',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Vân mẫu ngưng tụ linh khí tăng độ sắc bén của binh khí, hiếm nhất trong Nhất Giai khoáng thạch.',
    flavorText: 'Vân trắng như sương, mẫu như tơ trời – quặng dị giới sơ kỳ, mang linh lực thiên ngoại nằm chờ thợ rèn.',
    price: 190,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryForgingUse: 'Binh Khí Dị Thuộc Tính',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'so_cap'
  },

  // ============================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11-20)
  // ============================================
  {
    id: 'ore_t2_base',
    name: 'Xích Đồng Linh Quặng',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Đồng đỏ hấp thu địa nhiệt, rèn linh khí Trúc Cơ. Phôi khoáng nền tảng của kiếm lệnh nhất phái.',
    flavorText: 'Địa nhiệt ngàn năm hun đúc đồng đỏ thành linh – tiếng búa vang rền, Trúc Cơ trận đồ kết thành.',
    price: 650,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryForgingUse: 'Linh Khí / Kiếm Lệnh Trúc Cơ',
    elementalAffinity: 'hoa',
    hardnessGrade: 'so_cap'
  },
  {
    id: 'ore_t2_crystal',
    name: 'Hàn Băng Tinh Thạch',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh thể băng giá ngưng đọng tạo sát thương thủy hệ, khảm nạm binh khí băng hệ đơn giản.',
    flavorText: 'Hơi lạnh như tuyết vực thiên cực, ánh lam toả ra ngưng đọng không gian – ai lạnh hơn đá này?',
    price: 1000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryForgingUse: 'Khảm Phù Văn Thủy Hệ',
    elementalAffinity: 'thuy',
    hardnessGrade: 'so_cap'
  },
  {
    id: 'ore_t2_defense',
    name: 'Huyền Thiết Cương Nham',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Huyền thiết nặng ngàn cân gia cố hộ giáp, tăng đáng kể phòng thủ vật lý Trúc Cơ kỳ.',
    flavorText: 'Huyền thiết không có màu ngoài tuyệt đen, nặng đến nỗi giáo pháp phổ thông không xuyên được.',
    price: 1500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryForgingUse: 'Hộ Giáp Trúc Cơ / Gia Cố Cứ Điểm',
    elementalAffinity: 'tho',
    hardnessGrade: 'trung_cap'
  },
  {
    id: 'ore_t2_rare',
    name: 'Hoàng Lân Thần Sa',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Cát vàng phát quang tăng tỷ lệ bạo kích khi đúc kiếm, mang linh khí của Long Mạch đại địa.',
    flavorText: 'Vảy rồng sa xuống hoá thành cát vàng, lấp lánh dưới ánh linh quang – ai đúc được sẽ liếm thấy vị Long Uy.',
    price: 2400,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryForgingUse: 'Binh Khí Bạo Kích Dị Thuộc Tính',
    elementalAffinity: 'kim',
    hardnessGrade: 'trung_cap'
  },

  // ============================================
  // TAM GIAI (Kim Đan Kỳ - Realm 21-30)
  // ============================================
  {
    id: 'ore_t3_base',
    name: 'Tử Đồng Tinh Khoáng',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Đồng tím ngưng tụ chân hỏa đan điền, phôi rèn Kim Đan bảo khí và hộ giáp bán linh cấp.',
    flavorText: 'Màu tím uyên bác như đan điền chín chắn, nhiệt độ tan chảy đúng bằng hỏa lực Kim Đan kỳ.',
    price: 5000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/40',
    primaryForgingUse: 'Bảo Khí Kim Đan / Hộ Giáp Bán Linh',
    elementalAffinity: 'hoa',
    hardnessGrade: 'trung_cap'
  },
  {
    id: 'ore_t3_crystal',
    name: 'Huyễn Quang Tinh Thạch',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh thạch ngũ sắc tạo ảo ảnh tăng né tránh, khảm nạm binh khí thân pháp lưu.',
    flavorText: 'Ngũ sắc lưu chuyển không ngừng, nhìn vào thấy hoa mắt – ai gắn được vào kiếm sẽ tàng hình trong huyễn ảnh.',
    price: 9000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/40',
    primaryForgingUse: 'Khảm Phù Văn Thân Pháp / Né Tránh',
    elementalAffinity: 'moc',
    hardnessGrade: 'trung_cap'
  },
  {
    id: 'ore_t3_defense',
    name: 'Kim Cương Sa Nham',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Đá cát kim cương cứng rắn chống chấn động, gia cố giáp trụ Kim Đan và nền móng cứ điểm.',
    flavorText: 'Kim cương vào cát, cứng thành thạch núi – giáp trụ nào cần chịu đựng hãy thêm một lớp cát này vào.',
    price: 13000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/40',
    primaryForgingUse: 'Giáp Trụ Kim Đan / Cứ Điểm Sơ Cấp',
    elementalAffinity: 'tho',
    hardnessGrade: 'cao_cap'
  },
  {
    id: 'ore_t3_rare',
    name: 'Địa Hỏa Dung Nham Tinh',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Tinh hoa núi lửa tăng mạnh sát thương hỏa hệ, mang nhiệt lực của Địa Tâm Hỏa vạn năm.',
    flavorText: 'Vạn năm dưới đất âm ỉ cháy, chưa bao giờ nguội – tinh hoa Địa Tâm chứa đủ lửa để đốt cháy nguyên anh.',
    price: 16000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/40',
    primaryForgingUse: 'Binh Khí Hỏa Hệ Cực Mạnh',
    elementalAffinity: 'hoa',
    hardnessGrade: 'cao_cap'
  },

  // ============================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 31-40)
  // ============================================
  {
    id: 'ore_t4_base',
    name: 'Cửu U Uẩn Thiết',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Thiết khoáng nơi cửu u nuôi dưỡng bản mệnh pháp bảo, gốc rễ của mọi Nguyên Anh thần binh.',
    flavorText: 'Cửu U tối tăm vô biên, thiết khoáng chứa ở đó ngàn đời không thoát – đây là linh hồn của pháp bảo.',
    price: 35000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/40',
    primaryForgingUse: 'Bản Mệnh Pháp Bảo Nguyên Anh',
    elementalAffinity: 'tho',
    hardnessGrade: 'cao_cap'
  },
  {
    id: 'ore_t4_crystal',
    name: 'Nguyệt Quang Thần Tinh',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Hấp thu ánh trăng ngàn năm tăng tốc độ xuất chiêu, cực kỳ quý hiếm tại cảnh giới này.',
    flavorText: 'Ngàn năm ngước lên nhìn trăng sáng, tinh thạch bấy giờ mới thấm đủ ánh nguyệt – xuất chiêu nhanh như trăng lưỡi kiếm.',
    price: 70000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/40',
    primaryForgingUse: 'Khảm Phù Văn Tốc Độ / Thân Pháp',
    elementalAffinity: 'thuy',
    hardnessGrade: 'cao_cap'
  },
  {
    id: 'ore_t4_defense',
    name: 'Trầm Hương Cương Nham',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Đá trầm hương hóa giải khí chấn thương, bảo vệ nguyên anh khỏi các cuộc tấn công hồn thức.',
    flavorText: 'Ngàn năm trầm hương kết thạch, hương khí bảo hộ nguyên anh bên trong – địch tấn công tâm thần thì gặp vách đá này.',
    price: 85000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/40',
    primaryForgingUse: 'Hộ Giáp Nguyên Anh / Chống Hồn Thức',
    elementalAffinity: 'moc',
    hardnessGrade: 'cao_cap'
  },
  {
    id: 'ore_t4_rare',
    name: 'Thiên Lôi Thần Thiết',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Kim loại tích tụ thiên lôi giáng thế gây choáng, kết hợp pháp bảo dễ kích hoạt lôi điện phong ấn.',
    flavorText: 'Lôi điện ngàn năm đánh cùng một điểm, thiên thiết kết tinh thành hình – đụng vào điện giật tứ chi tê liệt.',
    price: 120000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/40',
    primaryForgingUse: 'Thần Binh Lôi Điện Choáng',
    elementalAffinity: 'kim',
    hardnessGrade: 'cuc_pham'
  },

  // ============================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 41-50)
  // ============================================
  {
    id: 'ore_t5_base',
    name: 'Thái Hư Hắc Thiết',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Thiết đen không gian hư vô dùng rèn thần đao Hóa Thần, nặng nghìn lần mà nhẹ như không.',
    flavorText: 'Hư không vô hình mà thiết đen tồn tại – vật chất phi thường khai sinh từ nơi không gian tan rã.',
    price: 200000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    primaryForgingUse: 'Thần Đao / Linh Thực Hóa Thần',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'cuc_pham'
  },
  {
    id: 'ore_t5_crystal',
    name: 'Ngũ Hành Thần Tinh',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh thể ngũ hành dung hợp vạn pháp thần thông, cho phép pháp bảo hấp thụ mọi thuộc tính nguyên tố.',
    flavorText: 'Kim Mộc Thủy Hỏa Thổ đủ cả trong một viên tinh thạch – vũ khí nhúng vào đây trở nên vô thuộc tính khắc chế.',
    price: 400000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    primaryForgingUse: 'Pháp Bảo Ngũ Hành Dung Hợp',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'cuc_pham'
  },
  {
    id: 'ore_t5_defense',
    name: 'Bích Lạc Hộ Cương Nham',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Đá quặng bích lạc ngưng tụ kết giới phòng ngự, gia cố cứ điểm Tinh Hải và kết giới pháp trận.',
    flavorText: 'Bích Lạc màu trời thu trong vắt, mà cứng như kim cương – ai xây pháp trận bằng đá này thì nghìn năm không vỡ.',
    price: 500000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    primaryForgingUse: 'Kết Giới / Cứ Điểm Tinh Hải Trung Cấp',
    elementalAffinity: 'thuy',
    hardnessGrade: 'cuc_pham'
  },
  {
    id: 'ore_t5_rare',
    name: 'Chân Long Lân Thiết',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Vảy rồng hóa thạch tăng mạnh sát thương chuẩn, mang Long Uy áp đảo quân địch.',
    flavorText: 'Rồng chết lưu lại vảy, Long Uy còn đó nghìn đời – binh khí khảm vảy này, địch thủ tự nhiên mất nhuệ khí chiến đấu.',
    price: 650000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    primaryForgingUse: 'Thần Binh Long Uy / Sát Thương Chuẩn Cực Cao',
    elementalAffinity: 'kim',
    hardnessGrade: 'cuc_pham'
  },

  // ============================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 51-60)
  // ============================================
  {
    id: 'ore_t6_base',
    name: 'Thái Ất Thần Thiết',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Kim loại thái ất phản phác quy chân, phôi rèn tiên kiếm Luyện Hư và linh bảo thiên cấp.',
    flavorText: 'Thái Ất vô hình vô tướng, thiết khoáng từ nơi đó mang theo bản chất nguyên thủy của vạn vật.',
    price: 1500000,
    requiredRealmIndex: 51,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-500/40 text-red-300 bg-red-950/40',
    primaryForgingUse: 'Tiên Kiếm / Linh Bảo Thiên Cấp',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t6_crystal',
    name: 'Hư Không Toái Phiến',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Mảnh vỡ không gian xé toạc hộ giáp đối phương, khảm nạm binh khí xuyên phá phòng thủ.',
    flavorText: 'Không gian vỡ vụn, mảnh còn lại sắc như dao linh – phòng thủ nào cũng tan khi gặp mảnh vụn hư không này.',
    price: 2500000,
    requiredRealmIndex: 51,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-500/40 text-red-300 bg-red-950/40',
    primaryForgingUse: 'Khảm Phù Văn Xuyên Giáp',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t6_defense',
    name: 'Quy Chân Bất Toái Nham',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Nham thạch bất hoại miễn trừ debuff chấn thương, gia cố cứ điểm Tinh Hải bậc trung thượng.',
    flavorText: 'Quy chân về bản chất – đá này không thể vỡ, không thể mòn, không thể bị thứ gì phàm tục phá vỡ.',
    price: 3500000,
    requiredRealmIndex: 51,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-500/40 text-red-300 bg-red-950/40',
    primaryForgingUse: 'Cứ Điểm Tinh Hải / Kết Giới Bất Hoại',
    elementalAffinity: 'tho',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t6_rare',
    name: 'Cửu Thiên Huyền Cương',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Cương khí chín tầng trời gia tăng bạo thương cực hạn, linh lực từ tầng trời thứ chín thiên ngoại.',
    flavorText: 'Chín tầng trời cương khí giáng xuống kết thành – ai luyện được thứ này, một kiếm xuyên qua chín trùng hư không.',
    price: 4500000,
    requiredRealmIndex: 51,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-500/40 text-red-300 bg-red-950/40',
    primaryForgingUse: 'Thần Binh Bạo Thương Cực Hạn',
    elementalAffinity: 'kim',
    hardnessGrade: 'than_pham'
  },

  // ============================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 61-70)
  // ============================================
  {
    id: 'ore_t7_base',
    name: 'Bát Hoang Thần Đồng',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Đồng thần cổ đại dung nạp pháp thân vạn trượng, phôi rèn thánh khí Hợp Thể cảnh giới.',
    flavorText: 'Tám hoang vô biên chỉ có một mạch đồng thần – lò rèn nào đủ lực để nung chảy nó đây?',
    price: 10000000,
    requiredRealmIndex: 61,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    primaryForgingUse: 'Thánh Khí / Pháp Thân Hợp Thể',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t7_crystal',
    name: 'Thất Tinh Hồn Tinh',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh thể 7 vì sao nuôi dưỡng khí linh thần thức, tăng cộng hưởng pháp bảo với chủ nhân.',
    flavorText: 'Bảy sao Bắc Đẩu rọi xuống, tinh thạch thấm đủ tinh quang thiên thể – ai nuôi thần thức bằng thứ này sẽ cảm ứng thiên địa.',
    price: 20000000,
    requiredRealmIndex: 61,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    primaryForgingUse: 'Nuôi Dưỡng Pháp Bảo / Thần Thức Cộng Hưởng',
    elementalAffinity: 'thuy',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t7_defense',
    name: 'Thái Cực Bất Hoại Thiết',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Thiết thái cực chuyển hóa sát thương nhận vào, gia cố thánh vệ Hợp Thể và pháp trận tiên cấp.',
    flavorText: 'Âm Dương chuyển hóa vô cùng, Thái Cực thiết hấp thu đòn địch thành chân nguyên cho chủ – phòng thủ mà như công kích.',
    price: 28000000,
    requiredRealmIndex: 61,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    primaryForgingUse: 'Thánh Vệ / Pháp Trận Tiên Cấp',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t7_rare',
    name: 'Vạn Kiếp Thần Sa',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Cát thần tôi luyện từ muôn vàn lôi kiếp tăng miễn thương, mang dấu ấn vượt qua thiên kiếp.',
    flavorText: 'Vạn lần lôi kiếp giáng xuống, cát bụi kết thành thần sa – ai rèn được thứ này thì lôi kiếp sẽ không còn là nỗi lo.',
    price: 35000000,
    requiredRealmIndex: 61,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    primaryForgingUse: 'Thần Binh Miễn Thương Thiên Kiếp',
    elementalAffinity: 'kim',
    hardnessGrade: 'than_pham'
  },

  // ============================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 71-80)
  // ============================================
  {
    id: 'ore_t8_base',
    name: 'Vạn Cổ Diệt Thế Thiết',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Thiết khoáng mang sức mạnh hủy diệt chư thiên, phôi rèn thần binh đại thừa siêu phàm.',
    flavorText: 'Vạn cổ chỉ xuất hiện một lần, thiết đen mang ký ức hủy diệt vũ trụ cũ – ai rèn được thứ này, binh khí thành Diệt Thế Thần Vật.',
    price: 70000000,
    requiredRealmIndex: 71,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    primaryForgingUse: 'Thần Binh Đại Thừa / Diệt Thế Vũ Khí',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t8_crystal',
    name: 'Thái Sơ Hỗn Nguyên Tinh',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh hoa thái sơ khai mở thần thể đại thừa, tăng cộng hưởng toàn bộ pháp bảo đến cực hạn.',
    flavorText: 'Trước khi vũ trụ khai sinh, có tinh hoa thái sơ – nó là cội nguồn của mọi linh lực, chứa đựng hết thảy vạn pháp.',
    price: 120000000,
    requiredRealmIndex: 71,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    primaryForgingUse: 'Khai Phá Thần Thể / Pháp Bảo Toàn Cộng Hưởng',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t8_defense',
    name: 'Bất Hủ Thánh Nham',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Đá thánh vạn kiếp không mòn, gia cố cứ điểm Tinh Hải bất khả xâm phạm và thánh vệ đại thừa.',
    flavorText: 'Vạn kiếp lôi không phá nổi, vạn pháp thần thông không khắc được – đây là thánh nham đứng vững đến khi trời đất tàn.',
    price: 150000000,
    requiredRealmIndex: 71,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    primaryForgingUse: 'Cứ Điểm Tinh Hải Bất Khả Xâm Phạm',
    elementalAffinity: 'tho',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t8_rare',
    name: 'Hồng Mông Linh Quặng',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Quặng hồng mông ngưng đọng thiên đạo quy tắc, vật liệu tối thượng của cảnh giới Đại Thừa.',
    flavorText: 'Hồng Mông là trạng thái trước khi trời đất phân – quặng từ đó mang theo luật lệ khai thiên vạn pháp.',
    price: 200000000,
    requiredRealmIndex: 71,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    primaryForgingUse: 'Thần Binh Thiên Đạo Quy Tắc',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },

  // ============================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 81+)
  // ============================================
  {
    id: 'ore_t9_base',
    name: 'Hỗn Độn Thần Thiết',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'phoi_ren',
    categoryName: 'Phôi Rèn',
    description: 'Vật chất hỗn độn nguyên thủy rèn thần binh khai thiên lập địa. Tương thích hoàn toàn với phân hệ Tinh Hải & Cosmic Defense.',
    flavorText: 'Trước khi trời đất khai mở – vật chất này đã tồn tại, không tên không hình, không thể diễn đạt bằng ngôn từ nào hết.',
    price: 500000000,
    requiredRealmIndex: 81,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40',
    primaryForgingUse: 'Khai Thiên Thần Binh / Cosmic Defense Fortification',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t9_crystal',
    name: 'Tiên Thiên Huyền Hoàng Tinh',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'linh_tinh',
    categoryName: 'Linh Tinh',
    description: 'Tinh thạch khí huyền hoàng ngưng tụ tiên khí tối thượng, cộng hưởng với mọi pháp bảo tiên cấp.',
    flavorText: 'Huyền Hoàng khí – hai màu khai thiên tích địa, tinh thạch từ đó không khác gì giọt máu của Đạo Tổ.',
    price: 850000000,
    requiredRealmIndex: 81,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40',
    primaryForgingUse: 'Pháp Bảo Tiên Cấp Tối Thượng',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t9_defense',
    name: 'Cửu Cực Tiên Thiên Cương',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'ho_cuong',
    categoryName: 'Hộ Cương',
    description: 'Cương thạch bảo hộ tiên thể, miễn nhiễm sát thương lôi kiếp và tất cả tấn công dưới Tiên Nhân cấp.',
    flavorText: 'Chín cực giới hạn của thiên địa tụ tập thành cương – không có kiếm nào chém xuống đây còn hoàn nguyên.',
    price: 1000000000,
    requiredRealmIndex: 81,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40',
    primaryForgingUse: 'Tiên Vệ / Cứ Điểm Tinh Hải Cực Phẩm',
    elementalAffinity: 'tho',
    hardnessGrade: 'than_pham'
  },
  {
    id: 'ore_t9_rare',
    name: 'Sáng Thế Hỗn Độn Thạch',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'di_quang',
    categoryName: 'Tiên Thiên Dị Quáng',
    description: 'Đá sáng thế đúc tạo bảo vật cấp Hỗn Độn Chí Bảo, hiếm nhất trong vũ trụ này.',
    flavorText: 'Khi trời đất khai sinh, những mảnh đá đầu tiên vỡ ra từ Hỗn Độn – đây là những mảnh đó. Chúng là vật liệu của Chí Bảo.',
    price: 1600000000,
    requiredRealmIndex: 81,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40',
    primaryForgingUse: 'Hỗn Độn Chí Bảo / Vật Liệu Bảo Vật Cấp Tối Thượng',
    elementalAffinity: 'hon_don',
    hardnessGrade: 'than_pham'
  }
];

// ============================================
// Adapter: OreShopItem -> MerchantItem
// ============================================
export function oreShopItemToMerchantItem(ore: OreShopItem): MerchantItem {
  const tierQualityMap: Record<number, string> = {
    1: 'ha_pham',
    2: 'ha_pham',
    3: 'trung_pham',
    4: 'trung_pham',
    5: 'thuong_pham',
    6: 'thuong_pham',
    7: 'cuc_pham',
    8: 'tien_pham',
    9: 'than_pham'
  };

  return {
    id: ore.id,
    name: ore.name,
    category: 'ores',
    itemType: 'ore',
    quality: tierQualityMap[ore.tier] || 'ha_pham',
    grade: ore.tierName,
    tier: ore.tier,
    tierName: ore.tierName,
    price: ore.price,
    stock: 999,
    maxStock: 999,
    oreCategory: ore.category,
    oreTier: ore.tier,
    primaryForgingUse: ore.primaryForgingUse,
    elementalAffinity: ore.elementalAffinity,
    requiredRealmIndex: ore.requiredRealmIndex,
    requiredRealmName: ore.requiredRealmName,
    description: ore.description,
    data: {
      oreShopItem: ore,
      isOreShopItem: true,
      category: ore.category,
      primaryForgingUse: ore.primaryForgingUse,
      elementalAffinity: ore.elementalAffinity,
      flavorText: ore.flavorText,
      hardnessGrade: ore.hardnessGrade
    }
  };
}

export const TIER_ORES_MERCHANT_ITEMS: MerchantItem[] = ORES_SHOP_CATALOG.map(oreShopItemToMerchantItem);

// Lookup dictionary O(1) by ID
export const ORES_SHOP_ITEMS_MAP: Record<string, OreShopItem> = Object.fromEntries(
  ORES_SHOP_CATALOG.map(o => [o.id, o])
);

// ============================================
// Badge helpers
// ============================================
export function getOreCategoryBadge(category: OreCategory): { label: string; icon: string; badgeColor: string; badgeClass: string } {
  switch (category) {
    case 'phoi_ren':
      return { label: 'Phôi Rèn', icon: '⚔️', badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40', badgeClass: 'border-amber-500/40 text-amber-300 bg-amber-950/40' };
    case 'linh_tinh':
      return { label: 'Linh Tinh', icon: '🔮', badgeColor: 'border-sky-500/40 text-sky-300 bg-sky-950/40', badgeClass: 'border-sky-500/40 text-sky-300 bg-sky-950/40' };
    case 'ho_cuong':
      return { label: 'Hộ Cương', icon: '🛡️', badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40', badgeClass: 'border-blue-500/40 text-blue-300 bg-blue-950/40' };
    case 'di_quang':
      return { label: 'Tiên Thiên Dị Quáng', icon: '🌌', badgeColor: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40', badgeClass: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40' };
    default:
      return { label: 'Khoáng Thạch', icon: '⛏️', badgeColor: 'border-zinc-500/40 text-zinc-300 bg-zinc-900/40', badgeClass: 'border-zinc-500/40 text-zinc-300 bg-zinc-900/40' };
  }
}

export function getOreElementalBadge(elem: string): { label: string; icon: string; color: string; badgeClass: string } {
  switch (elem) {
    case 'kim':
      return { label: 'Kim Hệ', icon: '⚔️', color: 'text-amber-200 border-amber-500/40 bg-amber-950/30', badgeClass: 'text-amber-200 border-amber-500/40 bg-amber-950/30' };
    case 'moc':
      return { label: 'Mộc Hệ', icon: '🍃', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30', badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30' };
    case 'thuy':
      return { label: 'Thủy Hệ', icon: '💧', color: 'text-sky-300 border-sky-500/40 bg-sky-950/30', badgeClass: 'text-sky-300 border-sky-500/40 bg-sky-950/30' };
    case 'hoa':
      return { label: 'Hỏa Hệ', icon: '🔥', color: 'text-red-400 border-red-500/40 bg-red-950/30', badgeClass: 'text-red-400 border-red-500/40 bg-red-950/30' };
    case 'tho':
      return { label: 'Thổ Hệ', icon: '⛰️', color: 'text-yellow-500 border-yellow-700/40 bg-yellow-950/30', badgeClass: 'text-yellow-500 border-yellow-700/40 bg-yellow-950/30' };
    case 'hon_don':
    default:
      return { label: 'Hỗn Độn', icon: '🌌', color: 'text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-950/30', badgeClass: 'text-fuchsia-300 border-fuchsia-500/40 bg-fuchsia-950/30' };
  }
}
