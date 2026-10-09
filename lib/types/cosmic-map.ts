// lib/types/cosmic-map.ts
// Domain types cho phân hệ "Chư Thiên Tinh Đồ • Thái Cổ Tinh Mạch (Endgame Cosmic Map)"
// Mở khóa khi player.currentRealm >= 51 (Phi Thăng / Chân Tiên trở lên)

import { LinhCanElement } from './character';

// ─── Enum & Literal Types ────────────────────────────────────────────────────

/** 3 Đại Tinh Vực */
export type CosmicSectorId = 'thai_vi' | 'tu_vi' | 'hon_don';

/** Loại Tinh Cầu (Node) */
export type CosmicNodeType =
  | 'star_core'      // Tinh Cốt — trung tâm năng lượng
  | 'mineral_vein'   // Tinh Mạch Khoáng — khai thác tài nguyên
  | 'ruins'          // Phế Hư Cổ Địa — khám phá dị bảo
  | 'space_rift'     // Hư Không Liệt Phùng — sự kiện ngẫu nhiên
  | 'station';       // Trung Chuyển Tinh Cảng — hồi phục, nâng cấp

/** Cấp tàu Thái Hư Tinh Chu */
export type CosmicVesselLevel = 1 | 2 | 3 | 4 | 5;

/** Cấp trận pháp phòng thủ Tinh Mạch */
export type CosmicDefenseLevel = 1 | 2 | 3 | 4 | 5;

// ─── Core Interfaces ─────────────────────────────────────────────────────────

/** Quái vật Hư Không Cổ Thú trấn giữ một Tinh Cầu */
export interface CosmicGuardian {
  name: string;
  title: string;
  avatar: string;
  realmIndex: number;      // Cảnh giới tương đương (51-104)
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  element: LinhCanElement | string;
  specialSkill?: string;   // Tên kỹ năng đặc biệt
  expYield: number;        // Tu Vi thưởng khi tiêu diệt
  dropRates?: {
    honDonThanThiet?: number;
    tienThienDiBao?: number;
    linhThach?: number;
  };
}

/** Sản lượng thu hoạch mỗi giờ của một Tinh Cầu */
export interface CosmicNodeYield {
  honDonThanThiet?: number;   // Hỗn Độn Thần Thiết (Tier 9 material)
  tienThienDiBao?: number;    // Tiên Thiên Dị Bảo (Tier 9 rare mat)
  vanCoDeRuyi?: number;       // Vạn Cổ Đế Tủy (cực hiếm)
  linhThach?: number;         // Cực Phẩm Linh Thạch (HP Linh Thạch)
  tuViBonus?: number;         // Tu Vi tích lũy (offline cultivation)
  expBonusPercent?: number;   // % buff tu vi bế quan
}

/** Một Tinh Cầu trên Sa Bàn Tinh Không */
export interface CosmicNode {
  id: string;
  name: string;
  description: string;
  sectorId: CosmicSectorId;
  type: CosmicNodeType;
  icon: string;              // Emoji / ký tự đại diện
  requiredRealm: number;     // Cảnh giới tối thiểu để tới node này
  x: number;                 // % tọa độ SVG (0-100)
  y: number;
  connectedNodeIds: string[];
  guardian?: CosmicGuardian;
  yieldPerHour: CosmicNodeYield;
  defenseLevel: CosmicDefenseLevel;
  guardianDiscipleId?: string;       // ID Tiên Đồng trấn thủ cứ điểm
  lore?: string;             // Bối cảnh lịch sử tinh cầu
}

/** Tàu Thái Hư Tinh Chu */
export interface CosmicVessel {
  name: string;              // Tên tàu theo cấp
  level: CosmicVesselLevel;
  speedLyPerMin: number;     // Tốc độ du hành (ảnh hưởng thời gian di chuyển)
  hullIntegrity: number;     // 0-100% độ bền vỏ tàu
  cargoCapacity: number;     // Tổng tài nguyên tối đa khoang chứa
  upgradeCost?: {
    honDonThanThiet?: number;
    linhThach?: number;
  };
}

/** Khoang hàng hóa đang tích lũy */
export interface CosmicCargo {
  honDonThanThiet: number;
  tienThienDiBao: number;
  vanCoDeRuyi: number;
  linhThach: number;
  lastHarvestTime: number;
}

/** Nhật ký sự kiện Tinh Đồ */
export interface CosmicEventLog {
  timestamp: number;
  type: 'travel' | 'battle_win' | 'battle_lose' | 'harvest' | 'upgrade' | 'rift';
  nodeId: string;
  message: string;
}

/** Trạng thái toàn bộ phân hệ Chư Thiên Tinh Đồ */
export interface CosmicState {
  unlocked: boolean;
  currentNodeId: string;
  travelingToNodeId: string | null;
  travelStartTime: number | null;
  travelEndTime: number | null;
  vessel: CosmicVessel;
  occupiedNodeIds: string[];        // Các node đã chiếm đóng
  defeatedGuardianIds: string[];    // Quái đã tiêu diệt (reset hàng tuần)
  nodeGuardians?: Record<string, string>; // Mapping nodeId -> guardianDiscipleId
  cargo: CosmicCargo;
  eventLogs: CosmicEventLog[];
  totalHonDonHarvested: number;     // Thống kê tổng cộng
  totalBattlesWon: number;
  defenseState?: import('./cosmic-defense').CosmicDefenseState;
}

/** Kết quả chiến đấu với Hư Không Cổ Thú */
export interface CosmicBattleResult {
  victory: boolean;
  nodeId: string;
  guardianName: string;
  damageDealt: number;
  rounds: number;
  rewards: {
    tuVi: number;
    honDonThanThiet: number;
    tienThienDiBao: number;
    linhThach: number;
  };
  message: string;
}

/** Kết quả thu hoạch Tinh Mạch */
export interface CosmicHarvestResult {
  honDonThanThiet: number;
  tienThienDiBao: number;
  vanCoDeRuyi: number;
  linhThach: number;
  fromNodeIds: string[];
  hoursElapsed: number;
  message: string;
}

/** Định nghĩa Tier 9 Equipment từ Tinh Mạch */
export interface Tier9EquipmentRecipe {
  id: string;
  name: string;
  description: string;
  slot: string;
  grade: 'Tiên Thiên Linh Bảo';
  tier: 9;
  icon: string;
  lore: string;
  requiredRealm: number;
  cost: {
    honDonThanThiet: number;
    tienThienDiBao: number;
    vanCoDeRuyi?: number;
    linhThach?: number;
  };
  baseStats: {
    atk?: number;
    def?: number;
    hp?: number;
    mp?: number;
    speed?: number;
    critRate?: number;
    critDmg?: number;
    dmgReduction?: number;
    cultivationSpeedBonus?: number;
    [key: string]: number | undefined;
  };
  passiveEffect: string;
  activeSkill?: string;
}
