'use client';

// hooks/useDomainResonance.ts
// Custom Hook quản lý trạng thái và tương tác của phân hệ:
// "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"

import { useState, useMemo, useCallback } from 'react';
import { PlayerStats, Manual } from '@/lib/types';
import {
  ActiveDomainResonance,
  PotentialDomainResonance,
  DomainResonanceConfig
} from '@/lib/types/domain-resonance';
import {
  DOMAIN_RESONANCES_REGISTRY,
  detectActiveDomainResonances,
  getPotentialDomainResonances,
  getPlayerEquippedManualList,
  calculateDomainResonanceBonuses
} from '@/lib/domain-resonance-logic';

export interface UseDomainResonanceProps {
  player: PlayerStats;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: any) => void;
  showToast?: (msg: string) => void;
}

export function useDomainResonance({
  player,
  setPlayer,
  addLog,
  showToast
}: UseDomainResonanceProps) {
  // Lựa chọn Dị Tượng đang xem chi tiết (preview)
  const [selectedResonanceId, setSelectedResonanceId] = useState<string | null>(
    DOMAIN_RESONANCES_REGISTRY[0]?.id || null
  );

  // 1. Trích xuất danh sách Thần Thông đang thực sự trang bị (Reactive & Memoized)
  const equippedManuals: Manual[] = useMemo(() => {
    return getPlayerEquippedManualList(player);
  }, [player.equippedManuals, player.manuals]);

  // 2. Tự động thẩm định Dị Tượng kích hoạt với Zero-Latency
  const activeResonances: ActiveDomainResonance[] = useMemo(() => {
    return detectActiveDomainResonances(
      equippedManuals,
      player.natalArtifact || null,
      player.currentRealm || 0
    );
  }, [equippedManuals, player.natalArtifact, player.currentRealm]);

  // 3. Gợi ý các Dị Tượng tiềm năng sắp đạt được
  const potentialResonances: PotentialDomainResonance[] = useMemo(() => {
    return getPotentialDomainResonances(
      equippedManuals,
      player.natalArtifact || null
    );
  }, [equippedManuals, player.natalArtifact]);

  // 4. Tổng hợp các chỉ số gia trì từ Dị Tượng
  const bonuses = useMemo(() => {
    return calculateDomainResonanceBonuses(activeResonances);
  }, [activeResonances]);

  // 5. Cấu hình chi tiết của Dị Tượng đang được chọn xem trước
  const selectedResonanceConfig: DomainResonanceConfig | null = useMemo(() => {
    if (!selectedResonanceId) return null;
    return DOMAIN_RESONANCES_REGISTRY.find(r => r.id === selectedResonanceId) || null;
  }, [selectedResonanceId]);

  // 6. Kiểm tra xem 1 Dị Tượng cụ thể có đang kích hoạt không
  const isResonanceActive = useCallback(
    (resonanceId: string): boolean => {
      return activeResonances.some(r => r.resonanceId === resonanceId);
    },
    [activeResonances]
  );

  // 7. Chọn xem trước Dị Tượng
  const handlePreviewResonance = useCallback((resonanceId: string) => {
    setSelectedResonanceId(resonanceId);
  }, []);

  return {
    allResonanceConfigs: DOMAIN_RESONANCES_REGISTRY,
    equippedManuals,
    activeResonances,
    activeResonancesCount: activeResonances.length,
    potentialResonances,
    bonuses,
    selectedResonanceId,
    selectedResonanceConfig,
    isResonanceActive,
    handlePreviewResonance
  };
}

export type UseDomainResonanceReturn = ReturnType<typeof useDomainResonance>;
