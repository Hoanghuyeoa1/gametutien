// lib/types/modular-metallurgy.ts
// Domain Types: Đoán Cốt Hợp Kim & Tự Chọn Phôi Khí (Modular Metallurgy & Weapon Archetypes)
// 100% Strict TypeScript, Clean Architecture

/**
 * 4 Loại Phôi Khí Cổ Điển
 * - phi_kiem: Phi Kiếm (Tốc độ cực hạn, bạo kích cao, giảm máu)
 * - trong_kiem: Trọng Kiếm (Công kích bạo liệt, xuyên giáp, làm choáng, giảm tốc)
 * - bao_dinh: Bảo Đỉnh (Phòng thủ vững chắc, sinh lực dồi dào, miễn thương, công thấp)
 * - tran_ky: Trận Kỳ (Khuếch đại sát thương pháp thuật, giảm tiêu hao mana, công kích chuẩn)
 */
export type WeaponArchetypeId = 'phi_kiem' | 'trong_kiem' | 'bao_dinh' | 'tran_ky';

/**
 * 5 Thuộc Tính Nguyên Tố Khoáng Thạch Hợp Kim
 * - canh_kim: Canh Kim Thạch (Sát thương chuẩn / True Damage)
 * - han_bang: Hàn Băng Tinh (Làm chậm tốc độ / Slow Speed)
 * - xich_hoa: Xích Hỏa Đồng (Thiêu đốt liên tục / Burn Damage)
 * - huyen_thiet: Huyền Thiết (Miễn thương / Damage Reduction)
 * - tinh_than: Tinh Thần Sa (Kháng bạo kích / Crit Resist)
 */
export type OreElementProperty = 'canh_kim' | 'han_bang' | 'xich_hoa' | 'huyen_thiet' | 'tinh_than';

/**
 * Chỉ số hiệu ứng nguyên tố sau khi nung luyện hợp kim
 */
export interface AlloyElementalStats {
  trueDamagePercent: number;      // % Sát thương chuẩn (Canh Kim Thạch, tối đa 15%)
  slowSpeedPercent: number;       // % Làm chậm tốc độ đối thủ (Hàn Băng Tinh, tối đa 20%)
  burnDamagePercent: number;      // % Sát thương thiêu đốt (Xích Hỏa Đồng, tối đa 12%)
  damageReductionPercent: number; // % Miễn thương / Giảm sát thương nhận vào (Huyền Thiết, tối đa 10%)
  critResistPercent: number;      // % Kháng bạo kích (Tinh Thần Sa, tối đa 10%)
}

/**
 * Cấu hình đặc tính của từng loại quặng hợp kim trong registry
 */
export interface AlloyOrePropertyConfig {
  element: OreElementProperty;
  name: string;
  statKey: keyof AlloyElementalStats;
  maxEffectPercent: number;
  description: string;
  flavorText?: string;
}

/**
 * Cấu hình hệ số và thuộc tính của từng Phôi Khí
 */
export interface WeaponArchetypeConfig {
  id: WeaponArchetypeId;
  name: string;
  vietnameseName: string;
  description: string;
  icon?: string;
  badgeClass?: string;

  // Hệ số nhân chỉ số cơ bản
  atkMultiplier: number;
  speedMultiplier?: number;
  hpMultiplier?: number;
  defMultiplier?: number;

  // Thuộc tính đặc thù chiến đấu
  critRateBonus?: number;        // Tỷ lệ bạo kích cộng thêm (ví dụ: 0.12 = +12%)
  armorPenBonus?: number;        // Xuyên giáp cộng thêm (ví dụ: 0.20 = +20%)
  stunChanceBonus?: number;      // Tỷ lệ gây choáng (ví dụ: 0.10 = +10%)
  damageReductionBonus?: number; // Miễn thương cộng thêm (ví dụ: 0.08 = +8%)
  skillDamageBonus?: number;     // Tăng sát thương kỹ năng pháp thuật (ví dụ: 0.30 = +30%)
  manaCostReduction?: number;    // Tiết giảm tiêu hao linh lực/mana (ví dụ: 0.20 = -20%)
}

/**
 * Dữ liệu quặng thạch đầu vào cho lò luyện kim
 */
export interface MetallurgyOreInput {
  oreId: string;
  oreName: string;
  element: OreElementProperty;
  weight: number; // Trọng lượng / số lượng quặng nạp vào lò
  grade?: string;
}

/**
 * Chi tiết tỷ lệ và hiệu ứng của từng quặng trong hợp kim
 */
export interface AlloyOreDetail {
  oreId: string;
  oreName: string;
  element: OreElementProperty;
  weight: number;
  ratio: number; // Tỷ lệ chuẩn hóa (tổng các ratio = 1.0)
  effectiveBonus: number; // Giá trị hiệu ứng tương ứng tính theo tỷ lệ
}

/**
 * Kết quả phân tích & đúc hợp kim (Alloy Composition Result)
 */
export interface AlloyCompositionResult {
  ores: AlloyOreDetail[];
  totalWeight: number;
  dominantElement: OreElementProperty;
  dominantRatio: number;
  purityScore: number;       // Thang điểm tinh khiết 70 - 100
  purityMultiplier: number;  // Hệ số tinh khiết 0.70 - 1.00 dùng cho tính toán chỉ số
  elementalStats: AlloyElementalStats;
  specialAffixes?: AlloyElementalStats;
  summary: string;
}

/**
 * Trạng thái lưu trữ save game cho phân hệ Đoán Cốt Hợp Kim của người chơi
 */
export interface PlayerModularMetallurgyState {
  craftedWeaponsCount: number;
  unlockedArchetypes: (WeaponArchetypeId | string)[];
  metallurgyHistory: Array<{
    weaponId?: string;
    weaponName?: string;
    archetypeId?: WeaponArchetypeId | string;
    dominantElement?: OreElementProperty | string;
    purityScore?: number;
    craftedAt?: number;
    [key: string]: any;
  }>;
}

/**
 * Metadata hợp kim đính kèm vào trang bị phôi khí đã chế tạo
 */
export interface ModularWeaponMetadata {
  archetypeId: WeaponArchetypeId;
  archetypeName: string;
  alloyComposition: AlloyCompositionResult;
  purity: number; // Điểm tinh khiết (70 - 100)
  dominantElement: OreElementProperty;
  elementalEffects: Partial<AlloyElementalStats>;
  archetypeMultipliers: {
    atkMultiplier: number;
    speedMultiplier?: number;
    hpMultiplier?: number;
    defMultiplier?: number;
    critRateBonus?: number;
    armorPenBonus?: number;
    stunChanceBonus?: number;
    damageReductionBonus?: number;
    skillDamageBonus?: number;
    manaCostReduction?: number;
  };
  craftedAt: number; // Timestamp Unix epoch
  blacksmithRealmIndex: number;
  flameBonusPercent: number;
}

/**
 * Trạng thái phân hệ Đoán Cốt Hợp Kim (State)
 */
export interface ModularMetallurgyState {
  selectedArchetypeId: WeaponArchetypeId | null;
  selectedOres: MetallurgyOreInput[];
  selectedFlameId: string | null;
  lastCraftedResult: ModularWeaponMetadata | null;
  unlockedArchetypeIds: WeaponArchetypeId[];
  metallurgyExp?: number;
  metallurgyLevel?: number;
}

/**
 * Chỉ số cơ bản đầu vào của phôi để chế tác
 */
export interface BaseModularWeaponStats {
  atk?: number;
  hp?: number;
  def?: number;
  speed?: number;
  mp?: number;
  power?: number;
}
