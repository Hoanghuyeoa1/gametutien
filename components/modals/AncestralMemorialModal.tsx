'use client';
// components/modals/AncestralMemorialModal.tsx
// Giao Diện "Lục Đạo Tiên Bi: Tổ Tiên Phù Hộ & Huyết Mạch Thế Gia (Ancestral Memorial & Lineage Blessings)"
// 3 Phân Khu: Lục Đạo Thạch Bi • Huyết Mạch Đạo Vận • Tông Tộc Tế Đài

import React, { useState, useMemo } from 'react';
import {
  X,
  Scroll,
  Award,
  Crown,
  Sparkles,
  Flame,
  Shield,
  HeartHandshake,
  Swords,
  Clock,
  Compass,
  Filter,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  Heart,
  Baby
} from 'lucide-react';
import { PlayerStats, PastLifeRecord, CauseOfDeathType } from '@/lib/types';
import type { useAncestralBlessingActions } from '@/hooks/useAncestralBlessingActions';
import {
  INCENSE_OFFERINGS_CONFIG,
  ANCESTRAL_CAPS,
  EPITHET_RESONANCE_MAP
} from '@/lib/ancestral-blessing-data';
import { calculateAncestralResonance } from '@/lib/ancestral-blessing-logic';
import realmsDataRaw from '@/data/realms-data.json';

const realmsData = realmsDataRaw as any[];

export interface AncestralMemorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  ancestralActions?: ReturnType<typeof useAncestralBlessingActions>;
}

// Chuyển đổi số kiếp sang ký hiệu La Mã cổ phong
function toRoman(num: number): string {
  const romanMap: [number, string][] = [
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ];
  let res = '';
  let n = num;
  for (const [val, str] of romanMap) {
    while (n >= val) {
      res += str;
      n -= val;
    }
  }
  return res || 'I';
}

export const AncestralMemorialModal: React.FC<AncestralMemorialModalProps> = ({
  isOpen,
  onClose,
  player,
  ancestralActions
}) => {
  // Sub-tabs chính của modal
  const [modalSubTab, setModalSubTab] = useState<'memorial' | 'resonance' | 'offering'>('memorial');
  const [selectedRecord, setSelectedRecord] = useState<PastLifeRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const pastLives = useMemo(() => {
    return player.reincarnationState?.pastLives || [];
  }, [player.reincarnationState?.pastLives]);

  const totalRebornCount = player.reincarnationState?.totalRebornTimes || 0;
  const highestRealmIndex = Math.max(
    player.currentRealm || 0,
    player.reincarnationState?.highestRealmIndexAchieved || 0
  );
  const highestRealmName = realmsData[highestRealmIndex]?.name || 'Phàm Nhân';
  const lifetimeKarma = player.reincarnationState?.lifetimeKarmaPoints || 0;

  // Tính toán Đạo Vận Tổ Tiên
  const resonance = useMemo(() => {
    return ancestralActions?.resonanceStats || calculateAncestralResonance(pastLives);
  }, [ancestralActions?.resonanceStats, pastLives]);

  // Thông tin buff dâng hương
  const activeBuff = player.ancestralState?.activeBuff;
  const isBuffActive = activeBuff && activeBuff.expiresAt > Date.now();
  const remainingTimeStr = ancestralActions?.getRemainingBuffTime
    ? ancestralActions.getRemainingBuffTime()
    : isBuffActive
    ? `${Math.max(0, Math.ceil((activeBuff.expiresAt - Date.now()) / (60 * 60 * 1000)))}h`
    : 'Chưa thắp hương';

  // Lọc danh sách bia mộ
  const filteredRecords = useMemo(() => {
    if (filterType === 'all') return pastLives;
    if (filterType === 'than') return pastLives.filter(r => r.epithet.grade === 'than');
    if (filterType === 'thien') return pastLives.filter(r => r.epithet.grade === 'thien');
    if (filterType === 'dia') return pastLives.filter(r => r.epithet.grade === 'dia');
    if (filterType === 'hoang_huyen') return pastLives.filter(r => r.epithet.grade === 'hoang' || r.epithet.grade === 'huyen');
    if (filterType === 'binh_giai') return pastLives.filter(r => r.causeOfDeath === 'binh_giai');
    if (filterType === 'lifespan_exhausted') return pastLives.filter(r => r.causeOfDeath === 'lifespan_exhausted');
    if (filterType === 'tribulation_failure') return pastLives.filter(r => r.causeOfDeath === 'tribulation_failure');
    return pastLives;
  }, [pastLives, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-xl animate-fadeIn">
      {/* Vỏ ngoài Bia Đá Cổ Phong */}
      <div className="cophong-card cophong-corner max-w-4xl w-full p-5 sm:p-7 rounded-2xl border-2 border-stone-600/70 bg-[#0d0e14] shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-5 max-h-[92vh] overflow-y-auto custom-scrollbar relative text-stone-200">
        
        {/* Họa tiết Lôi Văn & Bát Quái Cổ Phong SVG Nền mờ */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="batquai-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="60" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="0.8" />
                <path d="M60 10 L60 110 M10 60 L110 60" stroke="#fff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#batquai-grid)" />
          </svg>
        </div>

        {/* HEADER MODAL: LỤC ĐẠO TIÊN BI */}
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-stone-900 border border-amber-600/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Scroll className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-stone-200 to-purple-200 tracking-wider">
                  LỤC ĐẠO TIÊN BI • TỔ TIÊN PHÙ HỘ
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700/80 text-amber-300 font-mono font-bold">
                  Huyết Mạch Thế Gia
                </span>
              </div>
              <p className="text-xs text-stone-400 font-serif mt-0.5">
                Thiên Đạo Vô Tình • Vạn Kiếp Trùng Tu • Tổ Tiên Hiển Linh Che Chở
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-rose-300 transition cursor-pointer p-1.5 rounded-lg hover:bg-stone-900"
            title="Đóng Tiên Bi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* THANH CHUYỂN ĐỔI 3 SUB-TABS CHÍNH */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-2 relative z-10 flex-wrap">
          <button
            onClick={() => setModalSubTab('memorial')}
            className={`px-3.5 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              modalSubTab === 'memorial'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-600/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 text-amber-400" />
            <span>🏛️ Lục Đạo Thạch Bi ({pastLives.length})</span>
          </button>

          <button
            onClick={() => setModalSubTab('resonance')}
            className={`px-3.5 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              modalSubTab === 'resonance'
                ? 'bg-purple-950/80 text-purple-200 border border-purple-600/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>🔮 Huyết Mạch Đạo Vận</span>
          </button>

          <button
            onClick={() => setModalSubTab('offering')}
            className={`px-3.5 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-2 transition cursor-pointer relative ${
              modalSubTab === 'offering'
                ? 'bg-rose-950/80 text-rose-200 border border-rose-600/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>🕯️ Tông Tộc Tế Đài (Dâng Hương)</span>
            {isBuffActive && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>

        {/* ======================================================== */}
        {/* SUB-TAB 1: LỤC ĐẠO THẠCH BI (DANH SÁCH BIA MỘ TIỀN KIẾP) */}
        {/* ======================================================== */}
        {modalSubTab === 'memorial' && (
          <div className="space-y-4">
            {/* THỐNG KÊ TỔNG QUAN TIỀN KIẾP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center relative z-10 font-serif">
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
                <div className="text-[10.5px] text-stone-400">Tổng Số Kiếp Đã Qua</div>
                <div className="text-base sm:text-lg font-mono font-bold text-amber-300 mt-0.5">
                  {totalRebornCount} Kiếp
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
                <div className="text-[10.5px] text-stone-400">Cực Hạn Cảnh Giới</div>
                <div className="text-base sm:text-lg font-bold text-purple-300 truncate mt-0.5">
                  {highestRealmName}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
                <div className="text-[10.5px] text-stone-400">Tổng Karma Tích Lũy</div>
                <div className="text-base sm:text-lg font-mono font-bold text-amber-400 mt-0.5">
                  +{lifetimeKarma.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80">
                <div className="text-[10.5px] text-stone-400">Bia Mộ Ghi Danh</div>
                <div className="text-base sm:text-lg font-mono font-bold text-sky-300 mt-0.5">
                  {pastLives.length} Tòa Thạch Bi
                </div>
              </div>
            </div>

            {/* BỘ LỌC BIA MỘ */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 relative z-10 border-b border-stone-800/70 pb-3">
              <span className="text-[11px] font-serif text-stone-400 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-amber-400" />
                Lọc:
              </span>
              {[
                { id: 'all', label: 'Tất Cả' },
                { id: 'than', label: '👑 Thần Giai' },
                { id: 'thien', label: '✨ Thiên Giai' },
                { id: 'dia', label: '🔮 Địa Giai' },
                { id: 'hoang_huyen', label: '📜 Phàm/Huyền' },
                { id: 'binh_giai', label: '⚡ Binh Giải' },
                { id: 'tribulation_failure', label: '🔥 Lôi Kiếp' },
                { id: 'lifespan_exhausted', label: '⏳ Tọa Hóa' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-amber-950/80 border border-amber-500/70 text-amber-200 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DANH SÁCH BIA MỘ TIỀN KIẾP */}
            <div className="space-y-3 relative z-10">
              {filteredRecords.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-stone-800 bg-stone-950/50 text-center space-y-4 font-serif">
                  <div className="w-16 h-16 mx-auto rounded-full bg-stone-900/80 border border-stone-700/60 flex items-center justify-center text-stone-500 shadow-inner">
                    <Scroll className="w-8 h-8 opacity-40 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-stone-300">
                      Thạch Bi Trống Trơn • Vô Danh Tiền Kiếp
                    </h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                      Đạo hữu hiện đang ở kiếp đầu tiên hoặc chưa từng trải qua Lục Đạo Luân Hồi. Hãy nỗ lực tu hành, phá cảnh chứng đạo để khắc tên mình vào bảng vàng Tiên Bi!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredRecords.map((record) => {
                    const romanIndex = toRoman(record.lifeIndex);
                    const isSelected = selectedRecord?.lifeIndex === record.lifeIndex;

                    let causeBadgeClass = 'text-amber-300 border-amber-700/60 bg-amber-950/50';
                    if (record.causeOfDeath === 'binh_giai') {
                      causeBadgeClass = 'text-sky-300 border-sky-600/60 bg-sky-950/50';
                    } else if (record.causeOfDeath === 'tribulation_failure') {
                      causeBadgeClass = 'text-purple-300 border-purple-600/60 bg-purple-950/50';
                    } else if (record.causeOfDeath === 'combat_defeat') {
                      causeBadgeClass = 'text-rose-300 border-rose-600/60 bg-rose-950/50';
                    } else if (record.causeOfDeath === 'ascension_voluntary') {
                      causeBadgeClass = 'text-yellow-200 border-yellow-500/70 bg-yellow-950/60';
                    }

                    return (
                      <div
                        key={record.lifeIndex}
                        onClick={() => setSelectedRecord(record)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden group ${
                          isSelected
                            ? 'bg-amber-950/30 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                            : 'bg-stone-950/70 border-stone-800/90 hover:border-amber-500/50 hover:bg-stone-900/40'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 border border-stone-700/70 flex flex-col items-center justify-center shrink-0 shadow-md">
                            <span className="text-[8.5px] font-mono text-stone-400">ĐỜI</span>
                            <span className="text-sm font-serif font-bold text-amber-300 font-mono">
                              {romanIndex}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-serif font-bold text-stone-100 group-hover:text-amber-200 transition">
                                {record.daoName}
                              </h4>
                              <span className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded-full border shadow-sm ${record.epithet.badgeClass}`}>
                                【{record.epithet.title}】
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 font-serif">
                              <span>Cảnh giới: <strong className="text-stone-200">{record.highestRealmName}</strong></span>
                              <span>•</span>
                              <span>Thọ mệnh: <strong className="text-stone-300">{record.ageAtDeath} tuổi</strong></span>
                              <span>•</span>
                              <span>Môn phái: <strong className="text-stone-300">{record.sectName}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800/60">
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-serif font-medium ${causeBadgeClass}`}>
                            {record.causeOfDeathText}
                          </span>

                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-amber-400">
                              +{record.karmaEarned.toLocaleString()}
                            </div>
                            <div className="text-[9.5px] text-stone-500 font-serif">Điểm Karma</div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: HUYẾT MẠCH ĐẠO VẬN (CÂY PHÚC ĐỨC GIA TỘC)    */}
        {/* ======================================================== */}
        {modalSubTab === 'resonance' && (
          <div className="space-y-4">
            {/* Banner Khí Vận Gia Tộc */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 via-stone-900/60 to-amber-950/40 border border-purple-600/40 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-serif font-bold text-purple-200 uppercase tracking-wider">
                    Huyết Mạch Gia Tộc • Đạo Vận Cộng Hưởng
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold">
                  {pastLives.length} Đời Tiền Nhân Phù Hộ
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-serif leading-relaxed">
                Mỗi tiền kiếp lưu danh trên Lục Đạo Tiên Bi đều ngưng tụ một sợi Đạo Vận vĩnh hằng phù hộ con cháu đời sau. Các chỉ số được cộng dồn lũy tiến vào căn cơ hiện tại.
              </p>
            </div>

            {/* Bảng Chỉ Số Đạo Vận Đang Kích Hoạt */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-serif">Tốc Độ Tu Vi Bế Quan</div>
                <div className="text-base font-mono font-bold text-amber-300">
                  +{resonance.tuViSpeedBonus}%
                </div>
                <div className="text-[9px] text-stone-500 font-mono">Tối đa: +{ANCESTRAL_CAPS.MAX_TU_VI_SPEED}%</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-serif">Đan Dược Cực Phẩm</div>
                <div className="text-base font-mono font-bold text-emerald-400">
                  +{resonance.danCucPhamRateBonus}%
                </div>
                <div className="text-[9px] text-stone-500 font-mono">Tối đa: +{ANCESTRAL_CAPS.MAX_DAN_CUC_PHAM_RATE}%</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-serif">Sát Thương Kiếm Pháp</div>
                <div className="text-base font-mono font-bold text-sky-400">
                  +{resonance.swordDamageBonus}%
                </div>
                <div className="text-[9px] text-stone-500 font-mono">Tối đa: +{ANCESTRAL_CAPS.MAX_SWORD_DMG_BONUS}%</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-serif">Giảm Tiêu Hao Độ Kiếp</div>
                <div className="text-base font-mono font-bold text-purple-300">
                  +{resonance.tribulationCostReduction}%
                </div>
                <div className="text-[9px] text-stone-500 font-mono">Tối đa: +{ANCESTRAL_CAPS.MAX_TRIBULATION_REDUCTION}%</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-serif">Thọ Nguyên Khởi Đầu</div>
                <div className="text-base font-mono font-bold text-yellow-300">
                  +{resonance.extraStartingLifespan} Năm
                </div>
                <div className="text-[9px] text-stone-500 font-mono">Tối đa: +{ANCESTRAL_CAPS.MAX_LIFESPAN} năm</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-serif">Khí Vận Cơ Bản</div>
                <div className="text-base font-mono font-bold text-rose-400">
                  +{resonance.extraKhiVan} Điểm
                </div>
                <div className="text-[9px] text-stone-500 font-mono">Tối đa: +{ANCESTRAL_CAPS.MAX_KHI_VAN} điểm</div>
              </div>
            </div>

            {/* Chi Tiết Đóng Góp Từng Tiền Kiếp */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-serif font-bold text-stone-300 uppercase tracking-wide">
                📜 Minh Khắc Đạo Vận Theo Từng Tiền Kiếp
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {pastLives.map(p => {
                  const spec = EPITHET_RESONANCE_MAP[p.epithet.title];
                  return (
                    <div
                      key={p.lifeIndex}
                      className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-between text-xs font-serif"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">[{toRoman(p.lifeIndex)}]</span>
                        <span className="text-stone-200 font-bold">{p.daoName}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${p.epithet.badgeClass}`}>
                          {p.epithet.title}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-stone-400 italic">
                        {spec ? spec.description : `Gia hộ căn bản (${p.epithet.grade})`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: TÔNG TỘC TẾ ĐÀI (DÂNG HƯƠNG & BẢO MỆNH)       */}
        {/* ======================================================== */}
        {modalSubTab === 'offering' && (
          <div className="space-y-4">
            {/* BÀN THỜ TỔ TIÊN & KHÓI HƯƠNG PROCEDURAL SVG */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-950 via-[#130f14] to-stone-950 border border-amber-600/50 text-center space-y-3 relative overflow-hidden shadow-2xl">
              
              {/* Làn Khói Nhang Procedural SVG */}
              <div className="relative">
                <svg className="w-24 h-28 mx-auto drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" viewBox="0 0 100 140" fill="none">
                  <defs>
                    <linearGradient id="smokeGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Lư Hương Bát Quái */}
                  <path d="M 25 110 L 75 110 L 85 130 L 15 130 Z" fill="#292524" stroke="#78716c" strokeWidth="2" />
                  <circle cx="50" cy="120" r="6" fill="#f59e0b" opacity="0.6" className="animate-pulse" />
                  {/* 3 Nén Nhang */}
                  <line x1="42" y1="110" x2="42" y2="70" stroke="#b45309" strokeWidth="2" />
                  <line x1="50" y1="110" x2="50" y2="65" stroke="#b45309" strokeWidth="2" />
                  <line x1="58" y1="110" x2="58" y2="70" stroke="#b45309" strokeWidth="2" />
                  {/* Đầu Nhang Đỏ Lửa */}
                  <circle cx="42" cy="70" r="2" fill="#ef4444" className="animate-ping" />
                  <circle cx="50" cy="65" r="2.5" fill="#f59e0b" className="animate-ping" />
                  <circle cx="58" cy="70" r="2" fill="#ef4444" className="animate-ping" />
                  {/* Khói Nhang Uốn Lượn */}
                  <path
                    d="M 50 65 Q 40 45 55 30 T 45 5"
                    stroke="url(#smokeGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-pulse"
                    opacity="0.85"
                  />
                  <path
                    d="M 45 68 Q 30 50 48 25 T 52 2"
                    stroke="url(#smokeGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </div>

              {/* BÀI VỊ TỔ TIÊN TRUNG TÂM */}
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-amber-200 tracking-wider">
                  TÔNG TỘC TẾ ĐÀI • TIỀN KIẾP BÀI VỊ
                </h3>
                <p className="text-xs text-stone-400 font-serif max-w-md mx-auto">
                  Dâng nén tâm hương bái tế chư vị tiền kiếp tổ tông. Khói hương nghi ngút thấu triệt hư không, ban phát phúc âm và ngưng tụ <strong>Hư Ảnh Bảo Mệnh</strong> đỡ đòn chí tử!
                </p>
              </div>

              {/* TRẠNG THÁI DÂNG HƯƠNG HIỆN TẠI */}
              <div className="p-3 rounded-xl bg-black/50 border border-stone-800 max-w-md mx-auto flex items-center justify-between text-xs font-serif flex-wrap gap-2">
                <div className="text-left">
                  <span className="text-stone-400 block text-[10px]">Trạng Thái Hương Hỏa:</span>
                  <span className="text-amber-300 font-bold">
                    {isBuffActive ? `Đang Thắp: ${activeBuff.incenseName}` : 'Hương Hỏa Đã Tàn'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">Thời Gian Còn Lại:</span>
                  <span className="font-mono font-bold text-stone-200">{remainingTimeStr}</span>
                </div>
                {isBuffActive && activeBuff.protectionCharges > 0 && (
                  <div className="w-full pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-purple-300 font-mono font-bold text-[11px]">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                      Hư Ảnh Tổ Tiên Bảo Mệnh:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/60">
                      Còn {activeBuff.protectionCharges} Lần Cứu Mạng
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3 THẺ BÀI NHANG CÚNG TẾ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {Object.values(INCENSE_OFFERINGS_CONFIG).map(incense => {
                const canAfford = player.linhThach >= incense.costLinhThach;
                return (
                  <div
                    key={incense.id}
                    className="p-4 rounded-xl border border-stone-800 bg-stone-950/80 space-y-3 flex flex-col justify-between hover:border-amber-600/50 transition shadow"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{incense.icon}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-300 font-bold">
                          {incense.durationHours} Giờ
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-bold text-amber-200">{incense.name}</h4>
                        <p className="text-[10px] text-stone-400 font-serif leading-tight mt-0.5">
                          {incense.description}
                        </p>
                      </div>
                      <div className="text-[10px] text-stone-300 font-mono space-y-0.5 pt-1 border-t border-stone-800/60">
                        <div>• Tu vi thổ nạp: +{incense.statBuffs.tuViSpeedPercent}%</div>
                        {incense.statBuffs.atkDefPercent && <div>• Công/Thủ: +{incense.statBuffs.atkDefPercent}%</div>}
                        {incense.statBuffs.allStatsPercent && <div>• Toàn thuộc tính: +{incense.statBuffs.allStatsPercent}%</div>}
                        {incense.statBuffs.dropRatePercent && <div>• Tỷ lệ rơi đồ: +{incense.statBuffs.dropRatePercent}%</div>}
                        {incense.statBuffs.critRatePercent && <div>• Bạo kích: +{incense.statBuffs.critRatePercent}%</div>}
                        {incense.protectionCharges > 0 && (
                          <div className="text-purple-300 font-bold">
                            • Hư Ảnh Bảo Mệnh: {incense.protectionCharges} Lần
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => ancestralActions?.handlePerformOffering(incense.id)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-900 to-rose-900 hover:brightness-125 text-amber-100 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      <span>Dâng Hương ({incense.costLinhThach.toLocaleString()} LT)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL / DIALOG CHI TIẾT VĂN BIA TIÊN ĐẠO (EPITAPH INSCRIPTION) */}
        {selectedRecord && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            <div className="cophong-card max-w-lg w-full p-6 rounded-2xl border-2 border-amber-600/80 bg-[#12131a] shadow-[0_0_60px_rgba(245,158,11,0.3)] space-y-4 text-stone-200 relative">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 transition p-1.5 rounded-lg hover:bg-stone-800/60"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-stone-800 to-stone-950 border border-amber-500/50 flex flex-col items-center justify-center shrink-0 shadow-md">
                  <span className="text-[9px] font-mono text-stone-400">ĐỜI</span>
                  <span className="text-base font-serif font-bold text-amber-300 font-mono">
                    {toRoman(selectedRecord.lifeIndex)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-amber-200">
                    VĂN BIA TIỀN KIẾP • KIẾP THỨ {selectedRecord.lifeIndex}
                  </h3>
                  <p className="text-xs text-stone-400 font-serif">
                    Đạo Hiệu: <strong className="text-stone-200">{selectedRecord.daoName}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950/90 border border-amber-500/40 text-center space-y-1.5 shadow-inner">
                <div className="text-[10px] text-amber-400/80 font-serif tracking-widest uppercase">
                  — THIÊN ĐẠO BAN TẶNG DANH HIỆU —
                </div>
                <div className="text-lg font-serif font-bold text-amber-300 tracking-wide">
                  【{selectedRecord.epithet.title}】
                </div>
                <p className="text-xs font-serif text-stone-300 italic">
                  "{selectedRecord.epithet.tagline}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-stone-800 text-xs font-serif text-stone-300 leading-relaxed space-y-2">
                <p className="text-stone-200 indent-4">
                  Tu sĩ <strong>{selectedRecord.daoName}</strong>, một đời cần khổ tu hành suốt <strong>{selectedRecord.ageAtDeath}</strong> năm tuế nguyệt. Từng bái nhập môn phái <strong>{selectedRecord.sectName}</strong>, giữ chức vị <strong>{selectedRecord.sectRank}</strong>.
                </p>
                <p className="text-stone-200 indent-4">
                  Một đời khổ tu kinh thiên động địa, đạt tới cảnh giới đỉnh phong <strong>{selectedRecord.highestRealmName}</strong>. Cuối cùng vì <strong>{selectedRecord.causeOfDeathText}</strong> mà quy tiên tại cõi phàm trần. 
                </p>
                <p className="text-stone-400 text-[11px] pt-1 border-t border-stone-800/60">
                  {selectedRecord.companionCount > 0 ? `Dọc đường tu tiên kết duyên cùng ${selectedRecord.companionCount} vị hồng nhan tri kỷ. ` : 'Một đời cô độc cầu đạo, không vướng bận duyên trần. '}
                  {selectedRecord.bestPvPRank ? `Từng xếp hạng thứ ${selectedRecord.bestPvPRank} trên Thiên Kiêu Bảng chấn nhiếp quần hùng. ` : ''}
                  {selectedRecord.sealedArtifactName ? `Bản mệnh pháp bảo 【${selectedRecord.sealedArtifactName}】 được phong ấn mang theo sang luân hồi kiếp sau.` : ''}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-serif">Điểm Karma</div>
                  <div className="text-amber-300 font-bold mt-0.5">+{selectedRecord.karmaEarned.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-serif">Thành Tựu</div>
                  <div className="text-sky-300 font-bold mt-0.5">{selectedRecord.achievementsCount} Mở Khóa</div>
                </div>
                <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                  <div className="text-[10px] text-stone-400 font-serif">Đạo Lữ</div>
                  <div className="text-rose-300 font-bold mt-0.5">{selectedRecord.companionCount} Tri Kỷ</div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-serif font-bold transition cursor-pointer"
                >
                  Đóng Văn Bia
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AncestralMemorialModal;
