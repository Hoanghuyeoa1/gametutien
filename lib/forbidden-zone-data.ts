// lib/forbidden-zone-data.ts
// Dữ liệu 5 Đại Sinh Tử Cấm Khu (Thái Cổ Cấm Địa)

import { ForbiddenZoneConfig, ForbiddenZoneId } from '@/lib/types/forbidden-zone';

export const FORBIDDEN_ZONES: Record<ForbiddenZoneId, ForbiddenZoneConfig> = {
  hoang_co: {
    id: 'hoang_co',
    name: 'Hoang Cổ Cấm Địa',
    title: 'Sinh Tử Tuyệt Cảnh Cổ Đại',
    minRealmId: 31, // Luyện Hư Sơ Kỳ
    minRealmName: 'Luyện Hư Sơ Kỳ',
    gridSize: 6, // 6x6
    bgGradient: 'from-amber-950 via-stone-900 to-slate-950',
    borderTheme: 'border-amber-600/60',
    accentColor: 'text-amber-400',
    description:
      'Vùng đất bị thời gian ngưng trệ, cổ thụ vạn trượng che khuất nhật nguyệt, hoang thú viễn cổ gầm rống trong bóng tối hỗn mang.',
    environmentalEffectName: 'Hoang Khí Xâm Thực',
    environmentalEffectDesc:
      'Áp chế 15% Tốc độ; mỗi 5 bước đi trừ 3% Khí Huyết nếu Căn Cốt < 150.',
    mpCost: 1500,
    baseAura: 100,
    monsterPool: [
      { name: 'Hoang Cổ Huyết Dực Điêu', title: 'Hoang Thú', powerRatio: 0.85, hpRatio: 0.9, dropExp: 15000, dropStones: 3000 },
      { name: 'Thái Cổ Man Ngưu Tinh', title: 'Viễn Cổ Yêu Thú', powerRatio: 1.0, hpRatio: 1.1, dropExp: 22000, dropStones: 4500 },
      { name: 'U Lạc Độc Hạc', title: 'Cấm Khu Hung Linh', powerRatio: 1.15, hpRatio: 0.95, dropExp: 28000, dropStones: 5500 },
    ],
    bossInfo: {
      name: 'Thôn Thiên Cự Mãng Tàn Hồn',
      title: 'Thái Cổ Hung Thú',
      powerRatio: 1.5,
      hpRatio: 1.8,
      dropExp: 65000,
      dropStones: 20000,
    },
    specialDrops: [
      { id: 'hoang_co_cot', name: 'Hoang Thú Cổ Cốt', rate: 0.7, grade: 'Thượng Phẩm', desc: 'Xương cốt hoang thú chứa thần lực man hoang', type: 'material' },
      { id: 'huyet_linh_chi_van_nien', name: 'Vạn Niên Huyết Linh Chi', rate: 0.5, grade: 'Cực Phẩm', desc: 'Dược liệu ngưng tụ huyết khí trời đất', type: 'pill' },
      { id: 'hoang_tinh_huyet', name: 'Hoang Cổ Tinh Huyết', rate: 0.35, grade: 'Thần Phẩm', desc: 'Một giọt máu tôi luyện thể phách bất diệt', type: 'treasure' },
    ],
  },

  tang_tien: {
    id: 'tang_tien',
    name: 'Táng Tiên Thiên Uyên',
    title: 'Kiếm Vực Táng Tiên Chi Uyên',
    minRealmId: 41, // Đại Thừa Sơ Kỳ
    minRealmName: 'Đại Thừa Sơ Kỳ',
    gridSize: 6, // 6x6
    bgGradient: 'from-cyan-950 via-slate-900 to-slate-950',
    borderTheme: 'border-cyan-500/60',
    accentColor: 'text-cyan-400',
    description:
      'Vực sâu vạn trượng nơi vạn tiên vẫn lạc trong đại kiếp thời viễn cổ. Vạn đạo vô chủ kiếm khí tung hoành cắt nát hư không.',
    environmentalEffectName: 'Loạn Lưu Kiếm Khí',
    environmentalEffectDesc:
      'Cạm bẫy kiếm khí giật sát thương ngẫu nhiên; có cơ hội nhặt được Tàn Kiếm Thần Binh và Thái Ất Thần Kim.',
    mpCost: 3500,
    baseAura: 100,
    monsterPool: [
      { name: 'Kiếm Hồn Vô Chủ', title: 'Táng Tiên Oán Niệm', powerRatio: 1.0, hpRatio: 0.9, dropExp: 35000, dropStones: 8000 },
      { name: 'Cương Thi Tiên Binh', title: 'Tử Khí Hài Cốt', powerRatio: 1.2, hpRatio: 1.3, dropExp: 45000, dropStones: 11000 },
      { name: 'Tru Tiên Kiếm Linh Tàn Thể', title: 'Thần Binh Tàn Linh', powerRatio: 1.35, hpRatio: 1.1, dropExp: 55000, dropStones: 15000 },
    ],
    bossInfo: {
      name: 'Vạn Tiên Kiếm Trủng Chi Chủ',
      title: 'Táng Kiếm Thần Ma',
      powerRatio: 1.7,
      hpRatio: 2.0,
      dropExp: 120000,
      dropStones: 45000,
    },
    specialDrops: [
      { id: 'thai_at_than_kim', name: 'Thái Ất Thần Kim', rate: 0.6, grade: 'Thượng Phẩm', desc: 'Thần kim bất hoại tôi luyện phi kiếm vô thượng', type: 'material' },
      { id: 'tan_kiem_than_binh', name: 'Tiên Kiếm Tàn Phiến', rate: 0.4, grade: 'Cực Phẩm', desc: 'Mảnh vỡ thượng phẩm tiên kiếm cổ xưa', type: 'weapon' },
      { id: 'bat_diet_kiem_tuy', name: 'Bất Diệt Kiếm Tủy', rate: 0.25, grade: 'Thần Phẩm', desc: 'Kiếm ý bất diệt uẩn dưỡng thần niệm', type: 'treasure' },
    ],
  },

  luan_hoi_hai: {
    id: 'luan_hoi_hai',
    name: 'U Minh Luân Hồi Hải',
    title: 'Tử Hải Bất Quy Lộ',
    minRealmId: 46, // Độ Kiếp Sơ Kỳ
    minRealmName: 'Độ Kiếp Sơ Kỳ',
    gridSize: 7, // 7x7
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    borderTheme: 'border-purple-600/60',
    accentColor: 'text-purple-400',
    description:
      'Vùng biển đen chết chóc tĩnh lặng tuyệt đối, tử khí cuồn cuộn che lấp thức hải, vòng xoáy luân hồi chôn vùi lục đạo chúng sinh.',
    environmentalEffectName: 'Tử Khí Hủ Hồn',
    environmentalEffectDesc:
      'Sương mù dày đặc bóp nghẹt thức hải; Tâm Cảnh bị ăn mòn 1 điểm mỗi khi di chuyển 3 bước.',
    mpCost: 6000,
    baseAura: 100,
    monsterPool: [
      { name: 'U Minh Ngục Tốt', title: 'Tử Dạ Quỷ Thần', powerRatio: 1.15, hpRatio: 1.0, dropExp: 60000, dropStones: 16000 },
      { name: 'Vong Xuyên Thủy Quái', title: 'Luân Hồi Nghịch Thú', powerRatio: 1.35, hpRatio: 1.3, dropExp: 75000, dropStones: 22000 },
      { name: 'Bát Nhã Tà Tăng', title: 'Đọa Lạc Tiên Hồn', powerRatio: 1.5, hpRatio: 1.25, dropExp: 90000, dropStones: 28000 },
    ],
    bossInfo: {
      name: 'Luân Hồi Minh Chủ Tàn Ảnh',
      title: 'U Minh Tôn Giả',
      powerRatio: 1.9,
      hpRatio: 2.3,
      dropExp: 220000,
      dropStones: 75000,
    },
    specialDrops: [
      { id: 'u_minh_huyen_thuy', name: 'U Minh Huyền Thủy', rate: 0.6, grade: 'Thượng Phẩm', desc: 'Dòng nước cực âm tẩy uế tạp niệm', type: 'material' },
      { id: 'luan_hoi_thach', name: 'Luân Hồi Thạch', rate: 0.35, grade: 'Cực Phẩm', desc: 'Đá luân hồi hiểu thấu sinh tử đạo tắc', type: 'treasure' },
      { id: 'diem_la_dan', name: 'Cửu Chuyển Diêm La Đan', rate: 0.2, grade: 'Thần Phẩm', desc: 'Nghịch chuyển sinh tử, tái sinh thần hồn', type: 'pill' },
    ],
  },

  than_ma_mo: {
    id: 'than_ma_mo',
    name: 'Thần Ma Mộ Địa',
    title: 'Thái Cổ Cổ Mộ Trủng',
    minRealmId: 56, // Chân Tiên Sơ Kỳ
    minRealmName: 'Chân Tiên Sơ Kỳ',
    gridSize: 7, // 7x7
    bgGradient: 'from-red-950 via-zinc-900 to-slate-950',
    borderTheme: 'border-red-600/60',
    accentColor: 'text-red-400',
    description:
      'Bãi chiến trường Thái Cổ chôn cất cự thần vạn trượng cùng ma đầu thiên ngoại. Thần uy và ma khí đan xen kết thành sát trận thiên địa.',
    environmentalEffectName: 'Thần Ma Uy Áp',
    environmentalEffectDesc:
      'Áp chế 20% Công Thủ toàn diện; là nơi duy nhất khai quật được Hồn Tinh Thái Cổ và Đế Khí Tàn Mảnh.',
    mpCost: 12000,
    baseAura: 100,
    monsterPool: [
      { name: 'Thần Binh Tàn Hài', title: 'Thần Khu Cương Thi', powerRatio: 1.35, hpRatio: 1.2, dropExp: 110000, dropStones: 35000 },
      { name: 'Chân Ma Thị Huyết Khuyển', title: 'Thiên Ngoại Ma Thú', powerRatio: 1.55, hpRatio: 1.4, dropExp: 140000, dropStones: 45000 },
      { name: 'Viễn Cổ Thần Tướng Chiến Hồn', title: 'Bất Khuất Anh Hồn', powerRatio: 1.75, hpRatio: 1.5, dropExp: 180000, dropStones: 60000 },
    ],
    bossInfo: {
      name: 'Thái Cổ Ma Thần Tàn Khu',
      title: 'Hỗn Thế Ma Tôn',
      powerRatio: 2.2,
      hpRatio: 2.8,
      dropExp: 450000,
      dropStones: 160000,
    },
    specialDrops: [
      { id: 'hon_tinh_thai_co', name: 'Hồn Tinh Thái Cổ', rate: 0.5, grade: 'Cực Phẩm', desc: 'Tinh thể ngưng tụ từ ngàn thần hồn viễn cổ', type: 'material' },
      { id: 'tinh_huyet_chan_ma', name: 'Tinh Huyết Chân Ma', rate: 0.3, grade: 'Thần Phẩm', desc: 'Ma huyết thái cổ tôi luyện ma thân vô địch', type: 'treasure' },
      { id: 'de_khi_tan_manh', name: 'Đế Khí Tàn Mảnh', rate: 0.18, grade: 'Đế Phẩm', desc: 'Mảnh vỡ cực đạo đế binh lưu truyền vạn cổ', type: 'weapon' },
    ],
  },

  hon_don_gioi: {
    id: 'hon_don_gioi',
    name: 'Hỗn Độn Hư Vô Giới',
    title: 'Vạn Cổ Tận Cùng Cực Cảnh',
    minRealmId: 86, // Chuẩn Đế Sơ Kỳ
    minRealmName: 'Chuẩn Đế Sơ Kỳ',
    gridSize: 7, // 7x7
    bgGradient: 'from-amber-950 via-purple-950 to-black',
    borderTheme: 'border-yellow-500/80 shadow-[0_0_40px_rgba(234,179,8,0.3)]',
    accentColor: 'text-yellow-300',
    description:
      'Ranh giới tận cùng của Tam Giới, không gian vỡ vụn từng mảnh, quy tắc thiên địa đảo lộn, hỗn độn chi khí cuồn cuộn thôn phệ vạn đạo.',
    environmentalEffectName: 'Hư Không Yên Diệt',
    environmentalEffectDesc:
      'Cứ mỗi 10 bước xuất hiện Vết Nứt Hư Không; chứa đựng Hỗn Độn Chi Khí, Tiên Thiên Linh Bảo và Cổ Đạo Thần Binh.',
    mpCost: 30000,
    baseAura: 100,
    monsterPool: [
      { name: 'Hư Không Liệp Sát Giả', title: 'Dị Thứ Nguyên Ma Thú', powerRatio: 1.8, hpRatio: 1.6, dropExp: 350000, dropStones: 120000 },
      { name: 'Hỗn Độn Nguyên Tố Cự Nhân', title: 'Hỗn Mang Hóa Thân', powerRatio: 2.1, hpRatio: 2.0, dropExp: 480000, dropStones: 180000 },
      { name: 'Đế Lộ Trảm Đạo Quỷ', title: 'Trảm Đạo Tàn Hồn', powerRatio: 2.4, hpRatio: 2.2, dropExp: 650000, dropStones: 250000 },
    ],
    bossInfo: {
      name: 'Vạn Cổ Hư Vô Đại Đế Tàn Ảnh',
      title: 'Chí Tôn Đế Ảnh',
      powerRatio: 3.2,
      hpRatio: 3.8,
      dropExp: 1500000,
      dropStones: 600000,
    },
    specialDrops: [
      { id: 'hon_don_tinh_thach', name: 'Hỗn Độn Tinh Thạch', rate: 0.5, grade: 'Thần Phẩm', desc: 'Tinh thạch sinh ra từ thuở hồng hoang sơ khai', type: 'material' },
      { id: 'tien_thien_linh_bao', name: 'Tiên Thiên Linh Bảo Tàn Thể', rate: 0.25, grade: 'Đế Phẩm', desc: 'Linh bảo do thiên đạo thai nghén từ hư vô', type: 'treasure' },
      { id: 'van_co_de_kinh', name: 'Vạn Cổ Đế Kinh Tàn Quyển', rate: 0.12, grade: 'Đế Phẩm', desc: 'Ghi chép con đường đạp lên đỉnh phong vạn giới', type: 'formation' },
    ],
  },
};

export const FORBIDDEN_ZONE_LIST: ForbiddenZoneConfig[] = Object.values(FORBIDDEN_ZONES);

export function getForbiddenZoneById(id: ForbiddenZoneId): ForbiddenZoneConfig | undefined {
  return FORBIDDEN_ZONES[id];
}
