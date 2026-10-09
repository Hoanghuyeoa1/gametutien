# 📜 GAMETUTIEN • NHẬT KÝ PHÁT TRIỂN: GIAI ĐOẠN 4 - TINH HẢI & THƯƠNG HỘI ĐỈNH CAO

> **Đường dẫn liên kết:** [⬅️ Quay lại Master Changelog](../../CHANGELOG.md) | [📖 Tài liệu kiến trúc README.md](../../README.md)
> **Thời gian:** 2026-10-02 16:10 → 2026-10-02 18:15 | **Tổng số bản ghi:** 3 bản ghi kỹ thuật
> **Phạm vi trọng tâm:** Phân hệ Vực Ngoại Dị Tộc Tập Kích & Cứ Điểm Tinh Hải (Cosmic Invasions & Star Fortification), Ký Gửi Đấu Giá & Thao Túng Phường Thị (Player Auction Consignment & Market Manipulation), Tab Tu Luyện & Dị Bảo Trợ Tu Cửu Giai trong Vạn Bảo Thương Hội (Cultivation Items & Catalysts Tier 1 -> Tier 9).

---

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
