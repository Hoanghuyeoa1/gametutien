// components/tabs/CustomRecipePanel.tsx
// Phân hệ "Đan Đạo Tông Sư • Khai Sáng Đan Phương"
// Phong cách: Cổ Phong (Dark Mystic, Tiên Hiệp UI)

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Flame,
  Sparkles,
  Plus,
  X,
  Check,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Scroll,
  BookOpen,
  Award,
  ArrowRight,
  RotateCcw,
  Trash2,
  HelpCircle,
  Coins,
  Shield,
  Search,
  Filter,
  Eye,
  Dice5
} from 'lucide-react';
import { PlayerStats, Herb } from '@/lib/types';
import {
  useCustomRecipeActions
} from '@/hooks/useCustomRecipeActions';
import {
  ExperimentSlot,
  CustomDanRecipe,
  HerbThermalProperty
} from '@/lib/types/custom-recipe';
import { audioEngine } from '@/lib/audio-engine';

export interface CustomRecipePanelProps {
  player: PlayerStats;
  setPlayer?: (player: PlayerStats) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, content: string, type: 'alchemy' | 'sect' | 'system' | 'danger') => void;
  onBackToCauldron?: () => void;
}

// Helper biểu tượng và phong cách nhiệt tính thảo dược
export function getThermalBadge(thermal: HerbThermalProperty | string, thermalScore?: number) {
  const score = thermalScore !== undefined ? thermalScore : (
    thermal === 'dai_han' ? -2 :
    thermal === 'han' ? -1 :
    thermal === 'binh' ? 0 :
    thermal === 'nhiet' ? 1 : 2
  );

  if (score <= -2) {
    return {
      icon: '❄️',
      label: 'Đại Hàn',
      score: '-2',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]',
      colorClass: 'text-cyan-300'
    };
  }
  if (score === -1) {
    return {
      icon: '🌊',
      label: 'Hàn',
      score: '-1',
      badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.3)]',
      colorClass: 'text-blue-300'
    };
  }
  if (score === 0) {
    return {
      icon: '🌿',
      label: 'Bình',
      score: '0',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
      colorClass: 'text-emerald-300'
    };
  }
  if (score === 1) {
    return {
      icon: '🔥',
      label: 'Nhiệt',
      score: '+1',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
      colorClass: 'text-amber-300'
    };
  }
  return {
    icon: '☄️',
    label: 'Đại Nhiệt',
    score: '+2',
    badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.3)]',
    colorClass: 'text-rose-300'
  };
}

export const CustomRecipePanel: React.FC<CustomRecipePanelProps> = ({
  player,
  setPlayer,
  showToast,
  addLog,
  onBackToCauldron
}) => {
  // Custom Hook điều phối toàn bộ nghiệp vụ
  const {
    experimentSlots,
    liveEvaluation,
    isInnovating,
    discoveredRecipes,
    totalResearchAttempts,
    handleAssignHerb,
    handleRemoveHerb,
    handleClearAllSlots,
    handleExecuteInnovation,
    handleArchiveToSect,
    suggestDanName,
    getBlackMarketValuation,
    getHerbInfoForSlot,
    getInventoryHerbQuantity
  } = useCustomRecipeActions({
    player,
    setPlayer: setPlayer || (() => {}),
    showToast,
    addLog
  });

  // State quản lý Modal chọn thảo dược
  const [activeSlotModalIndex, setActiveSlotModalIndex] = useState<number | null>(null);
  const [herbSearchQuery, setHerbSearchQuery] = useState<string>('');
  const [herbThermalFilter, setHerbThermalFilter] = useState<'all' | 'han' | 'binh' | 'nhiet'>('all');
  const [selectedHerbCount, setSelectedHerbCount] = useState<number>(1);

  // State quản lý Modal Khai Sáng Đan Phương
  const [isInnovationModalOpen, setIsInnovationModalOpen] = useState<boolean>(false);
  const [customDanName, setCustomDanName] = useState<string>('');
  const [customDanLore, setCustomDanLore] = useState<string>('');
  const [isSubmittingInnovation, setIsSubmittingInnovation] = useState<boolean>(false);

  // Lấy danh sách thảo dược trong túi
  const inventoryHerbs: Herb[] = useMemo(() => {
    return player.inventory?.herbs || [];
  }, [player.inventory?.herbs]);

  // Lọc thảo dược trong Modal
  const filteredHerbs = useMemo(() => {
    return inventoryHerbs.filter(herb => {
      const prop = getHerbInfoForSlot(herb.id);
      const nameMatch = herb.name.toLowerCase().includes(herbSearchQuery.toLowerCase());
      if (!nameMatch) return false;

      if (herbThermalFilter === 'han') {
        return prop.thermalScore < 0;
      }
      if (herbThermalFilter === 'binh') {
        return prop.thermalScore === 0;
      }
      if (herbThermalFilter === 'nhiet') {
        return prop.thermalScore > 0;
      }
      return true;
    });
  }, [inventoryHerbs, herbSearchQuery, herbThermalFilter, getHerbInfoForSlot]);

  // Xử lý mở Modal chọn thảo dược cho slot
  const handleOpenHerbPicker = (slotIdx: number) => {
    setActiveSlotModalIndex(slotIdx);
    setHerbSearchQuery('');
    setHerbThermalFilter('all');
    setSelectedHerbCount(1);
    audioEngine.playSFX('click');
  };

  // Xác nhận nạp thảo dược vào slot
  const handleConfirmSelectHerb = (herbId: string, count: number) => {
    if (activeSlotModalIndex === null) return;
    handleAssignHerb(activeSlotModalIndex, herbId, count);
    setActiveSlotModalIndex(null);
    audioEngine.playSFX('alchemy');
  };

  // Mở Modal Khai Sáng
  const handleOpenInnovationModal = () => {
    if (!liveEvaluation.isReadyToInnovate) {
      showToast?.('⚠️ Chỉ có thể khai lò khi Dược Khí Âm Dương Điều Hòa (>= 3 vị thảo mộc)!');
      return;
    }
    const defaultName = suggestDanName();
    setCustomDanName(defaultName);
    setCustomDanLore(`Do Đan Đạo Tông Sư ${player.name || 'Vô Danh Chân Nhân'} tự thân ngộ đạo, phối chế tinh hoa ngũ hành thiên địa mà thành.`);
    setIsInnovationModalOpen(true);
    audioEngine.playSFX('click');
  };

  // Thực hiện [Khắc Dấu Khai Sáng]
  const handleConfirmInnovateOnly = async () => {
    if (!customDanName.trim()) {
      showToast?.('⚠️ Vui lòng nhập tên cho Đan Phương Độc Bản!');
      return;
    }
    setIsSubmittingInnovation(true);
    try {
      const created = await handleExecuteInnovation(customDanName, customDanLore);
      if (created) {
        setIsInnovationModalOpen(false);
        audioEngine.playSFX('breakthrough');
      }
    } finally {
      setIsSubmittingInnovation(false);
    }
  };

  // Thực hiện [Hiến Tặng Tông Môn] trực tiếp từ Modal
  const handleConfirmInnovateAndArchive = async () => {
    if (!customDanName.trim()) {
      showToast?.('⚠️ Vui lòng nhập tên cho Đan Phương Độc Bản!');
      return;
    }
    setIsSubmittingInnovation(true);
    try {
      const created = await handleExecuteInnovation(customDanName, customDanLore);
      if (created) {
        handleArchiveToSect(created.id);
        setIsInnovationModalOpen(false);
        audioEngine.playSFX('breakthrough');
      }
    } finally {
      setIsSubmittingInnovation(false);
    }
  };

  // Đếm slot đã nạp
  const occupiedSlotsCount = experimentSlots.filter(s => s !== null).length;

  return (
    <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
      {/* ========================================================================= */}
      {/* 1. HEADER BANNER: Đan Đạo Tông Sư • Khai Sáng Đan Phương                 */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#18120c] via-[#221810] to-[#18120c] border border-amber-600/50 shadow-lg relative overflow-hidden">
        {/* Glow hoa văn cổ phong mờ nền */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <Compass className="w-5 h-5 animate-spin duration-3000" />
              </div>
              <h2 className="font-serif font-black text-base text-amber-100 tracking-wide flex items-center gap-2">
                <span>Đan Đạo Tông Sư</span>
                <span className="text-amber-500/80">•</span>
                <span className="text-yellow-400">Khai Sáng Đan Phương</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-600/40">
                  Tự Sáng Lập
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-serif leading-relaxed max-w-xl">
              Tự do phối hợp 3 - 5 vị linh thảo, điều hòa dược tính Âm Dương, tinh chế độc dược thành tiên đan. Đan phương độc bản sáng lập có thể khắc dấu truyền thừa hoặc hiến tặng Tông Môn để chấn hưng giáo phái!
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {onBackToCauldron && (
              <button
                onClick={onBackToCauldron}
                className="px-3 py-1.5 rounded-lg bg-black/50 hover:bg-zinc-900 border border-amber-900/60 text-amber-300 text-xs font-serif transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Về Lò Luyện Đan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Thanh chỉ số thống kê */}
        <div className="mt-3 pt-3 border-t border-amber-900/40 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-black/40 border border-amber-900/30">
            <span className="text-[10px] text-zinc-500 block">Đan Phương Đã Khai</span>
            <span className="font-serif font-bold text-amber-300 text-sm">
              {discoveredRecipes.length} Phương
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-amber-900/30">
            <span className="text-[10px] text-zinc-500 block">Lượt Thử Nghiệm</span>
            <span className="font-serif font-bold text-yellow-400 text-sm">
              {totalResearchAttempts} Lần
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/40 border border-amber-900/30">
            <span className="text-[10px] text-zinc-500 block">Hiến Tặng Tông Môn</span>
            <span className="font-serif font-bold text-emerald-400 text-sm">
              {player.customRecipeState?.sectArchivedRecipeIds?.length || 0} Phương
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BÀN THỬ NGHIỆM NGŨ VỊ (CRUCIBLE SLOTS)                                */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#150f0b] via-[#100c08] to-[#0a0805] border border-amber-700/50 shadow-inner relative space-y-4">
        {/* Vòng tròn Bát Quái trận đồ trang trí nền */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-80 h-80 rounded-full border-4 border-dashed border-amber-400 animate-spin duration-3000" />
        </div>

        {/* Top Header của Bàn Nung */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-900/50 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="font-serif font-bold text-xs text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bàn Thử Nghiệm Ngũ Vị • Đỉnh Lò Bát Quái</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Badge điều kiện kích hoạt: >= 3 slot */}
            {occupiedSlotsCount >= 3 ? (
              <span className="text-[10.5px] font-serif font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đủ Điều Kiện Kích Hoạt ({occupiedSlotsCount}/5 Slot)</span>
              </span>
            ) : (
              <span className="text-[10.5px] font-serif px-2.5 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Chưa Đủ Slot ({occupiedSlotsCount}/5 - Cần tối thiểu 3 vị)</span>
              </span>
            )}

            {/* Nút xóa sạch slots */}
            {occupiedSlotsCount > 0 && (
              <button
                onClick={() => {
                  handleClearAllSlots();
                  audioEngine.playSFX('click');
                }}
                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 text-[10.5px] font-serif transition cursor-pointer flex items-center gap-1"
                title="Thanh lọc bàn nung"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Thanh Lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Ô LÒ NUNG HÌNH VÒNG TRÒN / BÁT QUÁI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {experimentSlots.map((slot, index) => {
            if (!slot) {
              return (
                <div
                  key={`slot_empty_${index}`}
                  onClick={() => handleOpenHerbPicker(index)}
                  className="group p-3 rounded-xl border border-dashed border-amber-600/40 hover:border-amber-400 bg-black/40 hover:bg-amber-950/20 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] text-center space-y-2 relative"
                >
                  <div className="w-10 h-10 rounded-full border border-amber-600/30 group-hover:border-amber-400 bg-amber-950/20 group-hover:bg-amber-900/40 flex items-center justify-center transition-all group-hover:scale-110">
                    <Plus className="w-5 h-5 text-amber-400/80 group-hover:text-amber-200" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-xs text-amber-300/80 group-hover:text-amber-200 block">
                      Vị Thứ {index + 1}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                      + Nạp Thảo Dược
                    </span>
                  </div>
                </div>
              );
            }

            const herbInfo = getHerbInfoForSlot(slot.herbId);
            const badge = getThermalBadge(herbInfo.thermal, herbInfo.thermalScore);
            const owned = getInventoryHerbQuantity(slot.herbId);

            return (
              <div
                key={`slot_occupied_${index}`}
                className="p-3 rounded-xl bg-gradient-to-b from-[#18110b] to-[#100c08] border border-amber-600/60 shadow-[0_0_12px_rgba(245,158,11,0.15)] flex flex-col justify-between min-h-[140px] relative space-y-2"
              >
                {/* Header slot: Tên vị & Nút gỡ */}
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/50">
                    Vị {index + 1}
                  </span>
                  <button
                    onClick={() => {
                      handleRemoveHerb(index);
                      audioEngine.playSFX('click');
                    }}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                    title="Gỡ thảo dược này"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Nội dung thảo dược */}
                <div className="space-y-1 text-center py-1">
                  <div className="font-serif font-black text-xs text-amber-100 truncate" title={herbInfo.name}>
                    {herbInfo.name}
                  </div>

                  {/* Badge tính khí (❄️ Hàn / 🌿 Bình / 🔥 Nhiệt) */}
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.badgeClass}`}>
                      {badge.icon} {badge.label} ({badge.score})
                    </span>
                  </div>

                  <div className="text-[9.5px] text-zinc-400 font-mono flex items-center justify-center gap-2 pt-0.5">
                    <span className="text-emerald-400">Bổ: {herbInfo.tonicValue}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-rose-400">Độc: {herbInfo.toxicityValue}</span>
                  </div>
                </div>

                {/* Footer slot: Số lượng & Nút đổi */}
                <div className="flex justify-between items-center pt-1 border-t border-amber-900/40 text-[10px]">
                  <span className="font-mono text-amber-300/90 font-bold">
                    x{slot.count} <span className="text-zinc-500 font-normal">/ {owned}</span>
                  </span>

                  <button
                    onClick={() => handleOpenHerbPicker(index)}
                    className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-600/40 text-[9.5px] font-serif transition cursor-pointer"
                  >
                    Đổi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LA BÀN ÂM DƯƠNG DƯỢC TÍNH (LIVE HARMONY COMPASS)                      */}
      {/* ========================================================================= */}
      {(() => {
        const thermal = liveEvaluation.thermalTotal;
        const isCold = thermal < -1;
        const isHot = thermal > 1;
        const isHarmonious = thermal >= -1 && thermal <= 1;

        // Container border & glow styling
        let containerStyle = 'border-zinc-800 bg-[#0e0c0a] text-zinc-300';
        if (occupiedSlotsCount >= 3) {
          if (isCold) {
            containerStyle = 'border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] bg-gradient-to-r from-cyan-950/40 via-[#10141e] to-cyan-950/40 text-cyan-200';
          } else if (isHot) {
            containerStyle = 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.4)] bg-gradient-to-r from-rose-950/40 via-[#1e1014] to-rose-950/40 text-rose-200';
          } else if (isHarmonious) {
            containerStyle = 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] bg-gradient-to-r from-amber-950/50 via-[#1c140d] to-amber-950/50 text-amber-100';
          }
        }

        // Tỷ lệ Bổ vs Độc
        const totalSum = (liveEvaluation.totalTonic + liveEvaluation.totalToxicity) || 1;
        const tonicPercent = Math.min(100, Math.round((liveEvaluation.totalTonic / totalSum) * 100));
        const toxicityPercent = 100 - tonicPercent;

        return (
          <div className={`p-4 rounded-2xl border transition-all duration-500 space-y-3.5 ${containerStyle}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">☯️</span>
                <span className="font-serif font-black text-sm tracking-wide">
                  La Bàn Âm Dương Dược Tính
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 border border-current opacity-80">
                  Live Harmony Compass
                </span>
              </div>

              {/* Trạng thái cân bằng text */}
              <div>
                {occupiedSlotsCount < 3 ? (
                  <span className="text-xs font-serif text-zinc-400 italic">
                    Chưa nạp đủ 3 vị thảo dược để tạo đan khí
                  </span>
                ) : isCold ? (
                  <span className="text-xs font-serif font-bold text-cyan-300 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-cyan-400" />
                    <span>LỆCH ÂM: Dược Khí Quá Hàn • Cảnh Báo Đông Kết Nổ Lò!</span>
                  </span>
                ) : isHot ? (
                  <span className="text-xs font-serif font-bold text-rose-300 flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>LỆCH DƯƠNG: Dược Khí Quá Nhiệt • Cảnh Báo Cháy Khét Phế Đan!</span>
                  </span>
                ) : (
                  <span className="text-xs font-serif font-black text-yellow-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin duration-3000" />
                    <span>Âm Dương Điều Hòa • Dược Khí Thăng Hoa!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thanh Đo Nhiệt Tính Âm Dương (-5 đến +5) */}
            <div className="space-y-1.5 bg-black/50 p-3 rounded-xl border border-current/20">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span className="text-cyan-400 flex items-center gap-1">
                  ❄️ Đại Hàn (-5)
                </span>
                <span className="text-amber-300 font-bold">
                  ☯️ Thái Cực Trung Hòa (0)
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  🔥 Đại Nhiệt (+5)
                </span>
              </div>

              {/* Slider meter */}
              <div className="relative h-3 w-full rounded-full bg-zinc-900 overflow-hidden border border-zinc-700/60">
                {/* Vùng màu nền: Cyan (Âm) -> Amber (Cân bằng) -> Rose (Dương) */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-yellow-400 to-rose-600 opacity-70" />

                {/* Vùng an toàn hoàng kim ở giữa [-1, +1] tương đương 40% -> 60% */}
                <div className="absolute left-[40%] right-[40%] top-0 bottom-0 bg-amber-300/40 border-x border-amber-300" />

                {/* Kim chỉ thị vị trí live */}
                {occupiedSlotsCount >= 3 && (
                  <div
                    className="absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] transition-all duration-300 border border-black"
                    style={{
                      left: `${Math.max(5, Math.min(95, ((thermal + 5) / 10) * 100))}%`
                    }}
                  />
                )}
              </div>

              <div className="flex justify-between items-center text-[10.5px] font-mono pt-1">
                <span className="text-zinc-400">
                  Tổng Nhiệt Tính: <strong className={isCold ? 'text-cyan-300' : isHot ? 'text-rose-300' : 'text-amber-300'}>
                    {thermal > 0 ? `+${thermal}` : thermal}
                  </strong>
                </span>

                <span className="text-zinc-400">
                  Khoảng Điều Hòa: <strong className="text-amber-300 font-bold">-1 ≤ Thermal ≤ +1</strong>
                </span>
              </div>
            </div>

            {/* Thanh hiển thị Tỷ Lệ Bổ Dưỡng vs Độc Tính */}
            <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-current/20">
              <div className="flex justify-between items-center text-[11px] font-serif">
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span>🌿 Dược Lực Đại Bổ:</span>
                  <span className="font-mono text-xs">{liveEvaluation.totalTonic}</span>
                </span>

                <span className="text-[10px] font-mono text-zinc-400">
                  Độ Thuần Khiết: <strong className="text-amber-300">{tonicPercent}%</strong>
                </span>

                <span className="text-rose-400 flex items-center gap-1 font-bold">
                  <span>☠️ Đan Độc Tạp Chất:</span>
                  <span className="font-mono text-xs">{liveEvaluation.totalToxicity}</span>
                </span>
              </div>

              {/* Progress bar Bổ vs Độc */}
              <div className="h-2.5 w-full rounded-full bg-zinc-900 overflow-hidden flex border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${tonicPercent}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-purple-600 transition-all duration-300"
                  style={{ width: `${toxicityPercent}%` }}
                />
              </div>
            </div>

            {/* Preview Chỉ Số Thành Phẩm Dự Kiến (Khi có đánh giá) */}
            {liveEvaluation.evaluation && (
              <div className="p-3 rounded-xl bg-black/60 border border-amber-600/40 space-y-2">
                <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                  <div className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dự Kiến Đan Dược:</span>
                    <span className="text-yellow-300">
                      {liveEvaluation.evaluation.predictedGrade} (Bậc {liveEvaluation.evaluation.predictedTier})
                    </span>
                  </div>

                  <div className="font-mono text-[10.5px] text-zinc-400">
                    Hòa Hợp: <strong className="text-emerald-400">{liveEvaluation.evaluation.harmonyScore}%</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10.5px] font-mono">
                  <div className="p-1.5 rounded bg-amber-950/40 border border-amber-900/40">
                    <span className="text-zinc-400 block text-[9.5px]">Tu Vi Tăng Thêm</span>
                    <span className="text-yellow-400 font-bold">
                      +{liveEvaluation.evaluation.predictedEffectValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-1.5 rounded bg-rose-950/40 border border-rose-900/40">
                    <span className="text-zinc-400 block text-[9.5px]">Đan Độc Nhiễm Thân</span>
                    <span className="text-rose-400 font-bold">
                      +{liveEvaluation.evaluation.predictedToxicity}
                    </span>
                  </div>

                  <div className="p-1.5 rounded bg-zinc-900/80 border border-zinc-700/40 col-span-2 sm:col-span-1">
                    <span className="text-zinc-400 block text-[9.5px]">Đánh Giá Dược Lý</span>
                    <span className="text-zinc-300 truncate block" title={liveEvaluation.evaluation.message}>
                      {liveEvaluation.evaluation.message}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. NÚT HÀNH ĐỘNG: KHAI LÒ SÁNG CHẾ                                      */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <button
          onClick={handleOpenInnovationModal}
          disabled={!liveEvaluation.isReadyToInnovate || isInnovating}
          className={`w-full py-3.5 rounded-xl font-serif font-black text-sm tracking-wide transition cursor-pointer flex items-center justify-center gap-2.5 shadow-xl ${
            !liveEvaluation.isReadyToInnovate || isInnovating
              ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 hover:brightness-110 text-stone-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-pulse'
          }`}
        >
          <Flame className="w-5 h-5 text-amber-950" />
          <span>Khai Lò Sáng Chế • Đan Phương Độc Bản</span>
          <Sparkles className="w-4 h-4 text-amber-950" />
        </button>

        {!liveEvaluation.isReadyToInnovate && (
          <p className="text-[10.5px] text-zinc-500 text-center font-serif">
            {occupiedSlotsCount < 3
              ? 'Cần nạp tối thiểu 3 vị thảo dược để bắt đầu hòa hợp dược tính.'
              : 'Dược tính chưa đạt trạng thái Âm Dương Điều Hòa (-1 ≤ Thermal ≤ +1). Hãy điều chỉnh phối phương!'}
          </p>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. DANH MỤC ĐAN PHƯƠNG TỰ SÁNG LẬP (DISCOVERED RECIPES)                   */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#140f0b] via-[#100c08] to-[#080604] border border-amber-800/40 space-y-3.5 shadow-md">
        <div className="flex justify-between items-center border-b border-amber-900/50 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-xs text-amber-100 uppercase tracking-wide">
              Đan Phương Tự Sáng Lập ({discoveredRecipes.length})
            </h3>
          </div>

          <span className="text-[10px] font-mono text-zinc-400">
            Tông Thư Truyền Thế
          </span>
        </div>

        {discoveredRecipes.length === 0 ? (
          <div className="p-8 text-center space-y-2 border border-dashed border-amber-900/40 rounded-xl bg-black/20">
            <Scroll className="w-8 h-8 mx-auto text-amber-600/40" />
            <p className="font-serif text-xs text-zinc-400">
              Chưa có đan phương nào được sáng lập.
            </p>
            <p className="text-[10px] text-zinc-500 max-w-sm mx-auto font-serif">
              Hãy phối hợp các vị thảo mộc trên Bàn Nung Ngũ Vị, cân bằng Âm Dương và khai lò để ghi danh vào Thiên Thư!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {discoveredRecipes.map(recipe => {
              const valuation = getBlackMarketValuation(recipe.id);
              const isArchived = recipe.isArchivedInSect || (player.customRecipeState?.sectArchivedRecipeIds || []).includes(recipe.id);

              return (
                <div
                  key={recipe.id}
                  className="p-3.5 rounded-xl bg-black/50 border border-amber-700/50 hover:border-amber-500 transition-all space-y-2.5 relative group shadow-sm"
                >
                  {/* Top Bar của Card */}
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif font-black text-sm text-amber-200">
                          {recipe.name}
                        </span>
                        <span className="text-[9.5px] font-mono px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                          Độc Bản
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300">
                          {recipe.grade} (Bậc {recipe.tier})
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-serif">
                        Sáng lập bởi: <strong className="text-amber-300">{recipe.creatorName}</strong> • {new Date(recipe.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Hiến tặng Tông Môn badge / button */}
                    <div>
                      {isArchived ? (
                        <span className="text-[10px] font-serif font-bold px-2 py-1 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Đã Khắc Bản Tại Tàng Kinh Các</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            handleArchiveToSect(recipe.id);
                            audioEngine.playSFX('breakthrough');
                          }}
                          className="px-2.5 py-1 rounded bg-gradient-to-r from-emerald-800 to-teal-700 hover:brightness-110 text-emerald-100 text-[10.5px] font-serif font-bold border border-emerald-500/60 shadow-sm transition cursor-pointer flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3 text-emerald-300" />
                          <span>Hiến Tặng Tông Môn</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lore / Văn bia */}
                  {recipe.lore && (
                    <p className="text-[10.5px] text-amber-300/80 italic font-serif bg-black/40 p-2 rounded border border-amber-900/30">
                      "{recipe.lore}"
                    </p>
                  )}

                  {/* Chỉ số dược hiệu & Nguyên liệu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Cột chỉ số */}
                    <div className="p-2 rounded-lg bg-black/40 border border-amber-900/40 space-y-1 font-mono text-[10.5px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Dược Lực Tu Vi:</span>
                        <strong className="text-yellow-400">+{recipe.effectValue.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Đan Độc Tạp Chất:</span>
                        <strong className="text-rose-400">{recipe.toxicity}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Hòa Hợp Âm Dương:</span>
                        <strong className="text-emerald-400">{recipe.harmonyScore}%</strong>
                      </div>
                    </div>

                    {/* Cột phối phương linh thảo */}
                    <div className="p-2 rounded-lg bg-black/40 border border-amber-900/40 space-y-1 text-[10.5px]">
                      <div className="font-serif font-bold text-amber-300 text-[10px]">
                        Phối Phương ({recipe.herbsRequired.length} Vị):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.herbsRequired.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700/60 text-zinc-300 font-mono text-[10px]"
                          >
                            {item.herbName} x{item.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Thẩm định Hắc Thị */}
                  {valuation && (
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-950/30 to-black/40 border border-purple-800/40 flex justify-between items-center gap-2 text-[10.5px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-zinc-300">Định Giá Hắc Thị:</span>
                        <strong className="text-amber-300 font-bold">
                          {valuation.startingBid.toLocaleString()} - {valuation.estimatedFinalBid.toLocaleString()} Linh Thạch
                        </strong>
                      </div>
                      <span className="px-2 py-0.2 rounded-full bg-purple-900/60 border border-purple-600/40 text-purple-200 text-[9.5px]">
                        {valuation.rarityLabel} (x{valuation.multiplier.toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL CHỌN THẢO DƯỢC (HERB PICKER MODAL)                               */}
      {/* ========================================================================= */}
      {activeSlotModalIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#18120c] via-[#120e0a] to-[#080705] border border-amber-600/60 p-5 space-y-4 shadow-2xl">
            {/* Header Modal */}
            <div className="flex justify-between items-center border-b border-amber-900/60 pb-2.5">
              <div className="font-serif font-bold text-sm text-amber-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Nạp Linh Thảo Vào Vị Thứ {activeSlotModalIndex + 1}</span>
              </div>
              <button
                onClick={() => setActiveSlotModalIndex(null)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm linh thảo trong túi trữ vật..."
                  value={herbSearchQuery}
                  onChange={(e) => setHerbSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-amber-900/50 text-xs text-amber-100 focus:outline-none focus:border-amber-500 font-serif"
                />
              </div>

              {/* Bộ lọc tính khí (Hàn / Bình / Nhiệt) */}
              <div className="flex items-center gap-1.5 text-[11px] font-serif">
                <span className="text-zinc-500 flex items-center gap-1 text-[10px]">
                  <Filter className="w-3 h-3" /> Lọc:
                </span>
                <button
                  onClick={() => setHerbThermalFilter('all')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    herbThermalFilter === 'all'
                      ? 'bg-amber-900/80 text-amber-200 border border-amber-600/50'
                      : 'bg-black/40 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Tất Cả
                </button>
                <button
                  onClick={() => setHerbThermalFilter('han')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    herbThermalFilter === 'han'
                      ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/60'
                      : 'bg-black/40 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  ❄️ Hàn Tính
                </button>
                <button
                  onClick={() => setHerbThermalFilter('binh')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    herbThermalFilter === 'binh'
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/60'
                      : 'bg-black/40 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  🌿 Bình Tính
                </button>
                <button
                  onClick={() => setHerbThermalFilter('nhiet')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    herbThermalFilter === 'nhiet'
                      ? 'bg-rose-950 text-rose-200 border border-rose-500/60'
                      : 'bg-black/40 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  🔥 Nhiệt Tính
                </button>
              </div>
            </div>

            {/* Danh sách thảo dược */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {filteredHerbs.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500 italic font-serif">
                  Không tìm thấy linh thảo phù hợp trong Túi Trữ Vật.
                </div>
              ) : (
                filteredHerbs.map(herb => {
                  const prop = getHerbInfoForSlot(herb.id);
                  const badge = getThermalBadge(prop.thermal, prop.thermalScore);
                  const isCurrentSlotHerb = experimentSlots[activeSlotModalIndex]?.herbId === herb.id;

                  return (
                    <div
                      key={herb.id}
                      onClick={() => handleConfirmSelectHerb(herb.id, 1)}
                      className={`p-2.5 rounded-xl border flex justify-between items-center gap-2 text-xs cursor-pointer transition ${
                        isCurrentSlotHerb
                          ? 'bg-amber-950/60 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-black/40 border-amber-900/30 hover:border-amber-600/60 hover:bg-amber-950/30'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-amber-200 flex items-center gap-2">
                          <span>{herb.name}</span>
                          <span className={`text-[9.5px] px-2 py-0.2 rounded-full border font-mono ${badge.badgeClass}`}>
                            {badge.icon} {badge.label} ({badge.score})
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
                          <span className="text-emerald-400">Bổ: {prop.tonicValue}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-rose-400">Độc: {prop.toxicityValue}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-400">Phẩm: {herb.grade}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-emerald-400 text-xs font-bold">
                          Có: {herb.quantity}
                        </div>
                        <span className="text-[10px] font-serif text-amber-300 underline mt-0.5 block">
                          Chọn Nạp →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setActiveSlotModalIndex(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-serif text-xs transition cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL KHAI SÁNG ĐAN PHƯƠNG (INNOVATION MODAL)                           */}
      {/* ========================================================================= */}
      {isInnovationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c140d] via-[#140e09] to-[#080604] border border-amber-500/70 p-5 space-y-4 shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            {/* Header Modal */}
            <div className="flex justify-between items-center border-b border-amber-800/60 pb-2.5">
              <div className="font-serif font-black text-sm text-amber-100 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-yellow-400" />
                <span>Khai Sáng Đan Phương Độc Bản • Khắc Dấu Thiên Thư</span>
              </div>
              <button
                onClick={() => setIsInnovationModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ô nhập Tên Đan Phương */}
            <div className="space-y-1.5">
              <label className="font-serif font-bold text-xs text-amber-200 flex items-center justify-between">
                <span>Danh Xưng Đan Phương:</span>
                <button
                  type="button"
                  onClick={() => setCustomDanName(suggestDanName())}
                  className="text-[10.5px] font-serif text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span>Gợi Ý Tên Tiên Hiệp</span>
                </button>
              </label>
              <input
                type="text"
                value={customDanName}
                onChange={(e) => setCustomDanName(e.target.value)}
                placeholder="VD: Cửu Chuyển Hóa Thần Đan..."
                className="w-full px-3 py-2 rounded-xl bg-black/70 border border-amber-700/60 text-amber-100 text-xs font-serif focus:outline-none focus:border-amber-400 shadow-inner"
              />
            </div>

            {/* Ô nhập Văn Bia / Lore */}
            <div className="space-y-1.5">
              <label className="font-serif font-bold text-xs text-amber-200">
                Văn Bia & Ghi Chú Truyền Thừa (Lore):
              </label>
              <textarea
                rows={3}
                value={customDanLore}
                onChange={(e) => setCustomDanLore(e.target.value)}
                placeholder="Khắc ghi khẩu quyết hỏa hầu, cơ duyên đốn ngộ hoặc công hiệu nghịch thiên..."
                className="w-full px-3 py-2 rounded-xl bg-black/70 border border-amber-700/60 text-amber-100 text-xs font-serif focus:outline-none focus:border-amber-400 shadow-inner resize-none"
              />
            </div>

            {/* Card Preview Thành Phẩm */}
            {liveEvaluation.evaluation && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-black/60 to-amber-950/40 border border-amber-600/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif font-black text-amber-300">
                    Thành Phẩm: {liveEvaluation.evaluation.predictedGrade}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    Phẩm Giai: Bậc {liveEvaluation.evaluation.predictedTier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-black/50 border border-amber-900/40">
                    <span className="text-[9.5px] text-zinc-500 block">Tu Vi Tăng</span>
                    <span className="font-bold text-yellow-400">
                      +{liveEvaluation.evaluation.predictedEffectValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-amber-900/40">
                    <span className="text-[9.5px] text-zinc-500 block">Đan Độc</span>
                    <span className="font-bold text-rose-400">
                      +{liveEvaluation.evaluation.predictedToxicity}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-amber-900/40">
                    <span className="text-[9.5px] text-zinc-500 block">Hòa Hợp</span>
                    <span className="font-bold text-emerald-400">
                      {liveEvaluation.evaluation.harmonyScore}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2 NÚT HÀNH ĐỘNG CHÍNH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleConfirmInnovateOnly}
                disabled={isSubmittingInnovation}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-110 text-stone-950 font-serif font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-stone-950" />
                <span>{isSubmittingInnovation ? 'Đang Khắc Bản...' : 'Khắc Dấu Khai Sáng'}</span>
              </button>

              <button
                onClick={handleConfirmInnovateAndArchive}
                disabled={isSubmittingInnovation}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 hover:brightness-110 text-emerald-100 font-serif font-bold text-xs border border-emerald-500/60 shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-emerald-300" />
                <span>{isSubmittingInnovation ? 'Đang Hiến Tặng...' : 'Hiến Tặng Tông Môn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
