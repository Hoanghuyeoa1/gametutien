const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../lib/types');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1. character.ts
const characterContent = `// lib/types/character.ts
// Các định nghĩa kiểu dữ liệu về Thiên Phú, Linh Căn, Thể Chất, Mệnh Cách, Thần Hồn, Danh Hiệu & Thành Tựu

export type LinhCanElement = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho' | 'loi' | 'phong' | 'bang' | 'quang' | 'am' | 'ngu_hanh' | string;
export type LinhCanGrade = 'Tạp Linh Căn' | 'Chân Linh Căn' | 'Địa Linh Căn' | 'Thiên Linh Căn' | 'Biến Dị Linh Căn' | 'Hỗn Độn Linh Căn' | 'Hạ Phẩm' | 'Trung Phẩm' | 'Thượng Phẩm' | 'Cực Phẩm' | 'Thiên Phẩm' | string;

export interface LinhCan {
  name: string;
  element: LinhCanElement;
  grade: LinhCanGrade;
  description: string;
  damageBonus: number;
  speedBonus: number;
  purity?: number;
  tier?: number;
  [key: string]: any;
}

export type PhysiqueGrade = 
  | 'Phàm Phẩm' 
  | 'Linh Phẩm' 
  | 'Vương Phẩm' 
  | 'Hoàng Phẩm' 
  | 'Thần Phẩm' 
  | 'Chí Tôn' 
  | 'Phàm Thai' 
  | 'Linh Thể' 
  | 'Vương Thể' 
  | 'Hoàng Thể' 
  | 'Thần Thể' 
  | 'Thánh Thể Thượng Cổ'
  | string;

export type RefinementStage = 'Đoạn Cốt' | 'Luyện Tạng' | 'Hoán Huyết' | 'Kim Thân' | string;

export interface Physique {
  id?: string;
  name?: string;
  grade?: PhysiqueGrade;
  description?: string;
  specialEffect?: string;
  hpBonusPercent?: number;
  defenseBonusPercent?: number;
  damageBonusPercent?: number;
  breakthroughTuViMultiplier?: number;
  tamMaChanceMultiplier?: number;
  mpRegenPercent?: number;
  poisonArmorPen?: number;
  critDamageBonus?: number;
  cultivationSpeedBonusPercent?: number;
  dodgeBonusPercent?: number;
  critRateBonusPercent?: number;
  khangTamMaPercent?: number;
  badgeClass?: string;
  refinementStage: RefinementStage;
  refinementLevel: number;
  refinementExp: number;
  maxRefinementExp: number;
  [key: string]: any;
}

export type HexagramType = 
  | 'can' 
  | 'doai' 
  | 'ly' 
  | 'chan' 
  | 'ton' 
  | 'kham' 
  | 'can_son' 
  | 'khon'
  | 'dai_cat'
  | 'thuong_cat'
  | 'trung_cat'
  | 'hung'
  | 'dai_hung'
  | string;

export interface DailyDivinationState {
  lastDivinationDate?: string;
  hexagram: HexagramType;
  bonusPercent?: number;
  bonusType?: 'tuVi' | 'khiVan' | 'phongNgu' | 'congKich' | string;
  temporaryBuffUntil?: number;
  [key: string]: any;
}

export type DestinyGrade = 
  | 'Phàm Giai' 
  | 'Huyền Giai' 
  | 'Địa Giai' 
  | 'Thiên Giai' 
  | 'Thần Giai' 
  | 'Phàm' 
  | 'Linh' 
  | 'Huyền' 
  | 'Địa' 
  | 'Thiên' 
  | 'Tiên' 
  | 'Thần' 
  | 'Địa Phẩm' 
  | 'Thiên Phẩm' 
  | 'Chí Tôn'
  | string;

export interface DestinyFate {
  id: string;
  name: string;
  grade: DestinyGrade;
  description: string;
  effects: {
    atkBonusPercent?: number;
    defBonusPercent?: number;
    hpBonusPercent?: number;
    critRateBonus?: number;
    critDmgBonus?: number;
    dodgeRateBonus?: number;
    speedBonusPercent?: number;
    tuViReqMultiplier?: number;
    khiVanBonus?: number;
    soulBonus?: number;
    dmgReductionPercent?: number;
    armorPenetrationPercent?: number;
    lifestealPercent?: number;
    dropRateBonusPercent?: number;
    goodFortuneRateBonus?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface BodyRefinementState {
  realmIndex: number;
  stage?: RefinementStage;
  level: number;
  exp?: number;
  currentExp: number;
  maxExp: number;
  bonusHpPercent?: number;
  bonusDefPercent?: number;
  bonusAtkPercent?: number;
  [key: string]: any;
}

export interface SoulCultivationState {
  realmIndex: number;
  stage?: string;
  level: number;
  exp?: number;
  currentExp: number;
  maxExp: number;
  soulPower?: number;
  bonusCritRate?: number;
  bonusCritDmg?: number;
  [key: string]: any;
}

export type TitleRarity = 'pham' | 'linh' | 'huyen' | 'dia' | 'thien' | 'than' | string;

export interface TitleBuff {
  atkBonusPercent?: number;
  defBonusPercent?: number;
  hpPercent?: number;
  cultivateSpeedBonusPercent?: number;
  critRatePercent?: number;
  critDmgPercent?: number;
  speedBonus?: number;
  alchemySuccessBonus?: number;
  gardenYieldBonusPercent?: number;
  tuViSpeedBonusPercent?: number;
  khiVanBonus?: number;
  critRateBonus?: number;
  critDmgBonus?: number;
  [key: string]: any;
}

export type AchievementCategory = 'cultivation' | 'combat' | 'collection' | 'wealth' | 'garden' | 'crafting' | 'battle' | 'companion' | 'special' | string;

export interface AchievementDefinition {
  id: string;
  name?: string;
  title?: string;
  description: string;
  category: AchievementCategory;
  target: number;
  rewardLinhThach?: number;
  rewardTuVi?: number;
  rewardKhiVan?: number;
  rewardTitleId?: string;
  unlockedTitleId?: string;
  icon?: string;
  isCompleted?: boolean;
  isClaimed?: boolean;
  [key: string]: any;
}

export interface TitleDefinition {
  id: string;
  name: string;
  rarity: TitleRarity;
  description: string;
  badgeClass?: string;
  textGradient?: string;
  glowColor?: string;
  icon?: string;
  buffs: TitleBuff;
  colorClass?: string;
  [key: string]: any;
}

export interface AchievementsState {
  unlockedIds?: string[];
  claimedIds?: string[];
  unlockedTitleIds?: string[];
  claimedAchievementIds?: string[];
  activeTitleId?: string | null;
  stats?: Record<string, number>;
  [key: string]: any;
}
`;

// 2. items.ts
const itemsContent = `// lib/types/items.ts
import { LinhCanElement } from './character';

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
  maxSlots?: number;
  [key: string]: any;
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
  | 'manuals'
  | 'materials'
  | 'companions_beasts'
  | 'cultivation'
  | 'basic'
  | 'rare'
  | 'auction'
  | string;

export type MerchantItemType = 'pill' | 'herb' | 'ore' | 'equipment' | 'manual' | 'tinhHuyet' | 'linhThach' | 'trungPhamLinhThach' | string;

export interface MerchantItem {
  id: string;
  name: string;
  category?: MerchantCategory;
  itemType?: MerchantItemType;
  type?: MerchantItemType;
  price: number;
  costLinhThach?: number;
  stock: number;
  maxStock?: number;
  oneTimeOnly?: boolean;
  isBought?: boolean;
  quality?: any;
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
`;

// 3. combat.ts
const combatContent = `// lib/types/combat.ts
import { LinhCanElement } from './character';
import { Pill, Ore, Manual } from './items';

export interface CombatStats {
  atk: number;
  def: number;
  hp?: number;
  maxHp?: number;
  soul: number;
  speed: number;
  critRate: number;
  critDmg: number;
  dodgeRate?: number;
  hutMauRate?: number;
  xuyenGiapRate?: number;
  phanDmgRate?: number;
  dmgReduction?: number;
  hpRegenPercent?: number;
  soulSuppression?: boolean;
  [key: string]: any;
}

export interface CombatLogEntry {
  round: number;
  turn: 'player' | 'boss' | 'companion' | 'beast' | string;
  action: string;
  damage?: number;
  healing?: number;
  isCrit?: boolean;
  isDodge?: boolean;
  message: string;
  [key: string]: any;
}

export interface Boss {
  id: string;
  name: string;
  realm: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
  element?: LinhCanElement;
  description?: string;
  drops?: {
    tuVi?: number;
    linhThach?: number;
    items?: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface WorldBossMilestone {
  percent?: number;
  claimed?: boolean;
  damageReq: number;
  title?: string;
  rewards: {
    tuVi: number;
    linhThach: number;
    tinhHuyet?: number;
    pillId?: string;
    oreId?: string;
    description?: string;
    items?: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface WorldBossState {
  bossId?: string;
  id?: string;
  name: string;
  title?: string;
  currentHp: number;
  maxHp: number;
  element: LinhCanElement;
  realmLevel: number;
  power: number;
  totalDamageDealt?: number;
  attemptsToday?: number;
  description?: string;
  skills?: { name: string; desc: string; dmgMul: number }[];
  milestones: WorldBossMilestone[];
  lastAttemptDate?: string;
  [key: string]: any;
}

export interface TowerFloorInfo {
  floor: number;
  name: string;
  type: 'normal' | 'elite' | 'overlord' | string;
  bossName: string;
  realmLevel: number;
  combatPower: number;
  element: LinhCanElement;
  rewards: {
    tuVi: number;
    linhThach: number;
    towerPoints: number;
    tinhHuyet: number;
    specialChest?: string;
    [key: string]: any;
  };
  description: string;
  [key: string]: any;
}

export interface CombatRoundAction {
  skillName?: string;
  isCrit: boolean;
  isDodge: boolean;
  damage: number;
  soulSuppressed?: boolean;
  hpRegen?: number;
  description: string;
  [key: string]: any;
}

export interface CombatRoundLog {
  round: number;
  playerHpBefore: number;
  bossHpBefore: number;
  playerAction: CombatRoundAction;
  bossAction: {
    skillName: string;
    damage: number;
    isCrit: boolean;
    description: string;
    [key: string]: any;
  };
  playerHpAfter: number;
  bossHpAfter: number;
  [key: string]: any;
}

export interface DetailedBattleReport {
  victory: boolean;
  bossName: string;
  bossRealm: number;
  bossElement: LinhCanElement;
  bossDifficulty?: string;
  bossMaxHp: number;
  playerMaxHp: number;
  rounds: CombatRoundLog[];
  finalPlayerHp: number;
  finalBossHp: number;
  rewards?: {
    tuVi: number;
    linhThach: number;
    danhVong: number;
    tinhHuyet?: number;
    towerPoints?: number;
    droppedPill?: Pill;
    [key: string]: any;
  };
  [key: string]: any;
}
`;

// 4. cultivation.ts
const cultivationContent = `// lib/types/cultivation.ts
import { Pill, Herb, Ore } from './items';
import { LinhDienState } from './garden';

export type CultivateStance = 'co_ban' | 'hiem_canh' | 'doat_bao' | 'normal' | 'breakthrough' | 'safe' | 'aggressive' | string;

export interface CultivateEncounterEvent {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  category?: 'tam_ma' | 'bien_co' | string;
  type?: string;
  rewards?: any;
  choices?: any[];
  [key: string]: any;
}

export interface CultivateSummaryData {
  stance: CultivateStance;
  duration?: number;
  roundsCompleted?: number;
  totalTuVi?: number;
  totalLinhLuc?: number;
  totalLinhThach?: number;
  totalLinhThachTrungPham?: number;
  tuViGain: number;
  linhThachGain: number;
  trungPhamLinhThachGain: number;
  tinhHuyetGain: number;
  ngoTinhGain: number;
  khiVanGain: number;
  bodyExpGain: number;
  tamMaTriggered?: boolean;
  tamMaRounds?: number;
  events: CultivateEncounterEvent[];
  drops?: CultivateDropItem[];
  message?: string;
  [key: string]: any;
}

export interface LogEntry {
  id: string;
  timestamp: string | number;
  title: string;
  content?: string;
  description?: string;
  type: 'cultivation' | 'breakthrough' | 'combat' | 'event' | 'sect' | 'companion' | 'special' | 'danger' | string;
  [key: string]: any;
}

export interface Realm {
  id: number;
  name: string;
  stage: string;
  tier: string;
  emoji: string;
  description: string;
  requirements: {
    tuVi: number;
    linhThach: number;
    coduyen?: string;
    bossRequired?: string;
    thienKiep?: boolean;
    [key: string]: any;
  };
  breakthrough: {
    baseSuccessRate: number;
    tamMaChance: number;
    failureRisks: string[];
    rewardOnSuccess: {
      tuVi: number;
      linhThach: number;
      danhVong: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
  possibleEvents: string[];
  successText: string;
  [key: string]: any;
}

export interface CultivationSession {
  duration: number;
  tuViGain: number;
  randomEvents: RandomEvent[];
  stance?: CultivateStance;
  stanceMultiplier?: number;
  [key: string]: any;
}

export interface CultivateDropItem {
  id?: string;
  name: string;
  type?: 'herb' | 'ore' | 'pill' | 'equipment' | 'manual' | 'tinhHuyet' | 'linhThach' | 'trungPhamLinhThach' | string;
  quantity: number;
  count?: number;
  quality?: string;
  grade?: string;
  description?: string;
  data?: any;
  [key: string]: any;
}

export interface CultivationResult {
  tuViGain: number;
  linhLucGain?: number;
  drops: CultivateDropItem[];
  tamMaTriggered?: boolean;
  message?: string;
  [key: string]: any;
}

export interface BreakthroughResult {
  success: boolean;
  message: string;
  nextRealmId?: number;
  tamMaFaced?: boolean;
  penalty?: {
    tuViLost?: number;
    injured?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  availableFrom: number;
  availableTo: number;
  triggerChance: number;
  khiVanModifier: number;
  choices: EventChoice[];
  [key: string]: any;
}

export interface EventChoice {
  id: string;
  text: string;
  requirements?: {
    ngoTinh?: number;
    tamCanh?: number;
    khiVan?: number;
    linhThach?: number;
    [key: string]: any;
  };
  outcomes: EventOutcome[];
  [key: string]: any;
}

export interface EventOutcome {
  probability: number;
  description: string;
  effects: {
    tuVi?: number;
    canCot?: number;
    ngoTinh?: number;
    khiVan?: number;
    tamCanh?: number;
    linhThach?: number;
    danhVong?: number;
    khiHuyet?: number;
    specialReward?: string;
    [key: string]: any;
  };
  flavor: string;
  [key: string]: any;
}

export interface OfflineProgressItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  quality?: string;
  grade?: string;
  [key: string]: any;
}

export interface OfflineProgressResult {
  elapsedSeconds: number;
  creditedSeconds: number;
  maxCapSeconds: number;
  isCapped: boolean;
  tuViGain?: number;
  tuViGained: number;
  linhThachGain?: number;
  linhThachGained: number;
  maturedPlotsCount: number;
  drops?: CultivateDropItem[];
  bonusItems: (CultivateDropItem | OfflineProgressItem)[];
  herbsGrown?: number;
  updatedLinhDien?: LinhDienState;
  [key: string]: any;
}

export type LogType = 'cultivation' | 'breakthrough' | 'combat' | 'event' | 'sect' | 'companion' | 'secretRealm' | 'auction' | string;
export type DualCultivationType = 'exp' | 'breakthrough' | 'soul' | 'stats' | string;

export interface SoundSettings {
  isMuted?: boolean;
  muted?: boolean;
  bgmVolume: number;
  sfxVolume: number;
  [key: string]: any;
}

export type SFXType = 'breakthrough' | 'cultivate' | 'combat_hit' | 'crit' | 'event' | 'reward' | 'click' | string;
`;

// 5. dungeon.ts
const dungeonContent = `// lib/types/dungeon.ts
import { Realm } from './cultivation';

export type SecretRealmDifficulty = 'easy' | 'normal' | 'hard' | 'nightmare' | 'hell' | string;
export type DungeonRoomType = 'combat' | 'elite' | 'treasure' | 'event' | 'rest' | 'boss' | string;

export interface DungeonBuff {
  id: string;
  name: string;
  description: string;
  statKey?: string;
  value?: number;
  statBonus: Record<string, number>;
  durationRooms?: number;
  [key: string]: any;
}

export interface DungeonRoomChoice {
  id: string;
  title: string;
  type?: DungeonRoomType;
  roomType?: string;
  dangerLevel?: any;
  icon?: string;
  resolved?: boolean;
  description: string;
  previewReward?: string;
  [key: string]: any;
}

export interface DungeonLootBag {
  linhThach: number;
  gems: any[];
  materials: { id: string; name?: string; quantity: number; [key: string]: any }[];
  herbs: { id: string; name?: string; quantity: number; [key: string]: any }[];
  [key: string]: any;
}

export interface DungeonRunState {
  realmId: string;
  difficulty?: SecretRealmDifficulty;
  currentFloor: number;
  maxFloors: number;
  currentRoomIndex?: number;
  roomsInCurrentFloor?: number;
  stepInFloor: number;
  buffs?: DungeonBuff[];
  activeBuffs: DungeonBuff[];
  availableRooms: DungeonRoomChoice[];
  availableChoices?: DungeonRoomChoice[];
  currentRoom?: any;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  lootBag: DungeonLootBag;
  playerHpPercent?: number;
  playerLinhLucPercent?: number;
  accumulatedRewards?: {
    linhThach: number;
    tuVi: number;
    tinhHuyet: number;
    items: any[];
    [key: string]: any;
  };
  isCompleted?: boolean;
  isDefeated?: boolean;
  isActive?: boolean;
  realmName?: string;
  roomEventResolved?: boolean;
  [key: string]: any;
}

export interface SecretRealmDungeon {
  id: string;
  name: string;
  minRealm: number;
  realmName?: string;
  mpCost: number;
  totalFloors: number;
  difficulty?: SecretRealmDifficulty | string;
  description: string;
  floors?: number;
  hazards?: string[];
  rewardsPreview?: string;
  recommendedRealm?: number;
  rewardsSummary?: string;
  possibleDrops?: string[];
  bannerClass?: string;
  [key: string]: any;
}
`;

// 6. sect.ts
const sectContent = `// lib/types/sect.ts
import { LinhCanElement } from './character';

export type SectId = 'thanh_van_mon' | 'huyet_sat_tong' | 'van_kiem_tong' | 'chinh_dao' | 'ma_dao' | 'kiem_phai' | string;
export type SectRank = 'ngoai_mon' | 'noi_mon' | 'chan_truyen' | 'truong_lao' | 'chuong_mon' | 'tap_dich' | string;

export interface SectRankDetail {
  rank: SectRank;
  title: string;
  requiredContribution: number;
  salary?: number;
  dailySalaryLinhThach?: number;
  [key: string]: any;
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
  [key: string]: any;
}

export interface SectShopItem {
  id: string;
  name: string;
  type: 'dan_phuong' | 'bi_tich' | 'seed' | 'item' | string;
  costContribution: number;
  requiredRank: SectRank;
  effectSummary: string;
  recipeId?: string;
  manualId?: string;
  seedId?: string;
  pillId?: string;
  isBought?: boolean;
  [key: string]: any;
}

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
  [key: string]: any;
}

export interface SectProfile {
  id: string;
  name: string;
  shortName: string;
  tagline?: string;
  leader?: string;
  description: string;
  badgeClass?: string;
  themeColor?: string;
  icon?: string;
  faction?: string;
  color?: string;
  specialBuff?: string;
  buffDetails?: Record<string, any>;
  ranks: any[];
  [key: string]: any;
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
    [key: string]: any;
  };
  avatarEmoji?: string;
  skillName?: string;
  skillDmgMultiplier?: number;
  description?: string;
  rewards: { contribution: number; linhThach: number; danhVong: number; [key: string]: any; };
  [key: string]: any;
}
`;

// 7. companions.ts
const companionsContent = `// lib/types/companions.ts
import { LinhCanElement } from './character';
import { CombatStats } from './combat';

export interface CompanionBuff {
  cultivateSpeedBonus?: number;
  tamMaDamageReduction?: number;
  critDmgBonus?: number;
  lifestealPercent?: number;
  alchemySuccessBonus?: number;
  dailyRandomPill?: boolean;
  atkBonusPercent?: number;
  defBonusPercent?: number;
  hpBonusPercent?: number;
  bossAssistChance?: number;
  ngoTinhBonus?: number;
  khiVanBonus?: number;
  soulBonus?: number;
  dodgeBonus?: number;
  speedBonus?: number;
  unlockHiddenEncounters?: boolean;
  iceResistance?: number;
  freezeChance?: number;
  critRateBonus?: number;
  burnDrainChance?: number;
  hpRegenPercent?: number;
  lightningDamageBonus?: number;
  stunBossChance?: number;
  merchantDiscountPercent?: number;
  enemyAtkReduction?: number;
  swordManualBonusPercent?: number;
  [key: string]: any;
}

export interface CompanionCombinedSkill {
  id?: string;
  name: string;
  desc?: string;
  description?: string;
  quote?: string;
  triggerChance?: number;
  damageMultiplier: number;
  healPercent?: number;
  shieldPercent?: number;
  effect?: string;
  [key: string]: any;
}

export interface CompanionDefinition {
  id: string;
  name: string;
  title: string;
  avatar: string;
  element?: LinhCanElement;
  description?: string;
  affinity?: number;
  maxAffinity?: number;
  stage?: number;
  buffs: CompanionBuff;
  combinedSkill: CompanionCombinedSkill;
  giftPreferences?: string[];
  unlockedStoryEncounters?: string[];
  initialRealm?: string;
  realmIndex: number;
  favoriteGifts: string[];
  favoriteDescription?: string;
  secretBackground?: string;
  storyQuest?: any;
  [key: string]: any;
}

export interface CompanionPlayerState {
  id: string;
  isMet?: boolean;
  affinity: number;
  isBonded: boolean;
  bondedAt?: number;
  lastSongTuTime?: number;
  lastChatTime?: number;
  totalSongTuCount?: number;
  questStarted?: boolean;
  questCompleted?: boolean;
  tokenEquipped?: boolean;
  tokenName?: string;
  tokenDescription?: string;
  tokenIcon?: string;
  assignedGarden?: boolean;
  lastSongTuType?: 'tu_vi' | 'linh_luc' | 'tam_than' | 'luyen_the' | string;
  [key: string]: any;
}

export interface CompanionsDataState {
  activeCompanionId?: string | null;
  stationedGardenCompanionId?: string | null;
  tamThanHopNhatUntil?: number;
  companions: Record<string, CompanionPlayerState>;
  tamTinhThanDieuUntil?: number;
  [key: string]: any;
}

// CompanionsDataState defined as interface above
`;

// 8. beasts.ts
const beastsContent = `// lib/types/beasts.ts
import { LinhCanElement } from './character';

export type BeastQuality = 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'than_pham' | 'thien_pham' | string;
export type SpiritBeastStage = 1 | 2 | 3 | 4 | number;
export type BeastRole = 'combat' | 'mount' | 'guardian' | 'assist' | string;

export interface SpiritBeastStats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  blockPercent: number;
  mountSpeedBonus: number;
  mpRegenBonus: number;
  [key: string]: any;
}

export interface SpiritBeastSkill {
  id?: string;
  name: string;
  desc?: string;
  description?: string;
  effect?: string;
  stageReq?: number;
  damageMultiplier?: number;
  triggerChance?: number;
  [key: string]: any;
}

export interface SpiritBeast {
  id: string;
  name: string;
  species: string;
  quality: BeastQuality | string;
  element: LinhCanElement;
  level: number;
  maxLevel?: number;
  exp: number;
  maxExp: number;
  star?: number;
  maxStar?: number;
  atkBonus?: number;
  defBonus?: number;
  hpBonus?: number;
  speedBonus?: number;
  stage: SpiritBeastStage;
  stageName?: string;
  loyalty: number;
  role?: BeastRole | string;
  stats: SpiritBeastStats;
  skills: SpiritBeastSkill[];
  avatar: string;
  description?: string;
  isDeployed?: boolean;
  [key: string]: any;
}

export interface BeastEgg {
  id: string;
  name: string;
  quality: BeastQuality | string;
  potentialSpecies: string;
  progress: number;
  requiredProgress: number;
  infusedLinhThach: number;
  infusedMp: number;
  incubateProgressSeconds?: number;
  requiredSeconds?: number;
  possibleBeastIds?: string[];
  avatar?: string;
  description?: string;
  [key: string]: any;
}
`;

// 9. garden.ts
const gardenContent = `// lib/types/garden.ts

export interface GardenPlot {
  id: number;
  seedId?: string | null;
  herbId?: string | null;
  plantedAt?: number | null;
  matureAt?: number | null;
  harvestAt?: number | null;
  readyToHarvest?: boolean;
  isUnlocked: boolean;
  [key: string]: any;
}

export interface LinhDienLevelInfo {
  level: number;
  name: string;
  maxPlots: number;
  growthSpeedBonusPercent?: number;
  speedBonusPercent: number;
  yieldBonusPercent: number;
  upgradeCostLinhThach: number;
  description?: string;
  [key: string]: any;
}

export interface LinhDienState {
  level: number;
  plots: GardenPlot[];
  fertilizerCount?: number;
  [key: string]: any;
}
`;

// 10. storyline.ts
const storylineContent = `// lib/types/storyline.ts

export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | string;

export interface StorylineDialogue {
  speaker: string;
  text: string;
  [key: string]: any;
}

export interface StorylineObjective {
  type: string;
  description: string;
  targetId?: number;
  targetCount?: number;
  [key: string]: any;
}

export interface StorylineChoice {
  id: string;
  label?: string;
  text?: string;
  description?: string;
  dialogue?: string;
  requirements?: {
    realmIndex?: number;
    canCot?: number;
    ngoTinh?: number;
    khiVan?: number;
    tamCanh?: number;
    linhThach?: number;
    [key: string]: any;
  };
  outcomes: {
    tamCanhChange?: number;
    khiVanChange?: number;
    tuViReward?: number;
    rewardTuVi?: number;
    linhThachReward?: number;
    rewardLinhThach?: number;
    flavorText?: string;
    dialogue?: string;
    label?: string;
    rewardTitleId?: string;
    itemRewards?: { type?: string; id?: string; quantity?: number; quality?: string; grade?: string; name?: string; description?: string; maxSlots?: number; [key: string]: any; }[];
    rewardItems?: { type?: string; id?: string; quantity?: number; quality?: string; grade?: string; name?: string; description?: string; maxSlots?: number; [key: string]: any; }[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface StorylineQuest {
  id: string;
  chapterId: string;
  title: string;
  realmRequirement: number;
  prologue: string;
  dialogues: StorylineDialogue[];
  dialogue?: string[] | StorylineDialogue[];
  objectives: StorylineObjective;
  choices?: StorylineChoice[];
  epilogueOnComplete?: string;
  isCompleted?: boolean;
  [key: string]: any;
}

export interface StorylineChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  recommendedRealm?: string;
  bannerColor?: string;
  quests: StorylineQuest[];
  [key: string]: any;
}

export interface StorylineState {
  currentChapterId?: string;
  currentChapter?: number | string;
  activeQuestId?: string | null;
  completedQuestIds: string[];
  choiceHistory?: Record<string, string>;
  [key: string]: any;
}
`;

// 11. auction.ts
const auctionContent = `// lib/types/auction.ts

export type AuctionItemCategory = 'equipment' | 'manual' | 'pill' | 'egg' | 'material' | 'special' | string;
export type AuctionRarity = 'rare' | 'epic' | 'legendary' | 'mythic' | string;

export interface AuctionNPC {
  id: string;
  name: string;
  title?: string;
  personality?: string;
  avatar?: string;
  budget: number;
  thanThuc: number;
  color?: string;
  dialogue?: string;
  maxBidMultiplier?: number;
  targetCategories?: AuctionItemCategory[];
  currentBid?: number;
  isPassed?: boolean;
  hasFolded?: boolean;
  isIntimidated?: boolean;
  [key: string]: any;
}

export interface AuctionBidRecord {
  id?: string;
  bidderId?: string;
  bidderName: string;
  bidderType?: string;
  amount: number;
  isPlayer?: boolean;
  timestamp?: string | number;
  quote?: string;
  [key: string]: any;
}

export interface AuctionLotItem {
  id: string;
  name: string;
  type?: string;
  category: string;
  rarity: AuctionRarity | string;
  grade?: string;
  icon?: string;
  description: string;
  lore?: string;
  startingPrice: number;
  reservePrice: number;
  minBidIncrement?: number;
  currentPrice?: number;
  roundsRemaining?: number;
  itemData?: any;
  rewardPayload?: any;
  [key: string]: any;
}

export interface AuctionSessionState {
  isActive: boolean;
  sessionTitle: string;
  items: AuctionLotItem[];
  currentItemIndex: number;
  currentPrice: number;
  highestBidder: {
    name: string;
    isPlayer: boolean;
    bidderId: string;
    [key: string]: any;
  };
  currentLotIndex?: number;
  totalLots?: number;
  currentLot?: any;
  playerCurrentBid?: number;
  hammerCount: number;
  roundTimer?: number;
  biddingHistory?: any[];
  bidHistory: AuctionBidRecord[];
  npcs: AuctionNPC[];
  status?: 'preview' | 'bidding' | 'sold' | 'passed' | 'completed' | string;
  logs?: any[];
  lastActionTime: number;
  [key: string]: any;
}
`;

// 12. player.ts
const playerContent = `// lib/types/player.ts
import {
  LinhCan,
  Physique,
  DailyDivinationState,
  DestinyFate,
  BodyRefinementState,
  SoulCultivationState,
  AchievementsState
} from './character';
import {
  Equipment,
  EquippedManualSlots,
  Manual,
  InventoryBag,
  StorageBag,
  ArtisanState,
  MerchantState,
  Pill,
  Herb,
  Ore,
  InventoryBook,
  GemItem
} from './items';
import { WorldBossState, CombatStats } from './combat';
import { LinhDienState } from './garden';
import { SectId, SectRank, SectState } from './sect';
import { CompanionsDataState } from './companions';
import { SpiritBeast, BeastEgg } from './beasts';
import { StorylineState } from './storyline';
import { AuctionSessionState } from './auction';
import { DungeonRunState } from './dungeon';

export interface PlayerStats {
  name?: string;
  tuVi: number;
  canCot: number;
  ngoTinh: number;
  khiVan: number;
  tamCanh: number;
  linhThach: number;
  trungPhamLinhThach?: number;
  thuongPhamLinhThach?: number;
  cucPhamLinhThach?: number;
  tienTinh?: number;
  danhVong: number;
  currentRealm: number;
  tongMon?: string | null;
  sect?: string | null;
  lastActiveTimestamp?: number;
  khiHuyet?: number;
  linhLuc?: number;
  maxKhiHuyet?: number;
  maxLinhLuc?: number;
  
  // Character Progression
  linhCan?: LinhCan;
  physique?: Physique;
  physiques?: Physique[];
  destiny?: DestinyFate;
  destinies?: DestinyFate[];
  dailyDivination?: DailyDivinationState;
  bodyRefinement?: BodyRefinementState;
  soulCultivation?: SoulCultivationState;
  achievements?: AchievementsState;
  
  // Inventory & Artisan
  inventory?: InventoryBag;
  storageBag?: StorageBag;
  equipment?: Record<string, Equipment | undefined>;
  equippedItems?: {
    weapon?: Equipment | null;
    armor?: Equipment | null;
    accessory?: Equipment | null;
    ring?: Equipment | null;
    artifact?: Equipment | null;
    [key: string]: any;
  };
  manuals?: Manual[];
  equippedManuals?: EquippedManualSlots;
  artisan?: ArtisanState;
  merchant?: MerchantState;
  merchantState?: MerchantState;
  
  // Sect, Garden, Dungeon, Companions, Beasts
  sectState?: SectState;
  garden?: LinhDienState;
  linhDien?: LinhDienState;
  companions?: CompanionsDataState;
  companionsState?: CompanionsDataState;
  spiritBeasts?: SpiritBeast[];
  beasts?: SpiritBeast[];
  activeBeastId?: string | null;
  beastEggs?: BeastEgg[];
  storylineState?: StorylineState;
  auctionState?: AuctionSessionState | null;
  dungeonRunState?: DungeonRunState | null;
  dungeonRun?: DungeonRunState | null;
  worldBoss?: WorldBossState;
  activeBuffs?: any;

  // Dynamic Index Signature for extensible sub-states
  [key: string]: any;
}
`;

// 13. index.ts
const indexContent = `// lib/types/index.ts
// Barrel export toàn bộ kiểu dữ liệu dự án gametutien

export * from './character';
export * from './items';
export * from './combat';
export * from './cultivation';
export * from './dungeon';
export * from './sect';
export * from './companions';
export * from './beasts';
export * from './garden';
export * from './storyline';
export * from './auction';
export * from './player';
`;

fs.writeFileSync(path.join(outDir, 'character.ts'), characterContent);
fs.writeFileSync(path.join(outDir, 'items.ts'), itemsContent);
fs.writeFileSync(path.join(outDir, 'combat.ts'), combatContent);
fs.writeFileSync(path.join(outDir, 'cultivation.ts'), cultivationContent);
fs.writeFileSync(path.join(outDir, 'dungeon.ts'), dungeonContent);
fs.writeFileSync(path.join(outDir, 'sect.ts'), sectContent);
fs.writeFileSync(path.join(outDir, 'companions.ts'), companionsContent);
fs.writeFileSync(path.join(outDir, 'beasts.ts'), beastsContent);
fs.writeFileSync(path.join(outDir, 'garden.ts'), gardenContent);
fs.writeFileSync(path.join(outDir, 'storyline.ts'), storylineContent);
fs.writeFileSync(path.join(outDir, 'auction.ts'), auctionContent);
fs.writeFileSync(path.join(outDir, 'player.ts'), playerContent);
fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent);

console.log('Complete precision types generated in lib/types/!');
