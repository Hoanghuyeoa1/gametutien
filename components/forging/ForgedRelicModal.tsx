import React from 'react';
import { Sparkles, Sword, Shield, Zap, Flame, Award, CheckCircle2, PackageCheck } from 'lucide-react';
import { Equipment } from '@/lib/types/items';
import { PlayerState } from '@/lib/types/player';
import { normalizePlayerData } from '@/lib/save-migration';
import { audioEngine } from '@/lib/audio-engine';

export interface ForgedRelicModalProps {
  isOpen: boolean;
  equipment: Equipment | null;
  onClose: () => void;
  player?: PlayerState;
  setPlayer?: (p: PlayerState) => void;
  showToast?: (msg: string) => void;
  onEquipSuccess?: (eq: Equipment) => void;
}

export const ForgedRelicModal: React.FC<ForgedRelicModalProps> = ({
  isOpen,
  equipment,
  onClose,
  player,
  setPlayer,
  showToast,
  onEquipSuccess
}) => {
  if (!isOpen || !equipment) return null;

  const metadata = equipment.alloyMetadata;
  const composition = metadata?.alloyComposition;
  const elementalStats = metadata?.elementalEffects || composition?.elementalStats;
  const trueDamage = elementalStats?.trueDamagePercent ?? 0;
  const slowSpeed = elementalStats?.slowSpeedPercent ?? 0;
  const burnDamage = elementalStats?.burnDamagePercent ?? 0;
  const damageReduction = elementalStats?.damageReductionPercent ?? 0;
  const critResist = elementalStats?.critResistPercent ?? 0;

  // Xử lý Trang Bị Ngay
  const handleEquipNow = () => {
    if (!player || !setPlayer) {
      showToast?.(`Đã lưu trữ [${equipment.name}] vào túi trữ vật.`);
      onClose();
      return;
    }

    try {
      audioEngine.playSwordSlashSound(0.8, false);
    } catch {
      // Fallback audio
    }

    const updated = { ...player };
    if (!updated.equipment) updated.equipment = {};

    const oldWeapon = updated.equipment.weapon;
    updated.equipment.weapon = equipment;

    // Quản lý kho đồ trang bị
    const currentEquipments = updated.inventory?.equipment || [];
    const filteredEquips = currentEquipments.filter(e => e.id !== equipment.id);
    if (oldWeapon) {
      filteredEquips.push(oldWeapon);
    }

    updated.inventory = {
      ...updated.inventory,
      pills: updated.inventory?.pills || [],
      herbs: updated.inventory?.herbs || [],
      ores: updated.inventory?.ores || [],
      equipment: filteredEquips
    };

    const normalized = normalizePlayerData(updated);
    setPlayer(normalized);

    const msg = oldWeapon
      ? `Đã trang bị [${equipment.name}], hoán chuyển [${oldWeapon.name}] vào Túi Trữ Vật!`
      : `Đã trang bị thần binh [${equipment.name}] vào ô Vũ Khí!`;

    showToast?.(msg);
    onEquipSuccess?.(equipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c1813] via-[#12100e] to-[#0a0908] border border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Glow Aura & Particle Backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-48 h-48 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header Modal */}
        <div className="relative px-5 pt-6 pb-4 border-b border-amber-800/40 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-[11px] font-serif text-amber-300 mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>THẦN BINH XUẤT THẾ • ĐOÁN CỐT THÀNH CÔNG</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600/40 to-stone-900 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.5)] my-1">
            {metadata?.archetypeId === 'phi_kiem' && '🗡️'}
            {metadata?.archetypeId === 'trong_kiem' && '⚔️'}
            {metadata?.archetypeId === 'bao_dinh' && '🏺'}
            {metadata?.archetypeId === 'tran_ky' && '🚩'}
            {!metadata?.archetypeId && '⚔️'}
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wider text-amber-300 drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)] mt-1">
            {equipment.name}
          </h2>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-amber-900/60 border border-amber-500/40 text-amber-200">
              {equipment.grade}
            </span>
            {metadata && (
              <span className="px-2 py-0.5 rounded bg-stone-900/80 border border-amber-600/30 text-amber-300/90 font-serif">
                Phôi: {metadata.archetypeName}
              </span>
            )}
            {metadata?.purity && (
              <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-yellow-300 font-mono">
                Tinh Khiết: {metadata.purity.toFixed(1)}%
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-stone-900/90 border border-stone-700/60 text-stone-300">
              Chiến Lực: +{equipment.powerBonus.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content Body Scrollable */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          {/* Mô tả thần binh */}
          <div className="p-3 rounded-xl bg-stone-950/70 border border-amber-900/30 text-stone-300 italic font-serif leading-relaxed">
            {equipment.description}
          </div>

          {/* Chỉ số chiến đấu cơ bản */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-serif font-bold text-amber-300/90 flex items-center gap-1.5">
              <Sword className="w-3.5 h-3.5 text-amber-400" />
              <span>Chỉ Số Tấn Công & Hộ Thể</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-900/40 text-center">
                <span className="text-[10px] text-stone-400 block font-serif">Công Kích</span>
                <span className="text-amber-300 font-mono font-bold text-sm">
                  +{equipment.atkBonus || 0}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-900/40 text-center">
                <span className="text-[10px] text-stone-400 block font-serif">Phòng Ngự</span>
                <span className="text-cyan-300 font-mono font-bold text-sm">
                  +{equipment.defBonus || 0}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-900/40 text-center">
                <span className="text-[10px] text-stone-400 block font-serif">Khí Huyết</span>
                <span className="text-emerald-300 font-mono font-bold text-sm">
                  +{equipment.hpBonus || 0}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-stone-900/80 border border-amber-900/40 text-center">
                <span className="text-[10px] text-stone-400 block font-serif">Thân Pháp</span>
                <span className="text-purple-300 font-mono font-bold text-sm">
                  +{equipment.speedBonus || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Thuộc tính hợp kim độc bản (Alloy Affixes) */}
          {elementalStats && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-serif font-bold text-amber-300/90 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Hiệu Ứng Hợp Kim Độc Bản (Ngũ Hành Uy Lực)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trueDamage > 0 && (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                    <span className="text-amber-200 font-serif">Canh Kim Sát Thương Chuẩn</span>
                    <span className="text-amber-400 font-mono font-bold">
                      +{trueDamage.toFixed(1)}%
                    </span>
                  </div>
                )}
                {slowSpeed > 0 && (
                  <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-500/40 flex items-center justify-between">
                    <span className="text-sky-200 font-serif">Hàn Băng Ngưng Trệ Tốc</span>
                    <span className="text-sky-400 font-mono font-bold">
                      -{slowSpeed.toFixed(1)}%
                    </span>
                  </div>
                )}
                {burnDamage > 0 && (
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
                    <span className="text-rose-200 font-serif">Xích Hỏa Thiêu Đốt DoT</span>
                    <span className="text-rose-400 font-mono font-bold">
                      +{burnDamage.toFixed(1)}%
                    </span>
                  </div>
                )}
                {damageReduction > 0 && (
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-500/40 flex items-center justify-between">
                    <span className="text-slate-200 font-serif">Huyền Thiết Giảm Thương</span>
                    <span className="text-slate-300 font-mono font-bold">
                      +{damageReduction.toFixed(1)}%
                    </span>
                  </div>
                )}
                {critResist > 0 && (
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                    <span className="text-purple-200 font-serif">Tinh Thần Kháng Bạo</span>
                    <span className="text-purple-400 font-mono font-bold">
                      +{critResist.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quặng dung hợp thành phần */}
          {composition?.ores && composition.ores.length > 0 && (
            <div className="p-2.5 rounded-xl bg-stone-900/50 border border-stone-800 text-[11px] space-y-1">
              <span className="text-stone-400 font-serif block">Thành phần khoáng thạch dung hợp:</span>
              <div className="flex flex-wrap gap-1.5">
                {composition.ores.map((ore, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-stone-800/80 border border-amber-900/30 text-stone-200 font-mono text-[10px]"
                  >
                    {ore.oreName}: {ore.weight} thỏi ({(ore.ratio * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-amber-900/40 bg-stone-950/90 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleEquipNow}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-stone-950 font-serif font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-stone-950" />
            <span>Trang Bị Ngay</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-600/40 font-serif text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-amber-400" />
            <span>Thu Vào Túi Trữ Vật</span>
          </button>
        </div>
      </div>
    </div>
  );
};
