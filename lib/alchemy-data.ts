// lib/alchemy-data.ts
// Dữ liệu Đan Dược, Dược Liệu, Khoáng Thạch và Trang Bị Tiên Hiệp

import { Herb, DanRecipe, Pill, Ore, EquipRecipe, Equipment } from '@/lib/types';

export const DEFAULT_HERBS: Herb[] = [
  {
    id: 'linh_thao',
    name: 'Bách Thảo Sơ Thiên',
    grade: 'Nhất Giai',
    description: 'Dược thảo cơ bản chứa linh khí đất trời, sinh trưởng ven suối linh tuyền.',
    price: 30,
    quantity: 0
  },
  {
    id: 'huyet_tinh_thao',
    name: 'Huyết Tinh Thảo',
    grade: 'Nhị Giai',
    description: 'Thân cây đỏ thắm như máu, hấp thụ huyết khí dồi dào, dùng luyện chế đan dược hồi sinh.',
    price: 60,
    quantity: 0
  },
  {
    id: 'tu_khi_hoa',
    name: 'Tụ Khí Thanh Hoa',
    grade: 'Nhị Giai',
    description: 'Đóa hoa màu lam nhạt, có khả năng ngưng tụ chân nguyên thiên địa xung quanh.',
    price: 80,
    quantity: 0
  },
  {
    id: 'tay_tuy_linh_nhi',
    name: 'Tẩy Tủy Linh Chi',
    grade: 'Tam Giai',
    description: 'Nấm linh chi ngàn năm mọc trên vách đá hiểm trở, giúp thanh lọc tạp chất cốt tủy.',
    price: 250,
    quantity: 0
  },
  {
    id: 'cuong_bao_hoa',
    name: 'Cuồng Bạo Ma Hoa',
    grade: 'Tam Giai',
    description: 'Loài hoa sinh trưởng gần cấm địa yêu thú, kích phát tiềm năng huyết mạch bạo liệt.',
    price: 200,
    quantity: 0
  },
  {
    id: 'truc_co_chi_lan',
    name: 'Trúc Cơ Chi Lan',
    grade: 'Tứ Giai',
    description: 'Tiên thảo quý hiếm chuyên dùng luyện chế Trúc Cơ Đan phá vỡ bình cảnh phàm nhân.',
    price: 450,
    quantity: 0
  },
  {
    id: 'hoa_than_linh_diep',
    name: 'Hóa Thần Linh Diệp',
    grade: 'Ngũ Giai',
    description: 'Lá cây thần mộc mang theo linh thức viễn cổ, hỗ trợ thần hồn hóa hình.',
    price: 1200,
    quantity: 0
  },
  {
    id: 'cuu_chuyen_ngoc_tuy',
    name: 'Cửu Chuyển Ngọc Tủy',
    grade: 'Thần Giai',
    description: 'Ngọc tủy ngưng kết từ địa mạch trăm vạn năm, báu vật luyện chế thần đan thượng thừa.',
    price: 3000,
    quantity: 0
  }
];

export const DAN_RECIPES: DanRecipe[] = [
  {
    id: 'recipe_tich_coc',
    name: 'Tích Cốc Đan',
    pillId: 'pill_tich_coc',
    pillName: 'Thanh Khí Tích Cốc Đan',
    grade: 'Nhất Giai',
    herbsRequired: [
      { herbId: 'linh_thao', herbName: 'Bách Thảo Sơ Thiên', count: 2 }
    ],
    linhThachCost: 30,
    baseSuccessRate: 95,
    description: 'Ích khí trừ tạp, 1 viên duy trì bế quan 1 năm mà không cần ăn uống ngũ cốc.'
  },
  {
    id: 'recipe_tho_nguyen_1',
    name: 'Duyên Thọ Đan',
    pillId: 'pill_tho_nguyen_1',
    pillName: 'Nhất Giai Duyên Thọ Đan',
    grade: 'Nhị Giai',
    herbsRequired: [
      { herbId: 'huyet_tinh_thao', herbName: 'Huyết Tinh Thảo', count: 3 },
      { herbId: 'linh_thao', herbName: 'Bách Thảo Sơ Thiên', count: 2 }
    ],
    linhThachCost: 150,
    baseSuccessRate: 80,
    description: 'Bồi bổ nguyên khí, gia tăng thêm +50 năm thọ nguyên cho người tu tiên.'
  },
  {
    id: 'recipe_tho_nguyen_2',
    name: 'Diên Niên Đan',
    pillId: 'pill_tho_nguyen_2',
    pillName: 'Nhị Giai Cố Bản Diên Niên Đan',
    grade: 'Tam Giai',
    herbsRequired: [
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 2 },
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 2 }
    ],
    linhThachCost: 400,
    baseSuccessRate: 70,
    description: 'Uẩn dưỡng lục phủ ngũ tạng, kéo dài thêm +100 năm thọ nguyên.'
  },
  {
    id: 'recipe_hoi_thien',
    name: 'Hồi Thiên Đan',
    pillId: 'pill_hoi_thien',
    pillName: 'Hồi Thiên Tục Mệnh Đan',
    grade: 'Nhị Giai',
    herbsRequired: [
      { herbId: 'huyet_tinh_thao', herbName: 'Huyết Tinh Thảo', count: 2 },
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 2 }
    ],
    linhThachCost: 100,
    baseSuccessRate: 85,
    description: 'Uống vào lập tức hồi phục 100% Khí Huyết (HP) và Chân Nguyên (MP).'
  },
  {
    id: 'recipe_cuong_bao',
    name: 'Cuồng Bạo Đan',
    pillId: 'pill_cuong_bao',
    pillName: 'Bát Hoang Cuồng Bạo Đan',
    grade: 'Tam Giai',
    herbsRequired: [
      { herbId: 'cuong_bao_hoa', herbName: 'Cuồng Bạo Ma Hoa', count: 2 },
      { herbId: 'linh_thao', herbName: 'Bách Thảo Sơ Thiên', count: 3 }
    ],
    linhThachCost: 200,
    baseSuccessRate: 75,
    description: 'Kích phát chiến ý bạo liệt, tăng +20% Sát Thương Chiến Đấu trong 3 trận chiến kế tiếp.'
  },
  {
    id: 'recipe_tay_tuy',
    name: 'Tẩy Tủy Đan',
    pillId: 'pill_tay_tuy',
    pillName: 'Cửu Chuyển Tẩy Tủy Đan',
    grade: 'Tam Giai',
    herbsRequired: [
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 2 },
      { herbId: 'huyet_tinh_thao', herbName: 'Huyết Tinh Thảo', count: 2 }
    ],
    linhThachCost: 350,
    baseSuccessRate: 70,
    description: 'Rửa sạch tạp chất kinh mạch, tăng vĩnh viễn +2 điểm Căn Cốt hoặc Ngộ Tính ngẫu nhiên.'
  },
  {
    id: 'recipe_truc_co',
    name: 'Trúc Cơ Đan',
    pillId: 'pill_truc_co',
    pillName: 'Cửu Phẩm Trúc Cơ Đan',
    grade: 'Tứ Giai',
    herbsRequired: [
      { herbId: 'truc_co_chi_lan', herbName: 'Trúc Cơ Chi Lan', count: 2 },
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 3 }
    ],
    linhThachCost: 500,
    baseSuccessRate: 65,
    description: 'Tăng thẳng +20% tỉ lệ thành công khi đột phá cảnh giới kế tiếp.'
  },
  {
    id: 'recipe_hoa_than',
    name: 'Hóa Thần Đan',
    pillId: 'pill_hoa_than',
    pillName: 'Thái Hư Hóa Thần Đan',
    grade: 'Ngũ Giai',
    herbsRequired: [
      { herbId: 'hoa_than_linh_diep', herbName: 'Hóa Thần Linh Diệp', count: 2 },
      { herbId: 'cuu_chuyen_ngoc_tuy', herbName: 'Cửu Chuyển Ngọc Tủy', count: 1 }
    ],
    linhThachCost: 1500,
    baseSuccessRate: 55,
    description: 'Thần đan vô giá, tăng thẳng +30% tỉ lệ thành công khi đột phá cảnh giới kế tiếp.'
  },
  {
    id: 'recipe_khi_huyet',
    name: 'Khí Huyết Đan',
    pillId: 'pill_khi_huyet',
    pillName: 'Thần Nông Khí Huyết Đan',
    grade: 'Nhị Giai',
    herbsRequired: [
      { herbId: 'huyet_tinh_thao', herbName: 'Huyết Tinh Thảo', count: 3 },
      { herbId: 'linh_thao', herbName: 'Bách Thảo Sơ Thiên', count: 2 }
    ],
    linhThachCost: 120,
    baseSuccessRate: 85,
    description: 'Dược liệu chủ chốt dùng trong nghi thức Tôi Thể (Body Refinement) hoặc hồi phục 50% Khí Huyết.'
  },
  {
    id: 'recipe_tay_linh',
    name: 'Tẩy Linh Đan',
    pillId: 'pill_tay_linh',
    pillName: 'Cửu Khiếu Tẩy Linh Đan',
    grade: 'Tứ Giai',
    herbsRequired: [
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 2 },
      { herbId: 'truc_co_chi_lan', herbName: 'Trúc Cơ Chi Lan', count: 1 },
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 2 }
    ],
    linhThachCost: 400,
    baseSuccessRate: 70,
    description: 'Bảo đan tinh lọc tạp chất linh căn, tăng độ tinh khiết và thăng hoa phẩm cấp Linh Căn.'
  },
  {
    id: 'recipe_cai_menh',
    name: 'Cải Mệnh Đan',
    pillId: 'pill_cai_menh',
    pillName: 'Cửu Chuyển Cải Mệnh Đan',
    grade: 'Ngũ Giai',
    herbsRequired: [
      { herbId: 'cuu_chuyen_ngoc_tuy', herbName: 'Cửu Chuyển Ngọc Tủy', count: 2 },
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 2 },
      { herbId: 'hoa_than_linh_diep', herbName: 'Hóa Thần Linh Diệp', count: 1 }
    ],
    linhThachCost: 800,
    baseSuccessRate: 65,
    description: 'Thần đan nghịch chuyển càn khôn âm dương, dùng trong nghi thức Tế Thiên Cải Mệnh tái tạo Mệnh Cách.'
  },
  {
    id: 'recipe_dinh_than',
    name: 'Định Thần Đan',
    pillId: 'pill_dinh_than',
    pillName: 'U Hồn Định Thần Đan',
    grade: 'Tam Giai',
    herbsRequired: [
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 2 },
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 1 },
      { herbId: 'linh_thao', herbName: 'Bách Thảo Sơ Thiên', count: 2 }
    ],
    linhThachCost: 200,
    baseSuccessRate: 80,
    description: 'Bảo đan ôn dưỡng thức hải, là kỳ dược dùng để Ngưng Hồn Thăng Hoa trong con đường Hồn Tu.'
  }
];

export const SECT_DAN_RECIPES: DanRecipe[] = [
  {
    id: 'recipe_thai_thanh_quy_nguyen',
    name: 'Thái Thanh Quy Nguyên Đan',
    pillId: 'pill_thai_thanh_quy_nguyen',
    pillName: 'Thái Thanh Quy Nguyên Đan',
    grade: 'Tam Giai',
    herbsRequired: [
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 3 },
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 1 }
    ],
    linhThachCost: 300,
    baseSuccessRate: 80,
    description: 'Chính Đạo bí đan hồi phục 100% Chân Nguyên (MP) và tăng vĩnh viễn +3 điểm Ngộ Tính.'
  },
  {
    id: 'recipe_bach_ngoc_pha_chuong',
    name: 'Bạch Ngọc Phá Chướng Đan',
    pillId: 'pill_bach_ngoc_pha_chuong',
    pillName: 'Bạch Ngọc Phá Chướng Thần Đan',
    grade: 'Ngũ Giai',
    herbsRequired: [
      { herbId: 'truc_co_chi_lan', herbName: 'Trúc Cơ Chi Lan', count: 2 },
      { herbId: 'hoa_than_linh_diep', herbName: 'Hóa Thần Linh Diệp', count: 2 }
    ],
    linhThachCost: 1200,
    baseSuccessRate: 60,
    description: 'Chí bảo đan dược xua tan chướng ngại đan điền, tăng thẳng +35% tỉ lệ đột phá cảnh giới.'
  },
  {
    id: 'recipe_huyet_ma_bao_the',
    name: 'Huyết Ma Bạo Thể Đan',
    pillId: 'pill_huyet_ma_bao_the',
    pillName: 'Huyết Ma Bạo Thể Đan',
    grade: 'Tam Giai',
    herbsRequired: [
      { herbId: 'huyet_tinh_thao', herbName: 'Huyết Tinh Thảo', count: 4 },
      { herbId: 'cuong_bao_hoa', herbName: 'Cuồng Bạo Ma Hoa', count: 2 }
    ],
    linhThachCost: 350,
    baseSuccessRate: 80,
    description: 'Kích phát cuồng huyết ma tính, tăng +25% Sát Thương Chiến Đấu trong 5 trận kế tiếp.'
  },
  {
    id: 'recipe_cuu_u_hoa_cot',
    name: 'Cửu U Hóa Cốt Thần Đan',
    pillId: 'pill_cuu_u_hoa_cot',
    pillName: 'Cửu U Hóa Cốt Thần Đan',
    grade: 'Ngũ Giai',
    herbsRequired: [
      { herbId: 'cuong_bao_hoa', herbName: 'Cuồng Bạo Ma Hoa', count: 3 },
      { herbId: 'cuu_chuyen_ngoc_tuy', herbName: 'Cửu Chuyển Ngọc Tủy', count: 1 }
    ],
    linhThachCost: 1500,
    baseSuccessRate: 60,
    description: 'Ma đạo bí thuật tôi luyện xương tủy, tăng vĩnh viễn +5 điểm Căn Cốt và hồi sinh khí huyết.'
  },
  {
    id: 'recipe_kiem_y_thong_linh',
    name: 'Kiếm Ý Thông Linh Đan',
    pillId: 'pill_kiem_y_thong_linh',
    pillName: 'Kiếm Ý Thông Linh Đan',
    grade: 'Tứ Giai',
    herbsRequired: [
      { herbId: 'linh_thao', herbName: 'Bách Thảo Sơ Thiên', count: 5 },
      { herbId: 'truc_co_chi_lan', herbName: 'Trúc Cơ Chi Lan', count: 2 }
    ],
    linhThachCost: 600,
    baseSuccessRate: 70,
    description: 'Kiếm ý quán triệt kinh mạch, tăng vĩnh viễn +5% Tỉ Lệ Bạo Kích và +20% Sát Thương Bạo.'
  },
  {
    id: 'recipe_hu_khong_tram_kiem',
    name: 'Hư Không Trảm Kiếm Đan',
    pillId: 'pill_hu_khong_tram_kiem',
    pillName: 'Hư Không Trảm Kiếm Đan',
    grade: 'Ngũ Giai',
    herbsRequired: [
      { herbId: 'hoa_than_linh_diep', herbName: 'Hóa Thần Linh Diệp', count: 2 },
      { herbId: 'cuu_chuyen_ngoc_tuy', herbName: 'Cửu Chuyển Ngọc Tủy', count: 1 }
    ],
    linhThachCost: 1800,
    baseSuccessRate: 60,
    description: 'Kiếm khí ngưng tụ thực chất, tăng vĩnh viễn +15 Tốc Độ và +200 Sát Thương Công Kích.'
  },
  {
    id: 'recipe_truc_co_cuc_pham',
    name: 'Đan Phương: Trúc Cơ Cực Phẩm Đan',
    pillId: 'pill_truc_co_cuc_pham',
    pillName: 'Trúc Cơ Cực Phẩm Thần Đan',
    grade: 'Tứ Giai',
    herbsRequired: [
      { herbId: 'truc_co_chi_lan', herbName: 'Trúc Cơ Chi Lan', count: 3 },
      { herbId: 'tay_tuy_linh_nhi', herbName: 'Tẩy Tủy Linh Chi', count: 2 },
      { herbId: 'tu_khi_hoa', herbName: 'Tụ Khí Thanh Hoa', count: 2 }
    ],
    linhThachCost: 800,
    baseSuccessRate: 85,
    description: 'Thần đan Trúc Cơ thượng cổ của Thanh Vân Môn, đảm bảo 100% thành công khi phá cảnh Trúc Cơ.'
  },
  {
    id: 'recipe_pha_canh_dan',
    name: 'Đan Phương: Cực Phẩm Phá Cảnh Đan',
    pillId: 'pill_pha_canh_dan',
    pillName: 'Thần Bí Phá Cảnh Đan',
    grade: 'Tứ Giai',
    herbsRequired: [
      { herbId: 'cuong_bao_hoa', herbName: 'Cuồng Bạo Ma Hoa', count: 3 },
      { herbId: 'huyet_tinh_thao', herbName: 'Huyết Tinh Thảo', count: 3 },
      { herbId: 'truc_co_chi_lan', herbName: 'Trúc Cơ Chi Lan', count: 2 }
    ],
    linhThachCost: 900,
    baseSuccessRate: 80,
    description: 'Đan phương hung mãnh của Huyết Sát Tông, phá vỡ mọi bức tường bình cảnh, tăng +30% tỉ lệ đột phá.'
  }
];

export const PILL_TEMPLATES: Record<string, Pill> = {
  pill_truc_co_cuc_pham: {
    id: 'pill_truc_co_cuc_pham',
    name: 'Trúc Cơ Cực Phẩm Thần Đan',
    grade: 'Tứ Giai',
    description: 'Thần đan Trúc Cơ thượng cổ bảo chứng phá cảnh hoàn mỹ, tăng +50% tỉ lệ thành công khi đột phá.',
    effectType: 'breakthrough_bonus',
    effectValue: 50,
    quantity: 1,
    quality: 'cuc_pham'
  },
  pill_pha_canh_dan: {
    id: 'pill_pha_canh_dan',
    name: 'Thần Bí Phá Cảnh Đan',
    grade: 'Tứ Giai',
    description: 'Đan dược phá vỡ bình cảnh, tăng thẳng +30% tỉ lệ thành công khi đột phá cảnh giới kế tiếp.',
    effectType: 'breakthrough_bonus',
    effectValue: 30,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_cai_menh: {
    id: 'pill_cai_menh',
    name: 'Cửu Chuyển Cải Mệnh Đan',
    grade: 'Ngũ Giai',
    description: 'Thần đan nghịch thiên, dùng trong nghi thức Tế Thiên Bói Quẻ, tái tạo Mệnh Cách Tiên Thiên.',
    effectType: 'destiny_reroll',
    effectValue: 1,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_tich_coc: {
    id: 'pill_tich_coc',
    name: 'Thanh Khí Tích Cốc Đan',
    grade: 'Nhất Giai',
    description: 'Ích khí trừ tạp, 1 viên duy trì bế quan 1 năm mà không cần ăn uống ngũ cốc.',
    effectType: 'sustain',
    effectValue: 1,
    quantity: 10,
    quality: 'thuong_pham'
  },
  pill_tho_nguyen_1: {
    id: 'pill_tho_nguyen_1',
    name: 'Nhất Giai Duyên Thọ Đan',
    grade: 'Nhị Giai',
    description: 'Bồi bổ nguyên khí, gia tăng thêm +50 năm thọ mệnh.',
    effectType: 'lifespan',
    effectValue: 50,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_tho_nguyen_2: {
    id: 'pill_tho_nguyen_2',
    name: 'Nhị Giai Cố Bản Diên Niên Đan',
    grade: 'Tam Giai',
    description: 'Uẩn dưỡng lục phủ ngũ tạng, kéo dài thêm +100 năm thọ nguyên.',
    effectType: 'lifespan',
    effectValue: 100,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_tho_nguyen_3: {
    id: 'pill_tho_nguyen_3',
    name: 'Tam Giai Vạn Thọ Vô Cương Đan',
    grade: 'Tứ Giai',
    description: 'Bảo đan thượng cổ, kéo dài thêm +300 năm thọ nguyên cho tu sĩ.',
    effectType: 'lifespan',
    effectValue: 300,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_tho_nguyen_4: {
    id: 'pill_tho_nguyen_4',
    name: 'Tứ Giai Bất Lão Trường Sinh Đan',
    grade: 'Ngũ Giai',
    description: 'Thần đan nghịch thiên cải mệnh, gia tăng thêm +1,000 năm thọ nguyên vô song!',
    effectType: 'lifespan',
    effectValue: 1000,
    quantity: 1,
    quality: 'cuc_pham'
  },
  pill_hoi_thien: {
    id: 'pill_hoi_thien',
    name: 'Hồi Thiên Tục Mệnh Đan',
    grade: 'Nhị Giai',
    description: 'Uống vào lập tức hồi phục 100% Khí Huyết và Linh Lực.',
    effectType: 'full_heal',
    effectValue: 100,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_khi_huyet: {
    id: 'pill_khi_huyet',
    name: 'Thần Nông Khí Huyết Đan',
    grade: 'Nhị Giai',
    description: 'Đan dược trân quý dùng Tôi Thể nhục thân hoặc hồi phục 50% Khí Huyết.',
    effectType: 'body_refinement',
    effectValue: 50,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_tay_linh: {
    id: 'pill_tay_linh',
    name: 'Cửu Khiếu Tẩy Linh Đan',
    grade: 'Tứ Giai',
    description: 'Bảo đan tẩy rửa tạp chất, thăng hoa phẩm chất Linh Căn lên cảnh giới cao hơn.',
    effectType: 'root_evolution',
    effectValue: 20,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_cuong_bao: {
    id: 'pill_cuong_bao',
    name: 'Bát Hoang Cuồng Bạo Đan',
    grade: 'Tam Giai',
    description: 'Kích phát chiến ý bạo liệt, tăng +20% Sát Thương Chiến Đấu trong 3 trận chiến kế tiếp.',
    effectType: 'combat_buff',
    effectValue: 20,
    durationBattles: 3,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_tay_tuy: {
    id: 'pill_tay_tuy',
    name: 'Cửu Chuyển Tẩy Tủy Đan',
    grade: 'Tam Giai',
    description: 'Rửa sạch tạp chất kinh mạch, tăng vĩnh viễn +2 điểm Căn Cốt hoặc Ngộ Tính ngẫu nhiên.',
    effectType: 'permanent_stat',
    effectValue: 2,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_truc_co: {
    id: 'pill_truc_co',
    name: 'Cửu Phẩm Trúc Cơ Đan',
    grade: 'Tứ Giai',
    description: 'Tăng thẳng +20% tỉ lệ thành công khi đột phá cảnh giới kế tiếp.',
    effectType: 'breakthrough_bonus',
    effectValue: 20,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_hoa_than: {
    id: 'pill_hoa_than',
    name: 'Thái Hư Hóa Thần Đan',
    grade: 'Ngũ Giai',
    description: 'Thần đan vô giá, tăng thẳng +30% tỉ lệ thành công khi đột phá cảnh giới kế tiếp.',
    effectType: 'breakthrough_bonus',
    effectValue: 30,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_thai_thanh_quy_nguyen: {
    id: 'pill_thai_thanh_quy_nguyen',
    name: 'Thái Thanh Quy Nguyên Đan',
    grade: 'Tam Giai',
    description: 'Hồi phục 100% Chân Nguyên (MP) và tăng vĩnh viễn +3 điểm Ngộ Tính.',
    effectType: 'permanent_stat',
    statTarget: 'ngoTinh',
    effectValue: 3,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_bach_ngoc_pha_chuong: {
    id: 'pill_bach_ngoc_pha_chuong',
    name: 'Bạch Ngọc Phá Chướng Thần Đan',
    grade: 'Ngũ Giai',
    description: 'Thần đan xua tan chướng ngại, tăng thẳng +35% tỉ lệ thành công khi đột phá cảnh giới.',
    effectType: 'breakthrough_bonus',
    effectValue: 35,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_huyet_ma_bao_the: {
    id: 'pill_huyet_ma_bao_the',
    name: 'Huyết Ma Bạo Thể Đan',
    grade: 'Tam Giai',
    description: 'Kích phát cuồng huyết ma tính, tăng +25% Sát Thương Chiến Đấu trong 5 trận chiến kế tiếp.',
    effectType: 'combat_buff',
    effectValue: 25,
    durationBattles: 5,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_cuu_u_hoa_cot: {
    id: 'pill_cuu_u_hoa_cot',
    name: 'Cửu U Hóa Cốt Thần Đan',
    grade: 'Ngũ Giai',
    description: 'Uống vào tăng vĩnh viễn +5 điểm Căn Cốt và phục hồi đầy Khí Huyết.',
    effectType: 'permanent_stat',
    statTarget: 'canCot',
    effectValue: 5,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_kiem_y_thong_linh: {
    id: 'pill_kiem_y_thong_linh',
    name: 'Kiếm Ý Thông Linh Đan',
    grade: 'Tứ Giai',
    description: 'Kiếm ý nhập thể, tăng vĩnh viễn +5% Bạo Kích và +20% Sát Thương Bạo.',
    effectType: 'combat_buff',
    effectValue: 5,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_hu_khong_tram_kiem: {
    id: 'pill_hu_khong_tram_kiem',
    name: 'Hư Không Trảm Kiếm Đan',
    grade: 'Ngũ Giai',
    description: 'Kiếm khí phá toái hư không, tăng vĩnh viễn +15 Tốc Độ và +200 Công Kích.',
    effectType: 'combat_buff',
    effectValue: 15,
    quantity: 1,
    quality: 'thuong_pham'
  },
  pill_dinh_than: {
    id: 'pill_dinh_than',
    name: 'U Hồn Định Thần Đan',
    grade: 'Tam Giai',
    description: 'Bảo đan an thần ngưng phách, hỗ trợ tu luyện Thần Hồn và hồi phục 50% Linh Lực.',
    effectType: 'permanent_stat',
    statTarget: 'tamCanh',
    effectValue: 3,
    quantity: 1,
    quality: 'thuong_pham'
  },
  item_duong_than_dan: {
    id: 'item_duong_than_dan',
    name: 'Dưỡng Thần Đan',
    grade: 'Tam Giai',
    description: 'Bảo đan an thần ngưng phách, tẩm bổ thức hải, bồi đắp thần niệm và tu luyện Thần Hồn.',
    effectType: 'permanent_stat',
    statTarget: 'thanThuc',
    effectValue: 5,
    quantity: 1,
    quality: 'thuong_pham'
  }
};

export const DEFAULT_PILLS: Pill[] = Object.values(PILL_TEMPLATES);

export const DEFAULT_ORES: Ore[] = [
  {
    id: 'item_u_hon_thach',
    name: 'U Hồn Thạch',
    grade: 'Tam Giai',
    description: 'Khoáng thạch hấp thụ linh hồn tinh hoa nơi u minh âm sát, là bảo vật cốt lõi để tôi luyện Thần Hồn.',
    price: 350,
    quantity: 0
  },
  {
    id: 'huyen_thiet',
    name: 'Bách Luyện Huyền Thiết',
    grade: 'Nhất Giai',
    description: 'Quặng sắt được tôi luyện trăm lần dưới chân núi lửa, kim khí vững chãi.',
    price: 50,
    quantity: 0
  },
  {
    id: 'bang_tinh_khoang',
    name: 'Hàn Băng Thần Tinh',
    grade: 'Nhị Giai',
    description: 'Khoáng thạch đóng băng vạn năm dưới đáy cực bắc, tỏa ra khí tức băng hàn thấu xương.',
    price: 180,
    quantity: 0
  },
  {
    id: 'thai_at_tinh_kim',
    name: 'Thái Ất Tinh Kim',
    grade: 'Tam Giai',
    description: 'Kim loại sắc bén vô song rớt xuống từ vực ngoại tinh không, tài liệu đúc thần binh.',
    price: 500,
    quantity: 0
  },
  {
    id: 'cuu_u_minh_thach',
    name: 'Cửu U Minh Thạch',
    grade: 'Tứ Giai',
    description: 'Đá thiêng hấp thụ âm khí Hoàng Tuyền, dùng phong ấn linh hồn vào bảo khí.',
    price: 1200,
    quantity: 0
  },
  {
    id: 'hon_don_than_thiet',
    name: 'Hỗn Độn Thần Thiết',
    grade: 'Thần Giai',
    description: 'Thần thạch sinh ra trước thời khai thiên lập địa, chứa đựng đại đạo chí tôn.',
    price: 4000,
    quantity: 0
  },
  {
    id: 'manh_co_bao',
    name: 'Mảnh Cổ Bảo Thượng Cổ',
    grade: 'Tứ Giai',
    description: 'Mảnh vỡ từ pháp bảo thượng cổ rơi rớt khi trảm sát ma thú, dùng để đúc tạo bảo khí thần uy.',
    price: 2500,
    quantity: 0
  },
  {
    id: 'than_binh_tan_phien',
    name: 'Thần Binh Tàn Phiến',
    grade: 'Thần Giai',
    description: 'Tàn phiến thần binh rớt ra từ Ma Quân Thượng Cổ và Boss Thế Giới, ẩn chứa thiên đạo uy năng.',
    price: 6000,
    quantity: 0
  }
];

export const EQUIP_RECIPES: EquipRecipe[] = [
  {
    id: 'forge_sword_1',
    name: 'Thanh Phong Linh Kiếm',
    slot: 'weapon',
    grade: 'Nhất Giai',
    basePower: 3500,
    baseHp: 0,
    baseMp: 50,
    oresRequired: [{ oreId: 'huyen_thiet', oreName: 'Bách Luyện Huyền Thiết', count: 3 }],
    linhThachCost: 300,
    description: 'Thanh kiếm bén như gió lướt, tăng mạnh lực tấn công cho tu sĩ nhập môn.'
  },
  {
    id: 'forge_armor_1',
    name: 'Băng Tinh Đạo Bào',
    slot: 'armor',
    grade: 'Nhị Giai',
    basePower: 1500,
    baseHp: 1200,
    baseMp: 100,
    oresRequired: [
      { oreId: 'huyen_thiet', oreName: 'Bách Luyện Huyền Thiết', count: 2 },
      { oreId: 'bang_tinh_khoang', oreName: 'Hàn Băng Thần Tinh', count: 2 }
    ],
    linhThachCost: 600,
    description: 'Đạo bào dệt từ băng tơ và hàn khoáng, tăng sinh lực và phòng ngự bền vững.'
  },
  {
    id: 'forge_accessory_1',
    name: 'Thái Ất Hộ Thân Phù',
    slot: 'accessory',
    grade: 'Tam Giai',
    basePower: 8000,
    baseHp: 2000,
    baseMp: 300,
    oresRequired: [
      { oreId: 'thai_at_tinh_kim', oreName: 'Thái Ất Tinh Kim', count: 2 },
      { oreId: 'bang_tinh_khoang', oreName: 'Hàn Băng Thần Tinh', count: 2 }
    ],
    linhThachCost: 1500,
    description: 'Bùa ngọc hộ thân tinh kim, bảo hộ tâm đài và khuếch đại chân nguyên.'
  },
  {
    id: 'forge_artifact_1',
    name: 'Càn Khôn Hư Không Giới',
    slot: 'artifact',
    grade: 'Tứ Giai',
    basePower: 25000,
    baseHp: 5000,
    baseMp: 800,
    oresRequired: [
      { oreId: 'cuu_u_minh_thach', oreName: 'Cửu U Minh Thạch', count: 2 },
      { oreId: 'thai_at_tinh_kim', oreName: 'Thái Ất Tinh Kim', count: 3 }
    ],
    linhThachCost: 3500,
    description: 'Cổ bảo chứa không gian giới vực, tăng vọt toàn bộ chỉ số thực chiến.'
  },
  {
    id: 'forge_sword_2',
    name: 'Cửu Tiêu Lôi Đình Tiên Kiếm',
    slot: 'weapon',
    grade: 'Ngũ Giai',
    basePower: 85000,
    baseHp: 8000,
    baseMp: 1500,
    oresRequired: [
      { oreId: 'hon_don_than_thiet', oreName: 'Hỗn Độn Thần Thiết', count: 2 },
      { oreId: 'cuu_u_minh_thach', oreName: 'Cửu U Minh Thạch', count: 3 }
    ],
    linhThachCost: 10000,
    description: 'Thần kiếm dẫn động lôi kiếp cửu thiên, trảm tiên diệt ma trong một hơi thở!'
  },
  {
    id: 'forge_ring_huyen_thiet',
    name: 'Huyền Thiết Giới Chỉ',
    slot: 'artifact',
    grade: 'Nhị Giai',
    basePower: 1200,
    baseHp: 500,
    baseMp: 100,
    oresRequired: [
      { oreId: 'huyen_thiet', oreName: 'Bách Luyện Huyền Thiết', count: 4 }
    ],
    linhThachCost: 1200,
    storageCapacity: 55,
    description: 'Nhẫn trữ vật chứa Không Gian Trận Pháp, nới rộng dung lượng Túi Trữ Vật lên 55 ô.'
  },
  {
    id: 'forge_ring_tu_di',
    name: 'Tu Di Giới Chỉ',
    slot: 'artifact',
    grade: 'Tam Giai',
    basePower: 5500,
    baseHp: 1800,
    baseMp: 400,
    oresRequired: [
      { oreId: 'thai_at_tinh_kim', oreName: 'Thái Ất Tinh Kim', count: 3 },
      { oreId: 'bang_tinh_khoang', oreName: 'Hàn Băng Thần Tinh', count: 2 }
    ],
    linhThachCost: 4500,
    storageCapacity: 85,
    description: 'Bảo vật Tu Di dung nạp càn khôn, mở rộng Túi Trữ Vật lên 85 ô và tăng mạnh linh lực.'
  },
  {
    id: 'forge_ring_hu_khong',
    name: 'Hư Không Giới Chỉ',
    slot: 'artifact',
    grade: 'Tứ Giai',
    basePower: 18000,
    baseHp: 6000,
    baseMp: 1200,
    oresRequired: [
      { oreId: 'cuu_u_minh_thach', oreName: 'Cửu U Minh Thạch', count: 3 },
      { oreId: 'thai_at_tinh_kim', oreName: 'Thái Ất Tinh Kim', count: 3 }
    ],
    linhThachCost: 15000,
    storageCapacity: 130,
    description: 'Không gian hư không độc lập thu nhỏ, dung tích Túi Trữ Vật tăng lên 130 ô.'
  },
  {
    id: 'forge_ring_hon_don',
    name: 'Hỗn Độn Thần Giới',
    slot: 'artifact',
    grade: 'Ngũ Giai',
    basePower: 60000,
    baseHp: 15000,
    baseMp: 3000,
    oresRequired: [
      { oreId: 'hon_don_than_thiet', oreName: 'Hỗn Độn Thần Thiết', count: 3 },
      { oreId: 'cuu_u_minh_thach', oreName: 'Cửu U Minh Thạch', count: 3 }
    ],
    linhThachCost: 50000,
    storageCapacity: 9999,
    description: 'Cực phẩm thần giới thái cổ dung nạp càn khôn vô tận, sức chứa Túi Trữ Vật đạt VÔ HẠN!'
  }
];
