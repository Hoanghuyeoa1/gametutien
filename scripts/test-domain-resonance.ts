// scripts/test-domain-resonance.ts
// Test Suite kiểm tra toàn diện phân hệ:
// "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"

import {
  detectActiveDomainResonances,
  resolveResonanceTurnEffects,
  DOMAIN_RESONANCES_REGISTRY,
  extractSkillElement,
  matchSpiritPersonality
} from '../lib/domain-resonance-logic';
import { migrateDomainResonanceData } from '../lib/save-migration';
import { NatalArtifact, ArtifactSpirit } from '../lib/types/natal-artifact';
import { Manual, PlayerStats } from '../lib/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, label: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${label}`);
  } else {
    console.error(`  ❌ [FAIL] ${label}${detail ? ` -> ${detail}` : ''}`);
  }
}

console.log('================================================================');
console.log('⚔️  KHỞI ĐỘNG TEST SUITE: CỘNG HƯỞNG DỊ TƯỢNG NGŨ HÀNH ⚔️');
console.log('================================================================\n');

// Mock Data Khí Linh & Bản Mệnh
const mockSpiritSatPhat: ArtifactSpirit = {
  name: 'Xích Viêm Kiếm Linh',
  title: 'Hỏa Kiếm Linh Thể',
  avatar: '🔥',
  stage: 'thuc_tinh',
  stageLevel: 2,
  exp: 800,
  maxExp: 1800,
  intimacy: 60,
  personality: 'sat_phat',
  awakenedSkill: {
    id: 'skill_sat_phat',
    name: 'Tru Tiên Trảm Hồn',
    description: 'Sát thương cực hạn',
    triggerCondition: 'boss_low',
    cooldownTurns: 99,
    effectValue: 200
  },
  dialogueHistory: [],
  dailyNourishCount: 0
};

const mockSpiritOnHoa: ArtifactSpirit = {
  ...mockSpiritSatPhat,
  name: 'Bích Mộc Linh Nhi',
  personality: 'on_hoa' as any,
  awakenedSkill: {
    ...mockSpiritSatPhat.awakenedSkill,
    id: 'skill_on_hoa',
    name: 'Linh Thể Chắn Kiếp'
  }
};

const mockNatalArtifactSatPhat: NatalArtifact = {
  id: 'natal_kiem_sat_phat',
  baseEquipmentId: 'eq_kiem_001',
  name: 'Thần Hỏa Trảm Tiên Kiếm',
  slot: 'weapon',
  tier: 2,
  grade: 'Cửu Phẩm',
  quality: 'tuyet_pham',
  resonanceRate: 25,
  boundRealmId: 11,
  realmAdvancementBonus: 5,
  spirit: mockSpiritSatPhat,
  statsBonus: { atk: 1200, critRate: 15 },
  boundAtTimestamp: Date.now()
};

// Mock Thần Thông
const skillHoa: Manual = {
  id: 'skill_hoa_001',
  name: 'Liệt Hỏa Kiếm Quyết',
  type: 'than_thong',
  grade: 'Địa Giai Thượng Phẩm',
  level: 5,
  maxLevel: 10,
  description: 'Kiếm khí bốc hỏa hừng hực',
  element: 'hoa',
  tuViPerLevel: 200
};

const skillMoc: Manual = {
  id: 'skill_moc_001',
  name: 'Ất Mộc Trường Sinh Quyết',
  type: 'than_thong',
  grade: 'Địa Giai Trung Phẩm',
  level: 4,
  maxLevel: 10,
  description: 'Sinh khí dồi dào',
  element: 'moc',
  tuViPerLevel: 180
};

const skillKim: Manual = {
  id: 'skill_kim_001',
  name: 'Bạch Hổ Canh Kim Sát',
  type: 'than_thong',
  grade: 'Thiên Giai Hạ Phẩm',
  level: 6,
  maxLevel: 10,
  description: 'Canh kim bén nhọn',
  element: 'kim',
  tuViPerLevel: 300
};

// ============================================================
// CA KIỂM THỬ 1: KIỂM TRA ĐIỀU KIỆN KÍCH HOẠT (DETECTION GUARD)
// ============================================================
console.log('--- TEST 1: Kiểm Tra Điều Kiện Kích Hoạt (Detection Guard) ---');
{
  // 1. Trang bị Hỏa + Khí Linh sat_phat -> Kích hoạt Liệt Diễm Phần Thần
  const activeResonances1 = detectActiveDomainResonances([skillHoa], mockNatalArtifactSatPhat, 15);
  assert(activeResonances1.length === 1, 'Kích hoạt chính xác 1 Dị Tượng khi đủ điều kiện');
  assert(activeResonances1[0]?.resonanceId === 'liet_diem_phan_than', 'Dị Tượng kích hoạt là "Liệt Diễm Phần Thần"');
  assert(activeResonances1[0]?.sourceSkillName === 'Liệt Hỏa Kiếm Quyết', 'Ghi nhận đúng Thần Thông nguồn');
  assert(activeResonances1[0]?.spiritName === 'Xích Viêm Kiếm Linh', 'Ghi nhận đúng Khí Linh nguồn');

  // 2. Đổi sang Khí Linh tính cách on_hoa -> Dị Tượng Liệt Diễm Phần Thần tự động tắt
  const natalArtifactOnHoa: NatalArtifact = {
    ...mockNatalArtifactSatPhat,
    spirit: mockSpiritOnHoa
  };
  const activeResonances2 = detectActiveDomainResonances([skillHoa], natalArtifactOnHoa, 15);
  assert(activeResonances2.length === 0, 'Đổi sang Khí Linh tính cách on_hoa -> Dị Tượng tự động tắt (không kích hoạt)');
}

// ============================================================
// CA KIỂM THỬ 2: THÁO GỠ KỸ NĂNG & PHÒNG VỆ TÀN DƯ (UNEQUIP CLEANLINESS)
// ============================================================
console.log('\n--- TEST 2: Tháo Gỡ Kỹ Năng & Phòng Vệ Tàn Dư (Unequip Cleanliness) ---');
{
  // Bắt đầu với Thần Thông Hỏa đang trang bị
  let equippedList = [skillHoa];
  let resonances = detectActiveDomainResonances(equippedList, mockNatalArtifactSatPhat, 15);
  assert(resonances.length === 1, 'Trước khi tháo: Dị Tượng hoạt động');

  // Người chơi tháo Thần Thông Hỏa (danh sách rỗng)
  equippedList = [];
  resonances = detectActiveDomainResonances(equippedList, mockNatalArtifactSatPhat, 15);
  assert(resonances.length === 0, 'Sau khi tháo kỹ năng: Dị Tượng lập tức biến mất');

  // Kiểm tra giải quyết combat không sinh buff ma
  const attacker = { hp: 1000, maxHp: 1000, mp: 500, maxMp: 500, atk: 200 };
  const defender = { hp: 1000, maxHp: 1000, mp: 1000, maxMp: 1000, atk: 150 };
  const combatRes = resolveResonanceTurnEffects(attacker, defender, resonances, 1);
  assert(combatRes.combatEvents.length === 0, 'Không tồn tại buff ma hoặc sự kiện dị tượng trong Combat');
  assert(combatRes.updatedDefender.mp === 1000, 'Chân Nguyên đối thủ bảo toàn nguyên vẹn khi không có Dị Tượng');
}

// ============================================================
// CA KIỂM THỬ 3: MÔ PHỎNG THIÊU ĐỐT CHÂN NGUYÊN (MANA BURN TURN EXECUTION)
// ============================================================
console.log('\n--- TEST 3: Mô Phỏng Thiêu Đốt Chân Nguyên (Mana Burn Turn Execution) ---');
{
  const activeResonances = detectActiveDomainResonances([skillHoa], mockNatalArtifactSatPhat, 15);
  assert(activeResonances.length === 1, 'Khởi tạo Dị Tượng Liệt Diễm Phần Thần thành công');

  let attacker = { hp: 1000, maxHp: 1000, mp: 500, maxMp: 500, atk: 300 };
  let defender = { hp: 2000, maxHp: 2000, mp: 1000, maxMp: 1000, atk: 200 };
  const totalEventsRecorded: string[] = [];

  // Chạy giả lập 5 hiệp đấu liên tiếp
  for (let turn = 1; turn <= 5; turn++) {
    const turnResult = resolveResonanceTurnEffects(attacker, defender, activeResonances, turn);
    attacker = turnResult.updatedAttacker;
    defender = turnResult.updatedDefender;
    totalEventsRecorded.push(...turnResult.combatEvents);
  }

  assert(defender.mp === 750, `Sau 5 hiệp, MP đối phương còn đúng 750 (Hiện tại: ${defender.mp})`);
  assert(totalEventsRecorded.length === 5, `Ghi nhận đủ 5 sự kiện phần thần qua 5 hiệp (Số sự kiện: ${totalEventsRecorded.length})`);
  assert(
    totalEventsRecorded.every(e => e.includes('Liệt Diễm Phần Thần Dị Tượng bộc phát')),
    'Toàn bộ nhật ký chứa đúng danh xưng cổ phong Liệt Diễm Phần Thần'
  );

  // Thử nghiệm thiêu đốt đến cạn kiệt (MP <= 0) kích hoạt Hụt Khí
  defender.mp = 30; // Còn 30 MP, 1 hiệp tới sẽ thiêu đốt 50 MP -> về 0
  const turnDrainResult = resolveResonanceTurnEffects(attacker, defender, activeResonances, 6);
  assert(turnDrainResult.updatedDefender.mp === 0, 'MP đối thủ bị thiêu đốt xuống chạm đáy 0');
  assert(turnDrainResult.updatedDefender.isHutKhi === true, 'Kích hoạt trạng thái Hụt Khí khi MP cạn kiệt');
  assert(turnDrainResult.updatedDefender.atk === 170, `Công kích đối thủ giảm 15% (Từ 200 xuống 170, thực tế: ${turnDrainResult.updatedDefender.atk})`);
}

// ============================================================
// CA KIỂM THỬ 4: PHÒNG VỆ KHI KHÔNG CÓ BẢN MỆNH / KHÍ LINH (NULL SAFETY)
// ============================================================
console.log('\n--- TEST 4: Phòng Vệ Khi Không Có Bản Mệnh / Khí Linh (Null Safety) ---');
{
  // 1. natalArtifact === null
  const resNullNatal = detectActiveDomainResonances([skillHoa], null, 15);
  assert(Array.isArray(resNullNatal) && resNullNatal.length === 0, 'natalArtifact === null -> Trả về mảng rỗng [] an toàn');

  // 2. spirit === null
  const natalWithoutSpirit: NatalArtifact = {
    ...mockNatalArtifactSatPhat,
    spirit: null
  };
  const resNullSpirit = detectActiveDomainResonances([skillHoa], natalWithoutSpirit, 15);
  assert(Array.isArray(resNullSpirit) && resNullSpirit.length === 0, 'spirit === null -> Trả về mảng rỗng [] an toàn');

  // 3. equippedSkills là null / undefined
  const resNullSkills = detectActiveDomainResonances(null as any, mockNatalArtifactSatPhat, 15);
  assert(Array.isArray(resNullSkills) && resNullSkills.length === 0, 'equippedSkills === null -> Không văng lỗi runtime');
}

// ============================================================
// CA KIỂM THỬ 5: CƠ CHẾ ĐA DỊ TƯỢNG ĐỒNG THỜI (MULTI-RESONANCE COEXISTENCE)
// ============================================================
console.log('\n--- TEST 5: Cơ Chế Đa Dị Tượng Đồng Thời (Multi-Resonance Coexistence) ---');
{
  // Khí Linh song trùng đặc biệt có cả tính cách Sát Phạt và Ôn Hòa (hoặc secondaryPersonality)
  const dualSpirit: ArtifactSpirit = {
    ...mockSpiritSatPhat,
    name: 'Song Hồn Huyễn Linh',
    personality: 'sat_phat',
    secondaryPersonality: 'on_hoa',
    personalities: ['sat_phat', 'on_hoa']
  } as any;

  const dualNatalArtifact: NatalArtifact = {
    ...mockNatalArtifactSatPhat,
    spirit: dualSpirit
  };

  // Trang bị đồng thời: 1 Thần Thông Hỏa + 1 Thần Thông Mộc
  const activeDualResonances = detectActiveDomainResonances([skillHoa, skillMoc], dualNatalArtifact, 20);
  assert(activeDualResonances.length === 2, `Kích hoạt thành công cả 2 Dị Tượng đồng thời (Nhận diện: ${activeDualResonances.length})`);

  const ids = activeDualResonances.map(r => r.resonanceId);
  assert(ids.includes('liet_diem_phan_than'), 'Có Dị Tượng Liệt Diễm Phần Thần (Hỏa)');
  assert(ids.includes('sinh_sinh_bat_tuc'), 'Có Dị Tượng Sinh Sinh Bất Tức (Mộc)');

  // Mô phỏng 1 hiệp đấu kích hoạt cả 2 hiệu ứng
  const attacker = { hp: 800, maxHp: 1000, mp: 500, maxMp: 500, atk: 300 };
  const defender = { hp: 2000, maxHp: 2000, mp: 1000, maxMp: 1000, atk: 200 };
  const turnResult = resolveResonanceTurnEffects(attacker, defender, activeDualResonances, 1);

  // Hiệu ứng Hỏa: đốt 5% MP (50 MP)
  assert(turnResult.updatedDefender.mp === 950, 'Hiệu ứng Liệt Diễm: Đốt 50 MP của đối phương');
  // Hiệu ứng Mộc: hồi 6% HP (60 HP)
  assert(turnResult.updatedAttacker.hp === 860, `Hiệu ứng Sinh Sinh: Hồi 60 HP cho người chơi (Từ 800 lên ${turnResult.updatedAttacker.hp})`);
  assert(turnResult.combatEvents.length === 2, 'Ghi nhận đủ 2 dòng thông báo cổ phong cho 2 Dị Tượng');
}

// ============================================================
// CA KIỂM THỬ 6: KIỂM THỬ TƯƠNG THÍCH SAVE CŨ (SAVE MIGRATION INVARIANT)
// ============================================================
console.log('\n--- TEST 6: Kiểm Thử Tương Thích Save Cũ (Save Migration Invariant) ---');
{
  // Giả lập mock save cũ (không có trường activeResonances hoặc resonanceLevel)
  const legacySaveData: Partial<PlayerStats> = {
    name: 'Tiêu Diêu Đạo Nhân',
    tuVi: 50000,
    canCot: 35,
    tamCanh: 40,
    ngoTinh: 30,
    currentRealm: 15,
    linhLuc: 800,
    maxLinhLuc: 800,
    khiHuyet: 2500,
    maxKhiHuyet: 2500,
    manuals: [skillHoa],
    equippedManuals: {
      thanThong1: skillHoa.id
    },
    natalArtifact: mockNatalArtifactSatPhat
    // Hoàn toàn không có activeResonances và resonanceLevel
  };

  const migratedPlayer = migrateDomainResonanceData(legacySaveData);

  assert(Array.isArray(migratedPlayer.activeResonances), 'Sau migration: activeResonances được khởi tạo mảng an toàn []');
  assert(migratedPlayer.resonanceLevel === 1, 'Sau migration: resonanceLevel được gán mặc định 1');
  assert(migratedPlayer.natalArtifact?.spirit?.personality === 'sat_phat', 'Bảo toàn 100% cấu trúc của natalArtifact.spirit');
  assert(migratedPlayer.equippedManuals?.thanThong1 === skillHoa.id, 'Bảo toàn 100% cấu trúc của equippedManuals');

  // Thử nghiệm nạp dữ liệu đã migrate vào combat detection
  const detected = detectActiveDomainResonances(
    [skillHoa],
    migratedPlayer.natalArtifact,
    migratedPlayer.currentRealm
  );
  assert(detected.length === 1 && detected[0].resonanceId === 'liet_diem_phan_than', 'Dữ liệu sau migration nạp vào combat chạy mượt mà');
}

console.log('\n================================================================');
console.log(`📊 KẾT QUẢ TEST SUITE: ${passedTests}/${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log('🎉 100% CÁC TEST CASES ĐÃ VƯỢT QUA! TÍNH NĂNG ĐẠT CHUẨN HOÀN TOÀN.');
} else {
  console.error(`⚠️ CÓ ${totalTests - passedTests} TEST CASES BỊ THẤT BẠI.`);
  process.exit(1);
}
console.log('================================================================\n');
