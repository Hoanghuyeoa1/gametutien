// lib/destiny-data.ts
// Hệ Thống "Khí Vận Thiên Mệnh" (Destiny / Fate System) & Tính Toán Chỉ Số Chiến Đấu Mở Rộng

import { DestinyFate, DestinyGrade, DestinySlotState, DestinySynergyConfig, PlayerStats, CombatStats, Physique, LinhCan, EquippedManualSlots, Manual, ReincarnationDestinyDefinition } from '@/lib/types';
import { getManualSynergy } from '@/lib/elemental-system';
import { getRefinementStatsBonus } from '@/lib/physique-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';
import { getBodyRefinementStats, getSoulCultivationStats } from '@/lib/body-soul-data';
import { getItemQualityMultiplier } from '@/lib/item-quality-data';
import { TITLES_CONFIG } from '@/lib/achievements-data';
import { calculateTotalPhysiqueStats } from '@/lib/physique-logic';
import { calculateSoulBuffs } from '@/lib/soul-logic';
import { calculateNatalCombatBonus } from '@/lib/natal-artifact-logic';
import { calculateAncestralResonance } from '@/lib/ancestral-blessing-logic';
import { calculateMeridianCombatBonuses } from '@/lib/tu-vi-empowerment-logic';
import { calculateLearnedManualsModifiers } from '@/lib/manuals-shop-logic';
import { calculateActiveBeastsBuffs } from '@/lib/beasts-shop-logic';
import { aggregateEquipmentInscriptions } from '@/lib/formation-inscription-logic';
import { FORMATION_SETS_REGISTRY } from '@/lib/weapon-tribulation-array-logic';
import { FormationSetCategory } from '@/lib/types/weapon-tribulation-array';
import { MAJOR_TRANSITIONS_REGISTRY, INNATE_TALENTS_REGISTRY } from '@/lib/dao-foundation-logic';

export const DESTINY_REROLL_COST_LT = 500;
export const DESTINY_REROLL_PILL_ID = 'pill_cai_menh';

export const DESTINY_FATES: Record<string, DestinyFate> = {
  // ==========================================
  // 1. Phàm Giai (Trắng - 60%)
  // ==========================================
  pham_nhan_menh_cach: {
    id: 'pham_nhan_menh_cach',
    name: 'Phàm Nhân Mệnh Cách',
    grade: 'Phàm Giai',
    color: '#9ca3af',
    badgeClass: 'text-zinc-400 border-zinc-700 bg-zinc-900/60',
    description: 'Mệnh cách phàm nhân áo vải mộc mạc, bình hòa ổn định không tác dụng phụ, có thể Tẩy Tủy hoặc Nghịch Thiên Cải Mệnh.',
    effectsSummary: 'Bình phàm vô dị, vận mệnh ổn định không kèm phụ diện.',
    effects: {}
  },
  binh_dam_chi_menh: {
    id: 'binh_dam_chi_menh',
    name: 'Bình Đạm Chi Mệnh',
    grade: 'Phàm Giai',
    color: '#a1a1aa',
    badgeClass: 'text-stone-300 border-stone-700 bg-stone-900/60',
    description: 'Tâm tĩnh như nước lặng, không ham tranh đấu, dễ dàng tĩnh tâm thấu triệt tạp niệm trần thế.',
    effectsSummary: 'Khí Huyết +5%, Tâm cảnh +5, giảm 10% tỉ lệ gặp Tâm Ma.',
    effects: {
      hpBonusPercent: 5,
      tamMaChanceMultiplier: 0.9
    }
  },
  can_cu_bu_thong_minh: {
    id: 'can_cu_bu_thong_minh',
    name: 'Cần Cù Bù Thông Minh',
    grade: 'Phàm Giai',
    color: '#cbd5e1',
    badgeClass: 'text-slate-300 border-slate-700 bg-slate-900/60',
    description: 'Thiên tư tuy không xuất chúng nhưng có lòng kiên định không dời, tích tiểu thành đại.',
    effectsSummary: 'Ngộ Tính +5, Tốc độ tu luyện +5%, giảm 5% tu vi đột phá.',
    effects: {
      soulBonus: 5,
      breakthroughRateBonus: 5,
      tuViReqMultiplier: 0.95
    }
  },

  // ==========================================
  // 2. Huyền Giai (Lam - 25%)
  // ==========================================
  tieu_khang_chi_gia: {
    id: 'tieu_khang_chi_gia',
    name: 'Tiểu Khang Chi Gia',
    grade: 'Huyền Giai',
    color: '#38bdf8',
    badgeClass: 'text-sky-300 border-sky-600/60 bg-sky-950/50',
    description: 'Xuất thân gia đình giàu có phong túc, lộ phí rủng rỉnh, mua bán giao thương thuận lợi.',
    effectsSummary: 'Rơi Linh Thạch +25%, Rơi đồ +15%, Thần Thức +10.',
    effects: {
      dropRateBonusPercent: 15,
      soulBonus: 10
    }
  },
  phuc_tinh_chieu_menh: {
    id: 'phuc_tinh_chieu_menh',
    name: 'Phúc Tinh Chiếu Mệnh',
    grade: 'Huyền Giai',
    color: '#60a5fa',
    badgeClass: 'text-blue-300 border-blue-600/60 bg-blue-950/50',
    description: 'Có phúc tinh bảo hộ, đi đường thường nhặt được thảo dược khoáng thạch, ít khi gặp hiểm nguy.',
    effectsSummary: 'Khí Vận +15, Cơ duyên tốt +20%, Đột phá +8%.',
    effects: {
      goodFortuneRateBonus: 20,
      breakthroughRateBonus: 8,
      soulBonus: 10
    }
  },
  thao_moc_chi_duyen: {
    id: 'thao_moc_chi_duyen',
    name: 'Thảo Mộc Chi Duyên',
    grade: 'Huyền Giai',
    color: '#34d399',
    badgeClass: 'text-emerald-300 border-emerald-600/60 bg-emerald-950/50',
    description: 'Trời sinh hòa hợp với thảo mộc, hái thuốc đạt sản lượng cao, luyện đan dễ dàng thành công.',
    effectsSummary: 'Rơi thảo dược +30%, Tỉ lệ Luyện Đan +15%, Khí Huyết +10%.',
    effects: {
      hpBonusPercent: 10,
      dropRateBonusPercent: 20
    }
  },
  phuc_duyen_tham_hau: {
    id: 'phuc_duyen_tham_hau',
    name: 'Phúc Duyên Thâm Hậu',
    grade: 'Huyền Giai',
    color: '#0284c7',
    badgeClass: 'text-cyan-300 border-cyan-500/60 bg-cyan-950/50 font-semibold',
    description: 'Túc thế tích đức vô lượng, phúc trạch sâu dày, đi đâu cũng được thiên đạo ưu ái.',
    effectsSummary: 'Khí Vận +25, Rơi đồ +30%, Cơ duyên tốt +35%.',
    effects: {
      khiVanBonus: 25,
      dropRateBonusPercent: 30,
      goodFortuneRateBonus: 35
    }
  },

  // ==========================================
  // 3. Địa Giai (Tím - 10%)
  // ==========================================
  khi_van_hanh_thong: {
    id: 'khi_van_hanh_thong',
    name: 'Khí Vận Hanh Thông',
    grade: 'Địa Giai',
    color: '#a855f7',
    badgeClass: 'text-purple-300 border-purple-500/60 bg-purple-950/50 font-medium',
    description: 'Vận thế thông thuận vô trở ngại, đi đâu cũng được thiên địa che chở, hóa giải hung hiểm.',
    effectsSummary: 'Đột phá +12%, Rơi đồ +30%, Cơ duyên +30%, Thần Thức +15.',
    effects: {
      breakthroughRateBonus: 12,
      dropRateBonusPercent: 30,
      goodFortuneRateBonus: 30,
      soulBonus: 15
    }
  },
  dan_dao_ky_tai: {
    id: 'dan_dao_ky_tai',
    name: 'Đan Đạo Kỳ Tài',
    grade: 'Địa Giai',
    color: '#10b981',
    badgeClass: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/60 font-semibold',
    description: 'Trời sinh thông hiểu dược lý, ngọn lửa đan lô nghe lời sai khiến, tỉ lệ cực phẩm đan tăng vọt.',
    effectsSummary: 'Tỉ lệ Luyện Đan +35%, Rơi đồ +25%, Đột phá +10%, Thần Thức +18.',
    effects: {
      breakthroughRateBonus: 10,
      dropRateBonusPercent: 25,
      soulBonus: 18
    }
  },
  tram_yeu_tru_ma: {
    id: 'tram_yeu_tru_ma',
    name: 'Trảm Yêu Trừ Ma',
    grade: 'Địa Giai',
    color: '#f43f5e',
    badgeClass: 'text-rose-300 border-rose-500/60 bg-rose-950/50 font-semibold',
    description: 'Mang trong mình chính khí lẫm liệt, sát ý đối với yêu ma quỷ quái vô cùng mạnh mẽ.',
    effectsSummary: 'Công Kích +25%, Bạo Kích +15%, Tinh Huyết rơi +50%.',
    effects: {
      atkBonusPercent: 25,
      critRateBonus: 15,
      soulBonus: 12
    }
  },
  sat_sinh_van_dao: {
    id: 'sat_sinh_van_dao',
    name: 'Sát Sinh Vấn Đạo',
    grade: 'Địa Giai',
    color: '#dc2626',
    badgeClass: 'text-red-300 border-red-500/60 bg-red-950/60 font-semibold',
    description: 'Lấy sát nhập đạo, kiếm nhuốm máu tươi muôn loài. Uy lực cực hạn nhưng dễ sinh tâm ma.',
    effectsSummary: 'Công Kích +30%, Bạo Kích +20%, giảm 5 Tâm Cảnh.',
    effects: {
      atkBonusPercent: 30,
      critRateBonus: 20,
      tamCanhBonus: -5
    }
  },
  huyet_khi_thao_thien: {
    id: 'huyet_khi_thao_thien',
    name: 'Huyết Khí Thao Thiên',
    grade: 'Địa Giai',
    color: '#b91c1c',
    badgeClass: 'text-rose-300 border-rose-600/60 bg-rose-950/60 font-semibold',
    description: 'Khí huyết ngút trời tựa biển máu, sinh mệnh lực dồi dào, công kích đoạt huyết bổ thân.',
    effectsSummary: 'Khí Huyết +35%, Hút Máu +12%, giảm 5 Tâm Cảnh.',
    effects: {
      hpBonusPercent: 35,
      lifestealPercent: 12,
      tamCanhBonus: -5
    }
  },

  // ==========================================
  // 4. Thiên Giai (Cam - 4%)
  // ==========================================
  dai_nang_chuyen_the: {
    id: 'dai_nang_chuyen_the',
    name: 'Đại Năng Chuyển Thế',
    grade: 'Thiên Giai',
    color: '#f97316',
    badgeClass: 'text-amber-300 border-amber-500/70 bg-amber-950/60 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    description: 'Túc thế đại năng giác ngộ chuyển sinh, ký ức tiền kiếp ẩn hiện giúp ngộ đạo nhanh chóng.',
    effectsSummary: 'Ngộ Tính +30, Đột phá +18%, Giảm 20% tu vi đột phá, Công & Thủ +15%.',
    effects: {
      breakthroughRateBonus: 18,
      tuViReqMultiplier: 0.8,
      atkBonusPercent: 15,
      defBonusPercent: 15,
      soulBonus: 25
    }
  },
  thien_sat_co_tinh: {
    id: 'thien_sat_co_tinh',
    name: 'Thiên Sát Cô Tinh',
    grade: 'Thiên Giai',
    color: '#ef4444',
    badgeClass: 'text-rose-400 border-rose-500/70 bg-rose-950/60 font-bold shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    description: 'Mệnh phạm sát tinh, túc sát chư thiên. Sát phạt vô song nhưng tâm ma quấy nhiễu.',
    effectsSummary: 'Công Kích +40%, Bạo Kích +40%, Sát Thương Bạo +50%, Tâm Ma x1.4.',
    effects: {
      atkBonusPercent: 40,
      critRateBonus: 40,
      critDmgBonus: 50,
      tamMaChanceMultiplier: 1.4
    }
  },
  ngu_hanh_te_tu: {
    id: 'ngu_hanh_te_tu',
    name: 'Ngũ Hành Tề Tụ',
    grade: 'Thiên Giai',
    color: '#06b6d4',
    badgeClass: 'text-cyan-300 border-cyan-500/70 bg-cyan-950/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]',
    description: 'Ngũ hành tương sinh tuần hoàn bất tuyệt, thân thể phòng ngự kiên cố, linh lực dư dả.',
    effectsSummary: 'Khí Huyết +30%, Phòng Ngự +25%, Công Kích +20%, Hồi 5% MP mỗi lượt.',
    effects: {
      hpBonusPercent: 30,
      defBonusPercent: 25,
      atkBonusPercent: 20,
      hpMpRegenTurnPercent: 5
    }
  },
  khi_van_nghich_thien: {
    id: 'khi_van_nghich_thien',
    name: 'Khí Vận Nghịch Thiên',
    grade: 'Thiên Giai',
    color: '#38bdf8',
    badgeClass: 'text-sky-300 border-sky-500/70 bg-sky-950/60 font-bold',
    description: 'Vạn vật tự tìm đến, phúc duyên sâu dày. Tăng tỉ lệ gặp cơ duyên hiếm có.',
    effectsSummary: 'Cơ duyên +40%, Rơi đồ +35%, Đột Phá +12%, Thần Thức +20.',
    effects: {
      dropRateBonusPercent: 35,
      goodFortuneRateBonus: 40,
      breakthroughRateBonus: 12,
      soulBonus: 20
    }
  },
  kiem_dao_doc_ton: {
    id: 'kiem_dao_doc_ton',
    name: 'Kiếm Đạo Độc Tôn',
    grade: 'Thiên Giai',
    color: '#f43f5e',
    badgeClass: 'text-rose-300 border-rose-500/70 bg-rose-950/60 font-bold',
    description: 'Nhất kiếm phá vạn pháp, kiếm tâm thông minh. Công kích và thân pháp siêu phàm.',
    effectsSummary: 'Công Kích +35%, Tốc Độ +20, Bạo Kích +25%, Sát Thương Bạo +35%.',
    effects: {
      atkBonusPercent: 35,
      speedBonus: 20,
      critRateBonus: 25,
      critDmgBonus: 35
    }
  },

  // ==========================================
  // 5. Thần Giai (Hoàng Kim - 1%)
  // ==========================================
  thien_menh_chi_tu: {
    id: 'thien_menh_chi_tu',
    name: 'Thiên Mệnh Chi Tử',
    grade: 'Thần Giai',
    color: '#f59e0b',
    badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/70 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse',
    description: 'Khí vận chí tôn vô thượng, sinh ra đã gánh vác thiên mệnh. Gặp nạn hóa lành, thiên địa phúc trạch.',
    effectsSummary: 'Đột phá +25%, Rơi đồ +50%, Thần Thức +35, Công & Thủ +20%, Rương cơ duyên cực phẩm.',
    effects: {
      breakthroughRateBonus: 25,
      dropRateBonusPercent: 50,
      goodFortuneRateBonus: 50,
      soulBonus: 35,
      atkBonusPercent: 20,
      defBonusPercent: 20
    }
  },
  vo_thuong_tien_duyen: {
    id: 'vo_thuong_tien_duyen',
    name: 'Vô Thượng Tiên Duyên',
    grade: 'Thần Giai',
    color: '#eab308',
    badgeClass: 'text-yellow-200 border-yellow-400/80 bg-yellow-950/70 font-extrabold shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-pulse',
    description: 'Tiên duyên vô lượng chư thần kính ngưỡng, không bị bình cảnh cảnh giới kìm hãm.',
    effectsSummary: 'Không bình cảnh (+20% Đột phá), Tự hồi 8% HP & MP mỗi lượt, Phòng Ngự +30%, Thần Thức +30.',
    effects: {
      noBottleneck: true,
      breakthroughRateBonus: 20,
      hpMpRegenTurnPercent: 8,
      defBonusPercent: 30,
      soulBonus: 30
    }
  },
  van_gioi_doc_ton: {
    id: 'van_gioi_doc_ton',
    name: 'Vạn Giới Độc Tôn',
    grade: 'Thần Giai',
    color: '#fb7185',
    badgeClass: 'text-rose-200 border-rose-400/80 bg-rose-950/70 font-extrabold shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse',
    description: 'Chí tôn vạn giới, áp chế quần hùng. Đòn đánh mang theo uy áp hủy thiên diệt địa.',
    effectsSummary: 'Công Kích +50%, Bạo Kích +35%, Sát Thương Bạo +60%, Miễn nhiễm khống chế, Tốc Độ +25.',
    effects: {
      atkBonusPercent: 50,
      critRateBonus: 35,
      critDmgBonus: 60,
      controlImmunity: true,
      speedBonus: 25
    }
  },
  hon_don_dao_the: {
    id: 'hon_don_dao_the',
    name: 'Hỗn Độn Đạo Thể',
    grade: 'Thần Giai',
    color: '#c084fc',
    badgeClass: 'text-purple-300 border-purple-500/80 bg-purple-950/70 font-extrabold shadow-[0_0_20px_rgba(192,132,252,0.6)] animate-pulse',
    description: 'Đồng hóa ngũ hành, sinh ra mang đại đạo chi vận. Tự động hồi phục HP và MP mỗi lượt.',
    effectsSummary: 'Hồi 6% HP & MP mỗi lượt, Không bình cảnh (+15% Đột Phá), Phòng Ngự +25%, Thần Thức +30.',
    effects: {
      hpMpRegenTurnPercent: 6,
      noBottleneck: true,
      breakthroughRateBonus: 15,
      defBonusPercent: 25,
      soulBonus: 30
    }
  },
  hoang_co_thanh_the: {
    id: 'hoang_co_thanh_the',
    name: 'Hoang Cổ Thánh Thể',
    grade: 'Thần Giai',
    color: '#eab308',
    badgeClass: 'text-yellow-300 border-yellow-500/80 bg-yellow-950/70 font-extrabold shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse',
    description: 'Cận chiến vô địch, khí huyết dồi dào. Khí Huyết x2 (+100%), Phòng ngự x2 (+100%).',
    effectsSummary: 'Khí Huyết +100%, Phòng Ngự +100%, Miễn nhiễm khống chế, Tu vi đột phá cần +25%.',
    effects: {
      hpBonusPercent: 100,
      defBonusPercent: 100,
      controlImmunity: true,
      tuViReqMultiplier: 1.25
    }
  },

  // ==========================================
  // 6. Mệnh Cách Luân Hồi Độc Quyền (Phân Cấp Cảnh Giới Chuyển Sinh)
  // ==========================================
  // --- Hoàng Giai (Yêu cầu Realm 0 - Phàm Nhân / Luyện Khí) ---
  destiny_reborn_hoang_1: {
    id: 'destiny_reborn_hoang_1',
    name: 'Phàm Thai Bất Khuất',
    grade: 'Hoàng Giai',
    color: '#f59e0b',
    badgeClass: 'text-amber-300 border-amber-600/70 bg-amber-950/50 font-semibold',
    description: 'Thân là phàm thai nhưng ý chí tựa bàn thạch, kiên định bất khuất trước nghịch cảnh thiên địa.',
    effectsSummary: 'Phòng ngự +10%, Thọ nguyên khởi đầu +10 năm, Linh thạch khởi nghiệp +500.',
    effects: {
      defBonusPercent: 10,
      initialLifespan: 10,
      initialLinhThach: 500
    }
  },
  destiny_reborn_hoang_2: {
    id: 'destiny_reborn_hoang_2',
    name: 'Cần Năng Bổ Chuyết',
    grade: 'Hoàng Giai',
    color: '#fbbf24',
    badgeClass: 'text-amber-200 border-amber-500/70 bg-amber-900/40 font-semibold',
    description: 'Thiên phú bình thường nhưng cần cù bù đắp, chăm chỉ tích lũy, cơ sở vững như bàn thạch.',
    effectsSummary: 'Tốc độ tu vi bế quan +10%, Căn cốt cơ bản +5.',
    effects: {
      tuViSpeedBonus: 10,
      cultivationSpeedBonusPercent: 10,
      canCotBonus: 5
    }
  },

  // --- Địa Giai (Yêu cầu Realm 11 - Trúc Cơ Kỳ) ---
  destiny_reborn_dia_1: {
    id: 'destiny_reborn_dia_1',
    name: 'Thông Tuệ Đạo Tâm',
    grade: 'Địa Giai',
    color: '#a855f7',
    badgeClass: 'text-purple-300 border-purple-500/70 bg-purple-950/60 font-semibold',
    description: 'Đạo tâm sáng tỏ thông triệt, thấu hiểu quy luật vận hành linh khí, giảm bớt trở ngại khi phá cảnh.',
    effectsSummary: 'Ngộ tính +15, Giảm 15% tiêu hao tu vi khi đột phá cảnh giới.',
    effects: {
      ngoTinhBonus: 15,
      soulBonus: 15,
      breakthroughCostReductionPercent: 15,
      tuViReqMultiplier: 0.85
    }
  },
  destiny_reborn_dia_2: {
    id: 'destiny_reborn_dia_2',
    name: 'Khí Vận Tiểu Hưng',
    grade: 'Địa Giai',
    color: '#d946ef',
    badgeClass: 'text-fuchsia-300 border-fuchsia-500/70 bg-fuchsia-950/60 font-semibold',
    description: 'Hồng vận dâng trào nhẹ nhàng, cơ duyên liên miên, sát chiêu thường tìm đúng yếu huyệt kẻ thù.',
    effectsSummary: 'Khí vận +15, Tỉ lệ bạo kích +10%.',
    effects: {
      khiVanBonus: 15,
      critRateBonus: 10
    }
  },

  // --- Thiên Giai (Yêu cầu Realm 21 - Nguyên Anh Kỳ) ---
  destiny_reborn_thien_1: {
    id: 'destiny_reborn_thien_1',
    name: 'Đại Năng Chuyển Thế',
    grade: 'Thiên Giai',
    color: '#f43f5e',
    badgeClass: 'text-rose-300 border-rose-500/80 bg-rose-950/60 font-bold',
    description: 'Tiền kiếp từng là tông sư một phương, thần hồn ẩn chứa uy thế kinh người, sát phạt quả quyết.',
    effectsSummary: 'Tu vi thổ nạp +20%, Công kích +15%.',
    effects: {
      tuViSpeedBonus: 20,
      cultivationSpeedBonusPercent: 20,
      atkBonusPercent: 15
    }
  },
  destiny_reborn_thien_2: {
    id: 'destiny_reborn_thien_2',
    name: 'Kim Cang Pháp Thân',
    grade: 'Thiên Giai',
    color: '#ea580c',
    badgeClass: 'text-orange-300 border-orange-500/80 bg-orange-950/60 font-bold',
    description: 'Khí huyết dồi dào tựa giao long xuất hải, thân thể kiên cố như kim cương bất hoại.',
    effectsSummary: 'Khí huyết tối đa +20%, Miễn thương toàn cục +12%.',
    effects: {
      hpBonusPercent: 20,
      dmgReduction: 12,
      dmgReductionPercent: 12
    }
  },

  // --- Tuyệt Giai (Yêu cầu Realm 31 - Luyện Hư Kỳ) ---
  destiny_reborn_tuyet_1: {
    id: 'destiny_reborn_tuyet_1',
    name: 'Tinh Không Vấn Đạo',
    grade: 'Tuyệt Giai',
    color: '#06b6d4',
    badgeClass: 'text-cyan-300 border-cyan-400/80 bg-cyan-950/70 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    description: 'Thấu hiểu quy luật tinh tú huyền bí, công phạt như mưa sao băng, hút cạn sinh cơ nghịch đồ.',
    effectsSummary: 'Công kích +25%, Hút máu +15%, Tốc độ thân pháp +25.',
    effects: {
      atkBonusPercent: 25,
      lifestealPercent: 15,
      speedBonus: 25
    }
  },
  destiny_reborn_tuyet_2: {
    id: 'destiny_reborn_tuyet_2',
    name: 'Thấu Triệt Thần Thức',
    grade: 'Tuyệt Giai',
    color: '#14b8a6',
    badgeClass: 'text-teal-300 border-teal-400/80 bg-teal-950/70 font-extrabold shadow-[0_0_15px_rgba(20,184,166,0.4)]',
    description: 'Thần niệm bao phủ vạn dặm, soi thấu mọi điểm yếu hộ thể của đối phương, xuất thủ tất trúng.',
    effectsSummary: 'Thần thức +30, Sát thương bạo kích +25%, Xuyên giáp +15%.',
    effects: {
      soulBonus: 30,
      critDmgBonus: 25,
      armorPenetrationPercent: 15
    }
  },

  // --- Thần Giai Tối Thượng (Yêu cầu Realm 41+ - Độ Kiếp Kỳ / Đại Thừa) ---
  trong_sinh_tien_ton: {
    id: 'trong_sinh_tien_ton',
    name: 'Trọng Sinh Tiên Tôn',
    grade: 'Thần Giai',
    color: '#a855f7',
    badgeClass: 'text-purple-300 border-purple-500/80 bg-purple-950/70 font-extrabold shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse',
    description: 'Chuyển sinh chi tôn, thức tỉnh đạo ấn tiền kiếp. Thổ nạp kinh thế hãi tục, sát phạt ngút trời.',
    effectsSummary: 'Tu Vi thổ nạp +25%, Bạo Kích +15%, Miễn tử 1 lần trong đời, Công Kích +20%.',
    effects: {
      tuViSpeedBonus: 25,
      cultivationSpeedBonusPercent: 25,
      critRateBonus: 15,
      freeReviveCount: 1,
      extraSoulRevive: true,
      atkBonusPercent: 20
    }
  },
  destiny_reborn_than_1: {
    id: 'destiny_reborn_than_1',
    name: 'Trọng Sinh Tiên Tôn',
    grade: 'Thần Giai',
    color: '#a855f7',
    badgeClass: 'text-purple-300 border-purple-500/80 bg-purple-950/70 font-extrabold shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse',
    description: 'Chuyển sinh chi tôn, thức tỉnh đạo ấn tiền kiếp. Thổ nạp kinh thế hãi tục, sát phạt ngút trời.',
    effectsSummary: 'Tu Vi thổ nạp +25%, Bạo Kích +15%, Miễn tử 1 lần trong đời, Công Kích +20%.',
    effects: {
      tuViSpeedBonus: 25,
      cultivationSpeedBonusPercent: 25,
      critRateBonus: 15,
      freeReviveCount: 1,
      extraSoulRevive: true,
      atkBonusPercent: 20
    }
  },
  tuc_menh_thong_thien: {
    id: 'tuc_menh_thong_thien',
    name: 'Túc Mệnh Thông Thiên',
    grade: 'Thần Giai',
    color: '#38bdf8',
    badgeClass: 'text-sky-300 border-sky-500/80 bg-sky-950/70 font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-pulse',
    description: 'Đạo tâm quán triệt tam thiên thế giới, biết trước nhân duyên phúc họa, thiên địa tài phú tự quy về.',
    effectsSummary: 'Khí Vận +35, Giảm 25% giá Thương Hội, Tỉ lệ rơi đồ +30%.',
    effects: {
      khiVanBonus: 35,
      soulBonus: 35,
      merchantDiscountPercent: 25,
      dropRateBonusPercent: 30,
      dropRateBonus: 30
    }
  },
  destiny_reborn_than_2: {
    id: 'destiny_reborn_than_2',
    name: 'Túc Mệnh Thông Thiên',
    grade: 'Thần Giai',
    color: '#38bdf8',
    badgeClass: 'text-sky-300 border-sky-500/80 bg-sky-950/70 font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-pulse',
    description: 'Đạo tâm quán triệt tam thiên thế giới, biết trước nhân duyên phúc họa, thiên địa tài phú tự quy về.',
    effectsSummary: 'Khí Vận +35, Giảm 25% giá Thương Hội, Tỉ lệ rơi đồ +30%.',
    effects: {
      khiVanBonus: 35,
      soulBonus: 35,
      merchantDiscountPercent: 25,
      dropRateBonusPercent: 30,
      dropRateBonus: 30
    }
  },
  cuu_chuyen_hon_don_thai: {
    id: 'cuu_chuyen_hon_don_thai',
    name: 'Cửu Chuyển Hỗn Độn Thai',
    grade: 'Thần Giai',
    color: '#f59e0b',
    badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/70 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse',
    description: 'Đúc thành thể phách hỗn độn thái sơ, bách độc bất xâm, vạn pháp bất hoại, phòng thủ vô song.',
    effectsSummary: 'Phòng Ngự +20%, Miễn Thương +20%, Khí Huyết tối đa +30%.',
    effects: {
      defBonusPercent: 20,
      hpBonusPercent: 30,
      dmgReduction: 20,
      dmgReductionPercent: 20
    }
  },
  destiny_reborn_than_3: {
    id: 'destiny_reborn_than_3',
    name: 'Cửu Chuyển Hỗn Độn Thai',
    grade: 'Thần Giai',
    color: '#f59e0b',
    badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/70 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse',
    description: 'Đúc thành thể phách hỗn độn thái sơ, bách độc bất xâm, vạn pháp bất hoại, phòng thủ vô song.',
    effectsSummary: 'Phòng Ngự +20%, Miễn Thương +20%, Khí Huyết tối đa +30%.',
    effects: {
      defBonusPercent: 20,
      hpBonusPercent: 30,
      dmgReduction: 20,
      dmgReductionPercent: 20
    }
  }
};

// Danh mục định nghĩa Mệnh Cách Luân Hồi có phân cấp cảnh giới
export const REINCARNATION_DESTINY_DEFINITIONS: ReincarnationDestinyDefinition[] = [
  // 1. Hoàng Giai (Realm 0 - Phàm Nhân / Luyện Khí)
  {
    id: 'destiny_reborn_hoang_1',
    name: 'Phàm Thai Bất Khuất',
    grade: 'hoang',
    gradeName: 'Hoàng Giai',
    badgeColor: 'amber',
    badgeClass: 'text-amber-300 border-amber-600/70 bg-amber-950/50 font-semibold',
    color: '#f59e0b',
    requiredRealmIndex: 0,
    requiredRealmName: 'Phàm Nhân / Luyện Khí Kỳ',
    description: 'Thân là phàm thai nhưng ý chí tựa bàn thạch, kiên định bất khuất trước nghịch cảnh thiên địa.',
    effectsSummary: 'Phòng ngự +10%, Thọ nguyên khởi đầu +10 năm, Linh thạch khởi nghiệp +500.',
    effects: {
      defBonusPercent: 10,
      initialLifespan: 10,
      initialLinhThach: 500
    }
  },
  {
    id: 'destiny_reborn_hoang_2',
    name: 'Cần Năng Bổ Chuyết',
    grade: 'hoang',
    gradeName: 'Hoàng Giai',
    badgeColor: 'amber',
    badgeClass: 'text-amber-200 border-amber-500/70 bg-amber-900/40 font-semibold',
    color: '#fbbf24',
    requiredRealmIndex: 0,
    requiredRealmName: 'Phàm Nhân / Luyện Khí Kỳ',
    description: 'Thiên phú bình thường nhưng cần cù bù đắp, chăm chỉ tích lũy, cơ sở vững như bàn thạch.',
    effectsSummary: 'Tốc độ tu vi bế quan +10%, Căn cốt cơ bản +5.',
    effects: {
      tuViSpeedBonus: 10,
      cultivationSpeedBonusPercent: 10,
      canCotBonus: 5
    }
  },

  // 2. Địa Giai (Realm 11 - Trúc Cơ Kỳ)
  {
    id: 'destiny_reborn_dia_1',
    name: 'Thông Tuệ Đạo Tâm',
    grade: 'dia',
    gradeName: 'Địa Giai',
    badgeColor: 'purple',
    badgeClass: 'text-purple-300 border-purple-500/70 bg-purple-950/60 font-semibold',
    color: '#a855f7',
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    description: 'Đạo tâm sáng tỏ thông triệt, thấu hiểu quy luật vận hành linh khí, giảm bớt trở ngại khi phá cảnh.',
    effectsSummary: 'Ngộ tính +15, Giảm 15% tiêu hao tu vi khi đột phá cảnh giới.',
    effects: {
      ngoTinhBonus: 15,
      soulBonus: 15,
      breakthroughCostReductionPercent: 15,
      tuViReqMultiplier: 0.85
    }
  },
  {
    id: 'destiny_reborn_dia_2',
    name: 'Khí Vận Tiểu Hưng',
    grade: 'dia',
    gradeName: 'Địa Giai',
    badgeColor: 'purple',
    badgeClass: 'text-fuchsia-300 border-fuchsia-500/70 bg-fuchsia-950/60 font-semibold',
    color: '#d946ef',
    requiredRealmIndex: 11,
    requiredRealmName: 'Trúc Cơ Kỳ',
    description: 'Hồng vận dâng trào nhẹ nhàng, cơ duyên liên miên, sát chiêu thường tìm đúng yếu huyệt kẻ thù.',
    effectsSummary: 'Khí vận +15, Tỉ lệ bạo kích +10%.',
    effects: {
      khiVanBonus: 15,
      critRateBonus: 10
    }
  },

  // 3. Thiên Giai (Realm 21 - Nguyên Anh Kỳ)
  {
    id: 'destiny_reborn_thien_1',
    name: 'Đại Năng Chuyển Thế',
    grade: 'thien',
    gradeName: 'Thiên Giai',
    badgeColor: 'rose',
    badgeClass: 'text-rose-300 border-rose-500/80 bg-rose-950/60 font-bold',
    color: '#f43f5e',
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    description: 'Tiền kiếp từng là tông sư một phương, thần hồn ẩn chứa uy thế kinh người, sát phạt quả quyết.',
    effectsSummary: 'Tu vi thổ nạp +20%, Công kích +15%.',
    effects: {
      tuViSpeedBonus: 20,
      cultivationSpeedBonusPercent: 20,
      atkBonusPercent: 15
    }
  },
  {
    id: 'destiny_reborn_thien_2',
    name: 'Kim Cang Pháp Thân',
    grade: 'thien',
    gradeName: 'Thiên Giai',
    badgeColor: 'orange',
    badgeClass: 'text-orange-300 border-orange-500/80 bg-orange-950/60 font-bold',
    color: '#ea580c',
    requiredRealmIndex: 21,
    requiredRealmName: 'Nguyên Anh Kỳ',
    description: 'Khí huyết dồi dào tựa giao long xuất hải, thân thể kiên cố như kim cương bất hoại.',
    effectsSummary: 'Khí huyết tối đa +20%, Miễn thương toàn cục +12%.',
    effects: {
      hpBonusPercent: 20,
      dmgReduction: 12,
      dmgReductionPercent: 12
    }
  },

  // 4. Tuyệt Giai (Realm 31 - Luyện Hư Kỳ)
  {
    id: 'destiny_reborn_tuyet_1',
    name: 'Tinh Không Vấn Đạo',
    grade: 'tuyet',
    gradeName: 'Tuyệt Giai',
    badgeColor: 'cyan',
    badgeClass: 'text-cyan-300 border-cyan-400/80 bg-cyan-950/70 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    color: '#06b6d4',
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    description: 'Thấu hiểu quy luật tinh tú huyền bí, công phạt như mưa sao băng, hút cạn sinh cơ nghịch đồ.',
    effectsSummary: 'Công kích +25%, Hút máu +15%, Tốc độ thân pháp +25.',
    effects: {
      atkBonusPercent: 25,
      lifestealPercent: 15,
      speedBonus: 25
    }
  },
  {
    id: 'destiny_reborn_tuyet_2',
    name: 'Thấu Triệt Thần Thức',
    grade: 'tuyet',
    gradeName: 'Tuyệt Giai',
    badgeColor: 'teal',
    badgeClass: 'text-teal-300 border-teal-400/80 bg-teal-950/70 font-extrabold shadow-[0_0_15px_rgba(20,184,166,0.4)]',
    color: '#14b8a6',
    requiredRealmIndex: 31,
    requiredRealmName: 'Luyện Hư Kỳ',
    description: 'Thần niệm bao phủ vạn dặm, soi thấu mọi điểm yếu hộ thể của đối phương, xuất thủ tất trúng.',
    effectsSummary: 'Thần thức +30, Sát thương bạo kích +25%, Xuyên giáp +15%.',
    effects: {
      soulBonus: 30,
      critDmgBonus: 25,
      armorPenetrationPercent: 15
    }
  },

  // 5. Thần Giai Tối Thượng (Realm 41+ - Độ Kiếp / Đại Thừa)
  {
    id: 'trong_sinh_tien_ton',
    name: 'Trọng Sinh Tiên Tôn',
    grade: 'than',
    gradeName: 'Thần Giai',
    badgeColor: 'purple',
    badgeClass: 'text-purple-300 border-purple-500/80 bg-purple-950/70 font-extrabold shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse',
    color: '#a855f7',
    requiredRealmIndex: 41,
    requiredRealmName: 'Độ Kiếp Kỳ / Đại Thừa',
    description: 'Chuyển sinh chi tôn, thức tỉnh đạo ấn tiền kiếp. Thổ nạp kinh thế hãi tục, sát phạt ngút trời.',
    effectsSummary: 'Tu Vi thổ nạp +25%, Bạo Kích +15%, Miễn tử 1 lần trong đời, Công Kích +20%.',
    effects: {
      tuViSpeedBonus: 25,
      cultivationSpeedBonusPercent: 25,
      critRateBonus: 15,
      freeReviveCount: 1,
      extraSoulRevive: true,
      atkBonusPercent: 20
    }
  },
  {
    id: 'tuc_menh_thong_thien',
    name: 'Túc Mệnh Thông Thiên',
    grade: 'than',
    gradeName: 'Thần Giai',
    badgeColor: 'sky',
    badgeClass: 'text-sky-300 border-sky-500/80 bg-sky-950/70 font-extrabold shadow-[0_0_20px_rgba(56,189,248,0.6)] animate-pulse',
    color: '#38bdf8',
    requiredRealmIndex: 41,
    requiredRealmName: 'Độ Kiếp Kỳ / Đại Thừa',
    description: 'Đạo tâm quán triệt tam thiên thế giới, biết trước nhân duyên phúc họa, thiên địa tài phú tự quy về.',
    effectsSummary: 'Khí Vận +35, Giảm 25% giá Thương Hội, Tỉ lệ rơi đồ +30%.',
    effects: {
      khiVanBonus: 35,
      soulBonus: 35,
      merchantDiscountPercent: 25,
      dropRateBonusPercent: 30,
      dropRateBonus: 30
    }
  },
  {
    id: 'cuu_chuyen_hon_don_thai',
    name: 'Cửu Chuyển Hỗn Độn Thai',
    grade: 'than',
    gradeName: 'Thần Giai',
    badgeColor: 'amber',
    badgeClass: 'text-amber-300 border-amber-500/80 bg-amber-950/70 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse',
    color: '#f59e0b',
    requiredRealmIndex: 41,
    requiredRealmName: 'Độ Kiếp Kỳ / Đại Thừa',
    description: 'Đúc thành thể phách hỗn độn thái sơ, bách độc bất xâm, vạn pháp bất hoại, phòng thủ vô song.',
    effectsSummary: 'Phòng Ngự +20%, Miễn Thương +20%, Khí Huyết tối đa +30%.',
    effects: {
      defBonusPercent: 20,
      hpBonusPercent: 30,
      dmgReduction: 20,
      dmgReductionPercent: 20
    }
  }
];

export function getReincarnationDestinyById(id: string): ReincarnationDestinyDefinition | undefined {
  return REINCARNATION_DESTINY_DEFINITIONS.find(d => d.id === id);
}

export const REINCARNATION_DESTINY_FATES: DestinyFate[] = REINCARNATION_DESTINY_DEFINITIONS.map(
  def => DESTINY_FATES[def.id] || {
    id: def.id,
    name: def.name,
    grade: def.gradeName as DestinyGrade,
    description: def.description,
    color: def.color,
    badgeClass: def.badgeClass,
    effectsSummary: def.effectsSummary,
    effects: def.effects
  }
);

export const ALL_DESTINY_FATES: DestinyFate[] = Object.values(DESTINY_FATES);

export const DEFAULT_DESTINY: DestinyFate = DESTINY_FATES.pham_nhan_menh_cach;

export const DESTINIES_BY_TIER: Record<string, DestinyFate[]> = {
  'Phàm Giai': [
    DESTINY_FATES.pham_nhan_menh_cach,
    DESTINY_FATES.binh_dam_chi_menh,
    DESTINY_FATES.can_cu_bu_thong_minh
  ],
  'Huyền Giai': [
    DESTINY_FATES.tieu_khang_chi_gia,
    DESTINY_FATES.phuc_tinh_chieu_menh,
    DESTINY_FATES.thao_moc_chi_duyen,
    DESTINY_FATES.phuc_duyen_tham_hau
  ],
  'Địa Giai': [
    DESTINY_FATES.khi_van_hanh_thong,
    DESTINY_FATES.dan_dao_ky_tai,
    DESTINY_FATES.tram_yeu_tru_ma,
    DESTINY_FATES.sat_sinh_van_dao,
    DESTINY_FATES.huyet_khi_thao_thien
  ],
  'Thiên Giai': [
    DESTINY_FATES.dai_nang_chuyen_the,
    DESTINY_FATES.thien_sat_co_tinh,
    DESTINY_FATES.ngu_hanh_te_tu,
    DESTINY_FATES.khi_van_nghich_thien,
    DESTINY_FATES.kiem_dao_doc_ton
  ],
  'Thần Giai': [
    DESTINY_FATES.thien_menh_chi_tu,
    DESTINY_FATES.vo_thuong_tien_duyen,
    DESTINY_FATES.van_gioi_doc_ton,
    DESTINY_FATES.hon_don_dao_the,
    DESTINY_FATES.hoang_co_thanh_the
  ]
};

// ============================================
// TỔ HỢP MỆNH CÁCH (DESTINY SYNERGY)
// ============================================

export const DESTINY_SYNERGIES: DestinySynergyConfig[] = [
  {
    id: 'ma_dao_cuc_han',
    name: 'Ma Đạo Cực Hạn',
    requiredFateIds: ['sat_sinh_van_dao', 'huyet_khi_thao_thien'],
    description: 'Dung hợp sát phạt vô biên và biển máu ngút trời, bước vào cảnh giới Ma Tôn cực hạn.',
    effectsSummary: '+20% Hút Máu, +15% Công Kích, nhưng trừ 15 Tâm Cảnh.',
    badgeClass: 'text-red-300 border-red-600/70 bg-red-950/70 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    glowColor: 'red',
    effects: {
      lifestealPercent: 20,
      atkBonusPercent: 15,
      tamCanhBonus: -15
    }
  },
  {
    id: 'thien_dao_chi_tu',
    name: 'Thiên Đạo Chi Tử',
    requiredFateIds: ['phuc_duyen_tham_hau', 'khi_van_hanh_thong'],
    description: 'Được trời xanh che chở tuyệt đối, vạn vật tự tìm đến, phúc duyên vô lượng chư thần kính ngưỡng.',
    effectsSummary: 'Nhân đôi (x2) tỉ lệ rơi Rương Thái Hư trong Bí Cảnh, Rơi đồ +40%, Đột phá +15%.',
    badgeClass: 'text-amber-300 border-amber-500/70 bg-amber-950/70 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    glowColor: 'amber',
    effects: {
      thaiHuChestBonus: true,
      dropRateBonusPercent: 40
    }
  },
  {
    id: 'vo_tinh_kiem_dao',
    name: 'Vô Tình Kiếm Đạo',
    requiredFateIds: ['kiem_dao_doc_ton', 'thien_sat_co_tinh'],
    description: 'Kiếm xuất vô tình, đoạn tuyệt hồng trần, nhất kiếm khai thiên lập địa uy lực tuyệt luân.',
    effectsSummary: '+25% Bạo Kích, +35% Sát Thương Bạo, -10% Phòng Ngự.',
    badgeClass: 'text-rose-300 border-rose-500/70 bg-rose-950/70 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    glowColor: 'rose',
    effects: {
      critRateBonus: 25,
      critDmgBonus: 35,
      defBonusPercent: -10
    }
  },
  {
    id: 'hon_don_tien_thai',
    name: 'Hỗn Độn Tiên Thai',
    requiredFateIds: ['dai_nang_chuyen_the', 'hon_don_dao_the'],
    description: 'Tiền kiếp đại năng dung hợp thể chất hỗn độn sơ khai, ngưng tụ đạo quả chí tôn vô thượng.',
    effectsSummary: '+30% Khí Huyết, +30% Chân Nguyên (Max MP), +15% Thủ Đạo Môn.',
    badgeClass: 'text-purple-300 border-purple-500/70 bg-purple-950/70 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    glowColor: 'purple',
    effects: {
      hpBonusPercent: 30,
      defBonusPercent: 15
    }
  },
  {
    id: 'duoc_thanh_tai_the',
    name: 'Dược Thánh Tái Thế',
    requiredFateIds: ['dan_dao_ky_tai', 'thao_moc_chi_duyen'],
    description: 'Tinh thông vạn thảo ngàn hoa, dược lý đan đạo đăng phong tạo cực.',
    effectsSummary: '+35% Tỉ lệ thành công Luyện Đan, +25% Sản lượng thu hoạch Linh Điền.',
    badgeClass: 'text-emerald-300 border-emerald-500/70 bg-emerald-950/70 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    glowColor: 'emerald',
    effects: {
      dropRateBonusPercent: 25
    }
  }
];

/**
 * Tính số slot Mệnh Bàn tối đa theo cảnh giới và số kiếp luân hồi:
 * - Phàm Nhân / Luyện Khí (realm < 11): 3 slot (4 slot nếu đã luân hồi >= 1)
 * - Trúc Cơ (11 <= realm < 16): 4 slot (5 slot nếu đã luân hồi >= 1)
 * - Kim Đan trở lên (realm >= 16): 5 slot (6 slot nếu đã luân hồi >= 1)
 */
export function getDestinySlotMaxCount(currentRealm: number = 0, totalRebornTimes: number = 0): number {
  let base = 3;
  if (currentRealm >= 16) base = 5;
  else if (currentRealm >= 11) base = 4;

  if (totalRebornTimes >= 1) {
    base = Math.min(6, base + 1);
  }
  return base;
}

export function createDefaultDestinyBoard(initialFateId?: string): DestinySlotState {
  const fateId = initialFateId || 'pham_nhan_menh_cach';
  return {
    unlockedSlots: 3,
    equippedIds: [fateId],
    collectedIds: [fateId]
  };
}

export function getActiveDestinySynergies(equippedFateIds: string[] = []): DestinySynergyConfig[] {
  const fateSet = new Set(equippedFateIds);
  return DESTINY_SYNERGIES.filter(syn => syn.requiredFateIds.every(id => fateSet.has(id)));
}

export function equipDestinyFate(
  player: PlayerStats,
  fateId: string
): { success: boolean; message: string; updatedPlayer: PlayerStats } {
  const fate = DESTINY_FATES[fateId];
  if (!fate) {
    return { success: false, message: 'Mệnh cách không tồn tại!', updatedPlayer: player };
  }

  const currentRealm = player.currentRealm || 0;
  const totalRebornTimes = player.reincarnationState?.totalRebornTimes || 0;
  const maxSlots = getDestinySlotMaxCount(currentRealm, totalRebornTimes);
  const currentBoard = player.destinyBoard || createDefaultDestinyBoard(player.destiny?.id);

  if (currentBoard.equippedIds.includes(fateId)) {
    return { success: false, message: `Mệnh cách [${fate.name}] đã được khảm vào Mệnh Bàn!`, updatedPlayer: player };
  }

  if (currentBoard.equippedIds.length >= maxSlots) {
    return { success: false, message: `Mệnh Bàn đã đầy (${maxSlots}/${maxSlots} slot)! Hãy tháo bớt mệnh cách trước khi khảm mới.`, updatedPlayer: player };
  }

  const newEquippedIds = [...currentBoard.equippedIds, fateId];
  const newCollectedIds = Array.from(new Set([...(currentBoard.collectedIds || []), fateId]));

  const updatedBoard: DestinySlotState = {
    unlockedSlots: maxSlots,
    equippedIds: newEquippedIds,
    collectedIds: newCollectedIds
  };

  const equippedFates = newEquippedIds.map(id => DESTINY_FATES[id]).filter(Boolean);
  const activeSynergies = getActiveDestinySynergies(newEquippedIds);

  const updatedPlayer: PlayerStats = {
    ...player,
    destinyBoard: updatedBoard,
    destinies: equippedFates,
    activeSynergies: activeSynergies.map(s => s.id)
  };

  const newSynergies = activeSynergies.filter(s => s.requiredFateIds.includes(fateId));
  const synergyText = newSynergies.length > 0
    ? ` ✨ Kích hoạt Tổ Hợp [${newSynergies.map(s => s.name).join(', ')}]!`
    : '';

  return {
    success: true,
    message: `Khảm nạp thành công [${fate.name}] vào Mệnh Bàn!${synergyText}`,
    updatedPlayer
  };
}

export function unequipDestinyFate(
  player: PlayerStats,
  fateId: string
): { success: boolean; message: string; updatedPlayer: PlayerStats } {
  const currentBoard = player.destinyBoard || createDefaultDestinyBoard(player.destiny?.id);

  if (!currentBoard.equippedIds.includes(fateId)) {
    return { success: false, message: 'Mệnh cách này chưa được khảm trên Mệnh Bàn!', updatedPlayer: player };
  }

  if (currentBoard.equippedIds.length <= 1) {
    return { success: false, message: 'Mệnh Bàn phải duy trì tối thiểu 1 Mệnh Cách Tiên Thiên!', updatedPlayer: player };
  }

  const newEquippedIds = currentBoard.equippedIds.filter(id => id !== fateId);
  const totalRebornTimes = player.reincarnationState?.totalRebornTimes || 0;
  const maxSlots = getDestinySlotMaxCount(player.currentRealm || 0, totalRebornTimes);

  const updatedBoard: DestinySlotState = {
    ...currentBoard,
    unlockedSlots: maxSlots,
    equippedIds: newEquippedIds
  };

  const equippedFates = newEquippedIds.map(id => DESTINY_FATES[id]).filter(Boolean);
  const activeSynergies = getActiveDestinySynergies(newEquippedIds);

  const updatedPlayer: PlayerStats = {
    ...player,
    destiny: equippedFates[0] || player.destiny,
    destinyBoard: updatedBoard,
    destinies: equippedFates,
    activeSynergies: activeSynergies.map(s => s.id)
  };

  return {
    success: true,
    message: `Đã tháo gỡ Mệnh Cách [${DESTINY_FATES[fateId]?.name || fateId}] khỏi Mệnh Bàn.`,
    updatedPlayer
  };
}

/**
 * Tỉ lệ roll Mệnh Cách Tiên Thiên khi Tẩy Tủy:
 * Phàm Giai (Trắng): 60% (600)
 * Huyền Giai (Lam): 25% (250)
 * Địa Giai (Tím): 10% (100)
 * Thiên Giai (Cam): 4% (40)
 * Thần Giai (Hoàng Kim): 1% (10)
 */
export function rollDestinyOnReborn(): DestinyFate {
  const rand = Math.random() * 1000;
  let targetTier = 'Phàm Giai';

  if (rand < 10) {
    targetTier = 'Thần Giai'; // 1%
  } else if (rand < 50) {
    targetTier = 'Thiên Giai'; // 4%
  } else if (rand < 150) {
    targetTier = 'Địa Giai'; // 10%
  } else if (rand < 400) {
    targetTier = 'Huyền Giai'; // 25%
  } else {
    targetTier = 'Phàm Giai'; // 60%
  }

  const list = DESTINIES_BY_TIER[targetTier] || DESTINIES_BY_TIER['Phàm Giai'];
  return list[Math.floor(Math.random() * list.length)] || DEFAULT_DESTINY;
}

/**
 * Quay vòng quay bói quẻ / Nghịch Thiên Cải Mệnh (dùng Cải Mệnh Đan)
 */
export function rollRandomDestiny(excludeId?: string): DestinyFate {
  const pool = [
    { fate: DESTINY_FATES.thien_menh_chi_tu, weight: 1 },
    { fate: DESTINY_FATES.vo_thuong_tien_duyen, weight: 1 },
    { fate: DESTINY_FATES.van_gioi_doc_ton, weight: 1 },
    { fate: DESTINY_FATES.hon_don_dao_the, weight: 2 },
    { fate: DESTINY_FATES.hoang_co_thanh_the, weight: 2 },
    { fate: DESTINY_FATES.dai_nang_chuyen_the, weight: 4 },
    { fate: DESTINY_FATES.thien_sat_co_tinh, weight: 4 },
    { fate: DESTINY_FATES.ngu_hanh_te_tu, weight: 4 },
    { fate: DESTINY_FATES.khi_van_nghich_thien, weight: 6 },
    { fate: DESTINY_FATES.kiem_dao_doc_ton, weight: 6 },
    { fate: DESTINY_FATES.khi_van_hanh_thong, weight: 15 },
    { fate: DESTINY_FATES.dan_dao_ky_tai, weight: 15 },
    { fate: DESTINY_FATES.tram_yeu_tru_ma, weight: 15 },
    { fate: DESTINY_FATES.tieu_khang_chi_gia, weight: 30 },
    { fate: DESTINY_FATES.phuc_tinh_chieu_menh, weight: 30 },
    { fate: DESTINY_FATES.thao_moc_chi_duyen, weight: 30 },
    { fate: DESTINY_FATES.pham_nhan_menh_cach, weight: 60 }
  ].filter(item => item.fate.id !== excludeId);

  const totalWeight = pool.reduce((acc, cur) => acc + cur.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of pool) {
    if (roll < item.weight) {
      return item.fate;
    }
    roll -= item.weight;
  }

  return DESTINY_FATES.pham_nhan_menh_cach;
}

/**
 * Tính toán toàn diện hệ thống chỉ số chiến đấu mở rộng:
 * Công Kích (ATK), Phòng Ngự (DEF), Thần Thức (Soul), Tốc Độ (SPD), Bạo Kích (Crit Rate / Crit DMG), Né Đòn (Dodge)
 * Hỗ trợ Đa Thể Chất (physiques: Physique[]) cộng dồn toàn bộ chỉ số.
 */
export function calculateCombatStats(player: PlayerStats): CombatStats {
  const realm = player.currentRealm || 0;
  const canCot = player.canCot || 50;
  const ngoTinh = player.ngoTinh || 50;
  const tamCanh = player.tamCanh || 50;
  const khiVan = player.khiVan || 50;

  // 1. Chỉ số cơ bản theo cảnh giới & căn cốt
  let baseAtk = 25 + realm * 35 + Math.floor(canCot * 1.2);
  let baseDef = 15 + realm * 22 + Math.floor(canCot * 0.9);
  let baseSoul = Math.floor(tamCanh * 0.7 + ngoTinh * 0.7) + realm * 5;
  let baseSpeed = 30 + realm * 2 + Math.floor(ngoTinh * 0.3);
  let baseCritRate = 5 + Math.floor(khiVan * 0.15); // 5% - 20%
  let baseCritDmg = 150; // 150% (x1.5)

  // 2. Gia trì từ Trang Bị (Equipment) với hệ số Phẩm Chất (Sub-Quality Multiplier)
  let equipAtkPercent = 0;
  let equipDefPercent = 0;
  let gemArmorPen = 0;
  let gemDmgReduction = 0;
  let gemHpRegen = 0;
  let totalDodgeBonus = 0;
  let totalHutMau = 0;
  let totalXuyenGiap = 0;
  let totalPhanDmg = 0;
  let alloyTrueDamagePercent = 0;
  let alloySlowSpeedPercent = 0;
  let alloyBurnDamagePercent = 0;
  let alloyDamageReductionPercent = 0;
  let alloyCritResistPercent = 0;
  let inscriptionQiCostReduction = 0;

  const equipMap = player.equipment || (player as any).equippedEquipment;
  if (equipMap) {
    const allEquips: any[] = Array.isArray(equipMap)
      ? equipMap.filter(Boolean)
      : [equipMap.weapon, equipMap.armor, equipMap.boots, equipMap.accessory, equipMap.artifact, equipMap.ring].filter(Boolean);

    for (const eq of allEquips) {
      if (eq?.equipmentStats || eq?.stats) {
        const s = eq.equipmentStats || eq.stats;
        if (s.atk) baseAtk += s.atk;
        if (s.def) baseDef += s.def;
        if (s.speed) baseSpeed += s.speed;
        if (s.critRate) baseCritRate += s.critRate;
        if (s.critDmg) baseCritDmg += s.critDmg;
        if (s.dodge) totalDodgeBonus += s.dodge;
        if (s.penetration) totalXuyenGiap += s.penetration;
        if (s.damageReduction) gemDmgReduction += s.damageReduction;
        if (s.lifesteal) totalHutMau += s.lifesteal;
        if (eq.enhancement) {
          baseAtk += Math.floor((s.atk || 0) * eq.enhancement * 0.1);
          baseDef += Math.floor((s.def || 0) * eq.enhancement * 0.1);
          baseSpeed += eq.enhancement * 2;
        }
      } else {
        // Xử lý trang bị cổ điển (Legacy formula)
        const qMult = getItemQualityMultiplier(eq.quality || 'thuong_pham');
        const enhanceMod = 1 + (eq.enhancement || 0) * 0.15;
        if (eq.slot === 'weapon' || eq.type === 'weapon') {
          baseAtk += Math.floor((eq.powerBonus || 0) * qMult * 0.45 * enhanceMod);
          baseSpeed += (eq.enhancement || 0) * 2;
        } else if (eq.slot === 'armor' || eq.type === 'armor') {
          baseDef += Math.floor((eq.hpBonus || 0) * qMult * 0.25 * enhanceMod);
        } else if (eq.slot === 'boots' || eq.type === 'boots') {
          baseSpeed += Math.floor((eq.speedBonus || eq.powerBonus || 0) * qMult * 0.3 * enhanceMod);
        } else if (eq.slot === 'accessory' || eq.type === 'accessory' || eq.slot === 'ring') {
          baseSoul += Math.floor((20 + (eq.enhancement || 0) * 8) * qMult);
          baseDef += Math.floor((eq.powerBonus || 0) * qMult * 0.1 * enhanceMod);
        } else if (eq.slot === 'artifact' || eq.type === 'artifact') {
          baseAtk += Math.floor((eq.powerBonus || 0) * qMult * 0.25 * enhanceMod);
          baseCritRate += Math.floor((3 + (eq.enhancement || 0) * 1.5) * Math.min(2.0, qMult));
        }
      }
    }

    // Gia trì Linh Ngọc Khảm Nạp & Dòng Tẩy Luyện (Affixes) trên toàn bộ trang bị đang mặc
    for (const eq of allEquips) {
      if (eq?.sockets) {
        for (const s of eq.sockets) {
          if (s.gem?.statBonus) {
            const b = s.gem.statBonus;
            baseAtk += (b.congKich || 0);
            baseDef += (b.phongNgu || 0);
            baseSpeed += (b.tocDo || 0);
            baseCritRate += (b.baoKichRate || 0);
            baseCritDmg += (b.baoKichDmg || 0);
            gemArmorPen += (b.xuyenGiapRate || 0);
            gemDmgReduction += (b.dmgReduction || 0);
            gemHpRegen += (b.hpRegenPercent || 0);
          }
        }
      }
      if (eq?.affixes) {
        for (const a of eq.affixes) {
          if (a.statKey === 'congKichPercent') equipAtkPercent += a.value;
          if (a.statKey === 'phongNguPercent') equipDefPercent += a.value;
          if (a.statKey === 'baoKichDmg') baseCritDmg += a.value;
          if (a.statKey === 'hutMauRate') totalHutMau += a.value;
          if (a.statKey === 'xuyenGiapRate') totalXuyenGiap += a.value;
          if (a.statKey === 'phanDmgRate') totalPhanDmg += a.value;
        }
      }
    }

    // Gia trì từ Thần Binh Đoán Cốt Hợp Kim (Modular Metallurgy Special Affixes)
    for (const eq of allEquips) {
      if (eq?.alloyMetadata) {
        const affixes = eq.alloyMetadata.alloyComposition?.specialAffixes 
          || eq.alloyMetadata.alloyComposition?.elementalStats 
          || eq.alloyMetadata.elementalEffects;
        if (affixes) {
          if (affixes.trueDamagePercent) alloyTrueDamagePercent += affixes.trueDamagePercent;
          if (affixes.slowSpeedPercent) alloySlowSpeedPercent += affixes.slowSpeedPercent;
          if (affixes.burnDamagePercent) alloyBurnDamagePercent += affixes.burnDamagePercent;
          if (affixes.damageReductionPercent) alloyDamageReductionPercent += affixes.damageReductionPercent;
          if (affixes.critResistPercent) alloyCritResistPercent += affixes.critResistPercent;
        }
      }
    }

    // Gia trì từ Minh Khắc Trận Văn (Formation Inscription Passive Buffs)
    const inscriptionAgg = aggregateEquipmentInscriptions(allEquips);
    for (const passive of inscriptionAgg.passives) {
      if (
        passive.statKey === 'manaCostReduction' ||
        passive.statKey === 'qi_cost_reduction' ||
        passive.id.includes('tu_khi')
      ) {
        inscriptionQiCostReduction += (passive.value || 0);
      }
    }

    // Gia trì từ Phong Hồn Khí Linh (Soul Infusion Passive Combat Buffs)
    for (const eq of allEquips) {
      if (eq?.infusedSoul?.currentProc) {
        const proc = eq.infusedSoul.currentProc;
        if (proc.effectType === 'crit_and_pen') {
          // Bạch Hổ: +Crit Rate & +Xuyên Giáp
          baseCritRate += Math.round(proc.potencyValue * 100);
          totalXuyenGiap += Math.round((proc.penetrationPercent || 0.25) * 100);
        } else if (proc.effectType === 'defense_and_reflect') {
          // Huyền Vũ: +DEF% & +Phản sát thương
          equipDefPercent += Math.round(proc.potencyValue * 100);
          totalPhanDmg += Math.round((proc.reflectPercent || 0.15) * 100);
        } else if (proc.effectType === 'sword_burst') {
          // Cổ Kiếm Tu: +Kiếm khí sát thương
          equipAtkPercent += Math.round(proc.potencyValue * 100);
        }
      }
    }

    // ─── Huyết Khế Bản Mệnh: Nhân hệ số combatPowerMultiplier vào đóng góp của chính món trang bị đó ───
    // Quét lại allEquips: nếu trang bị có bloodBondData?.isBloodBound === true
    // nhân hệ số multiplier vào phần ATK, DEF, HP đóng góp riêng của trang bị đó.
    for (const eq of allEquips) {
      const bond = eq?.bloodBondData;
      if (!bond?.isBloodBound) continue;

      const multiplier = typeof bond.combatPowerMultiplier === 'number'
        ? bond.combatPowerMultiplier
        : 1.30;

      const extraFactor = multiplier - 1; // ví dụ 0.30 cho x1.30

      // Tính phần đóng góp cơ sở của trang bị (từ equipmentStats hoặc legacy formula)
      if (eq?.equipmentStats || eq?.stats) {
        const s = eq.equipmentStats || eq.stats;
        const equipAtk = (s.atk || 0) + Math.floor((s.atk || 0) * (eq.enhancement || 0) * 0.1);
        const equipDef = (s.def || 0) + Math.floor((s.def || 0) * (eq.enhancement || 0) * 0.1);
        baseAtk += Math.floor(equipAtk * extraFactor);
        baseDef += Math.floor(equipDef * extraFactor);
      } else {
        const qMult = getItemQualityMultiplier(eq.quality || 'thuong_pham');
        const enhanceMod = 1 + (eq.enhancement || 0) * 0.15;
        if (eq.slot === 'weapon' || eq.type === 'weapon') {
          const contribAtk = Math.floor((eq.powerBonus || 0) * qMult * 0.45 * enhanceMod);
          baseAtk += Math.floor(contribAtk * extraFactor);
        } else if (eq.slot === 'armor' || eq.type === 'armor') {
          const contribDef = Math.floor((eq.hpBonus || 0) * qMult * 0.25 * enhanceMod);
          baseDef += Math.floor(contribDef * extraFactor);
        } else if (eq.slot === 'boots' || eq.type === 'boots') {
          const contribSpd = Math.floor((eq.speedBonus || eq.powerBonus || 0) * qMult * 0.3 * enhanceMod);
          baseSpeed += Math.floor(contribSpd * extraFactor);
        } else if (eq.slot === 'artifact' || eq.type === 'artifact') {
          const contribAtk = Math.floor((eq.powerBonus || 0) * qMult * 0.25 * enhanceMod);
          baseAtk += Math.floor(contribAtk * extraFactor);
        }
      }
    }
  }

  if (equipAtkPercent > 0) baseAtk = Math.floor(baseAtk * (1 + equipAtkPercent / 100));
  if (equipDefPercent > 0) baseDef = Math.floor(baseDef * (1 + equipDefPercent / 100));

  // 3. Gia trì từ Công Pháp (Manuals & Synergy)
  if (player.manuals && player.equippedManuals) {
    const { tamPhap, theThuat, thanThong1, thanThong2 } = player.equippedManuals;
    const allEquippedIds = [tamPhap, theThuat, thanThong1, thanThong2].filter(Boolean);

    for (const mId of allEquippedIds) {
      const m = player.manuals.find(man => man.id === mId && man.level > 0);
      if (m) {
        const synergy = getManualSynergy(m, player.linhCan);
        const synMod = synergy.bonusMultiplier || 1.0;

        if (m.type === 'than_thong' && m.powerBonusPerLevel) {
          baseAtk += Math.floor(m.level * m.powerBonusPerLevel * 0.35 * synMod);
          baseCritRate += Math.floor(m.level * 0.8 * synMod);
        }
        if (m.type === 'the_thuat' && m.hpBonusPerLevel) {
          baseDef += Math.floor(m.level * m.hpBonusPerLevel * 0.12 * synMod);
        }
        if (m.type === 'tam_phap') {
          baseSoul += Math.floor(m.level * 4 * synMod);
          baseSpeed += Math.floor(m.level * 2 * synMod);
        }
      }
    }
  }

  // 4. Gia trì từ Thể Chất Tiên Thiên & Tôi Thể (Đa Thể Chất cộng dồn)
  const activePhysiques: Physique[] = (player.physiques && player.physiques.length > 0)
    ? player.physiques
    : (player.physique ? [player.physique] : []);

  let totalDmgPercent = 0;
  let totalDefPercent = 0;
  let totalCritDmgBonus = 0;
  let totalCritRateBonus = 0;
  // totalDodgeBonus đã được khai báo ở đầu hàm

  for (const p of activePhysiques) {
    totalDmgPercent += (p.damageBonusPercent || 0);
    totalDefPercent += (p.defenseBonusPercent || 0);
    totalCritDmgBonus += (p.critDamageBonus || 0);
    totalCritRateBonus += (p.critRateBonusPercent || 0);
    totalDodgeBonus += (p.dodgeBonusPercent || 0);
  }

  baseAtk = Math.floor(baseAtk * (1 + totalDmgPercent / 100));
  baseDef = Math.floor(baseDef * (1 + totalDefPercent / 100));
  baseCritDmg += totalCritDmgBonus;
  baseCritRate += totalCritRateBonus;
  baseSpeed += Math.floor(totalDodgeBonus * 0.5);

  // Bonus từ cảnh giới Tôi Thể (dựa trên thể chất chủ tu - thể chất đầu tiên)
  const primaryPhysique = activePhysiques[0] || player.physique;
  if (primaryPhysique) {
    const refBonus = getRefinementStatsBonus(primaryPhysique.refinementStage, primaryPhysique.refinementLevel);
    baseAtk += Math.floor(refBonus.powerBonus * 0.4);
    baseDef += Math.floor(refBonus.defenseBonus * 1.5);
  }

  // 5. Gia trì từ Linh Căn (Spiritual Root)
  if (player.linhCan) {
    baseAtk = Math.floor(baseAtk * (1 + (player.linhCan.damageBonus || 0) / 100));
    baseSpeed += Math.floor((player.linhCan.speedBonus || 0) * 0.4);
  }

  // 6. Gia trì từ Mệnh Cách (Destiny Fate) & Mệnh Bàn Tiên Thiên (Destiny Slots & Synergy)
  const equippedFates: DestinyFate[] = [];
  const fateIdSet = new Set<string>();

  if (player.destinyBoard?.equippedIds && player.destinyBoard.equippedIds.length > 0) {
    for (const fId of player.destinyBoard.equippedIds) {
      if (!fateIdSet.has(fId) && DESTINY_FATES[fId]) {
        equippedFates.push(DESTINY_FATES[fId]);
        fateIdSet.add(fId);
      }
    }
  } else if (player.destinies && player.destinies.length > 0) {
    for (const d of player.destinies) {
      if (d?.id && !fateIdSet.has(d.id)) {
        equippedFates.push(d);
        fateIdSet.add(d.id);
      }
    }
  }

  if (player.destiny && !fateIdSet.has(player.destiny.id)) {
    equippedFates.push(player.destiny);
    fateIdSet.add(player.destiny.id);
  }

  if (equippedFates.length === 0) {
    equippedFates.push(DEFAULT_DESTINY);
  }

  // Cộng dồn chỉ số từ tất cả Mệnh Cách đang khảm
  for (const fate of equippedFates) {
    if (!fate.effects) continue;
    const eff = fate.effects;
    if (eff.atkBonusPercent) baseAtk = Math.floor(baseAtk * (1 + eff.atkBonusPercent / 100));
    if (eff.defBonusPercent) baseDef = Math.floor(baseDef * (1 + eff.defBonusPercent / 100));
    if (eff.critRateBonus) baseCritRate += eff.critRateBonus;
    if (eff.critDmgBonus) baseCritDmg += eff.critDmgBonus;
    if (eff.speedBonus) baseSpeed += eff.speedBonus;
    if (eff.soulBonus) baseSoul += eff.soulBonus;
    if (eff.lifestealPercent) totalHutMau += eff.lifestealPercent;
    if (eff.dmgReduction) gemDmgReduction += eff.dmgReduction;
    if (eff.armorPenetrationPercent) totalXuyenGiap += eff.armorPenetrationPercent;
  }

  // Kích hoạt Tổ Hợp Mệnh Duyên (Destiny Synergies)
  const activeSynergies = getActiveDestinySynergies(Array.from(fateIdSet));
  for (const syn of activeSynergies) {
    if (!syn.effects) continue;
    const se = syn.effects;
    if (se.atkBonusPercent) baseAtk = Math.floor(baseAtk * (1 + se.atkBonusPercent / 100));
    if (se.defBonusPercent) baseDef = Math.floor(baseDef * (1 + se.defBonusPercent / 100));
    if (se.critRateBonus) baseCritRate += se.critRateBonus;
    if (se.critDmgBonus) baseCritDmg += se.critDmgBonus;
    if (se.speedBonus) baseSpeed += se.speedBonus;
    if (se.lifestealPercent) totalHutMau += se.lifestealPercent;
  }

  // 7. Buff đan dược tạm thời
  if (player.activeBuffs?.combatBuffPercent && (player.activeBuffs.combatBuffBattlesLeft || 0) > 0) {
    baseAtk = Math.floor(baseAtk * (1 + player.activeBuffs.combatBuffPercent / 100));
  }

  // 8. Gia trì từ Tông Môn & Hào Quang Trấn Phái (Sect Buffs & Elder Aura)
  const sectId = player.sectState?.sectId || player.sect;
  const sectRank = player.sectState?.rank || player.sectRank;

  if (sectId === 'huyet_sat_tong' || sectId === 'ma_dao') {
    baseAtk = Math.floor(baseAtk * 1.20); // +20% Công Kích
    baseCritRate += 10;
  } else if (sectId === 'thien_kiem_son' || sectId === 'kiem_phai') {
    baseCritDmg += 25; // +25% Sát thương bạo kích
    baseSoul = Math.floor(baseSoul * 1.15); // +15% Thần Thức
    baseSpeed += 15;
  } else if (sectId === 'thanh_van_mon' || sectId === 'chinh_dao') {
    baseDef = Math.floor(baseDef * 1.15); // +15% Thủ đạo môn
    baseSoul = Math.floor(baseSoul * 1.10);
  }

  // Hào Quang Trấn Phái cho Trưởng Lão & Chưởng Môn
  if (sectRank === 'chuong_mon') {
    baseAtk = Math.floor(baseAtk * 1.20); // +20% Trấn Phái Hào Quang
    baseDef = Math.floor(baseDef * 1.20);
    baseCritDmg += 20;
  } else if (sectRank === 'truong_lao') {
    baseAtk = Math.floor(baseAtk * 1.10); // +10% Trấn Phái Hào Quang
    baseDef = Math.floor(baseDef * 1.10);
  }

  // 9. Gia trì từ Đạo Lữ Tiên Duyên (Companion Buffs)
  const compBuffs = getBondedCompanionBuffs(player);
  if (compBuffs.atkBonusPercent) {
    baseAtk = Math.floor(baseAtk * (1 + compBuffs.atkBonusPercent / 100));
  }
  if (compBuffs.defBonusPercent) {
    baseDef = Math.floor(baseDef * (1 + compBuffs.defBonusPercent / 100));
  }
  if (compBuffs.critDmgBonus) {
    baseCritDmg += compBuffs.critDmgBonus;
  }
  if (compBuffs.speedBonus) {
    baseSpeed += compBuffs.speedBonus;
  }
  if (compBuffs.ngoTinhBonus) {
    baseSoul += Math.floor(compBuffs.ngoTinhBonus * 0.7);
    baseSpeed += Math.floor(compBuffs.ngoTinhBonus * 0.3);
  }
  if (compBuffs.khiVanBonus) {
    baseCritRate += Math.floor(compBuffs.khiVanBonus * 0.15);
  }

  // Gia trì trực tiếp từ Đạo Lữ Đồng Hành Sánh Bước (Active Companion Support)
  const activeCompId = player.companionsState?.activeCompanionId;
  const activeCompState = activeCompId && player.companionsState?.companions
    ? player.companionsState.companions[activeCompId]
    : null;
  let companionHpRegen = 0;
  // Chỉ gia trì khi Đạo Lữ tồn tại hợp lệ và đã được mở khóa/kết duyên
  if (activeCompId && activeCompState && (activeCompState.isBonded || activeCompState.isMet)) {
    if (activeCompId === 'companion_lac_thanh_tuyet') {
      // Lạc Thanh Tuyết: Tăng Kháng Băng & Phòng Ngự (+25% DEF)
      baseDef = Math.floor(baseDef * 1.25);
    } else if (activeCompId === 'companion_co_vo_diem') {
      // Cơ Vô Diễm: Tăng Tỉ Lệ Bạo Kích (+15%) và sát thương bạo kích (+25%)
      baseCritRate += 15;
      baseCritDmg += 25;
    } else if (activeCompId === 'companion_diep_chi_ham') {
      // Diệp Chỉ Hàm: Tự động hồi phục % HP mỗi hiệp đấu (+8%)
      companionHpRegen += 8;
    } else if (activeCompId === 'companion_nam_cung_uyen') {
      // Nam Cung Uyển: Tăng Tốc Độ ra chiêu (+35) và Sát Thương Lôi Hệ / Công Kích (+25%)
      baseSpeed += 35;
      baseAtk = Math.floor(baseAtk * 1.25);
    } else if (activeCompId === 'companion_tan_vu_mong') {
      // Tần Vũ Mộng: Tăng mạnh Thần Thức (+60) và tỉ lệ Né Tránh đòn chí mạng (+15%)
      baseSoul += 60;
      totalDodgeBonus += 15;
    } else if (activeCompId === 'companion_long_thien_nhi') {
      // Long Thiền Nhi: Chân Long Uy Áp (+25% DEF, +20% ATK)
      baseDef = Math.floor(baseDef * 1.25);
      baseAtk = Math.floor(baseAtk * 1.20);
    } else if (activeCompId === 'companion_da_mong_ly') {
      // Dạ Mộng Ly: Cửu Vĩ Thiên Huyễn (+30 Speed, +15% Tỉ Lệ Bạo Kích)
      baseSpeed += 30;
      baseCritRate += 15;
    } else if (activeCompId === 'companion_kiem_linh_to_tam') {
      // Kiếm Linh Tố Tâm: Kiếm Tâm Bất Diệt (+35% Bạo Kích Sát Thương, +20% Công Kích)
      baseCritDmg += 35;
      baseAtk = Math.floor(baseAtk * 1.20);
    }
  }

  // 10. Gia trì từ Nhục Thân (Thể Tu) & Thần Hồn (Hồn Tu)
  const bodyStats = getBodyRefinementStats(player.bodyRefinement);
  baseDef += bodyStats.defBonus;

  // Gia trì từ Huyền Công Luyện Thể (Expanded Physique System)
  const expandedPhysiqueStats = calculateTotalPhysiqueStats(player.physiqueState);
  if (expandedPhysiqueStats.atk) baseAtk += expandedPhysiqueStats.atk;
  if (expandedPhysiqueStats.def) baseDef += expandedPhysiqueStats.def;
  if (expandedPhysiqueStats.speed) baseSpeed += expandedPhysiqueStats.speed;
  if (expandedPhysiqueStats.critRate) baseCritRate += expandedPhysiqueStats.critRate;
  if (expandedPhysiqueStats.critDmg) baseCritDmg += expandedPhysiqueStats.critDmg;

  const soulStats = getSoulCultivationStats(player.soulCultivation);
  baseSoul += soulStats.soulBonus;
  baseSpeed += soulStats.speedBonus;
  baseCritRate += soulStats.critRateBonus;

  // Gia trì từ Thức Hải Thần Hồn (Soul & Consciousness System)
  const soulBuffs = calculateSoulBuffs(player.soulState);
  baseSoul += (soulBuffs.statsBonus.triLuc || 0) + (soulBuffs.statsBonus.tinhThan || 0);
  if (soulBuffs.statsBonus.speed) baseSpeed += soulBuffs.statsBonus.speed;
  if (soulBuffs.statsBonus.critRate) baseCritRate += soulBuffs.statsBonus.critRate;
  if (soulBuffs.statsBonus.critDmg) baseCritDmg += soulBuffs.statsBonus.critDmg;
  if (soulBuffs.statsBonus.atk) baseAtk += soulBuffs.statsBonus.atk;
  if (soulBuffs.statsBonus.def) baseDef += soulBuffs.statsBonus.def;

  // 11. Gia trì từ Danh Hiệu Tiên Giới (Title Buffs)
  const titleId = player.achievementsState?.equippedTitleId;
  if (titleId && TITLES_CONFIG[titleId]) {
    const tBuff = TITLES_CONFIG[titleId].buffs;
    if (tBuff.atkPercent) baseAtk = Math.floor(baseAtk * (1 + tBuff.atkPercent / 100));
    if (tBuff.defPercent) baseDef = Math.floor(baseDef * (1 + tBuff.defPercent / 100));
    if (tBuff.critRatePercent) baseCritRate += tBuff.critRatePercent;
    if (tBuff.critDmgPercent) baseCritDmg += tBuff.critDmgPercent;
    if (tBuff.speedBonus) baseSpeed += tBuff.speedBonus;
    if (tBuff.dmgReduction || tBuff.dmgReductionPercent) gemDmgReduction += (tBuff.dmgReduction || tBuff.dmgReductionPercent || 0);
    if (tBuff.lifestealPercent || tBuff.hutMauPercent) totalHutMau += (tBuff.lifestealPercent || tBuff.hutMauPercent || 0);
    if (tBuff.hpRegenPercent) gemHpRegen += tBuff.hpRegenPercent;
  }

  // 12. Gia trì từ Bản Mệnh Pháp Bảo & Khí Linh (Natal Artifact & Spirit Sentience)
  if (player.natalArtifact) {
    const natalBonus = calculateNatalCombatBonus(player);
    if (natalBonus.atkBonus) baseAtk += natalBonus.atkBonus;
    if (natalBonus.defBonus) baseDef += natalBonus.defBonus;
    if (natalBonus.critRateBonus) baseCritRate += natalBonus.critRateBonus;
    if (natalBonus.dmgReductionBonus) gemDmgReduction += natalBonus.dmgReductionBonus;
  }

  // 12.1. Gia trì từ Bản Mệnh Pháp Bảo Phong Ấn (Sealed Natal Artifact - 30% hiệu lực trước Trúc Cơ)
  if (player.reincarnationState?.sealedArtifact && !player.reincarnationState.sealedArtifact.isUnsealed) {
    const sealed = player.reincarnationState.sealedArtifact;
    const tier = sealed.originalTier || 1;
    const ratio = (sealed.sealedBonusPercent || 30) / 100;
    baseAtk += Math.floor(tier * 60 * ratio);
    baseDef += Math.floor(tier * 30 * ratio);
    gemDmgReduction += Math.floor(tier * 2 * ratio);
  }

  // 12.2. Gia trì từ Đạo Vận Tiên Bi & Huyết Mạch Tổ Tiên (Ancestral Resonance)
  if (player.reincarnationState?.pastLives && player.reincarnationState.pastLives.length > 0) {
    const ancestralRes = calculateAncestralResonance(player.reincarnationState.pastLives);
    if (ancestralRes.critDmgBonus) baseCritDmg += ancestralRes.critDmgBonus;
    if (ancestralRes.allStatsBonusPercent) {
      baseAtk = Math.floor(baseAtk * (1 + ancestralRes.allStatsBonusPercent / 100));
      baseDef = Math.floor(baseDef * (1 + ancestralRes.allStatsBonusPercent / 100));
      baseSoul = Math.floor(baseSoul * (1 + ancestralRes.allStatsBonusPercent / 100));
      baseSpeed = Math.floor(baseSpeed * (1 + ancestralRes.allStatsBonusPercent / 100));
    }
  }

  // 12.3. Gia trì từ Hương Hỏa Cúng Tế Tông Tộc (Active Offering Buff)
  const activeOffering = player.ancestralState?.activeBuff;
  if (activeOffering && activeOffering.expiresAt > Date.now()) {
    const ob = activeOffering.statBuffs;
    if (ob?.allStatsPercent) {
      baseAtk = Math.floor(baseAtk * (1 + ob.allStatsPercent / 100));
      baseDef = Math.floor(baseDef * (1 + ob.allStatsPercent / 100));
      baseSoul = Math.floor(baseSoul * (1 + ob.allStatsPercent / 100));
      baseSpeed = Math.floor(baseSpeed * (1 + ob.allStatsPercent / 100));
    }
    if (ob?.atkDefPercent) {
      baseAtk = Math.floor(baseAtk * (1 + ob.atkDefPercent / 100));
      baseDef = Math.floor(baseDef * (1 + ob.atkDefPercent / 100));
    }
    if (ob?.critRatePercent) {
      baseCritRate += ob.critRatePercent;
    }
  }

  // 12. Gia trì từ Kỳ Kinh Bát Mạch & Khai Khiếu (Meridian System)
  const meridianBonuses = calculateMeridianCombatBonuses(player.tuViEmpowermentState);
  if (meridianBonuses.atkPercent > 0) {
    baseAtk = Math.floor(baseAtk * (1 + meridianBonuses.atkPercent / 100));
  }
  if (meridianBonuses.defPercent > 0) {
    baseDef = Math.floor(baseDef * (1 + meridianBonuses.defPercent / 100));
  }
  if (meridianBonuses.speedBonus > 0) {
    baseSpeed += meridianBonuses.speedBonus;
  }
  if (meridianBonuses.critRatePercent > 0) {
    baseCritRate += meridianBonuses.critRatePercent;
  }
  if (meridianBonuses.critDmgPercent > 0) {
    baseCritDmg += meridianBonuses.critDmgPercent;
  }
  if (meridianBonuses.damageReductionPercent > 0) {
    gemDmgReduction += meridianBonuses.damageReductionPercent;
  }

  // Nhiên Tu Vi Overdrive (Cuồng Nộ Chiến Đấu: buff công kích & bạo kích)
  const overdriveBuff = player.tuViEmpowermentState?.overdriveBuff;
  const isOverdriveActive = Boolean(
    (player.tuViEmpowermentState?.overdriveActiveTurns ?? 0) > 0 ||
    (overdriveBuff?.isActive && (overdriveBuff.remainingTurns ?? 0) > 0)
  );
  if (isOverdriveActive) {
    const mult = overdriveBuff?.statMultiplier || 0.25;
    baseAtk = Math.floor(baseAtk * (1 + mult));
    baseCritRate += 15;
  }

  // 13. Gia trì từ Công Pháp Bí Tịch Cửu Giai (Learned Manuals Modifiers)
  const manualMods = calculateLearnedManualsModifiers(player.manualsState?.learnedManualIds || []);
  if ((manualMods.atkPercent || 0) > 0) {
    baseAtk = Math.floor(baseAtk * (1 + (manualMods.atkPercent || 0) / 100));
  }
  if ((manualMods.defPercent || 0) > 0) {
    baseDef = Math.floor(baseDef * (1 + (manualMods.defPercent || 0) / 100));
  }
  if ((manualMods.speedFlat || 0) > 0) {
    baseSpeed += (manualMods.speedFlat || 0);
  }
  if ((manualMods.critRatePercent || 0) > 0) {
    baseCritRate += (manualMods.critRatePercent || 0);
  }
  if ((manualMods.critDmgPercent || 0) > 0) {
    baseCritDmg += (manualMods.critDmgPercent || 0);
  }
  if ((manualMods.dodgePercent || 0) > 0) {
    totalDodgeBonus += (manualMods.dodgePercent || 0);
  }
  if ((manualMods.damageReductionPercent || 0) > 0) {
    gemDmgReduction += (manualMods.damageReductionPercent || 0);
  }
  if ((manualMods.lifestealPercent || 0) > 0) {
    totalHutMau += (manualMods.lifestealPercent || 0);
  }
  if ((manualMods.penetrationPercent || 0) > 0) {
    totalXuyenGiap += (manualMods.penetrationPercent || 0);
  }

  // 14. Gia trì từ Linh Thú Thần Sủng Xuất Chiến & Thần Hành Tọa Kỵ
  const beastBuffs = calculateActiveBeastsBuffs(player);
  if (beastBuffs.atkBonusPercent > 0) {
    baseAtk = Math.floor(baseAtk * (1 + beastBuffs.atkBonusPercent / 100));
  }
  if (beastBuffs.defBonusPercent > 0) {
    baseDef = Math.floor(baseDef * (1 + beastBuffs.defBonusPercent / 100));
  }
  if (beastBuffs.speedBonusFlat > 0) {
    baseSpeed += beastBuffs.speedBonusFlat;
  }
  if (beastBuffs.critRateBonus > 0) {
    baseCritRate += beastBuffs.critRateBonus;
  }
  if (beastBuffs.dodgeBonus > 0) {
    totalDodgeBonus += beastBuffs.dodgeBonus;
  }

  // 15. Gia trì từ Đạo Quả Thăng Hoa (Absorbed Dao Fruit Affixes)
  if (Array.isArray(player.absorbedDaoAffixes) && player.absorbedDaoAffixes.length > 0) {
    for (const affix of player.absorbedDaoAffixes) {
      if (!affix || !affix.statBonus) continue;
      const sb = affix.statBonus;
      if (sb.atkPercent) baseAtk = Math.floor(baseAtk * (1 + sb.atkPercent / 100));
      if (sb.defPercent) baseDef = Math.floor(baseDef * (1 + sb.defPercent / 100));
      if (sb.critRate) baseCritRate += sb.critRate;
      if (sb.dodgeRate) totalDodgeBonus += sb.dodgeRate;
      if (sb.damageReductionPercent) gemDmgReduction += sb.damageReductionPercent;
      if (sb.lifestealPercent) totalHutMau += sb.lifestealPercent;
    }
  }

  // 16. Gia trì từ Dược Tính Biến Dị Thiên Phú (Consumed Pill Mutations)
  const mutations = player.consumedMutations || {};
  if (mutations.lifesteal_percent) {
    totalHutMau += mutations.lifesteal_percent;
  }
  if (mutations.cast_speed_percent) {
    baseSpeed += Math.round(mutations.cast_speed_percent * 2);
  }
  const mutationFireResist = mutations.fire_resist_percent || 0;
  const mutationLightningResist = mutations.lightning_resist_percent || 0;
  const mutationIceResist = mutations.ice_resist_percent || 0;
  const mutationCritResist = mutations.crit_resist_percent || 0;
  const mutationHpPercent = mutations.max_hp_percent || 0;

  // Tỉ lệ né đòn từ Thần Thức, Thân Pháp Tốc Độ & Thể Chất (tối đa 45%)
  const naturalSpeedEvasion = Math.min(15, Math.floor(baseSpeed * 0.1));
  const dodgeRate = Math.min(45, Math.max(3, Math.floor(baseSoul * 0.12) + totalDodgeBonus + naturalSpeedEvasion));

    // Perk Đồng Cân Thiết Cốt: Căn Cốt >= 80 nhận thêm 1 tầng miễn thương +5%
    const canCotDmgReduction = canCot >= 80 ? 5 : 0;

    // Buff Hộ Sơn Đại Trận Tông Môn (Miễn thương & Khiên khởi đầu)
    const sectGuardianBuffs = (player.sectState || player.sectData)?.guardianArray?.buffs;
    const sectArrayDmgReduction = sectGuardianBuffs?.damageReduction || 0;
    const sectArrayShieldHp = sectGuardianBuffs?.combatStartShieldHp || 0;

    // Gia trì từ Trận Khí Tùy Thân (Orbiting Array Sets Passive Buffs)
    let formationArrayDamageReduction = 0;
    if (player.formationSetsState?.equippedArraySetId) {
      const arraySetId = player.formationSetsState.equippedArraySetId as FormationSetCategory;
      const arrayConfig = FORMATION_SETS_REGISTRY[arraySetId];
      const userProgress = player.formationSetsState.ownedSets?.[arraySetId];
      if (arrayConfig && userProgress) {
        const currentPieces = userProgress.currentPieces || 0;
        for (const threshold of arrayConfig.thresholdBonuses) {
          if (currentPieces >= threshold.requiredPieces && threshold.effects?.damageReductionPercent) {
            formationArrayDamageReduction += threshold.effects.damageReductionPercent;
          }
        }
      }
    }
    gemDmgReduction += formationArrayDamageReduction;

    // 17. Gia trì từ Thiên Phú Ẩn (Dao Foundation Innate Talents)
    let talentAllResistPercent = 0;
    let talentCritDmgMultiplier = 0;
    let talentQiRegenBonusPercent = 0;
    let talentMaxHpPercent = 0;

    const unlockedTalents = Array.isArray(player.unlockedInnateTalents) ? player.unlockedInnateTalents : [];
    for (const talentId of unlockedTalents) {
      const talentDef = INNATE_TALENTS_REGISTRY[talentId];
      if (talentDef?.statModifiers) {
        const sm = talentDef.statModifiers;
        if (sm.allResistPercent) talentAllResistPercent += sm.allResistPercent;
        if (sm.critDamageMultiplier) talentCritDmgMultiplier += sm.critDamageMultiplier;
        if (sm.qiRegenBonusPercent) talentQiRegenBonusPercent += sm.qiRegenBonusPercent;
        if (sm.maxHpPercent) talentMaxHpPercent += sm.maxHpPercent;
      }
    }

    if (talentCritDmgMultiplier > 0) {
      // Hệ số bạo kích cộng dồn vào baseCritDmg (+25% -> +25 điểm trên thang 150%)
      const critBonus = talentCritDmgMultiplier > 1 ? talentCritDmgMultiplier : Math.round(talentCritDmgMultiplier * 100);
      baseCritDmg += critBonus;
    }

    const stats: CombatStats = {
      atk: Math.max(10, baseAtk),
      def: Math.max(5, baseDef),
      soul: Math.max(10, baseSoul),
      speed: Math.max(10, baseSpeed),
      critRate: Math.min(95, Math.max(5, baseCritRate)),
      critDmg: Math.max(150, baseCritDmg),
      critDamageMultiplier: Number((Math.max(150, baseCritDmg) / 100).toFixed(2)),
      dodgeRate,
      dmgReduction: (bodyStats.dmgReduction || 0) + gemDmgReduction + canCotDmgReduction + sectArrayDmgReduction + alloyDamageReductionPercent + (expandedPhysiqueStats.damageReduction || 0) + Math.floor((soulBuffs.statsBonus.khangPhep || 0) * 0.2) + (player.permanentDmgReduction || player.dmgReduction || 0) + talentAllResistPercent,
      combatStartShieldHp: sectArrayShieldHp,
      hpRegenPercent: (bodyStats.hpRegenPercent || 0) + companionHpRegen + gemHpRegen + (expandedPhysiqueStats.hpRegen || 0),
      soulSuppression: Boolean(soulStats.soulSuppression || (soulBuffs.spiritualPressure > 0)),
      spiritualPressure: soulBuffs.spiritualPressure || 0,
      hutMauRate: totalHutMau + (player.hutMauRate || 0),
      xuyenGiapRate: totalXuyenGiap + gemArmorPen + (expandedPhysiqueStats.trueDmgPercent || 0),
      phanDmgRate: totalPhanDmg + (expandedPhysiqueStats.counterDmgPercent || 0),
      trueDamagePercent: alloyTrueDamagePercent,
      slowSpeedPercent: alloySlowSpeedPercent,
      burnDamagePercent: alloyBurnDamagePercent,
      damageReductionPercent: (bodyStats.dmgReduction || 0) + gemDmgReduction + canCotDmgReduction + sectArrayDmgReduction + alloyDamageReductionPercent + (expandedPhysiqueStats.damageReduction || 0) + Math.floor((soulBuffs.statsBonus.khangPhep || 0) * 0.2) + (player.permanentDmgReduction || player.dmgReduction || 0) + talentAllResistPercent,
      allResistPercent: talentAllResistPercent,
      critResistPercent: mutationCritResist + alloyCritResistPercent,
      fireResistPercent: mutationFireResist + talentAllResistPercent,
      lightningResistPercent: mutationLightningResist + talentAllResistPercent,
      iceResistPercent: mutationIceResist + talentAllResistPercent,
      castSpeedPercent: mutations.cast_speed_percent || 0,
      maxHpPercent: mutationHpPercent + talentMaxHpPercent,
      qiRegenBonusPercent: talentQiRegenBonusPercent,
      mpRegen: talentQiRegenBonusPercent,
      mpRegenPercent: talentQiRegenBonusPercent,
      qi_cost_reduction: inscriptionQiCostReduction,
      qiCostReduction: inscriptionQiCostReduction,
      qiCostReductionPercent: Math.round(inscriptionQiCostReduction * 100),
      manaCostReduction: inscriptionQiCostReduction,
      manaCostReductionPercent: Math.round(inscriptionQiCostReduction * 100),
      consumedMutations: { ...mutations }
    };

    if (player.maxHp || player.khiHuyet) {
      const baseHp = player.maxHp || player.khiHuyet || 1000;
      stats.maxHp = Math.round(baseHp * (1 + (stats.maxHpPercent || 0) / 100));
      stats.hp = stats.maxHp;
    }

    // Debuff Trọng Thương do Đan Độc & Tâm Ma Phản Phệ: Giảm trực tiếp 30% ATK & DEF
    if (player.injuryState?.isInjured) {
      stats.atk = Math.round(stats.atk * 0.70);
      stats.def = Math.round(stats.def * 0.70);
    }

    return stats;
  }
