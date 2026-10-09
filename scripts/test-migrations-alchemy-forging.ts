// scripts/test-migrations-alchemy-forging.ts
// Test kiểm chứng toàn diện cho 2 module di trú: migrate-alchemy.ts và migrate-forging.ts

import {
  migratePillMutationsData,
  migratePillVeinsData,
  migratePillVeinData,
  migrateHeavenlyFlameData,
  migrateAlchemyTacticsData,
  migratePillTribulationData,
  migrateToxicityFormulaUpdate,
  normalizeAlchemyState
} from '../lib/migrations/migrate-alchemy';

import {
  migrateModularForgingData,
  migrateFormationInscriptionData,
  migrateLegacyTemperingData,
  migrateSoulInfusionData,
  migrateWeaponTribulationArrayData,
  normalizeForgingState
} from '../lib/migrations/migrate-forging';

import { createDefaultPlayerState } from '../lib/migrations/migrate-player-core';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('=== TEST 1: TEST ĐAN ĐẠO (ALCHEMY MIGRATIONS) ===');

// Mock legacy player với dữ liệu thô
const legacyAlchemyPlayer: any = {
  name: 'Tiêu Viêm',
  consumedMutations: {
    expRate: 9999, // Should be clamped to 20
    pillQuality: 5.556
  },
  inventory: {
    pills: [
      { id: 'truc_co_dan', name: 'Trúc Cơ Đan', quantity: 2 }, // Missing veinMetadata
      {
        id: 'cuu_chuyen_dan',
        name: 'Cửu Chuyển Hoàn Hồn Đan',
        quantity: 1,
        veinMetadata: { veinCount: 9, veinMultiplier: 3.0, toxicityMultiplier: 0.1 }
      }
    ]
  },
  flameState: {
    unlockedFlames: {
      flame_thanh_lien: {
        tier: 3,
        currentExp: 10000, // Should be clamped to tier * 250 = 750
        unlockedAuraIds: ['aura_thanh_lien_1']
      },
      fake_flame_ghost: {
        tier: 10 // Invalid flame ID, should be filtered out
      }
    },
    equippedFlameId: 'flame_thanh_lien'
  }
};

// 1.1 Test migratePillMutationsData
const mutPlayer = migratePillMutationsData(legacyAlchemyPlayer);
assert(mutPlayer.consumedMutations.expRate <= 20, 'consumedMutations.expRate clamped to max cap');
assert(mutPlayer.consumedMutations.pillQuality === 5.56, 'consumedMutations.pillQuality rounded to 2 decimals');

// 1.2 Test migratePillVeinsData
const veinPlayer = migratePillVeinsData(legacyAlchemyPlayer);
assert(veinPlayer.inventory.pills[0].veinMetadata.veinCount === 0, 'veinMetadata initialized with veinCount 0');
assert(veinPlayer.inventory.pills[0].isMutated === false, 'isMutated initialized to false');
assert(veinPlayer.inventory.pills[1].veinMetadata.veinCount === 9, 'Existing veinMetadata preserved');

// 1.3 Test migrateHeavenlyFlameData
const flamePlayer = migrateHeavenlyFlameData(legacyAlchemyPlayer);
assert(flamePlayer.flameState.unlockedFlames.flame_thanh_lien !== undefined, 'Valid flame preserved');
assert(flamePlayer.flameState.unlockedFlames.flame_thanh_lien.currentExp === 750, 'Flame currentExp clamped to maxExp');
assert(flamePlayer.flameState.unlockedFlames.fake_flame_ghost === undefined, 'Ghost flame filtered out');

// 1.4 Test migrateAlchemyTacticsData
const tacticsPlayer = migrateAlchemyTacticsData({});
assert(tacticsPlayer.alchemyTacticsState.defaultStance === 'van_vu_song_hanh', 'Default alchemy tactics stance set');

// 1.5 Test migratePillTribulationData
const tribPlayer = migratePillTribulationData({});
assert(tribPlayer.pillTribulationState.totalTribulationsFaced === 0, 'Pill tribulation state initialized');

// 1.6 Test migrateToxicityFormulaUpdate
const toxPlayer = migrateToxicityFormulaUpdate(veinPlayer);
// 9-vein pill must have 0% toxicity
const nineVeinPill = toxPlayer.inventory.pills[1];
assert(nineVeinPill.toxicityMultiplier === 0, '9-vein pill toxicityMultiplier is 0.00');

// 1.7 Test normalizeAlchemyState & Idempotency
const normalizedAlchemy1 = normalizeAlchemyState(legacyAlchemyPlayer);
const normalizedAlchemy2 = normalizeAlchemyState(normalizedAlchemy1);
assert(
  JSON.stringify(normalizedAlchemy1) === JSON.stringify(normalizedAlchemy2),
  'normalizeAlchemyState is 100% idempotent'
);

console.log('\n=== TEST 2: TEST KHÍ ĐẠO (FORGING MIGRATIONS) ===');

const legacyForgingPlayer: any = {
  name: 'Âu Dã Tử',
  equipment: {
    weapon: { id: 'thanh_suong_kiem', name: 'Thanh Sương Kiếm', slot: 'weapon' },
    armor: { id: 'huyen_thiet_giap', name: 'Huyền Thiết Giáp', slot: 'armor' }
  },
  inventory: {
    equipment: [
      { id: 'tram_long_dao', name: 'Trảm Long Đao', type: 'weapon' }
    ]
  }
};

// 2.1 Test migrateModularForgingData
const metalPlayer = migrateModularForgingData(legacyForgingPlayer);
assert(metalPlayer.modularMetallurgyState.craftedWeaponsCount === 0, 'modularMetallurgyState initialized');
assert(metalPlayer.equipment.weapon.alloyMetadata === null, 'Equipment weapon alloyMetadata set to null');
assert(metalPlayer.inventory.equipment[0].alloyMetadata === null, 'Inventory weapon alloyMetadata set to null');

// 2.2 Test migrateFormationInscriptionData
const inscriptPlayer = migrateFormationInscriptionData(legacyForgingPlayer);
assert(inscriptPlayer.inscriptionState.cleansingWaterCount === 5, 'cleansingWaterCount default is 5');
assert(inscriptPlayer.equipment.weapon.inscriptionData !== undefined, 'Weapon given inscriptionData');
assert(inscriptPlayer.equipment.weapon.inscriptionData.conduits.length === 2, 'Weapon has 2 conduits');
assert(inscriptPlayer.equipment.armor.inscriptionData === undefined, 'Armor not given weapon inscriptionData');

// 2.3 Test migrateLegacyTemperingData
const temperPlayer = migrateLegacyTemperingData(legacyForgingPlayer);
assert(temperPlayer.legacyTemperingState.totalReforgesPerformed === 0, 'legacyTemperingState initialized');
assert(temperPlayer.equipment.weapon.bloodBondData === null, 'Weapon bloodBondData set to null');
assert(temperPlayer.equipment.weapon.reforgeCount === 0, 'Weapon reforgeCount set to 0');

// 2.4 Test migrateSoulInfusionData
const soulPlayer = migrateSoulInfusionData(legacyForgingPlayer);
assert(soulPlayer.soulInfusionState.highestStageReached === 1, 'soulInfusionState highestStageReached is 1');
assert(soulPlayer.equipment.weapon.infusedSoul === null, 'Weapon infusedSoul set to null');

// 2.5 Test migrateWeaponTribulationArrayData
const arrayPlayer = migrateWeaponTribulationArrayData(legacyForgingPlayer);
assert(arrayPlayer.formationSetsState.equippedArraySetId === null, 'formationSetsState initialized');
assert(arrayPlayer.equipment.weapon.lightningTempering === null, 'Weapon lightningTempering set to null');

// 2.6 Test normalizeForgingState & Idempotency
const normalizedForging1 = normalizeForgingState(legacyForgingPlayer);
const normalizedForging2 = normalizeForgingState(normalizedForging1);
assert(
  JSON.stringify(normalizedForging1) === JSON.stringify(normalizedForging2),
  'normalizeForgingState is 100% idempotent'
);

console.log('\n=== ALL MIGRATION TESTS PASSED SUCCESSFULLY! ===');
