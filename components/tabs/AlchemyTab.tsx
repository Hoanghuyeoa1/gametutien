import React, { useState, useMemo } from 'react';
import {
  Lock,
  HelpCircle,
  Sparkles,
  Store,
  Award,
  Flame,
  Package,
  Zap,
  AlertCircle,
  Dna,
  Shield,
  Layers,
  ChevronDown,
  Check,
  X,
  Compass,
  Scroll
} from 'lucide-react';
import { PlayerStats, DanRecipe, Pill, Herb } from '@/lib/types';
import { ARTISAN_PERKS } from '@/lib/inventory-data';
import { DEFAULT_HERBS } from '@/lib/alchemy-data';
import { getSoulCultivationStats } from '@/lib/body-soul-data';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import { checkArtisanCraftRequirement, checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';
import { assessPillRecipeSupply, CraftingSupplyAssessment } from '@/lib/crafting-supply-logic';
import {
  PillVeinTier,
  CatalystItemConfig,
  PillCraftingResult
} from '@/lib/types/pill-veins';
import {
  CATALYST_REGISTRY,
  PILL_VEIN_CONFIG,
  getVeinProbabilities,
  executeVeinedAlchemyCraft,
  consumeVeinedPill
} from '@/lib/pill-vein-logic';
import {
  ProceduralFlameSvg,
  HeavenlyFlamePanel,
  ARCHETYPE_INFO,
  TIER_ROMAN_MAP
} from './HeavenlyFlamePanel';
import { AlchemyTacticsPanel } from './AlchemyTacticsPanel';
import { CustomRecipePanel } from './CustomRecipePanel';
import { useHeavenlyFlameActions } from '@/hooks/useHeavenlyFlameActions';
import { useAlchemyTacticsActions } from '@/hooks/useAlchemyTacticsActions';
import { DEFAULT_MORTAL_FLAME } from '@/lib/heavenly-flame-logic';
import { PillHarvestModal } from '@/components/modals/PillHarvestModal';
import { PillTribulationModal } from '@/components/modals/PillTribulationModal';
import { usePillTribulationActions } from '@/hooks/usePillTribulationActions';
import { normalizePlayerData, STORAGE_KEY } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu';

export interface AlchemyTabProps {
  player: PlayerStats;
  alchemySubTab: 'cauldron' | 'tactics' | 'flames' | 'pills' | 'market' | 'custom_recipe';
  setAlchemySubTab: (tab: 'cauldron' | 'tactics' | 'flames' | 'pills' | 'market' | 'custom_recipe') => void;
  availableDanRecipes: DanRecipe[];
  handleUnlockArtisan: (type: 'alchemy' | 'forging') => void;
  setActiveTab: (tab: TabType) => void;
  handleCraftPill: (recipe: DanRecipe) => void;
  handleConsumePill: (pill: Pill) => void;
  handleBuyHerb: (herb: Herb) => void;
  handleBuyMissingMaterials?: (assessment: CraftingSupplyAssessment) => boolean;
  handleToggleAutoBuySupply?: (checked?: boolean) => void;
  setPlayer?: (player: PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'alchemy' | 'system' | 'danger' | 'sect') => void;
}

export const AlchemyTab: React.FC<AlchemyTabProps> = ({
  player,
  alchemySubTab,
  setAlchemySubTab,
  availableDanRecipes,
  handleUnlockArtisan,
  setActiveTab,
  handleCraftPill,
  handleConsumePill,
  handleBuyHerb,
  handleBuyMissingMaterials,
  handleToggleAutoBuySupply,
  setPlayer,
  showToast,
  addLog
}) => {
  // State quản lý khảm nạp Phụ Liệu Xúc Tác Biến Dị
  const [selectedCatalystId, setSelectedCatalystId] = useState<string | null>(null);
  const [isCatalystDrawerOpen, setIsCatalystDrawerOpen] = useState<boolean>(false);
  const [isFlameDrawerOpen, setIsFlameDrawerOpen] = useState<boolean>(false);
  const [harvestResult, setHarvestResult] = useState<PillCraftingResult | null>(null);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState<boolean>(false);

  // Hook điều phối Dị Hỏa Thiên Địa
  const {
    flameState,
    equippedFlameConfig,
    equippedFlameInstance,
    allFlamesList,
    handleEquipFlame,
    handleFeedFlameWithOre,
    handleFeedFlameWithTuVi,
    handleUnlockFlame
  } = useHeavenlyFlameActions({
    player,
    setPlayer: setPlayer || (() => {}),
    showToast,
    addLog
  });

  // Hook điều phối Đan Lôi Kiếp & Đan Linh Hóa Hình
  const tribulation = usePillTribulationActions({
    player,
    setPlayer: setPlayer || (() => {}),
    showToast,
    addLog
  });

  // Hook điều phối Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ
  const tactics = useAlchemyTacticsActions({
    player,
    setPlayer: setPlayer || (() => {}),
    showToast,
    addLog,
    onHarvestSuccess: (result) => {
      setHarvestResult(result);
      setIsHarvestModalOpen(true);
    },
    onTribulationTrigger: (encounter, basePill) => {
      tribulation.startTribulation(encounter, basePill);
    }
  });

  // Tính toán xác suất xuất hiện Đan Văn dựa trên Đan Sư, Phụ Liệu & Dị Hỏa
  const catalystBonus = selectedCatalystId ? CATALYST_REGISTRY[selectedCatalystId]?.veinQualityBonus || 0 : 0;
  const flameBonus = equippedFlameConfig.baseVeinQualityBonus || 0;
  const veinChances = useMemo(() => {
    return getVeinProbabilities(
      player.currentRealm || 0,
      player.alchemyArtisan?.level || 1,
      1,
      catalystBonus + flameBonus
    );
  }, [player.currentRealm, player.alchemyArtisan?.level, catalystBonus, flameBonus]);

  // Phụ liệu xúc tác đang chọn
  const selectedCatalyst = selectedCatalystId ? CATALYST_REGISTRY[selectedCatalystId] : null;

  // Đếm số lượng phụ liệu đang có trong túi
  const getOwnedCatalystCount = (catId: string) => {
    const inv = player.inventory || { pills: [], herbs: [], ores: [] };
    const oreCount = inv.ores?.find(o => o.id === catId)?.quantity || 0;
    const herbCount = inv.herbs?.find(h => h.id === catId)?.quantity || 0;
    return oreCount + herbCount;
  };

  // Mua phụ liệu xúc tác tại Dược Phố
  const handleBuyCatalyst = (cat: CatalystItemConfig, price: number) => {
    if (player.linhThach < price) {
      showToast?.('Không đủ Linh Thạch để mua phụ liệu này!');
      return;
    }
    if (!setPlayer) return;

    const updated: PlayerStats = JSON.parse(JSON.stringify(player));
    updated.linhThach -= price;
    const inv = updated.inventory || { pills: [], herbs: [], ores: [] };
    if (!inv.ores) inv.ores = [];

    const existing = inv.ores.find(o => o.id === cat.itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      inv.ores.push({
        id: cat.itemId,
        name: cat.name,
        grade: 'Tứ Giai',
        description: cat.description,
        price,
        quantity: 1,
        quality: 'thuong_pham'
      });
    }

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    audioEngine.playSFX('merchant');
    showToast?.(`Đã mua 1 [${cat.name}] giá ${price.toLocaleString()} Linh Thạch!`);
  };

  // Thực thi luyện đan có đan văn
  const onInitiateCraftWithVeins = (recipe: DanRecipe) => {
    // Nếu có thể tự thực thi qua pure logic engine
    if (setPlayer) {
      const outcome = executeVeinedAlchemyCraft(
        recipe,
        player,
        selectedCatalystId,
        {
          crafterRealmIndex: player.currentRealm,
          alchemySkillLevel: player.alchemyArtisan?.level
        }
      );

      if (!outcome.success) {
        showToast?.(`⚠️ Luyện đan thất bại: ${outcome.message}`);
        return;
      }

      audioEngine.playAlchemyFurnaceSound(1.0);
      const normalized = normalizePlayerData(outcome.updatedPlayer);
      setPlayer(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));

      if (outcome.craftingResult) {
        if (outcome.craftingResult.tribulationTriggered && outcome.craftingResult.tribulationEncounter) {
          tribulation.startTribulation(outcome.craftingResult.tribulationEncounter, {
            id: `${recipe.pillId}_vein_${outcome.craftingResult.veinCount}`,
            name: outcome.craftingResult.basePillName,
            grade: recipe.grade,
            description: recipe.description,
            effectType: recipe.effectType || 'breakthrough_bonus',
            effectValue: recipe.effectValue || 20,
            quantity: outcome.craftingResult.finalYieldCount,
            veinMetadata: outcome.craftingResult.veinMetadata
          });
          return;
        }

        setHarvestResult(outcome.craftingResult);
        setIsHarvestModalOpen(true);
        if (outcome.craftingResult.isExploded) {
          audioEngine.playSFX('danger');
          showToast?.(`💥 NỔ LÒ! Dị Hỏa bạo liệt khiến mẻ đan biến thành Phế Đan! Hoàn trả 50% nguyên liệu.`);
          addLog?.('Dị Hỏa Nổ Lò', outcome.message, 'danger');
        } else {
          audioEngine.playSFX('alchemy');
          showToast?.(`🎉 Luyện thành công [${outcome.craftingResult.basePillName}] (${outcome.craftingResult.veinCount} Đan Văn)!`);
          addLog?.('Luyện Đan Đan Văn', outcome.message, 'alchemy');
        }
      }
    } else {
      // Fallback gọi handleCraftPill thông thường
      handleCraftPill(recipe);
    }
  };

  return (
    <div className="space-y-3">
      {/* Modal Thu Hoạch Đan Dược Đan Văn */}
      <PillHarvestModal
        harvestResult={harvestResult}
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
      />

      {!player.alchemyArtisan?.unlocked ? (
        <div className="p-6 text-center space-y-4 rounded-xl bg-gradient-to-b from-[#14100c] to-[#0a0a0f] border border-amber-900/40">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <Lock className="w-7 h-7 text-amber-500" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-serif font-bold text-amber-200">
              Chưa Khai Ngộ Đan Đạo
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Luyện Đan Các là thánh địa u minh luyện chế các loại nghịch thiên tiên đan. Muốn điều khiển đan hỏa và thấu hiểu dược lý, cần phải lĩnh ngộ đạo thống từ <span className="text-amber-300 font-semibold">[Thái Thượng Đan Kinh Tàn Quyển]</span>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-amber-900/30 text-left text-[11px] text-amber-300/80 space-y-1">
            <div className="font-semibold text-amber-300 font-serif flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Manh Mối Khai Mở:</span>
            </div>
            <p className="text-zinc-400 text-[10px] pl-5">
              • Mua tại <span className="text-amber-300 font-semibold">Vạn Bảo Thương Hội</span> (Khu Trân Phẩm Hiếm)<br/>
              • Nhặt được khi <span className="text-amber-300 font-semibold">Bế Quan</span> tích lũy kỳ duyên<br/>
              • Rớt khi trảm diệt Ma Thú Thí Luyện hoặc mở rương <span className="text-amber-300 font-semibold">Bí Cảnh Đa Tầng</span>
            </p>
          </div>

          {((player.manuals || []).some(m => m.id === 'manual_dan_kinh_tan_quyen') ||
            (player.inventory?.manuals || []).some(m => m.id === 'manual_dan_kinh_tan_quyen') ||
            (player.learnedManuals || []).includes('manual_dan_kinh_tan_quyen')) ? (
            <button
              onClick={() => handleUnlockArtisan('alchemy')}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)] transition cursor-pointer flex items-center justify-center gap-2 animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Lĩnh Ngộ [Thái Thượng Đan Kinh] Khai Mở Đan Đạo</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('merchant')}
              className="w-full py-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-700/50 font-serif text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Đến Vạn Bảo Thương Hội Tầm Bảo →</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Banner Đẳng Cấp Luyện Đan Sư */}
          {(() => {
            const promoCheck = checkArtisanPromotionRequirement(player.currentRealm, player.alchemyArtisan?.level || 1);
            const isExpFull = (player.alchemyArtisan?.exp || 0) >= (player.alchemyArtisan?.maxExp || 100);
            return (
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/40 via-[#181412] to-amber-950/30 border border-amber-800/40 space-y-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-serif font-bold text-amber-200">
                      {player.alchemyArtisan?.title || 'Sơ Cấp Luyện Đan Sư'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 border border-amber-600/40 text-amber-300 font-mono">
                      Bậc {player.alchemyArtisan?.level || 1}/5
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300/80">
                    {player.alchemyArtisan?.exp || 0}/{player.alchemyArtisan?.maxExp || 100} EXP
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-amber-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.floor(((player.alchemyArtisan?.exp || 0) / (player.alchemyArtisan?.maxExp || 100)) * 100))}%`
                    }}
                  />
                </div>
                {promoCheck.isLockedByRealm && isExpFull && (
                  <div className="text-[10.5px] py-1 px-2.5 rounded bg-amber-950/70 border border-amber-500/50 text-amber-300 font-serif text-center flex items-center justify-center gap-1.5 animate-pulse">
                    <span>{promoCheck.reason}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span className="text-emerald-400">
                    +{(ARTISAN_PERKS[player.alchemyArtisan?.level || 1] || ARTISAN_PERKS[1]).successBonus}% Tỉ lệ thành công
                  </span>
                  <span className="text-yellow-400">
                    {(ARTISAN_PERKS[player.alchemyArtisan?.level || 1] || ARTISAN_PERKS[1]).critChance}% Bạo phát x2 đan
                  </span>
                  <span className="text-amber-300">
                    ✨ {player.alchemyArtisan?.criticalCraftCount || 0} Cực Phẩm
                  </span>
                </div>
              </div>
            );
          })()}

          {/* HUD Hiển Thị Đan Độc & Khí Hải Thanh Khiết */}
          {(() => {
            const currentToxicity = player.pillToxicity || 0;
            const qiPurity = typeof player.qiPurity === 'number' ? player.qiPurity : Math.max(0, 100 - currentToxicity);
            const isCriticalTox = currentToxicity >= 80;
            const isHighTox = currentToxicity >= 50;
            const isModerateTox = currentToxicity >= 20;

            const toxStatusText = isCriticalTox
              ? 'Kinh Mạch Bế Tắc • Nguy Cơ Tẩu Hỏa'
              : isHighTox
              ? 'Đan Độc Trầm Tích • Cần Hóa Độc'
              : isModerateTox
              ? 'Khí Huyết Hơi Đục • Cần Lưu Ý'
              : 'Kinh Mạch Thông Suốt • Khí Hải Thuần Tịnh';

            const toxStatusColor = isCriticalTox
              ? 'text-red-400 border-red-500/60 bg-red-950/40 animate-pulse'
              : isHighTox
              ? 'text-rose-300 border-rose-500/50 bg-rose-950/40'
              : isModerateTox
              ? 'text-amber-300 border-amber-500/40 bg-amber-950/40'
              : 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30';

            return (
              <div className="p-3 rounded-lg bg-gradient-to-r from-[#120f0d] via-[#16120e] to-[#120f0d] border border-stone-800/80 space-y-2 shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-stone-200">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trạng Thái Kinh Mạch & Đan Độc:</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${toxStatusColor}`}>
                    {toxStatusText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                  <div className="flex justify-between items-center p-1.5 rounded bg-black/40 border border-stone-800/80">
                    <span className="text-zinc-400">Đan Độc Thể Nội:</span>
                    <strong className={currentToxicity > 0 ? (isHighTox ? 'text-rose-400' : 'text-amber-300') : 'text-emerald-400'}>
                      {currentToxicity} / 100 Điểm
                    </strong>
                  </div>
                  <div className="flex justify-between items-center p-1.5 rounded bg-black/40 border border-stone-800/80">
                    <span className="text-zinc-400">Khí Hải Thanh Khiết:</span>
                    <strong className="text-emerald-400">{qiPurity}%</strong>
                  </div>
                </div>

                {/* Thanh đo Đan Độc vs Độ Thanh Khiết */}
                <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-stone-800 flex">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, 100 - currentToxicity)}%` }}
                    title={`Độ thanh khiết: ${100 - currentToxicity}%`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
                    style={{ width: `${Math.min(100, currentToxicity)}%` }}
                    title={`Đan độc tích tụ: ${currentToxicity}%`}
                  />
                </div>
              </div>
            );
          })()}

          {/* Sub-tabs Luyện Đan */}
          <div className="flex rounded-lg bg-[#0e0e15] p-1 border border-amber-900/30 text-xs gap-1 flex-wrap">
            <button
              onClick={() => setAlchemySubTab('cauldron')}
              className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif ${
                alchemySubTab === 'cauldron' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-zinc-400'
              }`}
            >
              Đan Lô & Đan Văn
            </button>
            <button
              onClick={() => setAlchemySubTab('tactics')}
              className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1 ${
                alchemySubTab === 'tactics' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-zinc-400'
              }`}
            >
              <Compass className="w-3 h-3 text-amber-400" />
              <span>Phối Ngũ Tứ Trụ</span>
            </button>
            <button
              onClick={() => setAlchemySubTab('custom_recipe')}
              className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1 ${
                alchemySubTab === 'custom_recipe' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]' : 'text-zinc-400 hover:text-amber-300'
              }`}
            >
              <Scroll className="w-3 h-3 text-yellow-400" />
              <span>Khai Sáng Đan Phương</span>
            </button>
            <button
              onClick={() => setAlchemySubTab('flames')}
              className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1 ${
                alchemySubTab === 'flames' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-zinc-400'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Thiên Địa Dị Hỏa ({Object.keys(flameState.unlockedFlames || {}).length})</span>
            </button>
            <button
              onClick={() => setAlchemySubTab('pills')}
              className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif ${
                alchemySubTab === 'pills' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-zinc-400'
              }`}
            >
              Túi Đan ({(player.inventory?.pills || []).reduce((acc, p) => acc + p.quantity, 0)})
            </button>
            <button
              onClick={() => setAlchemySubTab('market')}
              className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif ${
                alchemySubTab === 'market' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-zinc-400'
              }`}
            >
              Dược Phố & Phụ Liệu
            </button>
          </div>

          {/* Sub-tab 1: Lò luyện đan & Phân tầng Đan Văn */}
          {alchemySubTab === 'cauldron' && (
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {/* Shortcut Banner sang Bàn Nung Tứ Trụ */}
              <div
                onClick={() => setAlchemySubTab('tactics')}
                className="p-2.5 rounded-lg bg-gradient-to-r from-amber-950/40 via-[#18110b] to-amber-950/40 border border-amber-600/40 hover:border-amber-400 text-xs flex justify-between items-center cursor-pointer transition shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400 animate-spin duration-3000 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-serif font-bold text-amber-200">
                      Bàn Nung Bát Quái • Phối Ngũ Tứ Trụ
                    </span>
                    <span className="text-[10px] text-zinc-400 ml-2">
                      Tự do phối Quân - Thần - Tá - Sứ & chọn Hỏa Hầu
                    </span>
                  </div>
                </div>
                <span className="text-amber-400 text-[11px] font-serif flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Vào Bàn Nung →
                </span>
              </div>

              {/* Shortcut Banner sang Khai Sáng Đan Phương */}
              <div
                onClick={() => setAlchemySubTab('custom_recipe')}
                className="p-2.5 rounded-lg bg-gradient-to-r from-amber-950/40 via-[#20150d] to-amber-950/40 border border-amber-500/40 hover:border-amber-300 text-xs flex justify-between items-center cursor-pointer transition shadow-sm group"
              >
                <div className="flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-serif font-bold text-amber-200">
                      Đan Đạo Tông Sư • Khai Sáng Đan Phương
                    </span>
                    <span className="text-[10px] text-zinc-400 ml-2">
                      Thử nghiệm ngũ vị dược thảo & sáng lập đan phương độc bản
                    </span>
                  </div>
                </div>
                <span className="text-yellow-400 text-[11px] font-serif flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-bold">
                  Khai Lò Sáng Chế →
                </span>
              </div>

              {/* KHU VỰC BÀN NUNG HỎA ĐỈNH: Khảm nạp phụ liệu xúc tác & Dị Hỏa */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#18110b] via-[#120e0a] to-[#18110b] border border-amber-600/40 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="font-serif font-bold text-xs text-amber-200">
                      Bàn Nung Hỏa Đỉnh • Slot Phụ Liệu Biến Dị
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Hệ Thống Đan Văn Cửu Trọng
                  </span>
                </div>

                {/* KHU VỰC ĐAN HỎA TỌA TRẤN (Procedural Animated Flame & Quick Equip) */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-amber-900/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <ProceduralFlameSvg
                      archetype={equippedFlameConfig.archetype}
                      glowColor={equippedFlameConfig.visualColor.glowColor}
                      size={44}
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-400 font-mono">Đan Hỏa:</span>
                        <span className={`font-serif font-bold text-xs ${equippedFlameConfig.visualColor.flameColor}`}>
                          {equippedFlameConfig.name}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${ARCHETYPE_INFO[equippedFlameConfig.archetype].bg}`}>
                          {equippedFlameInstance ? TIER_ROMAN_MAP[equippedFlameInstance.tier] : 'Phàm Hỏa'}
                        </span>
                      </div>
                      <div className="text-[9.5px] text-zinc-400 font-mono flex items-center gap-2 flex-wrap mt-0.5">
                        {equippedFlameConfig.baseToxicityBurnPercent > 0 && (
                          <span className="text-emerald-400 font-bold">
                            Thiêu độc -{equippedFlameConfig.baseToxicityBurnPercent}%
                          </span>
                        )}
                        {equippedFlameConfig.baseYieldMultiplier > 1 && (
                          <span className="text-purple-400 font-bold">
                            Sản lượng x{equippedFlameConfig.baseYieldMultiplier}
                          </span>
                        )}
                        {equippedFlameConfig.explosionRiskPercent > 0 && (
                          <span className="text-red-400 font-bold">
                            Rủi ro nổ {equippedFlameConfig.explosionRiskPercent}%
                          </span>
                        )}
                        {equippedFlameConfig.mutationChanceMultiplier > 1 && (
                          <span className="text-fuchsia-400 font-bold">
                            Biến dị x{equippedFlameConfig.mutationChanceMultiplier}
                          </span>
                        )}
                        {equippedFlameConfig.id === 'flame_pham_hoa' && (
                          <span className="text-zinc-500 italic">
                            Chưa khảm Dị Hỏa (Hỏa lực cơ bản)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setIsFlameDrawerOpen(!isFlameDrawerOpen)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 border border-amber-600/60 text-amber-200 text-[11px] font-serif font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Đổi Dị Hỏa</span>
                    </button>
                    <button
                      onClick={() => setAlchemySubTab('flames')}
                      title="Đến Đan Hỏa Các ôn dưỡng"
                      className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-serif transition cursor-pointer"
                    >
                      Ôn Dưỡng →
                    </button>
                  </div>
                </div>

                {/* Khay chọn nhanh Dị Hỏa (Quick Flame Drawer) */}
                {isFlameDrawerOpen && (
                  <div className="p-2.5 rounded-lg bg-black/90 border border-amber-900/60 space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 font-serif">
                      <span>Chọn Dị Hỏa để dẫn nhập vào Đan Lò:</span>
                      <button
                        onClick={() => setAlchemySubTab('flames')}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        Khảo cứu & Ôn dưỡng toàn diện →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {/* Phàm Hỏa */}
                      <div
                        onClick={() => {
                          handleEquipFlame(null);
                          setIsFlameDrawerOpen(false);
                        }}
                        className={`p-2 rounded border text-left cursor-pointer transition text-[11px] ${
                          equippedFlameConfig.id === 'flame_pham_hoa'
                            ? 'bg-amber-950/70 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                            : 'bg-[#14100c] border-amber-900/40 hover:border-amber-700/60 text-zinc-300'
                        }`}
                      >
                        <div className="flex justify-between items-center font-serif font-bold">
                          <span className={equippedFlameConfig.id === 'flame_pham_hoa' ? 'text-amber-300' : ''}>
                            {DEFAULT_MORTAL_FLAME.name}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                            Mặc Định
                          </span>
                        </div>
                        <div className="text-[9.5px] text-zinc-400 mt-0.5 line-clamp-1">
                          Đan hỏa cơ bản, không có buff hay debuff nổ lò.
                        </div>
                      </div>

                      {/* Các Dị Hỏa */}
                      {allFlamesList.map(flame => {
                        const isUnlocked = Boolean(flameState.unlockedFlames?.[flame.id]);
                        const isSelected = equippedFlameConfig.id === flame.id;
                        const instance = flameState.unlockedFlames?.[flame.id];

                        return (
                          <div
                            key={flame.id}
                            onClick={() => {
                              if (isUnlocked) {
                                handleEquipFlame(flame.id);
                                setIsFlameDrawerOpen(false);
                              } else {
                                setAlchemySubTab('flames');
                              }
                            }}
                            className={`p-2 rounded border text-left transition text-[11px] ${
                              isSelected
                                ? 'bg-amber-950/70 border-amber-500 text-amber-100 ring-1 ring-amber-500/50 cursor-pointer'
                                : isUnlocked
                                ? 'bg-[#14100c] border-amber-900/40 hover:border-amber-700/60 text-zinc-300 cursor-pointer'
                                : 'bg-black/30 border-zinc-800/40 opacity-50 cursor-pointer text-zinc-500'
                            }`}
                          >
                            <div className="flex justify-between items-center font-serif font-bold">
                              <span className={isSelected ? 'text-amber-300' : isUnlocked ? flame.visualColor.flameColor : 'text-zinc-500'}>
                                {flame.name}
                              </span>
                              <span className="font-mono text-[9px]">
                                {isUnlocked ? (
                                  <span className="text-emerald-400">
                                    {instance ? TIER_ROMAN_MAP[instance.tier] : 'Giai 1'}
                                  </span>
                                ) : (
                                  <span className="text-zinc-500">Chưa Thuần Phục</span>
                                )}
                              </span>
                            </div>
                            <div className="text-[9.5px] text-zinc-400 mt-0.5 line-clamp-1">
                              {isUnlocked ? flame.description : 'Bấm để vào Đan Hỏa Các thuần phục...'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Slot Khảm Nạp Phụ Liệu Biến Dị */}
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => setIsCatalystDrawerOpen(!isCatalystDrawerOpen)}
                    className={`flex-1 p-2 rounded-lg border cursor-pointer transition flex items-center justify-between text-xs ${
                      selectedCatalyst
                        ? 'bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        : 'bg-black/40 border-dashed border-amber-900/50 hover:border-amber-600/60 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Dna className={`w-4 h-4 shrink-0 ${selectedCatalyst ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <div className="truncate">
                        {selectedCatalyst ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-amber-300 truncate">
                              {selectedCatalyst.name}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-900/60 text-amber-300 font-mono">
                              +{selectedCatalyst.mutationChanceBonus}% Dị Biến
                            </span>
                          </div>
                        ) : (
                          <span className="italic font-serif text-amber-400/80">
                            + Khảm Nạp Phụ Liệu Biến Dị (Thú Đan, Tinh Thần Sa...)
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  </div>

                  {selectedCatalyst && (
                    <button
                      onClick={() => setSelectedCatalystId(null)}
                      title="Gỡ bỏ phụ liệu"
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Khay chọn phụ liệu xúc tác (Dropdown/Drawer) */}
                {isCatalystDrawerOpen && (
                  <div className="p-2.5 rounded-lg bg-black/80 border border-amber-900/40 space-y-2 animate-fadeIn">
                    <div className="text-[10px] text-zinc-400 font-serif flex items-center justify-between">
                      <span>Chọn 1 phụ liệu hiếm để tăng tỷ lệ đan văn & đột biến vĩnh viễn:</span>
                      <button
                        onClick={() => setAlchemySubTab('market')}
                        className="text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Store className="w-3 h-3" /> Mua tại Dược Phố
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {Object.values(CATALYST_REGISTRY).map(cat => {
                        const ownedCount = getOwnedCatalystCount(cat.itemId);
                        const isSelected = selectedCatalystId === cat.itemId;
                        const isAvailable = ownedCount > 0;

                        return (
                          <div
                            key={cat.itemId}
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedCatalystId(cat.itemId);
                                setIsCatalystDrawerOpen(false);
                              }
                            }}
                            className={`p-2 rounded border text-left cursor-pointer transition text-[11px] ${
                              isSelected
                                ? 'bg-amber-950/70 border-amber-500 text-amber-100 ring-1 ring-amber-500/50'
                                : isAvailable
                                ? 'bg-[#14100c] border-amber-900/40 hover:border-amber-700/60 text-zinc-300'
                                : 'bg-black/30 border-zinc-800/40 opacity-50 cursor-not-allowed text-zinc-500'
                            }`}
                          >
                            <div className="flex justify-between items-center font-serif font-bold">
                              <span className={isSelected ? 'text-amber-300' : ''}>{cat.name}</span>
                              <span className="font-mono text-[10px]">
                                Có: <strong className={ownedCount > 0 ? 'text-emerald-400' : 'text-red-400'}>{ownedCount}</strong>
                              </span>
                            </div>
                            <div className="text-[9.5px] text-zinc-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-[9px] font-mono">
                              <span className="text-yellow-400 font-semibold">+{cat.mutationChanceBonus}% Biến Dị</span>
                              <span className="text-zinc-500">•</span>
                              <span className="text-emerald-400">+{cat.veinQualityBonus} Điểm Đan Văn</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* BẢNG DỰ TOÁN THIÊN CƠ: Xác suất Đan Văn & Dị Biến */}
                <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-800/70 space-y-1.5 text-[10px] font-mono">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="font-serif text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span>Dự Toán Thiên Cơ Đan Đạo:</span>
                    </span>
                    <span className="text-amber-300">
                      Tỷ lệ Dị Biến: <strong className="text-emerald-400">~{5 + (selectedCatalyst?.mutationChanceBonus || 0)}%</strong>
                    </span>
                  </div>

                  {/* Thanh tỷ lệ xuất hiện Đan Văn */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-zinc-900">
                    <div style={{ width: `${veinChances.tier0}%` }} title={`Phàm Đan (0 Văn): ${veinChances.tier0}%`} className="bg-zinc-600 h-full" />
                    <div style={{ width: `${veinChances.tierLow}%` }} title={`Sơ Phẩm (1-2 Văn): ${veinChances.tierLow}%`} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${veinChances.tierMid}%` }} title={`Trung Phẩm (3-5 Văn): ${veinChances.tierMid}%`} className="bg-sky-500 h-full" />
                    <div style={{ width: `${veinChances.tierHigh}%` }} title={`Thượng Phẩm (6-8 Văn): ${veinChances.tierHigh}%`} className="bg-purple-500 h-full" />
                    <div style={{ width: `${veinChances.tier9}%` }} title={`Cửu Khổng Thần Đan: ${veinChances.tier9}%`} className="bg-yellow-400 h-full animate-pulse" />
                  </div>

                  <div className="flex justify-between text-[9px] text-zinc-400 flex-wrap gap-1">
                    <span className="text-zinc-400">0 Văn: {veinChances.tier0}%</span>
                    <span className="text-emerald-400">1-2 Văn: {veinChances.tierLow}%</span>
                    <span className="text-sky-400">3-5 Văn: {veinChances.tierMid}%</span>
                    <span className="text-purple-400">6-8 Văn: {veinChances.tierHigh}%</span>
                    <span className="text-yellow-400 font-bold">✨ 9 Văn: {veinChances.tier9}%</span>
                  </div>
                </div>
              </div>

              {/* Thanh điều khiển chuỗi cung ứng tự động */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0e0e15] border border-amber-900/30 text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-amber-200 font-serif font-bold text-xs flex items-center gap-1.5">
                      <span>Tự Động Mua Thiếu Bằng Linh Thạch</span>
                      {player.craftingSupplySettings?.autoBuyMissing && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-amber-950/60 text-amber-300 border border-amber-600/40 rounded font-mono">
                          Đang Bật
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400">Tự trừ Linh Thạch mua đủ Thảo Dược khi bấm Luyện Đan</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={Boolean(player.craftingSupplySettings?.autoBuyMissing)}
                    onChange={(e) => handleToggleAutoBuySupply?.(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Danh sách Công Thức Đan Dược */}
              {availableDanRecipes.map(recipe => {
                const perkBonus = (ARTISAN_PERKS[player.alchemyArtisan?.level || 1] || ARTISAN_PERKS[1]).successBonus;
                const soulBonus = getSoulCultivationStats(player.soulCultivation).alchemyBonusPercent || 0;
                const successRate = Math.min(
                  98,
                  Math.max(25, recipe.baseSuccessRate + Math.floor((player.ngoTinh - 50) * 0.3) + Math.floor((player.khiVan - 50) * 0.2) + perkBonus + soulBonus)
                );
                const craftReq = checkArtisanCraftRequirement(player.currentRealm, recipe.grade);
                const isGradeAllowed = (ARTISAN_PERKS[player.alchemyArtisan?.level || 1] || ARTISAN_PERKS[1]).allowedGrades.includes(recipe.grade);
                const inv = player.inventory || { pills: [], herbs: [], ores: [] };
                const canCraft =
                  !craftReq.isLockedByRealm &&
                  isGradeAllowed &&
                  player.linhThach >= recipe.linhThachCost &&
                  recipe.herbsRequired.every(r => (inv.herbs.find(h => h.id === r.herbId)?.quantity || 0) >= r.count) &&
                  (!selectedCatalystId || getOwnedCatalystCount(selectedCatalystId) > 0);

                const supply = assessPillRecipeSupply(player, recipe, 1);
                const isAutoBuyEnabled = Boolean(player.craftingSupplySettings?.autoBuyMissing);
                const isAutoBuyReady = isAutoBuyEnabled && supply.canExecuteAutoPurchase;
                const canInitiateCraft = (canCraft || isAutoBuyReady) && !craftReq.isLockedByRealm && isGradeAllowed;

                return (
                  <div key={recipe.id} className="p-3 bg-[#0e0e15] rounded-lg border border-amber-900/20 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-serif font-bold text-amber-200 text-xs flex items-center gap-1.5 flex-wrap">
                          <Flame className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span>[{convertGradeToGiai(recipe.grade)}] {recipe.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-yellow-950/40 text-yellow-300 border border-yellow-800/40 rounded font-mono">
                            {convertGradeToGiai(recipe.grade)}
                          </span>
                          {craftReq.isLockedByRealm && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-red-950/60 text-red-300 border border-red-800/60 rounded font-mono flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-red-400" />
                              <span>🔒 Cần đạt [{craftReq.requiredRealmName}]</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{recipe.description}</p>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                        Tỉ lệ: ~{successRate}%
                      </span>
                    </div>

                    <div className="text-[10px] font-mono bg-black/40 p-2 rounded border border-zinc-800/60 space-y-1">
                      <div className="text-zinc-400">Dược liệu yêu cầu:</div>
                      <div className="flex flex-wrap gap-2 text-zinc-300">
                        {recipe.herbsRequired.map(r => {
                          const owned = inv.herbs.find(h => h.id === r.herbId)?.quantity || 0;
                          const isEnough = owned >= r.count;
                          return (
                            <span key={r.herbId} className={isEnough ? 'text-emerald-400' : 'text-red-400'}>
                              • {r.herbName}: {owned}/{r.count}
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-zinc-400 pt-0.5 flex justify-between items-center flex-wrap gap-1">
                        <span>Linh thạch lò lửa: <span className="text-amber-300">{recipe.linhThachCost}</span></span>
                        <span className="text-[9px] text-amber-400/80">
                          ✨ 10 Bậc Đan Văn (0 ➔ 9 Văn Cửu Khổng)
                        </span>
                      </div>
                    </div>

                    {/* Widget Thiếu Hụt Nguyên Liệu */}
                    {!supply.isFullySupplied && (
                      <div className="space-y-1.5 p-2 rounded bg-amber-950/20 border border-amber-900/30">
                        <div className="text-[10px] text-amber-300 font-medium flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Nguyên liệu còn thiếu:</span>
                          </span>
                          {supply.totalCostLinhThach > 0 && (
                            <span className="font-mono text-[10px] text-zinc-400">
                              Cần chi: <strong className="text-amber-300">{supply.totalCostLinhThach.toLocaleString()}</strong> LT
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {supply.missingItems.map(item => (
                            <div
                              key={item.id}
                              className={`text-[9px] px-2 py-1 rounded border font-mono flex items-center gap-1.5 ${
                                item.canPurchaseAtCurrentRealm
                                  ? 'bg-amber-950/40 border-amber-700/50 text-amber-200'
                                  : 'bg-red-950/50 border-red-800/60 text-red-300'
                              }`}
                            >
                              <span>{item.name}: Thiếu <strong>{item.missingQty}x</strong></span>
                              {item.canPurchaseAtCurrentRealm ? (
                                <span className="text-amber-400/90">• {item.totalPrice.toLocaleString()} LT</span>
                              ) : (
                                <span className="text-red-400 font-semibold">• 🔒 Cần đạt [{item.requiredRealmName}]</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {supply.hasUnmetRealmGating && (
                          <div className="text-[10px] text-red-400 bg-red-950/40 p-1.5 rounded border border-red-900/40 flex items-center gap-1 font-mono">
                            <Lock className="w-3 h-3 text-red-400 shrink-0" />
                            <span>🔒 Cần đạt cảnh giới cao hơn để mua tại Thương Hội</span>
                          </div>
                        )}

                        {supply.canExecuteAutoPurchase && (
                          <button
                            type="button"
                            onClick={() => handleBuyMissingMaterials?.(supply)}
                            className="w-full py-1 px-2 rounded bg-gradient-to-r from-amber-800/80 to-yellow-700/80 hover:from-amber-700 hover:to-yellow-600 border border-amber-500/50 text-amber-100 font-serif text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                          >
                            <Zap className="w-3 h-3 text-yellow-300" />
                            <span>⚡ Mua Đủ Thiếu Hụt ({supply.totalCostLinhThach.toLocaleString()} Linh Thạch)</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Nút Khai Lò Luyện Đan */}
                    <button
                      onClick={() => onInitiateCraftWithVeins(recipe)}
                      disabled={!canInitiateCraft}
                      className={`w-full py-1.5 px-2 rounded font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                        craftReq.isLockedByRealm
                          ? 'bg-zinc-900 border border-red-900/50 text-red-400/80 cursor-not-allowed'
                          : canInitiateCraft
                          ? 'bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-amber-100 shadow cursor-pointer'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {craftReq.isLockedByRealm ? (
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                      ) : isAutoBuyReady && !canCraft ? (
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                      ) : (
                        <Flame className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {craftReq.isLockedByRealm
                          ? `🔒 Cần đạt [${craftReq.requiredRealmName}]`
                          : !isGradeAllowed
                          ? 'Cần Cấp Đan Sư Cao Hơn'
                          : isAutoBuyReady && !canCraft
                          ? `⚡ Tự Mua & Luyện Đan (${(recipe.linhThachCost + supply.totalCostLinhThach).toLocaleString()} LT)`
                          : canCraft
                          ? selectedCatalyst
                            ? `Khai Lò Luyện Đan (Khảm: ${selectedCatalyst.name})`
                            : 'Khai Lò Luyện Đan'
                          : selectedCatalystId && getOwnedCatalystCount(selectedCatalystId) <= 0
                          ? `Thiếu Phụ Liệu [${selectedCatalyst?.name}]`
                          : supply.hasUnmetRealmGating
                          ? '🔒 Nguyên Liệu Bị Khóa Cảnh Giới'
                          : !supply.hasEnoughLinhThach
                          ? 'Thiếu Linh Thạch Mua Dược Thảo'
                          : 'Thiếu Dược Liệu / Linh Thạch'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sub-tab 2: Túi đan dược (Hiển thị Đan Văn & Dị Biến) */}
          {alchemySubTab === 'pills' && (
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {(player.inventory?.pills || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 italic font-serif">
                  Túi trữ vật trống rỗng, chưa luyện được viên đan nào.
                </div>
              ) : (
                (player.inventory?.pills || []).map((pill, pIdx) => {
                  const q = getItemQuality(pill.quality);
                  const displayGiai = convertGradeToGiai(pill.grade);
                  const veinMeta = pill.veinMetadata || {
                    veinCount: 0,
                    veinMultiplier: 1.0,
                    toxicityMultiplier: 0.50,
                    mutation: null
                  };
                  const veinInfo = PILL_VEIN_CONFIG[veinMeta.veinCount] || PILL_VEIN_CONFIG[0];
                  const isNineVeins = veinMeta.veinCount === 9;
                  const mutation = veinMeta.mutation;

                  return (
                    <div
                      key={pill.id + '_' + (pill.quality || '') + '_' + (veinMeta.veinCount || 0) + '_' + pIdx}
                      className={`p-3 bg-[#0e0e15] rounded-lg border flex justify-between items-center gap-2 transition ${
                        isNineVeins
                          ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
                          : veinMeta.veinCount >= 6
                          ? 'border-purple-600/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                          : veinMeta.veinCount >= 3
                          ? 'border-sky-600/40'
                          : veinMeta.veinCount >= 1
                          ? 'border-emerald-600/40'
                          : 'border-amber-900/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-serif font-bold text-amber-200 text-xs flex items-center gap-1.5 flex-wrap">
                          <Package className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span>[{displayGiai}] {pill.name}</span>

                          {/* Badge Bậc Đan Văn */}
                          {veinMeta.veinCount === 0 ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono text-stone-400 border-stone-700 bg-stone-900/50 font-medium">
                              [0 VĂN • 50% ĐỘC]
                            </span>
                          ) : isNineVeins ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono text-amber-400 border-amber-600 bg-amber-950/40 animate-pulse font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)] flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              [9 VĂN • 0% ĐỘC]
                            </span>
                          ) : (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${veinInfo.badgeClass}`}>
                              [{veinInfo.badgeText}]
                            </span>
                          )}

                          {/* Badge Dị Biến Thiên Phú (Nếu có) */}
                          {mutation && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded border font-mono bg-emerald-950/80 text-emerald-300 border-emerald-500/60 flex items-center gap-1">
                              <Dna className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                              <span>DỊ BIẾN: +{mutation.value}% {mutation.affixName}</span>
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/40">
                            x{pill.quantity}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400">{pill.description}</p>
                        <div className="text-[9.5px] font-mono text-amber-300/80">
                          • Dược lực: +{Math.round((veinMeta.veinMultiplier - 1) * 100)}% | Đan độc:{' '}
                          {isNineVeins ? (
                            <strong className="text-emerald-400">0% (Cực Phẩm Vô Tạp Chất)</strong>
                          ) : (
                            <strong className="text-amber-300">
                              {Math.round(veinMeta.toxicityMultiplier * 100)}% (Giảm -{Math.round((1 - veinMeta.toxicityMultiplier) * 100)}%)
                            </strong>
                          )}
                          {pill.pillToxicity !== undefined ? (
                            <span className="ml-1 text-zinc-400">• Tích tụ: <strong className={pill.pillToxicity === 0 ? 'text-emerald-400' : 'text-rose-400'}>{pill.pillToxicity}</strong> điểm</span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (setPlayer) {
                            const res = consumeVeinedPill(player, pill);
                            if (!res.success) {
                              showToast?.(res.message);
                              return;
                            }
                            audioEngine.playSFX('alchemy');
                            const norm = normalizePlayerData(res.updatedPlayer);
                            setPlayer(norm);
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(norm));
                            showToast?.(res.message);
                            addLog?.('Phục Dược Đan Văn', res.message, res.logType);
                          } else {
                            handleConsumePill(pill);
                          }
                        }}
                        className={`px-3 py-1.5 rounded text-[11px] font-serif font-bold transition cursor-pointer shrink-0 ${
                          isNineVeins
                            ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow'
                            : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                        }`}
                      >
                        Uống Đan
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Sub-tab 3: Dược Phố & Phụ Liệu Biến Dị */}
          {alchemySubTab === 'market' && (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {/* Phụ Liệu Xúc Tác Biến Dị (Auxiliary Catalysts) */}
              <div className="p-3 rounded-lg bg-[#120e0a] border border-amber-600/40 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-xs text-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trân Phẩm Phụ Liệu Biến Dị (Auxiliary Catalysts)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Khảm nạp gia tăng Đan Văn & Dị Biến
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.values(CATALYST_REGISTRY).map(cat => {
                    const price = 500;
                    const owned = getOwnedCatalystCount(cat.itemId);
                    return (
                      <div key={cat.itemId} className="p-2.5 rounded bg-black/40 border border-amber-900/30 flex flex-col justify-between gap-1.5">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="font-serif font-bold text-amber-200 text-xs">{cat.name}</span>
                            <span className="text-[10px] font-mono text-emerald-400">Đang có: {owned}</span>
                          </div>
                          <p className="text-[9.5px] text-zinc-400 line-clamp-2 mt-0.5">{cat.description}</p>
                          <div className="text-[9px] font-mono text-yellow-400/90 mt-1">
                            +{cat.mutationChanceBonus}% Tỷ lệ Biến Dị | +{cat.veinQualityBonus} Điểm Đan Đạo
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-zinc-800/60">
                          <span className="text-[10px] font-mono text-zinc-300">
                            Giá: <strong className="text-amber-300">{price.toLocaleString()}</strong> LT
                          </span>
                          <button
                            onClick={() => handleBuyCatalyst(cat, price)}
                            disabled={player.linhThach < price}
                            className="px-2 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-600/50 text-[10px] font-serif transition cursor-pointer disabled:opacity-40"
                          >
                            Mua 1 Viên
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dược Liệu Thông Thường */}
              <div className="space-y-1.5">
                <div className="text-xs font-serif font-bold text-amber-200 pl-1">
                  Thảo Dược Thường Dụng
                </div>
                {DEFAULT_HERBS.map(herb => {
                  const owned = (player.inventory?.herbs || []).find(h => h.id === herb.id)?.quantity || 0;
                  return (
                    <div key={herb.id} className="p-2.5 bg-[#0e0e15] rounded-lg border border-amber-900/20 flex justify-between items-center gap-2">
                      <div>
                        <div className="font-serif font-bold text-amber-200 text-xs">
                          [{convertGradeToGiai(herb.grade)}] {herb.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Giá: <span className="text-amber-300 font-bold">{herb.price}</span> Linh thạch | Đang có: <span className="text-emerald-400">{owned}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyHerb(herb)}
                        disabled={player.linhThach < herb.price}
                        className="px-2.5 py-1.5 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/40 text-[11px] font-serif transition cursor-pointer shrink-0 disabled:opacity-40"
                      >
                        Mua 1 Cành
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Thiên Địa Dị Hỏa (Flame Sanctuary Panel) */}
          {alchemySubTab === 'flames' && (
            <HeavenlyFlamePanel
              player={player}
              flameState={flameState}
              equippedFlameConfig={equippedFlameConfig}
              equippedFlameInstance={equippedFlameInstance}
              allFlamesList={allFlamesList}
              handleEquipFlame={handleEquipFlame}
              handleFeedFlameWithOre={handleFeedFlameWithOre}
              handleFeedFlameWithTuVi={handleFeedFlameWithTuVi}
              handleUnlockFlame={handleUnlockFlame}
              onBackToCauldron={() => setAlchemySubTab('cauldron')}
            />
          )}

          {/* Sub-tab 5: Phối Ngũ Tứ Trụ & Hỏa Hậu Chiến Thuật */}
          {alchemySubTab === 'tactics' && (
            <AlchemyTacticsPanel
              player={player}
              concoctionSetup={tactics.concoctionSetup}
              previewResult={tactics.previewResult}
              isCraftingAnimation={tactics.isCraftingAnimation}
              equippedFlameConfig={equippedFlameConfig}
              handleSelectHerbForRole={tactics.handleSelectHerbForRole}
              handleChangeStance={tactics.handleChangeStance}
              handleChangeBatchMultiplier={tactics.handleChangeBatchMultiplier}
              handleExecuteConcoction={tactics.handleExecuteConcoction}
              onBackToNormalCauldron={() => setAlchemySubTab('cauldron')}
            />
          )}

          {/* Sub-tab 6: Đan Đạo Tông Sư • Khai Sáng Đan Phương */}
          {alchemySubTab === 'custom_recipe' && (
            <CustomRecipePanel
              player={player}
              setPlayer={setPlayer}
              showToast={showToast}
              addLog={addLog}
              onBackToCauldron={() => setAlchemySubTab('cauldron')}
            />
          )}
        </>
      )}

      {/* Modal Xuất Lò Đan Dược */}
      <PillHarvestModal
        isOpen={isHarvestModalOpen}
        harvestResult={harvestResult}
        onClose={() => {
          setIsHarvestModalOpen(false);
          setHarvestResult(null);
        }}
      />

      {/* Modal Đan Lôi Kiếp & Đan Linh Hóa Hình */}
      <PillTribulationModal
        isOpen={tribulation.isModalOpen}
        encounter={tribulation.activeTribulation}
        currentWave={tribulation.currentWaveData}
        player={player}
        companionInfo={tribulation.companionInfo}
        formationCost={tribulation.formationCost}
        isResolving={tribulation.isResolvingRound}
        finalResult={tribulation.finalResult}
        roundLogs={tribulation.roundLogs}
        onChooseDefense={tribulation.handleChooseDefense}
        onClose={tribulation.handleCloseModal}
      />
    </div>
  );
};
