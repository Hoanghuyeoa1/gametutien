# 📜 NHẬT KÝ THAY ĐỔI DỰ ÁN (MASTER CHANGELOG) - GAMETUTIEN

> **Kiến trúc hệ thống:** Next.js 16 App Router • React 19 • TypeScript Strict Mode • Tailwind CSS v4 • Single-Player Client-First 100%
> **Quy chuẩn tài liệu:** Clean Architecture • Documentation Engineering • 5-Part Standard Form
> **Tài liệu tham chiếu:** [📖 Tài liệu kiến trúc & Hướng dẫn cài đặt (README.md)](./README.md)

Chào mừng đạo hữu đến với **Trung Tâm Tra Cứu Lịch Sử Phát Triển (Master Changelog Hub)** của đại dự án **GAMETUTIEN**. Toàn bộ quá trình tiến hóa từ nền tảng khởi nguyên, các lần tái cấu trúc kiến trúc, hệ thống bách nghệ, thế gia huyết mạch cho đến tinh hải thương hội đỉnh cao được phân loại và lưu trữ theo từng giai đoạn phát triển (Development Phases) nhằm tối ưu ngữ cảnh, tra cứu trực quan và bảo tồn toàn vẹn 100% dữ liệu kỹ thuật.

---

## 🧭 BẢNG CHỈ MỤC LỊCH SỬ TOÀN DIỆN (MASTER ARCHIVE DIRECTORY)

| Giai Đoạn | Tên Chuyên Đề & Cột Mốc | Mốc Thời Gian | Số Bản Ghi | Các Phân Hệ Trọng Tâm | Tệp Lưu Trữ Chi Tiết |
|:---:|:---|:---:|:---:|:---|:---:|
| **Phase 1** | **Nền Tảng Khởi Thủy & Cốt Lõi Roguelite** | 2026-09-28 → 2026-09-29 | 43 | Next.js 16 Engine, 105 Cảnh Giới, Thể Tu & Hồn Tu, Động Phủ, Tứ Đại Bách Nghệ, Bí Cảnh Roguelite, Cốt Truyện I-VII, Bản Mệnh Pháp Bảo, Đấu Giá Hội | [📜 `PHASE_1_CORE_FOUNDATIONS.md`](./docs/changelogs/PHASE_1_CORE_FOUNDATIONS.md) |
| **Phase 2** | **Đột Phá Kiến Trúc & Mở Rộng Hệ Thống** | 2026-10-02 (06:30 – 14:35) | 18 | Khóa Cảnh Giới Đa Phân Hệ, 20 Tông Môn 5 Tier, Đại Cải Tổ Thương Hội (Đan Dược, Khoáng Thạch, Tier 1-9, Comparator, Lò Dung Luyện), Linh Mạch, Luân Hồi Meta, PvP Thiên Kiêu, Tiên Thư Adler-32, 65 Thành Tựu, Sức Chứa Túi Đồ, Ấp Trứng Linh Thú | [📜 `PHASE_2_SYSTEMS_EXPANSION.md`](./docs/changelogs/PHASE_2_SYSTEMS_EXPANSION.md) |
| **Phase 3** | **Thế Gia, Huyết Mạch & Tông Môn** | 2026-10-02 (14:05 – 15:50) | 4 | Lục Đạo Tiên Bi (Bia Mộ Tiền Kiếp), Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch (Genetics & Combat Synergy), Đạo Vận Tiên Bi (Tổ Tiên Phù Hộ), Khai Tông Lập Phái & Chân Truyền Đệ Tử | [📜 `PHASE_3_LINEAGE_AND_SECTS.md`](./docs/changelogs/PHASE_3_LINEAGE_AND_SECTS.md) |
| **Phase 4** | **Tinh Hải & Thương Hội Đỉnh Cao** | 2026-10-02 (16:10 – 22:30) | 10 | Vực Ngoại Dị Tộc Tập Kích & Cứ Điểm Tinh Hải, Ký Gửi Đấu Giá & Thao Túng Phường Thị, Tab Tu Luyện Cửu Giai, Công Pháp Bí Tịch Cửu Giai, Thần Thông Bí Thuật Cửu Giai, Dược Thảo Linh Dược Cửu Giai, Trang Bị Thần Binh Cửu Giai, Đạo Lữ Khế Ước Cửu Giai, Linh Thú Thần Sủng Cửu Giai, Pháp Bảo Trữ Vật Cửu Giai | [📜 `PHASE_4_COSMIC_AND_COMMERCE.md`](./docs/changelogs/PHASE_4_COSMIC_AND_COMMERCE.md) |

---

## 🚀 GIAI ĐOẠN HIỆN TẠI (ACTIVE DEVELOPING)

### [2026-10-03 19:55] - Triển Khai Toàn Diện Phân Hệ "Phân Cấp Phẩm Vị Đạo Cơ & Dị Tượng Thiên Địa (Dao Foundation Grades & Major Realm Transcendence)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, việc đột phá giữa các Đại Cảnh Giới (Luyện Khí ➔ Trúc Cơ, Trúc Cơ ➔ Kim Đan, Kim Đan ➔ Nguyên Anh) chỉ đơn thuần là thăng cấp chỉ số cố định, thiếu chiều sâu phân cấp phẩm vị Đạo Cơ (Hạ Phẩm, Địa Phẩm, Thiên Đạo) vốn là linh hồn trong các tác phẩm Tiên Hiệp cổ điển.
  - Phân hệ mới tái định nghĩa hoàn toàn trải nghiệm chuyển giao Đại Cảnh Giới:
    1. **Tam Phẩm Đạo Cơ (Hạ Phẩm • Địa Phẩm • Thiên Đạo):**
       * **Hạ Phẩm Đạo Cơ (Phàm Phẩm):** Vượt ải dễ dàng, chỉ số cơ bản x1.0, không đòi hỏi bảo vật quý hiếm hay giới hạn đan độc.
       * **Địa Phẩm Đạo Cơ (Địa Mạch Linh Cơ):** Tăng trưởng +30% chỉ số phá cảnh, yêu cầu Đan Dược Trung Phẩm tương ứng, Đan Độc $\le 30\%$, Chân Nguyên $\ge 80\%$.
       * **Thiên Đạo Đạo Cơ (Cực Phẩm Viên Mãn):** Tăng trưởng cực đại +60% ~ +80% chỉ số, điều kiện khắc nghiệt: Đan Độc $= 0\%$, Chân Nguyên $= 100\%$, Đan Dược bảo chứng bắt buộc phải đạt đủ 9 Đan Văn.
    2. **Dị Tượng Thiên Địa & Thiên Phú Ẩn Vĩnh Viễn:**
       * Đúc thành Thiên Đạo Đạo Cơ dẫn động Dị Tượng Thiên Địa chấn động cửu thiên thập địa (*Tử Khí Đông Lai Tam Vạn Dặm*, *Hỗn Độn Khai Thiên • Vạn Tiên Triều Bái*).
       * Mở khóa các Thiên Phú Ẩn vĩnh cửu độc bản: *Thiên Đạo Đạo Thể* (+10% Kháng tất cả, +15% Max HP), *Cửu Chuyển Thần Kim* (+15% Kháng, +20% HP, +15% Sát thương Bạo kích), *Hỗn Độn Thần Thể* (+20% Kháng, +30% HP, +20% Bạo kích).
       * Tích hợp vào Combat Engine (`lib/destiny-data.ts`) tự động cộng hưởng trong mọi trận quyết đấu.
    3. **Giao Diện Tiên Hiệp Cổ Phong:**
       * `MajorBreakthroughModal.tsx`: Grid 3 thẻ bài Tam Phẩm Đạo Cơ, live condition checklist, radio indicator cổ phong, bảng dự toán tiêu hao tài nguyên.
       * `HeavenPhenomenonModal.tsx`: Màn hình vinh danh phủ tử khí, hoa sen vàng mọc lên từ hư không, tiếng chuông đại đạo cửu tiếng ngân vang, văn bia thiên đạo giáng chỉ.
       * Cổng mở thông minh tại `MiddleColumn.tsx` và `BreakthroughCatalystAltar.tsx`: Tự động nhận diện đỉnh phong đại cảnh giới và chuyển đổi nút đột phá thành `[🌌 VƯỢT ĐẠI KIẾP • NGƯNG TỤ ĐẠO CƠ]` với viền vàng tím huyền ảo.
- **Chi tiết kỹ thuật & Kiến trúc lõi (Architecture & Invariants):**
  - **Domain Types & Pure Business Logic (`lib/types/dao-foundation.ts`, `lib/dao-foundation-logic.ts`):**
    - `DaoFoundationGrade`, `DaoFoundationConfig`, `MajorRealmTransitionConfig`, `InnateTalentDefinition`, `FoundationValidationResult`.
    - `MAJOR_TRANSITIONS_REGISTRY`: Đăng ký chuẩn xác 3 mốc đại cảnh giới chuyển giao (Luyện Khí ➔ Trúc Cơ, Trúc Cơ ➔ Kim Đan, Kim Đan ➔ Nguyên Anh).
    - `checkIsMajorRealmTransition`: Hàm pure nhận diện mốc chuyển giao đại cảnh giới (bỏ qua các tiểu tầng).
    - `canAttemptFoundationGrade`: Thẩm định nghiêm ngặt đan dược, 9 đan văn, đan độc zero-guard (`toxicity === 0`), độ tinh khiết chân nguyên (`purity >= 100`).
    - `calculateFoundationStatBonuses`: Áp dụng hệ số nhân thưởng `statMultiplier` lên phần thưởng đột phá.
  - **Save Migration & Combat Integration (`lib/save-migration.ts`, `lib/destiny-data.ts`, `lib/game-logic/cultivation.ts`):**
    - `migrateDaoFoundationData`: Khởi tạo an toàn `player.daoFoundations` và `player.unlockedInnateTalents`, tự động truy phong Đạo Cơ Địa Phẩm cho nhân vật cũ đã vượt qua các đại cảnh giới trước đó. Bảo đảm tính lũy đẳng 100%.
    - `calculateCombatStats`: Tích hợp các dòng chỉ số của Thiên Phú Ẩn (`allResistPercent`, `critDamageMultiplier`, `maxHpPercent`, `qiRegenBonusPercent`) vào engine chiến đấu.
  - **Custom Hook State Management (`hooks/useDaoFoundationActions.ts`):**
    - Derived State: `activeTransition`, `isMajorTransition`, `validationMap`, `currentGradeConfig`.
    - Actions: `handleSelectGrade`, `openTranscendenceModal`, `closeTranscendenceModal`, `closeCinematic`, `handleExecuteMajorBreakthrough`.
    - Helper `deductPillForFoundation`: Khấu trừ đan dược bất biến, thẩm định nghiêm ngặt đan 9 văn.
    - Cập nhật nguyên tử: Khấu trừ tu vi, linh thạch, nâng cảnh giới, hồi phục 100% HP/MP trong 1 lần `setPlayer` duy nhất.
  - **Giao Diện Tiên Hiệp Cổ Phong (`components/modals/MajorBreakthroughModal.tsx`, `components/modals/HeavenPhenomenonModal.tsx`, `components/dashboard/MiddleColumn.tsx`, `components/breakthrough/BreakthroughCatalystAltar.tsx`):**
    - Thiết kế chuẩn Tiên Hiệp Cổ Phong với màu sắc ánh ngọc, đồng thiếc, hoàng kim khói tím, hoa sen vàng lơ lửng, chuông đại đạo ngân vang.
    - Tương thích 100% Mobile & Desktop, tuân thủ nghiêm ngặt Next.js Turbopack và React 19.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/dao-foundation.ts` *(Tạo mới)*
  - `lib/types/player.ts` *(Cập nhật nhẹ)*
  - `lib/dao-foundation-logic.ts` *(Tạo mới)*
  - `lib/save-migration.ts` *(Cập nhật hàm migrate)*
  - `lib/destiny-data.ts` *(Cập nhật combat sync)*
  - `lib/game-logic/cultivation.ts` *(Cập nhật breakthrough routing)*
  - `hooks/useDaoFoundationActions.ts` *(Tạo mới)*
  - `hooks/index.ts` *(Cập nhật barrel export)*
  - `components/modals/MajorBreakthroughModal.tsx` *(Tạo mới)*
  - `components/modals/HeavenPhenomenonModal.tsx` *(Tạo mới)*
  - `components/modals/index.ts` *(Cập nhật barrel export)*
  - `components/breakthrough/BreakthroughCatalystAltar.tsx` *(Cập nhật nút chuyển giao)*
  - `components/dashboard/MiddleColumn.tsx` *(Cập nhật banner & kết nối modal)*
  - `scripts/test-dao-foundation.ts` *(Tạo mới - 9/9 test cases)*
- **Kết quả kiểm thử & Nghiệm thu (Verification & Results):**
  - `npx tsc --noEmit`: **0 Errors (Strict Mode Pass 100%)**.
  - `npx tsx scripts/test-dao-foundation.ts`: **9 / 9 Tests PASSED**.
  - `npx tsx scripts/test-breakthrough-backlash.ts`: **8 / 8 Tests PASSED**.
  - `npx tsx scripts/test-breakthrough-catalysts.ts`: **7 / 7 Tests PASSED**.
  - `npx tsx scripts/test-pill-veins.ts`: **6 / 6 Tests PASSED**.
  - `npx tsx scripts/test-multiplicative-toxicity.ts`: **8 / 8 Tests PASSED**.
  - `npm run build`: **Next.js 16.3.5 Turbopack Build SUCCESSFUL (100% Pages Generated)**.

### [2026-10-03 19:10] - Triển Khai Toàn Diện Phân Hệ "Tác Động Của Đan Độc & Tâm Ma Phản Phệ (Inner Demon & Pill Toxicity Backlash System)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, chỉ số Đan Độc (`pillToxicity`) chỉ đơn thuần là con số đo lường hiển thị, chưa tạo ra hệ quả sinh tử tương xứng với cốt truyện tu tiên (lạm dụng đan dược gây tích tụ tạp chất, kinh mạch tắc nghẽn, dẫn phát Tâm Ma và Tẩu Hỏa Nhập Ma khi trùng kích bình cảnh).
  - Phân hệ **"Tác Động Của Đan Độc & Tâm Ma Phản Phệ"** thiết lập quy tắc rủi ro - phần thưởng (Risk-Reward Dynamics) chân thực và khốc liệt:
    1. **Tứ Đại Trạng Thái Căn Cơ:**
       * `tinh_khiet` (< 10% độc): Căn Cơ Băng Thanh, nhận thưởng **+10% Tỉ Lệ Đột Phá**.
       * `binh_thuong` (10 - 40% độc): Dược Tính Hài Hòa, tỉ lệ đột phá ổn định.
       * `tac_nghen` (41 - 70% độc): Kinh Mạch Tắc Nghẽn, phạt **-20% Tỉ Lệ Đột Phá**. Đột phá thất bại dẫn đến **Trọng Thương** (mất 50% Khí Huyết, 35% Tu Vi, giảm 30% thuộc tính thực chiến ATK/DEF và bị khóa đột phá).
       * `tam_ma_nguy_hiem` (> 70% độc): Tâm Ma Rình Rập, phạt **-40% Tỉ Lệ Đột Phá**. Đột phá thất bại dẫn đến **Tẩu Hỏa Nhập Ma**, giáng sinh **Bình Cảnh Tâm Ma** (giảm 50% cơ hội đột phá ở tất cả các lần sau).
    2. **Cơ Chế Chữa Lành & Tiêu Trừ (Healing & Dispelling Actions):**
       * Phục dụng Đại Hoàn Đan / Tục Mệnh Hoàn để chữa lành thương thế, hồi phục 50% Khí Huyết và mở khóa đột phá.
       * Kích hoạt Thanh Tâm Phù / Định Thần Đan để tiêu trừ Bình Cảnh Tâm Ma, khôi phục đạo tâm thuần tịnh.
       * Hỗ trợ chuyển nhanh sang Tuế Nguyệt Bế Quan / Tam Hóa Chi Cảnh để tĩnh tâm dưỡng thương.
    3. **Giao Diện Tiên Hiệp Cổ Phong Toàn Diện:**
       * Dòng đo Đan Độc & Trạng Thái Căn Cơ động ngay trên nút Đột Phá với 4 phong cách huy hiệu ngọc khiết, xám lam, cảnh báo cam, đỏ rực nhấp nháy.
       * Banner Khẩn Cấp Trọng Thương màu máu và Banner Tâm Ma Chướng huyền bí tím thẫm với các nút hành động nhanh dạng pill.
       * Nút Đột Phá Chính hiển thị công thức phân rã toán học chi tiết: `Tỉ lệ: Cơ bản (90%) + Đan độc (-20%) = 70%`.
- **Chi tiết kỹ thuật & Kiến trúc lõi (Architecture & Invariants):**
  - **Domain Types & Pure Business Logic (`lib/types/breakthrough-backlash.ts`, `lib/breakthrough-backlash-logic.ts`):**
    - `PlayerInjuryState`, `ToxicityModifierResult`, `BacklashResolutionResult`, `BacklashType`, `ToxicityStatusTag`.
    - `evaluateToxicityBreakthroughModifier`: Xác định rateModifier (+0.10, 0, -0.20, -0.40) và statusTag tương ứng.
    - `calculateFinalBreakthroughRate`: Kết hợp baseRate, catalystBonus, toxicityMod và hình phạt Tâm Ma (50%), clamping an toàn `[0.05, 1.0]`.
    - `resolveBreakthroughFailureBacklash`: Phân tầng hậu quả phản phệ với HP Floor Guard (`resultingHp >= 1`), không bao giờ trừ HP về <= 0.
    - `healPlayerInjury`, `dispelDemonicBottleneck`, `recordBacklashToInjuryState`: Các pure functions biến đổi bất biến, lưu tối đa 30 bản ghi lịch sử phản phệ.
  - **Save Migration & Combat Integration (`lib/save-migration.ts`, `lib/destiny-data.ts`, `lib/game-logic/cultivation.ts`):**
    - `migrateBreakthroughBacklashData`: Khởi tạo an toàn cấu trúc `player.injuryState`, bảo đảm tính lũy đẳng (Idempotent 100%) tích hợp vào `normalizePlayerData`.
    - `calculateCombatStats`: Đồng bộ debuff giảm 30% Công Kích và Phòng Ngự khi `player.injuryState?.isInjured === true`.
    - `attemptBreakthrough` & `canBreakthrough`: Bổ sung cổng tiền điều kiện chặn đột phá khi đang trọng thương, tự động kích hoạt phản phệ đan độc khi thất bại.
  - **Custom Hook State Management (`hooks/useBreakthroughBacklashActions.ts`, `hooks/useBreakthroughCatalystActions.ts`):**
    - Derived State: `toxicityModifier`, `isInjured`, `hasBottleneck`, `canBreakthrough`, `healingPillsInInventory`, `dispelTalismansInInventory`.
    - Actions: `handleHealWithPill`, `handleDispelBottleneck`, `deductItemFromInventory` (khấu trừ bất biến, deep copy).
    - Tích hợp `injuryState` guard và `resolveBreakthroughFailureBacklash` vào `useBreakthroughCatalystActions`.
  - **Giao Diện Tiên Hiệp Cổ Phong (`components/breakthrough/BreakthroughCatalystAltar.tsx`, `components/dashboard/MiddleColumn.tsx`):**
    - Nhúng đầy đủ 4 trạng thái huy hiệu Đan Độc, Banner Khẩn Cấp Trọng Thương, Banner Tâm Ma Chướng, và công thức breakdown trực tiếp trên nút Đột Phá.
    - Liên kết props `openEnhancedSeclusionModal` và `onSwitchToDeepCultivation` mượt mà với `MiddleColumn.tsx`.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/breakthrough-backlash.ts` *(Tạo mới)*
  - `lib/breakthrough-backlash-logic.ts` *(Tạo mới)*
  - `hooks/useBreakthroughBacklashActions.ts` *(Tạo mới)*
  - `scripts/test-breakthrough-backlash.ts` *(Tạo mới)*
  - `lib/types/player.ts` *(Sửa đổi)*: Bổ sung trường `injuryState?: PlayerInjuryState`.
  - `lib/types/index.ts` *(Sửa đổi)*: Re-export `./breakthrough-backlash`.
  - `lib/save-migration.ts` *(Sửa đổi)*: Tích hợp `migrateBreakthroughBacklashData`.
  - `lib/destiny-data.ts` *(Sửa đổi)*: Debuff -30% ATK & DEF khi trọng thương trong `calculateCombatStats`.
  - `lib/game-logic/cultivation.ts` *(Sửa đổi)*: Thêm injury gate và backlash resolution vào `attemptBreakthrough`.
  - `hooks/useBreakthroughCatalystActions.ts` *(Sửa đổi)*: Thêm injury guard và giải quyết backlash khi thất bại.
  - `components/breakthrough/BreakthroughCatalystAltar.tsx` *(Sửa đổi)*: Tích hợp 4 UI components cổ phong.
  - `components/dashboard/MiddleColumn.tsx` *(Sửa đổi)*: Kết nối modal bế quan và switch tab vào Altar.
  - `CHANGELOG.md` *(Sửa đổi)*: Cập nhật nhật ký phát triển hệ thống.
- **Quy trình nghiệm thu kỹ thuật (Acceptance Verification):**
  - `test-breakthrough-backlash.ts`: 8/8 Passed (100%).
  - `test-breakthrough-catalysts.ts`: 7/7 Passed (100%).
  - `test-pill-veins.ts`: 6/6 Passed (100%).
  - `test-multiplicative-toxicity.ts`: 8/8 Passed (100%).
  - `npx tsc --noEmit`: 0 Errors (TypeScript Strict Mode).
  - `npm run build` (Turbopack): 100% Compiled & Generated static/dynamic routes in 13.2s.

### [2026-10-03 17:35] - Triển Khai Toàn Diện Phân Hệ "Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch (Breakthrough Catalysts & Protective Talismans)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Giao diện và cơ chế đột phá cảnh giới trước đây còn đơn điệu, xuất hiện khoảng trống đen vô nghĩa ở Panel 2 (Trung Cột), thiếu tính tương tác chiến lược khi tu sĩ muốn sử dụng đan dược hộ mạch hoặc trận bàn giảm trừ chi phí.
  - Phân hệ **"Khảm Nạp Đan Dược Phá Cảnh & Trận Bàn Hộ Mạch"** nâng cấp toàn diện trải nghiệm đột phá:
    1. **Bàn Khảm Nạp 2 Ô Hộ Mệnh (Breakthrough Catalysts):** Ô Đan Dược (+10% -> +40% tỷ lệ) và Ô Trận Bàn/Phù Chú (Tụ Linh Trận Bàn giảm 40% Linh Thạch, Hộ Mạch Phù chặn 100% phản phệ, Định Tâm Phù triệt tiêu đan độc).
    2. **Đặc Quyền Đan Cửu Văn (Nine-Vein Absolute Guarantee):** Đan 9 văn đạt 100% tỷ lệ thành công tuyệt đối (`finalRate = 1.0`), miễn nhiễm 100% phản phệ và phạt đan độc. Đan 6-8 văn nhận thêm +15% tỷ lệ và giảm 50% phản phệ.
    3. **Bảng Dự Toán Thiên Cơ (Live Success Breakdown HUD):** Trực quan hóa công thức tính toán: `Cơ bản ➔ Đan Dược ➔ Đan Độc ➔ TỔNG`, cảnh báo an toàn phản phệ thời gian thực.
    4. **Nút Bấm Đột Phá Hào Quang:** Chuyển sang hoàng kim viên mãn khi đạt 100% xác suất thành công.
- **Chi tiết kỹ thuật & Kiến trúc lõi (Architecture & Invariants):**
  - **Domain Types & Pure Business Logic (`lib/types/breakthrough-catalyst.ts`, `lib/breakthrough-catalyst-logic.ts`):**
    - `BREAKTHROUGH_CATALYSTS_REGISTRY`, `BREAKTHROUGH_PILLS_CONFIG`, `BREAKTHROUGH_TALISMANS_CONFIG`.
    - `calculateBreakthroughChances`: Pure preview calculation (không RNG), xử lý đặc quyền 9 văn, đan 6-8 văn, phạt đan độc, chiết khấu linh thạch, clamping `0.05` -> `1.0`.
    - `resolveBreakthroughBacklash`: Bảo vệ (0 HP, 0 Tu Vi) vs Thất bại không bảo vệ (mất 35% HP, 20% Tu Vi).
    - `executeBreakthroughWithCatalysts`: Pure simulation có tham số `roll` deterministic phục vụ unit test.
  - **Save Migration & Đăng Ký Vật Phẩm (`lib/save-migration.ts`, `lib/items-data.ts`, `lib/types/player.ts`):**
    - `migrateBreakthroughCatalystData`: Khởi tạo an toàn `player.breakthroughCatalystState = { totalCatalystBreakthroughs: 0, protectedFailuresCount: 0 }`, bảo đảm tính Idempotent 100%.
    - `lib/items-data.ts`: Đăng ký `item_tu_linh_tran_ban`, `item_ho_mach_phu`, `item_dinh_tam_phu` cùng các đan phá cảnh tiêu chuẩn.
  - **Custom Hook State Management (`hooks/useBreakthroughCatalystActions.ts`):**
    - State: `selectedPillInstanceId`, `selectedTalismanItemId`, `isExecuting`, `executionResult`, `activeDrawerSlot`.
    - Derived State: `availablePills` (ưu tiên đan 9 văn), `availableTalismans`, `rateCalculation`.
    - Actions: `handleSelectPill`, `handleSelectTalisman`, `handleOpenDrawer`, `handleCloseDrawer`, `handleExecuteBreakthrough` (Atomic Validation, khấu trừ 1 đan + 1 phù, full hồi phục HP/MP khi thành công, Single Atomic `setPlayer`).
  - **Giao Diện Tiên Hiệp Cổ Phong (Tailwind CSS, React 19):**
    - `BreakthroughCatalystAltar.tsx`: Bàn khảm 2 ô ngang, HUD dự toán thiên cơ, cảnh báo phản phệ, nút bấm hoàng kim.
    - `CatalystItemDrawer.tsx`: Drawer trượt chọn đan/phù hiển thị số lượng, phẩm bậc, đan văn.
    - `BreakthroughResultModal.tsx`: Modal chúc mừng đại thành công hoặc thông báo bảo vệ hộ mạch.
    - Nhúng vào `MiddleColumn.tsx` Panel 2, xóa bỏ khoảng trống đen đơn điệu.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/breakthrough-catalyst.ts` *(Tạo mới)*
  - `lib/breakthrough-catalyst-logic.ts` *(Tạo mới)*
  - `lib/items-data.ts` *(Tạo mới)*
  - `lib/types/player.ts` *(Sửa đổi)*: Bổ sung `breakthroughCatalystState`.
  - `lib/types/index.ts` *(Sửa đổi)*: Re-export `./breakthrough-catalyst`.
  - `lib/save-migration.ts` *(Sửa đổi)*: Bổ sung `migrateBreakthroughCatalystData` và tích hợp `normalizePlayerData`.
  - `hooks/useBreakthroughCatalystActions.ts` *(Tạo mới)*
  - `components/breakthrough/BreakthroughCatalystAltar.tsx` *(Tạo mới)*
  - `components/breakthrough/CatalystItemDrawer.tsx` *(Tạo mới)*
  - `components/breakthrough/BreakthroughResultModal.tsx` *(Tạo mới)*
  - `components/dashboard/MiddleColumn.tsx` *(Sửa đổi)*: Nhúng `BreakthroughCatalystAltar` vào Panel 2.
  - `components/GameDashboard.tsx` *(Sửa đổi)*: Truyền `setPlayer` vào `MiddleColumn`.
  - `scripts/test-breakthrough-catalysts.ts` *(Tạo mới)*: 7/7 test cases bắt buộc.
  - `scripts/test-breakthrough-catalyst.ts` *(Tạo mới)*: 35/35 assertions kiểm thử registry & formula.
- **Quy trình nghiệm thu kỹ thuật (Acceptance Verification):**
  - `test-breakthrough-catalysts.ts`: 7/7 Passed.
  - `test-pill-veins.ts`: 6/6 Passed.
  - `test-multiplicative-toxicity.ts`: 8/8 Passed.
  - `test-breakthrough-catalyst.ts`: 35/35 Passed.
  - `test-weapon-tribulation-array.ts`: 66/66 Passed.
  - `npx tsc --noEmit`: 0 Errors (TypeScript Strict Mode).
  - `npm run build` (Turbopack): 100% Compiled & Generated static/dynamic routes in 37.5s.

### [2026-10-03 17:00] - Triển Khai Toàn Diện Phân Hệ "Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân (Weapon Tribulation & Orbiting Array Sets)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Sau khi thần binh được tôi luyện hợp kim, minh khắc trận văn, phong hồn khí linh và trùng chú đạt đến đỉnh phong (Cửu Giai hoặc Khí Linh Hóa Hình), thần binh cần một bước nhảy vọt về linh tính để phá vỡ gông cùm quy tắc thiên địa.
  - Phân hệ **"Khí Lôi Kiếp & Đúc Bộ Trận Khí Tùy Thân"** hoàn thiện mảnh ghép tối thượng của hệ thống Luyện Khí:
    1. **Khí Lôi Kiếp (Weapon Lightning Tribulation):** Dẫn động 3 đợt lôi kiếp (Thanh Lôi Tẩy Kiếm, Tử Điện Đoán Cốt, Cửu Tiêu Lôi Kiếp). Mỗi đợt giáng xuống tiêu hao linh lực hộ thể và thử thách độ bền linh tính thần binh. Hoàn thành đại viên mãn vĩnh viễn khắc họa tiền tố chí tôn **【Cửu Tiêu Lôi Kiếp】** (+35% Lôi Sát xuyên 30% giáp, 20% xác suất gây hiệu ứng 【Thiên Lôi Tê Liệt】 làm đối thủ mất lượt).
    2. **Đúc Bộ Trận Khí Tùy Thân (Orbiting Array Sets):** Rèn đúc 3 bộ trận khí tùy thân thượng cổ bay lượn tuần hoàn quanh thân tu sĩ (Chu Thiên Tinh Đẩu Kiếm Trận - 36 thanh, Ngũ Hành Linh Châu Trận - 5 viên, Bát Quái Hỗn Nguyên Kỳ - 8 lá). Kích hoạt hiệu ứng theo các mốc số mảnh (Threshold Bonuses) và tuyệt kỹ đại trận (Swarm Damage mỗi lượt, Tuyệt Kỹ mỗi 3 lượt).
    3. **Độc Lập & Bất Biến (Array Slot Independence):** Cơ chế trang bị độc lập `equippedArraySetId`, tuyệt đối không ghi đè hay thay thế ô vũ khí chính `equipment.weapon`.
- **Chi tiết kỹ thuật & Kiến trúc lõi (Architecture & Invariants):**
  - **Pure Logic Engine (`lib/weapon-tribulation-array-logic.ts`):**
    - `FORMATION_SETS_REGISTRY`: Đăng ký 3 bộ Chu Thiên Kiếm, Ngũ Hành Châu, Bát Quái Kỳ với chi phí khoáng thạch, Linh Thạch và các mốc hiệu ứng.
    - `evaluateWeaponTribulationTrigger`: Rào chắn kiểm tra Tier 9 hoặc Khí Linh Stage 3, chặn kích hoạt lặp `isTempered: true`.
    - `resolveWeaponLightningTemper`: Tính toán xác suất ngạnh kháng lôi kiếp dựa trên uy lực sét, bậc thần binh và khiên linh lực.
    - `finalizeLightningTempering`: Deep copy vũ khí, gắn tiền tố 【Cửu Tiêu Lôi Kiếp】, thiết lập `lightningTempering` (+35% Lôi Sát, 20% Tê Liệt), bảo toàn 100% hợp kim, trận văn, khí linh.
    - `calculateCraftPieceProgress`: Đúc mảnh với Cap Guard nghiêm ngặt, tự động tính toán các mốc mới mở khóa.
    - `equipFormationSet`: Gán hoặc tháo `equippedArraySetId`, bảo toàn nguyên vẹn `equipment.weapon`.
  - **Combat Loop Engine (`lib/game-logic/combat.ts`):**
    - `executeWeaponTribulationArrayCombatTurn`: Tích hợp Swarm Damage (kiếm khí/ngũ hành kích phát đầu mỗi lượt), Tuyệt Kỹ đại trận mỗi 3 lượt (e.g. Chu Thiên Vạn Kiếm Trận gây 250% ATK), Lôi Sát xuyên giáp và hiệu ứng 【Thiên Lôi Tê Liệt】 (gián đoạn xuất chiêu, đối thủ mất lượt) vào vòng lặp `battleBoss`.
  - **Save Migration & Passive Stats (`lib/save-migration.ts`, `lib/destiny-data.ts`):**
    - `migrateWeaponTribulationArrayData`: Khởi tạo an toàn `player.formationSetsState`, quét trang bị gán `lightningTempering: null`.
    - `calculateCombatStats`: Tích hợp `damageReductionPercent` bị động từ bộ trận khí đang xuất trận.
  - **Custom Hook State Management (`hooks/useWeaponTribulationArrayActions.ts`):**
    - State: `selectedWeaponForTribulationId`, `activeTribulationEncounter`, `selectedFormationSetId`, `isProcessing`, `actionFeedback`.
    - Actions: `handleStartTribulation`, `handleAbsorbStrike`, `handleCraftSetPieces` (Atomic Validation & single `setPlayer`), `handleToggleEquipArraySet`.
  - **Giao Diện Cổ Phong Tiên Hiệp (Tailwind CSS, React 19):**
    - `TribulationLightningAltar.tsx`: Đài lôi kiếp huyền phù thần binh, vòng xoáy mây lôi kiếp SVG tím thẫm, tia sét đánh xuống nhịp giật (`animate-pulse`), 3 đèn chỉ báo đợt sét.
    - `OrbitingArrayCanvas.tsx`: Đồ hình tu sĩ tọa thiền tĩnh tại, quỹ đạo elip Bát Quái xoay tròn tuần hoàn (`animate-spin-slow`) với 36 kiếm / 5 châu / 8 kỳ, huy hiệu trạng thái `[🛡️ ĐANG XUẤT CHIẾN TÙY THÂN]`.
    - `FormationSetPieceCrafter.tsx`: Bảng đúc 3 bộ trận khí, thanh tiến độ, thẻ mốc linh uy, nút đúc +1 và +6 mảnh, nút kích hoạt tùy thân.
    - `HeavenTemperedRelicModal.tsx`: Modal thần binh thăng hoa hào quang sét bạc & tử điện, chúc mừng đại viên mãn lôi kiếp.
    - `WeaponTribulationArraySection.tsx`: Màn hình điều phối chính tích hợp vào `ForgingTab.tsx` qua Sub-tab **[⚡ Khí Kiếp & Trận Khí]**.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/weapon-tribulation-array.ts` *(Tạo mới)*: Union type `FormationSetCategory`, interfaces `WeaponTribulationStrike`, `LightningTemperedMetadata`, `FormationSetConfig`, `PlayerFormationSetProgress`, `FormationSetsState`.
  - `lib/types/items.ts` *(Sửa đổi)*: Bổ sung `lightningTempering?: LightningTemperedMetadata | null` vào `Equipment`.
  - `lib/types/player.ts` *(Sửa đổi)*: Bổ sung `formationSetsState?: FormationSetsState` vào `PlayerStats`.
  - `lib/types/index.ts` *(Sửa đổi)*: Re-export `./weapon-tribulation-array`.
  - `lib/weapon-tribulation-array-logic.ts` *(Tạo mới)*: Pure Logic Engine cho Lôi Kiếp & Đúc Bộ Trận Khí.
  - `lib/save-migration.ts` *(Sửa đổi)*: Bổ sung `migrateWeaponTribulationArrayData` và tích hợp vào `normalizePlayerData`.
  - `lib/destiny-data.ts` *(Sửa đổi)*: Tích hợp chỉ số miễn thương bị động của Trận Khí vào `calculateCombatStats`.
  - `lib/game-logic/combat.ts` *(Sửa đổi)*: Tích hợp Swarm Damage, Tuyệt Kỹ đại trận, Lôi Sát và Tê Liệt vào `battleBoss`.
  - `hooks/useWeaponTribulationArrayActions.ts` *(Tạo mới)*: Custom Hook điều phối State & Actions.
  - `hooks/useCraftingActions.ts` *(Sửa đổi)*: Mở rộng `forgingSubTab` thêm `'tribulation_array'`.
  - `hooks/index.ts` *(Sửa đổi)*: Xuất khẩu `useWeaponTribulationArrayActions`.
  - `components/forging/TribulationLightningAltar.tsx` *(Tạo mới)*: Đài lôi kiếp sấm sét tím & thần binh lơ lửng.
  - `components/forging/OrbitingArrayCanvas.tsx` *(Tạo mới)*: SVG tu sĩ tọa thiền và quỹ đạo Bát Quái xoay tròn.
  - `components/forging/FormationSetPieceCrafter.tsx` *(Tạo mới)*: Bảng đúc mảnh và mở khóa mốc đại trận.
  - `components/forging/HeavenTemperedRelicModal.tsx` *(Tạo mới)*: Modal điện ảnh thần binh thăng hoa sét bạc.
  - `components/forging/WeaponTribulationArraySection.tsx` *(Tạo mới)*: Màn hình chính phân hệ Khí Kiếp & Trận Khí.
  - `components/tabs/ForgingTab.tsx` *(Sửa đổi)*: Nhúng Sub-tab "Khí Kiếp & Trận Khí" vào thanh điều hướng Luyện Khí.
  - `scripts/test-weapon-tribulation-array.ts` *(Tạo mới)*: Bộ 66 bài kiểm thử tự động Engine, Migration và Combat (66/66 PASS).
  - `scripts/test-weapon-tribulation-array-hook.ts` *(Tạo mới)*: Bộ 6 bài kiểm thử nghiệp vụ Hook & Invariants (6/6 PASS).
  - `scripts/test-weapon-tribulation-ui-integration.ts` *(Tạo mới)*: Bộ 3 bài kiểm thử hợp đồng Component và UI Integration (3/3 PASS).
- **Kết quả nghiệm thu kỹ thuật (Technical Acceptance Results):**
  - `scripts/test-weapon-tribulation-array.ts`: 66/66 checks PASS (100%)
  - `scripts/test-weapon-tribulation-array-hook.ts`: 6/6 tests PASS (100%)
  - `scripts/test-weapon-tribulation-ui-integration.ts`: 3/3 tests PASS (100%)
  - `scripts/test-legacy-tempering.ts`: 80/80 tests PASS (100%)
  - `scripts/test-soul-infusion.ts`: 10/10 tests PASS (100%)
  - `scripts/test-formation-inscription.ts`: 8/8 tests PASS (100%)
  - `scripts/test-modular-metallurgy.ts`: 8/8 tests PASS (100%)
  - `scripts/test-forging-essence.ts`: 6/6 tests PASS (100%)
  - `scripts/test-array-reforging.ts`: 6/6 tests PASS (100%)
  - `scripts/test-crafting-supply.ts`: 8/8 tests PASS (100%)
  - TypeScript Compilation (`npx tsc --noEmit`): 0 errors
  - Next.js Turbopack Production Build (`next build`): Thành công 100%, 8/8 routes hợp lệ.

### [2026-10-03 16:30] - Triển Khai Toàn Diện Phân Hệ "Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh (Legacy Tempering & Blood-Bonding)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trong quá trình tu chân trường kỳ, khi người chơi đột phá đại cảnh giới, các thần binh cũ dù đã dồn nhiều tâm huyết đúc hợp kim, khắc trận văn và phong hồn sẽ dần bị tụt hậu về chỉ số cơ bản, gây ra nghịch lý "bỏ thì thương, vương thì tội".
  - Phân hệ **"Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh"** giải quyết triệt để vấn đề này:
    1. **Trùng Chú Tái Sinh (Legacy Reforging):** Cho phép nâng cấp bậc cảnh giới của thần binh từ Nhất Giai (Phàm Khí) lên đến Cửu Giai (Thái Sơ Thần Binh), scale toàn bộ thuộc tính cơ bản (ATK/DEF/HP) theo hệ số chuẩn hóa từ x1.0 đến x90.0 tương thích với cảnh giới tu vi. Cam kết bảo tồn 100% Hợp Kim Ngũ Hành (`alloyMetadata`), Mạch Dẫn Linh & Trận Đồ (`inscriptionData`) và Chân Hồn Khí Linh (`infusedSoul`).
    2. **Huyết Khế Bản Mệnh (Blood-Bonding Ritual):** Nghi thức hiến tế chân huyết tâm mạch, vĩnh viễn khóa thần binh vào kinh mạch và thức hải tu sĩ. Tiêu hao 5 năm thọ nguyên để đổi lấy hiệu ứng tối thượng: **+30% Toàn Bộ Lực Chiến Thần Binh** và **Miễn Nhiễm Hoàn Toàn Hiệu Ứng Tước Khí (Disarm Immunity)**.
- **Chi tiết kỹ thuật & Kiến trúc lõi (Architecture & Invariants):**
  - **Scale Matrix 9 Bậc (`TIER_STAT_SCALE_CONFIG`):** Ánh xạ chuẩn từ Tier 1 (Luyện Khí, x1.0, Huyền Thiết) đến Tier 9 (Độ Kiếp/Tiên Giới, x90.0, Thiên Đạo Thần Thạch, 250M Linh Thạch).
  - **Pure Business Logic Engine (`lib/legacy-tempering-logic.ts`):**
    - `resolveEquipmentTier`: Trích xuất chuẩn xác Tier từ phẩm cấp, affixes và metadata.
    - `calculateReforgeStatsScale`: Tính toán dự phóng chỉ số trước và sau khi nâng bậc, trích xuất thành tố bảo tồn và tài nguyên yêu cầu.
    - `applyEquipmentReforge`: Thực hiện nâng bậc bằng Deep Copy bất biến, tăng `reforgeCount`, bảo tồn nguyên vẹn 100% hợp kim, trận văn, khí linh.
    - `validateBloodBondEligibility`: Rào chắn an toàn kép: Thọ nguyên còn lại $> 15$ năm (Lifespan Guard) và Chặn ký đè lần 2 (Anti-Rebond Guard).
    - `applyBloodBond`: Gán metadata `BloodBondMetadata`, thiết lập `combatPowerMultiplier = 1.30`, `disarmImmunity = true`, lưu vết thọ nguyên hiến tế.
  - **Save Migration Pipeline (`lib/save-migration.ts`):**
    - Hàm `migrateLegacyTemperingData`: Khởi tạo an toàn cấu trúc `legacyTemperingState = { totalReforgesPerformed: 0, bloodBoundEquipmentIds: [] }`. Quét qua toàn bộ kho đồ và trang bị đang mặc, gán an toàn `bloodBondData = null`, `reforgeCount = 0` nếu chưa có. Đạt tính lũy đẳng (Idempotence) 100%.
  - **Tích hợp Combat & Calculation Engine:**
    - `lib/destiny-data.ts`: Tích hợp hệ số `combatPowerMultiplier` của vũ khí Huyết Khế (+30% lực chiến) vào hàm tính toán tổng thể `calculateCombatStats`.
    - `lib/game-logic/combat.ts`: Bổ sung cơ chế phát hiện kỹ năng tước đoạt vũ khí (`seal_equipment` / `disarm`) từ Boss và kích hoạt đòn phản kháng "Kháng Tước Khí" của thần binh Huyết Khế.
  - **Custom Hook Điều Phối State (`hooks/useLegacyTemperingActions.ts`):**
    - Quản lý `selectedEquipmentId`, `targetTierSelection`, `isProcessing` (anti-spam click lock), `reforgePreview` qua `useMemo`, tính toán thọ nguyên còn lại và các hàm xử lý hành động nguyên tử.
  - **Hệ Thống Giao Diện Cổ Phong Tiên Hiệp (Tailwind CSS, React 19):**
    - `ReforgeComparisonCard.tsx`: Thanh trượt slider chọn cảnh giới đích, bảng so sánh ATK/DEF/HP phát quang xanh ngọc `text-emerald-400 font-bold`, cam kết bảo tồn 100% và nút bấm `[⚡ TRÙNG CHÚ TÁI SINH (NÂNG BẬC THẦN BINH)]`.
    - `BloodBondingAltar.tsx`: Tế đàn chu sa đỏ thẫm viền phù văn cổ, cảnh báo tu vi nghiêm ngặt, triện ấn đỏ chói `【HUYẾT KHẾ BẢN MỆNH • BẤT PHỤ CHI KHÍ】` khi đã ký, nút bấm `[🩸 HIẾN HUYẾT ĐOẠN KHÍ (KÝ KẾT HUYẾT KHẾ)]`.
    - `BloodBondCinematicModal.tsx`: Modal hoạt ảnh điện ảnh 3 giai đoạn (giọt chân huyết rơi, tia chớp huyết sắc quán thông thân kiếm, lời thề Khí Linh *"Chân huyết dung hợp, từ nay sinh tử có nhau, vạn kiếp không rời!"*).
    - `LegacyTemperingSection.tsx`: Màn hình chính phân hệ tích hợp vào `components/tabs/ForgingTab.tsx` qua Sub-tab **[⚡ Trùng Chú & Huyết Khế]**.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/legacy-tempering.ts` *(Tạo mới)*: Định nghĩa domain types `BloodBondMetadata`, `ReforgeCostRequirement`, `ReforgePreviewResult`, `LegacyTemperingPlayerState`.
  - `lib/types/items.ts` *(Sửa đổi)*: Mở rộng kiểu `Equipment` thêm `bloodBondData?: BloodBondMetadata | null` và `reforgeCount?: number`.
  - `lib/legacy-tempering-logic.ts` *(Tạo mới)*: Pure Logic Engine gồm `TIER_STAT_SCALE_CONFIG`, `resolveEquipmentTier`, `calculateReforgeStatsScale`, `applyEquipmentReforge`, `validateBloodBondEligibility`, `applyBloodBond`.
  - `lib/save-migration.ts` *(Sửa đổi)*: Bổ sung `migrateLegacyTemperingData` và tích hợp vào pipeline di chuyển save game an toàn.
  - `lib/destiny-data.ts` *(Sửa đổi)*: Tích hợp hệ số khuếch đại chiến lực Huyết Khế vào `calculateCombatStats`.
  - `lib/game-logic/combat.ts` *(Sửa đổi)*: Tích hợp cơ chế miễn nhiễm tước khí (Disarm Immunity) vào `battleBoss`.
  - `hooks/useLegacyTemperingActions.ts` *(Tạo mới)*: React Custom Hook điều phối State & Actions Trùng Chú và Ký Huyết Khế.
  - `hooks/useCraftingActions.ts` *(Sửa đổi)*: Mở rộng `forgingSubTab` thêm giá trị `'legacy_tempering'`.
  - `components/forging/ReforgeComparisonCard.tsx` *(Tạo mới)*: Bảng so sánh chỉ số trước & sau kèm slider chọn cảnh giới đích.
  - `components/forging/BloodBondingAltar.tsx` *(Tạo mới)*: Tế đàn Huyết Khế chu sa viền phù văn đỏ thẫm.
  - `components/forging/BloodBondCinematicModal.tsx` *(Tạo mới)*: Modal hoạt ảnh điện ảnh giọt chân huyết rơi vào thân kiếm.
  - `components/forging/LegacyTemperingSection.tsx` *(Tạo mới)*: Màn hình chính phân hệ Trùng Chú Tái Sinh & Huyết Khế Bản Mệnh.
  - `components/tabs/ForgingTab.tsx` *(Sửa đổi)*: Bổ sung Sub-tab "Trùng Chú & Huyết Khế" trên thanh điều hướng Luyện Khí.
  - `scripts/test-legacy-tempering.ts` *(Tạo mới)*: Bộ 80 bài kiểm thử tự động invariant logic backend, combat và migration (80/80 PASS).
  - `scripts/test-legacy-tempering-ui-integration.ts` *(Tạo mới)*: Bộ 14 bài kiểm thử tích hợp giao diện và ràng buộc nghiệp vụ (14/14 PASS).
- **Kết quả nghiệm thu kỹ thuật (Technical Acceptance Results):**
  - `scripts/test-legacy-tempering.ts`: 80/80 tests PASS (100%)
  - `scripts/test-legacy-tempering-ui-integration.ts`: 14/14 tests PASS (100%)
  - `scripts/test-soul-infusion.ts`: 10/10 tests PASS (100%)
  - `scripts/test-formation-inscription.ts`: 8/8 tests PASS (100%)
  - `scripts/test-modular-metallurgy.ts`: 8/8 tests PASS (100%)
  - `scripts/test-forging-essence.ts`: 6/6 tests PASS (100%)
  - `scripts/test-array-reforging.ts`: 6/6 tests PASS (100%)
  - `scripts/test-crafting-supply.ts`: 8/8 tests PASS (100%)
  - TypeScript Compilation (`npx tsc --noEmit`): 0 errors
  - Next.js Turbopack Production Build (`next build`): Thành công 100%, 8/8 routes hợp lệ.

### [2026-10-03 16:00] - Triển Khai Toàn Diện Phân Hệ "Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh (Soul Infusion & Artifact Spirit Awakening)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Thần binh sau khi minh khắc trận văn và tôi luyện hợp kim tuy uy lực phi thường nhưng vẫn là vũ khí vô tri. Để thần binh có linh tính tương thông thức hải cùng tu sĩ, phân hệ **"Phong Hồn Đoạt Phách & Thức Tỉnh Khí Linh"** cho phép người chơi săn bắt/thu thập Chân Hồn Thần Thú thượng cổ, dung luyện vào Thần Binh để sinh ra **Khí Linh Linh Trí**.
  - Phân hệ được hiện thực hóa toàn diện 100% từ Tầng Domain Types, Pure Business Logic Engine, Save Migration Pipeline, Combat Engine, Custom Actions Hook đến Giao Diện Người Dùng Tiên Hiệp Cổ Phong:
    1. **5 Bộ Chân Hồn Thần Thú & Cổ Hồn Tiêu Chuẩn (`SOUL_REGISTRY`):**
       - **Hắc Thủy Huyền Giao (`hac_giao` - Hệ Thủy, Tier 2, Trúc Cơ):** Hiệu ứng Long Uy Nhiếp Phách (-30% ATK, sợ hãi mất lượt, 20% proc), tính cách *Ngạo Kiều*.
       - **Cửu Thiên Hỏa Phượng (`hoa_phuong` - Hệ Hỏa, Tier 3, Kim Đan):** Hiệu ứng Niết Bàn Hỏa Thiểm (thiêu đốt 4% Max HP/hiệp trong 3 hiệp, 30% proc), tính cách *Háo Chiến*.
       - **Canh Kim Bạch Hổ (`bach_ho` - Hệ Lôi/Kim, Tier 4, Nguyên Anh):** Hiệu ứng Bạch Hổ Thần Sát (+25% Bạo kích, 40% Xuyên giáp, 25% proc), tính cách *Lãnh Đạm*.
       - **Bắc Minh Huyền Vũ (`huyen_vu` - Hệ Thổ, Tier 4, Nguyên Anh):** Hiệu ứng Huyền Vũ Bàn Thạch (+25% Hộ giáp, phản chấn 15% sát thương nhận vào, 100% passive proc), tính cách *Trung Can*.
       - **Thượng Cổ Kiếm Tu (`co_kiem_tu` - Hệ Hỗn Độn, Tier 5, Hóa Thần):** Hiệu ứng Vạn Kiếm Quy Tông (+20% sát thương kiếm khí, 15% nổ kiếm khí bạo kích x2.5), tính cách *Ngạo Kiều*.
    2. **Tiến Hóa 3 Giai Đoạn & Hộ Chủ Thần Thông (Spirit Evolution):**
       - **Giai Đoạn 1 (Hư Ảnh Sơ Khai - 0 EXP):** Hình thái hồn phách mờ ảo, hiệu lực Proc chuẩn x1.0.
       - **Giai Đoạn 2 (Bán Thực Thể - 1,000 EXP):** Linh quang ngưng tụ sắc nét, khuếch đại uy lực `potencyValue` thêm +50% (x1.5).
       - **Giai Đoạn 3 (Chân Thân Hóa Hình - 5,000 EXP):** Khí linh hóa hình hoàn mỹ, khuếch đại uy lực `potencyValue` thêm +100% (x2.0) và mở khóa **[Hộ Chủ Thần Thông]**: Khi HP tu sĩ rơi xuống < 20%, tự động triệt tiêu 100% đòn đánh chí tử và phản kích x1.5 sát thương (khống chế nghiêm ngặt 1 lần/trận).
    3. **Hệ Thống Dưỡng Linh & Tương Tác Thần Thức (Persona & Dialogue):**
       - Hỗ trợ 4 tính cách độc bản (*Ngạo Kiều, Lãnh Đạm, Háo Chiến, Trung Can*) với kho câu thoại đa dạng cho 4 ngữ cảnh (*onCombatStart, onVictory, onLowHealth, onIdle*).
       - Cơ chế nuôi dưỡng tiêu hao Hồn Ngọc (+100 EXP), Thần Niệm Sa (+50 EXP), Hồn Thạch Cực Phẩm (+500 EXP), Linh Thạch Trung Phẩm (+50 EXP).
    4. **Bảo Vệ Tính Toàn Vẹn & Bất Biến (Guards & Invariants):**
       - **Soul Overwrite Guard:** Tự động dọn sạch metadata cũ khi tế đè hồn mới, phòng chống triệt để rác bộ nhớ hoặc xung đột dữ liệu.
       - **Realm Requirement Gate:** Tu sĩ phải đạt cảnh giới tối thiểu tương ứng từng phẩm cấp thần thú mới có thể áp chế tế hồn.
       - **Multi-Location Safe Sync:** Đồng bộ chuẩn xác trang bị dù nằm trong Túi Đồ (`inventory`), Đang Mặc (`equipment`) hay Bản Mệnh Pháp Bảo (`natalArtifact`).
    5. **Tích Hợp Sâu Save Migration & Combat Engine:**
       - `lib/save-migration.ts`: Bổ sung `migrateSoulInfusionData` chuẩn hóa an toàn cấu trúc `soulInfusionState` và `infusedSoul` trên mọi trang bị cũ, tính lũy đẳng (Idempotence) 100%.
       - `lib/game-logic/combat.ts`: Bổ sung cờ `hasTriggeredSpiritAutoGuardian`, thực thi Long Uy, Niết Bàn, và Khí Linh hộ chủ triệt tiêu đòn đánh với hệ thống log cổ phong trang nghiêm.
    6. **Custom Hook & Giao Diện Cổ Phong Tiên Hiệp:**
       - `hooks/useSoulInfusionActions.ts`: Hook điều phối state, atomic validation, anti-spam lock, dialogue timeout 3.5s và nuôi dưỡng khí linh.
       - `components/forging/SoulAltarCanvas.tsx`: Tế đàn Bát Quái Cổ Trận vector SVG với Phong Ma Hồn Châu lơ lửng, bệ đá đặt thần binh và dòng chảy sét ma quang SVG sống động.
       - `components/forging/LivingSpiritCard.tsx`: Thẻ Khí Linh tương tác 3 giai đoạn visual, bong bóng thoại hiệu ứng typewriter và ngăn Dâng Hiến Hồn Tinh trực quan.
       - `components/forging/SoulAwakeningModal.tsx`: Modal bung tỏa hào quang thức tỉnh thần thú, tiếng gầm xuất thế và danh sách buff độc bản.
       - `components/forging/SoulInfusionSection.tsx`: Màn hình chính phân hệ nhúng vào `components/tabs/ForgingTab.tsx` qua Sub-tab **[🔮 Phong Hồn Khí Linh]** và liên kết trên `components/tabs/NatalArtifactView.tsx`.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/soul-infusion.ts` *(Tạo mới)*: Định nghĩa domain types cho Hồn Phách, Khí Linh metadata, Proc Effects, Dialogue Pool.
  - `lib/types/items.ts` *(Sửa đổi)*: Bổ sung trường `infusedSoul?: InfusedSoulMetadata | null` cho `Equipment`.
  - `lib/soul-infusion-logic.ts` *(Tạo mới)*: Pure Logic Engine gồm SOUL_REGISTRY, canInfuseSoulIntoWeapon, applySoulInfusion, feedAndEvolveSpirit, getSpiritDialogue, evaluateSpiritAutoGuardian.
  - `lib/save-migration.ts` *(Sửa đổi)*: Bổ sung `migrateSoulInfusionData` và tích hợp vào pipeline di chuyển save game an toàn.
  - `lib/game-logic/combat.ts` *(Sửa đổi)*: Tích hợp hiệu ứng khống chế, DoT và Khí Linh Hộ Chủ vào Combat Engine.
  - `hooks/useSoulInfusionActions.ts` *(Tạo mới)*: React Custom Hook điều phối State và Actions phong hồn, dưỡng linh, giao lưu thần thức.
  - `hooks/useCraftingActions.ts` *(Sửa đổi)*: Mở rộng `forgingSubTab` thêm giá trị `'soul_infusion'`.
  - `components/forging/SoulAltarCanvas.tsx` *(Tạo mới)*: Component Bát Quái Tế Đàn vector SVG nạp hồn bằng ma quang.
  - `components/forging/LivingSpiritCard.tsx` *(Tạo mới)*: Thẻ Khí Linh tương tác 3 giai đoạn kèm dialogue bubble typewriter.
  - `components/forging/SoulAwakeningModal.tsx` *(Tạo mới)*: Modal hoạt ảnh bung tỏa hào quang thức tỉnh thần binh khí linh.
  - `components/forging/SoulInfusionSection.tsx` *(Tạo mới)*: Màn hình chính phân hệ Phong Hồn Đoạt Phách.
  - `components/tabs/ForgingTab.tsx` *(Sửa đổi)*: Bổ sung Sub-tab "Phong Hồn Khí Linh" trên thanh điều hướng.
  - `components/tabs/NatalArtifactView.tsx` *(Sửa đổi)*: Tích hợp hiển thị Khí Linh Thần Binh cho Pháp Bảo Bản Mệnh.
  - `scripts/test-soul-infusion.ts` *(Tạo mới)*: Test suite 10 bài kiểm thử tự động bao phủ 100% logic, combat, migration và hook.

### [2026-10-03 15:25] - Triển Khai Toàn Diện Phân Hệ "Minh Khắc Trận Văn & Mạch Dẫn Linh (Formation Inscription & Spirit Conduits)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Thần binh sau khi đoán cốt hợp kim tuy sở hữu chỉ số cơ bản và affixes nguyên tố vượt trội nhưng vẫn là trang bị tĩnh. Để đạt đến cảnh giới linh khí câu thông thiên địa, thần binh cần được khai thông **Mạch Dẫn Linh (Spirit Conduits)** và minh khắc các **Trận Đồ Cổ Phong** nhằm kích phát các dị tượng chiến đấu linh động.
  - Phân hệ **Minh Khắc Trận Văn & Mạch Dẫn Linh** được hoàn thiện 100% từ Pure Logic Engine, Save Migration, Combat Hook đến Giao Diện Người Dùng:
    1. **Mạch Dẫn Linh & Quy Tắc Khai Mạch (Spirit Conduits):**
       - Cơ chế xúc xắc ngẫu nhiên mở 1 đến 4 Mạch Dẫn Linh dựa trên Cảnh Giới Luyện Khí Sư, Độ Tinh Khiết Hợp Kim và Phẩm Cấp Dị Hỏa.
       - **Bất biến thợ rèn cấp cao:** Luyện Khí Sư Hóa Thần trở lên kết hợp Hợp Kim tinh khiết $\ge 95\%$ bảo đảm luôn đạt 3 hoặc 4 Mạch Dẫn Linh.
    2. **Registry Trận Đồ Tiêu Biểu & Hiệu Ứng Chiến Đấu:**
       - **Tụ Khí Trận (`tu_khi_tran` - Nhị Giai, Passive):** Giảm 20% tiêu hao chân nguyên khi thi triển pháp thuật.
       - **Phong Nhận Trận (`phong_nhan_tran` - Tam Giai, On-Hit Proc):** 25% xác suất bạo phát một luồng kiếm khí xé toạc hư không, gây thêm +40% ATK sát thương.
       - **Bát Quái Hộ Thân Trận (`bat_quai_ho_than` - Ngũ Giai, Emergency Shield):** Khi HP tụt dưới 30%, tự động triệt tiêu 100% đòn đánh chí tử (Damage = 0) và tạo hộ thuẫn 20% Max HP (khống chế nghiêm ngặt 1 lần/trận).
       - **Cửu Tiêu Lôi Trận (`cuu_tieu_loi_tran` - Lục Giai, Crowd Control):** 15% xác suất gọi thiên lôi giáng thế gây choáng đối thủ 1 hiệp.
       - **Huyết Sát Phệ Huyết Trận (`huyet_sat_the_huyet` - Thất Giai, Vampiric Drain):** Hấp thu huyết khí chuyển hóa 12% lượng sát thương thực tế gây ra thành sinh lực hồi phục.
    3. **Hệ Thống Ràng Buộc Khắc Trận (Guards & Invariants):**
       - **Thần Thức Thẩm Định:** Yêu cầu Thần Thức tu sĩ tối thiểu tương ứng từng cấp bậc trận văn.
       - **Tiêu Hao Linh Mực & Trận Sa:** Tự động kiểm tra và khấu trừ vật phẩm từ kho đồ người chơi theo cơ chế Atomic Deduction.
       - **Anti-Duplicate Guard:** Chống tuyệt đối việc khắc trùng lặp cùng một loại trận đồ trên nhiều slot của cùng một trang bị.
       - **Thần Thức Tẩy Xóa:** Tiêu hao [Tẩy Thần Thủy] hoàn nguyên Mạch Dẫn Linh về trạng thái trống nguyên bản, cho phép tái khắc trận đồ mới.
    4. **Tích Hợp Sâu Save Migration & Combat Engine:**
       - `lib/save-migration.ts`: Bổ sung `migrateFormationInscriptionData` chuẩn hóa an toàn 2 Mạch Dẫn Linh cho mọi vũ khí/pháp bảo cũ, khởi tạo an toàn `player.inscriptionState`, bảo đảm 100% tính lũy đẳng (Idempotence).
       - `lib/destiny-data.ts`: Tích hợp `aggregateEquipmentInscriptions` vào `calculateCombatStats`, cộng dồn chuẩn xác các chỉ số bị động (`qi_cost_reduction`).
       - `lib/game-logic/combat.ts`: Mở rộng cờ `hasTriggeredBatQuaiShield`, thực thi logic triệt tiêu đòn đánh chí tử, hồi phục sinh lực và kiếm khí bạo phát với hệ thống log cổ phong trang nghiêm.
    5. **Custom Hook & Trải Nghiệm Giao Diện Cổ Phong:**
       - `hooks/useFormationInscriptionActions.ts`: Hook điều phối bất biến toàn bộ hành động chọn trang bị, chọn slot, khắc ấn nguyên tử và tẩy luyện.
       - `components/forging/WeaponConduitCanvas.tsx`: Vẽ đồ họa vector SVG khung thần binh và 1 - 4 đường mạch dẫn uốn lượn kèm hiệu ứng hào quang hoàng kim/lam linh rực rỡ.
       - `components/forging/InscriptionDrawer.tsx`: Drawer danh mục Trận Đồ với huy hiệu phẩm cấp, kiểm tra điều kiện thần thức và nguyên liệu trực quan.
       - `components/forging/CalligraphyModal.tsx`: Hoạt ảnh Bát Quái Trận Đồ (☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷) xoay tròn và vung bút chu sa vẽ phù văn, kèm âm thanh kiếm khí xé gió procedural.
       - `components/forging/FormationInscriptionSection.tsx`: Màn hình chính tích hợp mượt mà vào `components/tabs/ForgingTab.tsx` qua Sub-tab **[⚡ Minh Khắc Trận Văn]**.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/formation-inscription.ts` *(Tạo mới)*: Định nghĩa miền kiểu dữ liệu trận văn, conduits, registry config và player state.
  - `lib/formation-inscription-logic.ts` *(Tạo mới)*: Pure Logic Engine gồm registry 5 trận đồ, roll conduits, validate requirements, cleanse, aggregate inscriptions, deduct materials.
  - `hooks/useFormationInscriptionActions.ts` *(Tạo mới)*: Custom React Hook điều phối State và Actions cho phân hệ.
  - `components/forging/WeaponConduitCanvas.tsx` *(Tạo mới)*: Component đồ họa vector SVG mạch dẫn linh và các nút trận nhãn tương tác.
  - `components/forging/InscriptionDrawer.tsx` *(Tạo mới)*: Drawer danh mục trận đồ với anti-duplicate guard và thẻ nguyên liệu.
  - `components/forging/CalligraphyModal.tsx` *(Tạo mới)*: Modal nghi thức vung bút chu sa khắc phù Bát Quái tự đóng sau 1.2s.
  - `components/forging/FormationInscriptionSection.tsx` *(Tạo mới)*: Section chính của phân hệ tích hợp bộ chọn trang bị, canvas và quản lý 4 slot.
  - `scripts/test-formation-inscription.ts` *(Tạo mới)*: Suite kiểm thử tự động 8 test cases bao phủ toàn diện logic, combat, migration và hook.
  - `lib/types/player.ts` *(Sửa đổi)*: Bổ sung trường `inscriptionState` vào `PlayerStats`.
  - `lib/types/items.ts` *(Sửa đổi)*: Bổ sung trường `inscriptionData?: WeaponInscriptionMetadata | null` vào `Equipment`.
  - `lib/save-migration.ts` *(Sửa đổi)*: Hiện thực hóa `migrateFormationInscriptionData` và nối vào chuỗi `normalizePlayerData`.
  - `lib/destiny-data.ts` *(Sửa đổi)*: Tích hợp `aggregateEquipmentInscriptions` vào `calculateCombatStats`.
  - `lib/game-logic/combat.ts` *(Sửa đổi)*: Tích hợp 3 hiệu ứng trận đồ vào combat engine và mở rộng `BattleResult`.
  - `hooks/useCraftingActions.ts` *(Sửa đổi)*: Mở rộng kiểu `forgingSubTab` thêm giá trị `'inscription'`.
  - `hooks/index.ts` *(Sửa đổi)*: Re-export `useFormationInscriptionActions`.
  - `components/tabs/ForgingTab.tsx` *(Sửa đổi)*: Bổ sung nút Sub-tab `Minh Khắc Trận Văn` và nhúng `FormationInscriptionSection`.
  - `CHANGELOG.md` *(Sửa đổi)*: Ghi nhận nhật ký phiên bản chi tiết.
- **Kết quả kiểm thử & Nghiệm thu chất lượng (Test Suite & Verification):**
  - **Regression Test Suites Rèn Đúc & Chiến Đấu:** 2/2 Suites Hoàn Tất Xuất Sắc — **16/16 Tests Passed (100%)**:
    1. `scripts/test-formation-inscription.ts`: **8/8 PASSED** (Conduit roll distribution, divine sense & ink guard, anti-dup guard, cleanse & re-inscription, aggregation, data integrity, combat integration & save migration, React hook pipeline).
    2. `scripts/test-modular-metallurgy.ts`: **8/8 PASSED** (Crucible gating, ratio normalization & affixes, archetype baselines, atomic deduction, name generation, purity boundaries, save migration idempotence, combat loop execution).
  - `npx tsc --noEmit`: **0 Errors** (TypeScript Strict Mode hoàn toàn sạch, zero type errors).
  - `npm run build`: **Turbopack Build Succeeded in 1.5s (Exit code 0)**, static pages generated thành công, không gặp bất kỳ lỗi hydration hay SSR.
- **Hướng dẫn trải nghiệm (User Guide & UI Flow):**
  1. Vào giao diện **Thần Binh Các** (Tab Rèn Đúc).
  2. Bấm vào Sub-tab mới **[⚡ Minh Khắc Trận Văn]**.
  3. Chọn thần binh mục tiêu (từ trang bị đang mặc hoặc trong túi đồ).
  4. Quan sát **Đồ Trận Mạch Dẫn Linh (Canvas SVG)**: nhấp vào các Trận Nhãn đang mở để xem thông tin chi tiết.
  5. Bấm **[⚡ Khắc Ấn Trận Đồ]** để mở Drawer: chọn Trận Đồ phù hợp với điểm Thần Thức và lượng Linh Mực đang có.
  6. Thưởng thức **Nghi Thức Vung Bút Chu Sa (Calligraphy Modal)**: Bát Quái trận đồ bừng sáng hoàng kim và hoàn tất khắc ấn.
  7. Nếu muốn thay đổi trận đồ, bấm **[🌊 Thần Thức Tẩy Xóa]** tiêu hao 1 bình Tẩy Thần Thủy để hoàn nguyên slot về trạng thái ban sơ.

---

### [2026-10-03 14:45] - Triển Khai Toàn Diện Mô Hình "Đan Độc Suy Hao Cấp Nhân (Multiplicative Compounding Decay)" & Nâng Cấp Giao Diện Đan Đạo
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, công thức tính Đan Độc trong quá trình luyện chế sử dụng các phép trừ tuyến tính hoặc cộng dồn giảm trừ thô ($\text{Toxicity} = \text{Base} \times (1 - \text{VeinReduction} - \text{FlameReduction} - \text{TacticsReduction})$ hoặc trừ điểm độc cố định). Cách tính này dẫn đến nguy cơ tiềm ẩn: đan độc có thể bị triệt tiêu thành số âm một cách phi logic, hoặc các hiệu ứng giảm độc triệt tiêu lẫn nhau không theo tỷ lệ tự nhiên, phá vỡ logic mô phỏng đan đạo Tiên Hiệp.
  - Phân hệ **Suy Hao Cấp Nhân (Multiplicative Compounding Decay)** được tái cấu trúc toàn diện theo triết lý tinh luyện chân thực:
    1. **Mô Hình Toán Học Suy Hao Cấp Nhân Chuẩn Xác:**
       $$\text{FinalToxicity} = \left\lfloor \text{BaseToxicity} \times M_{\text{vein}} \times (1 - R_{\text{flame}}) \times (1 - R_{\text{tactics}}) \right\rfloor$$
       - **Tính chất phân rã lũy tiến:** Mỗi tầng lọc độc (Đan Văn $\rightarrow$ Dị Hỏa $\rightarrow$ Chiến Thuật Hỏa Hậu) đều tinh luyện trên lượng tạp chất còn lại sau tầng trước.
       - **Giới hạn nghiêm ngặt (Bounded Invariant):** $0 \le \text{FinalToxicity} \le \text{BaseToxicity}$, triệt để loại bỏ hiện tượng âm độc tính.
       - **Chí Tinh Hoàn Mỹ (Cửu Khổng Thần Đan):** Đan 9 Văn có $M_{\text{vein}} = 0 \implies \text{FinalToxicity} \equiv 0$ (Đan dược tuyệt phẩm không tì vết, miễn nhiễm hoàn toàn đan độc).
    2. **Quy Chuẩn Hệ Số Đan Văn Mới (`PILL_VEIN_CONFIG`):**
       - **0 Văn (Hạ Phẩm):** $M_{\text{vein}} = 0.50$, badge `[0 VĂN • 50% ĐỘC]`
       - **1 - 2 Văn (Sơ Văn):** $M_{\text{vein}} = 0.40$, badge `[1 VĂN • 40% ĐỘC]` / `[2 VĂN • 40% ĐỘC]`
       - **3 - 5 Văn (Trung Phẩm):** $M_{\text{vein}} = 0.25$, badge `[X VĂN • 25% ĐỘC]`
       - **6 - 8 Văn (Thượng Phẩm):** $M_{\text{vein}} = 0.10$, badge `[X VĂN • 10% ĐỘC]`
       - **9 Văn (Cửu Khổng Thần Đan):** $M_{\text{vein}} = 0.00$, badge `[9 VĂN • 0% ĐỘC]` (Hoàng kim chớp nháy cổ phong).
    3. **Đồng Bộ Dị Hỏa & Hỏa Hậu Tứ Trụ:**
       - `lib/heavenly-flame-logic.ts`: Chuyển đổi toàn bộ logic Dị Hỏa sang hệ số tỷ lệ `flameBurnRatio`, tích hợp vào `calculateMultiplicativeToxicity`.
       - `lib/alchemy-tactics-logic.ts`: Đồng bộ `previewConcoction` và `executeTacticalConcoction`, rà soát các thế hỏa (Văn Hỏa, Vũ Hỏa, Bình Hành, Dục Hỏa) áp dụng chuẩn xác hệ số suy hao cấp nhân.
    4. **Cơ Chế Di Trú Dữ Liệu An Toàn (Save Migration):**
       - Bổ sung `migrateToxicityFormulaUpdate` vào `lib/save-migration.ts`.
       - Quét toàn bộ kho đồ người chơi (`player.inventory`), tự động nhận diện đan dược và ánh xạ lại `item.toxicityMultiplier` theo bảng quy chuẩn mới, đảm bảo tính lũy đẳng (idempotent 100%) và không làm biến đổi các thuộc tính khác.
    5. **Nâng Cấp Giao Diện Cổ Phong (UI/UX HUD & Telemetry):**
       - **HUD Trạng Thái Độc Tố (`components/tabs/AlchemyTab.tsx`):** Cập nhật badge hiển thị độc tính trực quan trên từng thẻ đan, phân biệt rõ đan thường và đan cực phẩm 9 văn.
       - **Bảng Dự Toán Thiên Cơ Live Telemetry (`components/tabs/AlchemyTacticsPanel.tsx`):** Hiển thị chuỗi phân rã độc tính theo thời gian thực (Đan Văn $\rightarrow$ Dị Hỏa $\rightarrow$ Hỏa Hậu) và thanh tiến trình kép so sánh lượng độc gốc với lượng độc sau thanh lọc.
       - **Thẻ Thu Hoạch Thần Đan (`components/modals/PillHarvestModal.tsx`):** Modal thu đan tổng kết rõ ràng chỉ số Độc Tích Tụ thực tế và tỷ lệ thanh lọc tinh khiết đạt được.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/pill-vein-logic.ts` *(Sửa đổi)*: Tái cấu trúc `PILL_VEIN_CONFIG` theo hệ số mới, xây dựng hàm chuẩn `calculateMultiplicativeToxicity` trả về `finalToxicity` và `breakdown` chi tiết 3 tầng suy hao.
  - `lib/heavenly-flame-logic.ts` *(Sửa đổi)*: Chuyển đổi logic giảm độc Dị Hỏa sang `flameBurnRatio` và tích hợp công thức cấp nhân.
  - `lib/alchemy-tactics-logic.ts` *(Sửa đổi)*: Đồng bộ hóa `previewConcoction`, `executeTacticalConcoction` với mô hình suy hao cấp nhân.
  - `lib/save-migration.ts` *(Sửa đổi)*: Bổ sung hàm `migrateToxicityFormulaUpdate`, tích hợp vào pipeline `normalizePlayerData`.
  - `components/tabs/AlchemyTab.tsx` *(Sửa đổi)*: Cập nhật format badge Đan Văn, đồng bộ hiển thị độc tố trên từng thẻ đan.
  - `components/tabs/AlchemyTacticsPanel.tsx` *(Sửa đổi)*: Triển khai Live Telemetry Preview hiển thị chuỗi phân rã độc tính và thanh tiến trình kép.
  - `components/modals/PillHarvestModal.tsx` *(Sửa đổi)*: Thẻ tổng kết thu hoạch đan hiển thị trực quan Độc Tích Tụ và Tỷ lệ thanh lọc.
  - `scripts/test-multiplicative-toxicity.ts` *(Tạo mới)*: Bộ test suite tự động 8 test cases bao phủ toàn diện toán học cấp nhân, edge cases, breakdown telemetry và save migration.
  - `scripts/test-pill-veins.ts` *(Sửa đổi)*: Cập nhật assertion Test 6 tương thích với hệ số `0.50` của 0-văn.
  - `CHANGELOG.md` *(Sửa đổi)*: Ghi nhận nhật ký phiên bản và báo cáo nghiệm thu kỹ thuật.
- **Kết quả kiểm thử & Nghiệm thu chất lượng (Test Suite & Verification):**
  - **Regression Test Suites Đan Đạo:** 5/5 Suites Hoàn Tất Xuất Sắc — **32/32 Tests Passed (100%)**:
    1. `scripts/test-multiplicative-toxicity.ts`: **8/8 PASSED** (Base decay, 9-vein zero toxicity, flame & tactics compounding, bounded invariants, save migration).
    2. `scripts/test-pill-veins.ts`: **6/6 PASSED** (Vein generation, breakthrough rates, stat multipliers, config normalization).
    3. `scripts/test-heavenly-flame.ts`: **6/6 PASSED** (Flame binding, mastery levels, flame purity, process integration).
    4. `scripts/test-alchemy-tactics.ts`: **6/6 PASSED** (Heat stances, tactical execution, preview accuracy, resource consumption).
    5. `scripts/test-pill-tribulation.ts`: **6/6 PASSED** (Tribulation triggers, 3-pillar defense, pill evolution, spirit transformation).
  - `npx tsc --noEmit`: **0 Errors** (TypeScript Strict Mode hoàn toàn sạch, zero type errors).
  - `npm run build`: **Turbopack Build Succeeded (Exit code 0)**, static pages generated thành công trong 9.1s, không có lỗi hydration hay SSR.
- **Hướng dẫn trải nghiệm (User Guide & UI Flow):**
  1. Vào giao diện **Luyện Đan Phòng** (Tab Luyện Đan).
  2. Chọn đơn phương đan dược mong muốn, kết hợp Dị Hỏa đã thuần hóa và chọn Thế Hỏa Hậu phù hợp.
  3. Quan sát **Bảng Dự Toán Thiên Cơ (Live Telemetry Preview)** trong mục Chiến Thuật: theo dõi chuỗi suy giảm độc tính thời gian thực qua từng tầng lọc và thanh tiến trình kép so sánh Độc Gốc vs Độc Lọc.
  4. Bấm **[TIẾN HÀNH LUYỆN ĐAN]**, hoàn tất quá trình và quan sát **Modal Thu Đan**: theo dõi trực tiếp chỉ số Độc Tích Tụ thực tế và Tỷ lệ thanh lọc đạt được.
  5. Đan 9 Văn Cửu Khổng Thần Đan hiển thị hiệu ứng ánh vàng kim hoàng tộc rực rỡ với dòng chữ `[9 VĂN • 0% ĐỘC]`, cam kết 100% không để lại độc tính vào kinh mạch.

---

### [2026-10-03 14:05] - Triển Khai Toàn Diện Phân Hệ "Đoán Cốt Hợp Kim & Phôi Khí Tự Chọn (Modular Metallurgy & Weapon Archetypes)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Phân hệ Rèn Đúc (Thần Binh Các) trước đây chủ yếu dựa trên các công thức trang bị cố định (static recipes), người chơi chưa có khả năng tự do sáng tạo phôi khí, chưa được tự tay phối chế khoáng thạch theo tỷ lệ mong muốn để tạo ra những thần binh độc bản mang các hiệu ứng chiến đấu đặc dị.
  - Phân hệ **Đoán Cốt Hợp Kim (Modular Metallurgy)** ra đời nhằm hiện thực hóa triết lý luyện khí thượng thừa của Tiên Hiệp:
    1. **Khởi Nguyên 4 Loại Phôi Khí Cổ Điển (Weapon Archetypes):**
       - **Phi Kiếm (`phi_kiem`):** Thân kiếm thanh mảnh phi hành ngự kiếm, tốc độ xuất kiếm thần tốc (x1.25), bạo kích kinh người (+12%), giảm nhẹ khí huyết (x0.8).
       - **Trọng Kiếm (`trong_kiem`):** Đại kiếm nặng ngàn cân chém nứt trời cao, công kích bạo liệt (x1.6), xuyên giáp (+20%), gây choáng (+10%), giảm nhẹ tốc độ (x0.85).
       - **Bảo Đỉnh (`bao_dinh`):** Bảo đỉnh trấn sơn hộ mệnh, uẩn dưỡng khí huyết khổng lồ (x1.5) và hộ giáp vững như bàn thạch (x1.8) kèm miễn thương (+8%), công thấp (x0.6).
       - **Trận Kỳ (`tran_ky`):** Pháp trận cờ lệnh hô phong hoán vũ, tăng vọt uy lực pháp thuật (+30%), giảm tiêu hao linh lực (-20%), công kích chuẩn (x1.0).
    2. **Lò Nung Ngũ Hành Đa Nguyên (4 Crucible Slots):**
       - Cho phép nạp từ 2 đến 4 loại khoáng thạch vào lò nung cùng thanh trượt Slider điều chỉnh khối lượng linh hoạt (5 đến 50 thỏi).
       - Cơ chế Chuẩn Hóa Tỷ Lệ ($\sum \text{ratio} = 1.0$) bảo toàn chính xác 100% tỷ lệ phối trộn quặng.
    3. **Ngũ Hành Thần Khoáng & Affixes Độc Bản:**
       - **Canh Kim Thạch:** Canh Kim Chi Khí sắc bén vô song, chuyển hóa đòn đánh thành **Sát Thương Chuẩn (True Damage)** xuyên thấu hộ thể linh quang (tối đa +15%).
       - **Hàn Băng Tinh:** Băng Phách hàn khí ngưng trệ kinh mạch, **Làm Chậm Tốc Độ (Slow Speed)** xuất chiêu của đối thủ (tối đa +20%).
       - **Xích Hỏa Đồng:** Địa Hỏa chân diễm cuồn cuộn, gây **Sát Thương Thiêu Đốt Liên Tục (Burn DoT)** theo thời gian (tối đa +12%).
       - **Bách Luyện Huyền Thiết:** Cứng cỏi bất hoại, hấp thu dư chấn và **Giảm Sát Thương Nhận Vào (Damage Reduction)** (tối đa +10%).
       - **Tinh Thần Sa:** Hấp thu tinh hoa tinh tú, hộ thể các huyệt đạo chí mạng, **Kháng Bạo Kích (Crit Resist)** cực cao (tối đa +10%).
    4. **Độ Tinh Khiết (Purity Score) & Sinh Danh Tự Động:**
       - Thang điểm tinh khiết $70\% \rightarrow 100\%$ tính toán dựa trên độ đồng đều phối trộn, cấp bậc Luyện Khí Sư và Dị Hỏa dung nạp.
       - Tự sinh danh xưng thần binh theo 4 phẩm cấp: *Sơ Luyện* ($<80\%$), *Bách Luyện* ($80-87\%$), *Bạch Hổ* ($88-94\%$), *Thái Sơ* ($\ge 95\%$) hoặc cho phép người chơi ban đạo hiệu riêng theo ý muốn.
    5. **Tích Hợp Sâu Save Migration & Combat Engine:**
       - Migration an toàn tuyệt đối, idempotent 100%, bảo toàn toàn vẹn dữ liệu trang bị cũ.
       - Combat Loop tự động tính toán Sát Thương Chuẩn, làm chậm thân pháp đối thủ và thiêu đốt chân khí qua từng hiệp đấu Boss.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/modular-metallurgy.ts` *(Tạo mới)*: Domain Types cho Đoán Cốt Hợp Kim, Weapon Archetypes, Elemental Affixes, và Metallurgy State.
  - `lib/types/items.ts` *(Sửa đổi)*: Bổ sung trường `alloyMetadata?: ModularWeaponMetadata | null` trên interface `Equipment`.
  - `lib/types/index.ts` *(Sửa đổi)*: Export barrel cho domain types modular-metallurgy.
  - `lib/modular-metallurgy-logic.ts` *(Tạo mới)*: Pure logic engine tính toán tỷ lệ hợp kim, độ tinh khiết, sinh tên thần binh, chế tác trang bị và cơ chế Atomic Deduction tồn kho.
  - `lib/save-migration.ts` *(Sửa đổi)*: Bổ sung `migrateModularForgingData` và tích hợp vào chu trình `normalizePlayerData`.
  - `lib/destiny-data.ts` *(Sửa đổi)*: Tích hợp cộng dồn `trueDamagePercent`, `slowSpeedPercent`, `burnDamagePercent`, `damageReductionPercent` trong hàm `calculateCombatStats`.
  - `lib/game-logic/combat.ts` *(Sửa đổi)*: Bổ sung `executeAlloyCombatTurn`, tích hợp 3 hiệu ứng chiến đấu đặc thù vào `battleBoss` kèm flavor log cổ phong.
  - `hooks/useModularForgingActions.ts` *(Tạo mới)*: Custom Hook điều phối toàn bộ State, Real-time Preview Engine, Derived Validation và Atomic Crafting Guard.
  - `hooks/useCraftingActions.ts` *(Sửa đổi)*: Mở rộng kiểu `forgingSubTab` thêm giá trị `'modular'`.
  - `hooks/index.ts` *(Sửa đổi)*: Re-export `useModularForgingActions`.
  - `components/forging/ElementalRadarChart.tsx` *(Tạo mới)*: Biểu đồ Radar ngũ giác thuần SVG 100% biểu diễn 5 đặc tính ngũ hành với hiệu ứng phát quang cổ phong.
  - `components/forging/ForgedRelicModal.tsx` *(Tạo mới)*: Modal Thần Binh Xuất Thế hoàng kim rực rỡ kèm tùy chọn Trang Bị Ngay và Thu Vào Túi Trữ Vật.
  - `components/forging/ModularMetallurgySection.tsx` *(Tạo mới)*: Giao diện hoàn chỉnh 3 khu vực Tiên Hiệp Cổ Phong (Phôi Khí, Lò Nung 4 Slot, Radar Chart & Hộp Dự Báo Thiên Cơ).
  - `components/tabs/ForgingTab.tsx` *(Sửa đổi)*: Tích hợp sub-tab Đoán Cốt Hợp Kim và banner điều hướng gợi mở tính năng.
  - `scripts/test-modular-metallurgy.ts` *(Tạo mới)*: Test suite tự động 8 ca kiểm thử bao phủ toàn bộ logic engine, migration và combat loop.
  - `CHANGELOG.md` *(Sửa đổi)*: Cập nhật nhật ký phát hành toàn diện theo chuẩn Keep a Changelog.
- **Kết quả kiểm thử & Nghiệm thu chất lượng (Test Suite & Verification):**
  - `npx tsx scripts/test-modular-metallurgy.ts`: **8/8 Tests Passed (100% Hoàn tất)**:
    1. *Slot Gating Invariant:* Chặn khi nạp 1 loại quặng (yêu cầu tối thiểu 2 loại); chấp nhận nạp 3 loại quặng hợp lệ.
    2. *Ratio Normalization & Affix Calculation:* 60 Canh Kim + 40 Hàn Băng chuẩn hóa đúng 0.6 và 0.4; tính đúng 9% Sát thương chuẩn và 8% Làm chậm.
    3. *Archetype Baseline Differentiation:* Phi Kiếm vượt trội tốc độ (110 vs 74) & bạo kích (+10.5%); Trọng Kiếm vượt trội công kích (1402 vs 1051), xuyên giáp (+20%) & choáng (+10%).
    4. *Atomic Deduction & Boundary Guard:* Chặn yêu cầu vượt tồn kho, không để số âm, bảo vệ toàn vẹn túi đồ người chơi.
    5. *Name Generation Accuracy:* Sinh đúng tiền tố theo 4 bậc điểm tinh khiết: Sơ Luyện, Bách Luyện, Bạch Hổ, Thái Sơ.
    6. *Purity Score Boundaries:* Điểm tinh khiết luôn nằm nghiêm ngặt trong đoạn $[70.0, 100.0]$.
    7. *Save Migration & Idempotence Invariant:* Khởi tạo an toàn `modularMetallurgyState`, gán `alloyMetadata = null` cho trang bị cũ, đạt tính lũy đẳng (Idempotent).
    8. *Combat Stats Aggregation & Combat Loop Execution:* `calculateCombatStats` cộng dồn chuẩn xác, sát thương chuẩn bỏ qua giảm trừ phòng ngự, làm chậm tốc độ đối thủ và thiêu đốt HP theo lượt.
  - `npx tsc --noEmit`: **0 Errors** (TypeScript Strict Mode hoàn toàn sạch, zero type errors).
  - `npm run build`: **Turbopack Build Succeeded (Exit code 0)**, static pages generated thành công trong 10.5s, không có lỗi hydration hay SSR.
- **Hướng dẫn trải nghiệm (User Guide & UI Flow):**
  1. Vào giao diện **Thần Binh Các** (Tab Rèn Đúc).
  2. Bấm chọn sub-tab **[✨ Đoán Cốt Hợp Kim]** trên thanh điều hướng hoặc nhấp vào banner gợi ý ở đầu tab Đúc Khí.
  3. Chọn 1 trong 4 loại **Phôi Khí Khởi Nguyên** (Phi Kiếm, Trọng Kiếm, Bảo Đỉnh, Trận Kỳ).
  4. Nạp từ 2 đến 4 loại khoáng thạch từ túi đồ vào các vị trí **Slot 1 - 4**, kéo thanh trượt Slider điều chỉnh khối lượng nung đúc (5 - 50 thỏi).
  5. Quan sát **Biểu Đồ Radar Ngũ Hành** xoay chuyển thời gian thực và theo dõi hộp dự báo Thiên Cơ (Công kích, Sát thương chuẩn, Làm chậm, Độ tinh khiết).
  6. Có thể nhập tên đạo hiệu riêng cho thần binh hoặc giữ tên mặc định tự sinh.
  7. Bấm **[KHAI LÒ LUYỆN KHÍ]**, thưởng thức hoạt cảnh nung lò và chiêm ngưỡng **Modal Thần Binh Xuất Thế** để trang bị ngay lập tức!

---

### [2026-10-03 13:00] - Triển Khai Toàn Diện Phân Hệ "Đan Lôi Kiếp & Đan Linh Hóa Hình (Pill Tribulation & Living Spirits)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Luyện Đan đã có Đan Văn Cửu Trọng, Dược Tính Biến Dị, Thiên Địa Dị Hỏa và Hỏa Hậu Tứ Trụ. Tuy nhiên, khi luyện chế các loại thần đan phẩm cấp tối thượng (Thất Giai -> Cửu Giai, Đan 9 Văn Cửu Khổng hoặc Đan Biến Dị), quá trình xuất lò vẫn diễn ra êm đềm, thiếu đi yếu tố kịch tính, nghẹt thở và nguy cơ hủy diệt mang tính biểu tượng của Tiên Hiệp: **Đan Lôi Kiếp (Pill Tribulation)** và cơ duyên **Đan Linh Hóa Hình (Living Spirits)**.
  - Phân hệ mới mang đến trải nghiệm thiên kiếp chân thực:
    1. **Dẫn Động Thiên Kiếp (Pill Tribulation Trigger):**
       - Đan phẩm $\ge$ Thất Giai (Tier 7: 35% Tam Trọng, Tier 8: 65% Lục Trọng, Tier 9: 100% Cửu Trọng), hoặc đạt 9 Đan Văn Cực Phẩm (100% bắt buộc Cửu Trọng Hỗn Độn Kiếp), hoặc mang Dược Tính Biến Dị hiếm (40% Tam Trọng) sẽ dẫn động sấm sét giáng thẳng xuống đan phòng.
    2. **Cơ Chế Hộ Đan Tam Trận (Three-Pillar Defense Mechanism):**
       - Lôi kiếp giáng xuống theo từng đợt sóng sét (`TribulationLightningWave`). Người chơi phân phối phòng tuyến:
         - **Bản Thân Ngạnh Kháng:** Dùng nhục thân đỡ sét, tiêu hao Máu theo chỉ số `def` và `lightningResist`. Thành công nhận thêm điểm Ngộ Tính +1 và kinh nghiệm Tu Vi Tôi Thể.
         - **Đạo Lữ Hộ Pháp:** Đạo Lữ xuất thủ tế xuất tiên thiên bảo bối che chở, giảm 60% sát thương, tiêu hao thể lực Đạo Lữ (`fatigueUntil +1h`), gia tăng +5 điểm Hảo Cảm.
         - **Hộ Trận Động Phủ:** Kích hoạt Hộ Trận tiêu hao 5,000 - 15,000 Linh Thạch dựng khiên năng lượng hấp thu 80% sát thương.
    3. **Phân Định Thành Bại & Thăng Hoa Tiên Thiên Thần Đan (Primordial Evolution):**
       - *Thất bại:* Khiên vỡ, đan lò rạn nứt, viên đan bị sét đánh tan nát thành Phế Đan Độc Dược (mang 100 Đan Độc).
       - *Thành công:* Viên đan được thiên lôi tẩy luyện triệt để, thăng hoa thành **Tiên Thiên Thần Đan**: Dược lực tăng vọt $+50\%$, Đan độc = 0%, mở khóa hào quang **【Tiên Thiên Hộ Thể】** vĩnh cửu.
    4. **Đan Linh Hóa Hình (Dan Linh Awakening & Abode Sync):**
       - Với viên đan Cửu Giai hoặc Đan 9 Văn vượt kiếp nạn thành công: Có 5% xác suất cơ bản (tăng lên 10% nếu có Dị Hỏa Hỗn Độn) viên đan không nằm lại dưới dạng vật phẩm tiêu hao, mà hấp thu linh khí hóa hình thành **Đan Linh Nhi (Dan Linh Sprite)**:
         - Sinh linh Đan Đồng ngụ tại Động Phủ.
         - Phụ giúp chăm sóc **Dược Viên** (rút ngắn 20% thời gian lớn thảo dược).
         - Túc trực Đan Phòng, tự động tăng $+15$ điểm Đan Văn và giảm 10% nguy cơ nổ lò.
    5. **Bảo Tồn 4 Ràng Buộc Bất Biến (Hard Invariants):**
       - Bảo toàn cấu trúc save cũ, migration chuẩn hóa an toàn trường `pillTribulationState`.
       - Pure logic độc lập 100% trong `lib/pill-tribulation-logic.ts`.
       - Atomic Tribulation Guard chống reload save scumming.
       - Đồng bộ hai chiều với Động Phủ (`abode-logic.ts`) và Combat Stats.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/pill-tribulation.ts`, `lib/types/player.ts`, `lib/types/pill-veins.ts`, `lib/types/alchemy-tactics.ts`):**
     - Khai báo: `TribulationIntensity`, `TribulationLightningWave`, `PillTribulationEncounter`, `DanSpiritCompanion`, `PillTribulationState`, `LightningDefenseResult`, `FinalizeTribulationResult`.
     - Mở rộng `PlayerStats` với `pillTribulationState?: PillTribulationState`.
     - Mở rộng `VeinedPillMetadata` với `isPrimordial?: boolean`, `primordialAura?: any`.
     - Mở rộng `PillCraftingResult` và `TacticalAlchemyExecutionResult` với `tribulationTriggered?: boolean`, `tribulationEncounter?: PillTribulationEncounter`.
  2. **Pure Business Logic Engine (`lib/pill-tribulation-logic.ts`):**
     - `evaluatePillTribulationTrigger`: Thẩm định kích hoạt thiên kiếp theo Tier, 9 Văn, Biến dị.
     - `generateTribulationWaves` & `createPillTribulationEncounter`: Khởi tạo các đợt sấm sét Tam Trọng, Lục Trọng, Cửu Trọng với sát thương tăng tiến.
     - `resolveLightningDefenseRound`: Giải quyết từng đợt sét qua 3 tuyến Bản Thân, Đạo Lữ, Hộ Trận.
     - `finalizePillTribulation`: Kết toán thăng hoa Tiên Thiên Thần Đan (+50% dược lực, 0 đan độc) hoặc xúc xắc Đan Linh Nhi hóa hình.
     - `calculateDanSpiritsBuffs`: Tính toán buff tổng hợp từ Đan Linh ngụ tại Động Phủ.
  3. **Tích Hợp Save Migration, Dược Viên & Engine Đan Đạo (`lib/save-migration.ts`, `lib/abode-logic.ts`, `lib/pill-vein-logic.ts`, `lib/alchemy-tactics-logic.ts`):**
     - Thêm `migratePillTribulationData(player)` và tích hợp vào `normalizePlayerData`.
     - Bổ sung `getDanSpiritsGrowthDiscount` trong `abode-logic.ts`.
     - Tích hợp kiểm tra thiên kiếp trong `executeVeinedAlchemyCraft` và `executeTacticalConcoction`.
     - Thêm xử lý `consumeVeinedPill` miễn nhiễm độc và x1.5 dược lực cho Tiên Thiên Thần Đan.
  4. **Custom Hooks & UI/UX Cổ Phong (`hooks/usePillTribulationActions.ts`, `components/modals/PillTribulationModal.tsx`, `components/tabs/AlchemyTab.tsx`):**
     - Xây dựng hook `usePillTribulationActions` điều phối state encounter, round logs, audio sfx, và kết thúc thiên kiếp.
     - Thiết kế component modal `PillTribulationModal.tsx`:
       - Hiệu ứng lôi vân cuồn cuộn, sấm sét tím/bạc nhấp nháy, đan lò rung lắc, viên đan phát quang giữa lốc xoáy lôi điện.
       - Thanh đo tiến độ đợt sấm sét (`⚡ ĐỢT X/Y: [Tên Sấm Sét]`).
       - 3 nút lựa chọn phòng thủ chiến thuật trực quan kèm số liệu sát thương, máu mất, linh thạch và trạng thái mệt mỏi của Đạo Lữ.
       - Hoạt cảnh kết quả thăng hoa Tiên Thiên Thần Đan và bé Đan Linh Nhi vector chibi đáng yêu chào đón chủ nhân.
     - Tích hợp vào `AlchemyTab.tsx` cho cả Lò Luyện truyền thống lẫn Bàn Nung Tứ Trụ Chiến Thuật.
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/pill-tribulation.ts` *(Tạo mới)*: Domain Types cho Đan Lôi Kiếp và Đan Linh.
  - `lib/types/index.ts` *(Sửa đổi)*: Export barrel cho pill-tribulation.
  - `lib/types/player.ts` *(Sửa đổi)*: Thêm trường `pillTribulationState` vào `PlayerStats`.
  - `lib/types/pill-veins.ts` *(Sửa đổi)*: Bổ sung `isPrimordial`, `primordialAura`, `tribulationTriggered`.
  - `lib/types/alchemy-tactics.ts` *(Sửa đổi)*: Bổ sung `tribulationTriggered` và `tribulationEncounter`.
  - `lib/pill-tribulation-logic.ts` *(Tạo mới)*: Pure logic engine cho toàn bộ phân hệ thiên kiếp và đan linh.
  - `lib/save-migration.ts` *(Sửa đổi)*: Migration chuẩn hóa an toàn `pillTribulationState`.
  - `lib/abode-logic.ts` *(Sửa đổi)*: Bổ sung helper `getDanSpiritsGrowthDiscount`.
  - `lib/pill-vein-logic.ts` *(Sửa đổi)*: Kích hoạt thiên kiếp trong `executeVeinedAlchemyCraft` và xử lý Tiên Thiên trong `consumeVeinedPill`.
  - `lib/alchemy-tactics-logic.ts` *(Sửa đổi)*: Tích hợp thiên kiếp vào `executeTacticalConcoction`.
  - `hooks/usePillTribulationActions.ts` *(Tạo mới)*: Custom hook điều phối lôi kiếp.
  - `hooks/useAlchemyTacticsActions.ts` *(Sửa đổi)*: Callback `onTribulationTrigger` kết nối lôi kiếp.
  - `components/modals/PillTribulationModal.tsx` *(Tạo mới)*: Modal cinematic cổ phong thiên kiếp.
  - `components/tabs/AlchemyTab.tsx` *(Sửa đổi)*: Tích hợp hook và render `PillTribulationModal`.
  - `scripts/test-pill-tribulation.ts` *(Tạo mới)*: Test suite độc lập 6 ca kiểm thử tự động.
  - `CHANGELOG.md` *(Sửa đổi)*: Cập nhật nhật ký phát triển theo chuẩn 5 phần.
- **Kết quả kiểm thử & Nghiệm thu chất lượng (Test Suite & Verification):**
  - `npx tsx scripts/test-pill-tribulation.ts`: **6/6 Tests Passed (100%)**:
    1. *Trigger Conditions Guard:* Tier 1-6 không kích hoạt; Tier 7 kích hoạt Tam Trọng đúng 35%; Tier 9 & 9 Văn 100% Cửu Trọng.
    2. *Defense Mitigation Invariant:* Hộ Trận triệt tiêu đúng 80% (8,000/10,000) và trừ 15,000 Linh Thạch; Đạo Lữ triệt tiêu 60% (6,000/10,000), +5 Hảo Cảm và nhận fatigue 1h.
    3. *Catastrophic Failure Handling:* Khi người chơi cạn kiệt HP/Linh Thạch, đan lò nổ an toàn, tạo Phế Đan Độc Dược (100 độc) không crash.
    4. *Primordial Pill Evolution:* Vượt thiên kiếp thành công thăng hoa 【Tiên Thiên Thần Đan】, Dược lực x1.5 (+50%), Đan độc = 0, mở khóa hào quang Tiên Thiên Hộ Thể.
    5. *Dan Linh Awakening & Abode Sync:* Thần đan hóa hình thành Đan Linh Nhi, tự động chuyển về Động Phủ buff Dược Viên +20%, Đan Văn +15, giảm nổ lò -10%.
    6. *Save Migration Invariant:* Save cũ chuẩn hóa an toàn 100%, chạy qua lôi kiếp mượt mà không lỗi undefined.
  - `npx tsx scripts/test-alchemy-tactics.ts`: **6/6 Tests Passed (100%)** - Không hồi quy.
  - `npx tsx scripts/test-heavenly-flame.ts`: **6/6 Tests Passed (100%)** - Không hồi quy.
  - `npx tsx scripts/test-pill-veins.ts`: **6/6 Tests Passed (100%)** - Không hồi quy.
  - `npx tsc --noEmit`: **0 Errors** (TypeScript Strict Mode hoàn toàn sạch).
  - `npm run build`: **Turbopack Build Succeeded (Exit code 0)**, static pages generated thành công.
- **Hướng dẫn trải nghiệm (User Guide & UI Flow):**
  - Luyện các loại đan phẩm cao cấp: Thất Giai $\rightarrow$ Cửu Giai, hoặc phối chế đạt 9 Đan Văn Cực Phẩm, hoặc mang Dược Tính Biến Dị.
  - Khi xuất lò, đất trời chuyển sắc, **Modal Đan Lôi Kiếp** tự động kích hoạt với hiệu ứng sấm sét chớp giật và đan lò rung lắc.
  - Đưa ra quyết định chiến thuật cho từng đợt sét:
    - Bấm **[⚡ Nhục Thân Ngạnh Kháng]** để tôi luyện kinh mạch (nhận Ngộ Tính + Tu Vi).
    - Bấm **[🌸 Đạo Lữ Xuất Thủ]** để Đạo Lữ tế bảo bối triệt tiêu 60% sát thương (+5 Hảo Cảm).
    - Bấm **[🏛️ Kích Hoạt Hộ Trận]** để tiêu hao Linh Thạch triệt tiêu 80% sát thương.
  - Khi vượt qua toàn bộ các đợt sét: Thu hoạch **【Tiên Thiên Thần Đan】** (+50% Dược lực, 0 Đan Độc) hoặc đón nhận **Đan Linh Nhi** hóa hình ngộ nghĩnh phụ giúp Động Phủ!

---

### [2026-10-03 12:40] - Triển Khai Toàn Diện Phân Hệ "Hỏa Hậu Chiến Thuật & Quy Tắc Quân - Thần - Tá - Sứ (Tactical Heat Stances & Herbal Archetype Matrix)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Luyện Đan trước đây vẫn phụ thuộc vào công thức đan phương cố định cứng nhắc (static recipes) và nhiệt độ nung lò chưa cho phép người chơi đưa ra quyết định chiến lược trước khi châm lửa.
  - Phân hệ mới mang triết lý Đông y tiên hiệp *"Quân - Thần - Tá - Sứ"* và *"Hỏa Hậu Tam Trọng"* vào game, biến mỗi mẻ đan thành bài toán phối chế chiến thuật sâu sắc:
    1. **Quy Tắc Tứ Trụ Dược Tính (Variable Recipe Matrix):**
       - **Quân Dược (Monarch Herb - Bắt buộc):** Thảo dược định hình bản chất đan (Tu Vi Đan, Đột Phá Đan, Huyết Khí Đan, Tẩy Tủy Đan).
       - **Thần Dược (Minister Herb - Khuếch đại):** Thảo dược cộng hưởng giúp nhân hệ số Dược Lực của Quân Dược (+20% đến +60% công hiệu, ví dụ Thiên Niên Linh Sâm +45%).
       - **Tá Dược (Assistant Herb - Điều hòa & triệt tiêu):** Thảo dược trung hòa hỏa tính, giúp triệt tiêu Đan Độc tích tụ (-30% đến -60% Toxicity, ví dụ Băng Linh Thảo -50%) và đè bẹp rủi ro nổ lò.
       - **Sứ Dược (Envoy Herb - Dẫn khí & khai văn):** Dẫn dắt dược lực vào kinh mạch, gia tăng mạnh tỷ lệ ngưng tụ Đan Văn cao cấp (+20% đến +40% tỷ lệ Đan Văn 6 - 9, ví dụ Tinh Thần Thảo +35%) hoặc định hướng thuộc tính nguyên tố biến dị (Lôi Kích Mộc dẫn khí Lôi).
    2. **Chiến Lược Hỏa Hầu Tam Trọng (Tactical Heat Stances):**
       - *Văn Hỏa (Gentle Simmer):* Nung chậm rãi ôn dưỡng; **Rủi ro nổ lò = 0% tuyệt đối**, giảm thêm 25% Đan Độc, cộng +25 điểm Đan Văn Cực Phẩm, batch cố định 1 mẻ.
       - *Vũ Hỏa (Fierce Blaze):* Nung cấp tốc cuồng nhiệt, cho phép **Luyện Hàng Loạt Tức Thì (Batch Craft: x5 hoặc x10 mẻ)**, tăng +15% dược lực, tăng cơ hội thưởng thêm sản lượng; bù lại Đan Độc cơ sở tăng +25% và rủi ro nổ lò tăng +15% (trừ khi có Tá Dược cực mạnh kiềm chế).
       - *Văn Vũ Tương Tế (Harmonious Dual-Phase):* Cân bằng hoàn hảo giữa tốc độ, dược lực và an toàn.
    3. **Bảo Tồn 4 Ràng Buộc Bất Biến (Hard Invariants):**
       - Bảo toàn tương thích ngược 100% với đan phương cũ `DEFAULT_DAN_RECIPES`.
       - Toàn bộ thuật toán hòa hợp ngũ hành (`calculateHerbHarmonyScore`), biến thiên theo Hỏa Hầu và batch craft nằm độc lập trong `lib/alchemy-tactics-logic.ts`.
       - Phòng vệ slot chống trùng lặp instance thảo dược và bảo lưu 50% nguyên liệu quý khi nổ lò.
       - Đồng bộ mượt mà với Đan Văn Engine (`pill-vein-logic.ts`) và Dị Hỏa Engine (`heavenly-flame-logic.ts`).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/alchemy-tactics.ts`, `lib/types/player.ts`):**
     - Khai báo: `HerbRoleType`, `TacticalHeatStance`, `HerbRoleMetadata`, `TacticalHerbSlot`, `ConcoctionSetup`, `ConcoctionPreviewResult`, `TacticalAlchemyExecutionResult`, `AlchemyTacticsState`.
     - Bổ sung `alchemyTacticsState?: AlchemyTacticsState` vào `PlayerStats`.
  2. **Pure Business Logic Engine (`lib/alchemy-tactics-logic.ts`):**
     - Khai báo `HERB_ROLE_REGISTRY` cho toàn bộ thảo dược theo 4 vai trò Quân, Thần, Tá, Sứ với ngũ hành tương ứng.
     - Hàm `calculateHerbHarmonyScore`: đánh giá tương sinh tương khắc ngũ hành (Mộc sinh Hỏa, Thủy khắc Hỏa...) tính điểm hòa hợp 0 - 100%.
     - Hàm `applyHeatStanceModifiers`: điều chỉnh chỉ số theo Văn Hỏa, Vũ Hỏa, Văn Vũ Tương Tế.
     - Hàm `previewConcoction`: Zero-latency HUD tính toán trước Dược Lực, Đan Độc, Điểm Đan Văn, Nguy cơ nổ lò và nguyên liệu yêu cầu.
     - Hàm `executeTacticalConcoction`: trừ nguyên liệu nguyên tử, kiểm tra nổ lò, bảo lưu 50% nguyên liệu quý khi nổ lò ở Vũ Hỏa, tạo Phế Đan, quay Đan Văn 0-9 và ghi nhận lịch sử phối chế.
  3. **Tích Hợp Save Migration & Engine Đan Dược (`lib/save-migration.ts`, `lib/pill-vein-logic.ts`):**
     - Bổ sung `migrateAlchemyTacticsData` và tích hợp vào `normalizePlayerData`, tự động bổ sung `player.alchemyTacticsState: { defaultStance: 'van_vu_song_hanh', customConcoctionsHistory: [] }` khi nạp save cũ.
     - Mở rộng hàm `executeVeinedAlchemyCraft` nhận tham số `tacticalSetup` cho phép kết hợp chiến thuật Quân - Thần - Tá - Sứ.
  4. **Custom Hooks & UI/UX Cổ Phong (`hooks/useAlchemyTacticsActions.ts`, `components/tabs/AlchemyTacticsPanel.tsx`, `components/tabs/AlchemyTab.tsx`):**
     - Xây dựng hook `useAlchemyTacticsActions` điều phối toàn bộ state, preview, gán thảo dược theo slot, đổi hỏa hầu, chọn batch và nhóm lửa.
     - Thiết kế giao diện `AlchemyTacticsPanel.tsx`:
       - **Bàn Nung Bát Quái Tứ Trụ:** 4 ô trận nhãn bao quanh đỉnh lò: Ô Bắc (👑 Quân Dược - Viền Vàng), Ô Đông (⚔️ Thần Dược - Viền Đỏ Chu Sa), Ô Tây (🛡️ Tá Dược - Viền Xanh Lam Ngọc), Ô Nam (📜 Sứ Dược - Viền Tím Huyền Ảo).
       - **Drawer Chọn Thảo Dược:** Lọc thảo dược từ Túi Trữ Vật theo vai trò khuyến nghị, hiển thị rõ số lượng và thuộc tính.
       - **Bộ Chọn Hỏa Hậu Tam Trọng:** 3 thẻ bài Văn Hỏa (Khói lam thanh tịnh), Văn Vũ Tương Tế (Thái Cực âm dương), Vũ Hỏa (Lửa đỏ bạo nhiệt) + Bộ chọn Batch x1, x5, x10.
       - **Telemetry HUD Bảng Dự Toán Thiên Cơ:** Vòng tròn Đo Điểm Hòa Hợp (0-100%), HUD chỉ số Dược Lực, Đan Độc, Điểm Đan Văn, Nguy cơ nổ lò và nút "Nhóm Lò Nung Đan".
- **Danh sách tệp tin tạo mới & sửa đổi (Files Affected):**
  - `lib/types/alchemy-tactics.ts` *(Tạo mới)*: Domain Types cho Tứ Trụ Dược Tính, Hỏa Hậu và kết quả phối chế.
  - `lib/types/index.ts` *(Sửa đổi)*: Barrel export cho alchemy-tactics.
  - `lib/types/player.ts` *(Sửa đổi)*: Bổ sung trường `alchemyTacticsState` trong `PlayerStats`.
  - `lib/alchemy-tactics-logic.ts` *(Tạo mới)*: Pure logic tính toán tương sinh tương khắc, Hỏa Hầu modifier, preview và execute.
  - `lib/save-migration.ts` *(Sửa đổi)*: Migration tự động chuẩn hóa `alchemyTacticsState`.
  - `lib/pill-vein-logic.ts` *(Sửa đổi)*: Tích hợp tham số `tacticalSetup` vào `executeVeinedAlchemyCraft`.
  - `hooks/useCraftingActions.ts` *(Sửa đổi)*: Bổ sung subtab `'tactics'` vào `alchemySubTab`.
  - `hooks/useAlchemyTacticsActions.ts` *(Tạo mới)*: Custom hook điều phối hành động phối ngũ chiến thuật.
  - `components/tabs/AlchemyTacticsPanel.tsx` *(Tạo mới)*: Giao diện Bàn Nung Bát Quái Tứ Trụ & Bộ Chọn Hỏa Hầu Cổ Phong.
  - `components/tabs/AlchemyTab.tsx` *(Sửa đổi)*: Tích hợp Sub-tab "Phối Ngũ Tứ Trụ", banner chuyển đổi và liên kết modal thu hoạch.
  - `scripts/test-alchemy-tactics.ts` *(Tạo mới)*: Bộ test suite độc lập 6 ca kiểm thử tự động.
  - `CHANGELOG.md` *(Sửa đổi)*: Ghi nhận nhật ký phát triển theo chuẩn 5 phần.
- **Kết quả kiểm thử & Nghiệm thu chất lượng (Test Suite & Verification):**
  - `npx tsx scripts/test-alchemy-tactics.ts`: **6/6 Tests Passed (100%)**:
    1. *Monarch Herb Requirement Guard:* Chặn đứng khi thiếu Quân Dược, chỉ nhóm lò khi có Quân Dược hợp lệ.
    2. *Minister Herb Potency Amplification:* Thiên Niên Linh Sâm tăng chính xác +45% Dược Lực (1,000 -> 1,450).
    3. *Assistant Herb Suppression:* Băng Linh Thảo triệt tiêu 50% Đan Độc (20 -> 10) và dập tắt nguy cơ nổ lò Vũ Hỏa về đúng 0%.
    4. *Envoy Herb Vein Catalyst:* Tinh Thần Thảo cộng chuẩn xác +35 điểm Đan Văn, thúc đẩy thăng tầng Đan Văn.
    5. *Stance Modulation & Batch Craft:* Văn Hỏa ép nổ lò = 0% và trừ tiếp 25% Đan Độc; Vũ Hỏa x5 tiêu hao đúng x5 nguyên liệu và xuất lò chuẩn xác 5 viên.
    6. *Save Migration Invariant:* Save cũ tự động chuẩn hóa dữ liệu an toàn, các chức năng đan dược chạy trơn tru không lỗi.
  - `npx tsx scripts/test-heavenly-flame.ts`: **6/6 Tests Passed (100%)** - Không phát sinh hồi quy.
  - `npx tsx scripts/test-pill-veins.ts`: **6/6 Tests Passed (100%)** - Không phát sinh hồi quy.
  - `npx tsc --noEmit`: **0 Errors** (TypeScript Strict Mode hoàn toàn sạch).
  - `npm run build`: **Turbopack Build Succeeded (Exit code 0)**, static pages generated thành công.
- **Hướng dẫn trải nghiệm (User Guide & UI Flow):**
  - Vào tab **Luyện Đan**, bấm nút Sub-tab **"Phối Ngũ Tứ Trụ"** (hoặc bấm banner chuyển đổi trên đỉnh lò truyền thống).
  - Bấm ô **[Quân Dược]** để chọn thảo dược chủ chốt định hình đan dược (Ngân Hạnh Thảo, Huyết Tinh Thảo, Cửu Diệp Chi...).
  - Chọn thêm các slot tùy chọn **[Thần Dược]** (tăng công hiệu), **[Tá Dược]** (giảm độc, trừ nổ lò) và **[Sứ Dược]** (tăng đan văn, dẫn khí lôi).
  - Chọn 1 trong 3 thế Hỏa Hầu: **Văn Hỏa** (an toàn 0% nổ lò, siêu sạch độc), **Văn Vũ Tương Tế** (cân bằng) hoặc **Vũ Hỏa** (luyện hàng loạt Batch x5/x10).
  - Theo dõi **Bảng Dự Toán Thiên Cơ** & **Thanh Điểm Hòa Hợp**, sau đó bấm **"Nhóm Lò Nung Đan"** để thu hoạch đan dược chiến thuật!

---

### [2026-10-03 12:25] - Triển Khai Toàn Diện Phân Hệ "Thuần Phục & Ôn Dưỡng Thiên Địa Dị Hỏa (Heavenly Flame System)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Sau khi phân hệ Đan Văn Cửu Trọng và Dược Tính Biến Dị được hoàn thiện, cơ chế nhiệt độ lò luyện đan vẫn chỉ dừng ở mức kiểm tra cấp bậc Đan Lò tĩnh, thiếu đi linh hồn thực sự của đan đạo tiên hiệp: **Thiên Địa Dị Hỏa (Heavenly Flames)**.
  - Nhiệm vụ đặt ra là thiết kế, triển khai và kiểm thử toàn diện tính năng: biến ngọn lửa trong đan phòng thành một thực thể sống có thể săn lùng mồi lửa, dung hợp, ôn dưỡng thăng giai (Nhất Giai -> Cửu Giai) và tác động trực tiếp vào từng mẻ đan:
    1. **Bảng Danh Mục Dị Hỏa (Heavenly Flame Registry):**
       - *Thanh Liên Địa Tâm Hỏa (Hỏa Ôn Hòa - Hệ Mộc/Hỏa):* Thiêu rụi 40% Đan Độc gốc trong lò trước khi xuất xưởng, +25 điểm Đan Văn (tăng xác suất 6-9 Văn), 0% nguy cơ nổ lò.
       - *Bạo Liệt Xích Lôi Viêm (Hỏa Bạo Liệt - Hệ Lôi/Hỏa):* Nhân đôi sản lượng đan dược xuất lò (x2 Yield), đi kèm 15% rủi ro nổ lò.
       - *U Minh Ma Hỏa (Hỏa Biến Dị - Hệ Tà/Âm):* Rút từ cửu u ma quật, thiêu rụi 15% Đan Độc, nhân x2.0 lần xác suất Dược Tính Biến Dị khi kết hợp Phụ Liệu Xúc Tác.
       - *Thái Sơ Hỗn Độn Viêm (Hỏa Tối Thượng - Hệ Hỗn Độn):* Vạn hỏa chi tổ, dung hợp mọi đặc tính: thiêu rụi 50% Đan Độc, x2 sản lượng, nhân x2.5 lần tỷ lệ biến dị, +40 điểm Đan Văn, 0% nổ lò.
       - *Phàm Hỏa Cơ Bản (Default Mortal Flame):* Fallback an toàn khi chưa trang bị Dị Hỏa (hệ số x1.0, không trừ độc, không nổ lò).
    2. **Cơ Chế Ôn Dưỡng & Tiến Hóa Dị Hỏa (Flame Nourishment & Leveling):**
       - Cho Dị Hỏa hấp thụ Khoáng Thạch quý (Thiết Tinh, Hỏa Tinh Thạch, Tinh Thần Sa, v.v.) hoặc trực tiếp trích xuất Chân Nguyên / Tu Vi của người chơi để tăng EXP.
       - Thăng cấp từ Nhất Giai -> Cửu Giai, mở khóa 3 tầng Aura Đan Đạo thụ động (Tier 3, Tier 6, Tier 9).
       - Chặn trần chuẩn xác tại Cửu Giai (Tier 9 Max), phòng vệ tràn số khi tiếp tục cho ăn.
    3. **Phòng Vệ Nổ Lò Nguyên Tử (Atomic Explosion Guard):**
       - Khi xảy ra biến cố Nổ Lò ở Hỏa Bạo Liệt: Hệ thống xử lý nguyên tử, bảo toàn hoàn trả 50% thảo dược nguyên liệu gốc vào túi và tạo Phế Đan, tuyệt đối không gây crash vòng lặp luyện đan.
    4. **Đồng Bộ Hai Chiều Với Engine Đan Văn & Đan Độc:**
       - Thiêu hủy Đan Độc đồng bộ trực tiếp vào `veinMetadata.toxicityBurnPercent` và lưu vào đan dược, đảm bảo khi người chơi uống thuốc thì mức tăng `player.pillToxicity` được chiết giảm chính xác theo cả Đan Văn lẫn Dị Hỏa.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/heavenly-flame.ts`, `lib/types/player.ts`, `lib/types/pill-veins.ts`):**
     - Khai báo types: `FlameArchetype`, `FlameTier`, `FlameAuraEffect`, `HeavenlyFlameConfig`, `PlayerFlameInstance`, `HeavenlyFlameState`.
     - Bổ sung `flameState?: HeavenlyFlameState` vào `PlayerStats`.
     - Mở rộng `VeinedPillMetadata` với `toxicityBurnPercent?: number`, `flameId?: string`.
     - Mở rộng `PillCraftingResult` với `isExploded?: boolean`.
  2. **Pure Business Logic Engine (`lib/heavenly-flame-logic.ts`):**
     - Đăng ký `HEAVENLY_FLAMES_REGISTRY` và `DEFAULT_MORTAL_FLAME`.
     - Triển khai `feedHeavenlyFlame`: ôn dưỡng bằng quặng hoặc tu vi, tính toán EXP theo phẩm cấp, tự động thăng cấp và kích hoạt Auras, kẹp trần Tier 9 an toàn.
     - Triển khai `applyFlameToAlchemyProcess`: thẩm định nổ lò, chiết giảm đan độc gốc, nhân đôi sản lượng, khuếch đại xác suất dị biến và phẩm chất đan văn.
     - Triển khai `unlockHeavenlyFlame` và `createDefaultHeavenlyFlameState`.
  3. **Tích Hợp Engine Luyện Đan & Save Migration (`lib/pill-vein-logic.ts`, `lib/save-migration.ts`):**
     - Nâng cấp `executeVeinedAlchemyCraft` liên kết trực tiếp `applyFlameToAlchemyProcess`. Xử lý an toàn khi nổ lò hoàn trả 50% thảo dược gốc và chuyển hóa thành Phế Đan.
     - Cập nhật `consumeVeinedPill` áp dụng chiết giảm đan độc hai tầng (`baseToxicity * (1 - toxicityBurnPercent/100) * toxicityMultiplier`).
     - Viết `migrateHeavenlyFlameData` trong `lib/save-migration.ts`, tự động bổ sung `player.flameState: { unlockedFlames: {}, equippedFlameId: null }` khi nạp save cũ.
  4. **Custom Hooks & UI/UX Cổ Phong (`hooks/useHeavenlyFlameActions.ts`, `components/tabs/HeavenlyFlamePanel.tsx`, `components/tabs/AlchemyTab.tsx`, `components/modals/PillHarvestModal.tsx`):**
     - Xây dựng hook `useHeavenlyFlameActions` với các actions: `handleEquipFlame`, `handleFeedFlameWithOre`, `handleFeedFlameWithTuVi`, `handleUnlockFlame`.
     - Thiết kế component đồ họa `ProceduralFlameSvg` ngọn lửa động đa tầng theo phong cách tu tiên cổ phong bằng CSS keyframes và SVG gradients.
     - Xây dựng Sub-tab "Thiên Địa Dị Hỏa" (`HeavenlyFlamePanel.tsx`) với thẻ bài Dị Hỏa ngũ sắc, thanh EXP, danh sách Aura, modal chọn khoáng thạch và modal truyền chân nguyên.
     - Tích hợp khay Đổi Dị Hỏa nhanh và hiển thị trạng thái ngọn lửa ngay dưới Đan Lô (`cauldron`).
     - Cập nhật `PillHarvestModal.tsx` hiển thị badge Dị Hỏa trợ lực và giao diện cảnh báo Nổ Lò khi Dị Hỏa bạo liệt mất kiểm soát.
- **Danh mục tệp thay đổi (Files Changed):**
  - `lib/types/heavenly-flame.ts`: Định nghĩa Domain Types cho Dị Hỏa.
  - `lib/types/index.ts`: Barrel export cho heavenly-flame types.
  - `lib/types/player.ts`: Bổ sung `flameState` vào `PlayerStats`.
  - `lib/types/pill-veins.ts`: Mở rộng `VeinedPillMetadata` và `PillCraftingResult`.
  - `lib/heavenly-flame-logic.ts`: Pure business logic cho Dị Hỏa (Registry, Nourishment, Alchemy Proc).
  - `lib/pill-vein-logic.ts`: Tích hợp Dị Hỏa vào thuật toán luyện đan và uống đan.
  - `lib/save-migration.ts`: Idempotent save migration `migrateHeavenlyFlameData`.
  - `hooks/useHeavenlyFlameActions.ts`: Custom hook điều phối Dị Hỏa.
  - `hooks/useCraftingActions.ts`: Mở rộng subtab 'flames'.
  - `hooks/usePillVeinAlchemyActions.ts`: Tích hợp flame bonus vào dự toán thiên cơ và xử lý nổ lò.
  - `components/tabs/HeavenlyFlamePanel.tsx`: Component giao diện Đan Hỏa Các và Procedural Flame SVG.
  - `components/tabs/AlchemyTab.tsx`: Tích hợp ngọn lửa động, đổi Dị Hỏa, subtab Dị Hỏa.
  - `components/modals/PillHarvestModal.tsx`: Giao diện thu hoạch đan dược và cảnh báo Nổ Lò.
  - `scripts/test-heavenly-flame.ts`: Test suite tự động 6 ca kiểm thử.
  - `CHANGELOG.md`: Cập nhật nhật ký phát triển.
- **Kết quả kiểm thử & Nghiệm thu (Verification & Results):**
  - `npx tsx scripts/test-heavenly-flame.ts`: **6/6 TESTS PASSED (100%)**.
    - Test 1: Hỏa Ôn Hòa thiêu rụi chuẩn xác 40% Đan Độc gốc (15% -> 9%), tăng xác suất đan văn cao cấp.
    - Test 2: Hỏa Bạo Liệt nhân đôi sản lượng x2; khi nổ lò hoàn trả 50% nguyên liệu, sinh Phế Đan an toàn.
    - Test 3: Hỏa Biến Dị nhân hệ số x2.0 tỷ lệ xuất hiện dị biến (35% -> 70%).
    - Test 4: Cho ăn khoáng thạch/tu vi tăng EXP, thăng cấp mở khóa Aura, cắn trần chuẩn xác tại Tier 9 Max.
    - Test 5: Fallback Phàm Hỏa khi chưa trang bị Dị Hỏa, đổi Dị Hỏa zero-latency không mang tàn dư buff.
    - Test 6: Save cũ không có `flameState` tự động migrate an toàn 100%, nung đan mượt mà không lỗi.
  - `npx tsx scripts/test-pill-veins.ts`: **6/6 TESTS PASSED (100%)** (Không có regression).
  - `npx tsc --noEmit`: **0 ERRORS (Strict Type Safety 100%)**.
  - `npm run build`: **Turbopack Production Build thành công 100%**.
- **Hướng dẫn trải nghiệm người dùng (Player Walkthrough):**
  1. Vào tab **Luyện Đan**, chọn sub-tab **Thiên Địa Dị Hỏa** để chiêm ngưỡng các ngọn Dị Hỏa trong thiên địa.
  2. Bấm **Dung Hợp Mồi Lửa** để kích hoạt *Thanh Liên Địa Tâm Hỏa*, *Bạo Liệt Xích Lôi Viêm*, *U Minh Ma Hỏa* hoặc *Thái Sơ Hỗn Độn Viêm*.
  3. Bấm **Khảm Vào Lò** để dẫn ngọn lửa vào lò nung đan.
  4. Trở về sub-tab **Đan Lô & Đan Văn**: Chiêm ngưỡng ngọn lửa động phát quang (Procedural Animated Flame) cuộn sóng bên dưới bàn nung với màu sắc đặc trưng của Dị Hỏa.
  5. Bấm **[💎 Nuôi Bằng Khoáng Thạch]** hoặc **[⚡ Truyền Chân Nguyên]** để nuôi Dị Hỏa thăng từ Nhất Giai lên Cửu Giai, mở khóa các dòng Aura đan đạo cực phẩm.
  6. Tiến hành luyện đan: Dị Hỏa Ôn Hòa sẽ thanh tẩy độc tố, Dị Hỏa Bạo Liệt nhân đôi số đan (kèm rủi ro nổ lò an toàn thu hồi 50% dược liệu), Dị Hỏa Biến Dị tạo ra các viên tiên đan đột biến chỉ số vĩnh viễn!

### [2026-10-03 11:45] - Triển Khai Toàn Diện Phân Hệ "Phân Tầng Đan Văn & Dược Tính Biến Dị (Pill Veins System & Mutagenic Potions)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Luyện Đan (Alchemy) trước đây vận hành theo cơ chế đổi nguyên liệu lấy thành phẩm cố định: cùng một đan phương luôn cho ra các viên đan có cùng chỉ số và tích tụ một lượng Đan Độc (`pillToxicity`) cố định. Điều này làm giảm giá trị của tay nghề luyện đan, triệt tiêu yếu tố bất ngờ và khiến người chơi cấp cao e ngại cắn thuốc vì sợ tràn Đan Độc làm tắc nghẽn kinh mạch.
  - Triển khai hoàn tất tính năng **"Phân Tầng Đan Văn & Dược Tính Biến Dị (Pill Veins System & Mutagenic Potions)"**:
    1. **Hệ Thống Đan Văn Cửu Trọng (0 - 9 Pill Veins):**
       - Mọi viên đan khi luyện thành được định phẩm từ **0 Đan Văn** (Hạ Phẩm / Phàm Đan) đến **9 Đan Văn** (Cực Phẩm Viên Mãn - Cửu Khổng Thần Đan).
       - Tầng Đan Văn càng cao, Dược Lực càng mạnh (+15% đến +100%) và Đan Độc tích tụ càng giảm:
         - *0 Đan Văn (Hạ Phẩm):* 100% Đan Độc, 100% Dược Lực cơ bản.
         - *1 - 2 Đan Văn (Sơ Phẩm):* Giảm 20% Đan Độc, tăng +15% Dược Lực.
         - *3 - 5 Đan Văn (Trung Phẩm):* Giảm 50% Đan Độc, tăng +40% Dược Lực.
         - *6 - 8 Đan Văn (Thượng Phẩm):* Giảm 80% Đan Độc, tăng +75% Dược Lực.
         - *9 Đan Văn (Cửu Khổng Thần Đan):* **Đan Độc = 0%** (Hoàn toàn tinh khiết), Dược Lực nhân đôi (+100%), hấp thu 100% vào kinh mạch không để lại tạp chất.
    2. **Dược Tính Biến Dị Thiên Phú (Medicinal Mutagenesis):**
       - Bàn luyện đan bổ sung thêm **1 Slot Dược Dẫn Biến Dị (Auxiliary Catalyst)**: Cho phép đặt phụ liệu hiếm (*Huyết Tinh Ma Thú, Thần Thú Nội Đan, Thái Cổ Tinh Thần Sa, Ngũ Hành Tinh Thạch*).
       - Khi phối hợp phụ liệu, mẻ đan có xác suất sinh ra **Dược Tính Biến Dị**:
         - *Đan biến dị Thể Phách (từ Thú Đan/Huyết Tinh):* Tăng vĩnh viễn +0.5% Máu tối đa hoặc +0.3% Hút máu.
         - *Đan biến dị Thần Thức (từ Tinh Thần Sa):* Tăng vĩnh viễn +0.5% Tốc độ xuất chiêu hoặc +1% Kháng bạo kích.
         - *Đan biến dị Ngũ Hành (từ Ngũ Hành Tinh Thạch):* Tăng vĩnh viễn +1% Kháng nguyên tố tương ứng (Kháng Hỏa/Lôi/Băng).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/pill-veins.ts`, `lib/types/items.ts`, `lib/types/player.ts`):**
     - Khai báo các types: `PillVeinTier`, `MutagenicAffixType`, `PillMutationData`, `VeinedPillMetadata`, `CatalystItemConfig`, `PillCraftingResult`.
     - Bổ sung `veinMetadata?: VeinedPillMetadata` và `isMutated?: boolean` vào interface `Pill`.
     - Bổ sung `consumedMutations?: Partial<Record<MutagenicAffixType, number>>` vào `PlayerStats`.
  2. **Pure Business Logic Engine (`lib/pill-vein-logic.ts`):**
     - Bảng tra cứu `PILL_VEIN_CONFIG` cho 10 bậc Đan Văn (0 đến 9), hệ số nhân Dược Lực (x1.0 -> x2.0) và tỷ lệ Đan Độc (1.0 -> 0.0).
     - Khai báo trần cứng `MUTATION_HARD_CAPS` chống lạm phát chỉ số (Máu tối đa +20%, Hút máu +10%, Tốc độ +15%, Kháng bạo kích +25%, Kháng nguyên tố +15%).
     - Đăng ký danh mục phụ liệu xúc tác `CATALYST_REGISTRY` (*catalyst_thu_dan, catalyst_huyet_tinh, catalyst_tinh_than_sa, catalyst_ngu_hanh_hoa, catalyst_ngu_hanh_loi, catalyst_ngu_hanh_bang*).
     - Thuật toán `calculateVeinRoll` với xác suất có trọng số dựa trên Cảnh Giới, Cấp Đan Đạo, Lò Nung và Điểm Phụ Liệu.
     - Hàm `rollPillMutation` tính toán xác suất đột biến (cơ sở 5% + bonus phụ liệu + bonus đan văn).
     - Hàm `executeVeinedAlchemyCraft` thẩm định nguyên liệu, khấu trừ phụ liệu và sinh đan dược kèm metadata đan văn.
     - Hàm `consumeVeinedPill` xử lý nuốt đan, tăng tu vi, cộng đan độc, kích hoạt biến dị kẹp trần và tự động điều hòa kinh mạch.
  3. **Tích Hợp Save Migration & Combat Engine:**
     - `lib/save-migration.ts`: Triển khai `migratePillVeinData` và tích hợp vào `normalizePlayerData`. Tự động chuẩn hóa đan dược cũ sang `veinCount: 0, veinMultiplier: 1.0, toxicityMultiplier: 1.0`, khởi tạo an toàn `player.consumedMutations: {}`.
     - `lib/destiny-data.ts`: Quét `player.consumedMutations` trong `calculateCombatStats`, cộng dồn trực tiếp các thuộc tính vĩnh viễn (Kháng nguyên tố, Máu %, Hút máu, Tốc độ xuất chiêu, Kháng bạo kích) vào bảng chiến đấu thực tế.
     - `hooks/useCraftingActions.ts`: Tích hợp tự động nhận diện đan dược có `veinMetadata` trong `handleConsumePill`.
  4. **Custom Hook & UI/UX Cổ Phong (`hooks/usePillVeinAlchemyActions.ts`, `components/tabs/AlchemyTab.tsx`, `components/modals/PillHarvestModal.tsx`):**
     - Hook `usePillVeinAlchemyActions`: Điều phối trạng thái chọn phụ liệu, dự toán thiên cơ và mở Modal Xuất Lò.
     - Giao diện Bàn Nung Hỏa Đỉnh: Slot khảm nạp phụ liệu xúc tác, khay chọn phụ liệu từ túi đồ, thanh dự toán xác suất đa sắc (0 -> 9 Văn) và tỷ lệ Dị Biến.
     - Card Đan Dược: Viền phát quang gradient theo số Đan Văn, badge Cực Phẩm Viên Mãn `[9 ĐAN VĂN • 0% ĐAN ĐỘC • X2 DƯỢC LỰC]` viền hoàng kim, badge Dị Biến Thiên Phú xanh ngọc bích.
     - Modal Xuất Lò Đan Dược (`PillHarvestModal`): Hiệu ứng luồng đan khí ngũ sắc, các vòng đan văn xoay quanh ngọc đan và hiển thị chi tiết hiệu năng đan dược.
     - Dược Phố: Bổ sung quầy bán Trân Phẩm Phụ Liệu Biến Dị mua bằng Linh Thạch để trải nghiệm ngay.
- **4 Ràng buộc bất biến (Hard Invariants) & Kết quả kiểm chứng:**
  - *Invariant 1 (Bảo Toàn Save Game & Idempotent Migration):* Tương thích ngược 100% với save cũ; nạp mock save legacy chuẩn hóa an toàn đan dược cũ và khởi tạo `consumedMutations: {}` mà không gây lỗi `undefined`.
  - *Invariant 2 (Kiến Trúc Tách Biệt Tuyệt Đối):* 100% thuật toán tính xác suất Đan Văn, chiết giảm Đan Độc, hệ số nhân Dược Lực và kích hoạt Biến Dị nằm độc lập trong `lib/pill-vein-logic.ts`.
  - *Invariant 3 (Phòng Vệ Giới Hạn Biến Dị):* Đan 9 Văn luôn có `addedToxicity === 0`. Cắn liên tục 50 viên đan biến dị chỉ số dừng lại chuẩn xác tại ngưỡng trần Hard Cap (Máu +20%).
  - *Invariant 4 (Đồng Bộ Hai Chiều Với Đan Độc & Combat Engine):* Đan độc và độ tinh khiết kinh mạch được cập nhật chính xác; các chỉ số biến dị cộng dồn thông suốt vào `calculateCombatStats`.
- **Danh mục tệp thay đổi (Files Changed):**
  - Mới: `lib/types/pill-veins.ts` (Domain Types cho Đan Văn & Dược Tính Biến Dị).
  - Mới: `lib/pill-vein-logic.ts` (Pure Business Logic Engine).
  - Mới: `hooks/usePillVeinAlchemyActions.ts` (Custom Hook điều phối tương tác Luyện Đan Đan Văn).
  - Mới: `components/modals/PillHarvestModal.tsx` (Modal Xuất Lò Đan Dược Cổ Phong).
  - Mới: `scripts/test-pill-veins.ts` (Test Suite tự động bao phủ 6/6 test cases).
  - Sửa đổi: `lib/types/items.ts` (Mở rộng interface `Pill` với `veinMetadata` và `isMutated`).
  - Sửa đổi: `lib/types/player.ts` (Bổ sung `consumedMutations` vào `PlayerStats`).
  - Sửa đổi: `lib/types/index.ts` (Export `pill-veins`).
  - Sửa đổi: `lib/save-migration.ts` (Thêm `migratePillVeinData`, chuẩn hóa `pills` và `consumedMutations` trong `normalizePlayerData`).
  - Sửa đổi: `lib/destiny-data.ts` (Tích hợp `consumedMutations` vào `calculateCombatStats`).
  - Sửa đổi: `hooks/useCraftingActions.ts` (Tích hợp `consumeVeinedPill` vào `handleConsumePill`).
  - Sửa đổi: `components/tabs/AlchemyTab.tsx` (Bổ sung Slot Phụ Liệu, Bảng Dự Toán Thiên Cơ, Card Đan Văn và quầy Phụ Liệu Dược Phố).
  - Sửa đổi: `components/modals/index.ts` (Export `PillHarvestModal`).
  - Sửa đổi: `components/GameDashboard.tsx` (Truyền thêm callbacks cho `AlchemyTab`).


### [2026-10-03 11:15] - Triển Khai Toàn Diện Phân Hệ "Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh (Secret Realm Map Fragments & Ancient Dungeons)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tính năng **Thiên Địa Nhập Định (Meditation & Event Journal)** đã có hệ thống sự kiện kỳ ngộ theo từng mốc giờ (nhặt quặng, đụng độ yêu ma, đốn ngộ thơ ca). Tuy nhiên, các phần thưởng kỳ ngộ trước đây vẫn mang tính vụn vặt (vài viên đá, vài cây cỏ), chưa tạo ra mục tiêu thu thập tích lũy dài hạn qua nhiều phiên AFK.
  - Triển khai hoàn tất phân hệ **"Mảnh Tàn Đồ Kỳ Ngộ & Thượng Cổ Bí Cảnh (Secret Realm Map Fragments & Ancient Dungeons)"**:
    1. **Rơi Rớt Mảnh Tàn Đồ Từ Kỳ Ngộ (Fragment Drop Engine):** Các mốc giờ nhập định có tỷ lệ rơi ra các mảnh **Tàn Đồ Cổ Đại** gồm 4 mảnh: *Đông [I], Tây [II], Nam [III], Bắc [IV]*. Tỷ lệ cơ sở 3%/giờ, tăng lên 6% ở thế *Hiểm Cảnh Đoạt Vận*, tăng thêm 3% tại các cổ chiến trường (*Thần Ma Cổ Chiến Trường*, *Hỏa Diễm Thiên Sơn*).
    2. **Sa Bàn Ghép Tàn Đồ Bát Hoang (Jigsaw Synthesis Altar):** Khi thu thập đủ bộ 4 mảnh cùng di tích (*Đông - Tây - Nam - Bắc*), người chơi tiêu hao Linh Thạch để hợp nhất thành **Bí Đồ Hoàn Chỉnh** (Ví dụ: *Thái Cổ Kiếm Chủng Bí Đồ*, *Chân Long Di Tích Cổ Quyển*, *Hỗn Độn Tiên Phủ Bí Lục*).
    3. **Khai Mở Phó Bản Cổ Đại Độc Bản (Exclusive Ancient Dungeon Instance):** Kích hoạt Bí Đồ khai mở không gian phó bản tồn tại trong đúng 2 giờ thực tế (`expiresAt = Date.now() + 2 * 3600 * 1000`). Phó bản gồm 3 tầng ải thử thách leo thang: *Ải 1: Cổ Trận Đài* ➔ *Ải 2: Thủ Hộ Dị Thú* ➔ *Ải 3: Tàn Niệm Tiên Nhân (Boss)*.
    4. **Kho Báu Thần Binh & Dị Bảo Thiên Giai (High-Tier Relic Vault):** Hạ gục Boss Ải 3 bảo đảm rơi 100% chiến lợi phẩm tối thượng trực tiếp vào túi trữ vật: Thần Binh *Thái Cổ Tru Tiên Kiếm (Phôi)*, Dị Bảo *Thái Hư Long Châu*, Thần Binh *Hỗn Độn Khai Thiên Phủ*, kèm hàng vạn Linh Thạch và nguyên liệu rèn đúc cổ xưa.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/ancient-map-dungeon.ts`, `lib/types/player.ts`, `lib/types/meditation.ts`):**
     - Khai báo các types: `FragmentDirection`, `AncientDungeonTier`, `MapFragmentItem`, `CompleteAncientMapItem`, `AncientDungeonStage`, `GuaranteedDivineReward`, `AncientDungeonInstance`, `AncientMapVaultState`, `AncientMapSetDefinition`.
     - Bổ sung `ancientMapVault?: AncientMapVaultState` vào `PlayerStats`.
     - Bổ sung `mapFragmentsLooted?: MapFragmentItem[]` vào `MeditationProgressResult`.
  2. **Pure Business Logic Engine (`lib/ancient-map-dungeon-logic.ts`):**
     - Đăng ký 3 đại di tích cổ đại trong `ANCIENT_MAP_SETS_REGISTRY`: *Thái Cổ Kiếm Chủng* (Tier 2 - Kim Đan), *Chân Long Di Tích* (Tier 3 - Nguyên Anh), *Hỗn Độn Tiên Phủ* (Tier 4 - Hóa Thần).
     - Triển khai `rollMeditationMapFragment`: Tính toán RNG và lọc bộ di tích theo cảnh giới người chơi.
     - Triển khai `synthesizeAncientMap`: Thẩm định nghiêm ngặt đủ 4 mảnh khác nhau cùng bộ, trừ nguyên tử và ngưng tụ 1 Bí Đồ hoàn chỉnh.
     - Triển khai `openAncientDungeonInstance`: Kiểm tra phó bản đang mở, thẩm định cảnh giới, khấu trừ Bí Đồ và khởi tạo 3 tầng ải với hạn giờ 2 tiếng.
     - Triển khai `resolveDungeonStageBattle`: Kết nối với combat engine `battleBoss`, giải quyết tuần tự từng ải và kết toán Thần Binh vào kho đồ người chơi khi diệt Boss cuối.
  3. **Tích Hợp Save Migration & Engine Nhập Định:**
     - `lib/save-migration.ts`: Triển khai `migrateAncientMapDungeonData` và tích hợp vào `normalizePlayerData`, tự động dọn dẹp phó bản quá hạn và bảo toàn kho mảnh tàn đồ.
     - `lib/meditation-logic.ts`: Gọi `rollMeditationMapFragment` trong vòng lặp mốc giờ của `resolveOfflineMeditationProgress`, in chiến báo viền hoàng kim `📜 [KỲ NGỘ BẢO ĐỒ]` và tự động đưa mảnh vào `player.ancientMapVault.fragmentsInventory` khi kết toán.
     - `components/modals/MeditationJournalModal.tsx`: Tạo hiệu ứng viền ánh kim và huy hiệu `✨ TÀN ĐỒ CỔ` cho các sự kiện nhặt được mảnh tàn đồ.
  4. **Custom Hook & UI/UX Cổ Phong (`hooks/useAncientDungeonActions.ts`, `components/tabs/AncientMapDungeonView.tsx`, `components/tabs/SecretRealmTab.tsx`):**
     - Hook `useAncientDungeonActions`: Điều phối trạng thái Sa Bàn, thao tác ghép bí đồ, mở phó bản và khiêu chiến từng tầng.
     - Component `AncientMapDungeonView`: Sa Bàn Jigsaw 4 góc với hoa văn Đông - Tây - Nam - Bắc, đồng hồ đếm ngược hạn giờ phó bản, lộ trình 3 ải và Modal nhận Thần Binh lộng lẫy.
     - Tích hợp thành sub-tab thứ 5 **"🗺️ Tàng Bảo Các"** trong phân khu Bí Cảnh (`SecretRealmTab.tsx`).
- **4 Ràng buộc bất biến (Hard Invariants) & Kết quả kiểm chứng:**
  - *Invariant 1 (Bảo Toàn Save Game & Idempotent Migration):* Hoàn toàn tương thích ngược với save cũ; nạp mock save legacy chuẩn hóa 100% trường `ancientMapVault`, dọn dẹp an toàn các phó bản quá hạn.
  - *Invariant 2 (Kiến Trúc Tách Biệt Tuyệt Đối):* 100% logic rơi mảnh, công thức ghép 4 mảnh, sinh phó bản và trao thưởng nằm trọn vẹn trong `lib/ancient-map-dungeon-logic.ts`.
  - *Invariant 3 (Phòng Vệ Ghép Đồ & Chống Nhân Bản):* Cơ chế Atomic Synthesis đảm bảo phải đủ đúng 4 mảnh Đông-Tây-Nam-Bắc cùng bộ, từ chối ghép cross-set; trừ chính xác mỗi mảnh 1 số lượng. Chỉ cho phép duy nhất 1 phó bản hoạt động tại một thời điểm.
  - *Invariant 4 (Đồng Bộ Hai Chiều Với Combat Engine & Nhập Định):* Kết nối thông suốt với `resolveOfflineMeditationProgress`, nhật ký `MeditationJournalModal`, và hệ thống chiến đấu đối kháng nhận diện đầy đủ chỉ số, dị tượng ngũ hành.
- **Danh mục tệp thay đổi (Files Changed):**
  - Mới: `lib/types/ancient-map-dungeon.ts` (Domain Types cho Tàn Đồ & Thượng Cổ Bí Cảnh).
  - Mới: `lib/ancient-map-dungeon-logic.ts` (Pure Business Logic Engine).
  - Mới: `hooks/useAncientDungeonActions.ts` (Custom Hook điều phối tương tác Tàng Bảo Các).
  - Mới: `components/tabs/AncientMapDungeonView.tsx` (Giao diện Sa Bàn Ghép Tàn Đồ & Khai Mở Phó Bản).
  - Mới: `scripts/test-ancient-map-dungeon.ts` (Test Suite tự động 6 ca kiểm thử độc lập).
  - Sửa: `lib/types/index.ts` & `lib/types/player.ts` (Export types, thêm `ancientMapVault` vào `PlayerStats`).
  - Sửa: `lib/types/meditation.ts` (Thêm `mapFragmentsLooted` vào `MeditationProgressResult`).
  - Sửa: `lib/save-migration.ts` (Thêm `migrateAncientMapDungeonData`, chuẩn hóa `normalizePlayerData`).
  - Sửa: `lib/meditation-logic.ts` (Tích hợp rơi mảnh tàn đồ theo giờ và cập nhật kho người chơi khi xuất quan).
  - Sửa: `lib/game-logic/combat.ts` (Bổ sung fallbacks an toàn cho `boss.stats` và `boss.rewards`).
  - Sửa: `components/modals/MeditationJournalModal.tsx` (Highlight chiến báo nhặt được Mảnh Tàn Đồ Thượng Cổ).
  - Sửa: `hooks/index.ts` & `hooks/useSecretRealmActions.ts` (Export hook, thêm sub-tab `ancient_maps`).
  - Sửa: `components/tabs/SecretRealmTab.tsx` (Thêm sub-tab thứ 5 "🗺️ Tàng Bảo Các", render `AncientMapDungeonView`).
  - Sửa: `components/GameDashboard.tsx` (Truyền callbacks `onAddLog` và `onShowToast` sang `SecretRealmTab`).
- **Kế hoạch kiểm thử & Nghiệm thu (Verification):**
  - Test Suite `scripts/test-ancient-map-dungeon.ts` đạt **6/6 Tests Passed (100%)**.
  - Toàn bộ các test suite liên quan (`test-meditation-system.ts`, `test-custom-sanctuary.ts`) tiếp tục đạt **100% Passed**.
  - `npx tsc --noEmit` đạt **0 lỗi**.
  - `npm run build` (Turbopack) hoàn tất thành công trong 14.8s.

### [2026-10-03 10:45] - Triển Khai Toàn Diện Phân Hệ "Linh Mạch Động Phủ Tự Chế & Khảm Nạp Trận Bàn (Custom Sanctuary & Vein Socketing — Tự Chế Linh Địa Độc Quyền)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây trong Động Phủ (Abode), hệ thống Linh Mạch chỉ mang tính chất cộng chỉ số tĩnh (tăng tốc độ hồi phục linh khí hoặc nồng độ linh khí cố định), trong khi các Trận Bàn chế tác từ Trận Pháp Các sau khi sử dụng hoặc trùng chú lên Bất Hủ chưa có nơi quy tụ chiến lược dài hạn. Đồng thời, tính năng Thiên Địa Nhập Định mới chỉ cho phép chọn các Linh Địa mặc định của thế giới mà chưa có một không gian tu luyện mang đậm dấu ấn cá nhân hóa của người chơi.
  - Triển khai toàn diện tính năng **"Linh Mạch Động Phủ Tự Chế & Khảm Nạp Trận Bàn (Custom Sanctuary & Vein Socketing)"**:
    1. **Thăng Phẩm & Đả Thông Linh Mạch (Vein Progression & Sockets):** Bồi dưỡng Linh Mạch Động Phủ qua 9 phẩm cấp (từ *Nhất Phẩm Phàm Mạch* đến *Cửu Phẩm Hỗn Độn Tiên Mạch*). Mỗi bậc thăng phẩm mở rộng số lượng Trận Nhãn Khảm Nạp (1 -> 5 slots) và nâng cao nồng độ linh khí cơ bản (hệ số Tu Vi x1.2 -> x3.2).
    2. **Khảm Nạp & Định Trận (Array Socketing System):** Tự do đưa các Trận Bàn đã chế tác (Tụ Linh Trận, Hộ Sơn Trận, Thanh Tâm Trận, Thái Sơ Bất Hủ Trận...) vào các Trận Nhãn của Linh Mạch để chuyển hóa thành buff bị động vĩnh viễn/bán vĩnh viễn cho toàn bộ Động Phủ. Trận bàn khi khảm được khóa an toàn `isSocketedInSanctuary: true`, khi tháo gỡ hoàn trả tự do 100%.
    3. **Cộng Hưởng Trận Đồ Tổ Hợp (Sanctuary Array Resonances):** Kích hoạt các Dị Tượng Linh Mạch Độc Bản khi khảm tổ hợp đặc thù:
       - *Lưỡng Nghi Tụ Linh:* 2 Trận Bàn Tụ Linh cùng khảm $\rightarrow$ +35% Tốc độ tu vi bế quan, +25% hấp thu ngoại tuyến.
       - *Thanh Tâm Định Mạch:* Tụ Linh + Thanh Tâm/Tỏa Ma Trận $\rightarrow$ Tự động tiêu trừ 2 Đan Độc và 2 Ma Tính mỗi giờ.
       - *Ngũ Hành Tương Sinh:* Trận bàn mang quan hệ tương sinh (Mộc sinh Hỏa, Kim sinh Thủy...) $\rightarrow$ +30% sản lượng Dược Viên và Linh Điền.
       - *Thái Sơ Hỗn Độn Vực:* Trận Cửu Giai Bất Hủ + Trận Thần Cấp $\rightarrow$ +50% Tu Vi, +10% Tỷ lệ đột phá cảnh giới.
       - *Kim Cương Hộ Sơn:* 2 Trận Hộ Thể / Kim Cương $\rightarrow$ Giảm 50% nguy cơ đứt đoạn hoặc biến cố hiểm họa khi nhập định.
    4. **Biến Động Phủ Thành Linh Địa Độc Quyền Trong Nhập Định:** Tự động đăng ký Linh Địa Độc Quyền vào danh mục của tính năng **Thiên Địa Nhập Định (`getAvailableMeditationLocations`)** dưới danh xưng tùy biến riêng (mặc định: *[Tên Nhân Vật] • Tiên Phủ Động Thiên*), mang hệ số Tu Vi (x1.5 -> x3.5), bảng rớt đồ độc quyền `drop_custom_sanctuary` và hiệu ứng hộ đạo tùy biến.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/custom-sanctuary.ts`, `lib/types/formation.ts`, `lib/types/player.ts`):**
     - Khai báo `SanctuaryVeinTier`, `SocketedFormationData`, `SanctuaryResonanceEffects`, `SanctuaryResonanceCombo`, `CustomSanctuaryState`, `SanctuaryVeinTierConfig`.
     - Mở rộng `FormationItem` với cờ `isSocketedInSanctuary?: boolean`.
     - Mở rộng `PlayerStats` với trường `customSanctuary?: CustomSanctuaryState`.
  2. **Pure Business Logic Engine (`lib/custom-sanctuary-logic.ts`):**
     - Bảng cấu hình 9 bậc Linh Mạch `SANCTUARY_VEIN_CONFIG` kèm chi phí Linh Thạch, Tinh Hoa Rèn Đúc `forgingEssence` và mốc cảnh giới.
     - Danh mục tổ hợp cộng hưởng `SANCTUARY_RESONANCES_REGISTRY` & thuật toán thẩm định cộng hưởng `checkSanctuaryResonances`.
     - Các hàm thẩm định và thao tác: `canUpgradeSanctuaryVein`, `upgradeSanctuaryVein`, `canSocketArray`, `socketArrayIntoSanctuary`, `canUnsocketArray`, `unsocketArrayFromSanctuary`, `renameCustomSanctuary`.
     - Hàm sinh dữ liệu Linh Địa Độc Quyền `generateCustomSanctuaryLocation` với hệ nguyên tố chủ đạo và hệ số tu vi cộng dồn.
  3. **Tích Hợp Save Migration & Engine Hệ Thống:**
     - `lib/save-migration.ts`: Thêm `migrateCustomSanctuaryData` tự động bổ sung an toàn cấu trúc `customSanctuary` và dọn sạch các ID Trận Bàn ma nếu vật phẩm không còn tồn tại trong kho. Tích hợp trực tiếp vào `normalizePlayerData`.
     - `lib/meditation-logic.ts`: Thêm bảng tài nguyên rơi `drop_custom_sanctuary`, hàm `getAvailableMeditationLocations`, tích hợp địa điểm độc quyền và hiệu ứng giảm nguy cơ hiểm họa cùng tẩy độc theo giờ vào `resolveOfflineMeditationProgress`.
     - `lib/game-logic/cultivation.ts` & `lib/offline-progress.ts`: Đồng bộ trực tiếp `sanctuaryTuViBonus`, `offlineAbsorptionBonus`, cùng lượng tiêu trừ Đan Độc / Ma Tính thụ động.
     - `hooks/useAbodeActions.ts`: Tích hợp bonus sản lượng `sanctuaryYieldBonus` từ combo Ngũ Hành Tương Sinh vào hàm thu hoạch Dược Viên `handleHarvestPlot`.
  4. **Custom Hook & UI/UX Cổ Phong (`hooks/useCustomSanctuaryActions.ts`, `components/abode/SanctuaryVeinView.tsx`, `components/abode/AbodeHubModal.tsx`):**
     - Xây dựng Custom Hook `useCustomSanctuaryActions` điều phối toàn diện logic thăng phẩm, khảm/gỡ trận bàn, đổi tên tiên phủ và chuyển nhanh tới nhập định.
     - Giao diện Sa Bàn Động Phủ (`AbodeHubModal.tsx`): Bổ sung Phân khu thứ 5 **"🏔️ Linh Mạch Thần Đài"** với trụ Bát Quái trung tâm xoay đa tầng, 1-5 Trận Nhãn trực quan, danh sách huy hiệu Dị Tượng lộng lẫy và bảng bồi dưỡng thăng phẩm tiên mạch.
- **4 Ràng buộc bất biến (Hard Invariants) & Kết quả kiểm chứng:**
  - *Invariant 1 (Bảo Toàn Save Game & Idempotent Migration):* Không làm ảnh hưởng cấu trúc cũ, mock save v5/v6 nạp qua `migrateCustomSanctuaryData` chuẩn hóa an toàn 100%, dọn sạch reference ma.
  - *Invariant 2 (Kiến Trúc Tách Biệt Tuyệt Đối):* 100% logic thẩm định thăng phẩm, khảm/gỡ và sinh Linh Địa nằm độc lập trong `lib/custom-sanctuary-logic.ts`.
  - *Invariant 3 (Phòng Vệ Đơn Nhiệm & Chống Khai Thác):* Một Trận Bàn chỉ được khảm vào 1 Trận Nhãn duy nhất; cờ `isSocketedInSanctuary` khóa khỏi túi đồ, giải phóng an toàn 100% khi tháo gỡ. Chặn đứng duplication exploit.
  - *Invariant 4 (Đồng Bộ Hai Chiều Với Engine Nhập Định & Động Phủ):* Dữ liệu Linh Địa Độc Quyền cập nhật thời gian thực vào `getAvailableMeditationLocations`, đồng bộ sản lượng Dược Viên và tiến độ tu luyện ngoại tuyến.
- **Danh mục tệp thay đổi (Files Changed):**
  - Mới: `lib/types/custom-sanctuary.ts` (Domain Types cho Linh Mạch & Trận Nhãn).
  - Mới: `lib/custom-sanctuary-logic.ts` (Pure Business Logic Engine).
  - Mới: `hooks/useCustomSanctuaryActions.ts` (Custom Action Hook).
  - Mới: `components/abode/SanctuaryVeinView.tsx` (Giao diện Cổ Phong Linh Mạch Thần Đài).
  - Mới: `scripts/test-custom-sanctuary.ts` (Test Suite tự động 6 ca kiểm thử độc lập).
  - Sửa: `lib/types/index.ts` & `lib/types/formation.ts` (Export domain types, bổ sung `isSocketedInSanctuary`).
  - Sửa: `lib/types/player.ts` (Bổ sung `customSanctuary?: CustomSanctuaryState`).
  - Sửa: `lib/save-migration.ts` (Thêm `migrateCustomSanctuaryData`, chuẩn hóa `normalizePlayerData`).
  - Sửa: `lib/meditation-logic.ts` (Thêm `drop_custom_sanctuary`, `getAvailableMeditationLocations`, cập nhật `canStartMeditation` và `resolveOfflineMeditationProgress`).
  - Sửa: `hooks/useMeditationActions.ts` (Sử dụng `getAvailableMeditationLocations` động).
  - Sửa: `lib/game-logic/cultivation.ts` & `lib/offline-progress.ts` (Đồng bộ buff tốc độ tu vi, hấp thu ngoại tuyến, tiêu trừ độc đan).
  - Sửa: `hooks/useAbodeActions.ts` (Thêm tab `sanctuary`, đồng bộ sản lượng dược viên từ Ngũ Hành Tương Sinh).
  - Sửa: `components/abode/AbodeHubModal.tsx` (Thêm tab 5 Linh Mạch Thần Đài, tích hợp `SanctuaryVeinView`).
  - Sửa: `components/GameDashboard.tsx` (Truyền callbacks sang `AbodeHubModal`).
  - Sửa: `components/dashboard/MiddleColumn.tsx` (Mở rộng layout lưới 5 địa điểm nhập định).
  - Sửa: `hooks/index.ts` (Export `useCustomSanctuaryActions`).
- **Kết quả nghiệm thu:**
  - `npx tsx scripts/test-custom-sanctuary.ts`: 6/6 test cases passed (100%).
  - `npx tsc --noEmit`: 0 lỗi Type check (Clean).
  - `npm run build`: Compile Turbopack thành công 100% trong 18.7s.

### [2026-10-03 10:20] - Triển Khai Toàn Diện Phân Hệ "Đạo Lữ & Linh Thú Hộ Pháp (Companion & Beast Meditation Assistance — Song Hành Hộ Đạo)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Phân hệ Thiên Địa Nhập Định trước đây diễn ra đơn độc, rủi ro ở thế Hiểm Cảnh Đoạt Vận chỉ phụ thuộc duy nhất vào Bùa Hộ Mệnh tĩnh. Trong khi đó, hai phân hệ đồng hành quan trọng là Đạo Lữ (Companions) và Linh Thú (Beasts / Thú Uyển) chưa được gắn kết vào vòng lặp AFK này.
  - Triển khai toàn diện tính năng **"Đạo Lữ & Linh Thú Hộ Pháp (Song Hành Hộ Đạo)"**:
    1. **Thiết Lập Hộ Pháp Xuất Trận (Guardian Slots):** Trước khi nhập định, người chơi có thể cử tối đa 1 Đạo Lữ (đã kết duyên) và/hoặc 1 Linh Thú đi cùng để hộ đạo tại Linh Địa.
    2. **Cơ Chế Hộ Pháp Cứu Viện (Hazard Rescue & Interruption Prevention):**
       - Khi gặp biến cố "Khí Huyết Nghịch Chuyển" hoặc "Tà Tu / Hung Thú Tập Kích" ở thế Hiểm Cảnh: Hộ pháp xuất thủ tương trợ, vô hiệu hóa nguy cơ đứt đoạn phiên nhập định mà không bắt buộc phải có Bùa Hộ Mệnh (Đạo Lữ cứu viện $\ge$85%, Linh Thú cứu viện $\ge$75%).
       - Tự động ghi nhận vào Nhật Ký Kỳ Ngộ (Timeline Logs) với ngữ cảnh sinh động theo tên riêng và cảnh giới/phẩm cấp của người hộ pháp, kèm thưởng +5 Hảo Cảm vì đồng cam cộng khổ.
    3. **Cùng Nhập Định Cùng Thăng Tiến (Mutual Growth & Double Harvest):**
       - *Đối với Đạo Lữ:* Mỗi giờ nhận thêm điểm Hảo Cảm (+1/2h Cố Bản, +1/h Hiểm Cảnh), nhận lượng Tu Vi bằng 30% tu vi người chơi, mỗi giờ giảm 60 phút mệt mỏi (`fatigueUntil`), và có xác suất kích hoạt đốn ngộ đạo tâm (`totalEpiphanies + 1`).
       - *Đối với Linh Thú:* Nhận lượng lớn Thú EXP (`(cảnh giới * 50 + 150) * giờ * cộng hưởng`), tinh luyện huyết mạch (`bloodlinePurity +0.2%/4h`), tăng điểm Trung Thành và tự động thăng cấp khi đủ EXP.
    4. **Cộng Hưởng Thuộc Tính Linh Địa (Elemental Resonance Bonus):** Nếu Đạo Lữ hoặc Linh Thú có cùng hệ nguyên tố với Linh Địa, kích hoạt buff cộng hưởng +15% hiệu suất Tu Vi và tỷ lệ nhặt dị bảo cho cả người chơi lẫn hộ pháp.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/meditation.ts`, `lib/types/player.ts`, `lib/types/companions.ts`, `lib/types/beasts.ts`):**
     - Bổ sung `MeditationGuardianConfig`, `GuardianGrowthResult`, `GuardianRescueIncident`.
     - Mở rộng `MeditationProgressResult` (`guardianGrowth`, `guardianRescues`, `elementalResonanceBonus`, `resonanceDetails`).
     - Bổ sung an toàn `accompanyingCompanionId`, `accompanyingBeastId`, `guardianRescueCount` vào `PlayerStats` và `ActiveMeditationState`.
     - Bổ sung cờ `isAssignedToMeditation` và `tuvi` vào `CompanionPlayerState` và `SpiritBeast`.
  2. **Pure Business Logic Engine (`lib/meditation-guardian-logic.ts`, `lib/meditation-logic.ts`):**
     - Hàm thẩm định tư cách `validateMeditationGuardians` (kiểm tra khế ước, kiệt sức, khóa phối giống, bận hộ pháp).
     - Hàm kiểm tra cộng hưởng `checkElementalResonance` với chuẩn hóa tên hệ ngũ hành `normalizeElement`.
     - Thuật toán cứu viện thứ bậc `resolveGuardianHazardRescue` (Ưu tiên 1: Bùa, Ưu tiên 2: Đạo Lữ, Ưu tiên 3: Linh Thú, Ưu tiên 4: Đứt đoạn an toàn).
     - Hàm tính toán phần thưởng song hướng `calculateGuardianGrowth` và đồng bộ vào Save Game `applyGuardianProgressToPlayer`.
     - Cơ chế khóa nguyên tử `assignGuardiansLock` và giải phóng nguyên tử `releaseGuardiansLock`.
  3. **Phòng Vệ Trạng Thái & Khóa Đơn Nhiệm (Hard Invariant 3):**
     - `hooks/useCompanionActions.ts`: Chặn Song Tu (`handleSongTu`) nếu Đạo Lữ đang tham gia hộ pháp nhập định.
     - `lib/beast-breeding-logic.ts`: Chặn lai tạo phối giống (`canBreedBeasts`) nếu Linh Thú đang tham gia hộ pháp nhập định.
  4. **Save Migration & Idempotent Cleanup (Hard Invariant 1):**
     - `lib/save-migration.ts`: Thêm `migrateMeditationGuardianData` và tích hợp vào `normalizePlayerData`, tự động dọn sạch cờ khóa mồ côi nếu phiên trước bị gián đoạn bất thường.
     - `lib/offline-progress.ts`: Chuyển tiếp ID hộ pháp vào `resolveOfflineMeditationProgress` khi offline.
  5. **Custom Hook & Giao Diện Cổ Phong UI/UX (`hooks/useMeditationActions.ts`, `components/dashboard/MiddleColumn.tsx`, `components/modals/MeditationJournalModal.tsx`):**
     - MiddleColumn: Khu vực **"🛡️ Hộ Đạo Trận Vị"** gồm 2 slot chọn Đạo Lữ `[🌸 Đồng Hành]` & Linh Thú `[🐾 Hộ Vệ]`, banner vàng ánh kim báo cộng hưởng nguyên tố, và hiển thị thẻ hộ pháp đang trực chiến trong vòng tròn Bát Quái.
     - MeditationJournalModal: Card tổng kết **"Thu Hoạch Của Đạo Lữ & Linh Thú"** (Hảo cảm, Tu vi, EXP, Huyết mạch) và dòng sự kiện cứu nguy nổi bật viền ánh kim với huy hiệu `🛡️ [HỘ PHÁP XUẤT THỦ]`.
- **4 Ràng buộc bất biến (Hard Invariants) & Kết quả kiểm chứng:**
  - *Invariant 1 (Bảo Toàn Save Game & Idempotent Migration):* Tự động gán `accompanyingCompanionId: null`, `accompanyingBeastId: null`, `guardianRescueCount: 0`. Đã test với mock save cũ v6.
  - *Invariant 2 (Pure Logic Separation):* 100% logic nằm trong `lib/meditation-guardian-logic.ts` và `lib/meditation-logic.ts`.
  - *Invariant 3 (Guardian State Lock):* Đạo Lữ và Linh Thú được khóa an toàn, giải phóng nguyên tử khi xuất quan hoặc hủy phiên. Đã test chặn Song Tu & Phối Giống.
  - *Invariant 4 (Đồng Bộ Hai Chiều & Báo Cáo):* Cập nhật chỉ số thực tế vào Save Game và hiển thị chi tiết trong `MeditationJournalModal`.
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/meditation-guardian-logic.ts` (Pure business logic thẩm định, cộng hưởng, cứu viện, tính thưởng, khóa hộ pháp).
  - Mới: `scripts/test-meditation-guardians.ts` (Test suite 6 ca kiểm thử bao phủ toàn diện 100%).
  - Sửa: `lib/types/meditation.ts`, `lib/types/player.ts`, `lib/types/companions.ts`, `lib/types/beasts.ts` (Domain types).
  - Sửa: `lib/meditation-logic.ts` (Tích hợp hộ pháp cứu viện, cộng hưởng nguyên tố và tăng trưởng).
  - Sửa: `lib/beast-breeding-logic.ts` (Khóa phối giống khi thú đang hộ pháp).
  - Sửa: `hooks/useCompanionActions.ts` (Khóa Song Tu khi đạo lữ đang hộ pháp).
  - Sửa: `lib/save-migration.ts` (Hàm `migrateMeditationGuardianData` và tích hợp `normalizePlayerData`).
  - Sửa: `lib/offline-progress.ts` (Truyền tham số hộ pháp khi giải quyết offline).
  - Sửa: `hooks/useMeditationActions.ts` (State, lọc danh sách khả dụng, gán & giải phóng khóa).
  - Sửa: `components/dashboard/MiddleColumn.tsx` (UI chọn hộ pháp, banner cộng hưởng, giao diện trực chiến).
  - Sửa: `components/modals/MeditationJournalModal.tsx` (Card thu hoạch hộ pháp & highlight timeline).
- **Kết quả nghiệm thu kỹ thuật:**
  - `npx tsx scripts/test-meditation-guardians.ts`: 39/39 tests passed (100%).
  - `npx tsx scripts/test-meditation-system.ts`: 34/34 tests passed (100%).
  - `npx tsc --noEmit`: 0 errors.
  - `npm run build`: Compiled successfully on Next.js 16.3.5 Turbopack.

---

### [2026-10-03 10:05] - Triển Khai Toàn Diện Phân Hệ "Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà (Strategic AFK Meditation & Event Journal)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tính năng Nhập Định (Meditation / Offline AFK Cultivation) trước đây chỉ đơn giản là chọn 1 trong 3 phương hướng (Cố Bản, Hiểm Cảnh, Đoạt Bảo) mang tính chất đổi hệ số nhân (multiplier) điểm Tu Vi/Vật phẩm rồi bấm giờ treo máy, gây cảm giác đơn điệu và thiếu tính chiến thuật trước khi cắm máy.
  - Tái cấu trúc và phát triển toàn diện tính năng thành **"Thiên Địa Nhập Định & Kỳ Ngộ Sơn Hà (Strategic AFK Meditation & Event Journal)"**, biến việc treo máy thành một mini-loop chiến thuật hoàn chỉnh:
    1. **Linh Địa Nhập Định (Meditation Locations & Drop Tables):** Cho phép chọn 4 linh địa tĩnh tọa (*Linh Mạch Tông Môn, Hàn Băng Thâm Động, Hỏa Diễm Thiên Sơn, Thần Ma Cổ Chiến Trường*) với yêu cầu cảnh giới, hệ nguyên tố và drop table tài nguyên đặc thù.
    2. **Đa Dạng Hóa Thế Nhập Định (Tactical Meditation Stances):**
       - *Cố Bản Bồi Nguyên (An Toàn):* Tỷ lệ rủi ro 0%, nhận Tu Vi và Linh Thạch ổn định.
       - *Luyện Tâm Hóa Ma (Tẩy Độc/Trừ Ma):* Không nhận tu vi, mỗi giờ tự động trừ 3 điểm Ma Tính (`demonicNature`) và 3 điểm Đan Độc (`pillToxicity`). Kết thúc nhận buff *"Tâm Cảnh Thanh Lãng"* (+15% tỷ lệ đột phá trong 12h).
       - *Thao Diễn Thần Thông (Luyện Kỹ Năng):* Toàn bộ tu vi chuyển hóa thành điểm thuần thục (Skill EXP) chia đều cho các Công Pháp / Thần Thông đang trang bị.
       - *Hiểm Cảnh Đoạt Vận (Cơ Duyên Cực Đại - High Risk):* Tu vi x2.0, tỷ lệ rớt bảo vật quý x2.5, nhưng có 20% nguy cơ gặp "Khí Huyết Nghịch Chuyển" gây đứt đoạn nếu không có bùa hộ thân.
    3. **Cơ Chế Bùa Hộ Mệnh & Hộ Trận (Wards & Protection):** Người chơi có thể đặt 1 lá bùa hộ thân (*An Thần Phù, Khang Ma Trận Bàn, Kim Cương Hộ Thể Phù, v.v.*) để miễn nhiễm 100% rủi ro đứt đoạn khi chọn Hiểm Cảnh.
    4. **Nhật Ký Kỳ Ngộ Dọc Đường (Timeline Event Logs):** Khi thu hoạch sau N giờ offline/online, hệ thống tự động mô phỏng và hiển thị danh sách các sự kiện theo mốc giờ (Tick Logs): nhặt khoáng thạch, trảm quái, đốn ngộ thơ ca thiên địa, tao ngộ tán tu giao dịch, hiểm họa phòng vệ.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/meditation.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Định nghĩa `MeditationStanceType`, `MeditationLocationConfig`, `MeditationEventLog`, `MeditationProgressResult`, `ActiveMeditationState`.
     - Mở rộng `PlayerStats` an toàn với `meditationState`, `meditationLocationId`, `meditationStance`, `equippedWardItemId`, `meditationEventLogs`.
  2. **Pure Business Logic Engine (`lib/meditation-logic.ts`):**
     - Danh mục linh địa `MEDITATION_LOCATIONS` (4 linh địa), 4 thế `MEDITATION_STANCES_CONFIG`, kho bùa `WARD_ITEMS_REGISTRY`, bảng drop table đa dạng `LOCATION_DROP_TABLES`.
     - Pure function `resolveOfflineMeditationProgress`: Xử lý theo từng mốc giờ (Hourly Loop), kiểm tra rủi ro & bùa hộ thân, xử lý trừ ma tính/đan độc, phân bổ Skill EXP công pháp, và sinh kỳ ngộ tiên hiệp theo seed thời gian.
     - Pure function `applyMeditationProgressToPlayer`: Cập nhật tu vi, linh thạch, ma tính, đan độc, buff Tâm Cảnh Thanh Lãng, EXP công pháp và túi đồ chuẩn bất biến.
  3. **Tích Hợp Save Migration & Engine Hệ Thống:**
     - `lib/save-migration.ts`: Thêm `migrateMeditationData(player)` và cập nhật `normalizePlayerData` đảm bảo idempotent, an toàn tuyệt đối khi nạp save từ phiên bản cũ.
     - `lib/offline-progress.ts` & `hooks/useOfflineProgress.ts`: Tự động tính toán và giải quyết tiến độ nhập định khi người chơi trở lại game sau thời gian offline.
  4. **Custom Action Hook (`hooks/useMeditationActions.ts`, `hooks/index.ts`):**
     - Quản lý trạng thái nhập định, ticker thời gian thực, live preview, `handleStartMeditation`, `handleClaimMeditationRewards`, `handleCancelMeditation`.
  5. **Giao Diện Người Dùng Cổ Phong UI/UX (`components/dashboard/MiddleColumn.tsx`, `components/modals/MeditationJournalModal.tsx`, `components/GameDashboard.tsx`):**
     - **Bảng Thiết Lập Nhập Định (Pre-Meditation Cockpit):** Grid 4 Linh Địa với tranh phong cảnh & yêu cầu cảnh giới, 4 Thẻ Bài Thế Nhập Định phong cách cổ phong, Bộ chọn Bùa Hộ Mệnh chống gián đoạn, Nút bấm phát quang `🧘 KHỞI THỰC NHẬP ĐỊNH (TĨNH TỌA HÀNH THIỀN)`.
     - **Giao Diện Treo Máy (Active Meditation State):** Vòng sáng Bát Quái xoay chuyển huyền bí, đồng hồ đếm thời gian trôi qua, thanh tiến trình hiển thị mốc giờ nhận kỳ ngộ kế tiếp.
     - **Modal Nhật Ký Kỳ Ngộ Thu Hoạch (Meditation Journal Modal):** Cuộn sớ tu tiên cổ phong với bảng tổng kết chỉ số, dòng thời gian chiến báo (Timeline) hiển thị từng mốc giờ cùng icon sinh động (🎁, ⚔️, 📜, ⚠️, 🛡️) và nút `[Thu Vào Túi Trữ Vật]`.
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/types/meditation.ts` (Domain types linh địa, thế nhập định, sự kiện, kết quả).
  - Mới: `lib/meditation-logic.ts` (Pure business logic Thiên Địa Nhập Định).
  - Mới: `hooks/useMeditationActions.ts` (Custom hook điều phối nhập định).
  - Mới: `components/modals/MeditationJournalModal.tsx` (Giao diện Sớ Tu Tiên Nhật Ký Kỳ Ngộ).
  - Mới: `scripts/test-meditation-system.ts` (Test suite độc lập 6 ca kiểm thử).
  - Sửa: `lib/types/index.ts`, `lib/types/player.ts`, `lib/types/cultivation.ts` (Tích hợp types).
  - Sửa: `lib/save-migration.ts` (Migration an toàn idempotent).
  - Sửa: `lib/offline-progress.ts`, `hooks/useOfflineProgress.ts` (Đồng bộ tiến trình offline).
  - Sửa: `hooks/index.ts`, `components/modals/index.ts` (Exports module).
  - Sửa: `components/dashboard/MiddleColumn.tsx` (Cockpit & Active view).
  - Sửa: `components/GameDashboard.tsx` (Wiring hook & modal).
- **Kết quả kiểm thử & Tiêu chuẩn chất lượng (Testing & Verification):**
  - Đã chạy độc lập `scripts/test-meditation-system.ts`: **34/34 tests passed (100%)**.
  - Đã chạy kiểm thử hồi quy `scripts/test-seclusion-enhancement.ts`: **38/38 tests passed (100%)**.
  - Type-check toàn codebase `npx tsc --noEmit`: **0 lỗi (Zero Errors)**.
  - Production build Turbopack `npm run build`: **Compile thành công 100% (8/8 routes)**.
- **Tuân thủ 4 Ràng buộc bất biến (Hard Invariants Verification):**
  - *Invariant 1 (Bảo Toàn Save Game & Idempotent Migration):* Hoàn tất qua `migrateMeditationData` và `normalizePlayerData`.
  - *Invariant 2 (Pure Logic Separation):* 100% logic tính toán nằm trong `lib/meditation-logic.ts`.
  - *Invariant 3 (Phòng Vệ Trạng Thái & Chống Gian Lận Giờ):* Khóa trần thời gian tối đa 24 giờ.
  - *Invariant 4 (Đồng Bộ Hai Chiều Với Engine Chiến Đấu & Kỹ Năng):* Skill EXP cập nhật trực tiếp vào cấp độ `manuals`, Ma Tính và Đan Độc đồng bộ tức thì vào chỉ số nhân vật.

### [2026-10-03 09:45] - Triển Khai Toàn Diện Phân Hệ "Tuế Nguyệt Bế Quan: Tam Hóa Chi Cảnh (Gieo Mầm Đạo Quả, Tẩy Đan Độc Kinh Mạch, Ôn Dưỡng Bản Mệnh)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tính năng Bế Quan (Deep Cultivation / Seclusion) trước đây chỉ đơn thuần khấu trừ Thọ Nguyên để nhận lượng Tu Vi tĩnh, thiếu sự gắn kết với buildcraft, cơ thể nhân vật và trang bị bản mệnh.
  - Tái cấu trúc và nâng cấp toàn diện phân hệ thành vòng lặp tu luyện đa chiều **"Tam Hóa Chi Cảnh: Bế Quan Tam Trọng Thăng Hoa"**, tích hợp trọn vẹn 3 cơ chế:
    1. **Gieo Mầm Tu Vi (Đạo Chủng & Đạo Quả - Buildcraft Affixes):** Gieo Đạo Chủng trước khi bế quan, tích lũy đủ niên hạn sẽ đơm hoa kết trái thành Đạo Quả, phục dụng để dung hợp vĩnh viễn dòng nội tại ẩn vào kinh mạch.
    2. **Tôi Thể Thuần Khiết (Tẩy Trừ Đan Độc & Khôi Phục Chân Nguyên):** Vận hành đại chu thiên tự động đào thải đan độc (2 điểm/năm), đưa Độ Tinh Khiết Chân Nguyên (`qiPurity`) phục hồi về mức 100%, tỷ lệ đột phá cảnh giới đạt tối đa.
    3. **Ôn Dưỡng Bản Mệnh Pháp Bảo Trong Cơ Thể:** Trích xuất 0% - 50% tu vi bế quan truyền tinh huyết nuôi dưỡng Khí Linh Bản Mệnh Pháp Bảo, gia tăng mạnh EXP, độ thân mật và đốn ngộ thăng hoa tầng linh trí.
  - Tuân thủ nghiêm ngặt 4 Ràng buộc bất biến (Hard Invariants):
    - *Invariant 1 (Bảo Toàn Save Game & Idempotent Migration):* Tự động bổ sung an toàn `pillToxicity: 0`, `qiPurity: 100`, `activeDaoSeed: null`, `harvestedDaoFruits: []`, `absorbedDaoAffixes: []` khi nạp save game cũ qua `migrateSeclusionEnhancementData` và `normalizePlayerData`.
    - *Invariant 2 (Pure Logic Separation):* 100% logic tính toán đào thải đan độc, điều kiện chín của Đạo Quả, phân chia tu vi nuôi Khí Linh nằm độc lập tại `lib/seclusion-enhancement-logic.ts`.
    - *Invariant 3 (Phòng Vệ Giới Hạn & Anti-Exploit):* Thọ nguyên tiêu hao không vượt quá số thọ nguyên còn lại, đan độc nằm trong [0, 100], độ tinh khiết chân nguyên nằm trong [10%, 100%], bảo lưu tiến độ năm của hạt giống chưa chín.
    - *Invariant 4 (Đồng Bộ Hai Chiều Engine Chiến Đấu & Đột Phá):* Dòng Affix nhận từ Đạo Quả lập tức phản ánh vào `calculateCombatStats` (`destiny-data.ts`), chỉ số `qiPurity` tác động trực tiếp lên tỷ lệ đột phá trong `cultivation.ts`.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/seclusion-enhancement.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Định nghĩa `DaoSeedCategory`, `DaoFruitAffix`, `DaoSeedConfig`, `ActiveSeclusionSeedState`, `DaoFruitItem`, `SeclusionNourishConfig`, `SeclusionExecutionResult`, `EnhancedSeclusionValidation`.
     - Mở rộng `PlayerStats` an toàn với `qiPurity`, `activeDaoSeed`, `activeSeclusionSeed`, `harvestedDaoFruits`, `absorbedDaoAffixes`.
  2. **Pure Business Logic Engine (`lib/seclusion-enhancement-logic.ts`):**
     - Thiết lập danh mục `DAO_SEEDS_REGISTRY` 5 Đạo Chủng: *Kiếm Ý Đạo Chủng* (10 năm ➔ Vạn Kiếm Quy Tông Quả +6% ATK, +4% Crit), *Bất Tử Đạo Chủng* (15 năm ➔ Trường Sinh Niết Bàn Quả +8% HP, +3% Miễn Thương), *Thần Lôi Đạo Chủng* (25 năm ➔ Cửu Tiêu Lôi Đình Quả +5% Né Tránh, +4% Crit), *Hỗn Độn Đạo Chủng* (50 năm ➔ Thái Sơ Hỗn Độn Quả +10% Toàn Thuộc Tính, +5% Hút Máu), *Âm Dương Đạo Chủng* (30 năm ➔ Thái Cực Âm Dương Quả +8% DEF, +5% Né Tránh).
     - Viết hàm `canEnterEnhancedSeclusion` thẩm định toàn diện thọ nguyên, linh thạch/tích cốc đan, cảnh giới yêu cầu gieo mầm và trạng thái bản mệnh.
     - Viết hàm `executeEnhancedSeclusion` thực thi trừ tài nguyên, tăng tuổi thọ, tính tu vi cơ sở, phân chia tu vi Khí Linh, giảm đan độc (-2/năm), tái tính chân nguyên và tích lũy tiến độ Đạo Quả.
     - Viết hàm `consumeDaoFruit` phục dụng Đạo Quả và dung hợp vĩnh viễn Affix vào kinh mạch.
  3. **Đồng Bộ Save Migration & Engine Cốt Lõi:**
     - `lib/save-migration.ts`: Thêm `migrateSeclusionEnhancementData(player)` và cập nhật `normalizePlayerData` đảm bảo idempotent, an toàn tuyệt đối khi nạp save từ mọi phiên bản cũ.
     - `lib/destiny-data.ts`: Tích hợp `player.absorbedDaoAffixes` vào `calculateCombatStats` giúp toàn bộ hệ thống chiến đấu (Boss, PvP, Bí Cảnh, Cấm Địa, Tông Môn Chiến) tự động hưởng lợi.
     - `lib/game-logic/cultivation.ts`: Tích hợp tỷ lệ `(player.qiPurity / 100)` trực tiếp vào công thức tính tỷ lệ đột phá cảnh giới.
     - `lib/natal-artifact-logic.ts`: Phòng vệ an toàn cho `statsBonus` và `resonanceRate`.
  4. **Custom Action Hook (`hooks/useEnhancedSeclusionActions.ts`, `hooks/index.ts`):**
     - Đóng gói toàn bộ reactive state, live preview tính toán (lượng đan độc sẽ đào thải, % tu vi chia Khí Linh, tiến độ tích lũy hạt giống) và các action handler thực thi bế quan, phục dụng Đạo Quả.
  5. **Giao Diện Người Dùng Cổ Phong UI/UX (`components/modals/EnhancedSeclusionModal.tsx`, `components/dashboard/MiddleColumn.tsx`, `components/GameDashboard.tsx`):**
     - **Bảng Thiết Lập Nhập Định (Pre-Seclusion Panel):** Slider thọ nguyên trực quan, 3 Thẻ Trọng Tâm Tam Hóa (Thanh Lọc Kinh Mạch, Ôn Dưỡng Bản Mệnh, Gieo Mầm Đạo Chủng), Bộ chọn Đạo Chủng đa dạng có khóa cảnh giới, Nút bấm hoàng kim phát quang `🧘 BẾ QUAN NHẬP ĐỊNH (TAM HÓA QUY NGUYÊN)`.
     - **Modal Bản Thu Hoạch Đại Đạo (Seclusion Harvest Summary):** Thiết kế dạng Sớ Tu Tiên Cổ Phong hiển thị chi tiết tuế nguyệt trôi qua, tu vi, đan độc tẩy trừ, Khí Linh thăng hoa và Đạo Quả đơm hoa kết trái.
     - **Tích Hợp MiddleColumn:** Nút bấm phát quang "Tam Hóa Chi Cảnh" trên Header Bế Quan và Banner Cổ Phong "Tam Hóa Chi Cảnh (Đại Đạo Tam Trọng)" bên trong chế độ Tuế Nguyệt Bế Quan.
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/types/seclusion-enhancement.ts` (Domain types Đạo Chủng, Đạo Quả, Kết quả bế quan).
  - Mới: `lib/seclusion-enhancement-logic.ts` (Pure business logic Tam Hóa Chi Cảnh).
  - Mới: `hooks/useEnhancedSeclusionActions.ts` (Custom hook điều phối bế quan).
  - Mới: `components/modals/EnhancedSeclusionModal.tsx` (Giao diện Cổ Phong Thiết Lập & Thu Hoạch Đại Đạo).
  - Mới: `scripts/test-seclusion-enhancement.ts` (Test suite tự động 6 ca kiểm thử).
  - Cập nhật: `lib/types/player.ts` & `lib/types/index.ts` (Khai báo trường Đan Độc, Đạo Chủng, Đạo Quả).
  - Cập nhật: `lib/destiny-data.ts` (Cộng dồn absorbedDaoAffixes vào calculateCombatStats).
  - Cập nhật: `lib/game-logic/cultivation.ts` (Đưa qiPurity vào tỷ lệ đột phá cảnh giới).
  - Cập nhật: `lib/save-migration.ts` (migrateSeclusionEnhancementData & normalizePlayerData).
  - Cập nhật: `lib/natal-artifact-logic.ts` (Defensive guard cho statsBonus & resonanceRate).
  - Cập nhật: `hooks/index.ts` & `components/modals/index.ts` (Export barrel pattern).
  - Cập nhật: `components/dashboard/MiddleColumn.tsx` (Tích hợp Nút bấm và Banner Tam Hóa Chi Cảnh).
  - Cập nhật: `components/GameDashboard.tsx` (Render EnhancedSeclusionModal).
  - Cập nhật: `CHANGELOG.md` (Ghi nhận lịch sử kỹ thuật).
- **Kết quả kiểm thử & Nghiệm thu (Verification & Quality Gates):**
  - **Automated Test Suite:** Chạy `npx tsx scripts/test-seclusion-enhancement.ts` ➔ **38/38 tests passed (100.0%)**, bao phủ trọn vẹn cả 6 ca kiểm thử: Toxicity Cleansing Invariant, Artifact Nourishment Invariant, Dao Seed Maturity Progression, Affix Consumption Invariant, Lifespan Boundary Guard, và Save Migration Invariant.
  - **Type Safety Check:** Chạy `npx tsc --noEmit` ➔ **0 lỗi (Zero Errors)** trên toàn bộ codebase.
  - **Production Build:** Chạy `npm run build` trên Turbopack ➔ **Compile thành công 100%**, toàn bộ 8/8 routes hợp lệ.

### [2026-10-03 03:40] - Triển Khai Toàn Diện Tính Năng "Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại (Sect Wars & Wild Territory Conquest)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Tông Môn Tự Lập (`custom-sect`) đã có Khố Phòng, Đệ Tử và Chấp Sự nhưng các hoạt động chủ yếu mang tính chất nội bộ, thiếu sự cọ xát với các thế lực bên ngoài. Bản đồ thế giới chưa có cơ chế cạnh tranh địa bàn và tài nguyên hoang dã.
  - Thiết kế, triển khai và kiểm thử toàn diện tính năng **"Tông Môn Đại Chiến & Tranh Đoạt Linh Sơn Dã Ngoại (Sect Wars & Wild Territory Conquest)"**, đáp ứng 4 Ràng buộc bất biến (Hard Invariants):
    1. **Bảo Toàn Save Game & Idempotent Migration:** Giữ nguyên vẹn cấu trúc `customSect` và danh sách đệ tử, tự động bổ sung an toàn `wildSpiritMountains: []`, `rivalSects: []`, `sectWarHistory: []`, `tributeVault: {}`, `sectMorale: 75` khi nạp save cũ.
    2. **Kiến Trúc Tách Biệt Tuyệt Đối (Pure Logic Separation):** 100% logic mô phỏng 3 giai đoạn chiến tranh Tam Trọng Đoán, tính toán thương vong, sĩ khí và chia phần tài nguyên chiếm đóng nằm trong `lib/sect-war-logic.ts`.
    3. **Khóa Đơn Nhiệm Đệ Tử Khi Xuất Chinh (War Dispatch State Lock):** Đệ tử cử đi viễn chinh nhận cờ `isDispatchedToWar: true`, bị khóa chặt chẽ: không thể làm nông, không thể trục xuất, không lập y bát, không thể triệu hồi bổ nhiệm vào Tinh Hải hay Khố Phòng.
    4. **Đồng Bộ Hai Chiều Với Khố Phòng & Ngoại Tuyến (Offline Economy Sync):** Tài nguyên sinh ra từ các Linh Sơn chiếm đóng dã ngoại được cộng dồn chuẩn xác vào Khố Phòng Tông Môn (`custom-sect-logic.ts`) cả trong thời gian thực và thời gian người chơi bế quan ngoại tuyến (`offline-progress.ts` & `hooks/useOfflineProgress.ts`).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/sect-war.ts`, `lib/types/custom-sect.ts`, `lib/types/offspring.ts`, `lib/types/index.ts`):**
     - Định nghĩa `WildSpiritMountain`, `RivalSectFaction`, `SectWarStageResult`, `SectWarBattleReport`, `TributeVault`, `SectWarState`, `WarDeclarationValidation`.
     - Bổ sung cờ `isDispatchedToWar?: boolean` cho `ProceduralDisciple` và `ImmortalChild`.
  2. **Pure Business Logic Engine (`lib/sect-war-logic.ts`):**
     - Khởi tạo 4 Đại Thế Lực Lân Bang (`INITIAL_RIVAL_SECTS`: Vạn Kiếm Tiên Tông, Huyết Ma Giáo, Thiên Cơ Các, Bách Dược Cốc) và 6 Cứ Điểm Linh Sơn Dã Ngoại (`INITIAL_SPIRIT_MOUNTAINS`: Thái Cổ Dược Sơn, Cực Phẩm Linh Thạch Mạch, Thiên Địa Linh Tuyền, Thiên Kiếm Phong, Huyết Ma Cốc, Thiên Cơ Đài).
     - Thẩm định điều kiện tuyên chiến (`canDeclareWarOnMountain`): Yêu cầu Chính Điện cấp 2 hoặc danh vọng $\ge 100$, tối thiểu 10 đệ tử xuất chinh, Thống Soái đạt chuẩn (Trưởng Lão / Xuất Sư / Hóa Thần Kỳ), đủ 10,000 Linh Thạch lộ phí hành quân.
     - Mô phỏng Tam Trọng Đoán (`resolveThreeStageSectWar`):
       - *Hiệp 1: Phá Trận (Siege Array Breach):* So sánh công lực quân đoàn + phá trận thần lôi với độ bền Hộ Sơn Cổ Trận.
       - *Hiệp 2: Đấu Tướng Lôi Đài (Champions Duel):* 1v1 Thống Soái đối đầu Đại Tướng trấn thủ của Linh Sơn.
       - *Hiệp 3: Quân Đoàn Hỗn Chiến (Legion Clash):* Tổng lực giáp kích theo sĩ khí và tương quan lực lượng.
     - Tính toán sản lượng Linh Sơn (`calculateMountainYields`): cộng dồn linh thạch, thảo dược và điểm danh vọng theo thời gian thực tế và ngoại tuyến.
     - Bổ nhiệm trấn thủ Linh Sơn (`stationGarrisonToMountain`) & Sách lược ngoại giao (`negotiateDiplomacy`: truce, bribe, alliance, declare_war).
  3. **Tích Hợp Khố Phòng & Ngoại Tuyến (`lib/custom-sect-logic.ts`, `lib/offline-progress.ts`, `hooks/useOfflineProgress.ts`):**
     - Tích hợp sản lượng từ các Linh Sơn chiếm đóng dã ngoại vào `calculateSectVaultYield` và cơ chế tính toán AFK offline progress.
  4. **Save Migration (`lib/save-migration.ts`):**
     - Xây dựng hàm `migrateSectWarData(player: PlayerStats): PlayerStats` và chuẩn hóa an toàn trong `normalizePlayerData`.
  5. **Custom Hook (`hooks/useSectWarActions.ts`, `hooks/index.ts`):**
     - Cung cấp các action: `handleDeclareWar`, `handleStationGarrison`, `handleNegotiateDiplomacy`, `handleHarvestMountains`.
  6. **Giao Diện Người Dùng Cổ Phong UI/UX (`components/tabs/SectWarView.tsx`, `components/tabs/CustomSectTab.tsx`, `components/tabs/SectTab.tsx`, `components/GameDashboard.tsx`):**
     - Bổ sung Sub-tab thứ 5 "⚔️ Tông Môn Đại Chiến (Linh Sơn)" trong Tông Môn Tự Lập.
     - Sa Bàn Cương Vực (Territory Hex Map) vector SVG cổ phong với hiệu ứng hào quang theo phe phái kiểm soát.
     - Bảng Quân Cơ Viễn Chinh (War Council Modal) tuyển chọn Thống Soái, tuyển chọn đệ tử, dự toán tỷ lệ thắng.
     - Chiến Báo Tam Trọng Đoán (Animated Battle Report Modal) hiển thị diễn biến giằng co từng hiệp, thương vong và chiến lợi phẩm.
     - Sách Lược Ngoại Giao (Diplomacy Panel) giao thiệp với 4 thế lực lân bang.
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/types/sect-war.ts` (Domain types Tông Môn Đại Chiến).
  - Mới: `lib/sect-war-logic.ts` (Pure business logic Tam Trọng Đoán, Linh Sơn, Ngoại Giao).
  - Mới: `hooks/useSectWarActions.ts` (Custom action hook điều phối chiến dịch).
  - Mới: `components/tabs/SectWarView.tsx` (Component Sa Bàn, Bảng Quân Cơ, Chiến Báo).
  - Mới: `scripts/test-sect-war.ts` (Test suite tự động độc lập 6 ca kiểm thử).
  - Cập nhật: `lib/types/index.ts`, `lib/types/custom-sect.ts`, `lib/types/offspring.ts` (Mở rộng types và cờ isDispatchedToWar).
  - Cập nhật: `lib/save-migration.ts` (migrateSectWarData & normalizePlayerData).
  - Cập nhật: `lib/custom-sect-logic.ts` (Tính sản lượng Linh Sơn vào Khố Phòng và khóa viễn chinh).
  - Cập nhật: `lib/disciple-appointment-logic.ts` (Khóa bổ nhiệm khi đệ tử đang viễn chinh).
  - Cập nhật: `lib/offline-progress.ts` & `hooks/useOfflineProgress.ts` (Đồng bộ sản lượng Linh Sơn ngoại tuyến).
  - Cập nhật: `hooks/index.ts` (Barrel export useSectWarActions).
  - Cập nhật: `components/tabs/CustomSectTab.tsx`, `components/tabs/SectTab.tsx`, `components/GameDashboard.tsx` (Tích hợp Sub-tab và điều phối dữ liệu).
- **Kiểm thử & Đảm bảo chất lượng (Verification & Tests):**
  - `npx tsx scripts/test-sect-war.ts`: **40/40 assertions passed 100%** bao phủ 6 ca kiểm thử:
    1. *War Validation Guard:* Không có Thống Soái hoặc thiếu lộ phí hoặc dưới 10 đệ tử bị chặn xuất chinh chuẩn xác.
    2. *Dispatched Lock Invariant:* Đệ tử viễn chinh nhận `isDispatchedToWar: true`, chặn làm nông, bổ nhiệm, trục xuất, lập y bát.
    3. *Three-Stage Battle Execution:* Trải qua đúng 3 hiệp Tam Trọng Đoán (Phá Trận $\rightarrow$ Đấu Tướng $\rightarrow$ Hỗn Chiến) và giành chiến thắng.
    4. *Territory Transfer & Income:* Chuyển quyền kiểm soát sang `player_sect`, tính đúng sản lượng Linh Thạch, Dược liệu vào Khố Phòng.
    5. *Casualties & Morale Invariant:* Thương vong đệ tử trừ chính xác khỏi môn hạ; sĩ khí biến động chuẩn theo thắng bại.
    6. *Save Migration Invariant:* Nạp mock save cũ chuẩn hóa an toàn 100%, bảo đảm tính idempotent.
  - `npx tsc --noEmit`: **0 lỗi TypeScript Strict Mode**.
  - `npm run build`: **Turbopack Production Build thành công 100%**.

### [2026-10-03 03:25] - Triển Khai Toàn Diện Tính Năng "Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense / Tinh Vực Cộng Hưởng Trận)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trong phân hệ Chư Thiên Tinh Hải, các Cứ Điểm Tinh Cầu (`CosmicNode`) và hệ thống Hàng Phòng Ngự Tru Ma Pháo (`cosmic-defense`) hoạt động hoàn toàn cục bộ, đơn lẻ. Khi gặp đại ba xâm lăng quy mô lớn của Vực Ngoại Dị Tộc (Hư Không Ma Triều), các cứ điểm vùng rìa dễ bị thất thủ do hỏa lực cô lập, trong khi Tru Ma Pháo tại các cứ điểm lân cận lại nhàn rỗi.
  - Thiết kế, triển khai và kiểm thử toàn diện tính năng **"Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense / Tinh Vực Cộng Hưởng Trận)"**, đáp ứng 4 Ràng buộc bất biến (Hard Invariants):
    1. **Bảo Toàn Save Game & Idempotent Migration:** Giữ nguyên vẹn cấu trúc `CosmicState` và `CosmicDefenseState`, bổ sung an toàn `sectorResonanceGrid: []`, `resonanceLinks: []`, `crossFireEnergyBuffer: 0` khi nạp save cũ.
    2. **Kiến Trúc Tách Biệt Tuyệt Đối (Pure Logic Separation):** 100% thuật toán khoảng cách Euclid, hệ số suy hao hỏa lực theo cự ly $(1 - \text{Distance}/300)$, hiệu suất truyền dẫn $0.5 - 0.9$, hỏa lực chi viện chéo và giải quyết phòng ngự nằm độc lập trong `lib/sector-resonance-logic.ts`.
    3. **Phòng Vệ Năng Lượng & Chống Khai Thác Đạn Vô Hạn (Energy & Anti-Exploit Guard):** Pháo chi viện chéo bắt buộc tiêu hao tài nguyên (500 Linh Thạch hoặc Buffer dự trữ mỗi phát nã). Cạn kiệt tài nguyên sẽ lập tức ngắt quyền khai hỏa, không cho phép bắn nợ tài nguyên.
    4. **Đồng Bộ Hai Chiều Với Engine Phòng Thủ Ngoại Tuyến (Offline Progress Sync):** Áp dụng toàn bộ hỏa lực chi viện chéo của mạng lưới khi tính toán kết quả phòng thủ khi người chơi vắng mặt (`lib/offline-progress.ts` & `lib/cosmic-defense-logic.ts`).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/sector-resonance.ts`, `lib/types/index.ts`, `lib/types/cosmic-defense.ts`):**
     - Định nghĩa `SectorResonanceLink`, `CrossFireSupportReport`, `SectorResonanceDefenseResult`, `SectorResonanceGridState`, `GridAuraType`, `ResonanceLinkEstablishCheck`.
     - Mở rộng `CosmicDefenseState` với các trường an toàn `sectorResonanceGrid`, `resonanceLinks`, `crossFireEnergyBuffer`.
  2. **Pure Business Logic (`lib/sector-resonance-logic.ts`):**
     - `calculateCosmicDistance`: Tính khoảng cách Euclid $R = \sqrt{\Delta x^2 + \Delta y^2}$.
     - `calculateTransmissionEfficiency`: Hiệu suất truyền dẫn $0.5 - 0.9$ theo cự ly ($0.9 - 0.4 \times (d / 250)$) và cấp độ nâng cấp dây chuyền (+0.025 mỗi cấp).
     - `canEstablishResonanceLink`: Thẩm định điều kiện mạng lưới (cả 2 cứ điểm đã chiếm đóng, đều có Tru Ma Pháo cấp $\ge 1$, khoảng cách $R \le 250$, đủ 5,000 Linh Thạch kích hoạt).
     - `establishResonanceLink` & `disconnectResonanceLink`: Tạo lập và ngắt kết nối tuyến năng lượng.
     - `upgradeResonanceLink`: Nâng cấp dây chuyền truyền dẫn (10,000 Linh Thạch / cấp, tối đa cấp 5).
     - `evaluateResonanceGridAuras`: Đồ thị vô hướng phát hiện chu trình tam giác (3-cycle) và mạng lưới $\ge 3$ cứ điểm, kích hoạt 2 Đại Lĩnh Vực:
       - *Thái Vi Tỏa Ma Quang:* Giảm 25% công kích của quái vật.
       - *Hư Không Phản Chấn Trận:* Chuyển 15% hỏa lực pháo kích thành lá chắn năng lượng bảo vệ cứ điểm.
     - `calculateCrossFireDamage` & `calculateCrossFireArtillerySupport`: Khai hỏa chi viện chéo, kiểm tra cạn kiệt tài nguyên (Anti-Exploit), tính sát thương suy hao theo cự ly và chuyển hóa lá chắn.
  3. **Tích Hợp Engine Phòng Ngự & Offline Sync (`lib/cosmic-defense-logic.ts`, `lib/offline-progress.ts`):**
     - Tích hợp chi viện chéo vào `resolveAutoGarrisonDefense`: khi cứ điểm bị công hãm, tự động quét các cứ điểm liên kết để nã pháo giảm máu quái trước khi giao tranh với trấn thủ sĩ.
     - Triển khai `resolveOfflineCosmicDefense` trong `calculateOfflineProgress` để tự động hóa phòng thủ khi vắng mặt, đồng bộ kết quả vào `cosmicState`.
  4. **Save Migration (`lib/save-migration.ts`):**
     - Viết hàm `migrateSectorResonanceData(player: PlayerStats): PlayerStats`.
     - Chuẩn hóa mặc định trong `normalizePlayerData` cho `cosmicState.defenseState`.
  5. **Custom Hook (`hooks/useSectorResonanceActions.ts`, `hooks/index.ts`):**
     - Hook cung cấp `handleToggleLink`, `handleUpgradeGridTransmission`, `handleManualBombardment`, theo dõi trạng thái `isBombarding` và kết quả pháo kích.
  6. **Giao Diện Người Dùng Cổ Phong UI/UX (`components/cosmic/CosmicMapModal.tsx`):**
     - Vẽ Tuyến Năng Lượng Tinh Vực (Energy Grid Vectors) bằng SVG trên sa bàn: nét đứt màu lam phát quang nhẹ (`stroke-cyan-500/40`) khi bình thường, chuyển thành luồng năng lượng vàng kim cuộn sóng (`stroke-amber-400 animate-pulse`) khi khai hỏa.
     - Drawer cứ điểm bổ sung sub-tab thứ 3 **"⚡ Tinh Vực Liên Kết"**: hiển thị trạng thái Lĩnh Vực Tinh Võng, kho đạn dược Linh Thạch, nút Khai Hỏa Chi Viện Khẩn Cấp, danh sách tuyến đang hoạt động và danh sách cứ điểm lân cận khả dụng ($R \le 250$).
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/types/sector-resonance.ts` (Domain types Trận Pháp Liên Kết Tinh Vực).
  - Mới: `lib/sector-resonance-logic.ts` (100% Pure logic topo, cự ly Euclid, chi viện chéo, aura).
  - Mới: `hooks/useSectorResonanceActions.ts` (Custom action hook điều khiển mạng lưới tinh vực).
  - Mới: `scripts/test-sector-resonance.ts` (Test suite kiểm thử tự động độc lập 6 ca kiểm thử).
  - Cập nhật: `lib/types/index.ts` (Barrel export types).
  - Cập nhật: `lib/types/cosmic-defense.ts` (Mở rộng CosmicDefenseState).
  - Cập nhật: `lib/save-migration.ts` (Hàm migrateSectorResonanceData & normalizePlayerData).
  - Cập nhật: `lib/cosmic-defense-logic.ts` (Tích hợp chi viện chéo vào resolveAutoGarrisonDefense và resolveOfflineCosmicDefense).
  - Cập nhật: `lib/offline-progress.ts` (Đồng bộ phòng thủ tinh hải ngoại tuyến).
  - Cập nhật: `hooks/useOfflineProgress.ts` (Đồng bộ updatedCosmicState).
  - Cập nhật: `hooks/index.ts` (Barrel export useSectorResonanceActions).
  - Cập nhật: `components/cosmic/CosmicMapModal.tsx` (Vẽ SVG Energy Grid Vectors & Tab Tinh Vực Liên Kết).
- **Kiểm thử & Đảm bảo chất lượng (Verification & Tests):**
  - `npx tsx scripts/test-sector-resonance.ts`: **23/23 assertions passed 100%** trên cả 6 ca kiểm thử bắt buộc:
    1. *Topology Guard:* Cứ điểm chưa chiếm lĩnh hoặc $R > 250$ bị từ chối; $R \le 250$ và có pháo được duyệt.
    2. *Distance Falloff Invariant:* Cự ly 50 gây $13,667$ sát thương > cự ly 200 gây $3,867$ sát thương.
    3. *Energy Depletion Guard:* Hết Linh Thạch ngắt kết nối lập tức, không bắn nợ tài nguyên.
    4. *Triangular Resonance Grid Aura:* Kích hoạt thành công Thái Vi Tỏa Ma Quang (giảm chính xác 25% công kích) & Hư Không Phản Chấn Trận (15% lá chắn).
    5. *Full Invasion Simulation:* Đại ba 100,000 HP bị 3 cứ điểm bắn 45,000 sát thương $\rightarrow$ đợt quái còn đúng 55,000 HP.
    6. *Save Migration Invariant:* Nạp mock save cũ chưa có trường mạng lưới được chuẩn hóa an toàn, không sinh lỗi undefined.
  - `npx tsc --noEmit`: **0 lỗi TypeScript Strict Mode**.
  - `npm run build`: **Turbopack Production Build thành công 100%**.

### [2026-10-03 03:10] - Triển Khai Toàn Diện Tính Năng "Đấu Giá Hắc Thị (Black Market Auction) • U Minh Hắc Thị"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây trong game, các vật phẩm cấm kỵ (Ma Đan, Huyết Tinh, Tà Khí, Tà Đạo Bí Kíp) và Linh Noãn Biến Dị (thu hoạch từ Thú Uyển hoặc Bí Cảnh Tà Ma) chỉ có thể bán tại Phường Thị với giá rất rẻ hoặc bị hạn chế giao dịch. Đồng thời, vòng lặp kinh tế thiếu đi một cơ chế đầu cơ mạo hiểm "High Risk - High Reward" mang đậm phong cách thế giới ngầm tu chân giới.
  - Thiết kế, triển khai và kiểm thử toàn diện tính năng **"Đấu Giá Hắc Thị (Black Market Auction)"** tại phân khu cấm địa **U Minh Hắc Thị**, đáp ứng 4 Ràng buộc bất biến (Hard Invariants):
    1. **Chu Kỳ Trăng Tròn (Full Moon / Vọng Nguyệt Chi Dạ):** Hắc Thị chỉ kích hoạt định kỳ vào Đêm Trăng Tròn (ngày 14, 15, 16 mỗi chu kỳ 30 ngày tu tiên). Các ngày khác cấm địa bị kết giới Hắc Vụ Trận Pháp phong tỏa nhằm tránh tai mắt của Tiên Thiên Chấp Pháp Trận.
    2. **Sàn Đấu Giá Cấm Vật & Linh Noãn Tà Đạo (Contraband Auction Lots):** Người chơi có thể đấu giá mua báu vật tà đạo cực hiếm do các NPC Ma Tu ẩn danh đưa lên, hoặc tự mình ký gửi cấm vật để thu về **Lợi Nhuận Gấp Đôi ($\ge \times 2$)** so với thị trường thông thường.
    3. **Cơ Chế Bại Lộ & Truy Quét (Bust Risk Engine):** Mỗi lần đặt giá, đẩy giá (bidding war) hoặc ký gửi cấm phẩm sẽ làm tăng **Thanh Nguy Cơ Bại Lộ (Bust Risk: 0% - 100%)**. Khi nguy cơ $> 50\%$, có xác suất `(bustRisk - 40)%` bị Đội Tuần Tra Tiên Quan / Chính Đạo Chấp Pháp Giả ập vào truy quét với 3 lựa chọn sinh tử: *Nộp Phạt Đút Lót (Bribe - mất 30% Linh Thạch)*, *Vứt Của Chạy Lấy Người (Flee - tịch thu cấm phẩm & ký quỹ)*, hoặc *Quyết Chiến Tru Sát Chấp Pháp Giả (Fight - Thắng nhận lại toàn bộ + tăng +30 Ma Tính `demonicNature`)*.
    4. **Cơ Chế Đấu Giá Thời Gian Thực Với NPC (Dynamic Bidding AI):** NPC Ma Đầu tự động nâng giá theo nhịp đếm ngược, mô phỏng không khí tranh đoạt bảo vật căng thẳng. Khi người chơi bị NPC vượt giá (Outbid), 100% Linh Thạch ký quỹ được hoàn trả tức thì vào túi đồ.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/black-market.ts`, `lib/types/index.ts`, `lib/types/player.ts`):**
     - Định nghĩa `ContrabandCategory` (5 nhóm: `forbidden_pill`, `demonic_artifact`, `cursed_tome`, `heretical_egg`, `abyssal_ore`), `MoonPhase`, `BlackMarketLot`, `BlackMarketSessionState`, `BlackMarketHistoryRecord`, `RaidResolutionChoice`, `RaidResolutionResult`.
     - Mở rộng `PlayerStats` với các trường an toàn `blackMarketState?: BlackMarketSessionState | null`, `bustRiskMeter?: number`, `contrabandHistory?: BlackMarketHistoryRecord[]`, `spiritStones?: number`.
  2. **Pure Business Logic (`lib/black-market-auction-logic.ts`):**
     - `evaluateMoonPhase(dayNumber)`: Kiểm tra chu kỳ thiên văn 30 ngày (ngày 14, 15, 16 là Trăng Tròn mở cửa; các ngày khác đóng cửa và tính toán chính xác ngày mở cửa kế tiếp).
     - `CONTRABAND_TEMPLATES` & `NPC_MA_DAU_NAMES`: Kho mẫu cấm vật quý hiếm (Huyết Linh Đoạt Hồn Đan, Vạn Ma Phệ Hồn Phiến, Linh Noãn Cửu U Ma Tước...) và danh xưng Ma Đầu (Hắc Xà Lão Quái, Cốt Ma Tôn Giả, Huyết Ảnh Cuồng Nhân...).
     - `generateBlackMarketLots`: Sinh ngẫu nhiên 4 - 6 lô hàng cấm phẩm với giá khởi điểm từ $1.5\times \sim 2.0\times$ giá gốc thị trường.
     - `simulateNpcBiddingStep`: Thuật toán AI Ma Đầu tự động nâng giá theo nhịp đếm ngược.
     - `playerPlaceBid`: Trả giá mua, trừ tiền ký quỹ vào `playerEscrowStones`, gia tăng Bust Risk, kiểm tra kích hoạt cờ đột kích.
     - `handleNpcOutbidRefund`: Hoàn trả 100% tiền ký quỹ khi người chơi bị vượt giá (Outbid Invariant).
     - `consignPlayerContraband`: Ký gửi cấm phẩm với giá khởi điểm $\ge 2\times$ giá gốc, khóa vật phẩm trong hòm đồ với cờ `isLockedInEscrow: true`.
     - `settleBlackMarketLot`: Kết toán phiên đấu giá; nếu thắng trứng cấm, chuyển thẳng vào lồng ấp Thú Uyển với cờ `isHeretical: true`; nếu người chơi bán, nhận đủ $\ge \times 2$ tiền lời.
     - `checkBustRaidTrigger`: Thẩm định nguy cơ bại lộ $> 50\%$ kích hoạt biến cố truy quét.
     - `resolveRaidEncounter`: Xử lý 3 lựa chọn sinh tử Bribe, Flee, Fight (đồng bộ +30 Ma Tính khi tử chiến toàn thắng).
  3. **Save Migration & Idempotent Guard (`lib/save-migration.ts`):**
     - Hàm `migrateBlackMarketData(player)`: Tự động khởi tạo an toàn `blackMarketState: null`, `bustRiskMeter: 0`, `contrabandHistory: []`; tự động giải phóng các vật phẩm bị kẹt trong escrow (`isLockedInEscrow = false`) nếu phiên chợ bị gián đoạn; bảo toàn 100% cấu trúc `player.inventory`, `player.spiritStones`, `beastGarden.eggs` và cờ `isHeretical`.
     - Tích hợp chuẩn hóa tự động vào `normalizePlayerData`.
  4. **Custom Hook (`hooks/useBlackMarketActions.ts`, `hooks/index.ts`):**
     - Quản lý vòng lặp đếm ngược thời gian đấu giá (1s tick), vòng lặp AI NPC trả giá ngẫu nhiên (3-5s tick), tự động kết toán và hoàn trả ký quỹ, hỗ trợ các actions: `handlePlaceBid`, `handleConsignItem`, `handleResolveRaid`, `handleSettleLot`.
  5. **Giao Diện Người Dùng Cổ Phong Ma Mị UI/UX (`components/tabs/BlackMarketView.tsx`, `components/tabs/SecretRealmTab.tsx`, `hooks/useSecretRealmActions.ts`):**
     - `BlackMarketView`: Tông màu đen huyền bí kết hợp ánh tím ma mị và đỏ huyết nguyệt (`bg-zinc-950 border-purple-900/50`).
     - Thanh đo Khí Tức Bại Lộ (Bust Risk Gauge) đổi màu theo ngưỡng nguy hiểm, phù hiệu Trăng Tròn / Vọng Nguyệt phát sáng kèm đếm ngược ngày mở cửa.
     - Thẻ bài đấu giá cấm phẩm viền tà khí, huy hiệu `[💀 CẤM VẬT X2]`, nút bấm phát quang `🔥 NÂNG GIÁ`, modal trả giá trực tiếp.
     - Phân khu Ký Gửi Cấm Vật x2 lời, giao diện Nhật Ký Giao Dịch Hắc Thị.
     - Modal Biến Cố Đột Kích rung chấn viền đỏ rực với 3 lựa chọn sinh tử tương tác trực tiếp.
     - Tích hợp thành sub-tab thứ 4 **"💀 U Minh Hắc Thị"** trong phân khu Cấm Địa Bí Cảnh (`SecretRealmTab.tsx`).
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/types/black-market.ts` (Định nghĩa types Đấu Giá Hắc Thị).
  - Mới: `lib/black-market-auction-logic.ts` (100% pure business logic phân hệ).
  - Mới: `hooks/useBlackMarketActions.ts` (Custom hook quản lý vòng lặp thời gian thực).
  - Mới: `components/tabs/BlackMarketView.tsx` (Giao diện Cổ Phong Ma Mị Đấu Giá Hắc Thị).
  - Mới: `scripts/test-black-market-auction.ts` (Test suite tự động 6 ca kiểm thử bao phủ toàn diện).
  - Sửa đổi: `lib/types/index.ts` (Export black-market types).
  - Sửa đổi: `lib/types/player.ts` (Thêm các trường black market & spiritStones vào `PlayerStats`).
  - Sửa đổi: `lib/save-migration.ts` (Thêm hàm migration `migrateBlackMarketData` và chuẩn hóa trong `normalizePlayerData`).
  - Sửa đổi: `hooks/index.ts` (Export `useBlackMarketActions`).
  - Sửa đổi: `hooks/useSecretRealmActions.ts` (Thêm sub-tab `black_market`).
  - Sửa đổi: `components/tabs/SecretRealmTab.tsx` (Nhúng sub-tab U Minh Hắc Thị và render `BlackMarketView`).
- **Kết quả kiểm thử & Nghiệm thu (Verification & Invariants):**
  - Test suite `scripts/test-black-market-auction.ts`: **6/6 ca kiểm thử ĐẠT 100%**:
    1. Kiểm Tra Chu Kỳ Mở Cửa (Full Moon Gating): Ngày 5, 20 đóng cửa; Ngày 14, 15, 16 mở cửa thành công.
    2. Ký Quỹ Tiền Tệ & Hoàn Trả (Escrow & Outbid Invariant): Đặt giá 10,000 Linh Thạch bị trừ vào ký quỹ; khi NPC nâng 11,000 hoàn trả đúng 10,000 không thiếu 1 cắc.
    3. Lợi Nhuận Ký Gửi Gấp Đôi (Double Profit Settlement): Ký gửi vật phẩm giá gốc 5,000 thu về $\ge 10,000$ Linh Thạch, vật phẩm bị khóa ký quỹ và giải phóng khi bán xong.
    4. Tích Lũy Bust Risk & Kích Hoạt Đột Kích: Bust Risk $> 50\%$ kích hoạt chuẩn xác cờ `raidIncidentActive: true`.
    5. Giải Quyết Biến Cố Đột Kích & Ma Tính: Fight thắng tăng chuẩn xác +30 Ma Tính `demonicNature`; Bribe khấu trừ đúng 30% Linh Thạch và xóa nguy cơ bại lộ.
    6. Kiểm Thử Save Migration: Nạp mock save cũ chưa có trường Hắc Thị qua `migrateBlackMarketData` chuẩn hóa 100% không phát sinh lỗi undefined, giải phóng an toàn đồ kẹt ký quỹ.
  - Kiểm tra kiểu dữ liệu: `npx tsc --noEmit` **0 lỗi (Zero TypeScript errors)**.
  - Biên dịch sản xuất: `npm run build` **Compile thành công 100% trên Turbopack trong 9.7s**.

---

### [2026-10-03 02:50] - Triển Khai Toàn Diện Tính Năng "Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây trong game, hai phân hệ **Thần Thông (Equipped Kungfu/Skills)** và **Khí Linh Bản Mệnh Pháp Bảo (Natal Artifact Spirit)** hoạt động hoàn toàn tách biệt, chưa có sự liên kết cộng hưởng chiến thuật. Điều này làm giảm chiều sâu xây dựng nhân vật (buildcraft) và chưa khai thác được quy luật Ngũ Hành Tương Sinh - Tương Hợp trong chiến đấu tiên hiệp.
  - Thiết kế, triển khai và kiểm thử toàn diện tính năng **"Cộng Hưởng Dị Tượng Ngũ Hành (Domain Resonances / Dị Tượng Lĩnh Vực)"**, tự động nhận diện sự kết hợp đồng thời giữa các Thần Thông đang trang bị và Bản Tính / Thuộc Tính của Khí Linh để kích hoạt các Dị Tượng Lĩnh Vực độc bản mang lại hiệu ứng chiến đấu đặc thù (Field Auras / Combat Passives):
    1. **Thiêu Đốt Chân Nguyên (Hỏa hệ + Khí Linh Sát Phạt):** Kích hoạt dị tượng *"Liệt Diễm Phần Thần"* — thiêu đốt 5% Chân Nguyên (MP) đối phương mỗi hiệp, khi đối phương cạn kiệt Chân Nguyên áp đặt trạng thái "Hụt Khí" (-15% Công Kích).
    2. **Hồi Phục Sinh Tức (Mộc hệ + Khí Linh Ôn Hòa / Hộ Chủ):** Kích hoạt dị tượng *"Sinh Sinh Bất Tức"* — hồi phục 6% Sinh Lực (HP) tối đa mỗi hiệp và thanh tẩy các trạng thái suy yếu, trúng độc.
    3. **Phá Giáp Trảm Tiên (Kim hệ + Khí Linh Lãnh Khốc / Kiên Định):** Kích hoạt dị tượng *"Bạch Hổ Trảm Hồn"* — bỏ qua 25% phòng ngự hộ thể và tăng 15% tỷ lệ Bạo Kích tất sát.
    4. **Hàn Băng Tỏa Khí (Thủy hệ + Khí Linh Cơ Trí / Huyễn Mộng):** Kích hoạt dị tượng *"Huyền Minh Hàn Vực"* — làm chậm 20% tốc độ xuất chiêu và giảm 25% tỷ lệ phát động Thần Thông của địch.
    5. **Thần Sơn Trấn Nhạc (Thổ hệ + Khí Linh Trầm Ổn):** Kích hoạt dị tượng *"Huyền Vũ Trấn Thiên"* — hấp thu sát thương quy đổi thành hộ thuẫn bằng 12% Máu tối đa và phản chấn 20% thương tổn nhận vào.
    6. **Lôi Ngục Tru Ma (Lôi/Phong Biến Dị + Khí Linh Cuồng Bạo):** Kích hoạt dị tượng *"Cửu Thiên Thần Lôi"* — giáng lôi phạt sát thương chuẩn chân thật bằng 10% Công Kích bỏ qua khiên chắn và phòng ngự.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/domain-resonance.ts`, `lib/types/index.ts`, `lib/types/player.ts`):**
     - Định nghĩa `ResonanceElementType`, `SpiritPersonalityType`, `ResonanceEffectType`, `ResonanceRequirement`, `DomainResonanceConfig`, `ActiveDomainResonance`, `PotentialDomainResonance`, `ResonanceTurnResult`.
     - Mở rộng `PlayerStats` với các trường `activeResonances?: ActiveDomainResonance[]` và `resonanceLevel?: number`.
  2. **Pure Business Logic (`lib/domain-resonance-logic.ts`):**
     - `DOMAIN_RESONANCES_REGISTRY`: Khai báo 6 Dị Tượng Ngũ Hành & Biến Dị chuẩn mực tiên hiệp.
     - `normalizeResonanceElement` & `extractSkillElement`: Chuẩn hóa và tự động trích xuất nguyên tố từ Thần Thông (bao gồm cả trường element và nhận diện ngữ nghĩa tên chiêu thức cổ phong).
     - `matchSpiritPersonality`: Đối chiếu tính cách Khí Linh với Ma Trận Tương Hợp (Compatibility Matrix), hỗ trợ song song cả tính cách cũ (`thu_ho`, `co_xao`, `sat_phat`, `tinh_hoa`) và các tính cách mở rộng (`on_hoa`, `ho_chu`, `co_tri`, `lanh_khoc`, `tram_on`, `cuong_bao`).
     - `detectActiveDomainResonances`: Thuật toán thẩm định reactive với độ trễ bằng 0 (Zero-Latency), phòng vệ tuyệt đối chống stack vô hạn và loại bỏ tàn dư buff ma khi tháo kỹ năng hoặc thay đổi Khí Linh.
     - `resolveResonanceTurnEffects`: Giải quyết các hiệu ứng chiến đấu theo lượt (Mana Burn, Hụt Khí, HP Regen, Cleanse, Armor Pierce, Action Slow, Shield Reflect, True Damage Burst) kèm thông điệp nhật ký trận đấu cổ phong.
     - `calculateDomainResonanceBonuses` & `getPotentialDomainResonances`: Tính toán gia số lực chiến và cung cấp gợi ý điều kiện còn thiếu cho người chơi.
  3. **Tích Hợp Combat Engine (`lib/game-logic/combat.ts`, `lib/boss-trial-data.ts`):**
     - Tích hợp vào `battleBoss` (`combat.ts`): Tự động thẩm định Dị Tượng trước trận đấu, áp dụng hệ số gia tăng uy lực, in thông điệp Dị Tượng vào nhật ký chiến đấu và báo cáo kết quả trong `BattleResult`.
     - Tích hợp vào `simulateDetailedBossCombat` (`boss-trial-data.ts`): Kích hoạt `resolveResonanceTurnEffects` trong từng hiệp đấu (rounds), thiêu đốt Chân Nguyên Boss, hồi phục Khí Huyết người chơi và gắn `activeResonances` vào `DetailedBattleReport`.
  4. **Save Migration & Idempotent Guard (`lib/save-migration.ts`):**
     - `migrateDomainResonanceData`: Chuẩn hóa dữ liệu save cũ, khởi tạo an toàn `activeResonances: []` và `resonanceLevel: 1` mà tuyệt đối không thay đổi cấu trúc dữ liệu của `natalArtifact.spirit` hay `equippedManuals`.
     - Cập nhật hàm `normalizePlayerData` đồng bộ khởi tạo an toàn cho mọi save game nạp vào hệ thống.
  5. **Custom Hook (`hooks/useDomainResonance.ts`, `hooks/index.ts`):**
     - `useDomainResonance`: Tự động tính toán reactive `activeResonances`, `potentialResonances`, `bonuses`, hỗ trợ xem trước `handlePreviewResonance`.
  6. **Giao Diện Người Dùng Cổ Phong UI/UX (`components/tabs/DomainResonanceView.tsx`, `components/tabs/NatalArtifactView.tsx`, `components/tabs/BattleTab.tsx`):**
     - `DomainResonanceView`: Khu vực Bát Quái Ngũ Hành Trận Đồ tương tác trực quan với các trận nhãn phát sáng theo nguyên tố, Thẻ Bài Dị Tượng Đang Vận Hành hiển thị chi tiết nguồn phối hợp (Thần Thông + Khí Linh), Bảng Khảo Cứu Dị Tượng và Chỉ Điểm Tu Luyện gợi ý kích hoạt.
     - Tích hợp trực tiếp vào **Bản Mệnh Pháp Bảo (`NatalArtifactView.tsx`)** dưới dạng Khối 4 chuyên sâu.
     - Tích hợp **Combat HUD Badge** phát sáng trên thanh máu của nhân vật trong giao diện chiến đấu đối kháng (`BattleTab.tsx`), có tooltip giải thích chi tiết khi rê chuột.
- **Danh mục tệp tác động (Files Changed & Added):**
  - Mới: `lib/types/domain-resonance.ts` (Định nghĩa kiểu dữ liệu Dị Tượng Ngũ Hành).
  - Mới: `lib/domain-resonance-logic.ts` (Pure business logic & registry 6 Dị Tượng).
  - Mới: `hooks/useDomainResonance.ts` (Custom hook quản lý reactive state).
  - Mới: `components/tabs/DomainResonanceView.tsx` (Giao diện Bát Quái Trận Đồ & Dị Tượng).
  - Mới: `scripts/test-domain-resonance.ts` (Test suite tự động độc lập 6 ca kiểm thử).
  - Sửa đổi: `lib/types/index.ts` (Export domain-resonance types barrel).
  - Sửa đổi: `lib/types/player.ts` (Thêm trường `activeResonances` và `resonanceLevel` vào `PlayerStats`).
  - Sửa đổi: `lib/save-migration.ts` (Thêm hàm migration `migrateDomainResonanceData` và chuẩn hóa trong `normalizePlayerData`).
  - Sửa đổi: `lib/game-logic/combat.ts` (Tích hợp Dị Tượng vào combat power & flavor text).
  - Sửa đổi: `lib/boss-trial-data.ts` (Tích hợp Dị Tượng vào vòng lặp hiệp đấu round-by-round).
  - Sửa đổi: `hooks/index.ts` (Export `useDomainResonance`).
  - Sửa đổi: `components/tabs/NatalArtifactView.tsx` (Nhúng Khối 4 DomainResonanceView vào giao diện Bản Mệnh).
  - Sửa đổi: `components/tabs/BattleTab.tsx` (Hiển thị Combat HUD Badges cạnh thanh máu).
  - Sửa đổi: `CHANGELOG.md` (Ghi nhận nhật ký phát triển theo chuẩn 5 phần).
- **Kết quả nghiệm thu & Kiểm thử (Verification & Test Suite):**
  - Test Suite `scripts/test-domain-resonance.ts`: **30/30 passed (100%)** bao phủ toàn bộ 6 ca kiểm thử:
    1. Kiểm Tra Điều Kiện Kích Hoạt (Detection Guard): Kích hoạt Liệt Diễm Phần Thần khi có Hỏa + Sát Phạt, tự tắt khi đổi sang Ôn Hòa.
    2. Tháo Gỡ Kỹ Năng & Phòng Vệ Tàn Dư: Tháo kỹ năng -> Dị Tượng biến mất ngay lập tức, không tàn dư buff ma trong combat.
    3. Mô Phỏng Thiêu Đốt Chân Nguyên Trong Combat: Giả lập 5 hiệp thiêu đốt chính xác từ 1000 MP xuống 750 MP, kích hoạt Hụt Khí khi MP chạm 0 (-15% ATK).
    4. Phòng Vệ Khi Không Có Bản Mệnh / Khí Linh: Xử lý an toàn khi natalArtifact hoặc spirit là null/undefined, trả về mảng rỗng không runtime error.
    5. Cơ Chế Đa Dị Tượng Đồng Thời: Nhận diện chính xác 2 Dị Tượng đồng thời (Liệt Diễm + Sinh Sinh), áp dụng song song cả 2 hiệu ứng trong hiệp đấu.
    6. Kiểm Thử Tương Thích Save Cũ: Save cũ nạp qua `migrateDomainResonanceData` chuẩn hóa 100% không lỗi, bảo toàn nguyên vẹn dữ liệu cũ.
  - Type-check toàn codebase: `npx tsc --noEmit` đạt **0 lỗi (Zero errors)**.
  - Production Build Turbopack: `npm run build` biên dịch **thành công 100% (Compiled successfully in 8.0s)**.

### [2026-10-03 02:05] - Triển Khai Toàn Diện Tính Năng "Bổ Nhiệm Tiên Đồng Xuất Sư (Disciple Graduation & Dominion Appointment)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Tiên Đồng (Đạo Đồng / Hậu Duệ / Đồ Đệ bồi dưỡng tại Động Phủ) trước đây sau khi đạt cảnh giới cao vẫn chỉ dừng lại ở các tác vụ phụ trợ nội bộ (chăm sóc linh điền, hỗ trợ luyện đan), chưa có lộ trình phát triển vĩ mô khi trưởng thành. Điều này làm giảm động lực bồi dưỡng thế hệ kế cận và thiếu hụt nhân sự quản lý cho hai phân hệ End-game: **Tinh Hải Thám Hiểm** và **Tông Môn Tự Lập**.
  - Thiết kế và triển khai toàn diện tính năng **"Bổ Nhiệm Tiên Đồng Xuất Sư"** với 3 trụ cột gameplay chiến lược:
    1. **Đại Lễ Xuất Sư (Graduation Rite):** Khi Tiên Đồng đạt độ chín muồi (cảnh giới $\ge$ Hóa Thần Kỳ `realmIndex >= 26`, thể chất trưởng thành `stage === 'adult'`, độ trung thành $\ge 70$), người chơi cử hành đại lễ xuất sư, ban tặng đạo bào truyền thừa và pháp bảo trấn sơn.
    2. **Bổ Nhiệm Trấn Thủ Sĩ Tinh Hải (Star Sea Stronghold Guardian):** Phái Tiên Đồng trấn thủ các Cứ Điểm Tinh Hải / Tinh Cầu đã chiếm lĩnh, kích hoạt hệ số gia tốc sản lượng Tinh Thạch / Tinh Thần Sa (+10% ~ +50%), tự động gia cố hàng phòng ngự đẩy lui Thần Thú Hư Không và bảo vệ cứ điểm khỏi sụp đổ.
    3. **Bổ Nhiệm Chấp Sự Khố Phòng Tông Môn (Sect Treasury Deacon):** Đặt Tiên Đồng vào Khố Phòng Tông Môn tự lập để tối ưu hóa chuỗi cung ứng, giảm thiểu hao hụt tài nguyên tông môn (-15% ~ -40%), tăng vọt lợi nhuận giao thương phường thị (+10% ~ +45%) và tự động phân phát bổng lộc đệ tử.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/disciple-appointment.ts`, `lib/types/index.ts`, `lib/types/offspring.ts`, `lib/types/custom-sect.ts`, `lib/types/cosmic-map.ts`):**
     - Định nghĩa `DiscipleAppointmentRole` (`'none' | 'tinh_hai_guardian' | 'sect_treasury_deacon'`), `DiscipleSpecialtyBonus`, `DiscipleAppointmentData`, `AppointmentYieldResult`, `GraduationCheckResult`, `AppointmentCheckResult`.
     - Mở rộng `ImmortalChild` và `ProceduralDisciple` với trường `appointmentData?: DiscipleAppointmentData`.
     - Mở rộng `CosmicNode` với `guardianDiscipleId?: string` và `CosmicState` với `nodeGuardians?: Record<string, string>`.
     - Mở rộng `CustomSectVault` với `deaconDiscipleId?: string`.
  2. **Pure Business Logic (`lib/disciple-appointment-logic.ts`):**
     - `canGraduateDisciple`: Thẩm định điều kiện xuất sư (Cảnh giới $\ge$ Hóa Thần, trưởng thành, trung thành $\ge 70$).
     - `calculateGraduationSpecialtyBonus`: Tính toán hệ số chuyên môn dựa trên Cảnh giới, Căn Cốt, Ngộ Tính và Thiên Phú/Linh Căn.
     - `graduateDisciple`: Khởi tạo trạng thái xuất sư nguyên tử, gắn cờ `isGraduated: true`, ghi nhận mốc thời gian và cảnh giới xuất sư.
     - `canAppointDisciple`: Kiểm tra điều kiện bổ nhiệm (đã xuất sư, chưa đảm nhiệm chức vụ khác, cứ điểm/khố phòng hợp lệ).
     - `appointDiscipleRole` & `recallDiscipleRole`: Cập nhật trạng thái hai chiều nguyên tử (Atomic Update), tự động gỡ Tiên Đồng khỏi công việc thường nhật ở Động Phủ để chống trục lợi dồn buff (anti-stack exploit), triệu hồi an toàn hoàn trả trạng thái tự do mà không mất chỉ số hay kinh nghiệm.
     - `calculateAppointmentYield`: Tính toán sản lượng cộng thêm từ Trấn Thủ Sĩ và Chấp Sự theo thời gian trôi qua, tích lũy điểm công trạng và gia tăng độ trung thành.
     - `rewardDisciple`: Ban thưởng Linh Thạch để củng cố độ trung thành (+5 ~ +15).
  3. **Tích Hợp Engine & Động Cơ Ngoại Tuyến (`lib/cosmic-map-logic.ts`, `lib/custom-sect-logic.ts`):**
     - `calculateCosmicYield`: Nhân hệ số `starHarvestMultiplier` từ Trấn Thủ Sĩ vào sản lượng Tinh Thạch và Tinh Thần Sa.
     - `calculateSectVaultYield`: Nhân hệ số `treasuryEfficiency` và khấu trừ `resourceDecayReduction` vào sản lượng tài nguyên Khố Phòng Tông Môn.
  4. **Save Migration & Idempotent Self-Healing (`lib/save-migration.ts`):**
     - `migrateDiscipleAppointmentData`: Tự động khởi tạo cấu trúc `appointmentData` chuẩn mực cho toàn bộ Tiên Đồng và Đệ Tử khi tải save game cũ.
     - Cơ chế Self-Healing tự động quét và dọn sạch các ID Trấn Thủ Sĩ / Chấp Sự "ma" (stale/ghost reference) khỏi cứ điểm Tinh Hải và Khố Phòng Tông Môn.
  5. **Custom Hook & UI Presentation (`hooks/useDiscipleAppointmentActions.ts`, `components/modals/DiscipleGraduationModal.tsx`, `components/modals/DiscipleAppointmentModal.tsx`, `components/tabs/OffspringSanctuaryView.tsx`, `components/tabs/CustomSectTab.tsx`, `components/cosmic/CosmicMapModal.tsx`):**
     - `useDiscipleAppointmentActions`: Quản lý các action xuất sư, bổ nhiệm, bãi nhiệm, ban thưởng kèm hiệu ứng âm thanh cổ phong (`breakthrough`, `upgrade`, `retreat`, `coin`).
     - `DiscipleGraduationModal.tsx`: Giao diện đại lễ phong chức cổ phong trang trọng với văn tự truyền đạo, đạo bào và pháp bảo trấn sơn, bảng phân tích hiệu ứng thiên phú.
     - `DiscipleAppointmentModal.tsx`: Giao diện sa bàn điều phối chọn lựa Tiên Đồng xuất sư, so sánh chỉ số cảnh giới và hiệu suất tăng thêm.
     - `OffspringSanctuaryView.tsx`: Tích hợp nút **[🎓 Cử Hành Đại Lễ Xuất Sư]** phát quang hoàng kim, nút bồi dưỡng tu vi cảnh giới, huy hiệu trạng thái Trấn Thủ Tinh Hải / Chấp Sự Khố Phòng và nút Ban Thưởng Linh Thạch.
     - `CustomSectTab.tsx`: Bảng điều phối Chấp Sự Khố Phòng Tông Môn với nút Bổ Nhiệm, Triệu Hồi, Hoán Đổi và hiển thị buff giảm hao hụt/tăng sản lượng.
     - `CosmicMapModal.tsx`: Thẻ bài Trấn Thủ Sĩ tại Drawer quản lý cứ điểm Tinh Hải, cho phép bổ nhiệm hoặc triệu hồi Tiên Đồng bảo vệ cứ điểm.
- **Danh mục tệp tác động (Files Changed & Added):**
  - **Mới:** [`lib/types/disciple-appointment.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/disciple-appointment.ts)
  - **Mới:** [`lib/disciple-appointment-logic.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/disciple-appointment-logic.ts)
  - **Mới:** [`hooks/useDiscipleAppointmentActions.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/hooks/useDiscipleAppointmentActions.ts)
  - **Mới:** [`components/modals/DiscipleGraduationModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/modals/DiscipleGraduationModal.tsx)
  - **Mới:** [`components/modals/DiscipleAppointmentModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/modals/DiscipleAppointmentModal.tsx)
  - **Mới:** [`scripts/test-disciple-appointment.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/scripts/test-disciple-appointment.ts)
  - **Cập nhật:** [`lib/types/offspring.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/offspring.ts)
  - **Cập nhật:** [`lib/types/custom-sect.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/custom-sect.ts)
  - **Cập nhật:** [`lib/types/cosmic-map.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/cosmic-map.ts)
  - **Cập nhật:** [`lib/types/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/index.ts)
  - **Cập nhật:** [`lib/save-migration.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/save-migration.ts)
  - **Cập nhật:** [`lib/cosmic-map-logic.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/cosmic-map-logic.ts)
  - **Cập nhật:** [`lib/custom-sect-logic.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/custom-sect-logic.ts)
  - **Cập nhật:** [`hooks/useOffspringActions.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/hooks/useOffspringActions.ts)
  - **Cập nhật:** [`hooks/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/hooks/index.ts)
  - **Cập nhật:** [`components/modals/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/modals/index.ts)
  - **Cập nhật:** [`components/tabs/OffspringSanctuaryView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/tabs/OffspringSanctuaryView.tsx)
  - **Cập nhật:** [`components/tabs/CompanionTab.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/tabs/CompanionTab.tsx)
  - **Cập nhật:** [`components/tabs/CustomSectTab.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/tabs/CustomSectTab.tsx)
  - **Cập nhật:** [`components/tabs/SectTab.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/tabs/SectTab.tsx)
  - **Cập nhật:** [`components/cosmic/CosmicMapModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/cosmic/CosmicMapModal.tsx)
  - **Cập nhật:** [`components/GameDashboard.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/GameDashboard.tsx)
- **Kết quả kiểm thử tự động (Verification & Test Results):**
  - Test suite độc lập: `npx tsx scripts/test-disciple-appointment.ts` đạt **25/25 assertions passed (100%)** qua trọn vẹn 6 kịch bản bắt buộc:
    1. *Graduation Gating:* Chặn Tiên Đồng dưới Hóa Thần hoặc chưa trưởng thành; chấp thuận khi $\ge$ Hóa Thần và khởi tạo `specialtyBonus` chuẩn xác.
    2. *Star Sea Guardian:* Gán đúng `nodeGuardians` và `cosmicDefenseState.garrisons`, tăng chính xác sản lượng Tinh Thạch / Sa.
    3. *Sect Treasury Deacon:* Khố Phòng nhận diện đúng `deaconDiscipleId`, kích hoạt tăng sản lượng tài nguyên và giảm hao hụt vận hành.
    4. *Single-Duty & State Lock:* Chặn tuyệt đối việc kiêm nhiệm chức vụ thứ hai; gỡ Tiên Đồng khỏi công việc làm nông Động Phủ để chống cộng dồn buff.
    5. *Safe Recall:* Triệu hồi an toàn, gỡ bỏ tham chiếu tại Cứ Điểm / Khố Phòng, hoàn trả trạng thái tự do và bảo toàn 100% chỉ số.
    6. *Save Migration & Self-Healing:* Tự động chuẩn hóa dữ liệu save cũ không phát sinh undefined, dọn dẹp các ID tham chiếu ma.
  - Type-check toàn codebase: `npx tsc --noEmit` đạt **0 lỗi, 0 cảnh báo**.
  - Production build: `npm run build` trên Turbopack engine thành công 100% (8/8 static pages).

### [2026-10-03 01:45] - Triển Khai Toàn Diện Hệ Thống "Biến Cố Ngẫu Nhiên Khi Song Tu (Dual Cultivation Dynamic Events)" Cùng Đạo Lữ Cửu Giai
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tính năng Song Tu trước đây mang tính chất cộng chỉ số tĩnh (tăng % tu vi theo công thức cố định mỗi chu kỳ), thiếu đi chiều sâu cảm xúc, tính rủi ro - cơ duyên và sự tương tác nhân quả giữa hai chỉ số then chốt: **Hảo Cảm (Affection: 0 - 100)** và **Ma Tính / Tâm Ma (Demonic Nature / Karma: 0 - 100)**.
  - Thiết kế và triển khai toàn diện hệ thống **"Biến Cố Ngẫu Nhiên Khi Song Tu"** tập trung vào trải nghiệm bế quan cùng **Đạo Lữ Cửu Giai (Thần Cấp / Tiên Thiên Đạo Lữ)**:
    1. **Event Engine Tương Tác Nhân Quả:** Tính toán xác suất kích hoạt biến cố ngẫu nhiên (~20% mỗi chu kỳ song tu) dựa trên ma trận trạng thái giữa Hảo Cảm và Ma Tính.
    2. **Cơ Duyên Đốn Ngộ (Hảo Cảm Cao $\ge 90$, Ma Tính Thấp $\le 30$):** Kích hoạt các biến cố *Tâm Đầu Ý Hợp*, *Long Phượng Giao Hòa* mang lại đột phá đại lượng tu vi, kích hoạt Hào Quang Hộ Thể *Đạo Lữ Đồng Tâm Hộ Thể* hoặc tẩy luyện căn cốt.
    3. **Hiểm Họa Tâm Ma & Hộ Pháp (Ma Tính Cao $\ge 60$):** Kích hoạt các biến cố *Hộ Pháp Trừ Ma*, *Tâm Ma Phệ Hồn*. Đạo Lữ Cửu Giai thi triển bí thuật hộ pháp trừ ma, cứu giá người chơi, chuyển hóa ma khí thành đạo hạnh nhưng có thể hao tổn nguyên khí (tĩnh dưỡng 2 giờ) hoặc tiêu hao Thanh Tâm Đan trong túi đồ.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/dual-cultivation.ts`, `lib/types/companions.ts`, `lib/types/player.ts`):**
     - Định nghĩa `DualEventType` (`epiphany`, `demonic_hazard`, `harmony`, `tribulation`), `EventChoiceOutcomeType`, `DualEventChoice`, `DualCultivationEvent`, `DualEventHistoryRecord`, `DualEventResolutionResult`.
     - Bổ sung `demonicNature?: number`, `dualEventsHistory?: DualEventHistoryRecord[]`, `lastDualEventTimestamp?: number`, `protectiveAuraActive?: boolean` vào `PlayerStats`.
     - Bổ sung `fatigueUntil?: number`, `totalEpiphanies?: number` vào `CompanionPlayerState`.
  2. **Pure Business Logic (`lib/dual-cultivation-event-logic.ts`):**
     - `DUAL_CULTIVATION_EVENTS_POOL`: 4 biến cố kinh điển (*Tâm Đầu Ý Hợp*, *Hộ Pháp Trừ Ma*, *Tâm Ma Phệ Hồn*, *Long Phượng Giao Hòa*).
     - `getCompanionTier`: Nhận diện phẩm cấp Đạo Lữ Cửu Giai (tier 9) qua shopTier, id, title hoặc realmIndex.
     - `evaluateDualCultivationEvent`: Thẩm định điều kiện xuất hiện sự kiện và trọng số ngẫu nhiên không có side-effect. Kiểm tra trạng thái nghỉ ngơi của Đạo Lữ.
     - `resolveEventChoice`: Giải quyết lựa chọn nguyên tử (Atomic Update), kiểm tra và khấu trừ vật phẩm túi đồ (`Thanh Tâm Đan`), cộng trừ tu vi, điều chỉnh Ma Tính (giới hạn [0, 100]), Hảo Cảm (giới hạn [0, 100]), trạng thái kiệt sức (`fatigueUntil`), kích hoạt buff hào quang và đồng bộ thực thể Đạo Lữ.
  3. **Đồng Bộ Hai Chiều Với Engine (`lib/game-logic/cultivation.ts`):**
     - Tác động trực tiếp từ `demonicNature` lên tỉ lệ gặp Tâm Ma (`tamMaChance += demonicNature * 0.3`) và tỉ lệ đột phá cảnh giới (`demonicPenalty = Math.floor(demonicNature * 0.2)` giảm tối đa 20% tỉ lệ thành công).
  4. **Save Migration & Idempotent Guard (`lib/save-migration.ts`):**
     - `migrateDualCultivationEventData`: Tự động khởi tạo an toàn `demonicNature = 0`, `dualEventsHistory = []`, `lastDualEventTimestamp = 0`, `protectiveAuraActive = false`, và bổ sung `fatigueUntil = 0`, `totalEpiphanies = 0` cho toàn bộ Đạo Lữ khi tải save game cũ.
  5. **Custom Hook & UI Presentation (`hooks/useCompanionActions.ts`, `components/modals/DualCultivationEventModal.tsx`, `components/tabs/CompanionTab.tsx`, `components/GameDashboard.tsx`):**
     - Hook `useCompanionActions`: Quản lý state `activeDualEvent`, `isResolvingDualEvent`, cơ chế chặn Song Tu khi Đạo Lữ đang kiệt sức (`fatigueUntil > now`), kích hoạt modal sự kiện, và xử lý `handleChooseDualEventOption`.
     - `DualCultivationEventModal.tsx`: Giao diện Cổ Phong Vector nổi bật giữa màn hình với hiệu ứng viền phát sáng động (Hoàng Kim Thái Cực vs Đỏ Huyết Ma Vân), Chân dung Cửu Giai, thanh đo so sánh Hảo Cảm vs Ma Tính, văn tự tiên hiệp và các nút hành động kèm điều kiện & tiên đoán kết quả. Khóa thao tác nền chống save-scumming.
     - `CompanionTab.tsx`: Bổ sung hiển thị Ma Tính, Hào quang Hộ thể trên thanh banner, huy hiệu Tĩnh Dưỡng và Đốn Ngộ trên từng Đạo Lữ, nút Song Tu tự động khóa khi Đạo Lữ đang hồi khí.
- **Danh mục tệp tác động (Files Changed & Added):**
  - **Mới:** [`lib/types/dual-cultivation.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/dual-cultivation.ts)
  - **Mới:** [`lib/dual-cultivation-event-logic.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/dual-cultivation-event-logic.ts)
  - **Mới:** [`components/modals/DualCultivationEventModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/modals/DualCultivationEventModal.tsx)
  - **Mới:** [`scripts/test-dual-cultivation-events.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/scripts/test-dual-cultivation-events.ts)
  - **Cập nhật:** [`lib/types/companions.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/companions.ts)
  - **Cập nhật:** [`lib/types/player.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/player.ts)
  - **Cập nhật:** [`lib/types/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/types/index.ts)
  - **Cập nhật:** [`lib/save-migration.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/save-migration.ts)
  - **Cập nhật:** [`lib/game-logic/cultivation.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/lib/game-logic/cultivation.ts)
  - **Cập nhật:** [`hooks/useCompanionActions.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/hooks/useCompanionActions.ts)
  - **Cập nhật:** [`components/modals/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/modals/index.ts)
  - **Cập nhật:** [`components/tabs/CompanionTab.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/tabs/CompanionTab.tsx)
  - **Cập nhật:** [`components/GameDashboard.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/gametutien/components/GameDashboard.tsx)
- **Kết quả kiểm thử tự động (Verification & Test Results):**
  - Độc lập test suite: `npx tsx scripts/test-dual-cultivation-events.ts` đạt **31/31 assertions passed (100%)** bao phủ toàn bộ 6 kịch bản bắt buộc:
    1. *Event Filter Accuracy:* Ma Tính cao (80) + Hảo Cảm thấp (30) chặn *Tâm Đầu Ý Hợp*, lọc chuẩn vào *Tâm Ma Phệ Hồn*.
    2. *Hộ Pháp Trừ Ma Success:* Ma Tính giảm từ 70 về 30, Hảo Cảm tăng, Đạo Lữ nhận `fatigueUntil > Date.now()`.
    3. *Choice Guard:* Từ chối khi thiếu `Thanh Tâm Đan`, không đột biến dữ liệu; chấp nhận và trừ 1 viên khi có đủ trong túi.
    4. *Harmonious Epiphany:* Tu Vi nhân bội 3.0 (+450,000), buff hào quang thêm vào `activeBuffs` và lưu trữ 24h.
    5. *Boundary Clamping:* Chặn dưới 0 và chặn trên 100 tuyệt đối cho cả Ma Tính và Hảo Cảm.
    6. *Save Migration Invariant:* Nạp save game cổ đại, tự động khởi tạo các trường mới an toàn, vòng lặp hoạt động không sinh lỗi undefined.
  - TypeScript compilation: `npx tsc --noEmit` đạt **0 lỗi, 0 cảnh báo**.
  - Production build: `npm run build` biên dịch thành công 100% trên Turbopack engine.

### [2026-10-03 01:20] - Triển Khai Phân Hệ "Tiến Hóa Huyết Mạch & Lai Tạo Linh Thú (Bloodline Evolution & Beast Breeding)" Tại Thú Uyển Động Phủ
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Linh Thú trước đây bị chia tách rời rạc giữa Tọa Kỵ (chỉ tăng tốc di chuyển/giảm thời gian thám hiểm) và Chiến Thú (chỉ tăng chỉ số công thủ khi giao tranh). Điều này làm lãng phí tiềm năng của phân hệ Động Phủ và thiếu hụt vòng lặp nuôi dưỡng dài hạn.
  - Triển khai toàn diện phân khu mới **Thú Uyển (Beast Menagerie)** trong Động Phủ & Linh Thú Các với 2 trục tính năng cốt lõi:
    1. **Lai Tạo (Breeding):** Ghép đôi 2 linh thú theo nguyên tắc Ngũ Hành Tương Sinh (hoặc cùng hệ), sử dụng Đan Dược Xúc Tác (`Dục Thú Thảo`, `Huyết Tinh Đan`, `Thái Sơ Ngọc Tủy`) kích hoạt tỷ lệ đột biến huyết mạch (15% - 35%), kết tinh Linh Noãn nở ra **Biến Chủng Dị Thú** sở hữu thuộc tính kép **Chiến Tọa Song Toàn** (`canMount: true` VÀ `canFight: true`).
    2. **Tiến Hóa Huyết Mạch (Bloodline Awakening):** Thăng hoa độ thuần khiết huyết mạch (0% -> 100%) tại Thối Huyết Thần Đỉnh bằng Huyết Mạch Đan, đột phá thăng bậc phẩm cấp (Phàm Thú ➔ Linh Thú ➔ Dị Thú ➔ Thần Thú ➔ Thái Cổ Hung Thú), bộc phát chỉ số chiến đấu và giác ngộ Hào Quang Thiên Phú (`innateAura`: Hút Máu, Choáng, Chân Hỏa, Kim Cương Bất Hoại).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/beast-breeding.ts`, `lib/types/beasts.ts`, `lib/types/player.ts`):**
     - Định nghĩa `BeastElement`, `BloodlineTier` (1..5), `BeastCombatStats`, `BeastInnateAura`, `BeastEgg`, `BeastGardenFacility`, `BeastGardenState`, `BreedingCatalystItem`.
     - Mở rộng `SpiritBeast` với: `tier`, `bloodlinePurity`, `generation`, `isHybrid`, `canMount`, `canFight`, `travelSpeedBonus`, `combatStats`, `innateAura`, `breedingCooldownEnd`, `isLockedInBreeding`.
     - Bổ sung `player.beastGarden` vào `PlayerStats`.
  2. **Pure Business Logic (`lib/beast-breeding-logic.ts`):**
     - `areElementsCompatible(elemA, elemB)`: Xử lý quan hệ Ngũ Hành Tương Sinh (Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Phong trợ Hỏa, Âm Dương và Hỗn Độn dung nạp vạn vật).
     - `canBreedBeasts`: Thẩm định điều kiện ghép đôi nghiêm ngặt, chặn tự phối giống, chặn thú đang khóa buồng phối (`isLockedInBreeding`), chặn thú đang hồi chiêu, kiểm tra tương thích ngũ hành, sức chứa lồng ấp và số dư Linh Thạch.
     - `generateBeastBreedingResult`: Thuật toán di truyền chỉ số (Mendelian-like inheritance):
       - Tốc độ di chuyển: `Math.max(A, B) * 0.8 + Math.min(A, B) * 0.4 ± Variance(5%)`.
       - Chỉ số chiến đấu: `(A + B) / 2 * (1 + gen * 3%)`.
       - Tỷ lệ đột biến: Cơ bản 15% + Thú Uyển + Đan Dược Xúc Tác. Thú đột biến nâng Tier, mở khóa Innate Aura và kích hoạt cờ Chiến Tọa Song Toàn.
     - `startBeastBreeding`: Thực thi bắt đầu lai tạo bất biến, khóa cha mẹ `isLockedInBreeding: true`, trừ tài nguyên và tạo Linh Noãn vào lồng ấp.
     - `hatchBeastEgg`: Hoàn tất ấp nở trứng, giải phóng khóa cha mẹ kèm thời gian hồi chiêu, khởi tạo `SpiritBeast` mới và đồng bộ vào túi đồ.
     - `speedUpIncubation`: Tiêu hao Linh Thạch dựa theo thời gian ấp còn lại để nở trứng tức thì.
     - `evolveBloodline`: Bơm Huyết Mạch Đan tăng % thuần khiết; khi đạt 100% tự động thăng Tier (Bậc 1..5), tăng +25% công thủ, +10% tốc độ và mở khóa Hào Quang Thiên Phú.
     - `toggleEquipBeastRole`: Chuyển đổi vai trò Tọa Kỵ / Xuất Chiến / Chiến Tọa Song Toàn.
     - `upgradeBeastGardenFacility`: Nâng cấp Thú Uyển mở rộng ô ấp, tăng tốc độ ấp và tăng % tỷ lệ dị biến.
  3. **Đồng Bộ Hai Chiều Với Engine (`lib/beasts-shop-logic.ts`, `lib/offline-progress.ts`, `lib/game-logic/cultivation.ts`):**
     - Cập nhật `calculateActiveBeastsBuffs`: Nhận diện `SpiritBeast` từ `beastGarden`, cộng chỉ số `combatStats`, `travelSpeedBonus` và hiệu ứng `innateAura` vào combat engine.
     - Cập nhật `calculateOfflineSpeedMultiplier` & `calculateRealtimeCultivationSpeedMultiplier`: Nhận diện thú cưỡi từ `beastGarden.activeMountId` và áp dụng trực tiếp `travelSpeedBonus`.
  4. **Save Migration & Tự Phục Hồi Dữ Liệu (`lib/save-migration.ts`):**
     - Hàm `migrateBeastGardenData`: Rà soát toàn bộ `player.mounts`, `player.pets`, `player.beasts` từ save game cũ, chuẩn hóa an toàn các trường mặc định (`bloodlinePurity: 30`, `generation: 0`, `isHybrid: false`, `breedingCooldownEnd: 0`, `isLockedInBreeding: false`), bảo toàn 100% ID cũ, ngăn ngừa crash runtime.
  5. **Custom Hook & UI Presentation (`hooks/useBeastGardenActions.ts`, `components/tabs/BeastGardenView.tsx`, `components/tabs/BeastTab.tsx`):**
     - Hook `useBeastGardenActions`: Quản lý state ghép đôi, xem trước dự toán di truyền (Breeding Preview), ấp noãn, tăng tốc, thối luyện huyết mạch và dispatch thông báo tu tiên nhập vai.
     - `BeastGardenView.tsx`: Giao diện đồ họa thủ tục Zero-Asset Vector SVG/CSS gồm 3 Sub-tabs:
       - **Linh Thú Lạc Viên:** Card hiển thị từng thú, huy hiệu hệ nguyên tố (Lôi ⚡, Hỏa 🔥...), nhãn vai trò `[🏇 Tọa Kỵ]`, `[⚔️ Chiến Thú]`, viền hoàng kim `[✨ Dị Chủng Chiến Tọa]`, thanh đo độ thuần khiết và nút gán vai trò nhanh.
       - **Lai Tạo Thần Đàn:** 2 vị trí trống chọn Thú Cha & Mẹ kèm bộ lọc tương sinh, thẻ chọn Đan Dược Xúc Tác, bảng dự toán xác suất dị biến & chỉ số con non, nút bấm phát quang `🔥 KÍCH HOẠT LAI TẠO HUYẾT MẠCH`.
       - **Ấp Noãn Trì & Tiến Hóa:** Lồng ấp hiển thị trứng rung rinh kèm đồng hồ đếm ngược, nút tăng tốc bằng Linh Thạch, khu vực Thối Huyết Thần Đỉnh với thanh đo độ thuần khiết (0 - 100%) và nút bơm Huyết Mạch Đan.
     - Tích hợp liền mạch vào `BeastTab.tsx` thành sub-tab thứ 3: `🐾 Thú Uyển (Lai Tạo & Huyết Mạch)`.
- **Bảo đảm chất lượng & Kiểm thử (Verification & Test Suite):**
  - Xây dựng Test Suite độc lập `scripts/test-beast-breeding.ts` bao phủ trọn vẹn 6 trường hợp kiểm định:
    1. Validation Guard: Chặn thú xung khắc nguyên tố (Thủy vs Hỏa), thú đang hồi chiêu và người chơi thiếu Linh Thạch.
    2. Parent Locking: Khóa cha mẹ `isLockedInBreeding: true` ngay khi bắt đầu phối giống, chặn thao tác ghép đôi trùng lặp.
    3. Hybrid Dual-Role Inheritance: Thú con nở ra từ Tọa Kỵ thuần tốc độ + Chiến Thú thuần công thủ sở hữu đầy đủ `canMount: true` (tốc độ > 0), `canFight: true` (ATK, DEF, HP > 0) và giải phóng khóa cha mẹ.
    4. Mutation Probability Simulation: Chạy giả lập 1.000 lượt lai tạo có chất xúc tác, tỷ lệ đột biến thực tế đạt 28.4% (nằm chuẩn trong khoảng 25% - 35%), 100% thú đột biến mở khóa Innate Aura.
    5. Bloodline Evolution & Breakthrough: Bơm đan từ 90% lên 100% giúp thú thăng từ Tier 2 (Linh Thú) lên Tier 3 (Dị Thú), chỉ số công kích tăng +25% và mở khóa Hào Quang Thiên Phú.
    6. Save Migration Invariant: Nạp mock save cũ (chỉ có `mounts` và `pets` mộc), chuẩn hóa an toàn 4 linh thú với 0 trường undefined và 100% ID bảo toàn.
  - Kết quả kiểm định: `6/6 tests passed`, `npx tsc --noEmit` đạt 0 lỗi, Turbopack `npm run build` thành công exit code 0.

### [2026-10-03 01:00] - Triển Khai Phân Hệ "Đúc Lại Tụ Linh Trận Bàn (Array Reforging / Trùng Chú Trận Bàn Bất Hủ)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Các Tụ Linh Trận Bàn Cửu Giai tại Trận Pháp Các trước đây chỉ mang tính chất tiêu hao tạm thời (thời hạn hiệu lực mặc định 72 giờ). Điều này tạo sự bất tiện lớn cho người chơi giai đoạn End-game (Độ Kiếp / Tiên Nhân) khi phải liên tục khắc chế hoặc mua lại, đồng thời làm giảm giá trị của hệ thống bế quan ngoại tuyến (offline cultivation).
  - Cần khai mở tính năng **"Đúc Lại Tụ Linh Trận Bàn (Array Reforging / Trùng Chú Trận Bàn Bất Hủ)"** tại Trận Pháp Các theo 2 lộ trình chiến lược:
    1. **Lộ trình 1: Bất Hủ Hóa (Permanence Ascension):** Thăng hoa Trận Bàn Cửu Giai thành trạng thái Bất Hủ Vĩnh Viễn (`isPermanent: true`, thời hạn `Infinity`), độ bền bất hoại, giữ nguyên toàn bộ gia tốc linh khí. Điều kiện: Trận Bàn Cửu Giai + Cảnh giới $\ge$ Hóa Thần Kỳ + Trận Pháp Sư $\ge$ Tông Sư. Tiêu hao: Cực Phẩm Linh Thạch, Tinh Hoa Rèn Đúc (`forgingEssence`) và Hỗn Độn Thần Thiết/Hư Không Thạch.
    2. **Lộ trình 2: Tột Đỉnh Hấp Thu (Max Efficiency Boost):** Đẩy hiệu suất của Trận Bàn Bất Hủ lên mức cực hạn, kích hoạt thuộc tính `offlineAbsorptionBonus: 0.35` (+35% tốc độ tích lũy tu vi bế quan ngoại tuyến). Điều kiện: Trận Bàn đã Bất Hủ + Cảnh giới $\ge$ Độ Kiếp Kỳ + Trận Pháp Sư $\ge$ Cửu Giai (Thần Trận Đại Tổ).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/formation.ts`, `lib/types/cultivation-shop.ts`):**
     - Mở rộng `FormationItem` và `ActiveCultivationArrayBuff` với các trường: `isPermanent?: boolean`, `reforgeTier?: number`, `offlineAbsorptionBonus?: number`, `reforgedAt?: number`.
     - Bổ sung `ArrayReforgeType`, `ResourceCost`, `ArrayReforgeRecipe` định nghĩa quy chuẩn công thức trùng chú.
  2. **Pure Business Logic (`lib/formation-logic.ts`, `lib/cultivation-shop-logic.ts`, `lib/offline-progress.ts`):**
     - Khai báo `ARRAY_REFORGE_CONFIG` cấu hình chi tiết 2 lộ trình (chi phí, điều kiện cảnh giới & trận sư, kết quả).
     - Hàm thẩm định `canReforgeArrayDisc`: Kiểm tra phẩm cấp Cửu Giai, cảnh giới tu vi, cấp Trận Sư, phòng vệ chống trùng lặp (Anti-dup), kiểm tra chi phí tài nguyên (Linh Thạch, Tinh Hoa, Khoáng thạch) với cơ chế bảo vệ số dư.
     - Hàm thực thi `reforgeArrayDisc`: Pure Function đảm bảo tính Immutable, trừ tài nguyên an toàn, nâng cấp thuộc tính trận bàn, đồng bộ tức thì vào `player.equippedFormation` và `player.cultivationBuffState.activeArrays` mà không làm reset tiến trình tu luyện.
     - Cập nhật `cleanExpiredCultivationArrays`: Bảo tồn toàn vẹn các trận bàn `isPermanent === true` hoặc `expiresAt === Infinity`, không bao giờ bị dọn dẹp khi offline.
     - Cập nhật `calculateOfflineSpeedMultiplier` & `calculateOfflineProgress`: Bỏ qua kiểm tra hết hạn cho trận Bất Hủ khi offline dài ngày, đồng thời nhân thêm hệ số `offlineAbsorptionBonus` vào `offlineTuViEfficiency`.
  3. **Tương thích Ngược & Migration (`lib/save-migration.ts`):**
     - Chuẩn hóa an toàn `isPermanent`, `reforgeTier`, `offlineAbsorptionBonus`, `reforgedAt` trong `normalizeFormationItem` và `activeArrays`.
  4. **Custom Hook (`hooks/useFormationActions.ts`):**
     - Mở rộng `FormationSubTab` thêm sub-tab `'reforge'`.
     - Cung cấp `handleReforgeArray(targetId, reforgeType)` kèm các state `isReforging`, `selectedReforgeTargetId`, `selectedReforgeType`.
  5. **Giao diện Người Dùng UI/UX (`components/tabs/FormationTab.tsx`):**
     - Bổ sung sub-tab **[🔥 Trùng Chú]** với icon ngọn lửa phát quang.
     - Xây dựng **ReforgeAltarTab** (Lò Thăng Hoa Trận Đạo):
       - Bộ lọc và chọn trận bàn Cửu Giai khả dụng.
       - Bộ chuyển đổi lộ trình: Bất Hủ Hóa (Bậc 1) vs Tột Đỉnh Hấp Thu (Bậc 2).
       - Bảng so sánh trực quan Trước & Sau: Thời hạn `72 Giờ` ➔ `✨ Vĩnh Viễn (Bất Hủ)`, Ngoại tuyến `100%` ➔ `⚡ 135% (+35%)`, Độ bền `30/30` ➔ `Bất Hoại`.
       - Đồng hồ đo tài nguyên (Linh Thạch, Tinh Hoa Rèn Đúc, Thần Thiết) với hiển thị đỏ nếu thiếu hụt.
       - Cảnh báo cảnh giới và cấp Trận Sư trực quan.
       - Nút thao tác phát quang kèm animation khi dẫn hỏa trùng chú.
     - Thêm huy hiệu hoàng kim `✨ BẤT HỦ` và `⚡ TỘT ĐỈNH` tại tab Bản Mệnh và Kho Trận, kèm nút bấm tắt `[🔥 Trùng Chú]`.
- **Bảo đảm chất lượng & Kiểm thử (Verification & Test Suite):**
  - Xây dựng Test Suite toàn diện tại `scripts/test-array-reforging.ts` bao phủ 6 kịch bản bắt buộc:
    1. Kiểm tra công thức & chặn trận bàn dưới Cửu Giai hoặc chưa đủ cảnh giới.
    2. Chặn thiếu tài nguyên (Zero mutation & không âm tài nguyên).
    3. Trùng chú Bất Hủ thành công (khấu trừ chính xác, `isPermanent: true`, vô hạn độ bền, đồng bộ trang bị).
    4. Trùng chú Tột Đỉnh Hấp Thu (+35% offline bonus, `reforgeTier: 2`).
    5. Chống trùng lặp (Anti-dup) triệt để.
    6. Mô phỏng Offline Progress 10 ngày (240 giờ): Trận thường hết hạn sau 72h vs Trận Bất Hủ duy trì trọn vẹn 240h và tăng thêm +180% Tu Vi tích lũy.
  - Kết quả kiểm thử: `100% Passed (6/6 scenarios)`.
  - TypeScript Strict Mode: `npx tsc --noEmit` đạt 0 lỗi (0 warnings).
  - Next.js Turbopack: `npm run build` hoàn thành với exit code 0.

### [2026-10-03 00:45] - Triển Khai Phân Hệ "Ứng Dụng Tinh Hoa Rèn Đúc: Thăng Giai Bản Mệnh & Tẩy Luyện Thần Cấp" (Natal Artifact Essence Ascension & Essence Divine Reforging)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tài nguyên `forgingEssence` (Tinh Hoa Rèn Đúc) được thu hồi từ Lò Dung Luyện khi phân giải trang bị cực phẩm, nhưng trước đây chưa có vòng lặp tiêu thụ (Sink) giá trị cao xứng tầm với công sức tu sĩ.
  - Cần khai mở 2 trục tiêu thụ chiến lược:
    1. **Thăng Giai Bản Mệnh Pháp Bảo (`Natal Artifact Essence Ascension`):** Cho phép tiêu hao Tinh Hoa để trực tiếp thăng phẩm giai Bản Mệnh từ Nhất Giai lên đến Cửu Giai, tăng vĩnh viễn +15% đến +30% chỉ số cơ bản, mở rộng trần lỗ khảm ngọc (tối đa 4 lỗ), thưởng lượng lớn EXP/Hảo Cảm Khí Linh và kiểm soát chặt chẽ bằng ma trận khóa cảnh giới (Realm Gating).
    2. **Tẩy Luyện Thần Cấp Khóa Dòng Bằng Tinh Hoa (`Essence Divine Reforging`):** Cho phép tu sĩ dùng Tinh Hoa thay vì Linh Thạch khi tẩy luyện; miễn phí 100% Linh Thạch và Quặng khóa dòng, bảo lưu 100% dòng khóa, đồng thời đặc quyền kích hoạt tối thiểu 1 dòng thuộc tính đạt phẩm chất Cực Phẩm (Tím), Hoàng Kim (Vàng) hoặc Hồng Hoang Thần Phẩm (Đỏ).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types (`lib/types/natal-artifact.ts`, `lib/types/items.ts`):**
     - Bổ sung `NatalAscensionConfig`, `NatalAscensionRequirement` xác định 9 bậc thăng giai bản mệnh, chi phí tinh hoa, cảnh giới yêu cầu, hệ số gia trì thuộc tính và trần đục lỗ.
     - Bổ sung `EssenceReforgeConfig`, `ReforgeCostConfig` cấu hình cơ chế định giá tẩy luyện bằng tinh hoa và đảm bảo phẩm cấp tối thiểu (`minGuaranteedRarity: 'tim' | 'kim' | 'than'`).
  2. **Pure Business Logic (`lib/natal-artifact-logic.ts`, `lib/forging-logic.ts`, `lib/forging-gem-data.ts`):**
     - `NATAL_ASCENSION_COSTS`: Bảng 9 bậc thăng giai (Giai 2 Trúc Cơ 150 TH, Giai 3 Kim Đan 450 TH, ..., Giai 9 Độ Kiếp 120,000 TH).
     - `canAscendNatalWithEssence`: Kiểm tra an toàn sở hữu bản mệnh, trần Cửu Giai, cảnh giới tu vi (`player.currentRealm >= requiredRealmIndex`), và số dư Tinh Hoa.
     - `ascendNatalWithEssence`: Khấu trừ Tinh Hoa an toàn (chống âm), thăng cấp `natalArtifact.tier`, nhân hệ số vĩnh viễn vào `statsBonus`, mở trần `maxSockets` và mảng sockets, cộng EXP/Hảo Cảm Khí Linh, kích hoạt đột phá tầng linh trí và đồng bộ trang bị đang đeo.
     - `getEssenceReforgeBaseCost`, `calculateEssenceReforgeCost`: Định giá Tinh Hoa theo 4 phân hạng phẩm cấp trang bị và số dòng bị khóa.
     - `generateHighGradeAffix`: Sinh ngẫu nhiên thuộc tính ẩn ép phẩm cấp tối thiểu đạt Cực Phẩm (Tím), Hoàng Kim (Vàng) hoặc Thần Phẩm (Đỏ).
     - `reforgeEquipmentWithEssence`: Tẩy luyện bằng Tinh Hoa, bảo toàn 100% dòng khóa, kích hoạt bảo hiểm phẩm cấp cao, miễn phí toàn bộ Linh Thạch và Quặng.
  3. **Custom Hooks (`hooks/useNatalArtifactActions.ts`, `hooks/useCraftingActions.ts`):**
     - `useNatalArtifactActions`: Bổ sung `handleAscendNatalWithEssence` và `ascensionRequirement`.
     - `useCraftingActions`: Bổ sung state `useEssenceReforge: boolean`, handler `handleToggleEssenceReforge`, và tích hợp logic rẽ nhánh vào `handleReforgeEquipment`.
  4. **Giao diện Người Dùng UI/UX (`NatalArtifactView.tsx`, `ForgingTab.tsx`):**
     - `NatalArtifactView`: Bổ sung đài phụ **"⚡ THĂNG GIAI BẢN MỆNH (TINH HOA TRÚC THẦN)"** với thanh tiến độ Tinh Hoa, thông tin thăng tiến bậc/gia trì, badge đỏ khóa cảnh giới `🔒 Cần đạt [Cảnh Giới]`, và nút thăng giai phát quang hổ phách.
     - `ForgingTab`: Tích hợp tab đôi chuyển đổi `[💰 Linh Thạch Thường]` vs `[🔥 Tinh Hoa Thần Luyện]`, banner đặc quyền hoàng kim, bảng dự toán tiêu hao Tinh Hoa, và nút bấm cam đỏ `🔥 TINH HOA TẨY LUYỆN`.
  5. **Tích hợp Dashboard (`components/GameDashboard.tsx`):** Chuyển giao các state và handler giữa `crafting` hook và `ForgingTab`.
- **Bảo đảm chất lượng & Kiểm thử (Verification & Test Suite):**
  - Xây dựng suite kiểm thử 6 kịch bản (`scripts/test-forging-essence.ts`): Chi phí 9 bậc, Chặn khóa cảnh giới tu vi, Thăng giai & cộng dồn chỉ số, Chặn thiếu tinh hoa, Tẩy luyện bảo toàn dòng khóa & bảo hiểm phẩm cấp cao, Xác thực 0 Linh Thạch tiêu hao. 100% Passed.
  - TypeScript Strict Mode: `npx tsc --noEmit` đạt 0 lỗi (0 warnings).
  - Next.js Turbopack: `npm run build` hoàn thành 100% với 8/8 static routes.

### [2026-10-03 00:30] - Triển Khai Phân Hệ "Tự Động Hóa & Khép Kín Chuỗi Cung Ứng Nguyên Liệu Chế Tác" (Crafting Supply Auto-Link & One-Click Material Buying)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, khi luyện đan tại `AlchemyTab` hoặc rèn trang bị tại `ForgingTab`, nếu thiếu Dược Thảo hoặc Khoáng Thạch, người chơi buộc phải rời bàn chế tác, mở `MerchantTab`, thủ công tìm mua từng nguyên liệu lẻ tẻ rồi mới quay lại chế tác. Chuỗi thao tác này làm phân mảnh trải nghiệm nghiêm trọng.
  - Cần khép kín chuỗi cung ứng bằng cách kết nối trực tiếp danh mục **36 Dược Thảo Cửu Giai** (`lib/herbs-shop-data.ts`) và **15 Khoáng Thạch Cửu Giai** (`lib/ores-shop-data.ts`, `lib/merchant-data.ts`) vào bàn chế tác; cung cấp giải pháp **1-Click "Mua Đủ Thiếu Hụt"** và công tắc **Toggle "Tự Động Mua Khi Luyện" (`autoBuyMissing`)** hoạt động theo cơ chế atomic transaction.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Models & Pure Business Logic (`lib/crafting-supply-logic.ts`):**
     - Xây dựng mô hình dữ liệu chuẩn mực: `MissingIngredientRequirement` và `CraftingSupplyAssessment`.
     - `assessPillRecipeSupply`: Quét đơn dược thảo, so khớp túi đồ, tính lượng thiếu hụt, tra cứu giá gốc từ map 36 dược thảo, áp dụng chiết khấu Thương Hội từ Đạo Lữ Dạ Mộng Ly (`getBondedCompanionBuffs`), quy đổi tổng Linh Thạch và kiểm tra cảnh giới yêu cầu (`requiredRealmIndex`).
     - `assessForgeRecipeSupply`: Thực hiện tương tự cho công thức rèn trang bị với 15+ khoáng thạch cửu giai.
     - `executeBatchSupplyPurchase`: Kiểm tra an toàn `canExecuteAutoPurchase`, sức chứa túi đồ (`getMaxInventoryCapacity` vs `getCurrentInventoryOccupiedSlots`), khấu trừ Linh Thạch an toàn (`deductEquivalentLinhThach`), và nạp nguyên liệu dạng stackable vào kho.
  2. **Tích hợp Custom Hook (`hooks/useCraftingActions.ts`):**
     - Bổ sung `handleBuyMissingMaterials` cho phép mua nhanh 1-click có thông báo toast chi tiết.
     - Bổ sung `handleToggleAutoBuySupply` cập nhật `player.craftingSupplySettings.autoBuyMissing`.
     - Nâng cấp `handleCraftPill` và `handleForgeEquip`: khi bật toggle `autoBuyMissing` và thiếu nguyên liệu nhưng đủ điều kiện, tự động mua trước rồi tiến hành chế tác ngay trong 1 lần bấm, bảo toàn trải nghiệm mượt mà.
  3. **Self-Healing Save Migration (`lib/save-migration.ts`, `lib/game-logic/character.ts`):**
     - Bổ sung `craftingSupplySettings?: { autoBuyMissing: boolean }` vào `PlayerStats` trong `lib/types/player.ts`.
     - Cập nhật `normalizePlayerData()` tự động khởi tạo mặc định `{ autoBuyMissing: false }` cho các bản save cũ và duy trì giá trị đã cấu hình.
  4. **Giao diện Người Dùng UI/UX Sang Trọng (`AlchemyTab.tsx`, `ForgingTab.tsx`):**
     - Widget cảnh báo thiếu hụt nguyên liệu (Missing Materials Warning) hiển thị trực quan ngay trên nút hành động.
     - Mini Badges phân loại trạng thái: Hổ phách/Vàng cho nguyên liệu có thể mua nhanh, Đỏ rực kèm icon khóa `🔒` cho nguyên liệu bị khóa cảnh giới (`Cần [Cảnh Giới]`).
     - Nút `⚡ Mua Đủ Nguyên Liệu (X Linh Thạch)` với hiệu ứng gradient nổi bật.
     - Công tắc Toggle Checkbox `[✓] Tự Động Mua Thiếu Bằng Linh Thạch` với chú thích rõ ràng.
     - Cập nhật nút chính: khi bật toggle và thiếu nguyên liệu, nút chuyển trạng thái thông minh `🔥 MUA NGUYÊN LIỆU & BẮT ĐẦU LUYỆN ĐAN` / `🔨 MUA NGUYÊN LIỆU & BẮT ĐẦU RÈN ĐÚC`.
- **Bảo đảm chất lượng & Kiểm thử (Verification & Test Suite):**
  - Xây dựng bộ test toàn diện 8 kịch bản (`scripts/test-crafting-supply.ts`): Save Migration, Thiếu thảo dược, Chiết khấu đạo lữ, Khóa cảnh giới (Luyện Khí chế Tam Giai), 1-Click Batch Buy, Rèn khoáng thạch, Chống âm Linh Thạch, Chống tràn túi đồ. 100% Passed.
  - TypeScript Strict Mode: `npx tsc --noEmit` đạt 0 lỗi (0 type warnings).
  - Next.js Turbopack: `npm run build` hoàn thành 100% không cảnh báo.

### [2026-10-02 22:30] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Pháp Bảo Trữ Vật Cửu Giai (Spatial Storage & Bag Expansions Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã sở hữu đầy đủ Đan Dược, Dược Thảo, Khoáng Thạch, Trang Bị, Vật Phẩm Tu Luyện, Công Pháp Bí Tịch, Thần Thông, Đạo Lữ và Linh Thú 9 giai, phân hệ **Pháp Bảo Trữ Vật / Càn Khôn Không Gian (Spatial Storage & Bag Expansions Tier 1 -> Tier 9)** – nguồn bảo vật thiết yếu giúp tu sĩ khai mở đan điền trữ vật, nới rộng không gian túi đồ, phân tách ngăn chứa chuyên dụng cho Dược Thảo/Khoáng Thạch và giảm tải áp lực đầy túi khi thám hiểm dã ngoại – vẫn chưa được chuẩn hóa theo hệ thống 9 giai vị tương ứng 9 đại cảnh giới.
  - Người chơi cần hệ thống 36 pháp bảo trữ vật độc bản (4 phân nhóm × 9 phẩm giai), cơ chế phân cấp & khóa cảnh giới nghiêm ngặt, cơ chế dung hợp vĩnh viễn & chống mua trùng lặp (One-Time Upgrade Guard) với trạng thái `✓ ĐÃ DUNG HỢP`, thanh thông tin dung lượng trực quan đầu trang, tích hợp sâu vào động cơ sức chứa túi đồ và mỹ thuật thủ tục Zero-Asset Vector SVG/CSS.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/storage-shop.ts`, `lib/types/items.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `StorageShopTier` (1 đến 9), `StorageCategory` (`'universal' | 'herb_vault' | 'ore_vault' | 'dimension'`), `SpatialCapacityBonus` (`generalSlotsFlat`, `herbSlotsFlat`, `oreSlotsFlat`, `abodeStorageFlat`, `retainSlotsOnRebirth`), `PlayerStorageState` (`unlockedStorageIds`, `totalBonusGeneralSlots`, `totalBonusHerbSlots`, `totalBonusOreSlots`) và interface `StorageShopItem` chuẩn mực (`id`, `name`, `tier`, `tierName`, `category`, `categoryName`, `description`, `flavorText`, `price`, `requiredRealmIndex`, `requiredRealmName`, `badgeColor`, `avatarGradient`, `spatialCapacityBonus`, `specialPerkName`, `specialPerkDesc`).
     - Mở rộng `MerchantItem` trong `lib/types/items.ts`: bổ sung `storageData?`, `storageCategory?`, `storageTier?`.
     - Mở rộng `PlayerStats` trong `lib/types/player.ts`: bổ sung `storageState?: PlayerStorageState;`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Dữ Liệu 36 Pháp Bảo Trữ Vật Cửu Giai (`lib/storage-shop-data.ts`):**
     - Thiết kế đầy đủ 36 bảo vật không gian theo đúng 4 phân nhóm và 9 phẩm giai:
       + *Nhất Giai (Luyện Khí Kỳ - Realm 0–10):* Sơ Cấp Túi Trữ Vật (+10 Ô chung - 200 LT), Bách Thảo Nang (+15 Ô Thảo Dược - 250 LT), Thiết Bì Quáng Đại (+15 Ô Khoáng Thạch - 250 LT), Càn Khôn Mộc Hạp (+5 Ô chung, +10 Ô Động Phủ - 350 LT).
       + *Nhị Giai (Trúc Cơ Kỳ - Realm 11–15):* Bách Luyện Trữ Vật Giới (+25 Ô chung - 2,500 LT), Uẩn Linh Thảo Hạp (+35 Ô Thảo Dược - 3,000 LT), Huyền Thiết Thôn Kim Nang (+35 Ô Khoáng Thạch - 3,000 LT), Thanh Lăng Càn Khôn Trạc (+15 Ô chung, +25 Ô Động Phủ - 4,500 LT).
       + *Tam Giai (Kim Đan Kỳ - Realm 16–20):* Tử Phủ Càn Khôn Giới (+50 Ô chung - 22,000 LT), Vạn Dược Quy Linh Hạp (+70 Ô Thảo Dược - 26,000 LT), Địa Tâm Kim Cương Nang (+70 Ô Khoáng Thạch - 26,000 LT), Ngũ Hành Tụ Bảo Giới (+30 Ô chung, +60 Ô Động Phủ - 38,000 LT).
       + *Tứ Giai (Nguyên Anh Kỳ - Realm 21–25):* Cửu U Hư Không Đại (+100 Ô chung - 180,000 LT), Thanh Liên Dưỡng Dược Giới (+140 Ô Thảo Dược - 220,000 LT), Trầm Hương Thôn Quáng Hạp (+140 Ô Khoáng Thạch - 220,000 LT), Bát Quái Càn Khôn Bàn (+60 Ô chung, +150 Ô Động Phủ, giữ 2 ô Luân Hồi - 300,000 LT).
       + *Ngũ Giai (Hóa Thần Kỳ - Realm 26–30):* Thái Hư Trữ Vật Giới (+200 Ô chung - 1.2M LT), Dược Thần Tụ Bảo Nang (+280 Ô Thảo Dược - 1.5M LT), Bích Lạc Kim Cương Giới (+280 Ô Khoáng Thạch - 1.5M LT), Tu Di Thần Sơn Trạc (+120 Ô chung, +350 Ô Động Phủ, giữ 4 ô Luân Hồi - 2.2M LT).
       + *Lục Giai (Luyện Hư Kỳ - Realm 31–35):* Quy Chân Hư Không Giới (+400 Ô chung - 8M LT), Tiên Thảo Dưỡng Linh Giới (+550 Ô Thảo Dược - 10M LT), Hư Không Vạn Thạch Hạp (+550 Ô Khoáng Thạch - 10M LT), Lục Hợp Càn Khôn Kính (+250 Ô chung, +800 Ô Động Phủ, giữ 6 ô Luân Hồi - 14M LT).
       + *Thất Giai (Hợp Thể Kỳ - Realm 36–40):* Bát Hoang Tu Di Giới (+800 Ô chung - 45M LT), Niết Bàn Thần Dược Giới (+1,100 Ô Thảo Dược - 55M LT), Thái Cực Kim Cương Thế Giới (+1,100 Ô Khoáng Thạch - 55M LT), Thất Tinh Tụ Bảo Châu (+500 Ô chung, +1,800 Ô Động Phủ, giữ 10 ô Luân Hồi - 75M LT).
       + *Bát Giai (Đại Thừa Kỳ - Realm 41–45):* Vạn Cổ Hỗn Nguyên Giới (+1,600 Ô chung - 220M LT), Bổ Thiên Thần Nông Đỉnh (+2,200 Ô Thảo Dược - 280M LT), Thái Sơ Khai Sơn Nang (+2,200 Ô Khoáng Thạch - 280M LT), Hồng Mông Vạn Tượng Hạp (+1,000 Ô chung, +4,000 Ô Động Phủ, giữ 16 ô Luân Hồi - 380M LT).
       + *Cửu Giai (Độ Kiếp / Tiên Nhân - Realm 46+):* Hỗn Độn Sáng Thế Giới (+3,500 Ô chung - Không Gian Vô Tận - 1.5B LT), Tiên Thiên Dược Hải Thần Châu (+5,000 Ô Thảo Dược - 1.8B LT), Vạn Giới Kim Cương Khôi Nang (+5,000 Ô Khoáng Thạch - 1.8B LT), Khai Thiên Tức Nhưỡng Càn Khôn Đỉnh (+2,500 Ô chung, +10,000 Ô Động Phủ, bảo toàn toàn bộ trang bị khi Luân Hồi - 2.8B LT).
       + Helpers: `getStorageCategoryBadge`, `storageShopItemToMerchantItem`, `STORAGE_SHOP_ITEMS_MAP`, `TIER_STORAGE_MERCHANT_ITEMS`.
  3. **Pure Business Logic Engine & Quản Lý Khai Mở Không Gian (`lib/storage-shop-logic.ts`):**
     - `isStorageAlreadyUnlocked(player, storageId)`: Kiểm tra đa tầng (`storageState.unlockedStorageIds`, `merchantState.purchasedOneTimeIds`).
     - `buyAndUnlockStorage(player, item)`: Xác thực cảnh giới tối thiểu (`player.currentRealm >= item.requiredRealmIndex`), chống mua trùng lặp, áp dụng chiết khấu thương hội (`getBondedCompanionBuffs`), khấu trừ linh thạch an toàn (`deductEquivalentLinhThach`), cộng dồn các chỉ số ô (`generalSlotsFlat`, `herbSlotsFlat`, `oreSlotsFlat`), cập nhật trực tiếp giới hạn túi đồ cốt lõi `player.inventory.maxSlots` và `player.storageBag.maxSlots`, lưu vết vào `purchasedOneTimeIds` và thông báo tiên gia vang dội.
     - `calculateEffectiveMaxSlots(player)`: Tính toán tổng dung lượng tối đa hiện tại (Base Slots + Bonus từ Storage State + Bonus từ Tông Môn/Mệnh Cách).
  4. **Tích Hợp Sức Chứa Cốt Lõi (`lib/inventory-data.ts`, `lib/merchant-data.ts`):**
     - Cập nhật `getMaxInventoryCapacity` trong `inventory-data.ts`: Cộng thêm `player.storageState?.totalBonusGeneralSlots` vào công thức dung lượng tối đa.
     - Cập nhật `merchant-data.ts`: Tích hợp `TIER_STORAGE_MERCHANT_ITEMS` vào danh mục hàng hóa khởi tạo, hỗ trợ phân loại `matchMerchantCategory('storage')`, trích xuất `getItemTierWeight` cho `storageTier` và `storageData.tier`, khóa mua độc bản vĩnh viễn qua `isOneTimeMerchantItem` và `isItemAlreadyPurchased`.
  5. **Nâng Cấp Giao Diện Thương Hội & Bộ Lọc 2 Tầng Cổ Phong (`components/tabs/MerchantTab.tsx`):**
     - Sub-tab mới: `📦 Trữ Vật` trong thanh chuyển đổi phân mục Thương Hội.
     - Bộ lọc 2 tầng cổ phong:
       + Hàng 1 (Phẩm Giai): `[Tất Cả]`, `[Giai 1]` $\rightarrow$ `[Giai 9]` kèm badge đếm số lượng động.
       + Hàng 2 (Chủng Loại): `[Toàn Bộ Loại]`, `[🌌 Càn Khôn Chung]`, `[🌿 Dược Hạp]`, `[⛏️ Quáng Đại]`, `[🪐 Tu Di Dị Bảo]`.
     - Thanh Thông Tin Dung Lượng Đầu Trang (Capacity Overview Header): Hiển thị tiến trình trực quan Túi Đồ Chung (`[Đang Dùng / Tối Đa Ô]`), Ngăn Chứa Dược Thảo (`+[X] Ô`) và Ngăn Chứa Khoáng Thạch (`+[Y] Ô`).
     - Thẻ Bài Pháp Bảo Trữ Vật Cổ Phong: Avatar Procedural SVG phát quang theo phẩm giai, badge loại hình & phẩm cấp, nổi bật các dòng tăng ô không gian màu ngọc hoàng kim, badge `✓ ĐÃ DUNG HỢP` phát quang tím khi đã kích hoạt, badge đỏ `🔒 Cần đạt [Cảnh Giới]` khi chưa đủ thần thức.
     - Modal Chi Tiết Không Gian (`viewingStorageModal`): Xem mô tả truyền thuyết thứ nguyên, chi tiết toàn bộ các dòng gia tăng sức chứa, đặc quyền bổ trợ và nút dung hợp nhanh.
  6. **Tích Hợp Hành Động & Chuẩn Hóa Di Trú Dữ Liệu An Toàn (`hooks/useMerchantInventoryActions.ts`, `lib/save-migration.ts`, `components/GameDashboard.tsx`):**
     - Handler `handleUnlockStorage(storageItem)`: Kích hoạt âm thanh đột phá `playSfx('breakthrough')`, hiển thị toast thành công và ghi nhật ký càn khôn.
     - Truyền `handleUnlockStorage` vào `<MerchantTab />` trong `GameDashboard.tsx`.
     - `normalizePlayerData`: Chuẩn hóa `storageState` bảo đảm không bao giờ undefined hoặc NaN, đồng bộ lại `player.inventory.maxSlots` và `storageBag.maxSlots` không bị reset về giá trị gốc của save cũ, tự động nạp 36 pháp bảo trữ vật mới vào danh mục Thương Hội cho các bản save cũ.
- **Phân tích hiệu năng & An toàn dữ liệu (Performance & Data Safety):**
  - Đảm bảo tính nhất quán (Single Source of Truth) giữa `storageState`, `storageBag.maxSlots` và `inventory.maxSlots`.
  - Kiểm tra giao dịch linh thạch an toàn và chặt chẽ, ngăn chặn hoàn toàn tình trạng hao hụt linh thạch hoặc mua trùng lặp bảo vật độc bản.
  - Client-first 100%, đồ họa thủ tục Zero-Asset tối ưu hóa triệt để không tốn băng thông tải tài nguyên ngoài.
- **Kế hoạch kiểm thử & Kiểm chứng chất lượng (Verification Plan & Quality Gates):**
  - TypeScript strict check `npx tsc --noEmit` đạt 0 lỗi biên dịch.
  - Next.js build `npm run build` thành công 100% trên Turbopack.
  - Kiểm thử giao diện: Lọc 9 giai và 4 phân nhóm mượt mà, mua bảo vật gia tăng sức chứa ngay lập tức, chuyển trạng thái `✓ ĐÃ DUNG HỢP` vĩnh viễn và khóa nút mua.
- **Đồng bộ tài liệu kỹ thuật (Documentation Synchronization):**
  - Cập nhật Master `CHANGELOG.md` và `README.md` (Mục 4.36).

### [2026-10-02 22:15] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Linh Thú Thần Sủng Cửu Giai (Spirit Beasts & Mounts Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã sở hữu đầy đủ Đan Dược, Dược Thảo, Khoáng Thạch, Trang Bị, Vật Phẩm Tu Luyện, Công Pháp Bí Tịch, Thần Thông và Đạo Lữ 9 giai, phân hệ **Linh Thú Thần Sủng Cửu Giai (Spirit Beasts, Mounts & Battle Pets)** – nơi người chơi có thể ký kết khế ước với Thần Thú, Tọa Kỵ Thần Hành, Hộ Thể Linh Thú và Tầm Bảo Tiên Thú trải đều 9 đại cảnh giới – vẫn chưa được tích hợp hoàn chỉnh vào Phường Thị Thương Hội.
  - Người chơi cần hệ thống 36 thần thú khế ước (4 hình mẫu Archetypes × 9 phẩm giai), cơ chế phân cấp & khóa cảnh giới nghiêm ngặt, cơ chế chống ký ước trùng lặp (One-Time Beast Bond Guard) với trạng thái `✓ ĐÃ KÝ KHẾ ƯỚC`, các nút chức năng tức thời `[⚔️ Xuất Chiến]` hoặc `[🐎 Cưỡi]`, tích hợp thuộc tính thực chiến trực tiếp vào `calculateCombatStats`, `calculateCombatPower` và `getMaxKhiHuyet`, tương thích ngược 100% với `BeastTab.tsx` và mỹ thuật thủ tục Zero-Asset Vector SVG/CSS.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/beasts-shop.ts`, `lib/types/items.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `BeastShopTier` (1 đến 9), `BeastArchetype` (`'chien_dau' | 'thu_cuoi' | 'ho_the' | 'tam_bao'`), `PlayerBeastsState` (`ownedBeastIds`, `activeCombatBeastId`, `activeMountBeastId`) và interface `BeastShopItem` chuẩn mực (`id`, `name`, `species`, `tier`, `tierName`, `archetype`, `archetypeName`, `description`, `lore`, `elementalAffinity`, `price`, `requiredRealmIndex`, `requiredRealmName`, `badgeColor`, `silhouetteColor`, `innateSkill`, `stats`).
     - Mở rộng `MerchantItem` trong `lib/types/items.ts`: bổ sung `beastData?`, `beastArchetype?`, `beastTier?`.
     - Mở rộng `PlayerStats` trong `lib/types/player.ts`: bổ sung `beastsState?: PlayerBeastsState;`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Dữ Liệu 36 Thần Thú Cửu Giai (`lib/beasts-shop-data.ts`):**
     - Thiết kế đầy đủ 36 linh thú theo đúng 4 trường phái và 9 phẩm giai:
       + *Nhất Giai (Luyện Khí Kỳ - Realm 0-10):* Tầm Bảo Thử (Chuột Tầm Bảo - +10% Drop rate - 280 LT), Thiết Giáp Hùng (Gấu Giáp Sắt - +50 DEF, +350 HP - 320 LT), Tật Phong Khuyển (Chó Gió Nhẹ - +12 Tốc độ di chuyển - 260 LT), Hỏa Diễm Hồ (Cáo Lửa Đỏ - +35 ATK, +3% Bạo kích - 300 LT).
       + *Nhị Giai (Trúc Cơ Kỳ - Realm 11-15):* Phong Lôi Báo (Báo Sấm Gió - +25 Tốc độ, +5% Né tránh - 3,200 LT), U Minh Lang (Sói Bóng Tối - +150 ATK, +5% Bạo kích - 3,500 LT), Kim Tinh Thiềm Thừ (Cóc Vàng - +150 DEF, +1,200 HP, nhả độc - 3,000 LT), Linh Hạc Bạch Vũ (Hạc Lông Trắng - +15% Tốc độ hái thuốc, +5% Linh khí - 2,800 LT).
       + *Tam Giai (Kim Đan Kỳ - Realm 16-20):* Xích Diễm Hổ (Hổ Lửa Đỏ - +600 ATK, +8% Xuyên giáp - 28K LT), Thần Hành Linh Lộc (Hươu Thần Tốc - +60 Tốc độ, giảm 15% thời gian du ngoạn - 25K LT), Băng Tinh Cự Hùng (Gấu Băng Tinh - +550 DEF, +4,500 HP, khiên băng 10% - 30K LT), Tầm Kim Linh Miêu (Mèo Tầm Vàng - +20% Rơi linh thạch, phát hiện bảo rương - 32K LT).
       + *Tứ Giai (Nguyên Anh Kỳ - Realm 21-25):* Huyết Sí Bằng (Đại Bàng Cánh Máu - +2,000 ATK, +10% Bạo thương - 220K LT), Phi Thiên Độc Giác Thú (Ngựa Một Sừng - +120 Tốc độ, miễn nhiễm địa hình xấu - 200K LT), Huyền Quy Thổ Linh (Rùa Đất Linh - +2,000 DEF, +18,000 HP, phản đòn 10% - 250K LT), Huyễn Nguyệt Linh Hồ (Hồ Ly Ánh Trăng - +15% Tìm thấy công pháp/đan phương - 240K LT).
       + *Ngũ Giai (Hóa Thần Kỳ - Realm 26-30):* Thái Hư Du Long (Rồng Lướt Hư Không - +12,000 ATK, 15% Long Uy uy áp - 1.8M LT), Cửu Tiêu Lôi Lân (Kỳ Lân Lôi Điện - +300 Tốc độ, giáng sét kẻ địch mỗi hiệp - 1.6M LT), Kim Cương Cự Viên (Vượn Khổng Lồ Kim Cương - +10,000 DEF, +80,000 HP, miễn khống chế 1 lượt - 1.5M LT), Thông Thiên Linh Hầu (Khỉ Thông Thiên - +25% Tìm thảo dược/khoáng thạch hiếm - 1.4M LT).
       + *Lục Giai (Luyện Hư Kỳ - Realm 31-35):* Hư Không Thao Thiết (Thao Thiết Nuốt Hư Không - +45,000 ATK, 15% Hút máu - 12M LT), Đạp Vân Thần Cực Mã (Ngựa Thần Đạp Mây - +700 Tốc độ, xuyên qua cấm chế bí cảnh - 10M LT), Sơn Nhạc Cự Ngao (Cóc Núi Cự Ngao - +40,000 DEF, +350,000 HP, giảm 15% sát thương - 11M LT), Tầm Đạo Cổ Điệp (Bướm Cổ Tầm Đạo - +15% Điểm tu vi khi khám phá bí cảnh - 9M LT).
       + *Thất Giai (Hợp Thể Kỳ - Realm 36-40):* Chân Long Hoàng Kim (Rồng Vàng Hoàng Kim - +180,000 ATK, Long Tức hủy diệt - 75M LT), Thất Thải Phượng Hoàng (Phượng Hoàng Bảy Màu - +1,500 Tốc độ, hồi sinh 30% HP khi tử trận - 80M LT), Hỗn Độn Trầm Phù Thú (Quái Thú Hỗn Độn - +150,000 DEF, +1,500,000 HP, hấp thụ 20% sát thương - 70M LT), Vạn Bảo Thiên Khôi Thú (Linh Thú Chứa Kho Báu - +35% Tài nguyên toàn bí cảnh - 65M LT).
       + *Bát Giai (Đại Thừa Kỳ - Realm 41-45):* Bát Hoang Tru Tiên Thú (Thú Sát Tiên Bát Hoang - +600,000 ATK, trảm diệt hồn phách - 350M LT), Càn Khôn Du Long (Rồng Bơi Càn Khôn - +3,500 Tốc độ, dịch chuyển tức thời qua ải - 320M LT), Thái Cổ Thần Ngao (Rùa Thần Thái Cổ - +500,000 DEF, +6,000,000 HP, Bất Diệt Kim Thân - 300M LT), Thiên Cơ Khuy Thần Thú (Thú Nhìn Thấu Thiên Cơ - +30% Tỷ lệ gặp Kỳ Duyên Thái Cổ - 280M LT).
       + *Cửu Giai (Độ Kiếp / Tiên Nhân - Realm 46+):* Hồng Mông Tổ Long (Rồng Khởi Nguyên - +2,500,000 ATK, Khí Tổ Long trảm vạn đạo - 2.5B LT), Hỗn Độn Côn Bằng (Côn Bằng Hỗn Độn - +10,000 Tốc độ, bay một bước mười vạn dặm - 2.2B LT), Vạn Kiếp Huyền Vũ (Huyền Vũ Vạn Kiếp - +2,000,000 DEF, +25,000,000 HP, miễn tử 1 lần - 2.8B LT), Tạo Hóa Vạn Thú Chi Tổ (Tổ Tiên Vạn Thú - +50% Toàn bộ tài nguyên, x2 drop boss - 2B LT).
       + Helpers: `getBeastArchetypeBadge`, `getBeastElementalBadge`, `beastShopItemToMerchantItem`, `BEASTS_SHOP_ITEMS_MAP`, `TIER_BEASTS_MERCHANT_ITEMS`.
  3. **Pure Business Logic Engine & Quản Lý Ký Khế Ước (`lib/beasts-shop-logic.ts`):**
     - `isBeastAlreadyRecruited(player, beastId)`: Kiểm tra đa tầng (`beastsState.ownedBeastIds`, `player.beasts`, `purchasedOneTimeIds`).
     - `recruitBeastFromShop(player, item)`: Xác thực cảnh giới tối thiểu, kiểm tra chống mua trùng lặp, áp dụng chiết khấu thương hội (`getBondedCompanionBuffs`), khấu trừ linh thạch an toàn (`deductEquivalentLinhThach`), nạp vào `beastsState.ownedBeastIds`, tự động gán `activeCombatBeastId` / `activeMountBeastId` nếu chưa có, đồng thời khởi tạo `SpiritBeast` nạp vào legacy `player.beasts` đảm bảo tương thích 100% với `BeastTab.tsx`, lưu vết vào `purchasedOneTimeIds` và trả về thông báo tiên hiệp trang nghiêm.
     - `setActiveCombatBeast(player, beastId)` & `setActiveMountBeast(player, beastId)`: Bật/tắt linh thú xuất chiến hoặc cưỡi thần hành.
     - `calculateActiveBeastsBuffs(player)`: Tổng hợp các chỉ số gia trì từ linh thú xuất chiến và tọa kỵ đang cưỡi (`atkFlat`, `defFlat`, `speedFlat`, `critRateBonus`, `dodgeBonus`, `hpBonusFlat`, `combatPowerBonus`).
  4. **Tích Hợp Chỉ Số Giao Tranh & Sinh Mệnh (`lib/destiny-data.ts`, `lib/game-logic/stats.ts`):**
     - Cập nhật `calculateCombatStats` trong `destiny-data.ts`: Tích hợp Section 14 gọi `calculateActiveBeastsBuffs`, cộng dồn trực tiếp vào `baseAtk`, `baseDef`, `baseSpeed`, `baseCritRate`, `totalDodgeBonus`.
     - Cập nhật `stats.ts`: Tích hợp vào `calculateCombatPower` (cộng thêm `combatPowerBonus` từ thú cưng) và `getMaxKhiHuyet` (cộng trực tiếp `hpBonusFlat` từ Hộ Thể Ngự Thú).
  5. **Nâng Cấp Giao Diện Thương Hội & Bộ Lọc 2 Tầng Cổ Phong (`components/tabs/MerchantTab.tsx`):**
     - Sub-tab mới: `🐾 Linh Thú` trong thanh chuyển đổi phân mục Thương Hội.
     - Bộ lọc 2 tầng cổ phong:
       + Hàng 1 (Phẩm Giai): `[Tất Cả]`, `[Giai 1]` $\rightarrow$ `[Giai 9]` kèm badge đếm số lượng động.
       + Hàng 2 (Trường Phái): `[Toàn Bộ Phái]`, `[⚔️ Chiến Đấu]`, `[🐎 Tọa Kỵ]`, `[🛡️ Hộ Thể]`, `[💎 Tầm Bảo]`.
     - Thẻ bài Linh Thú Cổ Phong: Procedural SVG Silhouette phát quang biến đổi theo phẩm giai, badge trường phái & hệ nguyên tố ngũ hành, huy hiệu Thiên Phú Bản Mệnh, bảng chỉ số gia trì, giá Linh Thạch và các trạng thái nút thông minh:
       + `✓ ĐÃ KÝ KHẾ ƯỚC`: Tự động nhận diện khi đã sở hữu, hiển thị badge ngọc lục bảo và chuyển đổi sang các nút hành động trực tiếp:
         * Dành cho Chiến Đấu / Hộ Thể: `[⚔️ Đang Xuất Chiến]` (active) / `[⚔️ Xuất Chiến]` (inactive).
         * Dành cho Tọa Kỵ: `[🐎 Đang Cưỡi]` (active) / `[🐎 Cưỡi]` (inactive).
       + `🔒 Cần đạt [Cảnh Giới]`: Badge đỏ rực và khóa nút mua khi tu vi chưa đủ.
       + Nút `[📜 Chi Tiết]` mở Modal Điển Tích & Bản Lĩnh.
     - Modal Điển Tích & Bản Lĩnh (`viewingBeastModal`): Procedural SVG Silhouette phóng to, toàn bộ điển tích thượng cổ, thông tin bản mệnh thiên phú, bảng thuộc tính chi tiết và nút ký ước/thao tác trực tiếp.
  6. **Domain Hook, GameDashboard & Save Migration (`hooks/useMerchantInventoryActions.ts`, `components/GameDashboard.tsx`, `lib/save-migration.ts`):**
     - Bổ sung `handleRecruitBeast`, `handleSetActiveCombatBeast`, `handleSetActiveMountBeast` vào hook Thương Hội, phát âm thanh `breakthrough`, toast thông báo và ghi nhật ký phân hệ `'event'`.
     - Kết nối đầy đủ các handler từ hook vào `MerchantTab` trong `GameDashboard.tsx`.
     - Cập nhật `normalizePlayerData` trong `lib/save-migration.ts`: Chuẩn hóa `player.beastsState`, đồng bộ `beastData`, `beastArchetype`, `beastTier` từ `freshCatalogMap` vào `merchantState.items` và cập nhật `getMaxKhiHuyet` với `beastsState`.
- **Danh mục tệp thay đổi (Files Changed):**
  - `lib/types/beasts-shop.ts` (MỚI)
  - `lib/beasts-shop-data.ts` (MỚI)
  - `lib/beasts-shop-logic.ts` (MỚI)
  - `lib/types/items.ts`
  - `lib/types/player.ts`
  - `lib/types/index.ts`
  - `lib/merchant-data.ts`
  - `lib/destiny-data.ts`
  - `lib/game-logic/stats.ts`
  - `hooks/useMerchantInventoryActions.ts`
  - `components/tabs/MerchantTab.tsx`
  - `components/GameDashboard.tsx`
  - `lib/save-migration.ts`
  - `README.md`
  - `CHANGELOG.md`
- **Quy chuẩn chất lượng & Kiểm thử (Quality Gates & Verification):**
  - `npx tsc --noEmit`: Exit code 0, 0 type errors.
  - `npm run build`: Biên dịch thành công 100% qua Next.js 16.3.5 Turbopack (8 static routes generated, 0 warnings/errors).
- **Kế hoạch tiếp theo (Next Steps):**
  - Mở rộng thêm các tương tác tiến hóa huyết mạch và lai tạo linh thú trong phân hệ Động Phủ (Beast Sanctuary).

### [2026-10-02 21:20] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Đạo Lữ Khế Ước Cửu Giai (Companions Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã sở hữu đầy đủ Đan Dược, Dược Thảo, Khoáng Thạch, Trang Bị, Vật Phẩm Tu Luyện, Công Pháp Bí Tịch và Thần Thông 9 giai, phân hệ **Đạo Lữ Khế Ước / Tiên Duyên Thiếp (Dao Companions & Divine Servants)** – nơi người chơi có thể thông qua Phường Thị / Hắc Thị / Đấu Giá Hội để chuộc thân, kết duyên hoặc ký kết khế ước với các mỹ nhân, tài nữ, thánh nữ thất thế và hộ đạo giả trải đều 9 đại cảnh giới – vẫn chưa được tích hợp hoàn chỉnh.
  - Người chơi cần hệ thống 36 vị Đạo Lữ khế ước (4 hình mẫu Archetypes × 9 giai), cơ chế phân cấp & khóa cảnh giới nghiêm ngặt, cơ chế chống mua trùng lặp (One-Time Recruitment Guard), liên kết trực tiếp vào mảng sở hữu để sẵn sàng Song Tu, Quán Đỉnh, Ban Thưởng, Sinh Con, cùng mỹ thuật thủ tục Vector SVG/CSS.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/companions-shop.ts`, `lib/types/items.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `CompanionShopTier` (1 đến 9), `CompanionArchetype` (`'song_tu' | 'ho_dao' | 'bach_nghe' | 'di_the'`) và interface `CompanionShopItem` chuẩn mực (`id`, `name`, `title`, `tier`, `tierName`, `archetype`, `archetypeName`, `description`, `backstory`, `quote`, `price`, `requiredRealmIndex`, `requiredRealmName`, `badgeColor`, `avatarGradient`, `innatePhysique`, `stats`).
     - Mở rộng `MerchantItem` trong `lib/types/items.ts`: bổ sung `companionData?`, `companionArchetype?`, `companionTier?`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Dữ Liệu 36 Vị Đạo Lữ Cửu Giai (`lib/companions-shop-data.ts`):**
     - Thiết kế đầy đủ 36 vị đạo lữ theo đúng 4 trường phái và 9 phẩm giai:
       + *Nhất Giai (Luyện Khí Kỳ - Realm 0-10):* Lâm Uyển Nhi (Thanh Mai Tiểu Nữ - +8% Tu vi song tu - 300 LT), Tiêu Kiếm Hàn (Hộ Kiếm Thiếu Nữ - +120 Lực chiến - 350 LT), Dược Thảo Nhi (Dược Đồng Thất Thế - giảm 10% tiêu hao thảo dược - 280 LT), Bạch Tố Tâm (Thanh Linh Chi Thể - +3 Khí Vận vĩnh viễn - 450 LT).
       + *Nhị Giai (Trúc Cơ Kỳ - Realm 11-15):* Tô Mộng Dao (Mộc Linh Nữ Tử - +15% Tu vi song tu - 3,500 LT), Lục Y Kiếm Tiên (Thanh Trúc Kiếm Cơ - +500 Lực chiến, khiên 10% HP - 4,000 LT), Chu Đan Đồng (Luyện Khí Nữ Đồ - tăng 8% tỷ lệ luyện đan Trúc Cơ - 3,200 LT), Hàn Ngọc Trinh (Băng Cơ Ngọc Cốt - +5% Kháng ngũ hành - 5,000 LT).
       + *Tam Giai (Kim Đan Kỳ - Realm 16-20):* Hồng Yêu Yêu (Xích Luyện Ma Nữ - +22% Tu vi song tu - 35K LT), Triệu Khuynh Thành (Chấn Thiên Thương Nữ - +2,500 Lực chiến, phá giáp - 40K LT), Thẩm Mặc Cơ (Trận Đồ Nữ Sư - tăng 15% hiệu suất tụ linh - 32K LT), Liễu Nhược Tuyên (Thuần Âm Chi Thể - +10 Ngộ Tính, +8 Khí Vận - 55K LT).
       + *Tứ Giai (Nguyên Anh Kỳ - Realm 21-25):* Nam Cung Nguyệt (Thái Âm Thần Nữ - +30% Tu vi song tu, tẩy tâm ma - 250K LT), Kiếm Si Mộ Tuyết (Cửu U Kiếm Tôn - +12,000 Lực chiến, Kiếm Khí Hộ Thể phản đòn - 300K LT), Đan Hà Tiên Tử (Nguyên Anh Đan Sư - tăng 15% ra đan Cực Phẩm - 240K LT), Bạch Thiển Thiển (Cửu Vĩ Thiên Hồ - +25% Tu vi, tăng tỷ lệ sinh con Thiên Linh Căn - 420K LT).
       + *Ngũ Giai (Hóa Thần Kỳ - Realm 26-30):* Phượng Tê Hoàng (Thiên Triều Trưởng Công Chúa - +40% Tu vi song tu - 1.8M LT), Lãnh Nguyệt Băng Cơ (Hóa Thần Pháp Tướng - +50,000 Lực chiến, phong ấn địch 1 hiệp - 2.2M LT), Vân Diệu Y Sư (Diệu Thủ Dược Thần - hồi 20% Khí Huyết sau trận - 1.6M LT), Lạc Thần Nữ (Hỗn Nguyên Thủy Thể - +20 Căn Cốt, +15 Ngộ Tính - 3M LT).
       + *Lục Giai (Luyện Hư Kỳ - Realm 31-35):* Dạ Mị Cơ (Hư Không Du Hiệp - +50% Tu vi song tu - 12M LT), Chân Vũ Nữ Kiếm Thánh (Quy Chân Kiếm Ý - +180,000 Lực chiến, sát thương chuẩn - 15M LT), Thiên Cơ Khôi Nữ (Khôi Lỗi Tiên Sư - khôi lỗi tự động làm việc Động Phủ - 10M LT), Tử Tiêu Thần Cơ (Hư Không Linh Thể - né 100% đòn chí tử đầu tiên - 20M LT).
       + *Thất Giai (Hợp Thể Kỳ - Realm 36-40):* Ngao Linh Nhi (Long Tộc Chân Công Chúa - +65% Tu vi song tu, tôi nhục thân - 60M LT), Thần Hoàng Nữ Đế (Bất Tử Thần Hỏa - +800,000 Lực chiến, hồi sinh 30% HP - 80M LT), Vạn Bảo Nữ Thần Tôn (Phường Thị Chi Chủ - chiết khấu 15% toàn Thương Hội - 50M LT), Huyền Minh U Hậu (Thái Cực Bất Diệt Cốt - +50 Toàn thuộc tính, giảm 15% sát thương - 95M LT).
       + *Bát Giai (Đại Thừa Kỳ - Realm 41-45):* Đế Lạc Hồng Nhan (Thái Thượng Đạo Nữ - +80% Tu vi song tu, Tiên Thiên Khí - 350M LT), Vạn Kiếp Kiếm Tôn (Kiếm Đạo Độc Tôn - +3,500,000 Lực chiến, 30% Kiếm Khí Trảm Hồn - 450M LT), Bổ Thiên Thánh Nữ (Hồng Mông Dược Đế - thanh tẩy 100% đan độc khi chuyển cảnh - 300M LT), Vô Thượng Nữ Đế (Hỗn Độn Tiên Cốt - +100 Khí Vận, con cái chắc chắn Thánh Thể - 600M LT).
       + *Cửu Giai (Độ Kiếp / Tiên Nhân - Realm 46+):* Thái Sơ Tiên Tử (Thượng Giới Trích Tiên - +100% Tu vi song tu, ban Tiên Lực vượt kiếp - 2B LT), Cửu Thiên Huyền Nữ (Chiến Tranh Nữ Thần - +15,000,000 Lực chiến, Vạn Cổ Tiên Trận - 2.5B LT), Tạo Hóa Nữ Oa Hậu Duệ (Vạn Linh Chi Mẫu - đan dược tăng gấp đôi phẩm cấp và công hiệu - 1.8B LT), Hỗn Độn Đạo Tổ Nương Nương (Hỗn Độn Bất Diệt Thể - miễn 50% lôi phạt thiên kiếp, cùng trường sinh bất tử, +200 Khí Vận - 3.5B LT).
       + Helpers: `getCompanionArchetypeBadge`, `companionShopItemToMerchantItem`, `companionShopItemToCompanionDefinition`, `COMPANIONS_SHOP_ITEMS_MAP`, `TIER_COMPANIONS_MERCHANT_ITEMS`, `TIER_COMPANIONS_DEFINITIONS`.
     - Đồng bộ `TIER_COMPANIONS_DEFINITIONS` vào `COMPANIONS_DATA` (`lib/companions-data.ts`) để `COMPANIONS_MAP` và các phân hệ toàn cục nhận diện ngay lập tức.
  3. **Pure Business Logic Engine & Động Cơ Chuộc Thân (`lib/companions-shop-logic.ts`):**
     - `isCompanionAlreadyRecruited(player, companionId)`: Kiểm tra đa tầng (`companionsState.companions`, legacy map, `purchasedOneTimeIds`).
     - `recruitCompanionFromShop(player, item)`: Xác thực cảnh giới tối thiểu (`player.currentRealm >= item.requiredRealmIndex`), chống ký ước trùng lặp, áp dụng chiết khấu thương hội (`getBondedCompanionBuffs`), khấu trừ linh thạch an toàn (`deductEquivalentLinhThach`), khởi tạo `CompanionPlayerState` (`isBonded = true, isMet = true, affinity = favorabilityInitial`), cập nhật đồng thời `companionsState` và legacy `companions`, lưu vết vào `purchasedOneTimeIds`, cộng dồn chỉ số vĩnh viễn (nếu có `permanentPlayerBuff`) và trả về thông điệp tiên hiệp trang nghiêm.
  4. **Nâng Cấp Giao Diện Thương Hội & Bộ Lọc 2 Tầng Cổ Phong (`components/tabs/MerchantTab.tsx`):**
     - Sub-tab mới: `🌸 Đạo Lữ` trong thanh chuyển đổi phân mục Thương Hội.
     - Bộ lọc 2 tầng cổ phong:
       + Hàng 1 (Phẩm Giai): `[Tất Cả]`, `[Giai 1]` $\rightarrow$ `[Giai 9]` kèm badge đếm số lượng động.
       + Hàng 2 (Trường Phái): `[Toàn Bộ Phái]`, `[💖 Song Tu]`, `[⚔️ Hộ Đạo]`, `[🧪 Bách Nghệ]`, `[✨ Dị Thể]`.
     - Thẻ bài Đạo Lữ Cổ Phong: Avatar Procedural SVG phát quang linh động theo Tier, badge danh hiệu & trường phái, trích dẫn bối cảnh điển tích, cảnh giới ban đầu, lực chiến hỗ trợ, % tu vi song tu, hảo cảm ban đầu, badge thể chất bẩm sinh (`innatePhysique`).
     - Trạng thái `✓ ĐÃ KẾT DUYÊN`: Tự động nhận diện khi đã chuộc thân, hiển thị badge hồng phát quang và chuyển nút thành `✓ Đã Đồng Hành` (vô hiệu hóa).
     - Trạng thái `🔒 Chưa Đủ Cảnh Giới`: Badge đỏ rực và khóa nút mua.
     - Nút hành động: `[📜 Chi Tiết]` mở Modal và `[💍 Chuộc Thân / Kết Duyên]`.
     - Modal Điển Tích & Dung Mạo (`viewingCompanionModal`): Avatar chân dung lớn, toàn bộ điển tích lưu lạc, bảng thuộc tính gia trì, đặc quyền độc nhất và nút chuộc thân ký ước trực tiếp.
  5. **Tích Hợp Giao Diện Đạo Lữ (`components/tabs/CompanionTab.tsx`):**
     - Lọc hiển thị thông minh: Chỉ hiển thị các đạo lữ shop khi đã được kết duyên hoặc đã gặp gỡ (`!comp.shopTier || safeCompanions[comp.id]?.isBonded || safeCompanions[comp.id]?.isMet`), tránh làm rác giao diện khi chưa chiêu mộ.
     - Đồng bộ số lượng kết duyên chính xác trên Header.
  6. **Domain Hook & Save Migration (`hooks/useMerchantInventoryActions.ts`, `lib/save-migration.ts`):**
     - Bổ sung `handleRecruitCompanion` vào hook Thương Hội, phát âm thanh `breakthrough`, toast thông báo và ghi nhật ký phân hệ `'companion'`.
     - Cập nhật `normalizePlayerData`: Tự động nạp 36 đạo lữ mới từ `freshCatalog` vào danh mục Thương Hội và khởi tạo an toàn trong `companionsState` cho mọi bản save cũ.
- **Danh mục tệp thay đổi (Files Changed):**
  - `lib/types/companions-shop.ts` (MỚI)
  - `lib/companions-shop-data.ts` (MỚI)
  - `lib/companions-shop-logic.ts` (MỚI)
  - `lib/types/items.ts`
  - `lib/types/index.ts`
  - `lib/companions-data.ts`
  - `lib/merchant-data.ts`
  - `hooks/useMerchantInventoryActions.ts`
  - `components/GameDashboard.tsx`
  - `components/tabs/MerchantTab.tsx`
  - `components/tabs/CompanionTab.tsx`
  - `lib/save-migration.ts`
  - `README.md`
  - `CHANGELOG.md`
- **Quy chuẩn chất lượng & Kiểm thử (Quality Gates & Verification):**
  - `npx tsc --noEmit`: Exit code 0, 0 type errors.
  - `npm run build`: Biên dịch thành công 100% qua Turbopack (Next.js 16.3.5, 8 static pages generated).
- **Kế hoạch tiếp theo (Next Steps):**
  - Mở rộng thêm các sự kiện ngẫu nhiên khi song tu và tương tác sâu với Đạo Lữ Cửu Giai trong Động Phủ.

### [2026-10-02 20:30] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Trang Bị Thần Binh Cửu Giai (Equipment Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã sở hữu đầy đủ Đan Dược, Dược Thảo, Khoáng Thạch, Vật Phẩm Tu Luyện, Công Pháp Bí Tịch và Thần Thông 9 giai, phân hệ **Trang Bị (Weapons, Armor, Footwear, Accessories)** – nguồn chỉ số trực tiếp trang bị trên người tu sĩ phục vụ giao tranh thực chiến, leo Tháp Trấn Ma và Khiêu Chiến Boss – vẫn chưa được chuẩn hóa theo hệ thống 9 giai vị tương ứng với 9 đại cảnh giới.
  - Người chơi cần hệ thống trang bị 36 món chuẩn mực (4 slot × 9 giai) với cơ chế so sánh trực tiếp chỉ số (+/- diff), hai nút tiện lợi (Mua Vào Túi / Mặc Ngay), khóa cảnh giới nghiêm ngặt và cộng dồn thuộc tính trực tiếp vào toàn bộ hệ thống giao tranh và sinh mệnh của nhân vật.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/equipment-shop.ts`, `lib/types/items.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `EquipmentTier` (1 đến 9), `EquipmentSlotType` (`'weapon' | 'armor' | 'boots' | 'accessory'`), `EquipmentItemStats` (10 chỉ số chiến đấu) và interface `EquipmentShopItem` chuẩn mực (`id`, `name`, `tier`, `slot`, `description`, `flavorText`, `price`, `requiredRealmIndex`, `stats`, `badgeColor`).
     - Mở rộng `MerchantItem` trong `lib/types/items.ts`: bổ sung `equipmentSlot?`, `equipmentTier?`, `equipmentStats?`, hỗ trợ slot `'boots'` an toàn trên toàn bộ hệ thống item data.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Dữ Liệu 36 Món Trang Bị Cửu Giai (`lib/equipment-shop-data.ts`):**
     - Thiết kế đầy đủ 36 món trang bị theo đúng đặc tả cân bằng chỉ số và biểu giá lũy tiến:
       + *Nhất Giai (Luyện Khí Kỳ - Realm 0-10):* Thanh Phong Kiếm (+45 ATK, +3% Crit - 250 LT), Huyền Thiết Giáp (+35 DEF, +200 HP - 220 LT), Tật Phong Hài (+8 Speed, +3% Dodge - 180 LT), Ngưng Khí Giới (+15 ATK, +10 DEF, +5% Crit DMG - 200 LT).
       + *Nhị Giai (Trúc Cơ Kỳ - Realm 11-15):* Xích Viêm Đao (+180 ATK, +5% Crit, +4% Pen - 2,800 LT), Bách Luyện Cương Giáp (+140 DEF, +800 HP, +3% DmgRed - 2,500 LT), Đạp Tuyết Ngoa (+20 Speed, +5% Dodge - 2,000 LT), Bích Ngọc Bội (+60 ATK, +50 DEF, +10% Crit DMG, +2% Lifesteal - 2,400 LT).
       + *Tam Giai (Kim Đan Kỳ - Realm 16-20):* Tử Dương Kiếm (+650 ATK, +7% Crit, +6% Pen - 25K LT), Tử Phủ Đạo Bào (+520 DEF, +3,000 HP, +5% DmgRed - 22K LT), Lôi Quang Ngoa (+45 Speed, +7% Dodge - 18K LT), Uẩn Thần Giới (+220 ATK, +180 DEF, +15% Crit DMG, +3% Lifesteal - 20K LT).
       + *Tứ Giai (Nguyên Anh Kỳ - Realm 21-25):* Cửu U Trảm Ma Kiếm (+2,200 ATK, +9% Crit, +9% Pen - 180K LT), Chân Vũ Huyền Giáp (+1,800 DEF, +12,000 HP, +7% DmgRed - 160K LT), Di Hình Huyễn Ngoa (+90 Speed, +9% Dodge - 130K LT), Cửu Chuyển Hồn Bội (+750 ATK, +600 DEF, +20% Crit DMG, +4% Lifesteal - 150K LT).
       + *Ngũ Giai (Hóa Thần Kỳ - Realm 26-30):* Thái Hư Diệt Thần Kích (+7,500 ATK, +12% Crit, +12% Pen - 1.2M LT), Ngũ Hành Hỗn Nguyên Giáp (+6,000 DEF, +45,000 HP, +10% DmgRed - 1M LT), Súc Địa Thần Hài (+180 Speed, +12% Dodge - 850K LT), Thái Hư Giới Chỉ (+2,500 ATK, +2,000 DEF, +30% Crit DMG, +5% Lifesteal - 950K LT).
       + *Lục Giai (Luyện Hư Kỳ - Realm 31-35):* Luyện Hư Quy Chân Kiếm (+25,000 ATK, +15% Crit, +15% Pen - 7.5M LT), Hư Không Toái Phiến Giáp (+20,000 DEF, +160,000 HP, +13% DmgRed - 6.8M LT), Du Long Thần Ngoa (+350 Speed, +15% Dodge - 5.5M LT), Cửu Khiếu Thông Linh Bội (+8,500 ATK, +7,000 DEF, +40% Crit DMG, +6% Lifesteal - 6M LT).
       + *Thất Giai (Hợp Thể Kỳ - Realm 36-40):* Bát Hoang Tru Tiên Đao (+90,000 ATK, +18% Crit, +20% Pen - 45M LT), Thái Cực Kim Thân Giáp (+75,000 DEF, +600,000 HP, +16% DmgRed - 40M LT), Đạp Hư Vô Cực Ngoa (+700 Speed, +18% Dodge - 32M LT), Thất Tinh Hồn Giới (+30,000 ATK, +25,000 DEF, +55% Crit DMG, +8% Lifesteal - 36M LT).
       + *Bát Giai (Đại Thừa Kỳ - Realm 41-45):* Vạn Cổ Diệt Thế Kiếm (+320,000 ATK, +22% Crit, +25% Pen - 280M LT), Bất Hủ Thánh Thể Giáp (+260,000 DEF, +2,200,000 HP, +20% DmgRed - 250M LT), Càn Khôn Na Di Ngoa (+1,400 Speed, +22% Dodge - 200M LT), Hồng Mông Luân Hồi Bội (+110,000 ATK, +90,000 DEF, +75% Crit DMG, +10% Lifesteal - 220M LT).
       + *Cửu Giai (Độ Kiếp / Tiên Nhân - Realm 46+):* Hỗn Độn Khai Thiên Thần Kiếm (+1,200,000 ATK, +30% Crit, +35% Pen - 1.8B LT), Cửu Cực Tiên Thiên Bảo Giáp (+1,000,000 DEF, +8,500,000 HP, +25% DmgRed - 1.5B LT), Thái Hư Hư Không Thần Ngoa (+3,000 Speed, +30% Dodge - 1.2B LT), Sáng Thế Hỗn Độn Giới (+450,000 ATK, +380,000 DEF, +100% Crit DMG, +15% Lifesteal - 1.4B LT).
     - Triển khai helper `equipmentShopItemToMerchantItem`, `equipmentShopItemToEquipment`, danh sách `TIER_EQUIPMENT_MERCHANT_ITEMS` và tra cứu `EQUIPMENT_SHOP_ITEMS_MAP`.
  3. **Pure Business Logic Engine & Stat Comparator (`lib/equipment-shop-logic.ts`):**
     - `buyEquipmentItem(player, equipItem, autoEquip)`: Xác thực cảnh giới, kiểm tra số dư Linh Thạch qua `calculateTotalEquivalentHaPham`, khấu trừ an toàn qua `deductEquivalentLinhThach`. Nếu `autoEquip`, tự động trang bị vào slot tương ứng của người chơi (`player.equipment` và `player.equippedEquipment`), chuyển trang bị cũ vào túi đồ. Nếu mua vào túi, xác thực sức chứa túi đồ và nạp an toàn vào `inventory.equipment` / `inventory.equipments`.
     - `compareEquipmentStats(newEquip, currentEquip)`: Động cơ so sánh đối soát 10 thuộc tính, tính toán sai số $\Delta$ (delta) chính xác phục vụ hiển thị nhãn xanh lá (+)/đỏ (-) trực quan.
  4. **Tích Hợp Chỉ Số Chiến Đấu & Sinh Mệnh (`lib/destiny-data.ts`, `lib/game-logic/stats.ts`):**
     - Cập nhật `calculateCombatStats` trong `destiny-data.ts`: Quét trực tiếp toàn bộ 5 slot trang bị (`weapon`, `armor`, `boots`, `accessory`, `artifact`), cộng dồn chính xác `atk`, `def`, `speed`, `critRate`, `critDmg`, `dodge`, `penetration`, `damageReduction`, `lifesteal` vào chỉ số giao tranh của tu sĩ.
     - Cập nhật `stats.ts`: Tích hợp `equipmentStats` vào `calculateCombatPower` (tính điểm chiến lực) và `getMaxKhiHuyet` (cộng trực tiếp max HP từ giáp và trang sức).
  5. **Giao Diện Thương Hội & Bộ Lọc 2 Tầng Cổ Phong (`components/tabs/MerchantTab.tsx`):**
     - Sub-tab mới: `⚔️ Trang Bị` trên thanh chuyển đổi phân mục Thương Hội.
     - Bộ lọc 2 tầng cổ phong:
       + Hàng 1 (Phẩm Giai): `[Tất Cả]`, `[Giai 1]` $\rightarrow$ `[Giai 9]` kèm badge đếm số lượng động.
       + Hàng 2 (Vị Trí): `[Toàn Bộ Vị Trí]`, `[⚔️ Vũ Khí]`, `[🛡️ Chiến Giáp]`, `[👢 Phi Ngoa]`, `[💍 Trang Sức]`.
     - Thẻ bài trang bị cổ phong: Viền phát quang linh động theo Tier, badge vị trí slot, live stat diff (ví dụ: `Công Kích: +650 (+470)`), badge trạng thái `✓ ĐANG TRANG BỊ` tự động khóa nút mua, badge cảnh giới `🔒 Cần đạt [Cảnh Giới]`.
     - Hai nút hành động: `[Chi Tiết]`, `[📥 Vào Túi]` và `[⚡ Mặc Ngay]`.
     - Modal Chi Tiết Thần Binh (`viewingEquipModal`): Điển tích chế tác, toàn bộ 10 chỉ số so sánh, yêu cầu cảnh giới và 2 nút Mua Vào Túi / Mua & Mặc Ngay tiện lợi.
  6. **Data Migration & Action Hook (`lib/save-migration.ts`, `hooks/useMerchantInventoryActions.ts`, `components/GameDashboard.tsx`):**
     - Chuẩn hóa an toàn `equippedEquipment` và `equipment` (hỗ trợ slot `boots`), đồng bộ `inventory.equipment` và `inventory.equipments`.
     - Bổ sung `handleBuyEquipment` trong `useMerchantInventoryActions.ts`, phát SFX `breakthrough` / `craft`, hiển thị toast và ghi nhật ký giao thương.
     - Kết nối handler vào `MerchantTab` trong `GameDashboard.tsx`.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/equipment-shop.ts`: (Tạo mới) Domain types phân hệ trang bị thần binh cửu giai.
  - `lib/equipment-shop-data.ts`: (Tạo mới) Dữ liệu 36 món trang bị, adapter và helper functions.
  - `lib/equipment-shop-logic.ts`: (Tạo mới) Logic mua hàng, đổi trang bị và so sánh thuộc tính `compareEquipmentStats`.
  - `lib/types/items.ts`: Mở rộng `MerchantItem` hỗ trợ `equipmentSlot`, `equipmentTier`, `equipmentStats` và slot `boots`.
  - `lib/types/index.ts`: Export toàn bộ types từ `equipment-shop`.
  - `lib/merchant-data.ts`: Tích hợp `TIER_EQUIPMENT_MERCHANT_ITEMS` vào kho hàng Thương Hội.
  - `lib/destiny-data.ts`: Tích hợp `equipmentStats` vào `calculateCombatStats` cho 5 vị trí trang bị.
  - `lib/game-logic/stats.ts`: Tích hợp `equipmentStats` vào điểm chiến lực và Max HP.
  - `lib/save-migration.ts`: Chuẩn hóa slot `boots`, bảo toàn `equippedEquipment`, đồng bộ dữ liệu Thương Hội cho save cũ.
  - `hooks/useMerchantInventoryActions.ts`: Bổ sung `handleBuyEquipment`.
  - `components/GameDashboard.tsx`: Truyền `handleBuyEquipment` vào `MerchantTab`.
  - `components/tabs/MerchantTab.tsx`: Tích hợp tab `⚔️ Trang Bị`, bộ lọc 2 tầng, card so sánh thuộc tính, nút Vào Túi / Mặc Ngay và modal chi tiết.
  - `CHANGELOG.md`: Ghi nhận bản ghi Phase 4 chuẩn mực 5 phần.
  - `README.md`: Cập nhật Mục 4.33 đặc tả hệ thống Trang Bị Thần Binh Cửu Giai.

### [2026-10-02 19:55] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Dược Thảo Linh Mộc Cửu Giai (Medicinal Herbs Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã sở hữu Đan Dược, Vật Phẩm Tu Luyện, Công Pháp Bí Tịch và Thần Thông Bí Thuật 9 giai, phân hệ **Dược Thảo Linh Dược (Herbs & Alchemy Ingredients)** – mắt xích nguyên liệu cốt lõi phục vụ Lò Luyện Đan Bách Nghệ, Dược Khố Tông Môn và Linh Điền Động Phủ – vẫn chưa được chuẩn hóa toàn diện từ Nhất Giai đến Cửu Giai.
  - Người chơi cần hệ thống dược thảo trải đều theo 9 đại cảnh giới thuộc 4 nhóm công năng chủ đạo (Dưỡng Khí, Phá Cảnh, Diên Thọ, Tiên Thiên Dị Chủng) với cơ chế mua theo lô (Batch Buying), ràng buộc cảnh giới nghiêm ngặt, tự động cộng dồn (stack) an toàn vào túi đồ và chống tràn túi/âm Linh Thạch.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/herbs-shop.ts`, `lib/types/items.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `HerbTier` (1 đến 9), `HerbCategory` (`'duong_khi' | 'pha_canh' | 'dien_tho' | 'di_chung'`), và interface `HerbShopItem` chuẩn mực (`id`, `name`, `tier`, `category`, `price`, `requiredRealmIndex`, `primaryAlchemyUse`, `elementalAffinity`, `rarityGrade`, `flavorText`, `badgeColor`).
     - Mở rộng `MerchantItem` trong `lib/types/items.ts`: bổ sung `herbCategory`, `herbTier`, `primaryAlchemyUse` và hỗ trợ `'herbs'` song song với `'materials'`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Dữ Liệu 36 Loại Dược Thảo Cửu Giai (`lib/herbs-shop-data.ts`):**
     - Thiết kế trọn vẹn 36 loại thảo dược linh mộc quý hiếm trải đều 9 đại cảnh giới:
       + *9 Dưỡng Khí Thảo (Qi Nourishing Herbs):* Ninh Thần Thảo (T1 - 60 LT), Chân Nguyên Hoa (T2 - 600 LT), Kim Dương Thảo (T3 - 4.5K LT), Tụ Anh Linh Chi (T4 - 30K LT), Thái Hư Dẫn Khí Thảo (T5 - 180K LT), Thái Ất Chân Linh Diệp (T6 - 1.3M LT), Cửu Dương Quy Nguyên Căn (T7 - 9M LT), Hỗn Nguyên Thánh Đạo Thảo (T8 - 60M LT), Hỗn Độn Tạo Hóa Căn (T9 - 450M LT) phục vụ luyện các loại đan dược bồi bổ chân nguyên và tu vi.
       + *9 Phá Cảnh Dị Dược (Breakthrough Catalyst Herbs):* Hoàng Tinh Căn (T1 - 100 LT), Địa Tâm Hỏa Chi (T2 - 1.4K LT), Ngưng Kim Hóa Dịch Thảo (T3 - 12K LT), Toái Đan Hóa Anh Thảo (T4 - 75K LT), Hóa Thần Ngọc Tủy Mộc (T5 - 450K LT), Quy Chân Luyện Hư Đằng (T6 - 3M LT), Pháp Thân Hợp Nhất Chi (T7 - 18M LT), Đại Thừa Viên Mãn Quả (T8 - 130M LT), Độ Kiếp Hóa Lôi Liên (T9 - 900M LT) phục vụ luyện chế đan đột phá bình cảnh (Phá Chướng Đan, Trúc Cơ Đan, Kết Kim Đan, Hóa Anh Đan, Hóa Thần Đan, Luyện Hư Đan, Hợp Thể Đan, Đại Thừa Đan, Độ Kiếp Tiên Đan).
       + *9 Diên Thọ Thần Chi (Lifespan & Recovery Herbs):* Huyết Khí Chi (T1 - 80 LT), Bách Niên Hà Thủ Ô (T2 - 900 LT), Thiên Niên Chu Quả (T3 - 8K LT), Vạn Niên Thanh Liên (T4 - 60K LT), Bồ Đề Trường Sinh Chi (T5 - 350K LT), Thiên Niên Bất Lão Căn (T6 - 2.2M LT), Niết Bàn Bất Diệt Hoa (T7 - 25M LT), Cửu Chuyển Hồi Thiên Mộc (T8 - 110M LT), Bất Tử Vĩnh Sinh Thần Thảo (T9 - 750M LT) phục vụ luyện đan diên thọ, phục hồi khí huyết và thanh tẩy đan độc.
       + *9 Tiên Thiên Dị Chủng (Rare Mutation Herbs):* Bạch Ngọc Quả (T1 - 180 LT), Ngũ Hành Linh Đằng (T2 - 2.2K LT), Tử Linh U Uẩn Hoa (T3 - 15K LT), Cửu U Uẩn Thần Quả (T4 - 110K LT), Ngộ Đạo Vấn Tâm Hoa (T5 - 600K LT), Hư Không Huyễn Tinh Quả (T6 - 4M LT), Vạn Kiếp Thần Thiết Liên (T7 - 32M LT), Thông Thiên Vạn Pháp Căn (T8 - 180M LT), Hồng Mông Đạo Quả Chi (T9 - 1.5B LT) phục vụ luyện đan tăng vĩnh viễn thuộc tính và tẩy tủy hoán cốt.
     - Triển khai adapter `herbShopItemToMerchantItem`, danh sách `TIER_HERBS_MERCHANT_ITEMS`, từ điển tra cứu nhanh `HERBS_SHOP_ITEMS_MAP` và các helper badge `getHerbCategoryBadge`, `getHerbElementalBadge`.
  3. **Pure Business Logic Engine & Mua Hàng Theo Lô (`lib/herbs-shop-logic.ts`):**
     - `calculateMaxAffordableHerbs(player, herbItem)`: Tính toán số lượng tối đa có thể mua dựa trên tổng Linh Thạch quy đổi (kể cả Trung Phẩm, Thượng Phẩm, Cực Phẩm quy đổi về Hạ Phẩm) và giới hạn sức chứa túi đồ `player.inventory.herbs`.
     - `buyHerbsBatch(player, herbItem, quantity)`: Kiểm tra cảnh giới nghiêm ngặt (`player.currentRealm >= herbItem.requiredRealmIndex`), tính toán tổng giá, xác thực sức chứa ô túi đồ nếu là vật phẩm mới, khấu trừ Linh Thạch an toàn qua `deductEquivalentLinhThach`, cộng dồn số lượng an toàn vào `inventory.herbs` và trả về `PlayerStats` cập nhật kèm thông điệp hào sảng.
  4. **Tích Hợp Kho Hàng Thương Hội & Tự Động Di Trú Dữ Liệu (`lib/merchant-data.ts`, `lib/save-migration.ts`):**
     - Tích hợp toàn bộ 36 loại Dược Thảo vào `allRaw` của Vạn Bảo Thương Hội, hỗ trợ truy vấn đồng bộ khi chọn tab `'materials'` hoặc `'herbs'`.
     - Nâng cấp `normalizePlayerData` trong `lib/save-migration.ts`: tự động di trú và bổ sung các loại thảo dược mới vào danh mục thương hội của các save game cũ, chuẩn hóa cấu trúc `inventory.herbs` tránh undefined/trùng lặp.
  5. **Action Hook & Custom Handlers (`hooks/useMerchantInventoryActions.ts`, `components/GameDashboard.tsx`):**
     - Bổ sung `handleBuyHerbsBatch(herbItem, quantity)` vào `useMerchantInventoryActions`: kết nối logic engine, cập nhật `player` state, phát âm thanh `playSfx?.('alchemy')` và ghi nhật ký giao dịch.
     - Truyền handler đồng bộ vào `<MerchantTab />` trong `GameDashboard.tsx`.
  6. **Giao Diện Thương Hội & Bộ Lọc 2 Tầng Cổ Phong (`components/tabs/MerchantTab.tsx`):**
     - Sub-tab mới: `🌿 Dược Thảo` trên thanh chuyển đổi danh mục.
     - Bộ lọc 2 tầng chuyên nghiệp:
       + Hàng 1 (Phẩm Giai): `[Tất Cả]`, `[Giai 1]` $\rightarrow$ `[Giai 9]` kèm badge đếm số lượng thảo dược động.
       + Hàng 2 (Chủng Loại): `[Toàn Bộ Loại]`, `[🍃 Dưỡng Khí]`, `[⚡ Phá Cảnh]`, `[🍄 Diên Thọ]`, `[🌸 Tiên Thiên Dị Chủng]`.
     - Thẻ bài dược thảo cổ phong: Viền phát quang linh động theo phẩm cấp (Xám $\rightarrow$ Lục $\rightarrow$ Lam $\rightarrow$ Tím $\rightarrow$ Hoàng Kim $\rightarrow$ Xích Hồng $\rightarrow$ Tử Kim $\rightarrow$ Hắc Thần $\rightarrow$ Hỗn Độn Thất Thải), badge phân loại, badge ngũ hành, badge công năng luyện đan `🧪 Luyện: [Tên Đan]`, flavor text, hiển thị số lượng hiện có trong túi đồ (`Đang có: X cành`).
     - Trạng thái khóa cảnh giới: Badge đỏ `🔒 Cần đạt [Cảnh Giới]`, thẻ làm mờ (`opacity-75`), vô hiệu hóa nút mua.
     - Hộp thoại mua số lượng lớn (Batch Buy Modal): Slider kéo chọn mượt mà, các nút chọn nhanh `[1]`, `[10]`, `[50]`, `[100]`, `[Tối Đa (Max Khả Mua)]`, cảnh báo sức chứa túi đồ, live preview tổng Linh Thạch tiêu hao và số dư còn lại sau giao dịch.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/herbs-shop.ts`: (Tạo mới) Domain types phân hệ dược thảo linh mộc cửu giai.
  - `lib/types/items.ts`: Mở rộng `MerchantItem` (`herbCategory`, `herbTier`, `primaryAlchemyUse`) và category `'herbs'`.
  - `lib/types/index.ts`: Barrel export `herbs-shop`.
  - `lib/herbs-shop-data.ts`: (Tạo mới) 36 loại Dược Thảo 9 giai, adapter, catalog maps và badge helpers.
  - `lib/herbs-shop-logic.ts`: (Tạo mới) Pure logic engine mua theo lô, stack an toàn và tính toán max affordable.
  - `lib/merchant-data.ts`: Tích hợp 36 dược thảo vào `allRaw` và match category cho `'materials'` / `'herbs'`.
  - `hooks/useMerchantInventoryActions.ts`: Bổ sung handler `handleBuyHerbsBatch` với SFX alchemy.
  - `lib/save-migration.ts`: Đồng bộ thuộc tính dược thảo và tự động cập nhật thương hội cho save game cũ.
  - `components/tabs/MerchantTab.tsx`: Tích hợp sub-tab `🌿 Dược Thảo`, bộ lọc 2 tầng, herb cards, số lượng đang có và Batch Buy Modal.
  - `components/GameDashboard.tsx`: Kết nối `handleBuyHerbsBatch` vào `MerchantTab`.
  - `README.md`: Bổ sung Mục 4.31 đặc tả chi tiết phân hệ Dược Thảo Linh Mộc Cửu Giai.
  - `CHANGELOG.md`: Bổ sung bản ghi Phase 4 mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công 100% qua Next.js 16 Turbopack (Exit code 0).
  - Single-Player Client-First 100%, bảo toàn dữ liệu lưu trữ túi đồ và tiền tệ của người chơi.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Đồng bộ kho dược thảo với phân hệ Lò Luyện Đan Bách Nghệ, Dược Khố Tông Môn và Linh Điền Động Phủ để tự động lấy nguyên liệu từ túi đồ khi luyện đan hoặc trồng trọt.

### [2026-10-02 19:15] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Thần Thông Bí Thuật Cửu Giai (Active & Domain Arts Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã sở hữu Đan Dược, Tài Nguyên Tu Luyện và Công Pháp Bí Tịch 9 giai, hệ thống **Thần Thông Bí Thuật (Active & Domain Arts)** – vũ khí tối thượng mang tính chuyển bại thành thắng trong các trận giao tranh đỉnh cao – vẫn chưa được tích hợp hoàn chỉnh thành một danh mục chuyên biệt từ Nhất Giai đến Cửu Giai.
  - Người chơi cần hệ thống thần thông chủ động và dị tượng lĩnh vực với cơ chế hồi chiêu theo hiệp, điều kiện kích hoạt đa dạng, thanh quản lý Ô Thần Thông Xuất Chiến (Equipped Slots) theo cảnh giới, và kết nối trực tiếp vào động cơ giao tranh thực chiến.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/divine-abilities.ts`, `lib/types/player.ts`, `lib/types/items.ts`, `lib/types/index.ts`):**
     - Khai báo các type: `DivineTier` (1 đến 9), `DivineCategory` (`'cong_phat' | 'ho_than' | 'tran_ap' | 'linh_vuc'`), `DivineTriggerCondition` (`'active_cooldown' | 'hp_below_30' | 'combat_start' | 'on_crit_strike'`), `DivineCombatEffects`, `DivineAbilityShopItem`, `PlayerDivineAbilitiesState`.
     - Mở rộng `PlayerStats.divineAbilitiesState?: PlayerDivineAbilitiesState` (`learnedDivineIds`, `equippedDivineIds`).
     - Bổ sung `divineAbility?: any; divineCategory?: any; divineEffects?: any;` vào `MerchantItem` và `'divine'` vào `MerchantCategory`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Tàng 36 Pho Thần Thông 9 Giai (`lib/divine-abilities-data.ts`):**
     - Thiết kế đầy đủ 36 pho Thần Thông trải đều từ Nhất Giai (Luyện Khí) đến Cửu Giai (Độ Kiếp / Tiên Nhân) thuộc 4 đại môn phái:
       + *9 Công Phạt Thần Thông:* Bạch Viêm Hỏa Cầu (180% ATK), Thanh Mộc Kiếm Khí (230% ATK), Tam Muội Chân Hỏa (300% ATK), Chích Thủ Già Thiên (380% ATK), Ngũ Hành Thần Quang (480% ATK), Hư Không Toái Liệt Trảm (600% ATK), Đại Diệt Tuyệt Thần Quang (800% ATK), Chư Thiên Tinh Thần Lạc (1100% ATK) và Khai Thiên Tích Địa Thần Lôi (1600% ATK + Execute trảm sát dưới 20% HP).
       + *9 Hộ Thân Thần Thông:* Ngưng Thủy Hộ Thuẫn (khiên 15% HP), Kim Cang Thuẫn Khí (DEF + phản đòn 15%), Tử Phủ Kim Thân (hồi 25% HP + 35% DEF khi < 30% HP), Nguyên Anh Thế Mạng (né sát tử giữ 1 HP + 50% né), Hư Vô Thần Thuẫn (miễn thương 100% trong 1 hiệp), Hỗn Độn Hộ Thể Khí (khiên 40% HP + phản chấn 30%), Bất Tử Niết Bàn Thể (hồi sinh 35% HP + Vô Địch 1 hiệp), Đảo Chuyển Càn Khôn (chuyển 100% sát thương nhận vào thành hồi máu), Vạn Cổ Bất Hủ Tiên Khu (miễn thương 60% vĩnh viễn + hồi 5% HP mỗi lần bị đánh).
       + *9 Trấn Áp Khống Chế:* Lạc Thạch Định Thân (choáng 30%), Hàn Băng Tỏa Liên (-30% Tốc, -15% Công), Thần Niệm Chấn Nhiếp (100% Choáng 1 hiệp), U Minh Tỏa Hồn (phong ấn tuyệt kỹ đối phương), Hóa Thần Nhất Niệm (-50% ATK đối thủ), Thời Gian Tĩnh Chỉ Thuật (ngưng đọng thời gian khiến địch nhận +30% dmg), Thiên Địa Lao Lung (cấm né tránh, -60% DEF), Luân Hồi Tước Mệnh (xóa nộ khí và phong ấn kỹ năng 3 hiệp), Hỗn Độn Hóa Đạo Kích (tước đoạt 50% ATK & DEF của địch chuyển sang bản thân).
       + *9 Dị Tượng Lĩnh Vực:* Ngự Phong Tật Hành (+20% Thân Pháp, +10% Né), Xích Diễm Khí Tràng (đốt cháy 5% HP địch/hiệp), Thái Cực Kiếm Đồ (+15% Toàn thuộc tính, hồi 5% HP/hiệp), Cửu Tiêu Hàn Băng Vực (-40% Tốc, -25% Bạo của địch), Vạn Kiếm Triều Tông Vực (+30% ATK, phóng kiếm 100% ATK/hiệp), Quy Chân Luyện Hư Giới (miễn mọi debuff, +25% Bạo), Pháp Thiên Tượng Địa (+100% Max HP, +50% ATK, +30% Miễn thương trong 4 hiệp), Thái Sơ Hỗn Độn Lĩnh Vực (+60% Toàn thuộc tính, hồi 10% HP/hiệp), Vạn Cổ Duy Ngã Độc Tôn Giới (+100% ATK, +50% Bạo Kích, +150% Bạo Thương, miễn toàn bộ khống chế đến hết trận).
     - Adapter `divineShopItemToMerchantItem`, danh sách `TIER_DIVINE_MERCHANT_ITEMS`, từ điển `DIVINE_SHOP_ITEMS_MAP`, helper `getDivineCategoryBadge`.
  3. **Pure Business Logic Engine (`lib/divine-abilities-logic.ts`):**
     - `getMaxDivineAbilitySlots(realmIndex)`: Quy định số ô xuất chiến (1 Slot cho Luyện Khí/Trúc Cơ, 2 Slots cho Kim Đan/Nguyên Anh, 3 Slots cho Hóa Thần/Luyện Hư, 4 Slots cho Hợp Thể trở lên).
     - `buyAndLearnDivineAbility(player, divineItem)`: Kiểm tra cảnh giới, khấu trừ Linh Thạch an toàn, chặn mua trùng lặp, lưu vĩnh viễn và tự động gắn vào ô xuất chiến nếu còn chỗ trống.
     - `equipDivineAbility(player, abilityId)` & `unequipDivineAbility(player, abilityId)`: Quản lý danh sách ô thần thông trang bị, kiểm tra giới hạn slot.
     - `processCombatDivineAbilities(player, turn, playerCurHp, playerMaxHp, bossCurHp, bossMaxHp, playerAtk, isCrit, usedAbilityTracker)`: Pure combat loop processor tính toán toàn diện hiệu ứng sát thương, khiên chắn, khống chế, vô địch, hồi phục và trảm sát.
  4. **Tích Hợp Trực Tiếp Combat Engine (`lib/boss-trial-data.ts`, `lib/game-logic/combat.ts`):**
     - `simulateTurnBasedCombat`: Gọi `processCombatDivineAbilities` trong từng hiệp, đưa log rực rỡ `"⚡ [THẦN THÔNG HIỂN LINH]..."` vào mô tả chiến báo, cộng dồn sát thương/khiên/choáng, áp dụng cơ chế phản phệ `reflectPercent`, trạng thái vô địch `invulnerable`, và niết bàn thế mạng `deathWardTriggered`.
     - `battleBoss`: Kích hoạt Thần Thông xuất chiến hiệp đầu, tính toán `divinePowerBonus`, phản ánh vào tương quan chiến lực và log tổng kết chiến đấu.
  5. **Tích Hợp Kho Hàng Thương Hội & Handlers (`lib/merchant-data.ts`, `hooks/useMerchantInventoryActions.ts`):**
     - Nạp 36 thần thông vào `allRaw` của Vạn Bảo Thương Hội, cập nhật `matchMerchantCategory` cho sub-tab `'skills'` và `'divine'`.
     - Cập nhật `isItemAlreadyPurchased` để nhận diện `player.divineAbilitiesState.learnedDivineIds`.
     - Cập nhật `handleBuyMerchantItem`: miễn trừ chiếm dụng ô túi đồ, lưu vào `learnedDivineIds`, tự động xuất chiến, phát âm thanh `playSfx('breakthrough')` và ghi log.
     - Bổ sung các action handlers: `handleBuyAndLearnDivineAbility`, `handleEquipDivineAbility`, `handleUnequipDivineAbility`.
  6. **Giao Diện Thương Hội & Quản Lý Ô Xuất Chiến (`components/tabs/MerchantTab.tsx`):**
     - Thêm sub-tab `🔮 Thần Thông` trên thanh điều hướng.
     - Bộ lọc 2 tầng: Hàng 1 (Phẩm Giai 1-9) + Hàng 2 (Toàn Bộ Hệ, ⚡ Công Phạt, 🛡️ Hộ Thân, ⛓️ Trấn Áp, 🌌 Lĩnh Vực).
     - Thanh Ô Thần Thông Xuất Chiến (`Equipped Slots Bar`): Hiển thị trực quan `[X / Max]` slot kèm nút gỡ bỏ nhanh.
     - Thẻ bài thần thông cổ phong: Viền phát quang linh động, badge môn phái, hiển thị hồi chiêu, điều kiện xuất chiêu, các dòng chỉ số combat, trạng thái `✓ ĐÃ ĐẮC NGỘ`, nút `Khẩu Quyết`, nút `⚔️ Xuất Chiến` / `✕ Gỡ Xuất Chiến` / `Đắc Ngộ Ngay`.
     - Modal Khẩu Quyết Thần Thông (`viewingDivineModal`): Xem chi tiết khẩu quyết cổ thư, hiệu ứng diễn hoạt và nút hành động nhanh.
  7. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Khởi tạo an toàn và cắt tỉa `divineAbilitiesState` (`learnedDivineIds`, `equippedDivineIds`) trong `normalizePlayerData`, đảm bảo không vượt quá số slot cho phép của cảnh giới hiện tại.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/divine-abilities.ts`: (Tạo mới) Domain types phân hệ thần thông bí thuật cửu giai.
  - `lib/types/player.ts`: Mở rộng `PlayerStats.divineAbilitiesState`.
  - `lib/types/items.ts`: Bổ sung `divineAbility`, `divineCategory`, `divineEffects` và `'divine'`.
  - `lib/types/index.ts`: Barrel export `divine-abilities`.
  - `lib/divine-abilities-data.ts`: (Tạo mới) 36 pho Thần Thông 9 giai, adapter và catalog maps.
  - `lib/divine-abilities-logic.ts`: (Tạo mới) Pure logic quản lý slot, mua/trang bị và engine thực chiến.
  - `lib/merchant-data.ts`: Tích hợp 36 thần thông vào `allRaw`, cập nhật matcher và check đã mua.
  - `hooks/useMerchantInventoryActions.ts`: Bổ sung handlers mua, trang bị và gỡ bỏ thần thông.
  - `components/tabs/MerchantTab.tsx`: Nâng cấp sub-tab `🔮 Thần Thông`, bộ lọc 2 tầng, equipped slots bar, divine cards và modal khẩu quyết.
  - `components/GameDashboard.tsx`: Truyền `handleEquipDivineAbility` và `handleUnequipDivineAbility` vào `MerchantTab`.
  - `lib/boss-trial-data.ts`: Tích hợp Thần Thông vào `simulateTurnBasedCombat`.
  - `lib/game-logic/combat.ts`: Tích hợp Thần Thông vào `battleBoss`.
  - `lib/save-migration.ts`: Chuẩn hóa `divineAbilitiesState` trong `normalizePlayerData`.
  - `README.md`: Bổ sung Mục 4.30 đặc tả chi tiết phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16 Turbopack (Exit code 0).
  - Single-Player Client-First 100%, bảo toàn dữ liệu save game cũ khi nạp save.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Nghiên cứu cơ chế Thần Thông Dị Tượng Cộng Hưởng (Domain Resonances) khi trang bị đồng thời các thần thông tương sinh thuộc Ngũ Hành hoặc kết hợp cùng Khí Linh và Tiên Lữ.

### [2026-10-02 18:50] - Triển Khai Phân Hệ "Vạn Bảo Thương Hội: Công Pháp Bí Tịch Cửu Giai (Martial Arts & Secret Manuals Tier 1 -> Tier 9)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Danh mục Công Pháp Bí Tịch (võ học, tâm pháp, kiếm quyết, cấm thuật) trong Vạn Bảo Thương Hội trước đây còn phân mảnh, chưa có hệ thống phân tầng từ Nhất Giai đến Cửu Giai chuẩn mực tương ứng với 9 đại cảnh giới.
  - Người chơi cần hệ thống võ học phong phú, chia đều theo 4 đại phân hệ (Công Kích, Hộ Thể, Thân Pháp, Cấm Thuật) có cơ chế lĩnh ngộ vĩnh viễn, chống học trùng lặp, kẹp cảnh giới nghiêm ngặt và dung hợp trực tiếp vào chỉ số giao tranh & chiến lực tổng thể.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/manuals-shop.ts`, `lib/types/player.ts`, `lib/types/items.ts`, `lib/types/index.ts`):**
     - Khai báo các type: `ManualTier` (1 đến 9), `ManualCategory` (`'cong_kich' | 'phong_ngu' | 'than_phap' | 'cam_thuat'`), `ManualStatsModifiers`, `ManualShopItem`, `PlayerManualsState`.
     - Mở rộng `PlayerStats.manualsState?: PlayerManualsState` (`learnedManualIds`, `equippedManualIds`).
     - Bổ sung `manualStatModifiers?: any;` và `manualCategory?: any;` vào `MerchantItem`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Kho Tàng 36 Pho Công Pháp 9 Giai (`lib/manuals-shop-data.ts`):**
     - Thiết kế đầy đủ 36 pho công pháp trải đều từ Nhất Giai (Luyện Khí) đến Cửu Giai (Độ Kiếp / Tiên Nhân):
       + 9 Công Kích Bí Điển (Thanh Phong Kiếm Pháp, Liệt Diễm Toái Sơn Đao, Huyền Thiên Kiếm Cương... đến Hỗn Độn Khai Thiên Nhất Kiếm): Tăng từ +6% đến +50% ATK, xuyên giáp lên đến +35%.
       + 9 Hộ Thể Cương Khí (Huyền Quy Hộ Tâm Quyết, Kim Cương Bất Hoại Thể... đến Cửu Cực Tiên Thiên Hộ Cương): Tăng từ +6% đến +50% DEF, miễn thương toàn cục lên đến +25%, tăng % Khí Huyết tối đa.
       + 9 Thân Pháp Bộ Pháp (Thất Tinh Du Bộ, Đạp Tuyết Vô Ngân... đến Thái Hư Hư Không Thần Hành): Tăng từ +5 đến +150 Thân Pháp, né tránh lên đến +30%.
       + 9 Tâm Thần Cấm Thuật (Toái Nhục Quyết, Huyết Sát Ma Quyết... đến Vạn Giới Quy Nhất Vô Thượng Thần Thông): Tăng Bạo Kích lên đến +30%, Bạo Thương lên đến +80%, Hút Máu lên đến +15%.
     - Adapter `manualShopItemToMerchantItem()`, danh sách `TIER_MANUALS_MERCHANT_ITEMS`, từ điển `MANUALS_SHOP_ITEMS_MAP`, helper `getManualCategoryBadge()`.
  3. **Pure Business Logic Engine (`lib/manuals-shop-logic.ts`):**
     - `calculateLearnedManualsModifiers(learnedManualIds)`: Tổng hợp toàn bộ thuộc tính gia trì từ các công pháp đã lĩnh ngộ.
     - `buyAndLearnManual(player, manualItem)`: Kiểm tra cảnh giới, kiểm tra số dư Linh Thạch đa tầng, chặn học trùng lặp, trừ tiền an toàn và kích hoạt lĩnh ngộ.
  4. **Tích Hợp Động Cơ Chiến Lực & Giao Tranh (`lib/destiny-data.ts`, `lib/game-logic/stats.ts`):**
     - `calculateCombatStats(player)`: Cộng dồn trực tiếp toàn bộ chỉ số từ `manualMods` vào ATK, DEF, Speed, Bạo Kích, Bạo Thương, Né Tránh, Miễn Thương, Hút Máu, Xuyên Giáp.
     - `calculateCombatPower(player)`: Nhân thêm hệ số chiến lực từ công pháp đã lĩnh ngộ `learnedManualMultiplier`.
     - `getMaxKhiHuyet()`: Cộng dồn % Khí Huyết từ các công pháp Hộ Thể Cương Khí vào HP tối đa.
  5. **Tích Hợp Kho Hàng Thương Hội & Action Handlers (`lib/merchant-data.ts`, `hooks/useMerchantInventoryActions.ts`):**
     - Nạp 36 công pháp vào `allRaw` của Vạn Bảo Thương Hội.
     - `isItemAlreadyPurchased`: Nhận diện và đánh dấu đã mua nếu `player.manualsState.learnedManualIds` đã có bí kíp này.
     - `handleBuyMerchantItem`: Lĩnh ngộ trực tiếp vào `manualsState`, phát âm thanh `playSfx('breakthrough')`, ghi nhật ký tiên đạo và không chiếm dụng sức chứa túi đồ.
     - `handleBuyAndLearnManual`: Handler chuyên dụng cho phép mua/học từ modal hoặc danh sách.
  6. **Giao Diện Vạn Bảo Thương Hội & Modal Khẩu Quyết (`components/tabs/MerchantTab.tsx`):**
     - Đặt tab danh mục `📜 Công Pháp`.
     - Bộ lọc 2 tầng: Hàng 1 (Giai 1 -> Giai 9 + badge đếm) và Hàng 2 (Toàn Bộ Hệ, ⚔️ Công Kích, 🛡️ Hộ Thể, 💨 Thân Pháp, 🩸 Cấm Thuật).
     - Thẻ bài công pháp: Badge phân hệ, hiển thị chi tiết các dòng thuộc tính `manualStatModifiers`, badge `✓ ĐÃ LĨNH NGỘ` phát quang, nút mua đổi sang `Đã Lĩnh Ngộ` và khóa lại khi đã học.
     - Modal Khẩu Quyết Tiên Gia (`viewingManualModal`): Hiển thị khẩu quyết thần thoại cổ phong, điển tích, bảng chỉ số dung hợp và nút lĩnh ngộ trực tiếp.
  7. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Khởi tạo an toàn `manualsState` (`learnedManualIds`, `equippedManualIds`) trong `normalizePlayerData`, bảo toàn 100% dữ liệu save game cũ khi nạp save.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/manuals-shop.ts`: (Tạo mới) Domain types phân hệ công pháp cửu giai.
  - `lib/types/player.ts`: Mở rộng `PlayerStats.manualsState`.
  - `lib/types/items.ts`: Bổ sung `manualStatModifiers` và `manualCategory` vào `MerchantItem`.
  - `lib/types/index.ts`: Barrel export `manuals-shop`.
  - `lib/manuals-shop-data.ts`: (Tạo mới) 36 pho công pháp 9 giai, adapter và catalog maps.
  - `lib/manuals-shop-logic.ts`: (Tạo mới) Pure functions tính toán chỉ số và mua/lĩnh ngộ.
  - `lib/destiny-data.ts`: Tích hợp `manualMods` vào `calculateCombatStats`.
  - `lib/game-logic/stats.ts`: Tích hợp vào `calculateCombatPower` và `getMaxKhiHuyet`.
  - `lib/merchant-data.ts`: Bổ sung 36 công pháp vào `allRaw`, cập nhật `isItemAlreadyPurchased`.
  - `hooks/useMerchantInventoryActions.ts`: Bổ sung logic mua/lĩnh ngộ công pháp bí tịch cửu giai.
  - `lib/save-migration.ts`: Chuẩn hóa `manualsState` trong `normalizePlayerData`.
  - `components/tabs/MerchantTab.tsx`: Nâng cấp bộ lọc phân hệ, render card công pháp và modal xem khẩu quyết.
  - `components/GameDashboard.tsx`: Truyền `playSfx` vào `useMerchantInventoryActions`.
  - `README.md`: Bổ sung Mục 4.29 đặc tả chi tiết phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16 Turbopack (Exit code 0).
  - Single-Player Client-First 100%, bảo toàn dữ liệu save game cũ khi nạp save.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Nghiên cứu cơ chế Dung Hợp Bí Tịch (Manual Synthesis / Arts Fusion) cho phép kết hợp các pho công pháp cùng hệ để khai mở Tuyệt Kỹ Thần Thông độc nhất vô nhị.

### [2026-10-02 18:15] - Triển Khai Phân Hệ "Tab Tu Luyện (Cultivation Items & Catalysts Tier 1 -> Tier 9)" Trong Vạn Bảo Thương Hội
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù Vạn Bảo Thương Hội đã có danh mục đan dược 9 giai, các vật phẩm chuyên dụng bổ trợ tu hành cốt lõi (Tâm Pháp Thổ Nạp, Tụ Linh Trận Bàn, Linh Tủy Tinh Hoa, Ngộ Đạo Trà & Hương) còn thiếu hụt tính hệ thống qua 9 đại cảnh giới.
  - Người chơi cần phân mục độc lập nhằm tăng tốc độ tu vi, kích hoạt hiệu suất bế quan offline và khai mở tiềm năng tu luyện một cách bài bản, bảo toàn triết lý Single-Player Client-First 100% và cơ chế kinh tế cân bằng.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/cultivation-shop.ts`, `lib/types/player.ts`, `lib/types/items.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `CultivationItemTier` (1 đến 9), `CultivationItemCategory` (`'manual' | 'array' | 'essence' | 'incense'`).
     - Khai báo `CultivationShopItem`, `ActiveCultivationArrayBuff`, `PlayerCultivationBuffState`.
     - Mở rộng `PlayerStats.cultivationBuffState` an toàn, bổ sung `cultivationEffects` và `cultivationCategory` vào `MerchantItem`.
     - Barrel export sạch sẽ qua `lib/types/index.ts`.
  2. **Dữ Liệu Danh Mục 36 Bảo Vật 9 Giai (`lib/cultivation-shop-data.ts`):**
     - Thiết kế trọn vẹn 36 vật phẩm tu luyện trải đều từ Nhất Giai (Luyện Khí) đến Cửu Giai (Độ Kiếp / Tiên Nhân):
       + 9 Tâm Pháp Thổ Nạp: Tăng vĩnh viễn từ +5% đến +35% tốc độ tu vi cơ bản.
       + 9 Tụ Linh Trận Bàn: Buff thời gian thực từ +10% (12h) đến +75% (72h) tốc độ tu vi.
       + 9 Linh Tủy Tinh Hoa: Tăng hiệu suất bế quan từ +5% đến +50%, khai mở kinh mạch đan điền.
       + 9 Ngộ Đạo Dị Bảo (Hương/Trà): Tăng vĩnh viễn Ngộ Tính, Căn Cốt, điểm Tâm Cảnh và dị tượng tử khí.
     - Hàm chuyển đổi `cultivationShopItemToMerchantItem()`, danh sách `TIER_CULTIVATION_MERCHANT_ITEMS`, hàm trợ giúp `getCultivationCategoryBadge()`.
  3. **Pure Business Logic Engine (`lib/cultivation-shop-logic.ts`):**
     - `useCultivationShopItem()`: Kiểm tra yêu cầu cảnh giới, chặn học trùng lặp tâm pháp đã giác ngộ, kích hoạt hoặc gia hạn buff trận bàn theo thời gian thực, cộng trực tiếp chỉ số linh tủy/ngộ đạo.
     - `calculateActiveCultivationBuffs()` & `cleanExpiredCultivationArrays()`: Quét và thanh lọc trận bàn hết hạn, tổng hợp % tốc độ tu vi hiện hành.
  4. **Tích Hợp Động Cơ Tu Vi & Tiến Độ Offline (`lib/game-logic/cultivation.ts`, `lib/offline-progress.ts`):**
     - `processCultivation`: Tích hợp buff từ trận bàn đang vận hành và tâm pháp đã học vào tốc độ tu vi thổ nạp chu kỳ 3 giây.
     - `offline-progress`: Tích hợp hệ số tốc độ vào `calculateOfflineSpeedMultiplier` và hệ số bế quan tích lũy `meditationEfficiencyModifier` vào `offlineTuViEfficiency`.
  5. **Nâng Cấp Giao Diện Vạn Bảo Thương Hội (`components/tabs/MerchantTab.tsx`):**
     - Đặt tab danh mục `🧘 Tu Luyện` song song với các tab truyền thống.
     - Thanh lọc 2 tầng trực quan: Lọc 9 Giai vị kèm badge số lượng và Lọc 4 phân loại bảo vật (`Tâm Pháp`, `Trận Bàn`, `Linh Tủy`, `Ngộ Đạo`).
     - Thẻ bài vật phẩm: Viền sáng theo phẩm giai, badge `✓ Đã Giác Ngộ`, badge `🌀 Vận Hành (Xh)` kèm đếm ngược, nhãn loại hình và các dòng chỉ số hiệu ứng nổi bật.
     - Khóa cảnh giới nghiêm ngặt: Phủ mờ (`opacity-75`), huy hiệu đỏ `🔒 Cần đạt [Cảnh Giới]`, vô hiệu hóa nút mua.
     - Modal chọn số lượng mua thông minh: Nhận diện icon theo loại bảo vật, hiển thị đầy đủ hiệu ứng tu luyện, ẩn chọn số lượng đối với tâm pháp.
  6. **Di Trú Dữ Liệu An Toàn & Thương Hội Handler (`lib/save-migration.ts`, `hooks/useMerchantInventoryActions.ts`):**
     - Khởi tạo an toàn `cultivationBuffState` trong `normalizePlayerData()` cho cả save cũ lẫn người chơi mới.
     - Tự động áp dụng hiệu quả vật phẩm hoặc kích hoạt buff ngay khi mua qua `useCultivationShopItem`.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/cultivation-shop.ts`: (Tạo mới) Domain types phân hệ vật phẩm tu luyện.
  - `lib/types/player.ts`: Mở rộng `PlayerStats.cultivationBuffState`.
  - `lib/types/items.ts`: Bổ sung `cultivationEffects` và `cultivationCategory` cho `MerchantItem`.
  - `lib/types/index.ts`: Barrel export `cultivation-shop`.
  - `lib/cultivation-shop-data.ts`: (Tạo mới) 36 vật phẩm tu luyện 9 giai, helpers và adapters.
  - `lib/cultivation-shop-logic.ts`: (Tạo mới) Pure logic engine áp dụng bảo vật tu luyện và quét dọn buff.
  - `lib/game-logic/cultivation.ts`: Tích hợp buff trận bàn và tâm pháp vào thổ nạp tu vi định kỳ.
  - `lib/offline-progress.ts`: Tích hợp buff tu luyện vào tiến độ bế quan offline.
  - `lib/merchant-data.ts`: Bổ sung 36 vật phẩm vào kho hàng Vạn Bảo Thương Hội.
  - `hooks/useMerchantInventoryActions.ts`: Xử lý mua và áp dụng vật phẩm tu luyện.
  - `lib/save-migration.ts`: Chuẩn hóa an toàn `cultivationBuffState` khi nạp save game.
  - `components/tabs/MerchantTab.tsx`: Nâng cấp giao diện Tab Tu Luyện, bộ lọc 2 tầng, card render và modal mua.
  - `README.md`: Bổ sung Mục 4.28 đặc tả chi tiết phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16 Turbopack (Exit code 0, 8/8 static pages generated).
  - Single-Player Client-First 100%, bảo toàn dữ liệu save game cũ khi nạp save.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Mở rộng thêm tính năng Đúc Lại Trận Bàn (Array Reforging) tại Trận Pháp Các cho phép nâng cấp thời lượng và hiệu lực của các tụ linh trận bàn cao giai.

### [2026-10-02 16:18] - Triển Khai Phân Hệ "Ký Gửi Đấu Giá & Thao Túng Phường Thị (Player Auction Consignment & Market Manipulation)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, Đấu Giá Hội chỉ cho phép người chơi đóng vai trò người mua (Buyer) tham gia tranh đoạt các lô hàng của hệ thống, không có cơ chế ký gửi bán bảo vật cực phẩm do chính mình luyện chế hoặc đoạt được từ bí cảnh.
  - Người chơi tích lũy nhiều trang bị bậc cao, đan dược cực phẩm, trứng thú và bí tịch thừa thãi nhưng chỉ có thể bán thanh lý giá bèo bọt tại tiệm buôn. Hệ thống kinh tế cần một sàn đấu giá ký gửi tự do kèm các thủ đoạn thao túng thị trường (Thần Thức dằn mặt, Chân Gỗ kích giá ảo) kịch tính mang đậm màu sắc tu chân giới.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/auction-consignment.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `ConsignmentItemType` (`'pill' | 'equipment' | 'beast_egg' | 'manual'`), `ConsignmentStatus` (`'idle' | 'listing' | 'bidding' | 'sold' | 'unsold' | 'busted'`).
     - Khai báo các interface: `ConsignmentItemSource`, `NPCBidder`, `BidRecord`, `ActiveConsignmentSession`, `ConfiscatedItemRecord`, `PlayerConsignmentState`.
     - Mở rộng `PlayerStats` an toàn với `consignmentState?: PlayerConsignmentState`.
     - Barrel export sạch sẽ trong `lib/types/index.ts`.
  2. **Dữ Liệu Cấu Hình & Pool NPC Bidders (`lib/auction-consignment-data.ts`):**
     - Khai báo danh mục 15 Thế Gia & Tông Môn tài phiệt (`NPC_BIDDERS_CATALOG`): Diệp Khinh Chu, Cổ Hạc Niên, Lăng Tuyệt Kiếm, Mộ Dung Hiểu Phong, Hắc Hạc Đạo Nhân, Khương Thần Thông...
     - Kho từ điển câu thoại tiên hiệp khi giơ biển trả giá (`BIDDER_QUOTES`) phân loại theo 6 phong cách (Tycoon, Aggressive, Greedy, Timid, Shill, Intimidated).
     - Bảng cấu hình 4 mốc Uy Tín Thương Nhân (`MERCHANT_REPUTATION_TIERS`): Gian Thương Khét Tiếng, Thương Nhân Đứng Đắn, Hào Môn Minh Độc, Thiên Hạ Đệ Nhất Thương Thánh.
  3. **Pure Business Logic (`lib/auction-consignment-logic.ts`):**
     - `createDefaultConsignmentState()`, `getReputationTier()`.
     - `getValidConsignmentItems()`: Quét và lọc toàn bộ bảo vật cực phẩm từ túi đồ người chơi.
     - `startConsignmentSession()`: Trừ phí niêm yết theo mốc Uy Tín, rút an toàn món đồ khỏi `player.inventory` chống lỗi nhân bản (Duplication Glitch), triệu tập 5 NPC Bidders ngẫu nhiên.
     - `simulateNextAuctionRound()`: AI Bidding Engine tính toán quyết định nâng giá của từng NPC theo tính cách và ngân sách tối đa, sinh câu thoại cổ phong, kiểm tra kết thúc phiên và xử lý rủi ro "tự ôm bom".
     - `executeDivineSensePressure()`: So sánh Thần Thức người chơi vs NPC; ép đối phương hoảng sợ nâng giá vọt thêm +25% đến +45% hoặc chịu phản phệ khiến NPC tức giận bỏ về.
     - `executeShillBid()`: Giả lập chân gỗ kích giá ảo, cập nhật tỷ lệ rủi ro bóc phốt (Bust Risk), xử lý tình huống bị Hội Chủ Vạn Bảo bắt quả tang (tịch thu đồ giam 24h, phạt tiền 15%, trừ 25 điểm Uy Tín).
     - `finalizeConsignmentSession()`: Khấu trừ hoa hồng sàn, chuyển tiền lãi vào túi đồ, tăng điểm Uy Tín (+3 đến +7 điểm), hoặc hoàn trả lại món đồ về túi nếu đấu giá không thành.
     - `redeemConfiscatedItem()`: Nộp phạt chuộc lại tang vật sau khi hết hạn 24 giờ giam giữ.
  4. **Custom Domain Hook (`hooks/useAuctionConsignmentActions.ts`, `hooks/index.ts`):**
     - Điều phối toàn bộ trạng thái phiên ký gửi, gõ búa chuyển vòng, hiệu ứng búa gõ, các chiêu thức dằn mặt, chân gỗ và kết toán nhận tiền.
     - Barrel export trong `hooks/index.ts`.
  5. **Nâng Cấp Giao Diện Sàn Đấu Giá Ký Gửi (`components/modals/AuctionModal.tsx`):**
     - Bổ sung thanh Sub-Tabs trên Header: Chuyển đổi linh hoạt giữa "🏛️ Hội Trường Đấu Giá (Mua)" và "🏷️ Ký Gửi & Thao Túng Phường Thị (Bán)".
     - Banner Uy Tín Thương Nhân hiển thị cấp bậc, % phí niêm yết, hoa hồng sàn và điểm uy tín.
     - Bàn niêm yết: Bộ lọc loại vật phẩm, thẻ bảo vật cực phẩm trong túi, bảng thiết lập Giá Khởi Điểm và Giá Bảo Lưu Tối Thiểu.
     - Bục Đấu Giá Ký Gửi Live Arena: Mô hình Procedural SVG chiếc búa vàng gõ nhịp trung tâm khi chuyển vòng, mức giá hiện tại hiển thị cực lớn rực rỡ, hàng ghế 5 đại năng thế gia kèm nút Dằn Mặt nhanh.
     - Bảng nhật ký trả giá (Live Ticker) cuộn mượt mà.
     - Bảng Điều Khiển Hậu Đài: Thanh đo nguy cơ bóc phốt (Bust Meter %) đổi màu động từ Xanh $\rightarrow$ Vàng $\rightarrow$ Đỏ rực, nút Gõ búa sang vòng tiếp theo và nút Cài cắm chân gỗ.
  6. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Khởi tạo an toàn `consignmentState` trong `normalizePlayerData()` cho cả người chơi mới lẫn save game cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/auction-consignment.ts`: (Tạo mới) Domain types phân hệ Ký Gửi Đấu Giá.
  - `lib/types/player.ts`: Mở rộng `PlayerStats` với `consignmentState`.
  - `lib/types/index.ts`: Barrel export `auction-consignment.ts`.
  - `lib/auction-consignment-data.ts`: (Tạo mới) Dữ liệu 15 NPC Bidders, kho thoại cổ phong, 4 mốc Uy Tín.
  - `lib/auction-consignment-logic.ts`: (Tạo mới) Pure logic AI Bidding, Thần Thức dằn mặt, Chân gỗ bóc phốt, chuộc đồ.
  - `hooks/useAuctionConsignmentActions.ts`: (Tạo mới) Custom domain hook điều phối phiên ký gửi.
  - `hooks/index.ts`: Barrel export `useAuctionConsignmentActions`.
  - `components/modals/AuctionModal.tsx`: Nâng cấp Sub-Tabs, giao diện Sàn Ký Gửi Live Arena, bục gõ búa SVG và bảng điều khiển hậu đài.
  - `components/GameDashboard.tsx`: Truyền props `onUpdatePlayer`, `onShowToast`, `onAddLog` vào `AuctionModal`.
  - `lib/save-migration.ts`: Chuẩn hóa an toàn `consignmentState` trong `normalizePlayerData()`.
  - `README.md`: Bổ sung Mục 4.26 đặc tả phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16 Turbopack (Exit code 0, 8/8 static pages generated).
  - Single-Player Client-First 100%, bảo vệ an toàn túi đồ, lưu trữ chuẩn xác qua `localStorage`.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Bổ sung sự kiện Đấu Giá Hắc Thị (Black Market Auction) diễn ra vào đêm trăng tròn tại Cấm Địa Hắc Thị, cho phép giao dịch các tà bảo cấm kỵ với tỷ lệ bóc phốt và lợi nhuận cực đại.

### [2026-10-02 16:10] - Triển Khai Phân Hệ "Vực Ngoại Dị Tộc Tập Kích & Xây Dựng Cứ Điểm Tinh Hải (Cosmic Invasions & Star Fortification)"
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, hệ thống Chư Thiên Tinh Đồ sau khi chiếm đóng các Tinh Cầu chỉ dừng lại ở việc thụ động tích lũy khoáng sản AFK, thiếu tính đe dọa động và cơ chế phòng thủ chiến thuật.
  - Người chơi cần một sân chơi chiến thuật phòng thủ cứ điểm (Tower Defense / Garrison Defense) đỉnh cao, vận dụng sức mạnh tổng hợp từ Linh Thú, Khí Linh, Đệ Tử và các đại pháo năng lượng tinh không để bảo vệ thành quả khai thác mỏ khoáng Tier 9 trước các đợt tập kích Hư Không Triều Tịch.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/cosmic-defense.ts`, `lib/types/cosmic-map.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `IncursionThreatLevel` (`'tieu_ba' | 'trung_ba' | 'dai_ba'`), `FortificationType` (`'tru_ma_phao' | 'huyen_tran' | 'ho_cuong_giap' | 'tu_linh_dai'`).
     - Khai báo các interface: `NodeFortificationState`, `GarrisonDeployment`, `VoidIncursion`, `CosmicDefenseState`.
     - Mở rộng `CosmicState` trong `lib/types/cosmic-map.ts` với `defenseState?: CosmicDefenseState`.
     - Barrel export sạch sẽ trong `lib/types/index.ts`.
  2. **Dữ Liệu Cấu Hình & Pool Dị Tộc (`lib/cosmic-defense-data.ts`):**
     - Cấu hình 5 bậc nâng cấp cho 4 loại Hộ Mạch Trận Bàn (`FORTIFICATION_CONFIGS`) với chi phí Linh Thạch, Hỗn Độn Thần Thiết, Tiên Thiên Dị Bảo.
     - Danh mục 12 Boss Dị Tộc Viễn Cổ (`VOID_BOSSES_CATALOG`): Hư Không Thực Tinh Thú, U Minh Du Tôn, Thiên Ma Chiến Tướng, Thôn Thiên Hắc Long...
     - Pool tên hạm đội tập kích cổ phong (`FLEET_NAMES_POOL`) và cấu hình đe dọa (`THREAT_LEVEL_CONFIG`).
  3. **Pure Business Logic (`lib/cosmic-defense-logic.ts`):**
     - `createDefaultCosmicDefenseState()`, `getNodeFortification()`.
     - `calculateEffectiveDefensePower()`: Tổng hợp Lực Chiến từ Trấn Thủ Sĩ (Linh Thú/Khí Linh/Đệ Tử), nhân hệ số buff từ Tụ Linh Trấn Ma Đài (+15% đến +80%).
     - `tickCosmicIncursions()`: Tự động đếm nhịp triều tịch mỗi 4-6 giờ (rút ngắn dựa theo số lượng node chiếm đóng), sinh đợt tập kích ngẫu nhiên và tính thời gian tiếp cận có làm chậm của Hỗn Độn Huyễn Trận.
     - `resolveAutoGarrisonDefense()`: Phương án A - Tru Ma Pháo nã trước 15%-55% HP địch, Lực chiến hai bên giao tranh tự động; kết toán thưởng Thần Thiết/Dị Bảo nếu thắng, hoặc phong tỏa và hao hụt tài nguyên nếu thua.
     - `resolveManualInterceptionBattle()`: Phương án B - Ngự chu tiếp viện tiêu diệt Boss nhận x2 Chiến Lợi Phẩm.
     - `upgradeFortification()`, `assignGarrisonToNode()`, `triggerManualIncursionForTesting()`.
  4. **Custom Domain Hook (`hooks/useCosmicDefenseActions.ts`, `hooks/index.ts`):**
     - Quản lý ticker đếm ngược nguy cơ tập kích thời gian thực (1 giây/nhịp).
     - Pulse kiểm tra tập kích ngẫu nhiên mỗi 30 giây.
     - Cung cấp handlers nâng cấp công trình, chỉ định trấn thủ, giải quyết thủ thành tự động kèm hiệu ứng laser Tru Ma Pháo.
     - Barrel export trong `hooks/index.ts`.
  5. **Nâng Cấp Giao Diện Sa Bàn SVG & Drawer (`components/cosmic/CosmicMapModal.tsx`):**
     - **Radar Cảnh Báo Tinh Hải (SVG Incursion Beacon):** Sóng xung kích đỏ nhấp nháy (`animate-ping stroke-rose-500`) trên node Tinh Cầu, đường kẻ đứt ma hạm đỏ nối từ Hư Không Liệt Phùng, icon 🚨 và nhãn đếm ngược thời gian tiếp cận.
     - **Header Banner Nguy Cấp:** Hiển thị thông tin hạm đội địch đang áp sát và nút nhảy nhanh tới cứ điểm.
     - **Drawer Quản Lý Cứ Điểm:** Sub-tab chuyển đổi giữa Mỏ Khoáng và Cứ Điểm Phòng Ngự; bảng 4 công trình Hộ Mạch Trận Bàn kèm vạch sao cấp độ; khu vực Trấn Thủ Cứ Điểm hiển thị tổng Lực Chiến.
     - **Modal Chọn Trấn Thủ Sĩ:** Lựa chọn nhanh giữa Khí Linh Bản Mệnh, Linh Thú xuất chiến và Chân Truyền Đệ Tử.
     - **Modal Kết Toán Chiến Trận Thủ Thành:** Báo cáo chi tiết sát thương Tru Ma Pháo, Lực chiến hai bên, tỷ lệ thắng và chiến lợi phẩm thu được.
  6. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Chuẩn hóa an toàn `defenseState` trong `normalizePlayerData()` cho cả người chơi mới lẫn save game cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/cosmic-defense.ts`: (Tạo mới) Domain types phân hệ phòng ngự tinh hải & tập kích.
  - `lib/types/cosmic-map.ts`: Mở rộng `CosmicState` với `defenseState`.
  - `lib/types/index.ts`: Barrel export `cosmic-defense.ts`.
  - `lib/cosmic-defense-data.ts`: (Tạo mới) Dữ liệu 4 công trình, 12 Boss Dị Tộc, pool hạm đội, cấu hình đe dọa.
  - `lib/cosmic-defense-logic.ts`: (Tạo mới) Pure logic tính đạn pháo, làm chậm, lực chiến, giao tranh tự động và thủ công.
  - `hooks/useCosmicDefenseActions.ts`: (Tạo mới) Custom domain hook quản lý thời gian thực và hành động phòng ngự.
  - `hooks/index.ts`: Barrel export `useCosmicDefenseActions`.
  - `components/cosmic/CosmicMapModal.tsx`: Nâng cấp sa bàn SVG radar đỏ, Drawer 4 công trình, modal chọn trấn thủ và kết toán chiến trận.
  - `lib/save-migration.ts`: Chuẩn hóa an toàn `defenseState` trong `normalizePlayerData()`.
  - `README.md`: Bổ sung Mục 4.25 đặc tả phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16 Turbopack (Exit code 0, 8/8 static pages generated).
  - Single-Player Client-First 100%, bảo toàn dữ liệu lưu trữ qua `localStorage`.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Nghiên cứu cơ chế Trận Pháp Liên Kết Tinh Vực (Sector Resonance Defense) cho phép các cứ điểm lân cận tương hỗ nã pháo chi viện chéo khi có đại ba xâm lăng.

---

## 📋 QUY CHUẨN GHI CHÉP & BẢO TRÌ NHẬT KÝ (MAINTENANCE POLICY)

1. **Tiêu Chuẩn Bản Ghi 5 Phần Nghiêm Ngặt (5-Part Standard Form):**
   Mọi bản cập nhật mới trong tương lai đều phải tuân thủ nghiêm ngặt 5 phần cấu trúc chuẩn:
   - *Phần 1 - Tiêu đề, Phiên bản & Mốc thời gian:* Dạng `### [YYYY-MM-DD HH:mm] - Tiêu Đề Nâng Cấp / Bản Vá`
   - *Phần 2 - Mục tiêu & Bối cảnh (Why & Problem):* Nêu rõ lý do, động lực thiết kế và khiếm khuyết cần giải quyết
   - *Phần 3 - Chi tiết kỹ thuật & Giải pháp (What & How):* Bóc tách tường tận kiến trúc domain types, pure logic, custom hooks, UI components, kèm danh mục các tệp can thiệp (`Files Touched`)
   - *Phần 4 - Kết quả kiểm định chất lượng (Quality Gates):* Báo cáo kết quả kiểm tra kiểu dữ liệu (`npx tsc --noEmit`), kết quả biên dịch (`npm run build`), và cơ chế bảo toàn dữ liệu save game
   - *Phần 5 - Kế hoạch & Định hướng tiếp theo (Next Steps):* Đề xuất các tính năng nối tiếp hoặc mở rộng tiếp cận

2. **Quy Trình Đóng Gói Phân Kỳ (Phase Archival Lifecycle):**
   - Khi phân khu **Giai Đoạn Hiện Tại (Active Developing)** tích lũy đủ 4–5 phân hệ quy mô lớn:
     - Tạo tệp lưu trữ phân kỳ tiếp theo tại: `docs/changelogs/PHASE_X_[TÊN_GIAI_ĐOẠN].md`.
     - Di chuyển các bản ghi tương ứng vào tệp mới, giữ nguyên 100% định dạng và văn phong kỹ thuật.
     - Cập nhật dòng mới vào **Bảng Chỉ Mục Lịch Sử Toàn Diện (Master Archive Directory)** ở đầu trang.
     - Dọn dẹp phân khu Hiện Tại để sẵn sàng tiếp nhận các bản ghi của giai đoạn mới.
