// components/tabs/ManualSynthesisView.tsx
// Giao diện Bàn Diễn Võ Vạn Pháp (Dung Hợp Công Pháp)
// Thiết kế cổ phong Thái Cực, viền bát quái phát quang, không sử dụng ảnh ngoài.

'use client';

import React, { useState } from 'react';
import {
  Zap, Sparkles, RefreshCw, X, FlameKindling,
  BookOpen, ChevronDown, Wand2, CheckCircle2, Info,
  Layers, ArrowRight, Star
} from 'lucide-react';
import { PlayerStats, Manual } from '@/lib/types';
import { SynthesizedManualExtension, SynthesisCatalyst, SynthesisResult } from '@/lib/types/manual-synthesis';
import {
  MANUAL_GRADE_ORDER,
  MANUAL_GRADE_BY_ORDER,
  SYNTHESIS_TIER_CONFIG,
  calculateDisplayedMutationRate,
  findEligibleSynthesisPairs
} from '@/lib/manual-synthesis-logic';
import { useManualSynthesisActions } from '@/hooks/useManualSynthesisActions';

type SynthesisManual = Manual & SynthesizedManualExtension;

interface ManualSynthesisViewProps {
  player: PlayerStats;
  synthesisActions: ReturnType<typeof useManualSynthesisActions>;
}

// ─── Badge Style theo giai bậc ────────────────────────────────────────────────
const GRADE_STYLE: Record<string, { border: string; text: string; bg: string; glow: string }> = {
  'Hoàng Giai':     { border: 'border-yellow-700/60',  text: 'text-yellow-300',   bg: 'bg-yellow-950/30',  glow: 'shadow-yellow-900/40' },
  'Huyền Giai':     { border: 'border-violet-700/60',  text: 'text-violet-300',   bg: 'bg-violet-950/30',  glow: 'shadow-violet-900/40' },
  'Địa Giai':       { border: 'border-emerald-700/60', text: 'text-emerald-300',  bg: 'bg-emerald-950/30', glow: 'shadow-emerald-900/40' },
  'Thiên Giai':     { border: 'border-sky-600/60',     text: 'text-sky-300',      bg: 'bg-sky-950/30',     glow: 'shadow-sky-900/40' },
  'Thần Giai':      { border: 'border-rose-600/60',    text: 'text-rose-300',     bg: 'bg-rose-950/30',    glow: 'shadow-rose-900/40' },
  'Thái Cổ Giai':   { border: 'border-orange-500/60',  text: 'text-orange-300',   bg: 'bg-orange-950/30',  glow: 'shadow-orange-900/40' },
  'Tiên Thiên Giai':{ border: 'border-pink-500/60',    text: 'text-pink-200',     bg: 'bg-pink-950/30',    glow: 'shadow-pink-900/60' },
};

function getGradeStyle(grade: string) {
  return GRADE_STYLE[grade] ?? { border: 'border-zinc-700/50', text: 'text-zinc-300', bg: 'bg-zinc-900/30', glow: 'shadow-zinc-900/40' };
}

function getTypeName(type: string) {
  const map: Record<string, string> = {
    tam_phap: '📿 Tâm Pháp',
    the_thuat: '🛡️ Thể Thuật',
    than_thong: '✨ Thần Thông',
    than_phap: '💨 Thân Pháp',
    cong_phap: '⚔️ Công Pháp'
  };
  return map[type] ?? type;
}

// ─── Sub-Component: Slot Bí Kíp ───────────────────────────────────────────────
function ManualSlot({
  label,
  manual,
  onSelect,
  onClear
}: {
  label: 'A' | 'B';
  manual: SynthesisManual | null;
  onSelect: () => void;
  onClear: () => void;
}) {
  const gs = manual ? getGradeStyle(manual.grade) : null;

  return (
    <div className="flex-1">
      <div className="text-[10px] text-zinc-500 font-serif mb-1 text-center">
        {label === 'A' ? '⚗️ Nguyên Liệu Giáp' : '⚗️ Nguyên Liệu Ất'}
      </div>
      {manual ? (
        <div className={`relative p-2.5 rounded-xl border ${gs!.border} ${gs!.bg} shadow-lg ${gs!.glow}`}>
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-zinc-800/80 hover:bg-red-900/60 text-zinc-400 hover:text-red-300 transition cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
          <div className={`text-xs font-serif font-bold ${gs!.text} leading-tight`}>{manual.name}</div>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${gs!.border} ${gs!.text} ${gs!.bg}`}>
              {manual.grade}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-700/50 text-zinc-400 bg-zinc-900/30">
              {getTypeName(manual.type)}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-zinc-400">
            Tầng {manual.level}/{manual.maxLevel}
          </div>
          {manual.isSynthesized && (
            <div className="mt-1 text-[10px] text-amber-400 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Đã Dung Hợp
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="w-full py-6 rounded-xl border-2 border-dashed border-zinc-700/50 bg-zinc-900/20 hover:border-amber-600/50 hover:bg-amber-950/10 transition cursor-pointer flex flex-col items-center gap-1.5"
        >
          <BookOpen className="w-5 h-5 text-zinc-600" />
          <span className="text-[10px] text-zinc-500 font-serif">Chọn Bí Tịch</span>
        </button>
      )}
    </div>
  );
}

// ─── Sub-Component: Modal Chọn Bí Kíp ────────────────────────────────────────
function ManualSelectModal({
  player,
  slot,
  otherManual,
  onSelect,
  onClose
}: {
  player: PlayerStats;
  slot: 'A' | 'B';
  otherManual: SynthesisManual | null;
  onSelect: (m: SynthesisManual) => void;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<'all' | string>('all');

  const equippedIds = Object.values(player.equippedManuals ?? {})
    .filter(Boolean)
    .map(v => (typeof v === 'string' ? v : (v as any)?.id));

  const manuals = (player.manuals ?? []) as SynthesisManual[];

  // Lọc: nếu slot kia đã có bí kíp → chỉ hiện cùng type và grade
  const filtered = manuals.filter(m => {
    if (m.id === otherManual?.id) return false;
    if (otherManual) {
      if (m.type !== otherManual.type) return false;
      if (m.grade !== otherManual.grade) return false;
    }
    if (filter !== 'all' && m.type !== filter) return false;
    return true;
  });

  const types = Array.from(new Set(manuals.map(m => m.type)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0d0d15] border border-amber-800/40 rounded-2xl shadow-2xl shadow-amber-900/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-950/60 via-zinc-950 to-amber-950/60 border-b border-amber-800/30">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-serif font-bold text-amber-200">
              Chọn Bí Tịch – Slot {slot}
            </span>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-red-900/40 text-zinc-400 hover:text-red-300 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gợi ý */}
        {otherManual && (
          <div className="mx-3 mt-2 px-2 py-1.5 rounded-lg bg-amber-950/30 border border-amber-700/30 text-[10px] text-amber-300 font-serif flex items-center gap-1.5">
            <Info className="w-3 h-3 flex-shrink-0" />
            Đang lọc cùng phân hệ và giai bậc với [{otherManual.name}]
          </div>
        )}

        {/* Bộ lọc type */}
        {!otherManual && (
          <div className="flex gap-1 p-2 overflow-x-auto">
            <button type="button" onClick={() => setFilter('all')}
              className={`px-2 py-0.5 text-[10px] rounded cursor-pointer transition ${filter === 'all' ? 'bg-amber-600/30 text-amber-200 border border-amber-600/40' : 'text-zinc-400 bg-zinc-900/30'}`}>
              Tất Cả
            </button>
            {types.map(t => (
              <button key={t} type="button" onClick={() => setFilter(t)}
                className={`px-2 py-0.5 text-[10px] rounded cursor-pointer transition whitespace-nowrap ${filter === t ? 'bg-blue-600/30 text-blue-200 border border-blue-600/40' : 'text-zinc-400 bg-zinc-900/30'}`}>
                {getTypeName(t)}
              </button>
            ))}
          </div>
        )}

        {/* Danh sách */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-serif">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
              Không có bí tịch hợp lệ để dung hợp.
            </div>
          ) : (
            filtered.map(m => {
              const gs = getGradeStyle(m.grade);
              const isEquipped = equippedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={isEquipped}
                  onClick={() => { onSelect(m); onClose(); }}
                  className={`w-full text-left p-2 rounded-lg border ${gs.border} ${gs.bg} hover:brightness-110 transition cursor-pointer ${isEquipped ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className={`text-xs font-serif font-bold ${gs.text} flex items-center gap-1`}>
                    {m.name}
                    {m.isSynthesized && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                    {isEquipped && <span className="text-[10px] text-zinc-400">(Đang trang bị)</span>}
                  </div>
                  <div className="flex gap-1 mt-0.5">
                    <span className={`text-[9px] px-1 py-0.5 rounded ${gs.bg} ${gs.text} border ${gs.border}`}>{m.grade}</span>
                    <span className="text-[9px] text-zinc-500">Tầng {m.level}/{m.maxLevel}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-Component: Modal Kết Quả Thành Công ─────────────────────────────────
function SynthesisResultModal({
  result,
  onClose
}: {
  result: SynthesisResult;
  onClose: () => void;
}) {
  const synth = result.synthesizedManual;
  if (!synth) return null;
  const gs = getGradeStyle(synth.grade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-sm bg-[#08080f] border-2 ${gs.border} rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300`}
        style={{ boxShadow: `0 0 40px rgba(255,215,0,0.15)` }}>
        {/* Tiêu đề */}
        <div className="p-4 text-center bg-gradient-to-b from-amber-950/60 to-transparent border-b border-amber-800/30">
          <div className="text-2xl font-serif font-bold text-amber-200 flex items-center justify-center gap-2">
            {result.mutationTriggered
              ? <><Zap className="w-6 h-6 text-yellow-400 animate-pulse" /> DỊ BIẾN TUYỆT KỸ!</>
              : <><CheckCircle2 className="w-6 h-6 text-emerald-400" /> DUNG HỢP THÀNH CÔNG!</>
            }
          </div>
          <p className="text-[10px] text-zinc-400 mt-1 font-serif italic">
            {result.mutationTriggered
              ? 'Trời đất vận chuyển, thiên cơ kỳ biến, tuyệt kỹ ra đời!'
              : 'Chân khí lai tụ, bí kíp hoàn thành, giai bậc thăng hoa!'}
          </p>
        </div>

        {/* Bí kíp mới */}
        <div className="p-4 space-y-3">
          <div className={`p-3 rounded-xl border-2 ${gs.border} ${gs.bg} text-center`}>
            <div className="text-[10px] text-zinc-500 font-serif">Tuyệt Kỹ Mới Khai Sáng</div>
            <div className={`text-lg font-serif font-bold ${gs.text} mt-1 leading-tight`}>{synth.name}</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${gs.border} ${gs.text} ${gs.bg}`}>
                ★ {synth.grade}
              </span>
              <span className="text-xs text-zinc-400 font-serif">{getTypeName(synth.type)}</span>
            </div>
          </div>

          {/* Thông tin kế thừa */}
          <div className="text-[10px] text-zinc-400 font-serif px-1 space-y-0.5">
            <div>⚗️ Dung hợp từ: <span className="text-amber-300">[{synth.synthesisParents?.nameA}]</span> × <span className="text-amber-300">[{synth.synthesisParents?.nameB}]</span></div>
            {synth.tuViPerLevel && <div>⚡ Tốc độ tu vi: <span className="text-emerald-300">+{synth.tuViPerLevel.toLocaleString()} / tầng</span></div>}
            {synth.speedBonusPerLevel && <div>🌀 Thổ nạp: <span className="text-sky-300">+{synth.speedBonusPerLevel}% / tầng</span></div>}
          </div>

          {/* Dị Biến Thần Thông */}
          {result.mutationTriggered && result.aura && (
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-yellow-950/50 to-amber-950/50 border border-yellow-700/50">
              <div className="flex items-center gap-1.5 mb-1">
                <FlameKindling className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span className="text-xs font-serif font-bold text-yellow-300">Dị Biến Kỳ Năng</span>
              </div>
              <div className="text-xs font-serif text-amber-200 font-bold">{result.aura.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{result.aura.description}</div>
              <div className="text-[10px] text-yellow-400 mt-1">
                Tỉ lệ kích hoạt: {result.aura.triggerChance}% mỗi lượt đánh
              </div>
            </div>
          )}

          {/* Chi phí */}
          <div className="text-[10px] text-zinc-500 font-serif text-center">
            Tiêu hao {result.costLinhThach.toLocaleString()} Linh Thạch
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700/40 to-amber-600/30 hover:from-amber-600/50 hover:to-amber-500/40 border border-amber-600/50 text-amber-200 font-serif font-bold text-sm cursor-pointer transition"
          >
            Tiếp Tục Tu Luyện
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT CHÍNH ──────────────────────────────────────────────────────────
export const ManualSynthesisView: React.FC<ManualSynthesisViewProps> = ({
  player,
  synthesisActions
}) => {
  const {
    slotA, slotB, selectedCatalyst,
    lastResult, showResultModal,
    previewMutationRate, previewCost,
    eligibilityCheck, availableCatalysts, catalystCount,
    handleSelectSlot, handleClearSlot, handleSelectCatalyst,
    handleAutoMatch, handleExecuteSynthesis, handleCloseResultModal
  } = synthesisActions;

  const [showSelectModal, setShowSelectModal] = useState<'A' | 'B' | null>(null);

  const currentGradeOrder = slotA ? (MANUAL_GRADE_ORDER[slotA.grade] ?? 0) : 0;
  const nextGrade = MANUAL_GRADE_BY_ORDER[currentGradeOrder + 1] ?? null;
  const tierConfig = currentGradeOrder > 0 ? SYNTHESIS_TIER_CONFIG[currentGradeOrder] : null;

  const canExecute = eligibilityCheck?.eligible === true;

  // Auto-match đếm số cặp hợp lệ
  const equippedIds = Object.values(player.equippedManuals ?? {}).filter(Boolean)
    .map(v => (typeof v === 'string' ? v : (v as any)?.id));
  const availableManualsForMatch = (player.manuals ?? []).filter(m => !equippedIds.includes(m.id));
  const eligiblePairsCount = findEligibleSynthesisPairs(availableManualsForMatch).length;

  return (
    <div className="space-y-3">
      {/* === BANNER ĐỀ MỤC === */}
      <div className="p-3 bg-gradient-to-r from-amber-950/50 via-purple-950/30 to-amber-950/50 rounded-xl border border-amber-700/40 text-center">
        <div className="text-sm font-serif font-bold text-amber-200 flex items-center justify-center gap-2">
          <Wand2 className="w-4 h-4 text-amber-400" />
          BÀN DIỄN VÕ VẠN PHÁP
          <Wand2 className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-[10px] text-zinc-400 font-serif italic mt-0.5">
          Dung hợp 2 bí tịch cùng phân hệ & giai bậc · Khai sáng tuyệt kỹ cao giai · Cơ duyên Dị Biến Thần Thông
        </p>
      </div>

      {/* === NÚT AUTO-MATCH === */}
      <button
        type="button"
        onClick={handleAutoMatch}
        className="w-full py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-700/40 hover:border-purple-600/60 text-purple-300 text-xs font-serif font-bold flex items-center justify-center gap-2 cursor-pointer transition"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Tự Động Ghép Cặp ({eligiblePairsCount} cặp hợp lệ)
      </button>

      {/* === KHU VỰC ĐÀI DUNG HỢP BÁT QUÁI === */}
      <div className="p-3 rounded-xl border border-zinc-700/40 bg-zinc-900/20 space-y-3">
        <div className="text-[10px] text-zinc-500 font-serif text-center mb-1">
          ☯ Đài Dung Hợp Thái Cực ☯
        </div>

        {/* 2 Slot Nguyên Liệu */}
        <div className="flex gap-2 items-start">
          <ManualSlot
            label="A"
            manual={slotA}
            onSelect={() => setShowSelectModal('A')}
            onClear={() => handleClearSlot('A')}
          />
          {/* Icon kết nối trung tâm */}
          <div className="flex flex-col items-center justify-center pt-6 gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition ${slotA && slotB ? 'border-amber-500/80 bg-amber-950/40 text-amber-400' : 'border-zinc-700/50 bg-zinc-900/30 text-zinc-600'}`}>
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <ManualSlot
            label="B"
            manual={slotB}
            onSelect={() => setShowSelectModal('B')}
            onClear={() => handleClearSlot('B')}
          />
        </div>

        {/* Đạo Cụ Xúc Tác */}
        <div>
          <div className="text-[10px] text-zinc-500 font-serif mb-1.5">⚗️ Đạo Cụ Xúc Tác (Tùy Chọn)</div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => handleSelectCatalyst(null)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-serif border transition cursor-pointer flex-shrink-0 ${!selectedCatalyst ? 'bg-zinc-800/60 border-zinc-600/60 text-zinc-200' : 'bg-zinc-900/30 border-zinc-700/40 text-zinc-500'}`}
            >
              Không Dùng
            </button>
            {availableCatalysts.map(cat => {
              const inKho = (() => {
                const pills = player.inventory?.pills ?? [];
                const herbs = player.inventory?.herbs ?? [];
                const all = [...pills, ...herbs];
                return (all.find((i: any) => i.id === cat.itemId) as any)?.quantity ?? 0;
              })();
              const isSelected = selectedCatalyst?.itemId === cat.itemId;
              return (
                <button
                  key={cat.itemId}
                  type="button"
                  onClick={() => handleSelectCatalyst(cat)}
                  disabled={inKho === 0}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-serif border transition cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-950/50 border-amber-600/60 text-amber-200'
                      : inKho === 0
                      ? 'bg-zinc-900/20 border-zinc-800/30 text-zinc-600 opacity-50 cursor-not-allowed'
                      : 'bg-zinc-900/30 border-zinc-700/40 text-zinc-400 hover:border-amber-700/40 hover:text-amber-300'
                  }`}
                >
                  <div>{cat.name}</div>
                  <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`}>
                    +{cat.mutationRateBonus}% Dị Biến · Kho: {inKho}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* === BẢNG TIÊN ĐOÁN THIÊN CƠ === */}
      {slotA && slotB && (
        <div className="p-3 rounded-xl border border-zinc-700/40 bg-zinc-900/20 space-y-2">
          <div className="text-[10px] text-zinc-500 font-serif flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Tiên Đoán Thiên Cơ
          </div>

          {/* Giai bậc nâng lên */}
          {nextGrade && (
            <div className="flex items-center gap-2 text-xs font-serif">
              <span className={`px-2 py-0.5 rounded border ${getGradeStyle(slotA.grade).border} ${getGradeStyle(slotA.grade).text} ${getGradeStyle(slotA.grade).bg} text-[10px]`}>
                {slotA.grade}
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
              <span className={`px-2 py-0.5 rounded border ${getGradeStyle(nextGrade).border} ${getGradeStyle(nextGrade).text} ${getGradeStyle(nextGrade).bg} text-[10px] font-bold`}>
                {nextGrade} ★
              </span>
            </div>
          )}

          {/* Tỉ lệ Dị Biến */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-500 font-serif flex items-center gap-1">
              <FlameKindling className="w-3 h-3 text-amber-500" />
              Tỉ lệ Dị Biến Tuyệt Kỹ:
            </span>
            <span className={`font-bold font-serif ${previewMutationRate >= 50 ? 'text-amber-300' : 'text-zinc-300'}`}>
              {previewMutationRate}%
              {selectedCatalyst?.guaranteedAura && ' (Đảm Bảo!)'}
            </span>
          </div>

          {/* Tỉ lệ thành công */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-500 font-serif">Tỉ lệ dung hợp:</span>
            <span className="text-emerald-300 font-bold font-serif">100% ✓</span>
          </div>

          {/* Chi phí */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-zinc-500 font-serif">Chi phí Linh Thạch:</span>
            <span className={`font-bold font-serif ${(player.linhThach ?? 0) < previewCost ? 'text-red-400' : 'text-amber-300'}`}>
              {previewCost.toLocaleString()}
              {(player.linhThach ?? 0) < previewCost && ' (không đủ)'}
            </span>
          </div>

          {/* Cảnh báo bí kíp đang trang bị */}
          {eligibilityCheck && !eligibilityCheck.eligible && (
            <div className="text-[10px] text-red-400 font-serif p-2 bg-red-950/30 rounded-lg border border-red-800/40">
              ⚠️ {eligibilityCheck.reason}
            </div>
          )}
        </div>
      )}

      {/* === NÚT KÍCH HOẠT === */}
      <button
        type="button"
        onClick={handleExecuteSynthesis}
        disabled={!canExecute}
        className={`w-full py-3 px-4 rounded-xl text-sm font-serif font-bold transition ${
          canExecute
            ? 'bg-gradient-to-r from-amber-700/60 via-yellow-600/50 to-amber-700/60 hover:from-amber-600/70 hover:to-amber-600/70 border border-amber-500/60 text-amber-100 cursor-pointer shadow-lg shadow-amber-900/30'
            : 'bg-zinc-900/30 border border-zinc-700/40 text-zinc-500 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Zap className={`w-4 h-4 ${canExecute ? 'text-yellow-300 animate-pulse' : 'text-zinc-600'}`} />
          🔥 KÍCH HOẠT VẠN PHÁP QUY TÔNG
          <Zap className={`w-4 h-4 ${canExecute ? 'text-yellow-300 animate-pulse' : 'text-zinc-600'}`} />
        </div>
        {!canExecute && !slotA && !slotB && (
          <div className="text-[10px] text-zinc-600 mt-0.5">Cần chọn 2 bí tịch cùng phân hệ và giai bậc</div>
        )}
      </button>

      {/* === MODALS === */}
      {showSelectModal && (
        <ManualSelectModal
          player={player}
          slot={showSelectModal}
          otherManual={showSelectModal === 'A' ? slotB : slotA}
          onSelect={(m) => handleSelectSlot(showSelectModal, m)}
          onClose={() => setShowSelectModal(null)}
        />
      )}

      {showResultModal && lastResult && (
        <SynthesisResultModal
          result={lastResult}
          onClose={handleCloseResultModal}
        />
      )}
    </div>
  );
};
