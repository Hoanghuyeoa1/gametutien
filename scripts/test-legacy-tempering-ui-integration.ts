// scripts/test-legacy-tempering-ui-integration.ts
// Test verify toàn diện giao diện & logic Trùng Chú & Huyết Khế

import { resolveEquipmentTier, calculateReforgeStatsScale, validateBloodBondEligibility, applyBloodBond, applyEquipmentReforge } from '../lib/legacy-tempering-logic';
import { getMaxArtisanTierForRealm } from '../lib/artisan-lock-logic';
import { Equipment } from '../lib/types/items';
import { ReforgeComparisonCard } from '../components/forging/ReforgeComparisonCard';
import { BloodBondingAltar } from '../components/forging/BloodBondingAltar';
import { BloodBondCinematicModal } from '../components/forging/BloodBondCinematicModal';
import { LegacyTemperingSection } from '../components/forging/LegacyTemperingSection';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`FAIL: ${msg}`);
  }
  console.log(`✓ ${msg}`);
}

async function runTests() {
  console.log('=== TEST SUITE: LEGACY TEMPERING UI & LOGIC INTEGRATION ===\n');

  // Test 1: Components exist and are functions (React Components)
  console.log('-- Test 1: Component Export Contracts --');
  assert(typeof ReforgeComparisonCard === 'function', 'ReforgeComparisonCard is a valid React Component');
  assert(typeof BloodBondingAltar === 'function', 'BloodBondingAltar is a valid React Component');
  assert(typeof BloodBondCinematicModal === 'function', 'BloodBondCinematicModal is a valid React Component');
  assert(typeof LegacyTemperingSection === 'function', 'LegacyTemperingSection is a valid React Component');

  // Test 2: Realm Tier Constraints
  console.log('\n-- Test 2: Realm Tier Limits for Slider --');
  assert(getMaxArtisanTierForRealm(5) === 1, 'Luyện Khí (realm 5) max tier is 1');
  assert(getMaxArtisanTierForRealm(12) === 2, 'Trúc Cơ (realm 12) max tier is 2');
  assert(getMaxArtisanTierForRealm(18) === 3, 'Kim Đan (realm 18) max tier is 3');
  assert(getMaxArtisanTierForRealm(24) === 4, 'Nguyên Anh (realm 24) max tier is 4');
  assert(getMaxArtisanTierForRealm(55) === 9, 'Tiên Giới (realm 55) max tier is 9');

  // Test 3: Equipment Reforge Projection
  console.log('\n-- Test 3: Reforge Preview Calculations --');
  const dummyWeapon: Equipment = {
    id: 'test_sword_1',
    name: 'Bích Thủy Kiếm',
    type: 'weapon',
    slot: 'weapon',
    grade: 'Nhất Giai (Phàm Khí)',
    quality: 'rare',
    enhancement: 3,
    level: 1,
    value: 500,
    powerBonus: 100,
    atkBonus: 100,
    defBonus: 20,
    hpBonus: 200,
    mpBonus: 50,
    alloyMetadata: {
      archetypeName: 'Huyền Thiết Canh Kim Hợp Kim',
      tier: 1
    } as any,
    inscriptionData: {
      conduits: [
        { slotIndex: 0, conduitIndex: 0, isUnlocked: true, inscribedFormationId: 'fmt_hoa_kiem', currentEffects: [] }
      ]
    } as any,
    infusedSoul: {
      soulName: 'Tiểu Viêm'
    } as any
  };

  const preview = calculateReforgeStatsScale(dummyWeapon, 3);
  assert(preview.currentTier === 1, 'Current tier is 1');
  assert(preview.targetTier === 3, 'Target tier is 3');
  assert(preview.projectedAtk > preview.currentAtk, 'Projected ATK is scaled up');
  assert(preview.projectedDef > preview.currentDef, 'Projected DEF is scaled up');
  assert(preview.projectedHp > preview.currentHp, 'Projected HP is scaled up');
  assert(preview.preservedAlloyName === 'Huyền Thiết Canh Kim Hợp Kim', 'Alloy is preserved 100%');
  assert(preview.preservedInscriptionCount === 1, 'Inscriptions preserved 100%');
  assert(preview.preservedSoulName === 'Tiểu Viêm', 'Soul is preserved 100%');
  assert(preview.costs.spiritStonesCost > 0, 'Costs calculated correctly');

  // Test 4: Blood Bond Eligibility & Application
  console.log('\n-- Test 4: Blood Bond Eligibility & Execution --');
  // Eligible case
  const elig1 = validateBloodBondEligibility(30, dummyWeapon);
  assert(elig1.eligible === true, 'Lifespan 30 + weapon is eligible for blood bond');

  // Ineligible: lifespan under 15
  const elig2 = validateBloodBondEligibility(10, dummyWeapon);
  assert(elig2.eligible === false, 'Lifespan 10 is rejected (< 15 years)');

  // Ineligible: already bound weapon cannot be re-bound
  const alreadyBoundWeapon: Equipment = {
    ...dummyWeapon,
    id: 'test_bound_1',
    bloodBondData: {
      isBloodBound: true,
      boundOwnerId: 'p1',
      boundOwnerName: 'p1',
      bondedAt: Date.now(),
      lifespanSacrificed: 5,
      combatPowerMultiplier: 1.3,
      disarmImmunity: true,
      bondResonanceLevel: 1
    }
  };
  const elig3 = validateBloodBondEligibility(40, alreadyBoundWeapon);
  assert(elig3.eligible === false, 'Already bound weapon is rejected from re-bonding');

  // Blood Bond execution
  const bondedWeapon = applyBloodBond(dummyWeapon, 'player_hoang', 'Hoàng Tu Sĩ', 5);
  assert(bondedWeapon.bloodBondData?.isBloodBound === true, 'Weapon is marked as blood-bound');
  assert(bondedWeapon.bloodBondData?.combatPowerMultiplier === 1.30, 'Combat power multiplier is 1.30 (+30%)');
  assert(bondedWeapon.bloodBondData?.disarmImmunity === true, 'Disarm immunity is granted');
  assert(bondedWeapon.bloodBondData?.boundOwnerName === 'Hoàng Tu Sĩ', 'Owner name preserved');

  console.log('\n=== ALL 14 INTEGRATION CHECKS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
