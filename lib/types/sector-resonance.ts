// lib/types/sector-resonance.ts
// Domain Types cho phân hệ "Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense / Tinh Vực Cộng Hưởng Trận)"

export type GridAuraType = 'thai_vi_toa_ma' | 'hu_khong_phan_chan';

/**
 * Một Tuyến Năng Lượng Tinh Vực nối giữa 2 Cứ Điểm Tinh Cầu
 */
export interface SectorResonanceLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  distance: number;
  isActive: boolean;
  energyTransmissionEfficiency: number; // 0.5 - 0.9 (giảm dần theo cự ly)
  establishedAt: number;
  upgradeLevel?: number; // Cấp dây chuyền truyền dẫn (1-5)
}

/**
 * Báo cáo chi viện của một Cứ Điểm lân cận trong lượt khai hỏa
 */
export interface CrossFireSupportReport {
  supportingNodeId: string;
  supportingNodeName: string;
  cannonsEngaged: number;
  totalDamageDealt: number;
  energyConsumed: number;
  critHits: number;
}

/**
 * Kết quả toàn diện sau một đợt chi viện hỏa lực chéo và kích hoạt Lĩnh Vực Tinh Vực
 */
export interface SectorResonanceDefenseResult {
  defendingNodeId: string;
  baseWavePower: number;
  crossFireDamageTotal: number;
  reducedWavePower: number;
  participatingNodes: CrossFireSupportReport[];
  gridAuraTriggered?: GridAuraType;
  activeAuras?: GridAuraType[];
  absorbedShieldDamage: number;
  isVictorious: boolean;
  logs: string[];
}

/**
 * Trạng thái mạng lưới cộng hưởng tinh vực
 */
export interface SectorResonanceGridState {
  resonanceLinks: SectorResonanceLink[];
  crossFireEnergyBuffer: number; // Tinh Thạch / Năng lượng dự trữ để khai hỏa
  activeAuras: GridAuraType[];
}

/**
 * Kết quả kiểm định tính khả thi khi tạo liên kết
 */
export interface ResonanceLinkEstablishCheck {
  allowed: boolean;
  reason?: string;
  distance?: number;
  transmissionEfficiency?: number;
  activationCost?: {
    linhThach: number;
  };
}
