// lib/divine-abilities-data.ts
// Danh mục chi tiết 36 Pho Thần Thông Bí Thuật Cửu Giai (Tier 1 -> Tier 9) trong Vạn Bảo Thương Hội

import { DivineAbilityShopItem, DivineCategory, DivineTier } from './types/divine-abilities';
import { MerchantItem } from './types/items';

export const DIVINE_ABILITIES_SHOP_CATALOG: DivineAbilityShopItem[] = [
  // ==========================================
  // NHẤT GIAI (Luyện Khí Kỳ - Realm 0–10)
  // ==========================================
  {
    id: 'div_t1_dmg',
    name: 'Bạch Viêm Hỏa Cầu',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 200,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-amber-700/60 text-amber-300 bg-amber-950/40',
    cooldownTurns: 3,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 1.8
    },
    description: 'Nén linh hỏa đan điền thành hỏa cầu rực sáng, gây 180% sát thương Công Kích. Hồi chiêu: 3 hiệp.',
    flavorText: 'Bạch diễm thuần dương, ngưng khí hóa diễm thiêu rụi tà ma sơ cảnh.'
  },
  {
    id: 'div_t1_def',
    name: 'Ngưng Thủy Hộ Thuẫn',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 200,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-blue-700/60 text-blue-300 bg-blue-950/40',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      shieldPercentOfMaxHp: 15,
      durationTurns: 2
    },
    description: 'Hóa thủy linh thành màn chắn nước bảo vệ quanh thân, hấp thụ sát thương bằng 15% Max HP. Hồi chiêu: 4 hiệp.',
    flavorText: 'Thượng thiện nhược thủy, nhu khắc cương, hóa giải kình phong.'
  },
  {
    id: 'div_t1_ctrl',
    name: 'Lạc Thạch Định Thân',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 250,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-amber-800/60 text-amber-200 bg-amber-950/40',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 1.2,
      stunTarget: true
    },
    description: 'Triệu hoán cự thạch từ trời cao giáng xuống gây 120% sát thương và làm choáng đối thủ 1 hiệp. Hồi chiêu: 4 hiệp.',
    flavorText: 'Thổ tức ngưng tụ, đá nặng nghìn cân áp chế thần hồn đối phương.'
  },
  {
    id: 'div_t1_domain',
    name: 'Ngự Phong Tật Hành',
    tier: 1,
    tierName: 'Nhất Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 250,
    requiredRealmIndex: 1,
    requiredRealmName: 'Luyện Khí Kỳ',
    badgeColor: 'border-emerald-700/60 text-emerald-300 bg-emerald-950/40',
    cooldownTurns: 5,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffSpeedPercent: 20,
      buffDodgePercent: 10,
      durationTurns: 2
    },
    description: 'Dẫn phong linh khí bọc thân, tăng 20% Thân Pháp và 10% Né Tránh trong 2 hiệp đầu trận chiến.',
    flavorText: 'Thân tựa tàn phong phiêu hốt, bộ vũ vô ảnh đoạt tiên cơ.'
  },

  // ==========================================
  // NHỊ GIAI (Trúc Cơ Kỳ - Realm 11–15)
  // ==========================================
  {
    id: 'div_t2_dmg',
    name: 'Thanh Mộc Kiếm Khí',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 2500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-emerald-700/60 text-emerald-300 bg-emerald-950/40',
    cooldownTurns: 3,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 2.3
    },
    description: 'Dẫn mộc linh hóa 3 đạo kiếm khí sắc bén, gây 230% sát thương bạo liệt. Hồi chiêu: 3 hiệp.',
    flavorText: 'Thanh mộc sinh cơ, hóa kiếm trảm tà, kiếm ý bất tức sinh sinh.'
  },
  {
    id: 'div_t2_def',
    name: 'Kim Cang Thuẫn Khí',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 2500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-yellow-700/60 text-yellow-300 bg-yellow-950/40',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      reflectPercent: 15,
      shieldPercentOfMaxHp: 20,
      durationTurns: 2
    },
    description: 'Ngưng tụ kim cương hộ thể chân khí, tạo khiên 20% Max HP và phản chấn 15% sát thương nhận vào trong 2 hiệp. Hồi chiêu: 4 hiệp.',
    flavorText: 'Kim cương bất phôi, cương nhu tịnh tế, chấn thương kẻ địch phản phệ.'
  },
  {
    id: 'div_t2_ctrl',
    name: 'Hàn Băng Tỏa Liên',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 3000,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-cyan-700/60 text-cyan-300 bg-cyan-950/40',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      debuffAtkPercent: 15,
      durationTurns: 2
    },
    description: 'Triệu hoán xích băng trói buộc đối thủ, giảm 15% Công Kích và làm chậm tốc độ địch trong 2 hiệp. Hồi chiêu: 4 hiệp.',
    flavorText: 'Cửu u hàn khí đông kết kinh mạch, khóa chặt linh lực nghịch chuyển.'
  },
  {
    id: 'div_t2_domain',
    name: 'Xích Diễm Khí Tràng',
    tier: 2,
    tierName: 'Nhị Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 3500,
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    badgeColor: 'border-red-700/60 text-red-300 bg-red-950/40',
    cooldownTurns: 5,
    triggerCondition: 'combat_start',
    combatEffects: {
      trueDamageFlat: 350,
      buffAtkPercent: 10,
      durationTurns: 3
    },
    description: 'Khai mở hỏa tràng xích diễm thiêu đốt, tăng 10% Công Kích và gây thêm sát thương lửa mỗi hiệp trong 3 hiệp.',
    flavorText: 'Xích diễm ngút trời biến chiến trường thành lò luyện chân hỏa.'
  },

  // ==========================================
  // TAM GIAI (Kim Đan Kỳ - Realm 16–20)
  // ==========================================
  {
    id: 'div_t3_dmg',
    name: 'Tam Muội Chân Hỏa',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 20000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-amber-600/70 text-amber-200 bg-amber-950/50',
    cooldownTurns: 3,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 3.0,
      trueDamageFlat: 1200
    },
    description: 'Phun chân hỏa đan điền tam muội, gây 300% sát thương bạo kích kèm 1,200 sát thương chuẩn thiêu đốt. Hồi chiêu: 3 hiệp.',
    flavorText: 'Tâm hỏa, Thận hỏa, Khí hỏa tam hợp nhất thể, thiêu sạch phàm trần.'
  },
  {
    id: 'div_t3_def',
    name: 'Tử Phủ Kim Thân',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 20000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-purple-600/70 text-purple-200 bg-purple-950/50',
    cooldownTurns: 6,
    triggerCondition: 'hp_below_30',
    combatEffects: {
      healPercentOfMaxHp: 25,
      durationTurns: 2
    },
    description: 'Bảo mệnh thần thông kích hoạt khi Khí Huyết tụt dưới 30%: Hồi phục ngay 25% Max HP và ngưng tụ Tử Phủ hộ mạch.',
    flavorText: 'Tử khí đông lai, kim đan chuyển động bảo vệ chân linh bất diệt.'
  },
  {
    id: 'div_t3_ctrl',
    name: 'Thần Niệm Chấn Nhiếp',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 25000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-indigo-600/70 text-indigo-200 bg-indigo-950/50',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      stunTarget: true
    },
    description: 'Phóng thần niệm chấn động hồn phách, chắc chắn làm choáng đối thủ 1 hiệp, phá vỡ nhịp độ xuất chiêu. Hồi chiêu: 5 hiệp.',
    flavorText: 'Thần thức hóa chùy giáng thẳng biển ý thức khiến địch tê liệt tâm can.'
  },
  {
    id: 'div_t3_domain',
    name: 'Thái Cực Kiếm Đồ',
    tier: 3,
    tierName: 'Tam Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 30000,
    requiredRealmIndex: 16,
    requiredRealmName: 'Kim Đan Kỳ',
    badgeColor: 'border-teal-600/70 text-teal-200 bg-teal-950/50',
    cooldownTurns: 5,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffAtkPercent: 15,
      healPercentOfMaxHp: 5,
      durationTurns: 3
    },
    description: 'Mở Kiếm Đồ bảo vệ, tăng 15% Công Kích và hồi 5% Max HP mỗi hiệp trong 3 hiệp liên tiếp.',
    flavorText: 'Âm dương lưu chuyển hóa thành kiếm trận hộ đạo, sinh sôi bất tận.'
  },

  // ==========================================
  // TỨ GIAI (Nguyên Anh Kỳ - Realm 21–25)
  // ==========================================
  {
    id: 'div_t4_dmg',
    name: 'Chích Thủ Già Thiên',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 140000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-violet-600/70 text-violet-200 bg-violet-950/50',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 3.8,
      trueDamageFlat: 6500
    },
    description: 'Bàn tay khổng lồ áp đỉnh vạn trượng, gây 380% sát thương bỏ qua 30% giáp hộ thể và gây 6,500 sát thương chuẩn. Hồi chiêu: 4 hiệp.',
    flavorText: 'Nhất thủ già thiên, vạn trượng chưởng ấn đè bẹp sơn hà nhật nguyệt.'
  },
  {
    id: 'div_t4_def',
    name: 'Nguyên Anh Thế Mạng',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 160000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-fuchsia-600/70 text-fuchsia-200 bg-fuchsia-950/50',
    cooldownTurns: 99,
    triggerCondition: 'hp_below_30',
    combatEffects: {
      deathWardReviveHpPercent: 15,
      buffDodgePercent: 50,
      durationTurns: 1
    },
    description: 'Bù nhìn Nguyên Anh thế mạng: khi nhận sát thương chí tử giữ lại mạng sống, hồi phục 15% HP và tăng 50% Né Tránh trong 1 hiệp (1 lần/trận).',
    flavorText: 'Nguyên anh xuất khiếu thế thân diệt mệnh, nhục thân trùng sinh chuyển họa vi phúc.'
  },
  {
    id: 'div_t4_ctrl',
    name: 'U Minh Tỏa Hồn',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 180000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-slate-600/70 text-slate-200 bg-slate-950/50',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      stunTarget: true,
      debuffAtkPercent: 25,
      durationTurns: 2
    },
    description: 'Khóa chặt linh căn kẻ địch, làm choáng 1 hiệp và suy yếu 25% Công Kích đối phương trong 2 hiệp. Hồi chiêu: 5 hiệp.',
    flavorText: 'U minh thiết tỏa trói chặt hồn phách khiến đối thủ mất sạch ý chí giao tranh.'
  },
  {
    id: 'div_t4_domain',
    name: 'Cửu Tiêu Hàn Băng Vực',
    tier: 4,
    tierName: 'Tứ Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 220000,
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    badgeColor: 'border-sky-600/70 text-sky-200 bg-sky-950/50',
    cooldownTurns: 5,
    triggerCondition: 'combat_start',
    combatEffects: {
      debuffAtkPercent: 20,
      buffSpeedPercent: 25,
      durationTurns: 3
    },
    description: 'Đóng băng chiến trường, giảm 20% Công Kích của đối thủ đồng thời gia tăng 25% Thân Pháp của bản thân trong 3 hiệp đầu.',
    flavorText: 'Hàn băng ngàn năm phong tỏa thiên địa, chỉ riêng bóng hình ngươi lướt đi giữa tuyết vũ.'
  },

  // ==========================================
  // NGŨ GIAI (Hóa Thần Kỳ - Realm 26–30)
  // ==========================================
  {
    id: 'div_t5_dmg',
    name: 'Ngũ Hành Thần Quang',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 900000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-yellow-500/80 text-yellow-200 bg-yellow-950/60 shadow-amber-900/30 shadow-sm',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 4.8,
      trueDamageFlat: 25000
    },
    description: 'Quét sạch vạn vật thế gian, gây 480% sát thương ngũ hành cực hạn kèm 25,000 sát thương chuẩn bỏ qua giáp. Hồi chiêu: 4 hiệp.',
    flavorText: 'Khổng Tước chân truyền, ngũ sắc thần quang vô vật bất lạc, vô kiên bất phá.'
  },
  {
    id: 'div_t5_def',
    name: 'Hư Vô Thần Thuẫn',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 1000000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-slate-500/80 text-slate-200 bg-slate-950/60 shadow-slate-900/30 shadow-sm',
    cooldownTurns: 6,
    triggerCondition: 'hp_below_30',
    combatEffects: {
      invulnerableTurns: 1,
      durationTurns: 1
    },
    description: 'Chuyển thân thể tạm thời vào dòng chảy hư không: Miễn nhiễm 100% toàn bộ sát thương trong 1 hiệp khi lâm nguy.',
    flavorText: 'Thân dung nhập hư không vô tận, vạn pháp bất khả xâm phạm.'
  },
  {
    id: 'div_t5_ctrl',
    name: 'Hóa Thần Nhất Niệm',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 1200000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-rose-500/80 text-rose-200 bg-rose-950/60 shadow-rose-900/30 shadow-sm',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      debuffAtkPercent: 50,
      durationTurns: 2
    },
    description: 'Nhất niệm phong tỏa linh mạch đối phương, tước giảm 50% Công Kích của đối thủ trong 2 hiệp liên tiếp. Hồi chiêu: 5 hiệp.',
    flavorText: 'Hóa Thần chi niệm áp đảo phàm trần, phong bế thiên địa linh cơ trong chớp mắt.'
  },
  {
    id: 'div_t5_domain',
    name: 'Vạn Kiếm Triều Tông Vực',
    tier: 5,
    tierName: 'Ngũ Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 1500000,
    requiredRealmIndex: 26,
    requiredRealmName: 'Hóa Thần Kỳ',
    badgeColor: 'border-amber-500/80 text-amber-200 bg-amber-950/60 shadow-amber-900/30 shadow-sm',
    cooldownTurns: 5,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffAtkPercent: 30,
      damageMultiplier: 1.0,
      durationTurns: 3
    },
    description: 'Triệu hoán vạn thanh phi kiếm lượn quanh chiến trường, tăng 30% Công Kích và gây thêm 100% sát thương kiếm khí mỗi hiệp.',
    flavorText: 'Vạn kiếm tề quy, thiên hạ kiếm đạo giai quy nhất tông.'
  },

  // ==========================================
  // LỤC GIAI (Luyện Hư Kỳ - Realm 31–35)
  // ==========================================
  {
    id: 'div_t6_dmg',
    name: 'Hư Không Toái Liệt Trảm',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 5500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-cyan-500/80 text-cyan-200 bg-cyan-950/60 shadow-cyan-900/30 shadow-sm',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 6.0,
      trueDamageFlat: 80000
    },
    description: 'Chém nát kết cấu không gian, gây 600% sát thương kèm 80,000 sát thương chuẩn bỏ qua mọi khiên chắn giáp trụ. Hồi chiêu: 4 hiệp.',
    flavorText: 'Không gian vỡ vụn tựa gương rơi, trảm đoạn vạn cổ sinh cơ đối thủ.'
  },
  {
    id: 'div_t6_def',
    name: 'Hỗn Độn Hộ Thể Khí',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 6000000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-purple-500/80 text-purple-200 bg-purple-950/60 shadow-purple-900/30 shadow-sm',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      shieldPercentOfMaxHp: 40,
      reflectPercent: 30,
      durationTurns: 2
    },
    description: 'Tạo hộ thuẫn hỗn độn tương đương 40% Max HP, đồng thời phản chấn 30% sát thương nhận vào về phía kẻ ra tay. Hồi chiêu: 5 hiệp.',
    flavorText: 'Hỗn độn thái sơ khí, bất cấu bất tịnh, nại vạn kiếp bất ma.'
  },
  {
    id: 'div_t6_ctrl',
    name: 'Thời Gian Tĩnh Chỉ Thuật',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 7500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-emerald-500/80 text-emerald-200 bg-emerald-950/60 shadow-emerald-900/30 shadow-sm',
    cooldownTurns: 6,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      stunTarget: true,
      durationTurns: 1
    },
    description: 'Ngưng đọng thời gian chiến trường 1 hiệp: Đối thủ hoàn toàn bất động, mất lượt và nhận thêm 30% sát thương đòn đánh.',
    flavorText: 'Thời gian dừng bước, vạn vật đông cứng, sinh tử chỉ trong một ý niệm của người thi triển.'
  },
  {
    id: 'div_t6_domain',
    name: 'Quy Chân Luyện Hư Giới',
    tier: 6,
    tierName: 'Lục Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 8500000,
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    badgeColor: 'border-indigo-500/80 text-indigo-200 bg-indigo-950/60 shadow-indigo-900/30 shadow-sm',
    cooldownTurns: 5,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffCritRatePercent: 25,
      buffSpeedPercent: 30,
      durationTurns: 3
    },
    description: 'Phản phác quy chân hóa giải vạn pháp, tăng 25% Bạo Kích và 30% Thân Pháp trong 3 hiệp liên tiếp.',
    flavorText: 'Hư không luyện chân đạo, vạn pháp giai thành vô cấu thanh tịnh.'
  },

  // ==========================================
  // THẤT GIAI (Hợp Thể Kỳ - Realm 36–40)
  // ==========================================
  {
    id: 'div_t7_dmg',
    name: 'Đại Diệt Tuyệt Thần Quang',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 35000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-red-500 text-red-200 bg-red-950/70 shadow-red-900/40 shadow-md',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 8.0,
      buffCritRatePercent: 50
    },
    description: 'Ánh sáng hủy diệt bắn phá vạn vật, gây 800% sát thương cực hạn kèm 50% tỷ lệ bạo kích tất sát. Hồi chiêu: 4 hiệp.',
    flavorText: 'Diệt tuyệt chư thiên thần phật, quang hoa chiếu rọi nơi nào nơi đó tan thành tro bụi.'
  },
  {
    id: 'div_t7_def',
    name: 'Bất Tử Niết Bàn Thể',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 40000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-amber-500 text-amber-200 bg-amber-950/70 shadow-amber-900/40 shadow-md',
    cooldownTurns: 99,
    triggerCondition: 'hp_below_30',
    combatEffects: {
      deathWardReviveHpPercent: 35,
      invulnerableTurns: 1,
      durationTurns: 1
    },
    description: 'Khi nhận sát thương chí tử: Ngay lập tức niết bàn hồi sinh với 35% Max HP và nhận trạng thái Vô Địch trong 1 hiệp (1 lần/trận).',
    flavorText: 'Phượng hoàng niết bàn dục hỏa trùng sinh, nghịch chuyển sinh tử quy tắc.'
  },
  {
    id: 'div_t7_ctrl',
    name: 'Thiên Địa Lao Lung',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 45000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-purple-500 text-purple-200 bg-purple-950/70 shadow-purple-900/40 shadow-md',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      stunTarget: true,
      debuffAtkPercent: 30,
      durationTurns: 2
    },
    description: 'Nhốt đối thủ vào lồng giam càn khôn, làm choáng 1 hiệp, cấm né tránh và giảm 30% sát thương đối thủ trong 2 hiệp. Hồi chiêu: 5 hiệp.',
    flavorText: 'Thiên la địa võng khốn tiên diệt ma, nhập lao lung giả thần phách câu tỏa.'
  },
  {
    id: 'div_t7_domain',
    name: 'Pháp Thiên Tượng Địa',
    tier: 7,
    tierName: 'Thất Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 55000000,
    requiredRealmIndex: 36,
    requiredRealmName: 'Hợp Thể Kỳ',
    badgeColor: 'border-orange-500 text-orange-200 bg-orange-950/70 shadow-orange-900/40 shadow-md',
    cooldownTurns: 6,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffAtkPercent: 50,
      durationTurns: 4
    },
    description: 'Thân hóa cự nhân vạn trượng đỉnh thiên lập địa: Tăng 50% Công Kích và nhận lượng khiên khổng lồ trong 4 hiệp đầu trận.',
    flavorText: 'Thần thể vạn trượng vượt qua mây ngàn, nhất cước đạp bằng núi sông.'
  },

  // ==========================================
  // BÁT GIAI (Đại Thừa Kỳ - Realm 41–45)
  // ==========================================
  {
    id: 'div_t8_dmg',
    name: 'Chư Thiên Tinh Thần Lạc',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 220000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-fuchsia-400 text-fuchsia-100 bg-fuchsia-950/80 shadow-fuchsia-900/50 shadow-lg',
    cooldownTurns: 4,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 11.0,
      trueDamageFlat: 350000
    },
    description: 'Dẫn động mưa thiên thạch từ chư thiên rơi rụng, gây 1,100% sát thương bạo liệt kèm 350,000 sát thương chuẩn bỏ qua phòng ngự. Hồi chiêu: 4 hiệp.',
    flavorText: 'Tinh thần rơi rụng hủy thiên diệt địa, chư giới thần ma đều phải cúi đầu kinh sợ.'
  },
  {
    id: 'div_t8_def',
    name: 'Đảo Chuyển Càn Khôn',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 250000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-cyan-400 text-cyan-100 bg-cyan-950/80 shadow-cyan-900/50 shadow-lg',
    cooldownTurns: 6,
    triggerCondition: 'hp_below_30',
    combatEffects: {
      invulnerableTurns: 1,
      healPercentOfMaxHp: 30,
      durationTurns: 1
    },
    description: 'Nghịch chuyển càn khôn quy tắc: Miễn nhiễm toàn bộ sát thương trong 1 hiệp và hồi phục 30% Max HP khi sinh mệnh lâm nguy.',
    flavorText: 'Càn khôn nghịch chuyển, tử địa phùng sinh, sinh hóa vi tử, tử hóa vi sinh.'
  },
  {
    id: 'div_t8_ctrl',
    name: 'Luân Hồi Tước Mệnh',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 280000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-violet-400 text-violet-100 bg-violet-950/80 shadow-violet-900/50 shadow-lg',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      stunTarget: true,
      debuffAtkPercent: 40,
      durationTurns: 3
    },
    description: 'Đày đọa đối thủ vào lục đạo luân hồi, gây choáng 1 hiệp và phong ấn 40% sát thương địch trong 3 hiệp liên tiếp. Hồi chiêu: 5 hiệp.',
    flavorText: 'Luân hồi sáu cõi tước đoạt thọ mệnh, vạn kiếp trầm luân bất năng tự bạt.'
  },
  {
    id: 'div_t8_domain',
    name: 'Thái Sơ Hỗn Độn Lĩnh Vực',
    tier: 8,
    tierName: 'Bát Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 350000000,
    requiredRealmIndex: 41,
    requiredRealmName: 'Đại Thừa Kỳ',
    badgeColor: 'border-indigo-400 text-indigo-100 bg-indigo-950/80 shadow-indigo-900/50 shadow-lg',
    cooldownTurns: 6,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffAtkPercent: 60,
      healPercentOfMaxHp: 10,
      durationTurns: 4
    },
    description: 'Triệt tiêu đạo tắc của càn khôn, tăng 60% Công Kích và hồi phục 10% Max HP mỗi hiệp trong 4 hiệp chiến đấu đầu.',
    flavorText: 'Thái sơ hữu khí vô hình, vạn vật sinh ra từ hỗn độn và quy về hỗn độn.'
  },

  // ==========================================
  // CỬU GIAI (Độ Kiếp / Tiên Nhân - Realm 46+)
  // ==========================================
  {
    id: 'div_t9_dmg',
    name: 'Khai Thiên Tích Địa Thần Lôi',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'cong_phat',
    categoryName: 'Công Phạt',
    price: 1500000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-amber-300 text-yellow-100 bg-gradient-to-r from-amber-950/90 to-purple-950/90 shadow-amber-500/30 shadow-xl border animate-pulse',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      damageMultiplier: 16.0,
      executeHpThresholdPercent: 20
    },
    description: 'Búa sét khai thiên giáng thế gây 1,600% sát thương chuẩn cực hạn; nếu Khí Huyết đối thủ dưới 20% lập tức trảm sát kết liễu! Hồi chiêu: 5 hiệp.',
    flavorText: 'Thái Cổ Thần Lôi xé rách hồng hoang, khai thiên lập địa trảm đoạn nhân quả.'
  },
  {
    id: 'div_t9_def',
    name: 'Vạn Cổ Bất Hủ Tiên Khu',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'ho_than',
    categoryName: 'Hộ Thân',
    price: 1800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-yellow-300 text-yellow-100 bg-gradient-to-r from-yellow-950/90 to-amber-950/90 shadow-yellow-500/30 shadow-xl border animate-pulse',
    cooldownTurns: 99,
    triggerCondition: 'combat_start',
    combatEffects: {
      healPercentOfMaxHp: 8,
      durationTurns: 99
    },
    description: 'Ngưng tụ tiên thể bất hoại: Mỗi khi vào trận đấu liên tục hồi 8% Max HP mỗi hiệp kéo dài suốt toàn bộ cuộc chiến sinh tử.',
    flavorText: 'Thần thể đúc bằng thái sơ tiên đạo, nhật nguyệt mục nát mà tiên khu bất diệt.'
  },
  {
    id: 'div_t9_ctrl',
    name: 'Hỗn Độn Hóa Đạo Kích',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'tran_ap',
    categoryName: 'Trấn Áp',
    price: 2000000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-rose-400 text-rose-100 bg-gradient-to-r from-rose-950/90 to-violet-950/90 shadow-rose-500/30 shadow-xl border animate-pulse',
    cooldownTurns: 5,
    triggerCondition: 'active_cooldown',
    combatEffects: {
      drainEnemyAtkDefPercent: 50,
      stunTarget: true,
      durationTurns: 3
    },
    description: 'Đánh tan đạo quả đối phương, làm choáng 1 hiệp và tước đoạt 50% Công Kích chuyển hóa gia trì vào bản thân trong 3 hiệp. Hồi chiêu: 5 hiệp.',
    flavorText: 'Hóa đạo vô tình, tước đoạt thiên mệnh đối thủ chuyển về tự thân quy nhất.'
  },
  {
    id: 'div_t9_domain',
    name: 'Vạn Cổ Duy Ngã Độc Tôn Giới',
    tier: 9,
    tierName: 'Cửu Giai',
    category: 'linh_vuc',
    categoryName: 'Lĩnh Vực',
    price: 2800000000,
    requiredRealmIndex: 46,
    requiredRealmName: 'Độ Kiếp Kỳ',
    badgeColor: 'border-purple-300 text-purple-100 bg-gradient-to-r from-purple-950/90 via-amber-950/80 to-indigo-950/90 shadow-purple-500/40 shadow-2xl border animate-pulse',
    cooldownTurns: 99,
    triggerCondition: 'combat_start',
    combatEffects: {
      buffAtkPercent: 100,
      buffCritRatePercent: 50,
      buffCritDmgPercent: 150,
      durationTurns: 99
    },
    description: 'Lĩnh vực Vô Thượng Chí Tôn: Tăng 100% Công Kích, 50% Tỷ lệ bạo kích và 150% Sát thương bạo kích cho đến khi kết thúc trận giao tranh!',
    flavorText: 'Thượng thiên hạ địa duy ngã độc tôn, nhất niệm chư thiên phủ phục, vạn cổ xưng tôn.'
  }
];

export const DIVINE_SHOP_ITEMS_MAP: Record<string, DivineAbilityShopItem> = DIVINE_ABILITIES_SHOP_CATALOG.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, DivineAbilityShopItem>);

export function getDivineCategoryBadge(category: DivineCategory): { label: string; icon: string; badgeClass: string } {
  switch (category) {
    case 'cong_phat':
      return {
        label: 'Công Phạt',
        icon: '⚡',
        badgeClass: 'bg-red-950/80 text-red-300 border-red-700/60'
      };
    case 'ho_than':
      return {
        label: 'Hộ Thân',
        icon: '🛡️',
        badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-700/60'
      };
    case 'tran_ap':
      return {
        label: 'Trấn Áp',
        icon: '⛓️',
        badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
      };
    case 'linh_vuc':
      return {
        label: 'Lĩnh Vực',
        icon: '🌌',
        badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-700/60'
      };
    default:
      return {
        label: 'Thần Thông',
        icon: '🔮',
        badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700/60'
      };
  }
}

export function divineShopItemToMerchantItem(item: DivineAbilityShopItem): MerchantItem {
  return {
    id: item.id,
    name: item.name,
    category: 'skills',
    itemType: 'manual',
    type: 'manual',
    manualSlot: 'than_thong',
    price: item.price,
    costLinhThach: item.price,
    stock: 1,
    maxStock: 1,
    oneTimeOnly: true,
    tier: item.tier,
    tierName: item.tierName,
    requiredRealmIndex: item.requiredRealmIndex,
    requiredRealmName: item.requiredRealmName,
    description: item.description,
    divineAbility: item,
    divineCategory: item.category,
    divineEffects: item.combatEffects,
    data: {
      ...item,
      flavorText: item.flavorText,
      cooldownTurns: item.cooldownTurns,
      triggerCondition: item.triggerCondition,
      combatEffects: item.combatEffects,
      category: item.category,
      categoryName: item.categoryName
    }
  };
}

export const TIER_DIVINE_MERCHANT_ITEMS: MerchantItem[] = DIVINE_ABILITIES_SHOP_CATALOG.map(divineShopItemToMerchantItem);
