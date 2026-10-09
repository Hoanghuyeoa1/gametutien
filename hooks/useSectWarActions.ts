// hooks/useSectWarActions.ts
// Custom Domain Hook điều phối toàn bộ phân hệ "Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại"
// (Sect Wars & Wild Territory Conquest Actions)

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  WildSpiritMountain,
  RivalSectFaction,
  SectWarBattleReport,
  SectDiplomacyStatus
} from '@/lib/types/sect-war';
import { CustomSectState } from '@/lib/types/custom-sect';
import {
  canDeclareWarOnMountain,
  resolveThreeStageSectWar,
  stationGarrisonToMountain,
  negotiateDiplomacy,
  calculateMountainYields,
  WAR_MARCH_COST_LINH_THACH,
  INITIAL_SPIRIT_MOUNTAINS,
  INITIAL_RIVAL_SECTS,
  DEFAULT_SECT_MORALE
} from '@/lib/sect-war-logic';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';

export interface UseSectWarActionsParams {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog: (title: string, content: string, type: LogType) => void;
  showToast: (msg: string) => void;
  playSfx?: (name: any) => void;
}

export function useSectWarActions({
  player,
  setPlayer,
  addLog,
  showToast,
  playSfx
}: UseSectWarActionsParams) {
  const [activeReport, setActiveReport] = useState<SectWarBattleReport | null>(null);

  const sectState: CustomSectState | undefined = player.customSectState;

  const mountains: WildSpiritMountain[] = useMemo(() => {
    return sectState?.wildSpiritMountains && sectState.wildSpiritMountains.length > 0
      ? sectState.wildSpiritMountains
      : INITIAL_SPIRIT_MOUNTAINS;
  }, [sectState?.wildSpiritMountains]);

  const rivalSects: RivalSectFaction[] = useMemo(() => {
    return sectState?.rivalSects && sectState.rivalSects.length > 0
      ? sectState.rivalSects
      : INITIAL_RIVAL_SECTS;
  }, [sectState?.rivalSects]);

  const warHistory: SectWarBattleReport[] = useMemo(() => {
    return sectState?.sectWarHistory || [];
  }, [sectState?.sectWarHistory]);

  const sectMorale: number = sectState?.sectMorale ?? DEFAULT_SECT_MORALE;

  const controlledMountainsCount = useMemo(() => {
    return mountains.filter(m => m.controllingSectId === 'player_sect').length;
  }, [mountains]);

  const saveUpdatedPlayer = useCallback((updated: PlayerStats) => {
    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (err) {
      console.error('Lỗi lưu dữ liệu Tông Môn Đại Chiến:', err);
    }
  }, [setPlayer]);

  // =========================================================================
  // 1. PHÁT ĐỘNG THẢO PHẠT ĐẠI CHIẾN (DECLARE WAR)
  // =========================================================================
  const handleDeclareWar = useCallback(
    (mountainId: string, leaderDiscipleId: string, assignedDiscipleIds: string[]) => {
      if (!sectState || !sectState.isFounded) {
        showToast('Chưa khai tông lập phái!');
        return { success: false, message: 'Chưa khai tông lập phái!' };
      }

      // Thẩm định điều kiện
      const validation = canDeclareWarOnMountain(
        sectState,
        mountainId,
        leaderDiscipleId,
        assignedDiscipleIds,
        player.linhThach || 0,
        rivalSects,
        mountains
      );

      if (!validation.allowed) {
        showToast(validation.reason || 'Không đủ điều kiện xuất chinh!');
        return { success: false, message: validation.reason || 'Không đủ điều kiện!' };
      }

      const mountain = mountains.find(m => m.id === mountainId)!;
      const leader = sectState.disciples.find(d => d.id === leaderDiscipleId)!;
      const assignedDisciples = sectState.disciples.filter(d => assignedDiscipleIds.includes(d.id));
      const rivalSect = rivalSects.find(r => r.id === mountain.controllingSectId);

      // Trừ lộ phí hành quân (ưu tiên túi đồ, sau đó khố phòng)
      let remainingCost = WAR_MARCH_COST_LINH_THACH;
      let newPlayerLt = player.linhThach || 0;
      let newVaultLt = sectState.sectVault?.linhThach || 0;

      if (newPlayerLt >= remainingCost) {
        newPlayerLt -= remainingCost;
        remainingCost = 0;
      } else {
        remainingCost -= newPlayerLt;
        newPlayerLt = 0;
        newVaultLt = Math.max(0, newVaultLt - remainingCost);
      }

      // Khóa trạng thái xuất chinh tạm thời
      const armyWithLeader = assignedDisciples.some(d => d.id === leader.id)
        ? assignedDisciples
        : [leader, ...assignedDisciples];

      // Chạy engine Tam Trọng Đoán
      const { battleReport, survivingDisciples, fallenDisciples } = resolveThreeStageSectWar({
        mountain,
        leaderDisciple: leader,
        assignedDisciples: armyWithLeader,
        sectMorale,
        rivalSect
      });

      // Cập nhật danh sách đệ tử (loại bỏ fallenDisciples, mở khóa survivingDisciples)
      const fallenIds = new Set(fallenDisciples.map(d => d.id));
      const updatedDisciples = sectState.disciples
        .filter(d => !fallenIds.has(d.id))
        .map(d => {
          if (assignedDiscipleIds.includes(d.id) || d.id === leader.id) {
            return {
              ...d,
              isDispatchedToWar: false
            };
          }
          return d;
        });

      // Cập nhật cứ điểm Linh Sơn
      const updatedMountains = mountains.map(m => {
        if (m.id === mountainId) {
          if (battleReport.overallWinner === 'player') {
            return {
              ...m,
              controllingSectId: 'player_sect',
              defenseArrayHp: Math.floor(m.maxDefenseArrayHp * 0.5), // Sau trận chiến hộ trận cần phục hồi
              stationedGarrison: {
                leaderDiscipleId: leader.id,
                leaderName: leader.name,
                discipleCount: Math.max(5, survivingDisciples.length),
                combatPower: Math.floor(leader.stats.combatPower * 1.2)
              }
            };
          }
        }
        return m;
      });

      // Cập nhật Danh Vọng và Sĩ Khí
      const newMorale = Math.max(0, Math.min(100, sectMorale + battleReport.moraleDelta));
      const newReputation = Math.max(0, sectState.reputation + battleReport.reputationDelta);

      // Cập nhật chiến lợi phẩm nếu thắng
      let finalPlayerLt = newPlayerLt;
      if (battleReport.overallWinner === 'player') {
        finalPlayerLt += battleReport.capturedResources.spiritStones;
      }

      const nextHistory = [battleReport, ...warHistory].slice(0, 30);

      const updatedPlayer: PlayerStats = {
        ...player,
        linhThach: finalPlayerLt,
        customSectState: {
          ...sectState,
          reputation: newReputation,
          sectMorale: newMorale,
          sectVault: {
            ...sectState.sectVault,
            linhThach: newVaultLt
          },
          disciples: updatedDisciples,
          wildSpiritMountains: updatedMountains,
          sectWarHistory: nextHistory
        }
      };

      saveUpdatedPlayer(updatedPlayer);
      setActiveReport(battleReport);

      if (battleReport.overallWinner === 'player') {
        playSfx?.('breakthrough');
        showToast(`🎉 Thảo phạt đại thắng! Chiếm lĩnh thành công 【${mountain.name}】!`);
        addLog(
          'Đại Thắng Linh Sơn',
          `Quân đoàn do 【${leader.name}】 thống soái đã đại phá ${mountain.name}, thu về +${battleReport.capturedResources.spiritStones.toLocaleString()} Linh Thạch và bắt đầu tiếp quản sản lượng!`,
          'sect'
        );
      } else {
        playSfx?.('combat');
        showToast(`⚠️ Thảo phạt thất bại tại 【${mountain.name}】! Quân đoàn thương vong ${battleReport.playerCasualtiesTotal} đệ tử.`);
        addLog(
          'Thảo Phạt Thất Bại',
          `Quân đoàn công phạt ${mountain.name} bị đối phương chặn đứng! Sĩ khí giảm ${battleReport.moraleDelta}, tổn thất ${battleReport.playerCasualtiesTotal} đệ tử.`,
          'combat'
        );
      }

      return { success: true, report: battleReport, message: 'Đã hoàn tất chiến dịch!' };
    },
    [sectState, mountains, rivalSects, warHistory, sectMorale, player, saveUpdatedPlayer, showToast, addLog, playSfx]
  );

  // =========================================================================
  // 2. BỔ NHIỆM TRẤN THỦ LINH SƠN (STATION GARRISON)
  // =========================================================================
  const handleStationGarrison = useCallback(
    (mountainId: string, discipleId: string) => {
      if (!sectState) return;

      const res = stationGarrisonToMountain(mountainId, discipleId, sectState);
      if (res.success && res.updatedMountain && res.updatedDisciples) {
        const nextMountains = mountains.map(m => (m.id === mountainId ? res.updatedMountain! : m));
        const updatedPlayer: PlayerStats = {
          ...player,
          customSectState: {
            ...sectState,
            wildSpiritMountains: nextMountains,
            disciples: res.updatedDisciples
          }
        };
        saveUpdatedPlayer(updatedPlayer);
        showToast(res.message);
        addLog('Bổ Nhiệm Trấn Thủ', res.message, 'sect');
      } else {
        showToast(res.message);
      }
    },
    [sectState, mountains, player, saveUpdatedPlayer, showToast, addLog]
  );

  // =========================================================================
  // 3. NGOẠI GIAO THẾ LỰC LÂN BANG (NEGOTIATE DIPLOMACY)
  // =========================================================================
  const handleNegotiateDiplomacy = useCallback(
    (targetSectId: string, action: 'truce' | 'bribe' | 'alliance' | 'declare_war') => {
      if (!sectState) return;

      const res = negotiateDiplomacy(
        rivalSects,
        targetSectId,
        action,
        player.linhThach || 0,
        sectState.reputation || 0
      );

      if (res.success && res.updatedRivalSects) {
        const nextLt = Math.max(0, (player.linhThach || 0) - (res.linhThachCost || 0));
        const nextRep = Math.max(0, (sectState.reputation || 0) + (res.reputationDelta || 0));

        const updatedPlayer: PlayerStats = {
          ...player,
          linhThach: nextLt,
          customSectState: {
            ...sectState,
            reputation: nextRep,
            rivalSects: res.updatedRivalSects
          }
        };

        saveUpdatedPlayer(updatedPlayer);
        showToast(res.message);
        addLog('Ngoại Giao Thế Lực', res.message, 'sect');
      } else {
        showToast(res.message);
      }
    },
    [sectState, rivalSects, player, saveUpdatedPlayer, showToast, addLog]
  );

  // =========================================================================
  // 4. THU HOẠCH SẢN LƯỢNG LINH SƠN VÀO KHỐ PHÒNG
  // =========================================================================
  const handleHarvestMountains = useCallback(() => {
    if (!sectState) return;

    const controlled = mountains.filter(m => m.controllingSectId === 'player_sect');
    if (controlled.length === 0) {
      showToast('Chưa chiếm lĩnh cứ điểm Linh Sơn nào để thu hoạch!');
      return;
    }

    const now = Date.now();
    const lastHarvest = sectState.sectVault?.lastHarvestTimestamp || (now - 3600 * 1000);
    const elapsedSeconds = Math.max(60, Math.floor((now - lastHarvest) / 1000));

    const yields = calculateMountainYields(controlled, elapsedSeconds);

    if (yields.spiritStonesGained === 0 && Object.keys(yields.herbsGained).length === 0) {
      showToast('Thời gian tích lũy chưa đủ để thu hoạch thêm tài nguyên!');
      return;
    }

    const currentVault = sectState.sectVault || {
      linhThach: 0,
      herbs: {},
      ores: {},
      lastHarvestTimestamp: now
    };
    const nextVaultHerbs = { ...(currentVault.herbs || {}) };
    Object.entries(yields.herbsGained).forEach(([herbName, count]) => {
      nextVaultHerbs[herbName] = (nextVaultHerbs[herbName] || 0) + count;
    });

    const updatedPlayer: PlayerStats = {
      ...player,
      customSectState: {
        ...sectState,
        reputation: sectState.reputation + yields.sectExpGained,
        sectVault: {
          ...currentVault,
          linhThach: (currentVault.linhThach || 0) + yields.spiritStonesGained,
          herbs: nextVaultHerbs,
          lastHarvestTimestamp: now
        }
      }
    };

    saveUpdatedPlayer(updatedPlayer);
    showToast(`Đã thu hoạch +${yields.spiritStonesGained.toLocaleString()} Linh Thạch từ ${controlled.length} Linh Sơn!`);
    addLog(
      'Thu Hoạch Linh Sơn',
      `Khố Phòng tiếp nhận +${yields.spiritStonesGained.toLocaleString()} Linh Thạch và thảo dược phong phú từ các cứ điểm dã ngoại.`,
      'sect'
    );
  }, [sectState, mountains, player, saveUpdatedPlayer, showToast, addLog]);

  return {
    sectState,
    mountains,
    rivalSects,
    warHistory,
    sectMorale,
    controlledMountainsCount,
    activeReport,
    setActiveReport,
    handleDeclareWar,
    handleStationGarrison,
    handleNegotiateDiplomacy,
    handleHarvestMountains
  };
}
