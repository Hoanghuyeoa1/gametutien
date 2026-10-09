// ============================================
// TU TIÊN GAME - GAME LOGIC (Barrel Exporter)
// ============================================

export * from './game-logic/index';

export {
  getMaxStatLimit,
  calculateEffectiveRequiredTuVi,
  getStatCapDescription,
  ATTRIBUTE_MILESTONE_PERKS,
  hasMilestonePerk,
  getActiveMilestonePerks,
  isMajorBreakthroughRealm
} from '@/lib/attribute-perks';

export {
  addItemToInventory,
  getMaxInventoryCapacity,
  getCurrentInventoryOccupiedSlots,
  isInventoryFull,
  getInventoryUsedSlots,
  canReceiveItem,
  canAddItemToInventory
} from '@/lib/inventory-data';
export type { AddItemResult } from '@/lib/inventory-data';
