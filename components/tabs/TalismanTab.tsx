// components/tabs/TalismanTab.tsx
// Giao diện Phù Đạo Bách Nghệ • Phù Lục Các — Chu sa linh mặc, án thư cổ phong
import React, { useState } from 'react';
import { Sparkles, Scroll, Shield, Package, Zap, Flame, Compass, RefreshCw, CheckCircle, Info, Lock } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  TalismanItem,
  TalismanRecipe,
  TalismanArtisan,
  TalismanBeltSlot,
  TalismanType,
} from '@/lib/types/talisman';
import {
  TALISMAN_RECIPES,
  TALISMAN_ARTISAN_RANKS,
  getTalismanRecipeById,
} from '@/lib/talisman-data';
import { canCraftTalisman, TALISMAN_QUALITY_CONFIG } from '@/lib/talisman-logic';
import { checkArtisanCraftRequirement, checkArtisanPromotionRequirement } from '@/lib/artisan-lock-logic';

export type TalismanSubTab = 'crafting' | 'belt' | 'inventory';

export interface TalismanTabProps {
  player: PlayerStats;
  talismanSubTab: TalismanSubTab;
  setTalismanSubTab: (tab: TalismanSubTab) => void;
  selectedRecipeId: string | null;
  setSelectedRecipeId: (id: string | null) => void;
  craftCount: number;
  setCraftCount: (count: number) => void;
  isCrafting: boolean;
  artisan: TalismanArtisan;
  talismanInventory: TalismanItem[];
  equippedBelt: TalismanBeltSlot[];
  handleCraftTalisman: (recipeId?: string, count?: number) => void;
  handleEquipTalisman: (slotIndex: number, talismanId: string) => void;
  handleUnequipTalisman: (slotIndex: number) => void;
  handleUseUtilityTalisman: (talismanId: string) => void;
  setActiveTab?: (tab: any) => void;
}

// ── Badges ──────────────────────────────────────────────────
const TypeBadge: React.FC<{ type: TalismanType }> = ({ type }) => {
  if (type === 'combat') {
    return (
      <span className="text-[9px] font-serif px-1.5 py-0.5 rounded border border-rose-500/40 text-rose-300 bg-rose-950/40 inline-flex items-center gap-0.5">
        <Zap className="w-2.5 h-2.5" /> Chiến Đấu
      </span>
    );
  }
  if (type === 'breakthrough') {
    return (
      <span className="text-[9px] font-serif px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-300 bg-amber-950/40 inline-flex items-center gap-0.5">
        <Shield className="w-2.5 h-2.5" /> Đột Phá
      </span>
    );
  }
  return (
    <span className="text-[9px] font-serif px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-300 bg-cyan-950/40 inline-flex items-center gap-0.5">
      <Compass className="w-2.5 h-2.5" /> Phụ Trợ
    </span>
  );
};

// ── SUB-TAB 1: ÁN THƯ HỌA PHÙ (CRAFTING ALTAR) ───────────────
const CraftingAltarTab: React.FC<TalismanTabProps> = ({
  player,
  artisan,
  selectedRecipeId,
  setSelectedRecipeId,
  craftCount,
  setCraftCount,
  isCrafting,
  handleCraftTalisman,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const selectedRecipe: TalismanRecipe = getTalismanRecipeById(selectedRecipeId || 'recipe_giap_binh_phu') || TALISMAN_RECIPES[0];

  const filteredRecipes = TALISMAN_RECIPES.filter(r => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  const { ok: canCraft, missing } = canCraftTalisman(player, selectedRecipe, craftCount);

  // Tính tỷ lệ thành công hiển thị
  const thanThuc = player.thanThuc || player.tamCanh || 20;
  const successRate = Math.min(95, Math.max(25, selectedRecipe.baseSuccessRate + (artisan.level * 4) + Math.floor(thanThuc / 12)));

  return (
    <div className="space-y-3">
      {/* Án Thư Trung Tâm */}
      <div className="relative bg-gradient-to-b from-amber-950/30 via-red-950/20 to-[#0c0a0a] p-3 rounded-xl border border-amber-800/40 overflow-hidden shadow-inner">
        <div className="absolute right-2 top-0 text-7xl opacity-5 pointer-events-none select-none font-serif text-amber-500">
          符
        </div>

        <div className="flex items-start justify-between gap-2 border-b border-amber-900/30 pb-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-sm">✍️</span>
              <h3 className="font-serif font-bold text-sm text-amber-200">
                {selectedRecipe.name}
              </h3>
              <TypeBadge type={selectedRecipe.type} />
              <span className="text-[10px] text-zinc-500 font-mono">[{selectedRecipe.grade}]</span>
              {(() => {
                const req = checkArtisanCraftRequirement(player.currentRealm || 0, selectedRecipe.tier);
                if (req.isLockedByRealm) {
                  return (
                    <span className="text-[9px] px-1.5 py-0.2 bg-red-950/60 text-red-300 border border-red-800/50 rounded font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Cần đạt {req.requiredRealmName} để chế tác</span>
                    </span>
                  );
                }
                return null;
              })()}
            </div>
            <p className="text-[10.5px] text-zinc-400 mt-1 leading-relaxed">
              {selectedRecipe.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-zinc-400">Tỷ lệ thành công:</div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              ~{successRate}%
            </div>
            <div className="text-[9px] text-amber-400/80">
              (Thần Thức: +{Math.floor(thanThuc / 12)}%)
            </div>
          </div>
        </div>

        {/* Nguyên Liệu Yêu Cầu */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-serif text-zinc-400 flex items-center justify-between">
            <span>Nguyên Liệu Điểm Chu Sa:</span>
            <span className="text-zinc-500">Chi phí: {(selectedRecipe.linhThachCost * craftCount).toLocaleString()} Linh Thạch</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {selectedRecipe.requiredMaterials.map(mat => {
              const req = mat.quantity * craftCount;
              const inOres = (player.inventory?.ores || []).find(o => o.id === mat.itemId)?.quantity || 0;
              const inHerbs = (player.inventory?.herbs || []).find(h => h.id === mat.itemId)?.quantity || 0;
              const inBags = (player.inventory?.bags || []).find((b: any) => b.id === mat.itemId)?.quantity || 0;
              const owned = inOres + inHerbs + inBags;
              const hasEnough = owned >= req;

              return (
                <div
                  key={mat.itemId}
                  className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between ${
                    hasEnough
                      ? 'bg-zinc-900/60 border-zinc-700/50 text-zinc-300'
                      : 'bg-red-950/30 border-red-800/40 text-red-300'
                  }`}
                >
                  <span className="truncate">{mat.name}</span>
                  <span className="font-mono font-bold ml-1">
                    {owned}/{req}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bộ chọn số lượng & Nút Họa Phù */}
        <div className="mt-3 flex items-center gap-2">
          {/* Multiplier selector */}
          <div className="flex rounded-lg bg-zinc-900/80 border border-amber-900/40 p-0.5 shrink-0">
            {[1, 5, 10].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => setCraftCount(cnt)}
                className={`px-2 py-1 text-[10px] font-mono rounded cursor-pointer transition ${
                  craftCount === cnt
                    ? 'bg-amber-600 text-amber-100 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                x{cnt}
              </button>
            ))}
          </div>

          {/* Action button */}
          {(() => {
            const req = checkArtisanCraftRequirement(player.currentRealm || 0, selectedRecipe.tier);
            if (req.isLockedByRealm) {
              return (
                <button
                  type="button"
                  disabled
                  className="flex-1 py-2 px-3 rounded-lg font-serif text-xs font-bold bg-zinc-900 border border-red-900/50 text-red-400/80 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>🔒 Cần đạt [{req.requiredRealmName}]</span>
                </button>
              );
            }
            return (
              <button
                type="button"
                disabled={isCrafting || !canCraft}
                onClick={() => handleCraftTalisman(selectedRecipe.id, craftCount)}
                className={`flex-1 py-2 px-3 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                  isCrafting
                    ? 'bg-amber-900/40 text-amber-300/50 border border-amber-700/30 cursor-wait'
                    : canCraft
                    ? 'bg-gradient-to-r from-red-700 via-amber-600 to-red-700 hover:from-red-600 hover:to-amber-500 text-amber-100 border border-amber-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                    : 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/40 cursor-not-allowed'
                }`}
              >
                {isCrafting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Đang Điểm Chu Sa Họa Bùa...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>Chấp Bút Họa Phù (x{craftCount})</span>
                  </>
                )}
              </button>
            );
          })()}
        </div>

        {!canCraft && missing.length > 0 && (
          <div className="mt-2 text-[9.5px] text-red-400 flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0" />
            <span>{missing[0]}</span>
          </div>
        )}
      </div>

      {/* Bộ Lọc & Danh Sách Phù Đồ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-amber-900/20 pb-1">
          <span className="text-[11px] font-serif font-bold text-amber-200 flex items-center gap-1">
            <Scroll className="w-3.5 h-3.5 text-amber-400" /> Danh Mục Phù Đồ
          </span>
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'combat', label: 'Chiến Đấu' },
              { id: 'breakthrough', label: 'Đột Phá' },
              { id: 'utility', label: 'Phụ Trợ' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition ${
                  filterType === tab.id
                    ? 'bg-amber-800/60 text-amber-200 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300 bg-zinc-900/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
          {filteredRecipes.map(recipe => {
            const isSelected = recipe.id === selectedRecipeId;
            const isLocked = artisan.level < recipe.requiredArtisanLevel;
            const recipeCraftReq = checkArtisanCraftRequirement(player.currentRealm || 0, recipe.tier);

            return (
              <div
                key={recipe.id}
                onClick={() => !isLocked && setSelectedRecipeId(recipe.id)}
                className={`p-2 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/50 border-amber-500/70 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : isLocked
                    ? 'bg-zinc-950/40 border-zinc-800/40 opacity-50 cursor-not-allowed'
                    : 'bg-zinc-900/40 border-zinc-800/60 hover:border-amber-700/50 hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <div className="text-[11px] font-serif font-bold text-zinc-200 truncate flex items-center gap-1">
                      {isSelected && <span className="text-amber-400">✦</span>}
                      <span>{recipe.name}</span>
                      {recipeCraftReq.isLockedByRealm && (
                        <span className="text-[8px] px-1 py-0.2 bg-red-950/60 text-red-300 border border-red-800/50 rounded font-mono shrink-0">
                          🔒 Cần đạt [{recipeCraftReq.requiredRealmName}]
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      {recipe.grade} • Phù Sư Cấp {recipe.requiredArtisanLevel}
                    </div>
                  </div>
                  <TypeBadge type={recipe.type} />
                </div>

                <div className="text-[9.5px] text-zinc-400 mt-1 line-clamp-1">
                  {recipe.combatEffect?.description || recipe.breakthroughEffect?.description || recipe.utilityEffect?.description || recipe.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── SUB-TAB 2: PHÙ NANG BẢN MỆNH (EQUIPPED BELT) ───────────────
const EquippedBeltTab: React.FC<TalismanTabProps> = ({
  player,
  equippedBelt,
  talismanInventory,
  handleEquipTalisman,
  handleUnequipTalisman,
}) => {
  const [activeSlotToSelect, setActiveSlotToSelect] = useState<number | null>(null);

  // Lấy các Chiến Đấu Phù có thể trang bị
  const combatTalismans = talismanInventory.filter(t => t.type === 'combat' && t.quantity > 0);

  return (
    <div className="space-y-3">
      {/* 3 Ô Phù Nang Xuất Chiến */}
      <div className="p-3 rounded-xl bg-gradient-to-b from-amber-950/20 via-zinc-900/40 to-black/60 border border-amber-900/30">
        <div className="text-center mb-2.5">
          <h4 className="font-serif font-bold text-xs text-amber-200 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Phù Nang Bản Mệnh (Tối đa 3 Đạo Phù Xuất Chiến)</span>
          </h4>
          <p className="text-[9.5px] text-zinc-400 mt-0.5">
            Linh phù nạp vào bao da sẽ tự động kích hoạt khi giao tranh PVE / Trấn Ma Tháp / Boss Thế Giới.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(slotIdx => {
            const slot = equippedBelt.find(s => s.slotIndex === slotIdx);
            const equippedItem = slot?.talismanId
              ? talismanInventory.find(t => t.id === slot.talismanId || t.recipeId === slot.talismanId)
              : null;

            return (
              <div
                key={slotIdx}
                className={`p-2 rounded-xl border flex flex-col justify-between items-center text-center min-h-[110px] transition relative ${
                  equippedItem
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : activeSlotToSelect === slotIdx
                    ? 'bg-zinc-800/60 border-amber-400/80 animate-pulse'
                    : 'bg-zinc-950/60 border-zinc-800/60 hover:border-zinc-700'
                }`}
              >
                <div className="text-[9px] font-mono text-zinc-500 uppercase">
                  Ô Phù Nang #{slotIdx + 1}
                </div>

                {equippedItem ? (
                  <div className="my-1 space-y-1">
                    <div className="w-8 h-8 mx-auto rounded-lg bg-red-950/70 border border-red-600/50 flex items-center justify-center text-base shadow-sm">
                      📜
                    </div>
                    <div className="text-[10.5px] font-serif font-bold text-amber-200 truncate max-w-[90px]">
                      {equippedItem.name}
                    </div>
                    <div className="text-[9px] text-emerald-400 font-mono">
                      Còn: x{equippedItem.quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnequipTalisman(slotIdx)}
                      className="text-[8.5px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-red-900/60 text-zinc-300 hover:text-red-200 border border-zinc-700/50 cursor-pointer transition"
                    >
                      Tháo Bùa
                    </button>
                  </div>
                ) : (
                  <div className="my-auto space-y-1">
                    <button
                      type="button"
                      onClick={() => setActiveSlotToSelect(activeSlotToSelect === slotIdx ? null : slotIdx)}
                      className="w-8 h-8 mx-auto rounded-lg bg-zinc-900/80 border border-dashed border-zinc-700 hover:border-amber-500/60 flex items-center justify-center text-zinc-500 hover:text-amber-400 transition cursor-pointer"
                    >
                      +
                    </button>
                    <div className="text-[9px] text-zinc-500">
                      {activeSlotToSelect === slotIdx ? 'Chọn bên dưới' : 'Trống'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Danh Sách Chiến Đấu Phù Để Nạp */}
      <div className="space-y-2">
        <div className="text-[11px] font-serif font-bold text-amber-300 flex items-center justify-between border-b border-amber-900/20 pb-1">
          <span>Chiến Đấu Phù Trong Túi ({combatTalismans.length}):</span>
          <span className="text-[9.5px] text-zinc-400">Nhấp [Nạp] để khảm vào ô</span>
        </div>

        {combatTalismans.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-xs italic bg-zinc-900/30 rounded-xl border border-zinc-800/40">
            Chưa có Chiến Đấu Phù nào trong túi đồ. Hãy qua tab [✍️ Họa Phù] để vẽ bùa!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {combatTalismans.map(talisman => {
              const isEquippedInBelt = equippedBelt.some(s => s.talismanId === talisman.id || s.talismanId === talisman.recipeId);

              return (
                <div
                  key={talisman.id}
                  className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 hover:border-amber-700/50 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-serif font-bold text-amber-200 truncate flex items-center gap-1">
                      <span>📜</span>
                      <span>{talisman.name}</span>
                      <span className="text-[9px] text-emerald-400 font-mono">x{talisman.quantity}</span>
                    </div>
                    <div className="text-[9px] text-zinc-400 line-clamp-1">
                      {talisman.combatEffect?.description || talisman.description}
                    </div>
                  </div>

                  <div className="shrink-0 flex gap-1">
                    {[0, 1, 2].map(slotIdx => (
                      <button
                        key={slotIdx}
                        type="button"
                        onClick={() => handleEquipTalisman(slotIdx, talisman.id)}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono cursor-pointer transition ${
                          equippedBelt.find(s => s.slotIndex === slotIdx)?.talismanId === talisman.id
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-zinc-800 hover:bg-amber-900/60 text-zinc-300 hover:text-amber-200 border border-zinc-700'
                        }`}
                        title={`Nạp vào ô Phù Nang ${slotIdx + 1}`}
                      >
                        Ô{slotIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ── SUB-TAB 3: TÀNG PHÙ HÒM (TALISMAN INVENTORY) ──────────────
const TalismanInventoryTab: React.FC<TalismanTabProps> = ({
  player,
  talismanInventory,
  handleUseUtilityTalisman,
  handleEquipTalisman,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredItems = talismanInventory.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-3">
      {/* Bộ Lọc */}
      <div className="flex items-center justify-between border-b border-amber-900/20 pb-1.5">
        <div className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-amber-400" />
          <span>Tàng Phù Hòm ({talismanInventory.reduce((acc, t) => acc + t.quantity, 0)} đạo bùa)</span>
        </div>

        <div className="flex gap-1">
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'combat', label: 'Chiến Đấu' },
            { id: 'breakthrough', label: 'Đột Phá' },
            { id: 'utility', label: 'Phụ Trợ' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`text-[9px] px-1.5 py-0.5 rounded cursor-pointer transition ${
                filterType === f.id
                  ? 'bg-amber-800/60 text-amber-200 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300 bg-zinc-900/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 text-xs italic bg-zinc-950/40 rounded-xl border border-zinc-800/40">
          Tàng Phù Hòm trống trải. Chưa tích trữ đạo linh phù nào!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-zinc-900/50 border border-amber-900/30 hover:border-amber-600/50 flex flex-col justify-between space-y-1.5 transition shadow-sm"
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-xs font-serif font-bold text-amber-200 truncate flex items-center gap-1">
                    <span>📜</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-[9.5px] text-zinc-500">
                    Phẩm cấp: <span className="text-zinc-400">{item.grade}</span> • Tồn kho: <span className="font-mono text-emerald-400 font-bold">x{item.quantity}</span>
                  </div>
                </div>
                <TypeBadge type={item.type} />
              </div>

              <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                {item.combatEffect?.description || item.breakthroughEffect?.description || item.utilityEffect?.description || item.description}
              </p>

              {/* Action buttons */}
              <div className="pt-1 flex items-center justify-end gap-1.5 border-t border-zinc-800/60">
                {item.type === 'utility' && (
                  <button
                    type="button"
                    onClick={() => handleUseUtilityTalisman(item.id)}
                    className="px-2 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 text-[9.5px] font-serif cursor-pointer transition flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" /> Dùng Ngay
                  </button>
                )}

                {item.type === 'combat' && (
                  <button
                    type="button"
                    onClick={() => handleEquipTalisman(0, item.id)}
                    className="px-2 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/50 text-[9.5px] font-serif cursor-pointer transition flex items-center gap-1"
                  >
                    <Zap className="w-2.5 h-2.5" /> Nạp Ô 1
                  </button>
                )}

                {item.type === 'breakthrough' && (
                  <span className="text-[9px] text-amber-400/80 italic">
                    Tự động dùng khi Đột Phá
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── MAIN TAB COMPONENT ─────────────────────────────────────────
export const TalismanTab: React.FC<TalismanTabProps> = (props) => {
  const { talismanSubTab, setTalismanSubTab, artisan, player } = props;

  const currentRank = TALISMAN_ARTISAN_RANKS.find(r => r.level === artisan.level) || TALISMAN_ARTISAN_RANKS[0];

  const SUB_TABS: { key: TalismanSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'crafting',  label: 'Án Thư Họa Phù',   icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'belt',      label: 'Phù Nang Bản Mệnh', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'inventory', label: 'Tàng Phù Hòm',     icon: <Package className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-3">
      {/* HEADER — Danh xưng Phù Sư & Cấp Bậc */}
      <div className="bg-gradient-to-r from-red-950/60 via-amber-950/40 to-[#0a0a0c] p-2.5 rounded-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute right-2 top-0 text-6xl opacity-5 pointer-events-none font-bold text-amber-400 font-serif">
          符
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-amber-600/50 flex items-center justify-center text-base shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            📜
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[11px] font-serif font-bold ${currentRank.color}`}>
              {currentRank.title}
            </div>
            <div className="text-[9px] text-zinc-500 mt-0.5">
              Đã họa {artisan.totalCrafted || 0} đạo phù • {props.talismanInventory.length} loại trong kho
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] text-amber-400/80 font-mono">
              Thần Thức: {player.thanThuc || player.tamCanh || 20}
            </div>
            <div className="text-[8.5px] text-zinc-500">
              Gia trì phẩm cấp phù
            </div>
          </div>
        </div>

        {/* Thanh EXP Phù Sư */}
        <div className="mt-2 space-y-0.5">
          <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
            <span>Phù Đạo EXP</span>
            <span>{artisan.exp}/{artisan.maxExp}</span>
          </div>
          <div className="h-1.5 bg-zinc-900/80 rounded-full overflow-hidden border border-zinc-800/50">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.floor((artisan.exp / artisan.maxExp) * 100))}%` }}
            />
          </div>
          {(() => {
            const promoCheck = checkArtisanPromotionRequirement(player.currentRealm || 0, artisan.level);
            const isExpFull = artisan.exp >= artisan.maxExp;
            if (promoCheck.isLockedByRealm && isExpFull) {
              return (
                <div className="mt-1.5 text-[10px] py-1 px-2 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-serif text-center flex items-center justify-center gap-1 animate-pulse">
                  <span>{promoCheck.reason}</span>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* SUB-TAB NAV */}
      <div className="grid grid-cols-3 gap-1">
        {SUB_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTalismanSubTab(tab.key)}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-serif font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              talismanSubTab === tab.key
                ? 'bg-amber-900/50 text-amber-200 border border-amber-600/50 shadow-sm'
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
        {talismanSubTab === 'crafting' && <CraftingAltarTab {...props} />}
        {talismanSubTab === 'belt' && <EquippedBeltTab {...props} />}
        {talismanSubTab === 'inventory' && <TalismanInventoryTab {...props} />}
      </div>
    </div>
  );
};
