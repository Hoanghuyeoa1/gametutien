// lib/types/character.ts
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

export interface DestinySlotState {
  unlockedSlots: number;     // 3 đến 5 (3 mặc định, 4 ở Trúc Cơ, 5 ở Kim Đan)
  equippedIds: string[];     // Mảng ID các mệnh cách đang khảm vào Mệnh Bàn
  collectedIds: string[];    // Mảng ID tất cả mệnh cách người chơi đã sở hữu/thu thập
}

export interface DestinySynergyConfig {
  id: string;
  name: string;
  requiredFateIds: string[];
  description: string;
  effectsSummary: string;
  badgeClass: string;
  glowColor: string;
  effects: {
    atkBonusPercent?: number;
    defBonusPercent?: number;
    hpBonusPercent?: number;
    critRateBonus?: number;
    critDmgBonus?: number;
    lifestealPercent?: number;
    tamCanhBonus?: number;
    thaiHuChestBonus?: boolean;
    dropRateBonusPercent?: number;
    speedBonus?: number;
    dmgReductionPercent?: number;
    [key: string]: any;
  };
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
  currentStageIndex?: number;
  currentSubTier?: number;
  expeditionState?: any | null;
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

export type AchievementCategory =
  | 'cultivation'
  | 'combat'
  | 'collection'
  | 'wealth'
  | 'garden'
  | 'crafting'
  | 'battle'
  | 'companion'
  | 'sect'
  | 'reincarnation'
  | 'forbidden_zone'
  | 'auction'
  | 'cosmic'
  | 'special'
  | string;

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

// ==========================================
// HỆ THỐNG LỤC ĐẠO LUÂN HỒI & ĐẠO VẬN KẾ THỪA
// ==========================================

export interface SealedNatalArtifact {
  originalEquipmentId: string;
  name: string;
  originalGrade: string;
  originalTier: number;
  spiritPersonality: string; // Bản tính Khí Linh kiếp trước
  spiritStage: number;       // Cấp bậc linh trí kiếp trước
  sealedBonusPercent: number; // Chỉ số phong ấn (VD: 30% hiệu lực cho tới khi Trúc Cơ)
  isUnsealed: boolean;       // Mở khóa khi đạt Trúc Cơ Kỳ (Realm >= 11)
  originalNatalData?: any;   // Sao lưu trọn vẹn dữ liệu bản mệnh kiếp trước
}

export type ReincarnationPerkEffectType = 
  | 'base_lifespan' 
  | 'tu_vi_rate' 
  | 'initial_spirit_stones' 
  | 'initial_can_cot' 
  | 'companion_affinity' 
  | 'initial_ngo_tinh';

export interface ReincarnationPerk {
  id: string;
  name: string;
  description: string;
  karmaCost: number;
  level: number;
  maxLevel: number;
  effectType: ReincarnationPerkEffectType;
  effectValue: number;
}

export type CauseOfDeathType = 
  | 'lifespan_exhausted'      // Tọa hóa thọ tẫn
  | 'binh_giai'               // Chủ động binh giải
  | 'tribulation_failure'     // Thiên kiếp hóa tro
  | 'combat_defeat'           // Đấu pháp vẫn lạc
  | 'ascension_voluntary';    // Công đức viên mãn chuyển thế

export interface LifetimeEpithet {
  title: string;           // VD: "Vạn Cổ Đan Thánh"
  tagline: string;         // Câu đề từ văn bia
  grade: 'hoang' | 'huyen' | 'dia' | 'thien' | 'than';
  badgeClass: string;      // Màu sắc viền và nền
}

export interface PastLifeRecord {
  lifeIndex: number;       // Kiếp thứ mấy (1, 2, 3...)
  daoName: string;         // Đạo hiệu kiếp đó
  gender: string;          // Giới tính
  highestRealmIndex: number;
  highestRealmName: string;
  ageAtDeath: number;      // Thọ mệnh lúc quy tiên
  causeOfDeath: CauseOfDeathType;
  causeOfDeathText: string;// "Thọ Nguyên Cạn Kiệt • Tọa Hóa Tự Nhiên", "Độ Kiếp Thất Bại • Hồn Phi Yểm Diệt"...
  sectName: string;        // Môn phái xuất thân
  sectRank: string;        // Chức vị cao nhất (Trưởng Lão, Chưởng Môn...)
  epithet: LifetimeEpithet;// Danh hiệu đúc kết cả đời
  karmaEarned: number;     // Điểm Karma thu được từ kiếp này
  sealedArtifactName?: string; // Bản mệnh pháp bảo phong ấn mang theo
  companionCount: number;  // Số đạo lữ kết duyên
  bestPvPRank?: number;    // Thứ hạng Thiên Kiêu Bảng cao nhất
  achievementsCount: number;
  completedAtTimestamp: number; // Mốc thời gian thực tế
}

export interface ReincarnationState {
  totalRebornTimes: number;           // Số kiếp luân hồi đã trải qua
  currentKarmaPoints: number;         // Điểm Luân Hồi hiện có
  lifetimeKarmaPoints: number;        // Tổng Điểm Luân Hồi tích lũy lịch sử
  highestRealmIndexAchieved: number;  // Cảnh giới cao nhất từng đạt
  sealedArtifact: SealedNatalArtifact | null; // Pháp bảo phong ấn mang theo
  inheritedDestinyId?: string | null; // Mệnh cách chuyển sinh độc quyền
  permanentPerks: Record<string, number>; // Cấp độ các perk vĩnh viễn { [perkId]: level }
  lastReincarnationAt?: number;
  pastLives?: PastLifeRecord[];       // Lịch sử bia mộ tiền kiếp (Tối đa lưu 50 kiếp gần nhất)
}

export interface ReincarnationDestinyDefinition {
  id: string;
  name: string;
  grade: 'hoang' | 'huyen' | 'dia' | 'thien' | 'tuyet' | 'than';
  gradeName: string;
  badgeColor: string; // Tailwind color class
  badgeClass: string;
  color: string;
  requiredRealmIndex: number; // Ngưỡng realm tối thiểu để mở khóa
  requiredRealmName: string;  // Tên cảnh giới hiển thị (VD: "Kim Đan Kỳ", "Hóa Thần Kỳ")
  description: string;
  effectsSummary: string;
  effects: {
    tuViSpeedBonus?: number;
    cultivationSpeedBonusPercent?: number;
    atkBonusPercent?: number;
    defBonusPercent?: number;
    hpBonusPercent?: number;
    critRateBonus?: number;
    critDmgBonus?: number;
    dmgReduction?: number;
    dmgReductionPercent?: number;
    initialLinhThach?: number;
    initialLifespan?: number;
    extraSoulRevive?: boolean;
    freeReviveCount?: number;
    dropRateBonus?: number;
    dropRateBonusPercent?: number;
    goodFortuneRateBonus?: number;
    khiVanBonus?: number;
    canCotBonus?: number;
    ngoTinhBonus?: number;
    speedBonus?: number;
    soulBonus?: number;
    lifestealPercent?: number;
    merchantDiscountPercent?: number;
    breakthroughCostReductionPercent?: number;
    armorPenetrationPercent?: number;
    tuViReqMultiplier?: number;
    [key: string]: any;
  };
  [key: string]: any;
}


