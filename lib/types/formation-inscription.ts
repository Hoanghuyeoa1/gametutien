// lib/types/formation-inscription.ts
// Domain Types: Minh Khắc Trận Văn & Mạch Dẫn Linh (Formation Inscription)
// 100% Strict TypeScript, Clean Architecture

/**
 * Các loại cơ chế kích hoạt trận văn:
 * - passive_stat: Tăng chỉ số bị động (ví dụ: giảm tiêu hao chân nguyên/mana, tăng kháng tính)
 * - on_hit_proc: Kích hoạt khi đòn đánh trúng mục tiêu (ví dụ: phóng kiếm khí sát thương, phát nổ nguyên tố)
 * - emergency_shield: Kích hoạt khẩn cấp khi gặp nguy hiểm (ví dụ: khi HP < 30% chặn sát thương và tạo khiên hộ thân)
 * - crowd_control: Hiệu ứng khống chế đối thủ (ví dụ: gọi thiên lôi làm choáng, đóng băng kinh mạch)
 * - vampiric_lifesteal: Hút máu / chuyển hóa phần trăm sát thương thành sinh lực hồi phục
 */
export type InscriptionTriggerType =
  | 'passive_stat'
  | 'on_hit_proc'
  | 'emergency_shield'
  | 'crowd_control'
  | 'vampiric_lifesteal';

/**
 * Phẩm cấp Trận Văn (Tier 1 đến 9)
 */
export type InscriptionTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Hiệu ứng cụ thể của Trận Văn
 */
export interface InscriptionEffect {
  id: string;
  name: string;
  triggerType: InscriptionTriggerType;
  statKey?: string;
  value: number; // Tỷ lệ hoặc giá trị số (ví dụ: 0.20 = 20% giảm MP, 0.40 = 40% ATK damage)
  chance?: number; // Tỷ lệ kích hoạt (ví dụ: 0.25 = 25%)
  thresholdHpPercent?: number; // Ngưỡng HP kích hoạt (ví dụ: 0.30 = 30% HP)
  shieldHpPercent?: number; // Lượng khiên theo % Max HP (ví dụ: 0.20 = 20% Max HP)
  durationTurns?: number; // Số hiệp duy trì hiệu ứng (ví dụ: 1 hiệp stun)
  cooldownTurns?: number; // Số hiệp hồi chiêu
  maxTriggersPerBattle?: number; // Giới hạn số lần kích hoạt trong 1 trận chiến (ví dụ: 1 lần/trận)
  description: string;
  [key: string]: any;
}

/**
 * Chi tiết nguyên liệu tiêu hao khi khắc trận văn (Linh Mực, Trận Sa,...)
 */
export interface FormationInscriptionMaterial {
  id: string;
  name: string;
  quantity: number;
  itemCategory?: string;
  [key: string]: any;
}

/**
 * Cấu hình của từng Trận Đồ trong Registry
 */
export interface FormationInscriptionConfig {
  id: string;
  name: string;
  vietnameseName?: string;
  tier: InscriptionTier;
  triggerType: InscriptionTriggerType;
  description: string;
  lore?: string;
  requiredDivineSense: number; // Điểm Thần Thức tối thiểu yêu cầu
  requiredMaterials: FormationInscriptionMaterial[];
  effects: InscriptionEffect[];
  rarity?: string;
  badgeColor?: string;
  [key: string]: any;
}

/**
 * Ô Mạch Dẫn Linh trên thần binh (Conduit Slot)
 */
export interface InscriptionConduitSlot {
  slotIndex: number;
  isUnlocked: boolean;
  inscribedFormationId: string | null;
  inscribedFormationName?: string;
  inscribedAt?: number;
  currentEffects: InscriptionEffect[];
  [key: string]: any;
}

/**
 * Metadata minh khắc trận văn đính kèm vào trang bị (Equipment.inscriptionData)
 */
export interface WeaponInscriptionMetadata {
  totalSlots: number;
  unlockedSlots: number;
  maxSlots?: number;
  conduits: InscriptionConduitSlot[];
  inscribedCount: number;
  lastInscribedAt?: number;
  [key: string]: any;
}

/**
 * Trạng thái lưu trữ save game cho phân hệ Minh Khắc Trận Văn của người chơi
 */
export interface InscriptionPlayerState {
  unlockedFormationIds: string[];
  divineSense?: number;
  totalInscriptionsCrafted: number;
  totalCleansedCount: number;
  inscriptionHistory?: Array<{
    weaponId?: string;
    weaponName?: string;
    formationId: string;
    formationName?: string;
    slotIndex: number;
    timestamp: number;
    [key: string]: any;
  }>;
  [key: string]: any;
}
