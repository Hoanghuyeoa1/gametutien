// lib/types/forbidden-zone.ts
// Kiểu dữ liệu cho phân hệ "Thái Cổ Cấm Địa • Khám Phá Sa Bàn Sương Mù & Thần Ma Cấm Khu"

export type ForbiddenZoneId = 
  | 'hoang_co' 
  | 'tang_tien' 
  | 'luan_hoi_hai' 
  | 'than_ma_mo' 
  | 'hon_don_gioi';

export type ZoneCellType = 
  | 'empty' 
  | 'monster' 
  | 'elite' 
  | 'boss' 
  | 'treasure' 
  | 'ancient_altar' 
  | 'array_trap' 
  | 'wraith' 
  | 'spring' 
  | 'exit_portal';

export interface ForbiddenZoneCell {
  x: number;
  y: number;
  type: ZoneCellType;
  isRevealed: boolean;   // Đã mở sương mù hay chưa
  isVisited: boolean;    // Nhân vật đã bước qua chưa
  isResolved: boolean;   // Đã giải quyết sự kiện/quái chưa
  name?: string;
  description?: string;
  data?: any;            // Thông tin chi tiết quái/rương/bẫy
}

export interface ForbiddenZoneMonsterInfo {
  name: string;
  title: string;
  powerRatio: number;
  hpRatio: number;
  dropExp: number;
  dropStones: number;
}

export interface ForbiddenZoneSpecialDrop {
  id: string;
  name: string;
  rate: number;
  grade: string;
  desc: string;
  type: 'material' | 'formation' | 'talisman' | 'pill' | 'weapon' | 'treasure';
}

export interface ForbiddenZoneConfig {
  id: ForbiddenZoneId;
  name: string;
  title: string;
  minRealmId: number;
  minRealmName: string;
  gridSize: number;       // 6 (36 ô) hoặc 7 (49 ô)
  bgGradient: string;
  borderTheme: string;
  accentColor: string;
  description: string;
  environmentalEffectName: string;
  environmentalEffectDesc: string;
  mpCost: number;
  baseAura: number;
  monsterPool: ForbiddenZoneMonsterInfo[];
  bossInfo: ForbiddenZoneMonsterInfo;
  specialDrops: ForbiddenZoneSpecialDrop[];
}

export interface ForbiddenZoneLootItem {
  id: string;
  name: string;
  quantity: number;
  grade?: string;
  type?: string;
  description?: string;
}

export interface ForbiddenZoneState {
  zoneId: ForbiddenZoneId;
  gridSize: number;      // 6 hoặc 7
  playerPos: { x: number; y: number };
  visionRadius: number;
  auraPower: number;     // 0 - 100 (Hộ thân linh quang)
  maxAuraPower: number;
  cells: ForbiddenZoneCell[][];
  lootBag: {
    linhThach: number;
    items: ForbiddenZoneLootItem[];
  };
  stepCount: number;
  isActive: boolean;
  exitUnlocked: boolean;
  logs: string[];
  activeCombat?: {
    monsterName: string;
    isBoss?: boolean;
    monsterHp: number;
    monsterMaxHp: number;
    monsterAtk: number;
  } | null;
}
