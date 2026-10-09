// lib/cultivate-data.ts
// Dữ liệu và logic Kỳ Duyên Bế Quan, Tâm Pháp Phương Hướng và Biến Cố Động Phủ

import {
  CultivateStance,
  CultivateDropItem,
  CultivateEncounterEvent,
  PlayerStats,
  Herb,
  Ore,
  Pill
} from '@/lib/types';
import { DEFAULT_HERBS, DEFAULT_ORES, PILL_TEMPLATES } from '@/lib/alchemy-data';
import { getBondedCompanionBuffs } from '@/lib/companions-data';

export interface CultivateStanceOption {
  id: CultivateStance;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  color: string;
  borderClass: string;
  bgClass: string;
  activeClass: string;
  tuViMultiplier: number;
  dropRateMultiplier: number;
  linhThachMultiplier: number;
  tamMaBaseRisk: number; // 0.15 = 15%
}

export const CULTIVATE_STANCES: Record<CultivateStance, CultivateStanceOption> = {
  co_ban: {
    id: 'co_ban',
    name: 'Thế 1: Ổn Định Cố Bản',
    badge: 'An Toàn 100%',
    tagline: 'Vững chắc • Thu vi tiêu chuẩn • Không rủi ro',
    description: 'Tĩnh tâm cố bản bồi nguyên, nạp khí tuần hoàn đại chu thiên hoàn mỹ. Thu hoạch Tu Vi & Linh Thạch tiêu chuẩn, tuyệt đối an toàn.',
    color: 'emerald',
    borderClass: 'border-emerald-600/40 hover:border-emerald-500',
    bgClass: 'bg-emerald-950/20',
    activeClass: 'border-emerald-400 bg-emerald-900/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    tuViMultiplier: 1.0,
    dropRateMultiplier: 1.0,
    linhThachMultiplier: 1.0,
    tamMaBaseRisk: 0.0
  },
  hiem_canh: {
    id: 'hiem_canh',
    name: 'Thế 2: Đốn Ngộ Hiểm Cảnh',
    badge: '+50% Tu Vi • x2 Bảo Vật',
    tagline: 'Mạo hiểm • Tăng mạnh Tu Vi • 15% Tâm Ma',
    description: 'Cưỡng ép dẫn động thiên địa linh khí cuồng bạo để đốn ngộ đạo cảnh. Tăng 50% Tu Vi, gấp đôi tỉ lệ rơi bảo vật hiếm, nhưng có 15% nguy cơ gặp Tâm Ma phản phệ.',
    color: 'purple',
    borderClass: 'border-purple-600/40 hover:border-purple-500',
    bgClass: 'bg-purple-950/20',
    activeClass: 'border-purple-400 bg-purple-900/40 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    tuViMultiplier: 1.5,
    dropRateMultiplier: 2.0,
    linhThachMultiplier: 1.2,
    tamMaBaseRisk: 0.15
  },
  doat_bao: {
    id: 'doat_bao',
    name: 'Thế 3: Dẫn Khí Đoạt Bảo',
    badge: 'Tầm Bảo Linh Mạch',
    tagline: 'Thu gom cực đại Linh Thạch • Dược Liệu • Khoáng Thạch',
    description: 'Khuếch trương thần thức quét ngang linh mạch xung quanh động phủ, tăng mạnh số lượng Hạ Phẩm & Trung Phẩm Linh Thạch, dược liệu và khoáng thạch hiếm.',
    color: 'amber',
    borderClass: 'border-amber-600/40 hover:border-amber-500',
    bgClass: 'bg-amber-950/20',
    activeClass: 'border-amber-400 bg-amber-900/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    tuViMultiplier: 1.0,
    dropRateMultiplier: 2.5,
    linhThachMultiplier: 2.5,
    tamMaBaseRisk: 0.0
  }
};

/**
 * Tính số sự kiện bế quan dựa trên thời gian bế quan (2 đến 6 sự kiện)
 */
export function getIdleEventCount(durationMins: number): number {
  if (durationMins >= 1440) return 6; // 24h
  if (durationMins >= 720) return 5;  // 12h
  if (durationMins >= 240) return 4;  // 4h
  if (durationMins >= 60) return 3;   // 1h
  return 2;                           // 15p
}

/**
 * Sinh danh sách Kỳ Duyên Bế Quan và tính toán phần thưởng/rủi ro
 */
export function generateCultivateEncounters(
  player: PlayerStats,
  durationMins: number,
  stance: CultivateStance = 'co_ban'
): {
  events: CultivateEncounterEvent[];
  extraDrops: CultivateDropItem[];
  extraLinhThach: number;
  extraTrungPham: number;
  extraTinhHuyet: number;
  extraNgoTinh: number;
  extraKhiVan: number;
  extraBodyExp: number;
  tamMaTriggered: boolean;
  hpLoss: number;
  mpLoss: number;
} {
  const stanceCfg = CULTIVATE_STANCES[stance] || CULTIVATE_STANCES.co_ban;
  const targetCount = getIdleEventCount(durationMins);
  const events: CultivateEncounterEvent[] = [];
  const extraDrops: CultivateDropItem[] = [];

  let extraLinhThach = 0;
  let extraTrungPham = 0;
  let extraTinhHuyet = 0;
  let extraNgoTinh = 0;
  let extraKhiVan = 0;
  let extraBodyExp = 0;
  let tamMaTriggered = false;
  let hpLoss = 0;
  let mpLoss = 0;

  // 1. Kiểm tra nguy cơ Tâm Ma nếu ở Thế 2: Đốn Ngộ Hiểm Cảnh hoặc do Quẻ Hung / Đại Hung
  const isBadFate = player.dailyDivination?.hexagram === 'hung' || player.dailyDivination?.hexagram === 'dai_hung';
  let baseRisk = stanceCfg.tamMaBaseRisk;
  if (isBadFate) {
    baseRisk = baseRisk > 0 ? baseRisk * 1.25 : 0.25; // Tăng 25% nguy cơ gặp Tâm Ma phản phệ
  }

  if (baseRisk > 0) {
    let effectiveRisk = baseRisk;

    // Giảm 20% nguy cơ nếu ở trong Tông Môn
    const inSect = Boolean(player.sectState?.sectId || player.sect || player.tongMon);
    if (inSect) {
      effectiveRisk *= 0.8;
    }

    // Giảm 50% nguy cơ nếu có buff Tâm Tịnh Thần Diệu (từ Song Tu hoặc Linh Đan)
    const isTamTinhActive = Boolean(
      (player.activeBuffs?.tamTinhThanDieuUntil && Date.now() < player.activeBuffs.tamTinhThanDieuUntil) ||
      (player.companionsState?.tamTinhThanDieuUntil && Date.now() < player.companionsState.tamTinhThanDieuUntil)
    );
    if (isTamTinhActive) {
      effectiveRisk *= 0.5;
    }

    if (Math.random() < effectiveRisk) {
      tamMaTriggered = true;
      const maxHP = player.maxKhiHuyet || 1000;
      const maxMP = player.maxLinhLuc || 500;
      // Tổn hao 15% - 25% HP hoặc MP
      const isHpDamage = Math.random() < 0.5;
      if (isHpDamage) {
        hpLoss = Math.floor(maxHP * (0.15 + Math.random() * 0.10));
      } else {
        mpLoss = Math.floor(maxMP * (0.15 + Math.random() * 0.10));
      }

      events.push({
        id: `tam_ma_${Date.now()}_${Math.random()}`,
        title: isBadFate ? 'Vận Rủi - Tâm Ma Quấy Nhiễu' : 'Tâm Ma Quấy Nhiễu Phản Phệ',
        category: 'tam_ma',
        description: isBadFate 
          ? 'Quẻ mệnh Hung Sát giáng lâm! Ma ảnh phản chiếu trong tâm thức bùng nổ, phá hoại chu thiên linh lực!'
          : 'Vận chuyển linh lực cưỡng ép quá mức khiến sát niệm dâng trào, ảo cảnh ma đầu xâm nhập thần thức!',
        flavorQuote: 'Đạo tâm bất ổn, ma chướng phát tác!',
        rewardSummary: isHpDamage
          ? `Tổn thương khí huyết: -${hpLoss.toLocaleString()} Khí Huyết (HP)`
          : `Chân nguyên tán loạn: -${mpLoss.toLocaleString()} Chân Nguyên (MP)`,
        hpDeduction: hpLoss,
        mpDeduction: mpLoss
      });
    }
  }

  // Quẻ Hung / Đại Hung: Kích hoạt xác suất 30% gặp "Ma Đạo Sát Thủ Tập Kích" lúc bế quan
  if (isBadFate && Math.random() < 0.30) {
    const playerPower = (player.congKich || 100) + (player.phongNgu || 50);
    const assassinPower = Math.floor(playerPower * (0.75 + Math.random() * 0.4));
    const winCombat = playerPower >= assassinPower;

    if (winCombat) {
      const lootLinhThach = Math.floor(500 + Math.random() * 1500);
      extraLinhThach += lootLinhThach;
      events.push({
        id: `assassin_${Date.now()}_${Math.random()}`,
        title: 'Ma Đạo Sát Thủ Tập Kích (Đẩy Lui)',
        category: 'bien_co',
        description: 'Vận mệnh u ám kích phát sát cơ! Một thích khách Ma Đạo thừa cơ ngươi đang thổ nạp sâu lẻn vào hành thích. Ngươi kịp thời thức tỉnh bạo phát hộ thể thần quang đánh bại đối thủ!',
        flavorQuote: 'Thiên địa vô tình, hung sát quy tịch!',
        rewardSummary: `Đánh lui sát thủ! Tịch thu +${lootLinhThach.toLocaleString()} Linh Thạch trên người đối phương.`,
        linhThachBonus: lootLinhThach
      });
    } else {
      const lostLinhThach = Math.min(player.linhThach || 0, Math.floor(800 + Math.random() * 1500));
      extraLinhThach -= lostLinhThach;
      const assassinHpLoss = Math.floor((player.maxKhiHuyet || 1000) * 0.2);
      hpLoss += assassinHpLoss;
      events.push({
        id: `assassin_${Date.now()}_${Math.random()}`,
        title: 'Ma Đạo Sát Thủ Tập Kích (Trọng Thương & Mất Của)',
        category: 'tam_ma',
        description: 'Vận rủi Đại Hung ám quẻ! Thích khách Ma Đạo ra tay tàn độc phá nát động phủ cấm chế. Ngươi trọng thương thổ huyết, túi trữ vật bị cướp mất một phần linh thạch!',
        flavorQuote: 'Họa vô đơn chí, ma đạo hoành hành!',
        rewardSummary: `Bị thương -${assassinHpLoss.toLocaleString()} HP & Bị cướp mất -${lostLinhThach.toLocaleString()} Linh Thạch!`,
        hpDeduction: assassinHpLoss
      });
    }
  }

  // Pool danh sách các loại kỳ duyên
  const poolTypes = [
    'dao_trung_tinh_thach',
    'co_tu_di_trach',
    'linh_dieu_hien_thao',
    'thien_nhan_tuong_ung',
    'tan_tu_dot_nhap',
    'dia_hoa_dang_trao'
  ];

  // Trộn và chọn các sự kiện ngẫu nhiên
  const shuffled = [...poolTypes].sort(() => 0.5 - Math.random());
  const selectedTypes = shuffled.slice(0, Math.min(targetCount, shuffled.length));

  // Nếu targetCount lớn hơn poolTypes.length, lặp lại một số loại đại phú
  while (selectedTypes.length < targetCount) {
    selectedTypes.push(poolTypes[Math.floor(Math.random() * poolTypes.length)]);
  }

  for (const type of selectedTypes) {
    if (type === 'dao_trung_tinh_thach') {
      // "Đào trúng Tinh Thạch Mạch": Động phủ phát lộ linh mạch cổ
      const baseHaPham = Math.floor((1500 + Math.random() * 3500) * (durationMins >= 720 ? 2 : 1) * stanceCfg.linhThachMultiplier);
      const trungPham = durationMins >= 240 ? Math.floor(Math.random() * 3) + 1 : 1;
      extraLinhThach += baseHaPham;
      extraTrungPham += trungPham;

      extraDrops.push({
        type: 'trungPhamLinhThach',
        name: 'Trung Phẩm Linh Thạch',
        quantity: trungPham,
        quality: 'Trung Phẩm',
        description: `Ngưng tụ từ linh nhãn cổ xưa sâu dưới động phủ.`
      });

      events.push({
        id: `event_tinh_thach_${Date.now()}_${Math.random()}`,
        title: 'Đào Trúng Tinh Thạch Mạch',
        category: 'dai_phu',
        description: 'Dưới lòng động phủ bất ngờ phát lộ một nhánh linh mạch viễn cổ, linh quang lấp lánh chói lòa!',
        flavorQuote: 'Linh mạch xuất thế, tinh thạch ngưng tụ thành châu!',
        rewardSummary: `+${baseHaPham.toLocaleString()} Hạ Phẩm Linh Thạch & +${trungPham} Trung Phẩm Linh Thạch`,
        linhThachBonus: baseHaPham,
        trungPhamLinhThachBonus: trungPham
      });

    } else if (type === 'co_tu_di_trach') {
      // "Cổ Tu Di Trạch giáng thế": Nhặt được [Túi Trữ Vật Rách Nát] mở ra Đan Dược phẩm cao hoặc Tinh Huyết
      const isPill = Math.random() < 0.65;
      if (isPill) {
        const highTierPillKeys = [
          'pill_thai_thanh_quy_nguyen',
          'pill_bach_ngoc_pha_chuong',
          'pill_truc_co_cuc_pham',
          'pill_cuong_bao',
          'pill_hoi_thien',
          'pill_tay_linh'
        ];
        const pickedKey = highTierPillKeys[Math.floor(Math.random() * highTierPillKeys.length)];
        const pillData = PILL_TEMPLATES[pickedKey] || Object.values(PILL_TEMPLATES)[0];
        
        if (pillData) {
          extraDrops.push({
            type: 'pill',
            name: pillData.name,
            quantity: 1,
            quality: pillData.grade || 'Cực Phẩm',
            description: `Tìm thấy trong di trạch tiền bối tọa hóa.`,
            data: pillData
          });

          events.push({
            id: `event_di_trach_${Date.now()}_${Math.random()}`,
            title: 'Cổ Tu Di Trạch Giáng Thế',
            category: 'dai_phu',
            description: 'Vô tình phát hiện một thạch động bí mật của tiền bối tọa hóa, nhặt được [Túi Trữ Vật Rách Nát]!',
            flavorQuote: 'Kế thừa tiên duyên, bảo đan ngàn năm vẫn tỏa hương thuần khiết.',
            rewardSummary: `Nhặt được 1 viên [${pillData.name}] (${pillData.grade || 'Cực Phẩm'})`,
            itemDrop: {
              type: 'pill',
              name: pillData.name,
              quantity: 1,
              quality: pillData.grade || 'Cực Phẩm',
              description: pillData.description,
              data: pillData
            }
          });
        }
      } else {
        const bloodAmount = Math.floor(Math.random() * 8) + 8; // 8 - 15 Tinh Huyết
        extraTinhHuyet += bloodAmount;

        extraDrops.push({
          type: 'tinhHuyet',
          name: 'Tinh Huyết Yêu Thú',
          quantity: bloodAmount,
          quality: 'Tuyệt Phẩm',
          description: `Chứa trong bình ngọc cổ xưa trong di trạch.`
        });

        events.push({
          id: `event_tinh_huyet_${Date.now()}_${Math.random()}`,
          title: 'Cổ Tu Di Trạch Giáng Thế',
          category: 'dai_phu',
          description: 'Mở túi trữ vật của cổ tu, phát hiện một bình ngọc niêm phong huyết khí yêu vương thượng cổ!',
          flavorQuote: 'Khí huyết hùng hồn, rèn đúc gân cốt thần thánh.',
          rewardSummary: `+${bloodAmount} Tinh Huyết Yêu Thú (Dùng cho Tôi Thể / Rèn Đúc)`,
          tinhHuyetBonus: bloodAmount
        });
      }

    } else if (type === 'linh_dieu_hien_thao') {
      // "Linh Điểu Hiến Thảo": Tiên hạc mang tới một nhánh thảo dược ngàn năm
      const rareHerbs: Herb[] = DEFAULT_HERBS.filter(h => 
        h.id === 'hoa_than_linh_diep' || 
        h.id === 'cuu_chuyen_ngoc_tuy' || 
        h.id === 'truc_co_chi_lan' || 
        h.id === 'huyet_tinh_thao' ||
        h.id === 'tay_tuy_linh_nhi'
      );
      const pickedHerb = (rareHerbs.length > 0 ? rareHerbs[Math.floor(Math.random() * rareHerbs.length)] : DEFAULT_HERBS[0]);
      const qty = durationMins >= 720 ? 2 : 1;

      extraDrops.push({
        type: 'herb',
        name: pickedHerb.name,
        quantity: qty,
        quality: pickedHerb.grade,
        description: `Tiên hạc từ cửu tiêu bay xuống hiến tặng.`,
        data: pickedHerb
      });

      events.push({
        id: `event_linh_dieu_${Date.now()}_${Math.random()}`,
        title: 'Linh Điểu Hiến Thảo',
        category: 'dai_phu',
        description: 'Một đôi tiên hạc phiêu dật từ tầng mây sà xuống động phủ, ngậm theo linh thảo ngàn năm dâng hiến!',
        flavorQuote: 'Linh hạc hiểu ý người, tiên duyên tự nhiên đến.',
        rewardSummary: `Thu hái ${qty} nhánh [${pickedHerb.name}] (${pickedHerb.grade})`,
        itemDrop: {
          type: 'herb',
          name: pickedHerb.name,
          quantity: qty,
          quality: pickedHerb.grade,
          description: pickedHerb.description,
          data: pickedHerb
        }
      });

    } else if (type === 'thien_nhan_tuong_ung') {
      // "Thiên Nhân Tương Ứng / Đốn Ngộ Sơ Khai": Tăng vĩnh viễn 1-2 điểm Ngộ Tính hoặc Khí Vận
      const isNgoTinh = Math.random() < 0.5;
      const points = durationMins >= 720 ? 2 : 1;
      if (isNgoTinh) {
        extraNgoTinh += points;
      } else {
        extraKhiVan += points;
      }

      events.push({
        id: `event_thien_nhan_${Date.now()}_${Math.random()}`,
        title: 'Thiên Nhân Tương Ứng • Đốn Ngộ Sơ Khai',
        category: 'bien_co',
        description: 'Trong cơn định quán, tâm thần dung hợp với đại đạo pháp tắc, tiên căn thăng hoa vượt bậc!',
        flavorQuote: 'Triều văn đạo, tịch khả tử hĩ! Đạo vận vô song.',
        rewardSummary: isNgoTinh
          ? `Tăng vĩnh viễn +${points} Ngộ Tính thiên phú!`
          : `Tăng vĩnh viễn +${points} Khí Vận thiên mệnh!`,
        ngoTinhBonus: isNgoTinh ? points : 0,
        khiVanBonus: !isNgoTinh ? points : 0
      });

    } else if (type === 'tan_tu_dot_nhap') {
      // "Tán Tu Đột Nhập Động Phủ": Tự động giao tranh đẩy lui kẻ trộm, cướp ngược lại Linh Thạch và Pháp Bảo tàn phiến / khoáng thạch
      const stolenLinhThach = Math.floor((800 + Math.random() * 2200) * stanceCfg.linhThachMultiplier);
      extraLinhThach += stolenLinhThach;

      // Nhặt thêm Mảnh Cổ Bảo hoặc Khoáng thạch hiếm
      const oreList: Ore[] = DEFAULT_ORES.filter(o => 
        o.id === 'manh_co_bao' || 
        o.id === 'than_binh_tan_phien' || 
        o.id === 'thai_at_tinh_kim' || 
        o.id === 'bang_tinh_khoang'
      );
      const pickedOre = oreList.length > 0 ? oreList[Math.floor(Math.random() * oreList.length)] : DEFAULT_ORES[0];

      extraDrops.push({
        type: 'ore',
        name: pickedOre.name,
        quantity: 1,
        quality: pickedOre.grade,
        description: `Tịch thu từ tán tu liều lĩnh đột nhập động phủ.`,
        data: pickedOre
      });

      events.push({
        id: `event_tan_tu_${Date.now()}_${Math.random()}`,
        title: 'Tán Tu Đột Nhập Động Phủ',
        category: 'bien_co',
        description: 'Một tên tặc tu lén lút lẻn vào động phủ trộm cắp linh khí. Ngươi tức thì mở mắt thi triển kiếm khí áp đảo, tước đoạt toàn bộ bảo vật của hắn!',
        flavorQuote: 'Gieo gió gặt bão, kẻ trộm biến thành người đưa quà!',
        rewardSummary: `Đoạt lại +${stolenLinhThach.toLocaleString()} Linh Thạch & 1 khối [${pickedOre.name}]`,
        linhThachBonus: stolenLinhThach,
        itemDrop: {
          type: 'ore',
          name: pickedOre.name,
          quantity: 1,
          quality: pickedOre.grade,
          description: pickedOre.description,
          data: pickedOre
        }
      });

    } else if (type === 'dia_hoa_dang_trao') {
      // "Địa Hỏa Dâng Trào": Rèn luyện nhục thân, tăng thêm điểm tiến độ Nhục Thân/Tôi Thể
      const expPoints = Math.floor((600 + Math.random() * 1200) * (durationMins >= 720 ? 1.8 : 1));
      extraBodyExp += expPoints;

      events.push({
        id: `event_dia_hoa_${Date.now()}_${Math.random()}`,
        title: 'Địa Hỏa Dâng Trào Tôi Thể',
        category: 'bien_co',
        description: 'Địa tâm bốc cháy hỏa diễm cuồn cuộn tràn vào bế quan thạch thất. Ngươi mượn chân hỏa tôi luyện gân cốt, huyết nhục cứng rắn như bàn thạch!',
        flavorQuote: 'Liệt hỏa phần thân, kim thân bất diệt!',
        rewardSummary: `+${expPoints.toLocaleString()} Điểm Tiến Độ Nhục Thân / Tôi Thể`,
        bodyExpBonus: expPoints
      });
    }
  }

  return {
    events,
    extraDrops,
    extraLinhThach,
    extraTrungPham,
    extraTinhHuyet,
    extraNgoTinh,
    extraKhiVan,
    extraBodyExp,
    tamMaTriggered,
    hpLoss,
    mpLoss
  };
}

/**
 * Trả về thông tin cộng hưởng Đạo Lữ & Tông Môn hiển thị trên UI
 */
export function getCultivateResonanceInfo(player: PlayerStats): {
  hasCompanion: boolean;
  companionText?: string;
  hasSect: boolean;
  sectText?: string;
  tamThanText?: string;
  tamTinhText?: string;
} {
  // 1. Đạo Lữ hộ pháp
  const bondedComps = Object.values(player.companionsState?.companions || {}).filter(c => c.isBonded);
  const activeCompId = player.companionsState?.activeCompanionId;
  const isActiveValid = Boolean(activeCompId && player.companionsState?.companions?.[activeCompId]?.isBonded);
  const hasCompanion = isActiveValid || bondedComps.length > 0;
  const companionText = hasCompanion ? '🌸 Đạo Lữ hộ pháp: +15% Tốc độ Thổ Nạp' : undefined;

  // 2. Tông Môn tẩm bổ
  const hasSect = Boolean(player.sectState?.sectId || player.sect || player.tongMon);
  const sectText = hasSect ? '🏛️ Linh Mạch Tông Môn tẩm bổ: Giảm 20% nguy cơ gặp tâm ma' : undefined;

  // 3. Tâm Thần Hợp Nhất (Song tu)
  const isTamThanActive = Boolean(
    player.companionsState?.tamThanHopNhatUntil && Date.now() < player.companionsState.tamThanHopNhatUntil
  );
  const tamThanText = isTamThanActive ? '🔮 Tâm Thần Hợp Nhất: +20% Tốc độ tu luyện (Song Tu)' : undefined;

  // 4. Tâm Tịnh Thần Diệu
  const isTamTinhActive = Boolean(
    (player.activeBuffs?.tamTinhThanDieuUntil && Date.now() < player.activeBuffs.tamTinhThanDieuUntil) ||
    (player.companionsState?.tamTinhThanDieuUntil && Date.now() < player.companionsState.tamTinhThanDieuUntil)
  );
  const tamTinhText = isTamTinhActive ? '✨ Tâm Tịnh Thần Diệu: Giảm 50% nguy cơ Tâm Ma' : undefined;

  return {
    hasCompanion,
    companionText,
    hasSect,
    sectText,
    tamThanText,
    tamTinhText
  };
}
