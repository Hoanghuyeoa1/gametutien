// lib/types/custom-sect.ts
// Pure Domain Types cho Phân Hệ "Khai Tông Lập Phái & Chân Truyền Đệ Tử (Sect Founding & Procedural Disciples Management)"

export type SectDoctrine = 'chinh_dao' | 'ma_dao' | 'kiem_tong' | 'dan_lo' | 'tran_dao';

export type DiscipleRank = 'ngoai_mon' | 'noi_mon' | 'chan_truyen' | 'truong_lao';

export type DiscipleTaskType = 'idle' | 'tend_garden' | 'mine_ores' | 'guard_gate' | 'explore_realm';

export interface ProceduralDisciple {
  id: string;
  name: string;
  gender: 'nam' | 'nu';
  realmIndex: number;
  realmName: string;
  linhCan: {
    name: string;
    element: string;
    grade: 'ha' | 'trung' | 'thuong' | 'cuc' | 'than';
  };
  stats: {
    canCot: number;    // 1 - 100
    ngoTinh: number;   // 1 - 100
    khiVan: number;    // 1 - 100
    loyalty: number;   // 0 - 100 (dưới 30 có nguy cơ đào tẩu)
    combatPower: number;
  };
  personalityTrait: {
    id: string;
    name: string;
    description: string;
  };
  rank: DiscipleRank;
  currentTask: DiscipleTaskType;
  taskAssignedAt?: number;
  taskDurationHours?: number;
  joinedAtTimestamp: number;
  appointmentData?: import('./disciple-appointment').DiscipleAppointmentData;
  isDispatchedToWar?: boolean; // Khóa viễn chinh trong Tông Môn Đại Chiến
}

export interface SectFacilities {
  mainHallLevel: number;           // Cấp Đại Điện (tăng giới hạn đệ tử tối đa)
  herbGardenFacilityLevel: number; // Cấp Dược Viên (tăng sản lượng thảo dược)
  mineralVeinFacilityLevel: number;// Cấp Mỏ Khoáng (tăng sản lượng quặng/linh thạch)
  guardianArrayLevel: number;      // Cấp Hộ Sơn Đại Trận
}

export interface CustomSectVault {
  linhThach: number;
  herbs: Record<string, number>;
  ores: Record<string, number>;
  lastHarvestTimestamp: number;
  deaconDiscipleId?: string;       // ID Tiên Đồng / Đệ Tử đảm nhiệm Chấp Sự Khố Phòng
}

export interface CustomSectState {
  isFounded: boolean;
  sectName: string;
  mountainName: string;
  doctrine: SectDoctrine;
  reputation: number; // Điểm Danh Vọng Tông Môn
  sectVault: CustomSectVault;
  disciples: ProceduralDisciple[];
  chosenInheritorId: string | null; // ID của Chân Truyền kế thừa y bát
  lastRecruitmentTimestamp: number;
  facilities: SectFacilities;
  // Phân hệ Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại
  sectWarState?: import('./sect-war').SectWarState;
  wildSpiritMountains?: import('./sect-war').WildSpiritMountain[];
  rivalSects?: import('./sect-war').RivalSectFaction[];
  sectWarHistory?: import('./sect-war').SectWarBattleReport[];
  tributeVault?: import('./sect-war').TributeVault;
  sectMorale?: number;
}
