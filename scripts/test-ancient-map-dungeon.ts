// scripts/test-ancient-map-dungeon.ts
// Automated Test Suite for "Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh"
// Run: npx tsx scripts/test-ancient-map-dungeon.ts

import {
  ANCIENT_MAP_SETS_REGISTRY,
  rollMeditationMapFragment,
  synthesizeAncientMap,
  openAncientDungeonInstance,
  resolveDungeonStageBattle,
  createDefaultAncientMapVault
} from '../lib/ancient-map-dungeon-logic';
import { migrateAncientMapDungeonData } from '../lib/save-migration';
import { PlayerStats } from '../lib/types';
import { AncientMapVaultState } from '../lib/types/ancient-map-dungeon';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('=== TEST SUITE: ANCIENT MAP FRAGMENTS & DUNGEONS ===\n');

// ============================================================================
// TEST 1: Kiểm Tra Rơi Mảnh Trong Nhập Định (Meditation Drop Verification)
// ============================================================================
console.log('--- Test 1: Meditation Drop Verification ---');
{
  const totalHours = 100;
  let dropsCount = 0;
  const droppedFragments: any[] = [];

  // Giả lập 100 giờ ở thế Hiểm Cảnh tại Thần Ma Cổ Chiến Trường (tỷ lệ 9% = 0.09)
  // Sử dụng pseudo-random có hạt giống dự đoán được
  for (let h = 1; h <= totalHours; h++) {
    // Phân bổ đều roll từ 0.005 đến 0.995
    const pseudoRoll = ((h * 37) % 100) / 100;
    const fragment = rollMeditationMapFragment(
      'than_ma_co_chien_truong',
      'hiem_canh',
      h,
      20, // Kim Đan Viên Mãn
      pseudoRoll
    );

    if (fragment) {
      dropsCount++;
      droppedFragments.push(fragment);

      assert(Boolean(fragment.id), `Mảnh rơi phải có ID hợp lệ (giờ ${h})`);
      assert(Boolean(fragment.setId), `Mảnh rơi phải thuộc về một bộ di tích (giờ ${h})`);
      assert(
        ['dong', 'tay', 'nam', 'bac'].includes(fragment.direction),
        `Hướng của mảnh phải là đông/tây/nam/bắc, nhận được: ${fragment.direction}`
      );
      assert(
        [1, 2, 3, 4].includes(fragment.pieceIndex),
        `pieceIndex phải từ 1 đến 4, nhận được: ${fragment.pieceIndex}`
      );
      assert(fragment.rarityTier >= 1, `rarityTier phải >= 1`);
    }
  }

  // Tỷ lệ lý thuyết là 9%, trên 100 mẫu với pseudoRoll ((h*37)%100)/100, số lượng roll < 0.09 là 9 mảnh
  console.log(`  -> Số mảnh thu thập được sau 100 giờ nhập định: ${dropsCount} mảnh`);
  assert(
    dropsCount >= 5 && dropsCount <= 12,
    `Tỷ lệ rơi phải nằm trong biên độ thiết kế (khoảng 5 - 12 mảnh sau 100 giờ), thực tế: ${dropsCount}`
  );
  console.log('[PASS] Test 1: Meditation Drop Verification passed successfully!\n');
}

// ============================================================================
// TEST 2: Thẩm Định Điều Kiện Ghép Mảnh (Synthesis Gating Guard)
// ============================================================================
console.log('--- Test 2: Synthesis Gating Guard ---');
{
  const vault: AncientMapVaultState = {
    fragmentsInventory: {
      frag_kiem_chung_dong: 2,
      frag_kiem_chung_tay: 1,
      frag_kiem_chung_nam: 1
      // Thiếu mảnh Bắc (frag_kiem_chung_bac)
    },
    synthesizedMaps: [],
    activeDungeon: null,
    clearedDungeonsCount: 0
  };

  const stonesCost = ANCIENT_MAP_SETS_REGISTRY.thai_co_kiem_chung.synthesisCostStones;

  // 1. Thử ghép khi thiếu mảnh Bắc
  const failResult = synthesizeAncientMap(vault, 'thai_co_kiem_chung', stonesCost + 10000);
  assert(failResult.success === false, 'Hệ thống phải từ chối ghép khi thiếu mảnh Bắc');
  assert(Boolean(failResult.reason), 'Phải có lý do giải thích từ chối');
  assert(vault.synthesizedMaps.length === 0, 'Kho bí đồ không được tăng khi thất bại');
  assert(vault.fragmentsInventory.frag_kiem_chung_dong === 2, 'Số mảnh Đông không được bị trừ');

  // 2. Thử ghép khi thiếu Linh Thạch
  vault.fragmentsInventory.frag_kiem_chung_bac = 1; // Đã bổ sung đủ mảnh Bắc
  const failNoStones = synthesizeAncientMap(vault, 'thai_co_kiem_chung', stonesCost - 100);
  assert(failNoStones.success === false, 'Hệ thống phải từ chối khi không đủ Linh Thạch');

  // 3. Ghép thành công khi đủ cả 4 mảnh và đủ Linh Thạch
  const successResult = synthesizeAncientMap(vault, 'thai_co_kiem_chung', stonesCost + 5000);
  assert(successResult.success === true, 'Hệ thống phải ghép thành công khi đủ 4 mảnh và đủ Linh Thạch');
  assert(Boolean(successResult.createdMap), 'Phải tạo ra đối tượng CompleteAncientMapItem');
  assert(successResult.createdMap?.setId === 'thai_co_kiem_chung', 'Bí đồ phải thuộc bộ thai_co_kiem_chung');
  assert(successResult.vault.synthesizedMaps.length === 1, 'Kho bí đồ phải tăng đúng 1');

  // Kiểm tra trừ nguyên tử: mỗi mảnh trừ đúng 1 chiếc
  assert(
    successResult.vault.fragmentsInventory.frag_kiem_chung_dong === 1,
    `Mảnh Đông phải giảm từ 2 xuống 1, thực tế: ${successResult.vault.fragmentsInventory.frag_kiem_chung_dong}`
  );
  assert(
    !successResult.vault.fragmentsInventory.frag_kiem_chung_tay,
    'Mảnh Tây (vốn có 1) phải bị xóa khỏi kho sau khi trừ'
  );
  assert(
    !successResult.vault.fragmentsInventory.frag_kiem_chung_nam,
    'Mảnh Nam (vốn có 1) phải bị xóa khỏi kho sau khi trừ'
  );
  assert(
    !successResult.vault.fragmentsInventory.frag_kiem_chung_bac,
    'Mảnh Bắc (vốn có 1) phải bị xóa khỏi kho sau khi trừ'
  );

  console.log('[PASS] Test 2: Synthesis Gating Guard passed successfully!\n');
}

// ============================================================================
// TEST 3: Phòng Vệ Ghép Trùng Mảnh Khác Bộ (Cross-Set Rejection Invariant)
// ============================================================================
console.log('--- Test 3: Cross-Set Rejection Invariant ---');
{
  const vault: AncientMapVaultState = {
    fragmentsInventory: {
      frag_kiem_chung_dong: 1,
      frag_kiem_chung_tay: 1,
      frag_kiem_chung_nam: 1,
      // Cố tình thay mảnh Bắc của Kiếm Chủng bằng mảnh Bắc của Chân Long Di Tích!
      frag_chan_long_bac: 1
    },
    synthesizedMaps: [],
    activeDungeon: null,
    clearedDungeonsCount: 0
  };

  const stones = 50000;
  const result = synthesizeAncientMap(vault, 'thai_co_kiem_chung', stones);
  assert(
    result.success === false,
    'Hệ thống phải từ chối ghép khi có mảnh Bắc của bộ khác, không được chấp nhận cross-set'
  );
  assert(
    vault.fragmentsInventory.frag_kiem_chung_dong === 1,
    'Không được trừ bất kỳ mảnh nào khi cross-set bị từ chối'
  );
  assert(
    vault.fragmentsInventory.frag_chan_long_bac === 1,
    'Mảnh bộ khác phải giữ nguyên không bị trừ'
  );

  console.log('[PASS] Test 3: Cross-Set Rejection Invariant passed successfully!\n');
}

// ============================================================================
// TEST 4: Mở Phó Bản & Giới Hạn Thời Gian (Instance Creation & Expiration)
// ============================================================================
console.log('--- Test 4: Instance Creation & Expiration ---');
{
  const mapItem = {
    id: 'map_kiem_chung_test_01',
    setId: 'thai_co_kiem_chung',
    name: 'Thái Cổ Kiếm Chủng Tàn Đồ',
    tier: 2 as const,
    targetDungeonName: 'Thái Cổ Kiếm Chủng Bí Cảnh',
    requiredRealmIndex: 16,
    description: 'Bản đồ thử nghiệm',
    synthesizedAt: Date.now(),
    spiritStonesCost: 5000
  };

  const vault: AncientMapVaultState = {
    fragmentsInventory: {},
    synthesizedMaps: [mapItem],
    activeDungeon: null,
    clearedDungeonsCount: 0
  };

  // 1. Thử mở khi cảnh giới người chơi chưa đủ (ví dụ realmIndex = 10, Luyện Khí)
  const failRealm = openAncientDungeonInstance(vault, mapItem.id, 10);
  assert(failRealm.success === false, 'Phải từ chối mở phó bản khi cảnh giới chưa đạt yêu cầu');
  assert(vault.synthesizedMaps.length === 1, 'Bí đồ không bị tiêu hao khi mở thất bại');

  // 2. Mở thành công với cảnh giới đạt yêu cầu (realmIndex = 16)
  const openRes = openAncientDungeonInstance(vault, mapItem.id, 16);
  assert(openRes.success === true, 'Khai mở phó bản thành công');
  assert(openRes.vault.synthesizedMaps.length === 0, 'Bí đồ phải được tiêu hao khỏi danh sách');
  assert(Boolean(openRes.instance), 'Phải khởi tạo đối tượng instance');

  const instance = openRes.instance!;
  assert(instance.stages.length === 3, 'Phó bản cổ đại bắt buộc phải có đúng 3 tầng ải');
  assert(instance.currentStageIndex === 1, 'Ải ban đầu phải là ải 1');
  assert(instance.isCompleted === false, 'Trạng thái ban đầu chưa hoàn thành');

  // Kiểm tra hạn giờ 2 tiếng chính xác
  const twoHoursMs = 2 * 3600 * 1000;
  const diff = instance.expiresAt - instance.openedAt;
  assert(diff === twoHoursMs, `Thời hạn tồn tại phải đúng 2 giờ (7,200,000 ms), thực tế diff: ${diff}`);

  // 3. Thử mở tiếp bí đồ khác khi phó bản cũ vẫn đang mở
  const secondMap = { ...mapItem, id: 'map_second_02' };
  openRes.vault.synthesizedMaps.push(secondMap);
  const duplicateOpen = openAncientDungeonInstance(openRes.vault, secondMap.id, 16);
  assert(
    duplicateOpen.success === false,
    'Không thể mở phó bản mới khi phó bản hiện tại chưa kết thúc hoặc chưa hết hạn'
  );

  console.log('[PASS] Test 4: Instance Creation & Expiration passed successfully!\n');
}

// ============================================================================
// TEST 5: Tiến Trình Đánh Boss & Trao Thần Binh (Combat Progression & Divine Reward)
// ============================================================================
console.log('--- Test 5: Combat Progression & Divine Reward ---');
{
  const mockPlayer: PlayerStats = {
    name: 'Đạo Tổ Test',
    currentRealm: 25, // Nguyên Anh Viên Mãn
    khiVan: 100,
    canCot: 100,
    ngoTinh: 100,
    tamCanh: 100,
    tuVi: 100000,
    linhThach: 10000,
    danhVong: 500,
    linhCan: {
      name: 'Thiên Phẩm Kim Linh Căn',
      element: 'kim',
      purity: 100,
      grade: 'Thần Phẩm',
      description: 'Linh căn chí tôn',
      damageBonus: 50,
      speedBonus: 20
    },
    inventory: {
      equipment: [],
      pills: [],
      herbs: [],
      ores: []
    }
  };

  const mapItem = {
    id: 'map_kiem_chung_combat',
    setId: 'thai_co_kiem_chung',
    name: 'Thái Cổ Kiếm Chủng Tàn Đồ',
    tier: 2 as const,
    targetDungeonName: 'Thái Cổ Kiếm Chủng Bí Cảnh',
    requiredRealmIndex: 16,
    description: 'Thử nghiệm chiến đấu',
    synthesizedAt: Date.now(),
    spiritStonesCost: 5000
  };

  const initialVault: AncientMapVaultState = {
    fragmentsInventory: {},
    synthesizedMaps: [mapItem],
    activeDungeon: null,
    clearedDungeonsCount: 0
  };

  const openRes = openAncientDungeonInstance(initialVault, mapItem.id, 20);
  assert(openRes.success === true, 'Mở phó bản thành công');

  let currentVault = openRes.vault;
  let currentPlayer = mockPlayer;

  // 1. Đánh Ải 1 (Hộ Trận Cổ Thần)
  const stage1Res = resolveDungeonStageBattle(currentPlayer, currentVault, 1, undefined, { forceVictory: true });
  assert(stage1Res.victory === true, 'Player cảnh giới cao phải thắng Ải 1');
  assert(
    stage1Res.updatedVault.activeDungeon?.stages[0].isCleared === true,
    'Ải 1 phải được đánh dấu isCleared = true'
  );
  assert(
    stage1Res.updatedVault.activeDungeon?.currentStageIndex === 2,
    'Ải tiếp theo phải tự động chuyển sang Ải 2'
  );
  assert(
    stage1Res.updatedVault.activeDungeon?.isCompleted === false,
    'Phó bản chưa được đánh dấu hoàn thành sau ải 1'
  );

  currentPlayer = stage1Res.updatedPlayer;
  currentVault = stage1Res.updatedVault;

  // 2. Cố tình đánh lại Ải 1 hoặc nhảy cóc sang Ải 3
  const invalidJumpRes = resolveDungeonStageBattle(currentPlayer, currentVault, 3);
  assert(
    invalidJumpRes.victory === false,
    'Không thể nhảy cóc sang Ải 3 khi đang ở Ải 2'
  );

  // 3. Đánh Ải 2 (Thủ Hộ Dị Thú)
  const stage2Res = resolveDungeonStageBattle(currentPlayer, currentVault, 2, undefined, { forceVictory: true });
  assert(stage2Res.victory === true, 'Player phải thắng Ải 2');
  assert(
    stage2Res.updatedVault.activeDungeon?.stages[1].isCleared === true,
    'Ải 2 phải được đánh dấu isCleared = true'
  );
  assert(
    stage2Res.updatedVault.activeDungeon?.currentStageIndex === 3,
    'Ải tiếp theo phải chuyển sang Ải 3 (Boss cuối)'
  );

  currentPlayer = stage2Res.updatedPlayer;
  currentVault = stage2Res.updatedVault;

  // 4. Đánh Ải 3 (Boss Cuối: Kiếm Tổ Tàn Niệm)
  const stage3Res = resolveDungeonStageBattle(currentPlayer, currentVault, 3, undefined, { forceVictory: true });
  assert(stage3Res.victory === true, 'Player phải thắng Boss Ải 3');
  assert(
    stage3Res.updatedVault.activeDungeon?.stages[2].isCleared === true,
    'Ải 3 phải được đánh dấu isCleared = true'
  );
  assert(
    stage3Res.updatedVault.activeDungeon?.isCompleted === true,
    'Phó bản phải được đánh dấu hoàn thành isCompleted = true'
  );
  assert(
    stage3Res.updatedVault.clearedDungeonsCount === 1,
    `clearedDungeonsCount phải tăng lên 1, thực tế: ${stage3Res.updatedVault.clearedDungeonsCount}`
  );

  // 5. Kiểm tra trao thưởng Thần Binh và Linh Thạch
  currentPlayer = stage3Res.updatedPlayer;
  assert(Boolean(stage3Res.rewardsClaimed), 'Phải có báo cáo rewardsClaimed');
  assert(
    stage3Res.rewardsClaimed?.equipmentName === 'Thái Cổ Tru Tiên Kiếm (Phôi)',
    'Thần Binh thưởng phải là Thái Cổ Tru Tiên Kiếm'
  );

  // Kiểm tra vũ khí trong inventory
  const equippedList = currentPlayer.inventory?.equipment || [];
  const foundWeapon = equippedList.find(e => e.name.includes('Thái Cổ Tru Tiên Kiếm'));
  assert(Boolean(foundWeapon), 'Thần Binh phải được đưa trực tiếp vào hòm đồ player.inventory.equipment');
  assert(
    (foundWeapon?.atkBonus || 0) >= 800,
    `Chỉ số công kích của Thần Binh phải >= 800, thực tế: ${foundWeapon?.atkBonus}`
  );

  // Kiểm tra Linh Thạch
  assert(
    currentPlayer.linhThach >= 10000 + 50000,
    `Linh Thạch phải được cộng ít nhất 50,000, thực tế: ${currentPlayer.linhThach}`
  );

  // Kiểm tra nguyên liệu hiếm
  const oresList = currentPlayer.inventory?.ores || [];
  const foundHuyenThiet = oresList.find(o => o.name.includes('Thái Cổ Huyền Thiết'));
  assert(Boolean(foundHuyenThiet), 'Nguyên liệu quý hiếm Thái Cổ Huyền Thiết phải có trong kho quặng');

  console.log('[PASS] Test 5: Combat Progression & Divine Reward passed successfully!\n');
}

// ============================================================================
// TEST 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
// ============================================================================
console.log('--- Test 6: Save Migration Invariant ---');
{
  // Mock legacy save chưa hề có trường ancientMapVault
  const legacySaveData: Partial<PlayerStats> = {
    name: 'Tiên Nhân Cổ Xưa',
    currentRealm: 18,
    linhThach: 8000,
    inventory: {
      equipment: [],
      pills: [],
      herbs: [],
      ores: []
    }
  };

  const migrated = migrateAncientMapDungeonData(legacySaveData as PlayerStats);

  assert(Boolean(migrated.ancientMapVault), 'Cấu trúc ancientMapVault phải được tạo tự động');
  assert(
    typeof migrated.ancientMapVault?.fragmentsInventory === 'object',
    'fragmentsInventory phải là object'
  );
  assert(
    Array.isArray(migrated.ancientMapVault?.synthesizedMaps),
    'synthesizedMaps phải là array rỗng'
  );
  assert(
    migrated.ancientMapVault?.activeDungeon === null,
    'activeDungeon ban đầu phải là null'
  );
  assert(
    migrated.ancientMapVault?.clearedDungeonsCount === 0,
    'clearedDungeonsCount ban đầu phải là 0'
  );

  // Mock save chứa phó bản đã hết hạn
  const expiredSaveData: Partial<PlayerStats> = {
    name: 'Tu Giả Quá Hạn',
    currentRealm: 20,
    ancientMapVault: {
      fragmentsInventory: { frag_kiem_chung_dong: 1 },
      synthesizedMaps: [],
      activeDungeon: {
        instanceId: 'dungeon_expired_999',
        mapSetId: 'thai_co_kiem_chung',
        dungeonName: 'Bí Cảnh Quá Hạn',
        tier: 2,
        openedAt: Date.now() - 3 * 3600 * 1000,
        expiresAt: Date.now() - 1 * 3600 * 1000, // Đã hết hạn từ 1 tiếng trước!
        currentStageIndex: 1,
        stages: [],
        isCompleted: false,
        guaranteedRewards: {
          equipmentName: 'Test',
          spiritStones: 0,
          rareMaterials: []
        }
      },
      clearedDungeonsCount: 2
    }
  };

  const cleanedSave = migrateAncientMapDungeonData(expiredSaveData as PlayerStats);
  assert(
    cleanedSave.ancientMapVault?.activeDungeon === null,
    'Phó bản đã quá hạn (expiresAt < now) phải được tự động dọn sạch về null'
  );
  assert(
    cleanedSave.ancientMapVault?.fragmentsInventory.frag_kiem_chung_dong === 1,
    'Mảnh tàn đồ hợp lệ phải được bảo toàn'
  );
  assert(
    cleanedSave.ancientMapVault?.clearedDungeonsCount === 2,
    'clearedDungeonsCount phải được bảo toàn'
  );

  console.log('[PASS] Test 6: Save Migration Invariant passed successfully!\n');
}

console.log('====================================================');
console.log('=== ALL 6 TESTS PASSED SUCCESSFULLY! (100%) ===');
console.log('====================================================\n');
