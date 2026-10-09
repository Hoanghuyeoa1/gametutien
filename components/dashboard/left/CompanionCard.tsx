// components/dashboard/left/CompanionCard.tsx
// Hiển thị Đạo Lữ Đồng Hành Sánh Bước & Buff Song Tu (thuần túy, không chứa Linh Điền)
import React from 'react';
import { Heart, Shield, Crown } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import { COMPANIONS_MAP } from '@/lib/companions-data';
import { TabType } from './types';

export interface CompanionCardProps {
  player: PlayerStats;
  setSelectedCompanionId: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({
  player,
  setSelectedCompanionId,
  setActiveTab,
}) => {
  const compState = player.companionsState;
  const bondedList = Object.values(compState?.companions || {}).filter(c => c.isBonded);
  const activeComp = bondedList.find(c => c.id === compState?.activeCompanionId) || bondedList[0];
  const activeDef = activeComp ? COMPANIONS_MAP[activeComp.id] : null;
  const isTamTinhActive = Boolean(
    player.activeBuffs?.tamTinhThanDieu ||
    (compState?.tamTinhThanDieuUntil && Date.now() < compState.tamTinhThanDieuUntil)
  );

  return (
    <>
      {/* ĐẠO LỮ TIÊN DUYÊN */}
      <div className="bg-[#0e0e14] p-3 rounded-lg border border-rose-900/30 space-y-2 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-rose-400 font-serif font-bold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" /> ĐẠO LỮ TIÊN DUYÊN
          </span>
          {activeDef ? (
            <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-rose-950/70 text-rose-300 border-rose-600/50 flex items-center gap-1">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
              {bondedList.length} Đạo Lữ
            </span>
          ) : (
            <span className="text-[9px] px-2 py-0.5 rounded border font-mono bg-zinc-900 text-zinc-400 border-zinc-700">
              Chưa Kết Duyên
            </span>
          )}
        </div>

        {activeDef && activeComp ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeDef.avatarGradient} flex items-center justify-center text-lg shadow-[0_0_12px_rgba(244,63,94,0.35)] shrink-0`}>
                {activeDef.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 truncate flex items-center gap-1">
                  <span>{activeDef.name}</span>
                  <span className="text-[10px] text-amber-300 font-normal font-serif">({activeDef.title})</span>
                </div>
                <div className="text-[10px] text-rose-300/80 font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="text-zinc-400">{activeDef.initialRealm}</span>
                  <span>•</span>
                  <span className="text-rose-400 font-serif">Đã Kết Duyên</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 italic line-clamp-2 font-serif">
              &quot;{activeDef.quote}&quot;
            </p>

            {/* Buff Bị Động & Tâm Tịnh Thần Diệu */}
            <div className="bg-black/40 p-2 rounded border border-rose-950/60 space-y-1 text-[10px] font-mono">
              <div className="text-rose-300 font-serif font-medium flex items-center justify-between">
                <span>Gia Trì Đạo Lữ:</span>
                {isTamTinhActive && (
                  <span className="text-[9px] text-amber-300 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-600/40 animate-pulse font-serif">
                    ✨ Tâm Tịnh Thần Diệu
                  </span>
                )}
              </div>
              <div className="text-[10px] text-rose-200/90 leading-relaxed space-y-0.5 font-serif">
                {activeDef.buffs.cultivateSpeedBonus && <div>• +{activeDef.buffs.cultivateSpeedBonus}% Tốc độ tu luyện</div>}
                {activeDef.buffs.tamMaDamageReduction && <div>• Giảm {activeDef.buffs.tamMaDamageReduction}% sát thương Tâm Ma</div>}
                {activeDef.buffs.critDmgBonus && <div>• +{activeDef.buffs.critDmgBonus}% Sát thương Bạo Kích</div>}
                {activeDef.buffs.lifestealPercent && <div>• Tăng {activeDef.buffs.lifestealPercent}% Hút Máu chiến đấu</div>}
                {activeDef.buffs.alchemySuccessBonus && <div>• +{activeDef.buffs.alchemySuccessBonus}% Tỉ lệ Luyện Đan</div>}
                {activeDef.buffs.atkBonusPercent && <div>• +{activeDef.buffs.atkBonusPercent}% Công Kích & Trợ Chiến Boss</div>}
                {activeDef.buffs.ngoTinhBonus && <div>• +{activeDef.buffs.ngoTinhBonus} Ngộ Tính & +{activeDef.buffs.khiVanBonus} Khí Vận</div>}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCompanionId(activeDef.id);
                setActiveTab('daolu');
              }}
              className="w-full py-1.5 rounded bg-gradient-to-r from-rose-950/70 via-pink-950/70 to-purple-950/70 hover:brightness-125 text-rose-200 border border-rose-700/50 text-[10px] font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Heart className="w-3 h-3 text-rose-400" />
              <span>Đến Tiên Duyên Cùng Nàng</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 py-1 text-center">
            <p className="text-[10px] text-zinc-400 italic font-serif">
              Đạo lộ trường sinh xa xăm cô quạnh, chưa có hồng nhan sánh bước.
            </p>
            <button
              onClick={() => setActiveTab('daolu')}
              className="w-full py-1.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-800/40 text-[10px] font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3 h-3 text-rose-400" />
              <span>Tầm Kiếm Tiên Duyên</span>
            </button>
          </div>
        )}
      </div>

      {/* PHÁP BẢO HỘ THÂN (Tóm tắt trang bị hiện tại) */}
      <div className="bg-[#0e0e14] p-3 rounded-lg border border-amber-900/20 space-y-2">
        <div className="flex justify-between items-center text-xs font-serif font-bold text-zinc-300">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Shield className="w-3.5 h-3.5" /> PHÁP BẢO HỘ THÂN
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">4 Vị Trí</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
          <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
            ⚔️ {player.equipment?.weapon ? `${player.equipment.weapon.name} +${player.equipment.weapon.enhancement}` : 'Trống (Kiếm)'}
          </div>
          <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
            🛡️ {player.equipment?.armor ? `${player.equipment.armor.name} +${player.equipment.armor.enhancement}` : 'Trống (Giáp)'}
          </div>
          <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
            📿 {player.equipment?.accessory ? `${player.equipment.accessory.name} +${player.equipment.accessory.enhancement}` : 'Trống (Phù)'}
          </div>
          <div className="p-1.5 rounded bg-zinc-900/60 border border-zinc-800 truncate">
            💍 {player.equipment?.artifact ? `${player.equipment.artifact.name} +${player.equipment.artifact.enhancement}` : 'Trống (Nhẫn)'}
          </div>
        </div>
      </div>
    </>
  );
};
