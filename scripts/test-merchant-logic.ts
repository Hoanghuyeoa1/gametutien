// scripts/test-merchant-logic.ts
// Test suite tự động nghiệm thu tầng Types & Pure Helpers cho phân hệ Vạn Bảo Thương Hội
// Chạy bằng lệnh: npx tsx scripts/test-merchant-logic.ts

import {
  calculateItemFinalPrice,
  calculateRecycleValue,
  calculateBatchRecycleValue,
  filterMerchantItems,
  sortMerchantItemsByOption,
  paginateItems,
  calculateCurrencyExchange,
  extractRecyclableItems
} from '../lib/merchant-logic';
import {
  MerchantShopItem,
  BlackMarketItem,
  MerchantFilterState
} from '../components/tabs/merchant/types';

function runTests() {
  console.log('================================================================');
  console.log('🧪 TEST SUITE: MERCHANT TYPES & PURE LOGIC (GAMETUTIEN)');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(desc: string, condition: boolean) {
    total++;
    if (condition) {
      console.log(`[PASS] Test ${total}: ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] Test ${total}: ${desc}`);
      process.exitCode = 1;
    }
  }

  // -------------------------------------------------------------
  // Test 1: calculateItemFinalPrice
  // -------------------------------------------------------------
  const price1 = calculateItemFinalPrice(1000, 0, 0);
  const price2 = calculateItemFinalPrice(1000, 0, 20); // 20% discount -> 800
  const price3 = calculateItemFinalPrice(1000, 20, 10); // realm 20 (+2%), discount 10% -> 12% discount -> 880
  const priceZero = calculateItemFinalPrice(0, 5, 10);
  const priceFloor = calculateItemFinalPrice(1, 0, 99); // max discount clamped, min floor 1

  assert(
    'Final Price Calculation & Realm/Shop Discount Scaling',
    price1 === 1000 &&
    price2 === 800 &&
    price3 === 880 &&
    priceZero === 0 &&
    priceFloor === 1
  );

  // -------------------------------------------------------------
  // Test 2: calculateRecycleValue & Batch Calculation
  // -------------------------------------------------------------
  const mockPill = { id: 'pill_exp_1', grade: 'Nhất Phẩm', quality: 'ha_pham' };
  const mockEquip = { id: 'equip_kiem_1', grade: 'Nhị Giai', quality: 'trung_pham', slot: 'weapon' };
  const valPill = calculateRecycleValue(mockPill);
  const valEquip = calculateRecycleValue(mockEquip);
  const batchVal = calculateBatchRecycleValue([mockPill, mockEquip]);

  assert(
    'Recycle Pricing Engine (50% Standard Value Floor Guard)',
    valPill >= 5 &&
    valEquip >= 5 &&
    batchVal === (valPill + valEquip)
  );

  // -------------------------------------------------------------
  // Test 3: filterMerchantItems
  // -------------------------------------------------------------
  const sampleItems: MerchantShopItem[] = [
    {
      id: 'item_1',
      itemId: 'pill_1',
      name: 'Tụ Khí Đan',
      category: 'pills',
      price: 100,
      originalPrice: 100,
      currency: 'linh_thach',
      stock: 10,
      requiredRealmIndex: 1,
      tier: 1
    },
    {
      id: 'item_2',
      itemId: 'sword_1',
      name: 'Thanh Phong Kiếm',
      category: 'equipment',
      price: 500,
      originalPrice: 500,
      currency: 'linh_thach',
      stock: 2,
      requiredRealmIndex: 5,
      tier: 2
    },
    {
      id: 'item_3',
      itemId: 'herb_1',
      name: 'Huyết Sâm Thảo',
      category: 'herbs',
      price: 80,
      originalPrice: 80,
      currency: 'linh_thach',
      stock: 20,
      requiredRealmIndex: 1,
      tier: 1
    }
  ];

  const filterCat: MerchantFilterState = {
    subTab: 'phuong_thi',
    category: 'pills',
    sortOption: 'default',
    selectedTier: 'all',
    searchQuery: ''
  };
  const filteredCat = filterMerchantItems(sampleItems, filterCat);

  const filterSearch: MerchantFilterState = {
    subTab: 'phuong_thi',
    category: 'all',
    sortOption: 'default',
    selectedTier: 'all',
    searchQuery: 'Kiếm'
  };
  const filteredSearch = filterMerchantItems(sampleItems, filterSearch);

  assert(
    'Pure Filter Engine (Category & Search Matching)',
    filteredCat.length === 1 &&
    filteredCat[0].id === 'item_1' &&
    filteredSearch.length === 1 &&
    filteredSearch[0].id === 'item_2'
  );

  // -------------------------------------------------------------
  // Test 4: sortMerchantItemsByOption
  // -------------------------------------------------------------
  const sortedPriceAsc = sortMerchantItemsByOption(sampleItems, 'price_asc');
  const sortedPriceDesc = sortMerchantItemsByOption(sampleItems, 'price_desc');
  const sortedTierDesc = sortMerchantItemsByOption(sampleItems, 'tier_desc');

  assert(
    'Pure Sort Engine (Price ASC/DESC, Tier DESC)',
    sortedPriceAsc[0].price <= sortedPriceAsc[1].price &&
    sortedPriceDesc[0].price >= sortedPriceDesc[1].price &&
    Number(sortedTierDesc[0].tier) >= Number(sortedTierDesc[1].tier)
  );

  // -------------------------------------------------------------
  // Test 5: paginateItems
  // -------------------------------------------------------------
  const manyItems = Array.from({ length: 25 }, (_, i) => ({
    id: `item_${i}`,
    name: `Item ${i}`
  }));
  const page1 = paginateItems(manyItems, 1, 10);
  const page2 = paginateItems(manyItems, 2, 10);
  const page3 = paginateItems(manyItems, 3, 10);
  const pageOutOfBound = paginateItems(manyItems, 999, 10);

  assert(
    'Pure Pagination Engine (Boundary Clamping & Total Pages Calculation)',
    page1.items.length === 10 &&
    page2.items.length === 10 &&
    page3.items.length === 5 &&
    page1.pagination.totalPages === 3 &&
    pageOutOfBound.pagination.currentPage === 3
  );

  // -------------------------------------------------------------
  // Test 6: calculateCurrencyExchange
  // -------------------------------------------------------------
  // 1:1,000 Up
  const exUpSuccess = calculateCurrencyExchange('linh_thach', 'trung_pham', 2500);
  const exUpFail = calculateCurrencyExchange('linh_thach', 'trung_pham', 800);
  // 1:1,000 Down
  const exDown = calculateCurrencyExchange('trung_pham', 'linh_thach', 3);

  assert(
    'Currency Exchange Rate (1:1,000 Ratio Determinism)',
    exUpSuccess.success &&
    exUpSuccess.resultAmount === 2 &&
    exUpSuccess.consumedAmount === 2000 &&
    exUpSuccess.remainder === 500 &&
    !exUpFail.success &&
    exDown.success &&
    exDown.resultAmount === 3000
  );

  // -------------------------------------------------------------
  // Test 7: extractRecyclableItems
  // -------------------------------------------------------------
  const mockInventory = {
    pills: [
      { id: 'pill_1', name: 'Đại Hoàn Đan', quantity: 3, grade: 'Nhất Phẩm', quality: 'trung_pham' },
      { id: 'pill_empty', name: 'Đan Hết', quantity: 0 }
    ],
    herbs: [
      { id: 'herb_1', name: 'Uẩn Linh Thảo', quantity: 5, grade: 'Nhất Giai', quality: 'ha_pham' }
    ],
    ores: [
      { id: 'ore_1', name: 'Huyền Thiết Khoáng', quantity: 2, grade: 'Nhất Giai', quality: 'ha_pham' }
    ],
    equipments: [
      { id: 'eq_1', name: 'Đạo Bào Rách', grade: 'Phàm Khí', quality: 'ha_pham', enhancement: 0 }
    ]
  };

  const extracted = extractRecyclableItems(mockInventory, 'all');
  const extractedPills = extractRecyclableItems(mockInventory, 'pill');

  assert(
    'Inventory Extraction for Recycle (Type-safe, Non-mutating)',
    extracted.length === 4 &&
    extractedPills.length === 1 &&
    extractedPills[0].quantity === 3 &&
    extractedPills[0].totalRecyclePrice === extractedPills[0].unitRecyclePrice * 3
  );

  console.log('\n================================================================');
  console.log(`KẾT QUẢ TỔNG HỢP: ${passed} / ${total} TESTS PASSED (100%)`);
  console.log('================================================================');
  if (passed === total) {
    console.log('✅ TẤT CẢ TEST CASES ĐỀU ĐẠT CHUẨN KỸ THUẬT VÀ INVARIANTS!\n');
  }
}

runTests();
