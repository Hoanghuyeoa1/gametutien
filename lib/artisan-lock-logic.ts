// lib/artisan-lock-logic.ts
// Ma Trận Khóa Tứ Đại Bách Nghệ (Đan • Khí • Trận • Phù) Theo Cảnh Giới Khí Tu

/**
 * 1. BẢNG MA TRẬN GIỚI HẠN (ARTISAN REALM LOCK MATRIX)
 * - Phàm Nhân & Luyện Khí (0 – 10): Giai 1 (Nhất Giai)
 * - Trúc Cơ (11 – 15): Giai 2 (Nhị Giai)
 * - Kim Đan (16 – 20): Giai 3 (Tam Giai)
 * - Nguyên Anh (21 – 25): Giai 4 (Tứ Giai)
 * - Hóa Thần (26 – 30): Giai 5 (Ngũ Giai)
 * - Luyện Hư (31 – 35): Giai 6 (Lục Giai)
 * - Hợp Thể (36 – 40): Giai 7 (Thất Giai)
 * - Đại Thừa – Độ Kiếp (41 – 50): Giai 8 (Bát Giai)
 * - Tiên Giới – Đế Cảnh (51 – 104): Giai 9 (Cửu Giai / Thần Giai)
 */
export function getMaxArtisanTierForRealm(realmIndex: number = 0): number {
  if (realmIndex <= 10) return 1;
  if (realmIndex <= 15) return 2;
  if (realmIndex <= 20) return 3;
  if (realmIndex <= 25) return 4;
  if (realmIndex <= 30) return 5;
  if (realmIndex <= 35) return 6;
  if (realmIndex <= 40) return 7;
  if (realmIndex <= 50) return 8;
  return 9;
}

/**
 * Trả về tên cảnh giới yêu cầu tối thiểu cho một Tier mục tiêu
 */
export function getRequiredRealmNameForArtisanTier(targetTier: number): string {
  switch (targetTier) {
    case 1:
      return 'Luyện Khí';
    case 2:
      return 'Trúc Cơ';
    case 3:
      return 'Kim Đan';
    case 4:
      return 'Nguyên Anh';
    case 5:
      return 'Hóa Thần';
    case 6:
      return 'Luyện Hư';
    case 7:
      return 'Hợp Thể';
    case 8:
      return 'Đại Thừa';
    case 9:
      return 'Tiên Giới';
    default:
      return targetTier > 9 ? 'Tiên Giới' : 'Luyện Khí';
  }
}

/**
 * Chuyển đổi tên Phẩm giai / Cấp bậc sang số Tier (1 -> 9)
 */
export function parseGradeToTier(gradeOrTier?: string | number): number {
  if (typeof gradeOrTier === 'number') {
    if (isNaN(gradeOrTier) || gradeOrTier <= 0) return 1;
    return Math.min(9, Math.max(1, Math.floor(gradeOrTier)));
  }

  if (!gradeOrTier) return 1;

  const str = String(gradeOrTier).trim().toLowerCase();

  // Nhất Giai / Phàm Khí / Giai 1
  if (str.includes('nhất') || str.includes('phàm khí') || str === '1' || str.includes('giai 1')) return 1;
  // Nhị Giai / Linh Khí / Giai 2
  if (str.includes('nhị') || str.includes('linh khí') || str === '2' || str.includes('giai 2')) return 2;
  // Tam Giai / Bảo Khí / Giai 3
  if (str.includes('tam') || str.includes('bảo khí') || str === '3' || str.includes('giai 3')) return 3;
  // Tứ Giai / Cổ Bảo / Giai 4
  if (str.includes('tứ') || str.includes('cổ bảo') || str === '4' || str.includes('giai 4')) return 4;
  // Ngũ Giai / Giai 5
  if (str.includes('ngũ') || str === '5' || str.includes('giai 5')) return 5;
  // Lục Giai / Tiên Thiên Linh Bảo / Giai 6
  if (str.includes('lục') || str.includes('tiên thiên linh bảo') || str === '6' || str.includes('giai 6')) return 6;
  // Thất Giai / Giai 7
  if (str.includes('thất') || str === '7' || str.includes('giai 7')) return 7;
  // Bát Giai / Giai 8
  if (str.includes('bát') || str === '8' || str.includes('giai 8')) return 8;
  // Cửu Giai / Thần Giai / Thần Phẩm / Giai 9
  if (str.includes('cửu') || str.includes('thần') || str === '9' || str.includes('giai 9')) return 9;

  return 1;
}

/**
 * Kiểm tra xem một tier vật phẩm có thể được chế tác ở cảnh giới tu vi hiện tại hay không
 */
export function canCraftItemByRealm(
  playerRealm: number = 0,
  itemTier: number = 1
): { canCraft: boolean; isLocked: boolean; requiredRealmName: string; reason?: string } {
  const maxTier = getMaxArtisanTierForRealm(playerRealm);
  const isLocked = itemTier > maxTier;
  const requiredRealmName = getRequiredRealmNameForArtisanTier(itemTier);

  if (isLocked) {
    return {
      canCraft: false,
      isLocked: true,
      requiredRealmName,
      reason: `Đạo hữu cảnh giới chưa đủ, cần đạt [${requiredRealmName}] để chế tác vật phẩm giai vị này!`
    };
  }

  return {
    canCraft: true,
    isLocked: false,
    requiredRealmName,
    reason: undefined
  };
}

/**
 * Kiểm tra điều kiện chế tác cho từng phân hệ bách nghệ (Dual-Lock 1: Crafting Tier Lock)
 */
export function checkArtisanCraftRequirement(
  realmIndex: number = 0,
  recipeTierOrGrade: number | string = 1
): { canCraft: boolean; isLocked: boolean; isLockedByRealm: boolean; requiredRealmName: string; reason?: string } {
  const targetTier = parseGradeToTier(recipeTierOrGrade);
  const result = canCraftItemByRealm(realmIndex, targetTier);
  return {
    ...result,
    isLockedByRealm: result.isLocked,
  };
}

/**
 * Kiểm tra điều kiện thăng cấp bậc danh xưng bách nghệ (Dual-Lock 2: Rank Upgrade Lock)
 */
export function checkArtisanPromotionRequirement(
  realmIndex: number = 0,
  currentArtisanLevel: number = 1
): { canPromote: boolean; isLockedByRealm: boolean; requiredRealmName: string; reason?: string } {
  const nextLevel = currentArtisanLevel + 1;
  const maxTier = getMaxArtisanTierForRealm(realmIndex);
  const isLockedByRealm = nextLevel > maxTier;
  const requiredRealmName = getRequiredRealmNameForArtisanTier(nextLevel);

  if (isLockedByRealm) {
    return {
      canPromote: false,
      isLockedByRealm: true,
      requiredRealmName,
      reason: `🔒 Đạo nghiệp chạm trần (Cần đạt [${requiredRealmName}] để thăng giai)`
    };
  }

  return {
    canPromote: true,
    isLockedByRealm: false,
    requiredRealmName,
    reason: undefined
  };
}
