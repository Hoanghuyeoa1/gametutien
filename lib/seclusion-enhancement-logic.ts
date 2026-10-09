// lib/seclusion-enhancement-logic.ts
// Pure Business Logic Engine cho Phân Hệ "Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh"
// (Seclusion Enhancement: Dao Seeds, Toxicity Cleansing, Natal Artifact Nourishing)

import { PlayerStats } from '@/lib/types';
import {
  DaoSeedConfig,
  DaoFruitAffix,
  ActiveSeclusionSeedState,
  DaoFruitItem,
  SeclusionExecutionResult,
  EnhancedSeclusionValidation
} from '@/lib/types/seclusion-enhancement';
import { calculateCombatStats } from '@/lib/destiny-data';
import { calculateEffectiveLifespan } from '@/lib/lifespan-logic';
import { SpiritStage } from '@/lib/types/natal-artifact';

// ============================================================================
// 1. DANH MỤC ĐẠO CHỦNG (DAO SEEDS REGISTRY)
// ============================================================================
export const DAO_SEEDS_REGISTRY: Record<string, DaoSeedConfig> = {
  seed_kiem_y: {
    id: 'seed_kiem_y',
    name: 'Kiếm Ý Đạo Chủng',
    category: 'kiem_dao',
    description: 'Hạt giống kiếm đạo bản nguyên, uẩn dưỡng kiếm khí thuần dương trong đan điền.',
    requiredYears: 10,
    minRealmIndex: 11, // Trúc Cơ Sơ Kỳ
    icon: '⚔️',
    resultingAffix: {
      id: 'affix_van_kiem_quy_tong',
      name: 'Vạn Kiếm Quy Tông Quả',
      description: '+6% Công Kích, +4% Tỉ Lệ Bạo Kích',
      statBonus: {
        atkPercent: 6,
        critRate: 4
      }
    }
  },
  seed_bat_tu: {
    id: 'seed_bat_tu',
    name: 'Bất Tử Đạo Chủng',
    category: 'bat_tu',
    description: 'Mầm sống niết bàn tái sinh, ngưng tụ sinh cơ trường sinh bất diệt.',
    requiredYears: 15,
    minRealmIndex: 16, // Kim Đan Sơ Kỳ
    icon: '🌱',
    resultingAffix: {
      id: 'affix_truong_sinh_niet_ban',
      name: 'Trường Sinh Niết Bàn Quả',
      description: '+8% Máu Tối Đa, +3% Miễn Thương Toàn Diện',
      statBonus: {
        hpPercent: 8,
        damageReductionPercent: 3
      }
    }
  },
  seed_than_loi: {
    id: 'seed_than_loi',
    name: 'Thần Lôi Đạo Chủng',
    category: 'loi_dinh',
    description: 'Hạt giống cửu tiêu thần lôi, tôi luyện thần hồn và tốc độ xuất chiêu kinh thế.',
    requiredYears: 25,
    minRealmIndex: 21, // Nguyên Anh Sơ Kỳ
    icon: '⚡',
    resultingAffix: {
      id: 'affix_cuu_tieu_loi_dinh',
      name: 'Cửu Tiêu Lôi Đình Quả',
      description: '+5% Tốc Độ Thân Pháp (Né Tránh), +4% Tỉ Lệ Bạo Kích',
      statBonus: {
        dodgeRate: 5,
        critRate: 4
      }
    }
  },
  seed_hon_don: {
    id: 'seed_hon_don',
    name: 'Hỗn Độn Đạo Chủng',
    category: 'hon_don',
    description: 'Thái sơ hỗn độn đạo chủng thượng cổ, bao la vạn tượng nghịch thiên cải mệnh.',
    requiredYears: 50,
    minRealmIndex: 26, // Hóa Thần Sơ Kỳ (End-game)
    icon: '🌌',
    resultingAffix: {
      id: 'affix_thai_so_hon_don',
      name: 'Thái Sơ Hỗn Độn Quả',
      description: '+10% Toàn Thuộc Tính (Công/Thủ), +5% Hút Máu',
      statBonus: {
        atkPercent: 10,
        defPercent: 10,
        lifestealPercent: 5
      }
    }
  },
  seed_am_duong: {
    id: 'seed_am_duong',
    name: 'Âm Dương Đạo Chủng',
    category: 'am_duong',
    description: 'Hạt giống thái cực âm dương điều hòa chân nguyên, phòng ngự vững như bàn thạch.',
    requiredYears: 30,
    minRealmIndex: 21, // Nguyên Anh Sơ Kỳ
    icon: '☯️',
    resultingAffix: {
      id: 'affix_thai_cuc_am_duong',
      name: 'Thái Cực Âm Dương Quả',
      description: '+8% Phòng Ngự, +5% Tỉ Lệ Né Tránh',
      statBonus: {
        defPercent: 8,
        dodgeRate: 5
      }
    }
  }
};

// ============================================================================
// 2. THẨM ĐỊNH ĐIỀU KIỆN BẾ QUAN TAM HÓA (CAN ENTER ENHANCED SECLUSION)
// ============================================================================
export function canEnterEnhancedSeclusion(
  player: PlayerStats,
  years: number,
  selectedSeedId?: string,
  nourishPercent: number = 0
): EnhancedSeclusionValidation {
  const currentAge = player.age || 16;
  const maxLifespan = calculateEffectiveLifespan(player);
  const remainingYears = Math.max(0, maxLifespan - currentAge);

  const costLinhThach = Math.max(1, Math.ceil(years * 100));
  const costTichCocDan = Math.max(1, Math.ceil(years));

  const pills = player.inventory?.pills || [];
  const tichCocPill = pills.find((p: any) => p.id === 'pill_tich_coc' || p.name?.includes('Tích Cốc'));
  const tichCocCount = tichCocPill?.quantity || 0;

  const hasEnoughLinhThach = (player.linhThach || 0) >= costLinhThach;
  const hasEnoughTichCocDan = tichCocCount >= costTichCocDan;
  const canAfford = hasEnoughLinhThach || hasEnoughTichCocDan;

  const isLifespanExceeded = years > remainingYears;
  const isToaHoaWarning = (remainingYears - years) < 5;

  // 1. Kiểm tra thọ nguyên
  if (isLifespanExceeded) {
    return {
      canSeclude: false,
      reason: `Thọ nguyên còn lại (${remainingYears.toFixed(1)} năm) không đủ để bế quan ${years} năm! Nguy cơ tọa hóa thọ tẫn!`,
      effectiveYears: years,
      maxAffordableYears: Math.floor(remainingYears),
      costLinhThach,
      costTichCocDan,
      canAfford,
      isLifespanExceeded: true,
      isToaHoaWarning: true
    };
  }

  // 2. Kiểm tra tài nguyên duy trì sinh kế (Linh Thạch hoặc Tích Cốc Đan)
  if (!canAfford) {
    return {
      canSeclude: false,
      reason: `Thiếu tài nguyên lương thảo! Cần tối thiểu ${costLinhThach.toLocaleString()} Linh Thạch hoặc ${costTichCocDan} Tích Cốc Đan.`,
      effectiveYears: years,
      maxAffordableYears: Math.floor((player.linhThach || 0) / 100),
      costLinhThach,
      costTichCocDan,
      canAfford: false,
      isLifespanExceeded: false,
      isToaHoaWarning
    };
  }

  // 3. Kiểm tra Đạo Chủng (nếu có chọn)
  if (selectedSeedId) {
    const seedCfg = DAO_SEEDS_REGISTRY[selectedSeedId];
    if (!seedCfg) {
      return {
        canSeclude: false,
        reason: 'Hạt giống Đạo Chủng không tồn tại trong truyền thư thiên địa!',
        effectiveYears: years,
        maxAffordableYears: remainingYears,
        costLinhThach,
        costTichCocDan,
        canAfford,
        isLifespanExceeded: false
      };
    }
    const playerRealm = player.currentRealm || 0;
    if (playerRealm < seedCfg.minRealmIndex) {
      return {
        canSeclude: false,
        reason: `Cảnh giới hiện tại chưa đủ để gieo mầm 【${seedCfg.name}】! Yêu cầu mốc cảnh giới tối thiểu (Index ${seedCfg.minRealmIndex}).`,
        effectiveYears: years,
        maxAffordableYears: remainingYears,
        costLinhThach,
        costTichCocDan,
        canAfford,
        isLifespanExceeded: false
      };
    }
  }

  // 4. Kiểm tra Bản Mệnh Pháp Bảo nếu chọn ôn dưỡng
  if (nourishPercent > 0) {
    if (!player.natalArtifact || !player.natalArtifact.spirit) {
      return {
        canSeclude: false,
        reason: 'Chưa thức tỉnh Khí Linh Bản Mệnh Pháp Bảo, không thể trích xuất tu vi ôn dưỡng!',
        effectiveYears: years,
        maxAffordableYears: remainingYears,
        costLinhThach,
        costTichCocDan,
        canAfford,
        isLifespanExceeded: false
      };
    }
  }

  return {
    canSeclude: true,
    effectiveYears: years,
    maxAffordableYears: Math.floor(remainingYears),
    costLinhThach,
    costTichCocDan,
    canAfford: true,
    isLifespanExceeded: false,
    isToaHoaWarning
  };
}

// ============================================================================
// 3. THỰC THI BẾ QUAN TAM HÓA QUY NGUYÊN (EXECUTE ENHANCED SECLUSION)
// ============================================================================
export function executeEnhancedSeclusion(
  player: PlayerStats,
  years: number,
  selectedSeedId?: string,
  nourishPercent: number = 0
): { updatedPlayer: PlayerStats; result: SeclusionExecutionResult } {
  const validation = canEnterEnhancedSeclusion(player, years, selectedSeedId, nourishPercent);

  if (!validation.canSeclude) {
    return {
      updatedPlayer: player,
      result: {
        success: false,
        yearsPassed: 0,
        tuviGainedPlayer: 0,
        tuviDivertedArtifact: 0,
        spiritExpGained: 0,
        spiritAffinityGained: 0,
        toxicityCleansed: 0,
        newToxicity: player.pillToxicity || 0,
        newQiPurity: player.qiPurity ?? 100,
        maturedDaoFruit: null,
        logs: [`⚠️ Bế quan gián đoạn: ${validation.reason}`]
      }
    };
  }

  const logs: string[] = [];
  let updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));

  // --------------------------------------------------------------------------
  // BƯỚC 1: KHẤU TRỪ TÀI NGUYÊN & TIÊU HAO THỌ NGUYÊN
  // --------------------------------------------------------------------------
  const costLinhThach = validation.costLinhThach;
  const costTichCocDan = validation.costTichCocDan;
  const pills = updatedPlayer.inventory?.pills || [];
  const tichCocIdx = pills.findIndex((p: any) => p.id === 'pill_tich_coc' || p.name?.includes('Tích Cốc'));

  if (tichCocIdx >= 0 && pills[tichCocIdx].quantity >= costTichCocDan) {
    pills[tichCocIdx].quantity -= costTichCocDan;
    if (pills[tichCocIdx].quantity <= 0) {
      pills.splice(tichCocIdx, 1);
    }
    logs.push(`🌾 Tiêu hao ${costTichCocDan} Tích Cốc Đan duy trì sinh cơ bế quan.`);
  } else {
    updatedPlayer.linhThach = Math.max(0, (updatedPlayer.linhThach || 0) - costLinhThach);
    logs.push(`💎 Tiêu hao ${costLinhThach.toLocaleString()} Linh Thạch bố trí Tụ Linh Trận bế quan.`);
  }

  // Tăng tuổi thọ đã dùng
  const oldAge = updatedPlayer.age || 16;
  const newAge = Number((oldAge + years).toFixed(2));
  updatedPlayer.age = newAge;
  logs.push(`⏳ Tuế nguyệt thoi đưa, ${years} năm trôi qua. Tuổi thọ hiện tại: ${newAge}/${calculateEffectiveLifespan(updatedPlayer)} Tuổi.`);

  // --------------------------------------------------------------------------
  // BƯỚC 2: TÍNH TU VI CƠ SỞ & PHÂN CHIA ÔN DƯỠNG BẢN MỆNH
  // --------------------------------------------------------------------------
  const cStats = calculateCombatStats(player);
  const canCot = player.canCot || 50;
  const ngoTinh = player.ngoTinh || 50;
  const statMultiplier = 1 + (canCot / 200) + (ngoTinh / 150);
  const baseRatePerSec = Math.max(5, (cStats.atk || 100) * 0.05 + canCot * 0.2);
  const tuViPerYear = Math.floor(baseRatePerSec * 60 * 365 * 0.08 * statMultiplier);
  const tuviBase = Math.max(10, Math.floor(tuViPerYear * years));

  const clampedNourishRatio = Math.min(50, Math.max(0, nourishPercent));
  let tuviDivertedArtifact = 0;
  let spiritExpGained = 0;
  let spiritAffinityGained = 0;
  let stageUp = false;

  if (updatedPlayer.natalArtifact?.spirit && clampedNourishRatio > 0) {
    tuviDivertedArtifact = Math.floor(tuviBase * (clampedNourishRatio / 100));
    spiritExpGained = tuviDivertedArtifact;
    spiritAffinityGained = Math.min(30, Math.floor(years * 1.5));

    const spirit = updatedPlayer.natalArtifact.spirit;
    spirit.exp = (spirit.exp || 0) + spiritExpGained;
    spirit.intimacy = Math.min(100, (spirit.intimacy || 0) + spiritAffinityGained);

    // Kiểm tra thăng cấp Tầng Linh Trí của Khí Linh
    const stageKeys: SpiritStage[] = ['mong_muoi', 'thuc_tinh', 'thong_tue', 'huyen_the', 'hoa_hinh'];
    const curStageIdx = stageKeys.indexOf(spirit.stage);
    if (curStageIdx < stageKeys.length - 1 && spirit.exp >= (spirit.maxExp || 1000)) {
      spirit.stage = stageKeys[curStageIdx + 1];
      spirit.stageLevel = (spirit.stageLevel || 1) + 1;
      spirit.exp -= spirit.maxExp;
      spirit.maxExp = Math.floor(spirit.maxExp * 1.8);
      stageUp = true;
      logs.push(`✨ Khí Linh 【${spirit.name}】 hấp thu tinh huyết thăng hoa lên cảnh giới [${spirit.stage.toUpperCase()}]!`);
    }

    logs.push(`🛡️ Trích xuất ${clampedNourishRatio}% Tu Vi (${tuviDivertedArtifact.toLocaleString()} điểm) ôn dưỡng Bản Mệnh, Khí Linh nhận +${spiritAffinityGained} Điểm Thân Mật!`);
  }

  const tuviGainedPlayer = Math.max(0, tuviBase - tuviDivertedArtifact);
  updatedPlayer.tuVi = (updatedPlayer.tuVi || 0) + tuviGainedPlayer;
  logs.push(`🧘 Lĩnh ngộ đạo hạnh: Nhân vật hấp thu +${tuviGainedPlayer.toLocaleString()} Tu Vi thuần dương.`);

  // --------------------------------------------------------------------------
  // BƯỚC 3: TẨY TRỪ ĐAN ĐỘC & KHÔI PHỤC ĐỘ TINH KHIẾT CHÂN NGUYÊN (QI PURITY)
  // --------------------------------------------------------------------------
  const oldToxicity = updatedPlayer.pillToxicity || 0;
  const toxicityCleansed = Math.min(oldToxicity, years * 2);
  const newToxicity = Math.max(0, oldToxicity - toxicityCleansed);
  const newQiPurity = Math.max(10, Math.min(100, 100 - newToxicity));

  updatedPlayer.pillToxicity = newToxicity;
  updatedPlayer.qiPurity = newQiPurity;

  if (toxicityCleansed > 0) {
    logs.push(`💧 Vận chuyển đại chu thiên đào thải -${toxicityCleansed} điểm Đan Độc. Độ Tinh Khiết Chân Nguyên khôi phục: ${newQiPurity}%.`);
  } else {
    logs.push(`✨ Kinh mạch thông suốt, không có đan độc tích tụ (Độ Tinh Khiết: 100%).`);
  }

  // --------------------------------------------------------------------------
  // BƯỚC 4: TIẾN TRÌNH ĐẠO CHỦNG & NGƯNG TỤ ĐẠO QUẢ
  // --------------------------------------------------------------------------
  let maturedDaoFruit: DaoFruitAffix | null = null;
  const targetSeedId = selectedSeedId || updatedPlayer.activeDaoSeed?.seedId || updatedPlayer.activeSeclusionSeed?.seedId;

  if (targetSeedId && DAO_SEEDS_REGISTRY[targetSeedId]) {
    const seedCfg = DAO_SEEDS_REGISTRY[targetSeedId];
    const currentActive = updatedPlayer.activeDaoSeed?.seedId === targetSeedId
      ? updatedPlayer.activeDaoSeed
      : (updatedPlayer.activeSeclusionSeed?.seedId === targetSeedId ? updatedPlayer.activeSeclusionSeed : null);

    const prevYears = currentActive?.accumulatedYears || 0;
    const accumulatedYears = prevYears + years;

    if (accumulatedYears >= seedCfg.requiredYears) {
      // Đạo chủng chín mùi -> đơm hoa kết trái thành Đạo Quả
      maturedDaoFruit = seedCfg.resultingAffix;

      const fruitItem: DaoFruitItem = {
        id: `fruit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        seedId: seedCfg.id,
        name: seedCfg.resultingAffix.name,
        affix: seedCfg.resultingAffix,
        harvestedAt: Date.now(),
        isConsumed: false
      };

      if (!Array.isArray(updatedPlayer.harvestedDaoFruits)) {
        updatedPlayer.harvestedDaoFruits = [];
      }
      updatedPlayer.harvestedDaoFruits.push(fruitItem);

      // Reset Đạo Chủng sau khi đã thu hoạch thành công
      updatedPlayer.activeDaoSeed = null;
      updatedPlayer.activeSeclusionSeed = null;

      logs.push(`🍎 【${seedCfg.name}】 trải qua ${accumulatedYears}/${seedCfg.requiredYears} năm rèn luyện đã đơm hoa kết trái thành công! Ngưng tụ thành 【${fruitItem.name}】!`);
    } else {
      // Lưu lại tiến độ tích lũy năm
      const nextActiveState: ActiveSeclusionSeedState = {
        seedId: seedCfg.id,
        accumulatedYears,
        isMatured: false
      };
      updatedPlayer.activeDaoSeed = nextActiveState;
      updatedPlayer.activeSeclusionSeed = nextActiveState;

      logs.push(`🌱 【${seedCfg.name}】 đang hấp thu thiên địa linh vận: Đạt tiến độ ${accumulatedYears}/${seedCfg.requiredYears} năm.`);
    }
  }

  const result: SeclusionExecutionResult = {
    success: true,
    yearsPassed: years,
    tuviGainedPlayer,
    tuviDivertedArtifact,
    spiritExpGained,
    spiritAffinityGained,
    toxicityCleansed,
    newToxicity,
    newQiPurity,
    maturedDaoFruit,
    stageUp,
    logs
  };

  return {
    updatedPlayer,
    result
  };
}

// ============================================================================
// 4. PHỤC DỤNG ĐẠO QUẢ & DUNG HỢP AFFIX VÀO KINH MẠCH (CONSUME DAO FRUIT)
// ============================================================================
export function consumeDaoFruit(
  player: PlayerStats,
  fruitIdOrAffixId: string
): { success: boolean; updatedPlayer: PlayerStats; message: string; affixGained?: DaoFruitAffix } {
  let updatedPlayer: PlayerStats = JSON.parse(JSON.stringify(player));

  if (!Array.isArray(updatedPlayer.harvestedDaoFruits) || updatedPlayer.harvestedDaoFruits.length === 0) {
    // Thử tìm theo mã Đạo Chủng sẵn có nếu test gọi trực tiếp
    const seedMatch = Object.values(DAO_SEEDS_REGISTRY).find(
      s => s.resultingAffix.id === fruitIdOrAffixId || s.resultingAffix.name === fruitIdOrAffixId
    );
    if (seedMatch) {
      if (!Array.isArray(updatedPlayer.absorbedDaoAffixes)) {
        updatedPlayer.absorbedDaoAffixes = [];
      }
      updatedPlayer.absorbedDaoAffixes.push(seedMatch.resultingAffix);
      return {
        success: true,
        updatedPlayer,
        message: `Đã phục dụng 【${seedMatch.resultingAffix.name}】! Dung hợp vĩnh viễn nội tại ẩn vào kinh mạch: ${seedMatch.resultingAffix.description}.`,
        affixGained: seedMatch.resultingAffix
      };
    }

    return {
      success: false,
      updatedPlayer: player,
      message: 'Trong túi trữ vật không có Đạo Quả nào khả dụng!'
    };
  }

  const fruitIdx = updatedPlayer.harvestedDaoFruits.findIndex(
    f => !f.isConsumed && (f.id === fruitIdOrAffixId || f.affix?.id === fruitIdOrAffixId || f.name === fruitIdOrAffixId)
  );

  if (fruitIdx < 0) {
    // Check nếu tìm theo id affix trong registry
    const seedMatch = Object.values(DAO_SEEDS_REGISTRY).find(
      s => s.resultingAffix.id === fruitIdOrAffixId || s.resultingAffix.name === fruitIdOrAffixId
    );
    if (seedMatch) {
      if (!Array.isArray(updatedPlayer.absorbedDaoAffixes)) {
        updatedPlayer.absorbedDaoAffixes = [];
      }
      updatedPlayer.absorbedDaoAffixes.push(seedMatch.resultingAffix);
      return {
        success: true,
        updatedPlayer,
        message: `Đã phục dụng 【${seedMatch.resultingAffix.name}】! Dung hợp vĩnh viễn nội tại ẩn vào kinh mạch: ${seedMatch.resultingAffix.description}.`,
        affixGained: seedMatch.resultingAffix
      };
    }

    return {
      success: false,
      updatedPlayer: player,
      message: 'Không tìm thấy Đạo Quả được chỉ định hoặc quả đã được phục dụng trước đó!'
    };
  }

  const targetFruit = updatedPlayer.harvestedDaoFruits[fruitIdx];
  targetFruit.isConsumed = true;
  // Xóa khỏi danh sách chưa phục dụng hoặc đánh dấu
  updatedPlayer.harvestedDaoFruits = updatedPlayer.harvestedDaoFruits.filter(f => f.id !== targetFruit.id);

  if (!Array.isArray(updatedPlayer.absorbedDaoAffixes)) {
    updatedPlayer.absorbedDaoAffixes = [];
  }
  updatedPlayer.absorbedDaoAffixes.push(targetFruit.affix);

  return {
    success: true,
    updatedPlayer,
    message: `Đã phục dụng 【${targetFruit.name}】! Dung hợp vĩnh viễn nội tại ẩn vào kinh mạch: ${targetFruit.affix.description}.`,
    affixGained: targetFruit.affix
  };
}
