// lib/natal-artifact-data.ts
// Cấu hình dữ liệu cho phân hệ "Bản Mệnh Pháp Bảo & Bồi Dưỡng Khí Linh"

import {
  SpiritStage,
  SpiritPersonality,
  SpiritStageConfig,
  SpiritPersonalityConfig
} from '@/lib/types/natal-artifact';

// ============================================================
// 1. NĂM TẦNG TIẾN HÓA LINH TRÍ KHÍ LINH (5 SPIRIT STAGES)
// ============================================================
export const SPIRIT_STAGES_CONFIG: Record<SpiritStage, SpiritStageConfig> = {
  mong_muoi: {
    stage: 'mong_muoi',
    stageLevel: 1,
    name: 'Mông Muội Sơ Khai',
    roman: 'Tầng I',
    maxExp: 600,
    atkBonusPercent: 5,
    defBonusPercent: 5,
    description: 'Linh trí mờ mịt như hài đồng sơ sinh, linh quang mơ hồ, cảm ứng được vui buồn hỷ nộ cùng chủ nhân.',
    auraColor: 'border-zinc-500 text-zinc-300 shadow-zinc-500/20'
  },
  thuc_tinh: {
    stage: 'thuc_tinh',
    stageLevel: 2,
    name: 'Linh Thể Thức Tỉnh',
    roman: 'Tầng II',
    maxExp: 1800,
    atkBonusPercent: 12,
    defBonusPercent: 12,
    critRateBonusPercent: 5,
    description: 'Bắt đầu phát quang linh thể rực rỡ, có thể truyền âm tâm đắc trong thức hải. Mở khóa kỹ năng bị động đầu tiên.',
    auraColor: 'border-cyan-500 text-cyan-300 shadow-cyan-500/30'
  },
  thong_tue: {
    stage: 'thong_tue',
    stageLevel: 3,
    name: 'Đạo Tâm Thông Tuệ',
    roman: 'Tầng III',
    maxExp: 4500,
    atkBonusPercent: 18,
    defBonusPercent: 18,
    critRateBonusPercent: 8,
    cultivationSpeedBonusPercent: 10,
    description: 'Hiểu rõ đạo pháp luân chuyển, tự động dẫn dắt linh khí phụ trợ bế quan (+10% tu vi). Mở khóa Chiến Kỹ Hộ Chủ.',
    auraColor: 'border-emerald-500 text-emerald-300 shadow-emerald-500/30'
  },
  huyen_the: {
    stage: 'huyen_the',
    stageLevel: 4,
    name: 'Huyễn Ảnh Phiêu Phù',
    roman: 'Tầng IV',
    maxExp: 12000,
    atkBonusPercent: 25,
    defBonusPercent: 25,
    critRateBonusPercent: 12,
    dmgReductionBonusPercent: 10,
    cultivationSpeedBonusPercent: 15,
    description: 'Ngưng tụ thành hư ảnh phiêu phù hiển hiện thế gian, xuất hiện trợ chiến hộ chủ trong các hiệp đấu sinh tử.',
    auraColor: 'border-purple-500 text-purple-300 shadow-purple-500/40'
  },
  hoa_hinh: {
    stage: 'hoa_hinh',
    stageLevel: 5,
    name: 'Hóa Hình Nhân Gian',
    roman: 'Tầng V',
    maxExp: 99999,
    atkBonusPercent: 35,
    defBonusPercent: 35,
    critRateBonusPercent: 18,
    dmgReductionBonusPercent: 15,
    cultivationSpeedBonusPercent: 25,
    description: 'Đột phá trần tục, ngưng kết thành hình người hoặc chân linh thái cổ, chiến lực sánh ngang một tôn đại năng hộ đạo!',
    auraColor: 'border-amber-400 text-amber-200 shadow-amber-400/50'
  }
};

// ============================================================
// 2. BỐN ĐẠI BẢN TÍNH & CHIẾN KỸ HỘ CHỦ (4 PERSONALITIES)
// ============================================================
export const SPIRIT_PERSONALITIES_CONFIG: Record<SpiritPersonality, SpiritPersonalityConfig> = {
  sat_phat: {
    personality: 'sat_phat',
    name: 'Sát Phạt Quả Đoán',
    icon: '⚔️',
    color: 'from-rose-600 to-red-700 text-rose-300 border-rose-500',
    skillName: 'Tru Tiên Trảm Hồn',
    skillDesc: 'Khi Boss tụt xuống dưới 35% HP, Khí Linh phóng xuất 1 đạo kiếm quang vô thượng chém thẳng vào nguyên thần địch, gây 250% Sát Thương Chuẩn và khiến địch câm lặng 1 hiệp!',
    triggerDesc: 'Kích hoạt khi HP mục tiêu < 35%',
    quotes: {
      low: [
        'Chủ nhân... Ta ngửi thấy mùi huyết tinh quanh đây. Khi nào chúng ta mới trảm sát tiếp?',
        'Lưỡi kiếm của ta còn lạnh lắm, cần máu kẻ địch để bồi bổ linh khí.',
        'Đừng lãng phí thời gian, mang kiếm ra nghênh chiến thôi!'
      ],
      mid: [
        'Kiếm phong của ta chỉ hướng về kẻ dám bất kính với người!',
        'Chỉ cần người vung tay, ta sẽ vì người san bằng vạn dặm chông gai.',
        'Một kiếm này chém ra, nhật nguyệt cũng phải biến sắc!'
      ],
      high: [
        'Chủ nhân, vạn thế trầm luân, ta nguyện làm thanh kiếm sắc bén nhất nơi tay người chém toái chư thiên!',
        'Dù đối đầu tiên nhân hay ma thần, ta vĩnh viễn không lùi nửa bước trước kẻ thù của người!',
        'Đồng sinh cộng tử! Máu của người chảy trong ta, kiếm của ta hộ mệnh người!'
      ]
    }
  },
  thu_ho: {
    personality: 'thu_ho',
    name: 'Thủ Hộ Kiên Định',
    icon: '🛡️',
    color: 'from-amber-600 to-yellow-700 text-amber-300 border-amber-500',
    skillName: 'Linh Thể Chắn Kiếp',
    skillDesc: 'Khi HP chủ nhân rơi xuống dưới 25%, Khí Linh hiển hóa màng chắn kim cang hấp thụ 100% sát thương đòn đánh chí mạng kế tiếp và hồi phục 15% Khí Huyết tối đa!',
    triggerDesc: 'Kích hoạt khi HP chủ nhân < 25%',
    quotes: {
      low: [
        'Chủ nhân, đừng cậy mạnh, có ta ở đây bảo hộ người.',
        'Thân ta như huyền thiết bất hoại, cứ nấp sau lưng ta.',
        'Linh lực còn non yếu, hãy ôn dưỡng ta thêm nhé.'
      ],
      mid: [
        'Đạo thể của người quý giá hơn hết thảy, ta sẽ không để ai làm người tổn thương.',
        'Vạn kiếp lôi đình giáng xuống, ta nguyện làm tấm khiên chắn kiếp cho người!',
        'Khí tức của ta đã hòa cùng chân nguyên người, bình an là phúc.'
      ],
      high: [
        'Chỉ cần linh niệm ta chưa diệt, dù thịt nát xương tan cũng quyết giữ người chu toàn!',
        'Chủ nhân, người chính là lý do duy nhất khiến ta tồn tại giữa thiên địa này.',
        'Đừng sợ hãi bất kỳ kiếp nạn nào, có ta ở đây, càn khôn bất hoại!'
      ]
    }
  },
  co_xao: {
    personality: 'co_xao',
    name: 'Cơ Xảo Linh Động',
    icon: '⚡',
    color: 'from-sky-600 to-cyan-700 text-sky-300 border-sky-500',
    skillName: 'Huyễn Ảnh Trói Hồn',
    skillDesc: 'Đầu trận đấu, 50% xác suất phóng thích cấm chế huyễn trận làm đóng băng hoặc giảm 50% Tốc Độ của đối thủ trong 2 hiệp đầu!',
    triggerDesc: 'Kích hoạt ở Đầu Trận Đấu (Hiệp 1)',
    quotes: {
      low: [
        'Hì hì, chủ nhân đừng mặt ủ mày chau thế chứ, nhìn ta bay lượn nè!',
        'Bên ngoài có gì vui không? Mau mang ta đi dạo một vòng đi!',
        'Kẻ địch ngu ngốc kia sắp lọt vào bẫy của ta rồi kìa.'
      ],
      mid: [
        'Ta vừa học được vài thủ đoạn giảo hoạt mới, để ta thử lên người lũ yêu thú kia nhé!',
        'Chủ nhân cứ ung dung uống trà, trận chiến này cứ để ta biến hóa trêu đùa chúng nó!',
        'Xem kìa, bọn chúng luống cuống không chạm nổi vào tàn ảnh của chúng ta!'
      ],
      high: [
        'Chủ nhân là người thông tuệ nhất trần gian, chỉ có người mới hiểu được tâm tư của ta thôi!',
        'Huyễn ảnh ngàn vạn nhưng chân tình chỉ có một, ta sẽ mãi quấn quýt bên người không rời.',
        'Bất kể người đi đến chân trời góc bể nào, ta cũng sẽ biến hóa thành ngàn vạn tinh tú soi đường!'
      ]
    }
  },
  tinh_hoa: {
    personality: 'tinh_hoa',
    name: 'Tịnh Hóa Ôn Nhu',
    icon: '🌿',
    color: 'from-emerald-600 to-teal-700 text-emerald-300 border-emerald-500',
    skillName: 'Hồi Quang Quy Nguyên',
    skillDesc: 'Mỗi 3 hiệp chiến đấu, Khí Linh phát động tịnh hóa chi quang, tự động giải trừ mọi bùa chú/độc tố trên người chủ nhân và hồi phục 20% Chân Nguyên (MP) & Khí Huyết!',
    triggerDesc: 'Kích hoạt định kỳ mỗi 3 hiệp',
    quotes: {
      low: [
        'Linh khí thanh khiết quá... để ta xoa dịu vết thương cho người.',
        'Chủ nhân đừng tu luyện quá gấp gáp, tẩu hỏa nhập ma là khổ lắm đấy.',
        'Hôm nay người đã mệt mỏi rồi, hãy để ta lắng nghe tâm sự.'
      ],
      mid: [
        'Dược hương dịu mát này là do ta gom góp từ nhật nguyệt tinh hoa tặng người đó.',
        'Mỗi lần người ôn dưỡng cho ta, ta đều cảm thấy ấm áp như được tắm trong suối linh tuyền.',
        'Kinh mạch của người có chút bất ổn, hãy để ta dùng sinh mệnh chi tức uẩn dưỡng cho người.'
      ],
      high: [
        'Nguyện hóa thành giọt linh sương thanh tịnh, gột rửa mọi u phiền và chấp niệm của chủ nhân.',
        'Dù thiên địa có vỡ vụn, tấm lòng ôn nhu này vĩnh viễn thuộc về một mình người.',
        'Chủ nhân bình an, đại đạo viên mãn chính là tâm nguyện lớn nhất của đời ta.'
      ]
    }
  }
};

// ============================================================
// 3. DANH SÁCH PHÔI KHÍ LINH CỔ PHONG (SPIRIT ARCHETYPES)
// ============================================================
export interface SpiritArchetype {
  id: string;
  name: string;
  title: string;
  avatar: string;
  defaultPersonality: SpiritPersonality;
  compatibleSlots: string[]; // weapon, armor, accessory, artifact
  description: string;
}

export const SPIRIT_ARCHETYPES: SpiritArchetype[] = [
  {
    id: 'archetype_kiem_linh_to_y',
    name: 'Tố Y',
    title: 'Thái Cổ Kiếm Linh',
    avatar: '🗡️',
    defaultPersonality: 'sat_phat',
    compatibleSlots: ['weapon'],
    description: 'Nữ tử áo trắng thanh lãnh xuất trần, hóa thân từ vạn trượng kiếm khí viễn cổ, sát phạt quả quyết.'
  },
  {
    id: 'archetype_huyen_quy_tran_nguc',
    name: 'Bá Hạ',
    title: 'Huyền Quy Trấn Ngục',
    avatar: '🐢',
    defaultPersonality: 'thu_ho',
    compatibleSlots: ['armor', 'artifact'],
    description: 'Thần thú trấn giữ u minh địa phủ, mai rùa khắc bát quái trận đồ, kiên cố bất hoại.'
  },
  {
    id: 'archetype_bang_phach_linh_diep',
    name: 'Băng Nhi',
    title: 'Băng Phách Linh Điệp',
    avatar: '🦋',
    defaultPersonality: 'co_xao',
    compatibleSlots: ['accessory', 'weapon', 'artifact'],
    description: 'Cực bắc huyền băng thai nghén linh điệp, vũ điệu phiêu dật giảo hoạt, dẫn động ảo ảnh mê hoặc tâm can.'
  },
  {
    id: 'archetype_moc_linh_tien_tu',
    name: 'Thanh Hà',
    title: 'Thanh Mộc Tiên Tử',
    avatar: '🌸',
    defaultPersonality: 'tinh_hoa',
    compatibleSlots: ['accessory', 'armor', 'artifact'],
    description: 'Hóa thân từ thần thụ ngàn năm nơi bồng lai tiên cảnh, yểu điệu thục nữ, mang theo sinh cơ bất tận.'
  },
  {
    id: 'archetype_hoa_tinh_thao_thiet',
    name: 'Viêm Sát',
    title: 'Xích Viêm Thao Thiết',
    avatar: '🔥',
    defaultPersonality: 'sat_phat',
    compatibleSlots: ['weapon', 'artifact'],
    description: 'Hung thú liệt hỏa viễn cổ phong ấn trong thần binh, khát máu vô cùng, thôn phệ vạn vật.'
  },
  {
    id: 'archetype_bich_hai_thanh_loan',
    name: 'Loan Nhi',
    title: 'Bích Hải Thanh Loan',
    avatar: '🦚',
    defaultPersonality: 'tinh_hoa',
    compatibleSlots: ['accessory', 'armor'],
    description: 'Thần điểu phương đông mang huyết mạch phượng hoàng, tiếng hót thanh tao xua tan mọi tà túy ác niệm.'
  }
];

// Helper lấy câu thoại ngẫu nhiên theo Hảo Cảm
export function getRandomSpiritQuote(
  personality: SpiritPersonality,
  intimacy: number
): string {
  const pCfg = SPIRIT_PERSONALITIES_CONFIG[personality] || SPIRIT_PERSONALITIES_CONFIG.sat_phat;
  const quotesList =
    intimacy >= 75
      ? pCfg.quotes.high
      : intimacy >= 35
      ? pCfg.quotes.mid
      : pCfg.quotes.low;

  return quotesList[Math.floor(Math.random() * quotesList.length)];
}
