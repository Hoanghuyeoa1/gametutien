import React from 'react';
import { BookOpen, Zap, Sparkles, Plus, FlameKindling } from 'lucide-react';
import { PlayerStats, Manual } from '@/lib/types';
import { DEFAULT_MANUALS } from '@/lib/manuals-data';
import { getManualSynergy, ELEMENT_COLORS, ELEMENT_ICONS, ELEMENT_NAMES } from '@/lib/elemental-system';
import { ManualSynthesisView } from './ManualSynthesisView';
import { useManualSynthesisActions } from '@/hooks/useManualSynthesisActions';

export interface ManualsTabProps {
  player: PlayerStats;
  manualsSubTab: 'my_manuals' | 'tang_kinh_cac' | 'dung_hop';
  setManualsSubTab: (tab: 'my_manuals' | 'tang_kinh_cac' | 'dung_hop') => void;
  manualTypeFilter: 'all' | 'tam_phap' | 'the_thuat' | 'than_thong';
  setManualTypeFilter: (filter: 'all' | 'tam_phap' | 'the_thuat' | 'than_thong') => void;
  handleEquipManual: (manual: Manual, slot: 'tamPhap' | 'theThuat' | 'thanThong1' | 'thanThong2') => void;
  handleUnequipManual: (slot: 'tamPhap' | 'theThuat' | 'thanThong1' | 'thanThong2') => void;
  handleLevelUpManual: (manualId: string) => void;
  handleBuyManual: (manual: Manual) => void;
  synthesisActions: ReturnType<typeof useManualSynthesisActions>;
}

export const ManualsTab: React.FC<ManualsTabProps> = ({
  player,
  manualsSubTab,
  setManualsSubTab,
  manualTypeFilter,
  setManualTypeFilter,
  handleEquipManual,
  handleUnequipManual,
  handleLevelUpManual,
  handleBuyManual,
  synthesisActions
}) => {
  return (
    <div className="space-y-3">
      {/* Sub-tabs Công Pháp */}
      <div className="flex rounded-lg bg-[#0e0e15] p-1 border border-blue-900/30 text-xs gap-0.5">
        <button
          onClick={() => setManualsSubTab('my_manuals')}
          className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif ${
            manualsSubTab === 'my_manuals' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40' : 'text-zinc-400'
          }`}
        >
          Công Pháp ({(player.manuals || []).length})
        </button>
        <button
          onClick={() => setManualsSubTab('tang_kinh_cac')}
          className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif ${
            manualsSubTab === 'tang_kinh_cac' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40' : 'text-zinc-400'
          }`}
        >
          Tàng Kinh ({DEFAULT_MANUALS.filter(m => !(player.manuals || []).some(om => om.id === m.id)).length})
        </button>
        <button
          onClick={() => setManualsSubTab('dung_hop')}
          className={`flex-1 py-1 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1 ${
            manualsSubTab === 'dung_hop' ? 'bg-amber-700/30 text-amber-200 border border-amber-600/40' : 'text-zinc-400'
          }`}
        >
          <FlameKindling className="w-3 h-3" />
          Dung Hợp
        </button>
      </div>

      {/* Sub-tab 1: Công Pháp Đang Tu */}
      {manualsSubTab === 'my_manuals' && (
        <div className="space-y-3">
          {/* Bộ lọc phân loại */}
          <div className="flex gap-1 text-[10px] overflow-x-auto pb-0.5">
            <button
              onClick={() => setManualTypeFilter('all')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                manualTypeFilter === 'all' ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'bg-[#0d0d12] text-zinc-400'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setManualTypeFilter('tam_phap')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                manualTypeFilter === 'tam_phap' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40' : 'bg-[#0d0d12] text-zinc-400'
              }`}
            >
              Tâm Pháp
            </button>
            <button
              onClick={() => setManualTypeFilter('the_thuat')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                manualTypeFilter === 'the_thuat' ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40' : 'bg-[#0d0d12] text-zinc-400'
              }`}
            >
              Thể Thuật
            </button>
            <button
              onClick={() => setManualTypeFilter('than_thong')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                manualTypeFilter === 'than_thong' ? 'bg-rose-600/30 text-rose-200 border border-rose-500/40' : 'bg-[#0d0d12] text-zinc-400'
              }`}
            >
              Thần Thông
            </button>
          </div>

          {/* Danh sách công pháp */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {(() => {
              const filtered = (player.manuals || []).filter(m => manualTypeFilter === 'all' || m.type === manualTypeFilter);
              if (filtered.length === 0) {
                return (
                  <div className="py-10 text-center text-xs text-zinc-500 font-serif space-y-2">
                    <BookOpen className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
                    <p>Chưa lĩnh ngộ công pháp nào thuộc phân mục này.</p>
                    <p className="text-[10px] text-amber-400/80">
                      Hãy qua Tàng Kinh Các hoặc thám hiểm Bí Cảnh để tìm bí tịch!
                    </p>
                  </div>
                );
              }

              return filtered.map(manual => {
                const isMaxLevel = manual.level >= manual.maxLevel;
                const canLevelUp = !isMaxLevel &&
                  player.tuVi >= manual.tuViPerLevel &&
                  player.linhThach >= manual.linhThachPerLevel &&
                  player.ngoTinh >= manual.minNgoTinh;

                const typeBadge =
                  manual.type === 'tam_phap' ? 'text-blue-300 border-blue-800/40 bg-blue-950/30' :
                  manual.type === 'the_thuat' ? 'text-emerald-300 border-emerald-800/40 bg-emerald-950/30' :
                  'text-rose-300 border-rose-800/40 bg-rose-950/30';

                const typeName =
                  manual.type === 'tam_phap' ? 'Tâm Pháp' :
                  manual.type === 'the_thuat' ? 'Thể Thuật' : 'Thần Thông';

                const gradeBadge =
                  manual.grade === 'Thần Giai' ? 'text-rose-400 border-rose-700/50 bg-rose-950/40' :
                  manual.grade === 'Thiên Giai' ? 'text-purple-400 border-purple-700/50 bg-purple-950/40' :
                  manual.grade === 'Địa Giai' ? 'text-amber-300 border-amber-700/50 bg-amber-950/40' :
                  manual.grade === 'Huyền Giai' ? 'text-emerald-400 border-emerald-700/50 bg-emerald-950/40' :
                  'text-zinc-400 border-zinc-700/50 bg-zinc-900/40';

                const synergy = getManualSynergy(manual, player.linhCan);
                const isEquippedTamPhap = player.equippedManuals?.tamPhap === manual.id;
                const isEquippedTheThuat = player.equippedManuals?.theThuat === manual.id;
                const isEquippedTT1 = player.equippedManuals?.thanThong1 === manual.id;
                const isEquippedTT2 = player.equippedManuals?.thanThong2 === manual.id;

                return (
                  <div
                    key={manual.id}
                    className={`p-3 rounded-lg bg-[#0d0d14]/90 border transition space-y-2 ${
                      isMaxLevel ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/10 to-[#0d0d14]' : 'border-zinc-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-bold text-amber-200 text-xs">
                            {manual.name}
                          </h4>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] border ${gradeBadge}`}>
                            {manual.grade}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] border ${typeBadge}`}>
                            {typeName}
                          </span>
                          {manual.element && (
                            <span className={`px-1.5 py-0.2 rounded text-[9px] border font-mono ${ELEMENT_COLORS[manual.element] || 'text-zinc-300'}`}>
                              {ELEMENT_ICONS[manual.element]} {ELEMENT_NAMES[manual.element]}
                            </span>
                          )}
                          {synergy.isSynergy && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] border bg-amber-950/60 text-amber-300 border-amber-500/50 font-mono animate-pulse">
                              🔥 Trùng Hệ +50%
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                          {manual.description}
                        </p>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                        isMaxLevel ? 'text-amber-300 border-amber-500/50 bg-amber-950/50' : 'text-zinc-300 border-zinc-700 bg-zinc-900'
                      }`}>
                        Tầng {manual.level}/{manual.maxLevel}
                      </span>
                    </div>

                    {/* Hiệu quả hiện tại */}
                    <div className="bg-[#0a0a0f] p-2 rounded border border-zinc-800/60 text-[10px] space-y-1">
                      <div className="text-zinc-300 flex justify-between">
                        <span>Gia trì hiện tại (Tầng {manual.level}):</span>
                        <span className="text-emerald-400 font-mono">
                          {manual.type === 'tam_phap' && `+${manual.level * (manual.speedBonusPerLevel || 0)}% Tốc Độ Tu Luyện, +${manual.level * (manual.mpBonusPerLevel || 0)} MP`}
                          {manual.type === 'the_thuat' && `+${manual.level * (manual.hpBonusPerLevel || 0)} Khí Huyết Tối Đa`}
                          {manual.type === 'than_thong' && `+${(manual.level * (manual.powerBonusPerLevel || 0)).toLocaleString()} Chiến Lực Bản Thể`}
                          {synergy.isSynergy ? ' (x1.5 Linh Căn)' : ''}
                        </span>
                      </div>

                      {manual.activeSkill && (
                        <div className="bg-[#14121a] p-1.5 rounded border border-rose-900/40 text-[9px] space-y-0.5 text-zinc-300">
                          <div className="text-rose-300 font-serif font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Thần Thông Xuất Chiêu: [{manual.activeSkill.name}]</span>
                          </div>
                          <div className="text-zinc-400">
                            {manual.activeSkill.effectDescription} • Tiêu hao: <strong className="text-sky-300 font-mono">{manual.activeSkill.mpCost} MP</strong> • Sát thương: <strong className="text-amber-300 font-mono">x{(manual.activeSkill.damageMultiplier || 1.5).toFixed(1)}</strong>
                            {manual.activeSkill.shieldPercent ? ` • Khiên: +${manual.activeSkill.shieldPercent}% HP` : ''}
                          </div>
                        </div>
                      )}

                      {isMaxLevel ? (
                        <div className="text-amber-300 pt-1 border-t border-amber-900/30 flex items-start gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span>Viên Mãn Bí Pháp: <strong>[{manual.maxLevelPassive.name}]</strong> - {manual.maxLevelPassive.description}</span>
                        </div>
                      ) : (
                        <div className="text-zinc-500 pt-1 border-t border-zinc-800/40 flex items-center justify-between text-[9px]">
                          <span>Viên Mãn kích hoạt: [{manual.maxLevelPassive.name}]</span>
                          <span className="text-zinc-400">Yêu cầu Ngộ Tính: {manual.minNgoTinh}</span>
                        </div>
                      )}
                    </div>

                    {/* Điều khiển Trang Bị & Thăng Tầng */}
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        {manual.type === 'tam_phap' && (
                          isEquippedTamPhap ? (
                            <button
                              onClick={() => handleUnequipManual('tamPhap')}
                              className="px-2 py-1 rounded text-[9px] font-serif border bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
                            >
                              ✓ Đang Chủ Tu (Tháo Ra)
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquipManual(manual, 'tamPhap')}
                              className="px-2 py-1 rounded text-[9px] font-serif border bg-blue-950/60 border-blue-600/60 text-blue-300 hover:bg-blue-900/60 transition cursor-pointer"
                            >
                              Trang Bị Tâm Pháp
                            </button>
                          )
                        )}

                        {manual.type === 'the_thuat' && (
                          isEquippedTheThuat ? (
                            <button
                              onClick={() => handleUnequipManual('theThuat')}
                              className="px-2 py-1 rounded text-[9px] font-serif border bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
                            >
                              ✓ Đang Hộ Thân (Tháo Ra)
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEquipManual(manual, 'theThuat')}
                              className="px-2 py-1 rounded text-[9px] font-serif border bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60 transition cursor-pointer"
                            >
                              Trang Bị Thể Thuật
                            </button>
                          )
                        )}

                        {manual.type === 'than_thong' && (
                          isEquippedTT1 ? (
                            <button
                              onClick={() => handleUnequipManual('thanThong1')}
                              className="px-2 py-1 rounded text-[9px] font-serif border bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
                            >
                              ✓ Đang Slot 1 (Tháo)
                            </button>
                          ) : isEquippedTT2 ? (
                            <button
                              onClick={() => handleUnequipManual('thanThong2')}
                              className="px-2 py-1 rounded text-[9px] font-serif border bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/60 transition cursor-pointer"
                            >
                              ✓ Đang Slot 2 (Tháo)
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEquipManual(manual, 'thanThong1')}
                                className="px-2 py-1 rounded text-[9px] font-serif border bg-purple-950/60 border-purple-600/60 text-purple-300 hover:bg-purple-900/60 transition cursor-pointer"
                              >
                                Gán Thần Thông 1
                              </button>
                              <button
                                onClick={() => handleEquipManual(manual, 'thanThong2')}
                                className="px-2 py-1 rounded text-[9px] font-serif border bg-indigo-950/60 border-indigo-600/60 text-indigo-300 hover:bg-indigo-900/60 transition cursor-pointer"
                              >
                                Gán Thần Thông 2
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      {!isMaxLevel && (
                        <div className="flex items-center gap-2">
                          <div className="text-[9px] text-zinc-400 space-x-1 font-mono">
                            <span>{manual.tuViPerLevel.toLocaleString()} Tu vi</span>
                            <span>•</span>
                            <span>{manual.linhThachPerLevel} LT</span>
                          </div>
                          <button
                            onClick={() => handleLevelUpManual(manual.id)}
                            disabled={!canLevelUp}
                            className={`px-2.5 py-1 rounded text-[9px] font-serif font-bold transition flex items-center gap-1 cursor-pointer ${
                              canLevelUp
                                ? 'bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 border border-blue-500/50 shadow-sm'
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Thăng Tầng</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Tàng Kinh Các */}
      {manualsSubTab === 'tang_kinh_cac' && (
        <div className="space-y-3">
          <div className="text-[11px] text-zinc-400 flex justify-between items-center px-1">
            <span>Bí tịch cổ bản đang lưu trữ:</span>
            <span className="text-amber-400 font-mono">{player.linhThach.toLocaleString()} Linh Thạch</span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {DEFAULT_MANUALS.filter(m => !(player.manuals || []).some(om => om.id === m.id)).map(manual => {
              const canBuy = player.linhThach >= (manual.priceLinhThach || 0) && player.danhVong >= (manual.priceDanhVong || 0);

              const gradeBadge =
                manual.grade === 'Thần Giai' ? 'text-rose-400 border-rose-700/50 bg-rose-950/40' :
                manual.grade === 'Thiên Giai' ? 'text-purple-400 border-purple-700/50 bg-purple-950/40' :
                manual.grade === 'Địa Giai' ? 'text-amber-300 border-amber-700/50 bg-amber-950/40' :
                manual.grade === 'Huyền Giai' ? 'text-emerald-400 border-emerald-700/50 bg-emerald-950/40' :
                'text-zinc-400 border-zinc-700/50 bg-zinc-900/40';

              const typeName =
                manual.type === 'tam_phap' ? 'Tâm Pháp Nội Công' :
                manual.type === 'the_thuat' ? 'Thể Thuật Bí Pháp' : 'Thần Thông Tuyệt Kỹ';

              return (
                <div
                  key={manual.id}
                  className="p-3 rounded-lg bg-[#0d0d14]/90 border border-blue-900/30 hover:border-blue-500/40 transition space-y-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-amber-200 text-xs">
                          {manual.name}
                        </h4>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] border ${gradeBadge}`}>
                          {manual.grade}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-300/80 font-sans mt-0.5 block">
                        {typeName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuyManual(manual)}
                      disabled={!canBuy}
                      className={`px-3 py-1.5 rounded text-[11px] font-serif font-bold transition flex items-center gap-1 cursor-pointer shrink-0 ${
                        canBuy
                          ? 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-blue-100 border border-blue-500/40 shadow-sm'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      <span>Mua ({manual.priceLinhThach?.toLocaleString()} LT)</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {manual.description}
                  </p>

                  <div className="bg-[#0a0a0f] p-2 rounded border border-blue-900/20 text-[10px] space-y-0.5">
                    <div className="text-emerald-400">
                      {manual.type === 'tam_phap' && `• Mỗi cấp +${manual.speedBonusPerLevel}% Tốc độ tu luyện, +${manual.mpBonusPerLevel} MP`}
                      {manual.type === 'the_thuat' && `• Mỗi cấp +${manual.hpBonusPerLevel} Khí Huyết`}
                      {manual.type === 'than_thong' && `• Mỗi cấp +${manual.powerBonusPerLevel?.toLocaleString()} Chiến Lực`}
                    </div>
                    <div className="text-amber-300">
                      • Viên Mãn (Tầng 10): [{manual.maxLevelPassive.name}] - {manual.maxLevelPassive.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Dung Hợp Công Pháp */}
      {manualsSubTab === 'dung_hop' && (
        <ManualSynthesisView
          player={player}
          synthesisActions={synthesisActions}
        />
      )}
    </div>
  );
};
