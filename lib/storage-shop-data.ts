// lib/storage-shop-data.ts
// Kho dữ liệu 36 Pháp Bảo Trữ Vật Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { StorageShopItem, StorageCategory, StorageShopTier } from './types/storage-shop';
import { MerchantItem } from './types/items';

export const STORAGE_SHOP_CATALOG: StorageShopItem[] = [
  // =========================================================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0-10)
  // =========================================================================
  {
    id: 'stor_t1_uni',
    name: 'Sơ Cấp Túi Trữ Vật',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Túi vải gai thêu phù văn ngưng khí sơ cấp, đan điền trữ vật cơ bản của đệ tử Luyện Khí.',
    flavorText: 'Túi thô dệt chỉ gai, một tấc nạp mười thước không gian.',
    price: 200,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-slate-500/60 text-slate-300 bg-slate-900/60',
    avatarGradient: 'from-slate-700/80 via-zinc-800 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 10
    },
    specialPerkName: 'Ngưng Khí Khai Mạc',
    specialPerkDesc: 'Mở rộng 10 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t1_herb',
    name: 'Bách Thảo Nang',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Túi da hươu ướp hương uẩn linh, giữ gìn dược tính sơ giai không bị bay hơi.',
    flavorText: 'Hương cỏ đọng ngàn sương, thảo mộc uẩn nguyên khí.',
    price: 250,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-700/80 via-teal-800 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 15
    },
    specialPerkName: 'Dược Tính Ôn Nhuận',
    specialPerkDesc: 'Khai mở thêm 15 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t1_ore',
    name: 'Thiết Bì Quáng Đại',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Túi da trâu bọc sắt chịu tải nặng, chịu lực ma sát và chấn động từ các khối quặng thô.',
    flavorText: 'Thiết cốt da trâu bền, chở nặng dặm trường an nhiên.',
    price: 250,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-700/80 via-yellow-900 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 15
    },
    specialPerkName: 'Thần Thiết Bì Bọc',
    specialPerkDesc: 'Khai mở thêm 15 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t1_dim',
    name: 'Càn Khôn Mộc Hạp',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Hộp gỗ đào ngưng tụ thứ nguyên sơ khai, kết nối một góc vi mô với linh khí Động Phủ.',
    flavorText: 'Đào mộc trăm năm đọng linh văn, hư không sinh tự vi trần.',
    price: 350,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-700/80 via-sky-800 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 5,
      abodeStorageFlat: 10
    },
    specialPerkName: 'Mộc Linh Tụ Khí',
    specialPerkDesc: 'Tăng 5 ô túi chung và mở rộng thêm 10 ô kho Động Thiên Phúc Địa.'
  },

  // =========================================================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11-15)
  // =========================================================================
  {
    id: 'stor_t2_uni',
    name: 'Bách Luyện Trữ Vật Giới',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Nhẫn sắt tinh luyện trăm lần khắc trận pháp Càn Khôn dung nạp đan điền Trúc Cơ.',
    flavorText: 'Bách luyện hóa tinh kim, một vòng ôm trọn vạn vật.',
    price: 2500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-blue-500/60 text-blue-300 bg-blue-950/60',
    avatarGradient: 'from-blue-700/80 via-indigo-800 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 25
    },
    specialPerkName: 'Trúc Cơ Càn Khôn',
    specialPerkDesc: 'Mở rộng thêm 25 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t2_herb',
    name: 'Uẩn Linh Thảo Hạp',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Hộp ngọc xanh thanh tẩy bảo quản dược lực tươi mới như vừa thu hoạch ngoài linh điền.',
    flavorText: 'Thanh ngọc uẩn dược tính, ngàn năm sắc cỏ không phai.',
    price: 3000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-600/80 via-teal-700 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 35
    },
    specialPerkName: 'Uẩn Linh Bất Hủ',
    specialPerkDesc: 'Khai mở thêm 35 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t2_ore',
    name: 'Huyền Thiết Thôn Kim Nang',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Túi huyền thiết co giãn theo ý niệm, hấp thu kim khí giúp tu sĩ mang vác nhẹ như lông hồng.',
    flavorText: 'Huyền thiết thôn kim ngọc, vạn cân hóa khói mây.',
    price: 3000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-600/80 via-orange-800 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 35
    },
    specialPerkName: 'Huyền Thiết Giảm Trọng',
    specialPerkDesc: 'Khai mở thêm 35 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t2_dim',
    name: 'Thanh Lăng Càn Khôn Trạc',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Vòng tay ngọc bích mở rộng khí hải, tạo liên kết không gian vĩnh cửu với tàng bảo các động phủ.',
    flavorText: 'Ngọc bích ánh thanh vân, mở đường nối thiên giới.',
    price: 4500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-600/80 via-blue-700 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 15,
      abodeStorageFlat: 25
    },
    specialPerkName: 'Thanh Lăng Khí Hải',
    specialPerkDesc: 'Tăng 15 ô túi chung và mở rộng 25 ô kho Động Thiên Phúc Địa.'
  },

  // =========================================================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16-20)
  // =========================================================================
  {
    id: 'stor_t3_uni',
    name: 'Tử Phủ Càn Khôn Giới',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Nhẫn đồng tím dung nạp linh khí Kim Đan, tạo thành một khoang không gian vững như thành đồng.',
    flavorText: 'Tử khí đông lai uẩn kim đan, càn khôn rộng mở mấy trùng thiên.',
    price: 22000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-purple-500/60 text-purple-300 bg-purple-950/60',
    avatarGradient: 'from-purple-700/80 via-indigo-800 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 50
    },
    specialPerkName: 'Tử Phủ Dung Khí',
    specialPerkDesc: 'Mở rộng thêm 50 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t3_herb',
    name: 'Vạn Dược Quy Linh Hạp',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Tráp ngọc tím nuôi dưỡng linh dược ngàn năm, tỏa hương sen ngát xoa dịu tâm ma thảo dược.',
    flavorText: 'Tráp tím chứa vạn dược, linh căn tụ một phương.',
    price: 26000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-600/80 via-purple-700 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 70
    },
    specialPerkName: 'Quy Linh Dưỡng Căn',
    specialPerkDesc: 'Khai mở thêm 70 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t3_ore',
    name: 'Địa Tâm Kim Cương Nang',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Túi dệt từ sợi kim cương dung nham ngầm dưới lòng đất sâu, chịu được nhiệt độ của khoáng thạch dung nham.',
    flavorText: 'Địa tâm rực lửa đỏ, kim cương bất hoại dệt thành túi.',
    price: 26000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-600/80 via-rose-800 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 70
    },
    specialPerkName: 'Dung Nham Kim Cương',
    specialPerkDesc: 'Khai mở thêm 70 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t3_dim',
    name: 'Ngũ Hành Tụ Bảo Giới',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Nhẫn ngũ sắc xoay vần theo chu thiên, tự động phân tách ngũ hành tài nguyên và nới rộng kho báu.',
    flavorText: 'Ngũ sắc quang hoa xoay bất tận, thiên tài địa bảo tụ về tâm.',
    price: 38000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-600/80 via-violet-700 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 30,
      abodeStorageFlat: 60
    },
    specialPerkName: 'Ngũ Hành Tự Động Phân Loại',
    specialPerkDesc: 'Tăng 30 ô túi chung và mở rộng thêm 60 ô kho Động Thiên Phúc Địa.'
  },

  // =========================================================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21-25)
  // =========================================================================
  {
    id: 'stor_t4_uni',
    name: 'Cửu U Hư Không Đại',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Túi da dị thú Cửu U uốn cong không gian xung quanh, chứa đựng cả một góc sơn hà.',
    flavorText: 'Cửu U vực thẳm sâu, hư không vô ngằn bến.',
    price: 180000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-yellow-500/60 text-yellow-300 bg-yellow-950/60',
    avatarGradient: 'from-yellow-700/80 via-amber-800 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 100
    },
    specialPerkName: 'Cửu U Hư Giới',
    specialPerkDesc: 'Mở rộng thêm 100 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t4_herb',
    name: 'Thanh Liên Dưỡng Dược Giới',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Giới chỉ hoa sen ngọc xanh thanh khiết, ngưng tụ sương sớm bách thảo bồi bổ dược tính.',
    flavorText: 'Bạch liên ngọc trong suốt, vạn dược hóa linh đan.',
    price: 220000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-500/80 via-teal-600 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 140
    },
    specialPerkName: 'Thanh Liên Uẩn Tuyền',
    specialPerkDesc: 'Khai mở thêm 140 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t4_ore',
    name: 'Trầm Hương Thôn Quáng Hạp',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Tráp gỗ hóa thạch vạn năm ngậm vạn cân thiết khoáng, tỏa hương tĩnh tâm bài trừ độc khí khoáng.',
    flavorText: 'Trầm hương ngàn năm hóa thạch cốt, thôn tính sơn hà vạn khối kim.',
    price: 220000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-600/80 via-orange-700 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 140
    },
    specialPerkName: 'Trầm Hương Hóa Thạch',
    specialPerkDesc: 'Khai mở thêm 140 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t4_dim',
    name: 'Bát Quái Càn Khôn Bàn',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'La bàn thứ nguyên bát quái kết nối hư không, bảo lưu ấn ký chân nguyên khi tiến vào luân hồi.',
    flavorText: 'Bát quái vận chuyển càn khôn biến, luân hồi muôn kiếp dấu ấn lưu.',
    price: 300000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-500/80 via-blue-600 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 60,
      abodeStorageFlat: 150,
      retainSlotsOnRebirth: 2
    },
    specialPerkName: 'Hư Không Định Vị',
    specialPerkDesc: 'Tăng 60 ô túi chung, +150 ô kho Động Phủ và bảo toàn 2 ô trang bị/vật phẩm khi Luân Hồi.'
  },

  // =========================================================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26-30)
  // =========================================================================
  {
    id: 'stor_t5_uni',
    name: 'Thái Hư Trữ Vật Giới',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Nhẫn đen hư vô nuốt trọn sơn hà, dung chứa vạn vật mà không gợn một tia dao động không gian.',
    flavorText: 'Thái hư vô cực, bao la vạn dặm giữa lòng tay.',
    price: 1200000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-red-500/60 text-red-300 bg-red-950/60',
    avatarGradient: 'from-red-600/80 via-rose-700 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 200
    },
    specialPerkName: 'Thái Hư Thôn Thiên',
    specialPerkDesc: 'Mở rộng thêm 200 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t5_herb',
    name: 'Dược Thần Tụ Bảo Nang',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Túi gấm tiên thiên không làm hao hụt nửa phần dược tính, dược thảo lưu lại tự động sinh trưởng tinh hoa.',
    flavorText: 'Dược thần lưu tích thế gian hiếm, trăm thảo quy tông hóa tiên đan.',
    price: 1500000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-500/80 via-green-600 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 280
    },
    specialPerkName: 'Dược Thần Ôn Dưỡng',
    specialPerkDesc: 'Khai mở thêm 280 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t5_ore',
    name: 'Bích Lạc Kim Cương Giới',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Nhẫn ngọc bích chứa trọn mỏ quặng ngàn trượng, nén khoáng thạch thành thể tích vi phân.',
    flavorText: 'Bích lạc thanh thiên hoàng tuyền đạo, kim cương thu tóm vạn khối quặng.',
    price: 1500000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-500/80 via-yellow-600 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 280
    },
    specialPerkName: 'Bích Lạc Lực Trường',
    specialPerkDesc: 'Khai mở thêm 280 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t5_dim',
    name: 'Tu Di Thần Sơn Trạc',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Vòng tay phong ấn một ngọn Tu Di Sơn cổ xưa, khai sinh một vùng tiểu thế giới độc lập.',
    flavorText: 'Tu di một hạt bụi, thần sơn trấn bát hoang.',
    price: 2200000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-500/80 via-indigo-600 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 120,
      abodeStorageFlat: 350,
      retainSlotsOnRebirth: 4
    },
    specialPerkName: 'Tu Di Chấn Nhạc',
    specialPerkDesc: 'Tăng 120 ô túi chung, +350 ô kho Động Phủ và bảo toàn 4 ô trang bị/vật phẩm khi Luân Hồi.'
  },

  // =========================================================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31-35)
  // =========================================================================
  {
    id: 'stor_t6_uni',
    name: 'Quy Chân Hư Không Giới',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Không gian phản phác quy chân vô cùng vô tận, hòa nhập trực tiếp vào hư không thiên địa.',
    flavorText: 'Quy chân phản phác, hư không nạp vạn hà.',
    price: 8000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-pink-500/60 text-pink-300 bg-pink-950/60',
    avatarGradient: 'from-pink-600/80 via-rose-700 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 400
    },
    specialPerkName: 'Quy Chân Vô Ngăn',
    specialPerkDesc: 'Mở rộng thêm 400 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t6_herb',
    name: 'Tiên Thảo Dưỡng Linh Giới',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Thế giới cỏ cây tự động tưới tắm linh tuyền, dược thảo cất giữ ngàn năm tự biến thành tiên thảo.',
    flavorText: 'Tiên thảo rợp bóng thanh u, linh tuyền tưới đẫm thiên thu rạng ngời.',
    price: 10000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-400/80 via-teal-500 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 550
    },
    specialPerkName: 'Linh Tuyền Tư Dưỡng',
    specialPerkDesc: 'Khai mở thêm 550 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t6_ore',
    name: 'Hư Không Vạn Thạch Hạp',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Tráp không gian nén vạn khối thần thiết, ngưng tụ sát khí kim tinh thành kết tinh hộ thể.',
    flavorText: 'Vạn thạch tụ hư không, thần thiết đúc đạo cốt.',
    price: 10000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-400/80 via-yellow-500 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 550
    },
    specialPerkName: 'Vạn Thạch Kim Tinh',
    specialPerkDesc: 'Khai mở thêm 550 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t6_dim',
    name: 'Lục Hợp Càn Khôn Kính',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Gương thần chiếu rọi lục hợp bát hoang, liên thông mọi ngóc ngách thứ nguyên giữa trần thế.',
    flavorText: 'Gương sáng soi lục hợp, hư không thu tóm trong gang tấc.',
    price: 14000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-400/80 via-sky-500 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 250,
      abodeStorageFlat: 800,
      retainSlotsOnRebirth: 6
    },
    specialPerkName: 'Lục Hợp Chiếu Diệu',
    specialPerkDesc: 'Tăng 250 ô túi chung, +800 ô kho Động Phủ và bảo toàn 6 ô trang bị/vật phẩm khi Luân Hồi.'
  },

  // =========================================================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36-40)
  // =========================================================================
  {
    id: 'stor_t7_uni',
    name: 'Bát Hoang Tu Di Giới',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Pháp bảo dung nạp Bát Hoang thần vực, mở rộng túi đồ thành một đại lục mênh mông.',
    flavorText: 'Bát Hoang thần thổ rộng vô cương, vạn dặm càn khôn một ý niệm.',
    price: 45000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-orange-500/60 text-orange-300 bg-orange-950/60',
    avatarGradient: 'from-orange-500/80 via-amber-600 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 800
    },
    specialPerkName: 'Bát Hoang Thần Thổ',
    specialPerkDesc: 'Mở rộng thêm 800 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t7_herb',
    name: 'Niết Bàn Thần Dược Giới',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Vùng đất lửa Niết Bàn ươm mầm dược thảo vạn năm, bảo tồn dược tính ở đỉnh cao tuyệt đối.',
    flavorText: 'Niết Bàn bất tử hỏa, thần dược tỏa hào quang.',
    price: 55000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-400/80 via-rose-500 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 1100
    },
    specialPerkName: 'Niết Bàn Bất Hủ Dược',
    specialPerkDesc: 'Khai mở thêm 1,100 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t7_ore',
    name: 'Thái Cực Kim Cương Thế Giới',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Không gian tiểu thế giới chứa toàn bộ mỏ Tinh Mạch, tự động tôi luyện khoáng thạch.',
    flavorText: 'Thái cực phân âm dương, kim cương uẩn tinh mạch.',
    price: 55000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-400/80 via-yellow-500 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 1100
    },
    specialPerkName: 'Thái Cực Tinh Mạch',
    specialPerkDesc: 'Khai mở thêm 1,100 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t7_dim',
    name: 'Thất Tinh Tụ Bảo Châu',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Hạt châu bảy vì sao hội tụ thiên tài địa bảo khắp tinh hà, lưu chuyển ánh sáng thứ nguyên.',
    flavorText: 'Thất tinh quy tụ chiếu tinh hà, châu ngọc tràn trề cõi thái hư.',
    price: 75000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-400/80 via-indigo-500 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 500,
      abodeStorageFlat: 1800,
      retainSlotsOnRebirth: 10
    },
    specialPerkName: 'Thất Tinh Tụ Linh',
    specialPerkDesc: 'Tăng 500 ô túi chung, +1,800 ô kho Động Phủ và bảo toàn 10 ô trang bị/vật phẩm khi Luân Hồi.'
  },

  // =========================================================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41-45)
  // =========================================================================
  {
    id: 'stor_t8_uni',
    name: 'Vạn Cổ Hỗn Nguyên Giới',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Nhẫn thánh Đại Thừa thai nghén khí hỗn nguyên sơ khai, nén không gian vạn dặm thành vô hình.',
    flavorText: 'Vạn cổ ngưng hỗn nguyên, thiên đạo ngự trong lòng bàn tay.',
    price: 220000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-400/80 via-teal-500 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 1600
    },
    specialPerkName: 'Hỗn Nguyên Vô Cực Giới',
    specialPerkDesc: 'Mở rộng thêm 1,600 ô túi đồ chung vĩnh viễn.'
  },
  {
    id: 'stor_t8_herb',
    name: 'Bổ Thiên Thần Nông Đỉnh',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Đỉnh Thần Nông chứa trọn vẹn dược hải tam giới, linh thảo lưu giữ vạn năm sinh ra linh tính.',
    flavorText: 'Bổ thiên thần nông luyện dược hải, vạn kiếp thanh linh chẳng biến phai.',
    price: 280000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-300/80 via-green-500 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 2200
    },
    specialPerkName: 'Thần Nông Dược Hải',
    specialPerkDesc: 'Khai mở thêm 2,200 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t8_ore',
    name: 'Thái Sơ Khai Sơn Nang',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Túi thần Thái Sơ mang sức chứa vạn tòa Thái Sơn, thu tóm toàn bộ khoáng mạch tam thiên thế giới.',
    flavorText: 'Thái sơ khai thiên tịch địa, vạn tòa thái sơn nạp một nang.',
    price: 280000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-300/80 via-yellow-500 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 2200
    },
    specialPerkName: 'Thái Sơ Khai Sơn Lực',
    specialPerkDesc: 'Khai mở thêm 2,200 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t8_dim',
    name: 'Hồng Mông Vạn Tượng Hạp',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Tráp Hồng Mông mở ra một cõi trời đất riêng biệt, bảo toàn hầu hết tài nguyên quan trọng qua các kiếp luân hồi.',
    flavorText: 'Hồng mông sinh vạn tượng, nhật nguyệt định càn khôn.',
    price: 380000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-300/80 via-purple-500 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 1000,
      abodeStorageFlat: 4000,
      retainSlotsOnRebirth: 16
    },
    specialPerkName: 'Hồng Mông Khai Thiên',
    specialPerkDesc: 'Tăng 1,000 ô túi chung, +4,000 ô kho Động Phủ và bảo toàn 16 ô trang bị/vật phẩm khi Luân Hồi.'
  },

  // =========================================================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // =========================================================================
  {
    id: 'stor_t9_uni',
    name: 'Hỗn Độn Sáng Thế Giới',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'universal',
    categoryName: 'Càn Khôn Chung',
    description: 'Nhẫn Hỗn Độn mở ra một Đại Thiên Thế Giới hoàn chỉnh, không gian vô biên vô hạn, nạp cả vũ trụ tinh cầu.',
    flavorText: 'Hỗn độn sơ khai sáng thế giới, một niệm bao hàm vạn cõi trời.',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-rose-500/60 text-rose-300 bg-rose-950/60',
    avatarGradient: 'from-rose-500/80 via-pink-600 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 3500
    },
    specialPerkName: 'Đại Thiên Thế Giới (Vô Hạn)',
    specialPerkDesc: 'Mở rộng thêm 3,500 ô túi đồ chung vĩnh viễn (gần như vô hạn).'
  },
  {
    id: 'stor_t9_herb',
    name: 'Tiên Thiên Dược Hải Thần Châu',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'herb_vault',
    categoryName: 'Dược Hạp',
    description: 'Biển dược vô cương, hạt châu uẩn tàng khí Tiên Thiên ngưng tụ dược thảo khắp chư thiên vạn giới.',
    flavorText: 'Tiên thiên linh châu bao la dược hải, vĩnh viễn không vơi cạn.',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-emerald-500/60 text-emerald-300 bg-emerald-950/60',
    avatarGradient: 'from-emerald-300/80 via-teal-400 to-slate-950',
    spatialCapacityBonus: {
      herbSlotsFlat: 5000
    },
    specialPerkName: 'Vạn Cổ Dược Hải',
    specialPerkDesc: 'Khai mở thêm 5,000 ô chuyên dụng lưu trữ Dược Thảo.'
  },
  {
    id: 'stor_t9_ore',
    name: 'Vạn Giới Kim Cương Khôi Nang',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'ore_vault',
    categoryName: 'Quáng Đại',
    description: 'Kho chứa quặng xuyên không gian vạn giới, hấp thu mọi nguyên tố kim thiết trong hư không vũ trụ.',
    flavorText: 'Vạn giới kim tinh gom về một, khôi giáp thần thạch chất đầy hư không.',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-amber-500/60 text-amber-300 bg-amber-950/60',
    avatarGradient: 'from-amber-300/80 via-orange-400 to-slate-950',
    spatialCapacityBonus: {
      oreSlotsFlat: 5000
    },
    specialPerkName: 'Vạn Giới Khoáng Kho',
    specialPerkDesc: 'Khai mở thêm 5,000 ô chuyên dụng lưu trữ Khoáng Thạch.'
  },
  {
    id: 'stor_t9_dim',
    name: 'Khai Thiên Tức Nhưỡng Càn Khôn Đỉnh',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'dimension',
    categoryName: 'Tu Di Dị Bảo',
    description: 'Chí bảo đỉnh cao chứa Tức Nhưỡng khai thiên, diễn sinh sinh linh và thế giới, bảo toàn toàn bộ trang bị khi luân hồi!',
    flavorText: 'Khai thiên tức nhưỡng tạo càn khôn, vạn kiếp luân hồi đạo bất diệt!',
    price: 2800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-cyan-500/60 text-cyan-300 bg-cyan-950/60',
    avatarGradient: 'from-cyan-300/80 via-violet-400 to-slate-950',
    spatialCapacityBonus: {
      generalSlotsFlat: 2500,
      abodeStorageFlat: 10000,
      retainSlotsOnRebirth: 99
    },
    specialPerkName: 'Khai Thiên Tức Nhưỡng Diễn Thế',
    specialPerkDesc: 'Tăng 2,500 ô túi chung, +10,000 ô kho Động Phủ và bảo toàn TOÀN BỘ trang bị khi Luân Hồi!'
  }
];

export const STORAGE_SHOP_ITEMS_MAP: Record<string, StorageShopItem> = Object.fromEntries(
  STORAGE_SHOP_CATALOG.map(item => [item.id, item])
);

export function getStorageCategoryBadge(category: StorageCategory) {
  switch (category) {
    case 'universal':
      return {
        label: 'Càn Khôn Chung',
        icon: '🌌',
        color: 'text-indigo-400',
        bg: 'bg-indigo-950/60',
        border: 'border-indigo-500/40',
        badgeClass: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40'
      };
    case 'herb_vault':
      return {
        label: 'Dược Hạp',
        icon: '🌿',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-500/40',
        badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
      };
    case 'ore_vault':
      return {
        label: 'Quáng Đại',
        icon: '⛏️',
        color: 'text-amber-400',
        bg: 'bg-amber-950/60',
        border: 'border-amber-500/40',
        badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-500/40'
      };
    case 'dimension':
      return {
        label: 'Tu Di Dị Bảo',
        icon: '🪐',
        color: 'text-cyan-400',
        bg: 'bg-cyan-950/60',
        border: 'border-cyan-500/40',
        badgeClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40'
      };
  }
}

export function storageShopItemToMerchantItem(item: StorageShopItem): MerchantItem {
  return {
    id: item.id,
    name: item.name,
    category: 'storage',
    itemType: 'storage',
    description: item.description,
    price: item.price,
    costLinhThach: item.price,
    stock: 1,
    maxStock: 1,
    oneTimeOnly: true,
    isOneTime: true,
    tier: item.tier,
    tierName: item.tierName,
    storageData: item,
    storageCategory: item.category,
    storageTier: item.tier,
    requiredRealmIndex: item.requiredRealmIndex,
    requiredRealmName: item.requiredRealmName,
    data: {
      storageId: item.id,
      tier: item.tier,
      category: item.category,
      spatialCapacityBonus: item.spatialCapacityBonus
    }
  };
}

export const TIER_STORAGE_MERCHANT_ITEMS: MerchantItem[] = STORAGE_SHOP_CATALOG.map(storageShopItemToMerchantItem);
