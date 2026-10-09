// lib/tribulation-logic.ts
// Business Logic & Engine Mô Phỏng "Cửu Trọng Thiên Kiếp Tương Tác • Lôi Kiếp Độ Kiếp"

import { PlayerStats, Realm } from '@/lib/types';
import {
  TribulationConfig,
  TribulationWaveConfig,
  TribulationActionType,
  TribulationRunState,
} from '@/lib/types/tribulation';
import { calculateCombatStats } from '@/lib/destiny-data';
import { getBaseLifespanForRealm } from '@/lib/lifespan-logic';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as Realm[];

// ============================================================
// 1. CÁC MỐC ĐẠI CẢNH GIỚI BẮT BUỘC ĐỘ THIÊN KIẾP
// ============================================================
// Từ Đại Thừa Đại Viên Mãn (45) lên Độ Kiếp Sơ Kỳ (46) trở đi
export const TRIBULATION_TARGET_REALM_INDICES: number[] = [
  46,  // Đại Thừa -> Độ Kiếp
  51,  // Độ Kiếp -> Phi Thăng
  56,  // Phi Thăng -> Chân Tiên
  61,  // Chân Tiên -> Huyền Tiên
  66,  // Huyền Tiên -> Địa Tiên
  71,  // Địa Tiên -> Thiên Tiên
  76,  // Thiên Tiên -> Kim Tiên
  81,  // Kim Tiên -> Thái Ất Kim Tiên
  86,  // Thái Ất Kim Tiên -> Chuẩn Đế
  91,  // Chuẩn Đế -> Đại Đế
  96,  // Đại Đế -> Tiên Đế
  101, // Tiên Đế -> Đế Tổ
];

/**
 * Kiểm tra xem lần đột phá này có phải vượt Thiên Kiếp tương tác không
 * ĐIỀU KIỆN NGHIÊM NGẶT:
 * 1. fromRealmId >= 45 và toRealmId >= 46
 * 2. toRealmId nằm trong TRIBULATION_TARGET_REALM_INDICES
 * 3. toRealmId === fromRealmId + 1 (Mốc đại cảnh giới)
 * 4. TOÀN BỘ TIỂU CẢNH GIỚI BỊ LOẠI TRỪ TUYỆT ĐỐI
 */
export function isTribulationBreakthrough(fromRealmId: number, toRealmId: number): boolean {
  if (fromRealmId < 45 || toRealmId < 46) return false;
  if (toRealmId !== fromRealmId + 1) return false;
  return TRIBULATION_TARGET_REALM_INDICES.includes(toRealmId);
}

// ============================================================
// 2. KHỞI TẠO CẤU HÌNH THIÊN KIẾP (TRIBULATION CONFIG GENERATOR)
// ============================================================
export function getTribulationConfig(
  fromRealmId: number,
  toRealmId: number,
  playerMaxHp: number
): TribulationConfig {
  const fromName = realmsData[fromRealmId]?.name || `Cảnh giới ${fromRealmId}`;
  const toName = realmsData[toRealmId]?.name || `Cảnh giới ${toRealmId}`;

  // 1. Tam Cửu Lôi Kiếp (3 Đợt): Đại Thừa -> Độ Kiếp (45 -> 46)
  if (toRealmId === 46) {
    const waves: TribulationWaveConfig[] = [
      {
        waveIndex: 1,
        name: 'Đệ Nhất Trọng • Xích Dương Chân Lôi',
        baseDamage: Math.floor(playerMaxHp * 0.28),
        isMentalDemonWave: false,
        thunderColor: 'text-amber-400',
        description: 'Tia sét màu vàng cam chói lóa, mang theo dương cương chi khí thử thách đạo thể.',
      },
      {
        waveIndex: 2,
        name: 'Đệ Nhị Trọng • Thanh Hư Tử Lôi',
        baseDamage: Math.floor(playerMaxHp * 0.40),
        isMentalDemonWave: false,
        thunderColor: 'text-purple-400',
        description: 'Lôi đình sắc tím xé rách tầng mây, sấm chớp rền vang rung chuyển ngũ tạng lục phủ.',
      },
      {
        waveIndex: 3,
        name: 'Đệ Tam Trọng • Cửu Thiên Huyền Lôi',
        baseDamage: Math.floor(playerMaxHp * 0.55),
        isMentalDemonWave: true,
        thunderColor: 'text-cyan-300',
        description: 'Tia lôi kiếp cực đại giáng xuống, kèm theo tiếng gọi thì thầm của tâm ma đáy lòng!',
      },
    ];

    return {
      fromRealmId,
      toRealmId,
      fromRealmName: fromName,
      toRealmName: toName,
      tribulationName: 'Tam Cửu Lôi Kiếp (3 Đợt)',
      scaleTitle: 'Tam Cửu Đại Kiếp',
      totalWaves: 3,
      waves,
    };
  }

  // 2. Lục Cửu Lôi Kiếp (6 Đợt): Độ Kiếp -> Phi Thăng (50->51), Phi Thăng -> Chân Tiên (55->56)
  if (toRealmId === 51 || toRealmId === 56) {
    const waves: TribulationWaveConfig[] = [
      { waveIndex: 1, name: 'Đệ Nhất Trọng • Kim Cương Thần Lôi', baseDamage: Math.floor(playerMaxHp * 0.26), description: 'Kim quang chói lọi, khảo nghiệm căn cơ khí huyết tu sĩ.' },
      { waveIndex: 2, name: 'Đệ Nhị Trọng • Bích Lạc U Lôi', baseDamage: Math.floor(playerMaxHp * 0.34), description: 'Tia lôi màu lục bích u ám gào thét xoay vần.' },
      { waveIndex: 3, name: 'Đệ Tam Trọng • Huyền Băng Hàn Lôi', baseDamage: Math.floor(playerMaxHp * 0.42), description: 'Hàn lôi đóng băng kinh mạch, làm chậm chân nguyên lưu chuyển.' },
      { waveIndex: 4, name: 'Đệ Tứ Trọng • Hỗn Nguyên Xích Lôi', baseDamage: Math.floor(playerMaxHp * 0.50), description: 'Hỏa diễm lôi đình thiêu đốt hộ thể cương khí.' },
      { waveIndex: 5, name: 'Đệ Ngũ Trọng • Tâm Ma Huyễn Lôi', baseDamage: Math.floor(playerMaxHp * 0.60), isMentalDemonWave: true, description: 'Ảo tượng tiền kiếp bùng nổ, tâm ma cắn nuốt thần thức!' },
      { waveIndex: 6, name: 'Đệ Lục Trọng • Diệt Thế Tử Lôi', baseDamage: Math.floor(playerMaxHp * 0.72), isMentalDemonWave: false, description: 'Đạo lôi kiếp cuối cùng mang theo thiên phạt chí cao giáng thẳng xuống đỉnh đầu!' },
    ];

    return {
      fromRealmId,
      toRealmId,
      fromRealmName: fromName,
      toRealmName: toName,
      tribulationName: 'Lục Cửu Lôi Kiếp (6 Đợt)',
      scaleTitle: 'Lục Cửu Tiên Kiếp',
      totalWaves: 6,
      waves,
    };
  }

  // 3. Hỗn Độn Diệt Thế Kiếp / Vạn Cổ Quy Nhất Kiếp (9 Đợt Cực Hạn): Đế Cảnh (86, 91, 96, 101)
  if (toRealmId >= 86) {
    const waves: TribulationWaveConfig[] = [
      { waveIndex: 1, name: 'Đệ Nhất Trọng • Thái Sơ Hắc Lôi', baseDamage: Math.floor(playerMaxHp * 0.35), description: 'Hắc lôi hủy diệt hư không, chôn vùi vạn vật.' },
      { waveIndex: 2, name: 'Đệ Nhị Trọng • Cửu U Phong Hồn Lôi', baseDamage: Math.floor(playerMaxHp * 0.45), description: 'U minh khí tức ăn mòn nguyên thần.' },
      { waveIndex: 3, name: 'Đệ Tam Trọng • Luân Hồi Tru Tiên Kiếp', baseDamage: Math.floor(playerMaxHp * 0.52), description: 'Vòng xoáy luân hồi giáng thế khảo nghiệm đạo tâm.' },
      { waveIndex: 4, name: 'Đệ Tứ Trọng • Diệt Thế Hỗn Độn Kiếp', baseDamage: Math.floor(playerMaxHp * 0.60), description: 'Khí hỗn độn vỡ vụn thiên địa linh căn.' },
      { waveIndex: 5, name: 'Đệ Ngũ Trọng • Ma Huyễn Hắc Lôi (Tâm Ma)', baseDamage: Math.floor(playerMaxHp * 0.68), isMentalDemonWave: true, description: 'Đế cảnh tâm ma hiện hình thành hình bóng tà ác vô song!' },
      { waveIndex: 6, name: 'Đệ Lục Trọng • Thái Hư Cực Quang Lôi', baseDamage: Math.floor(playerMaxHp * 0.75), description: 'Bạch quang xé rách không gian vô tận.' },
      { waveIndex: 7, name: 'Đệ Thất Trọng • Bất Diệt Thiên Phạt Lôi', baseDamage: Math.floor(playerMaxHp * 0.82), description: 'Quy tắc thiên đạo nghiền ép đế khu.' },
      { waveIndex: 8, name: 'Đệ Bát Trọng • Hồng Hoang Tổ Lôi', baseDamage: Math.floor(playerMaxHp * 0.90), description: 'Tia chớp thái cổ giáng xuống như muốn tái tạo thiên địa.' },
      { waveIndex: 9, name: 'Đệ Cửu Trọng • Vạn Cổ Quy Nhất Đế Kiếp', baseDamage: Math.floor(playerMaxHp * 1.05), isMentalDemonWave: true, description: 'Đạo lôi kiếp chí tôn vạn cổ! Thành thì vấn đỉnh chí tôn, bại thì vạn kiếp bất phục!' },
    ];

    return {
      fromRealmId,
      toRealmId,
      fromRealmName: fromName,
      toRealmName: toName,
      tribulationName: 'Vạn Cổ Hỗn Độn Diệt Thế Kiếp (9 Đợt Cực Hạn)',
      scaleTitle: 'Đế Cảnh Cực Hạn Kiếp',
      totalWaves: 9,
      waves,
    };
  }

  // 4. Cửu Cửu Lôi Kiếp (9 Đợt): Tiên Giới (61 -> 81)
  const default9Waves: TribulationWaveConfig[] = [
    { waveIndex: 1, name: 'Đệ Nhất Trọng • Tiên Thiên Thanh Lôi', baseDamage: Math.floor(playerMaxHp * 0.28), description: 'Lôi quang thanh sắc tinh thuần giáng lâm.' },
    { waveIndex: 2, name: 'Đệ Nhị Trọng • Huyền Minh Bích Lôi', baseDamage: Math.floor(playerMaxHp * 0.35), description: 'Thâm u lôi hỏa rực cháy quanh thân.' },
    { waveIndex: 3, name: 'Đệ Tam Trọng • Tam Muội Xích Lôi', baseDamage: Math.floor(playerMaxHp * 0.42), description: 'Hỏa lôi đan xen thiêu đốt kim đan nguyên thần.' },
    { waveIndex: 4, name: 'Đệ Tứ Trọng • Thái Cực Tử Lôi', baseDamage: Math.floor(playerMaxHp * 0.50), description: 'Tử lôi chấn động hư không mười phương.' },
    { waveIndex: 5, name: 'Đệ Ngũ Trọng • Ngũ Hành Diệt Kiếp', baseDamage: Math.floor(playerMaxHp * 0.58), description: 'Ngũ hành lôi điện luân chuyển không ngừng.' },
    { waveIndex: 6, name: 'Đệ Lục Trọng • Thái Hư Hóa Kiếp Lôi', baseDamage: Math.floor(playerMaxHp * 0.65), description: 'Lực lượng không gian vặn xoắn hộ thân khí.' },
    { waveIndex: 7, name: 'Đệ Thất Trọng • Tâm Ma Vô Ảnh Lôi', baseDamage: Math.floor(playerMaxHp * 0.72), isMentalDemonWave: true, description: 'Vô thanh vô tức, đánh thẳng vào căn nguyên thức hải!' },
    { waveIndex: 8, name: 'Đệ Bát Trọng • Hỗn Độn Thần Kiếp', baseDamage: Math.floor(playerMaxHp * 0.82), description: 'Lôi đình hóa thành thần binh hạ giới trảm diệt.' },
    { waveIndex: 9, name: 'Đệ Cửu Trọng • Tiên Đạo Tru Diệt Lôi', baseDamage: Math.floor(playerMaxHp * 0.95), description: 'Đạo lôi kiếp kết thúc, mở ra cánh cửa Chân Tiên!' },
  ];

  return {
    fromRealmId,
    toRealmId,
    fromRealmName: fromName,
    toRealmName: toName,
    tribulationName: 'Cửu Cửu Lôi Kiếp (9 Đợt)',
    scaleTitle: 'Cửu Cửu Tiên Kiếp',
    totalWaves: 9,
    waves: default9Waves,
  };
}

// ============================================================
// 3. KIỂM TRA ĐIỀU KIỆN THỰC THI QUYẾT SÁCH (CAN PERFORM ACTION)
// ============================================================
export function canPerformTribulationAction(
  action: TribulationActionType,
  player: PlayerStats,
  currentMp: number,
  maxMp: number
): { ok: boolean; reason?: string; consumesText?: string } {
  switch (action) {
    case 'body_tank':
      return { ok: true, consumesText: 'Trừ HP trực tiếp, tôi luyện nhục thân' };

    case 'array_shield': {
      const requiredMp = Math.floor(maxMp * 0.15);
      if (currentMp < requiredMp) {
        return { ok: false, reason: `Cần ${requiredMp.toLocaleString()} Chân Nguyên (MP)` };
      }
      if ((player.linhThach || 0) < 1000) {
        return { ok: false, reason: 'Cần 1.000 Hạ Phẩm Linh Thạch' };
      }
      return { ok: true, consumesText: '15% MP tối đa + 1.000 Linh Thạch' };
    }

    case 'talisman_sacrifice': {
      const talismans = player.inventory?.talismans || [];
      const pills = player.inventory?.pills || [];
      const hasTiLoiPhu = talismans.some((t: any) =>
        (t.recipeId === 'recipe_ti_loi_dan_kiep' || t.id?.includes('ti_loi') || t.type === 'breakthrough') && t.quantity > 0
      );
      const hasDoKiepDan = pills.some((p: any) =>
        (p.id?.includes('do_kiep') || p.id?.includes('pha_canh') || p.id?.includes('truc_co')) && p.quantity > 0
      );

      if (!hasTiLoiPhu && !hasDoKiepDan) {
        return { ok: false, reason: 'Thiếu Tị Lôi Dẫn Kiếp Phù hoặc Độ Kiếp Đan' };
      }
      return { ok: true, consumesText: 'Tiêu hao 1 lá Tị Lôi Phù hoặc 1 viên Đan Dược' };
    }

    case 'soul_focus': {
      const soulPower = player.soulState?.cultivation?.currentSoulPower || player.thanThuc || player.tamCanh || 50;
      if (soulPower < 20) {
        return { ok: false, reason: 'Thần Niệm không đủ (Cần 20)' };
      }
      return { ok: true, consumesText: 'Tiêu hao 20 Thần Niệm củng cố thức hải' };
    }
  }
}

// ============================================================
// 4. KẾT TOÁN SÁT THƯƠNG ĐỢT LÔI KIẾP (RESOLVE WAVE)
// ============================================================
export interface ResolveWaveResult {
  damageTaken: number;
  newHp: number;
  newMp: number;
  survived: boolean;
  permanentDefGained: number;
  permanentDmgReductionGained: number;
  consumedText?: string;
  logText: string;
  updatedPlayer: PlayerStats;
}

export function resolveTribulationWave(
  wave: TribulationWaveConfig,
  action: TribulationActionType,
  player: PlayerStats,
  currentHp: number,
  maxHp: number,
  currentMp: number,
  maxMp: number
): ResolveWaveResult {
  const cStats = calculateCombatStats(player);
  let updatedPlayer = { ...player };
  let damageTaken = 0;
  let newHp = currentHp;
  let newMp = currentMp;
  let permanentDefGained = 0;
  let permanentDmgReductionGained = 0;
  let consumedText = '';
  let logText = '';

  switch (action) {
    // ── 1. NHỤC THÂN NGẠNH KHÁNG ──────────────────────────────
    case 'body_tank': {
      // Giảm thương dựa trên Căn Cốt, Phòng Ngự, Nhục Thân (Physique)
      const canCot = player.canCot || 50;
      const def = cStats.def || 100;
      const dmgReduction = Math.min(60, cStats.dmgReduction || 0);
      const physiqueLvl = player.physiqueState?.cultivation?.currentStage || 1;

      // Hệ số giảm thương tự nhiên của thể phách
      const mitigation = Math.min(0.65, (canCot / 500) + (def / 2500) + (dmgReduction / 100) + (physiqueLvl * 0.02));
      damageTaken = Math.max(10, Math.floor(wave.baseDamage * (1 - mitigation)));
      newHp = Math.max(0, currentHp - damageTaken);

      const survived = newHp > 0;
      if (survived) {
        // Phần thưởng ngạnh kháng thành công: +5 Phòng Ngự và +0.2% Miễn Thương vĩnh viễn
        permanentDefGained = 5;
        permanentDmgReductionGained = 0.2;
        updatedPlayer.phongNgu = (updatedPlayer.phongNgu || 0) + 5;
        logText = `🥋 [NHỤC THÂN NGẠNH KHÁNG] Dùng thể phách nghênh đón 【${wave.name}】! Hấp thụ sấm sét gột rửa kinh mạch, chịu ${damageTaken.toLocaleString()} sát thương. Đạo thể thăng hoa: +5 Phòng Ngự và +0.2% Miễn Thương vĩnh viễn!`;
      } else {
        logText = `⚡ 【${wave.name}】 giáng xuống với uy lực hủy thiên diệt địa! Thể phách không chịu nổi cuồng lôi, chịu ${damageTaken.toLocaleString()} sát thương chí mạng!`;
      }

      return {
        damageTaken,
        newHp,
        newMp,
        survived,
        permanentDefGained,
        permanentDmgReductionGained,
        consumedText: 'Trừ Khí Huyết trực tiếp',
        logText,
        updatedPlayer,
      };
    }

    // ── 2. KHAI MỞ HỘ THÂN TRẬN PHÁP ──────────────────────────
    case 'array_shield': {
      const requiredMp = Math.floor(maxMp * 0.15);
      newMp = Math.max(0, currentMp - requiredMp);
      updatedPlayer.linhThach = Math.max(0, (player.linhThach || 0) - 1000);

      // Nếu có trang bị Trận Bàn Bản Mệnh: triệt tiêu 75% sát thương; nếu không: triệt tiêu 60%
      const hasEquippedFormation = Boolean(player.equippedFormation);
      const shieldRatio = hasEquippedFormation ? 0.75 : 0.60;
      damageTaken = Math.max(10, Math.floor(wave.baseDamage * (1 - shieldRatio)));
      newHp = Math.max(0, currentHp - damageTaken);

      const survived = newHp > 0;
      logText = `🛡️ [HỘ THÂN TRẬN PHÁP] Vận chuyển Chân Nguyên kích hoạt trận bàn ${hasEquippedFormation ? `【${player.equippedFormation?.name}】` : 'kết giới'}, triệt tiêu ${Math.round(shieldRatio * 100)}% uy lực của 【${wave.name}】! Chịu tổn thất ${damageTaken.toLocaleString()} HP.`;

      return {
        damageTaken,
        newHp,
        newMp,
        survived,
        permanentDefGained: 0,
        permanentDmgReductionGained: 0,
        consumedText: `-${requiredMp.toLocaleString()} MP, -1.000 Linh Thạch`,
        logText,
        updatedPlayer,
      };
    }

    // ── 3. HIẾN TẾ TỊ LÔI PHÙ / ĐỘ KIẾP ĐAN ───────────────────
    case 'talisman_sacrifice': {
      // Tìm và trừ 1 bùa hoặc 1 đan dược
      let usedItemName = 'Pháp Bảo Hộ Thân';
      let updatedTalismans = [...(player.inventory?.talismans || [])];
      let updatedPills = [...(player.inventory?.pills || [])];

      const tIdx = updatedTalismans.findIndex((t: any) =>
        (t.recipeId === 'recipe_ti_loi_dan_kiep' || t.id?.includes('ti_loi') || t.type === 'breakthrough') && t.quantity > 0
      );

      if (tIdx >= 0) {
        usedItemName = updatedTalismans[tIdx].name;
        updatedTalismans[tIdx].quantity -= 1;
        updatedTalismans = updatedTalismans.filter(t => t.quantity > 0);
      } else {
        const pIdx = updatedPills.findIndex((p: any) =>
          (p.id?.includes('do_kiep') || p.id?.includes('pha_canh') || p.id?.includes('truc_co')) && p.quantity > 0
        );
        if (pIdx >= 0) {
          usedItemName = updatedPills[pIdx].name;
          updatedPills[pIdx].quantity -= 1;
          updatedPills = updatedPills.filter(p => p.quantity > 0);
        }
      }

      updatedPlayer.inventory = {
        ...player.inventory,
        pills: updatedPills,
        herbs: player.inventory?.herbs ?? [],
        talismans: updatedTalismans,
      } as any;

      // Hóa giải 100% sát thương và hồi phục nhẹ 10% HP!
      damageTaken = 0;
      const healAmount = Math.floor(maxHp * 0.10);
      newHp = Math.min(maxHp, currentHp + healAmount);

      logText = `📜 [HIẾN TẾ TỊ LÔI BẢO VẬT] Đốt cháy 【${usedItemName}】 ngưng kết thiên đạo dẫn lôi trận! Hóa giải 100% uy lực của 【${wave.name}】 và hồi phục +${healAmount.toLocaleString()} HP!`;

      return {
        damageTaken,
        newHp,
        newMp,
        survived: true,
        permanentDefGained: 0,
        permanentDmgReductionGained: 0,
        consumedText: `Tiêu hao 1x ${usedItemName}`,
        logText,
        updatedPlayer,
      };
    }

    // ── 4. THẦN HỒN ĐỊNH PHÁCH ────────────────────────────────
    case 'soul_focus': {
      // Trừ 20 Thần Niệm
      if (updatedPlayer.soulState?.cultivation) {
        updatedPlayer.soulState = {
          ...updatedPlayer.soulState,
          cultivation: {
            ...updatedPlayer.soulState.cultivation,
            currentSoulPower: Math.max(0, (updatedPlayer.soulState.cultivation.currentSoulPower || 50) - 20),
          },
        };
      }

      const stability = player.soulState?.mindState?.stability || player.tamCanh || 80;

      if (wave.isMentalDemonWave) {
        // Đợt lôi kiếp có tâm ma: Thần Hồn Định Phách cực kỳ hiệu quả, triệt tiêu 85% sát thương
        damageTaken = Math.max(10, Math.floor(wave.baseDamage * 0.15));
        newHp = Math.max(0, currentHp - damageTaken);
        logText = `👁️ [THẦN HỒN ĐỊNH PHÁP] Vận chuyển Thần Niệm gia trì thức hải! Ảo cảnh tâm ma trong 【${wave.name}】 lập tức tan biến như bọt nước! Triệt tiêu 85% sát thương, chỉ nhận ${damageTaken.toLocaleString()} chấn động nhẹ.`;
      } else {
        // Đợt lôi kiếp thường: giảm 40% sát thương nhờ màn chắn ý niệm
        const resist = Math.min(0.55, 0.35 + (stability / 500));
        damageTaken = Math.max(10, Math.floor(wave.baseDamage * (1 - resist)));
        newHp = Math.max(0, currentHp - damageTaken);
        logText = `🔮 [THẦN HỒN ĐỊNH PHÁP] Tỏa xuất uy áp Thần Thức ngưng tụ hộ tâm thuẫn, hóa giải ${Math.round(resist * 100)}% sát thương của 【${wave.name}】! Chịu ${damageTaken.toLocaleString()} sát thương.`;
      }

      return {
        damageTaken,
        newHp,
        newMp,
        survived: newHp > 0,
        permanentDefGained: 0,
        permanentDmgReductionGained: 0,
        consumedText: 'Tiêu hao 20 Thần Niệm',
        logText,
        updatedPlayer,
      };
    }
  }
}

// ============================================================
// 5. HOÀN TẤT THÀNH CÔNG THIÊN KIẾP (FINALIZE VICTORY)
// ============================================================
export function finalizeTribulationVictory(
  player: PlayerStats,
  toRealmId: number,
  permanentDefBonus: number,
  permanentDmgReduction: number
): { updatedPlayer: PlayerStats; logTitle: string; logContent: string; toastMsg: string } {
  const targetRealm = realmsData[toRealmId];
  const maxHp = player.maxKhiHuyet || 10000;
  const maxMp = player.maxLinhLuc || 10000;

  // Cập nhật cảnh giới mới, thọ nguyên mới và phục hồi 100% HP & MP
  const newMaxLifespan = getBaseLifespanForRealm(toRealmId) + (player.lifespanPillsUsed || 0);
  const updatedPlayer: PlayerStats = {
    ...player,
    currentRealm: toRealmId,
    maxLifespan: newMaxLifespan,
    khiHuyet: maxHp,
    linhLuc: maxMp,
    phongNgu: (player.phongNgu || 0) + permanentDefBonus,
    tuVi: targetRealm?.breakthrough?.rewardOnSuccess?.tuVi
      ? (player.tuVi || 0) + targetRealm.breakthrough.rewardOnSuccess.tuVi
      : player.tuVi,
    linhThach: targetRealm?.breakthrough?.rewardOnSuccess?.linhThach
      ? (player.linhThach || 0) + targetRealm.breakthrough.rewardOnSuccess.linhThach
      : player.linhThach,
    danhVong: targetRealm?.breakthrough?.rewardOnSuccess?.danhVong
      ? (player.danhVong || 0) + targetRealm.breakthrough.rewardOnSuccess.danhVong
      : player.danhVong,
  };

  const realmName = targetRealm?.name || `Cảnh giới ${toRealmId}`;
  const logTitle = `⚡ VƯỢT THIÊN KIẾP THÀNH CÔNG • BƯỚC VÀO [${realmName.toUpperCase()}]!`;
  const logContent = `Trời quang mây tạnh, tử khí đông lai vạn dặm! Sau khi vượt qua chín tầng lôi kiếp sinh tử, đạo thể ngươi thoát thai hoán cốt, chính thức bước vào 【${realmName}】! Phục hồi đầy đủ 100% Khí Huyết và Chân Nguyên.${permanentDefBonus > 0 ? ` Tôi thể thành công tích lũy thêm +${permanentDefBonus} Phòng Ngự và +${permanentDmgReduction.toFixed(1)}% Miễn Thương vĩnh viễn!` : ''}`;
  const toastMsg = `⚡ Độ kiếp thành công! Chúc mừng đạo hữu bước vào ${realmName}!`;

  return { updatedPlayer, logTitle, logContent, toastMsg };
}

// ============================================================
// 6. THẤT BẠI THIÊN KIẾP (FINALIZE DEFEAT)
// ============================================================
export function finalizeTribulationDefeat(
  player: PlayerStats,
  currentWaveName: string
): { updatedPlayer: PlayerStats; logTitle: string; logContent: string; toastMsg: string } {
  const maxHp = player.maxKhiHuyet || 10000;
  const currentRealmData = realmsData[player.currentRealm || 0];

  // Giữ nguyên cảnh giới cũ, HP về 10%, mất 20% tu vi hiện có (được giảm bởi Hộ Sơn Đại Trận), tăng Ma Tính +15%
  const guardianArray = (player.sectState || player.sectData)?.guardianArray;
  const tribulationReduction = guardianArray?.buffs?.tribulationInjuryReduction || 0;
  const effectiveLossRatio = 0.20 * (1 - Math.min(0.9, tribulationReduction / 100));
  const tuViLoss = Math.floor((player.tuVi || 0) * effectiveLossRatio);
  const remainingTuVi = Math.max(0, (player.tuVi || 0) - tuViLoss);

  let updatedSoulState = player.soulState;
  if (updatedSoulState?.mindState) {
    updatedSoulState = {
      ...updatedSoulState,
      mindState: {
        ...updatedSoulState.mindState,
        demonCorruption: Math.min(100, (updatedSoulState.mindState.demonCorruption || 0) + 15),
      },
    };
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    khiHuyet: Math.floor(maxHp * 0.10),
    tuVi: remainingTuVi,
    soulState: updatedSoulState,
  };

  const realmName = currentRealmData?.name || 'Cảnh giới hiện tại';
  const reductionNote = tribulationReduction > 0 ? ` (Hộ Sơn Trận hộ thể giảm ${tribulationReduction}% tổn thất)` : '';
  const logTitle = `💥 ĐỘ KIẾP THẤT BẠI • TRỌNG THƯƠNG TRƯỚC ${currentWaveName.toUpperCase()}!`;
  const logContent = `Thiên uy khó dò, đạo thể ngươi bị sấm sét đánh nứt toác trước 【${currentWaveName}】! Độ kiếp thất bại, sinh mệnh nguy nan (Khí Huyết rơi về 10%), tổn thất ${tuViLoss.toLocaleString()} Tu Vi${reductionNote} và Ma Tính thức hải tăng thêm +15%! Cần tĩnh dưỡng điều tức trước khi tái chiến thiên kiếp.`;
  const toastMsg = `❌ Độ kiếp thất bại! Tổn thất ${tuViLoss.toLocaleString()} Tu Vi và bị trọng thương.${reductionNote}`;

  return { updatedPlayer, logTitle, logContent, toastMsg };
}
