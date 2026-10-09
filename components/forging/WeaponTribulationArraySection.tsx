// components/forging/WeaponTribulationArraySection.tsx
// Màn hình chính phân hệ: "Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân"
// 100% Strict TypeScript, Tailwind CSS, Phong cách Cổ Phong Tiên Hiệp

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Shield,
  Sparkles,
  Sword,
  Flame,
  Layers,
  Award,
  Info,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import { FormationSetCategory } from '@/lib/types/weapon-tribulation-array';
import { useWeaponTribulationArrayActions } from '@/hooks/useWeaponTribulationArrayActions';
import { TribulationLightningAltar } from './TribulationLightningAltar';
import { OrbitingArrayCanvas } from './OrbitingArrayCanvas';
import { FormationSetPieceCrafter } from './FormationSetPieceCrafter';
import { HeavenTemperedRelicModal } from './HeavenTemperedRelicModal';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';

export interface WeaponTribulationArraySectionProps {
  player: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: any) => void;
}

export const WeaponTribulationArraySection: React.FC<WeaponTribulationArraySectionProps> = ({
  player,
  setPlayer,
  showToast,
  addLog
}) => {
  // 1. Hook điều phối State & Actions
  const {
    selectedWeaponForTribulationId,
    activeTribulationEncounter,
    selectedFormationSetId,
    isProcessing,
    actionFeedback,
    selectedWeapon,
    tribulationTriggerEval,
    selectedFormationSet,
    selectedFormationProgress,
    allFormationSets,
    handleSelectWeaponForTribulation,
    handleSelectFormationSet,
    handleClearFeedback,
    handleStartTribulation,
    handleAbsorbStrike,
    handleCraftSetPieces,
    handleToggleEquipArraySet
  } = useWeaponTribulationArrayActions({
    player,
    showToast,
    addLog: (title, msg, type) => {
      addLog?.(title, msg, type === 'danger' ? 'danger' : 'forging');
    }
  });

  // 2. Local State
  const [activeMainSubTab, setActiveMainSubTab] = useState<'tribulation' | 'array_set'>('tribulation');
  const [isRelicModalDismissed, setIsRelicModalDismissed] = useState<boolean>(false);

  // Modal hiển thị khi hoàn thành đợt lôi kiếp thứ 3
  const isRelicModalOpen = !!activeTribulationEncounter?.isComplete && !isRelicModalDismissed;

  // 3. Danh sách Thần Binh Ứng Viên để độ kiếp
  const candidateWeapons = useMemo(() => {
    const list: Array<{ item: Equipment; sourceLabel: string }> = [];

    // Vũ khí đang mặc
    const eq = player.equipment as Record<string, Equipment | undefined> | undefined;
    if (eq && eq.weapon) {
      list.push({ item: eq.weapon, sourceLabel: 'Bản Mệnh Kiếm (Đang Mặc)' });
    }

    // Vũ khí trong túi đồ
    const invEquips = player.inventory?.equipments || (player.inventory as any)?.equipment || [];
    if (Array.isArray(invEquips)) {
      invEquips.forEach(item => {
        if (item && item.type === 'weapon') {
          list.push({ item, sourceLabel: 'Túi Đồ' });
        }
      });
    }

    // Bản Mệnh Pháp Bảo
    if (player.natalArtifact?.baseEquipment && player.natalArtifact.baseEquipment.type === 'weapon') {
      list.push({
        item: player.natalArtifact.baseEquipment,
        sourceLabel: 'Bản Mệnh Pháp Bảo'
      });
    }

    return list;
  }, [player.equipment, player.inventory, player.natalArtifact]);

  // Tự động chọn vũ khí đầu tiên nếu chưa chọn
  React.useEffect(() => {
    if (!selectedWeaponForTribulationId && candidateWeapons.length > 0) {
      handleSelectWeaponForTribulation(candidateWeapons[0].item.id);
    }
  }, [selectedWeaponForTribulationId, candidateWeapons, handleSelectWeaponForTribulation]);

  return (
    <div className="space-y-4">
      {/* 1. Header Banner & Sub-tab Navigation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-[#160f29] to-stone-950 border border-purple-900/60 shadow-[0_0_30px_rgba(147,51,234,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-950 border border-purple-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <Zap className="w-5 h-5 text-purple-200 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif font-black text-sm sm:text-base text-white flex items-center gap-2">
              <span>Khí Kiếp & Trận Khí Tùy Thân</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-600/50 text-purple-300 font-mono">
                Thượng Cổ Di Trận
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-serif">
              Dẫn thiên kiếp lôi đình đoán cốt thần binh • Rèn đúc bộ trận khí hộ thể tuần hoàn
            </p>
          </div>
        </div>

        {/* Nút chuyển đổi giữa 2 phân nhánh */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/80 border border-purple-900/50">
          <button
            onClick={() => setActiveMainSubTab('tribulation')}
            className={`py-1.5 px-3 rounded-lg text-xs font-serif font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeMainSubTab === 'tribulation'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white border border-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-300" />
            <span>⚡ Khí Lôi Kiếp</span>
          </button>

          <button
            onClick={() => setActiveMainSubTab('array_set')}
            className={`py-1.5 px-3 rounded-lg text-xs font-serif font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeMainSubTab === 'array_set'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white border border-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-stone-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>🌀 Trận Khí Tùy Thân</span>
          </button>
        </div>
      </div>

      {/* 2. Banner Phản Hồi Trạng Thái Thao Tác (Feedback) */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs font-serif transition-all duration-300 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              : 'bg-rose-950/80 border-rose-500/60 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={handleClearFeedback}
            className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHÂN NHÁNH 1: KHÍ LÔI KIẾP (ĐỘ KIẾP THẦN BINH)                 */}
      {/* ============================================================== */}
      {activeMainSubTab === 'tribulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Cột Trái: Đài Lôi Kiếp & Nung Nấu Sấm Sét */}
          <div className="lg:col-span-7">
            <TribulationLightningAltar
              weapon={selectedWeapon}
              activeEncounter={activeTribulationEncounter}
              isProcessing={isProcessing}
              canTrigger={tribulationTriggerEval?.canTrigger ?? false}
              triggerReason={tribulationTriggerEval?.reason}
              playerQi={player.linhLuc || 3000}
              onStartTribulation={() => {
                if (selectedWeapon) {
                  setIsRelicModalDismissed(false);
                  handleStartTribulation(selectedWeapon.id, player);
                }
              }}
              onAbsorbStrike={() => {
                if (setPlayer) {
                  handleAbsorbStrike(player, setPlayer, player.linhLuc);
                }
              }}
            />
          </div>

          {/* Cột Phải: Danh Sách Thần Binh Ứng Viên & Thuộc Tính Lôi Kiếp */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-purple-900/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
                <span className="font-serif font-bold text-xs text-purple-200 flex items-center gap-1.5">
                  <Sword className="w-3.5 h-3.5 text-purple-400" />
                  <span>Chọn Thần Binh Dẫn Kiếp ({candidateWeapons.length})</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-serif">
                  Chỉ nhận Cửu Giai / Khí Linh Giai Đoạn 3
                </span>
              </div>

              {/* Danh sách cuộn vũ khí */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {candidateWeapons.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500 font-serif">
                    Không tìm thấy vũ khí nào trong trang bị hoặc túi đồ!
                  </div>
                ) : (
                  candidateWeapons.map(({ item, sourceLabel }) => {
                    const isSelected = item.id === selectedWeaponForTribulationId;
                    const isTempered = !!item.lightningTempering?.isTempered;
                    const isTier9 = (item.tier || 1) >= 9;
                    const isSpirit3 = (item.infusedSoul?.currentStage || 1) >= 3;
                    const isEligible = (isTier9 || isSpirit3) && !isTempered;
                    const quality = getItemQuality(item.quality);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsRelicModalDismissed(false);
                          handleSelectWeaponForTribulation(item.id);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-950/90 to-stone-900 border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40'
                            : 'bg-stone-900/60 border-stone-800/80 hover:border-purple-800/50 hover:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-stone-950 border border-purple-900/50 flex items-center justify-center shrink-0">
                            <Sword className={`w-4 h-4 ${isTempered ? 'text-amber-400' : 'text-purple-300'}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-serif font-bold text-xs text-stone-200 truncate flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${quality.badgeClass}`}>
                                {quality.name}
                              </span>
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate">
                              {sourceLabel} • Bậc {item.tier || 1}
                            </div>
                          </div>
                        </div>

                        {/* Tag trạng thái */}
                        <div className="shrink-0 text-right">
                          {isTempered ? (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-serif font-bold flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Đã Độ Kiếp</span>
                            </span>
                          ) : isEligible ? (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-serif">
                              Đủ Điều Kiện
                            </span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-stone-500 font-serif">
                              Chưa Đạt
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Thẻ Thuộc Tính Thần Binh Độ Kiếp */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-stone-950 to-purple-950/30 border border-purple-900/40 space-y-2 text-xs">
              <span className="font-serif font-bold text-purple-200 block">
                Đặc Quyền Cửu Tiêu Lôi Kiếp:
              </span>
              <ul className="space-y-1.5 text-[11px] text-zinc-300 font-serif leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">⚡</span>
                  <span>Gắn danh hiệu vĩnh viễn: <strong className="text-amber-300">【Cửu Tiêu Lôi Kiếp】</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400">⚡</span>
                  <span>Tăng <strong className="text-amber-300">+35% Sát Thương Lôi Đình</strong>, bỏ qua 30% giáp hộ thể</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400">⚡</span>
                  <span><strong className="text-cyan-300">20% Tê Liệt Thiên Lôi</strong>: Gián đoạn xuất chiêu của đối thủ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHÂN NHÁNH 2: BỘ TRẬN KHÍ TÙY THÂN (QUỸ ĐẠO BÁT QUÁI)         */}
      {/* ============================================================== */}
      {activeMainSubTab === 'array_set' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Cột Trái: Canvas Quỹ Đạo Bát Quái Tu Sĩ */}
          <div className="lg:col-span-6">
            <OrbitingArrayCanvas
              category={selectedFormationSet?.category || 'chu_thien_kiem'}
              setName={selectedFormationSet?.name || 'Chu Thiên Tinh Đẩu Kiếm Trận'}
              currentPieces={selectedFormationProgress?.currentPieces || 0}
              maxPieces={selectedFormationSet?.maxPieces || 36}
              isEquipped={player.formationSetsState?.equippedArraySetId === selectedFormationSetId}
              unlockedThresholdCount={selectedFormationProgress?.unlockedThresholds?.length || 0}
              onToggleEquip={() => {
                if (selectedFormationSetId && setPlayer) {
                  handleToggleEquipArraySet(selectedFormationSetId, player, setPlayer);
                }
              }}
            />
          </div>

          {/* Cột Phải: Bảng Đúc Mảnh & Mở Khóa Mốc Threshold */}
          <div className="lg:col-span-6">
            <FormationSetPieceCrafter
              player={player}
              selectedSetId={selectedFormationSetId || 'chu_thien_kiem'}
              onSelectSetId={handleSelectFormationSet}
              onCraftPieces={(setId, count) => {
                if (setPlayer) {
                  return handleCraftSetPieces(setId, count, player, setPlayer);
                }
                return Promise.resolve(false);
              }}
              onToggleEquip={setId => {
                if (setPlayer) {
                  handleToggleEquipArraySet(setId, player, setPlayer);
                }
              }}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}

      {/* Modal Chúc Mừng Độ Kiếp Hoàn Thành */}
      <HeavenTemperedRelicModal
        isOpen={isRelicModalOpen}
        onClose={() => setIsRelicModalDismissed(true)}
        weapon={selectedWeapon}
      />
    </div>
  );
};
