// lib/types/soul-infusion.ts
// Domain Types: Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion & Artifact Spirit Awakening)
// 100% Strict TypeScript, Pure Domain Models, Clean Architecture

/**
 * 5 Chủng Loại Thần Thú / Cổ Hồn Phách tiêu chuẩn
 */
export type SoulType =
  | 'hac_giao'     // Hắc Thủy Huyền Giao (Hệ Thủy - Long Uy Khiếp Địch)
  | 'hoa_phuong'   // Cửu Thiên Hỏa Phượng (Hệ Hỏa - Niết Bàn Chân Diễm)
  | 'bach_ho'      // Canh Kim Bạch Hổ (Hệ Lôi/Kim - Sát Phạt Bạo Kích)
  | 'huyen_vu'     // Bắc Minh Huyền Vũ (Hệ Thổ - Bàn Thạch Phản Chấn)
  | 'co_kiem_tu';   // Thượng Cổ Kiếm Tu (Hệ Hỗn Độn - Kiếm Tâm Thông Minh)

/**
 * 4 Đặc Trưng Tính Cách của Khí Linh
 */
export type SpiritPersonality =
  | 'ngao_kieu'    // Ngạo Kiều: Tự tôn cao, kiêu kỳ nhưng trung thành thầm kín
  | 'lanh_dam'     // Lãnh Đạm: Lạnh lùng, ít nói, sát phạt dứt khoát
  | 'hao_chien'    // Háo Chiến: Nồng nhiệt, khát khao chiến đấu và thiêu rụi kẻ địch
  | 'trung_can';    // Trung Can: Điềm đạm, vững chắc, đặt an nguy của chủ nhân lên hàng đầu

/**
 * 3 Giai Đoạn Tiến Hóa Khí Linh:
 * 1: Hư Ảnh (Hồn phách sơ khai mờ ảo)
 * 2: Bán Thực Thể (Linh quang ngưng tụ, khí linh hiển lộ rõ nét)
 * 3: Chân Thân Hóa Hình (Khí linh hóa hình hoàn mỹ, kích hoạt Hộ Chủ Thần Thông)
 */
export type SpiritEvolutionStage = 1 | 2 | 3;

/**
 * Ngữ Cảnh Hội Thoại của Khí Linh
 */
export type SoulDialogueContext =
  | 'onCombatStart'   // Khi bước vào trận chiến
  | 'onVictory'       // Khi hạ gục đối thủ, giành chiến thắng
  | 'onLowHealth'     // Khi sinh lực chủ nhân rơi vào cảnh nguy khốn (< 20% HP)
  | 'onIdle';         // Khi ở trạng thái nghỉ ngơi / tịnh tọa

/**
 * Cấu hình hiệu ứng kích hoạt đặc trưng của Hồn Phách (Proc Effect)
 */
export interface SoulProcEffect {
  id: string;
  name: string;
  effectType:
    | 'debuff_fear'
    | 'burn_dot'
    | 'crit_and_pen'
    | 'defense_and_reflect'
    | 'sword_burst';
  triggerChance: number;          // Tỷ lệ kích hoạt (0.0 -> 1.0)
  potencyValue: number;           // Cường độ hiệu ứng (ví dụ: 0.30 = 30% giảm ATK hoặc 0.04 = 4% Max HP DoT)
  statKey?: string;               // Chỉ số gắn kèm (nếu có)
  durationTurns?: number;         // Thời gian duy trì (hiệp)
  description: string;
  [key: string]: any;
}

/**
 * Metadata Khí Linh đã phong ấn vào thần binh (gắn trực tiếp vào Equipment.infusedSoul)
 */
export interface InfusedSoulMetadata {
  soulId: string;
  soulType: SoulType;
  soulName: string;
  element: string;
  personality: SpiritPersonality;
  evolutionStage: SpiritEvolutionStage;
  spiritExp: number;
  maxSpiritExp: number;
  infusedAt: number;
  awakenedName?: string;
  dialoguePool: Record<SoulDialogueContext, string[]>;
  baseProc: SoulProcEffect;
  currentProc: SoulProcEffect;
  hasAutoGuardianUnlocked: boolean;
  awakenedAsNatalSpirit?: boolean;
  [key: string]: any;
}

/**
 * Vật phẩm Hồn Phách / Phong Hồn Bình lưu trữ trong kho đồ
 */
export interface SoulVesselItem {
  id: string;
  name: string;
  soulType: SoulType;
  tier: number;                   // Phẩm cấp Hồn Phách (1 -> 5)
  requiredRealmIndex: number;     // Yêu cầu cảnh giới người chơi tối thiểu để phong ấn
  element: string;
  description: string;
  lore?: string;
  personality: SpiritPersonality;
  baseProc: SoulProcEffect;
  dialoguePool: Record<SoulDialogueContext, string[]>;
  quantity?: number;
  count?: number;
  [key: string]: any;
}

/**
 * Trạng thái người chơi phục vụ lưu trữ phân hệ Phong Hồn Đoạt Phách
 */
export interface SoulInfusionPlayerState {
  harvestedSouls: Record<string, number>;
  totalInfusionsPerformed: number;
  unlockedSpiritLore: string[];
  totalSoulsInfused?: number;
  highestStageReached?: SpiritEvolutionStage;
  unlockedSoulTypes?: SoulType[];
  soulFeedingStamina?: number;
  infusionHistory?: Array<{
    weaponId: string;
    weaponName: string;
    soulType: SoulType;
    soulName: string;
    timestamp: number;
  }>;
  [key: string]: any;
}
