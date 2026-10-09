const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('reconstructed_LeftColumn.tsx', 'utf8');
const lines = raw.split('\n');

function getSlice(fromLine, toLine) {
  return lines.slice(fromLine - 1, toLine).join('\n');
}

const outDir = path.join(__dirname, '../components/dashboard/left');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1. types.ts
const typesCode = `// components/dashboard/left/types.ts
import { PlayerStats, Manual } from '@/lib/types';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu' | 'beasts';

export interface FateTierInfo {
  tier: string;
  label: string;
  color: string;
  badgeClass: string;
  barClass: string;
  glowClass: string;
}

export function getFateTierInfo(khiVan: number = 50): FateTierInfo {
  if (khiVan >= 300) {
    return {
      tier: 'hon_don',
      label: 'Hỗn Độn Chí Tôn',
      color: 'text-amber-300',
      badgeClass: 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-yellow-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
      barClass: 'bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-300 animate-pulse',
      glowClass: 'shadow-[0_0_12px_rgba(251,191,36,0.8)]'
    };
  }
  if (khiVan >= 200) {
    return {
      tier: 'van_co',
      label: 'Vạn Cổ Độc Tôn',
      color: 'text-yellow-400',
      badgeClass: 'bg-amber-950/70 border-amber-400 text-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.4)]',
      barClass: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
      glowClass: 'shadow-[0_0_10px_rgba(250,204,21,0.6)]'
    };
  }
  if (khiVan >= 150) {
    return {
      tier: 'nghich_thien',
      label: 'Nghịch Thiên Chi Mệnh',
      color: 'text-orange-400',
      badgeClass: 'bg-orange-950/70 border-orange-400 text-orange-300 shadow-[0_0_6px_rgba(251,146,60,0.3)]',
      barClass: 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_6px_rgba(251,146,60,0.5)]',
      glowClass: 'shadow-[0_0_8px_rgba(251,146,60,0.5)]'
    };
  }
  if (khiVan >= 120) {
    return {
      tier: 'cai_the',
      label: 'Khí Vận Cái Thế',
      color: 'text-amber-400',
      badgeClass: 'bg-amber-950/60 border-amber-500/60 text-amber-300',
      barClass: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]',
      glowClass: 'shadow-[0_0_6px_rgba(245,158,11,0.4)]'
    };
  }
  if (khiVan >= 90) {
    return {
      tier: 'thien_menh',
      label: 'Thiên Mệnh Chi Tử',
      color: 'text-yellow-400',
      badgeClass: 'bg-yellow-950/50 border-yellow-500/50 text-yellow-300',
      barClass: 'bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.3)]',
      glowClass: 'shadow-[0_0_4px_rgba(245,158,11,0.3)]'
    };
  }
  if (khiVan >= 70) {
    return {
      tier: 'phuc_duyen',
      label: 'Phúc Duyên Thâm Hậu',
      color: 'text-amber-300',
      badgeClass: 'bg-amber-950/40 border-amber-600/40 text-amber-300',
      barClass: 'bg-amber-500',
      glowClass: ''
    };
  }
  if (khiVan >= 50) {
    return {
      tier: 'hanh_thong',
      label: 'Khí Vận Hanh Thông',
      color: 'text-emerald-400',
      badgeClass: 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300',
      barClass: 'bg-emerald-500',
      glowClass: ''
    };
  }
  if (khiVan >= 30) {
    return {
      tier: 'binh_thuong',
      label: 'Bình Thường Chi Mệnh',
      color: 'text-zinc-400',
      badgeClass: 'bg-zinc-900 border-zinc-700 text-zinc-400',
      barClass: 'bg-zinc-500',
      glowClass: ''
    };
  }
  return {
    tier: 'menh_bac',
    label: 'Mệnh Bạc Như Chỉ',
    color: 'text-zinc-500',
    badgeClass: 'bg-zinc-900/60 border-zinc-800 text-zinc-500',
    barClass: 'bg-zinc-600',
    glowClass: ''
  };
}
`;
fs.writeFileSync(path.join(outDir, 'types.ts'), typesCode, 'utf8');

// 2. CharacterIdentityCard.tsx (lines 342 - 755)
const charSlice = getSlice(342, 755);
const charTemplate = `// components/dashboard/left/CharacterIdentityCard.tsx
import React, { useState } from 'react';
import { Crown, Sparkles, Feather, Zap } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { COMPANIONS_MAP } from '@/lib/companions-data';
import { getTitleDefinition } from '@/lib/achievements-data';
import { getSectProfile, getRankTitle } from '@/lib/sect-data';
import { RealmVisualAnimation } from '@/components/realm/RealmVisualAnimation';
import { getRealmVisualConfig } from '@/lib/realm-visuals-data';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

const REALM_STEPPER_GROUPS = [
  { id: 'lk', label: '0-10', name: 'Phàm & Luyện Khí', range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], defaultIdx: 0, color: '#38bdf8' },
  { id: 'trucco', label: 'Trúc Cơ', name: 'Trúc Cơ (11-15)', range: [11, 12, 13, 14, 15], defaultIdx: 11, color: '#10b981' },
  { id: 'kimdan', label: 'Kim Đan', name: 'Kim Đan (16-20)', range: [16, 17, 18, 19, 20], defaultIdx: 16, color: '#f59e0b' },
  { id: 'nguyenanh', label: 'Nguyên Anh', name: 'Nguyên Anh (21-25)', range: [21, 22, 23, 24, 25], defaultIdx: 21, color: '#a855f7' },
  { id: 'hoathan', label: 'Hóa Thần', name: 'Hóa Thần (26-30)', range: [26, 27, 28, 29, 30], defaultIdx: 26, color: '#f43f5e' }
];

export interface CharacterIdentityCardProps {
  player: PlayerStats;
  currentRealmBadge: any;
  openAchievementsModal?: () => void;
}

export const CharacterIdentityCard: React.FC<CharacterIdentityCardProps> = ({
  player,
  currentRealmBadge,
  openAchievementsModal
}) => {
  const [previewRealm, setPreviewRealm] = useState<number | null>(null);
  const [showRealmStepper, setShowRealmStepper] = useState<boolean>(false);
  const [activeStepperGroup, setActiveStepperGroup] = useState<string>('lk');

  const currentRealmIndex = Math.max(
    0,
    Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
  );

  return (
    <>
__BODY__
    </>
  );
};
`;
fs.writeFileSync(path.join(outDir, 'CharacterIdentityCard.tsx'), charTemplate.replace('__BODY__', charSlice), 'utf8');

// 3. CombatStatsCard.tsx (lines 758 - 890)
const combatSlice = getSlice(758, 890);
const combatTemplate = `// components/dashboard/left/CombatStatsCard.tsx
import React from 'react';
import { Swords, Flame, Heart, Droplet, RefreshCw, Shield, Eye, Wind, Target } from 'lucide-react';
import { PlayerStats } from '@/lib/types';

export interface CombatStatsCardProps {
  player: PlayerStats;
  combatPower: number;
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
}

export const CombatStatsCard: React.FC<CombatStatsCardProps> = ({
  player,
  combatPower,
  combatStats,
  curHP,
  maxHP,
  hpPercent,
  curMP,
  maxMP,
  mpPercent,
  handleRestAndHeal
}) => {
  return (
    <>
__BODY__
    </>
  );
};
`;
fs.writeFileSync(path.join(outDir, 'CombatStatsCard.tsx'), combatTemplate.replace('__BODY__', combatSlice), 'utf8');

// 4. TwinCultivationTrackCard.tsx (lines 895 - 1170)
const twinSlice = getSlice(895, 1170);
const twinTemplate = `// components/dashboard/left/TwinCultivationTrackCard.tsx
import React, { useState } from 'react';
import { Activity, Zap, Sparkles } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  BODY_REALMS_CONFIG,
  SOUL_REALMS_CONFIG,
  getBodyRefinementStats,
  getSoulCultivationStats,
  canUpgradeBodyRefinement,
  canUpgradeSoulCultivation,
  createDefaultBodyRefinement,
  createDefaultSoulCultivation
} from '@/lib/body-soul-data';

export interface TwinCultivationTrackCardProps {
  player: PlayerStats;
  handleUpgradeBodyRefinement?: () => void;
  handleUpgradeSoulCultivation?: () => void;
}

export const TwinCultivationTrackCard: React.FC<TwinCultivationTrackCardProps> = ({
  player,
  handleUpgradeBodyRefinement,
  handleUpgradeSoulCultivation
}) => {
  const [dualCultivationTab, setDualCultivationTab] = useState<'body' | 'soul'>('body');

  return (
    <>
__BODY__
    </>
  );
};
`;
fs.writeFileSync(path.join(outDir, 'TwinCultivationTrackCard.tsx'), twinTemplate.replace('__BODY__', twinSlice), 'utf8');

// 5. DestinyCard.tsx (lines 1173 - 1213)
const destinySlice = getSlice(1173, 1213);
const destinyTemplate = `// components/dashboard/left/DestinyCard.tsx
import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { DESTINY_REROLL_PILL_ID } from '@/lib/destiny-data';

export interface DestinyCardProps {
  player: PlayerStats;
  setShowDestinyModal: (show: boolean) => void;
}

export const DestinyCard: React.FC<DestinyCardProps> = ({
  player,
  setShowDestinyModal
}) => {
  return (
__BODY__
  );
};
`;
fs.writeFileSync(path.join(outDir, 'DestinyCard.tsx'), destinyTemplate.replace('__BODY__', destinySlice), 'utf8');

// 6. CompanionAndGardenCard.tsx (lines 1216 - 1471)
const compGardenSlice = getSlice(1216, 1471);
const compGardenTemplate = `// components/dashboard/left/CompanionAndGardenCard.tsx
import React from 'react';
import { Heart, Sparkles, Shield, Sprout, Plus, RotateCcw } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { COMPANIONS_MAP } from '@/lib/companions-data';
import { LINH_DIEN_LEVELS, HERB_SEEDS } from '@/lib/garden-data';
import { TabType } from './types';

export interface CompanionAndGardenCardProps {
  player: PlayerStats;
  setSelectedCompanionId: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
  currentTimestamp: number;
  setShowLinhDienUpgradeModal: (show: boolean) => void;
  handleHarvestAllPlots: () => void;
  setSelectedPlotId: (id: number) => void;
  setShowPlantSeedModal: (show: boolean) => void;
  handleHarvestPlot: (plotId: number) => void;
}

export const CompanionAndGardenCard: React.FC<CompanionAndGardenCardProps> = ({
  player,
  setSelectedCompanionId,
  setActiveTab,
  currentTimestamp,
  setShowLinhDienUpgradeModal,
  handleHarvestAllPlots,
  setSelectedPlotId,
  setShowPlantSeedModal,
  handleHarvestPlot
}) => {
  return (
    <>
__BODY__
    </>
  );
};
`;
fs.writeFileSync(path.join(outDir, 'CompanionAndGardenCard.tsx'), compGardenTemplate.replace('__BODY__', compGardenSlice), 'utf8');

// 7. HeritageAndCultivationCard.tsx (lines 1474 - 1776)
const heritageSlice = getSlice(1474, 1776);
const heritageTemplate = `// components/dashboard/left/HeritageAndCultivationCard.tsx
import React from 'react';
import { Dna, Sparkles, BookOpen, Coins, Award } from 'lucide-react';
import { PlayerStats, Manual } from '@/lib/types';
import { ELEMENT_ICONS, ELEMENT_NAMES, getManualSynergy } from '@/lib/elemental-system';
import { calculateEffectiveRequiredTuVi } from '@/lib/attribute-perks';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

export interface HeritageAndCultivationCardProps {
  player: PlayerStats;
  setShowRefineModal: (show: boolean) => void;
  setShowRootModal: (show: boolean) => void;
  equippedTamPhap?: Manual | null;
  equippedTheThuat?: Manual | null;
  equippedTT1?: Manual | null;
  equippedTT2?: Manual | null;
  nextRealm: any;
  tuViPercent: number;
}

export const HeritageAndCultivationCard: React.FC<HeritageAndCultivationCardProps> = ({
  player,
  setShowRefineModal,
  setShowRootModal,
  equippedTamPhap,
  equippedTheThuat,
  equippedTT1,
  equippedTT2,
  nextRealm,
  tuViPercent
}) => {
  const currentRealmIndex = Math.max(
    0,
    Math.min(realmsData.length - 1, parseInt(String(player?.currentRealm ?? 0), 10) || 0)
  );
  const currentRealmData = realmsData[currentRealmIndex];
  const nextRealmIndex = currentRealmIndex + 1;
  const targetNextRealm = nextRealm || (nextRealmIndex < realmsData.length ? realmsData[nextRealmIndex] : undefined);

  return (
    <>
__BODY__
    </>
  );
};
`;
fs.writeFileSync(path.join(outDir, 'HeritageAndCultivationCard.tsx'), heritageTemplate.replace('__BODY__', heritageSlice), 'utf8');

// 8. FourAttributesCard.tsx (lines 1779 - 1983)
const fourAttrSlice = getSlice(1779, 1983);
const fourAttrTemplate = `// components/dashboard/left/FourAttributesCard.tsx
import React from 'react';
import { Heart, BookOpen, Compass, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { HEXAGRAM_CONFIGS } from '@/lib/divination-data';
import { getMaxStatLimit, getStatCapDescription, ATTRIBUTE_MILESTONE_PERKS } from '@/lib/attribute-perks';
import { FateTierInfo } from './types';

export interface FourAttributesCardProps {
  player: PlayerStats;
  fateTier: FateTierInfo;
  onOpenDivinationModal: () => void;
}

export const FourAttributesCard: React.FC<FourAttributesCardProps> = ({
  player,
  fateTier,
  onOpenDivinationModal
}) => {
  return (
    <>
__BODY__
    </>
  );
};
`;
fs.writeFileSync(path.join(outDir, 'FourAttributesCard.tsx'), fourAttrTemplate.replace('__BODY__', fourAttrSlice), 'utf8');

// 9. DivinationFateModal.tsx (lines 1990 - 2266)
const divModalSlice = getSlice(1990, 2266).replace('onClick={() => setShowDivinationModal(false)}', 'onClick={onClose}');
const divModalTemplate = `// components/dashboard/left/DivinationFateModal.tsx
import React, { useState } from 'react';
import { Sparkles, Crown, RotateCcw, X, AlertTriangle, CheckCircle2, RefreshCw, Flame } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  HEXAGRAM_CONFIGS,
  rollDailyDivination,
  canDivinateToday,
  getDivinationRerollCost,
  performFateReroll
} from '@/lib/divination-data';
import { DESTINY_REROLL_PILL_ID } from '@/lib/destiny-data';
import { getSectProfile } from '@/lib/sect-data';

export interface DivinationFateModalProps {
  player: PlayerStats;
  onClose: () => void;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
  onShowToast?: (msg: string) => void;
}

export const DivinationFateModal: React.FC<DivinationFateModalProps> = ({
  player,
  onClose,
  onUpdatePlayer,
  onAddLog,
  onShowToast
}) => {
  const [isDivining, setIsDivining] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);
  const [coinFlipping, setCoinFlipping] = useState(false);

  // 1. Gieo Quẻ Thiên Cơ
  const handleDivinateRoll = () => {
    setIsDivining(true);
    setCoinFlipping(true);

    setTimeout(() => {
      const newDivination = rollDailyDivination(player.khiVan);
      const updatedPlayer: PlayerStats = {
        ...player,
        dailyDivination: newDivination
      };

      if (onUpdatePlayer) {
        onUpdatePlayer(updatedPlayer);
      }

      const hexCfg = HEXAGRAM_CONFIGS[newDivination.hexagram];
      if (onShowToast) {
        onShowToast(\`☯️ Gieo quẻ Thiên Cơ: [\${hexCfg.name} - \${hexCfg.hexagramName}]!\`);
      }
      if (onAddLog) {
        onAddLog(
          \`☯️ Thiên Cơ Bát Quái: [\${hexCfg.name}]\`,
          \`Quẻ tượng: "\${hexCfg.hexagramName}". Đạo ngôn: "\${hexCfg.poetry}". \${hexCfg.description}\`,
          hexCfg.id === 'hung' || hexCfg.id === 'dai_hung' ? 'danger' : 'special'
        );
      }

      setCoinFlipping(false);
      setIsDivining(false);
    }, 700);
  };

  // 2. Thuật Nghịch Thiên Cải Mệnh
  const handleRerollFateMethod = (method: 'pill' | 'sect' | 'linh_thach') => {
    setIsRerolling(true);
    setTimeout(() => {
      const res = performFateReroll(player, method);
      if (res.success) {
        if (onUpdatePlayer) {
          onUpdatePlayer(res.updatedPlayer);
        }
        if (onShowToast) {
          onShowToast(res.message);
        }
        if (onAddLog && res.updatedPlayer.dailyDivination) {
          const cfg = HEXAGRAM_CONFIGS[res.updatedPlayer.dailyDivination.hexagram];
          onAddLog(
            '🌟 Nghịch Thiên Cải Mệnh',
            res.message + \` Quẻ mới: [\${cfg.name} - \${cfg.hexagramName}]. Vận mệnh đã xoay chuyển!\`,
            'special'
          );
        }
      } else {
        if (onShowToast) {
          onShowToast(res.message);
        }
      }
      setIsRerolling(false);
    }, 500);
  };

  return (
__BODY__
  );
};
`;
fs.writeFileSync(path.join(outDir, 'DivinationFateModal.tsx'), divModalTemplate.replace('__BODY__', divModalSlice), 'utf8');

// 10. index.ts
const indexCode = `// components/dashboard/left/index.ts
export * from './types';
export * from './CharacterIdentityCard';
export * from './CombatStatsCard';
export * from './TwinCultivationTrackCard';
export * from './DestinyCard';
export * from './CompanionAndGardenCard';
export * from './HeritageAndCultivationCard';
export * from './FourAttributesCard';
export * from './DivinationFateModal';
`;
fs.writeFileSync(path.join(outDir, 'index.ts'), indexCode, 'utf8');

console.log('Successfully generated all components from authentic reconstructed lines!');
