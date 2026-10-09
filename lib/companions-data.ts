// lib/companions-data.ts
// HỆ THỐNG ĐẠO LỮ SONG TU & TIÊN DUYÊN KẾT GIAO (HỒNG NHAN TRI KỶ) - BẢN NÂNG CẤP TOÀN DIỆN

import {
  CompanionDefinition,
  CompanionsDataState,
  CompanionPlayerState,
  CompanionBuff,
  PlayerStats
} from './types';
import { TIER_COMPANIONS_DEFINITIONS } from './companions-shop-data';

// ============================================
// HẰNG SỐ HỆ THỐNG TIÊN DUYÊN
// ============================================

export const BOND_COST_LINH_THACH = 50000;
export const SONG_TU_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 giờ một lần song tu
export const CHAT_COOLDOWN_MS = 30 * 60 * 1000; // 30 phút một lần đàm đạo cơ bản
export const CHAT_COOLDOWN_DISCOUNT_MS = 15 * 60 * 1000; // 15 phút khi đạt Tình Đầu Ý Hợp (>=90)
export const TAM_TINH_DURATION_MS = 24 * 60 * 60 * 1000; // 24 giờ hiệu lực Tâm Tịnh Thần Diệu
export const TAM_THAN_DURATION_MS = 12 * 60 * 60 * 1000; // 12 giờ hiệu lực Tâm Thần Hợp Nhất (+20% tốc độ tu luyện)

export function getChatCooldownMs(affinity: number): number {
  return affinity >= 90 ? CHAT_COOLDOWN_DISCOUNT_MS : CHAT_COOLDOWN_MS;
}

export interface AffinityTierInfo {
  tier: 'so_thuc' | 'hao_huu' | 'hong_nhan' | 'tinh_dau';
  name: string;
  min: number;
  max: number;
  color: string;
  badgeClass: string;
  heartColor: string;
  description: string;
  milestonePerk: string;
}

export const AFFINITY_TIERS: Record<string, AffinityTierInfo> = {
  so_thuc: {
    tier: 'so_thuc',
    name: 'Sơ Thức',
    min: 0,
    max: 29,
    color: 'text-zinc-300',
    badgeClass: 'bg-zinc-800/80 text-zinc-300 border-zinc-600/50',
    heartColor: 'text-zinc-500',
    description: 'Người lạ gặp gỡ, sơ ngộ tiên lộ, chưa hiểu rõ chân tâm đối phương.',
    milestonePerk: 'Mốc 0: Bắt đầu kết giao, tặng quà và luận đạo.'
  },
  hao_huu: {
    tier: 'hao_huu',
    name: 'Hảo Hữu',
    min: 30,
    max: 59,
    color: 'text-sky-300',
    badgeClass: 'bg-sky-950/70 text-sky-300 border-sky-600/50',
    heartColor: 'text-sky-400',
    description: 'Bạn bè tâm giao, đàm đạo luận đạo, cùng nhau chia sẻ kỳ ngộ tu tiên.',
    milestonePerk: 'Mốc 30: Mở khóa Thân Thế Bí Mật & Tâm Sự Kín Đáo của Tiên Tử.'
  },
  hong_nhan: {
    tier: 'hong_nhan',
    name: 'Hồng Nhan Tri Kỷ',
    min: 60,
    max: 89,
    color: 'text-purple-300',
    badgeClass: 'bg-purple-950/70 text-purple-300 border-purple-500/50',
    heartColor: 'text-purple-400',
    description: 'Thân mật gắn bó, ý hợp tâm đầu, sinh tử có nhau giữa tam giới phong ba.',
    milestonePerk: 'Mốc 60: Mở khóa Nhiệm Vụ Tâm Nguyện Tiên Tử & Nhận Tín Vật Định Tình.'
  },
  tinh_dau: {
    tier: 'tinh_dau',
    name: 'Tình Đầu Ý Hợp',
    min: 90,
    max: 100,
    color: 'text-rose-300',
    badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-500/50 animate-pulse',
    heartColor: 'text-rose-400',
    description: 'Tâm ý viên mãn, tình thâm ý trọng, đủ điều kiện lập Lời Thề Thiên Địa kết duyên Tiên Lữ!',
    milestonePerk: 'Mốc 90: Giảm 50% hồi chiêu Đàm Đạo. Mốc 100: Thiên Địa Song Tu Đại Điển!'
  }
};

export function getAffinityTier(affinity: number): AffinityTierInfo {
  const aff = Math.max(0, Math.min(100, affinity));
  if (aff >= 90) return AFFINITY_TIERS.tinh_dau;
  if (aff >= 60) return AFFINITY_TIERS.hong_nhan;
  if (aff >= 30) return AFFINITY_TIERS.hao_huu;
  return AFFINITY_TIERS.so_thuc;
}

// ============================================
// DANH SÁCH 5 TIÊN TỬ ĐẠO LỮ CỔ PHONG
// ============================================

export const COMPANIONS_DATA: CompanionDefinition[] = [
  {
    id: 'companion_lac_thanh_tuyet',
    name: 'Lạc Thanh Tuyết',
    title: 'Băng Phách Tiên Tử',
    gender: 'female',
    origin: 'Băng Tuyết Thần Cung',
    personality: 'Lãnh diễm thanh cao, tính tình lãnh đạm nhưng nội tâm dịu dàng, trọng tình trọng nghĩa.',
    avatar: '❄️',
    avatarGradient: 'from-sky-500 via-indigo-400 to-cyan-200',
    quote: 'Tuyết rơi ngàn năm nơi Băng Cung không tan, nhưng tâm ý người trao... đã làm tan chảy hàn băng này.',
    meetStory: 'Tại đỉnh Băng Phong nghìn trượng, ngươi vô tình giải phá phong ấn hàn triều giúp Băng Tuyết Cung, tương ngộ Thiếu cung chủ Lạc Thanh Tuyết đang bế quan.',
    initialRealm: 'Trúc Cơ Đỉnh Phong',
    realmIndex: 8,
    favoriteGifts: ['herb', 'pill'],
    favoriteDescription: 'Thích Dược Liệu hàn băng và Đan Dược thượng phẩm để áp chế hàn độc thể chất.',
    buffs: {
      cultivateSpeedBonus: 15,
      tamMaDamageReduction: 20,
      iceResistance: 30,
      freezeChance: 25
    },
    secretBackground: 'Ta vốn là cô nhi bị bỏ rơi nơi Băng Phong ngàn trượng, may mắn được Sư Tôn đem về Cung. Bẩm sinh ta mang Băng Phách Tuyệt Mạch, hàn khí thấu xương ngày đêm dày vò kinh mạch. Sư Tôn dạy ta phải tuyệt tình đoạn dục mới trấn áp được hàn độc... Nhưng từ khi gặp ngươi, chén trà ấm ngươi pha, kiếm ý bao dung của ngươi đã dạy ta hiểu: Tiên lộ dẫu lạnh giá muôn trùng, chỉ cần có tri kỷ đồng hành, hàn băng cũng hóa thành xuân thủy ấm áp.',
    storyQuest: {
      id: 'quest_lac_thanh_tuyet',
      companionId: 'companion_lac_thanh_tuyet',
      title: 'Hàn Băng Tố Tâm',
      description: 'Lạc Thanh Tuyết cần Băng Tâm Thảo hoặc Dược Liệu thượng phẩm để luyện chế Băng Phách Đan, áp chế hàn triều bộc phát trong kinh mạch.',
      targetItemName: 'Dược Liệu / Băng Tâm Thảo',
      targetItemType: 'herb',
      tokenReward: {
        name: 'Băng Phách Tuyết Ngọc Bội',
        description: 'Tín vật định tình chạm khắc từ Hàn Băng Tinh Thạch ngàn năm, mang theo hơi thở mát lạnh dịu dàng của Thanh Tuyết, giúp tĩnh tâm ngưng thần và tăng kháng Băng.',
        icon: '❄️'
      },
      dialogueOnAccept: 'Đạo hữu... mấy ngày nay hàn độc trong người ta có dấu hiệu phản phệ, nếu có thể tìm được một gốc Băng Tâm Thảo hoặc thảo dược quý, Thanh Tuyết vô cùng cảm kích.',
      dialogueOnComplete: 'Ngươi đã vì ta mà bôn ba ngàn dặm tìm thảo dược... Ngọc bội này là vật gia truyền bên người ta từ tấm bé, nay xin trao cho chàng làm tín vật định tình!'
    },
    combinedSkill: {
      name: 'Băng Phách Tuyệt Kiếm - Vạn Lý Hàn Sương',
      desc: 'Thanh Tuyết ngự băng kiếm hộ thể, người chơi chém xuất kiếm khí tuyệt luân. Hàn phong đóng băng vạn dặm, giáng một đòn chí mạng đóng băng Boss 1 hiệp!',
      quote: 'Tuyết vũ trường thiên, kiếm tâm thông linh! Đóng băng!',
      damageMultiplier: 2.8,
      element: 'thuy',
      bonusEffect: 'Kháng Băng +30% & xác suất 25% Đóng Băng đối thủ 1 hiệp'
    },
    realmDialogues: {
      truc_co: [
        'Căn cơ Trúc Cơ của chàng rất vững chắc, từng bước đạp tuyết mà đi, chớ nên nóng vội.',
        'Hàn băng ngưng tụ cần thời gian, đạo đồ cũng vậy, Thanh Tuyết tin chàng sẽ sớm kết đan.'
      ],
      kim_dan: [
        'Kim Đan lấp lánh như nhật nguyệt, kiếm khí của chàng đã có phong thái tông sư rồi đấy.',
        'Cùng chàng sóng vai ngự kiếm qua ngàn dặm tuyết sơn, lòng ta an định hơn bao giờ hết.'
      ],
      hoa_than: [
        'Nguyên Thần xuất khiếu, uy áp cửu thiên... Chàng đã đứng trên đỉnh phong vạn người ngưỡng vọng, nhưng trong mắt chàng, ta vẫn thấy sự dịu dàng thuở ban sơ.'
      ]
    },
    dialogues: {
      so_thuc: [
        'Đạo hữu dừng bước, Băng Tuyết Thần Cung khí lạnh buốt giá, cẩn thận hàn khí xâm nhập kinh mạch.',
        'Đạo đồ gian nan, phàm nhân khó lòng thấu suốt... Ngươi đến tìm ta có việc chi?'
      ],
      hao_huu: [
        'Trà tuyết pha bằng sương mai ngàn năm, mùi vị thanh khiết, đạo hữu có muốn nếm thử một chén?',
        'Có người cùng đàm luận kiếm pháp và hàn băng quyết, gió tuyết nơi này dường như bớt quạnh quẽ đôi phần.'
      ],
      hong_nhan: [
        'Mỗi lần chàng xuống núi lịch luyện, lòng ta lại không kìm được mối bận tâm... Hãy giữ gìn ngọc thể.',
        'Băng Tâm Ngọc Quyết của ta xưa nay vốn vô ba bất động, vậy mà hễ thấy bóng dáng chàng là tâm hồ lại gợn sóng.'
      ],
      tinh_dau: [
        'Thanh Tuyết nguyện cùng chàng vấn đỉnh trường sinh, dẫu cửu tử nhất sinh cũng tuyệt không hối hận.',
        'Thiên địa bao la, tuyết phủ muôn dặm, chỉ cần có chàng nắm tay, nơi đâu cũng là chốn đắc đạo an lành.'
      ],
      song_tu: [
        'Hàn khí cùng Thuần Dương chân khí giao hòa tại Đan Điền... Thần hồn cộng minh, cảm giác như nhập vào cõi Thái Hư diệu cảnh.',
        'Băng Phách Tiên Thể cùng chàng hô ứng, một chu thiên vận hành làm vơi đi vạn kiếp trần duyên, tu vi tinh tiến thần tốc!'
      ]
    }
  },
  {
    id: 'companion_co_vo_diem',
    name: 'Cơ Vô Diễm',
    title: 'U Minh Yêu Nữ',
    gender: 'female',
    origin: 'Cửu U Ma Giáo',
    personality: 'Phong tình vạn chủng, tà mị quyết đoán, độc bộ thiên hạ, sinh sát tùy tâm nhưng đối với người thương lại chân tình khắc cốt.',
    avatar: '🥀',
    avatarGradient: 'from-rose-600 via-purple-700 to-pink-500',
    quote: 'Thiên hạ mắng ta là Yêu Nữ độc ác, chỉ có chàng hiểu được chân tâm ta. Nếu chàng muốn nghịch thiên, ta cùng chàng đạp bằng tam giới!',
    meetStory: 'Dưới chân Hắc Ám Ma Quật, ngươi xuất thủ cứu nguy cho một nữ tu áo đỏ bị chính đạo vây hãm, mới phát hiện nàng chính là Thánh nữ khét tiếng của Cửu U Ma Giáo.',
    initialRealm: 'Kim Đan Sơ Kỳ',
    realmIndex: 11,
    favoriteGifts: ['equipment', 'pill'],
    favoriteDescription: 'Thích Pháp Bảo tà mị, ma binh sắc bén cùng Cuồng Bạo Đan / Huyết Đan bạo phát sát khí.',
    buffs: {
      critDmgBonus: 25,
      lifestealPercent: 15,
      critRateBonus: 15,
      burnDrainChance: 30
    },
    secretBackground: 'Chàng có biết vì sao ta lại gia nhập Ma Giáo không? Năm xưa Cơ gia ta ở Trung Châu vốn là thế gia y đạo, nhưng đám ngụy quân tử danh môn chính phái vì dòm ngó tổ truyền Thần Châm mà tàn sát cả gia tộc ta! Ta phải nhảy xuống Vực Sâu U Minh, uống máu quỷ luyện ma công suốt mười năm mới sống sót trở về báo thù. Cả thiên hạ thóa mạ ta là Ma Nữ khát máu, chỉ có chàng đối xử với ta như một cô nương bình thường...',
    storyQuest: {
      id: 'quest_co_vo_diem',
      companionId: 'companion_co_vo_diem',
      title: 'U Hồn Minh Hoa',
      description: 'Cơ Vô Diễm cần U Hồn Hoa hoặc Huyết Thảo bồi bổ ma diễm bản mệnh và tế luyện U Minh Huyết Châu.',
      targetItemName: 'U Hồn Hoa / Huyết Tinh Thảo',
      targetItemType: 'herb',
      tokenReward: {
        name: 'U Minh Huyết Linh Châu',
        description: 'Hạt ma châu đượm huyết sắc diễm lệ, ngưng tụ một giọt tâm đầu huyết của Vô Diễm, bạo phát sát khí vô song và tăng tỉ lệ bạo kích.',
        icon: '🥀'
      },
      dialogueOnAccept: 'Tiểu tử, bản Thánh nữ đang luyện chế U Minh Quỷ Hỏa, thiếu một gốc hoa cỏ đượm huyết khí. Ngươi có dám vì ta mà xuống âm tuyền hái về không?',
      dialogueOnComplete: 'Không ngờ ngươi thật sự vì ta mà tìm được... Hạt U Minh Huyết Linh Châu này chứa tâm huyết của ta, đeo nó vào, nếu có ai dám đụng đến chàng, quỷ hỏa của ta sẽ thiêu rụi hồn phách kẻ đó!'
    },
    combinedSkill: {
      name: 'Huyết Diễm Ma Tiêu - Cửu U Chước Tâm',
      desc: 'Vô Diễm phóng thích Cửu U Quỷ Hỏa bao phủ chiến trường, người chơi vận sát khí ma đạo trảm thẳng vào linh đan Boss, thiêu đốt và trừ chân nguyên địch!',
      quote: 'Dám đả thương người của ta? Xuống Hoàng Tuyền mà sám hối đi!',
      damageMultiplier: 3.2,
      element: 'hoa',
      bonusEffect: 'Tăng 15% Bạo Kích & hiệu ứng Thiêu Đốt/Trừ Chân Nguyên địch'
    },
    realmDialogues: {
      truc_co: [
        'Tiểu tử Trúc Cơ như ngươi mà dám trêu ghẹo bản Thánh nữ à? Mau tu luyện cho mạnh lên, kẻo bị đám chính đạo bắt nạt!',
        'Dáng vẻ chàng khi khổ tu trông đáng yêu hơn lúc lúng túng nhiều đấy~'
      ],
      kim_dan: [
        'Kim Đan đại thành rồi sao? Tốt lắm, sau này ai ỷ mạnh hiếp yếu, hai ta cùng nhau tiêu diệt môn phái của chúng!',
        'Huyết khí sôi trào, đan hỏa rực sáng, ánh mắt chàng nhìn ta dường như càng thêm nồng nàn rồi...'
      ],
      hoa_than: [
        'Hóa Thần Chân Quân ngạo thị tam giới! Ai còn dám nói chàng si mê Ma Nữ là sai trái? Có chàng chống lưng, ta muốn làm loạn cửu thiên cũng chẳng ai cản nổi!'
      ]
    },
    dialogues: {
      so_thuc: [
        'Tiểu tử to gan, dám nhìn chằm chằm bản Thánh nữ như vậy... Ngươi không sợ bị ta móc mắt luyện cổ sao?',
        'Đám ngụy quân tử chính đạo ngoài miệng nhân nghĩa, chi bằng theo bản cô nương tự do tự tại?'
      ],
      hao_huu: [
        'Cầm lấy túi Huyết Hồn Tinh này đi, chớ để đám yêu thú trong bí cảnh xé xác, bổn cô nương còn muốn cùng ngươi đối ẩm.',
        'Chàng nhìn ngây ngô thế này, sao lại có can đảm đối kháng với Ma Giáo lẫn Chính Đạo vì ta chứ?'
      ],
      hong_nhan: [
        'Cả thiên hạ này quay lưng với chàng thì đã sao? Ta đem U Minh Quỷ Hỏa thiêu rụi bọn chúng là được!',
        'Đừng nhìn ta với ánh mắt si tình như vậy... Trái tim Ma Nữ này sắp bị chàng câu mất rồi đấy~'
      ],
      tinh_dau: [
        'Vô Diễm đời này không kính trời, chẳng phụng phật, chỉ nguyện cúi đầu khuất phục trước một mình chàng.',
        'Lập lời thề với ta đi! Dẫu xuống Hoàng Tuyền hay lên Bích Lạc, linh hồn hai ta vĩnh viễn không chia lìa!'
      ],
      song_tu: [
        'Ma khí và Tiên khí quấn quýt như rồng bay phượng múa... Huyết mạch sôi sục, bạo phát sát ý uy chấn cửu thiên!',
        'Phong tình triền miên, trong vòng tay chàng, U Minh Chi Hỏa cũng hóa thành cam lộ tẩy rửa kinh mạch linh đan.'
      ]
    }
  },
  {
    id: 'companion_diep_chi_ham',
    name: 'Diệp Chỉ Hàm',
    title: 'Thanh Mộc Y Tiên',
    gender: 'female',
    origin: 'Đan Đỉnh Tông',
    personality: 'Dịu dàng lương thiện, thiện giải nhân ý, một tay y thuật cải tử hồi sinh, khắp người thoang thoảng hương thơm thảo dược.',
    avatar: '🌿',
    avatarGradient: 'from-emerald-400 via-teal-500 to-green-300',
    quote: 'Đạo hữu lại bôn ba lịch luyện bị thương rồi sao? Mau lại đây, để Hàm nhi châm cứu và bôi linh cao cho người...',
    meetStory: 'Tại Dược Vương Cốc, ngươi tìm thấy một gốc ngàn năm Tiên Chi, tình cờ gặp Diệp Chỉ Hàm đang bị yêu thú canh giữ đan dược uy hiếp. Ngươi trảm thú hộ hoa, kết hạ thiện duyên.',
    initialRealm: 'Trúc Cơ Hậu Kỳ',
    realmIndex: 7,
    favoriteGifts: ['herb', 'ore'],
    favoriteDescription: 'Thích Dược Liệu quý hiếm, hoa cỏ dị thảo cùng Khoáng Thạch tinh hoa dùng để rèn đúc Đan Đỉnh.',
    buffs: {
      alchemySuccessBonus: 20,
      dailyRandomPill: true,
      hpRegenPercent: 8
    },
    secretBackground: 'Hàm nhi từ nhỏ đã lớn lên giữa mùi thuốc đắng của Đan Đỉnh Tông. Cha mẹ ta vì mải mê tìm kiếm thuốc tiên cứu người mà mất tích nơi Cấm Địa Thượng Cổ. Ta luôn tự nhủ phải học hết y thuật thiên hạ để không bao giờ phải nhìn người thân rời xa mình nữa. Thấy chàng mỗi lần chiến đấu đầy thương tích, lòng ta xót xa khôn nguôi... Đừng chỉ biết tiến về phía trước, hãy để Hàm nhi chăm sóc cho chàng.',
    storyQuest: {
      id: 'quest_diep_chi_ham',
      companionId: 'companion_diep_chi_ham',
      title: 'Vạn Thảo Phục Sinh',
      description: 'Diệp Chỉ Hàm cần Ngàn Năm Linh Chi hoặc Bào Tử Tẩy Tủy Chi để hoàn thiện đan phương Cửu Chuyển Hồi Thiên.',
      targetItemName: 'Tẩy Tủy Linh Chi / Dược Liệu Quý',
      targetItemType: 'herb',
      tokenReward: {
        name: 'Thanh Mộc Linh Túi',
        description: 'Túi thơm thêu tay chứa ngàn loại linh thảo quý báu, tỏa hương thơm ngát tịnh hóa độc khí, liên tục hồi phục % khí huyết trong chiến đấu.',
        icon: '🌿'
      },
      dialogueOnAccept: 'Chàng ơi, Hàm nhi đang nghiên cứu một lò đan có thể trị lành mọi nội thương, nhưng đang thiếu một gốc dược thảo ngàn năm... Chàng có thể giúp muội tìm kiếm không?',
      dialogueOnComplete: 'Ôi, chàng thật sự tìm được gốc linh thảo này rồi! Cảm ơn chàng... Túi hương này do chính tay Hàm nhi thêu, mang theo sẽ được sinh mệnh chi khí bảo hộ bình an!'
    },
    combinedSkill: {
      name: 'Thanh Mộc Phục Hồn - Vạn Cổ Trường Xuân',
      desc: 'Chỉ Hàm tế xuất Thần Mộc Sinh Cơ Trận hồi phục sinh mệnh cho người chơi, đồng thời mộc gai trói chặt gân mạch Boss, tước đoạt sinh mệnh lực!',
      quote: 'Thanh Mộc Hóa Sinh, Vạn Cổ Trường Xuân! Bảo hộ chàng chu toàn!',
      damageMultiplier: 2.5,
      element: 'moc',
      bonusEffect: 'Tự động hồi phục 8% HP mỗi hiệp đấu & thanh lọc độc chướng'
    },
    realmDialogues: {
      truc_co: [
        'Trúc Cơ là nền móng của tiên đồ, chàng nhớ uống đủ trà thanh nhiệt và chớ thức khuya luyện công nhé.',
        'Mỗi chén thuốc Hàm nhi sắc đều đượm chân tâm, chàng nhớ uống hết đấy.'
      ],
      kim_dan: [
        'Kim Đan viên mãn rồi, đan điền vững như bàn thạch! Hàm nhi mừng cho chàng lắm.',
        'Dù chàng có tu vi cao thế nào thì trong mắt muội, chàng vẫn là chàng ngốc năm ấy muội băng bó vết thương.'
      ],
      hoa_than: [
        'Hóa Thần vạn thọ vô cương! Từ nay Hàm nhi không còn phải lo lắng thọ nguyên của chàng nữa rồi... Muội nguyện cùng chàng du ngoạn nhân gian ngàn kiếp.'
      ]
    },
    dialogues: {
      so_thuc: [
        'Đạo hữu chớ vội, đây là Tĩnh Tâm Thảo mới hái, mang theo bên mình có thể xua tan độc chướng.',
        'Đan đạo huyền diệu khôn cùng, một ngọn cỏ một hạt cát đều ẩn chứa sinh mệnh chi đạo.'
      ],
      hao_huu: [
        'Hàm nhi vừa mới thử nghiệm đan phương cổ, luyện thành một lô Bổ Thiên Đan, đạo hữu nếm thử xem vị thế nào?',
        'Có chàng bảo hộ khi đi hái thuốc ở thung lũng sâu, ta cảm thấy an tâm hơn rất nhiều.'
      ],
      hong_nhan: [
        'Chàng suốt ngày liều mạng đột phá cảnh giới, nếu có mệnh hệ gì... Hàm nhi biết nương tựa vào ai?',
        'Mỗi lần nhìn thấy vết sẹo trên người chàng, tâm ta lại nhói đau như kim châm...'
      ],
      tinh_dau: [
        'Chỉ cần chàng bình an mạnh khỏe, cả đời này Hàm nhi nguyện làm dược đồng bên cạnh, sớm tối sắc thuốc cho chàng.',
        'Lấy thảo mộc vi thề, lấy đan tâm vi chứng, tình này tựa tùng bách xanh tươi, vạn năm không đổi dời.'
      ],
      song_tu: [
        'Thanh Mộc Tiên Khí dạt dào sinh cơ thẩm thấu vào tứ chi bách hải, vết thương vô hình lành lặn, đan điền bừng sáng.',
        'Hương thảo dược thoang thoảng trong màn trướng, thần thức hợp nhất, đan hỏa trong lòng chàng và ta cùng cộng hưởng viên mãn.'
      ]
    }
  },
  {
    id: 'companion_nam_cung_uyen',
    name: 'Nam Cung Uyển',
    title: 'Lôi Kiếm Tiên Cơ',
    gender: 'female',
    origin: 'Thiên Kiếm Các',
    personality: 'Kiếm tu thiên tài kiếm ý kinh thiên, quyết liệt kiêu hãnh, hào sảng dũng cảm, ghét ác như thù.',
    avatar: '⚡',
    avatarGradient: 'from-amber-400 via-yellow-500 to-violet-600',
    quote: 'Kiếm của ta sắc bén vô tình, nhưng chỉ vì chàng mà nguyện che chắn trước muôn ngàn phong ba bão táp.',
    meetStory: 'Tại Kiếm Chủng Vạn Kiếm Trận, ngươi và Nam Cung Uyển đồng thời cảm ứng được kiếm ý Cổ Kiếm, hai người kề vai sát cánh phá vỡ kiếm trận thượng cổ, kiếm tâm tương thông.',
    initialRealm: 'Kim Đan Trung Kỳ',
    realmIndex: 13,
    favoriteGifts: ['equipment', 'ore'],
    favoriteDescription: 'Thích Binh Khí, Kiếm Khí cùng Khoáng Thạch kim loại quý như Thiên Ngoại Vẫn Thiết, Huyền Lôi Thiết.',
    buffs: {
      atkBonusPercent: 20,
      bossAssistChance: 40,
      speedBonus: 35,
      lightningDamageBonus: 25
    },
    secretBackground: 'Từ khi sinh ra, ta đã mang Thiên Lôi Kiếm Cốt. Trưởng lão trong tộc ép ta đoạn tuyệt thất tình lục dục, lấy kiếm làm mạng, lấy sát phạt làm đạo. Suốt hai mươi năm, bên cạnh ta chỉ có tiếng sấm sét lạnh lẽo và lưỡi kiếm rướm máu. Chưa từng có ai hỏi ta có mệt không, có đau không... Cho đến ngày chàng đỡ nhát kiếm lôi đình ấy thay ta ở Vạn Kiếm Trận. Kiếm của ta từ khoảnh khắc đó đã tìm thấy lý do để tuốt vỏ.',
    storyQuest: {
      id: 'quest_nam_cung_uyen',
      companionId: 'companion_nam_cung_uyen',
      title: 'Kiếm Tâm Minh Thệ',
      description: 'Nam Cung Uyển cần Huyền Lôi Thiết hoặc Khoáng Thạch quý để tôi luyện lại thanh Lôi Kiếm bản mệnh.',
      targetItemName: 'Huyền Lôi Thiết / Khoáng Thạch',
      targetItemType: 'ore',
      tokenReward: {
        name: 'Cửu Tiêu Lôi Kiếm Phù',
        description: 'Lệnh phù kiếm quyết chứa đựng một sợi Lôi Đình Kiếm Ý cực hạn của Uyển nhi, giúp xuất kiếm thần tốc và gia tăng sát thương Lôi hệ.',
        icon: '⚡'
      },
      dialogueOnAccept: 'Này tên kia! Thanh kiếm của ta sau trận đại chiến kiếm trận đã bị mẻ một chút, cần khoáng thạch lôi hệ thượng thừa để rèn lại. Đi cùng ta tìm kiếm chứ?',
      dialogueOnComplete: 'Khoáng thạch này thuần khiết lắm! Kiếm đã rèn xong, tấm Lôi Kiếm Phù này tặng chàng... Cầm lấy, bất cứ khi nào chàng vung kiếm, kiếm ý của ta sẽ lập tức tiếp ứng!'
    },
    combinedSkill: {
      name: 'Thiên Kiếm Lôi Động - Cửu Tiêu Lôi Lạc',
      desc: 'Hai thanh kiếm hòa làm một dẫn động Cửu Thiên Huyền Lôi, vạn đạo sấm sét giáng xuống như thác lũ, xé toạc hộ thể của Boss!',
      quote: 'Song kiếm hợp bích, Cửu Tiêu Thần Lôi, trảm tận tà ma!',
      damageMultiplier: 3.5,
      element: 'loi',
      bonusEffect: 'Tăng 35 Tốc Độ ra chiêu & bạo phát sát thương Lôi Hệ kinh thiên'
    },
    realmDialogues: {
      truc_co: [
        'Trúc Cơ à? Kiếm pháp còn non nớt lắm, lại đây để ta luyện tập cùng chàng một trăm hiệp!',
        'Đừng có né tránh ánh mắt ta, nhìn thẳng vào mũi kiếm! Kiếm ý cần quyết đoán!'
      ],
      kim_dan: [
        'Khá lắm! Kim Đan Kiếm Ý của chàng đã bắt kịp bước chân ta rồi. Mau cùng ta đi trảm đại yêu thú nào!',
        'Kiếm chiêu hôm nay rất có khí phách, tối nay ta cho phép chàng cùng đối ẩm dưới trăng!'
      ],
      hoa_than: [
        'Hóa Thần Nhất Kiếm Phá Vạn Pháp! Không hổ danh là người Nam Cung Uyển ta nhìn trúng. Cùng ta đạp mây xông thẳng lên Cửu Trọng Thiên thôi!'
      ]
    },
    dialogues: {
      so_thuc: [
        'Ngươi cũng là kiếm tu sao? Rút kiếm ra, để ta xem kiếm ý của ngươi có xứng đáng đứng trước mặt ta không!',
        'Kiếm giả, sát phạt chi đạo. Lòng không vững thì kiếm tất loạn, đạo hữu cần ma luyện thêm.'
      ],
      hao_huu: [
        'Kiếm chiêu hôm nay của ngươi tiến bộ rất nhanh! Tối nay ta mời ngươi uống Liệt Hỏa Kiếm Tửu, không say không về!',
        'Hai thanh kiếm của chúng ta khi song đấu lại phát ra tiếng ngân nga đồng điệu, thật là kỳ lạ...'
      ],
      hong_nhan: [
        'Tên kia! Đừng có vừa luyện kiếm vừa nhìn lén ta... Làm ta phân tâm suýt đâm lệch chiêu rồi đấy!',
        'Nếu gặp phải Boss hay cường địch hung hiểm, nhớ gọi ta một tiếng. Lôi Kiếm này sinh ra là để bảo hộ chàng!'
      ],
      tinh_dau: [
        'Kiếm Tâm của Uyển nhi cả đời này chỉ nhận một chủ nhân, và trái tim ta cũng chỉ trao trọn cho một mình chàng.',
        'Cùng chàng ngự kiếm phi hành qua chín tầng mây, ngắm nhìn nhật nguyệt sơn hà, đây chính là Tiên Duyên mà ta hằng mong ước.'
      ],
      song_tu: [
        'Lôi đình cuồn cuộn hóa thành tơ tằm mềm mại bao bọc hai người... Kiếm ý thông linh, công kích bản thể bộc phát uy năng vô song!',
        'Sấm sét kinh thiên rền vang ngoài động phủ, nhưng trong lòng chỉ có sự ấm áp nồng nàn khi kiếm tâm và thể xác hòa làm một.'
      ]
    }
  },
  {
    id: 'companion_tan_vu_mong',
    name: 'Tần Vũ Mộng',
    title: 'Cổ Thần Luân Hồi Tàn Hồn',
    gender: 'female',
    origin: 'Thượng Cổ Luân Hồi Thần Tộc',
    personality: 'Thần bí khó lường, nhãn thông nhân quả tam giới, mang theo ký ức phong ấn từ thời Hồng Hoang.',
    avatar: '🌌',
    avatarGradient: 'from-fuchsia-600 via-purple-600 to-indigo-800',
    quote: 'Trải qua vạn kiếp luân hồi, nhân quả xoay vần, hóa ra người ta chờ đợi suốt ngàn vạn năm... chính là chàng.',
    meetStory: 'Khi khám phá Bí Cảnh Cổ Tộc Thất Lạc, ngươi dùng linh lực kích hoạt Thạch Bi Luân Hồi, đánh thức tàn hồn nữ tu Tần Vũ Mộng đang ngủ say trong băng tinh thượng cổ.',
    initialRealm: 'Kim Đan Hậu Kỳ',
    realmIndex: 16,
    favoriteGifts: ['manual', 'equipment'],
    favoriteDescription: 'Thích Công Pháp cổ đại, Cổ tịch bí bản, Pháp Bảo di tích thượng cổ hoặc Đan Dược cửu chuyển.',
    buffs: {
      ngoTinhBonus: 30,
      khiVanBonus: 30,
      unlockHiddenEncounters: true,
      soulBonus: 60,
      dodgeBonus: 15
    },
    secretBackground: 'Ta đã sống qua ba kỷ nguyên, chứng kiến thần ma đại chiến, tinh hà sụp đổ, chư thần vẫn lạc. Tộc nhân ta vì phong ấn Cổ Ma Hỗn Độn mà toàn bộ tan biến vào vòng xoay luân hồi. Ta giữ lại một luồng tàn hồn ngủ say trong băng thạch suốt vạn năm, chờ đợi người có linh hồn mang ấn ký Hỗn Độn sơ khai. Chàng chính là ánh sáng duy nhất xuyên qua bóng đêm ngàn năm thức tỉnh ta... Đời này, dẫu luân hồi tan vỡ, ta cũng quyết bảo hộ chàng an yên.',
    storyQuest: {
      id: 'quest_tan_vu_mong',
      companionId: 'companion_tan_vu_mong',
      title: 'Luân Hồi Tàn Ký',
      description: 'Tần Vũ Mộng cần Luân Hồi Cổ Tịch hoặc Pháp Bảo Thượng Cổ để khôi phục ký ức thần tộc bị phong ấn.',
      targetItemName: 'Bí Kíp Cổ / Pháp Bảo Thượng Cổ',
      targetItemType: 'manual',
      tokenReward: {
        name: 'Thái Cổ Luân Hồi Giám',
        description: 'Gương đồng cổ khắc văn tự Hồng Hoang bí ẩn, soi rõ nhân quả kiếp trước kiếp này, tăng mạnh Thần Thức và né tránh đòn chí mạng.',
        icon: '🌌'
      },
      dialogueOnAccept: 'Vận mệnh dẫn lối chúng ta gặp gỡ. Nhưng ký ức thần tộc của ta còn thiếu một mảnh ghép cổ tịch... Chàng có thể tìm lại giúp Vũ Mộng không?',
      dialogueOnComplete: 'Ký ức vạn năm cuối cùng đã thức tỉnh trọn vẹn... Tấm Thái Cổ Luân Hồi Giám này là bảo vật trấn tộc của ta, trao cho chàng. Nó sẽ giúp chàng thấy trước tử kiếp và né tránh mọi hiểm nguy!'
    },
    combinedSkill: {
      name: 'Thái Cổ Luân Hồi - Tịch Diệt Tinh Hà',
      desc: 'Vũ Mộng mở ra Luân Hồi Chi Nhãn, nghịch chuyển thời gian và nhân quả. Thần thức bão táp bóp nghẹt Boss, vô hiệu hóa đòn sát thương địch!',
      quote: 'Nhân quả xoay vần, Luân Hồi Tịch Diệt! Phá toái hư không!',
      damageMultiplier: 3.0,
      element: 'am',
      bonusEffect: 'Tăng 60 Thần Thức & tăng 15% Né Tránh đòn chí mạng'
    },
    realmDialogues: {
      truc_co: [
        'Trúc Cơ chỉ là giọt nước giữa biển trời luân hồi, giữ vững tâm cảnh, chớ để hồng trần mê hoặc.',
        'Mỗi bước chàng đi hôm nay, vạn năm trước ta dường như đã từng trông thấy...'
      ],
      kim_dan: [
        'Kim Đan Bất Hủ, nhân quả bắt đầu gắn kết sâu sắc. Vận mệnh của ta và chàng đã bện chặt không thể tách rời.',
        'Ngồi bên chàng, ta ngỡ như thời gian ngưng đọng, không còn sợ hãi bóng tối cô tịch nữa.'
      ],
      hoa_than: [
        'Hóa Thần quy chân, nhìn thấu hư vọng! Chàng đã thức tỉnh sức mạnh có thể sánh ngang Cổ Thần. Hãy cùng ta viết tiếp thiên chương mới của tam giới!'
      ]
    },
    dialogues: {
      so_thuc: [
        'Ngươi mang theo luồng khí tức rất quen thuộc... Chẳng lẽ nhân quả từ kiếp trước vẫn chưa dứt đoạn?',
        'Thời gian như nước chảy qua kẽ tay, thương hải tang điền, phàm nhân như thiêu thân lao đầu vào lửa...'
      ],
      hao_huu: [
        'Ký ức cổ xưa của ta đang dần thức tỉnh. Đây là tàn trang của Thái Cổ Thần Pháp, tặng chàng tìm hiểu ngộ tính.',
        'Ngồi bên chàng ngắm sao trời, ta dường như tìm lại được hơi ấm của vạn năm về trước.'
      ],
      hong_nhan: [
        'Ta đã thấy trước vô số tương lai trong luân hồi kính, nhưng tương lai có chàng bên cạnh... là tương lai đẹp đẽ nhất.',
        'Dù ký ức có tan biến thêm lần nữa, linh hồn ta vẫn sẽ khắc ghi hình bóng chàng vào sâu tận luân hồi.'
      ],
      tinh_dau: [
        'Vượt qua vạn dặm hồng trần, chịu đựng ngàn năm cô tịch, đổi lấy một kiếp cùng chàng kết tóc se duyên, đáng giá lắm.',
        'Vận mệnh bện chặt, nhân quả đã định. Từ nay về sau, chàng là Tiên Lữ duy nhất của Vũ Mộng!'
      ],
      song_tu: [
        'Cổ Thần Luân Hồi Chi Lực mở rộng thức hải! Ngộ tính và Khí vận thiên địa hội tụ như thủy triều, ngộ đạo thông suốt!',
        'Vòng xoay luân hồi dừng lại khoảnh khắc này, trong cõi hỗn mang vô định, hai luồng linh thức bện chặt vĩnh hằng.'
      ]
    }
  },
  {
    id: 'companion_long_thien_nhi',
    name: 'Long Thiền Nhi',
    title: 'Thái Cổ Chân Long Nữ',
    gender: 'female',
    origin: 'Đông Hải Long Cung',
    personality: 'Cao ngạo, thích bảo vật lấp lánh, ham ăn long tủy thảo.',
    avatar: '🐉',
    avatarGradient: 'from-amber-500 via-yellow-400 to-emerald-400',
    quote: 'Bản công chúa xuất thân Thái Cổ Chân Long, bảo vật phàm tục sao lọt vào mắt... Trừ phi ngươi đem Long Tủy Thảo tới đây!',
    meetStory: 'Tại đáy vực sâu Đông Hải, ngươi giải cứu một tiểu ấu long bị vướng vào Toa Long Trận thời thượng cổ, nào ngờ nàng hóa hình thành tuyệt sắc Chân Long Nữ Long Thiền Nhi.',
    initialRealm: 'Kim Đan Đỉnh Phong',
    realmIndex: 14,
    favoriteGifts: ['ore', 'pill'],
    favoriteDescription: 'Thích Khoáng Thạch phẩm cao lấp lánh và Đan Dược tôi thể hàm chứa long lực dồi dào.',
    buffs: {
      hpBonusPercent: 25,
      stunBossChance: 20,
      defBonusPercent: 20
    },
    secretBackground: 'Ta là nữ nhi duy nhất của Đông Hải Long Hoàng, sinh ra đã mang huyết mạch Ngũ Trảo Kim Long thuần khiết. Nhưng long tộc ngày càng suy thoái, các thúc bá ngày đêm dòm ngó long châu bản mệnh của ta. Năm ấy phụ hoàng bế quan nghìn năm, ta bị kẻ gian hãm hại đày vào Toa Long Trận dưới đáy biển sâu muôn trượng... Ngươi là kẻ phàm nhân đầu tiên không vì tham lam long giác của ta mà liều mạng phá trận cứu ta. Từ ngày đó, trong mắt Chân Long này, cả tam giới chỉ có ngươi là đáng để ta trông cậy.',
    storyQuest: {
      id: 'quest_long_thien_nhi',
      companionId: 'companion_long_thien_nhi',
      title: 'Tâm Nguyện: Tìm Lại Long Thần Thạch',
      description: 'Long Thiền Nhi muốn khôi phục Long Thần Thạch bị phân tán để củng cố Chân Long Chân Thân. Hãy tìm một viên Khoáng Thạch phẩm cao dâng tặng nàng.',
      targetItemName: 'Khoáng Thạch Thượng Phẩm / Tiên Phẩm',
      targetItemType: 'ore',
      tokenReward: {
        name: 'Nghịch Lân Chân Long',
        description: 'Vảy rồng ngược quý giá nhất của Thái Cổ Chân Long, gia trì hộ thể bất hoại, tăng 25% HP tối đa, vạn tà bất xâm.',
        icon: '🛡️'
      },
      dialogueOnAccept: 'Ngươi thực sự muốn giúp bản công chúa tìm Long Thần Thạch sao? Hừm... nếu tìm được, ta sẽ ban thưởng cho ngươi vật báu quý nhất của Long tộc!',
      dialogueOnComplete: 'Long Thần Thạch đây rồi! Đa tạ ngươi... Đây là Nghịch Lân chân thân của ta trao cho ngươi, từ nay chân long này sẽ vĩnh viễn chở che cho đạo hữu!'
    },
    combinedSkill: {
      name: 'Long Khiếu Cửu Thiên',
      desc: 'Chân Long ngâm vang chín tầng trời, thiên uy chấn nhiếp khiến địch nhân hồn xiêu phách tán, bị định thân bất động.',
      quote: 'Thái Cổ Chân Long, hiệu triệu lôi đình, Long Khiếu Cửu Thiên, trấn sát yêu ma!',
      damageMultiplier: 2.2,
      element: 'kim',
      bonusEffect: 'Gây Choáng 1 hiệp & Tăng 25% Khí Huyết (HP) tối đa'
    },
    dialogues: {
      so_thuc: [
        'Ngươi nhìn cái gì? Chưa thấy Chân Long Nữ xinh đẹp tuyệt trần bao giờ sao?',
        'Đông Hải của ta rộng lớn vô biên, phàm nhân như ngươi tu hành ngàn năm cũng chưa chắc vượt hết.',
        'Mang khoáng thạch lấp lánh đến đây, bản công chúa có thể sẽ bớt khó tính với ngươi một chút!'
      ],
      hao_huu: [
        'Ngươi cũng không đến nỗi nhàm chán như mấy lão rùa già ở Long Cung.',
        'Lần trước viên đan dược ngươi đưa, vị cũng không tệ... Còn nữa không?',
        'Đạo hữu, có rảnh thì cùng ta lặn xuống Đông Hải ngắm san hô ngàn năm đi!'
      ],
      hong_nhan: [
        'Mỗi khi ngươi bế quan lâu, Long Cung bỗng trở nên quạnh quẽ đến lạ kỳ...',
        'Có người dám khi dễ ngươi sao? Nói cho ta biết, ta dìm hắn xuống đáy Đông Hải làm mồi cho tôm cá!',
        'Bảo vật trong Long Cung ta có thể không cần, nhưng ngươi... tuyệt đối không được rời xa tầm mắt ta.'
      ],
      tinh_dau: [
        'Long tộc cả đời chỉ dâng Nghịch Lân cho một người duy nhất... Đạo hữu, ngươi hiểu ý ta chứ?',
        'Nguyện cùng ngươi phi thăng tiên giới, trường sinh cửu thị, chân long này đời đời kiếp kiếp theo bước chân chàng.',
        'Chỉ cần chàng khẽ gọi, dẫu cách vạn dặm trùng dương, Thiền Nhi cũng sẽ đạp sóng xé gió tới bên chàng!'
      ],
      song_tu: [
        'Long khí cùng Chân nguyên đan xen, khí huyết dâng trào như hải triều cuộn sóng, nhục thân và thần hồn đồng thời thăng hoa vi diệu!',
        'Hơi thở Chân Long hòa quyện vào huyết mạch, kinh mạch được rồng thần gột rửa, khí thế ngút trời!',
        'Long ngâm phượng minh, âm dương hòa hợp, thiên địa nhật nguyệt dường như cũng phải nghiêng mình trước tiên duyên này.'
      ]
    },
    realmDialogues: {
      truc_co: ['Trúc Cơ rồi sao? Cũng khá đấy, nhưng so với long tộc sơ sinh vẫn còn yếu lắm, cố lên!'],
      kim_dan: ['Kim Đan ngưng tụ, khí tức có chút uy nghiêm rồi, xứng đáng làm bạn đồng hành của bản công chúa!'],
      hoa_than: ['Hóa Thần xuất khiếu! Đạo hữu quả nhiên thiên phú dị bẩm, phụ hoàng ta mà thấy ắt cũng phải khen ngợi chàng!']
    }
  },
  {
    id: 'companion_da_mong_ly',
    name: 'Dạ Mộng Ly',
    title: 'Cửu Vĩ Thiên Hồ Yêu Hoàng',
    gender: 'female',
    origin: 'Vạn Yêu Lãnh Địa',
    personality: 'Quyến rũ mị hoặc, cơ trí giảo hoạt nhưng chung tình.',
    avatar: '🦊',
    avatarGradient: 'from-purple-600 via-pink-500 to-indigo-400',
    quote: 'Thế gian gọi ta là yêu nghiệt mị hoặc chúng sinh... Nhưng chúng sinh đâu biết, ngàn năm qua ta chỉ đợi một ánh mắt của người.',
    meetStory: 'Trong màn sương tím mộng ảo tại Huyễn Vực Vạn Yêu, ngươi cứu thoát Cửu Vĩ Thiên Hồ bị vây khốn bởi Thiên La Địa Võng của Ma môn.',
    initialRealm: 'Nguyên Anh Sơ Kỳ',
    realmIndex: 16,
    favoriteGifts: ['herb', 'pill'],
    favoriteDescription: 'Thích Thảo Dược quý hiếm và Đan Dược dưỡng nhan, tẩm bổ thần hồn.',
    buffs: {
      speedBonus: 20,
      merchantDiscountPercent: 30,
      enemyAtkReduction: 30,
      critRateBonus: 15
    },
    secretBackground: 'Yêu tộc luôn bị tam giới xem là dị loại khát máu. Ta từ nhỏ đã phải tranh đấu giữa bầy sói đói nơi Vạn Yêu Lãnh Địa, khoác lên mình bộ mặt mị hoặc giảo hoạt để bảo vệ bộ tộc Cửu Vĩ. Nhưng trong nội tâm, ta chán ghét sự dối trá lọc lừa ấy. Ngày ngươi xé toạc Thiên La Địa Võng cứu ta, đôi mắt ngươi nhìn ta không hề có sự tham lam hay tà dâm, chỉ có sự thương xót chân thành. Kể từ giây phút ấy, Cửu Vĩ này đã thề trọn đời chỉ múa khúc Nghê Thường cho một mình chàng thưởng thức.',
    storyQuest: {
      id: 'quest_da_mong_ly',
      companionId: 'companion_da_mong_ly',
      title: 'Tâm Nguyện: Thu Hoạch Cửu Diệp Huyễn Mộng Thảo',
      description: 'Dạ Mộng Ly cần Cửu Diệp Huyễn Mộng Thảo để ổn định chín đuôi yêu lực. Hãy tìm một nhành Thảo Dược quý tặng nàng.',
      targetItemName: 'Thảo Dược Thượng Phẩm / Tiên Phẩm',
      targetItemType: 'herb',
      tokenReward: {
        name: 'Thiên Hồ Chi Tâm',
        description: 'Viên ngọc hộ mệnh kết tinh từ chín đuôi Thiên Hồ, giúp chủ nhân nhìn thấu hư ảo, tăng tốc độ và mê hoặc thương gia giảm giá.',
        icon: '🪞'
      },
      dialogueOnAccept: 'Chàng thực sự vì Mộng Ly mà đi tìm linh dược sao? Yêu tộc giảo hoạt, cẩn thận kẻo bị ta lừa mất trái tim đấy chàng ngốc~',
      dialogueOnComplete: 'Linh thảo thuần khiết quá... Cảm tạ chàng. Nhận lấy Thiên Hồ Chi Tâm này đi, nó mang một phần linh hồn của ta, sẽ bảo hộ chàng bình an vô sự.'
    },
    combinedSkill: {
      name: 'Huyễn Mộng Mê Hồn',
      desc: 'Chín đuôi thiên hồ bung tỏa ảo cảnh mộng mị, làm suy yếu ý chí và giảm 30% Công Kích của đối thủ.',
      quote: 'Hồng trần như mộng, say tỉnh ai hay... Chìm sâu vào cõi mộng ảo của Mộng Ly đi!',
      damageMultiplier: 2.0,
      element: 'hoa',
      bonusEffect: 'Giảm 30% Công Kích đối thủ & Tăng 20% Tốc Độ'
    },
    dialogues: {
      so_thuc: [
        'Đạo hữu nhìn ngơ ngẩn như vậy, cẩn thận bị mị thuật của hồ ly câu mất hồn phách đấy nhé~',
        'Vạn Yêu Lãnh Địa nguy hiểm khôn lường, muốn theo ta thì phải có bản lĩnh thực sự đấy!',
        'Món quà này cũng có chút thành ý, Mộng Ly tạm thời nhận lấy vậy.'
      ],
      hao_huu: [
        'Hôm nay sắc mặt chàng không tốt, để Mộng Ly xoa bóp ấn đường cho chàng nhé?',
        'Người ngoài nói hồ ly đa đoan, nhưng chàng đã đối đãi thật lòng, Mộng Ly tuyệt không phụ chàng.',
        'Đến Vạn Bảo Thương Hội cứ nói là người của ta, bọn họ không dám bán đắt cho chàng nửa phân linh thạch!'
      ],
      hong_nhan: [
        'Chín cái đuôi này ấm áp lắm, chàng có muốn tựa đầu vào nghỉ ngơi một chút không?',
        'Dẫu thiên hạ xua đuổi chàng, biến thành ma đạo, Mộng Ly vẫn cam lòng cùng chàng đọa lạc.',
        'Ánh mắt chàng nhìn ta lúc này... khiến trái tim ngàn năm băng giá của yêu hoàng cũng phải rung động.'
      ],
      tinh_dau: [
        'Thiên Hồ một khi đã động chân tình thì ngàn kiếp không phai... Cả thân thể lẫn linh hồn này, giờ đều là của chàng.',
        'Nguyện cùng chàng đạp phá cửu thiên, dẫu phải thiêu đốt chín cái đuôi sinh mệnh cũng quyết không rời xa.',
        'Chàng là bến đỗ duy nhất mà con hồ ly lang bạt này muốn tìm về giữa tam giới hỗn loạn.'
      ],
      song_tu: [
        'Hồ mị chi thuật hòa quyện cùng tiên đạo thuần dương, âm dương giao hòa mãnh liệt, thần thức như lạc vào cõi tiên cảnh đê mê bồng bềnh!',
        'Chín đuôi thiên hồ dịu dàng bao bọc hai người, yêu lực tinh thuần chuyển hóa thành sinh cơ vô tận rót vào đan điền.',
        'Mị nhãn như tơ, hơi thở ngọt ngào như hoa lan, hai luồng linh lực quấn quýt không rời khiến cảnh giới dâng trào tột độ.'
      ]
    },
    realmDialogues: {
      truc_co: ['Trúc Cơ tiểu đệ đệ, cẩn thận kẻo bị tỷ tỷ trêu chọc đến đỏ mặt đấy nhé~'],
      kim_dan: ['Kim Đan đại thành rồi, khí tức nam tử hán bộc lộ rõ rệt, khiến lòng dạ Mộng Ly xốn xang khôn xiết~'],
      hoa_than: ['Hóa Thần Đại Năng! Chàng bây giờ đã đủ sức che chở cho cả Vạn Yêu Lãnh Địa của ta rồi đấy!']
    }
  },
  {
    id: 'companion_kiem_linh_to_tam',
    name: 'Kiếm Linh Tố Tâm',
    title: 'Vạn Kiếm Quy Thần Kiếm Linh',
    gender: 'female',
    origin: 'Thượng Cổ Kiếm Chủng',
    personality: 'Vô tình vô dục, thuần túy vì kiếm đạo, lòng son dạ sắt.',
    avatar: '🗡️',
    avatarGradient: 'from-slate-400 via-zinc-200 to-amber-300',
    quote: 'Ta là kiếm, kiếm là ta. Mười vạn năm ngủ say trong kiếm chủng, cho tới khi nghe thấy tiếng kiếm ngân của người.',
    meetStory: 'Tại Thượng Cổ Kiếm Chủng ngập tràn kiếm khí sắc bén, ngươi dùng Kiếm Ý kiên cường thuần phục Cổ Kiếm Thần Binh, thức tỉnh Kiếm Linh Tố Tâm thuần khiết.',
    initialRealm: 'Nguyên Anh Đỉnh Phong',
    realmIndex: 18,
    favoriteGifts: ['ore', 'equipment'],
    favoriteDescription: 'Thích Khoáng Thạch rèn kiếm thượng cổ và Pháp Bảo kiếm khí để tôi luyện thân kiếm kiếm thể.',
    buffs: {
      critDmgBonus: 35,
      swordManualBonusPercent: 15,
      atkBonusPercent: 20
    },
    secretBackground: 'Ta là linh hồn của Tru Tiên Thần Kiếm thời viễn cổ, trải qua vạn trận đại chiến phong thần mà chủ nhân đều đã vẫn lạc. Mười vạn năm chôn vùi trong hoang phế, kiếm thể rỉ sét, lòng ta sớm đã lãnh đạm vô tình, coi vạn vật như cỏ rác. Nhiều kẻ tự xưng kiếm tiên đến Kiếm Chủng hòng cưỡng ép thu phục ta đều bị kiếm khí chém nát hồn phách. Duy chỉ có ngươi, đem máu đầu ngón tay nhỏ lên thân kiếm, nói rằng muốn làm bạn cùng kiếm chứ không phải nô dịch kiếm. Chính sự chân thành ấy đã thắp lại hơi ấm cho kiếm tâm mục nát của ta.',
    storyQuest: {
      id: 'quest_kiem_linh_to_tam',
      companionId: 'companion_kiem_linh_to_tam',
      title: 'Tâm Nguyện: Thu Hồi Kiếm Phách Thần Tinh',
      description: 'Tố Tâm muốn tẩy rửa rỉ sét trên kiếm thể bằng Khoáng Thạch thượng cổ. Hãy tìm một khối Khoáng Thạch trân quý giúp nàng.',
      targetItemName: 'Khoáng Thạch Thượng Phẩm / Tiên Phẩm',
      targetItemType: 'ore',
      tokenReward: {
        name: 'Bản Mệnh Kiếm Phôi',
        description: 'Mảnh kiếm phôi tinh khiết nhất sinh ra từ kiếm tâm của Tố Tâm, tăng 35% Sát Thương Bạo Kích và 15% Uy Lực Kiếm Pháp.',
        icon: '⚔️'
      },
      dialogueOnAccept: 'Kiếm thể của ta còn chút tàn khuyết. Nếu có khoáng thạch thần tinh bồi bổ, kiếm ý sẽ hoàn mỹ không tì vết. Nhờ cậy đạo hữu.',
      dialogueOnComplete: 'Khoáng thạch hòa tan vào kiếm cốt... Kiếm minh thanh thúy chưa từng có. Tố Tâm trao Bản Mệnh Kiếm Phôi này cho người, kiếm này vĩnh viễn vì người mà chém!'
    },
    combinedSkill: {
      name: 'Vạn Kiếm Tru Tiên Trận',
      desc: 'Triệu hoán vạn thanh linh kiếm phong tỏa bát phương, bạo kích sát thương kinh hoàng 250% xuyên phá mọi phòng ngự.',
      quote: 'Vạn kiếm quy tông, nhân kiếm hợp nhất, Tru Tiên xuất thế, trảm diệt quần ma!',
      damageMultiplier: 2.5,
      element: 'kim',
      bonusEffect: 'Bạo kích sát thương 250% & Tăng 35% Sát Thương Bạo Kích'
    },
    dialogues: {
      so_thuc: [
        'Kiếm giả, sát phạt chi đạo. Tâm ngươi nếu bất định, thanh kiếm này sẽ làm tổn thương chính ngươi.',
        'Ta là kiếm linh, không biết hỉ nộ ái ố của nhân gian. Chỉ biết chém kẻ thù ngáng đường.',
        'Khoáng thạch này chứa kiếm ý thuần khiết, ta sẽ dùng nó để mài sắc kiếm phong.'
      ],
      hao_huu: [
        'Kiếm ý của ngươi ngày càng kiên định. Đi cùng ngươi, kiếm phong của ta không hề run rẩy.',
        'Mỗi khi ngươi vung kiếm, ta đều cảm nhận được nhịp đập linh hồn ngươi.',
        'Thế gian này người hiểu kiếm rất ít, nhưng ngươi là người hiểu ta nhất.'
      ],
      hong_nhan: [
        'Trước kia ta tưởng mình chỉ là một món binh khí giết chóc... Từ khi có ngươi, ta mới biết kiếm cũng có linh hồn và ấm áp.',
        'Dù đối thủ là Chân Tiên hay Ma Tôn, chỉ cần ngươi chỉ kiếm, Tố Tâm quyết không lùi nửa bước.',
        'Nếu có ngày kiếm này gãy vụn, kiếm hồn của ta cũng sẽ hóa thành giáp trụ bảo vệ ngươi.'
      ],
      tinh_dau: [
        'Nhân kiếm hợp nhất, tâm ý tương thông. Cả đời này, Tố Tâm chỉ nhận một mình ngươi làm Kiếm Chủ, làm Phu Quân.',
        'Kiếm tâm đã khắc ghi hình bóng chàng, đời đời kiếp kiếp, kiếm ở người ở, kiếm mất người chưa chắc mất vì ta sẽ chết thay chàng!',
        'Không cần thiên đạo công nhận, chỉ cần chàng nắm lấy chuôi kiếm của ta, đó chính là thiên trường địa cửu.'
      ],
      song_tu: [
        'Kiếm khí sắc bén hóa thành nhu tình ôn nhu, hai luồng kiếm ý giao hòa tẩy tủy phạt mao, kinh mạch thông suốt như vạn kiếm quy tông!',
        'Thần hồn dung hợp trong kiếm giới vô tận, kiếm tâm thông minh, đốn ngộ vô thượng kiếm đạo huyền diệu khôn cùng!',
        'Sát phạt tan biến, chỉ còn lại sự ấm áp chân tình giữa kiếm chủ và kiếm linh, chân nguyên cuồn cuộn không ngừng sinh sôi.'
      ]
    },
    realmDialogues: {
      truc_co: ['Trúc Cơ cảnh giới kiếm ý sơ thành, cần mài giũa thêm ngàn vạn lần mới thành thần binh.'],
      kim_dan: ['Kim Đan ngưng kiếm nang, kiếm khí đã có thể xuất khiếu chém địch ngoài ngàn dặm, tiến bộ rất nhanh!'],
      hoa_than: ['Vô kiếm thắng hữu kiếm! Đạo hữu đã chạm tới ngưỡng cửa Kiếm Đạo Hóa Thần, Tố Tâm kính phục!']
    }
  },
  ...TIER_COMPANIONS_DEFINITIONS
];

// Map tra cứu nhanh theo ID
export const COMPANIONS_MAP: Record<string, CompanionDefinition> = COMPANIONS_DATA.reduce((acc, comp) => {
  acc[comp.id] = comp;
  return acc;
}, {} as Record<string, CompanionDefinition>);

// ============================================
// HÀM KHỞI TẠO VÀ CHUẨN HÓA TRẠNG THÁI ĐẠO LỮ
// ============================================

export function createDefaultCompanionPlayerState(id: string): CompanionPlayerState {
  return {
    id,
    isMet: false,
    affinity: 0,
    isBonded: false,
    bondedAt: undefined,
    lastSongTuTime: 0,
    lastChatTime: 0,
    totalSongTuCount: 0,
    questStarted: false,
    questCompleted: false,
    tokenEquipped: false,
    assignedGarden: false,
    lastSongTuType: 'tu_vi'
  };
}

export function createDefaultCompanionsState(): CompanionsDataState {
  const companions: Record<string, CompanionPlayerState> = {};
  COMPANIONS_DATA.forEach(c => {
    companions[c.id] = createDefaultCompanionPlayerState(c.id);
  });

  return {
    activeCompanionId: null,
    stationedGardenCompanionId: null,
    tamThanHopNhatUntil: 0,
    companions,
    tamTinhThanDieuUntil: 0
  };
}

// ============================================
// HỆ THỐNG TẶNG QUÀ CHO ĐẠO LỮ
// ============================================

export function calculateGiftAffinity(
  companion: CompanionDefinition,
  itemType: 'pill' | 'herb' | 'ore' | 'equipment' | 'manual',
  itemGrade?: string,
  itemName?: string
): { basePoints: number; finalPoints: number; isFavorite: boolean; message: string } {
  const name = itemName || '';

  // Quà tặng độc quyền tăng mạnh +30 đến +35 Hảo Cảm theo đúng sở thích của từng Tiên Tử
  if (
    (companion.id === 'companion_lac_thanh_tuyet' && name.includes('Băng Tinh Ngọc Trâm')) ||
    (companion.id === 'companion_long_thien_nhi' && name.includes('Long Tủy Thần Chi')) ||
    (companion.id === 'companion_da_mong_ly' && name.includes('Cửu Vĩ Linh Châu')) ||
    (companion.id === 'companion_kiem_linh_to_tam' && name.includes('Cổ Kiếm Tàn Phiến')) ||
    ((companion.id === 'companion_diep_chi_ham' || companion.id === 'companion_lieu_nhu_yen') && name.includes('Thanh Mộc Linh Hồ')) ||
    ((companion.id === 'companion_tan_vu_mong' || companion.id === 'companion_so_linh_nhi' || companion.id === 'companion_co_vo_diem') && name.includes('Thất Thải Lưu Ly Trâm'))
  ) {
    return {
      basePoints: 30,
      finalPoints: 30,
      isFavorite: true,
      message: `Tặng [${name}] trân quý độc nhất vô nhị cho ${companion.name}! Nàng vô cùng xúc động, ánh mắt ngập tràn nhu tình! (Hảo cảm +30)`
    };
  }

  if (companion.id === 'companion_nam_cung_uyen' && name.includes('Huyền Âm Phượng Bội')) {
    return {
      basePoints: 35,
      finalPoints: 35,
      isFavorite: true,
      message: `Tặng [${name}] chí bảo thiên phượng cho ${companion.name}! Phượng khí cộng hưởng, nàng mỉm cười đón nhận với vạn phần dịu dàng! (Hảo cảm +35)`
    };
  }

  let basePoints = 5;

  if (itemGrade === 'Thần Phẩm' || itemGrade === 'Tiên Phẩm' || itemGrade === 'Thiên Giai') {
    basePoints = 25;
  } else if (itemGrade === 'Cực Phẩm' || itemGrade === 'Địa Giai' || itemGrade === 'Ngũ Phẩm') {
    basePoints = 18;
  } else if (itemGrade === 'Thượng Phẩm' || itemGrade === 'Huyền Giai' || itemGrade === 'Tứ Phẩm') {
    basePoints = 12;
  } else if (itemGrade === 'Trung Phẩm' || itemGrade === 'Hoàng Giai' || itemGrade === 'Tam Phẩm') {
    basePoints = 8;
  } else {
    basePoints = 5;
  }

  // Quà hợp sở thích tăng GẤP ĐÔI hảo cảm!
  const isFavorite = companion.favoriteGifts.includes(itemType);
  const finalPoints = isFavorite ? basePoints * 2 : basePoints;

  let message = `Tặng [${itemName || 'Bảo Vật'}] cho ${companion.name}, hảo cảm tăng +${finalPoints}!`;
  if (isFavorite) {
    message += ` (Món quà đúng sở thích của nàng, hảo cảm nhân đôi!)`;
  }

  return {
    basePoints,
    finalPoints,
    isFavorite,
    message
  };
}

// ============================================
// CÁC HÌNH THỨC SONG TU ĐẶC THÙ (ADVANCED DUAL CULTIVATION)
// ============================================

export type DualCultivationType = 'tu_vi' | 'linh_luc' | 'tam_than' | 'luyen_the';

export interface DualCultivationOption {
  type: DualCultivationType;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  effectSummary: string;
  costDescription?: string;
}

export const DUAL_CULTIVATION_OPTIONS: DualCultivationOption[] = [
  {
    type: 'tu_vi',
    name: 'Thổ Nạp Tu Vi',
    subtitle: 'Âm Dương Hòa Hợp',
    icon: '✨',
    color: 'text-amber-300',
    gradient: 'from-amber-950/70 to-yellow-950/70 border-amber-500/50',
    description: 'Vận chuyển chu thiên âm dương giao hòa, thu nạp lượng Tu Vi khổng lồ và kích hoạt Tâm Tịnh Thần Diệu.',
    effectSummary: 'Nhận lượng lớn Tu Vi + Buff giảm 50% sát thương Tâm Ma (24h).'
  },
  {
    type: 'linh_luc',
    name: 'Linh Lực Quán Thông',
    subtitle: 'Sinh Cơ Tái Tạo',
    icon: '💧',
    color: 'text-sky-300',
    gradient: 'from-sky-950/70 to-blue-950/70 border-sky-500/50',
    description: 'Hai bên vận chuyển linh tuyền tương thông, gột rửa kinh mạch, lập tức hồi phục trọn vẹn trạng thái bản thể.',
    effectSummary: 'Hồi phục tức thì 100% Khí Huyết (HP) & 100% Chân Nguyên (MP).'
  },
  {
    type: 'tam_than',
    name: 'Tâm Thần Hợp Nhất',
    subtitle: 'Thái Hư Nhập Định',
    icon: '🔮',
    color: 'text-purple-300',
    gradient: 'from-purple-950/70 to-fuchsia-950/70 border-purple-500/50',
    description: 'Thần thức cộng hưởng thâm sâu, đắm chìm vào cõi Thái Hư, tăng cường ngộ đạo và tốc độ tu luyện bế quan.',
    effectSummary: 'Tăng +20% Tốc Độ Tu Luyện bế quan liên tục trong 12 giờ kế tiếp.'
  },
  {
    type: 'luyen_the',
    name: 'Luyện Thể Song Tu',
    subtitle: 'Huyết Khí Thần Thông',
    icon: '🔥',
    color: 'text-rose-300',
    gradient: 'from-rose-950/70 to-red-950/70 border-rose-500/50',
    description: 'Dẫn động khí huyết chân nguyên rèn đúc nhục thân, tôi luyện cốt tủy, tăng mạnh tiến độ Tôi Thể bản thể.',
    effectSummary: 'Tiêu hao 10 Tinh Huyết -> Tăng vọt điểm kinh nghiệm Nhục Thân/Tôi Thể.',
    costDescription: 'Tiêu hao 10 Tinh Huyết'
  }
];

// ============================================
// TÍNH TOÁN TU VI SONG TU THỔ NẠP
// ============================================

export function calculateSongTuTuViGain(playerRealm: number, companionRealmIndex: number): number {
  const baseReward = 12000;
  const playerPart = Math.max(1, playerRealm + 1) * 4500;
  const companionPart = Math.max(1, companionRealmIndex + 1) * 5500;
  return baseReward + playerPart + companionPart;
}

// ============================================
// TỔNG HỢP BUFF TỪ TẤT CẢ ĐẠO LỮ ĐÃ KẾT DUYÊN
// ============================================

export function getBondedCompanionBuffs(player: PlayerStats): CompanionBuff {
  const result: CompanionBuff = {
    cultivateSpeedBonus: 0,
    tamMaDamageReduction: 0,
    critDmgBonus: 0,
    lifestealPercent: 0,
    alchemySuccessBonus: 0,
    dailyRandomPill: false,
    atkBonusPercent: 0,
    bossAssistChance: 0,
    ngoTinhBonus: 0,
    khiVanBonus: 0,
    unlockHiddenEncounters: false,
    iceResistance: 0,
    freezeChance: 0,
    critRateBonus: 0,
    burnDrainChance: 0,
    hpRegenPercent: 0,
    speedBonus: 0,
    lightningDamageBonus: 0,
    soulBonus: 0,
    dodgeBonus: 0,
    hpBonusPercent: 0,
    stunBossChance: 0,
    defBonusPercent: 0,
    merchantDiscountPercent: 0,
    enemyAtkReduction: 0,
    swordManualBonusPercent: 0
  };

  const state = player.companionsState;
  if (!state || !state.companions) return result;

  Object.values(state.companions).forEach(pState => {
    if (pState.isBonded) {
      const def = COMPANIONS_MAP[pState.id];
      if (def && def.buffs) {
        const b = def.buffs;
        if (b.cultivateSpeedBonus) result.cultivateSpeedBonus = (result.cultivateSpeedBonus || 0) + b.cultivateSpeedBonus;
        if (b.tamMaDamageReduction) result.tamMaDamageReduction = (result.tamMaDamageReduction || 0) + b.tamMaDamageReduction;
        if (b.critDmgBonus) result.critDmgBonus = (result.critDmgBonus || 0) + b.critDmgBonus;
        if (b.lifestealPercent) result.lifestealPercent = (result.lifestealPercent || 0) + b.lifestealPercent;
        if (b.alchemySuccessBonus) result.alchemySuccessBonus = (result.alchemySuccessBonus || 0) + b.alchemySuccessBonus;
        if (b.dailyRandomPill) result.dailyRandomPill = true;
        if (b.atkBonusPercent) result.atkBonusPercent = (result.atkBonusPercent || 0) + b.atkBonusPercent;
        if (b.bossAssistChance) result.bossAssistChance = Math.max(result.bossAssistChance || 0, b.bossAssistChance);
        if (b.ngoTinhBonus) result.ngoTinhBonus = (result.ngoTinhBonus || 0) + b.ngoTinhBonus;
        if (b.khiVanBonus) result.khiVanBonus = (result.khiVanBonus || 0) + b.khiVanBonus;
        if (b.unlockHiddenEncounters) result.unlockHiddenEncounters = true;
        if (b.iceResistance) result.iceResistance = (result.iceResistance || 0) + b.iceResistance;
        if (b.freezeChance) result.freezeChance = (result.freezeChance || 0) + b.freezeChance;
        if (b.critRateBonus) result.critRateBonus = (result.critRateBonus || 0) + b.critRateBonus;
        if (b.burnDrainChance) result.burnDrainChance = (result.burnDrainChance || 0) + b.burnDrainChance;
        if (b.hpRegenPercent) result.hpRegenPercent = (result.hpRegenPercent || 0) + b.hpRegenPercent;
        if (b.speedBonus) result.speedBonus = (result.speedBonus || 0) + b.speedBonus;
        if (b.lightningDamageBonus) result.lightningDamageBonus = (result.lightningDamageBonus || 0) + b.lightningDamageBonus;
        if (b.soulBonus) result.soulBonus = (result.soulBonus || 0) + b.soulBonus;
        if (b.dodgeBonus) result.dodgeBonus = (result.dodgeBonus || 0) + b.dodgeBonus;
        if (b.hpBonusPercent) result.hpBonusPercent = (result.hpBonusPercent || 0) + b.hpBonusPercent;
        if (b.stunBossChance) result.stunBossChance = Math.max(result.stunBossChance || 0, b.stunBossChance);
        if (b.defBonusPercent) result.defBonusPercent = (result.defBonusPercent || 0) + b.defBonusPercent;
        if (b.merchantDiscountPercent) result.merchantDiscountPercent = Math.max(result.merchantDiscountPercent || 0, b.merchantDiscountPercent);
        if (b.enemyAtkReduction) result.enemyAtkReduction = Math.max(result.enemyAtkReduction || 0, b.enemyAtkReduction);
        if (b.swordManualBonusPercent) result.swordManualBonusPercent = (result.swordManualBonusPercent || 0) + b.swordManualBonusPercent;
      }
    }
  });

  return result;
}

// ============================================
// HÀM LẤY LỜI THOẠI & THƠ CA THEO CẢNH GIỚI VÀ HẢO CẢM
// ============================================

export function getCompanionDialogue(
  companion: CompanionDefinition,
  affinity: number,
  playerRealmIndex?: number
): string {
  // Có 40% tỉ lệ kích hoạt lời thoại phản ứng theo cảnh giới hiện tại nếu có
  if (playerRealmIndex !== undefined && companion.realmDialogues && Math.random() < 0.45) {
    if (playerRealmIndex >= 20 && companion.realmDialogues.hoa_than && companion.realmDialogues.hoa_than.length > 0) {
      const list = companion.realmDialogues.hoa_than;
      return list[Math.floor(Math.random() * list.length)];
    } else if (playerRealmIndex >= 10 && companion.realmDialogues.kim_dan && companion.realmDialogues.kim_dan.length > 0) {
      const list = companion.realmDialogues.kim_dan;
      return list[Math.floor(Math.random() * list.length)];
    } else if (companion.realmDialogues.truc_co && companion.realmDialogues.truc_co.length > 0) {
      const list = companion.realmDialogues.truc_co;
      return list[Math.floor(Math.random() * list.length)];
    }
  }

  const tier = getAffinityTier(affinity).tier;
  const list = companion.dialogues[tier] || companion.dialogues.so_thuc;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

export function getCompanionSongTuFlavor(companion: CompanionDefinition): string {
  const list = companion.dialogues.song_tu;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

// ============================================
// HÀM TRỢ CHIẾN & LINH ĐIỀN ĐỘNG PHỦ
// ============================================

export function getStationedCompanionGardenBonus(player: PlayerStats): {
  isStationed: boolean;
  companion?: CompanionDefinition;
  speedBonusPercent: number;
  bonusYieldChance: number;
} {
  const compId = player.linhDien?.stationedCompanionId || player.companionsState?.stationedGardenCompanionId;
  if (!compId) {
    return { isStationed: false, speedBonusPercent: 0, bonusYieldChance: 0 };
  }
  const companion = COMPANIONS_MAP[compId];
  return {
    isStationed: true,
    companion,
    speedBonusPercent: 15, // Giảm 15% thời gian sinh trưởng
    bonusYieldChance: 0.35 // 35% tỉ lệ thu hoạch thêm thảo dược biến dị/ngàn năm
  };
}
