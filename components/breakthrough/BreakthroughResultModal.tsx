// components/breakthrough/BreakthroughResultModal.tsx
// Modal thông báo kết quả Đột Phá Cảnh Giới phong cách Tiên Hiệp Cổ Phong
// 100% Strict TypeScript, Tailwind CSS, Responsive

import React from 'react';
import { BreakthroughExecutionResult } from '@/lib/types/breakthrough-catalyst';
import { Sparkles, Shield, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface BreakthroughResultModalProps {
  isOpen: boolean;
  result: BreakthroughExecutionResult | null;
  onClose: () => void;
}

export const BreakthroughResultModal: React.FC<BreakthroughResultModalProps> = ({
  isOpen,
  result,
  onClose
}) => {
  if (!isOpen || !result) return null;

  const isSuccess = result.success;
  const isProtected = !result.isBacklashTriggered && !isSuccess;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4 overflow-hidden relative animate-in zoom-in-95 duration-300 ${
          isSuccess
            ? 'bg-gradient-to-b from-[#241a0e] via-[#161210] to-[#0d0a0b] border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.35)]'
            : isProtected
              ? 'bg-gradient-to-b from-[#181d26] via-[#11141c] to-[#0c0e14] border-cyan-500/60 shadow-[0_0_40px_rgba(6,182,212,0.3)]'
              : 'bg-gradient-to-b from-[#261318] via-[#1a0d12] to-[#10080a] border-rose-600/60 shadow-[0_0_40px_rgba(225,29,72,0.3)]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ambient background element */}
        <div className={`absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30 ${
          isSuccess ? 'bg-amber-400' : isProtected ? 'bg-cyan-400' : 'bg-rose-600'
        }`} />

        {/* Header Icon & Title */}
        <div className="text-center space-y-2 relative">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
            isSuccess
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-bounce'
              : isProtected
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(225,29,72,0.4)]'
          }`}>
            {isSuccess ? (
              <Sparkles className="w-9 h-9" />
            ) : isProtected ? (
              <Shield className="w-9 h-9" />
            ) : (
              <AlertTriangle className="w-9 h-9" />
            )}
          </div>

          <h2 className={`font-serif font-black text-lg tracking-wider ${
            isSuccess
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400'
              : isProtected
                ? 'text-cyan-300'
                : 'text-rose-400'
          }`}>
            {isSuccess
              ? '🎉 ĐỘT PHÁ ĐẠI THÀNH CÔNG!'
              : isProtected
                ? '🛡️ ĐỘT PHÁ THẤT BẠI • HỘ MẠCH AN TOÀN'
                : '⚡ ĐỘT PHÁ THẤT BẠI • KINH MẠCH RẠN NỨT'}
          </h2>

          {/* Realm Transition Badge */}
          <div className="flex items-center justify-center gap-2 pt-1 font-serif text-xs font-bold">
            <span className="text-zinc-400 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
              {result.previousRealm}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span className={`px-2.5 py-1 rounded-md border shadow-sm ${
              isSuccess
                ? 'bg-amber-950/80 text-amber-200 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700'
            }`}>
              {result.newRealm}
            </span>
          </div>
        </div>

        {/* Protective Backlash Status Block */}
        {isProtected && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 flex items-start gap-2.5 shadow-inner">
            <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs font-serif">
              <span className="font-bold text-cyan-300 block">
                Hộ Mạch Phù / Thần Đan Hiển Uy!
              </span>
              <p className="text-[11px] text-cyan-100/80 leading-relaxed">
                Đan điền và kinh mạch được phong tỏa an toàn tuyệt đối. Miễn nhiễm 100% sát thương phản phệ (0 Khí Huyết, 0 Tu Vi thất thoát).
              </p>
            </div>
          </div>
        )}

        {!isSuccess && !isProtected && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-1.5 shadow-inner">
            <div className="flex items-center gap-1.5 text-rose-300 font-serif font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Thiên Địa Phản Phệ Nặng Nề:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
              <div className="p-1.5 rounded-lg bg-black/40 border border-rose-900/40">
                <span className="text-[10px] text-zinc-400 block font-serif">Tổn Thất Máu</span>
                <span className="text-rose-400 font-bold">-{result.backlashHpLoss.toLocaleString()} HP</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/40 border border-rose-900/40">
                <span className="text-[10px] text-zinc-400 block font-serif">Tổn Thất Tu Vi</span>
                <span className="text-rose-400 font-bold">-{result.backlashTuviLoss.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resources Consumption Summary */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center text-zinc-300 text-[11px]">
            <span className="font-serif text-zinc-400">Tu Vi tiêu hao:</span>
            <span className="font-bold text-purple-300">
              {result.tuviConsumed.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-zinc-300 text-[11px]">
            <span className="font-serif text-zinc-400">Linh Thạch tiêu hao:</span>
            <span className="font-bold text-yellow-300">
              {result.spiritStonesConsumed.toLocaleString()}
            </span>
          </div>
          {result.consumedPillName && (
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-serif text-zinc-400">Đan dược đã dùng:</span>
              <span className="font-bold text-cyan-300">💊 {result.consumedPillName}</span>
            </div>
          )}
          {result.consumedTalismanName && (
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-serif text-zinc-400">Phù / Trận đã dùng:</span>
              <span className="font-bold text-amber-300">📜 {result.consumedTalismanName}</span>
            </div>
          )}
        </div>

        {/* Log Messages */}
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {result.logMessages.map((msg, idx) => (
            <p
              key={idx}
              className={`text-[11px] font-serif leading-relaxed px-2 py-1 rounded bg-black/30 border border-white/5 ${
                msg.includes('🎉')
                  ? 'text-emerald-300'
                  : msg.includes('🛡️')
                    ? 'text-cyan-300'
                    : msg.includes('⚠️') || msg.includes('⚡')
                      ? 'text-rose-300'
                      : 'text-zinc-300'
              }`}
            >
              {msg}
            </p>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-2.5 px-4 rounded-xl font-serif font-bold text-xs tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5 ${
            isSuccess
              ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          <span>{isSuccess ? 'Lĩnh Ngộ & Tiếp Tục Tu Hành' : 'Định Tâm & Tu Chỉnh Kinh Mạch'}</span>
        </button>
      </div>
    </div>
  );
};
