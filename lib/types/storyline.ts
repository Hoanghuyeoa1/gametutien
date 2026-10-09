// lib/types/storyline.ts

export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | string;

export interface StorylineDialogue {
  speaker: string;
  text: string;
  [key: string]: any;
}

export interface StorylineObjective {
  type: string;
  description: string;
  targetId?: number;
  targetCount?: number;
  [key: string]: any;
}

export interface StorylineChoice {
  id: string;
  label?: string;
  text?: string;
  description?: string;
  dialogue?: string;
  requirements?: {
    realmIndex?: number;
    canCot?: number;
    ngoTinh?: number;
    khiVan?: number;
    tamCanh?: number;
    linhThach?: number;
    [key: string]: any;
  };
  outcomes: {
    tamCanhChange?: number;
    khiVanChange?: number;
    tuViReward?: number;
    rewardTuVi?: number;
    linhThachReward?: number;
    rewardLinhThach?: number;
    flavorText?: string;
    dialogue?: string;
    label?: string;
    rewardTitleId?: string;
    congKichChange?: number;
    phongNguChange?: number;
    canCotChange?: number;
    ngoTinhChange?: number;
    thanThucChange?: number;
    critRateChange?: number;
    critDmgChange?: number;
    dmgReductionChange?: number;
    hpPercentChange?: number;
    danhVongChange?: number;
    maTinhChange?: number;
    itemRewards?: { type?: string; id?: string; quantity?: number; quality?: string; grade?: string; name?: string; description?: string; maxSlots?: number; [key: string]: any; }[];
    rewardItems?: { type?: string; id?: string; quantity?: number; quality?: string; grade?: string; name?: string; description?: string; maxSlots?: number; [key: string]: any; }[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface StorylineQuest {
  id: string;
  chapterId: string;
  title: string;
  realmRequirement: number;
  prologue: string;
  dialogues: StorylineDialogue[];
  dialogue?: string[] | StorylineDialogue[];
  objectives: StorylineObjective;
  choices?: StorylineChoice[];
  epilogueOnComplete?: string;
  isCompleted?: boolean;
  [key: string]: any;
}

export interface StorylineChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  recommendedRealm?: string;
  bannerColor?: string;
  quests: StorylineQuest[];
  [key: string]: any;
}

export interface StorylineState {
  currentChapterId?: string;
  currentChapter?: number | string;
  activeQuestId?: string | null;
  completedQuestIds: string[];
  choiceHistory?: Record<string, string>;
  [key: string]: any;
}
