// components/tabs/CustomSectTab.tsx
// Giao Diện Quản Lý "Khai Tông Lập Phái & Chân Truyền Đệ Tử" (Sect Founding & Disciples Hub)

import React, { useState } from 'react';
import {
  Landmark,
  Crown,
  Sparkles,
  Users,
  Shield,
  Pickaxe,
  Sprout,
  Sword,
  Coins,
  ArrowUpCircle,
  UserPlus,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Award,
  Scroll,
  Info,
  Building,
  UserCheck,
  UserX,
  Zap,
  TrendingUp,
  Swords
} from 'lucide-react';
import { PlayerStats } from '@/lib/types';
import {
  SectDoctrine,
  DiscipleRank,
  DiscipleTaskType,
  ProceduralDisciple
} from '@/lib/types/custom-sect';
import {
  SECT_DOCTRINES_CONFIG,
  SACRED_MOUNTAINS_POOL,
  FACILITY_UPGRADE_CONFIG,
  DISCIPLE_TASKS_CONFIG
} from '@/lib/custom-sect-data';
import { useCustomSectActions } from '@/hooks/useCustomSectActions';
import type { useDiscipleAppointmentActions } from '@/hooks/useDiscipleAppointmentActions';
import { DiscipleAppointmentModal } from '@/components/modals/DiscipleAppointmentModal';
import realmsDataRaw from '@/data/realms-data.json';
import { SectWarView } from './SectWarView';
import type { useSectWarActions } from '@/hooks/useSectWarActions';

const realmsData = realmsDataRaw as any[];

export interface CustomSectTabProps {
  player: PlayerStats;
  sectActions: ReturnType<typeof useCustomSectActions>;
  appointmentActions?: ReturnType<typeof useDiscipleAppointmentActions>;
  sectWarActions?: ReturnType<typeof useSectWarActions>;
}

export const CustomSectTab: React.FC<CustomSectTabProps> = ({
  player,
  sectActions,
  appointmentActions,
  sectWarActions,
}) => {
  const {
    sectState,
    isFounded,
    candidates,
    vaultYield,
    handleFoundSect,
    handleHarvestVault,
    handleRecruitDisciple,
    handleRefreshCandidates,
    handlePromoteDisciple,
    handleDismissDisciple,
    handleAssignTask,
    handleSetInheritor,
    handleUpgradeFacility,
    handleTrainDisciple
  } = sectActions;

  // State cho màn hình chưa lập phái
  const [formSectName, setFormSectName] = useState<string>('Thanh Vân Tiên Tông');
  const [selectedMountainId, setSelectedMountainId] = useState<string>('mountain_thanh_van');
  const [selectedDoctrine, setSelectedDoctrine] = useState<SectDoctrine>('chinh_dao');

  // Sub-tab khi đã lập phái: 'hall' | 'disciples' | 'vault' | 'heritage' | 'sect_war'
  const [activeSubTab, setActiveSubTab] = useState<'hall' | 'disciples' | 'vault' | 'heritage' | 'sect_war'>('hall');
  const [discipleFilter, setDiscipleFilter] = useState<'all' | DiscipleRank>('all');
  const [showRecruitModal, setShowRecruitModal] = useState<boolean>(false);
  const [showDeaconAppointmentModal, setShowDeaconAppointmentModal] = useState<boolean>(false);

  const selectedMountain = SACRED_MOUNTAINS_POOL.find(m => m.id === selectedMountainId) || SACRED_MOUNTAINS_POOL[0];
  const canFound = (player.currentRealm || 0) >= 26 && (player.linhThach || 0) >= 100000;

  // =========================================================================
  // 1. MÀN HÌNH CHƯA KHAI PHÁI (LẬP PHÁI DỰNG CỜ)
  // =========================================================================
  if (!isFounded) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Banner Khai Sơn Cổ Phong */}
        <div className="p-6 rounded-2xl border-2 border-amber-600/50 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black/80 shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600 text-amber-300 text-xs font-serif font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ĐẠI ĐẠO ĐỘC HÀNH • KHAI TÔNG LẬP PHÁI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-100 tracking-wide">
              Khai Sơn Dựng Kỳ • Vạn Cổ Truyền Thừa
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-serif max-w-xl leading-relaxed">
              Khi tu vi đạt tới cảnh giới <strong>Hóa Thần Kỳ (Realm 26+)</strong>, đại năng tu sĩ có thể chiếm cứ một phương linh sơn phúc địa, chiêu mộ đồ đệ, dựng lập cơ nghiệp bất hủ lưu truyền vạn thế.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/40 bg-black/60 text-xs font-serif space-y-1.5 min-w-[240px]">
            <div className="text-amber-300 font-bold border-b border-amber-900/60 pb-1 flex items-center justify-between">
              <span>ĐIỀU KIỆN LẬP PHÁI</span>
              <span className={canFound ? 'text-emerald-400' : 'text-rose-400'}>
                {canFound ? '✓ Đủ Điều Kiện' : 'Chưa Đạt'}
              </span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Cảnh Giới:</span>
              <span className={(player.currentRealm || 0) >= 26 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                {realmsData[player.currentRealm || 0]?.name || 'Chưa Đạt'} (YC: Realm 26+)
              </span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Linh Thạch:</span>
              <span className={(player.linhThach || 0) >= 100000 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                {(player.linhThach || 0).toLocaleString()} / 100,000 LT
              </span>
            </div>
          </div>
        </div>

        {/* BƯỚC 1: ĐẶT TÊN MÔN PHÁI & CHỌN LINH SƠN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-5 rounded-2xl border border-zinc-800 bg-[#0e0e14] space-y-4">
            <h2 className="text-base font-serif font-bold text-amber-200 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Scroll className="w-4 h-4 text-amber-400" />
              1. Đạo Hiệu & Khai Sơn
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-serif text-zinc-400">Tên Môn Phái:</label>
              <input
                type="text"
                value={formSectName}
                onChange={e => setFormSectName(e.target.value)}
                placeholder="Nhập tên môn phái..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-600/40 bg-black/60 text-amber-100 font-serif text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-serif text-zinc-400">Linh Sơn Chọn Đóng Đô:</label>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40 space-y-2">
                <div className="text-sm font-serif font-bold text-amber-300 flex items-center justify-between">
                  <span>{selectedMountain.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{selectedMountain.title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-serif leading-relaxed">
                  {selectedMountain.description}
                </p>
                <div className="text-[11px] text-emerald-400 font-serif font-semibold">
                  ✨ Linh Mạch Ban Thưởng: {selectedMountain.naturalBonus}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!canFound}
              onClick={() => handleFoundSect(formSectName, selectedMountain.name, selectedDoctrine)}
              className={`w-full py-3 rounded-xl font-serif font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg ${
                canFound
                  ? 'border-2 border-amber-400 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 text-white hover:brightness-110 cursor-pointer animate-pulse'
                  : 'border border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>🚩 TIẾN HÀNH LẬP PHÁI (100,000 LT)</span>
            </button>
          </div>

          {/* BƯỚC 2: SA BÀN 8 NGỌN LINH SƠN */}
          <div className="lg:col-span-2 p-5 rounded-2xl border border-zinc-800 bg-[#0e0e14] space-y-4">
            <h2 className="text-base font-serif font-bold text-amber-200 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Compass className="w-4 h-4 text-amber-400" />
              2. Chọn Ngọn Linh Sơn Khai Phái
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SACRED_MOUNTAINS_POOL.map(m => {
                const isSelected = m.id === selectedMountainId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMountainId(m.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'border-zinc-800/80 bg-black/40 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-amber-200">{m.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{m.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-serif mt-1 line-clamp-2">
                        {m.description}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-serif font-medium mt-2 pt-1 border-t border-zinc-900">
                      {m.naturalBonus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BƯỚC 3: 5 TÔN CHỈ GIÁO PHÁI */}
        <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0e0e14] space-y-4">
          <h2 className="text-base font-serif font-bold text-amber-200 flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Award className="w-4 h-4 text-amber-400" />
            3. Định Hình Tôn Chỉ Môn Phái (Sect Doctrine)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {Object.values(SECT_DOCTRINES_CONFIG).map(doc => {
              const isSelected = doc.id === selectedDoctrine;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctrine(doc.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-amber-950/60 to-purple-950/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'border-zinc-800 bg-black/50 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-1">{doc.icon}</div>
                    <h3 className="text-xs font-serif font-bold text-amber-200">{doc.name}</h3>
                    <span className="text-[9px] font-mono text-amber-400/90">{doc.badge}</span>
                    <p className="text-[11px] text-zinc-400 font-serif mt-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-purple-300 font-mono">
                    "{doc.lore}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MÀN HÌNH ĐÃ KHAI PHÁI (BỐ CỤC 4 PHÂN KHU)
  // =========================================================================
  const { facilities, doctrine, sectVault, disciples, chosenInheritorId } = sectState;
  const doctrineCfg = SECT_DOCTRINES_CONFIG[doctrine];
  const mainHallLvl = facilities.mainHallLevel || 1;
  const maxDisciplesCap = FACILITY_UPGRADE_CONFIG.mainHall[Math.min(FACILITY_UPGRADE_CONFIG.mainHall.length - 1, mainHallLvl - 1)]?.capacity || 6;
  const chosenInheritor = disciples.find(d => d.id === chosenInheritorId);

  const filteredDisciples = disciples.filter(d => {
    if (discipleFilter === 'all') return true;
    return d.rank === discipleFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* HEADER SƠN MÔN CỔ PHONG */}
      <div className="p-5 rounded-2xl border-2 border-amber-600/60 bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-black/90 shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-serif font-bold bg-amber-900/60 border border-amber-600 text-amber-300 flex items-center gap-1">
              <span>{doctrineCfg.icon}</span>
              <span>{doctrineCfg.name}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800">
              🏔️ {sectState.mountainName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wide">
            【{sectState.sectName}】
          </h1>
          <p className="text-xs text-zinc-300 font-serif">
            Chưởng Môn Khai Sơn: <strong className="text-amber-300">{player.name || 'Vô Danh Tu Sĩ'}</strong> • Danh Vọng Tông Môn: <strong className="text-amber-400 font-mono">+{sectState.reputation}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center p-3 rounded-xl bg-black/60 border border-amber-900/40 min-w-[110px]">
            <span className="text-[10px] text-zinc-400 font-serif block">MÔN HẠ HIỆN CÓ</span>
            <span className="text-xl font-mono font-bold text-amber-300">
              {disciples.length} / {maxDisciplesCap}
            </span>
          </div>
          <div className="text-center p-3 rounded-xl bg-black/60 border border-amber-900/40 min-w-[120px]">
            <span className="text-[10px] text-zinc-400 font-serif block">CHÂN TRUYỀN Y BÁT</span>
            <span className="text-xs font-serif font-bold text-purple-300 block truncate max-w-[100px]">
              {chosenInheritor ? chosenInheritor.name : 'Chưa Lập'}
            </span>
          </div>
        </div>
      </div>

      {/* SUB-TABS CHUYỂN ĐỔI 4 PHÂN KHU */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('hall')}
          className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'hall'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>🏛️ Chính Điện & Kiến Trúc</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('disciples')}
          className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'disciples'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>👥 Đệ Tử Viện ({disciples.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('vault')}
          className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'vault'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>📦 Khố Phòng & Sai Khiến</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('heritage')}
          className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'heritage'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>👑 Truyền Thừa Đạo Đài</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sect_war')}
          className={`px-4 py-2.5 rounded-xl font-serif text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'sect_war'
              ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-red-400" />
          <span>⚔️ Tông Môn Đại Chiến (Linh Sơn)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* PHÂN KHU 1: CHÍNH ĐIỆN & NÂNG CẤP KIẾN TRÚC */}
      {/* ===================================================================== */}
      {activeSubTab === 'hall' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {/* 1. Đại Điện */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e0e14] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-serif font-bold text-amber-200 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  Chính Điện Sơn Môn (Cấp {facilities.mainHallLevel || 1})
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Sức chứa: {maxDisciplesCap} đệ tử
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif leading-relaxed">
                Nơi Chưởng Môn tiếp đãi quần hùng, định ra quy chế môn phái. Nâng cấp để mở rộng số lượng đệ tử có thể thu nhận.
              </p>
            </div>
            {facilities.mainHallLevel < FACILITY_UPGRADE_CONFIG.mainHall.length ? (
              <button
                type="button"
                onClick={() => handleUpgradeFacility('mainHallLevel')}
                className="w-full py-2.5 rounded-xl border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Nâng Cấp Cấp {facilities.mainHallLevel + 1} ({FACILITY_UPGRADE_CONFIG.mainHall[facilities.mainHallLevel]?.costLinhThach.toLocaleString()} LT)
                </span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs font-serif text-emerald-400">Đã đạt cảnh giới cực hạn</div>
            )}
          </div>

          {/* 2. Dược Viên */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e0e14] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-serif font-bold text-emerald-300 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  Linh Dược Viện (Cấp {facilities.herbGardenFacilityLevel || 1})
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {FACILITY_UPGRADE_CONFIG.herbGarden[facilities.herbGardenFacilityLevel - 1]?.hourlyYield || 3} Dược / Giờ
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif leading-relaxed">
                Khu vực gieo trồng các loại kỳ hoa dị thảo cống nộp vào Khố Phòng. Tăng sản lượng khi có đệ tử được sai phái chăm sóc.
              </p>
            </div>
            {facilities.herbGardenFacilityLevel < FACILITY_UPGRADE_CONFIG.herbGarden.length ? (
              <button
                type="button"
                onClick={() => handleUpgradeFacility('herbGardenFacilityLevel')}
                className="w-full py-2.5 rounded-xl border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Nâng Cấp Cấp {facilities.herbGardenFacilityLevel + 1} ({FACILITY_UPGRADE_CONFIG.herbGarden[facilities.herbGardenFacilityLevel]?.costLinhThach.toLocaleString()} LT)
                </span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs font-serif text-emerald-400">Đã đạt cảnh giới cực hạn</div>
            )}
          </div>

          {/* 3. Mỏ Khoáng */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e0e14] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-serif font-bold text-amber-200 flex items-center gap-2">
                  <Pickaxe className="w-4 h-4 text-amber-400" />
                  Mỏ Khoáng Linh Mạch (Cấp {facilities.mineralVeinFacilityLevel || 1})
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {FACILITY_UPGRADE_CONFIG.mineralVein[facilities.mineralVeinFacilityLevel - 1]?.hourlyYield || 150} LT / Giờ
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif leading-relaxed">
                Đào bới linh thạch và quặng khoáng sản từ long mạch ngầm dưới chân núi môn phái.
              </p>
            </div>
            {facilities.mineralVeinFacilityLevel < FACILITY_UPGRADE_CONFIG.mineralVein.length ? (
              <button
                type="button"
                onClick={() => handleUpgradeFacility('mineralVeinFacilityLevel')}
                className="w-full py-2.5 rounded-xl border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Nâng Cấp Cấp {facilities.mineralVeinFacilityLevel + 1} ({FACILITY_UPGRADE_CONFIG.mineralVein[facilities.mineralVeinFacilityLevel]?.costLinhThach.toLocaleString()} LT)
                </span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs font-serif text-emerald-400">Đã đạt cảnh giới cực hạn</div>
            )}
          </div>

          {/* 4. Hộ Sơn Đại Trận */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e0e14] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-sm font-serif font-bold text-purple-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Hộ Sơn Đại Trận (Cấp {facilities.guardianArrayLevel || 1})
                </span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                  Độ bền: {FACILITY_UPGRADE_CONFIG.guardianArray[facilities.guardianArrayLevel - 1]?.maxDurability?.toLocaleString() || 1500}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif leading-relaxed">
                Kết giới hộ pháp phòng ngự sơn môn, ngăn chặn yêu thú bạo loạn và các thế lực tà tu xâm hại.
              </p>
            </div>
            {facilities.guardianArrayLevel < FACILITY_UPGRADE_CONFIG.guardianArray.length ? (
              <button
                type="button"
                onClick={() => handleUpgradeFacility('guardianArrayLevel')}
                className="w-full py-2.5 rounded-xl border border-purple-500/60 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  Nâng Cấp Cấp {facilities.guardianArrayLevel + 1} ({FACILITY_UPGRADE_CONFIG.guardianArray[facilities.guardianArrayLevel]?.costLinhThach.toLocaleString()} LT)
                </span>
              </button>
            ) : (
              <div className="text-center py-2 text-xs font-serif text-emerald-400">Đã đạt cảnh giới cực hạn</div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHÂN KHU 2: ĐỆ TỬ VIỆN (DANH SÁCH & CHIÊU MỘ) */}
      {/* ===================================================================== */}
      {activeSubTab === 'disciples' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Thanh Công Cụ & Bộ Lọc */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-zinc-800 bg-[#0e0e14]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-serif text-zinc-400">Chức vụ:</span>
              {(['all', 'ngoai_mon', 'noi_mon', 'chan_truyen', 'truong_lao'] as const).map(rk => (
                <button
                  key={rk}
                  type="button"
                  onClick={() => setDiscipleFilter(rk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-serif transition cursor-pointer ${
                    discipleFilter === rk
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {rk === 'all' ? 'Tất Cả' : rk === 'ngoai_mon' ? 'Ngoại Môn' : rk === 'noi_mon' ? 'Nội Môn' : rk === 'chan_truyen' ? 'Chân Truyền' : 'Trưởng Lão'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowRecruitModal(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-amber-500/80 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>📯 Đại Điển Khai Môn (Chiêu Mộ Đồ Đệ)</span>
            </button>
          </div>

          {/* Danh Sách Đệ Tử */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDisciples.map(d => {
              const isInheritor = d.id === chosenInheritorId;
              const taskInfo = DISCIPLE_TASKS_CONFIG[d.currentTask];
              return (
                <div
                  key={d.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    isInheritor
                      ? 'border-amber-400/90 bg-gradient-to-b from-amber-950/40 to-black/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'border-zinc-800 bg-[#0e0e14] hover:border-zinc-700'
                  }`}
                >
                  <div>
                    {/* Header Đệ tử */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-serif font-bold text-amber-200">{d.name}</span>
                          <span className="text-[10px] font-mono text-zinc-400">({d.gender === 'nam' ? 'Nam' : 'Nữ'})</span>
                          {isInheritor && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500 text-black">
                              👑 Y Bát
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-emerald-400 font-serif font-semibold block mt-0.5">
                          {d.realmName}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-serif font-bold border ${
                        d.rank === 'chan_truyen'
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : d.rank === 'noi_mon'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : d.rank === 'truong_lao'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}>
                        {d.rank === 'ngoai_mon' ? 'Ngoại Môn' : d.rank === 'noi_mon' ? 'Nội Môn' : d.rank === 'chan_truyen' ? 'Chân Truyền' : 'Trưởng Lão'}
                      </span>
                    </div>

                    {/* Linh căn & Đặc tính */}
                    <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-zinc-800/80 text-[11px] space-y-1">
                      <div className="text-amber-300 font-serif">
                        🌱 Linh Căn: <strong>{d.linhCan.name}</strong>
                      </div>
                      <div className="text-purple-300 font-serif flex items-center gap-1">
                        <span>✨ Tính cách:</span>
                        <strong>{d.personalityTrait.name}</strong>
                        <span className="text-zinc-500">({d.personalityTrait.description})</span>
                      </div>
                    </div>

                    {/* Chỉ số & Độ trung thành */}
                    <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-center text-[10px] font-mono">
                      <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-500 block">Căn Cốt</span>
                        <span className="text-amber-300 font-bold">{d.stats.canCot}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-500 block">Ngộ Tính</span>
                        <span className="text-purple-300 font-bold">{d.stats.ngoTinh}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60 border border-zinc-800">
                        <span className="text-zinc-500 block">Trung Thành</span>
                        <span className={d.stats.loyalty >= 70 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {d.stats.loyalty}%
                        </span>
                      </div>
                    </div>

                    {/* Nhiệm vụ hiện tại */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-serif p-2 rounded-lg bg-zinc-900/40 border border-zinc-800">
                      <span className="text-zinc-400">Nhiệm vụ:</span>
                      <span className="text-amber-300 font-semibold flex items-center gap-1">
                        <span>{taskInfo.icon}</span>
                        <span>{taskInfo.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Hành động điều phối */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={d.currentTask}
                        onChange={e => handleAssignTask(d.id, e.target.value as DiscipleTaskType)}
                        className="px-2 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 font-serif text-[11px] focus:outline-none"
                      >
                        <option value="idle">🧘 Bế Quan Thổ Nạp</option>
                        <option value="tend_garden">🌿 Trồng Dược Viên</option>
                        <option value="mine_ores">⛏️ Đào Khoáng Mạch</option>
                        <option value="guard_gate">🛡️ Tuần Sơn Hộ Vệ</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleTrainDisciple(d.id, 50000)}
                        title="Tiêu hao 50,000 Tu Vi bản thân giúp đệ tử đột phá"
                        className="px-2 py-1.5 rounded-lg border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-[11px] font-serif font-semibold transition cursor-pointer flex items-center justify-center gap-1 truncate"
                      >
                        <ArrowUpCircle className="w-3 h-3 text-indigo-400" />
                        <span>Chỉ Điểm Tu Vi</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {d.rank !== 'chan_truyen' && (
                        <button
                          type="button"
                          onClick={() => handlePromoteDisciple(d.id, 'chan_truyen')}
                          className="flex-1 py-1 rounded border border-purple-900/60 bg-purple-950/30 hover:bg-purple-900/50 text-purple-300 text-[10px] font-serif transition cursor-pointer"
                        >
                          Tấn Thăng Chân Truyền
                        </button>
                      )}

                      {!isInheritor && (
                        <button
                          type="button"
                          onClick={() => handleSetInheritor(d.id)}
                          className="flex-1 py-1 rounded border border-amber-900/60 bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 text-[10px] font-serif transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>Lập Y Bát</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDismissDisciple(d.id)}
                        className="p-1 rounded border border-rose-900/40 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 text-[10px] transition cursor-pointer"
                        title="Trục xuất đệ tử"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHÂN KHU 3: KHỐ PHÒNG & SAI KHIẾN */}
      {/* ===================================================================== */}
      {activeSubTab === 'vault' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Tổng quan Khố Phòng */}
          <div className="p-5 rounded-2xl border-2 border-amber-600/50 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-base font-serif font-bold text-amber-200 flex items-center justify-center sm:justify-start gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                Khố Phòng Tông Môn (Sect Vault)
              </h2>
              <p className="text-xs text-zinc-300 font-serif">
                Tài nguyên do toàn bộ đệ tử môn hạ ngày đêm trồng trọt, khai thác cống nộp. Chưởng Môn có thể rút ra bất cứ lúc nào.
              </p>
            </div>

            <button
              type="button"
              onClick={handleHarvestVault}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-amber-400 bg-gradient-to-r from-amber-600 to-yellow-600 hover:brightness-110 text-white font-serif font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.4)] transition cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Coins className="w-4 h-4 text-amber-200" />
              <span>📦 THU HOẠCH TOÀN BỘ KHỐ PHÒNG</span>
            </button>
          </div>

          {/* KHU VỰC BỔ NHIỆM CHẤP SỰ KHỐ PHÒNG (SECT TREASURY DEACON) */}
          {(() => {
            const deaconId = sectVault.deaconDiscipleId;
            const currentDeacon = deaconId
              ? (sectState.disciples || []).find(d => d.id === deaconId) ||
                (player.offspringState?.children || []).find(c => c.id === deaconId)
              : null;

            return (
              <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-stone-900/60 to-black/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                    <Building size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        Chấp Sự Khố Phòng Tông Môn
                      </span>
                      {currentDeacon ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Đương Nhiệm
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Trống
                        </span>
                      )}
                    </div>

                    {currentDeacon ? (
                      <div className="mt-1">
                        <h3 className="text-sm font-bold text-amber-100 flex items-center gap-2">
                          {currentDeacon.name}
                          <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-stone-800 text-amber-300 border border-stone-700">
                            {currentDeacon.realmName}
                          </span>
                        </h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5 flex flex-wrap items-center gap-3">
                          <span className="text-amber-300 font-medium">
                            +{Math.round((currentDeacon.appointmentData?.specialtyBonus?.treasuryEfficiency || 0) * 100)}% Sản Lượng
                          </span>
                          <span className="text-emerald-300 font-medium">
                            -{Math.round((currentDeacon.appointmentData?.specialtyBonus?.resourceDecayReduction || 0) * 100)}% Tiêu Hao
                          </span>
                          <span className="text-zinc-500">
                            Công trạng: {currentDeacon.appointmentData?.meritPoints || 0}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Chưa có Chấp Sự tiếp quản điều phối chuỗi cung ứng và giảm hao hụt tài nguyên.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentDeacon ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowDeaconAppointmentModal(true)}
                        className="px-3 py-1.5 rounded-lg border border-amber-500/60 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold transition"
                      >
                        Hoán Đổi
                      </button>
                      <button
                        type="button"
                        onClick={() => appointmentActions?.handleRecallRole(currentDeacon.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/60 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition"
                      >
                        Bãi Nhiệm
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeaconAppointmentModal(true)}
                      className="px-4 py-2 rounded-xl border border-dashed border-amber-400/80 bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 text-xs font-bold transition shadow-sm animate-pulse"
                    >
                      + Bổ Nhiệm Chấp Sự Khố Phòng
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Bảng Kê Tài Nguyên Sẵn Có & Tích Lũy Chờ Rút */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Linh Thạch */}
            <div className="p-4 rounded-xl border border-amber-900/50 bg-[#0e0e14] space-y-2">
              <span className="text-xs font-serif text-zinc-400 block">Linh Thạch Trong Khố</span>
              <div className="text-xl font-mono font-bold text-amber-300">
                {((sectVault.linhThach || 0) + (vaultYield.linhThachGained || 0)).toLocaleString()} LT
              </div>
              <span className="text-[10px] text-zinc-500 font-serif">
                +{vaultYield.linhThachGained.toLocaleString()} LT đang tích lũy ({vaultYield.elapsedHours.toFixed(1)}h)
              </span>
            </div>

            {/* 2. Thảo Dược */}
            <div className="p-4 rounded-xl border border-emerald-900/50 bg-[#0e0e14] space-y-2">
              <span className="text-xs font-serif text-zinc-400 block">Thảo Dược Dược Viên</span>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {Object.values(sectVault.herbs || {}).reduce((a, b) => a + b, 0) + Object.values(vaultYield.herbsGained || {}).reduce((a, b) => a + b, 0)} Thảo Dược
              </div>
              <span className="text-[10px] text-zinc-500 font-serif">
                Chăm sóc bởi {disciples.filter(d => d.currentTask === 'tend_garden').length} đệ tử
              </span>
            </div>

            {/* 3. Khoáng Thạch */}
            <div className="p-4 rounded-xl border border-purple-900/50 bg-[#0e0e14] space-y-2">
              <span className="text-xs font-serif text-zinc-400 block">Quặng Khoáng Linh Mạch</span>
              <div className="text-xl font-mono font-bold text-purple-300">
                {Object.values(sectVault.ores || {}).reduce((a, b) => a + b, 0) + Object.values(vaultYield.oresGained || {}).reduce((a, b) => a + b, 0)} Quặng Thạch
              </div>
              <span className="text-[10px] text-zinc-500 font-serif">
                Khai thác bởi {disciples.filter(d => d.currentTask === 'mine_ores').length} đệ tử
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHÂN KHU 4: TRUYỀN THỪA ĐẠO ĐÀI (CHÂN TRUYỀN Y BÁT) */}
      {/* ===================================================================== */}
      {activeSubTab === 'heritage' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl border-2 border-amber-500/70 bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-black/90 shadow-[0_0_35px_rgba(245,158,11,0.25)] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
              <Crown className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif font-black text-amber-200">
              TRUYỀN THỪA ĐẠO ĐÀI • Y BÁT KẾ VỊ
            </h2>
            <p className="text-xs text-zinc-300 font-serif max-w-xl mx-auto leading-relaxed">
              Nơi Chưởng Môn chỉ định đệ tử ưu tú nhất kế thừa y bát tông môn. Khi nhân vật chính không may <strong>Tọa Hóa (hết thọ nguyên)</strong> hoặc <strong>Binh Giải</strong>, đạo hữu có thể chọn đoạt xá thân xác của đệ tử này để tiếp tục nắm quyền Chưởng Môn ở kiếp sau!
            </p>
          </div>

          {chosenInheritor ? (
            <div className="p-5 rounded-2xl border-2 border-amber-400/80 bg-[#0e0e14] shadow-lg max-w-lg mx-auto space-y-4">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-serif font-bold bg-amber-900/60 text-amber-300 border border-amber-600">
                  ĐỆ TỬ KẾ THỪA Y BÁT HIỆN TẠI
                </span>
                <h3 className="text-xl font-serif font-black text-amber-100 mt-2">
                  【{chosenInheritor.name}】
                </h3>
                <span className="text-xs text-emerald-400 font-serif font-bold block">
                  {chosenInheritor.realmName} • {chosenInheritor.linhCan.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-3 rounded-xl bg-black/60 border border-zinc-800">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Căn Cốt</span>
                  <span className="text-amber-300 font-bold">{chosenInheritor.stats.canCot}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Ngộ Tính</span>
                  <span className="text-purple-300 font-bold">{chosenInheritor.stats.ngoTinh}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Trung Thành</span>
                  <span className="text-emerald-400 font-bold">{chosenInheritor.stats.loyalty}%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-zinc-300 font-serif leading-relaxed">
                ✨ <strong>Đặc quyền kiếp sau:</strong> Bắt đầu kiếp mới ngay tại cảnh giới <strong>{chosenInheritor.realmName}</strong>, giữ nguyên toàn bộ cơ nghiệp 【{sectState.sectName}】 và bảo toàn danh vọng tông môn!
              </div>

              <button
                type="button"
                onClick={() => handleSetInheritor('')}
                className="w-full py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer"
              >
                Hủy Bỏ / Chỉ Định Lại Đệ Tử Khác
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center space-y-2 max-w-lg mx-auto">
              <span className="text-zinc-500 text-xs font-serif block">
                Hiện tại chưa có đệ tử nào được sắc phong làm Chân Truyền Y Bát.
              </span>
              <p className="text-zinc-400 text-xs font-serif">
                Hãy vào tab <strong>"Đệ Tử Viện"</strong>, chọn một đệ tử có độ trung thành $\ge 70$ và bấm <strong>"Lập Y Bát"</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* PHÂN KHU 5: TÔNG MÔN ĐẠI CHIẾN & TRANH ĐOẠT LINH SƠN DÃ NGOẠI */}
      {/* ===================================================================== */}
      {activeSubTab === 'sect_war' && sectWarActions && (
        <SectWarView player={player} sectWarActions={sectWarActions} />
      )}

      {/* ===================================================================== */}
      {/* MODAL CHIÊU MỘ ĐỆ TỬ (ĐẠI ĐIỂN KHAI MÔN) */}
      {/* ===================================================================== */}
      {showRecruitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="cophong-card max-w-2xl w-full p-5 rounded-2xl border-2 border-amber-600/80 bg-[#120a0d] shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4">
            <div className="flex items-center justify-between border-b border-amber-900/50 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold text-amber-200">
                  ĐẠI ĐIỂN KHAI MÔN • CHIÊU MỘ ĐỆ TỬ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRecruitModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-serif cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            <p className="text-xs text-zinc-300 font-serif">
              Dưới cổng núi đang có các phàm trần kỳ tài quỳ bái sư. Hãy chọn người có linh căn và căn cốt phù hợp để thu nhận vào Ngoại Môn.
            </p>

            <div className="space-y-3">
              {candidates.map(cand => (
                <div
                  key={cand.id}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-black/50 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-sm font-serif font-bold text-amber-200">{cand.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400">({cand.gender === 'nam' ? 'Nam' : 'Nữ'})</span>
                      <span className="text-xs text-emerald-400 font-serif">{cand.realmName}</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-serif">
                      🌱 {cand.linhCan.name} • ✨ {cand.personalityTrait.name} ({cand.personalityTrait.description})
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex gap-3 justify-center sm:justify-start">
                      <span>Căn cốt: <strong className="text-amber-300">{cand.stats.canCot}</strong></span>
                      <span>Ngộ tính: <strong className="text-purple-300">{cand.stats.ngoTinh}</strong></span>
                      <span>Trung thành: <strong className="text-emerald-400">{cand.stats.loyalty}%</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRecruitDisciple(cand)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border border-amber-400 bg-amber-600 hover:bg-amber-500 text-white font-serif font-bold text-xs transition cursor-pointer whitespace-nowrap shadow-md"
                  >
                    Thu Nhận Bái Sư
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleRefreshCandidates}
                className="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-serif transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🔄 Đổi Lứa Mới (5,000 LT)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRecruitModal(false)}
                className="px-5 py-2 rounded-xl border border-amber-600 bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 text-xs font-serif font-bold transition cursor-pointer"
              >
                Hoàn Tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BỔ NHIỆM CHẤP SỰ KHỐ PHÒNG */}
      <DiscipleAppointmentModal
        isOpen={showDeaconAppointmentModal}
        role="sect_treasury_deacon"
        targetId="sect_vault"
        targetName="Khố Phòng Tông Môn"
        player={player}
        onAppoint={(discipleId, role, targetId) => {
          appointmentActions?.handleAppointRole(discipleId, role, targetId);
          setShowDeaconAppointmentModal(false);
        }}
        onRecall={(discipleId) => {
          appointmentActions?.handleRecallRole(discipleId);
        }}
        onClose={() => setShowDeaconAppointmentModal(false)}
      />
    </div>
  );
};

export default CustomSectTab;
