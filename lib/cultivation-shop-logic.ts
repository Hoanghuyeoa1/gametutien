// lib/cultivation-shop-logic.ts
// Pure Business Logic: Quản lý kích hoạt, tích lũy và áp dụng hiệu ứng của Vật Phẩm Tu Luyện (Tier 1 -> Tier 9)

import { PlayerStats } from './types/player';
import { CultivationShopItem, ActiveCultivationArrayBuff, PlayerCultivationBuffState } from './types/cultivation-shop';
import { CULTIVATION_SHOP_ITEMS_MAP, getCultivationShopPermanentSpeedBonus } from './cultivation-shop-data';

export interface UseCultivationItemResult {
  success: boolean;
  message: string;
  updatedPlayer: PlayerStats;
  logType?: 'cultivation' | 'system' | 'breakthrough';
}

/**
 * Quét dọn các buff trận bàn đã quá hạn
 */
export function cleanExpiredCultivationArrays(
  arrays: ActiveCultivationArrayBuff[] = [],
  now: number = Date.now()
): ActiveCultivationArrayBuff[] {
  if (!Array.isArray(arrays)) return [];
  return arrays.filter((arr) => arr && (arr.isPermanent || arr.expiresAt === Infinity || arr.expiresAt > now));
}

/**
 * Tổng hợp toàn bộ buff tu luyện đang có hiệu lực (Trận Bàn + Tâm Pháp)
 */
export function calculateActiveCultivationBuffs(
  buffState: PlayerCultivationBuffState | undefined,
  now: number = Date.now()
): {
  totalArraySpeedPercent: number;
  activeArrays: ActiveCultivationArrayBuff[];
  permanentManualSpeedPercent: number;
  totalSpeedBonusPercent: number;
} {
  if (!buffState) {
    return {
      totalArraySpeedPercent: 0,
      activeArrays: [],
      permanentManualSpeedPercent: 0,
      totalSpeedBonusPercent: 0,
    };
  }

  // 1. Trận bàn còn hạn
  const validArrays = cleanExpiredCultivationArrays(buffState.activeArrays || [], now);
  const totalArraySpeedPercent = validArrays.reduce((sum, arr) => sum + (arr.tuViSpeedPercent || 0), 0);

  // 2. Tâm pháp đã giác ngộ
  const permanentManualSpeedPercent = Math.round(
    getCultivationShopPermanentSpeedBonus(buffState.learnedManualIds || []) * 100
  );

  return {
    totalArraySpeedPercent,
    activeArrays: validArrays,
    permanentManualSpeedPercent,
    totalSpeedBonusPercent: totalArraySpeedPercent + permanentManualSpeedPercent,
  };
}

/**
 * Hàm Pure Logic xử lý việc sử dụng/lĩnh ngộ vật phẩm tu luyện
 */
export function useCultivationShopItem(
  player: PlayerStats,
  itemOrId: CultivationShopItem | string,
  quantity: number = 1
): UseCultivationItemResult {
  const item: CultivationShopItem | undefined =
    typeof itemOrId === 'string' ? CULTIVATION_SHOP_ITEMS_MAP.get(itemOrId) : itemOrId;

  if (!item) {
    return {
      success: false,
      message: 'Không tìm thấy thông tin vật phẩm tu luyện tương ứng!',
      updatedPlayer: player,
    };
  }

  // 1. Kiểm tra Cảnh Giới tối thiểu
  const currentRealm = player.currentRealm || 0;
  if (currentRealm < item.requiredRealmIndex) {
    return {
      success: false,
      message: `Cảnh giới chưa đủ để hấp thu bảo vật này! Cần đạt tối thiểu [${item.requiredRealmName}].`,
      updatedPlayer: player,
    };
  }

  const now = Date.now();
  const currentBuffState: PlayerCultivationBuffState = {
    activeArrays: cleanExpiredCultivationArrays(player.cultivationBuffState?.activeArrays || [], now),
    learnedManualIds: Array.isArray(player.cultivationBuffState?.learnedManualIds)
      ? [...player.cultivationBuffState.learnedManualIds]
      : [],
    meditationEfficiencyModifier: player.cultivationBuffState?.meditationEfficiencyModifier || 0,
  };

  const updatedPlayer: PlayerStats = {
    ...player,
    cultivationBuffState: currentBuffState,
  };

  // 2. Xử lý theo từng nhóm danh mục
  switch (item.category) {
    case 'manual': {
      // Tâm Pháp Thổ Nạp: Tăng vĩnh viễn tốc độ tu vi cơ bản (Chỉ học 1 lần)
      if (currentBuffState.learnedManualIds.includes(item.id)) {
        return {
          success: false,
          message: `Đã lĩnh ngộ tâm pháp [${item.name}], không thể học trùng lặp!`,
          updatedPlayer: player,
        };
      }

      currentBuffState.learnedManualIds.push(item.id);
      const bonusPct = item.effects.permanentTuViSpeedPercent || 0;

      return {
        success: true,
        message: `Lĩnh ngộ thành công [${item.name}]! Tốc độ hấp thu thiên địa linh khí cơ bản tăng vĩnh viễn +${bonusPct}%.`,
        updatedPlayer,
        logType: 'cultivation',
      };
    }

    case 'array': {
      // Tụ Linh Trận Bàn: Kích hoạt buff tốc độ có thời hạn
      const durationHours = (item.effects.durationHours || 24) * quantity;
      const durationMs = durationHours * 3600 * 1000;
      const speedPct = item.effects.temporaryTuViSpeedPercent || 10;

      const existingIndex = currentBuffState.activeArrays.findIndex((a) => a.itemId === item.id);
      if (existingIndex >= 0) {
        // Gia hạn thời gian nếu đang kích hoạt
        const currentExp = currentBuffState.activeArrays[existingIndex].expiresAt;
        const newExp = Math.max(now, currentExp) + durationMs;
        currentBuffState.activeArrays[existingIndex].expiresAt = newExp;
      } else {
        // Tạo mới buff trận bàn
        currentBuffState.activeArrays.push({
          itemId: item.id,
          name: item.name,
          tuViSpeedPercent: speedPct,
          expiresAt: now + durationMs,
        });
      }

      return {
        success: true,
        message: `Bố trí thành công [${item.name}]! Linh mạch bộc phát gia tăng +${speedPct}% tốc độ tu vi trong ${durationHours} giờ.`,
        updatedPlayer,
        logType: 'cultivation',
      };
    }

    case 'essence': {
      // Linh Tủy Tinh Hoa: Tăng hiệu suất bế quan ngoại tuyến
      const bonusPerUnit = item.effects.meditationEfficiencyBonus || 5;
      const totalBonus = bonusPerUnit * quantity;
      currentBuffState.meditationEfficiencyModifier += totalBonus;

      // Nếu có giảm nguy cơ tâm ma / tăng tâm cảnh
      if (item.effects.tamCanhBonus) {
        updatedPlayer.tamCanh = (updatedPlayer.tamCanh || 0) + item.effects.tamCanhBonus * quantity;
      }

      return {
        success: true,
        message: `Luyện hóa thành công ${quantity > 1 ? `${quantity} giọt ` : ''}[${item.name}]! Hiệu suất bế quan tăng thêm +${totalBonus}%.`,
        updatedPlayer,
        logType: 'cultivation',
      };
    }

    case 'incense': {
      // Ngộ Đạo Hương / Trà: Tăng vĩnh viễn Tâm Cảnh, Ngộ Tính và kích hoạt dị tượng
      const tamCanhGain = (item.effects.tamCanhBonus || 0) * quantity;
      const ngoTinhGain = (item.effects.permanentNgoTinh || 0) * quantity;

      if (tamCanhGain > 0) {
        updatedPlayer.tamCanh = (updatedPlayer.tamCanh || 0) + tamCanhGain;
      }
      if (ngoTinhGain > 0) {
        updatedPlayer.ngoTinh = (updatedPlayer.ngoTinh || 0) + ngoTinhGain;
      }

      let extraMsg = '';
      if (item.effects.specialPhenomenon) {
        extraMsg = ` Kích hoạt dị tượng [${item.effects.specialPhenomenon}] rực sáng thương khung!`;
      }

      return {
        success: true,
        message: `Thưởng hương/uống trà [${item.name}] viên mãn! Tâm Cảnh +${tamCanhGain}, Ngộ Tính +${ngoTinhGain}.${extraMsg}`,
        updatedPlayer,
        logType: 'cultivation',
      };
    }

    default:
      return {
        success: false,
        message: 'Loại vật phẩm tu luyện không hợp lệ!',
        updatedPlayer: player,
      };
  }
}
