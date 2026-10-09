// components/modals/ForbiddenZoneModal.tsx
// Giao diện Sa Bàn Sương Mù & Thám Hiểm Thái Cổ Cấm Địa Thời Gian Thực

import React, { useRef, useEffect } from 'react';
import { PlayerStats } from '@/lib/types';
import {
  ForbiddenZoneState,
  ForbiddenZoneCell,
} from '@/lib/types/forbidden-zone';
import { getForbiddenZoneById } from '@/lib/forbidden-zone-data';
import { canMoveToCell } from '@/lib/forbidden-zone-logic';

export interface ForbiddenZoneModalProps {
  isOpen: boolean;
  player: PlayerStats;
  zoneState: ForbiddenZoneState | null;
  currentHp: number;
  maxHp: number;
  onMove: (targetX: number, targetY: number) => void;
  onInteract: (actionChoice?: 'use_formation' | 'brute_force' | 'use_talisman' | 'soul_suppress') => void;
  onConsumePill: () => void;
  onEscape: () => void;
  onRetreatEmergency: () => void;
  onClose: () => void;
}

export const ForbiddenZoneModal: React.FC<ForbiddenZoneModalProps> = ({
  isOpen,
  player,
  zoneState,
  currentHp,
  maxHp,
  onMove,
  onInteract,
  onConsumePill,
  onEscape,
  onRetreatEmergency,
  onClose,
}) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [zoneState?.logs]);

  if (!isOpen || !zoneState) return null;

  const config = getForbiddenZoneById(zoneState.zoneId);
  if (!config) return null;

  const { playerPos, cells, auraPower, maxAuraPower, lootBag, logs, gridSize } = zoneState;
  const currentCell = cells[playerPos.y]?.[playerPos.x];

  const auraPercent = Math.max(0, Math.min(100, (auraPower / (maxAuraPower || 100)) * 100));
  const hpPercent = Math.max(0, Math.min(100, (currentHp / (maxHp || 1)) * 100));
  const isAuraDepleted = auraPower <= 0;

  // Kiểm tra vật phẩm hỗ trợ
  const hasEquippedFormation = Boolean(player.equippedFormation);
  const talismans = player.inventory?.talismans || [];
  const hasTranMaPhu = talismans.some(
    (t: any) => t.recipeId === 'recipe_tran_ma_phu' || t.id?.includes('tran_ma') || t.type === 'combat'
  );
  const hasPillInBag = (player.inventory?.pills || []).some((p: any) => p.quantity > 0);

  // Icon hiển thị theo loại ô
  const renderCellIcon = (cell: ForbiddenZoneCell, isCurrent: boolean) => {
    if (isCurrent) return <span className="text-2xl animate-bounce drop-shadow">🧙‍♂️</span>;
    if (!cell.isRevealed) return <span className="text-slate-600 text-sm">🌫️</span>;

    switch (cell.type) {
      case 'exit_portal':
        return <span className="text-xl animate-spin duration-1000">🌀</span>;
      case 'boss':
        return <span className="text-xl animate-pulse">👑</span>;
      case 'elite':
        return <span className="text-xl">👹</span>;
      case 'monster':
        return <span className="text-lg">⚔️</span>;
      case 'treasure':
        return <span className="text-xl">🎁</span>;
      case 'array_trap':
        return <span className="text-xl">⚡</span>;
      case 'wraith':
        return <span className="text-xl">👻</span>;
      case 'spring':
        return <span className="text-xl">⛲</span>;
      default:
        return cell.isVisited ? (
          <span className="text-xs text-amber-500/60 font-mono">·</span>
        ) : (
          <span className="text-xs text-slate-500">🪨</span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md select-none overflow-hidden">
      <div
        className={`relative w-full max-w-6xl max-h-[96vh] flex flex-col bg-gradient-to-b ${config.bgGradient} border-2 ${config.borderTheme} rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* ── 1. HEADER: TÊN CẤM KHU & THÔNG TIN ───────── */}
        <div className="relative px-5 py-3.5 bg-slate-950/80 border-b border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌌</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 uppercase tracking-wide">
                  {config.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 font-semibold">
                  {config.title}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>Cảnh giới: <b className="text-emerald-400">{config.minRealmName}</b></span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">
                  {config.environmentalEffectName}
                </span>
              </div>
            </div>
          </div>

          {/* VỊ TRÍ & BƯỚC ĐI */}
          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-1.5 rounded-xl border border-slate-700 text-xs">
            <div>
              <div className="text-slate-400">Tọa Độ</div>
              <div className="font-bold text-amber-400">
                [{playerPos.x}, {playerPos.y}]
              </div>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <div className="text-slate-400">Bước Đi</div>
              <div className="font-bold text-cyan-400">{zoneState.stepCount}</div>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <div className="text-slate-400">Lưới Sa Bàn</div>
              <div className="font-bold text-purple-400">{gridSize}x{gridSize}</div>
            </div>
          </div>
        </div>

        {/* ── 2. THANH SINH TỒN: LINH QUANG HỘ THỂ & KHÍ HUYẾT ───────── */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Cột Linh Quang Hộ Thể */}
          <div>
            <div className="flex justify-between items-center font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <span className={isAuraDepleted ? 'text-rose-400 animate-pulse font-bold' : 'text-cyan-300'}>
                  🛡️ Hộ Thân Linh Quang
                </span>
                {isAuraDepleted && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-rose-950 text-rose-300 border border-rose-600 rounded animate-ping">
                    ĂN MÒN (-10% HP/bước!)
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className={isAuraDepleted ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
                  {auraPower} / {maxAuraPower}
                </span>
                <button
                  type="button"
                  onClick={onConsumePill}
                  disabled={!hasPillInBag}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                    hasPillInBag
                      ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-sm'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  title="Cắn 1 viên đan dược hồi +35 Linh Quang Hộ Thể"
                >
                  💊 Nuốt Đan (+35)
                </button>
              </div>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isAuraDepleted
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400'
                }`}
                style={{ width: `${auraPercent}%` }}
              />
            </div>
          </div>

          {/* Cột HP thời gian thực */}
          <div>
            <div className="flex justify-between font-semibold mb-1 text-red-300">
              <span>🩸 Khí Huyết Đạo Thể (HP)</span>
              <span>
                {currentHp.toLocaleString()} / {maxHp.toLocaleString()} ({Math.round(hpPercent)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-red-950 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── 3. KHU VỰC THI CÔNG CHÍNH: SA BÀN (TRÁI) & TƯƠNG TÁC + LOG (PHẢI) ── */}
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto">
          {/* CỘT TRÁI: SA BÀN LƯỚI MA TRẬN SƯƠNG MÙ (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div
              className={`grid gap-1.5 p-2 bg-slate-900/90 rounded-xl border border-amber-500/20 shadow-inner`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
            >
              {cells.map((row, y) =>
                row.map((cell, x) => {
                  const isCurrent = playerPos.x === x && playerPos.y === y;
                  const canMove = canMoveToCell(playerPos, { x, y });

                  return (
                    <button
                      key={`${x}-${y}`}
                      type="button"
                      disabled={!canMove && !isCurrent}
                      onClick={() => onMove(x, y)}
                      className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-150 border ${
                        isCurrent
                          ? 'bg-amber-500/25 border-amber-400 ring-2 ring-amber-300/80 shadow-[0_0_15px_rgba(251,191,36,0.6)] z-10 scale-105'
                          : cell.isVisited
                          ? 'bg-slate-800/80 border-slate-700/80 hover:border-amber-400/80 hover:bg-slate-700'
                          : cell.isRevealed
                          ? 'bg-slate-900/90 border-slate-700 hover:border-amber-400 hover:bg-slate-800'
                          : canMove
                          ? 'bg-slate-950/90 border-dashed border-amber-500/40 hover:border-amber-400 hover:bg-slate-900'
                          : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
                      } ${canMove ? 'cursor-pointer hover:scale-105 shadow-sm' : ''}`}
                      title={cell.isRevealed ? `${cell.name || cell.type} [${x},${y}]` : `Sương mù [${x},${y}]`}
                    >
                      {renderCellIcon(cell, isCurrent)}

                      {/* Tọa độ nhỏ x-y ở góc ô */}
                      <span className="absolute bottom-0.5 right-1 text-[8px] text-slate-500 font-mono">
                        {x},{y}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1">🧙‍♂️ Vị trí</span>
              <span className="flex items-center gap-1">🌀 Cổng Thoát</span>
              <span className="flex items-center gap-1">👑 Boss</span>
              <span className="flex items-center gap-1">🎁 Rương</span>
              <span className="flex items-center gap-1">⚡ Cấm Chế</span>
              <span className="flex items-center gap-1">👻 Oán Hồn</span>
              <span className="flex items-center gap-1">⛲ Linh Tuyền</span>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG TƯƠNG TÁC Ô + TÚI LOOT + LIVE LOG (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* 1. HỘP TƯƠNG TÁC Ô HIỆN TẠI */}
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <span>Sự Kiện Vị Trí:</span>
                    <span className="text-slate-200">【{currentCell?.name}】</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentCell?.isResolved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        : 'bg-amber-950 text-amber-300 border border-amber-600 animate-pulse'
                    }`}
                  >
                    {currentCell?.isResolved ? 'Đã Giải Quyết' : 'Đang Án Ngữ'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">
                  "{currentCell?.description}"
                </p>
              </div>

              {/* CÁC NÚT TƯƠNG TÁC THEO LOẠI Ô */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-2">
                {!currentCell?.isResolved && (
                  <>
                    {/* Ô Cấm Chế Trận (Array Trap) */}
                    {currentCell?.type === 'array_trap' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => onInteract('use_formation')}
                          disabled={!hasEquippedFormation}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between ${
                            hasEquippedFormation
                              ? 'bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/50 cursor-pointer'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                          }`}
                        >
                          <span>🌀 Vận Trận Bàn Phá Giải</span>
                          <span className="text-[10px] font-normal text-cyan-300">
                            {hasEquippedFormation ? 'An Toàn 100%' : 'Thiếu Trận Bàn'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onInteract('brute_force')}
                          className="py-2 px-3 rounded-lg text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/50 cursor-pointer"
                        >
                          💥 Vũ Lực (-20% HP)
                        </button>
                      </div>
                    )}

                    {/* Ô Oán Hồn (Wraith) */}
                    {currentCell?.type === 'wraith' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => onInteract('use_talisman')}
                          disabled={!hasTranMaPhu}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between ${
                            hasTranMaPhu
                              ? 'bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-500/50 cursor-pointer'
                              : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                          }`}
                        >
                          <span>📜 Dùng Trấn Ma Phù</span>
                          <span className="text-[10px] font-normal text-purple-300">
                            {hasTranMaPhu ? 'Tịnh Hóa Đoạt Bảo' : 'Thiếu Phù Lục'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onInteract('soul_suppress')}
                          className="py-2 px-3 rounded-lg text-xs font-bold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-600/50 cursor-pointer"
                        >
                          👁️ Thần Niệm Trấn Áp
                        </button>
                      </div>
                    )}

                    {/* Ô Rương Báu */}
                    {currentCell?.type === 'treasure' && (
                      <button
                        type="button"
                        onClick={() => onInteract()}
                        className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-pointer"
                      >
                        🎁 Mở Khóa Cổ Tu Di Trạch (Đoạt Bảo)
                      </button>
                    )}

                    {/* Ô Linh Tuyền */}
                    {currentCell?.type === 'spring' && (
                      <button
                        type="button"
                        onClick={() => onInteract()}
                        className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.5)] cursor-pointer"
                      >
                        ⛲ Ngâm Mình Linh Tuyền (+45 Linh Quang, +35% HP)
                      </button>
                    )}

                    {/* Ô Quái / Boss */}
                    {(currentCell?.type === 'monster' ||
                      currentCell?.type === 'elite' ||
                      currentCell?.type === 'boss') && (
                      <button
                        type="button"
                        onClick={() => onInteract()}
                        className="w-full py-2.5 px-4 rounded-lg text-xs font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer animate-pulse"
                      >
                        ⚔️ Xuất Kích Trảm Sát 【{currentCell?.name}】
                      </button>
                    )}
                  </>
                )}

                {/* Ô Cổng Thoát (Lối Ra) */}
                {currentCell?.type === 'exit_portal' && (
                  <button
                    type="button"
                    onClick={onEscape}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.6)] cursor-pointer animate-bounce"
                  >
                    🌀 KÍCH HOẠT CỔ TRẬN: RÚT LUI AN TOÀN (100% CHIẾN LỢI PHẨM)
                  </button>
                )}

                {currentCell?.isResolved && currentCell.type !== 'exit_portal' && (
                  <div className="text-center text-xs text-emerald-400 font-semibold py-1">
                    ✨ Khu vực này đã an toàn. Hãy bước tiếp sang ô lân cận!
                  </div>
                )}
              </div>
            </div>

            {/* 2. TÚI CHIẾN LỢI PHẨM CẤM KHU (LOOT BAG) */}
            <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🎒 Túi Khám Phá:</span>
                  <span className="text-yellow-400">
                    +{lootBag.linhThach.toLocaleString()} Linh Thạch
                  </span>
                </span>
                <span className="text-slate-400 text-[11px]">
                  {lootBag.items.length} bảo vật
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {lootBag.items.length === 0 ? (
                  <span className="text-slate-500 italic text-[11px]">Chưa nhặt được bảo vật...</span>
                ) : (
                  lootBag.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] text-amber-200"
                    >
                      {item.quantity}x {item.name} ({item.grade || 'Cực Phẩm'})
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 3. BẢNG LIVE ADVENTURE LOG */}
            <div
              ref={logRef}
              className="flex-1 min-h-[140px] max-h-[190px] p-3 bg-slate-950/95 rounded-xl border border-slate-800 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1"
            >
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes('THOÁT') || log.includes('AN TOÀN') || log.includes('Khai mở')
                      ? 'text-emerald-300 font-semibold'
                      : log.includes('ĂN MÒN') || log.includes('TỬ TRẬN') || log.includes('sát thương')
                      ? 'text-rose-400'
                      : log.includes('Trảm sát')
                      ? 'text-amber-300 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. FOOTER: RÚT LUI KHẨN CẤP / THOÁT ───────── */}
        <div className="px-5 py-2.5 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 italic text-[11px]">
            💡 Mẹo: Dùng Trận Bàn Bản Mệnh và Trấn Ma Phù để hóa giải bẫy cấm khu an toàn 100%!
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRetreatEmergency}
              className="px-4 py-1.5 rounded-lg font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/50 transition-all cursor-pointer"
            >
              🏃 Rút Lui Khẩn Cấp (Mất 50% Loot)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
