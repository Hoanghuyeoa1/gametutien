// lib/combat-synergy-data.ts
// Dữ liệu tĩnh cho phân hệ Kỹ Thuật Hợp Kích: Tam Vị Nhất Thể

import type { SynergySkillDefinition, SynergySkillId, TrinitySynergyGaugeState, PlayerSynergyState } from './types/combat-synergy';

// ─── Định nghĩa 6 Tuyệt Kỹ Hợp Kích ─────────────────────────────────────────

export const SYNERGY_SKILLS: SynergySkillDefinition[] = [
  // ── 1. Tam Hoa Quy Nguyên (Universal: Player + Beast + any Spirit) ──────────
  {
    id: 'tam_hoa_quy_nguyen',
    name: '☯ Tam Hoa Quy Nguyên',
    quote: '「三花歸元 — Thiên Địa chi lực, tam hoa quy nhất! Thiêu tận hư không!」',
    description: 'Người Tu Sĩ, Linh Thú và Khí Linh hòa chung nguyên lực, bùng phát sức mạnh vạn linh về một điểm.',
    flavorText: 'Kỹ thuật tam hoa quy nguyên, vốn là bí thuật thượng cổ kết hợp thiên địa nhân tam tài vào một chiêu. Từ ngàn đời nay hiếm ai lĩnh ngộ được.',
    icon: '☯️',
    colorTheme: '#ffd700',
    triggerConditions: {
      companionId: null,
      beastElement: null,
      beastMinStage: 1,
      spiritPersonality: null,
      playerElement: null,
      minCompanionAffinity: 0,
      minSpiritIntimacy: 20,
    },
    combat: {
      baseDamageMultiplier: 3.5,
      critRateBonus: 15,
      critDmgBonus: 30,
      ignoreDefPercent: 20,
      effects: [
        {
          type: 'debuff_atk',
          value: 20,
          durationRounds: 2,
          chance: 70,
          description: 'Khí áp hội tụ làm đối thủ -20% ATK trong 2 hiệp'
        }
      ],
      healPercentOfMaxHp: 8,
      gaugeConsumed: 100,
      cooldownRounds: 5,
    },
    cutIn: {
      durationMs: 2400,
      particleColor: '#ffd700',
      glowColor: '#ff8c00',
      soundType: 'synergy_ultimate',
      flashIntensity: 'high',
    },
  },

  // ── 2. Thiên Địa Phong Ấn (Kim + Bạch Hổ + Sát Phạt) ─────────────────────
  {
    id: 'thien_dia_phong_yin',
    name: '⚡ Thiên Địa Phong Ấn',
    quote: '「天地封印 — Kim khí xé không trung, bạch hổ hổng thiên địa! Phong ấn vạn kiếp!」',
    description: 'Tu sĩ ngũ hành Kim cùng Bạch Hổ Linh Thú và Sát Phạt Khí Linh hợp kích, tạo ấn phong thiên địa trảm sát.',
    flavorText: 'Bạch Hổ là linh vật phương Tây, chủ Kim khí sát phạt. Khi ba nguồn Kim khí hội tụ, ấn lực có thể phong ấn cả trời đất.',
    icon: '⚡',
    colorTheme: '#c0c0ff',
    triggerConditions: {
      playerElement: 'kim',
      beastElement: null,  // Bất kỳ nhưng ưu tiên Kim
      spiritPersonality: 'sat_phat',
      beastMinStage: 2,
      minCompanionAffinity: 0,
      minSpiritIntimacy: 30,
    },
    combat: {
      baseDamageMultiplier: 4.8,
      critRateBonus: 25,
      critDmgBonus: 50,
      ignoreDefPercent: 35,
      effects: [
        {
          type: 'shatter_armor',
          value: 40,
          durationRounds: 3,
          chance: 80,
          description: 'Kim khí phá giáp, đối thủ -40% DEF trong 3 hiệp'
        },
        {
          type: 'stun',
          value: 1,
          durationRounds: 1,
          chance: 45,
          description: '45% choáng đối thủ 1 hiệp'
        }
      ],
      gaugeConsumed: 100,
      cooldownRounds: 6,
    },
    cutIn: {
      durationMs: 2800,
      particleColor: '#c0c0ff',
      glowColor: '#8080ff',
      soundType: 'synergy_ultimate',
      flashIntensity: 'extreme',
    },
  },

  // ── 3. Lục Hợp Hỗn Nguyên (Thủy/Băng Beast + Thu Hộ Spirit) ──────────────
  {
    id: 'luc_hop_hun_nguyen',
    name: '🌊 Lục Hợp Hỗn Nguyên',
    quote: '「六合混元 — Băng hàn thấu cốt, hộ sơn bất phá! Thiên địa vĩnh cửu!」',
    description: 'Sức mạnh Thủy Băng của Linh Thú hòa cùng Khí Linh Thu Hộ tạo thành màn băng bảo hộ thiên kiên địa cố.',
    flavorText: 'Lục hợp là bát phương trời đất, khi hỗn nguyên hợp nhất thì vạn vật đều bị bọc trong lớp băng vĩnh cửu — không thể phá vỡ, không thể vượt qua.',
    icon: '🌊',
    colorTheme: '#00bfff',
    triggerConditions: {
      beastElement: 'thuy',
      spiritPersonality: 'thu_ho',
      beastMinStage: 2,
      minSpiritIntimacy: 40,
      minCompanionAffinity: 0,
    },
    combat: {
      baseDamageMultiplier: 2.8,
      critRateBonus: 10,
      critDmgBonus: 20,
      ignoreDefPercent: 10,
      effects: [
        {
          type: 'freeze',
          value: 1,
          durationRounds: 2,
          chance: 65,
          description: '65% đóng băng đối thủ 2 hiệp (bỏ lượt)'
        },
        {
          type: 'dot_burn',
          value: 5,
          durationRounds: 3,
          chance: 100,
          description: 'Bỏng lạnh DoT 5% MaxHP mỗi hiệp trong 3 hiệp'
        }
      ],
      healPercentOfMaxHp: 18,
      shieldPercentOfMaxHp: 22,
      gaugeConsumed: 100,
      cooldownRounds: 5,
    },
    cutIn: {
      durationMs: 2600,
      particleColor: '#00bfff',
      glowColor: '#1e90ff',
      soundType: 'synergy_ultimate',
      flashIntensity: 'high',
    },
  },

  // ── 4. Phong Lôi Trừ Tiên (Lôi/Phong Beast + Cổ Xảo Spirit) ───────────────
  {
    id: 'phong_loi_tru_tien',
    name: '⚡🌪️ Phong Lôi Trừ Tiên',
    quote: '「風雷誅仙 — Vạn lôi rung chuyển thiên đình! Phong cuốn trừ diệt bất tịnh!」',
    description: 'Phong và Lôi nguyên tố hội tụ cùng Cổ Xảo Khí Linh, phóng vụ lôi điện tốc chiến tốc thắng.',
    flavorText: 'Lôi là âm thanh của thiên đình phán xét, Phong là sức mạnh của vũ trụ vận hành. Khi cả hai hợp nhất, không có tội pháp nào có thể trốn thoát.',
    icon: '⚡',
    colorTheme: '#9b59b6',
    triggerConditions: {
      beastElement: 'phong',   // phong hoặc loi — logic sẽ kiểm tra cả hai
      spiritPersonality: 'co_xao',
      beastMinStage: 2,
      minSpiritIntimacy: 35,
      minCompanionAffinity: 0,
    },
    combat: {
      baseDamageMultiplier: 4.2,
      critRateBonus: 35,
      critDmgBonus: 45,
      ignoreDefPercent: 25,
      effects: [
        {
          type: 'debuff_speed',
          value: 50,
          durationRounds: 3,
          chance: 90,
          description: 'Lôi điện tê liệt: đối thủ -50% Tốc Độ trong 3 hiệp'
        },
        {
          type: 'stun',
          value: 1,
          durationRounds: 1,
          chance: 30,
          description: '30% choáng thêm 1 hiệp từ lôi điện'
        }
      ],
      gaugeConsumed: 100,
      cooldownRounds: 7,
    },
    cutIn: {
      durationMs: 3000,
      particleColor: '#9b59b6',
      glowColor: '#e74c3c',
      soundType: 'synergy_ultimate',
      flashIntensity: 'extreme',
    },
  },

  // ── 5. Hư Không Tuyệt Kiếm (Kiếm Đạo + Bạch Hổ/Thanh Long + Tinh Hoa) ───
  {
    id: 'hu_khong_tuyet_kiem',
    name: '⚔️ Hư Không Tuyệt Kiếm',
    quote: '「虛空絕劍 — Kiếm khí xuyên hư không! Vạn kiếp bất diệt nhất kiếm chém!」',
    description: 'Kiếm Đạo tu sĩ phối hợp cùng Bạch Hổ/Thanh Long và Tinh Hoa Khí Linh, xuất một kiếm vượt thời không.',
    flavorText: 'Đây là kiếm thuật siêu việt nhất từng được ghi lại trong Kiếm Tông Bí Lục. Một kiếm này đã từng chém đứt một ngọn núi.',
    icon: '⚔️',
    colorTheme: '#2ecc71',
    triggerConditions: {
      requiresManual: 'sword',  // Phải đang mang quyển thư kiếm pháp
      spiritPersonality: 'tinh_hoa',
      beastMinStage: 3,
      minSpiritIntimacy: 60,
      minCompanionAffinity: 0,
    },
    combat: {
      baseDamageMultiplier: 6.0,
      critRateBonus: 40,
      critDmgBonus: 80,
      ignoreDefPercent: 50,
      effects: [
        {
          type: 'true_damage',
          value: 15,
          chance: 100,
          description: 'Kiếm khí xuyên giáp: thêm 15% ATK sát thương thuần túy'
        },
        {
          type: 'shield_break',
          value: 100,
          chance: 100,
          description: 'Hư Không Kiếm Khí phá vỡ mọi khiên chắn'
        }
      ],
      gaugeConsumed: 100,
      cooldownRounds: 8,
    },
    cutIn: {
      durationMs: 3500,
      particleColor: '#2ecc71',
      glowColor: '#27ae60',
      soundType: 'synergy_ultimate',
      flashIntensity: 'extreme',
    },
  },

  // ── 6. Vạn Linh Triều Tông (Universal Fallback - Affinity ≥ 90) ────────────
  {
    id: 'van_linh_trieu_tong',
    name: '🌟 Vạn Linh Triều Tông',
    quote: '「萬靈朝宗 — Hỡi vạn linh, hãy về đây quy tông! Hợp lực hướng thiên!」',
    description: 'Khi hảo cảm Đồng Hành, Linh Thú và Khí Linh đều đạt tối cao, vạn linh tự phát hợp kích không cần điều kiện nguyên tố.',
    flavorText: 'Đây là kỹ thuật hợp kích cao nhất, không phân biệt nguyên tố hay thuộc tính. Chỉ cần tâm ý tương thông, vạn linh đều có thể về tông quy thỉnh.',
    icon: '🌟',
    colorTheme: '#f1c40f',
    triggerConditions: {
      minCompanionAffinity: 90,
      minSpiritIntimacy: 80,
      beastMinStage: 1,
    },
    combat: {
      baseDamageMultiplier: 4.0,
      critRateBonus: 20,
      critDmgBonus: 40,
      ignoreDefPercent: 15,
      effects: [
        {
          type: 'buff_player_atk',
          value: 30,
          durationRounds: 3,
          chance: 100,
          description: 'Vạn linh tiếp trợ: +30% ATK trong 3 hiệp tiếp theo'
        },
        {
          type: 'debuff_atk',
          value: 25,
          durationRounds: 3,
          chance: 60,
          description: '60% làm đối thủ -25% ATK trong 3 hiệp'
        }
      ],
      healPercentOfMaxHp: 12,
      gaugeConsumed: 80,   // Tốn ít Nộ Khí hơn vì yêu cầu cao
      cooldownRounds: 4,
    },
    cutIn: {
      durationMs: 2200,
      particleColor: '#f1c40f',
      glowColor: '#e67e22',
      soundType: 'synergy_ultimate',
      flashIntensity: 'high',
    },
  },
];

/** Map tra cứu nhanh theo ID */
export const SYNERGY_SKILLS_MAP: Record<SynergySkillId, SynergySkillDefinition> = Object.fromEntries(
  SYNERGY_SKILLS.map(s => [s.id, s])
) as Record<SynergySkillId, SynergySkillDefinition>;

// ─── Hằng số lượng Nộ Khí tích lũy ─────────────────────────────────────────

export const GAUGE_GAIN_CONFIG = {
  /** Mỗi đòn đánh trúng tích lũy */
  onHit: 8,
  /** Đòn bạo kích tích lũy thêm */
  onCrit: 12,
  /** Bị đánh trúng tích lũy */
  onTakeDamage: 5,
  /** Mỗi hiệp kết thúc */
  onRoundEnd: 3,
  /** Khi Linh Thú kích hoạt kỹ năng */
  onBeastSkill: 15,
  /** Khi Khí Linh bùng phát */
  onSpiritTrigger: 20,
  /** Khi Đồng Hành hỗ trợ (trận Boss) */
  onCompanionAssist: 10,
  /** Tối đa */
  maxGauge: 100,
} as const;

// ─── Khởi tạo trạng thái mặc định ───────────────────────────────────────────

export function createDefaultTrinitySynergyGaugeState(): import('./types/combat-synergy').TrinitySynergyGaugeState {
  return {
    currentGauge: 0,
    maxGauge: GAUGE_GAIN_CONFIG.maxGauge,
    lastSkillUsedId: null,
    cooldownRoundsRemaining: 0,
    triggeredThisBattle: false,
    totalSynergyActivations: 0,
    activeEffects: [],
  };
}

export function createDefaultPlayerSynergyState(): PlayerSynergyState {
  return {
    totalActivations: 0,
    skillActivationCounts: {},
    unlockedSkillIds: [],
    lastUnlockedSkillId: null,
    highestDamageSynergy: 0,
  };
}
