// components/tabs/FormationTab.tsx
// Giao diện Trận Đạo Bách Nghệ • Trận Pháp Các — Cổ phong tiên hiệp
import React from 'react';
import { Lock, Sparkles, Zap, Shield, Package, Store, Flame } from 'lucide-react';
import { PlayerStats, FormationItem } from '@/lib/types';
import { FormationArtisan, ArrayReforgeType } from '@/lib/types/formation';
import {
  FORMATION_RECIPES,
  FORMATION_ARTISAN_RANKS,
  FORMATION_ELEMENT_CONFIG,
  FORMATION_TYPE_CONFIG,
  getAvailableFormationRecipes,
} from '@/lib/formation-data';
import {
  canCraftFormation,
  FORMATION_QUALITY_CONFIG,
  ARRAY_REFORGE_CONFIG,
  canReforgeArrayDisc,
  getAvailableHighTierOreQuantity,
} from '@/lib/formation-logic';
import { checkArtisanCraftRequirement, checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';

export type FormationSubTab = 'crafting' | 'active' | 'inventory' | 'reforge';

export interface FormationTabProps {
  player: PlayerStats;
  formationSubTab: FormationSubTab;
  setFormationSubTab: (tab: FormationSubTab) => void;
  selectedRecipeId: string | null;
  setSelectedRecipeId: (id: string | null) => void;
  isCrafting: boolean;
  handleCraftFormation: (recipeId: string) => void;
  handleEquipFormation: (formationId: string) => void;
  handleUnequipFormation: () => void;
  handleDismantleFormation: (formationId: string) => void;
  artisan: FormationArtisan;
  formationInventory: FormationItem[];
  setActiveTab?: (tab: any) => void;
  // Trùng Chú Props
  isReforging?: boolean;
  selectedReforgeTargetId?: string | null;
  setSelectedReforgeTargetId?: (id: string | null) => void;
  selectedReforgeType?: ArrayReforgeType;
  setSelectedReforgeType?: (type: ArrayReforgeType) => void;
  handleReforgeArray?: (targetId: string, reforgeType: ArrayReforgeType) => void;
}

// ── Helpers ───────────────────────────────────────────────────
const QualityBadge: React.FC<{ quality: string }> = ({ quality }) => {
  const cfg = FORMATION_QUALITY_CONFIG[quality as keyof typeof FORMATION_QUALITY_CONFIG];
  if (!cfg) return null;
  return (
    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${cfg.color} bg-black/40 border-current/30`}>
      {cfg.label}
    </span>
  );
};

const ElementBadge: React.FC<{ element: string }> = ({ element }) => {
  const cfg = FORMATION_ELEMENT_CONFIG[element];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded border font-mono ${cfg.color} ${cfg.bg}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ── Sub-tab: Khắc Trận Bàn ───────────────────────────────────
const CraftingAltarTab: React.FC<FormationTabProps & { unlock: () => void }> = ({
  player, artisan, selectedRecipeId, setSelectedRecipeId,
  isCrafting, handleCraftFormation, setActiveTab, unlock,
}) => {
  const availableRecipes = getAvailableFormationRecipes(artisan.level);
  const allByTier = [1,2,3,4,5,6,7,8,9].map(tier => ({
    tier,
    recipes: availableRecipes.filter(r => r.tier === tier),
    locked: FORMATION_RECIPES.filter(r => r.tier === tier && r.requiredArtisanLevel > artisan.level),
  }));

  const selected = FORMATION_RECIPES.find(r => r.id === selectedRecipeId);
  const { ok: canCraft, missing } = selected ? canCraftFormation(player, selected) : { ok: false, missing: [] };

  if (!player.formationArtisan?.learnedRecipeIds?.length && !player.formationArtisan) {
    // Hiển thị màn unlock nếu chưa có artisan
    return (
      <div className="p-6 text-center space-y-4 rounded-xl bg-gradient-to-b from-[#0d0c14] to-[#07080c] border border-indigo-900/40">
        <div className="w-14 h-14 mx-auto rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Lock className="w-7 h-7 text-indigo-400" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-serif font-bold text-indigo-200">Chưa Khai Ngộ Trận Đạo</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Trận Pháp Các — nơi khắc chế Trận Bàn & Trận Kỳ bí truyền. Muốn bước vào, cần lĩnh ngộ{' '}
            <span className="text-indigo-300 font-semibold">[Hỗn Nguyên Trận Đồ Tàn Quyển]</span> từ Vạn Bảo Thương Hội.
          </p>
        </div>
        <button
          onClick={() => setActiveTab?.('merchant')}
          className="w-full py-2 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-serif text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Đến Vạn Bảo Thương Hội Tầm Bảo →</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Bàn Khắc Bát Quái — Center Altar */}
      <div className="relative bg-gradient-to-b from-indigo-950/40 via-purple-950/30 to-[#0a0a14] p-3 rounded-xl border border-indigo-800/40 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span className="text-[80px] select-none">☯</span>
        </div>
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-600/40 flex items-center justify-center text-base shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            🌀
          </div>
          <div>
            <div className="text-[11px] font-serif font-bold text-indigo-300">TRẬN ĐẠO KHẮC ẤN ĐÀI</div>
            <div className="text-[10px] text-zinc-400">{artisan.totalCrafted || 0} lần khắc chế</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] text-indigo-400 font-serif font-bold">{FORMATION_ARTISAN_RANKS.find(r => r.level === artisan.level)?.title}</div>
            <div className="text-[9px] text-zinc-500">EXP: {artisan.exp}/{artisan.maxExp}</div>
          </div>
        </div>
        {/* Thanh EXP */}
        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.floor((artisan.exp / artisan.maxExp) * 100))}%` }}
          />
        </div>
        {(() => {
          const promoCheck = checkArtisanPromotionRequirement(player.currentRealm || 0, artisan.level);
          const isExpFull = artisan.exp >= artisan.maxExp;
          if (promoCheck.isLockedByRealm && isExpFull) {
            return (
              <div className="mt-2 text-[10px] py-1 px-2 rounded bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-serif text-center flex items-center justify-center gap-1 animate-pulse">
                <span>{promoCheck.reason}</span>
              </div>
            );
          }
          return null;
        })()}
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {/* Danh sách Trận Đồ bên trái */}
        <div className="col-span-3 space-y-1.5 max-h-[340px] overflow-y-auto pr-0.5 custom-scrollbar">
          {allByTier.map(({ tier, recipes, locked }) => (
            <div key={tier}>
              {(recipes.length > 0 || locked.length > 0) && (
                <div className="text-[9px] text-zinc-500 font-serif mb-1 px-1 flex items-center gap-1">
                  <span className="text-indigo-400 font-bold">{['Nhất','Nhị','Tam','Tứ','Ngũ','Lục'][tier-1]} Giai</span>
                  {locked.length > 0 && <span className="text-zinc-600">• {locked.length} trận đồ khóa</span>}
                </div>
              )}
              {recipes.map(recipe => {
                const elCfg = FORMATION_ELEMENT_CONFIG[recipe.element];
                const typeCfg = FORMATION_TYPE_CONFIG[recipe.type];
                const isSelected = selectedRecipeId === recipe.id;
                const recipeCraftCheck = checkArtisanCraftRequirement(player.currentRealm || 0, recipe.tier);
                return (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(isSelected ? null : recipe.id)}
                    className={`w-full text-left p-2 rounded-lg border transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.25)]'
                        : 'bg-black/30 border-zinc-800/50 hover:border-indigo-700/40 hover:bg-indigo-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{elCfg?.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-serif font-bold truncate flex items-center gap-1 ${isSelected ? 'text-indigo-200' : 'text-zinc-300'}`}>
                          <span>{recipe.name}</span>
                          {recipeCraftCheck.isLockedByRealm && (
                            <span className="text-[8px] px-1 py-0.2 bg-red-950/60 text-red-300 border border-red-800/50 rounded font-mono shrink-0">
                              🔒 Cần đạt [{recipeCraftCheck.requiredRealmName}]
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[8px] ${typeCfg?.color}`}>{typeCfg?.icon} {typeCfg?.label}</span>
                          <span className="text-[8px] text-zinc-600">•</span>
                          <span className="text-[8px] text-amber-500">{recipe.linhThachCost} LS</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Panel chi tiết bên phải */}
        <div className="col-span-2 space-y-2">
          {selected ? (
            <>
              <div className="bg-black/40 p-2 rounded-lg border border-indigo-800/30 space-y-1.5">
                <div className="text-[10px] font-serif font-bold text-indigo-200">{selected.name}</div>
                <ElementBadge element={selected.element} />
                <p className="text-[9px] text-zinc-400 leading-relaxed">{selected.description}</p>
                <p className="text-[8px] text-indigo-300/70 italic font-serif line-clamp-2">"{selected.lore}"</p>
              </div>
              <div className="bg-black/30 p-2 rounded-lg border border-zinc-800/50 space-y-1">
                <div className="text-[9px] text-zinc-400 font-serif">Nguyên Liệu:</div>
                {selected.requiredMaterials.map(mat => {
                  const owned = (player.inventory?.ores || []).find(o => o.id === mat.itemId);
                  const qty = owned?.quantity || 0;
                  const enough = qty >= mat.quantity;
                  return (
                    <div key={mat.itemId} className={`text-[9px] flex justify-between ${enough ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <span className="truncate">{mat.name}</span>
                      <span className="shrink-0 ml-1">{qty}/{mat.quantity}</span>
                    </div>
                  );
                })}
                <div className={`text-[9px] flex justify-between ${(player.linhThach || 0) >= selected.linhThachCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span>Linh Thạch</span>
                  <span>{player.linhThach || 0}/{selected.linhThachCost}</span>
                </div>
                <div className="text-[9px] text-zinc-500 flex justify-between">
                  <span>Tỉ lệ thành công</span>
                  <span className="text-indigo-300">{Math.min(95, selected.baseSuccessRate + artisan.level * 4)}%</span>
                </div>
              </div>
              {(() => {
                const selectedCraftCheck = checkArtisanCraftRequirement(player.currentRealm || 0, selected.tier);
                return (
                  <>
                    <button
                      onClick={() => handleCraftFormation(selected.id)}
                      disabled={!canCraft || isCrafting || selectedCraftCheck.isLockedByRealm}
                      className={`w-full py-2 rounded-lg font-serif text-[10px] font-bold transition flex items-center justify-center gap-1.5 ${
                        selectedCraftCheck.isLockedByRealm
                          ? 'bg-zinc-900 border border-red-900/50 text-red-400/80 cursor-not-allowed'
                          : canCraft && !isCrafting
                          ? 'bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 hover:brightness-110 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)] cursor-pointer animate-pulse'
                          : 'bg-zinc-800/40 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {selectedCraftCheck.isLockedByRealm ? (
                        <><Lock className="w-3.5 h-3.5 text-red-400" /><span>🔒 Cần đạt [{selectedCraftCheck.requiredRealmName}]</span></>
                      ) : isCrafting ? (
                        <><Sparkles className="w-3.5 h-3.5 animate-spin" /><span>Đang Khắc Đạo Văn...</span></>
                      ) : (
                        <><Sparkles className="w-3.5 h-3.5" /><span>Khắc Họa Đạo Văn</span></>
                      )}
                    </button>
                    {!canCraft && missing[0] && (
                      <div className="text-[9px] text-rose-400 text-center">{missing[0]}</div>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-3">
              <p className="text-[10px] text-zinc-500 font-serif italic">← Chọn Trận Đồ để xem chi tiết và khắc ấn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Sub-tab: Bản Mệnh Trận ────────────────────────────────────
const ActiveArrayTab: React.FC<FormationTabProps> = (props) => {
  const { player, handleEquipFormation, handleUnequipFormation, setSelectedReforgeTargetId, setFormationSubTab } = props;
  const equipped = player.equippedFormation;
  const elCfg = equipped ? FORMATION_ELEMENT_CONFIG[equipped.element] : null;
  const typeCfg = equipped ? FORMATION_TYPE_CONFIG[equipped.type] : null;

  return (
    <div className="space-y-3">
      {/* Khe Bản Mệnh */}
      <div className={`p-3 rounded-xl border-2 transition relative overflow-hidden ${
        equipped
          ? equipped.isPermanent
            ? 'bg-gradient-to-br from-amber-950/40 via-purple-950/40 to-[#0a0a14] border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.35)]'
            : 'bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-[#0a0a14] border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
          : 'bg-[#0d0c14] border-dashed border-zinc-700/50'
      }`}>
        {equipped && (
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-[80px]">☯</div>
        )}
        <div className="text-[10px] text-zinc-400 font-serif mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 font-bold">KHE XUẤT CHIẾN BẢN MỆNH</span>
          </div>
          {equipped?.isPermanent && (
            <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-amber-400 text-amber-300 bg-amber-950/80 shadow-[0_0_10px_rgba(251,191,36,0.4)] animate-pulse font-bold">
              ✨ BẤT HỦ VĨNH VIỄN
            </span>
          )}
        </div>

        {equipped ? (
          <div className="space-y-2 relative z-10">
            <div className="flex items-start gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-[0_0_16px_rgba(99,102,241,0.4)] shrink-0 ${elCfg?.bg}`}>
                {elCfg?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-serif font-bold text-indigo-200 truncate">{equipped.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <QualityBadge quality={equipped.quality} />
                  <ElementBadge element={equipped.element} />
                  {equipped.isPermanent && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-amber-400/80 text-amber-300 bg-amber-950/60">
                      ✨ Bất Hủ
                    </span>
                  )}
                  {equipped.reforgeTier === 2 && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-cyan-400/80 text-cyan-300 bg-cyan-950/60 font-bold">
                      ⚡ Tột Đỉnh (+35%)
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded border font-serif shrink-0 ${typeCfg?.color} border-current/30 bg-black/30`}>
                {typeCfg?.label}
              </span>
            </div>

            {/* Chỉ số tĩnh */}
            <div className="bg-black/40 p-2 rounded-lg border border-indigo-900/40 grid grid-cols-2 gap-1 text-[10px] font-mono">
              {equipped.statBonus.atk > 0 && <div className="text-rose-300">⚔️ Công +{equipped.statBonus.atk}</div>}
              {equipped.statBonus.def > 0 && <div className="text-blue-300">🛡️ Thủ +{equipped.statBonus.def}</div>}
              {equipped.statBonus.hp > 0 && <div className="text-emerald-300">❤️ HP +{equipped.statBonus.hp}</div>}
              {equipped.statBonus.critRate > 0 && <div className="text-amber-300">💥 Bạo Kích +{equipped.statBonus.critRate}%</div>}
              {equipped.statBonus.critDmg > 0 && <div className="text-orange-300">🎯 Bạo Thương +{equipped.statBonus.critDmg}%</div>}
              {equipped.statBonus.speed > 0 && <div className="text-cyan-300">⚡ Tốc +{equipped.statBonus.speed}</div>}
              {equipped.statBonus.dmgReduction > 0 && <div className="text-purple-300">🔮 Giảm ST {equipped.statBonus.dmgReduction}%</div>}
              {equipped.combatBuff.hpRegenPercent && equipped.combatBuff.hpRegenPercent > 0 && (
                <div className="col-span-2 text-teal-300">💧 Hồi {equipped.combatBuff.hpRegenPercent}% HP/đòn</div>
              )}
            </div>

            {/* Hiệu ứng kích hoạt */}
            <div className="bg-indigo-950/40 p-2 rounded-lg border border-indigo-700/30">
              <div className="text-[9px] text-indigo-400 font-serif font-bold mb-1">🌀 Hiệu Ứng Kích Hoạt:</div>
              <p className="text-[10px] text-indigo-200 leading-relaxed">{equipped.combatBuff.triggerEffectDescription}</p>
              <div className="text-[9px] font-mono mt-1 flex justify-between items-center">
                <span className={equipped.isPermanent ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                  {equipped.isPermanent ? '🛡️ Độ bền: ✨ Vĩnh Cửu (Bất Hoại)' : `Độ bền: ${equipped.durability}/${equipped.maxDurability}`}
                </span>
                {equipped.offlineAbsorptionBonus && equipped.offlineAbsorptionBonus > 0 && (
                  <span className="text-cyan-300">⚡ Bế quan ngoại tuyến: +{Math.round(equipped.offlineAbsorptionBonus * 100)}%</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUnequipFormation}
                className="flex-1 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 border border-zinc-700/50 text-[10px] font-serif transition cursor-pointer"
              >
                Tháo Gỡ Trận Bàn
              </button>
              {equipped.tier === 9 && (
                <button
                  onClick={() => {
                    setSelectedReforgeTargetId?.(equipped.id);
                    setFormationSubTab('reforge');
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-orange-600 hover:brightness-110 text-white border border-amber-500/50 text-[10px] font-serif font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-200" />
                  <span>{equipped.isPermanent ? '⚡ Thăng Hoa Tột Đỉnh' : '🔥 Trùng Chú Bất Hủ'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <div className="text-3xl opacity-20">☯</div>
            <p className="text-[10px] text-zinc-500 font-serif italic">Chưa trang bị Trận Bàn Bản Mệnh nào.</p>
            <p className="text-[9px] text-zinc-600">Vào tab Kho Trận Bàn để chọn trang bị.</p>
          </div>
        )}
      </div>

      {/* Gợi ý nhanh từ kho */}
      {props.formationInventory.length > 0 && !equipped && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-zinc-400 font-serif">Trận Bàn Sẵn Có:</div>
          {props.formationInventory.slice(0, 3).map(f => {
            const eCfg = FORMATION_ELEMENT_CONFIG[f.element];
            return (
              <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-zinc-800/50">
                <span className="text-base">{eCfg?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-serif font-bold text-zinc-300 truncate">{f.name}</div>
                  <QualityBadge quality={f.quality} />
                </div>
                <button
                  onClick={() => handleEquipFormation(f.id)}
                  className="text-[9px] px-2 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white font-serif font-bold cursor-pointer shrink-0"
                >
                  Trang Bị
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Sub-tab: Kho Trận Bàn ─────────────────────────────────────
const InventoryTab: React.FC<FormationTabProps> = ({
  player, formationInventory, handleEquipFormation, handleUnequipFormation, handleDismantleFormation,
  setSelectedReforgeTargetId, setFormationSubTab,
}) => {
  if (formationInventory.length === 0) {
    return (
      <div className="py-10 text-center space-y-2">
        <Package className="w-10 h-10 text-zinc-600 mx-auto" />
        <p className="text-[11px] text-zinc-500 font-serif italic">Kho Trận Bàn còn trống.</p>
        <p className="text-[10px] text-zinc-600">Sang tab Khắc Trận để chế tác Trận Bàn đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {formationInventory.map(f => {
        const eCfg = FORMATION_ELEMENT_CONFIG[f.element];
        const tCfg = FORMATION_TYPE_CONFIG[f.type];
        const isEquipped = player.equippedFormation?.id === f.id;
        return (
          <div
            key={f.id}
            className={`p-2.5 rounded-lg border transition ${
              f.isPermanent
                ? 'bg-gradient-to-r from-amber-950/30 via-[#100e18] to-purple-950/30 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : isEquipped
                ? 'bg-indigo-950/40 border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                : 'bg-[#0e0e14] border-zinc-800/50'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl shrink-0">{eCfg?.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-serif font-bold text-zinc-200 truncate">{f.name}</span>
                  {isEquipped && <span className="text-[8px] text-indigo-300 bg-indigo-900/50 px-1 rounded border border-indigo-600/40">Đang Trang Bị</span>}
                  {f.isPermanent && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-amber-400 text-amber-300 bg-amber-950/60 font-bold animate-pulse">
                      ✨ Bất Hủ
                    </span>
                  )}
                  {f.reforgeTier === 2 && (
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-cyan-400 text-cyan-300 bg-cyan-950/60 font-bold">
                      ⚡ Tột Đỉnh
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <QualityBadge quality={f.quality} />
                  <ElementBadge element={f.element} />
                  <span className={`text-[8px] font-serif ${tCfg?.color}`}>{tCfg?.icon} {tCfg?.label}</span>
                </div>
                {/* Stats nhanh */}
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1">
                  {f.statBonus.atk > 0 && <span className="text-[9px] text-rose-300">ATK+{f.statBonus.atk}</span>}
                  {f.statBonus.def > 0 && <span className="text-[9px] text-blue-300">DEF+{f.statBonus.def}</span>}
                  {f.statBonus.hp > 0 && <span className="text-[9px] text-emerald-300">HP+{f.statBonus.hp}</span>}
                  {f.statBonus.critDmg > 0 && <span className="text-[9px] text-amber-300">暴傷+{f.statBonus.critDmg}%</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                {isEquipped ? (
                  <button
                    onClick={handleUnequipFormation}
                    className="text-[9px] px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-serif cursor-pointer"
                  >
                    Tháo
                  </button>
                ) : (
                  <button
                    onClick={() => handleEquipFormation(f.id)}
                    className="text-[9px] px-2 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white font-serif font-bold cursor-pointer"
                  >
                    Trang Bị
                  </button>
                )}
                {f.tier === 9 && (
                  <button
                    onClick={() => {
                      setSelectedReforgeTargetId?.(f.id);
                      setFormationSubTab('reforge');
                    }}
                    className="text-[9px] px-2 py-1 rounded bg-gradient-to-r from-amber-700 to-orange-600 hover:brightness-110 text-white font-serif font-bold cursor-pointer flex items-center justify-center gap-0.5"
                  >
                    <Flame className="w-2.5 h-2.5" />
                    <span>Trùng Chú</span>
                  </button>
                )}
                <button
                  onClick={() => handleDismantleFormation(f.id)}
                  className="text-[9px] px-2 py-1 rounded bg-red-950/50 hover:bg-red-900/50 text-red-400 border border-red-800/30 font-serif cursor-pointer"
                >
                  Phân Giải
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[9px]">
              <span className="text-indigo-300/80 italic font-serif truncate max-w-[200px]">
                {f.combatBuff.triggerEffectDescription}
              </span>
              <span className={f.isPermanent ? 'text-amber-300 font-bold font-mono' : 'text-zinc-500 font-mono'}>
                {f.isPermanent ? '✨ Bất Hủ Vĩnh Viễn' : `Độ bền: ${f.durability}/${f.maxDurability}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Sub-tab: Trùng Chú Trận Bàn Bất Hủ ─────────────────────────
const ReforgeAltarTab: React.FC<FormationTabProps> = ({
  player, artisan, isReforging, selectedReforgeTargetId, setSelectedReforgeTargetId,
  selectedReforgeType = 'permanence', setSelectedReforgeType, handleReforgeArray, setActiveTab, setFormationSubTab,
}) => {
  // Tập hợp danh sách các trận bàn Cửu Giai khả dụng
  const eligibleArrays: {
    id: string;
    name: string;
    tier: number;
    quality?: string;
    element?: string;
    isPermanent?: boolean;
    reforgeTier: number;
    offlineAbsorptionBonus?: number;
    source: 'inventory' | 'equipped' | 'active_buff';
  }[] = [];

  // 1. Kho đồ
  (player.inventory?.formations || []).forEach((f: FormationItem) => {
    if (f.tier === 9) {
      eligibleArrays.push({
        id: f.id,
        name: f.name,
        tier: f.tier,
        quality: f.quality,
        element: f.element,
        isPermanent: Boolean(f.isPermanent),
        reforgeTier: f.reforgeTier || 0,
        offlineAbsorptionBonus: f.offlineAbsorptionBonus || 0,
        source: 'inventory',
      });
    }
  });

  // 2. Đang trang bị
  if (player.equippedFormation && player.equippedFormation.tier === 9) {
    if (!eligibleArrays.some(a => a.id === player.equippedFormation!.id)) {
      eligibleArrays.push({
        id: player.equippedFormation.id,
        name: player.equippedFormation.name,
        tier: player.equippedFormation.tier,
        quality: player.equippedFormation.quality,
        element: player.equippedFormation.element,
        isPermanent: Boolean(player.equippedFormation.isPermanent),
        reforgeTier: player.equippedFormation.reforgeTier || 0,
        offlineAbsorptionBonus: player.equippedFormation.offlineAbsorptionBonus || 0,
        source: 'equipped',
      });
    }
  }

  // 3. Trận bàn tụ linh đang vận hành
  (player.cultivationBuffState?.activeArrays || []).forEach(arr => {
    const isT9 = arr.itemId.includes('t9') || arr.name.includes('Cửu') || arr.tuViSpeedPercent >= 75;
    if (isT9 && !eligibleArrays.some(a => a.id === arr.itemId)) {
      eligibleArrays.push({
        id: arr.itemId,
        name: arr.name,
        tier: 9,
        isPermanent: Boolean(arr.isPermanent),
        reforgeTier: arr.reforgeTier || 0,
        offlineAbsorptionBonus: arr.offlineAbsorptionBonus || 0,
        source: 'active_buff',
      });
    }
  });

  const activeTargetId = selectedReforgeTargetId || eligibleArrays[0]?.id || null;
  const activeRoute = selectedReforgeType || 'permanence';
  const recipe = ARRAY_REFORGE_CONFIG[activeRoute];

  const check = activeTargetId ? canReforgeArrayDisc(player, activeTargetId, activeRoute) : { eligible: false, reason: 'Chưa chọn trận bàn.' };

  const currentRealm = player.currentRealm || 0;
  const hasRealm = currentRealm >= recipe.requiredRealmIndex;
  const hasArtisan = (artisan.level || 1) >= recipe.requiredArtisanLevel;
  const oreCostDef = recipe.costs.find(c => c.type === 'ore');
  const oreInfo = getAvailableHighTierOreQuantity(player, oreCostDef?.itemId);

  return (
    <div className="space-y-3">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-indigo-950/60 p-3 rounded-xl border border-amber-600/40 overflow-hidden">
        <div className="absolute right-2 top-0 text-7xl opacity-5 pointer-events-none font-bold text-amber-300">煉</div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-amber-900/60 border border-amber-500/50 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            🔥
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-amber-200">LÒ THĂNG HOA TRẬN ĐẠO • TRÙNG CHÚ BẤT HỦ</div>
            <p className="text-[9px] text-zinc-400 mt-0.5">
              Dẫn linh hỏa thượng giới luyện hóa Trận Bàn Cửu Giai thành trạng thái Bất Hủ Vĩnh Viễn & Tột Đỉnh Hấp Thu.
            </p>
          </div>
        </div>
      </div>

      {/* Target Array Selection */}
      <div className="space-y-1.5">
        <div className="text-[10px] text-zinc-400 font-serif flex items-center justify-between">
          <span>Chọn Trận Bàn Cửu Giai Trùng Chú:</span>
          <span className="text-[9px] text-amber-400">{eligibleArrays.length} trận bàn khả dụng</span>
        </div>

        {eligibleArrays.length === 0 ? (
          <div className="p-4 rounded-xl bg-black/30 border border-zinc-800/60 text-center space-y-2">
            <p className="text-[10px] text-zinc-400 font-serif">Chưa sở hữu Trận Bàn Cửu Giai nào trong Động Phủ hoặc Túi Đồ.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setFormationSubTab('crafting')}
                className="text-[9px] px-2.5 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800/70 border border-indigo-700/50 text-indigo-200 font-serif cursor-pointer"
              >
                ← Đến Khắc Trận Cửu Giai
              </button>
              <button
                onClick={() => setActiveTab?.('merchant')}
                className="text-[9px] px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/70 border border-amber-700/50 text-amber-200 font-serif cursor-pointer"
              >
                Vạn Bảo Thương Hội →
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {eligibleArrays.map(item => {
              const isSelected = item.id === activeTargetId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedReforgeTargetId?.(item.id)}
                  className={`p-2 rounded-lg border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/70 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                      : 'bg-black/40 border-zinc-800/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-serif font-bold text-zinc-200 truncate">{item.name}</span>
                      {item.isPermanent && (
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-amber-400/80 text-amber-300 bg-amber-950/60">
                          ✨ Bất Hủ
                        </span>
                      )}
                      {item.reforgeTier === 2 && (
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-cyan-400/80 text-cyan-300 bg-cyan-950/60">
                          ⚡ Tột Đỉnh
                        </span>
                      )}
                    </div>
                    <div className="text-[8px] text-zinc-500 mt-0.5">
                      {item.source === 'equipped' && '⚔️ Đang trang bị Bản Mệnh'}
                      {item.source === 'active_buff' && '🌀 Đang vận hành tụ linh'}
                      {item.source === 'inventory' && '📦 Trong kho trận bàn'}
                    </div>
                  </div>
                  {isSelected && <span className="text-amber-400 text-xs">●</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Route Switcher (Permanence vs Max Efficiency) */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => setSelectedReforgeType?.('permanence')}
          className={`p-2 rounded-xl border text-left transition cursor-pointer ${
            activeRoute === 'permanence'
              ? 'bg-gradient-to-r from-amber-950/50 to-purple-950/50 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-black/30 border-zinc-800/60 hover:border-zinc-700 text-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-serif font-bold text-amber-300">✨ Lộ Trình 1: Bất Hủ Hóa</span>
            <span className="text-[8px] font-mono text-zinc-500">Bậc 1</span>
          </div>
          <div className="text-[9px] text-zinc-400 mt-0.5">Thời hạn Vĩnh Viễn, không bao giờ tiêu hao</div>
        </button>

        <button
          onClick={() => setSelectedReforgeType?.('max_efficiency')}
          className={`p-2 rounded-xl border text-left transition cursor-pointer ${
            activeRoute === 'max_efficiency'
              ? 'bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'bg-black/30 border-zinc-800/60 hover:border-zinc-700 text-zinc-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-serif font-bold text-cyan-300">⚡ Lộ Trình 2: Tột Đỉnh Hấp Thu</span>
            <span className="text-[8px] font-mono text-zinc-500">Bậc 2</span>
          </div>
          <div className="text-[9px] text-zinc-400 mt-0.5">+35% Tốc độ tu vi bế quan ngoại tuyến</div>
        </button>
      </div>

      {/* Before & After Comparison Card */}
      <div className="p-3 rounded-xl bg-gradient-to-b from-[#0c0c16] to-[#07070d] border border-indigo-900/40 space-y-2">
        <div className="text-[10px] font-serif font-bold text-indigo-300 flex items-center justify-between">
          <span>🔮 So Sánh Hiệu Quả Trước & Sau Trùng Chú:</span>
          <span className="text-[9px] text-zinc-500 font-mono">{recipe.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-lg bg-black/40 border border-zinc-800/50 space-y-1">
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Trạng Thái Ban Đầu</div>
            <div className="text-zinc-300">⏱️ Thời hạn: <span className="text-amber-400">72 Giờ (Tiêu hao)</span></div>
            <div className="text-zinc-300">⚡ Tốc độ ngoại tuyến: <span className="text-zinc-400">100% Cơ bản</span></div>
            <div className="text-zinc-300">🛡️ Độ bền: <span className="text-zinc-400">30 / 30 (Giảm dần)</span></div>
          </div>

          <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-700/50 space-y-1">
            <div className="text-[9px] text-indigo-300 uppercase tracking-wider font-bold">Thăng Hoa Sau Trùng Chú</div>
            <div className="text-emerald-300">
              ⏱️ Thời hạn:{' '}
              <span className="text-amber-300 font-bold">✨ VĨNH VIỄN (BẤT HỦ)</span>
            </div>
            <div className="text-cyan-300">
              ⚡ Ngoại tuyến:{' '}
              <span className="text-cyan-200 font-bold">
                {activeRoute === 'max_efficiency' ? '⚡ 135% (+35% Thần Tốc)' : '100% (Bảo toàn)'}
              </span>
            </div>
            <div className="text-teal-300">
              🛡️ Độ bền: <span className="font-bold">Bất Hoại (Vô Hạn)</span>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-zinc-400 italic font-serif leading-relaxed">
          {recipe.description}
        </p>
      </div>

      {/* Resource Meters & Gate Checks */}
      <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/60 space-y-2">
        <div className="text-[10px] font-serif font-bold text-zinc-300">Nguyên Liệu Tiêu Hao & Điều Kiện Trùng Chú:</div>

        {/* Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {/* Linh Thach */}
          {(() => {
            const ltCost = recipe.costs.find(c => c.type === 'linhThach')?.amount || 0;
            const ltOwned = player.linhThach || 0;
            const enough = ltOwned >= ltCost;
            return (
              <div className={`p-2 rounded-lg border ${enough ? 'border-zinc-800 bg-zinc-950/40 text-emerald-300' : 'border-rose-900/60 bg-rose-950/20 text-rose-300'}`}>
                <div className="text-[9px] text-zinc-500">Cực Phẩm Linh Thạch</div>
                <div className="text-xs font-mono font-bold mt-0.5">
                  {Math.floor(ltOwned / 1000000)}M / {Math.floor(ltCost / 1000000)}M
                </div>
              </div>
            );
          })()}

          {/* Forging Essence */}
          {(() => {
            const esCost = recipe.costs.find(c => c.type === 'forgingEssence')?.amount || 0;
            const esOwned = player.inventory?.forgingEssence || 0;
            const enough = esOwned >= esCost;
            return (
              <div className={`p-2 rounded-lg border ${enough ? 'border-zinc-800 bg-zinc-950/40 text-amber-300' : 'border-rose-900/60 bg-rose-950/20 text-rose-300'}`}>
                <div className="text-[9px] text-zinc-500">Tinh Hoa Rèn Đúc</div>
                <div className="text-xs font-mono font-bold mt-0.5">
                  {(esOwned || 0).toLocaleString()} / {esCost.toLocaleString()}
                </div>
              </div>
            );
          })()}

          {/* Divine Ore */}
          {(() => {
            const oreCost = oreCostDef?.amount || 0;
            const enough = (oreInfo?.quantity || 0) >= oreCost;
            return (
              <div className={`p-2 rounded-lg border ${enough ? 'border-zinc-800 bg-zinc-950/40 text-cyan-300' : 'border-rose-900/60 bg-rose-950/20 text-rose-300'}`}>
                <div className="text-[9px] text-zinc-500">Thần Thiết / Hư Không Thạch</div>
                <div className="text-xs font-mono font-bold mt-0.5">
                  {oreInfo?.quantity || 0} / {oreCost}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Gate Requirements */}
        <div className="space-y-1 pt-1">
          <div className={`text-[9px] flex items-center justify-between ${hasRealm ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>Cảnh giới yêu cầu: [{recipe.requiredRealmName}]</span>
            <span>{hasRealm ? '✓ Đạt' : `🔒 Cần đạt Realm ${recipe.requiredRealmIndex}`}</span>
          </div>
          <div className={`text-[9px] flex items-center justify-between ${hasArtisan ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>Trận Pháp Sư: [{recipe.requiredArtisanTitle}]</span>
            <span>{hasArtisan ? '✓ Đạt' : `🔒 Cần Cấp ${recipe.requiredArtisanLevel}`}</span>
          </div>
        </div>

        {/* Warning reason if ineligible */}
        {!check.eligible && check.reason && (
          <div className="text-[9px] text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-900/50 text-center font-serif">
            ⚠️ {check.reason}
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={() => {
            if (activeTargetId && handleReforgeArray) {
              handleReforgeArray(activeTargetId, activeRoute);
            }
          }}
          disabled={!check.eligible || isReforging}
          className={`w-full py-2.5 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            isReforging
              ? 'bg-amber-900 text-amber-200 cursor-wait'
              : check.eligible
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:brightness-110 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer animate-pulse'
              : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isReforging ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Đang Dẫn Linh Hỏa Trùng Chú...</span>
            </>
          ) : (
            <>
              <span>🔥</span>
              <span>Khởi Động Lò Luyện Trùng Chú Bất Hủ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────
export const FormationTab: React.FC<FormationTabProps> = (props) => {
  const { formationSubTab, setFormationSubTab, artisan, player } = props;

  const SUB_TABS: { key: FormationSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'crafting',  label: 'Khắc Trận',      icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'active',    label: 'Bản Mệnh',        icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'inventory', label: 'Kho Trận',        icon: <Package className="w-3.5 h-3.5" /> },
    { key: 'reforge',   label: '🔥 Trùng Chú',    icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  return (
    <div className="space-y-3">
      {/* HEADER — Danh xưng Trận Sư */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-[#0a0a14] p-2.5 rounded-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute right-2 top-1 text-6xl opacity-5 pointer-events-none font-bold text-indigo-400">陣</div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-900/70 border border-indigo-600/50 flex items-center justify-center text-base shadow-[0_0_10px_rgba(99,102,241,0.4)]">
            🌀
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[11px] font-serif font-bold ${FORMATION_ARTISAN_RANKS.find(r => r.level === artisan.level)?.color || 'text-indigo-300'}`}>
              {FORMATION_ARTISAN_RANKS.find(r => r.level === artisan.level)?.title || 'Nhất Giai • Trận Đồ Sơ Học'}
            </div>
            <div className="text-[9px] text-zinc-500 mt-0.5">
              {props.formationInventory.length} Trận Bàn • {artisan.learnedRecipeIds.length}/{FORMATION_RECIPES.length} Trận Đồ đã lĩnh ngộ
            </div>
          </div>
          {player.equippedFormation && (
            <div className="text-[9px] text-indigo-300 bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-700/40 font-serif text-right">
              <div>Bản Mệnh:</div>
              <div className="font-bold truncate max-w-[80px]">{player.equippedFormation.name}</div>
            </div>
          )}
        </div>
        {/* EXP Bar */}
        <div className="mt-2 space-y-0.5">
          <div className="flex justify-between text-[9px] text-zinc-500">
            <span>Trận Đạo EXP</span>
            <span>{artisan.exp}/{artisan.maxExp}</span>
          </div>
          <div className="h-1.5 bg-zinc-900/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.floor((artisan.exp / artisan.maxExp) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* SUB-TAB NAV */}
      <div className="grid grid-cols-4 gap-1">
        {SUB_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFormationSubTab(tab.key)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              formationSubTab === tab.key
                ? 'bg-indigo-800/40 text-indigo-200 border border-indigo-600/50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div>
        {formationSubTab === 'crafting' && (
          <CraftingAltarTab {...props} unlock={() => {}} />
        )}
        {formationSubTab === 'active' && (
          <ActiveArrayTab {...props} />
        )}
        {formationSubTab === 'inventory' && (
          <InventoryTab {...props} />
        )}
        {formationSubTab === 'reforge' && (
          <ReforgeAltarTab {...props} />
        )}
      </div>
    </div>
  );
};

