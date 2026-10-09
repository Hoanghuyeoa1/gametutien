// lib/pvp-ladder-data.ts
// Dữ liệu tĩnh, Pool danh xưng, Cấu hình thứ hạng & Procedural NPC Generator cho Thiên Kiêu Bảng

import { LadderOpponent, PvPLadderState } from '@/lib/types/pvp-ladder';
import realmsDataRaw from '@/data/realms-data.json';
import { SECT_LIST } from '@/lib/sect-data';

const realmsData = realmsDataRaw as { id: number; name: string }[];

const SURNAMES = [
  'Diệp', 'Tiêu', 'Sở', 'Lâm', 'Nam Cung', 'Mộ Dung', 'Âu Dương', 'Gia Cát',
  'Đường', 'Lý', 'Bạch', 'Vương', 'Hàn', 'Trần', 'Tạ', 'Khương', 'Lạc', 'Vân', 'Thẩm', 'Thạch'
];

const GIVEN_NAMES = [
  'Vô Nhai', 'Thần', 'Tuyết', 'Phong', 'Hạo Nhiên', 'Kình Thiên', 'Tố Tâm', 'Bất Hối',
  'Trường Khanh', 'Thanh Trúc', 'Vô Địch', 'Hạo Thiên', 'U Mộng', 'Tử Yên', 'Dạ Thần',
  'Lạc Nhạn', 'Kiếm Trần', 'Minh Nguyệt', 'Vạn Lý', 'Tâm Kiếm', 'Huyền Chân', 'Lăng Tiêu',
  'Ngự Phong', 'Thiên Tàn', 'Phá Thiên', 'Phi Vũ', 'Nhất Đao', 'Thần Cơ', 'Cửu Tiêu', 'Bất Bại'
];

const TITLES_POOL = [
  'Độc Cô Cầu Bại', 'Vạn Cổ Kiếm Tôn', 'Bất Bại Ma Đồng', 'Cửu U Thánh Nữ', 'Kiếm Si',
  'Vô Song Thần Tử', 'Huyết Sát Ma Tôn', 'Thanh Lôi Cuồng Đao', 'Thái Cổ Thần Nữ',
  'Thiên Kiếm Trích Tiên', 'Hỗn Độn Đạo Tử', 'Tử Phủ Chân Nhân', 'Bắc Minh Thần Quân',
  'Kim Cang La Hán', 'Bách Chiến Bất Diệt', 'Hư Không Du Tử', 'Vạn Pháp Tông Sư',
  'Cửu Biến Linh Đồng', 'Thiên Cơ Thần Toán', 'Băng Phách Tiên Cơ', 'Xích Viêm Thần Tướng',
  'Huyền Vũ Thần Tôn', 'Đại Lực Kim Cương', 'Thiên Đao Vấn Tình', 'Tuyệt Tình Tiên Tử',
  'Cuồng Đao Lãng Tử', 'Cửu Tiêu Kiếm Khách', 'Tịch Diệt Ma Thần', 'Lạc Hà Tiên Kiếm'
];

const AVATARS_POOL = [
  '🧙‍♂️', '🧝', '🦹', '🥷', '🤴', '👸', '🧘', '🤺', '⚔️', '🔮', '🐉', '⚡', '🦅', '🔥', '👑', '🌟'
];

const SPIRIT_ROOTS_POOL = [
  { name: 'Ngũ Hành Linh Căn', element: 'ngu_hanh', grade: 'Chân' },
  { name: 'Thiên Hỏa Linh Căn', element: 'hoa', grade: 'Thiên' },
  { name: 'Huyền Thủy Linh Căn', element: 'thuy', grade: 'Thiên' },
  { name: 'Cửu Lôi Dị Biến Linh Căn', element: 'loi', grade: 'Biến Dị' },
  { name: 'Hàn Băng Dị Biến Linh Căn', element: 'bang', grade: 'Biến Dị' },
  { name: 'Cương Phong Linh Căn', element: 'phong', grade: 'Biến Dị' },
  { name: 'Kim Cương Kiếm Căn', element: 'kim', grade: 'Thiên' },
  { name: 'Thanh Mộc Trường Sinh Căn', element: 'moc', grade: 'Thiên' },
  { name: 'U Minh Ma Căn', element: 'am', grade: 'Địa' },
  { name: 'Thái Dương Thuần Dương Căn', element: 'quang', grade: 'Thần Giai' },
  { name: 'Hỗn Độn Khai Thiên Căn', element: 'hon_don', grade: 'Tiên Thiên' }
];

const MANUALS_SET = [
  { name: 'Thái Cổ Thần Ma Quyết', type: 'tam_phap' },
  { name: 'Cửu Tiêu Ngự Lôi Chân Kinh', type: 'tam_phap' },
  { name: 'Thiên Khôn Bất Diệt Thể', type: 'the_thuat' },
  { name: 'Bất Bại Kim Thân Thần Công', type: 'the_thuat' },
  { name: 'Vạn Kiếm Quy Tông', type: 'than_thong' },
  { name: 'Chưởng Trung Càn Khôn', type: 'than_thong' },
  { name: 'Hư Không Phá Diệt Trảm', type: 'than_thong' },
  { name: 'Tịch Diệt Ma Thần Quyết', type: 'tam_phap' },
  { name: 'Cửu U Âm Hồn Trảo', type: 'than_thong' },
  { name: 'Đại Diễn Thần Quyết', type: 'tam_phap' }
];

// Helper sinh tên NPC
function generateProceduralName(rank: number): { name: string; title: string } {
  if (rank === 1) {
    return { name: 'Diệp Vô Nhai', title: 'Độc Cô Cầu Bại' };
  }
  if (rank === 2) {
    return { name: 'Tiêu Thần', title: 'Vạn Cổ Kiếm Tôn' };
  }
  if (rank === 3) {
    return { name: 'Sở U Mộng', title: 'Cửu U Thánh Nữ' };
  }
  if (rank === 4) {
    return { name: 'Nam Cung Kình Thiên', title: 'Bất Bại Ma Đồng' };
  }
  if (rank === 5) {
    return { name: 'Lâm Hạo Nhiên', title: 'Vô Song Thần Tử' };
  }

  const surname = SURNAMES[(rank * 7) % SURNAMES.length];
  const given = GIVEN_NAMES[(rank * 13) % GIVEN_NAMES.length];
  const title = TITLES_POOL[(rank * 11) % TITLES_POOL.length];
  return { name: `${surname} ${given}`, title };
}

/**
 * Sinh danh sách 100 NPC Thiên Kiêu (Hạng 1 đến Hạng 100)
 */
export function generateDefaultLadderNpcs(): LadderOpponent[] {
  const npcs: LadderOpponent[] = [];

  // Lọc tông môn theo 5 tier từ SECT_LIST
  const sectsByTier: Record<number, typeof SECT_LIST> = {
    1: SECT_LIST.filter(s => s.tier === 1),
    2: SECT_LIST.filter(s => s.tier === 2),
    3: SECT_LIST.filter(s => s.tier === 3),
    4: SECT_LIST.filter(s => s.tier === 4),
    5: SECT_LIST.filter(s => s.tier === 5)
  };

  for (let rank = 100; rank >= 1; rank--) {
    const { name, title } = generateProceduralName(rank);

    // Xác định phân khúc cảnh giới & tier môn phái
    let realmIndex = 10;
    let sectTier = 1;
    let basePower = 3000;
    let avatar = AVATARS_POOL[rank % AVATARS_POOL.length];

    if (rank > 80) {
      // Hạng 81 - 100: Luyện Khí 10 -> Trúc Cơ Sơ Kỳ (10 - 12)
      realmIndex = 10 + Math.floor((100 - rank) / 10);
      sectTier = 1;
      basePower = 2500 + (100 - rank) * 280;
    } else if (rank > 50) {
      // Hạng 51 - 80: Trúc Cơ Hậu Kỳ -> Kim Đan Sơ Kỳ (13 - 17)
      realmIndex = 13 + Math.floor((80 - rank) / 6);
      sectTier = 2;
      basePower = 9000 + (80 - rank) * 850;
    } else if (rank > 20) {
      // Hạng 21 - 50: Kim Đan Hậu Kỳ -> Nguyên Anh (18 - 25)
      realmIndex = 18 + Math.floor((50 - rank) / 4);
      sectTier = 3;
      basePower = 40000 + (50 - rank) * 3800;
    } else if (rank > 10) {
      // Hạng 11 - 20: Hóa Thần -> Luyện Hư (26 - 35)
      realmIndex = 26 + Math.floor((20 - rank) * 0.9);
      sectTier = 4;
      basePower = 180000 + (20 - rank) * 45000;
    } else if (rank > 3) {
      // Hạng 4 - 10 (Thập Đại Thiên Kiêu): Hợp Thể -> Đại Thừa (36 - 45)
      realmIndex = 36 + Math.floor((10 - rank) * 1.4);
      sectTier = 5;
      basePower = 800000 + (10 - rank) * 250000;
      avatar = '👑';
    } else if (rank > 1) {
      // Hạng 2 - 3 (Á Quân & Quý Quân): Độ Kiếp Viên Mãn -> Chân Tiên (46 - 56)
      realmIndex = 48 + (3 - rank) * 6;
      sectTier = 5;
      basePower = 3500000 + (3 - rank) * 2200000;
      avatar = rank === 2 ? '⚡' : '🔮';
    } else {
      // Hạng 1 (Đương Thế Vô Địch - Quán Quân): Tiên Nhân Cực Cảnh (Realm 65+)
      realmIndex = 65;
      sectTier = 5;
      basePower = 9888888;
      avatar = '🗡️';
    }

    // Chọn tông môn tương ứng tier
    const tierSects = sectsByTier[sectTier]?.length > 0 ? sectsByTier[sectTier] : SECT_LIST;
    const sect = tierSects[rank % tierSects.length];

    // Linh căn
    const linhCan = SPIRIT_ROOTS_POOL[(rank * 3) % SPIRIT_ROOTS_POOL.length];

    // Bộ công pháp (4 cuốn)
    const m1 = MANUALS_SET[rank % MANUALS_SET.length];
    const m2 = MANUALS_SET[(rank + 2) % MANUALS_SET.length];
    const m3 = MANUALS_SET[(rank + 4) % MANUALS_SET.length];
    const m4 = MANUALS_SET[(rank + 6) % MANUALS_SET.length];
    const manualsLvl = Math.max(1, Math.min(10, Math.floor(realmIndex / 4)));

    // Thần thức & Combat Stats
    const thanThuc = Math.floor(realmIndex * 35 + (100 - rank) * 8);
    const hp = Math.floor(basePower * 7.5 + realmIndex * 1500);
    const atk = Math.floor(basePower * 0.42 + realmIndex * 120);
    const def = Math.floor(basePower * 0.28 + realmIndex * 90);
    const speed = Math.floor(45 + realmIndex * 3.5 + (100 - rank) * 0.5);
    const critRate = Math.min(75, Math.floor(10 + realmIndex * 0.6 + (100 - rank) * 0.15));
    const critDmg = Math.floor(150 + realmIndex * 1.5 + (100 - rank) * 0.5);
    const dmgReduction = Math.min(50, Math.floor(realmIndex * 0.5 + (100 - rank) * 0.1));

    // Khí linh cho Top 20
    let spiritCompanion = undefined;
    if (rank <= 20) {
      spiritCompanion = {
        name: rank === 1 ? 'Thái Hư Kiếm Linh' : (rank <= 3 ? 'Cửu U Hồn Khí' : 'Trấn Phái Linh Thần'),
        stageName: rank === 1 ? 'Hóa Thần Kỳ' : (rank <= 10 ? 'Nguyên Anh Kỳ' : 'Kim Đan Kỳ'),
        personality: rank % 2 === 0 ? 'Sát Phạt' : 'Thủ Hộ'
      };
    }

    const realmName = realmsData[realmIndex]?.name || `Cảnh giới ${realmIndex}`;

    npcs.push({
      id: `npc_ladder_${rank}`,
      rank,
      name,
      title,
      sectId: sect.id,
      sectName: sect.name,
      sectTier: sect.tier,
      avatar,
      realmIndex,
      realmName,
      linhCan,
      combatStats: {
        hp,
        maxHp: hp,
        mp: Math.floor(hp * 0.6),
        maxMp: Math.floor(hp * 0.6),
        atk,
        def,
        speed,
        critRate,
        critDmg,
        dmgReduction
      },
      thanThuc,
      manuals: [
        { name: m1.name, type: m1.type, level: manualsLvl },
        { name: m2.name, type: m2.type, level: manualsLvl },
        { name: m3.name, type: m3.type, level: manualsLvl },
        { name: m4.name, type: m4.type, level: manualsLvl }
      ],
      spiritCompanion,
      combatPower: basePower
    });
  }

  // Sắp xếp theo rank tăng dần (1 đến 100)
  return npcs.sort((a, b) => a.rank - b.rank);
}

/**
 * Khởi tạo PvPLadderState mặc định
 */
export function createDefaultPvPLadderState(): PvPLadderState {
  return {
    currentRank: 101, // Ngoài bảng xếp hạng
    bestRank: 101,
    challengeTickets: 5,
    lastTicketRegenTime: Date.now(),
    lastWeeklySettlementTime: Date.now(),
    hasUnclaimedWeeklyReward: false,
    weeklyRewardRank: undefined,
    combatLogs: [],
    ladderNpcs: generateDefaultLadderNpcs()
  };
}

/**
 * Phần thưởng chu kỳ tuần theo thứ hạng
 */
export function getWeeklySettlementRewards(rank: number): {
  linhThach: number;
  danhVong: number;
  tuVi: number;
  rewardTitleId?: string;
  pillRewardName: string;
} {
  if (rank === 1) {
    return {
      linhThach: 500000,
      danhVong: 5000,
      tuVi: 1000000,
      rewardTitleId: 'title_van_gioi_de_nhat_kiem',
      pillRewardName: 'Cửu Chuyển Hỗn Độn Đan x5'
    };
  }
  if (rank <= 3) {
    return {
      linhThach: 300000,
      danhVong: 3000,
      tuVi: 600000,
      rewardTitleId: 'title_thien_kieu_van_dinh',
      pillRewardName: 'Cửu Chuyển Hỗn Độn Đan x3'
    };
  }
  if (rank <= 10) {
    return {
      linhThach: 150000,
      danhVong: 1500,
      tuVi: 350000,
      rewardTitleId: 'title_thap_dai_thien_kieu',
      pillRewardName: 'Hóa Thần Đan x5'
    };
  }
  if (rank <= 50) {
    return {
      linhThach: 80000,
      danhVong: 800,
      tuVi: 180000,
      rewardTitleId: 'title_bach_cuong_thien_kieu',
      pillRewardName: 'Nguyên Anh Đan x5'
    };
  }
  if (rank <= 100) {
    return {
      linhThach: 40000,
      danhVong: 400,
      tuVi: 80000,
      rewardTitleId: 'title_bach_cuong_thien_kieu',
      pillRewardName: 'Kim Đan Đan x5'
    };
  }
  return {
    linhThach: 10000,
    danhVong: 100,
    tuVi: 20000,
    pillRewardName: 'Tụ Linh Đan x5'
  };
}
