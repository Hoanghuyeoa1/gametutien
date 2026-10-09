// lib/herbs-shop-data.ts
// Kho Dược Thảo Linh Mộc Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { HerbShopItem, HerbCategory } from '@/lib/types/herbs-shop';
import { MerchantItem } from '@/lib/types/items';

export const HERBS_SHOP_CATALOG: HerbShopItem[] = [
  // ============================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0-10)
  // ============================================
  {
    id: 'herb_t1_qi',
    name: 'Ninh Thần Thảo',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Thảo mộc xanh nhạt ngưng tụ linh khí sơ khai, dùng luyện Tụ Khí Đan.',
    flavorText: 'Mọc ven suối linh tuyền thượng nguồn, phiến lá lấp lánh huỳnh quang dịu mát, giúp an thần dưỡng khí khi luyện đan sơ giai.',
    price: 60,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryAlchemyUse: 'Tụ Khí Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'ha'
  },
  {
    id: 'herb_t1_break',
    name: 'Hoàng Tinh Căn',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Rễ cây trăm năm hấp thụ tinh hoa đất trời, dùng luyện Phá Chướng Đan.',
    flavorText: 'Ẩn mình dưới tầng đất cằn cỗi trăm năm, rễ cây kết tinh hoàng thổ chi khí giúp đả thông kinh mạch tắc nghẽn sơ kỳ.',
    price: 100,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryAlchemyUse: 'Phá Chướng Đan',
    elementalAffinity: 'tho',
    rarityGrade: 'ha'
  },
  {
    id: 'herb_t1_life',
    name: 'Huyết Khí Chi',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Nấm linh chi đỏ thẫm bồi bổ khí huyết, dùng luyện Dưỡng Huyết Đan.',
    flavorText: 'Hấp thu huyết dịch cổ thụ ngàn năm, tai nấm đỏ như ngọc huyết, chuyên trị khí huyết hao tổn và gia cố thọ nguyên.',
    price: 80,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryAlchemyUse: 'Dưỡng Huyết Đan',
    elementalAffinity: 'hoa',
    rarityGrade: 'ha'
  },
  {
    id: 'herb_t1_rare',
    name: 'Bạch Ngọc Quả',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Quả mọng trắng ngần cường hóa gân cốt, dùng luyện Kiện Thể Đan.',
    flavorText: 'Trăm năm mới kết một chùm quả trắng ngần như mỡ đông, ngậm vào tan ngay nơi đầu lưỡi, cường hóa căn cốt vững như bàn thạch.',
    price: 180,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    primaryAlchemyUse: 'Kiện Thể Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'trung'
  },

  // ============================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11-15)
  // ============================================
  {
    id: 'herb_t2_qi',
    name: 'Chân Nguyên Hoa',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Hoa linh mộc tỏa hương thơm ngát bồi đắp chân nguyên, dùng luyện Chân Nguyên Đan.',
    flavorText: 'Nở rộ lúc rạng đông khi tử khí đông lai giáng thế, cánh hoa tích tụ chân nguyên thuần khiết gấp mười lần cỏ thuốc thông thường.',
    price: 600,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryAlchemyUse: 'Chân Nguyên Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'trung'
  },
  {
    id: 'herb_t2_break',
    name: 'Địa Tâm Hỏa Chi',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Nấm linh sinh trưởng gần nham thạch, dùng luyện Trúc Cơ Đan.',
    flavorText: 'Hấp thụ địa hỏa ngàn trượng sâu dưới lòng đất, tai nấm tỏa ra nhiệt lượng cuồn cuộn giúp tôi luyện đan điền, đúc thành Đạo Cơ vĩnh cửu.',
    price: 1400,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryAlchemyUse: 'Trúc Cơ Đan',
    elementalAffinity: 'hoa',
    rarityGrade: 'thuong'
  },
  {
    id: 'herb_t2_life',
    name: 'Bách Niên Hà Thủ Ô',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Dược căn hấp thụ nguyệt hoa, tăng thọ nguyên, dùng luyện Cố Bản Bồi Nguyên Đan.',
    flavorText: 'Hình thù như đứa trẻ sơ sinh, rễ cây thấu triệt sinh mệnh khí của đất mẹ, kéo dài tuổi thọ và thanh tẩy trọc khí đan độc.',
    price: 900,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryAlchemyUse: 'Cố Bản Bồi Nguyên Đan',
    elementalAffinity: 'thuy',
    rarityGrade: 'trung'
  },
  {
    id: 'herb_t2_rare',
    name: 'Ngũ Hành Linh Đằng',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Dây leo ngũ sắc tẩy tủy hoán cốt, dùng luyện Tẩy Tủy Đan.',
    flavorText: 'Thân đằng xoắn xuýt năm màu tương sinh tương khắc, dung hợp linh khí trời đất giúp tẩy trừ tạp chất cốt tủy phàm trần.',
    price: 2200,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/40 text-emerald-300 bg-emerald-950/40',
    primaryAlchemyUse: 'Tẩy Tủy Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'thuong'
  },

  // ============================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16-20)
  // ============================================
  {
    id: 'herb_t3_qi',
    name: 'Kim Dương Thảo',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Thảo mộc hấp thu thái dương chân hỏa, dùng luyện Kim Dương Đan.',
    flavorText: 'Sinh trưởng trên đỉnh núi Thái Dương quanh năm không bóng râm, hấp thụ chân dương chi khí giúp Kim Đan sáng ngời rực rỡ.',
    price: 4500,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    primaryAlchemyUse: 'Kim Dương Đan',
    elementalAffinity: 'hoa',
    rarityGrade: 'thuong'
  },
  {
    id: 'herb_t3_break',
    name: 'Ngưng Kim Hóa Dịch Thảo',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Linh thảo hỗ trợ ngưng tụ đan anh, dùng luyện Kết Kim Đan.',
    flavorText: 'Lá cây tự sinh ra chất lỏng óng ánh hoàng kim, xúc tác hóa lỏng chân nguyên cô đọng thành hạt Kim Đan viên mãn.',
    price: 12000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    primaryAlchemyUse: 'Kết Kim Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'cuc'
  },
  {
    id: 'herb_t3_life',
    name: 'Thiên Niên Chu Quả',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Trái đỏ nghìn năm cố bản bồi thọ, dùng luyện Thanh Mệnh Đan.',
    flavorText: 'Ngàn năm đơm hoa, ngàn năm kết trái, mỗi quả đỏ rực như giọt máu phượng hoàng, bồi bổ năm mươi năm thọ nguyên cho tu sĩ.',
    price: 8000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    primaryAlchemyUse: 'Thanh Mệnh Đan',
    elementalAffinity: 'hoa',
    rarityGrade: 'thuong'
  },
  {
    id: 'herb_t3_rare',
    name: 'Tử Linh U Uẩn Hoa',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Hoa tím nuôi dưỡng thần thức sơ kỳ, dùng luyện Ngưng Thần Đan.',
    flavorText: 'Đóa hoa tím biếc nở trong u cốc tĩnh mịch, mùi hương thẩm thấu thức hải giúp mở rộng thần thức và tăng cường phúc duyên.',
    price: 15000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/40 text-sky-300 bg-sky-950/40',
    primaryAlchemyUse: 'Ngưng Thần Đan',
    elementalAffinity: 'thuy',
    rarityGrade: 'cuc'
  },

  // ============================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21-25)
  // ============================================
  {
    id: 'herb_t4_qi',
    name: 'Tụ Anh Linh Chi',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Nấm tiên tụ khí giúp Nguyên Anh ngưng thực, dùng luyện Tụ Anh Đan.',
    flavorText: 'Tai nấm tỏa sương khói mờ ảo hình hài anh nhi, cung cấp linh lực dồi dào bồi đắp Nguyên Anh Pháp Thân mau chóng tráng kiện.',
    price: 30000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    primaryAlchemyUse: 'Tụ Anh Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'cuc'
  },
  {
    id: 'herb_t4_break',
    name: 'Toái Đan Hóa Anh Thảo',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Thảo dược nghịch chuyển Kim Đan hóa thành Anh Nhi, dùng luyện Hóa Anh Đan.',
    flavorText: 'Vị thuốc chí tôn quyết định sinh tử khi phá đan sinh anh, bảo vệ thức hải không bị nổ tung trước uy lực cuồng bạo của lôi kiếp.',
    price: 75000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    primaryAlchemyUse: 'Hóa Anh Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t4_life',
    name: 'Vạn Niên Thanh Liên',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Sen ngọc thanh tẩy tâm ma và đan độc, dùng luyện Bổ Thiên Đan.',
    flavorText: 'Bông sen xanh vạn năm mọc giữa hàn đàm cực bắc, thanh lọc toàn bộ đan độc tích tụ trong kinh mạch và đẩy lui tâm ma quấy nhiễu.',
    price: 60000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    primaryAlchemyUse: 'Bổ Thiên Đan',
    elementalAffinity: 'thuy',
    rarityGrade: 'cuc'
  },
  {
    id: 'herb_t4_rare',
    name: 'Cửu U Uẩn Thần Quả',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Quả mọc nơi u minh uẩn dưỡng hồn phách, dùng luyện Cửu Chuyển Hồn Đan.',
    flavorText: 'Hái từ bờ sông Vong Xuyên nơi ranh giới cõi u minh, chứa uẩn khí rèn luyện linh hồn bất diệt, tăng vọt thần thức và ngộ tính.',
    price: 110000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/40 text-purple-300 bg-purple-950/40',
    primaryAlchemyUse: 'Cửu Chuyển Hồn Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },

  // ============================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26-30)
  // ============================================
  {
    id: 'herb_t5_qi',
    name: 'Thái Hư Dẫn Khí Thảo',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Thảo dược dẫn động thiên địa linh khí mênh mông, dùng luyện Thái Hư Đan.',
    flavorText: 'Thân thảo trong suốt như không khí, có khả năng dẫn động cuồn cuộn hư không chi khí rót vào đan điền tu sĩ Hóa Thần.',
    price: 180000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/50',
    primaryAlchemyUse: 'Thái Hư Đan',
    elementalAffinity: 'thuy',
    rarityGrade: 'cuc'
  },
  {
    id: 'herb_t5_break',
    name: 'Hóa Thần Ngọc Tủy Mộc',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Gỗ tiên ngưng tụ linh nhĩ giúp thần thức xuất khiếu, dùng luyện Hóa Thần Đan.',
    flavorText: 'Đoạn gỗ ngọc tủy chảy ra nhựa thơm tiên đạo, giúp thần thức câu thông thiên địa, xuất khiếu ngao du cửu thiên thập địa.',
    price: 450000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/50',
    primaryAlchemyUse: 'Hóa Thần Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t5_life',
    name: 'Bồ Đề Trường Sinh Chi',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Cành bồ đề tăng thọ nguyên trăm năm, dùng luyện Trường Sinh Đan.',
    flavorText: 'Bẻ từ cội bồ đề tiên giới ngàn năm trước, tích tụ thụy khí Phật môn và đạo môn, gia tăng thọ nguyên vô biên vượt qua lẽ thường.',
    price: 350000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/50',
    primaryAlchemyUse: 'Trường Sinh Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t5_rare',
    name: 'Ngộ Đạo Vấn Tâm Hoa',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Cánh hoa khai mở tuệ nhãn ngộ tính, dùng luyện Ngộ Đạo Đan.',
    flavorText: 'Mỗi cánh hoa mang một đạo văn tiên thiên, khi hít thở hương hoa tâm cảnh lập tức minh triệt, phá tan tầng tầng mê chướng ngộ đạo.',
    price: 600000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/50',
    primaryAlchemyUse: 'Ngộ Đạo Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },

  // ============================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31-35)
  // ============================================
  {
    id: 'herb_t6_qi',
    name: 'Thái Ất Chân Linh Diệp',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Lá cây tiên đạo tích tụ chân nguyên vô tận, dùng luyện Thái Ất Chân Đan.',
    flavorText: 'Phiến lá khắc chữ triện tự nhiên từ thời thượng cổ, ẩn chứa nguồn năng lượng dồi dào đưa tu vi thăng hoa tột bậc.',
    price: 1300000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/50',
    primaryAlchemyUse: 'Thái Ất Chân Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'cuc'
  },
  {
    id: 'herb_t6_break',
    name: 'Quy Chân Luyện Hư Đằng',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Dây leo hư không giúp phản phác quy chân, dùng luyện Luyện Hư Đan.',
    flavorText: 'Dây leo không gốc mọc giữa khe nứt không gian, giúp dung hợp bản nguyên thế giới vào đan điền tiến nhập cảnh giới Luyện Hư.',
    price: 3000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/50',
    primaryAlchemyUse: 'Luyện Hư Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t6_life',
    name: 'Thiên Niên Bất Lão Căn',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Rễ thần mộc nghìn năm không mục rữa, dùng luyện Thiên Niên Bất Lão Đan.',
    flavorText: 'Rễ cây trường tồn cùng nhật nguyệt, bổ dưỡng khí huyết và cốt tủy khiến diện mạo trẻ mãi không già, thọ sánh nam sơn.',
    price: 2200000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/50',
    primaryAlchemyUse: 'Thiên Niên Bất Lão Đan',
    elementalAffinity: 'tho',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t6_rare',
    name: 'Hư Không Huyễn Tinh Quả',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Quả trong suốt lơ lửng giữa hư không tăng né tránh và thần niệm, dùng luyện Hư Không Linh Đan.',
    flavorText: 'Trái cây trong suốt ẩn hiện chớp tắt giữa không gian đa chiều, ăn vào thân thể nhẹ tựa lông hồng, né tránh vạn pháp công kích.',
    price: 4000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/50',
    primaryAlchemyUse: 'Hư Không Linh Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },

  // ============================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36-40)
  // ============================================
  {
    id: 'herb_t7_qi',
    name: 'Cửu Dương Quy Nguyên Căn',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Rễ cây cửu dương dung nạp vạn mạch, dùng luyện Cửu Dương Quy Nguyên Đan.',
    flavorText: 'Tích tụ chín luồng nguyên khí chí dương từ thiên hà, điều hòa vạn mạch tương thông, bồi dưỡng pháp lực ngập tràn cửu thiên.',
    price: 9000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/50',
    primaryAlchemyUse: 'Cửu Dương Quy Nguyên Đan',
    elementalAffinity: 'hoa',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t7_break',
    name: 'Pháp Thân Hợp Nhất Chi',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Linh chi hợp nhất nhục thân và pháp tướng, dùng luyện Hợp Thể Đan.',
    flavorText: 'Dược lực kinh thiên động địa giúp dung hợp hoàn mỹ giữa Pháp Tướng khổng lồ và chân thân huyết nhục thành một thể bất diệt.',
    price: 18000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/50',
    primaryAlchemyUse: 'Hợp Thể Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t7_life',
    name: 'Niết Bàn Bất Diệt Hoa',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Hoa lửa niết bàn đoạt mệnh luân hồi, dùng luyện Niết Bàn Tái Sinh Đan.',
    flavorText: 'Hạt giống sinh trưởng từ đống tro tàn của Thiên Hỏa Phượng Hoàng, cánh hoa rực cháy ánh lửa niết bàn nghịch chuyển sinh tử.',
    price: 25000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/50',
    primaryAlchemyUse: 'Niết Bàn Tái Sinh Đan',
    elementalAffinity: 'hoa',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t7_rare',
    name: 'Vạn Kiếp Thần Thiết Liên',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Sen kim loại ngưng tụ từ vạn kiếp lôi đình tăng miễn thương, dùng luyện Vạn Kiếp Kim Đan.',
    flavorText: 'Đóa sen cứng hơn huyền thiết hấp thụ hàng vạn tia sét thiên kiếp, ăn vào nhục thân đúc thành kim cương bất hoại, miễn thương cực hạn.',
    price: 32000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/50',
    primaryAlchemyUse: 'Vạn Kiếp Kim Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'than'
  },

  // ============================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41-45)
  // ============================================
  {
    id: 'herb_t8_qi',
    name: 'Hỗn Nguyên Thánh Đạo Thảo',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Cỏ thánh diễn hóa hỗn nguyên đại đạo, dùng luyện Hỗn Nguyên Thánh Đan.',
    flavorText: 'Tự sinh ra quy tắc âm dương luân chuyển xung quanh, chỉ một cọng cỏ cũng đủ diễn hóa thành một tiểu thế giới hoàn chỉnh.',
    price: 60000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/50',
    primaryAlchemyUse: 'Hỗn Nguyên Thánh Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t8_break',
    name: 'Đại Thừa Viên Mãn Quả',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Trái tiên đắc đạo thông thiên triệt địa, dùng luyện Đại Thừa Đan.',
    flavorText: 'Quả tiên viên mãn không tì vết, bên trong ẩn chứa đạo quả thông thiên triệt địa, giúp tu sĩ bước chân vào hàng ngũ Đại Thừa Tôn Giả.',
    price: 130000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/50',
    primaryAlchemyUse: 'Đại Thừa Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t8_life',
    name: 'Cửu Chuyển Hồi Thiên Mộc',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Gỗ thiêng cải tử hoàn sinh vạn năm thọ mệnh, dùng luyện Cửu Chuyển Hồi Thiên Đan.',
    flavorText: 'Khúc gỗ hồi thiên cắm xuống đất khô cằn lập tức đâm chồi nảy lộc, có uy lực cải tử hoàn sinh, đoạt lại linh hồn từ tay Diêm Vương.',
    price: 110000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/50',
    primaryAlchemyUse: 'Cửu Chuyển Hồi Thiên Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t8_rare',
    name: 'Thông Thiên Vạn Pháp Căn',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Rễ thông thiên dung hợp toàn bộ thuộc tính tiên gia, dùng luyện Thông Thiên Vạn Pháp Đan.',
    flavorText: 'Rễ cây đâm xuyên tam giới, hấp thu tinh hoa vạn đạo quy về một mối, gia tăng toàn diện chỉ số thần thông của đại năng.',
    price: 180000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/50',
    primaryAlchemyUse: 'Thông Thiên Vạn Pháp Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },

  // ============================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // ============================================
  {
    id: 'herb_t9_qi',
    name: 'Hỗn Độn Tạo Hóa Căn',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'duong_khi',
    categoryName: 'Dưỡng Khí Thảo',
    description: 'Căn nguyên hỗn độn sơ khai của vũ trụ, dùng luyện Hỗn Độn Tạo Hóa Tiên Đan.',
    flavorText: 'Sinh ra trước khi trời đất phân định, chứa nguyên khí tạo hóa sơ khai giúp tu sĩ Độ Kiếp ngưng tụ Tiên Thiên Chân Thể vô thượng.',
    price: 450000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-300 bg-yellow-950/60',
    primaryAlchemyUse: 'Hỗn Độn Tạo Hóa Tiên Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t9_break',
    name: 'Độ Kiếp Hóa Lôi Liên',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'pha_canh',
    categoryName: 'Phá Cảnh Dị Dược',
    description: 'Sen tiên nở giữa thiên kiếp hóa giải lôi phạt, dùng luyện Độ Kiếp Tiên Đan.',
    flavorText: 'Đóa sen ngạo nghễ bung nở giữa tâm chấn Cửu Trọng Thiên Kiếp, hấp thụ lôi phạt cuồng bạo biến thành cam lộ tẩy trần đắc đạo phi thăng.',
    price: 900000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-300 bg-yellow-950/60',
    primaryAlchemyUse: 'Độ Kiếp Tiên Đan',
    elementalAffinity: 'kim',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t9_life',
    name: 'Bất Tử Vĩnh Sinh Thần Thảo',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'dien_tho',
    categoryName: 'Diên Thọ Thần Chi',
    description: 'Thần thảo trường sinh cùng trời đất, dùng luyện Bất Tử Vĩnh Sinh Đan.',
    flavorText: 'Cỏ bất tử đắm mình trong dòng thời gian vĩnh cửu, thoát khỏi quy luật sinh lão bệnh tử, uống vào thọ mệnh đồng thọ cùng thiên địa.',
    price: 750000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-300 bg-yellow-950/60',
    primaryAlchemyUse: 'Bất Tử Vĩnh Sinh Đan',
    elementalAffinity: 'moc',
    rarityGrade: 'than'
  },
  {
    id: 'herb_t9_rare',
    name: 'Hồng Mông Đạo Quả Chi',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'di_chung',
    categoryName: 'Tiên Thiên Dị Chủng',
    description: 'Quả đạo hồng mông ngưng tụ vạn cổ tiên thể, dùng luyện Hồng Mông Đạo Quả Đan.',
    flavorText: 'Nhánh quả hồng mông hấp thụ khí hỗn nguyên của vũ trụ sơ khai, ăn vào lập tức đúc thành Vạn Cổ Tiên Thể, siêu thoát lục đạo luân hồi.',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-300 bg-yellow-950/60',
    primaryAlchemyUse: 'Hồng Mông Đạo Quả Đan',
    elementalAffinity: 'hon_don',
    rarityGrade: 'than'
  }
];

export const HERBS_SHOP_ITEMS_MAP: Record<string, HerbShopItem> = HERBS_SHOP_CATALOG.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, HerbShopItem>);

export function herbShopItemToMerchantItem(herb: HerbShopItem): MerchantItem {
  return {
    id: herb.id,
    name: herb.name,
    category: 'herbs',
    itemType: 'herb',
    type: 'herb',
    price: herb.price,
    costLinhThach: herb.price,
    stock: 999,
    maxStock: 999,
    oneTimeOnly: false,
    isSoldOutPermanent: false,
    grade: herb.tierName,
    quality: herb.rarityGrade === 'than' ? 'tien_pham' : herb.rarityGrade === 'cuc' ? 'cuc_pham' : herb.rarityGrade === 'thuong' ? 'thuong_pham' : 'trung_pham',
    tier: herb.tier,
    tierName: herb.tierName,
    herbTier: herb.tier,
    herbCategory: herb.category,
    primaryAlchemyUse: herb.primaryAlchemyUse,
    elementalAffinity: herb.elementalAffinity,
    requiredRealmIndex: herb.requiredRealmIndex,
    requiredRealmName: herb.requiredRealmName,
    description: herb.description,
    data: {
      herbShopItem: herb,
      isHerbShopItem: true,
      category: herb.category,
      primaryAlchemyUse: herb.primaryAlchemyUse,
      elementalAffinity: herb.elementalAffinity,
      flavorText: herb.flavorText
    }
  };
}

export const TIER_HERBS_MERCHANT_ITEMS: MerchantItem[] = HERBS_SHOP_CATALOG.map(herbShopItemToMerchantItem);

export function getHerbCategoryBadge(category: HerbCategory): { label: string; icon: string; badgeColor: string; badgeClass: string } {
  switch (category) {
    case 'duong_khi':
      return { label: 'Dưỡng Khí', icon: '🍃', badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40', badgeClass: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' };
    case 'pha_canh':
      return { label: 'Phá Cảnh', icon: '⚡', badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40', badgeClass: 'border-amber-500/40 text-amber-300 bg-amber-950/40' };
    case 'dien_tho':
      return { label: 'Diên Thọ', icon: '🍄', badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40', badgeClass: 'border-rose-500/40 text-rose-300 bg-rose-950/40' };
    case 'di_chung':
      return { label: 'Tiên Thiên Dị Chủng', icon: '🌸', badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40', badgeClass: 'border-purple-500/40 text-purple-300 bg-purple-950/40' };
    default:
      return { label: 'Dược Thảo', icon: '🌿', badgeColor: 'border-zinc-500/40 text-zinc-300 bg-zinc-900/40', badgeClass: 'border-zinc-500/40 text-zinc-300 bg-zinc-900/40' };
  }
}

export function getHerbElementalBadge(elem: string): { label: string; icon: string; color: string; badgeClass: string } {
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
