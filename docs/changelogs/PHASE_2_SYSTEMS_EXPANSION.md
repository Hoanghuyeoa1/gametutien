# 📜 GAMETUTIEN • NHẬT KÝ PHÁT TRIỂN: GIAI ĐOẠN 2 - ĐỘT PHÁ KIẾN TRÚC & MỞ RỘNG HỆ THỐNG

> **Đường dẫn liên kết:** [⬅️ Quay lại Master Changelog](../../CHANGELOG.md) | [📖 Tài liệu kiến trúc README.md](../../README.md)
> **Thời gian:** 2026-10-02 06:30 → 2026-10-02 14:35 | **Tổng số bản ghi:** 18 bản ghi kỹ thuật
> **Phạm vi trọng tâm:** Chuyển đổi và quy chuẩn hóa kiến trúc tài liệu README, Cơ chế Khóa Cảnh giới Thể/Hồn/Bách Nghệ, Lối tắt điều hướng, Hệ thống Tông môn 20 phái 5 Tier, Đại cải tổ Vạn Bảo Thương Hội (Tách bạch đan dược, Sub-tab Khoáng thạch, Bộ lọc nhanh Tier 1-9, Deterministic Multi-Level Comparator, Lò dung luyện tái chế), Tranh đoạt Linh Mạch & Hộ Sơn Trận, Lục Đạo Luân Hồi Meta-progression, Cốt truyện Chương VIII-IX, Thiên Kiêu Bảng PvP, Chuỗi mã hóa Tiên Thư Bản Thể (Adler-32 Checksum), 65 Thành Tựu Tiên Giới, Tái cấu trúc dung lượng túi đồ độc lập (Bag Capacity Single Source of Truth), Ấp Linh Noãn Thần Thú và các bản vá sửa lỗi nhảy cóc cốt truyện, reset tích cốc đan.

---

### [2026-10-02 14:35] - Sửa Triệt Để Lỗi Cốt Truyện Nhảy Cóc Hồi & Lỗi Bán Tích Cốc Đan Bị Reset Về 10
- **Mục tiêu & Bối cảnh (Why & Problem):**
  1. *Lỗi Cốt Truyện Bị Nhảy Cóc Hồi (Storyline Sequential Progression Bypass):* Trong các chương cốt truyện (như Chương 1), khi người chơi chưa hoàn thành Hồi 2 (`quest_1_2`), hệ thống vẫn cho phép nhấp chọn và thực hiện luôn Hồi 3 (`quest_1_3`), phá vỡ tính mạch lạc của câu chuyện và trình tự phát triển nhân vật.
  2. *Lỗi Bán Tích Cốc Đan Về 0 Bị Reset Lại Thành 10 (Zero-Quantity Reseed Bug):* Khi người chơi bán hoặc tiêu hao toàn bộ số lượng Tích Cốc Đan trong túi đồ về 0, mỗi khi nạp lại game, chuyển đổi tab hoặc lưu tiến trình, hàm `normalizePlayerData()` tự ý cấp bù 10 viên đan dược tân thủ, tạo ra lỗ hổng trục lợi bán vô hạn Linh Thạch (Infinite Money Exploit).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Khắc Phục Lỗi Cốt Truyện Tuần Tự (`lib/storyline-data.ts`, `lib/storyline-logic.ts`, `hooks/useStorylineActions.ts`, `components/modals/StorylineModal.tsx`):**
     - Bổ sung helper `getChapterByQuestId(questId)` trong `lib/storyline-data.ts`.
     - Xây dựng hàm pure `isQuestAvailable(chapter, questIndex, player)`:
       + Kiểm tra điều kiện cảnh giới `player.currentRealm >= quest.realmRequirement`.
       + Nếu là Hồi 1 (`questIndex === 0`): Kiểm tra toàn bộ nhiệm vụ của chương liền trước (nếu có) đã hoàn tất.
       + Nếu là Hồi 2, Hồi 3... (`questIndex > 0`): BẮT BUỘC Hồi liền trước trong cùng chương (`chapter.quests[questIndex - 1]`) đã nằm trong `completedQuestIds`.
     - Cập nhật `getQuestStatus`: Sử dụng `isQuestAvailable` để trả về trạng thái `'locked'` chính xác.
     - Thiết lập cơ chế phòng thủ chuyên sâu (Defense in Depth) trong `applyChoiceOutcomes` và `claimQuestRewardLogic` (`lib/storyline-logic.ts`): Từ chối xử lý và trả về thông báo lỗi an toàn nếu quest chưa mở khóa.
     - Kiểm tra điều kiện tuần tự trong `selectChoice` và `claimQuestReward` (`hooks/useStorylineActions.ts`): Chặn hoàn toàn hành vi chọn phương án hoặc nhận thưởng nhiệm vụ chưa mở khóa kèm Toast cảnh báo.
     - Nâng cấp giao diện `StorylineModal.tsx`:
       + Cột Trái: Hiển thị icon `🔒`, badge `Chưa Mở`, dòng lý do khóa màu đỏ `🔒 ${lockReason}`, và làm mờ thẻ quest khi chưa đủ điều kiện.
       + Cột Phải: Hiển thị Banner cảnh báo nổi bật `🔒 Hồi Này Chưa Thể Tiến Hành: [Lý do khóa]`, làm mờ thẻ lựa chọn, thay thế nút "Đạo Tâm Quyết Định" bằng nút vô hiệu hóa có icon khóa, và ẩn nút "Lĩnh Thưởng Cốt Truyện".
  2. **Khắc Phục Dứt Điểm Lỗi Tích Cốc Đan Reset Về 10 (`lib/save-migration.ts`):**
     - Xóa bỏ triệt để đoạn mã tự ý kiểm tra `!invPills.some(p => p.id === 'pill_tich_coc')` và push 10 viên Tích Cốc Đan vào túi trong hàm `normalizePlayerData()`.
     - Tích Cốc Đan tân thủ chỉ được cấp duy nhất một lần lúc tạo mới nhân vật tại `createNewPlayer()` (`lib/game-logic/character.ts`).
     - Khi người chơi bán hoặc tiêu hao hết về 0, số lượng giữ nguyên là 0 (hoặc bị loại bỏ khỏi túi), không còn hiện tượng tự động sinh lại.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/storyline-data.ts`: Bổ sung `getChapterByQuestId`.
  - `lib/storyline-logic.ts`: Thêm hàm `isQuestAvailable`, cập nhật `getQuestStatus`, thêm availability guard cho `applyChoiceOutcomes` và `claimQuestRewardLogic`.
  - `hooks/useStorylineActions.ts`: Kiểm tra `isQuestAvailable` trong `selectChoice` và `claimQuestReward`.
  - `components/modals/StorylineModal.tsx`: Render trạng thái khóa tuần tự ở Cột Trái, Banner cảnh báo khóa ở Cột Phải, vô hiệu hóa nút quyết định và lĩnh thưởng khi hồi chưa mở khóa.
  - `lib/save-migration.ts`: Xóa bỏ đoạn mã tự động bù 10 viên Tích Cốc Đan khi túi đồ không có.
  - `CHANGELOG.md`: Ghi nhận nhật ký cập nhật 5 phần.
- **Kết Quả Kiểm Thử (Verification):**
  - `npx tsc --noEmit`: Exit code 0, chính xác 0 errors.
  - `npm run build`: Compile thành công 100% qua Turbopack.

### [2026-10-02 13:55] - Phân Cấp Mở Khóa Mệnh Cách Luân Hồi Theo Cảnh Giới & Tùy Chọn Tạo Nhân Vật Mới (Realm-Gated Destinies & Fresh Reset Run)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  1. *Lỗ hổng Cân Bằng Mệnh Cách Luân Hồi:* Tu sĩ ở cảnh giới rất thấp (như Luyện Khí Tầng 1) khi Tọa Hóa hoặc Binh Giải trước đây vẫn có thể tự do khảm các Mệnh Cách Thần Giai tối thượng (*Trọng Sinh Tiên Tôn*, *Túc Mệnh Thông Thiên*, *Cửu Chuyển Hỗn Độn Thai*) vào ô Mệnh Cách thứ 6, phá vỡ logic tiến trình roguelite của game.
  2. *Thiếu Tùy Chọn Tạo Nhân Vật Mới (Fresh Slate / New Game):* Khi nhân vật Tọa Hóa hoặc người chơi muốn bắt đầu lại một hành trình hoàn toàn mới từ con số 0 (không mang theo Karma, không mang theo Pháp bảo phong ấn), game chỉ cho phép một lựa chọn duy nhất là "Bước Vào Luân Hồi", không có lối thoát để reset game trực tiếp từ UI.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Mở Rộng Schema & Dữ Liệu Mệnh Cách Luân Hồi Phân Cấp 5 Tầng (`lib/types/character.ts`, `lib/destiny-data.ts`):**
     - Mở rộng bảng `REINCARNATION_DESTINY_DEFINITIONS` với 11 Mệnh Cách chia đều theo 5 bậc cảnh giới tối thiểu:
       + *Hoàng Giai (Realm 0 - Phàm Nhân / Luyện Khí):* `destiny_reborn_hoang_1` [Phàm Thai Bất Khuất] (+10% Thủ, +10 năm Thọ nguyên khởi đầu, +500 Linh thạch khởi nghiệp); `destiny_reborn_hoang_2` [Cần Năng Bổ Chuyết] (+10% Tốc độ tu vi, +5 Căn cốt).
       + *Địa Giai (Realm 11 - Trúc Cơ Kỳ):* `destiny_reborn_dia_1` [Thông Tuệ Đạo Tâm] (+15 Ngộ tính, giảm 15% tiêu hao đột phá); `destiny_reborn_dia_2` [Khí Vận Tiểu Hưng] (+15 Khí vận, +10% Bạo kích).
       + *Thiên Giai (Realm 21 - Nguyên Anh Kỳ):* `destiny_reborn_thien_1` [Đại Năng Chuyển Thế] (+20% Tu vi, +15% Công kích); `destiny_reborn_thien_2` [Kim Cang Pháp Thân] (+20% Khí Huyết, +12% Miễn thương).
       + *Tuyệt Giai (Realm 31 - Luyện Hư Kỳ):* `destiny_reborn_tuyet_1` [Tinh Không Vấn Đạo] (+25% Công kích, +15% Hút máu, +25 Tốc độ thân pháp); `destiny_reborn_tuyet_2` [Thấu Triệt Thần Thức] (+30 Thần thức, +25% Sát thương bạo kích, +15% Xuyên giáp).
       + *Thần Giai Tối Thượng (Realm 41+ - Độ Kiếp / Đại Thừa / Tiên Nhân):* `trong_sinh_tien_ton` [Trọng Sinh Tiên Tôn] (+25% Tu vi, +15% Bạo kích, miễn tử 1 lần, +20% Công kích); `tuc_menh_thong_thien` [Túc Mệnh Thông Thiên] (+35 Khí vận, giảm 25% giá Thương Hội, +30% Rơi đồ); `cuu_chuyen_hon_don_thai` [Cửu Chuyển Hỗn Độn Thai] (+20% Thủ, +20% Miễn thương, +30% Khí Huyết tối đa).
     - Đưa toàn bộ 11 mệnh cách và các alias tương thích ngược vào `DESTINY_FATES`.
     - Cập nhật `calculateCombatStats` hỗ trợ tính toán chỉ số `armorPenetrationPercent` từ mệnh cách.
  2. **Bộ Xử Lý Pure Business Logic (`lib/reincarnation-logic.ts`):**
     - Xây dựng hàm pure `isReincarnationDestinyUnlocked(destiny, player)` so sánh ngưỡng `destiny.requiredRealmIndex` với cảnh giới cao nhất đạt được `Math.max(currentRealm, highestRealmIndexAchieved)`.
     - Trong `executeReincarnation`: Áp dụng lập tức các chỉ số cộng thêm khởi đầu từ Mệnh Cách Luân Hồi đã chọn (`initialLifespan`, `initialSpiritStones`, `initialCanCot`, `initialNgoTinh`, `initialKhiVan`).
  3. **Bổ Sung Hook Handler Khởi Tạo Lại Từ Đầu (`hooks/useReincarnationActions.ts`):**
     - Xây dựng `handleStartFreshNewGame()`: Khởi tạo lại đối tượng từ `createNewPlayer()`, xóa sạch cache `localStorage`, ghi đè save chính và Slot 1, đồng bộ state `setPlayer` và thông báo log hệ thống.
  4. **Nâng Cấp Giao Diện Luân Hồi (`components/modals/RebornModal.tsx`):**
     - Hiển thị đầy đủ Badge Phẩm Cấp (`Hoàng Giai`, `Địa Giai`, `Thiên Giai`, `Tuyệt Giai`, `Thần Giai`) với màu sắc nhận diện cổ phong.
     - Thẻ chưa đủ điều kiện cảnh giới bị làm mờ (`opacity-50 grayscale select-none`), icon `🔒`, banner cảnh báo màu đỏ: `🔒 Chưa thể kế thừa: Cần kiếp trước đạt [Tên Cảnh Giới] (Cảnh giới X+)`, đồng thời vô hiệu hóa thao tác click.
     - Footer CTA phân cấp 2 lựa chọn: Hero button `🌀 BƯỚC VÀO LỤC ĐẠO LUÂN HỒI` và nút phụ `🌱 TẠO NHÂN VẬT MỚI (Làm Lại Từ Đầu)` (viền đỏ thẫm/xám tro, text-rose-300).
     - Hộp thoại an toàn 2 bước `ConfirmNewGameDialog` cảnh báo xóa toàn bộ điểm Karma và pháp bảo phong ấn trước khi thực thi.
  5. **Nâng Cấp Modal Quản Lý Lưu Trữ (`components/modals/SaveManagementModal.tsx`):**
     - Bổ sung khu vực `KHỞI TẠO LẠI TỪ ĐẦU (FRESH NEW GAME)` với nút `⚠️ Khởi Tạo Lại Nhân Vật Mới (New Game)` kèm dialog xác nhận 2 bước an toàn.
  6. **Kết Nối Props & Tương Thích Ngược (`components/GameDashboard.tsx`, `lib/save-migration.ts`):**
     - Kết nối `handleStartFreshNewGame` sang `RebornModal` và `SaveManagementModal`.
     - Trong `lib/save-migration.ts`: Đảm bảo `inheritedDestinyId` từ file save cũ được giữ nguyên, không làm mất buff của người chơi cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/character.ts`: Khai báo `ReincarnationDestinyDefinition`.
  - `lib/destiny-data.ts`: Mở rộng 11 Mệnh Cách Luân Hồi phân cấp 5 bậc, cập nhật `DESTINY_FATES`, `REINCARNATION_DESTINY_DEFINITIONS`, `REINCARNATION_DESTINY_FATES`, `getReincarnationDestinyById`, và bổ sung `armorPenetrationPercent` trong `calculateCombatStats`.
  - `lib/reincarnation-logic.ts`: Thêm `isReincarnationDestinyUnlocked`, áp dụng chỉ số khởi đầu từ Mệnh Cách Luân Hồi trong `executeReincarnation`.
  - `hooks/useReincarnationActions.ts`: Bổ sung `handleStartFreshNewGame` và xuất ra ngoài hook.
  - `components/modals/RebornModal.tsx`: Render 11 mệnh cách phân cấp, hiển thị icon và banner khóa cảnh giới, vô hiệu hóa click khi bị khóa, thêm nút Tạo Nhân Vật Mới và Dialog xác nhận 2 bước.
  - `components/modals/SaveManagementModal.tsx`: Thêm nút và Dialog xác nhận Khởi Tạo Lại Nhân Vật Mới (New Game).
  - `components/GameDashboard.tsx`: Kết nối prop `onStartFreshNewGame` cho RebornModal và SaveManagementModal.
  - `CHANGELOG.md`: Ghi nhận nhật ký nâng cấp toàn diện.
- **Kết Quả Kiểm Thử (Verification):**
  - `npx tsc --noEmit`: Exit code 0, 0 type errors.
  - `npm run build`: Turbopack production build thành công 100% trong 3.9s.

### [2026-10-02 13:25] - Tái Cấu Trúc Toàn Diện Hệ Thống Sức Chứa Túi Trữ Vật (Storage Bag Capacity & Single Source of Truth)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Người chơi sau khi tầm bảo đánh bại ma tu nhận được Túi Hắc Ma Tu (80 ô) hoặc mua Túi Trữ Vật cấp cao / Túi Vô Hạn Ô trong Thương Hội, khi nhặt đồ, tầm bảo hoặc mua sắm vẫn liên tục bị chặn với thông báo "Túi đã đầy" khi số lượng đồ chạm mốc 20 món.
  - **Phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA):**
    1. *Lỗi vứt bỏ tham số trong `canAddItemToInventory` (`lib/inventory-data.ts:268`):* Khi caller gọi `canAddItemToInventory(inventoryOrPlayer, maxSlots, itemType, itemId)`, hàm kiểm tra `if (typeof arg2 === 'number')` nhưng lại gọi `canReceiveItem(inventoryOrPlayer, arg3, arg4)` mà **vứt bỏ hoàn toàn `arg2` (chính là `maxSlots`)**!
    2. *Hàm `canReceiveItem` fallback cứng về 20:* Khi caller truyền `player.inventory` làm tham số đầu tiên, hàm kiểm tra `inventoryOrPlayer.storageBag` (trên `inventory` là `undefined`) nên nhảy vào nhánh fallback gán cứng `maxSlots = 20`. Do đó bất kể người chơi có túi 80, 150 hay 9999 ô, mọi kiểm tra nhận đồ đều bị chặn ở mốc 20!
    3. *Nghịch lý "Gà & Quả Trứng" khi mua Túi Trữ Vật:* Khi túi đạt 20 món và báo đầy, người chơi vào Thương Hội mua Túi Trữ Vật lớn hơn để mở rộng thì chính hành động mua Túi Trữ Vật lại bị `canAddItemToInventory` chặn lại vì túi đang đầy!
    4. *Thiếu Single Source of Truth:* Các file logic rải rác (`rewards.ts`, `storyline-logic.ts`, `forbidden-zone-logic.ts`, `useCraftingActions.ts`, `useMerchantInventoryActions.ts`, `useGameActions.ts`, `useOfflineProgress.ts`, `useCompanionActions.ts`, `BattleTab.tsx`, `GameDashboard.tsx`, API routes) tự truy cập `player.storageBag?.maxSlots || 20` mà không tính đến perk luân hồi hay cờ vô hạn ô.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Xây Dựng Bộ Hàm Pure Logic Chuẩn Hóa (`lib/inventory-data.ts`, `lib/game-logic.ts`):**
     - `getMaxInventoryCapacity(player?: any): number`: Single Source of Truth tính toán sức chứa tối đa. Hỗ trợ cờ vô hạn ô (`isInfiniteCapacity`, `isInfinite`, `maxSlots >= 9999`), kiểm tra `storageBag.maxSlots`, `equippedBag`, perk Luân Hồi `perk_expand_inventory` (+10 ô mỗi cấp), và fallback 20. Trả về `999999` cho túi vô hạn.
     - `getCurrentInventoryOccupiedSlots(playerOrInventory?: any): number`: Đếm chính xác số slot bị chiếm dụng (tổng số loại đan dược, dược liệu, khoáng thạch, công pháp, trang bị, bí tịch, túi trữ vật).
     - `isInventoryFull(player: any, additionalItems?: number): boolean`: Kiểm tra an toàn xem túi có bị tràn nếu thêm số lượng vật phẩm mới.
  2. **Sửa Lỗi Cốt Lõi `canReceiveItem` & `canAddItemToInventory` (`lib/inventory-data.ts`):**
     - Nhận thêm tham số thứ 4 `explicitMaxSlots?: number`.
     - Nếu `maxSlots >= 9999`: Lập tức trả về `true` (không bao giờ chặn túi vô hạn).
     - Tự động nhận diện nếu truyền vào là `player` hoặc `inventory` và tự gọi `getMaxInventoryCapacity(player)` khi không có `explicitMaxSlots`.
     - Sửa `canAddItemToInventory` chuyển tiếp đúng `arg2` sang `explicitMaxSlots` của `canReceiveItem`.
  3. **Giải Phóng Nghẽn Mua Sắm & Tự Động Trang Bị (`hooks/useMerchantInventoryActions.ts`):**
     - Loại trừ kiểm tra túi đầy khi mua vật phẩm mở rộng túi (`itype === 'storage_bag'`).
     - Khi mua Túi Trữ Vật có sức chứa lớn hơn túi hiện tại, hệ thống lập tức tự động trang bị vào `storageBag`, hiển thị thông báo chúc mừng và cập nhật ngay lập tức dung tích túi.
     - Sửa `handleEquipBagFromInventory` sử dụng `getMaxInventoryCapacity(player)` và hiển thị đúng ký hiệu vô hạn (`VÔ HẠN` / `∞`).
  4. **Bảo Vệ Chiến Lợi Phẩm Tầm Bảo & Bí Cảnh (`lib/game-logic/rewards.ts`):**
     - Trong `applySecretRealmRewardToPlayer`: Sử dụng `getMaxInventoryCapacity(player)`. Nếu túi hiện tại bị đầy nhưng vật phẩm rớt là Túi Trữ Vật mới (`resolved.type === 'bag'`) có dung tích lớn hơn túi cũ, hệ thống đặc cách thu nạp vào túi để người chơi không bị mất kỳ duyên.
  5. **Đồng Bộ Hóa Toàn Diện Các Phân Hệ Gọi Túi:**
     - `hooks/useCraftingActions.ts`: Dùng `getMaxInventoryCapacity(player)` và `getCurrentInventoryOccupiedSlots(player)`. Luyện đan/rèn đúc tôn trọng đúng dung tích thực tế.
     - `hooks/useGameActions.ts`: Thay thế toàn bộ `storageBag?.maxSlots || 20` bằng `getMaxInventoryCapacity`.
     - `hooks/useOfflineProgress.ts` & `hooks/useCompanionActions.ts`: Đồng bộ tính toán sức chứa khi nhận quà Đạo Lữ và đồ AFK ngoại tuyến.
     - `lib/storyline-logic.ts` & `lib/forbidden-zone-logic.ts`: Đồng bộ tính toán sức chứa khi nhận thưởng cốt truyện và thám hiểm cấm địa.
     - `components/tabs/BattleTab.tsx`: Sử dụng `getMaxInventoryCapacity` khi nạp chiến lợi phẩm rơi sau trận đánh.
     - `app/api/battle/route.ts` & `app/api/cultivate/route.ts`: Đồng bộ `maxCap` trên server API routes.
  6. **Cập Nhật Giao Diện Trực Quan (UI HUD):**
     - `HeaderNav.tsx`: Hiển thị `[X/∞]` nếu `maxSlots >= 9999` hoặc `[X/maxSlots]`.
     - `InventoryTab.tsx`: Hiển thị thanh dung lượng, thông báo phần trăm và nút "Trang Bị" vô hiệu hóa đúng chuẩn khi túi hiện tại đã bằng hoặc tốt hơn.
     - `MerchantTab.tsx`: Hiển thị so sánh túi đồ với `getMaxInventoryCapacity(player)`.
  7. **Di Trú & Bảo Toàn Dữ Liệu Cũ (`lib/save-migration.ts`):**
     - Trong `normalizePlayerData()`: Tự động đối chiếu `storageBag` với template `DEFAULT_STORAGE_BAGS`, bảo đảm `maxSlots` tối thiểu theo template, đồng bộ từ `equippedBag` và `equipped.bag`, tự động kích hoạt mốc 9999 nếu có cờ `isInfiniteCapacity`.
     - Gán `player.inventory.maxSlots = storageBag.maxSlots` bảo đảm tính nhất quán 2 chiều.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/inventory-data.ts`: Thêm `getMaxInventoryCapacity`, `getCurrentInventoryOccupiedSlots`, `isInventoryFull`; sửa `canReceiveItem` và `canAddItemToInventory`.
  - `lib/game-logic.ts`: Re-export các hàm sức chứa.
  - `lib/game-logic/rewards.ts`: Sử dụng `getMaxInventoryCapacity`, bảo vệ túi rơi khi đầy ô.
  - `lib/storyline-logic.ts`: Sử dụng `getMaxInventoryCapacity`.
  - `lib/forbidden-zone-logic.ts`: Sử dụng `getMaxInventoryCapacity`.
  - `hooks/useMerchantInventoryActions.ts`: Miễn trừ chặn khi mua túi, auto-equip túi tốt hơn, cập nhật `handleEquipBagFromInventory`.
  - `hooks/useCraftingActions.ts`: Sử dụng `getMaxInventoryCapacity`, cập nhật toast thông báo.
  - `hooks/useGameActions.ts`: Sử dụng `getMaxInventoryCapacity` tại 3 điểm nhặt đồ.
  - `hooks/useOfflineProgress.ts`: Sử dụng `getMaxInventoryCapacity`.
  - `hooks/useCompanionActions.ts`: Sử dụng `getMaxInventoryCapacity`.
  - `components/tabs/BattleTab.tsx`: Sử dụng `getMaxInventoryCapacity`.
  - `components/GameDashboard.tsx`: Sử dụng `getCurrentInventoryOccupiedSlots` và `getMaxInventoryCapacity`.
  - `components/dashboard/HeaderNav.tsx`: Hiển thị `∞` khi `maxSlots >= 9999`.
  - `components/tabs/InventoryTab.tsx`: Cập nhật hiển thị dung tích và nút trang bị.
  - `components/tabs/MerchantTab.tsx`: Cập nhật so sánh túi đồ.
  - `app/api/battle/route.ts`: Đồng bộ `getMaxInventoryCapacity`.
  - `app/api/cultivate/route.ts`: Đồng bộ `getMaxInventoryCapacity`.
  - `lib/save-migration.ts`: Đồng bộ và chuẩn hóa `storageBag` và `inventory.maxSlots`.
  - `CHANGELOG.md`: Ghi nhận nhật ký nâng cấp.
- **Kết quả kiểm thử (Verification):**
  - `npx tsc --noEmit`: 0 errors (Exit code 0).
  - `npm run build`: Turbopack build thành công 100% (Exit code 0).

### [2026-10-02 12:55] - Khắc Phục Lỗi Runtime Crash (TypeError: reading 'badgeClass') Khi Mở Phân Khu "Ấp Linh Noãn" (`BeastTab.tsx`)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Người chơi khi mở tab Linh Thú -> phân khu "Ấp Linh Noãn" (`BeastTab.tsx`) gặp lỗi trắng màn hình: `TypeError: Cannot read properties of undefined (reading 'badgeClass')` tại dòng ~655.
  - **Phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA):**
    - `BEAST_QUALITY_CONFIG` trước đây chỉ chứa 4 key cơ bản: `trung_pham`, `thuong_pham`, `cuc_pham`, `than_pham`.
    - Khi nhận trứng từ Đấu Giá Hội (`auction-logic.ts:505`), `quality` bị gán chuỗi rút gọn `'than'` thay vì `'than_pham'`.
    - Khi mua trứng Thần Thú Hóa Long Noãn từ Thương Hội (`useMerchantInventoryActions.ts:187`), `quality` mang giá trị `'tuyet_pham'` (chưa từng được định nghĩa trong map).
    - Khi render `eggs.map(...)`, `BEAST_QUALITY_CONFIG[egg.quality]` trả về `undefined`, truy xuất trực tiếp `qCfg.badgeClass` gây sập ứng dụng.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Chuẩn Hóa & Mở Rộng Config Phẩm Cấp (`lib/beast-data.ts`, `lib/types/beasts.ts`):**
     - Mở rộng `BeastQuality` type hỗ trợ `tuyet_pham`, `tien_pham`, `ha_pham`, `thien_pham`.
     - Bổ sung đầy đủ cấu hình trong `BEAST_QUALITY_CONFIG` cho tất cả các phẩm cấp và aliases thông dụng (`than`, `tien`, `common`, `rare`, `epic`, `legendary`, `mythic`).
     - Cung cấp `DEFAULT_BEAST_QUALITY_CONFIG` và hàm tra cứu an toàn `getBeastQualityConfig(quality?: string | null)` tự động fallback về cấu hình mặc định nếu dữ liệu rỗng hoặc sai lệch key.
  2. **Bảo Vệ Đa Tầng Tại Giao Diện (`components/tabs/BeastTab.tsx`):**
     - Sử dụng `getBeastQualityConfig(egg.quality || egg.rarity)` thay vì truy cập mảng trực tiếp.
     - Áp dụng Optional Chaining an toàn: `qCfg?.badgeClass || 'bg-zinc-800/60 text-zinc-300 border-zinc-700/60'`, `qCfg?.name || 'Phổ Thông'`.
     - Đồng thời bọc an toàn tương tự cho danh sách thẻ Linh Thú và Header chi tiết Linh Thú được chọn.
  3. **Chuẩn Hóa Nguồn Dữ Liệu (`lib/auction-logic.ts`):**
     - Áp dụng chuẩn hóa phẩm cấp linh noãn thưởng đấu giá về enum hợp lệ (`than_pham`, `tien_pham`, `cuc_pham`).
  4. **Sanity Check Dữ Liệu Khi Di Trú Save (`lib/save-migration.ts`):**
     - Trong `normalizePlayerData`, tự động duyệt và chuẩn hóa toàn bộ `beasts` và `beastEggs`, gán `quality: b.quality || b.rarity || 'trung_pham'` và các trường mặc định nếu thiếu, đảm bảo file save cũ nạp vào không bao giờ thiếu thuộc tính.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/beasts.ts`: Mở rộng `BeastQuality` union type.
  - `lib/beast-data.ts`: Mở rộng `BEAST_QUALITY_CONFIG`, thêm `DEFAULT_BEAST_QUALITY_CONFIG` và `getBeastQualityConfig()`.
  - `components/tabs/BeastTab.tsx`: Sử dụng `getBeastQualityConfig` và fallbacks an toàn cho cả thẻ Linh Thú, chi tiết và Linh Noãn.
  - `lib/auction-logic.ts`: Chuẩn hóa quality khi trao thưởng trứng đấu giá.
  - `lib/save-migration.ts`: Sanitize `beasts` và `beastEggs` trong `normalizePlayerData()`.
  - `CHANGELOG.md`: Ghi nhận bản sửa lỗi chi tiết.
- **Kết quả kiểm thử (Verification):**
  - `npx tsc --noEmit`: 0 errors (Exit code 0).
  - `npm run build`: Turbopack build thành công 100% (Exit code 0).

### [2026-10-02 12:45] - Hiện Thực Hóa Chuỗi Mã Hóa "Tiên Thư Bản Thể" (Adler-32 Checksum), Đa Bản Lưu Snapshot 3 Slot & Kho Tàng 65 Thành Tựu Tiên Giới
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Dự án vận hành theo kiến trúc **Single-Player Client-First 100%**, hoàn toàn không phụ thuộc server mạng hay cơ sở dữ liệu cloud. Trước đây, game chỉ cung cấp xuất/nhập file `.json` thô sơ và 1 key lưu trữ duy nhất trong `localStorage`, dễ gặp rủi ro mất mát dữ liệu do trình duyệt dọn cache hoặc file JSON bị người dùng chỉnh sửa gây crash ứng dụng.
  - Đồng thời, kho tàng thành tựu mới chỉ dừng lại ở 21 thành tựu thuở sơ khai, chưa bao phủ toàn diện hàng loạt các phân hệ gameplay vừa phát triển (Thái Cổ Cấm Địa, Tứ Đại Bách Nghệ, Vạn Bảo Đấu Giá, 20 Tông Môn, Lục Đạo Luân Hồi, Hợp Kích Tam Vị, Thiên Kiêu Bảng, Chư Thiên Tinh Đồ...).
  - Triển khai trọn vẹn giải pháp bảo vệ dữ liệu kép: Chuỗi mã hóa "Tiên Thư Bản Thể" kèm Checksum chống can thiệp, cơ chế 3 Bản Lưu Snapshot luân phiên; đồng thời bùng nổ kho tàng 65 Thành Tựu và 28 Danh Hiệu Tiên Giới với UI/UX cổ phong hiện đại.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Engine Mã Hóa & Checksum Adler-32 (`lib/save-encryption.ts`):**
     - Thuật toán băm Checksum Adler-32 thuần JavaScript: Tính toán 32-bit checksum nhanh và ổn định, mã hóa dạng Hex 8 ký tự.
     - Hàm xuất chuỗi `exportSaveToEncryptedString(player)`: Định dạng chuẩn `GTT_SAVE_V1$[CHECKSUM]$[BASE64_PAYLOAD]`.
     - Hàm giải mã và kiểm tra toàn vẹn `importSaveFromEncryptedString(encryptedStr)`: Kiểm tra tiền tố phiên bản, đối chiếu Checksum 100% khớp, chuẩn hóa qua `normalizePlayerData()` từ `save-migration.ts`. Nếu phát hiện sai lệch hoặc chuỗi bị cắt xén dù chỉ 1 ký tự, hệ thống từ chối nạp và hiển thị lỗi thân thiện thay vì gây crash.
     - Hàm tiện ích quản lý Snapshot: `saveToSlot`, `loadFromSlot`, `extractPlayerMetadata`, `getAllSlotsMetadata`.
  2. **Quản Lý Đa Bản Lưu Snapshot Luân Phiên 3 Slot (`hooks/useGameSave.ts`):**
     - Cấu hình 3 khe lưu trữ độc lập tại `localStorage`:
       - `gametutien_save_slot_1`: Bản lưu tự động chính (Debounce 1.0s).
       - `gametutien_save_slot_2`: Bản lưu định kỳ tự động mỗi 30 phút (Auto Snapshot Timer) với `setInterval` chạy ngầm.
       - `gametutien_save_slot_3`: Bản lưu mốc trọng đại (Milestone Snapshot) gọi chủ động trước khi đột phá cảnh giới hoặc luân hồi.
     - Tích hợp các handlers: `handleExportString` (sao chép Tiên Thư vào Clipboard), `handleImportString` (giải mã và nạp vào slot chính), `handleRestoreSnapshot` (khôi phục từ khe chỉ định), `handleSaveSnapshot` (lưu đè chủ động).
  3. **Mở Rộng 65 Thành Tựu & 28 Danh Hiệu Đa Phân Hệ (`lib/achievements-data.ts`, `lib/types/character.ts`):**
     - Mở rộng `AchievementCategory` hỗ trợ 12 danh mục: Cảnh Giới, Chiến Đấu, Gia Viên, Bách Nghệ, Đạo Lữ, Tông Môn, Luân Hồi, Thiên Kiếp & Cấm Địa, Đấu Giá, Tinh Đồ, Hợp Kích & Thiên Kiêu, Thể Tu & Hồn Tu.
     - Bổ sung 35 thành tựu mới, nâng tổng số từ 21 lên 65 thành tựu bao phủ trọn vẹn:
       - *Thái Cổ Cấm Địa:* Sống sót 5 bước khi Hộ Thân Linh Quang = 0 (`ach_fz_survive_zero`), Mở 100% sương mù 7x7 (`ach_fz_clear_fog`), Trảm Boss Cấm Khu (`ach_fz_kill_beast`).
       - *Bách Nghệ:* Luyện 10 đan Cực Phẩm (`ach_craft_cuc_pham`), Trang bị 4 lỗ khảm (`ach_forge_4_sockets`), Cửu Giai Bách Nghệ (`ach_artisan_tier9`), Phân giải 50 trang bị (`ach_dismantle_master`).
       - *Đấu Giá:* Dằn mặt Thần Thức 10 lần (`ach_auction_intimidate_10`), Đấu giá thắng dị bảo > 200k LT (`ach_auction_win_tier5`).
       - *Tông Môn:* Bái nhập Thánh Địa Tier 5 (`ach_sect_tier5_join`), Chiếm trọn 3/3 Linh Mạch (`ach_sect_hold_all_veins`), Hộ Sơn Trận cấp 10 (`ach_sect_array_max`).
       - *Luân Hồi:* 3 kiếp chuyển sinh (`ach_reborn_3`), Giải phong Bản Mệnh ở Trúc Cơ (`ach_reborn_unseal`), Mở ô Mệnh Cách thứ 6 (`ach_reborn_slot6`).
       - *Hợp Kích & Thiên Kiêu:* 20 lần Hợp Kích (`ach_synergy_20`), Hợp Kích sát thương > 500k (`ach_synergy_mega_dmg`), Hạng 1 PvP (`ach_pvp_top1`), Chuỗi 10 trận thắng liên tiếp (`ach_pvp_win_streak_10`).
       - *Chư Thiên Tinh Đồ:* Chiếm đóng 5 Tinh Cầu (`ach_cosmic_occupy_5`), Đúc Thần Binh Tier 9 (`ach_cosmic_craft_tier9`).
     - Bổ sung 5 Danh Hiệu mới vào `TITLES_CONFIG`: *Tử Địa Chi Chủ*, *Vạn Vật Hóa Thần*, *Thần Thức Nhiếp Thế*, *Tam Kiếp Tiên Tôn*, *Tinh Không Lĩnh Chủ* (tổng 28 Danh Hiệu).
     - Cập nhật hàm `getAchievementCurrentProgress` hỗ trợ theo dõi tiến độ chi tiết cho toàn bộ 65 thành tựu.
  4. **Engine Theo Dõi & Kích Hoạt Thành Tựu Thời Gian Thực (`hooks/useAchievements.ts`):**
     - Bổ sung `useEffect` + `useRef` lưu vết các thành tựu đã mở khóa.
     - Tự động quét và phát hiện thời gian thực khi người chơi hoàn thành cột mốc mới, bắn thông báo Toast chúc mừng và ghi nhận vào Thiên Đạo Ký Sự (Game Logs).
  5. **Giao Diện Modal Quản Lý Lưu Trữ Đa Tầng (`components/modals/SaveManagementModal.tsx`):**
     - Tab 1: **"Tiên Thư Bản Thể"** - Hiển thị chuỗi mã hóa với nút sao chép 1-chạm vào Clipboard, ô dán chuỗi khôi phục kèm nút kiểm tra tính toàn vẹn (Integrity Check) trước khi nạp.
     - Tab 2: **"3 Bản Lưu Snapshot"** - Thẻ hiển thị 3 khe lưu trữ với metadata trực quan (Đạo hiệu, Cảnh giới, Thọ nguyên, Thời gian lưu), kèm hộp thoại xác nhận 2 bước chống thao tác nhầm.
     - Tab 3: **"Tệp Sao Lưu JSON"** - Hỗ trợ xuất/nhập file `.json` truyền thống.
     - Tích hợp vào `HeaderNav.tsx` thông qua nút "Lưu Game" và state `isSaveModalOpen` tại `GameDashboard.tsx`.
  6. **Giao Diện Modal Thành Tựu Cổ Phong (`components/modals/AchievementsModal.tsx`):**
     - Thanh Sub-tabs lọc 12 danh mục với badge số lượng thành tựu tương ứng.
     - Thanh tiến độ tổng quan Master Progress Bar phát quang hoàng kim hiển thị `% Đạo Quả Hoàn Thành` (X/65).
     - Từng thẻ thành tựu có thanh tiến độ con trực quan (`progress / maxProgress`), nhãn trạng thái và nút nhận thưởng linh hoạt.
  7. **Tương Thích Ngược & Di Trú Dữ Liệu (`lib/save-migration.ts`):**
     - Tự động chuẩn hóa mảng `claimedAchievementIds`.
     - Tự động mở khóa bù các danh hiệu tương ứng với cảnh giới hiện tại của người chơi khi nạp save game cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/character.ts`: Mở rộng `AchievementCategory` hỗ trợ 12 phân hệ.
  - `lib/save-encryption.ts` (Mới): Pure engine Adler-32 Checksum, mã hóa/giải mã Tiên Thư Bản Thể, quản lý 3 slot Snapshot.
  - `lib/achievements-data.ts`: Mở rộng kho tàng 65 thành tựu, 28 danh hiệu, cập nhật `getAchievementCurrentProgress`.
  - `hooks/useAchievements.ts`: Engine tự động quét và kích hoạt thành tựu thời gian thực kèm toast/log.
  - `hooks/useGameSave.ts`: Handlers xuất/nhập Tiên Thư mã hóa, quản lý 3 khe snapshot và auto snapshot timer 30 phút.
  - `components/modals/SaveManagementModal.tsx` (Mới): Modal sao lưu đa tầng (Tiên Thư mã hóa, 3 Khe Snapshot, Tệp JSON).
  - `components/modals/index.ts`: Barrel export `SaveManagementModal`.
  - `components/modals/AchievementsModal.tsx`: Sub-tabs 12 danh mục, Master Progress Bar `% Đạo Quả Hoàn Thành` và thanh tiến độ con.
  - `components/dashboard/HeaderNav.tsx`: Nâng cấp nút "Lưu Game" mở modal quản lý sao lưu đa tầng.
  - `components/GameDashboard.tsx`: Tích hợp state `isSaveModalOpen` và mount `SaveManagementModal`.
  - `lib/save-migration.ts`: Chuẩn hóa mảng thành tựu và tự động mở khóa bù danh hiệu cảnh giới cho save cũ.
  - `README.md`: Cập nhật Catalog Mục 3.2, bổ sung Mục 4.20 & Mục 4.21, cập nhật Mục 5.4.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết quả kiểm thử (Verification):**
  - Unit test kịch bản mã hóa/giải mã roundtrip, đối chiếu Adler-32 checksum, kiểm tra từ chối chuỗi bị giả mạo / cắt xén đạt 100% pass.
  - `npx tsc --noEmit`: 0 errors (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack (Exit code 0).

### [2026-10-02 10:40] - Hiện Thực Hóa Phân Hệ Vạn Tiên Đại Hội • Thiên Kiêu Bảng (Simulated Async PvP Ladder)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, phân hệ Thí Luyện Trảm Yêu (`BattleTab.tsx`) chỉ tập trung vào PVE (Boss Cảnh Giới, Trấn Ma Tháp, Ma Thú Thế Giới), thiếu một đấu trường đối kháng đỉnh cao mô phỏng thế giới tu chân đa môn phái nơi quy tụ các thiên tài đồng thế hệ.
  - Xây dựng hoàn chỉnh phân hệ **"Vạn Tiên Đại Hội • Thiên Kiêu Bảng" (Simulated Async PvP Ladder)**: Đấu trường leo rank 100 bậc danh môn đệ tử từ 20 Đại Tông Môn với cơ chế hoán đổi thứ hạng (Rank Swap), vòng lặp chiến đấu turn-based tích hợp toàn diện mọi cơ chế cốt lõi và hệ thống Danh Hiệu độc quyền phát sáng Hào Quang (Visual Aura).
  - **Quán triệt nguyên tắc kỹ thuật:** Trò chơi là trải nghiệm **Single-Player Client-First 100%**. Tuyệt đối KHÔNG sử dụng WebSocket, Realtime Server hay Database bên ngoài. Toàn bộ 100 NPC Thiên Kiêu, dữ liệu khiêu chiến và biến động thứ hạng được sinh theo thủ tục và lưu trữ an toàn trong `player.pvpLadderState` tại `localStorage`.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Schema & Domain Types (`lib/types/pvp-ladder.ts`, `lib/types/player.ts`):**
     - Định nghĩa kiểu dữ liệu `LadderOpponent`, `PvPLadderCombatLog`, `PvPLadderState`, `PvPTurnLog`, `PvPBattleResult`.
     - Mở rộng `PlayerStats` hỗ trợ trường tùy chọn `pvpLadderState?: PvPLadderState`.
  2. **Bộ Sinh Tự Động 100 NPC Thiên Kiêu (`lib/pvp-ladder-data.ts`):**
     - Thuật toán phân bổ lũy tiến từ Hạng 100 lên Hạng 1 qua 7 phân tầng thực lực:
       - *Hạng 81–100:* Luyện Khí 10 $\rightarrow$ Trúc Cơ Sơ Kỳ (Realm 10–12), Tông Môn Tier 1.
       - *Hạng 51–80:* Trúc Cơ Hậu Kỳ $\rightarrow$ Kim Đan Sơ Kỳ (Realm 13–17), Tông Môn Tier 2.
       - *Hạng 21–50:* Kim Đan Hậu Kỳ $\rightarrow$ Nguyên Anh (Realm 18–25), Tông Môn Tier 3.
       - *Hạng 11–20:* Hóa Thần Sơ Kỳ $\rightarrow$ Luyện Hư (Realm 26–35), Tông Môn Tier 4.
       - *Hạng 4–10 (Thập Đại Thiên Kiêu):* Hợp Thể $\rightarrow$ Đại Thừa (Realm 36–45), Tông Môn Tier 5 Thánh Địa.
       - *Hạng 2–3 (Á Quân & Quý Quân):* Độ Kiếp $\rightarrow$ Chân Tiên (Realm 48–56).
       - *Hạng 1 (Đương Thế Vô Địch - Quán Quân):* "Độc Cô Cầu Bại • Diệp Vô Nhai", Tiên Nhân Cực Cảnh (Realm 65), Tiên Thiên Linh Bảo và Khí Linh Sát Phạt Hóa Hình (Lực chiến ~9.88M).
     - Ghép ngẫu nhiên: Họ tên cổ phong, Đạo hiệu, Môn phái, Linh căn ngũ hành/biến dị, bộ 4 công pháp, Bản Mệnh Khí Linh và chỉ số chiến đấu cân bằng chặt chẽ.
  3. **Pure Logic Đấu Pháp & Xếp Hạng (`lib/pvp-ladder-logic.ts`):**
     - *Hồi phục Lệnh Bài:* 5 vé khiêu chiến tối đa, tự hồi phục 1 vé mỗi 2 giờ hoặc reset ngày mới.
     - *Matchmaking Targets (`getMatchmakingTargets`):* Đề xuất 3–4 đối thủ phù hợp (1 vượt cấp thăng hạng nhanh, 2 cận kề thứ hạng, 1 sát nút phía sau).
     - *Vòng Lặp Giao Tranh 20 Hiệp (`simulatePvPTurnCombat`):*
       - *Uy Áp Thần Thức Turn 1:* Bên có Thần Thức cao hơn $\ge 30\%$ làm đối phương giảm 15% tốc độ, có 20% tỷ lệ choáng Turn 1 và phóng xuất Thần Niệm Kiếm gây sát thương chuẩn.
       - *Thân Pháp & Đòn Kép:* Tốc độ $\ge 1.5\times$ kích hoạt 35% tỷ lệ Đòn Kép (Double Action); Né Tránh tự nhiên từ 25% đến 45%.
       - *Khí Linh Hộ Chủ:* Kích hoạt khi HP rơi xuống $<35\%$, Khí Linh Sát Phạt chém bồi 120% sát thương, Khí Linh Thủ Hộ ngưng tụ khiên chắn cương khí 30% HP.
       - *Tương Khắc Ngũ Hành & Trận Pháp:* Áp dụng đầy đủ ngũ hành tương sinh tương khắc và phản xạ trận bàn theo từng hiệp đấu.
     - *Hoán Đổi Thứ Hạng (`resolveLadderChallenge`):* Khi người chơi chiến thắng đối thủ có thứ hạng cao hơn, trực tiếp hoán đổi vị trí của người chơi lên vị trí của đối thủ (Rank Swap). Cập nhật `bestRank`, ghi nhật ký `combatLogs` và trao thưởng Linh Thạch, Danh Vọng, Tu Vi.
     - *Bổng Lộc Kết Toán Tuần (`claimWeeklySettlement`):* Kết toán chu kỳ 7 ngày trao thưởng dựa theo thứ hạng đạt được.
  4. **Hệ Thống Danh Hiệu Độc Quyền & Hào Quang (`lib/achievements-data.ts`, `CharacterIdentityCard.tsx`):**
     - Bổ sung 4 Danh Hiệu Thiên Kiêu độc quyền theo thứ hạng:
       - `title_van_gioi_de_nhat_kiem` (Hạng 1 - Thần Phẩm Tối Thượng): +30% Công Kích, +15% Bạo Kích, +20% Sát Thương Bạo. Kèm hiệu ứng hào quang: `aura: 'divine_gold'` (Viền phát quang vàng rực hoàng kim chói lọi).
       - `title_thien_kieu_van_dinh` (Top 2–3 - Thần Phẩm): +20% Toàn Thuộc Tính Chiến Đấu. Kèm hào quang: `aura: 'celestial_purple'` (Hào quang tím tử khí đông lai).
       - `title_thap_dai_thien_kieu` (Top 4–10 - Tuyệt Phẩm): +15% Công/Thủ, +10% Miễn Thương. Kèm hào quang: `aura: 'crimson_flame'` (Ngọn lửa đỏ xích hồng).
       - `title_bach_cuong_thien_kieu` (Top 11–100 - Thiên Phẩm): +8% Công/Thủ, +5% Tốc Độ.
     - Thêm 2 Thành Tựu đấu trường: `ach_pvp_top100` (Bách Cường Thiên Kiêu) và `ach_pvp_top1` (Vạn Giới Đệ Nhất Kiếm).
     - Tại `CharacterIdentityCard.tsx`: Tự động nhận diện trường `aura` của danh hiệu đang trang bị, hiển thị lớp CSS phát quang động xung quanh Avatar nhân vật (`animate-pulse shadow-[0_0_35px_rgba(...)]`).
  5. **Custom Domain Hook & Giao Diện Sàn Đấu (`hooks/usePvPLadderActions.ts`, `components/battle/PvPLadderView.tsx`, `components/tabs/BattleTab.tsx`):**
     - Custom hook `usePvPLadderActions` quản lý toàn bộ state sàn đấu, vé khiêu chiến, live combat animation và âm thanh Web Audio (`slash`, `thunder`, `breakthrough`, `click`).
     - Tích hợp sub-tab thứ 4 **"🏆 Thiên Kiêu Bảng"** trong `BattleTab.tsx`.
     - `PvPLadderView.tsx` thiết kế cổ phong với 3 phân khu:
       - *Header Đấu Trường:* Thứ hạng hiện tại, kỷ lục, vé khiêu chiến (5/5 🎫), đồng hồ kết toán tuần.
       - *Bảng Phong Thần:* 3 Bục vinh danh Quán Quân, Á Quân, Quý Quân với viền phát sáng kim sắc, tử khí và xích diễm.
       - *Sàn Đấu Gợi Ý:* Danh sách 3–4 đối thủ luận kiếm kèm thông số lực chiến, linh căn, tông môn và nút `⚔️ Luận Kiếm Đoạt Hạng`.
       - *Bảng Xếp Hạng Toàn Cảnh & Lịch Sử:* Duyệt đầy đủ 100 NPC, bộ lọc danh phận và nhật ký chiến báo chi tiết.
       - *Modal Sàn Đấu Trực Tiếp:* Thanh máu 2 lớp Ghost Bar, chữ sát thương bay (Floating Combat Text), kiếm khí chém chéo, tường thuật chiêu thức hiệp đấu và điều khiển tua nhanh/bỏ qua.
  6. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Tại `normalizePlayerData`: Tự động khởi tạo `player.pvpLadderState` với 100 NPC Thiên Kiêu sinh từ `generateDefaultLadderNpcs()` nếu save cũ chưa có.
     - Gán mặc định `currentRank: 101`, `challengeTickets: 5`, bảo lưu 100% dữ liệu cũ không gây đứt gãy tiến trình.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/pvp-ladder.ts` (Mới): Khai báo toàn bộ Domain Interfaces cho Thiên Kiêu Bảng.
  - `lib/types/index.ts`: Barrel export `pvp-ladder`.
  - `lib/types/player.ts`: Mở rộng `PlayerStats` hỗ trợ `pvpLadderState`.
  - `lib/pvp-ladder-data.ts` (Mới): Dữ liệu tĩnh, pool danh xưng, procedural NPC generator 100 đối thủ và bảng thưởng tuần.
  - `lib/pvp-ladder-logic.ts` (Mới): Pure logic hồi vé, matchmaking, mô phỏng đấu pháp 20 hiệp và rank swap.
  - `lib/achievements-data.ts`: Thêm 4 danh hiệu PvP có hào quang aura và 2 thành tựu đấu trường.
  - `hooks/usePvPLadderActions.ts` (Mới): Custom domain hook quản lý đấu trường.
  - `hooks/index.ts`: Barrel export `usePvPLadderActions`.
  - `components/battle/PvPLadderView.tsx` (Mới): Giao diện Bảng Phong Thần, sàn đấu pháp, live turn combat modal.
  - `components/battle/index.ts`: Barrel export `PvPLadderView`.
  - `components/tabs/BattleTab.tsx`: Bổ sung subtab thứ 4 `🏆 Thiên Kiêu Bảng` và render `PvPLadderView`.
  - `components/dashboard/left/CharacterIdentityCard.tsx`: Lớp phủ CSS hào quang động quanh Avatar cho danh hiệu Top Thiên Kiêu.
  - `lib/save-migration.ts`: Di trú và khởi tạo an toàn `player.pvpLadderState` cho save cũ.
  - `README.md`: Cập nhật file catalog và bổ sung Mục 4.19 chi tiết phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết quả kiểm thử (Verification):**
  - `npx tsc --noEmit`: 0 errors (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack (Exit code 0).

### [2026-10-02 10:20] - Mở Rộng Cốt Truyện Phân Nhánh: Chương VIII (Luyện Hư Kỳ) & Chương IX (Độ Kiếp / Phi Thăng)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mạch truyện chính tuyến trước đây chỉ dừng lại ở Chương VII (Hóa Thần Vấn Đạo, Realm 26–30), trong khi thế giới tu tiên đã mở rộng tới 104 cảnh giới.
  - Cần mở rộng tiếp 2 Đại Chương kinh điển đưa người chơi bước ra khỏi tiểu thế giới phàm trần để vấn đỉnh Vực Ngoại Tinh Không và đối mặt Cửu Cửu Thiên Kiếp phi thăng Tiên Giới.
  - **Quán triệt nguyên tắc kỹ thuật:** Game là trải nghiệm **Single-Player Client-First 100%**. Toàn bộ lựa chọn phân nhánh, biến chuyển nhân quả, danh hiệu và cổ bảo lưu trữ trực tiếp trong `player.storylineState` tại `localStorage`.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Khởi Tạo Kịch Bản & Dữ Liệu Chương Hồi (`lib/storyline-data.ts`):**
     - **Chương VIII: Tinh Không Vấn Đạo (`chap_8`, requiredRealm: 31):**
       - *Hồi 1 - Phá Toái Hư Không (`quest_8_1`):* Đàm đạo cùng Giới Linh Hộ Đạo; [A] Cực Kiếm Phá Giới (+45 ATK, +25 Soul, +10 Luck, -10 Mind) vs [B] Thận Trọng Vượt Ải (+40 DEF, +35 Mind, +25 Root).
       - *Hồi 2 - Tinh Hải Tranh Đoạt (`quest_8_2`):* Chạm trán Tinh Không Cổ Thú; [A] Trảm Thú Đoạt Tinh (+55 ATK, +15% Crit DMG, nhận Cổ Bảo *Tinh Hải Thần Trâm*) vs [B] Thuần Hóa Cổ Linh (+45 Int, +40 Soul, nhận Danh hiệu Thiên Phẩm *Tinh Không Du Giả*).
       - *Hồi 3 - Tiên Ma Trận Doanh (`quest_8_3`):* Lựa chọn trận doanh chư thiên; [A] Gia Nhập Tiên Minh (+40 DEF, +45 Mind, +100k LT, nhận Danh hiệu *Tiên Minh Chấp Pháp Sứ*) vs [B] Nhập Trận Ma Vực (+65 ATK, +20% Crit, +15% Ma Tính, nhận Danh hiệu *Tinh Vực Ma Quân*).
     - **Chương IX: Cửu Cửu Thiên Kiếp & Phi Thăng Tiên Giới (`chap_9`, requiredRealm: 46):**
       - *Hồi 1 - Cửu Cửu Đại Kiếp (`quest_9_1`):* Đối mặt 81 đạo Hỗn Độn Tử Lôi; [A] Dĩ Thân Hóa Lôi (+60 Root, +15% Miễn Thương vĩnh viễn, +150k Tu Vi, -40% HP tạm thời) vs [B] Vạn Bảo Trừ Kiếp (+60 Soul, +60 DEF, +150k LT).
       - *Hồi 2 - Vấn Đạo Thiên Tâm (`quest_9_2`):* Đối đáp huyền môn trước Thiên Đạo Chi Ý; [A] Nghịch Thiên Độc Tôn (+90 ATK, +35 Luck, nhận Danh hiệu Thần Phẩm *Nghịch Thiên Đạo Tôn*) vs [B] Hợp Đạo Tự Nhiên (+60 Int, +60 Mind, nhận Tiên Thiên Dị Bảo *Hỗn Độn Đạo Chủng*).
       - *Hồi 3 - Phi Thăng Tiếp Dẫn (`quest_9_3`):* Quyết định tối hậu trước Tiên Giới Chi Môn; [A] Hạo Nhiên Phi Thăng (+60 Toàn Chỉ Số, nhận Danh hiệu Thần Phẩm *Chân Tiên Hóa Thân*) vs [B] Trấn Áp Giới Môn (+120 DEF, +120 Root, +80 Mind, +10% Miễn Thương, nhận Danh hiệu Thần Phẩm *Nhân Gian Trấn Thủ Giả*).
  2. **Nâng Cấp Domain Logic (`lib/storyline-logic.ts`, `lib/types/storyline.ts`):**
     - Cập nhật `applyChoiceOutcomes`: Xử lý đầy đủ `permanentDmgReduction`, `dmgReduction`, `maTinh`, giảm HP an toàn khi chịu lôi kiếp, trao tặng Cổ Bảo và Danh Hiệu.
     - Nâng cấp `autoCatchUpStorylineForHighRealm`: Nâng ngưỡng kiểm tra cảnh giới lên 46+ (Độ Kiếp Kỳ trở lên) và 31+ (Luyện Hư Kỳ) để tự động mở khóa chương tương ứng mà không bị kẹt tiến trình.
  3. **Hệ Thống Danh Hiệu & Thành Tựu (`lib/achievements-data.ts`, `lib/destiny-data.ts`):**
     - Khai báo 6 Danh Hiệu mới vào `TITLES_CONFIG`: `title_tinh_khong_du_gia`, `title_tien_minh_chap_phap`, `title_tinh_vuc_ma_quan`, `title_nghich_thien_dao_ton`, `title_chan_tien_hoa_than`, `title_nhan_gian_tran_thu`.
     - Khai báo 2 Thành Tựu đại chương vào `ACHIEVEMENTS_CONFIG`: `ach_story_chap_8` (Tinh Không Vấn Đạo) và `ach_story_chap_9` (Vũ Hóa Phi Thăng) kèm hàm tính tiến độ `getAchievementCurrentProgress`.
     - Tích hợp hiệu ứng Danh Hiệu (Miễn thương, Hút máu, Hồi HP mỗi hiệp) và chỉ số `permanentDmgReduction` của người chơi vào hàm tính toán chiến đấu `calculateCombatStats`.
  4. **Giao Diện Cuộn Tranh Tiên Hiệp (`components/modals/StorylineModal.tsx`):**
     - Thêm Avatar và Badge nhận diện phát quang cho 8 nhân vật đối thoại mới: Tinh Không Cổ Thú, Sứ Giả Tiên Minh, Ma Tộc Tôn Giả, Thiên Lôi Chi Hồn, Thiên Đạo Chi Ý, Tiên Giới Tiếp Dẫn Sứ, Giới Linh Hộ Đạo, Khí Linh Hộ Chủ.
     - Hiển thị nhãn preview chi tiết thuộc tính, danh hiệu kèm tên thật từ `TITLES_CONFIG`, ma tính và biến chuyển khí huyết.
  5. **Đồng Bộ Lưu Trữ & Di Trú (`lib/save-migration.ts`):**
     - Bảo đảm toàn vẹn `completedQuestIds`, `choiceHistory` và danh hiệu đã mở khóa khi nạp save game cũ ở cảnh giới cao.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/storyline.ts`: Khai báo thêm trường `maTinhChange`.
  - `lib/storyline-data.ts`: Thêm `chap_8` và `chap_9` với 6 Hồi nhiệm vụ và 12 lựa chọn phân nhánh.
  - `lib/storyline-logic.ts`: Nâng cấp `applyChoiceOutcomes` và `autoCatchUpStorylineForHighRealm`.
  - `lib/achievements-data.ts`: Bổ sung 6 Danh Hiệu, 2 Thành Tựu và progress checking.
  - `lib/destiny-data.ts`: Tích hợp title buffs (dmgReduction, lifesteal, hpRegen) và permanentDmgReduction vào `calculateCombatStats`.
  - `components/modals/StorylineModal.tsx`: Avatar/Badge mới cho người thoại, preview Danh Hiệu, Ma Tính và HP.
  - `README.md`: Nâng cấp mục 4.13 và bảng tra cứu component từ 7 lên 9 chương kinh điển.
  - `CHANGELOG.md`: Thêm bản ghi chi tiết theo chuẩn 5 phần.
- **Kết quả kiểm thử (Verification):**
  - `npx tsc --noEmit`: 0 errors (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack (Exit code 0).

### [2026-10-02 10:00] - Phân Hệ Lục Đạo Luân Hồi • Đạo Vận Kế Thừa: Tái Cấu Trúc Toàn Diện Vòng Lặp Roguelite Meta-Progression Cho Tọa Hóa & Binh Giải
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Thọ Nguyên (`lifespan-logic.ts`) trước đây khi chạm trần thọ nguyên chỉ cảnh báo hoặc chặn đứng bế quan một cách bế tắc, chưa tạo thành một vòng lặp Roguelite Meta-Progression cuốn hút.
  - Xây dựng hoàn chỉnh phân hệ **"Lục Đạo Luân Hồi • Đạo Vận Kế Thừa"** chuyển hóa nguy cơ Tọa Hóa hoặc hành động Binh Giải xuất khiếu thành cơ chế tái sinh kiếp mới với kế thừa tài sản tinh anh.
  - **Quán triệt nguyên tắc kỹ thuật:** Trò chơi là trải nghiệm **Single-Player Client-First 100%**. Toàn bộ Điểm Luân Hồi (Karma), phôi phong ấn Bản Mệnh, Linh Căn thăng hoa, Mệnh Cách chuyển sinh và cây kỹ năng Thiên Đạo được lưu trữ và đồng bộ an toàn tại `localStorage` của trình duyệt.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Schema & Domain Types (`lib/types/character.ts`, `lib/types/player.ts`):**
     - Khai báo các interface domain: `SealedNatalArtifact`, `ReincarnationPerk`, `ReincarnationState`, `ReincarnationPerkEffectType`.
     - Mở rộng `PlayerStats` hỗ trợ `reincarnationState?: ReincarnationState`.
  2. **Xây Dựng Pure Logic Luân Hồi (`lib/reincarnation-logic.ts`):**
     - Công thức tính Điểm Luân Hồi (`calculateKarmaReward`): $\text{Karma} = (\text{RealmIndex} \times 150) + \lfloor\frac{\text{Age}}{10}\rfloor + (\text{AchievementsCount} \times 50) + \text{TribulationBonus}$.
     - Cơ chế Binh Giải chủ động (`canBinhGiai`): Yêu cầu từ Kim Đan Kỳ (Realm >= 16) trở lên mới đủ thần niệm xuất khiếu, thưởng thêm +20% Karma "Tự Tại Giải Thoát".
     - Danh mục 6 Perk Thiên Đạo vĩnh cửu (`REINCARNATION_PERKS_CATALOG`): Trường Sinh Tiên Cốt (+10 năm thọ nguyên/cấp), Tiên Thiên Ngộ Tính (+5 ngộ tính/cấp), Kim Cang Bất Hoại Thai (+5 căn cốt/cấp), Phú Quý Nhập Thế (+500 linh thạch/cấp), Thiên Địa Tùy Linh (+5% tốc độ tu vi/cấp), Tiên Duyên Định Mệnh (+15 hảo cảm đạo lữ/cấp).
     - Hệ thống phong ấn & phá phong Bản Mệnh (`sealNatalArtifact`, `checkAndUnsealNatalArtifact`): Phong ấn bảo vật thành Phôi Cổ mang sang kiếp sau, cung cấp 30% chỉ số nền; tự động phá phong thức tỉnh trọn vẹn Khí Linh khi đột phá Trúc Cơ Kỳ (Realm >= 11).
     - Thăng hoa Tiên Thiên Linh Căn (`upgradeSpiritualRoot`): Cho phép dùng Karma nâng cấp bậc Linh Căn lên Chân, Địa, Thiên, Biến Dị, Hỗn Độn.
     - Hàm thực thi chuyển sinh (`executeReincarnation`): Reset cảnh giới, tu vi, tuổi về 16, bảo lưu điểm Karma, Bản Mệnh phong ấn, Linh Căn thăng hoa, Mệnh Cách chuyển sinh và toàn bộ cấp độ Perk vĩnh viễn.
  3. **Tích Hợp Mệnh Bàn & Chỉ Số Chiến Đấu (`lib/destiny-data.ts`):**
     - Khởi tạo 3 Mệnh Cách độc quyền chuyển sinh: `[Trọng Sinh Tiên Tôn]` (Thần Giai: +20% tu vi, +10% bạo kích, miễn tử 1 lần), `[Túc Mệnh Thông Thiên]` (Thần Giai: +30 khí vận, giảm 25% giá thương hội, +30% rơi đồ), `[Cửu Chuyển Hỗn Độn Thai]` (Thần Giai: +15% thủ, +15% miễn thương, +25% HP).
     - Nâng cấp `getDestinySlotMaxCount(currentRealm, totalRebornTimes)`: Tự động mở khóa ô khảm thứ 6 `[Luân Hồi Đạo Nhãn]` khi nhân vật đã trải qua ít nhất 1 kiếp luân hồi (`totalRebornTimes >= 1`).
     - Tích hợp chỉ số phôi phong ấn Bản Mệnh vào `calculateCombatStats` (30% chỉ số công, thủ, miễn thương khi chưa Trúc Cơ).
  4. **Tích Hợp Tốc Độ Tu Luyện (`lib/game-logic/cultivation.ts`, `lib/offline-progress.ts`):**
     - Tích hợp buff từ perk `perk_thien_dia_tuy_linh` (+5% tốc độ tu vi mỗi cấp) vào hệ số tu luyện thời gian thực và bế quan ngoại tuyến.
  5. **Nâng Cấp Hook Điều Phối (`hooks/useReincarnationActions.ts`):**
     - Quản lý 2 màn hình modal (`summary` kết toán đạo quả & `inheritance` kế thừa đạo vận), tính toán Karma thời gian thực, điều phối mua Perk, thăng hoa Linh Căn, chọn Mệnh Cách độc quyền và xác nhận chuyển sinh.
  6. **Giao Diện Lục Đạo Luân Hồi Bàn (`components/modals/RebornModal.tsx`):**
     - Tái thiết kế toàn diện theo phong cách Cổ Phong Lục Đạo Luân Hồi Bàn với 2 màn hình chuyển tiếp mượt mà.
  7. **Tích Hợp HeaderNav, Dashboard Cards & MiddleColumn:**
     - HeaderNav: Bổ sung huy hiệu `[Kiếp Thứ X]` và nút Luân Hồi.
     - CharacterIdentityCard: Nút nhấp nháy đỏ `⚡ Tọa Hóa Niết Bàn` khi thọ nguyên sắp cạn (`isDanger`).
     - DestinyCard: Hiển thị và định dạng đặc biệt cho ô thứ 6 `[Luân Hồi Đạo Nhãn]`.
     - MiddleColumn: Nút chuyển nhanh vào Tọa Hóa Luân Hồi khi thời gian bế quan vượt quá thọ nguyên còn lại.
  8. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Chuẩn hóa an toàn `reincarnationState` và tự động giải phong `sealedArtifact` cho các save game cũ khi đạt Trúc Cơ Kỳ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/character.ts`: Khai báo `SealedNatalArtifact`, `ReincarnationPerk`, `ReincarnationState`.
  - `lib/types/player.ts`: Bổ sung trường `reincarnationState`.
  - `lib/reincarnation-logic.ts`: Module pure logic luân hồi.
  - `lib/destiny-data.ts`: Thêm 3 Mệnh Cách chuyển sinh, mở ô thứ 6, tính toán combat stats cho phôi phong ấn.
  - `lib/game-logic/cultivation.ts`: Tích hợp buff tốc độ tu vi từ perk luân hồi.
  - `lib/offline-progress.ts`: Tích hợp buff tốc độ tu vi từ perk luân hồi vào offline progress.
  - `hooks/useReincarnationActions.ts`: Custom domain hook luân hồi.
  - `components/modals/RebornModal.tsx`: Giao diện Lục Đạo Luân Hồi Bàn.
  - `components/dashboard/HeaderNav.tsx`: Huy hiệu Kiếp Thứ X và nút Luân Hồi.
  - `components/dashboard/left/CharacterIdentityCard.tsx`: Nút Tọa Hóa Niết Bàn khi thọ nguyên nguy cấp.
  - `components/dashboard/left/DestinyCard.tsx`: Hiển thị ô thứ 6 Luân Hồi Đạo Nhãn.
  - `components/dashboard/LeftColumn.tsx`: Chuyển tiếp callback `openRebornModal`.
  - `components/dashboard/MiddleColumn.tsx`: Nút Tọa Hóa Luân Hồi khi vượt thọ nguyên.
  - `components/GameDashboard.tsx`: Tích hợp hook và modal luân hồi.
  - `lib/save-migration.ts`: Di trú an toàn `reincarnationState` và auto-unseal.
  - `CHANGELOG.md` & `README.md`: Cập nhật tài liệu kỹ thuật.
- **Kết quả kiểm thử (Verification):**
  - `npx tsc --noEmit`: 0 errors (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack (Exit code 0).

### [2026-10-02 09:00] - Nâng Cấp Hệ Thống 20 Tông Môn: Khởi Tạo Phân Hệ "Tranh Đoạt Linh Mạch" & "Đại Trận Hộ Sơn" (Single-Player Client Simulation)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tông môn sau khi bái sư chủ yếu xoay quanh việc nhận lương và làm nhiệm vụ cơ bản, thiếu tính tranh chấp chiến lược và cảm giác thế giới tu chân biến động sống động giữa các thế lực đồng giai.
  - Triển khai 2 phân hệ gameplay chiến lược trọng tâm: **Tranh Đoạt Linh Mạch (Simulated Sect Vein Wars)** và **Đại Trận Hộ Sơn (Sect Guardian Array)** dành cho 20 Tông Môn phân cấp 5 Tier.
  - **Quán triệt nguyên tắc kỹ thuật:** Trò chơi là trải nghiệm **Single-Player Client-First 100%**. Toàn bộ đối thủ, môn phái tranh chấp và thế cục giằng co đều được mô phỏng toán học bằng thuật toán NPC nội bộ (NPC Faction Simulation), lưu trữ trực tiếp tại `localStorage`, không sử dụng server mạng hay tính năng nhiều người chơi.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Schema & Domain Types (`lib/types/sect.ts`, `lib/types/player.ts`):**
     - Định nghĩa kiểu `SpiritVeinType` (`'herb' | 'ore' | 'cultivation'`).
     - Định nghĩa kiểu `SpiritVein` gồm: `id`, `name`, `type`, `tier` (1..5), `occupiedSectId`, `occupiedAt`, `defensePower`, `guardianNpc` (tên, đạo hiệu, cảnh giới, chỉ số combat `hp`, `maxHp`, `atk`, `def`, `speed`), và `buffs` (`tuViSpeedBonus`, `herbGrowthSpeedBonus`, `oreYieldBonus`, `dailyLinhThachStipend`).
     - Định nghĩa kiểu `SectGuardianArray` gồm: 10 cấp độ (`level: 1..10`), `exp`, `maxExp`, `arrayName`, `buffs` (`damageReduction`, `combatStartShieldHp`, `tribulationInjuryReduction`).
     - Mở rộng `SectSubTab`: `'overview' | 'quests' | 'arena' | 'veins' | 'array' | 'shop'`.
     - Mở rộng `SectState` bổ sung: `guardianArray`, `occupiedVeinIds`, `lastVeinWarAt`, `lastVeinClaimAt`, `veinStates`.
     - Bổ sung alias an toàn `PlayerStats['sectData']`.
  2. **Dữ Liệu Cấu Hình Mẫu (`lib/sect-data.ts`):**
     - Cấu hình 10 Cấp Hộ Sơn Đại Trận (`SECT_ARRAY_LEVELS_CONFIG`):
       - *Cấp 1 (Cửu Cung Bát Quái Trận):* 2,000 EXP ➔ +2% Miễn thương, Khiên 500 HP.
       - *Cấp 2 (Tứ Tượng Hộ Môn Trận):* 4,500 EXP ➔ +3.5% Miễn thương, Khiên 1,000 HP, Giảm 5% tổn thất độ kiếp.
       - *Cấp 3 (Thái Ất Hộ Sơn Trận):* 8,000 EXP ➔ +5% Miễn thương, Khiên 2,000 HP, Giảm 10% tổn thất độ kiếp.
       - *Cấp 4 (Ngũ Hành Kim Cương Trận):* 15,000 EXP ➔ +7.5% Miễn thương, Khiên 3,500 HP, Giảm 15% tổn thất độ kiếp.
       - *Cấp 5 (Thất Tinh Quy Tông Trận):* 25,000 EXP ➔ +10% Miễn thương, Khiên 6,000 HP, Giảm 20% tổn thất độ kiếp.
       - *Cấp 6 (Bát Hoang Càn Khôn Trận):* 45,000 EXP ➔ +12.5% Miễn thương, Khiên 10,000 HP, Giảm 25% tổn thất độ kiếp.
       - *Cấp 7 (Cửu U Hỗn Thiên Trận):* 75,000 EXP ➔ +15% Miễn thương, Khiên 15,000 HP, Giảm 30% tổn thất độ kiếp.
       - *Cấp 8 (Hư Không Tru Ma Trận):* 110,000 EXP ➔ +17% Miễn thương, Khiên 20,000 HP, Giảm 35% tổn thất độ kiếp.
       - *Cấp 9 (Vạn Kiếm Quy Tông Hộ Sơn Trận):* 150,000 EXP ➔ +18.5% Miễn thương, Khiên 25,000 HP, Giảm 40% tổn thất độ kiếp.
       - *Cấp 10 (Thái Sơ Hỗn Độn Tiên Thiên Đại Trận):* 200,000 EXP ➔ +20% Miễn thương, Khiên 30,000 HP, Giảm 50% tổn thất độ kiếp.
     - Cấu hình 15 Đại Linh Mạch Thái Cổ chia đều cho 5 Tier (`SECT_SPIRIT_VEINS_CONFIG`):
       - *Tier 1:* Bách Thảo Nhất Giai Mạch, Hắc Thiết Quặng Mạch, Tụ Khí Linh Nhãn (Thủ Hộ Giả: Luyện Khí Đỉnh Phong).
       - *Tier 2:* Thanh Thủy Chu Quả Sơn, Huyền Thiết Khoáng Mạch, Ôn Tuyền Đạo Cốc (Thủ Hộ Giả: Trúc Cơ Đỉnh Phong).
       - *Tier 3:* Vạn Niên Huyết Chi Cốc, Thiên Canh Thần Khoáng, Ngũ Hành Tụ Linh Phong (Thủ Hộ Giả: Kim Đan Hậu Kỳ).
       - *Tier 4:* Thái Ất Tinh Vân Động, Tử Tinh Thần Mạch, Hư Không Linh Tuyền (Thủ Hộ Giả: Nguyên Anh Viên Mãn).
       - *Tier 5:* Hỗn Độn Dược Điền Thái Cổ, Vạn Cổ Lôi Thần Mạch, Sinh Mệnh Bản Nguyên Trì (Thủ Hộ Giả: Hóa Thần Cực Cảnh).
  3. **Xây Dựng Pure Business Logic (`lib/sect-logic.ts`):**
     - `contributeToGuardianArray`: Đóng góp Linh Thạch (100 LT = +10 EXP), Cống Hiến (50 CH = +25 EXP), hoặc Trận Bàn chế tác từ Bách Nghệ (Tier 1: +200, Tier 2: +600, Tier 3: +1,500, Tier 4: +4,000, Tier 5: +10,000 EXP). Tự động thăng cấp khi `exp >= maxExp`.
     - `simulateVeinTurnCombat` & `executeVeinBattle`: Giao tranh theo lượt tối đa 10 hiệp giữa người chơi và Thủ Hộ Giả NPC, tích hợp Hộ Thuẫn Hộ Sơn Trận đầu trận, chỉ số né tránh, bạo kích và miễn thương. Thắng trận chiếm cứ điểm, nhận thưởng 200 Cống Hiến + 1,000 Linh Thạch; Bại trận nhận 30 phút điều dưỡng.
     - `checkAndTickVeinOccupation`: Thuật toán mô phỏng NPC phản công (15% tỷ lệ khi bế quan hoặc qua ngày) nếu cứ điểm thiếu phòng ngự (`defensePower < 1500`).
     - `getOccupiedVeinsBuffs`: Tổng hợp các chỉ số gia trì từ các linh mạch đang chiếm đóng.
  4. **Tích Hợp Vào Engine Combat, Tu Luyện & Độ Kiếp:**
     - `lib/destiny-data.ts`: `calculateCombatStats()` tự động cộng dồn `buffs.damageReduction` vào `dmgReduction` và khởi tạo thuộc tính `combatStartShieldHp`.
     - `lib/game-logic/cultivation.ts` & `lib/offline-progress.ts`: Tích hợp `tuViSpeedBonus` từ Tụ Khí Mạch vào tốc độ tu luyện thực tế và AFK offline.
     - `lib/tribulation-logic.ts`: `finalizeTribulationDefeat()` áp dụng `tribulationInjuryReduction` giảm thiểu lượng tu vi tổn thất khi độ kiếp thất bại.
  5. **Nâng Cấp Domain Hook & Giao Diện (`hooks/useSectActions.ts`, `components/tabs/SectTab.tsx`):**
     - Mở rộng thanh Sub-tabs nội bộ: `📜 Đại Điện` | `📋 Nhiệm Vụ` | `⚔️ Luận Kiếm` | `🏔️ Linh Mạch` | `🛡️ Hộ Sơn Trận` | `🏪 Tàng Kinh Các`.
     - Sub-tab `🏔️ Linh Mạch`: Hiển thị số lượng mạch kiểm soát, tổng buff gia trì, nút nhận bổng lộc hàng ngày, danh sách 3 cứ điểm của Tier kèm Thủ Hộ Giả, nút Gia Cố Trận Địa và nút Khai Chiến Đoạt Mạch.
     - Sub-tab `🛡️ Hộ Sơn Trận`: Bát Quái trận đồ phát quang động theo cấp độ (Lam ➔ Hoàng kim ➔ Cực quang tím), thanh EXP, bảng buff vĩnh viễn, 3 khối hiến tế (Linh thạch, Cống hiến, Trận bàn).
     - Popup Modal trận chiến đoạt mạch kèm nhật ký giao phong chi tiết.
  6. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - `normalizePlayerData()` tự động khởi tạo `guardianArray` Cấp 1 (`2,000` maxExp), `occupiedVeinIds: []`, `lastVeinWarAt: 0`, `lastVeinClaimAt: 0`, `veinStates: {}` cho các save game cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/sect.ts`: Khai báo `SpiritVeinType`, `SpiritVein`, `SectGuardianArray`, `SectSubTab`, `veinStates`.
  - `lib/types/player.ts`: Thêm `sectData` alias vào `PlayerStats`.
  - `lib/types/combat.ts`: Thêm `combatStartShieldHp` vào `CombatStats`.
  - `lib/sect-data.ts`: Thêm `SECT_ARRAY_LEVELS_CONFIG`, `SECT_SPIRIT_VEINS_CONFIG`, `createDefaultGuardianArray`, `getSectVeinsForTier`, `getSectVeinById`.
  - `lib/sect-logic.ts`: Thêm `contributeToGuardianArray`, `simulateVeinTurnCombat`, `executeVeinBattle`, `checkAndTickVeinOccupation`, `getOccupiedVeinsBuffs`.
  - `lib/destiny-data.ts`: Tích hợp miễn thương và khiên hộ sơn trận vào `calculateCombatStats`.
  - `lib/game-logic/cultivation.ts`: Tích hợp `tuViSpeedBonus` từ mạch tụ khí vào tốc độ thổ nạp.
  - `lib/offline-progress.ts`: Tích hợp `tuViSpeedBonus` vào tốc độ bế quan ngoại tuyến.
  - `lib/tribulation-logic.ts`: Áp dụng `tribulationInjuryReduction` giảm tổn thất tu vi độ kiếp.
  - `lib/save-migration.ts`: Chuẩn hóa an toàn `guardianArray`, `occupiedVeinIds`, `veinStates`.
  - `hooks/useSectActions.ts`: Quản lý state và handlers: `handleDonateToArray`, `handleAttackVein`, `handleClaimVeinStipend`, `handleReinforceVein`, `handleCloseVeinBattleModal`.
  - `hooks/useGameActions.ts`: Tích hợp kiểm tra NPC incursion sau khi hoàn tất bế quan.
  - `components/tabs/SectTab.tsx`: Bổ sung 2 sub-tabs `🏔️ Linh Mạch` & `🛡️ Hộ Sơn Trận`, giao diện Bát Quái xoay vần, lưới linh mạch, modal chiến đấu.
  - `components/GameDashboard.tsx`: Kết nối và truyền handlers vào `SectTab`.
  - `README.md`: Cập nhật Mục 4.17 đặc tả Tranh Đoạt Linh Mạch và Hộ Sơn Đại Trận.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16.3.5 Turbopack (Exit code 0), TypeScript check 17.1s, 8/8 static pages generate hoàn hảo.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Có thể mở rộng thêm tính năng Đệ Tử Thủ Hộ phái người chơi xuất chiến trấn giữ cứ điểm khi nhân vật đạt chức vụ Trưởng Lão hoặc Chưởng Môn.

### [2026-10-02 08:40] - Khởi Tạo Phân Hệ "Lò Dung Luyện • Phân Giải & Tái Chế Trang Bị" (Sub-Tab 5 Thần Binh Các): Đóng Kín Vòng Lặp Tài Nguyên Bách Nghệ
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Sau khi càn quét Bí Cảnh Roguelite (`SecretRealmTab`) hoặc mở rương Thái Cổ Cấm Địa (`ForbiddenZoneModal`), kho đồ người chơi bị ứ đọng rất nhiều vũ khí, phòng cụ rác cấp thấp không dùng đến gây chật túi và lãng phí tài nguyên.
  - Xây dựng phân hệ **"Lò Dung Luyện • Phân Giải & Tái Chế Trang Bị" (Dismantle & Forge Recycling)** đặt làm Sub-tab thứ 5 trong **Thần Binh Các (`ForgingTab.tsx`)**, đóng kín vòng lặp tài nguyên của Tứ Đại Bách Nghệ: thu hồi khoáng thạch theo Giai Vị, thu hồi Tinh Hoa Rèn Đúc theo Phẩm Cấp, bảo tồn 100% Linh Ngọc và tối ưu hóa trải nghiệm với tính năng phân giải hàng loạt 1-click.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Schema & Domain Types (`lib/types/items.ts`):**
     - Mở rộng kiểu tab chính Thần Binh Các: `export type ForgingMainTab = 'forge' | 'inlay' | 'reforge' | 'natal' | 'dismantle';`.
     - Khai báo kiểu kết quả phân giải `DismantleReward` gồm: `oreId`, `oreName`, `oreQuantity`, `forgingEssence`, `recoveredGems: GemItem[]`, `linhThachRefund`, `ores?: { oreId, oreName, oreQuantity }[]`.
     - Mở rộng `InventoryBag` / `PlayerInventory` bổ sung trường `forgingEssence?: number;` (Tinh Hoa Rèn Đúc).
  2. **Xây Dựng Pure Logic Phân Giải (`lib/forging-logic.ts`):**
     - Bảng ánh xạ thu hồi Khoáng Thạch theo Giai Vị (Tier-to-Ore Table):
       - *Tier 1 (Luyện Khí):* 1–3 viên `ore_hac_thiet` (Hắc Thiết Khoáng).
       - *Tier 2 (Trúc Cơ):* 1–2 viên `ore_huyen_thiet` (Huyền Thiết Khoáng).
       - *Tier 3 (Kim Đan):* 1–2 viên `ore_huyen_thiet_tinh_thach` (Huyền Thiết Tinh Thạch).
       - *Tier 4 (Nguyên Anh):* 1 viên `ore_tu_tinh_thach` (Tử Tinh Thạch).
       - *Tier 5+ (Hóa Thần trở lên):* 1 viên `ore_ngu_hanh_tinh_kim` (Ngũ Hành Tinh Kim).
     - Trọng số Tinh Hoa Rèn Đúc & Linh Thạch theo Phẩm Cấp (Quality/Grade):
       - *Hạ Phẩm:* +5 Tinh Hoa, +20 Linh Thạch.
       - *Trung Phẩm:* +15 Tinh Hoa, +50 Linh Thạch.
       - *Thượng Phẩm:* +40 Tinh Hoa, +150 Linh Thạch.
       - *Cực Phẩm:* +100 Tinh Hoa, +500 Linh Thạch.
       - *Tuyệt Phẩm:* +250 Tinh Hoa, +1,500 Linh Thạch.
       - *Tiên / Thần / Chí Tôn:* +600 Tinh Hoa, +5,000 Linh Thạch.
     - Hàm kiểm tra hợp lệ & an toàn tuyệt đối `canDismantleEquipment(equip, player)`: Chặn 100% đồ đang mặc trên thân (`player.equipment`, `player.equippedItems`) và đồ đã nhỏ máu tế luyện Bản Mệnh Pháp Bảo (`player.natalArtifact`).
     - Hàm tính toán kết quả `calculateDismantleReward(equip)`: Quét mảng `equip.sockets`, bóc tách toàn bộ `socket.gem` đưa vào `recoveredGems` an toàn.
     - Hàm thực thi `executeDismantleSingle` & `executeDismantleBatch`: Cập nhật khoáng vào `player.inventory.ores`, hoàn trả ngọc vào `player.inventory.gems`, cộng `forgingEssence` và `linhThach`.
  3. **Domain Hook Điều Phối (`hooks/useCraftingActions.ts`):**
     - Quản lý state `forgingMainTab` hỗ trợ thêm `'dismantle'`, state `selectedDismantleIds: string[]`.
     - Handlers: `handleSelectDismantleEquip` (toggle chọn kèm thông báo nếu đồ bị khóa), `handleSelectAllByGrade` (chọn nhanh Hạ Phẩm/Trung Phẩm), `handleClearDismantleSelection` (hủy chọn), `handleConfirmDismantle` (thực thi dung luyện, phát SFX `alchemy`, hiển thị Toast và thêm chiến báo vào nhật ký).
  4. **Nâng Cấp Giao Diện Thần Binh Các (`components/tabs/ForgingTab.tsx`):**
     - Bổ sung Main Sub-tab thứ 5 `♻️ Lò Dung Luyện` trên thanh điều hướng cổ phong.
     - **Top Quick Bar:** Nút chọn nhanh `[⚡ Hạ Phẩm]`, `[⚡ Trung Phẩm]`, `[⚡ Hạ & Trung Phẩm]`, `[✕ Hủy Chọn]`; Bộ lọc Slot (Vũ khí / Đạo bào / Hộ thân / Pháp bảo) và Tier (Tier 1–5+); Badge hiển thị Tinh Hoa Rèn Đúc tích lũy.
     - **Bố Cục 2 Cột Đối Xứng:**
       - *Cột Trái (Danh sách trang bị):* Lưới thẻ bài trang bị chưa mặc trong túi, checkbox chọn, icon loại đồ, tên, phẩm cấp, Tier, badge ngọc khảm (hiển thị cam kết tháo an toàn 100%), empty state khi túi không có đồ rảnh rỗi.
       - *Cột Phải (Bát Quái Chân Hỏa Đài):* Lò Bát Quái phát quang xoay vần; Bảng Dự Toán Thu Hồi Thời Gian Thực (Live Preview Yield: số món, danh sách khoáng thạch, danh sách linh ngọc tháo gỡ an toàn, tinh hoa & linh thạch); Nút bấm lớn trung tâm `🔥 KHỞI ĐỘNG CHÂN HỎA DUNG LUYỆN` viền phát quang đỏ/hổ phách (active khi chọn $\ge 1$ món).
  5. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts` & `lib/game-logic/character.ts`):**
     - Tại `normalizePlayerData()`: Khởi tạo an toàn `player.inventory.forgingEssence = typeof data.inventory?.forgingEssence === 'number' ? Math.max(0, data.inventory.forgingEssence) : 0;`.
     - Bảo toàn 100% dữ liệu trang bị, khoáng thạch và linh ngọc của các bản save cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/items.ts`: Thêm `forgingEssence`, `ForgingMainTab`, `DismantleReward`, `PlayerInventory`.
  - `lib/forging-logic.ts`: Thêm `getEquipmentTier`, `getEquipQualityKey`, `canDismantleEquipment`, `calculateDismantleReward`, `executeDismantleBatch`, `executeDismantleSingle`.
  - `hooks/useCraftingActions.ts`: Tích hợp state dismantle, handlers chọn/hủy/phân giải, kết nối audio engine và log.
  - `components/GameDashboard.tsx`: Truyền props điều phối dismantle từ hook vào `ForgingTab`.
  - `components/tabs/ForgingTab.tsx`: Nâng cấp giao diện 5 sub-tabs, Top Quick Bar, 2-column layout, Live Preview Yield table, lò luyện phát quang.
  - `lib/save-migration.ts`: Chuẩn hóa an toàn `inventory.forgingEssence` trong `normalizePlayerData`.
  - `lib/game-logic/character.ts`: Khởi tạo `forgingEssence: 0` trong `createNewPlayer()`.
  - `README.md`: Cập nhật File Catalog Nhóm 3 và Mục 4.4 đặc tả Lò Dung Luyện.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js 16.3.5 Turbopack (Exit code 0), TypeScript check 14.5s, 8/8 static pages generate hoàn hảo.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Tận dụng `forgingEssence` (Tinh Hoa Rèn Đúc) cho các tính năng nâng cấp thần binh chuyên sâu trong tương lai (như Thăng Giai Bản Mệnh hoặc Tôi Luyện Tẩy Luyện Cao Cấp).

### [2026-10-02 08:30] - Tích Hợp Thanh Bộ Lọc Nhanh Giai Vị (Tier 1–9) Trên Vạn Bảo Thương Hội: Điều Hướng Tra Cứu Bảo Vật Chuẩn Cảnh Giới
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Mặc dù hàng hóa trong Vạn Bảo Thương Hội đã được sắp xếp từ thấp đến cao, nhưng khi danh mục mở rộng với hàng chục vật phẩm từ Nhất Giai đến Cửu Giai (như Đan Dược, Khoáng Thạch, Trang Bị, Pháp Bảo), người chơi ở cảnh giới cao (Kim Đan, Nguyên Anh, Hóa Thần...) vẫn phải cuộn qua nhiều trang bị cấp thấp để tìm kiếm bảo vật phù hợp.
  - Cần tích hợp Thanh Bộ Lọc Nhanh Giai Vị (Tier 1-9) đặt trực tiếp trên danh sách hàng hóa, cho phép lọc tức thời theo từng giai vị cảnh giới mà không làm vỡ cấu trúc Viewport Lock hay sinh thanh cuộn kép.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Pure Logic Tầng Domain (`lib/merchant-data.ts`):**
     - Khởi tạo kiểu `MerchantTierFilter = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`.
     - Viết pure function `matchMerchantTier(item, selectedTier)`: So khớp trực tiếp thông qua `getItemTierWeight(item)`.
     - Cung cấp danh mục cấu hình `MERCHANT_TIER_TABS` gồm 10 nút bấm kèm nhãn cổ phong và mã màu nhận diện theo phẩm cấp linh khí (`✨ Toàn Giai`, `1 Giai (Luyện Khí)` -> `9 Giai (Tiên / Đế)`).
  2. **Tầng Giao Diện UI & State Management (`components/tabs/MerchantTab.tsx`):**
     - Khai báo state `selectedTier` (mặc định `'all'`).
     - Tự động reset về `'all'` khi người chơi đổi sub-tab thông qua `useEffect` theo dõi `merchantSubTab`, triệt tiêu hoàn toàn lỗi kẹt bộ lọc làm trống danh sách.
     - Tính toán `tierItemCounts` (memoized) đếm số lượng vật phẩm tương ứng trong danh mục hiện tại và hiển thị badge số lượng trực quan trên từng nút.
     - Cập nhật luồng lọc đa tầng trong `filteredItems` kết hợp đồng thời `matchMerchantCategory`, `matchMerchantTier` và `sortMerchantItems`.
  3. **Thanh Điều Hướng Tier Pill Bar & Trải Nghiệm Người Dùng:**
     - Thiết kế thanh cuộn ngang compact `no-scrollbar py-1 px-1 border-b border-amber-900/20 bg-zinc-950/40 rounded-md` đặt ngay phía trên danh sách hàng hóa.
     - Tự động ẩn hoàn toàn khi chuyển sang các tab không có khái niệm Giai Vị (`♻️ Thu Mua` và `💰 Tệ Điếm`).
     - Empty state cổ phong thanh lịch khi một giai vị chưa có hàng: `"Chưa có bảo vật Giai vị này cập bến Thương Hội, xin quay lại sau!"` kèm nút bấm nhanh `✨ Xem Toàn Bộ Giai`.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/merchant-data.ts`: Thêm `MerchantTierFilter`, `matchMerchantTier`, `MERCHANT_TIER_TABS`.
  - `components/tabs/MerchantTab.tsx`: Tích hợp state `selectedTier`, `tierItemCounts`, update `filteredItems`, thêm Tier Pill Bar và Empty State.
  - `README.md`: Cập nhật File Catalog và Mục 4.12 đặc tả tính năng lọc nhanh Giai Vị.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi biên dịch kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công Next.js Turbopack (Exit code 0), TypeScript 9.6s, 8/8 static pages.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Tiếp tục quan sát phản hồi trải nghiệm người chơi khi số lượng vật phẩm trong kho hàng tăng lên trên 200+ món.

### [2026-10-02 08:15] - Xây Dựng Engine So Sánh Đa Tầng (Deterministic Multi-Level Comparator) Cho Vạn Bảo Thương Hội: Tự Động Sắp Xếp Toàn Bộ Hàng Hóa Theo Phẩm Cấp Lũy Tiến (Thấp → Cao)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Thứ tự hiển thị vật phẩm trong các tab của Vạn Bảo Thương Hội trước đây phụ thuộc vào thứ tự khai báo mảng (hardcoded array insertion order), dẫn đến việc đồ cao giai (Tam Giai, Tứ Giai, Cực Phẩm) và đồ sơ cấp (Nhất Giai, Nhị Giai, Hạ Phẩm) nằm xen kẽ lộn xộn trong cùng một phân mục.
  - Cần xây dựng một cơ chế sắp xếp chuẩn mực (Deterministic Multi-Level Comparator), tự động sắp xếp toàn bộ hàng hóa trong mọi sub-tab từ **Phẩm Cấp / Giai Vị / Giá Trị Thấp đến Cao**.
  - Đảm bảo cơ chế kế thừa vĩnh viễn (Future-Proof): Khi lập trình viên thêm bất kỳ vật phẩm mới nào vào mảng dữ liệu mà không cần quan tâm vị trí trong file, hệ thống vẫn tự động xếp đúng vị trí từ thấp đến cao tại cả tầng sinh dữ liệu, tầng di trú save game cũ và tầng hiển thị UI.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Bảng Trọng Số Chuẩn Mực (`lib/merchant-data.ts`):**
     - `TIER_WEIGHT: Record<string, number>`: Định lượng cấp giai từ Nhất Giai (1) đến Cửu Giai (9) kèm các biến thể chuỗi `'nhat_giai'`, `'tier_1'`.
     - `GRADE_WEIGHT: Record<string, number>`: Định lượng 10 bậc phẩm cấp: Phàm/Hạ Phẩm (1) → Trung Phẩm (2) → Thượng Phẩm (3) → Cực Phẩm (4) → Tuyệt Phẩm (5) → Chí Tôn/Cổ Bảo (6) → Tiên Phẩm (7) → Thần Phẩm (8) → Hỗn Độn (9) → Đế Khí (10).
  2. **Trích Xuất Điểm Số & Engine So Sánh Đa Tầng (`lib/merchant-data.ts`):**
     - `getItemTierWeight(item)`: Trích xuất thông minh từ `item.tier`, `item.equipmentData.tier`, `item.manualTier`, `GIAI_GRADE_NUMBERS`, `getGiaiNumber(item.grade)` và phân tích regex chuỗi `id`/`name`/`description`.
     - `getItemGradeWeight(item)`: Trích xuất từ `item.quality`, `item.equipmentData.grade`, `item.grade` và từ khóa phẩm chất.
     - `compareMerchantItems(a, b)`: Thực thi 4 tiêu chí so sánh lũy tiến:
       - *Tiêu chí 1 (Tier):* So sánh cấp giai (`tierA - tierB`).
       - *Tiêu chí 2 (Grade):* So sánh phẩm cấp (`gradeA - gradeB`).
       - *Tiêu chí 3 (Price):* So sánh giá bán Linh Thạch tăng dần (`priceA - priceB`).
       - *Tiêu chí 4 (ID Determinism):* Tie-breaker ổn định tuyệt đối `a.id.localeCompare(b.id)`.
     - `sortMerchantItems(items)`: Pure function trả về mảng mới đã sắp xếp chuẩn xác.
  3. **Tích Hợp Tầng Khởi Tạo & Tầng UI:**
     - `generateMerchantInventory()`: Wrap toàn bộ mảng `allRaw.map(...)` qua `sortMerchantItems(processed)` trước khi trả về.
     - `components/tabs/MerchantTab.tsx`: Sử dụng `useMemo` với `sortMerchantItems(matched)` cho `filteredItems` tại component top-level, loại bỏ sắp xếp dư thừa khi re-render.
  4. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts`):**
     - Tại `normalizePlayerData()`: Khi nạp `merchantState.items`, chạy qua `sortMerchantItems(merchantState.items)` để tự động chuẩn hóa lại thứ tự cho toàn bộ save game cũ mà không ảnh hưởng tới số lượng hay trạng thái đã mua của người chơi.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/merchant-data.ts`: Thêm `TIER_WEIGHT`, `GRADE_WEIGHT`, `getItemTierWeight`, `getItemGradeWeight`, `compareMerchantItems`, `sortMerchantItems`; wrap `sortMerchantItems` trong `generateMerchantInventory()`.
  - `components/tabs/MerchantTab.tsx`: Memoize `filteredItems` với `useMemo` và `sortMerchantItems`.
  - `lib/save-migration.ts`: Bổ sung `sortMerchantItems(merchantState.items)` trong `normalizePlayerData`.
  - `README.md`: Cập nhật File Catalog và Mục 4.12 đặc tả cơ chế tự động sắp xếp hàng hóa.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi biên dịch kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công Next.js Turbopack (Exit code 0), TypeScript 4.3s, 8/8 static pages.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Cơ chế tự động hoạt động 100% cho mọi mặt hàng mới được thêm vào `merchant-data.ts` trong tương lai mà không cần cấu hình thêm.

### [2026-10-02 08:00] - Tích Hợp Kho Khoáng Thạch & Tài Liệu Luyện Khí Vào Vạn Bảo Thương Hội: Sub-tab ⛏️ Khoáng Thạch Nhất Giai → Cửu Giai Kết Nối Thần Binh Các
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Vạn Bảo Thương Hội trước đây gộp khoáng thạch (`itemType: 'ore'`) vào cùng tab `🌿 Dược Thảo` (`materials`), gây lộn xộn giữa nguyên liệu luyện đan và nguyên liệu rèn khí. Người chơi Thần Binh Các (`ForgingTab`) không thể tìm nhanh khoáng thạch chuyên biệt.
  - Cần tách bạch thành danh mục độc lập `⛏️ Khoáng Thạch` với 15 loại khoáng thạch phủ toàn bộ Nhất Giai → Cửu Giai, phục vụ cả luyện rèn thông thường lẫn chế tạo Thần Binh Cấp Tam Giới.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Schema & Domain Types (`lib/types/items.ts`):**
     - Bổ sung `'ores'` vào `MerchantCategory` union type (tổng cộng 13 sub-tab danh mục chính thức).
  2. **Logic Lọc Danh Mục (`lib/merchant-data.ts`):**
     - Thêm case `'ores'` vào `matchMerchantCategory()`: khớp chính xác `category === 'ores'` và backward-compat với ore cũ `category === 'materials'`.
     - Cập nhật case `'materials'`/`'herbs'`: loại trừ `category === 'ores'` để không bị hiển thị trùng.
     - Thêm mảng `oreItems` (15 mục) với `category: 'ores'` và đưa vào `allRaw` của `generateMerchantInventory()`.
  3. **Danh Sách 15 Khoáng Thạch Phân Cấp Đầy Đủ:**
     - **Nhất Giai:** Hắc Thiết Khoáng (Hạ Phẩm • 40LT/40u), Lục Đồng Khoáng (Trung Phẩm • 50LT/35u)
     - **Nhị Giai:** Thanh Đồng Tinh (Trung Phẩm • 100LT/28u), Âm Kim Tinh Thạch (Thượng Phẩm • 160LT/20u)
     - **Tam Giai:** Huyền Thiết Tinh Thạch (Thượng Phẩm • 280LT/18u), Huyền Thiết Ngàn Năm (Cực Phẩm • 850LT/10u)
     - **Tứ Giai:** Tử Tinh Thạch (Cực Phẩm • 800LT/10u), Thái Cổ Tinh Thiết (Tuyệt Phẩm • 3,600LT/6u)
     - **Ngũ Giai:** Ngũ Hành Tinh Kim (Tuyệt Phẩm • 9,500LT/3u), Hư Không Tinh Thạch (Chí Tôn • 15,000LT/4u)
     - **Lục Giai:** Thiên Lôi Cung Kim (Tiên Phẩm • 42,000LT/2u), Tuyết Hàn Băng Tinh (Tiên Phẩm • 38,000LT/2u)
     - **Thất Giai:** Long Xương Thần Kim (Thần Phẩm • 130,000LT/1u)
     - **Bát Giai:** Cửu U Minh Thạch (Thần Phẩm • 380,000LT/1u)
     - **Cửu Giai:** Hỗn Độn Thần Thiết (Thần Phẩm • 1,200,000LT/1u) — vật liệu duy nhất rèn Thần Binh Tam Giới
  4. **Hook Mua Hàng (`hooks/useMerchantInventoryActions.ts`):**
     - Đã có sẵn branch `itype === 'ore'` (line 377-392) xử lý đúng: mua → `inv.ores.push(...)` / tăng số lượng → toast + log. Không cần sửa thêm.
  5. **Tầng Giao Diện UI/UX (`components/tabs/MerchantTab.tsx`):**
     - Thêm nút `⛏️ Khoáng Thạch` vào thanh sub-tabs ngang (13 nút), đặt ngay sau `🌿 Dược Thảo`. Màu sắc: vàng amber `bg-yellow-700/30 text-yellow-200 border-yellow-600/40` phân biệt rõ với dược thảo teal.
  6. **Tương Thích Ngược (Backward Compatibility):**
     - `matchMerchantCategory('ores')` nhận cả `category: 'materials'` nếu `itemType === 'ore'`, đảm bảo save data cũ (ores từ materialItems gốc) vẫn hiện đúng tab.
     - Không cần sửa `save-migration.ts` vì cấu trúc inventory.ores đã tồn tại từ đầu.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/items.ts`: Thêm `'ores'` vào `MerchantCategory`.
  - `lib/merchant-data.ts`: Thêm `matchMerchantCategory('ores')`, mảng `oreItems` (15 mục Nhất→Cửu Giai), đưa vào `allRaw`.
  - `components/tabs/MerchantTab.tsx`: Thêm nút sub-tab `⛏️ Khoáng Thạch`.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi biên dịch kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công Next.js Turbopack, TypeScript 13.2s, 8/8 static pages (Exit code 0).
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Kết nối `ForgingTab` (`useRecipeActions` / `useForgingActions`) để đọc `player.inventory.ores` khi kiểm tra nguyên liệu công thức rèn.
  - Cân nhắc thêm bộ lọc theo cấp giai trong tab Khoáng Thạch khi danh mục tiếp tục mở rộng.

### [2026-10-02 07:45] - Tách Bạch Đan Dược Khỏi Mục Tu Luyện Trong Vạn Bảo Thương Hội: Thiết Lập Sub-tab "💊 Đan Dược" Độc Lập & Thanh Lọc "⚡ Tu Luyện" Thành Kho Bảo Vật Bế Quan
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trong Vạn Bảo Thương Hội (`MerchantTab.tsx`), phân mục "⚡ Tu Luyện" (`cultivation`) trước đây bị quá tải và chồng chéo chức năng khi gộp chung cả các loại Đan Dược uống tiêu hao (Trúc Cơ Đan, Phá Cảnh Đan, Thọ Nguyên Đan, Khí Huyết Đan, Tích Cốc Đan...) lẫn các loại tài nguyên, bảo vật phụ trợ tu luyện.
  - Người chơi gặp khó khăn trong việc tìm kiếm đan dược đột phá cảnh giới và phân biệt giữa vật phẩm tiêu hao (Consumables) với các dị bảo / bảo vật gia tăng tốc độ tu vi hoặc hỗ trợ tĩnh tọa bế quan.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Mở Rộng Schema & Domain Types (`lib/types/items.ts`):**
     - Bổ sung `'pills'` vào `MerchantCategory` (mở rộng danh mục Thương Hội lên 12 sub-tabs hoàn chỉnh).
     - Bổ sung các trường phân loại con tùy chọn trong `MerchantItem`: `pillType` (`breakthrough` | `exp` | `stat` | `lifespan` | `recovery`) và `cultivationItemType` (`relic` | `incense` | `cushion` | `array_flag` | `spirit_vessel`).
  2. **Tách Bạch & Mở Rộng Kho Hàng (`lib/merchant-data.ts`):**
     - **Nhóm 1 - Đan Dược (`category: 'pills'`):** Chuyển toàn bộ đan dược sang danh mục độc lập với đầy đủ: Đan Phá Cảnh 1-6, Cải Mệnh Đan, Tẩy Tủy Đan, Ngộ Đạo Trà Vạn Năm, Khí Huyết Đan, Định Thần Đan, Hồi Huyết Đan, Tụ Khí Đan, Quy Nguyên Đan, Cố Bản Đan, Tích Cốc Đan, Duyên Thọ Đan (+20 năm thọ nguyên).
     - **Nhóm 2 - Bảo Vật Hỗ Trợ Tu Luyện (`category: 'cultivation'`):** Thanh lọc hoàn toàn các loại đan dược; chuẩn hóa và bổ sung các dị trân / bảo vật bế quan: Ngưng Thần Hương, Tụ Linh Châu, Bồ Đoàn Ngộ Đạo, Tụ Linh Trận Kỳ (Sơ/Trung Cấp), Ôn Ngọc Hàn Băng Sáp, Ngũ Hành Tụ Khí Đỉnh, cùng nguồn tài nguyên Tinh Huyết Yêu Thú 1-5 và U Hồn Thảo.
     - **Cập nhật `matchMerchantCategory()`:** Tách bạch tuyệt đối giữa `'pills'` và `'cultivation'` (loại trừ đan dược khỏi tab Tu Luyện), đồng thời bảo toàn khi xem `'all'`.
  3. **Tầng Hook Điều Phối Giao Dịch (`hooks/useMerchantInventoryActions.ts`):**
     - Khi mua item thuộc `category: 'pills'`: Tự động nhập kho `player.inventory.pills`, bắn toast và ghi log chuẩn tiên hiệp `"Chi [X] Linh Thạch mua 1 viên [Tên Đan], cất vào Bình Đan Trữ Vật!"`.
     - Khi mua bảo vật `category: 'cultivation'`: Lưu trữ vào `player.inventory.equipments` dạng artifact, ghi log trang bị hỗ trợ bế quan thổ nạp.
  4. **Tầng Giao Diện UI/UX (`components/tabs/MerchantTab.tsx`):**
     - Mở rộng thanh Sub-tabs ngang thành 12 nút: `✨ Toàn Bộ` | `💊 Đan Dược` | `⚡ Tu Luyện` | `🧘 Công Pháp` | `📜 Thần Thông` | `🌿 Dược Thảo` | `⚔️ Trang Bị` | `🌸 Đạo Lữ` | `🐾 Linh Thú` | `🎒 Trữ Vật` | `♻️ Thu Mua` | `💰 Tệ Điếm`.
     - Hệ thống huy hiệu phân loại sắc nét: Badge tím/lam huyền ảo `💊 Đan Dược` (hiển thị rõ Đột Phá, Căn Cơ, Tu Vi, Thọ Nguyên, Hồi Phục) và Badge thanh thiên `⚡ Bảo Vật Tu Luyện` (Hương Đạo, Dị Bảo, Bồ Đoàn, Trận Kỳ, Khí Đỉnh, Tinh Huyết).
  5. **Tương Thích Ngược & Di Trú Dữ Liệu (`lib/save-migration.ts`):**
     - Trong `normalizePlayerData()`: Tự động quét `merchantState.items`, chuyển đổi các item đan dược cũ đang mang `category: 'cultivation'` sang `category: 'pills'` và tự động bổ sung các bảo vật tu luyện mới vào shop cho các bản save cũ.
- **Danh sách File Tạo Mới & Sửa Đổi (Files Touched):**
  - `lib/types/items.ts`: Mở rộng `MerchantCategory` ('pills') và `MerchantItem` (`pillType`, `cultivationItemType`).
  - `lib/merchant-data.ts`: Tách mảng `pillItems` và `cultivationItems`, cập nhật `matchMerchantCategory`.
  - `hooks/useMerchantInventoryActions.ts`: Xử lý luồng mua đan dược và bảo vật tu luyện riêng biệt.
  - `components/tabs/MerchantTab.tsx`: Tích hợp sub-tab `💊 Đan Dược`, hệ thống badge trực quan.
  - `lib/save-migration.ts`: Tự động di trú đan dược và bổ sung bảo vật mới cho save cũ.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi biên dịch kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack trong ~1.6s (Exit code 0).
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Sẵn sàng tích hợp tiếp cơ chế tiêu thụ Ngưng Thần Hương và Bồ Đoàn Ngộ Đạo trực tiếp tại giao diện Động Phủ và Bế Quan.

### [2026-10-02 07:30] - Mở Rộng Hệ Thống Tông Môn: Khởi Tạo 20 Môn Phái Phân Cấp 5 Tier & Ma Trận Yêu Cầu Bái Sư (Cảnh Giới • Căn Cốt • Linh Căn)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây hệ thống chỉ có 5 tông môn cơ bản với yêu cầu bái sư đơn giản, người chơi cảnh giới Phàm Nhân / Luyện Khí có thể gia nhập bất kỳ môn phái nào mà không có rào cản, làm mất đi tính phân tầng quyền lực và thiếu động lực cày cuốc cảnh giới / căn cốt / linh căn.
  - Cần tái cấu trúc thành 20 Tông Môn chia đều vào 5 Tier thế lực lũy tiến, thiết lập ma trận yêu cầu bái sư chặt chẽ (Cảnh giới Khí Tu, Căn Cốt, Phẩm cấp Linh Căn) và cơ chế phản xuất chuyển phái công bằng.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Ma Trận 20 Tông Môn Phân Cấp 5 Tier (`lib/sect-data.ts`):**
     - Tier 1 (Cửu Lưu - Bát Cửu Phàm Trần): Yêu cầu Luyện Khí Tầng 1+ (Index >= 1), Căn Cốt >= 15, Tạp Linh Căn (Thanh Vân Môn, Thiết Khí Môn, Thảo Dược Cốc, Hoang Nguyệt Phái).
     - Tier 2 (Thất-Lục Lưu - Huyền Môn Nhập Đạo): Yêu cầu Trúc Cơ Sơ Kỳ+ (Index >= 11), Căn Cốt >= 35, Chân Linh Căn (Kim Kiếm Tông, Huyền Thủy Cung, Man Hoang Tông, U Minh Giáo).
     - Tier 3 (Ngũ-Tứ Lưu - Danh Môn Thế Gia): Yêu cầu Kim Đan Sơ Kỳ+ (Index >= 16), Căn Cốt >= 60, Địa Linh Căn (Đan Đỉnh Tông, Thiên Trận Các, Vạn Thú Sơn, Huyết Sát Tông).
     - Tier 4 (Tam-Nhị Lưu - Cổ Lão Tông Tộc): Yêu cầu Nguyên Anh Sơ Kỳ+ (Index >= 21), Căn Cốt >= 85, Thiên Linh Căn (Thái Ất Kiếm Tông, Bát Quái Tiên Môn, Cửu U Ma Điện, Lạc Hà Tiên Cung).
     - Tier 5 (Nhất Lưu Cổ Giáo - Vạn Cổ Thánh Địa): Yêu cầu Hóa Thần Sơ Kỳ+ (Index >= 26), Căn Cốt >= 100, Biến Dị / Hỗn Độn Linh Căn (Thái Sơ Thánh Địa, Luân Hồi Tiên Điện, Hỗn Độn Đạo Tông, Bất Diệt Ma Cung).
  2. **Tầng Nghiệp Vụ Pure Logic (`lib/sect-logic.ts`):**
     - Cung cấp `getLinhCanGradeValue`, `getRealmNameByIndex`, `checkSectJoinRequirements` kiểm tra hợp lệ và trả về mảng `missingReasons` cổ phong.
     - Cung cấp visual helper `getTierBadgeStyle` và `getSpecialtyDisplay`.
  3. **Tầng Hook Điều Phối (`hooks/useSectActions.ts`):**
     - Tích hợp kiểm tra điều kiện bái sư vào `handleJoinSect`. Bắn Toast cảnh báo và phát âm thanh `thunder` khi bị từ chối; bái sư thành công phát SFX `breakthrough`.
  4. **Tầng Giao Diện UI/UX (`components/tabs/SectTab.tsx`):**
     - Tích hợp thanh lọc Tier 6 nút (`Tất Cả` | `⭐ Tier 1` ... `👑 Tier 5 Thánh Địa`).
     - Hiển thị Checklist điều kiện nhập môn trực quan (Cảnh giới `✓/🔒`, Căn cốt `${cur}/${req}`, Phẩm linh căn).
     - Nút bấm thông minh `⚡ Bái Nhập Môn Phái` / `🔒 Tư Chất Chưa Đạt`.
     - Bổ sung huy hiệu Tier và tên phẩm cấp tại Header môn phái khi đã gia nhập.
  5. **Tương Thích Ngược & Di Trú Dữ Liệu (`lib/save-migration.ts`):**
     - Tự động map các ID môn phái cũ sang ID mới qua ma trận alias, bảo toàn 100% điểm cống hiến và chức vị người chơi.
- **Danh sách File Tạo Mới & Sửa Đổi (Files Touched):**
  - `lib/types/sect.ts`: Mở rộng `SectTier`, `SectRequirement`, `SectBuff`, `SectMission`, `SectData`, `SectId`.
  - `lib/sect-logic.ts`: *(Tạo mới)* Pure logic kiểm tra điều kiện bái sư và visual tokens.
  - `lib/sect-data.ts`: Cấu hình 20 tông môn 5 tier, cập nhật Luận Kiếm Đường và Tàng Kinh Các.
  - `hooks/useSectActions.ts`: Tích hợp guard check `checkSectJoinRequirements`, SFX Web Audio.
  - `components/tabs/SectTab.tsx`: Bổ sung Tier Filter, card checklist yêu cầu, huy hiệu Tier header.
  - `lib/save-migration.ts`: Bổ sung ma trận alias nạp an toàn dữ liệu môn phái cũ.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi biên dịch kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack trong ~3.1s (Exit code 0).
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Sẵn sàng tích hợp tiếp tính năng Phân Tranh Tông Môn (Sect Wars) và Nâng cấp Hộ Sơn Đại Trận.

### [2026-10-02 07:00] - Triển Khai Lối Tắt Điều Hướng (Quick Navigation) & Ma Trận Khóa Tứ Đại Bách Nghệ (Đan • Khí • Trận • Phù) Theo Cảnh Giới Khí Tu
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - **Tối ưu trải nghiệm (UX Friction):** Khi người chơi mở Sa Bàn Luyện Thể (`PhysiqueModal`) hoặc Thức Hải Thần Hồn (`SoulHubModal`) và gặp cảnh báo bị khóa bởi cảnh giới tu vi bản thể, họ phải tự tắt modal, mò tìm khu vực Bế Quan / Đột Phá ở giao diện chính để cày tu vi. Việc thiếu lối tắt trực tiếp gây đứt gãy mạch trải nghiệm.
  - **Cân bằng chiều sâu tiên hiệp (Game Balance & Lore):** Tu sĩ cảnh giới thấp (Phàm Nhân, Luyện Khí) lại có thể luyện đan ngũ giai, rèn thần binh cửu phẩm hay khắc Tru Tiên Kiếm Trận nếu gom đủ nguyên liệu. Điều này vi phạm nguyên tắc cốt lõi: *Tu vi bản thể chưa đủ thì chân hỏa chưa thuần, thần thức chưa nhập vi, không thể khống chế thiên địa linh khí để chế tác hay dung nạp bảo vật thượng giai*.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Lối Tắt Điều Hướng Mượt Mà (Quick Navigation):**
     - Tại banner cảnh báo `isLockedByRealm` ở cột trái `PhysiqueModal` và `SoulHubModal`, tích hợp nút bấm phong cách cổ phong:
       - Nếu `canBreakthroughMainRealm` (đã đủ Tu Vi và Linh Thạch đột phá bản thể): Nút `⚡ Đột Phá Bản Thể Ngay` với viền phát quang nhấp nháy (`animate-pulse`).
       - Nếu chưa đủ điều kiện: Nút `🧘 Đi Bế Quan Thổ Nạp`.
     - Cơ chế tương tác: Tự động đóng modal (`onClose()`), kích hoạt `scrollToElementWithHighlight` cuộn mượt đến `#breakthrough-panel` hoặc `#cultivation-panel` ở Cột Giữa (`MiddleColumn`), bao phủ hiệu ứng hào quang (`ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]`) trong 1.5 giây để dẫn dắt thị giác.
  2. **Ma Trận Khóa Tứ Đại Bách Nghệ (`lib/artisan-lock-logic.ts`):**
     - Phàm Nhân & Luyện Khí (0–10) ➔ Trần Tier 1: Chỉ chế tác Đan/Khí/Trận/Phù Nhất Giai; Danh xưng Nhất Giai Học Đồ.
     - Trúc Cơ (11–15) ➔ Trần Tier 2: Tối đa Nhị Giai (Bắt đầu dùng Chân Hỏa); Nhị Giai Đại Sư.
     - Kim Đan (16–20) ➔ Trần Tier 3: Tối đa Tam Giai (Đan Hỏa ngưng tụ); Tam Giai Tông Sư.
     - Nguyên Anh (21–25) ➔ Trần Tier 4: Tối đa Tứ Giai (Thần thức nhập vi); Tứ Giai Đại Tông Sư.
     - Hóa Thần (26–30) ➔ Trần Tier 5: Tối đa Ngũ Giai (Dung nhập thiên địa quy tắc); Ngũ Giai Thái Đẩu.
     - Luyện Hư (31–35) ➔ Trần Tier 6: Tối đa Lục Giai (Tru Tiên Kiếm Trận...); Lục Giai Thánh Thủ.
     - Hợp Thể (36–40) ➔ Trần Tier 7: Tối đa Thất Giai; Thất Giai Chuẩn Tiên Sư.
     - Đại Thừa – Độ Kiếp (41–50) ➔ Trần Tier 8: Tối đa Bát Giai; Bát Giai Tiên Thiên Đạo Sư.
     - Tiên Giới – Đế Cảnh (51–104) ➔ Mở khóa toàn diện Tier 9 (Cửu Giai / Thần Giai).
  3. **Cơ Chế Khóa Kép Toàn Diện (Dual-Lock System):**
     - **Khóa Chế Tác (Crafting Tier Lock):**
       - Đan Đạo (`AlchemyTab.tsx`, `useCraftingActions.ts`): Chặn luyện đan vượt trần tu vi, badge đỏ `🔒 Cần đạt [Cảnh Giới] để chế tác`, nút đổi sang `🔒 Tu Vi Chưa Đạt`.
       - Khí Đạo (`ForgingTab.tsx`, `forging-logic.ts`, `useCraftingActions.ts`): Chặn rèn trang bị cao giai; khóa đục Lỗ thứ 3 (yêu cầu Kim Đan Kỳ) và Lỗ thứ 4 (yêu cầu Nguyên Anh Kỳ); chặn tẩy luyện Cổ Bảo / Tiên Thiên khi chưa đủ tu vi.
       - Trận Đạo (`FormationTab.tsx`, `formation-logic.ts`): Chặn khắc ấn Trận Bàn Tam Giai+ khi chưa đạt Kim Đan, Lục Giai khi chưa đạt Luyện Hư; nút chuyển `🔒 Tu Vi Chưa Đạt`.
       - Phù Đạo (`TalismanTab.tsx`, `talisman-logic.ts`): Chặn họa bùa Tam Giai+ khi chưa đủ Chân Hỏa / Thần Thức cảnh giới cao.
       - Hành vi khi click nút bị khóa: Bắn toast chuẩn chỉ `"Đạo hữu cảnh giới chưa đủ, không thể khống chế thiên địa linh khí để chế tác vật phẩm giai vị này!"`.
     - **Khóa Đột Phá Danh Xưng Nghề (Rank Upgrade Lock):**
       - Khi EXP nghề nghiệp tích lũy đầy (`artisan.exp >= artisan.maxExp`), nếu cấp bậc tiếp theo vượt quá trần Khí Tu: Giữ nguyên mức EXP đầy, không tự động thăng cấp.
       - Hiển thị badge: `🔒 Đạo nghiệp chạm trần (Cần đạt [Cảnh Giới Yêu Cầu] để thăng giai)`.
       - Triệt tiêu thông báo chấm đỏ (notification badge) khi đang bị khóa trần tu vi (`hasFormationNotification`, `addArtisanExp`, `addFormationExp`, `addTalismanArtisanExp`).
- **Danh sách File Tạo Mới & Sửa Đổi (Files Touched):**
  - `lib/navigation-utils.ts`: *(Tạo mới)* Cung cấp helper `scrollToElementWithHighlight(elementId)` cuộn mượt và phát sáng 1.5s.
  - `lib/artisan-lock-logic.ts`: *(Tạo mới)* Cung cấp `getMaxArtisanTierForRealm`, `getRequiredRealmNameForArtisanTier`, `parseGradeToTier`, `checkArtisanCraftRequirement`, `checkArtisanPromotionRequirement`.
  - `components/dashboard/MiddleColumn.tsx`: *(Sửa đổi)* Gán `id="cultivation-panel"` và `id="breakthrough-panel"`, re-export navigation helper.
  - `components/physique/PhysiqueModal.tsx`: *(Sửa đổi)* Bổ sung nút Quick Navigation `⚡ Đột Phá Bản Thể Ngay` / `🧘 Đi Bế Quan Thổ Nạp` trong banner `isLockedByRealm`.
  - `components/soul/SoulHubModal.tsx`: *(Sửa đổi)* Bổ sung nút Quick Navigation trong banner `isLockedByRealm`.
  - `lib/inventory-data.ts`: *(Sửa đổi)* Nâng cấp `addArtisanExp` nhận `realmIndex` và chặn thăng cấp khi bị trần tu vi khóa.
  - `hooks/useCraftingActions.ts`: *(Sửa đổi)* Thêm guard check cho `handleCraftPill`, `handleForgeEquip`, truyền `player.currentRealm` vào `addArtisanExp`.
  - `components/tabs/AlchemyTab.tsx`: *(Sửa đổi)* Tích hợp badge cảnh báo, trạng thái nút `🔒 Tu Vi Chưa Đạt`, banner thăng cấp bị khóa.
  - `lib/forging-logic.ts`: *(Sửa đổi)* Khóa đục lỗ thứ 3 (Kim Đan), thứ 4 (Nguyên Anh), khóa tẩy luyện Cổ Bảo / Tiên Thiên theo tu vi.
  - `components/tabs/ForgingTab.tsx`: *(Sửa đổi)* Tích hợp badge cảnh báo, trạng thái nút đúc trang bị, banner thăng cấp bị khóa.
  - `lib/formation-logic.ts`: *(Sửa đổi)* Tích hợp kiểm tra cảnh giới vào `canCraftFormation` và chặn thăng cấp trong `addFormationExp`.
  - `hooks/useFormationActions.ts`: *(Sửa đổi)* Triệt tiêu chấm đỏ `hasFormationNotification` khi bị khóa trần tu vi.
  - `components/tabs/FormationTab.tsx`: *(Sửa đổi)* Tích hợp badge cảnh báo theo trận đồ, nút khóa khắc ấn, banner thăng cấp bị khóa.
  - `lib/talisman-logic.ts`: *(Sửa đổi)* Tích hợp kiểm tra cảnh giới vào `canCraftTalisman` và chặn thăng cấp trong `addTalismanArtisanExp`.
  - `components/tabs/TalismanTab.tsx`: *(Sửa đổi)* Tích hợp badge cảnh báo, nút khóa họa phù, banner thăng cấp bị khóa.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: Đạt chính xác **0 lỗi (Exit code 0)**.
  - `npm run build`: Compile thành công qua Next.js Turbopack trong 4.1s, 8/8 routes pass (Exit code 0).
  - Tương thích ngược: Bảo toàn nguyên vẹn 100% dữ liệu save cũ và vật phẩm đã sở hữu; chỉ áp dụng khi chế tác hoặc thăng cấp mới.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Hệ thống bách nghệ đã liên kết chặt chẽ với đại cảnh giới tu vi, đảm bảo trải nghiệm nhập vai tiên hiệp chân thực và logic game vững chắc.

### [2026-10-02 06:45] - Triển Khai Cơ Chế Khóa Cảnh Giới Nhục Thân (Thể Tu) & Thần Hồn (Hồn Tu) Theo Tu Vi Bản Thể (Khí Tu)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, người chơi có thể farm tinh huyết hoặc tĩnh tọa để đột phá cảnh giới Nhục Thân và Thần Hồn lên cấp cao (như Bất Diệt Kim Thân, Nguyên Thần) ngay khi Tu Vi bản thể vẫn ở mức Phàm Nhân hoặc Luyện Khí Kỳ. Điều này vi phạm định luật tu tiên kinh điển: *Bản thể kinh mạch/thức hải chưa đủ thâm sâu thì không thể dung nạp nhục thân bất hoại hay thần niệm viễn cổ*, đồng thời phá vỡ cân bằng tiến trình game.
  - Cần thiết lập Ma Trận Ràng Buộc Cảnh Giới (Realm Lock Matrix) liên kết chặt chẽ `player.currentRealm` với 10 Đại Cảnh Giới Nhục Thân (`PHYSIQUE_REALMS`) và 10 Cảnh Giới Thần Hồn (`SOUL_REALMS`), khóa nút phá cảnh sang đại cảnh giới tiếp theo nếu bản thể chưa đạt yêu cầu.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  1. **Ma Trận Ràng Buộc Cảnh Giới (Realm Lock Matrix):**
     - Phàm Nhân (0) ➔ Khóa trần Tier 1: Phàm Thai / Phàm Hồn.
     - Luyện Khí (1-10) ➔ Khóa trần Tier 2: Đồng Bì Thiết Cốt / Ngưng Thần.
     - Trúc Cơ (11-15) ➔ Khóa trần Tier 3: Ngọc Nhũ Huyết / Dục Thần.
     - Kim Đan (16-20) ➔ Khóa trần Tier 4: Tinh Thể Chân Nhân / Hóa Thần.
     - Nguyên Anh (21-25) ➔ Khóa trần Tier 5: Vạn Tượng Lực / Du Thần.
     - Hóa Thần (26-30) ➔ Khóa trần Tier 6: Kim Cang Bất Hoại / Nguyên Thần.
     - Luyện Hư (31-35) ➔ Khóa trần Tier 7: Đạo Thể Sơ Thành / Phân Thần.
     - Hợp Thể (36-40) ➔ Khóa trần Tier 8: Hư Không Chi Thân / Hợp Đạo Chân Linh.
     - Đại Thừa – Độ Kiếp (41-50) ➔ Khóa trần Tier 9: Thánh Thể Viễn Cổ / Bất Hủ Thần Hồn.
     - Tiên Giới – Đế Cảnh (51-104) ➔ Mở khóa tối thượng Tier 10: Bất Diệt Tiên Thể / Hỗn Độn Thần Niệm.
  2. **Tầng Dữ Liệu & Pure Logic (`lib/physique-system-data.ts`, `lib/physique-logic.ts`, `lib/soul-data.ts`, `lib/soul-logic.ts`):**
     - Xây dựng `getMaxPhysiqueTierForRealm(cultivationRealmIndex)` và `getRequiredRealmNameForPhysiqueTier(targetPhysiqueTier)`.
     - Xây dựng `getMaxSoulTierForRealm(cultivationRealmIndex)` và `getRequiredRealmNameForSoulTier(targetSoulTier)`.
     - Nâng cấp `canBreakthroughPhysiqueRealm`: kiểm tra `targetTierIndex > maxAllowedTier`, trả về `isLockedByRealm: true`, `requiredRealmName` và `reason: "Bản thể chưa đạt [Cảnh Giới], kinh mạch chưa đủ cường độ dung nạp thể phách cấp cao!"`.
     - Nâng cấp `canBreakthroughSoulRealm`: kiểm tra `targetTierIndex > maxAllowedTier`, trả về `isLockedByRealm: true`, `requiredRealmName` và `reason: "Thức hải chưa đạt [Cảnh Giới], thần niệm quá tải sẽ gây nứt vỡ hồn phách!"`.
     - Nâng cấp `breakthroughPhysiqueRealm` và `breakthroughSoulRealm` chặn đứng hành vi bypass logic.
  3. **Tầng Custom Domain Hooks (`hooks/usePhysiqueActions.ts`, `hooks/useSoulActions.ts`):**
     - Đọc kiểm tra `canBreakthrough` trước khi gửi lệnh thực thi, bắn toast cảnh báo chi tiết nếu vi phạm.
     - Tối ưu `hasPhysiqueNotification` và `hasSoulNotification`: Triệt tiêu hoàn toàn chấm đỏ thông báo khi người chơi đã đạt 9/9 viên mãn nhưng đang bị trần tu vi bản thể khóa.
  4. **Tầng Giao Diện UI/UX (`PhysiqueModal.tsx`, `SoulHubModal.tsx`):**
     - Bổ sung Badge cảnh báo viền đỏ/hổ phách: `🔒 Giới Hạn Bản Thể: Yêu cầu đạt [Cảnh Giới Yêu Cầu] mới có thể phá cảnh` / `🔒 Thức Hải Chưa Mở: Cần đạt [Cảnh Giới Yêu Cầu] để ngưng tụ Thần Hồn bậc tiếp theo`.
     - Nút phá cảnh bị khóa cứng: `disabled={isLockedByRealm || !canBreakthrough}`, chuyển text sang `🔒 Bị Phong Ấn (Cần [Cảnh Giới Yêu Cầu])`, chuyển icon sang `Lock`, hiệu ứng xám mờ chống click.
- **Danh sách File Tạo Mới & Sửa Đổi (Files Touched):**
  - `lib/physique-system-data.ts`: *(Sửa đổi)* Bổ sung `getMaxPhysiqueTierForRealm` và `getRequiredRealmNameForPhysiqueTier`.
  - `lib/physique-logic.ts`: *(Sửa đổi)* Tích hợp kiểm tra trần tu vi bản thể vào `canBreakthroughPhysiqueRealm` và re-export helpers.
  - `lib/soul-data.ts`: *(Sửa đổi)* Bổ sung `getMaxSoulTierForRealm` và `getRequiredRealmNameForSoulTier`.
  - `lib/soul-logic.ts`: *(Sửa đổi)* Tích hợp kiểm tra trần tu vi bản thể vào `canBreakthroughSoulRealm` và re-export helpers.
  - `hooks/usePhysiqueActions.ts`: *(Sửa đổi)* Bổ sung guard check trong `handleBreakthroughRealm`, triệt tiêu chấm đỏ notification khi bị khóa.
  - `hooks/useSoulActions.ts`: *(Sửa đổi)* Bổ sung guard check trong `handleSoulBreakthrough`, triệt tiêu chấm đỏ notification khi bị khóa.
  - `components/physique/PhysiqueModal.tsx`: *(Sửa đổi)* Thêm icon `Lock`, badge cảnh báo giới hạn bản thể và trạng thái nút phong ấn.
  - `components/soul/SoulHubModal.tsx`: *(Sửa đổi)* Thêm icon `Lock`, badge cảnh báo thức hải chưa mở và trạng thái nút phong ấn.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi kiểm tra kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js Turbopack trong 3.2s, 8/8 routes pass (Exit code 0).
  - Unit test tsx: Kiểm thử 10/10 mốc cảnh giới mapping chính xác; Phàm Nhân bị chặn khi lên Tier 2, Luyện Khí được phép phá cảnh lên Tier 2 nhưng bị chặn khi lên Tier 3.
  - Tương thích ngược: Bảo toàn nguyên vẹn 100% dữ liệu save cũ, không can thiệp hay xóa bỏ exp/chỉ số người chơi.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Hệ thống vận hành mượt mà, sẵn sàng kết nối thêm các hiệu ứng lôi kiếp thể phách hoặc âm thanh rên xiết khi gân cốt chịu áp lực nếu người chơi cố bấm vào nút phong ấn.

### [2026-10-02 06:30] - Chuyển Đổi report.md Sang README.md Chuẩn Mực & Quy Chuẩn Hóa Kiến Trúc Tài Liệu
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Tài liệu dự án trước đó chủ yếu tập trung trong `report.md` đóng vai trò là living architecture specs, trong khi `README.md` ở gốc repo vẫn là bản mẫu boilerplate mặc định của Next.js (chưa thể hiện được tầm vóc, nghiệp vụ tiên hiệp phong phú và chiều sâu kỹ thuật của dự án).
  - Cần chuyển đổi toàn bộ đặc tả kiến trúc thành tài liệu `README.md` hoàn chỉnh theo chuẩn Senior Architect: bao gồm tổng quan đề tài, sơ đồ kiến trúc ASCII/Mermaid, tech stack chi tiết, danh mục File Catalog phân rã toàn bộ 100+ files mã nguồn, tổng hợp 16 phân hệ cơ chế gameplay, hướng dẫn cài đặt & build, cùng quy chuẩn kiến trúc sạch và nợ kỹ thuật.
  - Đồng thời chuẩn hóa quy trình ghi chép `CHANGELOG.md` theo chuẩn 5 phần bắt buộc để phục vụ việc bảo trì và bàn giao dự án lâu dài.
- **Chi tiết kỹ thuật & Cơ chế Gameplay (What & How):**
  - **Kiến trúc tài liệu hướng ngoại (`README.md`):** Phân tích và cấu trúc hóa toàn bộ hệ thống gameplay từ `report.md` kết hợp mã nguồn thực tế:
    1. Chuẩn hóa 105 cảnh giới tu tiên & 3 tư thế tu luyện bế quan thổ nạp.
    2. Tứ đại thuộc tính & trần động (Dynamic Stat Cap: 100 -> 250 -> 500 -> 1000) cùng 4 mốc đột biến bị động.
    3. Kiềng ba chân tu đạo: Khí Tu (105 cảnh giới), Thể Tu (10 đại cảnh giới x 9 tầng, lục đại bộ vị), Hồn Tu (10 cảnh giới thần hồn, cán cân âm dương, tam đại hồn khí, uy áp thần thức).
    4. Tứ đại bách nghệ (Đan • Khí • Trận • Phù) với cơ chế turn trigger và phù nang xuất chiến.
    5. Bản Mệnh Pháp Bảo & Khí Linh (5 bậc linh trí, 4 bản tính chiến đấu, ôn dưỡng & thôn phệ).
    6. Tuế Nguyệt Bế Quan & hệ thống thọ nguyên theo cảnh giới (100 -> 25,550 năm, vĩnh sinh khi đắc đạo thành tiên, nguy cơ tọa hóa).
    7. Cửu Trọng Thiên Kiếp tương tác thời gian thực 3 pha (Thiên uy ngưng tụ -> Quyết sách khẩn cấp 4s -> Oanh kích).
    8. Thái Cổ Cấm Địa sa bàn sương mù (Fog of War 6x6 & 7x7, hộ thân quang, tầm nhìn thần thức).
    9. Động Thiên Phúc Địa 4 phân khu (Tụ Linh Đạo Đài 10 cấp, Huyền Thiên Dược Viên 12 ô 3 loại đất, Linh Thú Thảo Nguyên sinh phân bón, Tàng Kinh Các & đệ tử bái sư).
    10. Bí Cảnh Roguelite Crawler 5 đại cổ bí cảnh, túi loot tạm thời, rút lui an toàn.
    11. Hệ thống chiến đấu PVE & Trấn Ma Tháp 100 tầng, FCT sát thương bay, thanh máu 2 lớp ghost bar, thân pháp đòn kép & né tránh tự nhiên.
    12. Vạn Bảo Thương Hội (11 sub-tabs, kho 16 trang bị & phôi bản mệnh) & Đấu Giá Hội (AI nâng giá, uy áp thần thức dằn mặt lũy tiến).
    13. Cốt truyện phân nhánh 7 chương hồi (ancient scroll UI).
    14. Đạo Lữ Tiên Duyên (8 đại tiên tử, 4 loại song tu) & Linh Thú Tiên Gia (tiến hóa, tọa kỵ).
    15. Hệ thống âm thanh procedural Web Audio API (Solfeggio, Kellet noise, compressor limiter) & Hoạt họa zero-asset SVG CSS.
    16. Cơ chế lưu trữ & tự phục hồi (Debounce 1.0s, migrations v1-v7, self-healing cảnh giới hỏng).
  - **Lập Bảng Danh Mục File Catalog:** Rà soát toàn bộ thư mục dự án và lập bảng chi tiết cho từng file trong `app/`, `components/dashboard/`, `components/dashboard/left/`, `components/tabs/`, `components/modals/`, `components/abode/`, `components/soul/`, `components/physique/`, `components/realm/`, `components/battle/`, `hooks/`, `lib/game-logic/`, `lib/`, `lib/types/`, `data/`, `scripts/` kèm clickable markdown links.
- **Danh sách File Tạo Mới & Sửa Đổi (Files Touched):**
  - `README.md`: *(Tạo mới / Thay thế)* Toàn bộ nội dung tài liệu chuẩn mực mở rộng cho dự án.
  - `CHANGELOG.md`: *(Sửa đổi)* Bổ sung bản ghi chuẩn hóa theo cấu trúc Senior Tech Lead & Release Manager.
- **Kết Quả Kiểm Thử & Tính Ổn Định (Verification & Health Check):**
  - `npx tsc --noEmit`: 0 lỗi biên dịch kiểu dữ liệu (Exit code 0).
  - `npm run build`: Compile thành công qua Next.js 16.3.5 Turbopack trong 13.4s (Exit code 0), tất cả 8 routes tĩnh và động đều pass.
  - Tương thích ngược: Bảo toàn nguyên vẹn 100% schema và cơ chế save migration `v1` đến `v7`.
- **Ghi chú bàn giao & Việc cần làm tiếp theo (Next Steps):**
  - Duy trì cập nhật song hành `README.md` (khi có thay đổi cấu trúc thư mục hoặc cơ chế lớn) và `CHANGELOG.md` (sau mỗi phiên code/fix bug theo quy trình Workflow Part 3).
  - Lộ trình dài hạn: Thiết kế Backend Authentication & Cloud Save (Supabase/PostgreSQL) khi mở rộng tính năng đấu pháp liên server hoặc bảng xếp hạng thiên kiêu.
