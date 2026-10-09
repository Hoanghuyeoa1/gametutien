import React from 'react';
import {
  Compass,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Shield,
  Heart,
  Zap,
  Sword,
  Gem,
  Award,
  LogOut,
  Flame,
  HelpCircle,
  Skull,
  Coins
} from 'lucide-react';
import {
  PlayerStats,
  SecretRealmDungeon,
  DungeonRunState,
  DungeonRoomChoice,
  DungeonBuff
} from '@/lib/types';
import { ANCIENT_SECRET_REALMS } from '@/lib/secret-realm-data';
import { FORBIDDEN_ZONE_LIST } from '@/lib/forbidden-zone-data';
import { BlackMarketView } from './BlackMarketView';
import { AncientMapDungeonView } from './AncientMapDungeonView';
import {
  resolveSecretRealmRewardItem,
  applySecretRealmRewardToPlayer,
  SecretRealmRewardResolved,
  ApplyRewardResult
} from '@/lib/game-logic';

export {
  resolveSecretRealmRewardItem,
  applySecretRealmRewardToPlayer
};
export type {
  SecretRealmRewardResolved,
  ApplyRewardResult
};

export interface SecretRealmTabProps {
  player: PlayerStats;
  eventsSubTab: 'dungeons' | 'forbidden_zones' | 'ancient_maps' | 'random_events' | 'black_market';
  setEventsSubTab: (tab: 'dungeons' | 'forbidden_zones' | 'ancient_maps' | 'random_events' | 'black_market') => void;
  activeDungeon?: SecretRealmDungeon | null;
  dungeonFloor?: number;
  isAdvancingFloor?: boolean;
  dungeonLogs?: string[];
  handleEnterDungeon?: (dungeon: SecretRealmDungeon) => void;
  handleExitDungeon?: () => void;
  handleAdvanceDungeonFloor?: () => void;
  handleClaimDungeonTreasure?: () => void;
  handleStartDungeon: (realmId: string) => void;
  handleSelectRoom: (roomIndex: number) => void;
  handleResolveCurrentRoom: (choiceAction?: string) => void;
  handleNextStep: () => void;
  handleRetreatDungeon: () => void;
  handleExploreRandomEvent?: () => void;
  fetchRandomEvent?: () => void;
  onUpdatePlayer?: (player: PlayerStats) => void;
  onStartForbiddenZone?: (zoneId: any) => void;
  onAddLog?: (title: string, content: string, type: any) => void;
  onShowToast?: (msg: string) => void;
}

export const SecretRealmTab: React.FC<SecretRealmTabProps> = ({
  player,
  eventsSubTab,
  setEventsSubTab,
  handleStartDungeon,
  handleSelectRoom,
  handleResolveCurrentRoom,
  handleNextStep,
  handleRetreatDungeon,
  handleExploreRandomEvent,
  fetchRandomEvent,
  onStartForbiddenZone,
  onUpdatePlayer,
  onAddLog,
  onShowToast
}) => {
  const dungeonState: DungeonRunState | null = player.dungeonRunState || null;
  const onExplore = handleExploreRandomEvent || fetchRandomEvent;

  // ========================================================
  // CHẾ ĐỘ 2: TRONG CHUYẾN ĐI ẢI ROGUELITE (DUNGEON ACTIVE)
  // ========================================================
  if (dungeonState && dungeonState.isActive) {
    const curHp = dungeonState.currentHp;
    const maxHp = dungeonState.maxHp || 1;
    const hpPercent = Math.min(100, Math.max(0, Math.floor((curHp / maxHp) * 100)));

    const curMp = dungeonState.currentMp;
    const maxMp = dungeonState.maxMp || 1;
    const mpPercent = Math.min(100, Math.max(0, Math.floor((curMp / maxMp) * 100)));

    const loot = dungeonState.lootBag;
    const currentRoom = dungeonState.currentRoom;

    return (
      <div className="space-y-3 py-1">
        {/* TOP STATUS HUD */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#140f24] via-[#0f111c] to-[#120e20] border border-purple-900/50 shadow-xl space-y-3">
          {/* Header Info & Rút lui an toàn */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🌌</span>
                <span className="font-serif font-bold text-sm text-purple-200">
                  {dungeonState.realmName}
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold">
                  Tầng {dungeonState.currentFloor}/{dungeonState.maxFloors}
                </span>
                <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-black/40 border border-zinc-700 text-zinc-400">
                  Bước {dungeonState.stepInFloor}
                </span>
              </div>
            </div>

            <button
              onClick={handleRetreatDungeon}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-950/70 to-red-950/70 hover:from-rose-900 hover:to-red-900 text-rose-200 border border-rose-600/50 text-xs font-serif font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Rút Lui An Toàn (100% Đồ)</span>
            </button>
          </div>

          {/* Thanh Khí Huyết & Chân Nguyên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {/* HP */}
            <div className="space-y-1 bg-black/40 p-2 rounded-lg border border-red-900/30">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-rose-400 font-serif font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" />
                  Khí Huyết Sinh Mệnh
                </span>
                <span className="text-zinc-300 font-bold">
                  {curHp.toLocaleString()} / {maxHp.toLocaleString()} ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/80 overflow-hidden border border-rose-950">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* MP */}
            <div className="space-y-1 bg-black/40 p-2 rounded-lg border border-sky-900/30">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-sky-400 font-serif font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-sky-400" />
                  Chân Nguyên Linh Lực
                </span>
                <span className="text-zinc-300 font-bold">
                  {curMp.toLocaleString()} / {maxMp.toLocaleString()} ({mpPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/80 overflow-hidden border border-sky-950">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-blue-400 transition-all duration-300"
                  style={{ width: `${mpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dàn Thần Chúc Đang Phù Trợ */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-zinc-400 font-serif">Thần Chúc:</span>
            {dungeonState.activeBuffs.length > 0 ? (
              dungeonState.activeBuffs.map((buff: DungeonBuff) => (
                <span
                  key={buff.id}
                  title={buff.description}
                  className="px-2 py-0.5 rounded text-[10px] bg-amber-950/60 border border-amber-600/50 text-amber-300 font-serif font-bold flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  {buff.name}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-zinc-600 italic">Chưa lĩnh nhận ấn ký thần chúc</span>
            )}
          </div>

          {/* Túi Chiến Lợi Phẩm Tạm Thời */}
          <div className="p-2 rounded-lg bg-black/50 border border-purple-900/30 flex items-center justify-between text-[11px] font-mono flex-wrap gap-2">
            <span className="text-zinc-400 font-serif font-bold flex items-center gap-1 text-purple-300">
              🎁 Túi Tạm:
            </span>
            <div className="flex items-center gap-3 text-zinc-300">
              <span className="text-amber-300">🪙 {loot.linhThach.toLocaleString()} LT</span>
              <span className="text-emerald-400">💎 {loot.gems.length} Ngọc</span>
              <span className="text-cyan-400">⛏️ {loot.materials.reduce((s, m) => s + m.quantity, 0)} Khoáng</span>
              <span className="text-teal-300">🌿 {loot.herbs.reduce((s, h) => s + h.quantity, 0)} Dược</span>
            </div>
          </div>
        </div>

        {/* NỘI DUNG PHÒNG THÁM HIỂM */}
        {!currentRoom ? (
          /* TRƯỜNG HỢP 1: CHỌN NGÃ RẼ TIẾP THEO */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Lựa Chọn Ngã Rẽ Thám Hiểm (Bước {dungeonState.stepInFloor})</span>
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">-10 Chân Nguyên / Bước</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {dungeonState.availableRooms.map((room: DungeonRoomChoice, idx: number) => {
                const dangerColors: Record<string, string> = {
                  safe: 'border-emerald-600/50 bg-emerald-950/20 text-emerald-300',
                  low: 'border-cyan-600/50 bg-cyan-950/20 text-cyan-300',
                  medium: 'border-amber-600/50 bg-amber-950/20 text-amber-300',
                  high: 'border-orange-600/50 bg-orange-950/20 text-orange-300',
                  deadly: 'border-rose-600/60 bg-rose-950/30 text-rose-300 animate-pulse'
                };
                const dangerLabels: Record<string, string> = {
                  safe: 'An Toàn',
                  low: 'Hiểm Nguy Thấp',
                  medium: 'Khí Áp Trung Bình',
                  high: 'Cực Kỳ Nguy Hiểm',
                  deadly: 'Tử Địa Trấn Tầng'
                };

                return (
                  <div
                    key={room.id}
                    className="p-3 rounded-xl bg-[#0d0f18] border border-purple-900/40 hover:border-purple-500/70 transition flex flex-col justify-between space-y-2.5 shadow-md"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-2xl">{room.icon}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${dangerColors[room.dangerLevel]}`}>
                          {dangerLabels[room.dangerLevel]}
                        </span>
                      </div>
                      <div className="font-serif font-bold text-xs text-purple-200">
                        {room.title}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">
                        {room.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectRoom(idx)}
                      className="w-full py-1.5 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                    >
                      <span>Bước Vào Mật Thất →</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP 2: ĐANG TRONG PHÒNG TƯƠNG TÁC */
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#120f20] to-[#0a0a10] border border-purple-800/50 space-y-3.5 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{currentRoom.icon}</span>
                <div>
                  <h3 className="text-sm font-serif font-bold text-purple-200">
                    {currentRoom.title}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Loại mật thất: {currentRoom.roomType.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Mô tả bối cảnh mật thất */}
            <div className="p-3 rounded-lg bg-black/60 border border-purple-900/30 text-xs text-zinc-300 leading-relaxed font-serif">
              {currentRoom.description}
            </div>

            {/* Khung Tương Tác Hành Động (Chưa Giải Quyết) */}
            {!dungeonState.roomEventResolved ? (
              <div className="space-y-2 pt-1">
                {(currentRoom.roomType === 'battle' || currentRoom.roomType === 'elite' || currentRoom.roomType === 'boss') && (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-300 font-serif">
                      Yêu thú đang gầm rống chuẩn bị tập kích! Hãy chuẩn bị nghênh chiến.
                    </p>
                    <button
                      onClick={() => handleResolveCurrentRoom()}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-rose-700 via-red-600 to-amber-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sword className="w-4 h-4 text-rose-200" />
                      <span>
                        {currentRoom.roomType === 'boss'
                          ? '👑 QUYẾT CHIẾN THỦ VỆ TRẤN TẦNG'
                          : '⚔️ XUẤT CHIÊU QUYẾT ĐẤU'}
                      </span>
                    </button>
                  </div>
                )}

                {currentRoom.roomType === 'treasure' && (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-300 font-serif">
                      Tìm thấy một chiếc rương cổ nằm im lìm giữa mật thất. Hãy mở ra khám phá!
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleResolveCurrentRoom('silver')}
                        className="py-2 px-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-serif font-bold border border-zinc-600 transition cursor-pointer"
                      >
                        📦 Cổ Mộc Hòm
                      </button>
                      <button
                        onClick={() => handleResolveCurrentRoom('gold')}
                        className="py-2 px-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 text-xs font-serif font-bold border border-amber-600 transition cursor-pointer"
                      >
                        🎁 Hoàng Kim Hòm
                      </button>
                      <button
                        onClick={() => handleResolveCurrentRoom('celestial')}
                        className="py-2 px-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 text-xs font-serif font-bold border border-rose-600 transition cursor-pointer"
                      >
                        ✨ Thái Hư Thần Hòm
                      </button>
                    </div>
                  </div>
                )}

                {currentRoom.roomType === 'altar' && (
                  <div className="space-y-2">
                    <p className="text-xs text-cyan-300 font-serif">
                      Tế đàn yêu cầu hiến tế một lượng nhỏ Khí Huyết (-10% HP) để thỉnh cầu Thần Chúc thượng cổ.
                    </p>
                    <button
                      onClick={() => handleResolveCurrentRoom()}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-700 to-teal-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>📜 THÀNH TÂM HIẾN TẾ THỈNH CHÚC (-10% HP)</span>
                    </button>
                  </div>
                )}

                {currentRoom.roomType === 'trap' && (
                  <div className="space-y-2">
                    <p className="text-xs text-rose-300 font-serif">
                      Pháp trận sát phạt đã bị kích hoạt! Cần thử thách định lực và thân pháp để vượt qua.
                    </p>
                    <button
                      onClick={() => handleResolveCurrentRoom()}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-800 to-amber-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-orange-200" />
                      <span>🛡️ VẬN CHUYỂN CHÂN KHÍ HÓA GIẢI CỔ TRẬN</span>
                    </button>
                  </div>
                )}

                {currentRoom.roomType === 'rest' && (
                  <div className="space-y-2">
                    <p className="text-xs text-emerald-300 font-serif">
                      Nước suối linh tuyền tinh thuần bồi bổ khí huyết, an định chân nguyên.
                    </p>
                    <button
                      onClick={() => handleResolveCurrentRoom()}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-700 to-teal-600 hover:brightness-110 text-white font-serif font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-emerald-200" />
                      <span>🏕️ NHẬP ĐỊNH ĐIỀU TỨC (+35% HP, +40% MP)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* KHUNG KẾT QUẢ VÀ NÚT TIẾN LÊN */
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 leading-relaxed font-serif shadow-inner">
                  {dungeonState.eventNarrative || 'Đã giải quyết mật thất thành công!'}
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-700 hover:brightness-110 text-white font-serif font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {currentRoom.roomType === 'boss'
                      ? dungeonState.currentFloor >= dungeonState.maxFloors
                        ? '🏆 HOÀN TẤT BÍ CẢNH (ĐOẠT ĐẠI CƠ DUYÊN)'
                        : `🌟 MỞ THẠCH MÔN LÊN TẦNG ${dungeonState.currentFloor + 1} →`
                      : 'Tiến Lên Phòng Kế Tiếp →'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // CHẾ ĐỘ 1: TIÊN PHỦ BÍ CẢNH (CHƯA BƯỚC VÀO DUNGEON)
  // ========================================================
  return (
    <div className="space-y-3 py-1">
      {/* Sub-tabs Bí Cảnh, Thái Cổ Cấm Địa & Kỳ Duyên */}
      <div className="flex rounded-lg bg-[#0e0e15] p-1 border border-purple-900/30 text-xs gap-1">
        <button
          onClick={() => setEventsSubTab('dungeons')}
          className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif ${
            eventsSubTab === 'dungeons' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          🏰 Bí Cảnh Đa Tầng
        </button>
        <button
          onClick={() => setEventsSubTab('forbidden_zones')}
          className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif relative flex items-center justify-center gap-1.5 ${
            eventsSubTab === 'forbidden_zones'
              ? 'bg-gradient-to-r from-amber-950/80 via-yellow-950/80 to-amber-950/80 text-amber-300 border border-amber-500/50 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-amber-200'
          }`}
        >
          <span>🌌 Thái Cổ Cấm Địa</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
            Sa Bàn
          </span>
        </button>
        <button
          onClick={() => setEventsSubTab('ancient_maps')}
          className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif relative flex items-center justify-center gap-1.5 ${
            eventsSubTab === 'ancient_maps'
              ? 'bg-gradient-to-r from-amber-950/90 via-yellow-950/90 to-amber-950/90 text-yellow-300 border border-amber-500/50 font-bold shadow-sm ring-1 ring-amber-500/30'
              : 'text-zinc-400 hover:text-amber-200'
          }`}
        >
          <span>🗺️ Tàng Bảo Các</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
            Bí Cảnh
          </span>
        </button>
        <button
          onClick={() => setEventsSubTab('random_events')}
          className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif ${
            eventsSubTab === 'random_events' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ✨ Kỳ Duyên Bế Quan
        </button>
        <button
          onClick={() => setEventsSubTab('black_market')}
          className={`flex-1 py-1.5 rounded text-center cursor-pointer transition font-serif relative flex items-center justify-center gap-1.5 ${
            eventsSubTab === 'black_market'
              ? 'bg-gradient-to-r from-purple-950/90 via-rose-950/90 to-purple-950/90 text-rose-300 border border-rose-500/50 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-rose-200'
          }`}
        >
          <span>💀 U Minh Hắc Thị</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
            x2
          </span>
        </button>
      </div>

      {/* HIỂN THỊ PHÂN KHU HẮC THỊ HOẶC CÁC PHÂN KHU KHÁC */}
      {eventsSubTab === 'black_market' ? (
        <BlackMarketView
          player={player}
          setPlayer={onUpdatePlayer as any}
        />
      ) : eventsSubTab === 'ancient_maps' ? (
        <AncientMapDungeonView
          player={player}
          setPlayer={onUpdatePlayer as any}
          addLog={onAddLog || ((_t, _c, _type) => {})}
          showToast={onShowToast || ((_m) => {})}
        />
      ) : eventsSubTab === 'dungeons' ? (
        <div className="space-y-2.5">
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-950/40 via-[#101018] to-purple-950/30 border border-purple-800/40 text-[11px] text-zinc-400 space-y-1">
            <div className="font-serif font-bold text-xs text-purple-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Quy Tắc Thám Hiểm Cổ Bí Cảnh Roguelite:</span>
            </div>
            <p className="text-[10px] text-zinc-400 pl-5">
              • Tiêu hao Chân Nguyên mở ra thông đạo. Từng tầng là một mạng lưới mật thất phân nhánh ngẫu nhiên.<br/>
              • Mọi chiến lợi phẩm được lưu trữ trong Túi Tạm. Bất cứ lúc nào cũng có thể <span className="text-emerald-300 font-semibold">Rút Lui An Toàn</span> để đem 100% đồ về.<br/>
              • Nếu vong mạng (HP = 0), nhân vật trọng thương và tổn thất 50% tài nguyên thu thập được trong chuyến đi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {ANCIENT_SECRET_REALMS.map(dungeon => {
              const isEligible = player.currentRealm >= dungeon.minRealm;
              const currentMp = player.linhLuc ?? 100;
              const hasEnoughMp = currentMp >= dungeon.mpCost;
              const canEnter = isEligible && hasEnoughMp;

              return (
                <div
                  key={dungeon.id}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between space-y-2 shadow-md ${
                    canEnter
                      ? 'bg-gradient-to-b from-[#120d1c] to-[#0a0a10] border-purple-800/40 hover:border-purple-500/60'
                      : 'bg-black/40 border-zinc-800/60 opacity-70'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <div className="font-serif font-bold text-xs text-purple-200 flex items-center gap-1.5">
                        <span>🌌</span>
                        <span>{dungeon.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-purple-950/80 border border-purple-600/50 text-purple-300 font-bold shrink-0">
                        {dungeon.totalFloors} Tầng
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {dungeon.description}
                    </p>

                    <div className="text-[9px] font-mono space-y-0.5 bg-black/40 p-2 rounded border border-zinc-800/60">
                      <div className="flex justify-between text-zinc-400">
                        <span>Yêu cầu cảnh giới:</span>
                        <span className={isEligible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {dungeon.realmName}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Tiêu hao nhập cảnh:</span>
                        <span className={hasEnoughMp ? 'text-sky-300 font-bold' : 'text-rose-400 font-bold'}>
                          {dungeon.mpCost} Chân Nguyên
                        </span>
                      </div>
                      <div className="text-zinc-500 truncate pt-0.5">
                        Bảo vật: <span className="text-amber-300/90">{dungeon.rewardsPreview}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartDungeon(dungeon.id)}
                    disabled={!canEnter}
                    className={`w-full py-1.5 rounded-lg font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      canEnter
                        ? 'bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <span>⚔️ KHAI MỞ BÍ CẢNH ({dungeon.mpCost} MP)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : eventsSubTab === 'forbidden_zones' ? (
        /* DANH SÁCH 5 ĐẠI SINH TỬ CẤM KHU (THÁI CỔ CẤM ĐỊA) */
        <div className="space-y-2.5">
          <div className="p-3 rounded-lg bg-gradient-to-r from-amber-950/40 via-[#141010] to-purple-950/40 border border-amber-600/40 text-[11px] text-zinc-400 space-y-1">
            <div className="font-serif font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <span>🌌</span>
              <span>Thái Cổ Cấm Địa • Sa Bàn Sương Mù Sinh Tử:</span>
            </div>
            <p className="text-[10px] text-zinc-300 pl-5 leading-relaxed">
              • Bản đồ sa bàn lưới tự do 6x6 hoặc 7x7 bị bao phủ bởi sương độc cấm khu. Tầm nhìn mở rộng theo <b className="text-amber-300">Thần Thức</b>.<br/>
              • Mỗi bước chân tiêu hao <b className="text-cyan-300">Hộ Thân Linh Quang</b>. Cạn kiệt linh quang sẽ kích hoạt <b className="text-rose-400">Khí Tức Ăn Mòn (-10% HP/bước)</b>.<br/>
              • Phải tự thân dò tìm <b className="text-emerald-400">Truyền Tống Cổ Trận</b> để rút lui an toàn mang 100% chiến lợi phẩm về túi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {FORBIDDEN_ZONE_LIST.map((zone: any) => {
              const isEligible = (player.currentRealm || 0) >= zone.minRealmId;
              const currentMp = player.linhLuc ?? 100;
              const hasEnoughMp = currentMp >= zone.mpCost;
              const canEnter = isEligible && hasEnoughMp;

              return (
                <div
                  key={zone.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition shadow-lg ${
                    canEnter
                      ? `bg-gradient-to-b ${zone.bgGradient} ${zone.borderTheme} hover:scale-[1.01]`
                      : 'bg-black/50 border-zinc-800/80 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <div className="font-serif font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 flex items-center gap-1.5">
                          <span>🌌</span>
                          <span>{zone.name}</span>
                        </div>
                        <span className="text-[10px] text-purple-300/90 font-serif font-semibold">
                          {zone.title}
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold shrink-0">
                        Sa Bàn {zone.gridSize}x{zone.gridSize}
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-300 leading-relaxed italic line-clamp-2">
                      "{zone.description}"
                    </p>

                    <div className="p-2 rounded bg-black/60 border border-slate-800 text-[10px] space-y-1">
                      <div className="text-amber-300 font-semibold">
                        ⚠️ {zone.environmentalEffectName}: <span className="text-zinc-300 font-normal">{zone.environmentalEffectDesc}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400 pt-0.5 border-t border-slate-800">
                        <span>Yêu cầu cảnh giới:</span>
                        <span className={isEligible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {zone.minRealmName}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Chân nguyên tiêu hao:</span>
                        <span className={hasEnoughMp ? 'text-sky-300 font-bold' : 'text-rose-400 font-bold'}>
                          {zone.mpCost.toLocaleString()} MP
                        </span>
                      </div>
                      <div className="text-zinc-400 pt-0.5 border-slate-800 truncate">
                        Kỳ bảo: <span className="text-yellow-300 font-medium">{zone.specialDrops.map((d: any) => d.name).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartForbiddenZone?.(zone.id)}
                    disabled={!canEnter}
                    className={`w-full py-2 rounded-lg font-serif font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                      canEnter
                        ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <span>🌌 BƯỚC VÀO CẤM ĐỊA ({zone.mpCost.toLocaleString()} MP)</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TAB KỲ DUYÊN BẾ QUAN */
        <div className="p-6 rounded-xl bg-black/40 border border-purple-900/30 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            ✨
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="font-serif font-bold text-sm text-purple-200">
              Cơ Duyên Thổ Nạp Thiên Địa
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dạo bước ngắm mây trời hoặc đốn ngộ tại tiên phủ, ngẫu nhiên kích hoạt kỳ ngộ, gặp gỡ tiền bối hoặc trộm nhặt linh bảo.
            </p>
          </div>
          {onExplore && (
            <button
              onClick={onExplore}
              className="py-2 px-5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-serif font-bold text-xs transition cursor-pointer shadow"
            >
              Tầm Bảo Kỳ Duyên Ngay →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
