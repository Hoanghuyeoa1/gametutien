// scripts/test-weapon-tribulation-ui-integration.ts
// Test suite kiểm thử toàn diện các UI components của phân hệ Khí Lôi Kiếp & Trận Khí Tùy Thân

import { WeaponTribulationArraySection } from '../components/forging/WeaponTribulationArraySection';
import { TribulationLightningAltar } from '../components/forging/TribulationLightningAltar';
import { OrbitingArrayCanvas } from '../components/forging/OrbitingArrayCanvas';
import { FormationSetPieceCrafter } from '../components/forging/FormationSetPieceCrafter';
import { HeavenTemperedRelicModal } from '../components/forging/HeavenTemperedRelicModal';
import { ForgingTab } from '../components/tabs/ForgingTab';
import { FORMATION_SETS_REGISTRY } from '../lib/weapon-tribulation-array-logic';
import { WEAPON_TRIBULATION_STRIKES_CONFIG } from '../hooks/useWeaponTribulationArrayActions';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${msg}`);
    throw new Error(`FAIL: ${msg}`);
  }
  console.log(`  ✓ [PASS] ${msg}`);
}

async function runUITests() {
  console.log('===============================================================');
  console.log('🎨 TEST SUITE: WEAPON TRIBULATION & ARRAY UI INTEGRATION');
  console.log('===============================================================\n');

  // Test 1: Component Export Contracts
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 1: Component Export Contracts & React Function Types');
  console.log('---------------------------------------------------------------');
  assert(typeof WeaponTribulationArraySection === 'function', 'WeaponTribulationArraySection is a valid React Component');
  assert(typeof TribulationLightningAltar === 'function', 'TribulationLightningAltar is a valid React Component');
  assert(typeof OrbitingArrayCanvas === 'function', 'OrbitingArrayCanvas is a valid React Component');
  assert(typeof FormationSetPieceCrafter === 'function', 'FormationSetPieceCrafter is a valid React Component');
  assert(typeof HeavenTemperedRelicModal === 'function', 'HeavenTemperedRelicModal is a valid React Component');
  assert(typeof ForgingTab === 'function', 'ForgingTab is a valid React Component');
  console.log('==> [PASS] Test 1: Component Export Contracts & React Function Types\n');

  // Test 2: Formation Set Registry Data Consistency
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 2: Formation Sets Registry Structure (3 Sets)');
  console.log('---------------------------------------------------------------');
  const setKeys = Object.keys(FORMATION_SETS_REGISTRY);
  assert(setKeys.length === 3, 'Exactly 3 formation sets registered');
  assert(setKeys.includes('chu_thien_kiem'), 'Registry has Chu Thiên Kiếm (36 thanh phi kiếm)');
  assert(setKeys.includes('ngu_hanh_chau'), 'Registry has Ngũ Hành Châu (5 linh châu ngũ hành)');
  assert(setKeys.includes('bat_quai_ky'), 'Registry has Bát Quái Kỳ (8 trận kỳ âm dương)');

  // Verify Chu Thiên Kiếm
  const chuThien = FORMATION_SETS_REGISTRY['chu_thien_kiem'];
  assert(chuThien.maxPieces === 36, 'Chu Thiên Kiếm maxPieces = 36');
  assert(chuThien.thresholdBonuses.length === 3, 'Chu Thiên Kiếm has 3 thresholds');
  assert(chuThien.thresholdBonuses[0].requiredPieces === 12, 'Threshold 1 is 12 pieces');
  assert(chuThien.thresholdBonuses[1].requiredPieces === 24, 'Threshold 2 is 24 pieces');
  assert(chuThien.thresholdBonuses[2].requiredPieces === 36, 'Threshold 3 is 36 pieces');

  // Verify Ngũ Hành Châu
  const nguHanh = FORMATION_SETS_REGISTRY['ngu_hanh_chau'];
  assert(nguHanh.maxPieces === 5, 'Ngũ Hành Châu maxPieces = 5');
  assert(nguHanh.thresholdBonuses.length === 2, 'Ngũ Hành Châu has 2 thresholds (3, 5)');

  // Verify Bát Quái Kỳ
  const batQuai = FORMATION_SETS_REGISTRY['bat_quai_ky'];
  assert(batQuai.maxPieces === 8, 'Bát Quái Kỳ maxPieces = 8');
  assert(batQuai.thresholdBonuses.length === 2, 'Bát Quái Kỳ has 2 thresholds (4, 8)');
  console.log('==> [PASS] Test 2: Formation Sets Registry Structure (3 Sets)\n');

  // Test 3: Wave Strike Config Consistency
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 3: Tribulation Strike Config Waves (3 Waves)');
  console.log('---------------------------------------------------------------');
  assert(WEAPON_TRIBULATION_STRIKES_CONFIG.length === 3, 'Exactly 3 tribulation strike waves');
  assert(WEAPON_TRIBULATION_STRIKES_CONFIG[0].strikeName.includes('Thanh Lôi Tẩy Kiếm'), 'Wave 1 is Thanh Lôi Tẩy Kiếm');
  assert(WEAPON_TRIBULATION_STRIKES_CONFIG[1].strikeName.includes('Tử Điện Đoán Cốt'), 'Wave 2 is Tử Điện Đoán Cốt');
  assert(WEAPON_TRIBULATION_STRIKES_CONFIG[2].strikeName.includes('Cửu Tiêu Lôi Kiếp'), 'Wave 3 is Cửu Tiêu Lôi Kiếp');
  console.log('==> [PASS] Test 3: Tribulation Strike Config Waves (3 Waves)\n');

  console.log('===============================================================');
  console.log('🎉 ALL UI INTEGRATION TESTS PASSED (100% SUCCESS)!');
  console.log('===============================================================');
}

runUITests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
