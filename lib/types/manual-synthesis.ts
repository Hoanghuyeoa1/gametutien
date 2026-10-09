// lib/types/manual-synthesis.ts
// Domain Types cho Hệ Thống Dung Hợp Công Pháp (Manual Synthesis / Bàn Diễn Võ Vạn Pháp)

import { ManualCategory, ManualTier } from './manuals-shop';

export type { ManualCategory, ManualTier };

// Loại hiệu ứng Chiến Đấu Dị Biến mà Tuyệt Kỹ Thần Thông có thể mang theo
export type ManualAuraEffectType =
  | 'lifesteal'        // Hút hồi sinh lực
  | 'armor_break'      // Phá giáp hộ thân
  | 'freeze_stun'      // Phong ấn, kiềm chế
  | 'burn_dot'         // Thiêu đốt chân khí
  | 'evasion_boost'    // Tăng tốc né đòn
  | 'double_strike'    // Liên kích song chưởng
  | 'counter_strike'   // Phản kích trả đòn
  | 'mp_drain';        // Hút linh lực đối thủ

// Thần Thông Kỳ Dị / Dị Biến Chiến Đấu (Innate Aura) – mang theo bí kíp sau dị biến
export interface ManualCombatAura {
  id: string;
  name: string;         // Tên thần thông, vd: "Liệt Hỏa Phản Kích"
  description: string;  // Mô tả văn phong tiên hiệp
  triggerChance: number;      // 0-100, tỉ lệ kích hoạt mỗi lượt
  effectType: ManualAuraEffectType;
  effectValue: number;        // % hoặc số tuyệt đối tùy effectType
}

// Dạng mở rộng của Manual chuẩn, hỗ trợ metadata Dung Hợp
export interface SynthesizedManualExtension {
  isSynthesized?: boolean;               // Đây là bí kíp dung hợp hay nguyên bản?
  synthesisTier?: number;                // Giai bậc dung hợp (0 = gốc)
  synthesisParents?: {                   // Tên 2 bí kíp gốc tạo ra bí kíp này
    nameA: string;
    nameB: string;
    category: ManualCategory;
  };
  innateAura?: ManualCombatAura | null;  // Dị biến thần thông (nếu có)
  synthesizedAt?: number;                // timestamp khi tạo
}

// Vật Phẩm Đạo Cụ Xúc Tác cho Dung Hợp
export interface SynthesisCatalyst {
  itemId: string;
  name: string;           // vd: "Ngộ Đạo Thạch", "Vô Tự Thiên Thư"
  successRateBonus: number;    // Không dùng (luôn 100%), thay bằng:
  mutationRateBonus: number;   // +% Dị Biến Thiên Đạo kích hoạt
  guaranteedAura: boolean;     // Đảm bảo có Dị Biến khi true
}

// Tham số đầu vào cho hàm dung hợp
export interface SynthesisRequest {
  manualA: import('./items').Manual;
  manualB: import('./items').Manual;
  catalyst?: SynthesisCatalyst | null;
  forceMutation?: boolean;    // Chỉ dùng trong test
}

// Kết quả của thẩm định điều kiện dung hợp
export interface SynthesisEligibilityResult {
  eligible: boolean;
  reason?: string;
}

// Kết quả sau khi thực thi dung hợp thành công
export interface SynthesisResult {
  success: boolean;
  synthesizedManual?: import('./items').Manual & SynthesizedManualExtension;
  mutationTriggered: boolean;
  aura?: ManualCombatAura | null;
  costLinhThach: number;
  costCatalystCount: number;
  logMessage: string;
}

// Cấu hình chi phí và tỉ lệ theo Giai Bậc dung hợp
export interface SynthesisTierConfig {
  tier: ManualTier;
  tierName: string;
  costLinhThach: number;           // Chi phí Linh Thạch
  mutationBaseChance: number;      // % Dị Biến cơ bản (không dùng xúc tác)
  statInheritMultiplier: number;   // Hệ số kế thừa chỉ số (0.75 = 75%)
  requiredRealmIndex: number;      // Cảnh giới tối thiểu để thực hiện dung hợp
}

// State quản lý bàn dung hợp trong UI
export interface ManualSynthesisUIState {
  slotA: (import('./items').Manual & SynthesizedManualExtension) | null;
  slotB: (import('./items').Manual & SynthesizedManualExtension) | null;
  selectedCatalyst: SynthesisCatalyst | null;
  lastResult: SynthesisResult | null;
  showResultModal: boolean;
}
