// lib/game-logic/refinement.ts
import {
  PlayerStats,
  LinhCan,
  Physique,
  LinhCanElement
} from '@/lib/types';
import {
  getRefinementCost,
  getRefinementStatsBonus,
  REFINEMENT_STAGES_ORDER,
  PHYSIQUE_TEMPLATES,
  createDefaultPhysique
} from '@/lib/physique-data';
import {
  PRESET_EXPANDED_LINH_CAN,
  LINH_CAN_TIERS,
  getTierFromGrade,
  ELEMENT_ICONS,
  ELEMENT_NAMES
} from '@/lib/elemental-system';
import { getMaxKhiHuyet } from './stats';

// CƠ CHẾ TÔI THỂ (BODY REFINEMENT)
// ============================================

export interface RefinementResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  stageAdvanced?: boolean;
  levelUp?: boolean;
  awakenedPhysique?: Physique;
}

export function performBodyRefinement(player: PlayerStats): RefinementResult {
  const currentPhysique = player.physique || createDefaultPhysique();
  const cost = getRefinementCost(currentPhysique.refinementStage, currentPhysique.refinementLevel);

  // Check linh thạch
  if (player.linhThach < cost.linhThachCost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Không đủ Linh thạch! Cần ${cost.linhThachCost.toLocaleString()} Hạ Phẩm Linh Thạch để rèn thể.`
    };
  }

  // Check tinh huyết yêu thú
  const currentTinhHuyet = player.tinhHuyetYeuThu || 0;
  if (currentTinhHuyet < cost.tinhHuyetCost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Không đủ Tinh Huyết Yêu Thú! Cần ${cost.tinhHuyetCost} giọt (Hiện có: ${currentTinhHuyet}). Đánh bại Boss Thí Luyện để thu thập!`
    };
  }

  // Check Khí Huyết Đan
  const inv = player.inventory || { pills: [], herbs: [], ores: [], manuals: [] };
  const khiHuyetPill = (inv.pills || []).find(p => p.id === 'pill_khi_huyet' || p.name.includes('Khí Huyết'));
  if (!khiHuyetPill || khiHuyetPill.quantity < cost.khiHuyetDanCost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Không đủ Khí Huyết Đan! Cần ${cost.khiHuyetDanCost} viên (Hiện có: ${khiHuyetPill?.quantity || 0}). Luyện tại Đan Các hoặc mua trong Dược Thị!`
    };
  }

  // Deduct resources
  const updated = { ...player };
  updated.linhThach -= cost.linhThachCost;
  updated.tinhHuyetYeuThu = currentTinhHuyet - cost.tinhHuyetCost;
  khiHuyetPill.quantity -= cost.khiHuyetDanCost;
  if (khiHuyetPill.quantity <= 0) {
    inv.pills = (inv.pills || []).filter(p => p !== khiHuyetPill);
  }
  updated.inventory = inv;

  const newPhysique: Physique = { ...currentPhysique };
  const expGain = 25 + Math.floor(Math.random() * 15) + Math.floor((player.canCot || 50) * 0.2);
  newPhysique.refinementExp += expGain;

  let levelUp = false;
  let stageAdvanced = false;
  let awakenedPhysique: Physique | undefined = undefined;

  // Level up check
  if (newPhysique.refinementExp >= newPhysique.maxRefinementExp) {
    newPhysique.refinementExp -= newPhysique.maxRefinementExp;
    newPhysique.maxRefinementExp = Math.floor(newPhysique.maxRefinementExp * 1.35);

    if (newPhysique.refinementLevel < 9) {
      newPhysique.refinementLevel += 1;
      levelUp = true;
    } else {
      // Advance stage: Đoạn Cốt -> Luyện Tạng -> Hoán Huyết -> Kim Thân
      const stageIdx = REFINEMENT_STAGES_ORDER.indexOf(newPhysique.refinementStage);
      if (stageIdx < REFINEMENT_STAGES_ORDER.length - 1) {
        newPhysique.refinementStage = REFINEMENT_STAGES_ORDER[stageIdx + 1];
        newPhysique.refinementLevel = 1;
        newPhysique.maxRefinementExp = 150 * (stageIdx + 2);
        stageAdvanced = true;
      }
    }
  }

  // Chance to awaken or evolve special physique (7% per refine, 40% on stage advance)
  const awakenChance = stageAdvanced ? 0.4 : 0.07;
  if (Math.random() < awakenChance) {
    const templates = Object.values(PHYSIQUE_TEMPLATES);
    const available = templates.filter(t => t.id !== newPhysique.id);
    if (available.length > 0) {
      const pick = available[Math.floor(Math.random() * available.length)];
      newPhysique.id = pick.id;
      newPhysique.name = pick.name;
      newPhysique.grade = pick.grade;
      newPhysique.description = pick.description;
      newPhysique.specialEffect = pick.specialEffect;
      newPhysique.hpBonusPercent = pick.hpBonusPercent;
      newPhysique.defenseBonusPercent = pick.defenseBonusPercent;
      newPhysique.damageBonusPercent = pick.damageBonusPercent;
      newPhysique.breakthroughTuViMultiplier = pick.breakthroughTuViMultiplier;
      newPhysique.tamMaChanceMultiplier = pick.tamMaChanceMultiplier;
      newPhysique.mpRegenPercent = pick.mpRegenPercent;
      newPhysique.poisonArmorPen = pick.poisonArmorPen;
      newPhysique.critDamageBonus = pick.critDamageBonus;
      newPhysique.cultivationSpeedBonusPercent = pick.cultivationSpeedBonusPercent;
      newPhysique.dodgeBonusPercent = pick.dodgeBonusPercent;
      newPhysique.critRateBonusPercent = pick.critRateBonusPercent;
      newPhysique.khangTamMaPercent = pick.khangTamMaPercent;
      newPhysique.badgeClass = pick.badgeClass;
      awakenedPhysique = { ...newPhysique };
    }
  }

  updated.physique = newPhysique;
  if (updated.physiques && updated.physiques.length > 0) {
    updated.physiques = [newPhysique, ...updated.physiques.slice(1)];
  } else {
    updated.physiques = [newPhysique];
  }

  const maxHP = getMaxKhiHuyet(updated.canCot, updated.currentRealm, updated.equipment, updated.manuals, updated.physiques, updated.equippedManuals, updated.linhCan, updated.destiny, updated.bodyRefinement);
  updated.maxKhiHuyet = maxHP;
  updated.khiHuyet = maxHP;

  let msg = `Tôi Thể thành công! Nhục thân dung nạp huyết khí, +${expGain} Thể Phách Kinh Nghiệm.`;
  if (stageAdvanced) {
    msg = `🎉 KINH THIÊN ĐỘT PHÁ! Thể chất bước vào cảnh giới [${newPhysique.refinementStage}]! Huyết khí dâng trào ngập trời!`;
  } else if (levelUp) {
    msg = `✨ Thăng cấp Tôi Thể lên [${newPhysique.refinementStage} - Tầng ${newPhysique.refinementLevel}]! Khí Huyết và Chiến Lực tăng mạnh!`;
  }
  if (awakenedPhysique) {
    msg += ` 🔥 DIỆU HUYẾT THỨC TỈNH! Nhục thân thăng hoa thành [${awakenedPhysique.name}] (${awakenedPhysique.grade})!`;
  }

  return {
    success: true,
    updatedPlayer: updated,
    message: msg,
    stageAdvanced,
    levelUp,
    awakenedPhysique
  };
}

// ============================================
// CƠ CHẾ THĂNG HOA LINH CĂN (SPIRITUAL ROOT EVOLUTION)
// ============================================

export interface RootEvolutionResult {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  tierUp?: boolean;
  newLinhCan?: LinhCan;
}

export function performSpiritualRootEvolution(player: PlayerStats): RootEvolutionResult {
  const currentRoot = player.linhCan || PRESET_EXPANDED_LINH_CAN[0];
  const currentTier = currentRoot.tier || getTierFromGrade(currentRoot.grade);

  if (currentTier >= 6) {
    return {
      success: false,
      updatedPlayer: player,
      message: 'Linh căn đã đạt Cực Hạn Hỗn Độn Ngũ Hành, không thể thăng hoa thêm!'
    };
  }

  const linhThachCost = currentTier * 800;
  const tayLinhCost = Math.max(1, currentTier);

  // Check Linh Thạch
  if (player.linhThach < linhThachCost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Không đủ Linh thạch! Cần ${linhThachCost.toLocaleString()} Hạ Phẩm Linh Thạch để tinh lọc linh căn.`
    };
  }

  // Check Tẩy Linh Đan
  const inv = player.inventory || { pills: [], herbs: [], ores: [], manuals: [] };
  const tayLinhPill = (inv.pills || []).find(p => p.id === 'pill_tay_linh' || p.name.includes('Tẩy Linh'));
  if (!tayLinhPill || tayLinhPill.quantity < tayLinhCost) {
    return {
      success: false,
      updatedPlayer: player,
      message: `Không đủ Tẩy Linh Đan! Cần ${tayLinhCost} viên (Hiện có: ${tayLinhPill?.quantity || 0}). Hãy luyện chế tại Đan Các!`
    };
  }

  // Deduct
  const updated = { ...player };
  updated.linhThach -= linhThachCost;
  tayLinhPill.quantity -= tayLinhCost;
  if (tayLinhPill.quantity <= 0) {
    inv.pills = (inv.pills || []).filter(p => p !== tayLinhPill);
  }
  updated.inventory = inv;

  const curPurity = currentRoot.purity || (currentTier * 15);
  const purityGain = 20 + Math.floor(Math.random() * 15);
  const newPurity = curPurity + purityGain;

  let tierUp = false;
  let newLinhCan: LinhCan = { ...currentRoot, purity: newPurity };

  if (newPurity >= 100) {
    tierUp = true;
    const nextTier = currentTier + 1;
    const tierInfo = LINH_CAN_TIERS.find(t => t.tier === nextTier) || LINH_CAN_TIERS[LINH_CAN_TIERS.length - 1];
    
    let targetElem: LinhCanElement = currentRoot.element;
    if (nextTier === 6) targetElem = 'ngu_hanh';
    else if (nextTier === 5 && !['loi', 'phong', 'bang', 'quang', 'am'].includes(targetElem)) {
      const mutantElems: LinhCanElement[] = ['loi', 'phong', 'bang'];
      targetElem = mutantElems[Math.floor(Math.random() * mutantElems.length)];
    }

    const elemIcon = ELEMENT_ICONS[targetElem] || '✨';
    const elemName = ELEMENT_NAMES[targetElem] || targetElem;

    newLinhCan = {
      name: `${elemIcon} ${tierInfo.grade} • ${elemName}`,
      element: targetElem,
      grade: tierInfo.grade,
      description: tierInfo.description,
      damageBonus: tierInfo.minDamageBonus + Math.floor(Math.random() * (tierInfo.maxDamageBonus - tierInfo.minDamageBonus + 1)),
      speedBonus: tierInfo.minSpeedBonus + Math.floor(Math.random() * (tierInfo.maxSpeedBonus - tierInfo.minSpeedBonus + 1)),
      purity: 10,
      tier: nextTier
    };
  }

  updated.linhCan = newLinhCan;
  const msg = tierUp
    ? `🎉 THĂNG HOA LINH CĂN ĐẠI THÀNH! Linh căn vượt bậc thăng hoa lên [${newLinhCan.name}] (${newLinhCan.grade})! Tốc độ tu luyện và sát thương tăng vọt!`
    : `✨ Tinh lọc tạp chất thành công! Độ tinh thuần Linh Căn tăng lên ${newPurity}% (Cần 100% để thăng phẩm).`;

  return {
    success: true,
    updatedPlayer: updated,
    message: msg,
    tierUp,
    newLinhCan
  };
}

export function generateRandomLinhCan(): LinhCan {
  const rand = Math.floor(Math.random() * PRESET_EXPANDED_LINH_CAN.length);
  return PRESET_EXPANDED_LINH_CAN[rand];
}

// ============================================
