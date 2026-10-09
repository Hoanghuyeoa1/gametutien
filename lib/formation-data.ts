// lib/formation-data.ts
// Dữ liệu tĩnh cho phân hệ Trận Đạo Bách Nghệ • Trận Pháp Các
import { FormationRecipe, FormationArtisan } from '@/lib/types/formation';

// ============================================================
// 9 BẬC DANH XƯNG TRẬN PHÁP SƯ
// ============================================================
export const FORMATION_ARTISAN_RANKS: {
  level: number;
  title: string;
  maxExp: number;
  description: string;
  color: string;
}[] = [
  { level: 1, title: 'Nhất Giai • Trận Đồ Sơ Học',  maxExp: 100,   description: 'Mới bước vào cửa Trận Đạo, chỉ biết khắc vẽ trận đồ đơn giản.', color: 'text-zinc-400' },
  { level: 2, title: 'Nhị Giai • Trận Đạo Học Đồ',   maxExp: 250,   description: 'Đã nắm vững nguyên lý Tứ Tượng, có thể khắc trận Nhị Giai.', color: 'text-green-400' },
  { level: 3, title: 'Tam Giai • Trận Pháp Sư',      maxExp: 500,   description: 'Hiểu rõ Ngũ Hành tương sinh tương khắc trong trận pháp.', color: 'text-blue-400' },
  { level: 4, title: 'Tứ Giai • Đại Trận Sư',        maxExp: 900,   description: 'Có thể xây dựng trận địa quy mô, bố cục tinh vi.', color: 'text-purple-400' },
  { level: 5, title: 'Ngũ Giai • Trận Đạo Tông Sư',  maxExp: 1500,  description: 'Thấu triệt Bát Quái, linh hoạt biến hóa trận thế.', color: 'text-amber-400' },
  { level: 6, title: 'Lục Giai • Trận Vương',         maxExp: 2500,  description: 'Có thể khắc chế đại trận che thiên phủ địa, lay động sơn hà.', color: 'text-orange-400' },
  { level: 7, title: 'Thất Giai • Trận Hoàng',        maxExp: 4000,  description: 'Một mình bố trận có thể thoái địch thiên binh vạn mã.', color: 'text-rose-400' },
  { level: 8, title: 'Bát Giai • Trận Thánh',         maxExp: 7000,  description: 'Trận đồ đạt đến cảnh giới "pháp thiên tượng địa", trận thành tức thần.', color: 'text-cyan-400' },
  { level: 9, title: 'Cửu Giai • Thần Trận Đại Tổ',  maxExp: 99999, description: 'Đỉnh cao tuyệt đỉnh Trận Đạo, mỗi một trận đồ đều là vô thượng bảo điển.', color: 'text-yellow-300' },
];

export const createDefaultFormationArtisan = (): FormationArtisan => ({
  level: 1,
  exp: 0,
  maxExp: 100,
  totalCrafted: 0,
  learnedRecipeIds: ['recipe_tu_tuong_ho_the', 'recipe_canh_kim_tru_yeu'],
});

// ============================================================
// DANH MỤC 18 TRẬN ĐỒ MẪU (FORMATION_RECIPES)
// ============================================================
export const FORMATION_RECIPES: FormationRecipe[] = [
  // ── NHẤT GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_tu_tuong_ho_the',
    name: 'Tứ Tượng Hộ Thể Trận',
    type: 'battle',
    tier: 1,
    grade: 'Nhất Giai',
    element: 'tho',
    description: 'Trận căn bản nhất, triệu hóa Tứ Linh Thú bảo hộ xung quanh thân, tăng phòng thủ tổng thể.',
    lore: 'Thanh Long, Bạch Hổ, Chu Tước, Huyền Vũ — tứ linh đồng thủ, vững như bàn thạch.',
    requiredArtisanLevel: 1,
    linhThachCost: 50,
    baseSuccessRate: 90,
    baseExpGain: 15,
    requiredMaterials: [
      { itemId: 'ore_huyen_thiet', name: 'Huyền Thiết Khoáng', quantity: 3, itemCategory: 'ore' },
    ],
    combatBuff: {
      defBonus: 15,
      hpBonus: 200,
      triggerEffectDescription: 'Tứ Linh Hộ Vệ: Tăng Phòng Ngự +15, Khí Huyết +200.',
    },
  },
  {
    id: 'recipe_canh_kim_tru_yeu',
    name: 'Canh Kim Trừ Yêu Trận',
    type: 'battle',
    tier: 1,
    grade: 'Nhất Giai',
    element: 'kim',
    description: 'Trận Kim hệ đơn giản, mỗi hiệp có 20% tỉ lệ tung ra một đường kiếm khí xuyên giáp.',
    lore: 'Vàng ánh sắc bén, trảm yêu trừ ma, kiếm khí lồng lộng.',
    requiredArtisanLevel: 1,
    linhThachCost: 60,
    baseSuccessRate: 85,
    baseExpGain: 18,
    requiredMaterials: [
      { itemId: 'ore_huyen_thiet', name: 'Huyền Thiết Khoáng', quantity: 4, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 20,
      triggerChance: 20,
      triggerDamagePercent: 80,
      triggerEffectDescription: 'Kiếm Khí Xuyên Giáp: 20% tỉ lệ mỗi hiệp phóng xuất kiếm khí gây 80% ATK sát thương bỏ qua giáp.',
    },
  },

  // ── NHỊ GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_tuc_phong_bo_phap',
    name: 'Tụ Phong Bộ Pháp Trận',
    type: 'battle',
    tier: 2,
    grade: 'Nhị Giai',
    element: 'phong',
    description: 'Trận Phong hệ tụ tập linh phong quanh chân, tăng vượt bậc tốc độ và tỉ lệ né tránh.',
    lore: 'Phong thần gia hộ, thân nhẹ tựa mây, né tránh thiên binh.',
    requiredArtisanLevel: 2,
    linhThachCost: 120,
    baseSuccessRate: 80,
    baseExpGain: 30,
    requiredMaterials: [
      { itemId: 'ore_huyen_thiet', name: 'Huyền Thiết Khoáng', quantity: 3, itemCategory: 'ore' },
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 2, itemCategory: 'ore' },
    ],
    combatBuff: {
      speedBonus: 25,
      critRateBonus: 8,
      triggerEffectDescription: 'Phong Thần Gia Hộ: Tốc Độ +25, Tỉ Lệ Bạo Kích +8%.',
    },
  },
  {
    id: 'recipe_thuy_long_hoi_sinh',
    name: 'Thủy Long Hồi Sinh Trận',
    type: 'battle',
    tier: 2,
    grade: 'Nhị Giai',
    element: 'thuy',
    description: 'Trận Thủy hệ dẫn dòng nước linh hồi phục Khí Huyết mỗi khi chịu sát thương.',
    lore: 'Thủy chi nhu, khắc vạn cứng. Linh tuyền tự dưỡng, bất diệt chi thân.',
    requiredArtisanLevel: 2,
    linhThachCost: 130,
    baseSuccessRate: 78,
    baseExpGain: 32,
    requiredMaterials: [
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 4, itemCategory: 'ore' },
    ],
    combatBuff: {
      hpRegenPercent: 3,
      hpBonus: 300,
      triggerEffectDescription: 'Linh Tuyền Tự Dưỡng: Hồi 3% Khí Huyết mỗi khi chịu tấn công. HP tối đa +300.',
    },
  },
  {
    id: 'recipe_tuc_linh_hoa_kiep',
    name: 'Tụ Linh Hóa Kiếp Trận',
    type: 'tribulation',
    tier: 2,
    grade: 'Nhị Giai',
    element: 'hon_don',
    description: 'Trận Hộ Pháp tiêu hao khi đột phá: Giảm 20% sát thương lôi kiếp, tăng 10% tỉ lệ thành công.',
    lore: 'Trận pháp hóa kiếp nạn, vượt thiên kiếp ổn như thái sơn.',
    requiredArtisanLevel: 2,
    linhThachCost: 150,
    baseSuccessRate: 75,
    baseExpGain: 40,
    requiredMaterials: [
      { itemId: 'ore_huyen_thiet', name: 'Huyền Thiết Khoáng', quantity: 2, itemCategory: 'ore' },
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 3, itemCategory: 'ore' },
    ],
    combatBuff: {
      tribulationDmgReduction: 20,
      breakthroughSuccessBonus: 10,
      triggerEffectDescription: 'Hóa Kiếp Hộ Pháp: Giảm 20% sát thương Thiên Kiếp. Tỉ lệ đột phá +10%.',
    },
  },

  // ── TAM GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_bat_quai_phong_ma',
    name: 'Bát Quái Phong Ma Trận',
    type: 'battle',
    tier: 3,
    grade: 'Tam Giai',
    element: 'tho',
    description: 'Cứ sau 3 hiệp đấu, tự động phóng xuất phù văn trói chân đối thủ, giảm 30% Công Kích và khóa bạo kích 1 hiệp.',
    lore: 'Bát quái xoay vần, âm dương biến hóa, phong toả thiên địa.',
    requiredArtisanLevel: 3,
    linhThachCost: 280,
    baseSuccessRate: 72,
    baseExpGain: 55,
    requiredMaterials: [
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 4, itemCategory: 'ore' },
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 1, itemCategory: 'ore' },
    ],
    combatBuff: {
      defBonus: 20,
      turnTriggerInterval: 3,
      triggerAtkDebuffPercent: 30,
      triggerCritBlockTurns: 1,
      triggerEffectDescription: '🌀 Bát Quái Phong Ma: Mỗi 3 hiệp, phóng phù văn trói chân — đối thủ mất 30% Công Kích và bị khóa Bạo Kích trong 1 hiệp.',
    },
  },
  {
    id: 'recipe_thai_cuc_linh_tuyen',
    name: 'Thái Cực Linh Tuyền Trận',
    type: 'battle',
    tier: 3,
    grade: 'Tam Giai',
    element: 'thuy',
    description: 'Âm dương điều hòa, tăng đều tất cả chỉ số cơ bản và hồi một lượng nhỏ Khí Huyết sau mỗi 2 hiệp.',
    lore: 'Thái Cực sinh lưỡng nghi, hư thực tương sinh, tiêu diêu tự tại.',
    requiredArtisanLevel: 3,
    linhThachCost: 300,
    baseSuccessRate: 70,
    baseExpGain: 58,
    requiredMaterials: [
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 5, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 15,
      defBonus: 15,
      hpBonus: 400,
      turnTriggerInterval: 2,
      triggerDamagePercent: 0,
      hpRegenPercent: 5,
      triggerEffectDescription: '💧 Thái Cực Linh Tuyền: Mỗi 2 hiệp tự hồi 5% Khí Huyết. ATK/DEF đều +15.',
    },
  },
  {
    id: 'recipe_u_hoa_dot_hon',
    name: 'U Hỏa Đốt Hồn Trận',
    type: 'battle',
    tier: 3,
    grade: 'Tam Giai',
    element: 'hoa',
    description: 'Hỏa hệ trận pháp hung mãnh, đầu mỗi hiệp có 30% tỉ lệ bùng phát thiêu đốt gây thiệt hại nặng.',
    lore: 'U hỏa hừng hực, thiêu đốt hồn phách, ma thú kinh hãi.',
    requiredArtisanLevel: 3,
    linhThachCost: 320,
    baseSuccessRate: 68,
    baseExpGain: 60,
    requiredMaterials: [
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 3, itemCategory: 'ore' },
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 1, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 30,
      triggerChance: 30,
      triggerDamagePercent: 120,
      triggerEffectDescription: '🔥 U Hỏa Bùng Phát: 30% tỉ lệ mỗi hiệp bùng phát đốt hồn gây 120% ATK sát thương.',
    },
  },
  {
    id: 'recipe_thanh_tam_dinh_phach',
    name: 'Thanh Tâm Định Phách Trận',
    type: 'tribulation',
    tier: 3,
    grade: 'Tam Giai',
    element: 'thuy',
    description: 'Trận Hộ Pháp tiêu hao: Miễn trừ nguy cơ Tâm Ma xâm lấn nếu đột phá thất bại, giữ vững Thần Thức.',
    lore: 'Tâm như nước tĩnh, ma hà năng xâm? Định phách an hồn, vô khủng vô úy.',
    requiredArtisanLevel: 3,
    linhThachCost: 350,
    baseSuccessRate: 65,
    baseExpGain: 65,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 2, itemCategory: 'ore' },
    ],
    combatBuff: {
      antidemonCorruption: true,
      tribulationDmgReduction: 10,
      triggerEffectDescription: '🌊 Thanh Tâm Định Phách: Miễn trừ Tâm Ma xâm lấn khi đột phá thất bại. Giảm 10% sát thương Thiên Kiếp.',
    },
  },

  // ── TỨ GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_cuu_tieu_loi_dong',
    name: 'Cửu Tiêu Lôi Động Trận',
    type: 'battle',
    tier: 4,
    grade: 'Tứ Giai',
    element: 'loi',
    description: 'Lôi hệ cường đại — đầu mỗi hiệp có 35% tỉ lệ gọi một tia thiên lôi giáng xuống gây 150% ATK sát thương.',
    lore: 'Cửu tiêu lôi cuồn, thiên lôi giáng thế, uy trấn cả vũ trụ.',
    requiredArtisanLevel: 4,
    linhThachCost: 600,
    baseSuccessRate: 62,
    baseExpGain: 90,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 3, itemCategory: 'ore' },
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 3, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 25,
      critRateBonus: 10,
      triggerChance: 35,
      triggerDamagePercent: 150,
      triggerEffectDescription: '⚡ Cửu Tiêu Lôi Giáng: 35% mỗi hiệp gọi thiên lôi giáng xuống gây 150% ATK sát thương!',
    },
  },
  {
    id: 'recipe_ngu_hanh_quy_nguyen',
    name: 'Ngũ Hành Quy Nguyên Trận',
    type: 'battle',
    tier: 4,
    grade: 'Tứ Giai',
    element: 'hon_don',
    description: 'Ngũ hành hòa hợp — tăng vĩnh viễn 15% Phòng Ngự và tự hồi 3% Khí Huyết mỗi khi bị tấn công.',
    lore: 'Kim Mộc Thủy Hỏa Thổ — ngũ hành thuận hòa, thiên địa chi lý đều quy về một chỗ.',
    requiredArtisanLevel: 4,
    linhThachCost: 700,
    baseSuccessRate: 58,
    baseExpGain: 100,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 4, itemCategory: 'ore' },
    ],
    combatBuff: {
      defBonus: 30,
      dmgReductionBonus: 15,
      hpRegenPercent: 3,
      triggerEffectDescription: '🌍 Ngũ Hành Quy Nguyên: Phòng Ngự +30, Giảm Sát Thương 15%, Hồi 3% HP khi bị đánh.',
    },
  },
  {
    id: 'recipe_pha_cam_tran_ban',
    name: 'Hỗn Nguyên Phá Cấm Trận Bàn',
    type: 'utility',
    tier: 4,
    grade: 'Tứ Giai',
    element: 'hon_don',
    description: 'Trận Bàn Tiện Ích: Mang theo khi thám hiểm Bí Cảnh, tự động vô hiệu hóa 60% cạm bẫy Cấm Chế Cổ Trận.',
    lore: 'Hỗn Nguyên chi khí bao trùm cổ trận, nhìn thấu mọi huyền cơ bí ẩn.',
    requiredArtisanLevel: 4,
    linhThachCost: 800,
    baseSuccessRate: 60,
    baseExpGain: 95,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 3, itemCategory: 'ore' },
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 2, itemCategory: 'ore' },
    ],
    combatBuff: {
      trapNullifyChance: 60,
      triggerEffectDescription: '🔓 Phá Cấm Hỗn Nguyên: 60% tỉ lệ tự động vô hiệu hóa cạm bẫy Cấm Chế khi thám hiểm Bí Cảnh.',
    },
  },

  // ── NGŨ GIAI ──────────────────────────────────────────────
  {
    id: 'recipe_chu_tuoc_dot_thien',
    name: 'Chu Tước Đốt Thiên Trận',
    type: 'battle',
    tier: 5,
    grade: 'Ngũ Giai',
    element: 'hoa',
    description: 'Triệu hóa Chu Tước linh điểu — mỗi 3 hiệp bùng phát cánh lửa thiêu đốt, gây sát thương khổng lồ và thiêu đốt 2 hiệp liên tiếp.',
    lore: 'Chu Tước tái sinh từ lửa, uy lực đốt cháy thiên quân.',
    requiredArtisanLevel: 5,
    linhThachCost: 1200,
    baseSuccessRate: 55,
    baseExpGain: 140,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 5, itemCategory: 'ore' },
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 3, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 40,
      critDmgBonus: 20,
      turnTriggerInterval: 3,
      triggerDamagePercent: 200,
      triggerEffectDescription: '🦅 Chu Tước Đốt Thiên: Mỗi 3 hiệp Chu Tước bùng phát gây 200% ATK sát thương lửa.',
    },
  },
  {
    id: 'recipe_van_phat_trieu_tong',
    name: 'Vạn Phật Triều Tông Trận',
    type: 'battle',
    tier: 5,
    grade: 'Ngũ Giai',
    element: 'hon_don',
    description: 'Vạn đạo Phật quang che chở — tăng mạnh tất cả chỉ số, kích hoạt kim cang bất diệt mỗi 4 hiệp.',
    lore: 'Vạn Phật quy tông, kim cang bất hoại, nhất thân thành yếu địa.',
    requiredArtisanLevel: 5,
    linhThachCost: 1500,
    baseSuccessRate: 50,
    baseExpGain: 160,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 6, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 30,
      defBonus: 30,
      hpBonus: 600,
      critRateBonus: 10,
      turnTriggerInterval: 4,
      dmgReductionBonus: 20,
      triggerEffectDescription: '🌟 Vạn Phật Triều Tông: Mỗi 4 hiệp kích hoạt Kim Cang Bất Diệt — giảm sát thương 20% trong 1 hiệp.',
    },
  },

  // ── LỤC GIAI + THẦN GIAI ──────────────────────────────────
  {
    id: 'recipe_tru_tien_kiem_tran',
    name: 'Tru Tiên Kiếm Trận',
    type: 'battle',
    tier: 6,
    grade: 'Lục Giai • Tuyệt Phẩm Thần Giai',
    element: 'kim',
    description: 'Đỉnh cao tuyệt đỉnh Trận Đạo: Tăng +30% Sát Thương Bạo Kích, mỗi 4 hiệp phóng xuất vạn đạo kiếm khí bỏ qua 100% giáp đối thủ.',
    lore: 'Tru Tiên tứ kiếm — Tru Tiên, Hàm Tiên, Tuyệt Tiên, Vạn Tiên — vạn cổ vô song, tru diệt mọi tu tiên giả.',
    requiredArtisanLevel: 6,
    linhThachCost: 3000,
    baseSuccessRate: 40,
    baseExpGain: 300,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 8, itemCategory: 'ore' },
      { itemId: 'ore_u_tinh_thach', name: 'U Tinh Thạch', quantity: 5, itemCategory: 'ore' },
    ],
    combatBuff: {
      critDmgBonus: 30,
      critRateBonus: 15,
      atkBonus: 50,
      turnTriggerInterval: 4,
      triggerDamagePercent: 300,
      triggerEffectDescription: '⚔️ Tru Tiên Kiếm Khí: Mỗi 4 hiệp vạn đạo kiếm khí phóng xuất, gây 300% ATK bỏ qua TOÀN BỘ giáp đối thủ!',
    },
  },

  // ── THẤT GIAI ─────────────────────────────────────────────
  {
    id: 'recipe_that_tinh_bac_dau_tran',
    name: 'Thất Tinh Bắc Đẩu Trận',
    type: 'battle',
    tier: 7,
    grade: 'Thất Giai',
    element: 'loi',
    description: 'Thất Tinh hội tụ, lôi đình giáng thế. Tăng mạnh bạo kích và sát thương lôi nguyên bản.',
    lore: 'Thiên Xu, Thiên Tuyền, Thiên Cơ, Thiên Quyền, Ngọc Hành, Khai Dương, Dao Quang — thất tinh lôi đình vạn thế.',
    requiredArtisanLevel: 7,
    linhThachCost: 10000,
    baseSuccessRate: 35,
    baseExpGain: 500,
    requiredMaterials: [
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 12, itemCategory: 'ore' },
      { itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', quantity: 3, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 120,
      critRateBonus: 20,
      critDmgBonus: 50,
      turnTriggerInterval: 3,
      triggerDamagePercent: 350,
      triggerEffectDescription: '⚡ Thất Tinh Bắc Đẩu Lôi: Mỗi 3 hiệp thiên lôi oanh kích gây 350% ATK sát thương Lôi.',
    },
  },

  // ── BÁT GIAI ─────────────────────────────────────────────
  {
    id: 'recipe_bat_quai_can_khon_tran',
    name: 'Bát Quái Càn Khôn Vô Cực Trận',
    type: 'tribulation',
    tier: 8,
    grade: 'Bát Giai',
    element: 'hon_don',
    description: 'Càn Khôn Bát Quái xoay chuyển thiên địa, giảm 50% sát thương thiên kiếp và hồi phục sinh mệnh cực đại.',
    lore: 'Càn Khôn tương thôi nhi sinh biến hóa, bát phương quy nhất nhi thành vô cực.',
    requiredArtisanLevel: 8,
    linhThachCost: 50000,
    baseSuccessRate: 30,
    baseExpGain: 1000,
    requiredMaterials: [
      { itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', quantity: 6, itemCategory: 'ore' },
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 15, itemCategory: 'ore' },
    ],
    combatBuff: {
      hpBonus: 5000,
      defBonus: 200,
      dmgReductionBonus: 35,
      tribulationDmgReduction: 50,
      breakthroughSuccessBonus: 25,
      antidemonCorruption: true,
      triggerEffectDescription: '☯️ Càn Khôn Vô Cực: Giảm 50% sát thương thiên kiếp, tăng 25% tỉ lệ đột phá và miễn nhiễm tâm ma.',
    },
  },

  // ── CỬU GIAI (THẦN ĐẠO VÔ THƯỢNG) ──────────────────────────
  {
    id: 'recipe_cuu_cuc_vo_thuong_tien_tran',
    name: 'Cửu Cực Vô Thượng Tiên Trận',
    type: 'utility',
    tier: 9,
    grade: 'Cửu Giai • Thần Giai Chí Tôn',
    element: 'hon_don',
    description: 'Đại trận tụ linh tối cao cửu cửu quy nhất, dẫn động cửu thiên linh mạch thượng giới, tương thích hoàn toàn để Trùng Chú Bất Hủ.',
    lore: 'Chín tầng trời mở ra, vạn cổ duy nhất thần trận kết tinh thiên địa quy tắc bất diệt.',
    requiredArtisanLevel: 9,
    linhThachCost: 1000000,
    baseSuccessRate: 25,
    baseExpGain: 2500,
    requiredMaterials: [
      { itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', quantity: 10, itemCategory: 'ore' },
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 20, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 300,
      defBonus: 300,
      hpBonus: 10000,
      critRateBonus: 25,
      critDmgBonus: 75,
      dmgReductionBonus: 40,
      trapNullifyChance: 90,
      triggerEffectDescription: '🌌 Cửu Cực Thần Quang: Tăng toàn diện chỉ số thần cấp, 90% vô hiệu bẫy bí cảnh và quy nạp linh khí thiên địa.',
    },
  },
  {
    id: 'recipe_thai_so_hon_don_tran',
    name: 'Thái Sơ Hỗn Độn Thần Trận',
    type: 'battle',
    tier: 9,
    grade: 'Cửu Giai • Thái Sơ Thần Giai',
    element: 'hon_don',
    description: 'Trận pháp thời Thái Sơ khai thiên lập địa, giải phóng uy áp đại đạo trấn áp chư thiên.',
    lore: 'Thái sơ hữu đạo, sinh vu hỗn mang. Một khi kích hoạt, vạn pháp quy nguyên.',
    requiredArtisanLevel: 9,
    linhThachCost: 2000000,
    baseSuccessRate: 20,
    baseExpGain: 3500,
    requiredMaterials: [
      { itemId: 'hon_don_than_thiet', name: 'Hỗn Độn Thần Thiết', quantity: 15, itemCategory: 'ore' },
      { itemId: 'ore_thai_at_than_kim', name: 'Thái Ất Thần Kim', quantity: 25, itemCategory: 'ore' },
    ],
    combatBuff: {
      atkBonus: 500,
      defBonus: 400,
      hpBonus: 15000,
      critRateBonus: 30,
      critDmgBonus: 100,
      speedBonus: 100,
      turnTriggerInterval: 2,
      triggerDamagePercent: 500,
      triggerEffectDescription: '⚡ Thái Sơ Khai Thiên Quyết: Mỗi 2 hiệp bộc phát hỗn độn kiếm khí hủy diệt gây 500% ATK bỏ qua toàn bộ phòng ngự!',
    },
  },
];

// Lấy rank theo level
export const getFormationRankInfo = (level: number) =>
  FORMATION_ARTISAN_RANKS.find(r => r.level === level) || FORMATION_ARTISAN_RANKS[0];

// Lấy recipe theo id
export const getFormationRecipeById = (id: string): FormationRecipe | undefined =>
  FORMATION_RECIPES.find(r => r.id === id);

// Lọc recipe theo tier người chơi có thể dùng
export const getAvailableFormationRecipes = (artisanLevel: number): FormationRecipe[] =>
  FORMATION_RECIPES.filter(r => r.requiredArtisanLevel <= artisanLevel);

// Map element sang màu hiển thị
export const FORMATION_ELEMENT_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  kim:     { label: 'Kim',      color: 'text-yellow-300',  bg: 'bg-yellow-950/50 border-yellow-700/40', icon: '⚔️' },
  moc:     { label: 'Mộc',     color: 'text-green-400',   bg: 'bg-green-950/50 border-green-700/40',   icon: '🌿' },
  thuy:    { label: 'Thủy',    color: 'text-blue-400',    bg: 'bg-blue-950/50 border-blue-700/40',     icon: '💧' },
  hoa:     { label: 'Hỏa',     color: 'text-red-400',     bg: 'bg-red-950/50 border-red-700/40',       icon: '🔥' },
  tho:     { label: 'Thổ',     color: 'text-amber-400',   bg: 'bg-amber-950/50 border-amber-700/40',   icon: '🌍' },
  loi:     { label: 'Lôi',     color: 'text-purple-400',  bg: 'bg-purple-950/50 border-purple-700/40', icon: '⚡' },
  phong:   { label: 'Phong',   color: 'text-cyan-400',    bg: 'bg-cyan-950/50 border-cyan-700/40',     icon: '🌀' },
  hon_don: { label: 'Hỗn Độn', color: 'text-zinc-300',    bg: 'bg-zinc-800/60 border-zinc-600/40',     icon: '☯️' },
};

// Map type
export const FORMATION_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  battle:      { label: 'Chiến Trận', color: 'text-rose-400',    icon: '⚔️' },
  tribulation: { label: 'Hộ Pháp',   color: 'text-indigo-400',  icon: '🛡️' },
  utility:     { label: 'Tiện Ích',   color: 'text-emerald-400', icon: '🔓' },
};
