// components/forging/InscriptionDrawer.tsx
// Drawer / Hộp thoại lựa chọn Trận Đồ để minh khắc vào Mạch Dẫn Linh
// 100% Strict TypeScript, Giao diện Cổ Phong Tiên Hiệp, Hỗ trợ Mobile & PC

import React, { useMemo } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Shield,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Scroll
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import { Equipment } from '@/lib/types/items';
import { FORMATION_INSCRIPTIONS_REGISTRY } from '@/lib/formation-inscription-logic';
import { FormationInscriptionConfig } from '@/lib/types/formation-inscription';
import { extractFlatInventory } from '@/hooks/useFormationInscriptionActions';

export interface InscriptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlotIndex: number | null;
  player: PlayerState;
  equipment: Equipment | null;
  onConfirmInscribe: (formationId: string) => void;
  isProcessing?: boolean;
}

const TIER_NAMES: Record<number, string> = {
  1: 'Nhất Giai',
  2: 'Nhị Giai',
  3: 'Tam Giai',
  4: 'Tứ Giai',
  5: 'Ngũ Giai',
  6: 'Lục Giai',
  7: 'Thất Giai',
  8: 'Bát Giai',
  9: 'Cửu Giai Thần Phẩm'
};

const TIER_COLORS: Record<number, { badge: string; border: string; text: string }> = {
  2: { badge: 'bg-emerald-950/60', border: 'border-emerald-500/50', text: 'text-emerald-300' },
  3: { badge: 'bg-cyan-950/60', border: 'border-cyan-500/50', text: 'text-cyan-300' },
  5: { badge: 'bg-amber-950/60', border: 'border-amber-500/50', text: 'text-amber-300' },
  6: { badge: 'bg-purple-950/60', border: 'border-purple-500/50', text: 'text-purple-300' },
  7: { badge: 'bg-rose-950/60', border: 'border-rose-500/50', text: 'text-rose-300' }
};

export const InscriptionDrawer: React.FC<InscriptionDrawerProps> = ({
  isOpen,
  onClose,
  targetSlotIndex,
  player,
  equipment,
  onConfirmInscribe,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  // Lấy danh sách vật phẩm trong kho đồ để kiểm tra số lượng
  const flatInventory = useMemo(() => {
    return extractFlatInventory(player?.inventory);
  }, [player?.inventory]);

  const playerDivineSense = player?.thanThuc ?? (player as any)?.divineSense ?? 0;

  // Danh sách các trận đồ đã được khắc trên các slot khác của cùng trang bị này (Anti-Duplicate Check)
  const existingFormationIds = useMemo(() => {
    if (!equipment?.inscriptionData?.conduits) return new Set<string>();
    return new Set(
      equipment.inscriptionData.conduits
        .filter(c => c.isUnlocked && c.inscribedFormationId && c.slotIndex !== targetSlotIndex)
        .map(c => c.inscribedFormationId as string)
    );
  }, [equipment, targetSlotIndex]);

  // Trợ thủ kiểm tra tồn kho một loại nguyên liệu
  const getMaterialAvailable = (matId: string, matName?: string): number => {
    let count = 0;
    for (const item of flatInventory) {
      if (!item) continue;
      if (item.id === matId || item.itemId === matId || (matName && item.name === matName)) {
        count += typeof item.quantity === 'number' ? item.quantity : (item.count || 1);
      }
    }
    return count;
  };

  const formationsList = Object.values(FORMATION_INSCRIPTIONS_REGISTRY);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Box Modal Cổ Phong */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#0f1422] via-[#090c15] to-[#06080e] border border-cyan-800/60 shadow-[0_0_35px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-900/40 bg-gradient-to-r from-cyan-950/40 via-transparent to-cyan-950/40">
          <div className="flex items-center gap-2.5">
            <Scroll className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif text-base font-bold text-amber-200 tracking-wide">
                Minh Khắc Trận Đồ Các
              </h3>
              <p className="text-[11px] font-mono text-cyan-300/80">
                Mục tiêu: Mạch Dẫn Linh #{typeof targetSlotIndex === 'number' ? targetSlotIndex + 1 : '?'} trên [
                {equipment?.name || 'Trang Bị'}]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh Thông Tin Thần Thức & Tài Nguyên Hiện Có */}
        <div className="px-5 py-2.5 bg-[#070a12] border-b border-cyan-900/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Thần Thức Tu Sĩ:</span>
            <strong className="text-amber-300 font-bold text-sm">
              {playerDivineSense.toLocaleString()}
            </strong>
          </div>
          <div className="text-[11px] text-zinc-400">
            Trận đồ tối đa trên cùng trang bị: <span className="text-zinc-200">Không trùng lặp</span>
          </div>
        </div>

        {/* Nội Dung Danh Sách Trận Đồ (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 pr-2 custom-scrollbar">
          {formationsList.map(formation => {
            const isDuplicate = existingFormationIds.has(formation.id);
            const hasEnoughSense = playerDivineSense >= formation.requiredDivineSense;

            // Kiểm tra từng nguyên liệu
            const materialsStatus = (formation.requiredMaterials || []).map(mat => {
              const owned = getMaterialAvailable(mat.id, mat.name);
              return {
                ...mat,
                owned,
                isEnough: owned >= mat.quantity
              };
            });

            const hasEnoughMaterials = materialsStatus.every(m => m.isEnough);
            const canInscribe = hasEnoughSense && hasEnoughMaterials && !isDuplicate && !isProcessing;

            const tierStyle = TIER_COLORS[formation.tier] || {
              badge: 'bg-zinc-900',
              border: 'border-zinc-700',
              text: 'text-zinc-300'
            };

            return (
              <div
                key={formation.id}
                className={`relative p-3.5 rounded-xl border transition-all duration-200 ${
                  isDuplicate
                    ? 'bg-black/40 border-stone-800 opacity-60'
                    : canInscribe
                    ? 'bg-gradient-to-r from-[#101726] to-[#0c101d] border-cyan-700/50 hover:border-cyan-400 shadow-sm'
                    : 'bg-[#0d101a] border-zinc-800/80'
                }`}
              >
                {/* Dòng Tiêu Đề & Phẩm Cấp */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${tierStyle.badge} ${tierStyle.border} ${tierStyle.text}`}
                    >
                      {TIER_NAMES[formation.tier] || `Cấp ${formation.tier}`}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-amber-200 tracking-wide">
                      {formation.name}
                    </h4>
                    {formation.vietnameseName && (
                      <span className="text-[11px] font-serif text-zinc-400 italic">
                        ({formation.vietnameseName})
                      </span>
                    )}
                  </div>

                  {/* Badge Báo Trùng Lặp nếu đã có trên trang bị */}
                  {isDuplicate && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/70 border border-rose-700/60 text-rose-300 font-bold shrink-0">
                      [Đã Khắc Trên Thân Khí]
                    </span>
                  )}
                </div>

                {/* Diễn Giải Hiệu Ứng Trận Đồ */}
                <div className="text-xs text-zinc-300 font-sans mb-3 pl-1 border-l-2 border-amber-500/40">
                  <p className="font-medium text-amber-300/90">{formation.description}</p>
                  {formation.lore && (
                    <p className="text-[11px] text-zinc-400/80 italic mt-0.5 font-serif">
                      "{formation.lore}"
                    </p>
                  )}
                </div>

                {/* Khối Điều Kiện Tiên Quyết: Thần Thức & Linh Mực */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-lg bg-black/50 border border-zinc-800/80 text-[11px] font-mono mb-3">
                  {/* Điều kiện Thần Thức */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Thần Thức yêu cầu:</span>
                    <span
                      className={`font-bold ${
                        hasEnoughSense ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formation.requiredDivineSense.toLocaleString()} ({hasEnoughSense ? 'Đạt' : 'Thiếu'})
                    </span>
                  </div>

                  {/* Chi phí Nguyên Liệu */}
                  <div className="space-y-1">
                    <div className="text-zinc-400">Tiêu hao vật phẩm:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {materialsStatus.map(mat => (
                        <span
                          key={mat.id}
                          className={`px-1.5 py-0.5 rounded border text-[10px] ${
                            mat.isEnough
                              ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                              : 'bg-rose-950/40 border-rose-700/50 text-rose-300'
                          }`}
                        >
                          {mat.name}: {mat.owned}/{mat.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nút Hành Động Khắc Ấn */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onConfirmInscribe(formation.id)}
                    disabled={!canInscribe}
                    className={`py-1.5 px-4 rounded-lg font-serif text-xs font-bold transition flex items-center gap-1.5 ${
                      canInscribe
                        ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {isDuplicate
                        ? 'Đã Khắc Trên Thần Binh'
                        : !hasEnoughSense
                        ? 'Thần Thức Chưa Đủ'
                        : !hasEnoughMaterials
                        ? 'Thiếu Linh Mực / Trận Sa'
                        : '⚡ Khắc Ấn Trận Đồ'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-900/30 bg-[#070910] flex justify-between items-center text-xs text-zinc-400">
          <span>* Trận văn chỉ có thể tẩy xóa bằng [Tẩy Thần Thủy].</span>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
