// components/modals/DestinyModal.tsx
import React, { useState } from 'react';
import { Compass, X, Sparkles, Zap, Plus, Trash2, ShieldAlert, Layers, Flame, Check, Lock } from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  DESTINY_REROLL_PILL_ID,
  DESTINY_REROLL_COST_LT,
  ALL_DESTINY_FATES,
  DESTINY_FATES,
  DESTINY_SYNERGIES,
  getActiveDestinySynergies,
  getDestinySlotMaxCount
} from '@/lib/destiny-data';

export interface DestinyModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  isRollingDestiny: boolean;
  onRerollDestiny: (usePill: boolean) => void;
  onEquipDestiny?: (fateId: string) => void;
  onUnequipDestiny?: (fateId: string) => void;
}

const SLOT_NAMES = [
  { name: 'Càn Vị', desc: 'Thiên Mệnh • Chủ Vị', minRealm: 1 },
  { name: 'Khôn Vị', desc: 'Địa Khí • Phụ Vị', minRealm: 1 },
  { name: 'Tốn Vị', desc: 'Phong Linh • Tam Vị', minRealm: 1 },
  { name: 'Cấn Vị', desc: 'Sơn Phách • Tứ Vị', minRealm: 2, reqText: 'Trúc Cơ Kỳ' },
  { name: 'Đoài Vị', desc: 'Trạch Thần • Ngũ Vị', minRealm: 3, reqText: 'Kim Đan Kỳ' },
  { name: 'Luân Hồi Đạo Nhãn', desc: 'Luân Hồi • Tiên Mệnh Độc Quyền', minRealm: 1, reqText: 'Luân Hồi Kiếp 2+' }
];

export const DestinyModal: React.FC<DestinyModalProps> = ({
  isOpen,
  onClose,
  player,
  isRollingDestiny,
  onRerollDestiny,
  onEquipDestiny,
  onUnequipDestiny
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'reroll'>('board');

  if (!isOpen) return null;

  const ownedPillCount = player.inventory?.pills?.find(p => p.id === DESTINY_REROLL_PILL_ID)?.quantity || 0;
  const hasPill = ownedPillCount >= 1;
  const hasLinhThach = player.linhThach >= DESTINY_REROLL_COST_LT;

  const totalRebornTimes = player.reincarnationState?.totalRebornTimes || 0;
  const maxSlots = getDestinySlotMaxCount(player.currentRealm, totalRebornTimes);
  const destinyBoard = player.destinyBoard || {
    unlockedSlots: maxSlots,
    equippedIds: player.destiny ? [player.destiny.id] : ['pham_nhan_menh'],
    collectedIds: player.destiny ? [player.destiny.id] : ['pham_nhan_menh']
  };

  const equippedIds = destinyBoard.equippedIds || [];
  const collectedIds = destinyBoard.collectedIds || (player.destiny ? [player.destiny.id] : ['pham_nhan_menh']);
  const activeSynergies = getActiveDestinySynergies(equippedIds);
  const activeSynergyIdSet = new Set(activeSynergies.map(s => s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="cophong-card cophong-corner max-w-3xl w-full p-6 rounded-2xl border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.35)] space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Compass className={`w-5 h-5 text-amber-400 ${isRollingDestiny ? 'animate-spin' : 'animate-pulse'}`} />
            <div>
              <h3 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100">
                MỆNH BÀN BÁT QUÁI • TIÊN THIÊN KHÍ TƯỢNG
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Càn Khôn bát vị, dung nạp tiên thiên mệnh số, kích hoạt tổ hợp cộng hưởng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRollingDestiny}
            className="text-zinc-500 hover:text-amber-300 transition cursor-pointer p-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-900/30 gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 font-serif font-bold text-xs flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'board'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bát Quái Mệnh Bàn ({equippedIds.length}/{destinyBoard.unlockedSlots} Ô)</span>
          </button>
          <button
            onClick={() => setActiveTab('reroll')}
            className={`px-4 py-2 font-serif font-bold text-xs flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'reroll'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nghịch Thiên Cải Mệnh (Tế Thiên Đàn)</span>
          </button>
        </div>

        {/* TAB 1: BÁT QUÁI MỆNH BÀN */}
        {activeTab === 'board' && (
          <div className="space-y-4">
            {/* 1. KHUNG 5 Ô MỆNH BÀN */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Các Ô Khảm Bát Quái:
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Đã khảm: <strong className="text-amber-300">{equippedIds.length}</strong> / {destinyBoard.unlockedSlots} ô khả dụng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {SLOT_NAMES.map((slot, idx) => {
                  const isUnlocked = idx < destinyBoard.unlockedSlots;
                  const fateId = equippedIds[idx];
                  const fate = fateId ? DESTINY_FATES[fateId] : null;

                  if (!isUnlocked) {
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-950/60 border border-dashed border-zinc-800 flex flex-col justify-center items-center text-center opacity-60 min-h-[115px]"
                      >
                        <Lock className="w-5 h-5 text-zinc-600 mb-1" />
                        <div className="text-[11px] font-serif font-bold text-zinc-400">{slot.name}</div>
                        <div className="text-[9.5px] font-mono text-amber-500/70 mt-0.5">
                          Yêu cầu: {slot.reqText || 'Cảnh giới cao hơn'}
                        </div>
                      </div>
                    );
                  }

                  if (!fate) {
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0f0e15]/70 border border-dashed border-amber-900/50 flex flex-col justify-center items-center text-center hover:border-amber-500/50 transition min-h-[115px]"
                      >
                        <Plus className="w-5 h-5 text-amber-500/60 mb-1" />
                        <div className="text-[11px] font-serif font-bold text-amber-300">{slot.name} (Trống)</div>
                        <div className="text-[9.5px] font-mono text-zinc-500 mt-0.5">{slot.desc}</div>
                        <div className="text-[9px] text-amber-400/70 mt-1 italic">
                          Chọn Mệnh Cách bên dưới để khảm
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gradient-to-br from-amber-950/40 via-[#131018] to-black border border-amber-600/50 shadow-sm flex flex-col justify-between min-h-[115px] relative group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9.5px] font-mono text-amber-400/80 uppercase font-bold">
                            {slot.name} • {slot.desc}
                          </span>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded border font-mono ${fate.badgeClass}`}>
                            {fate.grade}
                          </span>
                        </div>
                        <h5 className="text-xs font-serif font-bold text-amber-200">{fate.name}</h5>
                        <p className="text-[10px] text-amber-100/70 font-mono mt-1 line-clamp-2 leading-relaxed">
                          {fate.effectsSummary}
                        </p>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onUnequipDestiny && onUnequipDestiny(fate.id)}
                          disabled={equippedIds.length <= 1}
                          className="px-2 py-0.5 text-[9.5px] font-mono rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-300 transition flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title={equippedIds.length <= 1 ? 'Cần giữ ít nhất 1 Mệnh Cách trên Mệnh Bàn' : 'Tháo gỡ Mệnh Cách khỏi ô'}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Tháo Gỡ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. TỔ HỢP CỘNG HƯỞNG TIÊN THIÊN (SYNERGY) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-b from-black/80 to-[#100c14] border border-amber-900/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Cộng Hưởng Bát Quái • Tổ Hợp Mệnh Cách
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Đang kích hoạt: {activeSynergies.length} tổ hợp
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {DESTINY_SYNERGIES.map((syn) => {
                  const isActive = activeSynergyIdSet.has(syn.id);
                  const fate1 = DESTINY_FATES[syn.requiredFateIds[0]];
                  const fate2 = DESTINY_FATES[syn.requiredFateIds[1]];

                  return (
                    <div
                      key={syn.id}
                      className={`p-2.5 rounded-lg border transition ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-zinc-950 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-zinc-950/40 border-zinc-800/80 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-serif font-bold flex items-center gap-1 ${
                          isActive ? 'text-amber-200' : 'text-zinc-400'
                        }`}>
                          {isActive ? <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Flame className="w-3.5 h-3.5 text-zinc-600" />}
                          {syn.name}
                        </span>
                        {isActive ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-mono text-emerald-300 bg-emerald-950 border border-emerald-700 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Kích Hoạt
                          </span>
                        ) : (
                          <span className="text-[8.5px] px-1.5 py-0.2 rounded font-mono text-zinc-500 border border-zinc-800">
                            Chưa Khảm Đủ
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 my-1">
                        <span>Yêu cầu:</span>
                        <span className={equippedIds.includes(syn.requiredFateIds[0]) ? 'text-amber-300 font-bold' : 'text-zinc-500'}>
                          [{fate1?.name || syn.requiredFateIds[0]}]
                        </span>
                        <span>+</span>
                        <span className={equippedIds.includes(syn.requiredFateIds[1]) ? 'text-amber-300 font-bold' : 'text-zinc-500'}>
                          [{fate2?.name || syn.requiredFateIds[1]}]
                        </span>
                      </div>

                      <div className={`text-[10px] font-mono leading-relaxed ${
                        isActive ? 'text-amber-200' : 'text-zinc-500'
                      }`}>
                        {syn.effectsSummary}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. KHO MỆNH CÁCH ĐÃ THU THẬP */}
            <div className="space-y-2 border-t border-amber-900/30 pt-3">
              <div className="flex items-center justify-between text-xs font-serif font-bold text-amber-300">
                <span>Kho Tàng Mệnh Cách Đã Thức Tỉnh:</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Sở hữu: {collectedIds.length} Mệnh Số
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {collectedIds.map((fId) => {
                  const fate = DESTINY_FATES[fId];
                  if (!fate) return null;
                  const isEquipped = equippedIds.includes(fId);
                  const isBoardFull = equippedIds.length >= destinyBoard.unlockedSlots;

                  return (
                    <div
                      key={fId}
                      className={`p-2.5 rounded-lg border transition flex flex-col justify-between ${
                        isEquipped
                          ? 'bg-amber-950/40 border-amber-600/70 shadow-sm'
                          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-serif font-bold text-zinc-200 text-xs">
                            {fate.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${fate.badgeClass}`}>
                            {fate.grade}
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-200/80 font-mono leading-relaxed">
                          {fate.effectsSummary}
                        </p>
                      </div>

                      <div className="pt-2 flex justify-end">
                        {isEquipped ? (
                          <span className="text-[9.5px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã Khảm Nạp
                          </span>
                        ) : (
                          <button
                            onClick={() => onEquipDestiny && onEquipDestiny(fId)}
                            disabled={isBoardFull}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono transition flex items-center gap-1 cursor-pointer ${
                              isBoardFull
                                ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-600/60'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isBoardFull ? 'Mệnh Bàn Đầy' : 'Khảm Nạp'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NGHỊCH THIÊN CẢI MỆNH TẾ THIÊN ĐÀN */}
        {activeTab === 'reroll' && (
          <div className="space-y-4">
            {/* Mệnh Cách Hiện Tại */}
            <div className="bg-gradient-to-br from-amber-950/40 via-[#121016] to-[#16121a] p-4 rounded-xl border border-amber-600/40 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest block mb-1">
                    Thiên Mệnh Đương Tiền (Chủ Vị)
                  </span>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-serif font-bold text-amber-200">
                      {player.destiny?.name || 'Phàm Nhân Mệnh Cách'}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${player.destiny?.badgeClass || 'bg-zinc-900 text-zinc-300 border-zinc-700'}`}>
                      {player.destiny?.grade || 'Phàm Cấp'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/70 italic mt-1 font-serif">
                    "{player.destiny?.description || 'Bình phàm áo vải, số mệnh do chính mình nắm giữ.'}"
                  </p>
                </div>

                <div className="w-14 h-14 rounded-full border-2 border-amber-500/40 bg-black/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Compass className={`w-8 h-8 text-amber-400 ${isRollingDestiny ? 'animate-spin' : ''}`} />
                </div>
              </div>

              <div className="bg-black/50 p-2.5 rounded-lg border border-zinc-800/80 text-xs font-mono text-amber-200/90 leading-relaxed">
                <span className="text-amber-400 font-bold block mb-0.5">🌟 Thiên Mệnh Gia Trì:</span>
                {player.destiny?.effectsSummary}
              </div>
            </div>

            {/* Vòng quay & Nghi Thức Bói Quẻ Tế Thiên */}
            {isRollingDestiny && (
              <div className="p-6 rounded-xl bg-gradient-to-b from-amber-950/30 to-black/60 border border-amber-500/60 text-center space-y-3 animate-pulse">
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
                <div className="text-sm font-serif font-bold text-amber-300 tracking-wider">
                  ĐANG CẢM ỨNG THIÊN ĐẠO... NGHỊCH CHUYỂN LUÂN HỒI SỐ KIẾP!
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Bát Quái xoay chuyển, thức tỉnh Mệnh Cách mới và bổ sung vào Mệnh Bàn...
                </p>
              </div>
            )}

            {/* Hai Phương Pháp Nghịch Thiên Cải Mệnh */}
            <div className="space-y-3">
              <span className="text-xs font-serif font-bold text-amber-300 block">
                Chọn Phương Thức Cải Mệnh Tế Thiên:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cách 1: Tiêu hao Cải Mệnh Đan */}
                <div className="p-3.5 rounded-xl bg-[#0f0e15] border border-amber-900/40 hover:border-amber-600/50 transition flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-purple-300 flex items-center gap-1.5">
                        🔮 Cải Mệnh Đan
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Hiện có: <strong className="text-purple-300">{ownedPillCount}</strong> viên
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Dùng 1 viên <em>Cửu Chuyển Cải Mệnh Đan</em> để nghịch chuyển nhân quả, mở khóa Mệnh Cách mới lưu vào Mệnh Bàn.
                    </p>
                  </div>

                  <button
                    onClick={() => onRerollDestiny(true)}
                    disabled={!hasPill || isRollingDestiny}
                    className={`w-full py-2.5 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      hasPill && !isRollingDestiny
                        ? 'bg-gradient-to-r from-purple-800 to-indigo-700 hover:brightness-110 text-purple-100 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{hasPill ? 'Dùng 1 Cải Mệnh Đan' : 'Thiếu Cải Mệnh Đan'}</span>
                  </button>
                </div>

                {/* Cách 2: Tế Thiên 500 Linh Thạch */}
                <div className="p-3.5 rounded-xl bg-[#0f0e15] border border-amber-900/40 hover:border-amber-600/50 transition flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                        ✨ Tế Thiên 500 Linh Thạch
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Hiện có: <strong className="text-amber-400">{player.linhThach.toLocaleString()}</strong> LT
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Tế hiến 500 Linh Thạch lên Bát Quái Thiên Đàn, khẩn cầu Thiên Đạo tái định mệnh số tiên thiên.
                    </p>
                  </div>

                  <button
                    onClick={() => onRerollDestiny(false)}
                    disabled={!hasLinhThach || isRollingDestiny}
                    className={`w-full py-2.5 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      hasLinhThach && !isRollingDestiny
                        ? 'bg-gradient-to-r from-amber-700 to-yellow-600 hover:brightness-110 text-amber-100 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{hasLinhThach ? `Tế Thiên (${DESTINY_REROLL_COST_LT} LT)` : 'Không Đủ Linh Thạch'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Toàn Thư Mệnh Cách Tiên Thiên */}
            <div className="space-y-2 border-t border-amber-900/30 pt-3">
              <div className="flex items-center justify-between text-xs font-serif font-bold text-amber-300">
                <span>Đồ Phổ Mệnh Cách Càn Khôn:</span>
                <span className="text-[10px] text-zinc-400 font-mono">11 Đại Tiên Thiên Mệnh</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] max-h-56 overflow-y-auto pr-1">
                {ALL_DESTINY_FATES.map(fate => {
                  const isCurrent = player.destiny?.id === fate.id;
                  const isCollected = collectedIds.includes(fate.id);

                  return (
                    <div
                      key={fate.id}
                      className={`p-2.5 rounded-lg border transition ${
                        isCurrent
                          ? 'bg-amber-950/50 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                          : isCollected
                          ? 'bg-zinc-900/80 border-amber-900/50'
                          : 'bg-zinc-950/50 border-zinc-800/80 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-zinc-200 flex items-center gap-1">
                          {fate.name}
                          {isCurrent && <span className="text-[9px] text-amber-400 font-mono">★ Chủ Vị</span>}
                          {!isCurrent && isCollected && <span className="text-[8.5px] text-emerald-400 font-mono">✓ Đã Có</span>}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${fate.badgeClass}`}>
                          {fate.grade}
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-200/80 font-mono leading-relaxed">
                        {fate.effectsSummary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
