// components/dashboard/LeftColumn.tsx
// Pure orchestrator container for Dashboard Left Column
import React, { useState } from 'react';
import { PlayerStats, Manual } from '@/lib/types';
import {
  TabType,
  FateTierInfo,
  getFateTierInfo,
  CharacterIdentityCard,
  CombatStatsCard,
  DestinyCard,
  CompanionCard,
  HeritageAndCultivationCard,
  FourAttributesCard,
  DivinationFateModal
} from './left';

export { getFateTierInfo };
export type { TabType, FateTierInfo };

export interface LeftColumnProps {
  player: PlayerStats;
  combatPower: number;
  currentRealm: any;
  currentRealmBadge: any;
  combatStats: {
    atk: number;
    def: number;
    soul: number;
    speed: number;
    critRate: number;
    critDmg: number;
    dmgReduction?: number;
    hpRegenPercent?: number;
    soulSuppression?: boolean;
  };
  curHP: number;
  maxHP: number;
  hpPercent: number;
  curMP: number;
  maxMP: number;
  mpPercent: number;
  handleRestAndHeal: () => void;
  setShowDestinyModal: (show: boolean) => void;
  setSelectedCompanionId: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
  setShowRefineModal: (show: boolean) => void;
  setShowRootModal: (show: boolean) => void;
  setShowMeridianModal?: (show: boolean) => void;
  equippedTamPhap?: Manual | null;

  equippedTheThuat?: Manual | null;
  equippedTT1?: Manual | null;
  equippedTT2?: Manual | null;
  nextRealm: any;
  tuViPercent: number;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
  onShowToast?: (msg: string) => void;
  openAchievementsModal?: () => void;
  openRebornModal?: () => void;
  openMemorialModal?: () => void;
}

export const LeftColumn: React.FC<LeftColumnProps> = ({
  player,
  combatPower,
  currentRealm,
  currentRealmBadge,
  combatStats,
  curHP,
  maxHP,
  hpPercent,
  curMP,
  maxMP,
  mpPercent,
  handleRestAndHeal,
  setShowDestinyModal,
  setSelectedCompanionId,
  setActiveTab,
  setShowRefineModal,
  setShowRootModal,
  setShowMeridianModal,
  equippedTamPhap,

  equippedTheThuat,
  equippedTT1,
  equippedTT2,
  nextRealm,
  tuViPercent,
  onUpdatePlayer,
  onAddLog,
  onShowToast,
  openAchievementsModal,
  openRebornModal,
  openMemorialModal
}) => {
  const [showDivinationModal, setShowDivinationModal] = useState(false);
  const fateTier = getFateTierInfo(player.khiVan);

  return (
    <section className="lg:col-span-3 h-full overflow-y-auto pr-1.5 custom-scrollbar space-y-2.5 min-h-0">
      <div className="cophong-card cophong-corner p-2.5 sm:p-3 rounded-xl space-y-2.5">
        {/* 1. Avatar, Cảnh Giới, Tu Vi, Đột Phá */}
        <CharacterIdentityCard
          player={player}
          currentRealm={currentRealm}
          currentRealmBadge={currentRealmBadge}
          setActiveTab={setActiveTab}
          openAchievementsModal={openAchievementsModal}
          openRebornModal={openRebornModal}
          openMemorialModal={openMemorialModal}
        />

        {/* 2. Chỉ Số Chiến Đấu, Khí Huyết, Linh Lực */}
        <CombatStatsCard
          player={player}
          combatPower={combatPower}
          combatStats={combatStats}
          curHP={curHP}
          maxHP={maxHP}
          hpPercent={hpPercent}
          curMP={curMP}
          maxMP={maxMP}
          mpPercent={mpPercent}
          handleRestAndHeal={handleRestAndHeal}
        />

        {/* 3. Tứ Đại Thuộc Tính & Cán Cân Perk */}
        <FourAttributesCard
          player={player}
          fateTier={fateTier}
          onOpenDivinationModal={() => setShowDivinationModal(true)}
        />

        {/* 4. Mệnh Cách Bát Quái */}
        <DestinyCard
          player={player}
          setShowDestinyModal={setShowDestinyModal}
        />

        {/* 5. Thể Chất Tiên Thiên & Linh Căn Ngũ Hành */}
        <HeritageAndCultivationCard
          player={player}
          setShowRefineModal={setShowRefineModal}
          setShowRootModal={setShowRootModal}
          setShowMeridianModal={setShowMeridianModal}
          equippedTamPhap={equippedTamPhap}

          equippedTheThuat={equippedTheThuat}
          equippedTT1={equippedTT1}
          equippedTT2={equippedTT2}
          nextRealm={nextRealm}
          tuViPercent={tuViPercent}
          setActiveTab={setActiveTab}
        />

        {/* 6. Đạo Lữ Đồng Hành Sánh Bước & Pháp Bảo Hộ Thân */}
        <CompanionCard
          player={player}
          setSelectedCompanionId={setSelectedCompanionId}
          setActiveTab={setActiveTab}
        />
      </div>

      {showDivinationModal && (
        <DivinationFateModal
          player={player}
          onClose={() => setShowDivinationModal(false)}
          onUpdatePlayer={onUpdatePlayer}
          onAddLog={onAddLog}
          onShowToast={onShowToast}
        />
      )}
    </section>
  );
};
