// lib/lifespan-logic.ts
// Business Logic & Engine Tính Toán cho Hệ Thống "Tuế Nguyệt Bế Quan & Thọ Nguyên (Lifespan & Deep Cultivation)"

import { PlayerStats } from '@/lib/types';
import {
  DeepCultivateUnit,
  DeepCultivateEstimate,
  DeepCultivateResult,
  LifespanPill,
} from '@/lib/types/lifespan';
import { calculateCombatStats } from '@/lib/destiny-data';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

// ============================================================
// 1. TÍNH THỌ NGUYÊN GỐC THEO CẢNH GIỚI (BASE LIFESPAN BY REALM)
// ============================================================
export function getBaseLifespanForRealm(realmIndex: number): number {
  if (realmIndex <= 0) return 100; // Phàm Nhân: 100 Tuổi

  // Luyện Khí (Index 1 - 10): +50 năm = 150
  if (realmIndex <= 10) return 150;

  // Trúc Cơ (Index 11 - 15): +100 năm = 250
  if (realmIndex <= 15) return 250;

  // Kim Đan (Index 16 - 20): +300 năm = 550
  if (realmIndex <= 20) return 550;

  // Nguyên Anh (Index 21 - 25): +500 năm = 1,050
  if (realmIndex <= 25) return 1050;

  // Hóa Thần (Index 26 - 30): +1,500 năm = 2,550
  if (realmIndex <= 30) return 2550;

  // Luyện Hư (Index 31 - 35): +3,000 năm = 5,550
  if (realmIndex <= 35) return 5550;

  // Hợp Thể (Index 36 - 40): +5,000 năm = 10,550
  if (realmIndex <= 40) return 10550;

  // Đại Thừa (Index 41 - 45): +8,000 năm = 18,550
  if (realmIndex <= 45) return 18550;

  // Độ Kiếp (Index 46 - 50): +7,000 năm = 25,550
  if (realmIndex <= 50) return 25550;

  // Tiên Giới (Chân Tiên trở lên - Index 51+): Vô Hạn / Vĩnh Sinh (99,999,999 năm)
  return 99999999;
}

// ============================================================
// 2. DANH MỤC THỌ NGUYÊN ĐAN (LIFESPAN EXTENSION PILLS)
// ============================================================
export const LIFESPAN_PILLS: Record<string, LifespanPill> = {
  pill_tho_nguyen_1: {
    id: 'pill_tho_nguyen_1',
    name: 'Nhất Giai Duyên Thọ Đan',
    grade: 'Hạ Phẩm',
    lifespanBonusYears: 50,
    maxUseCount: 3,
    description: 'Luyện chế từ Bách Niên Linh Dược, bồi bổ nguyên khí, gia tăng thêm 50 năm thọ mệnh.',
  },
  pill_tho_nguyen_2: {
    id: 'pill_tho_nguyen_2',
    name: 'Nhị Giai Cố Bản Diên Niên Đan',
    grade: 'Trung Phẩm',
    lifespanBonusYears: 100,
    maxUseCount: 3,
    description: 'Uẩn dưỡng ngũ tạng lục phủ, kéo dài thêm 100 năm dương thọ cho người tu tiên.',
  },
  pill_tho_nguyen_3: {
    id: 'pill_tho_nguyen_3',
    name: 'Tam Giai Vạn Thọ Vô Cương Đan',
    grade: 'Thượng Phẩm',
    lifespanBonusYears: 300,
    maxUseCount: 2,
    description: 'Đan dược trân quý thời thượng cổ, kéo dài 300 năm thọ nguyên cho tu sĩ trước khi tọa hóa.',
  },
  pill_tho_nguyen_4: {
    id: 'pill_tho_nguyen_4',
    name: 'Tứ Giai Bất Lão Trường Sinh Đan',
    grade: 'Cực Phẩm',
    lifespanBonusYears: 1000,
    maxUseCount: 1,
    description: 'Thần đan nghịch thiên cải mệnh, tái tạo sinh cơ mục nát, gia tăng thêm 1,000 năm thọ nguyên vô song!',
  },
};

// ============================================================
// 3. TÍNH THỌ NGUYÊN TỐI ĐA THỰC TẾ CỦA NHÂN VẬT
// ============================================================
export function calculateEffectiveLifespan(player: PlayerStats): number {
  const base = getBaseLifespanForRealm(player.currentRealm || 0);
  const pillBonus = player.lifespanPillsUsed || 0;
  return base + pillBonus;
}

// ============================================================
// 4. DỰ TOÁN HIỆU QUẢ TUẾ NGUYỆT BẾ QUAN (ESTIMATE CALCULATION)
// ============================================================
export function calculateDeepCultivationEstimate(
  player: PlayerStats,
  amount: number,
  unit: DeepCultivateUnit
): DeepCultivateEstimate {
  const currentAge = player.age || 16;
  const maxLifespan = calculateEffectiveLifespan(player);

  // Quy đổi thời gian bế quan sang năm
  let yearsAdded = 0;
  if (unit === 'days') {
    yearsAdded = amount / 365;
  } else if (unit === 'months') {
    yearsAdded = (amount * 30) / 365;
  } else {
    yearsAdded = amount;
  }

  const newAge = Number((currentAge + yearsAdded).toFixed(2));
  const isLifespanExceeded = newAge > maxLifespan;
  const isToaHoaWarning = (maxLifespan - newAge) < 5; // Cảnh báo nếu thọ nguyên còn dưới 5 năm

  // 1. Tốc độ hấp thụ linh khí cơ sở (Tu Vi mỗi năm bế quan)
  const cStats = calculateCombatStats(player);
  const canCot = player.canCot || 50;
  const ngoTinh = player.ngoTinh || 50;

  // Hệ số tu luyện từ Căn Cốt, Ngộ Tính, Công Pháp, Động Phủ
  const statMultiplier = 1 + (canCot / 200) + (ngoTinh / 150);
  const stanceBonus = 1.0;

  // Cân bằng Tu Vi theo năm: Mỗi 1 năm bế quan đem lại bước tiến vượt bậc
  // 1 Năm in-game = 365 Ngày. 1 Ngày = 60s tương tác thực.
  const baseRatePerSec = Math.max(5, (cStats.atk || 100) * 0.05 + canCot * 0.2);
  const tuViPerYear = Math.floor(baseRatePerSec * 60 * 365 * 0.08 * statMultiplier * stanceBonus);
  const tuViGained = Math.max(10, Math.floor(tuViPerYear * yearsAdded));

  // 2. Chi phí tài nguyên:
  // 1 Năm = 100 Linh Thạch HOẶC 1 Tích Cốc Đan
  const costLinhThach = Math.max(1, Math.ceil(yearsAdded * 100));
  const costTichCocDan = Math.ceil(yearsAdded);

  const pills = player.inventory?.pills || [];
  const tichCocPill = pills.find((p: any) => p.id === 'pill_tich_coc' || p.name?.includes('Tích Cốc'));
  const tichCocCount = tichCocPill?.quantity || 0;

  const hasEnoughLinhThach = (player.linhThach || 0) >= costLinhThach;
  const hasEnoughTichCocDan = tichCocCount >= costTichCocDan;
  const canAfford = hasEnoughLinhThach || hasEnoughTichCocDan;

  let reason = '';
  if (isLifespanExceeded) {
    reason = `Thời gian bế quan vượt quá thọ nguyên còn lại! Sẽ bị [Tọa Hóa] trước khi xuất quan!`;
  } else if (!canAfford) {
    reason = `Thiếu tài nguyên! Cần ${costLinhThach.toLocaleString()} Linh Thạch hoặc ${costTichCocDan} Tích Cốc Đan.`;
  }

  return {
    yearsAdded: Number(yearsAdded.toFixed(2)),
    currentAge,
    newAge,
    maxLifespan,
    tuViGained,
    costLinhThach,
    costTichCocDan,
    canAfford,
    isLifespanExceeded,
    isToaHoaWarning,
    reason: reason || undefined,
  };
}

// ============================================================
// 5. THỰC THI TUẾ NGUYỆT BẾ QUAN (EXECUTE DEEP CULTIVATION)
// ============================================================
export function executeDeepCultivation(
  player: PlayerStats,
  amount: number,
  unit: DeepCultivateUnit
): { updatedPlayer: PlayerStats; result: DeepCultivateResult } {
  const estimate = calculateDeepCultivationEstimate(player, amount, unit);

  if (estimate.isLifespanExceeded) {
    return {
      updatedPlayer: player,
      result: {
        success: false,
        yearsAdded: 0,
        newAge: player.age || 16,
        tuViGained: 0,
        linhThachConsumed: 0,
        tichCocDanConsumed: 0,
        isToaHoaTriggered: true,
        logTitle: '⚠️ KHÔNG THỂ BẾ QUAN • NGUY CƠ TỌA HÓA!',
        logContent: `Thọ nguyên còn lại không đủ để duy trì bế quan ${amount} ${unit === 'days' ? 'ngày' : unit === 'months' ? 'tháng' : 'năm'}! Nếu cưỡng ép bế quan sẽ tọa hóa trong động phủ!`,
      },
    };
  }

  if (!estimate.canAfford) {
    return {
      updatedPlayer: player,
      result: {
        success: false,
        yearsAdded: 0,
        newAge: player.age || 16,
        tuViGained: 0,
        linhThachConsumed: 0,
        tichCocDanConsumed: 0,
        logTitle: '❌ THIẾU TÀI NGUYÊN BẾ QUAN',
        logContent: `Không đủ Linh Thạch hoặc Tích Cốc Đan để duy trì bế quan dài hạn! Cần tối thiểu ${estimate.costLinhThach.toLocaleString()} Linh Thạch.`,
      },
    };
  }

  // Khấu trừ tài nguyên: Ưu tiên Tích Cốc Đan nếu đủ, nếu không trừ Linh Thạch
  let updatedPlayer = { ...player };
  let linhThachConsumed = 0;
  let tichCocDanConsumed = 0;

  const pills = player.inventory?.pills || [];
  const tichCocIdx = pills.findIndex((p: any) => p.id === 'pill_tich_coc' || p.name?.includes('Tích Cốc'));

  if (tichCocIdx >= 0 && pills[tichCocIdx].quantity >= estimate.costTichCocDan) {
    // Trừ Tích Cốc Đan
    const updatedPills = [...pills];
    updatedPills[tichCocIdx] = {
      ...updatedPills[tichCocIdx],
      quantity: updatedPills[tichCocIdx].quantity - estimate.costTichCocDan,
    };
    tichCocDanConsumed = estimate.costTichCocDan;
    updatedPlayer.inventory = {
      ...player.inventory,
      pills: updatedPills.filter((p) => p.quantity > 0),
      herbs: player.inventory?.herbs || [],
      talismans: player.inventory?.talismans || [],
    } as any;
  } else {
    // Trừ Linh Thạch
    linhThachConsumed = estimate.costLinhThach;
    updatedPlayer.linhThach = Math.max(0, (player.linhThach || 0) - linhThachConsumed);
  }

  // Tăng tuổi và tu vi
  const newAge = estimate.newAge;
  const newTuVi = (player.tuVi || 0) + estimate.tuViGained;
  updatedPlayer.age = newAge;
  updatedPlayer.tuVi = newTuVi;
  updatedPlayer.maxLifespan = estimate.maxLifespan;

  const unitName = unit === 'days' ? 'ngày' : unit === 'months' ? 'tháng' : 'năm';
  const logTitle = `⏳ TUẾ NGUYỆT BẾ QUAN • XUẤT QUAN SAU ${amount} ${unitName.toUpperCase()}!`;
  const logContent = `Thiên địa du du, sơn trung vô lịch nhật, hàn tận bất tri niên! Ngươi tại động phủ bế quan ${amount} ${unitName} (${estimate.yearsAdded.toFixed(1)} năm tuổi thọ trôi qua). Hồng trần lắng đọng, đạo hạnh đại tăng: +${estimate.tuViGained.toLocaleString()} Tu Vi! Tuổi thọ hiện tại: ${newAge}/${estimate.maxLifespan} Tuổi.${estimate.isToaHoaWarning ? ' ⚠️ Cảnh báo: Thọ nguyên sắp cạn, cần mau chóng đột phá hoặc dùng Thọ Nguyên Đan!' : ''}`;

  return {
    updatedPlayer,
    result: {
      success: true,
      yearsAdded: estimate.yearsAdded,
      newAge,
      tuViGained: estimate.tuViGained,
      linhThachConsumed,
      tichCocDanConsumed,
      isToaHoaTriggered: false,
      logTitle,
      logContent,
    },
  };
}

// ============================================================
// 6. SỬ DỤNG THỌ NGUYÊN ĐAN GIA HẠN DƯƠNG THỌ
// ============================================================
export function useLifespanPill(
  player: PlayerStats,
  pillId: string
): { success: boolean; updatedPlayer: PlayerStats; message: string } {
  const pillConfig = LIFESPAN_PILLS[pillId];
  if (!pillConfig) {
    return { success: false, updatedPlayer: player, message: 'Đan dược không tồn tại!' };
  }

  const pills = player.inventory?.pills || [];
  const pIdx = pills.findIndex((p: any) => p.id === pillId && p.quantity > 0);
  if (pIdx < 0) {
    return { success: false, updatedPlayer: player, message: `Trong túi không có 【${pillConfig.name}】!` };
  }

  // Khấu trừ 1 viên đan
  const updatedPills = [...pills];
  updatedPills[pIdx].quantity -= 1;

  const bonusYears = pillConfig.lifespanBonusYears;
  const currentPillBonus = player.lifespanPillsUsed || 0;
  const newPillBonus = currentPillBonus + bonusYears;
  const newMaxLifespan = getBaseLifespanForRealm(player.currentRealm || 0) + newPillBonus;

  const updatedPlayer: PlayerStats = {
    ...player,
    lifespanPillsUsed: newPillBonus,
    maxLifespan: newMaxLifespan,
    inventory: {
      ...player.inventory,
      pills: updatedPills.filter((p) => p.quantity > 0),
      herbs: player.inventory?.herbs || [],
      talismans: player.inventory?.talismans || [],
    } as any,
  };

  return {
    success: true,
    updatedPlayer,
    message: `💊 Dùng 【${pillConfig.name}】! Dược lực ngưng tụ sinh mệnh chi nguyên, gia tăng thêm +${bonusYears} năm thọ nguyên (Thọ nguyên tối đa: ${newMaxLifespan} tuổi)!`,
  };
}
