// components/forging/FormationInscriptionSection.tsx
// Màn hình chính phân hệ Minh Khắc Trận Văn & Mạch Dẫn Linh trên Thần Binh
// 100% Strict TypeScript, Tailwind CSS, Giao diện Tiên Hiệp Cổ Phong Đẳng Cấp

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Flame,
  Wind,
  Droplet,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sword,
  Info,
  ChevronRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import {
  useFormationInscriptionActions,
  findEquipmentInPlayer
} from '@/hooks/useFormationInscriptionActions';
import { WeaponConduitCanvas } from './WeaponConduitCanvas';
import { InscriptionDrawer } from './InscriptionDrawer';
import { CalligraphyModal } from './CalligraphyModal';
import { FORMATION_INSCRIPTIONS_REGISTRY } from '@/lib/formation-inscription-logic';

export interface FormationInscriptionSectionProps {
  player: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'forging' | 'system' | 'danger') => void;
}

export const FormationInscriptionSection: React.FC<FormationInscriptionSectionProps> = ({
  player,
  setPlayer,
  showToast,
  addLog
}) => {
  // 1. Hook điều phối hành động
  const {
    selectedEquipmentId,
    selectedSlotIndex,
    isProcessing,
    inscriptionFeedback,
    selectedEquipment,
    handleSelectEquipment,
    handleSelectSlot,
    handleClearFeedback,
    handleInscribe,
    handleCleanse
  } = useFormationInscriptionActions({
    player,
    showToast,
    addLog: (title, msg, type) => {
      const mappedType = type === 'danger' ? 'danger' : 'forging';
      addLog?.(title, msg, mappedType);
    }
  });

  // 2. UI Local State
  const [equipmentFilter, setEquipmentFilter] = useState<'equipped' | 'inventory'>('equipped');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [pendingCleanseSlot, setPendingCleanseSlot] = useState<number | null>(null);
  const [calligraphyActive, setCalligraphyActive] = useState<boolean>(false);
  const [calligraphyFormationName, setCalligraphyFormationName] = useState<string>('');

  // 3. Danh sách trang bị phù hợp (Vũ khí / Pháp bảo có hỗ trợ Mạch Dẫn Linh)
  const candidateEquipments = useMemo(() => {
    const list: Array<{ item: Equipment; source: 'equipped' | 'inventory'; label: string }> = [];

    // Từ trang bị đang mặc trên người
    if (player?.equipment) {
      if (player.equipment.weapon) {
        list.push({ item: player.equipment.weapon, source: 'equipped', label: 'Bản Mệnh Kiếm (Đang Mặc)' });
      }
      if (player.equipment.artifact) {
        list.push({ item: player.equipment.artifact, source: 'equipped', label: 'Trữ Vật Bảo (Đang Mặc)' });
      }
    }

    // Từ kho đồ
    const invEquips = player?.inventory?.equipment || [];
    for (const eq of invEquips) {
      if (eq && (eq.type === 'weapon' || eq.type === 'artifact' || eq.slot === 'weapon' || eq.slot === 'artifact')) {
        list.push({ item: eq, source: 'inventory', label: eq.name });
      }
    }

    return list;
  }, [player?.equipment, player?.inventory?.equipment]);

  // Tự động chọn món vũ khí đầu tiên nếu chưa chọn món nào
  useEffect(() => {
    if (!selectedEquipmentId && candidateEquipments.length > 0) {
      handleSelectEquipment(candidateEquipments[0].item.id);
    }
  }, [selectedEquipmentId, candidateEquipments, handleSelectEquipment]);

  // Danh sách trang bị theo bộ lọc
  const filteredCandidates = useMemo(() => {
    return candidateEquipments.filter(c => c.source === equipmentFilter);
  }, [candidateEquipments, equipmentFilter]);

  // Lấy chi tiết trang bị đang được chọn
  const currentTargetEquipment = useMemo<Equipment | null>(() => {
    if (selectedEquipment) return selectedEquipment;
    if (!selectedEquipmentId) return null;
    const loc = findEquipmentInPlayer(player, selectedEquipmentId);
    return loc ? loc.equipment : null;
  }, [selectedEquipment, selectedEquipmentId, player]);

  const conduits = currentTargetEquipment?.inscriptionData?.conduits || [];
  const cleansingWaterCount = player?.inscriptionState?.cleansingWaterCount ?? 5;
  const totalInscribed = player?.inscriptionState?.totalInscribedCount ?? 0;

  // Thực thi mở Drawer để khắc ấn
  const handleOpenInscribeDrawer = (slotIdx: number) => {
    handleSelectSlot(slotIdx);
    setIsDrawerOpen(true);
  };

  // Xác nhận Khắc Ấn Trận Đồ
  const handleConfirmInscribeAction = async (formationId: string) => {
    if (!setPlayer) return;
    const formationConfig = FORMATION_INSCRIPTIONS_REGISTRY[formationId];
    setCalligraphyFormationName(formationConfig?.name || 'Trận Đồ Thần Phẩm');
    setCalligraphyActive(true);

    // Kích hoạt action
    const success = await handleInscribe(formationId, player, setPlayer);
    if (success) {
      setIsDrawerOpen(false);
    }
  };

  // Thực thi Tẩy Luyện
  const handleConfirmCleanse = async () => {
    if (pendingCleanseSlot === null || !setPlayer) return;
    const slotIdx = pendingCleanseSlot;
    setPendingCleanseSlot(null);
    await handleCleanse(slotIdx, player, setPlayer);
  };

  return (
    <div className="space-y-4 animate-fade-in text-zinc-200">
      {/* 1. Header Banner & Chỉ Số Thần Thức / Tẩy Thần Thủy */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#090e1a] to-[#070b14] border border-cyan-800/50 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600/40 to-blue-600/40 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-base font-bold text-amber-200 tracking-wide">
                Minh Khắc Trận Văn & Mạch Dẫn Linh
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-950/70 border border-cyan-600/50 text-cyan-300">
                Thần Binh Trận Đạo
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Khai thông Mạch Dẫn Linh, dùng Thần Thức và Linh Mực khắc họa cổ trận gia trì uy lực thần binh.
            </p>
          </div>
        </div>

        {/* Thẻ chỉ số nhanh */}
        <div className="flex items-center gap-2.5 sm:self-center font-mono text-xs">
          {/* Thần Thức */}
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-900/50 flex items-center gap-1.5">
            <span className="text-zinc-400 text-[11px]">Thần Thức:</span>
            <span className="text-cyan-300 font-bold">{(player?.thanThuc ?? 0).toLocaleString()}</span>
          </div>

          {/* Tẩy Thần Thủy */}
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-blue-900/50 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-zinc-400 text-[11px]">Tẩy Thần Thủy:</span>
            <span className="text-amber-300 font-bold">{cleansingWaterCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Thanh Chọn Trang Bị (Equipment Selector Bar) */}
      <div className="p-3 rounded-xl bg-[#0c101a] border border-cyan-900/30 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
            <Sword className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chọn Thần Binh Để Khắc Trận:</span>
          </span>

          {/* Tabs bộ lọc Đang Mặc / Túi Đồ */}
          <div className="flex items-center rounded-lg bg-black/50 p-0.5 border border-zinc-800 text-[11px] font-mono">
            <button
              onClick={() => setEquipmentFilter('equipped')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                equipmentFilter === 'equipped'
                  ? 'bg-cyan-700/60 text-cyan-100 font-bold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Đang Mặc
            </button>
            <button
              onClick={() => setEquipmentFilter('inventory')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                equipmentFilter === 'inventory'
                  ? 'bg-cyan-700/60 text-cyan-100 font-bold border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Túi Đồ ({candidateEquipments.filter(c => c.source === 'inventory').length})
            </button>
          </div>
        </div>

        {/* Danh sách các item trong bộ lọc */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {filteredCandidates.length === 0 ? (
            <div className="text-xs text-zinc-500 italic py-2">
              Không có thần binh nào trong mục này. Hãy đúc vũ khí mới hoặc trang bị vào thân thể.
            </div>
          ) : (
            filteredCandidates.map(({ item, label }) => {
              const isSelected = selectedEquipmentId === item.id;
              const slotCount = item.inscriptionData?.totalSlots ?? 2;
              const inscribed = item.inscriptionData?.inscribedCount ?? 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectEquipment(item.id)}
                  className={`px-3 py-2 rounded-xl text-left transition-all cursor-pointer shrink-0 border flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-black/40 border-zinc-800 hover:border-cyan-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-serif text-xs font-bold ${
                      isSelected ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    ⚔️
                  </div>
                  <div>
                    <div
                      className={`text-xs font-serif font-bold ${
                        isSelected ? 'text-amber-200' : 'text-zinc-300'
                      }`}
                    >
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                      <span>[{item.grade || 'Bảo Khí'}]</span>
                      <span>•</span>
                      <span className="text-cyan-300">{inscribed}/{slotCount} Trận Nhãn</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Đồ Họa Vector Mạch Dẫn Linh (Weapon Conduit Canvas) */}
      <WeaponConduitCanvas
        conduits={conduits}
        maxSlots={currentTargetEquipment?.inscriptionData?.maxConduits || 4}
        selectedSlotIndex={selectedSlotIndex}
        onSelectSlot={slotIdx => {
          handleSelectSlot(slotIdx);
          const targetSlot = conduits.find(c => c.slotIndex === slotIdx);
          if (targetSlot && !targetSlot.inscribedFormationId) {
            setIsDrawerOpen(true);
          }
        }}
        weaponName={currentTargetEquipment?.name}
        weaponGrade={currentTargetEquipment?.grade}
      />

      {/* 4. Danh Sách Chi Tiết 4 Trận Nhãn (Conduit Slots Management) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-sm font-bold text-amber-200 tracking-wide flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Chi Tiết Trận Nhãn Thần Binh</span>
          </h4>
          <span className="text-xs font-mono text-zinc-400">
            Tổng cộng: <strong className="text-amber-300">{conduits.length}</strong> Mạch Dẫn Linh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(slotIdx => {
            const slot = conduits.find(c => c.slotIndex === slotIdx);
            const isUnlocked = Boolean(slot?.isUnlocked);
            const isInscribed = Boolean(slot?.isUnlocked && slot?.inscribedFormationId);
            const formationId = slot?.inscribedFormationId;
            const formationConfig = formationId ? FORMATION_INSCRIPTIONS_REGISTRY[formationId] : null;
            const isSelected = selectedSlotIndex === slotIdx;

            return (
              <div
                key={`slot-card-${slotIdx}`}
                onClick={() => {
                  if (isUnlocked) handleSelectSlot(slotIdx);
                }}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-cyan-400/80 border-cyan-400/80 bg-gradient-to-b from-[#111728] to-[#0c101c] shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : isInscribed
                    ? 'bg-gradient-to-b from-[#10141f] to-[#0a0d16] border-amber-600/40 hover:border-amber-500/70'
                    : isUnlocked
                    ? 'bg-[#0c0f18] border-cyan-900/30 hover:border-cyan-700/50'
                    : 'bg-[#08090f] border-zinc-900 opacity-50'
                }`}
              >
                {/* Header Slot */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                        isInscribed
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : isUnlocked
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/50'
                          : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                      }`}
                    >
                      #{slotIdx + 1}
                    </span>
                    <span className="font-serif text-xs font-bold text-zinc-200">
                      Mạch Dẫn Linh #{slotIdx + 1}
                    </span>
                  </div>

                  {/* Trạng thái Badge */}
                  {isInscribed ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-600/50 text-amber-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{formationConfig?.name || 'Đã Khắc Trận'}</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40 text-cyan-300">
                      Mạch Trống
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                      Chưa Mở Khóa
                    </span>
                  )}
                </div>

                {/* Nội dung Trận Văn đã khắc */}
                {isInscribed && formationConfig ? (
                  <div className="space-y-2 my-2 text-xs">
                    <div className="text-[11.5px] font-sans text-amber-200/90 leading-relaxed bg-black/40 p-2 rounded border border-amber-900/30">
                      {formationConfig.description}
                    </div>

                    {/* Thao tác Tẩy Thần Thức */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-zinc-400">
                        Phẩm cấp: Cấp {formationConfig.tier}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setPendingCleanseSlot(slotIdx);
                        }}
                        disabled={isProcessing}
                        className="py-1 px-2.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 text-[11px] font-serif transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3 text-rose-400" />
                        <span>🌊 Thần Thức Tẩy Xóa</span>
                      </button>
                    </div>
                  </div>
                ) : isUnlocked ? (
                  <div className="py-3 flex flex-col items-center justify-center text-center space-y-2">
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Mạch dẫn linh đã khai thông, sẵn sàng đón nhận phù văn trận đồ.
                    </p>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenInscribeDrawer(slotIdx);
                      }}
                      disabled={isProcessing}
                      className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-serif text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-200" />
                      <span>⚡ Khắc Ấn Trận Đồ</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center text-zinc-600 text-xs italic font-serif">
                    Mạch dẫn này bị phong ấn khi rèn đúc thần binh.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Phản Hồi Trạng Thái (Toast / Alert Feedback) */}
      {inscriptionFeedback && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-sans animate-fade-in ${
            inscriptionFeedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
              : 'bg-rose-950/60 border-rose-600/50 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {inscriptionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{inscriptionFeedback.message}</span>
          </div>
          <button
            onClick={handleClearFeedback}
            className="text-zinc-400 hover:text-zinc-200 underline font-mono text-[11px] cursor-pointer ml-2"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 6. Hộp Thoại Xác Nhận Tẩy Thần Thức (Cleanse Confirmation Modal) */}
      {pendingCleanseSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full p-5 rounded-2xl bg-gradient-to-b from-[#13101e] to-[#0a0710] border border-rose-700/60 shadow-[0_0_30px_rgba(244,63,94,0.3)] space-y-4">
            <div className="flex items-center gap-2.5 text-rose-300 font-serif font-bold text-base">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Xác Nhận Tẩy Luyện Mạch Dẫn Linh</span>
            </div>

            <p className="text-xs text-zinc-300 font-sans leading-relaxed">
              Tẩy luyện Mạch Dẫn Linh số <strong className="text-amber-300">#{pendingCleanseSlot + 1}</strong> sẽ tiêu hao{' '}
              <strong className="text-rose-400">1 bình Tẩy Thần Thủy</strong> (Hiện có: {cleansingWaterCount}), xóa bỏ trận văn hiện tại và hoàn nguyên slot về trạng thái trống ban sơ. Đạo hữu có chắc chắn muốn tiến hành?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setPendingCleanseSlot(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmCleanse}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-serif text-xs font-bold transition shadow-[0_0_12px_rgba(244,63,94,0.4)] cursor-pointer"
              >
                Tiến Hành Tẩy Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Drawer Lựa Chọn Trận Đồ Minh Khắc */}
      <InscriptionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        targetSlotIndex={selectedSlotIndex}
        player={player}
        equipment={currentTargetEquipment}
        onConfirmInscribe={handleConfirmInscribeAction}
        isProcessing={isProcessing}
      />

      {/* 8. Hoạt Ảnh Vung Bút Chu Sa Khắc Phù (Calligraphy Modal) */}
      <CalligraphyModal
        isOpen={calligraphyActive}
        formationName={calligraphyFormationName}
        onComplete={() => setCalligraphyActive(false)}
      />
    </div>
  );
};
