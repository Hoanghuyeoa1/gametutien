// lib/types/formation.ts
// Kiểu dữ liệu cho phân hệ Trận Đạo Bách Nghệ • Trận Pháp Các

export type FormationType = 'battle' | 'tribulation' | 'utility';

export type FormationElement =
  | 'kim'
  | 'moc'
  | 'thuy'
  | 'hoa'
  | 'tho'
  | 'loi'
  | 'phong'
  | 'hon_don';

export interface FormationMaterial {
  itemId: string;
  name: string;
  quantity: number;
  itemCategory: 'ore' | 'herb' | 'gem' | 'linhThach';
}

export interface FormationCombatBuff {
  // Chỉ số tĩnh cộng thêm
  atkBonus?: number;
  defBonus?: number;
  hpBonus?: number;
  critRateBonus?: number;
  critDmgBonus?: number;
  speedBonus?: number;
  dmgReductionBonus?: number;
  hpRegenPercent?: number;
  // Cơ chế kích hoạt theo hiệp
  turnTriggerInterval?: number; // Mỗi N hiệp kích hoạt 1 lần
  triggerChance?: number;       // Xác suất kích hoạt (0-100)
  triggerDamagePercent?: number; // Sát thương kích hoạt = N% ATK
  triggerAtkDebuffPercent?: number; // Giảm ATK đối thủ N%
  triggerCritBlockTurns?: number;  // Khóa bạo kích đối thủ N hiệp
  tribulationDmgReduction?: number; // Giảm sát thương thiên kiếp
  breakthroughSuccessBonus?: number; // Tăng tỉ lệ đột phá
  antidemonCorruption?: boolean;   // Miễn tâm ma khi thất bại đột phá
  trapNullifyChance?: number;      // Tỉ lệ vô hiệu cạm bẫy bí cảnh
  triggerEffectDescription: string;
}

export interface FormationRecipe {
  id: string;
  name: string;
  type: FormationType;
  tier: number; // 1 - 9
  grade: string;
  element: FormationElement;
  description: string;
  lore: string;
  requiredArtisanLevel: number;
  requiredMaterials: FormationMaterial[];
  requiredGemType?: FormationElement | null;
  linhThachCost: number;
  baseSuccessRate: number; // 0 - 100
  baseExpGain: number;
  combatBuff: FormationCombatBuff;
}

export interface FormationItem {
  id: string;
  recipeId: string;
  name: string;
  type: FormationType;
  tier: number;
  grade: string;
  element: FormationElement;
  description: string;
  quality: 'ha_pham' | 'trung_pham' | 'thuong_pham' | 'cuc_pham' | 'than_pham';
  qualityMultiplier: number;
  durability: number;
  maxDurability: number;
  gemInlaid?: string | null;
  statBonus: { [key: string]: number };
  combatBuff: FormationCombatBuff;
  // Thuộc tính Trùng Chú Bất Hủ & Tột Đỉnh Hấp Thu
  isPermanent?: boolean;            // Đánh dấu trận bàn vĩnh viễn không bao giờ hết hạn
  reforgeTier?: number;             // 0: Nguyên bản, 1: Bất Hủ, 2: Cực Hạn
  offlineAbsorptionBonus?: number;  // Tỷ lệ gia tăng tốc độ hấp thu tu vi ngoại tuyến (+% hiệu suất, vd 0.35 = +35%)
  reforgedAt?: number;              // Timestamp thời điểm đúc lại
  isSocketedInSanctuary?: boolean;  // Đánh dấu trận bàn đang khảm vào Linh Mạch Động Phủ
}

export interface FormationArtisan {
  level: number; // 1 - 9
  exp: number;
  maxExp: number;
  totalCrafted: number;
  learnedRecipeIds: string[];
}

// ============================================================
// CẤU HÌNH TRÙNG CHÚ TRẬN BÀN CỬU GIAI (ARRAY REFORGING)
// ============================================================
export type ArrayReforgeType = 'permanence' | 'max_efficiency';

export interface ResourceCost {
  type: 'linhThach' | 'forgingEssence' | 'ore';
  itemId?: string;
  name: string;
  amount: number;
}

export interface ArrayReforgeRecipe {
  id: ArrayReforgeType;
  name: string;
  description: string;
  targetTier: number;            // 9 (Cửu Giai)
  requiredRealmIndex: number;    // 26 (Hóa Thần) cho permanence, 46 (Độ Kiếp) cho max_efficiency
  requiredRealmName: string;
  requiredArtisanLevel: number;  // 5 (Tông Sư) cho permanence, 9 (Thần Trận Đại Tổ) cho max_efficiency
  requiredArtisanTitle: string;
  requiredPriorReforgeTier?: number; // Cấp trùng chú tiên quyết (0: Chưa cần, 1: Cần đạt Bất Hủ)
  costs: ResourceCost[];
  effects: {
    isPermanent?: boolean;
    reforgeTier: number;
    offlineAbsorptionBonus?: number; // 0.35 (+35% tốc độ tu vi bế quan ngoại tuyến)
    summary: string;
  };
}
