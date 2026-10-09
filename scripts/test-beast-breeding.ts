// scripts/test-beast-breeding.ts
// Test Suite kiểm định hệ thống Tiến Hóa Huyết Mạch & Lai Tạo Linh Thú (Thú Uyển Động Phủ)

import {
  canBreedBeasts,
  startBeastBreeding,
  hatchBeastEgg,
  evolveBloodline,
  generateBeastBreedingResult,
  areElementsCompatible
} from '../lib/beast-breeding-logic';
import { migrateBeastGardenData } from '../lib/save-migration';
import { SpiritBeast } from '../lib/types/beasts';
import { PlayerStats } from '../lib/types/player';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU TEST SUITE: TIẾN HÓA HUYẾT MẠCH & LAI TẠO LINH THÚ');
console.log('================================================================\n');

let passedTests = 0;
const totalTests = 6;

// Mock player cơ bản
const createMockPlayer = (overrides?: Partial<PlayerStats>): PlayerStats => ({
  name: 'Đạo Hữu Tu Tiên',
  currentRealm: 15,
  linhThach: 5000000,
  beasts: [],
  spiritBeasts: [],
  beastEggs: [],
  beastGarden: {
    facility: {
      level: 1,
      maxBreedingSlots: 2,
      incubationSpeedMultiplier: 1.0,
      mutationRateBonus: 0
    },
    beasts: [],
    eggs: [],
    activeMountId: null,
    activeCombatId: null,
    breedingPairs: []
  },
  ...overrides
} as any);

// -------------------------------------------------------------------------
// TEST 1: Validation Guard (Kiểm tra điều kiện ghép đôi & nguyên tố)
// -------------------------------------------------------------------------
console.log('--- TEST 1: Kiểm Tra Điều Kiện Lai Tạo (Validation Guard) ---');
{
  const mockPlayer = createMockPlayer({ linhThach: 1000 }); // Thiếu linh thạch

  const beastHoa: SpiritBeast = {
    id: 'beast_hoa_1',
    name: 'Xích Viêm Lang',
    species: 'lang',
    quality: 'thuong_pham',
    element: 'Hỏa',
    level: 20,
    exp: 0,
    maxExp: 1000,
    stage: 2,
    loyalty: 80,
    stats: { hp: 1500, maxHp: 1500, atk: 150, def: 80, blockPercent: 10, mountSpeedBonus: 20, mpRegenBonus: 10 },
    skills: [],
    avatar: '🐺',
    tier: 2,
    bloodlinePurity: 40,
    generation: 0,
    canMount: true,
    canFight: true,
    travelSpeedBonus: 20,
    combatStats: { atkBonus: 150, defBonus: 80, hpBonus: 1500 }
  };

  const beastThuy: SpiritBeast = {
    id: 'beast_thuy_1',
    name: 'Băng Tinh Tước',
    species: 'tuoc',
    quality: 'thuong_pham',
    element: 'Thủy', // Thủy khắc Hỏa (Không tương thích)
    level: 20,
    exp: 0,
    maxExp: 1000,
    stage: 2,
    loyalty: 80,
    stats: { hp: 1200, maxHp: 1200, atk: 140, def: 70, blockPercent: 10, mountSpeedBonus: 25, mpRegenBonus: 10 },
    skills: [],
    avatar: '🦅',
    tier: 2,
    bloodlinePurity: 35,
    generation: 0,
    canMount: true,
    canFight: true,
    travelSpeedBonus: 25,
    combatStats: { atkBonus: 140, defBonus: 70, hpBonus: 1200 }
  };

  // 1.1 Kiểm tra xung khắc nguyên tố
  const comp = areElementsCompatible(beastHoa.element as any, beastThuy.element as any);
  if (comp) throw new Error('Thủy và Hỏa không thể tương sinh trực tiếp!');

  const checkIncompatible = canBreedBeasts(mockPlayer, beastHoa, beastThuy);
  if (checkIncompatible.eligible) {
    throw new Error('Hệ thống phải chặn 2 thú xung khắc nguyên tố!');
  }
  console.log('✔ Chặn thành công thú xung khắc nguyên tố:', checkIncompatible.reason);

  // 1.2 Kiểm tra thú đang trong hồi chiêu
  const beastCooldown: SpiritBeast = {
    ...beastHoa,
    id: 'beast_hoa_cd',
    element: 'Hỏa',
    breedingCooldownEnd: Date.now() + 600000 // 10 phút sau
  };
  const beastMoc: SpiritBeast = {
    ...beastThuy,
    id: 'beast_moc_1',
    element: 'Mộc' // Mộc sinh Hỏa
  };

  const checkCooldown = canBreedBeasts(mockPlayer, beastCooldown, beastMoc);
  if (checkCooldown.eligible) {
    throw new Error('Hệ thống phải chặn thú đang trong thời gian hồi chiêu!');
  }
  console.log('✔ Chặn thành công thú đang hồi chiêu:', checkCooldown.reason);

  // 1.3 Kiểm tra thiếu Linh Thạch
  const checkMoney = canBreedBeasts(mockPlayer, beastHoa, beastMoc);
  if (checkMoney.eligible) {
    throw new Error('Hệ thống phải chặn khi người chơi không đủ Linh Thạch!');
  }
  console.log('✔ Chặn thành công khi thiếu Linh Thạch:', checkMoney.reason);

  passedTests++;
  console.log('==> TEST 1 PASSED!\n');
}

// -------------------------------------------------------------------------
// TEST 2: Parent Locking (Khóa thú cha mẹ khi bắt đầu phối giống)
// -------------------------------------------------------------------------
console.log('--- TEST 2: Khóa Linh Thú Cha Mẹ (Parent Locking) ---');
{
  const beastA: SpiritBeast = {
    id: 'father_1',
    name: 'Thiên Hỏa Kỳ Lân',
    species: 'ky_lan',
    quality: 'than_pham',
    element: 'Hỏa',
    level: 50,
    exp: 0,
    maxExp: 5000,
    stage: 3,
    loyalty: 100,
    stats: { hp: 5000, maxHp: 5000, atk: 500, def: 300, blockPercent: 20, mountSpeedBonus: 35, mpRegenBonus: 30 },
    skills: [],
    avatar: '🔥🐉',
    tier: 3,
    bloodlinePurity: 60,
    generation: 0,
    canMount: true,
    canFight: true,
    travelSpeedBonus: 35,
    combatStats: { atkBonus: 500, defBonus: 300, hpBonus: 5000 }
  };

  const beastB: SpiritBeast = {
    id: 'mother_1',
    name: 'Thanh Mộc Hồ',
    species: 'ho_ly',
    quality: 'tuyet_pham',
    element: 'Mộc', // Mộc sinh Hỏa
    level: 50,
    exp: 0,
    maxExp: 5000,
    stage: 3,
    loyalty: 100,
    stats: { hp: 4000, maxHp: 4000, atk: 450, def: 250, blockPercent: 15, mountSpeedBonus: 30, mpRegenBonus: 25 },
    skills: [],
    avatar: '🦊',
    tier: 3,
    bloodlinePurity: 55,
    generation: 0,
    canMount: true,
    canFight: true,
    travelSpeedBonus: 30,
    combatStats: { atkBonus: 450, defBonus: 250, hpBonus: 4000 }
  };

  let player = createMockPlayer({
    linhThach: 1000000,
    beasts: [beastA, beastB],
    beastGarden: {
      facility: { level: 2, maxBreedingSlots: 3, incubationSpeedMultiplier: 1.25, mutationRateBonus: 5 },
      beasts: [beastA, beastB],
      eggs: [],
      activeMountId: null,
      activeCombatId: null,
      breedingPairs: []
    }
  });

  const res = startBeastBreeding(player, beastA.id, beastB.id, 'catalyst_duc_thu_thao', Date.now());
  if (!res.success) {
    throw new Error(`Bắt đầu lai tạo thất bại: ${res.message}`);
  }

  player = res.updatedPlayer;

  // Kiểm tra cờ isLockedInBreeding trên cả 2 thú
  const lockedA = player.beastGarden?.beasts.find(b => b.id === beastA.id);
  const lockedB = player.beastGarden?.beasts.find(b => b.id === beastB.id);

  if (!lockedA?.isLockedInBreeding || !lockedB?.isLockedInBreeding) {
    throw new Error('Thú cha hoặc thú mẹ chưa được đánh dấu isLockedInBreeding: true!');
  }
  console.log('✔ Cha mẹ đã được khóa trong buồng phối giống: isLockedInBreeding = true');

  // Thử lai tạo tiếp với thú đang bị khóa -> Phải bị chặn
  const beastC: SpiritBeast = { ...beastB, id: 'beast_c', name: 'Phong Bằng' };
  const checkAgain = canBreedBeasts(player, lockedA, beastC);
  if (checkAgain.eligible) {
    throw new Error('Hệ thống không chặn linh thú đang bị khóa isLockedInBreeding!');
  }
  console.log('✔ Chặn tuyệt đối thao tác tái ghép đôi thú đang bị khóa:', checkAgain.reason);

  passedTests++;
  console.log('==> TEST 2 PASSED!\n');
}

// -------------------------------------------------------------------------
// TEST 3: Hybrid Dual-Role Inheritance (Thừa hưởng thuộc tính kép Chiến - Cưỡi)
// -------------------------------------------------------------------------
console.log('--- TEST 3: Thừa Hưởng Thuộc Tính Kép (Hybrid Dual-Role Inheritance) ---');
{
  // Cha: Thuần Tọa Kỵ (Tốc độ cao 45%, Công thủ thấp)
  const mountFather: SpiritBeast = {
    id: 'mount_father',
    name: 'Truy Phong Câu',
    species: 'thien_ma',
    quality: 'tuyet_pham',
    element: 'Phong',
    level: 30,
    exp: 0,
    maxExp: 2000,
    stage: 2,
    loyalty: 90,
    role: 'mount',
    stats: { hp: 1000, maxHp: 1000, atk: 50, def: 40, blockPercent: 5, mountSpeedBonus: 45, mpRegenBonus: 10 },
    skills: [],
    avatar: '🐎',
    tier: 2,
    bloodlinePurity: 40,
    generation: 0,
    canMount: true,
    canFight: false,
    travelSpeedBonus: 45,
    combatStats: { atkBonus: 50, defBonus: 40, hpBonus: 1000, critRate: 5 }
  };

  // Mẹ: Thuần Chiến Thú (Tốc độ thấp 10%, Công thủ rất cao)
  const combatMother: SpiritBeast = {
    id: 'combat_mother',
    name: 'Bạch Hổ Chiến Tướng',
    species: 'bach_ho',
    quality: 'tuyet_pham',
    element: 'Hỏa', // Phong trợ Hỏa (tương thích sinh hỏa)
    level: 30,
    exp: 0,
    maxExp: 2000,
    stage: 2,
    loyalty: 90,
    role: 'combat',
    stats: { hp: 6000, maxHp: 6000, atk: 600, def: 350, blockPercent: 25, mountSpeedBonus: 10, mpRegenBonus: 20 },
    skills: [],
    avatar: '🐯',
    tier: 2,
    bloodlinePurity: 50,
    generation: 0,
    canMount: false,
    canFight: true,
    travelSpeedBonus: 10,
    combatStats: { atkBonus: 600, defBonus: 350, hpBonus: 6000, critRate: 10 }
  };

  const now = Date.now();
  let player = createMockPlayer({
    linhThach: 1000000,
    beasts: [mountFather, combatMother],
    beastGarden: {
      facility: { level: 2, maxBreedingSlots: 3, incubationSpeedMultiplier: 1.0, mutationRateBonus: 0 },
      beasts: [mountFather, combatMother],
      eggs: [],
      activeMountId: null,
      activeCombatId: null,
      breedingPairs: []
    }
  });

  // Bắt đầu phối giống
  const breedRes = startBeastBreeding(player, mountFather.id, combatMother.id, undefined, now, 0.99); // force no mutation
  if (!breedRes.success || !breedRes.eggId) {
    throw new Error(`Bắt đầu lai tạo thất bại: ${breedRes.message}`);
  }
  player = breedRes.updatedPlayer;

  // Giả lập ấp xong và nở
  const hatchRes = hatchBeastEgg(player, breedRes.eggId, now + 10000000);
  if (!hatchRes.success || !hatchRes.newBeast) {
    throw new Error(`Ấp nở thất bại: ${hatchRes.message}`);
  }

  const child = hatchRes.newBeast;
  console.log(`✔ Con non nở ra: [${child.name}] | Gen: F${child.generation} | Tier: ${child.tier}`);
  console.log(`   - Tốc độ Cưỡi: +${child.travelSpeedBonus}% (Cha: 45%, Mẹ: 10%)`);
  console.log(`   - Chỉ số Chiến đấu: ATK: +${child.combatStats!.atkBonus}, DEF: +${child.combatStats!.defBonus}, HP: +${child.combatStats!.hpBonus}`);

  // Kiểm chứng tính chất Chiến Tọa Song Toàn
  if (!child.canMount || (child.travelSpeedBonus ?? 0) <= 0) {
    throw new Error('Dị thú con không sở hữu năng lực Tọa Kỵ hoặc tốc độ di chuyển <= 0!');
  }
  if (!child.canFight || (child.combatStats?.atkBonus ?? 0) <= 0 || (child.combatStats?.hpBonus ?? 0) <= 0) {
    throw new Error('Dị thú con không sở hữu năng lực Chiến Thú hoặc chỉ số công thủ <= 0!');
  }
  if (!child.isHybrid) {
    throw new Error('Dị thú con phải có cờ isHybrid: true!');
  }

  // Kiểm tra mở khóa cha mẹ
  const parentAfterA = hatchRes.updatedPlayer.beastGarden?.beasts.find(b => b.id === mountFather.id);
  const parentAfterB = hatchRes.updatedPlayer.beastGarden?.beasts.find(b => b.id === combatMother.id);
  if (parentAfterA?.isLockedInBreeding || parentAfterB?.isLockedInBreeding) {
    throw new Error('Cha mẹ chưa được giải phóng khỏi trạng thái khóa sau khi trứng nở!');
  }
  console.log('✔ Cha mẹ đã được giải phóng khóa buồng phối giống thành công.');

  passedTests++;
  console.log('==> TEST 3 PASSED!\n');
}

// -------------------------------------------------------------------------
// TEST 4: Mutation Probability Simulation (Giả lập 1.000 lượt lai tạo)
// -------------------------------------------------------------------------
console.log('--- TEST 4: Mô Phỏng Tỷ Lệ Đột Biến (Mutation Probability Simulation) ---');
{
  const parentA: SpiritBeast = {
    id: 'sim_parent_a',
    name: 'Viêm Lang',
    species: 'lang',
    quality: 'thuong_pham',
    element: 'Hỏa',
    level: 30,
    exp: 0,
    maxExp: 1000,
    stage: 2,
    loyalty: 80,
    stats: { hp: 1000, maxHp: 1000, atk: 100, def: 50, blockPercent: 10, mountSpeedBonus: 20, mpRegenBonus: 10 },
    skills: [],
    avatar: '🐺',
    tier: 2,
    bloodlinePurity: 50,
    generation: 0
  };

  const parentB: SpiritBeast = {
    ...parentA,
    id: 'sim_parent_b',
    name: 'Phong Điểu',
    element: 'Phong'
  };

  const facility = {
    level: 3,
    maxBreedingSlots: 4,
    incubationSpeedMultiplier: 1.5,
    mutationRateBonus: 5 // +5% từ Thú Uyển cấp 3
  };

  // Sử dụng Dục Thú Thảo (+10% mutation rate)
  // Tổng tỷ lệ lý thuyết: 15% (cơ bản) + 5% (facility) + 10% (catalyst) = 30% (0.30)
  const SIMULATION_RUNS = 1000;
  let mutationCount = 0;

  for (let i = 0; i < SIMULATION_RUNS; i++) {
    const outcome = generateBeastBreedingResult(parentA, parentB, facility, 'catalyst_duc_thu_thao');
    if (outcome.isMutated) {
      mutationCount++;
      if (!outcome.innateAura) {
        throw new Error('Thú đột biến bắt buộc phải kích hoạt Hào Quang Thiên Phú (Innate Aura)!');
      }
    }
  }

  const actualRate = (mutationCount / SIMULATION_RUNS) * 100;
  console.log(`✔ Chạy 1.000 lượt lai tạo có chất xúc tác:`);
  console.log(`   - Số lần đột biến: ${mutationCount} / ${SIMULATION_RUNS}`);
  console.log(`   - Tỷ lệ thực tế: ${actualRate.toFixed(2)}% (Kỳ vọng thiết kế: ~25% - 35%)`);

  if (actualRate < 20 || actualRate > 40) {
    throw new Error(`Tỷ lệ đột biến lệch quá lớn so với thiết kế (${actualRate}%)!`);
  }

  passedTests++;
  console.log('==> TEST 4 PASSED!\n');
}

// -------------------------------------------------------------------------
// TEST 5: Bloodline Evolution & Tier Breakthrough (Tiến hóa & Đột phá bậc)
// -------------------------------------------------------------------------
console.log('--- TEST 5: Tiến Hóa Huyết Mạch & Đột Phá Bậc (Bloodline Evolution) ---');
{
  const beastToEvolve: SpiritBeast = {
    id: 'beast_evolve_target',
    name: 'Tiểu Hỏa Kỳ Lân',
    species: 'ky_lan',
    quality: 'thuong_pham',
    element: 'Hỏa',
    level: 40,
    exp: 0,
    maxExp: 3000,
    stage: 2,
    loyalty: 100,
    stats: { hp: 3000, maxHp: 3000, atk: 300, def: 180, blockPercent: 15, mountSpeedBonus: 25, mpRegenBonus: 20 },
    skills: [],
    avatar: '🔥🦄',
    tier: 2, // Linh Thú
    bloodlinePurity: 90, // Gần đầy
    generation: 1,
    canMount: true,
    canFight: true,
    travelSpeedBonus: 25,
    combatStats: { atkBonus: 300, defBonus: 180, hpBonus: 3000 }
  };

  let player = createMockPlayer({
    linhThach: 1000000,
    beasts: [beastToEvolve],
    beastGarden: {
      facility: { level: 2, maxBreedingSlots: 3, incubationSpeedMultiplier: 1.0, mutationRateBonus: 0 },
      beasts: [beastToEvolve],
      eggs: [],
      activeMountId: null,
      activeCombatId: null,
      breedingPairs: []
    }
  });

  const evoRes = evolveBloodline(player, beastToEvolve.id, 'blood_pill');
  if (!evoRes.success || !evoRes.evolvedBeast) {
    throw new Error(`Tiến hóa huyết mạch thất bại: ${evoRes.message}`);
  }

  const evolved = evoRes.evolvedBeast;
  console.log(`✔ Đột phá thành công: [${evolved.name}]`);
  console.log(`   - Bậc phẩm: Tier ${beastToEvolve.tier} ➔ Tier ${evolved.tier} (${evolved.tier === 3 ? 'Dị Thú' : 'Khác'})`);
  console.log(`   - Tốc độ di chuyển: ${beastToEvolve.travelSpeedBonus}% ➔ ${evolved.travelSpeedBonus}%`);
  console.log(`   - Công Kích: ${beastToEvolve.combatStats!.atkBonus} ➔ ${evolved.combatStats!.atkBonus}`);
  console.log(`   - Phòng Ngự: ${beastToEvolve.combatStats!.defBonus} ➔ ${evolved.combatStats!.defBonus}`);
  console.log(`   - Khí Huyết: ${beastToEvolve.combatStats!.hpBonus} ➔ ${evolved.combatStats!.hpBonus}`);
  console.log(`   - Hào Quang Giác Ngộ: ${evolved.innateAura?.name || 'Không có'}`);

  if (evolved.tier !== 3) {
    throw new Error(`Tier phải được thăng hoa từ 2 lên 3, thực tế: ${evolved.tier}`);
  }
  if (!evolved.innateAura) {
    throw new Error('Đột phá lên Tier 3 Dị Thú phải tự động mở khóa Hào Quang Thiên Phú!');
  }
  if (evolved.combatStats!.atkBonus <= beastToEvolve.combatStats!.atkBonus) {
    throw new Error('Chỉ số công kích chưa được nhân hệ số thưởng sau đột phá!');
  }

  passedTests++;
  console.log('==> TEST 5 PASSED!\n');
}

// -------------------------------------------------------------------------
// TEST 6: Save Migration Invariant (Tự phục hồi & tương thích save game cũ)
// -------------------------------------------------------------------------
console.log('--- TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant) ---');
{
  // Giả lập mock save game phiên bản cũ v1/v2 chỉ có mounts và pets mộc
  const mockOldSave = {
    name: 'Cổ Tu Tiên Nhân',
    linhThach: 888888,
    mounts: [
      { id: 'mount_legacy_1', name: 'Thanh Phong Mã', speed: 25, quality: 'trung_pham' },
      { id: 'mount_legacy_2', name: 'Kim Giáp Hổ', speed: 30, quality: 'thuong_pham' }
    ],
    pets: [
      { id: 'pet_legacy_1', name: 'Tiểu Hỏa Điểu', atk: 200, def: 80, hp: 1800, quality: 'thuong_pham' }
    ],
    beasts: [
      {
        id: 'beast_old_1',
        name: 'U Minh Lang',
        species: 'lang',
        quality: 'trung_pham',
        stage: 1,
        level: 10,
        loyalty: 70,
        stats: { hp: 1200, maxHp: 1200, atk: 120, def: 60, blockPercent: 10, mountSpeedBonus: 15, mpRegenBonus: 10 },
        skills: []
        // Không có các trường huyết mạch mới: tier, bloodlinePurity, generation, isHybrid...
      }
    ]
  };

  const migrated = migrateBeastGardenData(mockOldSave);

  if (!migrated.beastGarden) {
    throw new Error('migrateBeastGardenData không khởi tạo trường beastGarden!');
  }

  const allMigratedBeasts = migrated.beastGarden.beasts;
  console.log(`✔ Đã di chuyển và chuẩn hóa tổng cộng ${allMigratedBeasts.length} linh thú từ save cũ:`);

  // Kiểm tra không có trường nào bị undefined
  for (const beast of allMigratedBeasts) {
    if (beast.tier === undefined || typeof beast.tier !== 'number') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường tier!`);
    }
    if (beast.bloodlinePurity === undefined || typeof beast.bloodlinePurity !== 'number') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường bloodlinePurity!`);
    }
    if (beast.generation === undefined || typeof beast.generation !== 'number') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường generation!`);
    }
    if (beast.isHybrid === undefined || typeof beast.isHybrid !== 'boolean') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường isHybrid!`);
    }
    if (beast.canMount === undefined || typeof beast.canMount !== 'boolean') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường canMount!`);
    }
    if (beast.canFight === undefined || typeof beast.canFight !== 'boolean') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường canFight!`);
    }
    if (beast.travelSpeedBonus === undefined || typeof beast.travelSpeedBonus !== 'number') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường travelSpeedBonus!`);
    }
    if (!beast.combatStats || typeof beast.combatStats.atkBonus !== 'number') {
      throw new Error(`Linh thú [${beast.id}] bị thiếu combatStats.atkBonus!`);
    }
    if (beast.isLockedInBreeding === undefined) {
      throw new Error(`Linh thú [${beast.id}] bị thiếu trường isLockedInBreeding!`);
    }
    console.log(`   - [${beast.name}] (ID: ${beast.id}): Tier ${beast.tier} | Purity ${beast.bloodlinePurity}% | Mount: ${beast.canMount} | Fight: ${beast.canFight}`);
  }

  // Bảo toàn ID cũ
  const hasMount1 = allMigratedBeasts.some((b: any) => b.id === 'mount_legacy_1');
  const hasPet1 = allMigratedBeasts.some((b: any) => b.id === 'pet_legacy_1');
  const hasBeast1 = allMigratedBeasts.some((b: any) => b.id === 'beast_old_1');
  if (!hasMount1 || !hasPet1 || !hasBeast1) {
    throw new Error('Không bảo toàn ID của các linh thú cũ trong save game!');
  }
  console.log('✔ Bảo toàn 100% ID linh thú cũ từ save game phiên bản trước.');

  passedTests++;
  console.log('==> TEST 6 PASSED!\n');
}

console.log('================================================================');
console.log(`🎉 HOÀN TẤT KIỂM THỬ: ${passedTests}/${totalTests} TESTS PASSED (100% THÀNH CÔNG)`);
console.log('================================================================');
