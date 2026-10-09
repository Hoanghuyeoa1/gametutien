// lib/manuals-data.ts
// Dữ liệu Bí Tịch Công Pháp và Phó Bản Bí Cảnh Đa Tầng

import { Manual, SecretRealmDungeon } from '@/lib/types';

export const DEFAULT_MANUALS: Manual[] = [
  // --- TÂM PHÁP NỘI CÔNG (Tăng tốc độ tu luyện & Linh Lực MP) ---
  {
    id: 'tp_tu_khi_quyet',
    name: 'Tụ Khí Quyết',
    type: 'tam_phap',
    grade: 'Hoàng Giai',
    element: 'ngu_hanh',
    description: 'Tâm pháp nhập môn của người tu đạo, dẫn dắt linh khí ngũ hành nhập vào đan điền.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 500,
    linhThachPerLevel: 30,
    minNgoTinh: 15,
    speedBonusPerLevel: 4, // +4% mỗi cấp (Max +40%)
    mpBonusPerLevel: 15, // +15 MP mỗi cấp
    maxLevelPassive: {
      name: 'Khí Hải Đãng Dương',
      description: 'Linh lực dồi dào, tăng thêm 15% tốc độ thổ nạp và 100 Linh Lực tối đa.',
      cultivateSpeedBonus: 15
    },
    activeSkill: {
      name: 'Quy Nguyên Tụ Khí',
      mpCost: 20,
      damageMultiplier: 1.3,
      shieldPercent: 15,
      effectDescription: 'Ngưng tụ chân khí đan điền, gây 130% sát thương và tạo khiên hộ thể 15%.'
    },
    priceLinhThach: 200,
    priceDanhVong: 50
  },
  {
    id: 'tp_thanh_tam_chu',
    name: 'Thanh Tâm Tịnh Thần Chú',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    element: 'bang',
    description: 'Thần chú cổ truyền giúp định tâm an thần, quét sạch tạp niệm, ngăn ngừa tà ma xâm lấn.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 2500,
    linhThachPerLevel: 150,
    minNgoTinh: 35,
    speedBonusPerLevel: 7, // +7% mỗi cấp (Max +70%)
    mpBonusPerLevel: 40,
    maxLevelPassive: {
      name: 'Băng Tâm Triệt Ngộ',
      description: 'Tâm cảnh cứng như bàn thạch, giảm 25% nguy cơ gặp và tổn thương do Tâm Ma.',
      tamMaResist: 25
    },
    activeSkill: {
      name: 'Băng Tâm Hộ Mệnh',
      mpCost: 35,
      damageMultiplier: 1.4,
      shieldPercent: 30,
      effectDescription: 'Hàn băng hộ thể giảm 30% sát thương từ Boss và phản kích 140% uy lực.'
    },
    priceLinhThach: 1200,
    priceDanhVong: 300
  },
  {
    id: 'tp_cuu_u_huyen_thuy',
    name: 'Cửu Trọng Huyền Thủy Kinh',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    element: 'thuy',
    description: 'Tâm pháp lưu chuyển nhu hòa như dòng nước lũ, sinh sôi vô cùng tận.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 3200,
    linhThachPerLevel: 220,
    minNgoTinh: 38,
    speedBonusPerLevel: 8,
    mpBonusPerLevel: 55,
    maxLevelPassive: {
      name: 'Huyền Thủy Triều Dâng',
      description: 'Chân nguyên liên miên không dứt, tăng 22% tốc độ tu luyện và +150 MP.',
      cultivateSpeedBonus: 22
    },
    activeSkill: {
      name: 'Thủy Mạc Hộ Thân Triều',
      mpCost: 40,
      damageMultiplier: 1.6,
      shieldPercent: 35,
      effectDescription: 'Dựng màn sóng nước chặn 35% sát thương của Boss và hồi phục sinh lực.'
    },
    priceLinhThach: 1800,
    priceDanhVong: 500
  },
  {
    id: 'tp_bat_hoang_quy_nguyen',
    name: 'Bát Hoang Quy Nguyên Kinh',
    type: 'tam_phap',
    grade: 'Địa Giai',
    element: 'tho',
    description: 'Tuyệt học của đại tông môn cổ đại, dung nạp linh khí của tám phương bát hoang quy về bản thể.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 12000,
    linhThachPerLevel: 800,
    minNgoTinh: 55,
    speedBonusPerLevel: 12,
    mpBonusPerLevel: 90,
    maxLevelPassive: {
      name: 'Bát Hoang Đồng Thọ',
      description: 'Khí tức ngập tràn thiên địa, gia tăng vĩnh viễn 30% tốc độ tu luyện.',
      cultivateSpeedBonus: 30
    },
    activeSkill: {
      name: 'Bát Hoang Thần Chấn',
      mpCost: 55,
      damageMultiplier: 2.1,
      shieldPercent: 40,
      effectDescription: 'Khai mở hộ thể trường lực bát hoang, giảm 40% sát thương và gây 210% uy lực.'
    },
    priceLinhThach: 5000,
    priceDanhVong: 1500
  },
  {
    id: 'tp_thai_thuong_vong_tinh',
    name: 'Thái Thượng Cửu Chuyển Lục',
    type: 'tam_phap',
    grade: 'Thiên Giai',
    element: 'quang',
    description: 'Tuyệt thế tiên pháp, cửu chuyển thăng hoa thần hồn, khám phá căn nguyên đại đạo.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 60000,
    linhThachPerLevel: 3500,
    minNgoTinh: 75,
    speedBonusPerLevel: 20,
    mpBonusPerLevel: 220,
    maxLevelPassive: {
      name: 'Thái Thượng Hóa Cực',
      description: 'Chân nguyên vô cùng vô tận, tăng 50% tốc độ tu luyện và kháng hoàn toàn tâm ma sơ cấp.',
      cultivateSpeedBonus: 50,
      tamMaResist: 35
    },
    activeSkill: {
      name: 'Thái Thượng Tiên Quang Hộ Diệt',
      mpCost: 80,
      damageMultiplier: 3.0,
      shieldPercent: 50,
      effectDescription: 'Tiên quang bao phủ diệt trừ tà khí, tạo khiên 50% và giáng 300% sát thương chí tôn!'
    },
    priceLinhThach: 25000,
    priceDanhVong: 8000
  },

  // --- THỂ THUẬT BÍ PHÁP (Tăng Khí Huyết HP & Phòng Ngự) ---
  {
    id: 'tt_thiet_bo_sam',
    name: 'Bách Luyện Thiết Bố Sam',
    type: 'the_thuat',
    grade: 'Hoàng Giai',
    element: 'kim',
    description: 'Phương pháp rèn giũa da thịt gân cốt bằng nước thuốc bí truyền, thân thể rắn chắc như sắt đá.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 600,
    linhThachPerLevel: 40,
    minNgoTinh: 15,
    hpBonusPerLevel: 80, // +80 HP mỗi cấp (Max +800 HP)
    maxLevelPassive: {
      name: 'Đồng Bì Thiết Cốt',
      description: 'Da thịt như đồng, cốt tủy như thép, gia tăng thêm 300 Khí Huyết tối đa.',
      hpPercentBonus: 10
    },
    activeSkill: {
      name: 'Thiết Giáp Cương Khí',
      mpCost: 25,
      shieldPercent: 35,
      damageMultiplier: 1.2,
      effectDescription: 'Vận chuyển cương khí toàn thân, tạo khiên hộ thể giảm 35% sát thương đòn đánh của Boss.'
    },
    priceLinhThach: 250,
    priceDanhVong: 60
  },
  {
    id: 'tt_kim_cuong_bat_hoai',
    name: 'Kim Cương Bất Hoại Thể',
    type: 'the_thuat',
    grade: 'Huyền Giai',
    element: 'kim',
    description: 'Thân kim cang bất hoại lưu chuyển kim quang, ngăn cản đao kiếm bùa chú xâm nhập.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 3000,
    linhThachPerLevel: 200,
    minNgoTinh: 35,
    hpBonusPerLevel: 250,
    maxLevelPassive: {
      name: 'Kim Quang Hộ Thể',
      description: 'Tạo lôi khiên kim sắc, tăng 20% Khí Huyết tối đa.',
      hpPercentBonus: 20
    },
    activeSkill: {
      name: 'Kim Cang Bất Diệt Chuông',
      mpCost: 45,
      shieldPercent: 50,
      damageMultiplier: 1.6,
      effectDescription: 'Kim chuông hiển hiện hộ thân, giảm 50% sát thương và phản chấn 160% sát thương vật lý!'
    },
    priceLinhThach: 1500,
    priceDanhVong: 400
  },
  {
    id: 'tt_ba_vuong_cuu_chuyen',
    name: 'Bá Vương Thần Lực Thể',
    type: 'the_thuat',
    grade: 'Địa Giai',
    element: 'tho',
    description: 'Mượn sức mạnh của thượng cổ Cự Bá, gân cốt biến đổi, khí huyết cuồn cuộn như biển gầm.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 15000,
    linhThachPerLevel: 1000,
    minNgoTinh: 50,
    hpBonusPerLevel: 750,
    maxLevelPassive: {
      name: 'Bá Vương Bất Khuất',
      description: 'Khi bị thương tích nặng, khí huyết tự động hồi sinh, tăng 35% Khí Huyết tối đa.',
      hpPercentBonus: 35
    },
    activeSkill: {
      name: 'Bá Vương Quyền Kình',
      mpCost: 60,
      shieldPercent: 55,
      damageMultiplier: 2.2,
      effectDescription: 'Huyết khí cuồn cuộn thành giáp hộ thể 55% và giáng một quyền 220% sát thương nghiền nát.'
    },
    priceLinhThach: 7000,
    priceDanhVong: 2000
  },
  {
    id: 'tt_than_ma_bat_diet',
    name: 'Thần Ma Bất Diệt Thể',
    type: 'the_thuat',
    grade: 'Thiên Giai',
    element: 'am',
    description: 'Thần thông rèn thể đệ nhất chư thiên, giọt máu tái sinh, thân thể sánh ngang thần ma viễn cổ.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 75000,
    linhThachPerLevel: 4500,
    minNgoTinh: 70,
    hpBonusPerLevel: 2500,
    maxLevelPassive: {
      name: 'Bất Tử Thần Mạch',
      description: 'Thần thể viên mãn, tăng 60% Khí Huyết tối đa và tăng thêm 15% Sát Thương toàn diện.',
      hpPercentBonus: 60,
      combatBonusPercent: 15
    },
    activeSkill: {
      name: 'Thần Ma Chấn Thế Giáp',
      mpCost: 85,
      shieldPercent: 70,
      damageMultiplier: 2.8,
      effectDescription: 'Hư ảnh Thần Ma nhập thể chặn đứng 70% sát thương Boss và hút huyết khí phản phệ 280%!'
    },
    priceLinhThach: 35000,
    priceDanhVong: 12000
  },

  // --- THẦN THÔNG TUYỆT KỸ (Tăng Chiến Lực & Sát Thương Chiến Đấu) ---
  {
    id: 'tt_ngu_kiem_thuat',
    name: 'Thanh Phong Ngự Kiếm Thuật',
    type: 'than_thong',
    grade: 'Hoàng Giai',
    element: 'phong',
    description: 'Kiếm quyết nhập môn, ngự kiếm phi hành ngàn dặm, trảm thủ quân địch trong chớp mắt.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 700,
    linhThachPerLevel: 50,
    minNgoTinh: 20,
    powerBonusPerLevel: 600, // +600 Chiến lực mỗi cấp (Max +6000)
    maxLevelPassive: {
      name: 'Nhân Kiếm Hợp Nhất',
      description: 'Tâm ý thông triệt với thanh kiếm, tăng 5% toàn bộ sát thương chiến đấu.',
      combatBonusPercent: 5
    },
    activeSkill: {
      name: 'Thanh Phong Vạn Trảm',
      mpCost: 25,
      damageMultiplier: 2.0,
      effectDescription: 'Tốc kiếm vô ảnh xé rách cuồng phong, gây 200% sát thương bạo phát tức thì!'
    },
    priceLinhThach: 300,
    priceDanhVong: 80
  },
  {
    id: 'tt_loi_dinh_chi',
    name: 'Cửu Tiêu Lôi Đình Quyết',
    type: 'than_thong',
    grade: 'Huyền Giai',
    element: 'loi',
    description: 'Dẫn lôi đình chín tầng trời giáng xuống mũi kiếm, uy năng phá hủy yêu ma quỷ quái.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 3500,
    linhThachPerLevel: 250,
    minNgoTinh: 40,
    powerBonusPerLevel: 2200, // +2200 Chiến lực mỗi cấp (Max +22000)
    maxLevelPassive: {
      name: 'Lôi Thần Trấn Sát',
      description: 'Kích phát lôi sát tột đỉnh, tăng 12% sát thương khi đối đầu Boss Thí Luyện.',
      combatBonusPercent: 12
    },
    activeSkill: {
      name: 'Cửu Thiên Lôi Bạo Nộ',
      mpCost: 45,
      damageMultiplier: 2.8,
      effectDescription: 'Sấm sét cửu thiên đánh tan phòng ngự Boss, gây 280% sát thương lôi đình hủy diệt!'
    },
    priceLinhThach: 2000,
    priceDanhVong: 600
  },
  {
    id: 'tt_liet_diem_phan_thien',
    name: 'Liệt Diễm Phần Thiên Quyết',
    type: 'than_thong',
    grade: 'Địa Giai',
    element: 'hoa',
    description: 'Ngưng tụ hỏa linh thiên địa, thiêu đốt vạn dặm hồng hoang thành biển lửa.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 16000,
    linhThachPerLevel: 1100,
    minNgoTinh: 58,
    powerBonusPerLevel: 7800,
    maxLevelPassive: {
      name: 'Liệt Hỏa Bất Diệt',
      description: 'Hỏa diễm thiêu đốt nguyên thần địch nhân, tăng 20% sát thương chiến đấu.',
      combatBonusPercent: 20
    },
    activeSkill: {
      name: 'Phần Thiên Chân Hỏa Nộ',
      mpCost: 65,
      damageMultiplier: 3.5,
      effectDescription: 'Phun trào biển lửa chân diễm thiêu rụi Boss, gây 350% sát thương hỏa thiêu cực đại!'
    },
    priceLinhThach: 8000,
    priceDanhVong: 2500
  },
  {
    id: 'tt_van_kiem_quy_tong',
    name: 'Vạn Kiếm Quy Tông',
    type: 'than_thong',
    grade: 'Địa Giai',
    element: 'kim',
    description: 'Vô thượng kiếm đạo, triệu hoán vạn thanh linh kiếm tạo thành kiếm trận bao phủ trời đất.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 18000,
    linhThachPerLevel: 1200,
    minNgoTinh: 60,
    powerBonusPerLevel: 8500, // +8500 mỗi cấp (Max +85000)
    maxLevelPassive: {
      name: 'Vạn Kiếm Triều Bái',
      description: 'Khí thế kiếm đạo áp đảo vạn vật, gia tăng 22% lực chiến thực chiến.',
      combatBonusPercent: 22
    },
    activeSkill: {
      name: 'Vạn Kiếm Tề Xuất Trận',
      mpCost: 75,
      damageMultiplier: 3.6,
      shieldPercent: 25,
      effectDescription: 'Vạn kiếm trào dâng công thủ toàn diện: Gây 360% sát thương và tạo kiếm trận hộ thân 25%!'
    },
    priceLinhThach: 9000,
    priceDanhVong: 3000
  },
  {
    id: 'tt_tram_thien_kiem',
    name: 'Trảm Thiên Thần Kiếm Quyết',
    type: 'than_thong',
    grade: 'Thiên Giai',
    element: 'quang',
    description: 'Một nhát kiếm chém rách hư không, nghịch chuyển càn khôn âm dương, uy danh chấn động cửu giới.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 90000,
    linhThachPerLevel: 6000,
    minNgoTinh: 80,
    powerBonusPerLevel: 32000, // +32000 mỗi cấp (Max +320000)
    maxLevelPassive: {
      name: 'Nhất Kiếm Đoạt Mệnh',
      description: 'Khai sơn trảm hải, tăng 35% sát thương và chiến lực tối thượng.',
      combatBonusPercent: 35
    },
    activeSkill: {
      name: 'Trảm Thiên Nhất Kiếm Tuyệt Diệt',
      mpCost: 95,
      damageMultiplier: 4.8,
      effectDescription: 'Một nhát kiếm vô song chém đứt sinh mệnh, gây 480% sát thương hủy diệt tột đỉnh!'
    },
    priceLinhThach: 45000,
    priceDanhVong: 15000
  },
  {
    id: 'manual_dan_kinh_tan_quyen',
    name: 'Thái Thượng Đan Kinh Tàn Quyển',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    element: 'hoa',
    description: 'Bản ghi chép tàn khuyết của Đan Đạo Viễn Cổ. Lĩnh ngộ lập tức Khai Mở Bách Nghệ: Luyện Đan Các, thấu hiểu dược tính vạn thảo.',
    level: 0,
    maxLevel: 5,
    tuViPerLevel: 2500,
    linhThachPerLevel: 150,
    minNgoTinh: 20,
    speedBonusPerLevel: 5,
    maxLevelPassive: {
      name: 'Đan Đạo Sơ Tâm',
      description: 'Gia tăng 5% tốc độ tu luyện và 5% tỉ lệ thành đan khi luyện chế.',
      cultivateSpeedBonus: 5
    },
    priceLinhThach: 1500,
    priceDanhVong: 500
  },
  {
    id: 'manual_bach_luyen_duc_thuat',
    name: 'Bách Luyện Đúc Thuật',
    type: 'the_thuat',
    grade: 'Huyền Giai',
    element: 'kim',
    description: 'Bí kíp rèn đúc vũ khí của Luyện Khí Tông Sư. Lĩnh ngộ lập tức Khai Mở Bách Nghệ: Luyện Khí Phòng, rèn tạo binh khí pháp bảo.',
    level: 0,
    maxLevel: 5,
    tuViPerLevel: 2500,
    linhThachPerLevel: 150,
    minNgoTinh: 20,
    hpBonusPerLevel: 150,
    maxLevelPassive: {
      name: 'Luyện Binh Nhập Thể',
      description: 'Gia tăng 400 Khí Huyết và 5% phòng ngự khi trang bị binh khí.',
      hpPercentBonus: 5
    },
    priceLinhThach: 1500,
    priceDanhVong: 500
  },

  // =========================================================================
  // 1. NHÓM SƠ CƠ: NHẤT GIAI & NHỊ GIAI (Phàm Nhân & Luyện Khí 1 - 10)
  // =========================================================================
  {
    id: 'tp_dan_khi_quyet',
    name: 'Dẫn Khí Quyết',
    type: 'tam_phap',
    grade: 'Hoàng Giai',
    element: 'ngu_hanh',
    description: 'Khẩu quyết thổ nạp nhập môn của tán tu phàm trần, dẫn dắt linh khí đất trời vào kinh mạch.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 150,
    linhThachPerLevel: 10,
    minNgoTinh: 5,
    speedBonusPerLevel: 1, // +1% mỗi cấp (Max +10%)
    mpBonusPerLevel: 15, // +15 MP mỗi cấp (Max +150 MP)
    maxLevelPassive: {
      name: 'Khí Hải Sơ Định',
      description: 'Kinh mạch thông suốt, gia tăng +10% Tu Vi/giây và +150 Chân Nguyên tối đa.',
      cultivateSpeedBonus: 10,
      mpBonus: 150
    },
    activeSkill: {
      name: 'Dẫn Khí Quy Nguyên',
      mpCost: 10,
      damageMultiplier: 1.1,
      shieldPercent: 10,
      effectDescription: 'Thổ nạp chân khí sơ cấp, gây 110% uy lực và tạo màng khí che chắn 10%.'
    },
    priceLinhThach: 60,
    priceDanhVong: 15
  },
  {
    id: 'tp_canh_kim_quyet',
    name: 'Canh Kim Quyết',
    type: 'tam_phap',
    grade: 'Hoàng Giai',
    element: 'kim',
    description: 'Tâm pháp thổ nạp dẫn Canh Kim chi khí tôi luyện đan điền, gia tăng sắc bén cho linh lực.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 300,
    linhThachPerLevel: 25,
    minNgoTinh: 15,
    speedBonusPerLevel: 1.8,
    mpBonusPerLevel: 30,
    maxLevelPassive: {
      name: 'Canh Kim Sắc Khí',
      description: 'Canh Kim nhập đan điền, +18% Tu Vi/giây, +10% Sát thương hệ Kim, +300 Max MP.',
      cultivateSpeedBonus: 18,
      combatBonusPercent: 10,
      mpBonus: 300
    },
    activeSkill: {
      name: 'Canh Kim Phá Giáp Khí',
      mpCost: 18,
      damageMultiplier: 1.25,
      shieldPercent: 12,
      effectDescription: 'Phát xạ Canh Kim cương khí xé toạc phòng ngự đối phương, gây 125% sát thương.'
    },
    priceLinhThach: 350,
    priceDanhVong: 70
  },
  {
    id: 'tp_truong_xuan_cong',
    name: 'Trường Xuân Công',
    type: 'tam_phap',
    grade: 'Hoàng Giai',
    element: 'moc',
    description: 'Đạo pháp Mộc hệ dưỡng sinh cố bản, giúp kinh mạch thông suốt tuần hoàn sinh sôi bất tận.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 320,
    linhThachPerLevel: 25,
    minNgoTinh: 15,
    speedBonusPerLevel: 2.0,
    mpBonusPerLevel: 25,
    maxLevelPassive: {
      name: 'Trường Xuân Bất Lão',
      description: 'Sinh cơ dồi dào, +20% Tu Vi/giây, tự hồi 1% Khí Huyết mỗi hiệp đấu, +250 Max MP.',
      cultivateSpeedBonus: 20,
      hpRegenPercent: 1,
      mpBonus: 250
    },
    activeSkill: {
      name: 'Ất Mộc Dưỡng Sinh Triều',
      mpCost: 20,
      damageMultiplier: 1.2,
      shieldPercent: 15,
      effectDescription: 'Dẫn mộc linh hồi phục sinh cơ và gây 120% sát thương áp chế.'
    },
    priceLinhThach: 380,
    priceDanhVong: 75
  },
  {
    id: 'tt_thiet_bo_sam_so_cap',
    name: 'Thiết Bố Sam (Sơ Cấp)',
    type: 'the_thuat',
    grade: 'Hoàng Giai',
    element: 'tho',
    description: 'Ngạnh công giang hồ rèn da thịt như bọc sắt, chống đỡ đao kiếm thông thường.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 160,
    linhThachPerLevel: 10,
    minNgoTinh: 5,
    hpBonusPerLevel: 25,
    maxLevelPassive: {
      name: 'Thiết Y Hộ Thể',
      description: 'Da thịt dẻo dai như bọc sắt, +40 Phòng Ngự, +250 Khí Huyết tối đa.',
      defBonus: 40,
      hpBonus: 250
    },
    activeSkill: {
      name: 'Thiết Bì Thuẫn',
      mpCost: 10,
      shieldPercent: 20,
      damageMultiplier: 1.1,
      effectDescription: 'Gồng mình chịu đòn, tạo khiên chắn 20% sát thương nhận vào.'
    },
    priceLinhThach: 50,
    priceDanhVong: 10
  },
  {
    id: 'tt_man_nguu_kinh',
    name: 'Man Ngưu Kình',
    type: 'the_thuat',
    grade: 'Hoàng Giai',
    element: 'tho',
    description: 'Mô phỏng sức mạnh man ngưu rừng già, tôi luyện gân cốt phát lực ngàn cân bạt sơn cửu đỉnh.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 320,
    linhThachPerLevel: 25,
    minNgoTinh: 15,
    hpBonusPerLevel: 45,
    powerBonusPerLevel: 35,
    maxLevelPassive: {
      name: 'Man Ngưu Thần Lực',
      description: 'Gân cốt vững chãi, +10% Khí Huyết, +8% Phòng Ngự, +50 Công Kích.',
      hpPercentBonus: 10,
      defPercentBonus: 8,
      atkBonus: 50
    },
    activeSkill: {
      name: 'Man Ngưu Khai Sơn',
      mpCost: 20,
      shieldPercent: 25,
      damageMultiplier: 1.35,
      effectDescription: 'Thế húc của man ngưu cổ đại, gây 135% sát thương và tạo khiên hộ thân 25%.'
    },
    priceLinhThach: 400,
    priceDanhVong: 80
  },
  {
    id: 'tt_toai_thach_quyen',
    name: 'Toái Thạch Quyền',
    type: 'than_thong',
    grade: 'Hoàng Giai',
    element: 'tho',
    description: 'Quyền kình tụ lực đập vỡ đá tảng, thế quyền nặng tựa bàn thạch phá tan hộ giáp.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 180,
    linhThachPerLevel: 10,
    minNgoTinh: 5,
    powerBonusPerLevel: 80,
    maxLevelPassive: {
      name: 'Khai Sơn Toái Thạch',
      description: 'Quyền kình thấu giáp, +80 Công Kích, +10 Phá Giáp phẳng.',
      combatBonusPercent: 5,
      penetration: 10
    },
    activeSkill: {
      name: 'Bàn Thạch Toái Kình',
      mpCost: 15,
      damageMultiplier: 1.3,
      effectDescription: 'Đập một quyền nặng nghìn cân gây 130% sát thương đập vỡ đá tảng!'
    },
    priceLinhThach: 55,
    priceDanhVong: 12
  },
  {
    id: 'tt_canh_kim_kiem_khi',
    name: 'Canh Kim Kiếm Khí',
    type: 'than_thong',
    grade: 'Hoàng Giai',
    element: 'kim',
    description: 'Ngưng tụ Canh Kim chi khí đầu ngón tay bắn ra kiếm khí sắc bén xé gió đoạt mệnh.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 350,
    linhThachPerLevel: 30,
    minNgoTinh: 15,
    powerBonusPerLevel: 160,
    maxLevelPassive: {
      name: 'Canh Kim Sát Kiếm',
      description: 'Kiếm khí sắc nhọn, +160 Công Kích, +15% Sát thương hệ Kim, +5% Bạo Kích.',
      combatBonusPercent: 15,
      critRateBonus: 5
    },
    activeSkill: {
      name: 'Chỉ Tiêm Kiếm Khí',
      mpCost: 22,
      damageMultiplier: 1.5,
      effectDescription: 'Bắn ra tia Canh Kim kiếm khí xé toạc không khí, gây 150% sát thương bạo kích!'
    },
    priceLinhThach: 450,
    priceDanhVong: 90
  },
  {
    id: 'tt_thao_thuong_phi',
    name: 'Thảo Thượng Phi',
    type: 'than_thong',
    grade: 'Hoàng Giai',
    element: 'phong',
    description: 'Thân pháp khinh công lướt nhẹ trên ngọn cỏ, tăng khả năng né tránh cạm bẫy và đòn hiểm.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 180,
    linhThachPerLevel: 10,
    minNgoTinh: 5,
    speedBonusPerLevel: 15,
    maxLevelPassive: {
      name: 'Đạp Thảo Vô Ngân',
      description: 'Thân nhẹ như yến, +15 Tốc Độ, +5% Né Tránh tự nhiên.',
      speedBonus: 15,
      dodgeRateBonus: 5
    },
    activeSkill: {
      name: 'Thảo Thượng Huyễn Ảnh',
      mpCost: 12,
      damageMultiplier: 1.15,
      shieldPercent: 15,
      effectDescription: 'Lướt nhẹ như gió né tránh đòn đánh và phản kích 115% uy lực.'
    },
    priceLinhThach: 60,
    priceDanhVong: 15
  },
  {
    id: 'tt_du_long_bo',
    name: 'Du Long Bộ',
    type: 'than_thong',
    grade: 'Hoàng Giai',
    element: 'thuy',
    description: 'Bộ pháp uyển chuyển như rồng lượn dưới nước, xuất quỷ nhập thần bất khả nắm bắt.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 360,
    linhThachPerLevel: 30,
    minNgoTinh: 18,
    speedBonusPerLevel: 25,
    maxLevelPassive: {
      name: 'Du Long Hí Thủy',
      description: 'Biến ảo khôn lường, +25 Tốc Độ, +8% Né Tránh tự nhiên, +10% Tỉ lệ kích hoạt Đòn Kép.',
      speedBonus: 25,
      dodgeRateBonus: 8,
      doubleStrikeRate: 10
    },
    activeSkill: {
      name: 'Du Long Phóng Ảnh',
      mpCost: 20,
      damageMultiplier: 1.35,
      shieldPercent: 20,
      effectDescription: 'Lượn rồng tàn ảnh mê hoặc đối thủ, gây 135% sát thương và tăng né tránh.'
    },
    priceLinhThach: 480,
    priceDanhVong: 95
  },

  // =========================================================================
  // 2. NHÓM TRUNG CƠ: TAM GIAI & TỨ GIAI (Trúc Cơ & Kim Đan)
  // =========================================================================
  {
    id: 'tp_huyen_thuy_chan_kinh',
    name: 'Huyền Thủy Chân Kinh',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    element: 'thuy',
    description: 'Tâm pháp như dòng nước lớn cuộn trào bất tận, Chân Nguyên kéo dài không dứt.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 3500,
    linhThachPerLevel: 250,
    minNgoTinh: 35,
    speedBonusPerLevel: 2.5,
    mpBonusPerLevel: 80,
    maxLevelPassive: {
      name: 'Huyền Thủy Triều Dâng',
      description: 'Chân nguyên liên miên không dứt, +25% Tu Vi/giây, +800 Max MP, giảm 15% tiêu hao MP khi dùng kỹ năng.',
      cultivateSpeedBonus: 25,
      mpBonus: 800,
      mpCostReduction: 15
    },
    activeSkill: {
      name: 'Huyền Thủy Tụ Sóng',
      mpCost: 35,
      damageMultiplier: 1.6,
      shieldPercent: 30,
      effectDescription: 'Tụ sóng triều dâng bảo hộ 30% sát thương và phản kích 160% uy lực.'
    },
    priceLinhThach: 5500,
    priceDanhVong: 1200
  },
  {
    id: 'tp_cuu_u_minh_vuong',
    name: 'Cửu U Minh Vương Quyết',
    type: 'tam_phap',
    grade: 'Địa Giai',
    element: 'am',
    description: 'Đạo pháp ma môn dẫn u minh sát khí ngưng đan, chuyển hóa sát thương thành tu vi.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 15000,
    linhThachPerLevel: 1000,
    minNgoTinh: 50,
    speedBonusPerLevel: 3.0,
    maxLevelPassive: {
      name: 'Minh Vương Hấp Huyết',
      description: 'U minh sát khí ngưng đan, +30% Tu Vi/giây, +15% Hút Máu, nhưng -10 Tâm Cảnh.',
      cultivateSpeedBonus: 30,
      lifestealPercent: 15,
      tamCanhReduction: 10
    },
    activeSkill: {
      name: 'Minh Vương U Hồn Sát',
      mpCost: 60,
      damageMultiplier: 2.3,
      shieldPercent: 35,
      effectDescription: 'Hóa hư ảnh Minh Vương hấp thu 230% sinh lực đối thủ chuyển hóa thành tu vi!'
    },
    priceLinhThach: 28000,
    priceDanhVong: 7000
  },
  {
    id: 'tt_bat_diet_ma_the',
    name: 'Bất Diệt Ma Thể',
    type: 'the_thuat',
    grade: 'Huyền Giai',
    element: 'am',
    description: 'Lấy tinh huyết hung thú tôi luyện gân mạch, thân thể đao thương bất nhập.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 3500,
    linhThachPerLevel: 250,
    minNgoTinh: 35,
    hpBonusPerLevel: 250,
    maxLevelPassive: {
      name: 'Ma Thể Tinh Cốt',
      description: 'Lấy tinh huyết hung thú tôi luyện, +20% Khí Huyết, +15% Phòng Ngự, +3% Miễn Thương.',
      hpPercentBonus: 20,
      defPercentBonus: 15,
      damageReductionPercent: 3
    },
    activeSkill: {
      name: 'Ma Thể Hộ Thân',
      mpCost: 40,
      shieldPercent: 40,
      damageMultiplier: 1.5,
      effectDescription: 'Bộc phát ma diễm tạo màng chắn 40% sát thương và phản phệ 150% uy lực.'
    },
    priceLinhThach: 6800,
    priceDanhVong: 1500
  },
  {
    id: 'tt_hoa_long_bien',
    name: 'Hóa Long Biến',
    type: 'the_thuat',
    grade: 'Địa Giai',
    element: 'hoa',
    description: 'Hấp thụ Chân Long khí tức mọc vảy rồng hộ thể, bạo phát long lực chấn áp bát hoang.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 16000,
    linhThachPerLevel: 1200,
    minNgoTinh: 52,
    hpBonusPerLevel: 650,
    powerBonusPerLevel: 200,
    maxLevelPassive: {
      name: 'Chân Long Vảy Hộ',
      description: 'Hấp thụ long khí mọc vảy rồng, +25% Khí Huyết, +18% Phòng Ngự, +200 Công Kích, +5% Kháng Bạo.',
      hpPercentBonus: 25,
      defPercentBonus: 18,
      atkBonus: 200,
      critResist: 5
    },
    activeSkill: {
      name: 'Long Ngâm Bá Thiên',
      mpCost: 65,
      shieldPercent: 50,
      damageMultiplier: 2.2,
      effectDescription: 'Long ngâm chấn thiên địa, tạo khiên vảy rồng 50% và giáng 220% sát thương long trảo!'
    },
    priceLinhThach: 35000,
    priceDanhVong: 8500
  },
  {
    id: 'tt_thai_at_huyen_bang',
    name: 'Thái Ất Huyền Băng Kiếm',
    type: 'than_thong',
    grade: 'Huyền Giai',
    element: 'bang',
    description: 'Đóng băng vạn vật trong phạm vi mười trượng, kiếm ý rét buốt thấu xương.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 3800,
    linhThachPerLevel: 280,
    minNgoTinh: 40,
    powerBonusPerLevel: 380,
    maxLevelPassive: {
      name: 'Hàn Băng Thấu Xương',
      description: 'Kiếm ý rét buốt thấu xương, +380 Công Kích, +20% Băng hệ dmg, 25% tỷ lệ làm chậm đối thủ 20% Tốc Độ.',
      combatBonusPercent: 20,
      slowChance: 25,
      slowPercent: 20
    },
    activeSkill: {
      name: 'Thái Ất Tuyệt Băng Trảm',
      mpCost: 45,
      damageMultiplier: 2.2,
      effectDescription: 'Kiếm khí đóng băng vạn dặm hư không, gây 220% sát thương băng giá hủy diệt!'
    },
    priceLinhThach: 7200,
    priceDanhVong: 1600
  },
  {
    id: 'tt_dai_dia_liet_chan',
    name: 'Đại Địa Liệt Chấn',
    type: 'than_thong',
    grade: 'Huyền Giai',
    element: 'tho',
    description: 'Dẫm nát địa mạch tạo sóng chấn động kinh hoàng, phá vỡ hộ giáp địch.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 4000,
    linhThachPerLevel: 300,
    minNgoTinh: 40,
    powerBonusPerLevel: 420,
    maxLevelPassive: {
      name: 'Liệt Địa Chấn Thiên',
      description: 'Địa chấn phá hộ giáp, +420 Công Kích, +25% Xuyên Giáp đối thủ.',
      combatBonusPercent: 15,
      penetrationPercent: 25
    },
    activeSkill: {
      name: 'Địa Mạch Chấn Nộ',
      mpCost: 48,
      damageMultiplier: 2.3,
      effectDescription: 'Dẫm nát địa mạch tạo sóng chấn động kinh hoàng, gây 230% sát thương nghiền nát!'
    },
    priceLinhThach: 7500,
    priceDanhVong: 1800
  },
  {
    id: 'tt_van_kiem_quy_tong_cuc_pham',
    name: 'Vạn Kiếm Quy Tông (Tứ Giai)',
    type: 'than_thong',
    grade: 'Địa Giai',
    element: 'kim',
    description: 'Kiếm ý ngút trời dẫn động vạn thanh phi kiếm tề xuất, thế không thể cản.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 17000,
    linhThachPerLevel: 1200,
    minNgoTinh: 55,
    powerBonusPerLevel: 750,
    maxLevelPassive: {
      name: 'Vạn Kiếm Quy Nhất',
      description: 'Kiếm ý ngút trời, +750 Công Kích, +30% Sát thương hệ Kim, +15% Bạo Kích.',
      combatBonusPercent: 30,
      critRateBonus: 15
    },
    activeSkill: {
      name: 'Vạn Cương Kiếm Vũ',
      mpCost: 70,
      damageMultiplier: 3.2,
      shieldPercent: 30,
      effectDescription: 'Triệu hoán vạn phi kiếm hộ thân và trút xuống 320% sát thương vô song!'
    },
    priceLinhThach: 36000,
    priceDanhVong: 9000
  },
  {
    id: 'tt_phong_loi_huyen_anh',
    name: 'Phong Lôi Huyễn Ảnh Dực',
    type: 'than_thong',
    grade: 'Huyền Giai',
    element: 'phong',
    description: 'Hóa linh lực thành đôi cánh phong lôi sau lưng, lướt đi trong chớp mắt.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 4200,
    linhThachPerLevel: 300,
    minNgoTinh: 42,
    speedBonusPerLevel: 40,
    maxLevelPassive: {
      name: 'Huyễn Ảnh Lôi Dực',
      description: 'Linh lực hóa cánh phong lôi, +40 Tốc Độ, +12% Né Tránh, +15% Tỉ lệ Đòn Kép.',
      speedBonus: 40,
      dodgeRateBonus: 12,
      doubleStrikeRate: 15
    },
    activeSkill: {
      name: 'Phong Lôi Thiểm Ảnh',
      mpCost: 38,
      damageMultiplier: 1.8,
      shieldPercent: 25,
      effectDescription: 'Lướt đi trong chớp mắt như tia chớp, tạo khiên né tránh 25% và phản kích 180% uy lực!'
    },
    priceLinhThach: 8000,
    priceDanhVong: 2000
  },
  {
    id: 'tt_dinh_than_thuat',
    name: 'Định Thân Thuật',
    type: 'than_thong',
    grade: 'Địa Giai',
    element: 'quang',
    description: 'Phóng xuất thần niệm vô hình khóa chặt thức hải đối phương, khiến địch tê liệt.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 18000,
    linhThachPerLevel: 1300,
    minNgoTinh: 58,
    powerBonusPerLevel: 500,
    maxLevelPassive: {
      name: 'Thần Niệm Trấn Tỏa',
      description: 'Khóa chặt thức hải đối phương, +80 Thần Thức, 20% tỷ lệ khiến đối thủ mất lượt đánh đầu trận.',
      soulBonus: 80,
      stunFirstTurnRate: 20
    },
    activeSkill: {
      name: 'Định Thân Chân Quyết',
      mpCost: 65,
      damageMultiplier: 2.0,
      effectDescription: 'Phóng thần niệm vô hình phong tỏa thần kinh và kinh mạch, gây 200% sát thương tinh thần!'
    },
    priceLinhThach: 38000,
    priceDanhVong: 9500
  },

  // =========================================================================
  // 3. NHÓM CAO GIAI: NGŨ GIAI, LỤC GIAI & THẦN GIAI (Nguyên Anh, Hóa Thần & Đấu Giá Hội)
  // =========================================================================
  {
    id: 'tp_hoa_than_quy_khu',
    name: 'Hóa Thần Quy Khư Điển',
    type: 'tam_phap',
    grade: 'Thần Giai',
    element: 'hon_don',
    description: 'Đạo điển chạm tới quy tắc càn khôn, biến thức hải thành vũ trụ bao la.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 80000,
    linhThachPerLevel: 6000,
    minNgoTinh: 75,
    speedBonusPerLevel: 4.5,
    mpBonusPerLevel: 180,
    maxLevelPassive: {
      name: 'Quy Khư Càn Khôn',
      description: 'Thức hải hóa vũ trụ, +45% Tu Vi/giây, +1,800 Max MP, +200 Thần Thức, giảm 20% nguy cơ Tâm Ma.',
      cultivateSpeedBonus: 45,
      mpBonus: 1800,
      soulBonus: 200,
      tamMaResist: 20
    },
    activeSkill: {
      name: 'Hư Không Quy Khư Trận',
      mpCost: 95,
      damageMultiplier: 3.5,
      shieldPercent: 60,
      effectDescription: 'Khai mở vũ trụ hư không nuốt trọn 60% sát thương và giáng trả 350% sát thương quy tắc!'
    },
    priceLinhThach: 450000,
    priceDanhVong: 35000
  },
  {
    id: 'tt_bat_hoang_bat_diet',
    name: 'Bát Hoang Bất Diệt Thể',
    type: 'the_thuat',
    grade: 'Thần Giai',
    element: 'tho',
    description: 'Nhục thân đạt tới cảnh giới bất diệt, nhỏ một giọt máu có thể tái sinh gân cốt.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 85000,
    linhThachPerLevel: 6500,
    minNgoTinh: 75,
    hpBonusPerLevel: 3000,
    maxLevelPassive: {
      name: 'Tích Huyết Tái Sinh',
      description: 'Cảnh giới bất diệt, +40% Khí Huyết, +35% Phòng Ngự, +8% Miễn Thương, hồi 4% Khí Huyết mỗi hiệp.',
      hpPercentBonus: 40,
      defPercentBonus: 35,
      damageReductionPercent: 8,
      hpRegenPercent: 4
    },
    activeSkill: {
      name: 'Bát Hoang Bất Diệt Cương',
      mpCost: 90,
      shieldPercent: 75,
      damageMultiplier: 2.8,
      effectDescription: 'Nhục thân hóa kim cương bất diệt, tạo khiên 75% và phản chấn 280% uy lực!'
    },
    priceLinhThach: 520000,
    priceDanhVong: 40000
  },
  {
    id: 'tt_thai_so_cuu_kiep_loi',
    name: 'Thái Sơ Cửu Kiếp Lôi',
    type: 'than_thong',
    grade: 'Thiên Giai',
    element: 'loi',
    description: 'Dẫn lôi đình hỗn nguyên của thiên kiếp giáng thế, sát phạt vô song.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 60000,
    linhThachPerLevel: 4500,
    minNgoTinh: 68,
    powerBonusPerLevel: 950,
    maxLevelPassive: {
      name: 'Thiên Kiếp Lôi Phạt',
      description: 'Lôi đình hỗn nguyên, +950 Công Kích, +35% Lôi hệ dmg, +25% Bạo Kích, bỏ qua 30% giáp đối thủ.',
      combatBonusPercent: 35,
      critRateBonus: 25,
      penetrationPercent: 30
    },
    activeSkill: {
      name: 'Cửu Trọng Diệt Thế Lôi',
      mpCost: 85,
      damageMultiplier: 4.2,
      effectDescription: 'Dẫn động thiên kiếp giáng thế cuồng bạo giáng xuống 420% sát thương lôi đình tột đỉnh!'
    },
    priceLinhThach: 210000,
    priceDanhVong: 22000
  },
  {
    id: 'tt_than_ma_nhat_niem',
    name: 'Thần Ma Nhất Niệm Trảm',
    type: 'than_thong',
    grade: 'Thần Giai',
    element: 'am',
    description: 'Một kiếm trảm toái hư không, phân định thần ma, trảm thẳng vào căn nguyên sinh mệnh.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 100000,
    linhThachPerLevel: 8000,
    minNgoTinh: 85,
    powerBonusPerLevel: 1500,
    maxLevelPassive: {
      name: 'Nhất Niệm Sinh Diệt',
      description: 'Trảm toái căn nguyên sinh mệnh, +1,500 Công Kích, +40% ST Bạo Kích, gây 20% Sát Thương Chuẩn.',
      combatBonusPercent: 40,
      critDmgBonus: 40,
      trueDmgPercent: 20
    },
    activeSkill: {
      name: 'Thần Ma Luân Hồi Kiếm',
      mpCost: 110,
      damageMultiplier: 5.5,
      effectDescription: 'Một kiếm trảm toái hư không phân định thần ma, gây 550% sát thương chuẩn xé nát vạn pháp!'
    },
    priceLinhThach: 650000,
    priceDanhVong: 50000
  },

  // =========================================================================
  // 4. NHÓM BÍ TRUYỀN BÁCH NGHỆ & PHỤ TRỢ TIÊN GIA
  // =========================================================================
  {
    id: 'tp_van_thu_ngu_linh',
    name: 'Vạn Thú Ngự Linh Kinh',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    element: 'moc',
    description: 'Bí truyền giao tiếp và thuần hóa thái cổ dị thú, tăng 30% kinh nghiệm nhận được cho Linh Thú xuất chiến và +15% chỉ số hỗ trợ nhân vật.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 4500,
    linhThachPerLevel: 320,
    minNgoTinh: 38,
    speedBonusPerLevel: 1.5,
    maxLevelPassive: {
      name: 'Vạn Thú Cộng Minh',
      description: 'Giao tiếp thuần hóa dị thú viễn cổ, tăng +30% EXP cho Linh Thú xuất chiến và +15% chỉ số hỗ trợ nhân vật.',
      beastExpBonus: 30,
      beastSupportBonus: 15
    },
    activeSkill: {
      name: 'Ngự Linh Hộ Mệnh Thuẫn',
      mpCost: 35,
      shieldPercent: 35,
      damageMultiplier: 1.5,
      effectDescription: 'Dẫn khí tức linh thú hộ thể tạo khiên 35% và phản kích 150% uy lực.'
    },
    priceLinhThach: 9500,
    priceDanhVong: 2200
  },
  {
    id: 'tp_than_nong_bach_thao',
    name: 'Thần Nông Bách Thảo Lục',
    type: 'tam_phap',
    grade: 'Huyền Giai',
    element: 'moc',
    description: 'Tâm đắc dưỡng thảo của Thần Nông thị, rút ngắn 20% thời gian sinh trưởng của Linh Điền và +15% sản lượng thảo dược thu hoạch.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 4200,
    linhThachPerLevel: 300,
    minNgoTinh: 36,
    speedBonusPerLevel: 1.5,
    maxLevelPassive: {
      name: 'Thần Nông Dục Dược',
      description: 'Tâm đắc dưỡng thảo Thần Nông, rút ngắn 20% thời gian sinh trưởng của Linh Điền và +15% sản lượng thảo dược thu hoạch.',
      herbGrowTimeReduce: 20,
      herbYieldBonus: 15
    },
    activeSkill: {
      name: 'Thần Nông Cam Lộ Vũ',
      mpCost: 30,
      shieldPercent: 30,
      damageMultiplier: 1.4,
      effectDescription: 'Mưa cam lộ tẩy uế, tạo khiên 30% và ban sinh lực dồi dào.'
    },
    priceLinhThach: 9000,
    priceDanhVong: 2000
  },
  {
    id: 'tp_to_nu_huyen_kinh',
    name: 'Tố Nữ Huyền Kinh',
    type: 'tam_phap',
    grade: 'Địa Giai',
    element: 'thuy',
    description: 'Điển tịch song tu hợp hoan chính đạo, tăng thêm +25% hiệu quả Tu Vi và buff thuộc tính khi Song Tu cùng Đạo Lữ.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 16000,
    linhThachPerLevel: 1200,
    minNgoTinh: 55,
    speedBonusPerLevel: 2.5,
    maxLevelPassive: {
      name: 'Huyền Âm Song Tu',
      description: 'Điển tịch hợp hoan chính đạo, tăng thêm +25% hiệu quả Tu Vi và buff thuộc tính khi Song Tu cùng Đạo Lữ.',
      companionDualCultivateBonus: 25,
      companionBuffBonus: 25
    },
    activeSkill: {
      name: 'Âm Dương Hòa Hợp Khí',
      mpCost: 55,
      shieldPercent: 45,
      damageMultiplier: 2.2,
      effectDescription: 'Dung hợp âm dương chi khí tạo khiên 45% và bộc phát 220% uy lực song kiếm hợp bích!'
    },
    priceLinhThach: 32000,
    priceDanhVong: 8000
  },
  {
    id: 'tp_bat_quai_khai_thien',
    name: 'Bát Quái Khai Thiên Đồ',
    type: 'tam_phap',
    grade: 'Địa Giai',
    element: 'tho',
    description: 'Đồ phổ diễn giải quy luật bát quái càn khôn, tăng thêm +10% hiệu lực của mọi Tổ Hợp Mệnh Cách (Synergies) đang khảm nạp.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 17000,
    linhThachPerLevel: 1300,
    minNgoTinh: 58,
    speedBonusPerLevel: 2.8,
    maxLevelPassive: {
      name: 'Bát Quái Diễn Thiên',
      description: 'Đồ phổ diễn giải quy luật bát quái, tăng thêm +10% hiệu lực của mọi Tổ Hợp Mệnh Cách (Synergies) đang khảm nạp.',
      destinySynergyBonus: 10
    },
    activeSkill: {
      name: 'Bát Quái Trận Đồ Tỏa',
      mpCost: 60,
      shieldPercent: 50,
      damageMultiplier: 2.4,
      effectDescription: 'Khởi động trận đồ bát quái giam hãm kẻ thù, chặn 50% sát thương và phản chấn 240% sát thương!'
    },
    priceLinhThach: 35000,
    priceDanhVong: 8500
  }
];

export const SECT_MANUALS: Manual[] = [
  // Thanh Vân Môn (Chính Đạo)
  {
    id: 'tp_thanh_van_kiem_dien',
    name: 'Thanh Vân Kiếm Điển',
    type: 'tam_phap',
    grade: 'Thiên Giai',
    element: 'phong',
    description: 'Trấn phái tuyệt học tối cao của Thanh Vân Môn, dung hợp kiếm ý thanh phong và thiên địa tự nhiên.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 65000,
    linhThachPerLevel: 4000,
    minNgoTinh: 65,
    speedBonusPerLevel: 16,
    mpBonusPerLevel: 220,
    maxLevelPassive: {
      name: 'Thanh Vân Kiếm Tâm',
      description: 'Đạo tâm tự nhiên, tăng 40% tốc độ tu luyện và giảm 30% sát thương Tâm Ma.',
      cultivateSpeedBonus: 40,
      tamMaResist: 30
    },
    activeSkill: {
      name: 'Thanh Vân Thần Kiếm Trận',
      mpCost: 75,
      damageMultiplier: 2.8,
      shieldPercent: 50,
      effectDescription: 'Triệu hoán vạn đạo thanh phong kiếm vũ, tạo khiên 50% và bạo phát 280% sát thương phong hệ!'
    }
  },
  {
    id: 'tp_thai_thanh_hoa_than',
    name: 'Thái Thanh Hóa Thần Quyết',
    type: 'tam_phap',
    grade: 'Thiên Giai',
    element: 'ngu_hanh',
    description: 'Trấn phái tâm pháp của Thái Thanh Tiên Môn, đạo pháp tự nhiên, linh lực tuần hoàn viên dung.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 65000,
    linhThachPerLevel: 4000,
    minNgoTinh: 65,
    speedBonusPerLevel: 15,
    mpBonusPerLevel: 200,
    maxLevelPassive: {
      name: 'Thái Thanh Đạo Thể',
      description: 'Đạo tâm thuần khiết, tăng 40% tốc độ tu luyện và giảm 50% nguy cơ gặp Tâm Ma.',
      cultivateSpeedBonus: 40,
      tamMaResist: 50
    },
    activeSkill: {
      name: 'Thái Thanh Thần Quang Thuẫn',
      mpCost: 70,
      damageMultiplier: 2.2,
      shieldPercent: 60,
      effectDescription: 'Đạo quang hộ thể tạo khiên 60% và phản sát thương 220% uy lực.'
    }
  },
  {
    id: 'tt_cuu_thien_huyen_loi',
    name: 'Cửu Thiên Huyền Lôi Ấn',
    type: 'than_thong',
    grade: 'Địa Giai',
    element: 'loi',
    description: 'Thần thông chánh tông hàng yêu phục ma, dẫn động thiên lôi cửu trùng trấn áp tà khí.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 25000,
    linhThachPerLevel: 1800,
    minNgoTinh: 50,
    powerBonusPerLevel: 9500,
    maxLevelPassive: {
      name: 'Huyền Lôi Phạt Ma',
      description: 'Lôi đình tẩy uế, tăng 25% sát thương lên Boss và quái vật.',
      combatBonusPercent: 25
    },
    activeSkill: {
      name: 'Cửu Trọng Lôi Kiếp Giáng Thế',
      mpCost: 65,
      damageMultiplier: 2.8,
      effectDescription: 'Lôi kiếp giáng lâm hủy diệt yêu ma, gây 280% sát thương lôi bạo liệt!'
    }
  },

  // Huyết Sát Tông (Ma Đạo)
  {
    id: 'tp_huyet_than_kinh',
    name: 'Huyết Thần Kinh',
    type: 'tam_phap',
    grade: 'Thiên Giai',
    element: 'am',
    description: 'Trấn phái cấm kỵ ma điển của Huyết Sát Tông, lấy huyết hóa thần, sát sinh luyện đạo, sát thương kinh thiên động địa.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 72000,
    linhThachPerLevel: 4500,
    minNgoTinh: 60,
    speedBonusPerLevel: 16,
    mpBonusPerLevel: 220,
    maxLevelPassive: {
      name: 'Huyết Thần Bất Tử',
      description: 'Huyết khí sôi trào, tăng 40% sát thương công kích và hút 15% sinh lực từ sát thương gây ra.',
      combatBonusPercent: 40,
      hpPercentBonus: 30
    },
    activeSkill: {
      name: 'Huyết Thần Cuồng Nộ Sát',
      mpCost: 85,
      damageMultiplier: 3.5,
      shieldPercent: 40,
      effectDescription: 'Hóa thân Huyết Thần bạo phát 350% sát thương bạo liệt và hồi phục 40% Khí Huyết!'
    }
  },
  {
    id: 'tp_thien_ma_thon_thien',
    name: 'Thiên Ma Thôn Thiên Quyết',
    type: 'tam_phap',
    grade: 'Thiên Giai',
    element: 'am',
    description: 'Bá đạo ma công của Cửu U Ma Tông, thôn phệ vạn linh hóa thành ma nguyên tinh thuần.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 70000,
    linhThachPerLevel: 4500,
    minNgoTinh: 60,
    speedBonusPerLevel: 16,
    mpBonusPerLevel: 220,
    maxLevelPassive: {
      name: 'Thiên Ma Huyết Tế',
      description: 'Hấp thu huyết khí bồi bổ bản nguyên, tăng 35% Khí Huyết và 15% Sát Thương.',
      hpPercentBonus: 35,
      combatBonusPercent: 15
    },
    activeSkill: {
      name: 'Thôn Thiên Ma Cực Chưởng',
      mpCost: 80,
      damageMultiplier: 3.2,
      shieldPercent: 40,
      effectDescription: 'Hóa thành ma ảnh khổng lồ hút 40% huyết khí đối phương và giáng 320% sát thương!'
    }
  },
  {
    id: 'tt_tu_la_huyet_sat',
    name: 'Tu La Huyết Sát Kiếm',
    type: 'than_thong',
    grade: 'Thần Giai',
    element: 'am',
    description: 'Sát kiếm chí tôn từ Tu La Giới, mỗi kiếm chém ra biển máu ngập trời, vạn vật thành tro.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 110000,
    linhThachPerLevel: 8000,
    minNgoTinh: 75,
    powerBonusPerLevel: 42000,
    maxLevelPassive: {
      name: 'Tu La Tuyệt Sát',
      description: 'Sát ý ngập trời, tăng vĩnh viễn 45% sát thương toàn diện.',
      combatBonusPercent: 45
    },
    activeSkill: {
      name: 'Huyết Hải Tu La Trảm',
      mpCost: 110,
      damageMultiplier: 5.5,
      effectDescription: 'Khai mở huyết ngục tu la chém nát vạn dặm, bạo phát 550% sát thương hủy thiên diệt địa!'
    }
  },

  // Thiên Kiếm Sơn
  {
    id: 'tp_van_kiem_quy_tong',
    name: 'Vạn Kiếm Quy Tông Kinh',
    type: 'tam_phap',
    grade: 'Thiên Giai',
    element: 'kim',
    description: 'Tuyệt đỉnh kiếm kinh biến chân nguyên thành ngàn vạn kiếm ý lượn quanh bảo vệ tu sĩ.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 68000,
    linhThachPerLevel: 4200,
    minNgoTinh: 70,
    speedBonusPerLevel: 17,
    mpBonusPerLevel: 210,
    maxLevelPassive: {
      name: 'Kiếm Đạo Đỉnh Phong',
      description: 'Kiếm ý thông linh, tăng 35% tốc độ tu luyện và +20% Sát Thương Bạo Kích.',
      cultivateSpeedBonus: 35,
      combatBonusPercent: 20
    },
    activeSkill: {
      name: 'Vạn Kiếm Hộ Thân Trận',
      mpCost: 75,
      damageMultiplier: 2.6,
      shieldPercent: 50,
      effectDescription: 'Dựng vạn thanh kiếm cương bảo hộ 50% sát thương và phản kích 260% uy lực.'
    }
  },
  {
    id: 'tt_nhat_kiem_pha_van_phap',
    name: 'Nhất Kiếm Phá Vạn Pháp',
    type: 'than_thong',
    grade: 'Thần Giai',
    element: 'kim',
    description: 'Đỉnh phong thần thông của Kiếm Tu, đạt tới cảnh giới vô thượng nhất kiếm toái hư không.',
    level: 0,
    maxLevel: 10,
    tuViPerLevel: 120000,
    linhThachPerLevel: 8500,
    minNgoTinh: 85,
    powerBonusPerLevel: 45000,
    maxLevelPassive: {
      name: 'Vô Địch Kiếm Ý',
      description: 'Kiếm ý phá vỡ mọi quy tắc thế gian, tăng 50% sát thương chiến đấu.',
      combatBonusPercent: 50
    },
    activeSkill: {
      name: 'Thần Kiếm Trảm Toái Hư Không',
      mpCost: 120,
      damageMultiplier: 6.0,
      effectDescription: 'Nhất kiếm xuất, thiên địa tịch diệt! Gây 600% sát thương chuẩn bạo kích vô địch!'
    }
  }
];

// Dữ liệu Phó Bản Bí Cảnh Thám Hiểm Đa Tầng
export const SECRET_REALM_DUNGEONS: SecretRealmDungeon[] = [
  {
    id: 'bicanh_rung_truc',
    name: 'Bí Cảnh Rừng Trúc U Tịch',
    minRealm: 0,
    realmName: 'Phàm Nhân / Luyện Khí',
    mpCost: 15,
    totalFloors: 3,
    description: 'Rừng trúc cổ thụ bao phủ bởi màn sương độc và tàn tích trận pháp cổ xưa của ẩn sĩ tu tiên.',
    hazards: ['Độc Chướng Trúc Lâm', 'Thanh Xà Tập Kích', 'Mê Tung Cổ Trận'],
    rewardsPreview: 'Tụ Linh Thảo, Huyền Thiết, Túi Linh Thạch, Tàn Trang Tụ Khí Quyết'
  },
  {
    id: 'bicanh_hoa_diem_son',
    name: 'Hỏa Diệm Sơn Cổ Giới',
    minRealm: 7,
    realmName: 'Trúc Cơ / Kim Đan',
    mpCost: 30,
    totalFloors: 5,
    description: 'Vùng đất dung nham sôi sục dưới lòng đất sâu, nơi chôn vùi bảo tàng của Xích Diễm Hỏa Tộc.',
    hazards: ['Dung Nham Bộc Phát', 'Hỏa Nha Cuồng Bạo', 'Hãm Địa Viêm Hỏa Trận'],
    rewardsPreview: 'Huyết Tinh Thảo, Hàn Băng Thần Tinh, Bí Tịch Huyền Giai, Linh Thạch phong phú'
  },
  {
    id: 'bicanh_van_kiem_trung',
    name: 'Vạn Kiếm Trũng Cổ Mộ',
    minRealm: 17,
    realmName: 'Nguyên Anh / Hóa Thần',
    mpCost: 50,
    totalFloors: 7,
    description: 'Nơi an nghỉ của vạn thanh bảo kiếm cổ đại, kiếm khí vẫn tung hoành sau hàng vạn năm.',
    hazards: ['Kiếm Khí Loạn Lưu', 'Kiếm Ma Oán Hồn', 'Tru Tiên Tàn Trận Cổ'],
    rewardsPreview: 'Thái Ất Tinh Kim, Tẩy Tủy Linh Chi, Bí Tịch Vạn Kiếm Quy Tông, Rương Tiên Ngọc'
  },
  {
    id: 'bicanh_hu_khong_phe_tich',
    name: 'Hư Không Phế Tích Vực Ngoại',
    minRealm: 27,
    realmName: 'Luyện Hư / Hợp Thể Trở Lên',
    mpCost: 80,
    totalFloors: 9,
    description: 'Di tích cung điện trôi nổi ngoài rìa không gian, nguy cơ thời không vặn xoắn và cổ ma ẩn nấp.',
    hazards: ['Hư Không Phong Bạo', 'Phệ Hồn Trùng Quần', 'Thời Không Loạn Lưu Vực'],
    rewardsPreview: 'Cửu U Minh Thạch, Hóa Thần Linh Diệp, Thần Đan, Bí Tịch Thiên Giai'
  }
];
