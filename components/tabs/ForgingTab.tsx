import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  HelpCircle,
  Sparkles,
  Store,
  Award,
  Hammer,
  Gem,
  Flame,
  Shield,
  Zap,
  RefreshCw,
  Layers,
  ChevronRight,
  Info,
  CheckSquare,
  Square,
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  PlayerStats,
  EquipmentSlot,
  EquipRecipe,
  Ore,
  GemType,
  EquipmentSocket,
  EquipmentAffix,
  ForgingMainTab,
  Equipment,
  GemItem
} from '@/lib/types';
import { ARTISAN_PERKS } from '@/lib/inventory-data';
import { EQUIP_RECIPES, DEFAULT_ORES } from '@/lib/alchemy-data';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import { checkArtisanCraftRequirement, checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';
import {
  GEM_TYPE_CONFIGS,
  AFFIX_RARITY_CONFIGS,
  SOCKET_PUNCH_COSTS,
  REFORGE_COSTS
} from '@/lib/forging-gem-data';
import {
  getEquipmentTier,
  getEquipQualityKey,
  calculateDismantleReward,
  canDismantleEquipment,
  calculateEssenceReforgeCost
} from '@/lib/forging-logic';
import { NatalArtifactView } from './NatalArtifactView';
import { assessForgeRecipeSupply, CraftingSupplyAssessment } from '@/lib/crafting-supply-logic';
import { ModularMetallurgySection } from '../forging/ModularMetallurgySection';
import { FormationInscriptionSection } from '../forging/FormationInscriptionSection';
import { SoulInfusionSection } from '../forging/SoulInfusionSection';
import { LegacyTemperingSection } from '../forging/LegacyTemperingSection';
import { WeaponTribulationArraySection } from '../forging/WeaponTribulationArraySection';
import { ForgingHarvestModal } from '@/components/modals/ForgingHarvestModal';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu';

export interface ForgingTabProps {
  player: PlayerStats;
  forgingMainTab: ForgingMainTab;
  setForgingMainTab: (tab: ForgingMainTab) => void;
  forgingSubTab: 'equipped' | 'forge' | 'ores' | 'modular' | 'inscription' | 'soul_infusion' | 'legacy_tempering' | 'tribulation_array';
  setForgingSubTab: (tab: 'equipped' | 'forge' | 'ores' | 'modular' | 'inscription' | 'soul_infusion' | 'legacy_tempering' | 'tribulation_array') => void;
  forgingSelectedSlot: EquipmentSlot;
  setForgingSelectedSlot: (slot: EquipmentSlot) => void;
  handleUnlockArtisan: (type: 'alchemy' | 'forging') => void;
  setActiveTab: (tab: TabType) => void;
  handleEnhanceEquip: (slot: EquipmentSlot) => void;
  handleForgeEquip: (recipe: EquipRecipe) => void;
  handleBuyOre: (ore: Ore) => void;
  handlePunchSocket: (slot: EquipmentSlot) => void;
  handleInlayGem: (slot: EquipmentSlot, socketIndex: number, gemId: string) => void;
  handleRemoveGem: (slot: EquipmentSlot, socketIndex: number) => void;
  handleToggleLockAffix: (slot: EquipmentSlot, affixId: string) => void;
  handleReforgeEquipment: (slot: EquipmentSlot) => void;
  selectedDismantleIds?: string[];
  handleSelectDismantleEquip?: (id: string) => void;
  handleSelectAllByGrade?: (grades: string[]) => void;
  handleClearDismantleSelection?: () => void;
  handleConfirmDismantle?: () => void;
  setPlayer?: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: any) => void;
  showToast?: (msg: string) => void;
  handleBuyMissingMaterials?: (assessment: CraftingSupplyAssessment) => boolean;
  handleToggleAutoBuySupply?: (checked?: boolean) => void;
  useEssenceReforge?: boolean;
  handleToggleEssenceReforge?: (val?: boolean) => void;
  forgedEquipmentResult?: Equipment | null;
  isHarvestModalOpen?: boolean;
  isForging?: boolean;
  handleEquipNewlyForgedItem?: () => void;
  handleStoreNewlyForgedItem?: () => void;
  setIsHarvestModalOpen?: (open: boolean) => void;
}

const EQUIPMENT_SLOTS_CONFIG: { slot: EquipmentSlot; name: string; icon: string; desc: string }[] = [
  { slot: 'weapon', name: 'Bản Mệnh Kiếm', icon: '⚔️', desc: 'Vũ khí tấn công' },
  { slot: 'armor', name: 'Đạo Bào Tiên Gia', icon: '🛡️', desc: 'Hộ giáp hộ thể' },
  { slot: 'accessory', name: 'Hộ Thân Phù', icon: '📿', desc: 'Trang sức hộ mệnh' },
  { slot: 'artifact', name: 'Trữ Vật Bảo', icon: '🔮', desc: 'Pháp bảo bản mạng' }
];

export const ForgingTab: React.FC<ForgingTabProps> = ({
  player,
  forgingMainTab,
  setForgingMainTab,
  forgingSubTab,
  setForgingSubTab,
  forgingSelectedSlot,
  setForgingSelectedSlot,
  handleUnlockArtisan,
  setActiveTab,
  handleEnhanceEquip,
  handleForgeEquip,
  handleBuyOre,
  handlePunchSocket,
  handleInlayGem,
  handleRemoveGem,
  handleToggleLockAffix,
  handleReforgeEquipment,
  selectedDismantleIds = [],
  handleSelectDismantleEquip,
  handleSelectAllByGrade,
  handleClearDismantleSelection,
  handleConfirmDismantle,
  setPlayer,
  addLog,
  showToast,
  handleBuyMissingMaterials,
  handleToggleAutoBuySupply,
  useEssenceReforge = false,
  handleToggleEssenceReforge,
  forgedEquipmentResult,
  isHarvestModalOpen = false,
  isForging = false,
  handleEquipNewlyForgedItem,
  handleStoreNewlyForgedItem,
  setIsHarvestModalOpen
}) => {
  const [gemElementFilter, setGemElementFilter] = useState<GemType | 'all'>('all');
  const [selectedSocketIndex, setSelectedSocketIndex] = useState<number | null>(null);
  const [reforgeFlash, setReforgeFlash] = useState<boolean>(false);
  const [dismantleSlotFilter, setDismantleSlotFilter] = useState<EquipmentSlot | 'all'>('all');
  const [dismantleTierFilter, setDismantleTierFilter] = useState<number | 'all'>('all');

  // Selected equipment in Inlay / Reforge views
  const selectedEquip = player.equipment?.[forgingSelectedSlot];

  // Gems in inventory
  const availableGems = (player.inventory?.gems || []).filter(g => {
    if (g.quantity <= 0) return false;
    if (gemElementFilter === 'all') return true;
    return g.gemType === gemElementFilter;
  });

  // Calculate reforge resource cost
  const lockedAffixesCount = (selectedEquip?.affixes || []).filter(a => a.isLocked).length;
  const reforgeLinhThachCost = REFORGE_COSTS.baseLinhThach + (lockedAffixesCount * REFORGE_COSTS.perLockedAffixLinhThach);
  const reforgeOreCost = lockedAffixesCount * REFORGE_COSTS.perLockedAffixOreCount;
  const ownedHuyenThiet = (player.inventory?.ores || []).find(o => o.id === REFORGE_COSTS.requiredOreId)?.quantity || 0;
  const essenceReforgeCost = selectedEquip ? calculateEssenceReforgeCost(selectedEquip, lockedAffixesCount) : 0;
  const playerEssence = player.inventory?.forgingEssence || 0;

  const canReforge = Boolean(
    selectedEquip &&
    (selectedEquip.affixes || []).length > 0 &&
    (useEssenceReforge
      ? playerEssence >= essenceReforgeCost
      : player.linhThach >= reforgeLinhThachCost && ownedHuyenThiet >= reforgeOreCost)
  );

  const onReforgeClick = () => {
    setReforgeFlash(true);
    setTimeout(() => setReforgeFlash(false), 600);
    handleReforgeEquipment(forgingSelectedSlot);
  };

  return (
    <div className="space-y-3">
      {!player.forgingArtisan?.unlocked ? (
        <div className="p-6 text-center space-y-4 rounded-xl bg-gradient-to-b from-[#0c1418] to-[#0a0a0f] border border-cyan-900/40">
          <div className="w-14 h-14 mx-auto rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Lock className="w-7 h-7 text-cyan-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-serif font-bold text-cyan-200">
              Chưa Khai Ngộ Khí Đạo
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Thần Binh Các là thánh địa đúc khí, đục lỗ khảm linh ngọc và tẩy luyện thiên hoả. Cần lĩnh ngộ tinh hoa từ <span className="text-cyan-300 font-semibold">[Bách Luyện Đúc Thuật]</span> mới có thể khai lò điều phối linh khoáng.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-cyan-900/30 text-left text-[11px] text-cyan-300/80 space-y-1">
            <div className="font-semibold text-cyan-300 font-serif flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Manh Mối Khai Mở:</span>
            </div>
            <p className="text-zinc-400 text-[10px] pl-5">
              • Mua tại <span className="text-cyan-300 font-semibold">Vạn Bảo Thương Hội</span> (Khu Trân Phẩm Hiếm)<br/>
              • Nhặt được khi <span className="text-cyan-300 font-semibold">Bế Quan</span> kỳ duyên<br/>
              • Rớt khi đánh Boss Thí Luyện hoặc từ rương <span className="text-cyan-300 font-semibold">Bí Cảnh Đa Tầng</span>
            </p>
          </div>

          {((player.manuals || []).some(m => m.id === 'manual_bach_luyen_duc_thuat') ||
            (player.inventory?.manuals || []).some(m => m.id === 'manual_bach_luyen_duc_thuat') ||
            (player.learnedManuals || []).includes('manual_bach_luyen_duc_thuat')) ? (
            <button
              onClick={() => handleUnlockArtisan('forging')}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition cursor-pointer flex items-center justify-center gap-2 animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Lĩnh Ngộ [Bách Luyện Đúc Thuật] Khai Mở Thần Binh Các</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('merchant')}
              className="w-full py-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-700/50 font-serif text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Đến Vạn Bảo Thương Hội Tầm Bảo →</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Header 5 Đài Luyện Khí (Main Tabs) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-xl bg-gradient-to-b from-[#10141f] to-[#0a0c12] border border-cyan-900/40 shadow-inner">
            <button
              onClick={() => setForgingMainTab('forge')}
              className={`py-2 px-1 rounded-lg text-center cursor-pointer transition font-serif text-xs flex items-center justify-center gap-1.5 font-bold ${
                forgingMainTab === 'forge'
                  ? 'bg-gradient-to-r from-cyan-900/80 to-blue-900/80 text-cyan-100 border border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Hammer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rèn Đúc</span>
            </button>
            <button
              onClick={() => setForgingMainTab('inlay')}
              className={`py-2 px-1 rounded-lg text-center cursor-pointer transition font-serif text-xs flex items-center justify-center gap-1.5 font-bold ${
                forgingMainTab === 'inlay'
                  ? 'bg-gradient-to-r from-emerald-900/80 to-teal-900/80 text-emerald-100 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-emerald-400" />
              <span>Khảm Ngọc</span>
            </button>
            <button
              onClick={() => setForgingMainTab('reforge')}
              className={`py-2 px-1 rounded-lg text-center cursor-pointer transition font-serif text-xs flex items-center justify-center gap-1.5 font-bold ${
                forgingMainTab === 'reforge'
                  ? 'bg-gradient-to-r from-amber-900/80 to-rose-900/80 text-amber-100 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Tẩy Luyện</span>
            </button>
            <button
              onClick={() => setForgingMainTab('natal')}
              className={`py-2 px-1 rounded-lg text-center cursor-pointer transition font-serif text-xs flex items-center justify-center gap-1.5 font-bold ${
                forgingMainTab === 'natal'
                  ? 'bg-gradient-to-r from-purple-900/80 via-amber-900/80 to-rose-900/80 text-amber-100 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bản Mệnh</span>
              {player.natalArtifact && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setForgingMainTab('dismantle')}
              className={`py-2 px-1 rounded-lg text-center cursor-pointer transition font-serif text-xs flex items-center justify-center gap-1.5 font-bold ${
                forgingMainTab === 'dismantle'
                  ? 'bg-gradient-to-r from-red-950/90 via-orange-950/90 to-amber-950/90 text-orange-200 border border-orange-500/70 shadow-[0_0_15px_rgba(249,115,22,0.35)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Lò Dung Luyện</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: RÈN ĐÚC PHÁP BẢO (TRUYỀN THỐNG)                    */}
          {/* ======================================================== */}
          {forgingMainTab === 'forge' && (
            <div className="space-y-3">
              {/* BÀN NUNG & LÒ RÈN THÁI CỔ (ĐỒ HỌA ÁNH THAN HỒNG) */}
              <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-orange-950/40 via-stone-950 to-stone-950 border border-amber-600/30 space-y-2.5 shadow-[0_0_25px_rgba(249,115,22,0.12)] overflow-hidden">
                {/* Hào quang ánh than hồng lập lòe */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600/30 to-orange-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
                      <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-black text-amber-200">
                          {player.forgingArtisan?.title || 'Sơ Cấp Luyện Khí Sư'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-600/40 text-amber-300 font-mono">
                          Bậc {player.forgingArtisan?.level || 1}/5
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-serif">Lò Rèn Thái Cổ • Chân Hỏa Nung Luyện</span>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-amber-300/90">
                    {player.forgingArtisan?.exp || 0}/{player.forgingArtisan?.maxExp || 100} EXP
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-black/70 overflow-hidden border border-amber-900/40 relative z-10">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    style={{
                      width: `${Math.min(100, Math.floor(((player.forgingArtisan?.exp || 0) / (player.forgingArtisan?.maxExp || 100)) * 100))}%`
                    }}
                  />
                </div>

                {(() => {
                  const promoCheck = checkArtisanPromotionRequirement(player.currentRealm, player.forgingArtisan?.level || 1);
                  const isExpFull = (player.forgingArtisan?.exp || 0) >= (player.forgingArtisan?.maxExp || 100);
                  if (promoCheck.isLockedByRealm && isExpFull) {
                    return (
                      <div className="text-[10.5px] py-1 px-2.5 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300 font-serif text-center flex items-center justify-center gap-1.5 animate-pulse relative z-10">
                        <span>{promoCheck.reason}</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex justify-between text-[10px] text-stone-400 font-mono relative z-10 pt-0.5 border-t border-stone-800/60">
                  <span className="text-emerald-400">
                    +{(ARTISAN_PERKS[player.forgingArtisan?.level || 1] || ARTISAN_PERKS[1]).successBonus}% Cường hóa
                  </span>
                  <span className="text-amber-300">
                    {(ARTISAN_PERKS[player.forgingArtisan?.level || 1] || ARTISAN_PERKS[1]).critChance}% Thiên Công Khai Vật
                  </span>
                  <span className="text-yellow-300">
                    ⚡ {player.forgingArtisan?.criticalCraftCount || 0} Cực Phẩm
                  </span>
                </div>
              </div>

              {/* Thanh Điều Hướng Các Phân Hệ Luyện Khí (Đã căn chỉnh cân đối) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 rounded-xl bg-gradient-to-b from-[#14100c] to-[#0a0806] p-1.5 border border-amber-900/30 text-xs gap-1.5 shadow-inner">
                <button
                  onClick={() => setForgingSubTab('equipped')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif ${
                    forgingSubTab === 'equipped' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Bản Thể
                </button>
                <button
                  onClick={() => setForgingSubTab('forge')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif ${
                    forgingSubTab === 'forge' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Đúc Khí Cổ Truyền
                </button>
                <button
                  onClick={() => setForgingSubTab('modular')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                    forgingSubTab === 'modular'
                      ? 'bg-gradient-to-r from-amber-900/80 to-yellow-900/80 text-amber-200 border border-amber-500/60 font-bold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/20'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>Đoán Cốt Hợp Kim</span>
                </button>
                <button
                  onClick={() => setForgingSubTab('inscription')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                    forgingSubTab === 'inscription'
                      ? 'bg-gradient-to-r from-cyan-900/80 via-teal-900/80 to-emerald-900/80 text-cyan-200 border border-cyan-400/70 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'text-cyan-400/90 hover:text-cyan-300 hover:bg-cyan-950/20'
                  }`}
                >
                  <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Minh Khắc Trận Văn</span>
                </button>
                <button
                  onClick={() => setForgingSubTab('soul_infusion')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                    forgingSubTab === 'soul_infusion'
                      ? 'bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 text-purple-200 border border-purple-400/70 font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'text-purple-400/90 hover:text-purple-300 hover:bg-purple-950/20'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>Phong Hồn Khí Linh</span>
                </button>
                <button
                  onClick={() => setForgingSubTab('legacy_tempering')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                    forgingSubTab === 'legacy_tempering'
                      ? 'bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 text-rose-200 border border-rose-500/70 font-bold shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                      : 'text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/20'
                  }`}
                >
                  <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                  <span>Trùng Chú & Huyết Khế</span>
                </button>
                <button
                  onClick={() => setForgingSubTab('tribulation_array')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                    forgingSubTab === 'tribulation_array'
                      ? 'bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 text-purple-200 border border-purple-500/70 font-bold shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                      : 'text-purple-400/90 hover:text-purple-300 hover:bg-purple-950/20'
                  }`}
                >
                  <Zap className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>Khí Kiếp & Trận Khí</span>
                </button>
                <button
                  onClick={() => setForgingSubTab('ores')}
                  className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition font-serif ${
                    forgingSubTab === 'ores' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Khoáng Phố
                </button>
              </div>

              {/* Sub-tab 1: Pháp bảo đang mặc & Cường hóa */}
              {forgingSubTab === 'equipped' && (
                <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                  {(['weapon', 'armor', 'accessory', 'artifact'] as EquipmentSlot[]).map(slot => {
                    const slotLabels: Record<EquipmentSlot, string> = {
                      weapon: 'Bản Mệnh Phi Kiếm (Vũ Khí)',
                      armor: 'Đạo Bào Tiên Gia (Phòng Ngự)',
                      accessory: 'Hộ Thân Phù (Trang Sức)',
                      artifact: 'Trữ Vật Linh Bảo (Pháp Bảo)'
                    };
                    const eq = player.equipment?.[slot];
                    const enhanceCost = eq ? (eq.enhancement + 1) * 250 : 0;

                    return (
                      <div key={slot} className="p-3 bg-[#0e0e15] rounded-lg border border-cyan-900/20 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400 font-serif">{slotLabels[slot]}</span>
                          {eq && (
                            <span className="text-cyan-300 font-mono font-bold">
                              +{eq.enhancement}
                            </span>
                          )}
                        </div>

                        {eq ? (
                          <div className="space-y-1.5">
                            <div className="font-serif font-bold text-amber-200 text-xs flex items-center justify-between flex-wrap gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span>[{convertGradeToGiai(eq.grade)}] {eq.name}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(eq.quality).badgeClass}`}>
                                  {getItemQuality(eq.quality).name}
                                </span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
                                {convertGradeToGiai(eq.grade)}
                              </span>
                            </div>

                            <div className="text-[10px] font-mono text-zinc-300 flex flex-wrap gap-2">
                              {eq.powerBonus > 0 && <span className="text-amber-400">⚔️ Chiến Lực: +{Math.floor(eq.powerBonus * (1 + eq.enhancement * 0.15)).toLocaleString()}</span>}
                              {eq.hpBonus > 0 && <span className="text-rose-400">❤️ Khí Huyết: +{Math.floor(eq.hpBonus * (1 + eq.enhancement * 0.15)).toLocaleString()}</span>}
                              {eq.mpBonus > 0 && <span className="text-sky-400">💧 Chân Nguyên: +{Math.floor(eq.mpBonus * (1 + eq.enhancement * 0.15)).toLocaleString()}</span>}
                            </div>

                            {/* Tóm tắt Lỗ khảm & Dòng ẩn */}
                            <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 font-mono">
                                💎 Khảm: {(eq.sockets || []).filter(s => s.gem).length}/{(eq.sockets || []).length} ngọc
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-amber-300 font-mono">
                                🔥 Ẩn: {(eq.affixes || []).length} dòng
                              </span>
                              <button
                                onClick={() => {
                                  setForgingSelectedSlot(slot);
                                  setForgingMainTab('inlay');
                                }}
                                className="ml-auto text-[10px] text-cyan-400 hover:text-cyan-200 underline font-serif cursor-pointer"
                              >
                                Tinh luyện Thần Binh →
                              </button>
                            </div>

                            <button
                              onClick={() => handleEnhanceEquip(slot)}
                              disabled={eq.enhancement >= 9 || player.linhThach < enhanceCost}
                              className="w-full mt-1 py-1 rounded bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800 hover:to-blue-800 text-cyan-200 border border-cyan-600/40 text-[10px] font-serif font-bold transition cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
                            >
                              <Hammer className="w-3 h-3 text-cyan-300" />
                              <span>
                                {eq.enhancement >= 9 ? 'Đã Cường Hóa Tối Đa (+9)' : `Tôi Luyện Lên +${eq.enhancement + 1} (${enhanceCost} Linh Thạch)`}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-zinc-500 italic py-1">
                            Chưa trang bị pháp bảo vào ô này. Hãy sang tab "Đúc Khí" để rèn!
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab 2: Đúc trang bị mới (Bản Vẽ Cổ Truyền) */}
              {forgingSubTab === 'forge' && (
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Banner Điều Hướng Nhanh Sang Đoán Cốt Hợp Kim & Minh Khắc Trận Văn */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      onClick={() => setForgingSubTab('modular')}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-stone-900/90 to-amber-950/50 border border-amber-500/50 hover:border-amber-400 flex items-center justify-between cursor-pointer transition shadow-md group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition" />
                        </div>
                        <div>
                          <div className="text-[11.5px] font-serif font-bold text-amber-200 flex items-center gap-1">
                            <span>Đoán Cốt Hợp Kim</span>
                            <span className="text-[8.5px] px-1 py-0.2 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/60 font-mono font-bold animate-pulse">
                              HOT
                            </span>
                          </div>
                          <p className="text-[9.5px] text-stone-300 font-serif">
                            Phối trộn 5 ngũ hành khoáng thạch
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition shrink-0" />
                    </div>

                    <div
                      onClick={() => setForgingSubTab('inscription')}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-stone-900/90 to-cyan-950/50 border border-cyan-500/50 hover:border-cyan-400 flex items-center justify-between cursor-pointer transition shadow-md group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                          <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
                        </div>
                        <div>
                          <div className="text-[11.5px] font-serif font-bold text-cyan-200 flex items-center gap-1">
                            <span>Minh Khắc Trận Văn</span>
                            <span className="text-[8.5px] px-1 py-0.2 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-500/60 font-mono font-bold">
                              TRẬN
                            </span>
                          </div>
                          <p className="text-[9.5px] text-stone-300 font-serif">
                            Khảm khắc 12 đại trận pháp cổ đại
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition shrink-0" />
                    </div>
                  </div>

                  {/* Thanh điều khiển chuỗi cung ứng tự động */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#141210] to-[#0d0c0a] border border-amber-900/40 text-xs shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                        player.craftingSupplySettings?.autoBuyMissing
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-stone-900 border-stone-800 text-stone-500'
                      }`}>
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <div>
                        <div className="text-amber-200 font-serif font-bold text-xs flex items-center gap-2">
                          <span>Tự Động Mua Thiếu Bằng Linh Thạch</span>
                          {player.craftingSupplySettings?.autoBuyMissing ? (
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/70 text-emerald-300 border border-emerald-600/50 rounded font-mono font-bold">
                              ✓ Đang Bật
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 bg-stone-900 text-stone-400 border border-stone-800 rounded font-mono">
                              ✕ Đang Tắt
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Tự tính toán và bù đắp khoáng thạch thiếu từ Thương Hội khi nhấn Rèn Đúc
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                      <input
                        type="checkbox"
                        checked={Boolean(player.craftingSupplySettings?.autoBuyMissing)}
                        onChange={(e) => handleToggleAutoBuySupply?.(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  {/* Danh Mục Bản Vẽ Rèn Đúc Trang Bị */}
                  {EQUIP_RECIPES.map(recipe => {
                    const craftReq = checkArtisanCraftRequirement(player.currentRealm, recipe.grade);
                    const isGradeAllowed = (ARTISAN_PERKS[player.forgingArtisan?.level || 1] || ARTISAN_PERKS[1]).allowedGrades.includes(recipe.grade);
                    const inv = player.inventory || { pills: [], herbs: [], ores: [] };
                    const canForge =
                      !craftReq.isLockedByRealm &&
                      isGradeAllowed &&
                      player.linhThach >= recipe.linhThachCost &&
                      recipe.oresRequired.every(r => (inv.ores.find(o => o.id === r.oreId)?.quantity || 0) >= r.count);

                    const supply = assessForgeRecipeSupply(player, recipe, 1);
                    const isAutoBuyEnabled = Boolean(player.craftingSupplySettings?.autoBuyMissing);
                    const isAutoBuyReady = isAutoBuyEnabled && supply.canExecuteAutoPurchase;
                    const canInitiateForge = (canForge || isAutoBuyReady) && !craftReq.isLockedByRealm && isGradeAllowed;

                    return (
                      <div key={recipe.id} className="p-3.5 bg-gradient-to-b from-[#14110e] to-[#0a0907] rounded-xl border border-amber-900/30 hover:border-amber-700/50 transition shadow-md space-y-2.5">
                        {/* Tiêu đề bản vẽ và Badge Phẩm Cấp ở góc */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5">
                            <div className="font-serif font-bold text-amber-100 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                              <Hammer className="w-3.5 h-3.5 text-amber-400" />
                              <span>{recipe.name}</span>
                              {recipe.storageCapacity && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 rounded font-mono">
                                  🎒 Sức chứa: {recipe.storageCapacity === 9999 ? 'VÔ HẠN' : recipe.storageCapacity} ô
                                </span>
                              )}
                              {craftReq.isLockedByRealm && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-red-950/60 text-red-300 border border-red-800/60 rounded font-mono flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 text-red-400" />
                                  <span>🔒 Cần đạt [{craftReq.requiredRealmName}]</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-400 leading-relaxed line-clamp-2">{recipe.description}</p>
                          </div>

                          {/* Badge Phẩm Cấp ở góc thẻ bài */}
                          <div className="shrink-0 flex flex-col items-end gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-serif font-bold bg-amber-950/70 text-amber-300 border border-amber-600/60 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                              {convertGradeToGiai(recipe.grade)}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-stone-900 text-stone-400 border border-stone-800">
                              {recipe.slot === 'weapon' ? '⚔️ Vũ Khí' : recipe.slot === 'armor' ? '🛡️ Hộ Giáp' : recipe.slot === 'boots' ? '👟 Hài Ngoa' : '📿 Trang Sức'}
                            </span>
                          </div>
                        </div>

                        {/* Thanh Tiến Trình Khoáng Thạch Trực Quan */}
                        <div className="p-2.5 rounded-lg bg-black/50 border border-stone-800/70 space-y-2">
                          <div className="text-[10px] font-serif text-stone-400 flex items-center justify-between">
                            <span>Khoáng thạch tôi luyện:</span>
                            <span className={player.linhThach >= recipe.linhThachCost ? 'text-amber-300 font-mono font-bold' : 'text-rose-400 font-mono font-bold'}>
                              Chi phí: {recipe.linhThachCost.toLocaleString()} Linh Thạch
                            </span>
                          </div>

                          {/* Danh sách thanh bar tiến trình khoáng thạch */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recipe.oresRequired.map(r => {
                              const owned = inv.ores.find(o => o.id === r.oreId)?.quantity || 0;
                              const isEnough = owned >= r.count;
                              const percent = Math.min(100, Math.round((owned / r.count) * 100));

                              return (
                                <div key={r.oreId} className="p-1.5 rounded bg-stone-950/80 border border-stone-800/80 space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-stone-300 font-medium truncate max-w-[120px]">{r.oreName}</span>
                                    <span className={`font-bold ${isEnough ? 'text-emerald-400' : 'text-amber-400'}`}>
                                      {owned}/{r.count} {isEnough ? '✓' : `(Thiếu ${r.count - owned})`}
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden border border-stone-800/60">
                                    <div
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        isEnough
                                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                          : 'bg-gradient-to-r from-rose-500 to-amber-500'
                                      }`}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Widget Thiếu Hụt Nguyên Liệu (Missing Materials Warning) */}
                        {!supply.isFullySupplied && (
                          <div className="space-y-1.5 p-2 rounded-lg bg-amber-950/20 border border-amber-900/30">
                            <div className="text-[10px] text-amber-300 font-medium flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                                <span>Khoáng thạch còn thiếu:</span>
                              </span>
                              {supply.totalCostLinhThach > 0 && (
                                <span className="font-mono text-[10px] text-stone-400">
                                  Cần chi: <strong className="text-amber-300">{supply.totalCostLinhThach.toLocaleString()}</strong> LT
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {supply.missingItems.map(item => (
                                <div
                                  key={item.id}
                                  className={`text-[9px] px-2 py-0.5 rounded border font-mono flex items-center gap-1.5 ${
                                    item.canPurchaseAtCurrentRealm
                                      ? 'bg-amber-950/40 border-amber-700/50 text-amber-200'
                                      : 'bg-rose-950/50 border-rose-800/60 text-rose-300'
                                  }`}
                                >
                                  <span>{item.name}: Thiếu <strong>{item.missingQty}x</strong></span>
                                  {item.canPurchaseAtCurrentRealm ? (
                                    <span className="text-amber-300/90">• {item.totalPrice.toLocaleString()} LT</span>
                                  ) : (
                                    <span className="text-rose-400 font-semibold">• 🔒 Cần đạt [{item.requiredRealmName}]</span>
                                  )}
                                </div>
                              ))}
                            </div>

                            {supply.hasUnmetRealmGating && (
                              <div className="text-[10px] text-rose-400 bg-rose-950/40 p-1.5 rounded border border-rose-900/40 flex items-center gap-1 font-mono">
                                <Lock className="w-3 h-3 text-rose-400 shrink-0" />
                                <span>🔒 Cần đạt cảnh giới cao hơn để mua tại Thương Hội</span>
                              </div>
                            )}

                            {supply.canExecuteAutoPurchase && (
                              <button
                                type="button"
                                onClick={() => handleBuyMissingMaterials?.(supply)}
                                className="w-full py-1 px-2 rounded-lg bg-gradient-to-r from-amber-700/80 to-orange-700/80 hover:from-amber-600 hover:to-orange-600 border border-amber-500/50 text-amber-100 font-serif text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                              >
                                <Zap className="w-3 h-3 text-amber-300" />
                                <span>⚡ Mua Đủ Thiếu Hụt ({supply.totalCostLinhThach.toLocaleString()} Linh Thạch)</span>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Nút Rèn Đúc Trang Bị Chuẩn Hóa */}
                        <button
                          onClick={() => handleForgeEquip(recipe)}
                          disabled={!canInitiateForge || isForging}
                          className={`w-full py-2 px-3 rounded-lg font-serif font-bold text-xs transition duration-200 flex items-center justify-center gap-2 ${
                            craftReq.isLockedByRealm
                              ? 'bg-stone-950 border border-red-900/50 text-red-400/80 cursor-not-allowed'
                              : isForging
                              ? 'bg-amber-950/40 border border-amber-600/50 text-amber-400 cursor-wait animate-pulse'
                              : canInitiateForge
                              ? 'bg-amber-600/20 border border-amber-500 text-amber-300 hover:bg-amber-600/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer hover:scale-[1.01] active:scale-98'
                              : 'bg-stone-900 border border-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          {isForging ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                              <span>⏳ Đang Tôi Luyện...</span>
                            </>
                          ) : craftReq.isLockedByRealm ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-red-400" />
                              <span>🔒 Cần đạt [{craftReq.requiredRealmName}]</span>
                            </>
                          ) : !isGradeAllowed ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-stone-500" />
                              <span>Cần Cấp Thợ Rèn Cao Hơn</span>
                            </>
                          ) : isAutoBuyReady && !canForge ? (
                            <>
                              <Zap className="w-3.5 h-3.5 text-amber-300" />
                              <span>🔨 Rèn Đúc Trang Bị (⚡ Tự Mua: +{supply.totalCostLinhThach.toLocaleString()} LT)</span>
                            </>
                          ) : (
                            <>
                              <Hammer className={`w-3.5 h-3.5 ${canForge ? 'text-amber-400' : 'text-stone-600'}`} />
                              <span>🔨 Rèn Đúc Trang Bị</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-tab 2.5: Đoán Cốt Hợp Kim */}
              {forgingSubTab === 'modular' && (
                <div className="space-y-3">
                  <ModularMetallurgySection
                    player={player}
                    setPlayer={setPlayer}
                    showToast={showToast}
                    addLog={addLog}
                  />
                </div>
              )}

              {/* Sub-tab 2.6: Minh Khắc Trận Văn */}
              {forgingSubTab === 'inscription' && (
                <div className="space-y-3">
                  <FormationInscriptionSection
                    player={player}
                    setPlayer={setPlayer}
                    showToast={showToast}
                    addLog={addLog}
                  />
                </div>
              )}

              {/* Sub-tab 2.7: Phong Hồn Đoạt Phách & Khí Linh */}
              {forgingSubTab === 'soul_infusion' && (
                <div className="space-y-3">
                  <SoulInfusionSection
                    player={player}
                    setPlayer={setPlayer}
                    showToast={showToast}
                    addLog={addLog}
                  />
                </div>
              )}

              {/* Sub-tab 2.8: Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh */}
              {forgingSubTab === 'legacy_tempering' && (
                <div className="space-y-3">
                  <LegacyTemperingSection
                    player={player as any}
                    setPlayer={setPlayer as any}
                    showToast={showToast}
                    addLog={addLog}
                  />
                </div>
              )}

              {/* Sub-tab 2.9: Khí Kiếp & Trận Khí Tùy Thân */}
              {forgingSubTab === 'tribulation_array' && (
                <div className="space-y-3">
                  <WeaponTribulationArraySection
                    player={player as any}
                    setPlayer={setPlayer as any}
                    showToast={showToast}
                    addLog={addLog}
                  />
                </div>
              )}

              {/* Sub-tab 3: Khoáng Phố */}
              {forgingSubTab === 'ores' && (
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {DEFAULT_ORES.map(ore => {
                    const owned = (player.inventory?.ores || []).find(o => o.id === ore.id)?.quantity || 0;
                    return (
                      <div key={ore.id} className="p-2.5 bg-[#0e0e15] rounded-lg border border-cyan-900/20 flex justify-between items-center gap-2">
                        <div>
                          <div className="font-serif font-bold text-amber-200 text-xs">
                            [{convertGradeToGiai(ore.grade)}] {ore.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Giá: <span className="text-amber-300 font-bold">{ore.price}</span> Linh thạch | Đang có: <span className="text-emerald-400">{owned}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyOre(ore)}
                          disabled={player.linhThach < ore.price}
                          className="px-2.5 py-1.5 rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/40 text-[11px] font-serif transition cursor-pointer shrink-0 disabled:opacity-40"
                        >
                          Mua 1 Khối
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ĐỤC LỖ & KHẢM NGỌC (SOCKET & INLAY ALTAR)           */}
          {/* ======================================================== */}
          {forgingMainTab === 'inlay' && (
            <div className="space-y-3">
              {/* Chọn 1 trong 4 trang bị đang mặc */}
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-black/40 border border-cyan-900/30">
                {EQUIPMENT_SLOTS_CONFIG.map(({ slot, name, icon }) => {
                  const eq = player.equipment?.[slot];
                  const isSelected = forgingSelectedSlot === slot;
                  const gemCount = (eq?.sockets || []).filter(s => s.gem).length;
                  const maxS = eq?.maxSockets || 1;

                  return (
                    <button
                      key={slot}
                      onClick={() => {
                        setForgingSelectedSlot(slot);
                        setSelectedSocketIndex(null);
                      }}
                      className={`p-1.5 rounded text-center transition cursor-pointer flex flex-col items-center gap-0.5 border ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                          : 'bg-black/30 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-sm">{icon}</span>
                      <span className="text-[10px] font-serif font-bold truncate max-w-full">
                        {eq ? eq.name.replace(/\[.*?\]/, '').trim() : name}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {eq ? `💎 ${gemCount}/${maxS}` : 'Trống'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedEquip ? (
                <div className="space-y-3">
                  {/* Đài tế Thần Binh Trung Tâm */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#0c1815] to-[#070d0d] border border-emerald-900/40 relative overflow-hidden shadow-lg">
                    <div className="flex justify-between items-center mb-2.5">
                      <div>
                        <div className="font-serif font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                          <span>[{convertGradeToGiai(selectedEquip.grade)}] {selectedEquip.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(selectedEquip.quality).badgeClass}`}>
                            {getItemQuality(selectedEquip.quality).name}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Tối đa <span className="text-emerald-400 font-bold">{selectedEquip.maxSockets || 1}</span> lỗ linh ngọc cho phẩm giai này
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
                          +{selectedEquip.enhancement} Tôi Luyện
                        </span>
                      </div>
                    </div>

                    {/* Danh sách 1 - 4 Ô Khảm Ngọc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.from({ length: selectedEquip.maxSockets || 1 }).map((_, idx) => {
                        const socket = (selectedEquip.sockets || [])[idx] as EquipmentSocket | undefined;
                        const isUnlocked = socket?.unlocked;
                        const gem = socket?.gem;
                        const costConfig = SOCKET_PUNCH_COSTS[idx] || SOCKET_PUNCH_COSTS[0];
                        const ownedOre = costConfig.oreId
                          ? (player.inventory?.ores || []).find(o => o.id === costConfig.oreId)?.quantity || 0
                          : 999;
                        const canPunch = !isUnlocked &&
                          player.linhThach >= costConfig.linhThach &&
                          (!costConfig.oreId || ownedOre >= (costConfig.oreCount || 0)) &&
                          (idx === 0 || (selectedEquip.sockets || [])[idx - 1]?.unlocked);

                        const isTarget = selectedSocketIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isUnlocked && !gem) {
                                setSelectedSocketIndex(idx);
                              }
                            }}
                            className={`p-2.5 rounded-lg border transition relative ${
                              !isUnlocked
                                ? 'bg-black/40 border-dashed border-zinc-800 text-zinc-500'
                                : gem
                                ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-emerald-600/50 text-emerald-200'
                                : isTarget
                                ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                                : 'bg-black/30 border-dashed border-cyan-800/60 hover:border-cyan-500/60 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[10px] font-serif font-bold text-zinc-400">
                                Lỗ #{idx + 1}
                              </span>

                              {/* Trạng thái 1: Chưa đục lỗ */}
                              {!isUnlocked && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePunchSocket(forgingSelectedSlot);
                                  }}
                                  disabled={!canPunch}
                                  className="px-2 py-0.5 rounded bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-600/50 text-[10px] font-serif transition cursor-pointer flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <Hammer className="w-2.5 h-2.5" />
                                  <span>Đục Lỗ</span>
                                </button>
                              )}

                              {/* Trạng thái 2: Đã khảm ngọc -> Tháo */}
                              {isUnlocked && gem && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveGem(forgingSelectedSlot, idx);
                                  }}
                                  className="px-2 py-0.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 text-[9px] font-serif transition cursor-pointer"
                                >
                                  Tháo Ngọc
                                </button>
                              )}

                              {/* Trạng thái 3: Ô trống đang được chọn */}
                              {isUnlocked && !gem && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-mono animate-pulse">
                                  {isTarget ? 'Đang chọn khảm' : 'Trống'}
                                </span>
                              )}
                            </div>

                            {/* Chi tiết nội dung ô */}
                            {!isUnlocked ? (
                              <div className="mt-1 text-[9px] font-mono text-zinc-500 space-y-0.5">
                                <div>Phí: {costConfig.linhThach.toLocaleString()} Linh Thạch</div>
                                {costConfig.oreName && (
                                  <div>+ {costConfig.oreCount} {costConfig.oreName} ({ownedOre}/{costConfig.oreCount})</div>
                                )}
                              </div>
                            ) : gem ? (
                              <div className="mt-1 space-y-1">
                                <div className="font-serif font-bold text-xs flex items-center gap-1.5">
                                  <span className="text-base">{GEM_TYPE_CONFIGS[gem.gemType]?.icon || '💎'}</span>
                                  <span className="text-emerald-300">{gem.name}</span>
                                </div>
                                <div className="text-[9px] font-mono text-emerald-400/90 leading-tight">
                                  {gem.description}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-1 text-[10px] text-zinc-400 italic">
                                Ô đục sẵn. Chọn ngọc ở kho bên dưới để khảm nạp.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kho Linh Ngọc Trong Túi Trữ Vật */}
                  <div className="p-3 rounded-xl bg-[#0c1015] border border-cyan-900/30 space-y-2.5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <Gem className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-serif font-bold text-cyan-200">
                          Kho Linh Ngọc Trong Túi ({availableGems.reduce((sum, g) => sum + g.quantity, 0)} viên)
                        </span>
                      </div>

                      {/* Bộ lọc Ngũ Hành */}
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setGemElementFilter('all')}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-serif transition cursor-pointer ${
                            gemElementFilter === 'all'
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'bg-black/40 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Tất Cả
                        </button>
                        {(['kim', 'mộc', 'thủy', 'hỏa', 'thổ', 'lôi', 'phong'] as GemType[]).map(el => (
                          <button
                            key={el}
                            onClick={() => setGemElementFilter(el)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-serif transition cursor-pointer ${
                              gemElementFilter === el
                                ? 'bg-cyan-600 text-white font-bold'
                                : 'bg-black/40 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {GEM_TYPE_CONFIGS[el].icon} {GEM_TYPE_CONFIGS[el].elementLabel}
                          </button>
                        ))}
                      </div>
                    </div>

                    {availableGems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                        {availableGems.map(gem => {
                          const cfg = GEM_TYPE_CONFIGS[gem.gemType];
                          // Tìm ô trống đầu tiên hoặc ô được chọn
                          const sockets = selectedEquip.sockets || [];
                          const targetSlotIndex = selectedSocketIndex !== null && sockets[selectedSocketIndex]?.unlocked && !sockets[selectedSocketIndex]?.gem
                            ? selectedSocketIndex
                            : sockets.findIndex(s => s.unlocked && !s.gem);

                          const canInlayThisGem = targetSlotIndex !== -1;

                          return (
                            <div
                              key={gem.id}
                              className="p-2 rounded-lg bg-black/40 border border-zinc-800 hover:border-cyan-700/50 transition flex justify-between items-center gap-2"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-serif font-bold text-xs flex items-center gap-1.5 truncate">
                                  <span>{cfg.icon}</span>
                                  <span className="text-zinc-200 truncate">{gem.name}</span>
                                  <span className="text-[9px] px-1 rounded bg-zinc-800 text-cyan-300 font-mono shrink-0">
                                    x{gem.quantity}
                                  </span>
                                </div>
                                <p className="text-[9px] text-zinc-400 font-mono truncate">
                                  {gem.description}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  if (canInlayThisGem) {
                                    handleInlayGem(forgingSelectedSlot, targetSlotIndex, gem.id);
                                    setSelectedSocketIndex(null);
                                  }
                                }}
                                disabled={!canInlayThisGem}
                                className={`px-2.5 py-1 rounded text-[10px] font-serif font-bold shrink-0 transition cursor-pointer ${
                                  canInlayThisGem
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                }`}
                              >
                                Khảm ({targetSlotIndex !== -1 ? `#${targetSlotIndex + 1}` : 'Hết Ô'})
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-black/30 border border-dashed border-zinc-800 text-center space-y-1">
                        <p className="text-xs text-zinc-400 font-serif">
                          Không có Linh Ngọc phù hợp trong Túi Trữ Vật
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Có thể nhặt được ngọc khi đánh Boss Bí Cảnh, leo Trấn Ma Tháp hoặc mua tại Vạn Bảo Thương Hội.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-xs italic">
                  Chưa trang bị pháp bảo vào vị trí này. Hãy qua tab "Rèn Đúc" để đúc hoặc trang bị pháp bảo!
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: TẨY LUYỆN THẦN BINH (REFORGE & AFFIX LOCKING)       */}
          {/* ======================================================== */}
          {forgingMainTab === 'reforge' && (
            <div className="space-y-3">
              {/* Chọn 1 trong 4 trang bị đang mặc */}
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-lg bg-black/40 border border-cyan-900/30">
                {EQUIPMENT_SLOTS_CONFIG.map(({ slot, name, icon }) => {
                  const eq = player.equipment?.[slot];
                  const isSelected = forgingSelectedSlot === slot;
                  const affixesCount = (eq?.affixes || []).length;

                  return (
                    <button
                      key={slot}
                      onClick={() => setForgingSelectedSlot(slot)}
                      className={`p-1.5 rounded text-center transition cursor-pointer flex flex-col items-center gap-0.5 border ${
                        isSelected
                          ? 'bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                          : 'bg-black/30 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-sm">{icon}</span>
                      <span className="text-[10px] font-serif font-bold truncate max-w-full">
                        {eq ? eq.name.replace(/\[.*?\]/, '').trim() : name}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {eq ? `🔥 ${affixesCount} Dòng` : 'Trống'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedEquip ? (
                <div className="space-y-3">
                  {/* Bàn Tẩy Luyện Cổ Phong */}
                  <div
                    className={`p-3.5 rounded-xl bg-gradient-to-b from-[#18110b] to-[#0d0905] border border-amber-900/50 space-y-3 relative overflow-hidden transition-all duration-300 shadow-xl ${
                      reforgeFlash ? 'ring-2 ring-amber-400 scale-[1.01]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-serif font-bold text-amber-200 text-xs flex items-center gap-1.5 flex-wrap">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>[{convertGradeToGiai(selectedEquip.grade)}] {selectedEquip.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${getItemQuality(selectedEquip.quality).badgeClass}`}>
                            {getItemQuality(selectedEquip.quality).name}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Sở hữu <span className="text-amber-300 font-bold">{(selectedEquip.affixes || []).length}</span> dòng thuộc tính ẩn cổ xưa
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700/50 text-amber-300">
                          {lockedAffixesCount} dòng bị khóa
                        </span>
                      </div>
                    </div>

                    {/* Danh sách các dòng Affixes */}
                    <div className="space-y-2">
                      {(selectedEquip.affixes || []).length > 0 ? (
                        (selectedEquip.affixes || []).map((affix: EquipmentAffix) => {
                          const rCfg = AFFIX_RARITY_CONFIGS[affix.rarity] || AFFIX_RARITY_CONFIGS.luc;

                          return (
                            <div
                              key={affix.id}
                              className={`p-2.5 rounded-lg border flex justify-between items-center gap-2 transition ${
                                affix.rarity === 'than'
                                  ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                                  : affix.rarity === 'kim'
                                  ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                                  : affix.rarity === 'tim'
                                  ? 'bg-purple-950/30 border-purple-500/40'
                                  : affix.rarity === 'lam'
                                  ? 'bg-sky-950/30 border-sky-500/40'
                                  : 'bg-emerald-950/20 border-emerald-500/30'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold border ${rCfg.borderClass} ${rCfg.colorClass} ${rCfg.bgClass}`}>
                                    {rCfg.label}
                                  </span>
                                  <span className={`font-serif font-bold text-xs ${rCfg.colorClass}`}>
                                    {affix.name}
                                  </span>
                                </div>
                                <div className="text-[11px] font-mono font-bold text-zinc-100 pl-1">
                                  +{affix.value}% {
                                    affix.statKey === 'hutMauRate' ? 'Hút Máu' :
                                    affix.statKey === 'xuyenGiapRate' ? 'Xuyên Giáp' :
                                    affix.statKey === 'phanDmgRate' ? 'Phản Sát Thương' :
                                    affix.statKey === 'baoKichDmg' ? 'Sát Thương Bạo Kích' :
                                    affix.statKey === 'congKichPercent' ? 'Công Kích' :
                                    affix.statKey === 'phongNguPercent' ? 'Phòng Ngự' :
                                    affix.statKey === 'tuViSpeedPercent' ? 'Tốc Độ Tu Vi' : 'Chỉ Số Đặc Biệt'
                                  }
                                </div>
                              </div>

                              {/* Nút Khóa / Mở Khóa */}
                              <button
                                onClick={() => handleToggleLockAffix(forgingSelectedSlot, affix.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-serif font-bold flex items-center gap-1 transition cursor-pointer border ${
                                  affix.isLocked
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                    : 'bg-black/40 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                                }`}
                              >
                                {affix.isLocked ? (
                                  <>
                                    <Lock className="w-3 h-3 text-amber-400" />
                                    <span>Đã Khóa</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-3 h-3 text-zinc-500" />
                                    <span>Mở Khóa</span>
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 rounded-lg bg-black/40 border border-dashed border-zinc-800 text-center text-zinc-400 text-xs font-serif">
                          Trang bị này chưa có dòng ẩn. Khi tẩy luyện lần đầu sẽ khai mở các dòng thuộc tính ẩn!
                        </div>
                      )}
                    </div>

                    {/* CHUYỂN ĐỔI CHẾ ĐỘ TẨY LUYỆN: LINH THẠCH VS TINH HOA */}
                    <div className="flex rounded-lg bg-black/60 p-1 border border-zinc-800 gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleEssenceReforge?.(false)}
                        className={`flex-1 py-1.5 px-2 rounded-md font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          !useEssenceReforge
                            ? 'bg-amber-950/70 text-amber-300 border border-amber-600/50 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span>💰 Linh Thạch Thường</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleEssenceReforge?.(true)}
                        className={`flex-1 py-1.5 px-2 rounded-md font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          useEssenceReforge
                            ? 'bg-gradient-to-r from-orange-950/80 to-red-950/80 text-orange-300 border border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.3)]'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span>🔥 Tinh Hoa Thần Luyện</span>
                      </button>
                    </div>

                    {/* ĐẶC QUYỀN TINH HOA BANNER */}
                    {useEssenceReforge && (
                      <div className="p-2.5 rounded-lg bg-gradient-to-r from-orange-950/40 to-amber-950/30 border border-orange-500/40 text-[11px] font-serif text-amber-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-orange-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Đặc Quyền Tinh Hoa Thần Luyện</span>
                        </div>
                        <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                          ✨ Bảo lưu 100% dòng khóa • Miễn phí 100% Linh Thạch & Huyền Thiết • Đảm bảo xuất hiện ít nhất 1 dòng thuộc tính đạt Cực Phẩm (Tím) hoặc Hoàng Kim/Thần Phẩm!
                        </p>
                      </div>
                    )}

                    {/* Bảng Chi Phí Tẩy Luyện */}
                    {useEssenceReforge ? (
                      <div className="p-2.5 rounded-lg bg-black/60 border border-orange-900/40 text-[10px] font-mono space-y-1">
                        <div className="flex justify-between items-center text-zinc-300">
                          <span>Chi phí Tinh Hoa cơ bản:</span>
                          <span className="text-orange-300">{selectedEquip ? calculateEssenceReforgeCost(selectedEquip, 0).toLocaleString() : 0} Tinh Hoa</span>
                        </div>
                        {lockedAffixesCount > 0 && (
                          <div className="flex justify-between items-center text-zinc-300">
                            <span>Phí giữ {lockedAffixesCount} dòng khóa:</span>
                            <span className="text-orange-300">+{((selectedEquip ? calculateEssenceReforgeCost(selectedEquip, lockedAffixesCount) - calculateEssenceReforgeCost(selectedEquip, 0) : 0)).toLocaleString()} Tinh Hoa</span>
                          </div>
                        )}
                        <div className="border-t border-zinc-800/80 pt-1 flex justify-between items-center font-bold">
                          <span className="text-zinc-400">Tổng Tinh Hoa Tiêu Hao:</span>
                          <span className={playerEssence >= essenceReforgeCost ? 'text-orange-400' : 'text-red-400'}>
                            {playerEssence.toLocaleString()} / {essenceReforgeCost.toLocaleString()} Tinh Hoa
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-[10px] font-mono space-y-1">
                        <div className="flex justify-between items-center text-zinc-300">
                          <span>Chi phí cơ bản:</span>
                          <span className="text-amber-300">{REFORGE_COSTS.baseLinhThach.toLocaleString()} Linh Thạch</span>
                        </div>
                        {lockedAffixesCount > 0 && (
                          <>
                            <div className="flex justify-between items-center text-zinc-300">
                              <span>Phí giữ {lockedAffixesCount} dòng khóa:</span>
                              <span className="text-amber-300">+{(lockedAffixesCount * REFORGE_COSTS.perLockedAffixLinhThach).toLocaleString()} Linh Thạch</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-300">
                              <span>Khoáng thạch khóa dòng:</span>
                              <span className={ownedHuyenThiet >= reforgeOreCost ? 'text-emerald-400' : 'text-red-400'}>
                                {ownedHuyenThiet}/{reforgeOreCost} {REFORGE_COSTS.requiredOreName}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="border-t border-zinc-800/80 pt-1 flex justify-between items-center font-bold">
                          <span className="text-zinc-400">Tổng Linh Thạch:</span>
                          <span className={player.linhThach >= reforgeLinhThachCost ? 'text-amber-400' : 'text-red-400'}>
                            {player.linhThach.toLocaleString()}/{reforgeLinhThachCost.toLocaleString()} Linh Thạch
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Nút Bấm Lớn: 🔥 TẨY LUYỆN THẦN THUỘC */}
                    <button
                      onClick={onReforgeClick}
                      disabled={!canReforge}
                      className={`w-full py-2.5 rounded-lg font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                        canReforge
                          ? useEssenceReforge
                            ? 'bg-gradient-to-r from-orange-600 via-red-600 to-rose-700 hover:brightness-110 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                            : 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 hover:brightness-110 text-white shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
                      <span>
                        {useEssenceReforge
                          ? `🔥 TINH HOA TẨY LUYỆN (Tiêu hao ${essenceReforgeCost} Tinh Hoa)`
                          : '🔥 TẨY LUYỆN THẦN THUỘC'}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    </button>
                  </div>

                  {/* Hướng dẫn Tẩy Luyện */}
                  <div className="p-3 rounded-lg bg-black/30 border border-amber-950/40 text-[10px] text-zinc-400 space-y-1">
                    <div className="font-semibold text-amber-300/90 font-serif flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-400" />
                      <span>Quy Tắc Tẩy Luyện Thần Thuộc:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-zinc-500">
                      <li>Các dòng có icon <span className="text-amber-300">Đã Khóa</span> sẽ được giữ nguyên 100% thuộc tính và phẩm cấp.</li>
                      <li>Các dòng chưa khóa sẽ được tôi luyện lại ngẫu nhiên từ Lục Phẩm (50%) đến Hồng Hoang Thần Phẩm (1%).</li>
                      <li>Khóa càng nhiều dòng, lượng Linh Thạch và Huyền Thiết Khoáng tiêu hao càng tăng.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-xs italic">
                  Chưa trang bị pháp bảo vào vị trí này. Hãy qua tab "Rèn Đúc" để đúc hoặc trang bị pháp bảo!
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BẢN MỆNH PHÁP BẢO & KHÍ LINH                        */}
          {/* ======================================================== */}
          {forgingMainTab === 'natal' && setPlayer && addLog && showToast && (
            <NatalArtifactView
              player={player}
              setPlayer={setPlayer}
              addLog={addLog}
              showToast={showToast}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 5: LÒ DUNG LUYỆN • PHÂN GIẢI & TÁI CHẾ TRANG BỊ       */}
          {/* ======================================================== */}
          {forgingMainTab === 'dismantle' && (() => {
            const allInvEquips: Equipment[] = ((player.inventory?.equipments || player.inventory?.equipment || []) as Equipment[]).filter(Boolean);

            const filteredDismantleEquips = allInvEquips.filter(eq => {
              if (dismantleSlotFilter !== 'all' && eq.slot !== dismantleSlotFilter) return false;
              if (dismantleTierFilter !== 'all') {
                const itemTier = getEquipmentTier(eq);
                if (dismantleTierFilter === 5) {
                  if (itemTier < 5) return false;
                } else if (itemTier !== dismantleTierFilter) {
                  return false;
                }
              }
              return true;
            });

            // Dự toán thu hồi thời gian thực
            const selectedEquipItems = allInvEquips.filter(eq => selectedDismantleIds.includes(eq.id));
            let previewTotalEssence = 0;
            let previewTotalLinhThach = 0;
            const previewRecoveredGems: GemItem[] = [];
            const previewOreMap: Record<string, { oreId: string; oreName: string; oreQuantity: number; tier: number }> = {};

            for (const eq of selectedEquipItems) {
              const check = canDismantleEquipment(eq, player);
              if (!check.canDismantle) continue;
              const rew = calculateDismantleReward(eq);
              previewTotalEssence += rew.forgingEssence;
              previewTotalLinhThach += rew.linhThachRefund;
              previewRecoveredGems.push(...rew.recoveredGems);

              const eqTier = getEquipmentTier(eq);
              if (!previewOreMap[rew.oreId]) {
                previewOreMap[rew.oreId] = {
                  oreId: rew.oreId,
                  oreName: rew.oreName,
                  oreQuantity: rew.oreQuantity,
                  tier: eqTier
                };
              } else {
                previewOreMap[rew.oreId].oreQuantity += rew.oreQuantity;
              }
            }
            const previewOres = Object.values(previewOreMap);

            return (
              <div className="space-y-3">
                {/* 1. THANH CÔNG CỤ LỌC NHANH (TOP QUICK BAR) */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-950/30 via-[#120e0c] to-amber-950/20 border border-orange-900/40 shadow-md space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Các nút chọn nhanh */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-zinc-400 font-serif mr-1 flex items-center gap-1 font-semibold">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Lọc Nhanh:
                      </span>
                      <button
                        onClick={() => handleSelectAllByGrade?.(['ha_pham'])}
                        className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 text-[11px] font-serif transition cursor-pointer hover:border-amber-500/50 flex items-center gap-1"
                        title="Chọn tất cả trang bị Hạ Phẩm"
                      >
                        <span>⚡ Hạ Phẩm</span>
                      </button>
                      <button
                        onClick={() => handleSelectAllByGrade?.(['trung_pham'])}
                        className="px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-[11px] font-serif transition cursor-pointer hover:border-emerald-500/60 flex items-center gap-1"
                        title="Chọn tất cả trang bị Trung Phẩm"
                      >
                        <span>⚡ Trung Phẩm</span>
                      </button>
                      <button
                        onClick={() => handleSelectAllByGrade?.(['ha_pham', 'trung_pham'])}
                        className="px-2.5 py-1 rounded bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 text-[11px] font-serif transition cursor-pointer hover:border-amber-500/60 flex items-center gap-1"
                        title="Chọn tất cả trang bị Hạ Phẩm và Trung Phẩm"
                      >
                        <span>⚡ Hạ & Trung Phẩm</span>
                      </button>
                      {selectedDismantleIds.length > 0 && (
                        <button
                          onClick={() => handleClearDismantleSelection?.()}
                          className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/70 text-red-300 border border-red-800/50 text-[11px] font-serif transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span>Hủy Chọn ({selectedDismantleIds.length})</span>
                        </button>
                      )}
                    </div>

                    {/* Badge Tinh Hoa Rèn Đúc hiện có */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-950/60 border border-orange-700/50 text-xs shadow-inner">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span className="text-zinc-400 font-serif">Tinh Hoa Rèn Đúc:</span>
                      <span className="font-bold text-amber-300 font-mono">
                        {(player.inventory?.forgingEssence || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Thanh lọc theo Bộ Vị & Giai Vị */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-orange-950/40 text-xs">
                    {/* Lọc Bộ Vị */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                      <span className="text-[10px] text-zinc-500 font-serif mr-1">Bộ Vị:</span>
                      {(['all', 'weapon', 'armor', 'accessory', 'artifact'] as const).map(slot => {
                        const labels: Record<string, string> = {
                          all: 'Tất Cả',
                          weapon: '⚔️ Vũ Khí',
                          armor: '🛡️ Đạo Bào',
                          accessory: '📿 Hộ Thân',
                          artifact: '🔮 Pháp Bảo'
                        };
                        return (
                          <button
                            key={slot}
                            onClick={() => setDismantleSlotFilter(slot)}
                            className={`px-2 py-0.5 rounded text-[10px] font-serif transition cursor-pointer ${
                              dismantleSlotFilter === slot
                                ? 'bg-orange-900/80 text-orange-200 border border-orange-500/60 font-bold shadow-[0_0_8px_rgba(249,115,22,0.25)]'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            {labels[slot]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Lọc Giai Vị */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                      <span className="text-[10px] text-zinc-500 font-serif mr-1">Giai Vị:</span>
                      {(['all', 1, 2, 3, 4, 5] as const).map(t => (
                        <button
                          key={String(t)}
                          onClick={() => setDismantleTierFilter(t)}
                          className={`px-2 py-0.5 rounded text-[10px] font-serif transition cursor-pointer ${
                            dismantleTierFilter === t
                              ? 'bg-amber-900/80 text-amber-200 border border-amber-500/60 font-bold shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          {t === 'all' ? 'Tất Cả' : t === 5 ? 'Tier 5+' : `Tier ${t}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. BỐ CỤC 2 CỘT ĐỐI XỨNG */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                  {/* CỘT TRÁI: DANH SÁCH TRANG BỊ TRONG TÚI TRỮ VẬT (7 CỘT) */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
                        <span>🎒 Trang Bị Khả Dụng ({filteredDismantleEquips.length})</span>
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Nhấp vào thẻ bài để chọn/bỏ chọn
                      </span>
                    </div>

                    {filteredDismantleEquips.length === 0 ? (
                      <div className="p-8 text-center rounded-xl bg-black/40 border border-zinc-800/60 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-full bg-orange-950/30 border border-orange-800/40 flex items-center justify-center text-xl">
                          📦
                        </div>
                        <p className="text-xs text-zinc-400 font-serif">
                          Túi trữ vật trống trải, không có trang bị rảnh rỗi để dung luyện!
                        </p>
                        <p className="text-[10px] text-zinc-500 max-w-sm mx-auto">
                          Trang bị đang mặc trên thân và Bản Mệnh Pháp Bảo đã được bảo vệ tuyệt đối và không hiển thị tại đây.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        {filteredDismantleEquips.map(equip => {
                          const safety = canDismantleEquipment(equip, player);
                          const isSelected = selectedDismantleIds.includes(equip.id);
                          const tier = getEquipmentTier(equip);
                          const qualityKey = getEquipQualityKey(equip);
                          const qualityInfo = getItemQuality(equip.quality || qualityKey);
                          const socketCount = (equip.sockets || []).length;
                          const gemsInSockets = (equip.sockets || []).filter(s => s.gem);

                          return (
                            <div
                              key={equip.id}
                              onClick={() => {
                                if (safety.canDismantle) {
                                  handleSelectDismantleEquip?.(equip.id);
                                }
                              }}
                              className={`p-2.5 rounded-xl border transition cursor-pointer select-none flex items-center gap-3 ${
                                !safety.canDismantle
                                  ? 'bg-zinc-950/40 border-zinc-800/40 opacity-50 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-gradient-to-r from-orange-950/80 via-amber-950/50 to-orange-950/60 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                                  : 'bg-black/50 hover:bg-zinc-900/60 border-zinc-800/70 hover:border-zinc-700'
                              }`}
                            >
                              {/* Checkbox */}
                              <div className="flex-shrink-0">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-orange-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                                )}
                              </div>

                              {/* Icon loại đồ */}
                              <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-base flex-shrink-0 shadow-inner">
                                {equip.slot === 'weapon'
                                  ? '⚔️'
                                  : equip.slot === 'armor'
                                  ? '🛡️'
                                  : equip.slot === 'accessory'
                                  ? '📿'
                                  : '🔮'}
                              </div>

                              {/* Thông tin chính */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-xs font-serif font-bold truncate ${qualityInfo.textClass}`}>
                                    {equip.name}
                                  </span>
                                  {equip.enhancement && equip.enhancement > 0 ? (
                                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                                      +{equip.enhancement}
                                    </span>
                                  ) : null}
                                </div>

                                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-mono">
                                    Tier {tier}
                                  </span>
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded border ${qualityInfo.badgeClass}`}>
                                    {qualityInfo.name}
                                  </span>
                                  <span className="text-[9px] text-zinc-400 font-mono">
                                    +{equip.powerBonus || 0} Uy lực
                                  </span>
                                </div>
                              </div>

                              {/* Huy hiệu Ngọc Khảm trong Sockets */}
                              <div className="flex-shrink-0 text-right space-y-1">
                                {gemsInSockets.length > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-[9px] font-serif shadow-[0_0_6px_rgba(16,185,129,0.2)]">
                                    <Gem className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>{gemsInSockets.length} Ngọc khảm</span>
                                  </span>
                                ) : socketCount > 0 ? (
                                  <span className="text-[9px] text-zinc-600 font-mono">
                                    {socketCount} Lỗ trống
                                  </span>
                                ) : null}

                                {!safety.canDismantle && (
                                  <span className="block text-[9px] text-rose-400 italic">
                                    {safety.reason}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* CỘT PHẢI: TRẬN ĐÀI DUNG LUYỆN CỔ PHONG (5 CỘT) */}
                  <div className="lg:col-span-5 p-3.5 rounded-xl bg-gradient-to-b from-[#180e0a] via-[#110a08] to-[#0a0605] border border-orange-900/50 shadow-2xl space-y-3">
                    {/* Tiêu đề Bát Quái Chân Hỏa Đài */}
                    <div className="flex items-center justify-between pb-2 border-b border-orange-950/60">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-orange-950/80 border border-orange-600/60 flex items-center justify-center shadow-inner">
                          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-serif font-bold text-orange-200">
                            Bát Quái Chân Hỏa Đài
                          </h4>
                          <p className="text-[9px] text-zinc-400">
                            Thu hồi khoáng thạch • Tháo rời linh ngọc
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950/70 border border-orange-700/50 text-orange-300 font-mono font-bold">
                        {selectedDismantleIds.length} món
                      </span>
                    </div>

                    {/* Minh họa Lò Bát Quái Chân Hỏa phát quang */}
                    <div className="relative py-4 flex flex-col items-center justify-center overflow-hidden rounded-lg bg-black/50 border border-orange-950/60">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18),transparent_70%)] animate-pulse" />
                      <div className="relative z-10 w-20 h-20 rounded-full border-2 border-dashed border-orange-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.3)] bg-orange-950/20">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/30 via-orange-600/30 to-red-900/40 flex items-center justify-center text-3xl animate-pulse">
                          🔥
                        </div>
                      </div>
                      <div className="relative z-10 mt-2 text-center">
                        <span className="text-[11px] font-serif text-amber-300 font-bold tracking-wider">
                          CHÂN HỎA DUNG LUYỆN
                        </span>
                        <p className="text-[9px] text-zinc-400 mt-0.5">
                          Tái chế vạn khí • Bảo tồn Linh Ngọc 100%
                        </p>
                      </div>
                    </div>

                    {/* BẢNG DỰ TOÁN THU HỒI THỜI GIAN THỰC (LIVE PREVIEW YIELD) */}
                    <div className="p-2.5 rounded-lg bg-black/60 border border-orange-900/40 space-y-2.5">
                      <div className="text-[11px] font-serif font-bold text-amber-300 flex items-center justify-between pb-1 border-b border-orange-950/50">
                        <span>Dự Toán Thu Hồi Sau Dung Luyện:</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {selectedDismantleIds.length} Món
                        </span>
                      </div>

                      {/* 1. Khoáng thạch thu hồi */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-400 block font-serif">
                          🪨 Khoáng Thạch Hoàn Trả:
                        </span>
                        {previewOres.length > 0 ? (
                          <div className="grid grid-cols-1 gap-1">
                            {previewOres.map(ore => (
                              <div
                                key={ore.oreId}
                                className="flex items-center justify-between px-2 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-[11px]"
                              >
                                <span className="text-zinc-200 flex items-center gap-1.5 font-serif">
                                  <span>🪨</span>
                                  {ore.oreName}
                                </span>
                                <span className="font-bold text-amber-300 font-mono">
                                  +{ore.oreQuantity} viên
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-600 italic">
                            Chưa chọn trang bị để phân giải thu hồi khoáng.
                          </p>
                        )}
                      </div>

                      {/* 2. Linh Ngọc tháo gỡ an toàn */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-emerald-400 block font-serif flex items-center gap-1 font-semibold">
                          <Gem className="w-3 h-3 text-emerald-400" />
                          Linh Ngọc Tháo Gỡ An Toàn (100%):
                        </span>
                        {previewRecoveredGems.length > 0 ? (
                          <div className="space-y-1 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                            {previewRecoveredGems.map((gem, idx) => (
                              <div
                                key={`${gem.id}_${idx}`}
                                className="flex items-center justify-between px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[10px] text-emerald-200"
                              >
                                <span className="flex items-center gap-1 font-serif">
                                  <span>💎</span>
                                  {gem.name}
                                </span>
                                <span className="text-emerald-400 text-[9px] font-mono">
                                  Cấp {gem.level || 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-600 italic">
                            Không có linh ngọc khảm trên các món đã chọn.
                          </p>
                        )}
                      </div>

                      {/* 3. Tinh Hoa Rèn Đúc & Linh Thạch */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60">
                        <div className="p-1.5 rounded bg-orange-950/40 border border-orange-900/50">
                          <span className="text-[9px] text-zinc-400 block font-serif">
                            Tinh Hoa Rèn Đúc
                          </span>
                          <span className="text-xs font-bold text-orange-300 font-mono">
                            +{previewTotalEssence}
                          </span>
                        </div>
                        <div className="p-1.5 rounded bg-amber-950/40 border border-amber-900/50">
                          <span className="text-[9px] text-zinc-400 block font-serif">
                            Linh Thạch Hoàn Lại
                          </span>
                          <span className="text-xs font-bold text-amber-300 font-mono">
                            +{previewTotalLinhThach.toLocaleString()} LT
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* NÚT BẤM LỚN TRUNG TÂM: 🔥 KHỞI ĐỘNG CHÂN HỎA DUNG LUYỆN */}
                    <button
                      onClick={() => handleConfirmDismantle?.()}
                      disabled={selectedDismantleIds.length === 0}
                      className={`w-full py-2.5 rounded-lg font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                        selectedDismantleIds.length > 0
                          ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:brightness-110 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-400/60 active:scale-[0.99]'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      <Flame className={`w-4 h-4 ${selectedDismantleIds.length > 0 ? 'text-yellow-200 animate-pulse' : 'text-zinc-600'}`} />
                      <span>🔥 KHỞI ĐỘNG CHÂN HỎA DUNG LUYỆN</span>
                      <RefreshCw className={`w-3.5 h-3.5 ${selectedDismantleIds.length > 0 ? 'text-yellow-200' : 'text-zinc-600'}`} />
                    </button>

                    {/* GHI CHÚ QUY TẮC AN TOÀN */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80 text-[10px] text-zinc-400 space-y-1">
                      <div className="font-semibold text-orange-300/90 font-serif flex items-center gap-1">
                        <Info className="w-3 h-3 text-orange-400" />
                        <span>Quy Tắc Lò Dung Luyện:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-zinc-500 text-[9px]">
                        <li>
                          <strong className="text-zinc-300">An toàn tuyệt đối:</strong> Trang bị đang mặc trên thân và Bản Mệnh Pháp Bảo bị khóa hoàn toàn, không thể dung luyện.
                        </li>
                        <li>
                          <strong className="text-zinc-300">Bảo tồn Linh Ngọc:</strong> Toàn bộ ngọc khảm trên lỗ socket sẽ được tự động tháo dỡ nguyên vẹn vào Túi Trữ Vật.
                        </li>
                        <li>
                          <strong className="text-zinc-300">Hoàn nguyên khoáng thạch:</strong> Nhận lại khoáng thạch tương ứng với Tier của trang bị (Tier 1: Hắc Thiết, Tier 2: Huyền Thiết, Tier 3: Huyền Thiết Tinh Thạch...).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* Modal Xuất Thiết Thần Binh */}
      <ForgingHarvestModal
        isOpen={Boolean(isHarvestModalOpen && forgedEquipmentResult)}
        forgedItem={forgedEquipmentResult || null}
        currentlyEquippedItem={
          forgedEquipmentResult
            ? (player.equipment?.[forgedEquipmentResult.slot as EquipmentSlot] || (player as any).equippedEquipment?.[forgedEquipmentResult.slot as EquipmentSlot] || null)
            : null
        }
        onEquipNow={() => handleEquipNewlyForgedItem?.()}
        onStoreToBag={() => handleStoreNewlyForgedItem?.()}
        onClose={() => {
          if (handleStoreNewlyForgedItem) {
            handleStoreNewlyForgedItem();
          } else {
            setIsHarvestModalOpen?.(false);
          }
        }}
      />
    </div>
  );
};
