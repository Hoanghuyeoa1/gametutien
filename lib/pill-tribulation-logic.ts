// lib/pill-tribulation-logic.ts
// Pure Business Logic: Hệ Thống Đan Lôi Kiếp & Đan Linh Hóa Hình
// (Pill Tribulation & Living Spirits Logic)
// Tuân thủ Clean Architecture, 4 Hard Invariants, không phụ thuộc React / UI

import {
  TribulationIntensity,
  TribulationLightningWave,
  PillTribulationEncounter,
  DanSpiritCompanion,
  PillTribulationState,
  LightningDefenseResult,
  FinalizeTribulationResult
} from './types/pill-tribulation';
import { PlayerStats, Pill, InventoryBag } from './types';
import { calculateCombatStats } from './destiny-data';

// ==========================================
// 1. CẤU HÌNH THIÊN KIẾP & ĐAN LINH
// ==========================================

export const TRIBULATION_INTENSITY_CONFIG: Record<TribulationIntensity, {
  name: string;
  totalWaves: number;
  formationLinhThachCost: number;
  baseDamagePerWave: number;
}> = {
  tam_trong: {
    name: 'Tam Trọng Lôi Kiếp',
    totalWaves: 3,
    formationLinhThachCost: 5000,
    baseDamagePerWave: 4000
  },
  luc_trong: {
    name: 'Lục Trọng Lôi Kiếp',
    totalWaves: 6,
    formationLinhThachCost: 10000,
    baseDamagePerWave: 7000
  },
  cuu_trong: {
    name: 'Cửu Trọng Hỗn Độn Lôi Kiếp',
    totalWaves: 9,
    formationLinhThachCost: 15000,
    baseDamagePerWave: 10000
  }
};

const WAVE_TITLES: Record<TribulationIntensity, string[]> = {
  tam_trong: [
    'Sơ Trọng Lôi Vân • Tử Điện Sơ Hiện',
    'Nhị Trọng Lôi Đình • Cuồng Phong Thiểm',
    'Tam Trọng Lạc Lôi • Cửu Thiên Đan Kiếp'
  ],
  luc_trong: [
    'Đệ Nhất Trọng • Tử Điện Khởi Vân',
    'Đệ Nhị Trọng • Xích Lôi Bạo Phá',
    'Đệ Tam Trọng • U Minh Huyền Thiểm',
    'Đệ Tứ Trọng • Tinh Sa Lôi Bạo',
    'Đệ Ngũ Trọng • Ngũ Hành Lôi Cương',
    'Đệ Lục Trọng • Lục Đạo Thiên Lôi'
  ],
  cuu_trong: [
    'Nhất Trọng • Tử Tiêu Thần Lôi',
    'Nhị Trọng • Thái Ất Lôi Đình',
    'Tam Trọng • Bát Quái Cực Quang',
    'Tứ Trọng • Huyết Sát Thiên Kiếp',
    'Ngũ Trọng • Ngũ Khí Triều Nguyên Lôi',
    'Lục Trọng • Lục Giáp Phá Giới Lôi',
    'Thất Trọng • Cửu U Ma Lôi',
    'Bát Trọng • Thái Hư Diệt Tuyệt Lôi',
    'Cửu Trọng • Thái Sơ Hỗn Độn Đan Kiếp'
  ]
};

// ==========================================
// 2. THẨM ĐỊNH ĐIỀU KIỆN DẪN ĐỘNG LÔI KIẾP
// ==========================================

export interface TriggerTribulationCheckResult {
  shouldTrigger: boolean;
  intensity: TribulationIntensity;
  reason: string;
}

export function evaluatePillTribulationTrigger(
  pillTier: number,
  veinCount: number,
  isMutated?: boolean,
  options?: {
    deterministicSeed?: number;
    forceTrigger?: boolean;
    forceIntensity?: TribulationIntensity;
  }
): TriggerTribulationCheckResult {
  if (options?.forceTrigger) {
    const intensity = options.forceIntensity || (pillTier >= 9 || veinCount === 9 ? 'cuu_trong' : pillTier >= 8 ? 'luc_trong' : 'tam_trong');
    return {
      shouldTrigger: true,
      intensity,
      reason: 'Thiên địa dị biến cưỡng chế giáng thế Đan Lôi Kiếp!'
    };
  }

  // HARD INVARIANT: Đan 9 Văn (Cửu Khổng) hoặc Đan Cửu Giai (Tier 9) -> BẮT BUỘC 100% Cửu Trọng Lôi Kiếp!
  if (veinCount === 9) {
    return {
      shouldTrigger: true,
      intensity: 'cuu_trong',
      reason: '⚡ Đan Cực Phẩm Cửu Khổng (9 Văn) nghịch thiên xuất thế, dẫn động Cửu Trọng Hỗn Độn Lôi Kiếp!'
    };
  }

  if (pillTier >= 9) {
    return {
      shouldTrigger: true,
      intensity: 'cuu_trong',
      reason: '⚡ Cửu Giai Thần Đan kinh động cửu thiên, dẫn động Cửu Trọng Hỗn Độn Lôi Kiếp!'
    };
  }

  const roll = options?.deterministicSeed !== undefined ? options.deterministicSeed : Math.random();

  // Tier 8: 65% kích hoạt Lục Trọng Lôi Kiếp
  if (pillTier === 8) {
    if (roll < 0.65) {
      return {
        shouldTrigger: true,
        intensity: 'luc_trong',
        reason: '⚡ Bát Giai Tiên Đan xuất đỉnh, dẫn động Lục Trọng Huyền Lôi Kiếp!'
      };
    }
    return { shouldTrigger: false, intensity: 'tam_trong', reason: 'Thiên đạo ôn hòa, mẻ đan xuất lò êm thấu.' };
  }

  // Tier 7: 35% kích hoạt Tam Trọng Lôi Kiếp
  if (pillTier === 7) {
    if (roll < 0.35) {
      return {
        shouldTrigger: true,
        intensity: 'tam_trong',
        reason: '⚡ Thất Giai Linh Đan xuất thế, kinh động thiên địa, dẫn động Tam Trọng Lôi Kiếp!'
      };
    }
    return { shouldTrigger: false, intensity: 'tam_trong', reason: 'Linh khí ổn định, không dẫn động thiên kiếp.' };
  }

  // Dược Tính Biến Dị hiếm (isMutated) ở các tier thấp: 40% kích hoạt Dị Lôi Kiếp
  if (isMutated) {
    if (roll < 0.40) {
      return {
        shouldTrigger: true,
        intensity: 'tam_trong',
        reason: '⚡ Dược Tính Biến Dị Nghịch Thiên phá vỡ quy luật, dẫn động Tam Trọng Dị Lôi Kiếp!'
      };
    }
  }

  // Phẩm cấp bình thường (Tier 1-6 không biến dị) -> 0%
  return {
    shouldTrigger: false,
    intensity: 'tam_trong',
    reason: 'Đan phẩm phàm tục, không đạt ngưỡng dẫn động thiên kiếp.'
  };
}

// ==========================================
// 3. KHỞI TẠO BỘ TIA SÉT & ENCOUNTER
// ==========================================

export function generateTribulationWaves(
  intensity: TribulationIntensity,
  pillTier: number
): TribulationLightningWave[] {
  const config = TRIBULATION_INTENSITY_CONFIG[intensity];
  const titles = WAVE_TITLES[intensity];
  const waves: TribulationLightningWave[] = [];

  const tierMultiplier = Math.max(1, 1 + (pillTier - 7) * 0.25);

  for (let i = 0; i < config.totalWaves; i++) {
    const waveIndex = i + 1;
    // Sát thương tăng tiến dần theo từng đợt
    const progressFactor = 1 + (i / config.totalWaves) * 1.5;
    const rawDamage = Math.round(config.baseDamagePerWave * tierMultiplier * progressFactor);
    const piercePercent = Math.min(40, i * 4);

    waves.push({
      waveIndex,
      strikeName: titles[i] || `Đợt ${waveIndex} • Thiên Lôi Giáng Trần`,
      rawLightningDamage: rawDamage,
      piercePercent,
      description: `Đợt sấm sét thứ ${waveIndex}/${config.totalWaves} cuồn cuộn giáng thẳng xuống đan đỉnh!`
    });
  }

  return waves;
}

export function createPillTribulationEncounter(
  pillId: string,
  pillName: string,
  pillTier: number,
  intensity: TribulationIntensity,
  basePillItem?: any,
  finalYieldCount: number = 1,
  veinMetadata?: any
): PillTribulationEncounter {
  const waves = generateTribulationWaves(intensity, pillTier);

  return {
    id: `tribulation_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    pillId,
    pillName,
    pillTier,
    intensity,
    totalWaves: waves.length,
    currentWave: 1,
    waves,
    accumulatedDamageAbsorbed: 0,
    isCauldronDestroyed: false,
    isDefendedSuccessfully: false,
    isSpiritAwakened: false,
    basePillItem,
    finalYieldCount,
    veinMetadata,
    startedAt: Date.now()
  };
}

// ==========================================
// 4. CƠ CHẾ HỘ ĐAN TAM TRẬN (DEFENSE ROUND)
// ==========================================

export function resolveLightningDefenseRound(
  player: PlayerStats,
  encounter: PillTribulationEncounter,
  defenseChoice: 'player' | 'companion' | 'formation',
  companionId?: string,
  options?: {
    customDamage?: number;
  }
): LightningDefenseResult {
  const updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));
  const wave = encounter.waves[encounter.currentWave - 1];

  if (!wave) {
    return {
      success: false,
      isCauldronDestroyed: false,
      damageDealt: 0,
      damageAbsorbed: 0,
      updatedPlayer,
      logMessage: 'Đợt sấm sét đã kết thúc.',
      encounterFinished: true,
      isDefendedSuccessfully: true,
      choice: defenseChoice
    };
  }

  const rawDamage = options?.customDamage ?? wave.rawLightningDamage;
  let damageDealt = 0;
  let damageAbsorbed = 0;
  let logMessage = '';
  let companionUsedName: string | undefined;

  // ----------------------------------------------------
  // TUYẾN 1: HỘ TRẬN ĐỘNG PHỦ (FORMATION DEFENSE)
  // ----------------------------------------------------
  if (defenseChoice === 'formation') {
    const config = TRIBULATION_INTENSITY_CONFIG[encounter.intensity];
    const cost = config.formationLinhThachCost;

    // Kiểm tra Linh Thạch
    if (updatedPlayer.linhThach < cost) {
      encounter.isCauldronDestroyed = true;
      encounter.isDefendedSuccessfully = false;
      return {
        success: false,
        isCauldronDestroyed: true,
        damageDealt: rawDamage,
        damageAbsorbed: 0,
        updatedPlayer,
        logMessage: `💥 Hộ Trận cạn kiệt Linh Thạch (cần ${cost.toLocaleString()}), màn chắn vỡ vụn! Lôi đình đánh thẳng vào đan lò làm nổ tung!`,
        encounterFinished: true,
        isDefendedSuccessfully: false,
        choice: 'formation'
      };
    }

    // Trừ Linh Thạch
    updatedPlayer.linhThach -= cost;

    // Hấp thu 80% sát thương sấm sét
    damageAbsorbed = Math.round(rawDamage * 0.8);
    const residualDamage = rawDamage - damageAbsorbed;

    // Phần 20% còn lại đánh vào người chơi qua def / kháng lôi
    const combat = calculateCombatStats(updatedPlayer);
    const def = combat.def || 100;
    const defReduction = Math.min(0.75, def / (def + 2000));
    const lRes = Math.min(0.75, (combat.lightningResistPercent || 0) / 100);
    const finalResidualDamage = Math.max(1, Math.round(residualDamage * (1 - defReduction) * (1 - lRes)));

    const curHp = updatedPlayer.khiHuyet ?? 1000;
    updatedPlayer.khiHuyet = Math.max(1, curHp - finalResidualDamage);

    damageDealt = finalResidualDamage;
    logMessage = `🏛️ Hộ Trận Động Phủ hấp thu ${damageAbsorbed.toLocaleString()} sát thương (80%)! Tiêu hao ${cost.toLocaleString()} Linh Thạch. Bản thân chống đỡ phần dư ${finalResidualDamage.toLocaleString()} sát thương.`;
  }

  // ----------------------------------------------------
  // TUYẾN 2: ĐẠO LỮ HỘ PHÁP (COMPANION INTERVENTION)
  // ----------------------------------------------------
  else if (defenseChoice === 'companion') {
    const companionsState = updatedPlayer.companionsState;
    const compKey = companionId || companionsState?.activeCompanionId;
    const companion = compKey && companionsState?.companions ? companionsState.companions[compKey] : null;

    const now = Date.now();
    if (!companion || (companion.fatigueUntil && companion.fatigueUntil > now)) {
      // Đạo Lữ mệt mỏi hoặc không khả dụng -> Không thể hộ pháp!
      return {
        success: false,
        isCauldronDestroyed: false,
        damageDealt: 0,
        damageAbsorbed: 0,
        updatedPlayer,
        logMessage: `⚠️ Đạo Lữ đang kiệt sức (cần nghỉ ngơi) hoặc không có mặt, không thể xuất thủ hộ pháp!`,
        encounterFinished: false,
        isDefendedSuccessfully: false,
        choice: 'companion'
      };
    }

    companionUsedName = companion.name || compKey || 'Đạo Lữ';

    // Triệt tiêu 60% sát thương
    damageAbsorbed = Math.round(rawDamage * 0.6);
    const remainder = rawDamage - damageAbsorbed;

    // Phần 40% còn lại đánh vào Chân Nguyên (linhLuc), nếu thiếu đánh vào Máu (khiHuyet)
    const curQi = updatedPlayer.linhLuc ?? 0;
    if (curQi >= remainder) {
      updatedPlayer.linhLuc = curQi - remainder;
      damageDealt = 0;
    } else {
      updatedPlayer.linhLuc = 0;
      const rest = remainder - curQi;
      damageDealt = rest;
      const curHp = updatedPlayer.khiHuyet ?? 1000;
      updatedPlayer.khiHuyet = Math.max(1, curHp - rest);
    }

    // Tăng Hảo Cảm +5
    companion.affinity = (companion.affinity || 0) + 5;

    // Gán trạng thái mệt mỏi 1 giờ (1h = 3600 * 1000ms)
    companion.fatigueUntil = now + 3600 * 1000;

    logMessage = `🌸 Đạo Lữ [${companionUsedName}] xuất thủ tế xuất bảo bối che chở, giảm 60% sát thương (${damageAbsorbed.toLocaleString()})! Hảo Cảm +5, Đạo Lữ cần nghỉ ngơi 1 giờ.`;
  }

  // ----------------------------------------------------
  // TUYẾN 3: BẢN THÂN NGẠNH KHÁNG (BODY & QI DEFENSE)
  // ----------------------------------------------------
  else {
    const combat = calculateCombatStats(updatedPlayer);
    const def = combat.def || 100;
    const defReduction = Math.min(0.75, def / (def + 2000));
    const lRes = Math.min(0.75, (combat.lightningResistPercent || 0) / 100);

    // Xuyên giáp từ sấm sét
    const effectiveDefReduction = Math.max(0, defReduction * (1 - (wave.piercePercent || 0) / 100));

    damageDealt = Math.max(1, Math.round(rawDamage * (1 - effectiveDefReduction) * (1 - lRes)));
    damageAbsorbed = rawDamage - damageDealt;

    const curHp = updatedPlayer.khiHuyet ?? 1000;
    const newHp = curHp - damageDealt;

    if (newHp <= 0) {
      // Khiên vỡ, trọng thương, nổ lò!
      updatedPlayer.khiHuyet = 1;
      encounter.isCauldronDestroyed = true;
      encounter.isDefendedSuccessfully = false;

      return {
        success: false,
        isCauldronDestroyed: true,
        damageDealt,
        damageAbsorbed,
        updatedPlayer,
        logMessage: `💥 Bản thân trọng thương (chịu ${damageDealt.toLocaleString()} sát thương)! Khiên vỡ vụn, lôi kiếp đánh tan đan lò thành tro tàn!`,
        encounterFinished: true,
        isDefendedSuccessfully: false,
        choice: 'player'
      };
    }

    // Chống chịu thành công
    updatedPlayer.khiHuyet = newHp;

    // Thưởng Tôi Thể & Ngộ Tính
    updatedPlayer.ngoTinh = (updatedPlayer.ngoTinh || 10) + 1;
    const tuViGain = 1000 * encounter.pillTier;
    updatedPlayer.tuVi = (updatedPlayer.tuVi || 0) + tuViGain;

    logMessage = `⚡ Bản thân ngạnh kháng sấm sét thành công! Chịu ${damageDealt.toLocaleString()} sát thương. Kinh mạch được tôi luyện: Ngộ Tính +1, Tu Vi +${tuViGain.toLocaleString()}.`;
  }

  // Cập nhật trạng thái encounter
  encounter.accumulatedDamageAbsorbed += damageAbsorbed;

  let encounterFinished = false;
  let isDefendedSuccessfully = false;

  if (encounter.currentWave >= encounter.totalWaves) {
    encounterFinished = true;
    isDefendedSuccessfully = true;
    encounter.isDefendedSuccessfully = true;
  } else {
    encounter.currentWave += 1;
  }

  return {
    success: true,
    isCauldronDestroyed: encounter.isCauldronDestroyed,
    damageDealt,
    damageAbsorbed,
    updatedPlayer,
    logMessage,
    companionUsed: companionUsedName,
    encounterFinished,
    isDefendedSuccessfully,
    choice: defenseChoice
  };
}

// ==========================================
// 5. THĂNG HOA TIÊN THIÊN THẦN ĐAN & ĐAN LINH
// ==========================================

export function finalizePillTribulation(
  player: PlayerStats,
  encounter: PillTribulationEncounter,
  basePill: Pill,
  options?: {
    forceSpiritAwakening?: boolean;
    deterministicRoll?: number;
  }
): FinalizeTribulationResult {
  const updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));
  if (!updatedPlayer.pillTribulationState) {
    updatedPlayer.pillTribulationState = {
      totalTribulationsFaced: 0,
      successfulDefenses: 0,
      danSpirits: [],
      activeTribulation: null
    };
  }

  const tribState = updatedPlayer.pillTribulationState;
  tribState.totalTribulationsFaced += 1;
  tribState.activeTribulation = null;

  const inv: InventoryBag = updatedPlayer.inventory || { pills: [], herbs: [], ores: [] };
  updatedPlayer.inventory = inv;

  // ----------------------------------------------------
  // TRƯỜNG HỢP 1: THẤT BẠI (NỔ LÒ / KHIÊN VỠ)
  // ----------------------------------------------------
  if (encounter.isCauldronDestroyed || !encounter.isDefendedSuccessfully) {
    const ruinedPill: Pill = {
      id: `pill_phe_dan_doc_${Date.now()}`,
      name: 'Phế Đan Độc Dược (Lôi Kiếp Tro Tàn)',
      grade: 'Phàm Giai',
      description: 'Đan dược bị thiên lôi đánh tan tành, tích tụ 100 điểm Đan Độc chí mạng.',
      effectValue: 0,
      price: 1,
      quantity: 1,
      veinMetadata: {
        veinCount: 0,
        veinMultiplier: 0.1,
        toxicityMultiplier: 1.0,
        mutation: null
      }
    };

    const pheIndex = inv.pills.findIndex(p => p.id === 'pill_phe_dan_doc');
    if (pheIndex !== -1) {
      inv.pills[pheIndex].quantity += 1;
    } else {
      inv.pills.push(ruinedPill);
    }

    return {
      updatedPlayer,
      resultPill: ruinedPill,
      awakenedSpirit: null,
      isFailed: true,
      logMessages: [
        `💥 Thiên kiếp thất bại! Đan đỉnh rạn nứt, ${basePill.name} bị sấm sét đánh nát thành Phế Đan Độc Dược.`,
        `Thu về 1 viên Phế Đan Độc Dược.`
      ]
    };
  }

  // ----------------------------------------------------
  // TRƯỜNG HỢP 2: THÀNH CÔNG VƯỢT THIÊN KIẾP!
  // ----------------------------------------------------
  tribState.successfulDefenses += 1;

  // Thăng hoa Tiên Thiên Đan Dược
  const evolvedPill: Pill = {
    ...basePill,
    name: `【Tiên Thiên Thần Đan】${basePill.name.replace(/^【Tiên Thiên Thần Đan】\s*/, '')}`,
    effectValue: Math.round((basePill.effectValue || 1000) * 1.5),
    veinMetadata: {
      ...(basePill.veinMetadata || {
        veinCount: 9,
        veinMultiplier: 2.0,
        toxicityMultiplier: 0,
        mutation: null
      }),
      isPrimordial: true,
      veinMultiplier: Number(((basePill.veinMetadata?.veinMultiplier || 1.5) * 1.5).toFixed(2)),
      toxicityMultiplier: 0, // Đan Độc = 0 tuyệt đối!
      primordialAura: {
        id: 'aura_tien_thien_ho_the',
        name: 'Tiên Thiên Hộ Thể',
        description: 'Gia tăng +5% Kháng tất cả sát thương trong 24h và miễn nhiễm toàn bộ đan độc.',
        potencyBoostPercent: 50,
        durationHours: 24
      }
    }
  };

  // ----------------------------------------------------
  // KIỂM TRA ĐAN LINH HÓA HÌNH (DAN LINH NHI)
  // ----------------------------------------------------
  // Điều kiện hóa hình: Đan Tier 9 hoặc Đan 9 Văn
  const canAwaken = encounter.pillTier >= 9 || (basePill.veinMetadata?.veinCount === 9);

  let awakenedSpirit: DanSpiritCompanion | null = null;
  if (canAwaken) {
    // 5% cơ bản, tăng lên 10% nếu có Dị Hỏa Hỗn Độn
    const hasChaosFlame = player.flameState?.equippedFlameId === 'flame_thai_so_hon_don';
    const awakenChance = hasChaosFlame ? 0.10 : 0.05;

    const roll = options?.deterministicRoll !== undefined
      ? options.deterministicRoll
      : Math.random();

    const isAwakened = options?.forceSpiritAwakening || roll < awakenChance;

    if (isAwakened) {
      encounter.isSpiritAwakened = true;
      awakenedSpirit = {
        id: `dan_spirit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: `Đan Linh Nhi • ${basePill.name.replace(/^【Tiên Thiên Thần Đan】\s*/, '').trim()}`,
        sourcePillName: basePill.name,
        rarityTier: Math.max(7, encounter.pillTier),
        element: 'Hỗn Độn',
        awakenedAt: Date.now(),
        buffs: {
          gardenGrowthSpeedBonus: 0.20, // Rút ngắn 20% thời gian lớn thảo dược
          veinQualityBonus: 15,          // +15 điểm Đan Văn
          explosionRiskReduction: 10     // -10% nguy cơ nổ lò
        },
        personalityLore: 'Hấp thu cửu cửu lôi kiếp tinh hoa mà đắc đạo hóa hình, thân hình thanh tú như tiên đồng, tính tình hoạt bát thông tuệ.'
      };

      tribState.danSpirits.push(awakenedSpirit);

      return {
        updatedPlayer,
        resultPill: undefined, // Viên đan đã hóa hình thành sinh linh, không nằm lại trong túi
        awakenedSpirit,
        isFailed: false,
        logMessages: [
          `🌟 THIÊN ĐỊA DỊ TƯỢNG: Viên đan hấp thu cửu thiên lôi đình, không nằm lại dưới dạng vật phẩm tiêu hao!`,
          `🧚 Đan Linh Nhi đã hóa hình xuất thế, chuyển về cư ngụ tại Động Phủ giúp chăm sóc Dược Viên và Đan Phòng!`
        ]
      };
    }
  }

  // Nếu không hóa hình: Đưa Tiên Thiên Thần Đan vào Túi Trữ Vật
  const existingIdx = inv.pills.findIndex(p => p.id === evolvedPill.id);
  if (existingIdx !== -1) {
    inv.pills[existingIdx].quantity += (encounter.finalYieldCount || 1);
  } else {
    inv.pills.push(evolvedPill);
  }

  return {
    updatedPlayer,
    resultPill: evolvedPill,
    awakenedSpirit: null,
    isFailed: false,
    logMessages: [
      `🎉 VƯỢT THIÊN KIẾP THÀNH CÔNG! ${evolvedPill.name} đã thăng hoa thành Tiên Thiên Thần Đan!`,
      `Dược lực tăng thêm +50%, Đan độc hoàn toàn tiêu tán (0%), mở khóa hào quang 【Tiên Thiên Hộ Thể】!`
    ]
  };
}

// ==========================================
// 6. ĐỒNG BỘ BUFF TỪ DAN SPIRITS
// ==========================================

export interface DanSpiritsBuffsResult {
  totalSpirits: number;
  gardenGrowthSpeedBonus: number; // Tối đa 50%
  veinQualityBonus: number;
  explosionRiskReduction: number;
}

export function calculateDanSpiritsBuffs(player: PlayerStats): DanSpiritsBuffsResult {
  const spirits = player.pillTribulationState?.danSpirits || [];
  if (spirits.length === 0) {
    return {
      totalSpirits: 0,
      gardenGrowthSpeedBonus: 0,
      veinQualityBonus: 0,
      explosionRiskReduction: 0
    };
  }

  let growthBonus = 0;
  let veinBonus = 0;
  let explosionReduction = 0;

  for (const s of spirits) {
    growthBonus += s.buffs.gardenGrowthSpeedBonus || 0;
    veinBonus += s.buffs.veinQualityBonus || 0;
    explosionReduction += s.buffs.explosionRiskReduction || 0;
  }

  return {
    totalSpirits: spirits.length,
    gardenGrowthSpeedBonus: Math.min(0.50, growthBonus), // Kẹp trần tối đa 50%
    veinQualityBonus: Math.min(60, veinBonus),
    explosionRiskReduction: Math.min(30, explosionReduction)
  };
}

export function createDefaultPillTribulationState(): PillTribulationState {
  return {
    totalTribulationsFaced: 0,
    successfulDefenses: 0,
    danSpirits: [],
    activeTribulation: null
  };
}
