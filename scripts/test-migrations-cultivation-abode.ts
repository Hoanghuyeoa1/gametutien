// scripts/test-migrations-cultivation-abode.ts
// Test kiểm chứng toàn diện cho 2 module di trú: migrate-cultivation.ts và migrate-abode-social.ts

import {
  migrateRealmsProgressData,
  migrateSeclusionEnhancementData,
  migrateBreakthroughCatalystData,
  migrateBreakthroughBacklashData,
  migrateDaoFoundationData,
  normalizeCultivationState
} from '../lib/migrations/migrate-cultivation';

import {
  migrateDestinyTalentsData,
  migrateAbodeData,
  migrateHerbalGardenData,
  migrateCompanionsData,
  migrateSectData,
  normalizeAbodeState
} from '../lib/migrations/migrate-abode-social';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('=== TEST 1: TEST TU LUYỆN & CẢNH GIỚI (CULTIVATION MIGRATIONS) ===');

const legacyCultivationPlayer: any = {
  name: 'Hàn Lập',
  currentRealm: 16, // Kim Đan Sơ Kỳ
  exp: 5000,
  tuViEmpowermentState: {
    unlockedAcupointIds: ['acupoint_1'],
    totalTuViInfusedToCompanions: 1200
  },
  achievementsState: {
    claimedAchievementIds: ['ach_realm_kimdan']
  }
};

// 1.1 Test migrateRealmsProgressData
const realmsPlayer = migrateRealmsProgressData(legacyCultivationPlayer);
assert(realmsPlayer.currentRealm === 16, 'currentRealm validated as 16');
assert(realmsPlayer.maxExp > 0, 'maxExp computed from realmsData');
assert(realmsPlayer.tuViEmpowermentState.unlockedAcupointIds.length === 1, 'tuViEmpowermentState preserved');

// 1.2 Test healing corrupted realm
const corruptedPlayer = { currentRealm: 'invalid', achievementsState: { claimedAchievementIds: ['ach_realm_trucco'] } };
const healedPlayer = migrateRealmsProgressData(corruptedPlayer);
assert(healedPlayer.currentRealm === 11, 'Corrupted realm healed to Trúc Cơ (11) via achievements');

// 1.3 Test migrateSeclusionEnhancementData
const seclusionPlayer = migrateSeclusionEnhancementData(legacyCultivationPlayer);
assert(typeof seclusionPlayer.qiPurity === 'number' && seclusionPlayer.qiPurity >= 10, 'qiPurity initialized >= 10');
assert(Array.isArray(seclusionPlayer.harvestedDaoFruits), 'harvestedDaoFruits initialized as array');

// 1.4 Test migrateBreakthroughCatalystData
const catalystPlayer = migrateBreakthroughCatalystData(legacyCultivationPlayer);
assert(catalystPlayer.breakthroughCatalystState.totalCatalystBreakthroughs === 0, 'breakthroughCatalystState initialized');

// 1.5 Test migrateBreakthroughBacklashData
const backlashPlayer = migrateBreakthroughBacklashData(legacyCultivationPlayer);
assert(backlashPlayer.injuryState.isInjured === false, 'injuryState initialized with isInjured: false');
assert(Array.isArray(backlashPlayer.injuryState.backlashHistory), 'backlashHistory is array');

// 1.6 Test migrateDaoFoundationData
const daoPlayer = migrateDaoFoundationData(legacyCultivationPlayer);
assert(daoPlayer.daoFoundations.luyen_khi_to_truc_co === 'ha_pham', 'luyen_khi_to_truc_co defaulted to ha_pham');
assert(daoPlayer.daoFoundations.truc_co_to_kim_dan === 'ha_pham', 'truc_co_to_kim_dan defaulted to ha_pham');
assert(daoPlayer.daoFoundations.kim_dan_to_nguyen_anh === undefined, 'kim_dan_to_nguyen_anh not added for realm 16');

// 1.7 Test normalizeCultivationState & Idempotency
const normalizedCultivation1 = normalizeCultivationState(legacyCultivationPlayer);
const normalizedCultivation2 = normalizeCultivationState(normalizedCultivation1);
assert(
  JSON.stringify(normalizedCultivation1) === JSON.stringify(normalizedCultivation2),
  'normalizeCultivationState is 100% idempotent'
);

console.log('\n=== TEST 2: TEST ĐỘNG PHỦ, TÔNG MÔN, ĐẠO LỮ (ABODE & SOCIAL MIGRATIONS) ===');

const legacyAbodeSocialPlayer: any = {
  name: 'Bạch Ngưng Băng',
  currentRealm: 12,
  tongMon: 'Thanh Vân Môn',
  sectContribution: 1500,
  garden: {
    plots: [
      { id: 0, isUnlocked: true, seedId: 'herb_linh_thao' }
    ]
  },
  companionsState: {
    activeCompanionId: 'companion_lac_thanh_tuyet',
    companions: {
      companion_lac_thanh_tuyet: {
        id: 'companion_lac_thanh_tuyet',
        affinity: 80,
        isBonded: true,
        isMet: true
      }
    }
  }
};

// 2.1 Test migrateDestinyTalentsData
const destinyPlayer = migrateDestinyTalentsData(legacyAbodeSocialPlayer);
assert(destinyPlayer.destiny !== undefined, 'destiny initialized');
assert(destinyPlayer.destinyBoard.unlockedSlots >= 3, 'destinyBoard unlockedSlots initialized >= 3');

// 2.2 Test migrateAbodeData
const abodePlayer = migrateAbodeData(legacyAbodeSocialPlayer);
assert(abodePlayer.abodeState.level >= 1, 'abodeState level initialized >= 1');
assert(abodePlayer.abodeState.spiritArray.level >= 1, 'spiritArray initialized');
assert(abodePlayer.abodeState.beastSanctuary.fertilizerStored >= 1, 'beastSanctuary fertilizer stored >= 1');

// 2.3 Test migrateHerbalGardenData (12 plots migration from legacy garden)
const gardenPlayer = migrateHerbalGardenData(legacyAbodeSocialPlayer);
assert(gardenPlayer.abodeState.plots.length === 12, 'abodeState has 12 plots');
assert(gardenPlayer.abodeState.plots[0].seedId === 'herb_linh_thao', 'Legacy plot seedId preserved');
assert(gardenPlayer.linhDien.plots.length === 12, 'linhDien synchronized to 12 plots');

// 2.4 Test migrateCompanionsData
const compPlayer = migrateCompanionsData(legacyAbodeSocialPlayer);
assert(compPlayer.companionsState.activeCompanionId === 'companion_lac_thanh_tuyet', 'Bonded companion preserved');
assert(compPlayer.companionsState.companions.companion_lac_thanh_tuyet.totalEpiphanies === 0, 'totalEpiphanies initialized');
assert(compPlayer.companionsState.companions.companion_co_vo_diem !== undefined, 'Missing companion auto-added from registry');

// 2.5 Test migrateSectData
const sectPlayer = migrateSectData(legacyAbodeSocialPlayer);
assert(sectPlayer.sectState.sectId === 'sect_thanh_van_mon', 'Sect ID correctly mapped from tongMon string');
assert(sectPlayer.sectState.contribution === 1500, 'Contribution score preserved');
assert(sectPlayer.sectState.guardianArray !== undefined, 'Guardian array initialized');
assert(sectPlayer.sectState.dailyQuests.length > 0, 'Daily quests generated');

// 2.6 Test normalizeAbodeState & Idempotency
const normalizedAbode1 = normalizeAbodeState(legacyAbodeSocialPlayer);
const normalizedAbode2 = normalizeAbodeState(normalizedAbode1);
assert(
  JSON.stringify(normalizedAbode1) === JSON.stringify(normalizedAbode2),
  'normalizeAbodeState is 100% idempotent'
);

console.log('\n=== ALL CULTIVATION & ABODE-SOCIAL TESTS PASSED SUCCESSFULLY! ===');
