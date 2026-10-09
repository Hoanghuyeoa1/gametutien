import React, { useState, useMemo } from 'react';
import {
  Flame,
  Sparkles,
  Sword,
  Shield,
  Zap,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  Award,
  Compass,
  CheckCircle2,
  Info,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { PlayerState } from '@/lib/types/player';
import {
  WeaponArchetypeId,
  OreElementProperty,
  MetallurgyOreInput
} from '@/lib/types/modular-metallurgy';
import {
  WEAPON_ARCHETYPES_REGISTRY,
  ALLOY_ORES_REGISTRY
} from '@/lib/modular-metallurgy-logic';
import { useModularForgingActions } from '@/hooks/useModularForgingActions';
import { ElementalRadarChart, RADAR_AXES } from './ElementalRadarChart';
import { ForgedRelicModal } from './ForgedRelicModal';

export interface ModularMetallurgySectionProps {
  player: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  showToast?: (msg: string) => void;
  addLog?: (title: string, msg: string, type: 'forging' | 'system' | 'danger') => void;
}

// 5 Nguyên liệu Hợp Kim Tiêu Chuẩn Thần Binh Các
interface AvailableAlloyOreOption {
  oreId: string;
  oreName: string;
  element: OreElementProperty;
  description: string;
  effectLabel: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

const STANDARD_ALLOY_ORES: AvailableAlloyOreOption[] = [
  {
    oreId: 'ore_canh_kim',
    oreName: 'Canh Kim Thạch',
    element: 'canh_kim',
    description: 'Chứa Canh Kim Chi Khí sắc bén vô song, chuyển hóa sát thương chuẩn.',
    effectLabel: '+15% Sát thương chuẩn',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    bgClass: 'bg-amber-950/30'
  },
  {
    oreId: 'ore_han_bang',
    oreName: 'Hàn Băng Tinh',
    element: 'han_bang',
    description: 'Băng Phách hàn khí ngưng trệ kinh mạch, làm chậm đáng kể tốc độ đối phương.',
    effectLabel: '-20% Tốc độ xuất chiêu',
    colorClass: 'text-sky-400',
    borderClass: 'border-sky-500/40',
    bgClass: 'bg-sky-950/30'
  },
  {
    oreId: 'ore_xich_hoa',
    oreName: 'Xích Hỏa Đồng',
    element: 'xich_hoa',
    description: 'Nung nấu Địa Hỏa chân diễm cuồn cuộn, thiêu đốt sinh lực liên tục.',
    effectLabel: '+12% Thiêu đốt DoT',
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-500/40',
    bgClass: 'bg-rose-950/30'
  },
  {
    oreId: 'huyen_thiet',
    oreName: 'Bách Luyện Huyền Thiết',
    element: 'huyen_thiet',
    description: 'Vạn Niên Huyền Thiết cứng cỏi bất hoại, hấp thu dư chấn và giảm thương tích.',
    effectLabel: '+10% Miễn thương',
    colorClass: 'text-slate-300',
    borderClass: 'border-slate-500/40',
    bgClass: 'bg-slate-900/40'
  },
  {
    oreId: 'ore_tinh_than',
    oreName: 'Tinh Thần Sa',
    element: 'tinh_than',
    description: 'Cát thiên thạch hấp thu tinh hoa tinh tú, hộ thể các huyệt đạo chí mạng.',
    effectLabel: '+10% Kháng bạo kích',
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-500/40',
    bgClass: 'bg-purple-950/30'
  }
];

export const ModularMetallurgySection: React.FC<ModularMetallurgySectionProps> = ({
  player,
  setPlayer,
  showToast,
  addLog
}) => {
  // Kết nối State Machine từ useModularForgingActions Hook
  const {
    selectedArchetype,
    selectedOreSlots,
    customWeaponName,
    isForging,
    lastForgedResult,
    activeOres,
    liveAlloyPreview,
    predictedWeaponName,
    validationError,
    canForge,
    handleSelectArchetype,
    handleSetOreSlot,
    handleClearSlots,
    handleSetCustomWeaponName,
    handleResetLastForgedResult,
    handleExecuteForging
  } = useModularForgingActions({
    player,
    showToast,
    addLog
  });

  // Modal chọn quặng cho từng slot (0 -> 3)
  const [activeSlotModalIndex, setActiveSlotModalIndex] = useState<number | null>(null);

  // Tổng hợp tỷ lệ ngũ hành cho biểu đồ Radar ngũ giác
  const elementBreakdown = useMemo<Record<OreElementProperty, number>>(() => {
    const map: Record<OreElementProperty, number> = {
      canh_kim: 0,
      han_bang: 0,
      xich_hoa: 0,
      huyen_thiet: 0,
      tinh_than: 0
    };
    if (liveAlloyPreview?.ores) {
      for (const item of liveAlloyPreview.ores) {
        map[item.element] = (map[item.element] || 0) + item.ratio;
      }
    }
    return map;
  }, [liveAlloyPreview?.ores]);

  // Lấy số lượng sở hữu thực tế của người chơi cho từng loại quặng
  const getOwnedOreQuantity = (oreId: string): number => {
    if (!player.inventory?.ores) return 0;
    // Tìm theo exact ID hoặc alias tương ứng
    const found = player.inventory.ores.find(
      o =>
        o.id === oreId ||
        (oreId === 'ore_canh_kim' && (o.id === 'thai_at_tinh_kim' || o.id === 'canh_kim_thach')) ||
        (oreId === 'ore_han_bang' && (o.id === 'bang_tinh_khoang' || o.id === 'han_bang_tinh')) ||
        (oreId === 'ore_xich_hoa' && (o.id === 'xich_hoa_dong')) ||
        (oreId === 'ore_tinh_than' && (o.id === 'item_u_hon_thach' || o.id === 'tinh_than_sa'))
    );
    return found ? found.quantity : 0;
  };

  // Nạp quặng vào slot
  const handlePickOreForSlot = (slotIndex: number, oreOpt: AvailableAlloyOreOption) => {
    const owned = getOwnedOreQuantity(oreOpt.oreId);
    // Mặc định khối lượng nạp vào lò là 20 hoặc tối thiểu số lượng sở hữu
    const initialWeight = Math.min(25, Math.max(5, owned > 0 ? owned : 15));
    handleSetOreSlot(slotIndex, {
      oreId: oreOpt.oreId,
      oreName: oreOpt.oreName,
      element: oreOpt.element,
      weight: initialWeight
    });
    setActiveSlotModalIndex(null);
  };

  // Cập nhật khối lượng thanh trượt Slider
  const handleChangeSlotWeight = (slotIndex: number, newWeight: number) => {
    const current = selectedOreSlots[slotIndex];
    if (!current) return;
    handleSetOreSlot(slotIndex, {
      ...current,
      weight: Math.max(1, newWeight)
    });
  };

  // Archetype list
  const archetypes = Object.values(WEAPON_ARCHETYPES_REGISTRY);

  return (
    <div className="space-y-6">
      {/* Banner Giới Thiệu Cổ Phong */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900/90 to-stone-950 border border-amber-600/40 shadow-lg overflow-hidden cophong-corner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-[11px] font-serif text-amber-300 mb-1">
              <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Thần Binh Các • Đoán Cốt Hợp Kim</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-black text-amber-200 tracking-wide drop-shadow-sm">
              Tự Chọn Phôi Khí & Phối Trộn Ngũ Hành Thần Khoáng
            </h2>
            <p className="text-xs text-stone-300 font-serif max-w-2xl mt-1 leading-relaxed">
              Dung hợp từ 2 đến 4 loại khoáng thạch để đúc thần binh độc bản. Phối trộn nguyên tố
              quyết định sát thương chuẩn, tê liệt, thiêu đốt chân khí và độ tinh khiết của linh khí.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-stone-950/80 border border-amber-500/30 text-right">
              <span className="text-stone-400 text-[10px] block font-serif">Thần Binh Đã Đúc</span>
              <span className="text-amber-400 font-bold">
                {player.modularMetallurgyState?.craftedWeaponsCount || 0} thanh
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* KHU VỰC 1: CHỌN PHÔI KHÍ KHỞI NGUYÊN (ARCHETYPE CARDS)                  */}
      {/* ======================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h3 className="font-serif font-bold text-sm text-amber-200 uppercase tracking-wider">
              1. Khởi Tạo Phôi Khí Khởi Nguyên
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-serif italic">
            Mỗi phôi khí mang hệ số cộng hưởng chiến đấu khác biệt
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {archetypes.map(archetype => {
            const isSelected = selectedArchetype === archetype.id;
            return (
              <div
                key={archetype.id}
                onClick={() => handleSelectArchetype(archetype.id)}
                className={`relative p-3.5 rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] bg-gradient-to-b from-amber-950/60 to-stone-900 border border-amber-400/80'
                    : 'bg-stone-900/60 hover:bg-stone-900/90 border border-stone-800/80 hover:border-amber-700/50'
                }`}
              >
                {/* Header card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl p-1.5 rounded-lg bg-stone-950/80 border border-amber-900/40">
                      {archetype.icon || '🗡️'}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-serif border ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                          : 'bg-stone-950 text-stone-400 border-stone-700'
                      }`}
                    >
                      {isSelected ? 'Đang Chọn' : 'Nhấp Chọn'}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-amber-200">
                    {archetype.vietnameseName}
                  </h4>
                  <p className="text-[11px] text-stone-400 font-serif mt-1 line-clamp-2 leading-relaxed">
                    {archetype.description}
                  </p>
                </div>

                {/* Stat Modifiers Badges */}
                <div className="mt-3 pt-2.5 border-t border-stone-800/80 space-y-1 text-[10.5px] font-mono">
                  {archetype.atkMultiplier !== 1.0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Công Kích:</span>
                      <span className={archetype.atkMultiplier > 1 ? 'text-amber-400 font-bold' : 'text-stone-400'}>
                        x{archetype.atkMultiplier}
                      </span>
                    </div>
                  )}
                  {archetype.speedMultiplier && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Tốc Độ:</span>
                      <span className={archetype.speedMultiplier >= 1 ? 'text-purple-400 font-bold' : 'text-rose-400'}>
                        x{archetype.speedMultiplier}
                      </span>
                    </div>
                  )}
                  {archetype.critRateBonus && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Bạo Kích:</span>
                      <span className="text-yellow-400 font-bold">
                        +{(archetype.critRateBonus * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {archetype.armorPenBonus && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Xuyên Giáp:</span>
                      <span className="text-rose-400 font-bold">
                        +{(archetype.armorPenBonus * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {archetype.damageReductionBonus && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Miễn Thương:</span>
                      <span className="text-cyan-400 font-bold">
                        +{(archetype.damageReductionBonus * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  {archetype.skillDamageBonus && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Sát Thương Phép:</span>
                      <span className="text-sky-400 font-bold">
                        +{(archetype.skillDamageBonus * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* KHU VỰC 2 & 3: LÒ NUNG HỢP KIM & BIỂU ĐỒ RADAR DỰ BÁO THIÊN CƠ           */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KHU VỰC 2: LÒ NUNG HỢP KIM ĐA NGUYÊN (CRUCIBLE 4 SLOTS) - Chiếm 7 cột */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 backdrop-blur-md border border-amber-800/40 shadow-xl relative overflow-hidden">
            {/* Background Foundry Ambience */}
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-sm text-amber-200">
                  Lò Nung Ngũ Hành (4 Vị Trí Khoáng Thạch)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-400">
                  Đã nạp: <span className="text-amber-400 font-bold">{activeOres.length}/4</span> slot
                </span>
                {activeOres.length > 0 && (
                  <button
                    onClick={handleClearSlots}
                    className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700/60 transition cursor-pointer"
                    title="Làm rỗng các slot"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 4 Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              {[0, 1, 2, 3].map(slotIndex => {
                const ore = selectedOreSlots[slotIndex];
                const owned = ore ? getOwnedOreQuantity(ore.oreId) : 0;
                const isInsufficient = ore ? owned < ore.weight : false;

                return (
                  <div
                    key={slotIndex}
                    className={`relative p-3 rounded-xl border transition-all ${
                      ore
                        ? isInsufficient
                          ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                          : 'bg-stone-900/80 border-amber-600/40 shadow-sm'
                        : 'bg-stone-950/60 border-stone-800/80 border-dashed hover:border-amber-600/50'
                    }`}
                  >
                    {ore ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {ore.element === 'canh_kim' && '✨'}
                              {ore.element === 'han_bang' && '❄️'}
                              {ore.element === 'xich_hoa' && '🔥'}
                              {ore.element === 'huyen_thiet' && '🛡️'}
                              {ore.element === 'tinh_than' && '🔮'}
                            </span>
                            <div>
                              <h5 className="font-serif font-bold text-xs text-amber-200">
                                {ore.oreName}
                              </h5>
                              <span className="text-[10px] text-stone-400 font-mono">
                                Tồn kho: <span className={owned >= ore.weight ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{owned}</span> thỏi
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setActiveSlotModalIndex(slotIndex)}
                              className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] transition cursor-pointer"
                              title="Đổi quặng khác"
                            >
                              Đổi
                            </button>
                            <button
                              onClick={() => handleSetOreSlot(slotIndex, null)}
                              className="p-1 rounded bg-stone-800 hover:bg-rose-950/80 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                              title="Gỡ quặng khỏi slot"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Slider điều chỉnh khối lượng nung */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10.5px] font-mono">
                            <span className="text-stone-400">Khối lượng nung:</span>
                            <span className="text-amber-400 font-bold">{ore.weight} thỏi</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={ore.weight}
                            onChange={e =>
                              handleChangeSlotWeight(slotIndex, parseInt(e.target.value, 10))
                            }
                            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                          <div className="flex justify-between text-[9px] text-stone-500 font-mono">
                            <span>5 thỏi</span>
                            <span>25 thỏi</span>
                            <span>50 thỏi</span>
                          </div>
                        </div>

                        {isInsufficient && (
                          <div className="text-[10px] text-rose-400 font-serif flex items-center gap-1 pt-1 border-t border-rose-900/40">
                            <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>Kho thiếu hụt nguyên liệu (cần {ore.weight}, có {owned})</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveSlotModalIndex(slotIndex)}
                        className="w-full py-5 flex flex-col items-center justify-center gap-1.5 text-stone-400 hover:text-amber-300 transition cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-full bg-stone-900 group-hover:bg-amber-950/60 border border-stone-700 group-hover:border-amber-500/60 flex items-center justify-center text-amber-400/80 transition shadow-inner">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="font-serif text-xs">Slot {slotIndex + 1}: Nạp Khoáng Thạch</span>
                        <span className="text-[10px] text-stone-500 font-serif">Nhấp để mở kho</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Weapon Name Input */}
            <div className="pt-2 border-t border-amber-900/30 space-y-1.5">
              <label className="text-xs font-serif text-stone-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Ban Đạo Hiệu / Đặt Tên Thần Binh (Tùy Chọn):</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Mặc định: ${predictedWeaponName}`}
                  value={customWeaponName}
                  onChange={e => handleSetCustomWeaponName(e.target.value)}
                  maxLength={30}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900/80 border border-amber-700/40 focus:border-amber-400 text-amber-200 text-xs font-serif placeholder:text-stone-600 focus:outline-none transition shadow-inner"
                />
                {customWeaponName && (
                  <button
                    onClick={() => handleSetCustomWeaponName('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-200 px-1.5 py-0.5 rounded bg-stone-800"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Error & Warning Notification */}
            {validationError && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-300 text-xs font-serif flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Button: KHAI LÒ LUYỆN KHÍ */}
            <div className="mt-4">
              <button
                disabled={!canForge || isForging}
                onClick={() => {
                  if (setPlayer) {
                    handleExecuteForging(player, setPlayer);
                  }
                }}
                className={`w-full py-3 px-4 rounded-xl font-serif font-black text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  canForge && !isForging
                    ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-stone-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-[0.98] cursor-pointer'
                    : 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed opacity-60'
                }`}
              >
                {isForging ? (
                  <>
                    <Flame className="w-4 h-4 text-amber-950 animate-bounce" />
                    <span>LÒ LUYỆN ĐANG NUNG ĐÚC THẦN BINH...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>KHAI LÒ LUYỆN KHÍ • ĐOÁN CỐT THẦN BINH</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* KHU VỰC 3: BIỂU ĐỒ RADAR NGŨ HÀNH & DỰ BÁO THIÊN CƠ - Chiếm 5 cột */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 backdrop-blur-md border border-amber-800/40 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif font-bold text-sm text-amber-200">
                  Dự Báo Thiên Cơ & Ngũ Hành Trục
                </h3>
              </div>
              <span className="text-[10px] font-serif text-stone-400">
                Tự động suy diễn
              </span>
            </div>

            {/* Radar Chart Component */}
            <div className="py-2 flex justify-center">
              <ElementalRadarChart
                size={270}
                elementBreakdown={elementBreakdown}
                dominantElement={liveAlloyPreview?.dominantElement}
                purityScore={liveAlloyPreview?.purityScore}
              />
            </div>

            {/* Real-time Derived Stats Forecast Box */}
            <div className="mt-3 p-3.5 rounded-xl bg-stone-900/90 border border-amber-900/40 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="text-xs text-stone-400 font-serif">Thần Binh Dự Kiến:</span>
                <span className="text-xs font-serif font-bold text-amber-300">
                  {predictedWeaponName}
                </span>
              </div>

              {liveAlloyPreview ? (
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 font-serif">Nguyên Tố Chủ Đạo:</span>
                    <span className="text-amber-400 font-bold capitalize">
                      {liveAlloyPreview.dominantElement.replace('_', ' ')} (
                      {(liveAlloyPreview.dominantRatio * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 font-serif">Độ Tinh Khiết Hợp Kim:</span>
                    <span className="text-emerald-400 font-bold">
                      {liveAlloyPreview.purityScore.toFixed(1)}%
                    </span>
                  </div>

                  {liveAlloyPreview.elementalStats.trueDamagePercent > 0 && (
                    <div className="flex justify-between items-center text-amber-300">
                      <span className="font-serif">Sát thương chuẩn:</span>
                      <span className="font-bold">
                        +{liveAlloyPreview.elementalStats.trueDamagePercent.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {liveAlloyPreview.elementalStats.slowSpeedPercent > 0 && (
                    <div className="flex justify-between items-center text-sky-400">
                      <span className="font-serif">Làm chậm xuất chiêu:</span>
                      <span className="font-bold">
                        -{liveAlloyPreview.elementalStats.slowSpeedPercent.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {liveAlloyPreview.elementalStats.burnDamagePercent > 0 && (
                    <div className="flex justify-between items-center text-rose-400">
                      <span className="font-serif">Thiêu đốt chân khí:</span>
                      <span className="font-bold">
                        +{liveAlloyPreview.elementalStats.burnDamagePercent.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {liveAlloyPreview.elementalStats.damageReductionPercent > 0 && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="font-serif">Miễn thương nhận vào:</span>
                      <span className="font-bold">
                        +{liveAlloyPreview.elementalStats.damageReductionPercent.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  {liveAlloyPreview.elementalStats.critResistPercent > 0 && (
                    <div className="flex justify-between items-center text-purple-400">
                      <span className="font-serif">Kháng bạo kích:</span>
                      <span className="font-bold">
                        +{liveAlloyPreview.elementalStats.critResistPercent.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-3 text-center text-xs text-stone-500 font-serif italic">
                  Chưa nạp đủ khoáng thạch. Cần tối thiểu 2 loại khoáng thạch khác nhau để ngưng tụ
                  hợp kim.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODAL CHỌN KHOÁNG THẠCH CHO SLOT                                        */}
      {/* ======================================================================= */}
      {activeSlotModalIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#181512] to-[#0c0a08] border border-amber-600/50 shadow-2xl p-4 sm:p-5 text-stone-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-sm text-amber-200">
                  Chọn Khoáng Thạch Cho Slot {activeSlotModalIndex + 1}
                </h4>
              </div>
              <button
                onClick={() => setActiveSlotModalIndex(null)}
                className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 rounded bg-stone-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {STANDARD_ALLOY_ORES.map(oreOpt => {
                const owned = getOwnedOreQuantity(oreOpt.oreId);
                const isAlreadySelected = selectedOreSlots.some(
                  (slot, idx) => idx !== activeSlotModalIndex && slot?.element === oreOpt.element
                );

                return (
                  <div
                    key={oreOpt.oreId}
                    onClick={() => {
                      if (!isAlreadySelected) {
                        handlePickOreForSlot(activeSlotModalIndex, oreOpt);
                      }
                    }}
                    className={`p-3 rounded-xl border transition flex items-center justify-between ${
                      isAlreadySelected
                        ? 'opacity-40 bg-stone-950 border-stone-800 cursor-not-allowed'
                        : 'bg-stone-900/80 hover:bg-stone-800/90 border-amber-800/40 hover:border-amber-500 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs text-amber-200">
                          {oreOpt.oreName}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${oreOpt.borderClass} ${oreOpt.colorClass} ${oreOpt.bgClass}`}
                        >
                          {oreOpt.effectLabel}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-stone-400 font-serif">
                        {oreOpt.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-[10px] text-stone-500 block font-serif">Sở hữu</span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          owned > 0 ? 'text-amber-400' : 'text-stone-500'
                        }`}
                      >
                        {owned} thỏi
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL THẦN BINH XUẤT THẾ (FORGED RELIC MODAL)                           */}
      {/* ======================================================================= */}
      <ForgedRelicModal
        isOpen={lastForgedResult !== null}
        equipment={lastForgedResult}
        onClose={handleResetLastForgedResult}
        player={player}
        setPlayer={setPlayer}
        showToast={showToast}
      />
    </div>
  );
};
