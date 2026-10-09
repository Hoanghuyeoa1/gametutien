'use client';
// hooks/useCosmicDefenseActions.ts
// Custom domain hook quản lý trạng thái cảnh báo tập kích thời gian thực,
// nâng cấp pháo đài cứ điểm, chỉ định trấn thủ, và kích hoạt giao tranh thủ thành

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PlayerStats } from '@/lib/types/player';
import type {
  FortificationType,
  GarrisonDeployment,
  GarrisonType,
  IncursionThreatLevel,
  NodeFortificationState,
  VoidIncursion,
} from '@/lib/types/cosmic-defense';
import {
  calculateEffectiveDefensePower,
  canUpgradeFortification,
  upgradeFortification,
  assignGarrisonToNode,
  tickCosmicIncursions,
  resolveAutoGarrisonDefense,
  resolveManualInterceptionBattle,
  triggerManualIncursionForTesting,
  getNodeFortification,
  getEntityCombatPower,
  SimulatedDefenseReport,
} from '@/lib/cosmic-defense-logic';
import { FORTIFICATION_CONFIGS } from '@/lib/cosmic-defense-data';
import { COSMIC_NODES_MAP } from '@/lib/cosmic-map-data';

interface UseCosmicDefenseActionsProps {
  player: PlayerStats;
  setPlayer?: (updater: (prev: PlayerStats) => PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: any) => void;
}

export function useCosmicDefenseActions({
  player,
  setPlayer,
  showToast,
  addLog,
}: UseCosmicDefenseActionsProps) {
  const [selectedIncursionId, setSelectedIncursionId] = useState<string | null>(null);
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [lastDefenseReport, setLastDefenseReport] = useState<SimulatedDefenseReport | null>(null);
  const [isFiringLaser, setIsFiringLaser] = useState(false);
  const [tickerNow, setTickerNow] = useState(Date.now());

  // Cosmic state tham chiếu an toàn
  const cosmicState = player.cosmicState;
  const defenseState = cosmicState?.defenseState;

  // ─── Realtime Ticker (Mỗi 1 giây cập nhật đồng hồ đếm ngược) ───────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Cosmic Incursion Pulse (Mỗi 30 giây kiểm tra đợt tập kích ngẫu nhiên) ───
  useEffect(() => {
    if (!cosmicState || !cosmicState.unlocked || !setPlayer) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const { nextCosmicState, newIncursion, transitionedToSiege } = tickCosmicIncursions(
        cosmicState,
        player.currentRealm,
        now
      );

      let stateChanged = false;

      if (newIncursion) {
        stateChanged = true;
        showToast?.(`🚨 [CẢNH BÁO TẬP KÍCH] Quân đoàn dị tộc đang tiếp cận cứ điểm ${newIncursion.targetNodeName}!`);
        addLog?.(
          '🚨 Vực Ngoại Dị Tộc Xuất Hiện',
          `Hư Không Triều Tịch bùng phát! Quân đoàn ${newIncursion.enemyFleetName} do ${newIncursion.enemyLeaderName} dẫn đầu đang nhắm tới ${newIncursion.targetNodeName}!`,
          'danger'
        );
      }

      if (transitionedToSiege.length > 0) {
        stateChanged = true;
        transitionedToSiege.forEach(inc => {
          showToast?.(`⚔️ [CỨ ĐIỂM BỊ CÔNG HÃM] Kẻ địch đã tràn tới ${inc.targetNodeName}! Mau chóng phòng thủ!`);
        });
      }

      if (stateChanged) {
        setPlayer(prev => ({
          ...prev,
          cosmicState: nextCosmicState,
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [cosmicState, player.currentRealm, setPlayer, showToast, addLog]);

  // ─── Danh sách đợt tập kích đang hoạt động ──────────────────────────────────
  const activeIncursions = useMemo(() => {
    if (!defenseState?.activeIncursions) return [];
    return defenseState.activeIncursions.filter(
      inc => inc.status === 'approaching' || inc.status === 'sieging'
    );
  }, [defenseState?.activeIncursions]);

  // Bản đồ kiểm tra nhanh node nào đang bị tập kích
  const incursionByNodeId = useMemo(() => {
    const map = new Map<string, VoidIncursion>();
    activeIncursions.forEach(inc => {
      map.set(inc.targetNodeId, inc);
    });
    return map;
  }, [activeIncursions]);

  // Đợt tập kích nguy cấp nhất để hiển thị cảnh báo Header
  const urgentIncursion = useMemo(() => {
    if (activeIncursions.length === 0) return null;
    // Ưu tiên sieging trước, sau đó tới approaching có arrival sớm nhất
    const sieging = activeIncursions.find(i => i.status === 'sieging');
    if (sieging) return sieging;

    return [...activeIncursions].sort((a, b) => a.arrivalTimestamp - b.arrivalTimestamp)[0] || null;
  }, [activeIncursions]);

  // ─── Nâng Cấp Công Trình Hộ Mạch Trận Bàn ────────────────────────────────────
  const handleUpgradeFortification = useCallback((nodeId: string, type: FortificationType) => {
    if (!cosmicState || !setPlayer) return;

    try {
      const { nextCosmicState, nextPlayer, upgradedLevel } = upgradeFortification(
        nodeId,
        type,
        cosmicState,
        player
      );

      const config = FORTIFICATION_CONFIGS[type];
      const nodeName = COSMIC_NODES_MAP[nodeId]?.name || nodeId;

      setPlayer(() => ({
        ...nextPlayer,
        cosmicState: nextCosmicState,
      }));

      showToast?.(`✨ Nâng cấp ${config.name} tại ${nodeName} lên Cấp ${upgradedLevel}!`);
      addLog?.(
        'Kiến Thiết Cứ Điểm Tinh Hải',
        `Đã gia cố công trình ${config.name} tại ${nodeName} đạt cấp độ ${upgradedLevel}.`,
        'success'
      );
    } catch (err: any) {
      showToast?.(`❌ ${err.message || 'Không thể nâng cấp công trình.'}`);
    }
  }, [cosmicState, player, setPlayer, showToast, addLog]);

  // ─── Chỉ Định / Thay Đổi Trấn Thủ Sĩ ─────────────────────────────────────────
  const handleAssignGarrison = useCallback((
    nodeId: string,
    garrisonType: GarrisonType,
    entityId?: string
  ) => {
    if (!cosmicState || !setPlayer) return;

    let deployment: GarrisonDeployment;
    if (garrisonType === 'none') {
      deployment = {
        type: 'none',
        baseCombatPower: 0,
        assignedAt: Date.now(),
      };
    } else {
      const { entityName, baseCombatPower } = getEntityCombatPower(garrisonType, entityId, player);
      deployment = {
        type: garrisonType,
        entityId,
        entityName,
        baseCombatPower,
        assignedAt: Date.now(),
      };
    }

    const nextCosmicState = assignGarrisonToNode(nodeId, deployment, cosmicState);
    const nodeName = COSMIC_NODES_MAP[nodeId]?.name || nodeId;

    setPlayer(prev => ({
      ...prev,
      cosmicState: nextCosmicState,
    }));

    if (garrisonType === 'none') {
      showToast?.(`🛡️ Đã giải trừ trấn thủ tại ${nodeName}.`);
    } else {
      showToast?.(`🛡️ Đã phái [${deployment.entityName}] đến trấn thủ ${nodeName}!`);
      addLog?.(
        'Điều Động Trấn Thủ Sĩ',
        `Đã bố trí ${deployment.entityName} (Lực chiến: ${deployment.baseCombatPower.toLocaleString()}) phụ trách phòng ngự ${nodeName}.`,
        'info'
      );
    }
  }, [cosmicState, player, setPlayer, showToast, addLog]);

  // ─── Phương Án A: Phòng Ngự Tự Động Rảnh Tay ─────────────────────────────────
  const handleResolveSimulatedDefense = useCallback((incursionId: string) => {
    if (!cosmicState || !setPlayer) return;

    try {
      setIsFiringLaser(true);
      // Giả lập hiệu ứng tia laser nã pháo trong 800ms
      setTimeout(() => {
        setIsFiringLaser(false);
        const { nextCosmicState, nextPlayer, report } = resolveAutoGarrisonDefense(
          incursionId,
          cosmicState,
          player
        );

        setPlayer(() => ({
          ...nextPlayer,
          cosmicState: nextCosmicState,
        }));

        setLastDefenseReport(report);
        setIsDefenseModalOpen(true);

        if (report.victory) {
          showToast?.(`🎉 Cứ điểm ${report.targetNodeName} phòng ngự thành công!`);
          addLog?.(
            'Phòng Ngự Cứ Điểm Toàn Thắng',
            `Cửu Cực Tru Ma Pháo cùng Trấn Thủ Sĩ đã tiêu diệt quân đoàn ${report.enemyLeaderName}! Nhận +${report.lootRewards?.honDonThanThiet} Thần Thiết.`,
            'success'
          );
        } else {
          showToast?.(`⚠️ Cứ điểm ${report.targetNodeName} bị quân địch chọc thủng!`);
          addLog?.(
            'Cứ Điểm Tinh Hải Thất Thủ',
            `Quân đoàn ${report.enemyLeaderName} đã đánh bại lực lượng phòng ngự tại ${report.targetNodeName}. Tổn thất tài nguyên hầm mỏ!`,
            'danger'
          );
        }
      }, 700);
    } catch (err: any) {
      setIsFiringLaser(false);
      showToast?.(`❌ ${err.message || 'Không thể kết toán phòng thủ.'}`);
    }
  }, [cosmicState, player, setPlayer, showToast, addLog]);

  // ─── Phương Án B: Ngự Chu Nghênh Chiến Trực Tiếp ─────────────────────────────
  const handleManualInterception = useCallback((incursionId: string, playerVictory: boolean) => {
    if (!cosmicState || !setPlayer) return;

    const { nextCosmicState, lootAwarded } = resolveManualInterceptionBattle(
      incursionId,
      playerVictory,
      cosmicState
    );

    setPlayer(prev => ({
      ...prev,
      cosmicState: nextCosmicState,
    }));

    if (playerVictory && lootAwarded) {
      showToast?.(`👑 Đích thân ngự chu đại thắng! Nhận x2 Chiến Lợi Phẩm (+${lootAwarded.honDonThanThiet} Thần Thiết)!`);
      addLog?.(
        'Đích Thân Ngự Chu Nghênh Chiến',
        `Đạo hữu đích thân lái Tinh Chu tới giải vây, chém bay thủ cấp thủ lĩnh dị tộc! Toàn bộ hạm đội địch tan rã!`,
        'success'
      );
    } else {
      showToast?.(`💔 Ngự chu chiến bại, cứ điểm đã bị phá vỡ!`);
    }
  }, [cosmicState, setPlayer, showToast, addLog]);

  // ─── Kích Hoạt Đợt Tập Kích Thử Nghiệm ───────────────────────────────────────
  const handleTriggerTestIncursion = useCallback((
    targetNodeId: string,
    threatLevel: IncursionThreatLevel = 'tieu_ba'
  ) => {
    if (!cosmicState || !setPlayer) return;

    const { nextCosmicState, incursion } = triggerManualIncursionForTesting(
      cosmicState,
      targetNodeId,
      threatLevel,
      player.currentRealm
    );

    setPlayer(prev => ({
      ...prev,
      cosmicState: nextCosmicState,
    }));

    showToast?.(`🚨 [THỬ NGHIỆM] Kích hoạt tập kích: ${incursion.enemyFleetName} nhắm vào ${incursion.targetNodeName}!`);
  }, [cosmicState, player.currentRealm, setPlayer, showToast]);

  return {
    defenseState,
    activeIncursions,
    incursionByNodeId,
    urgentIncursion,
    selectedIncursionId,
    setSelectedIncursionId,
    isDefenseModalOpen,
    setIsDefenseModalOpen,
    lastDefenseReport,
    isFiringLaser,
    tickerNow,
    handleUpgradeFortification,
    handleAssignGarrison,
    handleResolveSimulatedDefense,
    handleManualInterception,
    handleTriggerTestIncursion,
    getNodeFortification: (nodeId: string) => getNodeFortification(defenseState, nodeId),
    getEffectiveDefensePower: (nodeId: string) => calculateEffectiveDefensePower(nodeId, defenseState),
    canUpgradeFort: (nodeId: string, type: FortificationType) =>
      cosmicState ? canUpgradeFortification(nodeId, type, cosmicState, player) : { allowed: false },
  };
}
