'use client';

// components/tabs/BlackMarketView.tsx
// Giao diện người dùng Cổ Phong Ma Mị cho:
// "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"

import React, { useState } from 'react';
import {
  Skull,
  Moon,
  AlertTriangle,
  Flame,
  Coins,
  ShieldAlert,
  Swords,
  Timer,
  Package,
  TrendingUp,
  History,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Eye,
  Info
} from 'lucide-react';
import { PlayerStats, LogType } from '@/lib/types';
import {
  BlackMarketLot,
  ContrabandCategory,
  RaidResolutionChoice,
  RaidResolutionResult
} from '@/lib/types/black-market';
import { useBlackMarketActions } from '@/hooks/useBlackMarketActions';

export interface BlackMarketViewProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  addLog?: (title: string, content: string, type: LogType) => void;
  showToast?: (message: string) => void;
}

export const BlackMarketView: React.FC<BlackMarketViewProps> = ({
  player,
  setPlayer,
  addLog,
  showToast
}) => {
  const {
    currentDay,
    moonInfo,
    session,
    raidResultModal,
    setRaidResultModal,
    handlePlaceBid,
    handleConsignItem,
    handleResolveRaid,
    handleSettleLot
  } = useBlackMarketActions({ player, setPlayer, addLog, showToast });

  // Tab con trong giao diện: Sàn Đấu Giá | Ký Gửi Cấm Vật | Nhật Ký Giao Dịch
  const [activeSubTab, setActiveSubTab] = useState<'lots' | 'consign' | 'history'>('lots');

  // Modal trả giá trực tiếp (Custom Bid Modal)
  const [selectedLotForBid, setSelectedLotForBid] = useState<BlackMarketLot | null>(null);
  const [customBidInput, setCustomBidInput] = useState<string>('');

  // Lựa chọn vật phẩm để ký gửi
  const [selectedItemForConsign, setSelectedItemForConsign] = useState<any | null>(null);
  const [consignPriceInput, setConsignPriceInput] = useState<string>('');

  const currentStones = typeof player.spiritStones === 'number'
    ? player.spiritStones
    : (player.linhThach ?? 0);

  // Lọc các vật phẩm trong túi có thể ký gửi lên sàn (chưa bị khóa trong ký quỹ)
  const consignableItems = React.useMemo(() => {
    const list: any[] = [];
    const inv = player.inventory;

    if (Array.isArray(inv)) {
      list.push(...inv.filter(i => !i.isLockedInEscrow));
    } else if (inv && typeof inv === 'object') {
      ['ores', 'pills', 'equipments', 'equipment', 'herbs', 'manuals'].forEach(cat => {
        if (Array.isArray((inv as any)[cat])) {
          list.push(...(inv as any)[cat].filter((i: any) => !i.isLockedInEscrow));
        }
      });
    }

    // Linh noãn trong Thú Uyển
    if (player.beastGarden && Array.isArray(player.beastGarden.eggs)) {
      list.push(
        ...player.beastGarden.eggs
          .filter(e => !e.isHatched && !e.isLockedInEscrow)
          .map(e => ({
            ...e,
            category: 'heretical_egg',
            price: e.rarity ? e.rarity * 10000 : 15000,
            isEgg: true
          }))
      );
    }

    return list;
  }, [player.inventory, player.beastGarden]);

  // Màu sắc theo danh mục cấm phẩm
  const getCategoryBadge = (cat: ContrabandCategory) => {
    switch (cat) {
      case 'forbidden_pill':
        return <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-600/50 text-rose-300 text-[10px] font-serif">☠️ Cấm Đan</span>;
      case 'demonic_artifact':
        return <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-600/50 text-purple-300 text-[10px] font-serif">🗡️ Ma Bảo</span>;
      case 'cursed_tome':
        return <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300 text-[10px] font-serif">📜 Tà Kinh</span>;
      case 'heretical_egg':
        return <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] font-serif">🥚 Dị Noãn</span>;
      case 'abyssal_ore':
        return <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-indigo-600/50 text-indigo-300 text-[10px] font-serif">💎 Cửu U Thạch</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">Cấm Phẩm</span>;
    }
  };

  // Tính thanh đo Bust Risk
  const bustRisk = session.bustRiskMeter || 0;
  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'from-purple-600 to-indigo-600';
    if (risk < 60) return 'from-amber-600 to-orange-600';
    return 'from-rose-600 to-red-600 animate-pulse';
  };

  return (
    <div className="space-y-4 py-1 text-zinc-200">
      {/* ============================================================ */}
      {/* 1. HEADER KHÔNG KHÍ CẤM ĐỊA U MINH HẮC THỊ */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0a0512] via-[#140824] to-[#0a0512] border border-purple-900/60 p-4 shadow-2xl">
        {/* Ánh sáng ma mị nền */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-700/50 text-purple-300 shadow">
                <Skull className="w-5 h-5 text-rose-400" />
              </span>
              <div>
                <h2 className="text-base font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-rose-200 to-amber-200 flex items-center gap-2">
                  U Minh Hắc Thị
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 font-mono font-bold">
                    CẤM ĐỊA X2
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-400 font-serif">
                  Nơi vạn ma tề tựu tranh đoạt cấm vật dị bảo. Ký gửi x2 lợi nhuận • Cẩn trọng Tiên Quan đột kích!
                </p>
              </div>
            </div>
          </div>

          {/* Phù hiệu Thiên Văn Trăng Tròn / Vọng Nguyệt */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-purple-800/40 text-xs">
            <div className="flex items-center gap-1.5">
              <Moon className={`w-4 h-4 ${moonInfo.isAuctionOpen ? 'text-amber-400 animate-spin-slow' : 'text-zinc-500'}`} />
              <span className="font-serif font-bold text-xs">
                {moonInfo.isAuctionOpen ? (
                  <span className="text-amber-300">🌕 ĐÊM VỌNG NGUYỆT (MỞ CỬA)</span>
                ) : (
                  <span className="text-zinc-400">🌑 HẮC VỤ PHONG TỎA (ĐÓNG)</span>
                )}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono border-l border-zinc-700 pl-2">
              {moonInfo.isAuctionOpen
                ? `Ngày ${currentDay} Tu Tiên`
                : `Mở vào Ngày ${moonInfo.nextOpenGameDay}`}
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. THANH NGUY CƠ BẠI LỘ (BUST RISK GAUGE) */}
        {/* ============================================================ */}
        <div className="mt-3.5 pt-3 border-t border-purple-950/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300 font-serif">
              <AlertTriangle className={`w-3.5 h-3.5 ${bustRisk > 50 ? 'text-rose-500 animate-bounce' : 'text-amber-400'}`} />
              <span className="font-bold">Khí Tức Bại Lộ (Bust Risk):</span>
              <span className="text-[10px] text-zinc-400">
                {bustRisk <= 50 ? '(An toàn tương đối)' : '⚠️ Cực kỳ nguy hiểm! Tiên Quan sắp ập vào!'}
              </span>
            </div>
            <div className="font-mono font-bold">
              <span className={bustRisk > 50 ? 'text-rose-400' : 'text-amber-300'}>
                {bustRisk}% / 100%
              </span>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-black/80 border border-zinc-800 overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r ${getRiskColor(bustRisk)} transition-all duration-500`}
              style={{ width: `${bustRisk}%` }}
            />
            {/* Vạch ngưỡng 50% */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500/60 shadow-[0_0_4px_rgba(239,68,68,0.8)]" />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
            <span>Tiền ký quỹ an toàn: <strong className="text-amber-300 font-mono">{(session.playerEscrowStones || 0).toLocaleString()}</strong> LT</span>
            <span>Ngân khố sẵn sàng: <strong className="text-emerald-400 font-mono">{currentStones.toLocaleString()}</strong> LT</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. NẾU CHƯA ĐẾN NGÀY TRĂNG TRÒN -> HIỂN THỊ PHONG TỎA */}
      {/* ============================================================ */}
      {!moonInfo.isAuctionOpen && (
        <div className="p-8 rounded-xl bg-gradient-to-b from-[#0e0717] to-[#05020a] border border-purple-900/40 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            🌫️
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-serif font-bold text-purple-200">
              Hắc Vụ Trận Pháp Đang Che Phủ U Minh Cấm Địa
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed font-serif">
              Hắc Thị chỉ mở ra vào <strong className="text-amber-300">Đêm Trăng Tròn (Ngày 14, 15, 16)</strong> mỗi chu kỳ thiên văn. Hiện tại cấm địa bị kết giới phong tỏa để tránh tai mắt của Tiên Thiên Chấp Pháp Trận.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 border border-purple-800/40 text-xs font-mono text-amber-300">
            <Timer className="w-4 h-4 text-amber-400" />
            <span>Thời điểm mở cửa kế tiếp: <strong>Ngày {moonInfo.nextOpenGameDay} Tu Tiên</strong> ({moonInfo.nextOpenGameDay - currentDay} ngày nữa)</span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. NẾU ĐANG MỞ CỬA -> THANH CHUYỂN SUB-TAB */}
      {/* ============================================================ */}
      {moonInfo.isAuctionOpen && (
        <>
          <div className="flex rounded-lg bg-[#0e0a1a] p-1 border border-purple-900/40 text-xs gap-1">
            <button
              onClick={() => setActiveSubTab('lots')}
              className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                activeSubTab === 'lots'
                  ? 'bg-purple-700/40 text-purple-200 border border-purple-500/50 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Sàn Đấu Giá ({session.activeLots.filter(l => !l.isSettled).length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('consign')}
              className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                activeSubTab === 'consign'
                  ? 'bg-purple-700/40 text-purple-200 border border-purple-500/50 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ký Gửi Cấm Vật (x2 Lời)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('history')}
              className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif flex items-center justify-center gap-1.5 ${
                activeSubTab === 'history'
                  ? 'bg-purple-700/40 text-purple-200 border border-purple-500/50 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhật Ký Giao Dịch ({session.contrabandHistory?.length || 0})</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: SÀN ĐẤU GIÁ CẤM PHẨM (AUCTION LOTS GRID) */}
          {/* ============================================================ */}
          {activeSubTab === 'lots' && (
            <div className="space-y-3">
              {session.activeLots.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-black/40 border border-zinc-800 text-zinc-500 text-xs">
                  Hiện chưa có lô hàng cấm nào trên sàn.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {session.activeLots.map((lot) => {
                    const isWinning = lot.isPlayerHighestBidder;
                    const nextMinBid = lot.currentBid + lot.minIncrement;

                    return (
                      <div
                        key={lot.id}
                        className={`relative rounded-xl p-3.5 transition-all duration-300 border flex flex-col justify-between ${
                          lot.isSettled
                            ? 'bg-zinc-950/60 border-zinc-800/80 opacity-60'
                            : isWinning
                            ? 'bg-gradient-to-b from-[#180a29] to-[#0c0517] border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                            : 'bg-[#10071c] hover:bg-[#140a24] border-purple-900/40'
                        }`}
                      >
                        {/* Header của thẻ Lot */}
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {getCategoryBadge(lot.category)}
                              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700/60 text-zinc-300 text-[10px] font-mono">
                                Phẩm Cấp {lot.rarityTier} Giai
                              </span>
                              {lot.sellerType === 'player' && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-[10px] font-serif">
                                  📦 CỦA BẠN
                                </span>
                              )}
                            </div>

                            {/* Đồng hồ đếm ngược của Lot */}
                            <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                              <Timer className="w-3 h-3 text-rose-400" />
                              {lot.isSettled ? (
                                <span className="text-zinc-500 font-bold">ĐÃ KẾT TOÁN</span>
                              ) : (
                                <span className={lot.timeLeftSeconds <= 30 ? 'text-rose-400 font-bold animate-pulse' : 'text-amber-300 font-bold'}>
                                  {lot.timeLeftSeconds}s
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Tên vật phẩm & Mô tả */}
                          <div className="space-y-1 my-2">
                            <div className="font-serif font-bold text-sm text-purple-100 flex items-center justify-between">
                              <span>{lot.itemName}</span>
                              {isWinning && !lot.isSettled && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-950 border border-purple-500 text-purple-300 font-mono animate-pulse">
                                  👑 ĐANG DẪN ĐẦU
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-serif line-clamp-2">
                              {lot.description}
                            </p>
                          </div>

                          {/* Thông tin giá hiện tại & người dẫn đầu */}
                          <div className="p-2.5 rounded-lg bg-black/50 border border-purple-950/80 space-y-1.5 my-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-zinc-400">Giá hiện tại trên sàn:</span>
                              <span className="font-mono font-bold text-amber-300 text-sm flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5 text-amber-400" />
                                {lot.currentBid.toLocaleString()} LT
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/60 font-mono">
                              <span>Người đang trả giá cao nhất:</span>
                              <span className={isWinning ? 'text-purple-300 font-bold' : 'text-rose-300'}>
                                {lot.highestBidderName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Nút hành động đấu giá */}
                        {!lot.isSettled ? (
                          <div className="pt-2 border-t border-purple-950 flex gap-2">
                            {/* Nút Nâng Giá Tối Thiểu (+minIncrement) */}
                            <button
                              onClick={() => handlePlaceBid(lot.id, nextMinBid)}
                              disabled={currentStones < (isWinning ? lot.minIncrement : nextMinBid)}
                              className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <Flame className="w-3.5 h-3.5 text-rose-300" />
                              <span>NÂNG GIÁ ({nextMinBid.toLocaleString()} LT)</span>
                            </button>

                            {/* Nút Đặt Giá Tùy Ý */}
                            <button
                              onClick={() => {
                                setSelectedLotForBid(lot);
                                setCustomBidInput(nextMinBid.toString());
                              }}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-purple-700/40 text-purple-300 font-serif text-xs transition cursor-pointer"
                            >
                              Tùy Ý...
                            </button>
                          </div>
                        ) : (
                          <div className="pt-2 text-center text-xs text-zinc-500 font-serif italic">
                            Phiên đấu giá đã hoàn tất
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: KÝ GỬI CẤM VẬT THU LỢI NHUẬN GẤP ĐÔI (CONSIGNMENT) */}
          {/* ============================================================ */}
          {activeSubTab === 'consign' && (
            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-b from-[#120824] to-[#080312] border border-purple-900/50 shadow-xl">
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold text-emerald-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Ký Gửi Cấm Vật Lên Sàn Đấu Giá Hắc Thị
                </h3>
                <p className="text-xs text-zinc-400 font-serif leading-relaxed">
                  Bảo vật đưa lên sàn Hắc Thị sẽ tự động có giá khởi điểm <strong className="text-amber-300">gấp đôi ($\ge \times 2$)</strong> so với giá gốc thị trường. Khi ký gửi, vật phẩm sẽ bị khóa trong trạng thái Ký Quỹ cho đến khi kết toán phiên chợ.
                </p>
              </div>

              {consignableItems.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-black/40 border border-zinc-800 text-zinc-500 text-xs">
                  Không tìm thấy cấm vật hợp lệ hoặc toàn bộ vật phẩm đều đang bị khóa ký quỹ.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-serif text-zinc-300">
                    Chọn vật phẩm muốn ký gửi ({consignableItems.length} món có thể niêm yết):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto custom-scrollbar p-1">
                    {consignableItems.map(item => {
                      const isSelected = selectedItemForConsign?.id === item.id;
                      const baseP = item.basePrice || item.price || 5000;
                      const minListingPrice = baseP * 2;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedItemForConsign(item);
                            setConsignPriceInput(minListingPrice.toString());
                          }}
                          className={`p-2.5 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-purple-950/80 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                              : 'bg-black/50 hover:bg-purple-950/30 border-zinc-800/80'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start text-xs font-serif font-bold text-zinc-200">
                              <span className="truncate">{item.name}</span>
                              <span className="text-[10px] text-zinc-400 font-mono">x{item.quantity || 1}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 line-clamp-1 font-serif mt-1">
                              {item.description || 'Vật phẩm tu tiên cấm kỵ'}
                            </p>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex justify-between items-center text-[10px] font-mono">
                            <span className="text-zinc-500">Gốc: {baseP.toLocaleString()} LT</span>
                            <span className="text-emerald-400 font-bold">Khởi điểm: {minListingPrice.toLocaleString()} LT</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Khung cấu hình giá khởi điểm khi đã chọn item */}
                  {selectedItemForConsign && (
                    <div className="p-3.5 rounded-lg bg-black/60 border border-purple-700/50 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-purple-300 font-serif font-bold">
                          Ký gửi: [{selectedItemForConsign.name}]
                        </span>
                        <span className="text-zinc-400 font-mono text-[10px]">
                          Giá sàn tối thiểu x2: {((selectedItemForConsign.basePrice || selectedItemForConsign.price || 5000) * 2).toLocaleString()} LT
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={consignPriceInput}
                          onChange={(e) => setConsignPriceInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                          placeholder="Nhập giá khởi điểm mong muốn..."
                        />
                        <button
                          onClick={() => {
                            const price = parseInt(consignPriceInput, 10);
                            if (isNaN(price) || price <= 0) {
                              if (showToast) showToast('Mức giá không hợp lệ!');
                              return;
                            }
                            const success = handleConsignItem(selectedItemForConsign, price);
                            if (success) {
                              setSelectedItemForConsign(null);
                              setActiveSubTab('lots');
                            }
                          }}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white font-serif font-bold text-xs transition cursor-pointer shadow"
                        >
                          Xác Nhận Ký Gửi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: NHẬT KÝ GIAO DỊCH (HISTORY) */}
          {/* ============================================================ */}
          {activeSubTab === 'history' && (
            <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-purple-900/40">
              <h3 className="text-xs font-serif font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-400" />
                Lịch Sử Mua Bán & Tịch Thu Cấm Phẩm
              </h3>

              {(!session.contrabandHistory || session.contrabandHistory.length === 0) ? (
                <div className="p-6 text-center text-zinc-500 text-xs font-serif">
                  Chưa có giao dịch nào được ghi nhận tại U Minh Hắc Thị.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar">
                  {session.contrabandHistory.map((rec, i) => (
                    <div
                      key={rec.id || i}
                      className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 flex justify-between items-center text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-zinc-200 flex items-center gap-1.5">
                          <span>{rec.itemName}</span>
                          {rec.type === 'buy' ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-600/40">ĐẤU GIÁ THẮNG</span>
                          ) : rec.type === 'sell' ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40">BÁN THÀNH CÔNG</span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600/40">BỊ TỊCH THU</span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {new Date(rec.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="font-mono font-bold text-amber-300 text-xs">
                        {rec.price.toLocaleString()} LT
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL TRẢ GIÁ TÙY Ý (CUSTOM BID MODAL) */}
      {/* ============================================================ */}
      {selectedLotForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-xl bg-gradient-to-b from-[#160a28] to-[#0a0414] border border-purple-600/60 p-4 shadow-2xl space-y-3.5">
            <div className="flex justify-between items-center border-b border-purple-900/60 pb-2">
              <h3 className="text-xs font-serif font-bold text-purple-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                Trả Giá Cho [{selectedLotForBid.itemName}]
              </h3>
              <button
                onClick={() => setSelectedLotForBid(null)}
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300 font-serif">
              <div className="flex justify-between">
                <span className="text-zinc-400">Giá hiện tại:</span>
                <span className="font-mono font-bold text-amber-300">{selectedLotForBid.currentBid.toLocaleString()} LT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bước giá tối thiểu:</span>
                <span className="font-mono font-bold text-zinc-300">+{selectedLotForBid.minIncrement.toLocaleString()} LT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Giá sàn tối thiểu hợp lệ:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {(selectedLotForBid.currentBid + selectedLotForBid.minIncrement).toLocaleString()} LT
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 font-serif">Mức giá bạn muốn đặt (Linh Thạch):</label>
              <input
                type="number"
                value={customBidInput}
                onChange={(e) => setCustomBidInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black/60 border border-zinc-700 text-amber-300 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedLotForBid(null)}
                className="flex-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-serif transition cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={() => {
                  const amount = parseInt(customBidInput, 10);
                  if (isNaN(amount) || amount <= 0) {
                    if (showToast) showToast('Mức giá không hợp lệ!');
                    return;
                  }
                  const success = handlePlaceBid(selectedLotForBid.id, amount);
                  if (success) setSelectedLotForBid(null);
                }}
                className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-serif font-bold text-xs transition cursor-pointer shadow"
              >
                Xác Nhận Đặt Giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MODAL BIẾN CỐ ĐỘT KÍCH (CHÍNH ĐẠO TRUY QUÉT MODAL) */}
      {/* ============================================================ */}
      {session.raidIncidentActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#24080e] via-[#150408] to-[#0a0004] border-2 border-red-600/80 p-5 shadow-[0_0_50px_rgba(239,68,68,0.5)] space-y-4 animate-shake">
            {/* Header cảnh báo viền đỏ */}
            <div className="text-center space-y-1.5">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                <ShieldAlert className="w-9 h-9 text-red-400 animate-pulse" />
              </div>
              <h2 className="text-base font-serif font-bold text-red-200 tracking-wide uppercase">
                🚨 TIÊN QUAN CHẤP PHÁP ĐỘT KÍCH!
              </h2>
              <p className="text-xs text-zinc-300 font-serif leading-relaxed px-2">
                Tiên Thiên Chấp Pháp Trận phát động rực sáng hư không! Đội Tuần Tra Tiên Quan rầm rộ ập vào phong tỏa U Minh Hắc Thị! Đạo hữu phải đưa ra quyết định sinh tử ngay tức khắc:
              </p>
            </div>

            {/* 3 Lựa chọn tương tác sinh tử */}
            <div className="space-y-2.5 pt-1">
              {/* Lựa chọn 1: Bribe (Đút lót) */}
              <button
                onClick={() => handleResolveRaid('bribe')}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-950/80 to-yellow-950/80 hover:from-amber-900 hover:to-yellow-900 border border-amber-600/50 text-left transition cursor-pointer flex items-center justify-between group shadow"
              >
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-amber-200 group-hover:text-amber-100 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>💸 Nộp Phạt Đút Lót (Bribe)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-serif">
                    Tiêu hao <strong className="text-amber-300 font-mono">30% Linh Thạch</strong> đang có để hối lộ quan chức. An toàn thoát thân, xóa nguy cơ bại lộ.
                  </p>
                </div>
              </button>

              {/* Lựa chọn 2: Flee (Vứt của chạy lấy người) */}
              <button
                onClick={() => handleResolveRaid('flee')}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 hover:bg-zinc-800 border border-zinc-700/60 text-left transition cursor-pointer flex items-center justify-between group shadow"
              >
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-zinc-300 group-hover:text-white flex items-center gap-1.5">
                    <span>🏃 Vứt Bỏ Vật Phẩm Thoát Thân (Flee)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-serif">
                    Tịch thu toàn bộ cấm phẩm và <strong className="text-zinc-200 font-mono">{(session.playerEscrowStones || 0).toLocaleString()} LT</strong> ký quỹ. Mượn cớ hỗn loạn tẩu thoát an toàn, không tăng Ma Tính.
                  </p>
                </div>
              </button>

              {/* Lựa chọn 3: Fight (Huyết chiến) */}
              <button
                onClick={() => handleResolveRaid('fight')}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-rose-950 to-red-950 hover:from-rose-900 hover:to-red-900 border border-red-600 text-left transition cursor-pointer flex items-center justify-between group shadow-[0_0_15px_rgba(225,29,72,0.3)]"
              >
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-xs text-red-200 group-hover:text-red-100 flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span>⚔️ Huyết Chiến Tru Sát Tiên Quan (Fight)</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-serif">
                    Quyết tử phá vây! Thắng: Giữ toàn bộ bảo vật + <strong className="text-purple-400">+30 Ma Tính</strong>! Thua: Trọng thương tổn thất 20% tu vi và tiền của!
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. MODAL THÔNG BÁO KẾT QUẢ ĐỘT KÍCH (RESULT MODAL) */}
      {/* ============================================================ */}
      {raidResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-xl bg-gradient-to-b from-[#1a0820] to-[#0a030f] border border-purple-500/60 p-4 shadow-2xl space-y-3">
            <div className="text-center space-y-1">
              <div className="text-3xl">
                {raidResultModal.success ? '🏆' : '💀'}
              </div>
              <h3 className="text-sm font-serif font-bold text-purple-200">
                {raidResultModal.success ? 'Giải Quyết Biến Cố Thành Công' : 'Biến Cố Thất Bại Thê Thảm'}
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-black/50 border border-purple-900/40 text-xs text-zinc-300 font-serif leading-relaxed">
              {raidResultModal.message}
            </div>

            {/* Chi tiết thay đổi */}
            <div className="space-y-1 text-[11px] font-mono border-t border-zinc-800 pt-2 text-zinc-400">
              {raidResultModal.demonicNatureChange > 0 && (
                <div className="flex justify-between text-purple-400 font-bold">
                  <span>Ma Tính gia tăng:</span>
                  <span>+{raidResultModal.demonicNatureChange} điểm</span>
                </div>
              )}
              {raidResultModal.spiritStonesLost > 0 && (
                <div className="flex justify-between text-rose-400 font-bold">
                  <span>Linh Thạch tổn thất:</span>
                  <span>-{raidResultModal.spiritStonesLost.toLocaleString()} LT</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setRaidResultModal(null)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-serif font-bold text-xs transition cursor-pointer"
            >
              Đã Rõ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
