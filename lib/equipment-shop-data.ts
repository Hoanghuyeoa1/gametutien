// lib/equipment-shop-data.ts
// Danh mục 36 Món Trang Bị Thần Binh Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { EquipmentShopItem, EquipmentSlotType } from '@/lib/types/equipment-shop';
import { MerchantItem, Equipment } from '@/lib/types/items';

export const EQUIPMENT_SHOP_CATALOG: EquipmentShopItem[] = [
  // ============================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0–10)
  // ============================================
  {
    id: 'eq_t1_weapon',
    name: 'Thanh Phong Kiếm',
    tier: 1,
    tierName: 'Nhất Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Thanh kiếm thép tôi luyện qua gió núi, thân kiếm nhẹ nhàng linh động, thích hợp cho tu sĩ Luyện Khí sơ nhập giang hồ.',
    flavorText: 'Gió sớm luồn qua rặng trúc, lưỡi kiếm thanh mảnh chém đứt phàm trần – bảo kiếm sơ khai của kiếm tu.',
    price: 250,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    stats: {
      atk: 45,
      critRate: 3
    }
  },
  {
    id: 'eq_t1_armor',
    name: 'Huyền Thiết Giáp',
    tier: 1,
    tierName: 'Nhất Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Chiến giáp đúc từ huyền thiết quặng thô, tuy nặng nề nhưng bảo hộ chắc chắn yếu huyệt trước đao kiếm thông thường.',
    flavorText: 'Trăm búa nghìn đập đúc nên vảy sắt, bảo vệ nhục thân tu sĩ lúc sơ nhập tiên lộ.',
    price: 220,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    stats: {
      def: 35,
      maxHp: 200
    }
  },
  {
    id: 'eq_t1_boots',
    name: 'Tật Phong Hài',
    tier: 1,
    tierName: 'Nhất Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Đôi giày may từ da phong lang, bên dưới đế thêu trận pháp ngự phong sơ cấp giúp bước chân nhẹ tựa mây trôi.',
    flavorText: 'Đạp lên ngọn cỏ không lưu dấu, bước chân nhẹ lướt tựa làn gió thoảng.',
    price: 180,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    stats: {
      speed: 8,
      dodge: 3
    }
  },
  {
    id: 'eq_t1_accessory',
    name: 'Ngưng Khí Giới',
    tier: 1,
    tierName: 'Nhất Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Chiếc nhẫn ngọc thô chứa trận pháp ngưng tụ thiên địa linh khí, hỗ trợ ổn định đan điền và gia tăng sát thương khi công kích.',
    flavorText: 'Khí tụ đan điền, linh quang ẩn hiện – bảo vật bất ly thân của tu sĩ ngưng tụ linh khí sơ kỳ.',
    price: 200,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/40 text-stone-300 bg-stone-900/40',
    stats: {
      atk: 15,
      def: 10,
      critDmg: 5
    }
  },

  // ============================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11–15)
  // ============================================
  {
    id: 'eq_t2_weapon',
    name: 'Xích Viêm Đao',
    tier: 2,
    tierName: 'Nhị Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Đao đúc từ hỏa đồng quặng dưới đáy hỏa sơn, lưỡi đao tỏa nhiệt lượng thiêu đốt, dễ dàng bổ đôi hộ giáp hộ thân.',
    flavorText: 'Lửa địa ngục nung đỏ lưỡi đao, vung lên tựa rồng lửa cuộn trào thiêu đốt tứ phương.',
    price: 2800,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
    stats: {
      atk: 180,
      critRate: 5,
      penetration: 4
    }
  },
  {
    id: 'eq_t2_armor',
    name: 'Bách Luyện Cương Giáp',
    tier: 2,
    tierName: 'Nhị Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Giáp thép tinh luyện qua trăm lò lửa tiên gia, các phiến giáp đan kết linh hoạt, hấp thụ xung chấn và triệt tiêu một phần sát thương.',
    flavorText: 'Thép bách luyện sáng lóa như gương, đao kiếm chạm vào chỉ để lại tàn hoa lửa.',
    price: 2500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
    stats: {
      def: 140,
      maxHp: 800,
      damageReduction: 3
    }
  },
  {
    id: 'eq_t2_boots',
    name: 'Đạp Tuyết Ngoa',
    tier: 2,
    tierName: 'Nhị Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Phi ngoa đan từ tơ băng tằm ngàn năm, di chuyển trên tuyết không chìm, hỗ trợ thân pháp biến ảo khôn lường.',
    flavorText: 'Đạp tuyết vô ngân, sương tuyết vương trên gót hài chỉ còn lại dư ảnh mịt mờ.',
    price: 2000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
    stats: {
      speed: 20,
      dodge: 5
    }
  },
  {
    id: 'eq_t2_accessory',
    name: 'Bích Ngọc Bội',
    tier: 2,
    tierName: 'Nhị Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Miếng ngọc bội ngọc bích ôn nhuận, ẩn chứa linh tuyền dưỡng sinh, mỗi khi ra đòn có thể hấp thụ một phần sinh mệnh địch nhân.',
    flavorText: 'Ngọc bích ấm áp như mỡ dê, thu nạp tinh huyết càn khôn bồi bổ bản nguyên.',
    price: 2400,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
    stats: {
      atk: 60,
      def: 50,
      critDmg: 10,
      lifesteal: 2
    }
  },

  // ============================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16–20)
  // ============================================
  {
    id: 'eq_t3_weapon',
    name: 'Tử Dương Kiếm',
    tier: 3,
    tierName: 'Tam Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Bảo kiếm ngâm trong tử khí đông lai suốt chín chín tám mốt ngày, ánh kiếm tím rực rỡ mang theo dương hỏa vô tận thiêu rụi tà ma.',
    flavorText: 'Tử khí đông lai ba vạn dặm, một kiếm xuất vỏ nhật nguyệt phai mờ.',
    price: 25000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    stats: {
      atk: 650,
      critRate: 7,
      penetration: 6
    }
  },
  {
    id: 'eq_t3_armor',
    name: 'Tử Phủ Đạo Bào',
    tier: 3,
    tierName: 'Tam Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Đạo bào dệt từ vân mây Tử Phủ, tẩm đẫm kim đan chân hỏa, hình thành kết giới hộ thể vô hình chống đỡ đạo thuật công kích.',
    flavorText: 'Áo bào tím thêu mây ngũ sắc, bất nhiễm phong trần, ngăn cách vạn kiếp sát kiếp.',
    price: 22000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    stats: {
      def: 520,
      maxHp: 3000,
      damageReduction: 5
    }
  },
  {
    id: 'eq_t3_boots',
    name: 'Lôi Quang Ngoa',
    tier: 3,
    tierName: 'Tam Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Đôi ủng phong ấn lôi đình chân tủy, mỗi bước chân phát ra tiếng sấm sét lách tách, tốc độ tựa tia chớp xé toạc không gian.',
    flavorText: 'Chân đạp lôi đình, sấm sét nổ rền dưới gót – thân pháp đạt tới cảnh giới chớp giật.',
    price: 18000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    stats: {
      speed: 45,
      dodge: 7
    }
  },
  {
    id: 'eq_t3_accessory',
    name: 'Uẩn Thần Giới',
    tier: 3,
    tierName: 'Tam Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Chiếc nhẫn chế tác từ uẩn thần linh ngọc thượng phẩm, uẩn dưỡng thần niệm và kim đan, gia cố thần hồn và hút lấy sinh lực đối phương.',
    flavorText: 'Thần niệm uẩn tàng trong ngọc quý, sát niệm vừa động máu nhuộm càn khôn.',
    price: 20000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    stats: {
      atk: 220,
      def: 180,
      critDmg: 15,
      lifesteal: 3
    }
  },

  // ============================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21–25)
  // ============================================
  {
    id: 'eq_t4_weapon',
    name: 'Cửu U Trảm Ma Kiếm',
    tier: 4,
    tierName: 'Tứ Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Thần binh rèn từ Cửu U Hàn Thiết sâu vạn trượng dưới lòng đất, lưỡi kiếm sắc bén vô song, hàn khí thấu xương xuyên thấu mọi hộ thuẫn.',
    flavorText: 'Kiếm xuất Cửu U vạn ma khóc, trảm phá hư vọng định càn khôn.',
    price: 180000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40',
    stats: {
      atk: 2200,
      critRate: 9,
      penetration: 9
    }
  },
  {
    id: 'eq_t4_armor',
    name: 'Chân Vũ Huyền Giáp',
    tier: 4,
    tierName: 'Tứ Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Chiến giáp khắc họa đồ đằng Chân Vũ Huyền Vũ Đại Đế, phòng ngự vững chắc như bàn thạch, hộ mệnh chân thân Nguyên Anh bất diệt.',
    flavorText: 'Huyền Vũ tọa trấn bắc phương thiên, kiên cố ngàn thu sóng gió không lay.',
    price: 160000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40',
    stats: {
      def: 1800,
      maxHp: 12000,
      damageReduction: 7
    }
  },
  {
    id: 'eq_t4_boots',
    name: 'Di Hình Huyễn Ngoa',
    tier: 4,
    tierName: 'Tứ Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Giày báu mang theo thiên địa không gian quy tắc sơ cấp, khi thi triển để lại hàng loạt tàn ảnh mê hoặc thần thức kẻ địch.',
    flavorText: 'Di hình hoán ảnh trong gang tấc, nghìn bước hư không chỉ một thoáng chớp mắt.',
    price: 130000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40',
    stats: {
      speed: 90,
      dodge: 9
    }
  },
  {
    id: 'eq_t4_accessory',
    name: 'Cửu Chuyển Hồn Bội',
    tier: 4,
    tierName: 'Tứ Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Ngọc bội luyện qua chín lần luân chuyển thần hồn, tăng cường sự gắn kết giữa Nguyên Anh và nhục thân, mang lại uy lực bộc phá kinh hoàng.',
    flavorText: 'Chín chuyển thần hồn đúc thành ngọc, hồn quang chiếu rọi vạn dặm sơn hà.',
    price: 150000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40',
    stats: {
      atk: 750,
      def: 600,
      critDmg: 20,
      lifesteal: 4
    }
  },

  // ============================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26–30)
  // ============================================
  {
    id: 'eq_t5_weapon',
    name: 'Thái Hư Diệt Thần Kích',
    tier: 5,
    tierName: 'Ngũ Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Phương thiên họa kích dung hợp thái hư chi khí, mũi kích sắc lẹm xé toạc linh áp Hóa Thần, một đòn vung ra diệt sát thần hồn.',
    flavorText: 'Thái hư vô ngấn một kích tuyệt, thần hồn câu diệt khó vãng sinh.',
    price: 1200000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    stats: {
      atk: 7500,
      critRate: 12,
      penetration: 12
    }
  },
  {
    id: 'eq_t5_armor',
    name: 'Ngũ Hành Hỗn Nguyên Giáp',
    tier: 5,
    tierName: 'Ngũ Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Bảo giáp cấu thành từ tinh hoa ngũ hành tuần hoàn bất tận, tự động hóa giải quy tắc sát thương từ đạo pháp của đối thủ.',
    flavorText: 'Ngũ hành tương sinh chuyển hóa vô cùng, hỗn nguyên quy nhất vạn pháp bất xâm.',
    price: 1000000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    stats: {
      def: 6000,
      maxHp: 45000,
      damageReduction: 10
    }
  },
  {
    id: 'eq_t5_boots',
    name: 'Súc Địa Thần Hài',
    tier: 5,
    tierName: 'Ngũ Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Thần hài khắc họa đại trận Súc Địa Thành Thốn thượng cổ, thu hẹp ngàn dặm cự ly chỉ trong một bước chân, tránh né tuyệt đối đòn công kích hiểm hóc.',
    flavorText: 'Súc địa ngàn dặm trong gang tấc, sông núi lùi bước trước gót chân thần thông.',
    price: 850000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    stats: {
      speed: 180,
      dodge: 12
    }
  },
  {
    id: 'eq_t5_accessory',
    name: 'Thái Hư Giới Chỉ',
    tier: 5,
    tierName: 'Ngũ Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Chiếc nhẫn chế tác từ thiên thạch không gian Thái Hư, nắm giữ lực lượng cắn nuốt chân nguyên đối thủ để bồi bổ huyết khí tự thân.',
    flavorText: 'Hư không ngưng tụ thành giới chỉ, thâu tóm nhật nguyệt đoạt tạo hóa.',
    price: 950000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    stats: {
      atk: 2500,
      def: 2000,
      critDmg: 30,
      lifesteal: 5
    }
  },

  // ============================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31–35)
  // ============================================
  {
    id: 'eq_t6_weapon',
    name: 'Luyện Hư Quy Chân Kiếm',
    tier: 6,
    tierName: 'Lục Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Cổ kiếm nắm giữ quy tắc quy chân phản phác, lưỡi kiếm vô hình vô tướng nhưng chém đứt cả dòng chảy không gian và kết giới hộ thể thượng thừa.',
    flavorText: 'Luyện hư về cội, phản phác quy chân – một kiếm chém ra, vạn vật quy về hư vô.',
    price: 7500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40',
    stats: {
      atk: 25000,
      critRate: 15,
      penetration: 15
    }
  },
  {
    id: 'eq_t6_armor',
    name: 'Hư Không Toái Phiến Giáp',
    tier: 6,
    tierName: 'Lục Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Chiến giáp kết tinh từ hàng vạn mảnh vỡ không gian hỗn loạn, khiến đòn tấn công của đối thủ bị phân tán vào các khe nứt thứ nguyên.',
    flavorText: 'Mảnh vỡ không gian dệt áo giáp, vạn đạo thần lôi trượt vào cõi vô cùng.',
    price: 6800000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40',
    stats: {
      def: 20000,
      maxHp: 160000,
      damageReduction: 13
    }
  },
  {
    id: 'eq_t6_boots',
    name: 'Du Long Thần Ngoa',
    tier: 6,
    tierName: 'Lục Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Đôi giày rèn từ vảy và gân chân của Thái Cổ Du Long, đạp lên hư không dạo chơi tựa rồng lượn chín tầng mây xanh.',
    flavorText: 'Tựa rồng lượn cõi hư không, biến ảo khôn lường trốn thoát thiên la địa võng.',
    price: 5500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40',
    stats: {
      speed: 350,
      dodge: 15
    }
  },
  {
    id: 'eq_t6_accessory',
    name: 'Cửu Khiếu Thông Linh Bội',
    tier: 6,
    tierName: 'Lục Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Bảo ngọc khai mở cửu khiếu tiên thiên, quán thông thiên địa nguyên khí, mang lại khả năng hồi phục tinh huyết kinh người trong giao tranh ác liệt.',
    flavorText: 'Cửu khiếu khai thông linh khí ngút trời, thấu suốt sinh tử xoay vần chiến cuộc.',
    price: 6000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40',
    stats: {
      atk: 8500,
      def: 7000,
      critDmg: 40,
      lifesteal: 6
    }
  },

  // ============================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36–40)
  // ============================================
  {
    id: 'eq_t7_weapon',
    name: 'Bát Hoang Tru Tiên Đao',
    tier: 7,
    tierName: 'Thất Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Thần đao hung danh hiển hách phong ấn lệ khí của Bát Hoang chiến trường, đao khí bén nhọn trảm diệt chân tiên, xé rách đạo tắc phòng ngự.',
    flavorText: 'Bát Hoang đao xuất kinh thiên địa, trảm tiên tru phật máu nhuộm mây trời.',
    price: 45000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    stats: {
      atk: 90000,
      critRate: 18,
      penetration: 20
    }
  },
  {
    id: 'eq_t7_armor',
    name: 'Thái Cực Kim Thân Giáp',
    tier: 7,
    tierName: 'Thất Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Đạo giáp ngưng luyện từ Thái Cực đồ bản nguyên kết hợp Kim Thân La Hán, tá lực đả lực, kháng cự đại kiếp hủy thiên diệt địa.',
    flavorText: 'Âm dương chuyển hóa kim thân đúc, vạn kiếp bất diệt định thái bình.',
    price: 40000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    stats: {
      def: 75000,
      maxHp: 600000,
      damageReduction: 16
    }
  },
  {
    id: 'eq_t7_boots',
    name: 'Đạp Hư Vô Cực Ngoa',
    tier: 7,
    tierName: 'Thất Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Phi ngoa vượt qua giới hạn càn khôn, dạo bước giữa các giới diện nhẹ tựa lông hồng, biến chuyển vị trí thoát khỏi thần thông tỏa định.',
    flavorText: 'Đạp lên hư không vào cảnh vô cực, bước qua chư thiên chỉ trong một niệm.',
    price: 32000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    stats: {
      speed: 700,
      dodge: 18
    }
  },
  {
    id: 'eq_t7_accessory',
    name: 'Thất Tinh Hồn Giới',
    tier: 7,
    tierName: 'Thất Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Giới chỉ khảm nạm thất tinh tinh hạch từ chòm sao Bắc Đẩu, tương hỗ sinh mệnh chi đạo, hút máu và bạo phát chiến lực kinh thiên động địa.',
    flavorText: 'Bắc Đẩu thất tinh định mệnh số, sát khí ngút trời chuyển tử thành sinh.',
    price: 36000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
    stats: {
      atk: 30000,
      def: 25000,
      critDmg: 55,
      lifesteal: 8
    }
  },

  // ============================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41–45)
  // ============================================
  {
    id: 'eq_t8_weapon',
    name: 'Vạn Cổ Diệt Thế Kiếm',
    tier: 8,
    tierName: 'Bát Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Thánh kiếm vạn cổ tồn tại từ kỷ nguyên trước, mang theo ý niệm diệt thế hủy diệt chư thiên tinh tú, chém rách đại đạo trói buộc.',
    flavorText: 'Vạn cổ luân hồi kiếm ý bất diệt, nhất kiếm xuất thế thiên địa sụp đổ.',
    price: 280000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    stats: {
      atk: 320000,
      critRate: 22,
      penetration: 25
    }
  },
  {
    id: 'eq_t8_armor',
    name: 'Bất Hủ Thánh Thể Giáp',
    tier: 8,
    tierName: 'Bát Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Chiến giáp bất hủ đúc từ hài cốt Thần Ma thượng cổ tẩm đẫm tiên thiên thánh huyết, ban cho chủ nhân sức sống mãnh liệt tựa thần thánh.',
    flavorText: 'Thánh thể bất hủ sánh ngang trời đất, vạn kiếp lôi đình không thể lưu vết.',
    price: 250000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    stats: {
      def: 260000,
      maxHp: 2200000,
      damageReduction: 20
    }
  },
  {
    id: 'eq_t8_boots',
    name: 'Càn Khôn Na Di Ngoa',
    tier: 8,
    tierName: 'Bát Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Đôi ủng dung hợp Càn Khôn Đại Na Di thần thông, chuyển dời càn khôn định vị cõi hư vô, né tránh tuyệt đối mọi hiểm cảnh diệt vong.',
    flavorText: 'Càn khôn na di trong chớp mắt, dạo bước qua vạn dặm hồng hoang như nhàn du.',
    price: 200000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    stats: {
      speed: 1400,
      dodge: 22
    }
  },
  {
    id: 'eq_t8_accessory',
    name: 'Hồng Mông Luân Hồi Bội',
    tier: 8,
    tierName: 'Bát Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Tiên bội ngưng tụ từ Hồng Mông sơ khí và Luân Hồi quy tắc, chấp chưởng sinh tử chi môn, chuyển hóa đòn chí mạng thành sức mạnh cuồng bạo.',
    flavorText: 'Hồng Mông sơ khai luân hồi mở, nắm giữ sinh tử nghịch chuyển càn khôn.',
    price: 220000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/40',
    stats: {
      atk: 110000,
      def: 90000,
      critDmg: 75,
      lifesteal: 10
    }
  },

  // ============================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // ============================================
  {
    id: 'eq_t9_weapon',
    name: 'Hỗn Độn Khai Thiên Thần Kiếm',
    tier: 9,
    tierName: 'Cửu Giai',
    slot: 'weapon',
    slotName: 'Vũ Khí',
    description: 'Chí tôn thần kiếm đúc từ Hỗn Độn Nguyên Thạch thời Bàn Cổ khai thiên, một kiếm vung ra khai thiên lập địa, hủy diệt chư thiên vạn giới.',
    flavorText: 'Trước có hỗn độn sau có kiếm, một kiếm khai thiên định càn khôn!',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/40',
    stats: {
      atk: 1200000,
      critRate: 30,
      penetration: 35
    }
  },
  {
    id: 'eq_t9_armor',
    name: 'Cửu Cực Tiên Thiên Bảo Giáp',
    tier: 9,
    tierName: 'Cửu Giai',
    slot: 'armor',
    slotName: 'Chiến Giáp',
    description: 'Tiên giáp cực phẩm đan dệt từ Cửu Cực Tiên Thiên Đạo Tắc, khí huyết dồi dào tựa biển sâu vô tận, miễn dịch 25% mọi tổn thương toàn cục.',
    flavorText: 'Cửu cực quy nhất bảo giáp thành, trời nghiêng đất lở thân vẫn sừng sững.',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/40',
    stats: {
      def: 1000000,
      maxHp: 8500000,
      damageReduction: 25
    }
  },
  {
    id: 'eq_t9_boots',
    name: 'Thái Hư Hư Không Thần Ngoa',
    tier: 9,
    tierName: 'Cửu Giai',
    slot: 'boots',
    slotName: 'Phi Ngoa',
    description: 'Đôi ủng chí tôn đạp phá ranh giới thời gian và không gian, thần thông siêu thoát tam giới ngũ hành, né tránh đòn công kích của quy tắc đại đạo.',
    flavorText: 'Thái hư vô ngấn, siêu thoát luân hồi – vượt ngoài tầm với của đại đạo thiên đình.',
    price: 1200000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/40',
    stats: {
      speed: 3000,
      dodge: 30
    }
  },
  {
    id: 'eq_t9_accessory',
    name: 'Sáng Thế Hỗn Độn Giới',
    tier: 9,
    tierName: 'Cửu Giai',
    slot: 'accessory',
    slotName: 'Trang Sức',
    description: 'Chí bảo nhẫn ngọc chứa đựng lực lượng Sáng Thế, thôn phệ tinh hoa vạn vật, chuyển hóa thành bạo kích sát thương và khả năng hút máu vô tận.',
    flavorText: 'Sáng thế chi linh trong giới chỉ, một niệm sinh ra một niệm diệt!',
    price: 1400000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/40',
    stats: {
      atk: 450000,
      def: 380000,
      critDmg: 100,
      lifesteal: 15
    }
  }
];

// Lookup dictionary O(1) by ID
export const EQUIPMENT_SHOP_ITEMS_MAP: Record<string, EquipmentShopItem> = Object.fromEntries(
  EQUIPMENT_SHOP_CATALOG.map(e => [e.id, e])
);

// Helper chuyển đổi EquipmentShopItem thành MerchantItem
export function equipmentShopItemToMerchantItem(equip: EquipmentShopItem): MerchantItem {
  return {
    id: equip.id,
    name: equip.name,
    category: 'equipment',
    itemType: 'equipment',
    type: 'equipment',
    equipmentType: equip.slot === 'weapon' ? 'weapon' : equip.slot === 'armor' ? 'armor' : 'accessory',
    equipmentSlot: equip.slot,
    equipmentTier: equip.tier,
    tier: equip.tier,
    tierName: equip.tierName,
    grade: equip.tierName,
    price: equip.price,
    stock: 999,
    requiredRealmIndex: equip.requiredRealmIndex,
    requiredRealmName: equip.requiredRealmName,
    description: equip.description,
    equipmentStats: { ...equip.stats },
    equipmentData: {
      type: equip.slot === 'weapon' ? 'weapon' : equip.slot === 'armor' ? 'armor' : 'accessory',
      slot: equip.slot === 'accessory' ? 'ring' : equip.slot,
      tier: equip.tier,
      grade: equip.tierName,
      baseStats: {
        atk: equip.stats.atk || 0,
        def: equip.stats.def || 0,
        hp: equip.stats.maxHp || 0,
        speed: equip.stats.speed || 0,
        critRate: equip.stats.critRate || 0,
        damageReduction: equip.stats.damageReduction || 0
      },
      sockets: equip.tier >= 8 ? 4 : equip.tier >= 5 ? 3 : equip.tier >= 3 ? 2 : 1,
      isNatalCandidate: equip.tier >= 4
    },
    data: {
      equipmentShopItem: equip,
      isEquipmentShopItem: true,
      slot: equip.slot,
      slotName: equip.slotName,
      stats: equip.stats,
      flavorText: equip.flavorText,
      badgeColor: equip.badgeColor
    }
  };
}

// Helper chuyển đổi EquipmentShopItem thành Equipment người chơi trang bị
export function equipmentShopItemToEquipment(item: EquipmentShopItem): Equipment {
  return {
    id: item.id,
    name: item.name,
    slot: item.slot,
    type: item.slot === 'weapon' ? 'weapon' : item.slot === 'armor' ? 'armor' : item.slot === 'boots' ? 'boots' : 'accessory',
    grade: item.tierName,
    quality: item.tier >= 9 ? 'tien_pham' : item.tier >= 7 ? 'cuc_pham' : item.tier >= 5 ? 'tuyet_pham' : item.tier >= 3 ? 'thuong_pham' : 'trung_pham',
    powerBonus: item.stats.atk || (item.stats.def ? item.stats.def * 2 : 0) || (item.stats.speed ? item.stats.speed * 10 : 0) || 50,
    enhancement: 0,
    atkBonus: item.stats.atk || 0,
    defBonus: item.stats.def || 0,
    hpBonus: item.stats.maxHp || 0,
    mpBonus: 0,
    speedBonus: item.stats.speed || 0,
    critRateBonus: item.stats.critRate || 0,
    critDmgBonus: item.stats.critDmg || 0,
    dodgeBonus: item.stats.dodge || 0,
    penetrationBonus: item.stats.penetration || 0,
    damageReduction: item.stats.damageReduction || 0,
    lifesteal: item.stats.lifesteal || 0,
    description: item.description,
    price: item.price,
    tier: item.tier,
    tierName: item.tierName,
    requiredRealmIndex: item.requiredRealmIndex,
    requiredRealmName: item.requiredRealmName,
    equipmentStats: { ...item.stats },
    stats: { ...item.stats },
    flavorText: item.flavorText,
    sockets: [],
    maxSockets: item.tier >= 8 ? 4 : item.tier >= 5 ? 3 : item.tier >= 3 ? 2 : 1
  };
}

export const TIER_EQUIPMENT_MERCHANT_ITEMS: MerchantItem[] = EQUIPMENT_SHOP_CATALOG.map(equipmentShopItemToMerchantItem);

// ============================================
// Badge helpers
// ============================================
export function getEquipmentSlotBadge(slot: EquipmentSlotType): { label: string; icon: string; badgeColor: string; badgeClass: string } {
  switch (slot) {
    case 'weapon':
      return {
        label: 'Vũ Khí',
        icon: '⚔️',
        badgeColor: 'border-red-500/40 text-red-300 bg-red-950/40',
        badgeClass: 'border-red-500/40 text-red-300 bg-red-950/40'
      };
    case 'armor':
      return {
        label: 'Chiến Giáp',
        icon: '🛡️',
        badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40',
        badgeClass: 'border-blue-500/40 text-blue-300 bg-blue-950/40'
      };
    case 'boots':
      return {
        label: 'Phi Ngoa',
        icon: '👢',
        badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40',
        badgeClass: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
      };
    case 'accessory':
      return {
        label: 'Trang Sức',
        icon: '💍',
        badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
        badgeClass: 'border-purple-500/40 text-purple-300 bg-purple-950/40'
      };
    default:
      return {
        label: 'Trang Bị',
        icon: '⚔️',
        badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40',
        badgeClass: 'border-amber-500/40 text-amber-300 bg-amber-950/40'
      };
  }
}
