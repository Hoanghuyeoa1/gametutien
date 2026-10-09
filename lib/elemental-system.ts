// lib/elemental-system.ts
// Hệ thống Linh Căn Thăng Hoa, Tương Khắc Ngũ Hành & Điểm Tương Thích Công Pháp

import { LinhCan, LinhCanElement, LinhCanGrade, Manual } from '@/lib/types';

export interface ElementalRelation {
  relation: 'counter' | 'countered' | 'neutral' | 'supreme';
  playerDamageMod: number;   // e.g. 1.3 (+30%), 0.8 (-20%), 1.25 (+25%)
  playerDefenseMod: number;  // e.g. 0.8 (-20% dmg taken), 1.2 (+20% dmg taken)
  description: string;
  badgeClass: string;
}

export const ELEMENT_NAMES: Record<LinhCanElement, string> = {
  kim: 'Canh Kim (Kim)',
  moc: 'Ất Mộc (Mộc)',
  thuy: 'Huyền Thủy (Thủy)',
  hoa: 'Bính Hỏa (Hỏa)',
  tho: 'Mậu Thổ (Thổ)',
  loi: 'Cửu Lôi (Lôi)',
  phong: 'Thanh Phong (Phong)',
  bang: 'Hàn Băng (Băng)',
  quang: 'Thái Dương (Quang)',
  am: 'Thái Âm (Ám)',
  ngu_hanh: 'Hỗn Độn Ngũ Hành'
};

export const ELEMENT_ICONS: Record<LinhCanElement, string> = {
  kim: '⚔️',
  moc: '🌿',
  thuy: '💧',
  hoa: '🔥',
  tho: '🏔️',
  loi: '⚡',
  phong: '🌪️',
  bang: '❄️',
  quang: '☀️',
  am: '🌑',
  ngu_hanh: '🌌'
};

export const ELEMENT_COLORS: Record<LinhCanElement, string> = {
  kim: 'text-amber-300 border-amber-500/40 bg-amber-950/40',
  moc: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
  thuy: 'text-sky-400 border-sky-500/40 bg-sky-950/40',
  hoa: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
  tho: 'text-yellow-500 border-yellow-600/40 bg-yellow-950/40',
  loi: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
  phong: 'text-teal-300 border-teal-500/40 bg-teal-950/40',
  bang: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40',
  quang: 'text-yellow-200 border-yellow-300/40 bg-yellow-950/50',
  am: 'text-violet-400 border-violet-600/40 bg-violet-950/40',
  ngu_hanh: 'text-fuchsia-300 border-fuchsia-500/50 bg-fuchsia-950/50'
};

// Bảng khắc chế nguyên tố
export const ELEMENT_COUNTERS: Record<LinhCanElement, LinhCanElement[]> = {
  kim: ['moc'],
  moc: ['tho'],
  tho: ['thuy'],
  thuy: ['hoa'],
  hoa: ['kim'],
  loi: ['thuy', 'am'],
  bang: ['hoa', 'moc'],
  phong: ['tho', 'loi'],
  quang: ['am'],
  am: ['quang'],
  ngu_hanh: ['kim', 'moc', 'thuy', 'hoa', 'tho', 'loi', 'phong', 'bang', 'quang', 'am']
};

/**
 * Tính toán quan hệ tương khắc giữa Linh Căn người chơi và Boss
 */
export function getElementalCombatModifier(
  playerElem?: LinhCanElement,
  bossElem?: LinhCanElement
): ElementalRelation {
  if (!playerElem || !bossElem) {
    return {
      relation: 'neutral',
      playerDamageMod: 1.0,
      playerDefenseMod: 1.0,
      description: 'Lực lượng bình ổn, không tương sinh tương khắc.',
      badgeClass: 'text-zinc-400 border-zinc-800 bg-zinc-900/40'
    };
  }

  // Hỗn Độn Ngũ Hành chí tôn
  if (playerElem === 'ngu_hanh') {
    return {
      relation: 'supreme',
      playerDamageMod: 1.25,
      playerDefenseMod: 0.85,
      description: 'Hỗn Độn Ngũ Hành dung hợp vạn pháp: Tăng +25% Sát Thương và giảm 15% Sát Thương nhận vào!',
      badgeClass: 'text-fuchsia-300 border-fuchsia-500/50 bg-fuchsia-950/50 font-bold shadow-[0_0_10px_rgba(217,70,239,0.3)]'
    };
  }

  // Người chơi khắc Boss
  const playerCounters = ELEMENT_COUNTERS[playerElem] || [];
  if (playerCounters.includes(bossElem)) {
    return {
      relation: 'counter',
      playerDamageMod: 1.3,
      playerDefenseMod: 0.8,
      description: `Linh căn ${ELEMENT_NAMES[playerElem]} khắc chế Boss ${ELEMENT_NAMES[bossElem]}: +30% Sát Thương, giảm 20% sát thương nhận vào!`,
      badgeClass: 'text-emerald-300 border-emerald-500/50 bg-emerald-950/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
    };
  }

  // Boss khắc người chơi
  const bossCounters = ELEMENT_COUNTERS[bossElem] || [];
  if (bossCounters.includes(playerElem)) {
    return {
      relation: 'countered',
      playerDamageMod: 0.8,
      playerDefenseMod: 1.2,
      description: `Bị Boss ${ELEMENT_NAMES[bossElem]} tương khắc linh căn: -20% Sát Thương, tăng 20% sát thương nhận vào!`,
      badgeClass: 'text-rose-400 border-rose-500/50 bg-rose-950/50 font-bold'
    };
  }

  return {
    relation: 'neutral',
    playerDamageMod: 1.0,
    playerDefenseMod: 1.0,
    description: 'Thuộc tính ngang bằng, không tương khắc.',
    badgeClass: 'text-zinc-400 border-zinc-800 bg-zinc-900/40'
  };
}

/**
 * Kiểm tra điểm Tương Thích (Synergy) giữa Công Pháp và Linh Căn
 * Nếu trùng hệ, hiệu lực công pháp tăng +50%
 */
export function getManualSynergy(
  manual?: Manual,
  playerRoot?: LinhCan
): {
  isSynergy: boolean;
  bonusMultiplier: number;
  text: string;
} {
  if (!manual || !playerRoot) {
    return { isSynergy: false, bonusMultiplier: 1.0, text: '' };
  }

  const mElem = manual.element || 'ngu_hanh';
  const pElem = playerRoot.element;

  if (pElem === 'ngu_hanh' || mElem === 'ngu_hanh' || mElem === pElem) {
    return {
      isSynergy: true,
      bonusMultiplier: 1.5,
      text: '🔥 Tương Thích Linh Căn (+50% Hiệu Lực)'
    };
  }

  return {
    isSynergy: false,
    bonusMultiplier: 1.0,
    text: ''
  };
}

// Danh sách các bậc Linh Căn thăng hoa
export interface LinhCanTierInfo {
  grade: LinhCanGrade;
  tier: number;
  namePrefix: string;
  minDamageBonus: number;
  maxDamageBonus: number;
  minSpeedBonus: number;
  maxSpeedBonus: number;
  description: string;
}

export const LINH_CAN_TIERS: LinhCanTierInfo[] = [
  {
    tier: 1,
    grade: 'Tạp Linh Căn',
    namePrefix: 'Tứ Hải Tạp Linh Căn',
    minDamageBonus: 5,
    maxDamageBonus: 10,
    minSpeedBonus: 5,
    maxSpeedBonus: 10,
    description: 'Nhiều thuộc tính hỗn tạp, kinh mạch ứ tắc, cần dùng Tẩy Linh Đan thanh lọc tạp chất.'
  },
  {
    tier: 2,
    grade: 'Chân Linh Căn',
    namePrefix: 'Tam Hợp Chân Linh Căn',
    minDamageBonus: 15,
    maxDamageBonus: 20,
    minSpeedBonus: 15,
    maxSpeedBonus: 20,
    description: 'Linh căn ngưng luyện ba thuộc tính tương sinh, hấp thu thiên địa linh khí thuận lợi.'
  },
  {
    tier: 3,
    grade: 'Địa Linh Căn',
    namePrefix: 'Song Thuộc Tính Địa Linh Căn',
    minDamageBonus: 25,
    maxDamageBonus: 30,
    minSpeedBonus: 25,
    maxSpeedBonus: 30,
    description: 'Linh căn song thuộc tính thuần túy, tư chất ngàn người có một tại phàm giới.'
  },
  {
    tier: 4,
    grade: 'Thiên Linh Căn',
    namePrefix: 'Thuần Khiết Thiên Linh Căn',
    minDamageBonus: 35,
    maxDamageBonus: 45,
    minSpeedBonus: 35,
    maxSpeedBonus: 45,
    description: 'Đơn thuộc tính tinh khiết không tì vết, tốc độ thổ nạp thiên địa cực kỳ kinh người.'
  },
  {
    tier: 5,
    grade: 'Biến Dị Linh Căn',
    namePrefix: 'Tuyệt Cảnh Dị Biến Linh Căn',
    minDamageBonus: 45,
    maxDamageBonus: 55,
    minSpeedBonus: 35,
    maxSpeedBonus: 45,
    description: 'Biến dị Phong, Lôi, Băng cực độ hiếm thấy, uy lực công kích phá tan mọi quy tắc ngũ hành thông thường.'
  },
  {
    tier: 6,
    grade: 'Hỗn Độn Linh Căn',
    namePrefix: 'Hỗn Độn Ngũ Hành Chí Tôn Linh Căn',
    minDamageBonus: 60,
    maxDamageBonus: 75,
    minSpeedBonus: 55,
    maxSpeedBonus: 70,
    description: 'Chí tôn vạn cổ, dung hợp toàn bộ ngũ hành dị biến, thiên địa đại đạo cúi đầu thần phục.'
  }
];

export const PRESET_EXPANDED_LINH_CAN: LinhCan[] = [
  // Tier 1: Tạp Linh Căn
  {
    name: 'Tứ Tạp Ngũ Hành Căn',
    element: 'tho',
    grade: 'Tạp Linh Căn',
    description: 'Linh căn ngũ hành tạp nham nhiều tạp chất, cần nhiều Tẩy Linh Đan để tiến hóa.',
    damageBonus: 8,
    speedBonus: 8,
    purity: 20,
    tier: 1
  },
  // Tier 2: Chân Linh Căn
  {
    name: 'Tam Hành Chân Linh Căn',
    element: 'moc',
    grade: 'Chân Linh Căn',
    description: 'Chân linh căn tam thuộc tính, hấp thu linh khí thông suốt hơn tạp linh căn.',
    damageBonus: 18,
    speedBonus: 18,
    purity: 40,
    tier: 2
  },
  // Tier 3: Địa Linh Căn
  {
    name: 'Địa Linh Thủy Mộc Song Căn',
    element: 'thuy',
    grade: 'Địa Linh Căn',
    description: 'Thủy mộc tương sinh, sinh cơ bất tận, tư chất thuộc hàng thượng thừa.',
    damageBonus: 28,
    speedBonus: 28,
    purity: 60,
    tier: 3
  },
  // Tier 4: Thiên Linh Căn
  {
    name: 'Thiên Hỏa Linh Căn Thuần Dương',
    element: 'hoa',
    grade: 'Thiên Linh Căn',
    description: 'Hỏa diễm thuần khiết ngút trời, thiêu đốt vạn vật chỉ trong một ý niệm.',
    damageBonus: 40,
    speedBonus: 35,
    purity: 80,
    tier: 4
  },
  {
    name: 'Thái Bạch Canh Kim Thiên Linh Căn',
    element: 'kim',
    grade: 'Thiên Linh Căn',
    description: 'Vô thượng kim khí, sắc bén vô song, phá hủy mọi hộ thể linh thuẫn.',
    damageBonus: 42,
    speedBonus: 32,
    purity: 80,
    tier: 4
  },
  // Tier 5: Biến Dị Linh Căn
  {
    name: 'Cực Phẩm Cửu Tiêu Lôi Linh Căn',
    element: 'loi',
    grade: 'Biến Dị Linh Căn',
    description: 'Lôi đình dị chủng, khắc chế ma sát tà tu, uy áp kinh thiên chấn động cửu châu.',
    damageBonus: 50,
    speedBonus: 40,
    purity: 90,
    tier: 5
  },
  {
    name: 'Tuyệt Phẩm Huyền Băng Phong Linh Căn',
    element: 'bang',
    grade: 'Biến Dị Linh Căn',
    description: 'Băng hàn cực độ kết hợp phong ảnh thần tốc, đông cứng kinh mạch đối phương.',
    damageBonus: 48,
    speedBonus: 42,
    purity: 90,
    tier: 5
  },
  // Tier 6: Hỗn Độn Ngũ Hành
  {
    name: 'Thiên Địa Hỗn Độn Ngũ Hành Chí Tôn Căn',
    element: 'ngu_hanh',
    grade: 'Hỗn Độn Linh Căn',
    description: 'Hỗn Độn dung hợp vạn pháp, vô tiền khoáng hậu, vạn cổ bất hủ.',
    damageBonus: 65,
    speedBonus: 60,
    purity: 100,
    tier: 6
  }
];

export function getTierFromGrade(grade: LinhCanGrade): number {
  switch (grade) {
    case 'Tạp Linh Căn': return 1;
    case 'Chân Linh Căn': return 2;
    case 'Địa Linh Căn': return 3;
    case 'Thiên Linh Căn': return 4;
    case 'Biến Dị Linh Căn': return 5;
    case 'Hỗn Độn Linh Căn': return 6;
    case 'Hạ Phẩm': return 1;
    case 'Trung Phẩm': return 2;
    case 'Thượng Phẩm': return 3;
    case 'Cực Phẩm': return 4;
    case 'Thiên Phẩm': return 5;
    default: return 2;
  }
}

/**
 * Tỉ lệ quay Linh Căn khi Tẩy Tủy Trùng Sinh:
 * Tạp Linh Căn (Tứ/Ngũ Hành - Phổ thông): 65%
 * Chân Linh Căn (Tam Hành): 20%
 * Song Linh Căn (Địa Phẩm): 10%
 * Thiên Linh Căn (Đơn Thuộc Tính Thuần Khiết - Kim/Mộc/Thủy/Hỏa/Thổ): 3.5%
 * Biến Dị Linh Căn (Phong / Lôi / Băng / Quang / Ám): 1.2%
 * Hỗn Độn Ngũ Hành Linh Căn (Cực Phẩm Thần Thông): 0.3%
 */
export function rollLinhCanOnReborn(): LinhCan {
  const rand = Math.random() * 1000;

  if (rand < 3) {
    // 0.3%: Hỗn Độn Ngũ Hành Linh Căn
    return {
      name: 'Thiên Địa Hỗn Độn Ngũ Hành Chí Tôn Căn',
      element: 'ngu_hanh',
      grade: 'Hỗn Độn Linh Căn',
      description: 'Hỗn Độn dung hợp vạn pháp thiên địa, vạn cổ bất hủ, chí cao vô thượng.',
      damageBonus: 70,
      speedBonus: 65,
      purity: 100,
      tier: 6
    };
  }

  if (rand < 15) {
    // 1.2%: Biến Dị Linh Căn
    const variants: LinhCan[] = [
      {
        name: 'Cực Phẩm Cửu Tiêu Lôi Linh Căn',
        element: 'loi',
        grade: 'Biến Dị Linh Căn',
        description: 'Lôi đình vạn trượng, chấn nhiếp tà ma, sát phạt sắc bén kinh thiên động địa.',
        damageBonus: 52,
        speedBonus: 44,
        purity: 92,
        tier: 5
      },
      {
        name: 'Thiên Cương Cuồng Phong Linh Căn',
        element: 'phong',
        grade: 'Biến Dị Linh Căn',
        description: 'Cuồng phong cửu tiêu, thân ảnh hư ảo như gió thoảng, xuất kỳ bất ý.',
        damageBonus: 48,
        speedBonus: 52,
        purity: 92,
        tier: 5
      },
      {
        name: 'Tuyệt Phẩm Huyền Băng Phong Linh Căn',
        element: 'bang',
        grade: 'Biến Dị Linh Căn',
        description: 'Vạn trượng hàn băng đông cứng càn khôn, giảm tốc độ và đông kết khí huyết kẻ thù.',
        damageBonus: 50,
        speedBonus: 45,
        purity: 92,
        tier: 5
      },
      {
        name: 'Thái Dương Cực Quang Linh Căn',
        element: 'quang',
        grade: 'Biến Dị Linh Căn',
        description: 'Quang minh thuần khiết chói lòa, thanh tẩy mọi ô uế ma chướng.',
        damageBonus: 54,
        speedBonus: 46,
        purity: 94,
        tier: 5
      },
      {
        name: 'Thái Âm U Minh Linh Căn',
        element: 'am',
        grade: 'Biến Dị Linh Căn',
        description: 'Hắc ám u minh vô tận, thôn phệ linh lực và thực hiện đòn chí mạng bất ngờ.',
        damageBonus: 53,
        speedBonus: 45,
        purity: 94,
        tier: 5
      }
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  if (rand < 50) {
    // 3.5%: Thiên Linh Căn (Đơn Thuộc Tính)
    const thienList: LinhCan[] = [
      {
        name: 'Thái Bạch Canh Kim Thiên Linh Căn',
        element: 'kim',
        grade: 'Thiên Linh Căn',
        description: 'Kim khí sắc bén vô cùng, xuyên thấu mọi hộ thể cương khí.',
        damageBonus: 44,
        speedBonus: 34,
        purity: 85,
        tier: 4
      },
      {
        name: 'Ất Mộc Trường Sinh Thiên Linh Căn',
        element: 'moc',
        grade: 'Thiên Linh Căn',
        description: 'Sinh cơ dạt dào như cổ thụ ngàn năm, sinh mệnh bất tức bất diệt.',
        damageBonus: 38,
        speedBonus: 38,
        purity: 85,
        tier: 4
      },
      {
        name: 'Cửu Khúc Nhược Thủy Thiên Linh Căn',
        element: 'thuy',
        grade: 'Thiên Linh Căn',
        description: 'Nhu hòa uyển chuyển nhưng bao la vô bờ, dập tắt mọi hung hãn cuồng nộ.',
        damageBonus: 40,
        speedBonus: 36,
        purity: 85,
        tier: 4
      },
      {
        name: 'Thiên Hỏa Linh Căn Thuần Dương',
        element: 'hoa',
        grade: 'Thiên Linh Căn',
        description: 'Hỏa diễm cực nhiệt cuồn cuộn thiêu rụi vạn vật, uy thế ngút trời.',
        damageBonus: 45,
        speedBonus: 35,
        purity: 85,
        tier: 4
      },
      {
        name: 'Huyền Hoàng Hậu Thổ Thiên Linh Căn',
        element: 'tho',
        grade: 'Thiên Linh Căn',
        description: 'Dày dặn trầm ổn gánh vác càn khôn, phòng thủ kiên cố như đại địa.',
        damageBonus: 38,
        speedBonus: 32,
        purity: 85,
        tier: 4
      }
    ];
    return thienList[Math.floor(Math.random() * thienList.length)];
  }

  if (rand < 150) {
    // 10%: Song Linh Căn (Địa Phẩm)
    const diaList: LinhCan[] = [
      {
        name: 'Địa Linh Thủy Mộc Song Căn',
        element: 'thuy',
        grade: 'Địa Linh Căn',
        description: 'Thủy mộc tương sinh, sinh cơ dồi dào, tư chất thượng thừa nơi phàm thế.',
        damageBonus: 28,
        speedBonus: 28,
        purity: 65,
        tier: 3
      },
      {
        name: 'Địa Phẩm Hỏa Thổ Song Căn',
        element: 'hoa',
        grade: 'Địa Linh Căn',
        description: 'Hỏa sinh thổ, nham thạch nóng chảy ngưng tụ, lực phòng thủ và tấn công cân bằng.',
        damageBonus: 30,
        speedBonus: 25,
        purity: 65,
        tier: 3
      },
      {
        name: 'Địa Phẩm Canh Kim Huyền Thủy Song Căn',
        element: 'kim',
        grade: 'Địa Linh Căn',
        description: 'Kim sinh thủy, đòn công kích mang theo lưu chuyển sắc lạnh.',
        damageBonus: 32,
        speedBonus: 26,
        purity: 65,
        tier: 3
      }
    ];
    return diaList[Math.floor(Math.random() * diaList.length)];
  }

  if (rand < 350) {
    // 20%: Chân Linh Căn (Tam Hành)
    const chanList: LinhCan[] = [
      {
        name: 'Tam Hành Chân Linh Căn (Kim - Mộc - Thổ)',
        element: 'moc',
        grade: 'Chân Linh Căn',
        description: 'Chân linh căn ba thuộc tính tương hợp, hấp thu linh khí thuận lợi hơn phàm nhân.',
        damageBonus: 18,
        speedBonus: 18,
        purity: 45,
        tier: 2
      },
      {
        name: 'Tam Hợp Chân Linh Căn (Thủy - Hỏa - Thổ)',
        element: 'hoa',
        grade: 'Chân Linh Căn',
        description: 'Hòa quyện ba hành, kinh mạch thông thoáng, tốc độ thổ nạp ổn định.',
        damageBonus: 20,
        speedBonus: 16,
        purity: 45,
        tier: 2
      },
      {
        name: 'Tam Thanh Chân Linh Căn (Kim - Thủy - Mộc)',
        element: 'thuy',
        grade: 'Chân Linh Căn',
        description: 'Ba thuộc tính tương sinh liên hoàn, dễ dàng vận khí chu thiên.',
        damageBonus: 19,
        speedBonus: 19,
        purity: 45,
        tier: 2
      }
    ];
    return chanList[Math.floor(Math.random() * chanList.length)];
  }

  // 65%: Tạp Linh Căn (Tứ/Ngũ Hành)
  const tapList: LinhCan[] = [
    {
      name: 'Tứ Tạp Ngũ Hành Căn',
      element: 'tho',
      grade: 'Tạp Linh Căn',
      description: 'Linh căn ngũ hành hỗn tạp nhiều tạp chất, cần nỗ lực hoặc đan dược thanh tẩy.',
      damageBonus: 8,
      speedBonus: 8,
      purity: 20,
      tier: 1
    },
    {
      name: 'Ngũ Hành Tạp Hỗn Căn',
      element: 'kim',
      grade: 'Tạp Linh Căn',
      description: 'Năm hành hỗn loạn khó ngưng tụ chân khí, nhưng tiềm năng biến hóa rộng lớn.',
      damageBonus: 7,
      speedBonus: 9,
      purity: 18,
      tier: 1
    },
    {
      name: 'Tứ Tạp Thảo Mộc Phàm Căn',
      element: 'moc',
      grade: 'Tạp Linh Căn',
      description: 'Chứa nhiều phàm khí thế gian, cần mẫn tu luyện từng bước vấn đỉnh.',
      damageBonus: 9,
      speedBonus: 7,
      purity: 22,
      tier: 1
    },
    {
      name: 'Tứ Tạp Huyền Hỏa Thủy Căn',
      element: 'hoa',
      grade: 'Tạp Linh Căn',
      description: 'Thủy hỏa bất dung tạp lẫn, linh khí hấp thu chập chờn, cần Tôi Thể dưỡng căn.',
      damageBonus: 10,
      speedBonus: 6,
      purity: 20,
      tier: 1
    }
  ];
  return tapList[Math.floor(Math.random() * tapList.length)];
}
