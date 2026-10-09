// lib/types/sect.ts
import { LinhCanElement } from './character';

export type SectTier = 1 | 2 | 3 | 4 | 5;

export type SectSpecialty =
  | 'kiem_tu'
  | 'dan_dao'
  | 'the_tu'
  | 'ma_dao'
  | 'tran_phu'
  | 'ngu_thu'
  | 'am_duong'
  | 'hon_don';

export interface SectRequirement {
  minRealmIndex: number;         // Index cảnh giới tối thiểu (0..104 theo realms-data.json)
  minCanCot: number;             // Điểm Căn Cốt tối thiểu
  minNgoTinh?: number;           // Điểm Ngộ Tính tối thiểu (tùy chọn)
  minLinhCanGrade?: 'tap' | 'chan' | 'dia' | 'thien' | 'bien_di' | 'hon_don'; // Phẩm cấp linh căn tối thiểu
}

export interface SectBuff {
  id?: string;
  name: string;
  description: string;
  effectType?: string;
  value?: number;
  [key: string]: unknown;
}

export type SectMission = SectQuest;

export type SectId =
  | 'sect_thanh_van_mon'
  | 'sect_thiet_khi_mon'
  | 'sect_thao_duoc_coc'
  | 'sect_hoang_nguyet_phai'
  | 'sect_kim_kiem_tong'
  | 'sect_huyen_thuy_cung'
  | 'sect_man_hoang_tong'
  | 'sect_u_minh_giao'
  | 'sect_dan_dinh_tong'
  | 'sect_thien_tran_cac'
  | 'sect_van_thu_son'
  | 'sect_huyet_sat_tong'
  | 'sect_thai_at_kiem_tong'
  | 'sect_bat_quai_tien_mon'
  | 'sect_cuu_u_ma_dien'
  | 'sect_lac_ha_tien_cung'
  | 'sect_thai_so_thanh_dia'
  | 'sect_luan_hoi_tien_dien'
  | 'sect_hon_don_dao_tong'
  | 'sect_bat_diet_ma_cung'
  | 'thanh_van_mon'
  | 'huyet_sat_tong'
  | 'thien_kiem_son'
  | 'van_kiem_tong'
  | 'chinh_dao'
  | 'ma_dao'
  | 'kiem_phai'
  | string;

export type SectRank = 'ngoai_mon' | 'noi_mon' | 'chan_truyen' | 'truong_lao' | 'chuong_mon' | 'tap_dich' | string;

export interface SectRankDetail {
  rank: SectRank;
  title: string;
  requiredContribution: number;
  requiredRealm?: number;
  realmName?: string;
  dailySalary?: {
    linhThach: number;
    tuVi: number;
    tinhHuyet?: number;
  };
  salary?: number;
  dailySalaryLinhThach?: number;
  privileges?: string[];
  [key: string]: unknown;
}

export interface SectQuest {
  id: string;
  category?: 'garden' | 'battle' | 'alchemy' | 'donate' | 'patrol' | 'ore' | string;
  title: string;
  name?: string;
  description: string;
  rewardContribution: number;
  rewardLinhThach: number;
  rewardTuVi?: number;
  rewardDanhVong?: number;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isClaimed?: boolean;
  [key: string]: unknown;
}

export interface SectShopItem {
  id: string;
  name: string;
  type: 'dan_phuong' | 'bi_tich' | 'seed' | 'item' | string;
  costContribution: number;
  requiredRank: SectRank;
  effectSummary: string;
  grade?: string;
  description?: string;
  recipeId?: string;
  manualId?: string;
  seedId?: string;
  pillId?: string;
  isBought?: boolean;
  [key: string]: unknown;
}

export type SpiritVeinType = 'herb' | 'ore' | 'cultivation';

export interface SpiritVein {
  id: string;
  name: string;
  type: SpiritVeinType;
  tier: SectTier; // Khớp với Tier 1..5 của môn phái
  occupiedSectId: string | null; // ID tông môn đang chiếm giữ (có thể là môn phái người chơi hoặc NPC)
  occupiedAt: number; // Timestamp bắt đầu chiếm giữ
  defensePower: number; // Chỉ số phòng thủ của cứ điểm
  guardianNpc: {
    name: string;
    title: string;
    realmIndex: number;
    combatStats: {
      hp: number;
      maxHp: number;
      atk: number;
      def: number;
      speed: number;
    };
  };
  buffs: {
    tuViSpeedBonus?: number;       // +% tốc độ tu vi
    herbGrowthSpeedBonus?: number; // +% tốc độ chín dược điền
    oreYieldBonus?: number;        // +% khoáng thạch thu hoạch
    dailyLinhThachStipend: number; // Linh thạch nhận thêm mỗi ngày
  };
  [key: string]: unknown;
}

export interface SectGuardianArray {
  level: number; // Cấp 1 đến 10
  exp: number; // EXP hiện tại
  maxExp: number; // EXP cần để lên cấp tiếp theo
  arrayName: string; // Tên trận đồ (VD: "Cửu Cung Bát Quái Trận", "Thái Ất Hộ Sơn Trận"...)
  buffs: {
    damageReduction: number; // +% Miễn thương trong mọi trận combat
    combatStartShieldHp: number; // Lượng máu khiên chắn nhận được ở Turn 1
    tribulationInjuryReduction: number; // +% giảm tổn thất tu vi khi đột phá thất bại
  };
  [key: string]: unknown;
}

export type SectSubTab = 'overview' | 'quests' | 'arena' | 'veins' | 'array' | 'shop';

export interface SectState {
  sectId: SectId | null;
  rank: SectRank;
  contribution: number;
  totalContribution: number;
  joinedAt?: number;
  dailyQuests: SectQuest[];
  unlockedRecipes: string[];
  unlockedManuals: string[];
  lastSalaryClaimedAt?: number;
  arenaRank?: number;
  arenaTitle?: string;
  guardianArray?: SectGuardianArray;
  occupiedVeinIds?: string[]; // Danh sách ID mạch mà tông môn người chơi đang chiếm giữ
  lastVeinWarAt?: number;     // Cooldown khiêu chiến linh mạch
  lastVeinClaimAt?: number;   // Timestamp nhận bổng lộc linh mạch
  veinStates?: Record<string, { occupiedSectId: string | null; occupiedAt: number; defensePower: number }>;
  [key: string]: unknown;
}

export type PlayerSectState = SectState;

export interface SectData {
  id: string;
  name: string;
  tier: SectTier;
  tierName: string;              // VD: "Cửu Lưu Tông Môn", "Nhất Lưu Thánh Địa"
  badgeColor: string;            // Tailwind classes cho badge viền/nền
  description: string;
  specialty: SectSpecialty;
  specialtyName: string;
  requirements: SectRequirement;
  ranks: SectRankDetail[];       // Tạp dịch, Ngoại môn, Nội môn, Chân truyền, Trưởng lão, Chưởng môn
  buffs?: SectBuff[];            // Tốc độ tu vi, bổng lộc, giảm tiêu hao, v.v.
  missions?: SectMission[];
  shortName?: string;
  tagline?: string;
  leader?: string;
  badgeClass?: string;
  themeColor?: string;
  icon?: string;
  faction?: string;
  color?: string;
  specialBuff?: string;
  buffDetails?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SectProfile extends SectData {
  shortName: string;
  ranks: SectRankDetail[];
}

export interface SectArenaFighter {
  id: string;
  name: string;
  title: string;
  rankPosition: number;
  realm: number;
  realmName: string;
  element: LinhCanElement | string;
  khiVan?: number;
  stats: {
    atk: number;
    def: number;
    hp: number;
    maxHp: number;
    speed: number;
    critRate: number;
    [key: string]: unknown;
  };
  avatarEmoji?: string;
  skillName?: string;
  skillDmgMultiplier?: number;
  description?: string;
  rewards: { contribution: number; linhThach: number; danhVong: number; [key: string]: unknown; };
  rank?: number;
  [key: string]: unknown;
}
