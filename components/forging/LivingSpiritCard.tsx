// components/forging/LivingSpiritCard.tsx
// Thẻ tương tác Khí Linh Độc Bản kèm Bong Bóng Thoại Typewriter & Dưỡng Linh Thức Tỉnh
// 100% Strict TypeScript, Tailwind CSS, Chuẩn Tiên Hiệp Cổ Phong

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Equipment } from '@/lib/types/items';
import { PlayerState } from '@/lib/types/player';
import {
  InfusedSoulMetadata,
  SpiritEvolutionStage,
  SoulType
} from '@/lib/types/soul-infusion';
import {
  SPIRIT_STAGE_NAMES,
  SPIRIT_PERSONALITY_NAMES
} from '@/lib/soul-infusion-logic';
import { SPIRIT_FOOD_EXP_MAP } from '@/hooks/useSoulInfusionActions';
import { audioEngine } from '@/lib/audio-engine';
import {
  Sparkles,
  Heart,
  Shield,
  Zap,
  Flame,
  MessageSquare,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

export interface LivingSpiritCardProps {
  weapon: Equipment;
  player: PlayerState;
  onInteract?: (weapon: Equipment) => void;
  onFeed?: (materialId: string, amount: number) => Promise<boolean>;
  isFeeding?: boolean;
  externalDialogue?: { text: string; spiritName: string } | null;
}

// Icon & Màu sắc cho 5 Thần Thú Khí Linh
const SPIRIT_BEAST_VISUALS: Record<SoulType, {
  avatar: string;
  badgeColor: string;
  glowClass: string;
  title: string;
  elementColor: string;
}> = {
  hac_giao: {
    avatar: '🐉',
    badgeColor: 'border-cyan-500/50 bg-cyan-950/60 text-cyan-200',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    title: 'Hắc Thủy Huyền Giao',
    elementColor: 'text-cyan-400'
  },
  hoa_phuong: {
    avatar: '🦚',
    badgeColor: 'border-rose-500/50 bg-rose-950/60 text-rose-200',
    glowClass: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    title: 'Cửu Thiên Hỏa Phượng',
    elementColor: 'text-rose-400'
  },
  bach_ho: {
    avatar: '🐯',
    badgeColor: 'border-amber-500/50 bg-amber-950/60 text-amber-200',
    glowClass: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    title: 'Canh Kim Bạch Hổ',
    elementColor: 'text-amber-400'
  },
  huyen_vu: {
    avatar: '🐢',
    badgeColor: 'border-emerald-500/50 bg-emerald-950/60 text-emerald-200',
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    title: 'Bắc Minh Huyền Vũ',
    elementColor: 'text-emerald-400'
  },
  co_kiem_tu: {
    avatar: '⚔️',
    badgeColor: 'border-purple-500/50 bg-purple-950/60 text-purple-200',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    title: 'Thượng Cổ Kiếm Tu',
    elementColor: 'text-purple-400'
  }
};

export const LivingSpiritCard: React.FC<LivingSpiritCardProps> = ({
  weapon,
  player,
  onInteract,
  onFeed,
  isFeeding = false,
  externalDialogue
}) => {
  const soul = weapon.infusedSoul;
  const [showFeedDrawer, setShowFeedDrawer] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('hon_ngoc');
  const [feedAmount, setFeedAmount] = useState<number>(1);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

  const visual = soul ? SPIRIT_BEAST_VISUALS[soul.soulType] : null;

  // Lấy câu thoại hiện thời (từ hook bên ngoài hoặc fallback)
  const currentDialogue = useMemo(() => {
    if (externalDialogue?.text) {
      return externalDialogue.text;
    }
    // Thoại mặc định mở đầu nếu chưa có tương tác
    if (!soul) return '';
    const pool = soul.dialoguePool?.onIdle || [];
    return pool[0] || 'Vạn vật giai hữu linh, thần kiếm trường minh...';
  }, [externalDialogue, soul]);

  // Hiệu ứng Typewriter đánh chữ từng ký tự khi currentDialogue thay đổi
  useEffect(() => {
    if (!currentDialogue) {
      setDisplayedText('');
      return;
    }

    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
    }

    setIsTyping(true);
    let charIndex = 0;
    setDisplayedText('');

    typewriterTimerRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(currentDialogue.slice(0, charIndex));

      if (charIndex >= currentDialogue.length) {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
        }
        setIsTyping(false);
      }
    }, 28);

    return () => {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
    };
  }, [currentDialogue]);

  if (!soul || !visual) {
    return null;
  }

  // Phân tích vật phẩm nuôi dưỡng người chơi đang sở hữu
  const availableFoods = useMemo(() => {
    const list: Array<{ id: string; name: string; exp: number; owned: number; icon: string }> = [
      {
        id: 'hon_ngoc',
        name: 'Hồn Ngọc',
        exp: SPIRIT_FOOD_EXP_MAP.hon_ngoc || 100,
        owned: (player.inventory?.items || []).find((i: any) => i && (i.id === 'hon_ngoc' || i.id === 'item_hon_ngoc'))?.quantity || 0,
        icon: '💎'
      },
      {
        id: 'than_niem_sa',
        name: 'Thần Niệm Sa',
        exp: SPIRIT_FOOD_EXP_MAP.than_niem_sa || 50,
        owned: (player.inventory?.items || []).find((i: any) => i && (i.id === 'than_niem_sa' || i.id === 'item_than_niem_sa'))?.quantity || 0,
        icon: '✨'
      },
      {
        id: 'hon_thach_cuc_pham',
        name: 'Hồn Thạch Cực Phẩm',
        exp: SPIRIT_FOOD_EXP_MAP.hon_thach_cuc_pham || 500,
        owned: (player.inventory?.items || []).find((i: any) => i && i.id === 'hon_thach_cuc_pham')?.quantity || 0,
        icon: '🔮'
      },
      {
        id: 'trung_pham_linh_thach',
        name: 'Linh Thạch Trung Phẩm',
        exp: SPIRIT_FOOD_EXP_MAP.trung_pham_linh_thach || 50,
        owned: player.trungPhamLinhThach || 0,
        icon: '🔷'
      }
    ];
    return list;
  }, [player.inventory?.items, player.trungPhamLinhThach]);

  const handleCardClick = () => {
    try {
      audioEngine.playSFX('click', false, 0.4);
    } catch {}
    onInteract?.(weapon);
  };

  const handleExecuteFeed = async () => {
    if (!onFeed || isFeeding) return;
    const food = availableFoods.find(f => f.id === selectedMaterial);
    if (!food || food.owned < feedAmount) return;

    try {
      await onFeed(selectedMaterial, feedAmount);
    } catch (err) {
      console.error('Error feeding spirit:', err);
    }
  };

  // Tính tỷ lệ phần trăm thanh EXP
  const expProgress = Math.min(100, Math.floor(((soul.spiritExp || 0) / Math.max(1, soul.maxSpiritExp || 1000)) * 100));

  // Visual Class theo 3 Stage tiến hóa
  const getStageVisualClass = (stage: SpiritEvolutionStage) => {
    switch (stage) {
      case 1:
        // Stage 1: Hư ảnh bán minh mờ ảo (opacity-50 blur-[0.5px])
        return 'opacity-60 blur-[0.5px] scale-95 transition-all duration-700';
      case 2:
        // Stage 2: Chiến linh ngưng tụ sắc nét kèm hào quang thuộc tính (ring-1 ring-cyan-400)
        return 'ring-1 ring-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] scale-100 transition-all duration-700';
      case 3:
        // Stage 3: Chân thân thần thú oai phong có hiệu ứng trôi nổi hoàng kim (animate-bounce-slow drop-shadow-[0_0_15px_rgba(251,191,36,0.6)])
        return 'ring-2 ring-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.7)] animate-bounce-slow transition-all duration-700';
      default:
        return '';
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#140e2b] via-[#0d0a1c] to-[#070510] border border-purple-800/40 p-4 shadow-xl overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. HEADER KHÍ LINH: TÊN, DANH HIỆU & BẬC TIẾN HÓA */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-purple-900/40">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">✨</span>
          <div>
            <h3 className="font-serif font-bold text-sm text-purple-100 flex items-center gap-1.5 flex-wrap">
              <span>【{soul.awakenedName || visual.title}】</span>
              <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-normal border ${visual.badgeColor}`}>
                {soul.element} • {SPIRIT_PERSONALITY_NAMES[soul.personality]}
              </span>
            </h3>
            <p className="text-[10px] text-zinc-400 font-serif">
              Khí Linh Bản Thể của <span className="text-amber-300 font-semibold">{weapon.name}</span>
            </p>
          </div>
        </div>

        {/* Badge Stage */}
        <div className="text-right">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            soul.evolutionStage === 3
              ? 'bg-amber-950/70 border-amber-500/60 text-amber-300 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]'
              : soul.evolutionStage === 2
              ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 font-bold'
              : 'bg-purple-950/70 border-purple-600/50 text-purple-300'
          }`}>
            {SPIRIT_STAGE_NAMES[soul.evolutionStage]}
          </span>
        </div>
      </div>

      {/* 2. KHU VỰC THẦN LINH TƯƠNG TÁC & BONG BÓNG ĐỐI THOẠI */}
      <div className="relative z-10 my-3.5 space-y-3">
        {/* Bong bóng thoại cổ phong (Dialogue Bubble) với Typewriter Effect */}
        <div className="relative rounded-xl bg-stone-900/90 border border-amber-600/40 text-stone-200 p-3 shadow-xl backdrop-blur-sm transition-all duration-300">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-0.5 w-full">
              <div className="text-[10px] font-mono text-amber-400/90 font-bold">
                {soul.awakenedName || soul.soulName} truyền âm:
              </div>
              <p className="text-xs font-serif italic text-stone-200 leading-relaxed min-h-[36px]">
                "{displayedText}"
                {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />}
              </p>
            </div>
          </div>

          {/* Mũi nhọn tam giác hướng xuống Khí Linh */}
          <div className="absolute -bottom-2 left-10 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-stone-900/90" />
        </div>

        {/* Khí Linh Avatar trung tâm (Có thể click tương tác) */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div
            onClick={handleCardClick}
            className={`w-24 h-24 rounded-full bg-gradient-to-b from-purple-950/80 via-slate-900 to-black border-2 border-purple-500/50 flex items-center justify-center text-5xl cursor-pointer select-none transition-transform active:scale-95 group ${getStageVisualClass(
              soul.evolutionStage
            )}`}
            title="Nhấp vào để trò chuyện cùng Khí Linh"
          >
            <span className="transition-transform group-hover:scale-110">
              {visual.avatar}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 italic mt-1.5 flex items-center gap-1">
            <span>(Chạm vào Khí Linh để giao lưu thần thức)</span>
          </span>
        </div>
      </div>

      {/* 3. THANH EXP TIẾN HÓA & NÚT DƯỠNG LINH */}
      <div className="relative z-10 space-y-2.5 pt-2 border-t border-purple-900/30">
        <div>
          <div className="flex justify-between items-center text-[11px] font-mono mb-1">
            <span className="text-zinc-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Tiến Độ Nuôi Dưỡng:</span>
            </span>
            <span className="text-amber-300 font-bold">
              {soul.spiritExp.toLocaleString()} / {soul.maxSpiritExp.toLocaleString()} EXP
              <span className="text-zinc-500 ml-1">({expProgress}%)</span>
            </span>
          </div>

          {/* Thanh Bar EXP */}
          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-purple-950">
            <div
              className={`h-full transition-all duration-500 ${
                soul.evolutionStage === 3
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-300'
                  : soul.evolutionStage === 2
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-400'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-400'
              }`}
              style={{ width: `${expProgress}%` }}
            />
          </div>
        </div>

        {/* Thông tin Proc Effect đang kích hoạt */}
        <div className="p-2.5 rounded-lg bg-black/40 border border-purple-900/40 text-[11px] font-mono space-y-1">
          <div className="flex justify-between items-center text-purple-200">
            <span className="font-serif font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Thần Hiệu: {soul.currentProc.name}</span>
            </span>
            <span className="text-amber-400 font-bold">
              Tỷ lệ: {Math.round(soul.currentProc.triggerChance * 100)}%
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
            {soul.currentProc.description}
          </p>

          {/* Nếu đạt Stage 3: Hộ Chủ Thần Thông */}
          {soul.evolutionStage === 3 && soul.hasAutoGuardianUnlocked && (
            <div className="pt-1 mt-1 border-t border-amber-900/30 text-[10px] text-amber-300 flex items-center gap-1.5 font-sans">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold">
                [Hộ Chủ Thần Thông]: Khi HP &lt; 20%, miễn tử 1 lần trong trận và phản kích x1.5 sát thương!
              </span>
            </div>
          )}
        </div>

        {/* Nút bật/tắt ngăn Dâng Hiến Hồn Tinh */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowFeedDrawer(!showFeedDrawer)}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-900/70 via-indigo-900/70 to-purple-900/70 hover:from-purple-800 hover:to-indigo-800 text-purple-100 border border-purple-500/40 font-serif text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>💎 Dâng Hiến Hồn Tinh (Nuôi Dưỡng Khí Linh)</span>
            {showFeedDrawer ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>

        {/* Ngăn Dâng Hiến Vật Phẩm */}
        {showFeedDrawer && (
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-3 animate-fadeIn">
            <div className="text-[11px] font-serif text-purple-200 flex justify-between items-center">
              <span>Chọn Linh Dược / Hồn Thạch Dâng Lên:</span>
              <span className="text-[10px] text-zinc-400">Nuôi dưỡng tích lũy EXP</span>
            </div>

            {/* Danh sách vật phẩm có thể cho ăn */}
            <div className="grid grid-cols-2 gap-2">
              {availableFoods.map(food => {
                const isSelected = selectedMaterial === food.id;
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => {
                      setSelectedMaterial(food.id);
                      setFeedAmount(1);
                    }}
                    className={`p-2 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-900/60 border-purple-400 text-purple-100 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'bg-black/30 border-purple-900/30 text-zinc-300 hover:border-purple-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-serif font-bold">
                      <span className="flex items-center gap-1">
                        <span>{food.icon}</span>
                        <span>{food.name}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono mt-1 text-zinc-400">
                      <span>+{food.exp} EXP</span>
                      <span className={food.owned > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>
                        Có: {food.owned}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bộ điều khiển số lượng và nút Dâng Hiến */}
            {(() => {
              const currentFood = availableFoods.find(f => f.id === selectedMaterial);
              const maxAvailable = currentFood ? currentFood.owned : 0;
              const canFeed = maxAvailable >= feedAmount && feedAmount > 0;

              return (
                <div className="space-y-2 pt-1 border-t border-purple-900/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-mono text-[11px]">Số lượng dâng lên:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <button
                        type="button"
                        disabled={feedAmount <= 1}
                        onClick={() => setFeedAmount(prev => Math.max(1, prev - 1))}
                        className="w-6 h-6 rounded bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 disabled:opacity-30 cursor-pointer flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-amber-300 font-bold text-xs">{feedAmount}</span>
                      <button
                        type="button"
                        disabled={feedAmount >= maxAvailable}
                        onClick={() => setFeedAmount(prev => Math.min(maxAvailable, prev + 1))}
                        className="w-6 h-6 rounded bg-purple-950 border border-purple-800 text-purple-300 hover:bg-purple-900 disabled:opacity-30 cursor-pointer flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedAmount(Math.max(1, Math.min(5, maxAvailable)))}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-purple-900/60 border border-purple-700/60 text-purple-200 cursor-pointer hover:bg-purple-800"
                      >
                        5x
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedAmount(Math.max(1, maxAvailable))}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-purple-900/60 border border-purple-700/60 text-purple-200 cursor-pointer hover:bg-purple-800"
                      >
                        Tất Cả
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canFeed || isFeeding}
                    onClick={handleExecuteFeed}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:brightness-110 text-white font-serif text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.3)] disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    <span>
                      {isFeeding
                        ? 'Đang Khí Linh Hấp Thu...'
                        : canFeed
                        ? `Xác Nhận Dâng Hiến (+${((currentFood?.exp || 0) * feedAmount).toLocaleString()} EXP)`
                        : 'Không Đủ Vật Phẩm'}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
