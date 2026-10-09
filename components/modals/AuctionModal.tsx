// components/modals/AuctionModal.tsx
// GIAO DIỆN SẢNH VẠN BẢO ĐẤU GIÁ ĐẠI HỘI - CỔ PHONG TRÁNG LỆ
// Nâng cấp: Phân hệ "Ký Gửi Đấu Giá & Thao Túng Phường Thị (Player Auction Consignment & Market Manipulation)"

import React, { useState } from 'react';
import {
  X,
  Coins,
  Gavel,
  Eye,
  Flame,
  TrendingUp,
  Sparkles,
  Award,
  Crown,
  History,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Tag,
  ShoppingBag,
  AlertTriangle,
  UserCheck,
  Scale,
  Lock,
} from 'lucide-react';
import { PlayerStats, AuctionSessionState } from '@/lib/types';
import type { ConsignmentItemSource } from '@/lib/types/auction-consignment';
import { useAuctionConsignmentActions } from '@/hooks/useAuctionConsignmentActions';

export interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onShowToast?: (msg: string) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
  session: AuctionSessionState | null;
  isBiddingRunning: boolean;
  onPlaceBid: (type: 'normal' | 'aggressive') => void;
  onSoulIntimidation: (targetNpcId?: string) => void;
  onPassLot: () => void;
  onNextLot: () => void;
}

export const AuctionModal: React.FC<AuctionModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdatePlayer,
  onShowToast,
  onAddLog,
  session,
  isBiddingRunning,
  onPlaceBid,
  onSoulIntimidation,
  onPassLot,
  onNextLot,
}) => {
  // Tab chuyển đổi: 'buy' (Mua đồ đấu giá) hoặc 'consignment' (Ký gửi bán đồ & Thao túng thị trường)
  const [modalTab, setModalTab] = useState<'buy' | 'consignment'>('buy');
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'pill' | 'equipment' | 'beast_egg' | 'manual'>('all');

  // Input đặt giá ký gửi
  const [inputStartingPrice, setInputStartingPrice] = useState<number>(50000);
  const [inputReservePrice, setInputReservePrice] = useState<number>(80000);

  // Hook ký gửi & thao túng phường thị
  const consignment = useAuctionConsignmentActions({
    player,
    setPlayer: onUpdatePlayer ? (updater) => {
      const next = typeof updater === 'function' ? updater(player) : updater;
      onUpdatePlayer(next);
    } : undefined,
    showToast: onShowToast,
    addLog: onAddLog,
  });

  if (!isOpen) return null;

  // ─── Render Dữ Liệu Phần Đấu Giá Mua (Tab 'buy') ──────────────────────────
  const currentLot = session && session.items ? session.items[session.currentItemIndex] : null;
  const minIncrement = currentLot?.minBidIncrement || 2000;
  const currentPrice = session?.currentPrice || 0;

  const normalIncrement = Math.ceil(Math.max(minIncrement, Math.floor(currentPrice * 0.08)) / 1000) * 1000;
  const normalNextPrice = currentPrice + normalIncrement;
  const aggressiveIncrement = Math.ceil(Math.max(minIncrement * 3, Math.floor(currentPrice * 0.28)) / 1000) * 1000;
  const aggressiveNextPrice = currentPrice + aggressiveIncrement;

  const canAffordNormal = (player.spiritStones || player.linhThach || 0) >= normalNextPrice;
  const canAffordAggressive = (player.spiritStones || player.linhThach || 0) >= aggressiveNextPrice;

  const rarityColors: Record<string, string> = {
    cuc: 'from-purple-950 via-purple-900/60 to-purple-950 border-purple-500/60 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    than: 'from-amber-950 via-orange-950/60 to-amber-950 border-amber-500/70 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    tien: 'from-yellow-950 via-rose-950/60 to-yellow-950 border-yellow-400 text-yellow-200 shadow-[0_0_35px_rgba(250,204,21,0.4)] animate-pulse'
  };

  const rarityBadge: Record<string, string> = {
    cuc: 'bg-purple-950 text-purple-300 border-purple-500',
    than: 'bg-amber-950 text-amber-300 border-amber-500',
    tien: 'bg-yellow-950 text-yellow-200 border-yellow-400 font-bold'
  };

  const isPlayerWinning = session?.highestBidder?.isPlayer;
  const isSold = session?.status === 'sold';
  const isFinished = session?.status === 'finished';

  const avgNpcSoul = session?.npcs ? (session.npcs.reduce((acc, n) => acc + n.thanThuc, 0) / Math.max(1, session.npcs.length)) : 30;
  const diffSoul = (player.thanThuc || (player as any).stats?.thanThuc || 30) - avgNpcSoul;
  const avgSoulChance = Math.min(95, Math.max(15, Math.round(50 + diffSoul * 0.45)));

  const leadingNpc = (session && !session.highestBidder.isPlayer && session.highestBidder.bidderId !== 'auctioneer')
    ? session.npcs.find(n => n.id === session.highestBidder.bidderId && n.status === 'active')
    : null;
  const leadingDiff = leadingNpc ? ((player.thanThuc || (player as any).stats?.thanThuc || 30) - leadingNpc.thanThuc) : 0;
  const leadingCount = leadingNpc?.intimidateCount || 0;

  // Lọc vật phẩm ký gửi hợp lệ theo filter
  const filteredConsignmentItems = consignment.validItems.filter(item => {
    if (itemTypeFilter === 'all') return true;
    return item.type === itemTypeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[94vh] flex flex-col bg-[#0c0a14] border border-amber-600/50 rounded-2xl shadow-[0_0_50px_rgba(217,119,6,0.3)] overflow-hidden relative">
        {/* Nền cổ phong hoa văn */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. HEADER ĐẤU GIÁ HỘI */}
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-950/80 via-[#18121f] to-amber-950/80 border-b border-amber-800/40 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-base border border-amber-400/50 shadow">
              🏛️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
                {modalTab === 'buy' ? (session?.sessionTitle || 'Vạn Bảo Đấu Giá Đại Hội') : 'KÝ GỬI & THAO TÚNG PHƯỜNG THỊ'}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-serif">
                {modalTab === 'buy' ? (
                  <>
                    <span>Lô: <strong>{(session?.currentItemIndex || 0) + 1} / {session?.items?.length || 1}</strong></span>
                    <span className="text-amber-500/60">•</span>
                    <span className="text-amber-300 font-mono">Bảo Vật Cổ Thần Vạn Bảo Các</span>
                  </>
                ) : (
                  <>
                    <span>Uy Tín: <strong className="text-amber-300">{consignment.consignmentState.merchantReputation}/100</strong></span>
                    <span className="text-amber-500/60">•</span>
                    <span className="text-purple-300 font-mono">{consignment.reputationTier.badge}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Túi tiền người chơi */}
            <div className="bg-black/60 px-3 py-1 rounded-lg border border-amber-700/40 flex items-center gap-1.5 shadow-inner">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <div className="text-right">
                <span className="text-[8px] text-zinc-400 block leading-tight">Linh Thạch:</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {(player.spiritStones || player.linhThach || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─── THANH SUB-TABS: CHUYỂN ĐỔI GIỮA MUA VÀ KÝ GỬI BÁN ────────────── */}
        <div className="flex border-b border-amber-900/30 bg-black/50 px-3 py-1.5 gap-2 relative z-10 shrink-0">
          <button
            onClick={() => setModalTab('buy')}
            className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer ${
              modalTab === 'buy'
                ? 'bg-gradient-to-r from-amber-900/80 to-yellow-900/60 text-amber-200 border border-amber-500/60 shadow'
                : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            🏛️ Hội Trường Đấu Giá (Mua)
          </button>

          <button
            onClick={() => setModalTab('consignment')}
            className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
              modalTab === 'consignment'
                ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/60 text-purple-200 border border-purple-500/60 shadow'
                : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            🏷️ Ký Gửi & Thao Túng Thị Trường (Bán)
            {consignment.activeSession && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
            )}
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: HỘI TRƯỜNG ĐẤU GIÁ (MUA BẢO VẬT) - GIỮ NGUYÊN HOÀN TOÀN
        ══════════════════════════════════════════════════════════════════════ */}
        {modalTab === 'buy' && session && currentLot && (
          <>
            <div className="p-3 sm:p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar relative z-10">
              {/* KHỐI 1: BỤC TRƯNG BÀY DỊ BẢO & BẢNG BÚA ĐẤU GIÁ */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* Thẻ Kỳ Trân Dị Bảo (7 Cột) */}
                <div className={`md:col-span-7 p-3.5 rounded-xl border bg-gradient-to-br ${rarityColors[currentLot.rarity]} flex flex-col justify-between relative overflow-hidden`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
                          {currentLot.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-serif font-bold text-white tracking-wide">
                              {currentLot.name}
                            </h3>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono uppercase ${rarityBadge[currentLot.rarity]}`}>
                              {currentLot.rarity === 'tien' ? 'Tiên Phẩm' : currentLot.rarity === 'than' ? 'Thần Phẩm' : 'Cực Phẩm'}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-300 font-serif line-clamp-2 mt-0.5">
                            {currentLot.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Thuyết minh truyền thuyết cổ phong từ Đấu Giá Sư */}
                    <div className="p-2 rounded-lg bg-black/50 border border-white/10 text-[10px] text-amber-200/90 font-serif italic leading-relaxed">
                      📜 "{currentLot.lore}"
                    </div>
                  </div>

                  {/* Thông tin giá khởi điểm & ước tính thị trường */}
                  <div className="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-white/10 text-[10px] font-mono">
                    <div className="bg-black/40 p-1.5 rounded border border-white/5">
                      <span className="text-zinc-400 block text-[9px]">Giá Khởi Điểm:</span>
                      <span className="text-amber-300 font-bold">{currentLot.startingPrice.toLocaleString()} LT</span>
                    </div>
                    <div className="bg-black/40 p-1.5 rounded border border-white/5">
                      <span className="text-zinc-400 block text-[9px]">Giá Thị Trường Ước Tính:</span>
                      <span className="text-yellow-400 font-bold">~{currentLot.reservePrice.toLocaleString()} LT</span>
                    </div>
                  </div>
                </div>

                {/* Bảng Giá Hiện Tại & Nhịp Đập Búa (5 Cột) */}
                <div className="md:col-span-5 p-3.5 rounded-xl border border-amber-600/40 bg-gradient-to-b from-[#15101f] to-[#0d0914] flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="text-center space-y-1">
                      <span className="text-[10px] text-zinc-400 font-serif uppercase tracking-wider block">
                        Mức Giá Dẫn Đầu Hiện Tại
                      </span>
                      <div className="text-xl sm:text-2xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                        {session.currentPrice.toLocaleString()} <span className="text-xs text-amber-400/80 font-serif">Linh Thạch</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-serif border font-bold">
                        {isPlayerWinning ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-emerald-400" />
                            🏆 Ngươi Đang Dẫn Đầu!
                          </span>
                        ) : (
                          <span className="text-rose-300 flex items-center gap-1">
                            Đối Thủ: {session.highestBidder.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Thanh 3 Nhịp Gõ Búa */}
                    <div className="p-2.5 rounded-lg bg-black/60 border border-amber-900/50 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-serif">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Gavel className="w-3 h-3 text-amber-400" />
                          Tiến Trình Gõ Búa:
                        </span>
                        <span className={`font-bold font-mono ${
                          session.hammerCount === 3 ? 'text-emerald-400 animate-pulse' : session.hammerCount === 2 ? 'text-orange-400' : session.hammerCount === 1 ? 'text-yellow-400' : 'text-zinc-500'
                        }`}>
                          {session.hammerCount === 3
                            ? 'THÀNH GIAO!'
                            : session.hammerCount === 2
                            ? 'LẦN THỨ HAI!'
                            : session.hammerCount === 1
                            ? 'LẦN THỨ NHẤT!'
                            : 'Đang Tranh Giá'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {[1, 2, 3].map(step => {
                          const isActive = session.hammerCount >= step;
                          return (
                            <div
                              key={step}
                              className={`py-1.5 rounded text-center text-[10px] font-mono border transition-all duration-300 ${
                                isActive
                                  ? step === 3
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] font-bold scale-105'
                                    : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)] font-bold'
                                  : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                              }`}
                            >
                              🔨 {step === 3 ? 'Thành Giao' : `Lần ${step}`}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KHỐI 2: HÀNG GHẾ ĐẠI NĂNG THAM CHIẾN */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-serif text-zinc-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Các Đại Năng & Thế Gia Tham Gia Đấu Giá ({session.npcs.filter(n => n.status === 'active').length} Còn Lại)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {session.npcs.map(npc => {
                    const isFolded = npc.status === 'folded';
                    const isIntimidated = npc.status === 'intimidated';
                    const isHighest = session.highestBidder.bidderId === npc.id;

                    return (
                      <div
                        key={npc.id}
                        className={`p-2.5 rounded-xl border transition-all relative overflow-hidden ${
                          isHighest
                            ? 'bg-gradient-to-b from-amber-950/60 to-black/80 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                            : isFolded
                            ? 'bg-zinc-950/40 border-zinc-800/40 opacity-40 grayscale'
                            : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-serif font-bold text-zinc-200 truncate">
                            {npc.name}
                          </span>
                          <span className="text-[9px] px-1 rounded bg-black/40 border border-zinc-700 font-mono text-zinc-400">
                            {npc.roleType === 'the_gia' ? 'Thế Gia' : npc.roleType === 'truong_lao' ? 'Trưởng Lão' : 'Tán Tu'}
                          </span>
                        </div>

                        <div className="text-[9px] font-mono text-zinc-500 mb-1 flex justify-between">
                          <span>Thần Thức: {npc.thanThuc}</span>
                          <span className={isFolded ? 'text-zinc-600' : isIntimidated ? 'text-purple-400' : 'text-emerald-400'}>
                            {isFolded ? 'Đã Rút Lui' : isIntimidated ? 'Bị Dằn Mặt' : 'Đang Theo'}
                          </span>
                        </div>

                        {npc.dialogue && (
                          <p className="text-[9px] text-zinc-400 font-serif italic truncate">
                            "{npc.dialogue}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FOOTER THANH THAO TÁC CỦA NGƯỜI CHƠI (TAB BUY) */}
            {!isSold && !isFinished && (
              <div className="p-3 sm:p-4 bg-gradient-to-t from-black via-[#0f0b18] to-transparent border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2.5 relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlaceBid('normal')}
                    disabled={!canAffordNormal || isBiddingRunning}
                    className={`py-2 px-3.5 rounded-xl font-serif font-bold text-xs transition flex items-center gap-1.5 shadow ${
                      canAffordNormal && !isBiddingRunning
                        ? 'bg-gradient-to-r from-amber-700 to-yellow-600 hover:brightness-125 text-white border border-amber-400 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Nâng Giá Nhẹ: <strong>{normalNextPrice.toLocaleString()} LT</strong></span>
                  </button>

                  <button
                    onClick={() => onPlaceBid('aggressive')}
                    disabled={!canAffordAggressive || isBiddingRunning}
                    className={`py-2 px-3.5 rounded-xl font-serif font-bold text-xs transition flex items-center gap-1.5 shadow ${
                      canAffordAggressive && !isBiddingRunning
                        ? 'bg-gradient-to-r from-orange-600 to-rose-600 hover:brightness-125 text-white border border-orange-400 cursor-pointer shadow-[0_0_15px_rgba(234,88,12,0.4)] animate-pulse'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Đẩy Giá Dằn Mặt: <strong>{aggressiveNextPrice.toLocaleString()} LT</strong></span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSoulIntimidation(leadingNpc?.id)}
                    disabled={isBiddingRunning}
                    className="py-2 px-3.5 rounded-xl font-serif font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow bg-gradient-to-r from-purple-800 to-indigo-700 hover:brightness-125 text-purple-100 border border-purple-400/60"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-300" />
                    <span>👁️ Thần Thức Áp Chế (~{avgSoulChance}%)</span>
                  </button>

                  <button
                    onClick={onPassLot}
                    disabled={isBiddingRunning}
                    className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white font-serif text-xs transition cursor-pointer"
                  >
                    Nhường Lô Này
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: KÝ GỬI & THAO TÚNG PHƯỜNG THỊ (BÁN ĐỒ & GIAN THƯƠNG)
        ══════════════════════════════════════════════════════════════════════ */}
        {modalTab === 'consignment' && (
          <div className="p-3 sm:p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar relative z-10">
            {/* 1. THẺ UY TÍN THƯƠNG NHÂN (BANNER CỔ PHONG) */}
            <div
              className="p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
              style={{
                borderColor: `${consignment.reputationTier.color}66`,
                background: `linear-gradient(135deg, ${consignment.reputationTier.color}15, rgba(0,0,0,0.7))`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black border"
                  style={{
                    borderColor: consignment.reputationTier.color,
                    background: `${consignment.reputationTier.color}22`,
                  }}
                >
                  ⚖️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-serif font-bold text-white">
                      {consignment.reputationTier.name}
                    </h3>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border"
                      style={{
                        color: consignment.reputationTier.color,
                        borderColor: `${consignment.reputationTier.color}88`,
                        background: 'rgba(0,0,0,0.5)',
                      }}
                    >
                      {consignment.reputationTier.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-serif mt-0.5">
                    {consignment.reputationTier.description}
                  </p>
                </div>
              </div>

              {/* Chỉ số % phí & uy tín */}
              <div className="flex items-center gap-3 font-mono text-[10px] self-end sm:self-center">
                <div className="bg-black/50 px-2 py-1 rounded border border-zinc-800 text-center">
                  <span className="text-zinc-500 block text-[8px]">Phí Niêm Yết</span>
                  <span className="text-amber-300 font-bold">{consignment.reputationTier.listingFeePercent}%</span>
                </div>
                <div className="bg-black/50 px-2 py-1 rounded border border-zinc-800 text-center">
                  <span className="text-zinc-500 block text-[8px]">Hoa Hồng Sàn</span>
                  <span className="text-purple-300 font-bold">{consignment.reputationTier.finalCommissionPercent}%</span>
                </div>
                <div className="bg-black/50 px-2 py-1 rounded border border-zinc-800 text-center">
                  <span className="text-zinc-500 block text-[8px]">Điểm Uy Tín</span>
                  <span className="text-emerald-300 font-bold">{consignment.consignmentState.merchantReputation}/100</span>
                </div>
              </div>
            </div>

            {/* ─── NẾU CHƯA CÓ PHIÊN ĐẤU GIÁ NÀO ĐANG DIỄN RA ──────────────── */}
            {!consignment.activeSession && (
              <div className="space-y-4">
                {/* A. DANH SÁCH TANG VẬT BỊ TỊCH THU (NẾU CÓ) */}
                {consignment.consignmentState.confiscatedItems.length > 0 && (
                  <div className="p-3 rounded-xl border border-rose-600/60 bg-gradient-to-r from-rose-950/40 to-black/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-300 font-serif font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                      Tang Vật Đang Bị Vạn Bảo Các Tịch Thu Giam Giữ ({consignment.consignmentState.confiscatedItems.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {consignment.consignmentState.confiscatedItems.map((rec, idx) => {
                        const canRedeem = Date.now() >= rec.confiscatedUntilTimestamp;
                        const hoursRemaining = Math.max(0, Math.ceil((rec.confiscatedUntilTimestamp - Date.now()) / (3600 * 1000)));

                        return (
                          <div key={idx} className="p-2 rounded-lg bg-black/60 border border-rose-900/50 flex items-center justify-between text-[10px]">
                            <div>
                              <p className="font-serif font-bold text-white">{rec.item.name}</p>
                              <p className="text-zinc-400 font-mono text-[9px]">
                                {canRedeem ? 'Đã hết hạn giam giữ!' : `Còn giam: ${hoursRemaining} giờ`} • Phạt: {rec.fineAmount.toLocaleString()} LT
                              </p>
                            </div>
                            <button
                              onClick={() => consignment.handleRedeemConfiscatedItem(idx)}
                              disabled={!canRedeem || (player.spiritStones || player.linhThach || 0) < rec.fineAmount}
                              className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white font-serif font-bold text-[9px] transition cursor-pointer"
                            >
                              Nộp Phạt Chuộc
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* B. KHU VỰC CHỌN VẬT PHẨM TỪ TÚI ĐỂ KÝ GỬI */}
                <div className="rounded-xl border border-amber-800/40 bg-black/40 p-3 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                    <span className="font-serif font-bold text-xs text-amber-200 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      Chọn Bảo Vật Cực Phẩm Trong Túi Để Niêm Yết Sàn ({consignment.validItems.length} Món)
                    </span>

                    {/* Bộ lọc loại vật phẩm */}
                    <div className="flex gap-1 text-[9px] font-serif">
                      {[
                        { id: 'all', label: 'Tất Cả' },
                        { id: 'pill', label: 'Đan Dược' },
                        { id: 'equipment', label: 'Trang Bị' },
                        { id: 'beast_egg', label: 'Linh Noãn' },
                        { id: 'manual', label: 'Bí Tịch' },
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setItemTypeFilter(f.id as any)}
                          className={`px-2 py-0.5 rounded transition cursor-pointer ${
                            itemTypeFilter === f.id
                              ? 'bg-amber-900/60 text-amber-200 border border-amber-600'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredConsignmentItems.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-xs font-serif">
                      Trong túi đồ không có vật phẩm cực phẩm nào đủ tiêu chuẩn ký gửi.<br />
                      <span className="text-[10px] text-zinc-600">
                        (Yêu cầu: Đan Dược Cực Phẩm/Thần Phẩm, Trang Bị Bậc 7+, Trứng Thú, hoặc Bí Tịch Thiên Giai).
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto custom-scrollbar p-1">
                      {filteredConsignmentItems.map(item => {
                        const isSelected = consignment.selectedItemForListing?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              consignment.setSelectedItemForListing(item);
                              setInputStartingPrice(Math.round(item.estimatedMarketValue * 0.7));
                              setInputReservePrice(item.estimatedMarketValue);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-950/50 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                                : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-2xl">{item.icon}</span>
                              <div className="overflow-hidden">
                                <p className="text-xs font-serif font-bold text-white truncate">{item.name}</p>
                                <p className="text-[9px] text-amber-400 font-mono">{item.grade}</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-mono pt-1 border-t border-zinc-800">
                              <span className="text-zinc-500">Ước Tính:</span>
                              <span className="text-amber-300 font-bold">~{item.estimatedMarketValue.toLocaleString()} LT</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* FORM ĐẶT GIÁ KHI ĐÃ CHỌN 1 MÓN ĐỒ */}
                  {consignment.selectedItemForListing && (
                    <div className="p-3 rounded-xl border border-amber-600/50 bg-gradient-to-r from-amber-950/30 to-purple-950/30 space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-amber-200">
                          ⚙️ Thiết Lập Mức Giá Ký Gửi: [{consignment.selectedItemForListing.name}]
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          Thị trường: ~{consignment.selectedItemForListing.estimatedMarketValue.toLocaleString()} LT
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Giá Khởi Điểm (Starting Bid):</label>
                          <input
                            type="number"
                            value={inputStartingPrice}
                            onChange={(e) => setInputStartingPrice(Math.max(1000, Number(e.target.value)))}
                            className="w-full bg-black/60 border border-zinc-700 rounded px-2.5 py-1.5 font-mono text-amber-300 text-xs focus:border-amber-400 outline-none"
                          />
                          <span className="text-[9px] text-zinc-500 block mt-0.5">
                            Phí niêm yết ({consignment.reputationTier.listingFeePercent}%):{' '}
                            <strong className="text-amber-400">
                              {Math.floor(inputStartingPrice * (consignment.reputationTier.listingFeePercent / 100)).toLocaleString()} LT
                            </strong>
                          </span>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Giá Bảo Lưu Tối Thiểu (Reserve Price):</label>
                          <input
                            type="number"
                            value={inputReservePrice}
                            onChange={(e) => setInputReservePrice(Math.max(inputStartingPrice, Number(e.target.value)))}
                            className="w-full bg-black/60 border border-zinc-700 rounded px-2.5 py-1.5 font-mono text-purple-300 text-xs focus:border-purple-400 outline-none"
                          />
                          <span className="text-[9px] text-zinc-500 block mt-0.5">
                            Nếu không ai trả tới mức này, vật phẩm sẽ tự động hoàn trả về túi.
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => consignment.handleStartConsignment(
                          consignment.selectedItemForListing!,
                          inputStartingPrice,
                          inputReservePrice
                        )}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:brightness-125 text-white font-serif font-bold text-xs transition cursor-pointer shadow-lg shadow-amber-900/40"
                      >
                        🏷️ Nộp Phí Niêm Yết & Khai Mở Phiên Đấu Giá
                      </button>
                    </div>
                  )}
                </div>

                {/* C. LỊCH SỬ KÝ GỬI THÀNH CÔNG */}
                {consignment.consignmentState.history.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-serif font-bold text-zinc-400 flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-zinc-500" /> Sổ Sách Giao Dịch Đã Hoàn Tất
                    </p>
                    <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                      {consignment.consignmentState.history.map((h, i) => (
                        <div key={i} className="p-2 rounded-lg bg-black/40 border border-zinc-800 flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-serif font-bold text-white">{h.itemName}</span>
                            <span className="text-zinc-500 ml-2">Bán cho: {h.soldTo}</span>
                          </div>
                          <div className="font-mono text-right">
                            <span className="text-amber-300 font-bold">+{h.profit.toLocaleString()} LT</span>
                            <span className="text-zinc-600 text-[8px] block">
                              {new Date(h.timestamp).toLocaleTimeString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── NẾU ĐANG CÓ PHIÊN ĐẤU GIÁ KÝ GỬI DIỄN RA (LIVE ARENA) ──── */}
            {consignment.activeSession && (
              <div className="space-y-4">
                {/* KHỐI 1: BỤC GÕ BÚA TRUNG TÂM & MỨC GIÁ HIỆN TẠI */}
                <div className="p-4 rounded-2xl border border-amber-500/60 bg-gradient-to-b from-[#1c1328] via-black to-[#100b1a] relative overflow-hidden shadow-2xl">
                  {/* Procedural SVG Chiếc Búa Vàng Gõ Nhịp */}
                  <div className="flex flex-col items-center justify-center py-2 relative">
                    <div className={`transition-transform duration-200 ${consignment.isHammerHitting ? 'rotate-[-35deg] scale-125' : 'rotate-0'}`}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14 13-7.5 7.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8L11.2 10.2" />
                        <path d="m16 16 6-6" />
                        <path d="m8 8 6-6" />
                        <path d="m9 7 8 8" />
                        <path d="m21 11-8-8" />
                      </svg>
                    </div>

                    <span className="text-[10px] text-zinc-400 font-serif uppercase tracking-widest mt-1">
                      {consignment.activeSession.status === 'bidding'
                        ? `VÒNG ĐẤU GIÁ ${consignment.activeSession.currentRound} / ${consignment.activeSession.maxRounds}`
                        : consignment.activeSession.status === 'sold'
                        ? 'ĐÃ GÕ BÚA THÀNH GIAO!'
                        : consignment.activeSession.status === 'busted'
                        ? '🚨 ĐÃ BỊ BÓC PHỐT TỊCH THU!'
                        : 'KẾT THÚC BẤT THÀNH!'}
                    </span>

                    {/* Mức giá trả hiện tại */}
                    <div className="text-2xl sm:text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 my-1">
                      {consignment.activeSession.currentBid.toLocaleString()} <span className="text-xs text-amber-400/80 font-serif">Linh Thạch</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-serif">
                      <span className="text-zinc-400">Đang Dẫn Đầu:</span>
                      <strong className={`px-2 py-0.5 rounded border ${
                        consignment.activeSession.highestBidder && 'isShill' in consignment.activeSession.highestBidder && consignment.activeSession.highestBidder.isShill
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500'
                          : 'bg-amber-950/80 text-amber-300 border-amber-600'
                      }`}>
                        {(consignment.activeSession.highestBidder as any).name}
                      </strong>
                    </div>
                  </div>

                  {/* Thông tin vật phẩm đang đấu giá */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/10 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{consignment.activeSession.item.icon}</span>
                      <div>
                        <span className="font-serif font-bold text-white">{consignment.activeSession.item.name}</span>
                        <span className="text-zinc-500 ml-2 font-mono">{consignment.activeSession.item.grade}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-zinc-500">Giá Bảo Lưu:</span>{' '}
                      <span className="text-purple-300 font-bold">{consignment.activeSession.reservePrice.toLocaleString()} LT</span>
                    </div>
                  </div>
                </div>

                {/* KHỐI 2: HÀNG GHẾ 5 NPC BIDDERS & NÚT DẰN MẶT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-serif text-zinc-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Hàng Ghế Các Đại Năng Thế Gia ({consignment.activeSession.bidders.filter(b => !b.hasWithdrawn).length} Còn Lại)
                    </span>
                    <span className="text-[10px] text-zinc-500">Bấm "👁️ Dằn Mặt" để ép đối phương nâng giá</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                    {consignment.activeSession.bidders.map(bidder => {
                      const isHighest = (consignment.activeSession?.highestBidder as any)?.id === bidder.id;
                      const playerSoul = player.thanThuc || (player as any).stats?.thanThuc || 40;
                      const soulDiff = playerSoul - bidder.divineSense;

                      return (
                        <div
                          key={bidder.id}
                          className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
                            isHighest
                              ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                              : bidder.hasWithdrawn
                              ? 'bg-zinc-950/40 border-zinc-900 opacity-30 grayscale'
                              : 'bg-black/50 border-zinc-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-lg">{bidder.avatar}</span>
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-serif font-bold text-white truncate">{bidder.name}</p>
                                <p className="text-[8px] text-zinc-500 truncate">{bidder.sectOrFamily}</p>
                              </div>
                            </div>

                            <div className="flex justify-between text-[8px] font-mono text-zinc-400 mb-1.5">
                              <span>Thần Thức: {bidder.divineSense}</span>
                              <span className={bidder.hasWithdrawn ? 'text-zinc-600' : 'text-emerald-400'}>
                                {bidder.hasWithdrawn ? 'Đã Rút' : 'Đang Theo'}
                              </span>
                            </div>
                          </div>

                          {!bidder.hasWithdrawn && consignment.activeSession?.status === 'bidding' && (
                            <button
                              onClick={() => consignment.handleIntimidateBidder(bidder.id)}
                              className="w-full py-1 rounded bg-purple-950/80 hover:bg-purple-800/90 border border-purple-500/50 text-purple-200 text-[8px] font-serif font-bold transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              Dằn Mặt ({soulDiff >= 0 ? `+${soulDiff}` : soulDiff})
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* KHỐI 3: LIVE TICKER NHẬT KÝ TRẢ GIÁ */}
                <div className="space-y-1.5">
                  <span className="text-xs font-serif font-bold text-zinc-400 flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-zinc-500" /> Nhật Ký Các Lượt Giơ Biển Trả Giá
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar p-1">
                    {consignment.activeSession.bidHistory.map((rec, i) => (
                      <div key={i} className="p-1.5 rounded-lg bg-black/40 border border-zinc-800/80 flex items-center justify-between text-[9px] font-serif">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-500">Vòng {rec.round}</span>
                          <strong className={rec.isShill ? 'text-rose-400' : 'text-amber-200'}>
                            {rec.bidderName}:
                          </strong>
                          <span className="text-zinc-300 italic truncate max-w-[280px]">"{rec.commentary}"</span>
                        </div>
                        <span className="font-mono font-bold text-amber-300 shrink-0">
                          {rec.bidAmount.toLocaleString()} LT
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KHỐI 4: BẢNG ĐIỀU KHIỂN HẬU ĐÀI (THỦ ĐOẠN GIAN THƯƠNG) */}
                <div className="p-3 rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-[#100b1a] to-zinc-950 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-serif">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      🎭 Bảng Điều Khiển Hậu Đài (Thủ Đoạn Gian Thương)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Nguy Cơ Bị Bóc Phốt:{' '}
                      <strong className={
                        consignment.activeSession.bustRiskPercent > 50
                          ? 'text-rose-400 animate-pulse'
                          : consignment.activeSession.bustRiskPercent > 20
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }>
                        {consignment.activeSession.bustRiskPercent}%
                      </strong>
                    </span>
                  </div>

                  {/* Thanh đo nguy cơ bóc phốt (Bust Meter) */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${consignment.activeSession.bustRiskPercent}%`,
                        background:
                          consignment.activeSession.bustRiskPercent > 50
                            ? '#f43f5e'
                            : consignment.activeSession.bustRiskPercent > 25
                            ? '#f59e0b'
                            : '#10b981',
                      }}
                    />
                  </div>

                  {/* CÁC NÚT THAO TÁC HẬU ĐÀI */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {consignment.activeSession.status === 'bidding' ? (
                      <>
                        <button
                          onClick={consignment.handleNextRound}
                          disabled={consignment.isHammerHitting}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-yellow-600 hover:brightness-125 text-white font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                        >
                          <Gavel className="w-3.5 h-3.5" />
                          🔨 Gõ Búa Sang Vòng Kế Tiếp
                        </button>

                        <button
                          onClick={() => consignment.handleTriggerShillBid('Đạo Lữ / Đệ Tử')}
                          disabled={consignment.isHammerHitting}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-900 to-red-800 hover:brightness-125 text-rose-100 border border-rose-500/50 font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                        >
                          <Flame className="w-3.5 h-3.5 text-rose-400" />
                          🎭 Cài Chân Gỗ Kích Giá (+25% - Nguy Cơ +25%)
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={consignment.handleFinalizeConsignment}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:brightness-125 text-white font-serif font-bold text-sm transition cursor-pointer shadow-lg shadow-emerald-900/40"
                      >
                        📦 Kết Toán Phiên Đấu Giá & Nhận Kết Quả
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
