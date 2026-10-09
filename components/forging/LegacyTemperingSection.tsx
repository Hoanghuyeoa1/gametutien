// components/forging/LegacyTemperingSection.tsx
// Màn hình chính phân hệ: "Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh"
// 100% Strict TypeScript, Tailwind CSS, Phong cách Cổ Phong Tiên Hiệp

import React, { useState, useMemo } from 'react';
import {
  Zap,
  Flame,
  Shield,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sword,
  Gem,
  Award
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import { useLegacyTemperingActions } from '@/hooks/useLegacyTemperingActions';
import { getMaxArtisanTierForRealm } from '@/lib/artisan-lock-logic';
import { ReforgeComparisonCard } from './ReforgeComparisonCard';
import { BloodBondingAltar } from './BloodBondingAltar';
import { BloodBondCinematicModal } from './BloodBondCinematicModal';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import { audioEngine } from '@/lib/audio-engine';

export interface LegacyTemperingSectionProps {
  player: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: any) => void;
}

export const LegacyTemperingSection: React.FC<LegacyTemperingSectionProps> = ({
  player,
  setPlayer,
  showToast,
  addLog
}) => {
  // 1. Hook điều phối State & Actions
  const {
    selectedEquipmentId,
    targetTierSelection,
    isProcessing,
    actionFeedback,
    selectedEquipment,
    reforgePreview,
    previewError,
    bloodBondLifespanCost,
    remainingLifespan,
    handleSelectEquipment,
    handleSelectTargetTier,
    handleClearFeedback,
    handleExecuteReforge,
    handleExecuteBloodBond
  } = useLegacyTemperingActions({
    player,
    showToast,
    addLog: (title, msg, type) => {
      addLog?.(title, msg, type === 'danger' ? 'danger' : 'forging');
    }
  });

  // 2. Local State
  const [activeSubView, setActiveSubView] = useState<'reforge' | 'blood_bond'>('reforge');
  const [equipmentFilter, setEquipmentFilter] = useState<'all' | 'equipped' | 'inventory'>('all');
  const [isCinematicOpen, setIsCinematicOpen] = useState<boolean>(false);

  // 3. Trần cảnh giới tối đa của nhân vật
  const maxAllowedTier = useMemo(() => {
    return getMaxArtisanTierForRealm(player.currentRealm ?? 0);
  }, [player.currentRealm]);

  // 4. Danh sách Thần Binh ứng viên (Đang mặc & Trong túi)
  const candidateEquipments = useMemo(() => {
    const list: Array<{ item: Equipment; source: 'equipped' | 'inventory'; label: string }> = [];

    // Từ trang bị đang mặc
    const eqMap = player.equipment as Record<string, Equipment | undefined> | undefined;
    if (eqMap && typeof eqMap === 'object' && !Array.isArray(eqMap)) {
      if (eqMap.weapon) {
        list.push({ item: eqMap.weapon, source: 'equipped', label: 'Bản Mệnh Kiếm (Đang Mặc)' });
      }
      if (eqMap.armor) {
        list.push({ item: eqMap.armor, source: 'equipped', label: 'Đạo Bào Tiên Gia (Đang Mặc)' });
      }
      if (eqMap.accessory) {
        list.push({ item: eqMap.accessory, source: 'equipped', label: 'Hộ Thân Phù (Đang Mặc)' });
      }
      if (eqMap.artifact) {
        list.push({ item: eqMap.artifact, source: 'equipped', label: 'Trữ Vật Linh Bảo (Đang Mặc)' });
      }
    }

    // Từ túi đồ
    const inv = player.inventory as any;
    const invItems = (inv?.equipment || inv?.equipments || []) as Equipment[];
    invItems.forEach((eq) => {
      if (eq && eq.id) {
        list.push({
          item: eq,
          source: 'inventory',
          label: 'Túi Đồ'
        });
      }
    });

    return list;
  }, [player.equipment, player.inventory]);

  // Lọc theo bộ lọc
  const filteredCandidates = useMemo(() => {
    if (equipmentFilter === 'all') return candidateEquipments;
    return candidateEquipments.filter(c => c.source === equipmentFilter);
  }, [candidateEquipments, equipmentFilter]);

  // Chọn mặc định nếu chưa chọn
  React.useEffect(() => {
    if (!selectedEquipmentId && candidateEquipments.length > 0) {
      handleSelectEquipment(candidateEquipments[0].item.id);
    }
  }, [candidateEquipments, selectedEquipmentId, handleSelectEquipment]);

  // 5. Thao tác Trùng Chú Tái Sinh
  const onReforgeClick = async () => {
    if (!setPlayer) return;
    try {
      audioEngine.playSFX('craft');
    } catch (_) { /* no-op */ }
    await handleExecuteReforge(player, setPlayer, { showToast, addLog });
  };

  // 6. Thao tác Ký Huyết Khế
  const onBloodBondClick = async () => {
    if (!setPlayer) return;
    try {
      audioEngine.playSFX('craft');
    } catch (_) { /* no-op */ }
    const success = await handleExecuteBloodBond(player, setPlayer, bloodBondLifespanCost, {
      showToast,
      addLog
    });
    if (success) {
      setIsCinematicOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* BANNER GIỚI THIỆU PHÂN HỆ */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-rose-950/70 via-stone-950/90 to-amber-950/50 border border-rose-800/50 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-rose-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-400">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            </span>
            <h2 className="font-serif text-base sm:text-lg font-bold text-rose-200 tracking-wide">
              Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh
            </h2>
          </div>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            Hồi sinh thần khí thượng cổ, tái tạo cốt cách pháp bảo theo cảnh giới tu vi. Cam kết bảo tồn vĩnh viễn hợp kim, trận văn và khí linh. Hiến tế chân huyết tâm mạch để vĩnh viễn khóa thần binh vào bổn mạng nguyên thần.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Bảo tồn 100% Thuộc Tính
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Huyết Khế: +30% Lực Chiến & Miễn Tước Khí
            </span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              Trần Tu Vi: Tier {maxAllowedTier}/9
            </span>
          </div>
        </div>
      </div>

      {/* DANH SÁCH CHỌN THẦN BINH ĐỂ THAO TÁC */}
      <div className="p-3.5 rounded-xl bg-stone-950/90 border border-stone-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-amber-400" />
            <span className="font-serif text-xs font-bold text-amber-200">
              Chọn Thần Binh Tẩy Luyện ({filteredCandidates.length})
            </span>
          </div>

          {/* Bộ lọc Nguồn Trang Bị */}
          <div className="flex rounded-lg bg-black/60 p-0.5 border border-stone-800 text-[11px] font-serif">
            <button
              type="button"
              onClick={() => setEquipmentFilter('all')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                equipmentFilter === 'all'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700/60 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tất Cả
            </button>
            <button
              type="button"
              onClick={() => setEquipmentFilter('equipped')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                equipmentFilter === 'equipped'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700/60 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Đang Mặc
            </button>
            <button
              type="button"
              onClick={() => setEquipmentFilter('inventory')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                equipmentFilter === 'inventory'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700/60 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Túi Đồ
            </button>
          </div>
        </div>

        {/* Carousel / Danh sách thẻ chọn trang bị */}
        {filteredCandidates.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500 font-serif">
            Không tìm thấy thần binh nào phù hợp trong danh mục này.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
            {filteredCandidates.map(({ item, source, label }) => {
              const isSelected = item.id === selectedEquipmentId;
              const isBound = Boolean(item.bloodBondData?.isBloodBound);
              const qualityInfo = getItemQuality(item.quality);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectEquipment(item.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between space-y-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-b from-rose-950/70 via-stone-900 to-black border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/50'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900 text-zinc-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[11px] font-serif font-bold truncate ${isSelected ? 'text-amber-200' : 'text-zinc-300'}`}>
                        {item.name}
                      </span>
                      {item.enhancement > 0 && (
                        <span className="text-[10px] font-mono text-cyan-300 font-bold shrink-0">
                          +{item.enhancement}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap text-[9px] font-mono">
                      <span className={`px-1 py-0.2 rounded border ${qualityInfo.badgeClass}`}>
                        {qualityInfo.name}
                      </span>
                      <span className="text-zinc-500">
                        {convertGradeToGiai(item.grade)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/60 text-[9px] font-mono">
                    <span className="text-zinc-500 truncate">{source === 'equipped' ? 'Đang mặc' : 'Túi đồ'}</span>
                    {isBound ? (
                      <span className="px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600/50 font-bold shrink-0">
                        🩸 Huyết Khế
                      </span>
                    ) : item.reforgeCount && item.reforgeCount > 0 ? (
                      <span className="px-1 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-600/40 shrink-0">
                        ⚡ Trùng Chú x{item.reforgeCount}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CHUYỂN ĐỔI NGHI THỨC: TRÙNG CHÚ vs HUYẾT KHẾ */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-stone-950 border border-stone-800 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveSubView('reforge')}
          className={`py-2.5 px-3 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubView === 'reforge'
              ? 'bg-gradient-to-r from-amber-900/80 via-rose-900/70 to-amber-900/80 text-amber-200 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>⚡ Trùng Chú Tái Sinh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubView('blood_bond')}
          className={`py-2.5 px-3 rounded-lg font-serif text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubView === 'blood_bond'
              ? 'bg-gradient-to-r from-rose-950/90 via-red-950/90 to-rose-950/90 text-rose-200 border border-rose-500/60 shadow-[0_0_15px_rgba(225,29,72,0.3)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-500" />
          <span>🩸 Huyết Khế Bản Mệnh</span>
        </button>
      </div>

      {/* PHẦN HIỂN THỊ NỘI DUNG CHÍNH */}
      {activeSubView === 'reforge' ? (
        <ReforgeComparisonCard
          equipment={selectedEquipment}
          reforgePreview={reforgePreview}
          previewError={previewError}
          targetTierSelection={targetTierSelection}
          maxAllowedTier={maxAllowedTier}
          onSelectTargetTier={handleSelectTargetTier}
          onExecuteReforge={onReforgeClick}
          isProcessing={isProcessing}
          player={player}
        />
      ) : (
        <BloodBondingAltar
          equipment={selectedEquipment}
          player={player}
          remainingLifespan={remainingLifespan}
          bloodBondLifespanCost={bloodBondLifespanCost}
          onExecuteBloodBond={onBloodBondClick}
          isProcessing={isProcessing}
          actionFeedback={actionFeedback}
        />
      )}

      {/* MODAL HOẠT ẢNH HUYẾT KHẾ */}
      <BloodBondCinematicModal
        isOpen={isCinematicOpen}
        onClose={() => setIsCinematicOpen(false)}
        equipmentName={selectedEquipment?.name}
        ownerName={player.name}
      />
    </div>
  );
};
