// lib/types/cultivation-shop.ts
// Schema chuẩn cho phân hệ Vật Phẩm Tu Luyện & Bổ Trợ Đạo Hành (Tier 1 -> Tier 9)

export type CultivationItemTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CultivationItemCategory = 
  | 'manual'     // Tâm pháp (Tăng vĩnh viễn tốc độ tu vi cơ bản)
  | 'array'      // Trận bàn tụ linh (Buff tốc độ có thời hạn)
  | 'essence'    // Linh tủy (Tăng hiệu suất bế quan / giảm nghẽn kinh mạch)
  | 'incense';   // Ngộ đạo hương/trà (Tăng ngộ tính và tâm cảnh)

export interface CultivationShopEffects {
  permanentTuViSpeedPercent?: number;  // Tăng vĩnh viễn % tốc độ tu vi cơ bản
  temporaryTuViSpeedPercent?: number;  // Buff tạm thời % tốc độ tu vi
  durationHours?: number;              // Thời hạn của trận bàn/hương (giờ)
  permanentNgoTinh?: number;           // Tăng ngộ tính vĩnh viễn
  permanentCanCot?: number;            // Tăng căn cốt vĩnh viễn
  meditationEfficiencyBonus?: number;  // Tăng hiệu suất bế quan offline (%)
  tamCanhBonus?: number;               // Tăng điểm tâm cảnh
  immuneTamMa?: boolean;               // Miễn nhiễm 100% tâm ma khi bế quan
  specialPhenomenon?: string;          // Kích hoạt dị tượng (e.g. Tử Khí Triều Tịch)
}

export interface CultivationShopItem {
  id: string;
  name: string;
  tier: CultivationItemTier;
  tierName: string;
  category: CultivationItemCategory;
  categoryName: string;
  description: string;
  flavorText: string;
  price: number;
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind border/text class
  effects: CultivationShopEffects;
  maxUsagePerRealm?: number; // Giới hạn học tâm pháp mỗi cảnh giới (nếu có)
}

export interface ActiveCultivationArrayBuff {
  itemId: string;
  name: string;
  tuViSpeedPercent: number;
  expiresAt: number; // Mốc thời gian hết hạn (Timestamp ms hoặc Infinity)
  isPermanent?: boolean;            // Trận bàn vĩnh cửu không bao giờ hết hạn
  reforgeTier?: number;             // 0: Thường, 1: Bất Hủ, 2: Tột Đỉnh Hấp Thu
  offlineAbsorptionBonus?: number;  // Tỷ lệ tăng tốc tu vi ngoại tuyến (vd: 0.35)
  reforgedAt?: number;              // Timestamp thời điểm trùng chú
}

export interface PlayerCultivationBuffState {
  activeArrays: ActiveCultivationArrayBuff[]; // Các trận bàn đang vận hành
  learnedManualIds: string[];                 // Danh sách tâm pháp đã giác ngộ
  meditationEfficiencyModifier: number;       // Hệ số bế quan tích lũy (%)
}
