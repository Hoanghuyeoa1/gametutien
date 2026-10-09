// lib/types/divine-abilities.ts
// Domain Types cho Phân Hệ Thần Thông Bí Thuật Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

export type DivineTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DivineCategory = 
  | 'cong_phat'   // Sát thương bạo liệt, sát thương chuẩn
  | 'ho_than'     // Khiên chắn, phản phệ, bảo mệnh
  | 'tran_ap'     // Khống chế, định thân, suy yếu
  | 'linh_vuc';   // Dị tượng biến hóa, bành trướng lĩnh vực

export type DivineTriggerCondition = 
  | 'active_cooldown'   // Tự động kích hoạt khi hết hồi chiêu (mỗi X hiệp)
  | 'hp_below_30'       // Kích hoạt khi máu tụt xuống dưới 30%
  | 'combat_start'      // Kích hoạt ngay hiệp 1
  | 'on_crit_strike';   // Kích hoạt khi tung đòn bạo kích

export interface DivineCombatEffects {
  damageMultiplier?: number;        // Sát thương % ATK (vd: 2.5 = 250% ATK)
  trueDamageFlat?: number;          // Sát thương chuẩn bỏ qua giáp
  shieldPercentOfMaxHp?: number;    // Khiên chắn tương đương % HP tối đa
  reflectPercent?: number;          // Phản đòn % sát thương nhận vào
  stunTarget?: boolean;             // Làm choáng đối thủ 1 hiệp
  debuffAtkPercent?: number;        // Giảm % ATK đối phương
  buffAtkPercent?: number;          // Tăng % ATK bản thân
  buffCritRatePercent?: number;     // Tăng % bạo kích
  buffCritDmgPercent?: number;      // Tăng % bạo thương
  buffSpeedPercent?: number;        // Tăng % thân pháp
  buffDodgePercent?: number;        // Tăng % né tránh
  healPercentOfMaxHp?: number;      // Hồi máu tức thời
  invulnerableTurns?: number;       // Miễn nhiễm toàn bộ sát thương trong 1 hiệp
  deathWardReviveHpPercent?: number;// Bù nhìn/Niết bàn thế mạng khi HP về 0
  executeHpThresholdPercent?: number; // Dứt điểm ngay nếu HP đối thủ dưới X%
  drainEnemyAtkDefPercent?: number; // Tước đoạt % ATK và DEF của địch
  durationTurns?: number;           // Số hiệp kéo dài hiệu ứng buff/debuff
}

export interface DivineAbilityShopItem {
  id: string;
  name: string;
  tier: DivineTier;
  tierName: string;
  category: DivineCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  price: number;
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind border/text class
  cooldownTurns: number; // Số hiệp hồi chiêu
  triggerCondition: DivineTriggerCondition;
  combatEffects: DivineCombatEffects;
}

export interface PlayerDivineAbilitiesState {
  learnedDivineIds: string[];         // Danh sách ID thần thông đã học
  equippedDivineIds: string[];        // Danh sách ID thần thông gắn vào slot xuất chiến
}
