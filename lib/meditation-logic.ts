// lib/meditation-logic.ts
// Pure Business Logic Engine cho Phân Hệ "Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà"
// (Strategic AFK Meditation & Event Journal)

import { PlayerStats, Manual } from '@/lib/types';
import {
  MeditationStanceType,
  MeditationLocationConfig,
  MeditationEventLog,
  MeditationProgressResult,
  ActiveMeditationState,
  GuardianRescueIncident
} from '@/lib/types/meditation';
import { calculateCombatStats } from '@/lib/destiny-data';
import { COMPANIONS_MAP } from '@/lib/companions-data';
import {
  checkElementalResonance,
  resolveGuardianHazardRescue,
  calculateGuardianGrowth,
  applyGuardianProgressToPlayer
} from '@/lib/meditation-guardian-logic';
import {
  generateCustomSanctuaryLocation,
  CUSTOM_SANCTUARY_LOCATION_ID,
  getCustomSanctuaryBuffTotals
} from '@/lib/custom-sanctuary-logic';
import {
  rollMeditationMapFragment,
  DIRECTION_NAMES
} from '@/lib/ancient-map-dungeon-logic';
import { MapFragmentItem } from '@/lib/types/ancient-map-dungeon';

// ============================================================================
// 1. DANH MỤC LINH ĐỊA NHẬP ĐỊNH (MEDITATION LOCATIONS)
// ============================================================================
export const MEDITATION_LOCATIONS: Record<string, MeditationLocationConfig> = {
  linh_mach_tong_mon: {
    id: 'linh_mach_tong_mon',
    name: 'Linh Mạch Tông Môn',
    description: 'Linh khí ôn hòa thuần chính dưới sự bảo hộ của Hộ Tông Trận Pháp, an toàn tuyệt đối.',
    requiredRealmIndex: 0, // Phàm nhân / Luyện Khí
    element: 'Thổ',
    tuviMultiplier: 1.0,
    dropTableId: 'drop_linh_mach',
    possibleEventTypes: ['ore', 'herb', 'poem', 'monk', 'beast_visit'],
    icon: '🏔️',
    bgGradient: 'from-amber-950/40 via-stone-900/60 to-black',
    specialTrait: 'An toàn 100%, tỷ lệ rơi Linh Thạch và dược thảo cơ bản ổn định.'
  },
  han_bang_tham_dong: {
    id: 'han_bang_tham_dong',
    name: 'Hàn Băng Thâm Động',
    description: 'Hàn khí thấu triệt xương tủy, uẩn nhưỡng băng tinh huyền ảo, tôi luyện chân nguyên.',
    requiredRealmIndex: 11, // Trúc Cơ Sơ Kỳ
    element: 'Thủy',
    tuviMultiplier: 1.35,
    dropTableId: 'drop_han_bang',
    possibleEventTypes: ['ice_crystal', 'herb_water', 'ice_beast', 'frost_insight'],
    icon: '❄️',
    bgGradient: 'from-cyan-950/40 via-blue-950/60 to-black',
    specialTrait: 'Tăng 35% Tu Vi, rơi Băng Tinh, Thủy Linh Thảo và Hàn Thiết Khoáng.'
  },
  hoa_diem_thien_son: {
    id: 'hoa_diem_thien_son',
    name: 'Hỏa Diễm Thiên Sơn',
    description: 'Vùng đất dung nham cuồn cuộn ngút trời, tôi luyện khí huyết và ngưng luyện linh hỏa.',
    requiredRealmIndex: 16, // Kim Đan Sơ Kỳ
    element: 'Hỏa',
    tuviMultiplier: 1.75,
    dropTableId: 'drop_hoa_diem',
    possibleEventTypes: ['fire_ore', 'herb_fire', 'flame_beast', 'fire_essence'],
    icon: '🌋',
    bgGradient: 'from-orange-950/40 via-red-950/60 to-black',
    specialTrait: 'Tăng 75% Tu Vi, sản sinh Xích Hỏa Quặng, Hỏa Tinh Thảo và Đan Hỏa Tinh Hoa.'
  },
  than_ma_co_chien_truong: {
    id: 'than_ma_co_chien_truong',
    name: 'Thần Ma Cổ Chiến Trường',
    description: 'Chiến trường Thần Ma thời thái cổ ngập tràn ý niệm viễn cổ, cơ duyên và hung hiểm song hành.',
    requiredRealmIndex: 21, // Nguyên Anh Sơ Kỳ
    element: 'Hỗn Độn',
    tuviMultiplier: 2.5,
    dropTableId: 'drop_than_ma',
    possibleEventTypes: ['ancient_tome', 'chaos_essence', 'evil_spirit', 'god_remnant'],
    icon: '🌌',
    bgGradient: 'from-purple-950/40 via-slate-950/60 to-black',
    specialTrait: 'Tăng 150% Tu Vi, có cơ hội nhặt được Tàn Chương Cổ Thần Thông và Dị Bảo Cực Phẩm.'
  }
};

// ============================================================================
// 2. CẤU HÌNH THẾ NHẬP ĐỊNH (MEDITATION STANCES CONFIG)
// ============================================================================
export const MEDITATION_STANCES_CONFIG: Record<
  MeditationStanceType,
  {
    name: string;
    icon: string;
    description: string;
    badge: string;
    riskRate: number;
    tuviMultiplier: number;
  }
> = {
  co_ban: {
    name: 'Cố Bản Bồi Nguyên',
    icon: '🛡️',
    description: 'Tĩnh tọa thổ nạp an hòa, nhận Tu Vi và Linh Thạch ổn định, không có rủi ro.',
    badge: 'An Toàn 100%',
    riskRate: 0,
    tuviMultiplier: 1.0
  },
  luyen_tam: {
    name: 'Luyện Tâm Hóa Ma',
    icon: '🧘',
    description: 'Không nhận Tu Vi. Mỗi giờ tự động trừ 3 Ma Tính và 3 Đan Độc. Xuất quan nhận buff [Tâm Cảnh Thanh Lãng] +15% tỷ lệ đột phá.',
    badge: 'Trừ Ma • Tẩy Độc',
    riskRate: 0,
    tuviMultiplier: 0
  },
  thao_dien: {
    name: 'Thao Diễn Thần Thông',
    icon: '⚔️',
    description: 'Toàn bộ tu vi chuyển hóa thành Điểm Thuần Thục (Skill EXP) phân bổ đều cho các Công Pháp / Thần Thông đang trang bị.',
    badge: 'Luyện Chiêu Thức',
    riskRate: 0,
    tuviMultiplier: 1.0
  },
  hiem_canh: {
    name: 'Hiểm Cảnh Đoạt Vận',
    icon: '⚡',
    description: 'Tu Vi x2.0, tỷ lệ rớt bảo vật hiếm x2.5. Có 20% nguy cơ gặp hung hiểm gián đoạn nếu không có Bùa Hộ Mệnh bảo vệ.',
    badge: 'Nguy Hiểm • Thưởng Cực Đại',
    riskRate: 0.20,
    tuviMultiplier: 2.0
  }
};

// ============================================================================
// 3. DANH MỤC BÙA HỘ MỆNH & HỘ TRẬN (WARD CATALOG)
// ============================================================================
export const WARD_ITEMS_REGISTRY: Record<string, { id: string; name: string; icon: string; description: string }> = {
  talisman_an_than_phu: {
    id: 'talisman_an_than_phu',
    name: 'An Thần Hộ Thể Phù',
    icon: '📜',
    description: 'Định tâm an thần, miễn nhiễm 100% rủi ro đứt đoạn khi nhập định ở Hiểm Cảnh.'
  },
  talisman_khang_ma_tran_ban: {
    id: 'talisman_khang_ma_tran_ban',
    name: 'Khang Ma Trận Bàn',
    icon: '💠',
    description: 'Trấn áp tà ma ngoại đạo xâm nhập, bảo hộ nguyên thần chu toàn suốt 24 giờ.'
  },
  talisman_kim_cuong_ho_the: {
    id: 'talisman_kim_cuong_ho_the',
    name: 'Kim Cương Hộ Thể Phù',
    icon: '🛡️',
    description: 'Bảo bối gia trì kim quang hộ thể, phản sát kẻ cướp đạo khi đoạt vận.'
  }
};

// ============================================================================
// 4. BẢNG TÀI NGUYÊN RỚT THEO LINH ĐỊA (DROP TABLES)
// ============================================================================
const LOCATION_DROP_TABLES: Record<
  string,
  { id: string; name: string; baseChance: number; amountMin: number; amountMax: number }[]
> = {
  drop_linh_mach: [
    { id: 'herb_tu_khi_thao', name: 'Tụ Khí Thảo', baseChance: 0.40, amountMin: 1, amountMax: 3 },
    { id: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', baseChance: 0.35, amountMin: 2, amountMax: 5 },
    { id: 'ore_thiet_khoang', name: 'Thiết Khoáng', baseChance: 0.30, amountMin: 1, amountMax: 3 }
  ],
  drop_han_bang: [
    { id: 'ore_bang_tinh', name: 'Huyền Băng Tinh Thạch', baseChance: 0.45, amountMin: 1, amountMax: 2 },
    { id: 'herb_thuy_linh', name: 'Thủy Linh Thảo', baseChance: 0.40, amountMin: 1, amountMax: 3 },
    { id: 'ore_han_thiet', name: 'Hàn Thiết Khoáng', baseChance: 0.35, amountMin: 1, amountMax: 3 }
  ],
  drop_hoa_diem: [
    { id: 'ore_xich_hoa', name: 'Xích Hỏa Quặng', baseChance: 0.50, amountMin: 1, amountMax: 3 },
    { id: 'herb_hoa_tinh', name: 'Hỏa Tinh Thảo', baseChance: 0.45, amountMin: 1, amountMax: 2 },
    { id: 'pill_tay_tuy', name: 'Tẩy Tủy Đan', baseChance: 0.20, amountMin: 1, amountMax: 1 }
  ],
  drop_than_ma: [
    { id: 'tome_tan_chuong', name: 'Tàn Chương Cổ Thần Thông', baseChance: 0.25, amountMin: 1, amountMax: 1 },
    { id: 'ore_hon_don_tinh', name: 'Hỗn Độn Tinh Thạch', baseChance: 0.35, amountMin: 1, amountMax: 2 },
    { id: 'cuc_pham_linh_thach', name: 'Cực Phẩm Linh Thạch', baseChance: 0.30, amountMin: 1, amountMax: 3 }
  ],
  drop_custom_sanctuary: [
    { id: 'herb_tu_khi_thao', name: 'Tụ Khí Thảo', baseChance: 0.50, amountMin: 2, amountMax: 5 },
    { id: 'ore_thiet_khoang', name: 'Huyền Thiết Khoáng', baseChance: 0.45, amountMin: 2, amountMax: 4 },
    { id: 'cuc_pham_linh_thach', name: 'Cực Phẩm Linh Thạch', baseChance: 0.35, amountMin: 1, amountMax: 3 },
    { id: 'pill_tay_tuy', name: 'Tẩy Tủy Đan', baseChance: 0.25, amountMin: 1, amountMax: 2 },
    { id: 'ore_hon_don_tinh', name: 'Hỗn Độn Tinh Thạch', baseChance: 0.20, amountMin: 1, amountMax: 1 }
  ]
};

// ============================================================================
// 4.5. LẤY DANH SÁCH LINH ĐỊA KHẢ DỤNG (AVAILABLE LOCATIONS RESOLVER)
// Tự động đưa thêm Linh Địa Độc Quyền vào ĐẦU danh sách nếu đã đả thông Linh Mạch từ Bậc 1
// ============================================================================
export function getAvailableMeditationLocations(player: PlayerStats): MeditationLocationConfig[] {
  const baseLocations = Object.values(MEDITATION_LOCATIONS);
  if (player.customSanctuary && player.customSanctuary.veinTier >= 1) {
    const customLoc = generateCustomSanctuaryLocation(player);
    return [customLoc, ...baseLocations];
  }
  return baseLocations;
}

// ============================================================================
// 5. THẨM ĐỊNH ĐIỀU KIỆN NHẬP ĐỊNH (VALIDATION)
// ============================================================================
export function canStartMeditation(
  player: PlayerStats,
  locationId: string,
  _stance: MeditationStanceType
): { canMedidate: boolean; reason?: string } {
  const loc = locationId === CUSTOM_SANCTUARY_LOCATION_ID
    ? generateCustomSanctuaryLocation(player)
    : (MEDITATION_LOCATIONS[locationId] || MEDITATION_LOCATIONS.linh_mach_tong_mon);
  const currentRealm = player.currentRealm || 0;

  if (currentRealm < loc.requiredRealmIndex) {
    return {
      canMedidate: false,
      reason: `Cảnh giới hiện tại chưa đủ để nhập định tại 【${loc.name}】! Yêu cầu mốc cảnh giới tối thiểu (Index ${loc.requiredRealmIndex}).`
    };
  }

  return { canMedidate: true };
}

// ============================================================================
// 6. THUẬT TOÁN GIẢI QUYẾT TIẾN TRÌNH NGOẠI TUYẾN (HOURLY SIMULATION ENGINE)
// ============================================================================
export interface ResolveMeditationOptions {
  simulatedHazardHour?: number; // Cho phép mock mốc giờ xảy ra hiểm họa trong test suite
  companionId?: string | null;
  beastId?: string | null;
  simulatedRescueSeed?: number; // Cho phép mock RNG cứu viện trong test suite
  simulatedFragmentRoll?: number; // Cho phép mock RNG rơi mảnh tàn đồ trong test suite
  simulatedFragmentSetId?: string;
  simulatedFragmentPieceIndex?: 1 | 2 | 3 | 4;
}

export function resolveOfflineMeditationProgress(
  player: PlayerStats,
  startTime: number,
  endTime: number,
  locationId: string,
  stance: MeditationStanceType,
  wardItemId?: string | null,
  options?: ResolveMeditationOptions
): MeditationProgressResult {
  const loc = locationId === CUSTOM_SANCTUARY_LOCATION_ID
    ? generateCustomSanctuaryLocation(player)
    : (MEDITATION_LOCATIONS[locationId] || MEDITATION_LOCATIONS.linh_mach_tong_mon);
  const stanceCfg = MEDITATION_STANCES_CONFIG[stance] || MEDITATION_STANCES_CONFIG.co_ban;

  // Giới hạn trần thời gian 24 giờ (Hard Invariant 3)
  const elapsedSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));
  const totalHoursElapsed = Math.floor(elapsedSeconds / 3600);
  const cappedHours = Math.min(24, totalHoursElapsed);

  // 1. Tìm thông tin Đạo Lữ Hộ Pháp
  const compId = options?.companionId !== undefined
    ? options.companionId
    : (player.meditationState?.accompanyingCompanionId ?? player.accompanyingCompanionId);

  let compDef: any = null;
  let compState: any = null;
  if (compId) {
    compDef = COMPANIONS_MAP[compId];
    compState = player.companionsState?.companions?.[compId];
  }
  const companionInfo = (compId && (compDef || compState)) ? {
    id: compId,
    name: compDef?.name || compState?.name || compId,
    element: compDef?.element,
    realmIndex: compDef?.realmIndex || 0,
    affinity: compState?.affinity,
    fatigueUntil: compState?.fatigueUntil,
    totalEpiphanies: compState?.totalEpiphanies
  } : null;

  // 2. Tìm thông tin Linh Thú Hộ Pháp
  const beastId = options?.beastId !== undefined
    ? options.beastId
    : (player.meditationState?.accompanyingBeastId ?? player.accompanyingBeastId);

  let beastObj: any = null;
  if (beastId) {
    const allBeasts = player.beastGarden?.beasts || player.beasts || [];
    beastObj = allBeasts.find(b => b && b.id === beastId);
  }
  const beastInfo = beastObj ? {
    id: beastObj.id,
    name: beastObj.name,
    element: beastObj.element,
    level: beastObj.level || 1,
    tier: beastObj.tier || 1,
    exp: beastObj.exp || 0,
    maxExp: beastObj.maxExp || 1000,
    bloodlinePurity: beastObj.bloodlinePurity || 0,
    loyalty: beastObj.loyalty || 50
  } : null;

  // 3. Kiểm tra Cộng Hưởng Thuộc Tính Linh Địa
  const resonance = checkElementalResonance(
    loc,
    companionInfo?.element,
    beastInfo?.element
  );
  const resonanceBonusMultiplier = resonance.bonusMultiplier;

  if (cappedHours <= 0) {
    return {
      totalHoursElapsed,
      effectiveHours: 0,
      totalTuviGained: 0,
      totalStonesGained: 0,
      demonicCleanseTotal: 0,
      toxicityCleanseTotal: 0,
      skillExpPerManual: 0,
      itemsLooted: [],
      eventLogs: [],
      appliedBreakthroughBuff: false,
      elementalResonanceBonus: resonance.hasResonance ? 0.15 : 0,
      resonanceDetails: resonance.description
    };
  }

  // Tính tu vi cơ bản mỗi giờ dựa trên thực lực nhân vật
  const cStats = calculateCombatStats(player);
  const canCot = player.canCot || 50;
  const ngoTinh = player.ngoTinh || 50;
  const basePerHour = Math.max(
    100,
    Math.floor((cStats.atk * 0.25 + canCot * 0.6 + ngoTinh * 0.5) * 60)
  );

  let effectiveHours = 0;
  let interruptedAtHour: number | undefined = undefined;
  let interruptionReason: string | undefined = undefined;

  let totalTuviGained = 0;
  let totalStonesGained = 0;
  let demonicCleanseTotal = 0;
  let toxicityCleanseTotal = 0;
  let skillExpTotal = 0;
  const itemsLootedMap = new Map<string, { itemId: string; name: string; amount: number }>();
  const mapFragmentsLooted: MapFragmentItem[] = [];
  const eventLogs: MeditationEventLog[] = [];
  const guardianRescues: GuardianRescueIncident[] = [];

  const dropTable = LOCATION_DROP_TABLES[loc.dropTableId] || LOCATION_DROP_TABLES.drop_linh_mach;
  const lootMultiplier = (stance === 'hiem_canh' ? 2.5 : 1.0) * resonanceBonusMultiplier;

  // Hiệu ứng cộng hưởng từ Linh Mạch Động Phủ Tự Chế (Sanctuary Resonances)
  const sanctuaryBuffs = getCustomSanctuaryBuffTotals(player.customSanctuary);
  const effectiveHazardRisk = Math.max(0, stanceCfg.riskRate * (1 - (sanctuaryBuffs.hazardRiskReduction || 0)));

  // LẶP QUA TỪNG MỐC GIỜ (HOURLY LOOP)
  for (let h = 1; h <= cappedHours; h++) {
    // ------------------------------------------------------------------------
    // KIỂM TRA HIỂM HỌA (Áp dụng cho Hiểm Cảnh Đoạt Vận)
    // ------------------------------------------------------------------------
    if (stance === 'hiem_canh') {
      const isHazardAtThisHour = options?.simulatedHazardHour !== undefined
        ? options.simulatedHazardHour === h
        : Math.random() < effectiveHazardRisk;

      if (isHazardAtThisHour) {
        const rescueResult = resolveGuardianHazardRescue(
          h,
          stance,
          wardItemId,
          companionInfo,
          beastInfo,
          options?.simulatedRescueSeed
        );

        eventLogs.push(rescueResult.log);
        if (rescueResult.rescueIncident) {
          guardianRescues.push(rescueResult.rescueIncident);
        }

        if (!rescueResult.defended) {
          // Không có bùa hộ mệnh và hộ pháp cứu viện thất bại -> Bị gián đoạn tại giờ h
          interruptedAtHour = h;
          interruptionReason = `Khí Huyết Nghịch Chuyển tại giờ thứ ${h}`;
          effectiveHours = h;
          break;
        }
      }
    }

    effectiveHours = h;

    // Cộng hưởng thanh tẩy uế khí từ Linh Mạch Động Phủ (e.g. Thanh Tâm Định Mạch)
    if (sanctuaryBuffs.pillToxicityCleansePerHour) {
      toxicityCleanseTotal += sanctuaryBuffs.pillToxicityCleansePerHour;
    }
    if (sanctuaryBuffs.demonicCleansePerHour) {
      demonicCleanseTotal += sanctuaryBuffs.demonicCleansePerHour;
    }

    // ------------------------------------------------------------------------
    // TÍNH TOÁN THÀNH QUẢ THEO THẾ NHẬP ĐỊNH
    // ------------------------------------------------------------------------
    if (stance === 'luyen_tam') {
      // Mỗi giờ trừ 3 Ma Tính và 3 Đan Độc
      demonicCleanseTotal += 3;
      toxicityCleanseTotal += 3;

      if (h % 3 === 0 || h === cappedHours) {
        eventLogs.push({
          hour: h,
          title: 'Tĩnh Tâm Tẩy Uế',
          narrative: `Giờ thứ ${h}: Chân hỏa nội luyện, thanh lọc tạp chất đan điền, tâm ma dần dần tan biến vào hư vô.`,
          rewardType: 'demonic_reduction',
          rewardValue: 3
        });
      }
    } else if (stance === 'thao_dien') {
      // Tu vi chuyển hóa thành Skill EXP
      const hourlyTuvi = Math.floor(basePerHour * loc.tuviMultiplier * stanceCfg.tuviMultiplier * resonanceBonusMultiplier);
      skillExpTotal += hourlyTuvi;

      if (h % 2 === 0 || h === cappedHours) {
        eventLogs.push({
          hour: h,
          title: 'Thao Diễn Thần Thông',
          narrative: `Giờ thứ ${h}: Thức hải diễn hóa chiêu thức thiên biến vạn hóa, thần thông công pháp đạt cảnh giới thuần thục mới.`,
          rewardType: 'skill_exp',
          rewardValue: hourlyTuvi
        });
      }
    } else {
      // co_ban hoặc hiem_canh
      const hourlyTuvi = Math.floor(basePerHour * loc.tuviMultiplier * stanceCfg.tuviMultiplier * resonanceBonusMultiplier);
      const hourlyStones = Math.max(5, Math.floor(hourlyTuvi * 0.08));

      totalTuviGained += hourlyTuvi;
      totalStonesGained += hourlyStones;

      // Sinh sự kiện ngẫu nhiên theo giờ
      if (h % 2 === 1) {
        const events = [
          {
            title: 'Đốn Ngộ Thiên Địa',
            narrative: `Giờ thứ ${h}: Cảm nhận chu kỳ linh khí biến hóa, đốn ngộ thơ ca thiên địa, thu hoạch thêm tu vi.`,
            type: 'tuvi' as const,
            bonus: Math.floor(hourlyTuvi * 0.15)
          },
          {
            title: 'Tán Tu Giao Dịch',
            narrative: `Giờ thứ ${h}: Tao ngộ tán tu đi ngang linh địa, đàm đạo kinh nghiệm thu hoạch thêm linh thạch.`,
            type: 'spirit_stones' as const,
            bonus: Math.floor(hourlyStones * 0.5)
          }
        ];
        const chosen = events[h % events.length];
        if (chosen.type === 'tuvi') totalTuviGained += chosen.bonus;
        if (chosen.type === 'spirit_stones') totalStonesGained += chosen.bonus;

        eventLogs.push({
          hour: h,
          title: chosen.title,
          narrative: chosen.narrative,
          rewardType: chosen.type,
          rewardValue: chosen.bonus
        });
      }
    }

    // ------------------------------------------------------------------------
    // NHẶT TÀI NGUYÊN (DROP TABLE LOOT)
    // ------------------------------------------------------------------------
    for (const drop of dropTable) {
      const chance = Math.min(0.95, drop.baseChance * lootMultiplier);
      if (Math.random() < chance) {
        const qty = Math.floor(
          Math.random() * (drop.amountMax - drop.amountMin + 1) + drop.amountMin
        );
        const existing = itemsLootedMap.get(drop.id) || { itemId: drop.id, name: drop.name, amount: 0 };
        existing.amount += qty;
        itemsLootedMap.set(drop.id, existing);

        if (h === 1 || h % 4 === 0) {
          eventLogs.push({
            hour: h,
            title: 'Thu Hoạch Dị Bảo',
            narrative: `Giờ thứ ${h}: Nhặt được 【${drop.name}】 x${qty} phát tán nơi linh mạch.`,
            rewardType: 'item',
            rewardValue: qty,
            rewardItemName: drop.name
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // RƠI MẢNH TÀN ĐỒ KỲ NGỘ THƯỢNG CỔ (ANCIENT MAP FRAGMENT DROP ENGINE)
    // ------------------------------------------------------------------------
    const droppedFragment = rollMeditationMapFragment(
      loc.id,
      stance,
      h,
      player.currentRealm || 0,
      options?.simulatedFragmentRoll,
      options?.simulatedFragmentSetId,
      options?.simulatedFragmentPieceIndex
    );

    if (droppedFragment) {
      mapFragmentsLooted.push(droppedFragment);

      eventLogs.push({
        hour: h,
        title: `📜 [KỲ NGỘ BẢO ĐỒ] 【${droppedFragment.setName} • Mảnh ${DIRECTION_NAMES[droppedFragment.direction]}】`,
        narrative: `Giờ thứ ${h}: Trong lòng đất nứt toác, hào quang thượng cổ lóe sáng, đạo hữu phát hiện một mảnh cổ quyển 【${droppedFragment.setName} • Mảnh ${DIRECTION_NAMES[droppedFragment.direction]}】!`,
        rewardType: 'item',
        rewardValue: 1,
        rewardItemName: `${droppedFragment.setName} [Mảnh ${DIRECTION_NAMES[droppedFragment.direction]}]`
      });
    }
  }

  // Phân bổ Skill EXP cho các công pháp đang trang bị
  let skillExpPerManual = 0;
  if (stance === 'thao_dien' && skillExpTotal > 0) {
    const equipped = [
      player.equippedManuals?.tamPhap,
      player.equippedManuals?.theThuat,
      player.equippedManuals?.thanThong1,
      player.equippedManuals?.thanThong2
    ].filter(Boolean);
    const manualCount = Math.max(1, equipped.length);
    skillExpPerManual = Math.floor(skillExpTotal / manualCount);
  }

  const appliedBreakthroughBuff = stance === 'luyen_tam' && effectiveHours > 0;

  // Tính toán phần thưởng thu hoạch của Hộ Pháp (Đạo Lữ & Linh Thú)
  const guardianGrowth = calculateGuardianGrowth(
    effectiveHours,
    stance,
    loc,
    totalTuviGained,
    resonanceBonusMultiplier,
    companionInfo,
    beastInfo,
    guardianRescues
  );

  return {
    totalHoursElapsed,
    effectiveHours,
    interruptedAtHour,
    interruptionReason,
    totalTuviGained,
    totalStonesGained,
    demonicCleanseTotal,
    toxicityCleanseTotal,
    skillExpPerManual,
    itemsLooted: Array.from(itemsLootedMap.values()),
    mapFragmentsLooted,
    eventLogs,
    appliedBreakthroughBuff,
    guardianGrowth,
    guardianRescues,
    elementalResonanceBonus: resonance.hasResonance ? 0.15 : 0,
    resonanceDetails: resonance.description
  };
}

// ============================================================================
// 7. CẬP NHẬT THUỘC TÍNH NHÂN VẬT SAU KHI THU HOẠCH (APPLY TO PLAYER)
// ============================================================================
export function applyMeditationProgressToPlayer(
  player: PlayerStats,
  result: MeditationProgressResult,
  stance: MeditationStanceType = (player.meditationState?.stance as MeditationStanceType) || player.meditationStance || 'co_ban'
): PlayerStats {
  let updated: PlayerStats = JSON.parse(JSON.stringify(player));

  // 1. Cộng Tu Vi & Linh Thạch
  updated.tuVi = (updated.tuVi || 0) + result.totalTuviGained;
  updated.linhThach = (updated.linhThach || 0) + result.totalStonesGained;

  // 2. Trừ Ma Tính & Đan Độc (Luyện Tâm Hóa Ma)
  if (result.demonicCleanseTotal > 0) {
    updated.demonicNature = Math.max(0, (updated.demonicNature || 0) - result.demonicCleanseTotal);
  }
  if (result.toxicityCleanseTotal > 0) {
    updated.pillToxicity = Math.max(0, (updated.pillToxicity || 0) - result.toxicityCleanseTotal);
    updated.qiPurity = Math.max(10, Math.min(100, 100 - updated.pillToxicity));
  }

  // 3. Kích hoạt buff [Tâm Cảnh Thanh Lãng] (+15% tỷ lệ đột phá)
  if (result.appliedBreakthroughBuff) {
    if (!updated.activeBuffs) {
      updated.activeBuffs = {};
    }
    updated.activeBuffs.tamCanhThanhLang = true;
    (updated as any).tamCanhThanhLangUntil = Date.now() + 12 * 3600 * 1000; // Có hiệu lực 12 giờ
  }

  // 4. Phân bổ Skill EXP cho công pháp (Thao Diễn Thần Thông)
  if (stance === 'thao_dien' && result.skillExpPerManual > 0 && Array.isArray(updated.manuals)) {
    const equippedIds = [
      updated.equippedManuals?.tamPhap,
      updated.equippedManuals?.theThuat,
      updated.equippedManuals?.thanThong1,
      updated.equippedManuals?.thanThong2
    ].filter(Boolean);

    updated.manuals = updated.manuals.map((m: Manual) => {
      if (equippedIds.includes(m.id)) {
        const addedExp = (m.exp || 0) + result.skillExpPerManual;
        const maxExp = m.maxExp || (m.level * 1000);
        let newLevel = m.level;
        let finalExp = addedExp;

        while (finalExp >= maxExp && newLevel < (m.maxLevel || 10)) {
          finalExp -= maxExp;
          newLevel++;
        }

        return {
          ...m,
          level: newLevel,
          exp: finalExp
        };
      }
      return m;
    });
  }

  // 5. Thêm tài nguyên nhặt được vào túi trữ vật
  if (result.itemsLooted.length > 0 && updated.inventory) {
    for (const item of result.itemsLooted) {
      if (item.itemId.startsWith('herb_')) {
        if (!Array.isArray(updated.inventory.herbs)) updated.inventory.herbs = [];
        const found = updated.inventory.herbs.find((h: any) => h.id === item.itemId);
        if (found) {
          found.quantity += item.amount;
        } else {
          updated.inventory.herbs.push({
            id: item.itemId,
            name: item.name,
            quantity: item.amount,
            quality: 'trung_pham',
            grade: 'Nhất Giai'
          } as any);
        }
      } else if (item.itemId.startsWith('ore_') || item.itemId === 'cuc_pham_linh_thach') {
        if (!Array.isArray(updated.inventory.ores)) updated.inventory.ores = [];
        const found = updated.inventory.ores.find((o: any) => o.id === item.itemId);
        if (found) {
          found.quantity += item.amount;
        } else {
          updated.inventory.ores.push({
            id: item.itemId,
            name: item.name,
            quantity: item.amount,
            quality: 'trung_pham',
            grade: 'Nhất Giai'
          } as any);
        }
      } else {
        if (!Array.isArray(updated.inventory.pills)) updated.inventory.pills = [];
        const found = updated.inventory.pills.find((p: any) => p.id === item.itemId);
        if (found) {
          found.quantity += item.amount;
        } else {
          updated.inventory.pills.push({
            id: item.itemId,
            name: item.name,
            quantity: item.amount,
            quality: 'thuong_pham',
            grade: 'Nhị Giai'
          } as any);
        }
      }
    }
  }

  // 5.5. Cập nhật Mảnh Tàn Đồ Thượng Cổ vào Tàng Bảo Các
  if (result.mapFragmentsLooted && result.mapFragmentsLooted.length > 0) {
    if (!updated.ancientMapVault) {
      updated.ancientMapVault = {
        fragmentsInventory: {},
        synthesizedMaps: [],
        activeDungeon: null,
        clearedDungeonsCount: 0
      };
    }
    if (!updated.ancientMapVault.fragmentsInventory) {
      updated.ancientMapVault.fragmentsInventory = {};
    }
    for (const frag of result.mapFragmentsLooted) {
      updated.ancientMapVault.fragmentsInventory[frag.id] = (updated.ancientMapVault.fragmentsInventory[frag.id] || 0) + 1;
    }
  }

  // 6. Cập nhật tiến độ của Đạo Lữ & Linh Thú hộ pháp (đồng thời giải phóng lock)
  updated = applyGuardianProgressToPlayer(updated, result.guardianGrowth, result.guardianRescues);

  // 7. Reset trạng thái nhập định và lưu nhật ký sự kiện
  updated.meditationState = {
    isMeditating: false,
    startTime: 0,
    locationId: 'linh_mach_tong_mon',
    stance: 'co_ban',
    wardItemId: null,
    accompanyingCompanionId: null,
    accompanyingBeastId: null,
    guardianRescueCount: 0
  };
  updated.meditationEventLogs = result.eventLogs;

  return updated;
}
