// lib/realm-visuals-data.ts
// Hệ thống định nghĩa thông số & hiệu ứng hoạt họa độc nhất cho từng cảnh giới tu chân

import realmsData from '@/data/realms-data.json';

export type AuraIntensity = 'low' | 'medium' | 'high' | 'supreme';
export type RealmSpecialEffect =
  | 'leaves'
  | 'vortex'
  | 'swords'
  | 'taichi'
  | 'nebula'
  | 'runes'
  | 'pulse'
  | 'daotai'
  | 'jindan'
  | 'nascent'
  | 'phaptuong';

export interface RealmVisualConfig {
  realmIndex: number;
  themeColor: string;          // Màu chủ đạo (hex/rgb)
  subColor?: string;           // Màu phụ trợ (ánh hào quang / tia sáng)
  ambientParticleCount: number;
  auraIntensity: AuraIntensity;
  specialEffect: RealmSpecialEffect;
  badgeTitle: string;
  description: string;
  realmName: string;           // Tên chuẩn của cảnh giới
  stageCategory: string;       // Phân loại đại cảnh giới
}

/**
 * Cấu hình chi tiết cho 31 cảnh giới đầu tiên (Index 0 đến 30):
 * - Index 0: Phàm Nhân
 * - Index 1 - 10: Luyện Khí Tầng 1 đến Viên Mãn
 * - Index 11 - 15: Trúc Cơ (Sơ Kỳ đến Đại Viên Mãn)
 * - Index 16 - 20: Kim Đan (Sơ Kỳ đến Đại Viên Mãn)
 * - Index 21 - 25: Nguyên Anh (Sơ Kỳ đến Đại Viên Mãn)
 * - Index 26 - 30: Hóa Thần (Sơ Kỳ đến Đại Viên Mãn)
 * Thiết kế Zero-Asset: Tối ưu cho Render SVG & Vector Shaders
 */
export const REALM_VISUALS_DATA: Record<number, RealmVisualConfig> = {
  // Cảnh giới 0: Phàm Nhân (Sơn Thôn Mộc Mạc)
  0: {
    realmIndex: 0,
    themeColor: '#78716c', // Nâu xám mộc mạc
    subColor: '#57534e',
    ambientParticleCount: 8,
    auraIntensity: 'low',
    specialEffect: 'leaves',
    badgeTitle: 'Sơn Thôn Mộc Mạc',
    realmName: 'Phàm Nhân',
    stageCategory: 'Phàm Trần',
    description: 'Bóng dáng phàm nhân ngồi xếp bằng dưới gốc tùng cổ thụ, gió núi khẽ thổi, lá rơi lơ lửng chậm rãi, chưa có linh quang đan điền.'
  },

  // Cảnh giới 1: Luyện Khí Tầng 1 (Dẫn Khí Sơ Khai)
  1: {
    realmIndex: 1,
    themeColor: '#e2e8f0', // Trắng bạc thanh khiết
    subColor: '#94a3b8',
    ambientParticleCount: 12,
    auraIntensity: 'low',
    specialEffect: 'pulse',
    badgeTitle: 'Dẫn Khí Sơ Khai',
    realmName: 'Luyện Khí Tầng 1',
    stageCategory: 'Luyện Khí',
    description: 'Một luồng bạch khí mờ nhạt từ bốn phương chậm rãi xoay tròn hội tụ về huyệt Đan Điền.'
  },

  // Cảnh giới 2: Luyện Khí Tầng 2 (Kinh Mạch Khai Thông)
  2: {
    realmIndex: 2,
    themeColor: '#38bdf8', // Xanh lam ngọc nhạt
    subColor: '#0284c7',
    ambientParticleCount: 14,
    auraIntensity: 'medium',
    specialEffect: 'runes',
    badgeTitle: 'Kinh Mạch Khai Thông',
    realmName: 'Luyện Khí Tầng 2',
    stageCategory: 'Luyện Khí',
    description: 'Hai luồng linh khí dạng sợi xoắn ốc (double helix) bao quanh thân thể, đan điền phát sáng nhịp thở (breathing pulse).'
  },

  // Cảnh giới 3: Luyện Khí Tầng 3 (Thổ Nạp Tiểu Thành)
  3: {
    realmIndex: 3,
    themeColor: '#10b981', // Lục bảo thanh u
    subColor: '#059669',
    ambientParticleCount: 16,
    auraIntensity: 'medium',
    specialEffect: 'pulse',
    badgeTitle: 'Thổ Nạp Tiểu Thành',
    realmName: 'Luyện Khí Tầng 3',
    stageCategory: 'Luyện Khí',
    description: 'Vòng tròn linh khí dưới chân xoay nhẹ, các hạt linh tử phát sáng bay từ dưới đất thăng hoa lên trời.'
  },

  // Cảnh giới 4: Luyện Khí Tầng 4 (Linh Áp Sơ Hiện)
  4: {
    realmIndex: 4,
    themeColor: '#06b6d4', // Lam ngọc đậm (Cyan)
    subColor: '#0891b2',
    ambientParticleCount: 18,
    auraIntensity: 'medium',
    specialEffect: 'runes',
    badgeTitle: 'Linh Áp Sơ Hiện',
    realmName: 'Luyện Khí Tầng 4',
    stageCategory: 'Luyện Khí',
    description: 'Đột phá bình cảnh sơ kỳ, xuất hiện vầng hào quang bát quái mờ ảo dưới tọa thiền, sóng linh áp lan tỏa từng đợt gợn sóng (ripple wave).'
  },

  // Cảnh giới 5: Luyện Khí Tầng 5 (Ngũ Tạng Tụ Khí)
  5: {
    realmIndex: 5,
    themeColor: '#3b82f6', // Lam bảo phối ánh vàng nhạt
    subColor: '#fbbf24',
    ambientParticleCount: 20,
    auraIntensity: 'medium',
    specialEffect: 'pulse',
    badgeTitle: 'Ngũ Tạng Tụ Khí',
    realmName: 'Luyện Khí Tầng 5',
    stageCategory: 'Luyện Khí',
    description: '5 điểm quang hoa tương ứng ngũ tạng phát sáng theo nhịp điệu luân chuyển ngũ hành.'
  },

  // Cảnh giới 6: Luyện Khí Tầng 6 (Thần Thức Sơ Khai)
  6: {
    realmIndex: 6,
    themeColor: '#8b5cf6', // Tím thạch anh lam (Indigo/Violet)
    subColor: '#6366f1',
    ambientParticleCount: 22,
    auraIntensity: 'high',
    specialEffect: 'nebula',
    badgeTitle: 'Thần Thức Sơ Khai',
    realmName: 'Luyện Khí Tầng 6',
    stageCategory: 'Luyện Khí',
    description: 'Mi tâm (trán) phát ra vầng sáng thần niệm nhấp nháy, linh vụ bao bọc thân hình mờ ảo.'
  },

  // Cảnh giới 7: Luyện Khí Tầng 7 (Ngưng Khí Hóa Hình)
  7: {
    realmIndex: 7,
    themeColor: '#a855f7', // Tím hoàng gia rực rỡ
    subColor: '#c084fc',
    ambientParticleCount: 24,
    auraIntensity: 'high',
    specialEffect: 'swords',
    badgeTitle: 'Ngưng Khí Hóa Hình',
    realmName: 'Luyện Khí Tầng 7',
    stageCategory: 'Luyện Khí',
    description: 'Linh khí đậm đặc bắt đầu biến hóa thành hư ảnh các thanh phi kiếm tí hon xoay quanh hộ thể.'
  },

  // Cảnh giới 8: Luyện Khí Tầng 8 (Chu Thiên Vạn Triệt)
  8: {
    realmIndex: 8,
    themeColor: '#f59e0b', // Hổ phách kim quang phối tử khí
    subColor: '#9333ea',
    ambientParticleCount: 28,
    auraIntensity: 'high',
    specialEffect: 'vortex',
    badgeTitle: 'Chu Thiên Vạn Triệt',
    realmName: 'Luyện Khí Tầng 8',
    stageCategory: 'Luyện Khí',
    description: 'Vòng xoáy linh khí tốc độ cao (vortex), kinh mạch toàn thân phát sáng thành mạng lưới kim quang rực rỡ.'
  },

  // Cảnh giới 9: Luyện Khí Tầng 9 (Đỉnh Phong Cực Cảnh)
  9: {
    realmIndex: 9,
    themeColor: '#eab308', // Vàng kim rực lửa đan xen ngũ sắc
    subColor: '#ef4444',
    ambientParticleCount: 32,
    auraIntensity: 'supreme',
    specialEffect: 'taichi',
    badgeTitle: 'Đỉnh Phong Cực Cảnh',
    realmName: 'Luyện Khí Tầng 9',
    stageCategory: 'Luyện Khí',
    description: 'Linh khí nén cực, tiên cơ sơ hiện, chỉ còn một bước nữa là viên mãn, cửa Trúc Cơ chực sẵn đón.'
  },

  // Cảnh giới 10: Luyện Khí Viên Mãn (Tiên Cơ Viên Mãn • Trúc Cơ Chực Sẵn)
  10: {
    realmIndex: 10,
    themeColor: '#f59e0b', // Hoàng kim ngũ sắc - mồi lửa hào quang
    subColor: '#a855f7',
    ambientParticleCount: 36,
    auraIntensity: 'supreme',
    specialEffect: 'taichi',
    badgeTitle: 'Tiên Cơ Viên Mãn',
    realmName: 'Luyện Khí Viên Mãn',
    stageCategory: 'Luyện Khí',
    description: 'Vầng thái cực đồ xoay vần phía sau lưng, linh khí nén thành giọt dịch lơ lửng, hào quang bùng nổ chực chờ ngưng tụ Trúc Cơ Đạo Đài.'
  },

  // ==========================================================
  // ĐẠI CẢNH GIỚI: TRÚC CƠ (INDEX 11 - 15)
  // Ý niệm: Khí Hóa Dịch, đan điền hóa hải, đúc kết Bát Giác Đạo Đài.
  // Tông màu: Xanh ngọc bích (Emerald) phối Lam thanh thiên & Hoàng kim.
  // ==========================================================
  11: {
    realmIndex: 11,
    themeColor: '#10b981', // Xanh ngọc bích
    subColor: '#38bdf8',  // Lam thanh thiên
    ambientParticleCount: 22,
    auraIntensity: 'medium',
    specialEffect: 'daotai',
    badgeTitle: 'Đạo Đài Sơ Khai',
    realmName: 'Trúc Cơ Sơ Kỳ',
    stageCategory: 'Trúc Cơ',
    description: 'Linh khí ngưng tụ thành dịch thể, dưới tọa thiền đúc kết Bát Giác Đạo Đài vững như bàn thạch, khí hải sơ thành.'
  },

  12: {
    realmIndex: 12,
    themeColor: '#059669', // Ngọc bích sẫm
    subColor: '#06b6d4',  // Lam ngọc
    ambientParticleCount: 24,
    auraIntensity: 'medium',
    specialEffect: 'daotai',
    badgeTitle: 'Linh Dịch Hóa Hải',
    realmName: 'Trúc Cơ Trung Kỳ',
    stageCategory: 'Trúc Cơ',
    description: 'Đan điền mênh mông như biển hồ, các luồng linh dịch ngọc bích bốc lên xoay vần liên miên bất tuyệt quanh thân.'
  },

  13: {
    realmIndex: 13,
    themeColor: '#047857', // Ngọc lục bảo hoàng cung
    subColor: '#22d3ee',  // Thanh thiên linh quang
    ambientParticleCount: 26,
    auraIntensity: 'high',
    specialEffect: 'daotai',
    badgeTitle: 'Cửu Trọng Đạo Đài',
    realmName: 'Trúc Cơ Hậu Kỳ',
    stageCategory: 'Trúc Cơ',
    description: 'Bát giác đạo đài xếp tầng kiên cố, cột trụ linh quang lam ngọc chiếu rọi kinh mạch thông suốt từ đỉnh đầu xuống đan điền.'
  },

  14: {
    realmIndex: 14,
    themeColor: '#10b981', // Lục bảo kim quang
    subColor: '#fbbf24',  // Viền vàng nhạt
    ambientParticleCount: 28,
    auraIntensity: 'high',
    specialEffect: 'daotai',
    badgeTitle: 'Chân Nguyên Quán Đỉnh',
    realmName: 'Trúc Cơ Đỉnh Phong',
    stageCategory: 'Trúc Cơ',
    description: 'Khí quán thông thiên, cột trụ linh quang xuyên thấu đỉnh đầu, chân nguyên cuồn cuộn sôi trào chực chờ ngưng kết Kim Đan.'
  },

  15: {
    realmIndex: 15,
    themeColor: '#059669', // Hoàng ngọc bích cực cảnh
    subColor: '#f59e0b',  // Hoàng kim rực rỡ
    ambientParticleCount: 30,
    auraIntensity: 'supreme',
    specialEffect: 'daotai',
    badgeTitle: 'Thiên Đạo Trúc Cơ',
    realmName: 'Trúc Cơ Đại Viên Mãn',
    stageCategory: 'Trúc Cơ',
    description: 'Viên mãn vô hạ đạo cơ, vạn giọt linh dịch ngọc bích xoáy cuộn tốc độ cao, hào quang vạn trượng chực chờ ngưng tụ Kim Đan.'
  },

  // ==========================================================
  // ĐẠI CẢNH GIỚI: KIM ĐAN (INDEX 16 - 20)
  // Ý niệm: Ngưng Kim Đan, cửu chuyển đan văn, kim quang chói lọi, đan hỏa rực cháy.
  // Tông màu: Hoàng Kim Đế Vương (Amber / Imperial Gold) phối Đan Hỏa Xích Hồng (Crimson).
  // ==========================================================
  16: {
    realmIndex: 16,
    themeColor: '#f59e0b', // Hoàng kim đế vương
    subColor: '#ef4444',  // Đan hỏa xích hồng
    ambientParticleCount: 26,
    auraIntensity: 'high',
    specialEffect: 'jindan',
    badgeTitle: 'Nhất Lạp Kim Đan',
    realmName: 'Kim Đan Sơ Kỳ',
    stageCategory: 'Kim Đan',
    description: 'Vạn giọt linh dịch kết tinh thành khối cầu Kim Đan hoàng kim lơ lửng nơi đan điền, đan hỏa chân hỏa tôi luyện bất hoại.'
  },

  17: {
    realmIndex: 17,
    themeColor: '#eab308', // Kim quang rực rỡ
    subColor: '#f97316',  // Chân hỏa cam đỏ
    ambientParticleCount: 28,
    auraIntensity: 'high',
    specialEffect: 'jindan',
    badgeTitle: 'Tam Chuyển Đan Văn',
    realmName: 'Kim Đan Trung Kỳ',
    stageCategory: 'Kim Đan',
    description: 'Kim Đan xoay tít tỏa vạn đạo hào quang, vòng kinh văn cổ ngữ đầu tiên khắc sâu rực rỡ quanh khối cầu đan hỏa.'
  },

  18: {
    realmIndex: 18,
    themeColor: '#f59e0b', // Hoàng kim hổ phách
    subColor: '#dc2626',  // Tam muội chân hỏa
    ambientParticleCount: 32,
    auraIntensity: 'high',
    specialEffect: 'jindan',
    badgeTitle: 'Lục Chuyển Chân Hỏa',
    realmName: 'Kim Đan Hậu Kỳ',
    stageCategory: 'Kim Đan',
    description: 'Chân hỏa tam muội bao bọc thân thể thành hình sóng năng lượng rực cháy, 2 vòng đan văn xoay nghịch chiều hộ thể.'
  },

  19: {
    realmIndex: 19,
    themeColor: '#fbbf24', // Kim quang chói lọi
    subColor: '#b91c1c',  // Liệt hỏa xích thâm
    ambientParticleCount: 34,
    auraIntensity: 'supreme',
    specialEffect: 'jindan',
    badgeTitle: 'Cửu Chuyển Kim Đan',
    realmName: 'Kim Đan Đỉnh Phong',
    stageCategory: 'Kim Đan',
    description: 'Cửu chuyển đan văn hoàn chỉnh, khối cầu Kim Đan phát quang chói lòa như thái dương giữa hư không, xua tan bóng tối.'
  },

  20: {
    realmIndex: 20,
    themeColor: '#f59e0b', // Hoàng kim cực cảnh
    subColor: '#a855f7',  // Ánh sáng tử khí nứt vỡ
    ambientParticleCount: 36,
    auraIntensity: 'supreme',
    specialEffect: 'jindan',
    badgeTitle: 'Phá Đan Sinh Anh',
    realmName: 'Kim Đan Đại Viên Mãn',
    stageCategory: 'Kim Đan',
    description: 'Kim đan rực sáng đến cực hạn xuất hiện đạo ngân nứt vỡ, hào quang tử sắc bộc phát, mầm mống tiểu hài đồng Nguyên Anh hiển thánh.'
  },

  // ==========================================================
  // ĐẠI CẢNH GIỚI: NGUYÊN ANH (INDEX 21 - 25)
  // Ý niệm: Phá đan thành anh, tiểu hài đồng hiển thánh, tử khí đông lai, thần niệm vô cương.
  // Tông màu: Tím Huyền Môn (Mystic Violet) phối Bạc Tinh Thể & Ánh Sáng Cực Quang (Aurora).
  // ==========================================================
  21: {
    realmIndex: 21,
    themeColor: '#a855f7', // Tím huyền môn
    subColor: '#38bdf8',  // Ánh sáng cực quang lam
    ambientParticleCount: 30,
    auraIntensity: 'high',
    specialEffect: 'nascent',
    badgeTitle: 'Hài Đồng Hiển Thánh',
    realmName: 'Nguyên Anh Sơ Kỳ',
    stageCategory: 'Nguyên Anh',
    description: 'Phá đan thành anh! Hư ảnh tiểu hài đồng Nguyên Anh phát quang lơ lửng trước ngực, nhấp nhô mềm mại theo nhịp thở thần thức.'
  },

  22: {
    realmIndex: 22,
    themeColor: '#8b5cf6', // Tử sắc thạch anh
    subColor: '#c084fc',  // Tử khí lan tỏa
    ambientParticleCount: 32,
    auraIntensity: 'high',
    specialEffect: 'nascent',
    badgeTitle: 'Tử Khí Đông Lai',
    realmName: 'Nguyên Anh Trung Kỳ',
    stageCategory: 'Nguyên Anh',
    description: 'Mây mù tử khí vạn dặm cuộn trào, dải ngân hà huyền bí xoay tròn chậm rãi phía sau lưng bao bọc Nguyên Anh.'
  },

  23: {
    realmIndex: 23,
    themeColor: '#9333ea', // Tím hoàng gia huyền bí
    subColor: '#67e8f9',  // Lam tinh thể
    ambientParticleCount: 34,
    auraIntensity: 'supreme',
    specialEffect: 'nascent',
    badgeTitle: 'Lưới Thần Niệm',
    realmName: 'Nguyên Anh Hậu Kỳ',
    stageCategory: 'Nguyên Anh',
    description: 'Mạng lưới thần thức kết thành màng chắn bát diện đa giác bảo hộ tâm linh tuyệt đối chống tâm ma vạn giới xâm nhập.'
  },

  24: {
    realmIndex: 24,
    themeColor: '#7c3aed', // Tím đậm vô cực
    subColor: '#e0e7ff',  // Bạc tinh thể bạch quang
    ambientParticleCount: 36,
    auraIntensity: 'supreme',
    specialEffect: 'nascent',
    badgeTitle: 'Xuất Khiếu Thái Hư',
    realmName: 'Nguyên Anh Đỉnh Phong',
    stageCategory: 'Nguyên Anh',
    description: 'Nguyên anh ly thể bay lượn cửu thiên, thần niệm bao trùm sơn hà vạn lý, thoát thai hoán cốt vượt xa ràng buộc nhục thân.'
  },

  25: {
    realmIndex: 25,
    themeColor: '#a855f7', // Tử khí cực cảnh
    subColor: '#f43f5e',  // Tia sáng thiên đạo xích kim
    ambientParticleCount: 38,
    auraIntensity: 'supreme',
    specialEffect: 'nascent',
    badgeTitle: 'Thông Thiên Triệt Địa',
    realmName: 'Nguyên Anh Đại Viên Mãn',
    stageCategory: 'Nguyên Anh',
    description: 'Nguyên anh cùng nhục thân hoàn mỹ hợp nhất, tử khí chuyển sắc xích kim uy chấn thiên địa, chuẩn bị lĩnh ngộ quy tắc Thiên Đạo.'
  },

  // ==========================================================
  // ĐẠI CẢNH GIỚI: HÓA THẦN (INDEX 26 - 30)
  // Ý niệm: Lĩnh ngộ Thiên Đạo Quy Tắc, Pháp Tướng Cự Thần sừng sững sau lưng, hư không rạn nứt.
  // Tông màu: Đỏ Ma Thần / Hắc Kim Vũ Trụ / Bạch Quang Hỗn Độn (Celestial Crimson & Divine Gold).
  // ==========================================================
  26: {
    realmIndex: 26,
    themeColor: '#f43f5e', // Đỏ ma thần thiên kiếp
    subColor: '#fbbf24',  // Hoàng kim thiên đạo
    ambientParticleCount: 36,
    auraIntensity: 'supreme',
    specialEffect: 'phaptuong',
    badgeTitle: 'Thiên Địa Pháp Tướng',
    realmName: 'Hóa Thần Sơ Kỳ',
    stageCategory: 'Hóa Thần',
    description: 'Thần niệm hòa nhập thiên địa, hư ảnh Cự Thần Pháp Tướng khổng lồ tỏa sáng mờ ảo sừng sững sau lưng tu sĩ uy chấn vạn dặm.'
  },

  27: {
    realmIndex: 27,
    themeColor: '#e11d48', // Xích huyết đế uy
    subColor: '#a855f7',  // Lôi điện tử sắc
    ambientParticleCount: 38,
    auraIntensity: 'supreme',
    specialEffect: 'phaptuong',
    badgeTitle: 'Thần Mục Trảm Hư Không',
    realmName: 'Hóa Thần Trung Kỳ',
    stageCategory: 'Hóa Thần',
    description: 'Đôi mắt thần quang của Cự Thần rực cháy tỏa uy áp kinh hoàng, thiên lôi tím giật xé rách không gian xung quanh.'
  },

  28: {
    realmIndex: 28,
    themeColor: '#be123c', // Hắc kim xích hồng
    subColor: '#38bdf8',  // Lam lôi xé toạc
    ambientParticleCount: 40,
    auraIntensity: 'supreme',
    specialEffect: 'phaptuong',
    badgeTitle: 'Không Gian Rạn Nứt',
    realmName: 'Hóa Thần Hậu Kỳ',
    stageCategory: 'Hóa Thần',
    description: 'Các vết nứt hư không rực sáng lôi điện đỏ tím xé toạc chân không, uy áp vô hình khiến sơn hà chấn động.'
  },

  29: {
    realmIndex: 29,
    themeColor: '#f43f5e', // Hỗn độn xích sắc
    subColor: '#e0e7ff',  // Bạch quang tinh thể
    ambientParticleCount: 42,
    auraIntensity: 'supreme',
    specialEffect: 'phaptuong',
    badgeTitle: 'Quy Tắc Lĩnh Vực',
    realmName: 'Hóa Thần Đỉnh Phong',
    stageCategory: 'Hóa Thần',
    description: 'Vòng tròn lĩnh vực luân hồi xoay vần nghịch chuyển quy nạp vạn vật, các hạt tinh tú bị hút vào trung tâm đan điền.'
  },

  30: {
    realmIndex: 30,
    themeColor: '#e11d48', // Hóa Thần Cực Cảnh
    subColor: '#fbbf24',  // Thần quang hoàng kim
    ambientParticleCount: 45,
    auraIntensity: 'supreme',
    specialEffect: 'phaptuong',
    badgeTitle: 'Hóa Thần Vấn Đỉnh',
    realmName: 'Hóa Thần Đại Viên Mãn',
    stageCategory: 'Hóa Thần',
    description: 'Pháp tướng cự thần cao vạn trượng, đạp chân hư không, chưởng khống quy tắc tự nhiên vạn đạo, chạm ngưỡng cửa Luyện Hư.'
  }
};

/**
 * Fallback an toàn cho cảnh giới > 10 (Trúc Cơ index 11-15, Kim Đan index 16-20, Nguyên Anh index 21-25...)
 */
export function getFallbackRealmConfig(realmIndex: number): RealmVisualConfig {
  const safeIndex = Math.max(0, Math.min(realmsData.length - 1, Math.floor(realmIndex || 0)));
  const realm = realmsData[safeIndex] || realmsData[realmsData.length - 1];
  const stage = realm.stage;
  const name = realm.name;

  if (safeIndex >= 101) {
    // Đế Tổ (101-104)
    return {
      realmIndex: safeIndex,
      themeColor: '#f43f5e',
      subColor: '#fbbf24',
      ambientParticleCount: 48,
      auraIntensity: 'supreme',
      specialEffect: 'taichi',
      badgeTitle: 'Vạn Cổ Đế Tổ',
      realmName: name,
      stageCategory: 'Đế Tổ',
      description: 'Khí thôn nhật nguyệt, duy ngã độc tôn, chấp chưởng thiên địa càn khôn nguyên bản.'
    };
  }

  if (safeIndex >= 96) {
    // Tiên Đế (96-100)
    return {
      realmIndex: safeIndex,
      themeColor: '#f59e0b',
      subColor: '#fbbf24',
      ambientParticleCount: 45,
      auraIntensity: 'supreme',
      specialEffect: 'taichi',
      badgeTitle: 'Tiên Đế Chí Tôn',
      realmName: name,
      stageCategory: 'Tiên Đế',
      description: 'Vấn đỉnh đỉnh cao tam giới, một niệm sinh diệt chư thiên vạn giới.'
    };
  }

  if (safeIndex >= 86) {
    // Chuẩn Đế & Đại Đế (86-95)
    return {
      realmIndex: safeIndex,
      themeColor: '#ec4899',
      subColor: '#f59e0b',
      ambientParticleCount: 42,
      auraIntensity: 'supreme',
      specialEffect: 'taichi',
      badgeTitle: 'Đại Đế Vô Thượng',
      realmName: name,
      stageCategory: stage,
      description: 'Chạm tới quy tắc căn nguyên vũ trụ, đế uy hiển hách bát hoang.'
    };
  }

  if (safeIndex >= 56) {
    // Tiên Nhân Cảnh (Chân Tiên, Huyền Tiên, Địa Tiên, Thiên Tiên, Kim Tiên, Thái Ất - 56 đến 85)
    return {
      realmIndex: safeIndex,
      themeColor: '#38bdf8',
      subColor: '#e0f2fe',
      ambientParticleCount: 40,
      auraIntensity: 'supreme',
      specialEffect: 'taichi',
      badgeTitle: 'Tiên Nhân Chi Thể',
      realmName: name,
      stageCategory: stage,
      description: 'Tiên khí dạt dào, thoát phàm thành tiên, tiêu dao tự tại ngoài vòng ngũ hành.'
    };
  }

  if (safeIndex >= 46) {
    // Độ Kiếp & Phi Thăng (46-55)
    return {
      realmIndex: safeIndex,
      themeColor: '#c084fc',
      subColor: '#f43f5e',
      ambientParticleCount: 38,
      auraIntensity: 'supreme',
      specialEffect: 'swords',
      badgeTitle: 'Độ Kiếp Thăng Thiên',
      realmName: name,
      stageCategory: stage,
      description: 'Cửu trọng lôi kiếp tôi luyện tiên cốt, hào quang xé toạc mây trời nghênh đón tiên kiếp.'
    };
  }

  if (safeIndex >= 41) {
    // Đại Thừa (41-45)
    return {
      realmIndex: safeIndex,
      themeColor: '#f43f5e',
      subColor: '#fbbf24',
      ambientParticleCount: 36,
      auraIntensity: 'supreme',
      specialEffect: 'runes',
      badgeTitle: 'Đại Thừa Cực Cảnh',
      realmName: name,
      stageCategory: 'Đại Thừa',
      description: 'Đại đạo viên mãn, sắp sửa bước vào thiên kiếp phi thăng thượng giới.'
    };
  }

  if (safeIndex >= 36) {
    // Hợp Thể (36-40)
    return {
      realmIndex: safeIndex,
      themeColor: '#6366f1',
      subColor: '#a855f7',
      ambientParticleCount: 34,
      auraIntensity: 'supreme',
      specialEffect: 'vortex',
      badgeTitle: 'Hợp Thể Vạn Pháp',
      realmName: name,
      stageCategory: 'Hợp Thể',
      description: 'Nhục thân hòa quyện pháp tướng, vạn pháp bất xâm, linh vực sơ hiện.'
    };
  }

  if (safeIndex >= 31) {
    // Luyện Hư (31-35)
    return {
      realmIndex: safeIndex,
      themeColor: '#06b6d4',
      subColor: '#67e8f9',
      ambientParticleCount: 32,
      auraIntensity: 'supreme',
      specialEffect: 'taichi',
      badgeTitle: 'Luyện Hư Hợp Đạo',
      realmName: name,
      stageCategory: 'Luyện Hư',
      description: 'Hư không bất diệt, đạo tâm thuần khiết, hòa mình vào quy tắc thiên địa.'
    };
  }

  if (safeIndex >= 26) {
    // Hóa Thần (26-30)
    return {
      realmIndex: safeIndex,
      themeColor: '#ec4899',
      subColor: '#a855f7',
      ambientParticleCount: 30,
      auraIntensity: 'supreme',
      specialEffect: 'nebula',
      badgeTitle: 'Hóa Thần Vấn Đạo',
      realmName: name,
      stageCategory: 'Hóa Thần',
      description: 'Ý niệm hóa thần, thần niệm quét ngang ngàn dặm, đạp không trường sinh.'
    };
  }

  if (safeIndex >= 21) {
    // Nguyên Anh (21-25)
    return {
      realmIndex: safeIndex,
      themeColor: '#8b5cf6',
      subColor: '#38bdf8',
      ambientParticleCount: 28,
      auraIntensity: 'high',
      specialEffect: 'nebula',
      badgeTitle: 'Nguyên Anh Xuất Khiếu',
      realmName: name,
      stageCategory: 'Nguyên Anh',
      description: 'Nguyên anh ngự không, thần thức thiên lý, pháp tướng uy nghiêm chấn nhiếp bát hoang.'
    };
  }

  if (safeIndex >= 16) {
    // Kim Đan (16-20)
    return {
      realmIndex: safeIndex,
      themeColor: '#eab308',
      subColor: '#f97316',
      ambientParticleCount: 26,
      auraIntensity: 'high',
      specialEffect: 'vortex',
      badgeTitle: 'Kim Đan Đại Đạo',
      realmName: name,
      stageCategory: 'Kim Đan',
      description: 'Nhất lạp kim đan thôn nhập phúc, thủy tri ngã mệnh do ngã bất do thiên.'
    };
  }

  // Trúc Cơ (11-15)
  return {
    realmIndex: safeIndex,
    themeColor: '#d97706', // Hổ phách đạo cơ
    subColor: '#fbbf24',
    ambientParticleCount: 24,
    auraIntensity: 'high',
    specialEffect: 'runes',
    badgeTitle: 'Trúc Cơ Đạo Đài',
    realmName: name,
    stageCategory: 'Trúc Cơ',
    description: 'Đạo đài vững chắc, linh dịch hóa hải, chân nguyên cuồn cuộn không dứt.'
  };
}

/**
 * Lấy cấu hình hoạt họa cho bất kỳ cảnh giới nào
 */
export function getRealmVisualConfig(realmIndex: number): RealmVisualConfig {
  const safeIndex = Math.max(0, Math.floor(realmIndex || 0));
  if (safeIndex in REALM_VISUALS_DATA) {
    return REALM_VISUALS_DATA[safeIndex];
  }
  return getFallbackRealmConfig(safeIndex);
}
