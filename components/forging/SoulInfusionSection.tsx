// components/forging/SoulInfusionSection.tsx
// Màn hình chính Đàn Tế Hồn: "Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh"
// 100% Strict TypeScript, Tailwind CSS, Giao diện Tiên Hiệp Cổ Phong

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Shield,
  Flame,
  Droplet,
  Sword,
  Info,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Gift,
  Plus,
  HelpCircle,
  Lock,
  Layers
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import { SoulVesselItem, SoulType } from '@/lib/types/soul-infusion';
import {
  SOUL_REGISTRY,
  SPIRIT_PERSONALITY_NAMES,
  canInfuseSoulIntoWeapon
} from '@/lib/soul-infusion-logic';
import { useSoulInfusionActions } from '@/hooks/useSoulInfusionActions';
import { SoulAltarCanvas } from './SoulAltarCanvas';
import { LivingSpiritCard } from './LivingSpiritCard';
import { SoulAwakeningModal } from './SoulAwakeningModal';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

export interface SoulInfusionSectionProps {
  player: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'forging' | 'system' | 'danger') => void;
}

export const SoulInfusionSection: React.FC<SoulInfusionSectionProps> = ({
  player,
  setPlayer,
  showToast,
  addLog
}) => {
  // 1. Hook điều phối State & Actions Phong Hồn
  const {
    selectedWeaponId,
    selectedSoulItemId,
    isInfusing,
    spiritDialogueBubble,
    infusionFeedback,
    selectedWeapon,
    selectedSoulItem,
    canInfuseCheck,
    handleSelectWeapon,
    handleSelectSoulItem,
    handleClearFeedback,
    handleExecuteInfusion,
    handleFeedSpirit,
    handleInteractWithSpirit
  } = useSoulInfusionActions({
    player,
    showToast,
    addLog: (title, msg, type) => {
      const mapped = type === 'danger' ? 'danger' : 'forging';
      addLog?.(title, msg, mapped);
    }
  });

  // 2. Local UI State
  const [weaponFilter, setWeaponFilter] = useState<'all' | 'equipped' | 'inventory'>('all');
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState<boolean>(false);
  const [awakenedModalOpen, setAwakenedModalOpen] = useState<boolean>(false);
  const [justAwakenedWeapon, setJustAwakenedWeapon] = useState<Equipment | null>(null);

  // 3. Danh sách ứng viên Thần Binh có thể Phong Hồn
  const candidateWeapons = useMemo(() => {
    const list: Array<{ item: Equipment; source: 'equipped' | 'inventory' | 'natal'; label: string }> = [];

    // Từ trang bị đang mặc trên người
    if (player?.equipment?.weapon) {
      list.push({
        item: player.equipment.weapon,
        source: 'equipped',
        label: 'Bản Mệnh Kiếm (Đang Mặc)'
      });
    }
    if (player?.equipment?.artifact) {
      list.push({
        item: player.equipment.artifact,
        source: 'equipped',
        label: 'Trữ Vật Pháp Bảo (Đang Mặc)'
      });
    }

    // Từ Bản Mệnh Pháp Bảo
    if (player?.natalArtifact?.baseEquipment) {
      const natalEq = player.natalArtifact.baseEquipment;
      const alreadyInList = list.some(x => x.item.id === natalEq.id);
      if (!alreadyInList) {
        list.push({
          item: natalEq,
          source: 'natal',
          label: 'Bản Mệnh Pháp Bảo'
        });
      }
    }

    // Từ túi đồ
    const invEquips = player?.inventory?.equipment || [];
    for (const eq of invEquips) {
      if (eq && (eq.type === 'weapon' || eq.type === 'artifact' || eq.slot === 'weapon' || eq.slot === 'artifact')) {
        const alreadyInList = list.some(x => x.item.id === eq.id);
        if (!alreadyInList) {
          list.push({
            item: eq,
            source: 'inventory',
            label: eq.name
          });
        }
      }
    }

    return list;
  }, [player?.equipment, player?.natalArtifact, player?.inventory?.equipment]);

  // Tự động chọn món vũ khí đầu tiên nếu chưa chọn món nào
  useEffect(() => {
    if (!selectedWeaponId && candidateWeapons.length > 0) {
      handleSelectWeapon(candidateWeapons[0].item.id);
    }
  }, [candidateWeapons, selectedWeaponId, handleSelectWeapon]);

  // 4. Danh sách Hồn Phách sở hữu hoặc có thể phong ấn
  const availableSoulsList = useMemo(() => {
    return (Object.keys(SOUL_REGISTRY) as SoulType[]).map(st => {
      const base = SOUL_REGISTRY[st];

      // Đếm số lượng thực tế trong kho
      let ownedCount = 0;
      const invItems = player?.inventory?.items || [];
      const itemMatch = invItems.find((i: any) => i && (i.id === base.id || i.id === `${base.id}_item` || i.soulType === st));
      if (itemMatch) {
        ownedCount += (itemMatch.quantity || itemMatch.count || 1);
      }

      // Đếm trong soulInfusionState.harvestedSouls
      if (player?.soulInfusionState?.harvestedSouls?.[st]) {
        ownedCount += (player.soulInfusionState.harvestedSouls[st] || 0);
      }

      return {
        ...base,
        ownedCount
      };
    });
  }, [player?.inventory?.items, player?.soulInfusionState?.harvestedSouls]);

  // Tự động chọn Hồn Phách đầu tiên có sẵn nếu chưa chọn
  useEffect(() => {
    if (!selectedSoulItemId) {
      const firstOwned = availableSoulsList.find(s => s.ownedCount > 0);
      if (firstOwned) {
        handleSelectSoulItem(firstOwned.id);
      } else if (availableSoulsList.length > 0) {
        handleSelectSoulItem(availableSoulsList[0].id);
      }
    }
  }, [availableSoulsList, selectedSoulItemId, handleSelectSoulItem]);

  // Filter candidate weapons
  const filteredWeapons = useMemo(() => {
    if (weaponFilter === 'all') return candidateWeapons;
    return candidateWeapons.filter(c => c.source === weaponFilter);
  }, [candidateWeapons, weaponFilter]);

  // Thực thi Tế Hồn
  const onExecuteInfusionClick = async () => {
    if (!setPlayer || isInfusing) return;

    if (selectedWeapon?.infusedSoul && !showConfirmOverwrite) {
      setShowConfirmOverwrite(true);
      return;
    }

    setShowConfirmOverwrite(false);

    const success = await handleExecuteInfusion(player, setPlayer);
    if (success && selectedWeapon) {
      // Tìm trang bị vừa cập nhật để mở modal thức tỉnh
      const freshWeapon = {
        ...selectedWeapon,
        infusedSoul: selectedSoulItem ? {
          ...selectedWeapon.infusedSoul,
          soulType: selectedSoulItem.soulType,
          soulName: selectedSoulItem.name,
          element: selectedSoulItem.element,
          personality: selectedSoulItem.personality,
          evolutionStage: 1,
          spiritExp: 0,
          maxSpiritExp: 1000,
          infusedAt: Date.now(),
          dialoguePool: selectedSoulItem.dialoguePool,
          baseProc: selectedSoulItem.baseProc,
          currentProc: selectedSoulItem.baseProc,
          hasAutoGuardianUnlocked: false
        } : selectedWeapon.infusedSoul
      } as Equipment;

      setJustAwakenedWeapon(freshWeapon);
      setAwakenedModalOpen(true);
    }
  };

  const currentRealmIndex = player.currentRealm || 0;
  const currentRealmName = realmsData[currentRealmIndex]?.name || 'Phàm Nhân';

  return (
    <div className="space-y-4">
      {/* 1. BANNER TIÊU ĐỀ CỔ PHONG TIÊN GIA */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-[#130b24] to-indigo-950/80 border border-purple-700/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔮</span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200">
                Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Trích nạp hồn phách Thần Thú thượng cổ, dung luyện vào Thần Binh sinh ra Khí Linh linh trí. Khí Linh có thể tự động hộ chủ, bộc phát thần thông và cùng chủ nhân đàm đạo thức hải.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-end gap-1.5 shrink-0 font-mono text-[11px]">
            <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-purple-800/40 text-purple-300">
              Cảnh giới: <strong className="text-amber-300">{currentRealmName}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-black/40 border border-purple-800/40 text-purple-300">
              Tổng tế hồn: <strong className="text-cyan-300">{player.soulInfusionState?.totalInfusionsPerformed || 0} lần</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEEDBACK BANNER (NẾU CÓ) */}
      {infusionFeedback && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs font-serif animate-fadeIn ${
            infusionFeedback.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/60 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {infusionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{infusionFeedback.message}</span>
          </div>
          <button
            onClick={handleClearFeedback}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 3. LAYOUT CHÍNH: 2 CỘT (DESKTOP) HOẶC XẾP CHỒNG (MOBILE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CỘT TRÁI (7/12): BÁT QUÁI TẾ ĐÀN CANVAS & THAO TÁC TẾ HỒN */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tế Đàn Canvas */}
          <SoulAltarCanvas
            selectedWeapon={selectedWeapon}
            selectedSoul={selectedSoulItem}
            isInfusing={isInfusing}
            canInfuse={Boolean(canInfuseCheck?.canInfuse)}
          />

          {/* Hộp hành động nạp hồn */}
          <div className="p-4 rounded-xl bg-[#0b0817] border border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center text-xs font-serif">
              <span className="text-purple-200 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Nghi Thức Phong Hồn:</span>
              </span>
              {canInfuseCheck?.canInfuse ? (
                <span className="text-emerald-400 font-mono text-[11px]">Đủ điều kiện tế luyện</span>
              ) : (
                <span className="text-rose-400 font-mono text-[11px]">
                  {canInfuseCheck?.reason || 'Chưa đủ điều kiện'}
                </span>
              )}
            </div>

            {/* Cảnh báo ghi đè nếu thần binh đã có Khí Linh */}
            {selectedWeapon?.infusedSoul && (
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-[11px] text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold font-serif">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vũ khí đã có Khí Linh: 【{selectedWeapon.infusedSoul.soulName}】</span>
                </div>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Tế hồn mới sẽ trảm đoạn khế ước cũ và hoán đổi Khí Linh. Khí Linh mới sẽ khởi đầu ở Bậc 1 (Hư Ảnh).
                </p>
              </div>
            )}

            {/* Nút thực thi Tế Hồn */}
            {showConfirmOverwrite ? (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/60 space-y-2 text-center">
                <p className="text-xs text-rose-200 font-serif font-bold">
                  Xác nhận trảm hồn cũ, nạp mới 【{selectedSoulItem?.name}】?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onExecuteInfusionClick}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-serif font-bold text-xs shadow transition cursor-pointer"
                  >
                    Xác Nhận Tế Đè
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmOverwrite(false)}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={!canInfuseCheck?.canInfuse || isInfusing}
                onClick={onExecuteInfusionClick}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:brightness-110 text-white font-serif font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(147,51,234,0.35)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {isInfusing
                    ? 'Đang Khai Đàn Phong Hồn...'
                    : selectedWeapon?.infusedSoul
                    ? '⚡ Trảm Hồn Hoán Phách (Tế Đè)'
                    : '🔥 Khởi Động Phong Hồn Đoạt Phách'}
                </span>
              </button>
            )}
          </div>

          {/* Thẻ Khí Linh Tương Tác nếu vũ khí đã có hồn */}
          {selectedWeapon?.infusedSoul && (
            <LivingSpiritCard
              weapon={selectedWeapon}
              player={player}
              onInteract={handleInteractWithSpirit}
              onFeed={(matId, amt) => handleFeedSpirit(selectedWeapon.id, matId, amt, player, setPlayer!)}
              externalDialogue={spiritDialogueBubble}
            />
          )}
        </div>

        {/* CỘT PHẢI (5/12): DANH MỤC THẦN BINH & PHONG MA HỒN CHÂU */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. CHỌN THẦN BINH MỤC TIÊU */}
          <div className="p-4 rounded-xl bg-[#0b0817] border border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-xs text-purple-200 flex items-center gap-1.5">
                <Sword className="w-3.5 h-3.5 text-purple-400" />
                <span>1. Chọn Thần Binh Tế Luyện:</span>
              </h3>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setWeaponFilter('all')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    weaponFilter === 'all' ? 'bg-purple-800 text-purple-100 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setWeaponFilter('equipped')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    weaponFilter === 'equipped' ? 'bg-purple-800 text-purple-100 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Đang mặc
                </button>
                <button
                  type="button"
                  onClick={() => setWeaponFilter('inventory')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    weaponFilter === 'inventory' ? 'bg-purple-800 text-purple-100 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Túi đồ
                </button>
              </div>
            </div>

            {/* Danh sách Thần Binh */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredWeapons.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500 font-serif">
                  Không tìm thấy Thần Binh hoặc Pháp Bảo phù hợp.
                </div>
              ) : (
                filteredWeapons.map(({ item, source, label }) => {
                  const isSelected = selectedWeaponId === item.id;
                  const hasSoul = Boolean(item.infusedSoul);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectWeapon(item.id)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-purple-900/60 border-purple-400 text-purple-100 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                          : 'bg-black/30 border-purple-950/40 text-zinc-400 hover:border-purple-800/60 hover:text-zinc-200'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-serif font-bold text-xs flex items-center gap-1.5 flex-wrap">
                          <span className={isSelected ? 'text-amber-200' : 'text-zinc-300'}>
                            [{convertGradeToGiai(item.grade)}] {item.name}
                          </span>
                          {item.enhancement > 0 && (
                            <span className="text-[10px] font-mono text-cyan-300 font-bold">
                              +{item.enhancement}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                          <span>{label}</span>
                          {hasSoul && (
                            <span className="text-amber-400 font-semibold">
                              • Khí Linh: {item.infusedSoul?.soulName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isSelected ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-700 text-white font-mono font-bold">
                            Đã Đặt
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. CHỌN PHONG MA HỒN CHÂU */}
          <div className="p-4 rounded-xl bg-[#0b0817] border border-purple-900/40 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-xs text-purple-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. Chọn Phong Ma Hồn Châu:</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                5 Cổ Hồn Tiêu Chuẩn
              </span>
            </div>

            {/* Danh mục 5 Hồn Phách Thần Thú */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {availableSoulsList.map(soul => {
                const isSelected = selectedSoulItemId === soul.id;
                const isRealmMet = currentRealmIndex >= soul.requiredRealmIndex;
                const isOwned = soul.ownedCount > 0;

                return (
                  <div
                    key={soul.id}
                    onClick={() => handleSelectSoulItem(soul.id)}
                    className={`p-2.5 rounded-lg border transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-400 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                        : 'bg-black/30 border-purple-950/40 text-zinc-400 hover:border-purple-800/60 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-xs flex items-center gap-1.5">
                          <span>{soul.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-purple-950 text-purple-300 border border-purple-800">
                            Hệ {soul.element}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          Tính cách: <strong className="text-zinc-300">{SPIRIT_PERSONALITY_NAMES[soul.personality]}</strong>
                        </div>
                      </div>

                      <div className="text-right text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          isOwned
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}>
                          {isOwned ? `Có: ${soul.ownedCount}` : 'Chưa có'}
                        </span>
                      </div>
                    </div>

                    {/* Hiệu ứng Proc tóm tắt */}
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1 border-t border-purple-950/40">
                      <span className="text-amber-300 truncate max-w-[200px]">
                        ⚡ {soul.baseProc.name} ({Math.round(soul.baseProc.triggerChance * 100)}%)
                      </span>

                      {!isRealmMet ? (
                        <span className="text-rose-400 flex items-center gap-0.5">
                          <Lock className="w-3 h-3" /> Cảnh giới {soul.requiredRealmIndex}
                        </span>
                      ) : (
                        <span className="text-emerald-400">Đủ cảnh giới</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODAL THỨC TỈNH THẦN BINH KHI THÀNH CÔNG */}
      <SoulAwakeningModal
        isOpen={awakenedModalOpen}
        onClose={() => setAwakenedModalOpen(false)}
        weapon={justAwakenedWeapon}
      />
    </div>
  );
};
