// lib/talisman-data.ts
// Dữ liệu tĩnh cho phân hệ Phù Đạo Bách Nghệ • Phù Lục Các

import {
  TalismanRecipe,
  TalismanArtisan,
  TalismanBeltSlot,
} from '@/lib/types/talisman';

// ============================================================
// 9 BẬC DANH XƯNG PHÙ SƯ (TALISMAN_ARTISAN_RANKS)
// ============================================================
export const TALISMAN_ARTISAN_RANKS: {
  level: number;
  title: string;
  maxExp: number;
  description: string;
  color: string;
  badgeBg: string;
}[] = [
  {
    level: 1,
    title: 'Nhất Giai • Phù Đồ Nhập Môn',
    maxExp: 100,
    description: 'Mới lĩnh ngộ cách dùng chu sa dẫn linh khí vẽ đạo văn vào hoàng bì chỉ.',
    color: 'text-zinc-400',
    badgeBg: 'bg-zinc-800/80 border-zinc-600/50',
  },
  {
    level: 2,
    title: 'Nhị Giai • Phù Lục Sơ Học',
    maxExp: 250,
    description: 'Nắm vững bút pháp sơ thừa, họa ra hỏa cầu phù, hộ thể kim quang phù.',
    color: 'text-green-400',
    badgeBg: 'bg-emerald-950/80 border-emerald-600/50',
  },
  {
    level: 3,
    title: 'Tam Giai • Linh Phù Sư',
    maxExp: 500,
    description: 'Hòa trộn yêu thú tinh huyết cùng linh mặc, họa bùa trung giai phong ấn uy lực hiển hách.',
    color: 'text-blue-400',
    badgeBg: 'bg-blue-950/80 border-blue-600/50',
  },
  {
    level: 4,
    title: 'Tứ Giai • Đại Phù Sư',
    maxExp: 900,
    description: 'Bút lực thâm hậu, linh phù ngưng tụ sát khí lôi đình, trảm phá hộ thể cương khí đối thủ.',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-950/80 border-purple-600/50',
  },
  {
    level: 5,
    title: 'Ngũ Giai • Phù Đạo Tông Sư',
    maxExp: 1500,
    description: 'Chấp bút như rồng lượn phượng múa, câu thông thiên địa quy tắc, họa ra hỗn độn linh phù.',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 border-amber-600/50',
  },
  {
    level: 6,
    title: 'Lục Giai • Phù Hoàng Vô Thượng',
    maxExp: 2500,
    description: 'Phù chú nghịch chuyển càn khôn, khởi tử hồi sinh, cứu mạng trước cửa tử thần.',
    color: 'text-orange-400',
    badgeBg: 'bg-orange-950/80 border-orange-600/50',
  },
  {
    level: 7,
    title: 'Thất Giai • Thần Phù Tôn Giả',
    maxExp: 4000,
    description: 'Thần niệm hóa phù, không cần chỉ mực, một niệm phát xuất vạn đạo kiếm phù diệt địch.',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-950/80 border-rose-600/50',
  },
  {
    level: 8,
    title: 'Bát Giai • Chu Sa Đạo Tổ',
    maxExp: 7000,
    description: 'Chu sa nhuộm đỏ tinh hà, một đạo phù lục sánh ngang một phương tiểu thế giới.',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/80 border-cyan-600/50',
  },
  {
    level: 9,
    title: 'Cửu Giai • Thần Phù Thánh Tổ',
    maxExp: 99999,
    description: 'Đỉnh phong chí tôn của Phù Đạo chư thiên, phù thành đạo ứng, vạn pháp quy nhất.',
    color: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/80 border-yellow-500/60 shadow-[0_0_12px_rgba(234,179,8,0.3)]',
  },
];

export const createDefaultTalismanArtisan = (): TalismanArtisan => ({
  level: 1,
  exp: 0,
  maxExp: 100,
  totalCrafted: 0,
  learnedRecipeIds: ['recipe_giap_binh_phu', 'recipe_hoa_cau_phu'],
});

export const createDefaultTalismanBelt = (): TalismanBeltSlot[] => [
  { slotIndex: 0, talismanId: null },
  { slotIndex: 1, talismanId: null },
  { slotIndex: 2, talismanId: null },
];

// ============================================================
// DANH MỤC NGUYÊN LIỆU HỌA PHÙ
// ============================================================
export const TALISMAN_MATERIALS_CATALOG = [
  // Phù Chỉ
  { id: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', category: 'paper', tier: 1, description: 'Giấy bùa làm từ vỏ linh trúc sơ thiên, dùng vẽ bùa Nhất/Nhị Giai.' },
  { id: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', category: 'paper', tier: 3, description: 'Da cóc ngọc hoặc yêu thú lột xác, chất liệu bền dai chịu linh áp mạnh.' },
  { id: 'paper_thai_hu_kim_bac', name: 'Thái Hư Kim Bạc', category: 'paper', tier: 5, description: 'Lá vàng dát mỏng từ Thái Ất Thần Kim, bảo vật vẽ thần phù kinh thế.' },
  // Linh Mặc & Chu Sa
  { id: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', category: 'ink', tier: 1, description: 'Khoáng thạch chu sa xích hồng, nguyên liệu cơ bản nhất để điểm linh mực.' },
  { id: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', category: 'ink', tier: 3, description: 'Huyết dịch ngưng tụ sát khí của yêu thú trung cao giai, tăng uy lực bùa chú.' },
  { id: 'ink_thai_at_than_kim', name: 'Thái Ất Thần Kim Tủy', category: 'ink', tier: 5, description: 'Linh dịch thần kim ngưng đọng linh khí thái sơ, phát quang rực rỡ.' },
];

// ============================================================
// DANH MỤC 18 PHÙ ĐỒ MẪU (TALISMAN_RECIPES)
// ============================================================
export const TALISMAN_RECIPES: TalismanRecipe[] = [
  // ── NHẤT GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_giap_binh_phu',
    name: 'Giáp Binh Phù',
    type: 'combat',
    tier: 1,
    grade: 'Nhất Giai',
    description: 'Bùa hộ thân sơ cấp, khi xuất chiến tạo màn hộ thể hấp thụ sát thương tương đương 15% Khí Huyết tối đa.',
    requiredArtisanLevel: 1,
    linhThachCost: 40,
    baseSuccessRate: 90,
    baseExpGain: 15,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 2 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 1 },
    ],
    combatEffect: {
      shieldAmountPercent: 15,
      durationTurns: 2,
      description: 'Lớp màng giáp binh kim sắc hấp thụ sát thương bằng 15% Khí Huyết tối đa trong 2 hiệp.',
    },
  },
  {
    id: 'recipe_hoa_cau_phu',
    name: 'Hỏa Cầu Phù',
    type: 'combat',
    tier: 1,
    grade: 'Nhất Giai',
    description: 'Cháy bừng ngọn lửa tam muội, hiệp 1 ném ra tạo hỏa cầu nổ tung gây 120% Công Kích sát thương.',
    requiredArtisanLevel: 1,
    linhThachCost: 50,
    baseSuccessRate: 88,
    baseExpGain: 18,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 2 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 1 },
    ],
    combatEffect: {
      flatDamageMultiplier: 1.2,
      description: 'Phóng xuất quả cầu lửa rực cháy, gây 120% sát thương Công Kích ở hiệp mở màn.',
    },
  },
  {
    id: 'recipe_than_hanh_thien_ly',
    name: 'Thần Hành Thiên Lý Phù',
    type: 'utility',
    tier: 1,
    grade: 'Nhất Giai',
    description: 'Thần phong quấn quanh hai chân, tăng 10% Tốc Độ bế quan tu luyện trong 2 giờ và tăng 30% Tốc Độ thám hiểm Bí Cảnh.',
    requiredArtisanLevel: 1,
    linhThachCost: 60,
    baseSuccessRate: 85,
    baseExpGain: 20,
    triggerType: 'manual',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 2 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 1 },
    ],
    utilityEffect: {
      cultivationSpeedBonus: 10,
      secretRealmSpeedBonus: 30,
      durationHours: 2,
      description: 'Gia tốc phong hành: +10% Tốc Độ tu luyện bế quan trong 2 giờ và +30% Tốc Độ di chuyển Bí Cảnh Roguelite.',
    },
  },
  {
    id: 'recipe_thanh_tam_ninh_than',
    name: 'Thanh Tâm Ninh Thần Phù',
    type: 'breakthrough',
    tier: 1,
    grade: 'Nhất Giai',
    description: 'Xua tan tạp niệm, giữ vững linh đài thanh tịnh khi trùng kích bình cảnh, tăng +8% Kháng Tâm Ma.',
    requiredArtisanLevel: 1,
    linhThachCost: 80,
    baseSuccessRate: 82,
    baseExpGain: 22,
    triggerType: 'breakthrough',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 2 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 2 },
    ],
    breakthroughEffect: {
      tamMaResistBonus: 8,
      breakthroughSuccessBonus: 3,
      description: 'Linh đài thanh tịnh: Tăng +8% Kháng Tâm Ma và +3% Tỉ Lệ Đột Phá.',
    },
  },

  // ── NHỊ GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_kim_cuong_ho_the',
    name: 'Kim Cương Hộ Thể Phù',
    type: 'combat',
    tier: 2,
    grade: 'Nhị Giai',
    description: 'Bùa chú phòng thủ trứ danh, phù chỉ cháy rực ngưng tụ kim quang hư ảnh hấp thụ sát thương bằng 25% Khí Huyết tối đa trong 2 hiệp đầu.',
    requiredArtisanLevel: 2,
    linhThachCost: 120,
    baseSuccessRate: 80,
    baseExpGain: 35,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 3 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 2 },
    ],
    combatEffect: {
      shieldAmountPercent: 25,
      durationTurns: 2,
      description: 'Kim Quang Hộ Thể: Tạo một lớp màng hộ thể hấp thụ sát thương tương đương 25% Khí Huyết tối đa trong 2 hiệp đầu.',
    },
  },
  {
    id: 'recipe_cuu_thien_loi_hoa',
    name: 'Cửu Thiên Lôi Hỏa Phù',
    type: 'combat',
    tier: 2,
    grade: 'Nhị Giai',
    description: 'Dẫn lôi hỏa cửu thiên giáng xuống hiệp 1, gây sát thương nổ = 200% Công Kích và thiêu đốt đối thủ 5% HP mỗi hiệp.',
    requiredArtisanLevel: 2,
    linhThachCost: 150,
    baseSuccessRate: 78,
    baseExpGain: 40,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 3 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 3 },
    ],
    combatEffect: {
      flatDamageMultiplier: 2.0,
      burnPercent: 5,
      durationTurns: 2,
      description: 'Cửu Thiên Lôi Diễm: Nổ tung gây 200% Công Kích sát thương, kèm thiêu đốt 5% HP đối thủ mỗi hiệp.',
    },
  },
  {
    id: 'recipe_an_nac_hu_khong',
    name: 'Ẩn Nặc Hư Không Phù',
    type: 'utility',
    tier: 2,
    grade: 'Nhị Giai',
    description: 'Che giấu khí tức hòa nhập hư không, giảm 40% tỷ lệ bị quái vật phục kích trong Bí Cảnh, tăng gấp đôi cơ hội tìm thấy Cổ Thần Tàng Bảo Các.',
    requiredArtisanLevel: 2,
    linhThachCost: 160,
    baseSuccessRate: 75,
    baseExpGain: 45,
    triggerType: 'manual',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 3 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 2 },
    ],
    utilityEffect: {
      ambushReductionChance: 40,
      secretRealmSpeedBonus: 20,
      durationHours: 3,
      description: 'Hư Không Ẩn Thân: Giảm 40% tỷ lệ phục kích trong Bí Cảnh, nhân đôi cơ hội gặp Kỳ Duyên / Tàng Bảo Các.',
    },
  },
  {
    id: 'recipe_tran_ma_tinh_tam',
    name: 'Trấn Ma Tịnh Tâm Phù',
    type: 'breakthrough',
    tier: 2,
    grade: 'Nhị Giai',
    description: 'Chấn áp tâm ma phản phệ lúc độ kiếp, tăng vĩnh viễn +15% Kháng Tâm Ma trong lần độ kiếp đó.',
    requiredArtisanLevel: 2,
    linhThachCost: 200,
    baseSuccessRate: 72,
    baseExpGain: 50,
    triggerType: 'breakthrough',
    requiredMaterials: [
      { itemId: 'paper_hoang_bi', name: 'Hoàng Bì Chỉ', quantity: 3 },
      { itemId: 'ink_chu_sa_khoang', name: 'Chu Sa Khoáng', quantity: 3 },
    ],
    breakthroughEffect: {
      tamMaResistBonus: 15,
      breakthroughSuccessBonus: 5,
      description: 'Trấn Ma Hộ Mệnh: Tăng +15% Kháng Tâm Ma và +5% Tỉ Lệ Đột Phá cảnh giới.',
    },
  },

  // ── TAM GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_dinh_than_troi_hon',
    name: 'Định Thân Trói Hồn Phù',
    type: 'combat',
    tier: 3,
    grade: 'Tam Giai',
    description: 'Hệ Thần Thức thần diệu, 35% tỷ lệ phong ấn khiến đối thủ tê liệt thần hồn, mất lượt đánh kế tiếp.',
    requiredArtisanLevel: 3,
    linhThachCost: 280,
    baseSuccessRate: 70,
    baseExpGain: 70,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 2 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 2 },
    ],
    combatEffect: {
      stunChance: 35,
      flatDamageMultiplier: 1.3,
      description: 'Trói Hồn Tê Liệt: 35% xác suất phong ấn khiến Boss mất lượt đánh đầu tiên và chịu thêm 130% sát thương.',
    },
  },
  {
    id: 'recipe_ti_loi_dan_kiep',
    name: 'Tị Lôi Dẫn Kiếp Phù',
    type: 'breakthrough',
    tier: 3,
    grade: 'Tam Giai',
    description: 'Bảo phù cứu mạng khi độ kiếp, triệt tiêu 30% sát thương Thiên Kiếp giáng xuống nếu đột phá thất bại.',
    requiredArtisanLevel: 3,
    linhThachCost: 320,
    baseSuccessRate: 68,
    baseExpGain: 75,
    triggerType: 'breakthrough',
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 2 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 2 },
    ],
    breakthroughEffect: {
      tribulationDmgReduction: 30,
      breakthroughSuccessBonus: 8,
      description: 'Dẫn Lôi Tiêu Kiếp: Triệt tiêu 30% tổn thất Thiên Kiếp khi thất bại, tăng +8% Tỉ Lệ Đột Phá.',
    },
  },
  {
    id: 'recipe_huyet_don_cuu_mang',
    name: 'Huyết Độn Cứu Mạng Phù',
    type: 'combat',
    tier: 3,
    grade: 'Tam Giai',
    description: 'Cơ chế cứu mạng tối thượng: Tự động kích hoạt khi Khí Huyết nhân vật rơi xuống dưới 15%: Ngay lập tức hồi phục 30% HP và tăng 50% Né Tránh trong 2 hiệp kế tiếp để lật kèo.',
    requiredArtisanLevel: 3,
    linhThachCost: 350,
    baseSuccessRate: 65,
    baseExpGain: 85,
    triggerType: 'hp_low',
    triggerConditionValue: 15,
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 2 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 3 },
    ],
    combatEffect: {
      healPercent: 30,
      evasionBuffPercent: 50,
      durationTurns: 2,
      description: 'Huyết Độn Bảo Mệnh: Sinh mệnh nguy nan (HP <= 15%), lập tức hồi 30% HP và tăng 50% Né Tránh trong 2 hiệp.',
    },
  },
  {
    id: 'recipe_bang_phach_han_quang',
    name: 'Băng Phách Hàn Quang Phù',
    type: 'combat',
    tier: 3,
    grade: 'Tam Giai',
    description: 'Hàn khí ngưng kết không gian, gây 180% sát thương Công Kích và làm giảm 25% Tốc Độ hành động của đối phương.',
    requiredArtisanLevel: 3,
    linhThachCost: 300,
    baseSuccessRate: 68,
    baseExpGain: 80,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 2 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 2 },
    ],
    combatEffect: {
      flatDamageMultiplier: 1.8,
      durationTurns: 2,
      description: 'Hàn Quang Đống Kết: Gây 180% Công Kích và phong tỏa tốc độ hành động đối thủ 25%.',
    },
  },

  // ── TỨ GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_thien_kiem_van_nhan',
    name: 'Thiên Kiếm Vạn Nhận Phù',
    type: 'combat',
    tier: 4,
    grade: 'Tứ Giai',
    description: 'Bỏ qua 100% Giáp đối thủ, phóng xuất vạn đạo kiếm khí gây sát thương chuẩn cực đại = 250% Công Kích.',
    requiredArtisanLevel: 4,
    linhThachCost: 500,
    baseSuccessRate: 60,
    baseExpGain: 120,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 3 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 3 },
    ],
    combatEffect: {
      flatDamageMultiplier: 2.5,
      ignoreDefense: true,
      description: 'Vạn Nhận Quy Tông: Phóng xuất vạn đạo kim sắc kiếm khí xuyên thấu 100% Giáp, gây 250% True Damage!',
    },
  },
  {
    id: 'recipe_cuu_u_phong_hon',
    name: 'Cửu U Phong Hồn Phù',
    type: 'combat',
    tier: 4,
    grade: 'Tứ Giai',
    description: 'Giam cầm thần thức yêu ma, 50% tỷ lệ choáng Boss ở hiệp 1 và suy giảm 30% Công Kích của đối thủ.',
    requiredArtisanLevel: 4,
    linhThachCost: 550,
    baseSuccessRate: 58,
    baseExpGain: 130,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 3 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 3 },
    ],
    combatEffect: {
      stunChance: 50,
      flatDamageMultiplier: 1.5,
      durationTurns: 2,
      description: 'Phong Hồn Tác Tướng: 50% xác suất choáng hiệp 1, giảm 30% sát thương đối thủ trong 2 hiệp.',
    },
  },
  {
    id: 'recipe_huyen_thien_ho_menh',
    name: 'Huyền Thiên Hộ Mệnh Phù',
    type: 'breakthrough',
    tier: 4,
    grade: 'Tứ Giai',
    description: 'Linh phù hộ đạo cao cấp, tăng +25% Kháng Tâm Ma và giảm 45% sát thương thiên kiếp nếu độ kiếp gặp hung hiểm.',
    requiredArtisanLevel: 4,
    linhThachCost: 650,
    baseSuccessRate: 55,
    baseExpGain: 150,
    triggerType: 'breakthrough',
    requiredMaterials: [
      { itemId: 'paper_ngoc_thiem_bi', name: 'Ngọc Thiềm Bì', quantity: 3 },
      { itemId: 'ink_yeu_thu_tinh_huyet', name: 'Yêu Thú Tinh Huyết', quantity: 4 },
    ],
    breakthroughEffect: {
      tamMaResistBonus: 25,
      tribulationDmgReduction: 45,
      breakthroughSuccessBonus: 12,
      description: 'Huyền Thiên Bảo Giáp: +25% Kháng Tâm Ma, -45% sát thương Thiên Kiếp, +12% Tỉ Lệ Đột Phá.',
    },
  },

  // ── NGŨ GIAI / LỤC GIAI / THẦN GIAI ───────────────────────
  {
    id: 'recipe_thai_so_hon_don',
    name: 'Thái Sơ Hỗn Độn Phù',
    type: 'combat',
    tier: 5,
    grade: 'Ngũ Giai',
    description: 'Khai thiên tích địa thần phù, gây 350% Công Kích sát thương hỗn độn, hồi phục 35% HP và khiến kẻ địch ngưng trệ 1 hiệp.',
    requiredArtisanLevel: 5,
    linhThachCost: 1200,
    baseSuccessRate: 48,
    baseExpGain: 250,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_thai_hu_kim_bac', name: 'Thái Hư Kim Bạc', quantity: 2 },
      { itemId: 'ink_thai_at_than_kim', name: 'Thái Ất Thần Kim Tủy', quantity: 2 },
    ],
    combatEffect: {
      flatDamageMultiplier: 3.5,
      healPercent: 35,
      stunChance: 60,
      description: 'Hỗn Độn Sơ Khai: Bộc phát 350% sát thương Hỗn Độn, hồi 35% HP và 60% làm địch ngưng trệ 1 hiệp!',
    },
  },
  {
    id: 'recipe_bat_diet_luan_hoi',
    name: 'Bất Diệt Luân Hồi Phù',
    type: 'combat',
    tier: 6,
    grade: 'Lục Giai',
    description: 'Thần phù nghịch chuyển sinh tử: Khi Khí Huyết <= 10%, ngay lập tức hồi 50% HP và tạo lớp màng hộ mệnh hấp thụ 50% Max HP!',
    requiredArtisanLevel: 6,
    linhThachCost: 2000,
    baseSuccessRate: 40,
    baseExpGain: 400,
    triggerType: 'hp_low',
    triggerConditionValue: 10,
    requiredMaterials: [
      { itemId: 'paper_thai_hu_kim_bac', name: 'Thái Hư Kim Bạc', quantity: 3 },
      { itemId: 'ink_thai_at_than_kim', name: 'Thái Ất Thần Kim Tủy', quantity: 3 },
    ],
    combatEffect: {
      healPercent: 50,
      shieldAmountPercent: 50,
      evasionBuffPercent: 40,
      durationTurns: 2,
      description: 'Luân Hồi Nghịch Mệnh: Ngay khi sinh mệnh hấp hối (HP <= 10%), lập tức hồi 50% HP và tạo khiên 50% Max HP!',
    },
  },
  {
    id: 'recipe_van_kiep_tru_tien',
    name: 'Vạn Kiếp Tru Tiên Phù',
    type: 'combat',
    tier: 7,
    grade: 'Thần Giai',
    description: 'Cấm kỵ phù lục thượng cổ, dẫn động Tru Tiên Kiếm Trận hư ảnh, gây 450% Công Kích sát thương chuẩn, vạn kiếp bất phục.',
    requiredArtisanLevel: 7,
    linhThachCost: 3500,
    baseSuccessRate: 35,
    baseExpGain: 600,
    triggerType: 'turn_start',
    requiredMaterials: [
      { itemId: 'paper_thai_hu_kim_bac', name: 'Thái Hư Kim Bạc', quantity: 5 },
      { itemId: 'ink_thai_at_than_kim', name: 'Thái Ất Thần Kim Tủy', quantity: 5 },
    ],
    combatEffect: {
      flatDamageMultiplier: 4.5,
      ignoreDefense: true,
      burnPercent: 10,
      description: 'Tru Tiên Tận Diệt: Bộc phát 450% True Damage xuyên thủng mọi phòng ngự, thiêu rụi đạo thể đối phương!',
    },
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export const getTalismanRecipeById = (id: string): TalismanRecipe | undefined =>
  TALISMAN_RECIPES.find(r => r.id === id);

export const getTalismanRecipesByTier = (tier: number): TalismanRecipe[] =>
  TALISMAN_RECIPES.filter(r => r.tier === tier);

export const getTalismanRankByLevel = (level: number) => {
  const safeLevel = Math.max(1, Math.min(9, level));
  return TALISMAN_ARTISAN_RANKS.find(r => r.level === safeLevel) || TALISMAN_ARTISAN_RANKS[0];
};
