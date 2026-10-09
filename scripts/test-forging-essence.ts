// scripts/test-forging-essence.ts
// Comprehensive unit & behavioral test for Forging Essence Applications:
// 1. Natal Artifact Essence Ascension
// 2. Essence Divine Reforging

import { createNewPlayer } from '../lib/game-logic/character';
import { normalizePlayerData } from '../lib/save-migration';
import {
  NATAL_ASCENSION_COSTS,
  canAscendNatalWithEssence,
  ascendNatalWithEssence,
  bindEquipmentAsNatal,
  calculateNatalCombatBonus
} from '../lib/natal-artifact-logic';
import {
  calculateEssenceReforgeCost,
  reforgeEquipmentWithEssence
} from '../lib/forging-logic';
import { PlayerStats, Equipment } from '../lib/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

console.log('=== TEST SUITE: Forging Essence Ascension & Divine Reforging ===\n');

// Mock a high quality equipment to bind as Natal
const mockWeapon: Equipment = {
  id: 'equip_tru_tien_kiem',
  name: 'Tru Tiên Cổ Kiếm',
  slot: 'weapon',
  grade: 'Tiên Thiên Linh Bảo',
  quality: 'tien_pham',
  powerBonus: 1000,
  enhancement: 0,
  atkBonus: 500,
  hpBonus: 1000,
  mpBonus: 500,
  speedBonus: 50,
  critRateBonus: 10,
  critDmgBonus: 30,
  maxSockets: 2,
  sockets: [
    { slotIndex: 0, unlocked: true, gem: null },
    { slotIndex: 1, unlocked: false, gem: null }
  ],
  affixes: [
    {
      id: 'affix_lock_1',
      name: 'Sát Lực Bá Đạo',
      statKey: 'congKichPercent',
      value: 20,
      rarity: 'kim',
      isLocked: true
    },
    {
      id: 'affix_free_2',
      name: 'Kiên Bích Như Sơn',
      statKey: 'phongNguPercent',
      value: 5,
      rarity: 'luc',
      isLocked: false
    }
  ]
};

// -------------------------------------------------------------
// Test 1: Ascension Cost Calculations (Tier 1 -> 2 and up to Tier 9)
// -------------------------------------------------------------
console.log('--- Test 1: Ascension Cost Calculation (Tier 2 -> 9) ---');
assert(NATAL_ASCENSION_COSTS[2].requiredEssence === 150, 'Tier 2 requires 150 Forging Essence');
assert(NATAL_ASCENSION_COSTS[2].requiredRealmIndex === 11, 'Tier 2 requires Realm 11 (Trúc Cơ)');
assert(NATAL_ASCENSION_COSTS[2].statMultiplierBonus === 0.15, 'Tier 2 grants +15% stat boost');

assert(NATAL_ASCENSION_COSTS[3].requiredEssence === 450, 'Tier 3 requires 450 Forging Essence');
assert(NATAL_ASCENSION_COSTS[3].requiredRealmIndex === 16, 'Tier 3 requires Realm 16 (Kim Đan)');
assert(NATAL_ASCENSION_COSTS[3].maxSocketsUnlock === 3, 'Tier 3 unlocks socket slot 3');

assert(NATAL_ASCENSION_COSTS[4].requiredEssence === 1200, 'Tier 4 requires 1,200 Forging Essence');
assert(NATAL_ASCENSION_COSTS[4].maxSocketsUnlock === 4, 'Tier 4 unlocks socket slot 4');

assert(NATAL_ASCENSION_COSTS[9].requiredEssence === 120000, 'Tier 9 requires 120,000 Forging Essence');
assert(NATAL_ASCENSION_COSTS[9].requiredRealmIndex === 46, 'Tier 9 requires Realm 46 (Độ Kiếp)');
assert(NATAL_ASCENSION_COSTS[9].statMultiplierBonus === 0.30, 'Tier 9 grants +30% stat boost');

// Prepare player with Natal Artifact at Realm 11 (Trúc Cơ)
const basePlayer = createNewPlayer();
basePlayer.currentRealm = 11;
basePlayer.trungPhamLinhThach = 50;
basePlayer.thanThuc = 100;

const bindRes = bindEquipmentAsNatal(basePlayer, mockWeapon);
assert(bindRes.success, 'Mock equipment successfully bound as Natal Artifact');
const boundPlayer = bindRes.updatedPlayer;
assert(boundPlayer.natalArtifact !== null, 'Player has natalArtifact');
assert(boundPlayer.natalArtifact?.tier === 1, 'Initial Natal Artifact is Tier 1');

// -------------------------------------------------------------
// Test 2: Realm Gating Guard for Natal Ascension
// -------------------------------------------------------------
console.log('\n--- Test 2: Realm Gating Guard ---');
// Try ascending Tier 2 -> 3 while player is only Realm 11 (requires Realm 16 - Kim Đan)
const playerTier2: PlayerStats = normalizePlayerData(boundPlayer);
playerTier2.currentRealm = 11; // Still Trúc Cơ
playerTier2.natalArtifact = {
  ...playerTier2.natalArtifact!,
  tier: 2
};
playerTier2.inventory!.forgingEssence = 1000; // Has plenty of essence

const reqRealmGate = canAscendNatalWithEssence(playerTier2);
assert(!reqRealmGate.canAscend, 'Ascension blocked when realm requirement is unmet');
assert(!reqRealmGate.isRealmQualified, 'isRealmQualified must be false');
assert(
  Boolean(reqRealmGate.reason?.includes('🔒 Cần đạt [Kim Đan Kỳ]')),
  `Reason indicates required realm: "${reqRealmGate.reason}"`
);

const failedAscension = ascendNatalWithEssence(playerTier2);
assert(!failedAscension.success, 'ascendNatalWithEssence returns success: false on unmet realm');

// -------------------------------------------------------------
// Test 3: Successful Ascension & Stat Multipliers
// -------------------------------------------------------------
console.log('\n--- Test 3: Successful Ascension & Stat Boost ---');
// Player reaches Realm 11, has 200 Essence (needs 150 for Tier 1 -> 2)
const playerReadyToAscend: PlayerStats = normalizePlayerData(boundPlayer);
playerReadyToAscend.currentRealm = 11;
playerReadyToAscend.inventory!.forgingEssence = 200;

const initialAtkBonus = playerReadyToAscend.natalArtifact?.statsBonus.atk || 0;
const initialSpiritExp = playerReadyToAscend.natalArtifact?.spirit?.exp || 0;

const ascendRes = ascendNatalWithEssence(playerReadyToAscend);
assert(ascendRes.success, 'Ascension from Tier 1 to Tier 2 succeeded');

const ascendedPlayer = ascendRes.updatedPlayer;
assert(ascendedPlayer.inventory?.forgingEssence === 50, 'Forging Essence accurately deducted (200 - 150 = 50)');
assert(ascendedPlayer.natalArtifact?.tier === 2, 'Natal Artifact is now Tier 2');

const newAtkBonus = ascendedPlayer.natalArtifact?.statsBonus.atk || 0;
assert(newAtkBonus > initialAtkBonus, `Atk bonus increased from ${initialAtkBonus} to ${newAtkBonus}`);

const newSpiritExp = ascendedPlayer.natalArtifact?.spirit?.exp || 0;
assert(newSpiritExp === initialSpiritExp + 200, 'Spirit gained +200 EXP from Tier 2 ascension');

// Verify combat bonus immediately recognizes updated stats
const combatBonus = calculateNatalCombatBonus(ascendedPlayer);
assert(combatBonus.atkBonus > 0, `Combat bonus reflects ascended stats (+${combatBonus.atkBonus} ATK)`);

// -------------------------------------------------------------
// Test 4: Insufficient Essence Guard
// -------------------------------------------------------------
console.log('\n--- Test 4: Insufficient Essence Guard ---');
const brokePlayer: PlayerStats = normalizePlayerData(boundPlayer);
brokePlayer.currentRealm = 11;
brokePlayer.inventory!.forgingEssence = 50; // Needs 150

const brokeCheck = canAscendNatalWithEssence(brokePlayer);
assert(!brokeCheck.canAscend, 'Ascension blocked due to insufficient essence');
assert(!brokeCheck.hasEnoughEssence, 'hasEnoughEssence must be false');
assert(Boolean(brokeCheck.reason?.includes('Thiếu 100 Tinh Hoa Rèn Đúc')), `Clear reason: "${brokeCheck.reason}"`);

const brokeExecution = ascendNatalWithEssence(brokePlayer);
assert(!brokeExecution.success, 'Execution blocked when essence is insufficient');
assert(brokePlayer.inventory?.forgingEssence === 50, 'Essence not deducted on failure');

// -------------------------------------------------------------
// Test 5: Essence Divine Reforging (Affix Lock & High-Grade Guarantee)
// -------------------------------------------------------------
console.log('\n--- Test 5: Essence Divine Reforging ---');
const equipToReforge: Equipment = { ...mockWeapon };
const lockedAffix = equipToReforge.affixes!.find(a => a.isLocked)!;
const initialLockedStatKey = lockedAffix.statKey;
const initialLockedValue = lockedAffix.value;

// Essence cost check for Tiên Thiên Linh Bảo (500 base + 200 for 1 locked affix = 700)
const calculatedCost = calculateEssenceReforgeCost(equipToReforge, 1);
assert(calculatedCost === 700, `Calculated essence reforge cost is 700 (got ${calculatedCost})`);

const playerWithEssence: PlayerStats = normalizePlayerData(basePlayer);
playerWithEssence.currentRealm = 55; // Tiên Giới / Tiên Nhân to reforge Tiên Thiên Linh Bảo
playerWithEssence.linhThach = 100000;
playerWithEssence.inventory!.forgingEssence = 1000;
playerWithEssence.inventory!.ores = [];
playerWithEssence.equipment = {
  ...playerWithEssence.equipment,
  weapon: equipToReforge
};

const reforgeRes = reforgeEquipmentWithEssence(equipToReforge, playerWithEssence);
assert(reforgeRes.success, 'Essence divine reforge succeeded');

const reforgedEquip = reforgeRes.updatedEquip!;
const preservedAffix = reforgedEquip.affixes!.find(a => a.id === lockedAffix.id);
assert(Boolean(preservedAffix), 'Locked affix preserved');
assert(preservedAffix?.statKey === initialLockedStatKey, 'Locked affix statKey 100% preserved');
assert(preservedAffix?.value === initialLockedValue, 'Locked affix value 100% preserved');
assert(preservedAffix?.isLocked === true, 'Locked state preserved');

// Check that at least 1 non-locked affix rolled >= tim (tim, kim, or than)
const nonLockedAffixes = reforgedEquip.affixes!.filter(a => a.id !== lockedAffix.id);
const hasHighGrade = nonLockedAffixes.some(a => a.rarity === 'tim' || a.rarity === 'kim' || a.rarity === 'than');
assert(hasHighGrade, `At least 1 re-rolled affix has high grade (rarities: ${nonLockedAffixes.map(a => a.rarity).join(', ')})`);

// -------------------------------------------------------------
// Test 6: Zero Linh Thạch & Zero Ore Consumed with Essence Reforge
// -------------------------------------------------------------
console.log('\n--- Test 6: Zero Linh Thach & Ore Consumption ---');
const playerBeforeReforge = playerWithEssence.linhThach;
const playerAfterReforge = reforgeRes.updatedPlayer.linhThach;
assert(
  playerBeforeReforge === playerAfterReforge,
  `Linh Thạch untouched: ${playerBeforeReforge} === ${playerAfterReforge}`
);
assert(
  reforgeRes.updatedPlayer.inventory?.forgingEssence === 300,
  `Forging essence deducted accurately (1000 - 700 = 300, got ${reforgeRes.updatedPlayer.inventory?.forgingEssence})`
);

console.log('\n=== ALL 6 FORGING ESSENCE TESTS PASSED SUCCESSFULLY! ===');
