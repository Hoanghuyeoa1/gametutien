// lib/domain-resonance-logic.ts
// Pure Business Logic cho Phân Hệ "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances)"
// Ràng buộc bất biến: 100% logic thuần túy, không phụ thuộc React state hay Hook

import {
  DomainResonanceConfig,
  ActiveDomainResonance,
  ResonanceElementType,
  SpiritPersonalityType,
  PotentialDomainResonance,
  ResonanceTurnResult,
  KungfuManualItem
} from './types/domain-resonance';
import { NatalArtifact } from './types/natal-artifact';
import { Manual, PlayerStats } from './types';

// ============================================================
// 1. BẢNG DANH MỤC DỊ TƯỢNG NGŨ HÀNH & BIẾN DỊ (REGISTRY)
// ============================================================
export const DOMAIN_RESONANCES_REGISTRY: DomainResonanceConfig[] = [
  {
    id: 'liet_diem_phan_than',
    name: 'Liệt Diễm Phần Thần',
    title: 'Liệt Diễm Phần Thần',
    element: 'Hỏa',
    description: 'Thiêu đốt 5% Chân Nguyên (MP) đối phương mỗi hiệp. Khi Chân Nguyên đối phương cạn kiệt, áp đặt trạng thái Hụt Khí giảm 15% Công Kích.',
    requirement: {
      requiredElement: 'Hỏa',
      requiredPersonality: 'sat_phat',
      minArtifactTier: 1,
      minSpiritAffinity: 0
    },
    effect: {
      type: 'mana_burn',
      baseValue: 5, // 5% MP mỗi hiệp
      scalingStat: 'atk',
      durationTurns: 99
    },
    auraVisual: {
      borderColor: 'border-rose-500',
      glowEffect: 'shadow-[0_0_20px_rgba(244,63,94,0.45)]',
      icon: '🔥',
      elementColor: '#ef4444',
      bgGradient: 'from-rose-950/80 via-red-950/60 to-black'
    }
  },
  {
    id: 'sinh_sinh_bat_tuc',
    name: 'Sinh Sinh Bất Tức',
    title: 'Sinh Sinh Bất Tức',
    element: 'Mộc',
    description: 'Hồi phục 6% Sinh Lực (HP) tối đa mỗi hiệp, đồng thời thanh tẩy các trạng thái suy yếu, trúng độc hoặc thiêu đốt.',
    requirement: {
      requiredElement: 'Mộc',
      requiredPersonality: 'on_hoa',
      minArtifactTier: 1,
      minSpiritAffinity: 0
    },
    effect: {
      type: 'hp_regen',
      baseValue: 6, // 6% HP max mỗi hiệp
      scalingStat: 'spiritLevel',
      durationTurns: 99
    },
    auraVisual: {
      borderColor: 'border-emerald-500',
      glowEffect: 'shadow-[0_0_20px_rgba(16,185,129,0.45)]',
      icon: '🌿',
      elementColor: '#10b981',
      bgGradient: 'from-emerald-950/80 via-teal-950/60 to-black'
    }
  },
  {
    id: 'bach_ho_tram_hon',
    name: 'Bạch Hổ Trảm Hồn',
    title: 'Bạch Hổ Trảm Hồn',
    element: 'Kim',
    description: 'Bỏ qua 25% phòng ngự hộ thể của đối phương và gia tăng 15% tỷ lệ Bạo Kích tất sát.',
    requirement: {
      requiredElement: 'Kim',
      requiredPersonality: 'lanh_khoc',
      minArtifactTier: 1,
      minSpiritAffinity: 0
    },
    effect: {
      type: 'armor_pierce',
      baseValue: 25, // 25% xuyên giáp
      scalingStat: 'atk',
      durationTurns: 99
    },
    auraVisual: {
      borderColor: 'border-amber-400',
      glowEffect: 'shadow-[0_0_20px_rgba(251,191,36,0.45)]',
      icon: '⚔️',
      elementColor: '#f59e0b',
      bgGradient: 'from-amber-950/80 via-yellow-950/60 to-black'
    }
  },
  {
    id: 'huyen_minh_han_vuc',
    name: 'Huyền Minh Hàn Vực',
    title: 'Huyền Minh Hàn Vực',
    element: 'Thủy',
    description: 'Làm chậm 20% tốc độ xuất chiêu của đối thủ và giảm 25% tỷ lệ phát động Thần Thông của địch.',
    requirement: {
      requiredElement: 'Thủy',
      requiredPersonality: 'co_tri',
      minArtifactTier: 1,
      minSpiritAffinity: 0
    },
    effect: {
      type: 'action_slow',
      baseValue: 20, // 20% giảm tốc
      scalingStat: 'def',
      durationTurns: 99
    },
    auraVisual: {
      borderColor: 'border-cyan-400',
      glowEffect: 'shadow-[0_0_20px_rgba(6,182,212,0.45)]',
      icon: '❄️',
      elementColor: '#06b6d4',
      bgGradient: 'from-cyan-950/80 via-blue-950/60 to-black'
    }
  },
  {
    id: 'huyen_vu_tran_thien',
    name: 'Huyền Vũ Trấn Thiên',
    title: 'Huyền Vũ Trấn Thiên',
    element: 'Thổ',
    description: 'Hấp thu sát thương quy đổi thành hộ thuẫn bằng 12% Máu tối đa và phản chấn 20% thương tổn nhận vào về phía địch.',
    requirement: {
      requiredElement: 'Thổ',
      requiredPersonality: 'tram_on',
      minArtifactTier: 1,
      minSpiritAffinity: 0
    },
    effect: {
      type: 'shield_reflect',
      baseValue: 20, // 20% phản chấn
      scalingStat: 'def',
      durationTurns: 99
    },
    auraVisual: {
      borderColor: 'border-yellow-700',
      glowEffect: 'shadow-[0_0_20px_rgba(180,83,9,0.45)]',
      icon: '🛡️',
      elementColor: '#d97706',
      bgGradient: 'from-yellow-950/80 via-amber-950/60 to-black'
    }
  },
  {
    id: 'cuu_thien_than_loi',
    name: 'Cửu Thiên Thần Lôi',
    title: 'Cửu Thiên Thần Lôi',
    element: 'Lôi',
    description: 'Giáng lôi phạt lôi đình vạn quân, gây sát thương chuẩn chân thật bằng 10% Công Kích bỏ qua khiên chắn và phòng ngự.',
    requirement: {
      requiredElement: 'Lôi',
      requiredPersonality: 'cuong_bao',
      minArtifactTier: 1,
      minSpiritAffinity: 0
    },
    effect: {
      type: 'true_damage_burst',
      baseValue: 10, // 10% atk sát thương chuẩn
      scalingStat: 'atk',
      durationTurns: 99
    },
    auraVisual: {
      borderColor: 'border-purple-400',
      glowEffect: 'shadow-[0_0_20px_rgba(192,132,252,0.45)]',
      icon: '⚡',
      elementColor: '#a855f7',
      bgGradient: 'from-purple-950/80 via-fuchsia-950/60 to-black'
    }
  }
];

// ============================================================
// 2. HELPER CHUẨN HÓA VÀ ĐỐI CHIẾU NGUYÊN TỐ & TÍNH CÁCH
// ============================================================

/**
 * Chuẩn hóa nguyên tố từ chuỗi bất kỳ về ResonanceElementType
 */
export function normalizeResonanceElement(rawElem?: string | null): ResonanceElementType | null {
  if (!rawElem) return null;
  const str = rawElem.toLowerCase().trim();

  if (str === 'kim' || str.includes('kim')) return 'Kim';
  if (str === 'moc' || str === 'mộc' || str.includes('mộc') || str.includes('moc')) return 'Mộc';
  if (str === 'thuy' || str === 'thủy' || str === 'bang' || str.includes('thủy') || str.includes('thuy') || str.includes('bang')) return 'Thủy';
  if (str === 'hoa' || str === 'hỏa' || str.includes('hỏa') || str.includes('hoa') || str.includes('diem') || str.includes('diễm') || str.includes('viêm')) return 'Hỏa';
  if (str === 'tho' || str === 'thổ' || str.includes('thổ') || str.includes('tho')) return 'Thổ';
  if (str === 'loi' || str === 'lôi' || str === 'phong' || str.includes('lôi') || str.includes('loi') || str.includes('phong')) return 'Lôi';
  if (str === 'hon_don' || str.includes('hỗn độn')) return 'Hỗn Độn';

  return null;
}

/**
 * Trích xuất nguyên tố từ một Thần Thông / Công Pháp (dựa trên trường element hoặc tên)
 */
export function extractSkillElement(skill: KungfuManualItem | Manual): ResonanceElementType | null {
  if (!skill) return null;

  // 1. Kiểm tra trường element có sẵn
  if (skill.element) {
    const norm = normalizeResonanceElement(String(skill.element));
    if (norm) return norm;
  }

  // 2. Dự đoán dựa trên tên kỹ năng nếu thiếu trường element
  const name = (skill.name || '').toLowerCase();
  if (name.includes('hỏa') || name.includes('hoa') || name.includes('diễm') || name.includes('viêm') || name.includes('liệt')) return 'Hỏa';
  if (name.includes('mộc') || name.includes('moc') || name.includes('liễu') || name.includes('thảo') || name.includes('sinh')) return 'Mộc';
  if (name.includes('kim') || name.includes('bạch hổ') || name.includes('kiếm') || name.includes('trảm')) return 'Kim';
  if (name.includes('thủy') || name.includes('thuy') || name.includes('băng') || name.includes('hàn') || name.includes('huyền minh') || name.includes('hải')) return 'Thủy';
  if (name.includes('thổ') || name.includes('tho') || name.includes('huyền vũ') || name.includes('sơn') || name.includes('nhạc') || name.includes('trấn')) return 'Thổ';
  if (name.includes('lôi') || name.includes('loi') || name.includes('phong') || name.includes('điện') || name.includes('thần lôi')) return 'Lôi';

  return null;
}

/**
 * Kiểm tra xem tính cách Khí Linh có thỏa mãn yêu cầu của Dị Tượng không
 * Hỗ trợ song song cả tính cách mới và các tính cách cũ của hệ thống Khí Linh
 */
export function matchSpiritPersonality(
  spirit: any,
  requiredPersonality: SpiritPersonalityType | SpiritPersonalityType[]
): boolean {
  if (!spirit) return false;

  // Thu thập danh sách tính cách mà Khí Linh này sở hữu
  const ownedPersonalities: string[] = [];
  if (spirit.personality) ownedPersonalities.push(String(spirit.personality).toLowerCase().trim());
  if (spirit.secondaryPersonality) ownedPersonalities.push(String(spirit.secondaryPersonality).toLowerCase().trim());
  if (Array.isArray(spirit.personalities)) {
    for (const p of spirit.personalities) {
      if (p) ownedPersonalities.push(String(p).toLowerCase().trim());
    }
  }

  const reqList = Array.isArray(requiredPersonality)
    ? requiredPersonality.map(p => String(p).toLowerCase().trim())
    : [String(requiredPersonality).toLowerCase().trim()];

  // Bảng ánh xạ tương hợp giữa các tính cách (Compatibility Matrix)
  const aliasMap: Record<string, string[]> = {
    sat_phat: ['sat_phat', 'cuong_bao', 'lanh_khoc'],
    cuong_bao: ['cuong_bao', 'sat_phat'],
    lanh_khoc: ['lanh_khoc', 'sat_phat'],
    on_hoa: ['on_hoa', 'ho_chu', 'thu_ho', 'tinh_hoa'],
    ho_chu: ['ho_chu', 'thu_ho', 'on_hoa'],
    thu_ho: ['thu_ho', 'ho_chu', 'on_hoa', 'tram_on'],
    co_tri: ['co_tri', 'co_xao', 'tinh_hoa', 'huyen_mong'],
    co_xao: ['co_xao', 'co_tri'],
    tram_on: ['tram_on', 'thu_ho', 'ho_chu'],
    tinh_hoa: ['tinh_hoa', 'on_hoa', 'co_tri']
  };

  for (const req of reqList) {
    // 1. Khớp trực tiếp
    if (ownedPersonalities.includes(req)) return true;

    // 2. Khớp qua bảng tương hợp
    const acceptableAliases = aliasMap[req] || [];
    for (const owned of ownedPersonalities) {
      if (acceptableAliases.includes(owned)) return true;
    }
  }

  return false;
}

// ============================================================
// 3. HÀM THẨM ĐỊNH DỊ TƯỢNG KÍCH HOẠT (REACTIVE DETECTION)
// ============================================================
/**
 * Quét toàn bộ Thần Thông đang trang bị và đối chiếu với Khí Linh Bản Mệnh.
 * Đảm bảo Zero-Latency, không tàn dư buff ma khi thay đổi trang bị / Khí Linh.
 */
export function detectActiveDomainResonances(
  equippedSkills: (KungfuManualItem | Manual)[],
  natalArtifact: NatalArtifact | null | undefined,
  playerRealmIndex: number = 0
): ActiveDomainResonance[] {
  // Phòng vệ biến bất biến 1 & 4 (Null Safety)
  if (!natalArtifact || !natalArtifact.spirit) {
    return [];
  }

  if (!equippedSkills || !Array.isArray(equippedSkills) || equippedSkills.length === 0) {
    return [];
  }

  const spirit = natalArtifact.spirit;
  const artifactTier = natalArtifact.tier || 1;
  const spiritAffinity = spirit.intimacy ?? (spirit as any).affinity ?? 0;

  const activeList: ActiveDomainResonance[] = [];

  for (const config of DOMAIN_RESONANCES_REGISTRY) {
    const req = config.requirement;

    // 1. Kiểm tra điều kiện Bản Mệnh & Hảo Cảm Khí Linh
    if (req.minArtifactTier && artifactTier < req.minArtifactTier) continue;
    if (req.minSpiritAffinity && spiritAffinity < req.minSpiritAffinity) continue;

    // 2. Kiểm tra tính cách Khí Linh
    const personalityMatches = matchSpiritPersonality(spirit, req.requiredPersonality);
    if (!personalityMatches) continue;

    // 3. Tìm Thần Thông phù hợp với nguyên tố yêu cầu
    const matchingSkill = equippedSkills.find(skill => {
      const skillElem = extractSkillElement(skill);
      return skillElem === req.requiredElement;
    });

    if (!matchingSkill) continue;

    // 4. Kích hoạt Dị Tượng thành công
    const resonanceLevel = Math.max(1, spirit.stageLevel || 1);

    activeList.push({
      resonanceId: config.id,
      name: config.name,
      level: resonanceLevel,
      effectDescription: config.description,
      sourceSkillName: matchingSkill.name || 'Thần Thông Vô Danh',
      spiritName: spirit.name || 'Khí Linh Bản Mệnh',
      element: config.element,
      auraVisual: config.auraVisual
    });
  }

  return activeList;
}

/**
 * Trích xuất danh sách các Thần Thông thực sự đang trang bị từ PlayerStats
 */
export function getPlayerEquippedManualList(player: PlayerStats): Manual[] {
  if (!player || !player.manuals || !Array.isArray(player.manuals)) return [];

  const slots = player.equippedManuals;
  if (!slots) return [];

  const equippedIds = new Set<string>();

  const checkAndAdd = (val: any) => {
    if (!val) return;
    if (typeof val === 'string') equippedIds.add(val);
    else if (typeof val === 'object' && val.id) equippedIds.add(val.id);
  };

  checkAndAdd(slots.tamPhap);
  checkAndAdd(slots.congPhap);
  checkAndAdd(slots.thanThong);
  checkAndAdd(slots.thanPhap);
  checkAndAdd(slots.theThuat);
  checkAndAdd(slots.thanThong1);
  checkAndAdd(slots.thanThong2);

  // Thêm hỗ trợ mảng equippedIds nếu có
  if (Array.isArray(slots.equippedManualIds)) {
    for (const id of slots.equippedManualIds) {
      if (id) equippedIds.add(id);
    }
  }

  return player.manuals.filter(m => equippedIds.has(m.id));
}

/**
 * Gợi ý các Dị Tượng sắp đạt được (cho UI / UX)
 */
export function getPotentialDomainResonances(
  equippedSkills: (KungfuManualItem | Manual)[],
  natalArtifact: NatalArtifact | null | undefined
): PotentialDomainResonance[] {
  const potentials: PotentialDomainResonance[] = [];

  for (const config of DOMAIN_RESONANCES_REGISTRY) {
    const missing: string[] = [];
    let canActivateWithSkill = false;
    let canActivateWithSpirit = false;

    if (!natalArtifact) {
      missing.push('Chưa tế luyện Bản Mệnh Pháp Bảo');
    } else if (!natalArtifact.spirit) {
      missing.push('Khí Linh chưa thức tỉnh linh trí');
    } else {
      const personalityMatches = matchSpiritPersonality(natalArtifact.spirit, config.requirement.requiredPersonality);
      if (!personalityMatches) {
        missing.push(`Cần Khí Linh tính cách tương hợp (${Array.isArray(config.requirement.requiredPersonality) ? config.requirement.requiredPersonality.join('/') : config.requirement.requiredPersonality})`);
        canActivateWithSpirit = true;
      }
    }

    const hasMatchingSkill = equippedSkills.some(skill => extractSkillElement(skill) === config.requirement.requiredElement);
    if (!hasMatchingSkill) {
      missing.push(`Cần trang bị thêm 1 Thần Thông hệ ${config.requirement.requiredElement}`);
      canActivateWithSkill = true;
    }

    if (missing.length > 0 && missing.length <= 2) {
      potentials.push({
        config,
        missingRequirements: missing,
        canActivateWithSkill,
        canActivateWithSpirit
      });
    }
  }

  return potentials;
}

// ============================================================
// 4. HÀM TÍCH HỢP LƯỢT ĐẤU COMBAT (TURN EXECUTION RESOLVER)
// ============================================================
/**
 * Giải quyết các hiệu ứng Dị Tượng theo từng lượt đấu.
 * Input: attacker, defender, activeResonances, turnNumber
 * Output: { updatedAttacker, updatedDefender, combatEvents, appliedDamage }
 */
export function resolveResonanceTurnEffects(
  attacker: any,
  defender: any,
  activeResonances: ActiveDomainResonance[],
  turnNumber: number
): ResonanceTurnResult {
  const updatedAttacker = { ...attacker };
  const updatedDefender = { ...defender };
  const combatEvents: string[] = [];
  let appliedDamage = 0;

  if (!activeResonances || !Array.isArray(activeResonances) || activeResonances.length === 0) {
    return { updatedAttacker, updatedDefender, combatEvents, appliedDamage };
  }

  for (const resonance of activeResonances) {
    const config = DOMAIN_RESONANCES_REGISTRY.find(r => r.id === resonance.resonanceId);
    if (!config) continue;

    switch (config.effect.type) {
      // 1. LIỆT DIỄM PHẦN THẦN (MANA BURN)
      case 'mana_burn': {
        const defenderInitialMp = updatedDefender.maxMp ?? updatedDefender.mp ?? 1000;
        const currentMp = updatedDefender.mp ?? updatedDefender.currentMp ?? 1000;
        const burnAmount = Math.max(1, Math.floor(defenderInitialMp * (config.effect.baseValue / 100)));

        const newMp = Math.max(0, currentMp - burnAmount);
        updatedDefender.mp = newMp;
        if (updatedDefender.currentMp !== undefined) updatedDefender.currentMp = newMp;
        if (updatedDefender.stats && typeof updatedDefender.stats.mp === 'number') {
          updatedDefender.stats.mp = newMp;
        }

        combatEvents.push(
          `🔥 [DỊ TƯỢNG • LIỆT DIỄM PHẦN THẦN] Liệt Diễm Phần Thần Dị Tượng bộc phát! Đối phương bị thiêu đốt ${burnAmount} Chân Nguyên!`
        );

        // Nếu Chân Nguyên <= 0: Áp đặt trạng thái Hụt Khí (-15% ATK)
        if (newMp <= 0) {
          if (!updatedDefender.isHutKhi) {
            updatedDefender.isHutKhi = true;
            const currentAtk = updatedDefender.atk ?? (updatedDefender.stats?.atk ?? 1000);
            const reducedAtk = Math.floor(currentAtk * 0.85);
            updatedDefender.atk = reducedAtk;
            if (updatedDefender.stats) updatedDefender.stats.atk = reducedAtk;

            combatEvents.push(
              `⚠️ [HỤT KHÍ] Đối phương cạn kiệt Chân Nguyên, khí huyết hỗn loạn, Công Kích giảm 15%!`
            );
          }
        }
        break;
      }

      // 2. SINH SINH BẤT TỨC (HP REGEN & CLEANSE)
      case 'hp_regen': {
        const attackerMaxHp = updatedAttacker.maxHp ?? updatedAttacker.maxKhiHuyet ?? 1000;
        const curHp = updatedAttacker.hp ?? updatedAttacker.khiHuyet ?? updatedAttacker.currentHp ?? 1000;
        const healAmount = Math.floor(attackerMaxHp * (config.effect.baseValue / 100));

        const newHp = Math.min(attackerMaxHp, curHp + healAmount);
        updatedAttacker.hp = newHp;
        if (updatedAttacker.currentHp !== undefined) updatedAttacker.currentHp = newHp;
        if (updatedAttacker.khiHuyet !== undefined) updatedAttacker.khiHuyet = newHp;

        // Thanh tẩy debuffs
        if (Array.isArray(updatedAttacker.debuffs) && updatedAttacker.debuffs.length > 0) {
          const removed = updatedAttacker.debuffs.pop();
          combatEvents.push(
            `🌿 [DỊ TƯỢNG • SINH SINH BẤT TỨC] Mộc linh thanh tẩy dị trạng 【${removed}】!`
          );
        }

        combatEvents.push(
          `🌿 [DỊ TƯỢNG • SINH SINH BẤT TỨC] Sinh linh dạt dào uẩn dưỡng! Hồi phục +${healAmount.toLocaleString()} Khí Huyết!`
        );
        break;
      }

      // 3. BẠCH HỔ TRẢM HỒN (ARMOR PIERCE)
      case 'armor_pierce': {
        updatedAttacker.armorPierceRate = (updatedAttacker.armorPierceRate || 0) + config.effect.baseValue;
        updatedAttacker.critRate = (updatedAttacker.critRate || 0) + 15;

        combatEvents.push(
          `⚔️ [DỊ TƯỢNG • BẠCH HỔ TRẢM HỒN] Bạch Hổ Thần Uy hàng thế! Bỏ qua 25% phòng ngự và tăng 15% tỷ lệ Bạo Kích!`
        );
        break;
      }

      // 4. HUYỀN MINH HÀN VỰC (ACTION SLOW)
      case 'action_slow': {
        const currentSpeed = updatedDefender.speed ?? (updatedDefender.stats?.speed ?? 100);
        const reducedSpeed = Math.max(1, Math.floor(currentSpeed * 0.80));
        updatedDefender.speed = reducedSpeed;
        if (updatedDefender.stats) updatedDefender.stats.speed = reducedSpeed;

        updatedDefender.skillCastReduction = 25; // Giảm 25% tỷ lệ phát động Thần Thông

        combatEvents.push(
          `❄️ [DỊ TƯỢNG • HUYỀN MINH HÀN VỰC] Hàn khí vạn trượng phong tỏa võ đài! Đối phương bị giảm 20% Tốc Độ xuất chiêu!`
        );
        break;
      }

      // 5. HUYỀN VŨ TRẤN THIÊN (SHIELD & REFLECT)
      case 'shield_reflect': {
        const attackerMaxHp = updatedAttacker.maxHp ?? updatedAttacker.maxKhiHuyet ?? 1000;
        const shieldAmount = Math.floor(attackerMaxHp * 0.12);

        updatedAttacker.shield = (updatedAttacker.shield || 0) + shieldAmount;
        updatedAttacker.reflectRate = (updatedAttacker.reflectRate || 0) + config.effect.baseValue;

        combatEvents.push(
          `🛡️ [DỊ TƯỢNG • HUYỀN VŨ TRẤN THIÊN] Huyền Vũ Thần Sơn trấn thủ! Ngưng tụ ${shieldAmount.toLocaleString()} Hộ Thuẫn và phản chấn 20% thương tổn!`
        );
        break;
      }

      // 6. CỬU THIÊN THẦN LÔI (TRUE DAMAGE BURST)
      case 'true_damage_burst': {
        const currentAtk = updatedAttacker.atk ?? updatedAttacker.congKich ?? (updatedAttacker.stats?.atk ?? 1000);
        const trueDamage = Math.max(1, Math.floor(currentAtk * (config.effect.baseValue / 100)));

        const defHp = updatedDefender.hp ?? updatedDefender.currentHp ?? (updatedDefender.stats?.hp ?? 1000);
        const newHp = Math.max(0, defHp - trueDamage);

        updatedDefender.hp = newHp;
        if (updatedDefender.currentHp !== undefined) updatedDefender.currentHp = newHp;
        if (updatedDefender.stats) updatedDefender.stats.hp = newHp;

        appliedDamage += trueDamage;

        combatEvents.push(
          `⚡ [DỊ TƯỢNG • CỬU THIÊN THẦN LÔI] Cửu Thiên Thần Lôi giáng thế! Giáng phạt ${trueDamage.toLocaleString()} sát thương chuẩn bỏ qua khiên chắn!`
        );
        break;
      }
    }
  }

  return {
    updatedAttacker,
    updatedDefender,
    combatEvents,
    appliedDamage
  };
}

/**
 * Tính toán nhanh tổng hợp các gia số chiến đấu do Dị Tượng mang lại cho Player
 */
export function calculateDomainResonanceBonuses(activeResonances: ActiveDomainResonance[]) {
  let extraCritRate = 0;
  let extraArmorPierce = 0;
  let extraShieldPercent = 0;
  let extraDmgMultiplier = 1.0;
  let hasManaBurn = false;
  let hasHpRegen = false;
  let hasSpeedSlow = false;
  let hasTrueDamage = false;

  for (const r of activeResonances) {
    if (r.resonanceId === 'bach_ho_tram_hon') {
      extraArmorPierce += 25;
      extraCritRate += 15;
    } else if (r.resonanceId === 'liet_diem_phan_than') {
      hasManaBurn = true;
      extraDmgMultiplier += 0.10;
    } else if (r.resonanceId === 'sinh_sinh_bat_tuc') {
      hasHpRegen = true;
    } else if (r.resonanceId === 'huyen_minh_han_vuc') {
      hasSpeedSlow = true;
    } else if (r.resonanceId === 'huyen_vu_tran_thien') {
      extraShieldPercent += 12;
    } else if (r.resonanceId === 'cuu_thien_than_loi') {
      hasTrueDamage = true;
      extraDmgMultiplier += 0.15;
    }
  }

  return {
    extraCritRate,
    extraArmorPierce,
    extraShieldPercent,
    extraDmgMultiplier,
    hasManaBurn,
    hasHpRegen,
    hasSpeedSlow,
    hasTrueDamage
  };
}
