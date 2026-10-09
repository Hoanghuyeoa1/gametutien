import sys

def main():
    with open('README.md', 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    start_marker = '## 4. 🎮 TỔNG HỢP CÁC PHÂN HỆ CHỨC NĂNG & CƠ CHẾ GAMEPLAY (CORE MECHANICS)'
    end_marker = '### 4.5. Bản Mệnh Pháp Bảo & Khí Linh'

    new_section_4 = '''## 4. 🎮 TỔNG HỢP CÁC PHÂN HỆ CHỨC NĂNG & CƠ CHẾ GAMEPLAY (CORE MECHANICS)

### 4.1. Chuẩn Hóa 105 Cảnh Giới Tu Tiên & Bế Quan Thổ Nạp
- **Hệ Thống 105 Bậc Thang Tiên Lộ (`data/realms-data.json`):**
  - **Phàm Nhân (0):** Thiếu niên sơn thôn, thể chất phàm thai, tu vi ban đầu 0.
  - **Luyện Khí Kỳ (1-10):** 10 tầng chuẩn mực (Tầng 1 đến Tầng 10 / Viên Mãn), tu vi tăng trưởng mượt mà từ 100 đến 1,250.
  - **Trúc Cơ Kỳ (11-15):** Sơ Kỳ, Trung Kỳ, Hậu Kỳ, Đỉnh Phong, Đại Viên Mãn (Tu vi từ 1,450 đến 4,500).
  - **Kim Đan Kỳ (16-20) ➔ Nguyên Anh Kỳ (21-25) ➔ Hóa Thần Kỳ (26-30)**
  - **Luyện Hư (31-35) ➔ Hợp Thể (36-40) ➔ Đại Thừa (41-45) ➔ Độ Kiếp (46-50) ➔ Phi Thăng (51-55)**
  - **Tiên Giới:** Chân Tiên (56-60) ➔ Huyền Tiên (61-65) ➔ Địa Tiên (66-70) ➔ Thiên Tiên (71-75) ➔ Kim Tiên (76-80) ➔ Thái Ất Kim Tiên (81-85).
  - **Tối Thượng Đế Cảnh:** Chuẩn Đế (86-90) ➔ Đại Đế (91-95) ➔ Tiên Đế (96-100) ➔ Đế Tổ (101-104: Sơ Kỳ, Trung Kỳ, Hậu Kỳ, Đỉnh Phong).
  - Mọi thuật toán kẹp biên đều dùng động `realmsData.length - 1`, triệt tiêu hoàn toàn lỗi magic number.
- **Bế Quan Thổ Nạp & 3 Tư Thế Tu Luyện (Cultivation Stance):**
  - *An Toàn (Thuần Khiết):* 100% an toàn, tăng trưởng ổn định, không rủi ro tẩu hỏa nhập ma.
  - *Bình Thường (Cân Bằng):* 85% an toàn, 10% cơ may gặp kỳ duyên, 5% nội thương nhẹ.
  - *Mạo Hiểm (Cực Hạn):* 60% an toàn, 25% kích hoạt đại cơ duyên (x2 tu vi tích lũy), 15% tẩu hỏa nhập ma tổn thất khí huyết.
- **Tỷ Lệ Đột Phá & Cơ Chế Kháng Tâm Ma:**
  $$\\text{Tỷ Lệ Thành Công} = \\text{BaseRate} + (\\text{Ngộ Tính} \\times 0.1\\%) + (\\text{Khí Vận} \\times 0.05\\%) + \\text{Đan Dược Bonus} - \\text{Tâm Ma Phạt}$$
  Nếu thất bại, tu sĩ tổn hao chân nguyên, bị thương hoặc tụt tiểu tầng nếu không có Phù Hộ Mệnh hoặc Đan Dược bảo hộ.

---

### 4.2. Tứ Đại Thuộc Tính & Trần Động (Dynamic Stat Cap)
- **Tứ Đại Thuộc Tính Cốt Lõi:** **Căn Cốt** (Khí huyết & Phòng ngự), **Ngộ Tính** (Tốc độ lĩnh ngộ & Tiêu hao tu vi), **Khí Vận** (May mắn, Rơi đồ & Bạo kích), **Tâm Cảnh** (Kháng tâm ma & Thần thức ổn định).
- **Cơ Chế Phá Vỡ Giới Hạn Cảnh Giới (Dynamic Stat Cap - `lib/attribute-perks.ts`):**
  - Khác biệt với RPG truyền thống bị gò bó trong trần 100 điểm, trần thuộc tính tự động mở rộng theo Đại Cảnh Giới:
    - *Phàm Nhân - Luyện Khí (Index 0-10):* Giới hạn **100 điểm**.
    - *Trúc Cơ - Kim Đan (Index 11-20):* Khai thông huyệt vị, nâng trần lên **250 điểm**.
    - *Nguyên Anh - Hóa Thần (Index 21-30):* Ngưng tụ nguyên thần thức hải, nâng trần lên **500 điểm**.
    - *Luyện Hư trở lên (> 30):* Hợp đạo thiên địa, nâng trần lên **1.000 điểm**.
- **4 Mốc Đột Biến Bị Động (Milestone Perks):**
  - 🧠 **Ngộ Tính $\\ge 80$ (Nhất Niệm Thông Thiên):** Giảm vĩnh viễn 15% số Tu Vi cần thiết khi bế quan đột phá cảnh giới.
  - 🧘 **Tâm Cảnh $\\ge 90$ (Bất Động Minh Vương):** Miễn nhiễm hoàn toàn 100% nguy cơ Tâm Ma xâm lấn khi độ kiếp tiểu cảnh giới.
  - 🛡️ **Căn Cốt $\\ge 80$ (Đồng Cân Thiết Cốt):** Nhận 1 tầng Miễn Thương vĩnh viễn +5% trong mọi trận chiến.
  - ⭐ **Khí Vận $\\ge 80$ (Thiên Mệnh Chi Tử):** Nhân đôi (x2) tỷ lệ xuất hiện phòng Tàng Bảo Các và nhân đôi cơ hội nhận Linh Ngọc Dị Bảo trong Bí Cảnh Roguelite.

---

### 4.3. Kiềng Ba Chân Tu Đạo: Khí Tu - Thể Tu - Hồn Tu

```mermaid
graph TD
    TU_DAO["KIỀNG BA CHÂN TU ĐẠO"]
    
    TU_DAO --> KHI_TU["1. KHÍ TU (Đan Điền Linh Lực)"]
    TU_DAO --> THE_TU["2. THỂ TU (Huyền Công Luyện Thể)"]
    TU_DAO --> HON_TU["3. HỒN TU (Thức Hải Thần Hồn)"]
    
    KHI_TU --> KT_DESC["105 Cảnh Giới Bản Thể<br/>Chu Thiên Thổ Nạp • Đan Điền Ngưng Dịch • Thiên Kiếp"]
    
    THE_TU --> TT_DESC["10 Đại Cảnh Giới x 9 Tiểu Tầng<br/>Lục Đại Bộ Vị: Bì • Cốt • Huyết • Kinh • Tạng • Thần<br/>HP Tối Đa • Giáp • Miễn Thương • Sát Thương Phản"]
    
    HON_TU --> HT_DESC["10 Cảnh Giới Thần Hồn x 9 Tiểu Tầng<br/>Cán Cân Âm Dương (Tâm Cảnh vs Ma Tính)<br/>Tam Đại Hồn Khí • Uy Áp Thần Thức • Thần Niệm Kiếm"]
```

1. **Khí Tu (105 Cảnh Giới Bản Thể):**
   - Trục tu luyện chính yếu, tích lũy tu vi, mở rộng đan điền, gia tăng linh lực tối đa và quyết định cấp bậc thọ nguyên.
2. **Huyền Công Luyện Thể (Thể Tu - `components/physique/PhysiqueModal.tsx`):**
   - 10 Đại cảnh giới x 9 tiểu tầng (Phàm Thai -> Đoạn Cốt -> Hoán Huyết -> Bất Diệt Kim Thân -> Tiên Thiên Thần Ma).
   - Tôi luyện **Lục Đại Bộ Vị**: *Luyện Bì* (tăng giáp), *Đoán Cốt* (tăng HP), *Ngưng Huyết* (tăng tự hồi phục), *Thông Kinh* (tăng tốc độ chân khí), *Cường Tạng* (tăng kháng bạo), *Luyện Thần* (tăng phản sát thương).
   - Tiêu hao Tinh Huyết Yêu Thú + Khí Huyết Đan + Linh Thạch.
3. **Thức Hải Thần Hồn (Hồn Tu - `components/soul/SoulHubModal.tsx`):**
   - 10 Cảnh giới Thần Hồn x 9 tiểu tầng (Phàm Hồn -> Hóa Niệm -> Hỗn Độn Thần Thức).
   - **Cán Cân Âm Dương:** Điều hòa giữa Tâm Cảnh Bạch Minh và Ma Tính Hắc Ám. Ma tính quá cao kích hoạt Ma Tâm Nộ Phát, tăng sát thương nhưng giảm thọ nguyên và tăng tỷ lệ tẩu hỏa nhập ma; Tĩnh Tọa Trảm Ma giúp lấy lại sự thanh tịnh.
   - **Tam Đại Hồn Khí Trấn Thủ:** *Trảm Thần Kiếm* (gây True Damage), *Dưỡng Hồn Châu* (hồi MP và Thần Thức), *Trấn Hồn Chung* (kháng choáng và kháng uy áp).
   - **Uy Áp Thần Thức (Combat Suppression):**
     - Khi Thần Thức vượt trội đối thủ $\\ge 30\\%$: Giảm 15% Tốc Độ của địch và 20% tỷ lệ khiến địch tê liệt mất lượt đầu tiên.
     - Phóng ra **Thần Niệm Kiếm (Mind Blade)** bỏ qua 100% giáp của đối thủ ở Turn 1.
4. **Cơ Chế Khóa Cảnh Giới Nhục Thân & Thần Hồn Theo Tu Vi Bản Thể (Realm Lock Matrix):**
   - Tái hiện chân thực định luật tiên hiệp: *Bản thể kinh mạch/thức hải chưa đủ thâm sâu thì không thể dung nạp nhục thân bất hoại hay thần niệm viễn cổ*.
   - Khóa cứng nút Đột Phá Lên Đại Cảnh Giới Kế Tiếp nếu `currentRealm` bản thể chưa đạt mốc yêu cầu:
     - *Phàm Nhân (0):* Khóa trần Tier 1 (Phàm Thai / Phàm Hồn).
     - *Luyện Khí (1-10):* Khóa trần Tier 2 (Đồng Bì Thiết Cốt / Ngưng Thần).
     - *Trúc Cơ (11-15):* Khóa trần Tier 3 (Ngọc Nhũ Huyết / Dục Thần).
     - *Kim Đan (16-20):* Khóa trần Tier 4 (Tinh Thể Chân Nhân / Hóa Thần).
     - *Nguyên Anh (21-25):* Khóa trần Tier 5 (Vạn Tượng Lực / Du Thần).
     - *Hóa Thần (26-30):* Khóa trần Tier 6 (Kim Cang Bất Hoại / Nguyên Thần).
     - *Luyện Hư (31-35):* Khóa trần Tier 7 (Đạo Thể Sơ Thành / Phân Thần).
     - *Hợp Thể (36-40):* Khóa trần Tier 8 (Hư Không Chi Thân / Hợp Đạo Chân Linh).
     - *Đại Thừa – Độ Kiếp (41-50):* Khóa trần Tier 9 (Thánh Thể Viễn Cổ / Bất Hủ Thần Hồn).
     - *Tiên Giới – Đế Cảnh (51-104):* Khai mở cảnh giới tối thượng Tier 10 (Bất Diệt Tiên Thể / Hỗn Độn Thần Niệm).
   - Hiển thị Badge cảnh báo và vô hiệu hóa nút bấm kèm icon `Lock`, triệt tiêu hoàn toàn chấm đỏ notification khi bị khóa.
   - **Lối Tắt Điều Hướng (Quick Navigation):** Tích hợp nút thao tác nhanh `⚡ Đột Phá Bản Thể Ngay` hoặc `🧘 Đi Bế Quan Thổ Nạp` ngay trong banner cảnh báo khóa cảnh giới của `PhysiqueModal` và `SoulHubModal`, tự động đóng modal, cuộn mượt mà (smooth scroll) tới `#breakthrough-panel` hoặc `#cultivation-panel` ở Cột Giữa (`MiddleColumn.tsx`), kèm hiệu ứng phát quang viền vàng (`ring-amber-400 glow`) 1.5s dẫn dắt người chơi.

---

### 4.4. Tứ Đại Bách Nghệ (Đan • Khí • Trận • Phù)
- **Luyện Đan Các (`AlchemyTab.tsx`):**
  - Thu thập dược thảo từ Linh Điền và Bí Cảnh, đốt lửa luyện đan theo công thức.
  - Cấp bậc Luyện Đan Sư tăng dần từ Nhất Phẩm đến Cửu Phẩm, quyết định tỷ lệ xuất hiện đan dược Cực Phẩm với hiệu quả gấp đôi.
- **Thần Binh Luyện Khí (`ForgingTab.tsx`):**
  - *Đài Rèn Đúc:* Đúc vũ khí, phòng cụ, pháp bảo từ quặng khoáng; tôi luyện cường hóa chỉ số từ +1 đến +9.
  - *Đài Đục Lỗ & Khảm Ngọc:* Đục 1 - 4 lỗ khảm tùy phẩm cấp trang bị; khảm 7 loại Linh Ngọc (Kim, Mộc, Thủy, Hỏa, Thổ, Lôi, Phong) với 5 cấp bậc ngọc; tháo gỡ bảo toàn 100% ngọc.
  - *Lò Tẩy Luyện (Reforging & Affix Locking):* Trang bị Thượng Phẩm trở lên mở ra 2 - 4 dòng thuộc tính ẩn (Hút Máu, Xuyên Giáp, Phản Đòn, Sát Thương Bạo Kích). Cho phép khóa dòng quý hiếm khi tẩy lại toàn bộ các dòng khác.
- **Trận Pháp Các (`FormationTab.tsx`):**
  - Khắc Trận Bàn, bố trí 18 trận đồ mẫu (Chu Tước Phần Thiên Trận, Huyền Vũ Quy Giáp Trận, Lưỡng Nghi Tru Tiên Trận...).
  - **Cơ Chế Turn Trigger:** Kích hoạt hiệu ứng kỹ năng trận pháp theo hiệp định sẵn trong combat (ví dụ: cứ mỗi 3 hiệp triệu hồi Lôi Đình giáng 1,200 sát thương chuẩn).
- **Phù Lục Các (`TalismanTab.tsx`):**
  - Án thư cổ phong: Trộn chu sa, trải hoàng chỉ, vận chuyển thần niệm hạ bút vẽ bùa.
  - Trang bị tối đa 3 lá bùa vào **Phù Nang Xuất Chiến**: Bùa Chiến Đấu (tăng bạo kích, phóng kiếm khí trong combat), Bùa Đột Phá Hộ Mệnh (triệt tiêu 100% sát thương tâm ma khi phá cảnh thất bại).
- **Ma Trận Khóa Tứ Đại Bách Nghệ Theo Cảnh Giới Khí Tu (Dual-Lock Matrix):**
  - Tuân thủ nguyên lý tiên hiệp: Tu sĩ cảnh giới thấp không thể khống chế thiên địa linh khí, chân hỏa hay thần thức để luyện chế hoặc thăng giai bách nghệ vượt cảnh giới.
  - **Bảng Ma Trận Giới Hạn Giai Vị Tối Đa:**
    | Đại Cảnh Giới Khí Tu (`currentRealm`) | Trần Giai Vị Tối Đa | Danh Xưng Bách Nghệ Trần | Giới Hạn Cho Phép |
    | :--- | :---: | :--- | :--- |
    | **Phàm Nhân & Luyện Khí (0 – 10)** | **Giai 1 (Nhất Giai)** | Nhất Giai Học Đồ / Sơ Cấp Sư | Đan / Khí / Trận / Phù Nhất Giai |
    | **Trúc Cơ (11 – 15)** | **Giai 2 (Nhị Giai)** | Nhị Giai Đại Sư | Tối đa Nhị Giai (Chân Hỏa) |
    | **Kim Đan (16 – 20)** | **Giai 3 (Tam Giai)** | Tam Giai Tông Sư | Tối đa Tam Giai (Đan Hỏa ngưng tụ, đục lỗ 3) |
    | **Nguyên Anh (21 – 25)** | **Giai 4 (Tứ Giai)** | Tứ Giai Đại Tông Sư | Tối đa Tứ Giai (Thần thức nhập vi, đục lỗ 4) |
    | **Hóa Thần (26 – 30)** | **Giai 5 (Ngũ Giai)** | Ngũ Giai Thái Đẩu | Tối đa Ngũ Giai (Quy tắc thiên địa) |
    | **Luyện Hư (31 – 35)** | **Giai 6 (Lục Giai)** | Lục Giai Thánh Thủ | Tối đa Lục Giai (Tru Tiên Kiếm Trận) |
    | **Hợp Thể (36 – 40)** | **Giai 7 (Thất Giai)** | Thất Giai Chuẩn Tiên Sư | Tối đa Thất Giai |
    | **Đại Thừa – Độ Kiếp (41 – 50)** | **Giai 8 (Bát Giai)** | Bát Giai Tiên Thiên Đạo Sư | Tối đa Bát Giai (Khí tức chuẩn tiên) |
    | **Tiên Giới – Đế Cảnh (51 – 104)**| **Giai 9 (Cửu Giai / Thần Giai)**| Cửu Giai Thần Cấp / Thánh Tổ | Không giới hạn (Tiên Thiên Dị Bảo) |
  - **Cơ Chế Khóa Kép (Dual-Lock):**
    - *Khóa Chế Tác Vượt Phẩm:* Chặn bắt đầu luyện đan, rèn đúc, bố trận, họa phù cao hơn trần giai vị; hiển thị nhãn `🔒 Cần đạt [Cảnh Giới] để chế tác` và bắn Toast nhắc nhở khi bấm.
    - *Khóa Đột Phá Danh Xưng Nghề:* Khi EXP nghề chạm `maxExp`, chặn thăng cấp nếu bậc kế tiếp vượt trần tu vi, hiển thị badge `🔒 Đạo nghiệp chạm trần` và triệt tiêu chấm đỏ notification.

---

'''

    idx_start = content.find(start_marker)
    idx_end = content.find(end_marker)

    if idx_start == -1 or idx_end == -1:
        print(f"Error finding markers: start={idx_start}, end={idx_end}")
        sys.exit(1)

    new_content = content[:idx_start] + new_section_4 + content[idx_end:]

    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Successfully updated README.md with clean UTF-8!")

if __name__ == '__main__':
    main()
