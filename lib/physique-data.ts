// lib/physique-data.ts
// Dữ liệu Thể Chất Tiên Thiên (Physique) & Cơ Chế Tôi Thể (Body Refinement) & Gacha Đa Thể Chất

import { Physique, PhysiqueGrade, RefinementStage } from '@/lib/types';

export const PHYSIQUE_GRADES_ORDER: PhysiqueGrade[] = [
  'Phàm Phẩm',
  'Linh Phẩm',
  'Vương Phẩm',
  'Hoàng Phẩm',
  'Thần Phẩm',
  'Chí Tôn'
];

export const REFINEMENT_STAGES_ORDER: RefinementStage[] = [
  'Đoạn Cốt',
  'Luyện Tạng',
  'Hoán Huyết',
  'Kim Thân'
];

export interface PhysiqueTemplateItem extends Omit<Physique, 'refinementStage' | 'refinementLevel' | 'refinementExp' | 'maxRefinementExp'> {}

export const PHYSIQUE_TEMPLATES: Record<string, PhysiqueTemplateItem> = {
  // ==========================================
  // 1. Phàm Phẩm (~70%)
  // ==========================================
  pham_thai_huyet_mach: {
    id: 'pham_thai_huyet_mach',
    name: 'Phàm Thai Huyết Mạch',
    grade: 'Phàm Phẩm',
    description: 'Thân xác phàm trần chưa qua rèn giũa, chứa nhiều tạp chất nhưng tiềm năng vô hạn.',
    specialEffect: 'Thể chất cơ bản của nhân tộc. Có thể dùng Tôi Thể để lột xác hoán cốt.',
    hpBonusPercent: 0,
    defenseBonusPercent: 0,
    damageBonusPercent: 0,
    breakthroughTuViMultiplier: 1.0,
    badgeClass: 'text-zinc-400 border-zinc-700 bg-zinc-900/60'
  },
  bi_tho_nhuc_hau: {
    id: 'bi_tho_nhuc_hau',
    name: 'Bì Thô Nhục Hậu Thể',
    grade: 'Phàm Phẩm',
    description: 'Thân hình vạm vỡ, da thịt dày dặn bẩm sinh, chịu đòn tốt hơn phàm nhân bình thường.',
    specialEffect: 'Tăng 15% Khí Huyết, 10% phòng ngự, 5% công kích.',
    hpBonusPercent: 15,
    defenseBonusPercent: 10,
    damageBonusPercent: 5,
    breakthroughTuViMultiplier: 1.0,
    badgeClass: 'text-stone-300 border-stone-600 bg-stone-900/60'
  },
  bach_benh_bat_xam: {
    id: 'bach_benh_bat_xam',
    name: 'Bách Bệnh Bất Xâm Thể',
    grade: 'Phàm Phẩm',
    description: 'Khí huyết thuần dương nhẹ, bách bệnh phàm trần không thể xâm nhập, tâm thần vững vàng.',
    specialEffect: 'Tăng 10% Khí Huyết, 15% phòng ngự, kháng tâm ma +10%.',
    hpBonusPercent: 10,
    defenseBonusPercent: 15,
    damageBonusPercent: 0,
    breakthroughTuViMultiplier: 1.0,
    khangTamMaPercent: 10,
    badgeClass: 'text-emerald-400/80 border-emerald-800 bg-emerald-950/40'
  },

  // ==========================================
  // 2. Linh Phẩm (~18%)
  // ==========================================
  cuu_khieu_linh_the: {
    id: 'cuu_khieu_linh_the',
    name: 'Cửu Khiếu Linh Thể',
    grade: 'Linh Phẩm',
    description: 'Cửu khiếu trời sinh thông suốt, dẫn động thiên địa linh khí nhanh chóng, kinh mạch dẻo dai.',
    specialEffect: 'Tăng 25% Khí Huyết, 10% công kích, +15% tốc độ tu luyện.',
    hpBonusPercent: 25,
    defenseBonusPercent: 5,
    damageBonusPercent: 10,
    breakthroughTuViMultiplier: 0.95,
    cultivationSpeedBonusPercent: 15,
    badgeClass: 'text-sky-300 border-sky-600/60 bg-sky-950/50'
  },
  thanh_moc_duoc_the: {
    id: 'thanh_moc_duoc_the',
    name: 'Thanh Mộc Dược Thể',
    grade: 'Linh Phẩm',
    description: 'Cơ thể ẩn chứa mộc linh sinh cơ nồng đậm, vết thương mau lành, tự dưỡng chân nguyên.',
    specialEffect: 'Tăng 35% Khí Huyết, 15% phòng ngự, tự hồi 5% Chân Nguyên mỗi lượt.',
    hpBonusPercent: 35,
    defenseBonusPercent: 15,
    damageBonusPercent: 5,
    breakthroughTuViMultiplier: 1.0,
    mpRegenPercent: 5,
    badgeClass: 'text-teal-300 border-teal-600/60 bg-teal-950/50'
  },
  nham_bang_the: {
    id: 'nham_bang_the',
    name: 'Nham Băng Thể',
    grade: 'Linh Phẩm',
    description: 'Cốt cách cứng cáp như hàn băng nghìn năm trên vách đá dựng đứng, giảm thiểu tổn thương.',
    specialEffect: 'Tăng 20% Khí Huyết, 25% phòng ngự, +5% né đòn.',
    hpBonusPercent: 20,
    defenseBonusPercent: 25,
    damageBonusPercent: 5,
    breakthroughTuViMultiplier: 1.0,
    dodgeBonusPercent: 5,
    badgeClass: 'text-cyan-300 border-cyan-600/60 bg-cyan-950/50'
  },
  loi_cuong_the: {
    id: 'loi_cuong_the',
    name: 'Lôi Cương Thể',
    grade: 'Linh Phẩm',
    description: 'Ẩn chứa lôi cương khí trong từng thớ thịt, đòn đánh sắc bén cuồng bạo.',
    specialEffect: 'Tăng 15% Khí Huyết, 20% sát thương, +10% tỉ lệ bạo kích.',
    hpBonusPercent: 15,
    defenseBonusPercent: 10,
    damageBonusPercent: 20,
    breakthroughTuViMultiplier: 1.0,
    critRateBonusPercent: 10,
    badgeClass: 'text-indigo-300 border-indigo-600/60 bg-indigo-950/50'
  },

  // ==========================================
  // 3. Vương Phẩm (~8%)
  // ==========================================
  van_doc_bat_xam_vuong_the: {
    id: 'van_doc_bat_xam_vuong_the',
    name: 'Vạn Độc Bất Xâm Vương Thể',
    grade: 'Vương Phẩm',
    description: 'Vương thể thượng thừa miễn dịch vạn độc thế gian, huyết dịch tinh thuần bài xích u uế.',
    specialEffect: 'Tăng 50% Khí Huyết, 25% phòng ngự, kháng tâm ma +30%, miễn nhiễm trúng độc.',
    hpBonusPercent: 50,
    defenseBonusPercent: 25,
    damageBonusPercent: 15,
    breakthroughTuViMultiplier: 1.0,
    khangTamMaPercent: 30,
    badgeClass: 'text-violet-300 border-violet-500/60 bg-violet-950/50 font-semibold'
  },
  du_long_the: {
    id: 'du_long_the',
    name: 'Du Long Thể',
    grade: 'Vương Phẩm',
    description: 'Thân pháp ảo diệu như rồng lượn chín tầng mây, xuất quỷ nhập thần, khó nắm bắt.',
    specialEffect: 'Tăng 45% Khí Huyết, 25% công kích, +20% né đòn và tốc độ.',
    hpBonusPercent: 45,
    defenseBonusPercent: 15,
    damageBonusPercent: 25,
    breakthroughTuViMultiplier: 1.0,
    dodgeBonusPercent: 20,
    badgeClass: 'text-blue-300 border-blue-500/60 bg-blue-950/50 font-semibold'
  },
  xich_viem_cuong_the: {
    id: 'xich_viem_cuong_the',
    name: 'Xích Viêm Cuồng Thể',
    grade: 'Vương Phẩm',
    description: 'Huyết mạch hỏa diễm cuộn trào sôi sục, bộc phát sức mạnh hủy diệt trong giao tranh.',
    specialEffect: 'Tăng 40% Khí Huyết, 35% công kích, +30% sát thương bạo kích.',
    hpBonusPercent: 40,
    defenseBonusPercent: 15,
    damageBonusPercent: 35,
    breakthroughTuViMultiplier: 1.0,
    critDamageBonus: 30,
    badgeClass: 'text-orange-300 border-orange-500/60 bg-orange-950/50 font-semibold'
  },
  thai_hu_khi_the: {
    id: 'thai_hu_khi_the',
    name: 'Thái Hư Khí Thể',
    grade: 'Vương Phẩm',
    description: 'Thân hợp với thái hư huyền khí vô hình, thổ nạp chu thiên linh khí vô cùng mượt mà.',
    specialEffect: 'Tăng 40% Khí Huyết, 20% phòng ngự, +25% tốc độ tu luyện, tự hồi 10% MP mỗi lượt.',
    hpBonusPercent: 40,
    defenseBonusPercent: 20,
    damageBonusPercent: 15,
    breakthroughTuViMultiplier: 0.9,
    cultivationSpeedBonusPercent: 25,
    mpRegenPercent: 10,
    badgeClass: 'text-purple-300 border-purple-500/60 bg-purple-950/50 font-semibold'
  },

  // ==========================================
  // 4. Hoàng Phẩm (~3%)
  // ==========================================
  vo_cuc_kiem_the: {
    id: 'vo_cuc_kiem_the',
    name: 'Vô Cực Kiếm Thể',
    grade: 'Hoàng Phẩm',
    description: 'Trời sinh kiếm cốt, vạn kiếm quy tông. Nhục thân sắc bén như tiên kiếm xuất vỏ.',
    specialEffect: 'Tăng 60% Khí Huyết, 50% công kích, +25% bạo kích, +40% sát thương bạo.',
    hpBonusPercent: 60,
    defenseBonusPercent: 20,
    damageBonusPercent: 50,
    breakthroughTuViMultiplier: 1.0,
    critRateBonusPercent: 25,
    critDamageBonus: 40,
    badgeClass: 'text-amber-300 border-amber-500/60 bg-amber-950/50 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
  },
  cuu_u_minh_the: {
    id: 'cuu_u_minh_the',
    name: 'Cửu U Minh Thể',
    grade: 'Hoàng Phẩm',
    description: 'Thể chất u minh u tối từ cửu u hoàng tuyền, công kích mang theo khí tức ăn mòn xương tủy.',
    specialEffect: 'Tăng 75% Khí Huyết, 45% công kích, ăn mòn 30% phòng ngự Boss.',
    hpBonusPercent: 75,
    defenseBonusPercent: 25,
    damageBonusPercent: 45,
    breakthroughTuViMultiplier: 1.0,
    poisonArmorPen: 30,
    badgeClass: 'text-purple-400 border-purple-500/60 bg-purple-950/60 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
  },
  chan_long_phuong_huyet: {
    id: 'chan_long_phuong_huyet',
    name: 'Chân Long Phượng Huyết Thể',
    grade: 'Hoàng Phẩm',
    description: 'Dung hợp huyết mạch Chân Long và Phượng Hoàng, nhục thân kim cương, sinh mệnh bền bỉ.',
    specialEffect: 'Tăng 100% Khí Huyết, 35% phòng ngự, 35% công kích, giảm 30% sát thương bạo kích nhận vào.',
    hpBonusPercent: 100,
    defenseBonusPercent: 35,
    damageBonusPercent: 35,
    breakthroughTuViMultiplier: 1.0,
    badgeClass: 'text-red-300 border-red-500/60 bg-red-950/60 font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]'
  },

  // ==========================================
  // 5. Thần Phẩm (~0.8%)
  // ==========================================
  tien_thien_dao_the: {
    id: 'tien_thien_dao_the',
    name: 'Tiên Thiên Đạo Thể',
    grade: 'Thần Phẩm',
    description: 'Trời sinh hòa hợp với đại đạo quy tắc, đạo vận lưu chuyển quanh thân, linh lực vĩnh viễn không cạn kiệt.',
    specialEffect: 'Tăng 110% Khí Huyết, 50% công kích, 35% phòng ngự, giảm 20% tu vi đột phá, tự hồi 15% MP mỗi hiệp, +35% tốc độ tu luyện.',
    hpBonusPercent: 110,
    defenseBonusPercent: 35,
    damageBonusPercent: 50,
    breakthroughTuViMultiplier: 0.8,
    mpRegenPercent: 15,
    cultivationSpeedBonusPercent: 35,
    badgeClass: 'text-yellow-300 border-yellow-400/80 bg-yellow-950/60 font-bold shadow-[0_0_15px_rgba(250,204,21,0.4)] animate-pulse'
  },
  thuan_duong_vo_cuc: {
    id: 'thuan_duong_vo_cuc',
    name: 'Thuần Dương Vô Cực Thể',
    grade: 'Thần Phẩm',
    description: 'Cực dương chí tôn, vạn tà bất xâm. Toàn thân phát ra dương cương khí áp chế mọi ma chướng.',
    specialEffect: 'Tăng 120% Khí Huyết, 45% công kích, 45% phòng ngự, giảm 50% tỉ lệ gặp Tâm Ma, kháng tâm ma +60%.',
    hpBonusPercent: 120,
    defenseBonusPercent: 45,
    damageBonusPercent: 45,
    breakthroughTuViMultiplier: 1.0,
    tamMaChanceMultiplier: 0.5,
    khangTamMaPercent: 60,
    badgeClass: 'text-amber-300 border-amber-400/80 bg-amber-950/60 font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
  },
  bat_diet_kim_than: {
    id: 'bat_diet_kim_than',
    name: 'Bất Diệt Kim Thân',
    grade: 'Thần Phẩm',
    description: 'Nhục thân đúc bằng huyền hoàng chi khí, kim cương bất hoại, đao thương bất nhập, vạn kiếp không suy.',
    specialEffect: 'Tăng 140% Khí Huyết, 60% phòng ngự, 35% công kích, kiên cố vô song.',
    hpBonusPercent: 140,
    defenseBonusPercent: 60,
    damageBonusPercent: 35,
    breakthroughTuViMultiplier: 1.0,
    badgeClass: 'text-yellow-200 border-yellow-500/80 bg-yellow-950/70 font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)]'
  },

  // ==========================================
  // 6. Chí Tôn / Thánh Thể Cổ Đại (~0.2%)
  // ==========================================
  hoang_co_thanh_the: {
    id: 'hoang_co_thanh_the',
    name: 'Hoang Cổ Thánh Thể',
    grade: 'Chí Tôn',
    description: 'Đệ nhất thể chất cận chiến thời thượng cổ. Khí huyết ngút trời, nhục thân sánh ngang thánh binh chấn nhiếp bát hoang.',
    specialEffect: 'Tăng cực lớn +160% Khí Huyết, +60% phòng ngự, +60% sát thương, nhưng thiên địa ghen ghét cần +20% tu vi đột phá.',
    hpBonusPercent: 160,
    defenseBonusPercent: 60,
    damageBonusPercent: 60,
    breakthroughTuViMultiplier: 1.2,
    badgeClass: 'text-rose-300 border-rose-500/90 bg-rose-950/80 font-bold shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
  },
  hon_don_the: {
    id: 'hon_don_the',
    name: 'Hỗn Độn Thể',
    grade: 'Chí Tôn',
    description: 'Chí tôn vạn cổ, diễn hóa vạn vật thiên địa. Dung hợp vạn pháp, áp chế chư thiên vạn giới.',
    specialEffect: 'Tăng cực hạn +180% Khí Huyết, +65% công kích, +60% phòng ngự, +50% bạo thương, +20% tỉ lệ bạo kích.',
    hpBonusPercent: 180,
    defenseBonusPercent: 60,
    damageBonusPercent: 65,
    breakthroughTuViMultiplier: 1.0,
    critDamageBonus: 50,
    critRateBonusPercent: 20,
    badgeClass: 'text-fuchsia-300 border-fuchsia-500/90 bg-fuchsia-950/80 font-bold shadow-[0_0_20px_rgba(217,70,239,0.6)] animate-pulse'
  },
  van_co_bat_hu_the: {
    id: 'van_co_bat_hu_the',
    name: 'Vạn Cổ Bất Hủ Thể',
    grade: 'Chí Tôn',
    description: 'Thánh thể bất hủ vĩnh hằng cùng nhật nguyệt, luân hồi bất diệt, thọ dữ thiên tề, chúa tể vạn giới.',
    specialEffect: 'Tăng cực đại +200% Khí Huyết, +70% phòng ngự, +70% công kích, +50% tốc độ tu luyện, tự hồi 20% MP mỗi hiệp.',
    hpBonusPercent: 200,
    defenseBonusPercent: 70,
    damageBonusPercent: 70,
    breakthroughTuViMultiplier: 0.85,
    cultivationSpeedBonusPercent: 50,
    mpRegenPercent: 20,
    badgeClass: 'text-amber-200 border-amber-300 bg-gradient-to-r from-amber-950/90 via-purple-950/90 to-rose-950/90 font-extrabold shadow-[0_0_25px_rgba(251,191,36,0.7)] animate-pulse'
  },

  // Giữ lại key cũ để tương thích ngược tuyệt đối với save cũ
  pham_thai: {
    id: 'pham_thai',
    name: 'Phàm Thai Huyết Mạch',
    grade: 'Phàm Phẩm',
    description: 'Thân xác phàm trần chưa qua rèn giũa, chứa nhiều tạp chất nhưng tiềm năng vô hạn.',
    specialEffect: 'Thể chất cơ bản của nhân tộc. Có thể dùng Tôi Thể để lột xác hoán cốt.',
    hpBonusPercent: 0,
    defenseBonusPercent: 0,
    damageBonusPercent: 0,
    breakthroughTuViMultiplier: 1.0,
    badgeClass: 'text-zinc-400 border-zinc-700 bg-zinc-900/60'
  }
};

/**
 * Phân chia templates theo từng bậc phẩm cấp để gacha
 */
export const PHYSIQUES_BY_GRADE: Record<PhysiqueGrade, PhysiqueTemplateItem[]> = {
  'Phàm Phẩm': [
    PHYSIQUE_TEMPLATES.pham_thai_huyet_mach,
    PHYSIQUE_TEMPLATES.bi_tho_nhuc_hau,
    PHYSIQUE_TEMPLATES.bach_benh_bat_xam
  ],
  'Linh Phẩm': [
    PHYSIQUE_TEMPLATES.cuu_khieu_linh_the,
    PHYSIQUE_TEMPLATES.thanh_moc_duoc_the,
    PHYSIQUE_TEMPLATES.nham_bang_the,
    PHYSIQUE_TEMPLATES.loi_cuong_the
  ],
  'Vương Phẩm': [
    PHYSIQUE_TEMPLATES.van_doc_bat_xam_vuong_the,
    PHYSIQUE_TEMPLATES.du_long_the,
    PHYSIQUE_TEMPLATES.xich_viem_cuong_the,
    PHYSIQUE_TEMPLATES.thai_hu_khi_the
  ],
  'Hoàng Phẩm': [
    PHYSIQUE_TEMPLATES.vo_cuc_kiem_the,
    PHYSIQUE_TEMPLATES.cuu_u_minh_the,
    PHYSIQUE_TEMPLATES.chan_long_phuong_huyet
  ],
  'Thần Phẩm': [
    PHYSIQUE_TEMPLATES.tien_thien_dao_the,
    PHYSIQUE_TEMPLATES.thuan_duong_vo_cuc,
    PHYSIQUE_TEMPLATES.bat_diet_kim_than
  ],
  'Chí Tôn': [
    PHYSIQUE_TEMPLATES.hoang_co_thanh_the,
    PHYSIQUE_TEMPLATES.hon_don_the,
    PHYSIQUE_TEMPLATES.van_co_bat_hu_the
  ],
  // Tương thích alias cũ
  'Phàm Thai': [PHYSIQUE_TEMPLATES.pham_thai_huyet_mach],
  'Linh Thể': [PHYSIQUE_TEMPLATES.cuu_khieu_linh_the],
  'Vương Thể': [PHYSIQUE_TEMPLATES.van_doc_bat_xam_vuong_the],
  'Hoàng Thể': [PHYSIQUE_TEMPLATES.vo_cuc_kiem_the],
  'Thần Thể': [PHYSIQUE_TEMPLATES.tien_thien_dao_the],
  'Thánh Thể Thượng Cổ': [PHYSIQUE_TEMPLATES.hoang_co_thanh_the]
};

/**
 * Khởi tạo thể chất mặc định cho người chơi
 */
export function createDefaultPhysique(): Physique {
  return {
    ...PHYSIQUE_TEMPLATES.pham_thai_huyet_mach,
    refinementStage: 'Đoạn Cốt',
    refinementLevel: 1,
    refinementExp: 0,
    maxRefinementExp: 100
  };
}

/**
 * Trọng số quay thể chất theo bậc phẩm cấp:
 * Phàm Phẩm: 70% (700)
 * Linh Phẩm: 18% (180)
 * Vương Phẩm: 8% (80)
 * Hoàng Phẩm: 3% (30)
 * Thần Phẩm: 0.8% (8)
 * Chí Tôn: 0.2% (2)
 */
const GRADE_WEIGHTS: { grade: PhysiqueGrade; weight: number }[] = [
  { grade: 'Phàm Phẩm', weight: 700 },
  { grade: 'Linh Phẩm', weight: 180 },
  { grade: 'Vương Phẩm', weight: 80 },
  { grade: 'Hoàng Phẩm', weight: 30 },
  { grade: 'Thần Phẩm', weight: 8 },
  { grade: 'Chí Tôn', weight: 2 }
];

export function rollSinglePhysiqueTemplate(excludeIds: string[] = []): PhysiqueTemplateItem {
  // 1. Roll phẩm cấp
  const totalWeight = GRADE_WEIGHTS.reduce((acc, curr) => acc + curr.weight, 0);
  let roll = Math.random() * totalWeight;
  let selectedGrade: PhysiqueGrade = 'Phàm Phẩm';

  for (const item of GRADE_WEIGHTS) {
    if (roll < item.weight) {
      selectedGrade = item.grade;
      break;
    }
    roll -= item.weight;
  }

  // 2. Lấy danh sách thể chất thuộc phẩm cấp đó mà chưa bị loại trừ
  let pool = (PHYSIQUES_BY_GRADE[selectedGrade] || []).filter(p => !excludeIds.includes(p.id));
  if (pool.length === 0) {
    // Nếu phẩm cấp đó đã hết mẫu thì fallback sang toàn bộ pool chưa bị loại trừ
    const all = Object.values(PHYSIQUE_TEMPLATES).filter(p => !excludeIds.includes(p.id) && p.id !== 'pham_thai');
    pool = all.length > 0 ? all : [PHYSIQUE_TEMPLATES.pham_thai_huyet_mach];
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  return picked || PHYSIQUE_TEMPLATES.pham_thai_huyet_mach;
}

/**
 * Roll danh sách Thể Chất khi Tẩy Tủy / Tạo nhân vật mới:
 * 1 Thể chất: 97% cơ bản.
 * 2 Thể chất (Song Thể Tề Tụ): 2.7% (cực hiếm).
 * 3 Thể chất (Tam Thể Quy Nhất): 0.3% (đại cơ duyên nghịch thiên).
 */
export function rollRandomPhysiques(): Physique[] {
  const rand = Math.random() * 100;
  let count = 1;
  if (rand < 0.3) {
    count = 3; // Tam Thể Quy Nhất
  } else if (rand < 3.0) {
    count = 2; // Song Thể Tề Tụ
  } else {
    count = 1; // Đơn thể
  }

  const results: Physique[] = [];
  const pickedIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const template = rollSinglePhysiqueTemplate(pickedIds);
    pickedIds.push(template.id);
    results.push({
      ...template,
      refinementStage: 'Đoạn Cốt',
      refinementLevel: 1,
      refinementExp: 0,
      maxRefinementExp: 100
    });
  }

  return results;
}

/**
 * Tính chi phí Tôi Thể dựa theo tầng và cấp
 */
export function getRefinementCost(stage: RefinementStage, level: number): {
  linhThachCost: number;
  khiHuyetDanCost: number;
  tinhHuyetCost: number;
} {
  const stageMultiplier =
    stage === 'Đoạn Cốt' ? 1 :
    stage === 'Luyện Tạng' ? 2.5 :
    stage === 'Hoán Huyết' ? 6 : 15;

  return {
    linhThachCost: Math.floor(150 * stageMultiplier * (1 + level * 0.2)),
    khiHuyetDanCost: Math.max(1, Math.floor(stageMultiplier * 0.8 + level * 0.15)),
    tinhHuyetCost: Math.max(1, Math.floor(stageMultiplier * 0.6 + level * 0.1))
  };
}

/**
 * Tính bonus sức mạnh từ tầng Tôi Thể
 */
export function getRefinementStatsBonus(stage: RefinementStage, level: number): {
  hpBonus: number;
  powerBonus: number;
  defenseBonus: number;
} {
  const stageBase =
    stage === 'Đoạn Cốt' ? 100 :
    stage === 'Luyện Tạng' ? 350 :
    stage === 'Hoán Huyết' ? 1000 : 3000;

  const hpBonus = stageBase * 8 + (level * stageBase * 1.5);
  const powerBonus = Math.floor(stageBase * 4 + (level * stageBase * 0.8));
  const defenseBonus = Math.floor(stageBase * 2 + (level * stageBase * 0.5));

  return { hpBonus, powerBonus, defenseBonus };
}
