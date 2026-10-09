// components/modals/MeditationJournalModal.tsx
// Modal Cổ Phong: Nhật Ký Kỳ Ngộ Thu Hoạch Nhập Định (Timeline Event Journal)

'use client';

import React from 'react';
import {
  X,
  Sparkles,
  Hourglass,
  Shield,
  Zap,
  Award,
  AlertTriangle,
  Gift,
  Clock,
  Droplets,
  BookOpen,
  CheckCircle2,
  Gem
} from 'lucide-react';
import {
  MeditationProgressResult,
  MeditationEventLog
} from '@/lib/types/meditation';

export interface MeditationJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: MeditationProgressResult | null;
  progressResult?: MeditationProgressResult | null;
  locationName?: string;
  stanceName?: string;
}

export function MeditationJournalModal({
  isOpen,
  onClose,
  result: propResult,
  progressResult,
  locationName,
  stanceName
}: MeditationJournalModalProps) {
  const result = progressResult ?? propResult ?? null;
  if (!isOpen || !result) return null;

  const isInterrupted = Boolean(result.interruptedAtHour);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d0f17] border-2 border-amber-600/60 rounded-2xl shadow-[0_0_50px_rgba(217,119,6,0.3)] text-zinc-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* ================================================================= */}
        {/* HEADER: SỚ TU TIÊN KỲ NGỘ SƠN HÀ                                  */}
        {/* ================================================================= */}
        <div className="relative px-6 py-4 border-b border-amber-900/40 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-amber-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] text-xl">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                  Nhật Ký Kỳ Ngộ Nhập Định
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                  Sơn Hà Ký
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-serif">
                Thời gian trôi qua nơi cõi thế, đạo hữu đốn ngộ xuất quan, gặt hái cơ duyên!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* NỘI DUNG CHÍNH (BODY)                                              */}
        {/* ================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* CẢNH BÁO GIÁN ĐOẠN (NẾU CÓ) */}
          {isInterrupted && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-600/70 text-red-200 text-xs font-serif flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <span className="font-bold text-red-300">Biến Cố Hung Hiểm: </span>
                <span>{result.interruptionReason || 'Kinh mạch khí huyết nghịch chuyển buộc phải ngừng nhập định sớm!'}</span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">
                  Toàn bộ thành quả từ các giờ trước đó đã được bảo toàn nguyên vẹn.
                </span>
              </div>
            </div>
          )}

          {/* BẢNG TỔNG KẾT THÀNH QUẢ NHẬP ĐỊNH */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-black/60 border border-amber-900/40 text-center space-y-1">
              <span className="text-[10.5px] text-zinc-400 font-serif block">Thời Gian Tĩnh Tọa</span>
              <span className="text-sm sm:text-base font-mono font-bold text-amber-300">
                {result.effectiveHours}h
                {result.totalHoursElapsed > result.effectiveHours && (
                  <span className="text-[10px] text-zinc-500 font-normal ml-1">
                    /{result.totalHoursElapsed}h
                  </span>
                )}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-emerald-900/40 text-center space-y-1">
              <span className="text-[10.5px] text-zinc-400 font-serif block">Tu Vi Thu Hoạch</span>
              <span className="text-sm sm:text-base font-mono font-bold text-emerald-400">
                +{result.totalTuviGained.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-yellow-900/40 text-center space-y-1">
              <span className="text-[10.5px] text-zinc-400 font-serif block">Linh Thạch Thu Được</span>
              <span className="text-sm sm:text-base font-mono font-bold text-yellow-400">
                +{result.totalStonesGained.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-purple-900/40 text-center space-y-1">
              <span className="text-[10.5px] text-zinc-400 font-serif block">
                {result.demonicCleanseTotal > 0 ? 'Tẩy Trừ Ma Tính' : result.skillExpPerManual > 0 ? 'EXP Kỹ Năng' : 'Vật Phẩm Dị Bảo'}
              </span>
              <span className="text-sm sm:text-base font-mono font-bold text-purple-300">
                {result.demonicCleanseTotal > 0
                  ? `-${result.demonicCleanseTotal} Điểm`
                  : result.skillExpPerManual > 0
                    ? `+${result.skillExpPerManual.toLocaleString()}`
                    : `${result.itemsLooted.reduce((acc, i) => acc + i.amount, 0)} Món`}
              </span>
            </div>
          </div>

          {/* BUFF ĐỘT PHÁ TÂM CẢNH (NẾU CÓ) */}
          {result.appliedBreakthroughBuff && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-serif font-bold text-cyan-200">
                  Nhận Buff [Tâm Cảnh Thanh Lãng]: +15% Tỷ Lệ Đột Phá Cảnh Giới
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 uppercase">
                Hiệu Lực 12H
              </span>
            </div>
          )}

          {/* THU HOẠCH CỦA ĐẠO LỮ & LINH THÚ HỘ PHÁP */}
          {(result.guardianGrowth?.companion || result.guardianGrowth?.beast) && (
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#15121e] to-rose-950/40 border border-amber-500/50 space-y-2 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Thu Hoạch Của Đạo Lữ & Linh Thú Hộ Pháp
                </h3>
                {result.elementalResonanceBonus ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    ⚡ Cộng Hưởng: +15% Tu Vi & Dị Bảo
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {result.guardianGrowth.companion && (
                  <div className="p-2.5 rounded-lg bg-black/60 border border-rose-800/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-serif">
                      <span className="font-bold text-rose-300 flex items-center gap-1">
                        🌸 {result.guardianGrowth.companion.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-rose-950/80 border border-rose-700/50 text-rose-300">
                        Đạo Lữ Đồng Hành
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono pt-1 text-zinc-300">
                      <div>
                        Hảo Cảm: <span className="text-rose-400 font-bold">+{result.guardianGrowth.companion.affectionGained}</span>
                      </div>
                      <div>
                        Tu Vi: <span className="text-emerald-400 font-bold">+{result.guardianGrowth.companion.tuviGained.toLocaleString()}</span>
                      </div>
                      <div>
                        Hồi Khí: <span className="text-cyan-400 font-bold">-{result.guardianGrowth.companion.fatigueReducedMinutes}p</span>
                      </div>
                      <div>
                        Đạo Tâm: {result.guardianGrowth.companion.epiphanyTriggered ? (
                          <span className="text-amber-400 font-bold">✨ Đốn Ngộ!</span>
                        ) : (
                          <span className="text-zinc-500">Thanh tịnh</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {result.guardianGrowth.beast && (
                  <div className="p-2.5 rounded-lg bg-black/60 border border-amber-800/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-serif">
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        🐾 {result.guardianGrowth.beast.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-amber-950/80 border border-amber-700/50 text-amber-300">
                        Linh Thú Hộ Vệ
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono pt-1 text-zinc-300">
                      <div>
                        Thú EXP: <span className="text-yellow-400 font-bold">+{result.guardianGrowth.beast.expGained.toLocaleString()}</span>
                      </div>
                      <div>
                        Huyết Mạch: <span className="text-amber-400 font-bold">+{result.guardianGrowth.beast.bloodlinePurityGained}%</span>
                      </div>
                      <div>
                        Trung Thành: <span className="text-emerald-400 font-bold">+{result.guardianGrowth.beast.loyaltyGained || 1}</span>
                      </div>
                      <div>
                        Trạng Thái: {result.guardianGrowth.beast.levelUpOccurred ? (
                          <span className="text-green-400 font-bold animate-pulse">🌟 Thăng Cấp!</span>
                        ) : (
                          <span className="text-zinc-400">Vững chắc</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DANH SÁCH BẢO VẬT NHẶT ĐƯỢC */}
          {result.itemsLooted.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                Dị Bảo & Thảo Khoáng Thu Thập Được ({result.itemsLooted.length}):
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {result.itemsLooted.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-black/50 border border-zinc-800 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-serif text-amber-200 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      x{item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DÒNG THỜI GIAN KỲ NGỘ (TIMELINE EVENT LOGS) */}
          <div className="space-y-3">
            <h3 className="text-xs font-serif font-bold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Dòng Thời Gian Biến Cố Kỳ Ngộ ({result.eventLogs.length} sự kiện):
            </h3>

            {result.eventLogs.length === 0 ? (
              <p className="text-xs text-zinc-500 italic py-3 text-center font-serif">
                Tĩnh tâm minh tưởng, vạn sự bình hòa không phát sinh biến cố.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {result.eventLogs.map((log: MeditationEventLog, idx: number) => {
                  const isAncientMapDrop = log.title.includes('KỲ NGỘ BẢO ĐỒ');
                  const isHazard = Boolean(log.isHazardIncident);
                  const isDefended = Boolean(log.wasDefended);
                  const isGuardianRescue = isHazard && isDefended && (
                    log.title.includes('Đạo Lữ') ||
                    log.title.includes('Linh Thú') ||
                    log.title.includes('Hộ Pháp') ||
                    log.title.includes('Hộ Vệ')
                  );

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs font-serif transition-all ${
                        isAncientMapDrop
                          ? 'bg-gradient-to-r from-amber-950/90 via-yellow-950/60 to-amber-950/90 border-amber-400 text-yellow-200 shadow-[0_0_15px_rgba(251,191,36,0.35)] ring-1 ring-amber-400/40'
                          : isGuardianRescue
                            ? 'bg-gradient-to-r from-amber-950/60 via-yellow-950/30 to-amber-950/60 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : isHazard && !isDefended
                              ? 'bg-red-950/30 border-red-700/50 text-red-200'
                              : isHazard && isDefended
                                ? 'bg-blue-950/30 border-blue-600/50 text-blue-200'
                                : log.rewardType === 'item'
                                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                                  : log.rewardType === 'skill_exp'
                                    ? 'bg-purple-950/20 border-purple-800/40 text-purple-200'
                                    : 'bg-black/40 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold flex items-center gap-1.5">
                          {isAncientMapDrop
                            ? '🗺️'
                            : isGuardianRescue
                              ? '🛡️'
                              : isHazard && !isDefended
                                ? '⚠️'
                                : isHazard && isDefended
                                  ? '🛡️'
                                  : log.rewardType === 'item'
                                    ? '🎁'
                                    : log.rewardType === 'skill_exp'
                                      ? '⚔️'
                                      : '📜'}
                          <span>{log.title}</span>
                          {isAncientMapDrop && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 animate-pulse font-bold">
                              ✨ TÀN ĐỒ CỔ
                            </span>
                          )}
                          {isGuardianRescue && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              🛡️ [HỘ PHÁP XUẤT THỦ]
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Giờ thứ {log.hour}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {log.narrative}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* NÚT THU VÀO TÚI TRỮ VẬT */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black font-serif font-bold text-xs tracking-wider uppercase hover:brightness-110 active:scale-[0.99] transition shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Thu Vào Túi Trữ Vật & Kết Thúc</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
