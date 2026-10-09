// lib/types/beasts-shop.ts

export type BeastShopTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type BeastArchetype = 
  | 'chien_dau'   // Chiến đấu chủ lực (Sát thương, cắn xé)
  | 'thu_cuoi'    // Thần hành tọa kỵ (Tốc độ, thám hiểm bí cảnh)
  | 'ho_the'      // Hộ thể ngự thú (Phòng ngự, khiên chắn, đỡ đòn)
  | 'tam_bao';    // Tầm bảo thụy thú (Khí vận, tăng tỷ lệ rơi đồ hiếm)

export interface BeastShopItem {
  id: string;
  name: string;
  speciesTitle: string; // Chủng loài (vd: "Thái Cổ Dị Chủng", "Thần Thú Thượng Cổ")
  tier: BeastShopTier;
  tierName: string;
  archetype: BeastArchetype;
  archetypeName: string;
  description: string;
  backstory: string; // Truyền thuyết huyết mạch, nguồn gốc xuất hiện tại Thương Hội
  price: number; // Đơn giá Linh Thạch
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind color class
  avatarGradient: string; // CSS gradient class cho avatar silhouette SVG
  elementalAffinity: 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho' | 'phong_loi' | 'hon_don';
  innateSkillName: string; // Tên kỹ năng bẩm sinh
  innateSkillDesc: string; // Mô tả hiệu ứng chiến đấu / hỗ trợ
  stats: {
    combatPower: number;       // Lực chiến cơ bản của linh thú
    atkBonusPercent?: number;  // +% Công kích cho chủ nhân
    defBonusPercent?: number;  // +% Phòng ngự cho chủ nhân
    hpBonusFlat?: number;      // + Điểm khí huyết tối đa
    speedBonusFlat?: number;   // + Điểm thân pháp
    critRateBonus?: number;    // +% Tỷ lệ bạo kích
    dodgeBonus?: number;       // +% Né tránh
    khiVanBonus?: number;      // + Điểm Khí Vận vĩnh viễn
    dropRateBonusPercent?: number; // +% Tỷ lệ rơi vật phẩm hiếm
  };
}

export interface PlayerBeastsState {
  ownedBeastIds: string[];    // Danh sách ID linh thú đã thu phục
  activeCombatBeastId?: string; // Linh thú đang xuất chiến
  activeMountBeastId?: string;  // Linh thú đang cưỡi
}
