// scripts/test-pill-tribulation.ts
// Test Suite: Đan Lôi Kiếp & Đan Linh Hóa Hình (Pill Tribulation & Living Spirits)
// Chạy độc lập: npx tsx scripts/test-pill-tribulation.ts

import { PlayerStats, Pill } from '../lib/types';
import {
  evaluatePillTribulationTrigger,
  createPillTribulationEncounter,
  resolveLightningDefenseRound,
  finalizePillTribulation,
  calculateDanSpiritsBuffs
} from '../lib/pill-tribulation-logic';
import { migratePillTribulationData } from '../lib/save-migration';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
}

console.log('====================================================================');
console.log('⚡ TEST SUITE: ĐAN LÔI KIẾP & ĐAN LINH HÓA HÌNH (GAMETUTIEN)');
console.log('====================================================================\n');

// Mock Player cơ bản
function createMockPlayer(): PlayerStats {
  return {
    name: 'Hàn Lập',
    tuVi: 500000,
    canCot: 100,
    ngoTinh: 50,
    khiVan: 30,
    tamCanh: 50,
    linhThach: 100000,
    currentRealm: 25, // Kết Đan Kỳ
    danhVong: 1000,
    khiHuyet: 20000,
    maxKhiHuyet: 20000,
    linhLuc: 15000,
    maxLinhLuc: 15000,
    inventory: {
      pills: [],
      herbs: [],
      ores: []
    },
    companionsState: {
      activeCompanionId: 'comp_nam_cung_uyen',
      companions: {
        comp_nam_cung_uyen: {
          id: 'comp_nam_cung_uyen',
          name: 'Nam Cung Uyển',
          affinity: 100,
          isBonded: true
        }
      }
    },
    pillTribulationState: {
      totalTribulationsFaced: 0,
      successfulDefenses: 0,
      danSpirits: [],
      activeTribulation: null
    }
  };
}

// --------------------------------------------------------------------
// TEST 1: Thẩm Định Dẫn Động Lôi Kiếp (Trigger Conditions Guard)
// --------------------------------------------------------------------
console.log('🧪 TEST 1: Thẩm Định Dẫn Động Lôi Kiếp (Trigger Conditions Guard)...');

// 1.1 Đan Tier 1 - 6 bình thường -> 0% kích hoạt
const checkTier3 = evaluatePillTribulationTrigger(3, 0, false);
assert(!checkTier3.shouldTrigger, 'Đan Tier 3 không được kích hoạt Lôi Kiếp');

const checkTier6 = evaluatePillTribulationTrigger(6, 2, false);
assert(!checkTier6.shouldTrigger, 'Đan Tier 6 không được kích hoạt Lôi Kiếp');
console.log('  ✓ Đan Tier 1 - 6 bình thường: 0% kích hoạt lôi kiếp');

// 1.2 Đan Tier 7 -> Kích hoạt Tam Trọng Lôi Kiếp với tỷ lệ đúng cấu hình (35%)
const checkTier7Trigger = evaluatePillTribulationTrigger(7, 3, false, { deterministicSeed: 0.20 });
assert(checkTier7Trigger.shouldTrigger, 'Đan Tier 7 với roll 0.20 (<0.35) phải kích hoạt');
assert(checkTier7Trigger.intensity === 'tam_trong', 'Tier 7 phải kích hoạt Tam Trọng Lôi Kiếp');

const checkTier7Miss = evaluatePillTribulationTrigger(7, 3, false, { deterministicSeed: 0.50 });
assert(!checkTier7Miss.shouldTrigger, 'Đan Tier 7 với roll 0.50 (>0.35) không kích hoạt');
console.log('  ✓ Đan Tier 7: Kích hoạt Tam Trọng Lôi Kiếp chuẩn xác theo tỷ lệ cấu hình 35%');

// 1.3 Đan Tier 9 hoặc Đan 9 Văn -> 100% bắt buộc dẫn động Cửu Trọng Lôi Kiếp
const checkTier9 = evaluatePillTribulationTrigger(9, 0, false);
assert(checkTier9.shouldTrigger && checkTier9.intensity === 'cuu_trong', 'Đan Tier 9 bắt buộc dẫn động Cửu Trọng');

const checkVein9 = evaluatePillTribulationTrigger(5, 9, false);
assert(checkVein9.shouldTrigger && checkVein9.intensity === 'cuu_trong', 'Đan 9 Văn bất kể tier bắt buộc dẫn động Cửu Trọng');
console.log('  ✓ Đan Tier 9 hoặc Đan 9 Văn: 100% bắt buộc dẫn động Cửu Trọng Lôi Kiếp');
console.log('  ==> PASS TEST 1\n');

// --------------------------------------------------------------------
// TEST 2: Hấp Thu Sát Thương Qua Các Tuyến Hộ Đan (Defense Mitigation Invariant)
// --------------------------------------------------------------------
console.log('🧪 TEST 2: Hấp Thu Sát Thương Qua Các Tuyến Hộ Đan (Defense Mitigation Invariant)...');

const playerDefense = createMockPlayer();
const encounterTest2 = createPillTribulationEncounter('pill_cuu_chuyen', 'Cửu Chuyển Kim Đan', 9, 'cuu_trong');

// 2.1 Tuyến Hộ Trận Động Phủ: Hấp thu 80% sát thương, tiêu hao Linh Thạch
const linhThachBefore = playerDefense.linhThach;
const roundFormation = resolveLightningDefenseRound(
  playerDefense,
  encounterTest2,
  'formation',
  undefined,
  { customDamage: 10000 }
);

assert(roundFormation.success, 'Hộ Trận phòng thủ thành công');
assert(roundFormation.damageAbsorbed === 8000, `Hộ Trận phải triệt tiêu đúng 80% (8,000 sát thương), thực tế: ${roundFormation.damageAbsorbed}`);
assert(roundFormation.updatedPlayer.linhThach === linhThachBefore - 15000, 'Hộ Trận Cửu Trọng trừ đúng 15,000 Linh Thạch');
console.log('  ✓ Tuyến Hộ Trận: Hấp thu chuẩn xác 80% sát thương (8,000/10,000), trừ 15,000 Linh Thạch');

// 2.2 Tuyến Đạo Lữ Hộ Pháp: Giảm 60% sát thương, nhận fatigueUntil 1 giờ, +5 Hảo Cảm
const roundCompanion = resolveLightningDefenseRound(
  playerDefense,
  encounterTest2,
  'companion',
  'comp_nam_cung_uyen',
  { customDamage: 10000 }
);

assert(roundCompanion.success, 'Đạo Lữ hộ pháp thành công');
assert(roundCompanion.damageAbsorbed === 6000, `Đạo Lữ giảm đúng 60% sát thương (6,000), thực tế: ${roundCompanion.damageAbsorbed}`);
const companionUpdated = roundCompanion.updatedPlayer.companionsState.companions['comp_nam_cung_uyen'];
assert(companionUpdated.affinity === 105, 'Hảo Cảm tăng thêm +5');
assert(companionUpdated.fatigueUntil && companionUpdated.fatigueUntil > Date.now(), 'Đạo Lữ phải nhận trạng thái mệt mỏi fatigueUntil');
console.log('  ✓ Tuyến Đạo Lữ: Triệt tiêu chuẩn xác 60% sát thương (6,000/10,000), Hảo Cảm +5, nhận fatigue 1h');
console.log('  ==> PASS TEST 2\n');

// --------------------------------------------------------------------
// TEST 3: Xử Lý Nổ Lò Khi Thất Bại (Catastrophic Failure Handling)
// --------------------------------------------------------------------
console.log('🧪 TEST 3: Xử Lý Nổ Lò Khi Thất Bại (Catastrophic Failure Handling)...');

const exhaustedPlayer = createMockPlayer();
exhaustedPlayer.linhThach = 0; // Hết linh thạch cho hộ trận
exhaustedPlayer.khiHuyet = 50;  // Máu quá thấp, ngạnh kháng sẽ chết

const failedEncounter = createPillTribulationEncounter('pill_bat_giai', 'Bát Hoang Tiên Đan', 8, 'luc_trong');

// Đỡ bằng bản thân với sát thương sấm sét cực lớn
const fatalRound = resolveLightningDefenseRound(
  exhaustedPlayer,
  failedEncounter,
  'player',
  undefined,
  { customDamage: 50000 }
);

assert(!fatalRound.success, 'Đỡ sấm sét thất bại');
assert(fatalRound.isCauldronDestroyed, 'Đan lò phải rạn nứt nổ tung khi người chơi kiệt sức');
assert(fatalRound.updatedPlayer.khiHuyet === 1, 'Người chơi trọng thương (HP về 1)');

// Kết toán kết quả thất bại
const testPillItem: Pill = {
  id: 'pill_bat_giai_inst',
  name: 'Bát Hoang Tiên Đan',
  grade: 'Bát Giai',
  description: 'Thần đan',
  effectValue: 5000,
  quantity: 1,
  veinMetadata: { veinCount: 6, veinMultiplier: 1.6, toxicityMultiplier: 0.3, mutation: null }
};

const failedFinalize = finalizePillTribulation(fatalRound.updatedPlayer, failedEncounter, testPillItem);
assert(failedFinalize.isFailed, 'Kết quả thiên kiếp phải là thất bại');
assert(failedFinalize.resultPill?.name.includes('Phế Đan Độc Dược'), 'Viên đan phải chuyển hóa thành Phế Đan Độc Dược');
assert(failedFinalize.updatedPlayer.inventory.pills.some((p: Pill) => p.name.includes('Phế Đan Độc Dược')), 'Phế Đan Độc Dược được thêm vào túi trữ vật an toàn');
console.log('  ✓ Khiên vỡ, đan lò nổ tung an toàn, chuyển hóa thành Phế Đan Độc Dược mà không gây crash');
console.log('  ==> PASS TEST 3\n');

// --------------------------------------------------------------------
// TEST 4: Thăng Hoa Tiên Thiên Thần Đan (Primordial Pill Evolution)
// --------------------------------------------------------------------
console.log('🧪 TEST 4: Thăng Hoa Tiên Thiên Thần Đan (Primordial Pill Evolution)...');

const winningPlayer = createMockPlayer();
const successEncounter = createPillTribulationEncounter('pill_cuu_chuyen', 'Cửu Chuyển Thần Đan', 9, 'cuu_trong');
successEncounter.currentWave = 9;
successEncounter.isDefendedSuccessfully = true;

const rawNineVeinPill: Pill = {
  id: 'pill_cuu_chuyen_inst',
  name: 'Cửu Chuyển Thần Đan',
  grade: 'Cửu Giai',
  description: 'Thần đan nghịch thiên',
  effectValue: 10000,
  quantity: 1,
  veinMetadata: {
    veinCount: 9,
    veinMultiplier: 2.0,
    toxicityMultiplier: 0,
    mutation: null
  }
};

// Vượt qua lôi kiếp mà không hóa hình (deterministicRoll = 0.99 > 0.05)
const evolveResult = finalizePillTribulation(winningPlayer, successEncounter, rawNineVeinPill, {
  deterministicRoll: 0.99
});

assert(!evolveResult.isFailed, 'Vượt thiên kiếp phải thành công');
assert(evolveResult.resultPill?.name.startsWith('【Tiên Thiên Thần Đan】'), 'Tên đan thăng hoa thành 【Tiên Thiên Thần Đan】');
assert(evolveResult.resultPill?.veinMetadata?.isPrimordial === true, 'Cờ isPrimordial phải là true');
assert(evolveResult.resultPill?.veinMetadata?.veinMultiplier === 3.0, `Dược lực phải x1.5 (2.0 * 1.5 = 3.0), thực tế: ${evolveResult.resultPill?.veinMetadata?.veinMultiplier}`);
assert(evolveResult.resultPill?.veinMetadata?.toxicityMultiplier === 0, 'Đan độc phải bằng 0');
assert(evolveResult.resultPill?.veinMetadata?.primordialAura?.id === 'aura_tien_thien_ho_the', 'Mở khóa hào quang Tiên Thiên Hộ Thể');
console.log('  ✓ Thăng hoa chuẩn xác 【Tiên Thiên Thần Đan】: Dược lực +50% (x3.0), Đan độc = 0, Hào Quang mở khóa');
console.log('  ==> PASS TEST 4\n');

// --------------------------------------------------------------------
// TEST 5: Cơ Chế Đan Linh Hóa Hình (Dan Linh Awakening & Abode Sync)
// --------------------------------------------------------------------
console.log('🧪 TEST 5: Cơ Chế Đan Linh Hóa Hình (Dan Linh Awakening & Abode Sync)...');

const awakeningPlayer = createMockPlayer();
const awakeningEncounter = createPillTribulationEncounter('pill_thai_so', 'Thái Sơ Hỗn Độn Đan', 9, 'cuu_trong');
awakeningEncounter.isDefendedSuccessfully = true;

const candidatePill: Pill = {
  id: 'pill_thai_so_candidate',
  name: 'Thái Sơ Hỗn Độn Đan',
  grade: 'Cửu Giai',
  description: 'Thần đan tối cao',
  effectValue: 20000,
  quantity: 1,
  veinMetadata: { veinCount: 9, veinMultiplier: 2.0, toxicityMultiplier: 0, mutation: null }
};

// Kích hoạt hóa hình 100% bằng forceSpiritAwakening
const awakeningResult = finalizePillTribulation(awakeningPlayer, awakeningEncounter, candidatePill, {
  forceSpiritAwakening: true
});

assert(awakeningResult.awakenedSpirit !== null, 'Đan Linh phải hóa hình xuất thế');
assert(awakeningResult.resultPill === undefined, 'Viên đan đã hóa hình, không nằm lại dưới dạng vật phẩm tiêu hao');
assert(awakeningResult.updatedPlayer.pillTribulationState.danSpirits.length === 1, 'Danh sách danSpirits phải tăng thêm 1 thực thể');

const spirit = awakeningResult.updatedPlayer.pillTribulationState.danSpirits[0];
assert(spirit.name.includes('Đan Linh Nhi'), 'Tên Đan Linh Nhi chuẩn xác');
assert(spirit.buffs.gardenGrowthSpeedBonus === 0.20, 'Buff Dược Viên +20%');

// Kiểm tra hàm tính toán buff tổng hợp cho Động Phủ
const abodeBuffs = calculateDanSpiritsBuffs(awakeningResult.updatedPlayer);
assert(abodeBuffs.totalSpirits === 1, 'Đồng bộ 1 Đan Linh vào Động Phủ');
assert(abodeBuffs.gardenGrowthSpeedBonus === 0.20, 'Đồng bộ +20% tốc độ lớn Dược Viên');
assert(abodeBuffs.veinQualityBonus === 15, 'Đồng bộ +15 điểm Đan Văn');
assert(abodeBuffs.explosionRiskReduction === 10, 'Đồng bộ -10% nguy cơ nổ lò');
console.log('  ✓ Đan Linh Nhi hóa hình thành công, tự động ngụ tại Động Phủ và buff Dược Viên +20%, Đan Văn +15');
console.log('  ==> PASS TEST 5\n');

// --------------------------------------------------------------------
// TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
// --------------------------------------------------------------------
console.log('🧪 TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)...');

// Mock save cũ thời v1-v6 không hề có trường pillTribulationState
const legacySave: any = {
  name: 'Đạo Hữu Cũ',
  tuVi: 100000,
  canCot: 40,
  linhThach: 50000,
  currentRealm: 10,
  inventory: {
    pills: [
      { id: 'pill_1', name: 'Trúc Cơ Đan', grade: 'Nhị Giai', quantity: 3, effectValue: 200 }
    ]
  }
};

const migratedSave = migratePillTribulationData(legacySave);
const tribState = migratedSave.pillTribulationState!;
assert(tribState !== undefined, 'Save cũ phải tự động có pillTribulationState');
assert(tribState.totalTribulationsFaced === 0, 'totalTribulationsFaced khởi tạo = 0');
assert(Array.isArray(tribState.danSpirits), 'danSpirits khởi tạo mảng rỗng []');
assert(tribState.activeTribulation === null, 'activeTribulation khởi tạo null');

// Chạy thử vòng lôi kiếp với save vừa migrate
const migratedEncounter = createPillTribulationEncounter('pill_test', 'Linh Đan', 7, 'tam_trong');
const testDefenseMigrated = resolveLightningDefenseRound(migratedSave, migratedEncounter, 'player', undefined, { customDamage: 500 });
assert(testDefenseMigrated.success, 'Save cũ chạy mượt mà qua lôi kiếp không hề bị lỗi undefined');
console.log('  ✓ Save cũ thiếu pillTribulationState tự động chuẩn hóa 100% dữ liệu an toàn, không lỗi runtime');
console.log('  ==> PASS TEST 6\n');

console.log('====================================================================');
console.log('🎉 KẾT QUẢ TEST SUITE: 6/6 TESTS PASSED (100% HOÀN TẤT)');
console.log('====================================================================');
