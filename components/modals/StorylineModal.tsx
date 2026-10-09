import React, { useState, useEffect } from 'react';
import {
  Scroll,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  Swords,
  Compass,
  Award,
  Shield,
  Flame,
  Zap,
  Gift,
  HelpCircle,
  Eye
} from 'lucide-react';
import {
  PlayerStats,
  StorylineQuest,
  StorylineChoice,
  StorylineChapter,
  QuestStatus
} from '@/lib/types';
import {
  STORYLINE_CHAPTERS,
  getChapterById,
  getQuestById
} from '@/lib/storyline-data';
import { QuestProgressResult, isQuestAvailable } from '@/lib/storyline-logic';
import { TITLES_CONFIG } from '@/lib/achievements-data';

export interface StorylineModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerStats;
  activeChapterId: string;
  setActiveChapterId: (chapterId: string) => void;
  selectedQuestId: string | null;
  setSelectedQuestId: (questId: string | null) => void;
  dialogueIndex: number;
  setDialogueIndex: React.Dispatch<React.SetStateAction<number>>;
  advanceDialogue: () => void;
  onSelectChoice: (questId: string, choiceId: string) => void;
  onClaimReward: (questId: string) => void;
  getQuestProgressInfo: (quest: StorylineQuest) => QuestProgressResult;
  getQuestStatusInfo: (quest: StorylineQuest) => QuestStatus;
}

export const StorylineModal: React.FC<StorylineModalProps> = ({
  isOpen,
  onClose,
  player,
  activeChapterId,
  setActiveChapterId,
  selectedQuestId,
  setSelectedQuestId,
  dialogueIndex,
  setDialogueIndex,
  advanceDialogue,
  onSelectChoice,
  onClaimReward,
  getQuestProgressInfo,
  getQuestStatusInfo
}) => {
  if (!isOpen) return null;

  const currentChapter = getChapterById(activeChapterId) || STORYLINE_CHAPTERS[0];

  // Nếu chưa chọn quest nào, mặc định chọn quest đầu tiên của chapter hoặc quest đang active
  const activeQuest = selectedQuestId
    ? getQuestById(selectedQuestId)
    : currentChapter.quests[0];

  const questProgress = activeQuest ? getQuestProgressInfo(activeQuest) : null;
  const questStatus = activeQuest ? getQuestStatusInfo(activeQuest) : 'locked';
  const isCompleted = questStatus === 'completed';
  const savedChoiceId = activeQuest ? player.storylineState?.choiceHistory?.[activeQuest.id] : undefined;

  // Tính toán tính khả dụng tuần tự 100% của activeQuest
  const activeChapterOfQuest = activeQuest ? (getChapterById(activeQuest.chapterId) || currentChapter) : currentChapter;
  const activeQuestIndex = activeQuest ? activeChapterOfQuest.quests.findIndex(q => q.id === activeQuest.id) : -1;
  const activeQuestAvailability = activeQuest && activeQuestIndex >= 0
    ? isQuestAvailable(activeChapterOfQuest, activeQuestIndex, player)
    : { isAvailable: false, lockReason: 'Nhiệm vụ chưa mở khóa' };
  const isQuestUnlocked = isCompleted || activeQuestAvailability.isAvailable;

  // Lấy avatar & màu sắc cho người đối thoại
  const getSpeakerStyle = (speaker: string) => {
    switch (speaker) {
      case 'Đạo Hữu':
        return {
          badge: 'bg-emerald-950/80 border-emerald-600/70 text-emerald-300',
          bubble: 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100',
          icon: '🧘'
        };
      case 'Lão Giả Bí Ẩn':
      case 'Tiền Bối Khất Cái':
      case 'Chưởng Môn Trưởng Lão':
      case 'Thần Niệm Thượng Cổ':
        return {
          badge: 'bg-amber-950/80 border-amber-500/70 text-amber-300',
          bubble: 'bg-amber-950/25 border-amber-700/40 text-amber-100',
          icon: '👴'
        };
      case 'Thiên Kiêu':
        return {
          badge: 'bg-purple-950/80 border-purple-500/70 text-purple-300',
          bubble: 'bg-purple-950/25 border-purple-800/40 text-purple-100',
          icon: '👑'
        };
      case 'Yêu Lang':
        return {
          badge: 'bg-rose-950/80 border-rose-600/70 text-rose-300',
          bubble: 'bg-rose-950/25 border-rose-900/40 text-rose-100',
          icon: '🐺'
        };
      case 'Dân Làng':
      case 'Tiếp Dẫn Chấp Sự':
        return {
          badge: 'bg-zinc-900/80 border-zinc-600/70 text-zinc-300',
          bubble: 'bg-zinc-900/30 border-zinc-700/40 text-zinc-200',
          icon: '👤'
        };
      case 'Cổ Ngọc':
        return {
          badge: 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300',
          bubble: 'bg-cyan-950/25 border-cyan-800/40 text-cyan-100',
          icon: '🔮'
        };
      case 'Đan Hỏa Chi Linh':
        return {
          badge: 'bg-orange-950/80 border-orange-500/70 text-orange-300',
          bubble: 'bg-orange-950/25 border-orange-800/40 text-orange-100',
          icon: '🔥'
        };
      case 'Ma Đầu':
      case 'Ma Tôn':
        return {
          badge: 'bg-red-950/80 border-red-600/70 text-red-300',
          bubble: 'bg-red-950/25 border-red-900/40 text-red-100',
          icon: '👹'
        };
      case 'Tâm Ma Huyễn Ảnh':
        return {
          badge: 'bg-violet-950/80 border-violet-600/70 text-violet-300',
          bubble: 'bg-violet-950/25 border-violet-900/40 text-violet-100',
          icon: '🌀'
        };
      case 'Cừu Gia Tộc Trưởng':
        return {
          badge: 'bg-amber-950/80 border-yellow-700/70 text-amber-200',
          bubble: 'bg-amber-950/25 border-amber-900/40 text-amber-100',
          icon: '🧎'
        };
      case 'Cổ Trấn Lão Nhân':
        return {
          badge: 'bg-emerald-950/80 border-amber-700/70 text-emerald-200',
          bubble: 'bg-stone-950/25 border-stone-800/40 text-stone-100',
          icon: '🪵'
        };
      case 'Pháp Tướng Cự Thần':
        return {
          badge: 'bg-amber-900/90 border-yellow-400/80 text-yellow-200',
          bubble: 'bg-amber-950/40 border-yellow-500/50 text-amber-100 font-bold',
          icon: '⚡'
        };
      case 'Tinh Không Cổ Thú':
        return {
          badge: 'bg-purple-950/90 border-purple-600/80 text-purple-300',
          bubble: 'bg-purple-950/30 border-purple-800/40 text-purple-100 font-bold',
          icon: '🪐'
        };
      case 'Sứ Giả Tiên Minh':
      case 'Tiên Minh Sứ Giả':
        return {
          badge: 'bg-cyan-950/90 border-cyan-500/80 text-cyan-200',
          bubble: 'bg-cyan-950/30 border-cyan-700/40 text-cyan-100',
          icon: '🏛️'
        };
      case 'Ma Tộc Tôn Giả':
        return {
          badge: 'bg-rose-950/90 border-rose-600/80 text-rose-200',
          bubble: 'bg-rose-950/35 border-rose-900/50 text-rose-100',
          icon: '🦹'
        };
      case 'Thiên Lôi Chi Hồn':
        return {
          badge: 'bg-violet-950/90 border-indigo-500/80 text-indigo-200',
          bubble: 'bg-violet-950/35 border-indigo-600/50 text-indigo-100 font-bold',
          icon: '⚡'
        };
      case 'Thiên Đạo Chi Ý':
        return {
          badge: 'bg-white/15 border-white/70 text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]',
          bubble: 'bg-zinc-900/70 border-zinc-400/50 text-zinc-100 font-serif font-bold',
          icon: '👁️'
        };
      case 'Tiên Giới Tiếp Dẫn Sứ':
        return {
          badge: 'bg-amber-950/90 border-amber-400/80 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
          bubble: 'bg-amber-950/30 border-amber-500/40 text-amber-100 font-serif',
          icon: '⛩️'
        };
      case 'Giới Linh Hộ Đạo':
        return {
          badge: 'bg-teal-950/90 border-teal-500/80 text-teal-200',
          bubble: 'bg-teal-950/30 border-teal-700/40 text-teal-100',
          icon: '🛡️'
        };
      case 'Khí Linh Hộ Chủ':
        return {
          badge: 'bg-sky-950/90 border-sky-500/80 text-sky-200',
          bubble: 'bg-sky-950/30 border-sky-700/40 text-sky-100',
          icon: '✨'
        };
      case 'Nội Tâm':
      default:
        return {
          badge: 'bg-yellow-950/80 border-yellow-600/70 text-yellow-300',
          bubble: 'bg-yellow-950/20 border-yellow-800/30 text-yellow-100 italic',
          icon: '💭'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container cuộn tranh tiên hiệp cổ phong */}
      <div className="cophong-card cophong-corner max-w-5xl w-full h-[92vh] max-h-[860px] flex flex-col rounded-2xl border-2 border-amber-600/60 shadow-[0_0_60px_rgba(217,119,6,0.25)] relative overflow-hidden bg-[#0d0c13]">
        {/* Nẹp trục cuộn thư tịch trên cùng (Scroll Rod Header) */}
        <div className="h-2.5 bg-gradient-to-r from-amber-900 via-amber-600 to-amber-900 border-b border-amber-400/50 relative shrink-0 shadow-md">
          <div className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-amber-900/40 bg-gradient-to-r from-[#14121d] via-[#1a1624] to-[#14121d] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Scroll className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 uppercase tracking-widest">
                  Chính Tuyến Tiên Hiệp
                </span>
                <span className="text-[10px] text-amber-200/60 font-serif hidden sm:inline">
                  Vấn Đạo Phong Vân • Quyết Định Nhân Quả
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                CUỘN TRANH CỐT TRUYỆN CHƯƠNG HỒI
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-amber-200 hover:bg-amber-950/40 p-2 rounded-lg transition cursor-pointer"
            title="Khép lại cuộn tranh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter Tabs Navigation Bar */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 bg-[#0f0e16] border-b border-amber-900/30 overflow-x-auto no-scrollbar shrink-0">
          {STORYLINE_CHAPTERS.map(chapter => {
            const isSelected = chapter.id === activeChapterId;
            const completedCount = chapter.quests.filter(q =>
              player.storylineState?.completedQuestIds?.includes(q.id)
            ).length;
            const isChapterComplete = completedCount === chapter.quests.length;
            const hasActiveQuestInChapter = chapter.quests.some(
              q => player.storylineState?.activeQuestId === q.id
            );

            return (
              <button
                key={chapter.id}
                onClick={() => {
                  setActiveChapterId(chapter.id);
                  setSelectedQuestId(chapter.quests[0].id);
                  setDialogueIndex(0);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-serif whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-gradient-to-r from-amber-950/80 to-[#221a1f] text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'border-zinc-800 bg-[#12111a] text-zinc-400 hover:text-amber-300 hover:border-amber-900/50'
                }`}
              >
                <span>
                  {isChapterComplete ? (
                    <span className="text-emerald-400">✓</span>
                  ) : hasActiveQuestInChapter ? (
                    <span className="text-amber-400 animate-pulse">●</span>
                  ) : (
                    <span className="text-zinc-500">○</span>
                  )}
                </span>
                <span className="font-bold">{chapter.title.split(':')[0]}</span>
                <span className="text-[10px] font-mono text-zinc-500 hidden md:inline">
                  [{completedCount}/{chapter.quests.length}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Body: 2 Columns Layout */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* CỘT TRÁI: DANH SÁCH CÁC HỒI TRONG CHƯƠNG (4 cols) */}
          <div className="lg:col-span-4 border-r border-amber-900/30 flex flex-col bg-[#0b0a11]/90">
            {/* Banner Chương */}
            <div className={`p-3.5 border-b border-amber-900/30 bg-gradient-to-br ${currentChapter.bannerColor}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400/90 font-bold uppercase tracking-wider">
                  Chương {currentChapter.chapterNumber}
                </span>
                <span className="text-[10px] font-serif text-amber-200/60 bg-black/40 px-2 py-0.5 rounded border border-amber-900/40">
                  {currentChapter.recommendedRealm}
                </span>
              </div>
              <h3 className="text-sm font-serif font-bold text-amber-200 mt-1">
                {currentChapter.title}
              </h3>
              <p className="text-[11px] font-serif text-zinc-300/80 leading-relaxed mt-1 line-clamp-2">
                {currentChapter.description}
              </p>
            </div>

            {/* Danh Sách Quests */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
              {currentChapter.quests.map((quest, index) => {
                const isSelected = activeQuest?.id === quest.id;
                const status = getQuestStatusInfo(quest);
                const progress = getQuestProgressInfo(quest);
                const isQuestDone = status === 'completed';
                const isCurrentActive = player.storylineState?.activeQuestId === quest.id;
                const availability = isQuestAvailable(currentChapter, index, player);
                const isAvailable = isQuestDone || availability.isAvailable;
                const lockReason = availability.lockReason;

                return (
                  <div
                    key={quest.id}
                    onClick={() => {
                      setSelectedQuestId(quest.id);
                      setDialogueIndex(0);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-amber-500/80 bg-gradient-to-r from-amber-950/60 to-[#191520] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : isQuestDone
                        ? 'border-emerald-900/40 bg-emerald-950/10 hover:border-emerald-700/50'
                        : isCurrentActive
                        ? 'border-amber-600/40 bg-amber-950/20 hover:border-amber-500/50'
                        : !isAvailable
                        ? 'border-zinc-800/40 bg-[#0c0b11] opacity-50 grayscale hover:opacity-80'
                        : 'border-zinc-800/60 bg-[#111019] opacity-80 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {isQuestDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrentActive ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        ) : !isAvailable ? (
                          <Lock className="w-3.5 h-3.5 text-rose-400/80" />
                        ) : (
                          <Compass className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span className="text-[10px] font-mono font-bold text-amber-400/80">
                          Hồi {index + 1}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                          isQuestDone
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                            : isCurrentActive
                            ? 'bg-amber-950/80 text-amber-300 border-amber-600/50 animate-pulse'
                            : isAvailable
                            ? 'bg-sky-950/80 text-sky-300 border-sky-700/50'
                            : 'bg-rose-950/60 text-rose-400 border-rose-900/60'
                        }`}
                      >
                        {isQuestDone
                          ? 'Đã Xong'
                          : isCurrentActive
                          ? 'Đang Làm'
                          : isAvailable
                          ? 'Sẵn Sàng'
                          : 'Chưa Mở'}
                      </span>
                    </div>

                    <h4 className="text-xs font-serif font-bold text-zinc-200 line-clamp-1">
                      {quest.title}
                    </h4>

                    {!isAvailable && lockReason ? (
                      <div className="mt-1 text-[9px] font-serif text-rose-400/90 italic flex items-center gap-1 line-clamp-1">
                        <span>🔒</span>
                        <span className="truncate">{lockReason}</span>
                      </div>
                    ) : (
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span>Yêu cầu: Realm {quest.realmRequirement}</span>
                        <span className={progress.isCompleted ? 'text-emerald-400' : 'text-zinc-500'}>
                          {progress.isCompleted ? 'Đạt' : `${progress.progressPercent}%`}
                        </span>
                      </div>
                    )}

                    {/* Progress mini bar */}
                    <div className="w-full h-1 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          progress.isCompleted
                            ? 'bg-emerald-400'
                            : isAvailable
                            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                            : 'bg-zinc-800'
                        }`}
                        style={{ width: isAvailable ? `${progress.progressPercent}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: KHUNG ĐỌC TIỂU THUYẾT & TƯƠNG TÁC LỰA CHỌN (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#0e0d16] overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4">
            {activeQuest ? (
              <>
                {/* Header Tiêu đề Hồi & Trạng thái */}
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700/60">
                        {currentChapter.title.split(':')[0]} • Hồi {activeQuest.id.split('_')[2]}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-serif text-emerald-300 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã hoàn thành
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-xl font-serif font-bold text-amber-200 mt-1">
                      {activeQuest.title}
                    </h3>
                  </div>

                  {/* Nút Nhận Thưởng nếu Mục tiêu hoàn thành nhưng chưa nhận */}
                  {!isCompleted && isQuestUnlocked && questProgress?.isCompleted && activeQuest.objectives.type !== 'make_choice' && (
                    <button
                      onClick={() => onClaimReward(activeQuest.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-emerald-500 bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white font-serif font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition cursor-pointer animate-bounce flex items-center gap-1.5"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Lĩnh Thưởng Cốt Truyện!</span>
                    </button>
                  )}
                </div>

                {/* Banner Cảnh Báo Khóa Nếu Hồi Chưa Đủ Điều Kiện Tuần Tự */}
                {!isQuestUnlocked && (
                  <div className="p-3.5 rounded-xl border border-rose-600/70 bg-gradient-to-r from-rose-950/60 via-[#181119] to-[#120d14] text-rose-200 flex items-center gap-3 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <div className="w-8 h-8 rounded-lg bg-rose-900/60 border border-rose-500/70 flex items-center justify-center text-rose-300 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Hồi Này Chưa Thể Tiến Hành</span>
                      </div>
                      <p className="text-[11px] font-serif text-rose-200/90 mt-0.5">
                        {activeQuestAvailability.lockReason || 'Cần hoàn thành nhiệm vụ liền trước trong cốt truyện.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 1. Đoạn Văn Tự Sự Tiểu Thuyết Mở Đầu Hồi (Prologue) */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#161420] to-[#0c0b12] border border-amber-900/40 text-xs sm:text-sm font-serif leading-relaxed text-zinc-200 shadow-inner relative">
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-500/50 uppercase">
                    [Tự Sự Mở Đầu]
                  </div>
                  <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1.5 first-letter:float-left first-letter:font-serif">
                    {activeQuest.prologue}
                  </p>
                </div>

                {/* 2. Khung Đối Thoại Chương Hồi (Interactive Dialogue Box) */}
                {activeQuest.dialogues && activeQuest.dialogues.length > 0 && (
                  <div className="space-y-3 bg-[#13111b] p-4 rounded-xl border border-amber-900/30">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Khẩu Thoại Tiên Đạo
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                        <span>
                          {dialogueIndex + 1}/{activeQuest.dialogues.length}
                        </span>
                      </div>
                    </div>

                    {/* Lời thoại hiện tại */}
                    {(() => {
                      const curDialogue = activeQuest.dialogues[dialogueIndex] || activeQuest.dialogues[0];
                      const spkStyle = getSpeakerStyle(curDialogue.speaker);

                      return (
                        <div
                          onClick={advanceDialogue}
                          className={`p-3.5 rounded-xl border ${spkStyle.bubble} space-y-1.5 cursor-pointer transition hover:brightness-110 active:scale-[0.99] select-none`}
                          title="Bấm để đọc câu tiếp theo"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${spkStyle.badge}`}
                            >
                              <span>{spkStyle.icon}</span>
                              <span>{curDialogue.speaker}</span>
                            </span>
                            <span className="text-[9px] font-serif text-zinc-500">
                              (Chạm để tiếp tục)
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-serif leading-relaxed text-zinc-100 pl-1">
                            "{curDialogue.text}"
                          </p>
                        </div>
                      );
                    })()}

                    {/* Điều khiển chuyển thoại */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setDialogueIndex(prev => Math.max(0, prev - 1))}
                        disabled={dialogueIndex === 0}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-serif rounded border border-zinc-800 text-zinc-400 hover:text-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Câu trước</span>
                      </button>

                      <div className="flex gap-1">
                        {activeQuest.dialogues.map((_, i) => (
                          <div
                            key={i}
                            onClick={() => setDialogueIndex(i)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition ${
                              i === dialogueIndex ? 'bg-amber-400 scale-125' : 'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={advanceDialogue}
                        disabled={dialogueIndex >= activeQuest.dialogues.length - 1}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-serif rounded border border-amber-700/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <span>Câu tiếp</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Khung Mục Tiêu Hiện Tại */}
                <div className="p-3.5 rounded-xl bg-[#111019] border border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-serif font-bold text-amber-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" /> Mục Tiêu Đại Đạo
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        questProgress?.isCompleted ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {questProgress?.progressText}
                    </span>
                  </div>

                  <p className="text-xs font-serif text-zinc-300">
                    {activeQuest.objectives.description}
                  </p>

                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        questProgress?.isCompleted
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                      style={{ width: `${questProgress?.progressPercent ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* 4. Khung Lựa Chọn Phân Nhánh (Branching Choices) */}
                {activeQuest.choices && activeQuest.choices.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-amber-900/30 pb-1.5">
                      <span className="text-xs font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        {isCompleted
                          ? 'Quyết Định Đã Khắc Vào Mệnh Cách'
                          : 'Ngã Rẽ Vận Mệnh • Đạo Tâm Quyết Định'}
                      </span>
                      {savedChoiceId && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                          Đã chọn
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeQuest.choices.map(choice => {
                        const isChosen = savedChoiceId === choice.id;
                        const oc = choice.outcomes;

                        return (
                          <div
                            key={choice.id}
                            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                              isChosen
                                ? 'border-amber-400 bg-gradient-to-b from-amber-950/70 to-[#1e171b] shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                                : isCompleted
                                ? 'border-zinc-800 bg-[#0c0b11] opacity-60'
                                : !isQuestUnlocked
                                ? 'border-zinc-800/60 bg-[#0c0b11] opacity-50 grayscale select-none'
                                : 'border-amber-900/40 bg-[#12111b] hover:border-amber-500/70 hover:bg-[#181622] hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-serif font-bold text-amber-200">
                                  {choice.label}
                                </h5>
                                {isChosen && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-600">
                                    Đã định
                                  </span>
                                )}
                              </div>

                              {choice.description && (
                                <p className="text-[11px] font-serif text-zinc-400 leading-relaxed">
                                  {choice.description}
                                </p>
                              )}

                              {/* Hiển thị nhân quả dự kiến (Outcome Preview) */}
                              <div className="p-2 rounded-lg bg-black/40 border border-zinc-800/80 space-y-1 text-[10px] font-mono">
                                <span className="text-zinc-500 font-serif block">Nhân Quả & Thu Hoạch:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {oc.congKichChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-amber-950/60 text-amber-300 border-amber-800/50">
                                      +{oc.congKichChange} Công Kích
                                    </span>
                                  )}
                                  {oc.phongNguChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-sky-950/60 text-sky-300 border-sky-800/50">
                                      +{oc.phongNguChange} Phòng Ngự
                                    </span>
                                  )}
                                  {oc.canCotChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-emerald-950/60 text-emerald-300 border-emerald-800/50">
                                      +{oc.canCotChange} Căn Cốt
                                    </span>
                                  )}
                                  {oc.ngoTinhChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-indigo-950/60 text-indigo-300 border-indigo-800/50">
                                      +{oc.ngoTinhChange} Ngộ Tính
                                    </span>
                                  )}
                                  {oc.thanThucChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-purple-950/60 text-purple-300 border-purple-800/50">
                                      +{oc.thanThucChange} Thần Thức
                                    </span>
                                  )}
                                  {oc.critRateChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-rose-950/60 text-rose-300 border-rose-800/50">
                                      +{oc.critRateChange}% Bạo Kích
                                    </span>
                                  )}
                                  {oc.critDmgChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-rose-950/60 text-rose-300 border-rose-800/50">
                                      +{oc.critDmgChange}% ST Bạo
                                    </span>
                                  )}
                                  {oc.hpPercentChange !== undefined && (
                                    <span
                                      className={`px-1.5 py-0.5 rounded border ${
                                        oc.hpPercentChange > 0
                                          ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                          : 'bg-red-950/70 text-red-400 border-red-800/60'
                                      }`}
                                    >
                                      {oc.hpPercentChange > 0 ? '+' : ''}
                                      {oc.hpPercentChange}% Khí Huyết
                                    </span>
                                  )}
                                  {oc.dmgReductionChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-sky-950/60 text-sky-300 border-sky-800/50">
                                      +{oc.dmgReductionChange}% Miễn Thương
                                    </span>
                                  )}
                                  {oc.maTinhChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-rose-950/60 text-rose-300 border-rose-800/50">
                                      +{oc.maTinhChange}% Ma Tính
                                    </span>
                                  )}
                                  {oc.danhVongChange !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded border bg-amber-950/60 text-amber-300 border-amber-800/50">
                                      +{oc.danhVongChange} Danh Vọng
                                    </span>
                                  )}
                                  {oc.khiVanChange !== undefined && (
                                    <span
                                      className={`px-1.5 py-0.5 rounded border ${
                                        oc.khiVanChange > 0
                                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                                          : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                      }`}
                                    >
                                      {oc.khiVanChange > 0 ? '+' : ''}
                                      {oc.khiVanChange} Khí Vận
                                    </span>
                                  )}
                                  {oc.tamCanhChange !== undefined && (
                                    <span
                                      className={`px-1.5 py-0.5 rounded border ${
                                        oc.tamCanhChange > 0
                                          ? 'bg-sky-950/60 text-sky-300 border-sky-800/50'
                                          : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                      }`}
                                    >
                                      {oc.tamCanhChange > 0 ? '+' : ''}
                                      {oc.tamCanhChange} Tâm Cảnh
                                    </span>
                                  )}
                                  {oc.rewardTuVi !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                                      +{oc.rewardTuVi.toLocaleString()} Tu Vi
                                    </span>
                                  )}
                                  {oc.rewardLinhThach !== undefined && (
                                    <span className="px-1.5 py-0.5 rounded bg-yellow-950/60 text-yellow-300 border border-yellow-800/50">
                                      +{oc.rewardLinhThach.toLocaleString()} Linh Thạch
                                    </span>
                                  )}
                                  {oc.rewardItems && oc.rewardItems.length > 0 && oc.rewardItems.map((item, i) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-600/60">
                                      🎁 {item.name}
                                    </span>
                                  ))}
                                  {oc.rewardTitleId && (
                                    <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
                                      👑 {TITLES_CONFIG[oc.rewardTitleId]?.name ? `[${TITLES_CONFIG[oc.rewardTitleId].name}]` : 'Danh hiệu độc quyền'}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Nếu đã chọn trước đó thì hiển thị phản hồi */}
                              {isChosen && (
                                <div className="p-2 rounded bg-amber-950/30 border border-amber-800/30 text-[11px] font-serif text-amber-200 italic">
                                  "{oc.dialogue}"
                                </div>
                              )}
                            </div>

                            {/* Nút Quyết Định */}
                            {!isCompleted && (
                              isQuestUnlocked ? (
                                <button
                                  onClick={() => onSelectChoice(activeQuest.id, choice.id)}
                                  className="w-full mt-3 py-1.5 px-3 rounded-lg border border-amber-500 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-serif font-bold text-xs transition cursor-pointer shadow-md hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                                >
                                  Đạo Tâm Quyết Định: Chọn Hướng Này
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="w-full mt-3 py-1.5 px-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 text-zinc-500 font-serif font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
                                  title={activeQuestAvailability.lockReason}
                                >
                                  <Lock className="w-3.5 h-3.5 text-zinc-600" />
                                  <span>Chưa Mở Khóa ({activeQuestAvailability.lockReason})</span>
                                </button>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. Lời Kết Khi Hoàn Thành Nhiệm Vụ (Epilogue) */}
                {isCompleted && activeQuest.epilogueOnComplete && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/20 via-amber-950/20 to-emerald-950/20 border border-emerald-800/40 text-xs font-serif text-emerald-200/90 italic text-center">
                    📜 "{activeQuest.epilogueOnComplete}"
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 font-serif space-y-2">
                <Scroll className="w-8 h-8 text-zinc-600" />
                <p>Hãy chọn một Hồi cốt truyện bên trái để mở ra bí sử...</p>
              </div>
            )}
          </div>
        </div>

        {/* Nẹp trục cuộn thư tịch dưới cùng (Scroll Rod Footer) */}
        <div className="h-2.5 bg-gradient-to-r from-amber-900 via-amber-600 to-amber-900 border-t border-amber-400/50 relative shrink-0 shadow-md">
          <div className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </div>
      </div>
    </div>
  );
};
