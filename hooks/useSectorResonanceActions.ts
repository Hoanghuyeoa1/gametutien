'use client';
// hooks/useSectorResonanceActions.ts
// Custom hook điều khiển phân hệ "Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense)"
// Bao gồm: Thiết lập/Hủy tuyến năng lượng, Nâng cấp dây chuyền truyền dẫn, và Khai hỏa chi viện khẩn cấp

import { useState, useMemo, useCallback } from 'react';
import type { PlayerStats } from '@/lib/types/player';
import type {
  SectorResonanceLink,
  SectorResonanceDefenseResult,
  GridAuraType,
} from '@/lib/types/sector-resonance';
import {
  canEstablishResonanceLink,
  establishResonanceLink,
  disconnectResonanceLink,
  upgradeResonanceLink,
  evaluateResonanceGridAuras,
  calculateCrossFireArtillerySupport,
} from '@/lib/sector-resonance-logic';
import { COSMIC_NODES_MAP } from '@/lib/cosmic-map-data';

interface UseSectorResonanceActionsProps {
  player: PlayerStats;
  setPlayer?: (updater: (prev: PlayerStats) => PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: any) => void;
}

export function useSectorResonanceActions({
  player,
  setPlayer,
  showToast,
  addLog,
}: UseSectorResonanceActionsProps) {
  const [isBombarding, setIsBombarding] = useState(false);
  const [lastResonanceResult, setLastResonanceResult] = useState<SectorResonanceDefenseResult | null>(null);

  const cosmicState = player.cosmicState;
  const defenseState = cosmicState?.defenseState;

  // ─── Danh sách tuyến liên kết hiện tại ─────────────────────────────────────
  const resonanceLinks = useMemo<SectorResonanceLink[]>(() => {
    if (!defenseState) return [];
    return defenseState.resonanceLinks || defenseState.sectorResonanceGrid || [];
  }, [defenseState]);

  // ─── Đánh giá Lĩnh Vực Cộng Hưởng ──────────────────────────────────────────
  const auraEvaluation = useMemo(() => {
    return evaluateResonanceGridAuras(resonanceLinks);
  }, [resonanceLinks]);

  const activeAuras: GridAuraType[] = auraEvaluation.activeAuras;
  const hasTriangle: boolean = auraEvaluation.hasTriangle;
  const crossFireEnergyBuffer: number = defenseState?.crossFireEnergyBuffer || 0;

  // ─── Kiểm tra khả năng tạo liên kết giữa 2 Node ────────────────────────────
  const checkLinkEstablishment = useCallback(
    (sourceId: string, targetId: string) => {
      if (!cosmicState) {
        return { allowed: false, reason: 'Chưa mở khóa Chư Thiên Tinh Đồ.' };
      }
      return canEstablishResonanceLink(sourceId, targetId, {
        occupiedNodeIds: cosmicState.occupiedNodeIds || [],
        fortifications: defenseState?.fortifications,
        playerLinhThach: player.linhThach || 0,
        existingLinks: resonanceLinks,
      });
    },
    [cosmicState, defenseState?.fortifications, player.linhThach, resonanceLinks]
  );

  // ─── Kích hoạt / Hủy Liên Kết Tuyến Năng Lượng ─────────────────────────────
  const handleToggleLink = useCallback(
    (sourceId: string, targetId: string) => {
      if (!cosmicState || !setPlayer) return;

      const existingLink = resonanceLinks.find(
        l =>
          (l.sourceNodeId === sourceId && l.targetNodeId === targetId) ||
          (l.sourceNodeId === targetId && l.targetNodeId === sourceId)
      );

      const sourceName = COSMIC_NODES_MAP[sourceId]?.name || sourceId;
      const targetName = COSMIC_NODES_MAP[targetId]?.name || targetId;

      if (existingLink) {
        // Hủy liên kết
        const { nextLinks } = disconnectResonanceLink(existingLink.id, resonanceLinks);

        setPlayer(prev => ({
          ...prev,
          cosmicState: {
            ...prev.cosmicState!,
            defenseState: {
              ...prev.cosmicState!.defenseState!,
              resonanceLinks: nextLinks,
              sectorResonanceGrid: nextLinks,
            },
          },
        }));

        showToast?.(`⚡ Đã ngắt Tuyến Năng Lượng giữa [${sourceName}] và [${targetName}].`);
        addLog?.(
          'Ngắt Kết Nối Tinh Võng',
          `Đã giải trừ liên kết cộng hưởng giữa ${sourceName} và ${targetName}.`,
          'info'
        );
      } else {
        // Thiết lập liên kết mới
        const res = establishResonanceLink(sourceId, targetId, {
          occupiedNodeIds: cosmicState.occupiedNodeIds || [],
          fortifications: defenseState?.fortifications,
          playerLinhThach: player.linhThach || 0,
          existingLinks: resonanceLinks,
        });

        if (!res.success || !res.link) {
          showToast?.(`❌ ${res.message}`);
          return;
        }

        const nextLinks = [...resonanceLinks, res.link];

        setPlayer(prev => ({
          ...prev,
          linhThach: res.remainingLinhThach,
          ...(prev.spiritStones !== undefined ? { spiritStones: res.remainingLinhThach } : {}),
          cosmicState: {
            ...prev.cosmicState!,
            defenseState: {
              ...prev.cosmicState!.defenseState!,
              resonanceLinks: nextLinks,
              sectorResonanceGrid: nextLinks,
            },
          },
        }));

        showToast?.(`✨ ${res.message}`);
        addLog?.(
          'Kết Nối Tinh Võng Thành Công',
          `Đã khai thông Tuyến Năng Lượng giữa ${sourceName} và ${targetName} (Cự ly: ${res.link.distance.toFixed(0)}, Hiệu suất: ${(res.link.energyTransmissionEfficiency * 100).toFixed(0)}%).`,
          'success'
        );
      }
    },
    [cosmicState, defenseState, player.linhThach, resonanceLinks, setPlayer, showToast, addLog]
  );

  // ─── Nâng Cấp Dây Chuyền Truyền Dẫn ─────────────────────────────────────────
  const handleUpgradeGridTransmission = useCallback(
    (linkId: string) => {
      if (!cosmicState || !setPlayer) return;

      const res = upgradeResonanceLink(linkId, resonanceLinks, player.linhThach || 0);
      if (!res.success) {
        showToast?.(`❌ ${res.message}`);
        return;
      }

      setPlayer(prev => ({
        ...prev,
        linhThach: res.remainingLinhThach,
        ...(prev.spiritStones !== undefined ? { spiritStones: res.remainingLinhThach } : {}),
        cosmicState: {
          ...prev.cosmicState!,
          defenseState: {
            ...prev.cosmicState!.defenseState!,
            resonanceLinks: res.nextLinks,
            sectorResonanceGrid: res.nextLinks,
          },
        },
      }));

      showToast?.(`⚡ ${res.message}`);
      addLog?.(
        'Nâng Cấp Dây Chuyền Truyền Dẫn',
        res.message,
        'success'
      );
    },
    [cosmicState, player.linhThach, resonanceLinks, setPlayer, showToast, addLog]
  );

  // ─── Khai Hỏa Chi Viện Khẩn Cấp (Manual Cross-Fire Bombardment) ─────────────
  const handleManualBombardment = useCallback(
    (targetNodeId: string) => {
      if (!cosmicState || !setPlayer) return;

      const targetName = COSMIC_NODES_MAP[targetNodeId]?.name || targetNodeId;
      const incursion = (defenseState?.activeIncursions || []).find(
        i => i.targetNodeId === targetNodeId && (i.status === 'approaching' || i.status === 'sieging')
      );

      // Nếu không có incursion, mô phỏng diễn tập pháo kích kiểm tra mạng lưới
      const targetHp = incursion ? incursion.enemyCurrentHp : 80_000;
      const targetAtk = incursion ? incursion.enemyAtk : 15_000;

      setIsBombarding(true);

      setTimeout(() => {
        setIsBombarding(false);

        try {
          const outcome = calculateCrossFireArtillerySupport({
            defendingNodeId: targetNodeId,
            waveHp: targetHp,
            waveAtk: targetAtk,
            links: resonanceLinks,
            fortifications: defenseState?.fortifications,
            garrisons: defenseState?.garrisons,
            occupiedNodeIds: cosmicState.occupiedNodeIds,
            playerLinhThach: player.linhThach || 0,
            crossFireEnergyBuffer: defenseState?.crossFireEnergyBuffer || 0,
          });

          setLastResonanceResult(outcome);

          const engagedCount = outcome.participatingNodes.filter(p => p.cannonsEngaged > 0).length;
          if (engagedCount === 0) {
            showToast?.(`⚠️ Không có cứ điểm liên kết nào đủ đạn dược hoặc pháo để khai hỏa.`);
            return;
          }

          // Cập nhật state (trừ tài nguyên và giảm máu quái nếu có incursion)
          setPlayer(prev => {
            let nextIncursions = prev.cosmicState?.defenseState?.activeIncursions || [];
            if (incursion) {
              nextIncursions = nextIncursions.map(inc => {
                if (inc.id === incursion.id) {
                  const newHp = Math.max(0, inc.enemyCurrentHp - outcome.crossFireDamageTotal);
                  return {
                    ...inc,
                    enemyCurrentHp: newHp,
                    status: newHp <= 0 ? ('repelled' as const) : inc.status,
                  };
                }
                return inc;
              });
            }

            return {
              ...prev,
              linhThach: outcome.remainingLinhThach,
              ...(prev.spiritStones !== undefined ? { spiritStones: outcome.remainingLinhThach } : {}),
              cosmicState: {
                ...prev.cosmicState!,
                defenseState: {
                  ...prev.cosmicState!.defenseState!,
                  crossFireEnergyBuffer: outcome.remainingEnergyBuffer,
                  activeIncursions: nextIncursions,
                },
              },
            };
          });

          showToast?.(
            `💥 Mạng lưới đã khai hỏa ${engagedCount} đại pháo chi viện tới ${targetName}, gây ${outcome.crossFireDamageTotal.toLocaleString()} sát thương!`
          );
          addLog?.(
            'Khai Hỏa Chi Viện Vượt Không Gian',
            `Tổng cộng ${engagedCount} cứ điểm đã đồng loạt nã pháo chi viện cho ${targetName}. Gây ${outcome.crossFireDamageTotal.toLocaleString()} sát thương.${outcome.gridAuraTriggered ? ` Kích hoạt Lĩnh Vực: ${outcome.gridAuraTriggered}!` : ''}`,
            'success'
          );
        } catch (err: any) {
          showToast?.(`❌ ${err.message || 'Lỗi khi kích hoạt pháo kích.'}`);
        }
      }, 750);
    },
    [cosmicState, defenseState, player.linhThach, resonanceLinks, setPlayer, showToast, addLog]
  );

  return {
    resonanceLinks,
    activeAuras,
    hasTriangle,
    crossFireEnergyBuffer,
    isBombarding,
    lastResonanceResult,
    checkLinkEstablishment,
    handleToggleLink,
    handleUpgradeGridTransmission,
    handleManualBombardment,
  };
}
