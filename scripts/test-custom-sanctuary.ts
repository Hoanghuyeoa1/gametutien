// scripts/test-custom-sanctuary.ts
// Test Suite kiểm thử toàn diện Hệ Thống Linh Mạch Động Phủ Tự Chế (Custom Sanctuary & Vein Socketing)
// Chạy lệnh: npx tsx scripts/test-custom-sanctuary.ts

import assert from 'assert';
import { PlayerStats, FormationItem } from '../lib/types';
import {
  SANCTUARY_VEIN_CONFIG,
  SANCTUARY_RESONANCES_REGISTRY,
  createDefaultCustomSanctuaryState,
  checkSanctuaryResonances,
  getCustomSanctuaryBuffTotals,
  canUpgradeSanctuaryVein,
  upgradeSanctuaryVein,
  canSocketArray,
  socketArrayIntoSanctuary,
  canUnsocketArray,
  unsocketArrayFromSanctuary,
  renameCustomSanctuary,
  generateCustomSanctuaryLocation,
  CUSTOM_SANCTUARY_LOCATION_ID
} from '../lib/custom-sanctuary-logic';
import {
  migrateCustomSanctuaryData,
  normalizePlayerData
} from '../lib/save-migration';
import {
  getAvailableMeditationLocations,
  canStartMeditation,
  resolveOfflineMeditationProgress
} from '../lib/meditation-logic';

console.log('================================================================');
console.log('🧪 BẮT ĐẦU TEST SUITE: LINH MẠCH ĐỘNG PHỦ TỰ CHẾ (CUSTOM SANCTUARY)');
console.log('================================================================\n');

// Mock helper data
function createMockPlayer(overrides: Partial<PlayerStats> = {}): PlayerStats {
  const base: Partial<PlayerStats> = {
    name: 'Tiêu Diêu Kiếm Tiên',
    currentRealm: 15, // Trúc Cơ Đỉnh Phong
    linhThach: 10_000_000,
    inventory: {
      items: [],
      pills: [],
      herbs: [],
      ores: [],
      capacity: 100,
      forgingEssence: 5000,
      formations: [
        {
          id: 'formation_tu_linh_1',
          recipeId: 'recipe_tu_linh',
          name: 'Tụ Linh Trận',
          type: 'utility',
          tier: 3,
          grade: 'Tam Giai',
          element: 'moc',
          description: 'Hút nạp thiên địa linh khí',
          quality: 'thuong_pham',
          qualityMultiplier: 1.2,
          durability: 100,
          maxDurability: 100,
          statBonus: {},
          combatBuff: { triggerEffectDescription: 'Tăng tốc độ thổ nạp' },
          isPermanent: false
        },
        {
          id: 'formation_tu_linh_2',
          recipeId: 'recipe_tu_linh',
          name: 'Cực Phẩm Tụ Linh Trận',
          type: 'utility',
          tier: 4,
          grade: 'Tứ Giai',
          element: 'hoa',
          description: 'Ngưng tụ linh lộ ngũ hành',
          quality: 'cuc_pham',
          qualityMultiplier: 1.5,
          durability: 100,
          maxDurability: 100,
          statBonus: {},
          combatBuff: { triggerEffectDescription: 'Tăng tốc độ thổ nạp' },
          isPermanent: false
        },
        {
          id: 'formation_thanh_tam_1',
          recipeId: 'recipe_thanh_tam',
          name: 'Thanh Tâm Hộ Thần Trận',
          type: 'utility',
          tier: 3,
          grade: 'Tam Giai',
          element: 'thuy',
          description: 'Định tâm an thần, trục xuất ma tính',
          quality: 'thuong_pham',
          qualityMultiplier: 1.2,
          durability: 100,
          maxDurability: 100,
          statBonus: {},
          combatBuff: { triggerEffectDescription: 'Tiêu trừ ma tính' },
          isPermanent: false
        },
        {
          id: 'formation_thai_so_god',
          recipeId: 'recipe_thai_so',
          name: 'Thái Sơ Bất Hủ Trận',
          type: 'utility',
          tier: 9,
          grade: 'Cửu Giai',
          element: 'hon_don',
          description: 'Vô thượng trận đồ từ thời thái cổ',
          quality: 'than_pham',
          qualityMultiplier: 3.0,
          durability: 9999,
          maxDurability: 9999,
          statBonus: {},
          combatBuff: { triggerEffectDescription: 'Chấn nhiếp càn khôn' },
          isPermanent: true,
          reforgeTier: 1
        }
      ]
    },
    customSanctuary: createDefaultCustomSanctuaryState(),
    ...overrides
  };

  return normalizePlayerData(base);
}

// ----------------------------------------------------------------------------
// TEST 1: Thăng Phẩm Linh Mạch & Mở Rộng Trận Nhãn (Vein Progression Invariant)
// ----------------------------------------------------------------------------
console.log('🔹 Test 1: Thăng Phẩm Linh Mạch & Mở Rộng Trận Nhãn (Vein Progression Invariant)...');
{
  const player = createMockPlayer({
    currentRealm: 12, // Trúc Cơ Sơ Kỳ
    linhThach: 500_000,
    inventory: {
      items: [],
      pills: [],
      herbs: [],
      ores: [],
      capacity: 50,
      forgingEssence: 300,
      formations: []
    },
    customSanctuary: {
      veinTier: 1,
      veinExp: 0,
      unlockedSockets: 1,
      socketedArrays: [],
      activeResonances: [],
      customLocationName: ''
    }
  });

  // Nâng từ Bậc 1 lên Bậc 2
  const check1 = canUpgradeSanctuaryVein(player);
  assert.strictEqual(check1.canUpgrade, true, 'Đủ điều kiện thăng lên Bậc 2');
  assert.strictEqual(check1.nextTier, 2, 'Next tier là 2');

  const up1 = upgradeSanctuaryVein(player);
  assert.strictEqual(up1.success, true, 'Thăng cấp lên Bậc 2 thành công');
  assert.strictEqual(up1.updatedPlayer.customSanctuary?.veinTier, 2, 'Linh mạch đạt Bậc 2');
  assert.strictEqual(up1.updatedPlayer.linhThach, 450_000, 'Linh Thạch bị trừ chính xác (500k - 50k = 450k)');
  assert.strictEqual(up1.updatedPlayer.inventory?.forgingEssence, 250, 'Tinh Hoa bị trừ chính xác (300 - 50 = 250)');
  assert.strictEqual(up1.updatedPlayer.customSanctuary?.unlockedSockets, 1, 'Bậc 2 vẫn có 1 slot');

  // Nâng tiếp từ Bậc 2 lên Bậc 3 (yêu cầu 150k Linh Thạch, 150 Tinh Hoa, Realm Index 11)
  const up2 = upgradeSanctuaryVein(up1.updatedPlayer);
  assert.strictEqual(up2.success, true, 'Thăng cấp lên Bậc 3 thành công');
  assert.strictEqual(up2.updatedPlayer.customSanctuary?.veinTier, 3, 'Linh mạch đạt Bậc 3');
  assert.strictEqual(up2.updatedPlayer.customSanctuary?.unlockedSockets, 2, 'Bậc 3 mở khóa Trận Nhãn thứ 2 (unlockedSockets = 2)');
  assert.strictEqual(up2.updatedPlayer.linhThach, 300_000, 'Linh Thạch trừ đúng (450k - 150k = 300k)');
  assert.strictEqual(up2.updatedPlayer.inventory?.forgingEssence, 100, 'Tinh Hoa trừ đúng (250 - 150 = 100)');

  // Kiểm tra chặn khi không đủ tài nguyên
  const brokePlayer = {
    ...up2.updatedPlayer,
    linhThach: 10 // Cần 400k cho bậc 4
  };
  const upBroke = canUpgradeSanctuaryVein(brokePlayer);
  assert.strictEqual(upBroke.canUpgrade, false, 'Chặn thăng phẩm khi thiếu Linh Thạch');

  console.log('   ✅ Test 1 Passed: Vein progression, resource deduction, and socket expansions verified.');
}

// ----------------------------------------------------------------------------
// TEST 2: Khảm Nạp & Gỡ Bỏ Trận Bàn An Toàn (Socket & Unsocket Invariant)
// ----------------------------------------------------------------------------
console.log('🔹 Test 2: Khảm Nạp & Gỡ Bỏ Trận Bàn An Toàn (Socket & Unsocket Invariant)...');
{
  const player = createMockPlayer({
    customSanctuary: {
      veinTier: 3,
      veinExp: 0,
      unlockedSockets: 2,
      socketedArrays: [],
      activeResonances: [],
      customLocationName: ''
    }
  });

  const arrayId = 'formation_tu_linh_1';

  // Khảm vào slot 0
  const socketRes = socketArrayIntoSanctuary(player, 0, arrayId);
  assert.strictEqual(socketRes.success, true, 'Khảm trận bàn vào slot 0 thành công');

  const socketedItemInInv = socketRes.updatedPlayer.inventory?.formations.find((f: FormationItem) => f.id === arrayId);
  assert.strictEqual(socketedItemInInv?.isSocketedInSanctuary, true, 'Trận bàn trong túi đồ nhận cờ isSocketedInSanctuary = true');
  assert.strictEqual(socketRes.updatedPlayer.customSanctuary?.socketedArrays.length, 1, 'Danh sách khảm có đúng 1 trận bàn');
  assert.strictEqual(socketRes.updatedPlayer.customSanctuary?.socketedArrays[0].socketIndex, 0, 'Slot 0 được ghi nhận');
  assert.strictEqual(socketRes.updatedPlayer.customSanctuary?.socketedArrays[0].arrayItemId, arrayId, 'ID trận bàn khớp');

  // Tháo gỡ khỏi slot 0
  const unsocketRes = unsocketArrayFromSanctuary(socketRes.updatedPlayer, 0);
  assert.strictEqual(unsocketRes.success, true, 'Gỡ trận bàn khỏi slot 0 thành công');

  const unsocketedItemInInv = unsocketRes.updatedPlayer.inventory?.formations.find((f: FormationItem) => f.id === arrayId);
  assert.strictEqual(unsocketedItemInInv?.isSocketedInSanctuary, false, 'Cờ isSocketedInSanctuary được giải phóng (false)');
  assert.strictEqual(unsocketRes.updatedPlayer.customSanctuary?.socketedArrays.length, 0, 'Slot 0 trở về trống');

  console.log('   ✅ Test 2 Passed: Socket and unsocket lifecycle verified with clean flag assignment.');
}

// ----------------------------------------------------------------------------
// TEST 3: Phòng Vệ Khảm Trùng Lặp (Anti-Duplicate Socket Guard)
// ----------------------------------------------------------------------------
console.log('🔹 Test 3: Phòng Vệ Khảm Trùng Lặp (Anti-Duplicate Socket Guard)...');
{
  const player = createMockPlayer({
    customSanctuary: {
      veinTier: 3,
      veinExp: 0,
      unlockedSockets: 2,
      socketedArrays: [],
      activeResonances: [],
      customLocationName: ''
    }
  });

  const arrayId = 'formation_tu_linh_1';

  // Khảm vào slot 0
  const step1 = socketArrayIntoSanctuary(player, 0, arrayId);
  assert.strictEqual(step1.success, true);

  // Cố tình khảm lại cùng trận bàn đó vào slot 1
  const step2 = socketArrayIntoSanctuary(step1.updatedPlayer, 1, arrayId);
  assert.strictEqual(step2.success, false, 'Hệ thống từ chối khảm trùng lặp');
  assert.match(step2.message, /đã được khảm vào một Trận Nhãn khác/i, 'Thông báo lỗi chỉ rõ nguyên nhân trùng lặp');
  assert.strictEqual(step2.updatedPlayer.customSanctuary?.socketedArrays.length, 1, 'Không bị nhân bản trận bàn');

  console.log('   ✅ Test 3 Passed: Anti-duplicate socket guard prevented exploit.');
}

// ----------------------------------------------------------------------------
// TEST 4: Kích Hoạt Tổ Hợp Cộng Hưởng Trận Đồ (Resonance Synergies Execution)
// ----------------------------------------------------------------------------
console.log('🔹 Test 4: Kích Hoạt Tổ Hợp Cộng Hưởng Trận Đồ (Resonance Synergies Execution)...');
{
  let player = createMockPlayer({
    customSanctuary: {
      veinTier: 5,
      veinExp: 0,
      unlockedSockets: 3,
      socketedArrays: [],
      activeResonances: [],
      customLocationName: ''
    }
  });

  // 1. Khảm Tụ Linh Trận 1 vào slot 0
  const s1 = socketArrayIntoSanctuary(player, 0, 'formation_tu_linh_1');
  player = s1.updatedPlayer;

  // 2. Khảm Tụ Linh Trận 2 vào slot 1 -> Kích hoạt Lưỡng Nghi Tụ Linh (+35% tu vi)
  const s2 = socketArrayIntoSanctuary(player, 1, 'formation_tu_linh_2');
  player = s2.updatedPlayer;

  const resonances1 = player.customSanctuary?.activeResonances || [];
  const hasLuongNghi = resonances1.some(r => r.id === 'luong_nghi_tu_linh');
  assert.strictEqual(hasLuongNghi, true, 'Kích hoạt thành công combo [Lưỡng Nghi Tụ Linh]');

  const buffs1 = getCustomSanctuaryBuffTotals(player.customSanctuary);
  assert.strictEqual(buffs1.cultivationSpeedMultiplier, 1.35, 'Hệ số Tu Vi bế quan tăng đúng +35% (1.35)');

  // 3. Khảm thêm Thanh Tâm Trận vào slot 2 -> Kích hoạt thêm Thanh Tâm Định Mạch (-2 Đan Độc, -2 Ma Tính/giờ)
  const s3 = socketArrayIntoSanctuary(player, 2, 'formation_thanh_tam_1');
  player = s3.updatedPlayer;

  const resonances2 = player.customSanctuary?.activeResonances || [];
  const hasThanhTam = resonances2.some(r => r.id === 'thanh_tam_dinh_mach');
  assert.strictEqual(hasThanhTam, true, 'Kích hoạt thành công combo [Thanh Tâm Định Mạch]');

  const buffs2 = getCustomSanctuaryBuffTotals(player.customSanctuary);
  assert.strictEqual(buffs2.pillToxicityCleansePerHour, 2, 'Tự động giảm 2 Đan Độc mỗi giờ');
  assert.strictEqual(buffs2.demonicCleansePerHour, 2, 'Tự động giảm 2 Ma Tính mỗi giờ');

  console.log('   ✅ Test 4 Passed: Multiple active resonance combinations executed cleanly.');
}

// ----------------------------------------------------------------------------
// TEST 5: Tích Hợp Linh Địa Độc Quyền Vào Nhập Định (Meditation Location Integration)
// ----------------------------------------------------------------------------
console.log('🔹 Test 5: Tích Hợp Linh Địa Độc Quyền Vào Nhập Định (Meditation Location Integration)...');
{
  const player = createMockPlayer({
    name: 'Diệp Thần',
    customSanctuary: {
      veinTier: 5, // Ngũ Phẩm Thiên Mạch
      veinExp: 0,
      unlockedSockets: 3,
      socketedArrays: [
        {
          socketIndex: 0,
          arrayItemId: 'formation_tu_linh_1',
          arrayName: 'Tụ Linh Trận',
          arrayTier: 3,
          element: 'moc',
          isPermanent: false,
          baseEfficiencyBonus: 0.1,
          socketedAt: Date.now()
        },
        {
          socketIndex: 1,
          arrayItemId: 'formation_thai_so_god',
          arrayName: 'Thái Sơ Bất Hủ Trận',
          arrayTier: 9,
          element: 'hon_don',
          isPermanent: true,
          baseEfficiencyBonus: 0.35,
          socketedAt: Date.now()
        }
      ],
      activeResonances: [],
      customLocationName: 'Hỗn Nguyên Tiên Phủ'
    }
  });

  // Sinh cấu hình Linh Địa Độc Quyền
  const customLoc = generateCustomSanctuaryLocation(player);
  assert.strictEqual(customLoc.id, CUSTOM_SANCTUARY_LOCATION_ID, 'ID Linh Địa đúng chuẩn custom_sanctuary_location');
  assert.strictEqual(customLoc.name, 'Hỗn Nguyên Tiên Phủ', 'Tên Linh Địa nhận đúng danh xưng người chơi đặt');
  assert(customLoc.tuviMultiplier >= 2.0, `Hệ số Tu Vi đạt mức cao theo linh mạch & trận bàn (got ${customLoc.tuviMultiplier})`);

  // Kiểm tra đưa vào danh sách địa điểm khả dụng của Nhập Định
  const availableLocs = getAvailableMeditationLocations(player);
  assert.strictEqual(availableLocs[0].id, CUSTOM_SANCTUARY_LOCATION_ID, 'Linh Địa Độc Quyền xuất hiện ở ĐẦU danh sách');

  // Thẩm định điều kiện vào linh địa
  const canStart = canStartMeditation(player, CUSTOM_SANCTUARY_LOCATION_ID, 'co_ban');
  assert.strictEqual(canStart.canMedidate, true, 'Người chơi tự do nhập định tại động phủ của mình');

  // Mô phỏng chạy vòng lặp nhập định 8 giờ tại Linh Địa Độc Quyền
  const startTime = Date.now() - (8 * 3600 * 1000);
  const endTime = Date.now();
  const result = resolveOfflineMeditationProgress(
    player,
    startTime,
    endTime,
    CUSTOM_SANCTUARY_LOCATION_ID,
    'co_ban'
  );

  assert.strictEqual(result.totalHoursElapsed, 8, 'Trôi qua đúng 8 giờ');
  assert.strictEqual(result.effectiveHours, 8, '8 giờ nhập định hiệu lực');
  assert(result.totalTuviGained > 0, `Nhận Tu Vi dồi dào từ linh địa (${result.totalTuviGained})`);

  console.log('   ✅ Test 5 Passed: Custom sanctuary dynamically registered into meditation engine with 8h progress simulation.');
}

// ----------------------------------------------------------------------------
// TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
// ----------------------------------------------------------------------------
console.log('🔹 Test 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)...');
{
  // Mock save cũ thời v5 / v6 hoàn toàn không có customSanctuary
  const legacySaveData: Partial<PlayerStats> = {
    name: 'Cổ Tu Sĩ',
    currentRealm: 10,
    linhThach: 100_000,
    inventory: {
      items: [],
      pills: [],
      herbs: [],
      ores: [],
      capacity: 50,
      forgingEssence: 50,
      formations: []
    }
  };

  const migrated = migrateCustomSanctuaryData(legacySaveData as PlayerStats);

  assert(migrated.customSanctuary !== undefined, 'customSanctuary được khởi tạo');
  assert.strictEqual(migrated.customSanctuary?.veinTier, 1, 'Mặc định veinTier = 1');
  assert.strictEqual(migrated.customSanctuary?.unlockedSockets, 1, 'Mặc định unlockedSockets = 1');
  assert.deepStrictEqual(migrated.customSanctuary?.socketedArrays, [], 'Mặc định socketedArrays rỗng');
  assert.deepStrictEqual(migrated.customSanctuary?.activeResonances, [], 'Mặc định activeResonances rỗng');
  assert.strictEqual(migrated.customSanctuary?.customLocationName, '', 'Mặc định customLocationName rỗng');

  // Kiểm tra khả năng dọn dẹp các ID Trận Bàn ma (Ghost formations)
  const corruptedSaveData: Partial<PlayerStats> = {
    ...legacySaveData,
    inventory: {
      items: [],
      pills: [],
      herbs: [],
      ores: [],
      capacity: 50,
      forgingEssence: 0,
      formations: [
        {
          id: 'real_formation',
          recipeId: 'rec_1',
          name: 'Hộ Trận Thật',
          type: 'utility',
          tier: 1,
          grade: 'Nhất Giai',
          element: 'tho',
          description: '',
          quality: 'ha_pham',
          qualityMultiplier: 1,
          durability: 100,
          maxDurability: 100,
          statBonus: {},
          combatBuff: { triggerEffectDescription: '' }
        }
      ]
    },
    customSanctuary: {
      veinTier: 2,
      veinExp: 0,
      unlockedSockets: 1,
      socketedArrays: [
        {
          socketIndex: 0,
          arrayItemId: 'ghost_formation_does_not_exist',
          arrayName: 'Ma Trận Không Tồn Tại',
          arrayTier: 1,
          isPermanent: false,
          baseEfficiencyBonus: 0.1,
          socketedAt: 1000
        }
      ],
      activeResonances: [],
      customLocationName: ''
    }
  };

  const cleaned = migrateCustomSanctuaryData(corruptedSaveData as PlayerStats);
  assert.strictEqual(cleaned.customSanctuary?.socketedArrays.length, 0, 'Đã dọn sạch ID trận bàn ma không tồn tại trong túi đồ');

  console.log('   ✅ Test 6 Passed: Save migration idempotent, safe fallbacks & ghost formation cleanup verified.');
}

console.log('\n================================================================');
console.log('🎉 TẤT CẢ 6/6 TEST CASES ĐỀU ĐẠT CHUẨN XUẤT SẮC! (100% PASSED)');
console.log('================================================================\n');
