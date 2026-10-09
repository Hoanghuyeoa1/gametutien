// lib/dual-cultivation-event-logic.ts
// PURE BUSINESS LOGIC & EVENT ENGINE CHO HỆ THỐNG BIẾN CỐ SONG TU ĐẠO LỮ CỬU GIAI

import {
  PlayerStats,
  DualCultivationEvent,
  DualEventChoice,
  DualEventResolutionResult,
  DualEventHistoryRecord,
  CompanionWithState
} from './types';

// =========================================================================
// HELPER: XÁC ĐỊNH PHẨM CẤP (TIER) ĐẠO LỮ (1 -> 9)
// =========================================================================
export function getCompanionTier(comp: any): number {
  if (!comp) return 1;
  if (typeof comp.tier === 'number') return comp.tier;
  if (typeof comp.shopTier === 'number') return comp.shopTier;
  if (typeof comp.id === 'string' && (comp.id.includes('t9_') || comp.id.includes('_t9_'))) return 9;
  if (typeof comp.grade === 'string' && comp.grade.includes('Cửu Giai')) return 9;
  if (typeof comp.title === 'string' && (comp.title.includes('Cửu Giai') || comp.title.includes('Thần Cấp') || comp.title.includes('Tiên Thiên'))) return 9;
  if (typeof comp.realmIndex === 'number' && comp.realmIndex >= 36) return 9;
  // Mặc định tính theo cảnh giới tu vi
  return Math.min(9, Math.max(1, Math.ceil((comp.realmIndex || 1) / 4)));
}

// =========================================================================
// KHO BIẾN CỐ MẪU (CANONICAL EVENT POOL)
// =========================================================================
export const DUAL_CULTIVATION_EVENTS_POOL: DualCultivationEvent[] = [
  // 1. TÂM ĐẦU Ý HỢP (Cơ duyên cực đại: Hảo Cảm >= 90, Ma Tính <= 30, Tier 9)
  {
    id: 'event_tam_dau_y_hop',
    title: 'Tâm Đầu Ý Hợp • Thiên Địa Huyền Cơ',
    narrative:
      'Trong tĩnh thất bế quan, sương khói ngưng tụ thành đóa sen thần, thanh hương tràn ngập. Ánh mắt Đạo Lữ Cửu Giai nhìn ngươi đong đầy nhu tình tuyệt đối. Hai luồng thuần dương - huyền âm chân khí tự động đan xen, dẫn phát cộng minh thiên địa. Trước mắt hai người, cánh cửa đại đạo hư vô bỗng hé mở, hiển lộ thiên cơ chí lý...',
    type: 'epiphany',
    minAffection: 90,
    maxDemonicNature: 30,
    requiredPartnerTier: 9,
    backgroundEffect: 'golden_zen',
    weight: 100,
    choices: [
      {
        id: 'choice_cung_cam_ngo_dai_dao',
        text: 'Cùng Cảm Ngộ Đại Đạo',
        description: 'Nhập định sâu vào Thái Hư cảnh giới, thu nạp lượng lớn tu vi đốn ngộ và lĩnh hội buff tốc độ tu luyện trong 24 giờ.',
        outcome: {
          type: 'breakthrough_tuvi',
          cultivationMultiplier: 3.0,
          tuviGain: 150000,
          affectionDelta: 5,
          demonicDelta: -5,
          appliedBuffId: 'buff_song_tu_don_ngo',
          logMessage:
            '🌸 [Tâm Đầu Ý Hợp] Ngươi cùng Đạo Lữ thần hồn giao cảm, cộng minh đại đạo! Nhận +150,000 Tu Vi đốn ngộ và kích hoạt hào quang [Đốn Ngộ Huyền Thông] tăng 30% tốc độ tu luyện trong 24 giờ!'
        }
      },
      {
        id: 'choice_duc_ket_am_duong_bon_nguyen',
        text: 'Đúc Kết Âm Dương Bổn Nguyên',
        description: 'Cô đọng tinh hoa tiên thể song phương, tẩy tủy phạt mao, vĩnh viễn tịnh hóa ma khí và gắn kết tình duyên.',
        outcome: {
          type: 'stat_boost',
          tuviGain: 60000,
          affectionDelta: 8,
          demonicDelta: -15,
          logMessage:
            '☯️ [Âm Dương Bổn Nguyên] Tiên khí thuần khiết tẩy luyện toàn bộ 108 khiếu huyệt! Ma tính tiêu trừ -15 điểm, hảo cảm cùng Đạo Lữ tăng vọt +8 điểm!'
        }
      }
    ]
  },

  // 2. HỘ PHÁP TRỪ MA (Cứu nạn tâm ma: Ma Tính >= 60, Hảo Cảm >= 70, Tier 9)
  {
    id: 'event_ho_phap_tru_ma',
    title: 'Hộ Pháp Trừ Ma • Băng Tâm Tịnh Hóa',
    narrative:
      'Chân khí vừa chuyển đến chu thiên thứ bảy, trong thức hải bỗng dâng lên ma vụ cuồn cuộn! Tâm ma hiện hình khiêu khích, dục niệm thiêu đốt kinh mạch khiến ngươi lung lay sắp tẩu hỏa nhập ma. Trong gang tấc sinh tử, Đạo Lữ Cửu Giai phát giác dị biến, lập tức bước tới vận chuyển bổn mạng thần thông, dùng tiên nguyên thuần khiết bao bọc che chở cho ngươi!',
    type: 'demonic_hazard',
    minAffection: 70,
    minDemonicNature: 60,
    requiredPartnerTier: 9,
    backgroundEffect: 'crimson_demonic',
    weight: 90,
    choices: [
      {
        id: 'choice_tinh_hoa_tien_khi',
        text: 'Nhờ Đạo Lữ Tịnh Hóa Bằng Tiên Khí',
        description: 'Đạo Lữ Cửu Giai hy sinh nguyên khí bản mệnh để hút ma khí trừ nạn, giúp ngươi giảm mạnh 40 Ma Tính nhưng nàng sẽ mệt mỏi cần nghỉ ngơi 2 giờ.',
        outcome: {
          type: 'cleanse_karma',
          demonicDelta: -40,
          affectionDelta: 5,
          partnerFatigue: 2 * 60 * 60 * 1000, // 2 giờ
          logMessage:
            '🛡️ [Hộ Pháp Trừ Ma] Đạo Lữ thi triển Tiên Thiên Bổn Mệnh Quyết gánh trọn ma khí phản phệ! Ma tính của ngươi giảm cực mạnh -40 điểm, nhưng nàng kiệt sức cần tĩnh dưỡng 2 giờ.'
        }
      },
      {
        id: 'choice_nghich_chuyen_ma_cong',
        text: 'Song Tu Nghịch Chuyển Ma Công',
        description: 'Không nỡ để Đạo Lữ chịu hao tổn, ngươi dốc toàn lực nghịch chuyển kinh mạch, biến hung hiểm thành cơ duyên tôi luyện thần thức.',
        condition: {
          minRealmIndex: 10
        },
        outcome: {
          type: 'breakthrough_tuvi',
          tuviGain: 80000,
          demonicDelta: -15,
          affectionDelta: 3,
          logMessage:
            '⚡ [Nghịch Chuyển Ma Công] Bằng ý chí sắt đá, ngươi cưỡng chế luyện hóa ma niệm thành tinh thuần linh lực! Nhận +80,000 Tu Vi và thanh lọc -15 Ma Tính!'
        }
      },
      {
        id: 'choice_thanh_tam_dan_tro_luc',
        text: 'Dùng Thanh Tâm Đan Trợ Lực Tịnh Hóa',
        description: 'Tiêu hao 1 viên Thanh Tâm Đan trong túi đồ, phối hợp cùng tiên khí của Đạo Lữ quét sạch ma khí mà không khiến nàng hao tổn nguyên khí.',
        condition: {
          requiredItemCost: {
            itemId: 'pill_thanh_tam_dan',
            count: 1,
            name: 'Thanh Tâm Đan'
          }
        },
        outcome: {
          type: 'cleanse_karma',
          demonicDelta: -50,
          affectionDelta: 10,
          partnerFatigue: 0,
          logMessage:
            '🌿 [Dược Lực Thanh Tâm] Dược lực Thanh Tâm Đan dung hòa cùng tiên quang, dập tắt tận gốc ma chướng! Ma tính giảm cực đại -50 điểm, Đạo Lữ vô cùng an lòng (Hảo cảm +10)!'
        }
      }
    ]
  },

  // 3. TÂM MA PHỆ HỒN (Tẩu hỏa nhập ma: Ma Tính >= 80, Hảo Cảm < 50, Tier 9)
  {
    id: 'event_tam_ma_phe_hon',
    title: 'Tâm Ma Phệ Hồn • Vạn Kiếp Trầm Luân',
    narrative:
      'Nghiệp chướng sâu dày, ma tính bộc phát mất kiểm soát! Hai mắt ngươi đỏ ngầu hung quang, sát khí cuồn cuộn định lao vào hủy diệt xung quanh. Đạo Lữ Cửu Giai ánh mắt ngập tràn bi thương và thất vọng, đành cắn răng kết ấn phong ấn các đại huyệt để cứu lấy sinh mạng ngươi...',
    type: 'demonic_hazard',
    minAffection: 0,
    maxAffection: 49,
    minDemonicNature: 80,
    maxDemonicNature: 100,
    requiredPartnerTier: 9,
    backgroundEffect: 'crimson_demonic',
    weight: 85,
    choices: [
      {
        id: 'choice_chap_nhan_phong_toa',
        text: 'Chấp Nhận Phong Tỏa Cứu Mạng',
        description: 'Chấp nhận để Đạo Lữ phong tỏa kinh mạch tiêu trừ ma hỏa, tán đi một phần tu vi để giữ vững tính mạng.',
        outcome: {
          type: 'breakthrough_tuvi',
          tuviGain: -50000,
          demonicDelta: -10,
          affectionDelta: -5,
          logMessage:
            '🩸 [Cưỡng Chế Phong Ấn] Đạo Lữ phong tỏa 36 đại huyệt trục xuất ma khí, ngươi tổn thất 50,000 Tu Vi, Đạo Lữ thở dài thất vọng (Hảo cảm -5)!'
        }
      },
      {
        id: 'choice_co_chap_khang_cu',
        text: 'Cố Chấp Kháng Cự Hung Khí',
        description: 'Điên cuồng phản kháng ấn chú phong tỏa, mặc cho ma khí cắn trả kinh mạch bản thân.',
        outcome: {
          type: 'breakthrough_tuvi',
          tuviGain: -100000,
          demonicDelta: 15,
          affectionDelta: -10,
          logMessage:
            '💥 [Ma Niệm Nghịch Phệ] Kháng cự phong ấn khiến đan điền chấn động dữ dội! Mất 100,000 Tu Vi, Ma tính tăng vọt +15 điểm, Đạo Lữ thất vọng xa cách (Hảo cảm -10)!'
        }
      }
    ]
  },

  // 4. LONG PHƯỢNG GIAO HÒA (Thần thông hiển thánh: Hảo Cảm >= 95, Ma Tính <= 40, Tier 9)
  {
    id: 'event_long_phuong_giao_hoa',
    title: 'Long Phượng Giao Hòa • Hào Quang Hộ Thể',
    narrative:
      'Duyên nợ tam sinh, tình nồng ý hợp đạt cảnh giới viên mãn cực hạn! Từ thiên linh cái của hai người, hư ảnh Chân Long và Thiên Phượng bay lượn vờn mây, tiếng hót vang vọng chín tầng trời. Hào quang âm dương hòa quyện giáng xuống một đạo hộ thân tiên bảo!',
    type: 'harmony',
    minAffection: 95,
    maxDemonicNature: 40,
    requiredPartnerTier: 9,
    backgroundEffect: 'yin_yang_flow',
    weight: 95,
    choices: [
      {
        id: 'choice_khai_mo_dong_tam_quang',
        text: 'Khai Mở Hào Quang Hộ Thể',
        description: 'Kích hoạt hào quang vĩnh cửu "Đạo Lữ Đồng Tâm Hộ Thể", tăng cường miễn thương và hút máu trong Bí Cảnh.',
        outcome: {
          type: 'gain_aura',
          tuviGain: 200000,
          affectionDelta: 5,
          demonicDelta: -15,
          appliedBuffId: 'buff_dong_tam_ho_the',
          logMessage:
            '✨ [Long Phượng Hòa Minh] Kích hoạt thành công [Đạo Lữ Đồng Tâm Hộ Thể]! Nhận +200,000 Tu Vi, thanh trừ -15 Ma Tính và nhận Hào Quang hộ thể vô song!'
        }
      },
      {
        id: 'choice_chuyen_hoa_ngoc_tuy',
        text: 'Chuyển Hóa Hóa Cảnh Chi Tủy',
        description: 'Hấp thụ trọn vẹn dị tượng Long Phượng ngưng tụ thành Chân Tinh bổ dưỡng, nâng tầm tu vi lên cực hạn.',
        outcome: {
          type: 'breakthrough_tuvi',
          tuviGain: 350000,
          affectionDelta: 3,
          demonicDelta: -5,
          logMessage:
            '🐉 [Long Phượng Chân Tinh] Dị tượng hóa thành ngọc tủy rót thẳng vào linh hải! Nhận đại lượng +350,000 Tu Vi đốn ngộ kinh thiên động địa!'
        }
      }
    ]
  }
];

// =========================================================================
// PURE FUNCTION: THẨM ĐỊNH & CHỌN LỌC BIẾN CỐ SONG TU
// =========================================================================
export function evaluateDualCultivationEvent(
  player: PlayerStats,
  partner: any,
  sessionTicks: number = 1,
  forceEventChance?: number
): DualCultivationEvent | null {
  // 1. Kiểm tra trạng thái nghỉ ngơi / kiệt sức của Đạo Lữ
  const now = Date.now();
  if (partner?.fatigueUntil && partner.fatigueUntil > now) {
    return null;
  }

  // 2. Tính toán xác suất kích hoạt cơ bản (mặc định 20% mỗi lần song tu)
  const eventChance = typeof forceEventChance === 'number' ? forceEventChance : 0.20;
  if (Math.random() > eventChance) {
    return null;
  }

  // 3. Chuẩn hóa chỉ số người chơi và đạo lữ
  const playerDemonic = typeof player.demonicNature === 'number'
    ? Math.max(0, Math.min(100, player.demonicNature))
    : 0;

  const partnerAffection = typeof partner?.affinity === 'number'
    ? Math.max(0, Math.min(100, partner.affinity))
    : 0;

  const partnerTier = getCompanionTier(partner);

  // 4. Lọc danh sách biến cố thỏa mãn điều kiện
  const eligibleEvents = DUAL_CULTIVATION_EVENTS_POOL.filter(event => {
    // Kiểm tra phẩm cấp đạo lữ
    if (partnerTier < event.requiredPartnerTier) return false;

    // Kiểm tra hảo cảm
    if (partnerAffection < event.minAffection) return false;
    if (event.maxAffection !== undefined && partnerAffection > event.maxAffection) return false;

    // Kiểm tra ma tính
    if (event.minDemonicNature !== undefined && playerDemonic < event.minDemonicNature) return false;
    if (event.maxDemonicNature !== undefined && playerDemonic > event.maxDemonicNature) return false;

    return true;
  });

  if (eligibleEvents.length === 0) {
    return null;
  }

  // 5. Thuật toán chọn theo trọng số (Weighted Selection)
  const totalWeight = eligibleEvents.reduce((acc, ev) => acc + (ev.weight || 50), 0);
  let randomVal = Math.random() * totalWeight;

  for (const event of eligibleEvents) {
    const weight = event.weight || 50;
    if (randomVal <= weight) {
      return event;
    }
    randomVal -= weight;
  }

  return eligibleEvents[0];
}

// =========================================================================
// HELPER: KIỂM TRA VÀ TIÊU TRỪ VẬT PHẨM TRONG TÚI ĐỒ (IMMUTABLE)
// =========================================================================
function checkAndConsumeInventoryItem(
  inventory: any,
  itemCost: { itemId: string; count: number; name: string }
): { hasItem: boolean; updatedInventory: any } {
  if (!inventory) {
    return { hasItem: false, updatedInventory: inventory };
  }

  // Duyệt các ngăn túi có thể chứa đan dược / vật phẩm
  const pills = Array.isArray(inventory.pills) ? [...inventory.pills.map((p: any) => ({ ...p }))] : [];
  const herbs = Array.isArray(inventory.herbs) ? [...inventory.herbs.map((h: any) => ({ ...h }))] : [];
  const ores = Array.isArray(inventory.ores) ? [...inventory.ores.map((o: any) => ({ ...o }))] : [];

  let remainingToDeduct = itemCost.count;

  // 1. Kiểm tra pills
  for (let i = 0; i < pills.length; i++) {
    const p = pills[i];
    const isMatch = p.id === itemCost.itemId || (p.name && p.name.toLowerCase().includes(itemCost.name.toLowerCase()));
    if (isMatch) {
      const available = p.quantity || 1;
      if (available >= remainingToDeduct) {
        p.quantity = available - remainingToDeduct;
        remainingToDeduct = 0;
        break;
      } else {
        remainingToDeduct -= available;
        p.quantity = 0;
      }
    }
  }

  // 2. Nếu còn thiếu, kiểm tra herbs
  if (remainingToDeduct > 0) {
    for (let i = 0; i < herbs.length; i++) {
      const h = herbs[i];
      const isMatch = h.id === itemCost.itemId || (h.name && h.name.toLowerCase().includes(itemCost.name.toLowerCase()));
      if (isMatch) {
        const available = h.quantity || 1;
        if (available >= remainingToDeduct) {
          h.quantity = available - remainingToDeduct;
          remainingToDeduct = 0;
          break;
        } else {
          remainingToDeduct -= available;
          h.quantity = 0;
        }
      }
    }
  }

  // 3. Nếu còn thiếu, kiểm tra ores
  if (remainingToDeduct > 0) {
    for (let i = 0; i < ores.length; i++) {
      const o = ores[i];
      const isMatch = o.id === itemCost.itemId || (o.name && o.name.toLowerCase().includes(itemCost.name.toLowerCase()));
      if (isMatch) {
        const available = o.quantity || 1;
        if (available >= remainingToDeduct) {
          o.quantity = available - remainingToDeduct;
          remainingToDeduct = 0;
          break;
        } else {
          remainingToDeduct -= available;
          o.quantity = 0;
        }
      }
    }
  }

  if (remainingToDeduct > 0) {
    // Không đủ số lượng yêu cầu
    return { hasItem: false, updatedInventory: inventory };
  }

  return {
    hasItem: true,
    updatedInventory: {
      ...inventory,
      pills: pills.filter((p: any) => (p.quantity || 0) > 0),
      herbs: herbs.filter((h: any) => (h.quantity || 0) > 0),
      ores: ores.filter((o: any) => (o.quantity || 0) > 0)
    }
  };
}

// =========================================================================
// PURE FUNCTION: GIẢI QUYẾT KẾT QUẢ LỰA CHỌN BIẾN CỐ (CHOICE RESOLUTION)
// =========================================================================
export function resolveEventChoice(
  player: PlayerStats,
  partner: CompanionWithState,
  event: DualCultivationEvent,
  choiceId: string
): DualEventResolutionResult {
  const choice = event.choices.find(c => c.id === choiceId);
  if (!choice) {
    return {
      updatedPlayer: player,
      updatedPartner: partner,
      resultLog: 'Lựa chọn không hợp lệ hoặc đã hết hiệu lực!',
      success: false
    };
  }

  // 1. Kiểm tra điều kiện tiên quyết (Conditions Guard)
  if (choice.condition) {
    const cond = choice.condition;
    if (cond.minRealmIndex !== undefined && (player.currentRealm || 0) < cond.minRealmIndex) {
      return {
        updatedPlayer: player,
        updatedPartner: partner,
        resultLog: `Cảnh giới chưa đủ! Cần tối thiểu cảnh giới index ${cond.minRealmIndex}.`,
        success: false
      };
    }

    if (cond.minAffection !== undefined && (partner.affinity || 0) < cond.minAffection) {
      return {
        updatedPlayer: player,
        updatedPartner: partner,
        resultLog: `Hảo cảm không đủ! Cần tối thiểu ${cond.minAffection} điểm Hảo Cảm.`,
        success: false
      };
    }

    if (cond.maxDemonicNature !== undefined && (player.demonicNature || 0) > cond.maxDemonicNature) {
      return {
        updatedPlayer: player,
        updatedPartner: partner,
        resultLog: `Ma tính quá cao! Yêu cầu Ma Tính không vượt quá ${cond.maxDemonicNature}.`,
        success: false
      };
    }

    if (cond.requiredItemCost) {
      const checkRes = checkAndConsumeInventoryItem(player.inventory, cond.requiredItemCost);
      if (!checkRes.hasItem) {
        return {
          updatedPlayer: player,
          updatedPartner: partner,
          resultLog: `Không đủ [${cond.requiredItemCost.name}]! Cần ${cond.requiredItemCost.count} viên/cái trong túi đồ.`,
          success: false
        };
      }
    }
  }

  // 2. Sao chép bất biến trạng thái (Immutable Cloning)
  let updatedPlayer: PlayerStats = { ...player };
  let updatedPartner: CompanionWithState = { ...partner };

  // 3. Khấu trừ vật phẩm nếu có
  if (choice.condition?.requiredItemCost) {
    const consumeRes = checkAndConsumeInventoryItem(player.inventory, choice.condition.requiredItemCost);
    if (consumeRes.hasItem) {
      updatedPlayer.inventory = consumeRes.updatedInventory;
    }
  }

  // 4. Áp dụng biến động Tu Vi
  if (choice.outcome.tuviGain !== undefined) {
    const currentTuVi = updatedPlayer.tuVi || 0;
    const finalTuViGain = choice.outcome.cultivationMultiplier
      ? Math.round(choice.outcome.tuviGain * choice.outcome.cultivationMultiplier)
      : choice.outcome.tuviGain;
    updatedPlayer.tuVi = Math.max(0, currentTuVi + finalTuViGain);
  }

  // 5. Áp dụng biến động Ma Tính (Demonic Nature Clamping [0, 100])
  const currentDemonic = typeof updatedPlayer.demonicNature === 'number' ? updatedPlayer.demonicNature : 0;
  const demonicDelta = choice.outcome.demonicDelta || 0;
  const newDemonic = Math.max(0, Math.min(100, currentDemonic + demonicDelta));
  updatedPlayer.demonicNature = newDemonic;

  // 6. Áp dụng biến động Hảo Cảm (Affection Clamping [0, 100])
  const currentAffection = typeof updatedPartner.affinity === 'number' ? updatedPartner.affinity : 0;
  const affectionDelta = choice.outcome.affectionDelta || 0;
  const newAffection = Math.max(0, Math.min(100, currentAffection + affectionDelta));
  updatedPartner.affinity = newAffection;

  // 7. Áp dụng trạng thái mệt mỏi / nghỉ ngơi của Đạo Lữ (Fatigue)
  if (choice.outcome.partnerFatigue && choice.outcome.partnerFatigue > 0) {
    updatedPartner.fatigueUntil = Date.now() + choice.outcome.partnerFatigue;
  }

  // 8. Tăng số lần đốn ngộ nếu sự kiện thuộc loại đốn ngộ/giao hòa
  if (event.type === 'epiphany' || event.type === 'harmony') {
    updatedPartner.totalEpiphanies = (updatedPartner.totalEpiphanies || 0) + 1;
  }

  // 9. Gia trì Buff & Hào Quang (Applied Buffs / Aura)
  if (choice.outcome.appliedBuffId) {
    const buffId = choice.outcome.appliedBuffId;
    const buffDuration = 24 * 60 * 60 * 1000; // 24 giờ
    updatedPlayer.activeBuffs = {
      ...(updatedPlayer.activeBuffs || {}),
      [buffId]: true,
      [`${buffId}Until`]: Date.now() + buffDuration
    };

    if (buffId === 'buff_dong_tam_ho_the') {
      updatedPlayer.protectiveAuraActive = true;
    }
  }

  // 10. Ghi chép lịch sử biến cố (Dual Events History)
  const historyRecord: DualEventHistoryRecord = {
    id: `dual_ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    eventId: event.id,
    eventTitle: event.title,
    choiceId: choice.id,
    partnerId: partner.id,
    partnerName: partner.name,
    timestamp: Date.now(),
    logMessage: choice.outcome.logMessage,
    demonicDelta: choice.outcome.demonicDelta,
    affectionDelta: choice.outcome.affectionDelta
  };

  const oldHistory = Array.isArray(updatedPlayer.dualEventsHistory) ? updatedPlayer.dualEventsHistory : [];
  updatedPlayer.dualEventsHistory = [historyRecord, ...oldHistory].slice(0, 50);
  updatedPlayer.lastDualEventTimestamp = Date.now();

  // 11. Đồng bộ ngược vào player.companionsState
  if (updatedPlayer.companionsState && updatedPlayer.companionsState.companions) {
    const currentComps = { ...updatedPlayer.companionsState.companions };
    const curCompState = currentComps[partner.id] || { id: partner.id, affinity: 0, isBonded: true };

    currentComps[partner.id] = {
      ...curCompState,
      affinity: newAffection,
      fatigueUntil: updatedPartner.fatigueUntil ?? (curCompState.fatigueUntil || 0),
      totalEpiphanies: updatedPartner.totalEpiphanies ?? (curCompState.totalEpiphanies || 0)
    };

    updatedPlayer.companionsState = {
      ...updatedPlayer.companionsState,
      companions: currentComps
    };
  }

  return {
    updatedPlayer,
    updatedPartner,
    resultLog: choice.outcome.logMessage,
    success: true,
    consumedItem: choice.condition?.requiredItemCost
  };
}
