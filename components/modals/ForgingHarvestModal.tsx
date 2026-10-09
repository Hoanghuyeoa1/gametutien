// components/modals/ForgingHarvestModal.tsx
// Modal Xuất Thiết Thần Binh Cổ Phong (Forging Harvest Showcase)
// Hiển thị thần binh xuất thế, so sánh chỉ số trước/sau với trang bị đang mặc,
// hiển thị chi tiết phù văn, hợp kim, khí linh và cung cấp 2 tùy chọn: [Trang Bị Ngay] hoặc [Thu Nạp Vào Túi].

import React from 'react';
import {
  Sparkles,
  Hammer,
  Sword,
  Shield,
  Zap,
  PackageCheck,
  TrendingUp,
  TrendingDown,
  X,
  Flame,
  Award,
  Layers,
  CircleDot,
  Dna,
  Radio
} from 'lucide-react';
import { Equipment, EquipmentSlot } from '@/lib/types';
import { getItemQuality, convertGradeToGiai, ITEM_QUALITIES } from '@/lib/item-quality-data';

export interface ForgingHarvestModalProps {
  isOpen: boolean;
  forgedItem: Equipment | null;
  currentlyEquippedItem: Equipment | null; // Dùng để tính diff chỉ số trước/sau
  onEquipNow: () => void;
  onStoreToBag: () => void;
  onClose: () => void;
}

interface CoreEquipmentStats {
  power: number;
  atk: number;
  def: number;
  hp: number;
  mp: number;
  speed: number;
}

function extractCoreStats(item: Equipment | null): CoreEquipmentStats {
  if (!item) {
    return { power: 0, atk: 0, def: 0, hp: 0, mp: 0, speed: 0 };
  }
  const stats = item.stats || item.equipmentStats || {};
  return {
    power: item.powerBonus ?? (stats.power || 0),
    atk: item.atkBonus ?? (stats.atk || 0),
    def: item.defBonus ?? (stats.def || 0),
    hp: item.hpBonus ?? (stats.maxHp || stats.hp || 0),
    mp: item.mpBonus ?? (stats.maxMp || stats.mp || 0),
    speed: item.speedBonus ?? (stats.speed || 0)
  };
}

function getSlotVisual(slot?: EquipmentSlot | string) {
  switch (slot) {
    case 'weapon':
      return { label: 'Bản Mệnh Khí', icon: '⚔️', typeName: 'Vũ Khí', color: 'text-amber-400' };
    case 'armor':
      return { label: 'Đạo Bào Tiên Gia', icon: '🛡️', typeName: 'Hộ Giáp', color: 'text-cyan-400' };
    case 'boots':
      return { label: 'Thần Hành Hài', icon: '👟', typeName: 'Hài Ngoa', color: 'text-emerald-400' };
    case 'accessory':
    case 'ring':
      return { label: 'Hộ Thân Giới Chỉ', icon: '📿', typeName: 'Trang Sức', color: 'text-purple-400' };
    case 'artifact':
      return { label: 'Trữ Vật Pháp Bảo', icon: '🔮', typeName: 'Pháp Bảo', color: 'text-rose-400' };
    default:
      return { label: 'Pháp Khí Tiên Đạo', icon: '✨', typeName: 'Trang Bị', color: 'text-yellow-400' };
  }
}

export const ForgingHarvestModal: React.FC<ForgingHarvestModalProps> = ({
  isOpen,
  forgedItem,
  currentlyEquippedItem,
  onEquipNow,
  onStoreToBag,
  onClose
}) => {
  if (!isOpen || !forgedItem) return null;

  const qualityInfo = getItemQuality(forgedItem.quality);
  const displayGiai = convertGradeToGiai(forgedItem.grade);
  const slotVisual = getSlotVisual(forgedItem.slot);

  const forgedStats = extractCoreStats(forgedItem);
  const currentStats = extractCoreStats(currentlyEquippedItem);

  const deltaPower = forgedStats.power - currentStats.power;
  const deltaAtk = forgedStats.atk - currentStats.atk;
  const deltaDef = forgedStats.def - currentStats.def;
  const deltaHp = forgedStats.hp - currentStats.hp;
  const deltaMp = forgedStats.mp - currentStats.mp;
  const deltaSpeed = forgedStats.speed - currentStats.speed;

  // Metadata lồng sâu (nếu có)
  const alloy = forgedItem.alloyMetadata;
  const inscription = forgedItem.inscriptionData;
  const soul = forgedItem.infusedSoul;
  const bloodBond = forgedItem.bloodBondData;
  const lightning = forgedItem.lightningTempering;
  const sockets = forgedItem.sockets || [];
  const affixes = forgedItem.affixes || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Outer Card with Dynamic Glow */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#181310] via-[#100d0b] to-[#070605] border p-5 sm:p-6 text-center shadow-2xl space-y-4 overflow-hidden max-h-[92vh] overflow-y-auto custom-scrollbar text-stone-100"
        style={{
          borderColor: qualityInfo.color,
          boxShadow: `0 0 40px ${qualityInfo.color}35`
        }}
      >
        {/* Nút đóng X ở góc trên bên phải */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition cursor-pointer z-20"
          title="Đóng bảng thu hoạch"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hào quang nền xoay nhẹ (Dual Ambient Orbs) */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"
          style={{ backgroundColor: qualityInfo.color }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"
          style={{ backgroundColor: '#f59e0b' }}
        />

        {/* Header Modal */}
        <div className="space-y-1.5 relative z-10 pt-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-amber-400/90 font-bold">
            <Hammer className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>KHÍ ĐẠO DỊ TƯỢNG • XUẤT THIẾT THÀNH CÔNG</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 flex items-center justify-center gap-2">
            <span>{forgedItem.name}</span>
          </h2>

          <div className="flex items-center justify-center gap-2 flex-wrap text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full border border-amber-500/50 bg-amber-950/60 text-amber-300 font-serif font-bold">
              {displayGiai}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full border font-serif font-bold ${qualityInfo.badgeClass}`}
            >
              {qualityInfo.name} (Hệ số x{qualityInfo.multiplier})
            </span>
            <span className="px-2.5 py-0.5 rounded-full border border-cyan-700/50 bg-cyan-950/60 text-cyan-300 font-mono">
              {slotVisual.icon} {slotVisual.typeName}
            </span>
            {forgedItem.enhancement > 0 && (
              <span className="px-2.5 py-0.5 rounded-full border border-yellow-500/70 bg-gradient-to-r from-amber-900/80 to-yellow-800/80 text-yellow-200 font-mono font-bold shadow-[0_0_10px_rgba(250,204,21,0.3)] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>+{forgedItem.enhancement} Cường Hóa</span>
              </span>
            )}
          </div>
        </div>

        {/* Animation Đài Nung Thần Binh & Vòng Trận Quỹ Đạo */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-1">
          {/* 3 vòng hào quang đồng tâm quay ngược chiều */}
          <div
            className="absolute rounded-full border border-dashed transition-all duration-700 animate-spin"
            style={{
              width: '136px',
              height: '136px',
              borderColor: `${qualityInfo.color}40`,
              animationDuration: '18s'
            }}
          />
          <div
            className="absolute rounded-full border border-dotted transition-all duration-700 animate-spin"
            style={{
              width: '112px',
              height: '112px',
              borderColor: 'rgba(245, 158, 11, 0.45)',
              animationDirection: 'reverse',
              animationDuration: '12s'
            }}
          />
          <div
            className="absolute rounded-full border border-dashed transition-all duration-700 animate-spin"
            style={{
              width: '88px',
              height: '88px',
              borderColor: `${qualityInfo.color}60`,
              animationDuration: '8s'
            }}
          />

          {/* Biểu tượng thần binh trung tâm */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform duration-500 scale-105 border relative z-10"
            style={{
              backgroundColor: `${qualityInfo.color}18`,
              borderColor: `${qualityInfo.color}90`,
              boxShadow: `0 0 25px ${qualityInfo.color}45`
            }}
          >
            <span>{slotVisual.icon}</span>
          </div>

          {/* Huy hiệu Chiến Lực bay bên dưới thần binh */}
          <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-black/95 border border-amber-500/60 text-[10.5px] font-mono text-amber-300 font-bold shadow-lg flex items-center gap-1 z-20">
            <Sword className="w-3 h-3 text-amber-400" />
            <span>Chiến Lực +{forgedStats.power.toLocaleString()}</span>
          </div>
        </div>

        {/* THẺ TỔNG KẾT SO SÁNH THỰC LỰC (THIÊN CƠ DỰ BÁO) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-cyan-950/40 border border-amber-600/40 text-left space-y-2.5 shadow-md relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Thiên Cơ Dự Báo • So Sánh Thực Lực:</span>
            </span>

            {deltaPower > 0 ? (
              <span className="text-[10.5px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/60 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Chiến Lực Tăng +{deltaPower.toLocaleString()}</span>
              </span>
            ) : deltaPower < 0 ? (
              <span className="text-[10.5px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/60 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>Chiến Lực Giảm {deltaPower.toLocaleString()}</span>
              </span>
            ) : (
              <span className="text-[10.5px] font-mono font-bold text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-700/60">
                Chiến Lực Ngang Bằng
              </span>
            )}
          </div>

          {/* Bảng so sánh 2 thẻ: Đang Mặc vs Vừa Đúc */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {/* Cột 1: Đang Mặc */}
            <div className="p-2 rounded bg-black/60 border border-stone-800 space-y-1">
              <div className="text-zinc-400 text-[10px] flex items-center justify-between">
                <span>Hiện Đang Mặc:</span>
                <span className="text-zinc-500 font-sans truncate max-w-[80px]">
                  {currentlyEquippedItem ? currentlyEquippedItem.name : '(Trống)'}
                </span>
              </div>
              <div className="font-bold text-xs text-zinc-300">
                {currentStats.power > 0 ? `${currentStats.power.toLocaleString()} CL` : '0 CL'}
              </div>
              <div className="text-[10px] text-zinc-400 space-y-0.5 pt-0.5 border-t border-zinc-800/60">
                <div>Công: {currentStats.atk} • Thủ: {currentStats.def}</div>
                <div>HP: {currentStats.hp} • Thân Pháp: {currentStats.speed}</div>
              </div>
            </div>

            {/* Cột 2: Thần Binh Mới */}
            <div className="p-2 rounded bg-black/60 border border-amber-700/40 space-y-1">
              <div className="text-amber-400 text-[10px] flex items-center justify-between">
                <span className="font-bold">Thần Binh Mới:</span>
                <span className="text-amber-300/80 font-sans truncate max-w-[80px]">
                  {forgedItem.name}
                </span>
              </div>
              <div className="font-bold text-xs text-amber-300 flex items-center justify-between">
                <span>{forgedStats.power.toLocaleString()} CL</span>
                {deltaPower !== 0 && (
                  <span className={`text-[10px] ${deltaPower > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ({deltaPower > 0 ? `+${deltaPower}` : deltaPower})
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-300 space-y-0.5 pt-0.5 border-t border-amber-900/40">
                <div>
                  Công: <span className={deltaAtk > 0 ? 'text-emerald-400 font-bold' : deltaAtk < 0 ? 'text-rose-400' : ''}>{forgedStats.atk}</span>
                  {' • '}
                  Thủ: <span className={deltaDef > 0 ? 'text-emerald-400 font-bold' : deltaDef < 0 ? 'text-rose-400' : ''}>{forgedStats.def}</span>
                </div>
                <div>
                  HP: <span className={deltaHp > 0 ? 'text-emerald-400 font-bold' : deltaHp < 0 ? 'text-rose-400' : ''}>{forgedStats.hp}</span>
                  {' • '}
                  Thân Pháp: <span className={deltaSpeed > 0 ? 'text-emerald-400 font-bold' : deltaSpeed < 0 ? 'text-rose-400' : ''}>{forgedStats.speed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METADATA ĐẶC SẮC (HỢP KIM, TRẬN PHÁP, HÓA HỒN, KHẢM NGỌC, AFFIXES) */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-amber-900/30 text-left space-y-2 text-xs font-mono relative z-10">
          {/* 1. Đoán Cốt Hợp Kim (Modular Metallurgy) */}
          {alloy && (
            <div className="p-2 rounded bg-amber-950/40 border border-amber-600/40 text-amber-200 space-y-1">
              <div className="font-bold flex items-center justify-between text-amber-300 font-serif text-[11.5px]">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Đoán Cốt Hợp Kim: {alloy.archetypeName}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-900/80 text-amber-200 border border-amber-500/50">
                  Độ Tinh Khiết: {alloy.purity}%
                </span>
              </div>
              <div className="text-[10.5px] text-amber-300/80 leading-relaxed font-sans">
                {forgedItem.description}
              </div>
            </div>
          )}

          {/* 2. Trận Pháp Khảm Khắc (Inscription) */}
          {inscription && (
            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-600/40 text-cyan-200 space-y-1">
              <div className="font-bold flex items-center justify-between text-cyan-300 font-serif text-[11.5px]">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Trận Khắc: {inscription.formationName}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-500/50">
                  {inscription.grade}
                </span>
              </div>
              <div className="text-[10.5px] text-cyan-300/80 leading-relaxed font-sans">
                {inscription.description || `Trận khí cộng hưởng, gia tăng uy lực chiến đấu toàn diện.`}
              </div>
            </div>
          )}

          {/* 3. Khí Linh Hóa Hồn (Soul Infusion) */}
          {soul && (
            <div className="p-2 rounded bg-purple-950/40 border border-purple-600/40 text-purple-200 space-y-1">
              <div className="font-bold flex items-center justify-between text-purple-300 font-serif text-[11.5px]">
                <span className="flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Khí Linh: {soul.beastName}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-200 border border-purple-500/50">
                  Cấp {soul.spiritTier || 1}
                </span>
              </div>
              <div className="text-[10.5px] text-purple-300/80 leading-relaxed font-sans">
                {soul.skillDescription || `Khí linh thức tỉnh mang lại thần thông phụ trợ chiến đấu.`}
              </div>
            </div>
          )}

          {/* 4. Huyết Khế & Khí Kiếp (Blood Bond / Lightning) */}
          {(bloodBond || lightning) && (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {bloodBond && (
                <div className="flex-1 p-2 rounded bg-rose-950/40 border border-rose-600/40 text-rose-200 text-[10.5px]">
                  <span className="font-bold text-rose-300 flex items-center gap-1">
                    <Award className="w-3 h-3 text-rose-400" />
                    <span>Huyết Tế: Bậc {bloodBond.bondLevel}</span>
                  </span>
                  <div className="text-zinc-300 text-[10px] mt-0.5">
                    Đồng hóa: +{bloodBond.resonancePercent}% chỉ số
                  </div>
                </div>
              )}
              {lightning && (
                <div className="flex-1 p-2 rounded bg-violet-950/40 border border-violet-600/40 text-violet-200 text-[10.5px]">
                  <span className="font-bold text-violet-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-violet-400" />
                    <span>Lôi Kiếp Tôi Thể</span>
                  </span>
                  <div className="text-zinc-300 text-[10px] mt-0.5">
                    Hào quang sấm bạc tôi nung kinh mạch
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Khảm Nạp Linh Ngọc & Lỗ Khảm (Sockets) */}
          {sockets.length > 0 && (
            <div className="pt-1 border-t border-zinc-800/80 flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400 flex items-center gap-1 font-serif">
                <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Khảm Ngọc ({sockets.length} Lỗ):</span>
              </span>
              <div className="flex items-center gap-1.5">
                {sockets.map((s, idx) => (
                  <span
                    key={idx}
                    className={`w-4 h-4 rounded-full border text-[9px] flex items-center justify-center font-bold ${
                      s.gem
                        ? 'bg-cyan-900 border-cyan-400 text-cyan-200 shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                        : s.unlocked
                        ? 'bg-black/60 border-zinc-600 text-zinc-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-700'
                    }`}
                    title={s.gem ? `Đã khảm: ${s.gem.name}` : s.unlocked ? 'Lỗ mở sẵn' : 'Lỗ chưa đục'}
                  >
                    {s.gem ? '◆' : s.unlocked ? '○' : '✕'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 6. Thuộc tính ẩn (Affixes) */}
          {affixes.length > 0 && (
            <div className="pt-1 border-t border-zinc-800/80 space-y-1">
              <span className="text-zinc-400 text-[10px] font-serif block">Thuộc Tính Ẩn Khởi Đầu:</span>
              <div className="flex flex-wrap gap-1.5">
                {affixes.map((aff, i) => (
                  <span
                    key={aff.id || i}
                    className="text-[9.5px] px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-700/60 text-zinc-300"
                  >
                    • {aff.name || aff.description || `${aff.statKey}: +${aff.value}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mô tả cơ bản nếu không có metadata phức tạp */}
          {!alloy && !inscription && !soul && forgedItem.description && (
            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans pt-0.5 italic">
              {forgedItem.description}
            </p>
          )}
        </div>

        {/* 2 NÚT THAO TÁC SAU THU HOẠCH: [TRANG BỊ NGAY] & [THU NẠP VÀO TÚI] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 relative z-10">
          {/* Nút 1: Trang Bị Ngay */}
          <button
            type="button"
            onClick={onEquipNow}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 hover:brightness-110 text-stone-950 font-serif font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Sword className="w-4 h-4 text-stone-950 shrink-0" />
            <div className="flex flex-col items-center leading-tight">
              <span>Trang Bị Ngay</span>
              {currentlyEquippedItem && (
                <span className="text-[9px] font-sans text-stone-900/85 font-semibold">
                  (Hoán chuyển đồ cũ vào túi)
                </span>
              )}
            </div>
          </button>

          {/* Nút 2: Thu Nạp Vào Túi */}
          <button
            type="button"
            onClick={onStoreToBag}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-stone-900 via-zinc-800 to-stone-900 hover:bg-stone-850 border border-emerald-500/50 hover:border-emerald-400 text-emerald-200 font-serif font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thu Nạp Vào Túi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
