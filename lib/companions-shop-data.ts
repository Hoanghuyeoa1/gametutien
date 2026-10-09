// lib/companions-shop-data.ts
import { CompanionShopItem, CompanionArchetype } from './types/companions-shop';
import { MerchantItem } from './types/items';
import { CompanionDefinition } from './types/companions';

export const COMPANIONS_SHOP_CATALOG: CompanionShopItem[] = [
  // ============================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0-10)
  // ============================================
  {
    id: 'comp_t1_songtu',
    name: 'Lâm Uyển Nhi',
    title: 'Thanh Mai Tiểu Nữ',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Nàng vốn là nữ nhi của một linh nông nơi chân núi Thanh Vân, tính tình ngây thơ thiện lương, tâm hướng tiên đạo.',
    backstory: 'Gia đình gặp lôi tai mất mùa linh cốc, Uyển Nhi phải lưu lạc đến Phường Thị tìm cách phụ giúp gia cảnh. Nhìn thấy nàng có căn cơ thanh khiết, thương gia đã giữ nàng lại chờ người hữu duyên kết bái tiên duyên.',
    quote: 'Chỉ cần được đi theo công tử chăm lo việc nhỏ nơi động phủ, Uyển Nhi đã thấy muôn phần mãn nguyện rồi...',
    price: 300,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Tầng 1',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-amber-700 via-stone-600 to-emerald-800',
    avatarIcon: '🌱',
    innatePhysique: 'Phàm Thể Thanh Khiết',
    stats: {
      combatPower: 150,
      tuViBonusPercent: 8,
      favorabilityInitial: 60,
      realmStage: 'Luyện Khí Tầng 3',
      realmIndex: 2,
      specialPerkDescription: 'Gia tăng 8% tốc độ tích lũy tu vi khi tiến hành Song Tu.'
    }
  },
  {
    id: 'comp_t1_hodao',
    name: 'Tiêu Kiếm Hàn',
    title: 'Hộ Kiếm Thiếu Nữ',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Thiếu nữ kiếm khách bước ra từ sơn thôn, lưng mang thiết kiếm, ánh mắt quật cường không sợ hiểm nguy.',
    backstory: 'Gia truyền một pho tàn kiếm quyết, Tiêu Kiếm Hàn một thân một mình du tẩu giang hồ tìm kiếm linh thạch bồi dưỡng bản mệnh kiếm. Vì thiếu lộ phí mà chịu ước thúc tại phường thị.',
    quote: 'Kiếm của ta tuy thô sơ, nhưng tuyệt đối không để bất kỳ kẻ nào mạo phạm đạo hữu nửa bước!',
    price: 350,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Tầng 1',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-zinc-700 via-slate-600 to-sky-900',
    avatarIcon: '🗡️',
    innatePhysique: 'Kiếm Tâm Sơ Thành',
    stats: {
      combatPower: 280,
      tuViBonusPercent: 4,
      favorabilityInitial: 50,
      realmStage: 'Luyện Khí Tầng 4',
      realmIndex: 3,
      specialPerkDescription: 'Gia trì trực tiếp +120 Lực chiến hỗ trợ trong các cuộc giao tranh thực chiến.'
    }
  },
  {
    id: 'comp_t1_craft',
    name: 'Dược Thảo Nhi',
    title: 'Dược Đồng Thất Thế',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Tiểu nha đầu thông tuệ linh thảo, từ nhỏ đã nếm đủ trăm loại cỏ cây, sở hữu khứu giác cỏ cây bẩm sinh.',
    backstory: 'Sư môn luyện đan tiểu phái bị cừu địch san bằng, nàng ôm theo bọc hạt giống linh thảo chạy trốn đến Vạn Bảo Thương Hội mong tìm được nơi nương tựa vững chãi.',
    quote: 'Mùi hương của Ninh Thần Thảo này... ngọn lửa hơi già rồi! Đạo hữu để muội trông lò giúp huynh nhé!',
    price: 280,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Tầng 1',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-emerald-800 via-teal-700 to-lime-900',
    avatarIcon: '🌿',
    innatePhysique: 'Thảo Mộc Linh Cảm',
    stats: {
      combatPower: 120,
      tuViBonusPercent: 5,
      favorabilityInitial: 65,
      realmStage: 'Luyện Khí Tầng 2',
      realmIndex: 1,
      specialPerkDescription: 'Giảm 10% tiêu hao dược liệu Nhất Giai khi luyện đan tại lò Bách Nghệ.'
    }
  },
  {
    id: 'comp_t1_physique',
    name: 'Bạch Tố Tâm',
    title: 'Thanh Linh Chi Thể',
    tier: 1,
    tierName: 'Nhất Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Thanh y như ngọc, khí chất ôn nhu tĩnh lặng, toàn thân tỏa ra làn hương mỏng nhẹ xua tan phiền muộn.',
    backstory: 'Sinh ra mang theo Thanh Linh Chi Thể quý hiếm khiến tà tu dòm ngó, nàng đành giấu mình nương náu chốn huyên náo của Thương Hội chờ đợi bậc quân tử chính đạo giải cứu.',
    quote: 'Hồng trần hỗn loạn, chỉ mong tìm được một bờ vai an định để cùng nhau dòm ngó thiên đạo trường sinh...',
    price: 450,
    requiredRealmIndex: 0,
    requiredRealmName: 'Luyện Khí Tầng 1',
    badgeColor: 'border-stone-500/50 text-stone-300 bg-stone-900/40',
    avatarGradient: 'from-teal-800 via-cyan-700 to-indigo-950',
    avatarIcon: '✨',
    innatePhysique: 'Thanh Linh Chi Thể',
    stats: {
      combatPower: 180,
      tuViBonusPercent: 6,
      favorabilityInitial: 55,
      realmStage: 'Luyện Khí Tầng 5',
      realmIndex: 4,
      specialPerkDescription: 'Thể chất phúc duyên gia trì vĩnh viễn +3 Khí Vận cho nhân vật tu sĩ.',
      permanentPlayerBuff: { khiVan: 3 }
    }
  },

  // ============================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11-15)
  // ============================================
  {
    id: 'comp_t2_songtu',
    name: 'Tô Mộng Dao',
    title: 'Mộc Linh Nữ Tử',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Khuê tú của dược hương thế gia sa sút, dáng vẻ thanh tú yêu kiều, cử chỉ đoan trang hiểu lễ nghĩa.',
    backstory: 'Gia tộc phá sản vì món nợ linh thạch khổng lồ, nàng chấp nhận ký thác thân mình vào khế ước thương hội để giữ lại từ đường tổ tiên.',
    quote: 'Mộc khí ôn hòa dưỡng tâm mạch, Mộng Dao nguyện mang chút công phu gia truyền bồi đắp chân nguyên cho chàng.',
    price: 3500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-emerald-700 via-teal-600 to-green-900',
    avatarIcon: '🌸',
    innatePhysique: 'Thanh Mộc Đạo Thể',
    stats: {
      combatPower: 800,
      tuViBonusPercent: 15,
      favorabilityInitial: 55,
      realmStage: 'Trúc Cơ Sơ Kỳ',
      realmIndex: 11,
      specialPerkDescription: 'Gia tăng 15% tốc độ tích lũy tu vi khi tiến hành Song Tu.'
    }
  },
  {
    id: 'comp_t2_hodao',
    name: 'Lục Y Kiếm Tiên',
    title: 'Thanh Trúc Kiếm Cơ',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Thanh Trúc phong chủ truyền nhân, thanh y phiêu dật, kiếm pháp sắc bén tựa ngọn gió lướt qua rừng trúc.',
    backstory: 'Trong một chuyến trảm yêu gặp biến cố lạc mất đồng môn, linh kiếm bị hao tổn nguyên khí cần lượng lớn linh thạch phục hồi.',
    quote: 'Trúc gãy cốt không gãy! Có thanh kiếm này hộ thân, yêu ma quỷ quái đừng hòng chạm tới đạo hữu!',
    price: 4000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-green-700 via-lime-600 to-emerald-950',
    avatarIcon: '🎋',
    innatePhysique: 'Thanh Trúc Kiếm Ý',
    stats: {
      combatPower: 1200,
      tuViBonusPercent: 8,
      favorabilityInitial: 50,
      realmStage: 'Trúc Cơ Trung Kỳ',
      realmIndex: 12,
      specialPerkDescription: 'Hỗ trợ +500 Lực chiến thực tế và tạo khiên chắn tương đương 10% HP khi vào trận.'
    }
  },
  {
    id: 'comp_t2_craft',
    name: 'Chu Đan Đồng',
    title: 'Luyện Khí Nữ Đồ',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Nữ đệ tử tinh quái xuất thân từ Hỏa Luyện Cốc, nắm giữ bí quyết khống chế linh hỏa gia truyền cực kỳ tinh diệu.',
    backstory: 'Vì tranh cãi học thuật với trưởng lão mà giận dỗi trốn cốc xuất môn, lưu lạc đến phường thị thách đấu luyện đan và chịu nhận khế ước cùng tri kỷ.',
    quote: 'Lửa tam muội chân hỏa này mà dùng nấu nước pha trà thì phí lắm, để muội giúp huynh đúc đan dược Trúc Cơ cực phẩm nhé!',
    price: 3200,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-amber-600 via-red-600 to-orange-950',
    avatarIcon: '🔥',
    innatePhysique: 'Đan Hỏa Tiên Thiên',
    stats: {
      combatPower: 650,
      tuViBonusPercent: 7,
      favorabilityInitial: 60,
      realmStage: 'Trúc Cơ Sơ Kỳ',
      realmIndex: 11,
      specialPerkDescription: 'Tăng 8% tỷ lệ luyện chế thành công đan dược Trúc Cơ phẩm cấp Thượng Thừa.'
    }
  },
  {
    id: 'comp_t2_physique',
    name: 'Hàn Ngọc Trinh',
    title: 'Băng Cơ Ngọc Cốt',
    tier: 2,
    tierName: 'Nhị Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Làn da trắng muốt tựa tuyết đầu mùa, hàn khí lượn lờ quanh đầu ngón tay, phong thái kiêu sa thanh nhã khó chạm tới.',
    backstory: 'Bẩm sinh dị thể băng cơ khiến nàng không thể tiếp cận lửa phàm, bị thương nhân phường thị xem như bảo vật trưng bày tại tầng hai thương quán.',
    quote: 'Chạm vào ta... chàng không thấy buốt lạnh sao? Ánh mắt ấm áp của chàng... là lần đầu tiên ta cảm nhận được.',
    price: 5000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-600/50 text-emerald-300 bg-emerald-950/40',
    avatarGradient: 'from-cyan-600 via-sky-500 to-blue-950',
    avatarIcon: '❄️',
    innatePhysique: 'Băng Cơ Ngọc Cốt',
    stats: {
      combatPower: 950,
      tuViBonusPercent: 10,
      favorabilityInitial: 50,
      realmStage: 'Trúc Cơ Hậu Kỳ',
      realmIndex: 14,
      specialPerkDescription: 'Băng Cơ hộ thể gia tăng 5% Kháng Ngũ Hành toàn diện và +4 Khí Vận vĩnh viễn.',
      permanentPlayerBuff: { khiVan: 4 }
    }
  },

  // ============================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16-20)
  // ============================================
  {
    id: 'comp_t3_songtu',
    name: 'Hồng Yêu Yêu',
    title: 'Xích Luyện Ma Nữ',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Hồng y rực rỡ tựa ngọn lửa thiêu đốt, dung mạo diễm lệ ma mị, nụ cười nửa miệng khiến người đối diện vừa say vừa sợ.',
    backstory: 'Ma Tông Thánh Nữ bị kẻ phản bội hạ độc phong ấn đan điền, lưu lạc ngụy trang thân phận ẩn mình trong Vạn Bảo Thương Hội chờ ngày báo thù.',
    quote: 'Tiểu đạo sĩ ngây thơ... dám cùng ma nữ như ta song tu, không sợ ta hút cạn chân dương của chàng sao?',
    price: 35000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-rose-700 via-red-600 to-pink-950',
    avatarIcon: '💋',
    innatePhysique: 'Xích Huyết Ma Thể',
    stats: {
      combatPower: 3500,
      tuViBonusPercent: 22,
      favorabilityInitial: 50,
      realmStage: 'Kim Đan Sơ Kỳ',
      realmIndex: 16,
      specialPerkDescription: 'Kích phát cuồng nhiệt song tu tăng 22% Tu Vi và giảm 10% tỷ lệ tẩu hỏa nhập ma.'
    }
  },
  {
    id: 'comp_t3_hodao',
    name: 'Triệu Khuynh Thành',
    title: 'Chấn Thiên Thương Nữ',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Nữ tướng quân sa trường tu tiên, chiến bào ngân giáp lấp lánh, một ngọn thương bạc quét ngang ngàn quân.',
    backstory: 'Sau khi vương triều phàm tục diệt vong, nàng dấn thân tiên lộ tìm kiếm sức mạnh trùng hưng cơ nghiệp, sẵn sàng ký khế ước chiến đấu cùng bậc hùng chủ.',
    quote: 'Thương này đâm ra, không lùi không tránh! Phía sau ta là đạo hữu, phía trước ta là tro tàn kẻ địch!',
    price: 40000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-blue-700 via-indigo-600 to-slate-950',
    avatarIcon: '🛡️',
    innatePhysique: 'Phá Quân Chiến Thể',
    stats: {
      combatPower: 5500,
      tuViBonusPercent: 10,
      favorabilityInitial: 45,
      realmStage: 'Kim Đan Trung Kỳ',
      realmIndex: 17,
      specialPerkDescription: 'Cung cấp +2,500 Lực chiến thực chiến và giảm 12% Giáp của đối thủ trong giao tranh.'
    }
  },
  {
    id: 'comp_t3_craft',
    name: 'Thẩm Mặc Cơ',
    title: 'Trận Đồ Nữ Sư',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Thanh tú nho nhã, tay áo giấu la bàn cửu cung bát quái, tính cách trầm tĩnh suy tư mọi sự việc thấu đáo.',
    backstory: 'Đại sư trận pháp nổi danh của Ngũ Hành Phường, vì muốn nghiên cứu tàn trận thượng cổ mà cần nguồn tài trợ linh thạch khổng lồ từ chủ nhân.',
    quote: 'Trời đất là trận, cỏ cây là cờ. Đi cùng đạo hữu, từng bước chân muội đều đã tính toán thiên cơ chu toàn.',
    price: 32000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-violet-700 via-purple-600 to-indigo-950',
    avatarIcon: '🌀',
    innatePhysique: 'Bát Quái Diệu Đồng',
    stats: {
      combatPower: 3000,
      tuViBonusPercent: 12,
      favorabilityInitial: 55,
      realmStage: 'Kim Đan Sơ Kỳ',
      realmIndex: 16,
      specialPerkDescription: 'Tăng 15% hiệu suất tụ linh của Trận Bàn trong Động Phủ và kéo dài thời gian hộ trận.'
    }
  },
  {
    id: 'comp_t3_physique',
    name: 'Liễu Nhược Tuyên',
    title: 'Thuần Âm Chi Thể',
    tier: 3,
    tierName: 'Tam Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Tựa như hoa lan e ấp trong thung lũng sâu, thân hình mảnh mai uyển chuyển, mang theo luồng nguyên âm tinh khiết nhất trần gian.',
    backstory: 'Thuần Âm Lô Đỉnh thượng thừa từng bị hắc thị định giá trên trời, may nhờ thương nhân có lương tri giữ lại trong khu bảo hộ chờ người chính đạo chuộc thân.',
    quote: 'Nếu chàng cứu muội thoát khỏi kiếp lô đỉnh trớ trêu này... cả đời này Tuyên Nhi nguyện dâng trọn nguyên âm cho chàng.',
    price: 55000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-sky-600/50 text-sky-300 bg-sky-950/40',
    avatarGradient: 'from-pink-700 via-rose-600 to-purple-950',
    avatarIcon: '💎',
    innatePhysique: 'Thuần Âm Chi Thể',
    stats: {
      combatPower: 4000,
      tuViBonusPercent: 18,
      favorabilityInitial: 50,
      realmStage: 'Kim Đan Hậu Kỳ',
      realmIndex: 19,
      specialPerkDescription: 'Thuần Âm khai mở gia tăng vĩnh viễn +10 Ngộ Tính và +8 Khí Vận cho nhân vật tu sĩ.',
      permanentPlayerBuff: { ngoTinh: 10, khiVan: 8 }
    }
  },

  // ============================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21-25)
  // ============================================
  {
    id: 'comp_t4_songtu',
    name: 'Nam Cung Nguyệt',
    title: 'Thái Âm Thần Nữ',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Tông môn Thái Thượng Trưởng Lão đọa lạc, khí chất tôn quý siêu phàm, thần thái lạnh lùng mà ánh mắt chất chứa bi thương.',
    backstory: 'Đột phá Hóa Thần thất bại bị tâm ma cắn trả, đành mượn danh nghĩa Tiên Duyên Khế Ước tại thương hội tìm kiếm bậc kỳ tài có chân dương thuần khiết song tu hóa giải.',
    quote: 'Trời trăng xoay vần, vạn cổ vắng lặng... Có chàng bên cạnh, tâm ma nghìn năm của bản tọa dường như đã tan biến.',
    price: 250000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-purple-800 via-indigo-700 to-slate-950',
    avatarIcon: '🌙',
    innatePhysique: 'Thái Âm Tiên Mạch',
    stats: {
      combatPower: 18000,
      tuViBonusPercent: 30,
      favorabilityInitial: 50,
      realmStage: 'Nguyên Anh Sơ Kỳ',
      realmIndex: 21,
      specialPerkDescription: 'Gia tăng 30% Tu vi Song Tu và thanh tẩy 100% Tâm Ma sinh ra trong quá trình bế quan.'
    }
  },
  {
    id: 'comp_t4_hodao',
    name: 'Kiếm Si Mộ Tuyết',
    title: 'Cửu U Kiếm Tôn',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Một đời vì kiếm cuồng si, trảm tình đoạn dục, hắc y kiếm quyết phát ra tiếng ngâm lạnh lẽo thấu tận cửu u.',
    backstory: 'Để cầu đắc Kiếm Ý Cực Hạn, nàng chấp nhận phong ấn ký ức ký khế ước hộ đạo cùng bậc đại năng, dùng máu tươi đối thủ tôi luyện kiếm đạo.',
    quote: 'Trước mắt ta chỉ có kiếm, sau lưng ta chỉ có chàng. Chém hết chư thiên địch, chỉ cầu một nụ cười của tri kỷ.',
    price: 300000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-slate-800 via-zinc-700 to-black',
    avatarIcon: '⚔️',
    innatePhysique: 'Cửu U Kiếm Cốt',
    stats: {
      combatPower: 26000,
      tuViBonusPercent: 12,
      favorabilityInitial: 40,
      realmStage: 'Nguyên Anh Trung Kỳ',
      realmIndex: 22,
      specialPerkDescription: 'Hỗ trợ +12,000 Lực chiến và kích hoạt Kiếm Khí Hộ Thể phản lại 15% sát thương nhận vào.'
    }
  },
  {
    id: 'comp_t4_craft',
    name: 'Đan Hà Tiên Tử',
    title: 'Nguyên Anh Đan Sư',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Bậc thầy luyện đan lừng danh trung nguyên, dung mạo đoan trang thanh tú, thoang thoảng hương thơm đan dược nghìn năm.',
    backstory: 'Vì tranh chấp đỉnh cao Đan Vương Hội mà bị hãm hại tịch thu toàn bộ gia sản, nàng nhận lời kết giao để tìm kiếm cơ hội chấn hưng Đan Phái.',
    quote: 'Lò này đúc thiên địa, khói mây chứa huyền cơ. Đạo hữu cần thần đan gì, Đan Hà quyết không phụ thác!',
    price: 240000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-amber-700 via-orange-600 to-rose-950',
    avatarIcon: '⚗️',
    innatePhysique: 'Tử Phủ Đan Tâm',
    stats: {
      combatPower: 15000,
      tuViBonusPercent: 15,
      favorabilityInitial: 55,
      realmStage: 'Nguyên Anh Sơ Kỳ',
      realmIndex: 21,
      specialPerkDescription: 'Tăng 15% tỷ lệ xuất hiện đan dược Cực Phẩm Giai 4 và tiết kiệm 12% thảo dược quý.'
    }
  },
  {
    id: 'comp_t4_physique',
    name: 'Bạch Thiển Thiển',
    title: 'Cửu Vĩ Thiên Hồ',
    tier: 4,
    tierName: 'Tứ Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Thiên hồ chín đuôi hóa hình lưu lạc nhân gian, dung nhan diễm tuyệt vô song, nụ cười khuynh quốc khuynh thành.',
    backstory: 'Bị thợ săn yêu thú vây bắt trọng thương rồi mang bán đấu giá, ánh mắt cầu cứu tuyệt vọng của nàng đã động lòng bao bậc tu sĩ.',
    quote: 'Ơn cứu mạng của chàng... Thiển Thiển nguyện lấy thân báo đáp, đời đời kiếp kiếp làm linh hồ quấn quýt bên chàng.',
    price: 420000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-purple-600/50 text-purple-300 bg-purple-950/40',
    avatarGradient: 'from-pink-600 via-rose-500 to-amber-950',
    avatarIcon: '🦊',
    innatePhysique: 'Cửu Vĩ Thiên Hồ Thể',
    stats: {
      combatPower: 20000,
      tuViBonusPercent: 25,
      favorabilityInitial: 60,
      realmStage: 'Nguyên Anh Hậu Kỳ',
      realmIndex: 24,
      specialPerkDescription: 'Tăng 30% Hảo Cảm nhận được từ mọi nguồn, +12 Khí Vận và gia tăng vượt bậc tỷ lệ sinh con mang Thiên Linh Căn.',
      permanentPlayerBuff: { khiVan: 12 }
    }
  },

  // ============================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26-30)
  // ============================================
  {
    id: 'comp_t5_songtu',
    name: 'Phượng Tê Hoàng',
    title: 'Thiên Triều Trưởng Công Chúa',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Đế nữ vương triều sụp đổ, khoác hoàng bào rách rưới nhưng phong thái hoàng gia bất khuất, huyết mạch Phượng Hoàng bốc cháy kiêu hãnh.',
    backstory: 'Đại Hán Thần Triều bị ma đạo lật đổ, nàng đem theo quốc bảo cuối cùng lưu lạc tới biên ải, tìm kiếm bậc chân long thiên tử để khôi phục sơn hà.',
    quote: 'Bản cung dẫu mất giang sơn, nhưng cốt cách Phượng Hoàng không bao giờ cúi đầu! Chàng... chính là chân long của ta.',
    price: 1800000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-amber-600 via-yellow-500 to-red-950',
    avatarIcon: '👑',
    innatePhysique: 'Chân Phượng Hoàng Huyết',
    stats: {
      combatPower: 75000,
      tuViBonusPercent: 40,
      favorabilityInitial: 45,
      realmStage: 'Hóa Thần Sơ Kỳ',
      realmIndex: 26,
      specialPerkDescription: 'Chân Phượng dục hỏa tăng 40% Tu vi Song Tu và khuếch đại vĩnh viễn lượng Chân Nguyên tối đa.'
    }
  },
  {
    id: 'comp_t5_hodao',
    name: 'Lãnh Nguyệt Băng Cơ',
    title: 'Hóa Thần Pháp Tướng',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Nữ đế Hàn Băng Cổ Giới, một tay nâng vầng trăng khuyết, chân đạp sương lạnh vạn dặm, uy áp đè bẹp chúng sinh.',
    backstory: 'Bản thể bị vây công trọng thương phải phân giải pháp tướng tá túc nơi trần thế, tìm kiếm hộ đạo hữu minh kết ước cộng sinh.',
    quote: 'Dưới vầng trăng này, vạn vật đều phải đóng băng. Kẻ nào dám cản đường đạo lữ của ta, lập tức tan thành bụi tuyết!',
    price: 2200000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-cyan-500 via-blue-600 to-indigo-950',
    avatarIcon: '❄️',
    innatePhysique: 'Hàn Nguyệt Pháp Tướng',
    stats: {
      combatPower: 110000,
      tuViBonusPercent: 18,
      favorabilityInitial: 40,
      realmStage: 'Hóa Thần Trung Kỳ',
      realmIndex: 27,
      specialPerkDescription: 'Cung cấp +50,000 Lực chiến và đóng băng phong ấn kẻ địch 1 hiệp khi mở đầu trận đấu.'
    }
  },
  {
    id: 'comp_t5_craft',
    name: 'Vân Diệu Y Sư',
    title: 'Diệu Thủ Dược Thần',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Y thuật tuyệt đỉnh tam giới, tay cầm kim châm cứu nhân độ thế, nụ cười hiền hậu xoa dịu mọi vết thương đạo thể.',
    backstory: 'Trải qua ngàn năm cứu độ sinh linh, nàng tìm kiếm một người đạo lữ có chí hướng đồng hành bảo vệ thái bình thương sinh.',
    quote: 'Chỉ cần một hơi thở chưa tắt, Vân Diệu quyết giật lại tính mạng chàng từ tay Diêm Vương!',
    price: 1600000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-teal-600 via-emerald-500 to-cyan-950',
    avatarIcon: '💉',
    innatePhysique: 'Hồi Xuân Tiên Thể',
    stats: {
      combatPower: 65000,
      tuViBonusPercent: 20,
      favorabilityInitial: 55,
      realmStage: 'Hóa Thần Sơ Kỳ',
      realmIndex: 26,
      specialPerkDescription: 'Tự động hồi phục 20% Khí Huyết tối đa sau mỗi trận chiến và giảm 50% độc tính đan dược.'
    }
  },
  {
    id: 'comp_t5_physique',
    name: 'Lạc Thần Nữ',
    title: 'Hỗn Nguyên Thủy Thể',
    tier: 5,
    tierName: 'Ngũ Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Thần nữ sông Lạc bước ra từ trong tranh vẽ, làn nước vây quanh mềm mại uyển chuyển, hội tụ linh khí của trăm con sông đổ về biển lớn.',
    backstory: 'Nữ thần sông cổ đại thức tỉnh sau ngàn năm say ngủ, chốn nhân gian vật đổi sao dời, nàng hữu duyên dừng bước nơi Vạn Bảo Lầu.',
    quote: 'Nước chảy đá mòn, duyên phận kiếp này như dòng sông đổ về biển cả, không bao giờ chia cắt.',
    price: 3000000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    avatarGradient: 'from-sky-600 via-blue-500 to-indigo-950',
    avatarIcon: '🌊',
    innatePhysique: 'Hỗn Nguyên Thủy Thể',
    stats: {
      combatPower: 85000,
      tuViBonusPercent: 28,
      favorabilityInitial: 50,
      realmStage: 'Hóa Thần Hậu Kỳ',
      realmIndex: 29,
      specialPerkDescription: 'Hỗn Nguyên Thủy Thể gia tăng vĩnh viễn +20 Căn Cốt và +15 Ngộ Tính cho nhân vật tu sĩ.',
      permanentPlayerBuff: { canCot: 20, ngoTinh: 15 }
    }
  },

  // ============================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31-35)
  // ============================================
  {
    id: 'comp_t6_songtu',
    name: 'Dạ Mị Cơ',
    title: 'Hư Không Du Hiệp',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Độc hành hiệp khách tự do xuyên toái các giới diện hư không, phong thái bí ẩn, trang phục bó sát huyền bí mê hoặc.',
    backstory: 'Vì tò mò cơ chế Vạn Bảo Thương Hội liên thông cửu giới mà ghé lại, trúng tiếng sét ái tình với bậc tu giả có linh hồn khoáng đạt.',
    quote: 'Hư không rộng lớn không biên giới, nhưng tim muội từ nay chỉ có chỗ chứa một mình bóng hình chàng.',
    price: 12000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-purple-900 via-fuchsia-800 to-black',
    avatarIcon: '🌌',
    innatePhysique: 'Hư Không Na Di Thể',
    stats: {
      combatPower: 280000,
      tuViBonusPercent: 50,
      favorabilityInitial: 45,
      realmStage: 'Luyện Hư Sơ Kỳ',
      realmIndex: 31,
      specialPerkDescription: 'Xuyên toa hư không gia tăng 50% Tu vi Song Tu và tăng 25% Thân Pháp Tốc Độ.'
    }
  },
  {
    id: 'comp_t6_hodao',
    name: 'Chân Vũ Nữ Kiếm Thánh',
    title: 'Quy Chân Kiếm Ý',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Bậc kiếm thánh phản phác quy chân, kiếm không vỏ, kiếm ý hòa cùng trời đất, một chiêu chém rách hư không vạn dặm.',
    backstory: 'Đạt tới bình cảnh kiếm đạo, nàng hạ phàm tìm kiếm bạn đồng tu cùng ngộ đạo cực cảnh, ký kết khế ước hộ đạo vô song.',
    quote: 'Kiếm của ta đã nhìn thấy chân lý hư vô, nhưng ánh mắt chàng lại thắp sáng kiếm tâm của ta một lần nữa!',
    price: 15000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-zinc-800 via-neutral-700 to-indigo-950',
    avatarIcon: '⚡',
    innatePhysique: 'Quy Chân Kiếm Phách',
    stats: {
      combatPower: 420000,
      tuViBonusPercent: 20,
      favorabilityInitial: 40,
      realmStage: 'Luyện Hư Trung Kỳ',
      realmIndex: 32,
      specialPerkDescription: 'Cung cấp +180,000 Lực chiến thực tế, mỗi đòn đánh chém rách hư không gây thêm sát thương chuẩn.'
    }
  },
  {
    id: 'comp_t6_craft',
    name: 'Thiên Cơ Khôi Nữ',
    title: 'Khôi Lỗi Tiên Sư',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Nữ thiên tài cơ quan thuật nắm giữ Thiên Cơ Thần Quyển, xung quanh luôn có bầy khôi lỗi tinh xảo tự động bay lượn thao tác.',
    backstory: 'Chế tạo khôi lỗi cấp Tiên Binh tiêu tốn hàng ức linh thạch, nàng cần một bờ vai đại gia tài chính để hiện thực hóa ước mơ cơ xảo thần thông.',
    quote: 'Chàng cứ việc an tâm bế quan, mọi việc thu hoạch linh điền, trông nom động phủ đã có đàn khôi lỗi của muội lo liệu!',
    price: 10000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-amber-700 via-stone-600 to-slate-900',
    avatarIcon: '⚙️',
    innatePhysique: 'Thiên Cơ Linh Lung Khiếu',
    stats: {
      combatPower: 240000,
      tuViBonusPercent: 22,
      favorabilityInitial: 50,
      realmStage: 'Luyện Hư Sơ Kỳ',
      realmIndex: 31,
      specialPerkDescription: 'Triệu hoán khôi lỗi tự động thu hoạch và gia tăng 30% sản lượng tài nguyên trong Động Thiên Phúc Địa.'
    }
  },
  {
    id: 'comp_t6_physique',
    name: 'Tử Tiêu Thần Cơ',
    title: 'Hư Không Linh Thể',
    tier: 6,
    tierName: 'Lục Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Tử y tha thướt, quanh thân lượn lờ đạo vận tím thẫm của Cực Bắc Tiên Thiên, dường như có thể biến mất bất kỳ lúc nào.',
    backstory: 'Sinh ra trong khe nứt hư không, nàng không chịu trói buộc của luật nhân quả thế tục, chỉ dừng lại trước người có định mệnh nghịch thiên.',
    quote: 'Định mệnh nói chúng ta sẽ gặp nhau... Tử Tiêu nguyện dùng thân thể hư vô này chắn cho chàng một kiếp nạn chí tử.',
    price: 20000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    avatarGradient: 'from-purple-700 via-fuchsia-600 to-indigo-950',
    avatarIcon: '🔮',
    innatePhysique: 'Hư Không Vô Tướng Thể',
    stats: {
      combatPower: 320000,
      tuViBonusPercent: 35,
      favorabilityInitial: 45,
      realmStage: 'Luyện Hư Hậu Kỳ',
      realmIndex: 34,
      specialPerkDescription: 'Hư Không Thể giúp né tránh 100% đòn chí tử đầu tiên trong mỗi trận đấu và +20 Khí Vận vĩnh viễn.',
      permanentPlayerBuff: { khiVan: 20 }
    }
  },

  // ============================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36-40)
  // ============================================
  {
    id: 'comp_t7_songtu',
    name: 'Ngao Linh Nhi',
    title: 'Long Tộc Chân Công Chúa',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Tiểu công chúa Chân Long Thần Tộc, trên đầu mang đôi sừng rồng nhỏ xinh lấp lánh kim quang, tính tình kiêu kỳ mà đáng yêu.',
    backstory: 'Trốn phụ vương ra ngoài ngao du tam giới, mê mẩn phong cảnh và ẩm thực nhân gian, nàng sẵn lòng kết duyên cùng tu sĩ có long khí bất phàm.',
    quote: 'Long châu của bản công chúa quý giá lắm đó! Cho chàng cùng tu luyện một đêm, chàng phải dắt ta đi ăn hết đồ ngon đấy nhé!',
    price: 60000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/40',
    avatarGradient: 'from-yellow-600 via-amber-500 to-blue-950',
    avatarIcon: '🐉',
    innatePhysique: 'Thái Cổ Chân Long Thể',
    stats: {
      combatPower: 1200000,
      tuViBonusPercent: 65,
      favorabilityInitial: 45,
      realmStage: 'Hợp Thể Sơ Kỳ',
      realmIndex: 36,
      specialPerkDescription: 'Long huyết tôi luyện gia tăng 65% Tu Vi Song Tu và tăng vĩnh viễn 15% Sức Mạnh Thể Phách.'
    }
  },
  {
    id: 'comp_t7_hodao',
    name: 'Thần Hoàng Nữ Đế',
    title: 'Bất Tử Thần Hỏa',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Hỏa Phượng hóa thân thành đế, toàn thân bốc cháy ngọn lửa Niết Bàn bất tử, ánh mắt uy nghiêm nhiếp phục cửu thiên thập địa.',
    backstory: 'Tái sinh sau trận đại chiến diệt thế, nàng tìm kiếm minh hữu xứng đáng cùng nàng xông pha Cổ Chiến Trường thượng giới.',
    quote: 'Lửa Phượng Hoàng thiêu rụi cựu thế, thắp sáng tân triều. Chàng ngã xuống, ta lấy tính mạng Niết Bàn kéo chàng sống lại!',
    price: 80000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/40',
    avatarGradient: 'from-red-600 via-orange-500 to-amber-950',
    avatarIcon: '🔥',
    innatePhysique: 'Niết Bàn Thần Hoàng Thể',
    stats: {
      combatPower: 1800000,
      tuViBonusPercent: 25,
      favorabilityInitial: 40,
      realmStage: 'Hợp Thể Trung Kỳ',
      realmIndex: 37,
      specialPerkDescription: 'Hỗ trợ +800,000 Lực chiến; khi người chơi tử trận lập tức hồi sinh với 30% HP (1 lần mỗi trận).'
    }
  },
  {
    id: 'comp_t7_craft',
    name: 'Vạn Bảo Nữ Thần Tôn',
    title: 'Phường Thị Chi Chủ',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Thần bí thương nhân đứng đầu chuỗi thương hội liên thứ nguyên, tay cầm Kim Tiên La Bàn, một lời định giá ngàn vạn linh mạch.',
    backstory: 'Nhìn trúng thiên mệnh vô lượng của người chơi, nàng quyết định đích thân hạ phàm đầu tư khế ước trọn đời cùng bậc kỳ tài vạn cổ.',
    quote: 'Cả thương hội này là của ta, và ta... từ nay là của chàng. Chiết khấu hay quà tặng, chỉ cần chàng thích là được!',
    price: 50000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/40',
    avatarGradient: 'from-amber-500 via-yellow-400 to-stone-900',
    avatarIcon: '💰',
    innatePhysique: 'Tụ Bảo Tiên Đồng Thể',
    stats: {
      combatPower: 950000,
      tuViBonusPercent: 30,
      favorabilityInitial: 55,
      realmStage: 'Hợp Thể Sơ Kỳ',
      realmIndex: 36,
      specialPerkDescription: 'Tự động giảm giá (Chiết Khấu) thêm 15% cho toàn bộ hàng hóa trong Vạn Bảo Thương Hội.'
    }
  },
  {
    id: 'comp_t7_physique',
    name: 'Huyền Minh U Hậu',
    title: 'Thái Cực Bất Diệt Cốt',
    tier: 7,
    tierName: 'Thất Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'U hậu trấn giữ Minh Giới Cửu U, thần thái lạnh băng thê lương, sở hữu Thái Cực Cốt dung hòa âm dương lưỡng cực.',
    backstory: 'Trấn thủ cõi âm ngàn vạn năm đơn độc, nàng khát khao hơi ấm trần gian và tìm thấy ngọn lửa sinh mệnh nơi nhân vật chính.',
    quote: 'U minh vạn dặm không ánh sáng, chỉ có chàng là ngọn đèn duy nhất dẫn lối linh hồn ta.',
    price: 95000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500/50 text-red-300 bg-red-950/40',
    avatarGradient: 'from-indigo-900 via-slate-800 to-black',
    avatarIcon: '☯️',
    innatePhysique: 'Thái Cực Bất Diệt Cốt',
    stats: {
      combatPower: 1400000,
      tuViBonusPercent: 40,
      favorabilityInitial: 45,
      realmStage: 'Hợp Thể Hậu Kỳ',
      realmIndex: 39,
      specialPerkDescription: 'Thái Cực Cốt gia trì +50 Toàn Thuộc Tính và giảm vĩnh viễn 15% toàn bộ sát thương nhận vào.',
      permanentPlayerBuff: { canCot: 50, ngoTinh: 50, khiVan: 50 }
    }
  },

  // ============================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41-45)
  // ============================================
  {
    id: 'comp_t8_songtu',
    name: 'Đế Lạc Hồng Nhan',
    title: 'Thái Thượng Đạo Nữ',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Thái Thượng Đạo Tông duy nhất còn sót lại sau kỷ nguyên Đế Lạc, thần sắc thanh tịnh vô vi, thấu suốt đại đạo tuần hoàn.',
    backstory: 'Chờ đợi triệu năm để tìm lại mảnh hồn thất lạc của đạo lữ tiền kiếp, nhận ra ấn ký luân hồi nơi linh hồn người chơi.',
    quote: 'Triệu năm luân hồi, đế lạc thành tro... Cuối cùng ta cũng tìm thấy chàng giữa muôn trượng hồng trần.',
    price: 350000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/40',
    avatarGradient: 'from-fuchsia-700 via-purple-600 to-slate-950',
    avatarIcon: '🪷',
    innatePhysique: 'Thái Thượng Vong Tình Thể',
    stats: {
      combatPower: 5500000,
      tuViBonusPercent: 80,
      favorabilityInitial: 45,
      realmStage: 'Đại Thừa Sơ Kỳ',
      realmIndex: 41,
      specialPerkDescription: 'Đại Đạo Cộng Minh gia tăng 80% Tu Vi Song Tu và ban thưởng Tiên Thiên Khí tăng tốc độ đột phá.'
    }
  },
  {
    id: 'comp_t8_hodao',
    name: 'Vạn Kiếp Kiếm Tôn',
    title: 'Kiếm Đạo Độc Tôn',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Nữ tôn vô địch kiếm đạo, một kiếm định càn khôn, từng một mình chém vỡ chín tầng thiên lôi kiếp nạn.',
    backstory: 'Kiếm đạo đạt tới vô địch nên tịch mịch cô đơn, nàng nguyện làm kiếm trong tay người mình kính phục để cùng phá vỡ giới hạn thiên đạo.',
    quote: 'Thiên đạo muốn diệt chàng, ta chém thiên đạo! Thần phật cản bước chàng, ta tru diệt thần phật!',
    price: 450000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/40',
    avatarGradient: 'from-slate-700 via-zinc-600 to-indigo-950',
    avatarIcon: '🗡️',
    innatePhysique: 'Vạn Kiếp Kiếm Tôn Thể',
    stats: {
      combatPower: 8000000,
      tuViBonusPercent: 30,
      favorabilityInitial: 40,
      realmStage: 'Đại Thừa Trung Kỳ',
      realmIndex: 42,
      specialPerkDescription: 'Cung cấp +3,500,000 Lực chiến; mỗi đòn đánh có 30% kích hoạt Kiếm Khí Trảm Hồn bỏ qua phòng ngự.'
    }
  },
  {
    id: 'comp_t8_craft',
    name: 'Bổ Thiên Thánh Nữ',
    title: 'Hồng Mông Dược Đế',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Nắm giữ bí thuật luyện đá vá trời, sở hữu linh hỏa Hồng Mông nguyên thủy, luyện đan hóa thành linh đan sống biết bay biết nói.',
    backstory: 'Vì vá lại vết rách không gian bảo vệ tam giới mà hao tổn tiên lực, dừng chân nơi thương hội điều dưỡng và tìm kiếm tri âm.',
    quote: 'Trời rách ta còn vá được, huống chi chút đan độc hay thương tật nhỏ nhoi trên đạo thể của chàng?',
    price: 300000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/40',
    avatarGradient: 'from-emerald-600 via-cyan-500 to-teal-950',
    avatarIcon: '🪨',
    innatePhysique: 'Bổ Thiên Thần Thể',
    stats: {
      combatPower: 4500000,
      tuViBonusPercent: 35,
      favorabilityInitial: 50,
      realmStage: 'Đại Thừa Sơ Kỳ',
      realmIndex: 41,
      specialPerkDescription: 'Tự động thanh tẩy 100% Đan Độc mỗi khi chuyển cảnh giới và tăng 50% hiệu quả đan dược.'
    }
  },
  {
    id: 'comp_t8_physique',
    name: 'Vô Thượng Nữ Đế',
    title: 'Hỗn Độn Tiên Cốt',
    tier: 8,
    tierName: 'Bát Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Thống trị cửu thiên vạn vực, dung nhan uy nghiêm che khuất bởi vầng sáng Tử Khí Đông Lai vạn trượng, đế uy cái thế vô song.',
    backstory: 'Tìm kiếm người bạn đời ngang tầm trí tuệ và dũng khí để cùng nàng kiến tạo tân thiên đình trường tồn bất diệt.',
    quote: 'Trẫm làm chủ thiên hạ vạn năm, nhưng ngôi hoàng hậu bên cạnh trẫm... xưa nay chỉ dành riêng cho chàng.',
    price: 600000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-500/50 text-fuchsia-300 bg-fuchsia-950/40',
    avatarGradient: 'from-purple-600 via-amber-500 to-rose-950',
    avatarIcon: '👑',
    innatePhysique: 'Hỗn Độn Tiên Cốt',
    stats: {
      combatPower: 6800000,
      tuViBonusPercent: 50,
      favorabilityInitial: 45,
      realmStage: 'Đại Thừa Hậu Kỳ',
      realmIndex: 44,
      specialPerkDescription: 'Kích hoạt Dị Tượng Tử Khí Đông Lai, +100 Khí Vận và con cái sinh ra chắc chắn sở hữu Thánh Thể.',
      permanentPlayerBuff: { khiVan: 100 }
    }
  },

  // ============================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // ============================================
  {
    id: 'comp_t9_songtu',
    name: 'Thái Sơ Tiên Tử',
    title: 'Thượng Giới Trích Tiên',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'song_tu',
    archetypeName: 'Song Tu Trợ Lực',
    description: 'Tiên tử hạ phàm từ Tiên Giới nguyên thủy, thanh thoát thoát tục, mỗi bước chân nở ra đóa sen tiên rực rỡ ngũ sắc.',
    backstory: 'Hạ phàm độ tình kiếp nghìn thu, nàng tìm kiếm mối nhân duyên chân thật nhất giữa biển người để cùng phi thăng tiên vực vĩnh hằng.',
    quote: 'Tiên lộ dẫu dài, tiên đạo dẫu cô độc... chỉ cần tay nắm chặt tay chàng, nơi nào cũng chính là Tiên Giới.',
    price: 2000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-amber-400 via-rose-400 to-indigo-900',
    avatarIcon: '🪷',
    innatePhysique: 'Thái Sơ Tiên Linh Thể',
    stats: {
      combatPower: 25000000,
      tuViBonusPercent: 100,
      favorabilityInitial: 50,
      realmStage: 'Độ Kiếp Kỳ',
      realmIndex: 46,
      specialPerkDescription: 'Tăng 100% Tu Vi Song Tu và ban thưởng Tiên Lực dồi dào gia tăng tỷ lệ độ kiếp thành công.'
    }
  },
  {
    id: 'comp_t9_hodao',
    name: 'Cửu Thiên Huyền Nữ',
    title: 'Chiến Tranh Nữ Thần',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'ho_dao',
    archetypeName: 'Chiến Đấu Hộ Đạo',
    description: 'Thủ hộ chiến thần của Thượng Cổ Thiên Đình, ngự long phi hành, tay cầm Binh Phù Huyền Khí hiệu triệu vạn giới thiên binh.',
    backstory: 'Thức tỉnh sau giấc mộng vạn kiếp để chọn người kế thừa ý chí thiên đình, trao trọn binh quyền và trái tim cho người xứng đáng.',
    quote: 'Thiên binh vạn mã theo lệnh ta! Kẻ nào dám xâm phạm người của ta, thiên hình vạn lục tru diệt cửu tộc!',
    price: 2500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-yellow-500 via-amber-600 to-rose-950',
    avatarIcon: '⚔️',
    innatePhysique: 'Cửu Thiên Chiến Thần Thể',
    stats: {
      combatPower: 35000000,
      tuViBonusPercent: 40,
      favorabilityInitial: 40,
      realmStage: 'Độ Kiếp Kỳ',
      realmIndex: 47,
      specialPerkDescription: 'Hỗ trợ +15,000,000 Lực chiến thực tế và triệu hoán Vạn Cổ Tiên Trận trấn áp mọi kẻ địch.'
    }
  },
  {
    id: 'comp_t9_craft',
    name: 'Tạo Hóa Nữ Oa Hậu Duệ',
    title: 'Vạn Linh Chi Mẫu',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'bach_nghe',
    archetypeName: 'Bách Nghệ Dược Sư',
    description: 'Hậu duệ thánh nhân Tạo Hóa khai thiên lập địa, nắm giữ nguồn sinh mệnh căn nguyên của vũ trụ, sinh cơ bất tận.',
    backstory: 'Đi chu du khắp các cõi giới vun trồng linh căn cội nguồn, chọn người bạn đời có đức độ bao la để gửi gắm tương lai muôn loài.',
    quote: 'Vạn vật sinh sôi từ một niệm từ tâm. Chàng chăm lo cho thiên hạ, còn chàng... để muội chăm lo chu toàn.',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-emerald-500 via-teal-400 to-lime-950',
    avatarIcon: '🌱',
    innatePhysique: 'Tạo Hóa Thánh Thể',
    stats: {
      combatPower: 20000000,
      tuViBonusPercent: 45,
      favorabilityInitial: 55,
      realmStage: 'Độ Kiếp Kỳ',
      realmIndex: 46,
      specialPerkDescription: 'Đan dược hoặc pháp bảo luyện ra tự động tăng gấp đôi phẩm cấp và uy lực công hiệu.'
    }
  },
  {
    id: 'comp_t9_physique',
    name: 'Hỗn Độn Đạo Tổ Nương Nương',
    title: 'Hỗn Độn Bất Diệt Thể',
    tier: 9,
    tierName: 'Cửu Giai',
    archetype: 'di_the',
    archetypeName: 'Khí Vận Dị Thể',
    description: 'Tôn thần tối cao sinh ra trước cả khi trời đất phân định, chưởng quản Hỗn Độn Chi Nguyên, cùng thiên địa đồng thọ, nhật nguyệt đồng quy.',
    backstory: 'Cảm thấy vạn cổ hư vô vô vị, nàng giáng phàm hóa thân thành giai nhân tuyệt sắc để trải nghiệm tư vị ái ân cùng bậc chí tôn tiên đạo.',
    quote: 'Trời đất có thể mục nát, luân hồi có thể đảo lộn, nhưng lời thề kết duyên giữa ta và chàng... mãi mãi trường tồn cùng Hỗn Độn.',
    price: 3500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-400/60 text-yellow-200 bg-yellow-950/50',
    avatarGradient: 'from-purple-500 via-amber-400 to-rose-600',
    avatarIcon: '🌌',
    innatePhysique: 'Hỗn Độn Bất Diệt Thể',
    stats: {
      combatPower: 45000000,
      tuViBonusPercent: 60,
      favorabilityInitial: 50,
      realmStage: 'Chân Tiên',
      realmIndex: 48,
      specialPerkDescription: 'Miễn nhiễm 50% sát thương lôi phạt thiên kiếp, cùng tu sĩ trường sinh bất tử và +200 Khí Vận vĩnh viễn.',
      permanentPlayerBuff: { khiVan: 200, canCot: 100, ngoTinh: 100 }
    }
  }
];

export const COMPANIONS_SHOP_ITEMS_MAP: Record<string, CompanionShopItem> = COMPANIONS_SHOP_CATALOG.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, CompanionShopItem>);

// Helper lấy huy hiệu trường phái đạo lữ
export function getCompanionArchetypeBadge(archetype: CompanionArchetype): { icon: string; label: string; color: string; bg: string; border: string; badgeClass: string } {
  switch (archetype) {
    case 'song_tu':
      return { icon: '💖', label: 'Song Tu Trợ Lực', color: 'text-rose-300', bg: 'bg-rose-950/80', border: 'border-rose-600/50', badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-600/50' };
    case 'ho_dao':
      return { icon: '⚔️', label: 'Chiến Đấu Hộ Đạo', color: 'text-blue-300', bg: 'bg-blue-950/80', border: 'border-blue-600/50', badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-600/50' };
    case 'bach_nghe':
      return { icon: '🧪', label: 'Bách Nghệ Dược Sư', color: 'text-teal-300', bg: 'bg-teal-950/80', border: 'border-teal-600/50', badgeClass: 'bg-teal-950/80 text-teal-300 border-teal-600/50' };
    case 'di_the':
      return { icon: '✨', label: 'Khí Vận Dị Thể', color: 'text-amber-300', bg: 'bg-amber-950/80', border: 'border-amber-600/50', badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-600/50' };
    default:
      return { icon: '🌸', label: 'Tiên Duyên', color: 'text-pink-300', bg: 'bg-pink-950/80', border: 'border-pink-600/50', badgeClass: 'bg-pink-950/80 text-pink-300 border-pink-600/50' };
  }
}

// Chuyển đổi CompanionShopItem thành MerchantItem
export function companionShopItemToMerchantItem(item: CompanionShopItem): MerchantItem {
  return {
    id: item.id,
    name: item.name,
    category: 'companions',
    itemType: 'companion' as any,
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
    companionData: item,
    companionArchetype: item.archetype,
    companionTier: item.tier,
    data: {
      companionShopItem: item,
      isCompanionShopItem: true,
      archetype: item.archetype,
      archetypeName: item.archetypeName,
      innatePhysique: item.innatePhysique,
      quote: item.quote,
      stats: item.stats,
      badgeColor: item.badgeColor,
      avatarGradient: item.avatarGradient
    }
  };
}

// Chuyển đổi CompanionShopItem thành CompanionDefinition để tích hợp sâu vào hệ thống Đạo Lữ
export function companionShopItemToCompanionDefinition(item: CompanionShopItem): CompanionDefinition {
  return {
    id: item.id,
    name: item.name,
    title: item.title,
    avatar: item.avatarIcon || '🌸',
    avatarGradient: item.avatarGradient,
    quote: item.quote,
    description: item.description,
    meetStory: item.backstory,
    secretBackground: item.backstory,
    initialRealm: item.stats.realmStage,
    realmIndex: item.stats.realmIndex,
    favoriteGifts: item.archetype === 'bach_nghe' ? ['herb', 'pill'] : item.archetype === 'ho_dao' ? ['ore', 'equipment'] : ['token', 'gift'],
    favoriteDescription: item.archetype === 'bach_nghe' ? 'Thích Dược Thảo và Đan Dược' : item.archetype === 'ho_dao' ? 'Thích Khoáng Thạch rèn đúc' : 'Thích Tín Vật và Quà Tặng Đạo Lữ',
    buffs: {
      cultivateSpeedBonus: item.stats.tuViBonusPercent,
      atkBonusPercent: item.archetype === 'ho_dao' ? Math.floor(item.tier * 3) : undefined,
      defBonusPercent: item.archetype === 'ho_dao' ? Math.floor(item.tier * 2) : undefined,
      alchemySuccessBonus: item.archetype === 'bach_nghe' ? Math.floor(item.tier * 2) : undefined,
      merchantDiscountPercent: item.archetype === 'bach_nghe' && item.tier >= 7 ? 15 : undefined,
      khiVanBonus: item.stats.permanentPlayerBuff?.khiVan || (item.archetype === 'di_the' ? item.tier * 5 : undefined),
      ngoTinhBonus: item.stats.permanentPlayerBuff?.ngoTinh,
      hpBonusPercent: item.archetype === 'ho_dao' ? Math.floor(item.tier * 2) : undefined,
      hpRegenPercent: item.id === 'comp_t5_craft' ? 20 : undefined
    },
    combinedSkill: {
      id: `skill_${item.id}`,
      name: `${item.title} • Hợp Kích`,
      description: item.stats.specialPerkDescription,
      quote: item.quote,
      damageMultiplier: 2.0 + (item.tier * 0.3),
      effect: item.stats.specialPerkDescription
    },
    innatePhysique: item.innatePhysique,
    archetype: item.archetype,
    shopTier: item.tier
  };
}

export const TIER_COMPANIONS_MERCHANT_ITEMS: MerchantItem[] = COMPANIONS_SHOP_CATALOG.map(companionShopItemToMerchantItem);

export const TIER_COMPANIONS_DEFINITIONS: CompanionDefinition[] = COMPANIONS_SHOP_CATALOG.map(companionShopItemToCompanionDefinition);
