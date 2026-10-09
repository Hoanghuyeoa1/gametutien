// lib/types/companions-shop.ts

export type CompanionShopTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CompanionArchetype = 
  | 'song_tu'     // Song Tu Trợ Lực (Tăng tốc tu vi, exp)
  | 'ho_dao'      // Chiến Đấu Hộ Đạo (Gia tăng lực chiến, hợp kích)
  | 'bach_nghe'   // Bách Nghệ Trợ Thủ (Hỗ trợ luyện đan, rèn đúc)
  | 'di_the';     // Khí Vận Dị Thể (Thể chất đặc dị, tăng vận khí, sinh con tiên đồng)

export interface CompanionShopItem {
  id: string;
  name: string;
  title: string; // Danh hiệu (vd: "Thanh Lăng Kiếm Cơ", "Hắc Ma Tông Nữ", "Cửu Thiên Huyền Nữ")
  tier: CompanionShopTier;
  tierName: string;
  archetype: CompanionArchetype;
  archetypeName: string;
  description: string;
  backstory: string; // Điển tích lưu lạc, lý do xuất hiện tại Thương Hội
  quote: string; // Khẩu khí thoại trữ tình/khí khái
  price: number; // Đơn giá Linh Thạch
  requiredRealmIndex: number;
  requiredRealmName: string;
  badgeColor: string; // Tailwind color class
  avatarGradient: string; // CSS gradient class cho avatar silhouette
  avatarIcon?: string; // Biểu tượng đại diện (hoa, tuyết, lôi, hỏa, kiếm...)
  innatePhysique: string; // Tên thể chất bẩm sinh (vd: "Linh Âm Chi Thể", "Thuần Dương Đạo Thể")
  stats: {
    combatPower: number;      // Lực chiến cơ bản của đạo lữ
    tuViBonusPercent: number; // +% Tốc độ tu vi khi song tu
    favorabilityInitial: number; // Điểm hảo cảm ban đầu (mặc định 40-70)
    realmStage: string;       // Cảnh giới ban đầu của đạo lữ (vd: "Luyện Khí Viên Mãn", "Hóa Thần Sơ Kỳ")
    realmIndex: number;
    specialPerkDescription: string; // Mô tả đặc quyền độc nhất
    permanentPlayerBuff?: {
      khiVan?: number;
      canCot?: number;
      ngoTinh?: number;
      tamCanh?: number;
    };
  };
}
