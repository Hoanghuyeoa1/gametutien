// lib/cosmic-defense-data.ts
// Dữ liệu & Cấu hình cho phân hệ "Vực Ngoại Dị Tộc Tập Kích & Xây Dựng Cứ Điểm Tinh Hải"

import {
  FortificationType,
  IncursionThreatLevel
} from '@/lib/types/cosmic-defense';

export interface FortificationStep {
  level: number;
  name: string;
  effectDescription: string;
  effectValue: number; // % giá trị (HP nã, % delay, % giảm loss, % buff power)
  cost: {
    linhThach: number;
    honDonThanThiet: number;
    tienThienDiBao: number;
  };
}

export const FORTIFICATION_CONFIGS: Record<FortificationType, {
  name: string;
  icon: string;
  description: string;
  steps: FortificationStep[];
}> = {
  tru_ma_phao: {
    name: 'Cửu Cực Tru Ma Pháo',
    icon: '⚡',
    description: 'Đại pháo năng lượng tinh hạch, tự động khai hỏa nã thẳng vào hạm đội địch ngay khi chúng vừa tiến vào quỹ đạo Tinh Cầu.',
    steps: [
      {
        level: 1,
        name: 'Tru Ma Pháo Sơ Giai',
        effectDescription: 'Nã trước 15% HP toàn bộ hạm đội địch',
        effectValue: 15,
        cost: { linhThach: 20000, honDonThanThiet: 10, tienThienDiBao: 0 }
      },
      {
        level: 2,
        name: 'Cửu Tiêu Lôi Hỏa Pháo',
        effectDescription: 'Nã trước 25% HP toàn bộ hạm đội địch',
        effectValue: 25,
        cost: { linhThach: 50000, honDonThanThiet: 25, tienThienDiBao: 2 }
      },
      {
        level: 3,
        name: 'Thái Hư Hỗn Độn Pháo',
        effectDescription: 'Nã trước 35% HP toàn bộ hạm đội địch',
        effectValue: 35,
        cost: { linhThach: 120000, honDonThanThiet: 60, tienThienDiBao: 5 }
      },
      {
        level: 4,
        name: 'Chu Thiên Tinh Đấu Đại Pháo',
        effectDescription: 'Nã trước 45% HP toàn bộ hạm đội địch',
        effectValue: 45,
        cost: { linhThach: 250000, honDonThanThiet: 120, tienThienDiBao: 12 }
      },
      {
        level: 5,
        name: 'Vạn Cổ Tru Tiên Diệt Ma Thần Pháo',
        effectDescription: 'Nã trước 55% HP toàn bộ hạm đội địch',
        effectValue: 55,
        cost: { linhThach: 500000, honDonThanThiet: 250, tienThienDiBao: 25 }
      }
    ]
  },
  huyen_tran: {
    name: 'Hỗn Độn Huyễn Trận',
    icon: '🌀',
    description: 'Trận đồ hư ảo làm rối loạn hải đồ và la bàn tinh không của địch, kéo dài thời gian tiếp cận để tạo cơ hội ứng cứu.',
    steps: [
      {
        level: 1,
        name: 'Mê Vụ Huyễn Trận',
        effectDescription: 'Kéo dài thời gian địch tiếp cận thêm +20%',
        effectValue: 20,
        cost: { linhThach: 15000, honDonThanThiet: 8, tienThienDiBao: 0 }
      },
      {
        level: 2,
        name: 'Bát Quái Kỳ Môn Trận',
        effectDescription: 'Kéo dài thời gian địch tiếp cận thêm +40%',
        effectValue: 40,
        cost: { linhThach: 40000, honDonThanThiet: 20, tienThienDiBao: 1 }
      },
      {
        level: 3,
        name: 'Hư Không Loạn Lưu Trận',
        effectDescription: 'Kéo dài thời gian địch tiếp cận thêm +65%',
        effectValue: 65,
        cost: { linhThach: 95000, honDonThanThiet: 45, tienThienDiBao: 4 }
      },
      {
        level: 4,
        name: 'Cửu Cung Phong Ma Trận',
        effectDescription: 'Kéo dài thời gian địch tiếp cận thêm +90%',
        effectValue: 90,
        cost: { linhThach: 200000, honDonThanThiet: 90, tienThienDiBao: 8 }
      },
      {
        level: 5,
        name: 'Thái Sơ Vô Cực Huyễn Trận',
        effectDescription: 'Kéo dài thời gian địch tiếp cận thêm +120%',
        effectValue: 120,
        cost: { linhThach: 420000, honDonThanThiet: 180, tienThienDiBao: 18 }
      }
    ]
  },
  ho_cuong_giap: {
    name: 'Thái Hư Hộ Cương Giáp',
    icon: '🛡️',
    description: 'Hợp kim tinh thạch gia cố hầm khoang Tinh Cầu, giảm thiểu tối đa tổn thất tài nguyên nếu chẳng may cứ điểm bị vỡ trận.',
    steps: [
      {
        level: 1,
        name: 'Hắc Thiết Cương Giáp',
        effectDescription: 'Giảm 20% lượng tài nguyên bị cướp phá khi thất thủ',
        effectValue: 20,
        cost: { linhThach: 15000, honDonThanThiet: 8, tienThienDiBao: 0 }
      },
      {
        level: 2,
        name: 'Huyền Thiết Trọng Giáp',
        effectDescription: 'Giảm 35% lượng tài nguyên bị cướp phá khi thất thủ',
        effectValue: 35,
        cost: { linhThach: 38000, honDonThanThiet: 18, tienThienDiBao: 1 }
      },
      {
        level: 3,
        name: 'Tử Tinh Hộ Giáp',
        effectDescription: 'Giảm 50% lượng tài nguyên bị cướp phá khi thất thủ',
        effectValue: 50,
        cost: { linhThach: 85000, honDonThanThiet: 40, tienThienDiBao: 3 }
      },
      {
        level: 4,
        name: 'Bất Hoại Thần Cương',
        effectDescription: 'Giảm 65% lượng tài nguyên bị cướp phá khi thất thủ',
        effectValue: 65,
        cost: { linhThach: 180000, honDonThanThiet: 80, tienThienDiBao: 7 }
      },
      {
        level: 5,
        name: 'Hỗn Độn Tiên Kim Bảo Hộ Giáp',
        effectDescription: 'Giảm 80% lượng tài nguyên bị cướp phá khi thất thủ',
        effectValue: 80,
        cost: { linhThach: 380000, honDonThanThiet: 160, tienThienDiBao: 15 }
      }
    ]
  },
  tu_linh_dai: {
    name: 'Tụ Linh Trấn Ma Đài',
    icon: '🏯',
    description: 'Trận pháp đài ngưng tụ tinh hoa vũ trụ, gia tăng cực lớn Lực Chiến cho thực thể được điều động cắm chốt trấn thủ.',
    steps: [
      {
        level: 1,
        name: 'Tụ Khí Đài',
        effectDescription: 'Tăng +15% Lực Chiến cho Trấn Thủ Sĩ',
        effectValue: 15,
        cost: { linhThach: 20000, honDonThanThiet: 12, tienThienDiBao: 0 }
      },
      {
        level: 2,
        name: 'Dẫn Tinh Đài',
        effectDescription: 'Tăng +30% Lực Chiến cho Trấn Thủ Sĩ',
        effectValue: 30,
        cost: { linhThach: 55000, honDonThanThiet: 28, tienThienDiBao: 2 }
      },
      {
        level: 3,
        name: 'Trấn Yêu Đài',
        effectDescription: 'Tăng +45% Lực Chiến cho Trấn Thủ Sĩ',
        effectValue: 45,
        cost: { linhThach: 130000, honDonThanThiet: 65, tienThienDiBao: 5 }
      },
      {
        level: 4,
        name: 'Thần Uy Phong Ma Đài',
        effectDescription: 'Tăng +60% Lực Chiến cho Trấn Thủ Sĩ',
        effectValue: 60,
        cost: { linhThach: 260000, honDonThanThiet: 130, tienThienDiBao: 12 }
      },
      {
        level: 5,
        name: 'Thái Cổ Đế Tôn Trấn Tinh Đài',
        effectDescription: 'Tăng +80% Lực Chiến cho Trấn Thủ Sĩ',
        effectValue: 80,
        cost: { linhThach: 550000, honDonThanThiet: 280, tienThienDiBao: 28 }
      }
    ]
  }
};

export interface VoidBossTemplate {
  name: string;
  threatLevel: IncursionThreatLevel;
  baseHp: number;
  baseAtk: number;
  basePower: number;
  lore: string;
}

export const VOID_BOSSES_CATALOG: VoidBossTemplate[] = [
  // 1. Tiểu Ba (Tiên phong)
  {
    name: 'Hư Không Thực Tinh Thú',
    threatLevel: 'tieu_ba',
    baseHp: 800000,
    baseAtk: 45000,
    basePower: 350000,
    lore: 'Hung thú sinh ra từ vết nứt hư không, chuyên gặm nhấm tinh hạch của các vì sao hoang phế.'
  },
  {
    name: 'U Minh Dạ Xoa Du Tôn',
    threatLevel: 'tieu_ba',
    baseHp: 950000,
    baseAtk: 52000,
    basePower: 420000,
    lore: 'Tiên phong ma tộc thân hình quỷ mị, cầm tam xoa kích tàn phá các tiền đồn tinh hải.'
  },
  {
    name: 'Cửu U Hắc Diễm Ma Lang',
    threatLevel: 'tieu_ba',
    baseHp: 1100000,
    baseAtk: 58000,
    basePower: 480000,
    lore: 'Ma lang há miệng phun ma hỏa thiêu đốt chân không, tốc độ hành quân cực nhanh.'
  },

  // 2. Trung Ba (Quân đoàn Ma Tộc)
  {
    name: 'Huyết Sát Tinh Cầu Ma Tướng',
    threatLevel: 'trung_ba',
    baseHp: 2200000,
    baseAtk: 110000,
    basePower: 950000,
    lore: 'Thống lĩnh ma tộc khát máu, thống lĩnh hàng vạn ma thú tràn vào bao vây mỏ khoáng.'
  },
  {
    name: 'Vực Ngoại Thiên Ma Trưởng Lão',
    threatLevel: 'trung_ba',
    baseHp: 2600000,
    baseAtk: 135000,
    basePower: 1200000,
    lore: 'Thiên ma thượng cổ thông hiểu tà pháp cấm kỵ, có khả năng ngưng trệ dòng chảy tinh không.'
  },
  {
    name: 'Cửu Cực Băng Phách Ma Tôn',
    threatLevel: 'trung_ba',
    baseHp: 3000000,
    baseAtk: 155000,
    basePower: 1450000,
    lore: 'Băng hàn ma tôn đông cứng tinh lộ, biến cả một vùng tinh hải thành lãnh thổ chết chóc.'
  },

  // 3. Đại Ba (Cổ Ma Thần Hạ Phàm)
  {
    name: 'Thôn Thiên Hắc Long Ma Thần',
    threatLevel: 'dai_ba',
    baseHp: 5500000,
    baseAtk: 280000,
    basePower: 2800000,
    lore: 'Cự long hắc ám dài vạn dặm cuộn tròn trong tinh vân, một ngụm có thể nuốt trọn cả tiểu tinh cầu.'
  },
  {
    name: 'Hỗn Độn Cổ Ma Thần Chi Hồn',
    threatLevel: 'dai_ba',
    baseHp: 6800000,
    baseAtk: 340000,
    basePower: 3500000,
    lore: 'Tàn hồn bất diệt của thần ma viễn cổ thức tỉnh từ vực sâu Hỗn Độn, uy áp chấn động chư thiên.'
  },
  {
    name: 'Vạn Kiếp Hư Không Đế Tôn',
    threatLevel: 'dai_ba',
    baseHp: 8500000,
    baseAtk: 420000,
    basePower: 4500000,
    lore: 'Chúa tể dị tộc vượt qua vạn kiếp bất hoại, thống lĩnh hạm đội viễn chinh san bằng tinh vực.'
  }
];

export const FLEET_NAMES_POOL = [
  'Hắc Ám Du Thần Tiên Phong Hạm',
  'Cửu U Huyết Sát Quân Đoàn',
  'Hư Không Thôn Tinh Ma Hạm Đội',
  'Vực Ngoại Cổ Ma Tiêu Diệt Hạm',
  'Thái Cổ Lôi Ma Cuồng Triều Hạm',
  'Vạn Quỷ Dạ Hành Hạm Đội',
  'Hỗn Độn Sát Phạt Thiết Kỵ Hạm',
  'U Minh Ma Ảnh Đột Kích Hạm'
];

export const THREAT_LEVEL_CONFIG: Record<IncursionThreatLevel, {
  name: string;
  badge: string;
  icon: string;
  baseTimeMinutes: number;
  powerMultiplier: number;
  baseLoot: {
    honDonThanThiet: number;
    tienThienDiBao: number;
    linhThach: number;
  };
}> = {
  tieu_ba: {
    name: 'Tiểu Ba • Du Tôn Tiên Phong',
    badge: 'Nguy Cơ Thấp',
    icon: '⚡',
    baseTimeMinutes: 30,
    powerMultiplier: 1.0,
    baseLoot: {
      honDonThanThiet: 8,
      tienThienDiBao: 1,
      linhThach: 15000
    }
  },
  trung_ba: {
    name: 'Trung Ba • Hư Không Ma Tộc Triều Tịch',
    badge: 'Nguy Cơ Cao',
    icon: '⚠️',
    baseTimeMinutes: 60,
    powerMultiplier: 1.8,
    baseLoot: {
      honDonThanThiet: 20,
      tienThienDiBao: 3,
      linhThach: 45000
    }
  },
  dai_ba: {
    name: 'Đại Ba • Vực Ngoại Cổ Ma Thần',
    badge: 'Đại Họa Diệt Vong',
    icon: '☠️',
    baseTimeMinutes: 120,
    powerMultiplier: 3.2,
    baseLoot: {
      honDonThanThiet: 50,
      tienThienDiBao: 8,
      linhThach: 120000
    }
  }
};
