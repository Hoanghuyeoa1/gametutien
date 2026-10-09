// lib/types/legacy-tempering.ts
// Domain Types: Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh (Legacy Tempering & Blood-Bonding)
// 100% Strict TypeScript, Pure Domain Models, Clean Architecture

/**
 * Metadata Huyết Khế Bản Mệnh (Blood-Bonding Metadata)
 * Gắn kết linh hồn tu sĩ và thần binh bằng thọ nguyên và tâm huyết
 */
export interface BloodBondMetadata {
  isBloodBound: boolean;
  boundOwnerId: string;
  boundOwnerName: string;
  bondedAt: number;
  lifespanSacrificed: number;          // Thọ nguyên đã hiến tế (năm)
  combatPowerMultiplier: number;       // Hệ số khuếch đại chiến lực (mặc định 1.30 = +30%)
  disarmImmunity: boolean;             // Miễn nhiễm tước khí / tịch thu vũ khí (true)
  bondResonanceLevel: number;          // Cấp độ cộng hưởng huyết mạch (1 -> 5)
  [key: string]: any;
}

/**
 * Yêu cầu chi phí Trùng Chú Tái Sinh (Reforge Cost Requirement)
 */
export interface ReforgeCostRequirement {
  targetTier: number;
  requiredMinerals: {
    itemId: string;
    name: string;
    amount: number;
  }[];
  spiritStonesCost: number;
  requiredBlacksmithRealmIndex: number;
  [key: string]: any;
}

/**
 * Kết quả thẩm định trước khi Trùng Chú (Reforge Preview Result)
 */
export interface ReforgePreviewResult {
  currentTier: number;
  targetTier: number;
  currentAtk: number;
  projectedAtk: number;
  currentDef: number;
  projectedDef: number;
  currentHp: number;
  projectedHp: number;
  preservedAlloyName: string;
  preservedInscriptionCount: number;
  preservedSoulName?: string;
  costs: ReforgeCostRequirement;
  [key: string]: any;
}

/**
 * Trạng thái người chơi liên quan đến Trùng Chú & Huyết Khế
 */
export interface LegacyTemperingPlayerState {
  totalReforgesPerformed: number;
  bloodBoundEquipmentIds: string[];
  [key: string]: any;
}
