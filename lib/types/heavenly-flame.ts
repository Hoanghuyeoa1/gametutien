// lib/types/heavenly-flame.ts
// Domain Types cho Hệ Thống Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)

export type FlameArchetype = 'on_hoa' | 'bao_liet' | 'bien_di' | 'hon_don';
export type FlameTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface FlameAuraEffect {
  id: string;
  name: string;
  description: string;
  unlockedAtTier: FlameTier;
  effectType: 'toxicity_burn' | 'yield_boost' | 'mutation_boost' | 'vein_quality' | 'material_save';
  value: number; // % hoặc điểm số cộng thêm
}

export interface HeavenlyFlameConfig {
  id: string;
  name: string;
  archetype: FlameArchetype;
  element: string; // Mộc, Hỏa, Lôi, Tà, Hỗn Độn
  description: string;
  lore: string;
  visualColor: {
    flameColor: string; // CSS color / Tailwind class
    glowColor: string;
    particleEffect: string;
    badgeClass: string;
  };
  baseToxicityBurnPercent: number;  // 0% - 50% (Hỏa Ôn Hòa thiêu rụi đan độc gốc)
  baseVeinQualityBonus: number;     // Tăng tỷ lệ Đan Văn 6 - 9 (điểm cộng vào alchemy score)
  baseYieldMultiplier: number;      // 1.0 hoặc 2.0 (Hỏa Bạo Liệt x2 đan)
  explosionRiskPercent: number;     // 0% - 20% (Rủi ro nổ lò)
  mutationChanceMultiplier: number; // 1.0 - 2.5 (Hỏa Biến Dị khuếch đại xác suất)
  auras: FlameAuraEffect[];
}

export interface PlayerFlameInstance {
  flameId: string;
  tier: FlameTier;
  currentExp: number;
  maxExp: number;
  unlockedAuraIds: string[];
  totalCraftsWithFlame: number;
}

export interface HeavenlyFlameState {
  unlockedFlames: Record<string, PlayerFlameInstance>;
  equippedFlameId: string | null; // null = Phàm Hỏa / Đan Hỏa Cơ Bản
}
