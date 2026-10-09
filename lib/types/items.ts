import { LinhCanElement } from './character';
import { EquipmentSlotType, EquipmentTier, EquipmentItemStats } from './equipment-shop';
import { CompanionShopItem, CompanionArchetype, CompanionShopTier } from './companions-shop';
import { BeastShopItem, BeastArchetype, BeastShopTier } from './beasts-shop';
import { StorageShopItem, StorageCategory, StorageShopTier } from './storage-shop';
import { ModularWeaponMetadata } from './modular-metallurgy';
import { WeaponInscriptionMetadata } from './formation-inscription';
import { InfusedSoulMetadata } from './soul-infusion';
import { BloodBondMetadata } from './legacy-tempering';
import { LightningTemperedMetadata } from './weapon-tribulation-array';

export type PillGrade = 'Nhất Phẩm' | 'Nhị Phẩm' | 'Tam Phẩm' | 'Tứ Phẩm' | 'Ngũ Phẩm' | 'Thần Phẩm' | string;
export type HerbGrade = 'Nhất Phẩm' | 'Nhị Phẩm' | 'Tam Phẩm' | 'Tứ Phẩm' | 'Ngũ Phẩm' | 'Thần Phẩm' | string;
export type OreGrade = 'Nhất Phẩm' | 'Nhị Phẩm' | 'Tam Phẩm' | 'Tứ Phẩm' | 'Ngũ Phẩm' | 'Thần Phẩm' | string;
export type EquipmentGrade = 'Phàm Khí' | 'Linh Khí' | 'Bảo Khí' | 'Cổ Bảo' | 'Tiên Thiên Linh Bảo' | string;
export type EquipmentSlot = 'weapon' | 'armor' | 'ring' | 'amulet' | 'boots' | 'helmet' | 'artifact' | string;
export type ItemQuality = 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'than_pham' | 'thien_pham' | string;

export interface Pill {
  id: string;
  name: string;
  grade: PillGrade;
  description: string;
  effectType?: string;
  effectValue: number;
  tuViGain?: number;
  breakthroughBonusPercent?: number;
  tamMaReductionPercent?: number;
  price?: number;
  quantity: number;
  quality?: string;
  count?: number;
  veinMetadata?: import('./pill-veins').VeinedPillMetadata;
  isMutated?: boolean;
  [key: string]: any;
}

export interface Herb {
  id: string;
  name: string;
  grade: HerbGrade;
  description: string;
  growthTimeSeconds?: number;
  element?: LinhCanElement;
  price: number;
  quantity: number;
  quality?: string;
  count?: number;
  [key: string]: any;
}

export interface Ore {
  id: string;
  name: string;
  grade: OreGrade;
  description: string;
  element?: LinhCanElement;
  price: number;
  quantity: number;
  quality?: string;
  count?: number;
  [key: string]: any;
}

export type GemType = 'kim' | 'mộc' | 'thủy' | 'hỏa' | 'thổ' | 'lôi' | 'phong';
export type AffixRarity = 'luc' | 'lam' | 'tim' | 'kim' | 'than';

export interface EquipmentAffix {
  id: string;
  name?: string;
  rarity: AffixRarity;
  statKey: string;
  value: number;
  type?: string;
  description?: string;
  isLocked?: boolean;
  [key: string]: any;
}

export interface EssenceReforgeConfig {
  baseEssenceCost: number;       // Chi phí Tinh Hoa cơ bản theo phẩm cấp đồ
  essencePerLockedAffix: number; // Phụ phí cho mỗi dòng bị khóa
  minGuaranteedRarity: 'tim' | 'kim' | 'than'; // Đảm bảo phẩm cấp tối thiểu
}

export interface ReforgeCostConfig {
  baseLinhThach: number;
  perLockedAffixLinhThach: number;
  perLockedAffixOreCount: number;
  requiredOreId: string;
  requiredOreName: string;
  essenceConfig?: EssenceReforgeConfig;
}

export interface EquipmentSocket {
  slotIndex?: number;
  index?: number;
  unlocked: boolean;
  gem?: GemItem | null;
  [key: string]: any;
}

export interface GemItem {
  id: string;
  name: string;
  type?: GemType;
  gemType: GemType;
  grade?: number;
  level?: number;
  statKey?: string;
  statBonus?: any;
  value?: number;
  price?: number;
  quantity: number;
  count?: number;
  description?: string;
  [key: string]: any;
}

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot | string;
  type?: 'weapon' | 'armor' | 'accessory' | 'ring' | 'artifact' | string;
  grade: EquipmentGrade;
  quality?: string;
  powerBonus: number;
  enhancement: number;
  atkBonus?: number;
  defBonus?: number;
  hpBonus: number;
  mpBonus: number;
  speedBonus?: number;
  critRateBonus?: number;
  critDmgBonus?: number;
  refinementLevel?: number;
  affixes?: EquipmentAffix[];
  sockets?: EquipmentSocket[];
  maxSockets?: number;
  description?: string;
  price?: number;
  alloyMetadata?: ModularWeaponMetadata | null;
  inscriptionData?: WeaponInscriptionMetadata | null;
  infusedSoul?: InfusedSoulMetadata | null;
  bloodBondData?: BloodBondMetadata | null;
  reforgeCount?: number;
  lightningTempering?: LightningTemperedMetadata | null;
  [key: string]: any;
}

export interface Manual {
  id: string;
  name: string;
  type: 'tam_phap' | 'cong_phap' | 'than_thong' | 'than_phap' | string;
  grade: string;
  level: number;
  maxLevel: number;
  description: string;
  element?: LinhCanElement;
  tuViPerLevel: number;
  speedBonusPerLevel?: number;
  activeSkill?: any;
  maxLevelPassive?: any;
  atkBonus?: number;
  defBonus?: number;
  hpBonus?: number;
  cultivateBonus?: number;
  [key: string]: any;
}

export interface InventoryBook {
  id: string;
  name: string;
  description: string;
  quantity: number;
  grade?: string;
  itemType?: string;
  unlockArtisan?: string;
  maxSlots?: number;
  [key: string]: any;
}

export interface StorageBagItem {
  id: string;
  name: string;
  grade: string;
  maxSlots: number;
  description: string;
  quantity: number;
  price?: number;
  [key: string]: any;
}

export interface InventoryBag {
  pills: Pill[];
  herbs: Herb[];
  ores: Ore[];
  equipment?: Equipment[];
  equipments?: Equipment[];
  manuals?: Manual[];
  books?: InventoryBook[];
  gems?: GemItem[];
  bags?: StorageBagItem[];
  forgingEssence?: number; // Tinh Hoa Rèn Đúc tích lũy từ phân giải trang bị
  maxSlots?: number;
  [key: string]: any;
}

export type PlayerInventory = InventoryBag;

export type ForgingMainTab = 'forge' | 'inlay' | 'reforge' | 'natal' | 'dismantle';

export interface DismantleReward {
  oreId: string;
  oreName: string;
  oreQuantity: number;
  forgingEssence: number;
  recoveredGems: GemItem[];
  linhThachRefund: number;
  ores?: { oreId: string; oreName: string; oreQuantity: number }[];
}

export interface StorageBag {
  level?: number;
  maxSlots?: number;
  upgradeCostLinhThach?: number;
  pills?: Pill[];
  herbs?: Herb[];
  ores?: Ore[];
  equipment?: Equipment[];
  [key: string]: any;
}

export interface DanRecipe {
  id: string;
  name?: string;
  pillId: string;
  pillName: string;
  grade: PillGrade | string;
  successRate?: number;
  baseSuccessRate: number;
  costLinhThach?: number;
  linhThachCost: number;
  ingredients?: { herbId: string; name?: string; count: number }[];
  herbsRequired: { herbId: string; herbName?: string; count: number }[];
  description: string;
  [key: string]: any;
}

export interface EquipRecipe {
  id: string;
  name: string;
  slot: string;
  targetEquipmentId?: string;
  targetName?: string;
  grade: EquipmentGrade;
  type?: string;
  basePower: number;
  baseHp: number;
  baseMp: number;
  successRate?: number;
  costLinhThach?: number;
  linhThachCost: number;
  storageCapacity?: number;
  description: string;
  ingredients?: { oreId: string; name?: string; count: number }[];
  oresRequired: { oreId: string; oreName?: string; count: number }[];
  [key: string]: any;
}

export interface HerbSeed {
  id: string;
  name: string;
  herbId: string;
  herbName: string;
  grade: string;
  growthTimeSeconds?: number;
  growthDurationSeconds: number;
  price?: number;
  costLinhThach: number;
  baseYield: number;
  quantity?: number;
  description: string;
  [key: string]: any;
}

export type ArtisanLevel = 1 | 2 | 3 | 4 | 5 | number;

export interface ArtisanState {
  unlocked?: boolean;
  level: ArtisanLevel;
  title: string;
  exp: number;
  maxExp: number;
  criticalCraftCount: number;
  [key: string]: any;
}

export type MerchantCategory =
  | 'all'
  | 'pills'
  | 'cultivation'
  | 'ores'
  | 'manuals'
  | 'skills'
  | 'divine'
  | 'materials'
  | 'herbs'
  | 'equipment'
  | 'companions_beasts'
  | 'companions'
  | 'beasts'
  | 'storage'
  | 'inventory'
  | 'sell'
  | 'exchange'
  | 'basic'
  | 'rare'
  | 'auction'
  | string;

export type MerchantItemType = 'pill' | 'herb' | 'ore' | 'equipment' | 'manual' | 'tinhHuyet' | 'linhThach' | 'trungPhamLinhThach' | string;

export interface MerchantItem {
  id: string;
  name: string;
  category?: MerchantCategory;
  pillType?: 'breakthrough' | 'exp' | 'stat' | 'lifespan' | 'recovery';
  cultivationItemType?: 'relic' | 'incense' | 'cushion' | 'array_flag' | 'spirit_vessel';
  companionItemType?: 'gift' | 'token';
  beastItemType?: 'food' | 'egg' | 'tool' | 'armor' | 'evolution';
  itemType?: MerchantItemType;
  type?: MerchantItemType;
  manualSlot?: 'tam_phap' | 'the_thuat' | 'than_thong' | 'than_phap' | 'artisan';
  equipmentType?: 'weapon' | 'armor' | 'accessory' | 'artifact' | 'boots';
  equipmentData?: {
    type: 'weapon' | 'armor' | 'accessory' | 'artifact' | 'boots';
    slot: 'weapon' | 'armor' | 'accessory' | 'ring' | 'artifact' | 'boots';
    tier: number;
    grade: string;
    baseStats: { [key: string]: number };
    affixes?: { name: string; bonus: { [key: string]: number } }[];
    sockets?: number;
    isNatalCandidate?: boolean;
  };
  price: number;
  costLinhThach?: number;
  stock: number;
  maxStock?: number;
  oneTimeOnly?: boolean;
  isSoldOutPermanent?: boolean;
  isBought?: boolean;
  quality?: any;
  grade?: any;
  tier?: number;
  tierName?: string;
  requiredRealmIndex?: number;
  requiredRealmName?: string;
  pillEffects?: any;
  pillDefinitionId?: string;
  cultivationEffects?: any;
  cultivationCategory?: any;
  manualStatModifiers?: any;
  manualCategory?: any;
  divineAbility?: any;
  divineCategory?: any;
  divineEffects?: any;
  herbCategory?: any;
  herbTier?: number;
  primaryAlchemyUse?: string;
  elementalAffinity?: any;
  oreCategory?: any;
  oreTier?: number;
  primaryForgingUse?: string;
  equipmentSlot?: EquipmentSlotType;
  equipmentTier?: EquipmentTier;
  equipmentStats?: EquipmentItemStats;
  companionData?: CompanionShopItem;
  companionArchetype?: CompanionArchetype;
  companionTier?: CompanionShopTier;
  beastData?: BeastShopItem;
  beastArchetype?: BeastArchetype;
  beastTier?: BeastShopTier;
  storageData?: StorageShopItem;
  storageCategory?: StorageCategory;
  storageTier?: StorageShopTier;
  data?: any;
  description: string;
  [key: string]: any;
}

export interface MerchantState {
  items: MerchantItem[];
  lastRefreshDate?: string;
  lastRefreshTimestamp?: number;
  manualRefreshCount?: number;
  boughtOneTimeItemIds?: string[];
  [key: string]: any;
}

export interface EquippedManualSlots {
  tamPhap?: Manual | string | null;
  congPhap?: Manual | string | null;
  thanThong?: Manual | string | null;
  thanPhap?: Manual | string | null;
  theThuat?: Manual | string | null;
  thanThong1?: Manual | string | null;
  thanThong2?: Manual | string | null;
  [key: string]: any;
}
