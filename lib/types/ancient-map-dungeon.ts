// lib/types/ancient-map-dungeon.ts
// Kiểu dữ liệu cho phân hệ "Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh"
// (Secret Realm Map Fragments & Ancient Dungeons)

export type FragmentDirection = 'dong' | 'tay' | 'nam' | 'bac'; // 4 Mảnh: 1: Đông, 2: Tây, 3: Nam, 4: Bắc
export type AncientDungeonTier = 1 | 2 | 3 | 4 | 5; // Tương ứng từ Trúc Cơ đến Hóa Thần / Độ Kiếp

export interface MapFragmentItem {
  id: string;
  setId: string;               // Ví dụ: 'thai_co_kiem_chung', 'chan_long_di_tich', 'hon_don_tien_phu'
  setName: string;
  direction: FragmentDirection;
  pieceIndex: 1 | 2 | 3 | 4;
  rarityTier: AncientDungeonTier;
  dropRateWeight: number;
  description: string;
  lore?: string;
}

export interface CompleteAncientMapItem {
  id: string;
  setId: string;
  name: string;
  tier: AncientDungeonTier;
  targetDungeonName: string;
  requiredRealmIndex: number;
  description: string;
  synthesizedAt: number;
  spiritStonesCost: number;
}

export interface AncientDungeonStage {
  stageIndex: 1 | 2 | 3;
  stageName: string;
  enemyName: string;
  enemyTitle: string;
  enemyRealm: number;
  enemyStats: {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    speed: number;
    critRate: number;
  };
  specialAura?: string;
  isCleared: boolean;
}

export interface GuaranteedDivineReward {
  equipmentId?: string;
  equipmentName: string;
  divineWeaponType?: string;
  equipmentSlot?: 'weapon' | 'armor' | 'accessory' | 'ring' | 'artifact';
  equipmentStats?: {
    powerBonus: number;
    atkBonus?: number;
    defBonus?: number;
    hpBonus: number;
    mpBonus: number;
    speedBonus?: number;
    critRateBonus?: number;
    critDmgBonus?: number;
    description: string;
  };
  spiritStones: number;
  rareMaterials: { id?: string; name: string; amount: number }[];
}

export interface AncientDungeonInstance {
  instanceId: string;
  mapSetId: string;
  dungeonName: string;
  tier: AncientDungeonTier;
  openedAt: number;
  expiresAt: number; // Tồn tại trong 2 giờ thực tế: Date.now() + 2 * 3600 * 1000
  currentStageIndex: 1 | 2 | 3;
  stages: AncientDungeonStage[];
  isCompleted: boolean;
  guaranteedRewards: GuaranteedDivineReward;
}

export interface AncientMapVaultState {
  fragmentsInventory: Record<string, number>; // fragmentId -> count
  synthesizedMaps: CompleteAncientMapItem[];
  activeDungeon: AncientDungeonInstance | null;
  clearedDungeonsCount: number;
}

export interface AncientMapSetDefinition {
  id: string;
  name: string;
  shortName: string;
  tier: AncientDungeonTier;
  targetDungeonName: string;
  requiredRealmIndex: number;
  realmRequirementName: string;
  synthesisCostStones: number;
  description: string;
  fragments: Record<FragmentDirection, MapFragmentItem>;
  stagesConfig: {
    stageIndex: 1 | 2 | 3;
    stageName: string;
    enemyName: string;
    enemyTitle: string;
    enemyRealm: number;
    enemyStats: {
      hp: number;
      maxHp: number;
      atk: number;
      def: number;
      speed: number;
      critRate: number;
    };
    specialAura?: string;
  }[];
  guaranteedRewards: GuaranteedDivineReward;
}
