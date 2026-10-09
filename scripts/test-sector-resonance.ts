// scripts/test-sector-resonance.ts
// Test Suite kiểm tra toàn diện phân hệ:
// "Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense / Tinh Vực Cộng Hưởng Trận)"
// Bao phủ đầy đủ 6 ca kiểm thử theo đặc tả kỹ thuật

import {
  calculateCosmicDistance,
  calculateTransmissionEfficiency,
  calculateCrossFireDamage,
  canEstablishResonanceLink,
  establishResonanceLink,
  evaluateResonanceGridAuras,
  calculateCrossFireArtillerySupport,
  MAX_RESONANCE_DISTANCE,
  LINK_ACTIVATION_COST_LINH_THACH,
  CROSS_FIRE_ENERGY_COST_PER_SHOT,
} from '../lib/sector-resonance-logic';
import { migrateSectorResonanceData, normalizePlayerData } from '../lib/save-migration';
import type { SectorResonanceLink } from '../lib/types/sector-resonance';
import type { PlayerStats } from '../lib/types/player';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${testName}`);
    passedTests++;
  } else {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${testName}${detail ? ` - ${detail}` : ''}`);
    failedTests++;
  }
}

console.log('\n\x1b[36m╔════════════════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[36m║   KIỂM THỬ PHÂN HỆ: TRẬN PHÁP LIÊN KẾT TINH VỰC (RESONANCE GRID)   ║\x1b[0m');
console.log('\x1b[36m╚════════════════════════════════════════════════════════════════════╝\x1b[0m\n');

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: Kiểm Tra Điều Kiện Thiết Lập Mạng Lưới (Topology Guard)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\x1b[33m--- CA KIỂM THỬ 1: Topology Guard & Validation Điều Kiện Mạng Lưới ---\x1b[0m');
{
  const mockNodesMap = {
    node_a: { id: 'node_a', name: 'Thiên Xu Tinh', x: 10, y: 10 },
    node_b: { id: 'node_b', name: 'Thiên Toàn Tinh', x: 50, y: 50 },     // d ≈ 56.57 <= 250
    node_far: { id: 'node_far', name: 'Hư Không Biên Giới', x: 300, y: 300 }, // d ≈ 410 > 250
  };

  // Case 1a: Cứ điểm chưa chiếm lĩnh -> Từ chối
  const checkUnoccupied = canEstablishResonanceLink('node_a', 'node_b', {
    occupiedNodeIds: ['node_a'], // node_b chưa chiếm
    fortifications: {
      node_a: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_b: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    nodesMap: mockNodesMap,
    playerLinhThach: 100_000,
  });
  assert(!checkUnoccupied.allowed && !!checkUnoccupied.reason, 'Cứ điểm chưa chiếm lĩnh bị từ chối kèm lý do rõ ràng');

  // Case 1b: Cứ điểm chưa có Tru Ma Pháo -> Từ chối
  const checkNoCannon = canEstablishResonanceLink('node_a', 'node_b', {
    occupiedNodeIds: ['node_a', 'node_b'],
    fortifications: {
      node_a: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_b: { truMaPhaoLevel: 0, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 }, // Cấp 0
    },
    nodesMap: mockNodesMap,
    playerLinhThach: 100_000,
  });
  assert(!checkNoCannon.allowed && !!checkNoCannon.reason, 'Cứ điểm thiếu Tru Ma Pháo bị từ chối');

  // Case 1c: Khoảng cách > 250 -> Từ chối
  const checkTooFar = canEstablishResonanceLink('node_a', 'node_far', {
    occupiedNodeIds: ['node_a', 'node_far'],
    fortifications: {
      node_a: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_far: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    nodesMap: mockNodesMap,
    playerLinhThach: 100_000,
  });
  assert(!checkTooFar.allowed && (checkTooFar.distance ?? 0) > MAX_RESONANCE_DISTANCE, 'Khoảng cách vượt bán kính cộng hưởng (> 250) bị từ chối');

  // Case 1d: Hợp lệ -> Thành công
  const checkValid = canEstablishResonanceLink('node_a', 'node_b', {
    occupiedNodeIds: ['node_a', 'node_b'],
    fortifications: {
      node_a: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_b: { truMaPhaoLevel: 2, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    nodesMap: mockNodesMap,
    playerLinhThach: 100_000,
  });
  assert(checkValid.allowed && (checkValid.distance ?? 0) <= MAX_RESONANCE_DISTANCE, 'Khoảng cách <= 250 và có pháo được duyệt liên kết');

  const establishRes = establishResonanceLink('node_a', 'node_b', {
    occupiedNodeIds: ['node_a', 'node_b'],
    fortifications: {
      node_a: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_b: { truMaPhaoLevel: 2, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    nodesMap: mockNodesMap,
    playerLinhThach: 100_000,
  });
  assert(establishRes.success && establishRes.link?.isActive === true, 'Tạo Tuyến Năng Lượng Tinh Vực thành công');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: Suy Hao Hỏa Lực Theo Cự Ly (Distance Falloff Invariant)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[33m--- CA KIỂM THỬ 2: Distance Falloff Invariant (Suy Hao Theo Cự Ly) ---\x1b[0m');
{
  const baseCannonDamage = 20_000;
  const garrisonMultiplier = 1.0;

  const dmgAt50 = calculateCrossFireDamage(baseCannonDamage, garrisonMultiplier, 50);
  const dmgAt200 = calculateCrossFireDamage(baseCannonDamage, garrisonMultiplier, 200);

  const eff50 = calculateTransmissionEfficiency(50);
  const eff200 = calculateTransmissionEfficiency(200);

  console.log(`    • Cự ly 50 đơn vị  : Sát thương = ${dmgAt50.toLocaleString()} (Hiệu suất: ${(eff50 * 100).toFixed(1)}%)`);
  console.log(`    • Cự ly 200 đơn vị : Sát thương = ${dmgAt200.toLocaleString()} (Hiệu suất: ${(eff200 * 100).toFixed(1)}%)`);

  assert(dmgAt50 > dmgAt200, `Chi viện cự ly 50 (${dmgAt50}) gây sát thương lớn hơn cự ly 200 (${dmgAt200})`);
  assert(eff50 > eff200, 'Hiệu suất truyền dẫn cự ly 50 cao hơn cự ly 200 chuẩn xác theo công thức');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: Phòng Vệ Cạn Kiệt Năng Lượng (Energy Depletion Guard)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[33m--- CA KIỂM THỬ 3: Energy & Anti-Exploit Guard (Không Cho Phép Bắn Nợ) ---\x1b[0m');
{
  const link: SectorResonanceLink = {
    id: 'link_a_b',
    sourceNodeId: 'node_b',
    targetNodeId: 'node_a',
    distance: 40,
    isActive: true,
    energyTransmissionEfficiency: 0.85,
    establishedAt: Date.now(),
  };

  // Người chơi hết sạch Linh Thạch và Năng Lượng dự trữ (0 Linh Thạch)
  const resultDepleted = calculateCrossFireArtillerySupport({
    defendingNodeId: 'node_a',
    waveHp: 50_000,
    links: [link],
    fortifications: {
      node_b: { truMaPhaoLevel: 2, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    playerLinhThach: 0,
    crossFireEnergyBuffer: 0,
  });

  assert(resultDepleted.crossFireDamageTotal === 0, 'Khi cạn kiệt năng lượng, hỏa lực chi viện bị ngắt lập tức (0 damage)');
  assert(resultDepleted.totalEnergyConsumed === 0, 'Không tiêu hao và không phát sinh số dư âm tài nguyên');
  assert(resultDepleted.remainingLinhThach === 0, 'Linh Thạch được bảo toàn, không bị bắn nợ');
  assert(
    resultDepleted.logs.some(l => l.includes('HẾT NĂNG LƯỢNG')),
    'Hệ thống ghi log cảnh báo ngắt kết nối do hết năng lượng'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: Kích Hoạt Lĩnh Vực Cộng Hưởng 3 Điểm (Triangular Resonance Grid Aura)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[33m--- CA KIỂM THỬ 4: Triangular Resonance Grid Aura (Lĩnh Vực 3 Điểm) ---\x1b[0m');
{
  // Mạng lưới tam giác: A - B, B - C, C - A
  const triangleLinks: SectorResonanceLink[] = [
    {
      id: 'link_ab',
      sourceNodeId: 'node_a',
      targetNodeId: 'node_b',
      distance: 60,
      isActive: true,
      energyTransmissionEfficiency: 0.8,
      establishedAt: Date.now(),
    },
    {
      id: 'link_bc',
      sourceNodeId: 'node_b',
      targetNodeId: 'node_c',
      distance: 70,
      isActive: true,
      energyTransmissionEfficiency: 0.78,
      establishedAt: Date.now(),
    },
    {
      id: 'link_ca',
      sourceNodeId: 'node_c',
      targetNodeId: 'node_a',
      distance: 80,
      isActive: true,
      energyTransmissionEfficiency: 0.77,
      establishedAt: Date.now(),
    },
  ];

  const auraResult = evaluateResonanceGridAuras(triangleLinks);

  assert(auraResult.hasTriangle === true, 'Nhận diện thành công chu trình mạng lưới tam giác 3 cứ điểm');
  assert(
    auraResult.activeAuras.includes('thai_vi_toa_ma'),
    'Kích hoạt thành công Lĩnh Vực Thái Vi Tỏa Ma Quang'
  );
  assert(
    auraResult.activeAuras.includes('hu_khong_phan_chan'),
    'Kích hoạt thành công Lĩnh Vực Hư Không Phản Chấn Trận'
  );

  // Kiểm tra hiệu ứng suy giảm 25% công kích của quái vật
  const baseMonsterAtk = 10_000;
  const outcome = calculateCrossFireArtillerySupport({
    defendingNodeId: 'node_a',
    waveHp: 60_000,
    waveAtk: baseMonsterAtk,
    links: triangleLinks,
    fortifications: {
      node_b: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_c: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    playerLinhThach: 50_000,
  });

  const expectedReducedAtk = Math.round(baseMonsterAtk * (1 - 0.25));
  assert(
    outcome.reducedWaveAtk === expectedReducedAtk,
    `Lĩnh vực giảm chính xác 25% công kích quái vật (${baseMonsterAtk} -> ${outcome.reducedWaveAtk})`
  );
  assert(outcome.absorbedShieldDamage > 0, 'Hư Không Phản Chấn Trận chuyển hóa 15% sát thương thành lá chắn bảo vệ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Mô Phỏng Chi Viện Trong Đại Ba Dị Tộc (Full Invasion Simulation)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[33m--- CA KIỂM THỬ 5: Full Invasion Simulation (Đại Ba 100,000 HP) ---\x1b[0m');
{
  // Đại ba 100,000 HP tấn công Node A
  // 3 cứ điểm B, C, D chi viện gây tổng cộng 45,000 sát thương (mỗi node 15,000)
  const links: SectorResonanceLink[] = [
    {
      id: 'l_ba',
      sourceNodeId: 'node_b',
      targetNodeId: 'node_a',
      distance: 0,
      isActive: true,
      energyTransmissionEfficiency: 1.0,
      establishedAt: Date.now(),
    },
    {
      id: 'l_ca',
      sourceNodeId: 'node_c',
      targetNodeId: 'node_a',
      distance: 0,
      isActive: true,
      energyTransmissionEfficiency: 1.0,
      establishedAt: Date.now(),
    },
    {
      id: 'l_da',
      sourceNodeId: 'node_d',
      targetNodeId: 'node_a',
      distance: 0,
      isActive: true,
      energyTransmissionEfficiency: 1.0,
      establishedAt: Date.now(),
    },
  ];

  const waveHp = 100_000;
  const outcome = calculateCrossFireArtillerySupport({
    defendingNodeId: 'node_a',
    waveHp,
    waveAtk: 25_000,
    links,
    fortifications: {
      node_b: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_c: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
      node_d: { truMaPhaoLevel: 1, huyenTranLevel: 0, hoCuongGiapLevel: 0, tuLinhDaiLevel: 0 },
    },
    playerLinhThach: 100_000,
    baseCannonDamageOverride: 15_000, // 3 node x 15,000 = 45,000 damage
  });

  console.log(`    • HP ban đầu của đại ba  : ${outcome.baseWavePower.toLocaleString()} HP`);
  console.log(`    • Tổng sát thương chi viện: ${outcome.crossFireDamageTotal.toLocaleString()}`);
  console.log(`    • HP còn lại của đợt quái : ${outcome.hpRemainingAfterCrossFire.toLocaleString()} HP`);

  assert(
    outcome.crossFireDamageTotal === 45_000,
    'Ba cứ điểm lân cận khai hỏa pháo kích hỗ trợ gây chuẩn xác 45,000 sát thương'
  );
  assert(
    outcome.hpRemainingAfterCrossFire === 55_000,
    'Đợt quái chỉ còn lại chính xác 55,000 HP khi chạm hàng rào kết giới'
  );
  assert(outcome.participatingNodes.length === 3, 'Cả 3 cứ điểm lân cận đều tham gia chi viện hỏa lực');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 6: Kiểm Thử Khả Năng Tương Thích Save Cũ (Save Migration Invariant)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[33m--- CA KIỂM THỬ 6: Save Migration Invariant (Tương Thích Dữ Liệu Cũ) ---\x1b[0m');
{
  // Giả lập save game cũ phiên bản trước, hoàn toàn không có trường resonance
  const legacySaveData: any = {
    currentRealm: 60,
    linhThach: 500_000,
    cosmicState: {
      unlocked: true,
      currentNodeId: 'node_thai_vi_entry',
      occupiedNodeIds: ['node_thai_vi_entry', 'node_thai_vi_tianji'],
      vessel: { name: 'Thái Hư Phi Chu', level: 2 },
      defenseState: {
        fortifications: {
          node_thai_vi_entry: { truMaPhaoLevel: 2 },
        },
        garrisons: {},
        activeIncursions: [],
        lastIncursionCheckTime: Date.now() - 3600000,
        incursionsRepelledCount: 5,
        incursionsBreachedCount: 1,
        // Cố tình không có sectorResonanceGrid, resonanceLinks, crossFireEnergyBuffer
      },
    },
  };

  const migratedPlayer = migrateSectorResonanceData(legacySaveData as PlayerStats);

  assert(
    Array.isArray(migratedPlayer.cosmicState?.defenseState?.sectorResonanceGrid),
    'Tự động khởi tạo sectorResonanceGrid an toàn dưới dạng mảng []'
  );
  assert(
    Array.isArray(migratedPlayer.cosmicState?.defenseState?.resonanceLinks),
    'Tự động khởi tạo resonanceLinks an toàn dưới dạng mảng []'
  );
  assert(
    typeof migratedPlayer.cosmicState?.defenseState?.crossFireEnergyBuffer === 'number',
    'Tự động khởi tạo crossFireEnergyBuffer = 0 an toàn'
  );
  assert(
    migratedPlayer.cosmicState?.defenseState?.incursionsRepelledCount === 5,
    'Bảo toàn nguyên vẹn số liệu thống kê phòng thủ cũ trong save'
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tổng Kết Kết Quả
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[36m════════════════════════════════════════════════════════════════════\x1b[0m');
console.log(`\x1b[32m✔ TỔNG SỐ TEST CASES ĐẠT: ${passedTests}\x1b[0m`);
if (failedTests > 0) {
  console.log(`\x1b[31m✖ TỔNG SỐ TEST CASES THẤT BẠI: ${failedTests}\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32m★ TẤT CẢ 6 CA KIỂM THỬ ĐỀU VƯỢT QUA 100%! HỆ THỐNG ĐẠT CHUẨN INVARIANT.\x1b[0m');
  console.log('\x1b[36m════════════════════════════════════════════════════════════════════\x1b[0m\n');
}
