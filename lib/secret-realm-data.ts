// lib/secret-realm-data.ts
// Dữ liệu Bí Cảnh Thượng Cổ & Hệ Thống Đa Tầng Roguelite (Dungeon Crawler Tiên Hiệp)

import {
  SecretRealmDungeon,
  DungeonBuff,
  DungeonRoomType,
  DungeonRoomChoice
} from '@/lib/types';
import { createGem } from '@/lib/forging-gem-data';

// ============================================
// 1. DANH SÁCH ĐẠI BÍ CẢNH CỔ ĐẠI
// ============================================

export const ANCIENT_SECRET_REALMS: SecretRealmDungeon[] = [
  {
    id: 'bicanh_u_minh_co_lam',
    name: 'U Minh Cổ Lâm',
    minRealm: 3, // Luyện Khí Tầng 3
    realmName: 'Luyện Khí Tầng 3+',
    mpCost: 20,
    totalFloors: 5,
    difficulty: 'luyen_khi',
    description: 'Rừng trúc u tối ngập tràn khí u minh ngàn năm, nơi chôn giấu tàn cốt và cơ duyên của ma tu thời cổ đại.',
    hazards: ['U Minh Lam Vụ', 'Độc Chu Phục Kích', 'Mê Hồn Cổ Trận'],
    rewardsPreview: 'U Minh Thảo, Huyền Thiết Khoáng, Linh Thạch, Linh Ngọc Ngũ Hành Cấp 1'
  },
  {
    id: 'bicanh_huyet_ma_dong_phu',
    name: 'Huyết Ma Động Phủ',
    minRealm: 11, // Trúc Cơ Sơ Kỳ
    realmName: 'Trúc Cơ Sơ Kỳ+',
    mpCost: 35,
    totalFloors: 7,
    difficulty: 'truc_co',
    description: 'Động phủ cổ xưa của Huyết Ma Thượng Nhân, máu huyết ngưng tụ thành tinh thạch đỏ thẫm và cấm chế tàn sát đẫm máu.',
    hazards: ['Huyết Trì Sôi Sục', 'Huyết Bức Cuồng Nộ', 'Huyết Hồn Trảm Cổ Trận'],
    rewardsPreview: 'Huyết Tinh Thảo, U Tinh Thạch, Huyết Ma Đan, Linh Ngọc Cấp 2, Bảo Khí'
  },
  {
    id: 'bicanh_cuu_u_hac_uyen',
    name: 'Cửu U Hắc Uyên',
    minRealm: 16, // Kim Đan Sơ Kỳ
    realmName: 'Kim Đan Sơ Kỳ+',
    mpCost: 50,
    totalFloors: 8,
    difficulty: 'kim_dan',
    description: 'Vực sâu không đáy thông suốt cửu u minh phủ, âm phong thấu cốt và ma vật viễn cổ ẩn nấp trong bóng tối vĩnh hằng.',
    hazards: ['Cửu U Âm Phong', 'Oán Linh Thủy Triều', 'Vực Ngoại Huyễn Không'],
    rewardsPreview: 'Cửu U Minh Thạch, Thái Hư Thảo, Linh Ngọc Cấp 3, Cổ Bảo Thượng Phẩm'
  },
  {
    id: 'bicanh_chan_ma_co_mo',
    name: 'Chân Ma Cổ Mộ',
    minRealm: 21, // Nguyên Anh Sơ Kỳ
    realmName: 'Nguyên Anh Sơ Kỳ+',
    mpCost: 75,
    totalFloors: 10,
    difficulty: 'nguyen_anh',
    description: 'Lăng mộ chôn cất Chân Ma Thượng Cổ, vạn kiếp ma niệm vẫn chưa tiêu tán, tràn ngập ma bảo và cấm kỵ thiên cổ.',
    hazards: ['Chân Ma Sát Khí', 'Thi Vương Hóa Thần', 'Cổ Ma Phệ Hồn Trận'],
    rewardsPreview: 'Thái Ất Thần Kim, Ngàn Năm Tẩy Tủy Chi, Lôi Linh Ngọc Cấp 4, Thần Binh Cổ'
  },
  {
    id: 'bicanh_thai_hu_huyen_canh',
    name: 'Thái Hư Huyễn Cảnh',
    minRealm: 26, // Hóa Thần Sơ Kỳ
    realmName: 'Hóa Thần Sơ Kỳ+',
    mpCost: 100,
    totalFloors: 12,
    difficulty: 'hoa_than',
    description: 'Bí cảnh hư ảo do Thái Hư Chân Tiên lưu lại, thời không hỗn loạn, ảo cảnh luân hồi ẩn chứa chân lý đại đạo.',
    hazards: ['Thời Không Liệt Phùng', 'Tâm Ma Luân Hồi Kiếp', 'Thái Hư Hủy Diệt Quang'],
    rewardsPreview: 'Hỗn Độn Thần Tinh, Bát Hoang Thần Thảo, Hồng Hoang Linh Ngọc Cấp 5, Tiên Thiên Linh Bảo'
  },
  // Giữ lại 4 bí cảnh kinh điển để tương thích dữ liệu cũ
  {
    id: 'bicanh_rung_truc',
    name: 'Bí Cảnh Rừng Trúc U Tịch',
    minRealm: 0,
    realmName: 'Phàm Nhân / Luyện Khí',
    mpCost: 15,
    totalFloors: 3,
    difficulty: 'luyen_khi',
    description: 'Rừng trúc cổ thụ bao phủ bởi màn sương độc và tàn tích trận pháp cổ xưa của ẩn sĩ tu tiên.',
    hazards: ['Độc Chướng Trúc Lâm', 'Thanh Xà Tập Kích', 'Mê Tung Cổ Trận'],
    rewardsPreview: 'Tụ Linh Thảo, Huyền Thiết, Túi Linh Thạch, Tàn Trang Tụ Khí Quyết'
  },
  {
    id: 'bicanh_hoa_diem_son',
    name: 'Hỏa Diệm Sơn Cổ Giới',
    minRealm: 11,
    realmName: 'Trúc Cơ / Kim Đan',
    mpCost: 30,
    totalFloors: 5,
    difficulty: 'truc_co',
    description: 'Vùng đất dung nham sôi sục dưới lòng đất sâu, nơi chôn vùi bảo tàng của Xích Diễm Hỏa Tộc.',
    hazards: ['Dung Nham Bộc Phát', 'Hỏa Nha Cuồng Bạo', 'Hãm Địa Viêm Hỏa Trận'],
    rewardsPreview: 'Huyết Tinh Thảo, Hàn Băng Thần Tinh, Bí Tịch Huyền Giai, Linh Thạch phong phú'
  },
  {
    id: 'bicanh_van_kiem_trung',
    name: 'Vạn Kiếm Trũng Cổ Mộ',
    minRealm: 21,
    realmName: 'Nguyên Anh / Hóa Thần',
    mpCost: 50,
    totalFloors: 7,
    difficulty: 'nguyen_anh',
    description: 'Nơi an nghỉ của vạn thanh bảo kiếm cổ đại, kiếm khí vẫn tung hoành sau hàng vạn năm.',
    hazards: ['Kiếm Khí Loạn Lưu', 'Kiếm Ma Oán Hồn', 'Tru Tiên Tàn Trận Cổ'],
    rewardsPreview: 'Thái Ất Tinh Kim, Tẩy Tủy Linh Chi, Bí Tịch Vạn Kiếm Quy Tông, Rương Tiên Ngọc'
  },
  {
    id: 'bicanh_hu_khong_phe_tich',
    name: 'Hư Không Phế Tích Vực Ngoại',
    minRealm: 31,
    realmName: 'Luyện Hư / Hợp Thể Trở Lên',
    mpCost: 80,
    totalFloors: 9,
    difficulty: 'tien_de',
    description: 'Di tích cung điện trôi nổi ngoài rìa không gian, nguy cơ thời không vặn xoắn và cổ ma ẩn nấp.',
    hazards: ['Hư Không Phong Bạo', 'Phệ Hồn Trùng Quần', 'Thời Không Loạn Lưu Vực'],
    rewardsPreview: 'Cửu U Minh Thạch, Hóa Thần Linh Diệp, Thần Đan, Bí Tịch Thiên Giai'
  }
];

export const SECRET_REALM_DUNGEONS = ANCIENT_SECRET_REALMS;

export function getDungeonById(id: string): SecretRealmDungeon {
  return ANCIENT_SECRET_REALMS.find(d => d.id === id) || ANCIENT_SECRET_REALMS[0];
}

// ============================================
// 2. POOL THẦN CHÚC TẾ ĐÀN (ALTAR BUFFS)
// ============================================

export const ALTAR_BUFFS: DungeonBuff[] = [
  {
    id: 'buff_huyet_sat',
    name: 'Huyết Sát Thần Chúc',
    description: 'Khai mở huyết mạch cuồng bạo, tăng mạnh lực tấn công nhưng hao tổn một phần nhục thân.',
    statBonus: {
      congKichPercent: 20
    }
  },
  {
    id: 'buff_huyen_quy',
    name: 'Huyền Quy Chi Thuẫn',
    description: 'Hóa hư ảnh cự quy hộ thể, giảm thiểu thương tích từ đòn đánh của yêu ma.',
    statBonus: {
      phongNguPercent: 25
    }
  },
  {
    id: 'buff_linh_xa',
    name: 'Linh Xà Thệ Ngôn',
    description: 'Hấp thụ sinh mệnh của kẻ địch chuyển hóa thành khí huyết bổ sung bản thân.',
    statBonus: {
      hutMauRate: 10
    }
  },
  {
    id: 'buff_thien_co_nhan',
    name: 'Thiên Cơ Chi Nhãn',
    description: 'Thần thức mẫn cảm nhìn thấu sơ hở trong chiêu thức của yêu thú.',
    statBonus: {
      baoKichRate: 15
    }
  },
  {
    id: 'buff_loi_dinh',
    name: 'Lôi Đình Bá Lực',
    description: 'Thiên lôi ngưng tụ đầu mũi kiếm, mỗi đòn bạo kích tạo nên dư chấn kinh hồn.',
    statBonus: {
      baoKichRate: 8,
      phanDmgRate: 15
    }
  },
  {
    id: 'buff_phan_kich',
    name: 'Kim Cang Phản Phệ',
    description: 'Phản đòn sát thương vật lý trực tiếp về phía kẻ ra tay tấn công.',
    statBonus: {
      phanDmgRate: 20
    }
  }
];

// ============================================
// 3. POOL CẠM BẪY CỔ ĐẠI (TRAP TEMPLATES)
// ============================================

export interface TrapTemplate {
  id: string;
  name: string;
  checkStat: 'ngoTinh' | 'tocDo' | 'canCot' | 'khiVan';
  checkStatLabel: string;
  threshold: number;
  description: string;
  successNarrative: string;
  failureNarrative: string;
  damagePercent: number; // % HP mất khi dính bẫy
  mpCost: number;        // MP mất khi dính bẫy
}

export const TRAP_TEMPLATES: TrapTemplate[] = [
  {
    id: 'trap_cuu_cung',
    name: 'Cửu Cung Tru Ma Trận',
    checkStat: 'ngoTinh',
    checkStatLabel: 'Ngộ Tính',
    threshold: 40,
    description: 'Trận đồ cửu cung biến hóa khôn lường, yêu cầu thần trí minh mẫn để giải toán trận nhãn.',
    successNarrative: 'Ngươi tập trung tinh thần, trong chớp mắt nhìn thấu quy luật vận hành của Cửu Cung Trận, nhẹ nhàng hóa giải cấm chế!',
    failureNarrative: 'Trận pháp bộc phát sát khí! Ngươi không kịp tìm ra sinh môn, bị luồng linh áp sắc bén đánh lùi, tâm thần phản phệ!',
    damagePercent: 15,
    mpCost: 10
  },
  {
    id: 'trap_van_tien',
    name: 'Vạn Tiễn Quy Tông Trận',
    checkStat: 'tocDo',
    checkStatLabel: 'Thân Pháp Tốc Độ',
    threshold: 60,
    description: 'Hàng vạn mũi tiễn cương thiểm bắn ra như mưa từ vách đá ngầm.',
    successNarrative: 'Thân pháp như ảo ảnh lướt gió, ngươi uyển chuyển né tránh toàn bộ mũi tiễn sắc nhọn mà không mảy may trầy xước!',
    failureNarrative: 'Mưa tên dày đặc! Dù ngươi đã cố sức che chắn, kiếm tiễn vẫn sượt qua hộ thể cương khí gây nội thương!',
    damagePercent: 20,
    mpCost: 5
  },
  {
    id: 'trap_doc_vu',
    name: 'Hóa Huyết Độc Vụ',
    checkStat: 'canCot',
    checkStatLabel: 'Căn Cốt Nhục Thân',
    threshold: 45,
    description: 'Khói độc đỏ thắm rỉ ra từ rễ cây cổ thụ, có khả năng ăn mòn chân khí và hủy hoại kinh mạch.',
    successNarrative: 'Nhục thân kiên cố như bàn thạch! Căn cốt cường đại của ngươi bài trừ toàn bộ độc tố ra khỏi lỗ chân lông.',
    failureNarrative: 'Độc khí xâm nhập kinh lạc! Ngươi cảm thấy khí huyết đảo lộn, toàn thân nhói buốt như vạn ti châm chọc!',
    damagePercent: 25,
    mpCost: 15
  },
  {
    id: 'trap_hu_khong',
    name: 'Hư Không Loạn Lưu Vực',
    checkStat: 'khiVan',
    checkStatLabel: 'Khí Vận Thiên Mệnh',
    threshold: 30,
    description: 'Vết nứt không gian trôi dạt vô định, lúc ẩn lúc hiện trong mật thất.',
    successNarrative: 'Được hồng phúc tề thiên bảo hộ, ngươi vô tình bước lùi một bước, vừa vặn né được vết nứt không gian nuốt chửng!',
    failureNarrative: 'Vết nứt hư không bỗng nhiên bộc phát ngay dưới chân! Hư không cuồng bạo xé rách đạo bào và làm tiêu tán chân nguyên!',
    damagePercent: 18,
    mpCost: 20
  }
];

// ============================================
// 4. POOL TÀNG BẢO CỔ RƯƠNG (CHEST TIERS)
// ============================================

export interface ChestTierConfig {
  type: 'silver' | 'gold' | 'celestial';
  name: string;
  badgeClass: string;
  minLinhThach: number;
  maxLinhThach: number;
  gemChance: number;
  gemLevel: number;
  oreCount: number;
  manualChance?: number;
}

export const CHEST_TIERS: Record<'silver' | 'gold' | 'celestial', ChestTierConfig> = {
  silver: {
    type: 'silver',
    name: 'Cổ Mộc Bảo Hòm',
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-600',
    minLinhThach: 1000,
    maxLinhThach: 3000,
    gemChance: 0.4,
    gemLevel: 1,
    oreCount: 3,
    manualChance: 0.15
  },
  gold: {
    type: 'gold',
    name: 'Hoàng Kim Linh Hòm',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/60',
    minLinhThach: 4000,
    maxLinhThach: 10000,
    gemChance: 0.8,
    gemLevel: 2,
    oreCount: 8,
    manualChance: 0.40
  },
  celestial: {
    type: 'celestial',
    name: 'Thái Hư Thần Hòm',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/60 animate-pulse',
    minLinhThach: 15000,
    maxLinhThach: 35000,
    gemChance: 1.0,
    gemLevel: 3,
    oreCount: 15,
    manualChance: 0.80
  }
};

// ============================================
// 5. YÊU THÚ & BOSS TRẤN TẦNG (MONSTER POOLS)
// ============================================

export interface MonsterProfile {
  name: string;
  title: string;
  icon: string;
  isBoss?: boolean;
}

export const MONSTER_NAMES: Record<string, { regular: MonsterProfile[]; boss: MonsterProfile[] }> = {
  default: {
    regular: [
      { name: 'U Hồn Huyết Chu', title: 'Yêu Thú Hạ Phẩm', icon: '🕷️' },
      { name: 'Hắc Lân Xà Ma', title: 'Độc Thú Rừng Thiêng', icon: '🐍' },
      { name: 'Cuồng Bạo Ma Viên', title: 'Thú Cổ Bạo Tàn', icon: '🦍' },
      { name: 'Oán Hồn Kiếm Nô', title: 'Kiếm Hồn U Uất', icon: '👻' }
    ],
    boss: [
      { name: 'U Minh Ma Viên Vương', title: 'Thống Lãnh Tầng Lâm', icon: '👹', isBoss: true },
      { name: 'Cửu U Huyết Mãng', title: 'Thủ Hộ Thần Thú Cổ Trận', icon: '🐉', isBoss: true },
      { name: 'Thiên Cương Ma Tướng', title: 'Hộ Giới Tàn Hồn', icon: '⚔️', isBoss: true }
    ]
  }
};
