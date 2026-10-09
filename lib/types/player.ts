// lib/types/player.ts
import {
  LinhCan,
  Physique,
  DailyDivinationState,
  DestinyFate,
  DestinySlotState,
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
import { PlayerBeastsState } from './beasts-shop';
import { StorylineState } from './storyline';
import { AuctionSessionState } from './auction';
import { DungeonRunState } from './dungeon';
import { AbodeState } from './abode';
import { PhysiqueState } from './physique';
import { SoulState } from './soul';
import { FormationArtisan, FormationItem } from './formation';
import { TalismanArtisan, TalismanBeltSlot } from './talisman';
import { NatalArtifact } from './natal-artifact';
import { DaoFoundationGrade } from './dao-foundation';

export interface PlayerStats {
  name?: string;
  tuVi: number;
  canCot: number;
  ngoTinh: number;
  khiVan: number;
  tamCanh: number;
  linhThach: number;
  spiritStones?: number;
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
  thanThuc?: number;
  maxMp?: number;
  mp?: number;

  // Tuổi Thọ & Thọ Nguyên (Lifespan & Age System)
  age?: number;
  maxLifespan?: number;
  lifespanPillsUsed?: number;
  isToaHoaWarning?: boolean;
  
  // Character Progression
  linhCan?: LinhCan;
  physique?: Physique;
  physiques?: Physique[];
  destiny?: DestinyFate;
  destinies?: DestinyFate[];
  destinyBoard?: DestinySlotState;
  activeSynergies?: string[];
  dailyDivination?: DailyDivinationState;
  bodyRefinement?: BodyRefinementState;
  physiqueState?: PhysiqueState;
  soulCultivation?: SoulCultivationState;
  soulState?: SoulState;
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
  sectData?: SectState;
  garden?: LinhDienState;
  linhDien?: LinhDienState;
  companions?: CompanionsDataState;
  companionsState?: CompanionsDataState;
  spiritBeasts?: SpiritBeast[];
  beasts?: SpiritBeast[];
  activeBeastId?: string | null;
  beastEggs?: BeastEgg[];
  beastsState?: PlayerBeastsState;
  beastGarden?: import('./beast-breeding').BeastGardenState;
  storylineState?: StorylineState;
  auctionState?: AuctionSessionState | null;
  dungeonRunState?: DungeonRunState | null;
  abodeState?: AbodeState;
  activeBuffs?: any;
  dongTamKet?: boolean;
  uyenUongSongBoi?: boolean;
  huongTuiTinhNong?: boolean;
  formationArtisan?: FormationArtisan;
  equippedFormation?: FormationItem | null;
  talismanArtisan?: TalismanArtisan;
  equippedTalismans?: TalismanBeltSlot[];
  natalArtifact?: NatalArtifact | null;
  activeResonances?: import('./domain-resonance').ActiveDomainResonance[];
  resonanceLevel?: number;
  blackMarketState?: import('./black-market').BlackMarketSessionState | null;
  bustRiskMeter?: number;
  contrabandHistory?: import('./black-market').BlackMarketHistoryRecord[];
  gameDays?: number;
  dayCount?: number;
  reincarnationState?: import('./character').ReincarnationState;
  pvpLadderState?: import('./pvp-ladder').PvPLadderState;
  synergyState?: import('./combat-synergy').PlayerSynergyState;
  cosmicState?: import('./cosmic-map').CosmicState;
  offspringState?: import('./offspring').OffspringState;
  ancestralState?: import('./ancestral-blessing').AncestralState;
  customSectState?: import('./custom-sect').CustomSectState;
  consignmentState?: import('./auction-consignment').PlayerConsignmentState;
  tuViEmpowermentState?: import('./tu-vi-empowerment').TuViEmpowermentState;
  inscriptionState?: {
    totalInscribedCount: number;
    unlockedInscriptions: string[];
    cleansingWaterCount: number;
    [key: string]: any;
  };
  soulInfusionState?: import('./soul-infusion').SoulInfusionPlayerState;
  formationSetsState?: import('./weapon-tribulation-array').FormationSetsState;

  // Hệ Thống Đan Dược Cửu Giai, Đan Độc & Thiên Địa Dị Hỏa
  pillToxicity?: number;
  qiPurity?: number; // 0% - 100% (Độ tinh khiết chân nguyên, mặc định 100%)
  consumedMutations?: Partial<Record<import('./pill-veins').MutagenicAffixType, number>>;
  flameState?: import('./heavenly-flame').HeavenlyFlameState;
  alchemyTacticsState?: import('./alchemy-tactics').AlchemyTacticsState;
  pillTribulationState?: import('./pill-tribulation').PillTribulationState;
  activeDaoSeed?: import('./seclusion-enhancement').ActiveSeclusionSeedState | null;
  activeSeclusionSeed?: import('./seclusion-enhancement').ActiveSeclusionSeedState | null;
  harvestedDaoFruits?: import('./seclusion-enhancement').DaoFruitItem[];
  absorbedDaoAffixes?: import('./seclusion-enhancement').DaoFruitAffix[];
  pillUsageInRealm?: Record<number, Record<string, number>>;
  breakthroughBonusPercent?: number;
  hasDeathImmunity?: boolean;
  tribulationDamageReduction?: number;

  // Hệ Thống Vật Phẩm Tu Luyện & Bổ Trợ Cửu Giai
  cultivationBuffState?: import('./cultivation-shop').PlayerCultivationBuffState;

  // Hệ Thống Công Pháp Bí Tịch Cửu Giai
  manualsState?: import('./manuals-shop').PlayerManualsState;

  // Hệ Thống Thần Thông Bí Thuật Cửu Giai
  divineAbilitiesState?: import('./divine-abilities').PlayerDivineAbilitiesState;

  // Hệ Thống Pháp Bảo Trữ Vật Cửu Giai
  storageState?: import('./storage-shop').PlayerStorageState;

  // Cấu hình chuỗi cung ứng chế tác tự động
  craftingSupplySettings?: {
    autoBuyMissing: boolean;
  };

  // Hệ Thống Biến Cố Ngẫu Nhiên Khi Song Tu (Dual Cultivation Dynamic Events)
  demonicNature?: number;
  dualEventsHistory?: import('./dual-cultivation').DualEventHistoryRecord[];
  lastDualEventTimestamp?: number;
  protectiveAuraActive?: boolean;

  // Phân Hệ "Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà" (Meditation Subsystem)
  meditationState?: import('./meditation').ActiveMeditationState;
  meditationLocationId?: string;
  meditationStance?: import('./meditation').MeditationStanceType;
  equippedWardItemId?: string | null;
  meditationEventLogs?: import('./meditation').MeditationEventLog[];
  accompanyingCompanionId?: string | null;
  accompanyingBeastId?: string | null;
  guardianRescueCount?: number;

  // Phân Hệ "Linh Mạch Động Phủ Tự Chế (Custom Sanctuary & Vein Socketing)"
  customSanctuary?: import('./custom-sanctuary').CustomSanctuaryState;

  // Phân Hệ "Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh" (Secret Realm Map Fragments & Ancient Dungeons)
  ancientMapVault?: import('./ancient-map-dungeon').AncientMapVaultState;

  // Phân Hệ "Khai Sáng Đan Phương & Đan Đạo Tông Sư" (Custom Recipe Innovation)
  customRecipeState?: import('./custom-recipe').CustomRecipeState;

  // Phân Hệ "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch" (Breakthrough Catalysts & Protective Talismans)
  breakthroughCatalystState?: import('./breakthrough-catalyst').BreakthroughCatalystPlayerState;

  // Phân Hệ "Tác Động Của Đan Độc & Tâm Ma Phản Phệ" (Inner Demon & Pill Toxicity Backlash System)
  injuryState?: import('./breakthrough-backlash').PlayerInjuryState;

  // Phân Hệ "Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa" (Dao Foundation Grades & Major Realm Transcendence)
  daoFoundations?: Record<string, DaoFoundationGrade>;
  unlockedInnateTalents?: string[];

  // Dynamic Index Signature for extensible sub-states
  [key: string]: any;
}

export type PlayerState = PlayerStats;

