// lib/auction-data.ts
// DỮ LIỆU KỲ TRÂN DỊ BẢO & NPC ĐỐI THỦ VẠN BẢO ĐẤU GIÁ HỘI

import { AuctionLotItem, AuctionNPC } from './types';

export interface AuctionNPCTemplate extends Omit<AuctionNPC, 'budget' | 'thanThuc'> {
  baseBudget: number;
  baseThanThuc: number;
  quotes: {
    bid: string[];
    outbid: string[];
    intimidated: string[];
    intimidateResist: string[];
    fold: string[];
    win: string[];
  };
}

// ============================================
// 1. DANH SÁCH NPC ĐỐI THỦ ĐẤU GIÁ
// ============================================

export const AUCTION_NPC_TEMPLATES: AuctionNPCTemplate[] = [
  {
    id: 'npc_vuong_dang',
    name: 'Vương Đằng',
    title: 'Vương Thế Gia Thiếu Chủ',
    avatar: '👑',
    personality: 'arrogant',
    roleType: 'the_gia',
    color: 'from-amber-600/30 to-rose-600/20 border-amber-500/60',
    baseBudget: 120000,
    baseThanThuc: 55,
    quotes: {
      bid: [
        'Một lũ nghèo kiết xác! Trả giá thế này bổn thiếu gia còn chê ít!',
        'Thế gia họ Vương ta ngàn năm nội tình, tiền đè chết người! Ta ra giá tiếp!',
        'Đồ vật này thuộc về bổn thiếu gia! Ai dám tranh chấp với ta?!'
      ],
      outbid: [
        'Khá khen cho kẻ nào dám vuốt râu hùm họ Vương! Bổn thiếu gia đè bẹp ngươi!',
        'Cái gì?! Dám trả giá cao hơn ta sao? Để xem túi ngươi sâu hay túi ta dày!',
        'Tức chết ta rồi! Mau thêm linh thạch, tuyệt đối không được để mất mặt Vương gia!'
      ],
      intimidated: [
        'Ngươi... ngươi là lão quái vật cảnh giới nào?! Đừng... đừng trừng mắt nhìn ta, món này ta nhường!',
        'Uy áp thật kinh khủng... Đầu ta đau như búa bổ... Món này ta không tranh nữa!',
        'Hừ, đại trượng phu co được giãn được... Hôm nay bổn thiếu gia nhường ngươi một bước!'
      ],
      intimidateResist: [
        'Ha ha ha! Chút thần niệm muỗi đốt gỗ này cũng dám khoe khoang trước mặt Vương gia ta?! Thêm tiền!',
        'Bổn thiếu gia có Hộ Thần Ngọc Phù của phụ thân! Thần thức rác rưởi của ngươi vô dụng thôi!'
      ],
      fold: [
        'Hừ! Đồ đồng nát này cũng không đáng giá đến thế, ta nhường cho kẻ ngốc các ngươi!',
        'Bổn thiếu gia hôm nay mang không đủ ngân phiếu, tha cho các ngươi một lần!'
      ],
      win: [
        'Ha ha ha! Đúng là một lũ nghèo kiết xác, bảo vật này thuộc về bổn thiếu gia rồi!'
      ]
    }
  },
  {
    id: 'npc_co_phong',
    name: 'Cổ Phong Trưởng Lão',
    title: 'Thanh Vân Tông Trưởng Lão',
    avatar: '🧙‍♂️',
    personality: 'prudent',
    roleType: 'truong_lao',
    color: 'from-sky-600/30 to-blue-600/20 border-sky-500/60',
    baseBudget: 85000,
    baseThanThuc: 140,
    quotes: {
      bid: [
        'Vật này có ích cho đệ tử tông môn lão phu, xin được tiếp giá chừng mực.',
        'Lão phu quan sát đan văn và pháp trận này đã lâu, giá này hoàn toàn hợp lý.',
        'Vì tông môn hưng thịnh, Thanh Vân Tông chúng ta xin ra giá tiếp theo.'
      ],
      outbid: [
        'Các vị đạo hữu thật hào sảng, lão phu xin phép cân nhắc tăng thêm một mức.',
        'Ồ? Vị đạo hữu kia quả là người có mắt nhìn bảo vật, lão phu theo giá.'
      ],
      intimidated: [
        'Khí tức thần niệm thâm sâu như vực... Đạo hữu quả là cao nhân ẩn thế, lão phu xin bái phục thu tay.',
        'Thần thức uy áp bàng bạc... Đắc tội cao nhân là điều bất trí, lão phu không tranh nữa.'
      ],
      intimidateResist: [
        'Đạo hữu chớ nên cậy mạnh hiếp yếu! Thanh Vân Tông lão phu tu tâm dưỡng tính mấy trăm năm, há sợ uy áp?!',
        'Tâm cảnh lão phu kiên định như bàn thạch, chút thần niệm này chưa đủ lung lạc lão phu!'
      ],
      fold: [
        'Giá đã vượt quá ba phần so với giá trị thực của bảo vật, lão phu xin rút lui.',
        'Linh thạch tông môn có hạn, không nên tranh chấp vô ích, lão phu nhường lại.'
      ],
      win: [
        'Đa tạ các vị đạo hữu đã nương tay nhường bảo vật này cho Thanh Vân Tông!'
      ]
    }
  },
  {
    id: 'npc_u_minh',
    name: 'U Minh Lão Quái',
    title: 'Hắc Bào Tán Tu',
    avatar: '🥷',
    personality: 'mysterious',
    roleType: 'tan_tu',
    color: 'from-purple-900/40 to-zinc-900/40 border-purple-600/60',
    baseBudget: 150000,
    baseThanThuc: 220,
    quotes: {
      bid: [
        'Khặc khặc... đồ vật này có mùi máu tanh và khí tức viễn cổ, hợp khẩu vị của lão phu!',
        'Cổ bảo này lão phu tình cờ tìm kiếm trăm năm nay, hôm nay gặp ắt phải đoạt lấy!',
        'Mười vạn linh thạch thì đã sao? Lão phu dốc cạn túi cũng phải có được!'
      ],
      outbid: [
        'Kẻ nào cản đường lão phu luyện ma công, ra khỏi cửa đấu giá hội hãy cẩn thận cái đầu!',
        'Hừ! Dám tranh đoạt mối duyên của U Minh ta sao?! Tăng giá!'
      ],
      intimidated: [
        'Hả?! Thần thức của ngươi... chẳng lẽ ngươi là lão quái vật từ Trung Châu tới?! Ta... ta lui!',
        'Thần hồn kinh người... U Minh ta hôm nay nhận thua một ván!'
      ],
      intimidateResist: [
        'Khặc khặc! Chút thần niệm cỏn con này cũng dám múa rìu qua mắt thợ trước mặt bản tọa sao?!',
        'Bản ma đầu từng cắn nuốt vạn đạo tàn hồn, chút áp chế này chỉ gãi ngứa cho ta mà thôi!'
      ],
      fold: [
        'Hừ! Coi như ngươi may mắn, để xem ngươi bảo vệ được bảo vật này bao lâu sau khi rời khỏi đây!',
        'Giá này đã vượt quá dự toán ma công, lão phu tạm thời từ bỏ.'
      ],
      win: [
        'Khặc khặc khặc! Dị bảo thượng cổ cuối cùng cũng thuộc về U Minh Lão Quái ta rồi!'
      ]
    }
  },
  {
    id: 'npc_yen_nhien',
    name: 'Yên Nhiên Tiên Tử',
    title: 'Mỹ Diễm Thương Hội Chưởng Quỹ',
    avatar: '💃',
    personality: 'merchant',
    roleType: 'thuong_hoi',
    color: 'from-pink-600/30 to-amber-600/20 border-pink-500/60',
    baseBudget: 95000,
    baseThanThuc: 95,
    quotes: {
      bid: [
        'Ô kìa, bảo vật tuyệt thế hiếm thấy ngàn năm, giá này vẫn còn hời lắm các vị đạo hữu ơi~',
        'Thương hội muội muội cũng muốn thỉnh vật này về bày tủ kính, muội xin theo giá một chút nha~',
        'Các vị đạo huynh chớ ngần ngại, bảo vật truyền đời giá này chỉ là khởi đầu thôi~'
      ],
      outbid: [
        'Ai nha, vị đạo huynh kia thật hào phóng quá đi, làm muội muội mở mang tầm mắt!',
        'Khí phách ngút trời! Để muội muội đẩy thêm một chút cho xôm tụ nào~'
      ],
      intimidated: [
        'Ối chao! Uy áp của tiền bối thật làm tim muội đập thình thịch, muội sợ rồi, không dám nâng giá nữa đâu~',
        'Tiền bối bớt giận, muội muội chỉ là phận nữ nhi kinh doanh nhỏ, muội xin rút lui ngay đây ạ!'
      ],
      intimidateResist: [
        'Hi hi, thương trường như chiến trường, tiền bối dọa muội sao được chứ~',
        'Thương hội muội có bảo hộ trận pháp, tiền bối chớ dọa người ta sợ nha~'
      ],
      fold: [
        'Hi hi, muội muội chỉ khơi màu góp vui thôi, giá này cao quá rồi, nhường các vị đạo huynh tranh đoạt nhé~',
        'Vượt mức thị trường rồi, thương gia như muội xin dừng cuộc chơi tại đây~'
      ],
      win: [
        'Tạ ơn các vị đạo huynh đã nể mặt thương hội nhường món hời này cho muội muội nha~'
      ]
    }
  },
  {
    id: 'npc_lam_viem',
    name: 'Lâm Viêm',
    title: 'Thiên Kiêu Tán Tu',
    avatar: '🔥',
    personality: 'arrogant',
    roleType: 'tan_tu',
    color: 'from-orange-600/30 to-red-600/20 border-orange-500/60',
    baseBudget: 105000,
    baseThanThuc: 85,
    quotes: {
      bid: [
        'Ba mươi năm Hà Đông, ba mươi năm Hà Tây! Món bảo vật này nhất định phải về tay ta!',
        'Đừng khinh thiếu niên nghèo! Ta ra giá thêm năm ngàn linh thạch!',
        'Cơ duyên nghịch thiên này sinh ra là dành cho ta, kẻ nào cản đường ta trảm!'
      ],
      outbid: [
        'Các ngươi có xuất thân tông môn thế gia thì giỏi lắm sao?! Ta liều mình bồi tiếp!',
        'Đừng hòng cướp đồ của Lâm Viêm ta!'
      ],
      intimidated: [
        'Ách... uy áp thật khủng khiếp... Chẳng lẽ bên cạnh hắn có đại năng hộ đạo?! Ta... tạm rút lui!',
        'Đáng ghét... linh hồn lực của hắn vậy mà mạnh hơn cả lão sư phụ trong nhẫn của ta... Ta nhận thua!'
      ],
      intimidateResist: [
        'Ý chí ta bất khuất kiên cường, thiên địa cũng không đè bẹp được ta, chút thần thức này xá gì?!',
        'Lửa giận trong lòng ta thiêu đốt vạn vật, uy áp của ngươi chỉ làm ta thêm quyết tâm!'
      ],
      fold: [
        'Hôm nay tạm thời nhường các ngươi, chờ ta quật khởi sẽ lấy lại gấp mười lần!',
        'Hừ, đợi đấy cho ta!'
      ],
      win: [
        'Ha ha ha! Trời không phụ lòng người, cơ duyên này đã là của Lâm Viêm ta!'
      ]
    }
  },
  {
    id: 'npc_moc_diep',
    name: 'Mộc Diệp Đạo Nhân',
    title: 'Đan Đỉnh Tông Dược Sư',
    avatar: '🍶',
    personality: 'prudent',
    roleType: 'truong_lao',
    color: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/60',
    baseBudget: 75000,
    baseThanThuc: 125,
    quotes: {
      bid: [
        'Dược tính và đan văn này quả là tuyệt luân, bần đạo xin thỉnh về nghiên cứu lò đan.',
        'Mùi thơm thanh tao, ắt là kỳ hoa dị thảo ngàn năm, bần đạo tiếp giá.',
        'Đan Đỉnh Tông tích lũy linh thạch luyện đan, xin góp một phần công lực.'
      ],
      outbid: [
        'Đạo hữu quả là chịu chi, bần đạo xin nâng thêm một mức nhẹ.',
        'Quả là những vị khách phóng khoáng.'
      ],
      intimidated: [
        'Thần thức uy mãnh vô biên... Đạo hữu quả là thần nhân, bần đạo xin thối lui.',
        'Thiện tai thiện tai, bần đạo không tranh chấp duyên nghiệp này nữa.'
      ],
      intimidateResist: [
        'Lòng bần đạo tĩnh lặng như gương hồ, không gợn sóng trước uy áp trần tục.',
        'Đan tâm bất động, bần đạo không lùi bước!'
      ],
      fold: [
        'Linh dược quý nhưng giá quá cao, bần đạo xin về núi tự tìm hái, không theo nữa.',
        'Duyên phận chưa tới, bần đạo xin nhường lại.'
      ],
      win: [
        'Đa tạ các vị thí chủ đã thành toàn tâm nguyện đan đạo của bần đạo!'
      ]
    }
  },
  {
    id: 'npc_huyet_nguyet',
    name: 'Huyết Nguyệt Ma Nữ',
    title: 'Thiên Ma Giáo Thánh Nữ',
    avatar: '🩸',
    personality: 'mysterious',
    roleType: 'the_gia',
    color: 'from-rose-900/40 to-red-950/40 border-rose-600/60',
    baseBudget: 140000,
    baseThanThuc: 190,
    quotes: {
      bid: [
        'Các ngươi cũng xứng sở hữu thứ này sao? Trả giá thêm hai vạn linh thạch!',
        'Ma khí và sát khí nồng nặc, rất hợp ý bản thánh nữ!',
        'Ai dám tranh với Thiên Ma Giáo chúng ta, chết không có chỗ chôn!'
      ],
      outbid: [
        'Gan to tày trời! Dám qua mặt bản thánh nữ sao?!',
        'Thú vị đấy, bản thánh nữ sẽ chơi cùng ngươi tới giọt linh thạch cuối cùng!'
      ],
      intimidated: [
        'Ngươi... thần hồn cảnh giới này tuyệt đối không phải người phàm tục... Bản thánh nữ ghi nhớ ngươi!',
        'Uy áp bá đạo... Tạm thời tha cho ngươi lần này!'
      ],
      intimidateResist: [
        'Ha ha ha! Thiên Ma Hộ Thể vạn ma quy nhất, chút thần niệm này sao lay chuyển được bản thánh nữ?!',
        'Ngươi muốn đấu thần thức với Thiên Ma Giáo sao? Thật nực cười!'
      ],
      fold: [
        'Hừ! Tiêu tốn nhiều linh thạch vào thứ này không đáng, bản thánh nữ giữ sức cho lô sau!',
        'Hôm nay tâm trạng bản thánh nữ không tốt, tha cho các ngươi.'
      ],
      win: [
        'Ha ha ha! Kẻ nào dám không phục trước uy danh Thiên Ma Giáo?! Bảo vật đã thuộc về ta!'
      ]
    }
  },
  {
    id: 'npc_doc_co_kiem',
    name: 'Độc Cô Nhất Kiếm',
    title: 'Vấn Kiếm Các Kiếm Si',
    avatar: '🗡️',
    personality: 'prudent',
    roleType: 'tan_tu',
    color: 'from-zinc-600/30 to-slate-600/20 border-zinc-400/60',
    baseBudget: 90000,
    baseThanThuc: 160,
    quotes: {
      bid: [
        'Kiếm ý ẩn chứa trong vật này thật sắc bén, tại hạ muốn thỉnh giáo.',
        'Đời này tại hạ chỉ si mê kiếm đạo, vật này ta quyết không nhượng bộ dễ dàng.',
        'Tại hạ xin ra giá tiếp theo.'
      ],
      outbid: [
        'Kiếm phong tranh đoạt, tại hạ tiếp giá!',
        'Khí phách bất phàm, tại hạ bội phục, xin tiếp tục theo giá.'
      ],
      intimidated: [
        'Kiếm ý của các hạ đã đạt tới cảnh giới Thiên Nhân Hợp Nhất... Tại hạ nhận thua.',
        'Thần niệm như kiếm mang xuyên tâm, tại hạ cam bái hạ phong.'
      ],
      intimidateResist: [
        'Kiếm tâm của ta thuần túy vô hà, thiên băng địa liệt cũng không lùi một bước!',
        'Rút kiếm quyết chiến! Thần thức của các hạ không thể khuất phục kiếm ý của ta!'
      ],
      fold: [
        'Linh thạch có hạn, duyên kiếm chưa trọn, tại hạ xin cáo lui.',
        'Không nên chấp niệm quá sâu, tại hạ dừng bước.'
      ],
      win: [
        'Đa tạ các vị các hạ đã nhường bảo vật kiếm đạo này cho tại hạ nghiên cứu!'
      ]
    }
  }
];

// ============================================
// 2. KHO KỲ TRÂN DỊ BẢO ĐẤU GIÁ ĐỘC QUYỀN
// ============================================

export const AUCTION_LOTS: AuctionLotItem[] = [
  {
    id: 'lot_thai_hu_long_noan',
    name: 'Thái Hư Cổ Long Noãn',
    category: 'beast_egg',
    rarity: 'tien',
    icon: '🥚',
    description: 'Trứng rồng Thái Cổ ngâm trong dung nham Hỗn Độn vạn năm, khí tức Chân Long uy chấn bát hoang.',
    lore: 'Vật này được một vị đại năng tìm thấy nơi đáy vực Thái Hư Huyễn Cảnh, tương truyền nở ra Thần Thú Bậc Thần Thoại có thể xé rách hư không, nuốt chửng nhật nguyệt!',
    startingPrice: 35000,
    reservePrice: 85000,
    minBidIncrement: 3000,
    rewardPayload: {
      type: 'beast_egg',
      eggId: 'egg_thai_hu_long',
      beastName: 'Thái Hư Cổ Long',
      beastId: 'beast_thai_hu_long',
      rarity: 'than',
      growthRate: 3.5
    }
  },
  {
    id: 'lot_phuong_hoang_noan',
    name: 'Bất Tử Phượng Hoàng Noãn',
    category: 'beast_egg',
    rarity: 'tien',
    icon: '🔥',
    description: 'Trứng thần điểu Niết Bàn từ ngọn lửa Phần Thiên, chứa chân hỏa phượng hoàng vô tận.',
    lore: 'Vạn năm niết bàn, một khi nở ra sẽ mang lại vĩnh hằng sinh mệnh và thần thông Phần Thiên Chân Hỏa thiêu đốt vạn dặm!',
    startingPrice: 38000,
    reservePrice: 90000,
    minBidIncrement: 3500,
    rewardPayload: {
      type: 'beast_egg',
      eggId: 'egg_phuong_hoang',
      beastName: 'Bất Tử Phượng Hoàng',
      beastId: 'beast_phuong_hoang',
      rarity: 'than',
      growthRate: 3.6
    }
  },
  {
    id: 'lot_thao_thiet_bao',
    name: 'Chân Ma Tụ Huyết Thao Thiết Bào',
    category: 'equipment',
    rarity: 'than',
    icon: '🛡️',
    description: 'Chiến giáp Thần Phẩm dệt từ da hung thú Thao Thiết thượng cổ, đục sẵn 4 lỗ khảm ngọc và 4 dòng ẩn Hoàng Kim.',
    lore: 'Áo giáp này mang uy lực thôn phệ thiên địa, giảm 35% sát thương nhận vào và tăng 25% Khí Huyết cực hạn!',
    startingPrice: 42000,
    reservePrice: 95000,
    minBidIncrement: 4000,
    rewardPayload: {
      type: 'equipment',
      slot: 'armor',
      quality: 'than_pham',
      grade: 'giai_5',
      sockets: 4,
      name: 'Chân Ma Tụ Huyết Thao Thiết Bào',
      defBonus: 280,
      hpBonus: 3500
    }
  },
  {
    id: 'lot_dai_la_kiem_thai',
    name: 'Đại La Kiếm Thai',
    category: 'equipment',
    rarity: 'tien',
    icon: '⚔️',
    description: 'Phôi thần kiếm đúc từ Vạn Kiếp Huyền Thiết và Thiên Ngoại Vấn Tinh, sắc bén vô song trảm phá càn khôn.',
    lore: 'Kiếm thai thai nghén kiếm ý thông thiên, tăng 60% Công Kích và 25% Tỉ lệ Bạo Kích, chém đứt nhân quả tam giới!',
    startingPrice: 50000,
    reservePrice: 120000,
    minBidIncrement: 5000,
    rewardPayload: {
      type: 'equipment',
      slot: 'weapon',
      quality: 'tien_pham',
      grade: 'giai_6',
      sockets: 4,
      name: 'Đại La Kiếm Thai',
      atkBonus: 520,
      critBonus: 25
    }
  },
  {
    id: 'lot_cuu_chau_tran_hon_chung',
    name: 'Cửu Châu Trấn Hồn Chung',
    category: 'equipment',
    rarity: 'than',
    icon: '🔔',
    description: 'Cổ chung phong ấn thần hồn viễn cổ, bảo hộ thức hải bất động như bàn thạch.',
    lore: 'Tiếng chuông vang lên làm tan biến tâm ma, tăng vĩnh viễn 120 Thần Thức và miễn nhiễm 30% sát thương thần hồn!',
    startingPrice: 36000,
    reservePrice: 80000,
    minBidIncrement: 3500,
    rewardPayload: {
      type: 'equipment',
      slot: 'artifact',
      quality: 'than_pham',
      grade: 'giai_5',
      sockets: 4,
      name: 'Cửu Châu Trấn Hồn Chung',
      soulBonus: 120,
      defBonus: 180
    }
  },
  {
    id: 'lot_hu_khong_don_thien_boi',
    name: 'Hư Không Độn Thiên Bội',
    category: 'equipment',
    rarity: 'tien',
    icon: '🧿',
    description: 'Ngọc bội khắc Cửu Cung Hư Không Đại Trận, hòa mình vào kẽ nứt không gian thoát hiểm trong tích tắc.',
    lore: 'Đeo ngọc bội này, tu sĩ có thể súc địa thành thốn, tăng 50 Thân Pháp (Speed) và 20% tỉ lệ Né Đòn hoàn toàn!',
    startingPrice: 45000,
    reservePrice: 105000,
    minBidIncrement: 4500,
    rewardPayload: {
      type: 'equipment',
      slot: 'accessory',
      quality: 'tien_pham',
      grade: 'giai_6',
      sockets: 4,
      name: 'Hư Không Độn Thiên Bội',
      speedBonus: 50,
      dodgeBonus: 20
    }
  },
  {
    id: 'lot_dan_phuong_hoan_hon',
    name: 'Cửu Chuyển Hoàn Hồn Đan Phương',
    category: 'pill_formula',
    rarity: 'than',
    icon: '📜',
    description: 'Đan phương Thần Cấp ghi chép bí pháp luyện chế đan dược cải tử hoàn sinh Lục Giai.',
    lore: 'Thần đan nghịch chuyển âm dương, cướp người từ tay Diêm Vương, giúp tu sĩ lập tức hồi 100% Khí Huyết và tăng mạnh thọ nguyên!',
    startingPrice: 28000,
    reservePrice: 68000,
    minBidIncrement: 2500,
    rewardPayload: {
      type: 'pill_formula',
      recipeId: 'recipe_cuu_chuyen_hoan_hon',
      name: 'Cửu Chuyển Hoàn Hồn Đan'
    }
  },
  {
    id: 'lot_dan_phuong_thong_linh',
    name: 'Cửu Khiếu Thông Linh Đan Phương',
    category: 'pill_formula',
    rarity: 'tien',
    icon: '📜',
    description: 'Bí tịch luyện chế thần đan khai mở cửu khiếu thần thức và ngộ tính tối thượng.',
    lore: 'Uống vào ngộ triệt thiên địa quy tắc, tăng vĩnh viễn +25 Ngộ Tính và +15% Tốc độ Tu Luyện bế quan thổ nạp!',
    startingPrice: 38000,
    reservePrice: 88000,
    minBidIncrement: 3500,
    rewardPayload: {
      type: 'pill_formula',
      recipeId: 'recipe_cuu_khieu_thong_linh',
      name: 'Cửu Khiếu Thông Linh Đan'
    }
  },
  {
    id: 'lot_vien_co_hon_don_tan_do',
    name: 'Viễn Cổ Hỗn Độn Tàn Đồ',
    category: 'material',
    rarity: 'tien',
    icon: '🗺️',
    description: 'Tấm da dê viễn cổ ghi chép vị trí Động Phủ Hỗn Độn Tiên Tôn thời Khai Thiên Tịch Địa.',
    lore: 'Tương truyền người nắm giữ tàn đồ này sẽ mở khóa bí cảnh ẩn Thái Hư Vô Tận với tỷ lệ rơi bảo vật Thần Phẩm 100%!',
    startingPrice: 40000,
    reservePrice: 95000,
    minBidIncrement: 4000,
    rewardPayload: {
      type: 'secret_realm_map',
      id: 'item_hon_don_tan_do',
      name: 'Viễn Cổ Hỗn Độn Tàn Đồ'
    }
  },
  {
    id: 'lot_thai_thuong_kiem_dien',
    name: 'Thái Thượng Kiếm Điển Tàn Quyển',
    category: 'manual',
    rarity: 'tien',
    icon: '📖',
    description: 'Bí kíp kiếm đạo tối cao của Thái Thượng Đạo, kiếm khí hóa hình vạn dặm trảm phá vạn pháp.',
    lore: 'Lĩnh ngộ công pháp này, uy lực thần thông kiếm đạo tăng vọt +45%, xuất chiêu kèm theo Lôi Hỏa kiếm khí bạt sơn đảo hải!',
    startingPrice: 48000,
    reservePrice: 110000,
    minBidIncrement: 4500,
    rewardPayload: {
      type: 'manual',
      id: 'manual_thai_thuong_kiem_dien',
      name: 'Thái Thượng Kiếm Điển',
      element: 'kim',
      quality: 'tien_pham'
    }
  },
  {
    id: 'lot_hoa_than_quy_khu_dien',
    name: 'Hóa Thần Quy Khư Điển',
    category: 'manual',
    rarity: 'tien',
    icon: '🌌',
    description: 'Đạo điển chạm tới quy tắc càn khôn, biến thức hải thành vũ trụ bao la.',
    lore: 'Bí truyền tối cao mở lối Hóa Thần, tăng +45% tốc độ tu luyện, +1800 Max MP, +200 Thần Thức và giảm 20% nguy cơ Tâm Ma!',
    startingPrice: 65000,
    reservePrice: 150000,
    minBidIncrement: 5000,
    rewardPayload: {
      type: 'manual',
      id: 'tp_hoa_than_quy_khu',
      name: 'Hóa Thần Quy Khư Điển',
      element: 'hon_don',
      quality: 'than_pham'
    }
  },
  {
    id: 'lot_bat_hoang_bat_diet_the',
    name: 'Bát Hoang Bất Diệt Thể',
    category: 'manual',
    rarity: 'tien',
    icon: '🛡️',
    description: 'Nhục thân đạt tới cảnh giới bất diệt, nhỏ một giọt máu có thể tái sinh gân cốt.',
    lore: 'Thể tu thần điển tuyệt thế, tăng +40% Khí Huyết, +35% Phòng Ngự, +8% Miễn Thương, hồi 4% Khí Huyết mỗi hiệp đấu!',
    startingPrice: 70000,
    reservePrice: 160000,
    minBidIncrement: 6000,
    rewardPayload: {
      type: 'manual',
      id: 'tt_bat_hoang_bat_diet',
      name: 'Bát Hoang Bất Diệt Thể',
      element: 'tho',
      quality: 'than_pham'
    }
  },
  {
    id: 'lot_than_ma_nhat_niem_tram',
    name: 'Thần Ma Nhất Niệm Trảm',
    category: 'manual',
    rarity: 'tien',
    icon: '⚔️',
    description: 'Một kiếm trảm toái hư không, phân định thần ma, trảm thẳng vào căn nguyên sinh mệnh.',
    lore: 'Kiếm quyết chí tôn sát phạt chư thiên, +1,500 Công Kích, +40% ST Bạo Kích, gây 20% Sát Thương Chuẩn xuyên thấu vạn pháp!',
    startingPrice: 85000,
    reservePrice: 190000,
    minBidIncrement: 8000,
    rewardPayload: {
      type: 'manual',
      id: 'tt_than_ma_nhat_niem',
      name: 'Thần Ma Nhất Niệm Trảm',
      element: 'am',
      quality: 'than_pham'
    }
  },
  {
    id: 'lot_bat_hoang_loi_linh_ngoc',
    name: 'Bát Hoang Lôi Linh Ngọc - Cực Phẩm',
    category: 'gem',
    rarity: 'than',
    icon: '⚡',
    description: 'Linh ngọc Lôi Tinh bậc 5 tối thượng hình thành từ 999 đạo Cửu Thiên Huyền Lôi.',
    lore: 'Khảm vào trang bị mang lại +35 Thân Pháp, +12% Bạo Kích và hiệu ứng Lôi Kiếp Chấn Nhiếp làm tê liệt đối thủ!',
    startingPrice: 22000,
    reservePrice: 55000,
    minBidIncrement: 2000,
    rewardPayload: {
      type: 'gem',
      gemId: 'gem_loi_5',
      name: 'Bát Hoang Lôi Linh Ngọc (Bậc 5)'
    }
  },
  {
    id: 'lot_bang_phach_huyen_minh_tinh',
    name: 'Băng Phách Huyền Minh Tinh',
    category: 'material',
    rarity: 'than',
    icon: '💎',
    description: 'Khối khoáng thạch kết tinh tại đáy Cửu U Hàn Ba ngàn năm, hàn khí thấu xương.',
    lore: 'Vật liệu chí bảo dùng để rèn đúc Thần Binh hoặc tăng 100% tỉ lệ thành công khi đục lỗ khảm ngọc thứ 4!',
    startingPrice: 25000,
    reservePrice: 60000,
    minBidIncrement: 2500,
    rewardPayload: {
      type: 'material',
      id: 'ore_bang_phach_tinh',
      name: 'Băng Phách Huyền Minh Tinh',
      count: 10
    }
  },
  {
    id: 'lot_hon_don_ngu_sac_tho',
    name: 'Hỗn Độn Ngũ Sắc Linh Thổ',
    category: 'material',
    rarity: 'tien',
    icon: '🏺',
    description: 'Đất thiêng ngũ sắc hình thành từ hỗn độn sơ khai, nuôi dưỡng vạn vật dược thảo.',
    lore: 'Rải vào Động Phủ Linh Điền giúp giảm vĩnh viễn 25% thời gian canh tác và tăng gấp đôi tỷ lệ đột biến dược thảo quý!',
    startingPrice: 32000,
    reservePrice: 75000,
    minBidIncrement: 3000,
    rewardPayload: {
      type: 'material',
      id: 'item_ngu_sac_tho',
      name: 'Hỗn Độn Ngũ Sắc Linh Thổ'
    }
  },
  {
    id: 'lot_cuu_u_huyet_linh_thach',
    name: 'Thượng Cổ Linh Thạch Sơn Khối',
    category: 'material',
    rarity: 'cuc',
    icon: '💰',
    description: 'Khối linh thạch nguyên bản tinh thuần khai quật từ mạch khoáng viễn cổ sâu ngàn trượng.',
    lore: 'Khai mở lập tức thu hoạch 120,000 Hạ Phẩm Linh Thạch cùng 50 Trung Phẩm Linh Thạch dồi dào sung túc!',
    startingPrice: 18000,
    reservePrice: 45000,
    minBidIncrement: 2000,
    rewardPayload: {
      type: 'currency',
      linhThach: 120000,
      trungPham: 50
    }
  },
  {
    id: 'lot_tien_thien_hoan_thien_phu',
    name: 'Tiên Thiên Hoán Thiên Phù',
    category: 'material',
    rarity: 'tien',
    icon: '🎴',
    description: 'Đạo bùa do Tiên Tôn phong ấn, có công năng cải mệnh hoán thiên tẩy tủy trang bị.',
    lore: 'Sử dụng cho phép tẩy luyện toàn bộ 4 dòng thuộc tính ẩn của trang bị lên bậc Hoàng Kim hoặc Thần Phẩm!',
    startingPrice: 30000,
    reservePrice: 70000,
    minBidIncrement: 2500,
    rewardPayload: {
      type: 'material',
      id: 'item_hoan_thien_phu',
      name: 'Tiên Thiên Hoán Thiên Phù',
      count: 5
    }
  },
  {
    id: 'lot_van_tho_vo_cuong_dan_phuong',
    name: 'Vạn Thọ Vô Cương Đan Phương',
    category: 'pill_formula',
    rarity: 'than',
    icon: '📜',
    description: 'Đan phương Thần Phẩm đoạt thiên địa tạo hóa, kéo dài thọ nguyên và ngưng tụ tiên cốt.',
    lore: 'Luyện thành công tăng vĩnh viễn +30 Căn Cốt bản mệnh và gia tăng 50,000 Khí Huyết cực hạn!',
    startingPrice: 35000,
    reservePrice: 80000,
    minBidIncrement: 3000,
    rewardPayload: {
      type: 'pill_formula',
      recipeId: 'recipe_van_tho_vo_cuong',
      name: 'Vạn Thọ Vô Cương Đan'
    }
  }
];
