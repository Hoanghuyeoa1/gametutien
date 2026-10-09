// lib/attribute-perks.ts
// Quản lý hệ thống Tứ Đại Thuộc Tính, Phá Vỡ Giới Hạn Cảnh Giới (Dynamic Stat Cap) & Milestone Perks

import { PlayerStats, Realm } from '@/lib/types';

/**
 * Tính giới hạn tối đa của Tứ Đại Thuộc Tính theo Đại Cảnh Giới:
 * - Phàm Nhân - Luyện Khí (0 - 10): 100
 * - Trúc Cơ - Kim Đan (11 - 20): 250 (Mở thêm huyệt vị kinh mạch)
 * - Nguyên Anh - Hóa Thần (21 - 30): 500 (Ngưng tụ nguyên thần thức hải)
 * - Luyện Hư trở lên (> 30): 1000 (Dung nhập quy tắc thiên địa)
 */
export function getMaxStatLimit(realmIndex: number): number {
  if (realmIndex <= 10) return 100;
  if (realmIndex <= 20) return 250;
  if (realmIndex <= 30) return 500;
  return 1000;
}

/**
 * Mô tả ngắn gọn về giới hạn thuộc tính theo cảnh giới
 */
export function getStatCapDescription(realmIndex: number): string {
  if (realmIndex <= 10) return 'Phàm Nhân - Luyện Khí: Giới hạn 100';
  if (realmIndex <= 20) return 'Trúc Cơ - Kim Đan: Trần 250 (Khai thông huyệt vị)';
  if (realmIndex <= 30) return 'Nguyên Anh - Hóa Thần: Trần 500 (Ngưng tụ nguyên thần)';
  return 'Luyện Hư trở lên: Trần 1.000 (Quy tắc thiên địa)';
}

/**
 * Định nghĩa các Mốc Đột Biến Bị Động (Milestone Perks)
 */
export interface AttributeMilestonePerk {
  id: string;
  name: string;
  statKey: 'ngoTinh' | 'tamCanh' | 'canCot' | 'khiVan';
  statName: string;
  requiredValue: number;
  icon: string;
  shortDesc: string;
  description: string;
  colorClass: string;
  badgeClass: string;
}

export const ATTRIBUTE_MILESTONE_PERKS: AttributeMilestonePerk[] = [
  {
    id: 'nhat_niem_thong_thien',
    name: 'Nhất Niệm Thông Thiên',
    statKey: 'ngoTinh',
    statName: 'Ngộ Tính',
    requiredValue: 80,
    icon: '🧠',
    shortDesc: '-15% Tu Vi Đột Phá',
    description: 'Ngộ tính thông suốt thiên địa, giảm vĩnh viễn 15% số Tu Vi cần thiết khi bế quan đột phá cảnh giới.',
    colorClass: 'text-sky-300',
    badgeClass: 'bg-sky-950/70 border-sky-600/60 text-sky-300'
  },
  {
    id: 'bat_dong_minh_vuong',
    name: 'Bất Động Minh Vương',
    statKey: 'tamCanh',
    statName: 'Tâm Cảnh',
    requiredValue: 90,
    icon: '🧘',
    shortDesc: 'Miễn 100% Tâm Ma Tiểu Cảnh Giới',
    description: 'Tâm cảnh bất động như núi, miễn nhiễm hoàn toàn 100% nguy cơ Tâm Ma xâm lấn khi độ kiếp tiểu cảnh giới.',
    colorClass: 'text-purple-300',
    badgeClass: 'bg-purple-950/70 border-purple-600/60 text-purple-300'
  },
  {
    id: 'dong_can_thiet_cot',
    name: 'Đồng Cân Thiết Cốt',
    statKey: 'canCot',
    statName: 'Căn Cốt',
    requiredValue: 80,
    icon: '🛡️',
    shortDesc: '+5% Miễn Thương',
    description: 'Cốt cách cứng cáp như thần thiết, nhận thêm 1 tầng miễn thương (Damage Reduction) 5% trong mọi trận chiến.',
    colorClass: 'text-emerald-300',
    badgeClass: 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300'
  },
  {
    id: 'thien_menh_chi_tu',
    name: 'Thiên Mệnh Chi Tử',
    statKey: 'khiVan',
    statName: 'Khí Vận',
    requiredValue: 80,
    icon: '⭐',
    shortDesc: 'x2 Tỷ Lệ Tàng Bảo Các & Dị Bảo',
    description: 'Khí vận bàng bạc như trời xanh che chở, nhân đôi tỷ lệ gặp Tàng Bảo Các và Dị Bảo quý khi thám hiểm Bí Cảnh Roguelite.',
    colorClass: 'text-amber-300',
    badgeClass: 'bg-amber-950/70 border-amber-500/60 text-amber-300'
  }
];

/**
 * Kiểm tra xem người chơi có kích hoạt perk này không
 */
export function hasMilestonePerk(player: PlayerStats, perkId: string): boolean {
  const perk = ATTRIBUTE_MILESTONE_PERKS.find(p => p.id === perkId);
  if (!perk) return false;
  return (player[perk.statKey] || 0) >= perk.requiredValue;
}

/**
 * Danh sách các perks đang kích hoạt của người chơi
 */
export function getActiveMilestonePerks(player: PlayerStats): AttributeMilestonePerk[] {
  return ATTRIBUTE_MILESTONE_PERKS.filter(p => (player[p.statKey] || 0) >= p.requiredValue);
}

/**
 * Danh sách đại cảnh giới (mốc phá vỡ ranh giới)
 */
export const MAJOR_REALM_INDICES: number[] = [0, 1, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96, 101];

/**
 * Kiểm tra xem cảnh giới đích có phải là Đại Cảnh Giới không
 */
export function isMajorBreakthroughRealm(targetRealmIndex: number): boolean {
  return MAJOR_REALM_INDICES.includes(targetRealmIndex);
}

/**
 * Tính toán số tu vi thực tế cần thiết cho cảnh giới tiếp theo (có áp dụng Nhất Niệm Thông Thiên, Thể chất, Mệnh cách)
 */
export function calculateEffectiveRequiredTuVi(player: PlayerStats, nextRealm: Realm): number {
  if (!nextRealm?.requirements?.tuVi) return 0;

  const physList = (player.physiques && player.physiques.length > 0)
    ? player.physiques
    : (player.physique ? [player.physique] : []);

  let tuViMultiplier = player.destiny?.effects?.tuViReqMultiplier || 1.0;
  for (const p of physList) {
    tuViMultiplier *= (p.breakthroughTuViMultiplier || 1.0);
  }

  // Perk: Nhất Niệm Thông Thiên (Ngộ tính >= 80 giảm 15% tu vi cần thiết)
  if ((player.ngoTinh || 0) >= 80) {
    tuViMultiplier *= 0.85;
  }

  return Math.max(1, Math.floor(nextRealm.requirements.tuVi * tuViMultiplier));
}
