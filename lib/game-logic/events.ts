// lib/game-logic/events.ts
import {
  PlayerStats,
  RandomEvent,
  EventOutcome
} from '@/lib/types';
import { calculateEventChance, GAME_CONSTANTS } from '@/lib/game-constants';
import { getSoulCultivationStats } from '@/lib/body-soul-data';

// RANDOM EVENT HANDLING
// ============================================

export function triggerRandomEvent(
  event: RandomEvent,
  player: PlayerStats
): RandomEvent {
  // Giữ nguyên toàn bộ lựa chọn để giao diện Modal có thể hiển thị điều kiện và nút bị mờ khi thiếu chỉ số
  return {
    ...event,
    choices: event.choices || []
  };
}

export function resolveEventChoice(
  choice: any,
  player: PlayerStats
): EventOutcome {
  const khiVanModifier = (player.khiVan - 50) / 100;
  // Thần Thức từ Thần Hồn (Hồn Tu) giúp nhìn thấu cơ quan cạm bẫy, hướng tới kết quả mỹ mãn
  const soulStats = getSoulCultivationStats(player.soulCultivation);
  const secretRealmBonus = (soulStats.secretRealmBonusPercent || 0) * 0.4;

  let roll = Math.random() * 100 + (khiVanModifier * 20) + secretRealmBonus;
  roll = Math.max(0, Math.min(100, roll));
  
  let cumulative = 0;
  for (const outcome of choice.outcomes) {
    cumulative += outcome.probability;
    if (roll <= cumulative) {
      return outcome;
    }
  }
  
  return choice.outcomes[choice.outcomes.length - 1];
}

export function slugifyItem(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

