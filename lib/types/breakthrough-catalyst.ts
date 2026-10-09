// lib/types/breakthrough-catalyst.ts
// Domain Types cho phân hệ "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch (Breakthrough Catalysts & Protective Talismans)"
// 100% Strict TypeScript, Clean Architecture

/**
 * Loại vị trí khảm nạp vật phẩm trợ lực phá cảnh
 */
export type CatalystSlotType = 'pill' | 'talisman';

/**
 * Loại hiệu ứng đặc biệt của Phù Chú / Trận Bàn Hộ Mạch
 */
export type TalismanEffectType =
  | 'reduce_spirit_stones'
  | 'prevent_backlash'
  | 'cleanse_inner_demon';

/**
 * Cấu hình thiết lập đan dược phá cảnh tiêu chuẩn
 */
export interface BreakthroughPillConfig {
  itemId: string;
  name: string;
  targetRealmIndex: number;
  baseSuccessRateBonus: number; // 0.10 -> 0.40 (+10% -> +40%)
  backlashReductionPercent: number; // 0 -> 100 (%)
  description: string;
  [key: string]: any;
}

/**
 * Cấu hình thiết lập phù chú / trận bàn hộ mạch tiêu chuẩn
 */
export interface BreakthroughTalismanConfig {
  itemId: string;
  name: string;
  effectType: TalismanEffectType;
  powerValue: number; // Ví dụ: 0.40 (giảm 40% LT), 1.0 (chặn 100% phản phệ)
  description: string;
  [key: string]: any;
}

/**
 * Lựa chọn khảm nạp của người chơi tại giao diện đột phá
 */
export interface BreakthroughSlotSelection {
  selectedPillInstanceId: string | null;
  selectedPillItemId: string | null;
  selectedTalismanItemId: string | null;
}

/**
 * Kết quả tính toán tỷ lệ và chi phí đột phá (Pure Preview, không RNG)
 */
export interface BreakthroughRateCalculation {
  baseRate: number; // Tỷ lệ cơ bản (0.0 -> 1.0)
  pillBonusRate: number; // Tỷ lệ cộng thêm từ đan dược (kèm đan văn 6-8 nếu có)
  nineVeinsBonusRate: number; // Tỷ lệ đặc quyền từ Đan Cửu Văn (1.0 nếu 9 văn, 0 nếu không)
  toxicityPenaltyRate: number; // Tỷ lệ bị phạt do Đan Độc (0 nếu có Định Tâm Phù hoặc 9 văn)
  finalRate: number; // Tỷ lệ thực tế cuối cùng (clamp 0.05 -> 1.0)
  spiritStoneCost: number; // Chi phí Linh Thạch sau khi giảm trừ
  isGuaranteedSuccess: boolean; // Cờ chắc chắn thành công 100% (Đan 9 Văn)
  isBacklashProtected: boolean; // Cờ miễn nhiễm phản phệ khi thất bại (Hộ Mạch Phù / 9 Văn)
  [key: string]: any;
}

/**
 * Kết quả thực thi một lần đột phá cảnh giới có khảm nạp vật phẩm trợ lực
 */
export interface BreakthroughExecutionResult {
  success: boolean;
  previousRealm: string;
  newRealm: string;
  tuviConsumed: number;
  spiritStonesConsumed: number;
  consumedPillName?: string;
  consumedTalismanName?: string;
  isBacklashTriggered: boolean;
  backlashHpLoss: number;
  backlashTuviLoss: number;
  logMessages: string[];
}

/**
 * Trạng thái người chơi lưu vết lịch sử khảm nạp phá cảnh
 */
export interface BreakthroughCatalystPlayerState {
  totalCatalystBreakthroughs: number;
  protectedFailuresCount: number;
  [key: string]: any;
}
