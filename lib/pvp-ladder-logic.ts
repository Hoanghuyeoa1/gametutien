// lib/pvp-ladder-logic.ts
// Pure Business Logic cho phân hệ Vạn Tiên Đại Hội / Thiên Kiêu Bảng (Simulated Async PvP Ladder)

import {
  PlayerStats,
  LadderOpponent,
  PvPLadderState,
  PvPBattleResult,
  PvPTurnLog,
  PvPLadderCombatLog
} from '@/lib/types';
import { calculateCombatStats } from '@/lib/destiny-data';
import { calculateCombatPower, getMaxKhiHuyet } from '@/lib/game-logic';
import { getElementalCombatModifier } from '@/lib/elemental-system';
import {
  createDefaultPvPLadderState,
  getWeeklySettlementRewards
} from '@/lib/pvp-ladder-data';
import { TITLES_CONFIG } from '@/lib/achievements-data';
import {
  createDefaultTrinitySynergyGaugeState,
  GAUGE_GAIN_CONFIG
} from '@/lib/combat-synergy-data';
import {
  applyGaugeGain,
  tickGaugeCooldown,
  tickActiveEffects,
  tryAutoActivateSynergy,
  applyActiveEffectsToEnemyDamage,
  getEnemyAtkModifierFromEffects,
  getEnemySpeedModifierFromEffects,
  isEnemyIncapacitated,
  getPlayerAtkBuffFromEffects,
} from '@/lib/combat-synergy-logic';
import { checkAndConsumeAncestralDeathWard } from '@/lib/ancestral-blessing-logic';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;
const TICKET_REGEN_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 giờ hồi 1 vé

/**
 * Tự động hồi phục vé khiêu chiến theo thời gian
 */
export function regenChallengeTickets(state: PvPLadderState): PvPLadderState {
  const now = Date.now();
  let tickets = state.challengeTickets ?? 5;
  let lastRegen = state.lastTicketRegenTime || now;

  // Nếu qua ngày mới (hoặc quá 24h), tự động hồi đầy 5 vé
  if (now - lastRegen >= ONE_DAY_MS) {
    tickets = 5;
    lastRegen = now;
  } else if (tickets < 5) {
    const elapsed = now - lastRegen;
    const ticketsToAdd = Math.floor(elapsed / TICKET_REGEN_INTERVAL_MS);
    if (ticketsToAdd > 0) {
      tickets = Math.min(5, tickets + ticketsToAdd);
      lastRegen = now - (elapsed % TICKET_REGEN_INTERVAL_MS);
    }
  }

  // Kiểm tra chu kỳ kết toán tuần (7 ngày)
  const lastWeekly = state.lastWeeklySettlementTime || now;
  const hasUnclaimedWeekly = now - lastWeekly >= SEVEN_DAYS_MS;

  return {
    ...state,
    challengeTickets: tickets,
    lastTicketRegenTime: lastRegen,
    hasUnclaimedWeeklyReward: state.hasUnclaimedWeeklyReward || hasUnclaimedWeekly,
    weeklyRewardRank: state.hasUnclaimedWeeklyReward ? state.weeklyRewardRank : (hasUnclaimedWeekly ? state.currentRank : undefined)
  };
}

/**
 * Lọc danh sách 3 - 4 đối thủ khiêu chiến phù hợp với thứ hạng hiện tại của người chơi
 */
export function getMatchmakingTargets(ladderState: PvPLadderState, playerRank: number): LadderOpponent[] {
  const npcs = ladderState.ladderNpcs || [];
  if (npcs.length === 0) return [];

  // Sắp xếp tăng dần theo rank (1 -> 100)
  const sorted = [...npcs].sort((a, b) => a.rank - b.rank);

  // Trường hợp 1: Người chơi chưa vào bảng (Hạng 101+)
  if (playerRank > 100) {
    // Gợi ý: Hạng 90 (vượt cấp), Hạng 95, Hạng 98, Hạng 100
    const targetRanks = [90, 95, 98, 100];
    return targetRanks
      .map(r => sorted.find(n => n.rank === r))
      .filter((n): n is LadderOpponent => Boolean(n));
  }

  // Trường hợp 2: Người chơi đã đạt Quán Quân (Hạng 1)
  if (playerRank === 1) {
    // Cho phép giao hữu với Top 2, 3, 4, 5
    return sorted.filter(n => n.rank >= 2 && n.rank <= 5);
  }

  // Trường hợp 3: Người chơi đang ở trong bảng (Hạng 2 - 100)
  // Lọc 3 đối thủ phía trên và 1 đối thủ ngay sau
  const targets: LadderOpponent[] = [];

  // Đối thủ 1: Vượt cấp xa (khoảng cách 5 - 12 bậc)
  const highReachRank = Math.max(1, playerRank - Math.floor(Math.random() * 6 + 6));
  const highReach = sorted.find(n => n.rank === highReachRank);
  if (highReach && highReach.rank < playerRank) targets.push(highReach);

  // Đối thủ 2: Cận kề bậc cao (cách 2 - 4 bậc)
  const midReachRank = Math.max(1, playerRank - Math.floor(Math.random() * 3 + 2));
  const midReach = sorted.find(n => n.rank === midReachRank && !targets.some(t => t.id === n.id));
  if (midReach && midReach.rank < playerRank) targets.push(midReach);

  // Đối thủ 3: Ngay trước mắt (cách 1 bậc)
  const immediateRank = Math.max(1, playerRank - 1);
  const immediate = sorted.find(n => n.rank === immediateRank && !targets.some(t => t.id === n.id));
  if (immediate && immediate.rank < playerRank) targets.push(immediate);

  // Đối thủ 4: Phía sau bám đuổi (cách 1 - 2 bậc phía sau) nếu có
  if (playerRank < 100) {
    const behindRank = Math.min(100, playerRank + 1);
    const behind = sorted.find(n => n.rank === behindRank && !targets.some(t => t.id === n.id));
    if (behind) targets.push(behind);
  }

  // Nếu vì lý do nào đó chưa đủ 3 đối thủ, lấy các rank nhỏ hơn gần nhất
  if (targets.length < 3) {
    const fallback = sorted.filter(n => n.rank < playerRank && !targets.some(t => t.id === n.id));
    for (const f of fallback.slice(0, 3 - targets.length)) {
      targets.push(f);
    }
  }

  return targets.sort((a, b) => a.rank - b.rank);
}

/**
 * Mô phỏng trận đấu PvP theo lượt tích hợp trọn vẹn cơ chế:
 * - Uy Áp Thần Thức Turn 1 (Choáng, giảm tốc độ, phóng xuất Thần Niệm Kiếm)
 * - Nhịp độ Thân Pháp & Đòn Kép (Action Gauge 35% khi Tốc độ >= 1.5x)
 * - Tỷ lệ Né Tránh tự nhiên
 * - Kích hoạt Khí Linh Bản Mệnh khi tụt máu < 35% (Sát Phạt trảm kích / Thủ Hộ tạo khiên)
 * - Kích hoạt Trận Pháp & Phù Lục chu kỳ
 */
export function simulatePvPTurnCombat(
  player: PlayerStats,
  opponent: LadderOpponent
): PvPBattleResult {
  const cStats = calculateCombatStats(player);
  const playerCombatPower = calculateCombatPower(player);

  // HP tối đa
  const playerMaxHp = player.maxKhiHuyet || getMaxKhiHuyet(player.canCot, player.currentRealm, player.equipment);
  const opponentMaxHp = opponent.combatStats.maxHp || opponent.combatStats.hp;

  let playerCurHp = playerMaxHp;
  let opponentCurHp = opponentMaxHp;

  // 1. Thần Thức Áp Chế Turn 1
  const playerThanThuc = player.thanThuc || cStats.soul || 10;
  const oppThanThuc = opponent.thanThuc || 10;
  const suppressionRatio = playerThanThuc / Math.max(1, oppThanThuc);

  let opponentStunnedTurn1 = false;
  let playerStunnedTurn1 = false;
  let soulSuppressionMessage = '';

  if (suppressionRatio >= 1.3) {
    opponentStunnedTurn1 = Math.random() < 0.25; // 25% Choáng Turn 1
    soulSuppressionMessage = `⚡ [UY ÁP THẦN THỨC] Thần thức đạo hữu cuồn cuộn áp chế! ${opponent.name} thần hồn chấn động (-15% Tốc độ)!${opponentStunnedTurn1 ? ' 💫 Đối phương bị chấn nhiếp tê liệt Turn 1!' : ''}`;
  } else if (suppressionRatio <= 0.7) {
    playerStunnedTurn1 = Math.random() < 0.20;
    soulSuppressionMessage = `⚠️ [UY ÁP THẦN THỨC] Uy áp thần thức của ${opponent.name} kinh người! Thần hồn ngươi chao đảo (-10% Tốc độ)!${playerStunnedTurn1 ? ' 💫 Ngươi bị uy áp áp chế Turn 1!' : ''}`;
  }

  // Tốc độ hiệu dụng sau áp chế
  const playerEffectiveSpeed = Math.floor(cStats.speed * (suppressionRatio <= 0.7 ? 0.9 : 1.0));
  const oppEffectiveSpeed = Math.floor(opponent.combatStats.speed * (suppressionRatio >= 1.3 ? 0.85 : 1.0));

  // Tỉ lệ đòn kép (Double Action)
  const playerDoubleActionRate = (playerEffectiveSpeed / Math.max(1, oppEffectiveSpeed)) >= 1.5 ? 0.35 : 0;
  const oppDoubleActionRate = (oppEffectiveSpeed / Math.max(1, playerEffectiveSpeed)) >= 1.5 ? 0.35 : 0;

  // Tỉ lệ né tránh
  const playerSpeedDiff = Math.max(0, playerEffectiveSpeed - oppEffectiveSpeed);
  const playerNaturalDodge = Math.min(25, Math.floor(playerSpeedDiff * 0.25));
  const playerTotalDodge = Math.min(45, (cStats.dodgeRate || 5) + playerNaturalDodge);

  const oppSpeedDiff = Math.max(0, oppEffectiveSpeed - playerEffectiveSpeed);
  const oppTotalDodge = Math.min(35, Math.floor(oppSpeedDiff * 0.25) + 5);

  // Khí linh cờ kích hoạt
  let playerSpiritTriggered = false;
  let oppSpiritTriggered = false;
  let playerShieldHp = cStats.combatStartShieldHp || 0;
  let oppShieldHp = 0;

  // Ngũ hành khắc chế
  const playerElem = player.linhCan?.element || 'ngu_hanh';
  const oppElem = opponent.linhCan.element || 'ngu_hanh';
  const elemMod = getElementalCombatModifier(playerElem as any, oppElem as any);

  const rounds: PvPTurnLog[] = [];
  const maxRounds = 20;

  // ── Khởi tạo Tam Vị Nhất Thể Gauge ───────────────────────────────────
  const hasDeployedBeast = !!(player.activeBeastId && (player.beasts || player.spiritBeasts || []).some((b: any) => b.id === player.activeBeastId));
  const hasSpiritCompanion = !!(player.natalArtifact?.spirit);
  const hasDeployedChild = !!(player.offspringState?.deployedChildId && (player.offspringState?.children || []).some((c: any) => c.id === player.offspringState?.deployedChildId && (c.isDeployed || c.stage === 'adult')));
  let synergyGauge = createDefaultTrinitySynergyGaugeState();
  const synergyMessages: string[] = [];

  for (let round = 1; round <= maxRounds; round++) {
    if (playerCurHp <= 0 || opponentCurHp <= 0) break;

    const playerHpBefore = playerCurHp;
    const opponentHpBefore = opponentCurHp;

    // ── Tick Synergy Cooldown & Active Effects ────────────────────────
    synergyGauge = tickGaugeCooldown(synergyGauge);
    synergyGauge = tickActiveEffects(synergyGauge);

    // ── Áp dụng DoT từ Hợp Kích ─────────────────────────────────────
    if (synergyGauge.activeEffects.length > 0) {
      const dotResult = applyActiveEffectsToEnemyDamage(opponentCurHp, opponentMaxHp, synergyGauge.activeEffects);
      opponentCurHp = dotResult.newEnemyHp;
      dotResult.effectMessages.forEach(msg => synergyMessages.push(`[Hiệp ${round}] ${msg}`));
    }

    // ── Tự động kích hoạt Hợp Kích trước lượt đánh ──────────────────
    const synergyAttempt = tryAutoActivateSynergy(
      player, cStats, synergyGauge, opponentMaxHp, playerMaxHp, playerCurHp
    );
    if (synergyAttempt) {
      synergyGauge = synergyAttempt.newGauge;
      const sr = synergyAttempt.result;
      opponentCurHp = Math.max(0, opponentCurHp - sr.totalDamage);
      playerCurHp = Math.min(playerMaxHp, playerCurHp + sr.healAmount);
      playerShieldHp += sr.shieldAmount;
      synergyMessages.push(`[Hiệp ${round}] ${sr.message}`);
      // Tích lũy gauge từ kích hoạt
      synergyGauge = applyGaugeGain(synergyGauge, 'spirit_trigger', hasDeployedBeast, hasSpiritCompanion, hasDeployedChild);
    }

    if (playerCurHp <= 0 || opponentCurHp <= 0) break;

    // --- LƯỢT ĐÁNH CỦA NGƯỜI CHƠI ---
    let playerDmg = 0;
    let playerIsCrit = false;
    let playerIsDodge = false;
    let playerDouble = false;
    let playerEffect = '';
    let playerDesc = '';

    // Buff ATK người chơi từ Hợp Kích
    const playerAtkBuff = getPlayerAtkBuffFromEffects(synergyGauge.activeEffects);

    if (round === 1 && playerStunnedTurn1) {
      playerDesc = 'Đạo hữu bị chấn nhiếp bởi uy áp thần thức, mất lượt ra chiêu!';
    } else {
      // Kiểm tra đối thủ né tránh
      if (Math.random() * 100 < oppTotalDodge) {
        playerIsDodge = true;
        playerDesc = `${opponent.name} thi triển thân pháp tàn ảnh, né sạch đòn công kích!`;
      } else {
        // Đòn đánh trúng
        playerIsCrit = Math.random() * 100 < cStats.critRate;
        const baseAtk = cStats.atk * playerAtkBuff * (0.9 + Math.random() * 0.25);
        const oppDef = opponent.combatStats.def * (1 - getEnemyAtkModifierFromEffects(synergyGauge.activeEffects) * 0.5); // debuff_atk reduces def proxy
        const oppMitigation = Math.max(0.15, 1 - (oppDef / (oppDef + 1200)) - (opponent.combatStats.dmgReduction / 100));

        playerDmg = Math.floor(baseAtk * oppMitigation * elemMod.playerDamageMod);
        if (playerIsCrit) {
          playerDmg = Math.floor(playerDmg * (cStats.critDmg / 100));
          synergyGauge = applyGaugeGain(synergyGauge, 'crit', hasDeployedBeast, hasSpiritCompanion, hasDeployedChild);
        } else {
          synergyGauge = applyGaugeGain(synergyGauge, 'hit', hasDeployedBeast, hasSpiritCompanion, hasDeployedChild);
        }

        // Đòn kép nếu tốc độ áp đảo
        if (Math.random() < playerDoubleActionRate) {
          playerDouble = true;
          playerDmg = Math.floor(playerDmg * 1.6);
        }

        // Hồi máu hút máu
        if (cStats.hutMauRate && cStats.hutMauRate > 0) {
          const lifesteal = Math.floor(playerDmg * (cStats.hutMauRate / 100));
          playerCurHp = Math.min(playerMaxHp, playerCurHp + lifesteal);
        }

        // Giảm trừ khiên của đối thủ nếu có
        if (oppShieldHp > 0) {
          if (oppShieldHp >= playerDmg) {
            oppShieldHp -= playerDmg;
            playerDesc = `Đòn đánh gây ${playerDmg.toLocaleString()} sát thương bị hộ thể linh thuẫn của đối phương cản phá!`;
            playerDmg = 0;
          } else {
            playerDmg -= oppShieldHp;
            oppShieldHp = 0;
            playerDesc = `Công phá vỡ linh thuẫn đối thủ, bồi thêm ${playerDmg.toLocaleString()} sát thương${playerIsCrit ? ' (BẠO KÍCH!)' : ''}${playerDouble ? ' [LIÊN HOÀN KÍCH]' : ''}!`;
          }
        } else {
          playerDesc = `Vung kiếm xuất kích gây ${playerDmg.toLocaleString()} sát thương${playerIsCrit ? ' chí mạng kinh thiên!' : ''}${playerDouble ? ' [ĐÒN KÉP THÂN PHÁP]' : ''}`;
        }

        opponentCurHp = Math.max(0, opponentCurHp - playerDmg);
      }
    }

    // Kiểm tra Khí Linh Bản Mệnh Đối Thủ khi máu < 35%
    if (!oppSpiritTriggered && opponent.spiritCompanion && opponentCurHp > 0 && opponentCurHp < opponentMaxHp * 0.35) {
      oppSpiritTriggered = true;
      if (opponent.spiritCompanion.personality === 'Sát Phạt') {
        const bonusDmg = Math.floor(opponent.combatStats.atk * 0.8);
        playerCurHp = Math.max(0, playerCurHp - bonusDmg);
        playerEffect = `⚔️ Khí Linh [${opponent.spiritCompanion.name}] bộc phát sát khí, bồi thêm ${bonusDmg.toLocaleString()} trảm kích!`;
      } else {
        oppShieldHp = Math.floor(opponentMaxHp * 0.25);
        playerEffect = `🛡️ Khí Linh [${opponent.spiritCompanion.name}] hiển hóa hộ chủ, ngưng tụ ${oppShieldHp.toLocaleString()} khiên chắn!`;
      }
    }

    // --- LƯỢT ĐÁNH CỦA ĐỐI THỦ (NẾU CÒN SỐNG) ---
    let oppDmg = 0;
    let oppIsCrit = false;
    let oppIsDodge = false;
    let oppDouble = false;
    let oppEffect = '';
    let oppDesc = '';

    // Kiểm tra đối thủ bị Đóng Băng / Choáng từ Hợp Kích
    const oppIncapacitated = isEnemyIncapacitated(synergyGauge.activeEffects);
    const oppEffectiveSpeedMod = getEnemySpeedModifierFromEffects(synergyGauge.activeEffects);
    const oppAtkMod = getEnemyAtkModifierFromEffects(synergyGauge.activeEffects);

    if (opponentCurHp <= 0) {
      oppDesc = `${opponent.name} trọng thương không thể tiếp tục ứng chiến!`;
    } else if (round === 1 && opponentStunnedTurn1) {
      oppDesc = `${opponent.name} bị uy áp chấn nhiếp, mất lượt ra đòn!`;
    } else if (oppIncapacitated) {
      oppDesc = `${opponent.name} bị Hợp Kích phong ấn, mất lượt ra đòn!`;
    } else {
      // Kiểm tra người chơi né tránh
      if (Math.random() * 100 < playerTotalDodge) {
        oppIsDodge = true;
        oppDesc = `Đạo hữu lướt nhẹ thân hình, né tránh toàn bộ chiêu thức của ${opponent.name}!`;
      } else {
        oppIsCrit = Math.random() * 100 < opponent.combatStats.critRate;
        const oppBaseAtk = opponent.combatStats.atk * oppAtkMod * oppEffectiveSpeedMod * (0.9 + Math.random() * 0.25);
        const playerDef = cStats.def;
        const playerMitigation = Math.max(0.15, 1 - (playerDef / (playerDef + 1200)) - ((cStats.dmgReduction || 0) / 100));

        oppDmg = Math.floor(oppBaseAtk * playerMitigation * elemMod.playerDefenseMod);
        if (oppIsCrit) {
          oppDmg = Math.floor(oppDmg * (opponent.combatStats.critDmg / 100));
        }

        if (Math.random() < oppDoubleActionRate * oppEffectiveSpeedMod) {
          oppDouble = true;
          oppDmg = Math.floor(oppDmg * 1.5);
        }

        // Giảm trừ khiên người chơi nếu có
        if (playerShieldHp > 0) {
          if (playerShieldHp >= oppDmg) {
            playerShieldHp -= oppDmg;
            oppDesc = `Hộ sơn đại trận/khiên chắn hấp thu hoàn toàn ${oppDmg.toLocaleString()} sát thương của đối thủ!`;
            oppDmg = 0;
          } else {
            oppDmg -= playerShieldHp;
            playerShieldHp = 0;
            oppDesc = `${opponent.name} đánh vỡ hộ thuẫn, đánh vào đạo thể gây ${oppDmg.toLocaleString()} sát thương${oppIsCrit ? ' (BẠO KÍCH!)' : ''}!`;
          }
        } else {
          oppDesc = `${opponent.name} xuất chiêu tấn công gây ${oppDmg.toLocaleString()} sát thương${oppIsCrit ? ' chí mạng hung hiểm!' : ''}${oppDouble ? ' [ĐÒN KÉP]' : ''}`;
        }

        playerCurHp = Math.max(0, playerCurHp - oppDmg);

        // Kiểm tra Hư Ảnh Tổ Tiên Đỡ Đòn Tử Vong (Ancestral Death Ward)
        if (playerCurHp <= 0) {
          const wardRes = checkAndConsumeAncestralDeathWard(player);
          if (wardRes.triggered) {
            playerCurHp = Math.max(1, Math.floor(playerMaxHp * 0.20));
            oppEffect = wardRes.combatMessage || '🏛️ [TỔ TIÊN HIỂN LINH] Hư Ảnh Tiên Đế tổ tiên xuất hiện đỡ lấy đòn chí tử!';
          }
        }

        // Tích lũy gauge từ nhận sát thương
        if (oppDmg > 0) {
          synergyGauge = applyGaugeGain(synergyGauge, 'take_damage', hasDeployedBeast, hasSpiritCompanion, hasDeployedChild);
        }
      }
    }

    // Kiểm tra Khí Linh Bản Mệnh Người Chơi khi máu < 35%
    if (!playerSpiritTriggered && player.natalArtifact && playerCurHp > 0 && playerCurHp < playerMaxHp * 0.35) {
      playerSpiritTriggered = true;
      const spiritName = player.natalArtifact.spirit?.name || 'Khí Linh';
      const nature = player.natalArtifact.spirit?.personality || 'sat_phat';
      if (nature === 'sat_phat') {
        const trảmDmg = Math.floor(cStats.atk * 1.2);
        opponentCurHp = Math.max(0, opponentCurHp - trảmDmg);
        oppEffect = `⚔️ Bản Mệnh Khí Linh [${spiritName}] hộ chủ xuất kích, chém trúng đối thủ ${trảmDmg.toLocaleString()} sát thương!`;
      } else {
        playerShieldHp = Math.floor(playerMaxHp * 0.30);
        oppEffect = `🛡️ Bản Mệnh Khí Linh [${spiritName}] ngưng tụ Cương Khí Hộ Thể, tạo ${playerShieldHp.toLocaleString()} khiên chắn!`;
      }
    }

    // Tự hồi phục mỗi hiệp từ đan dược/nội tại
    if (cStats.hpRegenPercent && cStats.hpRegenPercent > 0 && playerCurHp > 0) {
      const regen = Math.floor(playerMaxHp * (cStats.hpRegenPercent / 100));
      playerCurHp = Math.min(playerMaxHp, playerCurHp + regen);
    }

    // Tích lũy gauge cuối hiệp
    synergyGauge = applyGaugeGain(synergyGauge, 'round_end', hasDeployedBeast, hasSpiritCompanion, hasDeployedChild);

    rounds.push({
      round,
      playerHpBefore,
      opponentHpBefore,
      playerAction: {
        actionName: 'Đạo Môn Kiếm Quyết',
        damage: playerDmg,
        isCrit: playerIsCrit,
        isDodge: playerIsDodge,
        isDoubleAction: playerDouble,
        specialEffect: playerEffect,
        description: playerDesc
      },
      opponentAction: {
        actionName: opponent.manuals[0]?.name || 'Tông Môn Quyết',
        damage: oppDmg,
        isCrit: oppIsCrit,
        isDodge: oppIsDodge,
        isDoubleAction: oppDouble,
        specialEffect: oppEffect,
        description: oppDesc
      },
      playerHpAfter: playerCurHp,
      opponentHpAfter: opponentCurHp
    });
  }

  // Kết định thắng bại
  let victory = false;
  let lossReason = '';

  if (opponentCurHp <= 0) {
    victory = true;
  } else if (playerCurHp <= 0) {
    victory = false;
    lossReason = 'Khí huyết cạn kiệt trước uy lực chiêu thức đối thủ';
  } else {
    // Nếu hết 20 lượt, bên nào còn % HP cao hơn sẽ thắng
    const playerHpPercent = playerCurHp / playerMaxHp;
    const oppHpPercent = opponentCurHp / opponentMaxHp;
    if (playerHpPercent >= oppHpPercent) {
      victory = true;
    } else {
      victory = false;
      lossReason = 'Hết 20 hiệp bất phân thắng bại, đối thủ chiếm ưu thế lượng sinh mệnh';
    }
  }

  // Tính toán phần thưởng
  const oldRank = player.pvpLadderState?.currentRank ?? 101;
  const newRank = (victory && oldRank > opponent.rank) ? opponent.rank : oldRank;

  const baseLinhThach = Math.max(5000, (101 - opponent.rank) * 800);
  const baseTuVi = Math.max(10000, (101 - opponent.rank) * 1500);
  const baseDanhVong = Math.max(30, (101 - opponent.rank) * 5);

  let rewardTitleId = undefined;
  if (victory) {
    if (newRank === 1) rewardTitleId = 'title_van_gioi_de_nhat_kiem';
    else if (newRank <= 3) rewardTitleId = 'title_thien_kieu_van_dinh';
    else if (newRank <= 10) rewardTitleId = 'title_thap_dai_thien_kieu';
    else if (newRank <= 100) rewardTitleId = 'title_bach_cuong_thien_kieu';
  }

  return {
    victory,
    playerMaxHp,
    opponentMaxHp,
    finalPlayerHp: playerCurHp,
    finalOpponentHp: opponentCurHp,
    rounds,
    opponent,
    oldRank,
    newRank,
    rewards: {
      linhThach: victory ? baseLinhThach : Math.floor(baseLinhThach * 0.2),
      danhVong: victory ? baseDanhVong : Math.floor(baseDanhVong * 0.2),
      tuVi: victory ? baseTuVi : Math.floor(baseTuVi * 0.2),
      rewardTitleId
    },
    soulSuppressionMessage,
    synergyMessages,
    finalSynergyGauge: synergyGauge,
    lossReason
  };
}

/**
 * Xử lý kết quả trận đấu Thiên Kiêu Bảng:
 * - Trừ 1 vé khiêu chiến
 * - Hoán đổi thứ hạng (Rank Swap) nếu thắng đối thủ cao hơn
 * - Cập nhật danh sách 100 đối thủ lưu trong save
 * - Thưởng tài nguyên & mở khóa danh hiệu
 */
export function resolveLadderChallenge(
  player: PlayerStats,
  battleResult: PvPBattleResult
): {
  updatedPlayer: PlayerStats;
  logMessage: string;
} {
  const currentState = player.pvpLadderState || createDefaultPvPLadderState();
  const oldRank = currentState.currentRank ?? 101;
  const opponent = battleResult.opponent;
  const isVictory = battleResult.victory;

  // Trừ 1 vé
  const remainingTickets = Math.max(0, (currentState.challengeTickets ?? 5) - 1);

  let newRank = oldRank;
  let updatedNpcs = [...(currentState.ladderNpcs || [])];
  let rankChangeDesc = 'Giữ nguyên';

  if (isVictory && oldRank > opponent.rank) {
    newRank = opponent.rank;
    rankChangeDesc = `Thăng hạng: #${oldRank} ➜ #${newRank}`;

    // Hoán đổi thứ hạng an toàn:
    // Nếu người chơi ngoài bảng (oldRank > 100):
    // Đẩy đối thủ và các NPC phía dưới xuống 1 bậc, loại bỏ NPC rank 100
    if (oldRank > 100) {
      // NPC bị đánh bại sẽ nhận vị trí cũ + 1 (hoặc các NPC từ targetRank đến 99 bị trượt xuống 1 bậc)
      updatedNpcs = updatedNpcs
        .map(n => {
          if (n.rank === opponent.rank) {
            return { ...n, rank: n.rank + 1 };
          }
          if (n.rank > opponent.rank && n.rank < 100) {
            return { ...n, rank: n.rank + 1 };
          }
          if (n.rank === 100) {
            // NPC rank 100 bị đẩy ra khỏi bảng
            return null;
          }
          return n;
        })
        .filter((n): n is LadderOpponent => n !== null);
    } else {
      // Nếu người chơi đã trong bảng: hoán đổi trực tiếp rank giữa người chơi và đối thủ
      updatedNpcs = updatedNpcs.map(n => {
        if (n.id === opponent.id) {
          return { ...n, rank: oldRank };
        }
        return n;
      });
    }

    // Sắp xếp lại theo rank
    updatedNpcs.sort((a, b) => a.rank - b.rank);
  } else if (!isVictory) {
    rankChangeDesc = 'Khiêu chiến thất bại';
  }

  const bestRank = Math.min(currentState.bestRank ?? 101, newRank);

  // Ghi nhật ký chiến đấu
  const newCombatLog: PvPLadderCombatLog = {
    id: `pvp_log_${Date.now()}`,
    timestamp: Date.now(),
    targetName: opponent.name,
    targetRank: opponent.rank,
    isVictory,
    rankChange: rankChangeDesc,
    oldRank,
    newRank
  };

  const updatedCombatLogs = [newCombatLog, ...(currentState.combatLogs || [])].slice(0, 30);

  // Mở khóa danh hiệu nếu đạt mốc
  const achState = player.achievementsState || { unlockedTitleIds: [] };
  const unlockedTitles = [...(achState.unlockedTitleIds || [])];

  if (battleResult.rewards.rewardTitleId && !unlockedTitles.includes(battleResult.rewards.rewardTitleId)) {
    unlockedTitles.push(battleResult.rewards.rewardTitleId);
  }

  // Cập nhật người chơi
  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach ?? 0) + battleResult.rewards.linhThach,
    danhVong: (player.danhVong ?? 0) + battleResult.rewards.danhVong,
    tuVi: (player.tuVi ?? 0) + battleResult.rewards.tuVi,
    achievementsState: {
      ...achState,
      unlockedTitleIds: unlockedTitles
    },
    pvpLadderState: {
      ...currentState,
      currentRank: newRank,
      bestRank,
      challengeTickets: remainingTickets,
      combatLogs: updatedCombatLogs,
      ladderNpcs: updatedNpcs
    }
  };

  const titleName = battleResult.rewards.rewardTitleId ? TITLES_CONFIG[battleResult.rewards.rewardTitleId]?.name : null;
  const logMessage = isVictory
    ? `⚔️ [Thiên Kiêu Bảng] Đắc thắng trước ${opponent.name} (Hạng ${opponent.rank})! ${newRank < oldRank ? `Vươn lên chiếm lấy Hạng #${newRank}!` : ''} Nhận +${battleResult.rewards.linhThach.toLocaleString()} Linh Thạch, +${battleResult.rewards.danhVong} Danh Vọng${titleName ? `, nhận Danh hiệu [${titleName}]!` : '.'}`
    : `⚔️ [Thiên Kiêu Bảng] Thất bại trước ${opponent.name} (Hạng ${opponent.rank})! Thứ hạng không đổi. Nhận +${battleResult.rewards.linhThach.toLocaleString()} Linh Thạch ủy lạo.`;

  return {
    updatedPlayer,
    logMessage
  };
}

/**
 * Nhận thưởng chu kỳ tuần
 */
export function claimWeeklySettlement(player: PlayerStats): {
  updatedPlayer: PlayerStats;
  logMessage: string;
} {
  const state = player.pvpLadderState || createDefaultPvPLadderState();
  const rank = state.weeklyRewardRank || state.currentRank || 101;
  const rewards = getWeeklySettlementRewards(rank);

  const achState = player.achievementsState || { unlockedTitleIds: [] };
  const unlockedTitles = [...(achState.unlockedTitleIds || [])];
  if (rewards.rewardTitleId && !unlockedTitles.includes(rewards.rewardTitleId)) {
    unlockedTitles.push(rewards.rewardTitleId);
  }

  const updatedPlayer: PlayerStats = {
    ...player,
    linhThach: (player.linhThach ?? 0) + rewards.linhThach,
    danhVong: (player.danhVong ?? 0) + rewards.danhVong,
    tuVi: (player.tuVi ?? 0) + rewards.tuVi,
    achievementsState: {
      ...achState,
      unlockedTitleIds: unlockedTitles
    },
    pvpLadderState: {
      ...state,
      lastWeeklySettlementTime: Date.now(),
      hasUnclaimedWeeklyReward: false,
      weeklyRewardRank: undefined
    }
  };

  const titleText = rewards.rewardTitleId ? `, vinh danh nhận Danh hiệu [${TITLES_CONFIG[rewards.rewardTitleId]?.name}]` : '';
  const logMessage = `🏆 [Thiên Kiêu Bảng] Kết toán chu kỳ tuần thành công (Hạng #${rank})! Nhận +${rewards.linhThach.toLocaleString()} Linh Thạch, +${rewards.danhVong} Danh Vọng, +${rewards.tuVi.toLocaleString()} Tu Vi, ${rewards.pillRewardName}${titleText}!`;

  return {
    updatedPlayer,
    logMessage
  };
}
