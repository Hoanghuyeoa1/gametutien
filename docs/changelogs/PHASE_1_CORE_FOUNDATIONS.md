# 📜 GAMETUTIEN • NHẬT KÝ PHÁT TRIỂN: GIAI ĐOẠN 1 - NỀN TẢNG KHỞI THỦY & CỐT LÕI ROGUELITE

> **Đường dẫn liên kết:** [⬅️ Quay lại Master Changelog](../../CHANGELOG.md) | [📖 Tài liệu kiến trúc README.md](../../README.md)
> **Thời gian:** 2026-09-28 → 2026-09-29 | **Tổng số bản ghi:** 43 bản ghi kỹ thuật
> **Phạm vi trọng tâm:** Khởi tạo kiến trúc dự án Next.js 16 App Router, Clean Architecture, 105 Cảnh giới tu tiên chuẩn hóa, Thể Tu & Hồn Tu, Động Thiên Phúc Địa, Tứ Đại Bách Nghệ (Đan • Khí • Trận • Phù), Bí Cảnh Roguelite Crawler, Cốt truyện Chương I-VII, Bản Mệnh Pháp Bảo, Đấu Giá Hội sơ khởi, và hệ thống tự phục hồi dữ liệu.

---

### [2026-09-29 17:50] - Mở Rộng Toàn Diện Vạn Bảo Thương Hội: Bổ Sung Danh Mục "⚔️ Pháp Bảo & Trang Bị" & Kho 16 Phôi Bản Mệnh - Dị Bảo Thái Cổ
- **Mục tiêu:** Giải quyết lỗ hổng kinh tế khi Thương Hội vắng bóng vũ khí/trang bị, cung cấp kênh tiêu thụ Linh Thạch quan trọng cho tu sĩ mua sắm trang bị trực tiếp khi chưa đủ cấp độ Luyện Khí Sư, đồng thời cung cấp nguồn "Pháp Bảo Phôi Thô / Dị Bảo Thái Cổ" đạt chuẩn Cực Phẩm/Tuyệt Phẩm/Tiên Phẩm để phục vụ tính năng **Tế Luyện Bản Mệnh Pháp Bảo & Đánh Thức Khí Linh**.
- **Chi tiết kỹ thuật & Cơ chế Gameplay:**
  1. **Mở Rộng Kiểu Dữ Liệu (`lib/types/items.ts`):**
     - Mở rộng union type `MerchantCategory` bổ sung `'equipment'`.
     - Bổ sung `equipmentType?: 'weapon' | 'armor' | 'accessory' | 'artifact'` và `equipmentData?: { type; slot; tier; grade; baseStats; affixes; sockets; isNatalCandidate }` vào `MerchantItem`.
  2. **Kho 16 Trang Bị - Dị Bảo Thái Cổ Chuẩn 5 Đại Cảnh Giới (`lib/merchant-data.ts`):**
     - *Nhất Giai (Luyện Khí Kỳ | 500 – 1,500 LT):* Thanh Phong Kiếm (Hạ Phẩm • Kiếm, +25 ATK, +3% Speed), Huyền Thiết Đạo Bào (Hạ Phẩm • Giáp, +150 HP, +15 DEF), Thanh Ngọc Giới Chỉ (Trung Phẩm • Linh Bảo, +80 MP, +5% Kháng Phép).
     - *Nhị Giai (Trúc Cơ Kỳ | 3,000 – 12,000 LT):* Xích Viêm Phi Kiếm (Trung Phẩm • Kiếm, +80 ATK, +5% Hỏa dmg), Băng Tằm Linh Y (Thượng Phẩm • Giáp, +450 HP, +45 DEF, -5% Miễn thương), Tụ Linh Ngọc Bội (Thượng Phẩm • Linh Bảo, +200 MP, +10% Tốc độ tu vi offline), **U Tinh Kiếm Phôi** (Cực Phẩm • **Phôi Bản Mệnh Sát Phạt** - 12,000 LT).
     - *Tam Giai (Kim Đan Kỳ | 15,000 – 40,000 LT):* Trảm Yêu Trọng Đao (Thượng Phẩm • Đao, +220 ATK, +8% Crit), Cửu Hóa Long Lân Giáp (Cực Phẩm • Giáp, +1,200 HP, +120 DEF, +5% Bền bỉ), Thái Hư Huyễn Linh Giới (Cực Phẩm • Linh Bảo, +500 MP, +20 Speed, mở thêm ô trang bị), **Bát Quái Hộ Tâm Kính** (Cực Phẩm • **Phôi Bản Mệnh Thủ Hộ** - 40,000 LT).
     - *Tứ Giai (Nguyên Anh Kỳ | 50,000 – 120,000 LT):* Thái Ất Tru Tiên Kiếm (Tuyệt Phẩm • Kiếm, +550 ATK, +15% Crit Dmg), Huyền Vũ Trấn Nhục Giáp (Tuyệt Phẩm • Giáp, +3,000 HP, +320 DEF, -10% Miễn thương), Thất Bảo Lưu Ly Xoán (Tuyệt Phẩm • Linh Bảo, +1,200 MP, +35 Speed, hồi 3% MP/hiệp), **Cửu Tiêu Lôi Thần Cầm** (Tuyệt Phẩm • **Phôi Bản Mệnh Cơ Xảo** - 120,000 LT).
     - *Ngũ Giai (Hóa Thần Kỳ | 300,000 LT • Độc Bản):* **Hỗn Độn Khai Thiên Đỉnh** (Tiên Phẩm • **Phôi Bản Mệnh Tối Thượng Tịnh Hóa** - 300,000 LT): 3 lỗ khảm sẵn, +2,500 HP, +400 MP, +180 DEF, -15% Miễn thương; mang cờ `oneTimeOnly: true`, tích hợp cơ chế khóa vĩnh viễn hiển thị `[Đã Sở Hữu]`.
  3. **Xử Lý Mua Hàng & Nạp Trực Tiếp Kho Đồ (`hooks/useMerchantInventoryActions.ts`):**
     - Khởi tạo thực thể `Equipment` hoàn chỉnh: ID ngẫu nhiên `eq_${Date.now()}_${Math.random()}`, `slot`, `type`, `quality`, `powerBonus`, `baseStats`, `sockets`, `affixes: EquipmentAffix[]`, `durability: 100`, `isNatalCandidate`.
     - Đẩy thẳng vào mảng `player.inventory.equipments`.
     - Nhật ký cổ phong ghi nhận: `"Chi [X] Linh Thạch sở hữu pháp bảo [Tên] ([Phẩm Cấp]), cất vào Túi Trữ Vật!"`.
     - Mở tab **Thần Binh Các ➔ Bản Mệnh** để phong làm Bản Mệnh Pháp Bảo tức thì.
  4. **Nâng Cấp Giao Diện Cổ Phong (`components/tabs/MerchantTab.tsx`):**
     - Mở rộng thanh sub-tabs lên **11 danh mục**: `✨ Toàn Bộ` | `⚡ Tu Luyện` | `🧘 Công Pháp` | `📜 Thần Thông` | `🌿 Dược Thảo` | `⚔️ Trang Bị` | `🌸 Đạo Lữ` | `🐾 Linh Thú` | `🎒 Trữ Vật` | `♻️ Thu Mua` | `💰 Tệ Điếm`.
     - 4 Huy hiệu phân loại cổ phong: `⚔️ Vũ Khí` (đỏ), `🛡️ Phòng Cụ` (lam), `📿 Linh Bảo` (ngọc bích), `🗡️ Phôi Bản Mệnh` (hổ phách kim quang nhấp nháy `animate-pulse`).
     - Tích hợp hàng Mini Stats Tags hiển thị các chỉ số cơ bản (+Công, +Thủ, +HP, +MP, +Tốc, +Bạo, +Bạo Thương, +Miễn thương, Khảm lỗ) trực quan ngay trên thẻ sản phẩm.
  5. **Tương Thích Dữ Liệu Lưu Trữ (`lib/save-migration.ts`):**
     - Bổ sung cơ chế quét nạp tự động 16 mặt hàng trang bị mới vào `merchantState.items` của các bản save cũ mà không làm suy chuyển Linh Thạch hay vật phẩm người chơi đã sở hữu.
- **Kiểm thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Turbopack build thành công (Exit code 0).
  - Unit test logic script: Đạt chuẩn 16/16 món, 4/4 phôi bản mệnh, logic độc bản và save migration 100% chính xác.

### [2026-09-29 17:40] - Khắc Phục Triệt Để Lỗi 2 Thanh Cuộn & Chuẩn Hóa Layout Tab Trữ Vật (Inventory Double Scrollbars Elimination)
- **Mục tiêu:** Xử lý dứt điểm lỗi double scrollbar (thanh cuộn kép lồng nhau giữa container Cột Phải và danh sách vật phẩm trong `InventoryTab.tsx`), loại bỏ hiện tượng giật rung và kẹt chuột (scroll trapping), chuẩn hóa theo mô hình Sticky Header + Single Scrollable Grid (Flexbox Viewport Lock).
- **Chi tiết kỹ thuật & Layout:**
  1. **Khắc Phục Container Cột Phải (`components/GameDashboard.tsx`):**
     - Mở rộng điều kiện bọc nội dung tab: `activeTab === 'merchant' || activeTab === 'inventory'` được gán `overflow-hidden flex flex-col min-h-0`.
     - Ngăn chặn hoàn toàn container cha của Cột Phải sinh thêm thanh cuộn ngoài không mong muốn khi người chơi duyệt Túi Đồ.
  2. **Chuẩn Hóa Cấu Trúc Layout `components/tabs/InventoryTab.tsx`:**
     - Khung gốc của Tab: `flex flex-col h-full min-h-0 overflow-hidden`.
     - **Vùng 1 - Sticky Header & Toolbar (Cố định, không cuộn):**
       - Banner Túi Trữ Vật & Dung tích (usedSlots / maxSlots, progress bar cảnh báo).
       - Thanh công cụ thao tác nhanh: `Sắp Xếp`, `Thanh Lý Dược Khoáng`, `Đổi Túi Mới` và nút toggle `💰 Tệ Điếm [▼ / ▲]`.
       - Hối Đoái Linh Thạch 5 cấp bậc có thể thu gọn/mở rộng linh hoạt để tiết kiệm 130px chiều cao cho lưới đồ.
       - Sub-tabs phân loại (Tất Cả, Đan, Dược, Khoáng, Pháp Bảo, Bí Tịch, Sách, Túi).
       - Bổ sung ô Tìm Kiếm nhanh (`Search` input với live filtering và nút `X` xóa từ khóa).
     - **Vùng 2 - Item Grid (Duy nhất 1 vùng cuộn):**
       - Xóa bỏ hoàn toàn thuộc tính thừa `max-h-[440px]` và các `overflow-y-auto` lồng nhau.
       - Chuyển sang `flex-1 min-h-0 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-zinc-700/60 hover:scrollbar-thumb-amber-600/60 scrollbar-track-transparent custom-scrollbar space-y-2 pt-1 pb-4`.
       - Lọc theo từ khóa tìm kiếm và danh mục đồng thời, hỗ trợ hiển thị Empty State thông minh khi không có kết quả tìm kiếm.
- **Kiểm thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Turbopack build thành công (Exit code 0).

### [2026-09-29 17:30] - Cân Bằng Toàn Diện Hệ Thống "Đấu Giá Thiên Cổ (Auction Rebalance & Soul Pressure Overhaul)"
- **Mục tiêu:** Khắc phục triệt để lỗi logic "Dằn Mặt" (Uy áp Thần Thức bị vô hiệu hóa khi người chơi dằn mặt 3-4 lần NPC vẫn bám đuổi trả giá) và tình trạng lạm phát giá phi lý (NPC có ngân sách vô tận đẩy giá gấp 1.65+ lần giá thị trường khiến người chơi vừa đột phá bị ép giá vô lý).
- **Chi tiết cơ chế Gameplay & Thuật Toán Cân Bằng:**
  1. **Tái Cấu Trúc Thuật Toán "Dằn Mặt / Uy Áp Thần Thức" (`attemptSoulIntimidation`):**
     - Tính chênh lệch Thần Thức: `diff = playerThanThuc - targetThanThuc`.
     - Lưu vết `intimidateCount` độc lập cho từng NPC trong suốt phiên đấu giá.
     - **Khi `diff >= 0` (Thần Thức người chơi ngang bằng hoặc cao hơn):**
       - *Lần 1 dằn mặt:* 45% tỷ lệ NPC lập tức bỏ cuộc (`status: 'withdrawn'`). Nếu chưa bỏ cuộc, giảm ngay 25% ngân sách tối đa còn lại của NPC đó (`intimidateStatusText: '😰 Kinh Hãi (Ngân sách -25%)'`).
       - *Lần 2 dằn mặt:* 75% tỷ lệ NPC lập tức bỏ cuộc. Nếu chưa bỏ cuộc, giảm tiếp 30% ngân sách còn lại (`intimidateStatusText: '😨 Hồn Phi Phách Tán (Ngân sách -30%)'`).
       - *Lần 3 dằn mặt trở lên:* **CHẮC CHẮN 100% NPC BẮT BUỘC RÚT LUI BỎ CUỘC NGAY LẬP TỨC!** Kèm chiến báo: `💥 Nhận thấy Thần Thức uy áp như núi non đè ép (Lần 3), [Tên NPC] sợ hãi toát mồ hôi lạnh, chắp tay tuyên bố rút lui khỏi cuộc đấu giá!`.
     - **Khi `diff < 0` (Thần Thức người chơi thấp hơn):**
       - Tỷ lệ rút lui lũy tiến: Lần 1 (20%), Lần 2 (45%), Lần 3 (75%).
       - Loại bỏ hoàn toàn lỗi tăng ngân sách NPC khi dằn mặt thất bại.
     - **Giảm Ham Muốn Nâng Giá (Will Bid Penalty):** Mỗi tầng dằn mặt tích lũy làm giảm 50% tỷ lệ NPC tham gia lượt gõ búa tiếp theo (`willBidChance *= Math.pow(0.5, npc.intimidateCount)`).
  2. **Thiết Lập Trần Ngân Sách (Hard Cap) Chuẩn Theo Thân Phận NPC (`calculateNpcBudgetForLot`):**
     - Ngân sách NPC không còn nhân theo hệ số cảnh giới vô tận, mà luôn neo chặt vào Giá Thị Trường Ước Tính (`reservePrice`) của từng lô đấu giá:
       - **Tán Tu (Lâm Viêm, U Minh, Độc Cô Nhất Kiếm):** Ngân sách tối đa **1.05x - 1.15x** `reservePrice` (Lô 95k LT thì Lâm Viêm tối đa chỉ có ~105k - 109k LT, triệt tiêu hoàn toàn lỗi lên tới 157k LT).
       - **Thiếu Chủ Thế Gia (Vương Đằng, Huyết Nguyệt):** Ngân sách tối đa **1.15x - 1.25x** `reservePrice`.
       - **Trưởng Lão Tông Môn (Cổ Phong, Mộc Diệp):** Ngân sách tối đa **1.20x - 1.30x** `reservePrice`.
       - **Thương Hội / Cự Phú (Yên Nhiên Tiên Tử):** Ngân sách tối đa **1.30x - 1.35x** `reservePrice`.
     - **Cơ chế Ngắt Bỏ Cuộc Theo Ngưỡng Giá Thị Trường:**
       - Vượt 100% giá ước tính: 40% tỷ lệ NPC bỏ cuộc sau mỗi lượt búa.
       - Vượt 115% giá ước tính: 75% tỷ lệ NPC bỏ cuộc.
       - Vượt 125% giá ước tính: 95% tỷ lệ NPC bỏ cuộc.
       - Đạt hoặc vượt trần ngân sách `budgetCeiling`: 100% NPC rút lui ngay lập tức.
  3. **Cân Bằng Riêng Cho "Đấu Giá Mừng Đột Phá" (`isBreakthroughEvent`):**
     - Tự động nhận diện sự kiện đột phá từ `customTitle` ("mừng", "đột phá", "phá cảnh") hoặc cờ `isBreakthroughEvent: true`.
     - Giảm thêm 15% trần ngân sách của tất cả đối thủ máy.
     - Đảm bảo người chơi vừa phá cảnh có đủ số Linh Thạch tích lũy để cạnh tranh công bằng.
  4. **Nâng Cấp Giao Diện & Trải Nghiệm Người Dùng (`AuctionModal.tsx`):**
     - Hiển thị nhãn trạng thái phản ứng trực quan trên thẻ từng NPC: `😰 Kinh Hãi (Ngân sách -25%)`, `😨 Hồn Phi Phách Tán (Ngân sách -30%)`, `✕ Đã Rút Lui (Bị Thần Thức Áp Chế)`.
     - Chuyển thẻ đối thủ sang hiệu ứng xám mờ (grayscale + opacity) khi đã rút lui.
     - Hiển thị rõ số lần dằn mặt và tỷ lệ uy áp trên nút dằn mặt: `(Lần 1/3 - 45%)`, `(Lần 2/3 - 75%)`, `💥 Dằn Mặt (100% Rút Lui)`.
     - Nút Dằn Mặt ở Footer tự động nhận diện và khóa mục tiêu vào NPC đang dẫn đầu cuộc đua giá (`leadingNpc`).
- **Files sửa đổi:**
  - `lib/types/auction.ts`: Thêm `roleType`, `intimidateCount`, `intimidateStatusText`, `originalBudget`, `budgetCeiling`, `isBreakthroughEvent`.
  - `lib/auction-data.ts`: Phân loại 4 nhóm thân phận chuẩn cho 8 NPC mẫu.
  - `lib/auction-logic.ts`: Hàm tính ngân sách hard-cap theo thân phận, thuật toán dằn mặt lũy tiến (lần 3 chắc chắn 100% bỏ cuộc), ngắt giá theo ngưỡng thị trường và giảm 50% ham muốn trả giá.
  - `hooks/useAuctionActions.ts`: Truyền `leadingNpcId` cho nút áp chế toàn trường, làm mới ngân sách NPC theo từng lô đấu giá.
  - `components/modals/AuctionModal.tsx`: Giao diện phản ứng dằn mặt trực quan, nhãn rung lắc, xám mờ khi rút lui, nút footer thông minh.
  - `components/GameDashboard.tsx`: Bật cờ `isBreakthroughEvent: true` khi mở đấu giá mừng đại đạo đột phá.
- **Kiểm thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Turbopack compile thành công 100% (Exit code 0).

### [2026-09-29 17:15] - Triển Khai Hệ Thống "Bản Mệnh Pháp Bảo & Bồi Dưỡng Khí Linh (Natal Artifact & Spirit Sentience Awakening)"
- **Mục tiêu:** Nâng cấp Thần Binh Các từ hệ thống rèn đúc cơ bản thành phân hệ linh hồn đặc sắc chuẩn tiên hiệp: Thổi hồn vào trang bị qua **Tế Luyện Bản Mệnh** (nhỏ tinh huyết gắn kết tính mạng) và **Đánh Thức Khí Linh** (linh hồn pháp bảo 5 tầng tiến hóa, 4 bản tính chiến đấu, xuất thủ hộ chủ khi nguy cấp, ôn dưỡng chân nguyên & thôn phệ trang bị).
- **Chi tiết cơ chế Gameplay & Cân Bằng:**
  1. **Tế Luyện Bản Mệnh (Natal Binding):**
     - Điều kiện: Cảnh giới Trúc Cơ Kỳ trở lên (Realm >= 11), trang bị thuộc phẩm cấp Cực Phẩm trở lên hoặc Tứ Giai trở lên.
     - Tiêu hao nghi thức: 1 Giọt Bản Mệnh Tinh Huyết (-10% HP tối đa trong 1 giờ), 10 viên Trung Phẩm Linh Thạch, 50 Thần Niệm.
     - Quy tắc duy nhất: Mỗi tu sĩ chỉ được phong 1 Bản Mệnh duy nhất. Hủy khế ước chịu phản phệ tâm mạch nhẹ: mất 20% HP hiện tại và 5% Tu Vi.
     - Cơ chế Cộng Hưởng Cảnh Giới: Bản Mệnh nhận +25% chỉ số cơ bản, mỗi đại cảnh giới đột phá tự động cộng hưởng thêm +5% vĩnh viễn không cần rèn lại.
  2. **Năm Tầng Tiến Hóa Khí Linh (5 Spirit Stages):**
     - *Tầng 1 - Mông Muội (Dormant):* Linh trí sơ khai (+5% Công/Thủ).
     - *Tầng 2 - Thức Tỉnh (Awakened):* Phát quang linh thể (+12% Công/Thủ, +5% Bạo Kích).
     - *Tầng 3 - Thông Tuệ (Intelligent):* Hiểu rõ đạo pháp (+18% Công/Thủ, +10% Tu Vi Tốc, mở khóa kỹ năng hộ chủ).
     - *Tầng 4 - Huyễn Thể (Ethereal Form):* Hiển hóa hư ảnh (+25% Công/Thủ, +10% Miễn Thương).
     - *Tầng 5 - Hóa Hình Chân Thân (Incarnation):* Chiến lực ngang đại năng (+35% Công/Thủ, +15% Bạo Kích, +15% Miễn Thương).
  3. **Bốn Đại Bản Tính & Chiến Kỹ Hộ Chủ Trong Combat:**
     - ⚔️ *Sát Phạt* (`Tru Tiên Trảm Hồn`): Khi Boss dưới 35% HP, phóng 1 kiếm chém thẳng nguyên thần đối thủ gây 250% sát thương chuẩn, câm lặng 1 hiệp.
     - 🛡️ *Thủ Hộ* (`Linh Thể Chắn Kiếp`): Khi máu chủ nhân dưới 25%, hiển hóa màng chắn kim cang hấp thụ 100% sát thương đòn đánh chí mạng kế tiếp và hồi phục 15% HP.
     - ⚡ *Cơ Xảo* (`Huyễn Ảnh Trói Hồn`): Đầu trận đấu (Turn 1), cấm chế giảm 50% Tốc Độ đối thủ, 30% tỷ lệ làm choáng.
     - 🌿 *Tịnh Hóa* (`Hồi Quang Quy Nguyên`): Mỗi 3 hiệp, giải trừ hiệu ứng xấu, hồi phục 20% Khí Huyết & Chân Nguyên.
  4. **Bồi Dưỡng & Thôn Phệ (Nurturing & Devouring):**
     - Ôn Dưỡng Chân Nguyên: Tối đa 3 lần/ngày, tiêu hao 100 MP nhận +120 EXP và +3 Hảo Cảm.
     - Thôn Phệ Vạn Vật: Cho Khí Linh nuốt vũ khí, giáp trụ rác hoặc khoáng thạch trong túi đồ để nhận EXP, kèm 15% cơ hội hấp thu vĩnh viễn dòng thuộc tính của món đồ bị nuốt.
     - Tương Tác Cảm Xúc: Bấm vào Khí Linh để lắng nghe thoại truyền âm thức hải độc quyền theo điểm Hảo Cảm (0 - 100).
- **Files mới tạo:**
  1. `lib/types/natal-artifact.ts`: Định nghĩa `SpiritStage`, `SpiritPersonality`, `ArtifactSpiritSkill`, `ArtifactSpirit`, `NatalArtifact`, `SpiritStageConfig`, `SpiritPersonalityConfig`.
  2. `lib/natal-artifact-data.ts`: Cấu hình 5 bậc linh trí `SPIRIT_STAGES_CONFIG`, 4 bản tính `SPIRIT_PERSONALITIES_CONFIG`, 6 phôi linh viễn cổ `SPIRIT_ARCHETYPES`.
  3. `lib/natal-artifact-logic.ts`: Business logic `canBindEquipmentAsNatal`, `bindEquipmentAsNatal`, `unbindNatalArtifact`, `nourishSpiritWithEnergy`, `devourEquipment`, `devourOre`, `calculateNatalCombatBonus`, `processSpiritCombatTrigger`.
  4. `hooks/useNatalArtifactActions.ts`: Hook quản lý state, hành động tế luyện, ôn dưỡng, thôn phệ, tương tác Khí Linh.
  5. `components/tabs/NatalArtifactView.tsx`: Giao diện cổ phong gồm Tây Dực (Trận Đài Ôn Dưỡng Bản Mệnh), Đông Dực (Thần Điện Khí Linh), Hạ Tầng (Khu Bồi Dưỡng & Thôn Phệ).
- **Files sửa đổi:**
  1. `lib/types/index.ts`: Re-export toàn bộ kiểu từ `natal-artifact.ts`.
  2. `lib/types/player.ts`: Bổ sung `natalArtifact?: NatalArtifact | null;` vào `PlayerStats`.
  3. `lib/destiny-data.ts`: Tích hợp `calculateNatalCombatBonus(player)` vào `calculateCombatStats` gia trì Công, Thủ, Bạo Kích, Miễn Thương.
  4. `lib/boss-trial-data.ts`: Tích hợp `processSpiritCombatTrigger` vào `simulateTurnBasedCombat`, kích hoạt chiến kỹ Khí Linh và cứu nguy đòn chí mạng.
  5. `lib/game-logic/combat.ts`: Tích hợp `processSpiritCombatTrigger` vào `battleBoss` gia tăng uy lực và log chiến báo huyền ảo.
  6. `lib/save-migration.ts`: Bổ sung `natalArtifact: data.natalArtifact ? { ...data.natalArtifact } : null` vào `normalizePlayerData`.
  7. `hooks/useCraftingActions.ts`: Mở rộng `forgingMainTab` hỗ trợ thêm tab `'natal'`.
  8. `components/tabs/ForgingTab.tsx`: Bổ sung tab thứ 4 "🗡️ Bản Mệnh", nhúng `NatalArtifactView`.
  9. `components/GameDashboard.tsx`: Truyền `setPlayer`, `addLog`, `showToast` cho `ForgingTab`.
- **Kiểm thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Turbopack compile thành công 100% (Exit code 0).

### [2026-09-29 16:45] - Triển Khai Hệ Thống "Tuế Nguyệt Bế Quan & Thọ Nguyên (Lifespan & Deep Cultivation)"
- **Mục tiêu:** Khắc phục triệt để tính phi lý của việc tăng tu vi dựa hoàn toàn trên thời gian thực (real-time AFK). Tái hiện chân thực tinh hoa "Tuế Nguyệt Vô Tình, Động Trung Bế Quan Bất Tri Niên" của tiểu thuyết tiên hiệp truyền thống: Đại năng bế quan mất hàng chục, hàng trăm năm; nhân vật có Tuổi Thọ và Thọ Nguyên tối đa; nguy cơ Tọa Hóa khi cạn thọ nguyên; biến việc bế quan trường niên (Time-Skip theo Ngày / Tháng / Năm) thành phương thức chủ đạo để tích lũy tu vi.
- **Chi tiết cơ chế Gameplay & Cân Bằng:**
  1. **Hệ Thống Thọ Nguyên (Lifespan System):**
     - Khởi đầu nhân vật tu tiên ở **16 Tuổi**, Thọ nguyên tối đa Phàm Nhân là **100 Tuổi**.
     - Tăng Thọ Nguyên tối đa theo Đại Cảnh Giới:
       - Phàm Nhân: 100 năm
       - Luyện Khí (Index 1-10): 150 năm (+50)
       - Trúc Cơ (Index 11-15): 250 năm (+100)
       - Kim Đan (Index 16-20): 550 năm (+300)
       - Nguyên Anh (Index 21-25): 1,050 năm (+500)
       - Hóa Thần (Index 26-30): 2,550 năm (+1,500)
       - Luyện Hư (Index 31-35): 5,550 năm (+3,000)
       - Hợp Thể (Index 36-40): 10,550 năm (+5,000)
       - Đại Thừa (Index 41-45): 18,550 năm (+8,000)
       - Độ Kiếp (Index 46-50): 25,550 năm (+7,000)
       - Tiên Giới (Chân Tiên trở lên - Index 51+): 99,999,999 năm (Vĩnh Sinh / Bất Tử).
     - **Nguy Cơ Tọa Hóa & Chặn Bế Quan:** Chặn triệt để không cho phép bế quan nếu số năm bế quan làm tuổi thọ vượt quá Thọ Nguyên tối đa (`isLifespanExceeded`). Cảnh báo khẩn cấp khi thọ nguyên còn dưới 5 năm (`isToaHoaWarning`).
     - **Hệ Thống Thọ Nguyên Đan (4 Phẩm Cấp):**
       - `pill_tho_nguyen_1` (Nhất Giai Duyên Thọ Đan): +50 năm thọ mệnh.
       - `pill_tho_nguyen_2` (Nhị Giai Cố Bản Diên Niên Đan): +100 năm thọ mệnh.
       - `pill_tho_nguyen_3` (Tam Giai Vạn Thọ Vô Cương Đan): +300 năm thọ mệnh.
       - `pill_tho_nguyen_4` (Tứ Giai Bất Lão Trường Sinh Đan): +1,000 năm thọ mệnh.
  2. **Cơ Chế Tuế Nguyệt Bế Quan (Deep Cultivation Input):**
     - Bảng điều khiển tích hợp trực tiếp tại Cột Giữa (`MiddleColumn.tsx`), cho phép chuyển đổi mượt mà giữa 2 chế độ:
       - ⏳ **Tuế Nguyệt**: Nhập số lượng + chọn đơn vị (`Ngày` | `Tháng` [30 ngày] | `Năm` [365 ngày]) kèm các nút chọn nhanh `[30 Ngày]`, `[6 Tháng]`, `[1 Năm]`, `[5 Năm]`, `[10 Năm]`, `[50 Năm]`.
       - ⏱️ **Nhập Định**: Chế độ thiền định theo phút / giờ thực tế.
     - **Quy đổi Tu Vi & Tiêu Hao Tài Nguyên:**
       - 1 Năm bế quan = 365 Ngày in-game = $365 \times 60 \times baseRate$.
       - Tiêu hao duy trì bế quan trường niên: 1 Năm = 100 Linh Thạch HOẶC 1 Tích Cốc Đan (`pill_tich_coc`).
       - Tự động ưu tiên cấn trừ Tích Cốc Đan trước nếu có trong túi, nếu không trừ Linh Thạch.
  3. **Hiển Thị & Giao Diện Cổ Phong:**
     - **Cột Trái (`CharacterIdentityCard.tsx`):** Widget Thọ Nguyên thanh lịch: Hiển thị Tuế Nguyệt `age / maxLifespan`, thanh tiến trình đa sắc đổi màu theo nguy cơ (Xanh ngọc -> Vàng -> Đỏ cảnh báo Tọa Hóa khi < 5 năm, tím cho Vĩnh Sinh).
     - **Cột Giữa (`MiddleColumn.tsx`):** Panel dự toán thời gian thực hiển thị biến đổi tuổi tác (`16 ➔ 26 / 150 Tuổi`), Tu Vi gặt hái dự kiến, trạng thái tài nguyên đủ/thiếu.
- **Files mới tạo:**
  1. **`lib/types/lifespan.ts`**: Định nghĩa `DeepCultivateUnit`, `DeepCultivateInput`, `DeepCultivateEstimate`, `DeepCultivateResult`, `LifespanPill`.
  2. **`lib/lifespan-logic.ts`**: Logic engine `getBaseLifespanForRealm()`, `calculateEffectiveLifespan()`, `calculateDeepCultivationEstimate()`, `executeDeepCultivation()`, `useLifespanPill()`, catalog `LIFESPAN_PILLS`.
- **Files sửa đổi:**
  1. **`lib/types/index.ts`**: Export kiểu dữ liệu từ `lifespan.ts`.
  2. **`lib/types/player.ts`**: Bổ sung `age`, `maxLifespan`, `lifespanPillsUsed`, `isToaHoaWarning` vào `PlayerStats`.
  3. **`lib/game-logic/character.ts`**: Cập nhật `createNewPlayer()` khởi tạo tuổi 16, thọ nguyên 100, cấp sẵn 10 viên Tích Cốc Đan.
  4. **`lib/save-migration.ts`**: Chuẩn hóa dữ liệu save v1-v7 tự động tính tuổi, thọ nguyên chuẩn theo cảnh giới, cấp bù Tích Cốc Đan nếu thiếu.
  5. **`lib/tribulation-logic.ts`**: Cập nhật tự động nâng `maxLifespan` tương ứng với cảnh giới mới khi vượt qua Cửu Trọng Thiên Kiếp.
  6. **`app/api/breakthrough/route.ts`**: Cập nhật tự động nâng `maxLifespan` tương ứng với cảnh giới mới khi đột phá thành công.
  7. **`lib/alchemy-data.ts`**: Bổ sung công thức luyện chế `recipe_tich_coc`, `recipe_tho_nguyen_1`, `recipe_tho_nguyen_2` và data đan dược trong `DEFAULT_PILLS`.
  8. **`hooks/useCraftingActions.ts`**: Hỗ trợ nuốt Thọ Nguyên Đan trực tiếp từ Túi Đồ / Đan Đạo gia tăng thọ nguyên tối đa.
  9. **`hooks/useGameActions.ts`**: Triển khai `handleDeepCultivate()`, đồng bộ hóa state người chơi và lưu trữ LocalStorage.
  10. **`components/dashboard/left/CharacterIdentityCard.tsx`**: Render widget Thọ Nguyên & Tuế Nguyệt kèm thanh tiến trình và cảnh báo Tọa Hóa.
  11. **`components/dashboard/MiddleColumn.tsx`**: Tích hợp bảng điều khiển Tuế Nguyệt Bế Quan với bộ chọn Ngày/Tháng/Năm, preset buttons, dự toán chi phí và nút bế quan.
  12. **`components/GameDashboard.tsx`**: Kết nối callback `handleDeepCultivate`.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit` → **0 lỗi (Exit code 0)**.
  - `npm run build` → **Compiled successfully in 2.8s (Exit code 0)**.

### [2026-09-29 16:15] - Triển Khai Hệ Thống "Thái Cổ Cấm Địa • Khám Phá Sa Bàn Sương Mù & Thần Ma Cấm Khu" (`ForbiddenZoneModal.tsx` & `forbidden-zone-logic.ts`)
- **Mục tiêu:** Nâng cấp và mở rộng toàn diện phân hệ Bí Cảnh từ dạng Dungeon Crawler tuyến tính thành Hệ thống Khám phá Sa Bàn Sương Mù Tự Do (Procedural Fog of War Grid 6x6 & 7x7) cho 5 Đại Sinh Tử Cấm Khu phục vụ các cảnh giới cao (Luyện Hư đến Vạn Cổ Đế Tổ).
- **5 Đại Sinh Tử Cấm Khu Cực Cảnh:**
  1. *Hoang Cổ Cấm Địa* (Luyện Hư Sơ Kỳ+ | Index 31+ | Grid 6x6): Hiệu ứng *Hoang Khí Xâm Thực* (-15% Tốc độ; mỗi 5 bước trừ 3% HP nếu Căn Cốt < 150). Rơi Hoang Thú Cổ Cốt, Vạn Niên Huyết Linh Chi, Hoang Cổ Tinh Huyết.
  2. *Táng Tiên Thiên Uyên* (Đại Thừa Sơ Kỳ+ | Index 41+ | Grid 6x6): Hiệu ứng *Loạn Lưu Kiếm Khí* (Bẫy kiếm trận ngẫu nhiên). Rơi Thái Ất Thần Kim, Tiên Kiếm Tàn Phiến, Bất Diệt Kiếm Tủy.
  3. *U Minh Luân Hồi Hải* (Độ Kiếp Sơ Kỳ+ | Index 46+ | Grid 7x7): Hiệu ứng *Tử Khí Hủ Hồn* (Sương mù bóp nghẹt; mỗi 3 bước trừ 1 Tâm Cảnh). Rơi U Minh Huyền Thủy, Luân Hồi Thạch, Cửu Chuyển Diêm La Đan.
  4. *Thần Ma Mộ Địa* (Chân Tiên Sơ Kỳ+ | Index 56+ | Grid 7x7): Hiệu ứng *Thần Ma Uy Áp* (Áp chế 20% Công Thủ). Rơi Hồn Tinh Thái Cổ, Tinh Huyết Chân Ma, Đế Khí Tàn Mảnh.
  5. *Hỗn Độn Hư Vô Giới* (Chuẩn Đế Sơ Kỳ+ | Index 86+ | Grid 7x7): Hiệu ứng *Hư Không Yên Diệt* (Mỗi 10 bước xuất hiện Vết Nứt Hư Không trừ 5% HP). Rơi Hỗn Độn Tinh Thạch, Tiên Thiên Linh Bảo Tàn Thể, Vạn Cổ Đế Kinh Tàn Quyển.
- **Cơ chế Gameplay & Sa Bàn Sương Mù:**
  - *Tầm Nhìn Thần Thức (Vision Radius):* Mặc định 1 ô xung quanh ($3 \times 3$). Khi `player.thanThuc >= 500` mở rộng 2 ô ($5 \times 5$). Khi Thần Hồn đạt Du Thần / Nguyên Thần (Stage 4+) hoặc Thần Thức >= 1000: Kích hoạt *Đạo Nhãn Thần Hồn*, tự động soi sáng Truyền Tống Cổ Trận (Lối thoát) và Cổ Thần Bảo Rương ngay khi bước vào cấm khu.
  - *Hộ Thân Linh Quang & Khí Tức Ăn Mòn:* Mỗi bước đi trừ 2 điểm Linh Quang (`auraPower` / 100). Khi Linh Quang = 0, rơi vào trạng thái *Khí Tức Ăn Mòn*, mỗi bước đi trừ trực tiếp 10% HP. Có thể nuốt đan dược (`consumePillForAura`) hồi phục +35 Linh Quang khẩn cấp.
  - *Đóng kín vòng lặp Tứ Đại Bách Nghệ:*
    - Dùng **Trận Bàn Bản Mệnh** (`equippedFormation`) giải trừ Thái Cổ Cấm Chế Trận an toàn 100% và thu hồi linh thạch trận nhãn (thay vì dùng vũ lực chịu mất 20% HP).
    - Dùng **Linh Phù Trấn Ma** (`equippedTalismans` - Trấn Ma Phù) tịnh hóa Oán Hồn Tụ Linh nhận lượng lớn Linh Thạch và EXP Thần Hồn.
    - Suối nguồn **Linh Tuyền Thạch Thất**: Hồi phục +45 Linh Quang Hộ Thể và +35% HP.
  - *Cơ Chế Rút Lui An Toàn (Escape Portal Hunt):* Cửa thoát không có sẵn; người chơi phải tự do khám phá sa bàn tìm thấy Truyền Tống Cổ Trận để rút lui an toàn mang 100% chiến lợi phẩm trong `lootBag` về túi trữ vật. Nếu tử trận do cạn máu: Tổn thất 60% chiến lợi phẩm và HP rơi về 10%. Có tùy chọn rút lui khẩn cấp (giữ lại 50% đồ).
- **Files mới tạo:**
  1. **`lib/types/forbidden-zone.ts`**: Định nghĩa kiểu `ForbiddenZoneId`, `ZoneCellType`, `ForbiddenZoneCell`, `ForbiddenZoneConfig`, `ForbiddenZoneLootItem`, `ForbiddenZoneState`.
  2. **`lib/forbidden-zone-data.ts`**: Cấu hình chi tiết 5 Đại Cấm Khu, quái vật, boss, tỷ lệ rơi bảo vật đặc thù, hiệu ứng môi trường.
  3. **`lib/forbidden-zone-logic.ts`**: Procedural grid generator, thuật toán sương mù `revealFogOfWar`, tính tầm nhìn thần thức, xử lý bước đi và ăn mòn, tương tác trận bàn/linh phù, `finalizeEscape`, `finalizeDefeat`.
  4. **`hooks/useForbiddenZoneActions.ts`**: Quản lý state sa bàn, di chuyển, nuốt đan hồi phục linh quang, tương tác ô và kết toán lưu trữ.
  5. **`components/modals/ForbiddenZoneModal.tsx`**: Giao diện ma trận lưới 6x6 và 7x7 phong cách tiên hiệp ma huyễn, HUD Hộ Thân Linh Quang/HP, panel tương tác vị trí, túi loot và live adventure log.
- **Files sửa đổi:**
  1. **`lib/types/index.ts`**: Export `./forbidden-zone`.
  2. **`hooks/index.ts`**: Export `./useForbiddenZoneActions`.
  3. **`components/modals/index.ts`**: Export `./ForbiddenZoneModal`.
  4. **`hooks/useSecretRealmActions.ts`**: Mở rộng `eventsSubTab` hỗ trợ `'forbidden_zones'`.
  5. **`components/tabs/SecretRealmTab.tsx`**: Bổ sung 3 sub-tab chuyển đổi (`Bí Cảnh Đa Tầng` / `Thái Cổ Cấm Địa` / `Kỳ Duyên`), render danh mục 5 Cấm Địa với card cổ phong hoành tráng và nút vào cấm khu.
  6. **`components/GameDashboard.tsx`**: Khởi tạo hook `forbiddenZone`, truyền callback vào `SecretRealmTab`, render `ForbiddenZoneModal`.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit` → **0 lỗi (Exit code 0)**.
  - `npm run build` → **Compiled successfully in 2.5s (Exit code 0)**.

### [2026-09-29 15:35] - Triển Khai Hệ Thống "Cửu Trọng Thiên Kiếp Tương Tác • Lôi Kiếp Độ Kiếp" (`TribulationModal.tsx` & `tribulation-logic.ts`)
- **Mục tiêu:** Nâng cấp toàn diện cơ chế Đột Phá Cảnh Giới: Xây dựng hệ thống minigame đối kháng thời gian thực "Cửu Trọng Thiên Kiếp Tương Tác • Lôi Kiếp Độ Kiếp" với quy tắc kích hoạt nghiêm ngặt và kiến trúc Clean Architecture 5 lớp.
- **Điều kiện kích hoạt nghiêm ngặt:**
  - Bắt đầu chính xác từ mốc đột phá **Đại Thừa Đại Viên Mãn lên Độ Kiếp Sơ Kỳ** (Index `45 -> 46` trong `realms-data.json`).
  - Áp dụng cho toàn bộ các mốc **ĐẠI CẢNH GIỚI** tiếp theo: `[46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96, 101]` (Độ Kiếp -> Phi Thăng, Phi Thăng -> Chân Tiên, Huyền Tiên, Địa Tiên, Thiên Tiên, Kim Tiên, Thái Ất, Chuẩn Đế, Đại Đế, Tiên Đế, Đế Tổ).
  - **Loại trừ tuyệt đối:** Toàn bộ cảnh giới từ Phàm Nhân đến Hợp Thể (Index `0 -> 44`) và **toàn bộ TIỂU CẢNH GIỚI** (Sơ Kỳ -> Trung Kỳ -> Hậu Kỳ -> Đỉnh Phong -> Viên Mãn) không kích hoạt lôi kiếp, tiếp tục đột phá bình thường.
- **Cơ chế Gameplay & Minigame 3 Pha Mỗi Đợt:**
  - **4 Quy Mô Đợt Lôi Kiếp:**
    1. *Tam Cửu Lôi Kiếp (3 Đợt):* Áp dụng cho Đại Thừa -> Độ Kiếp (`45 -> 46`).
    2. *Lục Cửu Lôi Kiếp (6 Đợt):* Áp dụng cho Độ Kiếp -> Phi Thăng (`50 -> 51`) và Phi Thăng -> Chân Tiên (`55 -> 56`).
    3. *Cửu Cửu Lôi Kiếp (9 Đợt):* Áp dụng cho Tiên Giới (`61 -> 81`).
    4. *Vạn Cổ Hỗn Độn Diệt Thế Kiếp (9 Đợt Cực Hạn):* Áp dụng cho Đế Cảnh (`86 -> 101`), sát thương tăng vọt kèm Ma Huyễn Hắc Lôi.
  - **3 Pha Vòng Lặp Mỗi Đợt:**
    - *Pha 1: Thiên Uy Ngưng Tụ (2 giây):* Mây đen cuộn sóng, hiển thị tên lôi kiếp, sát thương cơ sở ước tính và khí tức thiên đạo.
    - *Pha 2: Quyết Sách Ứng Biến (4 giây đếm ngược):* Người chơi có 4s chọn 1 trong 4 đối sách:
      1. `body_tank` (Nhục Thân Ngạnh Kháng): Trừ HP trực tiếp, giảm sát thương dựa trên Căn Cốt, Thủ và Cảnh Giới Nhục Thân; tôi thể thành công cộng vĩnh viễn +5 Thủ & +0.2% Miễn Thương. Hết 4s tự động chọn đối sách này.
      2. `array_shield` (Hộ Thân Trận Pháp): Tiêu hao 15% Max MP + 1.000 Linh Thạch; triệt tiêu 60% - 75% sát thương.
      3. `talisman_sacrifice` (Hiến Tế Tị Lôi Phù / Độ Kiếp Đan): Đốt cháy 1 lá Tị Lôi Dẫn Kiếp Phù hoặc 1 viên Đan Dược; hóa giải 100% sát thương và hồi 10% HP.
      4. `soul_focus` (Thần Hồn Định Phách): Tiêu hao 20 Thần Niệm; khắc chế 85% sát thương Tâm Ma Lôi.
    - *Pha 3: Thiên Lôi Giáng Thế (Oanh Kích & Kết Toán):* Màn hình chớp lóa, âm thanh thiên lôi vang dội (`audioEngine.playThunderSound`). Nếu HP <= 0 thì thất bại, mất 20% tu vi & +15% Ma Tính; nếu HP > 0 thì qua đợt.
  - **Kết Quả Độ Kiếp:**
    - *Thắng lợi:* Đột phá thành công lên Đại Cảnh Giới mới, phục hồi 100% HP & MP, nhận thưởng Đột Phá, bảo lưu vĩnh viễn buff Phòng Ngự & Miễn Thương từ Nhục Thân Ngạnh Kháng, tự động mở Đấu Giá Thiên Cổ.
    - *Thất bại:* Giữ nguyên cảnh giới, đưa HP về 10%, mất 20% tu vi, tăng Ma Tính +15%.
- **Files mới tạo:**
  1. **`lib/types/tribulation.ts`**: Định nghĩa kiểu `TribulationActionType`, `TribulationPhase`, `TribulationWaveConfig`, `TribulationConfig`, `TribulationRunState`.
  2. **`lib/tribulation-logic.ts`**: Nghiệp vụ lôi kiếp `TRIBULATION_TARGET_REALM_INDICES`, `isTribulationBreakthrough()`, `getTribulationConfig()`, `canPerformTribulationAction()`, `resolveTribulationWave()`, `finalizeTribulationVictory()`, `finalizeTribulationDefeat()`.
  3. **`hooks/useTribulationActions.ts`**: Hook quản lý state lôi kiếp, game loop 3 pha bằng `useEffect` interval, flash sấm sét, âm thanh Procedural Audio Web API và kết toán.
  4. **`components/modals/TribulationModal.tsx`**: UI cổ phong huyền ảo với nền giông bão, thanh tiến trình đợt, 2 cột Khí Huyết/Chân Nguyên, 4 card quyết sách chiến thuật trực quan, bộ đếm ngược động và chiến báo lôi kiếp chi tiết.
- **Files sửa đổi:**
  1. **`lib/types/index.ts`**: Export `./tribulation`.
  2. **`hooks/index.ts`**: Export `./useTribulationActions`.
  3. **`components/modals/index.ts`**: Export `./TribulationModal`.
  4. **`hooks/useGameActions.ts`**: Thêm `onTriggerTribulation` vào `UseGameActionsParams`, kiểm tra `isTribulationBreakthrough` trong `handleBreakthrough` để chặn API cũ và kích hoạt minigame.
  5. **`components/GameDashboard.tsx`**: Khởi tạo `tribulation = useTribulationActions(...)`, liên kết với `gameActions`, render `TribulationModal`.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit` → **0 lỗi (Exit code 0)**.
  - `npm run build` → **Compiled successfully in 3.1s, static pages generated (Exit code 0)**.

### [2026-09-29 15:05] - Triển Khai Phân Hệ "Phù Đạo Bách Nghệ • Phù Lục Các" (`TalismanTab.tsx`) — Hoàn Thiện Trọn Vẹn Tứ Đại Bách Nghệ (Đan + Khí + Trận + Phù)
- **Mục tiêu:** Xây dựng hoàn chỉnh nhánh thứ 4 và là mảnh ghép cuối cùng của "Tứ Đại Bách Nghệ" kinh điển thế giới tu chân — **Phù Đạo (TalismanTab)** — gồm đầy đủ 5 lớp chuẩn Clean Architecture: Types → Data → Logic → Hook → UI, tích hợp sâu vào engine chiến đấu (Turn-based simulator & Boss battle) và đột phá cảnh giới (Kháng tâm ma & Triệt tiêu lôi kiếp).
- **Files mới tạo:**
  1. **`lib/types/talisman.ts`**: Định nghĩa kiểu dữ liệu `TalismanType` ('combat' | 'breakthrough' | 'utility'), `TalismanTrigger` ('turn_start' | 'hp_low' | 'manual' | 'breakthrough'), `TalismanMaterial`, `TalismanCombatEffect`, `TalismanBreakthroughEffect`, `TalismanUtilityEffect`, `TalismanRecipe`, `TalismanItem`, `TalismanBeltSlot` (3 ô xuất chiến), `TalismanArtisan`.
  2. **`lib/talisman-data.ts`**: 9 bậc danh xưng Phù Sư (`TALISMAN_ARTISAN_RANKS`) từ Nhất Giai Phù Đồ Nhập Môn đến Cửu Giai Thần Phù Thánh Tổ; danh mục 18 Phù Đồ mẫu (`TALISMAN_RECIPES`) phân chia 3 dòng (Chiến Đấu Phù, Đột Phá Hộ Mệnh Phù, Phụ Trợ & Bí Cảnh Phù); danh mục nguyên liệu phù chỉ & chu sa linh mặc.
  3. **`lib/talisman-logic.ts`**: Nghiệp vụ chế tác `canCraftTalisman()`, `craftTalisman()` (hệ thống phẩm cấp biến dị 5 bậc từ Hạ Phẩm đến Cực Phẩm/Thần Phẩm buff theo Thần Thức), `equipTalismanToBelt()`, `unequipTalismanFromBelt()`, `processCombatTalismans()` (kích hoạt bùa theo lượt và theo ngưỡng máu thấp, tiêu hao bùa), `useUtilityTalisman()`, `getBreakthroughTalismanModifier()`, `consumeBreakthroughTalisman()`.
  4. **`hooks/useTalismanActions.ts`**: Quản lý toàn bộ state Phù Lục Các (`talismanSubTab`, `craftCount`, `isCrafting`, `handleCraftTalisman`, `handleEquipTalisman`, `handleUnequipTalisman`, `handleUseUtilityTalisman`, chấm đỏ thông báo `hasTalismanNotification`).
  5. **`components/tabs/TalismanTab.tsx`**: Giao diện cổ phong tông màu chu sa ánh kim gồm 3 phân khu trực quan:
     - **✍️ Án Thư Họa Phù**: Án thư gỗ mun, bộ lọc theo loại/giai, bảng nguyên liệu real-time, bộ chọn số lượng (x1/x5/x10), nút chấp bút họa bùa kèm animation phát quang.
     - **🎒 Phù Nang Bản Mệnh**: 3 bao da xuất chiến hiển thị trạng thái bùa nạp, số lượng tồn kho, nút tháo/thay bùa, danh mục Chiến Đấu Phù nạp nhanh 1-click.
     - **📜 Tàng Phù Hòm**: Kho lưu trữ toàn bộ linh phù, hiển thị số lượng tích lũy, nút dùng nhanh bùa phụ trợ.
- **Files sửa đổi:**
  1. **`lib/types/index.ts`**: Export `./talisman`.
  2. **`lib/types/player.ts`**: Bổ sung `talismanArtisan?: TalismanArtisan` và `equippedTalismans?: TalismanBeltSlot[]` vào `PlayerStats`.
  3. **`lib/save-migration.ts`**: Chuẩn hóa an toàn `talismanArtisan`, `equippedTalismans` (3 ô mặc định), `inventory.talismans` và cấp phát nguyên liệu vẽ bùa khởi đầu (`paper_hoang_bi`, `ink_chu_sa_khoang`).
  4. **`lib/game-logic/combat.ts`**: Đọc `equippedTalismans`, kích hoạt phù lục xuất chiến, gia tăng uy lực chiến đấu và ghi nhận log cổ phong chi tiết.
  5. **`lib/boss-trial-data.ts`**: Tích hợp `processCombatTalismans()` vào `simulateTurnBasedCombat()`, kích hoạt khiên hộ thể, sát thương nổ, định thân boss và hồi máu khẩn cấp khi HP thấp.
  6. **`lib/game-logic/cultivation.ts`**: Tích hợp `getBreakthroughTalismanModifier()` vào `attemptBreakthrough()`, cộng dồn trực tiếp tỷ lệ kháng tâm ma, triệt tiêu sát thương thiên kiếp và tăng tỉ lệ thành công.
  7. **`app/api/breakthrough/route.ts`**: Tự động trừ 1 lá bùa hộ mệnh đột phá khi tiến hành phá cảnh.
  8. **`hooks/index.ts`**: Export `useTalismanActions`.
  9. **`components/GameDashboard.tsx`**: Khởi tạo hook `useTalismanActions`, bổ sung tab union type `'talisman'`, gắn nút "📜 Phù Đạo" (hoàn thiện đối xứng 6x2 = 12 tabs), render `TalismanTab`.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit` → **0 lỗi (Exit code 0)**.
  - `npm run build` → **Exit code 0**.

### [2026-09-29 14:35] - Triển Khai Phân Hệ "Trận Đạo Bách Nghệ • Trận Pháp Các" (`FormationTab.tsx`) — Hoàn Thiện Tam Đại Bách Nghệ (Đan + Khí + Trận)
- **Mục tiêu:** Xây dựng hoàn chỉnh nhánh thứ 3 trong Tứ Đại Bách Nghệ tiên hiệp — **Trận Đạo (FormationTab)** — gồm 5 lớp: Types → Data → Logic → Hook → UI, tương đương hoàn toàn với `AlchemyTab` và `ForgingTab` về chiều sâu hệ thống.
- **Files mới tạo:**
  1. **`lib/types/formation.ts`**: Định nghĩa `FormationType`, `FormationElement` (8 hệ), `FormationMaterial`, `FormationCombatBuff`, `FormationRecipe`, `FormationItem`, `FormationArtisan`.
  2. **`lib/formation-data.ts`**: 9 bậc danh xưng Trận Pháp Sư (`FORMATION_ARTISAN_RANKS`), 18 Trận Đồ mẫu (`FORMATION_RECIPES`) trải 6 cấp (Nhất → Lục Giai gồm Tru Tiên Kiếm Trận), 3 loại trận pháp (Chiến Trận/Hộ Pháp/Tiện Ích), config màu element/type.
  3. **`lib/formation-logic.ts`**: `canCraftFormation()`, `craftFormationItem()` (roll quality 5 cấp + EXP tích lũy), `calculateFormationCombatStats()`, `executeFormationTurnTrigger()` (interval/chance triggers), `dismantleFormation()` (thu hồi 40% khoáng thạch).
  4. **`hooks/useFormationActions.ts`**: Quản lý `handleCraftFormation()`, `handleEquipFormation()`, `handleUnequipFormation()`, `handleDismantleFormation()`. Expose `artisan`, `formationInventory`, `hasFormationNotification`.
  5. **`components/tabs/FormationTab.tsx`**: Giao diện cổ phong 3 sub-tabs — **Khắc Trận Bàn** (bàn Bát Quái phát quang, danh sách trận đồ theo giai, nguyên liệu real-time, tỉ lệ thành công động), **Bản Mệnh Trận** (khe xuất chiến với stats/trigger đầy đủ), **Kho Trận Bàn** (equip/tháo/phân giải).
- **Files sửa đổi:**
  1. **`lib/types/index.ts`**: Thêm `export * from './formation'`.
  2. **`lib/types/player.ts`**: Thêm `formationArtisan?: FormationArtisan` và `equippedFormation?: FormationItem | null`.
  3. **`lib/save-migration.ts`**: Bổ sung normalization an toàn cho `formationArtisan` (khởi tạo level 1, 2 trận đồ starter) và `equippedFormation`, `inventory.formations`.
  4. **`hooks/index.ts`**: Thêm `export * from './useFormationActions'`.
  5. **`components/GameDashboard.tsx`**: Thêm `useFormationActions` hook, `FormationTab` import, tab union type `'formation'`, nút "🌀 Trận Đạo" trong grid 6 cột hàng 1, và `<FormationTab>` content block.
- **Cơ chế gameplay đặc sắc:**
  - **Turn Trigger System**: `executeFormationTurnTrigger()` — Bát Quái Phong Ma kích hoạt mỗi 3 hiệp phong tỏa ATK đối thủ 30%, Cửu Tiêu Lôi Động 35% mỗi hiệp giáng thiên lôi 150% ATK, Tru Tiên Kiếm Trận 4 hiệp kiếm khí bỏ qua 100% giáp.
  - **Quality System**: 5 cấp phẩm chất (Hạ/Trung/Thượng/Cực/Thần Phẩm) với hệ số nhân stats 0.8x → 2.0x.
  - **Tribulation Buffs**: Hộ Pháp Trận kích hoạt khi đột phá — giảm lôi kiếp, kháng tâm ma xâm lấn.
  - **Utility Traps**: Phá Cấm Trận Bàn vô hiệu 60% cạm bẫy bí cảnh roguelite.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit` → **0 lỗi (Exit code 0)**.
  - `npm run build` → **Exit code 0**.

### [2026-09-29 14:08] - Gỡ Bỏ Khối "Động Phủ Linh Điền" Cũ (6 Ô Đất) & Tái Cấu Trúc `CompanionCard.tsx`
- **Mục tiêu:** Loại bỏ hoàn toàn khối Linh Điền 6 ô phàm điền khỏi Cột Trái, tái cấu trúc `CompanionAndGardenCard.tsx` thành `CompanionCard.tsx` chuyên biệt hiển thị Đạo Lữ & Pháp Bảo, giải phóng ~220px chiều cao để Cột Trái vừa khít màn hình 1080p không cần cuộn.
- **Lý do kiến trúc:**
  - Toàn bộ tính năng gia viên đã hợp nhất vào **"ĐỘNG THIÊN PHÚC ĐỊA" (`AbodeHubModal.tsx`)** phân khu **Huyền Thiên Dược Viên** với 12 ô đất đa tầng, loại thổ nhưỡng dị biến. Khối 6 ô cũ là **dead code** gây loãng layout.
  - Tránh xung đột hiển thị: cấu trúc `player.linhDien.plots[0..5]` (phàm điền 6 ô) vs `player.abodeState.gardenPlots[0..11]` (Huyền Thiên Dược Viên 12 ô).
- **Chi tiết thay đổi kỹ thuật:**
  1. **`components/dashboard/left/CompanionCard.tsx`** *(Tạo mới)*:
     - Trích xuất phần **Đạo Lữ Tiên Duyên** (avatar, tên, danh xưng, độ hảo cảm, buff song tu, nút mở tab Đạo Lữ) và **Pháp Bảo Hộ Thân** (4 vị trí trang bị tóm tắt) từ `CompanionAndGardenCard.tsx` cũ.
     - Interface rút gọn còn 3 props: `player`, `setSelectedCompanionId`, `setActiveTab`. Xóa hoàn toàn 5 props vườn: `currentTimestamp`, `setShowLinhDienUpgradeModal`, `handleHarvestAllPlots`, `setSelectedPlotId`, `setShowPlantSeedModal`, `handleHarvestPlot`.
  2. **`components/dashboard/left/index.ts`** *(Cập nhật barrel)*:
     - Thay `CompanionAndGardenCard` → `CompanionCard`.
     - Xóa `TwinCultivationTrackCard` (đã deprecated từ lần trước).
  3. **`components/dashboard/LeftColumn.tsx`** *(Viết lại)*:
     - Cập nhật import `CompanionCard`, xóa `CompanionAndGardenCard`.
     - Xóa 6 props khỏi `LeftColumnProps` interface: `currentTimestamp`, `setShowLinhDienUpgradeModal`, `handleHarvestAllPlots`, `setSelectedPlotId`, `setShowPlantSeedModal`, `handleHarvestPlot`.
     - Sắp xếp lại thứ tự 6 thẻ chuẩn: **CharacterIdentityCard → CombatStatsCard → FourAttributesCard → DestinyCard → HeritageAndCultivationCard → CompanionCard**.
  4. **`components/GameDashboard.tsx`** *(Dọn dẹp orchestrator)*:
     - Xóa 6 props garden truyền vào `<LeftColumn>`. Các handler `garden.*` vẫn giữ nguyên vì vẫn phục vụ cho modal **"Động Phủ Linh Điền"** cũ (được disable/ignore). Phân khu Huyền Thiên Dược Viên trong `AbodeHubModal` dùng `abode.*` handlers độc lập, không bị ảnh hưởng.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit` → **0 lỗi**.
  - `npm run build` → **Exit code 0**, 8/8 trang static.
- **Tác động layout:** Cột Trái giảm ~220px chiều dọc, vừa khít 1080p ở zoom 0.93 mà không cần thanh cuộn dọc. Nút 🏯 Động Phủ trên HeaderNav vẫn mở AbodeHubModal trơn tru.

### [2026-09-29 14:00] - Gỡ Bỏ Thẻ "Song Trục Tu Đạo" (`TwinCultivationTrackCard`) - Dọn Dẹp Kỹ Thuật Nợ & Tối Ưu Layout Cột Trái

- **Mục tiêu:** Loại bỏ hoàn toàn thẻ `TwinCultivationTrackCard.tsx` khỏi giao diện Cột Trái, giải phóng không gian chiều dọc và xóa xung đột dữ liệu với các phân hệ Thần Hồn và Nhục Thân độc lập mới.
- **Lý do kiến trúc:**
  - Phân hệ **Thần Hồn** đã được nâng cấp toàn diện thành `SoulHubModal.tsx` (quản lý qua `useSoulActions`, truy cập qua nút `🔮 Thần Hồn` trên `HeaderNav`). Thẻ cũ vẫn đọc/ghi vào `player.soulCultivation` (đã deprecated), gây xung đột với chuẩn mới `player.soulState`.
  - Phân hệ **Nhục Thân** đã được bóc tách thành `PhysiqueModal.tsx` (quản lý qua `usePhysiqueActions`, truy cập qua nút `💪 Nhục Thân` trên `HeaderNav`).
  - Thẻ cũ trở thành **dead code** gây loãng Cột Trái.
- **Chi tiết thay đổi kỹ thuật:**
  1. **`components/dashboard/LeftColumn.tsx`**:
     - Xóa import `TwinCultivationTrackCard` khỏi barrel `./left`.
     - Xóa import `ExpeditionDestinationId` (không còn được sử dụng).
     - Xóa 4 props khỏi `LeftColumnProps` interface: `handleUpgradeBodyRefinement?`, `handleUpgradeSoulCultivation?`, `handleStartSoulExpedition?`, `handleClaimSoulExpedition?`.
     - Xóa 4 tham số tương ứng khỏi destructuring.
     - Xóa khối JSX `<TwinCultivationTrackCard ... />` khỏi render.
  2. **`components/GameDashboard.tsx`**:
     - Xóa 4 props `handleUpgradeBodyRefinement`, `handleUpgradeSoulCultivation`, `handleStartSoulExpedition`, `handleClaimSoulExpedition` (trỏ đến `twinCultivation.*`) khỏi thẻ `<LeftColumn>`.
- **Kết quả kiểm thử:** `npx tsc --noEmit` → **0 lỗi, 0 cảnh báo**.
- **Tác động:** Layout Cột Trái gọn hơn; không còn xung đột dữ liệu double-write vào 2 schema Thần Hồn/Nhục Thân khác nhau.

### [2026-09-29 07:00] - Triển Khai Phân Hệ "Thức Hải Thần Hồn & Tâm Ma Đài (Soul & Consciousness System)" Hoàn Chỉnh

- **Mục tiêu & Giá trị hệ thống:**
  - Bóc tách năng lực Thần Hồn / Thần Thức / Tâm Cảnh thành một phân hệ tu luyện tâm linh độc lập, tạo thế kiềng 3 chân hoàn hảo: **Khí Tu (Bản Thể) • Thể Tu (Nhục Thân) • Hồn Tu (Thần Hồn)**.
  - Xây dựng cơ chế Thức Hải với dung lượng Thần Niệm, 10 Đại Cảnh Giới Thần Hồn (mỗi cảnh giới 9 Tiểu Tầng), kiểm soát Tâm Ma & Cán Cân Âm Dương (Tâm Cảnh Bạch Minh vs Ma Tính Hắc Ám).
  - Tế luyện Hồn Khí (Trảm Thần Kiếm, Dưỡng Hồn Châu, Huyền Vũ Hồn Giáp...) trấn thủ Thức Hải, thi triển Uy Áp Thần Thức áp chế đối thủ trong giao tranh, và trực tiếp nâng cao tỷ lệ độ kiếp khí tu đồng thời giảm sát thương thiên kiếp/tâm ma.
  - Cung cấp Sa Bàn Giao Diện Thức Hải Cổ Phong Huyền Ảo 3 Phân Khu (`SoulHubModal.tsx`), truy cập qua nút bấm phát quang `🔮 Thần Hồn` trên HeaderNav.

- **Chi tiết thay đổi kỹ thuật:**
  1. **Schema & Kiểu Dữ Liệu (`lib/types/soul.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Tạo mới `lib/types/soul.ts`:
       - `SoulStatBonus`: Trí lực, tinh thần, kháng phép, kháng khống chế, uy áp, tốc độ, bạo kích, công thủ, sinh mệnh.
       - `SoulRealm`: Định nghĩa 10 cảnh giới (`id`, `name`, `maxStage: 9`, `description`, `lore`, `glowColor`, `statsBonus`, `spiritualPressure`, `maxControlSlots`, `specialAbilityName`, `specialAbilityDesc`).
       - `SoulCultivation`: Tiến độ tu luyện (`currentRealmId`, `currentStage`, `currentExp`, `expToNextStage`, `soulSeaCapacity`, `currentSoulPower`).
       - `MentalDemonState`: Tâm Cảnh (`stability: 0-100%`), Ma Tính (`demonCorruption: 0-100%`), Cấp độ Tâm Ma (`demonLevel`), Trạng thái ảo cảnh (`isTribulationActive`).
       - `SoulRelic`: Hồn Khí & Hồn Kỹ (`id`, `name`, `type: offensive | defensive | support`, `tier: 1-6`, `passiveEffect`, `soulPowerCost`, `statsBonus`).
       - `SoulState`: Trạng thái tổng thể nhúng vào nhân vật (`cultivation`, `mindState`, `equippedRelics`, `lastMeditationTimestamp`).
       - `SoulNourishingItemConfig`: Cấu hình vật phẩm tịnh tâm & dưỡng hồn.
     - Mở rộng `PlayerStats` trong `lib/types/player.ts` bổ sung `soulState?: SoulState;`.
     - Barrel export toàn bộ kiểu dữ liệu qua `lib/types/index.ts`.
  2. **Cấu Hình Dữ Liệu Thần Hồn (`lib/soul-data.ts`):**
     - Cấu hình **10 Cảnh Giới Thần Hồn Thần Bí (`SOUL_REALMS`)**:
       1. *Phàm Hồn*: Thần thức chưa khai mở, chỉ số cơ bản.
       2. *Ngưng Thần*: Cảm nhận linh khí ngoại giới, tăng né tránh và bạo kích.
       3. *Dục Thần*: Thức Hải thành hình, giảm 15% tác động xấu từ đan độc.
       4. *Hóa Thần*: Thần Niệm Phóng Ngoại, Uy Áp sơ cấp, tự động phát hiện cạm bẫy bí cảnh.
       5. *Du Thần*: Thần Du Thái Hư, tăng 20% tốc độ bế quan offline.
       6. *Nguyên Thần*: Ngưng Tụ Chân Thân, khi HP về 0 xuất khiếu giữ lại 1 máu và bảo toàn tu vi.
       7. *Phân Thần*: Mở thêm 1 ô xuất chiến Pháp Bảo/Linh Thú/Khôi Lỗi, đa nhiệm thần thức.
       8. *Hợp Đạo Chân Linh*: Miễn nhiễm hoàn toàn các hiệu ứng Mê Hoặc/Định Thân/Câm Lặng cấp thấp.
       9. *Bất Hủ Thần Hồn*: Kháng 40% sát thương Thần thức, tự phục hồi sinh mệnh theo % Thần Niệm.
       10. *Hỗn Độn Thần Niệm*: Thần thức bao trùm thiên địa, Uy Áp áp chế 20% toàn bộ chỉ số kẻ địch yếu hơn.
     - Cấu hình 5 vật phẩm tịnh tâm (`SOUL_NOURISHING_ITEMS`): An Thần Thảo, U Minh Thạch, Thanh Thần Đan, Vấn Đạo Hương, Dưỡng Hồn Mộc.
     - Cấu hình 6 đại Hồn Khí (`SOUL_RELICS_CATALOG`): Trảm Thần Kiếm, Dưỡng Hồn Châu, Huyền Vũ Hồn Giáp, Thái Hư Thần Kính, Cửu U Nhiếp Hồn Chuông, Hỗn Độn Trấn Hồn Đỉnh.
     - Hàm khởi tạo mặc định: `createDefaultSoulState()`.
  3. **Logic Nghiệp Vụ Cốt Lõi (`lib/soul-logic.ts`):**
     - `calculateSoulBuffs()`: Tổng hợp chỉ số gia trì từ Cảnh Giới Thần Hồn, Tiểu Tầng và Hồn Khí.
     - `calculateBreakthroughSuccessModifier()`: Tính toán tỷ lệ giảm trừ thất bại khi độ kiếp và giảm sát thương lôi kiếp/tâm ma dựa trên độ ổn định của Tâm Cảnh (`stability`) và cấp Thần Hồn.
     - `processMeditationTick()`: Tính toán EXP bế quan tĩnh tọa, phục hồi Tâm Cảnh và thanh lọc Ma Tính theo thời gian thực hoặc offline.
     - `exorciseMentalDemon()`: Lập pháp trận trảm ma, tiêu hao Linh Thạch để thanh tẩy Ma Tính và giảm cấp độ Tâm Ma.
     - `applySpiritualPressureCombat()`: Tính toán % suy giảm công thủ của đối thủ khi chịu Uy Áp Thần Thức trong giao tranh.
     - `canBreakthroughSoulRealm()` & `breakthroughSoulRealm()`: Kiểm tra điều kiện (EXP đầy, Tầng 9, Tâm Cảnh >= 70%, Ma Tính <= 40%) và thực hiện độ kiếp Thần Hồn.
     - `equipSoulRelic()` / `useSoulNourishingItem()`: Quản lý trang bị tối đa 3 Hồn Khí và sử dụng vật phẩm tịnh tâm.
  4. **Hook Quản Lý Tương Tác (`hooks/useSoulActions.ts`):**
     - Quản lý trạng thái modal, chuyển tab phân khu, gọi action độ kiếp, tĩnh tọa minh tưởng, trảm ma, trang bị hồn khí, dùng vật phẩm.
     - Tự động tính toán `hasSoulNotification` hiển thị chấm đỏ khi đủ điều kiện độ kiếp, Ma Tính vượt 50% hoặc tích lũy đủ thời gian minh tưởng.
  5. **Tích Hợp Engine Độ Kiếp & Chiến Đấu:**
     - `lib/game-logic/cultivation.ts` (`processBreakthrough`): Kết nối Thần Hồn và Tâm Cảnh vào công thức độ kiếp khí tu: Thần Hồn càng cao, tỷ lệ độ kiếp thành công càng lớn, giảm nguy cơ gặp Tâm Ma, và giảm sát thương phản phệ lôi kiếp/tâm ma.
     - `lib/destiny-data.ts` (`calculateCombatStats`): Tự động nạp chỉ số Thần Hồn (trí lực, tinh thần, tốc độ, bạo kích, công thủ, kháng phép) và chỉ số Uy Áp `spiritualPressure` vào hệ thống chiến đấu.
  6. **Giao Diện Sa Bàn Thức Hải Thần Hồn (`components/soul/SoulHubModal.tsx`):**
     - Thiết kế giao diện cổ phong huyền ảo Dark Mode với tông Lam dạ quang, Tím huyền bí và Bạc minh tưởng:
       - **Tây Dực (Thức Hải & Cảnh Giới):** Đồ họa Nguyên Thần phát quang tại trung tâm Thức Hải, cấp giai 1-10, tiểu tầng 1-9, thanh EXP Thần Hồn, thanh Thần Niệm, nút *[Độ Kiếp Thần Hồn]*, bảng gia trì toàn diện và ảnh hưởng lên độ kiếp khí tu.
       - **Trung Tâm (Tâm Ma Đài & Minh Tưởng):** Biểu đồ âm dương cân bằng giữa Tâm Cảnh (Bạch Minh) và Ma Tính (Hắc Ám), cảnh báo Tẩu Hỏa Nhập Ma khi ma tính > 50%, nút *[Tĩnh Tọa]* và *[Trảm Ma]*, kho vật phẩm tịnh tâm & dưỡng hồn kèm các nút dùng nhanh.
       - **Đông Dực (Hồn Điện & Hồn Khí):** Tam đại trận nhãn đặt Hồn Khí trấn thủ, bảng chỉ số Uy Áp Thần Thức hiện tại, lưới danh mục 6 món Hồn Khí thần bí kèm nút Tế Luyện / Gỡ Bỏ.
  7. **Header Navigation & Dashboard Mount (`components/dashboard/HeaderNav.tsx`, `components/GameDashboard.tsx`):**
     - Bổ sung nút truy cập **"🔮 Thần Hồn"** cạnh Nhục Thân trên HeaderNav.
     - Kết nối hook `useSoulActions` và mount `SoulHubModal` trong GameDashboard.
  8. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts` & `character.ts`):**
     - Cập nhật `normalizePlayerData()`: Nhận diện và tự động khởi tạo `soulState` chuẩn cho các save cũ, di trú an toàn từ `soulCultivation` cũ nếu có mà không gây mất dữ liệu.
     - Đảm bảo `createNewPlayer()` luôn khởi tạo `soulState` mặc định (Phàm Hồn Tầng 1, Tâm Cảnh 100%, Ma Tính 0%).

- **Kết Quả Kiểm Thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Hoàn thành xuất sắc 100% với Next.js Turbopack và 0 cảnh báo.

---

### [2026-09-29 06:40] - Triển Khai Phân Hệ "Huyền Công Luyện Thể (Expanded Physique System)" Hoàn Chỉnh
- **Mục tiêu & Giá trị hệ thống:**
  - Bóc tách năng lực Nhục Thân ra khỏi cấu trúc dữ liệu và giao diện chung của "Bản Thể Chân Nhân".
  - Xây dựng Nhục Thân thành một hệ thống tu luyện song song có chiều sâu, cảnh giới riêng (10 Đại Cảnh Giới, mỗi cảnh giới 9 Tiểu Tầng), tài nguyên bồi dưỡng riêng (Tinh Huyết Yêu Thú, Khí Huyết Đan, Tẩy Tủy Đan, Quặng & Dược liệu) và ảnh hưởng trực tiếp đến hệ thống chiến đấu (HP, DEF, ATK, Tỷ lệ bạo kích, Miễn thương, Sát thương chuẩn, Phản phệ sát thương, Tự hồi phục khí huyết).
  - Cung cấp Sa Bàn Giao Diện Luyện Thể 3 Cột Cổ Phong (`PhysiqueModal.tsx`) độc lập, truy cập thông qua nút bấm phát quang `💪 Nhục Thân` trên HeaderNav.

- **Chi tiết thay đổi kỹ thuật:**
  1. **Schema & Kiểu Dữ Liệu (`lib/types/physique.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Tạo mới `lib/types/physique.ts`:
       - `PhysiqueStatBonus`: Định nghĩa các chỉ số cộng dồn (HP, DEF, ATK, Speed, Crit Rate, Crit Dmg, Dmg Reduction, HP Regen, True Dmg, Counter Dmg).
       - `PhysiqueRealm`: Định nghĩa 10 cảnh giới (`id`, `name`, `maxStage`, `description`, `lore`, `glowColor`, `baseStatsBonus`, `specialAbilityName`, `specialAbilityDesc`).
       - `PhysiqueCultivation`: Quản lý tiến trình tu luyện (`currentRealmId`, `currentStage`, `currentExp`, `expToNextStage`, `physiquePotential`, `maxPotential`).
       - `PhysiquePart`: Định nghĩa 6 đại bộ phận (`id`, `name`, `level`, `statsBonus`, `upgradeCostLinhThach`, `requiredMaterialId`, `requiredMaterialQty`).
       - `PhysiqueState`: Trạng thái tổng thể nhúng vào nhân vật (`cultivation`, `parts`, `passiveTickerTimestamp`).
     - Mở rộng `PlayerStats` trong `lib/types/player.ts` bổ sung `physiqueState?: PhysiqueState;`.
     - Barrel export toàn bộ kiểu dữ liệu qua `lib/types/index.ts`.
  2. **Cấu Hình Dữ Liệu Luyện Thể (`lib/physique-system-data.ts`):**
     - Cấu hình **10 Đại Cảnh Giới Nhục Thân** (`PHYSIQUE_REALMS`):
       1. *Phàm Thai*: Cơ thể phàm nhân, kinh mạch chưa thông.
       2. *Đồng Bì Thiết Cốt*: Tăng mạnh DEF (+150), HP (+1,200), Giảm sát thương (+3%).
       3. *Ngọc Nhũ Huyết*: Huyết khí như ngọc, tăng Hồi Máu (+2%/hiệp) và Kháng Độc.
       4. *Tinh Thể Chân Nhân*: Tinh hỏa tôi luyện, tăng Công Kích Vật Lý (+200), Xuyên Giáp (+5%).
       5. *Vạn Tượng Lực*: Sức mạnh vạn tượng lôi đình, tăng mạnh ATK (+450), Bạo Kích (+5%).
       6. *Kim Cang Bất Hoại*: Thân thể kim cương, Kháng Khống Chế, Phản Sát Thương (+10%).
       7. *Đạo Thể Sơ Thành*: Hài hòa đạo tắc, Giảm Tiêu Hao Chân Nguyên (-15%), Tăng Tốc Độ (+35).
       8. *Hư Không Chi Thân*: Thân hợp hư không, Tăng Né Tránh (+8%), Dịch Chuyển Tức Thời.
       9. *Thánh Thể Viễn Cổ*: Thánh uy chấn thế, Mở khóa nội tại Thánh Thể Giáng Lâm (+2,500 HP, +1,200 ATK, Sát Thương Chuẩn +500).
       10. *Bất Diệt Tiên Thể*: Đạt đến đỉnh phong bất tử, Tự Động Phục Hồi Khí Huyết Khi Tử Vong (Hồi Sinh Huyết Khí 40%).
     - Cấu hình **6 Đại Bộ Vị Cường Hóa** (`PHYSIQUE_PARTS_CONFIG`):
       - `bi`: Bì (Da) - Tăng Phòng Ngự & Miễn Thương.
       - `cot`: Cốt (Xương) - Tăng Khí Huyết & Bạo Kích.
       - `huyet`: Huyết (Máu) - Tăng Khí Huyết & Tốc Độ Hồi Máu.
       - `kinh`: Kinh (Kinh Mạch) - Tăng Công Kích & Giảm Tiêu Hao Chân Nguyên.
       - `tang`: Tạng (Ngũ Tạng) - Tăng Khí Huyết & Kháng Phép/Kháng Độc.
       - `than`: Thần (Thần Kinh & Thể Phách) - Tăng Tốc Độ & Phản Sát Thương.
     - Hàm khởi tạo mặc định: `createDefaultPhysiqueParts()`, `createDefaultPhysiqueState()`.
  3. **Logic Nghiệp Vụ Cốt Lõi (`lib/physique-logic.ts`):**
     - `calculateTotalPhysiqueStats()`: Tổng hợp toàn bộ chỉ số từ Cảnh Giới và 6 Bộ Vị Cường Hóa.
     - `processPhysiquePassiveTick()`: Tính toán EXP offline/treo máy theo thời gian thực và tự động tiêu hao dược liệu nếu bật chế độ.
     - `canBreakthroughPhysiqueRealm()`: Kiểm tra điều kiện phá cảnh đại cảnh giới (Max EXP, max 9 tiểu tầng, kiểm tra vật phẩm phá cảnh).
     - `breakthroughPhysiqueRealm()`: Thực hiện đột phá đại cảnh giới, nâng cấp danh xưng và mở khóa hiệu ứng đặc thù.
     - `upgradePhysiquePart()`: Cường hóa bộ vị theo level, trừ Linh Thạch và nguyên liệu (Tinh Huyết, Quặng, Thảo Dược).
     - `usePhysiqueItem()`: Thu nạp đan dược (Khí Huyết Đan, Tẩy Tủy Đan, Tinh Huyết Yêu Thú) tăng EXP và Điểm Tiềm Năng Nhục Thân.
  4. **Hook Quản Lý Tương Tác (`hooks/usePhysiqueActions.ts`):**
     - Quản lý trạng thái modal, chọn bộ phận, kích hoạt phá cảnh, cường hóa bộ vị, sử dụng đan dược bồi dưỡng.
     - Tính toán `hasPhysiqueNotification` thời gian thực để hiển thị chấm đỏ trên Header khi đủ điều kiện phá cảnh hoặc cường hóa.
  5. **Tích Hợp Vào Engine Combat & Hệ Thống Chỉ Số:**
     - `lib/destiny-data.ts` (`calculateCombatStats`): Tự động nạp `calculateTotalPhysiqueStats(player.physiqueState)` vào các chỉ số chiến đấu tổng quát (atk, def, speed, critRate, critDmg, damageReduction, hpRegenPercent, trueDmg, counterDmg).
     - `lib/game-logic/stats.ts` (`getMaxKhiHuyet`): Cộng thêm lượng HP tăng từ Nhục Thân vào tổng Khí Huyết tối đa của nhân vật.
  6. **Giao Diện Sa Bàn Huyền Công Luyện Thể (`components/physique/PhysiqueModal.tsx`):**
     - Thiết kế giao diện 3 cột cổ phong Dark Mode:
       - **Cột Trái (Cảnh Giới & Đột Phá):** Hiển thị Đạo Đài Thể Phách phát quang theo màu sắc cảnh giới, tên cảnh giới, tiến trình Tiểu Tầng 1-9, thanh EXP Khí Huyết, nút *[Phá Cảnh Đột Phá]*, và bảng tổng hợp buff thể phách.
       - **Cột Giữa (Lục Đại Bộ Vị Cường Hóa):** Lưới 6 bộ phận (Bì, Cốt, Huyết, Kinh, Tạng, Thần) với huy hiệu cấp độ, thẻ chi tiết cường hóa, vật phẩm tiêu hao, và nút *[Tôi Luyện Cường Hóa]*.
       - **Cột Phải (Kho Luyện Thể & Tiềm Năng):** Thanh đo Điểm Tiềm Năng Nhục Thân, danh sách vật phẩm tôi thể sở hữu (Tinh Huyết Yêu Thú, Khí Huyết Đan, Khí Huyết Đan Cực Phẩm, Tẩy Tủy Đan) kèm các nút sử dụng nhanh.
  7. **Header Navigation & Dashboard Mount (`components/dashboard/HeaderNav.tsx`, `components/GameDashboard.tsx`):**
     - Bổ sung nút truy cập **"💪 Nhục Thân"** cạnh Động Phủ trên HeaderNav.
     - Kết nối hook `usePhysiqueActions` và mount `PhysiqueModal` đồng bộ với toàn bộ chu trình trò chơi.
  8. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts` & `lib/game-logic/character.ts`):**
     - Cập nhật `normalizePlayerData()`: Nhận diện và di trú an toàn từ dữ liệu nhân vật cũ, tự động khởi tạo Phàm Thai Tầng 1 với bảo lưu tiến trình `bodyRefinement` cũ nếu có.
     - Đảm bảo `createNewPlayer()` luôn khởi tạo `physiqueState` chuẩn xác.

- **Kết Quả Kiểm Thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Hoàn thành xuất sắc 100% với Next.js Turbopack và 0 cảnh báo.

---

### [2026-09-29 06:15] - Triển Khai Phân Hệ "Động Thiên Phúc Địa (Homestead & Abode Core)" Hoàn Chỉnh
- **Mục tiêu & Giá trị hệ thống:**
  - Hợp nhất và điều phối trực quan toàn bộ hoạt động gia viên và sản xuất phụ trợ thông qua Sa Bàn Động Phủ Cổ Phong (Homestead Hub).
  - Đóng kín vòng lặp kinh tế phụ trợ: Linh thú dạo chơi sản sinh phân bón → Phân bón tăng tốc Dược Điền dị biến → Thu hoạch thảo dược luyện đan → Đan dược bồi dưỡng nhân vật và đệ tử bái sư.
  - Tái sử dụng công pháp đã học tại Tàng Kinh Các để thu hút đệ tử bái sư và định kỳ nhận cống nạp bổng lộc.

- **Chi tiết thay đổi kỹ thuật:**
  1. **Schema & Kiểu Dữ Liệu (`lib/types/abode.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Tạo mới `lib/types/abode.ts`:
       - `AbodeSoilType`: `'hoang_tho' | 'han_bang' | 'hoa_diem'`.
       - `AbodePlotState`: Quản lý 12 ô đất (`id`, `soilType`, `unlocked`, `seedId`, `plantedAt`, `harvestAt`, `fertilized`).
       - `AbodeSpiritArrayState`: Cấp độ 1-10, `tuViRateBonus`, `autoHealBonus`.
       - `AbodeDisciple`: `id`, `name`, `avatar`, `aptitude` (`ha` | `trung` | `thuong` | `thien_kieu`), `assignedManualId`, `tributeReadyAt`, `lastClaimedAt`.
       - `AbodeState`: `level` (1-5), `spiritArray`, `plots` (12 ô), `beastSanctuary` (`roamingBeastIds`, `fertilizerStored`, `lastFertilizerTick`), `scripturePavilion` (`showcasedManualIds`, `disciples`).
     - Mở rộng `PlayerStats` trong `lib/types/player.ts` bổ sung `abodeState?: AbodeState;`.
     - Barrel export toàn bộ kiểu dữ liệu qua `lib/types/index.ts`.
  2. **Dữ Liệu & Nghiệp Vụ Cốt Lõi (`lib/abode-data.ts` & `lib/abode-logic.ts`):**
     - Cấu hình 10 Cấp Tụ Linh Trận (`SPIRIT_ARRAY_LEVELS`): Cấp 1 (+5% Tu Vi), Cấp 5 (+25% Tu Vi, +10% sản lượng), Cấp 10 (+60% Tu Vi toàn cục, +20% hồi phục, +10% tỷ lệ đột phá).
     - Cấu hình 5 Cấp Động Phủ (`ABODE_LEVELS`): Mở khóa số ô đất (6 -> 12 ô) và số đệ tử thu nạp (1 -> 3 đệ tử).
     - Cấu hình Thổ Nhưỡng Dị Biến (`SOIL_CONFIGS`):
       - `Hoàng Thổ Thường`: Tiêu chuẩn thích ứng mọi hạt giống.
       - `Hàn Băng Thổ`: Giảm 40% thời gian thảo dược hệ Thủy/Băng, 30% rớt thêm Linh Ngọc Băng hệ.
       - `Hỏa Diễm Thổ`: Giảm 40% thời gian thảo dược hệ Hỏa, tăng 50% sản lượng thu hoạch.
     - Hệ thống phân bón:
       - Tự động tích lũy phân bón từ các linh thú thả rông trong Linh Thú Viên (`tickBeastFertilizer`).
       - Bón phân (`applyFertilizerToPlot`): Giảm ngay 30% (Yêu Thú Phân) hoặc 50% (Thần Thú Phân) thời gian chín còn lại của cây.
     - Hệ thống Đệ Tử Bái Sư:
       - Chiêu mộ ngẫu nhiên với 4 phẩm cấp tư chất (Hạ, Trung, Thượng, Thiên Kiêu Chi Tử) gia tăng tỷ lệ theo phẩm cấp bí kíp trưng bày tại Tàng Kinh Các.
       - Cống nạp bổng lộc chu kỳ 12 giờ: Nhận Linh Thạch, Danh Vọng Tiên Môn và Thảo Dược ngẫu nhiên (`claimDiscipleTribute`).
  3. **Tích Hợp Buff Tu Vi Toàn Cục (`lib/game-logic/cultivation.ts`):**
     - Bổ sung `spiritArrayBonus = (player.abodeState?.spiritArray?.tuViRateBonus || 0) / 100` vào công thức tính `totalSpeedMultiplier` của `processCultivation()`.
  4. **Hook Quản Lý Tương Tác (`hooks/useAbodeActions.ts`):**
     - Quản lý nâng cấp trận pháp, thăng cấp động phủ, mở khóa ô đất, cải tạo thổ nhưỡng, gieo hạt, thu hoạch nhanh, bón phân, thả thú, thu gom phân bón, trưng bày công pháp, tuyển mộ và thu bổng lộc đệ tử.
     - Cập nhật notification badge thời gian thực khi có đệ tử nộp bổng lộc, cây chín hoặc có phân bón.
  5. **Giao Diện Sa Bàn Động Phủ Cổ Phong (`components/abode/AbodeHubModal.tsx`):**
     - Thiết kế sa bàn cổ phong lộng lẫy với 4 phân khu:
       - **Trung Ương: Tụ Linh Đạo Đài** với vòng tròn Bát Quái xoay chuyển phát quang và hiệu ứng gia trì.
       - **Tây Dực: Huyền Thiên Dược Viên** lưới 12 ô đất với màu sắc thổ nhưỡng dị biến, thanh tiến độ thời gian thực, nút Gieo Hạt, Cải Tạo Đất, Bón Phân, Thu Hoạch.
       - **Đông Dực: Linh Thú Thảo Nguyên** với 3 đài thả rông, đồng hồ chu kỳ sinh phân và nút Thu Gom Linh Phân.
       - **Bắc Dực: Tàng Kinh Các & Chấp Sự Đường** với giá ngọc trưng bày 5 bộ bí kíp và danh sách đệ tử bái sư kèm tư chất, nút nhận bổng lộc, hạ sơn.
  6. **Nút Truy Cập Nhanh HeaderNav (`components/dashboard/HeaderNav.tsx`):**
     - Bổ sung nút bấm phát quang **"🏯 Động Phủ"** trên HeaderNav cạnh Cốt Truyện và Đấu Giá Hội, tích hợp huy hiệu chấm đỏ thông báo.
  7. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts` & `lib/game-logic/character.ts`):**
     - Cập nhật `normalizePlayerData()`: Tự động di trú an toàn dữ liệu từ `linhDien` cũ sang `abodeState.plots` 12 ô mới, bảo lưu 100% thảo dược đang sinh trưởng và dữ liệu linh thú, công pháp.

- **Kết Quả Kiểm Thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Hoàn thành xuất sắc 100% với Exit code 0.

---

### [2026-09-29 04:00] - Tách Biệt Sub-tabs Đạo Lữ vs Linh Thú & Mở Rộng Hệ Sinh Thái Vật Phẩm Vạn Bảo Thương Hội
- **Vấn đề đã giải quyết (Tab Overload & Item Conflict Resolution):**
  - Tách rời triệt để thanh bộ lọc danh mục và kho hàng Thương Hội giữa **Đạo Lữ** (Quà tặng tiên tử, Tín vật định tình / Song tu) và **Linh Thú** (Đan dược cho thú, Trứng linh noãn, Tỏa liên thuần phục, Giáp thú, Đan tiến hóa).
  - Khắc phục sự bất tiện do hai phân hệ gameplay hoàn toàn độc lập (`CompanionTab` vs `BeastTab`) nhưng trước đây bị gộp chung vào một tab `🌸 Đạo Lữ`.
  - Khắc phục tình trạng loãng danh mục và thiếu hụt quà tặng chuyên biệt cho dàn 8 đại tiên tử tiên giới.

- **Chi tiết thay đổi kỹ thuật:**
  1. **Schema & Kiểu Dữ Liệu (`lib/types/items.ts` & `lib/types/player.ts`):**
     - Mở rộng `MerchantCategory`: Bổ sung `'beasts'` độc lập bên cạnh `'companions'`.
     - Mở rộng `MerchantItem`: Thêm `companionItemType?: 'gift' | 'token'` và `beastItemType?: 'food' | 'egg' | 'tool' | 'armor' | 'evolution'`.
     - Cập nhật `PlayerStats`: Thêm các cờ sở hữu tín vật độc bản `dongTamKet?: boolean; uyenUongSongBoi?: boolean; huongTuiTinhNong?: boolean;`.
  2. **Kho Hàng & Phân Loại Thương Hội (`lib/merchant-data.ts`):**
     - Tách biệt hai nhóm hàng trong `generateMerchantInventory()`:
       - **Nhóm Đạo Lữ (`category: 'companions'`):**
         - Quà tặng 8 đại tiên tử (+30 đến +35 Hảo Cảm): `Băng Tinh Ngọc Trâm` (Lạc Thanh Tuyết, 2,500 LT), `Long Tủy Thần Chi` (Long Thiền Nhi, 4,500 LT), `Cửu Vĩ Linh Châu` (Dạ Mộng Ly, 4,500 LT), `Cổ Kiếm Tàn Phiến` (Kiếm Linh Tố Tâm, 4,500 LT), `Thanh Mộc Linh Hồ` (Diệp Chỉ Hàm / Liễu Như Yên, 3,000 LT), `Thất Thải Lưu Ly Trâm` (Sở Linh Nhi / Tần Vũ Mộng / Cơ Vô Diễm, 2,800 LT), `Huyền Âm Phượng Bội` (Nam Cung Uyển, 5,000 LT).
         - Tín vật độc bản: `Đồng Tâm Kết` (x2 Hảo Cảm đàm đạo, 6,000 LT), `Uyên Ương Song Bội` (+30% Tu Vi song tu, 18,000 LT), `Hương Túi Tình Nồng` (giảm 50% CD đàm đạo, 4,000 LT).
       - **Nhóm Linh Thú (`category: 'beasts'`):**
         - Thú Lương / Linh Thú Đan: Hạ Phẩm (Nhất Giai, 180 LT, +100 EXP), Trung Phẩm (Nhị Giai, 650 LT, +350 EXP), Thượng Phẩm (Tam Giai, 2,200 LT, +1,200 EXP), Cực Phẩm (Tứ Giai, 6,500 LT, +3,500 EXP).
         - Thảo dược bổ dưỡng: `Thú Hồn Thảo` (Nhị Giai, 450 LT, +20 Độ Trung Thành).
         - Ngự khí & Pháp bảo: `Thu Phục Tỏa Liên` (Tam Giai, 3,500 LT, +30% tỷ lệ bắt thú).
         - Trứng thần thú: `Linh Noãn Thần Bí` (Tứ Giai, 12,000 LT), `Hóa Long Noãn` (Ngũ Giai, 25,000 LT, ấp nở chắc chắn ra Thần Thú thái cổ).
         - Huyết mạch & Chiến giáp: `Huyết Mạch Thần Đan` (Tứ Giai, 8,500 LT, +15% Công/Thủ linh thú), `Huyền Thiết Thú Giáp` (Tam Giai, 4,200 LT, +300 HP & +50 Thủ).
     - Nâng cấp `matchMerchantCategory()`: Phân luồng tuyệt đối khi chọn `companions` (chỉ trả về đồ Đạo Lữ) và khi chọn `beasts` (chỉ trả về đồ Linh Thú).
     - Cập nhật `isOneTimeMerchantItem()` và `isItemAlreadyPurchased()` nhận diện và chống mua trùng cho `Đồng Tâm Kết`, `Uyên Ương Song Bội`, `Hương Túi Tình Nồng`, `Thu Phục Tỏa Liên`.
  3. **Giao Diện Thương Hội (`components/tabs/MerchantTab.tsx`):**
     - Nâng cấp thanh Sub-tabs ngang thành 10 danh mục: `✨ Toàn Bộ` | `⚡ Tu Luyện` | `🧘 Công Pháp` | `📜 Thần Thông` | `🌿 Dược Thảo` | `🌸 Đạo Lữ` | `🐾 Linh Thú` | `🎒 Trữ Vật` | `♻️ Thu Mua` | `💰 Tệ Điếm`.
     - Thiết kế hệ thống huy hiệu phân loại (Item Badges) cổ phong:
       - Phân hệ Đạo Lữ: `🌸 Quà Tặng` (hồng phấn), `💍 Tín Vật` (đỏ hoa hồng).
       - Phân hệ Linh Thú: `🍖 Thú Lương` (hổ phách), `🥚 Linh Noãn` (thanh lam), `⛓️ Ngự Khí` (huyền thiết), `🛡️ Thú Giáp` (lam sắc), `💊 Huyết Mạch` (tử sắc).
  4. **Tương Thích Lưu Trữ (`lib/save-migration.ts`):**
     - Cập nhật `normalizePlayerData()`: Tự động phân loại lại `category: 'beasts'` cho các item linh thú cũ trong `merchantState.items` của save game cũ.
     - Tự động bổ sung các mặt hàng mới vào shop của người chơi mà không cần xóa dữ liệu save.
  5. **Tích Hợp Gameplay & Logic Song Tu (`hooks/useMerchantInventoryActions.ts`, `hooks/useCompanionActions.ts`, `lib/companions-data.ts`):**
     - Xử lý mua sắm đầy đủ các mặt hàng mới: Đưa trứng vào `beastEggs`, cập nhật cờ sở hữu tín vật, đưa đan dược/linh thảo/giáp thú vào kho đồ.
     - Tích hợp hiệu ứng thực chiến:
       - `Đồng Tâm Kết`: Nhân đôi (+100%) điểm Hảo Cảm khi Đàm Đạo.
       - `Uyên Ương Song Bội`: Tăng thêm +30% Tu Vi sau mỗi lần Thiên Địa Song Tu.
       - `Hương Túi Tình Nồng`: Giảm 50% thời gian hồi chiêu Đàm Đạo.
       - `calculateGiftAffinity`: Bổ sung trọn vẹn điểm thưởng +30 đến +35 Hảo Cảm cho các món quà độc quyền của các tiên tử.

- **Kết Quả Kiểm Thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Hoàn thành xuất sắc 100% với Exit code 0.
  - Kiểm thử giao diện & dữ liệu: Tab `🌸 Đạo Lữ` và `🐾 Linh Thú` tách biệt 100%, không còn xung đột danh mục hay nhầm lẫn vật phẩm.

---

### [2026-09-29 03:30] - Tách Biệt Phân Loại Danh Mục (Sub-Tabs) & Chuẩn Hóa Huy Hiệu Vị Trí Trang Bị Vạn Bảo Thương Hội
- **Vấn đề đã giải quyết (Category Overload Solution):**
  - Khắc phục tình trạng gộp chung tất cả các loại sách vào một nhãn duy nhất `📜 Bí Tịch` (`category: 'manuals'`) và dòng chữ đơn điệu `Công Pháp / Bí Tịch`.
  - Tách bạch rõ ràng giữa **Công Pháp Tu Luyện** (Tâm Pháp bồi dưỡng Tu Vi/MP, Thể Thuật tăng HP/Thủ) với **Bí Tịch Thực Chiến** (Thần Thông xuất chiêu, Thân Pháp né đòn) và **Điển Tịch Kỹ Nghệ** (Đan Kinh, Đúc Thuật).
  - Đồng bộ trực quan hoàn hảo với hệ thống 4 vị trí trang bị trong Công Pháp Các (`[Tâm Pháp]`, `[Thể Thuật]`, `[Thần Thông 1]`, `[Thần Thông 2]`).

- **Chi tiết thay đổi kỹ thuật:**
  1. **Schema & Dữ liệu (`lib/types/items.ts` & `lib/merchant-data.ts`):**
     - Mở rộng `MerchantCategory` hỗ trợ `'skills'` độc lập cùng `'manuals'`.
     - Thêm trường `manualSlot?: 'tam_phap' | 'the_thuat' | 'than_thong' | 'than_phap' | 'artisan';` vào `MerchantItem`.
     - Gán chuẩn xác toàn bộ 34 mặt hàng sách trong `generateMerchantInventory()`:
       - **Công Pháp (`category: 'manuals'`):**
         - *Tâm Pháp (`manualSlot: 'tam_phap'`):* Dẫn Khí Quyết, Canh Kim Quyết, Trường Xuân Công, Huyền Thủy Chân Kinh, Cửu U Minh Vương Quyết, Thái Ất Quy Nguyên Quyết.
         - *Thể Thuật (`manualSlot: 'the_thuat'`):* Thiết Bố Sam (Sơ Cấp), Man Ngưu Kình, Bất Diệt Ma Thể, Hóa Long Biến, Cửu Chuyển Kim Thân Quyết.
         - *Kỹ Nghệ / Bách Nghệ (`manualSlot: 'artisan'`):* Vạn Thú Ngự Linh Kinh, Thần Nông Bách Thảo Lục, Tố Nữ Huyền Kinh, Bát Quái Khai Thiên Đồ, Thái Thượng Đan Kinh Tàn Quyển, Đan Kinh Thượng Cổ (Quyển Trung & Thượng), Bách Luyện Đúc Thuật, Thiên Công Đúc Thuật Tàn Thiên.
       - **Thần Thông (`category: 'skills'`):**
         - *Thần Thông Xuất Chiêu (`manualSlot: 'than_thong'`):* Toái Thạch Quyền, Canh Kim Kiếm Khí, Thái Ất Huyền Băng Kiếm, Đại Địa Liệt Chấn, Vạn Kiếm Quy Tông (Tứ Giai), Định Thân Thuật, Thái Sơ Cửu Kiếp Lôi, Bát Hoang Liệt Hỏa Chưởng, Thần Niệm Hóa Kiếm, Hỗn Độn Khai Thiên Quyết.
         - *Thân Pháp Khinh Công (`manualSlot: 'than_phap'`):* Thảo Thượng Phi, Du Long Bộ, Phong Lôi Huyễn Ảnh Dực, Hư Không Độn Thuật.
     - Cập nhật hàm `matchMerchantCategory(item, selectedTab)`:
       - Khi chọn `manuals`: Khớp `category === 'manuals'`, hoặc `manualSlot === 'tam_phap' | 'the_thuat' | 'artisan'`; loại trừ kỹ năng thực chiến.
       - Khi chọn `skills`: Khớp `category === 'skills'`, hoặc `manualSlot === 'than_thong' | 'than_phap'`.
     - Cập nhật `isOneTimeMerchantItem(item)`: Nhận diện cả `skills` và các item có `manualSlot`.
  2. **Giao Diện Thương Hội (`components/tabs/MerchantTab.tsx`):**
     - Mở rộng thanh Sub-tabs ngang thành 9 danh mục chuyên biệt: `✨ Toàn Bộ`, `⚡ Tu Luyện`, `🧘 Công Pháp`, `📜 Thần Thông`, `🌿 Dược Thảo`, `🌸 Đạo Lữ`, `🎒 Trữ Vật`, `♻️ Thu Mua`, `💰 Tệ Điếm`.
     - Xóa bỏ dòng chữ gộp chung `Công Pháp / Bí Tịch`.
     - Tích hợp helper `getItemManualSlot(item)` hiển thị huy hiệu vị trí trang bị cổ phong:
       - `🧘 Tâm Pháp`: Huy hiệu nền tím huyền bí (`bg-purple-950/80 border-purple-700/50 text-purple-300`).
       - `🩸 Thể Thuật`: Huy hiệu nền đỏ xích huyết (`bg-rose-950/80 border-rose-700/50 text-rose-300`).
       - `⚔️ Thần Thông`: Huy hiệu nền hoàng kim (`bg-amber-950/80 border-amber-700/50 text-amber-300`).
       - `💨 Thân Pháp`: Huy hiệu nền ngọc bích thanh phong (`bg-emerald-950/80 border-emerald-700/50 text-emerald-300`).
       - `📜 Kỹ Nghệ`: Huy hiệu nền nâu hổ phách cổ điển (`bg-zinc-900 border-amber-800/40 text-amber-400`).
  3. **Tương Thích Ngược & Di Trú Lưu Trữ (`lib/save-migration.ts`):**
     - Cập nhật cơ chế nạp save: Tự động cập nhật `category` và `manualSlot` mới nhất cho các hàng hóa đã có trong save cũ.
     - Đồng bộ cả `manuals` và `skills` khi bổ sung hàng hóa mới vào cửa hàng.

- **Kết Quả Kiểm Thử:**
  - `npx tsc --noEmit`: 0 lỗi (Exit code 0).
  - `npm run build`: Hoàn thành xuất sắc 100% với Exit code 0.
  - Kiểm định dữ liệu: 34/34 vật phẩm sách phân bổ chính xác (20 Công Pháp, 14 Thần Thông), không có chồng lấn (0 overlap).

---

### [2026-09-29 02:50] - Mở Rộng Kho Tàng 26 Bí Tịch Công Pháp (Nhất Giai -> Thần Giai), Cộng Hưởng Ngũ Hành & Cân Bằng Kinh Tế Vạn Bảo Thương Hội
- **Mục đích & Bối cảnh:**
  1. **Cứu sống trải nghiệm khởi đầu (Early Game):** Trước đây danh mục Công Pháp trong Thương Hội thiếu hoàn toàn các bí kíp Nhất Giai & Nhị Giai giá bình dân, người chơi Phàm Nhân & Luyện Khí không có gì để mua và lắp vào 4 ô: `[Tâm Pháp]`, `[Thể Thuật]`, `[Thần Thông 1]`, `[Thần Thông 2]`.
  2. **Khai phóng cơ chế Cộng Hưởng Ngũ Hành & Dị Hệ (+50% Uy Lực):** Bổ sung đa dạng các hệ Kim, Mộc, Thủy, Hỏa, Thổ, Lôi, Phong, Băng, Ám để người chơi phối hợp hoàn hảo với Linh Căn của nhân vật.
  3. **Mở rộng chiều sâu Bách Nghệ & Phụ Trợ:** Liên kết chặt chẽ các phân hệ vệ tinh (Ngự Thú, Linh Điền, Đạo Lữ, Mệnh Bàn) thông qua các bí tịch chuyên dụng.

- **Chi tiết 26 Bí Kíp Mới theo 4 Nhóm Phân Tầng:**
  1. **Nhóm Sơ Cơ (Nhất Giai & Nhị Giai - Phàm Nhân & Luyện Khí 1-10, 50 - 480 Hạ Phẩm Linh Thạch):**
     - `tp_dan_khi_quyet` (Dẫn Khí Quyết - Nhất Giai Ngũ Hành, 60 LT): +10% Tu Vi/giây, +150 Chân Nguyên tối đa (Max MP).
     - `tt_thiet_bo_sam_so_cap` (Thiết Bố Sam Sơ Cấp - Nhất Giai Thổ, 50 LT): +40 Phòng Ngự, +250 Khí Huyết (HP).
     - `tt_toai_thach_quyen` (Toái Thạch Quyền - Nhất Giai Thổ, 55 LT): +80 Công Kích, +10 Phá Giáp phẳng.
     - `tt_thao_thuong_phi` (Thảo Thượng Phi - Nhất Giai Phong, 60 LT): +15 Tốc Độ, +5% Né Tránh tự nhiên.
     - `tp_canh_kim_quyet` (Canh Kim Quyết - Nhị Giai Kim, 350 LT): +18% Tu Vi/giây, +10% Sát thương hệ Kim, +300 Max MP.
     - `tp_truong_xuan_cong` (Trường Xuân Công - Nhị Giai Mộc, 380 LT): +20% Tu Vi/giây, tự hồi 1% Khí Huyết mỗi hiệp đấu, +250 Max MP.
     - `tt_man_nguu_kinh` (Man Ngưu Kình - Nhị Giai Thổ, 400 LT): +10% Khí Huyết, +8% Phòng Ngự, +50 Công Kích.
     - `tt_canh_kim_kiem_khi` (Canh Kim Kiếm Khí - Nhị Giai Kim, 450 LT): +160 Công Kích, +15% Sát thương hệ Kim, +5% Bạo Kích.
     - `tt_du_long_bo` (Du Long Bộ - Nhị Giai Thủy, 480 LT): +25 Tốc Độ, +8% Né Tránh tự nhiên, +10% Tỉ lệ kích hoạt Đòn Kép.
  2. **Nhóm Trung Cơ (Tam Giai & Tứ Giai - Trúc Cơ & Kim Đan, 5,500 - 38,000 Linh Thạch):**
     - `tp_huyen_thuy_chan_kinh` (Huyền Thủy Chân Kinh - Tam Giai Thủy, 5,500 LT): +25% Tu Vi/giây, +800 Max MP, giảm 15% tiêu hao MP khi dùng kỹ năng.
     - `tt_bat_diet_ma_the` (Bất Diệt Ma Thể - Tam Giai Ám, 6,800 LT): +20% Khí Huyết, +15% Phòng Ngự, +3% Miễn Thương.
     - `tt_thai_at_huyen_bang` (Thái Ất Huyền Băng Kiếm - Tam Giai Băng, 7,200 LT): +380 Công Kích, +20% Băng hệ dmg, 25% tỷ lệ làm chậm đối thủ 20% Tốc Độ.
     - `tt_dai_dia_liet_chan` (Đại Địa Liệt Chấn - Tam Giai Thổ, 7,500 LT): +420 Công Kích, +25% Xuyên Giáp đối thủ.
     - `tt_phong_loi_huyen_anh` (Phong Lôi Huyễn Ảnh Dực - Tam Giai Phong, 8,000 LT): +40 Tốc Độ, +12% Né Tránh, +15% Tỉ lệ Đòn Kép.
     - `tp_cuu_u_minh_vuong` (Cửu U Minh Vương Quyết - Tứ Giai Ám, 28,000 LT): +30% Tu Vi/giây, +15% Hút Máu, -10 Tâm Cảnh.
     - `tt_hoa_long_bien` (Hóa Long Biến - Tứ Giai Hỏa, 35,000 LT): +25% Khí Huyết, +18% Phòng Ngự, +200 Công Kích, +5% Kháng Bạo.
     - `tt_van_kiem_quy_tong_cuc_pham` (Vạn Kiếm Quy Tông Tứ Giai - Tứ Giai Kim, 36,000 LT): +750 Công Kích, +30% Sát thương hệ Kim, +15% Bạo Kích.
     - `tt_dinh_than_thuat` (Định Thân Thuật - Tứ Giai Quang/Thần Thức, 38,000 LT): +80 Thần Thức, 20% tỷ lệ khiến đối thủ mất lượt đánh đầu trận.
  3. **Nhóm Bí Truyền Bách Nghệ & Phụ Trợ Tiên Gia (9,000 - 35,000 Linh Thạch):**
     - `tp_van_thu_ngu_linh` (Vạn Thú Ngự Linh Kinh - Tam Giai Ngự Thú, 9,500 LT): +30% EXP Linh Thú xuất chiến, +15% chỉ số hỗ trợ nhân vật.
     - `tp_than_nong_bach_thao` (Thần Nông Bách Thảo Lục - Tam Giai Linh Điền, 9,000 LT): Rút ngắn 20% thời gian sinh trưởng Linh Điền, +15% sản lượng thảo dược thu hoạch.
     - `tp_to_nu_huyen_kinh` (Tố Nữ Huyền Kinh - Tứ Giai Đạo Lữ, 32,000 LT): +25% hiệu quả Tu Vi và buff thuộc tính khi Song Tu cùng Đạo Lữ.
     - `tp_bat_quai_khai_thien` (Bát Quái Khai Thiên Đồ - Tứ Giai Mệnh Bàn, 35,000 LT): +10% hiệu lực của mọi Tổ Hợp Mệnh Cách (Synergies) đang khảm nạp.
  4. **Nhóm Cao Giai & Thần Giai (Ngũ Giai, Lục Giai, Đấu Giá Hội & Bí Cảnh Tầng Sâu):**
     - `tt_thai_so_cuu_kiep_loi` (Thái Sơ Cửu Kiếp Lôi - Ngũ Giai Lôi, 210,000 LT): +950 Công Kích, +35% Lôi hệ dmg, +25% Bạo Kích, bỏ qua 30% giáp.
     - `tp_hoa_than_quy_khu` (Hóa Thần Quy Khư Điển - Thần Giai Hỗn Độn, 450,000 LT / Đấu Giá Hội): +45% Tu Vi/giây, +1,800 Max MP, +200 Thần Thức, giảm 20% nguy cơ Tâm Ma.
     - `tt_bat_hoang_bat_diet` (Bát Hoang Bất Diệt Thể - Thần Giai Thổ, 520,000 LT / Đấu Giá Hội): +40% Khí Huyết, +35% Phòng Ngự, +8% Miễn Thương, hồi 4% Khí Huyết mỗi hiệp.
     - `tt_than_ma_nhat_niem` (Thần Ma Nhất Niệm Trảm - Thần Giai Ám, 650,000 LT / Đấu Giá Hội): +1,500 Công Kích, +40% ST Bạo Kích, gây 20% Sát Thương Chuẩn (True DMG).

- **Kiến Trúc & Phân Phối Kỹ Thuật:**
  - `lib/manuals-data.ts`: Đăng ký toàn diện 26 bí kíp mới vào `DEFAULT_MANUALS` với đầy đủ cấp độ, tiêu hao, điều kiện ngộ tính, kỹ năng chủ động (`activeSkill`) và nội tại viên mãn (`maxLevelPassive`).
  - `lib/merchant-data.ts`:
    - Đưa toàn bộ các bí kíp mới vào danh mục `manualItems` với cờ `isOneTime: true`.
    - Bảo toàn giá cố định của vật phẩm trong kho hàng (`(item.price !== undefined && item.price > 0) ? item.price : standardPrice`).
  - `lib/auction-data.ts` & `lib/auction-logic.ts`:
    - Thêm 3 lô đấu giá cực phẩm: `lot_hoa_than_quy_khu_dien`, `lot_bat_hoang_bat_diet_the`, `lot_than_ma_nhat_niem_tram`.
    - Liên kết trực tiếp kho mẫu `DEFAULT_MANUALS` khi người chơi thắng đấu giá để khởi tạo đầy đủ thuộc tính kỹ năng.
  - `lib/secret-realm-data.ts` & `lib/secret-realm-logic.ts`:
    - Thêm trường `manualChance` vào cấu hình rương báu: Cổ Mộc (15%), Hoàng Kim (40%), Thái Hư (80%).
    - Rơi tàn quyển bí kíp công pháp theo phân tầng phẩm cấp và chuyển giao tự động vào Túi Đồ khi hoàn thành bí cảnh.
  - `lib/save-migration.ts`:
    - Quét toàn bộ `manuals`, `inventory.manuals`, `inventory.books`, `learnedManuals` để đưa vào `purchasedOneTimeIds`, ngăn chặn triệt để tình trạng mua trùng.
    - Tự động bổ sung các bí tịch mới vào `merchantState.items` của save cũ để người chơi tiếp cận ngay lập tức mà không cần đợi xoay tua shop.
  - `components/tabs/MerchantTab.tsx`:
    - Tích hợp kiểm tra `isItemAlreadyPurchased(item, player)` đồng bộ với `isPermanentSoldOut`, hiển thị nhãn `[Đã Sở Hữu]` và vô hiệu hóa nút mua chính xác.

---

### [2026-09-29 02:35] - Mở Rộng Cốt Truyện Phân Nhánh: Chương V (Kim Đan), Chương VI (Nguyên Anh) & Chương VII (Hóa Thần)
- **Mục đích:**
  1. **Mở rộng toàn diện hệ thống Cốt Truyện Phân Nhánh & Nhiệm Vụ Chính Tuyến:**
     - Nâng cấp từ 4 chương (Phàm Nhân $\rightarrow$ Trúc Cơ) lên **7 chương kinh điển**, dẫn dắt người chơi qua 3 đại cảnh giới đỉnh phong của giới tu chân: **Kim Đan Cảnh (16-20) $\rightarrow$ Nguyên Anh Cảnh (21-25) $\rightarrow$ Hóa Thần Cảnh (26-30)**.
     - Mỗi chương gồm 3 hồi cốt truyện kinh điển (tổng cộng 9 hồi mới), tích hợp cơ chế **Lựa Chọn Phân Nhánh (Branching Choices)** có chiều sâu tâm lý, biến đổi trực tiếp **Khí Vận, Tâm Cảnh, Công Thủ, Thần Thức, Bạo Kích, Danh Hiệu Tiên Giới và Kỳ Trân Bảo Vật**.
  2. **Chi tiết 3 Chương mới:**
     - **Chương V: Cửu Chuyển Ngưng Đan (`chap_5`, Kim Đan Sơ Kỳ - Cảnh giới 16+):**
       - *Hồi 1: Dị Hỏa Xuất Thế (`quest_5_1`):* Lựa chọn [A - Đoạt Hỏa Cường Hoành] (+15 Công Kích, +10 Khí Vận, -5 Tâm Cảnh) hoặc [B - Dẫn Hỏa Quy Nguyên] (+20 Tâm Cảnh, +10 Ngộ Tính).
       - *Hồi 2: Cửu Chuyển Ngưng Đan (`quest_5_2`):* Lựa chọn [A - Cố Bản Cầu An] (+25 Phòng Ngự, +30,000 Tu Vi) hoặc [B - Nghịch Thiên Đúc Đan] (+15% Bạo Kích, +25 Khí Vận, nhận Danh hiệu Thiên Phẩm: *Cửu Chuyển Đan Tôn*).
       - *Hồi 3: Huyết Tẩy Ma Đồ (`quest_5_3`):* Lựa chọn [A - Trảm Thảo Trừ Căn] (+25 Công Kích, nhận Cổ Bảo: *Trảm Ma Kiếm Thai*) hoặc [B - Khai Trận Hộ Chúng] (+25 Danh Vọng, +20 Tâm Cảnh, +10,000 Linh Thạch).
     - **Chương VI: Hóa Anh Độ Kiếp (`chap_6`, Nguyên Anh Sơ Kỳ - Cảnh giới 21+):**
       - *Hồi 1: Đan Toái Anh Sinh (`quest_6_1`):* Lựa chọn [A - Thiết Huyết Nhẫn Nhục] (+30 Căn Cốt, +15% Miễn Thương) hoặc [B - Thần Niệm Hóa Hư] (+40 Thần Thức, +45,000 Tu Vi).
       - *Hồi 2: Tâm Ma Vấn Tình (`quest_6_2`):* Lựa chọn [A - Trảm Tình Vấn Đạo] (+25 Ngộ Tính, +20% ST Bạo) hoặc [B - Hữu Tình Chi Đạo] (+30 Tâm Cảnh, nhận Danh hiệu Thiên Phẩm: *Đa Tình Kiếm Tiên*).
       - *Hồi 3: Đoạn Diệt Cừu Gia (`quest_6_3`):* Lựa chọn [A - Diệt Môn Quả Quyết] (+30 Công Kích, +50,000 Linh Thạch) hoặc [B - Phế Tu Vi Khai Ân] (+35 Tâm Cảnh, +20 Khí Vận).
     - **Chương VII: Hóa Thần Vấn Đạo (`chap_7`, Hóa Thần Sơ Kỳ - Cảnh giới 26+):**
       - *Hồi 1: Hóa Phàm Trăm Năm (`quest_7_1`):* Lựa chọn [A - Khắc Tượng Ngộ Đạo] (+35 Ngộ Tính, +30 Tâm Cảnh) hoặc [B - Hồng Trần Du Lịch] (+25 Khí Vận, +20 Thần Thức).
       - *Hồi 2: Sinh Tử Ý Cảnh (`quest_7_2`):* Lựa chọn [A - Tịch Diệt Ý Cảnh] (+40 Công Kích, +25% ST Bạo, mở khóa Tuyệt Diệt) hoặc [B - Sinh Sinh Bất Tức] (+30% Khí Huyết, +35 Căn Cốt).
       - *Hồi 3: Khai Mở Thần Chi Lĩnh Vực (`quest_7_3`):* Lựa chọn [A - Vạn Cổ Duy Ngã] (+50 Công Kích, nhận Danh hiệu Thần Phẩm độc quyền: *Hóa Thần Thiên Tôn*) hoặc [B - Thiên Đạo Tự Nhiên] (+35 Phòng Ngự, +35 Thần Thức, nhận Tiên Thiên Linh Bảo: *Thái Hư Hồn Ngọc*).
  3. **Hạ tầng logic & Giao diện:**
     - `lib/storyline-logic.ts`: Mở rộng `applyChoiceOutcomes` xử lý trọn vẹn toàn bộ biến động chỉ số (Công, Thủ, Căn Cốt, Ngộ Tính, Thần Thức, Bạo Kích, ST Bạo, Miễn Thương, Khí Huyết, Danh Vọng, Pháp Bảo, Danh hiệu).
     - `lib/storyline-logic.ts`: Tối ưu hóa `autoCatchUpStorylineForHighRealm` tự động kích hoạt quest mới chưa làm khi người chơi ở cảnh giới cao mà không gây kẹt tiến trình.
     - `components/modals/StorylineModal.tsx`:
       - Bổ sung màu sắc, badge và avatar cho các nhân vật mới: `Đan Hỏa Chi Linh` (🔥), `Ma Đầu / Ma Tôn` (👹), `Tâm Ma Huyễn Ảnh` (🌀), `Cừu Gia Tộc Trưởng` (🧎), `Cổ Trấn Lão Nhân` (🪵), `Pháp Tướng Cự Thần` (⚡).
       - Render đầy đủ toàn bộ nhãn thuộc tính, vật phẩm và danh hiệu trong khung xem trước kết quả lựa chọn phân nhánh.
     - `lib/achievements-data.ts`: Bổ sung 3 danh hiệu mới vào `TITLES_CONFIG`: *Cửu Chuyển Đan Tôn* (Thiên Phẩm), *Đa Tình Kiếm Tiên* (Thiên Phẩm), *Hóa Thần Thiên Tôn* (Thần Phẩm).

- **Kết quả kiểm thử:**
  - `npx tsc --noEmit`: 0 errors (100% Type-safe).
  - `npm run build`: Exit code 0 (Next.js Turbopack build thành công).

---

### [2026-09-29 02:10] - Hệ Thống Nhịp Độ Chiến Đấu (Action Gauge • Thân Pháp / Đòn Kép / Né Tránh) & Mệnh Bàn Bát Quái Tiên Thiên (Destiny Slots & Synergies)
- **Mục đích:**
  1. **Nâng cấp toàn diện chỉ số "Tốc Độ":**
     - Thoát khỏi cơ chế so sánh tốc độ đơn giản (chỉ tính ai đánh trước), chuyển hóa Tốc Độ thành **Hệ thống Nhịp Độ Chiến Đấu & Thân Pháp (Action Gauge)**.
     - **Cơ chế Đòn Kép (Double Action):** Khi `Tốc Độ nhân vật >= 1.5 * Tốc Độ đối thủ`, nhận **35% tỷ lệ tung liên hoàn 2 đòn đánh trong cùng 1 lượt** với log chiến đấu đặc biệt `⚡ [THÂN PHÁP TIÊN CƠ • LIÊN KÍCH]`.
     - **Chỉ số Né Tránh Tự Nhiên (Evasion):** Quy đổi chênh lệch Tốc Độ thành tỷ lệ Né Đòn hoàn toàn (kẹp biên tối đa **25%**). Khi né đòn thành công, nhật ký chiến trận ghi nhận `💨 [Né Tránh • Huyễn Ảnh]` và triệt tiêu toàn bộ 100% sát thương của đòn đánh.
     - Đồng bộ trong cả 2 hệ thống chiến đấu: `lib/game-logic/combat.ts` (Chiến đấu dã ngoại / sự kiện) và `lib/boss-trial-data.ts` (Khiêu chiến Boss thế giới / Trấn Yêu Tháp).
  2. **Ghép nối "Mệnh Cách Bát Quái" (Mệnh Bàn Tiên Thiên):**
     - **Khung Mệnh Bàn (Destiny Slots):** Mở khóa từ 3 đến 5 ô khảm Mệnh Cách theo cảnh giới nhân vật (3 ô tại Luyện Khí, 4 ô tại Trúc Cơ, 5 ô tại Kim Đan trở lên).
     - **Tổ Hợp Mệnh Cách (Destiny Synergies):** Khi khảm đủ các cặp Mệnh Cách tương sinh tương khắc, lập tức kích hoạt tổ hợp cộng hưởng cực mạnh:
       - `[Sát Sinh Vấn Đạo]` + `[Huyết Khí Thao Thiên]` $\rightarrow$ **Ma Đạo Cực Hạn**: +20% Hút Máu, +15% Công Kích, -15 Tâm Cảnh.
       - `[Phúc Duyên Thâm Hậu]` + `[Khí Vận Hanh Thông]` $\rightarrow$ **Thiên Đạo Chi Tử**: Tăng gấp đôi tỉ lệ rơi Rương Thái Hư trong Bí Cảnh, tăng tỉ lệ phòng Bảo Rương và +40% tài nguyên rơi.
       - `[Kiếm Đạo Độc Tôn]` + `[Thiên Sát Cô Tinh]` $\rightarrow$ **Vô Tình Kiếm Đạo**: +25% Tỉ lệ Bạo Kích, +35% Sát Thương Bạo Kích, -10% Phòng Ngự.
       - `[Đại Năng Chuyển Thế]` + `[Hỗn Độn Đạo Thể]` $\rightarrow$ **Hỗn Độn Tiên Thai**: +30% Khí Huyết, +30% Chân Nguyên, +15% Phòng Ngự.
       - `[Đan Đạo Kỳ Tài]` + `[Thảo Mộc Chi Duyên]` $\rightarrow$ **Dược Thánh Tái Thế**: +35% Tỉ lệ thành công Luyện Đan, +25% Sản Lượng Thảo Dược thu hoạch từ Linh Điền.
     - **Tái thiết giao diện Mệnh Bàn:**
       - `DestinyCard.tsx`: Hiển thị số lượng ô khảm (X/Y Ô Khảm), danh sách thẻ mệnh cách đã nạp, và các huy hiệu tổ hợp cộng hưởng đang phát sáng.
       - `DestinyModal.tsx`: Giao diện 2 Tab gồm: **Bát Quái Mệnh Bàn** (Khảm nạp/Tháo gỡ 5 vị trí Càn Khôn Tốn Cấn Đoài, đồ phổ 5 đại tổ hợp, kho tàng mệnh cách đã thức tỉnh) và **Nghịch Thiên Cải Mệnh** (Bát Quái tế thiên đàn, quay mệnh cách bằng Cải Mệnh Đan hoặc 500 Linh Thạch).
       - `CombatStatsCard.tsx`: Tích hợp chú thích và nhãn phụ giải thích cơ chế Thân Pháp, Đòn Kép và Né Tránh Huyễn Ảnh trực tiếp trên thẻ chỉ số Tốc Độ.
     - **Tính tương thích ngược (Backward Compatibility):** Tự động chuyển đổi `player.destiny` cũ vào Mệnh Bàn mới mà không làm mất dữ liệu của người chơi.

- **Kết quả kiểm thử:**
  - `npx tsc --noEmit`: Mã thoát 0 (Không còn bất kỳ lỗi kiểu dữ liệu nào).
  - `npm run build`: Mã thoát 0 (Next.js Turbopack hoàn thành build tối ưu hóa và xuất tĩnh thành công).

---

### [2026-09-29 01:50] - Hoàn Thiện Hệ Thống Tu Luyện Thần Hồn (Soul Progression), Uy Áp Thần Thức Trong Combat, Thần Niệm Kiếm & Phân Thần Du Ngoạn AFK
- **Mục đích:**
  1. Hoàn thiện toàn diện nhánh **🔮 Thần Hồn (Soul Cultivation)** trên khối **Song Trục Tu Đạo (`TwinCultivationTrackCard.tsx`)**, khai phóng sức mạnh của chỉ số **Thần Thức (`player.thanThuc`)**.
  2. Xây dựng **4 Đại Cảnh Giới Thần Hồn** chuẩn tiên hiệp, mỗi đại cảnh giới gồm **9 Tiểu Tầng (Bậc 1/9 -> 9/9)**, tiêu hao U Hồn Thạch, Đan dược Dưỡng Thần và Linh Thạch để tôi hồn thăng tầng và đột phá.
  3. Tích hợp cơ chế **Uy Áp Thần Thức (Combat Soul Suppression)** trong giao tranh (`lib/game-logic/combat.ts` & `lib/boss-trial-data.ts`):
     - So sánh tỷ lệ `suppressionRatio = player.thanThuc / Math.max(1, enemy.thanThuc)`.
     - Nếu $\ge 1.3$ (cao hơn từ 30% trở lên): Giảm vĩnh viễn **15% Tốc Độ** của địch trong trận đấu, kèm **20% tỉ lệ Chấn Nhiếp (Stun Turn 1)** làm đối thủ tê liệt mất lượt đầu.
     - Nếu $\le 0.7$ (thấp hơn 30% trở lên): Người chơi bị đối thủ áp chế ngược, giảm 10% Tốc Độ trong trận.
  4. Khai mở kỹ năng nội tại **🗡️ Thần Niệm Kiếm (Mind Blade)** từ Cảnh giới 2 (*Ngưng Hồn Hóa Kiếm* trở lên):
     - Tự động phóng xuất ngay đầu Turn 1 của mọi trận chiến, **bỏ qua 100% Giáp/Phòng Ngự của đối phương**, gây trực tiếp lượng **Sát Thương Chuẩn (True Damage)** = `Math.floor(player.thanThuc * 1.8 + playerSoulStage * 80)`.
     - Tại cảnh giới 4 (*Dương Thần Viên Mãn*), sát thương Thần Niệm Kiếm tăng thêm **+25%**.
  5. Xây dựng tính năng **🌌 Phân Thần Du Ngoạn (Astral Soul Expedition)** AFK độc lập mở khóa từ Cảnh giới 3 (*Nguyên Thần Xuất Khiếu*):
     - Cho phép tách thần niệm đi thám hiểm tìm Linh Dược / Khoáng Thạch độc lập mà **không cản trở việc bế quan thổ nạp** của bản thể nhân vật chính.
     - 3 Lộ trình du ngoạn chuyên biệt:
       1. *Dược Vương Cốc:* Thu hoạch Thảo Dược quý ngàn năm (Tẩy Tủy Thảo, Chu Quả, Hóa Long Thảo, U Hồn Thạch, Đan dược Dưỡng Thần).
       2. *Thái Hư Khoáng Mạch:* Thu hoạch Khoáng thạch quý (Huyền Thiết, U Tinh Thạch, Linh Ngọc ngũ hành thô, U Hồn Thạch).
       3. *Cổ Tu Tàn Động:* Thu hoạch Linh Thạch, Tàn Diệp Công Pháp, Tinh Huyết Yêu Thú và U Hồn Thạch.
     - 3 Mốc thời gian linh hoạt: **2 Giờ** (x1.0), **4 Giờ** (x2.2 - thưởng +10%), **8 Giờ** (x5.0 - thưởng +25%).
     - Tích hợp modal giao diện cổ phong lộng lẫy (`AstralSoulExpeditionModal.tsx`), đồng hồ đếm ngược thời gian thực, nút "Thu Hồi Phân Thần" nhận chiến lợi phẩm chuyển thẳng vào túi đồ.

- **Các thành phần triển khai & điều chỉnh:**
  - `lib/types/cultivation.ts`, `lib/types/character.ts`, `lib/types/player.ts`:
    - Định nghĩa `SoulStageConfig`, `ExpeditionDestinationId`, `SoulExpeditionState`, `PlayerSoulState`.
    - Mở rộng `PlayerStats` chuẩn hóa các trường `thanThuc`, `maxMp`, `mp`, `soulCultivation`.
  - `lib/soul-cultivation-data.ts`:
    - Khởi tạo dữ liệu 4 Đại Cảnh Giới `SOUL_STAGES_CONFIG`:
      - *Khai Mở Thức Hải (Tầng 1-9):* +120 MP/bậc, +15 Thần Thức/bậc; giảm 10% tiêu hao MP Bí Cảnh.
      - *Ngưng Hồn Hóa Kiếm (Tầng 1-9):* +200 MP/bậc, +35 Thần Thức/bậc, +0.8% Bạo kích/bậc; mở khóa Thần Niệm Kiếm hiệp 1.
      - *Nguyên Thần Xuất Khiếu (Tầng 1-9):* +350 MP/bậc, +60 Thần Thức/bậc; mở khóa Phân Thần Du Ngoạn.
      - *Dương Thần Viên Mãn (Tầng 1-9):* +600 MP/bậc, +100 Thần Thức/bậc; miễn nhiễm mê muội/chấn nhiếp, +25% sát thương Thần Niệm Kiếm.
    - Cấu hình tỉ lệ rơi vật phẩm từ 3 bãi Phân Thần Du Ngoạn (`EXPEDITION_DESTINATIONS`, `EXPEDITION_DURATIONS`).
    - Cung cấp các hàm logic: `getSoulCultivationProgression()`, `canUpgradeSoulProgression()`, `performUpgradeSoulProgression()`, `startSoulExpedition()`, `claimSoulExpedition()`, `countSoulStones()`, `countSoulPills()`.
  - `lib/alchemy-data.ts`:
    - Bổ sung vật phẩm đan dược `item_duong_than_dan` (Dưỡng Thần Đan) vào `PILL_TEMPLATES` và `item_u_hon_thach` (U Hồn Thạch) vào `DEFAULT_ORES`.
  - `lib/game-logic/combat.ts` & `lib/boss-trial-data.ts`:
    - Triển khai tính toán `suppressionRatio`, trừ 15% speed quái vật, roll 20% Stun Turn 1, áp chế 10% speed người chơi nếu yếu thế.
    - Triển khai đòn Thần Niệm Kiếm Turn 1 gây True Damage bỏ qua giáp, bổ sung đầy đủ mô tả chiến báo (`flavorText`).
  - `hooks/useTwinCultivationActions.ts`:
    - Hook chuyên trách điều phối song trục: `handleUpgradeBodyCultivation`, `handleSoulCultivateUpgrade`, `handleStartSoulExpedition`, `handleClaimSoulExpedition`.
  - `components/dashboard/left/TwinCultivationTrackCard.tsx` & `AstralSoulExpeditionModal.tsx`:
    - Hoàn thiện Tab Thần Hồn: hiển thị danh xưng cảnh giới, tiến độ Thức Hải, chỉ số Chân Nguyên & Thần Thức tăng thêm, đặc quyền cảnh giới (Thần Niệm Kiếm, Phân Thần Du Ngoạn), chi phí nguyên liệu và nút bấm Tôi Hồn Thăng Tầng / Đột Phá Đại Cảnh Giới.
    - Modal Phân Thần Du Ngoạn: giao diện chọn bãi du ngoạn, chọn mốc thời gian, đếm ngược thời gian thực và thu hoạch phần thưởng.
  - `components/dashboard/LeftColumn.tsx` & `components/GameDashboard.tsx`:
    - Truyền tải trơn tru các props hành động từ `useTwinCultivationActions` xuống `TwinCultivationTrackCard`.
  - `lib/save-migration.ts`:
    - Chuẩn hóa an toàn `soulCultivation` và `thanThuc`, tương thích 100% với các save dữ liệu cũ từ v1-v7.

- **Kết quả kiểm thử:**
  - `npx tsc --noEmit`: Đạt **0 lỗi (Exit code 0)**.
  - `npm run build`: Hoàn thành xuất sắc với **Exit code 0** (8/8 static routes & API route handlers biên dịch trơn tru).

---

### [2026-09-29 01:30] - Tối Ưu Hóa Mật Độ Hiển Thị Giao Diện (UI Density & Compact Layout): Kéo Dài Nhật Ký Tu Tiên & Vạn Bảo Thương Hội
- **Mục đích:**
  1. Tối ưu tỷ lệ hiển thị và mật độ giao diện tổng thể để thu nhỏ không gian dư thừa theo chiều dọc, giúp người dùng bao quát toàn bộ 3 cột trong 1 tầm mắt (đặc biệt trên màn hình 1080p).
  2. Kéo dài khung **Nhật Ký Tu Tiên** (Cột Giữa) từ việc chỉ thấy 1-2 dòng sự kiện lên hiển thị cùng lúc **8 đến 12 biến cố tu luyện**.
  3. Kéo dài danh sách hàng hóa **Vạn Bảo Thương Hội** (Cột Phải) từ 2 vật phẩm lên hiển thị **4 đến 6 vật phẩm cùng lúc**.
  4. Thu gọn Banner **Vạn Bảo Đấu Giá Hội** từ dạng hộp to dọc (~130px) thành **Slim Horizontal Banner (Thanh ngang mỏng ~40px)**, tiết kiệm ~80px chiều cao cho danh sách hàng hóa bên dưới.
- **Các thành phần điều chỉnh:**
  - `components/GameDashboard.tsx`:
    - Áp dụng tỷ lệ co nhẹ `style={{ zoom: 0.93 }}` trên thẻ `<main>` bọc 3 cột, co gọn lề và khoảng cách `px-2 sm:px-3 py-1.5 sm:py-2 gap-2.5`.
    - Thu nhỏ padding container thẻ tab Cột Phải (`p-2.5 sm:p-3`), co kích thước 10 nút tab xuống `py-1 text-[10px] sm:text-[10.5px]`.
  - `components/dashboard/HeaderNav.tsx`:
    - Giảm padding dọc từ `py-2.5` xuống `py-1.5 sm:py-2`.
    - Thu gọn logo container còn `w-8 h-8 sm:w-9 sm:h-9 text-lg`.
    - Thu gọn toàn bộ badges hiển thị thông số và các nút thao tác nhanh (Cốt Truyện, Đấu Giá Hội, Thành Tựu, Lưu Game, Tẩy Tủy) thành `px-2.5 py-1 text-xs`.
  - `components/dashboard/MiddleColumn.tsx`:
    - Thu gọn 2 khối trên (Bế Quan Thổ Nạp & Đột Phá Cảnh Giới): giảm padding thẻ xuống `p-2.5 sm:p-3`, nút chọn thời gian `text-[9.5px] py-0.5`, thanh trượt `space-y-0.5`, nút bấm hành động `py-2 px-3 text-xs`.
    - Widget Nhiệm vụ chính tuyến: tinh chỉnh gọn gàng `px-3 py-1.5 rounded-lg`.
    - Khung **Nhật Ký Tu Tiên**: thiết lập `flex-1 min-h-[360px]`, khoảng cách danh sách log `space-y-1.5`, thẻ log `p-2` với chữ `leading-snug text-[10.5px]` hiển thị liền mạch 8–12 sự kiện.
  - `components/tabs/MerchantTab.tsx`:
    - Banner Vạn Bảo Đấu Giá Hội: chuyển đổi thành thanh ngang `py-1.5 sm:py-2 px-3` một dòng với icon búa/🏛️, tiêu đề, badge Đang Mở và nút "Vào Đấu Giá Hội", giải phóng ngay ~80px chiều cao.
    - Header Thương Hội: giảm padding xuống `py-1.5 px-3 sm:px-3.5`.
    - Danh sách hàng hóa: thiết lập `min-h-[420px] space-y-2`, thẻ hàng hóa `p-2 sm:p-2.5 space-y-1.5` với mô tả `line-clamp-2`, nút Mua `px-2.5 py-1 text-[10.5px]`, cho phép hiển thị cùng lúc 4–6 vật phẩm.
  - `components/dashboard/LeftColumn.tsx`:
    - Cân đối mật độ cột trái: `space-y-2.5 pr-1.5`, thẻ bao bọc `p-2.5 sm:p-3 space-y-2.5`.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit`: Đạt **0 lỗi (Exit code 0)**.
  - `npm run build`: Hoàn thành xuất sắc với **Exit code 0** (toàn bộ 8 trang tĩnh và Route Handlers đều biên dịch trơn tru).

---

### [2026-09-29 01:25] - Khắc Phục Triệt Để Lỗi 2 Thanh Cuộn (Double Scrollbars) Tại Vạn Bảo Thương Hội (MerchantTab)
- **Mục đích:**
  1. Loại bỏ hoàn toàn lỗi hiển thị 2 thanh cuộn dọc (Nested Vertical Scrollbars) song song gây rối mắt tại tab Vạn Bảo Thương Hội.
  2. Thiết lập kiến trúc **Single Scroll Container (Lựa chọn A - Pinned Header UX)**:
     - Cố định toàn bộ khu vực Header Thương Hội (Đạo hiệu, tổng ngân lượng 3 cấp Linh Thạch), Banner Vạn Bảo Đấu Giá Hội, thanh lọc danh mục 8 Sub-tabs và đồng hồ đếm ngược 24H ở trên cùng không bị trôi khi cuộn.
     - Cho phép danh sách hàng hóa/vật phẩm cuộn dọc mượt mà bên dưới, giải phóng toàn bộ không gian chiều cao còn lại thay vì bị giới hạn cứng bởi các class `max-h-[...]`.
  3. Xóa bỏ hoàn toàn thanh cuộn ngang và chống kích hoạt thanh cuộn dọc ngoài ý muốn tại thanh trượt Sub-tabs (`[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overflow-y-hidden`).
  4. Nâng cấp thanh cuộn dọc duy nhất còn lại theo chuẩn Cổ Phong Tiên Hiệp: sử dụng `.custom-scrollbar` siêu mảnh (5px), bo góc tròn hoàn hảo (`rounded-full / 9999px`), màu hổ phách/nâu tối đồng bộ với phong cách tiên hiệp.
- **Các thành phần điều chỉnh:**
  - `components/GameDashboard.tsx`:
    - Cập nhật container bọc tabs: áp dụng `overflow-hidden flex flex-col` riêng biệt khi `activeTab === 'merchant'` để triệt tiêu 100% thanh cuộn outer cấp cha.
  - `components/tabs/MerchantTab.tsx`:
    - Thẻ bọc ngoài chuyển thành flex container toàn chiều cao: `h-full flex flex-col min-h-0 space-y-2.5`.
    - Đóng gói Header, Đấu Giá Hội banner, và Sub-tabs bar vào khối `shrink-0 space-y-2.5` cố định trên đỉnh.
    - Thanh Sub-tabs: bổ sung `overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0` ngăn tràn viền và ẩn triệt để thanh cuộn ngang trên mọi trình duyệt.
    - Danh sách hàng hóa mua sắm (`merchantSubTab !== 'sell' && merchantSubTab !== 'exchange'`): loại bỏ `max-h-[460px]`, chuyển sang `flex-1 min-h-0 space-y-2.5 overflow-y-auto custom-scrollbar pr-1`.
    - Danh sách vật phẩm thanh lý (`merchantSubTab === 'sell'`): loại bỏ `max-h-[440px]`, chuyển sang `flex-1 min-h-0 space-y-2 overflow-y-auto custom-scrollbar pr-1`.
    - Khu vực đổi linh thạch (`merchantSubTab === 'exchange'`): chuyển sang `flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-3`.
  - `app/globals.css`:
    - Tinh chỉnh `.custom-scrollbar`: chiều rộng 5px, thumb bo tròn `border-radius: 9999px`, màu hổ phách `rgba(180, 83, 9, 0.35)` với viền phản quang `rgba(245, 158, 11, 0.15)`, hover `rgba(217, 119, 6, 0.65)`, active `rgba(245, 158, 11, 0.85)`.
- **Kết quả kiểm thử:**
  - `npx tsc --noEmit`: Đạt **0 lỗi (Exit code 0)**.
  - `npm run build`: Hoàn thành xuất sắc với **Exit code 0**.

---

### [2026-09-29 01:15] - Tái Cấu Trúc Toàn Diện Các Tệp Monolith (>500-600 LOC) Theo Chuẩn Clean Architecture
- **Mục đích:**
  1. Loại bỏ hoàn toàn các tệp mã nguồn đơn khối khổng lồ (Monolithic files) vượt quá ngưỡng bảo trì (>500 LOC đối với React Components `.tsx`, >600 LOC đối với Business Logic & Types `.ts`).
  2. Module hóa triệt để 3 tệp monolith lớn nhất dự án:
     - `components/dashboard/LeftColumn.tsx` (2,272 LOC) $\rightarrow$ Tách thành 9 component cards chuyên biệt trong `components/dashboard/left/`, container điều phối rút gọn còn **177 LOC**.
     - `lib/types.ts` (1,539 LOC) $\rightarrow$ Tách thành 13 domain type modules trong `lib/types/`, tệp gốc đóng vai trò Barrel Exporter tương thích ngược 100% (**6 LOC**).
     - `lib/game-logic.ts` (1,729 LOC) $\rightarrow$ Tách thành 7 pure logic modules trong `lib/game-logic/`, tệp gốc đóng vai trò Barrel Exporter tương thích ngược 100% (**15 LOC**).
  3. Đảm bảo bảo toàn 100% logic game, toán học cân bằng, công thức chiến đấu, tính năng UI và khả năng tương thích với tất cả các imports hiện có trong toàn bộ codebase.
- **Chi tiết các thành phần phân rã:**
  - **1. Phân rã `lib/types/` (13 Domain Type Modules):**
    - `lib/types/character.ts` (201 LOC): Định nghĩa thông số tu sĩ `PlayerStats`, `Physique`, `LinhCan`, `RebornInfo`, `Title`, `StatCapPerks`.
    - `lib/types/items.ts` (278 LOC): `InventoryItem`, `EquipmentItem`, `Pill`, `Ore`, `Herb`, `GemItem`, `ForgingAffix`, `EquipmentSlot`.
    - `lib/types/combat.ts` (153 LOC): `CombatEntity`, `CombatLogEntry`, `CombatStats`, `BossTrial`, `FloatingText`.
    - `lib/types/cultivation.ts` (194 LOC): `Realm`, `RealmStage`, `CultivationPosture`, `BreakthroughResult`, `ManualSynergy`.
    - `lib/types/dungeon.ts` (85 LOC): `DungeonRoomChoice`, `DungeonRunState`, `SecretRealmEncounter`, `SecretRealmAltarBuff`.
    - `lib/types/sect.ts` (98 LOC): `SectData`, `SectQuest`, `SectRank`, `LuanKiemOpponent`.
    - `lib/types/companions.ts` (95 LOC): `Companion`, `CompanionStoryStep`, `TwinCultivationBuff`.
    - `lib/types/beasts.ts` (69 LOC): `Beast`, `BeastEgg`, `BeastSkill`.
    - `lib/types/garden.ts` (29 LOC): `GardenPlot`, `LinhDienLevelInfo`.
    - `lib/types/storyline.ts` (78 LOC): `StoryEncounter`, `StoryChoice`, `StoryRequirement`.
    - `lib/types/auction.ts` (77 LOC): `AuctionItem`, `AuctionParticipant`, `AuctionRoundState`.
    - `lib/types/player.ts` (102 LOC): `PlayerGameState`, `GameSaveData`, `OfflineProgressResult`.
    - `lib/types/index.ts` (14 LOC): Re-export tập trung cho toàn bộ domain types.
    - `lib/types.ts` (6 LOC): Barrel exporter bảo toàn backward-compatibility cho `@/lib/types`.
  - **2. Phân rã `components/dashboard/left/` (9 Card Components & Types):**
    - `CharacterIdentityCard.tsx` (436 LOC): Avatar tu tiên, đạo hiệu, danh hiệu phát quang, thọ nguyên, tâm cảnh, thanh tiến độ cảnh giới & nút Đột Phá / Bế Quan.
    - `CombatStatsCard.tsx` (167 LOC): Bảng chỉ số chiến đấu chi tiết (Công, Thủ, Bạo kích, Kháng bạo, Né tránh, Chính xác, Hút máu, Miễn thương).
    - `TwinCultivationTrackCard.tsx` (286 LOC): Song trục tu luyện Nhục Thân (Tôi thể) & Thần Hồn (Hồn tu), thanh tiến độ, đan phương hỗ trợ & mở modal Tôi Thể.
    - `DestinyCard.tsx` (54 LOC): Thẻ Mệnh Cách Nghịch Thiên Cải Mệnh, danh sách thiên phú khí vận & kích hoạt Bát Quái Thiên Đàn.
    - `CompanionAndGardenCard.tsx` (276 LOC): Trực quan hóa đạo lữ xuất chiến, buff song tu và trạng thái 6 ô Linh Điền gieo trồng thảo dược.
    - `HeritageAndCultivationCard.tsx` (328 LOC): Thể chất tiên thiên, linh căn ngũ hành tương sinh, nút Thăng Hoa Linh Căn & Chuyển Sinh Luân Hồi.
    - `FourAttributesCard.tsx` (220 LOC): Tứ đại thuộc tính (Căn Cốt, Ngộ Tính, Khí Vận, Tâm Cảnh), trần động Dynamic Stat Cap & HUD 4 mốc đột biến bị động.
    - `DivinationFateModal.tsx` (351 LOC): Modal Chiêm Tinh Bói Quẻ Thiên Cơ (Đại Cát -> Đại Hung), quẻ bói hàng ngày & bùa hộ mệnh.
    - `types.ts` (101 LOC) & `index.ts` (10 LOC): Toàn bộ interface props phân tách rõ ràng.
    - `components/dashboard/LeftColumn.tsx` (177 LOC): Container điều phối dạng composable orchestrator cực kỳ gọn gàng.
  - **3. Phân rã `lib/game-logic/` (7 Pure Business Logic Modules):**
    - `character.ts` (83 LOC): Khởi tạo tu sĩ mặc định `createDefaultPlayer`, tính tuổi thọ và thọ nguyên.
    - `combat.ts` (268 LOC): Vòng lặp chiến đấu theo lượt `executeTurnCombat`, né tránh, bạo kích, kỹ năng thần thú, phần thưởng diệt Boss.
    - `cultivation.ts` (380 LOC): Thuật toán thổ nạp tính tu vi bế quan, tỷ lệ đột phá `calculateBreakthroughChance`, tỷ lệ Tâm Ma, điều kiện thăng tiến cảnh giới.
    - `events.ts` (48 LOC): Tính toán cơ duyên kỳ ngộ, tỷ lệ kích hoạt sự kiện ngẫu nhiên theo khí vận và tâm cảnh.
    - `rewards.ts` (340 LOC): Giải quyết phần thưởng sự kiện `resolveEventChoice`, rơi đồ khoáng thạch, dược liệu, đan dược, bí tịch.
    - `stats.ts` (258 LOC): Tính toán chỉ số chiến đấu tổng hợp `calculateEffectiveStats`, HP/MP tối đa, lực chiến tổng hợp.
    - `refinement.ts` (244 LOC): Hệ thống Tôi Thể Dịch Cốt, tiến cấp cảnh giới nhục thân và thức tỉnh thể chất thần ma.
    - `index.ts` (8 LOC): Re-export toàn bộ functions logic.
    - `lib/game-logic.ts` (15 LOC): Barrel exporter bảo toàn backward-compatibility cho `@/lib/game-logic`.
- **Bảng So Sánh Chỉ Số LOC Trước & Sau Refactor:**

| Thành phần / Tệp mục tiêu | LOC Trước | LOC Sau (Từng module) | LOC File Gốc (Orchestrator/Barrel) | Giảm thiểu LOC | Trạng thái |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`lib/types.ts`** | 1,539 LOC | 13 files (29 - 278 LOC/file) | **6 LOC** | **-99.6%** | **Đạt chuẩn Clean Architecture** |
| **`components/dashboard/LeftColumn.tsx`** | 2,272 LOC | 9 cards (54 - 436 LOC/card) | **177 LOC** | **-92.2%** | **Đạt chuẩn Clean Architecture** |
| **`lib/game-logic.ts`** | 1,729 LOC | 7 modules (48 - 380 LOC/module) | **15 LOC** | **-99.1%** | **Đạt chuẩn Clean Architecture** |
| **Tổng cộng 3 Monoliths** | **5,540 LOC** | **Tất cả các file đều < 500 LOC** | **198 LOC** | **-96.4%** | **100% Type-safe & Zero Regressions** |

- **Kết quả kiểm thử & xác minh:**
  - TypeScript Type-check: `npx tsc --noEmit` hoàn thành với **0 lỗi (Exit code 0)**.
  - Production Build: `npm run build` hoàn thành với **Exit code 0** (Tất cả 8 routes tĩnh và động Next.js 16 compile thành công rực rỡ).

---

### [2026-09-29 00:05] - Mở Rộng "Tứ Đại Thuộc Tính" (Căn Cốt, Ngộ Tính, Khí Vận, Tâm Cảnh): Dynamic Stat Cap & Milestone Perks
- **Mục đích:**
  1. Xóa bỏ hoàn toàn giới hạn cứng 100 điểm ban đầu của Tứ Đại Thuộc Tính (Căn Cốt, Ngộ Tính, Khí Vận, Tâm Cảnh) vốn dễ bị chạm trần sau khi cắn đan dược hoặc chọn nhánh cốt truyện.
  2. Xây dựng **Cơ Chế Phá Vỡ Giới Hạn Theo Cảnh Giới (Dynamic Stat Cap)**:
     - *Phàm Nhân – Luyện Khí (Index 0 - 10):* Giới hạn **100**.
     - *Trúc Cơ – Kim Đan (Index 11 - 20):* Nâng trần lên **250** (Khai thông huyệt vị kinh mạch để dung nạp).
     - *Nguyên Anh – Hóa Thần (Index 21 - 30):* Nâng trần lên **500** (Ngưng tụ nguyên thần thức hải).
     - *Luyện Hư trở lên (> 30):* Nâng trần lên **1.000** (Dung nhập quy tắc thiên địa).
  3. Xây dựng **Cơ Chế Mốc Đột Biến Bị Động (Milestone Perks)** kích hoạt đặc quyền vĩnh viễn:
     - **Ngộ Tính $\ge 80$ (Nhất Niệm Thông Thiên):** Giảm vĩnh viễn 15% số Tu Vi cần thiết khi bế quan đột phá.
     - **Tâm Cảnh $\ge 90$ (Bất Động Minh Vương):** Miễn nhiễm hoàn toàn 100% nguy cơ Tâm Ma xâm lấn khi độ kiếp tiểu cảnh giới.
     - **Căn Cốt $\ge 80$ (Đồng Cân Thiết Cốt):** Nhận thêm 1 tầng miễn thương (Damage Reduction) +5% trong mọi trận chiến.
     - **Khí Vận $\ge 80$ (Thiên Mệnh Chi Tử):** Nhân đôi tỷ lệ gặp Tàng Bảo Các và Dị Bảo (Linh Ngọc) trong Bí Cảnh Thượng Cổ Roguelite.
- **Các thành phần phát triển & điều chỉnh:**
  - `lib/attribute-perks.ts` (Module kiến trúc mới):
    - Khởi tạo `getMaxStatLimit(realmIndex: number): number`: Trả về ngưỡng trần 100 / 250 / 500 / 1000 tương ứng từng đại cảnh giới.
    - `getStatCapDescription(realmIndex: number): string`: Diễn giải cơ chế phá vỡ giới hạn theo lore tiên hiệp.
    - Định nghĩa `ATTRIBUTE_MILESTONE_PERKS`: Danh sách 4 đặc quyền đột biến với đầy đủ metadata, icon, badgeClass, shortDesc.
    - Helper functions: `hasMilestonePerk`, `getActiveMilestonePerks`, `isMajorBreakthroughRealm`, `MAJOR_REALM_INDICES`.
    - `calculateEffectiveRequiredTuVi(player, nextRealm)`: Tích hợp công thức tính Tu Vi đột phá thực tế có áp dụng giảm 15% khi kích hoạt Nhất Niệm Thông Thiên.
  - `lib/game-constants.ts` & `lib/game-logic.ts`:
    - Re-export toàn bộ helpers từ `lib/attribute-perks`.
    - Cập nhật `calculateTamMaChance(realmIndex, tamCanh)`: Tự động đưa tỷ lệ Tâm Ma về `0%` khi `tamCanh >= 90` và không phải là Đại Cảnh Giới.
    - Cập nhật `attemptBreakthrough` & `canBreakthrough`: Áp dụng `calculateEffectiveRequiredTuVi`, bổ sung flavor text chúc mừng ngộ tính thông thiên giảm 15% tu vi.
    - Cập nhật `updatePlayerStats`: Thay thế việc clamp cứng `<= 100` bằng `getMaxStatLimit(updated.currentRealm || 0)`.
  - `lib/destiny-data.ts`:
    - Cập nhật `calculateCombatStats(player)`: Tự động cộng thêm +5% Miễn Thương (`dmgReduction += 5`) khi Căn Cốt $\ge 80$ (Đồng Cân Thiết Cốt).
  - `lib/secret-realm-logic.ts` & `hooks/useSecretRealmActions.ts`:
    - Cập nhật `generateFloorRooms`: Nhân đôi tỷ lệ xuất hiện phòng Tàng Bảo Các (`treasure`) khi Khí Vận $\ge 80$ (Thiên Mệnh Chi Tử).
    - Cập nhật `resolveRoomEncounter`: Nhân đôi tỷ lệ nhặt được Linh Ngọc Dị Bảo khi mở rương báu kèm log thông báo `⭐ [Thiên Mệnh Chi Tử - Nhân Đôi Dị Bảo]`.
  - `hooks/useCraftingActions.ts`, `hooks/useGameActions.ts`, `lib/storyline-logic.ts`:
    - Cập nhật toàn bộ các điểm sử dụng đan dược tăng vĩnh viễn thuộc tính và lựa chọn cốt truyện: Thay thế giới hạn cứng 100 bằng `getMaxStatLimit(player.currentRealm || 0)`.
  - `app/api/breakthrough/route.ts`:
    - Cập nhật GET & POST: Áp dụng `calculateEffectiveRequiredTuVi` và miễn trừ 100% Tâm Ma ở tiểu cảnh giới khi `tamCanh >= 90`.
  - `components/dashboard/LeftColumn.tsx`:
    - Thẻ Tứ Đại Thuộc Tính: Hiển thị trần động `Trần: ${statCap}`, giá trị `${val}/${statCap}`, thanh tiến độ co giãn theo `${(val / statCap) * 100}%`.
    - Gắn huy hiệu mini phát sáng trực tiếp trên tên từng chỉ số khi đạt mốc đột biến: `🛡️ +5% MT`, `🧠 -15% TV`, `⭐ x2 Bí Cảnh`, `🧘 Miễn Tâm Ma`.
    - Tích hợp **HUD Đặc Quyền Đột Biến** dạng lưới 2x2: Hiển thị trực quan trạng thái kích hoạt (`✓` hoặc tiến độ `${curVal}/${req}`) kèm hiệu ứng viền vàng phát quang.
    - Đồng bộ thanh tiến độ Tu Vi cảnh giới với `calculateEffectiveRequiredTuVi`.
  - `components/dashboard/MiddleColumn.tsx` & `components/GameDashboard.tsx`:
    - Đồng bộ `tuViReq` theo `calculateEffectiveRequiredTuVi`, hiển thị nhãn `(-15%)` khi kích hoạt Nhất Niệm Thông Thiên.
    - Hiển thị dòng nguy cơ Tâm Ma: `0% 🧘 [Bất Động Minh Vương]` khi Tâm Cảnh $\ge 90$ ở tiểu cảnh giới.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt **0 lỗi (0 errors)**.
  - Production Build: `npm run build` hoàn thành với **Exit code 0** (Next.js Turbopack).

---

### [2026-09-28 23:45] - Khắc Phục Lỗi Tràn Chữ Thanh Sub-Tabs & Cơ Chế Tự Động Làm Mới Thương Hội 24H (One-Time Items Lock)
- **Mục đích:**
  1. Khắc phục triệt để lỗi giao diện bị co ép, cắt chữ thành dấu ba chấm ("Toà...", "Tu L...", "Bí Tị...", "Dượ...", "🌸 Đạo...", "Trữ ...", "Thu ...") tại thanh bộ lọc danh mục Thương Hội.
  2. Xây dựng cơ chế tự động làm mới hàng hóa hàng ngày (Daily Refresh) sau 24 giờ thực kèm đồng hồ đếm ngược trực quan (Countdown HUD).
  3. Áp dụng quy tắc kiểm soát kinh tế chặt chẽ: Các vật phẩm độc bản / dùng 1 lần (**Công Pháp, Bí Tịch, Đan Phương, Tàn Đồ, Tín Vật**) một khi đã mua hoặc đã học thì **vĩnh viễn không xuất hiện lại** hoặc hiển thị trạng thái `✓ Đã sở hữu / [Đã Sở Hữu]`. Chỉ có đan dược, dược thảo, khoáng thạch tiêu hao mới được hồi lại tồn kho.
- **Các thành phần phát triển & điều chỉnh:**
  - `components/tabs/MerchantTab.tsx`:
    - Thay thế container co cụm dạng grid thành thanh cuộn ngang mượt mà (Horizontal Scrollable Pill Bar): `flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 border-b border-amber-900/30`.
    - Thêm `flex-shrink-0 whitespace-nowrap` trên từng nút sub-tab, bỏ toàn bộ `truncate` và `max-w-[...]`, hiển thị đầy đủ nhãn tiếng Việt: **✨ Toàn Bộ**, **⚡ Tu Luyện**, **📜 Bí Tịch**, **🌿 Dược Thảo**, **🌸 Đạo Lữ**, **🎒 Trữ Vật**, **♻️ Thu Mua**, **💰 Tệ Điếm**.
    - Tích hợp **Countdown HUD** cạnh nút đổi hàng: `⏳ Hàng mới sau: HH:mm:ss`, đếm ngược từng giây đến lượt làm mới tự động tiếp theo, tự động kích hoạt làm mới miễn phí khi hết 24h.
    - Cập nhật thẻ hàng hóa: Gắn nhãn `✨ Độc Bản` cho các vật phẩm mua 1 lần (`isOneTime`), tự động chuyển nhãn tồn kho thành `✓ Đã sở hữu` và nút mua thành `[Đã Sở Hữu]` (vô hiệu hóa kèm icon `CheckCircle2`) khi người chơi đã mua hoặc đã học.
  - `lib/types.ts`:
    - Bổ sung `isOneTime?: boolean;` và `isSoldOutPermanent?: boolean;` trong `MerchantItem`.
    - Mở rộng `MerchantState`: `lastDailyRefreshTime?: number;`, `purchasedOneTimeIds?: string[];`, `currentStock?: Record<string, number>;`.
  - `lib/merchant-data.ts`:
    - Thêm hằng số `DAILY_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000`.
    - Bổ sung hàm kiểm tra vật phẩm độc bản `isOneTimeMerchantItem(item)` và hàm kiểm tra đã sở hữu `isItemAlreadyPurchased(item, player)`.
    - Cập nhật `generateMerchantInventory(playerOrRealm)`: Đánh dấu `isOneTime: true`, gán `isSoldOutPermanent: true` và hạ `stock: 0` đối với mọi vật phẩm độc bản người chơi đã từng sở hữu (quét cả `manuals`, `inventory.books`, `inventory.manuals`, `learnedManuals`, `purchasedOneTimeIds`).
    - Bổ sung hàm `checkAndTriggerDailyShopReset(player)` kiểm tra và tự động làm mới sau mỗi 24h.
  - `hooks/useMerchantInventoryActions.ts`:
    - Tự động kiểm tra `checkAndTriggerDailyShopReset` khi mở game hoặc mount hook, ghi log và hiển thị toast khi thương hội cập bến lô hàng mới.
    - Cập nhật `handleBuyMerchantItem`: Tự động đẩy ID vật phẩm vào `purchasedOneTimeIds` và đánh dấu `isSoldOutPermanent: true` ngay khi mua thành công.
    - Cập nhật `handleRefreshMerchant(free)`: Phân định rõ làm mới miễn phí (hồi lại 24h) và làm mới tiêu hao 50 Linh Thạch (giữ nguyên danh sách đã mua độc bản).
  - `lib/save-migration.ts`:
    - Chuẩn hóa `merchantState` trong `normalizePlayerData()`: Khởi tạo an toàn `lastDailyRefreshTime`, `purchasedOneTimeIds`, `currentStock`.
    - Tự động quét toàn bộ công pháp đã học hoặc đang có trong túi đồ để nạp vào `purchasedOneTimeIds`, chống bán trùng cho toàn bộ các save cũ.
  - `app/globals.css`:
    - Bổ sung lớp `.no-scrollbar` đa trình duyệt (Chrome, Safari, Firefox, Edge, IE) hỗ trợ trải nghiệm cuộn ngang trơn tru.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt **0 lỗi (0 errors)**.
  - Production Build: `npm run build` hoàn thành với **Exit code 0** (Next.js Turbopack).

---

### [2026-09-28 23:25] - Xây Dựng Phân Hệ Vạn Bảo Đấu Giá Hội (Grand Xianxia Auction Hall)
- **Mục đích:** Xây dựng phân hệ đấu giá kỳ trân dị bảo tuyệt thế, tạo sân chơi xả Linh Thạch tích lũy quy mô lớn từ AFK, Linh Điền và Bí Cảnh, đồng thời cung cấp trải nghiệm đấu trí (bidding war) căng thẳng, chân thực cùng hệ thống NPC tiên giới đa tính cách và cơ chế Thần Thức Áp Chế (Soul Pressure Intimidation) mô phỏng tiểu thuyết tiên hiệp kinh điển.
- **Các thành phần phát triển mới & nâng cấp:**
  - `lib/types.ts`:
    - Định nghĩa kiểu dữ liệu đấu giá hoàn chỉnh: `NPCPersonality`, `AuctionNPC`, `AuctionLotItem`, `AuctionBidRecord`, `AuctionSessionState`.
    - Mở rộng `PlayerStats`: bổ sung trường `auctionState?: AuctionSessionState | null;`.
  - `lib/auction-data.ts`:
    - 8 Mẫu NPC đối thủ kinh điển mang cá tính và thoại riêng biệt: Vương Thế Gia Thiếu Chủ (trọc phú kiêu ngạo), Thanh Vân Tông Trưởng Lão (cẩn trọng tính toán), Hắc Bào Tán Tu (thần bí cổ quái), Mỹ Diễm Thương Hội Chưởng Quỹ (thương nhân tinh quái), v.v. Kèm hệ thống câu thoại khi ra giá, câu thoại cay cú khi bị đè giá và thoại hoảng hốt khi bị Thần Thức chấn nhiếp.
    - 16 Kỳ Trân Dị Bảo Thần Phẩm / Tiên Phẩm độc quyền (`AUCTION_LOTS`): Thái Hư Cổ Long Noãn (Trứng Chân Long), Viễn Cổ Phượng Hoàng Noãn, Chân Ma Tụ Huyết Thao Thiết Bào (Giáp Thần Phẩm 4 lỗ), Cửu Chuyển Hoàn Hồn Đan Phương, Đại La Kiếm Thai, Viễn Cổ Hỗn Độn Tàn Đồ, Bát Hoang Lôi Linh Ngọc - Cực Phẩm, v.v.
  - `lib/auction-logic.ts`:
    - `generateAuctionSession`: Thuật toán sinh ngẫu nhiên phiên đấu giá gồm 3 - 5 vật phẩm và 3 - 4 NPC theo độ sâu cảnh giới và thần thức người chơi.
    - `calculateNextNPCBid`: Xử lý AI tâm lý của NPC dựa trên ngân sách, tính cách (kiêu ngạo hét giá trả đũa, thương nhân đẩy giá thăm dò dưới 120% reserve price, tán tu dốc cạn túi săn tàn đồ).
    - `attemptSoulIntimidation`: Tính toán áp chế thần thức dựa trên chênh lệch `player.thanThuc` so với `npc.thanThuc`. Khi thành công: NPC rơi vào trạng thái "Chấn Nhiếp" (`isIntimidated = true`), tự động bỏ cuộc (`hasFolded = true`) không dám tranh chấp món đồ đó. Khi thất bại: NPC chế nhạo, tăng ngân sách thêm 20%.
    - `resolveAuctionItemWin`: Trừ Linh Thạch chính xác và trao trực tiếp phần thưởng vào kho (Túi Trữ Vật, Chuồng Thú, Khay Linh Ngọc, Tàng Kinh Các).
  - `hooks/useAuctionActions.ts` & `hooks/index.ts`:
    - Quản lý vòng lặp đấu giá (state machine: waiting -> bidding -> hammering -> sold -> finished).
    - Bộ đếm nhịp gõ búa tự động (Lần 1 -> Lần 2 -> Thành Giao) với hiệu ứng SFX qua Web Audio Engine (`click`, `thunder`, `breakthrough`).
    - Các hành động chiến thuật: Nâng giá nhẹ (+8%), Đẩy giá dằn mặt (+28%), Thần thức áp chế, Bỏ cuộc (Pass), Tiếp tục lô tiếp theo.
  - `components/modals/AuctionModal.tsx` & `components/modals/index.ts`:
    - Giao diện Sảnh Đấu Giá Cổ Phong tráng lệ: Khung vòm thếp vàng, bục trưng bày kỳ trân phát quang theo phẩm cấp (Cực / Thần / Tiên), bảng nhật ký trả giá trực tiếp (Live Ticker), hàng ghế khách quý NPC với avatar, trạng thái chấn nhiếp và bong bóng thoại tương tác sống động.
    - Thanh thao tác người chơi tích hợp hiển thị điểm Thần Thức, tỉ lệ thành công chấn áp và tự động vô hiệu hóa khi không đủ Linh Thạch chống âm tiền.
  - `components/tabs/MerchantTab.tsx`:
    - Bổ sung Banner Cổ Phong sang trọng: **"🏛️ VẠN BẢO ĐẤU GIÁ HỘI"** với hiệu ứng phát quang, nhãn ĐANG MỞ và nút **"BƯỚC VÀO ĐẤU GIÁ HỘI"**.
  - `components/dashboard/HeaderNav.tsx`:
    - Bổ sung nút điều hướng nhanh hình búa đấu giá thếp vàng **"🔨 Đấu Giá Hội"** kèm badge "HOT" trên thanh Header Nav.
  - `components/GameDashboard.tsx`:
    - Tích hợp hook `useAuctionActions` và mount `<AuctionModal />`.
    - Kết nối sự kiện đột phá Đại Cảnh Giới (Trúc Cơ 11, Kim Đan 16, Nguyên Anh 21, Hóa Thần 26...) trong `useGameActions` để tự động mở Phiên Đấu Giá Thiên Cổ mừng phá cảnh.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt **0 lỗi (0 errors)**.
  - Production Build: `npm run build` hoàn thành với **Exit code 0** (Next.js Turbopack).

---

### [2026-09-28 23:15] - Cải Tổ Toàn Diện Hệ Thống Âm Thanh (Web Audio DSP & Soft Guzheng BGM)
- **Mục đích:** Khắc phục triệt để lỗi âm thanh bị rè, ù tai do 2 sóng drone sub-bass liên tục (108Hz & 216Hz) gây méo sóng loa laptop/điện thoại, và tiếng chuông đơn độc chói tai giật mình. Thiết kế lại 100% kiến trúc âm thanh nền theo phong cách **Cổ Phong Thiền Định (Xianxia Ambient Pad & Soft Guzheng Pentatonic Arpeggios)**, êm dịu, thư thái, chống mỏi tai khi treo máy lâu.
- **Các cải tiến kỹ thuật chính (`lib/audio-engine.ts`):**
  - **Master Dynamics Compressor / Limiter:** Tích hợp `DynamicsCompressorNode` trước `audioContext.destination` (Threshold: -24dB, Knee: 30dB, Ratio: 12:1, Attack: 3ms, Release: 250ms), tự động san phẳng đỉnh biên độ và triệt tiêu 100% hiện tượng rè loa/clipping âm thanh cho cả BGM lẫn SFX.
  - **Lớp Gió Tiên Sơn (Soft Mountain Breeze):** Loại bỏ hoàn toàn sóng drone sub-bass tần số thấp. Sử dụng Pink Noise (thuật toán Paul Kellet) kèm crossfade mượt mà, lọc qua Bandpass Filter 480Hz ($Q = 1.0$) và điều chế gain cực nhẹ ($0.026$) với LFO siêu chậm $0.04\text{ Hz}$ (chu kỳ 25s), tạo cảm giác gió núi thoảng từng cơn như qua rừng trúc tiên cảnh.
  - **Lớp Cổ Cầm Ngũ Cung (Gentle Guqin / Guzheng Phrases):**
    - Chuyển sang chơi **cụm 2 - 3 nốt lướt chậm rãi (Soft Arpeggio Phrase)** cách nhau $0.35\text{s} - 0.47\text{s}$, sau đó nghỉ $8\text{s} - 14\text{s}$ giữa các cụm.
    - Bảng tần số ngũ cung cổ phong kinh điển (C4, D4, E4, G4, A4, C5, D5, E5).
    - Pha trộn âm sắc 80% Sine (ấm áp, không gắt) + 20% Triangle (tiếng gảy tơ mộc mạc) qua Lowpass Filter 1300Hz.
    - Đường cong ADSR mềm mại: Attack $0.05\text{s}$ (triệt tiêu tiếng "tách" do cắt sóng), Decay/Release $3.0\text{s}$ ngân vang dần vào thinh không.
  - **Cơ chế Mute / Stop êm ái:** Hỗ trợ Fade-out $0.4\text{s}$ khi bấm Tắt/Mute, ngắt toàn bộ timer nốt đàn đang chờ và giải phóng tài nguyên AudioNode tự động, không gây tiếng "bụp" giật mình.
  - **Cân chỉnh âm lượng mặc định:** Đặt `DEFAULT_SOUND_SETTINGS.bgmVolume = 0.20` để nhạc nền làm phông nền tĩnh tâm, hài hòa với SFX hành động.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt 0 lỗi (0 errors).
  - Production Build: `npm run build` hoàn thành với Exit code 0 (Next.js Turbopack).

---

### [2026-09-28 23:05] - Khắc Phục Lỗi Lore & Chuẩn Hóa Khởi Tạo Đạo Lữ (Companion Progression Bugfix)
- **Mục đích:** Khắc phục triệt để lỗi logic cốt truyện (lore) và cân bằng chỉ số ban đầu khi người chơi mới ở cảnh giới Phàm Nhân / Luyện Khí Tầng 1 đã có sẵn Đạo Lữ Lạc Thanh Tuyết (Hảo Cảm 15/100, Trợ Chiến / Đồng Hành, nhận buff +25% Thủ & Băng). Đưa trạng thái khởi tạo về chuẩn phàm nhân thôn dã thuần túy: không có đạo lữ nào mở khóa sẵn, không có trợ chiến, hảo cảm = 0, và chỉ mở khóa qua cơ chế chơi thực tế (kỳ duyên du lịch tầm duyên, bí cảnh, cốt truyện).
- **Các file thay đổi:**
  - `lib/companions-data.ts`:
    - Cập nhật `createDefaultCompanionsState()`: xóa bỏ việc gán cứng `isMet: true`, `affinity: 15` cho Lạc Thanh Tuyết. Toàn bộ danh sách 8 đại tiên tử đều khởi tạo qua `createDefaultCompanionPlayerState(c.id)` với `isMet: false`, `affinity: 0`, `isBonded: false`.
    - Đặt `activeCompanionId: null` làm mặc định (thay vì `'companion_lac_thanh_tuyet'`).
  - `lib/save-migration.ts`:
    - Nâng cấp `normalizePlayerData()`:
      - Khi `!data.companionsState`, trả về `createDefaultCompanionsState()` hoàn toàn tinh khôi.
      - Bổ sung cơ chế tự động thanh lọc (Self-Healing / Auto-Cleanse): Nếu save người chơi ở cảnh giới sơ kỳ (`currentRealm <= 1`), reset triệt để mock data cũ của Lạc Thanh Tuyết (`affinity = 0`, `isMet = false`) và dọn dẹp `activeCompanionId = null` nếu chưa từng kết duyên hợp lệ.
      - Đối với các save cảnh giới cao hơn: bảo lưu an toàn 100% các đạo lữ đã kết duyên hợp lệ (`isBonded: true`), đồng thời kiểm tra tính hợp lệ của `activeCompanionId` (phải là đạo lữ đã gặp gỡ hoặc đã kết duyên).
  - `lib/destiny-data.ts`:
    - Bổ sung kiểm tra hợp lệ trong `calculateCombatStats()`: Chỉ cộng hưởng thuộc tính chiến đấu từ Đạo Lữ Trợ Chiến (`+25% DEF` của Lạc Thanh Tuyết, bạo kích, hồi phục...) khi `activeCompId` tồn tại hợp lệ và trạng thái của nàng đã gặp gỡ hoặc đã kết duyên (`activeCompState.isBonded || activeCompState.isMet`).
  - `lib/cultivate-data.ts`:
    - Sửa `hasCompanion` trong `getCultivateRates()`: Yêu cầu đạo lữ hộ pháp phải là đạo lữ đã kết duyên (`isBonded`), không cho phép nhận buff +15% Thổ Nạp nếu chưa có ai kết duyên.
  - `lib/game-logic.ts` & `lib/offline-progress.ts`:
    - Cập nhật `processCultivation()` và `processOfflineProgress()`: Chỉ cộng +15% tốc độ tu luyện thổ nạp khi `activeCompanionId` trỏ tới đạo lữ đã kết duyên (`isBonded`) hoặc có bất kỳ tiên lữ nào trong danh sách đã kết duyên.
  - `hooks/useCompanionActions.ts`:
    - Đổi `selectedCompanionId` mặc định từ `'companion_lac_thanh_tuyet'` thành `null`.
    - Bổ sung kiểm tra trong `handleSetActiveCompanion(compId)`: Chỉ cho phép chọn Tiên Lữ đã chính thức Kết Duyên (`curCompState?.isBonded`) để cùng sánh bước trợ chiến, hiển thị toast cảnh báo nếu chưa kết duyên.
  - `components/dashboard/LeftColumn.tsx`:
    - Thêm điều kiện `isValidActive = Boolean(compId && pCompState && (pCompState.isBonded || pCompState.isMet))` tại Khối hiển thị Đạo Lữ Đồng Hành Sánh Bước. Đảm bảo người chơi mới luôn hiển thị "Chưa Chọn Đạo Lữ", "Nhấn để kết giao Tiên Lữ", badge "Tiên Duyên" và không bị cộng nhầm buff text.
  - `app/api/event/route.ts`:
    - Chuẩn hóa ID đạo lữ từ sự kiện kỳ duyên (`rawCompId.startsWith('companion_') ? rawCompId : ...`) và khởi tạo trạng thái với `createDefaultCompanionPlayerState(compId)` bắt đầu từ hảo cảm cơ sở = 0 trước khi cộng điểm hảo cảm sự kiện.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt 0 lỗi (0 errors).
  - Production Build: `npm run build` hoàn thành với Exit code 0 (Next.js Turbopack).

---

### [2026-09-28 22:50] - Hệ Thống Bí Cảnh Đa Tầng Roguelite (Dungeon Crawler Tiên Hiệp)
- **Mục đích:** Nâng cấp toàn diện phân hệ Bí Cảnh Thượng Cổ tại `components/tabs/SecretRealmTab.tsx` thành **Hệ Thống Bí Cảnh Đa Tầng Roguelite** hoàn chỉnh. Bổ sung cơ chế khám phá bản đồ phân nhánh từng phòng (Procedural Room Crawler), cơ chế sinh tồn & quản lý rủi ro (Push-Your-Luck Loop), túi chiến lợi phẩm tạm thời (`lootBag`), rút lui an toàn mang 100% đồ về kho, và đóng kín vòng lặp kinh tế với Thần Binh Các.
- **Các file thay đổi & tạo mới:**
  - `lib/types.ts`:
    - Định nghĩa các kiểu và interfaces Roguelite: `SecretRealmDifficulty`, `DungeonRoomType`, `DungeonBuff`, `DungeonRoomChoice`, `DungeonRunState`.
    - Mở rộng `PlayerStats`: bổ sung `dungeonRunState?: DungeonRunState | null;`.
  - `lib/secret-realm-data.ts` (mới):
    - Khởi tạo danh mục 5 Đại Bí Cảnh Cổ Đại: U Minh Cổ Lâm (Luyện Khí Tầng 3+), Huyết Ma Động Phủ (Trúc Cơ Sơ Kỳ+), Cửu U Hắc Uyên (Kim Đan Sơ Kỳ+), Chân Ma Cổ Mộ (Nguyên Anh Sơ Kỳ+), Thái Hư Huyễn Cảnh (Hóa Thần Sơ Kỳ+). Bảo lưu tương thích cho các ID bí cảnh cũ.
    - Cấu hình pool Thần Chúc Tế Đàn (`ALTAR_BUFFS`), Cạm Bẫy Cổ Trận (`TRAP_TEMPLATES`), Tàng Bảo Cổ Rương (`CHEST_TIERS` - Bạc, Hoàng Kim, Thái Hư) và Quái vật/Boss trấn tầng (`MONSTER_NAMES`).
  - `lib/secret-realm-logic.ts` (mới):
    - Module pure functions xử lý thuật toán đi ải Roguelite:
      - `generateFloorRooms()`: Sinh 2 - 3 phòng lựa chọn ngẫu nhiên cho mỗi bước và chốt hạ bằng Boss trấn tầng ở bước cuối.
      - `getEffectiveDungeonStats()`: Tính toán chỉ số chiến đấu tổng hợp kèm theo các Thần Chúc hiện có.
      - `resolveRoomEncounter()`: Giải quyết sự kiện đụng độ tương tác cho 7 loại phòng (Battle, Elite, Boss, Treasure, Altar, Trap, Rest).
      - `settleDungeonRun()`: Kết toán chuyến đi ải, cộng dồn Linh Thạch, Linh Ngọc, Khoáng Thạch, Dược Liệu vào `player.inventory` (100% khi rút lui/chiến thắng, 50% khi tử trận).
  - `hooks/useSecretRealmActions.ts`:
    - Nâng cấp hook quản lý toàn bộ vòng lặp Roguelite: `handleStartDungeon`, `handleSelectRoom`, `handleResolveCurrentRoom`, `handleNextStep`, `handleRetreatDungeon`.
    - Tích hợp hiệu ứng âm thanh Web Audio (`slash`, `alchemy`, `thunder`, `click`), đồng bộ và lưu trữ `localStorage`.
    - Bảo lưu toàn bộ các phương thức cũ để tương thích với các component và test suite khác.
  - `components/tabs/SecretRealmTab.tsx`:
    - Thiết kế lại 100% giao diện với 2 chế độ hiển thị chuyên biệt:
      1. *Chế Độ Tiên Phủ Bí Cảnh (Khi chưa bắt đầu):* Lưới thẻ bài 5 Đại Bí Cảnh Cổ Đại với yêu cầu cảnh giới, số tầng, tiêu hao Chân Nguyên, bảo vật quý và nút "⚔️ KHAI MỞ BÍ CẢNH".
      2. *Chế Độ Sàn Đấu Đi Ải Thám Hiểm (Trong lúc đi ải):* Top Status HUD hiển thị thanh Khí Huyết (HP), Chân Nguyên (MP), huy hiệu Thần Chúc, Túi Tạm thời, nút Rút Lui An Toàn (100% đồ); Khu vực chọn ngã rẽ 2-3 phòng với cấp độ nguy hiểm; Khung tương tác tiểu thuyết cổ phong theo loại phòng (Xuất chiêu quyết đấu, mở 3 loại rương, hiến tế thỉnh chúc, hóa giải cấm chế, điều tức linh tuyền).
  - `components/GameDashboard.tsx`:
    - Kết nối và truyền đầy đủ các handlers mới từ `useSecretRealmActions` sang `<SecretRealmTab />`.
  - `lib/save-migration.ts`:
    - Chuẩn hóa trường `dungeonRunState: data.dungeonRunState || null` trong `normalizePlayerData`, đảm bảo an toàn tuyệt đối cho các save cũ.
  - `lib/game-logic.ts`:
    - Khởi tạo `dungeonRunState: null` trong `createNewPlayer()`.
  - `report.md`:
    - Cập nhật timestamp, sơ đồ thư mục, mục 4.10 (Bí Cảnh Thượng Cổ Roguelite) và ma trận tính năng mục 6.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt 0 lỗi (0 errors).
  - Production Build: `npm run build` hoàn thành với Exit code 0 (Next.js Turbopack).

---

### [2026-09-28 22:45] - Nâng Cấp Thần Binh Các: Hệ Thống Đục Lỗ, Khảm Nạm Linh Ngọc & Tẩy Luyện Khóa Dòng Thuộc Tính Ẩn
- **Mục đích:** Nâng cấp phân hệ Luyện Khí Điện tại `components/tabs/ForgingTab.tsx` thành **Thần Binh Các** hoàn chỉnh, mang đến 2 cơ chế gia tăng sức mạnh trang bị cốt lõi của dòng game tiên hiệp: Đục Lỗ & Khảm Nạm Linh Ngọc Ngũ Hành + Dị Biến, và Tẩy Luyện & Khóa Dòng Thuộc Tính Ẩn (Affixes) cho trang bị Thượng Phẩm trở lên, cộng hưởng trực tiếp vào chỉ số chiến đấu và chiến lực thực tế.
- **Các file thay đổi & tạo mới:**
  - `lib/types.ts`:
    - Định nghĩa các kiểu và interfaces: `GemType` ('kim' | 'mộc' | 'thủy' | 'hỏa' | 'thổ' | 'lôi' | 'phong'), `AffixRarity` ('luc' | 'lam' | 'tim' | 'kim' | 'than'), `GemItem`, `EquipmentAffix`, `EquipmentSocket`.
    - Mở rộng `Equipment`: bổ sung `sockets?: EquipmentSocket[]`, `affixes?: EquipmentAffix[]`, `maxSockets?: number`.
    - Mở rộng `PlayerStats['inventory']`: bổ sung `gems?: GemItem[]`.
    - Mở rộng `CombatStats`: bổ sung `hutMauRate?: number`, `xuyenGiapRate?: number`, `phanDmgRate?: number`.
  - `lib/forging-gem-data.ts` (mới):
    - Khai báo 7 cấu hình màu sắc, icon và thuộc tính nguyên tố trong `GEM_TYPE_CONFIGS`.
    - Danh mục 35 viên linh ngọc qua 5 cấp bậc (`ALL_GEMS_CATALOG`), gói `STARTER_GEMS` trải nghiệm ngay.
    - Bảng chi phí đục lỗ lũy tiến (`SOCKET_PUNCH_COSTS`) và chi phí tẩy luyện cơ bản + khóa dòng (`REFORGE_COSTS`).
    - Bảng cấu hình 5 bậc phẩm chất Affixes (`AFFIX_RARITY_CONFIGS` với trọng số 50%, 30%, 14%, 5%, 1%), pool mẫu thuộc tính ẩn (`AFFIX_TEMPLATES`), hàm sinh ngẫu nhiên `generateRandomAffix()`, `getMaxSocketsForGrade()`, `getInitialAffixCount()`.
  - `lib/forging-logic.ts` (mới):
    - Module xử lý nghiệp vụ khí đạo: `ensureEquipmentStructure()`, `punchEquipmentSocket()`, `inlayGemToSocket()`, `removeGemFromSocket()`, `toggleAffixLock()`, `reforgeEquipmentAffixes()`, `calculateEquipmentTotalGemsAndAffixes()`.
  - `lib/destiny-data.ts`:
    - Cập nhật hàm `calculateCombatStats()`: Quét toàn bộ 4 ô trang bị đang mặc (`weapon`, `armor`, `accessory`, `artifact`), cộng dồn trực tiếp chỉ số phẳng từ ngọc khảm và % bonus từ các dòng thuộc tính ẩn (Công kích %, Phòng ngự %, Bạo kích dmg %, Hút máu %, Xuyên giáp %, Phản sát thương %, Khí huyết tối đa %, Chân nguyên tối đa %).
  - `lib/game-logic.ts`:
    - Cập nhật `calculateCombatPower()`, `getMaxKhiHuyet()`, `getMaxLinhLuc()` tính toán thêm socket gems & affixes.
    - Cập nhật `createNewPlayer()` khởi tạo `inventory.gems = [...STARTER_GEMS]`.
  - `hooks/useCraftingActions.ts`:
    - Quản trị state `forgingMainTab` ('forge' | 'inlay' | 'reforge') và `forgingSelectedSlot`.
    - Bổ sung các domain handlers: `handlePunchSocket`, `handleInlayGem`, `handleRemoveGem`, `handleToggleLockAffix`, `handleReforgeEquipment`.
    - Tích hợp âm thanh Web Audio (`alchemy`, `slash`, `click`), đồng bộ và lưu trữ `localStorage`.
  - `components/tabs/ForgingTab.tsx`:
    - Thiết kế lại toàn diện giao diện Thần Binh Các với 3 Đài Luyện Khí (Main Sub-tabs):
      1. *Rèn Đúc:* Bảo lưu toàn bộ tính năng rèn đúc trang bị, cường hóa +1..+9 và khoáng phố.
      2. *Đục Lỗ & Khảm Ngọc:* Chọn 4 vị trí trang bị, đài tế thần binh trung tâm với 1-4 ô khảm ngọc trực quan (chưa đục, ô trống, đã khảm kèm nút tháo gỡ an toàn), kho ngọc trữ vật bên dưới có bộ lọc ngũ hành 7 hệ.
      3. *Tẩy Luyện Thần Binh:* Bàn tẩy luyện cổ phong hiển thị 2-4 dòng ẩn với huy hiệu màu sắc 5 bậc phẩm chất, nút Khóa/Mở khóa dòng tiện lợi, bảng dự toán chi phí Linh Thạch & Huyền Thiết Khoáng, nút bấm lớn "🔥 TẨY LUYỆN THẦN THUỘC" kèm hiệu ứng lóe sáng flash.
  - `components/GameDashboard.tsx`:
    - Kết nối và truyền đầy đủ các state và domain handlers từ `useCraftingActions` vào `<ForgingTab />`.
  - `lib/save-migration.ts`:
    - Nâng cấp `normalizePlayerData()`: Tự động chạy `ensureEquipmentStructure` cho trang bị đang mặc và trang bị trong túi đồ; tự động cấp phát `inventory.gems = STARTER_GEMS` nếu save cũ chưa có ngọc.
  - `report.md`:
    - Cập nhật timestamp, sơ đồ thư mục, mục 4.6 (Thần Binh Các) và ma trận tính năng mục 6.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt 0 lỗi (0 errors).
  - Production Build: `npm run build` thành công xuất sắc (Exit code 0, Next.js Turbopack).
  - Tương thích save cũ: 100% Backward Compatible.

---

### [2026-09-28 22:30] - Hệ Thống Hoạt Họa Cảnh Giới Độc Bản 4 Đại Cảnh Giới: Trúc Cơ, Kim Đan, Nguyên Anh, Hóa Thần & Nâng Cấp Toolbar Preview
- **Mục đích:** Mở rộng chiều sâu thị giác và mỹ thuật tiên hiệp chân thực cho 4 Đại Cảnh Giới tiếp theo: **Trúc Cơ (Index 11-15)**, **Kim Đan (Index 16-20)**, **Nguyên Anh (Index 21-25)** và **Hóa Thần (Index 26-30)** theo triết lý Zero-Asset 100% Vector SVG & GPU CSS Keyframes; đồng thời nâng cấp thanh công cụ Preview duyệt nhanh qua 5 Đại Cảnh Giới.
- **Các file thay đổi:**
  - `app/globals.css`: Bổ sung bộ keyframes CSS tối ưu hóa phần cứng GPU:
    - `@keyframes realm-daotai-spin` & `.animate-realm-daotai-spin`: Xoay pháp trận Bát Giác Đạo Đài 20s.
    - `@keyframes realm-liquid-rise` & `.animate-realm-liquid-rise-1/2/3`: Hạt và luồng linh dịch ngọc bích dâng lên nhấp nhô.
    - `@keyframes realm-jindan-pulse` & `.animate-realm-jindan-pulse`: Khối cầu Kim Đan co bóp phát quang nhật hoa rực rỡ.
    - `@keyframes realm-glyph-rotate` & `.animate-realm-glyph-rotate` / `...-reverse`: Vòng kinh văn cổ ngữ Cửu Chuyển Đan Văn xoay 3D xuôi và ngược chiều.
    - `@keyframes realmFlameWave` & `.animate-realm-flame-wave`: Vầng lửa Đan Hỏa tam muội bập bùng dạng sóng năng lượng.
    - `@keyframes realm-nascent-float` & `.animate-realm-nascent-float`: Hư ảnh tiểu hài đồng Nguyên Anh lơ lửng nhấp nhô (4s ease-in-out).
    - `@keyframes realmNebulaSpin` & `.animate-realm-nebula-spin`: Mây mù tử khí và dải ngân hà cực quang xoay vần sau lưng.
    - `@keyframes realm-phap-tuong-aura` & `.animate-realm-phap-tuong-aura`: Hư ảnh Cự Thần Pháp Tướng chập chờn uy nghiêm, mắt thần lóe sáng.
    - `@keyframes realm-void-lightning` & `.animate-realm-void-lightning`: Tia chớp thiên lôi đỏ tím giật xé rách không gian ngẫu nhiên.
    - `@keyframes realmDomainSpin` & `.animate-realm-domain-spin`: Vòng tròn Quy Tắc Lĩnh Vực xoay vần quy nạp vạn vật.
  - `lib/realm-visuals-data.ts`:
    - Mở rộng `RealmSpecialEffect` bổ sung `'daotai' | 'jindan' | 'nascent' | 'phaptuong'`.
    - Định nghĩa chi tiết cấu hình chuyên biệt trong `REALM_VISUALS_DATA` cho 20 cảnh giới (index 11 đến 30):
      - *Index 11 - 15 (Trúc Cơ):* Theme xanh ngọc bích (`#10b981`), lam thanh thiên (`#38bdf8`), viền vàng (`#fbbf24`), hiệu ứng `'daotai'`.
      - *Index 16 - 20 (Kim Đan):* Theme hoàng kim đế vương (`#f59e0b`), đan hỏa xích hồng (`#ef4444`), hiệu ứng `'jindan'`.
      - *Index 21 - 25 (Nguyên Anh):* Theme tím huyền môn (`#a855f7`), cực quang lam (`#38bdf8`), bạc tinh thể, hiệu ứng `'nascent'`.
      - *Index 26 - 30 (Hóa Thần):* Theme đỏ ma thần thiên kiếp (`#f43f5e`), hoàng kim thiên đạo (`#fbbf24`), hiệu ứng `'phaptuong'`.
    - Tự động map cấu hình trực tiếp từ `REALM_VISUALS_DATA` cho toàn bộ 31 cảnh giới đầu (0..30) thay vì fallback.
  - `components/realm/RealmVisualAnimation.tsx`:
    - Bổ sung 5 gradient chuyên biệt trong `<defs>`: `pillarGradId`, `jindanGradId`, `flameGradId`, `nascentGradId`, `titanGradId`.
    - Tích hợp 4 lớp hoạt họa procedural Vector SVG độc quyền:
      - **Trúc Cơ:** Cột trụ linh quang chiếu thẳng từ thiên không xuống đỉnh đầu tu sĩ, Bát Giác Đạo Đài xoay chậm dưới tọa thiền kèm 8 phù văn cổ, các giọt linh dịch ngọc bích phát quang dâng lên nhấp nhô, mặt nước đan điền gợn sóng xoay vần.
      - **Kim Đan:** Khối cầu Kim Đan hoàng kim lơ lửng tại đan điền tỏa vầng hào quang thái dương nhấp nháy, 2 vòng Cửu Chuyển Đan Văn xoay nghịch chiều (-20° và +25°) gắn phù hiệu cổ ngữ, vầng Đan Hỏa tam muội ôm trọn thân thể, vết nứt đạo văn ở Đại Viên Mãn.
      - **Nguyên Anh:** Hư ảnh tiểu hài đồng Nguyên Anh phát quang thanh tú lơ lửng trước ngực chắp ấn thiền định, mây mù tử khí và tinh vân cực quang xoay vần sau lưng, màng lưới thần niệm đa giác bát diện hộ thể.
      - **Hóa Thần:** Cự Thần Pháp Tướng khổng lồ sừng sững sau lưng đội vương miện cổ đại, đôi mắt Thần Mục rực cháy phóng tia thần uy, vết rách không gian và thiên lôi sấm sét đỏ tím giật xé rách chân không, vòng tròn Quy Tắc Lĩnh Vực xoay tròn quy nạp vạn vật.
    - Cập nhật generic fallback chỉ áp dụng cho cảnh giới `> 30` (từ Luyện Hư trở lên).
  - `components/dashboard/LeftColumn.tsx`:
    - Nâng cấp thanh công cụ `👁️ Hoạt Họa`: Chuyển đổi nhanh qua 5 nút nhóm Đại Cảnh Giới: `[0-10]` (Phàm/Luyện Khí), `[Trúc Cơ]` (11-15), `[Kim Đan]` (16-20), `[Nguyên Anh]` (21-25), `[Hóa Thần]` (26-30).
    - Hiển thị dải nút chọn nhanh từng tiểu tầng chi tiết theo nhóm đang chọn và nút Reset `[✕ Về thực]`.
  - `report.md`: Cập nhật ngày giờ và tài liệu hóa chi tiết mục 4.11.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt 0 lỗi (0 errors).
  - Production Build: `npm run build` thành công xuất sắc (Exit code 0, 8/8 static pages).
  - Dev server: Hoạt động ổn định tại `http://localhost:3000`.

---

### [2026-09-28 22:15] - Xây Dựng Hệ Thống Cốt Truyện Phân Nhánh & Nhiệm Vụ Chính Tuyến
- **Mục đích:** Bổ sung sợi dây cốt truyện tiên hiệp kinh điển dẫn dắt cảm xúc người chơi từ một phàm nhân áo vải nơi sơn thôn hẻo lánh nhặt được cơ duyên, bước lên con đường nghịch thiên tu tiên, vượt qua khảo hạch sinh tử và vấn đỉnh Trúc Cơ Cảnh. Tích hợp cơ chế Lựa Chọn Phân Nhánh (Branching Choices) tác động trực tiếp đến Khí Vận, Tâm Cảnh, Danh hiệu và Pháp bảo độc quyền.
- **Các file thay đổi & tạo mới:**
  - `lib/types.ts`: Bổ sung các interface và kiểu dữ liệu: `QuestStatus`, `StorylineChoice`, `StorylineQuest`, `StorylineChapter`, `StorylineState`; thêm trường `storylineState?: StorylineState;` vào `PlayerStats`.
  - `lib/storyline-data.ts` (mới): Xây dựng nội dung 4 chương hồi tiên hiệp kinh điển sâu sắc:
    - *Chương I: Thiếu Niên Sơn Thôn* (Phàm Nhân -> Luyện Khí Tầng 1) với 3 hồi: Dị Biến Khe Suối, Thập Niên Nhất Mộng, Yêu Lang Ban Đêm.
    - *Chương II: Dẫn Khí Nhập Đạo* (Luyện Khí Tầng 2 -> Tầng 5) với 3 hồi: Kinh Mạch Tắc Nghẽn, Tàn Quyển Trong Hốc Đá, Đột Phá Lôi Động.
    - *Chương III: Bái Sơn Khảo Hạch* (Luyện Khí Tầng 6 -> Tầng 10 / Viên Mãn) với 3 hồi: Thanh Vân Lôi Đài, Mũi Nhọn Đối Đầu, Luyện Khí Cực Cảnh.
    - *Chương IV: Phong Vân Trúc Cơ* (Trúc Cơ Tầng 11+) với 3 hồi: Ngưng Khí Hóa Dịch, Trúc Cơ Đạo Đài (Thiên Đạo Trúc Cơ vs Địa Đạo Nghịch Mệnh), Khai Sơn Lập Đạo.
    - Cung cấp các helper utilities: `STORYLINE_CHAPTERS`, `getAllQuests()`, `getQuestById()`, `getNextQuest()`, `createDefaultStorylineState()`.
  - `lib/storyline-logic.ts` (mới): Module xử lý tiến độ (`checkQuestProgress`), áp dụng nhân quả lựa chọn phân nhánh (`applyChoiceOutcomes`), nhận thưởng nhiệm vụ (`claimQuestRewardLogic`), kiểm tra trạng thái (`getQuestStatus`, `hasClaimableQuests`) và cơ chế tự động đồng bộ hồi phục cho save cũ cảnh giới cao (`autoCatchUpStorylineForHighRealm`).
  - `lib/save-migration.ts`: Bổ sung migration an toàn cho `storylineState` trong `normalizePlayerData`, tích hợp tự động hồi phục catchup cảnh giới cao không gây hỏng tiến trình save cũ.
  - `lib/game-logic.ts`: Khởi tạo `storylineState: createDefaultStorylineState()` trong `createNewPlayer()`.
  - `hooks/useStorylineActions.ts` (mới): Custom Domain Hook độc lập quản lý tiến trình cốt truyện, đối thoại theo lượt, lựa chọn nhánh, nhận thưởng, tích hợp Web Audio SFX (`playSFX('breakthrough')`, `playSFX('click')`). Re-export qua `hooks/index.ts`.
  - `components/modals/StorylineModal.tsx` (mới): Modal cuộn tranh thư tịch cổ phong (Xianxia Ancient Scroll UI), nẹp trục gỗ cuộn, thanh phân chia Chương Hồi (Chapter Tabs), khung đọc tiểu thuyết chương hồi với bong bóng thoại nhân vật (`Đạo Hữu`, `Lão Giả Bí Ẩn`, `Thiên Kiêu`, `Nội Tâm`...), thanh tiến độ mục tiêu thời gian thực và thẻ bài quyết định phân nhánh (Choice Cards). Re-export qua `components/modals/index.ts`.
  - `components/dashboard/HeaderNav.tsx`: Thêm nút **Cốt Truyện** (Icon `Scroll`) kèm hiệu ứng chấm đỏ phát sáng thông báo khi có hồi mới mở khóa hoặc có nhiệm vụ sẵn sàng nhận thưởng.
  - `components/dashboard/MiddleColumn.tsx`: Thêm thanh Mini Widget thanh nhã phía trên khung Nhật Ký Tu Tiên hiển thị: 📜 **Chính Tuyến:** `[Tên Nhiệm Vụ]` • *[Tiến độ]* kèm nút xem nhanh mở trực tiếp `StorylineModal`.
  - `components/GameDashboard.tsx`: Kết nối hook `useStorylineActions`, truyền props vào HeaderNav, MiddleColumn và nhúng `<StorylineModal />` vào danh sách modal.
  - `report.md`: Cập nhật ngày giờ, bổ sung mục 4.14 và cập nhật ma trận tính năng mục 6.
- **Chi tiết kỹ thuật & Đảm bảo kiến trúc:**
  - Clean Architecture: Tách biệt triệt để Hook, Logic, Data và Component UI.
  - Backward Compatibility: Hỗ trợ nạp các file save cũ từ v1..v7 mượt mà mà không bị mất dữ liệu hay kẹt tiến độ.
  - Phân nhánh có ý nghĩa: Lựa chọn ảnh hưởng thực sự đến Khí Vận, Tâm Cảnh, Danh hiệu độc quyền và phần thưởng vật phẩm.
- **Trạng thái kiểm thử:**
  - TypeScript Type-check: `npx tsc --noEmit` đạt 0 lỗi (0 errors).
  - Production Build: `npm run build` thành công xuất sắc (Exit code 0, 8/8 static pages tối ưu hóa).
  - Logic Unit Test: Đã kiểm thử luồng chọn nhánh, biến chuyển chỉ số, tiến độ cảnh giới và migration save cũ thành công 100%.

---

### [2026-09-28 21:30] - Chuẩn Hóa 10 Tầng Luyện Khí & Đồng Bộ Toàn Bộ Codebase 105 Cảnh Giới
- **Mục đích:** Chuẩn hóa cảnh giới Luyện Khí từ cấu trúc phân cấp cũ (bị lặp Luyện Khí Sơ Kỳ ở id: 6) thành 10 tầng chuẩn tiên hiệp (Luyện Khí Tầng 1 đến Tầng 10 / Viên Mãn), tịnh tiến toàn bộ các cảnh giới từ Trúc Cơ đến Đế Tổ Đỉnh Phong (tổng cộng 105 cảnh giới: 0..104). Loại bỏ hoàn toàn giới hạn kẹp biên cứng `Math.min(99, ...)` và đồng bộ toàn bộ logic thành tựu, hoạt họa, tỷ lệ đột phá và migration.
- **Các file thay đổi:**
  - `data/realms-data.json`: Thay thế Luyện Khí cũ bằng 10 tầng mượt mà (tu vi 100 -> 1250), Trúc Cơ dời sang id 11 (tu vi 1450), tịnh tiến toàn bộ id 11..104, tu vi tăng đơn điệu nghiêm ngặt (monotonically strictly increasing).
  - `lib/game-constants.ts`: Đồng bộ `REALM_STAGES` và `calculateBaseSuccessRate` theo 105 cảnh giới mới. `MONOTONIC_TU_VI` và `calculateRequiredTuVi` map trực tiếp từ `realmsData`.
  - `lib/achievements-data.ts`: Bổ sung thành tựu `ach_realm_luyenkhi_max` (Luyện Khí Viên Mãn, id: 10), chuẩn hóa `ach_realm_tiende` (Tiên Đế Vấn Đỉnh, target: 96), bổ sung `ach_realm_deto` (Đế Tổ Quy Vị, target: 101, danh hiệu 'Đế Tổ Vô Song'). Cập nhật hàm `evaluateAchievement`.
  - `lib/save-migration.ts`: Cập nhật logic phục hồi Self-Healing `repairCorruptedSaveData` với các mốc mới (Đế Tổ 101, Tiên Đế 96, Hóa Thần 26, Nguyên Anh 21, Kim Đan 16, Trúc Cơ 11, Luyện Khí Viên Mãn 10).
  - `lib/realm-visuals-data.ts`: Đồng bộ cấu hình 11 cảnh giới đầu (0..10) với Luyện Khí 10 tầng. Cập nhật `getFallbackRealmConfig` chuẩn hóa theo ngưỡng đại cảnh giới mới và lấy tên cảnh giới chính xác từ `realmsData`.
  - `components/dashboard/LeftColumn.tsx`: Hiển thị `Tầng {currentRealmIndex}/{realmsData.length - 1}`, mở rộng dải nút xem trước hoạt họa `👁️ Hoạt Họa (0-10)` với mảng `[0..10]`.
  - `components/modals/StoryEncounterModal.tsx`: Sửa nhãn cảnh giới thành `{player.currentRealm}/{realmsData.length - 1}`.
  - `lib/boss-trial-data.ts`: Thay thế `Math.min(99, ...)` bằng `Math.min(realmsData.length - 1, ...)`.
  - `app/api/event/route.ts` & `hooks/useGameActions.ts`: Thay thế kẹp biên sự kiện `availableTo ?? 99` bằng `availableTo ?? (realmsData.length - 1)`.
  - `data/events-data.json`: Cập nhật 19 sự kiện có `availableTo: 99/100` thành `104` để người chơi ở cảnh giới Tiên Đế / Đế Tổ vẫn trải nghiệm đầy đủ sự kiện kỳ duyên.
  - `app/api/breakthrough/route.ts`: Làm sạch comment biên cảnh giới `[0, realmsData.length - 1]`.
  - `lib/types.ts`: Cập nhật tài liệu comment cho `currentRealm`, `Realm.id`, `requiredRealm`.
- **Chi tiết kỹ thuật:** 
  - Đảm bảo toàn vẹn dữ liệu: `realms[i].id === i` cho tất cả 105 phần tử.
  - Tu vi yêu cầu tăng nghiêm ngặt: $TuVi_{i} > TuVi_{i-1}$ trên toàn bộ 105 mốc cảnh giới.
  - Loại bỏ hoàn toàn magic numbers `99` hay `100`, chuyển sang kiến trúc động `realmsData.length - 1`.
- **Trạng thái kiểm thử:** 
  - Script kiểm tra tính đơn điệu và index: PASSED (105/105 cảnh giới hợp lệ).
  - `npx tsc --noEmit`: 0 lỗi.
  - `npm run build`: Exit code 0, hoàn tất trong 1.39s (8/8 static pages tối ưu hóa thành công).

---

### [2026-09-28 21:00] - Khắc phục Triệt để Lỗi State Sync Auto-Repair & Nối Chuỗi nextRealm
- **Mục đích:** Khắc phục triệt để lỗi spam console log `[Auto-Repair]`, lỗi tự động hạ cảnh giới về Kim Đan Hậu Kỳ khi tu vi lớn, và lỗi nối chuỗi `"14" + 1 = "141"` dẫn đến deadlock.
- **Các file thay đổi:**
  - `lib/save-migration.ts`: Xóa logic auto-repair khỏi normalizePlayerData. Thêm hàm repairCorruptedSaveData() chỉ chạy 1 lần khi load game.
  - `components/dashboard/MiddleColumn.tsx`: Chuẩn hóa currentRealmIndex, nextRealmIndex, targetNextRealm. Nút đột phá hiển thị điều kiện chi tiết.
  - `components/dashboard/LeftColumn.tsx`: Sửa avatar và stepper bị fallback về 0 do chuỗi currentRealm.
  - `hooks/useGameActions.ts`: Chuẩn hóa handleBreakthrough. Báo rõ số tu vi/linh thạch còn thiếu.
  - `components/GameDashboard.tsx`: Đồng bộ currentRealmIndex, safeRealmIndex, nextRealm.
  - `app/api/breakthrough/route.ts`: Đồng bộ GET và POST. Sửa lỗi gán cảnh giới khi thất bại.
  - `app/api/battle/route.ts` & `lib/game-logic.ts`: Ép kiểu an toàn khi lọc Boss và tính đột phá.
- **Chi tiết kỹ thuật:** React State desynchronization & JavaScript type coercion trap: chuỗi "14" + số 1 = "141", realmsData["141"] = undefined.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` 0 lỗi. `npm run build` 1.15s exit 0. HTTP 200 OK.

---

### [2026-09-28 20:25] - Xây dựng Hệ Thống Hoạt Họa Cảnh Giới (Realm Animation System) Zero-Asset
- **Mục đích:** Xây dựng hoạt họa Procedural Animated Visuals thuần vector SVG + CSS Keyframes cho 10 cảnh giới đầu (Phàm Nhân & Luyện Khí 1-9).
- **Các file thay đổi:**
  - `lib/realm-visuals-data.ts` (mới)
  - `components/realm/RealmVisualAnimation.tsx` (mới)
  - `components/realm/index.ts` (mới)
  - `app/globals.css` (bổ sung keyframes)
  - `components/dashboard/LeftColumn.tsx` (tích hợp + preview toolbar)
- **Chi tiết kỹ thuật:** Kiến trúc Zero-Asset 100% SVG, không bitmap/GIF, Retina/4K sharp, fallback đại cảnh giới an toàn, thanh công cụ test/preview tích hợp.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` 0 lỗi. `npm run build` OK. HTTP 200 OK.

---

### [2026-09-28 20:05] - Khắc phục Triệt để Bug Tụt Cảnh Giới & Deadlock Đột Phá (Self-Healing Auto-Repair)
- **Mục đích:** Khắc phục người chơi bị tụt từ Hóa Thần về Phàm Nhân và kẹt deadlock nút đột phá.
- **Các file thay đổi:**
  - `lib/save-migration.ts`: Self-Healing/Auto-Repair khôi phục cảnh giới từ tu vi + thành tựu. loadGameSave/importSaveFromJson không xóa trắng save.
  - `app/api/breakthrough/route.ts`: Ngăn "22" + 1 = "221". Gán trực tiếp nextRealmIndex.
  - `lib/game-logic.ts`: Bổ sung boundary checks, type-safety.
  - `components/GameDashboard.tsx`: Chuẩn hóa safeRealmIndex, nextRealm.
  - `hooks/useGameActions.ts`: Làm sạch currentRealm trước/sau API.
- **Chi tiết kỹ thuật:** Unit test 6 kịch bản (Corrupted 0 + 1.2M Tu Vi, chuỗi "0", chuỗi "22", NaN, người chơi mới, Phàm Nhân).
- **Trạng thái kiểm thử:** Unit test 6/6 pass. `npx tsc --noEmit` 0 lỗi. `npm run build` 1.19s exit 0.

---

### [2026-09-28 19:05] - Nâng cấp Hiệu Ứng Trận Đấu Sống Động (Combat Visuals & Floating Numbers)
- **Mục đích:** Nâng cao trải nghiệm thị giác và cảm giác đòn đánh trong chiến đấu Boss/Thí Luyện.
- **Các file thay đổi:** `app/globals.css`, `components/battle/FloatingDamageOverlay.tsx` (mới), `components/battle/SmoothHealthBar.tsx` (mới), `components/battle/index.ts` (mới), `components/tabs/BattleTab.tsx`.
- **Chi tiết kỹ thuật:** FCT 4 loại (normal, crit, dodge, heal), thanh máu dual-layer trễ 2 lớp, kiếm khí lóe sáng CSS keyframes, rung màn hình bạo kích.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` và `npm run build` pass 0 lỗi.

---

### [2026-09-28 18:55] - Triển khai Hệ thống Thành Tựu & Danh Hiệu Tiên Giới
- **Mục đích:** Hệ thống mở khóa thành tựu đa phân hệ + danh hiệu kèm buff vĩnh viễn.
- **Các file thay đổi:**
  - `lib/types.ts`: Thêm TitleRarity, TitleBuff, TitleDefinition, AchievementDefinition, AchievementsState.
  - `lib/achievements-data.ts` (mới): 19 thành tựu, 10 danh hiệu 6 phẩm cấp.
  - `lib/destiny-data.ts`, `lib/game-logic.ts`, `lib/offline-progress.ts`: Tích hợp titleBuff.
  - `lib/save-migration.ts`: Migration achievementsState an toàn.
  - `hooks/useAchievements.ts` (mới), tracking trong garden/game/crafting/companion hooks.
  - `components/modals/AchievementsModal.tsx` (mới), `components/dashboard/HeaderNav.tsx`, `components/dashboard/LeftColumn.tsx`, `components/GameDashboard.tsx`.
- **Chi tiết kỹ thuật:** Dynamic progress tracking, Permanent Title Buffs, 6 phẩm cấp màu sắc.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` 0 lỗi. `npm run build` 1.9s, 8/8 static pages OK.

---

### [2026-09-28 18:38] - Triển khai Hệ thống Âm Thanh & Nhạc Nền Tiên Hiệp (Web Audio Controller)
- **Mục đích:** Engine âm thanh thuần Web Audio API, BGM ngũ cung + SFX không phụ thuộc MP3.
- **Các file thay đổi:**
  - `lib/audio-engine.ts` (mới), `hooks/useSound.ts` (mới), `hooks/index.ts`.
  - `lib/types.ts`, `components/dashboard/HeaderNav.tsx`, `components/GameDashboard.tsx`.
  - Trigger âm thanh trong `hooks/useGameActions.ts`, `components/tabs/BattleTab.tsx`, `hooks/useCraftingActions.ts`.
- **Chi tiết kỹ thuật:** Procedural synthesis (White Noise 850->55Hz kiếp, Sawtooth kiếm khí, Sine 523/1046Hz đan, Pentatonic C4-E5 đột phá, Solfeggio 108/216Hz BGM), lazy unlock browser autoplay policy.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` và `npm run build` 0 lỗi. 8/8 static pages OK.

---

### [2026-09-28 18:30] - Triển khai Hệ thống Treo Máy AFK Offline Progress
- **Mục đích:** Idle tự động tích lũy tu vi, linh thạch và tăng trưởng linh điền khi rời game.
- **Các file thay đổi:**
  - `lib/offline-progress.ts` (mới), `hooks/useOfflineProgress.ts` (mới).
  - `lib/types.ts`, `lib/save-migration.ts`, `hooks/useGameSave.ts`, `hooks/index.ts`.
  - `components/modals/OfflineProgressModal.tsx` (mới), `components/modals/index.ts`.
  - `components/GameDashboard.tsx`.
- **Chi tiết kỹ thuật:** Thời gian chênh lệch, trần 8-12h (linh hoạt theo Tông Môn + Tọa Kỵ), tu vi 75% hiệu suất, làm chín linh điền, rơi ngẫu nhiên dược/khoáng theo cảnh giới, modal cổ phong.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` và `npm run build` 0 lỗi. 8/8 static pages OK.

---

### [2026-09-28 18:18] - Đại phẫu thuật GameDashboard: Tách Hooks & Storage Engine
- **Mục đích:** Giảm tải GameDashboard.tsx từ 4,861 xuống 850 dòng (giảm >82%).
- **Các file thay đổi:**
  - `lib/save-migration.ts` (mới): localStorage v1-v7 migration, debounce auto-save, merge items.
  - `hooks/`: useGameSave, useGardenTimer, useGameActions, useSecretRealmActions, useManualActions, useCraftingActions, useMerchantInventoryActions, useSectActions, useCompanionActions, useGardenActions, useCultivationActions, index.ts.
  - `lib/types.ts`: Thêm LogType, DualCultivationType.
  - `components/GameDashboard.tsx`: Giảm từ 4,861 xuống 850 dòng.
- **Chi tiết kỹ thuật:** Domain-driven custom hooks, type-safety 100%, không dùng any. GameDashboard là Orchestrator thuần túy.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` và `npm run build` 0 lỗi. 8/8 pages OK. 100% chức năng bảo toàn.

---

### [2026-09-28 17:58] - Tái cấu trúc tách nhỏ Modals từ GameDashboard
- **Mục đích:** Module hóa 8 modal inline phức tạp từ GameDashboard (giải phóng ~1,470 dòng).
- **Các file thay đổi:**
  - `components/modals/`: CompanionGiftModal, PhysiqueRefineModal, SpiritualRootModal, DestinyModal, PlantSeedModal, GardenUpgradeModal, RebornModal, StoryEncounterModal, index.ts.
  - `components/GameDashboard.tsx`: 6,330 -> 4,861 dòng.
- **Chi tiết kỹ thuật:** TypeScript Props interface đầy đủ cho từng modal, 100% logic/styling bảo toàn.
- **Trạng thái kiểm thử:** `npx tsc --noEmit` 0 lỗi. `npm run build` 9.9s OK.

---

### [2026-09-28 17:42] - Khởi tạo báo cáo hiện trạng toàn diện
- **Mục đích:** Rà soát toàn bộ codebase, khởi tạo file `report.md` làm "Single Source of Truth".
- **Các file phân tích:** Toàn bộ `app/`, `components/`, `lib/`, `data/`, `package.json`.
- **Chi tiết kỹ thuật:** Ghi nhận 100 cảnh giới, 10 tabs, 20 data modules. Đánh giá trạng thái type-check. Xác định tính năng còn thiếu (AFK, Cloud Save, Sound).
- **Trạng thái kiểm thử:** Build và type-check thành công, không có cảnh báo nghiêm trọng.
