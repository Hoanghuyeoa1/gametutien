import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Heart,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Plus,
  RefreshCw,
  X,
  Clock,
  Swords,
  Crown,
  AlertTriangle,
  Gift,
  HelpCircle,
  CheckCircle2,
  Droplet
} from 'lucide-react';
import {
  PlayerStats,
  SpiritBeast,
  BeastEgg,
  BeastRole,
  Pill,
  Herb
} from '@/lib/types';
import {
  BEAST_STAGES_CONFIG,
  BEAST_QUALITY_CONFIG,
  DEFAULT_BEAST_QUALITY_CONFIG,
  getBeastQualityConfig,
  SPECIES_TEMPLATES,
  createRandomEgg,
  infuseEggWithMp,
  infuseEggWithLinhThach,
  feedBeastWithPill,
  feedBeastWithHerb,
  checkCanEvolveBeast,
  evolveBeast
} from '@/lib/beast-data';
import { getItemQuality, convertGradeToGiai } from '@/lib/item-quality-data';
import { BeastGardenView } from './BeastGardenView';

export interface BeastTabProps {
  player: PlayerStats;
  onUpdatePlayer: (updated: PlayerStats) => void;
  onAddLog: (title: string, content: string, type: any) => void;
  onShowToast: (msg: string) => void;
  setActiveTab?: (tab: any) => void;
}

export const BeastTab: React.FC<BeastTabProps> = ({
  player,
  onUpdatePlayer,
  onAddLog,
  onShowToast,
  setActiveTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'beasts' | 'incubator' | 'garden'>('beasts');
  const [selectedBeastId, setSelectedBeastId] = useState<string | null>(
    player.activeBeastId || (player.beasts && player.beasts.length > 0 ? player.beasts[0].id : null)
  );

  // Modal Uy Thực (Cho Ăn)
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [feedingBeast, setFeedingBeast] = useState<SpiritBeast | null>(null);
  const [feedItemType, setFeedItemType] = useState<'pills' | 'herbs'>('pills');

  // Lấy linh thú đang chọn xem chi tiết
  const beasts = player.beasts || [];
  const eggs = player.beastEggs || [];
  const activeBeast = beasts.find(b => b.id === player.activeBeastId);
  const currentDetailBeast = beasts.find(b => b.id === selectedBeastId) || beasts[0] || null;

  // 1. Chuyển đổi vai trò Tọa Kỵ / Xuất Chiến
  const handleToggleRole = (beast: SpiritBeast, newRole: BeastRole) => {
    const updatedBeasts = beasts.map(b => {
      if (b.id === beast.id) {
        return { ...b, role: newRole };
      }
      return b;
    });

    const updatedPlayer: PlayerStats = {
      ...player,
      beasts: updatedBeasts
    };

    onUpdatePlayer(updatedPlayer);
    onShowToast(`🐾 Đã chuyển [${beast.name}] sang chế độ: ${newRole === 'mount' ? 'Tọa Kỵ Hộ Thân' : 'Xuất Chiến Đỡ Đòn'}!`);
  };

  // 2. Xuất chiến / Thu hồi
  const handleToggleActive = (beastId: string) => {
    const isCurrentlyActive = player.activeBeastId === beastId;
    const newActiveId = isCurrentlyActive ? null : beastId;

    const updatedPlayer: PlayerStats = {
      ...player,
      activeBeastId: newActiveId
    };

    onUpdatePlayer(updatedPlayer);
    const targetBeast = beasts.find(b => b.id === beastId);
    if (newActiveId && targetBeast) {
      onShowToast(`✨ Đã triệu hồi [${targetBeast.name}] đồng hành cùng Tiên Hữu!`);
      onAddLog(
        '🐾 Triệu Hồi Thần Thú',
        `Chân nhân đã triệu hồi [${targetBeast.name}] (${targetBeast.stageName}). Chế độ: ${targetBeast.role === 'mount' ? 'Tọa Kỵ' : 'Xuất Chiến'}.`,
        'special'
      );
    } else {
      onShowToast('Đã thu hồi thần thú về Linh Thú Đại!');
    }
  };

  // 3. Tiến hóa thần thú
  const handleEvolve = (beast: SpiritBeast) => {
    const res = evolveBeast(beast, player);
    if (res.updatedBeast !== beast) {
      onUpdatePlayer(res.updatedPlayer);
      onShowToast(res.message);
      onAddLog('🎉 Thần Thú Tiến Hóa', res.message, 'special');
    } else {
      onShowToast(res.message);
    }
  };

  // 4. Cho ăn Đan Dược
  const handleFeedPill = (pill: Pill, count: number = 1) => {
    if (!feedingBeast) return;
    const res = feedBeastWithPill(feedingBeast, pill, count);

    // Trừ đan dược trong túi đồ
    const updatedPills = (player.inventory?.pills || [])
      .map(p => {
        if (p.id === pill.id) {
          return { ...p, quantity: Math.max(0, p.quantity - count) };
        }
        return p;
      })
      .filter(p => p.quantity > 0);

    const updatedBeasts = beasts.map(b => b.id === feedingBeast.id ? res.updatedBeast : b);

    const updatedPlayer: PlayerStats = {
      ...player,
      inventory: {
        ...player.inventory!,
        pills: updatedPills
      },
      beasts: updatedBeasts
    };

    onUpdatePlayer(updatedPlayer);
    setFeedingBeast(res.updatedBeast);
    onShowToast(res.message);
    if (res.levelUps > 0) {
      onAddLog('⚡ Thần Thú Thăng Cấp', res.message, 'success');
    }
  };

  // 5. Cho ăn Thảo Dược
  const handleFeedHerb = (herb: Herb, count: number = 1) => {
    if (!feedingBeast) return;
    const res = feedBeastWithHerb(feedingBeast, herb, count);

    const updatedHerbs = (player.inventory?.herbs || [])
      .map(h => {
        if (h.id === herb.id) {
          return { ...h, quantity: Math.max(0, h.quantity - count) };
        }
        return h;
      })
      .filter(h => h.quantity > 0);

    const updatedBeasts = beasts.map(b => b.id === feedingBeast.id ? res.updatedBeast : b);

    const updatedPlayer: PlayerStats = {
      ...player,
      inventory: {
        ...player.inventory!,
        herbs: updatedHerbs
      },
      beasts: updatedBeasts
    };

    onUpdatePlayer(updatedPlayer);
    setFeedingBeast(res.updatedBeast);
    onShowToast(res.message);
  };

  // 6. Ấp trứng: Rót Chân Nguyên
  const handleInfuseMp = (egg: BeastEgg) => {
    const curMp = player.linhLuc ?? 100;
    const res = infuseEggWithMp(egg, curMp);

    if (res.mpCost === 0) {
      onShowToast(res.message);
      return;
    }

    let updatedEggs = eggs.map(e => e.id === egg.id ? res.updatedEgg : e);
    let updatedBeasts = [...beasts];

    if (res.hatchedBeast) {
      // Bỏ trứng đã nở, thêm beast mới
      updatedEggs = updatedEggs.filter(e => e.id !== egg.id);
      updatedBeasts.push(res.hatchedBeast);
      onAddLog('✨ Thần Noãn Khai Phách', res.message, 'special');
    }

    const updatedPlayer: PlayerStats = {
      ...player,
      linhLuc: Math.max(0, curMp - res.mpCost),
      beastEggs: updatedEggs,
      beasts: updatedBeasts,
      activeBeastId: player.activeBeastId || (res.hatchedBeast ? res.hatchedBeast.id : player.activeBeastId)
    };

    onUpdatePlayer(updatedPlayer);
    onShowToast(res.message);
  };

  // 7. Ấp trứng: Rót Linh Thạch
  const handleInfuseLinhThach = (egg: BeastEgg) => {
    const res = infuseEggWithLinhThach(egg, player.linhThach);

    if (res.linhThachCost === 0) {
      onShowToast(res.message);
      return;
    }

    let updatedEggs = eggs.map(e => e.id === egg.id ? res.updatedEgg : e);
    let updatedBeasts = [...beasts];

    if (res.hatchedBeast) {
      updatedEggs = updatedEggs.filter(e => e.id !== egg.id);
      updatedBeasts.push(res.hatchedBeast);
      onAddLog('✨ Thần Noãn Khai Phách', res.message, 'special');
    }

    const updatedPlayer: PlayerStats = {
      ...player,
      linhThach: Math.max(0, player.linhThach - res.linhThachCost),
      beastEggs: updatedEggs,
      beasts: updatedBeasts,
      activeBeastId: player.activeBeastId || (res.hatchedBeast ? res.hatchedBeast.id : player.activeBeastId)
    };

    onUpdatePlayer(updatedPlayer);
    onShowToast(res.message);
  };

  // 8. Tặng trứng khởi đầu nếu người chơi chưa từng có thần thú & trứng
  const handleClaimStarterEgg = () => {
    const starterEgg = createRandomEgg('egg_u_minh');
    const updatedPlayer: PlayerStats = {
      ...player,
      beastEggs: [...eggs, starterEgg]
    };
    onUpdatePlayer(updatedPlayer);
    onShowToast(`🎁 Chúc mừng Tiên Hữu nhận được [${starterEgg.name}] cơ duyên khởi đầu!`);
    onAddLog(
      '🎁 Cơ Duyên Thần Thú',
      `Tiên đạo ban phúc! Nhận được [${starterEgg.name}]. Hãy vào Bàn Ấp Linh Noãn rót chân nguyên để ấp nở!`,
      'special'
    );
  };

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* HEADER BANNER CỔ PHONG */}
      {/* ======================================================== */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black/60 border border-amber-800/40 relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <h2 className="font-serif font-bold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300">
                LINH THÚ HỘ THỂ & TỌA KÝ TIÊN GIA
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-serif mt-0.5">
              Thuần dưỡng thần thú hồng hoang • Cưỡi mây hộ thân rút ngắn thời gian bế quan • Đỡ đòn chí tử khi giao tranh
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-amber-900/40 text-center font-mono text-[10px]">
              <span className="text-zinc-400">Xuất chiến: </span>
              <span className="text-amber-300 font-bold">
                {activeBeast ? `${activeBeast.avatar} ${activeBeast.name}` : 'Chưa chọn'}
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-black/60 border border-amber-900/40 text-center font-mono text-[10px]">
              <span className="text-zinc-400">Tinh Huyết: </span>
              <span className="text-rose-400 font-bold">{player.tinhHuyetYeuThu || 0}</span>
            </div>
          </div>
        </div>

        {/* Thanh chuyển đổi Sub-tab */}
        <div className="flex gap-2 mt-3 pt-2.5 border-t border-amber-900/30">
          <button
            onClick={() => setActiveSubTab('beasts')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'beasts'
                ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-black/40 hover:bg-zinc-800/40'
            }`}
          >
            <span>🐾 Linh Thú Sở Hữu</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40">
              {beasts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('incubator')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'incubator'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-black/40 hover:bg-zinc-800/40'
            }`}
          >
            <span>🥚 Bàn Ấp Linh Noãn</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">
              {eggs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('garden')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'garden'
                ? 'bg-gradient-to-r from-amber-600/40 to-yellow-600/30 text-amber-200 border border-amber-400/60 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 bg-black/40 hover:bg-zinc-800/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>🐾 Thú Uyển (Lai Tạo & Huyết Mạch)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PHÂN KHU 1: DANH SÁCH LINH THÚ SỞ HỮU */}
      {/* ======================================================== */}
      {activeSubTab === 'beasts' && (
        <div className="space-y-3">
          {beasts.length === 0 ? (
            <div className="p-8 rounded-xl bg-black/40 border border-zinc-800 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-950/30 border border-amber-800/30 flex items-center justify-center text-3xl">
                🐾
              </div>
              <h3 className="font-serif font-bold text-amber-200 text-sm">Chưa Sở Hữu Linh Thú Tiên Gia</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto font-serif">
                Tiên đạo mênh mông, linh thú có thể tìm thấy khi vượt ải Boss Thí Luyện, thám hiểm Bí Cảnh hoặc ấp nở Linh Noãn!
              </p>
              {eggs.length === 0 && (
                <button
                  onClick={handleClaimStarterEgg}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-serif font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5 mx-auto"
                >
                  <Gift className="w-4 h-4" />
                  Nhận [U Minh Yêu Noãn] Khởi Đầu
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Cột trái: Danh sách thẻ Linh Thú thu nhỏ */}
              <div className="lg:col-span-4 space-y-2 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
                {beasts.map(beast => {
                  const qCfg = getBeastQualityConfig(beast.quality || beast.rarity);
                  const sCfg = BEAST_STAGES_CONFIG[beast.stage] || BEAST_STAGES_CONFIG[1];
                  const isSelected = currentDetailBeast?.id === beast.id;
                  const isActive = player.activeBeastId === beast.id;

                  return (
                    <div
                      key={beast.id}
                      onClick={() => setSelectedBeastId(beast.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer relative overflow-hidden flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-500/70 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'bg-[#0f0e15] border-zinc-800/80 hover:border-amber-900/50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-900/50 to-black border border-amber-600/40 flex items-center justify-center text-2xl shadow-inner">
                          {beast.avatar}
                        </div>
                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" title="Đang xuất chiến" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-serif font-bold text-xs text-amber-200 truncate">{beast.name}</h4>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-serif ${qCfg?.badgeClass || 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60'}`}>
                            {qCfg?.name || 'Phổ Thông'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-0.5">
                          <span>Lv {beast.level}</span>
                          <span>•</span>
                          <span className="text-amber-400/90">{sCfg?.name || 'Sơ Sinh'}</span>
                          <span>•</span>
                          <span className={beast.role === 'mount' ? 'text-sky-300' : 'text-rose-400'}>
                            {beast.role === 'mount' ? '🏇 Tọa Kỵ' : '⚔️ Hộ Vệ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cột phải: Khung chi tiết Thần Thú đang chọn */}
              {currentDetailBeast && (() => {
                const detailQCfg = getBeastQualityConfig(currentDetailBeast.quality || currentDetailBeast.rarity);
                const detailSCfg = BEAST_STAGES_CONFIG[currentDetailBeast.stage] || BEAST_STAGES_CONFIG[1];

                return (
                  <div className="lg:col-span-8 p-4 rounded-xl bg-[#0f0e15] border border-amber-900/40 space-y-4 shadow-lg">
                    {/* Header chi tiết */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-900/30 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-800/40 via-black to-zinc-900 border-2 border-amber-500/60 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                          {currentDetailBeast.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif font-bold text-base text-amber-100">{currentDetailBeast.name}</h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-serif font-bold ${detailQCfg?.badgeClass || 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60'}`}>
                              {detailQCfg?.name || 'Phổ Thông'}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-serif ${detailSCfg?.badgeClass || ''}`}>
                              Giai {currentDetailBeast.stage || 1} • {detailSCfg?.name || 'Sơ Sinh'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 italic font-serif mt-1">
                            "{currentDetailBeast.description}"
                          </p>
                        </div>
                      </div>

                    {/* Nút xuất chiến / thu hồi */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleToggleActive(currentDetailBeast.id)}
                        className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          player.activeBeastId === currentDetailBeast.id
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {player.activeBeastId === currentDetailBeast.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Đang Xuất Chiến
                          </>
                        ) : (
                          <>
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            Triệu Hồi Ra Trận
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Thanh tiến độ Linh Khí (EXP) & Độ Trung Thành */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-serif flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" /> Linh Khí Nuôi Dưỡng (Cấp {currentDetailBeast.level})
                        </span>
                        <span className="text-amber-300 font-bold">{currentDetailBeast.exp}/{currentDetailBeast.maxExp}</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.floor((currentDetailBeast.exp / currentDetailBeast.maxExp) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400 font-serif flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> Độ Trung Thành Hộ Chủ
                        </span>
                        <span className="text-rose-300 font-bold">{currentDetailBeast.loyalty}/100%</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                        <div
                          className="bg-gradient-to-r from-rose-600 to-pink-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${currentDetailBeast.loyalty}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lựa chọn Chế Độ Hộ Thể (Mount vs Combat) */}
                  <div className="p-3 rounded-xl bg-black/30 border border-amber-900/30 space-y-2">
                    <span className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> CHỌN CHẾ ĐỘ THẦN THÚ HỘ MỆNH
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => handleToggleRole(currentDetailBeast, 'mount')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          currentDetailBeast.role === 'mount'
                            ? 'bg-sky-950/50 border-sky-500/60 shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                            : 'bg-black/40 border-zinc-800 hover:border-zinc-700 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between font-serif font-bold text-sky-200">
                          <span>🏇 Tọa Kỵ Tiên Gia</span>
                          {currentDetailBeast.role === 'mount' && <span className="text-[10px] text-sky-400">✓ Đang dùng</span>}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-serif mt-1">
                          • Giảm 20% thời gian bế quan thổ nạp.<br />
                          • Tăng 30% tốc độ phục hồi Chân Nguyên (MP).
                        </p>
                      </button>

                      <button
                        onClick={() => handleToggleRole(currentDetailBeast, 'combat')}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          currentDetailBeast.role === 'combat'
                            ? 'bg-rose-950/50 border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.25)]'
                            : 'bg-black/40 border-zinc-800 hover:border-zinc-700 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between font-serif font-bold text-rose-200">
                          <span>⚔️ Hộ Vệ Xuất Chiến</span>
                          {currentDetailBeast.role === 'combat' && <span className="text-[10px] text-rose-400">✓ Đang dùng</span>}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-serif mt-1">
                          • Đỡ thay {currentDetailBeast.stats.blockPercent}% sát thương khi đánh Boss.<br />
                          • HP &lt; 20%: Khiên "Hộ Chủ Chí Tử" +{Math.floor(currentDetailBeast.stats.maxHp * 0.3).toLocaleString()} HP!
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Chỉ số thuộc tính của Linh Thú */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-black/40 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-serif block">Khí Huyết (HP)</span>
                      <span className="text-emerald-400 font-bold text-sm">{currentDetailBeast.stats.maxHp.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-serif block">Công Kích (ATK)</span>
                      <span className="text-rose-400 font-bold text-sm">+{currentDetailBeast.stats.atk.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-serif block">Phòng Ngự (DEF)</span>
                      <span className="text-blue-400 font-bold text-sm">+{currentDetailBeast.stats.def.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 font-serif block">Tỉ Lệ Đỡ Đòn</span>
                      <span className="text-amber-400 font-bold text-sm">{currentDetailBeast.stats.blockPercent}%</span>
                    </div>
                  </div>

                  {/* Kỹ năng Thần Thông của Thú Cưng */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-yellow-400" /> THẦN THÔNG HỘ THÂN ĐÃ MỞ KHÓA
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentDetailBeast.skills.map(skill => (
                        <div key={skill.id} className="p-2.5 rounded-xl bg-black/50 border border-amber-900/30 flex items-start gap-2.5">
                          <span className="text-xl shrink-0 mt-0.5">{skill.icon || '✨'}</span>
                          <div>
                            <h5 className="font-serif font-bold text-xs text-amber-200">{skill.name}</h5>
                            <p className="text-[10px] text-zinc-400 font-serif mt-0.5 leading-relaxed">{skill.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nút Hành Động: Cho Ăn (Uy Thực) & Tiến Hóa */}
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-900/30">
                    <button
                      onClick={() => {
                        setFeedingBeast(currentDetailBeast);
                        setShowFeedModal(true);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600/40 via-yellow-600/30 to-amber-700/40 hover:from-amber-600/60 hover:to-amber-700/60 border border-amber-500/50 text-amber-200 font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      Uy Thực (Cho Ăn Đan Dược Thừa)
                    </button>

                    {(() => {
                      const evoCheck = checkCanEvolveBeast(currentDetailBeast, player);
                      const maxStage = currentDetailBeast.stage >= 4;

                      return (
                        <button
                          onClick={() => handleEvolve(currentDetailBeast)}
                          disabled={!evoCheck.canEvolve}
                          className={`flex-1 py-2 px-3 rounded-xl font-serif font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md ${
                            evoCheck.canEvolve
                              ? 'bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.4)] animate-pulse'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                          }`}
                          title={evoCheck.reason || 'Tiến hóa đột phá thần thú'}
                        >
                          <Zap className="w-4 h-4 text-purple-300" />
                          {maxStage ? 'Đỉnh Phong Cảnh Giới' : 'Đột Phá Tiến Hóa'}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PHÂN KHU 2: BÀN ẤP LINH NOÃN (INCUBATOR) */}
      {/* ======================================================== */}
      {activeSubTab === 'incubator' && (
        <div className="space-y-3">
          {eggs.length === 0 ? (
            <div className="p-8 rounded-xl bg-black/40 border border-zinc-800 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-950/30 border border-purple-800/30 flex items-center justify-center text-3xl">
                🥚
              </div>
              <h3 className="font-serif font-bold text-purple-200 text-sm">Hiện Không Có Linh Noãn Đang Ấp</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto font-serif">
                Hãy khiêu chiến Boss Thí Luyện hoặc Boss Bí Cảnh để nhặt Linh Noãn thần thú hiếm có!
              </p>
              <button
                onClick={handleClaimStarterEgg}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-serif font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5 mx-auto"
              >
                <Gift className="w-4 h-4" />
                Nhận [U Minh Yêu Noãn] Khởi Đầu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {eggs.map(egg => {
                const qCfg = getBeastQualityConfig(typeof egg.quality === 'string' ? egg.quality : undefined);
                const reqProgress = egg.requiredProgress && egg.requiredProgress > 0 ? egg.requiredProgress : 100;
                const progressPct = Math.min(100, Math.floor(((egg.progress || 0) / reqProgress) * 100));

                return (
                  <div key={egg.id} className="p-4 rounded-xl bg-[#0f0e15] border border-purple-900/40 space-y-3 shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{egg.avatar || '🥚'}</span>
                          <div>
                            <h4 className="font-serif font-bold text-xs text-purple-200">{egg.name || 'Linh Noãn'}</h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-serif ${qCfg?.badgeClass || 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60'}`}>
                              {qCfg?.name || 'Phổ Thông'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-400 font-serif mt-2 leading-relaxed">
                        {egg.description || 'Linh noãn chứa đựng sinh mệnh yêu thú thượng cổ, cần rót chân nguyên nuôi dưỡng.'}
                      </p>

                      {/* Tiến độ ấp nở */}
                      <div className="mt-3 space-y-1 font-mono text-[10px]">
                        <div className="flex justify-between items-center text-zinc-400">
                          <span>Tiến độ linh lực</span>
                          <span className="text-purple-300 font-bold">{egg.progress || 0}/{reqProgress}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Nút rót Chân Nguyên / Linh Thạch */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-900/30">
                      <button
                        onClick={() => handleInfuseMp(egg)}
                        className="py-1.5 px-2 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 border border-sky-700/50 text-sky-200 text-[10px] font-serif font-bold transition cursor-pointer flex items-center justify-center gap-1"
                        title="Tiêu hao 60 Chân Nguyên (MP) để ấp nở"
                      >
                        <Droplet className="w-3 h-3 text-sky-400" />
                        Rót MP (-60)
                      </button>

                      <button
                        onClick={() => handleInfuseLinhThach(egg)}
                        className="py-1.5 px-2 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200 text-[10px] font-serif font-bold transition cursor-pointer flex items-center justify-center gap-1"
                        title="Tiêu hao 2,500 Linh Thạch để trợ trận"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Rót LT (-2.5k)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PHÂN KHU 3: THÚ UYỂN (LAI TẠO & HUYẾT MẠCH) */}
      {/* ======================================================== */}
      {activeSubTab === 'garden' && (
        <BeastGardenView
          player={player}
          onUpdatePlayer={onUpdatePlayer}
          onAddLog={onAddLog}
          onShowToast={onShowToast}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL UY THỰC (CHO ĂN ĐAN DƯỢC / DƯỢC LIỆU THỪA) */}
      {/* ======================================================== */}
      {showFeedModal && feedingBeast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f0e17] border border-amber-600/60 rounded-2xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header Modal */}
            <div className="flex justify-between items-start border-b border-amber-900/40 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{feedingBeast.avatar}</span>
                <div>
                  <h3 className="font-serif font-bold text-amber-200 text-sm sm:text-base">
                    UY THỰC • BỒI BỔ {feedingBeast.name.toUpperCase()}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-serif">
                    Dùng đan dược & dược liệu thừa để chuyển hóa thành Linh Khí & tăng độ trung thành
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Đan Dược vs Dược Liệu */}
            <div className="flex rounded-lg bg-black/50 p-1 border border-zinc-800 text-xs gap-1">
              <button
                onClick={() => setFeedItemType('pills')}
                className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif ${
                  feedItemType === 'pills'
                    ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🔥 Đan Dược ({(player.inventory?.pills || []).filter(p => p.quantity > 0).length})
              </button>
              <button
                onClick={() => setFeedItemType('herbs')}
                className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif ${
                  feedItemType === 'herbs'
                    ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🌿 Thảo Dược ({(player.inventory?.herbs || []).filter(h => h.quantity > 0).length})
              </button>
            </div>

            {/* Danh sách vật phẩm có thể cho ăn */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {feedItemType === 'pills' ? (
                (player.inventory?.pills || []).filter(p => p.quantity > 0).length === 0 ? (
                  <p className="text-center py-8 text-xs text-zinc-500 font-serif italic">
                    Trong túi không còn đan dược nào để bồi bổ. Hãy ghé Lò Luyện Đan hoặc Thương Hội!
                  </p>
                ) : (
                  (player.inventory?.pills || []).filter(p => p.quantity > 0).map(pill => (
                    <div key={pill.id} className="p-2.5 rounded-lg bg-black/40 border border-amber-900/30 flex justify-between items-center gap-2 hover:border-amber-600/40 transition">
                      <div>
                        <div className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span>[{convertGradeToGiai(pill.grade)}] {pill.name}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${getItemQuality(pill.quality).badgeClass}`}>
                            {getItemQuality(pill.quality).name}
                          </span>
                          <span className="text-amber-400 font-mono text-xs font-bold">x{pill.quantity}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{pill.description}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleFeedPill(pill, 1)}
                          className="px-2 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[10px] font-serif font-bold transition cursor-pointer"
                        >
                          Ăn 1
                        </button>
                        {pill.quantity >= 5 && (
                          <button
                            onClick={() => handleFeedPill(pill, 5)}
                            className="px-2 py-1 rounded bg-amber-600/50 hover:bg-amber-600/70 text-amber-100 border border-amber-500/60 text-[10px] font-serif font-bold transition cursor-pointer"
                          >
                            Ăn 5
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )
              ) : (
                (player.inventory?.herbs || []).filter(h => h.quantity > 0).length === 0 ? (
                  <p className="text-center py-8 text-xs text-zinc-500 font-serif italic">
                    Trong túi không còn dược liệu nào để bồi bổ. Hãy thu hoạch tại Linh Điền!
                  </p>
                ) : (
                  (player.inventory?.herbs || []).filter(h => h.quantity > 0).map(herb => (
                    <div key={herb.id} className="p-2.5 rounded-lg bg-black/40 border border-emerald-900/30 flex justify-between items-center gap-2 hover:border-emerald-600/40 transition">
                      <div>
                        <div className="text-xs font-serif font-bold text-emerald-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>[{convertGradeToGiai(herb.grade)}] {herb.name}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono border ${getItemQuality(herb.quality).badgeClass}`}>
                            {getItemQuality(herb.quality).name}
                          </span>
                          <span className="text-emerald-400 font-mono text-xs font-bold">x{herb.quantity}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{herb.description}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleFeedHerb(herb, 1)}
                          className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-[10px] font-serif font-bold transition cursor-pointer"
                        >
                          Ăn 1
                        </button>
                        {herb.quantity >= 5 && (
                          <button
                            onClick={() => handleFeedHerb(herb, 5)}
                            className="px-2 py-1 rounded bg-emerald-600/50 hover:bg-emerald-600/70 text-emerald-100 border border-emerald-500/60 text-[10px] font-serif font-bold transition cursor-pointer"
                          >
                            Ăn 5
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
