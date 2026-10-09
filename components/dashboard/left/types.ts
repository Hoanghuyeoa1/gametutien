// components/dashboard/left/types.ts
import { PlayerStats, Manual } from '@/lib/types';

export type TabType = 'trials' | 'events' | 'manuals' | 'alchemy' | 'forging' | 'sect' | 'merchant' | 'inventory' | 'companions' | 'daolu' | 'beasts';

export interface FateTierInfo {
  tier: string;
  label: string;
  color: string;
  badgeClass: string;
  barClass: string;
  glowClass: string;
}

export function getFateTierInfo(khiVan: number = 50): FateTierInfo {
  if (khiVan >= 300) {
    return {
      tier: 'hon_don',
      label: 'Hỗn Độn Chí Tôn',
      color: 'text-amber-300',
      badgeClass: 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-yellow-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
      barClass: 'bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-300 animate-pulse',
      glowClass: 'shadow-[0_0_12px_rgba(251,191,36,0.8)]'
    };
  }
  if (khiVan >= 200) {
    return {
      tier: 'van_co',
      label: 'Vạn Cổ Độc Tôn',
      color: 'text-yellow-400',
      badgeClass: 'bg-amber-950/70 border-amber-400 text-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.4)]',
      barClass: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-orange-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
      glowClass: 'shadow-[0_0_10px_rgba(250,204,21,0.6)]'
    };
  }
  if (khiVan >= 150) {
    return {
      tier: 'nghich_thien',
      label: 'Nghịch Thiên Chi Mệnh',
      color: 'text-orange-400',
      badgeClass: 'bg-orange-950/70 border-orange-400 text-orange-300 shadow-[0_0_6px_rgba(251,146,60,0.3)]',
      barClass: 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_6px_rgba(251,146,60,0.5)]',
      glowClass: 'shadow-[0_0_8px_rgba(251,146,60,0.5)]'
    };
  }
  if (khiVan >= 120) {
    return {
      tier: 'cai_the',
      label: 'Khí Vận Cái Thế',
      color: 'text-amber-400',
      badgeClass: 'bg-amber-950/60 border-amber-500/60 text-amber-300',
      barClass: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]',
      glowClass: 'shadow-[0_0_6px_rgba(245,158,11,0.4)]'
    };
  }
  if (khiVan >= 90) {
    return {
      tier: 'thien_menh',
      label: 'Thiên Mệnh Chi Tử',
      color: 'text-yellow-400',
      badgeClass: 'bg-yellow-950/50 border-yellow-500/50 text-yellow-300',
      barClass: 'bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.3)]',
      glowClass: 'shadow-[0_0_4px_rgba(245,158,11,0.3)]'
    };
  }
  if (khiVan >= 70) {
    return {
      tier: 'phuc_duyen',
      label: 'Phúc Duyên Thâm Hậu',
      color: 'text-amber-300',
      badgeClass: 'bg-amber-950/40 border-amber-600/40 text-amber-300',
      barClass: 'bg-amber-500',
      glowClass: ''
    };
  }
  if (khiVan >= 50) {
    return {
      tier: 'hanh_thong',
      label: 'Khí Vận Hanh Thông',
      color: 'text-emerald-400',
      badgeClass: 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300',
      barClass: 'bg-emerald-500',
      glowClass: ''
    };
  }
  if (khiVan >= 30) {
    return {
      tier: 'binh_thuong',
      label: 'Bình Thường Chi Mệnh',
      color: 'text-zinc-400',
      badgeClass: 'bg-zinc-900 border-zinc-700 text-zinc-400',
      barClass: 'bg-zinc-500',
      glowClass: ''
    };
  }
  return {
    tier: 'menh_bac',
    label: 'Mệnh Bạc Như Chỉ',
    color: 'text-zinc-500',
    badgeClass: 'bg-zinc-900/60 border-zinc-800 text-zinc-500',
    barClass: 'bg-zinc-600',
    glowClass: ''
  };
}
