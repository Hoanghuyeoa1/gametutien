// lib/manuals-shop-data.ts
// Danh mục chi tiết 36 Pho Công Pháp Bí Tịch Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { ManualShopItem, ManualCategory, ManualTier } from './types/manuals-shop';
import { MerchantItem } from './types/items';

export const MANUALS_SHOP_CATALOG: ManualShopItem[] = [
  // ==========================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0–10)
  // ==========================================
  {
    id: 'man_t1_atk',
    name: 'Thanh Phong Kiếm Pháp',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 150,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-zinc-700/60 text-zinc-300 bg-zinc-950/40',
    statModifiers: { atkPercent: 6 },
    description: 'Tâm đắc kiếm đạo sơ khởi, dẫn khí ngưng kiếm phong, tăng 6% Công Kích cơ bản vĩnh viễn.',
    flavorText: 'Thanh phong phất kiếm, phong tùy ý động, nhất kiếm định giang hồ sơ nhập đạo đồ.'
  },
  {
    id: 'man_t1_def',
    name: 'Huyền Quy Hộ Tâm Quyết',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 150,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-zinc-700/60 text-zinc-300 bg-zinc-950/40',
    statModifiers: { defPercent: 6 },
    description: 'Mô phỏng quy giáp của linh quy, ngưng tụ cương khí bảo vệ tâm mạch, tăng 6% Phòng Ngự vĩnh viễn.',
    flavorText: 'Thế như bàn thạch, động tĩnh tùy tâm, quy tức dưỡng thần định đan điền.'
  },
  {
    id: 'man_t1_spd',
    name: 'Thất Tinh Du Bộ',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 180,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-zinc-700/60 text-zinc-300 bg-zinc-950/40',
    statModifiers: { speedFlat: 5, dodgePercent: 3 },
    description: 'Bộ pháp mô phỏng quỹ đạo Bắc Đẩu Thất Tinh, gia tăng 5 Thân Pháp và 3% Né Tránh vĩnh viễn.',
    flavorText: 'Bộ lướt như tinh tú lấp lánh, hành tung thoắt ẩn thoắt hiện nơi sơn dã.'
  },
  {
    id: 'man_t1_forbidden',
    name: 'Toái Nhục Quyết',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 220,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-zinc-700/60 text-zinc-300 bg-zinc-950/40',
    statModifiers: { critRatePercent: 4 },
    description: 'Kình lực nhập tủy chấn toái gân cốt đối thủ, gia tăng vĩnh viễn 4% Tỷ Lệ Bạo Kích.',
    flavorText: 'Kình phá thấu cốt, chiêu thức hiểm hóc tìm chỗ yếu hại đoạn tuyệt sinh cơ.'
  },

  // ==========================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11–15)
  // ==========================================
  {
    id: 'man_t2_atk',
    name: 'Liệt Diễm Toái Sơn Đao',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 1800,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-700/60 text-emerald-300 bg-emerald-950/40',
    statModifiers: { atkPercent: 9, penetrationPercent: 3 },
    description: 'Hỏa linh đao ý chém nứt thạch nham, tăng 9% Công Kích và 3% Xuyên Giáp vĩnh viễn.',
    flavorText: 'Đao mang như liệt hỏa thôn phệ thảo mộc, một đao toái sơn trảm đoạn chướng ngại.'
  },
  {
    id: 'man_t2_def',
    name: 'Kim Cương Bất Hoại Thể',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 1800,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-700/60 text-emerald-300 bg-emerald-950/40',
    statModifiers: { defPercent: 9, maxHpPercent: 5 },
    description: 'Hóa khí thành màng kim cương hộ thể, tăng 9% Phòng Ngự và 5% Khí Huyết Tối Đa vĩnh viễn.',
    flavorText: 'Kim cang chi lực rèn đúc cơ nhục, đao thương khó tổn, thủy hỏa khó xâm lấn.'
  },
  {
    id: 'man_t2_spd',
    name: 'Đạp Tuyết Vô Ngân',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 2200,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-700/60 text-emerald-300 bg-emerald-950/40',
    statModifiers: { speedFlat: 10, dodgePercent: 5 },
    description: 'Thân pháp phiêu dật đạp trên tuyết không để lại dấu chân, tăng 10 Thân Pháp và 5% Né Tránh.',
    flavorText: 'Phiêu miểu tựa làn gió tuyết đầu mùa đông, hư vô vô ảnh lướt nhẹ ngọn cây.'
  },
  {
    id: 'man_t2_forbidden',
    name: 'Huyết Sát Ma Quyết',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 2800,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-700/60 text-emerald-300 bg-emerald-950/40',
    statModifiers: { critRatePercent: 6, lifestealPercent: 3 },
    description: 'Bí thuật ngưng tụ huyết sát chi khí kích phát sát tính, tăng 6% Bạo Kích và 3% Hút Khí Huyết.',
    flavorText: 'Dĩ huyết dưỡng đao, sát khí ngút trời, trảm địch hồi khí bảo dưỡng chân nguyên.'
  },

  // ==========================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16–20)
  // ==========================================
  {
    id: 'man_t3_atk',
    name: 'Huyền Thiên Kiếm Cương',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 15000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-blue-700/60 text-blue-300 bg-blue-950/40',
    statModifiers: { atkPercent: 12, penetrationPercent: 5 },
    description: 'Dẫn động thiên địa huyền khí đúc thành kiếm cương sắc bén, tăng 12% Công Kích và 5% Xuyên Giáp.',
    flavorText: 'Kiếm khí tung hoành ba vạn dặm, nhất kiếm quang hàn mười chín châu.'
  },
  {
    id: 'man_t3_def',
    name: 'Tử Phủ Hộ Thể Thuẫn',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 15000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-blue-700/60 text-blue-300 bg-blue-950/40',
    statModifiers: { defPercent: 12, damageReductionPercent: 4 },
    description: 'Tử Phủ chân khí hóa thành hộ thuẫn phòng hộ, tăng 12% Phòng Ngự và 4% Miễn Thương vĩnh viễn.',
    flavorText: 'Tử khí ngưng tụ đan đình, hóa hộ thuẫn bất phá che chắn mọi đòn công hiểm độc.'
  },
  {
    id: 'man_t3_spd',
    name: 'Lôi Đình Thiểm Ảnh Bộ',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 18000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-blue-700/60 text-blue-300 bg-blue-950/40',
    statModifiers: { speedFlat: 18, dodgePercent: 7 },
    description: 'Dung hợp lôi đình chi lực dưới gót chân, tăng 18 Thân Pháp và 7% Né Tránh vĩnh viễn.',
    flavorText: 'Lôi quang chớp giật, dậm chân lưu ảnh sấm chớp, thần tốc khó lòng nắm bắt.'
  },
  {
    id: 'man_t3_forbidden',
    name: 'U Hồn Đoạt Phách Điển',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 24000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-blue-700/60 text-blue-300 bg-blue-950/40',
    statModifiers: { critRatePercent: 8, critDmgPercent: 15 },
    description: 'Thần niệm đoạt phách làm suy yếu định lực đối thủ, tăng 8% Bạo Kích và 15% Sát Thương Bạo Kích.',
    flavorText: 'U hồn gào thét, đoạt phách nhiếp tâm, một kích bộc phát chấn nhiếp thức hải.'
  },

  // ==========================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21–25)
  // ==========================================
  {
    id: 'man_t4_atk',
    name: 'Cửu U Trảm Ma Kiếm Điển',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 100000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-700/60 text-purple-300 bg-purple-950/40',
    statModifiers: { atkPercent: 16, penetrationPercent: 8 },
    description: 'Kiếm ý Cửu U trảm tuyệt tà ma, tăng 16% Công Kích và 8% Xuyên Giáp vĩnh viễn.',
    flavorText: 'U minh kiếm khí xé toạc chân không, vạn ma cúi đầu trước kiếm ý chí tôn.'
  },
  {
    id: 'man_t4_def',
    name: 'Chân Vũ Huyền Giáp Kinh',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 100000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-700/60 text-purple-300 bg-purple-950/40',
    statModifiers: { defPercent: 16, damageReductionPercent: 6 },
    description: 'Chân Vũ đại đạo ngưng giáp thần bảo vệ bản nguyên, tăng 16% Phòng Ngự và 6% Miễn Thương.',
    flavorText: 'Chân Vũ giáp thần, ngự trị bắc phương huyền thiên, hộ trì chân thân bất diệt.'
  },
  {
    id: 'man_t4_spd',
    name: 'Huyễn Ảnh Di Hình Bộ',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 120000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-700/60 text-purple-300 bg-purple-950/40',
    statModifiers: { speedFlat: 28, dodgePercent: 9 },
    description: 'Di hình hoán vị lưu lại ngàn vạn huyễn ảnh, tăng 28 Thân Pháp và 9% Né Tránh vĩnh viễn.',
    flavorText: 'Thực thực hư hư, ảo ảnh đan xen giữa không gian, địch nhân hoa mắt khó phân biệt chân ngụy.'
  },
  {
    id: 'man_t4_forbidden',
    name: 'Cửu Chuyển Hóa Huyết Thuật',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 160000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-700/60 text-purple-300 bg-purple-950/40',
    statModifiers: { critRatePercent: 10, lifestealPercent: 5 },
    description: 'Hóa huyết cửu chuyển luyện tinh huyết thành sát khí, tăng 10% Bạo Kích và 5% Hút Máu.',
    flavorText: 'Máu nhuộm chiến bào, sát ý luyện huyết, mỗi đòn đánh là một lần hấp thu sinh lực đối phương.'
  },

  // ==========================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26–30)
  // ==========================================
  {
    id: 'man_t5_atk',
    name: 'Thái Hư Diệt Thần Đao Quyển',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 700000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-yellow-600/70 text-yellow-300 bg-yellow-950/40',
    statModifiers: { atkPercent: 20, penetrationPercent: 12 },
    description: 'Thái Hư đao ý trảm diệt thần niệm, tăng 20% Công Kích và 12% Xuyên Giáp vĩnh viễn.',
    flavorText: 'Đao mang trảm toái hư không, hư ảnh Hóa Thần xuất kích uy áp chấn động thiên địa.'
  },
  {
    id: 'man_t5_def',
    name: 'Ngũ Hành Hỗn Nguyên Cương Giáp',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 700000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-yellow-600/70 text-yellow-300 bg-yellow-950/40',
    statModifiers: { defPercent: 20, damageReductionPercent: 8 },
    description: 'Ngũ Hành tương sinh tương khắc luyện thành hỗn nguyên cương giáp, tăng 20% Phòng Ngự và 8% Miễn Thương.',
    flavorText: 'Kim Mộc Thủy Hỏa Thổ luân chuyển bất tận, hóa giải muôn vàn sát chiêu ngoại giới.'
  },
  {
    id: 'man_t5_spd',
    name: 'Súc Địa Thành Thốn Diệu Pháp',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 850000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-yellow-600/70 text-yellow-300 bg-yellow-950/40',
    statModifiers: { speedFlat: 40, dodgePercent: 12 },
    description: 'Co rút không gian vạn dặm thành tấc tất, tăng 40 Thân Pháp và 12% Né Tránh vĩnh viễn.',
    flavorText: 'Bước chân dẫm lên quy tắc không gian, một bước qua núi non trùng điệp thoắt ẩn thoắt hiện.'
  },
  {
    id: 'man_t5_forbidden',
    name: 'Thiên Ma Nhiễu Hồn Cấm Điển',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 1100000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-yellow-600/70 text-yellow-300 bg-yellow-950/40',
    statModifiers: { critRatePercent: 12, critDmgPercent: 25 },
    description: 'Thiên Ma cổ âm nhiễu loạn thần phách đối thủ, tăng 12% Bạo Kích và 25% Sát Thương Bạo Kích.',
    flavorText: 'Ma âm văng vẳng bên tai, dẫn động tâm ma đối thủ, kích phát đòn bạo thương hủy thiên diệt địa.'
  },

  // ==========================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31–35)
  // ==========================================
  {
    id: 'man_t6_atk',
    name: 'Luyện Hư Vạn Kiếm Quy Tông',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 4500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-700/60 text-red-300 bg-red-950/40',
    statModifiers: { atkPercent: 25, penetrationPercent: 15 },
    description: 'Vạn đạo kiếm khí hợp nhất thành hư vô quy tông, tăng 25% Công Kích và 15% Xuyên Giáp vĩnh viễn.',
    flavorText: 'Luyện hư nhập đạo, vạn kiếm triều tông, hư ảnh vạn đạo kiếm quang xé rách hư không vô tận.'
  },
  {
    id: 'man_t6_def',
    name: 'Hư Không Phá Toái Trận Thuẫn',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 4500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-700/60 text-red-300 bg-red-950/40',
    statModifiers: { defPercent: 25, damageReductionPercent: 10 },
    description: 'Dẫn hư không bích chướng che chắn chân thân, tăng 25% Phòng Ngự và 10% Miễn Thương vĩnh viễn.',
    flavorText: 'Hư không bích chướng vặn vẹo không gian, chuyển dịch sát thương đối phương vào khoảng không vô tận.'
  },
  {
    id: 'man_t6_spd',
    name: 'Bát Hoang Du Long Thần Bộ',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 5500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-700/60 text-red-300 bg-red-950/40',
    statModifiers: { speedFlat: 55, dodgePercent: 15 },
    description: 'Du long thần hình uốn lượn xuyên qua bát hoang vũ trụ, tăng 55 Thân Pháp và 15% Né Tránh.',
    flavorText: 'Chân Long uốn lượn chín tầng mây, ngạo thị bát hoang không ai có thể đuổi kịp tàn ảnh.'
  },
  {
    id: 'man_t6_forbidden',
    name: 'Thôn Hồn Hoán Cốt Ma Điển',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 6800000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-red-700/60 text-red-300 bg-red-950/40',
    statModifiers: { critRatePercent: 15, lifestealPercent: 7 },
    description: 'Thôn phệ thần hồn hoán cải đạo cốt, tăng 15% Bạo Kích và 7% Hút Máu vĩnh viễn.',
    flavorText: 'Luyện cốt hóa ma, thôn phệ nguyên thần đối thủ bù đắp sinh cơ của bản thân.'
  },

  // ==========================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36–40)
  // ==========================================
  {
    id: 'man_t7_atk',
    name: 'Bát Hoang Tru Tiên Đao Phách',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 28000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-orange-600/70 text-orange-300 bg-orange-950/40',
    statModifiers: { atkPercent: 30, penetrationPercent: 20 },
    description: 'Đao phách Tru Tiên xé rách thương khung bát hoang, tăng 30% Công Kích và 20% Xuyên Giáp vĩnh viễn.',
    flavorText: 'Hợp thể quy nhất, đao phách tung hoành cửu thiên thập địa, thần tiên cũng phải e dè.'
  },
  {
    id: 'man_t7_def',
    name: 'Thái Cực Vô Cực Hộ Thể Kim Thân',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 28000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-orange-600/70 text-orange-300 bg-orange-950/40',
    statModifiers: { defPercent: 30, damageReductionPercent: 14 },
    description: 'Thái Cực Vô Cực hóa thành kim thân bất hoại, tăng 30% Phòng Ngự và 14% Miễn Thương vĩnh viễn.',
    flavorText: 'Âm Dương quy nguyên, Thái Cực hộ thể, vạn kiếp bất ma, kim thân bất diệt.'
  },
  {
    id: 'man_t7_spd',
    name: 'Đạp Toái Hư Không Bộ',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 35000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-orange-600/70 text-orange-300 bg-orange-950/40',
    statModifiers: { speedFlat: 75, dodgePercent: 18 },
    description: 'Dẫm nát không gian bẻ cong chiều không thời gian, tăng 75 Thân Pháp và 18% Né Tránh vĩnh viễn.',
    flavorText: 'Mỗi bước chân đạp vỡ không gian, nháy mắt xuyên qua tinh hà mênh mông vô tận.'
  },
  {
    id: 'man_t7_forbidden',
    name: 'Thôn Thiên Phệ Địa Cấm Pháp',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 42000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-orange-600/70 text-orange-300 bg-orange-950/40',
    statModifiers: { critRatePercent: 18, critDmgPercent: 40 },
    description: 'Nuốt chửng linh khí trời đất hóa thành đòn bạo kích kinh hoàng, tăng 18% Bạo Kích và 40% Bạo Thương.',
    flavorText: 'Thôn thiên thực địa, ma khí che lấp nhật nguyệt, bạo kích tuyệt diệt hủy hoại vạn vật.'
  },

  // ==========================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41–45)
  // ==========================================
  {
    id: 'man_t8_atk',
    name: 'Vạn Cổ Diệt Thế Thần Lôi Quyết',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 180000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-amber-400/80 text-amber-200 bg-zinc-950/70 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
    statModifiers: { atkPercent: 38, penetrationPercent: 25 },
    description: 'Triệu hồi Hắc Sắc Diệt Thế Thần Lôi thời thái cổ, tăng 38% Công Kích và 25% Xuyên Giáp vĩnh viễn.',
    flavorText: 'Thần lôi diệt thế giáng thế từ thượng cổ hỗn độn, oanh tạc diệt sát vạn linh trong chớp mắt.'
  },
  {
    id: 'man_t8_def',
    name: 'Bất Hủ Thánh Thể Thần Cương',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 180000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-amber-400/80 text-amber-200 bg-zinc-950/70 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
    statModifiers: { defPercent: 38, damageReductionPercent: 18 },
    description: 'Thánh thể bất hủ đúc thành thần cương chí tôn, tăng 38% Phòng Ngự và 18% Miễn Thương vĩnh viễn.',
    flavorText: 'Thánh quang rực rỡ nghìn trượng, vạn kiếp luân hồi cũng không thể làm tổn hao một tấc da thịt.'
  },
  {
    id: 'man_t8_spd',
    name: 'Càn Khôn Na Di Đại Pháp',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 220000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-amber-400/80 text-amber-200 bg-zinc-950/70 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
    statModifiers: { speedFlat: 100, dodgePercent: 22 },
    description: 'Chuyển dời Càn Khôn nghịch chuyển không thời gian, tăng 100 Thân Pháp và 22% Né Tránh vĩnh viễn.',
    flavorText: 'Càn khôn đảo lộn, di hình hoán ảnh tức thời, địch nhân chưa kịp động thủ đã thấy kiếm kề cổ.'
  },
  {
    id: 'man_t8_forbidden',
    name: 'Thái Sơ Luân Hồi Nhãn',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 280000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-amber-400/80 text-amber-200 bg-zinc-950/70 shadow-[0_0_12px_rgba(251,191,36,0.3)]',
    statModifiers: { critRatePercent: 22, lifestealPercent: 10, critDmgPercent: 50 },
    description: 'Khai mở thần nhãn Luân Hồi thu nạp sinh tử vạn vật, tăng 22% Bạo Kích, 10% Hút Máu và 50% Bạo Thương.',
    flavorText: 'Nhất nhãn sinh, nhất nhãn tử, nhìn thấu điểm yếu của toàn bộ sinh linh thiên địa.'
  },

  // ==========================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // ==========================================
  {
    id: 'man_t9_atk',
    name: 'Hỗn Độn Khai Thiên Nhất Kiếm',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'cong_kich',
    categoryName: 'Công Kích',
    price: 1200000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-rose-500 text-rose-200 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    statModifiers: { atkPercent: 50, penetrationPercent: 35 },
    description: 'Tuyệt kỹ khai thiên tích địa thời sơ khai hỗn độn, tăng 50% Công Kích và 35% Xuyên Giáp vĩnh viễn.',
    flavorText: 'Hỗn Độn sơ khai, nhất kiếm trảm rách thiên địa hồng hoang, khai mở tân kỷ nguyên chư thiên.'
  },
  {
    id: 'man_t9_def',
    name: 'Cửu Cực Tiên Thiên Hộ Cương',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'phong_ngu',
    categoryName: 'Hộ Thể',
    price: 1200000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-rose-500 text-rose-200 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    statModifiers: { defPercent: 50, damageReductionPercent: 25 },
    description: 'Cương khí cửu cực hộ thể che chở toàn diện, tăng 50% Phòng Ngự và 25% Miễn Thương Toàn Cục.',
    flavorText: 'Cửu cực quy chân, hộ thể cương khí vô thượng ngăn trở thiên lôi kiếp nạn, bất tử bất diệt.'
  },
  {
    id: 'man_t9_spd',
    name: 'Thái Hư Hư Không Thần Hành',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'than_phap',
    categoryName: 'Thân Pháp',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-rose-500 text-rose-200 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    statModifiers: { speedFlat: 150, dodgePercent: 30 },
    description: 'Hóa thân vào hư không thần hành vượt qua mọi quy luật vật lý, tăng 150 Thân Pháp và 30% Né Tránh.',
    flavorText: 'Siêu việt thời không, một ý niệm du ngoạn vạn giới, vô thanh vô ảnh không gì có thể ngăn trở.'
  },
  {
    id: 'man_t9_forbidden',
    name: 'Vạn Giới Quy Nhất Vô Thượng Thần Thông',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'cam_thuat',
    categoryName: 'Cấm Thuật',
    price: 2200000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-rose-500 text-rose-200 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    statModifiers: { critRatePercent: 30, critDmgPercent: 80, lifestealPercent: 15 },
    description: 'Hợp nhất toàn bộ quy tắc vạn giới, tăng 30% Bạo Kích, 80% Bạo Thương và 15% Hút Máu vĩnh viễn.',
    flavorText: 'Vạn giới quy nhất, nhất niệm hóa thần, xuất chiêu trời nghiêng đất lở, đoạn tuyệt vạn cổ luân hồi.'
  }
];

export const MANUALS_SHOP_ITEMS_MAP: Record<string, ManualShopItem> = MANUALS_SHOP_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, ManualShopItem>
);

export function getManualCategoryBadge(cat: ManualCategory | string): {
  label: string;
  icon: string;
  badgeClass: string;
} {
  switch (cat) {
    case 'cong_kich':
      return {
        label: 'Công Kích',
        icon: '⚔️',
        badgeClass: 'bg-red-950/80 text-red-300 border-red-700/60'
      };
    case 'phong_ngu':
      return {
        label: 'Hộ Thể',
        icon: '🛡️',
        badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-700/60'
      };
    case 'than_phap':
      return {
        label: 'Thân Pháp',
        icon: '💨',
        badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
      };
    case 'cam_thuat':
      return {
        label: 'Cấm Thuật',
        icon: '🩸',
        badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700/60'
      };
    default:
      return {
        label: 'Bí Điển',
        icon: '📜',
        badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-700/60'
      };
  }
}

export function manualShopItemToMerchantItem(item: ManualShopItem): MerchantItem {
  return {
    id: item.id,
    name: item.name,
    category: 'manuals',
    itemType: 'manual',
    type: 'manual',
    manualSlot: item.category === 'than_phap' ? 'than_phap' : 'tam_phap',
    price: item.price,
    costLinhThach: item.price,
    stock: 1,
    maxStock: 1,
    oneTimeOnly: true,
    tier: item.tier,
    tierName: item.tierName,
    requiredRealmIndex: item.requiredRealmIndex,
    requiredRealmName: item.requiredRealmName,
    description: item.description,
    manualStatModifiers: item.statModifiers,
    manualCategory: item.category,
    data: {
      ...item,
      flavorText: item.flavorText,
      statModifiers: item.statModifiers,
      category: item.category,
      categoryName: item.categoryName
    }
  };
}

export const TIER_MANUALS_MERCHANT_ITEMS: MerchantItem[] = MANUALS_SHOP_CATALOG.map(manualShopItemToMerchantItem);
