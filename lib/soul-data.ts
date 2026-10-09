// lib/soul-data.ts
// Cấu hình dữ liệu phân hệ Thức Hải Thần Hồn (Soul & Consciousness System)

import {
  SoulRealm,
  SoulRelic,
  SoulState,
  SoulNourishingItemConfig
} from './types/soul';

/**
 * 10 CẢNH GIỚI THẦN HỒN THẦN BÍ
 */
export const SOUL_REALMS: SoulRealm[] = [
  {
    id: 'pham_hon',
    name: 'Phàm Hồn',
    realmIndex: 0,
    maxStage: 9,
    description: 'Thần thức mông muội chưa khai mở, hồn phách phàm nhân mong manh dễ vỡ trước thiên uy.',
    lore: 'Nhất niệm sơ sinh, như đom đóm trong đêm tối, cần được đan điền linh khí bồi dưỡng.',
    glowColor: '#94a3b8',
    statsBonus: { triLuc: 5, tinhThan: 10, def: 10, speed: 2 },
    spiritualPressure: 0,
    maxControlSlots: 1,
    specialAbilityName: 'Thức Tỉnh Linh Giác',
    specialAbilityDesc: 'Cảm nhận linh khí lưu chuyển cơ bản quanh thân thể.'
  },
  {
    id: 'ngung_than',
    name: 'Ngưng Thần',
    realmIndex: 1,
    maxStage: 9,
    description: 'Thần niệm ngưng tụ thành tơ, cảm ứng rõ ràng linh khí và biến động thiên địa quanh thân.',
    lore: 'Ngưng thần tụ niệm, linh đài thanh tịnh, phân biệt hư thực trong phạm vi mười trượng.',
    glowColor: '#38bdf8',
    statsBonus: { triLuc: 20, tinhThan: 35, speed: 8, critRate: 3, khangKhongChe: 5 },
    spiritualPressure: 3,
    maxControlSlots: 1,
    specialAbilityName: 'Linh Giác Mẫn Tiệp',
    specialAbilityDesc: 'Tăng 3% Tỉ lệ Bạo Kích và Thân Pháp né tránh tự nhiên.'
  },
  {
    id: 'duc_than',
    name: 'Dục Thần',
    realmIndex: 2,
    maxStage: 9,
    description: 'Thức Hải sơ bộ thành hình, thần hồn được tôi dưỡng trong đầm lầy linh lực, tâm hồn tĩnh lặng.',
    lore: 'Tắm gội thần niệm, đan điền vững vàng, bách độc bất xâm lấn thức hải.',
    glowColor: '#2dd4bf',
    statsBonus: { triLuc: 45, tinhThan: 70, def: 40, khangPhep: 10, khangKhongChe: 10 },
    spiritualPressure: 6,
    maxControlSlots: 2,
    specialAbilityName: 'Thức Hải Tịnh Hóa',
    specialAbilityDesc: 'Giảm 15% tác động xấu từ đan độc và trạng thái suy yếu.'
  },
  {
    id: 'hoa_than',
    name: 'Hóa Thần',
    realmIndex: 3,
    maxStage: 9,
    description: 'Thần niệm phóng ngoại phạm vi trăm dặm, hóa hư vi thực, cảm nhận hung hiểm từ xa xôi.',
    lore: 'Thần thức hóa hình, khám phá thiên địa huyền cơ, một niệm quan sát vạn vật.',
    glowColor: '#818cf8',
    statsBonus: { triLuc: 80, tinhThan: 120, speed: 15, critRate: 6, spiritualPressure: 10 },
    spiritualPressure: 10,
    maxControlSlots: 2,
    specialAbilityName: 'Thần Niệm Phóng Ngoại',
    specialAbilityDesc: 'Uy Áp sơ cấp, tự động phát hiện cạm bẫy và bí mật ẩn giấu trong bí cảnh.'
  },
  {
    id: 'du_than',
    name: 'Du Thần',
    realmIndex: 4,
    maxStage: 9,
    description: 'Hồn phách rời xác ngao du thiên hạ trong đêm tối mà không sợ cương phong thổi tan.',
    lore: 'Dạ du thiên lý, tâm thông vạn giới, hấp thu tinh hoa nhật nguyệt bồi dưỡng hồn phách.',
    glowColor: '#a855f7',
    statsBonus: { triLuc: 130, tinhThan: 180, speed: 25, atk: 80, khangKhongChe: 15 },
    spiritualPressure: 15,
    maxControlSlots: 2,
    specialAbilityName: 'Thần Du Thái Hư',
    specialAbilityDesc: 'Tăng tốc độ bế quan offline thêm 20%, nhận thêm tu vi thần hồn khi rời mạng.'
  },
  {
    id: 'nguyen_than',
    name: 'Nguyên Thần',
    realmIndex: 5,
    maxStage: 9,
    description: 'Ngưng tụ Nguyên Thần Chân Thân bất diệt trong Thức Hải, sinh mệnh thăng hoa lên tầm cao mới.',
    lore: 'Thân diệt hồn tồn, Nguyên Thần ngưng tụ kim quang, mở ra con đường trường sinh bất tử.',
    glowColor: '#c084fc',
    statsBonus: { triLuc: 200, tinhThan: 260, hp: 1500, def: 120, khangKhongChe: 25 },
    spiritualPressure: 20,
    maxControlSlots: 3,
    specialAbilityName: 'Nguyên Thần Xuất Khiếu',
    specialAbilityDesc: 'Khi HP về 0, Nguyên Thần xuất khiếu giữ lại 1 giọt máu và bảo toàn tu vi (Cooldown 120s).'
  },
  {
    id: 'phan_than',
    name: 'Phân Thần',
    realmIndex: 6,
    maxStage: 9,
    description: 'Thần thức phân hóa vạn thiên, một niệm hóa đa niệm, điều khiển nhiều bảo vật cùng lúc không trở ngại.',
    lore: 'Phân thân hóa ảnh, một niệm vạn kiếm, tâm thần thông đạt tam giới.',
    glowColor: '#e879f9',
    statsBonus: { triLuc: 300, tinhThan: 380, speed: 40, critDmg: 25, spiritualPressure: 25 },
    spiritualPressure: 25,
    maxControlSlots: 3,
    specialAbilityName: 'Vạn Niệm Đa Nhiệm',
    specialAbilityDesc: 'Mở thêm 1 ô xuất chiến Pháp Bảo / Khôi Lỗi; gia tăng 15% uy lực đòn kép.'
  },
  {
    id: 'hop_dao_chan_linh',
    name: 'Hợp Đạo Chân Linh',
    realmIndex: 7,
    maxStage: 9,
    description: 'Hồn phách dung hợp đại đạo chân linh, tâm cảnh như cổ tỉnh không gợn sóng trước huyễn cảnh ma âm.',
    lore: 'Đạo tâm kiên định, chư tà tịch diệt, bất khuất trước vạn trượng lôi kiếp.',
    glowColor: '#f472b6',
    statsBonus: { triLuc: 450, tinhThan: 550, def: 250, khangKhongChe: 50, critRate: 10 },
    spiritualPressure: 30,
    maxControlSlots: 3,
    specialAbilityName: 'Chân Linh Bất Động',
    specialAbilityDesc: 'Miễn nhiễm hoàn toàn các hiệu ứng Mê Hoặc, Định Thân và Câm Lặng cấp thấp.'
  },
  {
    id: 'bat_hu_than_hon',
    name: 'Bất Hủ Thần Hồn',
    realmIndex: 8,
    maxStage: 9,
    description: 'Hồn thể hóa thành kim cương lưu ly bất hủ, ngàn vạn kiếp số không thể mài mòn ý chí chí tôn.',
    lore: 'Bất hủ bất diệt, vạn kiếp trường tồn, ý niệm câu thông thiên địa quy tắc nguyên thủy.',
    glowColor: '#fbbf24',
    statsBonus: { triLuc: 700, tinhThan: 800, hp: 4000, atk: 300, khangPhep: 40 },
    spiritualPressure: 40,
    maxControlSlots: 4,
    specialAbilityName: 'Kim Cương Bất Hủ',
    specialAbilityDesc: 'Kháng 40% sát thương Thần thức; tự phục hồi 5% sinh mệnh mỗi hiệp theo % Thần Niệm.'
  },
  {
    id: 'hon_don_than_niem',
    name: 'Hỗn Độn Thần Niệm',
    realmIndex: 9,
    maxStage: 9,
    description: 'Thần thức hóa thân thành Hỗn Độn Thái Sơ, một ánh mắt trấn áp quần hùng, uy áp cái thế vô địch.',
    lore: 'Hỗn độn sơ khai, ngô niệm vi thiên, vạn đạo quy nhất, chư thiên cúi đầu xưng thần.',
    glowColor: '#38bdf8',
    statsBonus: { triLuc: 1200, tinhThan: 1500, hp: 8000, atk: 600, def: 500, speed: 60, critRate: 15, critDmg: 50 },
    spiritualPressure: 50,
    maxControlSlots: 4,
    specialAbilityName: 'Hỗn Độn Uy Áp',
    specialAbilityDesc: 'Thần thức bao trùm thiên địa; Uy Áp áp chế 20% toàn bộ chỉ số kẻ địch yếu hơn từ hiệp đầu.'
  }
];

/**
 * BẬC EXP THEO CẢNH GIỚI THẦN HỒN (Cơ sở nhân theo tiểu tầng)
 */
export const SOUL_STAGE_EXP_BASE: number[] = [
  100,    // 0. Phàm Hồn
  280,    // 1. Ngưng Thần
  750,    // 2. Dục Thần
  1800,   // 3. Hóa Thần
  4200,   // 4. Du Thần
  9500,   // 5. Nguyên Thần
  22000,  // 6. Phân Thần
  50000,  // 7. Hợp Đạo Chân Linh
  110000, // 8. Bất Hủ Thần Hồn
  250000  // 9. Hỗn Độn Thần Niệm
];

/**
 * DANH MỤC VẬT PHẨM TỊNH TÂM & ÔN DƯỠNG THẦN HỒN
 */
export const SOUL_NOURISHING_ITEMS: SoulNourishingItemConfig[] = [
  {
    id: 'an_than_thao',
    name: 'An Thần Thảo',
    category: 'herb',
    tierName: 'Phàm Giai',
    description: 'Thảo dược thanh tâm dưỡng tính, an định kinh mạch và khai thông thức hải.',
    expGain: 120,
    stabilityGain: 15,
    corruptionCleansed: 10,
    soulPowerRestore: 50,
    icon: '🌿'
  },
  {
    id: 'u_minh_thach',
    name: 'U Minh Thạch',
    category: 'ore',
    tierName: 'Huyền Giai',
    description: 'Khoáng thạch ngầm dưới đáy Cửu U, ẩn chứa linh u chi khí bồi dưỡng hồn phách.',
    expGain: 350,
    stabilityGain: 20,
    corruptionCleansed: 15,
    soulPowerRestore: 120,
    icon: '🪨'
  },
  {
    id: 'pill_thanh_than',
    name: 'Thanh Thần Đan',
    category: 'pill',
    tierName: 'Địa Giai',
    description: 'Luyện chế từ Tuyết Liên và Linh Tủy ngàn năm, thanh tẩy ma chướng cực kỳ hiệu nghiệm.',
    expGain: 850,
    stabilityGain: 35,
    corruptionCleansed: 30,
    soulPowerRestore: 300,
    icon: '💊'
  },
  {
    id: 'van_dao_huong',
    name: 'Vấn Đạo Hương',
    category: 'incense',
    tierName: 'Thiên Giai',
    description: 'Trầm hương tịnh tâm do đại năng đắc đạo điều chế, khi đốt lên giúp đốn ngộ đạo quả.',
    expGain: 2000,
    stabilityGain: 50,
    corruptionCleansed: 45,
    soulPowerRestore: 600,
    icon: '🪔'
  },
  {
    id: 'duong_hon_moc',
    name: 'Dưỡng Hồn Mộc',
    category: 'herb',
    tierName: 'Thần Giai',
    description: 'Nhánh cây Dưỡng Hồn thần thụ thượng cổ, tương truyền có thể tụ hồn tái sinh.',
    expGain: 5000,
    stabilityGain: 80,
    corruptionCleansed: 70,
    soulPowerRestore: 1500,
    icon: '🪵'
  }
];

/**
 * DANH MỤC HỒN KHÍ TRẤN THỨC HẢI (SOUL RELICS)
 */
export const SOUL_RELICS_CATALOG: SoulRelic[] = [
  {
    id: 'relic_tram_than_kiem',
    name: 'Trảm Thần Kiếm',
    type: 'offensive',
    tier: 3,
    description: 'Thanh kiếm vô hình ngưng tụ từ sát niệm thần thức thuần khiết, chém thẳng vào hồn phách đối thủ.',
    passiveEffect: 'Tăng 250 Công Kích, đòn đánh kèm 15% Xuyên Giáp Thần Hồn.',
    soulPowerCost: 40,
    statsBonus: { atk: 250, critRate: 8, spiritualPressure: 5 },
    icon: '🗡️'
  },
  {
    id: 'relic_duong_hon_chau',
    name: 'Dưỡng Hồn Châu',
    type: 'support',
    tier: 3,
    description: 'Hạt ngọc hải thần hấp thu linh khí thiên địa, liên tục làm ấm và phục hồi Thần Niệm.',
    passiveEffect: 'Hồi phục Thần Niệm nhanh hơn 50%, hồi phục 4% Khí Huyết mỗi hiệp đấu.',
    soulPowerCost: 20,
    statsBonus: { hp: 1200, tinhThan: 80 },
    icon: '🔮'
  },
  {
    id: 'relic_huyen_vu_hon_giap',
    name: 'Huyền Vũ Hồn Giáp',
    type: 'defensive',
    tier: 3,
    description: 'Tấm giáp hư ảnh khắc hoa văn mai rùa Huyền Vũ, che chắn Thức Hải trước đòn Thần Thức.',
    passiveEffect: 'Tăng 200 Phòng Ngự, giảm 12% sát thương gánh chịu toàn diện.',
    soulPowerCost: 35,
    statsBonus: { def: 200, khangKhongChe: 15 },
    icon: '🛡️'
  },
  {
    id: 'relic_thai_hu_than_kinh',
    name: 'Thái Hư Thần Kính',
    type: 'support',
    tier: 4,
    description: 'Tấm gương cổ xưa phản chiếu bản chất chân như, soi sáng ảo ảnh tâm ma.',
    passiveEffect: 'Tăng 15 Uy Áp Thần Thức, kháng 25% các hiệu ứng khống chế định thân.',
    soulPowerCost: 50,
    statsBonus: { spiritualPressure: 15, khangKhongChe: 25, speed: 20 },
    icon: '🪞'
  },
  {
    id: 'relic_cuu_u_nhiep_hon_chuong',
    name: 'Cửu U Nhiếp Hồn Chuông',
    type: 'offensive',
    tier: 4,
    description: 'Chuông đồng u ám phát ra âm thanh câu hồn đoạt phách, làm rung chuyển thức hải kẻ địch.',
    passiveEffect: 'Tăng 12% Tỉ Lệ Bạo Kích, có 20% tỉ lệ làm choáng thần hồn đối thủ 1 hiệp.',
    soulPowerCost: 65,
    statsBonus: { atk: 450, critRate: 12, critDmg: 30 },
    icon: '🔔'
  },
  {
    id: 'relic_hon_don_tran_hon_dinh',
    name: 'Hỗn Độn Trấn Hồn Đỉnh',
    type: 'defensive',
    tier: 5,
    description: 'Chiếc đỉnh ba chân cổ xưa chế ngự thái hư, bảo hộ Thức Hải kiên cố tựa thái sơn.',
    passiveEffect: 'Tăng 3,500 Khí Huyết, miễn nhiễm hoàn toàn đòn bạo kích thần thức từ đối thủ.',
    soulPowerCost: 80,
    statsBonus: { hp: 3500, def: 350, khangKhongChe: 40 },
    icon: '🏺'
  }
];

/**
 * Khởi tạo mặc định SoulState cho tân thủ
 */
export function createDefaultSoulState(): SoulState {
  return {
    cultivation: {
      currentRealmId: 'pham_hon',
      currentStage: 1,
      currentExp: 0,
      expToNextStage: SOUL_STAGE_EXP_BASE[0],
      soulSeaCapacity: 150,
      currentSoulPower: 150
    },
    mindState: {
      stability: 100, // Tâm Cảnh 100% vẹn toàn
      demonCorruption: 0, // Chưa có ma tính
      demonLevel: 0,
      isTribulationActive: false
    },
    equippedRelics: [SOUL_RELICS_CATALOG[0]], // Khởi đầu với Trảm Thần Kiếm
    lastMeditationTimestamp: Date.now()
  };
}

/**
 * MA TRẬN RÀNG BUỘC CẢNH GIỚI THẦN HỒN (REALM LOCK MATRIX)
 * Trả về Bậc Thần Hồn tối đa (1-10) mà tu sĩ có thể đột phá tương ứng với cảnh giới bản thể.
 * - Phàm Nhân (0) -> Tier 1 (Phàm Hồn)
 * - Luyện Khí (1-10) -> Tier 2 (Ngưng Thần)
 * - Trúc Cơ (11-15) -> Tier 3 (Dục Thần)
 * - Kim Đan (16-20) -> Tier 4 (Hóa Thần)
 * - Nguyên Anh (21-25) -> Tier 5 (Du Thần)
 * - Hóa Thần (26-30) -> Tier 6 (Nguyên Thần)
 * - Luyện Hư (31-35) -> Tier 7 (Phân Thần)
 * - Hợp Thể (36-40) -> Tier 8 (Hợp Đạo Chân Linh)
 * - Đại Thừa - Độ Kiếp (41-50) -> Tier 9 (Bất Hủ Thần Hồn)
 * - Tiên Giới - Đế Cảnh (51-104) -> Tier 10 (Hỗn Độn Thần Niệm)
 */
export function getMaxSoulTierForRealm(cultivationRealmIndex: number = 0): number {
  if (cultivationRealmIndex <= 0) return 1;
  if (cultivationRealmIndex <= 10) return 2;
  if (cultivationRealmIndex <= 15) return 3;
  if (cultivationRealmIndex <= 20) return 4;
  if (cultivationRealmIndex <= 25) return 5;
  if (cultivationRealmIndex <= 30) return 6;
  if (cultivationRealmIndex <= 35) return 7;
  if (cultivationRealmIndex <= 40) return 8;
  if (cultivationRealmIndex <= 50) return 9;
  return 10;
}

/**
 * Trả về tên Đại Cảnh Giới Khí Tu yêu cầu để mở khóa Bậc Thần Hồn tương ứng.
 */
export function getRequiredRealmNameForSoulTier(targetSoulTier: number): string {
  switch (targetSoulTier) {
    case 1: return 'Phàm Nhân';
    case 2: return 'Luyện Khí';
    case 3: return 'Trúc Cơ';
    case 4: return 'Kim Đan';
    case 5: return 'Nguyên Anh';
    case 6: return 'Hóa Thần';
    case 7: return 'Luyện Hư';
    case 8: return 'Hợp Thể';
    case 9: return 'Đại Thừa';
    case 10: return 'Tiên Giới';
    default: return 'Tiên Giới';
  }
}

