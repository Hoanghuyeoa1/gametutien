// lib/pill-consumption-logic.ts
// Pure Domain Logic: Kiểm tra điều kiện, xử lý đan độc và áp dụng hiệu ứng khi cắn thuốc từ Nhất Giai đến Cửu Giai

import { PlayerStats, Pill, PillDefinition } from './types';
import { PILL_DEFINITIONS_MAP } from './pill-tier-data';

export interface UsePillResult {
  success: boolean;
  message: string;
  updatedPlayer: PlayerStats;
  consumedCount: number;
  logType?: 'alchemy' | 'breakthrough' | 'cultivation' | 'system' | 'danger';
}

/**
 * Hàm tiêu thụ đan dược chuẩn xác, an toàn, tuân thủ Clean Architecture
 */
export function usePillItem(
  player: PlayerStats,
  pillItemOrId: Pill | PillDefinition | string,
  quantity: number = 1
): UsePillResult {
  if (quantity <= 0) {
    return {
      success: false,
      message: 'Số lượng sử dụng không hợp lệ!',
      updatedPlayer: player,
      consumedCount: 0,
    };
  }

  // Xác định PillDefinition
  let pillId: string;
  let pillDef: PillDefinition | undefined;

  if (typeof pillItemOrId === 'string') {
    pillId = pillItemOrId;
    pillDef = PILL_DEFINITIONS_MAP[pillId];
  } else if ('effects' in pillItemOrId && 'tier' in pillItemOrId) {
    pillDef = pillItemOrId as PillDefinition;
    pillId = pillDef.id;
  } else {
    pillId = (pillItemOrId as Pill).id;
    pillDef = PILL_DEFINITIONS_MAP[pillId] || (pillItemOrId as any).data?.pillDefinition;
  }

  // 1. Kiểm tra tồn tại đan dược trong túi đồ
  const inv = player.inventory || { pills: [], herbs: [], ores: [] };
  const targetPillIndex = (inv.pills || []).findIndex(p => p.id === pillId);
  const targetPill = targetPillIndex !== -1 ? inv.pills[targetPillIndex] : undefined;

  const currentAvailable = targetPill ? targetPill.quantity : 0;
  if (!targetPill || currentAvailable <= 0) {
    return {
      success: false,
      message: 'Trong Túi Đồ không còn đan dược này!',
      updatedPlayer: player,
      consumedCount: 0,
    };
  }

  const actualConsumeCount = Math.min(quantity, currentAvailable);

  // Nếu là đan dược trong danh mục 36 Đan Dược Cửu Giai
  if (pillDef) {
    const currentRealm = player.currentRealm || 0;

    // 2. Kiểm tra Cảnh Giới tối thiểu
    if (currentRealm < pillDef.requiredRealmIndex) {
      return {
        success: false,
        message: `🔒 Cảnh giới chưa đủ để hấp thu [${pillDef.name}]! Cần đạt tối thiểu [${pillDef.requiredRealmName}].`,
        updatedPlayer: player,
        consumedCount: 0,
      };
    }

    // 3. Kiểm tra Giới Hạn Dùng Trong 1 Đại Cảnh Giới (maxUsagePerRealm)
    const usageMap = player.pillUsageInRealm || {};
    const realmUsages = usageMap[currentRealm] || {};
    const usedInThisRealm = realmUsages[pillDef.id] || 0;

    if (pillDef.maxUsagePerRealm !== undefined) {
      if (usedInThisRealm >= pillDef.maxUsagePerRealm) {
        return {
          success: false,
          message: `⚠️ Đã đạt cực hạn sử dụng [${pillDef.name}] trong cảnh giới này (${usedInThisRealm}/${pillDef.maxUsagePerRealm} viên)! Hãy đột phá cảnh giới mới để tiếp tục dùng.`,
          updatedPlayer: player,
          consumedCount: 0,
        };
      }
    }

    // Tính toán số lượng thực tế có thể dùng nếu có giới hạn
    let canUseCount = actualConsumeCount;
    if (pillDef.maxUsagePerRealm !== undefined) {
      const remainingLimit = Math.max(0, pillDef.maxUsagePerRealm - usedInThisRealm);
      canUseCount = Math.min(canUseCount, remainingLimit);
      if (canUseCount <= 0) {
        return {
          success: false,
          message: `⚠️ Đã đạt cực hạn sử dụng [${pillDef.name}] trong cảnh giới này!`,
          updatedPlayer: player,
          consumedCount: 0,
        };
      }
    }

    // 4. Kiểm tra Cơ Chế Kháng Đan Độc / Giới Hạn Cắn Thuốc (Toxicity)
    const currentToxicity = player.pillToxicity || 0;
    const toxPerUnit = pillDef.effects.toxicityPercent || 0;

    if (toxPerUnit > 0) {
      if (currentToxicity >= 100) {
        return {
          success: false,
          message: `⚠️ Đan độc trong kinh mạch đã đạt ngưỡng bão hòa (100%)! Ngươi cảm thấy khí huyết nghịch lưu, cần vận công thổ nạp hoặc dùng Bổ Thiên Đan thanh lọc đan độc trước!`,
          updatedPlayer: player,
          consumedCount: 0,
          logType: 'danger',
        };
      }

      // Giới hạn số viên có thể nuốt trước khi đan độc chạm 100%
      const maxPillsBeforeMaxTox = Math.max(1, Math.floor((100 - currentToxicity) / toxPerUnit));
      canUseCount = Math.min(canUseCount, maxPillsBeforeMaxTox);
    }

    // 5. Khởi tạo đối tượng player cập nhật
    const updated: PlayerStats = {
      ...player,
      inventory: {
        ...inv,
        pills: inv.pills
          .map(p => (p.id === pillId ? { ...p, quantity: p.quantity - canUseCount } : p))
          .filter(p => p.quantity > 0),
      },
    };

    // 6. Cập nhật Đan Độc
    const toxDelta = toxPerUnit * canUseCount;
    updated.pillToxicity = Math.min(100, Math.max(0, (player.pillToxicity || 0) + toxDelta));

    // 7. Cập nhật Số Lần Dùng Trong Cảnh Giới
    if (pillDef.maxUsagePerRealm !== undefined) {
      updated.pillUsageInRealm = {
        ...usageMap,
        [currentRealm]: {
          ...realmUsages,
          [pillDef.id]: usedInThisRealm + canUseCount,
        },
      };
    }

    // 8. Áp dụng hiệu ứng từ effects
    const eff = pillDef.effects;
    const logs: string[] = [];

    // Tu Vi
    if (eff.tuViGain) {
      const gain = eff.tuViGain * canUseCount;
      updated.tuVi = (updated.tuVi || 0) + gain;
      logs.push(`Tu Vi +${gain.toLocaleString()}`);
    }

    // Tỷ lệ đột phá
    if (eff.breakthroughBonusPercent) {
      const bonus = eff.breakthroughBonusPercent * canUseCount;
      updated.breakthroughBonusPercent = (updated.breakthroughBonusPercent || 0) + bonus;
      updated.activeBuffs = {
        ...(updated.activeBuffs || {}),
        breakthroughBonus: ((updated.activeBuffs?.breakthroughBonus) || 0) + bonus,
      };
      logs.push(`Tỷ Lệ Đột Phá +${bonus}%`);
    }

    // Thọ nguyên
    if (eff.lifespanYears) {
      const lifeGain = eff.lifespanYears * canUseCount;
      updated.maxLifespan = (updated.maxLifespan || 100) + lifeGain;
      updated.lifespanPillsUsed = (updated.lifespanPillsUsed || 0) + lifeGain;
      if (updated.lifespan) {
        updated.lifespan = {
          ...updated.lifespan,
          maxAge: (updated.lifespan.maxAge || 100) + lifeGain,
        };
      }
      logs.push(`Thọ Nguyên +${lifeGain} năm`);
    }

    // Căn Cốt
    if (eff.canCotBonus) {
      const val = eff.canCotBonus * canUseCount;
      updated.canCot = (updated.canCot || 10) + val;
      logs.push(`Căn Cốt +${val}`);
    }

    // Ngộ Tính
    if (eff.ngoTinhBonus) {
      const val = eff.ngoTinhBonus * canUseCount;
      updated.ngoTinh = (updated.ngoTinh || 10) + val;
      logs.push(`Ngộ Tính +${val}`);
    }

    // Khí Vận
    if (eff.khiVanBonus) {
      const val = eff.khiVanBonus * canUseCount;
      updated.khiVan = (updated.khiVan || 10) + val;
      logs.push(`Khí Vận +${val}`);
    }

    // Thần Thức
    if (eff.thanThucBonus) {
      const val = eff.thanThucBonus * canUseCount;
      updated.thanThuc = (updated.thanThuc || 10) + val;
      logs.push(`Thần Thức +${val}`);
    }

    // Khí Huyết hồi phục
    if (eff.fullHeal) {
      const maxHp = updated.maxKhiHuyet || 200;
      updated.khiHuyet = maxHp;
      logs.push(`Khí Huyết hồi phục 100%`);
    }

    // Miễn tử 1 lần
    if (eff.preventDeathOnce) {
      updated.hasDeathImmunity = true;
      logs.push(`Thần huyễn Hộ Mạng: Miễn Tử 1 Lần`);
    }

    // Giảm sát thương lôi kiếp
    if (eff.reduceTribulationDamagePercent) {
      updated.tribulationDamageReduction = Math.max(
        updated.tribulationDamageReduction || 0,
        eff.reduceTribulationDamagePercent
      );
      logs.push(`Giảm Sát Thương Lôi Kiếp ${eff.reduceTribulationDamagePercent}%`);
    }

    // Thông điệp kết quả
    const effectSummary = logs.join(' • ');
    const toxNotice = toxDelta > 0
      ? ` (Đan độc: ${updated.pillToxicity}%)`
      : toxDelta < 0
      ? ` (Thanh lọc ${Math.abs(toxDelta)}% đan độc, còn: ${updated.pillToxicity}%)`
      : '';

    return {
      success: true,
      message: `✨ Phục dụng thành công ${canUseCount} viên [${pillDef.name}]! ${effectSummary}${toxNotice}`,
      updatedPlayer: updated,
      consumedCount: canUseCount,
      logType: 'alchemy',
    };
  }

  // Fallback cho đan dược thông thường cũ (legacy fallback)
  const canUseCount = 1;
  const updated: PlayerStats = {
    ...player,
    inventory: {
      ...inv,
      pills: inv.pills
        .map(p => (p.id === pillId ? { ...p, quantity: p.quantity - canUseCount } : p))
        .filter(p => p.quantity > 0),
    },
  };

  const tuViG = targetPill.tuViGain || (targetPill.effectType === 'exp' ? targetPill.effectValue : 0);
  if (tuViG) {
    updated.tuVi = (updated.tuVi || 0) + tuViG;
  }

  return {
    success: true,
    message: `Đã dùng 1 viên [${targetPill.name}].`,
    updatedPlayer: updated,
    consumedCount: 1,
    logType: 'alchemy',
  };
}
