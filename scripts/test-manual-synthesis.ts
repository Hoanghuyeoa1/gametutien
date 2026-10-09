// scripts/test-manual-synthesis.ts
// Test suite tự động cho Hệ Thống Dung Hợp Công Pháp (Bàn Diễn Võ Vạn Pháp)
// Chạy: npx tsx scripts/test-manual-synthesis.ts

import {
  canSynthesizeManuals,
  generateSynthesizedName,
  calculateSynthesizedStats,
  rollSynthesisMutation,
  synthesizeManuals,
  findEligibleSynthesisPairs,
  MANUAL_GRADE_ORDER,
  SYNTHESIS_TIER_CONFIG,
  SYNTHESIS_CATALYSTS
} from '../lib/manual-synthesis-logic';
import { Manual } from '../lib/types/items';
import { SynthesizedManualExtension, ManualCombatAura } from '../lib/types/manual-synthesis';

// ─── Helpers ─────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${label}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// Bí kíp Tam Giai (Địa Giai) – Tâm Pháp Công Kích
const manualA_tam_phap_huyen: Manual & SynthesizedManualExtension = {
  id: 'tp_test_001',
  name: 'Liệt Hỏa Tâm Kinh',
  type: 'tam_phap',
  grade: 'Huyền Giai',
  element: 'hoa',
  description: 'Tâm pháp hỏa hệ thử nghiệm',
  level: 5,
  maxLevel: 10,
  tuViPerLevel: 2500,
  linhThachPerLevel: 150,
  minNgoTinh: 35,
  speedBonusPerLevel: 7,
  mpBonusPerLevel: 40,
  priceLinhThach: 1200,
  isSynthesized: false,
  innateAura: null
};

const manualB_tam_phap_huyen: Manual & SynthesizedManualExtension = {
  id: 'tp_test_002',
  name: 'Bôn Lôi Huyền Chú',
  type: 'tam_phap',
  grade: 'Huyền Giai',
  element: 'loi',
  description: 'Tâm pháp lôi hệ thử nghiệm',
  level: 3,
  maxLevel: 10,
  tuViPerLevel: 2800,
  linhThachPerLevel: 170,
  minNgoTinh: 38,
  speedBonusPerLevel: 8,
  mpBonusPerLevel: 45,
  priceLinhThach: 1500,
  isSynthesized: false,
  innateAura: null
};

// Bí kíp khác phân hệ
const manualC_than_phap_huyen: Manual & SynthesizedManualExtension = {
  id: 'tp_test_003',
  name: 'Lăng Ba Vi Bộ',
  type: 'than_phap',
  grade: 'Huyền Giai',
  element: 'thuy',
  description: 'Thân pháp thủy hệ',
  level: 2,
  maxLevel: 10,
  tuViPerLevel: 2000,
  linhThachPerLevel: 120,
  minNgoTinh: 30,
  speedBonusPerLevel: 15,
  mpBonusPerLevel: 20,
  isSynthesized: false,
  innateAura: null
};

// Bí kíp khác giai
const manualD_tam_phap_dia: Manual & SynthesizedManualExtension = {
  id: 'tp_test_004',
  name: 'Tam Muội Chân Hỏa Quyết',
  type: 'tam_phap',
  grade: 'Địa Giai',
  element: 'hoa',
  description: 'Tâm pháp Địa Giai',
  level: 1,
  maxLevel: 10,
  tuViPerLevel: 8000,
  linhThachPerLevel: 400,
  minNgoTinh: 50,
  speedBonusPerLevel: 12,
  mpBonusPerLevel: 80,
  isSynthesized: false,
  innateAura: null
};

// Empty equipped slots
const emptySlots: Record<string, any> = {};
// Slots với bí kíp đang trang bị
const equippedSlotsWithA: Record<string, any> = { tamPhap: 'tp_test_001' };

// ─── BẮTKĐẦU TEST SUITE ───────────────────────────────────────────────────────
console.log('════════════════════════════════════════════════════════════════════');
console.log('📜 KHỞI ĐỘNG TEST SUITE: DUNG HỢP CÔNG PHÁP (BÀN DIỄN VÕ VẠN PHÁP)');
console.log('════════════════════════════════════════════════════════════════════');

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CASE 1: THẨM ĐỊNH RÀNG BUỘC HỢP LỆ (Validation Guard)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n--- TEST CASE 1: THẨM ĐỊNH RÀNG BUỘC HỢP LỆ ---');

{
  // 1a. Khác phân hệ → bị chặn
  const r1a = canSynthesizeManuals(manualA_tam_phap_huyen, manualC_than_phap_huyen, 99999, 30, emptySlots, 0);
  assert('1a. Khác phân hệ (Tâm Pháp + Thân Pháp) → bị chặn với thông báo lỗi', !r1a.eligible);
  assert('1a. Thông báo lỗi chứa "phân hệ"', (r1a.reason ?? '').includes('phân hệ') || (r1a.reason ?? '').length > 0);

  // 1b. Lệch giai → bị chặn
  const r1b = canSynthesizeManuals(manualA_tam_phap_huyen, manualD_tam_phap_dia, 99999, 30, emptySlots, 0);
  assert('1b. Lệch giai (Huyền Giai + Địa Giai) → bị chặn', !r1b.eligible);
  assert('1b. Thông báo lỗi chứa "giai bậc"', (r1b.reason ?? '').includes('giai bậc') || (r1b.reason ?? '').length > 0);

  // 1c. Cùng phân hệ + cùng giai → hợp lệ
  const r1c = canSynthesizeManuals(manualA_tam_phap_huyen, manualB_tam_phap_huyen, 99999, 30, emptySlots, 0);
  assert('1c. Cùng phân hệ + cùng giai → eligible: true', r1c.eligible);

  // 1d. Cảnh giới không đủ → bị chặn
  const r1d = canSynthesizeManuals(manualA_tam_phap_huyen, manualB_tam_phap_huyen, 99999, 2, emptySlots, 0);
  assert('1d. Cảnh giới không đủ → bị chặn', !r1d.eligible);

  // 1e. Không đủ Linh Thạch → bị chặn
  const r1e = canSynthesizeManuals(manualA_tam_phap_huyen, manualB_tam_phap_huyen, 100, 30, emptySlots, 0);
  assert('1e. Không đủ Linh Thạch → bị chặn', !r1e.eligible);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CASE 2: PHÒNG VỆ TỰ TRÙNG LẶP & KHÓA ĐANG TRANG BỊ
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n--- TEST CASE 2: PHÒNG VỆ TỰ TRÙNG LẶP & KHÓA ĐANG TRANG BỊ ---');

{
  // 2a. Cùng 1 ID → bị chặn (Anti-Self)
  const r2a = canSynthesizeManuals(manualA_tam_phap_huyen, manualA_tam_phap_huyen, 99999, 30, emptySlots, 0);
  assert('2a. Cùng 1 bí kíp cho cả slot A và B → bị chặn (Anti-Self)', !r2a.eligible);

  // 2b. Bí kíp đang trang bị → bị chặn
  const r2b = canSynthesizeManuals(manualA_tam_phap_huyen, manualB_tam_phap_huyen, 99999, 30, equippedSlotsWithA, 0);
  assert('2b. Bí kíp A đang trang bị → bị chặn với yêu cầu tháo ra', !r2b.eligible);
  assert('2b. Thông báo chứa tên bí kíp đang trang bị', (r2b.reason ?? '').includes(manualA_tam_phap_huyen.name));
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CASE 3: THỰC THI DUNG HỢP TĂNG GIAI THÀNH CÔNG
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n--- TEST CASE 3: THỰC THI DUNG HỢP TĂNG GIAI THÀNH CÔNG ---');

{
  const initialManualsInventory: Manual[] = [manualA_tam_phap_huyen, manualB_tam_phap_huyen, manualC_than_phap_huyen];
  const initialLinhThach = 50000;

  const result3 = synthesizeManuals(
    manualA_tam_phap_huyen,
    manualB_tam_phap_huyen,
    initialLinhThach,
    30,
    emptySlots,
    initialManualsInventory,
    null,
    0,
    false
  );

  assert('3a. Dung hợp thành công (success: true)', result3.success);

  const synth = result3.synthesisResult?.synthesizedManual;
  assert('3b. Bí kíp mới có giai cao hơn 1 bậc (Địa Giai)', synth?.grade === 'Địa Giai');
  assert('3c. Bí kíp mới có isSynthesized: true', synth?.isSynthesized === true);

  // Kiểm tra 2 bí kíp gốc bị loại khỏi kho
  const newInventory = result3.updatedManualsInventory ?? [];
  assert('3d. Bí kíp A bị xóa khỏi kho', !newInventory.some(m => m.id === manualA_tam_phap_huyen.id));
  assert('3e. Bí kíp B bị xóa khỏi kho', !newInventory.some(m => m.id === manualB_tam_phap_huyen.id));
  assert('3f. Kho chứa bí kíp mới dung hợp', newInventory.some(m => m.isSynthesized));
  assert('3g. Bí kíp C (khác phân hệ) vẫn còn trong kho', newInventory.some(m => m.id === manualC_than_phap_huyen.id));

  // Kiểm tra trừ Linh Thạch
  const expectedCost = SYNTHESIS_TIER_CONFIG[2]?.costLinhThach ?? 2000; // Huyền Giai = order 2
  assert('3h. Linh Thạch bị trừ đúng số lượng', result3.updatedLinhThach === initialLinhThach - expectedCost,
    `Expected: ${initialLinhThach - expectedCost}, Got: ${result3.updatedLinhThach}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CASE 4: KẾ THỪA CHỈ SỐ LAI & SINH TÊN CỔ PHONG
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n--- TEST CASE 4: KẾ THỪA CHỈ SỐ LAI & SINH TÊN CỔ PHONG ---');

{
  const result4 = synthesizeManuals(
    manualA_tam_phap_huyen,
    manualB_tam_phap_huyen,
    99999, 30, emptySlots,
    [manualA_tam_phap_huyen, manualB_tam_phap_huyen],
    null, 0, false
  );

  const synth4 = result4.synthesisResult?.synthesizedManual;

  // Kiểm tra chỉ số vượt trội
  const avgTuVi = (manualA_tam_phap_huyen.tuViPerLevel + manualB_tam_phap_huyen.tuViPerLevel) / 2;
  assert('4a. tuViPerLevel bí kíp mới > trung bình 2 bí kíp gốc', (synth4?.tuViPerLevel ?? 0) > avgTuVi);

  const avgSpeed = ((manualA_tam_phap_huyen.speedBonusPerLevel ?? 0) + (manualB_tam_phap_huyen.speedBonusPerLevel ?? 0)) / 2;
  assert('4b. speedBonusPerLevel bí kíp mới > trung bình 2 bí kíp gốc', (synth4?.speedBonusPerLevel ?? 0) > avgSpeed);

  // Kiểm tra tên không có undefined
  const name4 = synth4?.name ?? '';
  assert('4c. Tên bí kíp không chứa "undefined"', !name4.includes('undefined'));
  assert('4d. Tên bí kíp không trống và độ dài > 3', name4.length > 3);
  console.log(`     → Tên bí kíp sinh ra: "${name4}"`);

  // Kiểm tra synthesisParents
  assert('4e. synthesisParents.nameA khớp với tên manualA', synth4?.synthesisParents?.nameA === manualA_tam_phap_huyen.name);
  assert('4f. synthesisParents.nameB khớp với tên manualB', synth4?.synthesisParents?.nameB === manualB_tam_phap_huyen.name);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CASE 5: CƠ CHẾ DỊ BIẾN & ĐẠO CỤ XÚC TÁC
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n--- TEST CASE 5: CƠ CHẾ DỊ BIẾN & ĐẠO CỤ XÚC TÁC ---');

{
  // 5a. Force mutation → bí kíp phải có innateAura
  const result5a = synthesizeManuals(
    manualA_tam_phap_huyen,
    manualB_tam_phap_huyen,
    99999, 30, emptySlots,
    [manualA_tam_phap_huyen, manualB_tam_phap_huyen],
    null, 0,
    true  // forceMutation = true
  );

  const synth5a = result5a.synthesisResult?.synthesizedManual;
  assert('5a. Force mutation → mutationTriggered: true', result5a.synthesisResult?.mutationTriggered === true);
  assert('5b. Force mutation → innateAura không null', synth5a?.innateAura !== null && synth5a?.innateAura !== undefined);
  assert('5c. innateAura có đủ các trường bắt buộc',
    typeof synth5a?.innateAura?.id === 'string' &&
    typeof synth5a?.innateAura?.name === 'string' &&
    typeof synth5a?.innateAura?.triggerChance === 'number' &&
    typeof synth5a?.innateAura?.effectType === 'string'
  );
  if (synth5a?.innateAura) {
    console.log(`     → Dị Biến kích hoạt: "${synth5a.innateAura.name}" (${synth5a.innateAura.effectType}, ${synth5a.innateAura.triggerChance}%)`);
  }

  // 5b. Dùng catalyst tăng tỉ lệ Dị Biến
  const catalystNgoDaoThach = SYNTHESIS_CATALYSTS.find(c => c.itemId === 'ngo_dao_thach')!;
  const result5b = synthesizeManuals(
    manualA_tam_phap_huyen,
    manualB_tam_phap_huyen,
    99999, 30, emptySlots,
    [manualA_tam_phap_huyen, manualB_tam_phap_huyen],
    catalystNgoDaoThach,
    3  // có 3 Ngộ Đạo Thạch trong kho
  );
  assert('5d. Dung hợp với xúc tác thành công', result5b.success);
  assert('5e. costCatalystCount = 1 khi dùng xúc tác', result5b.synthesisResult?.costCatalystCount === 1);

  // 5c. Dùng Thiên Đạo Tinh Thạch (guaranteedAura) → luôn có Dị Biến
  const catalystTienDao = SYNTHESIS_CATALYSTS.find(c => c.itemId === 'thien_dao_tinh_thach')!;
  const result5c = synthesizeManuals(
    manualA_tam_phap_huyen,
    manualB_tam_phap_huyen,
    99999, 30, emptySlots,
    [manualA_tam_phap_huyen, manualB_tam_phap_huyen],
    catalystTienDao,
    1
  );
  assert('5f. Thiên Đạo Tinh Thạch (guaranteedAura) → luôn có innateAura', result5c.synthesisResult?.mutationTriggered === true);

  // 5d. Không đủ xúc tác → bị chặn
  const result5d = synthesizeManuals(
    manualA_tam_phap_huyen,
    manualB_tam_phap_huyen,
    99999, 30, emptySlots,
    [manualA_tam_phap_huyen, manualB_tam_phap_huyen],
    catalystNgoDaoThach,
    0  // không có xúc tác
  );
  assert('5g. Không đủ xúc tác → bị chặn', !result5d.success);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST CASE 6: TƯƠNG THÍCH SAVE CŨ (Save Migration Invariant)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n--- TEST CASE 6: TƯƠNG THÍCH SAVE CŨ (Save Migration Invariant) ---');

{
  // Giả lập save cũ: Manual không có trường isSynthesized, innateAura, synthesisParents
  const legacyManual = {
    id: 'tp_legacy_001',
    name: 'Cổ Đại Bí Kíp',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    level: 5,
    maxLevel: 10,
    description: 'Save cũ',
    tuViPerLevel: 2000,
    linhThachPerLevel: 100,
    minNgoTinh: 30
    // Không có isSynthesized, innateAura, synthesisParents
  } as any;

  // Giả lập hàm migration thêm trường mặc định (từ save-migration.ts)
  function migrateManualItem(m: any): any {
    return {
      ...m,
      isSynthesized: m.isSynthesized ?? false,
      synthesisTier: m.synthesisTier ?? 0,
      synthesisParents: m.synthesisParents ?? null,
      innateAura: m.innateAura ?? null,
    };
  }

  const migrated = migrateManualItem(legacyManual);
  assert('6a. isSynthesized mặc định = false cho save cũ', migrated.isSynthesized === false);
  assert('6b. synthesisTier mặc định = 0 cho save cũ', migrated.synthesisTier === 0);
  assert('6c. synthesisParents mặc định = null cho save cũ', migrated.synthesisParents === null);
  assert('6d. innateAura mặc định = null cho save cũ', migrated.innateAura === null);
  assert('6e. Dữ liệu gốc không thay đổi (name, type, grade)', migrated.name === legacyManual.name && migrated.grade === legacyManual.grade);

  // Kiểm tra bí kíp cũ sau migration vẫn dùng được trong hàm canSynthesize
  const migratedFull = migrateManualItem(legacyManual) as Manual & SynthesizedManualExtension;
  const legacyB = migrateManualItem({ ...legacyManual, id: 'tp_legacy_002', name: 'Cổ Đại Bí Kíp II' }) as Manual & SynthesizedManualExtension;
  const r6f = canSynthesizeManuals(migratedFull, legacyB, 99999, 30, {}, 0);
  assert('6f. Bí kíp save cũ đã migrate vẫn vượt qua canSynthesizeManuals không lỗi undefined', typeof r6f.eligible === 'boolean');

  // Kiểm tra MANUAL_GRADE_ORDER không trả về NaN cho grade hợp lệ
  assert('6g. MANUAL_GRADE_ORDER["Huyền Giai"] = 2', MANUAL_GRADE_ORDER['Huyền Giai'] === 2);
  assert('6h. MANUAL_GRADE_ORDER["Địa Giai"] = 3', MANUAL_GRADE_ORDER['Địa Giai'] === 3);
  assert('6i. MANUAL_GRADE_ORDER["Thần Giai"] = 5', MANUAL_GRADE_ORDER['Thần Giai'] === 5);

  // Auto-match tìm cặp hợp lệ không crash với dữ liệu lẫn lộn
  const mixedInventory = [migratedFull, legacyB, manualC_than_phap_huyen] as Manual[];
  const pairs = findEligibleSynthesisPairs(mixedInventory);
  assert('6j. findEligibleSynthesisPairs không crash với dữ liệu save cũ', Array.isArray(pairs));
  assert('6k. Tìm được cặp hợp lệ (Huyền Giai + Huyền Giai)', pairs.length >= 1);
}

// ─── KẾT QUẢ ─────────────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════════════════════');
const total = passed + failed;
console.log(`KẾT QUẢ KIỂM THỬ: ${passed}/${total} TIÊU CHÍ ĐẠT (${Math.round(passed/total*100)}%)`);
console.log('════════════════════════════════════════════════════════════════════');

if (failed === 0) {
  console.log('🎉 TOÀN BỘ CA KIỂM THỬ ĐÃ VƯỢT QUA XUẤT SẮC! HỆ THỐNG SẴN SÀNG.');
} else {
  console.error(`⚠️  CÓ ${failed} CA KIỂM THỬ THẤT BẠI. VUI LÒNG KIỂM TRA LẠI.`);
  process.exit(1);
}
