// scripts/test-weapon-tribulation-array.ts
// Test Suite Tự Động: "Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân (Weapon Tribulation & Orbiting Array Sets)"
// 100% Strict TypeScript, 6/6 Test Cases Đặc Tả Bắt Buộc, Định dạng [PASS]/[FAIL] chuẩn QA Engine

import {
  FORMATION_SETS_REGISTRY,
  DEFAULT_FORMATION_SETS_STATE,
  evaluateWeaponTribulationTrigger,
  resolveWeaponLightningTemper,
  finalizeLightningTempering,
  calculateCraftPieceProgress,
  equipFormationSet
} from '../lib/weapon-tribulation-array-logic';
import { Equipment } from '../lib/types/items';
import {
  FormationSetCategory,
  FormationSetConfig,
  PlayerFormationSetProgress,
  FormationSetsState
} from '../lib/types/weapon-tribulation-array';
import { migrateWeaponTribulationArrayData } from '../lib/save-migration';
import { calculateCombatStats } from '../lib/destiny-data';
import {
  executeWeaponTribulationArrayCombatTurn,
  battleBoss
} from '../lib/game-logic/combat';
import { PlayerStats, Boss } from '../lib/types';
import { createNewPlayer } from '../lib/game-logic/character';

let passedTestsCount = 0;
let totalTestsCount = 0;

function check(condition: boolean, description: string) {
  totalTestsCount++;
  if (condition) {
    passedTestsCount++;
    console.log(`  ✓ [PASS] ${description}`);
  } else {
    console.error(`  ✗ [FAIL] ${description}`);
    throw new Error(`Assertion failed: ${description}`);
  }
}

async function runTribulationTestSuite() {
  console.log('===============================================================');
  console.log('⚡ QA AUTOMATION TEST SUITE: WEAPON TRIBULATION & ARRAY SETS');
  console.log('   GAMETUTIEN ENGINE - 6 MANDATORY TEST CASES SPECIFICATION');
  console.log('===============================================================\n');

  // ============================================================================
  // TEST 1: Tribulation Trigger Evaluation
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 1: Tribulation Trigger Evaluation');
  console.log('---------------------------------------------------------------');
  try {
    // 1.1: Vũ khí Tier 5 thông thường -> canTrigger: false
    const tier5Weapon: Equipment = {
      id: 'weapon_tier_5',
      name: 'Hỗn Độn Kiếm',
      slot: 'weapon',
      grade: 'Ngũ Giai (Hóa Thần Bảo)',
      tier: 5,
      powerBonus: 1000,
      enhancement: 0,
      hpBonus: 0,
      mpBonus: 0
    };
    const evalTier5 = evaluateWeaponTribulationTrigger(tier5Weapon);
    check(
      evalTier5.canTrigger === false,
      'Vũ khí Tier 5 thông thường không đủ điều kiện kích hoạt (canTrigger: false)'
    );
    check(
      typeof evalTier5.reason === 'string' && evalTier5.reason.length > 0,
      'Thông báo lý do từ chối rõ ràng cho vũ khí Tier 5'
    );

    // 1.2a: Vũ khí Tier 9 -> canTrigger: true
    const tier9Weapon: Equipment = {
      id: 'weapon_tier_9',
      name: 'Thái Sơ Thần Kiếm',
      slot: 'weapon',
      grade: 'Cửu Giai (Thái Sơ Thần Binh)',
      tier: 9,
      powerBonus: 10000,
      enhancement: 0,
      hpBonus: 0,
      mpBonus: 0
    };
    const evalTier9 = evaluateWeaponTribulationTrigger(tier9Weapon);
    check(
      evalTier9.canTrigger === true,
      'Vũ khí Cửu Giai (Tier 9) đủ điều kiện dẫn động Lôi Kiếp (canTrigger: true)'
    );

    // 1.2b: Vũ khí cấp thấp nhưng mang Khí Linh Hóa Hình (Stage 3) -> canTrigger: true
    const soulStage3Weapon: Equipment = {
      id: 'weapon_soul_stage_3',
      name: 'Thanh Trúc Kiếm',
      slot: 'weapon',
      grade: 'Nhị Giai (Linh Khí)',
      tier: 2,
      powerBonus: 300,
      enhancement: 0,
      hpBonus: 0,
      mpBonus: 0,
      infusedSoul: {
        soulName: 'Canh Kim Bạch Hổ',
        evolutionStage: 3,
        currentExp: 5000
      } as any
    };
    const evalSoul3 = evaluateWeaponTribulationTrigger(soulStage3Weapon);
    check(
      evalSoul3.canTrigger === true,
      'Vũ khí mang Khí Linh Hóa Hình (Stage 3) đủ điều kiện dẫn động Lôi Kiếp (canTrigger: true)'
    );

    // 1.3: Vũ khí đã có isTempered: true -> canTrigger: false (chống kích hoạt lặp)
    const alreadyTemperedWeapon: Equipment = {
      ...tier9Weapon,
      id: 'weapon_already_tempered',
      lightningTempering: {
        isTempered: true,
        temperedAt: Date.now() - 100000,
        lightningElementBonus: 35,
        paralysisProcChance: 20,
        armorPiercingPercent: 30
      }
    };
    const evalAlreadyTempered = evaluateWeaponTribulationTrigger(alreadyTemperedWeapon);
    check(
      evalAlreadyTempered.canTrigger === false,
      'Vũ khí đã qua lôi kiếp (isTempered: true) bị chặn kích hoạt lặp (canTrigger: false)'
    );
    check(
      evalAlreadyTempered.reason?.includes('đã độ lôi kiếp') === true,
      'Lý do từ chối chỉ rõ vũ khí đã độ lôi kiếp thành công'
    );

    console.log('==> [PASS] Test 1: Tribulation Trigger Evaluation\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 1: Tribulation Trigger Evaluation:', err.message);
    throw err;
  }

  // ============================================================================
  // TEST 2: Tempering Finalization & Prefix Invariant
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 2: Tempering Finalization & Prefix Invariant');
  console.log('---------------------------------------------------------------');
  try {
    const originalSword: Equipment = {
      id: 'thai_so_phi_kiem_01',
      name: 'Thái Sơ Phi Kiếm',
      slot: 'weapon',
      grade: 'Cửu Giai (Thái Sơ Thần Binh)',
      tier: 9,
      powerBonus: 8500,
      enhancement: 5,
      hpBonus: 2000,
      mpBonus: 1000,
      alloyMetadata: {
        archetypeName: 'Thái Ất Canh Kim Hợp Kim',
        tier: 9,
        purity: 98
      } as any,
      inscriptionData: {
        conduits: [
          { slotIndex: 0, isUnlocked: true, inscribedFormationId: 'fmt_hoa_kiem' },
          { slotIndex: 1, isUnlocked: true, inscribedFormationId: 'fmt_loi_kiem' }
        ]
      } as any,
      infusedSoul: {
        soulName: 'Cửu Thiên Hỏa Phượng',
        evolutionStage: 3,
        currentExp: 6000
      } as any
    };

    const finalizedSword = finalizeLightningTempering(originalSword);

    // 2.1: Tên vũ khí đổi thành "【Cửu Tiêu Lôi Kiếp】 Thái Sơ Phi Kiếm"
    check(
      finalizedSword.name === '【Cửu Tiêu Lôi Kiếp】 Thái Sơ Phi Kiếm',
      'Tên vũ khí được gắn tiền tố chính xác: "【Cửu Tiêu Lôi Kiếp】 Thái Sơ Phi Kiếm"'
    );

    // 2.2: Metadata nhận đúng isTempered: true và các chỉ số chuẩn
    check(
      finalizedSword.lightningTempering?.isTempered === true,
      'Metadata lightningTempering được thiết lập isTempered: true'
    );
    check(
      finalizedSword.lightningTempering?.lightningElementBonus === 35,
      'Gia tăng lôi nguyên tố chuẩn: lightningElementBonus = 35%'
    );
    check(
      finalizedSword.lightningTempering?.paralysisProcChance === 20,
      'Xác suất tê liệt chuẩn: paralysisProcChance = 20%'
    );
    check(
      finalizedSword.lightningTempering?.armorPiercingPercent === 30,
      'Tỷ lệ xuyên giáp chuẩn: armorPiercingPercent = 30%'
    );
    check(
      typeof finalizedSword.lightningTempering?.temperedAt === 'number' &&
      finalizedSword.lightningTempering.temperedAt > 0,
      'Thời điểm hoàn thành lôi kiếp temperedAt được ghi nhận'
    );

    // 2.3: Các thuộc tính hợp kim/khí linh cũ giữ nguyên 100%
    check(
      finalizedSword.alloyMetadata?.archetypeName === 'Thái Ất Canh Kim Hợp Kim' &&
      (finalizedSword.alloyMetadata as any)?.purity === 98,
      'Hợp kim ngũ hành (alloyMetadata) bảo toàn vĩnh viễn 100%'
    );
    check(
      finalizedSword.inscriptionData?.conduits?.length === 2 &&
      finalizedSword.inscriptionData?.conduits[0].inscribedFormationId === 'fmt_hoa_kiem',
      'Mạch dẫn linh & trận văn (inscriptionData) bảo toàn vĩnh viễn 100%'
    );
    check(
      finalizedSword.infusedSoul?.soulName === 'Cửu Thiên Hỏa Phượng' &&
      finalizedSword.infusedSoul?.evolutionStage === 3,
      'Chân hồn Khí Linh (infusedSoul) bảo toàn vĩnh viễn 100%'
    );

    console.log('==> [PASS] Test 2: Tempering Finalization & Prefix Invariant\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 2: Tempering Finalization & Prefix Invariant:', err.message);
    throw err;
  }

  // ============================================================================
  // TEST 3: Formation Set Piece Crafting & Cap Guard
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 3: Formation Set Piece Crafting & Cap Guard');
  console.log('---------------------------------------------------------------');
  try {
    const chuThienConfig = FORMATION_SETS_REGISTRY.chu_thien_kiem;
    check(chuThienConfig.maxPieces === 36, 'Bộ Chu Thiên Kiếm có giới hạn trần maxPieces = 36');

    // 3.1: Đúc từ 0 lên 12 mảnh -> Mở khóa thành công Mốc 12 (turnDamagePercent: 20)
    const initialProgress = undefined;
    const craftResult12 = calculateCraftPieceProgress(initialProgress, chuThienConfig, 12);

    check(
      craftResult12.updatedSet.currentPieces === 12,
      'Số mảnh hiện tại tăng chính xác từ 0 lên 12'
    );
    check(
      craftResult12.newlyUnlockedThresholds.includes(12),
      'Mở khóa thành công Mốc 12 trong danh sách newlyUnlockedThresholds'
    );
    const threshold12Config = chuThienConfig.thresholdBonuses.find(tb => tb.requiredPieces === 12);
    check(
      threshold12Config?.effects.turnDamagePercent === 20,
      'Mốc 12 mang hiệu ứng phóng kiếm khí chính xác (turnDamagePercent: 20)'
    );

    // 3.2: Đang có 35 mảnh, cố tình đúc thêm 2 mảnh (thành 37 > 36) -> Bắt buộc từ chối/ném lỗi
    const progress35: PlayerFormationSetProgress = {
      setId: 'chu_thien_kiem',
      currentPieces: 35,
      isCompleted: false,
      unlockedThresholds: [12, 24],
      assembledAt: Date.now()
    };

    let capGuardTriggered = false;
    let capErrorMessage = '';
    try {
      calculateCraftPieceProgress(progress35, chuThienConfig, 2);
    } catch (err: any) {
      capGuardTriggered = true;
      capErrorMessage = err.message;
    }

    check(
      capGuardTriggered === true,
      'Cap Guard kích hoạt: Ném ngoại lệ khi đúc 35 + 2 = 37 mảnh (> 36)'
    );
    check(
      capErrorMessage.includes('vượt quá số lượng tối đa'),
      'Nội dung lỗi giải thích rõ giới hạn trần của bộ trận khí'
    );

    console.log('==> [PASS] Test 3: Formation Set Piece Crafting & Cap Guard\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 3: Formation Set Piece Crafting & Cap Guard:', err.message);
    throw err;
  }

  // ============================================================================
  // TEST 4: Threshold Progression Accuracy
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 4: Threshold Progression Accuracy');
  console.log('---------------------------------------------------------------');
  try {
    const chuThienConfig = FORMATION_SETS_REGISTRY.chu_thien_kiem;

    // Đúc từng bước hoặc đúc trọn vẹn đủ 36/36 mảnh Chu Thiên Kiếm
    const progressFull = calculateCraftPieceProgress(undefined, chuThienConfig, 36);

    // 4.1: currentPieces = 36
    check(
      progressFull.updatedSet.currentPieces === 36,
      'Số mảnh bộ Chu Thiên Kiếm đạt tối đa 36/36'
    );

    // 4.2: Mảng unlockedThresholds chứa đủ cả 3 mốc [12, 24, 36]
    check(
      progressFull.updatedSet.unlockedThresholds.length === 3,
      'Mảng unlockedThresholds chứa đầy đủ 3 mốc'
    );
    check(
      progressFull.updatedSet.unlockedThresholds.includes(12) &&
      progressFull.updatedSet.unlockedThresholds.includes(24) &&
      progressFull.updatedSet.unlockedThresholds.includes(36),
      'Danh sách các mốc mở khóa chính xác là [12, 24, 36]'
    );

    // 4.3: cờ isCompleted: true
    check(
      progressFull.updatedSet.isCompleted === true,
      'Cờ hoàn thành đại trận isCompleted được bật true'
    );

    // 4.4: Xác nhận Tuyệt Kỹ mốc 36 được định nghĩa chuẩn
    const threshold36 = chuThienConfig.thresholdBonuses.find(tb => tb.requiredPieces === 36);
    check(
      threshold36?.effects.unlockedSkillName === 'Chu Thiên Vạn Kiếm Trận',
      'Tuyệt kỹ mốc 36 kích hoạt [Chu Thiên Vạn Kiếm Trận]'
    );

    console.log('==> [PASS] Test 4: Threshold Progression Accuracy\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 4: Threshold Progression Accuracy:', err.message);
    throw err;
  }

  // ============================================================================
  // TEST 5: Array Slot Independence (Non-weapon override)
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 5: Array Slot Independence (Non-weapon override)');
  console.log('---------------------------------------------------------------');
  try {
    // Tạo cấu trúc Player mẫu với vũ khí đang mặc trên người
    const playerWithWeapon = {
      name: 'Hàn Lập',
      equipment: {
        weapon: {
          id: 'truc_phong_kiem_01',
          name: 'Thanh Trúc Phong Vân Kiếm',
          slot: 'weapon',
          grade: 'Tứ Giai (Cổ Bảo)',
          powerBonus: 1500,
          enhancement: 7
        },
        armor: {
          id: 'thanh_van_bao',
          name: 'Thanh Vân Y',
          slot: 'armor',
          powerBonus: 800
        }
      },
      formationSetsState: {
        ownedSets: {
          chu_thien_kiem: {
            setId: 'chu_thien_kiem',
            currentPieces: 36,
            isCompleted: true,
            unlockedThresholds: [12, 24, 36],
            assembledAt: Date.now()
          }
        },
        equippedArraySetId: null,
        tribulationHistory: []
      }
    };

    // Thực hiện trang bị bộ trận khí Chu Thiên Kiếm
    const updatedPlayer = equipFormationSet(playerWithWeapon, 'chu_thien_kiem');

    // 5.1: equippedArraySetId được gán chính xác
    check(
      updatedPlayer.formationSetsState.equippedArraySetId === 'chu_thien_kiem',
      'Bộ trận khí tùy thân được gán chính xác vào equippedArraySetId = "chu_thien_kiem"'
    );

    // 5.2: Ô vũ khí chính player.equipment.weapon KHÔNG bị đè hoặc thay thế
    check(
      Boolean(updatedPlayer.equipment.weapon),
      'Ô trang bị vũ khí player.equipment.weapon vẫn tồn tại nguyên vẹn'
    );
    check(
      updatedPlayer.equipment.weapon.id === 'truc_phong_kiem_01',
      'ID vũ khí chính không bị thay đổi (truc_phong_kiem_01)'
    );
    check(
      updatedPlayer.equipment.weapon.name === 'Thanh Trúc Phong Vân Kiếm',
      'Tên vũ khí chính không bị ghi đè ("Thanh Trúc Phong Vân Kiếm")'
    );
    check(
      updatedPlayer.equipment.weapon.enhancement === 7,
      'Cấp cường hóa vũ khí chính không bị suy giảm (+7)'
    );

    // 5.3: Tháo bộ trận khí (set null) cũng không ảnh hưởng vũ khí
    const unequippedPlayer = equipFormationSet(updatedPlayer, null);
    check(
      unequippedPlayer.formationSetsState.equippedArraySetId === null,
      'Tháo trận khí: equippedArraySetId chuyển về null an toàn'
    );
    check(
      unequippedPlayer.equipment.weapon.id === 'truc_phong_kiem_01',
      'Vũ khí chính vẫn bảo toàn 100% sau khi tháo trận khí'
    );

    console.log('==> [PASS] Test 5: Array Slot Independence (Non-weapon override)\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 5: Array Slot Independence (Non-weapon override):', err.message);
    throw err;
  }

  // ============================================================================
  // TEST 6: Invariant Immutability
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 6: Invariant Immutability (Zero Mutation)');
  console.log('---------------------------------------------------------------');
  try {
    // 6.1: Immutability của finalizeLightningTempering
    const inputWeapon: Equipment = {
      id: 'immutable_weapon_test',
      name: 'Huyền Thiết Trọng Kiếm',
      slot: 'weapon',
      grade: 'Tam Giai (Bảo Khí)',
      powerBonus: 600,
      enhancement: 3,
      hpBonus: 0,
      mpBonus: 0
    };
    const inputWeaponSnapshot = JSON.stringify(inputWeapon);

    const temperedWeaponResult = finalizeLightningTempering(inputWeapon);

    check(
      JSON.stringify(inputWeapon) === inputWeaponSnapshot,
      'finalizeLightningTempering: Object vũ khí đầu vào 100% không bị mutate'
    );
    check(
      inputWeapon.lightningTempering === undefined,
      'finalizeLightningTempering: Vũ khí ban đầu không bị gán trường ngầm định'
    );
    check(
      temperedWeaponResult !== inputWeapon,
      'finalizeLightningTempering: Kết quả trả về là một tham chiếu đối tượng mới (Deep Copy)'
    );

    // 6.2: Immutability của calculateCraftPieceProgress
    const inputProgress: PlayerFormationSetProgress = {
      setId: 'bat_quai_ky',
      currentPieces: 4,
      isCompleted: false,
      unlockedThresholds: [4],
      assembledAt: 1700000000000
    };
    const inputProgressSnapshot = JSON.stringify(inputProgress);

    const batQuaiConfig = FORMATION_SETS_REGISTRY.bat_quai_ky;
    const progressResult = calculateCraftPieceProgress(inputProgress, batQuaiConfig, 4);

    check(
      JSON.stringify(inputProgress) === inputProgressSnapshot,
      'calculateCraftPieceProgress: Object tiến độ đầu vào 100% không bị mutate'
    );
    check(
      inputProgress.currentPieces === 4,
      'calculateCraftPieceProgress: inputProgress.currentPieces vẫn giữ nguyên giá trị 4'
    );
    check(
      progressResult.updatedSet !== inputProgress,
      'calculateCraftPieceProgress: Kết quả trả về là tham chiếu đối tượng mới hoàn toàn'
    );

    console.log('==> [PASS] Test 6: Invariant Immutability (Zero Mutation)\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 6: Invariant Immutability:', err.message);
    throw err;
  }

  // ============================================================================
  // TEST 7: Save Migration, Destiny Passive Stats & Combat Loop Simulation
  // ============================================================================
  console.log('---------------------------------------------------------------');
  console.log('🧪 Test 7: Save Migration, Destiny Passive Stats & Combat Loop Simulation');
  console.log('---------------------------------------------------------------');
  try {
    // 7.1: Save Migration (Idempotency & Safe Init)
    const basePlayer = createNewPlayer();
    const legacyPlayer: any = {
      ...basePlayer,
      formationSetsState: undefined,
      equipment: {
        weapon: {
          id: 'old_weapon',
          name: 'Cổ Đạo Kiếm',
          slot: 'weapon',
          grade: 'Ngũ Giai',
          tier: 5,
          powerBonus: 1200
        }
      },
      inventory: {
        ...basePlayer.inventory,
        equipments: [
          {
            id: 'inv_sword',
            name: 'Trảm Yêu Kiếm',
            slot: 'weapon',
            grade: 'Tứ Giai',
            tier: 4,
            powerBonus: 800
          }
        ]
      }
    };

    const migratedOnce = migrateWeaponTribulationArrayData(legacyPlayer);
    check(
      migratedOnce.formationSetsState !== undefined,
      'migrateWeaponTribulationArrayData: Khởi tạo an toàn player.formationSetsState'
    );
    check(
      migratedOnce.formationSetsState!.equippedArraySetId === null,
      'migrateWeaponTribulationArrayData: equippedArraySetId mặc định là null'
    );
    check(
      Object.keys(migratedOnce.formationSetsState!.ownedSets).length === 0,
      'migrateWeaponTribulationArrayData: ownedSets khởi tạo rỗng'
    );
    check(
      Array.isArray(migratedOnce.formationSetsState!.tribulationHistory),
      'migrateWeaponTribulationArrayData: tribulationHistory là mảng rỗng'
    );
    check(
      (migratedOnce.equipment as any).weapon.lightningTempering === null,
      'migrateWeaponTribulationArrayData: Quét equipment gán lightningTempering: null cho vũ khí cũ'
    );
    check(
      (migratedOnce.inventory as any).equipments[0].lightningTempering === null,
      'migrateWeaponTribulationArrayData: Quét inventory gán lightningTempering: null cho trang bị trong kho'
    );

    // Idempotent: chạy lần 2 không làm mất dữ liệu
    const migratedTwice = migrateWeaponTribulationArrayData(migratedOnce);
    check(
      JSON.stringify(migratedOnce) === JSON.stringify(migratedTwice),
      'migrateWeaponTribulationArrayData: Đạt tính lũy đẳng (Idempotent 100%)'
    );

    // 7.2: Destiny Data calculateCombatStats Passive Bonus
    const statsWithoutArray = calculateCombatStats(migratedOnce);
    const initialReduction = statsWithoutArray.dmgReduction || 0;

    // Trang bị Chu Thiên Kiếm Trận mốc 24 pieces (+15% damageReductionPercent)
    const playerWithArray: PlayerStats = {
      ...migratedOnce,
      formationSetsState: {
        ownedSets: {
          chu_thien_kiem: {
            setId: 'chu_thien_kiem',
            currentPieces: 24,
            isCompleted: false,
            unlockedThresholds: [12, 24],
            assembledAt: Date.now()
          }
        },
        equippedArraySetId: 'chu_thien_kiem',
        tribulationHistory: []
      }
    };
    const statsWithArray = calculateCombatStats(playerWithArray);
    check(
      (statsWithArray.dmgReduction || 0) === initialReduction + 15,
      `calculateCombatStats: Kích hoạt mốc 24/36 mảnh cộng đúng +15% Miễn Thương (${initialReduction} -> ${statsWithArray.dmgReduction})`
    );
    check(
      (statsWithArray.damageReductionPercent || 0) >= 15,
      'calculateCombatStats: damageReductionPercent phản ánh chỉ số bị động của Trận Khí Tùy Thân'
    );

    // 7.3: Combat Turn Simulation: Turn Start (Trận Khí Tùy Thân)
    const arrayProgress36: PlayerFormationSetProgress = {
      setId: 'chu_thien_kiem',
      currentPieces: 36,
      isCompleted: true,
      unlockedThresholds: [12, 24, 36],
      assembledAt: Date.now()
    };

    // Lượt 1: Phóng kiếm quang tuần hoàn (35% ATK vì mốc 36/36 có turnDamagePercent: 35)
    const turn1Result = executeWeaponTribulationArrayCombatTurn({
      playerHp: 10000,
      playerMaxHp: 10000,
      playerAtk: 2000,
      turnNumber: 1,
      equippedArraySetId: 'chu_thien_kiem',
      arrayProgress: arrayProgress36,
      targetHp: 50000,
      targetMaxHp: 50000,
      targetDef: 500,
      incomingBossDamage: 500,
      randomFn: () => 0.50
    });

    check(
      turn1Result.swarmTriggered === true,
      'executeWeaponTribulationArrayCombatTurn: Lượt 1 tự động kích hoạt Swarm Damage'
    );
    check(
      turn1Result.swarmDamageDealt === Math.round(2000 * 0.35),
      `executeWeaponTribulationArrayCombatTurn: Swarm Damage tính chính xác 35% ATK (${turn1Result.swarmDamageDealt})`
    );
    check(
      turn1Result.ultTriggered === false,
      'executeWeaponTribulationArrayCombatTurn: Lượt 1 chưa kích hoạt Tuyệt Kỹ (chỉ kích hoạt mỗi 3 lượt)'
    );
    check(
      turn1Result.combatLogs.some(log => log.includes('【Tam Thập Lục Chu Thiên Kiếm Trận】 xoay chuyển tuần hoàn, 36 đạo kiếm quang')),
      'executeWeaponTribulationArrayCombatTurn: Log Swarm Damage chuẩn định dạng yêu cầu'
    );

    // Lượt 3: Kích hoạt Tuyệt Kỹ 【Chu Thiên Vạn Kiếm Trận】 (250% ATK)
    const turn3Result = executeWeaponTribulationArrayCombatTurn({
      playerHp: 10000,
      playerMaxHp: 10000,
      playerAtk: 2000,
      turnNumber: 3,
      equippedArraySetId: 'chu_thien_kiem',
      arrayProgress: arrayProgress36,
      targetHp: 50000,
      targetMaxHp: 50000,
      targetDef: 500,
      incomingBossDamage: 500,
      randomFn: () => 0.50
    });

    check(
      turn3Result.ultTriggered === true,
      'executeWeaponTribulationArrayCombatTurn: Mốc 36/36 lượt 3 tự động kích hoạt Tuyệt Kỹ 【Chu Thiên Vạn Kiếm Trận】'
    );
    check(
      turn3Result.ultDamageDealt === Math.round(2000 * 2.50),
      `executeWeaponTribulationArrayCombatTurn: Tuyệt Kỹ gây đúng 250% sát thương (${turn3Result.ultDamageDealt})`
    );
    check(
      turn3Result.combatLogs.some(log => log.includes('【Chu Thiên Vạn Kiếm Trận】 bộc phát uy lực kinh thiên! Vạn đạo kiếm mang quét sạch 250%')),
      'executeWeaponTribulationArrayCombatTurn: Log Tuyệt Kỹ chuẩn định dạng Tiên Hiệp'
    );

    // 7.4: Combat Turn Simulation: Lôi Kiếp Thần Binh (Lôi Sát Xuyên Giáp & Thiên Lôi Tê Liệt)
    const temperedWeapon: Equipment = {
      id: 'tempered_blade',
      name: '【Lôi Kiếp】 Thái Sơ Thần Kiếm',
      slot: 'weapon',
      grade: 'Cửu Giai',
      tier: 9,
      powerBonus: 10000,
      enhancement: 0,
      hpBonus: 0,
      mpBonus: 0,
      lightningTempering: {
        isTempered: true,
        temperedAt: Date.now(),
        lightningElementBonus: 35,
        paralysisProcChance: 20,
        armorPiercingPercent: 30
      }
    };

    // Roll thành công tê liệt (roll 0.10 < 0.20)
    const turnWithParalysis = executeWeaponTribulationArrayCombatTurn({
      playerHp: 10000,
      playerMaxHp: 10000,
      playerAtk: 2000,
      turnNumber: 2,
      weapon: temperedWeapon,
      targetHp: 50000,
      targetMaxHp: 50000,
      targetDef: 500,
      incomingBossDamage: 1000,
      randomFn: () => 0.10
    });

    check(
      turnWithParalysis.lightningPiercingDamage === Math.round(2000 * 0.35),
      `executeWeaponTribulationArrayCombatTurn: Lôi Sát xuyên giáp gây đúng +35% ATK (${turnWithParalysis.lightningPiercingDamage})`
    );
    check(
      turnWithParalysis.lightningParalysisTriggered === true,
      'executeWeaponTribulationArrayCombatTurn: Xúc xắc thành công gây hiệu ứng 【Thiên Lôi Tê Liệt】'
    );
    check(
      turnWithParalysis.targetSkipsNextTurn === true,
      'executeWeaponTribulationArrayCombatTurn: Đối thủ bị gián đoạn đòn đánh và mất lượt xuất chiêu'
    );
    check(
      turnWithParalysis.actualDamageReceived === 0,
      'executeWeaponTribulationArrayCombatTurn: Đối thủ tê liệt nên sát thương nhận vào lượt này bằng 0'
    );
    check(
      turnWithParalysis.combatLogs.some(log => log.includes('【Cửu Tiêu Thiên Lôi】 bộc phát! Luồng lôi đình kinh thiên đánh trúng huyệt đạo, khiến đối thủ bị tê liệt mất 1 lượt xuất chiêu!')),
      'executeWeaponTribulationArrayCombatTurn: Log Thiên Lôi Tê Liệt viền bạc chói lòa chuẩn đặc tả'
    );

    // Roll không kích hoạt tê liệt (roll 0.50 >= 0.20)
    const turnWithoutParalysis = executeWeaponTribulationArrayCombatTurn({
      playerHp: 10000,
      playerMaxHp: 10000,
      playerAtk: 2000,
      turnNumber: 2,
      weapon: temperedWeapon,
      targetHp: 50000,
      targetMaxHp: 50000,
      targetDef: 500,
      incomingBossDamage: 1000,
      randomFn: () => 0.50
    });
    check(
      turnWithoutParalysis.lightningParalysisTriggered === false,
      'executeWeaponTribulationArrayCombatTurn: Roll >= 20% không kích hoạt tê liệt'
    );
    check(
      turnWithoutParalysis.actualDamageReceived === 1000,
      'executeWeaponTribulationArrayCombatTurn: Không tê liệt thì nhận nguyên sát thương từ đối thủ'
    );

    // 7.5: battleBoss Full End-to-End Integration
    const playerForBoss: PlayerStats = {
      ...playerWithArray,
      equipment: {
        weapon: temperedWeapon
      }
    };
    const dummyBoss: Boss = {
      id: 'boss_test',
      name: 'Yêu Lang Thượng Cổ',
      realm: 20,
      hp: 20000,
      maxHp: 20000,
      atk: 1000,
      def: 500,
      speed: 100,
      difficulty: 'hard',
      description: 'Yêu lang hung bạo dị thường.',
      defeatText: 'Yêu Lang gầm thét rồi ngã xuống.',
      loseText: 'Ngươi thất thế trước nanh vuốt yêu thú.'
    };

    const bossResult = battleBoss(playerForBoss, dummyBoss);
    check(
      bossResult.formationArrayTriggered === true,
      'battleBoss: Trận Khí Tùy Thân được kích hoạt trong trận đấu Boss'
    );
    check(
      bossResult.lightningTemperTriggered === true,
      'battleBoss: Lôi Kiếp Thần Binh được kích hoạt trong trận đấu Boss'
    );
    check(
      bossResult.flavorText.includes('Chu Thiên Kiếm Trận'),
      'battleBoss: flavorText chứa combat log của Trận Khí Tùy Thân'
    );
    check(
      bossResult.flavorText.includes('LÔI KIẾP THẦN BINH'),
      'battleBoss: flavorText chứa combat log của Lôi Kiếp Thần Binh'
    );

    console.log('==> [PASS] Test 7: Save Migration, Destiny Passive Stats & Combat Loop Simulation\n');
  } catch (err: any) {
    console.error('==> [FAIL] Test 7: Save Migration & Combat Simulation:', err.message);
    throw err;
  }

  // ============================================================================
  // SUMMARY REPORT
  // ============================================================================
  console.log('===============================================================');
  console.log(`🎉 TEST SUMMARY: ${passedTestsCount}/${totalTestsCount} CHECKS PASSED (100% SUCCESS)`);
  console.log('   7/7 TEST CASES VƯỢT QUA KIỂM THỬ TỰ ĐỘNG THÀNH CÔNG!');
  console.log('   PHÂN HỆ KHÍ LÔI KIẾP & ĐÚC BỘ TRẬN KHÍ TÙY THÂN ĐẠT CHUẨN ENGINE!');
  console.log('===============================================================');
}

runTribulationTestSuite().catch(err => {
  console.error('TEST SUITE ENCOUNTERED UNHANDLED ERROR:', err);
  process.exit(1);
});
