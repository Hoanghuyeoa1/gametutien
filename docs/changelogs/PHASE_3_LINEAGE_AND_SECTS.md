# 📜 GAMETUTIEN • NHẬT KÝ PHÁT TRIỂN: GIAI ĐOẠN 3 - THẾ GIA, HUYẾT MẠCH & TÔNG MÔN

> **Đường dẫn liên kết:** [⬅️ Quay lại Master Changelog](../../CHANGELOG.md) | [📖 Tài liệu kiến trúc README.md](../../README.md)
> **Thời gian:** 2026-10-02 14:05 → 2026-10-02 15:50 | **Tổng số bản ghi:** 4 bản ghi kỹ thuật
> **Phạm vi trọng tâm:** Phân hệ Lục Đạo Tiên Bi & Danh hiệu Kiếp Tu (Ancestral Memorial & Lifetime Epithets), Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch (Dual Cultivation Paths & Immortal Offspring), Đạo Vận Tiên Bi & Gia Tộc Thờ Phụng (Ancestral Resonance & Lineage Blessings), Khai Tông Lập Phái & Chân Truyền Đệ Tử (Sect Founding & Procedural Disciples Management).

---

### [2026-10-02 15:50] - Triển Khai Trọn Vẹn Phân Hệ "Khai Tông Lập Phái & Chân Truyền Đệ Tử" (Sect Founding & Procedural Disciples Management)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, hệ thống Tông Môn chỉ dừng lại ở việc người chơi bái nhập vào 20 Môn Phái có sẵn dưới tư cách đệ tử/trưởng lão, không có cơ chế tự mình khai sơn lập phái, dựng cờ định lập tôn chỉ riêng và thu nhận đồ đệ kế nghiệp.
  - Người chơi đạt cảnh giới cao (Hóa Thần Kỳ trở lên) thiếu sân chơi lãnh đạo đại thế lực, bồi dưỡng Chân Truyền Y Bát để kế thừa thân xác và tiếp tục duy trì cơ nghiệp khi bước vào Lục Đạo Luân Hồi.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/custom-sect.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `SectDoctrine` (`'chinh_dao' | 'ma_dao' | 'kiem_tong' | 'dan_lo' | 'tran_dao'`).
     - Khai báo `DiscipleRank` (`'ngoai_mon' | 'noi_mon' | 'chan_truyen' | 'truong_lao'`), `DiscipleTaskType` (`'idle' | 'tend_garden' | 'mine_ores' | 'guard_gate' | 'explore_realm'`).
     - Khai báo thực thể `ProceduralDisciple`, `SectFacilities`, `CustomSectVault`, `CustomSectState`.
     - Mở rộng `PlayerStats` an toàn với `customSectState?: CustomSectState`.
  2. **Dữ Liệu Tông Môn & Pool Đệ Tử (`lib/custom-sect-data.ts`):**
     - Khai báo 5 Tôn chỉ giáo phái kèm hiệu ứng buff (`SECT_DOCTRINES_CONFIG`).
     - Danh mục 8 Ngọn Linh Sơn Khai Phái (`SACRED_MOUNTAINS_POOL`): Thanh Vân Sơn, Cửu Tiêu Kiếm Phong, Huyết Ma Lĩnh, Thái Hư Nhai, Bát Quái Đảo, Thiên Hỏa Lôi Lĩnh, U Minh Cốc, Bồng Lai Tiên Đảo.
     - Kho từ điển sinh tên đệ tử cổ phong (30 họ, 50 tên nam, 50 tên nữ).
     - Bảng 10 Đặc tính tính cách (`DISCIPLE_TRAITS_CONFIG`) và bảng nâng cấp kiến trúc sơn môn (`FACILITY_UPGRADE_CONFIG`).
  3. **Pure Business Logic (`lib/custom-sect-logic.ts`):**
     - `foundCustomSect()`: Kiểm tra điều kiện Cảnh Giới $\ge$ Hóa Thần Kỳ (Realm 26+) và 100,000 Linh Thạch, khởi tạo môn phái và cấp 3 đệ tử ban đầu.
     - `generateProceduralCandidate()`: Thuật toán sinh đệ tử ngẫu nhiên đa chiều (tên, linh căn, căn cốt, ngộ tính, khí vận, tính cách, lòng trung thành).
     - `calculateSectVaultYield()`: Tính toán sản lượng Khố Phòng (Linh Thạch, thảo dược, quặng) theo thời gian thực (hỗ trợ AFK tối đa 48h).
     - `harvestSectVault()`: Rút toàn bộ tài nguyên khố phòng chuyển vào túi đồ nhân vật.
     - `promoteDisciple()`, `dismissDisciple()`, `assignDiscipleTask()`, `setChosenInheritor()`, `upgradeSectFacility()`.
     - `trainDiscipleWithTuVi()`: Tiêu hao Tu Vi của Chưởng Môn chỉ điểm đệ tử đột phá cảnh giới.
  4. **Kết Nối Lục Đạo Luân Hồi Kế Thừa Thân Xác Chân Truyền (`lib/reincarnation-logic.ts` & `RebornModal.tsx`):**
     - Thêm hàm `executeInheritDiscipleReincarnation()`: Ghi nhận bia mộ tiền kiếp, tái sinh trực tiếp vào thân xác Chân Truyền Đệ Tử, bắt đầu ngay tại cảnh giới của đệ tử đó, giữ nguyên toàn bộ cơ nghiệp môn phái đã sáng lập và tiếp tục giữ ngôi vị Chưởng Môn!
     - Nâng cấp `RebornModal.tsx`: Hiển thị khối đặc quyền hoàng kim **"👑 Y BÁT TRUYỀN THỪA (Đoạt Xá Thân Xác Chân Truyền)"** bên cạnh lựa chọn Luân Hồi thông thường.
  5. **Custom Hook & UI Cổ Phong Zero-Asset (`hooks/useCustomSectActions.ts`, `components/tabs/CustomSectTab.tsx`, `components/tabs/SectTab.tsx`):**
     - Tạo mới `useCustomSectActions.ts` điều phối lập phái, chiêu mộ, thăng cấp, phân công, thu hoạch, truyền thừa.
     - Tạo mới `CustomSectTab.tsx` gồm 2 trạng thái: Màn hình Sa bàn chọn Linh Sơn & Tôn chỉ (khi chưa lập phái) và Màn hình 4 phân khu (Chính Điện Kiến Trúc, Đệ Tử Viện, Khố Phòng Sai Khiến, Truyền Thừa Đạo Đài).
     - Tích hợp mượt mà vào `SectTab.tsx` với thanh chuyển đổi giữa Nhị Thập Tông Môn và Tông Môn Tự Lập.
  6. **Di Trú Dữ Liệu An Toàn (`lib/save-migration.ts` & `character.ts`):**
     - Khởi tạo an toàn `customSectState` trong `normalizePlayerData()` và `createNewPlayer()`.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/custom-sect.ts`: (Tạo mới) Domain types phân hệ Tông Môn tự lập & Đệ tử.
  - `lib/types/player.ts`: Mở rộng `PlayerStats` với `customSectState`.
  - `lib/types/index.ts`: Barrel export `custom-sect.ts`.
  - `lib/custom-sect-data.ts`: (Tạo mới) Dữ liệu 5 tôn chỉ, 8 linh sơn, kho tên, 10 tính cách, nâng cấp kiến trúc.
  - `lib/custom-sect-logic.ts`: (Tạo mới) Pure logic lập phái, sinh đệ tử, khố phòng, thăng chức, chỉ điểm tu vi.
  - `lib/reincarnation-logic.ts`: Thêm `executeInheritDiscipleReincarnation()` kế thừa thân xác Chân Truyền.
  - `components/modals/RebornModal.tsx`: Tích hợp lựa chọn đặc quyền Y Bát Truyền Thừa khi luân hồi.
  - `hooks/useReincarnationActions.ts`: Thêm `handleInheritDisciple()`.
  - `hooks/useCustomSectActions.ts`: (Tạo mới) Custom domain hook điều phối tông môn tự lập.
  - `hooks/index.ts`: Barrel export `useCustomSectActions`.
  - `components/tabs/CustomSectTab.tsx`: (Tạo mới) Giao diện 4 phân khu quản lý sơn môn cổ phong.
  - `components/tabs/SectTab.tsx`: Tích hợp thanh chuyển đổi chế độ và render `CustomSectTab`.
  - `components/GameDashboard.tsx`: Wire `useCustomSectActions`, truyền prop vào `SectTab` và `RebornModal`.
  - `lib/save-migration.ts`: Chuẩn hóa dữ liệu an toàn trong `normalizePlayerData()`.
  - `lib/game-logic/character.ts`: Khởi tạo mặc định `customSectState` trong `createNewPlayer()`.
  - `README.md`: Bổ sung Mục 4.24 chi tiết phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - Next.js Turbopack Build: Sẵn sàng compile và đóng gói thành công.
  - Single-Player Client-First 100%, bảo toàn dữ liệu lưu trữ qua `localStorage`.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Mở rộng thêm tính năng Tông Môn Đại Chiến (Sect Wars) tranh đoạt thêm các ngọn Linh Sơn dã ngoại giữa Tông Môn tự lập và các môn phái lân bang.

---

### [2026-10-02 15:35] - Triển Khai Trọn Vẹn Phân Hệ "Đạo Vận Tiên Bi: Tổ Tiên Phù Hộ & Huyết Mạch Thế Gia" (Ancestral Resonance & Lineage Blessings)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Lục Đạo Tiên Bi trước đây chỉ có chức năng lưu trữ bia mộ tiền kiếp và văn bia để người chơi hoài niệm quá khứ, chưa tạo ra giá trị gia tăng thực tế (Metagame progression) cho các kiếp tu tiếp theo.
  - Người chơi sau nhiều kiếp tu luyện gian khổ chưa cảm nhận được sự kế thừa huyết mạch gia tộc hay sự che chở linh thiêng của tổ tiên tiền bối trong những thời khắc sinh tử nguy nan.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Architecture (`lib/types/ancestral-blessing.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `IncenseGrade` (`'thanh_truc' | 'tu_tieu' | 'thai_so'`).
     - Khai báo `IncenseConfig`, `AggregatedAncestralResonance`, `ActiveOfferingBuff`, `AncestralState`.
     - Mở rộng `PlayerStats` an toàn với thuộc tính `ancestralState?: AncestralState`.
  2. **Dữ Liệu Cấu Hình Hương Hỏa & Bảng Tra Cứu Hào Quang (`lib/ancestral-blessing-data.ts`):**
     - Khai báo 3 loại nhang cúng tế (`INCENSE_OFFERINGS_CONFIG`):
       + *Thanh Trúc Linh Hương* (2,000 LT - Buff 24h: +10% Tu vi, +5% Rơi đồ).
       + *Tử Tiêu Uẩn Hồn Nhang* (15,000 LT - Buff 24h: +18% Tu vi, +10% Công/Thủ, ban tặng **1 Lần Hư Ảnh Tổ Tiên Bảo Mệnh**).
       + *Thái Sơ Hỗn Độn Tiên Hương* (80,000 LT - Buff 48h: +25% Toàn thuộc tính, +15% Bạo kích, ban tặng **2 Lần Hư Ảnh Tổ Tiên Bảo Mệnh**).
     - Bảng tra cứu thuộc tính hào quang theo danh hiệu tiền kiếp (`EPITHET_RESONANCE_MAP`): Phân loại Thần Giai, Thiên Giai, Địa Giai, Huyền/Hoàng Giai.
     - Thiết lập các ngưỡng kẹp biên trần (`ANCESTRAL_CAPS`) nhằm chống lạm phát chỉ số.
  3. **Pure Business Logic (`lib/ancestral-blessing-logic.ts`):**
     - `calculateAncestralResonance()`: Quét toàn bộ danh sách `pastLives`, tính toán và cộng dồn các chỉ số gia tộc, áp dụng kẹp biên trần `ANCESTRAL_CAPS`.
     - `performAncestralOffering()`: Kiểm tra điều kiện Linh Thạch, tiêu hao tài nguyên, thiết lập `activeBuff` với thời hạn thực tế và số lượt bảo hộ tử vong.
     - `checkAndConsumeAncestralDeathWard()`: Kiểm tra hiệu lực buff và số lượt bảo hộ, trừ 1 lượt, tăng số lần cứu mạng và trả về thông điệp chiến báo tiên hiệp.
     - Tích hợp cộng dồn thuộc tính đạo vận và buff hương hỏa vào `calculateCombatStats()` (`lib/destiny-data.ts`).
  4. **Tích Hợp Toàn Diện Vào Combat Engines (Hư Ảnh Đỡ Đòn Tử Vong):**
     - `lib/pvp-ladder-logic.ts` (Thiên Kiêu Bảng PvP): Tự động kích hoạt khi `playerCurHp <= 0`, giữ lại 20% HP tối đa, đưa ra chiến báo tổ tiên hiển linh và tiếp tục giao tranh.
     - `lib/boss-trial-data.ts` (Trấn Ma Tháp & Boss Thế Giới): Tự động kích hoạt khi chịu đòn chí mạng của Boss, hồi 20% HP, tạo cơ hội phản kích nghịch chuyển càn khôn.
     - `lib/game-logic/combat.ts` (Chiến đấu dã ngoại): Kích hoạt khi thua trận, hóa giải đòn sát thủ, miễn trừ 100% hình phạt tu vi và linh thạch.
  5. **Nâng Cấp Giao Diện Modal 3 Phân Khu (`components/modals/AncestralMemorialModal.tsx`):**
     - Tab 1: 🏛️ Lục Đạo Thạch Bi (Văn bia tiền kiếp, bộ lọc phẩm cấp cổ phong).
     - Tab 2: 🔮 Huyết Mạch Đạo Vận (Cây Phúc Đức Gia Tộc, tổng hợp dòng thuộc tính, thanh đo Khí Vận Gia Tộc và bảng liệt kê từng kiếp tu).
     - Tab 3: 🕯️ Tông Tộc Tế Đài (Bàn thờ tổ tiên hoàng kim `animate-pulse`, lư hương Bát Quái tỏa khói Procedural SVG cổ phong, 3 thẻ nhang đèn và đồng hồ đếm ngược).
  6. **Custom Hook & Safe Migration:**
     - Tạo mới `hooks/useAncestralBlessingActions.ts`, phát âm thanh `sfx-bell` khi cúng tế.
     - Chuẩn hóa an toàn `player.ancestralState` trong `lib/save-migration.ts` (`normalizePlayerData()`), tự động dọn dẹp buff khi hết hạn.
     - Khởi tạo mặc định `ancestralState` trong `createNewPlayer()` (`lib/game-logic/character.ts`).
     - Wire đầy đủ vào `components/GameDashboard.tsx`.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/ancestral-blessing.ts`: (Tạo mới) Khai báo domain types phân hệ Đạo Vận Tiên Bi.
  - `lib/types/player.ts`: Mở rộng `PlayerStats` với `ancestralState`.
  - `lib/types/index.ts`: Barrel export `ancestral-blessing.ts`.
  - `lib/ancestral-blessing-data.ts`: (Tạo mới) Dữ liệu 3 loại nhang, bảng hào quang tiền kiếp, hằng số caps.
  - `lib/ancestral-blessing-logic.ts`: (Tạo mới) Logic cộng hưởng, dâng hương và cơ chế đỡ đòn chí tử.
  - `lib/destiny-data.ts`: Tích hợp cộng hưởng đạo vận và buff dâng hương vào `calculateCombatStats()`.
  - `lib/pvp-ladder-logic.ts`: Tích hợp cơ chế Hư Ảnh Tổ Tiên đỡ đòn tử vong trong PvP Thiên Kiêu Bảng.
  - `lib/boss-trial-data.ts`: Tích hợp cơ chế Hư Ảnh Tổ Tiên đỡ đòn tử vong trong Thí Luyện Boss.
  - `lib/game-logic/combat.ts`: Tích hợp cơ chế Hư Ảnh cứu mạng thoát hiểm miễn trừ tổn thất trong combat dã ngoại.
  - `lib/game-logic/character.ts`: Khởi tạo mặc định `ancestralState` trong `createNewPlayer()`.
  - `lib/save-migration.ts`: Chuẩn hóa dữ liệu an toàn và tự động dọn dẹp buff hết hạn trong `normalizePlayerData()`.
  - `hooks/useAncestralBlessingActions.ts`: (Tạo mới) Domain hook điều phối dâng hương, đếm ngược và hiệu ứng.
  - `hooks/index.ts`: Barrel export `useAncestralBlessingActions`.
  - `components/modals/AncestralMemorialModal.tsx`: Nâng cấp giao diện 3 sub-tabs Lục Đạo Thạch Bi, Huyết Mạch Đạo Vận, Tông Tộc Tế Đài kèm Procedural SVG khói nhang.
  - `components/GameDashboard.tsx`: Wire `useAncestralBlessingActions` và truyền prop vào `AncestralMemorialModal`.
  - `README.md`: Bổ sung Mục 4.23 chi tiết phân hệ.
  - `CHANGELOG.md`: Thêm bản ghi mới theo chuẩn 5 phần nghiêm ngặt.
- **Kết Quả Kiểm Thử & Quality Gates (Verification & Results):**
  - `npx tsc --noEmit`: Đạt chính xác **0 errors (Exit code 0)**.
  - Next.js Turbopack Build: Sẵn sàng compile an toàn, không có lỗi cú pháp hay thiếu hụt props.
  - Tương thích 100% Client-First Single-Player, bảo toàn dữ liệu lưu trữ qua `localStorage`.
- **Kế Hoạch & Định Hướng Tiếp Theo (Next Steps):**
  - Mở rộng thêm các nghi lễ đại tế tộc quy mô lớn khi đạt cấp bậc Môn Phái Thánh Địa hoặc gia tộc đạt trên 10 kiếp Thần Giai.

---

### [2026-10-02 15:15] - Triển Khai Trọn Vẹn Phân Hệ "Song Tu Hóa Duyên & Tiên Đồng Huyết Mạch" (Dual Cultivation Paths & Immortal Offspring)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Hệ thống Đạo Lữ trước đây chỉ dừng lại ở việc tặng quà, kết duyên và nhận buff chỉ số bị động hoặc thổ nạp song tu đơn giản; thiếu chiều sâu phân nhánh đạo đức tu chân (Chính Đạo vs Tà Đạo) và chưa có cơ chế kết tinh tiên duyên truyền thừa huyết mạch cho đời sau.
  - Người chơi sau khi kết duyên trăm năm cùng tiên tử không có mục tiêu bồi dưỡng thế hệ đạo tử hậu bối để trợ chiến trong các trận đại chiến đỉnh phong (Boss, Thiên Kiêu Bảng PvP).
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Domain Types & Data Contracts (`lib/types/offspring.ts`, `lib/types/player.ts`, `lib/types/index.ts`):**
     - Khai báo kiểu `DualCultivationMethod` (`'chinh_dao' | 'thai_bo'`), `DualCultivationResult`, `OffspringStage` (`'infant' | 'child' | 'adult'`).
     - Khai báo thực thể `ImmortalChild` (id, name, gender, motherCompanionId, motherName, stage, realmIndex, spiritualRoots, innateTalent, growthProgress, combatPower, isDeployed).
     - Khai báo `GestationState` và `OffspringState` (gestation, children, deployedChildId, demonicKarma, lastSongTuTimestamp, activeDualCultivationBuff).
     - Bổ sung `offspringState` vào `PlayerStats`.
  2. **Dữ Liệu Đan Dược Dưỡng Thai & Công Thức Lai Tạo Di Truyền (`lib/offspring-data.ts`):**
     - Khai báo danh mục đan dược: `pill_linh_thai_tao_hoa` (50,000 LT), `pill_cuu_chuyen_duc_anh` (35,000 LT - Đảm bảo Thiên/Cực Phẩm), `pill_bo_thien_hoan_tuyen` (30,000 LT - Giảm 12h thai kỳ), `pill_tien_thien_khi_linh` (40,000 LT - Tăng 30% căn cốt & chiến lực).
     - Bảng lai tạo linh căn dị biến ngũ hành: Kim + Thủy $\rightarrow$ Huyền Minh Băng; Hỏa + Lôi $\rightarrow$ Thiên Hỏa Thần Lôi; Hỏa + Thủy $\rightarrow$ Cửu Tiêu Lôi hoặc Vạn Cổ Hỗn Độn Linh Căn Thần Cấp (tỷ lệ 5% - 15%).
     - Bảng 8 Thiên Phú Thần Thông bẩm sinh cổ phong (`INNATE_TALENTS_POOL`) cùng bảng tên cổ phong cho nam/nữ.
     - Cấu hình 3 giai đoạn tiến hóa (`STAGE_CONFIGS`): Sơ Sinh (0-3 tuổi - Buff gia viên), Tập Khí (3-16 tuổi - Truyền công), Đạo Tử Xuất Sư (16+ tuổi - Xuất chiến).
  3. **Pure Business Logic (`lib/offspring-logic.ts`):**
     - `executeDualCultivation()`:
       + *Chính Đạo Âm Dương:* Hảo Cảm $\ge 60$. Cả hai nhận Tu Vi (+15% hiệu suất tu luyện 4h), +5 Tâm Cảnh, giảm 50% nguy cơ Tâm Ma, +2 Hảo Cảm, 10% cơ hội hoài thai tự nhiên nếu Hảo Cảm 100 và cả hai $\ge$ Nguyên Anh.
       + *Thái Bổ Tà Pháp:* Ma Tính $\ge 20$ hoặc Đạo Lữ Ma Môn. Rút cạn chân nguyên nhận +20% Công Kích thuần & +15% Bạo Kích 8h, tăng vọt tu vi; trừ 10 Hảo Cảm Đạo Lữ và tăng +15 Ma Tính (Ma Kiếp trừng phạt khi $\ge 80$).
     - `calculateGestationProgress()`: Tính toán tiến độ hoài thai dựa trên 48h thực tế, giảm trừ thời gian qua đan dược.
     - `generateProceduralChild()`: Thuật toán di truyền sinh Tiên Đồng ngẫu nhiên giới tính, tên cổ phong, linh căn dị biến và thiên phú.
     - `calculateChildCombatContribution()`: Tính chỉ số cộng thêm cho nhân vật khi Tiên Đồng xuất chiến.
  4. **Tích Hợp Tứ Trận Quy Nhất & Combat Synergy (`lib/combat-synergy-logic.ts`, `lib/pvp-ladder-logic.ts`):**
     - Mở rộng Tam Vị Nhất Thể khi có `deployedChildId`: Tăng tốc tích lũy Nộ Khí cuối hiệp từ +18 lên +24/hiệp và gia tốc +25% nộ khí.
     - Trong `activateSynergySkill()`: Tiên Đồng bồi thêm đòn đánh **"Thiên Luân Huyết Mạch Kích"** (150% ATK sát thương chuẩn), xóa sạch mọi hiệu ứng bất lợi (Cleanse debuffs) trên phụ mẫu.
  5. **Custom Hook & UI Cổ Phong Zero-Asset (`hooks/useOffspringActions.ts`, `components/tabs/CompanionTab.tsx`, `components/tabs/OffspringSanctuaryView.tsx`):**
     - Sub-tab chuyển đổi linh hoạt: "🎎 Danh Sách Đạo Lữ" và "🌸 Song Tu & Tiên Đình".
     - Ba khu vực chuyên biệt: Động Phủ Song Tu (Chính Đạo vs Thái Bổ, thanh Ma Tính), Linh Thai Dưỡng Dục Đình (Procedural SVG Quả Trứng Linh Quang, đếm ngược, ban đan, điểm hóa), Phả Hệ Tiên Đồng (thẻ bài, truyền công, chỉ định xuất chiến).
     - Di trú dữ liệu an toàn trong `normalizePlayerData()` (`lib/save-migration.ts`), tương thích 100% save cũ.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/offspring.ts`: (Tạo mới) Domain types phân hệ Song Tu & Tiên Đồng.
  - `lib/types/player.ts`: Bổ sung `offspringState` vào `PlayerStats`.
  - `lib/types/index.ts`: Barrel export `offspring.ts`.
  - `lib/types/combat-synergy.ts`: Bổ sung các trường Tiên Đồng trợ chiến vào `SynergyActivationResult`.
  - `lib/offspring-data.ts`: (Tạo mới) Bảng đan dược, công thức lai tạo dị biến, thiên phú, giai đoạn.
  - `lib/offspring-logic.ts`: (Tạo mới) Pure logic song tu, hoài thai, di truyền và trợ chiến.
  - `lib/combat-synergy-logic.ts`: Tích hợp Tứ Trận Quy Nhất, gia tốc nộ khí, đòn đánh Thiên Luân Huyết Mạch Kích.
  - `lib/pvp-ladder-logic.ts`: Truyền tham số `hasDeployedChild` vào tích lũy gauge PvP.
  - `lib/save-migration.ts`: Khởi tạo an toàn `offspringState` trong `normalizePlayerData()`.
  - `hooks/useOffspringActions.ts`: (Tạo mới) Hook quản lý toàn bộ hành động song tu, dưỡng thai, khai thai, xuất chiến.
  - `hooks/index.ts`: Barrel export `useOffspringActions`.
  - `components/tabs/OffspringSanctuaryView.tsx`: (Tạo mới) Giao diện 3 khu vực Song Tu Động Phủ, Linh Thai Đình, Phả Hệ Tiên Đồng.
  - `components/tabs/CompanionTab.tsx`: Tích hợp Sub-Tabs chuyển đổi và render `OffspringSanctuaryView`.
  - `components/GameDashboard.tsx`: Khởi tạo `useOffspringActions` và truyền vào `CompanionTab`.
  - `README.md`: Bổ sung Mục 4.22 đặc tả chi tiết phân hệ.
  - `CHANGELOG.md`: Ghi nhận nhật ký cập nhật 5 phần.
- **Kết Quả Kiểm Thử (Verification):**
  - `npx tsc --noEmit`: Exit code 0, chính xác 0 errors.
  - `npm run build`: Compile thành công 100% qua Next.js Turbopack (Exit code 0).

### [2026-10-02 14:05] - Triển Khai Trọn Vẹn Cơ Chế "Lục Đạo Tiên Bi • Bia Mộ Tiền Kiếp & Danh Hiệu Kiếp Tu" (Ancestral Memorial & Lifetime Epithets)
- **Mục tiêu & Bối cảnh (Why & Problem):**
  - Trước đây, khi nhân vật Tọa Hóa (thọ nguyên cạn kiệt) hoặc Binh Giải Chuyển Sinh, hệ thống chỉ kết toán điểm Karma và reset chỉ số nhân vật mà chưa hề ghi chép lại dấu ấn của các kiếp tu đã qua.
  - Người chơi sau nhiều đời tu luyện không thể nhìn lại lịch sử thăng trầm của các tiền bối tổ tiên: kiếp trước từng bái nhập môn phái nào, đạt tới cảnh giới nào, vì sao vẫn lạc, và để lại di sản gì cho hậu thế.
- **Chi tiết kỹ thuật & Giải pháp (What & How):**
  1. **Mở Rộng Domain Types & Schema (`lib/types/character.ts`):**
     - Khai báo kiểu nguyên nhân quy tiên `CauseOfDeathType`: `'lifespan_exhausted'` (Tọa hóa thọ tẫn), `'binh_giai'` (Chủ động binh giải), `'tribulation_failure'` (Thiên kiếp hóa tro), `'combat_defeat'` (Đấu pháp vẫn lạc), `'ascension_voluntary'` (Công đức viên mãn chuyển thế).
     - Khai báo kiểu danh hiệu kiếp tu `LifetimeEpithet`: `{ title: string; tagline: string; grade: 'hoang' | 'huyen' | 'dia' | 'thien' | 'than'; badgeClass: string }`.
     - Khai báo kiểu bản ghi bia mộ `PastLifeRecord`: `{ lifeIndex, daoName, gender, highestRealmIndex, highestRealmName, ageAtDeath, causeOfDeath, causeOfDeathText, sectName, sectRank, epithet, karmaEarned, sealedArtifactName?, companionCount, bestPvPRank?, achievementsCount, completedAtTimestamp }`.
     - Cập nhật `ReincarnationState`: Bổ sung `pastLives?: PastLifeRecord[]` (bảo lưu tối đa 50 kiếp gần nhất).
  2. **Thuật Toán Đúc Kết Danh Hiệu Kiếp Tu Tự Động (`lib/reincarnation-logic.ts`):**
     - Xây dựng hàm pure `generateLifetimeEpithet(player, cause)`: Phân tích đa chiều toàn bộ cuộc đời tu sĩ:
       + *Thần Giai (Realm $\ge 46$):* [Vạn Cổ Đế Tôn] (Đạt Đế Cảnh 60+), [Hỗn Độn Luân Hồi Giả] (Binh giải ở cảnh giới thần thoại), [Vũ Hóa Tiên Nhân] (Phi thăng chân tiên), [Thiên Kiêu Vẫn Lạc] (Độ kiếp thất bại), [Độ Kiếp Thần Tôn].
       + *Thiên Giai (Realm $26-45$):* [Đương Thế Kiếm Tôn] (Top 10 PvP), [Vạn Bảo Hào Phú] (Linh thạch $\ge 1,000,000$), [Phong Lưu Đạo Quân] (Đạo lữ $\ge 3$), [Cực Cảnh Trảm Lôi], [Thông Thiên Đại Năng].
       + *Địa Giai (Realm $16-25$):* [Nghịch Lôi Vẫn Lạc] (Lôi kiếp hóa tro), [Giải Thoát Chân Nhân] (Binh giải), [Thiên Nhai Kiếm Si] (Đấu pháp sa trường), [Bách Niên Đạo Tu] (Tọa hóa tuổi già), [Vấn Đạo Chân Nhân].
       + *Huyền / Hoàng Giai (Realm $\le 15$):* [Bách Tuế Thọ Tinh] (Thọ mệnh $\ge 120$ ở Luyện Khí), [Trúc Cơ Tu Sĩ], [Lôi Đình Tán Khí], [Sơn Thôn Ẩn Tu].
     - Xây dựng hàm `createPastLifeRecord(player, cause, karmaEarned, lifeIndex)`: Trích xuất trọn vẹn thông số kiếp hiện tại.
     - Cập nhật `executeReincarnation`: Tự động tạo `pastLifeRecord`, chèn vào đầu mảng `pastLives`, cắt tối đa 50 kiếp, bảo lưu nguyên vẹn sang nhân vật mới.
  3. **Tương Thích Ngược & Di Trú Dữ Liệu (`lib/save-migration.ts`):**
     - Trong `normalizePlayerData()`: Khởi tạo an toàn `pastLives = Array.isArray(rawReborn.pastLives) ? rawReborn.pastLives : []`, đảm bảo không lỗi trên mọi save cũ.
  4. **Giao Diện "Lục Đạo Tiên Bi" Chuẩn Procedural SVG Cổ Phong (`components/modals/AncestralMemorialModal.tsx`):**
     - Thiết kế phong cách Thạch Bi Cổ Kính với hoa văn Bát Quái và Lôi văn Procedural SVG phát quang mờ.
     - Header thống kê tổng quan: Tổng số kiếp đã qua, Cực hạn cảnh giới, Tổng Karma tích lũy, Số lượng thạch bi.
     - Bộ lọc tìm kiếm 8 tiêu chí: Tất cả, Thần Giai, Thiên Giai, Địa Giai, Huyền/Hoàng Giai, Binh Giải, Lôi Kiếp, Tọa Hóa.
     - Thân modal: Cuộn dọc các phiến đá nhỏ phân đời La Mã (ĐỜI I, ĐỜI II...) hiển thị Đạo hiệu, Danh hiệu kiếp tu phát quang, Cảnh giới, Thọ mệnh, Môn phái, Nguyên nhân tử vong và Karma thu được.
     - Dialog xem chi tiết "Văn Bia Tiên Đạo" (Epitaph Story) tóm lược thăng trầm cả đời của tu sĩ khi nhấp vào từng phiến đá.
     - Empty State thiền định cổ phong khi đang ở kiếp đầu tiên.
  5. **Tích Hợp Toàn Diện Điểm Truy Cập Giao Diện:**
     - Trong `RebornModal.tsx`: Thêm nút `🏛️ Xem Lục Đạo Tiên Bi` ở màn hình kết toán `summary`.
     - Trong `HeaderNav.tsx`: Bổ sung nút `🏛️ Tiên Bi` kèm số lượng kiếp tu bên cạnh huy hiệu `[Kiếp Thứ X]`.
     - Trong `CharacterIdentityCard.tsx` & `LeftColumn.tsx`: Bổ sung nút nhỏ `🏛️ Tiên Bi` bên cạnh tiêu đề Bản Thể Chân Nhân.
     - Trong `GameDashboard.tsx`: Khai báo state `isMemorialModalOpen`, kết nối các props và render modal.
- **Danh sách File Sửa Đổi (Files Touched):**
  - `lib/types/character.ts`: Định nghĩa `CauseOfDeathType`, `LifetimeEpithet`, `PastLifeRecord`, mở rộng `ReincarnationState`.
  - `lib/reincarnation-logic.ts`: Hàm `generateLifetimeEpithet`, `createPastLifeRecord`, cập nhật `executeReincarnation`.
  - `lib/save-migration.ts`: Migration an toàn cho `pastLives`.
  - `components/modals/AncestralMemorialModal.tsx`: Tạo mới Modal Lục Đạo Tiên Bi phong cách Thạch Bi Cổ Phong.
  - `components/modals/index.ts`: Export `AncestralMemorialModal`.
  - `components/modals/RebornModal.tsx`: Thêm nút `Xem Lục Đạo Tiên Bi` ở màn hình summary.
  - `components/dashboard/HeaderNav.tsx`: Thêm nút `Tiên Bi` cạnh huy hiệu Kiếp Tu Header.
  - `components/dashboard/left/CharacterIdentityCard.tsx`: Thêm nút `Tiên Bi` tại thẻ Bản Thể.
  - `components/dashboard/LeftColumn.tsx`: Truyền prop `openMemorialModal`.
  - `components/GameDashboard.tsx`: State, props wiring và render component AncestralMemorialModal.
  - `README.md`: Bổ sung đặc tả mục 4.18.
  - `CHANGELOG.md`: Ghi chép nhật ký 5 phần chi tiết.
- **Kết Quả Kiểm Thử (Verification):**
  - `npx tsc --noEmit`: Exit code 0, chính xác 0 errors.
  - `npm run build`: Turbopack build thành công 100% trong 4.9s.
