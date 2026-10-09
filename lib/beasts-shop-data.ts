// lib/beasts-shop-data.ts
import { BeastShopItem, BeastArchetype, BeastShopTier } from './types/beasts-shop';
import { MerchantItem } from './types/items';

export const BEASTS_SHOP_CATALOG: BeastShopItem[] = [
  // ============================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0-10)
  // ============================================
  {
    id: 'beast_t1_atk',
    name: 'Xích Diễm Hỏa Nha',
    speciesTitle: 'Hỏa Điểu Dị Chủng',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Quạ lửa sinh trưởng nơi mạch đá nham thạch, cánh rực hỏa quang, mỗi khi vỗ cánh phát xuất từng quả hỏa cầu thiêu đốt kẻ địch.',
    backstory: 'Một thợ săn dã ngoại bắt được tổ hỏa nha nơi chân Hỏa Diễm Sơn, thuần dưỡng đưa đến Phường Thị bán kiếm linh thạch.',
    price: 280,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-amber-700 via-stone-600 to-rose-900',
    elementalAffinity: 'hoa',
    innateSkillName: 'Xích Diễm Hỏa Cầu',
    innateSkillDesc: 'Phun ra hỏa cầu thiêu đốt, gia tăng 4% công kích cho chủ nhân và tăng 80 Lực chiến thực tế.',
    stats: {
      combatPower: 80,
      atkBonusPercent: 4
    }
  },
  {
    id: 'beast_t1_mount',
    name: 'Tật Phong Linh Lang',
    speciesTitle: 'Phong Hệ Linh Thú',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Sói hoang hấp thu phong linh khí, chạy nhanh như gió, bước chân nhẹ nhàng không để lại dấu tích trên tuyết.',
    backstory: 'Bị bầy đàn xua đuổi do linh mạch thức tỉnh dị biến, được một tán tu cứu sống và ký gửi tại Vạn Bảo Thương Hội.',
    price: 320,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-zinc-700 via-slate-600 to-sky-900',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Tật Phong Thuật',
    innateSkillDesc: 'Hóa thành cơn gió nâng bước chủ nhân, +10 Thân Pháp và tăng 3% tỷ lệ Né Tránh.',
    stats: {
      combatPower: 70,
      speedBonusFlat: 10,
      dodgeBonus: 3
    }
  },
  {
    id: 'beast_t1_tank',
    name: 'Thiềm Thừ Hộ Mạch',
    speciesTitle: 'Thạch Giáp Cổ Cóc',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Cóc đá lưng mang mai cứng như bàn thạch, có khả năng hô hấp linh khí ngưng tụ thành vòng khí giáp bảo hộ.',
    backstory: 'Được phát hiện ngủ đông dưới mỏ linh thạch hạ phẩm trăm năm, da dày thịt béo khó đao thương nào xuyên thủng.',
    price: 260,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-amber-800 via-stone-700 to-yellow-900',
    elementalAffinity: 'tho',
    innateSkillName: 'Khí Giáp Hộ Thể',
    innateSkillDesc: 'Ngưng tụ vòng khí hộ thể dày đặc, gia tăng 250 Khí Huyết và 15 Phòng Ngự.',
    stats: {
      combatPower: 60,
      hpBonusFlat: 250,
      defBonusPercent: 5
    }
  },
  {
    id: 'beast_t1_luck',
    name: 'Kim Linh Tầm Thử',
    speciesTitle: 'Thụy Thú Tầm Bảo',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Chuột lông vàng thông linh, mũi cực kỳ thính với dao động ngũ hành linh thạch và thảo dược trong lòng đất.',
    backstory: 'Gia truyền của một linh thương kỳ cựu trao lại cho Thương Hội để tìm kiếm tu sĩ có phúc duyên bảo bọc nó.',
    price: 380,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-yellow-700 via-amber-600 to-stone-900',
    elementalAffinity: 'kim',
    innateSkillName: 'Tầm Khoáng Khứu Giác',
    innateSkillDesc: 'Đánh hơi bảo vật linh mạch ngầm, gia tăng vĩnh viễn +3 Khí Vận và 5% tỷ lệ rơi vật phẩm.',
    stats: {
      combatPower: 50,
      khiVanBonus: 3,
      dropRateBonusPercent: 5
    }
  },

  // ============================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11-15)
  // ============================================
  {
    id: 'beast_t2_atk',
    name: 'Xích Luyện Hỏa Hổ',
    speciesTitle: 'Xích Viêm Liệt Thú',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Mãnh hổ cuộn trào lửa đỏ, mỗi tiếng gầm làm rung chuyển sơn lâm, móng vuốt rực lửa dễ dàng xé nát hộ thuẫn.',
    backstory: 'Bắt được tại khe nứt Hỏa Vực Trúc Cơ sau khi đại chiến cùng ba vị tu sĩ.',
    price: 3200,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-red-800 via-orange-700 to-emerald-900',
    elementalAffinity: 'hoa',
    innateSkillName: 'Liệt Diễm Liêm Trảo',
    innateSkillDesc: 'Cắn xé hộ thuẫn đối phương, +350 Lực chiến, +6% ATK và +3% Bạo Kích.',
    stats: {
      combatPower: 350,
      atkBonusPercent: 6,
      critRateBonus: 3
    }
  },
  {
    id: 'beast_t2_mount',
    name: 'U Ảnh Báo',
    speciesTitle: 'Hắc Dạ Ám Thú',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Báo bóng đêm mình khoác làn khói đen mờ ảo, có thể ẩn mình trong bóng râm và thấu thị hư không.',
    backstory: 'Thú săn bóng đêm vùng đầm lầy âm u, được tuần tra đội Thương Hội bẫy bắt khi nó đang săn mồi.',
    price: 3500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-slate-800 via-indigo-900 to-emerald-950',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'U Ảnh Bộ',
    innateSkillDesc: 'Lướt đi như ảo ảnh vô thanh vô tức, +22 Thân Pháp và +5% Né Tránh.',
    stats: {
      combatPower: 260,
      speedBonusFlat: 22,
      dodgeBonus: 5
    }
  },
  {
    id: 'beast_t2_tank',
    name: 'Huyền Thiết Cương Ngạc',
    speciesTitle: 'Kim Cương Cự Ngạc',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Cá sấu đầm lầy khoác lớp vảy thép huyền thiết cứng cáp, hấp thụ xung chấn từ các pháp thuật công kích.',
    backstory: 'Sống nơi đầm lầy Vạn Trượng, da dày đến mức phi kiếm hạ phẩm chém vào chỉ tóe tia lửa.',
    price: 3000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-zinc-800 via-emerald-800 to-stone-900',
    elementalAffinity: 'kim',
    innateSkillName: 'Cương Giáp Hấp Lực',
    innateSkillDesc: 'Lớp giáp thép hấp thụ sát thương, +1,000 Khí Huyết và +60 Phòng Ngự.',
    stats: {
      combatPower: 280,
      hpBonusFlat: 1000,
      defBonusPercent: 8
    }
  },
  {
    id: 'beast_t2_luck',
    name: 'Ngũ Sắc Dược Hồ',
    speciesTitle: 'Linh Hồ Thảo Mộc',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Hồ ly tuyết ngũ sắc nhanh nhẹn, thích gặm nhấm linh chi và dẫn lối tu sĩ tìm đến các hang động ẩn giấu dược thảo quý hiếm.',
    backstory: 'Lạc vào dược viên của Vạn Bảo Thương Hội vì mải mê ăn vụng đan dược, sau đó tự nguyện ở lại làm linh sủng.',
    price: 4500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-teal-800 via-emerald-700 to-lime-900',
    elementalAffinity: 'moc',
    innateSkillName: 'Dược Hương Dẫn Lộ',
    innateSkillDesc: 'Dẫn dắt tìm kiếm kỳ hoa dị thảo, +5 Khí Vận vĩnh viễn và +8% tỷ lệ rơi thảo dược.',
    stats: {
      combatPower: 220,
      khiVanBonus: 5,
      dropRateBonusPercent: 8
    }
  },

  // ============================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16-20)
  // ============================================
  {
    id: 'beast_t3_atk',
    name: 'Lôi Đình Thần Điểu',
    speciesTitle: 'Thiên Lôi Thần Cầm',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Thần điểu tắm mình trong lôi vân chín tầng trời, lông vũ sắc bén như kim châm giáng sấm sét làm choáng váng kẻ địch.',
    backstory: 'Hạ lạc từ Lôi Vân Đỉnh sau trận lôi kiếp, được cao thủ Kim Đan cứu trợ và thuần hóa.',
    price: 30000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-sky-700 via-blue-600 to-indigo-900',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Lôi Giáng Tê Liệt',
    innateSkillDesc: 'Sấm sét tê liệt kình địch, +1,800 Lực chiến, +8% ATK và +5% Bạo Kích.',
    stats: {
      combatPower: 1800,
      atkBonusPercent: 8,
      critRateBonus: 5
    }
  },
  {
    id: 'beast_t3_mount',
    name: 'Phong Lôi Độc Giác Thú',
    speciesTitle: 'Thiên Mã Độc Giác',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Ngựa thần một sừng mang song dực phong lôi, phi hành xuyên qua tầng mây ngàn dặm chỉ trong chớp mắt.',
    backstory: 'Tọa kỵ của một vị kiếm tiên Kim Đan tọa hóa để lại, tìm kiếm chủ nhân xứng tầm tốc độ của nó.',
    price: 32000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-cyan-700 via-sky-800 to-indigo-950',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Đạp Vân Phi Hành',
    innateSkillDesc: 'Cưỡi gió đạp mây phi hành thần tốc, +50 Thân Pháp và +7% Né Tránh.',
    stats: {
      combatPower: 1400,
      speedBonusFlat: 50,
      dodgeBonus: 7
    }
  },
  {
    id: 'beast_t3_tank',
    name: 'Kim Cương Trầm Nham Tê',
    speciesTitle: 'Viễn Cổ Cương Nham',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Tê giác đá kim cương vảy cứng ngưng đọng từ nham thạch vạn trượng, sừng tê húc đổ thành trì kiên cố.',
    backstory: 'Được khai quật từ một bí cảnh cổ xưa, bản tính trầm mặc nhưng trung thành hộ chủ tuyệt đối.',
    price: 28000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-stone-700 via-amber-800 to-sky-950',
    elementalAffinity: 'tho',
    innateSkillName: 'Bất Động Như Sơn',
    innateSkillDesc: 'Trụ vững như bàn thạch miễn nhiễm chấn động, +4,000 Khí Huyết và +220 Phòng Ngự.',
    stats: {
      combatPower: 1500,
      hpBonusFlat: 4000,
      defBonusPercent: 12
    }
  },
  {
    id: 'beast_t3_luck',
    name: 'Thất Thải Linh Lộc',
    speciesTitle: 'Cửu Sắc Thụy Thú',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Hươu linh thất thải bước đi hoa cỏ nở rộ, nơi nào nó ghé qua nơi đó linh khí dạt dào, vận may liên miên.',
    backstory: 'Xuất hiện bên cạnh suối ngọc Linh Tuyền, tự quy phục khi gặp người có khí độ phi phàm.',
    price: 45000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-500/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-emerald-700 via-teal-600 to-sky-900',
    elementalAffinity: 'moc',
    innateSkillName: 'Thất Thải Tường Quang',
    innateSkillDesc: 'Chiếu rọi điềm lành khắp chốn, +10 Khí Vận vĩnh viễn và +12% Linh Thạch rơi ra khi thám hiểm.',
    stats: {
      combatPower: 1200,
      khiVanBonus: 10,
      dropRateBonusPercent: 12
    }
  },

  // ============================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21-25)
  // ============================================
  {
    id: 'beast_t4_atk',
    name: 'Huyết Sí Ma Bằng',
    speciesTitle: 'Thái Cổ Bằng Tộc',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Đại bàng cánh máu nuốt chửng linh khí trời đất, tiếng kêu xé toạc mây trời, sải cánh che khuất mặt trời.',
    backstory: 'Trảm sát một vị ma tu Nguyên Anh đoạt được ấu thú ma bằng, nuôi dưỡng bằng huyết tinh thượng phẩm.',
    price: 220000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-500/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-red-900 via-purple-900 to-black',
    elementalAffinity: 'hoa',
    innateSkillName: 'Huyết Sí Thôn Thiên',
    innateSkillDesc: 'Hút cạn sinh khí đối thủ, +8,500 Lực chiến, +12% ATK và +8% Bạo Kích.',
    stats: {
      combatPower: 8500,
      atkBonusPercent: 12,
      critRateBonus: 8
    }
  },
  {
    id: 'beast_t4_mount',
    name: 'Hư Ảnh Vân Báo',
    speciesTitle: 'Hư Không Dị Thú',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Xuyên toa qua các tầng hư vô, thân hình thoắt ẩn thoắt hiện khiến kẻ địch không tài nào bắt kịp hành tung.',
    backstory: 'Thu phục từ vết nứt Không Gian Hư Vô, khả năng thám hiểm rút ngắn đáng kể thời gian vượt bí cảnh.',
    price: 250000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-500/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-indigo-900 via-purple-800 to-slate-900',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Hư Không Na Di',
    innateSkillDesc: 'Băng qua kẽ nứt không gian, +100 Thân Pháp và rút ngắn 20% thời gian thám hiểm bí cảnh.',
    stats: {
      combatPower: 6500,
      speedBonusFlat: 100,
      dodgeBonus: 9
    }
  },
  {
    id: 'beast_t4_tank',
    name: 'Vạn Niên Băng Tinh Hùng',
    speciesTitle: 'Băng Phách Thần Thú',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Gấu khổng lồ băng tinh vạn năm ngưng đọng từ hàn ngọc cực bắc, tạo khiên bảo hộ băng giáp hộ vệ chân thân.',
    backstory: 'Thần hộ sơn của một tông môn cổ đã lụi tàn tại Bắc Cực Băng Nguyên, được đại năng khai quật.',
    price: 200000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-500/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-cyan-800 via-blue-900 to-purple-950',
    elementalAffinity: 'thuy',
    innateSkillName: 'Hàn Băng Thần Giáp',
    innateSkillDesc: 'Tạo lớp khiên bảo hộ 15% Max HP, +15,000 Khí Huyết và +800 Phòng Ngự.',
    stats: {
      combatPower: 7000,
      hpBonusFlat: 15000,
      defBonusPercent: 15
    }
  },
  {
    id: 'beast_t4_luck',
    name: 'Cửu Vĩ Linh Miêu',
    speciesTitle: 'Huyễn Vĩ Thiên Thú',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Mèo chín đuôi đoạt linh tủy trời đất, đôi mắt thấu thị mọi pháp trận cấm chế và bảo tàng phong ấn ngàn năm.',
    backstory: 'Một sinh linh nghịch thiên sinh ra từ linh mạch cực phẩm, tìm kiếm nơi an cư lạc nghiệp.',
    price: 350000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-500/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-purple-800 via-pink-700 to-amber-950',
    elementalAffinity: 'hon_don',
    innateSkillName: 'Đoạt Bảo Thông Linh',
    innateSkillDesc: 'Nhìn thấu bảo tàng phong ấn, +18 Khí Vận vĩnh viễn và tăng 15% tỷ lệ rơi đồ Cực Phẩm.',
    stats: {
      combatPower: 6000,
      khiVanBonus: 18,
      dropRateBonusPercent: 15
    }
  },

  // ============================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26-30)
  // ============================================
  {
    id: 'beast_t5_atk',
    name: 'U Minh Bạch Hổ',
    speciesTitle: 'Tứ Tượng Thần Chủng',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Bạch hổ sát thần chém đứt nguyên anh địch, móng vuốt mang theo sát khí u minh hủy diệt mọi sinh linh.',
    backstory: 'Hậu duệ thuần huyết của Bạch Hổ Thần Thú, phá phong ấn từ Thần Ma Cổ Chiến Trường.',
    price: 1500000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-zinc-700 via-amber-600 to-slate-900',
    elementalAffinity: 'kim',
    innateSkillName: 'Bạch Hổ Sát Tuyệt',
    innateSkillDesc: 'Sát khí lẫm liệt trảm toái hộ thuẫn, +35,000 Lực chiến, +16% ATK và +10% Xuyên Giáp.',
    stats: {
      combatPower: 35000,
      atkBonusPercent: 16,
      critRateBonus: 10
    }
  },
  {
    id: 'beast_t5_mount',
    name: 'Kim Sí Đại Bằng Điểu',
    speciesTitle: 'Thần Cầm Chí Tôn',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Một sải cánh chín vạn dặm, bay lượn trên chín tầng trời cao, không có bất kỳ pháp trận nào giam cầm được.',
    backstory: 'Đại bàng hoàng kim chúa tể bầu trời, chỉ chịu cúi đầu trước những bậc đại năng Hóa Thần trở lên.',
    price: 1800000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-amber-600 via-yellow-500 to-orange-950',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Cửu Vạn Lý Thần Hành',
    innateSkillDesc: 'Xé toạc mây trời trong nháy mắt, +200 Thân Pháp và +12% Né Tránh.',
    stats: {
      combatPower: 28000,
      speedBonusFlat: 200,
      dodgeBonus: 12
    }
  },
  {
    id: 'beast_t5_tank',
    name: 'Tử Kim Cự Ngao',
    speciesTitle: 'Thái Cổ Thần Quy',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Rùa khổng lồ gánh vác sơn hà, mai rùa khắc hoa văn bát quái chống đỡ thiên tai và thần lôi oanh kích.',
    backstory: 'Sống nơi đáy sâu Vô Tận Hải, từng đội cả hòn đảo linh mạch trên lưng qua vạn năm.',
    price: 1400000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-purple-800 via-amber-700 to-indigo-950',
    elementalAffinity: 'thuy',
    innateSkillName: 'Trấn Nhai Sơn Hà',
    innateSkillDesc: 'Lực phòng ngự chấn động càn khôn, +60,000 Khí Huyết, +2,500 DEF và giảm 8% sát thương nhận vào.',
    stats: {
      combatPower: 30000,
      hpBonusFlat: 60000,
      defBonusPercent: 20
    }
  },
  {
    id: 'beast_t5_luck',
    name: 'Hóa Long Thần Ngư',
    speciesTitle: 'Thần Ngư Thụy Linh',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Cá chép vượt long môn ban phúc lành vô tận, toàn thân phủ vảy rồng lấp lánh như ngọc châu báu.',
    backstory: 'Vừa hoàn thành Long Môn Thiên Kiếp, mang theo vận thế long tộc ban tặng cho người thuần dưỡng.',
    price: 2500000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-blue-700 via-amber-600 to-teal-900',
    elementalAffinity: 'thuy',
    innateSkillName: 'Long Môn Tứ Phúc',
    innateSkillDesc: 'Ban phát phúc lộc vạn đại, +30 Khí Vận vĩnh viễn và tăng 20% toàn bộ tài nguyên thu hoạch.',
    stats: {
      combatPower: 25000,
      khiVanBonus: 30,
      dropRateBonusPercent: 20
    }
  },

  // ============================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31-35)
  // ============================================
  {
    id: 'beast_t6_atk',
    name: 'Cửu Đầu Hỏa Phượng',
    speciesTitle: 'Thượng Cổ Thần Điểu',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Phượng hoàng chín đầu thiêu rụi vạn dặm, lửa phượng thiêu cháy linh hồn và hư không không gì dập tắt được.',
    backstory: 'Trỗi dậy từ tro tàn Hỗn Độn Hỏa Vực, được hội trưởng Thương Hội dùng cửu chuyển đan dụ dỗ kết duyên.',
    price: 10000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-rose-800 via-orange-600 to-red-950',
    elementalAffinity: 'hoa',
    innateSkillName: 'Cửu Hỏa Phần Thiên',
    innateSkillDesc: 'Hỏa diễm bất diệt thiêu đốt chân hồn, +120,000 Lực chiến, +20% ATK và gây thêm sát thương chuẩn.',
    stats: {
      combatPower: 120000,
      atkBonusPercent: 20,
      critRateBonus: 12
    }
  },
  {
    id: 'beast_t6_mount',
    name: 'Hư Không Dạ Mộng Thú',
    speciesTitle: 'Mộng Yểm Thần Thú',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Đi lại tự do trong giấc mộng và kẽ nứt hư không, bước chân mở ra mộng cảnh khiến thế gian đảo điên.',
    backstory: 'Sinh vật sinh ra từ ranh giới giữa thực và mộng, chu du qua vô số tiểu thế giới.',
    price: 12000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-purple-900 via-indigo-800 to-rose-950',
    elementalAffinity: 'hon_don',
    innateSkillName: 'Dạ Mộng Du Hành',
    innateSkillDesc: 'Xuyên toa qua cảnh giới chi mộng, +400 Thân Pháp và +15% Né Tránh.',
    stats: {
      combatPower: 95000,
      speedBonusFlat: 400,
      dodgeBonus: 15
    }
  },
  {
    id: 'beast_t6_tank',
    name: 'Quy Chân Huyền Giáp Thú',
    speciesTitle: 'Thái Hư Cổ Chủng',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Thân thể phản phác quy chân miễn trừ 100% debuff tiêu cực, mai giáp hấp thu mọi luồng pháp lực tà ác.',
    backstory: 'Thú tổ ngủ vùi dưới lòng đất sâu mười vạn trượng, thức tỉnh khi linh khí đại lục biến chuyển.',
    price: 9500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-stone-800 via-emerald-900 to-rose-950',
    elementalAffinity: 'tho',
    innateSkillName: 'Phản Phác Quy Chân',
    innateSkillDesc: 'Miễn nhiễm toàn bộ hiệu ứng tiêu cực, +200,000 Khí Huyết và +8,000 Phòng Ngự.',
    stats: {
      combatPower: 105000,
      hpBonusFlat: 200000,
      defBonusPercent: 25
    }
  },
  {
    id: 'beast_t6_luck',
    name: 'Tường Vân Bích Thủy Lân',
    speciesTitle: 'Kỳ Lân Thần Thú',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Kỳ lân nước mang mây lành che chở, chân đạp sóng biếc gieo rắc tiên duyên và kỳ ngộ khắp nơi nó qua.',
    backstory: 'Linh vật hộ mệnh của đại tiên tông thời viễn cổ, lưu truyền lại chờ đợi chân nhân hữu duyên.',
    price: 16000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-teal-700 via-cyan-600 to-rose-900',
    elementalAffinity: 'thuy',
    innateSkillName: 'Bích Thủy Tường Vân',
    innateSkillDesc: 'Hút phúc khí cửu thiên, +45 Khí Vận vĩnh viễn và tăng 25% tỷ lệ gặp kỳ ngộ dã ngoại.',
    stats: {
      combatPower: 90000,
      khiVanBonus: 45,
      dropRateBonusPercent: 25
    }
  },

  // ============================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36-40)
  // ============================================
  {
    id: 'beast_t7_atk',
    name: 'Bát Hoang Viêm Ma Long',
    speciesTitle: 'Viêm Long Thái Cổ',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Rồng lửa thượng cổ dung hợp pháp thân vạn trượng, một hơi thở dung nham có thể làm khô cạn đại dương.',
    backstory: 'Từng là Ma Long trấn thủ Hỏa Ngục Bát Hoang, bị đại năng Hợp Thể phong ấn và thuần hóa.',
    price: 50000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
    avatarGradient: 'from-red-700 via-amber-600 to-cyan-900',
    elementalAffinity: 'hoa',
    innateSkillName: 'Viêm Long Liệt Giới',
    innateSkillDesc: 'Hơi thở diệt thế thiêu rụi phòng tuyến, +500,000 Lực chiến, +25% ATK và +15% Bạo Kích.',
    stats: {
      combatPower: 500000,
      atkBonusPercent: 25,
      critRateBonus: 15
    }
  },
  {
    id: 'beast_t7_mount',
    name: 'Đạp Hư Vô Cực Câu',
    speciesTitle: 'Vô Cực Thần Câu',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Ngựa thần đạp vỡ hư không, vó ngựa tung bay phá vỡ rào cản thời gian và không gian đa chiều.',
    backstory: 'Sinh vật phi nước đại giữa các vì sao, chỉ những ai có thần thức Hợp Thể mới đuổi kịp bóng hình.',
    price: 60000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
    avatarGradient: 'from-cyan-600 via-sky-500 to-indigo-950',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Phá Không Đạp Lãng',
    innateSkillDesc: 'Vó ngựa xé toạc chân không, +800 Thân Pháp và +18% Né Tránh.',
    stats: {
      combatPower: 420000,
      speedBonusFlat: 800,
      dodgeBonus: 18
    }
  },
  {
    id: 'beast_t7_tank',
    name: 'Thái Cực Bất Diệt Huyền Vũ',
    speciesTitle: 'Huyền Vũ Thánh Tộc',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Huyền vũ cổ đại đỡ đòn sát tử cho chủ nhân (1 lần/trận), linh hồn liên kết bảo vệ nguyên thần chủ thượng.',
    backstory: 'Thánh thú trấn phương Bắc của giới diện cổ, được triệu hồi về thế gian thông qua tế đàn Thượng Cổ.',
    price: 45000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
    avatarGradient: 'from-blue-800 via-teal-700 to-cyan-950',
    elementalAffinity: 'thuy',
    innateSkillName: 'Huyền Vũ Hộ Mệnh',
    innateSkillDesc: 'Đỡ đòn chí mạng cho chủ nhân (1 lần/trận), +800,000 Khí Huyết và +30,000 DEF.',
    stats: {
      combatPower: 450000,
      hpBonusFlat: 800000,
      defBonusPercent: 30
    }
  },
  {
    id: 'beast_t7_luck',
    name: 'Ngũ Trảo Hoàng Kim Long',
    speciesTitle: 'Chân Long Vương Giả',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Rồng vàng chân mệnh đế vương mang phúc khí đế vương cửu ngũ chí tôn, uy áp chư thiên vạn giới.',
    backstory: 'Thần long bảo vệ vương triều tiên đạo cổ xưa, mang theo quốc vận trường tồn đổ dồn vào một người.',
    price: 80000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
    avatarGradient: 'from-amber-500 via-yellow-400 to-cyan-900',
    elementalAffinity: 'kim',
    innateSkillName: 'Đế Vương Long Vận',
    innateSkillDesc: 'Khí vận chí tôn nhân đôi lượng Linh Thạch rơi từ Boss, +70 Khí Vận vĩnh viễn.',
    stats: {
      combatPower: 480000,
      khiVanBonus: 70,
      dropRateBonusPercent: 30
    }
  },

  // ============================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41-45)
  // ============================================
  {
    id: 'beast_t8_atk',
    name: 'Tru Tiên Chu Tước Thánh Thú',
    speciesTitle: 'Thánh Cầm Niết Bàn',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Chu tước niết bàn mang ngọn lửa diệt thế thiêu rụi cả tiên nhân, sức mạnh công phá xuyên thủng vạn pháp.',
    backstory: 'Niết bàn trùng sinh từ chiến trường Chư Tiên Hoàng Hôn, mang hận ý và lực lượng hủy diệt vô song.',
    price: 250000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-rose-600 via-red-500 to-amber-900',
    elementalAffinity: 'hoa',
    innateSkillName: 'Tru Tiên Diệt Thế Viêm',
    innateSkillDesc: 'Ngọn lửa diệt thế hủy thiên diệt địa, +2,200,000 Lực chiến, +32% ATK và +20% Bạo Thương.',
    stats: {
      combatPower: 2200000,
      atkBonusPercent: 32,
      critRateBonus: 20
    }
  },
  {
    id: 'beast_t8_mount',
    name: 'Càn Khôn Na Di Kim Bằng',
    speciesTitle: 'Càn Khôn Thần Điểu',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Di chuyển tức thời giữa các tinh cầu, chỉ cần một cái chớp mắt đã vượt qua trùng trùng thiên hà tinh tú.',
    backstory: 'Kim bằng hấp thụ tinh hoa vũ trụ tinh tú, bay lượn tự do ngoài càn khôn bát hoang.',
    price: 300000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-amber-400 via-yellow-500 to-indigo-950',
    elementalAffinity: 'phong_loi',
    innateSkillName: 'Tinh Cầu Na Di',
    innateSkillDesc: 'Dịch chuyển càn khôn vô câu vô thúc, +1,600 Thân Pháp và +22% Né Tránh.',
    stats: {
      combatPower: 1800000,
      speedBonusFlat: 1600,
      dodgeBonus: 22
    }
  },
  {
    id: 'beast_t8_tank',
    name: 'Bất Hủ Hỗn Nguyên Thần Quy',
    speciesTitle: 'Hỗn Nguyên Thánh Quy',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Khối giáp vạn kiếp không mòn sinh ra từ thuở sơ khai, hấp thụ đại đạo pháp tắc biến thành hộ thân chân khí.',
    backstory: 'Từng nằm gối đầu tại bờ biển Hỗn Độn xem chư thiên sinh diệt, mình bọc lớp mai bất hoại.',
    price: 220000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-stone-700 via-yellow-600 to-purple-950',
    elementalAffinity: 'tho',
    innateSkillName: 'Vạn Kiếp Hỗn Nguyên Giáp',
    innateSkillDesc: 'Giáp phòng ngự bất hủ bất diệt, +3,000,000 Khí Huyết, +100,000 DEF và giảm 20% sát thương toàn cục.',
    stats: {
      combatPower: 1900000,
      hpBonusFlat: 3000000,
      defBonusPercent: 35
    }
  },
  {
    id: 'beast_t8_luck',
    name: 'Cửu Thiên Ứng Long Vương',
    speciesTitle: 'Thiên Cổ Thánh Long',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Thần thú hô mưa gọi gió, ban phúc vạn thế, tiếng gầm vang dội chín tầng mây mang lại ngàn vạn phúc duyên.',
    backstory: 'Ứng Long chân chính có đôi cánh hoàng kim, cai quản mưa gió phúc trạch của toàn cõi Tiên Giới.',
    price: 400000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-sky-500 via-amber-400 to-indigo-900',
    elementalAffinity: 'thuy',
    innateSkillName: 'Cửu Thiên Hô Phong Hoán Vũ',
    innateSkillDesc: 'Phúc trạch vô lượng, +100 Khí Vận vĩnh viễn và tăng 35% tỷ lệ nhận Tiên Duyên bí bảo.',
    stats: {
      combatPower: 2000000,
      khiVanBonus: 100,
      dropRateBonusPercent: 35
    }
  },

  // ============================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // ============================================
  {
    id: 'beast_t9_atk',
    name: 'Hỗn Độn Khai Thiên Ma Viên',
    speciesTitle: 'Hỗn Độn Thần Ma',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'chien_dau',
    archetypeName: 'Chiến Đấu Chủ Lực',
    description: 'Ma vượn hỗn độn tay xé trời đất, khí thế cuồng bạo áp đảo thần ma, một quyền đánh sụp càn khôn vũ trụ.',
    backstory: 'Sinh ra cùng thời với Bàn Cổ Thần Ma, phong ấn trong lõi hỗn độn thiên thạch qua ức vạn năm.',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-400/80 text-fuchsia-200 bg-fuchsia-950/60',
    avatarGradient: 'from-red-600 via-fuchsia-700 to-black',
    elementalAffinity: 'hon_don',
    innateSkillName: 'Khai Thiên Diệt Ma Quyền',
    innateSkillDesc: 'Đòn đánh cuồng bạo xé rách thời không, +8,000,000 Lực chiến, +50% ATK và kèm 30% sát thương chuẩn bỏ qua hộ giáp.',
    stats: {
      combatPower: 8000000,
      atkBonusPercent: 50,
      critRateBonus: 25
    }
  },
  {
    id: 'beast_t9_mount',
    name: 'Thái Hư Hư Không Thần Long',
    speciesTitle: 'Chí Cao Thời Không Long',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'thu_cuoi',
    archetypeName: 'Thần Hành Tọa Kỵ',
    description: 'Long thần ngự trị thời không vô tận, uốn lượn xuyên qua quá khứ hiện tại và tương lai, miễn nhiễm toàn bộ khống chế.',
    backstory: 'Bản nguyên hóa thân của dòng sông thời không, chỉ thần phục bậc đế tôn nghịch thiên cải mệnh.',
    price: 2000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-400/80 text-fuchsia-200 bg-fuchsia-950/60',
    avatarGradient: 'from-violet-600 via-fuchsia-600 to-indigo-950',
    elementalAffinity: 'hon_don',
    innateSkillName: 'Thời Không Vô Cực Ngự',
    innateSkillDesc: 'Lướt trên dòng thời gian, +3,500 Thân Pháp, +30% Né Tránh và miễn nhiễm toàn bộ hiệu ứng khống chế.',
    stats: {
      combatPower: 7500000,
      speedBonusFlat: 3500,
      dodgeBonus: 30
    }
  },
  {
    id: 'beast_t9_tank',
    name: 'Thái Sơ Hỗn Độn Huyền Vũ Chí Tôn',
    speciesTitle: 'Chí Tôn Thần Thánh Quy',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'ho_the',
    archetypeName: 'Hộ Thể Ngự Thú',
    description: 'Quy xà hợp thể bất tử bất diệt, thân thể hóa thành một giới bảo vệ chủ nhân trước sức mạnh hủy diệt của lôi kiếp.',
    backstory: 'Tồn tại trước cả khi thiên địa phân định, gánh vác quy tắc sinh tử của vô biên thế giới.',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-400/80 text-fuchsia-200 bg-fuchsia-950/60',
    avatarGradient: 'from-emerald-700 via-fuchsia-800 to-zinc-950',
    elementalAffinity: 'tho',
    innateSkillName: 'Thái Sơ Hỗn Độn Giới',
    innateSkillDesc: 'Bất diệt thần thể, +10,000,000 Khí Huyết, +400,000 DEF và giảm 30% sát thương lôi kiếp thiên phạt.',
    stats: {
      combatPower: 7800000,
      hpBonusFlat: 10000000,
      defBonusPercent: 45
    }
  },
  {
    id: 'beast_t9_luck',
    name: 'Hồng Mông Thần Thụy Kỳ Lân Vương',
    speciesTitle: 'Hồng Mông Đệ Nhất Thụy',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'tam_bao',
    archetypeName: 'Tầm Bảo Thụy Thú',
    description: 'Thụy thú tối cao sinh ra từ khí Hồng Mông sơ khai, mang theo vận mệnh chí tôn ban phát kỳ trân dị bảo ngập tràn.',
    backstory: 'Ấu thú đản sinh tại điểm khởi đầu của càn khôn, tụ hội tất cả phúc duyên của muôn vàn sinh linh.',
    price: 2800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-fuchsia-400/80 text-fuchsia-200 bg-fuchsia-950/60',
    avatarGradient: 'from-amber-400 via-fuchsia-500 to-rose-900',
    elementalAffinity: 'hon_don',
    innateSkillName: 'Hồng Mông Khí Vận Đỉnh',
    innateSkillDesc: 'Phúc duyên vô cực vô biên, +200 Khí Vận vĩnh viễn, khi săn Boss chắc chắn rơi vật phẩm phẩm cấp cao nhất!',
    stats: {
      combatPower: 8200000,
      khiVanBonus: 200,
      dropRateBonusPercent: 50
    }
  }
];

// Map lookup nhanh theo ID
export const BEASTS_SHOP_ITEMS_MAP: Record<string, BeastShopItem> = BEASTS_SHOP_CATALOG.reduce((acc, beast) => {
  acc[beast.id] = beast;
  return acc;
}, {} as Record<string, BeastShopItem>);

// Badge thông tin Archetype của Thần Sủng
export function getBeastArchetypeBadge(archetype: BeastArchetype): {
  icon: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeClass: string;
} {
  switch (archetype) {
    case 'chien_dau':
      return {
        icon: '⚔️',
        label: 'Chiến Đấu Chủ Lực',
        color: 'text-red-400',
        bg: 'bg-red-950/80',
        border: 'border-red-600/50',
        badgeClass: 'bg-red-950/80 text-red-400 border-red-600/50'
      };
    case 'thu_cuoi':
      return {
        icon: '🐎',
        label: 'Thần Hành Tọa Kỵ',
        color: 'text-cyan-400',
        bg: 'bg-cyan-950/80',
        border: 'border-cyan-600/50',
        badgeClass: 'bg-cyan-950/80 text-cyan-400 border-cyan-600/50'
      };
    case 'ho_the':
      return {
        icon: '🛡️',
        label: 'Hộ Thể Ngự Thú',
        color: 'text-amber-400',
        bg: 'bg-amber-950/80',
        border: 'border-amber-600/50',
        badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-600/50'
      };
    case 'tam_bao':
      return {
        icon: '🍀',
        label: 'Tầm Bảo Thụy Thú',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/80',
        border: 'border-emerald-600/50',
        badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-600/50'
      };
    default:
      return {
        icon: '🐾',
        label: 'Linh Thú',
        color: 'text-stone-300',
        bg: 'bg-stone-900/80',
        border: 'border-stone-600/50',
        badgeClass: 'bg-stone-900/80 text-stone-300 border-stone-600/50'
      };
  }
}

// Badge thông tin ngũ hành nguyên tố
export function getBeastElementalBadge(element: BeastShopItem['elementalAffinity']): {
  icon: string;
  label: string;
  badgeClass: string;
} {
  switch (element) {
    case 'kim':
      return { icon: '⚔️', label: 'Hệ Kim', badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-500/40' };
    case 'moc':
      return { icon: '🌿', label: 'Hệ Mộc', badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40' };
    case 'thuy':
      return { icon: '💧', label: 'Hệ Thủy', badgeClass: 'bg-sky-950/70 text-sky-300 border-sky-500/40' };
    case 'hoa':
      return { icon: '🔥', label: 'Hệ Hỏa', badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-500/40' };
    case 'tho':
      return { icon: '⛰️', label: 'Hệ Thổ', badgeClass: 'bg-yellow-950/70 text-yellow-300 border-yellow-600/40' };
    case 'phong_loi':
      return { icon: '⚡', label: 'Phong Lôi', badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-500/40' };
    case 'hon_don':
      return { icon: '🌌', label: 'Hỗn Độn', badgeClass: 'bg-fuchsia-950/70 text-fuchsia-300 border-fuchsia-500/40' };
    default:
      return { icon: '✨', label: 'Vô Thuộc Tính', badgeClass: 'bg-stone-900/70 text-stone-300 border-stone-500/40' };
  }
}

// Chuyển đổi BeastShopItem thành MerchantItem
export function beastShopItemToMerchantItem(item: BeastShopItem): MerchantItem {
  return {
    id: item.id,
    name: item.name,
    category: 'beasts',
    itemType: 'beast' as any,
    quality: item.tier >= 9 ? 'tien_pham' : item.tier >= 7 ? 'cuc_pham' : item.tier >= 5 ? 'tuyet_pham' : item.tier >= 3 ? 'thuong_pham' : 'trung_pham',
    tier: item.tier,
    tierName: item.tierName,
    grade: item.tierName,
    price: item.price,
    stock: 1,
    maxStock: 1,
    oneTimeOnly: true,
    requiredRealmIndex: item.requiredRealmIndex,
    requiredRealmName: item.requiredRealmName,
    description: item.description,
    beastData: item,
    beastArchetype: item.archetype,
    beastTier: item.tier,
    data: {
      beastShopItem: item,
      isBeastShopItem: true,
      archetype: item.archetype,
      archetypeName: item.archetypeName,
      speciesTitle: item.speciesTitle,
      innateSkillName: item.innateSkillName,
      innateSkillDesc: item.innateSkillDesc,
      elementalAffinity: item.elementalAffinity,
      stats: item.stats,
      badgeColor: item.badgeColor,
      avatarGradient: item.avatarGradient
    }
  };
}

export const TIER_BEASTS_MERCHANT_ITEMS: MerchantItem[] = BEASTS_SHOP_CATALOG.map(beastShopItemToMerchantItem);
