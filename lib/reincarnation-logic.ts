// lib/reincarnation-logic.ts
// Pure Business Logic & Mathematical Engine cho Hệ Thống "Lục Đạo Luân Hồi • Đạo Vận Kế Thừa (Roguelite Meta-Progression)"

import {
  PlayerStats,
  ReincarnationPerk,
  ReincarnationState,
  SealedNatalArtifact,
  NatalArtifact,
  LinhCan,
  DestinyFate,
  DestinySlotState,
  CombatStats,
  ReincarnationDestinyDefinition,
  PastLifeRecord,
  LifetimeEpithet,
  CauseOfDeathType
} from '@/lib/types';
import { createNewPlayer } from '@/lib/game-logic/character';
import { createDefaultPhysique } from '@/lib/physique-data';
import { getMaxKhiHuyet, getMaxLinhLuc } from '@/lib/game-logic';
import {
  DESTINY_FATES,
  getDestinySlotMaxCount,
  calculateCombatStats,
  REINCARNATION_DESTINY_DEFINITIONS,
  getReincarnationDestinyById
} from '@/lib/destiny-data';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

// ============================================================
// 1. DANH MỤC 6 PERK THIÊN ĐẠO LUÂN HỒI VĨNH VIỄN
// ============================================================
export const REINCARNATION_PERKS_CATALOG: ReincarnationPerk[] = [
  {
    id: 'perk_truong_sinh_cot',
    name: 'Trường Sinh Tiên Cốt',
    description: 'Uẩn dưỡng sinh mệnh chi nguyên, tăng +10 năm Thọ Nguyên khởi đầu mỗi cấp khi chuyển sinh.',
    karmaCost: 100,
    level: 0,
    maxLevel: 5,
    effectType: 'base_lifespan',
    effectValue: 10
  },
  {
    id: 'perk_tien_thien_ngo_tinh',
    name: 'Tiên Thiên Ngộ Tính',
    description: 'Thức hải thanh minh, tăng +5 Ngộ Tính cơ bản mỗi cấp khi tái sinh kiếp mới.',
    karmaCost: 150,
    level: 0,
    maxLevel: 5,
    effectType: 'initial_ngo_tinh',
    effectValue: 5
  },
  {
    id: 'perk_kim_cang_thai',
    name: 'Kim Cang Bất Hoại Thai',
    description: 'Đúc cốt hoán tủy, tăng +5 Căn Cốt cơ bản mỗi cấp khi bước vào luân hồi.',
    karmaCost: 150,
    level: 0,
    maxLevel: 5,
    effectType: 'initial_can_cot',
    effectValue: 5
  },
  {
    id: 'perk_phu_quy_nhap_the',
    name: 'Phú Quý Nhập Thế',
    description: 'Sinh ra trong tiên môn thế gia, bắt đầu kiếp mới với +500 Linh Thạch khởi nghiệp mỗi cấp.',
    karmaCost: 80,
    level: 0,
    maxLevel: 10,
    effectType: 'initial_spirit_stones',
    effectValue: 500
  },
  {
    id: 'perk_thien_dia_tuy_linh',
    name: 'Thiên Địa Tùy Linh',
    description: 'Đạo thể tự động thổ nạp thiên địa, tăng vĩnh viễn +5% Tốc độ tu vi toàn cục mỗi cấp.',
    karmaCost: 200,
    level: 0,
    maxLevel: 5,
    effectType: 'tu_vi_rate',
    effectValue: 5
  },
  {
    id: 'perk_tien_duyen_dinh_menh',
    name: 'Tiên Duyên Định Mệnh',
    description: 'Túc duyên bất diệt qua ngàn kiếp luân hồi, bắt đầu với +15 Hảo Cảm với toàn bộ Đạo Lữ.',
    karmaCost: 120,
    level: 0,
    maxLevel: 3,
    effectType: 'companion_affinity',
    effectValue: 15
  }
];

// ============================================================
// 1b. KIỂM TRA MỞ KHÓA MỆNH CÁCH LUÂN HỒI THEO CẢNH GIỚI (REALM-GATED)
// ============================================================
export function isReincarnationDestinyUnlocked(
  destiny: ReincarnationDestinyDefinition,
  player: PlayerStats
): { isUnlocked: boolean; lockReason?: string } {
  const highestRealm = Math.max(
    player.currentRealm || 0,
    player.reincarnationState?.highestRealmIndexAchieved || 0
  );

  if (highestRealm < destiny.requiredRealmIndex) {
    return {
      isUnlocked: false,
      lockReason: `Yêu cầu kiếp trước đạt ${destiny.requiredRealmName} (Cảnh giới ${destiny.requiredRealmIndex}+)`
    };
  }

  return { isUnlocked: true };
}

// ============================================================
// 1c. THUẬT TOÁN ĐÚC KẾT DANH HIỆU KIẾP TU (PROCEDURAL LIFETIME EPITHET)
// ============================================================
export function generateLifetimeEpithet(
  player: PlayerStats,
  cause: CauseOfDeathType
): LifetimeEpithet {
  const highestRealm = Math.max(
    player.currentRealm || 0,
    player.reincarnationState?.highestRealmIndexAchieved || 0
  );
  const age = Math.floor(player.age || 16);
  const linhThach = player.linhThach || 0;
  const companionCount = (player.companions?.bonded?.length || 0) +
    Object.values(player.companionsState?.companions || {}).filter((c: any) => c.isBonded).length;
  const bestPvPRank = player.pvpLadderState?.bestRank;

  // 1. Nhóm Thần Giai (Realm >= 46 - Độ Kiếp / Phi Thăng / Tiên Nhân)
  if (highestRealm >= 46) {
    if (highestRealm >= 60) {
      return {
        title: 'Vạn Cổ Đế Tôn',
        tagline: 'Đạp toái tinh hà, vạn giới xưng tôn, ngạo thị hoàn vũ',
        grade: 'than',
        badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/70 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse'
      };
    }
    if (cause === 'binh_giai') {
      return {
        title: 'Hỗn Độn Luân Hồi Giả',
        tagline: 'Tự chém đạo quả, mưu tính vạn thế, chuyển sinh vô địch',
        grade: 'than',
        badgeClass: 'text-purple-300 border-purple-500/80 bg-purple-950/70 font-extrabold shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse'
      };
    }
    if (cause === 'ascension_voluntary' || highestRealm >= 50) {
      return {
        title: 'Vũ Hóa Tiên Nhân',
        tagline: 'Rũ bỏ hồng trần, tiêu dao tam giới, ngọc cốt kim thân',
        grade: 'than',
        badgeClass: 'text-sky-300 border-sky-500/80 bg-sky-950/70 font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-pulse'
      };
    }
    if (cause === 'tribulation_failure') {
      return {
        title: 'Thiên Kiêu Vẫn Lạc',
        tagline: 'Cực cảnh tranh phong, một niệm hóa tro, đạo vận trường tồn',
        grade: 'than',
        badgeClass: 'text-rose-300 border-rose-500/80 bg-rose-950/70 font-extrabold shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
      };
    }
    return {
      title: 'Độ Kiếp Thần Tôn',
      tagline: 'Thần uy hiển hách, ngút trời khí phách, uy chấn bát hoang',
      grade: 'than',
      badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/70 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse'
    };
  }

  // 2. Nhóm Thiên Giai (Realm 26–45 - Hóa Thần / Luyện Hư / Hợp Thể)
  if (highestRealm >= 26) {
    if (bestPvPRank && bestPvPRank <= 10) {
      return {
        title: 'Đương Thế Kiếm Tôn',
        tagline: 'Một kiếm trấn áp vạn tiên môn, hoành tảo bát hoang vô địch thủ',
        grade: 'thien',
        badgeClass: 'text-rose-300 border-rose-500/80 bg-rose-950/60 font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)]'
      };
    }
    if (linhThach >= 1_000_000) {
      return {
        title: 'Vạn Bảo Hào Phú',
        tagline: 'Linh thạch thông thiên, phú khả địch quốc, châu báu ngập cửu châu',
        grade: 'thien',
        badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/60 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
      };
    }
    if (companionCount >= 3) {
      return {
        title: 'Phong Lưu Đạo Quân',
        tagline: 'Hồng nhan tri kỷ, tiếu ngạo nhân gian, tình duyên vạn kiếp bất diệt',
        grade: 'thien',
        badgeClass: 'text-fuchsia-300 border-fuchsia-500/80 bg-fuchsia-950/60 font-bold shadow-[0_0_12px_rgba(217,70,239,0.4)]'
      };
    }
    if (cause === 'tribulation_failure') {
      return {
        title: 'Cực Cảnh Trảm Lôi',
        tagline: 'Nghịch thiên bất thành, hồn phách nhập luân hồi, kiếp sau tái chiến',
        grade: 'thien',
        badgeClass: 'text-purple-300 border-purple-500/80 bg-purple-950/60 font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
      };
    }
    return {
      title: 'Thông Thiên Đại Năng',
      tagline: 'Pháp tướng thông thiên, vạn người kính ngưỡng, chấp chưởng phong vân',
      grade: 'thien',
      badgeClass: 'text-cyan-300 border-cyan-500/80 bg-cyan-950/60 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
    };
  }

  // 3. Nhóm Địa Giai (Realm 16–25 - Kim Đan / Nguyên Anh)
  if (highestRealm >= 16) {
    if (cause === 'tribulation_failure') {
      return {
        title: 'Nghịch Lôi Vẫn Lạc',
        tagline: 'Thân hóa tro tàn, đạo tâm bất diệt, lôi đình tẩy lễ kiếp sau',
        grade: 'dia',
        badgeClass: 'text-purple-300 border-purple-500/70 bg-purple-950/60 font-semibold'
      };
    }
    if (cause === 'binh_giai') {
      return {
        title: 'Giải Thoát Chân Nhân',
        tagline: 'Xuất khiếu du ngoạn, tái tục tiên duyên, tâm như chỉ thủy',
        grade: 'dia',
        badgeClass: 'text-sky-300 border-sky-500/70 bg-sky-950/60 font-semibold'
      };
    }
    if (cause === 'combat_defeat') {
      return {
        title: 'Thiên Nhai Kiếm Si',
        tagline: 'Chiến tử sa trường, kiếm gãy hồn vương, ngạo cốt đọng nhân gian',
        grade: 'dia',
        badgeClass: 'text-rose-300 border-rose-500/70 bg-rose-950/60 font-semibold'
      };
    }
    if (cause === 'lifespan_exhausted') {
      return {
        title: 'Bách Niên Đạo Tu',
        tagline: 'Nhất sinh cần khổ, tiếc duyên thiên địa, an nhiên tọa hóa',
        grade: 'dia',
        badgeClass: 'text-amber-300 border-amber-500/70 bg-amber-950/60 font-semibold'
      };
    }
    return {
      title: 'Vấn Đạo Chân Nhân',
      tagline: 'Tuế nguyệt trôi mau, đạo tâm bất hủ, tích lũy căn cơ trùng tu',
      grade: 'dia',
      badgeClass: 'text-purple-300 border-purple-500/70 bg-purple-950/60 font-semibold'
    };
  }

  // 4. Nhóm Huyền / Hoàng Giai (Realm <= 15 - Phàm Nhân / Luyện Khí / Trúc Cơ)
  if (age >= 120 && highestRealm <= 10) {
    return {
      title: 'Bách Tuế Thọ Tinh',
      tagline: 'Trường thọ phàm trần, duyên mỏng duyên thưa, thiện đức tích lũy',
      grade: 'huyen',
      badgeClass: 'text-emerald-300 border-emerald-600/60 bg-emerald-950/50 font-medium'
    };
  }
  if (highestRealm >= 11) {
    return {
      title: 'Trúc Cơ Tu Sĩ',
      tagline: 'Vừa nhập tiên môn, đạo lộ dở dang, kiếp sau định đắp cơ nghiệp',
      grade: 'huyen',
      badgeClass: 'text-blue-300 border-blue-600/60 bg-blue-950/50 font-medium'
    };
  }
  if (cause === 'tribulation_failure') {
    return {
      title: 'Lôi Đình Tán Khí',
      tagline: 'Trúc Cơ bất thành, đan điền vỡ nát, quy hồi cát bụi',
      grade: 'hoang',
      badgeClass: 'text-stone-300 border-stone-700 bg-stone-900/60'
    };
  }
  return {
    title: 'Sơn Thôn Ẩn Tu',
    tagline: 'Sơ ngộ đạo duyên, mệnh dừng sơ cảnh, tịch mịch phong trần',
    grade: 'hoang',
    badgeClass: 'text-zinc-400 border-zinc-700 bg-zinc-900/60'
  };
}

export function createPastLifeRecord(
  player: PlayerStats,
  cause: CauseOfDeathType,
  karmaEarned: number,
  lifeIndex: number
): PastLifeRecord {
  const highestRealm = Math.max(
    player.currentRealm || 0,
    player.reincarnationState?.highestRealmIndexAchieved || 0
  );
  const highestRealmName = realmsData[highestRealm]?.name || 'Phàm Nhân';
  const ageAtDeath = Math.floor(player.age || 16);
  const epithet = generateLifetimeEpithet(player, cause);

  let causeOfDeathText = 'Thọ Nguyên Cạn Kiệt • Tọa Hóa Tự Nhiên';
  if (cause === 'binh_giai') causeOfDeathText = 'Binh Giải Xuất Khiếu • Nghịch Chuyển Càn Khôn';
  else if (cause === 'tribulation_failure') causeOfDeathText = 'Độ Kiếp Thất Bại • Thân Hóa Tro Tàn';
  else if (cause === 'combat_defeat') causeOfDeathText = 'Đấu Pháp Trận Vong • Đạo Tiêu Thần Tán';
  else if (cause === 'ascension_voluntary') causeOfDeathText = 'Công Đức Viên Mãn • Chuyển Thế Trọng Tu';

  // Lấy thông tin môn phái
  const rawSect = (player.sectState?.sectName || player.sect || 'Tán Tu Tự Do') as string;
  const sectName = rawSect === 'tan_tu' ? 'Tán Tu Tự Do' : rawSect;
  const sectRank = (player.sectState?.rank || player.sectRank || 'Tán Tu') as string;

  // Số lượng đạo lữ đã kết duyên
  const companionCount = (player.companions?.bonded?.length || 0) +
    Object.values(player.companionsState?.companions || {}).filter((c: any) => c.isBonded).length;

  return {
    lifeIndex,
    daoName: player.name || 'Tu Sĩ Vô Danh',
    gender: player.gender || 'Nam',
    highestRealmIndex: highestRealm,
    highestRealmName,
    ageAtDeath,
    causeOfDeath: cause,
    causeOfDeathText,
    sectName,
    sectRank,
    epithet,
    karmaEarned,
    sealedArtifactName: player.natalArtifact?.name || player.reincarnationState?.sealedArtifact?.name,
    companionCount,
    bestPvPRank: player.pvpLadderState?.bestRank,
    achievementsCount: player.achievementsState?.unlockedIds?.length || 0,
    completedAtTimestamp: Date.now()
  };
}

// Chi phí và cấp bậc thăng hoa Linh Căn Tiên Thiên
export const SPIRITUAL_ROOT_UPGRADES: {
  fromGrade: string;
  toGrade: string;
  karmaCost: number;
  bonusDmg: number;
  bonusSpeed: number;
}[] = [
  { fromGrade: 'Tạp Linh Căn', toGrade: 'Chân Linh Căn', karmaCost: 250, bonusDmg: 10, bonusSpeed: 5 },
  { fromGrade: 'Chân Linh Căn', toGrade: 'Địa Linh Căn', karmaCost: 600, bonusDmg: 20, bonusSpeed: 10 },
  { fromGrade: 'Địa Linh Căn', toGrade: 'Thiên Linh Căn', karmaCost: 1200, bonusDmg: 35, bonusSpeed: 20 },
  { fromGrade: 'Thiên Linh Căn', toGrade: 'Biến Dị Linh Căn', karmaCost: 2500, bonusDmg: 50, bonusSpeed: 30 },
  { fromGrade: 'Biến Dị Linh Căn', toGrade: 'Hỗn Độn Linh Căn', karmaCost: 5000, bonusDmg: 80, bonusSpeed: 50 }
];

// ============================================================
// 2. TÍNH TOÁN ĐIỂM LUÂN HỒI (KARMA REWARD CALCULATION)
// ============================================================
export interface KarmaRewardBreakdown {
  realmKarma: number;
  ageKarma: number;
  achievementKarma: number;
  tribulationKarma: number;
  binhGiaiBonusKarma: number;
  totalKarma: number;
}

/**
 * Công thức tính Karma:
 * Karma = (RealmIndex * 150) + Math.floor(Age / 10) + (AchievementsCount * 50) + TribulationBonus
 * Nếu Binh Giải (Realm >= 16): Thưởng thêm 20% "Tự Tại Giải Thoát"
 */
export function calculateKarmaReward(player: PlayerStats, isBinhGiai: boolean = false): KarmaRewardBreakdown {
  const realmIndex = player.currentRealm || 0;
  const age = player.age || 16;
  const achievementsCount = player.achievementsState?.unlockedIds?.length || 0;
  
  const realmKarma = realmIndex * 150;
  const ageKarma = Math.floor(age / 10);
  const achievementKarma = achievementsCount * 50;
  
  // Điểm thưởng độ kiếp
  const tribulationKarma = realmIndex >= 26 ? 800 : realmIndex >= 21 ? 400 : realmIndex >= 16 ? 200 : 0;
  
  const baseKarma = realmKarma + ageKarma + achievementKarma + tribulationKarma;
  const binhGiaiBonusKarma = isBinhGiai ? Math.floor(baseKarma * 0.2) : 0;
  const totalKarma = Math.max(50, baseKarma + binhGiaiBonusKarma);

  return {
    realmKarma,
    ageKarma,
    achievementKarma,
    tribulationKarma,
    binhGiaiBonusKarma,
    totalKarma
  };
}

/**
 * Kiểm tra điều kiện có thể chủ động Binh Giải Luân Hồi
 * Yêu cầu: Kim Đan Sơ Kỳ (Realm Index >= 16) trở lên mới đủ thần niệm xuất khiếu
 */
export function canBinhGiai(realmIndex: number): boolean {
  return realmIndex >= 16;
}

// ============================================================
// 3. HỆ THỐNG PHONG ẤN & GIẢI PHONG BẢN MỆNH PHÁP BẢO
// ============================================================

/**
 * Phong ấn Bản Mệnh Pháp Bảo mang theo khi luân hồi
 */
export function sealNatalArtifact(natal: NatalArtifact): SealedNatalArtifact {
  return {
    originalEquipmentId: natal.baseEquipmentId || natal.id,
    name: natal.name,
    originalGrade: natal.grade || 'Cực Phẩm',
    originalTier: natal.tier || 1,
    spiritPersonality: natal.spirit?.personality || 'thu_ho',
    spiritStage: natal.spirit?.stageLevel || 1,
    sealedBonusPercent: 30, // 30% sức mạnh khi đang bị phong ấn ở Luyện Khí Kỳ
    isUnsealed: false,
    originalNatalData: JSON.parse(JSON.stringify(natal))
  };
}

/**
 * Tự động kiểm tra và giải phong Bản Mệnh Pháp Bảo khi đạt Trúc Cơ Kỳ (Realm >= 11)
 */
export function checkAndUnsealNatalArtifact(
  player: PlayerStats
): { unsealed: boolean; updatedPlayer: PlayerStats; message?: string } {
  const currentRealm = player.currentRealm || 0;
  const sealed = player.reincarnationState?.sealedArtifact;

  // Chỉ giải phong khi đạt Trúc Cơ Kỳ (Realm >= 11) và có bảo vật chưa giải phong
  if (currentRealm < 11 || !sealed || sealed.isUnsealed) {
    return { unsealed: false, updatedPlayer: player };
  }

  // Khôi phục bản mệnh
  let restoredNatal: NatalArtifact;
  if (sealed.originalNatalData) {
    restoredNatal = {
      ...sealed.originalNatalData,
      boundRealmId: currentRealm,
      boundAtTimestamp: Date.now()
    };
  } else {
    // Tạo bản mệnh dự phòng nếu không có backup
    restoredNatal = {
      id: `natal_restored_${Date.now()}`,
      baseEquipmentId: sealed.originalEquipmentId,
      name: sealed.name,
      slot: 'weapon',
      tier: sealed.originalTier,
      grade: sealed.originalGrade,
      quality: 'cuc_pham',
      resonanceRate: 35,
      boundRealmId: currentRealm,
      realmAdvancementBonus: 0,
      spirit: null,
      statsBonus: {
        atk: sealed.originalTier * 150,
        def: sealed.originalTier * 80,
        hp: sealed.originalTier * 500,
        critRate: 10
      },
      boundAtTimestamp: Date.now()
    };
  }

  const updatedSealed: SealedNatalArtifact = {
    ...sealed,
    isUnsealed: true
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    natalArtifact: restoredNatal,
    reincarnationState: {
      ...player.reincarnationState!,
      sealedArtifact: updatedSealed
    }
  };

  return {
    unsealed: true,
    updatedPlayer,
    message: `⚡ PHÁ PHONG THỨC TỈNH! Đạt đến Trúc Cơ Kỳ, phong ấn trên 【${sealed.name}】 vỡ tan! Toàn bộ linh trí Khí Linh và uy lực Bản Mệnh tiền kiếp đã thức tỉnh trọn vẹn!`
  };
}

/**
 * Tính chỉ số gia trì từ Bản Mệnh Phong Ấn khi chưa đạt Trúc Cơ (30% chỉ số)
 */
export function getSealedArtifactCombatBonus(sealed: SealedNatalArtifact | null): {
  atk: number;
  def: number;
  hp: number;
  dmgReduction: number;
} {
  if (!sealed || sealed.isUnsealed) {
    return { atk: 0, def: 0, hp: 0, dmgReduction: 0 };
  }

  const tier = sealed.originalTier || 1;
  const ratio = (sealed.sealedBonusPercent || 30) / 100;

  return {
    atk: Math.floor(tier * 60 * ratio),
    def: Math.floor(tier * 30 * ratio),
    hp: Math.floor(tier * 250 * ratio),
    dmgReduction: Math.floor(tier * 2 * ratio)
  };
}

// ============================================================
// 4. THĂNG HOA LINH CĂN BẰNG KARMA
// ============================================================

export function getNextSpiritualRootUpgrade(currentGrade: string) {
  return SPIRITUAL_ROOT_UPGRADES.find(u => u.fromGrade === currentGrade);
}

export function upgradeSpiritualRoot(root: LinhCan): LinhCan {
  const upgradeCfg = getNextSpiritualRootUpgrade(root.grade);
  if (!upgradeCfg) return root;

  return {
    ...root,
    grade: upgradeCfg.toGrade,
    name: `${root.name.replace(/Tạp|Chân|Địa|Thiên|Biến Dị|Hỗn Độn/, '').trim() || root.name} (${upgradeCfg.toGrade})`,
    damageBonus: (root.damageBonus || 0) + upgradeCfg.bonusDmg,
    speedBonus: (root.speedBonus || 0) + upgradeCfg.bonusSpeed,
    purity: Math.min(100, (root.purity || 60) + 15),
    tier: (root.tier || 1) + 1
  };
}

// ============================================================
// 5. THỰC THI CHUYỂN SINH (EXECUTE REINCARNATION)
// ============================================================

export interface ReincarnationExecutionOptions {
  isBinhGiai?: boolean;
  causeOfDeath?: CauseOfDeathType;
  keepSealedNatal?: boolean;
  upgradedLinhCan?: LinhCan | null;
  chosenInheritedDestinyId?: string | null;
  upgradedPerks?: Record<string, number>;
  karmaSpent?: number;
}

export function executeReincarnation(
  player: PlayerStats,
  options: ReincarnationExecutionOptions = {}
): { newPlayer: PlayerStats; karmaReward: KarmaRewardBreakdown; logTitle: string; logContent: string; pastLifeRecord: PastLifeRecord } {
  const {
    isBinhGiai = false,
    causeOfDeath,
    keepSealedNatal = true,
    upgradedLinhCan = null,
    chosenInheritedDestinyId = null,
    upgradedPerks = {},
    karmaSpent = 0
  } = options;

  const resolvedCause: CauseOfDeathType = causeOfDeath || (isBinhGiai ? 'binh_giai' : 'lifespan_exhausted');

  // 1. Tính toán Karma nhận được từ kiếp này
  const karmaReward = calculateKarmaReward(player, isBinhGiai);
  const prevReborn = player.reincarnationState || {
    totalRebornTimes: 0,
    currentKarmaPoints: 0,
    lifetimeKarmaPoints: 0,
    highestRealmIndexAchieved: player.currentRealm || 0,
    sealedArtifact: null,
    permanentPerks: {},
    pastLives: []
  };

  // Ghi nhận bia mộ tiền kiếp của kiếp vừa hoàn tất
  const currentLifeIndex = prevReborn.totalRebornTimes + 1;
  const newPastLife = createPastLifeRecord(player, resolvedCause, karmaReward.totalKarma, currentLifeIndex);
  const updatedPastLives = [newPastLife, ...(prevReborn.pastLives || [])].slice(0, 50);

  const newTotalRebornTimes = prevReborn.totalRebornTimes + 1;
  const newLifetimeKarma = prevReborn.lifetimeKarmaPoints + karmaReward.totalKarma;
  const netKarma = prevReborn.currentKarmaPoints + karmaReward.totalKarma - karmaSpent;
  const newCurrentKarma = Math.max(0, netKarma);
  const highestRealm = Math.max(prevReborn.highestRealmIndexAchieved || 0, player.currentRealm || 0);

  // 2. Kế thừa / Hợp nhất Perks
  const mergedPerks = { ...prevReborn.permanentPerks, ...upgradedPerks };

  // 3. Xử lý Bản Mệnh Pháp Bảo phong ấn
  let newSealedArtifact: SealedNatalArtifact | null = null;
  if (keepSealedNatal && player.natalArtifact) {
    newSealedArtifact = sealNatalArtifact(player.natalArtifact);
  } else if (prevReborn.sealedArtifact && !prevReborn.sealedArtifact.isUnsealed) {
    // Nếu kiếp trước chưa kịp giải phong thì bảo lưu
    newSealedArtifact = prevReborn.sealedArtifact;
  }

  // 4. Tạo nhân vật cơ sở mới (Reset về Phàm Nhân Tầng 0, Tuổi 16)
  const base = createNewPlayer();

  // Thể chất kiếp mới
  const freshPhysiques = player.physiques && player.physiques.length > 0
    ? player.physiques
    : [createDefaultPhysique()];
  const primaryPhysique = freshPhysiques[0];

  // Mệnh cách kiếp mới: Nếu chọn Mệnh Cách Luân Hồi độc quyền
  let freshDestiny: DestinyFate = player.destiny || base.destiny || DESTINY_FATES.pham_nhan_menh_cach;
  if (chosenInheritedDestinyId && DESTINY_FATES[chosenInheritedDestinyId]) {
    freshDestiny = DESTINY_FATES[chosenInheritedDestinyId];
  }

  // Áp dụng Perks vĩnh viễn & Buff khởi đầu từ Mệnh Cách Luân Hồi
  const lifespanPerkLvl = mergedPerks['perk_truong_sinh_cot'] || 0;
  const ngoTinhPerkLvl = mergedPerks['perk_tien_thien_ngo_tinh'] || 0;
  const canCotPerkLvl = mergedPerks['perk_kim_cang_thai'] || 0;
  const spiritStonesPerkLvl = mergedPerks['perk_phu_quy_nhap_the'] || 0;
  const companionAffinityPerkLvl = mergedPerks['perk_tien_duyen_dinh_menh'] || 0;

  const destinyEff = freshDestiny.effects || {};
  const initialCanCot = base.canCot + (canCotPerkLvl * 5) + (destinyEff.canCotBonus || 0);
  const initialNgoTinh = base.ngoTinh + (ngoTinhPerkLvl * 5) + (destinyEff.ngoTinhBonus || 0);
  const initialLifespan = 100 + (lifespanPerkLvl * 10) + (destinyEff.initialLifespan || 0);
  const initialSpiritStones = 100 + (spiritStonesPerkLvl * 500) + (destinyEff.initialLinhThach || 0);
  const initialKhiVan = base.khiVan + (destinyEff.khiVanBonus || 0);

  // Linh Căn kiếp mới: Ưu tiên Linh Căn đã thăng hoa, nếu không kế thừa hoặc dùng gốc
  const freshRoot: LinhCan = upgradedLinhCan || player.linhCan || base.linhCan || {
    name: 'Ngũ Hành Tạp Linh Căn',
    element: 'ngu_hanh',
    grade: 'Tạp Linh Căn',
    description: 'Năm dòng linh khí hỗn tạp, tu luyện chậm chạp.',
    damageBonus: 0,
    speedBonus: 0
  };

  const maxHP = getMaxKhiHuyet(initialCanCot, 0, undefined, undefined, freshPhysiques, undefined, freshRoot, freshDestiny);
  const maxMP = getMaxLinhLuc(base.tamCanh, initialNgoTinh, 0, undefined, undefined, undefined, freshRoot);

  // Mở khóa Mệnh Bàn: Số slot = 3 + (newTotalRebornTimes >= 1 ? 1 : 0)
  const unlockedSlots = getDestinySlotMaxCount(0, newTotalRebornTimes);
  const equippedFateIds = [freshDestiny.id];
  const collectedFateIds = Array.from(new Set([
    freshDestiny.id,
    ...(player.destinyBoard?.collectedIds || [])
  ]));

  const newDestinyBoard: DestinySlotState = {
    unlockedSlots,
    equippedIds: equippedFateIds,
    collectedIds: collectedFateIds
  };

  // Đồng bộ hảo cảm Đạo Lữ nếu có perk
  let updatedCompanions = player.companions;
  if (updatedCompanions && companionAffinityPerkLvl > 0) {
    const affinityBonus = companionAffinityPerkLvl * 15;
    const newBonded = (updatedCompanions.bonded || []).map((c: any) => ({
      ...c,
      favor: (c.favor || 0) + affinityBonus
    }));
    updatedCompanions = {
      ...updatedCompanions,
      bonded: newBonded
    };
  }

  const newReincarnationState: ReincarnationState = {
    totalRebornTimes: newTotalRebornTimes,
    currentKarmaPoints: newCurrentKarma,
    lifetimeKarmaPoints: newLifetimeKarma,
    highestRealmIndexAchieved: highestRealm,
    sealedArtifact: newSealedArtifact,
    inheritedDestinyId: chosenInheritedDestinyId,
    permanentPerks: mergedPerks,
    lastReincarnationAt: Date.now(),
    pastLives: updatedPastLives
  };

  const freshPlayer: PlayerStats = {
    ...base,
    name: player.name || 'Tu Sĩ Trùng Sinh',
    age: 16,
    maxLifespan: initialLifespan,
    canCot: initialCanCot,
    ngoTinh: initialNgoTinh,
    khiVan: initialKhiVan,
    khiHuyet: maxHP,
    maxKhiHuyet: maxHP,
    linhLuc: maxMP,
    maxLinhLuc: maxMP,
    linhCan: freshRoot,
    physique: primaryPhysique,
    physiques: freshPhysiques,
    destiny: freshDestiny,
    destinyBoard: newDestinyBoard,
    destinies: [freshDestiny],
    activeSynergies: [],
    inventory: {
      pills: [],
      herbs: [],
      ores: [],
      manuals: [],
      equipments: [],
      books: [],
      bags: []
    },
    manuals: [],
    equipment: {},
    tuVi: 0,
    linhThach: initialSpiritStones,
    danhVong: 0,
    currentRealm: 0,
    natalArtifact: null, // Đã phong ấn vào sealedArtifact, sẽ phá phong khi đạt Trúc Cơ Kỳ
    reincarnationState: newReincarnationState,
    companions: updatedCompanions
  };

  const cStats = calculateCombatStats(freshPlayer);
  freshPlayer.congKich = cStats.atk;
  freshPlayer.phongNgu = cStats.def;
  freshPlayer.thanThuc = cStats.soul;
  freshPlayer.tocDo = cStats.speed;
  freshPlayer.baoKichRate = cStats.critRate;
  freshPlayer.baoKichDmg = cStats.critDmg;

  const logTitle = isBinhGiai
    ? '🌀 BÌNH GIẢI LUÂN HỒI • NIẾT BÀN TRÙNG SINH'
    : '⏳ TỌA HÓA NIẾT BÀN • TÁI SINH KIẾP MỚI';

  const logContent = `Ngươi đã hoàn tất một kiếp tu hành chấn động tam giới! Đúc kết danh hiệu: [${newPastLife.epithet.title}] ("${newPastLife.epithet.tagline}"). ` +
    `Quy đổi kết toán nhận được +${karmaReward.totalKarma.toLocaleString()} Điểm Luân Hồi (Karma). ` +
    `Tái sinh kiếp thứ ${newTotalRebornTimes} với Linh Căn [${freshRoot.name}], Mệnh Cách [${freshDestiny.name}] và khắc ghi bia mộ tại Lục Đạo Tiên Bi!` +
    (newSealedArtifact ? ` 【${newSealedArtifact.name}】 đã được phong ấn mang theo, chờ ngày Trúc Cơ phá phong!` : '');

  return {
    newPlayer: freshPlayer,
    karmaReward,
    logTitle,
    logContent,
    pastLifeRecord: newPastLife
  };
}

/**
 * 6. KẾ THỪA THÂN XÁC CHÂN TRUYỀN KHI LUÂN HỒI (DISCIPLE INHERITANCE / POSSESSION)
 */
export function executeInheritDiscipleReincarnation(
  player: PlayerStats,
  disciple: import('@/lib/types').ProceduralDisciple,
  options: ReincarnationExecutionOptions = {}
): {
  newPlayer: PlayerStats;
  karmaReward: KarmaRewardBreakdown;
  logTitle: string;
  logContent: string;
  pastLifeRecord: PastLifeRecord;
} {
  const { isBinhGiai = false, causeOfDeath, keepSealedNatal = true } = options;
  const resolvedCause: CauseOfDeathType = causeOfDeath || (isBinhGiai ? 'binh_giai' : 'lifespan_exhausted');

  // 1. Tính toán Karma và Bia mộ tiền kiếp cho nhân vật vừa tọa hóa
  const karmaReward = calculateKarmaReward(player, isBinhGiai);
  const prevReborn = player.reincarnationState || {
    totalRebornTimes: 0,
    currentKarmaPoints: 0,
    lifetimeKarmaPoints: 0,
    highestRealmIndexAchieved: player.currentRealm || 0,
    sealedArtifact: null,
    permanentPerks: {},
    pastLives: []
  };

  const currentLifeIndex = prevReborn.totalRebornTimes + 1;
  const newPastLife = createPastLifeRecord(player, resolvedCause, karmaReward.totalKarma, currentLifeIndex);
  const updatedPastLives = [newPastLife, ...(prevReborn.pastLives || [])].slice(0, 50);

  const newTotalRebornTimes = prevReborn.totalRebornTimes + 1;
  const newLifetimeKarma = prevReborn.lifetimeKarmaPoints + karmaReward.totalKarma;
  const newCurrentKarma = prevReborn.currentKarmaPoints + karmaReward.totalKarma;
  const highestRealm = Math.max(prevReborn.highestRealmIndexAchieved || 0, player.currentRealm || 0, disciple.realmIndex);

  // 2. Bảo tồn Pháp Bảo phong ấn nếu có
  let newSealedArtifact: SealedNatalArtifact | null = null;
  if (keepSealedNatal && player.natalArtifact) {
    newSealedArtifact = sealNatalArtifact(player.natalArtifact);
  } else if (prevReborn.sealedArtifact && !prevReborn.sealedArtifact.isUnsealed) {
    newSealedArtifact = prevReborn.sealedArtifact;
  }

  // 3. Khởi tạo cơ sở nhân vật mới
  const base = createNewPlayer();

  // Thừa hưởng Linh Căn từ đệ tử
  const freshRoot: LinhCan = {
    name: disciple.linhCan.name,
    element: (disciple.linhCan.element as any) || 'ngu_hanh',
    grade: disciple.linhCan.grade === 'than' ? 'Thần Phẩm' : disciple.linhCan.grade === 'cuc' ? 'Cực Phẩm' : disciple.linhCan.grade === 'thuong' ? 'Thượng Phẩm' : 'Trung Phẩm',
    description: `Linh căn truyền thừa từ Chân Truyền Đệ Tử 【${disciple.name}】`,
    damageBonus: disciple.linhCan.grade === 'than' ? 30 : disciple.linhCan.grade === 'cuc' ? 20 : 10,
    speedBonus: disciple.linhCan.grade === 'than' ? 25 : disciple.linhCan.grade === 'cuc' ? 15 : 5,
    purity: 90,
    tier: disciple.linhCan.grade === 'than' ? 5 : disciple.linhCan.grade === 'cuc' ? 4 : 3
  };

  const initialCanCot = Math.max(base.canCot, disciple.stats.canCot);
  const initialNgoTinh = Math.max(base.ngoTinh, disciple.stats.ngoTinh);
  const initialKhiVan = Math.max(base.khiVan, disciple.stats.khiVan);
  const initialLifespan = 120 + (disciple.realmIndex * 15);

  const freshPhysiques = player.physiques && player.physiques.length > 0
    ? player.physiques
    : [createDefaultPhysique()];
  const primaryPhysique = freshPhysiques[0];

  const freshDestiny: DestinyFate = player.destiny || base.destiny || DESTINY_FATES.pham_nhan_menh_cach;
  const maxHP = getMaxKhiHuyet(initialCanCot, disciple.realmIndex, undefined, undefined, freshPhysiques, undefined, freshRoot, freshDestiny);
  const maxMP = getMaxLinhLuc(base.tamCanh, initialNgoTinh, disciple.realmIndex, undefined, undefined, undefined, freshRoot);

  const unlockedSlots = getDestinySlotMaxCount(disciple.realmIndex, newTotalRebornTimes);
  const newDestinyBoard: DestinySlotState = {
    unlockedSlots,
    equippedIds: [freshDestiny.id],
    collectedIds: Array.from(new Set([freshDestiny.id, ...(player.destinyBoard?.collectedIds || [])]))
  };

  const newReincarnationState: ReincarnationState = {
    totalRebornTimes: newTotalRebornTimes,
    currentKarmaPoints: newCurrentKarma,
    lifetimeKarmaPoints: newLifetimeKarma,
    highestRealmIndexAchieved: highestRealm,
    sealedArtifact: newSealedArtifact,
    inheritedDestinyId: null,
    permanentPerks: prevReborn.permanentPerks || {},
    lastReincarnationAt: Date.now(),
    pastLives: updatedPastLives
  };

  // Cập nhật Tông Môn tự lập: Giữ nguyên cơ nghiệp, tháo đệ tử đã bị đoạt xá/kế thừa khỏi danh sách môn hạ
  let updatedCustomSect = player.customSectState;
  if (updatedCustomSect && updatedCustomSect.isFounded) {
    updatedCustomSect = {
      ...updatedCustomSect,
      disciples: updatedCustomSect.disciples.filter(d => d.id !== disciple.id),
      chosenInheritorId: null,
      reputation: (updatedCustomSect.reputation || 0) + 30
    };
  }

  const freshPlayer: PlayerStats = {
    ...base,
    name: player.name ? `${player.name} (Đời ${newTotalRebornTimes})` : disciple.name,
    gender: disciple.gender,
    age: 18,
    maxLifespan: initialLifespan,
    canCot: initialCanCot,
    ngoTinh: initialNgoTinh,
    khiVan: initialKhiVan,
    khiHuyet: maxHP,
    maxKhiHuyet: maxHP,
    linhLuc: maxMP,
    maxLinhLuc: maxMP,
    linhCan: freshRoot,
    physique: primaryPhysique,
    physiques: freshPhysiques,
    destiny: freshDestiny,
    destinyBoard: newDestinyBoard,
    destinies: [freshDestiny],
    activeSynergies: [],
    inventory: player.inventory || {
      pills: [],
      herbs: [],
      ores: [],
      manuals: [],
      equipments: [],
      books: [],
      bags: []
    },
    manuals: player.manuals || [],
    equipment: {},
    tuVi: 0,
    linhThach: player.linhThach || 5000,
    danhVong: player.danhVong || 0,
    currentRealm: disciple.realmIndex, // Bắt đầu ngay từ cảnh giới của đệ tử!
    natalArtifact: null,
    reincarnationState: newReincarnationState,
    companions: player.companions,
    customSectState: updatedCustomSect
  };

  const cStats = calculateCombatStats(freshPlayer);
  freshPlayer.congKich = cStats.atk;
  freshPlayer.phongNgu = cStats.def;
  freshPlayer.thanThuc = cStats.soul;
  freshPlayer.tocDo = cStats.speed;
  freshPlayer.baoKichRate = cStats.critRate;
  freshPlayer.baoKichDmg = cStats.critDmg;

  const logTitle = '👑 Y BÁT TRUYỀN THỪA • KẾ THỪA THÂN XÁC CHÂN TRUYỀN';
  const logContent = `Đạo hữu đã hoàn tất một kiếp tu hành! Thần niệm giáng lâm, đoạt xá kế thừa thân xác Chân Truyền Đệ Tử 【${disciple.name}】! ` +
    `Bắt đầu kiếp thứ ${newTotalRebornTimes} ngay từ [${disciple.realmName}] (Realm ${disciple.realmIndex}) với ${freshRoot.name}, ` +
    `tiếp tục giữ vững ngai vị Chưởng Môn 【${updatedCustomSect?.sectName || 'Bổn Phái'}】, vạn cổ trường tồn!`;

  return {
    newPlayer: freshPlayer,
    karmaReward,
    logTitle,
    logContent,
    pastLifeRecord: newPastLife
  };
}

