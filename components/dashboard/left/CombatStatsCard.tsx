// components/dashboard/left/CombatStatsCard.tsx
import React from 'react';
import { Swords, Flame, Heart, Droplet, RefreshCw, Shield, Eye, Wind, Target, Sparkles, Activity } from 'lucide-react';
import { PlayerStats } from '@/lib/types';

export interface CombatStatsCardProps {
  player: PlayerStats;
  combatPower: number;
  combatStats: {
    atk: number;
    def: number;
    soul: number;
    speed: number;
    critRate: number;
    critDmg: number;
    dmgReduction?: number;
    hpRegenPercent?: number;
    soulSuppression?: boolean;
  };
  curHP: number;
  maxHP: number;
  hpPercent: number;
  curMP: number;
  maxMP: number;
  mpPercent: number;
  handleRestAndHeal: () => void;
}

export const CombatStatsCard: React.FC<CombatStatsCardProps> = ({
  player,
  combatPower,
  combatStats,
  curHP,
  maxHP,
  hpPercent,
  curMP,
  maxMP,
  mpPercent,
  handleRestAndHeal
}) => {
  return (
    <>
        <div className="bg-gradient-to-r from-[#1a1510] via-[#241a0f] to-[#1a1510] p-3 rounded-lg border border-amber-500/40 shadow-[0_0_15px_rgba(217,119,6,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-serif text-amber-400/70 tracking-wider">Chiến Lực Bản Thể</div>
              <div className="text-lg font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200">
                {combatPower.toLocaleString()}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-amber-400/60 font-mono text-right">
            Uy Trấn<br />Bát Hoang
          </span>
        </div>

        {/* BUFF ĐANG HIỆU LỰC (NẾU CÓ) */}
        {Boolean((player.activeBuffs?.combatBuffBattlesLeft ?? 0) > 0 || (player.activeBuffs?.breakthroughBonus ?? 0) > 0) && (
          <div className="p-2 rounded bg-amber-950/30 border border-amber-600/40 space-y-1 text-[11px]">
            {(player.activeBuffs?.combatBuffBattlesLeft ?? 0) > 0 && (
              <div className="text-rose-300 flex items-center gap-1 font-mono">
                <Flame className="w-3 h-3 text-rose-400" />
                <span>Cuồng Bạo: +{player.activeBuffs?.combatBuffPercent}% Sát Thương ({player.activeBuffs?.combatBuffBattlesLeft} trận)</span>
              </div>
            )}
            {(player.activeBuffs?.breakthroughBonus ?? 0) > 0 && (
              <div className="text-emerald-300 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Đột Phá Đan: +{player.activeBuffs?.breakthroughBonus}% Tỉ lệ</span>
              </div>
            )}
          </div>
        )}

        {/* THANH KHÍ HUYẾT (HP) & LINH LỰC (MP) */}
        <div className="space-y-2 bg-[#0e0e14] p-3 rounded-lg border border-amber-900/20">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-rose-400 flex items-center gap-1 font-serif">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" /> Khí Huyết (HP)
              </span>
              <span className="font-mono text-rose-300 text-[11px]">
                {curHP.toLocaleString()} / {maxHP.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-rose-950">
              <div
                className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-sky-400 flex items-center gap-1 font-serif">
                <Droplet className="w-3.5 h-3.5 text-sky-400 fill-sky-400/30" /> Chân Nguyên (MP)
              </span>
              <span className="font-mono text-sky-300 text-[11px]">
                {curMP.toLocaleString()} / {maxMP.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-sky-950">
              <div
                className="bg-gradient-to-r from-sky-700 via-cyan-500 to-blue-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                style={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleRestAndHeal}
            className="w-full mt-1 py-1.5 px-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-200 transition flex items-center justify-center gap-1.5 cursor-pointer font-serif"
            title="Hồi phục toàn bộ Khí Huyết và Chân Nguyên (Tốn 20 linh thạch)"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Vận Công Điều Tức (20 Linh Thạch)</span>
          </button>
        </div>

        {/* LƯỚI CHỈ SỐ CHIẾN ĐẤU CƠ BẢN (ATK, DEF, SOUL, SPD, CRIT) */}
        <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/20 space-y-2">
          <div className="flex justify-between items-center text-xs font-serif font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> THUỘC TÍNH CHIẾN ĐẤU
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Bản Thể Khí Tượng</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Công Kích (ATK) */}
            <div className="p-2 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between shadow-sm">
              <span className="text-amber-400/90 flex items-center gap-1.5 font-serif" title="Sát thương cơ bản khi xuất chiêu">
                <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Công Kích
              </span>
              <span className="font-mono font-bold text-amber-200">{combatStats.atk.toLocaleString()}</span>
            </div>

            {/* Phòng Ngự (DEF) */}
            <div className="p-2 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between shadow-sm">
              <span className="text-sky-400/90 flex items-center gap-1.5 font-serif" title="Giảm trực tiếp sát thương từ Boss/Thiên Kiếp">
                <Shield className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Phòng Ngự
              </span>
              <span className="font-mono font-bold text-sky-200">{combatStats.def.toLocaleString()}</span>
            </div>

            {/* Thần Thức (Soul / Perception) */}
            <div className="p-2 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between shadow-sm" title="Tăng né tránh đòn đánh và tỷ lệ phát hiện cơ duyên ẩn trong Bí Cảnh">
              <span className="text-purple-400/90 flex items-center gap-1.5 font-serif">
                <Eye className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Thần Thức
              </span>
              <span className="font-mono font-bold text-purple-200">{combatStats.soul.toLocaleString()}</span>
            </div>

            {/* Tốc Độ (SPD / Thân Pháp & Đòn Kép) */}
            <div
              className="p-2 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between shadow-sm cursor-help transition hover:border-emerald-500/50"
              title="Thân Pháp & Tiên Cơ:&#10;• Quyết định tiên cơ ra tay trước trong giao chiến.&#10;• Đòn Kép (Double Action): Khi Tốc Độ >= 1.5x đối thủ, có 35% tỷ lệ tung 2 đòn liên tiếp trong 1 lượt.&#10;• Né Tránh Tự Nhiên (Evasion): Chênh lệch Tốc Độ chuyển hóa tối đa 25% tỷ lệ Né Đòn hoàn toàn (Né Tránh • Huyễn Ảnh)."
            >
              <div className="flex flex-col">
                <span className="text-emerald-400/90 flex items-center gap-1.5 font-serif">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Tốc Độ
                </span>
                <span className="text-[9px] font-mono text-emerald-500/70">
                  Liên Kích • Né Tránh
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-200">{combatStats.speed}</span>
                <span className="text-[8.5px] font-mono text-zinc-500 block">Thân Pháp</span>
              </div>
            </div>

            {/* Bạo Kích (Crit Rate & Crit DMG) */}
            <div className="col-span-2 p-2 rounded bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between shadow-sm">
              <span className="text-rose-400/90 flex items-center gap-1.5 font-serif" title="Tỉ lệ bạo kích và bội số sát thương bạo">
                <Target className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Bạo Kích
              </span>
              <span className="font-mono font-bold text-rose-200">
                {combatStats.critRate}% <span className="text-zinc-600 font-normal">|</span> x{(combatStats.critDmg / 100).toFixed(1)} ST
              </span>
            </div>
          </div>
        </div>
    </>
  );
};
