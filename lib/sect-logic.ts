import {
  PlayerStats,
  SectData,
  SectTier,
  SectSpecialty,
  SpiritVein,
  SectGuardianArray,
  SectState
} from '@/lib/types';
import realmsDataRaw from '@/data/realms-data.json';
import { calculateCombatStats } from '@/lib/destiny-data';
import {
  SECT_ARRAY_LEVELS_CONFIG,
  SECT_SPIRIT_VEINS_CONFIG,
  getSectVeinById,
  SECT_LIST
} from '@/lib/sect-data';

export interface SectJoinCheckResult {
  canJoin: boolean;
  missingReasons: string[];
}

/**
 * Chuyển đổi phẩm cấp Linh Căn sang số nguyên (1..6) để tiện đối chiếu thứ bậc
 */
export function getLinhCanGradeValue(grade?: string): number {
  if (!grade) return 1;
  const g = grade.toLowerCase().trim();

  if (g.includes('hon_don') || g.includes('hỗn độn')) return 6;
  if (g.includes('bien_di') || g.includes('biến dị') || g.includes('thiên phẩm')) return 5;
  if (g.includes('thien') || g.includes('thiên') || g.includes('cực phẩm')) return 4;
  if (g.includes('dia') || g.includes('địa') || g.includes('thượng phẩm')) return 3;
  if (g.includes('chan') || g.includes('chân') || g.includes('trung phẩm')) return 2;
  if (g.includes('tap') || g.includes('tạp') || g.includes('hạ phẩm')) return 1;

  return 1;
}

/**
 * Lấy tên hiển thị chuẩn hóa cho phẩm cấp Linh Căn
 */
export function getLinhCanGradeName(grade?: string): string {
  const val = getLinhCanGradeValue(grade);
  switch (val) {
    case 6: return 'Hỗn Độn Linh Căn';
    case 5: return 'Biến Dị Linh Căn';
    case 4: return 'Thiên Linh Căn';
    case 3: return 'Địa Linh Căn';
    case 2: return 'Chân Linh Căn';
    case 1:
    default:
      return 'Tạp Linh Căn';
  }
}

/**
 * Tra cứu tên cảnh giới từ realms-data.json theo index
 */
export function getRealmNameByIndex(realmIndex: number): string {
  const realm = realmsDataRaw.find((r: { id: number; name: string }) => r.id === realmIndex);
  return realm ? realm.name : `Cảnh Giới #${realmIndex}`;
}

/**
 * Kiểm tra xem người chơi có thỏa mãn toàn bộ tiêu chuẩn bái nhập tông môn hay không
 */
export function checkSectJoinRequirements(player: PlayerStats, sect: SectData): SectJoinCheckResult {
  const missingReasons: string[] = [];
  const req = sect.requirements;

  // 1. Kiểm tra Cảnh Giới Khí Tu (minRealmIndex)
  const playerRealm = player.currentRealm ?? 0;
  if (playerRealm < req.minRealmIndex) {
    const reqRealmName = getRealmNameByIndex(req.minRealmIndex);
    const playerRealmName = getRealmNameByIndex(playerRealm);
    missingReasons.push(`Chưa đạt cảnh giới tu vi tối thiểu [${reqRealmName}] (hiện tại: [${playerRealmName}]).`);
  }

  // 2. Kiểm tra Căn Cốt (minCanCot)
  const playerCanCot = player.canCot ?? 0;
  if (playerCanCot < req.minCanCot) {
    missingReasons.push(`Căn Cốt chưa đủ! Cần tối thiểu ${req.minCanCot} điểm (hiện tại: ${playerCanCot}/${req.minCanCot}).`);
  }

  // 3. Kiểm tra Ngộ Tính (tùy chọn)
  if (typeof req.minNgoTinh === 'number' && req.minNgoTinh > 0) {
    const playerNgoTinh = player.ngoTinh ?? 0;
    if (playerNgoTinh < req.minNgoTinh) {
      missingReasons.push(`Ngộ Tính chưa đủ! Cần tối thiểu ${req.minNgoTinh} điểm (hiện tại: ${playerNgoTinh}/${req.minNgoTinh}).`);
    }
  }

  // 4. Kiểm tra Phẩm Cấp Linh Căn (minLinhCanGrade)
  if (req.minLinhCanGrade) {
    const requiredGradeVal = getLinhCanGradeValue(req.minLinhCanGrade);
    const playerGradeVal = getLinhCanGradeValue(player.linhCan?.grade);

    if (playerGradeVal < requiredGradeVal) {
      const reqGradeName = getLinhCanGradeName(req.minLinhCanGrade);
      const playerGradeName = getLinhCanGradeName(player.linhCan?.grade);
      missingReasons.push(`Phẩm cấp Linh Căn chưa đạt! Yêu cầu tối thiểu [${reqGradeName}] (hiện tại: [${playerGradeName}]).`);
    }
  }

  return {
    canJoin: missingReasons.length === 0,
    missingReasons
  };
}

/**
 * Lấy cấu hình màu sắc, nhãn huy hiệu cho từng Tier Tông Môn
 */
export function getTierBadgeStyle(tier: SectTier): {
  tierLabel: string;
  badgeClass: string;
  borderClass: string;
  cardBg: string;
  glowClass: string;
  dotColor: string;
} {
  switch (tier) {
    case 1:
      return {
        tierLabel: '⭐ Tier 1 • Cửu Lưu',
        badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-700/60',
        borderClass: 'border-amber-800/40 hover:border-amber-600/70',
        cardBg: 'from-[#14100c] via-[#0f0c0a] to-[#14100c]',
        glowClass: 'shadow-amber-900/20',
        dotColor: 'bg-amber-400'
      };
    case 2:
      return {
        tierLabel: '⭐⭐ Tier 2 • Lục Lưu',
        badgeClass: 'text-cyan-300 bg-cyan-950/60 border-cyan-600/60',
        borderClass: 'border-cyan-800/40 hover:border-cyan-500/70',
        cardBg: 'from-[#0a141a] via-[#080e12] to-[#0a141a]',
        glowClass: 'shadow-cyan-900/20',
        dotColor: 'bg-cyan-400'
      };
    case 3:
      return {
        tierLabel: '⭐⭐⭐ Tier 3 • Tứ Lưu',
        badgeClass: 'text-purple-300 bg-purple-950/60 border-purple-600/60',
        borderClass: 'border-purple-800/40 hover:border-purple-500/70',
        cardBg: 'from-[#130b1c] via-[#0d0714] to-[#130b1c]',
        glowClass: 'shadow-purple-900/20',
        dotColor: 'bg-purple-400'
      };
    case 4:
      return {
        tierLabel: '⭐⭐⭐⭐ Tier 4 • Nhị Lưu',
        badgeClass: 'text-yellow-300 bg-yellow-950/60 border-yellow-500/60 shadow-[0_0_8px_rgba(234,179,8,0.2)]',
        borderClass: 'border-yellow-700/50 hover:border-yellow-400/80',
        cardBg: 'from-[#1a1406] via-[#120e04] to-[#1a1406]',
        glowClass: 'shadow-yellow-900/30',
        dotColor: 'bg-yellow-400'
      };
    case 5:
      return {
        tierLabel: '👑 Tier 5 • Vạn Cổ Thánh Địa',
        badgeClass: 'text-rose-200 bg-gradient-to-r from-rose-950/80 via-purple-950/80 to-amber-950/80 border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.35)] font-bold animate-pulse',
        borderClass: 'border-rose-500/60 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
        cardBg: 'from-[#1c080e] via-[#12050b] to-[#1c080e]',
        glowClass: 'shadow-rose-900/40',
        dotColor: 'bg-rose-400'
      };
  }
}

/**
 * Lấy nhãn và icon cho trường phái môn phái
 */
export function getSpecialtyDisplay(specialty: SectSpecialty): { icon: string; name: string; tagClass: string } {
  switch (specialty) {
    case 'kiem_tu':
      return { icon: '⚔️', name: 'Kiếm Tu', tagClass: 'text-sky-300 bg-sky-950/50 border-sky-600/40' };
    case 'dan_dao':
      return { icon: '🌿', name: 'Đan Đạo', tagClass: 'text-emerald-300 bg-emerald-950/50 border-emerald-600/40' };
    case 'the_tu':
      return { icon: '🛡️', name: 'Thể Tu', tagClass: 'text-amber-300 bg-amber-950/50 border-amber-600/40' };
    case 'ma_dao':
      return { icon: '🩸', name: 'Ma Đạo', tagClass: 'text-rose-300 bg-rose-950/50 border-rose-600/40' };
    case 'tran_phu':
      return { icon: '🔯', name: 'Trận Phù', tagClass: 'text-indigo-300 bg-indigo-950/50 border-indigo-600/40' };
    case 'ngu_thu':
      return { icon: '🐾', name: 'Ngự Thú', tagClass: 'text-orange-300 bg-orange-950/50 border-orange-600/40' };
    case 'am_duong':
      return { icon: '☯️', name: 'Âm Dương', tagClass: 'text-teal-300 bg-teal-950/50 border-teal-600/40' };
    case 'hon_don':
      return { icon: '🔱', name: 'Hỗn Độn', tagClass: 'text-fuchsia-300 bg-fuchsia-950/50 border-fuchsia-600/40' };
  }
}

// ============================================
// HỆ THỐNG ĐẠI TRẬN HỘ SƠN (SECT GUARDIAN ARRAY LOGIC)
// ============================================

export interface GuardianArrayContributionResult {
  updatedArray: SectGuardianArray;
  expGained: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  message: string;
}

export function calculateFormationExpBonus(formationTier: number): number {
  switch (formationTier) {
    case 1: return 200;
    case 2: return 600;
    case 3: return 1500;
    case 4: return 4000;
    case 5:
    default:
      return 10000;
  }
}

/**
 * Đóng góp tài nguyên (Linh Thạch, Cống Hiến, Trận Bàn) vào Hộ Sơn Đại Trận
 */
export function contributeToGuardianArray(
  currentArray: SectGuardianArray,
  type: 'linhThach' | 'contribution' | 'formation',
  amountOrFormationTier: number
): GuardianArrayContributionResult {
  let expGain = 0;
  if (type === 'linhThach') {
    // 100 Linh Thạch = +10 EXP
    expGain = Math.floor(amountOrFormationTier / 10);
  } else if (type === 'contribution') {
    // 50 Cống Hiến = +25 EXP
    expGain = Math.floor(amountOrFormationTier * 0.5);
  } else if (type === 'formation') {
    // Trận Bàn theo Tier
    expGain = calculateFormationExpBonus(amountOrFormationTier);
  }

  const oldLevel = currentArray.level;
  let level = currentArray.level;
  let exp = currentArray.exp + expGain;
  let maxExp = currentArray.maxExp;
  let leveledUp = false;

  while (level < 10 && exp >= maxExp) {
    exp -= maxExp;
    level += 1;
    leveledUp = true;
    const nextCfg = SECT_ARRAY_LEVELS_CONFIG[level];
    if (nextCfg) {
      maxExp = nextCfg.maxExp;
    }
  }

  // Nếu đã đạt cấp tối đa 10
  if (level >= 10) {
    level = 10;
    const maxCfg = SECT_ARRAY_LEVELS_CONFIG[10];
    maxExp = maxCfg.maxExp;
    if (exp > maxExp) exp = maxExp;
  }

  const cfg = SECT_ARRAY_LEVELS_CONFIG[level] || SECT_ARRAY_LEVELS_CONFIG[1];
  const updatedArray: SectGuardianArray = {
    level,
    exp,
    maxExp,
    arrayName: cfg.arrayName,
    buffs: { ...cfg.buffs }
  };

  const message = leveledUp
    ? `🎉 Đại Trận thăng hoa lên Cấp ${level} [${cfg.arrayName}]! Miễn thương +${cfg.buffs.damageReduction}%, Khiên khởi đầu +${cfg.buffs.combatStartShieldHp.toLocaleString()} HP, Giảm tổn thất độ kiếp -${cfg.buffs.tribulationInjuryReduction}%!`
    : `Hiến tế thành công! Đại Trận nhận +${expGain.toLocaleString()} EXP (${exp.toLocaleString()}/${maxExp.toLocaleString()}).`;

  return {
    updatedArray,
    expGained: expGain,
    leveledUp,
    oldLevel,
    newLevel: level,
    message
  };
}

// ============================================
// HỆ THỐNG TRANH ĐOẠT LINH MẠCH (SPIRIT VEIN WARS LOGIC)
// ============================================

export interface VeinCombatResult {
  victory: boolean;
  logs: string[];
  playerRemainingHp: number;
  guardianRemainingHp: number;
  rounds: number;
  rewards: {
    contribution: number;
    linhThach: number;
    danhVong: number;
  };
}

/**
 * Mô phỏng trận chiến theo lượt tranh đoạt cứ điểm giữa người chơi và Thủ Hộ Giả NPC
 */
export function simulateVeinTurnCombat(
  player: PlayerStats,
  vein: SpiritVein
): VeinCombatResult {
  const cStats = calculateCombatStats(player);
  const playerAtk = Math.max(10, cStats.atk);
  const playerDef = Math.max(5, cStats.def);
  const playerMaxHp = Math.max(100, player.maxKhiHuyet || 500);
  const playerSpeed = Math.max(10, cStats.speed);
  const playerCrit = Math.min(85, cStats.critRate || 5);
  const playerDodge = Math.min(40, cStats.dodgeRate || 3);
  const playerDmgRed = Math.min(60, cStats.dmgReduction || 0) / 100;
  const startShield = Math.max(0, cStats.combatStartShieldHp || 0);

  const gNpc = vein.guardianNpc;
  const oppAtk = gNpc.combatStats.atk;
  const oppDef = gNpc.combatStats.def;
  const oppMaxHp = gNpc.combatStats.maxHp;
  const oppSpeed = gNpc.combatStats.speed;

  let curPlayerShield = startShield;
  let curPlayerHp = playerMaxHp;
  let curOppHp = oppMaxHp;
  const logs: string[] = [];

  const playerFirst = playerSpeed >= oppSpeed;
  logs.push(`⚔️ Khai chiến đoạt cứ điểm [${vein.name}]!`);
  logs.push(`Thủ hộ cứ điểm: ${gNpc.title} [${gNpc.name}] (Cảnh giới: ${getRealmNameByIndex(gNpc.realmIndex)}).`);
  if (curPlayerShield > 0) {
    logs.push(`🛡️ Hộ Sơn Đại Trận phát động, bao bọc ngươi bằng khiên chắn ${curPlayerShield.toLocaleString()} HP!`);
  }
  logs.push(`${playerFirst ? 'Ngươi xuất chiêu cực nhanh, chiếm tiên cơ thượng phong!' : `${gNpc.name} chiếm cứ điểm địa lợi, xuất chiêu trước!`}`);

  let round = 0;
  for (round = 1; round <= 10; round++) {
    if (curPlayerHp <= 0 || curOppHp <= 0) break;

    if (playerFirst) {
      // 1. Người chơi tấn công
      const isCrit = Math.random() * 100 < playerCrit;
      const critMul = isCrit ? (1.5 + (cStats.critDmg || 50) / 100) : 1.0;
      const baseDmg = Math.max(playerAtk * 0.4, playerAtk - oppDef * 0.5);
      const dealt = Math.max(25, Math.floor(baseDmg * critMul * (0.9 + Math.random() * 0.2)));
      curOppHp = Math.max(0, curOppHp - dealt);
      logs.push(`[Hiệp ${round}] Ngươi vận chuyển linh lực giáng ${dealt.toLocaleString()} sát thương ${isCrit ? '💥 (BẠO KÍCH!)' : ''} lên ${gNpc.name}.`);

      if (curOppHp <= 0) break;

      // 2. NPC phản kích
      const isDodged = Math.random() * 100 < playerDodge;
      if (isDodged) {
        logs.push(`[Hiệp ${round}] 💨 Thân pháp ngươi phiêu dật, né tránh đòn công kích hiểm hóc của ${gNpc.name}!`);
      } else {
        const oppBaseDmg = Math.max(oppAtk * 0.35, oppAtk - playerDef * 0.5);
        let oppDealt = Math.max(20, Math.floor(oppBaseDmg * (1 - playerDmgRed) * (0.9 + Math.random() * 0.2)));

        if (curPlayerShield > 0) {
          if (curPlayerShield >= oppDealt) {
            curPlayerShield -= oppDealt;
            logs.push(`[Hiệp ${round}] ${gNpc.name} xuất chiêu giáng ${oppDealt.toLocaleString()} sát thương nhưng bị Hộ Thuẫn cản lại (khiên còn ${curPlayerShield.toLocaleString()})!`);
            oppDealt = 0;
          } else {
            oppDealt -= curPlayerShield;
            logs.push(`[Hiệp ${round}] Đòn đánh của ${gNpc.name} đánh vỡ Hộ Thuẫn Đại Trận và gây thêm ${oppDealt.toLocaleString()} sát thương!`);
            curPlayerShield = 0;
          }
        }
        if (oppDealt > 0) {
          curPlayerHp = Math.max(0, curPlayerHp - oppDealt);
          logs.push(`[Hiệp ${round}] ${gNpc.name} thi triển pháp quyết, gây ${oppDealt.toLocaleString()} sát thương lên ngươi!`);
        }
      }
    } else {
      // 1. NPC tấn công trước
      const isDodged = Math.random() * 100 < playerDodge;
      if (isDodged) {
        logs.push(`[Hiệp ${round}] 💨 Ngươi khéo léo né tránh linh kỹ của ${gNpc.name}!`);
      } else {
        const oppBaseDmg = Math.max(oppAtk * 0.35, oppAtk - playerDef * 0.5);
        let oppDealt = Math.max(20, Math.floor(oppBaseDmg * (1 - playerDmgRed) * (0.9 + Math.random() * 0.2)));
        if (curPlayerShield > 0) {
          if (curPlayerShield >= oppDealt) {
            curPlayerShield -= oppDealt;
            logs.push(`[Hiệp ${round}] ${gNpc.name} phóng kiếm mang ${oppDealt.toLocaleString()} sát thương, bị Hộ Thuẫn hấp thụ!`);
            oppDealt = 0;
          } else {
            oppDealt -= curPlayerShield;
            logs.push(`[Hiệp ${round}] Khiên hộ thân bị phá tan! Ngươi chịu ${oppDealt.toLocaleString()} sát thương!`);
            curPlayerShield = 0;
          }
        }
        if (oppDealt > 0) {
          curPlayerHp = Math.max(0, curPlayerHp - oppDealt);
          logs.push(`[Hiệp ${round}] ${gNpc.name} chém trúng ngươi, gây ${oppDealt.toLocaleString()} sát thương!`);
        }
      }

      if (curPlayerHp <= 0) break;

      // 2. Người chơi phản công
      const isCrit = Math.random() * 100 < playerCrit;
      const critMul = isCrit ? (1.5 + (cStats.critDmg || 50) / 100) : 1.0;
      const baseDmg = Math.max(playerAtk * 0.4, playerAtk - oppDef * 0.5);
      const dealt = Math.max(25, Math.floor(baseDmg * critMul * (0.9 + Math.random() * 0.2)));
      curOppHp = Math.max(0, curOppHp - dealt);
      logs.push(`[Hiệp ${round}] Ngươi phản kích mãnh liệt, giáng ${dealt.toLocaleString()} sát thương ${isCrit ? '💥 (BẠO KÍCH!)' : ''}!`);
    }
  }

  const victory = curOppHp <= 0 || (curOppHp < curPlayerHp && curPlayerHp > 0);
  if (victory) {
    logs.push(`🏆 CHIẾN THẮNG! Đạo hữu kích bại ${gNpc.name}, thành công cắm cờ đoạt lấy [${vein.name}]!`);
  } else {
    logs.push(`💔 THẤT BẠI! Linh khí cứ điểm cạn kiệt, đạo hữu bị ${gNpc.name} đẩy lui, cần tĩnh dưỡng trước khi tái chiến.`);
  }

  return {
    victory,
    logs,
    playerRemainingHp: curPlayerHp,
    guardianRemainingHp: curOppHp,
    rounds: round,
    rewards: {
      contribution: 200,
      linhThach: 1000,
      danhVong: 100
    }
  };
}

export interface ExecuteVeinBattleResult {
  combatResult: VeinCombatResult;
  updatedPlayer: PlayerStats;
  message: string;
}

/**
 * Thực thi khiêu chiến linh mạch và cập nhật trạng thái nhân vật
 */
export function executeVeinBattle(
  player: PlayerStats,
  veinId: string
): ExecuteVeinBattleResult {
  const sectState = player.sectState;
  const playerSectId = sectState?.sectId || player.sect;
  const vein = getSectVeinById(veinId, sectState);

  if (!vein) {
    throw new Error(`Không tìm thấy linh mạch với ID: ${veinId}`);
  }

  const combatResult = simulateVeinTurnCombat(player, vein);
  let updatedSect: SectState = { ...(sectState || {
    sectId: playerSectId as any,
    rank: 'tap_dich',
    contribution: 0,
    totalContribution: 0,
    dailyQuests: [],
    unlockedRecipes: [],
    unlockedManuals: []
  }) };

  const currentVeinStates = { ...(updatedSect.veinStates || {}) };

  if (combatResult.victory && playerSectId) {
    currentVeinStates[vein.id] = {
      occupiedSectId: playerSectId,
      occupiedAt: Date.now(),
      defensePower: 1000
    };

    const currentOccupied = updatedSect.occupiedVeinIds || [];
    const newOccupied = Array.from(new Set([...currentOccupied, vein.id]));

    const newContrib = (updatedSect.contribution || 0) + combatResult.rewards.contribution;
    const newTotalContrib = (updatedSect.totalContribution || 0) + combatResult.rewards.contribution;

    updatedSect = {
      ...updatedSect,
      contribution: newContrib,
      totalContribution: newTotalContrib,
      occupiedVeinIds: newOccupied,
      veinStates: currentVeinStates,
      lastVeinWarAt: Date.now()
    };

    const updatedPlayer: PlayerStats = {
      ...player,
      linhThach: (player.linhThach || 0) + combatResult.rewards.linhThach,
      danhVong: (player.danhVong || 0) + combatResult.rewards.danhVong,
      sectContribution: newContrib,
      sectState: updatedSect,
      sectData: updatedSect
    };

    return {
      combatResult,
      updatedPlayer,
      message: `🎉 Đoạt mạch thành công! Tông môn kiểm soát [${vein.name}]. Nhận +${combatResult.rewards.contribution} Cống Hiến và +${combatResult.rewards.linhThach.toLocaleString()} Linh Thạch!`
    };
  } else {
    // Thất bại: cooldown 30 phút, giảm nhẹ HP
    updatedSect = {
      ...updatedSect,
      lastVeinWarAt: Date.now()
    };

    const updatedPlayer: PlayerStats = {
      ...player,
      khiHuyet: Math.max(10, Math.floor((player.maxKhiHuyet || 500) * 0.3)),
      sectState: updatedSect,
      sectData: updatedSect
    };

    return {
      combatResult,
      updatedPlayer,
      message: `💔 Bại trận trước Thủ Hộ Giả của [${vein.name}]! Đạo hữu bị thương nhẹ, cần 30 phút tĩnh dưỡng.`
    };
  }
}

/**
 * Mô phỏng NPC môn phái đối thủ phản công đoạt lại linh mạch (15% tỷ lệ khi bế quan hoặc qua ngày)
 */
export function checkAndTickVeinOccupation(
  veinStates: Record<string, { occupiedSectId: string | null; occupiedAt: number; defensePower: number }> | undefined,
  playerSectId: string,
  playerSectTier: SectTier
): {
  updatedVeinStates: Record<string, { occupiedSectId: string | null; occupiedAt: number; defensePower: number }>;
  lostVeinIds: string[];
  reportLogs: string[];
} {
  const currentStates = { ...(veinStates || {}) };
  const lostVeinIds: string[] = [];
  const reportLogs: string[] = [];

  // Tìm các môn phái NPC cùng Tier
  const tierSects = SECT_LIST.filter(s => s.tier === playerSectTier && s.id !== playerSectId);
  if (tierSects.length === 0) {
    return { updatedVeinStates: currentStates, lostVeinIds, reportLogs };
  }

  // Duyệt qua các mỏ của Tier này
  const tierVeins = SECT_SPIRIT_VEINS_CONFIG.filter(v => v.tier === playerSectTier);
  for (const vein of tierVeins) {
    const state = currentStates[vein.id] || {
      occupiedSectId: vein.occupiedSectId,
      occupiedAt: vein.occupiedAt,
      defensePower: vein.defensePower
    };

    // Nếu đang do tông môn người chơi chiếm giữ
    if (state.occupiedSectId === playerSectId) {
      // 15% cơ hội đối thủ phản công nếu phòng thủ chưa đạt ngưỡng tối cao (>1500)
      const incursionRoll = Math.random();
      if (incursionRoll < 0.15 && state.defensePower < 1500) {
        // NPC chiếm lại mạch
        const randomRival = tierSects[Math.floor(Math.random() * tierSects.length)];
        currentStates[vein.id] = {
          occupiedSectId: randomRival.id,
          occupiedAt: Date.now(),
          defensePower: vein.defensePower
        };
        lostVeinIds.push(vein.id);
        reportLogs.push(`⚠️ Môn phái đối thủ [${randomRival.name}] bất ngờ tập kích cứ điểm [${vein.name}] và đã tái chiếm! Cần xuất binh đoạt lại!`);
      }
    }
  }

  return {
    updatedVeinStates: currentStates,
    lostVeinIds,
    reportLogs
  };
}

/**
 * Tổng hợp toàn bộ buff đang có từ các Linh Mạch mà tông môn người chơi đang chiếm giữ
 */
export function getOccupiedVeinsBuffs(player: PlayerStats): {
  tuViSpeedBonus: number;
  herbGrowthSpeedBonus: number;
  oreYieldBonus: number;
  dailyLinhThachStipend: number;
  occupiedCount: number;
} {
  const sectState = player.sectState || player.sectData;
  const playerSectId = sectState?.sectId || player.sect;
  if (!playerSectId) {
    return { tuViSpeedBonus: 0, herbGrowthSpeedBonus: 0, oreYieldBonus: 0, dailyLinhThachStipend: 0, occupiedCount: 0 };
  }

  let tuViSpeedBonus = 0;
  let herbGrowthSpeedBonus = 0;
  let oreYieldBonus = 0;
  let dailyLinhThachStipend = 0;
  let occupiedCount = 0;

  for (const vein of SECT_SPIRIT_VEINS_CONFIG) {
    const state = sectState?.veinStates?.[vein.id];
    const isOccupied = (state?.occupiedSectId === playerSectId) ||
      (!state && vein.occupiedSectId === playerSectId) ||
      Boolean(sectState?.occupiedVeinIds?.includes(vein.id));

    if (isOccupied) {
      occupiedCount += 1;
      tuViSpeedBonus += (vein.buffs.tuViSpeedBonus || 0);
      herbGrowthSpeedBonus += (vein.buffs.herbGrowthSpeedBonus || 0);
      oreYieldBonus += (vein.buffs.oreYieldBonus || 0);
      dailyLinhThachStipend += (vein.buffs.dailyLinhThachStipend || 0);
    }
  }

  return {
    tuViSpeedBonus,
    herbGrowthSpeedBonus,
    oreYieldBonus,
    dailyLinhThachStipend,
    occupiedCount
  };
}

