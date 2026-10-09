// lib/divination-data.ts
// Dữ liệu Bảng Đoán Mệnh Thiên Cơ, Gieo Quẻ Bát Quái & Thuật Nghịch Thiên Cải Mệnh

import { HexagramType, DailyDivinationState, PlayerStats } from '@/lib/types';
import { DESTINY_REROLL_PILL_ID } from '@/lib/destiny-data';

export interface HexagramConfig {
  id: HexagramType;
  name: string;
  hexagramName: string;
  tag: string;
  badgeText: string;
  badgeClass: string;
  color: string;
  bgGradient: string;
  borderClass: string;
  poetry: string;
  description: string;
  buffs: string[];
  speedBonus: number;        // e.g. 0.30 for +30%
  breakthroughBonus: number; // e.g. 20 for +20%
  bossDropBonus: number;     // e.g. 0.10 for +10%
  tamMaRiskMod: number;      // e.g. +0.25 or -0.20
}

export const HEXAGRAM_CONFIGS: Record<HexagramType, HexagramConfig> = {
  dai_cat: {
    id: 'dai_cat',
    name: 'Đại Cát',
    hexagramName: 'Càn Vi Thiên - Long Đột Cửu Tiêu',
    tag: 'Càn • Đại Hanh Thông',
    badgeText: 'Đại Cát ✦',
    badgeClass: 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.4)]',
    color: 'text-amber-300',
    bgGradient: 'from-amber-950/80 via-yellow-900/40 to-amber-950/80',
    borderClass: 'border-amber-400',
    poetry: 'Thời lai thiên địa giai đồng lực, cửu thiên phi long vấn đạo tâm.',
    description: 'Thiên địa đạo vận gia thân, phúc trạch vô biên, chư tà bất xâm, vạn sự thuận buồm xuôi gió!',
    buffs: [
      '⚡ Tăng +30% Tốc độ Tu Luyện Bế Quan Thổ Nạp',
      '✨ Tăng +20% Tỉ lệ thành công khi Đột Phá cảnh giới',
      '🌟 Thám hiểm Bí Cảnh chắc chắn gặp Kỳ Duyên Cực Phẩm / Rương Vàng',
      '🛡️ Giảm 20% nguy cơ Tâm Ma quấy nhiễu'
    ],
    speedBonus: 0.30,
    breakthroughBonus: 20,
    bossDropBonus: 0.15,
    tamMaRiskMod: -0.20
  },
  thuong_cat: {
    id: 'thuong_cat',
    name: 'Thượng Cát',
    hexagramName: 'Hỏa Địa Tấn - Húc Nhật Đông Thăng',
    tag: 'Ly • Khôn Húc Nhật',
    badgeText: 'Thượng Cát ✦',
    badgeClass: 'bg-yellow-950/70 border-yellow-500 text-yellow-200 shadow-[0_0_8px_rgba(234,179,8,0.35)]',
    color: 'text-yellow-300',
    bgGradient: 'from-yellow-950/80 via-amber-900/40 to-yellow-950/80',
    borderClass: 'border-yellow-400',
    poetry: 'Linh quang quán đỉnh chiếu đan điền, vạn pháp quy tông đắc trường sinh.',
    description: 'Chân dương bừng sáng, linh tuyền cuộn trào, phúc tinh cao chiếu khắp động phủ.',
    buffs: [
      '⚡ Tăng +30% Tốc độ Tu Luyện Bế Quan Thổ Nạp',
      '✨ Tăng +20% Tỉ lệ thành công khi Đột Phá cảnh giới',
      '🎁 Tăng mạnh cơ duyên gặp dị bảo viễn cổ',
      '🛡️ Giảm 15% nguy cơ Tâm Ma quấy nhiễu'
    ],
    speedBonus: 0.30,
    breakthroughBonus: 20,
    bossDropBonus: 0.10,
    tamMaRiskMod: -0.15
  },
  trung_cat: {
    id: 'trung_cat',
    name: 'Trung Cát',
    hexagramName: 'Phong Lôi Ích - Phúc Trạch Hữu Dư',
    tag: 'Tốn • Chấn Ích Đạo',
    badgeText: 'Trung Cát ✦',
    badgeClass: 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    color: 'text-emerald-300',
    bgGradient: 'from-emerald-950/80 via-teal-950/40 to-emerald-950/80',
    borderClass: 'border-emerald-500',
    poetry: 'Mộc dục xuân phong linh dịch nhuận, phong lôi dẫn động nhập thiên môn.',
    description: 'Khí tức ôn hòa, tâm cảnh thanh tịnh, kiên trì khổ luyện ắt gặp tiên duyên.',
    buffs: [
      '🎁 Tăng +10% Tỉ lệ rơi đồ hiếm từ Boss Thí Luyện',
      '🧘 Bảo hộ tâm cảnh bình ổn, giảm thiểu nguy cơ tẩu hỏa'
    ],
    speedBonus: 0.05,
    breakthroughBonus: 5,
    bossDropBonus: 0.10,
    tamMaRiskMod: 0
  },
  hung: {
    id: 'hung',
    name: 'Hung',
    hexagramName: 'Trạch Thủy Khốn - Long Du Thiển Thủy',
    tag: 'Đoài • Khảm Khốn Ách',
    badgeText: 'Hung ⚠',
    badgeClass: 'bg-rose-950/80 border-rose-600 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]',
    color: 'text-rose-400',
    bgGradient: 'from-rose-950/80 via-red-950/40 to-rose-950/80',
    borderClass: 'border-rose-600',
    poetry: 'Hắc vân cái đỉnh linh quang trệ, ma sát sinh tâm đạo nhãn mờ.',
    description: 'Khí vận ủng trệ, ma vụ lượn lờ, dễ sinh ảo giác tẩu hỏa nhập ma.',
    buffs: [
      '⚠️ +25% Nguy cơ Tâm Ma phản phệ khi Bế quan & Đột phá',
      '⚠️ 30% Xác suất gặp Ma Đạo Sát Thủ tập kích lúc bế quan'
    ],
    speedBonus: 0,
    breakthroughBonus: -10,
    bossDropBonus: 0,
    tamMaRiskMod: 0.25
  },
  dai_hung: {
    id: 'dai_hung',
    name: 'Đại Hung',
    hexagramName: 'Sơn Địa Bác - Vạn Vật Điêu Linh',
    tag: 'Cấn • Khôn Điêu Tàn',
    badgeText: 'Đại Hung 💀',
    badgeClass: 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    color: 'text-red-500',
    bgGradient: 'from-red-950/90 via-black to-red-950/90',
    borderClass: 'border-red-600',
    poetry: 'Bạch cốt khô lâu triều bái địa, kiếp nạn phủ đầu mệnh huyền ty.',
    description: 'Sát khí ngập trời! Họa sát thân kề cận! Nên lập tức Tế Thiên Cải Mệnh hoặc nhờ Trưởng Lão tông môn bày trận hộ mệnh!',
    buffs: [
      '💀 +35% Nguy cơ Tâm Ma phản phệ chí mạng',
      '💀 40% Xác suất gặp Ma Đạo Sát Thủ cướp bóc Linh Thạch',
      '⚡ Giảm 15% tốc độ tích lũy tu vi bế quan'
    ],
    speedBonus: -0.15,
    breakthroughBonus: -20,
    bossDropBonus: 0,
    tamMaRiskMod: 0.35
  }
};

/**
 * Gieo quẻ Thiên Cơ ngẫu nhiên chịu ảnh hưởng bởi chỉ số Khí Vận của người chơi
 */
export function rollDailyDivination(currentKhiVan: number = 50): DailyDivinationState {
  // Điểm Khí Vận càng cao thì tỉ lệ quẻ Cát càng lớn
  const roll = Math.random() * 100;
  let hexType: HexagramType = 'trung_cat';

  if (currentKhiVan >= 90) {
    if (roll < 45) hexType = 'dai_cat';
    else if (roll < 85) hexType = 'thuong_cat';
    else hexType = 'trung_cat';
  } else if (currentKhiVan >= 70) {
    if (roll < 30) hexType = 'dai_cat';
    else if (roll < 65) hexType = 'thuong_cat';
    else if (roll < 92) hexType = 'trung_cat';
    else hexType = 'hung';
  } else if (currentKhiVan >= 45) {
    if (roll < 18) hexType = 'dai_cat';
    else if (roll < 48) hexType = 'thuong_cat';
    else if (roll < 82) hexType = 'trung_cat';
    else if (roll < 95) hexType = 'hung';
    else hexType = 'dai_hung';
  } else {
    // Khí vận thấp (< 45)
    if (roll < 10) hexType = 'dai_cat';
    else if (roll < 30) hexType = 'thuong_cat';
    else if (roll < 60) hexType = 'trung_cat';
    else if (roll < 85) hexType = 'hung';
    else hexType = 'dai_hung';
  }

  const cfg = HEXAGRAM_CONFIGS[hexType];
  return {
    hexagram: hexType,
    hexagramName: cfg.hexagramName,
    poetry: cfg.poetry,
    description: cfg.description,
    buffs: [...cfg.buffs],
    lastDivinedAt: Date.now(),
    rerollCount: 0
  };
}

/**
 * Kiểm tra xem người chơi có thể gieo quẻ mới trong ngày hay không (chu kỳ 24h hoặc qua ngày mới)
 */
export function canDivinateToday(lastDivinedAt?: number): boolean {
  if (!lastDivinedAt) return true;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  return Date.now() - lastDivinedAt >= ONE_DAY_MS;
}

/**
 * Tính toán chi phí Nghịch Thiên Cải Mệnh
 */
export function getDivinationRerollCost(player: PlayerStats): {
  pillCost: number;
  hasPill: boolean;
  pillCount: number;
  sectCost: number;
  canSect: boolean;
  sectContrib: number;
  linhThachCost: number;
  canLinhThach: boolean;
} {
  const pillCount = (player.inventory?.pills || []).find(p => p.id === DESTINY_REROLL_PILL_ID || p.id === 'pill_cai_menh')?.quantity || 0;
  const hasPill = pillCount > 0;
  const sectContrib = player.sectState?.contribution || player.sectContribution || 0;
  const sectCost = 500;
  const canSect = Boolean(player.sectState?.sectId || player.sect) && sectContrib >= sectCost;
  
  const realmLvl = player.currentRealm || 0;
  const linhThachCost = Math.min(20000, Math.max(5000, 5000 + realmLvl * 1500));
  const canLinhThach = player.linhThach >= linhThachCost;

  return {
    pillCost: 1,
    hasPill,
    pillCount,
    sectCost,
    canSect,
    sectContrib,
    linhThachCost,
    canLinhThach
  };
}

/**
 * Thực hiện Nghịch Thiên Cải Mệnh: Tẩy sạch Hung/Đại Hung, chuyển thành Trung Cát hoặc Thượng Cát/Đại Cát
 */
export function performFateReroll(
  player: PlayerStats,
  method: 'pill' | 'sect' | 'linh_thach'
): {
  success: boolean;
  message: string;
  updatedPlayer: PlayerStats;
} {
  const costs = getDivinationRerollCost(player);

  if (method === 'pill' && !costs.hasPill) {
    return { success: false, message: 'Không đủ Cải Mệnh Đan để tế thiên đổi vận!', updatedPlayer: player };
  }
  if (method === 'sect' && !costs.canSect) {
    return { success: false, message: 'Cần gia nhập Tông Môn và có tối thiểu 500 điểm Cống Hiến!', updatedPlayer: player };
  }
  if (method === 'linh_thach' && !costs.canLinhThach) {
    return { success: false, message: `Linh Thạch không đủ! Cần tối thiểu ${costs.linhThachCost.toLocaleString()} Linh Thạch.`, updatedPlayer: player };
  }

  // Khấu trừ tài nguyên
  const updated = { ...player };
  if (method === 'pill') {
    const inv = updated.inventory ? { ...updated.inventory } : { pills: [], herbs: [], ores: [] };
    const pills = [...(inv.pills || [])];
    const targetIdx = pills.findIndex(p => p.id === DESTINY_REROLL_PILL_ID || p.id === 'pill_cai_menh');
    if (targetIdx >= 0) {
      pills[targetIdx] = { ...pills[targetIdx], quantity: pills[targetIdx].quantity - 1 };
      if (pills[targetIdx].quantity <= 0) pills.splice(targetIdx, 1);
    }
    updated.inventory = { ...inv, pills };
  } else if (method === 'sect') {
    const curContrib = updated.sectState?.contribution || updated.sectContribution || 0;
    const newContrib = curContrib - 500;
    if (updated.sectState) {
      updated.sectState = { ...updated.sectState, contribution: newContrib };
    }
    updated.sectContribution = newContrib;
  } else if (method === 'linh_thach') {
    updated.linhThach -= costs.linhThachCost;
  }

  // Đổi quẻ: Đảm bảo chỉ rơi vào Trung Cát, Thượng Cát hoặc Đại Cát
  const roll = Math.random() * 100;
  let newHex: HexagramType = 'trung_cat';
  if (roll < 35) {
    newHex = 'dai_cat';
  } else if (roll < 75) {
    newHex = 'thuong_cat';
  } else {
    newHex = 'trung_cat';
  }

  const hexCfg = HEXAGRAM_CONFIGS[newHex];
  const prevCount = player.dailyDivination?.rerollCount || 0;

  updated.dailyDivination = {
    hexagram: newHex,
    hexagramName: hexCfg.hexagramName,
    poetry: hexCfg.poetry,
    description: hexCfg.description,
    buffs: [...hexCfg.buffs],
    lastDivinedAt: Date.now(),
    rerollCount: prevCount + 1
  };

  return {
    success: true,
    message: `🎉 Nghịch Thiên Cải Mệnh đại thành! Tẩy sạch tà vận, chuyển hóa thành quẻ [${hexCfg.name}: ${hexCfg.hexagramName}]!`,
    updatedPlayer: updated
  };
}
