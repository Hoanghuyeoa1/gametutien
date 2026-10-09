import {
  PlayerStats,
  BodyRefinementState,
  SoulCultivationState,
  Pill
} from '@/lib/types';

// ============================================
// 1. ĐỊNH NGHĨA 9 ĐẠI CẢNH GIỚI NHỤC THÂN (THỂ TU)
// ============================================
export interface BodyRealmConfig {
  realmIndex: number;
  name: string;
  tagline: string;
  description: string;
  badgeClass: string;
  glowColor: string;
  icon: string;
  baseHpBonus: number;          // HP cộng thêm cơ bản của đại cảnh giới
  hpPerLevel: number;           // HP cộng thêm mỗi tầng (1 - 9)
  baseDefBonus: number;         // DEF cộng thêm cơ bản
  defPerLevel: number;          // DEF cộng thêm mỗi tầng
  dmgReductionPerLevel: number; // % Miễn thương vật lý mỗi tầng (ví dụ 0.3%)
  hpRegenPercent: number;       // % Hồi phục Khí Huyết mỗi hiệp giao tranh (Kim Thân trở lên)
  costPerLevel: {
    tinhHuyet: number;          // Tinh Huyết Yêu Thú
    linhThach: number;          // Linh Thạch
    khiHuyetDan?: number;       // Khí Huyết Đan tiêu hao (tùy chọn)
  };
  breakthroughCost: {
    tinhHuyet: number;
    linhThach: number;
    khiHuyetDan: number;
  };
}

export const BODY_REALMS_CONFIG: BodyRealmConfig[] = [
  {
    realmIndex: 0,
    name: 'Luyện Bì Cảnh',
    tagline: 'Đồng bì thiết cốt, đao thương khó hoại.',
    description: 'Rèn luyện tầng da biểu bì, bài tiết cặn bã, giúp nhục thân rắn rỏi chống đỡ đao kiếm thông thường.',
    badgeClass: 'text-amber-300 border-amber-600/40 bg-amber-950/40',
    glowColor: 'amber',
    icon: '🛡️',
    baseHpBonus: 500,
    hpPerLevel: 250,
    baseDefBonus: 20,
    defPerLevel: 10,
    dmgReductionPerLevel: 0.3,
    hpRegenPercent: 0,
    costPerLevel: { tinhHuyet: 1, linhThach: 150, khiHuyetDan: 0 },
    breakthroughCost: { tinhHuyet: 3, linhThach: 600, khiHuyetDan: 1 }
  },
  {
    realmIndex: 1,
    name: 'Đoạn Cốt Cảnh',
    tagline: 'Cốt cách như cương, vung tay vạn cân.',
    description: 'Dẫn tinh huyết vào từng khớp xương, rèn đúc khung cốt cứng rắn như huyền thiết ngàn năm.',
    badgeClass: 'text-orange-300 border-orange-600/40 bg-orange-950/40',
    glowColor: 'orange',
    icon: '🦴',
    baseHpBonus: 2800,
    hpPerLevel: 600,
    baseDefBonus: 120,
    defPerLevel: 30,
    dmgReductionPerLevel: 0.4,
    hpRegenPercent: 0,
    costPerLevel: { tinhHuyet: 2, linhThach: 400, khiHuyetDan: 0 },
    breakthroughCost: { tinhHuyet: 6, linhThach: 1500, khiHuyetDan: 1 }
  },
  {
    realmIndex: 2,
    name: 'Hoán Huyết Cảnh',
    tagline: 'Huyết khí như hồng, khí huyết sục sôi.',
    description: 'Thay máu phàm tục bằng linh huyết đỏ thẫm như dung nham, sinh cơ bừng bừng không dứt.',
    badgeClass: 'text-rose-400 border-rose-600/40 bg-rose-950/40',
    glowColor: 'rose',
    icon: '🩸',
    baseHpBonus: 8500,
    hpPerLevel: 1500,
    baseDefBonus: 400,
    defPerLevel: 75,
    dmgReductionPerLevel: 0.5,
    hpRegenPercent: 0,
    costPerLevel: { tinhHuyet: 3, linhThach: 900, khiHuyetDan: 1 },
    breakthroughCost: { tinhHuyet: 10, linhThach: 3500, khiHuyetDan: 2 }
  },
  {
    realmIndex: 3,
    name: 'Tẩy Tủy Cảnh',
    tagline: 'Tủy sinh ngọc dịch, tẩy trừ tục trần.',
    description: 'Thanh lọc tủy não, nội tức lưu thông tuần hoàn viên mãn, bách bệnh bất xâm, vạn độc bất nhập.',
    badgeClass: 'text-red-400 border-red-500/50 bg-red-950/40',
    glowColor: 'red',
    icon: '✨',
    baseHpBonus: 22000,
    hpPerLevel: 3200,
    baseDefBonus: 1100,
    defPerLevel: 180,
    dmgReductionPerLevel: 0.6,
    hpRegenPercent: 0,
    costPerLevel: { tinhHuyet: 5, linhThach: 2200, khiHuyetDan: 1 },
    breakthroughCost: { tinhHuyet: 15, linhThach: 8000, khiHuyetDan: 3 }
  },
  {
    realmIndex: 4,
    name: 'Ngũ Tạng Cảnh',
    tagline: 'Ngũ tạng uẩn linh, ngũ hành nội sinh.',
    description: 'Uẩn dưỡng tâm can tỳ phế thận hóa thành thần lô, khí tức nội lực liên miên bất tuyệt.',
    badgeClass: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40',
    glowColor: 'emerald',
    icon: '🫀',
    baseHpBonus: 52000,
    hpPerLevel: 6800,
    baseDefBonus: 2800,
    defPerLevel: 420,
    dmgReductionPerLevel: 0.7,
    hpRegenPercent: 0,
    costPerLevel: { tinhHuyet: 8, linhThach: 5500, khiHuyetDan: 2 },
    breakthroughCost: { tinhHuyet: 22, linhThach: 18000, khiHuyetDan: 4 }
  },
  {
    realmIndex: 5,
    name: 'Kim Thân Cảnh',
    tagline: 'Bất phôi kim thân, thần quang hộ thể.',
    description: 'Thân thể hóa thành Lưu Ly Kim Thân, mở khóa nội tại "Hồi Phục Khí Huyết" mỗi hiệp giao tranh.',
    badgeClass: 'text-yellow-300 border-yellow-400/60 bg-yellow-950/50 shadow-[0_0_10px_rgba(234,179,8,0.25)]',
    glowColor: 'yellow',
    icon: '🌟',
    baseHpBonus: 120000,
    hpPerLevel: 15000,
    baseDefBonus: 6500,
    defPerLevel: 900,
    dmgReductionPerLevel: 0.8,
    hpRegenPercent: 3, // Hồi phục 3% HP mỗi hiệp
    costPerLevel: { tinhHuyet: 12, linhThach: 13000, khiHuyetDan: 2 },
    breakthroughCost: { tinhHuyet: 30, linhThach: 40000, khiHuyetDan: 5 }
  },
  {
    realmIndex: 6,
    name: 'Thần Ma Thể',
    tagline: 'Thao thiên ma huyết, xé trời nứt đất.',
    description: 'Hấp thu huyết mạch Thần Ma viễn cổ, nhục thân sừng sững tựa hung thần cái thế, dập tắt thần thông.',
    badgeClass: 'text-purple-300 border-purple-500/60 bg-purple-950/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    glowColor: 'purple',
    icon: '👹',
    baseHpBonus: 260000,
    hpPerLevel: 32000,
    baseDefBonus: 15000,
    defPerLevel: 1900,
    dmgReductionPerLevel: 1.0,
    hpRegenPercent: 5, // Hồi phục 5% HP mỗi hiệp
    costPerLevel: { tinhHuyet: 18, linhThach: 30000, khiHuyetDan: 3 },
    breakthroughCost: { tinhHuyet: 45, linhThach: 90000, khiHuyetDan: 7 }
  },
  {
    realmIndex: 7,
    name: 'Bất Diệt Cảnh',
    tagline: 'Tích huyết trùng sinh, vạn kiếp bất ma.',
    description: 'Chỉ cần một giọt máu còn sót lại cũng có thể tái sinh, thể phách bất diệt trường tồn cùng nhật nguyệt.',
    badgeClass: 'text-cyan-300 border-cyan-400/60 bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    glowColor: 'cyan',
    icon: '⚡',
    baseHpBonus: 580000,
    hpPerLevel: 65000,
    baseDefBonus: 32000,
    defPerLevel: 3800,
    dmgReductionPerLevel: 1.2,
    hpRegenPercent: 7, // Hồi phục 7% HP mỗi hiệp
    costPerLevel: { tinhHuyet: 25, linhThach: 70000, khiHuyetDan: 4 },
    breakthroughCost: { tinhHuyet: 65, linhThach: 200000, khiHuyetDan: 10 }
  },
  {
    realmIndex: 8,
    name: 'Hỗn Độn Bá Thể',
    tagline: 'Hỗn Độn hóa thân, trấn áp chư thiên vạn giới.',
    description: 'Nhục thân dung hợp sơ nguyên hỗn độn, quyền phá hư không, một cước đạp vỡ tinh hà, chí tôn thể tu!',
    badgeClass: 'text-amber-200 border-amber-300/80 bg-gradient-to-r from-amber-950/80 to-purple-950/80 shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    glowColor: 'amber',
    icon: '👑',
    baseHpBonus: 1250000,
    hpPerLevel: 140000,
    baseDefBonus: 68000,
    defPerLevel: 8000,
    dmgReductionPerLevel: 1.5,
    hpRegenPercent: 10, // Hồi phục 10% HP mỗi hiệp
    costPerLevel: { tinhHuyet: 35, linhThach: 150000, khiHuyetDan: 5 },
    breakthroughCost: { tinhHuyet: 100, linhThach: 500000, khiHuyetDan: 15 }
  }
];

// ============================================
// 2. ĐỊNH NGHĨA 9 ĐẠI CẢNH GIỚI THẦN HỒN (HỒN TU)
// ============================================
export interface SoulRealmConfig {
  realmIndex: number;
  name: string;
  tagline: string;
  description: string;
  badgeClass: string;
  glowColor: string;
  icon: string;
  baseSoulBonus: number;        // Thần thức cơ bản
  soulPerLevel: number;         // Thần thức mỗi tầng
  baseSpeedBonus: number;       // Tốc độ cơ bản
  speedPerLevel: number;        // Tốc độ mỗi tầng
  critRatePerLevel: number;     // % Bạo kích mỗi tầng
  soulSuppression: boolean;     // Có mở khóa Thần Niệm Chấn Nhiếp hay không
  alchemyBonusPercent: number;  // Tăng tỉ lệ đan dược cực phẩm
  secretRealmBonusPercent: number; // Tăng tỉ lệ thành công kỳ duyên bí cảnh
  costPerLevel: {
    tuVi: number;
    linhThach: number;
    dinhThanDan?: number;       // Định Thần Đan (tùy chọn)
  };
  breakthroughCost: {
    tuVi: number;
    linhThach: number;
    dinhThanDan: number;
  };
}

export const SOUL_REALMS_CONFIG: SoulRealmConfig[] = [
  {
    realmIndex: 0,
    name: 'Hóa Niệm Cảnh',
    tagline: 'Ý niệm ngưng đọng, cảm ứng vi trần.',
    description: 'Tâm niệm khai thông, thức hải gợn sóng, có thể phóng thần niệm cảm ứng chu vi trăm trượng.',
    badgeClass: 'text-indigo-300 border-indigo-600/40 bg-indigo-950/40',
    glowColor: 'indigo',
    icon: '🔮',
    baseSoulBonus: 35,
    soulPerLevel: 15,
    baseSpeedBonus: 4,
    speedPerLevel: 1,
    critRatePerLevel: 0.3,
    soulSuppression: false,
    alchemyBonusPercent: 2,
    secretRealmBonusPercent: 3,
    costPerLevel: { tuVi: 500, linhThach: 120, dinhThanDan: 0 },
    breakthroughCost: { tuVi: 2000, linhThach: 500, dinhThanDan: 1 }
  },
  {
    realmIndex: 1,
    name: 'Du Thần Cảnh',
    tagline: 'Thần du phương ngoại, xuất khiếu tiêu dao.',
    description: 'Thần niệm ngưng tụ có thể ly thể du ngoạn ngắn ngủi, tốc độ phản xạ và linh giác tăng vọt.',
    badgeClass: 'text-blue-300 border-blue-600/40 bg-blue-950/40',
    glowColor: 'blue',
    icon: '🌀',
    baseSoulBonus: 180,
    soulPerLevel: 45,
    baseSpeedBonus: 12,
    speedPerLevel: 2,
    critRatePerLevel: 0.4,
    soulSuppression: false,
    alchemyBonusPercent: 4,
    secretRealmBonusPercent: 6,
    costPerLevel: { tuVi: 1600, linhThach: 350, dinhThanDan: 0 },
    breakthroughCost: { tuVi: 6000, linhThach: 1200, dinhThanDan: 1 }
  },
  {
    realmIndex: 2,
    name: 'Ngưng Hồn Cảnh',
    tagline: 'Hồn phách ngưng tụ, hóa hình bản nguyên.',
    description: 'Thần hồn ngưng tụ thành thực thể hư ảo trong thức hải, đòn đánh ẩn chứa thần niệm công kích.',
    badgeClass: 'text-violet-400 border-violet-600/40 bg-violet-950/40',
    glowColor: 'violet',
    icon: '🌌',
    baseSoulBonus: 550,
    soulPerLevel: 110,
    baseSpeedBonus: 25,
    speedPerLevel: 3,
    critRatePerLevel: 0.5,
    soulSuppression: false,
    alchemyBonusPercent: 7,
    secretRealmBonusPercent: 10,
    costPerLevel: { tuVi: 4500, linhThach: 800, dinhThanDan: 1 },
    breakthroughCost: { tuVi: 16000, linhThach: 3000, dinhThanDan: 2 }
  },
  {
    realmIndex: 3,
    name: 'Dạ Du Cảnh',
    tagline: 'Đêm tối du ngoạn, ngự phong vô tung.',
    description: 'Thần hồn xuất khiếu du hành tự do trong màn đêm, không sợ gió lạnh âm sát của nhân gian.',
    badgeClass: 'text-purple-400 border-purple-600/50 bg-purple-950/40',
    glowColor: 'purple',
    icon: '🌙',
    baseSoulBonus: 1450,
    soulPerLevel: 250,
    baseSpeedBonus: 45,
    speedPerLevel: 4,
    critRatePerLevel: 0.6,
    soulSuppression: false,
    alchemyBonusPercent: 10,
    secretRealmBonusPercent: 14,
    costPerLevel: { tuVi: 12000, linhThach: 2000, dinhThanDan: 1 },
    breakthroughCost: { tuVi: 40000, linhThach: 7000, dinhThanDan: 3 }
  },
  {
    realmIndex: 4,
    name: 'Nhật Du Cảnh',
    tagline: 'Giữa trưa tắm nắng, dương khí không tàn.',
    description: 'Thần hồn không còn e sợ ánh sáng mặt trời chí dương, có thể hiển hóa can thiệp vật chất trần thế.',
    badgeClass: 'text-amber-300 border-amber-500/50 bg-amber-950/40',
    glowColor: 'amber',
    icon: '☀️',
    baseSoulBonus: 3500,
    soulPerLevel: 550,
    baseSpeedBonus: 75,
    speedPerLevel: 5,
    critRatePerLevel: 0.7,
    soulSuppression: true, // Bắt đầu mở khóa Thần Niệm Chấn Nhiếp!
    alchemyBonusPercent: 14,
    secretRealmBonusPercent: 18,
    costPerLevel: { tuVi: 30000, linhThach: 5000, dinhThanDan: 2 },
    breakthroughCost: { tuVi: 100000, linhThach: 16000, dinhThanDan: 4 }
  },
  {
    realmIndex: 5,
    name: 'Đoạt Xá Cảnh',
    tagline: 'Phách thể phân ly, đoạt thiên cải mệnh.',
    description: 'Thần hồn cường đại đến cực hạn, thức hải bao la như biển cả, mở khóa uy áp chấn nhiếp linh hồn kẻ thù.',
    badgeClass: 'text-fuchsia-400 border-fuchsia-500/60 bg-fuchsia-950/50 shadow-[0_0_10px_rgba(217,70,239,0.3)]',
    glowColor: 'fuchsia',
    icon: '👁️',
    baseSoulBonus: 8200,
    soulPerLevel: 1200,
    baseSpeedBonus: 115,
    speedPerLevel: 7,
    critRatePerLevel: 0.8,
    soulSuppression: true,
    alchemyBonusPercent: 18,
    secretRealmBonusPercent: 22,
    costPerLevel: { tuVi: 70000, linhThach: 12000, dinhThanDan: 2 },
    breakthroughCost: { tuVi: 240000, linhThach: 38000, dinhThanDan: 5 }
  },
  {
    realmIndex: 6,
    name: 'Phân Thần Cảnh',
    tagline: 'Hóa thân ngàn vạn, nhất niệm sinh diệt.',
    description: 'Một niệm phân hóa thành hàng trăm phân thân ý chí, nhìn thấu toàn bộ sơ hở và cạm bẫy tam giới.',
    badgeClass: 'text-pink-300 border-pink-500/60 bg-pink-950/50 shadow-[0_0_12px_rgba(244,114,182,0.35)]',
    glowColor: 'pink',
    icon: '👥',
    baseSoulBonus: 18500,
    soulPerLevel: 2500,
    baseSpeedBonus: 165,
    speedPerLevel: 9,
    critRatePerLevel: 1.0,
    soulSuppression: true,
    alchemyBonusPercent: 22,
    secretRealmBonusPercent: 26,
    costPerLevel: { tuVi: 160000, linhThach: 28000, dinhThanDan: 3 },
    breakthroughCost: { tuVi: 550000, linhThach: 85000, dinhThanDan: 7 }
  },
  {
    realmIndex: 7,
    name: 'Thần Minh Cảnh',
    tagline: 'Thức hải vô nhai, niệm hóa thiên lôi.',
    description: 'Thần niệm chuyển động dẫn khởi sấm sét thiên địa, uy áp giáng xuống khiến vạn linh quỳ rạp phủ phục.',
    badgeClass: 'text-cyan-300 border-cyan-400/70 bg-cyan-950/60 shadow-[0_0_15px_rgba(34,211,238,0.4)]',
    glowColor: 'cyan',
    icon: '⚡',
    baseSoulBonus: 42000,
    soulPerLevel: 5500,
    baseSpeedBonus: 230,
    speedPerLevel: 11,
    critRatePerLevel: 1.2,
    soulSuppression: true,
    alchemyBonusPercent: 26,
    secretRealmBonusPercent: 30,
    costPerLevel: { tuVi: 380000, linhThach: 65000, dinhThanDan: 4 },
    breakthroughCost: { tuVi: 1200000, linhThach: 180000, dinhThanDan: 10 }
  },
  {
    realmIndex: 8,
    name: 'Bất Hủ Hồn Tôn',
    tagline: 'Hồn nhập hư vô, vĩnh hằng bất diệt.',
    description: 'Thần hồn ký thác thiên đạo, vạn kiếp bất ma, siêu thoát luân hồi ngũ hành, chí tôn hồn tu!',
    badgeClass: 'text-yellow-200 border-amber-300/80 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 shadow-[0_0_20px_rgba(250,204,21,0.45)]',
    glowColor: 'yellow',
    icon: '👑',
    baseSoulBonus: 95000,
    soulPerLevel: 12000,
    baseSpeedBonus: 320,
    speedPerLevel: 14,
    critRatePerLevel: 1.5,
    soulSuppression: true,
    alchemyBonusPercent: 35,
    secretRealmBonusPercent: 40,
    costPerLevel: { tuVi: 850000, linhThach: 140000, dinhThanDan: 5 },
    breakthroughCost: { tuVi: 3000000, linhThach: 450000, dinhThanDan: 15 }
  }
];

// ============================================
// 3. FACTORY HÀM KHỞI TẠO STATE MẶC ĐỊNH
// ============================================
export function createDefaultBodyRefinement(): BodyRefinementState {
  return {
    realmIndex: 0,
    level: 1,
    currentExp: 0,
    maxExp: 100
  };
}

export function createDefaultSoulCultivation(): SoulCultivationState {
  return {
    realmIndex: 0,
    level: 1,
    currentExp: 0,
    maxExp: 100
  };
}

// ============================================
// 4. HÀM TÍNH TOÁN CHỈ SỐ GIA TRÌ
// ============================================
export function getBodyRefinementStats(body?: BodyRefinementState | null): {
  hpBonus: number;
  defBonus: number;
  dmgReduction: number;
  hpRegenPercent: number;
  realmName: string;
  fullTitle: string;
  isMaxLevel: boolean;
  config: BodyRealmConfig;
} {
  const b = body || createDefaultBodyRefinement();
  const cfg = BODY_REALMS_CONFIG[Math.min(b.realmIndex, BODY_REALMS_CONFIG.length - 1)];
  const lvl = Math.min(9, Math.max(1, b.level));

  const hpBonus = cfg.baseHpBonus + (lvl - 1) * cfg.hpPerLevel;
  const defBonus = cfg.baseDefBonus + (lvl - 1) * cfg.defPerLevel;
  const dmgReduction = Math.min(35, parseFloat(((lvl * cfg.dmgReductionPerLevel) + (b.realmIndex * 1.5)).toFixed(1)));
  const hpRegenPercent = cfg.hpRegenPercent;

  return {
    hpBonus,
    defBonus,
    dmgReduction,
    hpRegenPercent,
    realmName: cfg.name,
    fullTitle: `${cfg.name} (Tầng ${lvl})`,
    isMaxLevel: b.realmIndex >= BODY_REALMS_CONFIG.length - 1 && lvl >= 9,
    config: cfg
  };
}

export function getSoulCultivationStats(soul?: SoulCultivationState | null): {
  soulBonus: number;
  speedBonus: number;
  critRateBonus: number;
  soulSuppression: boolean;
  realmName: string;
  fullTitle: string;
  isMaxLevel: boolean;
  alchemyBonusPercent: number;
  secretRealmBonusPercent: number;
  config: SoulRealmConfig;
} {
  const s = soul || createDefaultSoulCultivation();
  const cfg = SOUL_REALMS_CONFIG[Math.min(s.realmIndex, SOUL_REALMS_CONFIG.length - 1)];
  const lvl = Math.min(9, Math.max(1, s.level));

  const soulBonus = cfg.baseSoulBonus + (lvl - 1) * cfg.soulPerLevel;
  const speedBonus = cfg.baseSpeedBonus + (lvl - 1) * cfg.speedPerLevel;
  const critRateBonus = Math.min(30, parseFloat(((lvl * cfg.critRatePerLevel) + (s.realmIndex * 0.8)).toFixed(1)));

  return {
    soulBonus,
    speedBonus,
    critRateBonus,
    soulSuppression: cfg.soulSuppression,
    realmName: cfg.name,
    fullTitle: `${cfg.name} (Tầng ${lvl})`,
    isMaxLevel: s.realmIndex >= SOUL_REALMS_CONFIG.length - 1 && lvl >= 9,
    alchemyBonusPercent: cfg.alchemyBonusPercent,
    secretRealmBonusPercent: cfg.secretRealmBonusPercent,
    config: cfg
  };
}

// ============================================
// 5. LOGIC NÂNG CẤP & ĐỘT PHÁ
// ============================================

/**
 * Kiểm tra điều kiện tôi thể nhục thân
 */
export function canUpgradeBodyRefinement(player: PlayerStats): {
  canUpgrade: boolean;
  isBreakthrough: boolean;
  reason: string;
  successRate: number;
  cost: {
    tinhHuyet: number;
    linhThach: number;
    khiHuyetDan: number;
  };
} {
  const body = player.bodyRefinement || createDefaultBodyRefinement();
  const cfg = BODY_REALMS_CONFIG[Math.min(body.realmIndex, BODY_REALMS_CONFIG.length - 1)];
  const isBreakthrough = body.level >= 9;

  if (body.realmIndex >= BODY_REALMS_CONFIG.length - 1 && isBreakthrough) {
    return {
      canUpgrade: false,
      isBreakthrough: false,
      reason: 'Đã đạt tới Hỗn Độn Bá Thể tầng cao nhất!',
      successRate: 0,
      cost: { tinhHuyet: 0, linhThach: 0, khiHuyetDan: 0 }
    };
  }

  const cost = isBreakthrough
    ? cfg.breakthroughCost
    : { ...cfg.costPerLevel, khiHuyetDan: cfg.costPerLevel.khiHuyetDan || 0 };

  const curTinhHuyet = player.tinhHuyetYeuThu || 0;
  const curLinhThach = player.linhThach || 0;
  const khiHuyetPillCount = (player.inventory?.pills || [])
    .filter(p => p.id === 'pill_khi_huyet' || p.name.includes('Khí Huyết'))
    .reduce((sum, p) => sum + p.quantity, 0);

  // Tỉ lệ thành công: thăng tầng 100%, đột phá dựa trên Căn Cốt
  const canCot = player.canCot || 50;
  const successRate = isBreakthrough
    ? Math.min(95, Math.max(50, Math.floor(65 + canCot * 0.25)))
    : 100;

  if (curTinhHuyet < cost.tinhHuyet) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${cost.tinhHuyet - curTinhHuyet} Tinh Huyết Yêu Thú!`,
      successRate,
      cost
    };
  }

  if (curLinhThach < cost.linhThach) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${(cost.linhThach - curLinhThach).toLocaleString()} Linh Thạch!`,
      successRate,
      cost
    };
  }

  if (cost.khiHuyetDan > 0 && khiHuyetPillCount < cost.khiHuyetDan) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${cost.khiHuyetDan - khiHuyetPillCount} Khí Huyết Đan!`,
      successRate,
      cost
    };
  }

  return {
    canUpgrade: true,
    isBreakthrough,
    reason: isBreakthrough ? 'Sẵn sàng tiến hành Huyết Khí Thí Luyện!' : 'Đủ điều kiện Tôi Thể Thăng Tầng!',
    successRate,
    cost
  };
}

/**
 * Thực hiện tôi thể nhục thân
 */
export function performUpgradeBodyRefinement(player: PlayerStats): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  isBreakthrough: boolean;
} {
  const check = canUpgradeBodyRefinement(player);
  if (!check.canUpgrade) {
    return {
      success: false,
      updatedPlayer: player,
      message: check.reason,
      isBreakthrough: check.isBreakthrough
    };
  }

  const body = player.bodyRefinement || createDefaultBodyRefinement();
  const isBreakthrough = check.isBreakthrough;
  const cost = check.cost;

  // Khấu trừ tài nguyên
  const newTinhHuyet = Math.max(0, (player.tinhHuyetYeuThu || 0) - cost.tinhHuyet);
  const newLinhThach = Math.max(0, player.linhThach - cost.linhThach);

  // Khấu trừ Khí Huyết Đan (nếu cần)
  let updatedPills = [...(player.inventory?.pills || [])];
  if (cost.khiHuyetDan > 0) {
    let remaining = cost.khiHuyetDan;
    for (const p of updatedPills) {
      if (remaining <= 0) break;
      if (p.id === 'pill_khi_huyet' || p.name.includes('Khí Huyết')) {
        const take = Math.min(p.quantity, remaining);
        p.quantity -= take;
        remaining -= take;
      }
    }
    updatedPills = updatedPills.filter(p => p.quantity > 0);
  }

  // Nếu là đột phá: kiểm tra tỉ lệ thành công
  if (isBreakthrough) {
    const roll = Math.random() * 100;
    const isSuccess = roll <= check.successRate;

    if (!isSuccess) {
      const updatedPlayer: PlayerStats = {
        ...player,
        tinhHuyetYeuThu: newTinhHuyet,
        linhThach: newLinhThach,
        inventory: {
          ...(player.inventory || { herbs: [], ores: [] }),
          pills: updatedPills
        }
      };
      return {
        success: false,
        updatedPlayer,
        message: `Huyết khí bạo tẩu, đột phá thất bại! (Tỉ lệ: ${check.successRate}%). Đạo hữu hãy điều hòa khí tức tái chiến!`,
        isBreakthrough: true
      };
    }

    // Đột phá thành công -> lên đại cảnh giới tiếp theo, level = 1
    const nextRealm = Math.min(BODY_REALMS_CONFIG.length - 1, body.realmIndex + 1);
    const updatedBody: BodyRefinementState = {
      realmIndex: nextRealm,
      level: 1,
      currentExp: 0,
      maxExp: 100
    };

    const nextCfg = BODY_REALMS_CONFIG[nextRealm];
    const updatedPlayer: PlayerStats = {
      ...player,
      tinhHuyetYeuThu: newTinhHuyet,
      linhThach: newLinhThach,
      inventory: {
        ...(player.inventory || { herbs: [], ores: [] }),
        pills: updatedPills
      },
      bodyRefinement: updatedBody
    };

    return {
      success: true,
      updatedPlayer,
      message: `🎉 Vượt qua Huyết Khí Thí Luyện! Nhục Thân đại phá cảnh giới: [${nextCfg.name}]!`,
      isBreakthrough: true
    };
  }

  // Thăng tầng bình thường: level + 1
  const updatedBody: BodyRefinementState = {
    ...body,
    level: body.level + 1
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    tinhHuyetYeuThu: newTinhHuyet,
    linhThach: newLinhThach,
    inventory: {
      ...(player.inventory || { herbs: [], ores: [] }),
      pills: updatedPills
    },
    bodyRefinement: updatedBody
  };

  const cfg = BODY_REALMS_CONFIG[body.realmIndex];
  return {
    success: true,
    updatedPlayer,
    message: `💪 Tôi thể thành công! Nhục Thân đạt [${cfg.name} - Tầng ${updatedBody.level}]!`,
    isBreakthrough: false
  };
}

/**
 * Kiểm tra điều kiện ngưng hồn thần thức
 */
export function canUpgradeSoulCultivation(player: PlayerStats): {
  canUpgrade: boolean;
  isBreakthrough: boolean;
  reason: string;
  successRate: number;
  cost: {
    tuVi: number;
    linhThach: number;
    dinhThanDan: number;
  };
} {
  const soul = player.soulCultivation || createDefaultSoulCultivation();
  const cfg = SOUL_REALMS_CONFIG[Math.min(soul.realmIndex, SOUL_REALMS_CONFIG.length - 1)];
  const isBreakthrough = soul.level >= 9;

  if (soul.realmIndex >= SOUL_REALMS_CONFIG.length - 1 && isBreakthrough) {
    return {
      canUpgrade: false,
      isBreakthrough: false,
      reason: 'Đã đạt tới Bất Hủ Hồn Tôn tầng cao nhất!',
      successRate: 0,
      cost: { tuVi: 0, linhThach: 0, dinhThanDan: 0 }
    };
  }

  const cost = isBreakthrough
    ? cfg.breakthroughCost
    : { ...cfg.costPerLevel, dinhThanDan: cfg.costPerLevel.dinhThanDan || 0 };

  const curTuVi = player.tuVi || 0;
  const curLinhThach = player.linhThach || 0;
  const dinhThanPillCount = (player.inventory?.pills || [])
    .filter(p => p.id === 'pill_dinh_than' || p.name.includes('Định Thần') || p.name.includes('U Hồn'))
    .reduce((sum, p) => sum + p.quantity, 0);

  // Tỉ lệ thành công: thăng tầng 100%, đột phá dựa trên Tâm Cảnh & Ngộ Tính
  const tamCanh = player.tamCanh || 50;
  const ngoTinh = player.ngoTinh || 50;
  const successRate = isBreakthrough
    ? Math.min(95, Math.max(50, Math.floor(60 + (tamCanh * 0.2) + (ngoTinh * 0.15))))
    : 100;

  if (curTuVi < cost.tuVi) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${(cost.tuVi - curTuVi).toLocaleString()} Tu Vi để tôi luyện Thần Thức!`,
      successRate,
      cost
    };
  }

  if (curLinhThach < cost.linhThach) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${(cost.linhThach - curLinhThach).toLocaleString()} Linh Thạch!`,
      successRate,
      cost
    };
  }

  if (cost.dinhThanDan > 0 && dinhThanPillCount < cost.dinhThanDan) {
    return {
      canUpgrade: false,
      isBreakthrough,
      reason: `Thiếu ${cost.dinhThanDan - dinhThanPillCount} Định Thần Đan!`,
      successRate,
      cost
    };
  }

  return {
    canUpgrade: true,
    isBreakthrough,
    reason: isBreakthrough ? 'Sẵn sàng tiến hành Ngưng Hồn Thăng Hoa!' : 'Đủ điều kiện Ngưng Hồn Thăng Tầng!',
    successRate,
    cost
  };
}

/**
 * Thực hiện ngưng hồn thần thức
 */
export function performUpgradeSoulCultivation(player: PlayerStats): {
  success: boolean;
  updatedPlayer: PlayerStats;
  message: string;
  isBreakthrough: boolean;
} {
  const check = canUpgradeSoulCultivation(player);
  if (!check.canUpgrade) {
    return {
      success: false,
      updatedPlayer: player,
      message: check.reason,
      isBreakthrough: check.isBreakthrough
    };
  }

  const soul = player.soulCultivation || createDefaultSoulCultivation();
  const isBreakthrough = check.isBreakthrough;
  const cost = check.cost;

  // Khấu trừ tài nguyên
  const newTuVi = Math.max(0, player.tuVi - cost.tuVi);
  const newLinhThach = Math.max(0, player.linhThach - cost.linhThach);

  // Khấu trừ Định Thần Đan (nếu có)
  let updatedPills = [...(player.inventory?.pills || [])];
  if (cost.dinhThanDan > 0) {
    let remaining = cost.dinhThanDan;
    for (const p of updatedPills) {
      if (remaining <= 0) break;
      if (p.id === 'pill_dinh_than' || p.name.includes('Định Thần') || p.name.includes('U Hồn')) {
        const take = Math.min(p.quantity, remaining);
        p.quantity -= take;
        remaining -= take;
      }
    }
    updatedPills = updatedPills.filter(p => p.quantity > 0);
  }

  // Đột phá
  if (isBreakthrough) {
    const roll = Math.random() * 100;
    const isSuccess = roll <= check.successRate;

    if (!isSuccess) {
      const updatedPlayer: PlayerStats = {
        ...player,
        tuVi: newTuVi,
        linhThach: newLinhThach,
        inventory: {
          ...(player.inventory || { herbs: [], ores: [] }),
          pills: updatedPills
        }
      };
      return {
        success: false,
        updatedPlayer,
        message: `Thức hải chao đảo, ngưng hồn thất bại! (Tỉ lệ: ${check.successRate}%). Đạo hữu hãy bình tâm tịnh khí!`,
        isBreakthrough: true
      };
    }

    const nextRealm = Math.min(SOUL_REALMS_CONFIG.length - 1, soul.realmIndex + 1);
    const updatedSoul: SoulCultivationState = {
      realmIndex: nextRealm,
      level: 1,
      currentExp: 0,
      maxExp: 100
    };

    const nextCfg = SOUL_REALMS_CONFIG[nextRealm];
    const updatedPlayer: PlayerStats = {
      ...player,
      tuVi: newTuVi,
      linhThach: newLinhThach,
      inventory: {
        ...(player.inventory || { herbs: [], ores: [] }),
        pills: updatedPills
      },
      soulCultivation: updatedSoul
    };

    return {
      success: true,
      updatedPlayer,
      message: `✨ Thần niệm viên mãn! Thần Hồn đột phá đại cảnh giới: [${nextCfg.name}]!`,
      isBreakthrough: true
    };
  }

  // Thăng tầng bình thường
  const updatedSoul: SoulCultivationState = {
    ...soul,
    level: soul.level + 1
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    tuVi: newTuVi,
    linhThach: newLinhThach,
    inventory: {
      ...(player.inventory || { herbs: [], ores: [] }),
      pills: updatedPills
    },
    soulCultivation: updatedSoul
  };

  const cfg = SOUL_REALMS_CONFIG[soul.realmIndex];
  return {
    success: true,
    updatedPlayer,
    message: `🔮 Thức hải ngưng tụ! Thần Hồn đạt [${cfg.name} - Tầng ${updatedSoul.level}]!`,
    isBreakthrough: false
  };
}
